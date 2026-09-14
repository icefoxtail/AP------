import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

import { bytesSha, fileRef, objectSha } from '../../pipeline-core/canonical.mjs';
import { createReleaseTransaction, validateCanonicalFinalAuditAuthority, validateProductionSmokeRender } from '../lib/release-authority.mjs';
import { assetSetSha } from '../lib/production-boundary.mjs';
import { createReviewReady } from '../lib/review-ready.mjs';
import { resumePastExam } from '../resume-past-exam.mjs';
import { recoveryFixture } from '../../pipeline-core/tests/recovery-fixture.mjs';
import { readWorkBatch } from '../../pipeline-core/work-batch.mjs';
import { runInputSha } from '../../pipeline-core/closure.mjs';
import { readArchiveDb, rebuildApprovedIndex, registerApprovedExam } from '../register-approved-exam.mjs';
import { executeApprovedRelease } from '../release-approved-exam.mjs';

const SMOKE_ENGINE = `<!doctype html><meta name="viewport" content="width=device-width"><style>body{margin:0}#print-area{width:100%;padding:8px;box-sizing:border-box}.q-box,.ans-n{display:block;min-height:32px;margin:8px 0;border:1px solid #ccc}</style><script>window.MathJax={startup:{promise:Promise.resolve()}};(async()=>{const params=new URLSearchParams(location.search);const response=await fetch('/archive/'+params.get('data'));const source=await response.text();const scope={};new Function('window',source)(scope);const root=document.createElement('main');root.id='print-area';for(const question of scope.questionBank||[]){const node=document.createElement(params.get('mode')==='ans'?'div':'section');node.className=params.get('mode')==='ans'?'ans-n':'q-box';node.dataset.sourceRef=String(question.id);node.textContent=question.content||String(question.id);root.append(node)}document.body.append(root)})()</script>`;
import { canonicalExamIdentity, sameCanonicalExamIdentity } from '../lib/exam-id.mjs';
import { existingExamPreflight } from '../lib/existing-exam.mjs';

function write(root, relative, value) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value)}\n`);
  return fileRef(root, relative);
}

const renderCases = ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile']
  .map(caseKey => ({ caseKey, status: 'PASS' }));

function canonicalClosureCases() {
  return renderCases.map(({ caseKey }) => ({ caseKey, captureEvidenceId: `capture:${caseKey}`, reviewEvidenceId: `review:${caseKey}` }));
}

const gateStatuses = {
  sourceFidelity: 'PASS',
  math: 'PASS',
  solutionQuality: 'PASS',
  visual: 'PASS',
  metadata: 'PASS',
  finalAudit: 'PASS',
  render: 'PASS',
};

test('status-only FINAL_AUDIT PASS cannot create REVIEW_READY', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-final-audit-authority-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const question = {
    id: 1,
    visualNeed: 'NONE',
    level: '중',
    category: '수와 식',
    standardCourse: '공통수학1',
    standardUnitKey: 'H22-C-01',
    standardUnit: '다항식의 연산',
    subUnitKey: 'H22-C-01-CORE',
    subUnit: '다항식의 연산 핵심 개념',
    subUnitConfidence: 'candidate_evidence',
    subUnitClassificationDepth: 'complete_candidate',
    questionType: '객관식',
    layoutTag: 'grid',
    tags: [],
    wide: false,
    content: 'x+1=2',
    choices: ['1', '2', '3', '4', '5'],
    answer: '1',
    solution: '양변에서 1을 빼면 x=1이다.',
    image: '',
    solutionImage: '',
  };
  const candidateRef = write(root, 'staging/candidate.js', `window.examTitle="target";window.questionBank=${JSON.stringify([question])};`);
  const finalClosureRef = write(root, 'staging/final-closure.json', { status: 'PASS', productionAuthorized: false });

  const ready = createReviewReady({
    root,
    run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId: 'target', runId: 'review-run', revision: 1 },
    closure: { status: 'PASS', productionAuthorized: false },
    finalAudit: { status: 'PASS' },
    candidateRef,
    assetRefs: [],
    candidateQuestions: [question],
    baselineQuestions: [],
    renderCases,
    gateStatuses,
    finalClosureRef,
    openDefectCount: 0,
  });

  assert.equal(ready.status, 'BLOCKED', JSON.stringify(ready));
  assert.ok(ready.errors.includes('FINAL_AUDIT_AUTHORITY_REQUIRED'), JSON.stringify(ready.errors));
});

test('a PASS-shaped authority without canonical persisted lineage is rejected', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-final-audit-authority-shape-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const payload = {
    schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1',
    status: 'PASS',
    examId: 'target',
    workBatchId: 'job',
    runId: 'run',
    revision: 1,
    inputSha: 'sha256:' + '1'.repeat(64),
    candidateSha256: 'sha256:' + '2'.repeat(64),
    assetSetSha256: 'sha256:' + '3'.repeat(64),
    launchId: 'job:1',
    phaseAttestationRefs: [{ phase: 'U1' }, { phase: 'U2' }, { phase: 'U3' }],
    finalAuditRef: { path: 'audit.json', bytes: 1, sha256: 'sha256:' + '4'.repeat(64) },
    canonicalClosureRef: { path: 'closure.json', bytes: 1, sha256: 'sha256:' + '5'.repeat(64) },
  };
  const checked = validateCanonicalFinalAuditAuthority(root, { authority: { ...payload, authoritySha: objectSha(payload) } });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.some(error => error.startsWith('FINAL_AUDIT_AUTHORITY_REF_')) || checked.errors.some(error => error.includes('WORK_BATCH')));
});

test('real-looking authority refs without a completed canonical launch are rejected', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-final-audit-authority-fake-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const workBatchRef = write(root, 'alive/runtime/work-batches/job/state.json', { status: 'PASS' });
  const runRef = write(root, 'run.json', { runId: 'run', revision: 1, inputSha: 'sha256:' + '1'.repeat(64) });
  const providerReceiptRef = write(root, 'receipt.json', { status: 'PASS' });
  const finalAuditRef = write(root, 'audit.json', { status: 'PASS' });
  const canonicalClosureRef = write(root, 'closure.json', { status: 'PASS', productionAuthorized: false });
  const payload = {
    schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1',
    status: 'PASS',
    examId: 'target',
    workBatchId: 'job',
    workBatchRef,
    runId: 'run',
    runRef,
    revision: 1,
    inputSha: 'sha256:' + '1'.repeat(64),
    candidateSha256: 'sha256:' + '2'.repeat(64),
    assetSetSha256: 'sha256:' + '3'.repeat(64),
    launchId: 'job:1',
    providerReceiptRef,
    phaseAttestationRefs: [
      { phase: 'U1', requestRef: providerReceiptRef, responseRef: providerReceiptRef },
      { phase: 'U2', requestRef: providerReceiptRef, responseRef: providerReceiptRef },
      { phase: 'U3', requestRef: providerReceiptRef, responseRef: providerReceiptRef },
    ],
    finalAuditRef,
    canonicalClosureRef,
  };
  const checked = validateCanonicalFinalAuditAuthority(root, { authority: { ...payload, authoritySha: objectSha(payload) }, expected: { examId: 'target', runId: 'run', revision: 1 } });
  assert.equal(checked.status, 'FAIL');
  assert.ok(checked.errors.length > 0, JSON.stringify(checked));
});

test('canonical FINAL_AUDIT authority binds work-batch, phase evidence, audit report, and closure', async t => {
  const fixture = recoveryFixture(t, { pipeline: 'past-exam' });
  const initial = fixture.makeRun(1);
  const closurePayload = {
    schemaVersion: 'APMATH_EXAM_RELEASE_CLOSURE_v1',
    runId: initial.run.runId,
    revision: initial.run.revision,
    applicability: 'REQUIRED',
    qualityClosureSetSha: null,
    questionUids: ['recovery|1'],
    questionUidSetSha: objectSha(['recovery|1']),
    candidateRefs: [initial.run.inputs.find(ref => ref.role === 'candidate')],
    assetRefs: [],
    runtimeBundleSha: null,
    requiredCases: ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'],
    cases: canonicalClosureCases(),
    actualCases: renderCases.map(row => row.caseKey),
    currentRunInputSha: initial.run.inputSha,
    productionAuthorized: false,
    status: 'PASS',
  };
  const closure = { ...closurePayload, closureSha: objectSha(closurePayload) };
  const closureRef = fixture.write('closure/exam-release.json', closure);
  const run = { ...initial.run, examReleaseClosureRef: closureRef };
  run.inputSha = runInputSha(run);
  const runRef = fixture.write('run-authority.json', run);
  const provider = fixture.write('provider-authority.mjs', `
