import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileRef, objectSha } from '../canonical.mjs';
import { RUN_VERSION_V2, runInputSha } from '../closure.mjs';
import { computeV2AxisInputShas } from '../v2-audit.mjs';
import { aggregateWorkBatchAudit, assertFreshLaunchIdentity, freezeInputSha, initWorkBatch, materializeWorkBatchRepair, freezeWorkBatch, reserveWorkBatchReview, reconcileWorkBatchReview, recordWorkBatchRepair, readWorkBatch, workBatchMetrics } from '../work-batch.mjs';
import { loadCandidateReviewContext, buildU3CandidatePayload, buildAuditorPacket, validateAuditorPacket } from '../review-isolation-runner.mjs';
import { prepareProviderReview, dispatchProviderReview, validateProviderPacketPreflight } from '../provider-bridge.mjs';
import { buildRepairPlan, defectFingerprint, nextWorkBatchAction, routeDefect } from '../defect-router.mjs';

// Local synthetic data only. No provider or production archive is used.
function jobFixture(t, questionCount = 1, workflowProfile = 'PAST_EXAM') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-budget-u3-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (relative, value) => {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
    return fileRef(root, relative);
  };
  const bank = q => `window.examTitle="synthetic";window.questionBank=${JSON.stringify(Array.isArray(q) ? q : [q])};`;
  const source = { id: 1, content: 'Find the angle sum.', choices: ['110', '120'], answer: '2', solution: '[키포인트] 55+65=120.' };
  const candidate = { ...source, choices: ['104', '114'], solution: '[키포인트] 62+52=114.' };
  const sourceRows = Array.from({ length: questionCount }, (_, index) => ({ ...source, id: index + 1, content: index ? `Find the angle sum for question ${index + 1}.` : source.content }));
  const candidateRows = sourceRows.map(row => ({ ...candidate, id: row.id, content: row.content }));
  const uid = 'synthetic|1';
  const uids = sourceRows.map(row => `synthetic|${row.id}`);
  const candidateContent = new Map();
  const sourceRef = { ...write('source.js', bank(sourceRows)), role: 'source' };
  initWorkBatch(root, { workBatchId: 'job', runIds: ['run'], builderId: 'builder', builderSessionId: 'builder-session', workflowProfile });
  const makeRun = (revision, changedQuestionUids = null, { sharedMaterial = null, pipeline = 'tag-enrichment', withRenderCapture = false } = {}) => {
    const changed = changedQuestionUids ? new Set(changedQuestionUids) : null;
    const nextCandidateRows = candidateRows.map(row => {
      const questionUid = `synthetic|${row.id}`;
      const content = changed && !changed.has(questionUid)
        ? candidateContent.get(questionUid) || `${row.content} Revision 1.`
        : `${row.content} Revision ${revision}.`;
      candidateContent.set(questionUid, content);
      return { ...row, content };
    });
    const run = {
      schemaVersion: RUN_VERSION_V2, pipeline, workBatchId: 'job', runId: 'run', revision,
      builderId: 'builder', builderSessionId: 'builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY',
      questions: sourceRows.map(row => ({ questionUid: `synthetic|${row.id}`, sourceExamId: 'synthetic', examId: 'synthetic', qid: row.id, sourcePath: 'source.js', candidatePath: `candidate-${revision}.js`, problemAssetPaths: [], solutionAssetPaths: [], evidence: {}, visual: { requirement: 'VISUAL_EXEMPT' } })),
      inputs: [sourceRef, { ...write(`candidate-${revision}.js`, bank(nextCandidateRows)), role: 'candidate' }], evidence: [], ...(sharedMaterial ? { sharedMaterial } : {}),
    };
    run.inputSha = runInputSha(run);
    const shas = computeV2AxisInputShas(root, run);
    const candidateInput = run.inputs.find(ref => ref.role === 'candidate');
    for (const questionUid of uids) for (const axis of ['STATIC', 'METADATA']) {
      const artifactFields = pipeline === 'past-exam' ? { currentArtifactSha: candidateInput.sha256, CURRENT_ARTIFACT_SHA: candidateInput.sha256, EVIDENCE_INPUT_SHA: candidateInput.sha256 } : {};
      const machineProvenance = { runId: run.runId, revision, inputSha: run.inputSha, collector: 'SYNTHETIC_TEST_ONLY', ...artifactFields };
      const e = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: `${revision}:${questionUid}:${axis}`, runId: run.runId, revision, questionUid, axis, axisInputSha: shas[questionUid][axis], inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', status: 'PASS', machineProvenance, reviewIsolationProvenanceSha: objectSha(machineProvenance), payload: axis === 'STATIC' ? { checkedInputSha: run.inputSha, ...artifactFields, checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS', studentSerialization: 'PASS' } } : { metadataInputSha: shas[questionUid][axis], ...artifactFields, checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } } };
      run.evidence.push(write(`machine-${revision}-${questionUid.replace('|', '-')}-${axis}.json`, e));
    }
    if (withRenderCapture) {
      const capture = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: `${revision}:RENDER_CAPTURE`, runId: run.runId, revision, questionUid: null, axis: 'RENDER_CAPTURE', inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', status: 'PASS', machineProvenance: { runId: run.runId, revision, inputSha: run.inputSha, collector: 'SYNTHETIC_TEST_ONLY', currentArtifactSha: candidateInput.sha256, CURRENT_ARTIFACT_SHA: candidateInput.sha256, EVIDENCE_INPUT_SHA: candidateInput.sha256 }, payload: { actualBrowser: true, productionEngine: true, itemWitnesses: [{ questionUid: uids[0], mode: 'exam', viewportProfile: 'desktop' }] } };
      run.evidence.push(write(`render-${revision}.json`, capture));
    }
    const ref = write(`run-${revision}.json`, run);
    return { run, ref };
  };
  let requestIndex = 0;
  const request = (purpose, maxTokens, overrides = {}) => { const tag = `${purpose}-${++requestIndex}`; return { purpose, ...(maxTokens === undefined ? {} : { maxTokens }), callerRole: 'MAIN_WORKER', auditorId: `${tag}-auditor`, auditorSessionId: `${tag}-auditor-session`, recursiveSubagentLaunchCount: 0, parentLaunchId: null, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, contexts: Object.fromEntries(['U1', 'U2', 'U3'].map(phase => [phase, { sessionId: `${tag}-${phase}`, contextId: `${tag}-ctx-${phase}` }])), ...overrides }; };
  const repair = (iteration, revision, inputSha, dispositions, overrides = {}) => ({ iteration, revision, inputSha, dispositions, builderId: 'builder', builderSessionId: 'builder-session', ...overrides });
  let receiptIndex = 0;
  const complete = (launchId, externalId, usedTokens, status = 'COMPLETED', defects = []) => {
    const providerReceiptRef = write(`terminal-${++receiptIndex}.json`, { launchId, externalId, status, independentAgentLaunchCount: 1, expensiveAgentLaunchCount: 1, concurrentExpensiveAgentPeak: 1, recursiveSubagentLaunchCount: 0, usedTokens, evidenceRefs: [], defects });
    return reconcileWorkBatchReview(root, 'job', { launchId, externalId, status, providerReceiptRef });
  };
  const prepareRecheck = ({ finalMaxTokens = Number.MAX_SAFE_INTEGER, finalUsedTokens = 6200 } = {}) => {
    const first = makeRun(1);
    freezeWorkBatch(root, 'job', [first.ref]);
    reserveWorkBatchReview(root, 'job', request('FINAL_AUDIT', finalMaxTokens));
    reconcileWorkBatchReview(root, 'job', { launchId: 'job:1', externalId: 'synthetic-provider', status: 'DISPATCHED' });
    complete('job:1', 'synthetic-provider', finalUsedTokens);
    const second = makeRun(2);
    freezeWorkBatch(root, 'job', [second.ref]);
    return second.run;
  };
  return { root, write, uid, uids, makeRun, request, repair, complete, prepareRecheck, stateFile: path.join(root, 'alive/runtime/work-batches/job/state.json') };
}

