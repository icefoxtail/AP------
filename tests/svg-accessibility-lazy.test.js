'use strict';
// The figure names (archive/data/svg-accessibility-index.js, 1.4 MB compressed) reach the original-exam window as one small file per exam
// (tools/lib/build-archive2-svg-alt-part.mjs, read by archive/svg-accessibility-lazy.js) instead of a parser-blocking script.
// These tests keep that honest without fixing the size or the count of anything: for every exam the file answers exactly as the whole index
// does (both computed in the same run), the window falls back to the whole index whenever the file cannot be trusted, and it never waits for
// a figure it does not need.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const resolver = require(path.join(root, 'archive/svg-accessibility.js'));
const lazySource = fs.readFileSync(path.join(root, 'archive/svg-accessibility-lazy.js'), 'utf8');
const lazyScript = new vm.Script(lazySource, { filename: 'svg-accessibility-lazy.js' });
const lib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-svg-alt-part.mjs')).href);
const metaLib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-exam-meta-part.mjs')).href);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function loadIndexRecords() {
  const sandbox = {};
  sandbox.globalThis = sandbox;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'archive/data/svg-accessibility-index.js'), 'utf8'), sandbox);
  return sandbox.APSvgAccessibilityIndex.records;
}

test('for every exam the per-exam file answers exactly as the whole index does (same run, no pinned values)', async () => {
  const { svgAltExtras, projectSvgAlt, examQuestions } = await lib();
  const { normalizeExamFile } = await metaLib();
  const examsDir = path.join(root, 'archive/exams');
  const files = walk(examsDir).map((file) => path.relative(examsDir, file).replace(/\\/g, '/')).filter((name) => !name.startsWith('test-fixtures/'));
  const extras = svgAltExtras(root, { exams: files.map((file) => ({ file })) });
  const part = projectSvgAlt(extras, 'rel-test');
  assert.deepEqual([...projectSvgAlt(extras, 'rel-test').files], [...part.files], 'two builds are the same');
  assert.equal(part.index.count, part.files.size);
  assert.ok(extras.exams.size > 100, 'many exams were read');

  const all = loadIndexRecords();
  const full = resolver.createResolver(all);
  const keyOfRecord = new Map(all.map((record) => [record, resolver.normalizeAssetRef(record.assetRef)])); // normalized once: a URL parse per record per exam would take minutes
  let asked = 0;
  let curated = 0;
  for (const [name, { refs, records }] of extras.exams) {
    const slice = resolver.createResolver(records);
    const questions = examQuestions(fs.readFileSync(path.join(examsDir, name), 'utf8'));
    const drawn = new Set();
    for (const question of questions) {
      for (const field of ['image', 'solutionImage']) {
        const value = question && question[field];
        if (typeof value !== 'string' || !resolver.normalizeAssetRef(value)) continue;
        drawn.add(resolver.normalizeAssetRef(value));
        for (const existing of ['', '기존 설명입니다']) {
          const wanted = full(value, field, question, existing);
          assert.equal(slice(value, field, question, existing), wanted, `${name} ${field} ${value}`);
          asked += 1;
          if (wanted) curated += 1;
        }
      }
    }
    // the file lists every figure the exam names (the window checks this before it trusts the file) and holds no record of another figure
    for (const ref of drawn) assert.ok(refs.includes(ref), `${name} lists ${ref}`);
    const wantedKeys = new Set(refs);
    for (const record of records) assert.ok(wantedKeys.has(keyOfRecord.get(record) ?? resolver.normalizeAssetRef(record.assetRef)), `${name}: record of a figure the exam does not name`);
    // every record of the whole index for those figures is there, in the index's own order
    const expected = all.filter((record) => wantedKeys.has(keyOfRecord.get(record)));
    assert.equal(JSON.stringify(records), JSON.stringify(expected), `${name} records`); // two vm realms: compare the values, not the prototypes
  }
  assert.ok(asked > 200 && curated > 50, 'the comparison covers real figure names');
  assert.equal(normalizeExamFile('exams/a.js'), 'a.js');
});

