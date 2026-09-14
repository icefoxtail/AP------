import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resumePastExam } from '../../past-exam-pipeline/resume-past-exam.mjs';
import { createReviewReady } from '../../past-exam-pipeline/lib/review-ready.mjs';
import { recoveryFixture } from './recovery-fixture.mjs';

test('one-pass resume runner connects provider review, route handler, repair, and targeted recheck', async t => {
  const f = recoveryFixture(t);
  const first = f.makeRun(1);
  const second = f.makeRun(2);
  const transport = f.write('transport.mjs', `
    import fs from 'node:fs';
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
      process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic', model: 'synthetic', externalTaskId: 'external-' + request.launchId, auditorId: 'auditor-' + request.launchId, auditorSessionId: 'auditor-session-' + request.launchId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic', contexts: { U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' }, U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' }, U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' } } }));
    } else {
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
});
