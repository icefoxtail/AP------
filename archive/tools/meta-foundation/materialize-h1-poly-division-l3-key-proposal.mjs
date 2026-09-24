#!/usr/bin/env node
/** Sol taxonomy edit for the 87-item old merged family; candidate keys only. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'poly-division-boundary');
const read = file => fs.readFileSync(path.join(dir, file), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const family = read('H1_POLY_DIVISION_BOUNDARY_WORKING_87.jsonl');
const first50 = JSON.parse(fs.readFileSync(path.join(checkpoint,
  'H1_STAGEA_FIRST50_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const rest = JSON.parse(fs.readFileSync(path.join(checkpoint,
  'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const currentRows = [...first50.rows, ...rest.rows];
if (family.length !== 87 || currentRows.length !== 1170) throw new Error('current denominator mismatch');
const currentByUid = new Map(currentRows.map(row => [row.questionUid, row]));
const mappings = {
  '다항식의 나눗셈': {
    key: 'PT_H1_POLY_DIVISION', keyStatus: 'NEW_CANONICAL_CANDIDATE',
    definition: '다항식 나눗셈의 몫·나머지 항등식, 차수 제한 또는 실제 나눗셈 절차가 풀이의 결정 단계인 유형.',
  },
  '나머지정리': {
    key: 'PT_H1_REMAINDER_THEOREM', keyStatus: 'NEW_CANONICAL_CANDIDATE',
    definition: '일차식 나눗셈의 나머지를 함수값으로 바꾸거나 그 관계를 확장해 값·계수·나머지를 결정하는 유형.',
  },
  '인수정리': {
    key: 'PT_H1_FACTOR_THEOREM', keyStatus: 'NEW_CANONICAL_CANDIDATE',
    definition: '다항식의 영점과 일차인수의 동치를 중심으로 인수 여부·중복인수·미정계수 또는 공통인수를 결정하는 유형.',
  },
  '항등식': {
    key: 'PT_H1_POLY_IDENTITY_COEFFICIENT', keyStatus: 'REUSE_STAGE3_CANDIDATE',
    definition: '항등식의 특수값 대입 또는 계수 비교로 미정계수를 정하는 기존 Stage3 후보 유형.',
  },
};
const held = new Set([26, 31, 87, 98, 114]);
const out = family.map(row => {
  const current = currentByUid.get(row.questionUid);
  if (!current || current.queueIndex !== row.queueIndex || current.sourceIdentity !== row.sourceIdentity
    || current.currentSourceFingerprint !== row.sourceFingerprint)
    throw new Error(`current A/B source drift q${row.queueIndex}`);
  const mapping = mappings[row.selectedDraftL3ParentLabelKo];
  if (!mapping) throw new Error(`unmapped L3 parent q${row.queueIndex}`);
  if (held.has(row.queueIndex) !== (row.workingReviewStatus === 'HOLD'))
    throw new Error(`family HOLD drift q${row.queueIndex}`);
  return {
    schemaVersion: 1, status: 'SOL_GLOBAL_L3_KEY_PROPOSAL_NOT_FINAL',
    queueIndex: row.queueIndex, questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
    sourceFingerprint: row.sourceFingerprint, oldMergedL3Key: 'PT_H1_POLY_DIVISION_REMAINDER',
    draftParentLabelKo: row.selectedDraftL3ParentLabelKo,
    proposedProblemTypeKey: held.has(row.queueIndex) ? null : mapping.key,
    proposedKeyStatus: held.has(row.queueIndex) ? 'HOLD_SOURCE_OR_SOLUTION' : mapping.keyStatus,
    keyDefinition: mapping.definition, parentDecisionProvenance: row.parentProvenance,
    holdReasonRequired: held.has(row.queueIndex), evidenceFile: 'H1_POLY_DIVISION_BOUNDARY_WORKING_87.jsonl',
    activeCanonicalPromotion: false, l4Final: false,
  };
});
if (new Set(out.map(row => row.questionUid)).size !== 87) throw new Error('family UID duplicate');
const summary = {
  schemaVersion: 1, status: 'SOL_GLOBAL_L3_KEY_PROPOSAL_NOT_FINAL', denominator: 87,
  authority: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/HIGH/공통수학1.md#L3-1.1.3-L3-1.2.3',
  oldMergedKey: 'PT_H1_POLY_DIVISION_REMAINDER',
  mappings: Object.fromEntries(Object.entries(mappings).map(([label, x]) => [label, x])),
  draftParentCounts: Object.fromEntries(Object.keys(mappings).map(label =>
    [label, out.filter(row => row.draftParentLabelKo === label).length])),
  proposedKeyCounts: Object.fromEntries([...new Set(out.map(row => row.proposedProblemTypeKey).filter(Boolean))]
    .map(key => [key, out.filter(row => row.proposedProblemTypeKey === key).length])),
  heldQueueIndexes: out.filter(row => row.holdReasonRequired).map(row => row.queueIndex),
  proposedKeyCoverage: out.filter(row => row.proposedProblemTypeKey).length,
  activeCanonicalPromotion: false, l4Final: false,
};
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_87_L3_KEY_PROPOSAL.jsonl'),
  out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_POLY_DIVISION_87_L3_KEY_PROPOSAL_SUMMARY.json'),
  JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
