import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

import { bytesSha, fileRef, objectSha } from '../../pipeline-core/canonical.mjs';
import { fileSha, objectFileSha, protectedPayloadSha } from '../lib/hardening.mjs';
import { nextWorkBatchAction } from '../../pipeline-core/defect-router.mjs';
import { assetSetSha, assertNoProductionWrite, assertProductionPayloadClean, assertStagingOutput, stripTransientProductionFields } from '../lib/production-boundary.mjs';
import { createReviewReady, validateDefaultVisualGate, validateReviewReady, validateVisualBaselineNonRegression } from '../lib/review-ready.mjs';
import { inferDefaultVisualNeed, validateDefaultVisualGate as coreVisualGate } from '../../pipeline-core/solution-visual-benefit.mjs';
import { assertProductionSmokeRender, validateExternalApproval, validateProductionSmokeRender } from '../lib/release-authority.mjs';
import { executeApprovedRelease } from '../release-approved-exam.mjs';
import { promoteApprovedExam, resolveApprovedAssetCopySources } from '../promote-reviewed-exam.mjs';
import { readArchiveDb, readQuestionIndex, registerApprovedExam, assertTargetOnlyDbDelta, assertTargetOnlyIndexDelta, rebuildApprovedIndex } from '../register-approved-exam.mjs';
import { attachCanonicalFinalAudit, makeCanonicalReleaseFixture, RELEASE_GATE_STATUSES, RELEASE_RENDER_CASES } from './release-authority-fixture.mjs';

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

const smokeBinding = { examId: 'target', productionJsSha256: 'sha256:' + 'b'.repeat(64), productionAssetSetSha256: 'sha256:' + 'c'.repeat(64), questionCount: 1, dbTarget: { file: 'target.js', qCount: 1, entrySha256: 'sha256:' + 'd'.repeat(64), dbFileSha256: 'sha256:' + 'e'.repeat(64) }, indexTarget: { sourceFile: 'target.js', qCount: 1, targetSha256: 'sha256:' + 'f'.repeat(64), indexFileSha256: 'sha256:' + '1'.repeat(64) } };

function smokeReport(binding = smokeBinding) {
  return { status: 'PASS', productionBinding: binding, cases: renderCases().map(row => ({ ...row, expectedQuestionCount: 1, observedQuestionCount: 1 })) };
}

function freshSmokeForBinding(binding) {
  return { status: 'PASS', releaseTransactionId: binding.releaseTransactionId, reviewReadyRunId: binding.reviewReadyRunId, smokeId: `smoke-${binding.releaseTransactionId}`, capturedAt: new Date().toISOString(), executedAt: new Date().toISOString(), browserWitness: { captureId: `browser-${binding.releaseTransactionId}`, actualBrowser: true, browserVersion: 'synthetic-test-browser' }, rendererRuntimeBinding: binding.rendererRuntimeBinding, productionBinding: { ...binding }, cases: renderCases().map(row => ({ ...row, expectedQuestionCount: 1, observedQuestionCount: 1 })) };
}

function promotionFor(f, target = f.targetFile) {
  const liveJs = `archive/exams/${target}`;
  const payload = { status: 'PROMOTED', productionAuthorized: false, examId: 'target', reviewReadyRunId: f.reviewReady.reviewReadyRunId, revision: f.reviewReady.revision, reviewReadySha: f.reviewReady.reviewReadySha, approvalSha256: objectSha(f.approval), targetFile: target, liveJs, liveJsSha256: bytesSha(fs.readFileSync(path.join(f.root, liveJs))), questionCount: 1, assetCount: f.assetRefs.length, candidateSha256: f.reviewReady.candidateSha256, assetSetSha256: assetSetSha(f.assetRefs), changedPaths: [liveJs] };
  return { ...payload, promotionSha256: objectSha(payload) };
}

async function makeReady(t, { withAsset = false } = {}) {
  const f = await makeCanonicalReleaseFixture(t, { examId: 'target', candidateOverrides: withAsset ? { solutionImage: 'assets/images/target/asset.svg' } : null, assetFiles: withAsset ? { 'assets/images/target/asset.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20"/></svg>' } : {} });
  const candidateContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(f.candidateFile, 'utf8'), candidateContext);
  return { ...f, candidatePath: f.candidateFile, candidateRef: f.candidateRef, assetPath: withAsset ? path.join(f.root, 'assets/images/target/asset.svg') : null, assetRefs: f.assetRefs, question: candidateContext.window.questionBank[0], ready: f.reviewReady, approval: f.approval };
}

