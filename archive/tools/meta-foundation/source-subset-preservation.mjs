// A strict subset transports existing approvals after other source rows change.
// This evidence selects prior UIDs; it never supplies metadata or a new review.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const SOURCE_SUBSET_SCHEMA = 'archive-native-source-subset-preservation-v1';
export const SOURCE_SUBSET_EVIDENCE_SCHEMA = 'archive-native-source-subset-evidence-v1';
const PREFIX = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/, SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fail = message => { throw Error(`native source subset: ${message}`); };
const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) &&
  same(Object.keys(value).sort(), [...keys].sort());

export function sourceSubsetEvidencePath(requestId) {
  if (!ID.test(requestId || '')) fail('valid request identity required');
  return `${PREFIX}${requestId}.source-subset.json`;
}
export const hasSourceSubsetMarker = row => Array.isArray(row?.approvalEvidence) && row.approvalEvidence.some(p =>
  typeof p === 'string' && p.startsWith(PREFIX) && p.endsWith('.source-subset.json') &&
  ID.test(p.slice(PREFIX.length, -'.source-subset.json'.length)));
export const isSourceSubsetRebind = spec => spec?.schemaVersion === SOURCE_SUBSET_SCHEMA;
export const preservedSourceEvidence = (before, receiptPath, spec) => [...new Set([
  ...(before || []), receiptPath, ...(isSourceSubsetRebind(spec) ? [spec.subsetEvidenceRef?.path] : []),
])];

// Excluded UIDs may already have a separate renderer receipt. Replaying the old
// approval needs its SHA-bound historical fingerprints, never a fabricated UID
// mapping. Preserve every live identity field except that historical fingerprint
// in this read-only verifier context; the selected identities are checked exactly
// by the caller before entering this helper.
export function priorSourceIdentityContext({ identityMap, identityByJoin }, prior) {
  if (!Array.isArray(identityMap?.records) || !(identityByJoin instanceof Map) ||
      !Array.isArray(prior.appliedIdentityRecords)) fail('actual identity map required');
  const originals = new Map();
  const withoutFingerprint = row => Object.fromEntries(Object.entries(row || {}).filter(([key]) => key !== 'sourceFingerprint'));
  for (const row of prior.appliedIdentityRecords) {
    const join = `${row.sourceArchiveFile}#${row.sourceOrdinal}`, live = identityByJoin.get(join);
    if (originals.has(row.questionUid) || row.sourceArchiveFile !== prior.sourceArchiveFile ||
        identityMap.records.filter(r => r.questionUid === row.questionUid).length !== 1 ||
        identityMap.records.filter(r => r.sourceArchiveFile === row.sourceArchiveFile && r.sourceOrdinal === row.sourceOrdinal).length !== 1 ||
        !same(withoutFingerprint(live), withoutFingerprint(row)) || !SHA256.test(row.sourceFingerprint || ''))
      fail('historical identity must keep the exact live UID and source tuple');
    originals.set(row.questionUid, row);
  }
  const records = identityMap.records.map(row => originals.get(row.questionUid) || row);
  return { identityMap: { ...identityMap, records },
    identityByJoin: new Map(records.map(row => [`${row.sourceArchiveFile}#${row.sourceOrdinal}`, row])) };
}

function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\') ||
      /[\x00-\x1f]/.test(relative) || relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe evidence path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence path');
  return full;
}
function inventory(rows, label) {
  if (!Array.isArray(rows) || !rows.length || rows.some(r => !exactKeys(r, ['questionUid', 'sourceOrdinal']) ||
      typeof r.questionUid !== 'string' || !r.questionUid || !Number.isInteger(r.sourceOrdinal) || r.sourceOrdinal < 1) ||
      new Set(rows.map(r => r.questionUid)).size !== rows.length || new Set(rows.map(r => r.sourceOrdinal)).size !== rows.length)
    fail(`${label} inventory missing, duplicated or invalid`);
  return [...rows].sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
}
const selection = rows => rows.map(({ questionUid, sourceOrdinal }) => ({ questionUid, sourceOrdinal }));

