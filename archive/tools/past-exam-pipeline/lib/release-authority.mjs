import { HASH_PATTERN, canonicalJson, objectSha } from '../../pipeline-core/canonical.mjs';
import { assetSetSha, readActualRef } from './production-boundary.mjs';

export const EXTERNAL_APPROVAL_SCHEMA = 'APMATH_FINAL_EXTERNAL_APPROVAL_v1';
export const RELEASE_TRANSACTION_VERSION = 'APMATH_APPROVED_RELEASE_TRANSACTION_v1';
export const RELEASE_TRANSACTION_STATES = Object.freeze([
  'REVIEW_READY',
  'EXTERNAL_APPROVED',
  'PROMOTE_APPROVED_EXAM',
  'PROMOTION_PARITY_PASS',
  'REGISTER_APPROVED_EXAM',
  'DB_TARGET_PARITY_PASS',
  'INDEX_REBUILD',
  'INDEX_TARGET_PARITY_PASS',
  'PRODUCTION_SMOKE_RENDER',
  'DONE',
]);

export function validateExternalApproval({ root, reviewReady, approval, candidateRef = null, assetRefs = null } = {}) {
  const errors = [];
  if (approval?.schemaVersion !== EXTERNAL_APPROVAL_SCHEMA) errors.push('APPROVAL_RECEIPT_SCHEMA_INVALID');
  if (approval?.approvalStatus !== 'APPROVED') errors.push('APPROVAL_STATUS_NOT_APPROVED');
  if (!approval?.examId || approval.examId !== reviewReady?.examId) errors.push('APPROVAL_EXAM_ID_MISMATCH');
  if (!approval?.reviewReadyRunId || approval.reviewReadyRunId !== reviewReady?.reviewReadyRunId) errors.push('APPROVAL_REVIEW_READY_RUN_MISMATCH');
  if (!HASH_PATTERN.test(String(approval?.reviewReadySha || ''))) errors.push('APPROVAL_REVIEW_READY_SHA_REQUIRED');
  if (approval?.reviewReadySha !== reviewReady?.reviewReadySha) errors.push('APPROVAL_REVIEW_READY_SHA_MISMATCH');
  if (!HASH_PATTERN.test(String(approval?.candidateSha256 || ''))) errors.push('APPROVAL_CANDIDATE_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(approval?.stagedAssetSetSha256 || ''))) errors.push('APPROVAL_ASSET_SET_SHA_REQUIRED');
  if (!HASH_PATTERN.test(String(approval?.finalClosureSha || ''))) errors.push('APPROVAL_CLOSURE_SHA_REQUIRED');
  if (approval?.candidateSha256 !== reviewReady?.candidateSha256) errors.push('APPROVAL_CANDIDATE_SHA_NOT_REVIEW_READY');
  if (approval?.stagedAssetSetSha256 !== reviewReady?.stagedAssetSetSha256) errors.push('APPROVAL_ASSET_SET_SHA_NOT_REVIEW_READY');
  if (approval?.finalClosureSha !== reviewReady?.finalClosureSha) errors.push('APPROVAL_CLOSURE_SHA_NOT_REVIEW_READY');
  if (!approval?.approvalEvidenceIdentity) errors.push('APPROVAL_EVIDENCE_IDENTITY_REQUIRED');
  if (!HASH_PATTERN.test(String(approval?.approvalEvidenceSha256 || ''))) errors.push('APPROVAL_EVIDENCE_SHA_REQUIRED');
  if (!Number.isFinite(Date.parse(approval?.approvedAt))) errors.push('APPROVAL_TIMESTAMP_REQUIRED');

  if (root) {
    try {
      const candidate = readActualRef(root, candidateRef || reviewReady.candidateRef);
      if (candidate.sha256 !== approval.candidateSha256) errors.push('APPROVED_CANDIDATE_SHA_MISMATCH');
      const actualAssets = (assetRefs || reviewReady.assetRefs || []).map(ref => readActualRef(root, ref));
      if (assetSetSha(actualAssets) !== approval.stagedAssetSetSha256) errors.push('APPROVED_ASSET_SET_SHA_MISMATCH');
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)] };
}

