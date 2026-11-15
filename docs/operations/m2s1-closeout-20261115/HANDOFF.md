# M2 S1 serial release packet — 2026-11-15

## Scope and status

This packet carries reviewed M2 S1 source metadata, five independently checked solution-text repairs, 1,299 approved numeric difficulty selections, and one identity fingerprint correction. It does not assert whole-grade semantic completion or production release. The authoritative exact selections, request hashes, and 481 held UIDs are in `release-manifest.json`.

The packet starts from main `0eb4b5306796f3828f9ebbf22a1a44e0eb24601c` and reuses accepted author reviews from `150b22a57f1a7075cae4ea89810bacc3bb7fff15`. The prior review covered 75 exams and 1,780 questions, with three independent sample questions per exam. Its completion is not recast as a full independent question-by-question pass.

## Required order

Merge the registrar repairs through `33101e33e9385fef94403126563ec5435f628d67` before applying this packet. This includes the strict `IDENTITY_FINGERPRINT_ONLY` lane and the receipt question-count field required for replay. The old native review commit must remain readable by Git for its SHA-bound source proof.

The parent coordinates main in the requested sequence: PR #2021 tooling, PR #2022/M2 S2, M3 S2, then M2 S1. Rebase or cherry-pick this small source/request packet onto the resulting main and let the official registration/build workflow produce shared JSON. Do not copy the validation fixture generated JSON into Git.

Apply flat inbox paths in lexical order. `m2s1-closeout-20261115-00-E035-identity.json` must precede `m2s1-closeout-20261115-E035.json`. The first request repairs only the already-current metadata UID's stale identity fingerprint, creates no metadata approval, and preserves metadata bytes. The second may then register the already accepted Q19 difficulty. There are 59 requests: one identity prerequisite and 58 difficulty requests.

## Content and metadata decisions

Five solution-only corrections have exact before/after SHA evidence and a second independent check: E007 Q22 fixes an inequality boundary; E010 Q8 correctly attributes the two equations sharing a common solution; E034 Q6 uses the correct parameter terminology; E035 Q6 avoids division by a possibly zero parameter; E037 Q17 states the rhombus angle-bisector step and corrects wording. Stems, choices, answers, and figures were preserved by these edits.

E011 Q14's alleged swapped graph labels were independently rechecked on the actual SVG. The leader line makes the existing labeling consistent, so the erroneous debt was closed with no graphic edit.

E057 Q19's current main figure gives two points without exposing the final equation. Its old easy judgment depended on the removed answer-revealing figure. The current source/render and RPM definitions were independently checked; the replacement difficulty is bucket 2, medium, B12, with the two-points-to-line-equation Primary. Its missing PT/TPL binding is still pending and is not activated by this packet.

Fifty source questions were aligned with the actual consumer without changing student payload. E013's 24 source `manual_review` aliases were normalized to `review_required` only after confirming that every explicit ROUTE_OUT reason, CANONICAL_DRAFT restriction, missing template, and unapproved candidate was preserved. E006 Q19–21 retain their review-status conflict and are excluded from registration. Two repaired solution rows also received their already accepted difficulty-field alignment.

## Remaining work

The packet intentionally retains 481 distinct held UIDs. Reasons overlap: missing source-method evidence 394, source-content debt 118, conditional/manual difficulty 169, unknown numeric difficulty 38, and source-review-status conflict 3. The manifest lists each UID and exact old review reference. These require actual source/evidence repair and affected-field review before a later packet; their status is not silently promoted.

The difficulty lane changes four fields only: `difficultyBucket`, `difficultyConfidence`, `difficultyBoundaryFlag`, and `legacyLevelCompatibility`. It does not register or approve Primary, RPM bindings, auxiliary tags, problem types, or templates. The original full-metadata backlog and RPM/binding debts therefore remain outside this packet's completion claim. Fifty-seven selected difficulty rows retain pre-existing stale source bindings under the official difficulty-only safety contract; the full consumer verifies their requested difficulty values without granting semantic source approval.

## Validation and closeout

The compact `validation.json` reports the final isolated official writer/build/consumer result and distinguishes it from main CI and production. The isolation audit checks every metadata and identity UID, allowing only the four requested difficulty fields and the one identity fingerprint. Exact evidence hashes are preserved in the requests and manifest.

The release owner must record the actual PR, merged main SHA, successful main registration workflow, and production result after merging. Until those are observed, this packet is only locally validated and ready for the serialized main release.
