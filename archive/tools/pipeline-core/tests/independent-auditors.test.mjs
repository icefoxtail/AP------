import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { mergeIndependentReviews } from '../review-merger.mjs';
import { buildAuditorPacket, buildU3CandidatePayload } from '../review-isolation-runner.mjs';
import { axisInputSha } from '../projection.mjs';
import { objectSha } from '../canonical.mjs';
import { nextWorkBatchAction } from '../defect-router.mjs';
import { validateFreshEvidenceIndependence, FRESH_LIFECYCLE_DECLARATIONS } from '../review-evidence-v2.mjs';
import { recoveryFixture } from './recovery-fixture.mjs';
import { resumePastExam } from '../../past-exam-pipeline/resume-past-exam.mjs';

const finding = type => ({ runId: 'run', questionUid: 'q', type, defectClass: type });
const results = () => ['U1', 'U2', 'U3'].map(phase => ({ phase, evidence: [], defects: [] }));

test('merger preserves two different defects for the same UID and is phase-order deterministic', () => {
  const input = results(); input[1].defects = [finding('VISUAL_DEFECT')]; input[2].defects = [finding('SOLUTION_DEFECT')];
  const merged = mergeIndependentReviews(input);
  assert.deepEqual(merged.defects.map(d => d.type), ['VISUAL_DEFECT', 'SOLUTION_DEFECT']);
  assert.deepEqual(mergeIndependentReviews([...input].reverse()), merged);
  assert.deepEqual(merged.adjudication, { required: false, route: null, automaticLaunch: false, explicitAuthorizationRequired: true });
  assert.throws(() => mergeIndependentReviews(input.slice(1)), /THREE_PHASES/);
});

test('contradictory SOURCE assessments yield REVIEW_CONFLICT without choosing a winner', () => {
  const input = results(); input[0].defects = [finding('SOURCE_PAYLOAD_DEFECT')];
  input[2].evidence = [{ runId: 'run', questionUid: 'q', type: 'SOURCE_PASS' }];
  const merged = mergeIndependentReviews(input);
  assert.equal(merged.conflicts.length, 1);
  assert.equal(merged.defects.length, 2);
  const action = nextWorkBatchAction({ status: 'REPAIR_REQUIRED', openDefects: merged.defects });
  assert.equal(action.reason, 'REVIEW_CONFLICT');
  assert.equal(action.conditionalReview.purpose, 'SECOND_AUDIT');
  assert.equal(action.conditionalReview.automaticLaunch, false);
});

test('U3 rejects peer outputs, including nested output refs, and its input hash ignores peer results', () => {
  const context = { q: { currentQuestion: { questionUid: 'q', content: 'Question', choices: [], candidateRef: { path: 'q.js', bytes: 1, sha256: objectSha('candidate') } }, currentAnswer: '1', currentSolution: 'Independent solution.' } };
  assert.throws(() => buildU3CandidatePayload(context, 'q', { frozenU1: {} }), /CROSS_AUDITOR_OUTPUT_FORBIDDEN/);
  const payload = buildU3CandidatePayload(context, 'q', { dependencies: { nested: { u2Output: {} } } });
  assert.throws(() => buildAuditorPacket({ phase: 'U3', questionUid: 'q', payload, candidateContext: context, auditorId: 'auditor', auditorSessionId: 'u3', builderId: 'builder', builderSessionId: 'builder-session', auditorPrincipalType: 'STATELESS_MODEL', contextId: 'c3', inputVisibilityProfile: 'CANDIDATE_ONLY', priorReviewVisibility: 'NONE', sealed: true, launchId: 'launch', externalTaskId: 'provider' }), /CROSS_AUDITOR_OUTPUT_FORBIDDEN/);
  for (const axis of ['MATH_A2', 'V3']) assert.equal(axisInputSha({ content: 'q', choices: [], answer: '1' }, axis, { frozen: { A1: 'a', V1: 'b', V2: 'c' } }), axisInputSha({ content: 'q', choices: [], answer: '1' }, axis, { frozen: { A1: 'changed', V1: 'changed', V2: 'changed' } }));
});

