const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const archiveRoot = path.join(repoRoot, 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));

function loadQuestionIndex() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'question-index.js'), 'utf8'), context);
  return context.window.questionIndex;
}

function fixtureRecord(overrides = {}) {
  return {
    sourceFile: 'original/high/h2/1final/fixture.js',
    sourceOrdinal: 1,
    id: 1,
    grade: '고2',
    subject: '대수',
    course: '대수',
    standardUnitKey: 'H15-M1-01',
    standardUnit: '지수와 로그',
    level: '하',
    question_uid: 'fixture-1',
    ...overrides
  };
}

test('고2 catalog은 요청한 세 과목만 분류하고 제외 단원을 무시한다', () => {
  const catalog = core.buildCatalog([
    fixtureRecord({ course: '대수', question_uid: 'a' }),
    fixtureRecord({ id: 2, course: '미적분Ⅰ', standardUnitKey: 'H15-M2-01', standardUnit: '함수의 극한', question_uid: 'b' }),
    fixtureRecord({ id: 3, course: '확률과 통계', standardUnitKey: 'H15-PS-01', standardUnit: '순열과 조합', question_uid: 'c' }),
    fixtureRecord({ id: 4, course: '공통', standardUnitKey: 'H15-CALC-01', standardUnit: '제외', question_uid: 'd' })
  ], { profileId: 'h2' });

  assert.equal(catalog.scannedCount, 4);
  assert.equal(catalog.classifiedCount, 3);
  assert.equal(catalog.review.length, 0);
  assert.equal(catalog.invalid.length, 0);
  assert.equal(catalog.ignored.length, 1);
  assert.deepEqual(catalog.units.filter(unit => unit.count > 0).map(unit => unit.course), ['대수', '미적분Ⅰ', '확률과 통계']);
});

test('catalog 정규화는 원본 식별자와 문제지 80문항 상한을 유지한다', () => {
  const records = Array.from({ length: 81 }, (_, index) => fixtureRecord({
    id: index + 1, sourceOrdinal: index + 1, question_uid: `fixture-${index + 1}`
  }));
  const catalog = core.buildCatalog(records, { profileId: 'h2' });
  const unit = catalog.units.find(item => item.count > 0);

  assert.equal(unit.records[0].sourceQuestionNo, 1);
  assert.equal(unit.records[0].questionUid, 'fixture-1');
  assert.deepEqual(unit.papers.map(paper => paper.count), [80, 1]);
  assert.ok(unit.papers.every(paper => paper.count <= 80));
});

test('문제지는 원본 시험지 묶음을 가능한 한 유지하고 80문항을 넘지 않는다', () => {
  const records = [
    ...Array.from({ length: 30 }, (_, index) => ({ sourceFile: 'original/high/h2/1mid/24_A.js', id: index + 1 })),
    ...Array.from({ length: 25 }, (_, index) => ({ sourceFile: 'original/high/h2/1mid/24_B.js', id: index + 1 })),
    ...Array.from({ length: 40 }, (_, index) => ({ sourceFile: 'original/high/h2/1final/24_C.js', id: index + 1 }))
  ];
  const papers = core.splitIntoPapers(records, { target: 50, max: 80 });
  assert.deepEqual(papers.map(paper => paper.length), [55, 40]);
  assert.ok(papers.every(paper => paper.length <= 80));
});

test('중1·중2·중3 catalog은 각 학년의 표시 단원으로 분류한다', () => {
  const index = [
    { sourceFile: 'original/middle/m1/1mid/fixture.js', id: 1, standardUnitKey: 'M22-1-01', question_uid: 'm1' },
    { sourceFile: 'original/middle/m2/1mid/fixture.js', id: 2, standardUnitKey: 'M22-2-01', question_uid: 'm2' },
    { sourceFile: 'original/middle/m3/1mid/fixture.js', id: 3, standardUnitKey: 'M22-3-01', question_uid: 'm3' }
  ];

  for (const [profileId, unitKey] of [['m1', 'M22-1-01'], ['m2', 'M22-2-01'], ['m3', 'M22-3-01']]) {
    const catalog = core.buildCatalog(index, { profileId });
    assert.equal(catalog.scannedCount, 1, profileId);
    assert.equal(catalog.classifiedCount, 1, profileId);
    assert.equal(catalog.review.length, 0, profileId);
    assert.deepEqual(catalog.units.filter(unit => unit.count > 0).map(unit => unit.key), [unitKey], profileId);
  }
});

