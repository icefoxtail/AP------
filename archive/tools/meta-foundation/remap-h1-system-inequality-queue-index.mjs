#!/usr/bin/env node
/** Bind the frozen UID/source screen to the authoritative current queue indexes. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'l3-boundary');
const read = file => fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const screen = read(path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN.jsonl'));
const current = JSON.parse(fs.readFileSync(path.join(checkpoint, 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8')).rows;
const currentByUid = new Map(current.map(row => [row.questionUid, row]));
const q762Repair = JSON.parse(fs.readFileSync(path.join(checkpoint,
  'source-evidence/D-q762-question-only/physical-ledger.json'), 'utf8'));
if (screen.length !== 39 || currentByUid.size !== 1120) throw new Error('queue coverage drift');
const out = screen.map(row => {
  const match = currentByUid.get(row.questionUid);
  if (!match || match.sourceIdentity !== row.sourceIdentity)
    throw new Error(`UID/source identity remap mismatch legacy q${row.queueIndex}`);
  const sourceChanged = match.currentSourceFingerprint !== row.sourceFingerprint;
  if (sourceChanged && !(row.queueIndex === 762 && q762Repair.questionUid === row.questionUid
    && q762Repair.disposition.includes('HEADING_ONLY_CORRECTION')))
    throw new Error(`unexplained source fingerprint drift legacy q${row.queueIndex}`);
  return { schemaVersion: 1, questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
    workerBundleSourceFingerprint: row.sourceFingerprint,
    currentSourceFingerprint: match.currentSourceFingerprint, sourceChanged,
    workerBundleQueueIndex: row.queueIndex,
    currentQueueIndex: match.queueIndex, changed: row.queueIndex !== match.queueIndex };
});
if (new Set(out.map(row => row.currentQueueIndex)).size !== 39) throw new Error('duplicate current queue index');
const changed = out.filter(row => row.changed);
if (changed.length !== 1 || changed[0].workerBundleQueueIndex !== 290 || changed[0].currentQueueIndex !== 307)
  throw new Error(`unexpected index drift ${JSON.stringify(changed)}`);
const summary = { schemaVersion: 1, status: 'UID_BOUND_QUEUE_PARITY_REPAIR_NOT_SEMANTIC_REVIEW',
  denominator: 39, stableQueueIndexes: 38, mismatchedQueueIndexes: changed.length,
  sourceFingerprintChanges: out.filter(row => row.sourceChanged).map(row => ({
    workerBundleQueueIndex: row.workerBundleQueueIndex, currentQueueIndex: row.currentQueueIndex,
    reason: 'q762 original-question heading repair with current A/B/C supersession' })),
  mismatches: changed.map(row => ({ workerBundleQueueIndex: row.workerBundleQueueIndex,
    currentQueueIndex: row.currentQueueIndex, questionUid: row.questionUid })),
  decision: 'Keep A/B/C raw verdicts immutable; join to the current queue by questionUid, sourceIdentity, and sourceFingerprint.' };
const currentScreen = screen.map((row, i) => ({ ...row,
  queueIndex: out[i].currentQueueIndex, sourceFingerprint: out[i].currentSourceFingerprint,
  historicalWorkerBundleQueueIndex: out[i].workerBundleQueueIndex }));
fs.writeFileSync(path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_QUEUE_PARITY_39.jsonl'), out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_QUEUE_PARITY_39_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
fs.writeFileSync(path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN_CURRENT_QUEUE_39.jsonl'),
  currentScreen.map(row => JSON.stringify(row)).join('\n') + '\n');
console.log(JSON.stringify(summary, null, 2));
