#!/usr/bin/env node
/** Sol working L3 reparent for eight Vieta/reconstruction items found in blind L4 review. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'l4-quadratic-discriminant');
const stage = fs.readFileSync(path.join(checkpoint, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'), 'utf8')
  .trim().split(/\r?\n/).map(JSON.parse);
const comparison = fs.readFileSync(path.join(dir, 'H1_QDISC_L4_AB_C_RAW_COMPARISON_40.jsonl'), 'utf8')
  .trim().split(/\r?\n/).map(JSON.parse);
const stage3 = JSON.parse(fs.readFileSync(path.join(checkpoint, 'H1_STAGE3_L3_SYNTHESIS_CHECKPOINT_1170.json'), 'utf8'));
const stageByQueue = new Map(stage.map(row => [row.queueIndex, row]));
const compareByQueue = new Map(comparison.map(row => [row.queueIndex, row]));
const activeKeys = new Set(JSON.parse(fs.readFileSync(path.join(process.cwd(),
  'archive/_generated/intelligence/phase1/high1-foundation/one-pass-pilot/worker-input/H1_ONE_PASS_ACTIVE_VOCAB_SANITIZED.json'), 'utf8'))
  .problemTypes.map(row => row.problemTypeKey));
const stage3Keys = new Set(stage3.newProblemTypeCandidates.map(row => row.problemTypeKey));
const decisions = [
  { queueIndex: 372, proposedKey: 'PT_H1_ROOT_COEFFICIENT_RELATION',
    reason: 'Although A2/C judged the broad old discriminant family plausible, the decisive step is Vieta: equal-magnitude opposite-sign roots give zero sum, their product becomes −8a², and its bound selects natural a. C also placed the item under the curriculum root-coefficient L1/L2; no D-sign or root-existence classification is used.' },
  { queueIndex: 562, proposedKey: 'PT_H1_ROOT_COEFFICIENT_RELATION',
    reason: 'The graph gives roots −1 and 3; factorization/Vieta gives the x coefficient a=−2. A discriminant or root-type test is not decisive.' },
  { queueIndex: 580, proposedKey: 'PT_H1_QUADRATIC_RECONSTRUCTION', unitBindingReviewRequired: true,
    reason: 'The given f-values at two known roots and f(1) determine the unknown quadratic f via f(x)+20x proportional to the root polynomial; its root product is evaluated afterward.' },
  { queueIndex: 583, proposedKey: 'PT_H1_ROOT_COEFFICIENT_RELATION',
    reason: 'Integer roots are parameterized through Vieta and an integer factor-pair equation; D-sign classification is not the deciding step.' },
  { queueIndex: 585, proposedKey: 'PT_H1_ROOT_COEFFICIENT_RELATION',
    reason: 'The requested reciprocal-root expression is obtained directly from root sum/product by Vieta.' },
  { queueIndex: 587, proposedKey: 'PT_H1_ROOT_COEFFICIENT_RELATION',
    reason: 'An affine map sends the original quadratic roots to new roots, and Vieta gives their sum; no discriminant-sign test is used.' },
  { queueIndex: 598, proposedKey: 'PT_H1_ROOT_COEFFICIENT_RELATION',
    reason: 'The transformed roots are handled by Vieta sum/product under an affine change, not by root-existence classification.' },
  { queueIndex: 605, proposedKey: 'PT_H1_QUADRATIC_RECONSTRUCTION', unitBindingReviewRequired: true,
    reason: 'f(α)=f(β)=αβ makes f−3 divisible by the known quadratic; f(1) fixes its scalar and reconstructs f before target evaluation.' },
];
if (stage.length !== 1170 || comparison.length !== 40 || decisions.length !== 8)
  throw new Error('qdisc L3 reparent input coverage mismatch');
const items = decisions.map(decision => {
  const row = stageByQueue.get(decision.queueIndex), evidence = compareByQueue.get(decision.queueIndex);
  if (!row || !evidence || row.questionUid !== evidence.questionUid
    || row.sourceFingerprint !== evidence.sourceFingerprint
    || !['PT_H1_QUADRATIC_DISCRIMINANT', decision.proposedKey].includes(row.fieldDecisions.l3.value)
    || row.fieldDecisions.reviewStatus.value !== 'PASS'
    || evidence.a2.reviewStatus !== 'PASS' || evidence.c?.reviewStatus !== 'PASS')
    throw new Error(`q${decision.queueIndex} source/independent-evidence gate mismatch`);
  if (!stage3Keys.has(decision.proposedKey) || activeKeys.has(decision.proposedKey))
    throw new Error(`q${decision.queueIndex} Stage3 candidate reuse/key-status mismatch`);
  return { ...decision, schemaVersion: 1, status: 'SOL_WORKING_L3_REPARENT_NOT_FINAL',
    questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
    sourceFingerprint: row.sourceFingerprint,
    priorKey: 'PT_H1_QUADRATIC_DISCRIMINANT', keyStatus: 'REUSE_STAGE3_CANDIDATE_NOT_ACTIVE',
    decisionProvenance: 'SOL_DIRECT_ADJUDICATION',
    unitBindingReviewRequired: Boolean(decision.unitBindingReviewRequired),
    evidenceFiles: decision.queueIndex === 372
      ? ['H1_QDISC_L4_AB_C_RAW_COMPARISON_40.jsonl', 'H1_A2_QDISC_L4_BATCH1_20.jsonl',
        'H1_B_QDISC_L4_BATCH1_ISSUE_SUPERSESSION_20.jsonl', 'H1_C2_QDISC_L4_BATCH1_CONFLICTS_8.jsonl']
      : ['H1_QDISC_L4_AB_C_RAW_COMPARISON_40.jsonl', 'H1_A2_QDISC_L4_BATCH2_20.jsonl',
        'H1_B_QDISC_L4_BATCH2_RAW_20.jsonl', 'H1_C2_QDISC_L4_BATCH2_CONFLICTS_9.jsonl'],
    activeCanonicalPromotion: false, l4Final: false };
});
if (new Set(items.map(row => row.questionUid)).size !== 8) throw new Error('qdisc L3 reparent duplicate UID');
const summary = { schemaVersion: 1, status: 'SOL_WORKING_L3_REPARENT_NOT_FINAL',
  denominator: 8, queueIndexes: items.map(row => row.queueIndex),
  proposedKeyCounts: Object.fromEntries([...new Set(items.map(row => row.proposedKey))]
    .map(key => [key, items.filter(row => row.proposedKey === key).length])),
  unitBindingReviewQueueIndexes: items.filter(row => row.unitBindingReviewRequired).map(row => row.queueIndex),
  sourceCurrentCoverage: 8, activeCanonicalPromotion: false, l4Final: false };
fs.writeFileSync(path.join(dir, 'H1_SOL_QDISC_L3_REPARENT_8.jsonl'),
  items.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_SOL_QDISC_L3_REPARENT_8_SUMMARY.json'),
  JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
