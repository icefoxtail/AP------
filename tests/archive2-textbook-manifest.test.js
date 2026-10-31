// S11: registered 2022 textbooks. The reviewed manifest archive/data/textbook-source-manifest-v1.json
// is the single source of grade evidence for textbooks/<folder>/... paths. The catalog builder, the
// core matcher (archive2-canonical pathGrade) and the Worker saved-paper replay (which bundles the
// same module) must agree with it, and every textbook JS must be registered in archive/db.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const core = require('../archive/archive2-core.js');
const canonical = require('../archive/archive2-canonical.js');
const Unified = require('../archive/archive2-unified-units.js');
const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');

const root = path.resolve(__dirname, '..');
const archiveDir = path.join(root, 'archive');
const examsDir = path.join(archiveDir, 'exams');
const manifest = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data/textbook-source-manifest-v1.json'), 'utf8'));
const db = vm.runInNewContext(fs.readFileSync(path.join(archiveDir, 'db.js'), 'utf8') + ';window.mainDB', { window: {} });
const textbookRows = db.exams.filter(row => row.file.startsWith('textbooks/'));

function walk(directory, extension, out = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, extension, out);
    else if (!extension || entry.name.endsWith(extension)) out.push(full);
  }
  return out;
}
const rel = file => path.relative(examsDir, file).split(path.sep).join('/').normalize('NFC');
const folderOf = file => file.split('/')[1];
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

let catalogPromise;
const catalog = () => (catalogPromise ||= productionCatalog().then(result => result.data));

test('the embedded core table equals the reviewed manifest (the Worker bundles the same module)', () => {
  const expected = Object.fromEntries(Object.entries(manifest.folders).map(([folder, cfg]) =>
    [folder, { grade: cfg.grade, unitKeys: cfg.unitKeys }]));
  assert.deepEqual(JSON.parse(JSON.stringify(canonical.TEXTBOOK_SOURCES)), expected);
  assert.equal(core.Canonical.TEXTBOOK_SOURCES, canonical.TEXTBOOK_SOURCES);
  for (const cfg of Object.values(manifest.folders)) {
    assert.equal(cfg.curriculum, '2022', 'registered textbooks are 2022 revised-curriculum sets; no key conversion');
    assert.match(cfg.grade, /^고[123]$/);
  }
});

test('every textbook JS is registered with the manifest grade, except the declared byte-identical duplicate', () => {
  const registered = new Map(textbookRows.map(row => [row.file, row]));
  const duplicates = manifest.unregisteredDuplicateFolders;
  let sources = 0;
  for (const file of walk(path.join(examsDir, 'textbooks'), '.js').map(rel)) {
    const folder = folderOf(file);
    if (duplicates[folder]) {
      assert.equal(registered.has(file), false, `duplicate folder file must stay unregistered: ${file}`);
      continue;
    }
    sources++;
    assert.ok(manifest.folders[folder], `unmanifested textbook folder: ${folder}`);
    const row = registered.get(file);
    assert.ok(row, `textbook source not registered in db.js: ${file}`);
    assert.equal(row.grade, manifest.folders[folder].grade, file);
    assert.equal(row.examType, 'textbook');
    assert.equal(row.contentType, '교과서');
    assert.equal(row.school, manifest.folders[folder].publisher);
    assert.equal(row.subject, manifest.folders[folder].subject);
    assert.equal(row.primaryStandardCourse, manifest.folders[folder].subject);
  }
  assert.equal(sources, textbookRows.length, 'every registered textbook row has a source file');
  // Invariants instead of an exact count (the registered set keeps growing): registration and source files match
  // one-to-one (above), no duplicate registrations, and every registered file exists on disk.
  assert.equal(new Set(textbookRows.map(row => row.file)).size, textbookRows.length, 'duplicate textbook registration');
  for (const row of textbookRows) assert.ok(fs.existsSync(path.join(examsDir, row.file)), `registered textbook source missing: ${row.file}`);
  for (const row of textbookRows) assert.ok(manifest.folders[folderOf(row.file)], row.file);
});

test('the unregistered duplicate folder is byte-identical to the folder it duplicates', () => {
  for (const [folder, info] of Object.entries(manifest.unregisteredDuplicateFolders)) {
    const base = path.join(examsDir, 'textbooks');
    const hashes = name => Object.fromEntries(walk(path.join(base, name)).map(file =>
      [path.relative(path.join(base, name), file).normalize('NFC'), sha(file)]));
    assert.ok(manifest.folders[info.duplicateOf], `${folder} duplicates a registered folder`);
    assert.deepEqual(hashes(folder), hashes(info.duplicateOf));
  }
});