test('U3 render evidence binds the same independent candidate packet, not a fictitious peer-visible context', () => {
  const packet = { phase: 'U3', packetSha: objectSha('packet'), auditorId: 'auditor', auditorSessionId: 'u3', auditorPrincipalType: 'STATELESS_MODEL', inputVisibilityProfile: 'CANDIDATE_ONLY', priorReviewVisibility: 'NONE', sealed: true, contextId: 'c3', questionUids: ['q'], launchId: 'job:1', externalTaskId: 'provider' };
  const evidence = { ...FRESH_LIFECYCLE_DECLARATIONS, axis: 'RENDER_REVIEW', questionUid: 'q', reviewerId: 'auditor', reviewSessionId: 'u3', reviewerModelOrAgent: 'synthetic', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-13T00:00:00Z', frozenAt: '2026-09-13T00:01:00Z', inputVisibilityProfile: 'CANDIDATE_ONLY', priorReviewVisibility: 'NONE', reviewIsolationProvenanceSha: packet.packetSha, findings: [], launchId: 'job:1', externalTaskId: 'provider' };
  assert.deepEqual(validateFreshEvidenceIndependence(evidence, { builderId: 'builder', builderSessionId: 'builder-session' }, packet), []);
  assert.ok(validateFreshEvidenceIndependence({ ...evidence, priorReviewVisibility: 'FROZEN_U1_U2' }, { builderId: 'builder', builderSessionId: 'builder-session' }, packet).length > 0);
});

test('independently computed different answers are conflicts, and different subjects are not conflated', () => {
  const input = results();
  input[0].evidence = [{ runId: 'run', questionUid: 'q', axis: 'MATH_A1', payload: { independentAnswer: '2' } }];
  input[2].evidence = [{ runId: 'run', questionUid: 'q', axis: 'MATH_A2', payload: { independentAnswer: '3' } }];
  assert.equal(mergeIndependentReviews(input).conflicts[0].domain, 'MATH_ANSWER');
  input[0].evidence[0].subjectSha = objectSha('source-A');
  input[2].evidence[0].subjectSha = objectSha('candidate-B');
  assert.equal(mergeIndependentReviews(input).conflicts.length, 0);
});

for (const conflict of [false, true]) test(`synthetic independent FINAL_AUDIT → ${conflict ? 'authorized conflict-only SECOND_AUDIT' : 'TARGETED_RECHECK'}`, async t => {
  const f = recoveryFixture(t, { questionCount: 20 }), first = f.makeRun(1), second = f.makeRun(2);
  const transport = f.write('independent-transport.mjs', `
    import fs from 'node:fs';
    const r = JSON.parse(fs.readFileSync(0, 'utf8'));
    if (r.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
      process.stdout.write(JSON.stringify({schemaVersion:r.schemaVersion,operation:r.operation,status:'READY',requestSha:r.requestSha,provider:'synthetic',model:'synthetic',externalTaskId:'external-'+r.launchId,auditorId:'auditor-'+r.launchId,auditorSessionId:'control-'+r.launchId,contextIsolation:'STATELESS_INPUTS',subagentToolsEnabled:false,modelInvocationCount:0,runtimeAttestation:'synthetic-only',contexts:Object.fromEntries(['U1','U2','U3'].map(p=>[p,{sessionId:r.launchId+p,contextId:r.launchId+p+'context'}]))}));
    } else {
      const serialized = JSON.stringify(r.packet);
      if (/frozenU1|frozenU2|PEER_OUTPUT_SENTINEL/.test(serialized) || r.packet.priorReviewVisibility !== 'NONE') throw new Error('PEER_OUTPUT_LEAK');
      if (r.phase === 'U3' && r.packet.inputVisibilityProfile !== 'CANDIDATE_ONLY') throw new Error('CANDIDATE_VISIBILITY');
      const defects = r.logicalLaunchId.endsWith(':1') && r.phase === (${conflict} ? 'U1' : 'U3') ? [{runId:'run',questionUid:'recovery|1',type:${conflict} ? 'SOURCE_PAYLOAD_DEFECT' : 'CANDIDATE_MATH_DEFECT',reason:'repair once'}] : [];
      const evidence = [{runId:'run',questionUid:'recovery|1',axis:'DIAGNOSTIC_ONLY',marker:'PEER_OUTPUT_SENTINEL-'+r.phase}];
      if (${conflict} && r.phase === 'U3' && r.logicalLaunchId.endsWith(':1')) evidence.push({runId:'run',questionUid:'recovery|1',type:'SOURCE_PASS'});
      process.stdout.write(JSON.stringify({schemaVersion:r.schemaVersion,operation:r.operation,status:'COMPLETED',inputSha:r.inputSha,packetSha:r.packet.packetSha,externalTaskId:r.externalTaskId,phase:r.phase,sessionId:r.packet.auditorSessionId,contextId:r.packet.contextId,providerInvocationId:r.logicalLaunchId+r.phase,inputVisibilityProfile:r.packet.inputVisibilityProfile,priorReviewVisibility:'NONE',subagentToolsEnabled:false,usedTokens:0,evidence,defects}));
    }
  `);
  const out = await resumePastExam(f.root, { workBatchId: 'job', runRefs: [first.ref], conflictAuthorization: { explicit: true, reason: 'CONFLICT', authorizedBy: 'synthetic-user' }, providerCommand: process.execPath, providerArgs: [path.join(f.root, transport.path)], handlers: { CANDIDATE_REPAIR: ({ defects }) => ({ route: 'CANDIDATE_REPAIR', repairRequest: { iteration: 1, revision: 2, inputSha: second.run.inputSha, builderId: 'builder', builderSessionId: 'builder-session', runRefs: [second.ref], dispositions: defects.map(d => ({ ...d, disposition: 'REPAIRED_CANDIDATE' })) } }) } });
  assert.equal(out.status, 'CLOSURE_READY'); // Routing completion, not semantic closure PASS.
  assert.equal(out.state.launches.length, 2); // No routine adjudicator.
  assert.equal(out.state.launches[1].purpose, conflict ? 'SECOND_AUDIT' : 'TARGETED_RECHECK');
  if (conflict) assert.equal(out.state.freezes.length, 1);
  assert.equal(new Set(out.state.launches.flatMap(l => Object.values(l.contexts).map(c => c.sessionId))).size, 6);
  assert.equal(new Set(out.state.launches.flatMap(l => Object.values(l.contexts).map(c => c.contextId))).size, 6);
  for (const launch of out.state.launches) {
    const receipt = JSON.parse(fs.readFileSync(path.join(f.root, launch.providerReceiptRef.path)));
    const merged = JSON.parse(fs.readFileSync(path.join(f.root, receipt.mergeRef.path)));
    assert.equal(merged.phaseResultShas.length, 3);
    assert.equal(merged.adjudication.required, conflict && launch.launchId === 'job:1');
  }
});
