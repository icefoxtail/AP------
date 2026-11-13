import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Toc from '../../rpm-middle-toc.js';
import { buildMiddleToc, validateParentAuthority } from './build-rpm-middle-toc.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const authority = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json'), 'utf8'));
const master = JSON.parse(fs.readFileSync(path.join(root, authority.baseAuthority.path), 'utf8'));
const p = (scope, L1, L2, L3 = '', L4 = '', curriculumKey = '2022') => ({ curriculumKey, courseKey: scope, L1, L2, L3, L4 });
const mappingFor = (scope, concept) => authority.leafMappings.find(row => row.basePath[1] === scope && row.basePath[4] === concept);

test('the six publisher books define 24 units and 54 selectable parents, with matching generated browser data', () => {
  assert.equal(Toc.units().length, 24);
  assert.equal(Toc.parents().length, 54);
  assert.deepEqual(Object.fromEntries(['M1-1', 'M1-2', 'M2-1', 'M2-2', 'M3-1', 'M3-2']
    .map(scope => [scope, Toc.parents().filter(row => row.courseKey === scope).length])),
  { 'M1-1': 9, 'M1-2': 9, 'M2-1': 10, 'M2-2': 10, 'M3-1': 9, 'M3-2': 7 });
  for (const unit of Toc.units()) {
    assert.ok(unit.legacyUnitKeys.length);
    assert.deepEqual(unit.parentKeys, Toc.parents(unit.grade).filter(parent => parent.unitKey === unit.key).map(parent => parent.key));
  }
  assert.equal(validateParentAuthority(authority, root).leafCount, 326);
  assert.equal(buildMiddleToc({ root, check: true }).changed, false);
});

test('all 326 locked leaves keep their L3/L4 and round trip through one effective parent without losing crosswalk IDs', () => {
  const expectedLeaves = [];
  for (const parent of master.records) {
    if (parent.curriculum !== '2022' || !/^M[123]-[12]$/.test(parent.scope)) continue;
    for (const concept of parent.concepts) for (const leaf of concept.problemTypes)
      expectedLeaves.push([parent.curriculum, parent.scope, parent.majorUnit, parent.midUnit, concept.concept, leaf.problemType]);
  }
  assert.equal(expectedLeaves.length, 326);
  const rows = ['middle1', 'middle2', 'middle3'].flatMap(name =>
    JSON.parse(fs.readFileSync(path.join(root, `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/${name}.json`), 'utf8')).records);
  for (const tuple of expectedLeaves) {
    const base = Toc.refinePath(tuple);
    assert.equal(base.status, 'EXACT', JSON.stringify(tuple));
    assert.equal(base.granularity, 'LEAF');
    assert.deepEqual([base.effectivePath.L3, base.effectivePath.L4], tuple.slice(4));
    const effective = Toc.refinePath(base.effectivePath);
    assert.equal(effective.baseLeafKey, JSON.stringify(tuple));
    assert.deepEqual(effective.basePath, Toc.normalizePath(tuple));
    const expectedIds = rows.filter(row => row.curriculum === tuple[0] && row.scope === tuple[1] &&
      row.rpmPath.majorUnit === tuple[2] && row.rpmPath.midUnit === tuple[3] &&
      row.rpmPath.l3 === tuple[4] && row.rpmPath.l4 === tuple[5]).map(row => row.id).sort();
    assert.deepEqual([...base.crosswalkRecordIds].sort(), expectedIds);
  }
});

