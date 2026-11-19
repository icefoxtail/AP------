const { test } = require('node:test');
const assert = require('node:assert/strict');
const Source = require('../archive/archive2-source.js');

// restore() reads the exam JS files a selection touches at most FETCH_CONCURRENCY at a time.
// Verification (file SHA, fingerprint, UID) and error reporting are unchanged, so the result and the
// error equal the serial run (`concurrency: 1`), and a single bad file never changes the others.
// The caches are module-level and keyed by base URL, so every test uses its own base URL.

const bankJs = (tag, count) =>
  'window.questionBank = [' + Array.from({ length: count }, (_, i) =>
    `{ content: '${tag} Q${i + 1}', choices: ['1','2','3','4'], answer: '1', solution: 's${i + 1}', image: null }`).join(',') + '];';

async function buildFixture(prefix, fileCount, perFile = 2) {
  const files = [];
  const records = [];
  const hashes = [];
  const sources = new Map();
  for (let f = 0; f < fileCount; f += 1) {
    const file = `${prefix}/exam_${String(f).padStart(2, '0')}.js`;
    const js = bankJs(file, perFile);
    const bank = Source.evaluate(js, file);
    files.push(file);
    sources.set(file, js);
    hashes.push([file, await Source.digest(js)]);
    for (let o = 1; o <= perFile; o += 1) {
      records.push({
        sourceFile: file, sourceOrdinal: o, sourceQuestionNo: o,
        sourceFingerprint: await Source.fingerprint(bank[o - 1]),
        questionUid: 'qid_v1_' + (await Source.digest(file + '#' + o)),
        year: '2022', school: '테스트고',
      });
    }
  }
  return { files, records, catalog: { sourceHashes: hashes }, sources };
}

// delayMs: per-request latency. peak: highest number of requests in flight at once.
function makeFetcher(sources, { delayMs = 0, missing = new Set(), delays = new Map(), override = new Map() } = {}) {
  const stats = { inFlight: 0, peak: 0, urls: [] };
  const fetcher = async (url) => {
    const file = [...sources.keys()].find((name) => decodeURIComponent(new URL(url).pathname).endsWith('/exams/' + name));
    stats.urls.push(file);
    stats.inFlight += 1;
    stats.peak = Math.max(stats.peak, stats.inFlight);
    try {
      await new Promise((resolve) => setTimeout(resolve, delays.get(file) ?? delayMs));
      if (missing.has(file)) return { ok: false, status: 404, text: async () => '' };
      const text = override.get(file) ?? sources.get(file);
      return { ok: true, status: 200, text: async () => text };
    } finally {
      stats.inFlight -= 1;
    }
  };
  return { fetcher, stats };
}

const summarize = (error) => ({
  message: error.message,
  detail: error.apDetail ? { file: error.apDetail.file, code: error.apDetail.code, questionNo: error.apDetail.questionNo, uid: error.apDetail.uid } : null,
  failures: (error.apDetail?.failures || []).map((row) => ({ file: row.file, code: row.code, questionNo: row.questionNo })),
});

async function outcome(run) {
  try { return { value: await run() }; } catch (error) { return { error: summarize(error) }; }
}

test('FETCH_CONCURRENCY is 6', () => {
  assert.equal(Source.FETCH_CONCURRENCY, 6);
});

test('restore: same result as the serial run, in record order, every file requested once', async () => {
  const fixture = await buildFixture('par-same', 30);
  const records = [...fixture.records].reverse(); // list order differs from file order
  const serialBase = 'http://par-same-serial.test/';
  const parallelBase = 'http://par-same-parallel.test/';
  const serial = await Source.restore(records, fixture.catalog, { baseUrl: serialBase, fetcher: makeFetcher(fixture.sources).fetcher, concurrency: 1 });
  const { fetcher, stats } = makeFetcher(fixture.sources, { delayMs: 3 });
  const parallel = await Source.restore(records, fixture.catalog, { baseUrl: parallelBase, fetcher });
  assert.deepEqual(parallel, serial);
  assert.deepEqual(parallel.map((q) => q.questionUid), records.map((r) => r.questionUid));
  assert.equal(stats.urls.length, 30);
  assert.equal(new Set(stats.urls).size, 30, 'a file is never requested twice');
  // Asking again hits the cache: no new request.
  await Source.restore(records, fixture.catalog, { baseUrl: parallelBase, fetcher });
  assert.equal(stats.urls.length, 30);
});

