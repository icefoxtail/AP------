import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const v3 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v3_independent_batch_01.json'), 'utf8'));
const invalidation = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_artifact_evidence_invalidation.json'), 'utf8'));
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const invalidationByUid = new Map(invalidation.entries.map((entry) => [entry.questionUid, entry]));

const entries = v3.entries.map((entry) => {
  const invalid = invalidationByUid.get(entry.questionUid);
  if (entry.parityStatus === 'PASS') {
    return {
      questionUid: entry.questionUid,
      adjudicationStatus: 'CANDIDATE_NOT_C_ITEM_PASS',
      reason: 'V1/V2 canonical family parity is present, but full typed expected/observed semantic facts and item gate evidence are not frozen for this batch.',
      nextAction: 'BUILD_TYPED_EXPECTED_AND_OBSERVED_FACTS_THEN_RUN_ITEM_SEMANTIC_GATE',
      cDenominatorStatus: invalid?.cDenominatorStatusAfterChange ?? 'REVIEW_REQUIRED'
    };
  }
  const q14ExemptConflict = entry.expectedVisualType === 'NONE' && entry.observedVisualType !== 'NONE';
  return {
    questionUid: entry.questionUid,
    adjudicationStatus: 'FAIL_ADJUDICATION_REQUIRED',
    reason: q14ExemptConflict ? 'V1 source-only exemption conflicts with an attached observed artifact; resolve visualRequirement/action parity before any C review.' : 'V1 expected visual family and V2 observed visual family differ.',
    nextAction: q14ExemptConflict ? 'ADJUDICATE_V1_REQUIREMENT_AND_REMOVE_OR_REBUILD_INVALID_LINKAGE' : 'REOBSERVE_OR_REBUILD_ARTIFACT_UNDER_CANONICAL_VISUAL_TYPE',
    cDenominatorStatus: invalid?.cDenominatorStatusAfterChange ?? 'REVIEW_REQUIRED'
  };
});

const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_2022_SET_PILOT_BATCH_01_ADJUDICATION',
  status: 'FAIL_ADJUDICATION_REQUIRED_NOT_RELEASED',
  v3PassCount: v3.passCount,
  v3FailCount: v3.failCount,
  cItemPassCount: 0,
  productionMassEditAuthorized: false,
  denominatorMayBeReused: false,
  entries,
  reportSha: sha256(JSON.stringify(entries))
};
fs.writeFileSync(path.join(OUT, 'phase2_batch_01_adjudication.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const markdown = [
  '# 2022 집합 Phase 2 batch 01 adjudication',
  '',
  `- 상태: **${output.status}**`,
  `- V3 parity: **${output.v3PassCount} PASS / ${output.v3FailCount} FAIL**`,
  `- C item PASS 승격: **${output.cItemPassCount}**`,
  `- production mass edit authorized: **${output.productionMassEditAuthorized}**`,
  `- denominator reuse: **${output.denominatorMayBeReused}**`,
  `- report SHA: \`${output.reportSha}\``,
  '',
  ...entries.map((entry) => `- ${entry.questionUid}: **${entry.adjudicationStatus}** — ${entry.nextAction}`),
  '',
  'q20은 family parity 후보일 뿐 typed semantic item gate 전이다. q17과 q14는 adjudication/재관찰이 끝나기 전에는 PASS로 승격하지 않는다.',
  ''
].join('\n');
fs.writeFileSync(path.join(OUT, 'phase2_batch_01_adjudication.md'), markdown, 'utf8');
console.log(JSON.stringify({ status: output.status, v3PassCount: output.v3PassCount, v3FailCount: output.v3FailCount, cItemPassCount: output.cItemPassCount, reportSha: output.reportSha }, null, 2));