import fs from 'node:fs';
const request = JSON.parse(fs.readFileSync(0, 'utf8'));
const runInputSha = ${JSON.stringify(run.inputSha)};
if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
  process.stdout.write(JSON.stringify({
    schemaVersion: request.schemaVersion,
    operation: request.operation,
    status: 'READY',
    requestSha: request.requestSha,
    provider: 'synthetic-authority-provider',
    model: 'synthetic-authority-model',
    externalTaskId: 'external-' + request.launchId,
    auditorId: 'auditor-' + request.launchId,
    auditorSessionId: 'auditor-session-' + request.launchId,
    contextIsolation: 'STATELESS_INPUTS',
    subagentToolsEnabled: false,
    modelInvocationCount: 0,
    runtimeAttestation: 'synthetic-authority-runtime',
    contexts: {
      U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' },
      U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' },
      U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' }
    }
  }));
} else {
  const item = Array.isArray(request.packet.payload) ? request.packet.payload[0] : request.packet.payload;
  const axis = { U1: 'SOURCE', U2: 'V2', U3: 'MATH_A2' }[request.phase];
  const evidence = {
    schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2',
    evidenceId: request.logicalLaunchId + '-' + request.phase + '-evidence',
    runId: 'run',
    revision: 1,
    questionUid: item.questionUid,
    axis,
    inputSha: runInputSha,
    axisInputSha: 'sha256:' + 'a'.repeat(64),
    mode: 'FRESH',
    status: 'PASS',
    validityStatus: 'FROZEN',
    reviewerId: 'auditor-' + request.logicalLaunchId,
    reviewSessionId: request.packet.auditorSessionId,
    reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY',
    auditorPrincipalType: 'STATELESS_MODEL',
    startedAt: '2026-09-14T06:00:00.000Z',
    frozenAt: '2026-09-14T06:01:00.000Z',
    priorReviewVisibility: 'NONE',
    inputVisibilityProfile: request.packet.inputVisibilityProfile,
    findings: [],
    reviewIsolationProvenanceSha: request.packet.packetSha,
    launchId: request.logicalLaunchId,
    externalTaskId: request.externalTaskId,
    reviewStartInputSha: runInputSha,
    reviewEndInputSha: runInputSha,
    withdrawalStatus: 'ACTIVE',
    revocationStatus: 'NOT_REVOKED',
    supersessionStatus: 'VALID',
    sourceAuthorityStatus: 'VALID',
    eligibilityStatus: 'ELIGIBLE',
    payload: { independentAnswer: '1' }
  };
  process.stdout.write(JSON.stringify({
    schemaVersion: request.schemaVersion,
    operation: request.operation,
    status: 'COMPLETED',
    inputSha: request.inputSha,
    packetSha: request.packet.packetSha,
    externalTaskId: request.externalTaskId,
    phase: request.phase,
    sessionId: request.packet.auditorSessionId,
    contextId: request.packet.contextId,
    providerInvocationId: request.logicalLaunchId + '-' + request.phase,
    inputVisibilityProfile: request.packet.inputVisibilityProfile,
    priorReviewVisibility: request.packet.priorReviewVisibility,
    subagentToolsEnabled: false,
    usedTokens: 0,
    evidence: [evidence],
    defects: []
  }));
}
`);
  const resumed = await resumePastExam(fixture.root, {
    workBatchId: 'job',
    runRefs: [runRef],
    providerCommand: process.execPath,
    providerArgs: [path.join(fixture.root, provider.path)],
    maxSteps: 6,
  });
  assert.equal(resumed.state.status, 'FROZEN', JSON.stringify(resumed));
  const state = readWorkBatch(fixture.root, 'job');
  const freeze = state.freezes.at(-1);
  const launch = state.launches.find(item => item.purpose === 'FINAL_AUDIT' && item.status === 'COMPLETED');
  assert.ok(launch, JSON.stringify(state.launches));
  const receipt = JSON.parse(fs.readFileSync(path.join(fixture.root, launch.providerReceiptRef.path), 'utf8'));
  const freshness = freeze.bindings.flatMap(binding => (binding.questions || []).flatMap(question => Object.entries(binding.axisInputShas[question.questionUid] || {}).map(([axis, axisInputSha]) => ({ questionUid: question.questionUid, axis, axisInputSha, status: 'PASS', mode: 'FRESH', evidenceId: `${question.questionUid}:${axis}`, evidenceSha: objectSha([question.questionUid, axis]), receiptSha: null }))));
  const finalAudit = { schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', workBatchId: 'job', runId: run.runId, revision: run.revision, inputSha: run.inputSha, status: 'PASS', productionAuthorized: false, freshness };
  const finalAuditRef = fixture.write('audit/final.json', finalAudit);
  const phaseEvidenceRefs = ['U1', 'U2', 'U3'].map(phase => ({ phase, evidenceRefs: receipt.evidenceRefs.filter(ref => {
    const evidence = JSON.parse(fs.readFileSync(path.join(fixture.root, ref.path), 'utf8'));
    return ({ SOURCE: 'U1', MATH_A1: 'U1', V1: 'U1', V2: 'U2', MATH_A2: 'U3', SOLUTION: 'U3', V3: 'U3' }[evidence.axis]) === phase;
  }) }));
  const authorityPayload = {
    schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1',
    status: 'PASS',
    examId: 'recovery',
    workBatchId: 'job',
    workBatchRef: fileRef(fixture.root, 'alive/runtime/work-batches/job/state.json'),
    runId: run.runId,
    runRef,
    freezeSha: freeze.freezeSha,
    revision: run.revision,
    inputSha: run.inputSha,
    candidateRef: run.inputs.find(ref => ref.role === 'candidate'),
    candidateSha256: run.inputs.find(ref => ref.role === 'candidate').sha256,
    assetRefs: [],
    assetSetSha256: assetSetSha([]),
    launchId: launch.launchId,
    providerReceiptRef: launch.providerReceiptRef,
    phaseAttestationRefs: receipt.phaseAttestationRefs,
    phaseEvidenceRefs,
    finalAuditRef,
    canonicalClosureRef: closureRef,
  };
  const authority = { ...authorityPayload, authoritySha: objectSha(authorityPayload) };
  const checked = validateCanonicalFinalAuditAuthority(fixture.root, { authority, expected: { examId: 'recovery', runId: run.runId, revision: run.revision, candidateSha256: authority.candidateSha256, assetSetSha256: authority.assetSetSha256 } });
  assert.equal(checked.status, 'PASS', JSON.stringify(checked));

  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(fixture.root, 'candidate-1.js'), 'utf8'), context);
  const ready = createReviewReady({
    root: fixture.root,
    run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId: 'recovery', runId: run.runId, revision: run.revision },
    closure,
    finalAudit,
    finalAuditAuthority: authority,
    candidateRef: authority.candidateRef,
    assetRefs: [],
    candidateQuestions: context.window.questionBank,
    baselineQuestions: [],
    renderCases,
    gateStatuses,
    finalClosureRef: closureRef,
    openDefectCount: 0,
  });
  assert.equal(ready.status, 'REVIEW_READY', JSON.stringify(ready));
});

function smokeCases() {
  return ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile']
    .map(caseKey => ({ caseKey, status: 'PASS', expectedQuestionCount: 1, observedQuestionCount: 1 }));
}

function oldSmokeBinding() {
  return {
    examId: 'target',
    productionJsSha256: 'sha256:' + 'b'.repeat(64),
    productionAssetSetSha256: 'sha256:' + 'c'.repeat(64),
    questionCount: 1,
    dbTarget: { file: 'target.js', qCount: 1, entrySha256: 'sha256:' + 'd'.repeat(64), dbFileSha256: 'sha256:' + 'e'.repeat(64) },
    indexTarget: { sourceFile: 'target.js', qCount: 1, targetSha256: 'sha256:' + 'f'.repeat(64), indexFileSha256: 'sha256:' + '1'.repeat(64) },
  };
}

test('six PASS smoke cases without a fresh browser witness are rejected', () => {
  const binding = oldSmokeBinding();
  const checked = validateProductionSmokeRender({ status: 'PASS', productionBinding: binding, cases: smokeCases() }, 1, binding);
  assert.equal(checked.status, 'FAIL', JSON.stringify(checked));
  assert.ok(checked.errors.some(error => error.includes('BROWSER') || error.includes('TIMESTAMP') || error.includes('RELEASE')));
});

test('a smoke receipt from release A cannot be replayed for release B', () => {
  const binding = oldSmokeBinding();
  const report = {
    status: 'PASS',
    releaseTransactionId: 'release-a',
    reviewReadyRunId: 'run-a',
    capturedAt: '2026-09-14T07:00:00.000Z',
    executedAt: '2026-09-14T07:00:00.000Z',
    browserWitness: { captureId: 'capture-a', actualBrowser: true, browserVersion: 'synthetic' },
    productionBinding: binding,
    cases: smokeCases(),
  };
  const checked = validateProductionSmokeRender(report, 1, { ...binding, releaseTransactionId: 'release-b', reviewReadyRunId: 'run-b', indexCompletedAt: '2026-09-14T06:59:00.000Z' });
  assert.equal(checked.status, 'FAIL', JSON.stringify(checked));
  assert.ok(checked.errors.some(error => error.includes('RELEASE') || error.includes('RUN') || error.includes('REPLAY')));
});

test('a smoke captured before index completion is rejected', () => {
  const binding = oldSmokeBinding();
  const report = {
    status: 'PASS',
    releaseTransactionId: 'release-a',
    reviewReadyRunId: 'run-a',
    capturedAt: '2026-09-14T06:00:00.000Z',
    executedAt: '2026-09-14T06:00:00.000Z',
    browserWitness: { captureId: 'capture-a', actualBrowser: true, browserVersion: 'synthetic' },
    productionBinding: binding,
    cases: smokeCases(),
  };
  const checked = validateProductionSmokeRender(report, 1, { ...binding, releaseTransactionId: 'release-a', reviewReadyRunId: 'run-a', indexCompletedAt: '2026-09-14T06:30:00.000Z' });
  assert.equal(checked.status, 'FAIL', JSON.stringify(checked));
  assert.ok(checked.errors.some(error => error.includes('TIME') || error.includes('FRESH')));
});

test('fresh production smoke with browser, renderer, and release bindings passes', () => {
  const base = oldSmokeBinding();
  const rendererRuntimeBinding = { renderer: 'pipeline-core/render.mjs', runtimeSha256: 'sha256:' + '9'.repeat(64) };
  const binding = { ...base, releaseTransactionId: 'release-a', reviewReadyRunId: 'run-a', rendererRuntimeBinding };
  const report = {
    status: 'PASS',
    releaseTransactionId: 'release-a',
    reviewReadyRunId: 'run-a',
    smokeId: 'smoke-a',
    capturedAt: '2026-09-14T07:00:00.000Z',
    executedAt: '2026-09-14T07:00:00.000Z',
    browserWitness: { captureId: 'capture-a', actualBrowser: true, browserVersion: 'synthetic' },
    rendererRuntimeBinding,
    productionBinding: { ...binding },
    cases: smokeCases(),
  };
  const checked = validateProductionSmokeRender(report, 1, { ...binding, reviewReadyRunId: 'run-a', indexCompletedAt: '2026-09-14T06:59:00.000Z' });
  assert.equal(checked.status, 'PASS', JSON.stringify(checked));
});

function registrationFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-registration-lineage-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const question = { id: 1, content: 'x+1=2', choices: ['1', '2'], answer: '1', solution: 'x=1이다.' };
  const targetA = 'original/high/h1/1final/exam-a.js';
  const targetB = 'original/high/h1/1final/exam-b.js';
  const candidateRef = write(root, 'staging/exam-a.js', `window.examTitle="exam-a";window.questionBank=${JSON.stringify([question])};`);
  write(root, `archive/exams/${targetA}`, `window.examTitle="exam-a";window.questionBank=${JSON.stringify([question])};`);
  write(root, `archive/exams/${targetB}`, `window.examTitle="exam-b";window.questionBank=${JSON.stringify([question])};`);
  write(root, 'archive/db.js', 'window.mainDB=' + JSON.stringify({ exams: [] }) + ';');
  write(root, 'archive/question-index.js', 'window.questionIndex=[];');
  const reviewReady = {
    schemaVersion: 'APMATH_REVIEW_READY_v1',
    examId: 'exam-a',
    reviewReadyRunId: 'review-run-a',
    revision: 1,
    reviewReadySha: 'sha256:' + 'a'.repeat(64),
    candidateRef,
    candidateSha256: candidateRef.sha256,
    assetRefs: [],
    stagedAssetSetSha256: assetSetSha([]),
    finalClosureSha: 'sha256:' + 'b'.repeat(64),
  };
  const approval = {
    schemaVersion: 'APMATH_FINAL_EXTERNAL_APPROVAL_v1',
    approvalStatus: 'APPROVED',
    examId: 'exam-a',
    reviewReadyRunId: reviewReady.reviewReadyRunId,
    reviewReadySha: reviewReady.reviewReadySha,
    candidateSha256: reviewReady.candidateSha256,
    stagedAssetSetSha256: reviewReady.stagedAssetSetSha256,
    finalClosureSha: reviewReady.finalClosureSha,
    dbBaselineSha256: bytesSha(fs.readFileSync(path.join(root, 'archive/db.js'))),
    indexBaselineSha256: bytesSha(fs.readFileSync(path.join(root, 'archive/question-index.js'))),
    approvalEvidenceIdentity: 'test/exam-a/approval',
    approvalEvidenceSha256: 'sha256:' + 'c'.repeat(64),
    approvedAt: '2026-09-14T07:00:00.000Z',
  };
  return { root, targetA, targetB, candidateRef, reviewReady, approval, dbPath: path.join(root, 'archive/db.js'), indexPath: path.join(root, 'archive/question-index.js'), dbEntry: { file: targetA, examId: 'exam-a', school: '테스트고', grade: '고1', year: 2026, semester: '1', examType: 'final', subject: '공통수학1', contentType: '기출', qCount: 1 } };
}

function promotionFor(f, target = f.targetA) {
  const liveJs = `archive/exams/${target}`;
  const payload = {
    status: 'PROMOTED',
    productionAuthorized: false,
    examId: 'exam-a',
    reviewReadyRunId: f.reviewReady.reviewReadyRunId,
    revision: f.reviewReady.revision,
    reviewReadySha: f.reviewReady.reviewReadySha,
    approvalSha256: objectSha(f.approval),
    targetFile: target,
    liveJs,
    liveJsSha256: bytesSha(fs.readFileSync(path.join(f.root, liveJs))),
    candidateSha256: f.reviewReady.candidateSha256,
    assetSetSha256: assetSetSha([]),
  };
  return { ...payload, promotionSha256: objectSha(payload) };
}

test('approval and promotion for exam A cannot register exam B target', t => {
  const f = registrationFixture(t);
  const dbBaselineSha256 = bytesSha(fs.readFileSync(f.dbPath));
  assert.throws(() => registerApprovedExam({
    root: f.root,
    examId: 'exam-a',
    targetFile: f.targetB,
    dbEntry: { ...f.dbEntry, file: f.targetB },
    dbPath: 'archive/db.js',
    expectedDbSha256: dbBaselineSha256,
    reviewReady: f.reviewReady,
    approval: f.approval,
    promotion: promotionFor(f, f.targetA),
  }), /PROMOTION|TARGET|LINEAGE/);
});

test('registration receipt for exam A cannot rebuild exam B index target', t => {
  const f = registrationFixture(t);
  const dbBaselineSha256 = bytesSha(fs.readFileSync(f.dbPath));
  const registration = registerApprovedExam({
    root: f.root,
    examId: 'exam-a',
    targetFile: f.targetA,
    dbEntry: f.dbEntry,
    dbPath: 'archive/db.js',
    expectedDbSha256: dbBaselineSha256,
    reviewReady: f.reviewReady,
    approval: f.approval,
    promotion: promotionFor(f, f.targetA),
  });
  assert.throws(() => rebuildApprovedIndex({
    root: f.root,
    examId: 'exam-a',
    targetFile: f.targetB,
    dbEntry: { ...f.dbEntry, file: f.targetB },
    indexPath: 'archive/question-index.js',
    expectedIndexSha256: bytesSha(fs.readFileSync(f.indexPath)),
    registration,
  }), /REGISTRATION|TARGET|LINEAGE/);
});

test('index rebuild rejects a registration receipt after DB bytes change', t => {
  const f = registrationFixture(t);
  const dbBaselineSha256 = bytesSha(fs.readFileSync(f.dbPath));
  const registration = registerApprovedExam({
    root: f.root,
    examId: 'exam-a',
    targetFile: f.targetA,
    dbEntry: f.dbEntry,
    dbPath: 'archive/db.js',
    expectedDbSha256: dbBaselineSha256,
    reviewReady: f.reviewReady,
    approval: f.approval,
    promotion: promotionFor(f, f.targetA),
  });
  fs.appendFileSync(f.dbPath, '\n');
  assert.throws(() => rebuildApprovedIndex({
    root: f.root,
    examId: 'exam-a',
    targetFile: f.targetA,
    dbEntry: f.dbEntry,
    indexPath: 'archive/question-index.js',
    expectedIndexSha256: bytesSha(fs.readFileSync(f.indexPath)),
    registration,
  }), /DB|REGISTRATION|SHA/);
  assert.equal(readArchiveDb(f.dbPath).mainDB.exams.length, 1);
});

test('index rebuild rejects a registration receipt after target production bytes change', t => {
  const f = registrationFixture(t);
  const dbBaselineSha256 = bytesSha(fs.readFileSync(f.dbPath));
  const registration = registerApprovedExam({
    root: f.root,
    examId: 'exam-a',
    targetFile: f.targetA,
    dbEntry: f.dbEntry,
    dbPath: 'archive/db.js',
    expectedDbSha256: dbBaselineSha256,
    reviewReady: f.reviewReady,
    approval: f.approval,
    promotion: promotionFor(f, f.targetA),
  });
  fs.appendFileSync(path.join(f.root, 'archive/exams', f.targetA), '\n// concurrent target writer');
  assert.throws(() => rebuildApprovedIndex({
    root: f.root,
    examId: 'exam-a',
    targetFile: f.targetA,
    dbEntry: f.dbEntry,
    indexPath: 'archive/question-index.js',
    expectedIndexSha256: bytesSha(fs.readFileSync(f.indexPath)),
    registration,
  }), /TARGET_PRODUCTION|SHA|REGISTRATION/);
});

test('canonical exam identity includes normalized course and keeps different courses distinct', () => {
  assert.equal(sameCanonicalExamIdentity(
    { year: 2025, schoolName: '강남여고', grade: '고2', semester: '2', examType: 'final', course: '수학II' },
    { year: '25', school: '강남 여고', grade: '고2', semester: '2학기', examType: '기말', course: '수2' },
  ), true);
  assert.equal(sameCanonicalExamIdentity(
    { year: 2025, schoolName: '강남여고', grade: '고2', semester: '2', examType: 'final', course: '수학II' },
    { year: 2025, schoolName: '강남여고', grade: '고2', semester: '2', examType: 'final', course: '확률과 통계' },
  ), false);
  assert.equal(canonicalExamIdentity({ year: 2025, schoolName: '강남여고', grade: '고2', semester: '2', examType: 'final', course: '확통' }).course, '확률과통계');
});

test('course-incomplete existing-exam identity is HOLD, not NEW_EXAM', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-course-incomplete-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const result = existingExamPreflight({ archiveRoot: root, examIdentity: { year: 2025, schoolName: '강남여고', grade: '고2', semester: '2', examType: 'final' } });
  assert.equal(result.status, 'HOLD_EXISTING_EXAM_IDENTITY_INCOMPLETE', JSON.stringify(result));
  assert.ok(result.missingIdentityFields.includes('course'));
});

test('same non-course conditions with existing math II do not skip a new probability-statistics exam', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-course-collision-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const existingFile = 'original/high/h2/2final/25_강남여고_2학기_기말_고2_수학II.js';
  write(root, `archive/exams/${existingFile}`, 'window.examTitle="math2";window.questionBank=[{id:1,content:"x",choices:[],answer:"1",solution:"x"}];');
  const result = existingExamPreflight({
    archiveRoot: path.join(root, 'archive'),
    examIdentity: { year: 2025, schoolName: '강남여고', grade: '고2', semester: '2', examType: 'final', course: '확률과통계' },
    dbEntries: [{ file: existingFile, examId: 'math2', school: '강남여고', grade: '고2', year: 2025, semester: '2', examType: 'final', subject: '수학II', qCount: 1 }],
  });
  assert.notEqual(result.status, 'SKIP_EXISTING_EXAM', JSON.stringify(result));
});

test('multiple exact production candidates produce an ambiguity HOLD instead of first-match skip', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-course-ambiguous-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const first = 'original/high/h2/2final/25_강남여고_2학기_기말_고2_확률과통계.js';
  const second = 'original/high/h2/2final/25_강남여고_2학기_기말_고2_확통.js';
  const source = 'window.examTitle="probability";window.questionBank=[{id:1,content:"x",choices:[],answer:"1",solution:"x"}];';
  write(root, `archive/exams/${first}`, source);
  write(root, `archive/exams/${second}`, source);
  const result = existingExamPreflight({ archiveRoot: path.join(root, 'archive'), examIdentity: { year: 2025, schoolName: '강남여고', grade: '고2', semester: '2', examType: 'final', course: '확률과통계' } });
  assert.equal(result.status, 'HOLD_EXISTING_EXAM_AMBIGUOUS', JSON.stringify(result));
});

test('release HOLD receipt carries a transaction identity, baselines, and mutation recovery state', () => {
  const transaction = createReleaseTransaction({
    transactionId: 'release-test-1',
    reviewReady: { examId: 'exam-a', reviewReadyRunId: 'run-a', reviewReadySha: 'sha256:' + 'a'.repeat(64) },
    approval: { approvalStatus: 'APPROVED' },
    stages: ['REVIEW_READY', 'EXTERNAL_APPROVED', 'PROMOTE_APPROVED_EXAM'],
    status: 'HOLD',
    baseline: { production: { path: 'archive/exams/a.js', exists: false, sha256: null }, dbSha256: 'sha256:' + 'b'.repeat(64), indexSha256: 'sha256:' + 'c'.repeat(64) },
    mutations: [{ stage: 'PROMOTE_APPROVED_EXAM', target: 'archive/exams/a.js', before: { exists: false }, after: { exists: true, sha256: 'sha256:' + 'd'.repeat(64) } }],
    recovery: { resumeFrom: 'REGISTER_APPROVED_EXAM', reason: 'DB_WRITE_FAILED' },
  });
  assert.equal(transaction.transactionId, 'release-test-1');
  assert.ok(transaction.baseline);
  assert.equal(transaction.mutations.length, 1);
  assert.equal(transaction.recovery.resumeFrom, 'REGISTER_APPROVED_EXAM');
  assert.equal(transaction.productionAuthorized, false);
  assert.ok(transaction.transactionSha);
});

async function releaseFixtureWithAuthority(t) {
  const fixture = recoveryFixture(t, { pipeline: 'past-exam' });
  const initial = fixture.makeRun(1);
  const closurePayload = {
    schemaVersion: 'APMATH_EXAM_RELEASE_CLOSURE_v1',
    runId: initial.run.runId,
    revision: initial.run.revision,
    applicability: 'REQUIRED',
    qualityClosureSetSha: null,
    questionUids: ['recovery|1'],
    questionUidSetSha: objectSha(['recovery|1']),
    candidateRefs: [initial.run.inputs.find(ref => ref.role === 'candidate')],
    assetRefs: [],
    runtimeBundleSha: null,
    requiredCases: ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'],
    cases: canonicalClosureCases(),
    actualCases: renderCases.map(row => row.caseKey),
    currentRunInputSha: initial.run.inputSha,
    productionAuthorized: false,
    status: 'PASS',
  };
  const closure = { ...closurePayload, closureSha: objectSha(closurePayload) };
  const closureRef = fixture.write('release/closure.json', closure);
  const run = { ...initial.run, examReleaseClosureRef: closureRef };
  run.inputSha = runInputSha(run);
  const runRef = fixture.write('release/run.json', run);
  const provider = fixture.write('release/provider.mjs', `
