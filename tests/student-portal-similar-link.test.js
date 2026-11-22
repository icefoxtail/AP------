// Student portal: past-exam card -> "유사문제 풀어보기" (self-study, nothing recorded).
// Defect conditions only: no fixed operating counts (how many past exams have similar sets changes weekly).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const link = require('../apmath/student/similar-link.js');
const html = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');
const BASE = 'https://school.test/AP------/apmath/student/index.html?omr=1';
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const options = { baseUrl: BASE, returnTarget: '/AP------/apmath/student/?omr=1', escapeHtml: esc };
const hrefs = (markup) => [...markup.matchAll(/href="([^"]+)"/g)].map((m) => new URL(m[1].replace(/&amp;/g, '&')));

const map = link.normalizeMap({
  version: 1,
  map: {
    'original/high/h1/2mid/25_가고_2학기_중간_고1_기출.js': [['similar/high/h1/2mid/25_가고_2학기_중간_고1_기출_유사.js', 20]],
    'original/high/h1/2mid/25_나고_2학기_중간_고1_기출.js': [
      ['similar/high/h1/2mid/25_나고_2학기_중간_고1_기출_유사.js', 22],
      ['similar/high/h1/2mid/25_나고_2학기_중간_고1_기출_유사2.js', 22],
    ],
  },
});
const withSimilar = { assignment_id: 'a1', archive_file: 'exams/original/high/h1/2mid/25_가고_2학기_중간_고1_기출.js' };
const withoutSimilar = { assignment_id: 'a2', archive_file: 'exams/original/high/h1/2mid/25_다고_2학기_중간_고1_기출.js' };

