#!/usr/bin/env node
/** Merge two working Stage A ranges with exact 1170-row identity/coverage gates. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const read = file => fs.readFileSync(path.join(dir, file), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const rows = [
  ...read('H1_STAGEA_FIRST50_WORKING_RELATIONAL_CANDIDATE.jsonl'),
  ...read('H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1120.jsonl'),
].sort((a, b) => a.queueIndex - b.queueIndex);
if (rows.length !== 1170) throw new Error(`denominator ${rows.length} != 1170`);
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (row.queueIndex !== i + 1) throw new Error(`missing/duplicate queue index at ${i + 1}`);
  if (!row.questionUid || !row.sourceIdentity || !/^[a-f0-9]{64}$/.test(row.sourceFingerprint))
    throw new Error(`identity/hash missing q${row.queueIndex}`);
  if (row.status !== 'WORKING_NOT_FINAL' || row.difficultyPending !== true || row.globalTaxonomyReviewPending !== true)
    throw new Error(`premature finality q${row.queueIndex}`);
}
if (new Set(rows.map(row => row.questionUid)).size !== 1170) throw new Error('duplicate UID');
if (new Set(rows.map(row => row.sourceIdentity)).size !== 1170) throw new Error('duplicate sourceIdentity');
const pending = rows.filter(row => row.pendingSolFields.length);
const summary = {
  schemaVersion: 1, status: 'WORKING_NOT_FINAL', denominator: 1170,
  currentUidCoverage: 1170, currentSourceIdentityCoverage: 1170, duplicateUid: 0, duplicateSourceIdentity: 0,
  itemsWithWorkingFieldConsensus: 1170 - pending.length,
  itemsPendingSolFieldReview: pending.length,
  pendingSolFieldCount: pending.reduce((count, row) => count + row.pendingSolFields.length, 0),
  taxonomyFinal: false, l4Final: false, crossConceptFinal: false, conditionFinal: false,
  integrationFinal: false, difficultyFinal: false, finalValidatorPass: false,
  inputs: ['H1_STAGEA_FIRST50_WORKING_RELATIONAL_CANDIDATE.jsonl', 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1120.jsonl'],
};
fs.writeFileSync(path.join(dir, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'), rows.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
