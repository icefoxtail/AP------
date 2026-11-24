'use strict';
// Catalog shards (tools/lib/build-archive2-catalog-shards.mjs), stage 1: the resolved question catalog cut per grade / subject,
// built and shipped but not read by any screen yet. These tests keep the shards honest without fixing the size of the data:
// same bytes on every build, every question once, no exam split, the version string the screens send, and no screen reading
// a column the shards drop.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const zlib = require('node:zlib');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const lib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-catalog-shards.mjs')).href);
const site = () => import(pathToFileURL(path.join(root, 'tools/build-archive-pages-site.mjs')).href);
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

// One real build for the whole file (about 5 s): the same loader and resolver the screens run, then the shards.
let builtOnce = null;
const built = async () => {
  if (!builtOnce) builtOnce = lib().then((m) => m.buildCatalogShards(root));
  return builtOnce;
};

test('two builds write the same bytes, and the written folder matches its index', async (t) => {
  const { buildCatalogShards } = await lib();
  const first = await built();
  const second = await buildCatalogShards(root);
  assert.equal(second.entries.length, first.entries.length);
  for (let i = 0; i < first.entries.length; i += 1) {
    assert.equal(second.entries[i].path, first.entries[i].path);
    assert.equal(sha256(second.entries[i].content), sha256(first.entries[i].content), `same bytes: ${first.entries[i].path}`);
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'archive2-shards-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  // the exam-meta files sit in a folder of their own, as the --write CLI writes them
  for (const entry of first.entries) {
    const out = path.join(dir, entry.path.slice(entry.path.indexOf('archive2-catalog-shards-v1/') + 'archive2-catalog-shards-v1/'.length));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, entry.content);
  }
  const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
  const onDisk = fs.readdirSync(dir, { withFileTypes: true }).filter((item) => item.isFile() && item.name !== 'index.json').map((item) => item.name).sort();
  const examMetaDir = path.join(dir, 'exam-meta');
  assert.equal(fs.existsSync(examMetaDir), Boolean(index.examMeta), 'the exam-meta folder is there exactly when the index announces it');
  if (index.examMeta) assert.equal(fs.readdirSync(examMetaDir).length, index.examMeta.count, 'every announced exam file is there and nothing else');
  assert.deepEqual(onDisk, [...index.shards.map((shard) => shard.path), index.common.path].sort(), 'every shard and the common file in the index exist and nothing else is there');
  for (const shard of index.shards) {
    const bytes = fs.readFileSync(path.join(dir, shard.path));
    assert.equal(bytes.length, shard.bytes, `bytes: ${shard.key}`);
    assert.equal(sha256(bytes), shard.sha256, `sha256: ${shard.key}`);
  }
});

// The release identity and the site build each build the shards in their own process and must get the same bytes. loadInputBundle
// stores each input file in `resources` when its async sha256 check finishes, so the key order of `resources` (and the order of the
// taxonomy rows resolveCatalog builds from it) followed the completion order of those digests: the same snapshot gave two different
// common.json files and the seal refused the package (releases 45271820186, 45273455821, 45274216004).
test('the shard bytes do not depend on the order in which the input digests finish', async () => {
  const { buildCatalogShards, withOrderedResources } = await lib();
  const bundle = { manifest: {}, resources: { 'b.json': 2, 'a.json': 1, 'c.json': 3 } };
  assert.deepEqual(Object.keys(withOrderedResources(bundle).resources), ['a.json', 'b.json', 'c.json'], 'resources are put in sorted key order');
  assert.deepEqual(Object.keys(bundle.resources), ['b.json', 'a.json', 'c.json'], 'the loaded bundle itself is left untouched');
  const subtle = globalThis.crypto.subtle;
  const original = subtle.digest.bind(subtle);
  const build = async (seed) => {
    let state = seed;
    const random = () => { state = (state * 1664525 + 1013904223) % 4294967296; return state / 4294967296; };
    Object.defineProperty(subtle, 'digest', {
      configurable: true,
      value: async (...args) => { const result = await original(...args); await new Promise((resolve) => setTimeout(resolve, Math.floor(random() * 8))); return result; },
    });
    try { return await buildCatalogShards(root); }
    finally { delete subtle.digest; } // back to the prototype's own digest
  };
  const reference = await built();
  for (const seed of [1, 2]) {
    const jittered = await build(seed);
    assert.equal(jittered.entries.length, reference.entries.length);
    for (let i = 0; i < reference.entries.length; i += 1) {
      assert.equal(jittered.entries[i].path, reference.entries[i].path);
      assert.equal(sha256(jittered.entries[i].content), sha256(reference.entries[i].content), `same bytes when digests finish in another order (seed ${seed}): ${reference.entries[i].path}`);
    }
  }
});