test('catalog은 범위 밖 원본을 제외하고 원본 문항 번호를 보존한다', () => {
  const catalog = core.buildCatalog([
    { sourceFile: 'original/middle/m3/1mid/fixture.js', id: 24, standardUnitKey: 'M22-3-01', question_uid: 'in-scope' },
    { sourceFile: 'original/high/h1/1mid/fixture.js', id: 25, standardUnitKey: 'H15-SA-01', question_uid: 'out-of-scope' }
  ], { profileId: 'm3' });
  const record = catalog.units.find(unit => unit.count > 0).records[0];

  assert.equal(catalog.scannedCount, 1);
  assert.equal(record.sourceQuestionNo, 24);
  assert.equal(record.questionUid, 'in-scope');
});

test('소단원·난이도 필터는 레거시 난이도를 공통 버킷으로 정규화한다', () => {
  assert.equal(core.normalizeDifficulty('[중]'), '중');
  assert.equal(core.normalizeDifficulty('중1'), '미분류');
  assert.equal(core.normalizeDifficulty('고2'), '미분류');
  assert.equal(core.normalizeDifficulty(''), '미분류');

  const records = [
    { sourceFile: 'a.js', id: 1, subUnitKey: 'A', subUnit: '첫 개념', level: '[중]' },
    { sourceFile: 'a.js', id: 2, subUnitKey: 'A', subUnit: '첫 개념', level: '상' },
    { sourceFile: 'b.js', id: 1, subUnitKey: 'B', subUnit: '둘째 개념', level: '중1' },
    { sourceFile: 'c.js', id: 1, level: '하' }
  ];
  assert.deepEqual(core.getDifficultySummary(records), { 하: 1, 중: 1, 상: 1, 미분류: 1 });
  assert.deepEqual(core.filterUnitRecords(records, { subUnitKeys: ['A'], difficultyBuckets: ['중'] }).map(item => item.id), [1]);
  assert.equal(core.getSubUnitOptions(records).find(item => item.key === '__unclassified__').label, '미분류 소단원');
});

test('필터는 미분류 문항을 명시적으로 허용할 때만 포함한다', () => {
  const records = [
    { id: 'classified', subUnitKey: 'A', subUnit: 'A', level: '중' },
    { id: 'missing-subunit', level: '하' },
    { id: 'missing-level', subUnitKey: 'A', subUnit: 'A', level: '미분류' }
  ];

  assert.deepEqual(core.filterUnitRecords(records).map(item => item.id), ['classified']);
  assert.deepEqual(core.filterUnitRecords(records, { includeUnclassified: true }).map(item => item.id), [
    'classified', 'missing-subunit', 'missing-level'
  ]);
});

test('snake_case UID를 유지하고 소단원 parent scope 밖의 메타데이터를 제거한다', () => {
  assert.equal(core.getQuestionUid({ question_uid: 'snake-uid' }), 'snake-uid');
  assert.equal(core.getRecordIdentity({ question_uid: 'snake-uid', sourceFile: 'other.js', id: 1 }), 'snake-uid');
  assert.equal(core.isSubUnitInParentScope('H22-C-01-CORE', 'H22-C-01'), true);
  assert.equal(core.isSubUnitInParentScope('H22-C-02-LEAK', 'H22-C-01'), false);
  assert.equal(core.isSubUnitInParentScope('H22-C-01-CORE', ''), false);
  assert.equal(core.isSubUnitInParentScope('', ''), true);

  const catalog = core.buildCatalog([{
    sourceFile: 'original/high/h1/1mid/25_scope-test.js', sourceOrdinal: 1, id: 1,
    grade: '고1', subject: '공통수학1', course: '공통수학1', standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산',
    question_uid: 'snake-uid', subUnitKey: 'H22-C-02-LEAK', subUnit: '잘못된 소단원', level: '중'
  }], { profileId: 'h1' });
  const record = catalog.units.find(unit => unit.key === 'H22-C-01').records[0];
  assert.equal(record.questionUid, 'snake-uid');
  assert.equal(record.subUnitKey, '');
  assert.equal(record.subUnit, '');
});