test('questions in registered textbook sources agree with the manifest grade and course', () => {
  for (const row of textbookRows) {
    const cfg = manifest.folders[folderOf(row.file)];
    const window = {};
    vm.runInNewContext(fs.readFileSync(path.join(examsDir, row.file), 'utf8'), { window }, { timeout: 5000 });
    const questions = window.questionBank;
    assert.ok(Array.isArray(questions) && questions.length > 0, row.file);
    assert.equal(questions.length, row.qCount, `${row.file}: qCount`);
    for (const question of questions) {
      if (/^[중고][123]$/.test(question.level || '')) assert.equal(question.level, cfg.grade, `${row.file} #${question.id}: level`);
      if (question.standardCourse && cfg.unitKeys === 'chapter')
        assert.equal(question.standardCourse, cfg.questionStandardCourse, `${row.file} #${question.id}: course`);
    }
  }
});

test('the registration builder reproduces the committed db.js rows for the textbook sources', () => {
  const script = `
import json, sys
sys.path.insert(0, ${JSON.stringify(archiveDir)})
import build_db
from pathlib import Path
archive = Path(${JSON.stringify(archiveDir)})
manifest = build_db.load_textbook_manifest(archive)
files, unmanifested, duplicates = build_db.collect_textbook_js_files(archive / "exams", manifest)
rows = {}
for info in files:
    if manifest["folders"][info["folder"]]["unitKeys"] != "chapter":
        continue
    rows[info["rel_path"]] = build_db.build_textbook_row(info, manifest["folders"][info["folder"]])
print(json.dumps({"rows": rows, "unmanifested": unmanifested, "duplicates": duplicates}, ensure_ascii=False))
`;
  const result = spawnSync('python3', ['-c', script], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  const built = JSON.parse(result.stdout);
  assert.deepEqual(built.unmanifested, []);
  assert.equal(built.duplicates.length, 8);
  const registered = new Map(textbookRows.map(row => [row.file, row]));
  let generated = 0;
  for (const [file, row] of Object.entries(built.rows)) {
    const committed = registered.get(file);
    assert.ok(committed, file);
    // Rows that predate the manifest (profile-keyed sets) are preserved verbatim by the builder;
    // the chapter-keyed rows are exactly what the builder derives from source + manifest.
    assert.deepEqual(JSON.parse(JSON.stringify(committed)), row, `${file}: chapter-keyed rows equal the builder output`);
    generated++;
  }
  assert.equal(generated, 76);
});

test('textbook paths resolve a source grade from reviewed evidence only', () => {
  const first = textbookRows.find(row => row.file.startsWith('textbooks/미래엔_대수/'));
  assert.deepEqual(canonical.resolveSourceGrade({
    registeredGrade: first.grade, sourceFile: first.file, identitySourceFile: first.file,
  }), { grade: '고2', status: 'VALID', reason: '' });
  const profileSet = textbookRows.find(row => row.file.startsWith('textbooks/백발백중_공통수학2/'));
  assert.equal(canonical.resolveSourceGrade({
    registeredGrade: '고1', sourceFile: profileSet.file, identitySourceFile: profileSet.file,
  }).status, 'VALID');
  // The registered grade must still agree with the manifest, the identity path must be the same file.
  assert.equal(canonical.resolveSourceGrade({
    registeredGrade: '고1', sourceFile: first.file, identitySourceFile: first.file,
  }).status, 'SOURCE_GRADE_CONFLICT');
  assert.equal(canonical.resolveSourceGrade({
    registeredGrade: '고2', sourceFile: first.file, identitySourceFile: profileSet.file,
  }).status, 'SOURCE_GRADE_CONFLICT');
  // Unreviewed folders, the unregistered duplicate and path tricks never resolve.
  for (const bad of [
    'textbooks/새출판사_대수/a.js',
    'textbooks/비상_미적분1/비상_미적분1_미분_익힘책_고2/비상_미적분1_미분_익힘책_고2.js',
    'textbooks/a.js',
    'textbooks/__proto__/a.js',
    'textbooks/constructor/a.js',
  ]) {
    assert.equal(canonical.resolveSourceGrade({ registeredGrade: '고2', sourceFile: bad, identitySourceFile: bad }).status,
      'SOURCE_GRADE_UNRESOLVED', bad);
  }
  assert.equal(canonical.pathGrade('exams/textbooks/미래엔_대수/x.js'), '고2');
  assert.equal(canonical.pathGrade('original/high/h1/1mid/x.js'), '고1');
  assert.equal(canonical.pathGrade('original/middle/m2/1mid/x.js'), '중2');
  // The snapshot replay path (Worker saved papers) uses the same evidence.
  assert.deepEqual(canonical.resolveSnapshotSourceGrade({
    preservedGrade: '고1', sourceFile: profileSet.file, identitySourceFile: profileSet.file,
  }), { grade: '고1', status: 'VALID', reason: '' });
  assert.equal(canonical.resolveSnapshotSourceGrade({
    preservedGrade: '고2', sourceFile: profileSet.file, identitySourceFile: profileSet.file,
  }).status, 'SOURCE_GRADE_CONFLICT');
});

test('catalog: every registered textbook question has a resolved grade and a verified identity', async () => {
  const data = await catalog();
  const records = data.records.filter(record => record.sourceFile.startsWith('textbooks/'));
  const expected = textbookRows.reduce((sum, row) => sum + row.qCount, 0);
  assert.equal(records.length, expected, 'catalog carries every textbook question');
  assert.ok(expected >= 2527 + 1000, 'newly registered sets add to the 2,527 previously unresolved questions');
  const statuses = {};
  for (const record of records) {
    const cfg = manifest.folders[folderOf(record.sourceFile)];
    statuses[record.sourceGradeStatus] = (statuses[record.sourceGradeStatus] || 0) + 1;
    assert.equal(record.sourceGrade, cfg.grade, record.sourceFile);
    assert.equal(record.effectiveBrowseGrade, cfg.grade, record.sourceFile);
    assert.equal(record.identityStatus, 'VERIFIED', record.sourceFile);
    assert.match(record.questionUid, /^qid_v1_[a-f0-9]{64}$/);
  }
  assert.deepEqual(statuses, { VALID: expected });
  assert.equal(data.records.filter(record => record.sourceGradeStatus === 'SOURCE_GRADE_UNRESOLVED').length, 0);
  assert.equal(new Set(records.map(record => record.questionUid)).size, records.length, 'no duplicate question UIDs');
});

test('unified units: chapter-keyed textbook labels never use the textbook chapter key as a unit-profile key', () => {
  const base = { sourceQuestionNo: '1', sourceOrdinal: 1, sourceGrade: '고1', effectiveBrowseGrade: '고1', year: '' };
  const place = (folder, subject, key, label, grade = '고1') => Unified.classify({
    ...base, sourceFile: `textbooks/${folder}/set/set.js`, subject, sourceGrade: grade, effectiveBrowseGrade: grade,
    legacyStandardUnitKey: key, legacyStandardUnit: label,
  }).entry;
  // H22-C2-02 is 집합과 명제 in the textbook numbering but 직선의 방정식 in the profile.
  const set = place('미래엔_공통수학2', '공통수학2', 'H22-C2-02', '집합');
  assert.equal(set.unitKey, 'H22-C2-05');
  const prop = place('미래엔_공통수학2', '공통수학2', 'H22-C2-02', '명제');
  assert.equal(prop.unitKey, 'H22-C2-06');
  const circle = place('미래엔_공통수학2', '공통수학2', 'H22-C2-01', '원의 방정식');
  assert.equal(circle.unitKey, 'H22-C2-03');
  const move = place('비상교육_공통수학1', '공통수학1', 'H22-C1-02', '복소수와 이차방정식');
  assert.equal(move.unitKey, 'H22-C-04');
  // Chapter-level labels that span several units, and a label of another subject, stay unclassified
  // inside the subject; the profile key is not consulted.
  for (const [folder, subject, key, label] of [
    ['미래엔_공통수학2', '공통수학2', 'H22-C2-02', '집합과 명제'],
    ['미래엔_공통수학2', '공통수학2', 'H22-C2-01', '도형의 방정식'],
    ['미래엔_공통수학2', '공통수학2', 'H22-C2-03', '함수와 그래프'],
    ['동아출판_공통수학1', '공통수학1', 'H22-C1-03', '경우의 수'],
    ['동아출판_공통수학1', '공통수학1', 'H22-C1-02', '방정식과 부등식'],
    ['미래엔_공통수학1', '공통수학1', 'H22-C1-04', '집합'],
  ]) {
    const entry = place(folder, subject, key, label);
    assert.equal(entry.unclassified, true, `${folder} ${label}`);
    assert.equal(entry.unitKey, '');
    assert.equal(entry.subject, subject === '공통수학1' ? 'COMMON_MATH_1' : 'COMMON_MATH_2');
  }
  const algebra = place('비상교육_대수', '대수', 'H22-AL-01', '지수와 로그', '고2');
  assert.equal(algebra.unitKey, 'H22-A-01');
  assert.equal(algebra.subject, 'ALGEBRA');
  const limit = place('비상교육_미적분1', '미적분I', 'H22-MC1-01', '함수의 극한', '고2');
  assert.equal(limit.unitKey, 'H22-M1-01');
  assert.equal(limit.subject, 'CALCULUS');
  const spans = place('비상교육_미적분1', '미적분I', 'H22-MC1-02', '미분', '고2');
  assert.equal(spans.unclassified, true);
  assert.equal(spans.subject, 'CALCULUS');
  // Profile-keyed textbook sets and every other source keep the key-based behaviour.
  const profile = place('비상교육_공통수학2', '공통수학2', 'H22-C2-04', '도형의 이동');
  assert.equal(profile.unitKey, 'H22-C2-04');
});

test('unified units: every registered textbook question is placeable in a grade and subject', async () => {
  const data = await catalog();
  const records = data.records.filter(record => record.sourceFile.startsWith('textbooks/'));
  const index = Unified.buildIndex(records, { projectionPolicy: data.projectionPolicy });
  assert.equal(index.stats.overall.unplaced, 0);
  assert.equal(index.stats.overall.unclassifiedNoSubject, 0, 'every textbook question belongs to a subject');
  for (const entry of index.byRecord.values()) {
    const cfg = manifest.folders[folderOf(entry.record.sourceFile)];
    assert.equal(entry.grade, cfg.grade);
    assert.equal(entry.subjectLabel.replace('미적분Ⅰ', '미적분I'), cfg.subject.replace('미적분1', '미적분I'));
  }
});

test('textbook figures beside the source JS resolve at render time without touching the source', () => {
  const readiness = require('../archive/question-image-readiness.js');
  const file = 'textbooks/미래엔_공통수학1/미래엔_공통수학1_경우의수_대단원마무리_고1/미래엔_공통수학1_경우의수_대단원마무리_고1.js';
  const dir = 'textbooks/미래엔_공통수학1/미래엔_공통수학1_경우의수_대단원마무리_고1';
  assert.equal(readiness.resolveSourceRelativeImage('q04.png', file), `exams/${dir}/q04.png`);
  assert.equal(readiness.resolveSourceRelativeImage('q04.png', `archive/exams/${file}`), `exams/${dir}/q04.png`);
  // Everything else keeps its src: other sources, full asset paths, URLs, traversal, non-figure names.
  for (const [src, source] of [
    ['q04.png', 'original/high/h1/1mid/25_a_1학기_중간_고1_기출.js'],
    ['q04.png', ''],
    ['assets/images/x/q04.png', file],
    ['https://example.test/q04.png', file],
    ['../q04.png', file],
    ['logo.png', file],
    ['q04.png', 'textbooks/../original/a.js'],
  ]) assert.equal(readiness.resolveSourceRelativeImage(src, source), src, `${src} @ ${source}`);
  const image = ref => ({ closest: selector => (selector === '[data-source-ref]' && ref ? { dataset: { sourceRef: ref } } : null) });
  assert.equal(readiness.sourceFileOfImage(image(`${file}#qid_v1_x`)), file);
  assert.equal(readiness.sourceFileOfImage(image('')), '');
  // Both engine pages hand the question's own source to the resolver and load the versioned script.
  for (const page of ['engine.html', 'mixed_engine.html']) {
    const html = fs.readFileSync(path.join(archiveDir, page), 'utf8');
    assert.match(html, /readiness\.resolveSourceRelativeImage\(src, readiness\.sourceFileOfImage\(image\)/, page);
    assert.match(html, /question-image-readiness\.js\?v=20261030-s11-1/, page);
  }
  // Every figure the registered textbook sources reference by bare file name exists beside its JS.
  let figures = 0;
  for (const row of textbookRows) {
    const source = fs.readFileSync(path.join(examsDir, row.file), 'utf8');
    for (const [, src] of source.matchAll(/<img\b[^>]*?\bsrc=\\?["']([^"'\\]+)\\?["']/gi)) {
      if (!/^q\d+/.test(src)) continue;
      const resolved = readiness.resolveSourceRelativeImage(src, row.file);
      assert.notEqual(resolved, src, `${row.file}: ${src} must resolve`);
      assert.ok(fs.existsSync(path.join(archiveDir, resolved)), `${row.file}: missing ${resolved}`);
      figures++;
    }
  }
  assert.equal(figures, 138, "S11 baseline: 138 inline figures in the registered textbook sources");
});
