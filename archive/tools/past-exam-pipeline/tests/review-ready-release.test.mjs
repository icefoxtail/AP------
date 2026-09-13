import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { bytesSha, fileRef } from '../../pipeline-core/canonical.mjs';
import { nextWorkBatchAction } from '../../pipeline-core/defect-router.mjs';
import { assertNoProductionWrite, assertProductionPayloadClean, assertStagingOutput, stripTransientProductionFields } from '../lib/production-boundary.mjs';
import { createReviewReady, validateDefaultVisualGate, validateVisualBaselineNonRegression } from '../lib/review-ready.mjs';
import { validateDefaultVisualGate as coreVisualGate } from '../../pipeline-core/solution-visual-benefit.mjs';
import { validateExternalApproval } from '../lib/release-authority.mjs';
import { executeApprovedRelease } from '../release-approved-exam.mjs';
import { readArchiveDb, readQuestionIndex, registerApprovedExam, assertTargetOnlyDbDelta, assertTargetOnlyIndexDelta, rebuildApprovedIndex } from '../register-approved-exam.mjs';

const SHA = 'sha256:' + 'a'.repeat(64);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

function write(root, relative, value) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.isBuffer(value) ? value : typeof value === 'string' ? value : JSON.stringify(value) + '\n');
  return file;
}

function renderCases() {
  return ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'].map(caseKey => ({ caseKey, status: 'PASS' }));
}

