#!/usr/bin/env node
/** Compare two sealed blind parent reviews; screening is never semantic truth. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/l3-boundary');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const screen = read('H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN.jsonl');
const files = {
  A: ['H1_A_INEQUALITY_PARENT_BATCH1_20.jsonl', 'H1_A_INEQUALITY_PARENT_BATCH2_19.jsonl'],
  B: ['H1_B_INEQUALITY_PARENT_BATCH1_20.jsonl', 'H1_B_INEQUALITY_PARENT_BATCH2_19.jsonl']
};
const a = files.A.flatMap(read);
const b = files.B.flatMap(read);
if (screen.length !== 39 || a.length !== 39 || b.length !== 39) throw new Error('39-item coverage mismatch');
const identifiers = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint'];
const hashes = ['contentHash', 'solutionHash', 'inputBundleSha', 'sourceFileSha256'];
const status = row => row.reviewStatus ?? row.status ?? null;
const reason = row => row.parentReason ?? row.draftParentReason ?? null;
const l4 = row => row.l4?.skeleton ?? row.l4Skeleton ?? row.draftL4Skeleton ?? null;
const l4Reason = row => row.l4?.reason ?? row.l4Reason ?? row.draftL4Reason ?? null;
const counts = { A: {}, B: {} };
const out = [];
for (let i = 0; i < 39; i++) {
  const x = a[i], y = b[i], source = screen[i];
  for (const key of identifiers) if (x[key] !== y[key] || x[key] !== source[key])
    throw new Error(`identity ${key} mismatch row ${i}`);
  for (const key of hashes) if (!x[key] || x[key] !== y[key]) throw new Error(`hash ${key} mismatch q${x.queueIndex}`);
  for (const [side, row] of [['A', x], ['B', y]]) {
    const parent = row.parentLabelKo ?? row.draftParentLabelKo;
    if (!parent || !reason(row) || !row.sourceMathEvidence || !row.solutionMathEvidence
      || !row.primaryMethod?.reason || !row.decisiveStep?.reason || !l4(row) || !l4Reason(row)
      || !['PASS', 'HOLD'].includes(status(row))) throw new Error(`${side} item evidence incomplete q${row.queueIndex}`);
    if (status(row) === 'HOLD' && !row.holdReason) throw new Error(`${side} HOLD reason missing q${row.queueIndex}`);
    counts[side][parent] = (counts[side][parent] ?? 0) + 1;
  }
  const aParent = x.parentLabelKo ?? x.draftParentLabelKo;
  const bParent = y.parentLabelKo ?? y.draftParentLabelKo;
  out.push({ schemaVersion: 1, status: 'BLIND_AB_PARENT_COMPARISON_NOT_FINAL',
    queueIndex: x.queueIndex, questionUid: x.questionUid, sourceIdentity: x.sourceIdentity,
    sourceFingerprint: x.sourceFingerprint, contentHash: x.contentHash, solutionHash: x.solutionHash,
    aParent, bParent, parentAgreement: aParent === bParent,
    aStatus: status(x), bStatus: status(y), statusAgreement: status(x) === status(y),
    aParentReason: reason(x), bParentReason: reason(y),
    aDecisiveStep: x.decisiveStep, bDecisiveStep: y.decisiveStep,
    aL4Skeleton: l4(x), bL4Skeleton: l4(y),
    aL4Reason: l4Reason(x), bL4Reason: l4Reason(y),
    evidenceFiles: { a: files.A[i < 20 ? 0 : 1], b: files.B[i < 20 ? 0 : 1] } });
}
if (new Set(out.map(row => row.questionUid)).size !== 39) throw new Error('duplicate UID');
const summary = { schemaVersion: 1, status: 'BLIND_AB_PARENT_COMPARISON_NOT_FINAL',
  denominator: 39, aCoverage: a.length, bCoverage: b.length,
  parentAgreement: out.filter(row => row.parentAgreement).length,
  parentConflicts: out.filter(row => !row.parentAgreement).map(row => row.queueIndex),
  statusConflicts: out.filter(row => !row.statusAgreement).map(row => row.queueIndex),
  aParentCounts: counts.A, bParentCounts: counts.B,
  oldAssignmentVisibleToWorkers: false, taxonomyPromotion: false,
  screenOnly: 'H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN.jsonl',
  queueIndexRemap: 'H1_SYSTEM_INEQUALITY_BOUNDARY_QUEUE_PARITY_39.jsonl',
  q762HistoricalFirstPass: true,
  currentParentSupersession: 'H1_SYSTEM_INEQUALITY_PARENT_WORKING_39.jsonl' };
fs.writeFileSync(path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_AB_COMPARISON_39.jsonl'), out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_SYSTEM_INEQUALITY_BOUNDARY_AB_COMPARISON_39_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
