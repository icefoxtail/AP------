import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { resumePastExam } from '../../past-exam-pipeline/resume-past-exam.mjs';
import { fileRef, objectSha } from '../canonical.mjs';
import { runInputSha } from '../closure.mjs';
import { recoveryFixture } from './recovery-fixture.mjs';
import { makeReviewReadyFromCompletedState, prepareCanonicalRun } from '../../past-exam-pipeline/tests/release-authority-fixture.mjs';

function attachClosure(f, generated, relative) {
  prepareCanonicalRun({ root: f.root, write: f.write }, generated.run);
  const candidateRef = generated.run.inputs.find(ref => ref.role === 'candidate');
  const uid = generated.run.questions[0].questionUid;
  const requiredCases = ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'];
  const payload = { schemaVersion: 'APMATH_EXAM_RELEASE_CLOSURE_v1', runId: generated.run.runId, revision: generated.run.revision, applicability: 'REQUIRED', qualityClosureSetSha: null, questionUids: [uid], questionUidSetSha: objectSha([uid]), candidateRefs: [candidateRef], assetRefs: [], runtimeBundleSha: null, requiredCases, cases: requiredCases.map(caseKey => ({ caseKey, captureEvidenceId: `capture:${caseKey}`, reviewEvidenceId: `review:${caseKey}` })), actualCases: requiredCases, currentRunInputSha: generated.run.inputSha, productionAuthorized: false, status: 'PASS' };
  const closure = { ...payload, closureSha: objectSha(payload) };
  const closureRef = f.write(relative, closure);
  const run = { ...generated.run, examReleaseClosureRef: closureRef };
  run.inputSha = runInputSha(run);
  const ref = f.write(relative.replace(/closure\.json$/, 'run.json'), run);
  return { ...generated, run, ref, closure, closureRef };
}

function candidateQuestions(root, run) {
  const context = { window: {} };
  const ref = run.inputs.find(item => item.role === 'candidate' && item.path === run.questions[0].candidatePath);
  vm.runInNewContext(fs.readFileSync(path.join(root, ref.path), 'utf8'), context);
  return context.window.questionBank;
}

