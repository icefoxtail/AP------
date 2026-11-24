'use strict';
// Catalog shards, stage 2-4: 문제지 만들기 builds its list from the shards of the grade the teacher chose (not the whole bundle). What the
// teacher gets must not depend on that: for every grade, the same request and the same seed select the same questions from the shards of the
// grade as from the whole catalog, the same questions are eligible, and the family (original/similar pair) links agree. Real inputs, no
// counts fixed: the test compares the two ways of loading, and fails on any difference.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');
const { isDeepStrictEqual } = require('node:util');

const root = path.resolve(__dirname, '..');
const lib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-catalog-shards.mjs')).href);
const core = require(path.join(root, 'archive/archive2-core.js'));
const shards = require(path.join(root, 'archive/archive2-catalog-shards.js'));
// the browser loads archive2-similar.js as a global after archive2-core.js (familyResolver reads it)
globalThis.Archive2Similar = require(path.join(root, 'archive/archive2-similar.js'));

let builtOnce = null;
const built = async () => {
  if (!builtOnce) builtOnce = lib().then((m) => m.buildCatalogShards(root));
  return builtOnce;
};
const fakeFetch = (files) => async (url) => {
  const rel = String(url).replace(/^.*archive2-catalog-shards-v1\//, '').replace(/\?.*$/, '');
  const bytes = files.get(rel);
  if (!bytes) return { ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) };
  const copy = Buffer.from(bytes);
  return { ok: true, status: 200, arrayBuffer: async () => copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.length) };
};
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const GRADES = ['중1', '중2', '중3', '고1', '고2', '고3'];
const SEEDS = ['seed-a', 'seed-b', 'seed-c'];

test('the same request and seed select the same questions from the shards of a grade as from the whole catalog', async () => {
  const { files, entries, catalog: full } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  const compared = { selects: 0, withSelection: 0, units: 0 };
  for (const grade of GRADES) {
    const loader = shards.createLoader({ base: 'https://site.test/archive/data/archive2-catalog-shards-v1/', fetch: fakeFetch(all) });
    const part = await loader.loadCatalog({ grades: [grade] });
    assert.equal(part.complete, false, 'a grade is not the whole list');
    const filters = { grade };
    const poolOf = (records) => records.filter((record) => core.matches(record, filters, { filters }));
    const poolFull = poolOf(full.records);
    const poolPart = poolOf(part.records);
    // 1) the pool of the grade is the same set of questions
    assert.deepEqual(poolPart.map((r) => r.questionUid).sort(), poolFull.map((r) => r.questionUid).sort(), `pool of ${grade}`);
    assert.ok(poolFull.length > 0, `${grade} has questions`);
    // ... in the same order (a replacement list sorts by year only, so questions of one year come in catalog order)
    assert.deepEqual(poolPart.map((r) => r.questionUid), poolFull.map((r) => r.questionUid), `order of the pool of ${grade}`);
    assert.deepEqual([...poolPart].sort(core.compareRecency).slice(0, 60).map((r) => r.questionUid), [...poolFull].sort(core.compareRecency).slice(0, 60).map((r) => r.questionUid), `first replacement candidates of ${grade}`);
    // 2) the same questions are eligible, for the same reasons, with each authority
    for (const record of poolFull) {
      const original = full.records.find((candidate) => candidate === record);
      const slim = poolPart.find((candidate) => candidate.questionUid === original.questionUid);
      if (record.questionUid.slice(-1) !== '0' && record.questionUid.slice(-1) !== '7') continue; // a sample of 1/8 keeps this fast; the equality below is exhaustive in the authority test
      assert.deepEqual(core.basicEligibility(slim, { canonicalAuthority: part.canonicalAuthority }), core.basicEligibility(record, { canonicalAuthority: full.canonicalAuthority }));
      assert.equal(core.advancedEligible(slim, { canonicalAuthority: part.canonicalAuthority }), core.advancedEligible(record, { canonicalAuthority: full.canonicalAuthority }));
    }
    // 3) the original / similar pair links agree for every question of the pool
    const familyFull = core.familyResolver(full.records);
    const familyPart = core.familyResolver(part.records);
    const fullByUid = new Map(full.records.map((record) => [record.questionUid, record]));
    for (const slim of poolPart) assert.equal(familyPart(slim), familyFull(fullByUid.get(slim.questionUid)), `family of ${slim.questionUid}`);
    // 4) units: the biggest ones of the grade, three seeds, both gates (the browser uses "general"; "basic" is the strict one)
    const byUnit = new Map();
    for (const record of poolFull) {
      if (!core.generalUseEligibility(record).ok) continue;
      const key = core.pathKey(record, 4);
      if (!byUnit.has(key)) byUnit.set(key, []);
      byUnit.get(key).push(record.questionUid);
    }
    const units = [...byUnit.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 4);
    for (const [unit, uids] of units) {
      compared.units += 1;
      for (const seed of SEEDS) for (const useMode of ['general', 'basic']) {
        const make = (authority) => ({
          filters: { grade, scopeQuestionUids: uids, primaryPaths: [unit] },
          rows: [{ id: 'unit', count: 10, paths: [unit], depth: 4, scopeQuestionUids: uids }],
          useMode, seed, canonicalAuthority: authority,
        });
        const a = core.selectBlueprint(poolFull, make(full.canonicalAuthority), {}, { familyRecords: full.records });
        const b = core.selectBlueprint(poolPart, make(part.canonicalAuthority), {}, { familyRecords: part.records });
        compared.selects += 1;
        if (a.selected.length) compared.withSelection += 1;
        assert.deepEqual(b.selected.map((r) => r.questionUid), a.selected.map((r) => r.questionUid), `selection ${grade} ${unit} ${seed} ${useMode}`);
        assert.deepEqual(b.errors, a.errors);
        assert.equal(b.ok, a.ok);
      }
    }
  }
  // the comparison must have teeth: real selections were made
  assert.ok(compared.withSelection > 0 && compared.units > 0, JSON.stringify(compared));
});

