const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const core = require(path.join(__dirname, '..', 'archive', 'unit-past-exams-core.js'));

const unitNamed = name => core.PROFILES.m2.units.find(unit => unit.name === name);
// 중2 합성 문항: 옛 대단원(M2-05 도형의 성질 / M2-01 수와 식)만 있고 현행 단원은 못 정한 상태.
function oldChapterRecord(n, overrides = {}) {
  return {
    sourceFile: `original/middle/m2/2mid/24_fixture_2학기_중간_중2_기출.js`, sourceOrdinal: n, id: n,
    standardUnitKey: 'M2-05', standardUnit: '도형의 성질', difficultyBucket: '2', question_uid: `fill-${n}`, ...overrides
  };
}
const classify = (record, fillUnits = true) => core.classifyRecord(record, 'm2', { fillUnits });

test('옛 대단원이 둘로 갈려 미정이던 문항은 옛 소단원 키로 가르고 근거를 legacy-subunit으로 남긴다', () => {
  assert.equal(classify(oldChapterRecord(1)).status, 'review', '보충 판정 전에는 미정이다');
  const triangle = classify(oldChapterRecord(1, { subUnitKey: 'M2-05-TRIANGLE_PROPERTIES' }));
  assert.deepEqual([triangle.unitKey, triangle.reason], [unitNamed('삼각형의 성질').key, 'legacy-subunit']);
  const quad = classify(oldChapterRecord(2, { subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES' }));
  assert.equal(quad.unitKey, unitNamed('사각형의 성질').key);
  const rational = classify(oldChapterRecord(3, { standardUnitKey: 'M2-01', standardUnit: '수와 식', subUnitKey: 'M2-01-REPEATING_DECIMAL' }));
  assert.equal(rational.unitKey, unitNamed('유리수와 순환소수').key);
  const expr = classify(oldChapterRecord(4, { standardUnitKey: 'M2-01', standardUnit: '수와 식', subUnitKey: 'M2-01-EXPONENT_LAW' }));
  assert.equal(expr.unitKey, unitNamed('식의 계산').key);
});

test('소단원 키는 옛 대단원과 짝이 맞을 때만 쓰고, 맞지 않으면 유형 힌트로 넘어간다', () => {
  const mismatched = classify(oldChapterRecord(5, { standardUnitKey: 'M2-01', standardUnit: '수와 식', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES', metaHintUnit: '식의 계산' }));
  assert.deepEqual([mismatched.unitKey, mismatched.reason], [unitNamed('식의 계산').key, 'type-hint']);
});

test('소단원 키로 못 가른 문항은 유형 힌트(metaHintUnit)를 쓰고, 힌트가 없으면 미정으로 남는다', () => {
  const hinted = classify(oldChapterRecord(6, { subUnitKey: 'M2-05-NOT_IN_TABLE', metaHintUnit: '사각형의 성질' }));
  assert.deepEqual([hinted.unitKey, hinted.reason], [unitNamed('사각형의 성질').key, 'type-hint']);
  assert.equal(classify(oldChapterRecord(7, { standardUnitKey: '', standardUnit: '' })).status, 'review');
  assert.equal(classify(oldChapterRecord(8, { metaHintUnit: '없는 단원' })).status, 'review');
});

test('힌트가 닮음이어도 외심·내심·사각형 유형 값이 있으면 삼각형·사각형의 성질로 보내고, 근거가 없으면 힌트 그대로다', () => {
  const base = { standardUnitKey: '', standardUnit: '', metaHintUnit: '도형의 닮음과 피타고라스 정리' };
  const center = classify(oldChapterRecord(9, { ...base, problemTypeKey: 'PT_TRIANGLE_CENTERS', templateKey: 'TPL_TRIANGLE_CIRCUMCENTER' }));
  assert.equal(center.unitKey, unitNamed('삼각형의 성질').key);
  const quad = classify(oldChapterRecord(10, { ...base, problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES' }));
  assert.equal(quad.unitKey, unitNamed('사각형의 성질').key);
  // 무게중심은 닮음 단원이다: 유형 TRIANGLE_CENTERS만 있거나 무게중심 값이 섞이면 보내지 않는다.
  const similarName = unitNamed('도형의 닮음과 피타고라스 정리').key;
  assert.equal(classify(oldChapterRecord(16, { ...base, problemTypeKey: 'PT_TRIANGLE_CENTERS' })).unitKey, similarName);
  assert.equal(classify(oldChapterRecord(17, { ...base, problemTypeKey: 'PT_M2_CENTROID', subUnitKey: 'M2-06-TRIANGLE_CENTROID' })).unitKey, similarName);
  assert.equal(classify(oldChapterRecord(18, { ...base, problemTypeKey: 'PT_TRIANGLE_CENTERS', templateKey: 'TPL_TRIANGLE_CENTERS_SEMANTIC', subUnitKey: 'M2-06-TRIANGLE_CENTROID' })).unitKey, similarName);
  assert.equal(classify(oldChapterRecord(19, { ...base, problemTypeKey: 'PT_TRIANGLE_CENTERS', templateKey: 'TPL_TRIANGLE_CENTERS_SEMANTIC' })).unitKey, unitNamed('삼각형의 성질').key);
  const similar = classify(oldChapterRecord(11, { ...base, problemTypeKey: 'PT_SIMILAR_FIGURES' }));
  assert.equal(similar.unitKey, unitNamed('도형의 닮음과 피타고라스 정리').key);
});

test('이미 정해진 판정은 보충 판정이 바꾸지 않는다', () => {
  const settled = oldChapterRecord(12, { standardUnitKey: '', standardUnit: '일차함수', subUnitKey: 'M2-05-TRIANGLE_PROPERTIES', metaHintUnit: '삼각형의 성질' });
  const before = classify(settled, false);
  assert.equal(before.status, 'classified');
  assert.deepEqual(classify(settled, true), before);
});

test('buildCatalog는 보충 판정으로 들어온 문항에만 근거(unitBasis)를 남긴다', () => {
  const records = [
    oldChapterRecord(13, { standardUnitKey: '', standardUnit: '일차함수' }),
    oldChapterRecord(14, { subUnitKey: 'M2-05-TRIANGLE_PROPERTIES' }),
    oldChapterRecord(15, { standardUnitKey: '', standardUnit: '', metaHintUnit: '확률' })
  ];
  const catalog = core.buildCatalog(records, { profileId: 'm2' });
  const placed = catalog.units.flatMap(unit => unit.records);
  const basis = Object.fromEntries(placed.map(record => [record.id, record.unitBasis || '']));
  assert.deepEqual(basis, { 13: '', 14: 'legacy-subunit', 15: 'type-hint' });
  assert.equal(catalog.review.length, 0);
  const off = core.buildCatalog(records, { profileId: 'm2', fillUnits: false });
  assert.equal(off.review.length, 2, '끄면 예전처럼 미정으로 남는다');
});

test('고2·고3 단원표는 같은 풀이라 고3 폴더 시험지도 들어가고, 2015 기하 단원 키(H15-GV)는 힌트보다 먼저 키 대응으로 정해진다', () => {
  const h2 = core.PROFILES.h2;
  assert.equal(core.isInScope({ sourceFile: 'original/high/h3/1mid/26_fixture_1학기_중간_고3_미적분2.js' }, h2.scope), true);
  assert.equal(core.isInScope({ sourceFile: 'original/high/h1/1mid/26_fixture_1학기_중간_고1_기출.js' }, h2.scope), false);
  const geometry = (key, overrides = {}) => ({
    sourceFile: 'original/high/h2/1mid/24_fixture_1학기_중간_고2_기하.js', sourceOrdinal: 1, id: 1,
    standardUnitKey: key, standardUnit: '', question_uid: `gv-${key}`, ...overrides
  });
  const unitKeyOf = name => h2.units.find(unit => unit.name === name).key;
  assert.equal(core.classifyRecord(geometry('H15-GV-05', { metaHintUnit: unitKeyOf('이차곡선') }), 'h2', { fillUnits: true }).unitKey, unitKeyOf('벡터의 연산'));
  // 성분·내적(06·07)은 키 대응이 없어 유형 힌트가 맡는다.
  const viaHint = core.classifyRecord(geometry('H15-GV-06', { metaHintUnit: unitKeyOf('벡터의 성분') }), 'h2', { fillUnits: true });
  assert.deepEqual([viaHint.unitKey, viaHint.reason], [unitKeyOf('벡터의 성분'), 'type-hint']);
});
