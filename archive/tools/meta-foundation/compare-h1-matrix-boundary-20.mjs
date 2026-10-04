#!/usr/bin/env node
/** Preserve the blind matrix boundary review and compare only current identities. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const boundaryDir = path.join(dir, 'matrix-boundary');
const read = file => fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const a = read(path.join(boundaryDir, 'H1_A_MATRIX_BOUNDARY_20.jsonl'));
const b = read(path.join(boundaryDir, 'H1_B_MATRIX_BOUNDARY_20.jsonl'));
const source = new Map(read(path.join(dir, 'H1_MATRIX_TAXONOMY_SOL_REVIEW_PACK_83.jsonl')).map(row => [row.queueIndex, row]));
const q1169Repair = JSON.parse(fs.readFileSync(path.join(dir, 'source-evidence/D-q1169-question-only/physical-ledger.json'), 'utf8'));
if (a.length !== 20 || b.length !== 20) throw new Error('expected 20 rows per blind worker');
const ids = ['questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash', 'inputBundleSha', 'sourceFileSha256'];
const rows = a.map((left, i) => {
  const right = b[i];
  if (left.queueIndex !== right.queueIndex || !source.has(left.queueIndex)) throw new Error(`queue mismatch at ${i}`);
  for (const id of ids) if (!left[id] || left[id] !== right[id]) throw new Error(`${id} mismatch q${left.queueIndex}`);
  const prior = source.get(left.queueIndex);
  for (const id of ['questionUid', 'sourceIdentity']) if (left[id] !== prior[id])
    throw new Error(`${id} differs from source pack q${left.queueIndex}`);
  const superseded1169 = left.queueIndex === 1169 && left.sourceFingerprint !== prior.sourceFingerprint;
  if (superseded1169 && (q1169Repair.questionUid !== left.questionUid
    || q1169Repair.sourceIdentity !== left.sourceIdentity
    || q1169Repair.disposition !== 'PARTIAL_REPAIR_CHOICE_AND_TARGET_CONFIRMED_MATRIX_CONTENT_HELD'))
    throw new Error('q1169 historical source evidence mismatch');
  if (!superseded1169 && left.sourceFingerprint !== prior.sourceFingerprint)
    throw new Error(`source fingerprint differs from source pack q${left.queueIndex}`);
  const aHold = left.status === 'HOLD';
  const bHold = right.status === 'HOLD';
  if (!['PASS', 'HOLD'].includes(left.status) || !['PASS', 'HOLD'].includes(right.status)) throw new Error(`bad status q${left.queueIndex}`);
  return {
    schemaVersion: 1,
    status: 'BLIND_AB_COMPARISON_NOT_FINAL',
    queueIndex: left.queueIndex,
    questionUid: left.questionUid,
    sourceIdentity: left.sourceIdentity,
    sourceFingerprint: left.sourceFingerprint,
    sourceSnapshot: superseded1169 ? 'PRE_D_QUESTION_ONLY_REPAIR' : 'CURRENT_AT_COMPARISON',
    contentHash: left.contentHash,
    solutionHash: left.solutionHash,
    aStatus: left.status,
    bStatus: right.status,
    aParent: left.draftParentLabelKo ?? null,
    bParent: right.draftParentLabelKo ?? null,
    parentAgreement: !aHold && !bHold && left.draftParentLabelKo === right.draftParentLabelKo,
    aL4: left.draftL4LabelKo ?? null,
    bL4: right.draftL4LabelKo ?? null,
    l4LabelAgreement: !aHold && !bHold && left.draftL4LabelKo === right.draftL4LabelKo,
    aDecisiveStep: left.decisiveStep ?? null,
    bDecisiveStep: right.decisiveStep ?? null,
    aL4Reason: left.draftL4Reason ?? null,
    bL4Reason: right.draftL4Reason ?? null,
    aSourceIssue: left.sourceIssue ?? null,
    bSourceIssue: right['sourceIssue/HOLD'] ?? null,
    aHoldReason: left.holdReason ?? null,
    bHoldReason: right['sourceIssue/HOLD'] ?? null,
    sourceFrozenL3: prior.frozenL3,
    sourceBIndependentL3: prior.bIndependentL3,
    sourceCReview: prior.cL3Review ?? null,
    evidenceFiles: {
      a: 'matrix-boundary/H1_A_MATRIX_BOUNDARY_20.jsonl',
      b: 'matrix-boundary/H1_B_MATRIX_BOUNDARY_20.jsonl',
      source: 'H1_MATRIX_TAXONOMY_SOL_REVIEW_PACK_83.jsonl'
    }
  };
});
if (new Set(rows.map(row => row.questionUid)).size !== 20) throw new Error('duplicate UID');
const summary = {
  schemaVersion: 1,
  status: 'BLIND_AB_COMPARISON_NOT_FINAL',
  denominator: 20,
  aCoverage: a.length,
  bCoverage: b.length,
  aPass: a.filter(row => row.status === 'PASS').length,
  bPass: b.filter(row => row.status === 'PASS').length,
  jointHold: rows.filter(row => row.aStatus === 'HOLD' && row.bStatus === 'HOLD').map(row => row.queueIndex),
  passParentAgreement: rows.filter(row => row.parentAgreement).length,
  passParentConflict: rows.filter(row => row.aStatus === 'PASS' && row.bStatus === 'PASS' && !row.parentAgreement).map(row => row.queueIndex),
  passExactL4LabelAgreement: rows.filter(row => row.l4LabelAgreement).length,
  passL4LabelDifference: rows.filter(row => row.aStatus === 'PASS' && row.bStatus === 'PASS' && !row.l4LabelAgreement).map(row => row.queueIndex),
  supersededByPostDReReview: [1169],
  taxonomyPromotions: 0
};
fs.writeFileSync(path.join(boundaryDir, 'H1_MATRIX_BOUNDARY_AB_COMPARISON_20.jsonl'), rows.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(boundaryDir, 'H1_MATRIX_BOUNDARY_AB_COMPARISON_20_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
