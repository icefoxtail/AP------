import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {physical, writeFresh} from './archive-codex-artifact-io.mjs';

export const SOURCE_REFERENCE_POLICY_SCHEMA = 'JS_ARCHIVE_SOURCE_REFERENCE_POLICY_V1';
export const SOURCE_INPUT_MODE = 'EXTRACTED_JS_ASSETS';
export const PDF_REVIEW_MODE = 'DEFECT_ONLY';

const stages = new Set(['CREATE', 'R1', 'R2', 'R3']);
const sourceDefectCategories = new Set([
  'MISSING_ASSET',
  'UNCLEAR_CONDITION',
  'TRANSCRIPTION_ERROR',
  'JS_ASSET_CONFLICT',
  'IDENTITY_CONFLICT',
]);
const nonSourceCategories = new Set([
  'ANSWER_MISMATCH',
  'CALCULATION_ERROR',
  'TEX_FORMAT',
  'SVG_SOLUTION_ERROR',
  'RENDER_ERROR',
  'HASH_ERROR',
  'RECEIPT_ERROR',
]);
const sha256Pattern = /^[a-f0-9]{64}$/;
const absolute = (value, label) => {
  if (typeof value !== 'string' || !path.isAbsolute(value)) throw Error(`${label}_ABSOLUTE_PATH_REQUIRED`);
  return path.resolve(value);
};
const qidList = (value, label) => {
  if (!Array.isArray(value) || !value.length || value.some(qid => !Number.isInteger(qid) || qid < 1) || new Set(value).size !== value.length) throw Error(`${label}_EXACT_QIDS_REQUIRED`);
  return [...value].sort((a, b) => a - b);
};

function checkedEvidenceRef(ref, label) {
  if (!ref || typeof ref !== 'object') throw Error(`${label}_REQUIRED`);
  const file = absolute(ref.path, `${label}_PATH`);
  if (typeof ref.sha256 !== 'string' || !sha256Pattern.test(ref.sha256)) throw Error(`${label}_SHA256_REQUIRED`);
  let current;
  try { current = physical(file); } catch { throw Error(`${label}_FILE_UNAVAILABLE`); }
  if (current.sha256 !== ref.sha256) throw Error(`${label}_SHA256_MISMATCH`);
  return {path: file, sha256: current.sha256};
}

function normalizeDefect(defect) {
  if (!defect || typeof defect !== 'object') throw Error('SOURCE_DEFECT_OBJECT_REQUIRED');
  if (!sourceDefectCategories.has(defect.category)) throw Error(`UNSUPPORTED_SOURCE_DEFECT_CATEGORY:${String(defect.category)}`);
  const qids = qidList(defect.qids, 'SOURCE_DEFECT');
  if (defect.scope !== 'QID_ONLY') throw Error('SOURCE_DEFECT_SCOPE_MUST_BE_QID_ONLY');
  const reason = typeof defect.reason === 'string' ? defect.reason.trim() : '';
  if (!reason) throw Error('SOURCE_DEFECT_SPECIFIC_REASON_REQUIRED');
  if (!Array.isArray(defect.findings)) throw Error('SOURCE_DEFECT_FINDINGS_REQUIRED');
  const findings = defect.findings.map(row => {
    if (!row || !Number.isInteger(row.qid) || !qids.includes(row.qid)) throw Error('SOURCE_DEFECT_FINDING_QID_SCOPE_INVALID');
    const detail = typeof row.detail === 'string' ? row.detail.trim() : '';
    if (!detail) throw Error(`SOURCE_DEFECT_FINDING_DETAIL_REQUIRED:${row.qid}`);
    return {qid: row.qid, detail};
  }).sort((a, b) => a.qid - b.qid);
  if (!sameQids(findings.map(row => row.qid), qids)) throw Error('SOURCE_DEFECT_FINDINGS_QID_DENOMINATOR_REQUIRED');
  if (defect.fullPaper === true || defect.scope === 'FULL_PAPER') throw Error('FULL_PAPER_SOURCE_REVIEW_FORBIDDEN');
  return {category: defect.category, qids, scope: 'QID_ONLY', reason, findings};
}