test('고급 조합 출제는 조건별 수량을 채우고 문항 UID를 중복 선택하지 않는다', () => {
  const records = Array.from({ length: 12 }, (_, index) => ({
    sourceFile: `source-${index % 3}.js`, id: index + 1,
    questionUid: `uid-${index + 1}`, subUnitKey: index < 6 ? 'A' : 'B', subUnit: index < 6 ? '첫 개념' : '둘째 개념',
    difficultyBucket: index % 2 ? '중' : '하'
  }));
  const result = core.selectByBlueprint(records, [
    { subUnitKey: 'A', difficultyBucket: '하', count: 2 },
    { subUnitKey: 'B', difficultyBucket: '중', count: 3 }
  ], { seed: 'contract-test' });
  assert.equal(result.ok, true);
  assert.equal(result.selected.length, 5);
  assert.equal(new Set(result.selected.map(item => item.questionUid)).size, 5);
  assert.deepEqual(result.rows.map(row => row.selectedCount), [2, 3]);
  assert.notEqual(
    core.buildSnapshotKey('A', result.selected, { id: 'scope-a' }, { mode: 'quick', difficultyBuckets: ['하'] }),
    core.buildSnapshotKey('A', result.selected, { id: 'scope-a' }, { mode: 'quick', difficultyBuckets: ['상'] })
  );
});

test('선택 결과는 문제지 80문항 상한을 넘기지 않고 중복 UID를 제거한다', () => {
  const duplicateRecords = [
    { sourceFile: 'duplicate.js', id: 1, questionUid: 'same-uid', subUnitKey: 'A', level: '중' },
    { sourceFile: 'duplicate-copy.js', id: 1, questionUid: 'same-uid', subUnitKey: 'A', level: '중' },
    ...Array.from({ length: 3 }, (_, index) => ({ sourceFile: `unique-${index}.js`, id: 1, questionUid: `unique-${index}`, subUnitKey: 'A', level: '중' }))
  ];
  const selected = core.selectRecords(duplicateRecords, { count: 10, includeUnclassified: false, seed: 'dedupe' });
  assert.equal(selected.selected.length, 4);
  assert.equal(new Set(selected.selected.map(item => item.questionUid)).size, 4);

  const overLimit = core.selectByBlueprint(duplicateRecords, [
    { subUnitKey: 'A', difficultyBucket: '중', count: 80 },
    { subUnitKey: 'A', difficultyBucket: '중', count: 1 }
  ], { includeUnclassified: false });
  assert.equal(overLimit.limitExceeded, true);
  assert.equal(overLimit.limit, 80);
  assert.equal(overLimit.selected.length, 0);
});

test('미분류 제외가 기본이고 인접 난이도 허용은 명시적으로만 적용된다', () => {
  const records = [
    { sourceFile: 'known.js', id: 1, questionUid: 'known', subUnitKey: 'A', level: '하' },
    { sourceFile: 'missing-subunit.js', id: 1, questionUid: 'missing-subunit', level: '하' },
    { sourceFile: 'missing-level.js', id: 1, questionUid: 'missing-level', subUnitKey: 'A', level: '중1' }
  ];
  const strict = core.selectByBlueprint(records, [{ subUnitKey: 'A', difficultyBucket: '중', count: 1 }], { includeUnclassified: false });
  assert.equal(strict.ok, false);
  assert.equal(strict.selected.length, 0);

  const relaxed = core.selectByBlueprint(records, [{ subUnitKey: 'A', difficultyBucket: '중', count: 1 }], { includeUnclassified: false, allowAdjacentDifficulty: true });
  assert.equal(relaxed.ok, true);
  assert.equal(relaxed.rows[0].relaxedCount, 1);
  assert.deepEqual(relaxed.selected.map(item => item.questionUid), ['known']);

  const withUnclassified = core.selectByBlueprint(records, [{ count: 2 }], { includeUnclassified: true });
  assert.equal(withUnclassified.selected.length, 2);
  assert.ok(withUnclassified.selected.some(item => item.questionUid === 'missing-subunit' || item.questionUid === 'missing-level'));
});