test('the index names the inputs: its version is the one the screens send to the server', async () => {
  const { index, catalog } = await built();
  const canonical = require(path.join(root, 'archive/archive2-canonical.js'));
  const manifest = JSON.parse(read('archive/data/archive2-canonical-input-manifest.json'));
  // index_version / papers[].meta.indexVersion = state.catalog.indexVersion = versionBundle.projectionVersion
  // (archive2-workspace-save.js; the Worker loads the bundle with expectedVersion = this string).
  assert.equal(index.indexVersion, await canonical.computeProjectionVersion(manifest.files));
  assert.equal(index.indexVersion, manifest.projectionVersion);
  assert.equal(index.indexVersion, catalog.indexVersion);
  assert.equal(index.catalogIdentityDigest, JSON.parse(read('archive/data/archive2-catalog.json')).identityDigest);
  assert.equal(index.schemaVersion, 'archive2-catalog-shards-v1');
  assert.equal('commit' in index || 'builtAt' in index || 'generatedAt' in index, false, 'no commit or time in the index (two builds are the same bytes)');
  assert.ok(index.shards.length > 0 && index.courses.length > 0);
});

test('every question is in exactly one shard, with the same values in every column the shards keep', async () => {
  const { index, files, catalog } = await built();
  const m = await lib();
  const dropped = new Set(m.DROPPED_RECORD_FIELDS);
  const projected = m.PROJECTED_RECORD_FIELDS;
  const byUid = new Map(catalog.records.map((record) => [record.questionUid, { record }]));
  assert.equal(byUid.size, catalog.records.length, 'the catalog has no duplicate question uid');
  const seen = new Set();
  let total = 0;
  for (const shard of index.shards) {
    const doc = JSON.parse(files.get(shard.path).toString('utf8'));
    assert.equal(doc.schemaVersion, 'archive2-catalog-shard-v2');
    assert.equal(doc.key, shard.key);
    assert.equal(doc.indexVersion, index.indexVersion);
    assert.equal(doc.records.length, shard.records);
    const exams = new Set();
    for (const slim of doc.records) {
      assert.equal(seen.has(slim.questionUid), false, `duplicate in shards: ${slim.questionUid}`);
      seen.add(slim.questionUid);
      const hit = byUid.get(slim.questionUid);
      assert.ok(hit, `a shard question is not in the catalog: ${slim.questionUid}`);
      exams.add(slim.sourceFile);
      const full = hit.record;
      for (const key of Object.keys(slim)) assert.ok(Object.hasOwn(full, key), `a shard column the catalog does not have: ${key}`);
      for (const key of Object.keys(full)) {
        if (dropped.has(key)) { assert.equal(Object.hasOwn(slim, key), false, `dropped column is present: ${key}`); continue; }
        // a column whose value is undefined (resolveCatalog sets `level` that way on some rows) is not written by JSON; reading it gives undefined either way
        if (full[key] === undefined) { assert.equal(slim[key], undefined); continue; }
        assert.ok(Object.hasOwn(slim, key), `kept column is missing: ${key} (${slim.questionUid})`);
        if (Object.hasOwn(projected, key)) continue;
        assert.equal(JSON.stringify(slim[key]), JSON.stringify(full[key]), `value differs: ${key} (${slim.questionUid})`);
      }
      // projected evidence columns: only the keys a screen reads, with the catalog's own values
      if (Object.hasOwn(full, 'assignmentEvidence')) {
        const ev = full.assignmentEvidence;
        const expected = ev && typeof ev === 'object' && ev.reviewEvidence && typeof ev.reviewEvidence === 'object'
          ? { reviewEvidence: Object.fromEntries(['reference', 'sha256'].filter((k) => Object.hasOwn(ev.reviewEvidence, k)).map((k) => [k, ev.reviewEvidence[k]])) }
          : {};
        assert.equal(JSON.stringify(slim.assignmentEvidence), JSON.stringify(ev ? expected : ev), `assignmentEvidence: ${slim.questionUid}`);
      }
      if (Object.hasOwn(full, 'metadataAssignmentEvidence')) {
        const ev = full.metadataAssignmentEvidence;
        const expected = Object.fromEntries(Object.keys(ev || {}).filter((k) => ['fieldStatus', 'metadataRevision', 'rpmMetadata', 'sourceFingerprint'].includes(k)).map((k) => [k, ev[k]]));
        assert.equal(JSON.stringify(slim.metadataAssignmentEvidence), JSON.stringify(ev ? expected : ev), `metadataAssignmentEvidence: ${slim.questionUid}`);
      }
    }
    total += doc.records.length;
  }
  assert.equal(total, catalog.records.length, 'no question missing');
  assert.equal(seen.size, catalog.records.length);
  assert.equal(index.recordCount, catalog.records.length);
});