test('a very large token estimate never blocks FINAL_AUDIT', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  const state = reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT', Number.MAX_SAFE_INTEGER));
  assert.equal(state.status, 'FROZEN');
  assert.equal(state.launches.length, 1);
  assert.equal(Object.hasOwn(state.launches[0], 'maxTokens'), false);
  assert.equal(Object.hasOwn(state, 'tokenBudget'), false);
});

test('legacy persisted state without iterative fields remains readable', t => {
  const f = jobFixture(t, 1, 'LEGACY');
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  f.complete('job:1', 'provider-final', null);
  const legacy = readWorkBatch(f.root, 'job');
  delete legacy.workflowProfile;
  delete legacy.openDefectSet;
  delete legacy.openDefects;
  delete legacy.repairIterations;
  delete legacy.policy.maxRepairIterations;
  fs.writeFileSync(f.stateFile, JSON.stringify(legacy));
  assert.doesNotThrow(() => readWorkBatch(f.root, 'job'));
  assert.equal(readWorkBatch(f.root, 'job').policy.targetedRechecks, 1);
});

test('completed predecessor materializes repair scope without changing its frozen evidence', t => {
  const f = jobFixture(t, 2, 'LEGACY');
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const defects = [{ runId: 'run', questionUid: f.uids[0], type: 'SOURCE_CONFLICT' }];
  f.complete('job:1', 'provider-final', null, 'COMPLETED', defects);
  const legacyState = readWorkBatch(f.root, 'job');
  legacyState.status = 'FROZEN';
  delete legacyState.workflowProfile;
  delete legacyState.openDefectSet;
  delete legacyState.openDefects;
  delete legacyState.repairIterations;
  delete legacyState.policy.maxRepairIterations;
  fs.writeFileSync(f.stateFile, JSON.stringify(legacyState));
  const predecessorBytes = fs.readFileSync(f.stateFile, 'utf8');
  const predecessor = readWorkBatch(f.root, 'job');
  const continuation = materializeWorkBatchRepair(f.root, { workBatchId: 'repair', predecessorWorkBatchId: 'job', workflowProfile: 'PAST_EXAM' });
  assert.equal(continuation.status, 'REPAIR_REQUIRED');
  assert.equal(continuation.workflowProfile, 'PAST_EXAM');
  assert.deepEqual(continuation.openDefectSet, [{ runId: 'run', questionUid: f.uids[0] }]);
  assert.equal(continuation.openDefects[0].type, 'SOURCE_CONFLICT');
  assert.equal(continuation.predecessorWorkBatchId, 'job');
  assert.equal(continuation.predecessorFreezeSha, predecessor.freezes[0].freezeSha);
  assert.equal(continuation.predecessorLaunchId, 'job:1');
  assert.equal(continuation.freezes[0].freezeSha, predecessor.freezes[0].freezeSha);
  assert.equal(continuation.launches[0].launchId, 'job:1');
  assert.equal(fs.readFileSync(f.stateFile, 'utf8'), predecessorBytes);
});

test('a Past Exam repair freeze treats an empty predecessor render witness set as new render impact', t => {
  const f = jobFixture(t, 1, 'PAST_EXAM');
  const first = f.makeRun(1, null, { pipeline: 'past-exam' });
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  f.complete('job:1', 'provider-final', null);
  const second = f.makeRun(2, f.uids, { pipeline: 'past-exam', withRenderCapture: true });
  assert.doesNotThrow(() => freezeWorkBatch(f.root, 'job', [second.ref]));
  assert.deepEqual(readWorkBatch(f.root, 'job').freezes[1].affected, [{ runId: 'run', questionUid: f.uid }]);
});

test('TARGETED_RECHECK is not blocked by cumulative token estimates', t => {
  const f = jobFixture(t);
  f.prepareRecheck();
  const state = reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK', Number.MAX_SAFE_INTEGER));
  assert.equal(state.status, 'FROZEN');
  assert.equal(state.launches.length, 2);
  assert.equal(state.launches[1].purpose, 'TARGETED_RECHECK');
  assert.equal(Object.hasOwn(state.launches[1], 'maxTokens'), false);
});

test('null provider usage completes without a token HOLD', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-null', status: 'DISPATCHED' });
  const state = f.complete('job:1', 'provider-null', null);
  assert.equal(state.status, 'FROZEN');
  assert.equal(state.launches[0].usedTokens, null);
  assert.equal(workBatchMetrics(f.root, first.run).usedTokens, null);
  assert.equal(workBatchMetrics(f.root, first.run).tokenTelemetryAvailable, false);
  const unavailable = jobFixture(t);
  const unavailableRun = unavailable.makeRun(1);
  freezeWorkBatch(unavailable.root, 'job', [unavailableRun.ref]);
  reserveWorkBatchReview(unavailable.root, 'job', unavailable.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(unavailable.root, 'job', { launchId: 'job:1', externalId: 'provider-not-available', status: 'DISPATCHED' });
  const unavailableState = unavailable.complete('job:1', 'provider-not-available', 'NOT_AVAILABLE');
  assert.equal(unavailableState.status, 'FROZEN');
  assert.equal(unavailableState.launches[0].usedTokens, null);
});

