'use strict';
// Catalog shards, stage 2-2: the screen-side loader (archive/archive2-catalog-shards.js createLoader). The loader runs here against a fake
// network that serves the REAL built shards, so what is checked is what a browser would assemble: the same records and exams as the whole
// catalog for the shards asked for, the same eligibility answers, files verified against the index, one retry after a fresh index, an
// explicit error (never a silent whole-bundle fallback), received shards not received again, and the switch that keeps every screen as it
// is unless the address asks for shards.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const lib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-catalog-shards.mjs')).href);
const core = require(path.join(root, 'archive/archive2-core.js'));
const shards = require(path.join(root, 'archive/archive2-catalog-shards.js'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

let builtOnce = null;
const built = async () => {
  if (!builtOnce) builtOnce = lib().then((m) => m.buildCatalogShards(root));
  return builtOnce;
};

const BASE = 'https://site.test/archive/data/archive2-catalog-shards-v1/';
// A fake site: `files` is a Map(relative path -> Buffer). `script(url, n)` may replace one response (n = how many times this url was asked).
function fakeSite(files, { script = null } = {}) {
  const log = [];
  const counts = new Map();
  const fetch = async (url, init = {}) => {
    const full = String(url);
    const rel = full.startsWith(BASE) ? full.slice(BASE.length).replace(/\?.*$/, '') : null;
    const n = (counts.get(rel ?? full) || 0) + 1;
    counts.set(rel ?? full, n);
    log.push({ url: full, rel, n, cache: init.cache });
    const scripted = script ? await script(rel, n, full) : undefined;
    if (scripted === 'network') throw new TypeError('Failed to fetch');
    const bytes = scripted !== undefined ? scripted : rel !== null ? files.get(rel) : undefined;
    if (!bytes) return { ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) };
    const copy = Buffer.from(bytes);
    return { ok: true, status: 200, arrayBuffer: async () => copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.length) };
  };
  return { fetch, log, count: (rel) => counts.get(rel) || 0 };
}
const loaderFor = (site) => shards.createLoader({ base: BASE, fetch: site.fetch });

// A second "release": the same files with another version string, re-hashed (what a deploy between the index and a file looks like).
function nextRelease(files, indexVersion) {
  const next = new Map();
  const index = JSON.parse(files.get('index.json').toString('utf8'));
  index.indexVersion = indexVersion;
  for (const shard of index.shards) {
    const doc = JSON.parse(files.get(shard.path).toString('utf8'));
    doc.indexVersion = indexVersion;
    const bytes = Buffer.from(`${JSON.stringify(doc)}\n`, 'utf8');
    next.set(shard.path, bytes);
    shard.sha256 = sha256(bytes); shard.bytes = bytes.length;
  }
  const common = JSON.parse(files.get(index.common.path).toString('utf8'));
  common.indexVersion = indexVersion;
  const commonBytes = Buffer.from(`${JSON.stringify(common)}\n`, 'utf8');
  next.set(index.common.path, commonBytes);
  index.common.sha256 = sha256(commonBytes); index.common.bytes = commonBytes.length;
  next.set('index.json', Buffer.from(`${JSON.stringify(index)}\n`, 'utf8'));
  return next;
}
async function release() {
  const { files, entries } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  return all;
}
const smallest = (index, n = 1) => [...index.courses].sort((a, b) => {
  const size = (course) => course.shards.reduce((sum, key) => sum + index.shards.find((shard) => shard.key === key).bytes, 0);
  return size(a) - size(b);
}).slice(0, n);