test('publisher-confirmed chapter splits follow the existing concept, including the retained 원주각 label', () => {
  const cases = [
    ['M1-2', '평행선과 각', '위치 관계'],
    ['M1-2', '수직과 거리', '기본 도형'],
    ['M2-1', '일차함수의 뜻', '일차함수와 그 그래프(1)'],
    ['M2-1', '일차함수의 그래프', '일차함수와 그 그래프(1)'],
    ['M2-1', '그래프의 성질', '일차함수와 그 그래프(2)'],
    ['M2-1', '식 구하기', '일차함수와 그 그래프(2)'],
    ['M3-1', '제곱근', '제곱근의 뜻과 성질'],
    ['M3-1', '무리수와 실수', '무리수와 실수'],
    ['M3-1', '수직선과 제곱근', '무리수와 실수'],
    ['M3-1', '근의 공식', '이차방정식의 활용'],
    ['M3-2', '원주각과 중심각', '원주각'],
    ['M3-2', '원주각의 활용', '원주각의 활용'],
  ];
  for (const [scope, concept, L2] of cases) {
    const mapping = mappingFor(scope, concept);
    assert.ok(mapping, concept);
    const resolved = Toc.refinePath(mapping.basePath);
    assert.equal(resolved.effectivePath.L2, L2, concept);
    const conceptOnly = Toc.refinePath({ ...Toc.normalizePath(mapping.basePath), L4: '' });
    assert.equal(conceptOnly.status, 'EXACT');
    assert.equal(conceptOnly.granularity, 'CONCEPT');
    assert.equal(conceptOnly.effectivePath.L2, L2);
    assert.equal(conceptOnly.basePath.L4, '');
    const effectiveConcept = Toc.refinePath({ ...resolved.effectivePath, L4: '' });
    assert.equal(effectiveConcept.status, 'EXACT');
    assert.equal(effectiveConcept.effectivePath.L2, L2);
  }
});

test('the four M1 basic/location leaves follow chapter content while retaining their original leaf IDs', () => {
  const expected = {
    'M1-RPM-177': ['기본 도형', '위치 관계', '평행선과 각', '동위각·엇각'],
    'M1-RPM-178': ['기본 도형', '위치 관계', '평행선과 각', '평행선 조건'],
    'M1-RPM-183': ['위치 관계', '기본 도형', '수직과 거리', '수선과 수선의 발'],
    'M1-RPM-184': ['위치 관계', '기본 도형', '수직과 거리', '점과 직선 사이의 거리'],
  };
  for (const [id, [baseL2, effectiveL2, L3, L4]] of Object.entries(expected)) {
    const row = authority.leafMappings.find(mapping => mapping.crosswalkRecordIds.includes(id));
    assert.ok(row, id);
    assert.deepEqual(row.basePath, ['2022', 'M1-2', '기본 도형', baseL2, L3, L4]);
    const base = Toc.refinePath(row.basePath);
    assert.equal(base.effectivePath.L2, effectiveL2, id);
    const expectedCrosswalkIds = id === 'M1-RPM-177'
      ? [id, 'M1-RPM-177-TRANSFER-BENT-20261113', 'M1-RPM-177-TRANSFER-DIRECT-20261113']
      : [id];
    assert.deepEqual(base.crosswalkRecordIds, expectedCrosswalkIds);
    assert.deepEqual(Toc.refinePath(base.effectivePath).basePath, Toc.normalizePath(row.basePath));
    const record = { originalCurriculum: '2022', sourceGrade: '중1',
      metadataAssignmentEvidence: { rpmMetadata: { rpmCurriculum: '2022', rpmL1: '기본 도형', rpmL2: baseL2, rpmL3: L3, rpmL4: L4 } } };
    assert.equal(Toc.resolveRecord(record, '중1').parent.L2, effectiveL2, id);
  }
});

test('publisher-confirmed cross-L1 placements require exact leaf evidence and do not move sibling leaves', () => {
  for (const [id, unchangedId, L3] of [
    ['M3-RPM-104', 'M3-RPM-103', '분모의 유리화'],
    ['M3-RPM-105', 'M3-RPM-106', '혼합 계산'],
  ]) {
    const mapping = authority.leafMappings.find(row => row.crosswalkRecordIds.includes(id));
    const exact = Toc.refinePath(mapping.basePath);
    assert.equal(exact.effectivePath.L1, '다항식의 곱셈과 인수분해');
    assert.equal(exact.effectivePath.L2, '다항식의 곱셈');
    assert.deepEqual(Toc.refinePath(exact.effectivePath).basePath, Toc.normalizePath(mapping.basePath));
    assert.equal(Toc.refinePath({ ...exact.effectivePath, L4: '' }).reason, 'EXCEPTION_L4_REQUIRED');
    const oldConcept = Toc.refinePath({ ...Toc.normalizePath(mapping.basePath), L4: '' });
    assert.equal(oldConcept.status, 'LEGACY_PARENT_AMBIGUOUS', L3);
    assert.equal(oldConcept.candidateParentKeys.length, 2);
    const sibling = authority.leafMappings.find(row => row.crosswalkRecordIds.includes(unchangedId));
    assert.equal(Toc.refinePath(sibling.basePath).effectivePath.L2, '근호를 포함한 식의 계산');
    const noEvidence = structuredClone(authority);
    delete noEvidence.leafMappings.find(row => row.crosswalkRecordIds.includes(id)).placementReviewId;
    assert.throws(() => Toc.createAuthority(noEvidence), /CROSS_UNIT_PLACEMENT_EVIDENCE_REQUIRED/);
    const wrongEvidence = structuredClone(authority);
    const review = wrongEvidence.splitEvidence.find(row => row.reviewId === mapping.placementReviewId);
    review.mappings.find(row => row.crosswalkRecordIds.includes(id)).existingL4 = 'different leaf';
    assert.throws(() => Toc.createAuthority(wrongEvidence), /CROSS_UNIT_PLACEMENT_EVIDENCE_REQUIRED/);
  }
});

