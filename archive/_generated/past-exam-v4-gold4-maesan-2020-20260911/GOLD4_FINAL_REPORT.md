# GOLD4 fresh pilot — 2020 매산고 고1 2학기 기말

- START_SHA: `dad8db900c24c5cc6901db736baa569068953968`
- Branch: `codex/past-exam-v4-gold4-maesan-2020-20260911`
- Denominator: 20 questions / 6 pages; source `PDF`, pixel render available, GOLD eligible.
- Requested/recorded builder route: `gpt-5.6-luna` + `xhigh` (`builderModelOrAgent: gpt-5.6-luna/xhigh`). Provider actual route was not observed because the whole-job freeze did not complete; `MODEL_ROUTE_PARITY=FAIL`.

## Stage result

The canonical stage-by-stage status is in `gold4-stage-status.json`. In short:

- RULE_PREFLIGHT, calibration, quality profile, target-baseline review, and source inventory: PASS.
- Full-page extraction/source fidelity: HOLD on `VISION_JSON_MISSING_OR_INCOMPLETE`; fresh 6-page PNGs and 20/20 frozen source identities exist.
- Builder/solution/classification/visual fact stages: HOLD/BLOCK; no answers, solutions, or visual facts were guessed.
- Static/metadata: FAIL because the candidate remained an explicit vision/external-agent skeleton. Browser machine capture reached all six cases and PASSed runtime, MathJax, image decode, question count, last question, clipping, and overflow; readability remained `NOT_TESTED`.
- Final audit/provider: HOLD before reservation with `WHOLE_JOB_FREEZE_REQUIRED`; final valid-authority freeze attempt also recorded `NON_JSON_VALUE` and left the batch in HOLD. No targeted recheck, promotion, DB/index update, or production write occurred.

## q9 / q12 / q15 / q19 source finding

Fresh source pages bind q9 and q12 to page 3, q15 to page 4, and q19 to page 6. q12’s five-region figure and q19’s multi-part rational-graph illustration remain visual review inputs. A partial Vision JSON containing only these four questions was rejected with `SOURCE_INVENTORY_PAGE_COVERAGE_FAIL`; the current pipeline does not silently remap partial q-number results into the candidate.

## Previous GOLD2 blocker

The previous blocker was reproduced as an extraction hold when fresh page-level Vision JSON was absent. The pipeline now also demonstrates that post-start `origin/main` movement is handled as a frozen-authority concern: the final calibration lock uses `dad8db900...`; later live drift would be `POST_START_MAIN_ADVANCE`, not `CALIBRATION_MAIN_STALE`. This pilot did not reach a valid sealed audit, so the previous blocker is not fully production-resolved.

## Production / Git

Protected production paths `archive/exams`, `archive/assets`, `archive/db.js`, and `archive/question-index.js` were not touched. All outputs are staging/runtime evidence only. The final commit SHA and push result are recorded in the final response and Git metadata; this report was prepared before the single commit.
