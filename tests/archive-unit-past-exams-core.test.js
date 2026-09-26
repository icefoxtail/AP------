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

test('전체 단원 기출과 바로 쓰는 문제지는 연도를 학기보다 우선해 최신순으로 준비한다', () => {
  const records = [2021, 2025, 2026, 2025].map((year, i) => fixtureRecord({
    sourceFile: `original/high/h2/${i === 2 ? '2final' : '1mid'}/${year}_school.js`,
    examYear: year, id: i + 1, sourceOrdinal: i + 1, question_uid: `year-${i}`,
    subUnitKey: 'A', subUnit: '개념', difficultyBucket: '중'
  }));
  const catalog = core.buildCatalog(records, { profileId: 'h2' });
  assert.deepEqual(catalog.units.find(unit => unit.count).papers.flatMap(paper => paper.records.map(core.getExamYear)), [2026, 2025, 2025, 2021]);
  for (const seed of ['first', 'second']) {
    const result = core.selectRecords(records, { count: 2, seed });
    assert.deepEqual(result.selected.map(core.getExamYear), [2026, 2025]);
  }
  const unknown = fixtureRecord({sourceFile:'original/high/h2/1mid/unknown.js'});
  assert.ok(core.compareRecords(unknown, records[0]) > 0);
});

test('구형 기말·중간 경로는 파일명의 학기로 현재 아카이브 경로를 복구한다', () => {
  const finalPath = 'original/high/h2/final/25_제일고_2학기_기말_고2_수학II.js';
  assert.deepEqual(core.getSourceFileCandidates(finalPath), [
    'original/high/h2/2final/25_제일고_2학기_기말_고2_수학II.js',
    finalPath
  ]);
  assert.deepEqual(core.getSourceFileCandidates('original/middle/m3/mid/24_학교_1학기_중간_중3_기출.js'), [
    'original/middle/m3/1mid/24_학교_1학기_중간_중3_기출.js',
    'original/middle/m3/mid/24_학교_1학기_중간_중3_기출.js'
  ]);
  assert.deepEqual(core.getSourceFileCandidates('original/high/h2/2final/fixture.js'), [
    'original/high/h2/2final/fixture.js'
  ]);
});

test('고2·고3 shared high-semantic catalog은 같은 5과목 단원 projection을 사용한다', () => {
  const records = [
    fixtureRecord({ course: '대수', question_uid: 'a' }),
    fixtureRecord({ id: 2, course: '미적분Ⅰ', standardUnitKey: 'H15-M2-01', standardUnit: '함수의 극한', question_uid: 'b' }),
    fixtureRecord({ id: 3, course: '확률과 통계', standardUnitKey: 'H15-PS-01', standardUnit: '순열과 조합', question_uid: 'c' }),
    fixtureRecord({ id: 4, course: '미적분Ⅱ', standardUnitKey: 'H15-CALC-01', standardUnit: '수열의 극한', question_uid: 'd' }),
    fixtureRecord({ id: 5, course: '기하', standardUnitKey: 'H22-GE-01', standardUnit: '이차곡선', question_uid: 'e' })
  ];
  const h2 = core.buildCatalog(records, { profileId: 'h2' });
  const h3 = core.buildCatalog(records, { profileId: 'h3' });

  assert.equal(core.PROFILES.h2.units.length, 38);
  assert.equal(core.PROFILES.h3.units.length, 38);
  assert.equal(core.PROFILES.h2.units, core.PROFILES.h3.units);
  assert.equal(core.PROFILES.h2.scope, core.PROFILES.h3.scope);
  assert.equal(h2.classifiedCount, 5);
  assert.equal(h3.classifiedCount, 5);
  assert.equal(h2.ignored.length, 0);
  assert.equal(h3.ignored.length, 0);
  assert.deepEqual(
    h2.units.filter(unit => unit.count > 0).map(unit => unit.course),
    ['대수', '미적분Ⅰ', '확률과 통계', '미적분Ⅱ', '기하']
  );
  assert.deepEqual(
    h3.units.filter(unit => unit.count > 0).map(unit => unit.key),
    h2.units.filter(unit => unit.count > 0).map(unit => unit.key)
  );
  assert.equal(core.resolveUnitKeyAlias('h3', 'H22-MI1-06'), 'H22-M1-05');
});