test('an exam is never split across shards, and the index finds the shard of every exam', async () => {
  const { index, files, catalog } = await built();
  const shardOfUid = new Map();
  const filesOfShard = new Map();
  for (const shard of index.shards) {
    const doc = JSON.parse(files.get(shard.path).toString('utf8'));
    const set = new Set();
    for (const record of doc.records) {
      shardOfUid.set(record.questionUid, shard.key);
      set.add(record.sourceFile);
    }
    assert.equal(set.size, shard.exams, `exam count of ${shard.key}`);
    filesOfShard.set(shard.key, set);
  }
  const shardsOfExam = new Map();
  for (const record of catalog.records) {
    const set = shardsOfExam.get(record.sourceFile) || new Set();
    set.add(shardOfUid.get(record.questionUid));
    shardsOfExam.set(record.sourceFile, set);
  }
  for (const [file, set] of shardsOfExam) {
    assert.equal(set.size, 1, `exam split across shards: ${file}`);
    assert.equal(index.examShard[file], [...set][0], `examShard names the shard of ${file}`);
  }
  for (const exam of catalog.exams) {
    if (shardsOfExam.has(exam.file)) continue;
    assert.ok(index.examShard[exam.file] === undefined || filesOfShard.has(index.examShard[exam.file]), `a question-less exam points at a real shard: ${exam.file}`);
  }
  // courses own their shards exactly once
  const owned = index.courses.flatMap((course) => course.shards);
  assert.deepEqual([...owned].sort(), index.shards.map((shard) => shard.key).sort());
  assert.equal(new Set(owned).size, owned.length);
  for (const shard of index.shards) assert.ok(index.courses.find((course) => course.key === shard.course)?.shards.includes(shard.key));
});

test('a shard is small enough to fetch: gzip under 2 MB, and the index is a small file', async () => {
  const { index, files, entries } = await built();
  const m = await lib();
  for (const shard of index.shards) {
    const gz = zlib.gzipSync(files.get(shard.path), { level: 6 }).length;
    assert.ok(gz <= m.SHARD_GZIP_TARGET_BYTES, `${shard.key}: ${gz} bytes gzip is over the 2 MB target (lower SHARD_RAW_LIMIT_BYTES or split by a finer rule)`);
  }
  const indexEntry = entries.find((entry) => entry.path.endsWith('/index.json'));
  assert.ok(indexEntry.bytes < 1_000_000, `index.json is ${indexEntry.bytes} bytes`);
  assert.ok(zlib.gzipSync(indexEntry.content).length < 100_000, 'index.json compresses below 100 KB');
});