test('parallel-line area follows chapter 04 while the ambiguous trapezoid midpoint leaf remains unchanged', () => {
  const area = authority.leafMappings.find(row => row.crosswalkRecordIds.includes('M2-RPM-194'));
  assert.equal(Toc.refinePath(area.basePath).effectivePath.L2, '여러 가지 사각형');
  assert.equal(Toc.refinePath({ ...Toc.normalizePath(area.basePath), L4: '' }).status, 'LEGACY_PARENT_AMBIGUOUS');
  const partition = authority.leafMappings.find(row => row.crosswalkRecordIds.includes('M2-RPM-195'));
  assert.deepEqual(Toc.refinePath(partition.basePath).effectivePath, Toc.normalizePath(partition.basePath));
  const midpoint = authority.leafMappings.find(row => row.crosswalkRecordIds.includes('M2-RPM-199'));
  const kept = Toc.refinePath(midpoint.basePath);
  assert.deepEqual(kept.effectivePath, kept.basePath);
  assert.equal(kept.effectivePath.L2, '여러 가지 사각형');
});

test('a broad legacy parent or subunit does not guess a child, even when an old label is retained', () => {
  const cases = [
    p('M1-2', '기본 도형', '기본 도형'),
    p('M1-2', '기본 도형', '위치 관계'),
    p('M2-1', '일차함수', '일차함수와 그 그래프'),
    p('M2-2', '사각형의 성질', '평행사변형'),
    p('M3-1', '실수와 그 연산', '제곱근과 그 실수'),
    p('M3-1', '실수와 그 연산', '근호를 포함한 식의 계산'),
    p('M3-1', '이차방정식', '이차방정식의 풀이'),
    p('M3-2', '원의 성질', '원주각'),
  ];
  for (const value of cases) {
    const found = Toc.refinePath(value);
    assert.equal(found.status, 'LEGACY_PARENT_AMBIGUOUS');
    assert.equal(found.parent, null);
    assert.equal(found.candidateParentKeys.length, 2);
  }
  const raw = { originalCurriculum: '2022', sourceGrade: '중1', subUnitKey: 'M1-05-BASIC_FIGURE',
    unverifiedTaxonomy: { courseKey: '중1 수학', L1: '기본도형', L2: '점·선·면과 각' } };
  assert.equal(Toc.resolveRecord(raw, '중1').status, 'LEGACY_PARENT_AMBIGUOUS');
  assert.equal(Toc.resolveRecord(raw, '중1').candidateParentKeys.length, 3);
  const position = Toc.resolveRecord({ originalCurriculum: '2022', subUnitKey: 'M1-05-POSITION_RELATION' }, '중1');
  assert.equal(position.status, 'LEGACY_PARENT_AMBIGUOUS');
  assert.equal(position.candidateParentKeys.length, 2);
  assert.equal(Toc.resolveRecord({ originalCurriculum: '2022', subUnitKey: 'M1-07-SOLID_FIGURE' }, '중1').parent.L2, '다면체와 회전체');
  assert.equal(Toc.resolveRecord({ subUnitKey: 'M1-05-POSITION_RELATION' }, '중1').status, 'NOT_FOUND');
});