test('one-pass resume runner connects provider review, route handler, repair, and targeted recheck', async t => {
  const f = recoveryFixture(t, { pipeline: 'past-exam', revisionMutation: 'solution', currentPassAxes: ['SOURCE', 'MATH_A1', 'MATH_A2', 'V1'] });
  const first = attachClosure(f, f.makeRun(1), 'review/first-closure.json');
  const second = attachClosure(f, f.makeRun(2), 'review/second-closure.json');
  const phaseLog = path.join(f.root, 'phase-calls.json');
  const axisLog = path.join(f.root, 'phase-axes.json');
  const transport = f.write('transport.mjs', `
    import fs from 'node:fs';
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    const firstInputSha = ${JSON.stringify(first.run.inputSha)};
    const secondInputSha = ${JSON.stringify(second.run.inputSha)};
    if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic', model: 'synthetic', externalTaskId: 'external-' + request.launchId, auditorId: 'auditor-' + request.launchId, auditorSessionId: 'auditor-session-' + request.launchId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic', contexts: { U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' }, U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' }, U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' } } }));
    } else {
      const phaseLog = ${JSON.stringify(phaseLog)};
      const calls = fs.existsSync(phaseLog) ? JSON.parse(fs.readFileSync(phaseLog, 'utf8')) : [];
      calls.push(request.phase);
      fs.writeFileSync(phaseLog, JSON.stringify(calls));
      const axisLog = ${JSON.stringify(axisLog)};
      const axes = fs.existsSync(axisLog) ? JSON.parse(fs.readFileSync(axisLog, 'utf8')) : [];
      axes.push({ phase: request.phase, targetedAxes: request.targetedAxes, targetedAxesByQuestionUid: request.targetedAxesByQuestionUid });
      fs.writeFileSync(axisLog, JSON.stringify(axes));
      const firstLaunch = request.logicalLaunchId.endsWith(':1');
      const runInputSha = firstLaunch ? firstInputSha : secondInputSha;
      const revision = firstLaunch ? 1 : 2;
      const item = Array.isArray(request.packet.payload) ? request.packet.payload[0] : request.packet.payload;
      const axisShas = firstLaunch ? ${JSON.stringify(first.run.questions[0].axisInputShas)} : ${JSON.stringify(second.run.questions[0].axisInputShas)};
      const requestedAxes = request.targetedAxesByQuestionUid?.[item.questionUid] || (request.phase === 'U1' ? ['SOURCE', 'MATH_A1', 'V1'] : request.phase === 'U2' ? ['V2'] : ['MATH_A2', 'SOLUTION', 'V3']);
      const payloadFor = axis => axis === 'MATH_A1' ? { independentAnswer: '1', independentDerivation: 'synthetic independent derivation', blindSolveFrozen: true, allChoicesChecked: true, answerUnique: true } : axis === 'MATH_A2' ? { a1EvidenceSha: 'sha256:' + 'c'.repeat(64), answerComparison: 'synthetic answer parity', allChoicesChecked: true, answerUnique: true } : axis === 'SOLUTION' ? { solutionRationale: 'synthetic solution rationale', checks: { mathematicalCorrectness: 'PASS', logicalCompleteness: 'PASS', studentUnderstandability: 'PASS' } } : axis === 'RENDER_REVIEW' ? { questionUids: [item.questionUid], freshQuestionUids: [item.questionUid], checks: { clipping: 'PASS', overflow: 'PASS', readability: 'PASS' } } : {};
      const evidence = requestedAxes.map(axis => ({ schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: request.logicalLaunchId + '-' + request.phase + '-' + axis, runId: 'run', revision, questionUid: item.questionUid, axis, inputSha: runInputSha, axisInputSha: axisShas[axis], mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'auditor-' + request.logicalLaunchId, reviewSessionId: request.packet.auditorSessionId, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-14T06:00:00.000Z', frozenAt: '2026-09-14T06:01:00.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: request.packet.inputVisibilityProfile, findings: [], reviewIsolationProvenanceSha: request.packet.packetSha, launchId: request.logicalLaunchId, externalTaskId: request.externalTaskId, reviewStartInputSha: runInputSha, reviewEndInputSha: runInputSha, withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', payload: payloadFor(axis) }));
      const defects = request.logicalLaunchId.endsWith(':1') && request.phase === 'U3' ? [{ runId: 'run', questionUid: 'recovery|1', type: 'CANDIDATE_MATH_DEFECT', defectClass: 'CANDIDATE_MATH_DEFECT', reason: 'synthetic repair' }] : [];
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: request.externalTaskId, phase: request.phase, sessionId: request.packet.auditorSessionId, contextId: request.packet.contextId, providerInvocationId: request.logicalLaunchId + '-' + request.phase, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: 'NONE', subagentToolsEnabled: false, usedTokens: 0, evidence, defects }));
    }
  `);
  const result = await resumePastExam(f.root, {
    workBatchId: 'job',
    runRefs: [first.ref],
    providerCommand: process.execPath,
    providerArgs: [path.join(f.root, transport.path)],
    maxSteps: 12,
    handlers: {
      CANDIDATE_REPAIR: ({ defects }) => ({ route: 'CANDIDATE_REPAIR', repairRequest: { iteration: 1, revision: second.run.revision, inputSha: second.run.inputSha, dispositions: defects.map(defect => ({ ...defect, disposition: 'REPAIRED_CANDIDATE' })), builderId: 'builder', builderSessionId: 'builder-session', runRefs: [second.ref] } }),
    },
    closureHandler: ({ state }) => {
      const ready = makeReviewReadyFromCompletedState({ root: f.root, state, runRef: second.ref, closure: second.closure, closureRef: second.closureRef, examId: 'recovery', candidateQuestions: candidateQuestions(f.root, second.run), outputPath: 'review/review-ready.json' });
      return { status: 'PASS', productionAuthorized: false, reviewReadyRef: ready.readyRef, reviewReadySha: ready.readyRef.sha256 };
    },
  });
  assert.equal(result.status, 'REVIEW_READY', JSON.stringify(result));
  assert.equal(result.state.status, 'REVIEW_READY');
  assert.equal(result.state.productionAuthorized, false);
  assert.ok(result.history.some(row => row.action === 'FINAL_AUDIT'));
  assert.ok(result.history.some(row => row.action === 'AUTO_REPAIR'));
  assert.ok(result.history.some(row => row.action === 'TARGETED_RECHECK'));
  assert.deepEqual(JSON.parse(fs.readFileSync(phaseLog, 'utf8')), ['U1', 'U2', 'U3', 'U3']);
  assert.equal(result.telemetry.providerInvocationCount, 2);
  assert.equal(result.telemetry.modelInvocationCount, 4);
  assert.deepEqual(result.telemetry.freshPhaseSet, ['U1', 'U2', 'U3']);
  assert.ok(result.telemetry.phaseTimings.u3Ms >= 0);
  const targetedReceipt = JSON.parse(fs.readFileSync(path.join(f.root, result.state.launches.at(-1).providerReceiptRef.path), 'utf8'));
  assert.deepEqual(targetedReceipt.freshPhaseSet, ['U3']);
  assert.deepEqual(targetedReceipt.reusedPhaseSet, ['U1', 'U2']);
  assert.equal(targetedReceipt.phaseAttestationRefs.some(row => row.phase === 'U1'), false);
  assert.equal(targetedReceipt.phaseAttestationRefs.some(row => row.phase === 'U2'), false);
  assert.ok(targetedReceipt.reusedAxisSet.some(row => row.questionUid === 'recovery|1' && row.axis === 'SOURCE'));
  assert.ok(targetedReceipt.reusedAxisSet.some(row => row.questionUid === 'recovery|1' && row.axis === 'MATH_A2'));
  assert.ok(targetedReceipt.freshAxisSet.some(row => row.questionUid === 'recovery|1' && row.axis === 'SOLUTION'));
  assert.equal(result.state.freezes.at(-1).targetedDispatchPlan.plans[0].renderReuse.schemaVersion, 'APMATH_SPEED_PATH_v1');
  const phaseAxes = JSON.parse(fs.readFileSync(axisLog, 'utf8'));
  assert.deepEqual(phaseAxes.at(-1), { phase: 'U3', targetedAxes: null, targetedAxesByQuestionUid: { 'recovery|1': ['RENDER_REVIEW', 'SOLUTION', 'V3'] } });
});

