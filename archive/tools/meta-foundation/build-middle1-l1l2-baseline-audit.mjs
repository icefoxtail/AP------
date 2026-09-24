import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation/M1_EXAM_INVENTORY_31.json'), 'utf8'));
const batchNo = Number(process.argv[2]);
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo || batchNo < 10) throw new Error('Usage: build-middle1-l1l2-baseline-audit.mjs <10..31>');
const dir = path.join(root, exam.artifactPath);
const readJsonl = name => fs.readFileSync(path.join(dir, name), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const source = readJsonl('INPUT_BUNDLE.jsonl'), a = readJsonl('LUNA_A.jsonl'), b = readJsonl('LUNA_B.jsonl');
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'L1_L2_CONFLICT_PLAN.json'), 'utf8'));
if (source.length !== exam.questionRowCount || a.length !== source.length || b.length !== source.length || plan.batchNo !== batchNo) throw new Error('L1/L2 baseline denominator mismatch');
const decisions = new Map((plan.candidateDecisions || []).map(x => [x.sourceOrdinal, x]));
if (decisions.size !== (plan.candidateDecisions || []).length) throw new Error('Duplicate L1/L2 candidate decision');
const rows = source.map((s, i) => {
  const aa = a[i], bb = b[i];
  for (const worker of [aa, bb]) if (worker.questionUid !== s.questionUid || worker.inputBundleSha !== s.inputBundleSha || worker.sourceFingerprint !== s.sourceFingerprint) throw new Error(`L1/L2 worker source mismatch #${s.sourceOrdinal}`);
  const aDeviation = aa.standardUnitKey !== s.currentL1 || aa.subUnitKey !== s.currentL2;
  const bDeviation = bb.standardUnitKey !== s.currentL1 || bb.subUnitKey !== s.currentL2;
  const candidate = aDeviation || bDeviation;
  const decision = decisions.get(s.sourceOrdinal);
  if (candidate !== Boolean(decision)) throw new Error(`L1/L2 candidate plan coverage mismatch #${s.sourceOrdinal}`);
  if (decision && (!['BASELINE_RETAINED', 'L1_L2_CONFLICT_CONFIRMED'].includes(decision.disposition) || !String(decision.evidence || '').trim())) throw new Error(`Missing L1/L2 evidence #${s.sourceOrdinal}`);
  const acceptedL1 = decision?.acceptedL1 || s.currentL1;
  const acceptedL2 = decision?.acceptedL2 || s.currentL2;
  const conflictConfirmed = decision?.disposition === 'L1_L2_CONFLICT_CONFIRMED';
  if (conflictConfirmed === (acceptedL1 === s.currentL1 && acceptedL2 === s.currentL2)) throw new Error(`L1/L2 disposition/accepted key mismatch #${s.sourceOrdinal}`);
  if (decision?.disposition === 'BASELINE_RETAINED' && (acceptedL1 !== s.currentL1 || acceptedL2 !== s.currentL2)) throw new Error(`Baseline retained but keys changed #${s.sourceOrdinal}`);
  return {
    questionUid: s.questionUid, sourceArchiveFile: s.sourceArchiveFile, sourceOrdinal: s.sourceOrdinal, sourceFingerprint: s.sourceFingerprint,
    sourceIdentityFingerprint: s.sourceIdentityFingerprint, inputBundleSha: s.inputBundleSha,
    baselineL1: s.currentL1, baselineL2: s.currentL2,
    aL1: aa.standardUnitKey, aL2: aa.subUnitKey, bL1: bb.standardUnitKey, bL2: bb.subUnitKey,
    aDeviation, bDeviation, baselineUsed: !conflictConfirmed, l1L2Conflict: conflictConfirmed,
    acceptedL1, acceptedL2, evidence: decision?.evidence || 'Existing L1/L2 retained as upstream baseline; no source-grounded conflict opened.'
  };
});
const bytes = Buffer.from(rows.map(JSON.stringify).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'L1_L2_BASELINE_AUDIT.jsonl'), bytes);
const summary = {
  schemaVersion: 'm1-l1l2-baseline-audit-v1', batchNo, sourceArchiveFile: exam.sourceArchiveFile,
  denominator: rows.length, baselineUsedUidCount: rows.filter(x => x.baselineUsed).length,
  l1L2ConflictCount: rows.filter(x => x.l1L2Conflict).length,
  workerDeviationUidCount: rows.filter(x => x.aDeviation || x.bDeviation).length,
  acceptedL1ChangeCount: rows.filter(x => x.acceptedL1 !== x.baselineL1).length,
  acceptedL2ChangeCount: rows.filter(x => x.acceptedL2 !== x.baselineL2).length,
  auditSha256: crypto.createHash('sha256').update(bytes).digest('hex')
};
fs.writeFileSync(path.join(dir, 'L1_L2_BASELINE_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
