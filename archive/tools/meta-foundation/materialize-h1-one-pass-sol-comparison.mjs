#!/usr/bin/env node
/** Materialize Sol-only per-item L3 judgments after the A/B blind 80-item gate. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation');
const hiddenDir = path.join(base, 'sol-checkpoint/pilot-hidden');
const outputDir = path.join(base, 'one-pass-pilot/worker-output');
const blindDir = path.join(base, 'one-pass-pilot/worker-input');
const rules = JSON.parse(fs.readFileSync(path.join(hiddenDir, 'H1_ONE_PASS_SOL_HIDDEN_L3_DECISION_RULES_WORKING.json')));
const raw = JSON.parse(fs.readFileSync(path.join(hiddenDir, 'H1_ONE_PASS_HIDDEN_L3_RAW_COMPARISON_80.json')));
function lines(file) { return fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse); }
const a = [
  'H1_ONE_PASS_PILOT_LUNA_A_CLEAN_BATCH01_001_020.jsonl',
  'H1_ONE_PASS_PILOT_LUNA_A_CLEAN_BATCH02_021_040.jsonl',
  'H1_ONE_PASS_PILOT_LUNA_A_CLEAN_BATCH03_041_060.jsonl',
  'H1_ONE_PASS_PILOT_LUNA_A_REPLACEMENT_BATCH04_061_080.jsonl',
].flatMap(name => lines(path.join(outputDir, name)));
const b = [
  'H1_ONE_PASS_PILOT_LUNA_B_CLEAN_BATCH01_001_020.jsonl',
  'H1_ONE_PASS_PILOT_LUNA_B_CLEAN_BATCH02_021_040.jsonl',
  'H1_ONE_PASS_PILOT_LUNA_B_CLEAN_BATCH03_041_060.jsonl',
  'H1_ONE_PASS_PILOT_LUNA_B_CLEAN_BATCH04_061_080.jsonl',
].flatMap(name => lines(path.join(outputDir, name)));
const blind = lines(path.join(blindDir, 'H1_ONE_PASS_PILOT_BLIND_INPUT_80.jsonl'));
const c = lines(path.join(outputDir, 'H1_ONE_PASS_PILOT_LUNA_C_BLIND_CONFLICT_16.jsonl'));
const cByRow = new Map(c.map(item => [item.row, item]));
if (a.length !== 80 || b.length !== 80 || raw.rows.length !== 80 || blind.length !== 80) throw new Error('80-item gate failed');

function category(worker, row) {
  if (rules.unscorableExistingL3HoldRows.includes(row)) return 'UNSCORABLE_EXISTING_L3_HOLD';
  const decisions = worker === 'A' ? rules.workerA : rules.workerB;
  for (const key of ['MATCH_WEAK_REASON', 'DIFF_PLAUSIBLE', 'DIFF_ERROR']) {
    if (decisions[key].includes(row)) return key;
  }
  return 'MATCH_GROUNDED';
}
const counts = { A: {}, B: {} };
const out = raw.rows.map((item, index) => {
  const row = index + 1;
  const aid = a[index].questionUid;
  const bid = b[index].questionUid;
  if (item.row !== row || item.questionUid !== aid || aid !== bid || aid !== blind[index].questionUid) throw new Error(`UID join failed at row ${row}`);
  const cItem = cByRow.get(row);
  const result = {
    row, questionUid: aid, sourceIdentity: item.sourceIdentity,
    sourceFingerprint: item.sourceFingerprint,
    hiddenExistingL3: item.hiddenExisting.candidateL3,
    hiddenExistingL3Status: item.hiddenExisting.candidateL3Status,
    hiddenExistingL3Reason: item.hiddenExisting.candidateL3Reason,
    a: {
      l3: item.a.l3, category: category('A', row),
      sourceMathEvidence: a[index].sourceMathEvidence,
      solutionMathEvidence: a[index].solutionMathEvidence,
      decisiveStep: a[index].decisiveStep?.step,
      l3Reason: a[index].L3?.reason,
      reviewStatus: a[index].reviewStatus,
    },
    b: {
      l3: item.b.l3, category: category('B', row),
      sourceMathEvidence: b[index].mathEvidence?.source,
      solutionMathEvidence: b[index].mathEvidence?.solution,
      decisiveStep: b[index].primary?.decisiveStep,
      l3Reason: b[index].l3?.reason,
      reviewStatus: b[index].reviewStatus,
    },
    cBlind: cItem ? {
      l3: cItem.L3?.problemTypeKey ?? null,
      reviewStatus: cItem.reviewStatus,
      sourceIssue: cItem.sourceIssue,
      holdReason: cItem.holdReason,
    } : null,
    solReason: rules.notesByRow[String(row)] ?? `Source and decisive-step evidence identify the same L3 family as the existing candidate: ${a[index].decisiveStep?.step ?? a[index].sourceMathEvidence}`,
    existingL3ReviewCandidate: rules.candidateExistingL3ReviewRows.includes(row),
    materialABL3Conflict: rules.materialAB_L3_conflictRows.includes(row),
  };
  for (const worker of ['A', 'B']) counts[worker][result[worker.toLowerCase()].category] = (counts[worker][result[worker.toLowerCase()].category] ?? 0) + 1;
  return result;
});
const summary = {
  status: rules.status,
  denominator: 80,
  categories: counts,
  materialABL3ConflictCount: out.filter(x => x.materialABL3Conflict).length,
  existingL3ReviewCandidateCount: out.filter(x => x.existingL3ReviewCandidate).length,
  cBlindCount: c.length,
  sourceInputs: {
    hiddenRaw: 'H1_ONE_PASS_HIDDEN_L3_RAW_COMPARISON_80.json',
    solRules: 'H1_ONE_PASS_SOL_HIDDEN_L3_DECISION_RULES_WORKING.json',
    acceptedA: 'A clean batches 01-03 plus fresh blind replacement batch04',
    acceptedB: 'B clean batches 01-04',
  },
};
const destination = path.join(hiddenDir, 'H1_ONE_PASS_SOL_HIDDEN_L3_ADJUDICATION_WORKING_80.json');
fs.writeFileSync(destination, JSON.stringify({ summary, rows: out }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
