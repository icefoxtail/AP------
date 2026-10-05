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

import fs from 'node:fs';
import crypto from 'node:crypto';

function gitBlobShaForLiveFile(bytes) {
  const body = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  const header = Buffer.from(`blob ${body.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(Buffer.concat([header, body])).digest('hex');
}

const o25ExamPath = 'archive/exams/original/middle/m2/1final/24_왕운중_1학기_기말_중2_기출.js';
const o25EvidencePath = 'archive/data/r3-intake/m2/24_왕운중_1학기_기말_중2_기출.r3-current.evidence-v2.json';
const o25ExamBytes = fs.readFileSync(o25ExamPath);
const o25Evidence = JSON.parse(fs.readFileSync(o25EvidencePath, 'utf8'));
const o25Report = validateR3Evidence({
  examUid: o25Evidence.examUid,
  artifactSha: o25Evidence.artifactSha,
  actualArtifactSha: gitBlobShaForLiveFile(o25ExamBytes),
  evidenceRef: o25EvidencePath,
  evidence: o25Evidence,
});
assert.equal(o25Report.ok, true, JSON.stringify(o25Report));
assert.equal(o25Report.disposition, 'PASS');
console.log('M2_O25_R3_CANONICAL_REPORT=' + JSON.stringify(o25Report));

console.log('ARCHIVE_STAGE_VALIDATOR_R3_V2_OK');
