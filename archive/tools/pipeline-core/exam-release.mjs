import { canonicalJson, HASH_PATTERN, isObject, nonempty, objectSha, uidSet } from './canonical.mjs';
import { QUESTION_QUALITY_CLOSURE_SET_VERSION, validateQuestionQualityClosureSet } from './question-quality-set.mjs';
import { validateRender, profiles } from './closure.mjs';
import { validateContinuationDenominator } from './continuation.mjs';
import { validateRenderReviewReuseReceipt } from './render-impact.mjs';
import { readBoundFile } from './canonical.mjs';

export const EXAM_RELEASE_CLOSURE_VERSION = 'APMATH_EXAM_RELEASE_CLOSURE_v1';
export const RELEASE_CASES = Object.freeze(['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile']);

const caseKey = value => typeof value === 'string' ? value : `${value?.mode || ''}/${value?.viewport || value?.viewportProfile || ''}`;

export function examReleaseApplicability(run, policy = run?.releasePolicy) {
  if (run?.publicationIntent === 'FULL_EXAM') return 'REQUIRED';
  const explicit = policy?.examReleaseApplicability || run?.examReleaseApplicability;
  if (explicit === 'REQUIRED' || explicit === 'NOT_APPLICABLE') return explicit;
  if (['past-exam'].includes(run?.pipeline) && run?.publicationIntent === 'FULL_EXAM') return 'REQUIRED';
  return 'NOT_APPLICABLE';
}

export function createExamReleaseClosure({ root, run, evidence, evidenceRefs, qualityClosureSet, renderCases = [], runtimeBundleSha = null, candidateRefs = [], assetRefs = [], releasePolicy = {} }) {
  const applicability = examReleaseApplicability(run, releasePolicy);
  const errors = [];
  if (!isObject(run) || !nonempty(run.runId) || !Number.isSafeInteger(run.revision) || !HASH_PATTERN.test(run.inputSha)) errors.push('EXAM_RELEASE_RUN_INVALID');
  if (applicability === 'NOT_APPLICABLE') {
    const payload = { schemaVersion: EXAM_RELEASE_CLOSURE_VERSION, runId: run?.runId || null, revision: run?.revision || null, applicability, reason: releasePolicy.reason || 'FULL_EXAM_RELEASE_NOT_REQUESTED', currentRunInputSha: run?.inputSha || null, questionUids: [], cases: [], qualityClosureSetSha: null, productionAuthorized: false, status: errors.length ? 'BLOCKED' : 'PASS' };
    return { ...payload, closureSha: objectSha(payload), errors };
  }
  const quality = validateQuestionQualityClosureSet(qualityClosureSet, { runId: run.runId, revision: run.revision, currentRunInputSha: run.inputSha, questionUids: run.questions.map(question => question.questionUid) });
  if (quality.status !== 'PASS') errors.push(...quality.errors.map(error => `QUALITY_CLOSURE:${error}`));
  const requiredCases = RELEASE_CASES;
  const actualCases = renderCases.map(caseKey);
  if (renderCases.some(row => typeof row !== 'object' || !row.captureEvidenceId || !row.reviewEvidenceId)) errors.push('RELEASE_RENDER_EVIDENCE_AGGREGATE_REQUIRED');
  for (const key of requiredCases) if (actualCases.filter(actual => actual === key).length !== 1) errors.push(`RELEASE_CASE_MISSING_OR_DUPLICATE:${key}`);
  for (const key of actualCases) if (!requiredCases.includes(key)) errors.push(`RELEASE_CASE_EXTRA:${key}`);
  const questionUids = run.questions.map(question => question.questionUid);
  if (new Set(questionUids).size !== questionUids.length) errors.push('EXAM_RELEASE_DUPLICATE_UID');
  const { closureSetSha: _closureSetSha, errors: _qualityErrors, ...qualityPayload } = qualityClosureSet || {};
  const payload = { schemaVersion: EXAM_RELEASE_CLOSURE_VERSION, runId: run.runId, revision: run.revision, applicability, qualityClosureSetSha: qualityClosureSet?.closureSetSha || objectSha(qualityPayload), questionUids, questionUidSetSha: objectSha(questionUids), candidateRefs, assetRefs, runtimeBundleSha: runtimeBundleSha || run.renderRuntime?.bundleSha || null, requiredCases, cases: renderCases, actualCases: [...new Set(actualCases)].sort(), continuationCoverage: releasePolicy.continuationCoverage || null, lastQuestion: run.questions.at(-1)?.questionUid || null, currentRunInputSha: run.inputSha, productionAuthorized: false, status: errors.length ? 'BLOCKED' : 'PASS' };
  const closure = { ...payload, closureSha: objectSha(payload), errors };
  const validation = validateExamReleaseClosure(closure, { root, run, evidence, evidenceRefs, qualityClosureSetSha: quality.closureSetSha });
  if (validation.errors.length) {
    errors.push(...validation.errors);
    payload.status = 'BLOCKED';
  }
  return { ...payload, closureSha: objectSha(payload), errors };
}

