import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { freezeWorkBatch, readWorkBatch, reconcileWorkBatchReview, reserveWorkBatchReview } from '../work-batch.mjs';
import { nextWorkBatchAction } from '../defect-router.mjs';
import { classifyExecutionFailure } from '../execution-recovery.mjs';
import { recoveryFixture } from './recovery-fixture.mjs';
import { buildAuditorPacket, buildU3CandidatePayload, loadCandidateReviewContext, visualApplicabilityForQuestion } from '../review-isolation-runner.mjs';
import { prepareProviderReview, dispatchProviderReview } from '../provider-bridge.mjs';

test('pre-model FAILED launch keeps the freeze and permits one fresh successor without repair iteration consumption', t => {
  const f = recoveryFixture(t);
  const run = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [run.ref]);
  const freezeBefore = readWorkBatch(f.root, 'job').freezes[0];
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT', 'final'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-1', status: 'DISPATCHED' });
  const receiptRef = f.terminalReceipt('job:1', 'provider-1', 'FAILED', [], {
    preDispatchFailure: false,
    failureCode: 'PROVIDER_TRANSPORT_UNAVAILABLE',
    modelInvocationCount: 0,
    semanticEvidenceCount: 0,
    responseReturned: false,
    responseAttestationReturned: false,
    evidenceReturned: false,
  });
  const failed = reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-1', status: 'FAILED', providerReceiptRef: receiptRef });
  assert.equal(failed.status, 'HOLD');
  assert.equal(failed.lastHold.failureClass, 'PRE_MODEL_EXECUTION_FAILURE');
  assert.equal(failed.freezes[0].freezeSha, freezeBefore.freezeSha);
  assert.equal(failed.repairIterations.length, 0);
  assert.equal(nextWorkBatchAction(failed).action, 'EXECUTION_RECOVERY');

  const request = f.request('FINAL_AUDIT', 'successor-actual');
  request.executionRecoveryOfLaunchId = 'job:1';
  request.executionFailureClass = 'PRE_MODEL_EXECUTION_FAILURE';
  request.executionFailureFingerprint = failed.launches[0].executionFailureFingerprint;
  const successor = reserveWorkBatchReview(f.root, 'job', request);
  const launch = successor.launches.at(-1);
  assert.equal(launch.launchId, 'job:2');
  assert.equal(launch.executionRecovery, true);
  assert.equal(launch.executionAttempt, 1);
  assert.equal(launch.freezeSha, freezeBefore.freezeSha);
  assert.equal(successor.freezes.length, 1);
  assert.equal(successor.repairIterations.length, 0);
  assert.equal(successor.executionRecovery.attempts.length, 1);
  assert.equal(successor.status, 'FROZEN');
});

test('repeated execution failure fingerprint reaches human decision and cannot retry the same launch', t => {
  const f = recoveryFixture(t);
  const run = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [run.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT', 'final'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-1', status: 'DISPATCHED' });
  const common = { preDispatchFailure: false, failureCode: 'PROVIDER_TRANSPORT_UNAVAILABLE', modelInvocationCount: 0, semanticEvidenceCount: 0, responseReturned: false, responseAttestationReturned: false, evidenceReturned: false };
  const failedReceipt = f.terminalReceipt('job:1', 'provider-1', 'FAILED', [], common);
  let state = reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-1', status: 'FAILED', providerReceiptRef: failedReceipt });
  const first = nextWorkBatchAction(state);
  const firstRecovery = f.request('FINAL_AUDIT', 'successor');
  Object.assign(firstRecovery, { executionRecoveryOfLaunchId: first.failedLaunchId, executionFailureClass: first.failureClass, executionFailureFingerprint: state.launches[0].executionFailureFingerprint });
  reserveWorkBatchReview(f.root, 'job', firstRecovery);
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-2', status: 'DISPATCHED' });
  const secondReceipt = f.terminalReceipt('job:2', 'provider-2', 'FAILED', [], common);
  state = reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-2', status: 'FAILED', providerReceiptRef: secondReceipt });
  const action = nextWorkBatchAction(state);
  assert.equal(action.action, 'HUMAN_DECISION_REQUIRED');
  assert.equal(action.reason, 'HUMAN_DECISION_REQUIRED:IDENTICAL_EXECUTION_FAILURE');
  const retryRequest = { ...firstRecovery, auditorId: 'third-auditor', auditorSessionId: 'third-session', contexts: Object.fromEntries(['U1', 'U2', 'U3'].map(phase => [phase, { sessionId: `third-${phase}`, contextId: `third-${phase}` }])), executionRecoveryOfLaunchId: 'job:2', executionFailureFingerprint: state.launches[1].executionFailureFingerprint };
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', retryRequest), /EXECUTION_RECOVERY_IDENTICAL_FAILURE/);
});

