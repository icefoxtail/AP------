import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  validateStageEvidence,
  validateTargetedR2Evidence,
} from '../archive/tools/archive-stage-validator.mjs';
import { validateCommonEvidence } from '../archive/tools/archive-stage-validator-common-v2.mjs';
import { validateR1Evidence } from '../archive/tools/archive-stage-validator-r1-v2.mjs';
import { validateCreateEvidence } from '../archive/tools/archive-stage-validator-create-v2.mjs';

const fixturePath = path.resolve('archive/fixtures/stage-validator-pilot/o34-r2-targeted.json');
const o34 = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

const targetedPass = validateTargetedR2Evidence({
  evidence: o34,
  actualArtifactGitBlob: o34.inputArtifactSha,
});
console.log('O34_GENERIC_TARGETED_PASS=' + JSON.stringify(targetedPass));
assert.equal(targetedPass.ok, true, JSON.stringify(targetedPass));
assert.equal(targetedPass.scopeCount, 0);
assert.equal(targetedPass.disposition, 'PASS');

const targetedMismatch = validateTargetedR2Evidence({
  evidence: o34,
  actualArtifactGitBlob: '0000000000000000000000000000000000000000',
});
assert.equal(targetedMismatch.ok, false);
assert.ok(targetedMismatch.issues.includes('EVIDENCE_EXAM_GIT_BLOB_MISMATCH'));

const nonEmpty = structuredClone(o34);
nonEmpty.targetedScope.r1ChangedQids = [7];
nonEmpty.targetedScope.recheckQids = [7];
nonEmpty.targetedScope.scopeCount = 1;
const nonEmptyReport = validateTargetedR2Evidence({
  evidence: nonEmpty,
  actualArtifactGitBlob: nonEmpty.inputArtifactSha,
});
assert.equal(nonEmptyReport.ok, false);
assert.ok(nonEmptyReport.issues.includes('R2_TARGETED_NONEMPTY_SCOPE_NOT_YET_SUPPORTED'));

const controlExam = path.resolve('archive/exams/original/middle/m2/1mid/25_매산중_1학기_중간_중2_기출.js');
const controlEvidence = path.resolve('archive/data/r2e-intake/m2/25_매산중_1학기_중간_중2_기출.review2.physical-evidence.json');
const control = validateStageEvidence({
  examFile: controlExam,
  evidenceFile: controlEvidence,
  stage: 'R2',
});
console.log('M2_O4_GENERIC_FULL_CONTROL=' + JSON.stringify(control));
assert.equal(control.validatorMode, 'FULL');
assert.equal(control.ok, true, JSON.stringify(control));

console.log('ARCHIVE_STAGE_VALIDATOR_PILOT_PASS');


const commonEnvelope = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'R1',
  examUid: 'fixture-r1',
  artifactSha: 'artifact-sha-1',
  rows: [{ qid: 1 }, { qid: 2 }],
};

const commonPass = validateCommonEvidence({
  stage: 'R1',
  examUid: 'fixture-r1',
  artifactSha: 'artifact-sha-1',
  actualArtifactSha: 'artifact-sha-1',
  evidenceRef: 'fixture://r1',
  evidence: commonEnvelope,
  expectedQids: [1, 2],
});
assert.equal(commonPass.commonValid, true, JSON.stringify(commonPass));
assert.equal('disposition' in commonPass, false);
assert.equal('ok' in commonPass, false);

const wrongArtifact = validateCommonEvidence({
  stage: 'R1',
  examUid: 'fixture-r1',
  artifactSha: 'artifact-sha-1',
  actualArtifactSha: 'artifact-sha-2',
  evidenceRef: 'fixture://r1',
  evidence: commonEnvelope,
  expectedQids: [1, 2],
});
assert.equal(wrongArtifact.commonValid, false);
assert.ok(wrongArtifact.issues.includes('COMMON_ACTUAL_ARTIFACT_SHA_MISMATCH'));

const duplicateRows = validateCommonEvidence({
  stage: 'R1',
  examUid: 'fixture-r1',
  artifactSha: 'artifact-sha-1',
  actualArtifactSha: 'artifact-sha-1',
  evidenceRef: 'fixture://r1',
  evidence: {
    ...commonEnvelope,
    rows: [{ qid: 1 }, { qid: 1 }],
  },
  expectedQids: [1, 2],
});
assert.equal(duplicateRows.commonValid, false);
assert.ok(duplicateRows.issues.includes('COMMON_ROW_QID_DUPLICATE:q1'));
assert.ok(duplicateRows.issues.includes('COMMON_QID_MISSING:q2'));

console.log('ARCHIVE_STAGE_VALIDATOR_COMMON_V2_PASS');


const r1Base = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'R1',
  examUid: 'fixture-r1',
  artifactSha: 'artifact-r1',
  rows: [
    {
      qid: 1,
      independentAnswer: '3',
      independentAnswerFrozenBeforeStoredAnswer: true,
      storedAnswer: '3',
      compareResult: 'MATCH',
      verdict: 'PASS',
    },
    {
      qid: 2,
      independentAnswer: '②, ⑤',
      independentAnswerFrozenBeforeStoredAnswer: true,
      storedAnswer: '②, ⑤',
      compareResult: 'MATCH',
      verdict: 'PASS',
    },
  ],
};