test('adding a grade after another keeps the first grade\'s answer and gives the second grade\'s (고1, then 고2)', async () => {
  const { files, entries, catalog: full } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  const loader = shards.createLoader({ base: 'https://site.test/archive/data/archive2-catalog-shards-v1/', fetch: fakeFetch(all) });
  const first = await loader.loadCatalog({ grades: ['고1'] });
  const both = await loader.loadCatalog({ grades: ['고2'] });
  assert.ok(both.records.length > first.records.length);
  assert.ok(first.records.every((record) => both.records.includes(record)), 'the records of the first grade are the same objects');
  const fullByUid = new Map(full.records.map((record) => [record.questionUid, record]));
  for (const record of both.records) {
    const original = fullByUid.get(record.questionUid);
    assert.deepEqual(core.basicEligibility(record, { canonicalAuthority: both.canonicalAuthority }), core.basicEligibility(original, { canonicalAuthority: full.canonicalAuthority }));
  }
});

test('the type filters and the replacement candidates of a grade are the same from its shards as from the whole catalog', async () => {
  const { files, entries, catalog: full } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  const ProblemBankMeta = require(path.join(root, 'archive/problem-bank-meta.js'));
  // every column ProblemBankMeta.query() filters on, plus what the preview rows and the type filters show
  const READ_BY_FILTERS = ['uid', 'questionUid', 'sourceKind', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'rpmSemanticStatus', 'storageBucketKey',
    'L1', 'L2', 'L3', 'L4', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'problemTypeKey', 'templateKey', 'integrationPattern', 'level', 'difficultyBucket',
    'nativeCurriculum', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4', 'crossConceptKeys', 'conditionKeys', 'secondaryConceptKeys',
    'directSelectable', 'verifiedEligible', 'metaStatus', 'metaCompleteness'];
  const fullByUid = new Map(full.records.map((record) => [record.questionUid, record]));
  const fullIndex = ProblemBankMeta.buildIndex(full.records, []);
  const idOf = (row) => row.questionUid || row.uid;
  const fullRowByUid = new Map(fullIndex.map((row) => [idOf(row), row]));
  let facetsCompared = 0;
  let queriesCompared = 0;
  for (const grade of GRADES) {
    const loader = shards.createLoader({ base: 'https://site.test/archive/data/archive2-catalog-shards-v1/', fetch: fakeFetch(all) });
    const part = await loader.loadCatalog({ grades: [grade] });
    const partIndex = ProblemBankMeta.buildIndex(part.records, []);
    const partUids = new Set(partIndex.map(idOf));
    // 1) every row of the recorded-meta index (what the type filters and the labels read) is the row of the same question in the whole catalog
    // (a shard record leaves out the dropped / trimmed columns that no screen reads, so the whole row is not compared: the columns the filters
    // query and the labels read are)
    for (const row of partIndex) {
      const fullRow = fullRowByUid.get(idOf(row));
      for (const field of READ_BY_FILTERS) assert.deepEqual(row[field], fullRow[field], `${field} of ${idOf(row)}`);
    }
    // 2) the concept / type / template of every question of the grade, with their statuses
    for (const record of part.records) {
      assert.deepEqual(core.metaFacetsOf(record), core.metaFacetsOf(fullByUid.get(record.questionUid)), `facets ${record.questionUid}`);
      facetsCompared += 1;
    }
    // 3) a replacement list is a query on one type / template key inside the grade's pool: the same uids in the same order from both
    const keys = new Set();
    for (const row of partIndex) {
      if (row.problemTypeKey) keys.add(`problemTypeKey:${row.problemTypeKey}`);
      if (row.templateKey) keys.add(`templateKey:${row.templateKey}`);
    }
    for (const key of [...keys].sort().filter((_, index) => index % 7 === 0).slice(0, 40)) {
      const [field, value] = key.split(':');
      const a = ProblemBankMeta.query(fullIndex, { [field]: value }, { profile: 'DIRECT' }).filter((row) => partUids.has(idOf(row)));
      const b = ProblemBankMeta.query(partIndex, { [field]: value }, { profile: 'DIRECT' });
      assert.deepEqual(b.map(idOf), a.map(idOf), `${grade} ${key}`);
      queriesCompared += 1;
    }
  }
  assert.ok(facetsCompared > 0 && queriesCompared > 0, JSON.stringify({ facetsCompared, queriesCompared }));
});