export function assertExternalApproval(options = {}) {
  const result = validateExternalApproval(options);
  if (result.status !== 'PASS') throw new Error('EXTERNAL_APPROVAL_BLOCKED:' + result.errors.join(';'));
  return result;
}

export function validateProductionSmokeRender(report, expectedCount = null) {
  const errors = [];
  const rows = Array.isArray(report?.cases) ? report.cases : [];
  const keys = rows.map(row => row.caseKey || [row.mode, row.profile || row.viewport || row.viewportProfile].filter(Boolean).join('/'));
  const required = ['exam/desktop', 'exam/mobile', 'solution/desktop', 'solution/mobile', 'answer/desktop', 'answer/mobile'];
  for (const key of required) {
    const matches = rows.filter((row, index) => keys[index] === key);
    if (matches.length !== 1 || matches[0].status !== 'PASS') errors.push('PRODUCTION_SMOKE_CASE_NOT_PASS:' + key);
    if (matches.length === 1 && expectedCount !== null && (matches[0].expectedQuestionCount !== expectedCount || matches[0].observedQuestionCount !== expectedCount)) errors.push('PRODUCTION_SMOKE_COUNT_MISMATCH:' + key);
  }
  for (const key of keys) if (!required.includes(key)) errors.push('PRODUCTION_SMOKE_UNEXPECTED_CASE:' + key);
  if (report?.status !== 'PASS') errors.push('PRODUCTION_SMOKE_REPORT_NOT_PASS');
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)] };
}

export function assertProductionSmokeRender(report, expectedCount = null) {
  const result = validateProductionSmokeRender(report, expectedCount);
  if (result.status !== 'PASS') throw new Error('PRODUCTION_SMOKE_BLOCKED:' + result.errors.join(';'));
  return result;
}

export function validateTargetParity({ examId, targetFile, questionCount, dbEntry, indexRows = [] } = {}) {
  const errors = [];
  const target = String(targetFile || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '');
  if (!examId || !targetFile) errors.push('TARGET_PARITY_IDENTITY_REQUIRED');
  if (String(dbEntry?.file || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '') !== target) errors.push('DB_TARGET_FILE_MISMATCH');
  if (dbEntry?.qCount !== questionCount) errors.push('DB_TARGET_QCOUNT_MISMATCH');
  const targetRows = indexRows.filter(row => String(row.sourceFile || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '') === target);
  if (targetRows.length !== questionCount) errors.push('INDEX_TARGET_QCOUNT_MISMATCH');
  const expectedKeys = new Set(Array.from({ length: questionCount }, (_, index) => target + '_' + (index + 1)));
  const actualKeys = new Set(targetRows.map(row => row.qKey));
  if (canonicalJson([...actualKeys].sort()) !== canonicalJson([...expectedKeys].sort())) errors.push('INDEX_TARGET_QKEY_SET_MISMATCH');
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)], examId, targetFile: target, questionCount };
}

export function assertTargetParity(options = {}) {
  const result = validateTargetParity(options);
  if (result.status !== 'PASS') throw new Error('TARGET_PARITY_BLOCKED:' + result.errors.join(';'));
  return result;
}

export function createReleaseTransaction({ reviewReady, approval, stages = [], status = 'HOLD', failure = null } = {}) {
  const payload = {
    schemaVersion: RELEASE_TRANSACTION_VERSION,
    examId: reviewReady?.examId || null,
    reviewReadyRunId: reviewReady?.reviewReadyRunId || null,
    reviewReadySha: reviewReady?.reviewReadySha || null,
    approvalStatus: approval?.approvalStatus || null,
    stages: [...stages],
    status,
    productionAuthorized: status === 'DONE',
    failure,
  };
  return { ...payload, transactionSha: objectSha(payload) };
}
