import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { computeAxisInputShaMap } from '../semantic-diff.mjs';
import { objectSha } from '../canonical.mjs';
import { nextWorkBatchAction } from '../defect-router.mjs';
import { buildTargetedDispatchPlan, buildTargetedRecheckPlan, providerTelemetryFromReceipts, renderReusePlan, speedTelemetry, validatedPassReuse } from '../speed.mjs';
import { validateRenderTransitionParity } from '../render-impact.mjs';
import { existingExamPreflight } from '../../past-exam-pipeline/lib/existing-exam.mjs';
import { runOneExam } from '../../past-exam-pipeline/run-one-exam.mjs';

function write(root, relative, value) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value) + '\n', 'utf8');
  return file;
}

function question(id, overrides = {}) {
  return {
    questionUid: `synthetic-exam|${id}`,
    sourcePath: 'synthetic-source.pdf',
    sourceExamId: 'synthetic-exam',
    id,
    content: `문항 ${id}의 식을 계산한다.`,
    choices: ['1', '2', '3', '4', '5'],
    answer: '1',
    solution: `문항 ${id}의 해를 계산하면 1이다.`,
    tags: [],
    ...overrides,
  };
}

function witnesses(uid, boundingBox = { x: 1, y: 2, width: 100, height: 80 }) {
  return [{
    questionUid: uid,
    mode: 'solution',
    viewportProfile: 'desktop',
    viewport: 'desktop',
    page: 1,
    column: 1,
    flowPosition: 1,
    boundingBox,
    continuation: null,
    runtimeResponseSha: `runtime-${uid}`,
    assetSha: `asset-${uid}`,
    screenshot: { sha256: `screenshot-${uid}` },
    blocks: [{ blockId: 'solution', placementSha: `placement-${uid}`, screenshot: { sha256: `block-${uid}` }, final: true }],
  }];
}

test('SPEED-01 existing canonical exam preflight skips before extraction/provider work', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-existing-exam-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const targetFile = 'original/high/h1/2final/26_모의고_2학기_기말_고1_공통수학1.js';
  write(root, `archive/exams/${targetFile}`, 'window.examTitle="existing";window.questionBank=[];');
  write(root, 'archive/db.js', `window.mainDB=${JSON.stringify({ exams: [{ file: targetFile, school: '모의고', grade: '고1', year: 2026, semester: '2', examType: 'final' }] })};`);
  const identity = { year: 2026, schoolName: '모의고', grade: '고1', semester: '2', examType: 'final', course: '공통수학1' };
  assert.equal(existingExamPreflight({ archiveRoot: path.join(root, 'archive'), examIdentity: identity }).status, 'SKIP_EXISTING_EXAM');
  assert.equal(existingExamPreflight({ archiveRoot: path.join(root, 'archive'), examIdentity: { ...identity, semester: '1' } }).status, 'NEW_EXAM');
  assert.equal(existingExamPreflight({ archiveRoot: path.join(root, 'archive'), examIdentity: identity, forceExisting: true }).status, 'FORCE_EXISTING_EXAM');
  const unregisteredFile = 'original/high/h1/2final/26_미등록고_2학기_기말_고1_공통수학1.js';
  write(root, `archive/exams/${unregisteredFile}`, 'window.examTitle="unregistered";window.questionBank=[];');
  assert.equal(existingExamPreflight({ archiveRoot: path.join(root, 'archive'), examIdentity: { ...identity, schoolName: '미등록고' } }).status, 'SKIP_EXISTING_EXAM');

  const generatedRoot = path.join(root, '_generated');
  const result = await runOneExam({ archiveRoot: path.join(root, 'archive'), generatedRoot, args: { forceExisting: false }, existingExamMode: 'NEW_EXAM_ONLY' }, {
    ...identity,
    examId: '26_모의고_2학기_기말_고1_공통수학1',
    canonicalExamId: '26_모의고_2학기_기말_고1_공통수학1',
    outputDir: path.join(generatedRoot, '26_모의고_2학기_기말_고1_공통수학1'),
  });
  assert.equal(result.status, 'SKIP_EXISTING_EXAM');
  assert.equal(result.providerInvocationCount, 0);
  assert.equal(result.modelInvocationCount, 0);
  assert.equal(result.extractionInvocationCount, 0);
  assert.equal(result.dbIndexWriteCount, 0);
  assert.equal(result.telemetry.skipExistingExam, true);
  assert.equal(fs.existsSync(generatedRoot), false);
  const incompleteOutput = path.join(generatedRoot, 'incomplete');
  const held = await runOneExam({ archiveRoot: path.join(root, 'archive'), generatedRoot, args: { forceExisting: false }, existingExamMode: 'NEW_EXAM_ONLY' }, {
    year: 2026,
    schoolName: '모의고',
    grade: '고1',
    semester: '2',
    examType: '',
    course: '공통수학1',
    examId: 'incomplete-identity',
    outputDir: incompleteOutput,
  });
  assert.equal(held.status, 'HOLD_EXISTING_EXAM_IDENTITY_INCOMPLETE');
  assert.ok(held.blockedReasons.includes('examType'));
  assert.equal(fs.existsSync(incompleteOutput), false);
});