function sameQids(a, b) { return a.length === b.length && a.every((qid, index) => qid === b[index]); }

export function decideSourceReferencePolicy({stage, workerIssueCategory = null, sourceDefect = null, reusedIntakeEvidence = null, originalSourceReviewEvidence = null} = {}) {
  if (!stages.has(stage)) throw Error('CURRENT_ARCHIVE_STAGE_REQUIRED');
  if (workerIssueCategory !== null && !nonSourceCategories.has(workerIssueCategory) && !sourceDefect) throw Error(`UNSUPPORTED_WORKER_FINDING_CATEGORY:${String(workerIssueCategory)}`);
  if (workerIssueCategory !== null && !nonSourceCategories.has(workerIssueCategory) && sourceDefect) throw Error(`UNSUPPORTED_WORKER_FINDING_CATEGORY:${String(workerIssueCategory)}`);
  const defect = sourceDefect ? normalizeDefect(sourceDefect) : null;
  const intakeEvidence = reusedIntakeEvidence ? checkedEvidenceRef(reusedIntakeEvidence, 'REUSED_INTAKE_EVIDENCE') : null;
  let originalReview = null;
  if (originalSourceReviewEvidence) {
    const originalPdf = checkedEvidenceRef(originalSourceReviewEvidence.originalPdf, 'ORIGINAL_PDF');
    const reviewEvidence = checkedEvidenceRef(originalSourceReviewEvidence.evidence, 'ORIGINAL_SOURCE_REVIEW_EVIDENCE');
    const reviewedQids = qidList(originalSourceReviewEvidence.reviewedQids, 'ORIGINAL_SOURCE_REVIEW');
    if (defect && !sameQids(reviewedQids, defect.qids)) throw Error('ORIGINAL_SOURCE_REVIEW_QID_SCOPE_MISMATCH');
    if (typeof originalSourceReviewEvidence.reviewerId !== 'string' || !originalSourceReviewEvidence.reviewerId.trim()) throw Error('ORIGINAL_SOURCE_REVIEWER_ID_REQUIRED');
    if (typeof originalSourceReviewEvidence.reviewedAt !== 'string' || !Number.isFinite(Date.parse(originalSourceReviewEvidence.reviewedAt))) throw Error('ORIGINAL_SOURCE_REVIEW_TIME_REQUIRED');
    originalReview = {
      originalPdf,
      evidence: reviewEvidence,
      reviewedQids,
      reviewerId: originalSourceReviewEvidence.reviewerId.trim(),
      reviewedAt: originalSourceReviewEvidence.reviewedAt,
      physicalPdfSha256Verified: true,
      pdfByteInspection: 'SHA256_ONLY',
      readingAttestationBasis: 'REVIEWER_EVIDENCE',
    };
  }
  if (originalReview && !defect) throw Error('ORIGINAL_SOURCE_REVIEW_REQUIRES_SCOPED_SOURCE_DEFECT');
  const policy = {
    schemaVersion: SOURCE_REFERENCE_POLICY_SCHEMA,
    stage,
    sourceInputMode: SOURCE_INPUT_MODE,
    pdfReviewMode: PDF_REVIEW_MODE,
    sourceParityBasis: intakeEvidence ? 'REUSED_INTAKE_EVIDENCE' : 'EXTRACTED_INPUT_BASELINE',
    reusedIntakeEvidence: intakeEvidence,
    pdfActuallyReviewed: Boolean(originalReview),
    originalSourceReviewEvidence: originalReview,
    sourceDefect: defect,
    originalReferencePlan: defect ? {
      required: !originalReview,
      scope: 'QID_ONLY',
      qids: defect.qids,
      category: defect.category,
      reason: defect.reason,
      findings: defect.findings,
      evidenceRequirement: 'ACTUAL_ORIGINAL_SOURCE_SHA_AND_QID_SCOPED_REVIEW_FINDINGS',
    } : null,
    semanticVerdictCreated: false,
  };
  return policy;
}

