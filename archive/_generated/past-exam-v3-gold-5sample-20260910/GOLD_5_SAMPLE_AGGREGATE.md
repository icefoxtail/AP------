# Past Exam V3 GOLD 5-sample fresh-source burn-in

## Experiment identity

- `START_SHA`: `3d6548596a3b38a7b8493ca8aa2b80ca55f099f7`
- GOLD branch: `codex/past-exam-v3-gold-5sample-20260910`
- All five runs used the same START_SHA.
- Each run used isolated staging/run/evidence/render paths.
- Existing FAIL/HOLD package material was inspected only after each fresh result was frozen, and was never used as source, answer, solution, visual, taxonomy seed, or reviewer evidence.
- No production JS, DB, question-index, or production assets were modified.
- No pipeline/rule/taxonomy/validator/test changes were made during the five GOLD runs.

## Frozen run summary

| GOLD | Exam | Source denominator | Fresh extraction | Fresh solve/solution | V1/visual | First blocker | Diagnostic final stage | Result |
|---:|---|---:|---|---|---|---|---|---|
| 1 | 19 금당고 2학기 기말 | 25 | source inventory bound; content not accepted | 0/25 | not reached | `VISION_JSON_MISSING_OR_INCOMPLETE` | browser machine diagnostic | HOLD |
| 2 | 23 부영여고 2학기 중간 v2 | 21 | 21/21 source-only freeze; candidate not started | 0/21 | source-only | `REFERENCE_SAMPLE_LOCK_REQUIRED` | source-only post-freeze diagnostics | HOLD |
| 3 | 20 매산고 2학기 기말 | 20 | 20/20 | 20/20 | 20/20 triage | source q2/q9 preserved; machine/closure blocked | machine/static and render diagnostic | HOLD/DIAGNOSTIC_ONLY |
| 4 | 23 한영고 2학기 기말 | 21 | 21/21 | 21/21 | 4 source visuals + q13 SVG | q16 `choices: []` rejected by STATIC | machine checks | HOLD/DIAGNOSTIC_ONLY |
| 5 | 24 부영여고 2학기 중간 | 21 | 21/21 source freeze; content Vision absent | 0/21 | not reached | `VISION_JSON_MISSING_OR_INCOMPLETE` | extraction/metadata diagnostic | HOLD |

Canonical frozen result files:

- GOLD #1: `gold-01-19-geumdang/GOLD_RESULT_FROZEN.json`
- GOLD #2: `gold-02-23-buyeong-v2/reports/GOLD_RESULT_FROZEN.json`
- GOLD #3: `gold-03-20-maesan/child3-final/GOLD_RESULT_FROZEN.json`
- GOLD #4: `gold-04-23-hanyeong/GOLD_RESULT_FROZEN.json`
- GOLD #5: `gold-05-24-buyeong/fresh-05-corrected/GOLD_RESULT_FROZEN.json`

The complete pre-run 31-package inventory and the five-sample selection rationale are included in the companion appendix `GOLD_31_INVENTORY_SELECTION.md`. The appendix is a pre-run inventory of existing packages only; none of those old candidate payloads was used to build a fresh result.

## 1. Fresh extraction completion count

