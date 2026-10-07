# Archive stage hardening — 2026-10-08

User-authorized scope: CREATE preflight, common evidence/freeze binding, stable completion events after the three-exam H1 final pilot.

## Implemented

- `archive-create-preflight.mjs`: actual HOLD count/reason reconciliation, damaged TeX candidates, bare math environments and explicit simple final-value/choice-marker mismatches. It never edits source or decides mathematical truth. Valid source HOLDs carry through CREATE/R1/R2; R3 rejects an unresolved itemStatus HOLD.
- `archive-codex-stage-kit.mjs`: actual raw/blob/clean-filter SHA and solution-hash binding; only explicitly recorded continuity fields are lifted. Missing review is not turned into PASS. Original full-qid blind freeze writes exclusively; corrections are separate SHA-bound adjudication records.
- Generic CODEX raw reports now include actual source/evidence/assets `technicalBinding`. Fresh completion events bind these bytes, the raw report and declared extra proofs. ROOT intake verifies the delivered event SHA and current bytes before consuming the existing stage gate and returning next stage/freed slot/next roster. File changes invalidate old events. Stage PASS does not imply RENDER_PASS or MAIN_DONE.
- CREATE/R1/R2/R3 role instructions and CURRENT/maintenance documentation point to the implemented CLI. Historical valid unchanged receipt reuse remains supported without mandatory quality reruns for the new event format.
- Canonical closeout Git reads use tree object IDs and cat-file with a 128 MiB buffer, avoiding deep Unicode revision:path stat failures and the default small child buffer.

## Verification

- Existing stage/artifact/closeout/RPM/runtime-routing suite: 46 PASS after correcting an obsolete numeric legacy-level fixture to the current valid `중` value. Numeric level rejection is explicitly retained. Final toolkit suite: 8 PASS, including the added ROOT stable-event consumer, immutable originals, post-seal mutation rejection, marker/TeX/HOLD diagnostics, and long Unicode Git paths with >1 MiB blobs.
- Runtime guard initially failed on two already-stale canonical manifest digests for `question_identity_map.json` and `question_metadata.json` at base main `40676fd96dde5eeb104dde534a1f817fade5ab36`. Rebound only their normalized UTF-8 hashes and canonical projection version; no identity/metadata/catalog semantic rows were changed. Full runtime guard: 42 PASS, unchanged thresholds and corpus.
- Actual Chrome interaction audit PASS: original exam/solution/answer direct URLs, blocked/quota storage output, compose selection and unit preview. Compose observed 109–114 ms; original exam ready 1.76 s, solution 6.27 s, answer 0.51 s. Existing solution MathJax time remains reported, not claimed removed by offline pipeline maintenance.
- Diff whitespace check PASS. Exam production JS/assets and browser engine/UI code unchanged.

Windows checkout long-path support was enabled in the repository-local Git configuration after a checkout error; global settings were not changed. Work occurred in a new clean managed `archive-gates` worktree, preserving primary checkout edits.

These are infrastructure tests, not a new exam pilot or a substitute for independent mathematical/source/Meta/visual review. A future batch is required to measure the additional throughput effect.