test('restore: never more than 6 requests in flight, and the wall clock drops against the serial run', async () => {
  const fixture = await buildFixture('par-speed', 30);
  const serialRun = makeFetcher(fixture.sources, { delayMs: 50 });
  const t0 = Date.now();
  await Source.restore(fixture.records, fixture.catalog, { baseUrl: 'http://par-speed-serial.test/', fetcher: serialRun.fetcher, concurrency: 1 });
  const serialMs = Date.now() - t0;
  const parallelRun = makeFetcher(fixture.sources, { delayMs: 50 });
  const t1 = Date.now();
  await Source.restore(fixture.records, fixture.catalog, { baseUrl: 'http://par-speed-parallel.test/', fetcher: parallelRun.fetcher });
  const parallelMs = Date.now() - t1;
  console.log(`# 30 files x 50ms: serial ${serialMs}ms, parallel ${parallelMs}ms (peak in flight ${parallelRun.stats.peak})`);
  assert.equal(serialRun.stats.peak, 1);
  assert.ok(parallelRun.stats.peak <= 6, 'peak in flight ' + parallelRun.stats.peak);
  assert.ok(parallelRun.stats.peak >= 2, 'requests overlap');
  assert.ok(parallelMs * 2 < serialMs, `parallel ${parallelMs}ms should be well below serial ${serialMs}ms`);
});

test('restore: a caller cannot raise the limit above 6', async () => {
  const fixture = await buildFixture('par-cap', 20);
  const { fetcher, stats } = makeFetcher(fixture.sources, { delayMs: 5 });
  await Source.restore(fixture.records, fixture.catalog, { baseUrl: 'http://par-cap.test/', fetcher, concurrency: 50 });
  assert.ok(stats.peak <= 6 && stats.peak >= 2, 'peak ' + stats.peak);
});

const tamperCases = {
  'file SHA mismatch': (fixture) => ({ override: new Map([[fixture.files[7], bankJs('changed file', 2)]]) }),
  'file missing (404)': (fixture) => ({ missing: new Set([fixture.files[7]]) }),
  'fingerprint mismatch': (fixture) => {
    // The listed hash matches the served file, but the question content differs from the recorded fingerprint.
    const changed = bankJs('changed question', 2);
    fixture.sources.set(fixture.files[7], changed);
    return { rehash: [fixture.files[7], changed] };
  },
  'UID mismatch': (fixture) => {
    fixture.records.find((r) => r.sourceFile === fixture.files[7] && r.sourceOrdinal === 2).questionUid = 'qid_v1_' + 'a'.repeat(64);
    return {};
  },
};

for (const [label, setup] of Object.entries(tamperCases)) {
  test(`restore: ${label} is caught with the same error as the serial run`, async () => {
    const slug = label.replace(/\W+/g, '-');
    const fixture = await buildFixture('par-neg-' + slug, 12);
    const extra = setup(fixture);
    if (extra.rehash) {
      const [file, js] = extra.rehash;
      const index = fixture.catalog.sourceHashes.findIndex(([name]) => name === file);
      fixture.catalog.sourceHashes[index] = [file, await Source.digest(js)];
    }
    const serialRun = makeFetcher(fixture.sources, { ...extra, delayMs: 2 });
    const parallelRun = makeFetcher(fixture.sources, { ...extra, delayMs: 2 });
    const serial = await outcome(() => Source.restore(fixture.records, fixture.catalog, { baseUrl: `http://par-neg-${slug}-s.test/`, fetcher: serialRun.fetcher, concurrency: 1 }));
    const parallel = await outcome(() => Source.restore(fixture.records, fixture.catalog, { baseUrl: `http://par-neg-${slug}-p.test/`, fetcher: parallelRun.fetcher }));
    assert.ok(serial.error, 'serial run must reject');
    assert.ok(parallel.error, 'parallel run must reject');
    assert.deepEqual(parallel.error, serial.error);
    assert.ok(parallelRun.stats.peak <= 6);
  });
}

