import fs from 'node:fs';
import path from 'node:path';

import {
  HASH_PATTERN,
  bytesSha,
  canonicalJson,
  fileRef,
  isObject,
  objectSha,
  writeNewJson,
} from '../../pipeline-core/canonical.mjs';
import {
  assertProductionPayloadClean,
  assertStagingOutput,
  assetSetSha,
} from './production-boundary.mjs';
import {
  validateDefaultVisualGate,
  validateVisualBaselineNonRegression,
} from '../../pipeline-core/solution-visual-benefit.mjs';
import { speedTelemetry } from '../../pipeline-core/speed.mjs';
import { validateCanonicalFinalAuditAuthority } from './release-authority.mjs';

export const REVIEW_READY_SCHEMA = 'APMATH_REVIEW_READY_v1';
export const REVIEW_READY_STATUS = 'REVIEW_READY';
export const REQUIRED_REVIEW_RENDER_CASES = Object.freeze([
  'exam/desktop',
  'exam/mobile',
  'solution/desktop',
  'solution/mobile',
  'answer/desktop',
  'answer/mobile',
]);
export const REVIEW_READY_GATES = Object.freeze([
  'sourceFidelity',
  'math',
  'solutionQuality',
  'visual',
  'metadata',
  'finalAudit',
  'render',
  'baselineNonRegression',
]);

function caseKey(row) {
  if (typeof row === 'string') return row;
  return row?.caseKey || [row?.mode, row?.viewport || row?.viewportProfile].filter(Boolean).join('/');
}

function inside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

function actualFileRef(root, ref) {
  if (!ref?.path) throw new Error('REVIEW_READY_FILE_REF_REQUIRED');
  const base = path.resolve(root);
  const target = path.resolve(base, ref.path);
  const relative = path.relative(base, target);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) throw new Error('REVIEW_READY_FILE_ESCAPE:' + ref.path);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) throw new Error('REVIEW_READY_FILE_MISSING:' + ref.path);
  if (!inside(base, fs.realpathSync(target))) throw new Error('REVIEW_READY_FILE_SYMLINK_ESCAPE:' + ref.path);
  const bytes = fs.readFileSync(target);
  const actual = { path: ref.path, bytes: bytes.length, sha256: bytesSha(bytes) };
  if (ref.bytes !== undefined && ref.bytes !== actual.bytes || ref.sha256 !== undefined && ref.sha256 !== actual.sha256) throw new Error('REVIEW_READY_FILE_SHA_MISMATCH:' + ref.path);
  return actual;
}

function closureSha(closure) {
  const { closureSha: declared, errors: ignoredErrors, ...payload } = closure || {};
  const computed = objectSha(payload);
  if (declared !== undefined && declared !== computed) throw new Error('FINAL_CLOSURE_SHA_MISMATCH');
  return computed;
}

function validateClosureDocument(file, expectedSha) {
  const document = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (document.status !== undefined && document.status !== 'PASS') throw new Error('FINAL_CLOSURE_NOT_PASS');
  if (document.productionAuthorized !== undefined && document.productionAuthorized !== false) throw new Error('FINAL_CLOSURE_PRODUCTION_AUTHORITY_FORBIDDEN');
  const declared = document.closureSha || document.finalClosureSha || null;
  if (declared && declared !== expectedSha) throw new Error('FINAL_CLOSURE_SHA_MISMATCH');
  return document;
}