// Both the writer and ancestry verifiers call this exact contract. The caller
// additionally rechecks the actual whole questions, approvals and original leaf.
export function validateSourceSubsetEvidence({ root, current, prior, selected }) {
  const spec = current.approval?.sourceRebind, ref = spec?.subsetEvidenceRef;
  if (!isSourceSubsetRebind(spec) || !exactKeys(spec, ['schemaVersion', 'priorReceiptRef', 'subsetEvidenceRef']) ||
      !exactKeys(ref, ['path', 'sha256']) || ref.path !== sourceSubsetEvidencePath(current.requestId) || !SHA256.test(ref.sha256 || '') ||
      !exactKeys(spec.priorReceiptRef, ['path', 'sha256']) || !SHA256.test(spec.priorReceiptRef.sha256 || '') ||
      !current.approval.evidenceRefs?.some(r => same(r, ref)) ||
      !current.approval.evidenceRefs?.some(r => same(r, spec.priorReceiptRef))) fail('exact typed subset references required');
  if (Array.isArray(current.items) && current.items.some(item => !item.evidenceRefs?.some(r => same(r, ref))))
    fail('each selected item must bind the subset evidence');
  const full = safePath(root, ref.path);
  if (!fs.existsSync(full) || sha(fs.readFileSync(full)) !== ref.sha256) fail('subset evidence missing or changed');
  let doc;
  try { doc = JSON.parse(fs.readFileSync(full, 'utf8')); } catch { fail('subset evidence JSON invalid'); }
  if (!exactKeys(doc, ['schemaVersion', 'scope', 'requestId', 'examUid', 'sourceArchiveFile', 'expectedQuestionCount',
      'priorReceiptRef', 'priorPartialUidCount', 'selectedUidCount', 'selected', 'excluded', 'priorSourceBlobSha1',
      'priorSourceRawSha256', 'currentSourceBlobSha1', 'currentSourceRawSha256', 'newMetadataApprovals', 'newMathematicalQa', 'newReviewPassCount']) ||
      doc.schemaVersion !== SOURCE_SUBSET_EVIDENCE_SCHEMA || doc.scope !== 'STRICT_SUBSET_OF_PRIOR_FINAL_QA' ||
      current.scope !== 'PARTIAL_UIDS' || current.approval.type !== 'FINAL_QA' || current.requestId === prior.requestId ||
      prior.scope !== 'PARTIAL_UIDS' || prior.approval?.type !== 'FINAL_QA' ||
      prior.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2' || prior.metadataRegistrationStatus !== 'REGISTERED' ||
      prior.approval.metadataReviewed !== true || !String(prior.approval.approvedBy || '').trim() ||
      !ID.test(prior.requestId || '') || !SHA256.test(prior.requestSha256 || '') ||
      !SHA1.test(prior.sourceBlobSha1 || '') || !SHA256.test(prior.sourceRawSha256 || '') ||
      !SHA1.test(current.sourceBlobSha1 || '') || !SHA256.test(current.sourceRawSha256 || '') ||
      doc.requestId !== current.requestId || doc.examUid !== current.examUid || prior.examUid !== current.examUid ||
      doc.sourceArchiveFile !== current.sourceArchiveFile || prior.sourceArchiveFile !== current.sourceArchiveFile ||
      !Number.isInteger(doc.expectedQuestionCount) || doc.expectedQuestionCount !== current.expectedQuestionCount ||
      prior.expectedQuestionCount !== current.expectedQuestionCount || !same(doc.priorReceiptRef, spec.priorReceiptRef) ||
      spec.priorReceiptRef.path !== `${PREFIX}${prior.requestId}.json` ||
      doc.priorSourceBlobSha1 !== prior.sourceBlobSha1 || doc.priorSourceRawSha256 !== prior.sourceRawSha256 ||
      doc.currentSourceBlobSha1 !== current.sourceBlobSha1 || doc.currentSourceRawSha256 !== current.sourceRawSha256 ||
      prior.sourceBlobSha1 === current.sourceBlobSha1 || prior.sourceRawSha256 === current.sourceRawSha256 ||
      doc.newMetadataApprovals !== 0 || doc.newMathematicalQa !== false || doc.newReviewPassCount !== 0)
    fail('subset source, authority or zero-approval scope mismatch');
  const picked = inventory(selection(selected), 'selected'), declared = inventory(doc.selected, 'declared selected');
  const original = inventory(selection(prior.appliedRecords || []), 'prior');
  const selectedUids = new Set(picked.map(r => r.questionUid));
  const omitted = original.filter(r => !selectedUids.has(r.questionUid));
  if (picked.length >= original.length || !same(picked, declared) || !same(inventory(doc.excluded, 'excluded'), omitted) ||
      picked.some(r => !original.some(old => same(old, r))) ||
      doc.selectedUidCount !== picked.length || doc.priorPartialUidCount !== original.length ||
      prior.partialUidCount !== original.length || prior.totalQuestions !== original.length ||
      original.length > current.expectedQuestionCount || original.some(r => r.sourceOrdinal > current.expectedQuestionCount) ||
      !same(inventory(selection(prior.appliedIdentityRecords || []), 'prior identity'), original) ||
      !same(inventory(selection(prior.runtimeRecords || []), 'prior runtime'), original))
    fail('selection must be an exact nonempty strict subset of the full prior inventory');
  return { evidenceRef: ref, selected: picked, excluded: omitted, priorPartialUidCount: original.length };
}