async function releaseFixture(t) {
  const f = await makeReady(t);
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

async function fullPromotionFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-full-promotion-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const sourceDocumentSha256 = SHA;
  const sourceIdentityKey = `${sourceDocumentSha256}|1`;
  const question = {
    id: 1,
    content: '다음 문제의 조건을 이용하여 값을 구하여라.',
    choices: ['1', '2', '3', '4', '5'],
    answer: '1',
    solution: '조건을 정리하고 계산하면 정답은 1이다.',
    sourceDocumentSha256,
    sourceQuestionNo: '1',
    sourcePageNo: 1,
    sourcePageEvidencePaths: ['pages/page_p001.png'],
    sourceIdentityKey,
    sourceEvidencePath: 'pages/page_p001.png',
    image: 'assets/images/target/problem.svg',
    visualAsset: 'assets/images/target/problem.svg',
    hasVisualAsset: true,
    solutionImage: 'assets/images/target/solution.svg',
    visualAssetProvenance: {
      assetPath: 'assets/images/target/problem.svg',
      assetSha256: '',
      assetBindingType: 'DIRECT',
      sourceDocumentSha256,
      sourceQuestionNo: '1',
      sourcePageNo: 1,
      sourcePageEvidence: 'pages/page_p001.png',
      sourceBBox: { x1: 1, y1: 1, x2: 40, y2: 40 },
      cropGenerator: 'full-promotion-fixture',
      cropStatus: 'SEMANTIC_REVIEW_PASS',
      verdict: 'PASS',
      checks: {
        CROP_PURITY: true,
        NO_OTHER_QUESTION_TEXT: true,
        NO_CHOICES_CONTAMINATION: true,
        NO_PAGE_BORDER_CONTAMINATION: true,
        NO_CLIPPING: true,
        REQUIRED_LABELS_PRESENT: true,
        QUESTION_SEMANTIC_MATCH: true,
      },
    },
  };
  const candidateFile = write(root, 'staging/candidate/candidate.js', 'window.examTitle="target";window.questionBank=' + JSON.stringify([question]) + ';');
  const pageFile = write(root, 'staging/pages/page_p001.png', 'source-page');
  const problemFile = write(root, 'staging/assets/images/target/problem.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20"/></svg>');
  const solutionFile = write(root, 'staging/assets/images/target/solution.svg', '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8"/></svg>');
  question.visualAssetProvenance.assetSha256 = fileSha(problemFile);
  fs.writeFileSync(candidateFile, 'window.examTitle="target";window.questionBank=' + JSON.stringify([question]) + ';');
  const reportsDir = path.join(root, 'staging/reports');
  const inventory = { schema: 'PAST_EXAM_SOURCE_INVENTORY_v1', examId: 'target', sourceDocumentSha256, pageCount: 1, expectedQuestionCount: 1, status: 'SOURCE_INVENTORY_FROZEN', questions: [{ sourceIdentityKey, sourceDocumentSha256, sourceQuestionNo: '1', sourcePageNo: 1, sourceEvidencePath: 'pages/page_p001.png', sourcePageEvidencePaths: ['pages/page_p001.png'], disposition: 'INCLUDED' }] };
  write(root, 'staging/reports/source_inventory.json', inventory);
  write(root, 'staging/reports/source_identity_map.json', { schema: 'PAST_EXAM_SOURCE_IDENTITY_MAP_v1', status: 'SOURCE_INVENTORY_FROZEN', sourceInventorySha: fileSha(path.join(reportsDir, 'source_inventory.json')), questions: inventory.questions, includedIdentitySet: [sourceIdentityKey] });
  const pageSha = fileSha(pageFile);
  write(root, 'staging/reports/source_fidelity_evidence.json', { schema: 'PAST_EXAM_SOURCE_FIDELITY_EVIDENCE_v1', status: 'PASS', sourceInventorySha: fileSha(path.join(reportsDir, 'source_inventory.json')), sourceIdentityMapSha: fileSha(path.join(reportsDir, 'source_identity_map.json')), items: [{ sourceIdentityKey, sourceQuestionNo: '1', sourcePageNo: 1, sourcePageEvidencePaths: ['pages/page_p001.png'], sourcePageEvidence: [{ path: 'pages/page_p001.png', sha256: pageSha }], sourceEvidencePath: 'pages/page_p001.png', sourceEvidenceSha256: pageSha, contentChecked: true, choicesChecked: true, verdict: 'PASS', contentSha256: objectFileSha(question.content), choicesSha256: objectFileSha(question.choices) }] });
  write(root, 'staging/reports/math_review_evidence.json', { schema: 'PAST_EXAM_MATH_REVIEW_EVIDENCE_v1', status: 'PASS', sourceInventorySha: fileSha(path.join(reportsDir, 'source_inventory.json')), sourceIdentityMapSha: fileSha(path.join(reportsDir, 'source_identity_map.json')), items: [{ sourceIdentityKey, inputVisibilityProfile: 'SOURCE_ONLY', priorAnswerVisible: false, sourceOnlyBlindSolve: true, choiceUniqueness: true, questionValidity: true, solutionChecked: true, solutionConclusionMatches: true, independentAnswer: '1', verdict: 'PASS' }] });
  write(root, 'staging/reports/asset_provenance_evidence.json', { schema: 'PAST_EXAM_ASSET_PROVENANCE_EVIDENCE_v1', status: 'PASS', sourceInventorySha: fileSha(path.join(reportsDir, 'source_inventory.json')), sourceIdentityMapSha: fileSha(path.join(reportsDir, 'source_identity_map.json')), items: [{ sourceIdentityKey, ...question.visualAssetProvenance }] });
  const handoffFile = write(root, 'staging/reports/gpt_gemini_handoff_manifest.json', { protectedPayload: [{ sourceIdentityKey, sha256: protectedPayloadSha(question) }] });
  const review = { status: 'reviewed_pass', examId: 'target', questionCount: 1, candidateSha: fileSha(candidateFile), promotionTransactionId: 'full-promotion-fixture', sourceIdentitySet: [sourceIdentityKey], handoffManifestSha: fileSha(handoffFile), protectedPayload: [{ sourceIdentityKey, sha256: protectedPayloadSha(question) }], sourceInventorySha: fileSha(path.join(reportsDir, 'source_inventory.json')), sourceIdentityMapSha: fileSha(path.join(reportsDir, 'source_identity_map.json')), sourceFidelityEvidenceSha: fileSha(path.join(reportsDir, 'source_fidelity_evidence.json')), mathReviewEvidenceSha: fileSha(path.join(reportsDir, 'math_review_evidence.json')), assetProvenanceEvidenceSha: fileSha(path.join(reportsDir, 'asset_provenance_evidence.json')) };
  const reviewFile = write(root, 'staging/review.json', review);
  const candidateRef = fileRef(root, 'staging/candidate/candidate.js');
  const assetRefs = [fileRef(root, 'staging/assets/images/target/problem.svg'), fileRef(root, 'staging/assets/images/target/solution.svg')];
  const attached = await attachCanonicalFinalAudit(t, { root, examId: 'target', candidateFile, candidateQuestions: [question], assetRefs });
  const ready = attached.ready;
  assert.equal(ready.status, 'REVIEW_READY', JSON.stringify(ready.errors));
  const approval = { schemaVersion: 'APMATH_FINAL_EXTERNAL_APPROVAL_v1', approvalStatus: 'APPROVED', examId: 'target', reviewReadyRunId: ready.reviewReadyRunId, reviewReadySha: ready.reviewReadySha, candidateSha256: ready.candidateSha256, stagedAssetSetSha256: ready.stagedAssetSetSha256, finalClosureSha: ready.finalClosureSha, dbBaselineSha256: SHA, indexBaselineSha256: SHA, approvalEvidenceIdentity: 'external/full-promotion', approvalEvidenceSha256: SHA, approvedAt: '2026-09-13T00:00:00.000Z' };
  const alternateDir = path.join(root, 'staging/alternate-assets');
  write(root, 'staging/alternate-assets/problem.svg', '<svg xmlns="http://www.w3.org/2000/svg"><path d="B-problem"/></svg>');
  write(root, 'staging/alternate-assets/solution.svg', '<svg xmlns="http://www.w3.org/2000/svg"><path d="B-solution"/></svg>');
  const targetFile = 'original/high/h1/1final/target.js';
  return { root, question, candidateFile, reviewFile, reviewReady: ready, approval, assetsDir: alternateDir, targetFile, targetJs: path.join(root, 'archive/exams', targetFile), targetProblem: path.join(root, 'archive/assets/images/target/problem.svg'), targetSolution: path.join(root, 'archive/assets/images/target/solution.svg'), problemBytes: fs.readFileSync(problemFile), solutionBytes: fs.readFileSync(solutionFile) };
}

