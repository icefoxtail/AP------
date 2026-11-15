// A strict subset transports existing approvals after other source rows change.
// This evidence selects prior UIDs; it never supplies metadata or a new review.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { REASSESSED_STUDENT_FIELDS } from './reviewed-source-reassessment.mjs';

export const SOURCE_SUBSET_SCHEMA = 'archive-native-source-subset-preservation-v1';
export const SOURCE_SUBSET_EVIDENCE_SCHEMA = 'archive-native-source-subset-evidence-v1';
export const FULL_SOURCE_SUBSET_SCHEMA = 'archive-native-full-source-subset-preservation-v1';
export const FULL_SOURCE_SUBSET_EVIDENCE_SCHEMA = 'archive-native-full-source-subset-evidence-v1';
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
export function fullSourceSubsetEvidencePath(requestId) {
  if (!ID.test(requestId || '')) fail('valid full-subset request identity required');
  return `${PREFIX}${requestId}.full-source-subset.json`;
}
export const hasSourceSubsetMarker = row => Array.isArray(row?.approvalEvidence) && row.approvalEvidence.some(p =>
  typeof p === 'string' && p.startsWith(PREFIX) && ['.source-subset.json', '.full-source-subset.json'].some(suffix =>
    p.endsWith(suffix) && ID.test(p.slice(PREFIX.length, -suffix.length))));
