#!/usr/bin/env node
/** Join the reviewed 20+67 boundary without promoting a taxonomy or L4 key. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'poly-division-boundary');
const read = file => fs.readFileSync(path.join(dir, file), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const sample = read('H1_POLY_DIVISION_BOUNDARY_WORKING_20_CURRENT.jsonl');
const remaining = read('H1_POLY_DIVISION_REMAINING_WORKING_67.jsonl');
const first50 = JSON.parse(fs.readFileSync(path.join(checkpoint,
  'H1_STAGEA_FIRST50_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const rest = JSON.parse(fs.readFileSync(path.join(checkpoint,
  'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const currentRows = [...first50.rows, ...rest.rows];
if (sample.length !== 20 || remaining.length !== 67 || currentRows.length !== 1170)
  throw new Error('family or current A/B comparison coverage mismatch');
const currentByUid = new Map(currentRows.map(row => [row.questionUid, row]));
const out = [...sample, ...remaining].map(row => {
  const current = currentByUid.get(row.questionUid);
  if (!current || current.queueIndex !== row.queueIndex || current.sourceIdentity !== row.sourceIdentity
    || current.currentSourceFingerprint !== row.sourceFingerprint)
    throw new Error(`current A/B identity/fingerprint drift q${row.queueIndex}`);
  const parent = row.selectedDraftL3ParentLabelKo;
  if (!['다항식의 나눗셈', '나머지정리', '인수정리', '항등식'].includes(parent))
    throw new Error(`unapproved draft parent q${row.queueIndex}`);
  if (row.activeL3Promotion || row.activeCanonicalPromotion || row.activeL4Promotion || row.l4Final)
    throw new Error(`unexpected final promotion q${row.queueIndex}`);
  return {
    schemaVersion: 1, status: 'WORKING_L3_L4_BOUNDARY_NOT_FINAL',
    queueIndex: row.queueIndex, questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
    sourceFingerprint: row.sourceFingerprint, oldMergedL3Candidate: row.oldMergedL3Candidate,
    selectedDraftL3ParentLabelKo: parent,
    parentProvenance: row.parentProvenance ?? row.decisionProvenance,
    agreeingPair: row.parentAgreeingPair ?? row.agreeingPair ?? null,
    workingReviewStatus: row.workingReviewStatus ?? 'PASS',
    l4SkeletonEvidence: row.l4SkeletonEvidence, evidenceFiles: row.evidenceFiles,
    activeCanonicalPromotion: false, l4Final: false,
  };
}).sort((a, b) => a.queueIndex - b.queueIndex);
if (new Set(out.map(row => row.questionUid)).size !== 87 || new Set(out.map(row => row.queueIndex)).size !== 87)
  throw new Error('family duplicate UID or queue index');
const parentCounts = Object.fromEntries(['다항식의 나눗셈', '나머지정리', '인수정리', '항등식']
  .map(label => [label, out.filter(row => row.selectedDraftL3ParentLabelKo === label).length]));
const summary = {
  schemaVersion: 1, status: 'WORKING_L3_L4_BOUNDARY_NOT_FINAL', denominator: 87,
  source: ['H1_POLY_DIVISION_BOUNDARY_WORKING_20_CURRENT.jsonl', 'H1_POLY_DIVISION_REMAINING_WORKING_67.jsonl'],
  currentABComparisonIdentityCoverage: 87, parentCounts,
  parentProvenanceCounts: Object.fromEntries([...new Set(out.map(row => row.parentProvenance))]
    .map(key => [key, out.filter(row => row.parentProvenance === key).length])),
  workingHoldQueueIndexes: out.filter(row => row.workingReviewStatus === 'HOLD').map(row => row.queueIndex),
  activeCanonicalPromotion: false, l4Final: false,
};
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_BOUNDARY_WORKING_87.jsonl'),
  out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_BOUNDARY_WORKING_87_SUMMARY.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
