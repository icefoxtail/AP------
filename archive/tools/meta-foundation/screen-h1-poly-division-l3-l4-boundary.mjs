#!/usr/bin/env node
/** Stratified screening only; legacy L4 labels never enter worker input. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checkpoint = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const outDir = path.join(checkpoint, 'poly-division-boundary');
fs.mkdirSync(outDir, { recursive: true });
const read = file => fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const stage = read(path.join(checkpoint, 'H1_STAGE3_L4_CANDIDATE_ASSIGNMENTS_1170.jsonl'))
  .filter(row => row.problemTypeKeyCandidate === 'PT_H1_POLY_DIVISION_REMAINDER');
const current = read(path.join(checkpoint, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'));
const byUid = new Map(current.map(row => [row.questionUid, row]));
if (stage.length !== 87 || byUid.size !== 1170) throw new Error('family/current coverage drift');
const groups = new Map();
for (const row of stage) {
  if (!groups.has(row.templateKeyCandidate)) groups.set(row.templateKeyCandidate, []);
  groups.get(row.templateKeyCandidate).push(row);
}
const remainder = (groups.get('TPL_H1_REMAINDER_LINEAR_EVALUATION') ?? [])
  .sort((a, b) => byUid.get(a.questionUid).queueIndex - byUid.get(b.questionUid).queueIndex);
const reconstruction = groups.get('TPL_H1_DIVISION_RECONSTRUCTION') ?? [];
const factor = groups.get('TPL_H1_DIVISIBILITY_FACTOR_CONDITION') ?? [];
if (remainder.length !== 76 || reconstruction.length !== 9 || factor.length !== 2)
  throw new Error('legacy skeleton screening strata drift');
const selected = [...Array.from({ length: 9 }, (_, i) => remainder[Math.floor(i * (remainder.length - 1) / 8)]),
  ...reconstruction, ...factor];
if (selected.length !== 20 || new Set(selected.map(row => row.questionUid)).size !== 20)
  throw new Error('sample uniqueness/size mismatch');
const rows = selected.map(row => {
  const live = byUid.get(row.questionUid);
  if (!live || live.sourceIdentity !== row.sourceIdentity) throw new Error(`source identity drift ${row.questionUid}`);
  return { queueIndex: live.queueIndex, questionUid: row.questionUid,
    sourceIdentity: row.sourceIdentity, sourceFingerprint: live.sourceFingerprint };
}).sort((a, b) => a.queueIndex - b.queueIndex);
const manifestFile = path.join(outDir, 'H1_POLY_DIVISION_L3_L4_BOUNDARY_SAMPLE_20.jsonl');
const summaryFile = path.join(outDir, 'H1_POLY_DIVISION_L3_L4_BOUNDARY_SAMPLE_20_SUMMARY.json');
if (fs.existsSync(manifestFile) || fs.existsSync(summaryFile)) throw new Error('sample already frozen');
const summary = { schemaVersion: 1, status: 'SCREEN_ONLY_NOT_SEMANTIC_VERDICT',
  familyCandidate: 'PT_H1_POLY_DIVISION_REMAINDER', familyDenominator: 87, sampleCount: 20,
  selection: '9 evenly spaced legacy remainder-evaluation candidates, all 9 reconstruction candidates, and both factor-condition candidates; these labels are Sol-only screening strata and absent from worker input.',
  currentUidAndSourceIdentityBound: true, l3L4Final: false };
fs.writeFileSync(manifestFile, rows.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ ...summary, queueIndexes: rows.map(row => row.queueIndex) }, null, 2));
