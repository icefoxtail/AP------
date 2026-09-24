#!/usr/bin/env node
/** Compose blind A2/B/C parent evidence for the remaining family; no L4 freeze. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checkpoint = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'poly-division-boundary');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const one = name => { const rows = read(name); if (rows.length !== 1) throw new Error(`expected one row ${name}`); return rows[0]; };
const manifest = read('H1_POLY_DIVISION_REMAINING_67.jsonl');
const a = [1, 2, 3, 4].flatMap(n => read(`H1_A2_POLY_REMAINING_BATCH${n}_${n === 4 ? 7 : 20}.jsonl`));
const b = [1, 2, 3, 4].flatMap(n => read(`H1_B_POLY_REMAINING_BATCH${n}_${n === 4 ? 7 : 20}.jsonl`));
const c = [...read('H1_C_POLY_REMAINING_BATCH2_CONFLICTS5.jsonl'),
  ...read('H1_C2_POLY_OTHER_PARENT_CONFLICTS5.jsonl'), one('H1_C2_Q026_POST_D.jsonl')];
const cByUid = new Map(c.map(row => [row.questionUid, row]));
const postD = { A: one('H1_A2_Q026_POST_D.jsonl'), B: one('H1_B_Q026_POST_D.jsonl') };
const q26D = JSON.parse(fs.readFileSync(path.join(checkpoint, 'source-evidence/D-q26-question-only/physical-ledger.json'), 'utf8'));
const q72Sol = JSON.parse(fs.readFileSync(path.join(dir, 'H1_SOL_Q072_NO_NEW_L3_DIRECT_REMAINDER_READ.json'), 'utf8'));
if (manifest.length !== 67 || a.length !== 67 || b.length !== 67 || c.length !== 11 || cByUid.size !== 11)
  throw new Error('remaining family reviewer coverage mismatch');
if (q26D.queue?.queueIndex !== 26 || q26D.queue?.questionUid !== postD.A.questionUid
  || q26D.queue?.sourceIdentity !== postD.A.sourceIdentity)
  throw new Error('q26 D ledger identity mismatch');
const parent = row => row.curriculumDraftL3?.parentLabelKo ?? row.curriculumL3?.parentLabelKo
  ?? row.curriculumDraftL3Parent?.parentLabelKo ?? row.l3?.draftParentLabelKo
  ?? row.parentLabelKo ?? null;
const parentReason = row => row.curriculumDraftL3?.reason ?? row.curriculumL3?.reason
  ?? row.curriculumDraftL3Parent?.reason ?? row.l3?.draftParentReason
  ?? row.parentReason ?? null;
const status = row => row.reviewStatus ?? row.status ?? row.verdict ?? null;
const l4 = row => row.repeatableL4?.skeleton ?? row.l4?.skeleton ?? row.tentativeL4Skeleton ?? row.l4Skeleton ?? null;
const l4Reason = row => row.repeatableL4?.reason ?? row.l4?.reason ?? row.tentativeL4Reason ?? row.l4Reason ?? null;
const idKeys = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint',
  'contentHash', 'solutionHash', 'inputBundleSha', 'sourceFileSha256'];
const out = [];
for (let i = 0; i < 67; i++) {
  const old = manifest[i], x = old.queueIndex === 26 ? postD.A : a[i], y = old.queueIndex === 26 ? postD.B : b[i];
  if (x.queueIndex !== old.queueIndex || y.queueIndex !== old.queueIndex
    || x.questionUid !== old.questionUid || y.questionUid !== old.questionUid
    || x.sourceIdentity !== old.sourceIdentity || y.sourceIdentity !== old.sourceIdentity)
    throw new Error(`sample identity mismatch row ${i}`);
  for (const key of idKeys) if (!x[key] || x[key] !== y[key]) throw new Error(`A2/B ${key} mismatch q${old.queueIndex}`);
  if (old.queueIndex !== 26 && old.sourceFingerprint !== x.sourceFingerprint)
    throw new Error(`unexpected source fingerprint drift q${old.queueIndex}`);
  if (old.queueIndex === 26 && old.sourceFingerprint === x.sourceFingerprint)
    throw new Error('q26 source restoration not reflected in current verdicts');
  for (const [side, row] of [['A2', x], ['B', y]]) {
    if (!['PASS', 'HOLD'].includes(status(row)) || !parent(row) || !parentReason(row)
      || !(row.sourceEvidence ?? row.sourceMathEvidence) || !(row.solutionEvidence ?? row.solutionMathEvidence)
      || (!l4(row) && row.l4Status !== 'NO_SEPARATE_SKELETON') || !l4Reason(row))
      throw new Error(`${side} evidence incomplete q${old.queueIndex}`);
    if (status(row) === 'HOLD' && !row.holdReason) throw new Error(`${side} HOLD reason missing q${old.queueIndex}`);
    if (row.activeL3EquivalentKey || row.activeProblemTypeEquivalent || row.activeL4EquivalentKey || row.activeTemplateEquivalent)
      throw new Error(`${side} unverified active key type q${old.queueIndex}`);
  }
  const z = cByUid.get(x.questionUid) ?? null;
  if (z) {
    for (const key of idKeys) if (z[key] !== x[key]) throw new Error(`C ${key} mismatch q${old.queueIndex}`);
    if (!parent(z) || !parentReason(z) || !l4(z) || !l4Reason(z)) throw new Error(`C evidence incomplete q${old.queueIndex}`);
  }
  let selected = null, provenance = null, agreeingPair = null;
  if (parent(x) === parent(y)) { selected = parent(x); provenance = 'DUAL_LUNA_MATCH'; }
  else {
    if (!z) throw new Error(`missing blind C parent review q${old.queueIndex}`);
    if (parent(z) === parent(x)) { selected = parent(x); agreeingPair = ['A2', 'C']; }
    else if (parent(z) === parent(y)) { selected = parent(y); agreeingPair = ['B', 'C']; }
    else if (old.queueIndex === 72 && q72Sol.questionUid === x.questionUid
      && q72Sol.solDraftParentLabelKo === parent(x)) {
      selected = parent(x); provenance = 'SOL_DIRECT_ADJUDICATION';
    } else throw new Error(`unresolved 3-way parent split q${old.queueIndex}`);
    if (!provenance) provenance = 'LUNA_2_OF_3_CONSENSUS';
  }
  let workingStatus = status(x) === 'HOLD' && status(y) === 'HOLD' ? 'HOLD' : 'PASS';
  let statusProvenance = status(x) === status(y) ? 'DUAL_LUNA_MATCH' : null;
  if (!statusProvenance) {
    if (!z || !['PASS', 'HOLD'].includes(status(z))) throw new Error(`missing C status conflict q${old.queueIndex}`);
    if (status(z) === status(x)) { workingStatus = status(x); statusProvenance = 'LUNA_2_OF_3_CONSENSUS'; }
    else if (status(z) === status(y)) { workingStatus = status(y); statusProvenance = 'LUNA_2_OF_3_CONSENSUS'; }
    else throw new Error(`unresolved 3-way status q${old.queueIndex}`);
  }
  if (old.queueIndex === 98) { workingStatus = 'HOLD'; statusProvenance = 'SOL_DIRECT_ADJUDICATION'; }
  out.push({ schemaVersion: 1, status: 'WORKING_L3_L4_BOUNDARY_NOT_FINAL',
    queueIndex: old.queueIndex, questionUid: x.questionUid, sourceIdentity: x.sourceIdentity,
    sourceFingerprint: x.sourceFingerprint, contentHash: x.contentHash, solutionHash: x.solutionHash,
    oldMergedL3Candidate: 'PT_H1_POLY_DIVISION_REMAINDER', selectedDraftL3ParentLabelKo: selected,
    parentProvenance: provenance, parentAgreeingPair: agreeingPair,
    a2Parent: parent(x), bParent: parent(y), cParent: z ? parent(z) : null,
    a2ParentReason: parentReason(x), bParentReason: parentReason(y), cParentReason: z ? parentReason(z) : null,
    workingReviewStatus: workingStatus, reviewStatusProvenance: statusProvenance,
    l4SkeletonEvidence: { a2: l4(x), b: l4(y), c: z ? l4(z) : null },
    evidenceFiles: { a2: old.queueIndex === 26 ? 'H1_A2_Q026_POST_D.jsonl'
      : `H1_A2_POLY_REMAINING_BATCH${i < 20 ? '1_20' : i < 40 ? '2_20' : i < 60 ? '3_20' : '4_7'}.jsonl`,
      b: old.queueIndex === 26 ? 'H1_B_Q026_POST_D.jsonl'
        : `H1_B_POLY_REMAINING_BATCH${i < 20 ? '1_20' : i < 40 ? '2_20' : i < 60 ? '3_20' : '4_7'}.jsonl`,
      c: z ? (old.queueIndex === 26 ? 'H1_C2_Q026_POST_D.jsonl'
        : [98, 102, 123, 136, 158].includes(old.queueIndex) ? 'H1_C_POLY_REMAINING_BATCH2_CONFLICTS5.jsonl'
          : 'H1_C2_POLY_OTHER_PARENT_CONFLICTS5.jsonl') : null,
      sol: old.queueIndex === 72 ? 'H1_SOL_Q072_NO_NEW_L3_DIRECT_REMAINDER_READ.json' : null },
    q26SourceRestoration: old.queueIndex === 26 ? 'source-evidence/D-q26-question-only/physical-ledger.json' : null,
    activeCanonicalPromotion: false, l4Final: false });
}
if (new Set(out.map(row => row.questionUid)).size !== 67) throw new Error('duplicate remaining UID');
const counts = Object.fromEntries([...new Set(out.map(row => row.selectedDraftL3ParentLabelKo))]
  .map(label => [label, out.filter(row => row.selectedDraftL3ParentLabelKo === label).length]));
const summary = { schemaVersion: 1, status: 'WORKING_L3_L4_BOUNDARY_NOT_FINAL',
  familyDenominator: 87, priorSample: 20, denominator: 67, a2Coverage: 67, bCoverage: 67,
  currentCConflictCoverage: c.length, dualParentAgreement: out.filter(row => row.parentProvenance === 'DUAL_LUNA_MATCH').length,
  twoOfThreeParent: out.filter(row => row.parentProvenance === 'LUNA_2_OF_3_CONSENSUS').length,
  solDirectParent: out.filter(row => row.parentProvenance === 'SOL_DIRECT_ADJUDICATION').length,
  parentCounts: counts, workingHoldQueueIndexes: out.filter(row => row.workingReviewStatus === 'HOLD').map(row => row.queueIndex),
  q26PostDSourceSupersession: true, rejectedWorkerOutputsUsed: 0, activeCanonicalPromotion: false, l4Final: false };
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_REMAINING_WORKING_67.jsonl'), out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_REMAINING_WORKING_67_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
