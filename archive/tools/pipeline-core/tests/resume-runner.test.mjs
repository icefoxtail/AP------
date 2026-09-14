import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { resumePastExam } from '../../past-exam-pipeline/resume-past-exam.mjs';
import { createReviewReady } from '../../past-exam-pipeline/lib/review-ready.mjs';
import { recoveryFixture } from './recovery-fixture.mjs';

test('one-pass resume runner connects provider review, route handler, repair, and targeted recheck', async t => {
  const f = recoveryFixture(t, { pipeline: 'past-exam', revisionMutation: 'solution', currentPassAxes: ['SOURCE', 'MATH_A1', 'MATH_A2', 'V1'] });
  const first = f.makeRun(1);
  const second = f.makeRun(2);
  const phaseLog = path.join(f.root, 'phase-calls.json');
  const axisLog = path.join(f.root, 'phase-axes.json');
  const transport = f.write('transport.mjs', `
    import fs from 'node:fs';
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic', model: 'synthetic', externalTaskId: 'external-' + request.launchId, auditorId: 'auditor-' + request.launchId, auditorSessionId: 'auditor-session-' + request.launchId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic', contexts: { U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' }, U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' }, U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' } } }));
    } else {
      const phaseLog = ${JSON.stringify(phaseLog)};
      const calls = fs.existsSync(phaseLog) ? JSON.parse(fs.readFileSync(phaseLog, 'utf8')) : [];
      calls.push(request.phase);
      fs.writeFileSync(phaseLog, JSON.stringify(calls));
      const axisLog = ${JSON.stringify(axisLog)};
      const axes = fs.existsSync(axisLog) ? JSON.parse(fs.readFileSync(axisLog, 'utf8')) : [];
      axes.push({ phase: request.phase, targetedAxes: request.targetedAxes });
      fs.writeFileSync(axisLog, JSON.stringify(axes));
      const defects = request.logicalLaunchId.endsWith(':1') && request.phase === 'U3' ? [{ runId: 'run', questionUid: 'recovery|1', type: 'CANDIDATE_MATH_DEFECT', defectClass: 'CANDIDATE_MATH_DEFECT', reason: 'synthetic repair' }] : [];
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: request.externalTaskId, phase: request.phase, sessionId: request.packet.auditorSessionId, contextId: request.packet.contextId, providerInvocationId: request.logicalLaunchId + '-' + request.phase, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 0, evidence: [], defects }));
    }
  `);
  const finalClosureRef = f.write('review/final-closure.json', { status: 'PASS', productionAuthorized: false });
  const candidateRef = first.run.inputs.find(ref => ref.role === 'candidate');
  const ready = createReviewReady({
    root: f.root,
    run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId: 'recovery', runId: 'review-ready', revision: 1 },
    closure: { status: 'PASS', productionAuthorized: false },
    finalAudit: { status: 'PASS' },
    candidateRef,
    assetRefs: [],
    candidateQuestions: [{ id: 1, visualNeed: 'NONE', content: 'Find the value.', choices: ['1', '2'], answer: '1', solution: 'The answer is 1.' }],
    baselineQuestions: [],
    renderCases: ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'].map(caseKey => ({ caseKey, status: 'PASS' })),
    gateStatuses: { sourceFidelity: 'PASS', math: 'PASS', solutionQuality: 'PASS', visual: 'PASS', metadata: 'PASS', finalAudit: 'PASS', render: 'PASS' },
    finalClosureRef,
    openDefectCount: 0,
  });
  assert.equal(ready.status, 'REVIEW_READY', JSON.stringify(ready.errors));
  const reviewReadyRef = f.write('review/review-ready.json', ready);
  const result = await resumePastExam(f.root, {
    workBatchId: 'job',
    runRefs: [first.ref],
    providerCommand: process.execPath,
    providerArgs: [path.join(f.root, transport.path)],
    reviewReadyRef,
    reviewReadySha: reviewReadyRef.sha256,
    maxSteps: 12,
    handlers: {
      CANDIDATE_REPAIR: ({ defects }) => ({ route: 'CANDIDATE_REPAIR', repairRequest: { iteration: 1, revision: second.run.revision, inputSha: second.run.inputSha, dispositions: defects.map(defect => ({ ...defect, disposition: 'REPAIRED_CANDIDATE' })), builderId: 'builder', builderSessionId: 'builder-session', runRefs: [second.ref] } }),
    },
  });
  assert.equal(result.status, 'REVIEW_READY');
  assert.equal(result.state.status, 'REVIEW_READY');
  assert.equal(result.state.productionAuthorized, false);
  assert.ok(result.history.some(row => row.action === 'FINAL_AUDIT'));
  assert.ok(result.history.some(row => row.action === 'AUTO_REPAIR'));
  assert.ok(result.history.some(row => row.action === 'TARGETED_RECHECK'));
  assert.deepEqual(JSON.parse(fs.readFileSync(phaseLog, 'utf8')), ['U1', 'U2', 'U3', 'U3']);
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
  assert.deepEqual(phaseAxes.at(-1), { phase: 'U3', targetedAxes: ['RENDER_REVIEW', 'SOLUTION', 'V3'] });
});
