#!/usr/bin/env node
/** Adapt current q241 A2/B/C post-solution reruns to Stage A queue 51-1170. */
import fs from 'node:fs';
import path from 'node:path';

const checkpoint = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const dir = path.join(checkpoint, 'l4-quadratic-discriminant');
const one = name => {
  const rows = fs.readFileSync(path.join(dir, name), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  if (rows.length !== 1) throw new Error(`q241 expected one row ${name}`);
  return rows[0];
};
const files = { A2: 'H1_A2_QDISC_Q241_POST_SOL.jsonl',
  B2: 'H1_B_QDISC_Q241_POST_SOL.jsonl', C2: 'H1_C2_QDISC_Q241_POST_SOL.jsonl' };
const raw = Object.fromEntries(Object.entries(files).map(([side, file]) => [side, one(file)]));
const sol = JSON.parse(fs.readFileSync(path.join(checkpoint,
  'H1_SOL_Q241_MISSING_ROOT_BRANCH_CORRECTION.json'), 'utf8'));
const idFields = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash'];
for (const field of idFields) if (!raw.A2[field] || raw.A2[field] !== raw.B2[field]
  || raw.A2[field] !== raw.C2[field]) throw new Error(`q241 A/B/C ${field} mismatch`);
if (raw.A2.queueIndex !== 241 || raw.A2.questionUid !== sol.questionUid
  || raw.A2.sourceIdentity !== sol.sourceIdentity
  || raw.A2.sourceFingerprint !== sol.sourceFingerprintAfter
  || Object.values(raw).some(row => row.reviewStatus !== 'PASS'))
  throw new Error('q241 current corrected-source PASS gate mismatch');
const keyList = value => (Array.isArray(value) ? value : []).map(item => ({
  key: typeof item === 'string' ? item : item.key ?? item.conceptKey ?? item.conditionKey,
  reason: typeof item === 'string' ? null : item.reason ?? null,
}));
for (const [side, row] of Object.entries(raw)) {
  const parent = side === 'A2' ? row.currentL3Key
    : side === 'B2' ? row.currentL3Assessment?.problemTypeKey
      : row.L3ParentAssessment?.problemTypeKey;
  if (parent !== 'PT_H1_QUADRATIC_DISCRIMINANT') throw new Error(`q241 ${side} L3 mismatch`);
  const output = {
    ...Object.fromEntries(idFields.map(field => [field, row[field]])),
    l3: { problemTypeKey: parent, status: 'CONFIRMED_CURRENT',
      reason: side === 'A2' ? row.currentL3Fit?.reason
        : side === 'B2' ? row.currentL3Assessment?.reason : row.L3ParentAssessment?.reason },
    l3Challenge: false,
    crossConceptKeys: keyList(row.CrossConceptKeys ?? row.crossConceptKeys),
    conditionKeys: keyList(row.ConditionKeys ?? row.conditionKeys),
    integrationPattern: row.IntegrationPattern ?? row.integrationPattern,
    sourceIssue: { key: 'NONE', reason: typeof row.sourceIssue === 'string'
      ? row.sourceIssue : row.sourceIssue?.reason ?? null },
    reviewStatus: 'PASS', holdReason: null,
    sourceEvidence: row.sourceEvidence ?? row.sourceMathEvidence ?? null,
    solutionEvidence: row.solutionEvidence ?? row.solutionMathEvidence ?? null,
    primaryMethod: row.primaryMethod ?? null, decisiveStep: row.decisiveStep ?? null,
    rawEvidenceFile: `l4-quadratic-discriminant/${files[side]}`,
    correctionEvidenceFile: 'H1_SOL_Q241_MISSING_ROOT_BRANCH_CORRECTION.json',
  };
  if (!output.integrationPattern || !output.sourceIssue.reason || !output.sourceEvidence
    || !output.solutionEvidence) throw new Error(`q241 ${side} item evidence incomplete`);
  const target = `H1_STAGEA_LUNA_${side}_SOURCE_REPAIR_REREVIEW_Q241_POST_SOL.jsonl`;
  fs.writeFileSync(path.join(checkpoint, target), JSON.stringify(output) + '\n');
}
console.log(JSON.stringify({ queueIndex: 241, sourceFingerprint: raw.A2.sourceFingerprint,
  adaptedSides: Object.keys(raw), status: 'PASS' }));