test('numeric provider usage is preserved as telemetry', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-actual', status: 'DISPATCHED' });
  const state = f.complete('job:1', 'provider-actual', 987654);
  assert.equal(state.launches[0].usedTokens, 987654);
  assert.equal(workBatchMetrics(f.root, first.run).usedTokens, 987654);
  assert.equal(workBatchMetrics(f.root, first.run).tokenTelemetryAvailable, true);
});

test('FINAL_AUDIT remains limited to one launch', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  f.complete('job:1', 'provider-final', null);
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT')), /FINAL_AUDITOR_ALREADY_USED/);
  assert.equal(readWorkBatch(f.root, 'job').launches.length, 1);
});

test('a pre-dispatch packet failure can be terminally reconciled without resetting the budget', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  const evidenceRef = f.write('pre-dispatch-failure.json', { status: 'HOLD', code: 'PROVIDER_SOURCE_ASSET_NOT_BOUND' });
  const receiptRef = f.write('pre-dispatch-terminal.json', { launchId: 'job:1', externalId: 'provider-control', status: 'FAILED', preDispatchFailure: true, independentAgentLaunchCount: 0, expensiveAgentLaunchCount: 0, concurrentExpensiveAgentPeak: 0, recursiveSubagentLaunchCount: 0, usedTokens: null, evidenceRefs: [evidenceRef], defects: [] });
  const state = reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-control', status: 'FAILED', preDispatchFailure: true, providerReceiptRef: receiptRef });
  assert.equal(state.status, 'HOLD');
  assert.equal(state.launches[0].status, 'FAILED');
  assert.equal(state.launches[0].externalId, 'provider-control');
});

test('bounded TARGETED_RECHECK iterations continue until the open defect set closes', t => {
  const f = jobFixture(t, 2);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const firstDefects = f.uids.map(questionUid => ({ runId: 'run', questionUid }));
  const afterFinal = f.complete('job:1', 'provider-final', null, 'COMPLETED', firstDefects);
  assert.equal(afterFinal.status, 'REPAIR_REQUIRED');
  const second = f.makeRun(2);
  assert.equal(readWorkBatch(f.root, 'job').status, 'REPAIR_REQUIRED');
  recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, second.run.inputSha, firstDefects.map(defect => ({ ...defect, disposition: 'REPAIRED_CANDIDATE' }))));
  freezeWorkBatch(f.root, 'job', [second.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-targeted', status: 'DISPATCHED' });
  const remaining = firstDefects.slice(0, 1);
  f.complete('job:2', 'provider-targeted', null, 'COMPLETED', remaining);
  const third = f.makeRun(3);
  recordWorkBatchRepair(f.root, 'job', f.repair(2, 3, third.run.inputSha, remaining.map(defect => ({ ...defect, disposition: 'REPAIRED_CANDIDATE' }))));
  freezeWorkBatch(f.root, 'job', [third.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:3', externalId: 'provider-targeted-2', status: 'DISPATCHED' });
  const closed = f.complete('job:3', 'provider-targeted-2', null, 'COMPLETED', []);
  assert.equal(closed.status, 'FROZEN');
  assert.deepEqual(closed.openDefectSet, []);
  assert.equal(closed.launches.length, 3);
  assert.equal(closed.repairIterations.length, 2);
});

test('same input and same defect set enters stagnation HOLD', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  const auditInputSha = first.run.inputSha;
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const defects = [{ runId: 'run', questionUid: f.uid }];
  const afterFinal = f.complete('job:1', 'provider-final', null, 'COMPLETED', defects);
  assert.equal(afterFinal.status, 'REPAIR_REQUIRED');
  const held = recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, auditInputSha, [{ ...defects[0], disposition: 'NO_CHANGE_WITH_EVIDENCE' }]));
  assert.equal(held.status, 'HOLD');
  assert.equal(held.lastHold.code, 'HOLD:REPAIR_STAGNATION');
  assert.equal(held.repairIterations[0].noChangeEvidence, true);
});

test('changed input with the same UID and changed semantic defect is not stagnation', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const firstDefect = { runId: 'run', questionUid: f.uid, phase: 'U1', type: 'SOURCE_TEXT_AMBIGUITY', reason: 'wording' };
  f.complete('job:1', 'provider-final', null, 'COMPLETED', [firstDefect]);
  const second = f.makeRun(2);
  recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, second.run.inputSha, [{ ...firstDefect, disposition: 'SOURCE_DEFECT_CONFIRMED' }]));
  freezeWorkBatch(f.root, 'job', [second.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-targeted', status: 'DISPATCHED' });
  const changed = { ...firstDefect, phase: 'U3', type: 'LOGICAL_AND_GEOMETRIC_ERROR', reason: 'candidate interpretation' };
  const state = f.complete('job:2', 'provider-targeted', null, 'COMPLETED', [changed]);
  assert.equal(state.status, 'REPAIR_REQUIRED');
  assert.notEqual(state.lastHold?.code, 'HOLD:REPAIR_STAGNATION');
  assert.equal(state.repairIterations[0].repairRoute, 'DERIVED_SOURCE_RECOVERY');
  assert.notEqual(defectFingerprint(firstDefect), defectFingerprint(changed));
});

test('SOURCE_DEFECT_CONFIRMED routes to derived recovery instead of a user HOLD', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const defect = { runId: 'run', questionUid: f.uid, type: 'SOURCE_PAYLOAD_DEFECT', reason: 'source is underdetermined' };
  f.complete('job:1', 'provider-final', null, 'COMPLETED', [defect]);
  const second = f.makeRun(2);
  const state = recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, second.run.inputSha, [{ ...defect, disposition: 'SOURCE_DEFECT_CONFIRMED' }]));
  assert.equal(state.status, 'REPAIR_REQUIRED');
  assert.equal(state.repairIterations[0].status, 'REPAIR_RECORDED');
  assert.equal(state.repairIterations[0].repairRoute, 'DERIVED_SOURCE_RECOVERY');
  assert.equal(state.repairIterations[0].repairPlan.status, 'AUTO_REPAIR_REQUIRED');
  assert.equal(state.repairIterations[0].repairPlan.defects[0].requiresDerivedReplacement, true);
});

