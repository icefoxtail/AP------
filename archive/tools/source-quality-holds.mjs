// A source quality hold only marks ONE question (sourceIssueHold / sourceQualityHold on its catalog row).
// It never pins bytes. The 2026-11-24 owner decision removed the "file changed -> fail" behavior:
// exam JS, figures, receipts, evidence, identity fingerprints and catalog coverage are not checked here,
// so correcting a held exam can never fail a lane, builder, CI job or hook because of a hold.
// The ledger, resolution and receipt files stay in the repository as history and are read leniently.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import originalSourceError from '../../tools/4slot/original-source-error-hold.cjs';

export const SOURCE_QUALITY_HOLD_SCHEMA = 'archive-source-quality-holds-v1';
export const SOURCE_QUALITY_HOLD_LEDGER = 'archive/data/meta-foundation/source-quality-holds-v1.json';
export const SOURCE_QUALITY_HOLD_RESOLUTIONS = 'archive/data/meta-foundation/source-quality-hold-resolutions-v1.json';
export const SOURCE_QUALITY_HOLD_RESOLUTION_SCHEMA = 'archive-source-quality-hold-resolutions-v1';
export const SOURCE_QUALITY_HOLD_FIELDS = Object.freeze(['sourceIssueHold', 'sourceQualityHold']);
const UID = /^qid_v1_[a-f0-9]{64}$/;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

// Missing or malformed files mean "no hold from this file"; they never fail a build.
function readJson(root, relative) {
  try {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file);
    return { raw, doc: JSON.parse(raw.toString('utf8')) };
  } catch { return null; }
}
const rows = loaded => (Array.isArray(loaded?.doc?.records) ? loaded.doc.records : [])
  .filter(row => row && typeof row === 'object' && typeof row.holdId === 'string' && UID.test(row.questionUid));
// A hold with an owner-decision resolution record is an ordinary row (kept so already-resolved holds stay unmarked).
const resolvedHoldIds = loaded => new Set((Array.isArray(loaded?.doc?.records) ? loaded.doc.records : [])
  .map(row => row?.holdId).filter(id => typeof id === 'string'));

// Digest-only dependency paths: only the hold's own ledger files. Exam JS, figures, receipts and
// evidence are no longer inputs of a hold.
export function sourceQualityHoldDependencyPaths(root) {
  const own = [SOURCE_QUALITY_HOLD_LEDGER, SOURCE_QUALITY_HOLD_RESOLUTIONS].filter(p => fs.existsSync(path.join(root, p)));
  return [...new Set([...own, 'archive/tools/source-quality-holds.mjs', ...originalSourceError.dependencyPaths(root)])].sort();
}

export function loadSourceQualityHolds({ root }) {
  const ledger = readJson(root, SOURCE_QUALITY_HOLD_LEDGER), resolutions = readJson(root, SOURCE_QUALITY_HOLD_RESOLUTIONS);
  const holds = new Map(), observed = new Set(), proofPaths = new Set(), resolved = resolvedHoldIds(resolutions);
  const ledgerSha256 = ledger ? sha(ledger.raw) : null;
  if (ledger) proofPaths.add(SOURCE_QUALITY_HOLD_LEDGER);
  if (resolutions) proofPaths.add(SOURCE_QUALITY_HOLD_RESOLUTIONS);
  for (const row of rows(ledger)) {
    if (resolved.has(row.holdId)) continue;
    holds.set(row.questionUid, Object.freeze({ sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal,
      projection: Object.freeze({ schemaVersion: 'archive-source-quality-hold-projection-v1',
        holdId: row.holdId, status: row.status, reasonCode: row.reasonCode, ledgerPath: SOURCE_QUALITY_HOLD_LEDGER,
        ledgerSha256, sourceBlobSha1: row.sourceBlobSha1, originalReceiptSha256: row.originalReceipt?.sha256,
        releasePolicy: row.releasePolicy }) }));
  }
  if (originalSourceError.relevant(root)) {
    const held = originalSourceError.verify(root);
    if (!holds.has(held.questionUid)) holds.set(held.questionUid, Object.freeze(held));
    for (const [p] of held.observed) proofPaths.add(p);
  }
  return { holds, observed, ledgerSha256,
    manifestPaths: [...proofPaths].map(p => path.posix.relative('archive', p)).sort() };
}

// Marks the one held question by UID. No source, fingerprint or identity binding is required.
export function applySourceQualityHold(record, state) {
  const hold = state.holds.get(record.questionUid);
  if (!hold) return record;
  record.sourceIssueHold = true;
  record.sourceQualityHold = hold.projection;
  state.observed.add(record.questionUid);
  return record;
}