test('high-semantic mapping precedence는 override → explicit ignore → direct canonical → legacy 순서를 지킨다', () => {
  const ignored = core.classifyRecord(fixtureRecord({
    sourceFile: 'original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js',
    id: 22,
    sourceOrdinal: 22,
    standardUnitKey: 'H22-A-01',
    standardUnit: '지수와 로그',
    question_uid: 'ignored-direct'
  }), 'h2');
  assert.equal(ignored.status, 'ignored');
  assert.equal(ignored.reason, '공통수학 문항');

  const overridden = core.classifyRecord(fixtureRecord({
    sourceFile: 'original/high/h2/1final/26_제일고_1학기_기말_고2_대수.js',
    id: 19,
    sourceOrdinal: 19,
    standardUnitKey: 'H22-C2-02',
    standardUnit: '직선의 방정식',
    question_uid: 'override-first'
  }), 'h2');
  assert.equal(overridden.status, 'classified');
  assert.equal(overridden.reason, 'manual-override');
  assert.equal(overridden.unitKey, 'H22-A-04');
});

test('scope 제외는 block이고 advanced taxonomy 미완성은 기본 pool을 차단하지 않는다', () => {
  const runtime = {
    status: 'ACTIVE',
    ownedScopes: [{ curriculumKey: '2022', courseKey: '공통수학2', L1: '도형의 방정식', L2: '평면좌표' }],
    taxonomyRows: [{
      curriculumKey: '2022', courseKey: '공통수학2', L1: '도형의 방정식', L2: '평면좌표',
      problemTypeKey: 'PT_OK', templateKey: 'TPL_OK', defaultSelectable: true
    }]
  };
  const authority = core.createMetaFoundationSelectionAuthority(runtime);
  const base = {
    curriculumKey: '2022', courseKey: '공통수학2', L1: '도형의 방정식', L2: '평면좌표',
    problemTypeKey: 'PT_OK', templateKey: 'TPL_OK', defaultSelectable: true
  };
  assert.deepEqual(core.validateMetaFoundationSelection(base, authority), {
    owned: true, valid: true, reason: 'ACTIVE_TAXONOMY_ROW'
  });
  assert.equal(core.validateMetaFoundationSelection({ ...base, problemTypeKey: 'PT_BROKEN' }, authority).valid, false);
  assert.equal(core.validateMetaFoundationSelection({ ...base, templateKey: 'TPL_WRONG_PARENT' }, authority).valid, false);
  assert.deepEqual(core.validateMetaFoundationSelection({
    curriculumKey: '2015', courseKey: '수학I', L1: '대수', L2: '수열',
    problemTypeKey: 'LEGACY', templateKey: 'LEGACY'
  }, authority), { owned: false, valid: true, reason: 'NOT_OWNED' });

  const records = [
    { id: 1, sourceFile: 'a.js', questionUid: 'ok', subUnitKey: 'L2', subUnit: '소단원', level: '중', defaultSelectable: true, metaFoundationOwnedScope: true, metaFoundationTaxonomyValid: true },
    { id: 2, sourceFile: 'b.js', questionUid: 'supplementary', subUnitKey: 'L2', subUnit: '소단원', level: '중', defaultSelectable: false, metaFoundationOwnedScope: true, metaFoundationTaxonomyValid: true },
    { id: 3, sourceFile: 'c.js', questionUid: 'broken-taxonomy', subUnitKey: 'L2', subUnit: '소단원', level: '중', defaultSelectable: true, metaFoundationOwnedScope: true, metaFoundationTaxonomyValid: false }
  ];
  assert.deepEqual(core.filterUnitRecords(records).map(item => item.questionUid), ['ok', 'broken-taxonomy']);
  assert.deepEqual(core.getSubUnitOptions(records).map(item => [item.key, item.count]), [['L2', 2]]);

  const selected = core.selectByBlueprint(records, [{ subUnitKey: 'L2', difficultyBucket: '중', count: 2 }], {});
  assert.equal(selected.ok, true);
  assert.equal(selected.selectedCount, 2);
  assert.equal(selected.shortage, 0);
});