export function validateExamReleaseClosure(closure, { root, run, evidence, evidenceRefs, qualityClosureSetSha } = {}) {
  const errors = [];
  if (!isObject(closure) || closure.schemaVersion !== EXAM_RELEASE_CLOSURE_VERSION) errors.push('EXAM_RELEASE_SCHEMA_INVALID');
  if (!['REQUIRED', 'NOT_APPLICABLE'].includes(closure?.applicability)) errors.push('EXAM_RELEASE_APPLICABILITY_INVALID');
  if (closure?.productionAuthorized !== false || closure?.status !== 'PASS') errors.push('EXAM_RELEASE_AUTHORITY_FORBIDDEN');
  if (closure?.applicability === 'NOT_APPLICABLE') {
    const expected = createExamReleaseClosure({ run, releasePolicy: run?.releasePolicy || {} });
    if (canonicalJson(closure) !== canonicalJson(expected)) errors.push('CANONICAL_EXAM_RELEASE_NA_REQUIRED');
    return { status: errors.length ? 'BLOCKED' : 'PASS', errors, closureSha: errors.length ? null : closure.closureSha };
  }
  if (!root || !run || !evidence || !evidenceRefs || !qualityClosureSetSha) errors.push('EXAM_RELEASE_AUDIT_CONTEXT_REQUIRED');
  if (run) {
    if (closure.runId !== run.runId || closure.revision !== run.revision) errors.push('EXAM_RELEASE_RUN_MISMATCH');
    if (closure.currentRunInputSha !== run.inputSha) errors.push('EXAM_RELEASE_INPUT_SHA_MISMATCH');
    if (examReleaseApplicability(run) !== closure.applicability) errors.push('EXAM_RELEASE_APPLICABILITY_MISMATCH');
    if (closure.qualityClosureSetSha !== qualityClosureSetSha) errors.push('EXAM_RELEASE_QUALITY_BINDING');
    if (canonicalJson(closure.candidateRefs) !== canonicalJson(run.inputs.filter(ref => ref.role === 'candidate')) || canonicalJson(closure.assetRefs) !== canonicalJson(run.inputs.filter(ref => ref.role === 'asset')) || closure.runtimeBundleSha !== run.renderRuntime?.bundleSha || closure.lastQuestion !== run.questions.at(-1)?.questionUid) errors.push('EXAM_RELEASE_FINAL_OUTPUT_BINDING');
    try { if (canonicalJson(uidSet(closure.questionUids || [])) !== canonicalJson(uidSet(run.questions.map(question => question.questionUid)))) errors.push('EXAM_RELEASE_UID_SET_MISMATCH'); } catch { errors.push('EXAM_RELEASE_UID_SET_INVALID'); }
  }
  if (closure?.applicability === 'REQUIRED') {
    const expected = RELEASE_CASES;
    const actual = closure.actualCases || [];
    for (const key of expected) if (actual.filter(value => value === key).length !== 1) errors.push(`EXAM_RELEASE_CASE_NOT_CLOSED:${key}`);
    if (actual.length !== expected.length || closure.cases?.length !== expected.length) errors.push('EXAM_RELEASE_CASE_EXACT_COVERAGE');
    for (const key of expected) {
      try {
        const rows = (closure.cases || []).filter(row => caseKey(row) === key);
        if (rows.length !== 1) throw new Error('CASE_EVIDENCE_MISSING_OR_DUPLICATE');
        const row = rows[0], capture = evidence.get(row.captureEvidenceId), review = evidence.get(row.reviewEvidenceId);
        if (!capture || !review || capture.inputSha !== run.inputSha || capture.runId !== run.runId || capture.revision !== run.revision || row.captureEvidenceSha !== evidenceRefs.get(capture.evidenceId)?.sha256 || row.reviewEvidenceSha !== evidenceRefs.get(review.evidenceId)?.sha256) throw new Error('CASE_CURRENT_EVIDENCE_BINDING');
        if (review.inputSha !== run.inputSha || review.runId !== run.runId || review.revision !== run.revision) {
          const receipt = JSON.parse(readBoundFile(root, row.renderReviewReuseReceiptRef));
          if (!run.renderReviewReuseReceiptRefs?.some(ref => ref.sha256 === row.renderReviewReuseReceiptRef.sha256) || receipt.rootFreshReviewRef.sha256 !== row.reviewEvidenceSha || validateRenderReviewReuseReceipt(root, receipt, { currentCaptureRef: evidenceRefs.get(capture.evidenceId), currentRunInputSha: run.inputSha }).status !== 'PASS') throw new Error('CASE_RENDER_REUSE_NOT_PROVEN');
        }
        const payload = capture.payload;
        const expectedBinding = { runtimeBundleSha: payload.runtimeBundleSha, runtimeResponseBundleSha: payload.runtimeResponseBundleSha, candidateRef: payload.candidateRef, assetRefs: payload.assetRefs, itemWitnessesSha: objectSha(payload.itemWitnesses), lastQuestionId: payload.lastQuestionId };
        for (const [field, value] of Object.entries(expectedBinding)) if (canonicalJson(row[field] ?? null) !== canonicalJson(value ?? null)) throw new Error(`CASE_BINDING:${field}`);
        const legacyEvidence = new Map([...evidence].map(([id, e]) => [id, { ...e, axis: e.axis === 'RENDER_CAPTURE' ? 'render-capture' : e.axis === 'RENDER_REVIEW' ? 'render' : e.axis }]));
        const [mode, viewport] = key.split('/');
        const renderErrors = validateRender(root, legacyEvidence.get(review.evidenceId), profiles.viewports.find(p => p.profile === viewport), mode, run, run.inputSha, payload.candidatePath, legacyEvidence, new Map([...evidenceRefs].map(([id, ref]) => [id, ref.sha256])), new Set());
        errors.push(...renderErrors.map(error => `${key}:${error}`));
        for (const witness of payload.itemWitnesses) errors.push(...validateContinuationDenominator(witness.continuationDenominator, { questionUid: witness.questionUid, cases: [key], reviewedBlocks: review.payload.itemReviews.find(r => r.questionUid === witness.questionUid)?.blockReviews || [] }).errors.map(error => `${key}:${error}`));
      } catch (error) { errors.push(`${key}:${error.message}`); }
    }
  }
  const { closureSha: _closureSha, errors: _errors, ...closurePayload } = closure || {};
  if (_closureSha !== objectSha(closurePayload)) errors.push('EXAM_RELEASE_CLOSURE_SHA_MISMATCH');
  return { status: errors.length ? 'BLOCKED' : 'PASS', errors, closureSha: errors.length ? null : objectSha(closurePayload) };
}
