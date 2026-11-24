'use strict';
// The browser copy of the question metadata sidecar (archive/data/question-metadata-browser-v1.json, built by the release
// from archive/data/question_metadata.json) keeps only the fields the screens read. These tests keep that list honest:
// a screen script that starts reading another record field must add it to BROWSER_RECORD_FIELDS, and question-meta.js must
// load the copy when it exists and the full sidecar when it does not.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const { webcrypto } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const questionMetaScript = new vm.Script(fs.readFileSync(path.join(__dirname, '..', 'archive/question-meta.js'), 'utf8'), { filename: 'question-meta.js' });
const examMetaLib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-exam-meta-part.mjs')).href);
const lib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-question-metadata-browser.mjs')).href);

test('the browser copy keeps the allowed fields as they are and drops everything else, in record order', async () => {
  const { projectQuestionMetadata, BROWSER_RECORD_FIELDS, QUESTION_METADATA_BROWSER_SCHEMA } = await lib();
  const full = { schemaVersion: 's', metadataRevision: 'r', digest: 'd', counts: { a: 1 }, records: [
    { questionUid: 'qid_2', sourceArchiveFile: 'f.js', sourceOrdinal: 2, L3: 'x', difficultyBucket: 3, typeApproval: { big: 1 }, fieldStatus: { a: 1 }, approvalEvidence: ['p'], sourceFingerprint: 'fp' },
    { questionUid: 'qid_1', sourceArchiveFile: 'f.js', sourceOrdinal: 1, defaultSelectable: false, metaFoundationStatus: 'ACTIVE', metaFoundationPackId: 'P', unknownEvidence: 1 },
  ] };
  const out = JSON.parse(projectQuestionMetadata(JSON.stringify(full)).toString('utf8'));
  assert.equal(out.browserProjection, QUESTION_METADATA_BROWSER_SCHEMA);
  for (const key of ['schemaVersion', 'metadataRevision', 'digest', 'counts']) assert.deepEqual(out[key], full[key]);
  assert.deepEqual(out.records.map((r) => r.questionUid), ['qid_2', 'qid_1']);
  assert.deepEqual(out.records[0], { questionUid: 'qid_2', sourceArchiveFile: 'f.js', sourceOrdinal: 2, L3: 'x', difficultyBucket: 3 });
  assert.deepEqual(out.records[1], { questionUid: 'qid_1', sourceArchiveFile: 'f.js', sourceOrdinal: 1, defaultSelectable: false, metaFoundationStatus: 'ACTIVE', metaFoundationPackId: 'P' });
  assert.equal(new Set(BROWSER_RECORD_FIELDS).size, BROWSER_RECORD_FIELDS.length, 'no field is listed twice');
  assert.throws(() => projectQuestionMetadata(JSON.stringify({ records: [] })), /no records/);
});

test('every record field a screen script reads from the sidecar is in the browser copy', async () => {
  const { BROWSER_RECORD_FIELDS } = await lib();
  const allowed = new Set(BROWSER_RECORD_FIELDS);
  const missing = [];
  const need = (where, field) => { if (!allowed.has(field)) missing.push(`${where}: ${field}`); };

  // question-meta.js: the fields mergeArchiveQuestionMetadata copies, and its two lookups.
  const meta = read('archive/question-meta.js');
  const copied = /for \(const field of \[([^\]]+)\]\)/.exec(meta);
  assert.ok(copied, 'question-meta.js still copies a fixed field list');
  for (const field of copied[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1))) need('question-meta.js merge list', field);
  for (const field of ['questionUid', 'sourceArchiveFile', 'sourceOrdinal']) need('question-meta.js lookups', field);

  // unit-past-exams.js joinApprovedMetadata: every `meta.<field>` / `meta[...]` read of a sidecar record.
  const unit = read('archive/unit-past-exams.js');
  const join = unit.slice(unit.indexOf('function joinApprovedMetadata'), unit.indexOf('// 문항 배열 찾기 규칙'));
  assert.ok(join.length > 500, 'joinApprovedMetadata was found');
  for (const m of join.matchAll(/\bmeta\.([A-Za-z_][A-Za-z0-9_]*)/g)) need('unit-past-exams.js join', m[1]);
  assert.equal(/\bmeta\[/.test(join), false, 'the join reads sidecar fields by name only (a computed key could read a dropped field)');

  // unit-past-exams-core.js validateMetaFoundationSelection(meta, ...) reads these record fields.
  const core = read('archive/unit-past-exams-core.js');
  const scope = /META_FOUNDATION_SCOPE_FIELDS = Object\.freeze\(\[([^\]]+)\]\)/.exec(core)[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1));
  for (const field of [...scope, 'problemTypeKey', 'templateKey', 'metaFoundationStatus', 'metaFoundationPackId']) need('unit-past-exams-core.js validate', field);

  // meta-foundation-runtime.js reads the base record's difficultyBucket and subUnit before it overlays its own values.
  const runtime = read('archive/meta-foundation-runtime.js');
  for (const m of runtime.matchAll(/\bbase(?: && base)?\.([A-Za-z_][A-Za-z0-9_]*)/g)) need('meta-foundation-runtime.js base', m[1]);

  assert.deepEqual(missing, [], 'a screen reads a sidecar field that the browser copy would drop: add it to BROWSER_RECORD_FIELDS');
});