// ---- no screen reads a column the shards drop -------------------------------------------------------------------------
const SKIP_DIRS = new Set(['exams', 'data', 'assets', 'generated', 'vendor', 'tools', '_generated', 'node_modules', 'worker-backup', 'fixtures', 'evidence', 'prototypes', 'docs', 'textbook', 'images', 'generated-lite']);
function consumerFiles() {
  const out = [];
  const walk = (rel) => {
    const abs = path.join(root, rel);
    const stat = fs.statSync(abs, { throwIfNoEntry: false });
    if (!stat) return;
    if (stat.isFile()) { if (/\.(js|mjs|cjs|html)$/.test(rel) && !/\.generated\.js$/.test(rel)) out.push(rel); return; }
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
      walk(`${rel}/${entry.name}`);
    }
  };
  for (const dir of ['archive', 'apmath', 'shared']) walk(dir);
  return out;
}
function cutFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return source;
  let depth = 0;
  for (let i = source.indexOf('{', source.indexOf(')', start)); i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') { depth -= 1; if (depth === 0) return source.slice(0, start) + source.slice(i + 1); }
  }
  return source;
}
const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[\s;,{}(])\/\/[^\n]*/g, '$1');
// archive2-canonical.js builds the catalog (resolveCatalog, decodeCatalog and issuedParentDisplayProjection, which only resolveCatalog calls, read the
// catalog file's rows and write these columns); everything else in it, and every other
// file, is a reader. A column is "read" when its name appears in a reader as an identifier or a string.
function readerSources() {
  const map = new Map();
  for (const file of consumerFiles()) {
    let source = fs.readFileSync(path.join(root, file), 'utf8');
    if (source.length > 3_000_000) continue;
    if (file === 'archive/archive2-canonical.js') source = ['resolveCatalog', 'decodeCatalog', 'issuedParentDisplayProjection'].reduce(cutFunction, source);
    map.set(file, stripComments(source));
  }
  return map;
}
const word = (name) => new RegExp(`(?<![A-Za-z0-9_$])${name}(?![A-Za-z0-9_$])`);

test('no screen script reads a column the shards drop', async () => {
  const { DROPPED_RECORD_FIELDS } = await lib();
  assert.equal(new Set(DROPPED_RECORD_FIELDS).size, DROPPED_RECORD_FIELDS.length, 'no column is listed twice');
  const readers = readerSources();
  const reads = [];
  for (const name of DROPPED_RECORD_FIELDS) {
    const re = word(name);
    for (const [file, source] of readers) if (re.test(source)) reads.push(`${file}: ${name}`);
  }
  assert.deepEqual(reads, [], 'a script reads a column that the shard builder drops: take it off DROPPED_RECORD_FIELDS (or stop reading it)');
});