test('defect router maps semantic, visual, authority, execution, and unavailable-source findings', () => {
  assert.equal(routeDefect({ type: 'UNFINALIZED_AUTHORITY' }).route, 'AUTHORITY_BINDING_REPAIR');
  assert.equal(routeDefect({ type: 'ANSWER_RUBRIC_AUTHORITY' }).route, 'AUTHORITY_BINDING_REPAIR');
  assert.equal(routeDefect({ type: 'VISUAL_DEPENDENCY_UNVERIFIED' }).route, 'VISUAL_EVIDENCE_REPAIR');
  assert.equal(routeDefect({ type: 'PROVIDER_INPUT_ENVELOPE_INVALID' }).route, 'EXECUTION_RECOVERY');
  assert.equal(routeDefect({ type: 'SOURCE_PAYLOAD_DEFECT' }).route, 'DERIVED_SOURCE_RECOVERY');
  assert.equal(routeDefect({ type: 'SOURCE_PAYLOAD_DEFECT' }, { sourceRecoveryCapability: 'UNAVAILABLE' }).route, 'HUMAN_DECISION_REQUIRED');
  assert.equal(buildRepairPlan([{ runId: 'run', questionUid: 'q', type: 'UNFINALIZED_AUTHORITY' }]).status, 'AUTO_REPAIR_REQUIRED');
});

test('work-batch next action exposes automatic repair and bounded terminal actions', () => {
  const plan = nextWorkBatchAction({ status: 'REPAIR_REQUIRED', openDefects: [{ runId: 'run', questionUid: 'q', type: 'VISUAL_DEPENDENCY_UNVERIFIED' }] });
  assert.equal(plan.action, 'AUTO_REPAIR');
  assert.equal(plan.plan.routes[0], 'VISUAL_EVIDENCE_REPAIR');
  assert.equal(nextWorkBatchAction({ status: 'HOLD', lastHold: { code: 'HOLD:GLOBAL_EXPENSIVE_SLOT_OCCUPIED' } }).action, 'WAIT_FOR_SLOT');
  assert.equal(nextWorkBatchAction({ status: 'HOLD', lastHold: { code: 'HOLD:REPAIR_ITERATION_LIMIT' } }).action, 'TERMINAL_REPAIR_HOLD');
});

test('repair iteration limit is bounded', t => {
  const f = jobFixture(t, 2);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const defects = f.uids.map(questionUid => ({ runId: 'run', questionUid }));
  const afterFinal = f.complete('job:1', 'provider-final', null, 'COMPLETED', defects);
  assert.equal(afterFinal.status, 'REPAIR_REQUIRED');
  let previous = first;
  for (let iteration = 1; iteration <= 3; iteration++) {
    const next = f.makeRun(iteration + 1);
    const openDefects = iteration === 1 ? defects : iteration === 2 ? [defects[0]] : [defects[1]];
    const nextDefects = iteration === 1 ? [defects[0]] : iteration === 2 ? [defects[1]] : [defects[0]];
    recordWorkBatchRepair(f.root, 'job', f.repair(iteration, iteration + 1, next.run.inputSha, openDefects.map(defect => ({ ...defect, disposition: 'REPAIRED_CANDIDATE' }))));
    freezeWorkBatch(f.root, 'job', [next.ref]);
    reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
    reconcileWorkBatchReview(f.root, 'job', { launchId: `job:${iteration + 1}`, externalId: `provider-targeted-${iteration}`, status: 'DISPATCHED' });
    previous = next;
    f.complete(`job:${iteration + 1}`, `provider-targeted-${iteration}`, null, 'COMPLETED', nextDefects);
  }
  const state = readWorkBatch(f.root, 'job');
  assert.equal(state.status, 'HOLD');
  assert.equal(state.lastHold.code, 'HOLD:REPAIR_ITERATION_LIMIT');
  assert.equal(state.repairIterations.length, 3);
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK')), /REPAIR_ITERATION_LIMIT/);
});

test('A/J: a 22-target Past Exam closes 7 defects, then 2 defects, with immutable lineage', t => {
  const f = jobFixture(t, 22);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  const firstFreeze = structuredClone(readWorkBatch(f.root, 'job').freezes[0]);
  const firstRunBytes = fs.readFileSync(path.join(f.root, 'run-1.json'), 'utf8');
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const firstDefects = f.uids.slice(0, 7).map(questionUid => ({ runId: 'run', questionUid, phase: 'U3', reason: 'FAIL' }));
  assert.equal(f.complete('job:1', 'provider-final', null, 'COMPLETED', firstDefects).status, 'REPAIR_REQUIRED');

  const second = f.makeRun(2, f.uids.slice(0, 7));
  recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, second.run.inputSha, firstDefects.map(defect => ({ ...defect, disposition: 'REPAIRED_CANDIDATE' }))));
  freezeWorkBatch(f.root, 'job', [second.ref]);
  const afterFirstRepair = readWorkBatch(f.root, 'job');
  assert.equal(afterFirstRepair.freezes[1].affected.length, 7);
  assert.equal(afterFirstRepair.repairIterations[0].status, 'FROZEN_FOR_RECHECK');
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  assert.equal(readWorkBatch(f.root, 'job').launches[1].scope.length, 7);
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-targeted-1', status: 'DISPATCHED' });
  const remaining = firstDefects.slice(0, 2).map(defect => ({ ...defect, reason: 'REMAINING_FAIL' }));
  assert.equal(f.complete('job:2', 'provider-targeted-1', null, 'COMPLETED', remaining).status, 'REPAIR_REQUIRED');

  const third = f.makeRun(3, f.uids.slice(0, 2));
  recordWorkBatchRepair(f.root, 'job', f.repair(2, 3, third.run.inputSha, remaining.map(defect => ({ ...defect, disposition: 'REPAIRED_CANDIDATE' }))));
  freezeWorkBatch(f.root, 'job', [third.ref]);
  const beforeSecondRecheck = readWorkBatch(f.root, 'job');
  assert.equal(beforeSecondRecheck.freezes[2].affected.length, 2);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:3', externalId: 'provider-targeted-2', status: 'DISPATCHED' });
  const closed = f.complete('job:3', 'provider-targeted-2', null, 'COMPLETED', []);
  assert.equal(closed.status, 'FROZEN');
  assert.deepEqual(closed.openDefectSet, []);
  assert.equal(closed.repairIterations.every(iteration => iteration.status === 'CLOSED'), true);
  assert.deepEqual(closed.freezes[0], firstFreeze);
  assert.equal(fs.readFileSync(path.join(f.root, 'run-1.json'), 'utf8'), firstRunBytes);
  assert.deepEqual(closed.launches.map(launch => launch.scope.length), [22, 7, 2]);
  assert.notEqual(closed.launches[0].inputSha, closed.launches[1].inputSha);
  assert.notEqual(closed.launches[1].inputSha, closed.launches[2].inputSha);
  assert.equal(closed.launches[1].inputSha, freezeInputSha(closed.freezes[1]));
  assert.equal(closed.launches[2].inputSha, freezeInputSha(closed.freezes[2]));
  assert.equal(closed.freezes[1].predecessorFreezeSha, closed.freezes[0].freezeSha);
  assert.equal(closed.freezes[2].predecessorFreezeSha, closed.freezes[1].freezeSha);
});

