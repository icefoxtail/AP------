import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resumePastExam } from '../../past-exam-pipeline/resume-past-exam.mjs';
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
  assert.equal(result.status, 'CLOSURE_READY');
  assert.ok(result.history.some(row => row.action === 'FINAL_AUDIT'));
  assert.ok(result.history.some(row => row.action === 'AUTO_REPAIR'));
  assert.ok(result.history.some(row => row.action === 'TARGETED_RECHECK'));
});
