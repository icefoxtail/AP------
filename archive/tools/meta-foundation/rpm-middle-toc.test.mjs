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
    ['M2-1', '일차함수의 뜻', '일차함수와 그 그래프(1)'],
    ['M2-1', '일차함수의 그래프', '일차함수와 그 그래프(1)'],
    ['M2-1', '그래프의 성질', '일차함수와 그 그래프(2)'],
    ['M2-1', '식 구하기', '일차함수와 그 그래프(2)'],
    ['M3-1', '제곱근', '제곱근의 뜻과 성질'],
    ['M3-1', '무리수와 실수', '무리수와 실수'],
    ['M3-1', '수직선과 제곱근', '무리수와 실수'],
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
  }
});

test('a broad legacy parent or subunit does not guess a child, even when an old label is retained', () => {
  const cases = [
    p('M2-1', '일차함수', '일차함수와 그 그래프'),
    p('M3-1', '실수와 그 연산', '제곱근과 그 실수'),
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
  assert.equal(Toc.resolveRecord({ originalCurriculum: '2022', subUnitKey: 'M1-05-POSITION_RELATION' }, '중1').parent.L2, '위치 관계');
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
});