function makeReady(t, { withAsset = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-review-ready-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const question = { id: 1, visualNeed: 'NONE', level: '중', category: '수와 식', standardCourse: '공통수학1', standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산', subUnitKey: 'H22-C-01-CORE', subUnit: '다항식의 연산 핵심 개념', subUnitConfidence: 'candidate_evidence', subUnitClassificationDepth: 'complete_candidate', questionType: '객관식', layoutTag: 'grid', tags: [], wide: false, content: 'x+1=2', choices: ['1', '2', '3', '4', '5'], answer: '1', solution: '양변에서 1을 빼면 x=1이다.', image: '', solutionImage: withAsset ? 'assets/images/target/asset.svg' : '' };
  const candidatePath = write(root, 'staging/candidate.js', 'window.examTitle="target";window.questionBank=' + JSON.stringify([question]) + ';');
  const closurePath = write(root, 'staging/final-closure.json', { status: 'PASS', productionAuthorized: false, finalAudit: 'PASS' });
  const assetPath = withAsset ? write(root, 'staging/asset.svg', '<svg xmlns="http://www.w3.org/2000/svg"/>') : null;
  const candidateRef = fileRef(root, 'staging/candidate.js');
  const assetRefs = assetPath ? [fileRef(root, 'staging/asset.svg')] : [];
  const gates = { sourceFidelity: 'PASS', math: 'PASS', solutionQuality: 'PASS', visual: 'PASS', metadata: 'PASS', finalAudit: 'PASS', render: 'PASS' };
  const ready = createReviewReady({ root, run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId: 'target', runId: 'review-run', revision: 1 }, closure: { status: 'PASS', productionAuthorized: false }, finalAudit: { status: 'PASS' }, candidateRef, assetRefs, candidateQuestions: [question], baselineQuestions: [], renderCases: renderCases(), gateStatuses: gates, finalClosureRef: fileRef(root, 'staging/final-closure.json'), openDefectCount: 0 });
  assert.equal(ready.status, 'REVIEW_READY', JSON.stringify(ready.errors));
  const approval = { schemaVersion: 'APMATH_FINAL_EXTERNAL_APPROVAL_v1', approvalStatus: 'APPROVED', examId: 'target', reviewReadyRunId: ready.reviewReadyRunId, reviewReadySha: ready.reviewReadySha, candidateSha256: ready.candidateSha256, stagedAssetSetSha256: ready.stagedAssetSetSha256, finalClosureSha: ready.finalClosureSha, approvalEvidenceIdentity: 'external-review/target/approval-1', approvalEvidenceSha256: SHA, approvedAt: '2026-09-13T00:00:00.000Z' };
  return { root, candidatePath, candidateRef, assetPath, assetRefs, question, ready, approval };
}

function releaseFixture(t) {
  const f = makeReady(t);
  const targetFile = 'original/high/h1/1final/target.js';
  const targetPath = write(f.root, 'archive/exams/' + targetFile, 'window.examTitle="target";window.questionBank=' + JSON.stringify([f.question]) + ';');
  const dbEntry = { file: targetFile, school: '테스트고', grade: '고1', year: 2026, semester: '1', examType: 'final', subject: '공통수학1', contentType: '기출', qCount: 1, primaryStandardCourse: '공통수학1' };
  const dbPath = write(f.root, 'archive/db.js', 'window.mainDB=' + JSON.stringify({ exams: [] }) + ';');
  const indexPath = write(f.root, 'archive/question-index.js', 'window.questionIndex=[];');
  const reviewPath = write(f.root, 'staging/review.json', { questionCount: 1 });
  const manifest = { examId: 'target', archiveRelativePath: targetFile };
  const smokeReport = { status: 'PASS', cases: renderCases().map(row => ({ ...row, expectedQuestionCount: 1, observedQuestionCount: 1 })) };
  const dbBaselineSha256 = bytesSha(fs.readFileSync(dbPath));
  const indexBaselineSha256 = bytesSha(fs.readFileSync(indexPath));
  return { ...f, targetFile, targetPath: path.join(f.root, 'archive/exams/' + targetFile), candidateFile: f.candidatePath, reviewFile: reviewPath, reviewReady: f.ready, approval: { ...f.approval, dbBaselineSha256, indexBaselineSha256 }, dbEntry, dbPath, indexPath, reviewPath, manifest, smokeReport, dbBaselineSha256, indexBaselineSha256 };
}

test('A: normal completion exposes REVIEW_READY and every builder output root is protected', () => {
  assert.equal(nextWorkBatchAction({ status: 'REVIEW_READY', openDefectSet: [], launches: [], freezes: [] }).action, 'EXTERNAL_APPROVAL_REQUIRED');
  const root = repositoryRoot;
  for (const target of ['archive/exams', 'archive/assets', 'archive/db.js', 'archive/question-index.js']) assert.throws(() => assertStagingOutput(root, target), /UNAUTHORIZED_PRODUCTION_WRITE/);
  assert.throws(() => assertNoProductionWrite(root, ['archive/db.js'], 'REVIEW_READY'), /UNAUTHORIZED_PRODUCTION_WRITE/);
});

test('production payload sanitizer rejects transient state and strips it only in explicit staging preparation', () => {
  const payload = { examTitle: 'target', questionBank: [{ id: 1, answerStatus: 'generated_pending', fullPageImagePath: 'C:\\temp\\_generated\\page.png', content: 'x+1=2' }] };
  assert.throws(() => assertProductionPayloadClean(payload), /TRANSIENT_PRODUCTION_METADATA/);
  const clean = stripTransientProductionFields(payload);
  assert.equal(clean.questionBank[0].answerStatus, undefined);
  assert.equal(clean.questionBank[0].fullPageImagePath, undefined);
});

test('B: promotion cannot start without an external approval receipt', t => {
  const f = releaseFixture(t);
  let promoted = 0;
  const result = executeApprovedRelease({ ...f, approval: null, dependencies: { promote: () => { promoted += 1; } } });
  assert.equal(result.status, 'HOLD');
  assert.equal(promoted, 0);
});

test('C: candidate bytes changed after approval are rejected', t => {
  const f = makeReady(t);
  fs.appendFileSync(f.candidatePath, '\n// changed after approval');
  const checked = validateExternalApproval({ root: f.root, reviewReady: f.ready, approval: f.approval, candidateRef: f.candidateRef, assetRefs: f.assetRefs });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('APPROVED_CANDIDATE_SHA_MISMATCH'));
});

