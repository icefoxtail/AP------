#!/usr/bin/env node
/** Current-source A2/B/C L4 evidence inventory; semantic cluster equivalence remains Sol work. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'poly-division-boundary');
const read = name => fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const sample = read('H1_POLY_DIVISION_BOUNDARY_WORKING_20_CURRENT.jsonl');
const remaining = read('H1_POLY_DIVISION_REMAINING_WORKING_67.jsonl');
const family = read('H1_POLY_DIVISION_BOUNDARY_WORKING_87.jsonl');
const current = fs.readFileSync(path.join(checkpoint, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1170.jsonl'), 'utf8')
  .trim().split(/\r?\n/).map(JSON.parse);
if (sample.length !== 20 || remaining.length !== 67 || family.length !== 87 || current.length !== 1170)
  throw new Error('L4 family/current coverage mismatch');
const currentByUid = new Map(current.map(row => [row.questionUid, row]));
const a = [...read('H1_A2_L4_REMAINING_67.jsonl'), ...read('H1_A2_L4_SAMPLE_20.jsonl')];
const b = [...read('H1_B_L4_REMAINING_67.jsonl'), ...read('H1_B_L4_SAMPLE_20.jsonl')];
const a2Final = JSON.parse(fs.readFileSync(path.join(dir,
  'H1_A2_L4_FAMILY_87_CLUSTER_DEFINITIONS.json'), 'utf8'));
const a2FinalRows = [
  ...a2Final.clusterDefinitions.flatMap(cluster => cluster.members.map(member => ({
    questionUid: member.questionUid, clusterId: cluster.clusterId,
    skeleton: cluster.boundedCandidateSkeleton,
  }))),
  ...a2Final.noSeparate.map(member => ({ questionUid: member.questionUid,
    clusterId: 'NO_SEPARATE', skeleton: null })),
];
const a2FinalByUid = new Map(a2FinalRows.map(row => [row.questionUid, row]));
if (a2FinalRows.length !== 87 || a2FinalByUid.size !== 87)
  throw new Error('A2 updated family assignment coverage/duplicate mismatch');
const c = [...read('H1_C2_L4_REMAINING_CONFLICTS_20.jsonl'),
  ...read('H1_C2_L4_SAMPLE_CONFLICTS_8.jsonl')];
const postD = [
  { A2: read('H1_A2_Q087_STAGEA_POST_D_RAW.jsonl')[0],
    B: read('H1_B_Q087_STAGEA_POST_D_RAW.jsonl')[0],
    C2: read('H1_C2_Q087_POST_D_RAW.jsonl')[0] },
  { A2: read('H1_A2_Q114_STAGEA_POST_D_RAW.jsonl')[0],
    B: read('H1_B_Q114_STAGEA_POST_D_RAW.jsonl')[0],
    C2: read('H1_C2_Q114_POST_D_RAW.jsonl')[0] },
];
const map = rows => new Map(rows.map(row => [row.questionUid, row]));
const aByUid = map(a), bByUid = map(b), cByUid = map(c);
for (const item of postD) for (const [side, target] of [['A2', aByUid], ['B', bByUid], ['C2', cByUid]])
  target.set(item[side].questionUid, item[side]);
if (aByUid.size !== 87 || bByUid.size !== 87 || cByUid.size !== 28)
  throw new Error('A2/B/C distinct UID coverage mismatch');
const idFields = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash'];
const aCluster = row => row.l4Cluster ?? row.L4?.cluster
  ?? (row.L4?.status === 'NO_SEPARATE' ? 'NO_SEPARATE' : row.L4?.status ?? null);
const bCluster = row => typeof row.l4Cluster === 'object' ? row.l4Cluster.clusterId
  : row.l4ClusterId ?? (row.l4?.status === 'NO_SEPARATE' ? 'NO_SEPARATE' : row.l4?.status ?? null);
const cCluster = row => row.clusterId?.startsWith('NO_SEPARATE') ? 'NO_SEPARATE'
  : row.clusterId ?? (row.noSeparate?.possible ? 'NO_SEPARATE' : null);
const aSkeleton = row => row.candidateSkeleton ?? row.originalL4Candidate?.skeleton ?? row.L4?.skeleton ?? null;
const bSkeleton = row => row.l4CanonicalSkeleton ?? row.l4Cluster?.skeleton ?? row.l4?.skeleton ?? null;
const cSkeleton = row => row.l4Skeleton ?? row.L4Skeleton ?? null;
const out = family.map(item => {
  const x = aByUid.get(item.questionUid), y = bByUid.get(item.questionUid), z = cByUid.get(item.questionUid) ?? null;
  const finalA2 = a2FinalByUid.get(item.questionUid);
  const currentA2Cluster = [87, 114].includes(item.queueIndex) ? aCluster(x) : finalA2?.clusterId;
  const currentA2Skeleton = [87, 114].includes(item.queueIndex) ? aSkeleton(x)
    : finalA2?.skeleton ?? aSkeleton(x);
  const live = currentByUid.get(item.questionUid);
  if (!x || !y || !live || live.queueIndex !== item.queueIndex
    || live.sourceIdentity !== item.sourceIdentity || live.sourceFingerprint !== item.sourceFingerprint)
    throw new Error(`L4 live source drift q${item.queueIndex}`);
  for (const field of idFields) {
    if ((!['contentHash', 'solutionHash'].includes(field) && x[field] !== item[field])
      || x[field] !== y[field] || (z && x[field] !== z[field]))
      throw new Error(`L4 A2/B/C ${field} mismatch q${item.queueIndex}`);
  }
  if ((!currentA2Skeleton && currentA2Cluster !== 'NO_SEPARATE')
    || (!bSkeleton(y) && bCluster(y) !== 'NO_SEPARATE')
    || (z && !cSkeleton(z) && cCluster(z) !== 'NO_SEPARATE'))
    throw new Error(`L4 skeleton evidence missing q${item.queueIndex}`);
  return { schemaVersion: 1, status: 'L4_RAW_COMPARISON_NOT_ADJUDICATED',
    queueIndex: item.queueIndex, questionUid: item.questionUid, sourceIdentity: item.sourceIdentity,
    sourceFingerprint: item.sourceFingerprint, selectedDraftL3ParentLabelKo: item.selectedDraftL3ParentLabelKo,
    a2: { cluster: currentA2Cluster, skeleton: currentA2Skeleton,
      priorItemCluster: aCluster(x), reviewStatus: x.reviewStatus },
    b: { cluster: bCluster(y), skeleton: bSkeleton(y), reviewStatus: y.reviewStatus },
    c: z ? { cluster: cCluster(z), skeleton: cSkeleton(z), reviewStatus: z.reviewStatus } : null,
    cIndependentCoverage: Boolean(z),
    semanticClusterEquivalence: 'SOL_GLOBAL_EDITOR_PENDING', l4Final: false };
}).sort((x, y) => x.queueIndex - y.queueIndex);
if (out.length !== 87 || new Set(out.map(row => row.questionUid)).size !== 87)
  throw new Error('L4 comparison duplicate/coverage');
const summary = { schemaVersion: 1, status: 'L4_RAW_COMPARISON_NOT_ADJUDICATED',
  denominator: 87, a2CurrentCoverage: 87, bCurrentCoverage: 87,
  cCurrentTargetedCoverage: out.filter(row => row.c).length,
  a2NoSeparateCount: out.filter(row => row.a2.cluster === 'NO_SEPARATE').length,
  bNoSeparateCount: out.filter(row => row.b.cluster === 'NO_SEPARATE').length,
  currentHoldQueueIndexes: family.filter(row => row.workingReviewStatus === 'HOLD').map(row => row.queueIndex),
  clusterNamesAreIndependent: true, semanticClusterEquivalencePending: true, l4Final: false };
summary.a2UpdatedFamilyEvidenceFile = 'H1_A2_L4_FAMILY_87_CLUSTER_DEFINITIONS.json';
fs.writeFileSync(path.join(dir, 'H1_POLY_L4_AB_C_RAW_COMPARISON_87.jsonl'),
  out.map(row => JSON.stringify(row)).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'H1_POLY_L4_AB_C_RAW_COMPARISON_87_SUMMARY.json'),
  JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