test('SPEED-01 identity-incomplete existing-exam preflight fails closed instead of returning NEW_EXAM', () => {
  const result = existingExamPreflight({ archiveRoot: 'archive', examIdentity: { year: 2026, schoolName: '모의고', grade: '고1', semester: '2', course: '공통수학1' } });
  assert.equal(result.status, 'HOLD_EXISTING_EXAM_IDENTITY_INCOMPLETE');
  assert.equal(result.skip, false);
  assert.deepEqual(result.missingIdentityFields, ['examType']);
  assert.equal(existingExamPreflight({ archiveRoot: 'archive', forceExisting: true, examIdentity: { year: 2026, schoolName: '모의고', grade: '고1', semester: '2', course: '공통수학1' } }).status, 'HOLD_EXISTING_EXAM_IDENTITY_INCOMPLETE');
});

test('SPEED-02 semantic impact keeps unchanged axes reusable and fails closed when proof is missing', () => {
  const initial = Array.from({ length: 20 }, (_, index) => question(index + 1));
  const initialAxisShas = computeAxisInputShaMap(initial);
  const first = buildTargetedRecheckPlan([], initial, { currentAxisInputShas: initialAxisShas });
  assert.equal(first.affectedUidSet.length, 20);
  assert.equal(first.fullFinalAuditRequired, false);

  const repaired = initial.map(item => item.id === 7 ? { ...item, solution: '문항 7의 수정된 풀이를 계산하면 1이다.' } : item);
  const repairedAxisShas = computeAxisInputShaMap(repaired);
  const targeted = buildTargetedRecheckPlan(initial, repaired, { previousAxisInputShas: initialAxisShas, currentAxisInputShas: repairedAxisShas });
  assert.deepEqual(targeted.affectedUidSet, ['synthetic-exam|7']);
  assert.ok(targeted.impact.affectedUidAxisSet.every(row => row.questionUid === 'synthetic-exam|7'));
  assert.ok(targeted.reusableUidAxisSet.some(row => row.questionUid === 'synthetic-exam|1'));
  assert.ok(targeted.reusableUidAxisSet.some(row => row.questionUid === 'synthetic-exam|7' && row.axis === 'SOURCE'));

  const noProof = buildTargetedRecheckPlan(initial, repaired, { currentAxisInputShas: repairedAxisShas });
  assert.equal(noProof.proofStatus, 'FAIL_CLOSED_PREVIOUS_OR_CURRENT_AXIS_INPUT_MISSING');
  assert.equal(noProof.affectedUidSet.length, 20);
  assert.equal(noProof.reusableUidAxisSet.length, 0);
});