test('the catalog the loader assembles has the records, exams, version and eligibility answers of the whole catalog for the shards asked for', async () => {
  const files = await release();
  const { catalog: full } = await built();
  const site = fakeSite(files);
  const loader = loaderFor(site);
  const index = await loader.loadIndex();
  const [course] = smallest(index);
  const catalog = await loader.loadCatalog({ courses: [course.key] });
  const keys = new Set(course.shards);
  const m = await lib();
  const fullByUid = new Map(full.records.map((record) => [record.questionUid, record]));
  assert.equal(catalog.indexVersion, full.indexVersion, 'the string a screen sends to the server as index_version');
  assert.equal(catalog.identityDigest, full.identityDigest);
  assert.deepEqual(catalog.shardKeys.sort(), [...keys].sort());
  const wantFiles = Object.entries(index.examShard).filter(([, key]) => keys.has(key)).map(([file]) => file).sort();
  assert.deepEqual(catalog.exams.map((exam) => exam.file).sort(), wantFiles);
  const fullExams = new Map(full.exams.map((exam) => [exam.file, exam]));
  for (const exam of catalog.exams) assert.deepEqual(exam, fullExams.get(exam.file));
  assert.ok(catalog.records.length > 0);
  let ok = 0;
  let no = 0;
  for (const record of catalog.records) {
    const original = fullByUid.get(record.questionUid);
    assert.deepEqual(record, m.slimRecord(original), `record ${record.questionUid}`);
    const got = core.basicEligibility(record, { canonicalAuthority: catalog.canonicalAuthority });
    const want = core.basicEligibility(original, { canonicalAuthority: full.canonicalAuthority });
    assert.deepEqual(got, want);
    assert.equal(core.advancedEligible(record, { canonicalAuthority: catalog.canonicalAuthority }), core.advancedEligible(original, { canonicalAuthority: full.canonicalAuthority }));
    if (want.ok) ok += 1; else no += 1;
  }
  assert.ok(ok + no === catalog.records.length);
  // the lists a screen reads at the catalog level
  for (const key of ['taxonomy', 'basicTaxonomy', 'basicScopeGroups', 'projectionPolicy', 'coreMetaFilterOptions']) assert.deepEqual(catalog[key], full[key], key);
  // requests: index, common, and the shards of the course; nothing else
  assert.deepEqual(site.log.map((entry) => entry.rel).sort(), ['common.json', 'index.json', ...course.shards.map((key) => `shard-${key}.json`)].sort());
});

test('shards are asked for with the content address, and verified by hash and length before they are parsed', async () => {
  const files = await release();
  const site = fakeSite(files);
  const loader = loaderFor(site);
  const index = await loader.loadIndex();
  const [course] = smallest(index);
  await loader.loadCatalog({ courses: [course.key] });
  const index2 = JSON.parse(files.get('index.json').toString('utf8'));
  for (const entry of site.log.filter((row) => row.rel && row.rel !== 'index.json')) {
    const info = entry.rel === 'common.json' ? index2.common : index2.shards.find((shard) => shard.path === entry.rel);
    assert.ok(entry.url.endsWith(`?v=${info.sha256.slice(0, 16)}`), `content address in ${entry.url}`);
  }
  assert.equal(site.log.find((row) => row.rel === 'index.json').cache, 'no-cache', 'the index revalidates');
});

test('a file that fails once is received again after a fresh index; a second failure is an explicit retryable error and never the whole bundle', async () => {
  const files = await release();
  const { index } = await built();
  const course = smallest(index)[0];
  const key = course.shards[0];
  const rel = `shard-${key}.json`;
  const corrupt = (bytes) => Buffer.concat([bytes.subarray(0, bytes.length - 3), Buffer.from('xx\n')]);
  // (a) wrong bytes once -> fresh index -> good bytes
  let site = fakeSite(files, { script: (path_, n) => (path_ === rel && n === 1 ? corrupt(files.get(rel)) : undefined) });
  let loader = loaderFor(site);
  let catalog = await loader.loadCatalog({ courses: [course.key] });
  assert.ok(catalog.records.length > 0);
  assert.equal(site.count('index.json'), 2, 'the index was asked again once');
  assert.equal(site.count(rel), 2);
  assert.equal(site.log.filter((row) => row.rel === rel)[1].cache, 'reload');
  // (b) a 404 once, and a dropped connection once
  for (const first of [null, 'network']) {
    site = fakeSite(files, { script: (path_, n) => (path_ === rel && n === 1 ? (first === 'network' ? 'network' : null) : undefined) });
    // null is "no file" in the fake: a 404
    loader = loaderFor(site);
    catalog = await loader.loadCatalog({ courses: [course.key] });
    assert.ok(catalog.records.length > 0);
  }
  // (c) wrong bytes every time -> explicit error
  site = fakeSite(files, { script: (path_) => (path_ === rel ? corrupt(files.get(rel)) : undefined) });
  loader = loaderFor(site);
  await assert.rejects(loader.loadCatalog({ courses: [course.key] }), (error) => {
    assert.equal(error.code, 'CATALOG_SHARD_STALE');
    assert.equal(error.retryable, true);
    assert.equal(error.message, '자료가 갱신되는 중입니다. 잠시 뒤 다시 시도해 주세요.');
    return true;
  });
  assert.equal(site.count(rel), 2, 'one retry, no loop');
  assert.ok(site.log.every((row) => row.rel !== null), 'nothing outside the shard folder was asked for: no silent whole-bundle fallback');
  // the same loader works when the network is back (a failed request is not remembered)
  const retrySite = fakeSite(files);
  loader = loaderFor(retrySite);
  assert.ok((await loader.loadCatalog({ courses: [course.key] })).records.length > 0);
});

