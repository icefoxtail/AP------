import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileRef, objectSha } from '../canonical.mjs';
import { RUN_VERSION_V2, runInputSha } from '../closure.mjs';
import { computeV2AxisInputShas } from '../v2-audit.mjs';
import { initWorkBatch, freezeWorkBatch, reserveWorkBatchReview, reconcileWorkBatchReview, readWorkBatch, workBatchMetrics } from '../work-batch.mjs';
import { loadCandidateReviewContext, buildU3CandidatePayload, buildAuditorPacket, validateAuditorPacket } from '../review-isolation-runner.mjs';
import { prepareProviderReview, dispatchProviderReview } from '../provider-bridge.mjs';

// Local synthetic data only. No provider or production archive is used.
function jobFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-budget-u3-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (relative, value) => {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
    return fileRef(root, relative);
  };
  const bank = q => `window.examTitle="synthetic";window.questionBank=${JSON.stringify([q])};`;
  const source = { id: 1, content: 'Find the angle sum.', choices: ['110', '120'], answer: '2', solution: '[키포인트] 55+65=120.' };
  const candidate = { ...source, choices: ['104', '114'], solution: '[키포인트] 62+52=114.' };
  const uid = 'synthetic|1';
  const sourceRef = { ...write('source.js', bank(source)), role: 'source' };
  initWorkBatch(root, { workBatchId: 'job', runIds: ['run'], builderId: 'builder', builderSessionId: 'builder-session' });
  const makeRun = revision => {
    const run = {
      schemaVersion: RUN_VERSION_V2, pipeline: 'tag-enrichment', workBatchId: 'job', runId: 'run', revision,
      builderId: 'builder', builderSessionId: 'builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY',
      questions: [{ questionUid: uid, sourceExamId: 'synthetic', examId: 'synthetic', qid: 1, sourcePath: 'source.js', candidatePath: `candidate-${revision}.js`, problemAssetPaths: [], solutionAssetPaths: [], evidence: {}, visual: { requirement: 'VISUAL_EXEMPT' } }],
      inputs: [sourceRef, { ...write(`candidate-${revision}.js`, bank({ ...candidate, content: `${candidate.content} Revision ${revision}.` })), role: 'candidate' }], evidence: [],
    };
    run.inputSha = runInputSha(run);
    const shas = computeV2AxisInputShas(root, run)[uid];
    for (const axis of ['STATIC', 'METADATA']) {
      const machineProvenance = { runId: run.runId, revision, inputSha: run.inputSha, collector: 'SYNTHETIC_TEST_ONLY' };
      const e = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: `${revision}:${axis}`, runId: run.runId, revision, questionUid: uid, axis, axisInputSha: shas[axis], inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', status: 'PASS', machineProvenance, reviewIsolationProvenanceSha: objectSha(machineProvenance), payload: axis === 'STATIC' ? { checkedInputSha: run.inputSha, checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS' } } : { metadataInputSha: shas[axis], checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } } };
      run.evidence.push(write(`machine-${revision}-${axis}.json`, e));
    }
    const ref = write(`run-${revision}.json`, run);
    return { run, ref };
  };
  const request = (purpose, maxTokens, overrides = {}) => ({ purpose, ...(maxTokens === undefined ? {} : { maxTokens }), callerRole: 'MAIN_WORKER', auditorId: 'auditor', auditorSessionId: 'auditor-session', recursiveSubagentLaunchCount: 0, parentLaunchId: null, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, contexts: Object.fromEntries(['U1', 'U2', 'U3'].map(phase => [phase, { sessionId: `${purpose}-${phase}`, contextId: `${purpose}-ctx-${phase}` }])), ...overrides });
  let receiptIndex = 0;
  const complete = (launchId, externalId, usedTokens, status = 'COMPLETED') => {
    const providerReceiptRef = write(`terminal-${++receiptIndex}.json`, { launchId, externalId, status, independentAgentLaunchCount: 1, expensiveAgentLaunchCount: 1, concurrentExpensiveAgentPeak: 1, recursiveSubagentLaunchCount: 0, usedTokens, evidenceRefs: [], defects: [] });
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
  return { root, write, uid, makeRun, request, complete, prepareRecheck, stateFile: path.join(root, 'alive/runtime/work-batches/job/state.json') };
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

test('TARGETED_RECHECK remains limited to one launch', t => {
  const f = jobFixture(t);
  f.prepareRecheck();
  reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK'));
  reconcileWorkBatchReview(f.root, 'job', { launchId: 'job:2', externalId: 'provider-targeted', status: 'DISPATCHED' });
  f.complete('job:2', 'provider-targeted', null);
  assert.throws(() => reserveWorkBatchReview(f.root, 'job', f.request('TARGETED_RECHECK')), /AGENT_BUDGET_EXHAUSTED/);
  assert.equal(readWorkBatch(f.root, 'job').launches.length, 2);
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
  const u2 = buildAuditorPacket({ ...common, phase: 'U2', payload: { questionUid: f.uid, artifact, renderWitnesses: [] }, auditorSessionId: plan.contexts.U2.sessionId, contextId: plan.contexts.U2.contextId, inputVisibilityProfile: 'ARTIFACT_ONLY', priorReviewVisibility: 'NONE' });
  const u3 = buildAuditorPacket({ ...common, phase: 'U3', payload: buildU3CandidatePayload(candidateContext, f.uid, { frozenU1: { result: 'PASS' }, frozenU2: { result: 'PASS' } }), candidateContext, auditorSessionId: plan.contexts.U3.sessionId, contextId: plan.contexts.U3.contextId, inputVisibilityProfile: 'FROZEN_V1_V2', priorReviewVisibility: 'FROZEN_U1_U2' });
  const packetRefs = [
    { phase: 'U1', ref: f.write('packets/u1.json', u1) },
    { phase: 'U2', ref: f.write('packets/u2.json', u2) },
    { phase: 'U3', ref: f.write('packets/u3.json', u3) },
  ];
  const result = dispatchProviderReview(f.root, { workBatchId: 'job', launchId: 'job:1', planPath, packetRefs, transport, receiptPath: 'alive/runtime/provider-bridge/job/terminal.json' });
  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.usedTokens, 21);
  assert.equal(result.phaseAttestationRefs.length, 3);
  const state = readWorkBatch(f.root, 'job');
  assert.equal(state.launches[0].status, 'COMPLETED');
  assert.equal(state.launches[0].externalId, 'provider-logical-1');
  assert.deepEqual(state.launches[0].providerAttestationPlanRef, prepared.planRef);
});