test('full promoteApprovedExam copies real problem and solution assets through the complete path', async t => {
  const f = await fullPromotionFixture(t);
  const result = promoteApprovedExam({ root: f.root, manifest: { examId: 'target', archiveRelativePath: f.targetFile }, candidateFile: f.candidateFile, reviewFile: f.reviewFile, reviewReady: f.reviewReady, approval: f.approval, assetsDir: f.assetsDir });
  assert.equal(result.status, 'PROMOTED', JSON.stringify(result));
  assert.equal(result.assetCount, 2);
  assert.deepEqual(fs.readFileSync(f.targetProblem), f.problemBytes);
  assert.deepEqual(fs.readFileSync(f.targetSolution), f.solutionBytes);
  assert.notDeepEqual(fs.readFileSync(f.targetProblem), fs.readFileSync(path.join(f.assetsDir, 'problem.svg')));
  assert.notDeepEqual(fs.readFileSync(f.targetSolution), fs.readFileSync(path.join(f.assetsDir, 'solution.svg')));
  assert.ok(fs.existsSync(f.targetJs));
});

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

test('B: promotion cannot start without an external approval receipt', async t => {
  const f = await releaseFixture(t);
  let promoted = 0;
  const result = executeApprovedRelease({ ...f, approval: null, dependencies: { promote: () => { promoted += 1; } } });
  assert.equal(result.status, 'HOLD');
  assert.equal(promoted, 0);
});

