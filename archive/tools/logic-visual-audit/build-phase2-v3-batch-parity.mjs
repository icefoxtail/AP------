import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const v1 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v1_independent_batch_01_rule_bound.json'), 'utf8'));
const v2 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v2_independent_batch_01_typed.json'), 'utf8'));
const batch = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_2022_pilot_repair_batch_01.json'), 'utf8'));
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const v2ByUid = new Map(v2.entries.map((entry) => [entry.questionUid, entry]));
const batchByUid = new Map(batch.results.map((entry) => [entry.questionUid, entry]));
const blindContractErrors = [];
if (v1.priorReviewVisibility !== 'NONE' || v2.priorReviewVisibility !== 'NONE') blindContractErrors.push('PRIOR_REVIEW_VISIBILITY_NOT_NONE');
if (v1.status !== 'PASS_SOURCE_ONLY_TRIAGE' || v2.status !== 'PASS_ARTIFACT_OBSERVATION_READY') blindContractErrors.push('V1_OR_V2_STATUS_NOT_READY');
if (v1.reviewerSessionId && v2.reviewerSessionId && v1.reviewerSessionId === v2.reviewerSessionId) blindContractErrors.push('V1_V2_SESSION_COLLISION');
if (v1.entries.some((entry) => entry.observedFact || entry.expectedFact) || v2.entries.some((entry) => entry.expectedFact || entry.sourceContent)) blindContractErrors.push('CROSS_AXIS_FACT_VISIBILITY_LEAK');

const entries = v1.entries.map((expected) => {
  const observed = v2ByUid.get(expected.questionUid);
  const batchEntry = batchByUid.get(expected.questionUid);
  const expectedType = expected.visualType;
  const observedType = observed?.observedVisualTypeOrUnknown ?? 'UNKNOWN';
  const typeParity = expectedType !== 'NONE' && expectedType === observedType;
  const attachmentRequired = expected.expectedVisualRequirementSignal === 'SHOULD_BE_REQUIRED';
  const artifactAttached = Boolean(batchEntry?.solutionImage);
  const issues = [];
  if (!observed) issues.push('missingV2Observation');
  if (v2.status !== 'PASS_ARTIFACT_OBSERVATION_READY' || observed?.semanticExtractionStatus !== 'OBSERVATION_SUFFICIENT') issues.push('v2ObservationNotReady');
  if (!typeParity) issues.push(`canonicalVisualTypeMismatch:${expectedType}->${observedType}`);
  if (attachmentRequired && !artifactAttached) issues.push('requiredVisualArtifactMissing');
  if (blindContractErrors.length) issues.push(...blindContractErrors);
  return {
    questionUid: expected.questionUid,
    expectedSignal: expected.expectedVisualRequirementSignal,
    expectedVisualType: expectedType,
    observedVisualType: observedType,
    artifactAttached,
    parityStatus: issues.length ? 'FAIL' : 'PASS',
    issues,
    v1Rationale: expected.rationale,
    v2ExtractionStatus: observed?.semanticExtractionStatus ?? 'MISSING',
    observedArtifactSha256: observed?.observedArtifactSha256 ?? null,
    action: issues.length ? 'SEMANTIC_ADJUDICATION_REQUIRED' : 'CANDIDATE_FOR_ITEM_GATE'
  };
});

const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_2022_SET_PILOT_V3_BATCH_01',
  reviewerRole: 'V3_PARITY',
  priorReviewVisibility: 'V1_V2_FROZEN_ONLY',
  comparedCount: entries.length,
  passCount: entries.filter((entry) => entry.parityStatus === 'PASS').length,
  failCount: entries.filter((entry) => entry.parityStatus === 'FAIL').length,
  blockedCount: entries.filter((entry) => entry.parityStatus === 'BLOCKED').length,
  freshBlindContract: { status: blindContractErrors.length ? 'FAIL' : 'PASS', errors: blindContractErrors },
  status: entries.every((entry) => entry.parityStatus === 'PASS') && blindContractErrors.length === 0 ? 'PASS' : 'FAIL',
  v1ReportSha: sha256(JSON.stringify(v1)),
  v2ReportSha: sha256(JSON.stringify(v2)),
  entries,
  note: 'V3 parity compares frozen canonical visual families. It does not approve production release or replace C/D gates.',
  reportSha: sha256(JSON.stringify(entries))
};
fs.writeFileSync(path.join(OUT, 'phase2_v3_independent_batch_01.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const markdown = [
  '# 2022 집합 Phase 2 V3 batch 01',
  '',
  `- 상태: **${output.status}**`,
  `- 비교: **${output.comparedCount}**`,
  `- parity PASS: **${output.passCount}**`,
  `- parity FAIL: **${output.failCount}**`,
  `- report SHA: \`${output.reportSha}\``,
  '',
  ...entries.map((entry) => `- ${entry.questionUid}: **${entry.parityStatus}** — ${entry.expectedVisualType} → ${entry.observedVisualType}${entry.issues.length ? ` (${entry.issues.join(', ')})` : ''}`),
  '',
  'V3 PASS 후보는 별도 item semantic gate, denominator freshness, qualification render, Common Core C/D binding을 추가로 통과해야 한다.',
  ''
].join('\n');
fs.writeFileSync(path.join(OUT, 'phase2_v3_independent_batch_01.md'), markdown, 'utf8');
console.log(JSON.stringify({ status: output.status, comparedCount: output.comparedCount, passCount: output.passCount, failCount: output.failCount, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS') process.exitCode = 1;
