// An exact-source quality hold is separate from source integrity and native metadata approval.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import originalSourceError from '../../tools/4slot/original-source-error-hold.cjs';

export const SOURCE_QUALITY_HOLD_SCHEMA = 'archive-source-quality-holds-v1';
export const SOURCE_QUALITY_HOLD_LEDGER = 'archive/data/meta-foundation/source-quality-holds-v1.json';
export const SOURCE_QUALITY_HOLD_RESOLUTIONS = 'archive/data/meta-foundation/source-quality-hold-resolutions-v1.json';
export const SOURCE_QUALITY_HOLD_RESOLUTION_SCHEMA = 'archive-source-quality-hold-resolutions-v1';
export const SOURCE_QUALITY_HOLD_FIELDS = Object.freeze(['sourceIssueHold', 'sourceQualityHold']);
const UID = /^qid_v1_[a-f0-9]{64}$/;
const SHA1 = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const fail = code => { throw new Error('SOURCE_QUALITY_HOLD:' + code); };
const ensure = (value, code) => { if (!value) fail(code); };
const plain = value => value && typeof value === 'object' && !Array.isArray(value);
function keys(value, required) {
  ensure(plain(value) && Object.keys(value).sort().join('\0') === [...required].sort().join('\0'), 'SCHEMA_KEYS');
}
function safeRelative(relative) {
  ensure(typeof relative === 'string' && relative.length > 0 && relative.length < 600 &&
    relative === relative.normalize('NFC') && !/[\\\x00-\x1f\x7f]/.test(relative) &&
    !path.posix.isAbsolute(relative) && !relative.split('/').some(p => !p || p === '.' || p === '..' || p === '.git'), 'PATH');
  return relative;
}
function bytes(root, relative) {
  const resolvedRoot = fs.realpathSync(root);
  const file = path.resolve(resolvedRoot, safeRelative(relative));
  ensure(file.startsWith(resolvedRoot + path.sep) && fs.existsSync(file), 'FILE_MISSING');
  ensure(fs.realpathSync(file) === file && fs.statSync(file).isFile(), 'FILE_MODE');
  return fs.readFileSync(file);
}
function parse(raw) {
  try { return JSON.parse(raw.toString('utf8')); } catch { fail('JSON'); }
}
function refSchema(ref, prefix) {
  keys(ref, ['path', 'sha256']);
  safeRelative(ref.path);
  ensure(ref.path.startsWith(prefix) && ref.path.endsWith('.json') && SHA256.test(ref.sha256), 'EVIDENCE_REF');
}
function approvalRefSchema(ref) {
  if (ref?.path?.startsWith('docs/operations/')) refSchema(ref, 'docs/operations/');
  else {
    refSchema(ref, 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/');
    ensure(ref.path.endsWith('.parent-labels.json'), 'RECEIPT_PARENT_REF');
  }
}
function ledger(root) {
  const raw = bytes(root, SOURCE_QUALITY_HOLD_LEDGER), doc = parse(raw);
  keys(doc, ['schemaVersion', 'status', 'records']);
  ensure(doc.schemaVersion === SOURCE_QUALITY_HOLD_SCHEMA && doc.status === 'ACTIVE' &&
    Array.isArray(doc.records) && doc.records.length > 0 && doc.records.length <= 1000, 'LEDGER');
  const seenUid = new Set(), seenSource = new Set(), seenId = new Set();
  for (const row of doc.records) {
    keys(row, ['holdId', 'status', 'reasonCode', 'questionUid', 'sourceArchiveFile', 'sourceOrdinal',
      'expectedQuestionCount', 'sourceBlobSha1', 'sourceSha256', 'image', 'originalReceipt',
      'pendingRootEvidence', 'independentEvidence', 'unresolvedEvidence', 'releasePolicy']);
    ensure(typeof row.holdId === 'string' && /^[a-z0-9][a-z0-9-]{5,100}$/.test(row.holdId) &&
      row.status === 'HOLD' && row.reasonCode === 'SOURCE_CONDITION_NOT_ESTABLISHED' &&
      row.releasePolicy === 'EXPLICIT_SOURCE_EVIDENCE_RESOLUTION_REQUIRED' && UID.test(row.questionUid), 'HOLD_DECLARATION');
    safeRelative(row.sourceArchiveFile);
    ensure(/^original\/.+\.js$/.test(row.sourceArchiveFile) &&
      Number.isSafeInteger(row.sourceOrdinal) && Number.isSafeInteger(row.expectedQuestionCount) &&
      row.sourceOrdinal > 0 && row.expectedQuestionCount >= row.sourceOrdinal &&
      SHA1.test(row.sourceBlobSha1) && SHA256.test(row.sourceSha256), 'SOURCE_BINDING');
    const key = row.sourceArchiveFile + '#' + row.sourceOrdinal;
    ensure(!seenUid.has(row.questionUid) && !seenSource.has(key) && !seenId.has(row.holdId), 'DUPLICATE_HOLD');
    seenUid.add(row.questionUid); seenSource.add(key); seenId.add(row.holdId);
    keys(row.image, ['path', 'sha256', 'bytes']);
    safeRelative(row.image.path);
    ensure(row.image.path.startsWith('archive/assets/images/') && SHA256.test(row.image.sha256) &&
      Number.isSafeInteger(row.image.bytes) && row.image.bytes > 0, 'IMAGE_REF');
    refSchema(row.originalReceipt, 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/');
    for (const key of ['pendingRootEvidence', 'independentEvidence', 'unresolvedEvidence']) refSchema(row[key], 'docs/operations/');
  }
  return { raw, doc };
}

// Append-only owner-decision resolutions (docs/architecture/source-quality-holds-v1.md, exception section).
// A hold with a resolution no longer pins its source file to any edition; the ledger record itself is never edited.
// The file is optional. A hold without a matching record is unchanged, and status edits alone are still rejected.
function resolutions(root, doc) {
  const file = path.resolve(fs.realpathSync(root), SOURCE_QUALITY_HOLD_RESOLUTIONS);
  if (!fs.existsSync(file)) return { resolved: new Set(), raw: null };
  const raw = bytes(root, SOURCE_QUALITY_HOLD_RESOLUTIONS), res = parse(raw);
  keys(res, ['schemaVersion', 'records']);
  ensure(res.schemaVersion === SOURCE_QUALITY_HOLD_RESOLUTION_SCHEMA && Array.isArray(res.records) && res.records.length <= 1000, 'RESOLUTION_LEDGER');
  const holdIds = new Set(doc.records.map(r => r.holdId)), resolved = new Set(), text = v => typeof v === 'string' && v.trim().length > 0;
  for (const row of res.records) {
    keys(row, ['holdId', 'resolutionKind', 'decidedAt', 'decisionQuote', 'basis', 'changedOrdinals']);
    ensure(row.resolutionKind === 'OWNER_DECISION_MINIMAL_FIX' && text(row.decisionQuote) && text(row.basis) &&
      text(row.decidedAt) && /^\d{4}-\d{2}-\d{2}/.test(row.decidedAt) &&
      Array.isArray(row.changedOrdinals) && row.changedOrdinals.length > 0 &&
      row.changedOrdinals.every(n => Number.isSafeInteger(n) && n > 0), 'RESOLUTION_RECORD');
    ensure(holdIds.has(row.holdId), 'RESOLUTION_HOLD_ID');
    ensure(!resolved.has(row.holdId), 'RESOLUTION_DUPLICATE');
    resolved.add(row.holdId);
  }
  return { resolved, raw };
}

// Dependency selectors use the same closed ledger schema. Full byte/identity validation happens
// before catalog publication. A missing or malformed ledger never turns a held UID into an unheld UID.
export function sourceQualityHoldDependencyPaths(root) {
  const { doc } = ledger(root);
  const receiptEvidence = doc.records.flatMap(row => {
    const raw = bytes(root, row.originalReceipt.path);
    ensure(sha(raw) === row.originalReceipt.sha256, 'EVIDENCE_DIGEST');
    const refs = parse(raw).approval?.evidenceRefs;
    ensure(Array.isArray(refs) && refs.length > 0, 'RECEIPT_EVIDENCE');
    return refs.map(ref => { approvalRefSchema(ref); return ref.path; });
  });
  resolutions(root, doc);
  const resolutionPath = fs.existsSync(path.join(root, SOURCE_QUALITY_HOLD_RESOLUTIONS)) ? [SOURCE_QUALITY_HOLD_RESOLUTIONS] : [];
  return [...new Set([SOURCE_QUALITY_HOLD_LEDGER, ...resolutionPath, 'archive/tools/source-quality-holds.mjs',
    ...receiptEvidence, ...originalSourceError.dependencyPaths(root),
    ...doc.records.flatMap(row => ['archive/exams/' + row.sourceArchiveFile, row.image.path,
      row.originalReceipt.path, row.pendingRootEvidence.path, row.independentEvidence.path,
      row.unresolvedEvidence.path])])].sort();
}

export function loadSourceQualityHolds({ root, identity }) {
  const { raw, doc } = ledger(root), ledgerSha256 = sha(raw), holds = new Map(), observed = new Set();
  ensure(Array.isArray(identity?.records), 'IDENTITY_REQUIRED');
  const proofPaths = new Set([SOURCE_QUALITY_HOLD_LEDGER]), { resolved, raw: resolutionRaw } = resolutions(root, doc);
  if (resolutionRaw) proofPaths.add(SOURCE_QUALITY_HOLD_RESOLUTIONS);
  const readRef = ref => {
    const raw = bytes(root, ref.path); ensure(sha(raw) === ref.sha256, 'EVIDENCE_DIGEST');
    proofPaths.add(ref.path); return parse(raw);
  };
  for (const row of doc.records) {
    // Owner-resolved hold: not bound to any source edition, receipt blob, fingerprint or unresolved evidence; the row is ordinary.
    if (resolved.has(row.holdId)) continue;
    const sourcePath = 'archive/exams/' + row.sourceArchiveFile, source = bytes(root, sourcePath);
    ensure(blob(source) === row.sourceBlobSha1 && sha(source) === row.sourceSha256, 'SOURCE_EDITION');
    const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(ctx); vm.runInContext(source.toString('utf8'), ctx, { filename: sourcePath, timeout: 3000 });
    const bank = ctx.window.questionBank || ctx.window.questions || ctx.questionBank || ctx.questions || ctx.window.examData?.questions;
    ensure(Array.isArray(bank) && bank.length === row.expectedQuestionCount, 'SOURCE_COUNT');
    const question = bank[row.sourceOrdinal - 1];
    ensure(plain(question) && (!question.questionUid || question.questionUid === row.questionUid), 'SOURCE_UID');
    const ids = identity.records.filter(r => r.questionUid === row.questionUid ||
      r.sourceArchiveFile === row.sourceArchiveFile && Number(r.sourceOrdinal) === row.sourceOrdinal);
    ensure(ids.length === 1 && ids[0].questionUid === row.questionUid && (!ids[0].status || ids[0].status === 'VERIFIED') &&
      ids[0].sourceArchiveFile === row.sourceArchiveFile && Number(ids[0].sourceOrdinal) === row.sourceOrdinal, 'IDENTITY_JOIN');
    const sourceFingerprint = sha(JSON.stringify({ content: question.content ?? null,
      choices: Array.isArray(question.choices) ? question.choices : null, answer: question.answer ?? null,
      solution: question.solution ?? null, image: question.image ?? null }));
    ensure(ids[0].sourceFingerprint === sourceFingerprint, 'IDENTITY_FINGERPRINT');
    const image = bytes(root, row.image.path);
    ensure(image.length === row.image.bytes && sha(image) === row.image.sha256, 'IMAGE_DIGEST');
    ensure(typeof question.image === 'string' && ('archive/' + question.image.replace(/^\/?(?:archive\/)?/, '')) === row.image.path, 'IMAGE_QUESTION_BINDING');
    const receipt = readRef(row.originalReceipt);
    ensure(receipt.schemaVersion === 'archive-reviewed-exam-meta-registration-v2' &&
      receipt.metadataRegistrationStatus === 'REGISTERED' && receipt.sourceArchiveFile === row.sourceArchiveFile &&
      receipt.sourceBlobSha1 === row.sourceBlobSha1 && receipt.sourceRawSha256 === row.sourceSha256 &&
      (receipt.expectedQuestionCount ?? receipt.totalQuestions) === row.expectedQuestionCount &&
      Array.isArray(receipt.appliedRecords) && receipt.totalQuestions === receipt.appliedRecords.length, 'RECEIPT_SOURCE');
    const accepted = receipt.appliedRecords.filter(r => r.questionUid === row.questionUid ||
      Number(r.sourceOrdinal) === row.sourceOrdinal);
    ensure(accepted.length === 1 && accepted[0].questionUid === row.questionUid &&
      Number(accepted[0].sourceOrdinal) === row.sourceOrdinal && accepted[0].sourceFingerprint === sourceFingerprint, 'RECEIPT_UID');
    const approvalRefs = receipt.approval?.evidenceRefs;
    ensure(Array.isArray(approvalRefs) && approvalRefs.length > 0, 'RECEIPT_EVIDENCE');
    for (const ref of approvalRefs) {
      approvalRefSchema(ref); readRef(ref);
    }
    for (const ref of [row.pendingRootEvidence, row.independentEvidence])
      ensure(approvalRefs.some(r => r.path === ref.path && r.sha256 === ref.sha256), 'RECEIPT_PENDING_REF');
    const pending = readRef(row.pendingRootEvidence), independent = readRef(row.independentEvidence), unresolved = readRef(row.unresolvedEvidence);
    const pendingRows = pending.items?.filter(r => Number(r.sourceOrdinal) === row.sourceOrdinal) || [];
    ensure(pendingRows.length === 1 && pendingRows[0].disposition === 'EVIDENCE_PENDING' &&
      pendingRows[0].sourceMetadataChangeAllowed === false, 'PENDING_ROOT_DECISION');
    ensure(independent.summary?.difficultyEvidencePendingOrdinals?.includes(row.sourceOrdinal), 'PENDING_INDEPENDENT_DECISION');
    ensure(unresolved.questionUid === row.questionUid && Number(unresolved.ordinal) === row.sourceOrdinal &&
      unresolved.sourcePath === sourcePath && unresolved.sourceBlob === row.sourceBlobSha1 &&
      unresolved.sourceSha256 === row.sourceSha256 && unresolved.status === 'SEMANTIC_UNJUDGED_SOURCE_CONDITION_NOT_ESTABLISHED' &&
      unresolved.imageEvidence?.repositoryPath === row.image.path && unresolved.imageEvidence.sha256 === row.image.sha256 &&
      unresolved.imageEvidence.bytes === row.image.bytes && unresolved.storedValuesAreNotNewSemanticApproval === true, 'UNRESOLVED_DECISION');
    holds.set(row.questionUid, Object.freeze({ sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal,
      sourceFingerprint, projection: Object.freeze({ schemaVersion: 'archive-source-quality-hold-projection-v1',
        holdId: row.holdId, status: row.status, reasonCode: row.reasonCode, ledgerPath: SOURCE_QUALITY_HOLD_LEDGER,
        ledgerSha256, sourceBlobSha1: row.sourceBlobSha1, originalReceiptSha256: row.originalReceipt.sha256,
        releasePolicy: row.releasePolicy }) }));
  }
  if (originalSourceError.relevant(root, identity)) {
    const held = originalSourceError.verify(root, { identity });
    ensure(!holds.has(held.questionUid), 'DUPLICATE_NAMED_HOLD');
    holds.set(held.questionUid, Object.freeze(held));
    for (const [p] of held.observed) proofPaths.add(p);
  }
  return { holds, observed, ledgerSha256,
    manifestPaths: [...proofPaths].map(p => path.posix.relative('archive', p)).sort() };
}

export function applySourceQualityHold(record, state) {
  const hold = state.holds.get(record.questionUid);
  if (!hold) return record;
  ensure(!state.observed.has(record.questionUid), 'DUPLICATE_CATALOG_UID');
  if (hold.negativeOnly === true) {
    // The historical identity fingerprint remains unchanged. This negative
    // projection cannot turn an unverified source into an approved source.
    ensure(originalSourceError.isSubject(record) && record.sourceFile === hold.sourceArchiveFile &&
      Number(record.sourceOrdinal) === hold.sourceOrdinal && record.sourceFingerprint === hold.sourceFingerprint, 'NAMED_CATALOG_BINDING');
    record.sourceIssueHold = true; record.sourceQualityHold = hold.projection;
    state.observed.add(record.questionUid); return record;
  }
  ensure(record.sourceFile === hold.sourceArchiveFile && Number(record.sourceOrdinal) === hold.sourceOrdinal &&
    record.sourceFingerprint === hold.sourceFingerprint && record.identityStatus === 'VERIFIED' &&
    record.sourceIntegrityStatus === 'VERIFIED', 'CATALOG_BINDING');
  record.sourceIssueHold = true;
  record.sourceQualityHold = hold.projection;
  state.observed.add(record.questionUid);
  return record;
}

export function assertSourceQualityHoldCoverage(state) {
  ensure(state.holds.size === state.observed.size && [...state.holds.keys()].every(uid => state.observed.has(uid)), 'CATALOG_COVERAGE');
}