test('evidence columns are cut to exactly the keys the screens read', async () => {
  const { PROJECTED_RECORD_FIELDS } = await lib();
  const readers = readerSources();
  const wrong = [];
  const bare = [];
  const allowedMeta = new Set(PROJECTED_RECORD_FIELDS.metadataAssignmentEvidence);
  const reviewKeys = new Set(PROJECTED_RECORD_FIELDS.assignmentEvidence.reviewEvidence);
  let metaReads = 0; let evidenceReads = 0;
  for (const [file, source] of readers) {
    for (const m of source.matchAll(/metadataAssignmentEvidence(\s*\?\.\s*|\s*\.\s*)?([A-Za-z_$][\w$]*)?/g)) {
      if (!m[1] || !m[2]) { bare.push(`${file}: metadataAssignmentEvidence`); continue; }
      metaReads += 1;
      if (!allowedMeta.has(m[2])) wrong.push(`${file}: metadataAssignmentEvidence.${m[2]}`);
    }
    for (const m of source.matchAll(/(?<![A-Za-z0-9_$])assignmentEvidence(?![A-Za-z0-9_$])(\s*\?\.\s*|\s*\.\s*)?(?:([A-Za-z_$][\w$]*)(\s*\?\.\s*|\s*\.\s*)?([A-Za-z_$][\w$]*)?)?/g)) {
      if (!m[1] || m[2] !== 'reviewEvidence' || !m[3] || !reviewKeys.has(m[4])) { bare.push(`${file}: assignmentEvidence${m[1] || ''}${m[2] || ''}${m[3] || ''}${m[4] || ''}`); continue; }
      evidenceReads += 1;
    }
  }
  assert.ok(metaReads > 0 && evidenceReads > 0, 'the readers of the evidence columns were found');
  assert.deepEqual(wrong, [], 'a script reads a key of metadataAssignmentEvidence the shards cut: add it to PROJECTED_RECORD_FIELDS');
  // the only other mentions are the resolver's own (resolveCatalog is cut out above) and the Worker bundle's source-level fields:
  // a whole-object use would read every key, so none may exist
  assert.deepEqual(bare, [], 'a script passes a cut evidence column on as a whole object (or reads another key of assignmentEvidence)');
});

test('the columns the server compares and the eligibility checks read are all kept', async () => {
  const { DROPPED_RECORD_FIELDS, PROJECTED_RECORD_FIELDS } = await lib();
  const core = require(path.join(root, 'archive/archive2-core.js'));
  assert.ok(Array.isArray(core.META_FIELDS) && core.META_FIELDS.length > 10, 'META_FIELDS is exported (the Worker compares exactly these against the client)');
  const cut = new Set([...DROPPED_RECORD_FIELDS, ...Object.keys(PROJECTED_RECORD_FIELDS)]);
  for (const field of core.META_FIELDS) assert.equal(cut.has(field), false, `META_FIELDS column ${field} must stay in the shards`);
  // validateBasicAssignment / validateAdvancedAssignment (archive2-canonical.js) and the questionUid / fingerprint columns
  for (const field of ['questionUid', 'sourceFile', 'sourceOrdinal', 'identityStatus', 'sourceGrade', 'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4',
    'assignmentFingerprint', 'sourceFingerprint', 'currentSourceJsSha256', 'problemTypeKey', 'templateKey', 'metaHintPT', 'metaHintTPL', 'difficultyBucket',
    'legacyLevelCompatibility', 'standardUnitKey', 'subUnitKey', 'year', 'school', 'sourceIntegrityStatus', 'sourceStatus']) {
    assert.equal(cut.has(field), false, `${field} must stay in the shards`);
  }
});