// ---- 단원별 기출 (stage 2-3) -----------------------------------------------------------------------------------------------------------
// archive/unit-past-exams.js joins two inputs (the question-index.js rows and the approved-metadata rows merged with the foundation runtime)
// and counts and picks from the joined rows. The shards carry both inputs, so a screen that loads one grade's shards must join to the same
// rows the whole-bundle path joins. The test runs the real join code (taken from the screen's own file) twice, on the whole-bundle inputs
// and on the inputs the shards give back, and fails on any row or column that differs. Columns of the question index that no screen script
// reads (text, tags, image flags, exam subject/grade/course) are not carried; the test below keeps that list honest.
const UNIT_PAST_UNREAD_COLUMNS = ['contentText', 'choicesText', 'tags', 'hasImage', 'hasSolutionImage', 'questionType', 'subUnitConfidence',
  'subUnitClassificationDepth', 'grade', 'subject', 'course', 'metadataStatus'];
const unitPastJoinFrom = (window) => {
  const source = fs.readFileSync(path.join(root, 'archive/unit-past-exams.js'), 'utf8');
  const marks = ['  function parseQuestionNo(value)', '  function matchQuestionNo', '  function buildMetaFoundationSelectionAuthority', '  // 문항 배열 찾기 규칙'].map((mark) => source.indexOf(mark));
  assert.ok(marks.every((at) => at >= 0) && marks[0] < marks[1] && marks[2] < marks[3], 'the join moved in unit-past-exams.js: update this test');
  const body = source.slice(marks[0], marks[1]) + source.slice(marks[2], marks[3]);
  const unitCore = require(path.join(root, 'archive/unit-past-exams-core.js'));
  return new Function('window', 'core', 'state', `${body}\nreturn joinApprovedMetadata;`)(window, unitCore, {});
};
const canonicalJson = (value) => JSON.stringify(value, (key, item) => (item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map((name) => [name, item[name]])) : item));