test('restore: one failing file does not change the other files; a later run reuses their cached results', async () => {
  const fixture = await buildFixture('par-one', 20);
  const bad = fixture.files[4];
  const { fetcher, stats } = makeFetcher(fixture.sources, { delayMs: 3, missing: new Set([bad]) });
  const base = 'http://par-one.test/';
  const result = await outcome(() => Source.restore(fixture.records, fixture.catalog, { baseUrl: base, fetcher }));
  assert.equal(result.error.detail.file, bad, 'the error names the failing exam');
  assert.match(result.error.message, /원본 로드 실패 \(404\)/);
  const goodRecords = fixture.records.filter((r) => r.sourceFile !== bad);
  const before = stats.urls.length;
  const restored = await Source.restore(goodRecords, fixture.catalog, { baseUrl: base, fetcher });
  assert.equal(restored.length, goodRecords.length);
  // Only files that had not been started when the failure stopped the pool are requested now; none twice.
  const successfulBefore = stats.urls.slice(0, before).filter((file) => file !== bad);
  const requestedAgain = stats.urls.slice(before);
  for (const file of requestedAgain) assert.ok(!successfulBefore.includes(file), file + ' was requested twice');
  const serial = await Source.restore(goodRecords, fixture.catalog, { baseUrl: 'http://par-one-serial.test/', fetcher: makeFetcher(fixture.sources).fetcher, concurrency: 1 });
  assert.deepEqual(restored, serial);
});

test('restore: with several failing files the error is the first one in list order, as in the serial run', async () => {
  const fixture = await buildFixture('par-order', 14);
  // The later file (index 9) fails fast, the earlier one (index 3) fails slowly.
  const options = {
    missing: new Set([fixture.files[3], fixture.files[9]]),
    delays: new Map([[fixture.files[3], 40], [fixture.files[9], 1]]),
    delayMs: 5,
  };
  const serial = await outcome(() => Source.restore(fixture.records, fixture.catalog, { baseUrl: 'http://par-order-s.test/', fetcher: makeFetcher(fixture.sources, options).fetcher, concurrency: 1 }));
  const parallel = await outcome(() => Source.restore(fixture.records, fixture.catalog, { baseUrl: 'http://par-order-p.test/', fetcher: makeFetcher(fixture.sources, options).fetcher }));
  assert.equal(serial.error.detail.file, fixture.files[3]);
  assert.deepEqual(parallel.error, serial.error);
});

test('restore: a missing expected SHA is reported for the first such file when requireSourceHash is set', async () => {
  const fixture = await buildFixture('par-hash', 10);
  fixture.catalog.sourceHashes = fixture.catalog.sourceHashes.filter(([name]) => name !== fixture.files[5] && name !== fixture.files[8]);
  const opts = (base, extra = {}) => ({ baseUrl: base, fetcher: makeFetcher(fixture.sources, { delayMs: 2 }).fetcher, requireSourceHash: true, ...extra });
  // Hashes that remain are not 64 hex digits only if absent; the fixture digests are 64 hex, so only the removed ones fail.
  const serial = await outcome(() => Source.restore(fixture.records, fixture.catalog, opts('http://par-hash-s.test/', { concurrency: 1 })));
  const parallel = await outcome(() => Source.restore(fixture.records, fixture.catalog, opts('http://par-hash-p.test/')));
  assert.equal(serial.error.detail.file, fixture.files[5]);
  assert.deepEqual(parallel.error, serial.error);
});