test('targeted recheck merges reused U1 evidence with fresh U3 evidence and preserves answer conflicts', async t => {
  const f = recoveryFixture(t, { pipeline: 'past-exam', revisionMutation: 'solution', currentPassAxes: ['MATH_A1'], currentPassAnswers: { MATH_A1: '2' } });
  const first = attachClosure(f, f.makeRun(1), 'conflict-review/first-closure.json');
  const second = attachClosure(f, f.makeRun(2), 'conflict-review/second-closure.json');
  const transport = f.write('conflict-transport.mjs', `
    import fs from 'node:fs';
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    const firstInputSha = ${JSON.stringify(first.run.inputSha)};
    const secondInputSha = ${JSON.stringify(second.run.inputSha)};
    if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic', model: 'synthetic', externalTaskId: 'external-' + request.launchId, auditorId: 'auditor-' + request.launchId, auditorSessionId: 'auditor-session-' + request.launchId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic', contexts: { U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' }, U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' }, U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' } } }));
    } else {
      const firstLaunch = request.logicalLaunchId.endsWith(':1');
      const runInputSha = firstLaunch ? firstInputSha : secondInputSha;
      const revision = firstLaunch ? 1 : 2;
      const item = Array.isArray(request.packet.payload) ? request.packet.payload[0] : request.packet.payload;
      const requestedAxes = request.targetedAxesByQuestionUid?.[item.questionUid] || request.targetedAxes;
      const axis = requestedAxes?.[0] || (request.phase === 'U1' ? 'MATH_A1' : request.phase === 'U2' ? 'V2' : 'MATH_A2');
      const evidence = [{ schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: request.logicalLaunchId + '-' + request.phase + '-evidence', runId: 'run', revision, questionUid: item.questionUid, axis, inputSha: runInputSha, axisInputSha: 'sha256:' + 'a'.repeat(64), mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'auditor-' + request.logicalLaunchId, reviewSessionId: request.packet.auditorSessionId, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-14T06:00:00.000Z', frozenAt: '2026-09-14T06:01:00.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: request.packet.inputVisibilityProfile, findings: [], reviewIsolationProvenanceSha: request.packet.packetSha, launchId: request.logicalLaunchId, externalTaskId: request.externalTaskId, reviewStartInputSha: runInputSha, reviewEndInputSha: runInputSha, withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', payload: { independentAnswer: request.logicalLaunchId.endsWith(':2') && request.phase === 'U3' ? '3' : '1' } }];
      const defects = request.logicalLaunchId.endsWith(':1') && request.phase === 'U3' ? [{ runId: 'run', questionUid: 'recovery|1', type: 'CANDIDATE_MATH_DEFECT', defectClass: 'CANDIDATE_MATH_DEFECT', reason: 'synthetic repair' }] : [];
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: request.externalTaskId, phase: request.phase, sessionId: request.packet.auditorSessionId, contextId: request.packet.contextId, providerInvocationId: request.logicalLaunchId + '-' + request.phase, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 0, evidence, defects }));
    }
  `);
  const result = await resumePastExam(f.root, {
    workBatchId: 'job',
    runRefs: [first.ref],
    providerCommand: process.execPath,
    providerArgs: [path.join(f.root, transport.path)],
    maxSteps: 12,
    handlers: {
      CANDIDATE_REPAIR: ({ defects }) => ({ route: 'CANDIDATE_REPAIR', repairRequest: { iteration: 1, revision: second.run.revision, inputSha: second.run.inputSha, dispositions: defects.map(defect => ({ ...defect, disposition: 'REPAIRED_CANDIDATE' })), builderId: 'builder', builderSessionId: 'builder-session', runRefs: [second.ref] } }),
    },
  });
  assert.equal(result.status, 'HUMAN_DECISION_REQUIRED');
  assert.equal(result.reason, 'REVIEW_CONFLICT');
  const targetedLaunch = result.state.launches.find(launch => launch.purpose === 'TARGETED_RECHECK');
  const targetedReceipt = JSON.parse(fs.readFileSync(path.join(f.root, targetedLaunch.providerReceiptRef.path), 'utf8'));
  assert.equal(targetedReceipt.adjudication.required, true);
  assert.equal(targetedReceipt.reusedEvidenceRefs.length, 1);
  const reusedEvidence = JSON.parse(fs.readFileSync(path.join(f.root, targetedReceipt.reusedEvidenceRefs[0].path), 'utf8'));
  assert.equal(reusedEvidence.payload.independentAnswer, '2');
  const merged = JSON.parse(fs.readFileSync(path.join(f.root, targetedReceipt.mergeRef.path), 'utf8'));
  assert.equal(merged.conflicts.length, 1);
  assert.equal(merged.conflicts[0].type, 'REVIEW_CONFLICT');
  assert.equal(merged.conflicts[0].claims.some(claim => claim.phase === 'U1' && claim.value === '2'), true);
  assert.equal(merged.conflicts[0].claims.some(claim => claim.phase === 'U3' && claim.value === '3'), true);
});
