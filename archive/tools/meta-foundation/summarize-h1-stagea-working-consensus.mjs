#!/usr/bin/env node
/** Working per-field 2-of-3 summary. Never declares final semantic truth. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const comparison = JSON.parse(fs.readFileSync(path.join(dir, 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const read = file => fs.readFileSync(path.join(dir, file), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const cCache = new Map();
const label = value => typeof value === 'string' ? value : value?.key ?? value?.status ?? value?.issue ?? null;
const issueLabel = value => {
  const raw = value?.issueCode ?? label(value);
  if (['CLEAR', 'NO_ISSUE', 'OK', 'PASS'].includes(raw) || raw?.startsWith('UPSTREAM_L')) return 'NONE';
  if (['SOLUTION_GENERIC_FILLER', 'SOLUTION_PLACEHOLDER', 'SOLUTION_BLOCKER',
    'SOLUTION_WRONG_ITEM', 'SOLUTION_TOPIC_MISMATCH', 'SOLUTION_NOT_ITEM_SPECIFIC',
    'SOLUTION_GENERIC_NO_MATH'].includes(raw)) return 'SOLUTION_BLOCKER';
  if (['SOLUTION_INTERMEDIATE_TYPO', 'SOLUTION_IMAGINARY_UNIT_TRANSCRIPTION',
    'NONBLOCKING_SOLUTION_TYPO'].includes(raw)) return 'SOLUTION_MINOR_TYPO';
  if (['MINOR_EDITORIAL', 'MINOR_TEXT_ONLY', 'MINOR'].includes(raw)) return 'MINOR_EDITORIAL';
  if (['SOLUTION_PROOF_GAP', 'SOLUTION_REASON_GAP', 'NONBLOCKING_SOLUTION_GAP'].includes(raw)) return 'SOLUTION_REASON_GAP';
  return raw;
};
const keys = list => [...new Set((Array.isArray(list) ? list : [])
  .map(value => typeof value === 'string' ? value : value?.key)
  .filter(Boolean))].sort();
const canonical = value => JSON.stringify(value ?? null);
function cRowFor(row) {
  if (!row.currentCFile) return null;
  if (!cCache.has(row.currentCFile)) cCache.set(row.currentCFile, read(row.currentCFile));
  return cCache.get(row.currentCFile).find(c => c.questionUid === row.questionUid
    && c.sourceFingerprint === row.currentSourceFingerprint) ?? null;
}
function normalizedC(c) {
  if (!c) return null;
  const l3 = c.frozenL3Review ?? c.l3 ?? c.frozenL3 ?? {};
  const oldChallenge = c.independentChallenge?.decision === 'CHALLENGE_FROZEN_L3';
  return {
    l3: (oldChallenge ? c.independentChallenge.key : null)
      ?? l3.suggestedL3 ?? l3.problemTypeKey ?? l3.key ?? c.problemTypeKey ?? null,
    l3Challenge: ['NEW_CANDIDATE', 'CHALLENGE', 'HOLD'].includes(l3.status)
      || Boolean(l3.suggestedL3 && l3.suggestedL3 !== l3.key)
      || /CHALLENGED/.test(l3.independentReview ?? '') || oldChallenge,
    crossConcepts: keys(c.crossConcepts ?? c.crossConceptKeys),
    conditions: keys(c.conditions ?? c.conditionKeys),
    integrationPattern: label(c.integrationPattern),
    sourceIssue: issueLabel(c.sourceIssue),
    reviewStatus: c.verdict ?? (c.reviewStatus === 'COMPLETE'
      ? (c.holdReason || c.sourceIssue?.hold ? 'HOLD' : 'PASS') : c.reviewStatus) ?? c.status ?? null,
  };
}

const fields = ['l3', 'l3Challenge', 'crossConcepts', 'conditions', 'integrationPattern', 'sourceIssue', 'reviewStatus'];
const results = [];
const counts = { fullConflict: 0, noCurrentC: 0, currentC: 0, allFieldsTwoOfThree: 0, rowsNeedingSolFieldReview: 0, fieldTwoOfThree: {}, fieldThreeWaySplit: {}, fieldMissing: {} };
for (const row of comparison.rows) {
  if (!row.fullConflict) continue;
  counts.fullConflict++;
  const c = normalizedC(cRowFor(row));
  if (!c) { counts.noCurrentC++; continue; }
  counts.currentC++;
  const decisions = {};
  for (const field of fields) {
    const a = row.a?.[field], b = row.b?.[field], cv = c[field];
    if (canonical(a) === canonical(b)) continue;
    if (cv === undefined || cv === null) {
      counts.fieldMissing[field] = (counts.fieldMissing[field] ?? 0) + 1;
      decisions[field] = { status: 'C_FIELD_MISSING', a, b };
    } else if (canonical(a) === canonical(cv)) {
      counts.fieldTwoOfThree[field] = (counts.fieldTwoOfThree[field] ?? 0) + 1;
      decisions[field] = { status: 'A_C_CONSENSUS', value: a };
    } else if (canonical(b) === canonical(cv)) {
      counts.fieldTwoOfThree[field] = (counts.fieldTwoOfThree[field] ?? 0) + 1;
      decisions[field] = { status: 'B_C_CONSENSUS', value: b };
    } else {
      counts.fieldThreeWaySplit[field] = (counts.fieldThreeWaySplit[field] ?? 0) + 1;
      decisions[field] = { status: 'THREE_WAY_SPLIT', a, b, c: cv };
    }
  }
  const solFields = Object.entries(decisions).filter(([, value]) => value.status === 'THREE_WAY_SPLIT' || value.status === 'C_FIELD_MISSING').map(([field]) => field);
  if (solFields.length) counts.rowsNeedingSolFieldReview++;
  else counts.allFieldsTwoOfThree++;
  results.push({ queueIndex: row.queueIndex, questionUid: row.questionUid, sourceIdentity: row.sourceIdentity, sourceFingerprint: row.currentSourceFingerprint, cFile: row.currentCFile, decisions, solFields });
}
const output = path.join(dir, 'H1_STAGEA_WORKING_FIELD_CONSENSUS_CURRENT.json');
fs.writeFileSync(output, JSON.stringify({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', sourceComparison: 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json', counts, rows: results }, null, 2) + '\n');
console.log(JSON.stringify({ output, counts }, null, 2));
