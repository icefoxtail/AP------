#!/usr/bin/env node
/** Compose deterministic working relational fields after A/B/C coverage. No final taxonomy or difficulty. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const comparison = JSON.parse(fs.readFileSync(path.join(dir, 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const fieldConsensus = JSON.parse(fs.readFileSync(path.join(dir, 'H1_STAGEA_WORKING_FIELD_CONSENSUS_CURRENT.json'), 'utf8'));
const q539DirectFile = 'H1_SOL_Q539_UNREDUCED_FRACTION_ADJUDICATION.json';
const q539Direct = JSON.parse(fs.readFileSync(path.join(dir, q539DirectFile), 'utf8'));
if (comparison.summary.counts.currentDual !== 1120 || comparison.summary.counts.unreviewedConflict !== 0)
  throw new Error('A/B/C coverage gate not closed for queue 51-1170');
const consensusByQueue = new Map(fieldConsensus.rows.map(row => [row.queueIndex, row]));
const fields = ['l3', 'l3Challenge', 'crossConcepts', 'conditions', 'integrationPattern', 'sourceIssue', 'reviewStatus'];
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const out = [];
const solQueue = [];
const counts = { items: 0, fieldsDualMatch: 0, fieldsTwoOfThree: 0, fieldsSolDirectOverride: 0,
  fieldsPendingSol: 0, itemsPendingSol: 0, itemsAllFieldsResolvedWorking: 0 };
for (const row of comparison.rows) {
  if (!row.a || !row.b) throw new Error(`missing A/B q${row.queueIndex}`);
  const consensus = consensusByQueue.get(row.queueIndex);
  if (row.fullConflict && !consensus) throw new Error(`missing C consensus q${row.queueIndex}`);
  const fieldDecisions = {};
  const pending = [];
  for (const field of fields) {
    const a = row.a[field] ?? null;
    const b = row.b[field] ?? null;
    if (same(a, b)) {
      fieldDecisions[field] = { value: a, provenance: 'DUAL_LUNA_MATCH' };
      counts.fieldsDualMatch++;
      continue;
    }
    const result = consensus?.decisions?.[field];
    if (!result) throw new Error(`missing field decision q${row.queueIndex} ${field}`);
    if (result.status === 'A_C_CONSENSUS' || result.status === 'B_C_CONSENSUS') {
      fieldDecisions[field] = { value: result.value, provenance: 'LUNA_2_OF_3_CONSENSUS', agreeingPair: result.status === 'A_C_CONSENSUS' ? ['A', 'C'] : ['B', 'C'] };
      counts.fieldsTwoOfThree++;
    } else {
      fieldDecisions[field] = { value: null, provenance: 'SOL_DIRECT_ADJUDICATION_PENDING', competingValues: { a, b, c: result.c ?? null }, reason: result.status };
      counts.fieldsPendingSol++;
      pending.push(field);
    }
  }
  if (row.queueIndex === 539) {
    if (row.questionUid !== q539Direct.questionUid || row.currentSourceFingerprint !== q539Direct.sourceFingerprint)
      throw new Error('q539 Sol direct evidence/source drift');
    for (const [field, value] of [['reviewStatus', 'HOLD'], ['sourceIssue', 'SOURCE_UNRESOLVED_HOLD']]) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'DUAL_LUNA_MATCH') counts.fieldsDualMatch--;
      else if (previous.provenance === 'LUNA_2_OF_3_CONSENSUS') counts.fieldsTwoOfThree--;
      else if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      }
      fieldDecisions[field] = { value, provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q539DirectFile, reason: 'Printed statement leaves n/m unreduced, so requested sum is not unique.' };
      counts.fieldsSolDirectOverride++;
    }
  }
  counts.items++;
  if (pending.length) {
    counts.itemsPendingSol++;
    solQueue.push({ queueIndex: row.queueIndex, questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
      sourceFingerprint: row.currentSourceFingerprint, pendingFields: pending, aFile: row.aFile, bFile: row.bFile,
      cFile: row.currentCFile });
  } else counts.itemsAllFieldsResolvedWorking++;
  out.push({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', queueIndex: row.queueIndex,
    questionUid: row.questionUid, sourceIdentity: row.sourceIdentity, sourceFingerprint: row.currentSourceFingerprint,
    evidenceFiles: { a: row.aFile, b: row.bFile, c: row.currentCFile }, fieldDecisions,
    pendingSolFields: pending, globalTaxonomyReviewPending: true, difficultyPending: true });
}
const writeJsonl = (file, rows) => fs.writeFileSync(path.join(dir, file), rows.map(row => JSON.stringify(row)).join('\n') + '\n');
writeJsonl('H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1120.jsonl', out);
writeJsonl('H1_STAGEA_SOL_DIRECT_FIELD_QUEUE_CURRENT.jsonl', solQueue);
fs.writeFileSync(path.join(dir, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_SUMMARY.json'),
  JSON.stringify({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', denominator: 1120, counts,
    sourceComparison: 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json',
    sourceFieldConsensus: 'H1_STAGEA_WORKING_FIELD_CONSENSUS_CURRENT.json' }, null, 2) + '\n');
console.log(JSON.stringify(counts, null, 2));
