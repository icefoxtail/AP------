# M3-S2 reviewed packet release — 2026-11-15

## Scope of this checkpoint

The 83-exam / 1,958-question review at `c17c09a24eb356e4eaf17e4f5bc43c9844cf7427` is ported onto current main source **field by field**. The current input snapshot is `0f985c4a242888c44a45db99b1a55c7ff32a1aa3`; all 83 source-before blobs are checked against that exact main tree. Newer question and solution figures, including four Dongsan figures and Geumdang Q20, are preserved. Only metadata values documented in the review and its explicit reasoning are copied. Exact-type gaps, unknown difficulty values, historical curriculum gaps, and prior review notes remain distinguishable from completed canonical registration.

Six repaired questions also receive a current-method difficulty reassessment independently checked against the difficulty v1.3 rubric; the two geometry items on the bucket-3/4 boundary preserve `B34` and `medium` confidence. The historical level is retained.

Thirteen source solutions receive narrow mathematical repairs independently reviewed by the root release coordinator. Their original question text, choices, answers, images, display fields, and question order are unchanged. They address a central-angle justification, two similarity derivations, an incorrect perpendicular vertex, a median case split, and eight elementary-geometry explanations in place of unsupported shortcuts. `source-port-verification.json` binds the actual before/after source bytes and identifies each repaired solution; it is not an exam-wide mathematical quality certificate.

For an otherwise unspecified curriculum, an unambiguous M3 source exam year 2020–2026 can resolve to 2015 under the existing rollout-year rule and Ministry of Education implementation dates. This is recorded separately from a comparison-only 2015 RPM path. No pre-2020 source is assigned 2015 by this inference rule. Existing explicit historical curriculum and unresolved original context are preserved.

## Registration

The current inbox contains **35 requests / 464 UIDs**. Geumdang Q20 is explicitly deferred after its concurrent main figure change; the earlier 465-UID results remain historical snapshots. `first464-release-verification.json` is the current verification report: fresh official writer 35/35, native receipt reuse and source-field parity 464/464, final complete build PASS, canonical projection 464/464, and actual changed-UID Consumer 464/464 PASS. Its detailed writer, projection and Consumer records are attached separately. These are FINAL_QA metadata approvals and do not claim a new REVIEW2 or R1/R2/R3 exam audit.

All 464 selected questions pass general use, difficulty use, approved metadata facets and strict advanced selection. The strict basic selector admits 440; the 24 E042 records retain their existing `CORE` applicability rather than the selector's `DEFAULT_SCOPE` value. This distinction is recorded explicitly instead of claiming every selection mode has the same denominator. Remote CI, serialized main registration and deployment remain the release coordinator's final gates.

Seven UIDs whose current main question-figure paths changed are withheld from this first strict subset. `current-main-figure-followup.json` lists every UID, prior/current figure, source path, and original review path. The root independently checked the seven narrow figure changes; their official reassessment remains a separate follow-up. The native-format proof retains each exam's complete UID denominator while marking every unselected row `OUTSIDE_REASSESSMENT_SCOPE`. No new source fingerprint is approved by substitution.

`preexisting-native-approval-continuity.json` audits the 71 older native records in the 83 source files. All are META_PIPELINE_AUDIT records, and all three original receipts already have a source-byte mismatch on actual main before this change. The first subset introduces no loss of a previously valid native receipt. It restores 39 of these UIDs through the existing completed semantic review; later subsets restore additional UIDs without relabeling the old audit as a new mathematical review.

The other reviewed source declarations proceed through the existing `MAIN_MERGED_EXPLICIT_METADATA` registration path after merge, subject to its ordinary UID, ACTIVE binding, difficulty and Consumer checks. A source declaration or a successful dry-run is not evidence of completed registration or publication. Missing definitions and source reassessment are being repaired in subsequent closeout work; `strict-registration-selection.json` preserves the specific current exclusion reasons rather than reporting the entire 1,958 as canonical PASS.

Only source JS, small requests, and review evidence are committed by this lane. The serialized registration writer owns shared metadata, identity, compiled/runtime, catalog, and student index outputs. The release coordinator owns push, CI repair, merge ordering, registration verification, and the final deployed-SHA check.

## Next concrete steps

1. Finish the partial registration and source reassessment registrar dependency, then release PR #2022 before this packet.
2. Apply these requests through the writer and verify receipt/Consumer identity at the actual merged source SHA.
3. Add the reviewed exact definitions and exact bindings for unresolved type goals, using the official `registryChanges` path; reuse existing exact definitions where available.
4. Close the remaining current-method difficulty and source defects without substituting adjacent type goals or unsupported historical curricula.
5. Verify the production receipt against the registered main SHA before claiming publication.