test('B: unchanged PASS targets stay outside the next expensive scope for validated reuse', t => {
  const f = jobFixture(t, 3);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const defect = { runId: 'run', questionUid: f.uids[0], axis: 'SOLUTION' };
  f.complete('job:1', 'provider-final', null, 'COMPLETED', [defect]);
  const second = f.makeRun(2, [f.uids[0]]);
  recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, second.run.inputSha, [{ ...defect, disposition: 'REPAIRED_CANDIDATE' }]));
  freezeWorkBatch(f.root, 'job', [second.ref]);
  const state = readWorkBatch(f.root, 'job');
  assert.deepEqual(state.freezes[1].affected, [{ runId: 'run', questionUid: f.uids[0] }]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  assert.deepEqual(readWorkBatch(f.root, 'job').launches[1].scope, [{ runId: 'run', questionUid: f.uids[0] }]);
  assert.equal(state.freezes[0].bindings[0].axisInputShas[f.uids[1]].STATIC, state.freezes[1].bindings[0].axisInputShas[f.uids[1]].STATIC);
});

test('C: a shared semantic dependency expands the recheck scope beyond the edited UID', t => {
  const f = jobFixture(t, 3);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const defect = { runId: 'run', questionUid: f.uids[0], reason: 'FAIL' };
  f.complete('job:1', 'provider-final', null, 'COMPLETED', [defect]);
  const second = f.makeRun(2, [f.uids[0]], { sharedMaterial: 'changed-shared-material' });
  recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, second.run.inputSha, [{ ...defect, disposition: 'REPAIRED_CANDIDATE' }]));
  freezeWorkBatch(f.root, 'job', [second.ref]);
  const affected = readWorkBatch(f.root, 'job').freezes[1].affected.map(row => row.questionUid);
  assert.deepEqual(affected, f.uids);
});

test('D: a recheck can add a newly discovered defect to OPEN_DEFECT_SET', t => {
  const f = jobFixture(t, 2);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const firstDefect = { runId: 'run', questionUid: f.uids[0], reason: 'FAIL' };
  f.complete('job:1', 'provider-final', null, 'COMPLETED', [firstDefect]);
  const second = f.makeRun(2, f.uids);
  recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, second.run.inputSha, [{ ...firstDefect, disposition: 'REPAIRED_CANDIDATE' }]));
  freezeWorkBatch(f.root, 'job', [second.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-targeted', status: 'DISPATCHED' });
  const newlyFound = { runId: 'run', questionUid: f.uids[1], reason: 'NEW_FAIL' };
  const state = f.complete('job:2', 'provider-targeted', null, 'COMPLETED', [firstDefect, newlyFound]);
  assert.deepEqual(state.openDefectSet.map(row => row.questionUid), f.uids);
  assert.ok(state.openDefects.some(defect => defect.questionUid === f.uids[1] && defect.reason === 'NEW_FAIL'));
  assert.equal(state.status, 'REPAIR_REQUIRED');
});

test('G: conflicting U1/U3 findings remain repair evidence and are not auto-confirmed as source defects', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  const conflict = { runId: 'run', questionUid: f.uid, conflict: true, phases: ['U1', 'U3'], reason: 'CONFLICT' };
  const state = f.complete('job:1', 'provider-final', null, 'COMPLETED', [conflict]);
  assert.equal(state.status, 'REPAIR_REQUIRED');
  assert.equal(state.openDefects[0].conflict, true);
  assert.notEqual(state.openDefects[0].disposition, 'SOURCE_DEFECT_CONFIRMED');
  const second = f.makeRun(2, [f.uid]);
  recordWorkBatchRepair(f.root, 'job', f.repair(1, 2, second.run.inputSha, [{ ...conflict, disposition: 'AUDITOR_FALSE_POSITIVE' }]));
  freezeWorkBatch(f.root, 'job', [second.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-targeted', status: 'DISPATCHED' });
  const closed = f.complete('job:2', 'provider-targeted', null, 'COMPLETED', []);
  assert.equal(closed.status, 'FROZEN');
  assert.equal(closed.repairIterations[0].dispositions[0].disposition, 'AUDITOR_FALSE_POSITIVE');
});

test('H: work-batch audit cannot authorize production while OPEN_DEFECT_SET is nonempty', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-final', status: 'DISPATCHED' });
  f.complete('job:1', 'provider-final', null, 'COMPLETED', [{ runId: 'run', questionUid: f.uid, reason: 'FAIL' }]);
  const state = readWorkBatch(f.root, 'job');
  const report = aggregateWorkBatchAudit(f.root, state, [first.run], [{ runId: 'run', status: 'PASS', freshness: [] }]);
  assert.equal(report.status, 'BLOCKED');
  assert.equal(report.productionAuthorized, false);
  assert.equal(report.openDefectCount, 1);
});

test('legacy workflow profile preserves its one-targeted-recheck budget', t => {
  const f = jobFixture(t, 1, 'LEGACY');
  f.prepareRecheck();
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-targeted', status: 'DISPATCHED' });
  f.complete('job:2', 'provider-targeted', null);
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK')), /REPAIR_ITERATION_LIMIT/);
});