test('D: asset bytes changed after approval are rejected', t => {
  const f = makeReady(t, { withAsset: true });
  fs.appendFileSync(f.assetPath, 'changed');
  const checked = validateExternalApproval({ root: f.root, reviewReady: f.ready, approval: f.approval, candidateRef: f.candidateRef, assetRefs: f.assetRefs });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('APPROVED_ASSET_SET_SHA_MISMATCH'));
});

test('E: promotion allowlist rejects DB/index writes', () => {
  const root = repositoryRoot;
  assert.throws(() => assertNoProductionWrite(root, ['archive/db.js'], 'PROMOTE_APPROVED_EXAM'), /UNAUTHORIZED_PRODUCTION_WRITE/);
  const promotionSource = fs.readFileSync(path.resolve(root, 'archive/tools/past-exam-pipeline/promote-reviewed-exam.mjs'), 'utf8');
  assert.doesNotMatch(promotionSource, /archive[\\/]db\.js|question-index\.js/);
});

test('F: REGISTER_APPROVED_EXAM adds or updates only the explicitly named target', t => {
  const f = releaseFixture(t);
  const result = registerApprovedExam({ root: f.root, examId: 'target', targetFile: f.targetFile, dbEntry: f.dbEntry, dbPath: 'archive/db.js', expectedDbSha256: f.dbBaselineSha256, reviewReady: f.reviewReady, approval: f.approval, promotion: { status: 'PROMOTED', examId: 'target', candidateSha256: f.reviewReady.candidateSha256 } });
  assert.equal(result.status, 'PASS');
  const entries = readArchiveDb(f.dbPath).mainDB.exams;
  assert.deepEqual(entries.map(entry => entry.file), [f.targetFile]);
});

test('G: an unregistered exam already on disk is not auto-registered', t => {
  const f = releaseFixture(t);
  const otherFile = 'original/high/h1/1final/other.js';
  write(f.root, 'archive/exams/' + otherFile, 'window.examTitle="other";window.questionBank=[];');
  registerApprovedExam({ root: f.root, examId: 'target', targetFile: f.targetFile, dbEntry: f.dbEntry, dbPath: 'archive/db.js', expectedDbSha256: f.dbBaselineSha256, reviewReady: f.reviewReady, approval: f.approval, promotion: { status: 'PROMOTED', examId: 'target', candidateSha256: f.reviewReady.candidateSha256 } });
  assert.equal(readArchiveDb(f.dbPath).mainDB.exams.some(entry => entry.file === otherFile), false);
});

test('H: unexpected DB semantic delta fails closed', () => {
  assert.throws(() => assertTargetOnlyDbDelta([{ file: 'other.js', qCount: 1 }], [{ file: 'other.js', qCount: 2 }], 'target.js'), /UNEXPECTED_DB_SCOPE_DELTA/);
});

test('I: unexpected index semantic delta fails closed', () => {
  assert.throws(() => assertTargetOnlyIndexDelta([{ qKey: 'other.js_1', sourceFile: 'other.js' }], [{ qKey: 'other.js_1', sourceFile: 'other.js', tags: ['changed'] }], 'target.js'), /UNEXPECTED_INDEX_SCOPE_DELTA/);
});

test('J: REVIEW_READY is required before registration', t => {
  const f = releaseFixture(t);
  assert.throws(() => registerApprovedExam({ root: f.root, examId: 'target', targetFile: f.targetFile, dbEntry: f.dbEntry, dbPath: 'archive/db.js', expectedDbSha256: f.dbBaselineSha256, reviewReady: f.reviewReady, approval: f.approval }), /REGISTER_BEFORE_PROMOTION_FORBIDDEN/);
  const blocked = { ...f.ready, status: 'BLOCKED', state: 'BLOCKED' };
  let registered = 0;
  const result = executeApprovedRelease({ ...f, reviewReady: blocked, dependencies: { register: () => { registered += 1; } } });
  assert.equal(result.status, 'HOLD');
  assert.equal(registered, 0);
});

