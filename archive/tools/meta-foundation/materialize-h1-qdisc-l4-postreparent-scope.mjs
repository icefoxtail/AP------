#!/usr/bin/env node
/** Reconcile the frozen 80-input L4 scope with Sol's current seven-item L3 reparent. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'l4-quadratic-discriminant');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const original = read('H1_QDISC_L4_WORKING_PASS_80_UID_ONLY.jsonl');
const reviewed = read('H1_QDISC_L4_AB_C_RAW_COMPARISON_40.jsonl');
const moved = read('H1_SOL_QDISC_L3_REPARENT_8.jsonl');
const stage = fs.readFileSync(path.join(checkpoint, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'), 'utf8')
  .trim().split(/\r?\n/).map(JSON.parse);
const key = 'PT_H1_QUADRATIC_DISCRIMINANT';
const family = stage.filter(row => row.fieldDecisions.l3.value === key);
const pass = family.filter(row => row.fieldDecisions.reviewStatus.value === 'PASS');
const held = family.filter(row => row.fieldDecisions.reviewStatus.value === 'HOLD');
const originalUid = new Set(original.map(row => row.questionUid));
const currentPassUid = new Set(pass.map(row => row.questionUid));
const movedUid = new Set(moved.map(row => row.questionUid));
if (original.length !== 80 || reviewed.length !== 40 || moved.length !== 8
  || family.length !== 74 || pass.length !== 71 || held.length !== 3
  || held.map(row => row.queueIndex).sort((a, b) => a - b).join(',') !== '38,592,620'
  || pass.some(row => !originalUid.has(row.questionUid))
  || moved.some(row => !originalUid.has(row.questionUid))
  || [...movedUid].some(uid => currentPassUid.has(uid)))
  throw new Error('qdisc post-reparent scope mismatch');
const reviewedCurrent = reviewed.filter(row => currentPassUid.has(row.questionUid));
const remainingPrepared = original.slice(40).filter(row => currentPassUid.has(row.questionUid));
if (reviewedCurrent.length !== 31 || remainingPrepared.length !== 40)
  throw new Error('qdisc reviewed/remaining scope mismatch');
const summary = { schemaVersion: 1, status: 'CURRENT_SCOPE_AFTER_SOL_L3_REPARENT_NOT_FINAL',
  originalBlindInputPassScope: 80, currentL3Family: 74, currentPassScope: 71,
  currentSourceOrSolutionHeldQueueIndexes: [38, 592, 620],
  movedOutOfFamilyQueueIndexes: moved.map(row => row.queueIndex),
  reviewedInFirstTwoBatches: 40, reviewedStillInCurrentL3AndPass: 31,
  preparedBatch3And4StillInCurrentL3: 40,
  blockingSolutionCorrectionQueueIndexes: [592], nonblockingSolutionNoteQueueIndexes: [572],
  originalInputsRemainPhysicalHistory: true,
  activeCanonicalPromotion: false, l4Final: false };
fs.writeFileSync(path.join(dir, 'H1_QDISC_L4_POST_REPARENT_SCOPE_SUMMARY.json'),
  JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
