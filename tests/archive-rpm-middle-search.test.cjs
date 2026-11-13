const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const Core = require('../archive/archive2-core.js');
const UnitCore = require('../archive/unit-past-exams-core.js');
const Unified = require('../archive/archive2-unified-units.js');
const Toc = require('../archive/rpm-middle-toc.js');

// Independent destinations from the approved placement plan. IDs locate fixtures only;
// production matching continues to use the complete base path, including its curriculum.
const placements = [
  ['M1-RPM-183', '기본 도형', '기본 도형'],
  ['M2-RPM-168', '일차함수', '일차함수와 그 그래프(2)'],
  ['M2-RPM-184', '삼각형의 성질', '삼각형의 외심과 내심'],
  ['M2-RPM-194', '사각형의 성질', '여러 가지 사각형'],
  ['M3-RPM-097', '실수와 그 연산', '무리수와 실수'],
  ['M3-RPM-104', '다항식의 곱셈과 인수분해', '다항식의 곱셈'],
  ['M3-RPM-127', '이차방정식', '이차방정식의 활용'],
];

function fixture(id, index = 0) {
  const mapping = Toc.authority.leafMappings.find(row => row.crosswalkRecordIds.includes(id));
  assert.ok(mapping, id);
  const base = Toc.normalizePath(mapping.basePath);
  const gradeNo = base.courseKey[1];
  const record = {
    ...base, rpmPrimaryPath: Toc.toRpmPath(base),
    sourceGrade: `중${gradeNo}`, grade: `중${gradeNo}`,
    sourceFile: `original/middle/m${gradeNo}/2mid/27_search_fixture_${index}.js`,
    id: 1, sourceOrdinal: 1, sourceQuestionNo: 1, questionUid: `search-fixture-${index}`,
    year: 2027, level: '중', standardUnitKey: 'source-unit-preserved',
    subUnitKey: 'source-subunit-preserved', generalUseEligible: true,
  };
  return record;
}

function harness(records) {
  const exams = records.map(record => ({
    file: record.sourceFile, effectiveBrowseGrade: record.sourceGrade,
    grade: record.sourceGrade, year: record.year, semester: '2', examType: 'mid',
    school: '검색 검증', subject: '수학', material: 'exam',
  }));
  let indexBuilds = 0;
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams,
    location: new URL('https://archive.test/archive/workspace.html?view=find'),
    localStorage: { getItem() { return null; } },
    document: { addEventListener() {}, getElementById() { return { addEventListener() {} }; } },
    addEventListener() {},
    Archive2Core: Core,
    Archive2UnifiedUnits: { ...Unified, buildIndex(...args) { indexBuilds++; return Unified.buildIndex(...args); } },
    Archive2Output: { matchesMaterial: () => true, displayTitle: exam => `${exam.year} ${exam.school}` },
    Archive2Source: {}, Archive2Papers: {}, Archive2History: {},
  });
  ctx.window = ctx;
  const source = fs.readFileSync(path.join(__dirname, '../archive/archive2-workspace.js'), 'utf8');
  const startup = source.lastIndexOf('  (async () => {');
  assert.ok(startup > 0);
  vm.runInContext(source.slice(0, startup) + '\nwindow.searchTest = { state, findExams, findSearchText };\n})();', ctx);
  const api = ctx.searchTest;
  api.state.catalog = { records, exams, taxonomy: [] };
  api.state.finderIndex = Core.buildFinderIndex(api.state.catalog);
  return { ...api, indexBuilds: () => indexBuilds };
}

const files = rows => Array.from(rows, row => row.file);

test('finder searches current parent names and selects the same linked questions without replacing source paths', () => {
  const records = placements.map(([id], index) => fixture(id, index));
  const before = JSON.stringify(records);
  const requestPaths = records.map(record => Core.generalPathKey(record));
  const page = harness(records);
  for (let index = 0; index < placements.length; index++) {
    const [, L1, L2] = placements[index];
    const record = records[index];
    const query = `${L1} ${L2} ${record.L3}`;
    assert.ok(files(page.findExams({ query })).includes(record.sourceFile), query);
    const parentKey = JSON.stringify(['2022', record.courseKey, L1, L2]);
    assert.deepEqual(UnitCore.filterUnitRecords([record], { subUnitKeys: [parentKey] })
      .map(row => row.questionUid), [record.questionUid]);
  }
  // Repeated searches use the same classification and search index.
  page.findExams({ query: '무리수와 실수' });
  page.findExams({ query: '일차함수와 그 그래프(2)' });
  assert.equal(page.indexBuilds(), 1);
  assert.equal(JSON.stringify(records), before);
  assert.deepEqual(records.map(record => Core.generalPathKey(record)), requestPaths);
});

test('2015, missing exception leaves and conflicting RPM paths do not acquire guessed parent search aliases', () => {
  const legacy = { ...fixture('M3-RPM-097', 1), originalCurriculum: '2015' };
  const missing = fixture('M3-RPM-104', 2);
  missing.rpmPrimaryPath.l4 = '';
  missing.L4 = '';
  const conflict = fixture('M3-RPM-097', 3);
  conflict.rpmSemantic = fixture('M3-RPM-093').rpmPrimaryPath;
  const records = [legacy, missing, conflict];
  const before = JSON.stringify(records);
  const page = harness(records);
  assert.deepEqual(files(page.findExams({ query: '무리수와 실수' })), []);
  assert.deepEqual(files(page.findExams({ query: '다항식의 곱셈' })), []);
  assert.equal(JSON.stringify(records), before);
  for (const record of records)
    assert.ok(files(page.findExams({ query: record.L3 })).includes(record.sourceFile),
      'unchanged source labels stay searchable when current placement is unresolved');
});

test('a new catalog invalidates parent search aliases together with the existing record index', () => {
  const oldRecord = fixture('M3-RPM-097', 1);
  const page = harness([oldRecord]);
  assert.deepEqual(files(page.findExams({ query: '무리수와 실수' })), [oldRecord.sourceFile]);
  const nextRecord = fixture('M3-RPM-104', 2);
  page.state.catalog = {
    ...page.state.catalog,
    records: [nextRecord],
    exams: [{ ...page.state.catalog.exams[0], file: nextRecord.sourceFile }],
  };
  assert.deepEqual(files(page.findExams({ query: '무리수와 실수' })), []);
  assert.deepEqual(files(page.findExams({ query: '다항식의 곱셈' })), [nextRecord.sourceFile]);
  assert.equal(page.indexBuilds(), 2);
});