test('K: promotion failure prevents registration', t => {
  const f = releaseFixture(t);
  let registered = 0;
  const result = executeApprovedRelease({ ...f, dependencies: { promote: () => { throw new Error('PROMOTION_FAILED'); }, register: () => { registered += 1; } } });
  assert.equal(result.status, 'HOLD');
  assert.equal(registered, 0);
  assert.equal(result.failure.code, 'PROMOTION_FAILED');
});

test('release transaction follows approval, promotion, target DB registration, index rebuild and smoke order', t => {
  const f = releaseFixture(t);
  const result = executeApprovedRelease({
    ...f,
    replaceExisting: true,
    dependencies: {
      promote: ({ candidateFile }) => { fs.copyFileSync(candidateFile, f.targetPath); return { status: 'PROMOTED', examId: 'target', candidateSha256: f.reviewReady.candidateSha256, liveJs: f.targetFile }; },
    },
  });
  assert.equal(result.status, 'DONE', JSON.stringify(result));
  assert.deepEqual(result.stages, ['REVIEW_READY', 'EXTERNAL_APPROVED', 'PROMOTE_APPROVED_EXAM', 'PROMOTION_PARITY_PASS', 'REGISTER_APPROVED_EXAM', 'DB_TARGET_PARITY_PASS', 'INDEX_REBUILD', 'INDEX_TARGET_PARITY_PASS', 'PRODUCTION_SMOKE_RENDER', 'DONE']);
  assert.equal(readArchiveDb(f.dbPath).mainDB.exams.length, 1);
  assert.equal(readQuestionIndex(f.indexPath).filter(row => row.sourceFile === f.targetFile).length, 1);
});

test('L: deleting a baseline solution visual is a hard regression', () => {
  const result = validateVisualBaselineNonRegression([{ id: 1, solutionImage: 'old.svg' }], [{ id: 1, solutionImage: '' }]);
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.some(error => error.startsWith('VISUAL_BASELINE_REGRESSION')));
});

test('M: GRAPH_BASED defaults to required visual', () => {
  const result = coreVisualGate({ id: 1, visualNeed: 'GRAPH_BASED', solution: '' });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('SOLUTION_VISUAL_MISSING'));
});

test('N: INEQUALITY_BASED defaults to required visual', () => {
  const result = coreVisualGate({ id: 1, visualNeed: 'INEQUALITY_BASED', solution: '' });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('SOLUTION_VISUAL_MISSING'));
});

test('O: GEOMETRY_BASED defaults to required visual', () => {
  const result = coreVisualGate({ id: 1, visualNeed: 'GEOMETRY_BASED', solution: '' });
  assert.equal(result.status, 'FAIL');
  assert.ok(result.errors.includes('SOLUTION_VISUAL_MISSING'));
});

test('P: a typed visual exemption with evidence is accepted', () => {
  const result = coreVisualGate({ id: 1, visualNeed: 'GRAPH_BASED', solution: '' }, { exemption: { status: 'APPROVED', reason: 'A bound source-independent evidence record proves the visual is not needed.', approvalEvidenceIdentity: 'review/q1/exemption', approvalEvidenceSha256: SHA } });
  assert.equal(result.status, 'PASS');
  assert.equal(result.exempted, true);
  const weak = coreVisualGate({ id: 2, visualNeed: 'GRAPH_BASED', solution: '' }, { exemption: { status: 'APPROVED', reason: 'source_has_no_figure', approvalEvidenceIdentity: 'review/q2/exemption', approvalEvidenceSha256: SHA } });
  assert.ok(weak.errors.includes('VISUAL_EXEMPTION_REASON_TOO_WEAK'));
});

test('Q: weak legacy attestation cannot authorize release', t => {
  const f = makeReady(t);
  const weak = { kind: 'APMATH_PAST_EXAM_PRODUCTION_CLOSURE_ATTESTATION_v1', status: 'PASS', productionAuthorized: true, examId: 'target' };
  const checked = validateExternalApproval({ root: f.root, reviewReady: f.ready, approval: weak, candidateRef: f.candidateRef, assetRefs: f.assetRefs });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('APPROVAL_RECEIPT_SCHEMA_INVALID'));
});
