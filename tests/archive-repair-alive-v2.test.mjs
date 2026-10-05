import assert from 'node:assert/strict';
import {
  SOURCE_MODES,
  SOURCE_FIDELITY_REASON,
  buildMutationScope,
  buildQidProvenance,
  rebindPostMutationEvidence,
  buildSourceFidelityContinuation,
} from '../archive/tools/archive-repair-alive-v2.mjs';

const audited = buildQidProvenance({
  qid: 7,
  sourceMode: SOURCE_MODES.AUDITED_REPAIR,
  originalValue: 'old',
  repairedValue: 'new',
  repairReason: 'single-locus correction',
  affectedFields: ['answer'],
  verificationResult: 'PASS',
});
assert.equal(audited.sourceMode, 'AUDITED_REPAIR');
assert.equal(audited.repairedValue, 'new');

assert.throws(() => buildQidProvenance({
  qid: 8,
  sourceMode: SOURCE_MODES.ALIVE_REPLACEMENT,
  replacementReason: '',
  replacementStage: 'R1',
}), /ALIVE_REPLACEMENT_REASON_REQUIRED/);

const alive = buildQidProvenance({
  qid: 8,
  sourceMode: SOURCE_MODES.ALIVE_REPLACEMENT,
  replacementReason: 'source authority unavailable',
  replacementStage: 'R1',
});
assert.equal(alive.replacementStage, 'R1');

const scope = buildMutationScope({
  changedQids: [7, 7],
  directDependencyQids: [9, 7],
});
assert.deepEqual(scope, {
  changedQids: [7],
  directDependencyQids: [7, 9],
  scopeQids: [7, 9],
});

const evidence = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'R1',
  examUid: 'fixture-rebind',
  artifactSha: 'artifact-before',
  rows: [
    { qid: 1, evidenceRef: 'old://q1', artifactSha: 'artifact-before' },
    { qid: 7, evidenceRef: 'old://q7', artifactSha: 'artifact-before' },
    { qid: 9, evidenceRef: 'old://q9', artifactSha: 'artifact-before' },
  ],
};

const rebound = rebindPostMutationEvidence({
  evidence,
  finalArtifactSha: 'artifact-after',
  changedQids: [7],
  directDependencyQids: [9],
  reboundRows: [
    { qid: 7, evidenceRef: 'new://q7', artifactSha: 'artifact-after' },
    { qid: 9, evidenceRef: 'new://q9', artifactSha: 'artifact-after' },
  ],
});
assert.equal(rebound.artifactSha, 'artifact-after');
assert.equal(rebound.rows.find(row => row.qid === 1).evidenceRef, 'old://q1');
assert.equal(rebound.rows.find(row => row.qid === 7).evidenceRef, 'new://q7');
assert.deepEqual(rebound.postMutationRebind.scopeQids, [7, 9]);

assert.throws(() => rebindPostMutationEvidence({
  evidence,
  finalArtifactSha: 'artifact-after',
  changedQids: [7],
  directDependencyQids: [9],
  reboundRows: [
    { qid: 7, evidenceRef: 'old://q7', artifactSha: 'artifact-before' },
    { qid: 9, evidenceRef: 'new://q9', artifactSha: 'artifact-after' },
  ],
}), /REBIND_ROW_ARTIFACT_SHA_MISMATCH:q7/);

assert.equal(buildSourceFidelityContinuation({
  userOptIn: false,
  examUid: 'fixture-rebind',
  qid: 7,
  stage: 'R1',
  detail: 'exact source requested',
}), null);

const sourceFidelity = buildSourceFidelityContinuation({
  userOptIn: true,
  examUid: 'fixture-rebind',
  qid: 7,
  stage: 'R1',
  detail: 'exact school-original fidelity requested',
});
assert.equal(sourceFidelity.reason, SOURCE_FIDELITY_REASON);
assert.equal(sourceFidelity.stage, 'R1');

console.log('ARCHIVE_REPAIR_ALIVE_V2_PASS');