test('a release that goes out between the index and a file: the new index is taken, nothing of the old release is mixed in', async () => {
  const files = await release();
  const { index } = await built();
  const [first, second] = smallest(index, 2);
  const nextVersion = `archive2-canonical-v1:${'b'.repeat(64)}`;
  const releaseB = nextRelease(files, nextVersion);
  let served = 'A';
  // A is served until the second shard of the first course is asked; then the site flips to B (as a deploy would)
  const site = fakeSite(files, {
    script: (rel) => {
      if (rel === `shard-${first.shards[0]}.json` && served === 'A') served = 'B';
      return served === 'B' && rel ? releaseB.get(rel) : undefined;
    },
  });
  const loader = loaderFor(site);
  await loader.loadIndex();
  const catalog = await loader.loadCatalog({ courses: [first.key] });
  assert.equal(catalog.indexVersion, nextVersion);
  assert.ok(catalog.records.length > 0);
  // a screen that held release A keeps working: adding a course now comes from B only
  const both = await loader.loadCatalog({ courses: [second.key] });
  assert.equal(both.indexVersion, nextVersion);
  assert.deepEqual([...both.shardKeys].sort(), [...first.shards, ...second.shards].sort());
  assert.ok(both.records.every((record) => record.canonicalProjectionVersion === undefined || typeof record.canonicalProjectionVersion === 'string'));
  assert.equal(loader.held().indexVersion, nextVersion);
});

test('shards received in this document are not received again, and a course can be added to what is held', async () => {
  const files = await release();
  const { index } = await built();
  const [first, second] = smallest(index, 2);
  const site = fakeSite(files);
  const loader = loaderFor(site);
  await loader.loadIndex();
  // asking for the same shard twice at once is one request
  await Promise.all([loader.loadShard(first.shards[0]), loader.loadShard(first.shards[0]), loader.loadShards(first.shards)]);
  const one = await loader.loadCatalog({ courses: [first.key] });
  const two = await loader.loadCatalog({ courses: [second.key] });
  for (const key of [...first.shards, ...second.shards]) assert.equal(site.count(`shard-${key}.json`), 1, `${key} was received once`);
  assert.equal(site.count('common.json'), 1);
  assert.equal(site.count('index.json'), 1);
  assert.equal(two.records.length, one.records.length + second.shards.reduce((sum, key) => sum + index.shards.find((shard) => shard.key === key).records, 0));
  assert.deepEqual(two.exams.map((exam) => exam.file).slice(0, one.exams.length), one.exams.map((exam) => exam.file), 'the first course keeps its place');
  // the authority of the combined catalog covers both courses, and a question of a course never asked for is not covered
  const other = index.shards.find((shard) => ![...first.shards, ...second.shards].includes(shard.key));
  if (other) {
    const doc = await loader.loadShard(other.key);
    assert.equal(two.canonicalAuthority.shardCoverage.has(doc.records[0].questionUid), false);
    const result = core.basicEligibility(doc.records[0], { canonicalAuthority: two.canonicalAuthority });
    assert.equal(result.ok, false, 'a question outside the assembled shards is not accepted');
  }
});

test('the index lists courses and the shard of every exam, so a screen needs no keys of its own', async () => {
  const files = await release();
  const { catalog: full } = await built();
  const loader = loaderFor(fakeSite(files));
  const index = await loader.loadIndex();
  const courses = loader.courses();
  assert.deepEqual(courses.map((course) => course.key), index.courses.map((course) => course.key));
  for (const course of courses) assert.deepEqual(loader.shardKeysOfCourse(course.key), course.shards);
  assert.throws(() => loader.shardKeysOfCourse('no-such-course'), (error) => error.code === 'CATALOG_SHARD_UNKNOWN');
  // an exam is found through the index, never through its subject name: every middle-school exam is in the shard of its own grade, whatever
  // course name its registration carries (five 중2 exams are registered with the course "중1 수학")
  let crossNamed = 0;
  for (const exam of full.exams) {
    const key = loader.shardKeyOfExam(exam.file);
    assert.ok(key, `an exam has a shard: ${exam.file}`);
    const grade = String(exam.grade || exam.sourceGrade || '');
    if (/^중[123]$/.test(grade)) {
      assert.equal(key, `m${grade.slice(1)}`, exam.file);
      if (exam.primaryStandardCourse && !String(exam.primaryStandardCourse).startsWith(grade)) crossNamed += 1;
    }
  }
  assert.equal(loader.shardKeyOfExam('original/no/such/exam.js'), null);
  // asking by exam loads exactly that exam's shard
  const site = fakeSite(files);
  const byExam = loaderFor(site);
  await byExam.loadIndex();
  const file = full.exams.find((exam) => /^중[123]$/.test(String(exam.grade || ''))).file;
  const catalog = await byExam.loadCatalog({ exams: [file] });
  assert.deepEqual(catalog.shardKeys, [byExam.shardKeyOfExam(file)]);
  assert.ok(catalog.exams.some((exam) => exam.file === file));
  assert.ok(crossNamed >= 0);
});

