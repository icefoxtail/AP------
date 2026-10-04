#!/usr/bin/env node
/** Compose the blind polynomial L3/L4 sample; no canonical promotion or L4 freeze. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/poly-division-boundary');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const sample = read('H1_POLY_DIVISION_L3_L4_BOUNDARY_SAMPLE_20.jsonl');
const a = read('H1_A_POLY_DIVISION_BOUNDARY_20.jsonl');
const b = read('H1_B_POLY_DIVISION_BOUNDARY_20_KEYTYPE_CORRECTED.jsonl');
const c = read('H1_C_POLY_DIVISION_CONFLICTS4.jsonl');
const cByQueue = new Map(c.map(row => [row.queueIndex, row]));
const sol = JSON.parse(fs.readFileSync(path.join(dir, 'H1_SOL_Q029_PARENT_ADJUDICATION.json'), 'utf8'));
if (sample.length !== 20 || a.length !== 20 || b.length !== 20 || c.length !== 4)
  throw new Error('poly boundary coverage mismatch');
const identity = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint',
  'contentHash', 'solutionHash', 'inputBundleSha', 'sourceFileSha256'];
const out = [];
for (let i = 0; i < sample.length; i++) {
  const x = a[i], y = b[i], source = sample[i];
  for (const key of ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint'])
    if (x[key] !== source[key] || y[key] !== source[key]) throw new Error(`sample identity ${key} mismatch row ${i}`);
  for (const key of identity) if (!x[key] || x[key] !== y[key]) throw new Error(`A/B ${key} mismatch q${x.queueIndex}`);
  for (const [side, row] of [['A', x], ['B', y]]) {
    if (row.reviewStatus !== 'PASS' || !row.parentLabelKo || !row.parentReason
      || !row.sourceMathEvidence || !row.solutionMathEvidence
      || !row.primaryMethod?.reason || !row.decisiveStep?.reason
      || !row.l4Skeleton || !row.l4Reason)
      throw new Error(`${side} item evidence incomplete q${x.queueIndex}`);
    if (row.activeL3EquivalentKey || row.activeL4EquivalentKey)
      throw new Error(`${side} exact ACTIVE key type not validated q${x.queueIndex}`);
  }
  const third = cByQueue.get(x.queueIndex) ?? null;
  const cParent = third?.curriculumDraftL3Parent?.parentLabelKo ?? null;
  let selected = null, provenance = null, agreeingPair = null;
  if (x.parentLabelKo === y.parentLabelKo) {
    selected = x.parentLabelKo;
    provenance = 'DUAL_LUNA_MATCH';
  } else {
    if (!third || !cParent || !third.curriculumDraftL3Parent?.reason || !third.tentativeL4Reason)
      throw new Error(`missing C parent evidence q${x.queueIndex}`);
    for (const key of identity) if (third[key] !== x[key]) throw new Error(`C ${key} mismatch q${x.queueIndex}`);
    if (third.verdict !== 'PASS') throw new Error(`C nonpass q${x.queueIndex}`);
    if (cParent === x.parentLabelKo) { selected = cParent; agreeingPair = ['A', 'C']; }
    else if (cParent === y.parentLabelKo) { selected = cParent; agreeingPair = ['B', 'C']; }
    else if (x.queueIndex === 29 && sol.questionUid === x.questionUid
      && sol.sourceFingerprint === x.sourceFingerprint && sol.solDraftParentLabelKo === cParent) {
      selected = cParent;
      provenance = 'SOL_DIRECT_ADJUDICATION';
    } else throw new Error(`unresolved 3-way parent split q${x.queueIndex}`);
    if (!provenance) provenance = 'LUNA_2_OF_3_CONSENSUS';
  }
  out.push({ schemaVersion: 1, status: 'WORKING_L3_L4_BOUNDARY_NOT_FINAL',
    queueIndex: x.queueIndex, questionUid: x.questionUid, sourceIdentity: x.sourceIdentity,
    sourceFingerprint: x.sourceFingerprint, contentHash: x.contentHash, solutionHash: x.solutionHash,
    oldMergedL3Candidate: 'PT_H1_POLY_DIVISION_REMAINDER', selectedDraftL3ParentLabelKo: selected,
    decisionProvenance: provenance, agreeingPair, aParent: x.parentLabelKo, bParent: y.parentLabelKo, cParent,
    aParentReason: x.parentReason, bParentReason: y.parentReason,
    cParentReason: third?.curriculumDraftL3Parent?.reason ?? null,
    l4SkeletonEvidence: { a: x.l4Skeleton, b: y.l4Skeleton,
      c: third?.tentativeL4Skeleton ?? null },
    evidenceFiles: { a: 'H1_A_POLY_DIVISION_BOUNDARY_20.jsonl',
      b: 'H1_B_POLY_DIVISION_BOUNDARY_20_KEYTYPE_CORRECTED.jsonl',
      c: third ? 'H1_C_POLY_DIVISION_CONFLICTS4.jsonl' : null,
      sol: x.queueIndex === 29 ? 'H1_SOL_Q029_PARENT_ADJUDICATION.json' : null },
    activeL3Promotion: false, activeL4Promotion: false, l4Final: false });
}
if (new Set(out.map(row => row.questionUid)).size !== 20) throw new Error('duplicate sample UID');
const parentCounts = Object.fromEntries([...new Set(out.map(row => row.selectedDraftL3ParentLabelKo))]
  .map(label => [label, out.filter(row => row.selectedDraftL3ParentLabelKo === label).length]));
const summary = { schemaVersion: 1, status: 'WORKING_L3_L4_BOUNDARY_NOT_FINAL',
  familyDenominator: 87, sampleCount: 20, aCoverage: 20, bCoverage: 20,
  cConflictCoverage: 4, dualAgreement: out.filter(row => row.decisionProvenance === 'DUAL_LUNA_MATCH').length,
  twoOfThree: out.filter(row => row.decisionProvenance === 'LUNA_2_OF_3_CONSENSUS').length,
  solDirect: out.filter(row => row.decisionProvenance === 'SOL_DIRECT_ADJUDICATION').length,
  parentCounts, invalidActiveEquivalentKeysAfterCorrection: 0,
  remainingFamilyNotReviewedInThisSample: 67, activeCanonicalPromotion: false, l4Final: false };
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_L3_L4_BOUNDARY_WORKING_20.jsonl'), out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_L3_L4_BOUNDARY_WORKING_20_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
