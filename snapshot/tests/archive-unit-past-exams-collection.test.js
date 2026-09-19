const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const core = require('../archive/unit-past-exams-core.js');

test('question-index 계약은 학교·연도·시험 메타데이터를 보존한다', () => {
  const builder = fs.readFileSync(path.resolve(__dirname, '..', 'archive', 'tools', 'build-question-index.mjs'), 'utf8');
  assert.match(builder, /schoolKey: normalizeSchoolKey\(meta\.school\)/);
  assert.match(builder, /examYear: normalizeExamYear\(meta\.year\)/);
  assert.match(builder, /sourceExamKey: sourceFile/);
});

test('수록 원본의 DB·JS·index 문항 수와 학교·시험 메타데이터가 일치한다', () => {
  const load = file => {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
    return context.window;
  };
  const db = load(path.resolve(__dirname, '..', 'archive', 'db.js')).mainDB.exams;
  const index = load(path.resolve(__dirname, '..', 'archive', 'question-index.js')).questionIndex;
  const dbByFile = new Map(db.map(exam => [exam.file, exam]));
  const indexCounts = new Map();
  for (const item of index.filter(item => item.sourceFile.startsWith('original/'))) {
    indexCounts.set(item.sourceFile, (indexCounts.get(item.sourceFile) || 0) + 1);
    assert.ok(item.school && item.examYear && item.semester && item.examType && item.sourceExamKey, item.sourceFile);
  }
  assert.ok(indexCounts.size > 0);
  for (const [file, count] of indexCounts) {
    const exam = dbByFile.get(file);
    assert.ok(exam, `DB metadata missing: ${file}`);
    assert.equal(exam.qCount, count, `qCount mismatch: ${file}`);
  }
});

function record({ school, year, unitKey = 'H22-MI1-04', id = 1, period = '2mid' } = {}) {
  return {
    sourceFile: `original/high/h2/${period}/${String(year).slice(-2)}_${school}_${id}.js`,
    sourceOrdinal: id,
    id,
    school,
    schoolKey: String(school || '').replace(/\s+/g, '').toLowerCase(),
    examYear: year,
    semester: period.startsWith('1') ? '1' : '2',
    examType: period.endsWith('mid') ? 'mid' : 'final',
    mappedUnitKey: unitKey,
    mappedCourse: '미적분Ⅰ',
    standardUnitKey: 'H15-M2-04',
    standardUnit: '도함수',
    subUnitKey: `${unitKey}-DERIVATIVE`,
    subUnit: '도함수',
    level: '중',
    questionUid: `${school}-${year}-${unitKey}-${id}`
  };
}

test('특정 연도 모아뽑기는 선택한 연도의 실제 자료만 학교별로 분리한다', () => {
  const records = [
    record({ school: '매산고', year: 2025, id: 1 }),
    record({ school: '매산고', year: 2023, id: 2 }),
    record({ school: '순천고', year: 2025, id: 1 }),
    record({ school: '순천고', year: 2024, id: 2 })
  ];
  const result = core.buildCollectionPapers(records, 'h2', {
    unitKey: 'H22-MI1-04', yearMode: 'exact', year: 2025, outputMode: 'school'
  });

  assert.equal(result.ok, true);
  assert.equal(result.candidateCount, 2);
  assert.deepEqual(result.schools.map(school => [school.label, school.candidateCount, school.years]), [
    ['매산고', 1, [2025]], ['순천고', 1, [2025]]
  ]);
  assert.deepEqual(result.papers.map(paper => paper.school), ['매산고', '순천고']);
  assert.deepEqual(result.papers.map(paper => paper.records.map(item => item.examYear)), [[2025], [2025]]);
});