test('concurrent, recursive, and retry launches remain hard-blocked', t => {
  const concurrent = jobFixture(t);
  const concurrentRun = concurrent.makeRun(1);
  freezeWorkBatch(concurrent.root, 'job', [concurrentRun.ref]);
  const other = initWorkBatch(concurrent.root, { workBatchId: 'other', runIds: ['other-run'], builderId: 'other-builder', builderSessionId: 'other-session' });
  const otherTargets = [{ runId: 'other-run', questionUid: 'other|1' }];
  const otherFreezeBody = { workBatchId: 'other', frozenAt: '2026-01-01T00:00:00Z', targets: otherTargets, affected: otherTargets, bindings: [], runRefs: [], machineCheckedUidCount: 0, predecessorFreezeSha: null };
  const otherFreeze = { ...otherFreezeBody, freezeSha: objectSha(otherFreezeBody) };
  const activeOther = { contexts: { U1: { sessionId: 'other-u1', contextId: 'other-c1' }, U2: { sessionId: 'other-u2', contextId: 'other-c2' }, U3: { sessionId: 'other-u3', contextId: 'other-c3' } }, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, launchId: 'other:1', purpose: 'FINAL_AUDIT', freezeSha: otherFreeze.freezeSha, scope: otherTargets, auditorId: 'other-auditor', auditorSessionId: 'other-audit', parentLaunchId: null, recursiveSubagentLaunchCount: 0, authorization: null, reservedAt: '2026-01-01T00:01:00Z', status: 'RESERVED', externalId: null };
  fs.writeFileSync(path.join(concurrent.root, 'alive/runtime/work-batches/other/state.json'), JSON.stringify({ ...other, status: 'FROZEN', freezes: [otherFreeze], launches: [activeOther] }));
  assert.throws(() => reserveWorkBatchReview(concurrent.root, 'job', concurrent.request('FINAL_AUDIT')), /GLOBAL_EXPENSIVE_SLOT_OCCUPIED/);
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT')), /RECONCILE_EXISTING_EXPENSIVE_TASK/);
  const g = jobFixture(t);
  const second = g.makeRun(1);
  freezeWorkBatch(g.root, 'job', [second.ref]);
  assert.throws(() => reserveWorkBatchReview(g.root, 'job', g.request('FINAL_AUDIT', undefined, { recursiveSubagentLaunchCount: 1 })), /RECURSIVE_SUBAGENT_FORBIDDEN/);
  const h = jobFixture(t);
  const third = h.makeRun(1);
  freezeWorkBatch(h.root, 'job', [third.ref]);
  reserveWorkBatchReview(h.root, 'job', h.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(h.root, 'job', { launchId: 'job:1', externalId: 'provider-failed', status: 'DISPATCHED' });
  h.complete('job:1', 'provider-failed', null, 'FAILED');
  const retryReceiptRef = h.write('retry-terminal.json', { launchId: 'job:1', externalId: 'provider-failed', status: 'COMPLETED', independentAgentLaunchCount: 1, expensiveAgentLaunchCount: 1, concurrentExpensiveAgentPeak: 1, recursiveSubagentLaunchCount: 0, usedTokens: null, evidenceRefs: [], defects: [] });
  assert.throws(() => reconcileWorkBatchReview(h.root, 'job', { launchId: 'job:1', externalId: 'provider-failed', status: 'COMPLETED', providerReceiptRef: retryReceiptRef }), /NO_REDISPATCH_OR_TIMEOUT_RETRY/);
  assert.throws(() => reserveWorkBatchReview(h.root, 'job', h.request('FINAL_AUDIT')), /WHOLE_JOB_FREEZE_REQUIRED/);
  assert.equal(readWorkBatch(h.root, 'job').launches.length, 1);
});

test('GLOBAL_EXPENSIVE_SLOT_OCCUPIED preserves FROZEN state and exact legacy transient HOLD recovery is bounded', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  const before = readWorkBatch(f.root, 'job');
  const other = initWorkBatch(f.root, { workBatchId: 'other-global-slot', runIds: ['other-run'], builderId: 'other-builder', builderSessionId: 'other-session' });
  const targets = [{ runId: 'other-run', questionUid: 'other|1' }];
  const freezeBody = { workBatchId: 'other-global-slot', frozenAt: '2026-01-01T00:00:00Z', targets, affected: targets, bindings: [], runRefs: [], machineCheckedUidCount: 0, predecessorFreezeSha: null };
  const freeze = { ...freezeBody, freezeSha: objectSha(freezeBody) };
  const active = { contexts: { U1: { sessionId: 'other-u1', contextId: 'other-c1' }, U2: { sessionId: 'other-u2', contextId: 'other-c2' }, U3: { sessionId: 'other-u3', contextId: 'other-c3' } }, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, launchId: 'other-global-slot:1', purpose: 'FINAL_AUDIT', freezeSha: freeze.freezeSha, scope: targets, auditorId: 'other-auditor', auditorSessionId: 'other-control', parentLaunchId: null, recursiveSubagentLaunchCount: 0, authorization: null, reservedAt: '2026-01-01T00:01:00Z', status: 'RESERVED', externalId: null };
  fs.writeFileSync(path.join(f.root, 'alive/runtime/work-batches/other-global-slot/state.json'), JSON.stringify({ ...other, status: 'FROZEN', freezes: [freeze], launches: [active] }));
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT')), /GLOBAL_EXPENSIVE_SLOT_OCCUPIED/);
  const preserved = readWorkBatch(f.root, 'job');
  assert.equal(preserved.status, 'FROZEN');
  assert.equal(preserved.freezes.at(-1).freezeSha, before.freezes.at(-1).freezeSha);
  assert.equal(preserved.launches.length, before.launches.length);
  const otherState = JSON.parse(fs.readFileSync(path.join(f.root, 'alive/runtime/work-batches/other-global-slot/state.json'), 'utf8'));
  otherState.launches[0] = { ...otherState.launches[0], status: 'COMPLETED', externalId: 'other-provider', endedAt: '2026-01-01T00:02:00Z', usedTokens: null };
  fs.writeFileSync(path.join(f.root, 'alive/runtime/work-batches/other-global-slot/state.json'), JSON.stringify(otherState));
  assert.equal(reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT')).status, 'FROZEN');

  const recover = jobFixture(t);
  recover.prepareRecheck();
  const held = readWorkBatch(recover.root, 'job');
  held.status = 'HOLD';
  held.lastHold = { at: new Date().toISOString(), code: 'HOLD:GLOBAL_EXPENSIVE_SLOT_OCCUPIED' };
  fs.writeFileSync(recover.stateFile, JSON.stringify(held));
  const recovered = reserveWorkBatchReview(recover.root, 'job', recover.request('TARGETED_RECHECK'));
  assert.equal(recovered.status, 'FROZEN');
  assert.equal(recovered.lastHold, undefined);
  assert.equal(recovered.launches.length, 2);

  const otherHold = jobFixture(t);
  const otherFirst = otherHold.makeRun(1);
  freezeWorkBatch(otherHold.root, 'job', [otherFirst.ref]);
  const nonRecoverable = readWorkBatch(otherHold.root, 'job');
  nonRecoverable.status = 'HOLD';
  nonRecoverable.lastHold = { at: new Date().toISOString(), code: 'HOLD:REPAIR_STAGNATION' };
  fs.writeFileSync(otherHold.stateFile, JSON.stringify(nonRecoverable));
  assert.throws(() => reserveWorkBatchReview(otherHold.root, 'job', otherHold.request('FINAL_AUDIT')), /REPAIR_STAGNATION/);
  assert.equal(readWorkBatch(otherHold.root, 'job').status, 'HOLD');
});

test('a historic token-only HOLD migrates without reintroducing a token gate', t => {
  for (const code of ['HOLD:TOKEN_BUDGET_EXCEEDED', 'HOLD:PROVIDER_TOKEN_USAGE_INVALID']) {
    const f = jobFixture(t);
    f.prepareRecheck();
    const state = readWorkBatch(f.root, 'job');
    state.tokenBudget = 1;
    state.launches[0].maxTokens = 1;
    state.status = 'HOLD';
    state.lastHold = { at: new Date().toISOString(), code };
    fs.writeFileSync(f.stateFile, JSON.stringify(state));
    const migrated = reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK', Number.MAX_SAFE_INTEGER));
    assert.equal(migrated.status, 'FROZEN');
    assert.equal(migrated.launches.length, 2);
    assert.equal(migrated.lastHold, undefined);
  }
});

test('a retired provider-token HOLD clears only after the same DISPATCHED provider completes', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-terminal', status: 'DISPATCHED' });
  const held = readWorkBatch(f.root, 'job');
  held.status = 'HOLD';
  held.lastHold = { at: new Date().toISOString(), code: 'HOLD:PROVIDER_TOKEN_USAGE_INVALID' };
  fs.writeFileSync(f.stateFile, JSON.stringify(held));
  const completed = f.complete('job:1', 'provider-terminal', null);
  assert.equal(completed.launches[0].status, 'COMPLETED');
  assert.equal(completed.launches[0].usedTokens, null);
  assert.equal(completed.status, 'FROZEN');
  assert.equal(Object.hasOwn(completed, 'lastHold'), false);
  assert.notEqual(workBatchMetrics(f.root, first.run).agentBudgetStatus, 'HOLD');
});