test('advanced runtime unavailable 자체는 기본 출제 gate가 아니다', () => {
  const records = [
    {
      sourceFile: 'legacy.js', id: 1, questionUid: 'legacy-runtime-down',
      subUnitKey: 'A', subUnit: '개념', difficultyBucket: '중',
      metaFoundationRuntimeAvailable: false
    },
    {
      sourceFile: 'owned.js', id: 2, questionUid: 'owned-runtime-down',
      subUnitKey: 'A', subUnit: '개념', difficultyBucket: '중',
      defaultSelectable: true,
      metaFoundationRuntimeAvailable: false,
      metaFoundationOwnedScope: true,
      metaFoundationTaxonomyValid: false
    }
  ];
  assert.equal(core.isAutomaticSelectable(records[0]), true);
  assert.equal(core.isAutomaticSelectable(records[1]), true);
  assert.deepEqual(core.filterUnitRecords(records, { includeUnclassified: true }), records);
  const result = core.selectByBlueprint(records, [{ subUnitKey: 'A', difficultyBucket: '중', count: 1 }], {});
  assert.equal(result.ok, true);
  assert.equal(result.selectedCount, 1);
  assert.equal(result.shortage, 0);
});

test('ready paper split은 non-selectable classified record를 보존 집계하되 문제지에는 넣지 않는다', () => {
  const records = [
    fixtureRecord({ id: 1, sourceOrdinal: 1, question_uid: 'ready-ok', subUnitKey: 'A', subUnit: '개념', level: '중', defaultSelectable: true }),
    fixtureRecord({ id: 2, sourceOrdinal: 2, question_uid: 'ready-supplementary', subUnitKey: 'A', subUnit: '개념', level: '중', defaultSelectable: false })
  ];
  const catalog = core.buildCatalog(records, { profileId: 'h2' });
  const unit = catalog.units.find(item => item.count > 0);
  assert.equal(catalog.classifiedCount, 2);
  assert.equal(unit.count, 2);
  assert.equal(unit.selectableCount, 1);
  assert.equal(unit.excludedFromAutomaticCount, 1);
  assert.deepEqual(unit.papers.flatMap(paper => paper.records.map(item => item.questionUid)), ['ready-ok']);
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

test('마스터 소단원 표기를 우선 사용하고 영문 표시를 차단한다', () => {
  const previous = globalThis.ARCHIVE_SUBUNIT_LABELS;
  globalThis.ARCHIVE_SUBUNIT_LABELS = {
    'H15-M2-03-DERIVATIVE': '미분',
    'H15-M2-03-DERIVATIVE_DEFINITION': '미분계수'
  };
  try {
    assert.equal(core.getSubUnitLabel({ subUnitKey: 'H15-M2-03-DERIVATIVE', subUnit: 'derivative' }), '미분');
    assert.equal(core.getSubUnitLabel({ subUnitKey: 'H15-M2-03-DERIVATIVE_DEFINITION', subUnit: '미분계수' }), '미분계수');
    assert.equal(core.getSubUnitLabel({ subUnitKey: 'UNKNOWN', subUnit: 'legacy-english' }), '소단원 검토 필요');
    assert.deepEqual(core.getSubUnitOptions([
      { subUnitKey: 'H15-M2-03-DERIVATIVE', subUnit: 'derivative', level: '중' },
      { subUnitKey: 'H15-M2-03-DERIVATIVE_DEFINITION', subUnit: '미분계수', level: '중' }
    ]).map(item => item.label), ['미분', '미분계수']);
  } finally {
    if (previous === undefined) delete globalThis.ARCHIVE_SUBUNIT_LABELS;
    else globalThis.ARCHIVE_SUBUNIT_LABELS = previous;
  }
});

test('소단원 누락은 scope 제외지만 난이도 미분류는 기본 후보에 포함한다', () => {
  const records = [
    { id: 'classified', subUnitKey: 'A', subUnit: 'A', level: '중' },
    { id: 'missing-subunit', level: '하' },
    { id: 'missing-level', subUnitKey: 'A', subUnit: 'A', level: '미분류' }
  ];

  assert.deepEqual(core.filterUnitRecords(records).map(item => item.id), ['classified', 'missing-level']);
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

test('L2→L3→L4 blueprint는 계층 조건별 실제 후보 수와 부족분을 계산한다', () => {
  const records = [
    { sourceFile: 'a.js', id: 1, questionUid: 'u1', subUnitKey: 'L2-A', subUnit: '소단원 A', problemTypeKey: 'PT-A', L3: '유형 A', templateKey: 'TPL-A1', L4: '템플릿 A1', difficultyBucket: '중' },
    { sourceFile: 'b.js', id: 2, questionUid: 'u2', subUnitKey: 'L2-A', subUnit: '소단원 A', problemTypeKey: 'PT-A', L3: '유형 A', templateKey: 'TPL-A2', L4: '템플릿 A2', difficultyBucket: '중' },
    { sourceFile: 'c.js', id: 3, questionUid: 'u3', subUnitKey: 'L2-B', subUnit: '소단원 B', problemTypeKey: 'PT-B', L3: '유형 B', templateKey: 'TPL-B1', L4: '템플릿 B1', difficultyBucket: '상' }
  ];

  assert.deepEqual(core.getProblemTypeOptions(records, { subUnitKeys: ['L2-A'] }).map(item => item.key), ['PT-A']);
  assert.deepEqual(
    new Set(core.getTemplateOptions(records, { subUnitKeys: ['L2-A'], problemTypeKeys: ['PT-A'] }).map(item => item.key)),
    new Set(['TPL-A1', 'TPL-A2'])
  );

  const exact = core.selectByBlueprint(records, [
    { subUnitKey: 'L2-A', problemTypeKey: 'PT-A', templateKey: 'TPL-A2', difficultyBucket: '중', count: 1 }
  ], { seed: 'taxonomy-exact' });
  assert.equal(exact.ok, true);
  assert.deepEqual(exact.selected.map(item => item.questionUid), ['u2']);
  assert.equal(exact.rows[0].availableCount, 1);
  assert.equal(exact.rows[0].problemTypeKey, 'PT-A');
  assert.equal(exact.rows[0].templateKey, 'TPL-A2');

  const short = core.selectByBlueprint(records, [
    { subUnitKey: 'L2-A', problemTypeKey: 'PT-A', templateKey: 'TPL-A2', difficultyBucket: '중', count: 2 }
  ], { seed: 'taxonomy-short' });
  assert.equal(short.ok, false);
  assert.equal(short.rows[0].availableCount, 1);
  assert.equal(short.rows[0].shortage, 1);
});

test('taxonomy blueprint provenance은 snapshot identity에 포함된다', () => {
  const records = [{ sourceFile: 'a.js', id: 1, questionUid: 'uid-a' }];
  const scope = { id: 'scope' };
  const first = core.buildSnapshotKey('H22-A-01', records, scope, {
    mode: 'advanced',
    taxonomyPlan: [{ subUnitKey: 'L2', problemTypeKey: 'PT-A', templateKey: 'TPL-A', difficultyBucket: '중', count: 1 }]
  });
  const second = core.buildSnapshotKey('H22-A-01', records, scope, {
    mode: 'advanced',
    taxonomyPlan: [{ subUnitKey: 'L2', problemTypeKey: 'PT-A', templateKey: 'TPL-B', difficultyBucket: '중', count: 1 }]
  });
  assert.notEqual(first, second);
});
