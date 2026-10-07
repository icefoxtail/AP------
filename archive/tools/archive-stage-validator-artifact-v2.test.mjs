import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { objectSha } from './pipeline-core/canonical.mjs';
import { validateArtifactContract, QUALITY_CONTRACT_V2 } from './archive-stage-validator-artifact-v2.mjs';
import {
  makeMetaValidatorReceipt,
  questionUidForSource,
  resolveMetaRoute,
  validateResolverEvidence,
} from './meta-foundation/rpm-active-resolver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const crosswalkPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json';
const crosswalk = JSON.parse(fs.readFileSync(path.join(root, crosswalkPath), 'utf8'));
const rpmRow = crosswalk.records.find(row => row.curriculum === '2015' && row.mappingStatus === 'RPM_ONLY');

function fixture(standardCourse = '기하') {
  const q = {
    id: 1, level: '중', category: '', originalCategory: '', questionType: '객관식', layoutTag: '', tags: [], wide: false,
    content: '점 P의 좌표를 구하여라.', choices: ['1', '2'], answer: '1', solution: '좌표를 대입한다.\\n정답은 1이다.',
    standardCourse, standardUnitKey: rpmRow.standardUnitKey, standardUnit: '이차곡선', standardUnitOrder: 0,
    subUnitKey: null, subUnit: '정의와 방정식', subUnitConfidence: 'high', subUnitClassificationDepth: 'L2',
    problemTypeKey: null, templateKey: null, crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  };
  const sourceArchiveFile = 'original/high/h2/1mid/fixture.js';
  const input = {
    sourceIdentity: {
      sourceArchiveFile,
      questionUid: questionUidForSource(sourceArchiveFile, 1),
      sourceIdentityKey: objectSha('source fixture') + '|1',
      sourceOrdinal: 1,
      contentHash: objectSha(q.content),
      choicesHash: objectSha(q.choices),
      imageRefHash: objectSha({ image: '', visualAsset: '', fullPageImagePath: '', fullPageImageRelPath: '', sourceEvidencePath: '', sourcePageEvidencePaths: [] }),
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash: objectSha(q.solution) },
    curriculumContext: { grade: 'H2', curriculum: '2015', scope: '기하', subjectFamily: 'GEOMETRY', standardCourse: q.standardCourse, standardUnitKey: q.standardUnitKey, subUnitKey: '' },
    semanticDecision: { primaryMethod: '정의에 따라 좌표를 대입한다.', decisiveStep: '정의 식에 좌표를 대입한다.', rpmPath: { curriculum: '2015', scope: '기하', ...rpmRow.rpmPath } },
  };
  const resolverEvidence = resolveMetaRoute(input, { repoRoot: root });
  const resolverValidation = validateResolverEvidence(input, resolverEvidence, { repoRoot: root });
  assert.equal(resolverValidation.status, 'PASS');
  assert.equal(resolverEvidence.semanticStatus, 'FINAL');
  assert.equal(resolverEvidence.projectionStatus, 'PROJECTION_UNMATERIALIZED');
  const disposition = {
    qid: 1,
    metaDebtFields: ['subUnitKey', 'problemTypeKey', 'templateKey'],
    metaDebtReason: 'H2 2015 Geometry RPM_ONLY has no current ACTIVE L2 compatibility projection.',
    rpmOnlyNullSubUnitProjection: {
      schemaVersion: 'JS_ARCHIVE_RPM_ONLY_NULL_SUBUNIT_PROJECTION_V1',
      input,
      resolverEvidence,
      validatorReceipt: makeMetaValidatorReceipt(resolverEvidence, resolverValidation),
    },
  };
  const evidence = {
    qualityContractVersion: QUALITY_CONTRACT_V2,
    artifactSha: objectSha('fixture artifact'),
    artifactDispositions: { artifactSha: objectSha('fixture artifact'), rows: [disposition] },
  };
  return { q, disposition, evidence };
}

