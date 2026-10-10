# Archive CI 15-failure remediation — 2026-10-10

## Baseline and final state

- User-supplied baseline: `0f072b68e919b129d561752267c31ddf957260f6`, CI `PASS 204 / FAIL 15`.
- Rechecked main before changes: `1ba22c805c9fc4b144b5670d414964ee73d3521d`, run [37984030467](https://github.com/icefoxtail/AP------/actions/runs/37984030467), still `PASS 204 / FAIL 15`.
- Main advanced during the task to `f8aaede951fb097b14d2a271ef46a3910ae2d860`, run [38002031742](https://github.com/icefoxtail/AP------/actions/runs/38002031742), with the same 15 failures.
- Remediation commit `6352dab9b547f075789192d282468d2321ed740f` passed GitHub CI [38003072865](https://github.com/icefoxtail/AP------/actions/runs/38003072865), Archive2 Runtime Guard [38003072778](https://github.com/icefoxtail/AP------/actions/runs/38003072778), Problem Bank Shared Meta [38003072772](https://github.com/icefoxtail/AP------/actions/runs/38003072772), and Archive Registration Sync [38003072832](https://github.com/icefoxtail/AP------/actions/runs/38003072832).
- Registration Sync produced generated-only main commit `a8c5c64028a5d38628fa920787e0549191cc9bcf` (`[skip ci]`). On that exact tree, local `node tools/run-tests.js` completed `PASS 219 / FAIL 0 / KNOWN-FAIL 0`; it reported the same eight pre-existing quarantined files excluded by the repository default. `node tools/check-archive2-runtime.cjs` passed `42/42`.

## Failure-by-failure record

| Failing test | Cause and correction | Affected source/evidence and verification |
|---|---|---|
| `archive-inline-view-label.test.js` | 34 inline view-label violations treated labels embedded in sentences as view blocks. Changed only those inline labels to plain `보기`; standalone `<보기>` blocks remain. | 26 original exam JS files plus fixture q21; catalog and canonical input manifest rebuilt with `node archive/tools/build-archive2-catalog.mjs`. Lint now reports zero violations across 572 files / 13,540 questions; test `3/3` passes. |
| `archive2-compose-scope.test.js` | The test required a selectable M3 `삼각비` item even though canonical rows exist but all are source-release HOLD. Updated the test to preserve parent-mapping and eligibility gates and assert the canonical hold state when a unit has no eligible row. | `tests/archive2-compose-scope.test.js`; no eligibility, sourceHold, or pack gate was changed. `31/31` passes. |
| `m2-o11-create-gate-manual.test.js` | 21_연향중 CREATE evidence had stale exam and Golden bindings after source changes. Verified all Golden sample solution hashes, excerpts, observations, and negative sample; corrected q3/q12/q17 solution defects and closed changed loci with current-source R1 receipts. | `21_연향중_1학기_중간_중2_기출.js`, CREATE physical evidence and durable R1 receipts. Canonical CREATE gates pass; no item HOLD. |
| `m2-o15-create-gate-manual.test.js` | 19_연향중 physical evidence exam SHA was stale; q5–q8 Meta changes were reviewed and q9 has no safe active subunit mapping. Kept q9 as a justified Meta HOLD. | `19_연향중_1학기_중간_중2_기출.js`, evidence and durable R1 receipt. Gate returns `PASS_WITH_ITEM_HOLDS` for q9. |
| `m2-o26-create-gate-manual.test.js` | 24_연향중 physical evidence SHA was stale after reviewed solution/Meta changes. Preserved the original q20 answer freeze and separate post-freeze adjudication. | `24_연향중_1학기_기말_중2_기출.js`, evidence, durable R1 receipt. Canonical gates pass with no item HOLD. |
| `m2-o27-create-gate-tempcreate1.test.js` | 24_승평중 physical evidence SHA was stale after solution/Meta edits. R1 checked all 24 answers and opened/bound four referenced images; prior q12 pixel observation was corrected from current pixels without changing source. | `24_승평중_1학기_기말_중2_기출.js`, evidence, durable R1 receipt. Canonical gates pass with no item HOLD. |
| `m2-o28-create-gate-thanos1.test.js` | 24_삼산중 evidence SHA was stale. R1 found q9/q19/q22 mapped to the wrong current subunit; corrected each to active `M2-04-LINEAR_FUNCTION_BASIC`. q14’s preflight warning is a false positive because choices are embedded in the opened PNG; its independent freeze and image evidence are preserved. | `24_삼산중_1학기_기말_중2_기출.js`, evidence, durable R1 receipts and preserved failed-validator capture. Canonical gates pass; no item HOLD. |
| `m2-o32-create-gate-thanos5.test.js` | 23_신흥중 evidence SHA was stale after three Meta-only source changes. Current fields match active canonical records; exact student/asset parity was confirmed. | `23_신흥중_1학기_기말_중2_기출.js`, evidence, durable R1 receipt. Canonical gates pass with no item HOLD. |
| `m2-o33-create-gate-thanos5.test.js` | O33 22_왕운중 had a separate exam SHA mismatch and a q14 answer/solution defect. R1 found q14’s stored answer wrong; CREATE corrected it after calibration preflight, then current-source R1 confirmed the correction. | `22_왕운중_1학기_기말_중2_기출.js`, evidence and consolidated R1 receipt. Canonical gates pass with no item HOLD. |
| `m2-o34-create-gate-tempcreate1.test.js` | 22_연향중 evidence SHA was stale after solution edits. R1 independently reviewed the six changed solutions with complete input. q19 lacks the four ㉠–㉣ function definitions in both source and image, so its answer/solution remain unreviewed under `SOURCE_HOLD`. | `22_연향중_1학기_기말_중2_기출.js`, evidence and durable scoped R1 receipt. Gate returns `PASS_WITH_ITEM_HOLDS` for q19. Original page requested; none was available in the assigned repository/worktree. |
| `m2-temp-create3-o25-create-gate.test.js` | 24_왕운중 evidence SHA was stale; R1 found q13’s Meta key incorrect and q15’s solution lacked an exhaustive bound. Corrected q13 to the active relation key and added the minimum proof `x≥1 ⇒ 3x≥3 ⇒ 4y≤20 ⇒ y≤5`, then performed same-session R1 correction review. | `24_왕운중_1학기_기말_중2_기출.js`, evidence and current-source R1 receipts. Canonical gates pass with no item HOLD. |
| `m2-temp-create4-o29-create-gate.test.js` | 24_금당중 evidence SHA was stale. R1 reviewed 23 changed solution loci; q24’s current student text asks for equal triangle areas while `AD∥BC` and `AO:OC=3:5` imply area ratio `9:25`. The original page was unavailable, so q24 remains `SOURCE_HOLD` and its stored answer/solution were not compared. | `24_금당중_1학기_기말_중2_기출.js`, evidence and durable R1/source-hold receipts. Gate returns `PASS_WITH_ITEM_HOLDS` for q24. Original page requested; none was available in the assigned repository/worktree. |
| `meta-foundation-derivative-runtime.test.js` | Four derivative records were excluded by the existing full-payload fingerprint/sourceRelease gate. Kept them held; updated runtime pack, source-readiness receipt, and tested count from 257 to 253. | Derivative runtime pack and bridge receipt; affected qids/source identities are recorded in the test/evidence. SourceHold count is 67. Test passes; no gate relaxation. |
| `meta-foundation-integral-calculus-runtime.test.js` | Three integral records were excluded by the same existing fingerprint/sourceRelease gate. Kept them held; updated runtime pack, receipt, and tested count from 124 to 121 (one supplementary row remains). | Integral runtime pack and bridge receipt; affected qids/source identities are recorded in the test/evidence. SourceHold count is 4. Test passes; no gate relaxation. |
| `tests/archive2-worker-runtime.mjs` | The 50-question fixture selected only the first high1/2022 course’s four eligible records, then requested a count of 50. Rebuilt the fixture from 50 approved automatic records across the course pool and set the request count from the actual fixture length. Worker canonical metadata, source identity, and D1 bind checks remain unchanged. | `tests/archive2-worker-runtime.mjs`; syntax check and workerd+D1 runtime pass, including the 50-question persistence scenario. |

## Additional runtime issue found during official regeneration

`rebuild-reviewed-runtime.mjs` was appending 33 source-HOLD M1-06 repair overrides into the out-of-scope MIDDLE_GEOMETRY pack, producing 961 records instead of the canonical 928. Added a fail-closed projection rule and regression test: held overrides are not appended; in-scope existing holds are preserved; out-of-scope existing rows are removed; verified source repairs retain prior behavior. No test expectation, pack declaration, or override record was altered. Official regeneration restored MIDDLE1=594, FUNCTIONS_GRAPHS=523, MIDDLE_GEOMETRY=928, and the bridge to 5,375 unique records/source identities with zero join mismatches.

## Current item holds and gates

- `19_연향중` q9: Meta projection HOLD because no active exact subunit mapping is available.
- `22_연향중` q19: SOURCE_HOLD because ㉠–㉣ function definitions are missing from the student source and image.
- `24_금당중` q24: SOURCE_HOLD because the supplied statement is internally inconsistent; original-page verification is required.
- The three CREATE gates return `PASS_WITH_ITEM_HOLDS` with complete evidence. No answers/solutions were inferred for the two source-held questions. The two missing original pages remain requested from the user.
- Every one of the ten M2 gates passed after official source-refresh writes and individual `--check`s. The writer unit test passes.

## Verification performed locally

- `node tools/run-tests.js`: `PASS 219 / FAIL 0 / KNOWN-FAIL 0` (the default runner continues to report the same eight pre-existing quarantined files; no quarantine/skip rules were changed).
- `node tools/check-archive2-runtime.cjs`: `42/42` passed.
- `node archive/tools/build-archive2-catalog.mjs --check`: pass.
- `node archive/tools/meta-foundation/rebuild-reviewed-runtime.mjs --check`: pass.
- `node archive/tools/meta-foundation/refresh-runtime-source-readiness.mjs --check`: pass; combined 5,375 unique UIDs/source identities, zero mismatch.
- Targeted inline-label, M3 compose-scope, derivative, integral, Worker+D1, Middle Geometry, source-hold projection, and ten M2 CREATE gate tests passed.