test('exam with a linked similar set shows the entry; the URLs follow engine.html?data=exams/<file>&mode=exam|ans|sol', () => {
  const markup = link.renderEntry(withSimilar, map, options);
  assert.match(markup, /유사문제 풀어보기/);
  assert.match(markup, /자습용 · 기록되지 않습니다/);
  const urls = hrefs(markup);
  assert.deepEqual(urls.map((u) => u.searchParams.get('mode')), ['exam', 'ans', 'sol']);
  for (const url of urls) {
    assert.equal(url.origin + url.pathname, 'https://school.test/AP------/archive/engine.html');
    assert.equal(url.searchParams.get('data'), 'exams/similar/high/h1/2mid/25_가고_2학기_중간_고1_기출_유사.js');
    assert.equal(url.searchParams.get('studentReview'), '1');
    assert.equal(url.searchParams.get('submitQr'), '0');
    assert.equal(url.searchParams.get('studentReturnTo'), '/AP------/apmath/student/?omr=1');
  }
  assert.match(markup, /20문항/);
  // Plain links only: nothing is submitted or recorded by this entry.
  assert.doesNotMatch(markup, /onclick|<form|apiPost|fetch\(/);
  assert.equal(markup.match(/target="_blank" rel="noopener"/g).length, 3);
});

test('several similar sets are all listed as 유사 1, 유사 2 ...', () => {
  const markup = link.renderEntry({ archive_file: 'exams/original/high/h1/2mid/25_나고_2학기_중간_고1_기출.js' }, map, options);
  assert.match(markup, /유사 1 풀어보기/);
  assert.match(markup, /유사 2 풀어보기/);
  assert.deepEqual(
    hrefs(markup).filter((u) => u.searchParams.get('mode') === 'exam').map((u) => u.searchParams.get('data')),
    [
      'exams/similar/high/h1/2mid/25_나고_2학기_중간_고1_기출_유사.js',
      'exams/similar/high/h1/2mid/25_나고_2학기_중간_고1_기출_유사2.js',
    ],
  );
  assert.equal((markup.match(/자습용 · 기록되지 않습니다/g) || []).length, 1);
});

test('no similar set, MIXED papers, empty or missing map: nothing is drawn (card unchanged)', () => {
  assert.equal(link.renderEntry(withoutSimilar, map, options), '');
  assert.equal(link.renderEntry({ archive_file: 'MIXED:abc' }, map, options), '');
  assert.equal(link.renderEntry({ archive_file: '' }, map, options), '');
  assert.equal(link.renderEntry({}, map, options), '');
  assert.equal(link.renderEntry(withSimilar, {}, options), '');
  assert.equal(link.renderEntry(withSimilar, null, options), '');
});

test('archive_file spellings reach the same map key; malformed map rows are dropped', () => {
  const key = 'original/high/h1/2mid/25_가고_2학기_중간_고1_기출.js';
  for (const spelling of [`exams/${key}`, `archive/exams/${key}`, `./exams/${key}`, key])
    assert.equal(link.originalFileOf(spelling), key);
  const dirty = link.normalizeMap({
    version: 1,
    map: { a: [['similar/x.js', 5], ['../evil.js', 1], ['original/y.js', 1], 'bad', null], b: 'nope' },
  });
  assert.deepEqual(Object.keys(dirty), ['a']);
  assert.deepEqual(dirty.a, [{ file: 'similar/x.js', count: 5 }]);
  assert.deepEqual(Object.keys(link.normalizeMap({ version: 2, map: { a: [['similar/x.js', 1]] } })), []);
});

test('load never throws: network error, HTTP error and bad JSON all mean "no entries"', async () => {
  const empty = (value) => assert.deepEqual(Object.keys(value), []);
  empty(await link.load(async () => { throw new Error('offline'); }, BASE));
  empty(await link.load(async () => ({ ok: false, status: 404 }), BASE));
  empty(await link.load(async () => ({ ok: true, json: async () => { throw new Error('bad json'); } }), BASE));
  let requested = '';
  const loaded = await link.load(async (url) => {
    requested = url;
    return { ok: true, json: async () => ({ version: 1, map: { k: [['similar/z.js', 3]] } }) };
  }, BASE);
  assert.equal(requested, 'https://school.test/AP------/archive/data/similar-links-v1.json');
  assert.deepEqual(loaded.k, [{ file: 'similar/z.js', count: 3 }]);
});

test('portal wiring: entry only where the card already offers review, loaded with the list, no catalog download', () => {
  assert.match(html, /<script src="\.\/similar-link\.js\?v=[^"]+"><\/script>/);
  assert.match(html, /showReview \? renderSimilarEntry\(exam\) : ''/);
  assert.match(html, /await Promise\.all\(\[loadOmrExams\(true\), loadSimilarLinks\(\)\]\)/);
  assert.doesNotMatch(html, /archive2-catalog/);
  // The entry code must not reach any server write path.
  const fn = html.slice(html.indexOf('async function loadSimilarLinks'), html.indexOf('function getOmrExams'));
  assert.ok(fn.length > 50);
  assert.doesNotMatch(fn, /apiPost|apiPut|method:\s*['"]POST/);
});

test('build step: map comes from Archive2Similar.pairSimilarSets and only lists shipped exam files', async () => {
  const { buildSimilarLinks, SIMILAR_LINKS_PATH } = await import(pathToFileURL(path.join(root, 'tools/lib/build-similar-links.mjs')).href);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'similar-links-'));
  try {
    const put = (file, content) => {
      const target = path.join(tmp, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content);
    };
    fs.mkdirSync(path.join(tmp, 'archive/data'), { recursive: true });
    fs.copyFileSync(path.join(root, 'archive/archive2-similar.js'), path.join(tmp, 'archive/archive2-similar.js'));
    const exam = (file, extra) => ({ file, school: '가고', grade: '고1', year: 2025, semester: '2', examType: 'mid', subject: '수학', qCount: 20, identityTitle: path.basename(file, '.js'), ...extra });
    put('archive/data/archive2-catalog.json', JSON.stringify({
      exams: [
        exam('original/a/25_가고_기출.js', { contentType: '기출' }),
        exam('similar/a/25_가고_기출_유사.js', { contentType: '유사', qCount: 18 }),
        exam('similar/a/25_가고_기출_유사2.js', { contentType: '유사' }), // file not shipped -> dropped
        exam('original/a/25_나고_기출.js', { contentType: '기출', school: '나고' }), // no similar -> absent
      ],
    }));
    put('archive/exams/original/a/25_가고_기출.js', 'x');
    put('archive/exams/similar/a/25_가고_기출_유사.js', 'x');
    put('archive/exams/original/a/25_나고_기출.js', 'x');
    const entry = buildSimilarLinks(tmp);
    assert.equal(entry.path, SIMILAR_LINKS_PATH);
    const built = JSON.parse(entry.content.toString('utf8'));
    assert.equal(built.version, 1);
    assert.deepEqual(built.map, { 'original/a/25_가고_기출.js': [['similar/a/25_가고_기출_유사.js', 18]] });
    assert.equal(entry.bytes, entry.content.length);
    // the portal accepts exactly what the builder writes
    assert.deepEqual(
      link.setsFor(link.normalizeMap(built), { archive_file: 'exams/original/a/25_가고_기출.js' }),
      [{ file: 'similar/a/25_가고_기출_유사.js', count: 18 }],
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('real catalog: the shipped map equals the school-screen pairing, every link points at a shipped file and is small', async () => {
  const catalogPath = path.join(root, 'archive/data/archive2-catalog.json');
  if (!fs.existsSync(catalogPath)) return;
  const { buildSimilarLinks } = await import(pathToFileURL(path.join(root, 'tools/lib/build-similar-links.mjs')).href);
  const similar = require('../archive/archive2-similar.js');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const pairs = similar.pairSimilarSets(catalog.exams);
  const entry = buildSimilarLinks(root);
  const built = JSON.parse(entry.content.toString('utf8')).map;
  const problems = [];
  for (const [original, sets] of Object.entries(built)) {
    const expected = pairs.setsFor(original).map((set) => set.file);
    if (JSON.stringify(sets.map((row) => row[0])) !== JSON.stringify(expected)) problems.push(`pair differs: ${original}`);
    for (const file of [original, ...sets.map((row) => row[0])])
      if (!fs.existsSync(path.join(root, 'archive/exams', file))) problems.push(`not shipped: ${file}`);
  }
  for (const original of pairs.similarByOriginal.keys())
    if (!built[original] && fs.existsSync(path.join(root, 'archive/exams', original))) problems.push(`dropped: ${original}`);
  assert.deepEqual(problems, []);
  // A phone must not pay for this: stay far below one catalog shard.
  assert.ok(entry.bytes < 200 * 1024, `map is ${entry.bytes} bytes`);
});
