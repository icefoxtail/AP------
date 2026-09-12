import test from 'node:test';
import assert from 'node:assert/strict';
import { freezeWorkBatch, readWorkBatch, reconcileWorkBatchReview, recordWorkBatchRepair, reserveWorkBatchReview } from '../work-batch.mjs';
import { nextWorkBatchAction } from '../defect-router.mjs';
import { recoveryFixture } from './recovery-fixture.mjs';

function complete(f, launchId, externalId, defects = []) {
  const receiptRef = f.terminalReceipt(launchId, externalId, 'COMPLETED', defects);
  return reconcileWorkBatchReview(f.root, 'job', { launchId, externalId, status: 'COMPLETED', providerReceiptRef: receiptRef });
}

test('unfinalized U2 authority is detected at freeze and cannot create a provider launch', t => {
  const f = recoveryFixture(t, { authorityFinalized: false });
  const run = f.makeRun(1);
  const state = freezeWorkBatch(f.root, 'job', [run.ref]);
  assert.equal(state.status, 'REPAIR_REQUIRED');
  assert.equal(state.launches.length, 0);
  assert.equal(state.openDefectSet.length, 1);
  assert.equal(nextWorkBatchAction(state).action, 'AUTO_REPAIR');
  assert.equal(nextWorkBatchAction(state).plan.routes[0], 'AUTHORITY_BINDING_REPAIR');
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT', 'blocked')), /WHOLE_JOB_FREEZE_REQUIRED/);
});

test('AUDITOR_FALSE_POSITIVE keeps the same freeze and allows a fresh targeted recheck', t => {
  const f = recoveryFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT', 'final'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const defect = { runId: 'run', questionUid: 'recovery|1', type: 'CANDIDATE_MATH_DEFECT', reason: 'false positive' };
  complete(f, 'job:1', 'provider-final', [defect]);
  let state = readWorkBatch(f.root, 'job');
  const recorded = recordWorkBatchRepair(f.root, 'job', { iteration: 1, revision: 1, inputSha: first.run.inputSha, dispositions: [{ ...defect, disposition: 'AUDITOR_FALSE_POSITIVE' }], builderId: 'builder', builderSessionId: 'builder-session' });
  assert.equal(recorded.status, 'REPAIR_REQUIRED');
  assert.equal(recorded.repairIterations[0].repairKind, 'REVIEW_ONLY_RESOLUTION');
  assert.equal(recorded.repairIterations[0].reviewOnly, true);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  state = readWorkBatch(f.root, 'job');
  assert.equal(state.status, 'FROZEN');
  assert.equal(state.freezes.length, 1);
  assert.equal(state.freezes[0].freezeSha, state.repairIterations[0].freezeSha);
  assert.equal(nextWorkBatchAction(state).action, 'TARGETED_RECHECK');
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK', 'recheck'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-recheck', status: 'DISPATCHED' });
  state = complete(f, 'job:2', 'provider-recheck');
  assert.equal(state.status, 'FROZEN');
  assert.equal(state.freezes.length, 1);
  assert.equal(state.repairIterations.length, 1);
  assert.equal(state.repairIterations[0].status, 'CLOSED');
  assert.equal(state.launches[1].freezeSha, state.launches[0].freezeSha);
});

test('NO_CHANGE_WITH_EVIDENCE only stagnates after the independent same-freeze recheck repeats the defect', t => {
  const f = recoveryFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT', 'final'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const defect = { runId: 'run', questionUid: 'recovery|1', type: 'SOURCE_PAYLOAD_DEFECT', reason: 'same source ambiguity' };
  complete(f, 'job:1', 'provider-final', [defect]);
  let state = recordWorkBatchRepair(f.root, 'job', { iteration: 1, revision: 1, inputSha: first.run.inputSha, dispositions: [{ ...defect, disposition: 'NO_CHANGE_WITH_EVIDENCE' }], builderId: 'builder', builderSessionId: 'builder-session' });
  assert.equal(state.status, 'REPAIR_REQUIRED');
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK', 'recheck'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-recheck', status: 'DISPATCHED' });
  state = complete(f, 'job:2', 'provider-recheck', [defect]);
  assert.equal(state.status, 'HOLD');
  assert.equal(state.lastHold.code, 'HOLD:REPAIR_STAGNATION');
  assert.equal(state.freezes.length, 1);
  assert.equal(state.repairIterations.length, 2);
});