test('C: candidate bytes changed after approval are rejected', async t => {
  const f = await makeReady(t);
  fs.appendFileSync(f.candidatePath, '\n// changed after approval');
  const checked = validateExternalApproval({ root: f.root, reviewReady: f.ready, approval: f.approval, candidateRef: f.candidateRef, assetRefs: f.assetRefs });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('APPROVED_CANDIDATE_SHA_MISMATCH'));
});

test('D: asset bytes changed after approval are rejected', async t => {
  const f = await makeReady(t, { withAsset: true });
  fs.appendFileSync(f.assetPath, 'changed');
  const checked = validateExternalApproval({ root: f.root, reviewReady: f.ready, approval: f.approval, candidateRef: f.candidateRef, assetRefs: f.assetRefs });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('APPROVED_ASSET_SET_SHA_MISMATCH'));
});

test('P0: approved asset binding rejects an alternate same-basename source', async t => {
  const f = await makeReady(t, { withAsset: true });
  const alternatePath = write(f.root, 'staging/alternate/asset.svg', '<svg xmlns="http://www.w3.org/2000/svg"><path d="different"/></svg>');
  const alternateRef = fileRef(f.root, 'staging/alternate/asset.svg');
  assert.notEqual(alternateRef.sha256, f.ready.assetBindings[0].assetRef.sha256);
  const sourcePlan = resolveApprovedAssetCopySources({ repoRoot: f.root, manifest: { examId: 'target' }, candidate: { questionBank: [f.question] }, reviewReady: f.ready });
  assert.equal(sourcePlan.length, 1);
  assert.equal(sourcePlan[0].approvedRef.sha256, f.ready.assetBindings[0].assetRef.sha256);
  assert.notEqual(sourcePlan[0].source, alternatePath);
  const forged = {
    ...f.ready,
    assetBindings: [{ candidatePath: f.ready.assetBindings[0].candidatePath, assetRef: alternateRef }],
  };
  assert.throws(() => resolveApprovedAssetCopySources({ repoRoot: f.root, manifest: { examId: 'target' }, candidate: { questionBank: [f.question] }, reviewReady: forged }), /APPROVED_ASSET_COPY_SOURCE_MISMATCH/);
  const checked = validateReviewReady(forged, { root: f.root });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('REVIEW_READY_ASSET_BINDING_INVALID:' + f.ready.assetBindings[0].candidatePath));
  assert.ok(checked.errors.includes('REVIEW_READY_SHA_MISMATCH'));
  assert.equal(path.basename(alternatePath), path.basename(f.ready.assetBindings[0].assetRef.path));
});