test('content-bound nested RPM metadata resolves by exact path and inferred unique semester without mutating the record', () => {
  const source = Toc.normalizePath(mappingFor('M3-2', '원주각의 활용').basePath);
  const record = { sourceGrade: '중3', originalCurriculum: '2022', metadataAssignmentEvidence: { rpmMetadata: {
    rpmCurriculum: '2022', rpmL1: source.L1, rpmL2: source.L2, rpmL3: source.L3, rpmL4: source.L4,
  } } };
  const before = JSON.stringify(record);
  const found = Toc.resolveRecord(record, '중3');
  assert.equal(found.status, 'EXACT');
  assert.equal(found.basis, 'BOUND_RPM_METADATA_PATH');
  assert.equal(found.effectivePath.courseKey, 'M3-2');
  assert.equal(found.effectivePath.L2, '원주각의 활용');
  assert.equal(JSON.stringify(record), before);
  assert.equal(Toc.resolveRecord(record, '중2').parent, null);
  assert.equal(Toc.resolveRecord({ rpmPrimaryPath: JSON.stringify(mappingFor('M3-2', '원주각의 활용').basePath) }, '중3').status, 'EXACT');
});

test('2015, high-school and invalid concept/leaf combinations remain outside the refinement', () => {
  const leaf = Toc.normalizePath(mappingFor('M3-1', '무리수와 실수').basePath);
  assert.equal(Toc.refinePath({ ...leaf, curriculumKey: '2015' }).status, 'OUT_OF_SCOPE');
  assert.equal(Toc.refinePath({ ...leaf, courseKey: 'H1-1' }).status, 'OUT_OF_SCOPE');
  assert.equal(Toc.refinePath({ ...leaf, L2: '제곱근의 뜻과 성질' }).status, 'NOT_FOUND');
  assert.equal(Toc.refinePath({ ...leaf, L3: '' }).reason, 'RPM_L4_WITHOUT_L3');
  assert.equal(Toc.resolveRecord({ ...leaf, originalCurriculum: '2015' }, '중3').status, 'OUT_OF_SCOPE');
  assert.equal(Toc.resolveRecord(leaf, '고1').status, 'OUT_OF_SCOPE');
  assert.deepEqual(Toc.parents('고1'), []);
  assert.deepEqual(Toc.units('H1'), []);
});

test('invalid explicit RPM evidence cannot fall back to a conflicting legacy-only parent', () => {
  const exact = Toc.normalizePath(mappingFor('M3-1', '무리수와 실수').basePath);
  const record = { originalCurriculum: '2022', subUnitKey: 'M3-01-REAL_NUMBER_OPERATIONS',
    rpmPrimaryPath: { ...exact, L2: '제곱근의 뜻과 성질' },
    basicAssignment: p('M3-1', '실수와 그 연산', '근호를 포함한 식의 계산') };
  const found = Toc.resolveRecord(record, '중3');
  assert.equal(found.status, 'NOT_FOUND');
  assert.equal(found.parent, null);
  record.rpmPrimaryPath = p('M3-1', '실수와 그 연산', '제곱근과 그 실수');
  assert.equal(Toc.resolveRecord(record, '중3').status, 'LEGACY_PARENT_AMBIGUOUS');
});

test('source or base authority drift fails validation before rebuilding browser data', () => {
  const changedBase = structuredClone(authority);
  changedBase.baseAuthority.sha256 = '0'.repeat(64);
  assert.throws(() => validateParentAuthority(changedBase, root), /BASE_AUTHORITY_SHA/);
  const changedSource = structuredClone(authority);
  changedSource.sourceEvidence[0].normalizedHeadingTable[0].L2 = 'unreviewed substitute';
  assert.throws(() => validateParentAuthority(changedSource, root), /PUBLISHER_PARENT_MISMATCH/);
  const changedLegacy = structuredClone(authority);
  changedLegacy.legacySubUnitMappings.find(row => row.subUnitKey === 'M1-05-POSITION_RELATION').parentKeys.pop();
  assert.throws(() => validateParentAuthority(changedLegacy, root), /LEGACY_SUBUNIT_PARENT_DRIFT/);
  const changedIds = structuredClone(authority);
  changedIds.leafMappings[0].crosswalkRecordIds = ['different record'];
  assert.throws(() => validateParentAuthority(changedIds, root), /CROSSWALK_ID_DRIFT/);
});