export function validateSourceReferencePolicy(policy, {stage} = {}) {
  if (!policy || typeof policy !== 'object' || policy.schemaVersion !== SOURCE_REFERENCE_POLICY_SCHEMA) throw Error('SOURCE_REFERENCE_POLICY_REQUIRED');
  const expected = decideSourceReferencePolicy({
    stage: stage || policy.stage,
    workerIssueCategory: policy.workerIssueCategory || null,
    sourceDefect: policy.sourceDefect || null,
    reusedIntakeEvidence: policy.reusedIntakeEvidence || null,
    originalSourceReviewEvidence: policy.originalSourceReviewEvidence || null,
  });
  if (policy.stage !== expected.stage || policy.sourceInputMode !== expected.sourceInputMode || policy.pdfReviewMode !== expected.pdfReviewMode || policy.sourceParityBasis !== expected.sourceParityBasis || policy.pdfActuallyReviewed !== expected.pdfActuallyReviewed || policy.semanticVerdictCreated !== false) throw Error('SOURCE_REFERENCE_POLICY_DEFAULT_OR_HONESTY_MISMATCH');
  if (JSON.stringify(policy) !== JSON.stringify(expected)) throw Error('SOURCE_REFERENCE_POLICY_CONTENT_MISMATCH');
  return expected;
}

export function buildSourceReferenceAssignmentMetadata(options = {}) {
  const sourceReferencePolicy = decideSourceReferencePolicy(options);
  return {schemaVersion: 'JS_ARCHIVE_CODEX_SOURCE_REFERENCE_ASSIGNMENT_V1', sourceReferencePolicy};
}

export function validateSourceReferenceAssignmentMetadata(metadata, {stage} = {}) {
  if (!metadata || metadata.schemaVersion !== 'JS_ARCHIVE_CODEX_SOURCE_REFERENCE_ASSIGNMENT_V1') throw Error('SOURCE_REFERENCE_ASSIGNMENT_METADATA_REQUIRED');
  return validateSourceReferencePolicy(metadata.sourceReferencePolicy, {stage});
}

function parse(argv) {
  const [command, ...args] = argv, options = {};
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (!flag.startsWith('--')) throw Error(`FLAG_REQUIRED:${flag}`);
    const key = flag.slice(2);
    if (Object.hasOwn(options, key)) throw Error(`DUPLICATE_FLAG:${key}`);
    options[key] = args[++index];
  }
  return {command, options};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const {command, options} = parse(process.argv.slice(2));
    if (command !== 'decide') throw Error('COMMAND_REQUIRED:decide');
    const readJson = key => options[key] ? JSON.parse(fs.readFileSync(absolute(options[key], key.toUpperCase()), 'utf8')) : null;
    const defect = readJson('source-defect');
    const policy = decideSourceReferencePolicy({
      stage: options.stage,
      workerIssueCategory: options['worker-issue-category'] || null,
      sourceDefect: defect,
      reusedIntakeEvidence: readJson('intake-evidence'),
      originalSourceReviewEvidence: readJson('original-review-evidence'),
    });
    const metadata = {schemaVersion: 'JS_ARCHIVE_CODEX_SOURCE_REFERENCE_ASSIGNMENT_V1', sourceReferencePolicy: policy};
    const ref = options.output ? writeFresh(absolute(options.output, 'POLICY_OUTPUT'), metadata) : null;
    console.log(JSON.stringify(ref ? {metadata, ref} : metadata, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ok: false, error: error.message}, null, 2));
    process.exitCode = 2;
  }
}
