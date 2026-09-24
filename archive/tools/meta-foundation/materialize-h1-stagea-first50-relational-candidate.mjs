#!/usr/bin/env node
/** Working A/B/C field consensus for H1 queue 1-50. Never declares final taxonomy. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const comparison = JSON.parse(fs.readFileSync(path.join(dir, 'H1_STAGEA_FIRST50_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const q31DirectFile = 'H1_SOL_Q031_FACTOR_NORMALIZATION_ADJUDICATION.json';
const q31Direct = JSON.parse(fs.readFileSync(path.join(dir, q31DirectFile), 'utf8'));
if (comparison.summary.counts.currentDual !== 50 || comparison.summary.counts.unreviewedConflict !== 0)
  throw new Error('first50 A/B/C coverage gate is not closed');
const read = file => fs.readFileSync(path.join(dir, file), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const cCache = new Map();
const fields = ['l3', 'crossConcepts', 'conditions', 'integrationPattern', 'sourceIssue', 'reviewStatus'];
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const label = value => typeof value === 'string' ? value : value?.key ?? value?.status ?? value?.issue ?? value?.issueCode ?? null;
const issue = value => {
  const raw = label(value);
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
const keys = values => [...new Set((Array.isArray(values) ? values : [])
  .map(value => typeof value === 'string' ? value : value?.key).filter(Boolean))].sort();
function cFor(row) {
  if (!row.currentCFile) return null;
  if (!cCache.has(row.currentCFile)) cCache.set(row.currentCFile, read(row.currentCFile));
  return cCache.get(row.currentCFile).find(c => c.questionUid === row.questionUid
    && c.sourceFingerprint === row.currentSourceFingerprint) ?? null;
}
function normalizedC(c) {
  if (!c) return null;
  const l3Review = c.l3IndependentJudgment ?? c.frozenL3IndependentReview ?? c.frozenL3Review ?? {};
  const key = l3Review.recommendedPrimaryKey ?? l3Review.suggestedL3
    ?? (l3Review.independentProblemTypeKeys?.length === 1 ? l3Review.independentProblemTypeKeys[0] : null)
    ?? l3Review.key ?? c.l3UpstreamKey ?? null;
  const verdict = c.verdict ?? c.reviewStatus ?? c.status ?? null;
  return { l3: key, crossConcepts: keys(c.crossConceptKeys ?? c.crossConcepts),
    conditions: keys(c.conditionKeys ?? c.conditions), integrationPattern: label(c.integrationPattern),
    sourceIssue: issue(c.sourceIssue), reviewStatus: verdict === 'COMPLETE' || verdict === 'REVIEWED'
      ? (c.hold || c.holdReason ? 'HOLD' : 'PASS') : verdict };
}
const candidate = [];
const solQueue = [];
const counts = { items: 0, fieldsDualMatch: 0, fieldsTwoOfThree: 0, fieldsSolDirectOverride: 0, fieldsPendingSol: 0,
  itemsPendingSol: 0, itemsAllFieldsResolvedWorking: 0 };
for (const row of comparison.rows) {
  if (!row.a || !row.b) throw new Error(`missing A/B q${row.queueIndex}`);
  const c = normalizedC(cFor(row));
  if (row.fullConflict && !c) throw new Error(`missing current C q${row.queueIndex}`);
  const fieldDecisions = {};
  const pending = [];
  for (const field of fields) {
    const a = row.a[field] ?? null, b = row.b[field] ?? null;
    if (same(a, b)) {
      fieldDecisions[field] = { value: a, provenance: 'DUAL_LUNA_MATCH' };
      counts.fieldsDualMatch++;
    } else if (c?.[field] == null) {
      fieldDecisions[field] = { value: null, provenance: 'SOL_DIRECT_ADJUDICATION_PENDING', reason: 'C_FIELD_MISSING', competingValues: { a, b } };
      counts.fieldsPendingSol++; pending.push(field);
    } else if (same(a, c[field]) || same(b, c[field])) {
      fieldDecisions[field] = { value: c[field], provenance: 'LUNA_2_OF_3_CONSENSUS',
        agreeingPair: same(a, c[field]) ? ['A', 'C'] : ['B', 'C'] };
      counts.fieldsTwoOfThree++;
    } else {
      fieldDecisions[field] = { value: null, provenance: 'SOL_DIRECT_ADJUDICATION_PENDING', reason: 'THREE_WAY_SPLIT',
        competingValues: { a, b, c: c[field] } };
      counts.fieldsPendingSol++; pending.push(field);
    }
  }
  if (row.queueIndex === 31) {
    if (row.questionUid !== q31Direct.questionUid || row.currentSourceFingerprint !== q31Direct.sourceFingerprint)
      throw new Error('q31 Sol direct evidence/source drift');
    for (const [field, value] of [['reviewStatus', 'HOLD'], ['sourceIssue', 'SOURCE_UNRESOLVED_HOLD']]) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'DUAL_LUNA_MATCH') counts.fieldsDualMatch--;
      else if (previous.provenance === 'LUNA_2_OF_3_CONSENSUS') counts.fieldsTwoOfThree--;
      else if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      }
      fieldDecisions[field] = { value, provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q31DirectFile, reason: 'Printed question leaves factor normalization and signs unconstrained.' };
      counts.fieldsSolDirectOverride++;
    }
  }
  counts.items++;
  if (pending.length) {
    counts.itemsPendingSol++;
    solQueue.push({ queueIndex: row.queueIndex, questionUid: row.questionUid,
      sourceIdentity: row.sourceIdentity, sourceFingerprint: row.currentSourceFingerprint,
      pendingFields: pending, aFile: row.aFile, bFile: row.bFile, cFile: row.currentCFile });
  } else counts.itemsAllFieldsResolvedWorking++;
  candidate.push({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', queueIndex: row.queueIndex,
    questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
    sourceFingerprint: row.currentSourceFingerprint,
    evidenceFiles: { a: row.aFile, b: row.bFile, c: row.currentCFile },
    fieldDecisions, pendingSolFields: pending, globalTaxonomyReviewPending: true, difficultyPending: true });
}
const writeJsonl = (file, rows) => fs.writeFileSync(path.join(dir, file), rows.map(row => JSON.stringify(row)).join('\n') + '\n');
writeJsonl('H1_STAGEA_FIRST50_WORKING_RELATIONAL_CANDIDATE.jsonl', candidate);
writeJsonl('H1_STAGEA_FIRST50_SOL_DIRECT_FIELD_QUEUE.jsonl', solQueue);
fs.writeFileSync(path.join(dir, 'H1_STAGEA_FIRST50_WORKING_RELATIONAL_SUMMARY.json'),
  JSON.stringify({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', denominator: 50, counts,
    sourceComparison: 'H1_STAGEA_FIRST50_AB_WORKING_COMPARISON_CURRENT.json' }, null, 2) + '\n');
console.log(JSON.stringify(counts, null, 2));
