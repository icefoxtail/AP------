#!/usr/bin/env node
/** Adapt isolated current-payload A2/B/C reruns into the first-50 comparison schema. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const rawDir = path.join(dir, 'source-repair-post-d');
const read = name => fs.readFileSync(path.join(rawDir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const d = name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
const q36 = d('H1_SOL_Q036_ANSWER_INDEX_CORRECTION.json');
const q41 = d('H1_SOL_Q041_VALUES_NOT_SUM_CORRECTION.json');
const q44 = d('source-evidence/D-first50-missing-stem-batch/q44/physical-ledger.json');
const q46 = d('source-evidence/D-first50-missing-stem-batch/q46/physical-ledger.json');
const expected = new Map([[36, q36.sourceFingerprintAfterAnswerCorrection],
  [41, q41.sourceFingerprintAfterCorrection], [44, q44.queue.sourceFingerprintAfter],
  [46, q46.queue.sourceFingerprintAfter]]);
const cases = [
  { queueIndex: 36, a: 'H1_A2_Q036_POST_SOL_RAW.jsonl', b: 'H1_B_Q036_POST_SOL_RAW.jsonl',
    c: 'H1_C2_Q036_POST_SOL_RAW.jsonl', suffix: 'Q036_POST_SOL' },
  { queueIndex: 41, a: 'H1_A2_Q041_POST_SOL_RAW.jsonl', b: 'H1_B_Q041_POST_SOL_RAW.jsonl',
    c: 'H1_C2_Q041_POST_SOL_RAW.jsonl', suffix: 'Q041_POST_SOL' },
  { queueIndex: 44, a: 'H1_A2_Q41_44_46_POST_D_RAW.jsonl', b: 'H1_B_Q41_44_46_POST_D_RAW.jsonl',
    c: null, suffix: 'Q044_POST_D' },
  { queueIndex: 46, a: 'H1_A2_Q41_44_46_POST_D_RAW.jsonl', b: 'H1_B_Q41_44_46_POST_D_RAW.jsonl',
    c: 'H1_C2_Q046_POST_D_RAW.jsonl', suffix: 'Q046_POST_D' },
];
const identity = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash'];
const values = value => Array.isArray(value) ? value.map(item => typeof item === 'string'
  ? item : { key: item.key ?? item.conceptKey ?? item.conditionKey, reason: item.reason ?? null }) : [];
const key = value => typeof value === 'string' ? value : value?.key ?? null;
function adapt(record, side, rawFile) {
  const l3 = side === 'A' ? record.L3?.activeKey ?? record.l3?.activeKey ?? null
    : side === 'B' ? record.l3?.problemTypeKey ?? record.L3?.problemTypeKey ?? record.L3?.activeKey ?? null
      : record.l3?.problemTypeKey ?? record.L3?.activeKey ?? null;
  const crossConceptKeys = values(record.CrossConceptKeys ?? record.crossConceptKeys ?? record.crossConcepts);
  const conditionKeys = values(record.ConditionKeys ?? record.conditionKeys ?? record.conditions);
  const integrationPattern = key(record.IntegrationPattern ?? record.integrationPattern);
  if (!integrationPattern || !['PASS', 'HOLD'].includes(record.reviewStatus))
    throw new Error(`${side} status/integration incomplete q${record.queueIndex}`);
  const normalized = {
    ...Object.fromEntries(identity.map(field => [field, record[field]])),
    crossConceptKeys, conditionKeys, integrationPattern,
    sourceIssue: { key: record.reviewStatus === 'HOLD' ? 'SOURCE_UNRESOLVED_HOLD' : 'NONE',
      reason: typeof record.sourceIssue === 'string' ? record.sourceIssue : record.sourceIssue?.reason ?? null },
    reviewStatus: record.reviewStatus, holdReason: record.holdReason ?? record.reviewReason ?? null,
    sourceEvidence: record.sourceEvidence ?? record.sourceMathEvidence ?? null,
    solutionEvidence: record.solutionEvidence ?? record.solutionMathEvidence ?? null,
    primaryMethod: record.primaryMethod ?? null, decisiveStep: record.decisiveStep ?? null,
    rawEvidenceFile: `source-repair-post-d/${rawFile}`,
  };
  if (side === 'C') normalized.l3IndependentJudgment = { recommendedPrimaryKey: l3 };
  else normalized.problemTypeKey = l3;
  return normalized;
}
function write(name, row) { fs.writeFileSync(path.join(dir, name), JSON.stringify(row) + '\n'); }
for (const task of cases) {
  const records = Object.fromEntries(['a', 'b', 'c'].filter(side => task[side]).map(side => {
    const row = read(task[side]).find(item => item.queueIndex === task.queueIndex);
    if (!row) throw new Error(`${side} q${task.queueIndex} missing`);
    return [side, row];
  }));
  if (records.a.sourceFingerprint !== expected.get(task.queueIndex))
    throw new Error(`q${task.queueIndex} current source fingerprint mismatch`);
  for (const field of identity) {
    if (!records.a[field] || records.a[field] !== records.b[field]
      || (records.c && records.a[field] !== records.c[field]))
      throw new Error(`q${task.queueIndex} ${field} independent reviewer mismatch`);
  }
  for (const [side, record] of Object.entries(records)) {
    const letter = side.toUpperCase();
    const file = `H1_STAGEA_LUNA_${letter}_${side === 'c' ? 'POST_D_' : 'SOURCE_REPAIR_REREVIEW_'}${task.suffix}.jsonl`;
    write(file, adapt(record, letter, task[side]));
  }
}
console.log(JSON.stringify({ currentAdaptedQueueIndexes: cases.map(task => task.queueIndex),
  currentFingerprints: Object.fromEntries(expected) }, null, 2));
