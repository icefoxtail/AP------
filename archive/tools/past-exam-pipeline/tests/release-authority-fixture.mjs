import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { bytesSha, fileRef, objectSha } from '../../pipeline-core/canonical.mjs';
import { EVIDENCE_VERSION_V2, runInputSha } from '../../pipeline-core/closure.mjs';
import { computeV2AxisInputShas } from '../../pipeline-core/v2-audit.mjs';
import { freezeWorkBatch, initWorkBatch, readWorkBatch } from '../../pipeline-core/work-batch.mjs';
import { recoveryFixture } from '../../pipeline-core/tests/recovery-fixture.mjs';
import { resumePastExam } from '../resume-past-exam.mjs';
import { assetSetSha } from '../lib/production-boundary.mjs';
import { createReviewReady } from '../lib/review-ready.mjs';

export const RELEASE_RENDER_CASES = Object.freeze(['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile']);
export const RELEASE_GATE_STATUSES = Object.freeze({ sourceFidelity: 'PASS', math: 'PASS', solutionQuality: 'PASS', visual: 'PASS', metadata: 'PASS', finalAudit: 'PASS', render: 'PASS' });

function canonicalClosureCases() {
  return RELEASE_RENDER_CASES.map(caseKey => ({ caseKey, captureEvidenceId: `capture:${caseKey}`, reviewEvidenceId: `review:${caseKey}` }));
}

function readJson(root, ref) {
  return JSON.parse(fs.readFileSync(path.join(root, ref.path), 'utf8'));
}

