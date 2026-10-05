#!/usr/bin/env node
/** Replace only q114 in the historical 20-item polynomial boundary with current blind evidence. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'poly-division-boundary');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const one = name => { const rows = read(name); if (rows.length !== 1) throw new Error(`expected one ${name}`); return rows[0]; };
const base = read('H1_POLY_DIVISION_L3_L4_BOUNDARY_WORKING_20.jsonl');
const files = { a2: 'H1_A2_Q114_STAGEA_POST_D_RAW.jsonl', b: 'H1_B_Q114_STAGEA_POST_D_RAW.jsonl',
  c2: 'H1_C2_Q114_POST_D_RAW.jsonl' };
const a = one(files.a2), b = one(files.b), c = one(files.c2);
const d = JSON.parse(fs.readFileSync(path.join(checkpoint, 'source-evidence/D-q114-question-only/physical-ledger.json'), 'utf8'));
if (base.length !== 20 || base.filter(row => row.queueIndex === 114).length !== 1)
  throw new Error('sample20 q114 denominator mismatch');
for (const field of ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint',
  'contentHash', 'solutionHash', 'inputBundleSha', 'sourceFileSha256'])
  if (!a[field] || a[field] !== b[field] || a[field] !== c[field])
    throw new Error(`q114 A2/B/C ${field} mismatch`);
if (a.queueIndex !== 114 || d.questionUid !== a.questionUid || d.sourceIdentity !== a.sourceIdentity
  || d.queue.sourceFingerprintAfter !== a.sourceFingerprint
  || a.reviewStatus !== 'HOLD' || b.reviewStatus !== 'HOLD' || c.reviewStatus !== 'HOLD'
  || a.L3?.boundedCandidate !== '다항식의 나눗셈' || c.L3?.parentLabelKo !== '다항식의 나눗셈')
  throw new Error('q114 current source/status/parent gate mismatch');
const out = base.map(row => row.queueIndex !== 114 ? row : {
  ...row, sourceFingerprint: a.sourceFingerprint, contentHash: a.contentHash, solutionHash: a.solutionHash,
  selectedDraftL3ParentLabelKo: '다항식의 나눗셈',
  decisionProvenance: 'LUNA_2_OF_3_CONSENSUS', agreeingPair: ['A2', 'C2'],
  aParent: a.L3.boundedCandidate, bParent: b.l3?.labelKo ?? null, cParent: c.L3.parentLabelKo,
  aParentReason: a.L3.reason, bParentReason: b.l3?.reason ?? null, cParentReason: c.L3.reason,
  l4SkeletonEvidence: { a2: a.L4?.skeleton, b: b.l4?.skeleton, c2: c.L4Skeleton },
  workingReviewStatus: 'HOLD', reviewStatusProvenance: 'DUAL_LUNA_MATCH',
  evidenceFiles: { a2: files.a2, b: files.b, c2: files.c2,
    d: 'source-evidence/D-q114-question-only/physical-ledger.json',
    sol: 'H1_SOL_Q114_HWP_EQUATION_CHOICES_HOLD.json' },
  q114SourceRestoration: 'source-evidence/D-q114-question-only/physical-ledger.json',
  activeL3Promotion: false, activeL4Promotion: false, l4Final: false,
});
if (new Set(out.map(row => row.questionUid)).size !== 20) throw new Error('sample20 UID duplicate');
const parentCounts = Object.fromEntries([...new Set(out.map(row => row.selectedDraftL3ParentLabelKo))]
  .map(label => [label, out.filter(row => row.selectedDraftL3ParentLabelKo === label).length]));
const summary = { schemaVersion: 1, status: 'WORKING_L3_L4_BOUNDARY_NOT_FINAL',
  familyDenominator: 87, sampleCount: 20, currentA2Coverage: 20, currentBCoverage: 20,
  q114PostDSourceSupersession: true,
  dualParentAgreement: out.filter(row => (row.decisionProvenance ?? row.parentProvenance) === 'DUAL_LUNA_MATCH').length,
  twoOfThreeParent: out.filter(row => (row.decisionProvenance ?? row.parentProvenance) === 'LUNA_2_OF_3_CONSENSUS').length,
  solDirectParent: out.filter(row => (row.decisionProvenance ?? row.parentProvenance) === 'SOL_DIRECT_ADJUDICATION').length,
  parentCounts, workingHoldQueueIndexes: out.filter(row => row.workingReviewStatus === 'HOLD').map(row => row.queueIndex),
  activeCanonicalPromotion: false, l4Final: false };
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_BOUNDARY_WORKING_20_CURRENT.jsonl'),
  out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_BOUNDARY_WORKING_20_CURRENT_SUMMARY.json'),
  JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