export function validateRequiredRenderCases(cases = []) {
  const keys = cases.map(caseKey);
  const errors = [];
  for (const required of REQUIRED_REVIEW_RENDER_CASES) {
    const rows = cases.filter(row => caseKey(row) === required);
    if (rows.length !== 1 || rows[0]?.status !== 'PASS') errors.push('REQUIRED_RENDER_CASE_NOT_PASS:' + required);
  }
  for (const actual of keys) if (!REQUIRED_REVIEW_RENDER_CASES.includes(actual)) errors.push('UNEXPECTED_RENDER_CASE:' + actual);
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

function requiredGateErrors(gates) {
  return REVIEW_READY_GATES.filter(key => gates?.[key] !== 'PASS').map(key => 'REVIEW_READY_GATE_NOT_PASS:' + key);
}

export function createReviewReady({
  root,
  run,
  closure,
  finalAudit,
  candidateRef,
  assetRefs = [],
  candidateQuestions = [],
  baselineQuestions = [],
  visualExemptions = {},
  renderCases = [],
  gateStatuses = {},
  finalClosureRef = null,
  finalAuditAuthority = null,
  openDefectCount = 0,
  telemetry = null,
} = {}) {
  const errors = [];
  if (run?.pipeline !== 'past-exam') errors.push('REVIEW_READY_PAST_EXAM_REQUIRED');
  if (run?.publicationIntent !== 'FULL_EXAM') errors.push('REVIEW_READY_FULL_EXAM_REQUIRED');
  if (closure?.status !== 'PASS' || closure?.productionAuthorized !== false) errors.push('REVIEW_READY_CLOSURE_NOT_QUALITY_ONLY');
  if (finalAudit?.status !== 'PASS') errors.push('FINAL_AUDIT_NOT_PASS');
  if (!finalAuditAuthority) errors.push('FINAL_AUDIT_AUTHORITY_REQUIRED');
  if (openDefectCount !== 0) errors.push('OPEN_DEFECT_COUNT_NONZERO');

  let candidate = null;
  let assets = [];
  let closureRef = null;
  let assetBindings = [];
  let authorityValidationMs = 0;
  try {
    if (!root) throw new Error('REVIEW_READY_ROOT_REQUIRED');
    candidate = actualFileRef(root, candidateRef);
    assertStagingOutput(root, candidate.path);
    assets = assetRefs.map(ref => {
      const actual = actualFileRef(root, ref);
      assertStagingOutput(root, actual.path);
      return actual;
    });
    closureRef = actualFileRef(root, finalClosureRef);
    assertStagingOutput(root, closureRef.path);
    validateClosureDocument(path.resolve(root, finalClosureRef.path), closureSha(closure));
    assertProductionPayloadClean({ examTitle: run?.examId || run?.runId || '', questionBank: candidateQuestions });
    const candidateAssetNames = [...new Set(candidateQuestions.flatMap(question => [question.image, question.solutionImage].filter(Boolean).map(value => path.basename(String(value)))))].sort();
    const stagedAssetNames = [...new Set(assets.map(ref => path.basename(String(ref.path))))].sort();
    if (canonicalJson(candidateAssetNames) !== canonicalJson(stagedAssetNames)) throw new Error('REVIEW_READY_ASSET_SET_COVERAGE_FAIL');
    const assetsByName = new Map();
    for (const ref of assets) {
      const name = path.basename(String(ref.path));
      if (assetsByName.has(name)) throw new Error('REVIEW_READY_ASSET_BASENAME_COLLISION:' + name);
      assetsByName.set(name, ref);
    }
    assetBindings = [...new Set(candidateQuestions.flatMap(question => [question.image, question.solutionImage].filter(Boolean).map(String)))].sort().map(candidatePath => {
      const assetRef = assetsByName.get(path.basename(candidatePath));
      if (!assetRef) throw new Error('REVIEW_READY_ASSET_BINDING_MISSING:' + candidatePath);
      return { candidatePath, assetRef };
    });
    if (finalAuditAuthority) {
      const authorityStartedAt = Date.now();
      const authorityValidation = validateCanonicalFinalAuditAuthority(root, {
        authority: finalAuditAuthority,
        expected: {
          examId: run?.examId || run?.sourceExamId || null,
          runId: run?.runId || null,
          revision: run?.revision || null,
          candidateSha256: candidate.sha256,
          assetSetSha256: assetSetSha(assets),
        },
      });
      authorityValidationMs = Math.max(0, Date.now() - authorityStartedAt);
      errors.push(...authorityValidation.errors);
    }
  } catch (error) {
    errors.push(error.message);
  }

  const render = validateRequiredRenderCases(renderCases);
  errors.push(...render.errors);
  const baseline = validateVisualBaselineNonRegression(baselineQuestions, candidateQuestions, { exemptions: visualExemptions });
  errors.push(...baseline.errors);
  errors.push(...requiredGateErrors({ ...gateStatuses, baselineNonRegression: baseline.status }));
  for (const question of candidateQuestions) {
    const key = String(question?.sourceIdentityKey || question?.questionUid || question?.id || '');
    const visual = validateDefaultVisualGate(question, { exemption: visualExemptions[key] });
    errors.push(...visual.errors.map(error => error + ':q' + question.id));
  }
  if (!candidate) errors.push('REVIEW_READY_CANDIDATE_REQUIRED');
  if (!finalClosureRef?.path && !nonempty(finalClosureRef)) errors.push('FINAL_CLOSURE_REF_REQUIRED');
  const telemetryDefaults = speedTelemetry({ questionCount: candidateQuestions.length, auditTimings: { authorityValidationMs } });
  const receiptTelemetry = {
    ...telemetryDefaults,
    ...(telemetry || {}),
    questionCount: telemetry?.questionCount ?? candidateQuestions.length,
    auditTimings: { ...telemetryDefaults.auditTimings, ...(telemetry?.auditTimings || {}), authorityValidationMs: telemetry?.auditTimings?.authorityValidationMs ?? authorityValidationMs },
  };

  const payload = {
    schemaVersion: REVIEW_READY_SCHEMA,
    state: REVIEW_READY_STATUS,
    status: REVIEW_READY_STATUS,
    productionAuthorized: false,
    examId: run?.examId || run?.sourceExamId || null,
    reviewReadyRunId: run?.runId || null,
    revision: run?.revision || null,
    candidateRef: candidate,
    candidateSha256: candidate?.sha256 || null,
    assetRefs: assets,
    assetBindings,
    stagedAssetSetSha256: assetSetSha(assets),
    finalClosureRef: finalClosureRef || null,
    finalClosureRefSha256: closureRef?.sha256 || null,
    finalClosureSha: closureSha(closure),
    finalAuditClosureRef: finalClosureRef || null,
    finalAuditAuthority: finalAuditAuthority || null,
    finalAuditAuthoritySha: finalAuditAuthority?.authoritySha || null,
    requiredRenderCases: [...REQUIRED_REVIEW_RENDER_CASES],
    gateStatuses: { ...gateStatuses, baselineNonRegression: baseline.status },
    openDefectCount,
    renderCases: renderCases.map(row => ({ ...row, caseKey: caseKey(row) })),
    telemetry: receiptTelemetry,
  };

  if (errors.length) return { ...payload, status: 'BLOCKED', state: 'BLOCKED', errors: [...new Set(errors)] };
  return { ...payload, reviewReadySha: objectSha(payload), errors: [] };
}

export function validateReviewReady(ready, { root = null, candidateRef = null, assetRefs = null, validateAuthority = true } = {}) {
  const errors = [];
  if (ready?.schemaVersion !== REVIEW_READY_SCHEMA) errors.push('REVIEW_READY_SCHEMA_INVALID');
  if (ready?.state !== REVIEW_READY_STATUS || ready?.status !== REVIEW_READY_STATUS) errors.push('REVIEW_READY_STATUS_INVALID');
  if (ready?.productionAuthorized !== false) errors.push('REVIEW_READY_PRODUCTION_AUTHORITY_FORBIDDEN');
  if (!ready?.examId || !ready?.reviewReadyRunId) errors.push('REVIEW_READY_IDENTITY_REQUIRED');
  if (!HASH_PATTERN.test(String(ready?.candidateSha256 || ''))) errors.push('REVIEW_READY_CANDIDATE_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(ready?.stagedAssetSetSha256 || ''))) errors.push('REVIEW_READY_ASSET_SET_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(ready?.finalClosureRefSha256 || ''))) errors.push('REVIEW_READY_CLOSURE_REF_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(ready?.finalClosureSha || ''))) errors.push('REVIEW_READY_CLOSURE_SHA_REQUIRED');
  if (!ready?.finalClosureRef?.path && !nonempty(ready?.finalClosureRef)) errors.push('REVIEW_READY_CLOSURE_REF_REQUIRED');
  if (!ready?.finalAuditAuthority) errors.push('FINAL_AUDIT_AUTHORITY_REQUIRED');
  else {
    if (!HASH_PATTERN.test(String(ready.finalAuditAuthoritySha || '')) || ready.finalAuditAuthoritySha !== ready.finalAuditAuthority.authoritySha) errors.push('FINAL_AUDIT_AUTHORITY_SHA_BINDING_FAIL');
    if (root && validateAuthority) errors.push(...validateCanonicalFinalAuditAuthority(root, { authority: ready.finalAuditAuthority, expected: { examId: ready.examId, runId: ready.reviewReadyRunId, revision: ready.revision, candidateSha256: ready.candidateSha256, assetSetSha256: ready.stagedAssetSetSha256 } }).errors);
  }
  errors.push(...requiredGateErrors(ready?.gateStatuses));
  errors.push(...validateRequiredRenderCases(ready?.renderCases || []).errors);
  if (ready?.openDefectCount !== 0) errors.push('OPEN_DEFECT_COUNT_NONZERO');
  const telemetryFields = ['questionCount', 'finalAuditInvocationCount', 'targetedRecheckInvocationCount', 'reviewedQuestionAxisCount', 'reusedPassQuestionAxisCount', 'repairIterationCount', 'newSolutionVisualCount', 'reusedVisualCount', 'renderFreshCount', 'renderReusedCount', 'providerInvocationCount', 'modelInvocationCount'];
  if (!isObject(ready?.telemetry)) errors.push('REVIEW_READY_TELEMETRY_REQUIRED');
  else {
    for (const field of telemetryFields) if (!Number.isSafeInteger(ready.telemetry[field]) || ready.telemetry[field] < 0) errors.push('REVIEW_READY_TELEMETRY_INVALID:' + field);
    if (typeof ready.telemetry.skipExistingExam !== 'boolean') errors.push('REVIEW_READY_TELEMETRY_INVALID:skipExistingExam');
  }
  if (!Array.isArray(ready?.assetBindings)) errors.push('REVIEW_READY_ASSET_BINDINGS_REQUIRED');
  else {
    const refsByName = new Map((ready.assetRefs || []).map(ref => [path.basename(String(ref.path)), ref]));
    for (const binding of ready.assetBindings) {
      const name = path.basename(String(binding?.candidatePath || ''));
      const ref = refsByName.get(name);
      if (!name || !ref || canonicalJson(ref) !== canonicalJson(binding.assetRef)) errors.push('REVIEW_READY_ASSET_BINDING_INVALID:' + String(binding?.candidatePath || ''));
    }
  }
  const { reviewReadySha: ignored, errors: ignoredErrors, ...payload } = ready || {};
  if (!HASH_PATTERN.test(String(ready?.reviewReadySha || '')) || ready.reviewReadySha !== objectSha(payload)) errors.push('REVIEW_READY_SHA_MISMATCH');

  if (root) {
    try {
      const candidate = actualFileRef(root, candidateRef || ready.candidateRef);
      if (candidate.sha256 !== ready.candidateSha256) errors.push('REVIEW_READY_CANDIDATE_SHA_MISMATCH');
      assertStagingOutput(root, candidate.path);
      const actualAssets = (assetRefs || ready.assetRefs || []).map(ref => {
        const actual = actualFileRef(root, ref);
        assertStagingOutput(root, actual.path);
        return actual;
      });
      if (assetSetSha(actualAssets) !== ready.stagedAssetSetSha256) errors.push('REVIEW_READY_ASSET_SET_SHA_MISMATCH');
      for (const binding of ready.assetBindings || []) {
        const actual = actualAssets.find(ref => ref.path === binding.assetRef.path);
        if (!actual || actual.sha256 !== binding.assetRef.sha256 || actual.bytes !== binding.assetRef.bytes) errors.push('REVIEW_READY_ASSET_BINDING_SHA_MISMATCH:' + binding.candidatePath);
      }
      const actualClosure = actualFileRef(root, ready.finalClosureRef);
      if (actualClosure.sha256 !== ready.finalClosureRefSha256) errors.push('REVIEW_READY_CLOSURE_REF_SHA_MISMATCH');
      try { validateClosureDocument(path.resolve(root, ready.finalClosureRef.path), ready.finalClosureSha); } catch (error) { errors.push(error.message); }
      if (ready.finalAuditAuthority && validateAuthority) errors.push(...validateCanonicalFinalAuditAuthority(root, { authority: ready.finalAuditAuthority, expected: { examId: ready.examId, runId: ready.reviewReadyRunId, revision: ready.revision, candidateSha256: ready.candidateSha256, assetSetSha256: ready.stagedAssetSetSha256 } }).errors);
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)] };
}

export function assertReviewReady(ready, options = {}) {
  const result = validateReviewReady(ready, options);
  if (result.status !== 'PASS') throw new Error('REVIEW_READY_BLOCKED:' + result.errors.join(';'));
  return result;
}

export function writeReviewReady(root, output, ready) {
  assertStagingOutput(root, output, 'REVIEW_READY_OUTPUT_FORBIDDEN');
  writeNewJson(path.resolve(root, output), ready);
  return fileRef(root, output);
}

function nonempty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export { validateDefaultVisualGate, validateVisualBaselineNonRegression };
