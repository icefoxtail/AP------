const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../archive/archive2-core.js');
const UnitCore = require('../archive/unit-past-exams-core.js');
const Unified = require('../archive/archive2-unified-units.js');
const Toc = require('../archive/rpm-middle-toc.js');

function recordFor(mapping, index) {
  const path = Toc.normalizePath(mapping.basePath);
  const gradeNo = path.courseKey[1];
  const parent = Toc.refinePath(path).parent;
  return {
    sourceFile: `original/middle/m${gradeNo}/2mid/26_rpm_fixture.js`,
    id: index + 1, sourceOrdinal: index + 1, sourceQuestionNo: index + 1,
    questionUid: `rpm-fixture-${index}`, sourceGrade: `중${gradeNo}`, grade: `중${gradeNo}`,
    ...path, rpmPrimaryPath: Toc.toRpmPath(path),
    standardUnitKey: parent.legacyUnitKeys[0], legacyStandardUnitKey: parent.legacyUnitKeys[0],
    subUnitKey: 'shared-old-combined-key', subUnit: '기존 통합 분류', level: '중',
  };
}

test('all 326 existing leaves select exactly one of 54 current chapters without rewriting source or request paths', () => {
  const records = Toc.authority.leafMappings.map(recordFor);
  const before = JSON.stringify(records);
  const requestPaths = records.map(record => Core.generalPathKey(record, 4));
  const byGrade = Unified.buildIndex(records);
  const parents = new Set();
  for (const record of records) {
    const expected = Toc.refinePath(record.rpmPrimaryPath).parent;
    parents.add(expected.parentKey);
    const classified = UnitCore.classifyRecord(record, `m${record.sourceGrade[1]}`);
    assert.equal(classified.unitKey, expected.unitKey);
    assert.equal(byGrade.byUid.get(record.questionUid).rpmParent.parentKey, expected.parentKey);
    assert.equal(UnitCore.getSelectionSubUnitKey(record), expected.parentKey);
    assert.equal(UnitCore.getSelectionSubUnitLabel(record), expected.L2);
  }
  assert.equal(parents.size, 54);
  for (const parentKey of parents) {
    const selected = UnitCore.filterUnitRecords(records, { subUnitKeys: [parentKey] });
    const expectedUids = records.filter(record => Toc.refinePath(record.rpmPrimaryPath).parentKey === parentKey)
      .map(record => record.questionUid);
    assert.deepEqual(selected.map(record => record.questionUid), expectedUids);
  }
  assert.equal(JSON.stringify(records), before);
  assert.deepEqual(records.map(record => Core.generalPathKey(record, 4)), requestPaths);
});

test('legacy combined units remain unresolved but an exact official chapter label safely identifies its L1', () => {
  const base = {
    sourceFile: 'original/middle/m2/1final/22_fixture.js', id: 1, sourceQuestionNo: 1,
    sourceGrade: '중2', curriculumKey: '2015', questionUid: 'legacy-square',
    standardUnitKey: 'M22-2-06', legacyStandardUnitKey: 'M22-2-06',
    subUnitKey: 'old-square-key', subUnit: '여러 가지 사각형',
  };
  assert.equal(UnitCore.classifyRecord({ ...base, standardUnit: '도형의 성질' }, 'm2').status, 'review');
  const square = { ...base, standardUnit: '여러 가지 사각형', legacyStandardUnit: '여러 가지 사각형' };
  const parent = Toc.parents('중2').find(row => row.L2 === '여러 가지 사각형');
  assert.equal(UnitCore.classifyRecord(square, 'm2').unitKey, parent.unitKey);
  const classified = Unified.classify(square).entry;
  assert.equal(classified.unitKey, parent.unitKey);
  assert.equal(classified.originalCurriculum, '2015');
  assert.equal(classified.rpmParentStatus, 'OUT_OF_SCOPE');
  assert.equal(classified.rpmParent, null);
  assert.equal(UnitCore.getSelectionSubUnitLabel(square), '이전 분류 · 여러 가지 사각형');
  assert.equal(UnitCore.getSubUnitKey(square), 'old-square-key');
});

test('a broad current key alone cannot fill 작도와 합동 or erase the original key', () => {
  const record = {
    sourceFile: 'original/middle/m1/2mid/26_fixture.js', id: 1, sourceGrade: '중1', curriculumKey: '2022',
    standardUnitKey: 'M22-1-05', subUnitKey: 'M1-05-BASIC_FIGURE', subUnit: '기본 도형', level: '중',
  };
  const before = JSON.stringify(record);
  assert.equal(UnitCore.resolveRpmParent(record).status, 'LEGACY_PARENT_AMBIGUOUS');
  assert.equal(UnitCore.getSelectionSubUnitKey(record), '');
  const construction = Toc.parents('중1').find(row => row.L2 === '작도와 합동');
  assert.equal(UnitCore.filterUnitRecords([record], { subUnitKeys: [construction.parentKey] }).length, 0);
  assert.equal(JSON.stringify(record), before);
});
