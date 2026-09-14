import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { computeAxisInputShaMap } from '../semantic-diff.mjs';
import { nextWorkBatchAction } from '../defect-router.mjs';
import { buildTargetedRecheckPlan, renderReusePlan, speedTelemetry, validatedPassReuse } from '../speed.mjs';
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
  const identity = { year: 2026, schoolName: '모의고', grade: '고1', semester: '2', examType: 'final' };
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

test('SPEED-04 validated PASS reuse blocks stale inputs and accepts the current PASS path', () => {
  const currentRunInputSha = 'sha256:' + 'a'.repeat(64);
  const currentAxisInputSha = 'sha256:' + 'b'.repeat(64);
  const evidence = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', status: 'PASS', validityStatus: 'VALID', questionUid: 'q1', axis: 'SOLUTION', inputSha: currentRunInputSha, axisInputSha: currentAxisInputSha };
  const current = validatedPassReuse({ evidence, currentRunInputSha, currentAxisInputSha });
  assert.equal(current.status, 'PASS');
  assert.equal(current.reuseStatus, 'CURRENT_PASS');
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