test('nothing but question-meta.js fetches the sidecar, and nothing reads the record the merge keeps on the question', () => {
  // _archiveMetadata is the whole sidecar record attached to a merged question. If a script started reading fields from it,
  // the browser copy would silently hide them, so the readers are pinned: only the two writers mention it.
  const readers = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        if (['exams', 'data', 'assets', 'vendor', 'tools', '_generated', 'textbook', 'node_modules', 'generated', 'prototypes'].includes(entry.name)) continue;
        walk(rel);
      } else if (/\.(js|html)$/.test(entry.name) && /_archiveMetadata\b/.test(fs.readFileSync(path.join(root, rel), 'utf8'))) {
        readers.push(rel);
      }
    }
  };
  walk('archive');
  assert.deepEqual(readers.filter((f) => !/archive\/(question-meta|meta-foundation-runtime)\.js$/.test(f) && !/archive\/js\//.test(f)).sort(), [],
    'only question-meta.js and meta-foundation-runtime.js touch _archiveMetadata');
  const fetchers = [];
  for (const file of ['archive/question-meta.js', 'archive/unit-past-exams.js', 'archive/output-metadata-loader.js', 'archive/meta-foundation-runtime.js']) {
    if (/question_metadata\.json/.test(read(file))) fetchers.push(file);
  }
  assert.deepEqual(fetchers, ['archive/question-meta.js']);
});