- Structural source inventory/full-page source evidence reached a frozen boundary: 5/5 runs. GOLD #1 recorded a 25-question source boundary, GOLD #2 froze 21/21 source identities in source-only mode, GOLD #3 froze 20/20, GOLD #4 froze 21/21, and GOLD #5 froze the corrected 21/21 source inventory.
- Fully validated fresh content/choices extraction: 2/5 (GOLD #3 and #4).
- GOLD #1 and #5 stopped content acceptance at missing page-level Vision input.
- GOLD #2 stopped before official candidate generation because calibration lock was not created.

## 2. All-question solve coverage

- Full fresh blind solve and fresh solution: 2/5 runs with complete candidate scope (GOLD #3 and #4, 20/20 and 21/21).
- GOLD #1: 0/25.
- GOLD #2: 0/21; no candidate was accepted.
- GOLD #5: 0/21 after extraction remained Vision-required.
- Completed fresh solve denominator across the five runs: 41 questions.

## 3. Solution generation coverage

- GOLD #3: 20/20 fresh answers and solutions.
- GOLD #4: 21/21 fresh answers and student-facing solutions.
- GOLD #1/#2/#5: no accepted fresh solution payload because source/candidate completion was blocked.
- Total completed fresh solutions: 41.
- No old solution was copied into a fresh candidate.

## 4. Visual triage and solution visual distribution

- GOLD #3: 20/20 visual triage; source visuals q12/q19; solution SVG drafts q8/q12/q14/q17/q18/q19/q20.
- GOLD #4: 21/21 builder visual triage; source visuals q1/q3/q6/q15; solution SVG q13.
- GOLD #1/#2/#5: source-dependent V1 semantic triage not reached or source-only only.
- Independent V1/V2/V3 semantic PASS: 0/5 runs.
- Fresh solution visual semantic PASS: 0; all visual outputs remained diagnostic/builder-only.

## 5. SVG generation and semantic status

- GOLD #3: q12/q19 source visual crops and solution visual drafts; semantic/render review pending.
- GOLD #4: q13 fresh solution SVG generated from frozen numeric facts; current parity input missing, so V2/artifact/render review not tested.
- GOLD #1/#2/#5: no fresh solution SVG reached.
- No old SVG was patched or reused.

## 6. Canonical first blockers

- GOLD #1: `VISION_JSON_MISSING_OR_INCOMPLETE` at full-page extraction.
- GOLD #2: `REFERENCE_SAMPLE_LOCK_REQUIRED`, technical cause `CALIBRATION_REQUIRES_2_OR_3_DISTINCT_SAMPLES`.
- GOLD #3: the fresh candidate was built, but deterministic final validation remained `NEEDS_WORK` because independent U1/U2/U3 evidence was absent and the legacy validator reported constructed-response/serialization diagnostics. q2/q9 are separate candidate-level source/choice conflicts.
- GOLD #4: `MACHINE_CHECK_FAILED:23_한영고_2학기_기말_고1_기출|16:STATIC:schema`.
- GOLD #5: `VISION_JSON_MISSING_OR_INCOMPLETE` at full-page extraction/source-fidelity handoff.

## 7. Diagnostic downstream reach

- GOLD #1 reached core preparation, machine-check failure on blank extraction, work-batch freeze HOLD, and six diagnostic browser captures.
- GOLD #2 reached source-only inventory/page rendering and post-freeze old comparison; official candidate generation was not reached.
- GOLD #3 reached fresh candidate, fresh solution/classification, visual triage, expected facts, machine/final validation diagnostics, and old comparison; provider/independent closure was not reached.
- GOLD #4 reached fresh candidate, source fidelity, fresh solution/classification, source visual repair, solution SVG build, machine-check failure, and old comparison; provider/render closure was not reached.
- GOLD #5 reached corrected source inventory, source identity map, 7-page render, and extraction skeleton; machine/final closure was not reached.

## 8. Repeated pipeline defects

### P1 choices helper also rejects constructed responses

The P1 helper was intentionally narrowed to image-only objective questions. However, the current implementation treats every `choices: []` as invalid unless the question is image-only objective. That rejects normal constructed-response rows whose source-faithful schema is `questionType: 서술형/단답형` with `choices: []`.

Observed in the fresh GOLD diagnostics:

- GOLD #4 q16
- GOLD #5's corrected run records the same constructed-response/choices boundary as a candidate-validator wrong-input-shape diagnostic; the canonical frozen report does not promote individual q19–q21 rows to a separate accepted candidate failure.

This is a repeated pipeline-level defect class. It must be repaired after the GOLD freeze by separating:

- normal objective choices contract;
- explicitly marked image-only objective exception;
- constructed-response `choices: []` contract.

The current GOLD run did not modify the helper.

### Constructed-response misclassification in legacy validation

GOLD #3/#4/#5 diagnostics also report that `validate_final_candidates` or related legacy validators classify numeric constructed responses as objective by default and then demand Vision choices. This should be reviewed together with the choices helper, but it was not modified during GOLD.

### Source inventory path binding ambiguity

GOLD #4 required rebinding from the pre-freeze inventory input to the generated frozen inventory so page evidence resolved under the fresh extraction root. This is a reproducible manifest/path contract hazard, but no pipeline change was made.

### Provider and staging render unavailability

All five runs were unable to produce independent provider-attested U1/U2/U3 closure. Render capture was also unavailable or diagnostic-only in the runs where the machine/freeze gate was not satisfied. These are recorded as environment/bridge gaps, not converted into semantic PASS.

## 9. Candidate-level defects

- GOLD #3 q2: direct fresh calculation gives `-154`, absent from printed choices.
- GOLD #3 q9: direct fresh enumeration gives `41`, absent from printed choices.
- GOLD #3 q19: hand-drawn graph/source visual requires independent semantic and crop review.
- GOLD #4 q12: source condition produces 10 valid functions, absent from supplied choices.
- GOLD #4 q16: source answer key conflicts with direct mathematics; fresh solution preserves the mathematical result and records the source conflict.
- GOLD #4 q13: fresh solution SVG exists, but current parity packet is missing; this is a visual-evidence/candidate closure defect, not a production asset.
- GOLD #5 initial 23-row inventory was corrected to 21 by fresh full-page inspection before final source freeze; the incorrect initial inventory remains diagnostic-only.
- GOLD #1 source content was not accepted because Vision extraction was absent; no candidate content defect was adjudicated.

## 10. Old-versus-new comparison

Comparisons were performed only after each fresh result was frozen.

- GOLD #1: semantic comparison not comparable because fresh content/solutions were never accepted.
- GOLD #2: old package had 13 questions versus 21 source questions and eight review-needed omissions; fresh official candidate was not created.
- GOLD #3: fresh run restored the full 20-question denominator, resolved q14/q20 rather than inheriting old exclusions, and recorded fresh q2/q9 source conflicts. Multiple old answer mismatches were identified diagnostically.
- GOLD #4: fresh run covered 21/21 versus old 20-question package, corrected the diagnostic q7 answer disagreement, preserved q12/q16 source defects, and added a fresh q13 solution SVG draft.
- GOLD #5: fresh source correction established 21 questions rather than the initial 23-row attempt; fresh source identity coverage was 21/21, but content/solution comparison remained blocked by missing Vision extraction.

Old packages remained comparison-only and were not used as seed data.

## 11. Software regression during GOLD

- No pipeline/rule/taxonomy/validator/test changes were made during the five GOLD runs.
- The P1 commit had already passed before the GOLD branch was created:
  - pipeline-core: PASS
  - past-exam-pipeline: PASS, 36/36
- New GOLD-specific regression count: 0, because the GOLD phase was explicitly mutation-free.

## 12. Final closure status

- `PASS_E2E`: 0/5
- `FAIL_PIPELINE`: not finalized during the GOLD phase; repeated pipeline observations are recorded for post-GOLD repair.
- `FAIL_CANDIDATE`: GOLD #3/#4 contain documented source/candidate defects, but remain diagnostic-only because independent closure was unavailable.
- `HOLD`: 5/5 canonical release outcomes remain HOLD/diagnostic-only.
- Production promotion: not attempted.

## 13. Repair candidates after GOLD freeze

The following are candidates for one bounded post-GOLD repair pass; none is applied in this commit:

1. Split choices validation by objective, image-only objective exception, and constructed-response empty choices.
2. Align legacy final-candidate validation with explicit questionType instead of numeric heuristics.
3. Make page-evidence path binding canonical between pre-freeze inventory and generated frozen inventory.
4. Provide a configured page-level Vision provider bridge and provider-attested FINAL_AUDIT runtime.
5. Provide an isolated staging render resolver that does not require a production write while preserving production engine behavior.
6. Add a current parity packet generator for fresh solution SVG expected facts.

These are not yet pipeline changes; they are the aggregate defect backlog from the five frozen GOLD runs.
