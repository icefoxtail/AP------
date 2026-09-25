#!/usr/bin/env node
/** Compose the isolated L3 boundary result without promoting taxonomy keys. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'l3-boundary');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const single = name => {
  const rows = read(name);
  if (rows.length !== 1) throw new Error(`expected one row in ${name}`);
  return rows[0];
};
const screen = read('H1_SYSTEM_INEQUALITY_BOUNDARY_SCREEN.jsonl');
const queueParity = read('H1_SYSTEM_INEQUALITY_BOUNDARY_QUEUE_PARITY_39.jsonl');
const parityByWorkerQueue = new Map(queueParity.map(row => [row.workerBundleQueueIndex, row]));
const aRaw = [...read('H1_A_INEQUALITY_PARENT_BATCH1_20.jsonl'), ...read('H1_A_INEQUALITY_PARENT_BATCH2_19.jsonl')];
const bRaw = [...read('H1_B_INEQUALITY_PARENT_BATCH1_20.jsonl'), ...read('H1_B_INEQUALITY_PARENT_BATCH2_19.jsonl')];
const cRaw = [...read('H1_C_INEQUALITY_PARENT_STABLE4.jsonl'), single('H1_C_Q762_POST_D.jsonl')];
const cByQueue = new Map(cRaw.map(row => [row.queueIndex, row]));
const postD = { A: single('H1_A_Q762_POST_D.jsonl'), B: single('H1_B_Q762_POST_D.jsonl') };
const dLedger = JSON.parse(fs.readFileSync(path.join(checkpoint, 'source-evidence/D-q762-question-only/physical-ledger.json'), 'utf8'));
if (dLedger.queueIndex !== 762 || dLedger.questionUid !== postD.A.questionUid
  || !dLedger.disposition.includes('HEADING_ONLY_CORRECTION'))
  throw new Error('q762 source supersession ledger missing');
if (screen.length !== 39 || queueParity.length !== 39 || parityByWorkerQueue.size !== 39
  || aRaw.length !== 39 || bRaw.length !== 39 || cRaw.length !== 5)
  throw new Error('boundary coverage mismatch');
const label = row => row.parentLabelKo ?? row.curriculumParent?.parentLabelKo ?? null;
const reason = row => row.parentReason ?? row.curriculumParent?.reason ?? null;
const status = row => row.reviewStatus ?? row.status ?? row.verdict ?? null;
const identityKeys = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint',
  'contentHash', 'solutionHash', 'inputBundleSha', 'sourceFileSha256'];
const out = [];
for (const [i, entry] of screen.entries()) {
  const q = entry.queueIndex;
  const parity = parityByWorkerQueue.get(q);
  if (!parity || parity.questionUid !== entry.questionUid || parity.sourceIdentity !== entry.sourceIdentity)
    throw new Error(`queue parity missing q${q}`);
  const currentQueueIndex = parity.currentQueueIndex;
  const a = q === 762 ? postD.A : aRaw[i];
  const b = q === 762 ? postD.B : bRaw[i];
  if (a.queueIndex !== q || b.queueIndex !== q || a.questionUid !== entry.questionUid || b.questionUid !== entry.questionUid
    || a.sourceIdentity !== entry.sourceIdentity || b.sourceIdentity !== entry.sourceIdentity)
    throw new Error(`parent identity mismatch q${q}`);
  for (const key of identityKeys) if (!a[key] || a[key] !== b[key]) throw new Error(`A/B ${key} mismatch q${q}`);
  if (q !== 762 && a.sourceFingerprint !== entry.sourceFingerprint) throw new Error(`screen source drift q${q}`);
  if (q === 762 && a.sourceFingerprint === entry.sourceFingerprint) throw new Error('q762 source repair not reflected');
  if (status(a) !== 'PASS' || status(b) !== 'PASS' || !label(a) || !label(b) || !reason(a) || !reason(b))
    throw new Error(`parent review incomplete q${q}`);
  let selected = null, provenance = null, agreeingPair = null;
  const c = cByQueue.get(q) ?? null;
  if (label(a) === label(b)) {
    selected = label(a);
    provenance = 'DUAL_LUNA_MATCH';
  } else {
    if (!c) throw new Error(`missing blind C q${q}`);
    for (const key of identityKeys) if (!c[key] || c[key] !== a[key]) throw new Error(`C ${key} mismatch q${q}`);
    if (status(c) !== 'PASS' || !label(c) || !reason(c)) throw new Error(`C parent review incomplete q${q}`);
    if (label(c) === label(a)) { selected = label(a); agreeingPair = ['A', 'C']; }
    else if (label(c) === label(b)) { selected = label(b); agreeingPair = ['B', 'C']; }
    if (!selected) throw new Error(`three-way parent split q${q} requires Sol`);
    provenance = 'LUNA_2_OF_3_CONSENSUS';
  }
  out.push({ schemaVersion: 1, status: 'WORKING_PARENT_BOUNDARY_NOT_FINAL',
    queueIndex: currentQueueIndex, workerBundleQueueIndex: q,
    questionUid: a.questionUid, sourceIdentity: a.sourceIdentity,
    sourceFingerprint: a.sourceFingerprint, contentHash: a.contentHash, solutionHash: a.solutionHash,
    oldFrozenL3: 'PT_H1_SYSTEM_EQUATION', selectedDraftParentLabelKo: selected,
    decisionProvenance: provenance, agreeingPair, aParent: label(a), bParent: label(b), cParent: c ? label(c) : null,
    aParentReason: reason(a), bParentReason: reason(b), cParentReason: c ? reason(c) : null,
    l4SkeletonEvidence: { a: a.l4?.skeleton ?? a.l4Skeleton ?? null,
      b: b.l4?.skeleton ?? b.l4Skeleton ?? null, c: c?.tentativeL4Skeleton ?? null },
    evidenceFiles: { a: q === 762 ? 'H1_A_Q762_POST_D.jsonl' : `H1_A_INEQUALITY_PARENT_BATCH${i < 20 ? '1_20' : '2_19'}.jsonl`,
      b: q === 762 ? 'H1_B_Q762_POST_D.jsonl' : `H1_B_INEQUALITY_PARENT_BATCH${i < 20 ? '1_20' : '2_19'}.jsonl`,
      c: c ? (q === 762 ? 'H1_C_Q762_POST_D.jsonl' : 'H1_C_INEQUALITY_PARENT_STABLE4.jsonl') : null },
    q762SourceHeadingSupersession: q === 762 ? 'source-evidence/D-q762-question-only/physical-ledger.json' : null,
    taxonomyPromotion: false, l4Final: false });
}
if (new Set(out.map(row => row.questionUid)).size !== 39) throw new Error('duplicate boundary UID');
const parentCounts = Object.fromEntries([...new Set(out.map(row => row.selectedDraftParentLabelKo))]
  .map(label => [label, out.filter(row => row.selectedDraftParentLabelKo === label).length]));
const summary = { schemaVersion: 1, status: 'WORKING_PARENT_BOUNDARY_NOT_FINAL', denominator: 39,
  screenedFromFrozenSystemEquation: 76, aCurrentCoverage: 39, bCurrentCoverage: 39,
  cConflictCoverage: 5, dualAgreement: out.filter(row => row.decisionProvenance === 'DUAL_LUNA_MATCH').length,
  twoOfThree: out.filter(row => row.decisionProvenance === 'LUNA_2_OF_3_CONSENSUS').length,
  threeWay: 0, parentCounts, oldSystemEquationParentRetained: out.filter(row => row.selectedDraftParentLabelKo === '연립방정식').length,
  queueIndexCorrections: queueParity.filter(row => row.changed).map(row => ({
    workerBundleQueueIndex: row.workerBundleQueueIndex, currentQueueIndex: row.currentQueueIndex,
    questionUid: row.questionUid })),
  q762FailedFirstPassPreserved: 'H1_A_INEQUALITY_PARENT_BATCH2_19.jsonl#queueIndex=762',
  q762CorrectedCurrentSource: true, activeCanonicalPromotion: false, l4Final: false };
fs.writeFileSync(path.join(dir, 'H1_SYSTEM_INEQUALITY_PARENT_WORKING_39.jsonl'), out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_SYSTEM_INEQUALITY_PARENT_WORKING_39_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
