#!/usr/bin/env node
/** Sol's bounded L4 taxonomy edit for the current 87-item old merged polynomial family. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'poly-division-boundary');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const family = read('H1_POLY_DIVISION_BOUNDARY_WORKING_87.jsonl');
const comparison = read('H1_POLY_L4_AB_C_RAW_COMPARISON_87.jsonl');
const stage = fs.readFileSync(path.join(checkpoint, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'), 'utf8')
  .trim().split(/\r?\n/).map(JSON.parse);
if (family.length !== 87 || comparison.length !== 87 || stage.length !== 1170)
  throw new Error('current L4 proposal denominator mismatch');
const stageByUid = new Map(stage.map(row => [row.questionUid, row]));
const compareByUid = new Map(comparison.map(row => [row.questionUid, row]));
const catalog = [
  { key: 'TPL_H1_DIVISION_RECONSTRUCTION', parent: '다항식의 나눗셈',
    status: 'REUSE_STAGE3_CANDIDATE_REPARENT_REQUIRED',
    definition: '몫·나머지 항등식과 차수 제한을 연결하여 미지 다항식을 복원하거나 둘 이상의 나눗셈 관계를 일치시킨다.',
    indexes: [2, 99, 105, 178, 184, 217, 220] },
  { key: 'TPL_H1_DIVISION_IDENTITY_VALUE_TRANSFER', parent: '다항식의 나눗셈',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '주어진 나눗셈 항등식을 특정 값·근에 대입해 몫이나 나머지의 값을 다른 지점으로 전달한다.',
    indexes: [6, 21, 72, 119, 124, 136, 206] },
  { key: 'TPL_H1_POLY_DIVISION_ALGORITHM', parent: '다항식의 나눗셈',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '차수 조건이 충족될 때까지 최고차항을 소거하며 몫과 나머지를 계산한다. 조립제법 표와 긴 나눗셈 표기는 같은 절차로 본다.',
    indexes: [68, 77, 110, 125, 133, 165, 172, 181, 201, 225, 232] },
  { key: 'TPL_H1_DIVISION_IDENTITY_TRANSFORM', parent: '다항식의 나눗셈',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '기존 P=DQ+R 관계를 곱하거나 변형해 새 제수의 배수와 차수 제한을 만족하는 새 나머지로 다시 묶는다.',
    indexes: [78, 85] },
  { key: 'TPL_H1_DIVISION_COEFFICIENT_MATCH', parent: '다항식의 나눗셈',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '정확한 나누어떨어짐 또는 제수에 대한 나머지 0 조건을 다항식 계수식으로 바꾸고 비교해 미정계수를 결정한다.',
    indexes: [29, 61, 65, 73, 123] },
  { key: 'TPL_H1_DIVISOR_POWER_REDUCTION', parent: '다항식의 나눗셈',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '제수로 나눈 합동식이나 거듭제곱 인수 관계를 이용해 고차항을 낮은 차수의 몫·나머지 계산으로 환원한다.',
    indexes: [23, 139] },
  { key: 'TPL_H1_REMAINDER_LINEAR_EVALUATION', parent: '나머지정리',
    status: 'REUSE_STAGE3_CANDIDATE_REPARENT_REQUIRED',
    definition: '일차식 x−a로 나눈 나머지를 P(a)로 직접 구하거나 같은 근에서 알려진 나머지를 전달한다.',
    indexes: [58, 96, 120, 142, 171, 176, 187, 207, 212, 216] },
  { key: 'TPL_H1_REMAINDER_PARAMETER', parent: '나머지정리',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '일차식 나머지 조건을 함수값 방정식으로 바꾸어 미정계수를 결정한 뒤 목표 나머지·값을 구한다.',
    indexes: [5, 54, 102, 150, 164, 221, 236] },
  { key: 'TPL_H1_REMAINDER_INTERPOLATION', parent: '나머지정리',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '제수 차수보다 낮은 나머지를 놓고 제수의 여러 근에서 얻은 함수값을 이용해 나머지다항식을 복원한다.',
    indexes: [12, 18, 19, 22, 130, 154, 200, 209, 233] },
  { key: 'TPL_H1_REMAINDER_COMPOSITE_EXTENSION', parent: '나머지정리',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '기존 제수의 나머지에 그 제수의 배수를 더해 더 큰 곱 제수의 나머지를 놓고, 추가 인수의 근에서 남은 계수를 정한다.',
    indexes: [90, 112] },
  { key: 'TPL_H1_REMAINDER_IDENTITY_TRANSFER', parent: '나머지정리',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '하나 이상 주어진 나눗셈 항등식을 목표 근에서 평가해 공통 P값을 소거하거나 안쪽·바깥쪽 몫/나머지 값을 연결한다.',
    indexes: [131, 144, 174] },
  { key: 'TPL_H1_DIVISIBILITY_FACTOR_CONDITION', parent: '인수정리',
    status: 'REUSE_STAGE3_CANDIDATE_REPARENT_REQUIRED',
    definition: 'x−a가 인수라는 조건을 P(a)=0으로 바꾸어 인수 후보·미정계수·근 조건을 검사한다. 분기와 정수 조건은 항목별 제약으로 둔다.',
    indexes: [8, 9, 17, 30, 82, 173, 179, 214, 215, 231] },
  { key: 'TPL_H1_FACTOR_REPEATED_ROOT', parent: '인수정리',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '일차인수를 한 번 나눈 뒤 같은 근이 몫에도 남는지 검사해 중복인수 조건으로 계수를 정한다.',
    indexes: [20, 27, 191] },
  { key: 'TPL_H1_FACTOR_QUOTIENT_EVALUATION', parent: '인수정리',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: '알려진 일차인수의 근으로 미정계수를 정하고 실제로 나누어 얻은 몫을 특정 값에서 평가한다.',
    indexes: [158] },
  { key: 'TPL_H1_IDENTITY_SHIFTED_BASIS', parent: '항등식',
    status: 'NEW_CANONICAL_CANDIDATE',
    definition: 'x−r 기준으로 식을 표현하거나 r에서 연속 나눗셈해 평행이동한 기저의 계수를 차례로 추출한다.',
    indexes: [117, 132] },
  { key: 'TPL_H1_IDENTITY_SPECIAL_VALUE', parent: '항등식',
    status: 'REUSE_STAGE3_CANDIDATE',
    definition: '항등식에 목표가 되는 특수값을 대입해 항을 소거하고 곱·몫 또는 나머지 목표값을 구한다.',
    indexes: [227] },
];
const activeVocab = JSON.parse(fs.readFileSync(path.join(process.cwd(),
  'archive/_generated/intelligence/phase1/high1-foundation/one-pass-pilot/worker-input/H1_ONE_PASS_ACTIVE_VOCAB_SANITIZED.json'), 'utf8'));
const stage3 = JSON.parse(fs.readFileSync(path.join(checkpoint, 'H1_STAGE3_L4_DESIGN_CANDIDATE.json'), 'utf8'));
const activeKeys = new Set(activeVocab.templates.map(item => item.templateKey));
const stage3ByKey = new Map(stage3.templates.map(item => [item.templateKey, item]));
for (const item of catalog) {
  if (activeKeys.has(item.key)) throw new Error(`L4 key collides with ACTIVE ${item.key}`);
  const old = stage3ByKey.get(item.key);
  if (item.status === 'NEW_CANONICAL_CANDIDATE' && old)
    throw new Error(`new L4 candidate collides with Stage3 ${item.key}`);
  if (item.status.startsWith('REUSE') && !old)
    throw new Error(`missing Stage3 L4 reuse ${item.key}`);
  if (item.status === 'REUSE_STAGE3_CANDIDATE_REPARENT_REQUIRED'
    && old.parentProblemTypeKey !== 'PT_H1_POLY_DIVISION_REMAINDER')
    throw new Error(`unexpected old L4 parent ${item.key}`);
  if (item.status === 'REUSE_STAGE3_CANDIDATE'
    && old.parentProblemTypeKey !== 'PT_H1_POLY_IDENTITY_COEFFICIENT')
    throw new Error(`unexpected identity L4 parent ${item.key}`);
}
const held = new Set([26, 31, 87, 98, 114]);
const assignmentByQueue = new Map();
for (const item of catalog) for (const queueIndex of item.indexes) {
  if (assignmentByQueue.has(queueIndex)) throw new Error(`duplicate L4 proposal q${queueIndex}`);
  assignmentByQueue.set(queueIndex, item);
}
if (assignmentByQueue.size !== 82 || catalog.length !== 16) throw new Error('L4 key/assignment count mismatch');
const specialNotes = new Map([
  [17, 'The case enumeration selects point values inside the factor-condition procedure; it is not a separate L4 key.'],
  [21, 'A sum-of-squares special value constructs the dividend, then the division identity transfers the needed value; the first step is item-specific.'],
  [23, 'Odd-power factorization is the item-specific route to reduce a high-power quotient under the divisor.'],
  [29, 'Irreducibility and sign filtering are item conditions around the divisor coefficient-comparison core.'],
  [72, 'The printed remainder polynomial is read through the base division-identity value-transfer template; no singleton key is created.'],
  [78, 'A2 later moved this UID from NO_SEPARATE into the same transformation skeleton as q85; the updated A2 family artifact is authoritative over its earlier item row.'],
  [209, 'The nonreal root is a supporting cross-concept; the remainder is still reconstructed from root values.'],
  [215, 'Equal quotient/remainder parameterizes the polynomial, while the decisive factor-theorem root condition owns this L3/L4 family.'],
  [221, 'The sign branches and extremum filter are item-level integration/condition steps around a remainder parameter equation.'],
  [227, 'The single sum/difference identity item reuses the existing special-value template instead of creating a singleton L4.'],
]);
const out = family.map(item => {
  const live = stageByUid.get(item.questionUid), evidence = compareByUid.get(item.questionUid);
  if (!live || !evidence || live.queueIndex !== item.queueIndex
    || live.sourceIdentity !== item.sourceIdentity || live.sourceFingerprint !== item.sourceFingerprint
    || evidence.sourceFingerprint !== item.sourceFingerprint)
    throw new Error(`current L4 source/evidence drift q${item.queueIndex}`);
  const chosen = assignmentByQueue.get(item.queueIndex) ?? null;
  if (held.has(item.queueIndex) !== (chosen === null)
    || held.has(item.queueIndex) !== (item.workingReviewStatus === 'HOLD'))
    throw new Error(`HOLD/template key gate q${item.queueIndex}`);
  if (chosen && chosen.parent !== item.selectedDraftL3ParentLabelKo)
    throw new Error(`L4 parent ownership q${item.queueIndex}`);
  return { schemaVersion: 1, status: 'SOL_GLOBAL_L4_PROPOSAL_NOT_FINAL',
    queueIndex: item.queueIndex, questionUid: item.questionUid, sourceIdentity: item.sourceIdentity,
    sourceFingerprint: item.sourceFingerprint, draftL3ParentLabelKo: item.selectedDraftL3ParentLabelKo,
    templateKeyCandidate: chosen?.key ?? null,
    templateKeyStatus: chosen?.status ?? 'HOLD_SOURCE_OR_SOLUTION',
    proposalDefinition: chosen?.definition ?? null,
    decisionProvenance: chosen ? 'SOL_GLOBAL_TAXONOMY_EDIT_FROM_A2_B_C' : 'HOLD',
    a2SkeletonEvidence: evidence.a2.skeleton, bSkeletonEvidence: evidence.b.skeleton,
    cSkeletonEvidence: evidence.c?.skeleton ?? null,
    solEditorialNote: specialNotes.get(item.queueIndex) ?? (chosen
      ? 'Selected by the repeated decisive procedure under this L3 parent; number, display, condition and difficulty variations remain item-level.'
      : 'Source or solution HOLD prevents final L4 assignment.'),
    evidenceFiles: ['H1_POLY_L4_AB_C_RAW_COMPARISON_87.jsonl',
      'H1_A2_L4_FAMILY_87_CLUSTER_DEFINITIONS.json', 'H1_B_L4_REMAINING_CLUSTER_DEFINITIONS.json',
      ...(evidence.c ? ['H1_C2_L4_REMAINING_CONFLICTS_20.jsonl', 'H1_C2_L4_SAMPLE_CONFLICTS_8.jsonl'] : [])],
    activeCanonicalPromotion: false, l4Final: false };
});
if (new Set(out.map(row => row.questionUid)).size !== 87) throw new Error('L4 proposal duplicate UID');
const summary = { schemaVersion: 1, status: 'SOL_GLOBAL_L4_PROPOSAL_NOT_FINAL',
  denominator: 87, workingAssigned: out.filter(row => row.templateKeyCandidate).length,
  heldQueueIndexes: out.filter(row => !row.templateKeyCandidate).map(row => row.queueIndex),
  proposedKeyCount: catalog.length, reusedStage3CandidateCount: catalog.filter(item => item.status.startsWith('REUSE')).length,
  newCandidateCount: catalog.filter(item => item.status === 'NEW_CANONICAL_CANDIDATE').length,
  catalog: catalog.map(({ indexes, ...item }) => ({ ...item, currentUidCount: indexes.length,
    queueIndexes: indexes })),
  priorStage3BroadCandidates: ['TPL_H1_REMAINDER_LINEAR_EVALUATION',
    'TPL_H1_DIVISION_RECONSTRUCTION', 'TPL_H1_DIVISIBILITY_FACTOR_CONDITION'],
  l3ParentValidityChecked: true, activeKeyCollisionCount: 0,
  stage3ReuseAndNewKeyCollisionGate: 'PASS', activeCanonicalPromotion: false, l4Final: false };
fs.writeFileSync(path.join(dir, 'H1_SOL_POLY_L4_GLOBAL_PROPOSAL_87.jsonl'),
  out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_SOL_POLY_L4_GLOBAL_PROPOSAL_87_SUMMARY.json'),
  JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ denominator: summary.denominator, workingAssigned: summary.workingAssigned,
  heldQueueIndexes: summary.heldQueueIndexes, proposedKeyCount: summary.proposedKeyCount,
  reusedStage3CandidateCount: summary.reusedStage3CandidateCount,
  newCandidateCount: summary.newCandidateCount, l4Final: false }, null, 2));