// ---- the window side: svg-accessibility-lazy.js in a bare context ----
const SHARDS = 'archive2-catalog-shards-v1/';
async function runLazy({ files = {}, search = '', noCrypto = false, fullRecords = null } = {}) {
  const requested = [];
  const appended = [];
  const context = {
    URL, URLSearchParams, TextEncoder, AbortController, setTimeout, clearTimeout, console, Promise, Set, Map,
    crypto: noCrypto ? undefined : webcrypto,
    APSvgAccessibility: resolver,
    location: { search, href: 'http://local/archive/engine.html' + search },
    document: {
      baseURI: 'http://local/archive/engine.html',
      createElement: () => ({}),
      head: { appendChild: (script) => { appended.push(script.src); if (fullRecords) context.APSvgAccessibilityIndex = { records: fullRecords }; setTimeout(() => script.onload && script.onload(), 0); } },
    },
    fetch: (url) => {
      const name = String(url).replace(/^.*\/archive\//, '');
      requested.push(name);
      const body = files[name];
      return Promise.resolve(body === undefined ? { ok: false, status: 404, json: async () => ({}) } : { ok: true, status: 200, json: async () => body });
    },
  };
  lazyScript.runInNewContext(context);
  return { lazy: context.APSvgAccessibilityLazy, context, requested, appended };
}
const rec = (ref, role = 'problem') => ({ assetRef: ref, visualRole: role, titleKo: '이름', descriptionKo: '설명', provenanceStatus: 'SOURCE_BOUND', answerHintFree: true });
const q = (image, solutionImage) => ({ image, solutionImage });

async function filesFor(exam, doc, index) {
  const { examMetaKey } = await metaLib();
  const files = { [SHARDS.replace(/^/, 'data/') + 'index.json']: index === undefined ? { indexVersion: 'rel1', svgAlt: { schemaVersion: 'archive2-svg-alt-v1' } } : index };
  if (doc !== null) files[`data/${SHARDS}svg-alt/${examMetaKey(exam)}.json`] = doc;
  return files;
}
const goodDoc = (exam, refs, records) => ({ schemaVersion: 'archive2-svg-alt-v1', indexVersion: 'rel1', sourceArchiveFile: exam, refs, records });

test('the window reads the exam file and the index of its release, and installs only those records', async () => {
  const exam = 'original/high/h1/x.js';
  const files = await filesFor(exam, goodDoc(exam, ['assets/images/x/q1.png', 'assets/images/x/q2.png'], [rec('assets/images/x/q1.png')]));
  for (const search of ['', '?data=exams/original/high/h1/x.js&mode=exam']) {
    const { lazy, context, requested, appended } = await runLazy({ files, search });
    assert.equal(await lazy.prepare([q('assets/images/x/q1.png'), q('assets/images/x/q2.png', 'assets/images/x/q1.png')], ['exams/' + exam]), 'slice');
    assert.equal(context.APSvgAccessibilityIndex.records.length, 1);
    assert.deepEqual(appended, [], 'the whole index is not loaded');
    assert.equal(requested.length, 2, 'the index of the release and the exam file, once each (the address prefetch is shared): ' + requested.join(','));
    assert.equal(resolver.createResolver(context.APSvgAccessibilityIndex.records)('assets/images/x/q1.png', 'image', {}, ''), '이름. 설명');
  }
});

test('no figure to draw: nothing is requested and no index is needed', async () => {
  const { lazy, requested, appended } = await runLazy({ files: {} });
  assert.equal(await lazy.prepare([{ content: 'a' }, { image: '' }], ['original/x.js']), 'none');
  assert.deepEqual(requested, []);
  assert.deepEqual(appended, []);
});

test('an exam file that is missing, of another release or exam, short of a figure, or unusable sends the window to the whole index', async () => {
  const exam = 'original/high/h1/x.js';
  const refs = ['assets/images/x/q1.png'];
  const good = goodDoc(exam, refs, [rec(refs[0])]);
  const full = [rec(refs[0]), rec('assets/images/y/q9.png')];
  const cases = {
    'no exam file': await filesFor(exam, null),
    'no index': Object.fromEntries(Object.entries(await filesFor(exam, good)).filter(([name]) => !name.endsWith('index.json'))),
    'index without svgAlt': await filesFor(exam, good, { indexVersion: 'rel1' }),
    'index of another release': await filesFor(exam, good, { indexVersion: 'rel2', svgAlt: { schemaVersion: 'archive2-svg-alt-v1' } }),
    'file of another exam': await filesFor(exam, { ...good, sourceArchiveFile: 'other.js' }),
    'file of another schema': await filesFor(exam, { ...good, schemaVersion: 'archive2-svg-alt-v2' }),
    'file without records': await filesFor(exam, { ...good, records: null }),
    'file that does not list a figure of the questions': await filesFor(exam, goodDoc(exam, [], [])),
  };
  for (const [label, files] of Object.entries(cases)) {
    const { lazy, context, appended } = await runLazy({ files, fullRecords: full });
    assert.equal(await lazy.prepare([q(refs[0])], [exam]), 'full', label);
    assert.equal(appended.length, 1, label);
    assert.match(appended[0], /data\/svg-accessibility-index\.js\?v=/, label);
    assert.equal(context.APSvgAccessibilityIndex.records.length, 2, label);
  }
  const noCrypto = await runLazy({ files: await filesFor(exam, good), noCrypto: true, fullRecords: full });
  assert.equal(await noCrypto.lazy.prepare([q(refs[0])], [exam]), 'full', 'no crypto: no per-exam read');
  assert.equal(noCrypto.requested.length, 0);
  const none = await runLazy({ files: await filesFor(exam, good), fullRecords: full });
  assert.equal(await none.lazy.prepare([q(refs[0])], []), 'full', 'no exam named');
});

test('a problem sheet of several exams installs the union of their records once each, and falls back when one of them fails', async () => {
  const { examMetaKey } = await metaLib();
  const a = 'original/a.js';
  const b = 'original/b.js';
  const shared = rec('assets/images/shared.png');
  const files = {
    [`data/${SHARDS}index.json`]: { indexVersion: 'rel1', svgAlt: { schemaVersion: 'archive2-svg-alt-v1' } },
    [`data/${SHARDS}svg-alt/${examMetaKey(a)}.json`]: goodDoc(a, ['assets/images/shared.png', 'assets/images/a.png'], [shared, rec('assets/images/a.png')]),
    [`data/${SHARDS}svg-alt/${examMetaKey(b)}.json`]: goodDoc(b, ['assets/images/shared.png', 'assets/images/b.png'], [shared, rec('assets/images/b.png')]),
  };
  const run = await runLazy({ files });
  assert.equal(await run.lazy.prepare([q('assets/images/a.png'), q('assets/images/b.png', 'assets/images/shared.png')], [a, b]), 'slice');
  assert.equal(run.context.APSvgAccessibilityIndex.records.length, 3, 'the record both exams share is installed once (a duplicate would make the resolver throw)');
  assert.doesNotThrow(() => resolver.createResolver(run.context.APSvgAccessibilityIndex.records));
  const broken = await runLazy({ files: { ...files, [`data/${SHARDS}svg-alt/${examMetaKey(b)}.json`]: undefined }, fullRecords: [rec('assets/images/a.png')] });
  assert.equal(await broken.lazy.prepare([q('assets/images/a.png'), q('assets/images/b.png')], [a, b]), 'full');
});

test('the pages that draw figures wait for the names before they draw, and the whole index stays the fallback of the loader only', () => {
  const engine = fs.readFileSync(path.join(root, 'archive/engine.html'), 'utf8');
  assert.doesNotMatch(engine, /<script[^>]*\ssrc="data\/svg-accessibility-index\.js/);
  assert.match(lazySource, /data\/svg-accessibility-index\.js/);
  // nothing but the loader asks for the whole index script in the browser pages
  for (const file of ['archive/engine.html', 'archive/screen-runtime-adapter.js']) assert.doesNotMatch(fs.readFileSync(path.join(root, file), 'utf8'), /createElement\('script'\)[\s\S]{0,200}svg-accessibility-index/);
});