function issuesFor({ q, disposition, evidence }) {
  return validateArtifactContract({ stage: 'R3', evidence, questions: [q], repoRoot: root }).issues;
}

test('accepts only resolver-proven H2 2015 Geometry RPM_ONLY null subUnitKey', () => {
  const f = fixture();
  assert.deepEqual(issuesFor(f), []);
});

test('accepts the canonical H2 2015 course label 기하와 벡터 for the same RPM proof', () => {
  const f = fixture('기하와 벡터');
  assert.deepEqual(issuesFor(f), []);
});

test('rejects arbitrary null subUnitKey without projection proof', () => {
  const f = fixture();
  delete f.disposition.rpmOnlyNullSubUnitProjection;
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_VALUE_REQUIRED:subUnitKey:q1'));
  assert.ok(issues.includes('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q1'));
});

test('rejects altered resolver evidence and retains canonical authority hash checks', () => {
  const f = fixture();
  f.disposition.rpmOnlyNullSubUnitProjection.resolverEvidence.authorityRefs[0].sha256 = 'sha256:' + '0'.repeat(64);
  f.disposition.rpmOnlyNullSubUnitProjection.resolverEvidence.evidenceSha = objectSha(f.disposition.rpmOnlyNullSubUnitProjection.resolverEvidence);
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q1'));
});

test('rejects projection proof reused for an unknown course or curriculum', () => {
  const f = fixture();
  f.disposition.rpmOnlyNullSubUnitProjection.input.curriculumContext.curriculum = '2099';
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q1'));
  assert.ok(issues.includes('ARTIFACT_META_VALUE_REQUIRED:subUnitKey:q1'));
});

test('rejects a projection proof relabeled to an unknown standardCourse', () => {
  const f = fixture();
  f.q.standardCourse = '미분과 적분';
  f.disposition.rpmOnlyNullSubUnitProjection.input.curriculumContext.standardCourse = '미분과 적분';
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q1'));
  assert.ok(issues.includes('ARTIFACT_META_VALUE_REQUIRED:subUnitKey:q1'));
});

test('does not treat missing subUnitKey as the supported nullable projection', () => {
  const f = fixture();
  delete f.q.subUnitKey;
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_FIELD_REQUIRED:subUnitKey:q1'));
});

function nonNullSubUnitFixture(standardUnitKey, subUnitKey, standardCourse = '기하와 벡터') {
  const f = fixture();
  f.q.standardCourse = standardCourse;
  f.q.standardUnitKey = standardUnitKey;
  f.q.subUnitKey = subUnitKey;
  f.q.subUnit = '기존 메타 라벨';
  f.disposition.metaDebtFields = ['problemTypeKey', 'templateKey'];
  delete f.disposition.rpmOnlyNullSubUnitProjection;
  return f;
}

test('rejects synthetic and other unregistered H15 geometry child keys on RPM_ONLY L1s', () => {
  for (const [unitKey, key] of [
    ['H15-GV-09', 'H15-GV-09-CORE'],
    ['H15-GV-09', 'H15-GV-09-INVENTED_CHILD'],
    ['H15-GV-07', 'H15-GV-07-CORE'],
  ]) {
    const f = nonNullSubUnitFixture(unitKey, key);
    assert.ok(issuesFor(f).includes('ARTIFACT_META_GEOMETRY_RPM_ONLY_NONCANONICAL_SUBUNIT_KEY:q1'), key);
  }
});

test('keeps an existing H15 legacy parent key and registered H22 geometry legacy child key valid', () => {
  const h15 = nonNullSubUnitFixture('H15-GV-09', 'H15-GV-09');
  assert.deepEqual(issuesFor(h15), []);
  const h22 = nonNullSubUnitFixture('H22-GE-01', 'H22-GE-01-CORE', '기하');
  const registered = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_metadata.json'), 'utf8')).records;
  assert.ok(registered.some(row => row.standardCourse === '기하' && row.standardUnitKey === 'H22-GE-01' && row.subUnitKey === 'H22-GE-01-CORE'));
  assert.deepEqual(issuesFor(h22), []);
});