test('단원별 기출: the rows the shards hand to the join equal the rows the whole-bundle path joins, for every question of every grade', async () => {
  const { files, entries, catalog, bundle, canonical } = await built();
  const part = await import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-unit-past-part.mjs')).href);
  const index = JSON.parse(entries.find((entry) => entry.path.endsWith('/index.json')).content.toString('utf8'));
  const common = JSON.parse(files.get('common.json').toString('utf8'));
  assert.ok(common.unitPast && common.unitPast.schemaVersion === shards.UNIT_PAST_SCHEMA, 'the build carries the unit-past part (needs archive/data/question_metadata.json: node archive/tools/meta-foundation/question-metadata-format.mjs assemble)');
  // the whole-bundle side: question-index.js, and the sidecar merged with the foundation runtime by the two browser scripts themselves
  const ran = await part.runBrowserMetadataScripts(root, { catalog, bundle, canonical, core });
  const previousLabels = globalThis.ARCHIVE_SUBUNIT_LABELS;
  globalThis.ARCHIVE_SUBUNIT_LABELS = ran.subUnitLabels;
  try {
    const wholeJoin = unitPastJoinFrom({
      ARCHIVE_QUESTION_METADATA: { records: ran.metaRecords }, ARCHIVE_META_FOUNDATION_RUNTIME: ran.runtime,
      ARCHIVE2_FINAL_CATALOG: catalog, Archive2Core: core, ARCHIVE_META_FOUNDATION_LABELS: ran.labels,
    });
    const whole = wholeJoin(part.readQuestionIndex(root));
    const wholeByKey = new Map(whole.map((row) => [`${row.sourceFile}#${row.sourceOrdinal}`, row]));
    assert.ok(whole.length > 1000, 'the whole-bundle join produced rows');
    // the shard side, one shard file at a time, the way the screen joins what it has loaded
    const seen = new Set();
    const differences = [];
    for (const shard of index.shards) {
      const doc = JSON.parse(files.get(shard.path).toString('utf8'));
      const rows = shards.unitPastRows(common.unitPast, doc);
      const join = unitPastJoinFrom({
        ARCHIVE_QUESTION_METADATA: { records: rows.metaRecords }, ARCHIVE_META_FOUNDATION_RUNTIME: shards.unitPastRuntime(common.unitPast),
        ARCHIVE2_FINAL_CATALOG: { records: doc.records }, Archive2Core: core, ARCHIVE_META_FOUNDATION_LABELS: common.labels,
      });
      for (const row of join(rows.questionIndex)) {
        const key = `${row.sourceFile}#${row.sourceOrdinal}`;
        assert.ok(!seen.has(key), `one row per question: ${key}`);
        seen.add(key);
        const expected = wholeByKey.get(key);
        if (!expected) { differences.push(`extra row ${key}`); continue; }
        for (const name of new Set([...Object.keys(expected), ...Object.keys(row)])) {
          if (UNIT_PAST_UNREAD_COLUMNS.includes(name)) continue;
          if (canonicalJson(expected[name]) !== canonicalJson(row[name])) differences.push(`${key} ${name}: ${canonicalJson(expected[name])} <> ${canonicalJson(row[name])}`);
        }
      }
    }
    for (const key of wholeByKey.keys()) if (!seen.has(key)) differences.push(`missing row ${key}`);
    assert.deepEqual(differences.slice(0, 5), [], `${differences.length} differences`);
    assert.equal(seen.size, wholeByKey.size);
  } finally {
    if (previousLabels === undefined) delete globalThis.ARCHIVE_SUBUNIT_LABELS; else globalThis.ARCHIVE_SUBUNIT_LABELS = previousLabels;
  }
});