test('failure classifier treats missing model invocation and semantic evidence as pre-model failure', () => {
  const result = classifyExecutionFailure({ receipt: { failureCode: 'PROVIDER_INPUT_ENVELOPE_INVALID', modelInvocationCount: 0, semanticEvidenceCount: 0 } });
  assert.equal(result.failureClass, 'PRE_MODEL_EXECUTION_FAILURE');
  const ambiguous = classifyExecutionFailure({ receipt: { failureCode: 'TIMEOUT', modelInvocationCount: null, semanticEvidenceCount: null } });
  assert.equal(ambiguous.failureClass, 'MODEL_STATE_AMBIGUOUS_FAILURE');
});

test('provider dispatch converts a pre-model transport failure into an execution recovery receipt', t => {
  const f = recoveryFixture(t);
  const run = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [run.ref]);
  const transport = f.write('transport-fails.mjs', `
    import fs from 'node:fs';
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic', model: 'synthetic', externalTaskId: 'provider-pre-model', auditorId: 'provider-auditor', auditorSessionId: 'provider-session', contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic', contexts: { U1: { sessionId: 'u1-session', contextId: 'u1-context' }, U2: { sessionId: 'u2-session', contextId: 'u2-context' }, U3: { sessionId: 'u3-session', contextId: 'u3-context' } } }));
    else process.exit(7);
  `);
  const prepared = prepareProviderReview(f.root, { workBatchId: 'job', purpose: 'FINAL_AUDIT', transport: { command: process.execPath, args: [path.join(f.root, transport.path)] }, planPath: 'alive/runtime/provider-bridge/job/plan.json' });
  reserveWorkBatchReview(f.root, 'job', prepared.reservationRequest);
  const plan = JSON.parse(fs.readFileSync(path.join(f.root, 'alive/runtime/provider-bridge/job/plan.json'), 'utf8'));
  const candidateContext = loadCandidateReviewContext(f.root, run.run);
  const common = { questionUid: 'recovery|1', affectedUidSet: ['recovery|1'], auditorId: plan.auditorId, auditorSessionId: plan.auditorSessionId, builderId: run.run.builderId, builderSessionId: run.run.builderSessionId, auditorPrincipalType: 'STATELESS_MODEL', sealed: true, launchId: 'job:1', externalTaskId: plan.externalId };
  const authority = visualApplicabilityForQuestion(run.run.questions[0]);
  const packets = [
    { phase: 'U1', packet: buildAuditorPacket({ ...common, phase: 'U1', payload: { questionUid: 'recovery|1', content: 'Find the value for question 1.', choices: ['1', '2'], problemAssets: [] }, auditorSessionId: plan.contexts.U1.sessionId, contextId: plan.contexts.U1.contextId, inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE' }) },
    { phase: 'U2', packet: buildAuditorPacket({ ...common, phase: 'U2', payload: { questionUid: 'recovery|1', artifact: null, renderWitnesses: [], visualApplicability: authority }, auditorSessionId: plan.contexts.U2.sessionId, contextId: plan.contexts.U2.contextId, inputVisibilityProfile: 'ARTIFACT_ONLY', priorReviewVisibility: 'NONE' }) },
    { phase: 'U3', packet: buildAuditorPacket({ ...common, phase: 'U3', payload: buildU3CandidatePayload(candidateContext, 'recovery|1', { frozenU1: {}, frozenU2: {}, renderWitnesses: [] }), candidateContext, auditorSessionId: plan.contexts.U3.sessionId, contextId: plan.contexts.U3.contextId, inputVisibilityProfile: 'FROZEN_V1_V2', priorReviewVisibility: 'FROZEN_U1_U2' }) },
  ].map(({ phase, packet }) => ({ phase, ref: f.write(`packets/${phase.toLowerCase()}.json`, packet) }));
  const result = dispatchProviderReview(f.root, { workBatchId: 'job', launchId: 'job:1', planPath: 'alive/runtime/provider-bridge/job/plan.json', packetRefs: packets, transport: { command: process.execPath, args: [path.join(f.root, transport.path)] }, receiptPath: 'alive/runtime/provider-bridge/job/failure/receipt.json' });
  assert.equal(result.status, 'FAILED');
  const state = readWorkBatch(f.root, 'job');
  assert.equal(state.status, 'HOLD');
  assert.equal(state.launches[0].status, 'FAILED');
  assert.equal(state.launches[0].executionFailureClass, 'PRE_MODEL_EXECUTION_FAILURE');
  assert.equal(nextWorkBatchAction(state).action, 'EXECUTION_RECOVERY');
});
