import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  validateStageEvidence,
  validateTargetedR2Evidence,
} from '../archive/tools/archive-stage-validator.mjs';

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

const targetedViaEntrypoint = validateStageEvidence({
  examFile: path.resolve('archive/exams/original/middle/m2/1final/22_연향중_1학기_기말_중2_기출.js'),
  evidenceFile: fixturePath,
  stage: 'R2',
});
assert.equal(targetedViaEntrypoint.validatorMode, 'TARGETED');
assert.equal(targetedViaEntrypoint.ok, true, JSON.stringify(targetedViaEntrypoint));

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