test('최근 3개년은 학교마다 자료가 있는 최신 연도를 따로 계산한다', () => {
  const records = [
    ...[2025, 2023, 2022, 2020].map((year, index) => record({ school: '매산고', year, id: index + 1 })),
    ...[2024, 2021].map((year, index) => record({ school: '순천고', year, id: index + 1 }))
  ];
  const result = core.buildCollectionPapers(records, 'h2', {
    unitKey: 'H22-MI1-04', yearMode: 'recentAvailable', yearCount: 3, outputMode: 'combined'
  });

  assert.equal(result.candidateCount, 5);
  assert.deepEqual(result.yearSelection.bySchool, { '매산고': [2025, 2023, 2022], '순천고': [2024, 2021] });
  assert.deepEqual(result.schools.map(school => school.selectedCount), [3, 2]);
  assert.deepEqual(result.records.map(item => item.examYear), [2025, 2023, 2022, 2024, 2021]);
});

test('통합 출력의 문항 수 제한은 학교별 균형을 우선한다', () => {
  const records = [
    ...Array.from({ length: 4 }, (_, index) => record({ school: '매산고', year: 2025, id: index + 1 })),
    ...Array.from({ length: 4 }, (_, index) => record({ school: '순천고', year: 2025, id: index + 1 }))
  ];
  const result = core.buildCollectionPapers(records, 'h2', {
    unitKey: 'H22-MI1-04', yearMode: 'exact', year: 2025, outputMode: 'combined', countMode: 'fixed', count: 4
  });

  assert.equal(result.ok, true);
  assert.equal(result.selectedCount, 4);
  assert.deepEqual(result.schools.map(school => school.selectedCount), [2, 2]);
  assert.equal(new Set(result.papers[0].records.map(item => item.school)).size, 2);
});

test('범위 모아뽑기는 같은 과목 안에서 시작·끝 단원을 포함한다', () => {
  const records = [
    record({ school: '순천고', year: 2025, unitKey: 'H22-MI1-03', id: 1 }),
    record({ school: '순천고', year: 2025, unitKey: 'H22-MI1-04', id: 2 }),
    record({ school: '순천고', year: 2025, unitKey: 'H22-MI1-05', id: 3 }),
    record({ school: '순천고', year: 2025, unitKey: 'H22-A-01', id: 4 })
  ];
  const result = core.buildCollectionPapers(records, 'h2', {
    unitKey: 'H22-MI1-04', scopeMode: 'range', startUnitKey: 'H22-MI1-03', endUnitKey: 'H22-MI1-05',
    yearMode: 'exact', year: 2025
  });

  assert.equal(result.candidateCount, 3);
  assert.deepEqual(result.scopeUnits.map(unit => unit.key), ['H22-MI1-03', 'H22-MI1-04', 'H22-MI1-05']);
});

test('시험 학기와 중간·기말 필터는 학교·연도 후보에 함께 적용된다', () => {
  const records = [
    record({ school: '순천고', year: 2025, id: 1, period: '1mid' }),
    record({ school: '순천고', year: 2025, id: 2, period: '2final' }),
    record({ school: '매산고', year: 2025, id: 1, period: '2mid' })
  ];
  const result = core.buildCollectionPapers(records, 'h2', {
    unitKey: 'H22-MI1-04', yearMode: 'exact', year: 2025, semester: '2', examType: 'mid', outputMode: 'school'
  });

  assert.equal(result.candidateCount, 1);
  assert.deepEqual(result.papers.map(paper => paper.school), ['매산고']);
  assert.equal(result.options.semester, '2');
  assert.equal(result.options.examType, 'mid');
});

test('학교별 자료가 부족해도 가능한 문제지는 부분 성공으로 유지한다', () => {
  const records = [
    record({ school: '매산고', year: 2025, id: 1 }),
    ...[1, 2, 3].map(id => record({ school: '순천고', year: 2025, id }))
  ];
  const result = core.buildCollectionPapers(records, 'h2', {
    unitKey: 'H22-MI1-04', yearMode: 'exact', year: 2025, outputMode: 'school', countMode: 'fixed', count: 2
  });

  assert.equal(result.ok, true);
  assert.equal(result.complete, false);
  assert.equal(result.shortage, 1);
  assert.deepEqual(result.papers.map(paper => [paper.school, paper.records.length]), [['매산고', 1], ['순천고', 2]]);
});