export const isSourceSubsetRebind = spec => spec?.schemaVersion === SOURCE_SUBSET_SCHEMA;
export const isFullSourceSubsetRebind = spec => spec?.schemaVersion === FULL_SOURCE_SUBSET_SCHEMA;
export const isExplicitSourceSubsetRebind = spec => isSourceSubsetRebind(spec) || isFullSourceSubsetRebind(spec);
export const preservedSourceEvidence = (before, receiptPath, spec) => [...new Set([
  ...(before || []), receiptPath, ...(isExplicitSourceSubsetRebind(spec) ? [spec.subsetEvidenceRef?.path] : []),
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

function boundJson(root, ref) {
  if (!exactKeys(ref, ['path', 'sha256']) || !SHA256.test(ref.sha256 || '')) fail('exact full approval evidence reference required');
  const raw = fs.readFileSync(safePath(root, ref.path));
  if (sha(raw) !== ref.sha256) fail('full approval evidence missing or changed');
  return JSON.parse(raw);
}
function fullInventory(receipt) {
  const count = receipt.totalQuestions;
  if (receipt.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2' || receipt.metadataRegistrationStatus !== 'REGISTERED' ||
      ['scope', 'partialUidCount', 'expectedQuestionCount', 'registrationMode'].some(key => Object.hasOwn(receipt, key)) ||
      receipt.approval?.type !== 'FINAL_QA' || receipt.approval.metadataReviewed !== true || !String(receipt.approval.approvedBy || '').trim() ||
      !ID.test(receipt.requestId || '') || !SHA256.test(receipt.requestSha256 || '') ||
      !SHA1.test(receipt.sourceBlobSha1 || '') || !SHA256.test(receipt.sourceRawSha256 || '') ||
      !Number.isSafeInteger(count) || count < 2) fail('original unmodified full FINAL_QA receipt required');
  const original = inventory(selection(receipt.appliedRecords || []), 'full prior');
  if (original.length !== count || original.some((r, i) => r.sourceOrdinal !== i + 1)) fail('full prior denominator/ordinal order mismatch');
  for (const rows of [receipt.appliedRecords, receipt.appliedIdentityRecords, receipt.runtimeRecords]) {
    if (!Array.isArray(rows) || rows.length !== count || rows.some((r, i) => r.sourceArchiveFile !== receipt.sourceArchiveFile ||
        r.sourceOrdinal !== i + 1 || r.questionUid !== original[i].questionUid)) fail('full prior UID/order/identity/runtime inventory mismatch');
  }
  return original;
}
function historicalBank(root, blobSha1, rawSha256, count) {
  let raw;
  try { raw = execFileSync('git', ['cat-file', 'blob', blobSha1], { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { fail('original full source Git object unavailable'); }
  const actualBlob = crypto.createHash('sha1').update(`blob ${raw.length}\0`).update(raw).digest('hex');
  if (actualBlob !== blobSha1 || sha(raw) !== rawSha256) fail('original full source raw/Git binding changed');
  const ctx = { window: {} }; vm.runInNewContext(raw.toString(), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questionBank || ctx.questions || ctx.window.examData?.questions;
  if (!Array.isArray(bank) || bank.length !== count) fail('original full source denominator changed');
  return JSON.parse(JSON.stringify(bank));
}

// This separate opt-in supports the original full-exam reuse contract. It never
// rewrites that receipt as PARTIAL_UIDS or treats an old full approval as a new
// native reassessment. Its actual legacy receipt, reuse proof, prior receipt and
// both historical source objects remain the authority.
export function validateFullSourceSubsetEvidence({ root, current, prior, selected }) {
  const spec = current.approval?.sourceRebind, ref = spec?.subsetEvidenceRef;
  if (!isFullSourceSubsetRebind(spec) || !exactKeys(spec, ['schemaVersion', 'priorReceiptRef', 'subsetEvidenceRef']) ||
      ref?.path !== fullSourceSubsetEvidencePath(current.requestId) ||
      !current.approval.evidenceRefs?.some(r => same(r, ref)) || !current.approval.evidenceRefs?.some(r => same(r, spec.priorReceiptRef)) ||
      current.scope !== 'PARTIAL_UIDS' || current.approval.type !== 'FINAL_QA' || current.registrationMode !== undefined ||
      Array.isArray(current.items) && current.items.some(item => !item.evidenceRefs?.some(r => same(r, ref))))
    fail('exact typed full-subset references and partial output required');
  const doc = boundJson(root, ref), original = fullInventory(prior), count = original.length;
  if (!same(boundJson(root, spec.priorReceiptRef), prior) || spec.priorReceiptRef.path !== `${PREFIX}${prior.requestId}.json`)
    fail('original full receipt bytes changed');
  if (!exactKeys(doc, ['schemaVersion', 'scope', 'requestId', 'examUid', 'sourceArchiveFile', 'expectedQuestionCount',
      'priorReceiptRef', 'priorFullQuestionCount', 'priorReuseProofRef', 'selectedUidCount', 'selected', 'excluded', 'priorSourceBlobSha1',
      'priorSourceRawSha256', 'currentSourceBlobSha1', 'currentSourceRawSha256', 'newMetadataApprovals', 'newMathematicalQa', 'newReviewPassCount']) ||
      doc.schemaVersion !== FULL_SOURCE_SUBSET_EVIDENCE_SCHEMA || doc.scope !== 'STRICT_SUBSET_OF_PRIOR_FULL_FINAL_QA' ||
      doc.requestId !== current.requestId || current.requestId === prior.requestId || doc.examUid !== current.examUid || prior.examUid !== current.examUid ||
      doc.sourceArchiveFile !== current.sourceArchiveFile || prior.sourceArchiveFile !== current.sourceArchiveFile ||
      current.expectedQuestionCount !== count || doc.expectedQuestionCount !== count || doc.priorFullQuestionCount !== count ||
      !same(doc.priorReceiptRef, spec.priorReceiptRef) || doc.priorSourceBlobSha1 !== prior.sourceBlobSha1 || doc.priorSourceRawSha256 !== prior.sourceRawSha256 ||
      !SHA1.test(current.sourceBlobSha1 || '') || !SHA256.test(current.sourceRawSha256 || '') ||
      doc.currentSourceBlobSha1 !== current.sourceBlobSha1 || doc.currentSourceRawSha256 !== current.sourceRawSha256 ||
      prior.sourceBlobSha1 === current.sourceBlobSha1 || prior.sourceRawSha256 === current.sourceRawSha256 ||
      doc.newMetadataApprovals !== 0 || doc.newMathematicalQa !== false || doc.newReviewPassCount !== 0)
    fail('full-subset source, denominator or zero-approval scope mismatch');
  const picked = inventory(selection(selected), 'full selected'), selectedUids = new Set(picked.map(r => r.questionUid));
  const omitted = original.filter(r => !selectedUids.has(r.questionUid));
  if (picked.length >= count || doc.selectedUidCount !== picked.length || !same(inventory(doc.selected, 'declared full selected'), picked) ||
      !same(inventory(doc.excluded, 'full excluded'), omitted) || picked.some(row => !original.some(old => same(old, row))))
    fail('full selection must be an exact nonempty proper subset with its complete complement');
  const authority = validateOriginalFullFinalQaReuse({ root, prior, priorReceiptRef: spec.priorReceiptRef });
  if (!same(doc.priorReuseProofRef, authority.proofRef) || !current.approval.evidenceRefs.some(r => same(r, authority.proofRef)))
    fail('full-subset request must bind the original reuse proof');
  return { evidenceRef: ref, selected: picked, excluded: omitted, priorFullQuestionCount: count, priorReuseProofRef: authority.proofRef };
}

// Shared by the full-source subset and separately reviewed renderer transport.
// This authenticates an existing whole-exam approval; it issues no new approval.
export function validateOriginalFullFinalQaReuse({ root, prior, priorReceiptRef }) {
  const original = fullInventory(prior), count = original.length;
  if (priorReceiptRef?.path !== `${PREFIX}${prior.requestId}.json` || !same(boundJson(root, priorReceiptRef), prior))
    fail('exact original full receipt reference required');
  const reuse = prior.approval.reuse;
  if (reuse?.mode !== 'EXACT_PRIOR_FINAL_QA_PLUS_REVIEWED_DIFFICULTY' || reuse.newSemanticJudgments !== 0 || reuse.preservedPriorApprovals !== count ||
      !prior.approval.evidenceRefs?.some(r => same(r, reuse.proofRef)) || prior.approval.sourceRebind !== undefined ||
      !Array.isArray(prior.registryChanges) || prior.registryChanges.length || !Array.isArray(prior.fingerprintRepairs) || prior.fingerprintRepairs.length ||
      prior.nativeParentBindings !== undefined) fail('original full difficulty-reuse authority required');
  const proof = boundJson(root, reuse.proofRef), earlier = boundJson(root, proof.priorReceipt), earlierInventory = fullInventory(earlier);
  if (proof.schemaVersion !== 'm1s2-exact-finalqa-preservation-proof-v1' || proof.sourceArchiveFile !== prior.sourceArchiveFile ||
      proof.currentSourceBlob !== prior.sourceBlobSha1 || proof.currentSourceSha256 !== prior.sourceRawSha256 ||
      proof.priorSourceBlob !== earlier.sourceBlobSha1 || earlier.sourceArchiveFile !== prior.sourceArchiveFile || earlier.examUid !== prior.examUid ||
      reuse.priorRequestId !== earlier.requestId || proof.priorReceipt.path !== `${PREFIX}${earlier.requestId}.json` ||
      !prior.approval.evidenceRefs.some(r => same(r, proof.priorReceipt)) || !same(earlierInventory, original) ||
      proof.priorApprovalCount !== count || proof.preservedApprovalCount !== count || proof.newSemanticJudgments !== 0 ||
      proof.sourceAndAssetMutation !== false || proof.registryMutation !== false || !Array.isArray(proof.rows) || proof.rows.length !== count)
    fail('full reuse proof differs from its original receipt/source scope');
  const oldBank = historicalBank(root, earlier.sourceBlobSha1, earlier.sourceRawSha256, count);
  const reusedBank = historicalBank(root, prior.sourceBlobSha1, prior.sourceRawSha256, count);
  const difficulty = ['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];
  const operational = new Set([...difficulty, 'metadataRevision', 'approvalEvidence', 'metaFoundationPackVersion']);
  const fixed = row => Object.fromEntries(Object.entries(row).filter(([key]) => !operational.has(key)));
  const student = q => Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(key => [key, Object.hasOwn(q, key) ? q[key] : null]));
  const projected = (row, q) => ({ ...row, sourceQuestionNo: String(q.sourceQuestionNo ?? q.id ?? ''),
    sourceIdentity: `${row.sourceArchiveFile}#${row.sourceOrdinal}`, approvedSourceFingerprint: row.sourceFingerprint,
    legacyLevel: row.level, runtimeSelectable: row.defaultSelectable && row.curriculumApplicability === 'DEFAULT_SCOPE' });
  let changed = 0;
  for (let i = 0; i < count; i++) {
    const row = proof.rows[i], before = earlier.appliedRecords[i], after = prior.appliedRecords[i];
    const beforeD5 = Object.fromEntries(difficulty.map(key => [key, before[key]])), afterD5 = Object.fromEntries(difficulty.map(key => [key, after[key]]));
    const isChanged = !same(beforeD5, afterD5); if (isChanged) changed++;
    if (row.ordinal !== i + 1 || row.questionUid !== original[i].questionUid || row.existingApprovalType !== 'FINAL_QA' ||
        row.sameStudentPayload !== true || row.sameSemanticValues !== true || row.difficultyChanged !== isChanged ||
        !same(row.beforeD5, beforeD5) || !same(row.afterD5, afterD5) ||
        row.priorSourceFingerprint !== before.sourceFingerprint || row.currentSourceFingerprint !== after.sourceFingerprint ||
        !same(fixed(before), fixed(after)) || !same(student(oldBank[i]), student(reusedBank[i])) ||
        !same(earlier.runtimeRecords[i], projected(before, oldBank[i])) || !same(prior.runtimeRecords[i], projected(after, reusedBank[i])) ||
        !same(earlier.appliedIdentityRecords[i], prior.appliedIdentityRecords[i]))
      fail('original full approval/identity/student payload or reviewed difficulty reuse changed');
  }
  if (proof.difficultyChangedCount !== changed || proof.unchangedDifficultyCount !== count - changed)
    fail('original full difficulty counts changed');
  return { count, original, proofRef: reuse.proofRef, earlierReceiptRef: proof.priorReceipt };
}

// The callback is the actual nativeReviewReceipt verifier, with the historical
// full source and its original runtime/identity rows. Every original UID must
// replay, including rows excluded from the new subset; those rows are never
// emitted as approvals for their current changed renderer.
export function replayOriginalFullFinalQa({ root, prior, priorReceiptRef, nativeSource, registry, revalidateLeaf }) {
  validateOriginalFullFinalQaReuse({ root, prior, priorReceiptRef });
  if (typeof revalidateLeaf !== 'function' || !(registry?.problemTypes instanceof Map) || !(registry?.templates instanceof Map) ||
      !(nativeSource.runtimeStatusByPack instanceof Map)) fail('actual full native verifier/registry/runtime inventory required');
  const bank = historicalBank(root, prior.sourceBlobSha1, prior.sourceRawSha256, prior.totalQuestions);
  const raw = execFileSync('git', ['cat-file', 'blob', prior.sourceBlobSha1], { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  const source = { ...nativeSource, bytes: raw, blobSha1: prior.sourceBlobSha1, bank, ...priorSourceIdentityContext(nativeSource, prior) };
  for (let i = 0; i < prior.totalQuestions; i++) {
    const row = prior.appliedRecords[i], q = bank[i], status = nativeSource.runtimeStatusByPack.get(row.metaFoundationPackId);
    const pt = registry.problemTypes.get(row.problemTypeKey), tpl = registry.templates.get(row.templateKey);
    if (status !== 'ACTIVE' || pt?.status !== 'ACTIVE' || tpl?.status !== 'ACTIVE') fail('original full native ACTIVE owner missing');
    if (revalidateLeaf({ nativeSource: { ...source, runtimeRecord: prior.runtimeRecords[i], runtimeStatus: status }, current: row,
      identity: prior.appliedIdentityRecords[i], question: q, previous: q, ordinal: i + 1, pt, tpl, ownerPack: row.metaFoundationPackId }) !== priorReceiptRef.path)
      fail('original full native inventory cannot replay');
  }
  return source;
}

export function validateExplicitSourceSubsetEvidence(args) {
  return isFullSourceSubsetRebind(args.current.approval?.sourceRebind) ? validateFullSourceSubsetEvidence(args) : validateSourceSubsetEvidence(args);
}