// question-meta.js in a bare context: which file does it read, and does it survive a missing or unusable copy?
function runQuestionMeta(files, options = {}) {
  const requested = [];
  const window = { __ARCHIVE_METADATA_EXAM__: options.exam, crypto: options.noCrypto ? undefined : webcrypto };
  const fetch = (url) => {
    const name = String(url).replace(/^.*\/data\//, '');
    requested.push(name);
    const body = files[name];
    return Promise.resolve(body === undefined ? { ok: false, status: 404, json: async () => ({}) } : { ok: true, status: 200, json: async () => body });
  };
  const context = { window, document: { baseURI: 'http://local/archive/workspace.html' }, fetch, URL, console, Map, TextEncoder, AbortController, setTimeout, clearTimeout };
  questionMetaScript.runInNewContext(context);
  return window.__ARCHIVE_METADATA_READY__.then((data) => ({ data, requested, window }));
}
const record = (n) => ({ questionUid: `qid_${n}`, sourceArchiveFile: 'a.js', sourceOrdinal: n, L3: `L${n}` });
const copy = { browserProjection: 'archive2-question-metadata-browser-v1', records: [record(1)] };
const full = { records: [record(1), record(2)] };

test('question-meta.js reads the browser copy when the release ships it, and only that file', async () => {
  const { data, requested, window } = await runQuestionMeta({ 'question-metadata-browser-v1.json': copy, 'question_metadata.json': full });
  assert.deepEqual(requested, ['question-metadata-browser-v1.json']);
  assert.equal(data.records.length, 1);
  assert.equal(window.getArchiveQuestionMetadata({ questionUid: 'qid_1' }).L3, 'L1');
});

test('question-meta.js reads the full sidecar when the copy is missing, unusable, or not a browser copy', async () => {
  for (const files of [
    { 'question_metadata.json': full },
    { 'question-metadata-browser-v1.json': { records: [record(1)] }, 'question_metadata.json': full },
    { 'question-metadata-browser-v1.json': { browserProjection: 'archive2-question-metadata-browser-v1' }, 'question_metadata.json': full },
  ]) {
    const { data, requested } = await runQuestionMeta(files);
    assert.deepEqual(requested, ['question-metadata-browser-v1.json', 'question_metadata.json']);
    assert.equal(data.records.length, 2);
  }
  const none = await runQuestionMeta({});
  assert.equal(none.data, null, 'with neither file the screens go on without approved metadata, as before');
});

test('the generator that writes question-meta.js carries the same loader', () => {
  const generator = read('archive/tools/intelligence/build-approved-question-metadata-v1.mjs');
  const loader = read('archive/question-meta.js').slice(read('archive/question-meta.js').indexOf('  // The release build ships a browser copy'));
  const wanted = loader.slice(0, loader.indexOf('    .then(data => {\n      state.data'));
  assert.ok(generator.includes(wanted), 'update build-approved-question-metadata-v1.mjs together with question-meta.js');
});

// ---- the original-exam window reads one exam's few KB instead of the whole copy (tools/lib/build-archive2-exam-meta-part.mjs) ----
const SHARDS = 'archive2-catalog-shards-v1/';
const examFiles = async (exam, { index, doc } = {}) => {
  const { examMetaKey } = await examMetaLib();
  const files = { 'question-metadata-browser-v1.json': copy, 'question_metadata.json': full };
  files[SHARDS + 'index.json'] = index === undefined ? { indexVersion: 'rel1', examMeta: { schemaVersion: 'archive2-exam-meta-v1' } } : index;
  if (doc !== null) files[SHARDS + 'exam-meta/' + examMetaKey(exam) + '.json'] = doc === undefined ? { schemaVersion: 'archive2-exam-meta-v1', indexVersion: 'rel1', sourceArchiveFile: 'a.js', records: [record(1)] } : doc;
  return files;
};

test('question-meta.js reads one exam file and the shard index, not the whole copy, when the window names its exam', async () => {
  for (const exam of ['a.js', 'exams/a.js', './exams/a.js', 'archive/exams/a.js?v=1']) {
    const { data, requested, window } = await runQuestionMeta(await examFiles('a.js'), { exam });
    assert.equal(requested.length, 2, exam);
    assert.ok(requested.some((name) => name === SHARDS + 'index.json') && requested.some((name) => name.startsWith(SHARDS + 'exam-meta/')), exam);
    assert.equal(data.records.length, 1);
    assert.equal(window.getArchiveQuestionMetadata({ sourceArchiveFile: 'a.js', sourceOrdinal: 1 }).L3, 'L1');
  }
});

test('an exam file that is missing, of another release or exam, or unusable is replaced by the usual copy without waiting', async () => {
  const good = { schemaVersion: 'archive2-exam-meta-v1', indexVersion: 'rel1', sourceArchiveFile: 'a.js', records: [record(1)] };
  const noIndex = await examFiles('a.js');
  delete noIndex[SHARDS + 'index.json'];
  const cases = {
    'no exam file': await examFiles('a.js', { doc: null }),
    'index without examMeta': await examFiles('a.js', { index: { indexVersion: 'rel1' } }),
    'no index': noIndex,
    'index of another release': await examFiles('a.js', { index: { indexVersion: 'rel2', examMeta: { schemaVersion: 'archive2-exam-meta-v1' } } }),
    'file of another exam': await examFiles('a.js', { doc: { ...good, sourceArchiveFile: 'b.js' } }),
    'file without records': await examFiles('a.js', { doc: { ...good, records: null } }),
    'file of another schema': await examFiles('a.js', { doc: { ...good, schemaVersion: 'archive2-exam-meta-v2' } }),
  };
  for (const [label, files] of Object.entries(cases)) {
    const { data, requested } = await runQuestionMeta(files, { exam: 'a.js' });
    assert.ok(requested.includes('question-metadata-browser-v1.json'), label);
    assert.equal(data.records.length, 1, label);
    assert.equal(data.examMetadata, undefined, label);
  }
  const noCrypto = await runQuestionMeta(await examFiles('a.js'), { exam: 'a.js', noCrypto: true });
  assert.deepEqual(noCrypto.requested, ['question-metadata-browser-v1.json'], 'no crypto: no exam file is asked for');
  const none = await runQuestionMeta(await examFiles('a.js'), {});
  assert.deepEqual(none.requested, ['question-metadata-browser-v1.json'], 'a page that names no exam is unchanged');
});

// Same run, both paths, every exam: the values the class registration reads (and every other merged field) must be the same.
test('for every exam the exam file gives the same merged questions as the browser copy', async (t) => {
  const sidecar = path.join(root, 'archive/data/question_metadata.json');
  if (!fs.existsSync(sidecar)) return t.skip('archive/data/question_metadata.json is not assembled in this checkout');
  const { projectQuestionMetadata } = await lib();
  const { examMetaExtras, projectExamMeta, examMetaKey, normalizeExamFile } = await examMetaLib();
  const browserCopy = JSON.parse(projectQuestionMetadata(fs.readFileSync(sidecar, 'utf8')).toString('utf8'));
  const extras = examMetaExtras(root, { exams: [{ file: 'exams/no-metadata-for-this-exam.js' }] });
  const part = projectExamMeta(extras, 'rel-test');
  assert.deepEqual([...projectExamMeta(extras, 'rel-test').files], [...part.files], 'two builds are the same');
  assert.equal(part.index.count, part.files.size);
  // the records of the copy, grouped by the name the lookup uses
  const grouped = new Map();
  for (const rec of browserCopy.records) {
    const name = String(rec.sourceArchiveFile || '');
    if (name !== normalizeExamFile(name)) continue;
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name).push(rec);
  }
  assert.ok(grouped.size > 100, 'the sidecar has records of many exams');
  const docs = new Map();
  for (const [rel, buffer] of part.files) { const doc = JSON.parse(buffer.toString('utf8')); docs.set(doc.sourceArchiveFile, { rel, doc }); }
  assert.equal([...docs.keys()].filter((name) => grouped.has(name)).length, grouped.size, 'every exam of the copy has a file');
  assert.deepEqual(docs.get('no-metadata-for-this-exam.js').doc.records, [], 'an exam without metadata gets an empty file');
  const indexDoc = { indexVersion: 'rel-test', examMeta: part.index };
  const plain = (value) => JSON.parse(JSON.stringify(value)); // two vm contexts: compare values, not prototypes
  const blank = (n) => ({ id: n });
  const filled = (n) => ({ id: n, standardUnitKey: 'KEEP', standardUnit: ' ', standardCourse: '', L3: 'X' });
  const viaCopy = await runQuestionMeta({ 'question-metadata-browser-v1.json': browserCopy }, {}); // the whole copy is indexed once; each exam is then read from its own file
  let questions = 0;
  for (const [name, { rel, doc }] of docs) {
    assert.equal(rel, 'exam-meta/' + examMetaKey(name) + '.json');
    assert.deepEqual(doc.records, grouped.get(name) || [], name);
    const files = { [SHARDS + 'index.json']: indexDoc, [SHARDS + rel]: doc, 'question-metadata-browser-v1.json': browserCopy };
    const viaExam = await runQuestionMeta(files, { exam: 'exams/' + name });
    assert.ok(viaExam.requested.every((file) => file !== 'question-metadata-browser-v1.json'), name + ' must not read the whole copy');
    const top = Math.max(0, ...(grouped.get(name) || []).map((rec) => Number(rec.sourceOrdinal) || 0)) + 1;
    for (let n = 1; n <= top; n++) for (const make of [blank, filled]) {
      const ref = { sourceArchiveFile: name, sourceOrdinal: n };
      assert.deepEqual(plain(viaExam.window.mergeArchiveQuestionMetadata(make(n), ref)), plain(viaCopy.window.mergeArchiveQuestionMetadata(make(n), ref)), name + "#" + n);
      questions++;
    }
  }
  assert.ok(questions > 1000);
});
