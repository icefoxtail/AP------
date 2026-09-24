#!/usr/bin/env node
/** Adapt current post-D q114 A2/B/C HOLD verdicts for Stage A queue 51-1170. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const poly = path.join(checkpoint, 'poly-division-boundary');
const one = name => {
  const rows = fs.readFileSync(path.join(poly, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  if (rows.length !== 1) throw new Error(`q114 expected one row ${name}`);
  return rows[0];
};
const files = { A2: 'H1_A2_Q114_STAGEA_POST_D_RAW.jsonl',
  B2: 'H1_B_Q114_STAGEA_POST_D_RAW.jsonl', C2: 'H1_C2_Q114_POST_D_RAW.jsonl' };
const raw = Object.fromEntries(Object.entries(files).map(([side, file]) => [side, one(file)]));
const d = JSON.parse(fs.readFileSync(path.join(checkpoint,
  'source-evidence/D-q114-question-only/physical-ledger.json'), 'utf8'));
const idFields = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash'];
for (const field of idFields) if (!raw.A2[field] || raw.A2[field] !== raw.B2[field]
  || raw.A2[field] !== raw.C2[field]) throw new Error(`q114 independent ${field} mismatch`);
if (raw.A2.queueIndex !== 114 || raw.A2.sourceFingerprint !== d.queue.sourceFingerprintAfter
  || raw.A2.questionUid !== d.questionUid || raw.A2.sourceIdentity !== d.sourceIdentity
  || Object.values(raw).some(row => row.reviewStatus !== 'HOLD'))
  throw new Error('q114 post-D HOLD/source parity mismatch');
const list = value => (Array.isArray(value) ? value : []).map(item => ({
  key: typeof item === 'string' ? item : item.key ?? item.conceptKey ?? item.conditionKey,
  reason: typeof item === 'string' ? null : item.reason ?? null,
}));
for (const [side, row] of Object.entries(raw)) {
  const output = {
    ...Object.fromEntries(idFields.map(field => [field, row[field]])),
    l3: { problemTypeKey: null, status: 'HOLD', draftParentLabelKo: '다항식의 나눗셈',
      reason: 'The second division is primary, but source equations and answer cannot be certified.' },
    l3Challenge: true,
    crossConceptKeys: list(row.CrossConceptKeys ?? row.crossConceptKeys ?? row.crossConcepts),
    conditionKeys: list(row.ConditionKeys ?? row.conditionKeys ?? row.conditions),
    integrationPattern: row.IntegrationPattern ?? row.integrationPattern,
    sourceIssue: { key: 'SOURCE_HWP_EQUATION_UNVERIFIED_HOLD',
      reason: typeof row.sourceIssue === 'string' ? row.sourceIssue : row.sourceIssue?.reason ?? null },
    reviewStatus: 'HOLD', holdReason: row.holdReason ?? row.reviewReason ?? null,
    sourceEvidence: row.sourceEvidence ?? row.sourceMathEvidence ?? null,
    solutionEvidence: row.solutionEvidence ?? row.solutionMathEvidence ?? null,
    primaryMethod: row.primaryMethod ?? null, decisiveStep: row.decisiveStep ?? null,
    l4SkeletonEvidence: row.L4?.skeleton ?? row.l4?.skeleton ?? row.L4Skeleton ?? null,
    rawEvidenceFile: `poly-division-boundary/${files[side]}`,
    questionOnlyEvidenceFile: 'source-evidence/D-q114-question-only/physical-ledger.json',
  };
  if (!output.integrationPattern || !output.sourceIssue.reason || !output.l4SkeletonEvidence)
    throw new Error(`q114 ${side} item evidence incomplete`);
  fs.writeFileSync(path.join(checkpoint, `H1_STAGEA_LUNA_${side}_SOURCE_REPAIR_REREVIEW_Q114.jsonl`),
    JSON.stringify(output) + '\n');
}
console.log(JSON.stringify({ queueIndex: 114, sourceFingerprint: raw.A2.sourceFingerprint,
  adaptedSides: Object.keys(raw), hold: true }));