test('SPEED-02 dispatch plan sends only changed axes to fresh U1/U2/U3 phases', () => {
  const scope = [{ runId: 'run', questionUid: 'synthetic-exam|7' }];
  const plan = buildTargetedDispatchPlan({
    scope,
    requiredAxesByUid: { 'synthetic-exam|7': ['SOURCE', 'MATH_A1', 'MATH_A2', 'SOLUTION', 'V1', 'V2', 'V3', 'RENDER_REVIEW'] },
    affectedUidAxisSet: [
      { runId: 'run', questionUid: 'synthetic-exam|7', axis: 'SOLUTION' },
      { runId: 'run', questionUid: 'synthetic-exam|7', axis: 'V3' },
      { runId: 'run', questionUid: 'synthetic-exam|7', axis: 'RENDER_REVIEW' },
    ],
    reusableUidAxisSet: [
      'SOURCE', 'MATH_A1', 'MATH_A2', 'V1', 'V2',
    ].map(axis => ({ runId: 'run', questionUid: 'synthetic-exam|7', axis })),
    validatedReuseRows: [
      'SOURCE', 'MATH_A1', 'MATH_A2', 'V1', 'V2',
    ].map(axis => ({ runId: 'run', questionUid: 'synthetic-exam|7', axis, status: 'PASS', reuseStatus: 'VALIDATED_PASS_REUSE' })),
  });
  assert.deepEqual(plan.phaseScope.U1, []);
  assert.deepEqual(plan.phaseScope.U2, []);
  assert.deepEqual(plan.phaseScope.U3, [{ runId: 'run', questionUid: 'synthetic-exam|7', axes: ['RENDER_REVIEW', 'SOLUTION', 'V3'] }]);
  assert.equal(plan.reusedAxisSet.length, 5);
  assert.equal(plan.freshAxisSet.some(row => row.axis === 'MATH_A2'), false);
});

test('SPEED-03 source and shared-asset changes scope targeted rechecks to impacted questions', () => {
  const initial = Array.from({ length: 20 }, (_, index) => question(index + 1, index < 2 ? { solutionAssetPaths: ['shared.svg'] } : {}));
  const initialAxisShas = computeAxisInputShaMap(initial);
  const sourceChanged = initial.map(item => item.id === 7 ? { ...item, content: '문항 7의 원문 조건이 수정되었다.' } : item);
  const sourcePlan = buildTargetedRecheckPlan(initial, sourceChanged, { previousAxisInputShas: initialAxisShas, currentAxisInputShas: computeAxisInputShaMap(sourceChanged) });
  const q7Axes = new Set(sourcePlan.impact.affectedUidAxisSet.filter(row => row.questionUid === 'synthetic-exam|7').map(row => row.axis));
  assert.ok(q7Axes.has('SOURCE'));
  assert.ok(q7Axes.has('MATH_A1'));
  assert.equal(sourcePlan.affectedUidSet.includes('synthetic-exam|1'), false);

  const sharedChanged = initial.map(item => item.id <= 2 ? { ...item, solutionAssetPaths: ['shared-v2.svg'] } : item);
  const sharedPlan = buildTargetedRecheckPlan(initial, sharedChanged, { previousAxisInputShas: initialAxisShas, currentAxisInputShas: computeAxisInputShaMap(sharedChanged) });
  assert.deepEqual(sharedPlan.affectedUidSet, ['synthetic-exam|1', 'synthetic-exam|2']);
  assert.equal(sharedPlan.affectedUidSet.includes('synthetic-exam|3'), false);
});

