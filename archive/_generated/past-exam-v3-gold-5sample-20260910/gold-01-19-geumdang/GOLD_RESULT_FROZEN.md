# GOLD #1 — 19 금당고 2학기 기말 고1

## GOLD_RESULT_FROZEN

- `GOLD_RUN_ID`: `gold-01-19-geumdang`
- `EXAM`: `19_금당고_2학기_기말_고1_기출`
- `START_SHA`: `3d6548596a3b38a7b8493ca8aa2b80ca55f099f7`
- `SOURCE_PATH`: `gold-01-19-geumdang/source/2019_금당고_2기말.pdf`
- `SOURCE_SHA`: `sha256:546135392a1d56734147a198989e11b66c1736492d26e19c1d837816d131f816`
- `QUESTION_DENOMINATOR`: 25
- `INCLUDED`: 25
- `EXCLUDED`: 0
- `CANONICAL_STATUS`: `HOLD`
- `PRODUCTION_AUTHORIZED`: false

## Coverage

- RULE_PREFLIGHT: PASS
- S0.5 fresh calibration: PASS
- source inventory: 25/25, 4/4 pages
- fresh full-page extraction: not supplied; 25/25 manual-review skeleton rows
- source fidelity: not reached / no independent PASS
- blind solve: 0/25
- fresh answer: 0/25
- fresh student-facing solution: 0/25
- fresh classification: 0/25
- V1 visual triage: not reached
- solution visual/SVG: 0 generated
- V2 artifact inspection: not reached
- STATIC/METADATA machine evidence: canonical FAIL at q1 STATIC schema
- browser machine capture: 6/6 diagnostic captures generated from the blank extraction candidate; not semantic PASS
- work-batch freeze: `HOLD:WHOLE_JOB_MACHINE_CHECK_REQUIRED`
- provider FINAL_AUDIT: not reached
- U1/U2/U3: not reached
- independent render review: not reached
- targeted recheck: not reached

## Blockers and diagnostic continuation

Canonical first blocker:

`VISION_JSON_MISSING_OR_INCOMPLETE`

The V3 runner produced a source-backed full-page extraction skeleton, but no independently supplied page-level Vision payload was available for accepting content/choices. The downstream core preparation was still run against a separate fresh extraction-source file. The machine bridge recorded:

`MACHINE_CHECK_FAILED:19_금당고_2학기_기말_고1_기출|1:STATIC:schema`

The renderer was then run diagnostically. All six capture files were generated, but blank answer/solution/content fields make them diagnostic-only and do not qualify for semantic render PASS.

## V1 / visual

- `V1_REQUIRED`: not adjudicated
- `V1_OPTIONAL`: not adjudicated
- `V1_EXEMPT`: not adjudicated
- source visual crops: 0, because page-level Vision extraction did not reach validated visual bboxes
- solutionImage/SVG: none

## Defects

- `BUILDER_DEFECTS`: none adjudicated; builder content was not accepted
- `SOLUTION_DEFECTS`: not tested
- `CLASSIFICATION_DEFECTS`: not tested
- `SVG_DEFECTS`: not tested
- `RENDER_DEFECTS`: blank-candidate diagnostic only; no semantic verdict
- `PIPELINE_OBSERVATIONS`: the current V3 path is fail-closed when page-level Vision input is missing; core machine/freeze cannot proceed without accepted content, answer, and solution fields
- `ENVIRONMENT`: no page-level Vision provider payload was available in this task context

## Old-versus-new

No semantic OLD_VS_NEW comparison is claimed. The existing external-review package was not used as source, answer, solution, visual, metadata, or reviewer seed. A comparison can only cover the fresh result boundary above; semantic axes remain `NOT_COMPARABLE` because the fresh candidate never passed extraction.

## Evidence paths

- `output/reports/validation_summary.json`
- `output/reports/source_inventory.json`
- `output/reports/source_identity_map.json`
- `core-run-v3/run.json`
- `machine-check-result.json`
- `freeze-result.json`
- `render-result-v1.json`
- `render-v1/candidate-0-exam-desktop.json`
- `render-v1/candidate-0-exam-mobile.json`
- `render-v1/candidate-0-solution-desktop.json`
- `render-v1/candidate-0-solution-mobile.json`
- `render-v1/candidate-0-answer-desktop.json`
- `render-v1/candidate-0-answer-mobile.json`

No commit or push was performed by this GOLD run.