test('a successful terminal reconcile never clears a non-token HOLD', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  reserveWorkBatchReview(f.root, 'job', f.request('FINAL_AUDIT'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:1', externalId: 'provider-other-hold', status: 'DISPATCHED' });
  const held = readWorkBatch(f.root, 'job');
  held.status = 'HOLD';
  held.lastHold = { at: new Date().toISOString(), code: 'HOLD:SOURCE_AUTHORITY_TAMPERED' };
  fs.writeFileSync(f.stateFile, JSON.stringify(held));
  const completed = f.complete('job:1', 'provider-other-hold', null);
  assert.equal(completed.launches[0].status, 'COMPLETED');
  assert.equal(completed.status, 'HOLD');
  assert.equal(completed.lastHold.code, 'HOLD:SOURCE_AUTHORITY_TAMPERED');
  assert.equal(workBatchMetrics(f.root, first.run).agentBudgetStatus, 'HOLD');
});

test('U3 carries candidate choices and accepts bracket-prefixed solution text', t => {
  const f = jobFixture(t);
  const { run } = f.makeRun(1);
  const candidateContext = loadCandidateReviewContext(f.root, run);
  const payload = buildU3CandidatePayload(candidateContext, f.uid, { frozenU1: {}, frozenU2: {} });
  assert.deepEqual(payload.currentQuestion.choices, ['104', '114']);
  assert.equal(payload.currentAnswer, '2');
  assert.equal(payload.currentSolution, '[키포인트] 62+52=114.');
  const options = { phase: 'U3', questionUid: f.uid, payload, candidateContext, affectedUidSet: [f.uid], auditorId: 'auditor', auditorSessionId: 'u3-session', builderId: run.builderId, builderSessionId: run.builderSessionId, auditorPrincipalType: 'STATELESS_MODEL', contextId: 'u3-context', inputVisibilityProfile: 'FROZEN_V1_V2', priorReviewVisibility: 'FROZEN_U1_U2', sealed: true, launchId: 'job:1', externalTaskId: 'synthetic-provider' };
  const packet = buildAuditorPacket(options);
  assert.equal(validateAuditorPacket(packet, { affectedUidSet: [f.uid], candidateContext }).status, 'PASS');
  const { packetSha, ...body } = packet;
  for (const change of [
    p => { delete p.currentQuestion.choices; },
    p => { p.currentQuestion.choices = ['110', '120']; },
    p => { p.currentAnswer = '1'; },
    p => { p.currentQuestion.candidateRef.sha256 = objectSha('stale'); },
  ]) {
    const bad = structuredClone(body); change(bad.payload);
    const result = validateAuditorPacket({ ...bad, packetSha: objectSha(bad) }, { affectedUidSet: [f.uid], candidateContext });
    assert.equal(result.status, 'BLOCKED');
    assert.ok(result.errors.some(e => e.startsWith('U3_CURRENT_CANDIDATE_')));
  }
  const batch = buildAuditorPacket({ ...options, questionUids: [f.uid], payload: [payload] });
  assert.equal(validateAuditorPacket(batch, { affectedUidSet: [f.uid], candidateContext }).status, 'PASS');
});

test('U1 permits literal bracket-prefixed source content without opening a blind JSON leak', t => {
  const f = jobFixture(t);
  const { run } = f.makeRun(1);
  const packet = buildAuditorPacket({
    phase: 'U1',
    questionUid: f.uid,
    payload: { questionUid: f.uid, content: '[주관식] source-only prompt', choices: ['1', '2'], problemAssets: [] },
    affectedUidSet: [f.uid],
    auditorId: 'auditor',
    auditorSessionId: 'u1-session',
    builderId: run.builderId,
    builderSessionId: run.builderSessionId,
    auditorPrincipalType: 'STATELESS_MODEL',
    contextId: 'u1-context',
    inputVisibilityProfile: 'SOURCE_ONLY',
    priorReviewVisibility: 'NONE',
    sealed: true,
    launchId: 'job:1',
    externalTaskId: 'provider'
  });
  assert.equal(validateAuditorPacket(packet, { affectedUidSet: [f.uid] }).status, 'PASS');
});

test('FINAL_AUDIT and each targeted recheck require fresh cross-launch auditor identities', () => {
  const launch = purpose => ({
    auditorId: `${purpose}-auditor`,
    auditorSessionId: `${purpose}-control-session`,
    contexts: Object.fromEntries(['U1', 'U2', 'U3'].map(phase => [phase, { sessionId: `${purpose}-${phase}-session`, contextId: `${purpose}-${phase}-context` }]))
  });
  const launches = [launch('FINAL_AUDIT'), launch('TARGETED_RECHECK_1'), launch('TARGETED_RECHECK_2')];
  assert.doesNotThrow(() => assertFreshLaunchIdentity(launches.slice(0, 1), launches[1]));
  assert.doesNotThrow(() => assertFreshLaunchIdentity(launches.slice(0, 2), launches[2]));
  assert.throws(() => assertFreshLaunchIdentity(launches, structuredClone(launches[0])), /CROSS_LAUNCH_AUDITOR_CONTEXT_REUSE/);
  assert.throws(() => assertFreshLaunchIdentity(launches, { ...launch('new'), auditorSessionId: launches[1].contexts.U2.sessionId }), /CROSS_LAUNCH_AUDITOR_CONTEXT_REUSE/);
  assert.throws(() => assertFreshLaunchIdentity(launches, { ...launch('new'), contexts: { ...launch('new').contexts, U3: { sessionId: 'new-u3', contextId: launches[2].contexts.U1.contextId } } }), /CROSS_LAUNCH_AUDITOR_CONTEXT_REUSE/);
});

test('provider bridge binds a runtime-attested plan, phase packets, and one terminal receipt', t => {
  const f = jobFixture(t);
  const first = f.makeRun(1);
  freezeWorkBatch(f.root, 'job', [first.ref]);
  const runtime = path.join(f.root, 'attested-runtime.mjs');
  fs.writeFileSync(runtime, `
    import fs from 'node:fs';
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic-runtime', model: 'synthetic-model', externalTaskId: 'provider-logical-1', auditorId: 'provider-auditor', auditorSessionId: 'provider-control-session', contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic-runtime-attestation', contexts: { U1: { sessionId: 'provider-u1-session', contextId: 'provider-u1-context' }, U2: { sessionId: 'provider-u2-session', contextId: 'provider-u2-context' }, U3: { sessionId: 'provider-u3-session', contextId: 'provider-u3-context' } } }));
    } else {
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: request.externalTaskId, phase: request.phase, sessionId: request.packet.auditorSessionId, contextId: request.packet.contextId, providerInvocationId: 'provider-invocation-' + request.phase, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 7, evidence: [], defects: [] }));
    }
  `);
  const transport = { command: process.execPath, args: [runtime] };
  const planPath = 'alive/runtime/provider-bridge/job/preflight.json';
  const prepared = prepareProviderReview(f.root, { workBatchId: 'job', purpose: 'FINAL_AUDIT', transport, planPath });
  reserveWorkBatchReview(f.root, 'job', prepared.reservationRequest);
  const plan = JSON.parse(fs.readFileSync(path.join(f.root, planPath), 'utf8'));
  const candidateContext = loadCandidateReviewContext(f.root, first.run);
  const common = { questionUid: f.uid, affectedUidSet: [f.uid], auditorId: plan.auditorId, builderId: first.run.builderId, builderSessionId: first.run.builderSessionId, auditorPrincipalType: 'STATELESS_MODEL', sealed: true, launchId: 'job:1', externalTaskId: plan.externalId };
  const u1 = buildAuditorPacket({ ...common, phase: 'U1', payload: { questionUid: f.uid, content: 'Find the angle sum.', choices: ['110', '120'], problemAssets: [] }, auditorSessionId: plan.contexts.U1.sessionId, contextId: plan.contexts.U1.contextId, inputVisibilityProfile: 'SOURCE_ONLY', priorReviewVisibility: 'NONE' });
  const artifact = f.write('artifact.svg', '<svg/>');
  const u2Applicability = { status: 'VISUAL_EXEMPT', artifactRequired: false, renderWitnessRequired: false, authority: { requirement: 'VISUAL_EXEMPT', visualAssetStatus: null, action: null, adjudicationId: null, adjudicationStatus: null, problemDependency: false, sharedDependency: false, sourceNoVisualAssetRequired: false } };
  const u2 = buildAuditorPacket({ ...common, phase: 'U2', payload: { questionUid: f.uid, artifact, renderWitnesses: [], visualApplicability: u2Applicability }, auditorSessionId: plan.contexts.U2.sessionId, contextId: plan.contexts.U2.contextId, inputVisibilityProfile: 'ARTIFACT_ONLY', priorReviewVisibility: 'NONE' });
  const u3 = buildAuditorPacket({ ...common, phase: 'U3', payload: buildU3CandidatePayload(candidateContext, f.uid, { frozenU1: { result: 'PASS' }, frozenU2: { result: 'PASS' } }), candidateContext, auditorSessionId: plan.contexts.U3.sessionId, contextId: plan.contexts.U3.contextId, inputVisibilityProfile: 'FROZEN_V1_V2', priorReviewVisibility: 'FROZEN_U1_U2' });
  const packetRefs = [
    { phase: 'U1', ref: f.write('packets/u1.json', u1) },
    { phase: 'U2', ref: f.write('packets/u2.json', u2) },
    { phase: 'U3', ref: f.write('packets/u3.json', u3) },
  ];
  assert.equal(validateProviderPacketPreflight(f.root, { workBatchId: 'job', planPath, packetRefs }).status, 'PASS');
  const result = dispatchProviderReview(f.root, { workBatchId: 'job', launchId: 'job:1', planPath, packetRefs, transport, receiptPath: 'alive/runtime/provider-bridge/job/terminal.json' });
  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.usedTokens, 21);
  assert.equal(result.phaseAttestationRefs.length, 3);
  const state = readWorkBatch(f.root, 'job');
  assert.equal(state.launches[0].status, 'COMPLETED');
  assert.equal(state.launches[0].externalId, 'provider-logical-1');
  assert.deepEqual(state.launches[0].providerAttestationPlanRef, prepared.planRef);
});
