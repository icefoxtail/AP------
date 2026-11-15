# M3-S2 reviewed packet release — 2026-11-15

## Scope of this checkpoint

The 83-exam / 1,958-question review at `c17c09a24eb356e4eaf17e4f5bc43c9844cf7427` is ported onto current main source **field by field**. The input snapshot is `e16005f23ba75a2efb9ab5a294881274591fde8e`; newer question and solution figures on that main snapshot are preserved. Only metadata values documented in the review and its explicit reasoning are copied. Exact-type gaps, unknown difficulty values, historical curriculum gaps, and prior review notes remain distinguishable from completed canonical registration.

Six repaired questions also receive a current-method difficulty reassessment independently checked against the difficulty v1.3 rubric; the two geometry items on the bucket-3/4 boundary preserve `B34` and `medium` confidence. The historical level is retained.

Thirteen source solutions receive narrow mathematical repairs independently reviewed by the root release coordinator. Their original question text, choices, answers, images, display fields, and question order are unchanged. They address a central-angle justification, two similarity derivations, an incorrect perpendicular vertex, a median case split, and eight elementary-geometry explanations in place of unsupported shortcuts. `source-port-verification.json` binds the actual before/after source bytes and identifies each repaired solution; it is not an exam-wide mathematical quality certificate.

For an otherwise unspecified curriculum, an unambiguous M3 source exam year 2020–2026 can resolve to 2015 under the existing rollout-year rule and Ministry of Education implementation dates. This is recorded separately from a comparison-only 2015 RPM path. No pre-2020 source is assigned 2015 by this inference rule. Existing explicit historical curriculum and unresolved original context are preserved.

## Registration

The inbox contains the UID subsets whose current source, identity, exact ACTIVE type/template, binding, parent labels, and difficulty already satisfy the official registrar. `strict-registration-dryrun.json` records a successful dry-run of 35 requests / 471 UIDs. These are FINAL_QA metadata approvals and do not claim a new REVIEW2 or R1/R2/R3 exam audit.

The other reviewed source declarations proceed through the existing `MAIN_MERGED_EXPLICIT_METADATA` registration path after merge, subject to its ordinary UID, ACTIVE binding, difficulty and Consumer checks. A source declaration or a successful dry-run is not evidence of completed registration or publication. Missing definitions and source reassessment are being repaired in subsequent closeout work; `strict-registration-selection.json` preserves the specific current exclusion reasons rather than reporting the entire 1,958 as canonical PASS.

Only source JS, small requests, and review evidence are committed by this lane. The serialized registration writer owns shared metadata, identity, compiled/runtime, catalog, and student index outputs. The release coordinator owns push, CI repair, merge ordering, registration verification, and the final deployed-SHA check.

## Next concrete steps

1. Finish the partial registration and source reassessment registrar dependency, then release PR #2022 before this packet.
2. Apply these requests through the writer and verify receipt/Consumer identity at the actual merged source SHA.
3. Add the reviewed exact definitions and exact bindings for unresolved type goals, using the official `registryChanges` path; reuse existing exact definitions where available.
4. Close the remaining current-method difficulty and source defects without substituting adjacent type goals or unsupported historical curricula.
5. Verify the production receipt against the registered main SHA before claiming publication.