test('P0: a REVIEW_READY asset ref changed after approval cannot pass exact SHA validation', async t => {
  const f = await makeReady(t, { withAsset: true });
  fs.appendFileSync(f.assetPath, 'changed-after-approval');
  const checked = validateReviewReady(f.ready, { root: f.root });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('REVIEW_READY_FILE_SHA_MISMATCH:assets/images/target/asset.svg'));
});

test('E: promotion allowlist rejects DB/index writes', () => {
  const root = repositoryRoot;
  assert.throws(() => assertNoProductionWrite(root, ['archive/db.js'], 'PROMOTE_APPROVED_EXAM'), /UNAUTHORIZED_PRODUCTION_WRITE/);
  const promotionSource = fs.readFileSync(path.resolve(root, 'archive/tools/past-exam-pipeline/promote-reviewed-exam.mjs'), 'utf8');
  assert.doesNotMatch(promotionSource, /archive[\\/]db\.js|question-index\.js/);
});

test('F: REGISTER_APPROVED_EXAM adds or updates only the explicitly named target', async t => {
  const f = await releaseFixture(t);
  const promotion = (() => { const payload = promotionFor(f); return { ...payload, liveJsSha256: bytesSha(fs.readFileSync(f.targetPath)), promotionSha256: objectSha(payload) }; })();
  const result = registerApprovedExam({ root: f.root, examId: 'target', targetFile: f.targetFile, dbEntry: f.dbEntry, dbPath: 'archive/db.js', expectedDbSha256: f.dbBaselineSha256, reviewReady: f.reviewReady, approval: f.approval, promotion });
  assert.equal(result.status, 'PASS');
  const entries = readArchiveDb(f.dbPath).mainDB.exams;
  assert.deepEqual(entries.map(entry => entry.file), [f.targetFile]);
});

test('G: an unregistered exam already on disk is not auto-registered', async t => {
  const f = await releaseFixture(t);
  const otherFile = 'original/high/h1/1final/other.js';
  write(f.root, 'archive/exams/' + otherFile, 'window.examTitle="other";window.questionBank=[];');
  registerApprovedExam({ root: f.root, examId: 'target', targetFile: f.targetFile, dbEntry: f.dbEntry, dbPath: 'archive/db.js', expectedDbSha256: f.dbBaselineSha256, reviewReady: f.reviewReady, approval: f.approval, promotion: promotionFor(f) });
  assert.equal(readArchiveDb(f.dbPath).mainDB.exams.some(entry => entry.file === otherFile), false);
});

test('H: unexpected DB semantic delta fails closed', () => {
  assert.throws(() => assertTargetOnlyDbDelta([{ file: 'other.js', qCount: 1 }], [{ file: 'other.js', qCount: 2 }], 'target.js'), /UNEXPECTED_DB_SCOPE_DELTA/);
});

test('I: unexpected index semantic delta fails closed', () => {
  assert.throws(() => assertTargetOnlyIndexDelta([{ qKey: 'other.js_1', sourceFile: 'other.js' }], [{ qKey: 'other.js_1', sourceFile: 'other.js', tags: ['changed'] }], 'target.js'), /UNEXPECTED_INDEX_SCOPE_DELTA/);
});

test('J: REVIEW_READY is required before registration', async t => {
  const f = await releaseFixture(t);
  assert.throws(() => registerApprovedExam({ root: f.root, examId: 'target', targetFile: f.targetFile, dbEntry: f.dbEntry, dbPath: 'archive/db.js', expectedDbSha256: f.dbBaselineSha256, reviewReady: f.reviewReady, approval: f.approval }), /REGISTER_BEFORE_PROMOTION_FORBIDDEN/);
  const blocked = { ...f.ready, status: 'BLOCKED', state: 'BLOCKED' };
  let registered = 0;
  const result = executeApprovedRelease({ ...f, reviewReady: blocked, dependencies: { register: () => { registered += 1; } } });
  assert.equal(result.status, 'HOLD');
  assert.equal(registered, 0);
});

