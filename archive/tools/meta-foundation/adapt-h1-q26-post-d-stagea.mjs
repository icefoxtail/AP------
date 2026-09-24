#!/usr/bin/env node
/** Preserve independent post-repair q26 judgments in the first-50 Stage A schema. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const poly = path.join(dir, 'poly-division-boundary');
const read = file => JSON.parse(fs.readFileSync(path.join(poly, file), 'utf8').trim());
const aFile = 'H1_A2_Q026_STAGEA_POST_D_RAW.jsonl';
const bFile = 'H1_B_Q026_STAGEA_POST_D_RAW.jsonl';
const cFile = 'H1_C2_Q026_POST_D.jsonl';
const [a, b, c] = [aFile, bFile, cFile].map(read);
const identity = ['queueIndex', 'questionUid', 'sourceIdentity', 'sourceFingerprint', 'contentHash', 'solutionHash'];
for (const key of identity) {
  if (a[key] !== b[key] || a[key] !== c[key]) throw new Error(`q26 independent identity mismatch: ${key}`);
}
if (a.queueIndex !== 26 || a.reviewStatus !== 'HOLD' || b.reviewStatus !== 'PASS' || c.reviewStatus !== 'HOLD')
  throw new Error('q26 post-D source assessment changed; inspect raw evidence');
const base = Object.fromEntries(identity.map(key => [key, a[key]]));
function write(file, record) {
  fs.writeFileSync(path.join(dir, file), JSON.stringify(record) + '\n');
}
write('H1_STAGEA_LUNA_A_SOURCE_REPAIR_REREVIEW_Q026.jsonl', {
  ...base, problemTypeKey: a.L3.activeKey,
  draftProblemTypeLabelKo: a.L3.boundedCandidate,
  crossConceptKeys: a.CrossConceptKeys,
  conditionKeys: [], conditionReason: a.ConditionKeys.reason,
  integrationPattern: a.IntegrationPattern,
  sourceIssue: { key: 'SOURCE_UNRESOLVED_HOLD', reason: a.sourceIssue },
  reviewStatus: a.reviewStatus, holdReason: a.reviewReason,
  sourceEvidence: a.sourceEvidence, solutionEvidence: a.solutionEvidence,
  primaryMethod: a.primaryMethod, decisiveStep: a.decisiveStep,
  rawEvidenceFile: `poly-division-boundary/${aFile}`,
});
write('H1_STAGEA_LUNA_B_SOURCE_REPAIR_REREVIEW_Q026.jsonl', {
  ...base, problemTypeKey: b.l3.problemTypeKey,
  draftProblemTypeLabelKo: b.l3.draftParentLabelKo,
  crossConceptKeys: b.crossConcepts,
  conditionKeys: b.conditions, conditionReason: b.conditionsReason,
  integrationPattern: b.integrationPattern,
  sourceIssue: b.sourceIssue,
  reviewStatus: b.reviewStatus, holdReason: b.holdReason,
  sourceEvidence: b.sourceMathEvidence, solutionEvidence: b.solutionMathEvidence,
  primaryMethod: b.primaryMethod, decisiveStep: b.decisiveStep,
  rawEvidenceFile: `poly-division-boundary/${bFile}`,
});
write('H1_STAGEA_LUNA_C_POST_D_Q026.jsonl', {
  ...base, l3IndependentJudgment: { recommendedPrimaryKey: c.curriculumL3.equivalentActiveKey ?? null,
    draftParentLabelKo: c.curriculumL3.parentLabelKo, reason: c.curriculumL3.reason },
  crossConceptKeys: c.CrossConceptKeys.map(({ conceptKey, reason }) => ({ key: conceptKey, reason })),
  conditionKeys: c.ConditionKeys.keys,
  integrationPattern: c.IntegrationPattern,
  sourceIssue: { key: 'SOURCE_UNRESOLVED_HOLD', reason: c.sourceIssue.reason },
  reviewStatus: c.reviewStatus, holdReason: c.reviewStatusReason,
  sourceEvidence: c.sourceMathEvidence, solutionEvidence: c.solutionMathEvidence,
  primaryMethod: c.primaryMethod, decisiveStep: c.decisiveStep,
  rawEvidenceFile: `poly-division-boundary/${cFile}`,
});
console.log(JSON.stringify({ queueIndex: 26, sourceFingerprint: a.sourceFingerprint,
  a: a.reviewStatus, b: b.reviewStatus, c: c.reviewStatus }));