import fs from 'node:fs';
const request = JSON.parse(fs.readFileSync(0, 'utf8'));
const runInputSha = ${JSON.stringify(run.inputSha)};
if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
  process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic-release-provider', model: 'synthetic-release-model', externalTaskId: 'external-' + request.launchId, auditorId: 'auditor-' + request.launchId, auditorSessionId: 'auditor-session-' + request.launchId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic-release-runtime', contexts: { U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' }, U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' }, U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' } } }));
} else {
  const item = Array.isArray(request.packet.payload) ? request.packet.payload[0] : request.packet.payload;
  const axis = { U1: 'SOURCE', U2: 'V2', U3: 'MATH_A2' }[request.phase];
  const evidence = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: request.logicalLaunchId + '-' + request.phase + '-evidence', runId: 'run', revision: 1, questionUid: item.questionUid, axis, inputSha: runInputSha, axisInputSha: 'sha256:' + 'a'.repeat(64), mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'auditor-' + request.logicalLaunchId, reviewSessionId: request.packet.auditorSessionId, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-14T06:00:00.000Z', frozenAt: '2026-09-14T06:01:00.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: request.packet.inputVisibilityProfile, findings: [], reviewIsolationProvenanceSha: request.packet.packetSha, launchId: request.logicalLaunchId, externalTaskId: request.externalTaskId, reviewStartInputSha: runInputSha, reviewEndInputSha: runInputSha, withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', payload: { independentAnswer: '1' } };
  process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: request.externalTaskId, phase: request.phase, sessionId: request.packet.auditorSessionId, contextId: request.packet.contextId, providerInvocationId: request.logicalLaunchId + '-' + request.phase, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 0, evidence: [evidence], defects: [] }));
}
`);
  await resumePastExam(fixture.root, { workBatchId: 'job', runRefs: [runRef], providerCommand: process.execPath, providerArgs: [path.join(fixture.root, provider.path)], maxSteps: 6 });
  const state = readWorkBatch(fixture.root, 'job');
  const freeze = state.freezes.at(-1);
  const launch = state.launches.find(item => item.purpose === 'FINAL_AUDIT' && item.status === 'COMPLETED');
  const receipt = JSON.parse(fs.readFileSync(path.join(fixture.root, launch.providerReceiptRef.path), 'utf8'));
  const freshness = freeze.bindings.flatMap(binding => (binding.questions || []).flatMap(question => Object.entries(binding.axisInputShas[question.questionUid] || {}).map(([axis, axisInputSha]) => ({ questionUid: question.questionUid, axis, axisInputSha, status: 'PASS', mode: 'FRESH', evidenceId: `${question.questionUid}:${axis}`, evidenceSha: objectSha([question.questionUid, axis]), receiptSha: null }))));
  const finalAudit = { schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', workBatchId: 'job', runId: run.runId, revision: run.revision, inputSha: run.inputSha, status: 'PASS', productionAuthorized: false, freshness };
  const finalAuditRef = fixture.write('release/final-audit.json', finalAudit);
  const phaseForAxis = { SOURCE: 'U1', MATH_A1: 'U1', V1: 'U1', V2: 'U2', MATH_A2: 'U3', SOLUTION: 'U3', V3: 'U3' };
  const phaseEvidenceRefs = ['U1', 'U2', 'U3'].map(phase => ({ phase, evidenceRefs: receipt.evidenceRefs.filter(ref => phaseForAxis[JSON.parse(fs.readFileSync(path.join(fixture.root, ref.path), 'utf8')).axis] === phase) }));
  const candidateRef = run.inputs.find(ref => ref.role === 'candidate');
  const authorityPayload = { schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1', status: 'PASS', examId: 'recovery', workBatchId: 'job', workBatchRef: fileRef(fixture.root, 'alive/runtime/work-batches/job/state.json'), runId: run.runId, runRef, freezeSha: freeze.freezeSha, revision: run.revision, inputSha: run.inputSha, candidateRef, candidateSha256: candidateRef.sha256, assetRefs: [], assetSetSha256: assetSetSha([]), launchId: launch.launchId, providerReceiptRef: launch.providerReceiptRef, phaseAttestationRefs: receipt.phaseAttestationRefs, phaseEvidenceRefs, finalAuditRef, canonicalClosureRef: closureRef };
  const authority = { ...authorityPayload, authoritySha: objectSha(authorityPayload) };
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(fixture.root, candidateRef.path), 'utf8'), context);
  const ready = createReviewReady({ root: fixture.root, run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId: 'recovery', runId: run.runId, revision: run.revision }, closure, finalAudit, finalAuditAuthority: authority, candidateRef, assetRefs: [], candidateQuestions: context.window.questionBank, baselineQuestions: [], renderCases, gateStatuses, finalClosureRef: closureRef, openDefectCount: 0 });
  assert.equal(ready.status, 'REVIEW_READY', JSON.stringify(ready));
  const targetFile = 'original/high/h1/1final/recovery.js';
  fixture.write('archive/engine.html', '<!doctype html><title>synthetic release engine</title>');
  const dbPath = fixture.write('archive/db.js', 'window.mainDB=' + JSON.stringify({ exams: [] }) + ';');
  const indexPath = fixture.write('archive/question-index.js', 'window.questionIndex=[];');
  const reviewFile = fixture.write('release/review.json', { status: 'reviewed_pass', questionCount: 1 });
  const approval = { schemaVersion: 'APMATH_FINAL_EXTERNAL_APPROVAL_v1', approvalStatus: 'APPROVED', examId: 'recovery', reviewReadyRunId: ready.reviewReadyRunId, reviewReadySha: ready.reviewReadySha, candidateSha256: ready.candidateSha256, stagedAssetSetSha256: ready.stagedAssetSetSha256, finalClosureSha: ready.finalClosureSha, dbBaselineSha256: bytesSha(fs.readFileSync(path.join(fixture.root, dbPath.path))), indexBaselineSha256: bytesSha(fs.readFileSync(path.join(fixture.root, indexPath.path))), approvalEvidenceIdentity: 'release/recovery/approval', approvalEvidenceSha256: 'sha256:' + 'c'.repeat(64), approvedAt: '2026-09-14T07:00:00.000Z' };
  return { root: fixture.root, candidateFile: path.join(fixture.root, candidateRef.path), reviewFile: path.join(fixture.root, reviewFile.path), reviewReady: ready, approval, manifest: { examId: 'recovery', archiveRelativePath: targetFile }, targetFile, targetPath: path.join(fixture.root, 'archive/exams', targetFile), dbEntry: { file: targetFile, examId: 'recovery', school: '테스트고', grade: '고1', year: 2026, semester: '1', examType: 'final', subject: '공통수학1', contentType: '기출', qCount: 1 }, dbBaselineSha256: approval.dbBaselineSha256, indexBaselineSha256: approval.indexBaselineSha256, dbPath: path.join(fixture.root, dbPath.path), indexPath: path.join(fixture.root, indexPath.path), reviewPath: path.join(fixture.root, reviewFile.path), assetRefs: [] };
}

function injectedPromotion(f) {
  fs.mkdirSync(path.dirname(f.targetPath), { recursive: true });
  fs.copyFileSync(f.candidateFile, f.targetPath);
  const payload = { status: 'PROMOTED', productionAuthorized: false, examId: f.manifest.examId, reviewReadyRunId: f.reviewReady.reviewReadyRunId, revision: f.reviewReady.revision, reviewReadySha: f.reviewReady.reviewReadySha, approvalSha256: objectSha(f.approval), targetFile: f.targetFile, liveJs: `archive/exams/${f.targetFile}`, liveJsSha256: bytesSha(fs.readFileSync(f.targetPath)), questionCount: 1, assetCount: 0, candidateSha256: f.reviewReady.candidateSha256, assetSetSha256: assetSetSha([]), changedPaths: [`archive/exams/${f.targetFile}`] };
  return { ...payload, promotionSha256: objectSha(payload) };
}

function freshSmokeForBinding(binding) {
  return {
    status: 'PASS',
    releaseTransactionId: binding.releaseTransactionId,
    reviewReadyRunId: binding.reviewReadyRunId,
    smokeId: `smoke-${binding.releaseTransactionId}`,
    capturedAt: new Date().toISOString(),
    executedAt: new Date().toISOString(),
    browserWitness: { captureId: `browser-${binding.releaseTransactionId}`, actualBrowser: true, browserVersion: 'synthetic-test-browser' },
    rendererRuntimeBinding: binding.rendererRuntimeBinding,
    productionBinding: { ...binding },
    cases: ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'].map(caseKey => ({ caseKey, status: 'PASS', expectedQuestionCount: 1, observedQuestionCount: 1 })),
  };
}

test('promotion then DB failure leaves a journaled production mutation that can resume safely', async t => {
  const f = await releaseFixtureWithAuthority(t);
  let promotionCalls = 0;
  let registrationCalls = 0;
  const first = executeApprovedRelease({ ...f, dependencies: { promote: () => { promotionCalls++; return injectedPromotion(f); }, register: () => { registrationCalls++; throw new Error('DB_WRITE_FAILED'); }, smoke: () => {} } });
  assert.equal(first.status, 'HOLD', JSON.stringify(first));
  assert.ok(first.mutations?.length, JSON.stringify(first));
  const second = executeApprovedRelease({ ...f, dependencies: { promote: () => { promotionCalls++; throw new Error('PROMOTION_REPLAYED'); }, register: ({ root, ...options }) => registerApprovedExam({ root, ...options }), smoke: (_report, _count, binding) => freshSmokeForBinding(binding) } });
  assert.equal(second.status, 'DONE', JSON.stringify(second));
  assert.equal(promotionCalls, 1);
  assert.equal(registrationCalls, 1);
  assert.equal(second.productionAuthorized, true);
});

test('DB write then index failure resumes from the index stage without replaying DB baseline', async t => {
  const f = await releaseFixtureWithAuthority(t);
  let registerCalls = 0;
  let rebuildCalls = 0;
  const first = executeApprovedRelease({ ...f, dependencies: { promote: () => injectedPromotion(f), register: options => { registerCalls++; return registerApprovedExam(options); }, rebuildIndex: () => { rebuildCalls++; throw new Error('INDEX_WRITE_FAILED'); }, smoke: () => {} } });
  assert.equal(first.status, 'HOLD', JSON.stringify(first));
  const second = executeApprovedRelease({ ...f, dependencies: { promote: () => { throw new Error('PROMOTION_REPLAYED'); }, register: options => { registerCalls++; return registerApprovedExam(options); }, rebuildIndex: options => { rebuildCalls++; return rebuildApprovedIndex(options); }, smoke: (_report, _count, binding) => freshSmokeForBinding(binding) } });
  assert.equal(second.status, 'DONE', JSON.stringify(second));
  assert.equal(registerCalls, 1);
  assert.equal(rebuildCalls, 2);
});

test('index write then smoke failure resumes only the fresh smoke stage', async t => {
  const f = await releaseFixtureWithAuthority(t);
  let smokeCalls = 0;
  const first = executeApprovedRelease({ ...f, dependencies: { promote: () => injectedPromotion(f), register: options => registerApprovedExam(options), rebuildIndex: options => rebuildApprovedIndex(options), smoke: () => { smokeCalls++; throw new Error('SMOKE_FAILED'); } } });
  assert.equal(first.status, 'HOLD', JSON.stringify(first));
  const second = executeApprovedRelease({ ...f, dependencies: { promote: () => { throw new Error('PROMOTION_REPLAYED'); }, register: () => { throw new Error('REGISTRATION_REPLAYED'); }, rebuildIndex: () => { throw new Error('INDEX_REPLAYED'); }, smoke: (_report, _count, binding) => { smokeCalls++; return freshSmokeForBinding(binding); } } });
  assert.equal(second.status, 'DONE', JSON.stringify(second));
  assert.equal(smokeCalls, 2);
});

test('baseline mismatch is held before the first production write', async t => {
  const f = await releaseFixtureWithAuthority(t);
  fs.appendFileSync(f.dbPath, '\n');
  let promotionCalls = 0;
  const result = executeApprovedRelease({ ...f, dependencies: { promote: () => { promotionCalls++; return injectedPromotion(f); }, smoke: (_report, _count, binding) => freshSmokeForBinding(binding) } });
  assert.equal(result.status, 'HOLD', JSON.stringify(result));
  assert.equal(promotionCalls, 0);
  assert.equal(fs.existsSync(f.targetPath), false);
  assert.ok(result.failure.code.includes('BASELINE'));
});

test('a concurrent production writer prevents rollback or unsafe resume', async t => {
  const f = await releaseFixtureWithAuthority(t);
  const first = executeApprovedRelease({ ...f, dependencies: { promote: () => injectedPromotion(f), register: () => { throw new Error('DB_WRITE_FAILED'); }, smoke: () => {} } });
  assert.equal(first.status, 'HOLD', JSON.stringify(first));
  fs.appendFileSync(f.targetPath, '\n// concurrent writer');
  const second = executeApprovedRelease({ ...f, dependencies: { promote: () => { throw new Error('PROMOTION_REPLAYED'); }, register: options => registerApprovedExam(options), smoke: (_report, _count, binding) => freshSmokeForBinding(binding) } });
  assert.equal(second.status, 'HOLD', JSON.stringify(second));
  assert.ok(second.failure.code.includes('PROMOTION') || second.failure.code.includes('SHA') || second.failure.code.includes('STATE'));
  assert.match(fs.readFileSync(f.targetPath, 'utf8'), /concurrent writer/);
});

test('release ignores a pre-read smoke JSON when a fresh capture dependency is available', async t => {
  const f = await releaseFixtureWithAuthority(t);
  const stale = { status: 'PASS', cases: smokeCases(), productionBinding: oldSmokeBinding() };
  let captures = 0;
  const result = executeApprovedRelease({ ...f, smokeReport: stale, dependencies: { promote: () => injectedPromotion(f), register: options => registerApprovedExam(options), rebuildIndex: options => rebuildApprovedIndex(options), captureProductionSmoke: ({ binding }) => { captures++; return freshSmokeForBinding(binding); } } });
  assert.equal(result.status, 'DONE', JSON.stringify(result));
  assert.equal(captures, 1);
  assert.notEqual(result.productionSmokeBinding.releaseTransactionId, undefined);
});

test('default release smoke calls the fresh canonical browser collector', async t => {
  const f = await releaseFixtureWithAuthority(t);
  write(f.root, 'archive/engine.html', SMOKE_ENGINE);
  const result = executeApprovedRelease({ ...f, smokeReport: { status: 'PASS', cases: smokeCases(), productionBinding: oldSmokeBinding() }, dependencies: { promote: () => injectedPromotion(f), register: options => registerApprovedExam(options), rebuildIndex: options => rebuildApprovedIndex(options) } });
  assert.equal(result.status, 'DONE', JSON.stringify(result));
  assert.equal(result.productionAuthorized, true);
  assert.equal(result.productionSmokeBinding.questionCount, 1);
});
