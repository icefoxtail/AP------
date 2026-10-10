#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const EVIDENCE_HISTORY_SCHEMA = 'JS_ARCHIVE_PHYSICAL_EXAM_BINDING_HISTORY_V1';
const SOURCE_REFRESH_SCHEMA = 'JS_ARCHIVE_SOURCE_REFRESH_REVIEW_V1';
const SOURCE_REFRESH_HISTORY_SCHEMA = 'JS_ARCHIVE_SOURCE_REFRESH_REVIEW_HISTORY_V1';
const RECEIPT_DIR = 'archive/data/r2e-intake/m2/source-refresh-receipts';
const ALLOWED = new Set([
  'archive/exams/original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js',
  'archive/exams/original/middle/m2/1mid/19_연향중_1학기_중간_중2_기출.js',
  'archive/exams/original/middle/m2/1final/24_연향중_1학기_기말_중2_기출.js',
  'archive/exams/original/middle/m2/1final/24_승평중_1학기_기말_중2_기출.js',
  'archive/exams/original/middle/m2/1final/24_삼산중_1학기_기말_중2_기출.js',
  'archive/exams/original/middle/m2/1final/23_신흥중_1학기_기말_중2_기출.js',
  'archive/exams/original/middle/m2/1final/22_왕운중_1학기_기말_중2_기출.js',
  'archive/exams/original/middle/m2/1final/22_연향중_1학기_기말_중2_기출.js',
  'archive/exams/original/middle/m2/1final/24_왕운중_1학기_기말_중2_기출.js',
  'archive/exams/original/middle/m2/1final/24_금당중_1학기_기말_중2_기출.js',
]);
const SUPPORTED = new Set([
  'APMATH_SCOPED_R1_SOURCE_REFRESH_RECEIPT_V1',
  'JS_ARCHIVE_R1_SCOPED_CURRENT_SOURCE_REFRESH_V1',
  'M2_SCOPED_R1_SOURCE_REFRESH_V1',
  'M2_SCOPED_R1_CORRECTION_REVIEW_V1',
  'M2_SCOPED_R1_META_FOLLOWUP_V1',
  'M2_SCOPED_R1_Q16_CONTENT_LAYOUT_FOLLOWUP_V1',
  'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1',
  'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2',
  'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_REVIEW_V1',
  'JS_ARCHIVE_R1_SOURCE_REFRESH_REVIEW_V1',
  'JS_ARCHIVE_R1_SOURCE_REFRESH_V1',
  'JS_ARCHIVE_R1_SOURCE_HOLD_V1',
  'APMATH_TARGETED_R1_META_SCOPE_REFRESH_V1',
  'M2_META_SCOPE_REFRESH_R1_RECEIPT_V1',
]);
const META_FIELDS = new Set([
  'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit',
  'subUnitConfidence', 'subUnitClassificationDepth', 'problemTypeKey', 'templateKey',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
  'legacyLevelCompatibility', 'tags', 'rpmL3', 'rpmL4', 'meta',
]);
const IMAGE_FIELDS = new Set(['image', 'images', 'visualAsset', 'solutionImage', 'assets', 'imageSize', 'solutionImageSize']);
const STUDENT_PARITY_FIELDS = [
  'id', 'content', 'choices', 'answer', 'solution', 'image', 'images', 'visualAsset',
  'solutionImage', 'imageSize', 'solutionImageSize', 'assets', 'sharedMaterial', 'passage',
  'questionType', 'layoutTag', 'wide', 'difficultyBucket', 'difficultyConfidence',
  'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'level',
];
const SOURCE_ONLY_STUDENT_FIELDS = [
  'id', 'content', 'choices', 'image', 'images', 'visualAsset', 'solutionImage', 'imageSize',
  'solutionImageSize', 'assets', 'sharedMaterial', 'passage', 'questionType', 'layoutTag',
  'wide', 'level', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
  'legacyLevelCompatibility',
];
const sha256 = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const normalize = value => String(value || '').replaceAll('\\', '/');
function fail(code, details = '') { throw new Error(details ? `${code}:${details}` : code); }

function repoPath(root, input, name) {
  if (!nonempty(input) || path.isAbsolute(input) || /^[A-Za-z]:[\\/]/.test(input)) fail(`${name}_REPO_RELATIVE_PATH_REQUIRED`);
  const rel = normalize(input);
  if (rel.split('/').some(part => part === '..' || part === '.')) fail(`${name}_PATH_TRAVERSAL`);
  const absolute = path.resolve(root, ...rel.split('/'));
  if (!absolute.startsWith(path.resolve(root) + path.sep)) fail(`${name}_PATH_OUTSIDE_REPOSITORY`);
  return { rel, absolute };
}

function git(root, args, input) {
  return execFileSync('git', args, { cwd: root, input, encoding: input ? undefined : 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}
function gitBlobSha(root, bytes) {
  return git(root, ['hash-object', '--stdin'], bytes).toString('utf8').trim();
}
function baselineBytes(root, commit, examRel) {
  try { return git(root, ['show', `${commit}:${examRel}`]); }
  catch { fail('BASELINE_SOURCE_NOT_FOUND', `${commit}:${examRel}`); }
}
function resolveCommit(root, value) {
  try { return git(root, ['rev-parse', '--verify', `${value}^{commit}`]).toString('utf8').trim(); }
  catch { fail('BASELINE_COMMIT_INVALID', value); }
}
function bank(bytes, label) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(bytes.toString('utf8'), sandbox, { filename: label, timeout: 5000 });
  const questions = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(questions) || !questions.length) fail('QUESTION_BANK_REQUIRED', label);
  const ids = questions.map(q => Number(q.id));
  if (ids.some(id => !Number.isInteger(id)) || new Set(ids).size !== ids.length) fail('QUESTION_QID_INVALID_OR_DUPLICATE', label);
  return questions;
}
function stable(value) { return JSON.stringify(value); }
function fieldDiff(oldQ, currentQ) {
  const keys = new Set([...Object.keys(oldQ || {}), ...Object.keys(currentQ || {})]);
  return [...keys].filter(key => stable(oldQ?.[key]) !== stable(currentQ?.[key])).sort();
}
export function deriveSourceDelta(oldBank, currentBank) {
  const oldById = new Map(oldBank.map(q => [Number(q.id), q]));
  const currentById = new Map(currentBank.map(q => [Number(q.id), q]));
  const allIds = [...new Set([...oldById.keys(), ...currentById.keys()])].sort((a, b) => a - b);
  if (oldById.size !== currentById.size || allIds.some(id => !oldById.has(id) || !currentById.has(id))) fail('QUESTION_IDENTITY_DENOMINATOR_CHANGED');
  const changed = [];
  const unchangedQids = [];
  const studentPayloadUnchangedQids = [];
  const studentPayloadChangedQids = [];
  const sourceStudentUnchangedQids = [];
  const sourceStudentChangedQids = [];
  for (const qid of allIds) {
    const oldQ = oldById.get(qid), currentQ = currentById.get(qid);
    const fields = fieldDiff(oldQ, currentQ);
    if (fields.length) changed.push({ qid, fields });
    else unchangedQids.push(qid);
    if (stable(Object.fromEntries(STUDENT_PARITY_FIELDS.filter(key => key in oldQ || key in currentQ).map(key => [key, oldQ?.[key]]))) ===
        stable(Object.fromEntries(STUDENT_PARITY_FIELDS.filter(key => key in oldQ || key in currentQ).map(key => [key, currentQ?.[key]])))) {
      studentPayloadUnchangedQids.push(qid);
    } else studentPayloadChangedQids.push(qid);
    if (stable(Object.fromEntries(SOURCE_ONLY_STUDENT_FIELDS.filter(key => key in oldQ || key in currentQ).map(key => [key, oldQ?.[key]]))) ===
        stable(Object.fromEntries(SOURCE_ONLY_STUDENT_FIELDS.filter(key => key in oldQ || key in currentQ).map(key => [key, currentQ?.[key]])))) {
      sourceStudentUnchangedQids.push(qid);
    } else sourceStudentChangedQids.push(qid);
  }
  return { changed, unchangedQids, studentPayloadUnchangedQids, studentPayloadChangedQids, sourceStudentUnchangedQids, sourceStudentChangedQids, oldById, currentById };
}

