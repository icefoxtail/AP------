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
const proposalPath = path.join(dir, 'poly-division-boundary/H1_POLY_DIVISION_87_L3_KEY_PROPOSAL.jsonl');
const proposal = fs.readFileSync(proposalPath, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
if (proposal.length !== 87 || new Set(proposal.map(row => row.questionUid)).size !== 87)
  throw new Error('polynomial L3 proposal coverage mismatch');
const proposalByUid = new Map(proposal.map(row => [row.questionUid, row]));
let proposalApplied = 0;
for (const row of rows) {
  const edit = proposalByUid.get(row.questionUid);
  if (!edit) continue;
  if (row.queueIndex !== edit.queueIndex || row.sourceIdentity !== edit.sourceIdentity
    || row.sourceFingerprint !== edit.sourceFingerprint) throw new Error(`polynomial L3 proposal source drift q${row.queueIndex}`);
  row.priorStageAL3Decision = row.fieldDecisions.l3;
  row.fieldDecisions.l3 = edit.holdReasonRequired
    ? { value: null, provenance: 'HOLD', keyStatus: 'HOLD_SOURCE_OR_SOLUTION',
      reason: 'Source/solution HOLD prevents L3 freeze; draft curriculum parent retained only in the separate evidence ledger.',
      evidenceFile: 'poly-division-boundary/H1_POLY_DIVISION_87_L3_KEY_PROPOSAL.jsonl' }
    : { value: edit.proposedProblemTypeKey, provenance: edit.parentDecisionProvenance,
      keyStatus: edit.proposedKeyStatus, taxonomyKeyMappingBy: 'SOL_GLOBAL_TAXONOMY_EDIT',
      reason: `Curriculum parent ${edit.draftParentLabelKo} mapped to a working key candidate; ACTIVE promotion pending.`,
      evidenceFile: 'poly-division-boundary/H1_POLY_DIVISION_87_L3_KEY_PROPOSAL.jsonl' };
  row.pendingSolFields = row.pendingSolFields.filter(field => field !== 'l3');
  row.solGlobalL3ProposalApplied = true;
  proposalApplied++;
}
if (proposalApplied !== 87) throw new Error('polynomial L3 proposal not fully applied');
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
  polynomialL3ProposalApplied: proposalApplied,
  taxonomyFinal: false, l4Final: false, crossConceptFinal: false, conditionFinal: false,
  integrationFinal: false, difficultyFinal: false, finalValidatorPass: false,
  inputs: ['H1_STAGEA_FIRST50_WORKING_RELATIONAL_CANDIDATE.jsonl', 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1120.jsonl',
    'poly-division-boundary/H1_POLY_DIVISION_87_L3_KEY_PROPOSAL.jsonl'],
};
fs.writeFileSync(path.join(dir, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'), rows.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