test('SPEED-04 weak CURRENT_PASS evidence cannot suppress fresh review', () => {
  const currentRunInputSha = 'sha256:' + 'a'.repeat(64);
  const currentAxisInputSha = 'sha256:' + 'b'.repeat(64);
  const evidence = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', status: 'PASS', validityStatus: 'VALID', questionUid: 'q1', axis: 'SOLUTION', inputSha: currentRunInputSha, axisInputSha: currentAxisInputSha };
  const current = validatedPassReuse({ evidence, currentRunInputSha, currentAxisInputSha });
  assert.equal(current.status, 'BLOCKED');
  assert.equal(current.reuseStatus, 'REUSE_BLOCKED');
  assert.ok(current.errors.includes('CURRENT_PASS_INDEPENDENCE_CONTEXT_REQUIRED'));
  const weakDispatch = buildTargetedDispatchPlan({
    scope: [{ runId: 'run', questionUid: 'q1' }],
    requiredAxesByUid: { q1: ['SOLUTION'] },
    reusableUidAxisSet: [{ runId: 'run', questionUid: 'q1', axis: 'SOLUTION' }],
    validatedReuseRows: [{ runId: 'run', questionUid: 'q1', axis: 'SOLUTION', status: 'PASS', reuseStatus: 'CURRENT_PASS' }],
  });
  assert.deepEqual(weakDispatch.freshAxisSet, [{ runId: 'run', questionUid: 'q1', axis: 'SOLUTION' }]);

  const packetBody = { schemaVersion: 'APMATH_AUDITOR_PACKET_v1', phase: 'U3', questionUids: ['q1'], payload: { questionUid: 'q1', currentQuestion: { questionUid: 'q1', content: 'Question', choices: ['1', '2'], candidateRef: { path: 'q.js', bytes: 1, sha256: objectSha('candidate') } }, currentAnswer: '1', currentSolution: 'Independent solution.' }, auditorId: 'auditor', auditorSessionId: 'u3-session', auditorPrincipalType: 'STATELESS_MODEL', inputVisibilityProfile: 'CANDIDATE_ONLY', priorReviewVisibility: 'NONE', sealed: true, contextId: 'u3-context', launchId: 'job:1', externalTaskId: 'provider' };
  const packet = { ...packetBody, packetSha: objectSha(packetBody) };
  const boundEvidence = { ...evidence, runId: 'run', revision: 1, reviewerId: 'auditor', reviewSessionId: 'u3-session', reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-13T00:00:00Z', frozenAt: '2026-09-13T00:01:00Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: 'CANDIDATE_ONLY', reviewIsolationProvenanceSha: packet.packetSha, launchId: 'job:1', externalTaskId: 'provider', withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', findings: [] };
  const bound = validatedPassReuse({
    evidence: boundEvidence,
    currentRunInputSha,
    currentAxisInputSha,
    independentContext: {
      run: { runId: 'run', revision: 1, builderId: 'builder', builderSessionId: 'builder-session' },
      packet,
      launch: { launchId: 'job:1', status: 'COMPLETED', externalId: 'provider', auditorId: 'auditor', scope: [{ runId: 'run', questionUid: 'q1' }], contexts: { U3: { sessionId: 'u3-session', contextId: 'u3-context' } } },
    },
  });
  assert.equal(bound.status, 'PASS');
  assert.equal(bound.reuseStatus, 'CURRENT_PASS');
  const stale = validatedPassReuse({ evidence, currentRunInputSha, currentAxisInputSha: 'sha256:' + 'c'.repeat(64) });
  assert.equal(stale.reuseStatus, 'REUSE_BLOCKED');
});

test('SPEED-05 final audit stays single-pass while repair rechecks only the changed scope', () => {
  const finalOnly = nextWorkBatchAction({ status: 'FROZEN', launches: [{ purpose: 'FINAL_AUDIT', status: 'COMPLETED', scope: [{ questionUid: 'q1' }] }], openDefectSet: [], repairIterations: [] });
  assert.equal(finalOnly.action, 'CLOSURE');
  const afterRepair = nextWorkBatchAction({ status: 'FROZEN', launches: [{ purpose: 'FINAL_AUDIT', status: 'COMPLETED' }, { purpose: 'TARGETED_RECHECK', status: 'COMPLETED', scope: [{ questionUid: 'q7' }] }], openDefectSet: [], repairIterations: [{ status: 'CLOSED' }] });
  assert.equal(afterRepair.action, 'CLOSURE');
  assert.equal(afterRepair.action === 'FINAL_AUDIT', false);
});

test('SPEED-06 unchanged render input is reused and changed witness is fresh', () => {
  const previous = witnesses('synthetic-exam|7');
  const same = renderReusePlan(previous, structuredClone(previous));
  assert.deepEqual(same.affectedRenderUidSet, []);
  assert.equal(same.freshRenderCount, 0);
  assert.equal(same.reusedRenderCount, 1);
  const changed = renderReusePlan(previous, witnesses('synthetic-exam|7', { x: 9, y: 2, width: 100, height: 80 }));
  assert.deepEqual(changed.affectedRenderUidSet, ['synthetic-exam|7']);
  assert.equal(changed.freshRenderCount, 1);
  assert.equal(changed.reusedRenderCount, 0);
});

test('SPEED-07 telemetry records the synthetic 20-question speed comparison', () => {
  const initial = speedTelemetry({ questionCount: 20, finalAuditInvocationCount: 1, reviewedQuestionAxisCount: 20 * 11, providerInvocationCount: 1, modelInvocationCount: 1 });
  const repaired = speedTelemetry({ questionCount: 20, finalAuditInvocationCount: 1, targetedRecheckInvocationCount: 1, reviewedQuestionAxisCount: 20 * 11 + 5, reusedPassQuestionAxisCount: 19 * 11 + 6, repairIterationCount: 1, providerInvocationCount: 2, modelInvocationCount: 2 });
  assert.equal(initial.finalAuditInvocationCount, 1);
  assert.equal(repaired.finalAuditInvocationCount, 1);
  assert.equal(repaired.targetedRecheckInvocationCount, 1);
  assert.ok(repaired.reusedPassQuestionAxisCount > 0);
  assert.equal(repaired.skipExistingExam, false);
});

test('SPEED-08 telemetry keeps stage timings and separates provider launches from fresh model turns', () => {
  const telemetry = speedTelemetry({
    phaseTimings: { freezeMs: 11, packetBuildMs: 12, providerPreflightMs: 13, providerReservationMs: 14, u1Ms: 15, u2Ms: 16, u3Ms: 17, mergeMs: 18, reconcileMs: 19 },
    renderTimings: { browserLaunchMs: 21, contextCreationMs: 22, navigationMs: 23, fastRuntimeMs: 24, runtimeReadinessMs: 25, fontsMs: 26, mathJaxMs: 27, imageDecodeMs: 28, geometryValidationMs: 29, screenshotEncodeMs: 30, screenshotWriteMs: 31, totalCaseMs: 32, totalCaptureMs: 33 },
    auditTimings: { auditV2RunMs: 41, evidenceFreshnessMs: 42, qualityClosureMs: 43, releaseClosureMs: 44, authorityValidationMs: 45, reviewReadyValidationMs: 46 },
    freshPhaseSet: ['U3'],
    reusedPhaseSet: ['U1', 'U2'],
    freshAxisSet: [{ questionUid: 'q1', axis: 'SOLUTION' }],
    reusedAxisSet: [{ questionUid: 'q1', axis: 'SOURCE' }],
    screenshotStats: { count: 2, bytes: 1024, encodeMs: 30, writeMs: 31 },
  });
  assert.equal(telemetry.phaseTimings.u3Ms, 17);
  assert.equal(telemetry.renderTimings.totalCaptureMs, 33);
  assert.equal(telemetry.auditTimings.auditV2RunMs, 41);
  assert.deepEqual(telemetry.freshPhaseSet, ['U3']);
  assert.deepEqual(telemetry.reusedAxisSet, [{ questionUid: 'q1', axis: 'SOURCE' }]);
  assert.deepEqual(telemetry.screenshotStats, { count: 2, bytes: 1024, encodeMs: 30, writeMs: 31 });

  const aggregated = providerTelemetryFromReceipts([
    { status: 'COMPLETED', launchId: 'job:1', modelInvocationCount: 3 },
    { status: 'COMPLETED', launchId: 'job:2', modelInvocationCount: 1 },
    { status: 'FAILED', launchId: 'job:3', modelInvocationCount: 0 },
  ]);
  assert.deepEqual(aggregated, { providerInvocationCount: 2, modelInvocationCount: 4 });
});

test('SPEED-09 mode transition reuse requires complete render identity parity', () => {
  const previous = { candidatePath: 'candidate.js', candidateSha: 'sha-candidate', sourceRef: 'exam-source', assetSha: 'sha-assets', mode: 'exam', viewport: 'desktop', questionUids: ['q1'], questionCount: 1, runtimeTransactionId: 'tx-1', sessionId: 'session-1', snapshotId: 'snapshot-1', pagination: 'page-1', solutionBlock: null, answerBlock: null, mathJax: 'loaded', errorState: null };
  const next = { ...previous, mode: 'solution', runtimeTransactionId: 'tx-2', solutionBlock: 'solution-block-1' };
  assert.equal(validateRenderTransitionParity(previous, next).status, 'PASS');
  assert.ok(validateRenderTransitionParity(previous, { ...next, candidateSha: 'sha-changed' }).errors.includes('CANDIDATE_IDENTITY_MISMATCH'));
  assert.ok(validateRenderTransitionParity(previous, { ...next, viewport: 'mobile' }).errors.includes('VIEWPORT_IDENTITY_MISMATCH'));
  assert.ok(validateRenderTransitionParity(previous, { ...next, snapshotId: null }).errors.includes('RUNTIME_SNAPSHOT_IDENTITY_MISSING'));
});
