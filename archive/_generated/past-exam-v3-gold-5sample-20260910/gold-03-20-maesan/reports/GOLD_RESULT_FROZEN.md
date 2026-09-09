# GOLD_RESULT_FROZEN — GOLD #3

## Identity

- `GOLD_RUN_ID`: `gold-03-20-maesan-20260910`
- `EXAM`: `20_매산고_2학기_기말_고1_기출`
- `START_SHA`: `3d6548596a3b38a7b8493ca8aa2b80ca55f099f7`
- `worktree`: `C:/Users/USER/Desktop/AP-------merge-taxonomy-wt`
- `sourcePath`: `C:/Users/USER/Desktop/AP_independent_review_20260909_125050/packages/20_매산고_2학기_기말_고1_기출_EXTERNAL_REVIEW/source/2020_매산고1_2기말.pdf`
- `sourceDocumentSha256`: `sha256:6c1d97b65a12db7a306e7406264d82bc654da95bd8abe90996c92b3f1100f7dd`
- `freshFreezeState`: `FROZEN_FAIL_CLOSED`
- `freshFreezeAt`: `2026-09-10T05:10:00+09:00`

The source SHA above is recorded from the original PDF. The rule-pack SHA is separately recorded in the calibration lock; the source PDF SHA is `sha256:6c1d97b65a12db7a306e7406264d82bc654da95bd8abe90996c92b3f1100f7dd`.

## Denominator and source inventory

- `denominator`: 20 source questions, 6 scanned pages.
- `included`: 20/20.
- `excluded`: 0.
- page map: q1–q4 page 1; q5–q8 page 2; q9–q12 page 3; q13–q15 page 4; q16–q18 page 5; q19–q20 page 6.
- source inventory status: `SOURCE_INVENTORY_FROZEN`.
- source identity map status: frozen and SHA-bound.

## Fresh coverage at freeze

| Axis | Fresh coverage | Status | Evidence |
|---|---:|---|---|
| full-page extraction accepted | 0/20 | `NOT_TESTED` / `NEEDS_WORK` | `run/extraction/reports/validation_summary.json` |
| source identity/page binding | 20/20 | `PASS` | `run/extraction/reports/source_inventory.json`, `source_identity_map.json` |
| source fidelity content/choices | 0/20 | `PENDING_REVIEW` | `run/extraction/reports/source_fidelity_evidence.json` |
| blind math solve | 0/20 | `NOT_REACHED` | no answer/solution candidate was manufactured |
| fresh answer | 0/20 | `NOT_REACHED` | extraction handoff remains vision-required |
| fresh student-facing solution | 0/20 | `NOT_REACHED` | extraction handoff remains vision-required |
| fresh metadata/classification | 0/20 | `NOT_REACHED` | candidate metadata is blank skeleton |

The extraction engine produced a 20-question full-page-first skeleton with 0 schema errors, but all 20 rows remain `contentSource=vision_required` and `choicesSource=vision_required` because no page-level Vision JSON was supplied. Blank answers/solutions are therefore pipeline-pending, not guessed values.

## Visual triage and solution visuals

- V1 required/optional/exempt: `NOT_TESTED` for 20/20 because source content/choice extraction did not complete.
- Source-only visual candidates observed during page inventory: q12 (five-region coloring diagram) and q19 (rational-function sketch); these are provisional and not a frozen V1 decision.
- V1 required: 0 frozen; V1 optional: 0 frozen; V1 exempt: 0 frozen.
- solution visual/SVG generated: 0.
- V2 artifact inspection: `NOT_REACHED`.
- No source crop was promoted as a candidate `image`; full-page evidence remains evidence-only.

## Canonical stage decisions

- `canonicalFirstBlocker`: `VISION_JSON_MISSING_OR_INCOMPLETE`.
- `canonicalFinalStage`: `SOURCE_INVENTORY_FROZEN / EXTRACTION_NEEDS_WORK`.
- `diagnosticFinalStage`: `DIAGNOSTIC_ONLY`; no semantic or render PASS is asserted.
- `FINAL_AUDIT`: `NOT_REACHED`.
- `U1`: `NOT_REACHED`; source-only packet was not sealed because extraction content/choices were absent.
- `U2`: `NOT_REACHED`; no artifact packet.
- `U3`: `NOT_REACHED`; no frozen V1/V2 artifacts or fresh solution.
- provider/review availability: `DIAGNOSTIC_ONLY`; no provider launch was authorized after the canonical extraction blocker.