test('dynamic reads of a record go through name lists the scan sees, and whole-record copies are listed', async (t) => {
  // `record[expr]` reads and `{ ...record }` copies could read or carry a dropped column without naming it. Report them (the PR lists
  // them); every column list they loop over is a list of string names in a reader script, which the scan above covers.
  const readers = readerSources();
  const dynamic = [];
  const spreads = [];
  for (const [file, source] of readers) {
    if (/archive\/archive2-canonical\.js$/.test(file)) continue;
    for (const m of source.matchAll(/(?<![A-Za-z0-9_$.])(record|rec|candidate|resolved|catalogRecord|sourceRecord)\[(?!['"`\d])([^\]]{1,40})\]/g)) dynamic.push(`${file}: ${m[1]}[${m[2]}]`);
    for (const m of source.matchAll(/\.\.\.(record|rec|candidate|resolved)\b/g)) spreads.push(`${file}: ...${m[1]}`);
  }
  t.diagnostic(`dynamic record[...] reads (${dynamic.length}): ${[...new Set(dynamic)].join(' | ')}`);
  t.diagnostic(`whole-record spreads (${spreads.length}): ${[...new Set(spreads)].join(' | ')}`);
  assert.ok(dynamic.length < 200 && spreads.length < 200);
});

// ---- the rules, on small synthetic data --------------------------------------------------------------------------------
const aliasDoc = {
  spellingGroups: [
    { id: 'MIDDLE1', grade: '중1', members: ['중1 수학'] },
    { id: 'H15_COMMON_SANG', grade: '고1', members: ['수학(상)', '수학_상'] },
    { id: 'H22_COMMON1', grade: '고1', members: ['공통수학1'] },
    { id: 'H15_MATH1', grade: '고2', members: ['수학I', '수학Ⅰ'] },
    { id: 'H22_ALGEBRA', grade: '고2', members: ['대수'] },
    { id: 'GEOMETRY', grade: '고2', members: ['기하', '기하와 벡터'] },
  ],
  successorGroups: [
    { id: 'HIGH1_COMMON', subject: '고1 공통 수학', curricula: { 2015: ['수학(상)'], 2022: ['공통수학1'] } },
    { id: 'HIGH2_MATH1', subject: '수학I / 대수', curricula: { 2015: ['수학I'], 2022: ['대수'] } },
  ],
};
const VERSION = `archive2-canonical-v1:${'a'.repeat(64)}`;
const uidOf = (n) => `qid_v1_${String(n).padStart(64, '0')}`;
function syntheticCatalog(exams, perExam = 3) {
  const records = [];
  let n = 0;
  for (const exam of exams) for (let i = 1; i <= perExam; i += 1) {
    n += 1;
    records.push({ questionUid: uidOf(n), sourceFile: exam.file, sourceOrdinal: i, sourceGrade: exam.grade, subject: exam.subject, year: exam.year, difficultyBucket: 2,
      rawQuestionHash: 'h'.repeat(64), metadataAssignmentEvidence: { fieldStatus: { a: 'x' }, evidenceRefs: ['big'], questionUid: uidOf(n) },
      assignmentEvidence: { questionUid: uidOf(n), reviewEvidence: { status: 'PASS', reference: 'r', sha256: 's'.repeat(64) } } });
  }
  return { indexVersion: VERSION, identityDigest: 'b'.repeat(64), exams, records };
}
const exam = (file, grade, subject, extra = {}) => ({ file, grade, subject, year: 2025, semester: '1', ...extra });

test('middle school is cut by grade, high school by subject with the 2015 and 2022 names together', async () => {
  const { projectCatalogShards, makeCourseBuckets, bucketOfExam } = await lib();
  const exams = [
    exam('original/middle/m1/a.js', '중1', '수학'), exam('original/middle/m2/b.js', '중2', '수학'),
    exam('original/high/h2/c.js', '고2', '수학Ⅰ'), exam('original/high/h2/d.js', '고2', '대수'),
    exam('original/high/h1/e.js', '고1', '공통수학1'), exam('original/high/h1/f.js', '고1', '수학_상'), exam('original/high/h1/g.js', '고1', '수학'),
    exam('original/high/h2/h.js', '고2', '기하와벡터'), exam('textbooks/x/y.js', '고2', '', { primaryStandardCourse: '대수' }),
    exam('original/high/h3/z.js', '고3', '알 수 없는 과목'),
  ];
  const { index } = projectCatalogShards(syntheticCatalog(exams), aliasDoc);
  const keyOf = (file) => index.examShard[file];
  assert.equal(keyOf('original/middle/m1/a.js'), 'm1');
  assert.equal(keyOf('original/middle/m2/b.js'), 'm2');
  assert.equal(keyOf('original/high/h2/c.js'), keyOf('original/high/h2/d.js'), '수학I and 대수 are one subject');
  assert.equal(keyOf('textbooks/x/y.js'), keyOf('original/high/h2/d.js'), 'the registered course of a textbook set decides');
  assert.equal(keyOf('original/high/h1/e.js'), keyOf('original/high/h1/f.js'), '공통수학1 and 수학(상) are one subject');
  assert.equal(keyOf('original/high/h1/g.js'), keyOf('original/high/h1/e.js'), 'a 고1 exam that names no course is the 고1 common course');
  assert.notEqual(keyOf('original/high/h2/h.js'), keyOf('original/high/h2/c.js'));
  assert.equal(keyOf('original/high/h3/z.js'), 'etc', 'an exam with no known course is kept in the other shard, not dropped');
  const buckets = makeCourseBuckets(aliasDoc);
  assert.equal(bucketOfExam({ grade: '고2', subject: '대수c' }, buckets, null).key, 'high2-math1', 'the file-name "c" suffix of a subject is ignored');
  assert.equal(index.recordCount, exams.length * 3);
  // 문제은행 검색 puts a generated question (a subject name, no exam) into a course by `names`: every spelling of a course an exam resolved to is in it
  for (const course of index.courses) assert.equal(course.kind === 'course', Array.isArray(course.names) && course.names.length > 0, `${course.key}: only subject courses carry names`);
  for (const item of exams.filter((e) => /^고/.test(e.grade) && e.subject)) {
    const course = index.courses.find((c) => c.key === keyOf(item.file));
    if (!course || course.key === 'etc') continue;
    const name = item.subject.normalize('NFC').replace(/\s/g, '');
    const hit = (course.names || []).includes(name) || (course.names || []).includes(name.replace(/c$/, ''));
    if (item.subject !== '수학') assert.ok(hit, `${item.file}: ${item.subject} is a name of ${course.key}`);
  }
});

test('a shard over the size limit is split by semester, then by year; an exam stays whole; the rule is in the index', async () => {
  const { projectCatalogShards } = await lib();
  const exams = [];
  for (let y = 2020; y <= 2025; y += 1) for (const semester of ['1', '2']) for (const part of ['a', 'b']) exams.push(exam(`original/high/h2/${y}_${semester}${part}.js`, '고2', '대수', { year: y, semester }));
  const catalog = syntheticCatalog(exams, 4);
  const whole = projectCatalogShards(catalog, aliasDoc, { limit: 10_000_000 });
  assert.equal(whole.index.shards.length, 1);
  const bySemester = projectCatalogShards(catalog, aliasDoc, { limit: Math.ceil(whole.index.shards[0].bytes * 0.6) });
  assert.deepEqual(bySemester.index.shards.map((s) => s.split.by), ['semester', 'semester']);
  assert.deepEqual(bySemester.index.shards.map((s) => s.key), ['high2-math1-s1', 'high2-math1-s2']);
  const byYear = projectCatalogShards(catalog, aliasDoc, { limit: Math.ceil(whole.index.shards[0].bytes * 0.2) });
  assert.ok(byYear.index.shards.length > 2);
  assert.ok(byYear.index.shards.every((s) => s.split.by === 'semester+year' && s.split.yearFrom <= s.split.yearTo));
  for (const { index } of [bySemester, byYear]) {
    assert.equal(index.recordCount, catalog.records.length);
    assert.equal(new Set(Object.values(index.examShard)).size, index.shards.length);
    assert.equal(Object.keys(index.examShard).length, exams.length);
    assert.equal(index.courses.length, 1);
    assert.deepEqual(index.courses[0].shards, index.shards.map((s) => s.key), 'the course lists every piece, so a screen needs no rule');
  }
  // the same input is the same bytes
  const again = projectCatalogShards(catalog, aliasDoc, { limit: Math.ceil(whole.index.shards[0].bytes * 0.2) });
  assert.equal(again.indexContent.toString('utf8'), byYear.indexContent.toString('utf8'));
});

test('the slim record drops the listed columns, cuts the evidence columns, and keeps everything else in order', async () => {
  const { slimRecord, DROPPED_RECORD_FIELDS } = await lib();
  const record = { questionUid: 'u', rawQuestionHash: 'x', newFutureColumn: { a: 1 }, assignmentEvidence: { questionUid: 'u', reviewEvidence: { status: 'PASS', reference: 'r', sha256: 's' } },
    metadataAssignmentEvidence: { questionUid: 'u', fieldStatus: { a: 1 }, evidenceRefs: ['e'], metadataRevision: 'm', sourceFingerprint: 'f' }, legacyLevel: '하', sourceFile: 'f' };
  const slim = slimRecord(record);
  assert.deepEqual(Object.keys(slim), ['questionUid', 'newFutureColumn', 'assignmentEvidence', 'metadataAssignmentEvidence', 'sourceFile']);
  assert.deepEqual(slim.assignmentEvidence, { reviewEvidence: { reference: 'r', sha256: 's' } });
  assert.deepEqual(slim.metadataAssignmentEvidence, { fieldStatus: { a: 1 }, metadataRevision: 'm', sourceFingerprint: 'f' });
  assert.ok(DROPPED_RECORD_FIELDS.includes('rawQuestionHash') && DROPPED_RECORD_FIELDS.includes('legacyLevel'));
});

// ---- the release: a shard failure never stops the student site ----------------------------------------------------------
test('addCatalogShards: off without the manifest flag, skipped (with a warning) when the build fails, built on the real inputs', async () => {
  const { addCatalogShards } = await site();
  const base = (dir) => ({ root: dir, entries: [{ path: 'index.html', bytes: 10 }], totalBytes: 10, maxBytes: 1_000_000_000, sizeSummary: {} });
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'archive2-shards-empty-'));
  try {
    const off = await addCatalogShards(base(empty), { manifest: {}, log: () => assert.fail('no warning when the flag is off') });
    assert.equal(off.catalogShards.status, 'OFF');
    assert.equal(off.entries.length, 1);
    const logs = [];
    const skipped = await addCatalogShards(base(empty), { manifest: { catalogShards: true }, log: (line) => logs.push(line) });
    assert.equal(skipped.catalogShards.status, 'SKIPPED');
    assert.deepEqual(skipped.entries, base(empty).entries, 'the plan is unchanged: the site ships without shards');
    assert.equal(skipped.totalBytes, 10);
    assert.equal(logs.length, 1);
    assert.match(logs[0], /^::warning title=Catalog shards skipped::/);
  } finally { fs.rmSync(empty, { recursive: true, force: true }); }
  const ok = await addCatalogShards(base(root), { manifest: { catalogShards: true }, log: (line) => assert.fail(`unexpected warning: ${line}`) });
  assert.equal(ok.catalogShards.status, 'BUILT');
  const shardEntries = ok.entries.filter((entry) => entry.catalogShardInputs);
  assert.ok(shardEntries.length > 1 && shardEntries.every((entry) => entry.path.startsWith('archive/data/archive2-catalog-shards-v1/')));
  assert.ok(ok.entries.some((entry) => entry.path === 'archive/data/archive2-catalog-shards-v1/index.json'));
  assert.equal(ok.totalBytes, 10 + shardEntries.reduce((sum, entry) => sum + entry.bytes, 0));
  const conflict = await addCatalogShards({ ...base(root), entries: [{ path: 'archive/data/archive2-catalog-shards-v1/index.json', bytes: 1 }] },
    { manifest: { catalogShards: true }, log: () => {} });
  assert.equal(conflict.catalogShards.status, 'SKIPPED');
  const tooBig = await addCatalogShards({ ...base(root), maxBytes: 1000 }, { manifest: { catalogShards: true }, log: () => {} });
  assert.equal(tooBig.catalogShards.status, 'SKIPPED', 'shards never push the site over the Pages limit');
});

test('the release manifest turns the shards on, and the output folder is git-ignored and not named like evidence', () => {
  const manifest = JSON.parse(read('tools/archive-pages-release-manifest.json'));
  assert.equal(manifest.catalogShards, true);
  assert.match(read('.gitignore'), /^\/archive\/data\/archive2-catalog-shards-v1\/$/m);
  assert.doesNotMatch('archive/data/archive2-catalog-shards-v1', /snapshot|capture|backup|patchpack/i);
});