function receiptSourcePath(root, value, expectedExam) {
  if (!nonempty(value)) return false;
  const normalized = normalize(value);
  if (/^[A-Za-z]:\//.test(normalized)) {
    const actual = path.resolve(normalized).toLowerCase();
    return actual === path.resolve(root, expectedExam).toLowerCase();
  }
  if (normalized.replace(/^\.\//, '') === expectedExam) return true;
  return !normalized.includes('/') && normalized.replace(/\.js$/i, '') === path.basename(expectedExam, '.js');
}
function resolveReceiptFile(root, value, label) {
  if (!nonempty(value)) fail(`${label}_PATH_REQUIRED`);
  const absolute = path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value)
    ? path.resolve(value)
    : path.resolve(root, ...normalize(value).split('/'));
  if (!absolute.toLowerCase().startsWith((path.resolve(root) + path.sep).toLowerCase()) || !fs.existsSync(absolute)) fail(`${label}_PATH_INVALID`, value);
  return absolute;
}
export function receiptSchema(receipt) { return receipt.schemaVersion || receipt.schema || ''; }
function isMetaSchema(schema) { return schema === 'APMATH_TARGETED_R1_META_SCOPE_REFRESH_V1' || schema === 'M2_META_SCOPE_REFRESH_R1_RECEIPT_V1'; }
function isCorrectionSchema(schema) { return schema === 'M2_SCOPED_R1_CORRECTION_REVIEW_V1'; }
function isM2CurrentExamRefresh(receipt, schema = receiptSchema(receipt)) { return schema === 'M2_SCOPED_R1_SOURCE_REFRESH_V1' && Boolean(receipt.currentExam); }
function isGoldM2R1RefreshSchema(schema) { return ['JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_REVIEW_V1', 'JS_ARCHIVE_R1_SOURCE_REFRESH_REVIEW_V1', 'JS_ARCHIVE_R1_SOURCE_REFRESH_V1'].includes(schema); }
export function receiptSource(receipt, schema) {
  if (isGoldM2R1RefreshSchema(schema)) {
    const binding = receipt.artifactBinding || {};
    const holdSource = receipt.q24Hold?.sourceBinding || {};
    return { path: binding.path, sha256: binding.currentRawSha256, blob: binding.currentRawBufferBlobSha1 || holdSource.currentRawBufferBlobSha1, questionCount: receipt.fieldDiff?.questionCount?.current };
  }
  if (schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1') {
    const binding = receipt.sourceBinding || {};
    return { path: receipt.exam, sha256: binding.currentRawSha256, blob: binding.currentRawBufferBlobSha1, questionCount: null };
  }
  if (schema === 'JS_ARCHIVE_R1_SOURCE_REFRESH_REVIEW_V1') {
    const binding = receipt.artifactBinding || {};
    const holdSource = receipt.q24Hold?.sourceBinding || {};
    return { path: binding.path, sha256: binding.currentRawSha256, blob: binding.currentRawBufferBlobSha1 || holdSource.currentRawBufferBlobSha1, questionCount: receipt.fieldDiff?.questionCount?.current };
  }
  if (schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1') {
    const binding = receipt.sourceBinding || {};
    return { path: receipt.exam, sha256: binding.currentRawSha256, blob: binding.currentRawBufferBlobSha1, questionCount: null };
  }
  if (schema === 'M2_SCOPED_R1_SOURCE_REFRESH_V1' && receipt.currentExam) {
    return { path: receipt.currentExam.path, sha256: receipt.currentExam.rawSha256, blob: receipt.currentExam.rawBufferBlobSha1, questionCount: receipt.currentExam.questionCount };
  }
  if (schema === 'APMATH_TARGETED_R1_META_SCOPE_REFRESH_V1' || schema === 'M2_META_SCOPE_REFRESH_R1_RECEIPT_V1') {
    return { path: receipt.examPath, sha256: receipt.current?.sha256 || receipt.currentArtifact?.sha256, blob: receipt.current?.gitBlobSha1 || receipt.currentArtifact?.gitBlobSha1, questionCount: receipt.current?.qidCount || receipt.currentArtifact?.qidCount };
  }
  if (schema === 'APMATH_SCOPED_R1_SOURCE_REFRESH_RECEIPT_V1' || schema === 'M2_SCOPED_R1_SOURCE_REFRESH_V1' || isCorrectionSchema(schema)) {
    return { path: receipt.source?.path, sha256: receipt.source?.rawSha256, blob: receipt.source?.rawBufferGitBlobSha1 || receipt.source?.rawBufferBlobSha1, questionCount: receipt.source?.questionCount };
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_CURRENT_SOURCE_REFRESH_V1') {
    return { path: receipt.currentSource?.path, sha256: receipt.currentSource?.rawSha256, blob: receipt.currentSource?.rawBufferGitBlobSha1, questionCount: receipt.currentSource?.questionCount };
  }
  if (schema === 'M2_SCOPED_R1_META_FOLLOWUP_V1') {
    return { path: receipt.source?.path, sha256: receipt.source?.rawSha256, blob: receipt.source?.rawBufferBlobSha1 || receipt.source?.rawBufferGitBlobSha1, questionCount: receipt.source?.questionCount };
  }
  if (schema === 'M2_SCOPED_R1_Q16_CONTENT_LAYOUT_FOLLOWUP_V1') {
    return { path: receipt.source?.path, sha256: receipt.source?.rawSha256, blob: receipt.source?.rawBufferBlobSha1, questionCount: receipt.source?.questionCount };
  }
  if (schema === 'JS_ARCHIVE_STAGE_EVIDENCE_v2') {
    return { path: receipt.sourcePath, sha256: receipt.sourceRawSha256, blob: receipt.artifactSha, questionCount: null };
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1') {
    return { path: receipt.currentSource?.path, sha256: receipt.currentSource?.rawSha256, blob: receipt.currentSource?.rawBufferGitBlobSha1, questionCount: receipt.currentSource?.questionCount };
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2') {
    return { path: receipt.target?.productionRelativePath, sha256: receipt.current?.rawSha256, blob: receipt.current?.rawBufferBlobSha1 || receipt.current?.rawBufferGitBlobSha1, questionCount: receipt.denominator?.current };
  }
  return null;
}
export function receiptRows(receipt, schema) {
  if (isGoldM2R1RefreshSchema(schema)) {
    const reviewed = new Set((receipt.fieldDiff?.changedSolutionQidsReviewed || []).map(Number));
    return (receipt.rows || []).filter(row => reviewed.has(Number(row.qid))).map(row => ({ qid: Number(row.qid), row: { ...row, fields: ['solution'] } }));
  }
  if (schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1') return Number.isInteger(Number(receipt.qid)) ? [{ qid: Number(receipt.qid), row: { ...receipt, fields: ['solution'], _sourceHoldSchema: true } }] : [];
  if (schema === 'M2_SCOPED_R1_SOURCE_REFRESH_V1' && receipt.currentExam) return (receipt.changedRows || []).map(row => ({ qid: Number(row.qid), row }));
  if (schema === 'JS_ARCHIVE_STAGE_EVIDENCE_v2') {
    const metaByQid = new Map((receipt.metaReviews || []).map(row => [Number(row.qid), row]));
    const solutionByQid = new Map((receipt.solutionReviews || []).map(row => [Number(row.qid), row]));
    return (receipt.changedLoci || []).map(row => ({
      qid: Number(row.qid),
      row: { ...row, _metaReview: metaByQid.get(Number(row.qid)), _solutionReview: solutionByQid.get(Number(row.qid)) },
    }));
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1') {
    const metaByQid = new Map((receipt.metaFindings || []).map(row => [Number(row.qid), row]));
    return (receipt.changedScope || []).map(row => ({
      qid: Number(row.qid),
      row: { ...row, _metaReview: metaByQid.get(Number(row.qid)) },
    }));
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2') {
    const rows = (receipt.changedSolutionReview?.rows || []).map(row => ({
      qid: Number(row.qid),
      row: { ...row, fields: row.baselineCurrentChangedFields || [] },
    }));
    if (receipt.q19Hold) rows.push({ qid: Number(receipt.q19Hold.qid), row: { ...receipt.q19Hold, fields: ['solution'] } });
    return rows;
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_CURRENT_SOURCE_REFRESH_V1') {
    return (receipt.scope?.changedLoci || []).map(row => ({ qid: Number(row.qid), row }));
  }
  if (schema === 'M2_SCOPED_R1_META_FOLLOWUP_V1') return Number.isInteger(Number(receipt.qid)) ? [{ qid: Number(receipt.qid), row: receipt }] : [];
  if (schema === 'M2_SCOPED_R1_Q16_CONTENT_LAYOUT_FOLLOWUP_V1') return Number.isInteger(Number(receipt.qid)) ? [{ qid: Number(receipt.qid), row: receipt }] : [];
  const raw = isMetaSchema(schema) ? (receipt.qidRows || receipt.rows)
    : schema === 'APMATH_SCOPED_R1_SOURCE_REFRESH_RECEIPT_V1' ? receipt.rows
      : receipt.changedRows || receipt.rows;
  if (Array.isArray(raw)) return raw.map(row => ({ qid: Number(row.qid), row }));
  if (raw && typeof raw === 'object') return Object.entries(raw).map(([qid, row]) => ({ qid: Number(qid), row }));
  return [];
}
export function lociForRow(row, schema, qid, receipt) {
  if (isGoldM2R1RefreshSchema(schema) || schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1') return [...new Set((row.fields || []).map(String))];
  if (schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1') return ['solution'];
  if (schema === 'M2_SCOPED_R1_SOURCE_REFRESH_V1' && receipt.currentExam) return [...new Set((row.changedFields || []).map(String))];
  if (schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2') return [...new Set((row.fields || []).map(String))];
  if (schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1') return Array.isArray(row.fields) ? [...new Set(row.fields.map(String))] : [];
  if (schema === 'M2_SCOPED_R1_Q16_CONTENT_LAYOUT_FOLLOWUP_V1') return [...new Set((row.changedFieldsFromBaseline || []).map(String).filter(field => field === 'content'))];
  const direct = schema === 'M2_SCOPED_R1_META_FOLLOWUP_V1'
    ? Object.keys(row.changedMetaFields || {})
    : row.changedLoci || row.sourceLoci || row.changedFields || row.loci || row.fields;
  const loci = Array.isArray(direct) ? direct.map(String) : [];
  if (isMetaSchema(schema) || (row.metaAdjudication && (row.metaStatus || row.metaDispositionStatus))) loci.push('__META_SCOPE__');
  if (loci.length) return [...new Set(loci)];
  if (isMetaSchema(schema)) {
    const changed = (receipt.changedMetaQids || receipt.changedMetaQids?.qids || []).map(Number);
    if (changed.includes(qid) || row.metaDispositionStatus || row.metaAdjudication) return ['__META_SCOPE__'];
  }
  return [];
}
export function rowReviewStatus(row, schema, field) {
  if (isGoldM2R1RefreshSchema(schema)) {
    if (field === 'solution') return row.disposition === 'REVIEWED_CHANGED_SOLUTION' && row.solutionLayout?.status === 'STATIC_REVIEWED' ? 'REVIEWED_STATIC' : 'NOT_REVIEWED';
    return 'NOT_REVIEWED';
  }
  if (schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1') return row.status === 'SOURCE_HOLD' ? 'HOLD' : 'NOT_REVIEWED';
  if (schema === 'JS_ARCHIVE_R1_SOURCE_REFRESH_REVIEW_V1') {
    if (field === 'solution') return row.disposition === 'REVIEWED_CHANGED_SOLUTION' && row.solutionLayout?.status === 'STATIC_REVIEWED' ? 'REVIEWED_STATIC' : 'NOT_REVIEWED';
    return 'NOT_REVIEWED';
  }
  if (schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1') return row.status === 'SOURCE_HOLD' ? 'HOLD' : 'NOT_REVIEWED';
  if (schema === 'M2_SCOPED_R1_SOURCE_REFRESH_V1' && (row.metaDecision || row.solutionComparison || row.contentReview)) {
    if (META_FIELDS.has(field)) return String(row.metaDecision?.verdict || row.metaStatus || row.metaDispositionStatus || '').toUpperCase();
    if (field === 'solution') {
      const verdict = String(row.solutionComparison?.verdict || row.solutionComparison?.status
        || row.solutionStatus || row.solutionReviewStatus || '').toUpperCase();
      return ['MATCH', 'PASS', 'MATCH_AFTER_SEPARATE_ADJUDICATION'].includes(verdict) ? 'REVIEWED_STATIC' : verdict || 'NOT_REVIEWED';
    }
    if (field === 'content') return row.contentReview?.disposition === 'FRESH_CURRENT_STUDENT_INPUT_REVIEWED'
      && row.studentInput?.exact === false ? 'PASS' : 'NOT_REVIEWED';
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2') {
    if (row.status === 'SOURCE_HOLD') return 'HOLD';
    if (field === 'solution') return String(row.status || '').toUpperCase() === 'REVIEWED_PASS' ? 'REVIEWED_STATIC' : 'NOT_REVIEWED';
    return 'NOT_REVIEWED';
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1') {
    if (META_FIELDS.has(field)) return String(row._metaReview?.disposition || '').toUpperCase();
    return 'NOT_REVIEWED';
  }
  if (schema === 'JS_ARCHIVE_STAGE_EVIDENCE_v2') {
    if (META_FIELDS.has(field)) return String(row._metaReview?.disposition || row.meta?.status || '').toUpperCase();
    if (field === 'solution') {
      const solutionReview = row._solutionReview;
      const disposition = String(solutionReview?.previousDisposition || '').toUpperCase();
      return ['PASS', 'PASS_AFTER_ADJUDICATION'].includes(disposition)
        && solutionReview?.exactByteHashMatch === true
        && cleanHash(solutionReview.currentSolutionSha256) === cleanHash(solutionReview.priorReviewedSolutionSha256)
        ? 'REVIEWED_STATIC' : disposition;
    }
    return String(row.disposition || row.status || '').toUpperCase();
  }
  if (schema === 'JS_ARCHIVE_R1_SCOPED_CURRENT_SOURCE_REFRESH_V1') {
    if (META_FIELDS.has(field)) return String(row.meta?.status || '').toUpperCase();
    if (field === 'solution') return String(row.solution?.status || '').toUpperCase();
    return String(row.disposition || row.status || '').toUpperCase();
  }
  if (schema === 'M2_SCOPED_R1_META_FOLLOWUP_V1') return String(row.metaStatus || '').toUpperCase();
  if (schema === 'M2_SCOPED_R1_Q16_CONTENT_LAYOUT_FOLLOWUP_V1') {
    if (field !== 'content' || Number(row.qid) !== 16) return 'NOT_REVIEWED';
    const parity = row.freezeBinding?.postfreezeParity === 'EXACT' && row.freezeBinding?.originalFreezePreserved === true;
    const source = row.sourceExact?.status === 'PASS';
    const layout = row.questionLayout?.status === 'PASS';
    const scoped = row.scopeOnly === true && row.fullExamR1Pass === false && row.actualRenderExecuted === false;
    const sourceFields = row.currentStudentInput?.studentFields;
    const currentContent = typeof row.currentContent === 'string' ? row.currentContent : null;
    const baselineContent = typeof row.baselineContent === 'string' ? row.baselineContent : null;
    const comparison = row.contentComparison;
    return parity && source && layout && scoped && sourceFields && currentContent !== null && baselineContent !== null
      && comparison?.taskWordingUnchanged === true && comparison?.conditionAndRequestPreserved === true
      && comparison?.choicesExactEquality === true && comparison?.visualInputsExact === true
      ? 'PASS' : 'NOT_REVIEWED';
  }
  if (isMetaSchema(schema)) {
    const status = String(row.metaDispositionStatus || row.currentDisposition || row.comparisonStatus || '').toUpperCase();
    return status === 'PASS' ? 'PASS' : status === 'HOLD' ? 'HOLD' : status;
  }
  if (field === 'provenance' && row.questionPayloadHash && row.storedAnswerComparison?.result === 'MATCH') return 'PASS';
  if (schema === 'APMATH_SCOPED_R1_SOURCE_REFRESH_RECEIPT_V1') {
    const comparison = String(row.comparison || row.disposition || '').toUpperCase();
    if (META_FIELDS.has(field)) {
      const meta = String(row.metadata?.verdict || row.metadata?.status || '').toUpperCase();
      return ['PASS', 'SUPPORTED', 'HOLD'].includes(meta) ? (meta === 'SUPPORTED' ? 'PASS' : meta) : meta || comparison;
    }
    return ['PASS', 'PASS_AFTER_TARGETED_CORRECTION', 'HOLD'].includes(comparison) ? comparison : comparison;
  }
  if (isCorrectionSchema(schema)) {
    if (META_FIELDS.has(field)) return String(row.metaStatus || row.metaAdjudication?.currentDisposition || '').toUpperCase();
    if (field === 'solution') return String(row.solutionReviewStatus || row.solutionStatus || '').toUpperCase();
    if (field === 'answer') return String(row.answerComparison || row.storedAnswerComparison?.result || '').toUpperCase();
    return String(row.disposition || row.status || row.answerComparison || '').toUpperCase();
  }
  if (META_FIELDS.has(field)) return String(row.metaStatus || '').toUpperCase();
  if (field === 'solution') return String(row.solutionStatus || row.solutionReviewStatus || row.solutionComparison?.status || '').toUpperCase();
  if (field === 'answer') return String(row.storedAnswerComparison?.result || row.answerComparison?.result || '').toUpperCase();
  if (field === 'choices' || field === 'content' || IMAGE_FIELDS.has(field)) {
    const axes = row.reviewedAxes || [];
    if (axes.includes('sourceExact') || axes.includes('answerMath') || row.questionPayloadHash) return 'PASS';
  }
  const comparison = row.comparison;
  if (typeof comparison === 'string') return comparison.toUpperCase();
  if (comparison && typeof comparison === 'object') return String(comparison.status || comparison.result || '').toUpperCase();
  return String(row.status || row.disposition || '').toUpperCase();
}
function holdEvidenceFromRow(row) {
  const existing = row.holdEvidence || row.metaHoldEvidence || row.metaAdjudication?.holdEvidence;
  if (existing) return existing;
  if (row.reason || row.observedEvidence || row.unresolvedPoint || row.nextRequiredEvidenceOrCapability) {
    return {
      reason: row.reason,
      observedEvidence: row.observedEvidence,
      unresolvedPoint: row.unresolvedPoint,
      nextRequiredEvidenceOrCapability: row.nextRequiredEvidenceOrCapability,
      repairAttempted: row.repairAttempted,
      authorityLookupAttempted: row.authorityLookupAttempted,
      whyDeterministicClosureImpossible: row.whyDeterministicClosureImpossible,
    };
  }
  const meta = row.metaAdjudication;
  if (!meta) return null;
  return {
    reason: meta.reason,
    observedEvidence: meta.observedEvidence,
    unresolvedPoint: meta.unresolvedPoint,
    nextRequiredEvidenceOrCapability: meta.nextRequiredKeyOrEvidence || meta.nextRequiredEvidenceOrCapability,
    repairAttempted: meta.repairAttempted,
    authorityLookupAttempted: meta.authorityLookupAttempted,
    whyDeterministicClosureImpossible: meta.whyDeterministicClosureImpossible,
  };
}
export function holdAxesFor(field, row) {
  if (META_FIELDS.has(field)) return ['meta'];
  if (row._sourceHoldSchema === true && row.frozenRowDisposition?.status === 'PROVISIONAL_UNRESOLVED_SOURCE_DEPENDENT' && field === 'solution') return ['sourceExact', 'solutionMath'];
  if (row.category === 'INCOMPLETE_STUDENT_SOURCE' && field === 'solution') return ['sourceExact', 'solutionMath'];
  const explicit = row.holdAxis || row.axis || row.dispositionAxis;
  if (typeof explicit === 'string' && ['sourceExact', 'answerMath', 'solutionMath', 'smallBoard', 'curriculum', 'visualNecessity', 'meta', 'difficulty', 'runtimeString'].includes(explicit)) return [explicit];
  if (field === 'solution') return ['solutionMath'];
  if (field === 'answer') return ['answerMath'];
  if (['content', 'choices', 'image', 'images', 'visualAsset', 'solutionImage', 'assets'].includes(field)) return ['sourceExact'];
  return [];
}
export function validateHoldEvidence(hold) {
  const has = value => value !== undefined && value !== null && (typeof value !== 'string' || value.trim().length > 0);
  return Boolean(hold && nonempty(hold.reason) && has(hold.observedEvidence) && nonempty(hold.unresolvedPoint)
    && nonempty(hold.nextRequiredEvidenceOrCapability) && has(hold.repairAttempted)
    && has(hold.authorityLookupAttempted) && nonempty(hold.whyDeterministicClosureImpossible));
}

function findHistoricalSnapshot(root, examRel, desiredSha, currentBytes, baselineBytesValue) {
  if (sha256(currentBytes) === desiredSha) return currentBytes;
  if (sha256(baselineBytesValue) === desiredSha) return baselineBytesValue;
  let commits = [];
  try { commits = git(root, ['log', '--follow', '--format=%H', '--', examRel]).toString('utf8').trim().split(/\r?\n/).filter(Boolean); }
  catch { /* missing history fails below */ }
  for (const commit of commits) {
    try {
      const bytes = git(root, ['show', `${commit}:${examRel}`]);
      if (sha256(bytes) === desiredSha) return bytes;
    } catch { /* path did not exist in this revision */ }
  }
  fail('RECEIPT_SOURCE_SNAPSHOT_NOT_FOUND_IN_GIT', desiredSha);
}
export function validateScopeOnly(receipt, schema, label) {
  const scope = receipt.scope || receipt.reviewScope || {};
  const scopeOnly = scope.scopeOnly === true || receipt.scopeOnly === true;
  const fullExamR1Pass = scope.fullExamR1Pass ?? receipt.fullExamR1Pass;
  if (!scopeOnly || fullExamR1Pass !== false) fail('R1_RECEIPT_NOT_SCOPE_ONLY', label);
  if (receipt.fullExamValidatorRun === true || scope.fullExamValidatorRun === true) fail('R1_FULL_EXAM_VALIDATOR_MUST_NOT_BE_CLAIMED', label);
  if (!SUPPORTED.has(schema)) fail('R1_RECEIPT_SCHEMA_UNSUPPORTED', schema);
}
function cleanHash(value) { return String(value || '').replace(/^sha256:/i, '').toLowerCase(); }
export function validateConsolidatedStageEvidence(receipt, currentBank, delta) {
  const schema = receiptSchema(receipt);
  if (schema !== 'JS_ARCHIVE_STAGE_EVIDENCE_v2') fail('STAGE_EVIDENCE_SCHEMA_REQUIRED', schema);
  validateScopeOnly(receipt, schema, 'JS_ARCHIVE_STAGE_EVIDENCE_v2');
  if (!Array.isArray(receipt.changedLoci) || !Array.isArray(receipt.unchangedQidDispositions)) fail('STAGE_EVIDENCE_DENOMINATOR_ROWS_REQUIRED');

  const changes = new Map();
  for (const row of receipt.changedLoci) {
    const qid = Number(row.qid);
    if (!Number.isInteger(qid) || changes.has(qid) || !Array.isArray(row.fields) || !row.fields.length) fail('STAGE_EVIDENCE_CHANGED_LOCUS_ROW_INVALID');
    changes.set(qid, [...new Set(row.fields.map(String))].sort());
  }
  const expectedChanges = new Map(delta.changed.map(row => [row.qid, [...row.fields].sort()]));
  if (changes.size !== expectedChanges.size) fail('STAGE_EVIDENCE_CHANGED_QID_DENOMINATOR_MISMATCH');
  for (const [qid, fields] of expectedChanges) if (!changes.has(qid) || stable(changes.get(qid)) !== stable(fields)) fail('STAGE_EVIDENCE_CHANGED_LOCUS_MISMATCH', `q${qid}`);

  const unchanged = new Map();
  const allowedUnchanged = new Set(['UNCHANGED_BASELINE_NO_NEW_VERDICT', 'RESTORED_TO_BASELINE_META_REVIEWED_PASS']);
  for (const row of receipt.unchangedQidDispositions) {
    const qid = Number(row.qid);
    if (!Number.isInteger(qid) || unchanged.has(qid) || !allowedUnchanged.has(row.disposition)) fail('STAGE_EVIDENCE_UNCHANGED_ROW_INVALID');
    unchanged.set(qid, row.disposition);
  }
  if (stable([...unchanged.keys()].sort((a, b) => a - b)) !== stable(delta.unchangedQids)) fail('STAGE_EVIDENCE_UNCHANGED_QID_DENOMINATOR_MISMATCH');
  if (delta.unchangedQids.some(qid => stable(delta.oldById.get(qid)) !== stable(delta.currentById.get(qid)))) fail('STAGE_EVIDENCE_UNCHANGED_SOURCE_PARITY_FAILED');

  const metaByQid = new Map();
  for (const row of receipt.metaReviews || []) {
    const qid = Number(row.qid), disposition = String(row.disposition || '').toUpperCase();
    if (!Number.isInteger(qid) || metaByQid.has(qid) || !['PASS', 'HOLD'].includes(disposition)) fail('STAGE_EVIDENCE_META_REVIEW_INVALID');
    metaByQid.set(qid, row);
  }
  for (const row of receipt.changedLoci) {
    const qid = Number(row.qid);
    if (row.fields.some(field => META_FIELDS.has(field)) && !metaByQid.has(qid)) fail('STAGE_EVIDENCE_META_REVIEW_MISSING', `q${qid}`);
  }

  const currentById = new Map(currentBank.map(q => [Number(q.id), q]));
  const solutionByQid = new Map();
  for (const row of receipt.solutionReviews || []) {
    const qid = Number(row.qid), question = currentById.get(qid);
    if (!Number.isInteger(qid) || solutionByQid.has(qid) || !question) fail('STAGE_EVIDENCE_SOLUTION_REVIEW_INVALID');
    const currentSolutionSha = cleanHash(sha256(Buffer.from(String(question.solution || ''))));
    const currentReviewedSha = cleanHash(row.currentSolutionSha256);
    const priorReviewedSha = cleanHash(row.priorReviewedSolutionSha256);
    if (!['PASS', 'PASS_AFTER_ADJUDICATION'].includes(String(row.previousDisposition || '').toUpperCase())
      || row.exactByteHashMatch !== true || currentReviewedSha !== currentSolutionSha || priorReviewedSha !== currentReviewedSha) {
      fail('STAGE_EVIDENCE_SOLUTION_STATIC_BINDING_INVALID', `q${qid}`);
    }
    solutionByQid.set(qid, { ...row, _staticClosureValidated: true });
  }
  const expectedSolutionQids = delta.changed.filter(row => row.fields.includes('solution')).map(row => row.qid).sort((a, b) => a - b);
  if (stable([...solutionByQid.keys()].sort((a, b) => a - b)) !== stable(expectedSolutionQids)) fail('STAGE_EVIDENCE_SOLUTION_QID_DENOMINATOR_MISMATCH');
  return true;
}
export function validateScopedSourceRefreshV1(receipt, root, currentBank, delta) {
  const schema = receiptSchema(receipt);
  if (schema !== 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1') fail('SOURCE_REFRESH_V1_SCHEMA_REQUIRED', schema);
  validateScopeOnly(receipt, schema, 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1');
  const listedChanged = (receipt.sourceDiff?.changedQids || []).map(Number).sort((a, b) => a - b);
  const expectedChanged = delta.changed.map(row => row.qid).sort((a, b) => a - b);
  if (stable(listedChanged) !== stable(expectedChanged)) fail('SOURCE_REFRESH_CHANGED_QID_DENOMINATOR_MISMATCH');
  if (Array.isArray(receipt.unchangedQidDispositions)) {
    const unchangedQids = receipt.unchangedQidDispositions.map(row => Number(row.qid)).sort((a, b) => a - b);
    if (stable(unchangedQids) !== stable(delta.unchangedQids)) fail('SOURCE_REFRESH_UNCHANGED_QID_DENOMINATOR_MISMATCH');
    const allowedUnchanged = new Set(['UNCHANGED_BASELINE_NO_NEW_VERDICT', 'RESTORED_TO_BASELINE_META_REVIEWED_PASS']);
    if (receipt.unchangedQidDispositions.some(row => !allowedUnchanged.has(row.disposition))) fail('SOURCE_REFRESH_UNCHANGED_DISPOSITION_INVALID');
  }
  if (delta.unchangedQids.some(qid => stable(delta.oldById.get(qid)) !== stable(delta.currentById.get(qid)))) fail('SOURCE_REFRESH_UNCHANGED_SOURCE_PARITY_FAILED');
  const studentParity = receipt.studentParity;
  if (!studentParity || studentParity.result !== 'EXACT'
    || stable((studentParity.changedQids || []).map(Number).sort((a, b) => a - b)) !== stable(delta.studentPayloadChangedQids)
    || stable((studentParity.unchangedQids || []).map(Number).sort((a, b) => a - b)) !== stable(delta.studentPayloadUnchangedQids)) {
    fail('SOURCE_REFRESH_STUDENT_PARITY_MISMATCH');
  }

  const metaQids = new Set(delta.changed.filter(row => row.fields.some(field => META_FIELDS.has(field))).map(row => row.qid));
  const metaReviews = receipt.metaFindings || [];
  const metaByQid = new Map();
  for (const row of metaReviews) {
    const qid = Number(row.qid), disposition = String(row.disposition || '').toUpperCase();
    if (!Number.isInteger(qid) || metaByQid.has(qid) || !['PASS', 'HOLD'].includes(disposition)) fail('SOURCE_REFRESH_META_FINDING_INVALID');
    metaByQid.set(qid, row);
  }
  for (const qid of metaQids) if (!metaByQid.has(qid)) fail('SOURCE_REFRESH_META_FINDING_MISSING', `q${qid}`);

  const assetParity = receipt.assetParity;
  if (!assetParity || assetParity.result !== 'EXACT' || !Array.isArray(assetParity.assets)) fail('SOURCE_REFRESH_ASSET_PARITY_REQUIRED');
  for (const asset of assetParity.assets) {
    if (asset.parity !== 'EXACT' || asset.opened !== true || cleanHash(asset.baselineSha256) !== cleanHash(asset.currentSha256)) fail('SOURCE_REFRESH_ASSET_PARITY_INVALID', asset.ref || 'unknown');
    const ref = normalize(asset.ref || '');
    if (!ref) fail('SOURCE_REFRESH_ASSET_REF_MISSING');
    const assetRel = ref.startsWith('archive/') ? ref : `archive/${ref}`;
    const file = path.resolve(root, assetRel);
    if (!file.startsWith(path.resolve(root, 'archive') + path.sep) || !fs.existsSync(file)) fail('SOURCE_REFRESH_ASSET_NOT_FOUND', assetRel);
    if (cleanHash(sha256(fs.readFileSync(file))) !== cleanHash(asset.currentSha256)) fail('SOURCE_REFRESH_ASSET_CURRENT_SHA_MISMATCH', assetRel);
  }
  return true;
}
export function validateSourceRefreshReceiptV2(receipt, root, oldBank, currentBank, delta) {
  const schema = receiptSchema(receipt);
  if (schema !== 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2') fail('SOURCE_REFRESH_V2_SCHEMA_REQUIRED', schema);
  validateScopeOnly(receipt, schema, 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2');

  const denominator = receipt.denominator || {};
  const qids = currentBank.map(q => Number(q.id)).sort((a, b) => a - b);
  if (Number(denominator.baseline) !== oldBank.length || Number(denominator.current) !== currentBank.length
    || Number(denominator.baseline) !== Number(denominator.current) || denominator.qidOrderParity !== true
    || stable((denominator.qids || []).map(Number).sort((a, b) => a - b)) !== stable(qids)) {
    fail('SOURCE_REFRESH_V2_DENOMINATOR_MISMATCH');
  }

  const passRows = receipt.changedSolutionReview?.rows || [];
  const reviewedQids = passRows.map(row => Number(row.qid)).sort((a, b) => a - b);
  if (stable(reviewedQids) !== stable((receipt.changedSolutionReview?.reviewedQids || []).map(Number).sort((a, b) => a - b))) fail('SOURCE_REFRESH_V2_REVIEWED_QID_SET_MISMATCH');
  const hold = receipt.q19Hold;
  if (!hold || Number(hold.qid) !== 19 || hold.status !== 'SOURCE_HOLD' || hold.category !== 'INCOMPLETE_STUDENT_SOURCE') fail('SOURCE_REFRESH_V2_Q19_HOLD_REQUIRED');
  if (reviewedQids.includes(19) || stable((receipt.unreviewedChangedSolutionQids || []).map(Number).sort((a, b) => a - b)) !== stable([19])) fail('SOURCE_REFRESH_V2_Q19_MUST_REMAIN_UNREVIEWED');
  const forbiddenHoldKeys = Object.keys(hold).filter(key => /(?:answer|solution).*(?:sha|text|value|review|freeze)|(?:sha|text|value|review|freeze).*(?:answer|solution)/i.test(key));
  if (forbiddenHoldKeys.length) fail('SOURCE_REFRESH_V2_Q19_ANSWER_SOLUTION_INSPECTION_FORBIDDEN');
  if (!validateHoldEvidence(holdEvidenceFromRow(hold))) fail('SOURCE_REFRESH_V2_Q19_HOLD_EVIDENCE_INCOMPLETE');

  const reportedQids = [...reviewedQids, 19].sort((a, b) => a - b);
  const actualChangedQids = delta.changed.map(row => row.qid).sort((a, b) => a - b);
  if (stable(reportedQids) !== stable(actualChangedQids)) fail('SOURCE_REFRESH_V2_CHANGED_QID_DENOMINATOR_MISMATCH');
  const passByQid = new Map(passRows.map(row => [Number(row.qid), row]));
  for (const change of delta.changed) {
    if (change.fields.length !== 1 || change.fields[0] !== 'solution') fail('SOURCE_REFRESH_V2_CHANGED_LOCUS_NOT_SOLUTION_ONLY', `q${change.qid}`);
    if (change.qid === 19) continue;
    const row = passByQid.get(change.qid);
    if (!row || row.status !== 'REVIEWED_PASS' || row.studentPayloadParity !== true || row.storedAnswerUnchanged !== true) fail('SOURCE_REFRESH_V2_SOLUTION_REVIEW_ROW_INVALID', `q${change.qid}`);
    if (stable((row.baselineCurrentChangedFields || []).map(String).sort()) !== stable(change.fields)) fail('SOURCE_REFRESH_V2_SOLUTION_FIELD_MISMATCH', `q${change.qid}`);
    const oldQuestion = delta.oldById.get(change.qid), currentQuestion = delta.currentById.get(change.qid);
    const baselineSolutionSha = sha256(Buffer.from(String(oldQuestion.solution || '')));
    const currentSolutionSha = sha256(Buffer.from(String(currentQuestion.solution || '')));
    if (cleanHash(row.baselineSolutionSha256) !== cleanHash(baselineSolutionSha)
      || cleanHash(row.currentSolutionSha256) !== cleanHash(currentSolutionSha)) fail('SOURCE_REFRESH_V2_SOLUTION_SHA_MISMATCH', `q${change.qid}`);
  }

  const studentParity = receipt.baselineCurrentStudentParity || {};
  if (!Array.isArray(studentParity.changedStudentOrAssetRows) || studentParity.changedStudentOrAssetRows.length !== 0
    || stable((studentParity.unchangedQidsStudentFieldParity || []).map(Number).sort((a, b) => a - b)) !== stable(delta.sourceStudentUnchangedQids)) {
    fail('SOURCE_REFRESH_V2_STUDENT_PARITY_MISMATCH');
  }
  const openedAssets = studentParity.actualOpenedAssets || [];
  for (const asset of openedAssets) {
    if (asset.opened !== true || !nonempty(asset.ref) || !nonempty(asset.sha256)) fail('SOURCE_REFRESH_V2_OPENED_ASSET_ROW_INVALID');
    const assetRel = normalize(asset.ref).startsWith('archive/') ? normalize(asset.ref) : `archive/${normalize(asset.ref)}`;
    const file = path.resolve(root, assetRel);
    if (!file.startsWith(path.resolve(root, 'archive') + path.sep) || !fs.existsSync(file)) fail('SOURCE_REFRESH_V2_OPENED_ASSET_NOT_FOUND', assetRel);
    if (cleanHash(sha256(fs.readFileSync(file))) !== cleanHash(asset.sha256)) fail('SOURCE_REFRESH_V2_OPENED_ASSET_SHA_MISMATCH', assetRel);
  }
  return true;
}
export function validateM2CurrentExamSourceRefresh(receipt, root, oldBank, currentBank, delta) {
  const schema = receiptSchema(receipt);
  if (schema !== 'M2_SCOPED_R1_SOURCE_REFRESH_V1' || !receipt.currentExam) fail('M2_CURRENT_EXAM_SOURCE_REFRESH_SCHEMA_REQUIRED');
  validateScopeOnly(receipt, schema, 'M2_SCOPED_R1_SOURCE_REFRESH_V1/currentExam');
  if (Number(receipt.currentExam.questionCount) !== currentBank.length || currentBank.length !== oldBank.length) fail('M2_CURRENT_EXAM_DENOMINATOR_MISMATCH');
  const changedRows = receipt.changedRows;
  if (!Array.isArray(changedRows)) fail('M2_CURRENT_EXAM_CHANGED_ROWS_REQUIRED');
  const rowMap = new Map();
  for (const row of changedRows) {
    const qid = Number(row.qid);
    if (!Number.isInteger(qid) || rowMap.has(qid) || !Array.isArray(row.changedFields)) fail('M2_CURRENT_EXAM_CHANGED_ROW_INVALID');
    rowMap.set(qid, row);
  }
  const expectedChanges = new Map(delta.changed.map(row => [row.qid, [...row.fields].sort()]));
  if (rowMap.size !== expectedChanges.size) fail('M2_CURRENT_EXAM_CHANGED_QID_DENOMINATOR_MISMATCH');
  for (const [qid, fields] of expectedChanges) {
    const row = rowMap.get(qid);
    if (!row || stable([...row.changedFields].map(String).sort()) !== stable(fields)) fail('M2_CURRENT_EXAM_CHANGED_LOCUS_MISMATCH', `q${qid}`);
  }
  const unchangedQids = (receipt.unchangedQidsExact || []).map(Number).sort((a, b) => a - b);
  if (stable(unchangedQids) !== stable(delta.unchangedQids)) fail('M2_CURRENT_EXAM_UNCHANGED_QID_SET_MISMATCH');
  if (delta.unchangedQids.some(qid => stable(delta.oldById.get(qid)) !== stable(delta.currentById.get(qid)))) fail('M2_CURRENT_EXAM_UNCHANGED_SOURCE_PARITY_FAILED');
  const secondaryUnchanged = receipt.sourceComparison?.unchangedQidsExact;
  if (Array.isArray(secondaryUnchanged) && stable(secondaryUnchanged.map(Number).sort((a, b) => a - b)) !== stable(delta.unchangedQids)) fail('M2_CURRENT_EXAM_SECONDARY_UNCHANGED_SET_MISMATCH');

  const solutionChangedQids = delta.changed.filter(row => row.fields.includes('solution')).map(row => row.qid).sort((a, b) => a - b);
  const reviewedSolutionQids = [];
  const metaChangedQids = new Set();
  for (const change of delta.changed) {
    const row = rowMap.get(change.qid);
    for (const field of change.fields) {
      if (META_FIELDS.has(field)) metaChangedQids.add(change.qid);
      if (field === 'solution') {
        const comparison = row.solutionComparison;
        const verdict = String(comparison?.verdict || '').toUpperCase();
        if (!comparison || !['MATCH', 'MATCH_AFTER_SEPARATE_ADJUDICATION'].includes(verdict)) fail('M2_CURRENT_EXAM_SOLUTION_REVIEW_MISSING', `q${change.qid}`);
        if (!nonempty(comparison.baselineSolutionSha256) || !nonempty(comparison.currentSolutionSha256)) fail('M2_CURRENT_EXAM_SOLUTION_BINDING_INCOMPLETE', `q${change.qid}`);
        reviewedSolutionQids.push(change.qid);
      }
      if (field === 'content') {
        const studentInput = row.studentInput, review = row.contentReview;
        if (!studentInput || studentInput.exact !== false || !nonempty(studentInput.baselinePayloadSha256)
          || !nonempty(studentInput.currentPayloadSha256) || studentInput.baselinePayloadSha256 === studentInput.currentPayloadSha256
          || review?.disposition !== 'FRESH_CURRENT_STUDENT_INPUT_REVIEWED') fail('M2_CURRENT_EXAM_CONTENT_REVIEW_MISSING', `q${change.qid}`);
      }
    }
  }
  if (stable(reviewedSolutionQids.sort((a, b) => a - b)) !== stable(solutionChangedQids)) fail('M2_CURRENT_EXAM_SOLUTION_REVIEW_DENOMINATOR_MISMATCH');
  const metaReviewQids = new Map();
  for (const row of changedRows) if (row.metaDecision) metaReviewQids.set(Number(row.qid), String(row.metaDecision.verdict || '').toUpperCase());
  for (const qid of metaChangedQids) if (!['PASS', 'HOLD'].includes(metaReviewQids.get(qid))) fail('M2_CURRENT_EXAM_META_REVIEW_MISSING', `q${qid}`);

  const bundles = receipt.studentBundles || {};
  for (const kind of ['baseline', 'current']) {
    const bundle = bundles[kind];
    if (!bundle || bundle.answersIncluded !== false || Number(bundle.questionCount) !== currentBank.length || !nonempty(bundle.sha256)) fail('M2_CURRENT_EXAM_STUDENT_BUNDLE_INVALID', kind);
    const file = resolveReceiptFile(root, bundle.path, `M2_${kind.toUpperCase()}_STUDENT_BUNDLE`);
    if (cleanHash(sha256(fs.readFileSync(file))) !== cleanHash(bundle.sha256)) fail('M2_CURRENT_EXAM_STUDENT_BUNDLE_SHA_MISMATCH', kind);
  }
  if (bundles.current.schemaVersion !== 'JS_ARCHIVE_STUDENT_BUNDLE_V2' || bundles.baseline.schemaVersion !== 'JS_ARCHIVE_STUDENT_BUNDLE_V2') fail('M2_CURRENT_EXAM_STUDENT_BUNDLE_SCHEMA_INVALID');
  if (bundles.affectedRowsExceptQ22Exact !== true) fail('M2_CURRENT_EXAM_AFFECTED_ROW_PARITY_INVALID');

  const assets = receipt.assets || {};
  if (assets.allRequiredAssetsOpened !== true || assets.allAffectedAssetBaselineBytesExact !== true || !Array.isArray(assets.rows)) fail('M2_CURRENT_EXAM_ASSET_PARITY_REQUIRED');
  for (const asset of assets.rows) {
    if (asset.actualOpened !== true || asset.baselineByteParity !== true || cleanHash(asset.baselineGitBlobSha1) !== cleanHash(asset.currentGitBlobSha1)) fail('M2_CURRENT_EXAM_ASSET_ROW_INVALID', asset.ref || `q${asset.qid}`);
    const file = resolveReceiptFile(root, asset.path, 'M2_CURRENT_EXAM_ASSET');
    const bytes = fs.readFileSync(file);
    const actualBlob = gitBlobSha(root, bytes);
    if (cleanHash(sha256(bytes)) !== cleanHash(asset.sha256) || cleanHash(actualBlob) !== cleanHash(asset.currentGitBlobSha1)) fail('M2_CURRENT_EXAM_ASSET_SHA_MISMATCH', asset.ref || `q${asset.qid}`);
  }
  return true;
}
export function validateQ16ContentLayoutFollowup(receipt, root, examRel, baselineCommit, oldBank, currentBank, delta) {
  if (receiptSchema(receipt) !== 'M2_SCOPED_R1_Q16_CONTENT_LAYOUT_FOLLOWUP_V1') fail('Q16_CONTENT_FOLLOWUP_SCHEMA_REQUIRED');
  validateScopeOnly(receipt, receiptSchema(receipt), 'M2_Q16_CONTENT_LAYOUT_FOLLOWUP');
  const qid = Number(receipt.qid);
  if (qid !== 16) fail('Q16_CONTENT_FOLLOWUP_QID_MISMATCH');
  if (!receiptSourcePath(root, receipt.source?.path, examRel)) fail('Q16_CONTENT_FOLLOWUP_SOURCE_PATH_MISMATCH');
  const currentBytes = fs.readFileSync(path.resolve(root, ...normalize(examRel).split('/')));
  if (cleanHash(receipt.source?.rawSha256) !== cleanHash(sha256(currentBytes))
    || cleanHash(receipt.source?.rawBufferBlobSha1) !== cleanHash(gitBlobSha(root, currentBytes))) fail('Q16_CONTENT_FOLLOWUP_CURRENT_SOURCE_BINDING_MISMATCH');
  if (resolveCommit(root, receipt.baseline?.commit) !== baselineCommit
    || cleanHash(receipt.baseline?.sourceRawSha256) !== cleanHash(sha256(baselineBytes(root, baselineCommit, examRel)))) fail('Q16_CONTENT_FOLLOWUP_BASELINE_BINDING_MISMATCH');
  const change = delta.changed.find(row => row.qid === qid);
  if (!change || !change.fields.includes('content') || !receipt.changedFieldsFromBaseline?.includes('content')
    || receipt.reviewedLocus !== 'content only') fail('Q16_CONTENT_FOLLOWUP_CHANGED_LOCUS_MISMATCH');
  const oldQuestion = delta.oldById.get(qid), currentQuestion = delta.currentById.get(qid);
  const currentInput = receipt.currentStudentInput;
  if (receipt.sourceExact?.status !== 'PASS' || receipt.questionLayout?.status !== 'PASS'
    || !receipt.reviewedAxes?.includes('sourceExact') || !receipt.reviewedAxes?.includes('QUESTION_LAYOUT')
    || receipt.freezeBinding?.postfreezeParity !== 'EXACT' || receipt.freezeBinding?.originalFreezePreserved !== true
    || receipt.scopeOnly !== true || receipt.fullExamR1Pass !== false || receipt.actualRenderExecuted !== false
    || receipt.actualRenderExecuted === true || receipt.assetReview?.status !== 'PASS'
    || receipt.assetReview?.status === 'HOLD') fail('Q16_CONTENT_FOLLOWUP_REVIEW_STATUS_INVALID');
  const studentFields = currentInput?.studentFields;
  if (!studentFields || stable(Object.fromEntries(Object.keys(studentFields).map(key => [key, currentQuestion[key]]))) !== stable(studentFields)
    || !/^[a-f0-9]{64}$/i.test(String(currentInput.questionPayloadSha256 || ''))
    || receipt.currentContent !== currentQuestion.content || receipt.baselineContent !== oldQuestion.content) fail('Q16_CONTENT_FOLLOWUP_STUDENT_INPUT_MISMATCH');
  const comparison = receipt.contentComparison || {};
  if (comparison.taskWordingUnchanged !== true || comparison.conditionAndRequestPreserved !== true
    || comparison.choicesExactEquality !== true || comparison.visualInputsExact !== true
    || comparison.noReferencedAssets !== true || comparison.sharedMaterialPresent !== false) fail('Q16_CONTENT_FOLLOWUP_PARITY_CLAIMS_INVALID');
  const freeze = receipt.freezeBinding;
  const freezeFile = resolveReceiptFile(root, freeze.originalFreezePath, 'Q16_ORIGINAL_FREEZE');
  if (cleanHash(sha256(fs.readFileSync(freezeFile))) !== cleanHash(freeze.originalFreezeSha256)) fail('Q16_ORIGINAL_FREEZE_SHA_MISMATCH');
  const bundleFile = resolveReceiptFile(root, freeze.currentStudentBundlePath, 'Q16_CURRENT_STUDENT_BUNDLE');
  if (cleanHash(sha256(fs.readFileSync(bundleFile))) !== cleanHash(freeze.currentStudentBundleSha256)) fail('Q16_CURRENT_STUDENT_BUNDLE_SHA_MISMATCH');
  const parityFile = resolveReceiptFile(root, freeze.postfreezeReceiptPath, 'Q16_POSTFREEZE_RECEIPT');
  if (cleanHash(sha256(fs.readFileSync(parityFile))) !== cleanHash(freeze.postfreezeReceiptSha256)) fail('Q16_POSTFREEZE_RECEIPT_SHA_MISMATCH');
  const parity = JSON.parse(fs.readFileSync(parityFile, 'utf8'));
  if (parity.schemaVersion !== 'JS_ARCHIVE_POSTFREEZE_DISCLOSURE_V2' || parity.studentParity !== 'EXACT'
    || cleanHash(parity.sourceRawSha256) !== cleanHash(sha256(currentBytes))
    || cleanHash(parity.originalFreeze?.sha256) !== cleanHash(freeze.originalFreezeSha256)
    || !parity.rows?.some(row => Number(row.qid) === qid)) fail('Q16_POSTFREEZE_PARITY_INVALID');
  return true;
}

export function validateGoldM2R1SourceRefresh(mainReceipt, holdReceipt, root, examRel, baselineCommit, oldBank, currentBank, delta) {
  const mainSchema = receiptSchema(mainReceipt), holdSchema = receiptSchema(holdReceipt);
  if (!isGoldM2R1RefreshSchema(mainSchema) || holdSchema !== 'JS_ARCHIVE_R1_SOURCE_HOLD_V1') fail('GOLD_M2_R1_RECEIPT_SCHEMA_REQUIRED');
  validateScopeOnly(mainReceipt, mainSchema, 'gold-main');
  validateScopeOnly(holdReceipt, holdSchema, 'gold-q24-hold');
  const binding = mainReceipt.artifactBinding || {};
  const holdBinding = holdReceipt.sourceBinding || {};
  if (normalize(binding.path) !== examRel || cleanHash(binding.currentRawSha256) !== cleanHash(sha256(fs.readFileSync(path.resolve(root, examRel))))) fail('GOLD_M2_CURRENT_BINDING_INVALID');
  const resolvedBaseline = resolveCommit(root, baselineCommit);
  if (!resolveCommit(root, binding.baselineCommit).startsWith(resolvedBaseline) && !resolvedBaseline.startsWith(resolveCommit(root, binding.baselineCommit))) fail('GOLD_M2_BASELINE_COMMIT_MISMATCH');
  if (cleanHash(binding.baselineSourceRawSha256) !== cleanHash(sha256(baselineBytes(root, resolvedBaseline, examRel)))) fail('GOLD_M2_BASELINE_SHA_MISMATCH');

  const qids = currentBank.map(q => Number(q.id)).sort((a, b) => a - b);
  const counts = mainReceipt.fieldDiff?.questionCount || {};
  if (Number(counts.baseline) !== oldBank.length || Number(counts.current) !== currentBank.length || oldBank.length !== currentBank.length || mainReceipt.fieldDiff?.qidOrderExact !== true) fail('GOLD_M2_QID_DENOMINATOR_INVALID');
  const rows = mainReceipt.rows || [];
  const rowByQid = new Map(rows.map(row => [Number(row.qid), row]));
  if (rowByQid.size !== rows.length || stable([...rowByQid.keys()].sort((a, b) => a - b)) !== stable(qids)) fail('GOLD_M2_ROW_DENOMINATOR_MISMATCH');

  const unchanged = (mainReceipt.fieldDiff?.exactUnchangedQids || []).map(Number).sort((a, b) => a - b);
  if (stable(unchanged) !== stable(delta.unchangedQids)) fail('GOLD_M2_UNCHANGED_QID_SET_MISMATCH');
  const passQids = (mainReceipt.fieldDiff?.changedSolutionQidsReviewed || []).map(Number).sort((a, b) => a - b);
  const holdQid = Number(holdReceipt.qid);
  if (holdQid !== 24 || holdReceipt.status !== 'SOURCE_HOLD' || holdReceipt.exam !== path.basename(examRel, '.js')) fail('GOLD_M2_Q24_SOURCE_HOLD_REQUIRED');
  if (passQids.includes(holdQid) || stable([...passQids, holdQid].sort((a, b) => a - b)) !== stable(delta.changed.map(row => row.qid).sort((a, b) => a - b))) fail('GOLD_M2_CHANGED_QID_DENOMINATOR_MISMATCH');
  if (delta.changed.some(row => row.fields.length !== 1 || row.fields[0] !== 'solution')) fail('GOLD_M2_UNEXPECTED_CHANGED_FIELD');

  const reviewedRows = delta.changed.filter(row => row.qid !== holdQid).map(row => row.qid).sort((a, b) => a - b);
  if (stable(reviewedRows) !== stable(passQids)) fail('GOLD_M2_SOLUTION_REVIEW_QID_SET_MISMATCH');
  for (const qid of passQids) {
    const row = rowByQid.get(qid);
    if (!row || row.disposition !== 'REVIEWED_CHANGED_SOLUTION' || row.solutionLayout?.status !== 'STATIC_REVIEWED') fail('GOLD_M2_STATIC_SOLUTION_REVIEW_MISSING', `q${qid}`);
  }
  const unchangedSet = new Set(unchanged);
  for (const qid of unchanged) if (rowByQid.get(qid)?.disposition !== 'REVIEWED_EXACT_UNCHANGED') fail('GOLD_M2_UNCHANGED_ROW_DISPOSITION_MISMATCH', `q${qid}`);
  const holdRow = rowByQid.get(holdQid);
  if (!holdRow || holdRow.disposition !== 'SOURCE_HOLD' || holdRow.solutionLayout?.status !== 'SOURCE_HOLD' || holdRow.visualSvg?.status !== 'SOURCE_HOLD') fail('GOLD_M2_Q24_MAIN_HOLD_ROW_MISMATCH');
  if (holdRow.solutionLayout?.solutionChanged !== false || holdRow.solutionLayout?.answerComparison !== 'DEFERRED_SOURCE_HOLD'
    || holdRow.solutionLayout?.storedAnswer !== null || holdRow.solutionLayout?.answerSummary !== null) fail('GOLD_M2_Q24_ANSWER_SOLUTION_MUST_REMAIN_DEFERRED');
  if (holdReceipt.frozenRowDisposition?.qid !== holdQid || holdReceipt.frozenRowDisposition?.originalFreezePreserved !== true
    || holdReceipt.frozenRowDisposition?.status !== 'PROVISIONAL_UNRESOLVED_SOURCE_DEPENDENT') fail('GOLD_M2_Q24_FREEZE_PROVENANCE_INVALID');
  if (holdBinding.baselineCommit !== resolvedBaseline && !String(holdBinding.baselineCommit || '').startsWith(resolvedBaseline) && !resolvedBaseline.startsWith(String(holdBinding.baselineCommit || ''))) fail('GOLD_M2_Q24_HOLD_BASELINE_COMMIT_MISMATCH');
  if (cleanHash(holdBinding.baselineRawSha256) !== cleanHash(sha256(baselineBytes(root, resolvedBaseline, examRel)))
    || cleanHash(holdBinding.currentRawSha256) !== cleanHash(sha256(fs.readFileSync(path.resolve(root, examRel))))
    || cleanHash(holdBinding.currentRawBufferBlobSha1) !== cleanHash(gitBlobSha(root, fs.readFileSync(path.resolve(root, examRel))))) fail('GOLD_M2_Q24_HOLD_SOURCE_BINDING_MISMATCH');
  if (holdReceipt.studentParity?.exactParity !== true || holdReceipt.studentParity?.imageOpened !== true
    || cleanHash(holdReceipt.studentParity?.baselineStudentPayloadSha256) !== cleanHash(holdReceipt.studentParity?.currentStudentPayloadSha256)) fail('GOLD_M2_Q24_STUDENT_PARITY_INVALID');
  if (!validateHoldEvidence(holdEvidenceFromRow(holdReceipt))) fail('GOLD_M2_Q24_HOLD_EVIDENCE_INCOMPLETE');

  const studentParityQids = (mainReceipt.fieldDiff?.baselineCurrentStudentProjectionExactParityQids || []).map(Number).sort((a, b) => a - b);
  const assetParityQids = (mainReceipt.fieldDiff?.baselineCurrentAssetRefsAndShaExactParityQids || []).map(Number).sort((a, b) => a - b);
  if (stable(studentParityQids) !== stable(qids) || stable(assetParityQids) !== stable(qids)) fail('GOLD_M2_STUDENT_OR_ASSET_PARITY_QID_SET_MISMATCH');
  const assetRead = mainReceipt.actualAssetReads || {};
  const assets = assetRead.assets || [];
  if (Number(assetRead.openedCount) !== assets.length || assets.some(asset => asset.opened !== true)) fail('GOLD_M2_OPENED_ASSET_DENOMINATOR_MISMATCH');
  for (const asset of assets) {
    const rawAssetPath = asset.path || asset.ref;
    const normalizedAssetPath = normalize(rawAssetPath || '');
    const assetPath = normalizedAssetPath.startsWith('archive/') ? normalizedAssetPath : `archive/${normalizedAssetPath}`;
    const file = resolveReceiptFile(root, assetPath, 'GOLD_M2_ASSET');
    const bytes = fs.readFileSync(file);
    if (cleanHash(sha256(bytes)) !== cleanHash(asset.sha256) || (asset.baselineByteParity === true && cleanHash(asset.currentGitBlobSha1) !== cleanHash(asset.baselineGitBlobSha1))) fail('GOLD_M2_ASSET_BYTES_MISMATCH', asset.ref || asset.path);
  }
  const holdImage = normalize(holdReceipt.studentParity.referencedImage || '');
  const mainQ24Asset = assets.find(asset => normalize(asset.ref || '').replace(/^archive\//, '') === holdImage.replace(/^archive\//, ''));
  if (!mainQ24Asset || cleanHash(mainQ24Asset.sha256) !== cleanHash(holdReceipt.studentParity.imageSha256)) fail('GOLD_M2_Q24_HOLD_IMAGE_BINDING_MISMATCH');
  return true;
}

function openedAssetsForQid(receipt, schema, qid) {
  const out = [];
  if (schema === 'JS_ARCHIVE_R1_SOURCE_REFRESH_REVIEW_V1') {
    for (const asset of receipt.actualAssetReads?.assets || []) {
      const match = /(?:^|[\\/])q(\d+)\.(?:png|jpe?g|svg|webp)$/i.exec(String(asset.ref || asset.path || ''));
      if (Number(match?.[1]) === qid) out.push({ ...asset, __opened: asset.opened === true });
    }
  }
  if (schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1' && Number(receipt.qid) === qid) {
    out.push({ ref: receipt.studentParity?.referencedImage, sha256: receipt.studentParity?.imageSha256, opened: receipt.studentParity?.imageOpened, __opened: receipt.studentParity?.imageOpened === true });
  }
  const global = receipt.openedAssets || receipt.assetsOpened || [];
  for (const asset of Array.isArray(global) ? global : []) {
    const used = asset.usedFor || asset.qids || asset.qid ? (asset.usedFor || asset.qids || [asset.qid]) : [];
    if (used.map(Number).includes(qid)) out.push({ ...asset, __opened: asset.opened === true || asset.actualOpenedBeforeFreeze === true });
  }
  const { row } = receiptRows(receipt, schema).find(item => item.qid === qid) || {};
  const local = row?.assets || row?.assetRefs || row?.openedAssets || [];
  for (const asset of Array.isArray(local) ? local : []) {
    out.push({ ...asset, __opened: asset.opened === true || asset.actualOpenedBeforeFreeze === true || (asset.freezeAck === true && asset.ref) });
  }
  return out;
}
function collectAssetPaths(value, out = []) {
  if (typeof value === 'string') {
    const normalized = normalize(value);
    if (/^(?:archive\/)?assets\//.test(normalized) || /\.(?:png|jpe?g|svg|webp)$/i.test(normalized)) out.push(normalized.replace(/^archive\//, ''));
  } else if (Array.isArray(value)) value.forEach(item => collectAssetPaths(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => collectAssetPaths(item, out));
  return out;
}
function verifyReceiptAssets(root, receiptEntries, delta) {
  const needed = [];
  const assetReferenceFields = ['image', 'images', 'visualAsset', 'solutionImage', 'assets', 'sharedMaterial', 'passage'];
  for (const { qid, fields } of delta.changed) {
    if (!fields.some(field => IMAGE_FIELDS.has(field))) continue;
    const oldQ = delta.oldById.get(qid), currentQ = delta.currentById.get(qid);
    const paths = assetReferenceFields.flatMap(field => [
      ...collectAssetPaths(oldQ?.[field]),
      ...collectAssetPaths(currentQ?.[field]),
    ]);
    for (const pathValue of paths) {
      if (!needed.some(item => item.qid === qid && item.path === pathValue)) needed.push({ qid, path: pathValue });
    }
  }
  const verified = [];
  for (const need of needed) {
    let found = false;
    for (const entry of receiptEntries) {
      for (const ref of openedAssetsForQid(entry.receipt, entry.schema, need.qid)) {
        const refPath = normalize(ref.path || ref.ref || ref.assetPath || '');
        const normalizedNeeded = normalize(need.path).replace(/^archive\//, '');
        if (!ref.__opened || refPath.replace(/^archive\//, '') !== normalizedNeeded) continue;
        const assetRel = refPath.startsWith('archive/') ? refPath : `archive/${refPath}`;
        const file = path.resolve(root, assetRel);
        if (!file.startsWith(path.resolve(root, 'archive') + path.sep) || !fs.existsSync(file)) fail('OPENED_ASSET_PATH_NOT_FOUND', assetRel);
        const actual = sha256(fs.readFileSync(file));
        if (cleanHash(ref.sha256 || ref.assetSha256 || ref.rawSha256) !== cleanHash(actual)) fail('OPENED_ASSET_SHA_MISMATCH', `q${need.qid}:${assetRel}`);
        found = true;
        verified.push({ qid: need.qid, path: assetRel, sha256: actual });
      }
    }
    if (!found) fail('CHANGED_IMAGE_ASSET_NOT_ACTUALLY_OPENED', `q${need.qid}:${need.path}`);
  }
  for (const entry of receiptEntries) {
    for (const { qid, row } of receiptRows(entry.receipt, entry.schema)) {
      for (const ref of openedAssetsForQid(entry.receipt, entry.schema, qid)) {
        if (!ref.__opened) continue;
        const refPath = normalize(ref.path || ref.ref || ref.assetPath || '');
        if (!refPath) continue;
        const assetRel = refPath.startsWith('archive/') ? refPath : `archive/${refPath}`;
        const file = path.resolve(root, assetRel);
        if (!file.startsWith(path.resolve(root, 'archive') + path.sep) || !fs.existsSync(file)) fail('OPENED_ASSET_PATH_NOT_FOUND', assetRel);
        if (cleanHash(ref.sha256 || ref.assetSha256 || ref.rawSha256) !== cleanHash(sha256(fs.readFileSync(file)))) fail('OPENED_ASSET_SHA_MISMATCH', `q${qid}:${assetRel}`);
      }
    }
  }
  return verified;
}

function buildReceiptEntries(root, examRel, baselineCommit, baselineSha, currentBytes, inputPaths) {
  if (!inputPaths.length) fail('R1_RECEIPT_REQUIRED');
  const currentSha = sha256(currentBytes);
  const currentBlob = gitBlobSha(root, currentBytes);
  const entries = [];
  for (const relInput of inputPaths) {
    const ref = repoPath(root, relInput, 'R1_RECEIPT');
    const bytes = fs.readFileSync(ref.absolute);
    const receipt = JSON.parse(bytes.toString('utf8'));
    const schema = receiptSchema(receipt);
    if (!SUPPORTED.has(schema)) fail('R1_RECEIPT_SCHEMA_UNSUPPORTED', `${ref.rel}:${schema}`);
    validateScopeOnly(receipt, schema, ref.rel);
    const source = receiptSource(receipt, schema);
    if (!source || !receiptSourcePath(root, source.path, examRel)) fail('R1_RECEIPT_EXAM_PATH_MISMATCH', ref.rel);
    if (Number(source.questionCount) && Number(source.questionCount) <= 0) fail('R1_RECEIPT_QUESTION_COUNT_INVALID', ref.rel);
    const sourceSha = cleanHash(source.sha256);
    const snapshot = findHistoricalSnapshot(root, examRel, sourceSha.startsWith('sha256:') ? sourceSha : `sha256:${sourceSha}`, currentBytes,
      baselineBytes(root, baselineCommit, examRel));
    const actualSourceSha = sha256(snapshot);
    const actualSourceBlob = gitBlobSha(root, snapshot);
    if (sourceSha !== cleanHash(actualSourceSha)) fail('R1_RECEIPT_SOURCE_SHA_MISMATCH', ref.rel);
    if (source.blob && cleanHash(source.blob) !== cleanHash(actualSourceBlob)) fail('R1_RECEIPT_SOURCE_BLOB_MISMATCH', ref.rel);
    const baseline = receipt.historicalBaseline || receipt.baseline || receipt.oldBaseline || receipt.baselineSource || receipt.artifactBinding || receipt.sourceBinding;
    if (baseline) {
      const receiptBaselineCommit = baseline.commit || baseline.sourceCommit || baseline.baselineCommit;
      if (receiptBaselineCommit) {
        const resolved = resolveCommit(root, receiptBaselineCommit);
        if (!resolved.startsWith(baselineCommit) && !baselineCommit.startsWith(resolved)) fail('R1_RECEIPT_BASELINE_COMMIT_MISMATCH', ref.rel);
      }
      const receiptBaselineSha = baseline.sourceRawSha256 || baseline.baselineSourceRawSha256 || baseline.baselineRawSha256 || baseline.rawSha256 || baseline.sha256;
      if (receiptBaselineSha && cleanHash(receiptBaselineSha) !== cleanHash(baselineSha)) fail('R1_RECEIPT_BASELINE_SHA_MISMATCH', ref.rel);
    }
    entries.push({ path: ref.rel, sourcePath: ref.rel, durablePath: durableReceiptPath(examRel, ref.rel, sha256(bytes)), absolutePath: ref.absolute, bytes, sha256: sha256(bytes), receipt, schema, sourceSha: actualSourceSha, sourceBlob: actualSourceBlob,
      sourceIsCurrent: cleanHash(actualSourceSha) === cleanHash(currentSha) && cleanHash(actualSourceBlob) === cleanHash(currentBlob), snapshot });
  }
  if (!entries.some(entry => entry.sourceIsCurrent)) fail('CURRENT_SOURCE_BOUND_R1_RECEIPT_REQUIRED');
  return entries;
}

function validateUnchangedClaims(entries, delta, oldBank, currentBank) {
  const oldById = new Map(oldBank.map(q => [Number(q.id), q]));
  const currentById = new Map(currentBank.map(q => [Number(q.id), q]));
  for (const entry of entries) {
    const receipt = entry.receipt;
    const exact = receipt.unchangedQidsExact || receipt.unchanged || receipt.unchangedStudentQidsExact || receipt.scope?.unchangedQids;
    if (!exact) continue;
    const qids = Array.isArray(exact) ? exact : Array.isArray(exact.qids) ? exact.qids : [];
    if (new Set(qids.map(Number)).size !== qids.length) fail('UNCHANGED_QID_DUPLICATE', entry.path);
    const fields = !Array.isArray(exact) && Array.isArray(exact.fields) ? exact.fields : null;
    const sourceFields = fields || STUDENT_PARITY_FIELDS;
    for (const qidValue of qids) {
      const qid = Number(qidValue), oldQ = oldById.get(qid), currentQ = currentById.get(qid);
      if (!oldQ || !currentQ) fail('UNCHANGED_QID_NOT_IN_BOTH_SOURCES', `${entry.path}:q${qid}`);
      if (entry.schema === 'JS_ARCHIVE_R1_SCOPED_CURRENT_SOURCE_REFRESH_V1' || entry.schema === 'M2_SCOPED_R1_SOURCE_REFRESH_V1') {
        if (stable(oldQ) !== stable(currentQ)) fail('UNTRUE_UNCHANGED_QID_PARITY_CLAIM', `${entry.path}:q${qid}`);
        continue;
      }
      const projection = q => Object.fromEntries(sourceFields.filter(field => field in q).map(field => [field, q[field]]));
      if (stable(projection(oldQ)) !== stable(projection(currentQ))) fail('UNTRUE_UNCHANGED_QID_PARITY_CLAIM', `${entry.path}:q${qid}`);
    }
    if (['M2_SCOPED_R1_SOURCE_REFRESH_V1', 'JS_ARCHIVE_R1_SCOPED_CURRENT_SOURCE_REFRESH_V1'].includes(entry.schema) && Array.isArray(exact)) {
      if (stable([...qids].map(Number).sort((a, b) => a - b)) !== stable(delta.unchangedQids)) fail('M2_UNCHANGED_QID_SET_MISMATCH', entry.path);
    }
  }
}

function validateChangedLocusCoverage(entries, delta) {
  const changedReport = [];
  const holdRows = [];
  for (const change of delta.changed) {
    const perField = {};
    const contributing = [];
    for (const field of change.fields) {
      const candidates = [];
      for (const entry of entries) {
        for (const item of receiptRows(entry.receipt, entry.schema)) {
          if (item.qid !== change.qid) continue;
          const loci = lociForRow(item.row, entry.schema, change.qid, entry.receipt);
          const covers = loci.includes(field) || (loci.includes('__META_SCOPE__') && META_FIELDS.has(field));
          if (!covers) continue;
          const status = rowReviewStatus(item.row, entry.schema, field);
          candidates.push({ entry, row: item.row, status });
        }
      }
      if (!candidates.length) fail('CHANGED_QID_LOCUS_UNREVIEWED', `q${change.qid}:${field}`);
      const final = candidates[candidates.length - 1];
      if (final.status === 'HOLD') {
        const holdEvidence = holdEvidenceFromRow(final.row);
        const axes = holdAxesFor(field, final.row);
        if (!axes.length) fail('NON_META_HOLD_AXIS_UNRESOLVED', `q${change.qid}:${field}`);
        if (!validateHoldEvidence(holdEvidence)) fail('R1_ITEM_HOLD_EVIDENCE_INCOMPLETE', `q${change.qid}`);
        for (const axis of axes) holdRows.push({ qid: change.qid, axis, field, entry: final.entry, row: final.row, holdEvidence });
      } else if (!['PASS', 'MATCH', 'SUPPORTED', 'PASS_AFTER_TARGETED_CORRECTION', 'TARGETED_CORRECTION_PASS', 'EXACT', 'REVIEWED_STATIC', 'REVIEWED_CURRENT_FIELDS'].includes(final.status)) {
        fail('CHANGED_QID_LOCUS_NOT_CLOSED', `q${change.qid}:${field}:${final.status || 'MISSING'}`);
      }
      perField[field] = {
        status: final.status,
        ...(field === 'solution' && final.status === 'REVIEWED_STATIC' ? { renderStatus: final.row.solution?.renderStatus || 'NOT_RUN' } : {}),
        ...(final.status === 'HOLD' ? { holdAxes: holdAxesFor(field, final.row) } : {}),
        receiptSha256: final.entry.sha256,
        receiptPath: final.entry.durablePath,
      };
      if (!contributing.includes(final.entry)) contributing.push(final.entry);
    }
    changedReport.push({ qid: change.qid, changedFields: change.fields, fieldDispositions: perField, receiptRefs: contributing.map(entry => ({ path: entry.durablePath, sourcePath: entry.sourcePath, sha256: entry.sha256 })) });
  }
  const dedupHoldRows = [...new Map(holdRows.map(item => [`${item.qid}:${item.axis}`, item])).values()];
  return { changedReport, holdRows: dedupHoldRows };
}
function unreviewedAxesFor(entries) {
  const solutionReviewed = entries.some(entry => {
    if (entry.schema === 'JS_ARCHIVE_STAGE_EVIDENCE_v2') return (entry.receipt.solutionReviews || []).length > 0;
    if (entry.schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1') return false;
    return receiptRows(entry.receipt, entry.schema).some(({ qid, row }) =>
      lociForRow(row, entry.schema, qid, entry.receipt).includes('solution')
      && ['PASS', 'PASS_AFTER_ADJUDICATION', 'PASS_AFTER_TARGETED_CORRECTION', 'REVIEWED_STATIC'].includes(rowReviewStatus(row, entry.schema, 'solution')));
  });
  const visualFollowup = entries.some(entry => isGoldM2R1RefreshSchema(entry.schema)
    && (entry.receipt.rows || []).some(row => /MISSING|FOLLOWUP|OPEN/i.test(String(row.visualSvg?.status || ''))));
  return [...(!solutionReviewed ? ['SOLUTION'] : []), 'RENDER', 'FULL_EXAM_R1', ...(visualFollowup ? ['VISUAL_SVG'] : [])];
}

function deepCopy(value) { return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }
export function durableReceiptPath(examRel, sourceReceiptRel, receiptSha256) {
  const normalizedSource = normalize(sourceReceiptRel);
  if (normalizedSource.startsWith(`${RECEIPT_DIR}/`)) return normalizedSource;
  const examStem = path.basename(examRel, '.js').replace(/[^\p{L}\p{N}._-]+/gu, '_');
  const digest = cleanHash(receiptSha256);
  if (!/^[0-9a-f]{64}$/.test(digest)) fail('R1_RECEIPT_SHA256_INVALID', sourceReceiptRel);
  return `${RECEIPT_DIR}/${examStem}.${digest}.json`;
}
function reviewSignature(review) {
  return JSON.stringify({ current: review?.current?.sha256, receiptShas: (review?.receipts || []).map(ref => ref.sha256).sort() });
}
export function preserveReviewHistory(previous, next) {
  if (!previous) return next;
  const priorHistory = Array.isArray(previous.history) ? deepCopy(previous.history) : [];
  if (reviewSignature(previous) === reviewSignature(next)) {
    next.history = priorHistory;
    return next;
  }
  next.history = [...priorHistory, { schemaVersion: SOURCE_REFRESH_HISTORY_SCHEMA, review: deepCopy(previous) }];
  return next;
}
function sourceSnapshotHistory(evidence) {
  return {
    examSha256: evidence.examSha256,
    finalArtifactGitBlob: evidence.finalArtifactGitBlob,
    questionRows: deepCopy(evidence.questionRows || []),
    metaRows: deepCopy(evidence.metaRows || []),
    summary: deepCopy(evidence.summary || {}),
  };
}
export function linkQuestionRows(evidence, changedReport) {
  const rows = evidence.questionRows || [];
  const byQid = new Map(rows.map(row => [Number(row.qid), row]));
  if (byQid.size !== rows.length) fail('PHYSICAL_EVIDENCE_QUESTION_ROWS_DUPLICATE');
  for (const change of changedReport) {
    const row = byQid.get(change.qid);
    if (!row) fail('PHYSICAL_EVIDENCE_QUESTION_ROW_MISSING', `q${change.qid}`);
    row.sourceRefreshReceiptRefs = change.receiptRefs.map(ref => ({ ...ref, qid: change.qid, changedFields: change.changedFields }));
  }
}
export function applyHolds(evidence, holdRows) {
  const qRows = new Map((evidence.questionRows || []).map(row => [Number(row.qid), row]));
  const mRows = new Map((evidence.metaRows || []).map(row => [Number(row.qid), row]));
  for (const item of holdRows) {
    const qRow = qRows.get(item.qid), mRow = mRows.get(item.qid);
    if (!qRow) fail('QUESTION_HOLD_PHYSICAL_ROW_MISSING', `q${item.qid}`);
    if (item.axis === 'meta') {
      if (!mRow) fail('META_HOLD_PHYSICAL_ROW_MISSING', `q${item.qid}`);
      qRow.meta = { ...(qRow.meta || {}), status: 'HOLD', holdEvidence: deepCopy(item.holdEvidence) };
      mRow.result = 'HOLD';
      mRow.holdEvidence = deepCopy(item.holdEvidence);
      mRow.sourceRefreshReceiptRef = { path: item.entry.durablePath, sha256: item.entry.sha256, qid: item.qid };
    } else {
      qRow[item.axis] = { ...(qRow[item.axis] || {}), status: 'HOLD', holdEvidence: deepCopy(item.holdEvidence) };
      qRow[`${item.axis}SourceRefreshReceiptRef`] = { path: item.entry.durablePath, sha256: item.entry.sha256, qid: item.qid };
    }
  }
  const held = new Set();
  for (const row of evidence.questionRows || []) {
    if (Object.values(row).some(axis => axis && typeof axis === 'object' && axis.status === 'HOLD')) held.add(Number(row.qid));
  }
  for (const row of evidence.metaRows || []) if (row.result === 'HOLD') held.add(Number(row.qid));
  evidence.summary = { ...(evidence.summary || {}), itemHoldCount: held.size };
}

function serializeLike(raw, value) {
  const trailingNewline = raw.endsWith('\n');
  const pretty = raw.includes('\n') ? 2 : 0;
  const text = JSON.stringify(value, null, pretty);
  return trailingNewline ? `${text}\n` : text;
}

export function parseArgs(argv) {
  const out = { mode: 'dry-run', r1Receipts: [] };
  let explicitMode = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--exam') out.exam = argv[++i];
    else if (arg === '--evidence') out.evidence = argv[++i];
    else if (arg === '--baseline-commit') out.baselineCommit = argv[++i];
    else if (arg === '--r1-receipt') out.r1Receipts.push(argv[++i]);
    else if (['--dry-run', '--write', '--check'].includes(arg)) {
      if (explicitMode) fail('MODE_FLAG_CONFLICT');
      out.mode = arg.slice(2);
      explicitMode = true;
    } else fail('UNKNOWN_ARGUMENT', arg);
  }
  if (!out.exam || !out.evidence || !out.baselineCommit) fail('EXAM_EVIDENCE_AND_BASELINE_COMMIT_REQUIRED');
  if (out.mode !== 'check' && out.r1Receipts.length === 0) fail('R1_RECEIPT_REQUIRED');
  return out;
}
export function withExecutionMode(report, mode) {
  if (!['dry-run', 'write', 'check'].includes(mode)) fail('INVALID_EXECUTION_MODE', mode);
  return { ...report, mode };
}

export function preparePlan({ root = ROOT, exam, evidence, baselineCommit, r1Receipts = [] }) {
  const examRef = repoPath(root, exam, 'EXAM');
  const evidenceRef = repoPath(root, evidence, 'EVIDENCE');
  if (!ALLOWED.has(examRef.rel)) fail('EXAM_NOT_IN_M2_REFRESH_ALLOWLIST', examRef.rel);
  if (!evidenceRef.rel.startsWith('archive/data/r2e-intake/m2/') || !evidenceRef.rel.endsWith('.create.physical-evidence.json')) fail('CREATE_PHYSICAL_EVIDENCE_PATH_REQUIRED');
  const currentBytes = fs.readFileSync(examRef.absolute);
  const currentSha = sha256(currentBytes);
  const currentBlob = gitBlobSha(root, currentBytes);
  const evidenceRaw = fs.readFileSync(evidenceRef.absolute, 'utf8');
  const evidenceObject = JSON.parse(evidenceRaw);
  const effectiveReceiptInputs = r1Receipts.length ? r1Receipts
    : (evidenceObject.sourceRefreshReviewV1?.receipts || []).map(ref => ref.durablePath).filter(Boolean);
  if (normalize(evidenceObject.examPath) !== examRef.rel) fail('EVIDENCE_EXAM_PATH_MISMATCH');
  const resolvedCommit = resolveCommit(root, baselineCommit);
  const oldBytes = baselineBytes(root, resolvedCommit, examRef.rel);
  const oldSha = sha256(oldBytes);
  const oldBlob = gitBlobSha(root, oldBytes);
  const priorBinding = evidenceObject.examSha256;
  const alreadyRefreshed = priorBinding === currentSha && evidenceObject.sourceRefreshReviewV1?.schemaVersion === SOURCE_REFRESH_SCHEMA;
  const knownPrior = alreadyRefreshed ? evidenceObject.sourceRefreshReviewV1.baseline?.sha256 : priorBinding;
  if (knownPrior !== oldSha) fail('STORED_EXAM_SHA_NOT_BOUND_TO_BASELINE', `${knownPrior} != ${oldSha}`);
  if (!alreadyRefreshed && priorBinding !== oldSha) fail('STORED_EXAM_SHA_NOT_BASELINE', priorBinding);
  const oldBank = bank(oldBytes, `git:${resolvedCommit}:${examRef.rel}`);
  const currentBank = bank(currentBytes, examRef.rel);
  const delta = deriveSourceDelta(oldBank, currentBank);
  const entries = buildReceiptEntries(root, examRef.rel, resolvedCommit, oldSha, currentBytes, effectiveReceiptInputs);
  const goldMain = entries.find(entry => isGoldM2R1RefreshSchema(entry.schema));
  const goldHold = entries.find(entry => entry.schema === 'JS_ARCHIVE_R1_SOURCE_HOLD_V1');
  if (goldMain || goldHold) {
    if (!goldMain || !goldHold) fail('GOLD_M2_MAIN_AND_Q24_HOLD_RECEIPTS_REQUIRED_TOGETHER');
    validateGoldM2R1SourceRefresh(goldMain.receipt, goldHold.receipt, ROOT, examRef.rel, resolvedCommit, oldBank, currentBank, delta);
  }
  for (const entry of entries) if (entry.schema === 'JS_ARCHIVE_STAGE_EVIDENCE_v2') validateConsolidatedStageEvidence(entry.receipt, currentBank, delta);
  for (const entry of entries) if (entry.schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_V1') validateScopedSourceRefreshV1(entry.receipt, root, currentBank, delta);
  for (const entry of entries) if (entry.schema === 'JS_ARCHIVE_R1_SCOPED_SOURCE_REFRESH_RECEIPT_V2') validateSourceRefreshReceiptV2(entry.receipt, root, oldBank, currentBank, delta);
  for (const entry of entries) if (isM2CurrentExamRefresh(entry.receipt, entry.schema)) validateM2CurrentExamSourceRefresh(entry.receipt, root, oldBank, currentBank, delta);
  for (const entry of entries) if (entry.schema === 'M2_SCOPED_R1_Q16_CONTENT_LAYOUT_FOLLOWUP_V1') validateQ16ContentLayoutFollowup(entry.receipt, root, examRef.rel, resolvedCommit, oldBank, currentBank, delta);
  validateUnchangedClaims(entries, delta, oldBank, currentBank);
  const { changedReport, holdRows } = validateChangedLocusCoverage(entries, delta);
  const openedAssets = verifyReceiptAssets(root, entries, delta);
  const unreviewedAxes = unreviewedAxesFor(entries);
  const itemHoldQids = [...new Set(holdRows.map(item => item.qid))].sort((a, b) => a - b);
  const questionCount = currentBank.length;
  if (Number(evidenceObject.questionCount) !== questionCount) fail('EVIDENCE_QUESTION_COUNT_MISMATCH');
  const historyEntry = {
    baseline: { commit: resolvedCommit, sha256: oldSha, gitBlobSha: oldBlob },
    current: { sha256: currentSha, gitBlobSha: currentBlob },
    preservedPriorEvidence: alreadyRefreshed ? null : sourceSnapshotHistory(evidenceObject),
    receiptRefs: entries.map(entry => ({ sourcePath: entry.sourcePath, sourceSha256: entry.sha256, durablePath: entry.durablePath })),
  };
  const sourceRefreshReviewV1 = {
    schemaVersion: SOURCE_REFRESH_SCHEMA,
    disposition: 'SCOPED_CHANGED_LOCI_REVIEW_BOUND_NOT_FULL_R1_PASS',
    scopeOnly: true,
    fullExamR1Pass: false,
    baseline: { commit: resolvedCommit, sha256: oldSha, gitBlobSha: oldBlob },
    current: { examPath: examRef.rel, sha256: currentSha, gitBlobSha: currentBlob, questionCount },
    exactUnchangedQids: delta.unchangedQids,
    studentPayloadUnchangedQids: delta.studentPayloadUnchangedQids,
    changedQids: changedReport,
    openedAssets,
    receipts: entries.map(entry => ({ sourcePath: entry.sourcePath, sha256: entry.sha256, sourceSha256: entry.sourceSha, sourceGitBlobSha: entry.sourceBlob, durablePath: entry.durablePath, schemaVersion: entry.schema })),
    itemHoldQids,
    unreviewedAxes,
  };
  const nextEvidence = deepCopy(evidenceObject);
  if (!alreadyRefreshed) {
    nextEvidence.physicalEvidenceBindingHistoryV1 = nextEvidence.physicalEvidenceBindingHistoryV1 || { schemaVersion: EVIDENCE_HISTORY_SCHEMA, entries: [] };
    if (nextEvidence.physicalEvidenceBindingHistoryV1.schemaVersion !== EVIDENCE_HISTORY_SCHEMA || !Array.isArray(nextEvidence.physicalEvidenceBindingHistoryV1.entries)) fail('EVIDENCE_HISTORY_SCHEMA_INVALID');
    nextEvidence.physicalEvidenceBindingHistoryV1.entries.push(historyEntry);
  }
  linkQuestionRows(nextEvidence, changedReport);
  applyHolds(nextEvidence, holdRows);
  nextEvidence.examSha256 = currentSha;
  if ('finalArtifactGitBlob' in nextEvidence) nextEvidence.finalArtifactGitBlob = currentBlob;
  nextEvidence.sourceRefreshReviewV1 = preserveReviewHistory(evidenceObject.sourceRefreshReviewV1, sourceRefreshReviewV1);
  const nextRaw = serializeLike(evidenceRaw, nextEvidence);
  const durableReceipts = entries.map(entry => ({
    sourcePath: entry.path,
    targetPath: entry.durablePath,
    sha256: entry.sha256,
    bytes: entry.bytes,
  }));
  return {
    examPath: examRef.rel, evidencePath: evidenceRef.rel, baselineCommit: resolvedCommit,
    baseline: { sha256: oldSha, gitBlobSha: oldBlob }, current: { sha256: currentSha, gitBlobSha: currentBlob },
    exactUnchangedQids: delta.unchangedQids, studentPayloadUnchangedQids: delta.studentPayloadUnchangedQids,
    changedQids: changedReport, itemHoldQids,
    unreviewedAxes,
    receiptRefs: durableReceipts.map(({ sourcePath, targetPath, sha256: receiptSha }) => ({ sourcePath, targetPath, sha256: receiptSha })),
    evidenceBytesChanged: nextRaw !== evidenceRaw, nextEvidence: nextRaw, durableReceipts,
  };
}

function assertCheck(root, plan) {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, plan.evidencePath), 'utf8'));
  if (evidence.examSha256 !== plan.current.sha256) fail('CHECK_EXAM_SHA_MISMATCH');
  if (evidence.finalArtifactGitBlob && evidence.finalArtifactGitBlob !== plan.current.gitBlobSha) fail('CHECK_EXAM_BLOB_MISMATCH');
  if (evidence.sourceRefreshReviewV1?.schemaVersion !== SOURCE_REFRESH_SCHEMA || evidence.sourceRefreshReviewV1.fullExamR1Pass !== false) fail('CHECK_SCOPED_REFRESH_RECEIPT_MISSING');
  for (const ref of plan.receiptRefs) {
    const stored = (evidence.sourceRefreshReviewV1.receipts || []).find(item => item.durablePath === ref.targetPath && item.sha256 === ref.sha256);
    if (!stored) fail('CHECK_SOURCE_REFRESH_RECEIPT_LINK_MISMATCH', ref.targetPath);
  }
  for (const ref of plan.receiptRefs) {
    const bytes = fs.readFileSync(path.join(root, ref.targetPath));
    if (sha256(bytes) !== ref.sha256) fail('CHECK_DURABLE_R1_RECEIPT_SHA_MISMATCH', ref.targetPath);
  }
  for (const change of plan.changedQids) {
    const row = (evidence.questionRows || []).find(item => Number(item.qid) === change.qid);
    if (!row || !Array.isArray(row.sourceRefreshReceiptRefs)) fail('CHECK_QID_RECEIPT_LINK_MISSING', `q${change.qid}`);
    for (const ref of change.receiptRefs) if (!row.sourceRefreshReceiptRefs.some(item => item.path === ref.path && item.sha256 === ref.sha256)) fail('CHECK_QID_RECEIPT_LINK_MISMATCH', `q${change.qid}`);
  }
  const held = new Set((evidence.questionRows || []).filter(row => Object.values(row).some(axis => axis && typeof axis === 'object' && axis.status === 'HOLD')).map(row => Number(row.qid)));
  for (const row of evidence.metaRows || []) if (row.result === 'HOLD') held.add(Number(row.qid));
  if (Number(evidence.summary?.itemHoldCount) !== held.size) fail('CHECK_ITEM_HOLD_COUNT_MISMATCH');
  return { ok: true, disposition: 'CHECK_PASS_SCOPED_NOT_FULL_R1', examPath: plan.examPath, evidencePath: plan.evidencePath, current: plan.current, changedQids: plan.changedQids.map(row => ({ qid: row.qid, fields: row.changedFields })), itemHoldQids: [...held].sort((a, b) => a - b) };
}
function writePlan(root, plan) {
  const pending = [];
  for (const item of plan.durableReceipts) {
    const target = path.resolve(root, item.targetPath);
    const dir = path.dirname(target);
    fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(target)) {
      const current = fs.readFileSync(target);
      if (sha256(current) !== item.sha256) fail('DURABLE_RECEIPT_PATH_COLLISION', item.targetPath);
      continue;
    }
    const temp = `${target}.tmp-${process.pid}`;
    fs.writeFileSync(temp, item.bytes);
    pending.push({ temp, target });
  }
  const evidencePath = path.resolve(root, plan.evidencePath);
  const evidenceTemp = `${evidencePath}.tmp-${process.pid}`;
  fs.writeFileSync(evidenceTemp, plan.nextEvidence, 'utf8');
  for (const item of pending) fs.renameSync(item.temp, item.target);
  fs.renameSync(evidenceTemp, evidencePath);
}

function main(argv) {
  const args = parseArgs(argv);
  const plan = preparePlan({ root: ROOT, exam: args.exam, evidence: args.evidence, baselineCommit: args.baselineCommit, r1Receipts: args.r1Receipts });
  let report;
  if (args.mode === 'check') report = assertCheck(ROOT, plan);
  else if (args.mode === 'write') {
    writePlan(ROOT, plan);
    report = { ok: true, disposition: 'SCOPED_REFRESH_WRITTEN_NOT_FULL_R1_PASS', ...plan };
  } else report = { ok: true, disposition: 'DRY_RUN_PLAN_ONLY', ...plan };
  report = withExecutionMode(report, args.mode);
  delete report.nextEvidence;
  delete report.durableReceipts;
  console.log(JSON.stringify(report, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(JSON.stringify({ ok: false, error: error.message }, null, 2)); process.exitCode = 1; }
}