test('K: promotion failure prevents registration', async t => {
  const f = await releaseFixture(t);
  let registered = 0;
  const result = executeApprovedRelease({ ...f, dependencies: { promote: () => { throw new Error('PROMOTION_FAILED'); }, register: () => { registered += 1; } } });
  assert.equal(result.status, 'HOLD');
  assert.equal(registered, 0);
  assert.equal(result.failure.code, 'PROMOTION_FAILED');
});

test('release transaction follows approval, promotion, target DB registration, index rebuild and smoke order', async t => {
  const f = await releaseFixture(t);
  const result = executeApprovedRelease({
      ...f,
      replaceExisting: true,
      dependencies: {
      promote: ({ candidateFile }) => { fs.copyFileSync(candidateFile, f.targetPath); return promotionFor(f); },
      smoke: (_report, _count, binding) => freshSmokeForBinding(binding),
      },
  });
  assert.equal(result.status, 'DONE', JSON.stringify(result));
  assert.deepEqual(result.stages, ['REVIEW_READY', 'EXTERNAL_APPROVED', 'PROMOTE_APPROVED_EXAM', 'PROMOTION_PARITY_PASS', 'REGISTER_APPROVED_EXAM', 'DB_TARGET_PARITY_PASS', 'INDEX_REBUILD', 'INDEX_TARGET_PARITY_PASS', 'PRODUCTION_SMOKE_RENDER', 'DONE']);
  assert.equal(readArchiveDb(f.dbPath).mainDB.exams.length, 1);
  assert.equal(readQuestionIndex(f.indexPath).filter(row => row.sourceFile === f.targetFile).length, 1);
});

test('stale pre-promotion smoke report is rejected', () => {
  const checked = validateProductionSmokeRender({ status: 'PASS', cases: smokeReport().cases }, 1, smokeBinding);
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('PRODUCTION_SMOKE_EXAM_ID_BINDING_FAIL'));
});

test('smoke report from an older production JS is rejected', () => {
  const checked = validateProductionSmokeRender(smokeReport({ ...smokeBinding, productionJsSha256: 'sha256:' + '0'.repeat(64) }), 1, smokeBinding);
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('PRODUCTION_SMOKE_JS_SHA_BINDING_FAIL'));
});

test('smoke report from changed production assets is rejected', () => {
  const checked = validateProductionSmokeRender(smokeReport({ ...smokeBinding, productionAssetSetSha256: 'sha256:' + '0'.repeat(64) }), 1, smokeBinding);
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('PRODUCTION_SMOKE_ASSET_SET_SHA_BINDING_FAIL'));
});

test('smoke report from changed DB or index target is rejected', () => {
  const changedDb = validateProductionSmokeRender(smokeReport({ ...smokeBinding, dbTarget: { ...smokeBinding.dbTarget, dbFileSha256: 'sha256:' + '0'.repeat(64) } }), 1, smokeBinding);
  const changedIndex = validateProductionSmokeRender(smokeReport({ ...smokeBinding, indexTarget: { ...smokeBinding.indexTarget, indexFileSha256: 'sha256:' + '0'.repeat(64) } }), 1, smokeBinding);
  assert.ok(changedDb.errors.includes('PRODUCTION_SMOKE_DB_TARGET_BINDING_FAIL'));
  assert.ok(changedIndex.errors.includes('PRODUCTION_SMOKE_INDEX_TARGET_BINDING_FAIL'));
});