function runR1(evidence, expectedQids = [1, 2]) {
  return validateR1Evidence({
    examUid: 'fixture-r1',
    artifactSha: 'artifact-r1',
    actualArtifactSha: 'artifact-r1',
    evidenceRef: 'fixture://r1-v2',
    evidence,
    expectedQids,
  });
}

const r1Pass = runR1(r1Base);
assert.equal(r1Pass.ok, true, JSON.stringify(r1Pass));
assert.equal(r1Pass.disposition, 'PASS');
assert.equal(r1Pass.denominator, 2);
assert.equal(r1Pass.rowCount, 2);

const r1MissingQid = runR1({
  ...r1Base,
  rows: [r1Base.rows[0]],
});
assert.equal(r1MissingQid.ok, false);
assert.ok(r1MissingQid.issues.includes('COMMON_QID_MISSING:q2'));

const r1MissingIndependent = structuredClone(r1Base);
delete r1MissingIndependent.rows[1].independentAnswer;
const r1MissingIndependentReport = runR1(r1MissingIndependent);
assert.equal(r1MissingIndependentReport.ok, false);
assert.ok(r1MissingIndependentReport.issues.includes('R1_INDEPENDENT_ANSWER_REQUIRED:q2'));

const r1MissingFreeze = structuredClone(r1Base);
delete r1MissingFreeze.rows[1].independentAnswerFrozenBeforeStoredAnswer;
const r1MissingFreezeReport = runR1(r1MissingFreeze);
assert.equal(r1MissingFreezeReport.ok, false);
assert.ok(r1MissingFreezeReport.issues.includes('R1_FREEZE_BEFORE_STORED_REQUIRED:q2'));

const r1MismatchWithoutDisposition = structuredClone(r1Base);
r1MismatchWithoutDisposition.rows[1].independentAnswer = '④';
r1MismatchWithoutDisposition.rows[1].storedAnswer = '⑤';
r1MismatchWithoutDisposition.rows[1].compareResult = 'MISMATCH';
r1MismatchWithoutDisposition.rows[1].verdict = 'REPAIR_REQUIRED';
const r1MismatchWithoutDispositionReport = runR1(r1MismatchWithoutDisposition);
assert.equal(r1MismatchWithoutDispositionReport.ok, false);
assert.ok(r1MismatchWithoutDispositionReport.issues.includes('R1_DISPOSITION_REQUIRED:q2'));

console.log('ARCHIVE_STAGE_VALIDATOR_R1_V2_PASS');


const createBase = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'CREATE',
  examUid: 'fixture-create',
  artifactSha: 'artifact-create',
  rows: [{
    qid: 1,
    sourceMode: 'ORIGINAL',
    axisEvidence: {
      questionLayout: 'bound',
      solutionLayout: 'bound',
      meta: 'bound',
      visualSvg: 'bound',
    },
    provenanceEvidence: { sourceParity: 'bound' },
  }],
};

function runCreate(evidence) {
  return validateCreateEvidence({
    examUid: 'fixture-create',
    artifactSha: 'artifact-create',
    actualArtifactSha: 'artifact-create',
    evidenceRef: 'fixture://create-v2',
    evidence,
    expectedQids: [1],
  });
}

assert.equal(runCreate(createBase).ok, true);

const createMissingAxis = structuredClone(createBase);
delete createMissingAxis.rows[0].axisEvidence.visualSvg;
assert.equal(runCreate(createMissingAxis).ok, false);

const createUnnamedAxes = structuredClone(createBase);
createUnnamedAxes.rows[0].axisEvidence = { a: 'bound', b: 'bound', c: 'bound', d: 'bound' };
assert.equal(runCreate(createUnnamedAxes).ok, false);

const createAuditedMissing = structuredClone(createBase);
createAuditedMissing.rows[0].sourceMode = 'AUDITED_REPAIR';
createAuditedMissing.rows[0].provenanceEvidence = { repairedTruth: 'bound' };
assert.equal(runCreate(createAuditedMissing).ok, false);

const createAliveMissing = structuredClone(createBase);
createAliveMissing.rows[0].sourceMode = 'ALIVE_REPLACEMENT';
createAliveMissing.rows[0].provenanceEvidence = { curriculum: 'bound' };
assert.equal(runCreate(createAliveMissing).ok, false);

const createAliveNoParity = structuredClone(createBase);
createAliveNoParity.rows[0].sourceMode = 'ALIVE_REPLACEMENT';
createAliveNoParity.rows[0].provenanceEvidence = {
  curriculum: 'bound',
  answerCardinality: 'bound',
};
assert.equal(runCreate(createAliveNoParity).ok, true);

console.log('ARCHIVE_STAGE_VALIDATOR_CREATE_V2_PASS');