test('the three split concepts require L4 under both stored and current parents', () => {
  const exceptions = [
    ['M2-RPM-194', '여러 가지 사각형'], ['M2-RPM-195', '평행사변형'],
    ['M3-RPM-103', '근호를 포함한 식의 계산'], ['M3-RPM-104', '다항식의 곱셈'],
    ['M3-RPM-105', '다항식의 곱셈'], ['M3-RPM-106', '근호를 포함한 식의 계산'],
  ];
  for (const [id, destination] of exceptions) {
    const mapping = authority.leafMappings.find(row => row.crosswalkRecordIds.includes(id));
    const leaf = Toc.refinePath(mapping.basePath);
    assert.equal(leaf.effectivePath.L2, destination, id);
    for (const input of [leaf.basePath, leaf.effectivePath]) {
      const withoutL4 = { ...input, L4: '' };
      const record = { questionUid: `fixture-${id}`, originalCurriculum: '2022', rpmPrimaryPath: withoutL4,
        standardUnitKey: 'stored-unit', subUnitKey: 'stored-subunit', approval: { status: 'KEEP' } };
      const before = JSON.stringify(record);
      const found = Toc.resolveRecord(record, mapping.basePath[1].slice(0, 2));
      assert.equal(found.status, 'LEGACY_PARENT_AMBIGUOUS', id);
      assert.equal(found.reason, 'EXCEPTION_L4_REQUIRED', id);
      assert.equal(found.parent, null);
      assert.equal(found.candidateParentKeys.length, 2);
      assert.equal(JSON.stringify(record), before);
    }
  }
});