test('smoke report bound to current production identity passes', () => {
  const binding = { ...smokeBinding, releaseTransactionId: 'release-current', reviewReadyRunId: 'run-current', rendererRuntimeBinding: { renderer: 'archive/engine.html', runtimeSha256: 'sha256:' + '9'.repeat(64) } };
  const checked = validateProductionSmokeRender(freshSmokeForBinding(binding), 1, { ...binding, indexCompletedAt: '2026-09-14T06:59:00.000Z' });
  assert.equal(checked.status, 'PASS', JSON.stringify(checked));
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

test('visual classifier does not require a visual for simple function, inverse, composition, interval, or coordinate substitution', () => {
  const simple = [
    { content: '함수 f(x)=2x+1의 값을 구하여라.', solution: '' },
    { content: '함수 f와 g의 합성함수 (f∘g)(1)을 구하여라.', solution: '' },
    { content: '역함수의 식을 구하여라.', solution: '' },
    { content: '구간 1<x<3에서 정수의 개수를 구하여라.', solution: '' },
    { content: '점 (1, 2)에 x=1, y=2를 대입하여 값을 구하여라.', solution: '' },
  ];
  for (const question of simple) {
    assert.equal(inferDefaultVisualNeed(question).required, false, JSON.stringify(question));
    assert.equal(coreVisualGate(question).status, 'PASS', JSON.stringify(question));
  }
});

test('semantic graph interpretation and geometry relation remain visual-required', () => {
  const graph = inferDefaultVisualNeed({ content: '함수 f(x)의 그래프를 그리고 x절편과 교점의 위치를 비교하여라.', solution: '' });
  assert.deepEqual(graph, { type: 'GRAPH_BASED', required: true, source: 'SEMANTIC_VISUAL_POLICY' });
  assert.equal(coreVisualGate({ content: '함수 f(x)의 그래프를 그리고 x절편과 교점의 위치를 비교하여라.', solution: '' }).status, 'FAIL');
  const geometry = inferDefaultVisualNeed({ content: '점과 직선 사이의 거리를 구하고 두 직선의 수직 관계를 판단하여라.', solution: '' });
  assert.deepEqual(geometry, { type: 'GEOMETRY_BASED', required: true, source: 'SEMANTIC_VISUAL_POLICY' });
});

test('NONE or OPTIONAL cannot bypass semantic visual requirement, while a typed exemption can', () => {
  const question = { visualNeed: 'NONE', content: '부등식의 해집합을 수직선에 나타내고 경계 포함 여부를 판단하여라.', solution: '' };
  assert.equal(inferDefaultVisualNeed(question).required, true);
  assert.equal(coreVisualGate(question).status, 'FAIL');
  assert.equal(coreVisualGate({ ...question, visualNeed: 'OPTIONAL' }).status, 'FAIL');
  const exempted = coreVisualGate(question, { exemption: { status: 'APPROVED', reason: '독립 검토 기록이 텍스트 풀이만으로 결정적 시각 정보를 손실하지 않음을 입증한다.', approvalEvidenceIdentity: 'review/q-visual/exemption', approvalEvidenceSha256: SHA } });
  assert.equal(exempted.status, 'PASS');
  assert.equal(exempted.exempted, true);
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

test('Q: weak legacy attestation cannot authorize release', async t => {
  const f = await makeReady(t);
  const weak = { kind: 'APMATH_PAST_EXAM_PRODUCTION_CLOSURE_ATTESTATION_v1', status: 'PASS', productionAuthorized: true, examId: 'target' };
  const checked = validateExternalApproval({ root: f.root, reviewReady: f.ready, approval: weak, candidateRef: f.candidateRef, assetRefs: f.assetRefs });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('APPROVAL_RECEIPT_SCHEMA_INVALID'));
});

test('external approval requires DB and index baselines in both schema and runtime', async t => {
  const f = await makeReady(t);
  const schema = JSON.parse(fs.readFileSync(path.resolve(repositoryRoot, 'archive/tools/past-exam-pipeline/contracts/external-approval-v1.schema.json'), 'utf8'));
  assert.ok(schema.required.includes('dbBaselineSha256'));
  assert.ok(schema.required.includes('indexBaselineSha256'));
  const incompleteApproval = { ...f.approval };
  delete incompleteApproval.dbBaselineSha256;
  delete incompleteApproval.indexBaselineSha256;
  const checked = validateExternalApproval({ root: f.root, reviewReady: f.ready, approval: incompleteApproval, candidateRef: f.candidateRef, assetRefs: f.assetRefs });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.includes('APPROVAL_DB_BASELINE_SHA_REQUIRED'));
  assert.ok(checked.errors.includes('APPROVAL_INDEX_BASELINE_SHA_REQUIRED'));
});