test('when the shards are not on the site the error says so and nothing else is asked for', async () => {
  for (const script of [() => null, () => 'network', (rel) => (rel === 'index.json' ? Buffer.from('not json') : undefined), (rel) => (rel === 'index.json' ? Buffer.from('{"schemaVersion":"other"}') : undefined)]) {
    const site = fakeSite(new Map(), { script });
    const loader = loaderFor(site);
    await assert.rejects(loader.loadIndex(), (error) => {
      assert.equal(shards.isUnavailable(error), true);
      assert.equal(error.code, 'CATALOG_SHARDS_UNAVAILABLE');
      return true;
    });
    assert.deepEqual(site.log.map((row) => row.rel), ['index.json']);
    await assert.rejects(loader.loadCatalog({ courses: ['x'] }), (error) => shards.isUnavailable(error));
  }
  assert.equal(shards.isUnavailable(new Error('x')), false);
  assert.equal(shards.isUnavailable(null), false);
});

test('the switch: off unless the address asks, ?shards=1 means the first course, ?shards=a,b names courses', async () => {
  for (const search of ['', '?x=1', '?shards=', '?shards=0', '?shards=off', '?a=1&shardsx=1']) assert.equal(shards.switchFromSearch(search), null, search);
  assert.deepEqual(shards.switchFromSearch('?shards=1'), { courses: [] });
  assert.deepEqual(shards.switchFromSearch('?view=compose&shards=m1,high2-math1#x'), { courses: ['m1', 'high2-math1'] });
  // off: no request at all
  let asked = 0;
  assert.equal(await shards.loadForSwitch('?view=compose', { base: BASE, fetch: async () => { asked += 1; return { ok: false, status: 404 }; } }), null);
  assert.equal(asked, 0);
  // on: the first course of the index
  const files = await release();
  const { index } = await built();
  const found = await shards.loadForSwitch('?shards=1', { base: BASE, fetch: fakeSite(files).fetch });
  assert.deepEqual(found.courses, [index.courses[0].key]);
  assert.deepEqual(found.catalog.shardKeys.sort(), [...index.courses[0].shards].sort());
});

test('every screen is as it was unless the address asks for shards: the loader is not on any page, and the one screen with the switch loads it only then', () => {
  for (const file of fs.readdirSync(path.join(root, 'archive')).filter((name) => name.endsWith('.html'))) {
    assert.equal(/archive2-catalog-shards\.js/.test(read(`archive/${file}`)), false, `${file} must not load the shard loader by itself`);
  }
  const workspace = read('archive/archive2-workspace.js');
  assert.equal((workspace.match(/archive2-catalog-shards\.js/g) || []).length, 1, 'the loader file is named once, inside the switch');
  assert.ok(/\/\[\?&\]shards=\/\.test\(location\.search\) \? shardCatalog\(\) : window\.applyArchiveMetaFoundationCatalog\(\)/.test(workspace), 'switch off = the same call as before');
  // the whole-bundle fallback exists only for "shards are not on the site"
  assert.ok(/if \(!Shards\.isUnavailable\(error\)\) throw error;/.test(workspace));
  // the screens that read the catalog do not know about shards
  for (const file of ['archive/archive2-core.js', 'archive/archive2-canonical.js', 'archive/archive2-workspace-core.js', 'archive/archive2-workspace-compose.js', 'archive/meta-foundation-runtime.js']) assert.equal(/Archive2CatalogShards/.test(read(file)), false, file);
  // shipped with the other archive modules
  const manifest = JSON.parse(read('tools/archive-pages-release-manifest.json'));
  assert.ok(manifest.archiveRootFiles.includes('archive2-catalog-shards.js'));
  // the page that loads the screen script carries the same version string as the file that changed
  const html = read('archive/workspace.html');
  assert.ok(/archive2-workspace\.js\?v=([^"']+)/.test(html));
  const loaderVersion = /archive2-catalog-shards\.js\?v=([^"']+)/.exec(workspace)[1];
  assert.ok(loaderVersion.length > 4);
});