test('단원별 기출: no screen script reads a question-index column the shards do not carry, and the join reads only the metadata fields the shards keep', async () => {
  const unitPastMetaFields = [...(await import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-unit-past-part.mjs')).href)).META_FIELDS];
  const unitScripts = ['archive/unit-past-exams.js', 'archive/unit-past-exams-core.js', 'archive/archive2-unit-tree.js'].map(read);
  const readNames = (text) => new Set([...text.matchAll(/\b(?:record|item|row|candidate|question|paper|meta)\??\.([A-Za-z_][A-Za-z0-9_]*)/g)].map((match) => match[1]));
  for (const text of unitScripts) {
    const names = readNames(text);
    for (const column of ['contentText', 'choicesText', 'tags', 'hasImage', 'hasSolutionImage', 'questionType', 'subUnitConfidence', 'subUnitClassificationDepth'])
      assert.ok(!names.has(column), `a unit-past script reads ${column}, a question-index column the shards do not carry`);
  }
  const source = read('archive/unit-past-exams.js');
  const join = source.slice(source.indexOf('  function joinApprovedMetadata'), source.indexOf('  // 문항 배열 찾기 규칙'));
  const carried = new Set(['sourceArchiveFile', 'sourceOrdinal', 'sourceQuestionNo', 'metadataStatus', ...unitPastMetaFields]);
  for (const name of [...join.matchAll(/\bmeta\.([A-Za-z_][A-Za-z0-9_]*)/g)].map((match) => match[1]))
    assert.ok(carried.has(name), `joinApprovedMetadata reads meta.${name}, which the shards do not carry (add it to META_FIELDS in tools/lib/build-archive2-unit-past-part.mjs)`);
  // validateMetaFoundationSelection reads these off the joined metadata row
  const coreText = read('archive/unit-past-exams-core.js');
  for (const name of ['metaFoundationStatus', 'metaFoundationPackId', 'curriculumKey', 'courseKey', 'L1', 'L2', 'problemTypeKey', 'templateKey'])
    assert.ok(unitPastMetaFields.includes(name), name);
  assert.ok(coreText.includes('META_FOUNDATION_SCOPE_FIELDS') && /\['curriculumKey', 'courseKey', 'L1', 'L2'\]/.test(coreText), 'the scope tuple moved: update META_FIELDS');
});

// ---- 학교별 기출(찾기) 표 (조각 3단계): the school finder answers from `common.finder`, without any shard ----
test('학교별 기출: the table in the common file gives the finder the same answers as the records of the whole catalog, for every exam', async () => {
  const { files, entries } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  const loader = shards.createLoader({ base: 'https://site.test/archive/data/archive2-catalog-shards-v1/', fetch: fakeFetch(all) });
  const whole = await loader.loadCatalog({ all: true });
  const common = await loader.loadCommon();
  const index = await loader.loadIndex();
  const table = shards.assembleFinder(common, core.normalizeFile);
  assert.ok(table, 'the common file carries the finder table');
  assert.equal(table.identityDigest, index.catalogIdentityDigest);
  // the table lists the exams in the order of the catalog and of the shard index (the exam list the screens draw from is the same order)
  assert.deepEqual(table.files, whole.exams.map((exam) => exam.file));
  assert.deepEqual(table.files, Object.keys(index.examShard));
  const sorted = (set) => [...(set || [])].sort();
  // 1) the identity sets, from the records of the whole catalog (what the screen builds when it holds everything)
  const recordIndex = core.buildFinderIndex(whole);
  for (const exam of whole.exams) {
    const key = core.normalizeFile(exam.file);
    const expected = recordIndex.get(key);
    const given = table.finderIndex.get(key);
    assert.ok(given, `identity of ${exam.file}`);
    for (const name of ['courseKeys', 'curriculumKeys', 'sourceGrades', 'subjectProjections', 'subjectCurriculumPairs'])
      assert.deepEqual(sorted(given[name]), sorted(expected[name]), `${name} of ${exam.file}`);
  }
  // 2) the unified subjects each exam covers
  const Unified = require(path.join(root, 'archive/archive2-unified-units.js'));
  const unified = Unified.buildIndex(whole.records, { projectionPolicy: whole.projectionPolicy });
  const covered = Unified.examSubjects(unified);
  assert.deepEqual([...table.examSubjects.keys()].sort(), [...covered.keys()].sort());
  for (const [key, set] of covered) assert.deepEqual(sorted(table.examSubjects.get(key)), sorted(set), `unified subjects of ${key}`);
  // 3) the filters the finder applies, over every value the data has (nothing typed by hand)
  const grades = ['중1', '중2', '중3', '고1', '고2', '고3'];
  const curricula = [...new Set(whole.exams.flatMap((exam) => [...(recordIndex.get(core.normalizeFile(exam.file))?.curriculumKeys || [])]))].sort();
  const courses = [...new Set(whole.exams.flatMap((exam) => [...(recordIndex.get(core.normalizeFile(exam.file))?.courseKeys || [])]))].sort();
  const subjects = [...new Set([...covered.values()].flatMap((set) => [...set]))].sort();
  let compared = 0;
  const decide = (exam, filters, source, subjectsByFile) => {
    // the same two steps as finderIdentityMatch in archive2-workspace-core.js
    const matched = core.finderMatches(exam, { grade: filters.grade, curriculumKey: filters.curriculumKey, courseKey: filters.courseKey, semanticSubject: '' }, source);
    if (!matched || !filters.semanticSubject) return matched;
    const set = subjectsByFile.get(core.normalizeFile(exam.file));
    return set && set.size ? set.has(filters.semanticSubject) : core.finderMatches(exam, { semanticSubject: filters.semanticSubject }, source);
  };
  const combos = [];
  for (const grade of ['', ...grades]) for (const curriculumKey of ['', ...curricula]) for (const subject of ['', ...subjects]) combos.push({ grade, curriculumKey, semanticSubject: subject });
  for (const courseKey of courses) combos.push({ courseKey }, { grade: '고1', courseKey });
  for (const filters of combos) {
    for (const exam of whole.exams) {
      assert.equal(decide(exam, filters, table.finderIndex, table.examSubjects), decide(exam, filters, recordIndex, covered), `${JSON.stringify(filters)} ${exam.file}`);
      compared += 1;
    }
  }
  assert.ok(compared > 10000, 'many decisions compared');
  // 4) the question names a search word can find: the same set of texts per exam, and the characters of a uid
  const parentOf = (uid) => { const entry = unified.byUid.get(uid); return entry?.rpmParentStatus === 'EXACT' ? entry.rpmParent : null; };
  const byFile = new Map();
  const uidChars = new Set();
  for (const record of whole.records) {
    const parent = parentOf(record.questionUid);
    const text = core.normalizeSearch([record.L1, record.L2, record.L3, record.L4, parent?.L1, parent?.L2].filter(Boolean).join(' '));
    if (text) { if (!byFile.has(record.sourceFile)) byFile.set(record.sourceFile, new Set()); byFile.get(record.sourceFile).add(text); }
    for (const char of core.normalizeSearch(record.questionUid)) uidChars.add(char);
  }
  for (const exam of whole.exams) assert.deepEqual([...table.labelsOf(exam.file)].sort(), sorted(byFile.get(exam.file)), `question names of ${exam.file}`);
  assert.deepEqual([...table.uidChars].sort(), [...uidChars].sort());
});

// ---- 문제은행 검색 (조각 4단계): a scope (학년·과목) holds the rows of the whole list that belong to it, and nothing else ----
test('문제은행 검색: the rows, their order and every filter answer of a scope are those of the whole list restricted to the scope', async () => {
  const { files, entries, catalog: full } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  const ProblemBankMeta = require(path.join(root, 'archive/problem-bank-meta.js'));
  const { slimRecord } = await lib();
  const generatedDoc = JSON.parse(read('archive/data/generated-lite-consumer/v1/index.json'));
  const holds = generatedDoc.userDisabledUids || [];
  // what problem-bank-search.html does with a catalog and the generated rows (applyInventory)
  const inventoryOf = (catalog, generatedRows) => {
    const sha = new Map(catalog.sourceHashes || []);
    const rows = catalog.records.map((row) => ({ ...row, currentSourceJsSha256: sha.get(row.sourceFile) || '' }));
    return ProblemBankMeta.buildIndex(rows, generatedRows, { excludedHoldUids: holds });
  };
  const wholeInventory = inventoryOf(full, generatedDoc.records);
  const loader = shards.createLoader({ base: 'https://site.test/archive/data/archive2-catalog-shards-v1/', fetch: fakeFetch(all) });
  const index = await loader.loadIndex();
  const courses = loader.courses();
  const keyOf = (row) => row.uid || row.questionUid;
  // which scope a row of the whole list belongs to, decided by the index (originals: the shard of their exam; generated: the course of their subject)
  const generatedByUid = new Map(generatedDoc.records.map((record) => [record.uid, record]));
  const scopeOf = (row) => (row.sourceKind === 'generated'
    ? shards.courseOfGenerated(courses, generatedByUid.get(row.uid))
    : courses.find((course) => course.shards.includes(index.examShard[row.sourceFile]))?.key);
  const scopes = [...courses.map((course) => course.key), 'all'];
  // every generated question has a scope (otherwise it would exist only in "전체")
  for (const record of generatedDoc.records) assert.ok(shards.courseOfGenerated(courses, record), `generated ${record.uid} has a course`);
  const FIELDS = ['sourceKind', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4', 'nativeCurriculum', 'level', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'problemTypeKey', 'templateKey', 'integrationPattern', 'difficultyBucket'];
  const optionValues = (rows, field) => [...new Set(rows.map((row) => row[field]).filter((value) => value !== undefined && value !== null && value !== ''))];
  const stats = { scopes: 0, rows: 0, queries: 0 };
  const seen = new Set();
  for (const scope of scopes) {
    const keys = scope === 'all' ? index.shards.map((shard) => shard.key) : loader.shardKeysOfCourse(scope);
    const catalog = shards.assembleCatalog(await loader.loadIndex(), await loader.loadCommon(), await loader.loadShards(keys));
    const generatedRows = scope === 'all' ? generatedDoc.records : generatedDoc.records.filter((record) => shards.courseOfGenerated(courses, record) === scope);
    const scoped = inventoryOf(catalog, generatedRows);
    const inScope = (row) => scope === 'all' || scopeOf(row) === scope;
    const expected = wholeInventory.filter(inScope);
    // 1) the rows themselves, in the same order, value for value
    assert.equal(scoped.length, expected.length, `${scope}: row count`);
    for (let i = 0; i < expected.length; i += 1) {
      if (keyOf(scoped[i]) !== keyOf(expected[i])) assert.fail(`${scope}: row ${i} is ${keyOf(scoped[i])}, expected ${keyOf(expected[i])}`);
      // a row is the record plus what the screen derives from it, so the columns the shards leave out are left out of the whole list's row too:
      // every derived value (RPM path, status, eligibility ...) must come out the same without them (the screen reads none of them)
      const want = expected[i].sourceKind === 'generated' ? expected[i] : slimRecord(expected[i]);
      if (!isDeepStrictEqual(scoped[i], want)) assert.fail(`${scope}: row ${keyOf(expected[i])} differs`);
      if (scope !== 'all') seen.add(keyOf(expected[i]));
    }
    // 2) the filter boxes: the values each box offers; the unit boxes are built from the common list
    for (const field of [...FIELDS, 'crossConceptKeys', 'conditionKeys']) {
      const flat = (rows) => [...new Set(rows.flatMap((row) => (Array.isArray(row[field]) ? row[field] : [row[field]])).filter((value) => typeof value === 'string' && value))].sort();
      assert.deepEqual(flat(scoped), flat(expected), `${scope}: options of ${field}`);
    }
    assert.deepEqual(catalog.coreMetaFilterOptions, full.coreMetaFilterOptions, `${scope}: coreMetaFilterOptions`);
    // 3) the answers: every value of every box alone, and boxes together (value sets some row really has), the same rows in the same order
    const queries = [{}, { difficultyBucket: 'UNKNOWN' }];
    for (const field of FIELDS) for (const value of optionValues(expected, field)) queries.push({ [field]: value });
    for (const field of ['crossConceptKeys', 'conditionKeys']) for (const value of new Set(expected.flatMap((row) => row[field] || []))) queries.push({ [field]: [value] });
    const step = Math.max(1, Math.floor(expected.length / 400));
    for (let i = 0; i < expected.length; i += step) {
      const row = expected[i];
      const pick = (...fields) => Object.fromEntries(fields.filter((field) => row[field] !== undefined && row[field] !== null && row[field] !== '').map((field) => [field, row[field]]));
      queries.push(pick('standardCourse', 'standardUnitKey', 'subUnitKey'), pick('sourceKind', 'standardCourse', 'difficultyBucket'), pick('rpmL1', 'rpmL2', 'rpmL3', 'rpmL4'), pick('problemTypeKey', 'templateKey', 'level'), pick('nativeCurriculum', 'nativeL1', 'nativeL2', 'sourceKind'));
    }
    // (the rows are equal one by one above, so this also checks the index the scope's rows were built with against a plain scan of the whole list's rows)
    // (an even sample of the boxes' values: BANK_SEARCH_WIDE=1 runs every one, 28,000 answers in about 100 seconds)
    const cap = process.env.BANK_SEARCH_WIDE ? Infinity : scope === 'all' ? 150 : 400;
    const stride = Math.max(1, Math.ceil(queries.length / cap));
    let answered = 0;
    for (let q = 0; q < queries.length; q += stride) {
      answered += 1;
      const filters = queries[q];
      const a = ProblemBankMeta.query(scoped, filters).map(keyOf);
      const b = ProblemBankMeta.query([...expected], filters).map(keyOf);
      if (a.length !== b.length || a.some((uid, i) => uid !== b[i])) assert.fail(`${scope}: ${JSON.stringify(filters)} gives ${a.length} rows, the whole list gives ${b.length} here`);
    }
    // 4) the preview of an original needs the source hash of its file, and it is the one the whole list holds
    const hashes = new Map(full.sourceHashes || []);
    const held = new Map(catalog.sourceHashes || []);
    for (const row of catalog.records) assert.equal(held.get(row.sourceFile), hashes.get(row.sourceFile), `${scope}: hash held for ${row.sourceFile}`);
    stats.scopes += 1; stats.rows += expected.length; stats.queries += answered;
  }
  // the scopes together are the whole list: nothing lost, nothing in two scopes
  assert.equal(seen.size, wholeInventory.length, 'every row of the whole list is in a scope');
  assert.equal(stats.rows - wholeInventory.length, wholeInventory.length, 'and in only one (the rows of all scopes add up to the list; "all" is the list itself)');
  assert.ok(stats.queries > 1000 && stats.rows > 10000, 'a wide comparison was made');
  console.log(`bank search scopes compared: ${JSON.stringify(stats)}`);
});