test('explicit RPM evidence must agree while matching base/current paths and legacy storage remain compatible', () => {
  const area = authority.leafMappings.find(row => row.crosswalkRecordIds.includes('M2-RPM-194'));
  const partition = authority.leafMappings.find(row => row.crosswalkRecordIds.includes('M2-RPM-195'));
  const areaPath = Toc.normalizePath(area.basePath);
  const partitionPath = Toc.normalizePath(partition.basePath);
  for (const conflict of [
    { rpmSemantic: partitionPath },
    { metadataAssignmentEvidence: { rpmMetadata: Toc.toRpmPath(partitionPath) } },
    { rpmMetadata: { rpmCurriculum: '2022', rpmScope: 'M2-2', rpmL1: partitionPath.L1,
      rpmL2: partitionPath.L2, rpmL3: partitionPath.L3, rpmL4: partitionPath.L4 } },
  ]) {
    const record = { questionUid: 'unchanged', originalCurriculum: '2022', rpmPrimaryPath: areaPath, ...conflict };
    const before = JSON.stringify(record);
    const found = Toc.resolveRecord(record, '중2');
    assert.equal(found.status, 'AMBIGUOUS');
    assert.equal(found.reason, 'RPM_EVIDENCE_PATH_CONFLICT');
    assert.equal(found.parent, null);
    assert.equal(JSON.stringify(record), before);
  }
  const effective = Toc.refinePath(areaPath).effectivePath;
  const compatible = { originalCurriculum: '2022', rpmPrimaryPath: effective, rpmSemantic: areaPath,
    basicAssignment: p('M2-2', '사각형의 성질', '평행사변형'),
    standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES' };
  const before = JSON.stringify(compatible);
  const found = Toc.resolveRecord(compatible, '중2');
  assert.equal(found.status, 'EXACT');
  assert.equal(found.parent.L2, '여러 가지 사각형');
  assert.equal(JSON.stringify(compatible), before);
  assert.deepEqual(Toc.resolveRecord(compatible, '중2'), found);
  const incomplete = { ...compatible, rpmPrimaryPath: { ...areaPath, L4: '' } };
  assert.equal(Toc.resolveRecord(incomplete, '중2').granularity, 'LEAF');
});

test('incompatible strong leaf evidence cannot be bypassed by another exact path', () => {
  const path = Toc.normalizePath(mappingFor('M3-1', '무리수와 실수').basePath);
  const invalid = { ...path, L4: 'unregistered leaf' };
  for (const [primary, semantic] of [[path, invalid], [invalid, path]]) {
    const record = { originalCurriculum: '2022', rpmPrimaryPath: primary, rpmSemantic: semantic };
    assert.equal(Toc.resolveRecord(record, '중3').reason, 'RPM_EVIDENCE_PATH_CONFLICT');
  }
});

test('conflicting explicit curriculum or grade cannot be replaced by a legacy key fallback', () => {
  const path = Toc.normalizePath(mappingFor('M1-2', '다면체').basePath);
  for (const input of [{ ...path, curriculumKey: '2015' }, { ...path, courseKey: 'M2-2' }]) {
    const record = { originalCurriculum: '2022', sourceGrade: '중1', subUnitKey: 'M1-07-SOLID_FIGURE',
      rpmPrimaryPath: input };
    const before = JSON.stringify(record);
    const found = Toc.resolveRecord(record, '중1');
    assert.equal(found.status, 'AMBIGUOUS');
    assert.equal(found.reason, 'RPM_EVIDENCE_SCOPE_CONFLICT');
    assert.equal(found.parent, null);
    assert.equal(JSON.stringify(record), before);
  }
});

test('top-level RPM fields remain separate from unrelated stored L1-L4 labels', () => {
  const mapping = authority.leafMappings.find(row => row.crosswalkRecordIds.includes('M2-RPM-184'));
  const rpm = Toc.normalizePath(mapping.basePath);
  const record = { originalCurriculum: '2022', courseKey: rpm.courseKey, rpmPrimaryPath: rpm,
    L1: 'stored major unit', L2: 'stored subunit', L3: 'stored concept', L4: 'stored leaf',
    rpmCurriculum: '2022', rpmScope: rpm.courseKey, rpmL1: rpm.L1, rpmL2: rpm.L2, rpmL3: rpm.L3, rpmL4: rpm.L4 };
  const before = JSON.stringify(record);
  const found = Toc.resolveRecord(record, '중2');
  assert.equal(found.status, 'EXACT');
  assert.equal(found.parent.L2, '삼각형의 외심과 내심');
  assert.equal(JSON.stringify(record), before);
  delete record.rpmPrimaryPath;
  assert.equal(Toc.resolveRecord(record, '중2').parentKey, found.parentKey);
});

test('matching current parent-only evidence does not fill the missing L4 of an exceptional concept', () => {
  for (const id of ['M2-RPM-194', 'M3-RPM-104', 'M3-RPM-105']) {
    const mapping = authority.leafMappings.find(row => row.crosswalkRecordIds.includes(id));
    const current = Toc.refinePath(mapping.basePath).effectivePath;
    const record = { originalCurriculum: '2022', rpmPrimaryPath: { ...current, L4: '' },
      rpmSemantic: { ...current, L3: '', L4: '' } };
    const before = JSON.stringify(record);
    const found = Toc.resolveRecord(record, current.courseKey.slice(0, 2));
    assert.equal(found.status, 'LEGACY_PARENT_AMBIGUOUS', id);
    assert.equal(found.reason, 'EXCEPTION_L4_REQUIRED', id);
    assert.equal(found.parent, null);
    assert.equal(JSON.stringify(record), before);
  }
});

test('cross-unit parent evidence accepts additional IDs of the same exact base leaf, without permitting an unreviewed move', () => {
  for (const id of ['M3-RPM-104', 'M3-RPM-105']) {
    const extended = structuredClone(authority);
    const row = extended.leafMappings.find(mapping => mapping.crosswalkRecordIds.includes(id));
    row.crosswalkRecordIds.push(`${id}-ADDITIONAL-CONNECTION`);
    const toc = Toc.createAuthority(extended);
    const expected = Toc.refinePath(row.basePath);
    const actual = toc.refinePath(row.basePath);
    assert.equal(actual.parentKey, expected.parentKey);
    assert.deepEqual(actual.basePath, expected.basePath);
    assert.deepEqual(actual.effectivePath, expected.effectivePath);
    assert.ok(actual.crosswalkRecordIds.includes(`${id}-ADDITIONAL-CONNECTION`));
    row.crosswalkRecordIds = [`${id}-UNVERIFIED-REFERENCE`];
    assert.throws(() => Toc.createAuthority(extended), /CROSS_UNIT_PLACEMENT_EVIDENCE_REQUIRED/);
    row.crosswalkRecordIds = [id];
    row.effectiveParentKey = Toc.parents('중3').find(parent => parent.L2 === '다항식의 인수분해').key;
    assert.throws(() => Toc.createAuthority(extended), /CROSS_UNIT_PLACEMENT_EVIDENCE_REQUIRED/);
  }
});
