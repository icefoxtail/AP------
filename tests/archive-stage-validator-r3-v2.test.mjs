import assert from 'node:assert/strict';
import { validateR3Evidence } from '../archive/tools/archive-stage-validator-r3-v2.mjs';

function run(evidence) {
  return validateR3Evidence({
    examUid: 'fixture-r3',
    artifactSha: 'artifact-r3',
    actualArtifactSha: 'artifact-r3',
    evidenceRef: 'fixture://r3-v2',
    evidence,
  });
}

const emptyScope = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'R3',
  examUid: 'fixture-r3',
  artifactSha: 'artifact-r3',
  targetedScope: {
    openFindingQids: [],
    changedQids: [],
    directDependencyQids: [],
  },
  rows: [],
  lockedScopeIntegrity: true,
  releaseIntegrity: true,
};
assert.equal(run(emptyScope).ok, true);

const missingChangedEvidence = structuredClone(emptyScope);
missingChangedEvidence.targetedScope.changedQids = [7];
assert.equal(run(missingChangedEvidence).ok, false);

const lockedScopeViolation = structuredClone(emptyScope);
lockedScopeViolation.lockedScopeIntegrity = false;
assert.equal(run(lockedScopeViolation).ok, false);

const targetedOnly = structuredClone(emptyScope);
targetedOnly.targetedScope.changedQids = [7];
targetedOnly.rows = [{ qid: 7, verdict: 'OK' }];
const targetedOnlyReport = run(targetedOnly);
assert.equal(targetedOnlyReport.ok, true, JSON.stringify(targetedOnlyReport));
assert.equal(targetedOnlyReport.scopeCount, 1);
assert.equal(targetedOnlyReport.rowCount, 1);

console.log('ARCHIVE_STAGE_VALIDATOR_R3_V2_OK');


import path from 'node:path';
import { validateStageEvidence } from '../archive/tools/archive-stage-validator.mjs';

const o26Report = validateStageEvidence({
  examFile: path.resolve('archive/exams/original/middle/m2/1final/24_연향중_1학기_기말_중2_기출.js'),
  evidenceFile: path.resolve('archive/data/r3-intake/m2/24_연향중_1학기_기말_중2_기출.r3-current.evidence-v2.json'),
  stage: 'R3',
});
console.log('M2_O26_R3_CANONICAL_REPORT=' + JSON.stringify(o26Report));
assert.equal(o26Report.ok, true, JSON.stringify(o26Report));
assert.equal(o26Report.validatorMode, 'R3_V2');
assert.equal(o26Report.disposition, 'PASS');
assert.equal(o26Report.scopeCount, 1);
assert.equal(o26Report.rowCount, 1);
assert.deepEqual(o26Report.issues, []);