## Defect surface

- builder defect: `VISION_JSON_MISSING_OR_INCOMPLETE` blocks source fidelity and all completion fields.
- solution defect: `NOT_TESTED` (no solution was written).
- classification defect: `NOT_TESTED` (blank candidate metadata only).
- SVG/visual defect: `NOT_TESTED`; no SVG was generated.
- render defect: six required cases are `NOT_TESTED` because there is no completed candidate.
- pipeline defect: the fresh route correctly fail-closed; `validate_final_candidates.py` cannot consume the extraction-only summary because it has no `items` array, so no false pre-promotion result was created.
- diagnostic source-condition note: an initial low-resolution read of q2 made `f(1)=1` look like `f(1)=10`; a post-freeze crop resolves the printed condition as `f(1)=1`, consistent with answer ①. No q2 source defect is retained.

## Required evidence paths

- calibration lock: `calibration/reference-sample-lock.json`
- target manifest: `calibration/target-manifest.json`
- source input inventory: `run/source_inventory_input.json`
- frozen source inventory: `run/extraction/reports/source_inventory.json`
- frozen identity map: `run/extraction/reports/source_identity_map.json`
- extraction candidate skeleton: `run/extraction/candidate/20_매산고_2학기_기말_고1_기출.candidate.js`
- extraction validation: `run/extraction/reports/validation_summary.json`
- source fidelity pending evidence: `run/extraction/reports/source_fidelity_evidence.json`
- full-page renders: `run/extraction/pages/page_p001.png` through `page_p006.png`
- render evidence: `NOT_CREATED` (all six cases `NOT_TESTED`)
- `node --check` on the fresh candidate skeleton: `PASS`.
- `npm --prefix archive/tools/past-exam-pipeline run check`: `PASS`.
- pipeline rule preflight: `PASS`, `rulePackSha=sha256:1337e44c4f650ff080b63961a0867009ab1b6e7dd667be7cd82347d12bf61f17`.

## OLD_VS_NEW

The fresh source/extraction state was frozen before this comparison. The external-review package is diagnostic-only and does not alter the fresh freeze.

### Diagnostic comparison after fresh freeze

- Old package JS SHA: `sha256:7c67b3c679444f7eed1b81f46b31bed2c9f80e304490b270a4bab6eca04ee8df`; old JS count 16.
- Old package included q1–q8, q10–q13, q15–q18; old package excluded q9, q14, q19, q20 as `REVIEW_NEEDED`.
- Fresh denominator is 20/20 included at source-inventory level. The old package’s 16-question candidate therefore cannot be treated as denominator-complete for this GOLD run.
- Old package q12 source image exists and decodes (`q12.png`, 295181 bytes); no old `solutionImage`/SVGs exist. Fresh V1 did not reach a typed decision, so this is a diagnostic asset observation only.
- Old q13 solution has a material arithmetic/logic inconsistency: it derives 42 before asserting the original answer 410, which is not a reproducible student solution.
- Old q16 answer field is `120` while its own solution computes `1680`; answer-conclusion parity is broken.
- Old q17 solution asserts the minimum distance as `sqrt(10)` via a named asymptotic/geometry claim without the needed extremum derivation; this is a graph/geometry solution-quality defect.
- Old q18 gives only a terse interval-count assertion for `g(t)+h(t)=4` and does not show the vertical/horizontal intersection cases; independent math evidence is insufficient.
- Old q9/q14/q19/q20 exclusion findings are preserved as diagnostic source-condition conflicts: q9 printed choices omit the direct count 41; q14 requested extrema are not attained under the printed strict two-intersection condition; q19’s printed rational graph does not determine the requested split; q20’s integer-pair count is unbounded without an additional bound on b.
- Old build reports claim structural/ZIP/PNG checks only and explicitly mark browser exam/solution/answer render review `NOT_PERFORMED_BY_BUILD_STAGE`; these are not current render PASS evidence.
