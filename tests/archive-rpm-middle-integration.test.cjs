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


test('explicit original and raw source curriculum outrank the middle-school year fallback in both adapters', () => {
  const mapping = Toc.authority.leafMappings.find(row => Toc.normalizePath(row.basePath).courseKey === 'M1-2');
  for (const [curriculum, year, status] of [['2015', 2026, 'OUT_OF_SCOPE'], ['2022', 2024, 'EXACT']]) {
    const record = { ...recordFor(mapping, 0), curriculum, year, sourceFile: `original/middle/m1/2mid/${String(year).slice(-2)}_curriculum_fixture.js` };
    delete record.curriculumKey;
    const before = JSON.stringify(record);
    assert.equal(UnitCore.resolveRpmParent(record, 'm1').status, status);
    const entry = Unified.classify(record).entry;
    assert.equal(entry.originalCurriculum, curriculum);
    assert.equal(entry.rpmParentStatus, status);
    assert.equal(JSON.stringify(record), before);
  }
  const original = { ...recordFor(mapping, 1), curriculumKey: '2022', originalCurriculum: '2015', year: 2026 };
  assert.equal(UnitCore.resolveRpmParent(original, 'm1').status, 'OUT_OF_SCOPE');
  assert.equal(Unified.classify(original).entry.originalCurriculum, '2015');
  assert.equal(Unified.classify(original).entry.rpmParentStatus, 'OUT_OF_SCOPE');
});

test('a pending reviewed parent correction cannot browse under a stale unverified metadata parent', () => {
  // Exact regression identity and fingerprint transition from the reviewed M1 Q13
  // parent correction. No source content, approval or canonical record is changed.
  const currentFingerprint = 'c63aa7ce8096ae25542432a35c8598cb8a3ca3411187d7672a01e056f163096e';
  const oldFingerprint = '29930a5dd53e3f66a9073eabaedd2a073cd499d922e31d73294c80ad83b2da09';
  const source = {
    sourceFile: 'original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js',
    id: 13, sourceOrdinal: 13, sourceQuestionNo: '13',
    questionUid: 'qid_v1_618d09e48445ce3e0556235122b322e592ecd1eac03133418968ef89dbeed46e',
    sourceGrade: '중1', curriculumKey: '2022', courseKey: 'M1-2',
    standardUnitKey: 'M1-05', standardUnit: '기본도형', subUnitKey: 'M1-05-POSITION_RELATION',
  };
  const record = {
    ...source, standardUnitKey: '', standardUnit: '', subUnitKey: '',
    legacyStandardUnitKey: source.standardUnitKey, legacyStandardUnit: source.standardUnit,
    legacySubUnitKey: source.subUnitKey, sourceFingerprint: currentFingerprint,
    metadataAssignmentEvidence: { sourceFingerprint: oldFingerprint },
    unverifiedTaxonomy: { curriculumKey: '2022', courseKey: 'M1-2',
      L1: '입체도형', L2: '다면체와 회전체', L3: '다면체', L4: '각기둥·각뿔' },
  };
  const before = JSON.stringify(record), currentUnit = UnitCore.classifyRecord(source, 'm1').unitKey;
  assert.equal(currentUnit, 'RPM22-M1-L1-05');
  assert.equal(Unified.classify(record).entry.unitKey, currentUnit);
  assert.equal(UnitCore.resolveRpmParent(record, 'm1').basis, undefined,
    'the obsolete unverified parent is not an authority for the changed source');
  assert.equal(JSON.stringify(record), before);

  // Exact or unavailable bindings keep the existing legacy-parent behavior.
  for (const evidence of [{ sourceFingerprint: currentFingerprint }, {}, undefined]) {
    const sameOrUnknown = { ...record, metadataAssignmentEvidence: evidence };
    assert.equal(UnitCore.resolveRpmParent(sameOrUnknown, 'm1').basis, 'UNVERIFIED_PARENT');
    assert.equal(Unified.classify(sameOrUnknown).entry.unitKey, 'RPM22-M1-L1-07');
  }
  const noCurrentFingerprint = { ...record, sourceFingerprint: '' };
  assert.equal(UnitCore.resolveRpmParent(noCurrentFingerprint, 'm1').basis, 'UNVERIFIED_PARENT');

  // Reviewed explicit RPM evidence is resolved as before, even if a separate
  // unverified fallback is stale. An explicit conflict remains a refusal.
  const explicit = { ...record, rpmPrimaryPath: { curriculum: '2022', scope: 'M1-2', L1: '입체도형', L2: '다면체와 회전체' } };
  assert.equal(UnitCore.resolveRpmParent(explicit, 'm1').basis, 'RPM_PRIMARY_PATH');
  assert.equal(Unified.classify(explicit).entry.unitKey, 'RPM22-M1-L1-07');
  const conflict = { ...explicit, rpmMetadata: { curriculumKey: '2022', courseKey: 'M1-2', L1: '기본 도형', L2: '위치 관계' } };
  assert.equal(UnitCore.resolveRpmParent(conflict, 'm1').status, 'AMBIGUOUS');
  assert.equal(UnitCore.resolveRpmParent(conflict, 'm1').reason, 'RPM_EVIDENCE_PATH_CONFLICT');
});
test('a row still bound to the same stem and choices keeps its approved parent when only the whole-source fingerprint moved', () => {
  // 해설·정답·그림이 바뀌면 전체 지문(sourceFingerprint)이 달라진다. 결속은 발문+보기뿐이므로 그것만으로 승인된 중단원을 버리지 않는다.
  const record = {
    sourceFile: 'original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js',
    id: 13, sourceOrdinal: 13, sourceQuestionNo: '13',
    questionUid: 'qid_v1_618d09e48445ce3e0556235122b322e592ecd1eac03133418968ef89dbeed46e',
    sourceGrade: '중1', curriculumKey: '2022', courseKey: 'M1-2',
    sourceFingerprint: 'c63aa7ce8096ae25542432a35c8598cb8a3ca3411187d7672a01e056f163096e',
    metadataAssignmentEvidence: { sourceFingerprint: '29930a5dd53e3f66a9073eabaedd2a073cd499d922e31d73294c80ad83b2da09',
      fieldStatus: { standardUnit: 'approved_final_qa' } },
    unverifiedTaxonomy: { curriculumKey: '2022', courseKey: 'M1-2', L1: '입체도형', L2: '다면체와 회전체', L3: '다면체', L4: '각기둥·각뿔' },
  };
  assert.equal(UnitCore.resolveRpmParent({ ...record, metaBinding: 'text' }, 'm1').basis, 'UNVERIFIED_PARENT');
  // 결속이 없거나 단원 칸이 승인되지 않은 행은 예전처럼 낡은 부모를 쓰지 않는다.
  assert.equal(UnitCore.resolveRpmParent(record, 'm1').basis, undefined);
  const unapproved = { ...record, metaBinding: 'text', metadataAssignmentEvidence: { ...record.metadataAssignmentEvidence, fieldStatus: { standardUnit: 'manual_review_pending' } } };
  assert.equal(UnitCore.resolveRpmParent(unapproved, 'm1').basis, undefined);
});
