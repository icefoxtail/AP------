#!/usr/bin/env node
/** Compact Sol review pack for the 83 H1 matrix items; no taxonomy promotion. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const read = file => fs.readFileSync(path.join(dir, file), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const comparison = JSON.parse(fs.readFileSync(path.join(dir, 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const oldL4 = new Map(read('H1_STAGE3_L4_CANDIDATE_ASSIGNMENTS_1170.jsonl').map(row => [row.questionUid, row]));
const fileCache = new Map();
function item(file, uid) {
  if (!file) return null;
  if (!fileCache.has(file)) fileCache.set(file, read(file));
  return fileCache.get(file).find(row => row.questionUid === uid) ?? null;
}
const rows = comparison.rows.filter(row => row.queueIndex >= 1088 && row.queueIndex <= 1170);
if (rows.length !== 83 || rows.some(row => !row.a || !row.b)) throw new Error('matrix A/B coverage mismatch');
const result = [];
for (const row of rows) {
  const a = item(row.aFile, row.questionUid);
  const b = item(row.bFile, row.questionUid);
  const c = item(row.currentCFile, row.questionUid);
  const stage3 = oldL4.get(row.questionUid);
  if (!a || !b || !stage3) throw new Error(`matrix evidence missing q${row.queueIndex}`);
  const frozen = a.frozenL3?.problemTypeKey ?? stage3.problemTypeKeyCandidate;
  const bKey = b.l3?.problemTypeKey ?? b.frozenUpstreamL3?.problemTypeKey ?? b.frozenL3?.problemTypeKey ?? null;
  result.push({ schemaVersion: 1, status: 'SOL_MATRIX_REVIEW_PENDING', queueIndex: row.queueIndex,
    questionUid: row.questionUid, sourceIdentity: row.sourceIdentity, sourceFingerprint: row.currentSourceFingerprint,
    frozenL3: frozen, bIndependentL3: bKey, l3BoundaryDifference: frozen !== bKey,
    previousL4Candidate: stage3.templateKeyCandidate,
    aMethod: a.primaryMethod, aDecisiveStep: a.decisiveStep, aL4: a.l4,
    bMethod: b.primaryMethod, bDecisiveStep: b.decisiveStep, bL4: b.l4,
    cMethod: c?.primaryMethod ?? null, cDecisiveStep: c?.decisiveStep ?? null,
    cL3Review: c?.independentL3ChallengeReview ?? c?.frozenL3Review ?? c?.frozenL3IndependentReview ?? null,
    cL4: c?.L4Skeleton ?? null,
    evidenceFiles: { a: row.aFile, b: row.bFile, c: row.currentCFile },
    proposedDraftParent: null, proposedL4Family: null, solReason: null });
}
const group = (key) => Object.fromEntries([...new Set(result.map(row => row[key]))].map(value => [value ?? 'null', result.filter(row => row[key] === value).length]));
const summary = { schemaVersion: 1, status: 'WORKING_NOT_FINAL', denominator: 83,
  frozenL3Counts: group('frozenL3'), bIndependentL3Counts: group('bIndependentL3'),
  oldL4Counts: group('previousL4Candidate'), l3BoundaryDifferences: result.filter(row => row.l3BoundaryDifference).length,
  allRowsRequireSolParentOwnership: true, activeMatrixL3KeyPromotions: 0, activeMatrixL4KeyPromotions: 0 };
fs.writeFileSync(path.join(dir, 'H1_MATRIX_TAXONOMY_SOL_REVIEW_PACK_83.jsonl'), result.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_MATRIX_TAXONOMY_SOL_REVIEW_PACK_83_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