export async function makeCanonicalReleaseFixture(t, { examId = 'target', candidateOverrides = null, assetFiles = {}, targetFile = null } = {}) {
  const fixture = recoveryFixture(t, { pipeline: 'past-exam', examId, candidateOverrides, assetFiles });
  const initial = fixture.makeRun(1);
  const candidateRef = initial.run.inputs.find(ref => ref.role === 'candidate');
  const assetRefs = initial.run.inputs.filter(ref => ref.role === 'asset');
  const uid = initial.run.questions[0].questionUid;
  const closurePayload = {
    schemaVersion: 'APMATH_EXAM_RELEASE_CLOSURE_v1',
    runId: initial.run.runId,
    revision: initial.run.revision,
    applicability: 'REQUIRED',
    qualityClosureSetSha: null,
    questionUids: [uid],
    questionUidSetSha: objectSha([uid]),
    candidateRefs: [candidateRef],
    assetRefs,
    runtimeBundleSha: null,
    requiredCases: [...RELEASE_RENDER_CASES],
    cases: canonicalClosureCases(),
    actualCases: [...RELEASE_RENDER_CASES],
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
  if (!launch) throw new Error('TEST_FINAL_AUDIT_LAUNCH_REQUIRED');
  const receipt = readJson(fixture.root, launch.providerReceiptRef);
  const freshness = freeze.bindings.flatMap(binding => (binding.questions || []).flatMap(question => Object.entries(binding.axisInputShas[question.questionUid] || {}).map(([axis, axisInputSha]) => ({ questionUid: question.questionUid, axis, axisInputSha, status: 'PASS', mode: 'FRESH', evidenceId: `${question.questionUid}:${axis}`, evidenceSha: objectSha([question.questionUid, axis]), receiptSha: null }))));
  const finalAudit = { schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', workBatchId: 'job', runId: run.runId, revision: run.revision, inputSha: run.inputSha, status: 'PASS', productionAuthorized: false, freshness };
  const finalAuditRef = fixture.write('release/final-audit.json', finalAudit);
  const phaseForAxis = { SOURCE: 'U1', MATH_A1: 'U1', V1: 'U1', V2: 'U2', MATH_A2: 'U3', SOLUTION: 'U3', V3: 'U3' };
  const phaseEvidenceRefs = ['U1', 'U2', 'U3'].map(phase => ({ phase, evidenceRefs: receipt.evidenceRefs.filter(ref => phaseForAxis[readJson(fixture.root, ref).axis] === phase) }));
  const workBatchRef = fileRef(fixture.root, 'alive/runtime/work-batches/job/state.json');
  const authorityPayload = { schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1', status: 'PASS', examId, workBatchId: 'job', workBatchRef, runId: run.runId, runRef, freezeSha: freeze.freezeSha, revision: run.revision, inputSha: run.inputSha, candidateRef, candidateSha256: candidateRef.sha256, assetRefs, assetSetSha256: assetSetSha(assetRefs), launchId: launch.launchId, providerReceiptRef: launch.providerReceiptRef, phaseAttestationRefs: receipt.phaseAttestationRefs, phaseEvidenceRefs, finalAuditRef, canonicalClosureRef: closureRef };
  const authority = { ...authorityPayload, authoritySha: objectSha(authorityPayload) };
  const candidateContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(fixture.root, candidateRef.path), 'utf8'), candidateContext);
  const ready = createReviewReady({ root: fixture.root, run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId, runId: run.runId, revision: run.revision }, closure, finalAudit, finalAuditAuthority: authority, candidateRef, assetRefs, candidateQuestions: candidateContext.window.questionBank, baselineQuestions: [], renderCases: RELEASE_RENDER_CASES.map(caseKey => ({ caseKey, status: 'PASS' })), gateStatuses: RELEASE_GATE_STATUSES, finalClosureRef: closureRef, openDefectCount: 0 });
  if (ready.status !== 'REVIEW_READY') throw new Error('TEST_REVIEW_READY_REQUIRED:' + ready.errors.join(';'));
  const resolvedTargetFile = targetFile || `original/high/h1/1final/${examId}.js`;
  fixture.write('archive/engine.html', '<!doctype html><title>synthetic release engine</title>');
  const dbPath = fixture.write('archive/db.js', 'window.mainDB=' + JSON.stringify({ exams: [] }) + ';');
  const indexPath = fixture.write('archive/question-index.js', 'window.questionIndex=[];');
  const reviewRef = fixture.write('release/review.json', { status: 'reviewed_pass', questionCount: candidateContext.window.questionBank.length });
  const approval = { schemaVersion: 'APMATH_FINAL_EXTERNAL_APPROVAL_v1', approvalStatus: 'APPROVED', examId, reviewReadyRunId: ready.reviewReadyRunId, reviewReadySha: ready.reviewReadySha, candidateSha256: ready.candidateSha256, stagedAssetSetSha256: ready.stagedAssetSetSha256, finalClosureSha: ready.finalClosureSha, dbBaselineSha256: bytesSha(fs.readFileSync(path.join(fixture.root, dbPath.path))), indexBaselineSha256: bytesSha(fs.readFileSync(path.join(fixture.root, indexPath.path))), approvalEvidenceIdentity: `release/${examId}/approval`, approvalEvidenceSha256: 'sha256:' + 'c'.repeat(64), approvedAt: '2026-09-14T07:00:00.000Z' };
  return { root: fixture.root, candidateFile: path.join(fixture.root, candidateRef.path), candidateRef, reviewFile: path.join(fixture.root, reviewRef.path), reviewReady: ready, approval, manifest: { examId, archiveRelativePath: resolvedTargetFile }, targetFile: resolvedTargetFile, targetPath: path.join(fixture.root, 'archive/exams', resolvedTargetFile), dbEntry: { file: resolvedTargetFile, examId, school: '테스트고', grade: '고1', year: 2026, semester: '1', examType: 'final', subject: '공통수학1', contentType: '기출', qCount: candidateContext.window.questionBank.length }, dbBaselineSha256: approval.dbBaselineSha256, indexBaselineSha256: approval.indexBaselineSha256, dbPath: path.join(fixture.root, dbPath.path), indexPath: path.join(fixture.root, indexPath.path), reviewPath: path.join(fixture.root, reviewRef.path), assetsDir: path.join(fixture.root, 'assets'), assetRefs, sourceRun: run, authority };
}

export async function attachCanonicalFinalAudit(t, { root, examId = 'target', candidateFile, candidateQuestions, assetRefs = [], workBatchId = 'authority-job', runId = 'authority-run' } = {}) {
  if (!root || !candidateFile || !Array.isArray(candidateQuestions) || !candidateQuestions.length) throw new Error('TEST_CANONICAL_AUTHORITY_INPUT_REQUIRED');
  const candidateRelative = path.relative(root, path.resolve(candidateFile)).split(path.sep).join('/');
  const candidateRef = fileRef(root, candidateRelative);
  const sourceRows = candidateQuestions.map(({ image, solutionImage, visualAsset, visualAssetProvenance, ...question }) => ({ ...question }));
  const sourceRef = fixtureWrite(root, `authority/${workBatchId}/source.js`, `window.examTitle=${JSON.stringify(examId)};window.questionBank=${JSON.stringify(sourceRows)};`);
  const candidateAssetPaths = [...new Set(candidateQuestions.flatMap(question => [question.image, question.solutionImage].filter(Boolean).map(String)))];
  const boundAssets = assetRefs.map(ref => {
    const candidatePath = candidateAssetPaths.find(candidate => path.basename(candidate) === path.basename(ref.path));
    if (!candidatePath || candidatePath === ref.path) return { ...ref, role: 'asset' };
    const candidateAssetFile = path.join(root, candidatePath);
    if (!fs.existsSync(candidateAssetFile)) fixtureWrite(root, candidatePath, fs.readFileSync(path.join(root, ref.path)));
    return { ...fileRef(root, candidatePath), role: 'asset' };
  });
  const sourceEvidenceRefs = [...new Set(candidateQuestions.flatMap(question => question.sourcePageEvidencePaths || question.sourceEvidencePath ? (question.sourcePageEvidencePaths || [question.sourceEvidencePath]) : []))].map(relative => {
    const normalized = String(relative).replaceAll('\\', '/');
    const sourceFile = path.join(root, path.basename(path.dirname(candidateFile)), normalized);
    const fallback = path.join(root, 'staging', normalized);
    const actual = fs.existsSync(sourceFile) ? sourceFile : fallback;
    if (!fs.existsSync(actual)) throw new Error('TEST_SOURCE_EVIDENCE_MISSING:' + normalized);
    const target = path.join(root, normalized);
    if (!fs.existsSync(target)) fixtureWrite(root, normalized, fs.readFileSync(actual));
    return { ...fileRef(root, normalized), role: 'asset' };
  });
  const sourceAssetAliases = boundAssets.flatMap(ref => {
    const candidatePath = candidateAssetPaths.find(candidate => path.basename(candidate) === path.basename(ref.path));
    if (!candidatePath) return [];
    const archivePath = `archive/${candidatePath.replace(/^archive\//, '')}`;
    const target = path.join(root, archivePath);
    if (!fs.existsSync(target)) fixtureWrite(root, archivePath, fs.readFileSync(path.join(root, ref.path)));
    return [{ ...fileRef(root, archivePath), role: 'asset' }];
  });
  const questions = candidateQuestions.map(question => ({
    questionUid: `${runId}|${question.id}`,
    sourceExamId: examId,
    examId,
    qid: question.id,
    sourcePath: sourceRef.path,
    candidatePath: candidateRef.path,
    requiredAxes: [],
    sourceStatus: 'RESOLVED',
    problemAssetPaths: [question.image].filter(value => boundAssets.some(ref => ref.path === value)),
    solutionAssetPaths: boundAssets.map(ref => ref.path),
    evidence: {},
    visual: { origin: 'NATIVE', requirement: question.image ? 'VISUAL_REQUIRED' : question.solutionImage ? 'VISUAL_OPTIONAL' : 'VISUAL_EXEMPT', action: question.image || question.solutionImage ? 'KEEP' : 'NONE', exemptReason: question.image || question.solutionImage ? null : 'TEST_NO_VISUAL_NEEDED', adjudicationId: `${runId}:${question.id}:authority`, adjudicationStatus: 'RESOLVED', actualSolutionVisualAttached: Boolean(question.solutionImage), problemVisualMathDependency: Boolean(question.image), sharedVisualMathDependency: false },
  }));
  const run = { schemaVersion: 'APMATH_PIPELINE_RUN_v2', pipeline: 'past-exam', workBatchId, runId, revision: 1, builderId: 'authority-builder', builderSessionId: 'authority-builder-session', builderModelOrAgent: 'SYNTHETIC_TEST_ONLY', questions, inputs: [{ ...sourceRef, role: 'source' }, { ...candidateRef, role: 'candidate' }, ...boundAssets, ...sourceAssetAliases, ...sourceEvidenceRefs], evidence: [], auditorPacketRefs: [], registry: [] };
  run.inputSha = runInputSha(run);
  const shas = computeV2AxisInputShas(root, run);
  for (const question of run.questions) question.axisInputShas = shas[question.questionUid];
  for (const question of run.questions) {
    for (const axis of ['STATIC', 'METADATA']) {
      const machineProvenance = { runId, revision: 1, inputSha: run.inputSha, collector: 'SYNTHETIC_TEST_ONLY', currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256 };
      const payload = axis === 'STATIC'
        ? { checkedInputSha: run.inputSha, currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256, checks: { schema: 'PASS', jsLoad: 'PASS', hashes: 'PASS', assetBinding: 'PASS', fileParity: 'PASS', studentSerialization: 'PASS' } }
        : { metadataInputSha: shas[question.questionUid][axis], currentArtifactSha: candidateRef.sha256, CURRENT_ARTIFACT_SHA: candidateRef.sha256, EVIDENCE_INPUT_SHA: candidateRef.sha256, checks: { schema: 'PASS', uidBinding: 'PASS', curriculumBinding: 'PASS' } };
      const evidence = { schemaVersion: EVIDENCE_VERSION_V2, evidenceId: `${runId}-${question.id}-${axis.toLowerCase()}`, runId, revision: 1, questionUid: question.questionUid, axis, axisInputSha: shas[question.questionUid][axis], inputSha: run.inputSha, reviewStartInputSha: run.inputSha, reviewEndInputSha: run.inputSha, mode: 'MACHINE_CURRENT', auditorPrincipalType: 'MACHINE_COLLECTOR', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'authority-machine-collector', reviewSessionId: `${runId}:machine:${axis}`, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', startedAt: '2026-09-14T06:00:00.000Z', frozenAt: '2026-09-14T06:01:00.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: 'MACHINE_CURRENT', findings: [], reviewIsolationProvenanceSha: objectSha(machineProvenance), machineProvenance, payload };
      run.evidence.push(fixtureWrite(root, `authority/${workBatchId}/evidence/${evidence.evidenceId}.json`, evidence));
      question.evidence[axis] = evidence.evidenceId;
    }
  }
  const closureBase = { schemaVersion: 'APMATH_EXAM_RELEASE_CLOSURE_v1', runId, revision: 1, applicability: 'REQUIRED', qualityClosureSetSha: null, questionUids: questions.map(question => question.questionUid), questionUidSetSha: objectSha(questions.map(question => question.questionUid)), candidateRefs: [candidateRef], assetRefs: boundAssets, runtimeBundleSha: null, requiredCases: [...RELEASE_RENDER_CASES], cases: canonicalClosureCases(), actualCases: [...RELEASE_RENDER_CASES], currentRunInputSha: run.inputSha, productionAuthorized: false, status: 'PASS' };
  const closure = { ...closureBase, closureSha: objectSha(closureBase) };
  const closureRef = fixtureWrite(root, `authority/${workBatchId}/closure.json`, closure);
  run.examReleaseClosureRef = closureRef;
  run.inputSha = runInputSha(run);
  const runRef = fixtureWrite(root, `authority/${workBatchId}/run.json`, run);
  initWorkBatch(root, { workBatchId, runIds: [runId], builderId: run.builderId, builderSessionId: run.builderSessionId, workflowProfile: 'PAST_EXAM' });
  freezeWorkBatch(root, workBatchId, [runRef]);
  const provider = fixtureWrite(root, `authority/${workBatchId}/provider.mjs`, `
import fs from 'node:fs';
const request = JSON.parse(fs.readFileSync(0, 'utf8'));
const runInputSha = ${JSON.stringify(run.inputSha)};
if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'READY', requestSha: request.requestSha, provider: 'synthetic-authority-provider', model: 'synthetic-authority-model', externalTaskId: 'external-' + request.launchId, auditorId: 'auditor-' + request.launchId, auditorSessionId: 'auditor-session-' + request.launchId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, runtimeAttestation: 'synthetic-authority-runtime', contexts: { U1: { sessionId: request.launchId + '-u1', contextId: request.launchId + '-c1' }, U2: { sessionId: request.launchId + '-u2', contextId: request.launchId + '-c2' }, U3: { sessionId: request.launchId + '-u3', contextId: request.launchId + '-c3' } } }));
else { const questionUid = Array.isArray(request.packet.payload) ? request.packet.payload[0].questionUid : request.packet.payload.questionUid; const axis = { U1: 'SOURCE', U2: 'V2', U3: 'MATH_A2' }[request.phase]; const evidence = { schemaVersion: 'APMATH_PIPELINE_EVIDENCE_v2', evidenceId: request.logicalLaunchId + '-' + request.phase + '-evidence', runId: ${JSON.stringify(runId)}, revision: 1, questionUid, axis, inputSha: runInputSha, axisInputSha: 'sha256:' + 'a'.repeat(64), mode: 'FRESH', status: 'PASS', validityStatus: 'FROZEN', reviewerId: 'auditor-' + request.logicalLaunchId, reviewSessionId: request.packet.auditorSessionId, reviewerModelOrAgent: 'SYNTHETIC_TEST_ONLY', auditorPrincipalType: 'STATELESS_MODEL', startedAt: '2026-09-14T06:00:00.000Z', frozenAt: '2026-09-14T06:01:00.000Z', priorReviewVisibility: 'NONE', inputVisibilityProfile: request.packet.inputVisibilityProfile, findings: [], reviewIsolationProvenanceSha: request.packet.packetSha, launchId: request.logicalLaunchId, externalTaskId: request.externalTaskId, reviewStartInputSha: runInputSha, reviewEndInputSha: runInputSha, withdrawalStatus: 'ACTIVE', revocationStatus: 'NOT_REVOKED', supersessionStatus: 'VALID', sourceAuthorityStatus: 'VALID', eligibilityStatus: 'ELIGIBLE', payload: { independentAnswer: '1' } }; process.stdout.write(JSON.stringify({ schemaVersion: request.schemaVersion, operation: request.operation, status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: request.externalTaskId, phase: request.phase, sessionId: request.packet.auditorSessionId, contextId: request.packet.contextId, providerInvocationId: request.logicalLaunchId + '-' + request.phase, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 0, evidence: [evidence], defects: [] })); }
`);
  await resumePastExam(root, { workBatchId, runRefs: [runRef], providerCommand: process.execPath, providerArgs: [path.join(root, provider.path)], maxSteps: 6 });
  const state = readWorkBatch(root, workBatchId);
  const freeze = state.freezes.at(-1);
  const launch = state.launches.find(item => item.purpose === 'FINAL_AUDIT' && item.status === 'COMPLETED');
  const receipt = readJson(root, launch.providerReceiptRef);
  const freshness = freeze.bindings.flatMap(binding => (binding.questions || []).flatMap(question => Object.entries(binding.axisInputShas[question.questionUid] || {}).map(([axis, axisInputSha]) => ({ questionUid: question.questionUid, axis, axisInputSha, status: 'PASS', mode: 'FRESH', evidenceId: `${question.questionUid}:${axis}`, evidenceSha: objectSha([question.questionUid, axis]), receiptSha: null }))));
  const finalAudit = { schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', workBatchId, runId, revision: 1, inputSha: run.inputSha, status: 'PASS', productionAuthorized: false, freshness };
  const finalAuditRef = fixtureWrite(root, `authority/${workBatchId}/final-audit.json`, finalAudit);
  const phaseForAxis = { SOURCE: 'U1', MATH_A1: 'U1', V1: 'U1', V2: 'U2', MATH_A2: 'U3', SOLUTION: 'U3', V3: 'U3' };
  const phaseEvidenceRefs = ['U1', 'U2', 'U3'].map(phase => ({ phase, evidenceRefs: receipt.evidenceRefs.filter(ref => phaseForAxis[readJson(root, ref).axis] === phase) }));
  const authorityBase = { schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1', status: 'PASS', examId, workBatchId, workBatchRef: fileRef(root, `alive/runtime/work-batches/${workBatchId}/state.json`), runId, runRef, freezeSha: freeze.freezeSha, revision: 1, inputSha: run.inputSha, candidateRef, candidateSha256: candidateRef.sha256, assetRefs: boundAssets, assetSetSha256: assetSetSha(boundAssets), launchId: launch.launchId, providerReceiptRef: launch.providerReceiptRef, phaseAttestationRefs: receipt.phaseAttestationRefs, phaseEvidenceRefs, finalAuditRef, canonicalClosureRef: closureRef };
  const authority = { ...authorityBase, authoritySha: objectSha(authorityBase) };
  const ready = createReviewReady({ root, run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId, runId, revision: 1 }, closure, finalAudit, finalAuditAuthority: authority, candidateRef, assetRefs: boundAssets, candidateQuestions, baselineQuestions: [], renderCases: RELEASE_RENDER_CASES.map(caseKey => ({ caseKey, status: 'PASS' })), gateStatuses: RELEASE_GATE_STATUSES, finalClosureRef: closureRef, openDefectCount: 0 });
  if (ready.status !== 'REVIEW_READY') throw new Error('TEST_REVIEW_READY_REQUIRED:' + ready.errors.join(';'));
  return { authority, ready, run, runRef, closure, closureRef, finalAudit, finalAuditRef, state, freeze, launch, receipt, candidateRef, assetRefs: boundAssets, workBatchId, runId };
}

export function makeReviewReadyFromCompletedState({ root, state, runRef, closure, closureRef, examId, candidateQuestions, outputPath = 'review/review-ready.json' } = {}) {
  const run = readJson(root, runRef);
  const freeze = state?.freezes?.at(-1);
  const launch = [...(state?.launches || [])].reverse().find(item => ['FINAL_AUDIT', 'TARGETED_RECHECK'].includes(item.purpose) && item.status === 'COMPLETED');
  if (!freeze || !launch) throw new Error('TEST_COMPLETED_FINAL_AUDIT_REQUIRED');
  const receipt = readJson(root, launch.providerReceiptRef);
  const finalAuditLaunch = [...(state?.launches || [])].find(item => item.purpose === 'FINAL_AUDIT' && item.status === 'COMPLETED');
  const finalAuditReceipt = finalAuditLaunch ? readJson(root, finalAuditLaunch.providerReceiptRef) : receipt;
  const candidateRef = run.inputs.find(ref => ref.role === 'candidate');
  const assetRefs = run.inputs.filter(ref => ref.role === 'asset' && !ref.path.startsWith('archive/'));
  const freshness = freeze.bindings.flatMap(binding => (binding.questions || []).flatMap(question => Object.entries(binding.axisInputShas[question.questionUid] || {}).map(([axis, axisInputSha]) => ({ questionUid: question.questionUid, axis, axisInputSha, status: 'PASS', mode: 'FRESH', evidenceId: `${question.questionUid}:${axis}`, evidenceSha: objectSha([question.questionUid, axis]), receiptSha: null }))));
  const finalAudit = { schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', workBatchId: state.workBatchId, runId: run.runId, revision: run.revision, inputSha: run.inputSha, status: 'PASS', productionAuthorized: false, freshness };
  const finalAuditRef = fixtureWrite(root, `${path.dirname(outputPath)}/final-audit.json`, finalAudit);
  const phaseForAxis = { SOURCE: 'U1', MATH_A1: 'U1', V1: 'U1', V2: 'U2', MATH_A2: 'U3', SOLUTION: 'U3', V3: 'U3' };
  const phaseAttestationRefs = ['U1', 'U2', 'U3'].map(phase => {
    const sourceLaunch = receipt.phaseAttestationRefs?.some(row => row.phase === phase) ? launch : finalAuditLaunch;
    const sourceReceipt = sourceLaunch === launch ? receipt : finalAuditReceipt;
    const attestation = sourceReceipt?.phaseAttestationRefs?.find(row => row.phase === phase);
    return attestation ? { ...attestation, launchId: sourceLaunch.launchId, providerReceiptRef: sourceLaunch.providerReceiptRef } : { phase };
  });
  const phaseEvidenceRefs = ['U1', 'U2', 'U3'].map(phase => {
    const sourceLaunch = receipt.phaseAttestationRefs?.some(row => row.phase === phase) ? launch : finalAuditLaunch;
    const sourceReceipt = sourceLaunch === launch ? receipt : finalAuditReceipt;
    const evidenceRefs = (sourceReceipt?.evidenceRefs || []).filter(ref => phaseForAxis[readJson(root, ref).axis] === phase);
    return { phase, launchId: sourceLaunch?.launchId || null, providerReceiptRef: sourceLaunch?.providerReceiptRef || null, evidenceRefs };
  });
  const authorityBase = { schemaVersion: 'APMATH_FINAL_AUDIT_AUTHORITY_v1', status: 'PASS', examId: examId || run.questions[0]?.examId || run.questions[0]?.sourceExamId, workBatchId: state.workBatchId, workBatchRef: fileRef(root, `alive/runtime/work-batches/${state.workBatchId}/state.json`), runId: run.runId, runRef, freezeSha: freeze.freezeSha, revision: run.revision, inputSha: run.inputSha, candidateRef, candidateSha256: candidateRef.sha256, assetRefs, assetSetSha256: assetSetSha(assetRefs), launchId: launch.launchId, providerReceiptRef: launch.providerReceiptRef, phaseAttestationRefs, phaseEvidenceRefs, finalAuditRef, canonicalClosureRef: closureRef };
  const authority = { ...authorityBase, authoritySha: objectSha(authorityBase) };
  const ready = createReviewReady({ root, run: { pipeline: 'past-exam', publicationIntent: 'FULL_EXAM', examId: authority.examId, runId: run.runId, revision: run.revision }, closure, finalAudit, finalAuditAuthority: authority, candidateRef, assetRefs, candidateQuestions, baselineQuestions: [], renderCases: RELEASE_RENDER_CASES.map(caseKey => ({ caseKey, status: 'PASS' })), gateStatuses: RELEASE_GATE_STATUSES, finalClosureRef: closureRef, openDefectCount: 0 });
  if (ready.status !== 'REVIEW_READY') throw new Error('TEST_REVIEW_READY_REQUIRED:' + ready.errors.join(';'));
  const readyRef = fixtureWrite(root, outputPath, ready);
  return { ready, readyRef, authority, finalAudit, finalAuditRef, run, freeze, launch, receipt, candidateRef, assetRefs };
}

function fixtureWrite(root, relative, value) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.isBuffer(value) || value instanceof Uint8Array ? value : typeof value === 'string' ? value : `${JSON.stringify(value)}\n`);
  return fileRef(root, relative);
}
