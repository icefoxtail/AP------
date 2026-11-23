# Exact-source quality holds v1

This transport preserves an explicit unresolved source-condition decision without modifying the source, its recorded integrity or publication status, identity, existing native receipt, semantic metadata, or difficulty values. It creates no approval and performs no mathematical review.

## Authority and scope

`archive/data/meta-foundation/source-quality-holds-v1.json` is a mandatory, closed-schema ledger. Its v1 records support only `HOLD` with `SOURCE_CONDITION_NOT_ESTABLISHED`. The ledger cannot be empty, and deleting it is an error. This version has no implicit release or generic authority-withdrawal operation. A future release requires an explicit source-evidence resolution contract and independent review.

The initial record is one exact UID: M1S2 25왕운 기말 Q23. Its current native receipt already contains an explicit pending-evidence decision, and a later decision on the same source and original-image bytes leaves the source condition unestablished. The existing native approval label and stored D5 remain historical records; this transport does not reinterpret them as a completed source-condition judgment.

Before any catalog is emitted, the loader verifies all of the following:

- Unique hold ID, canonical UID, source path and ordinal; exact source count and raw/Git blob digests.
- A unique identity-map join and the existing full-payload identity fingerprint. Legacy identity rows may omit `status`; any explicit status must be `VERIFIED`.
- Exact original-image path, byte count and digest, also matching the selected source question.
- The original native receipt bytes, same source edition, selected applied UID and fingerprint.
- Every original receipt approval-evidence digest, including the root `EVIDENCE_PENDING` decision and the independent pending-ordinal declaration.
- A later explicit unresolved decision binding the same UID, source edition and image bytes.
- Exactly one selected catalog row with verified identity/integrity and the same fingerprint.

Missing, malformed, duplicated, changed-edition or altered evidence stops the build. It never removes the hold or substitutes a new approval. The loader does not change a receipt or record to make a check pass.

## Projection and consumers

The catalog builder adds only `sourceIssueHold: true` and `sourceQualityHold` to the selected row. The latter is the `archive-source-quality-hold-projection-v1` evidence object containing the hold ID, reason, ledger path/digest, source blob, original receipt digest and explicit release policy. These fields also travel in single-source and mixed verification shards.

The canonical assignment remains the existing assignment. Its approval history is not rewritten. `sourceStatus`, `sourceIntegrityStatus`, metadata revision, PT/TPL, parent, identity, and D5 stay unchanged.

Basic automatic selection already rejects `sourceIssueHold` with `source_issue`. Advanced automatic selection and the Problem Bank `VERIFIED` profile must reject the same explicit boolean. General use and the `DIRECT` profile retain the established source-availability behavior, and the existing recorded difficulty stays available.

## Dependency and publication contract

The ledger lives inside the existing `archive/data/meta-foundation/` registration-input prefix. The helper is inside the existing `archive/tools/` checker and release-validator prefix. The catalog manifest includes the ledger and all verified JSON evidence paths. The current helper is therefore bound through the existing checker/toolchain digest; the catalog includes the ledger digest and is itself bound to the canonical projection version.

The source-quality dependency selector additionally exposes the exact referenced operation-document paths. Root integration adds those paths to the existing registration-writer, PR registration-proof, and Pages input digests. A change to an original pending-evidence file must invalidate reuse even when the ledger remains byte-identical. This adds dependency inputs to existing gates; it does not create a skip, waiver, or separate approval route.

The ledger, helper, test and contract are ordinary reviewable source files. Shared catalog, consumer, dictionary and dependency changes are supplied as separate minimal patches for the single root writer. Scoped fixture catalog/shard outputs are local verification evidence and are not publication files.

## Verification required before publication

Focused regressions cover exact binding, unrelated-row preservation, changed source/image/evidence/receipt bytes, wrong UID or ordinal, incomplete catalog coverage, duplicate or removed holds, and the shared basic/advanced/VERIFIED behavior. An actual-current, one-exam catalog rebuild must show Q23 rejected for `source_issue`, advanced selection false, VERIFIED exclusion, and the other 23 rows unchanged outside projection-version identifiers. Source, image, identity, metadata, native receipt and runtime raw hashes must remain unchanged. Remote CI, main writer and Pages results are reported separately after actual publication.

## Exception: owner-decision minimal-fix resolution (2026-11-23)

The v1 ledger above is unchanged. This section adds one append-only exception; it is not a general release operation.

- **What:** `archive/data/meta-foundation/source-quality-hold-resolutions-v1.json` (optional file, schema `archive-source-quality-hold-resolutions-v1`). A hold that has a matching resolution record is no longer bound to any source edition. For that hold only, the loader skips the `SOURCE_EDITION`, source count/UID, identity fingerprint, image, native receipt and unresolved-evidence checks, does not project `sourceIssueHold`/`sourceQualityHold`, and the question is an ordinary catalog row. The ledger record, its receipt and its evidence files are not edited. A hold without a record behaves exactly as before, including rejecting an implicit status change.
- **When:** only when the owner explicitly decides it. The decision quote is recorded verbatim.
- **Why:** original-source comparison is required for the first work only; later corrections are minimal fixes at the worker's discretion (user, 2026-11-23). The hold pinned the whole file and blocked error corrections of other questions in it.
- **Why no new hash:** a resolved hold is not tied to a new edition again. Re-pinning would stop the registrar at the next edit of the same file (the 2026-11-23 incident).
- **Record format:** `holdId` (must match a ledger record, no duplicates), `resolutionKind` (`OWNER_DECISION_MINIMAL_FIX`), `decidedAt` (YYYY-MM-DD...), `decisionQuote` (non-empty), `basis` (what was fixed and how, one or two sentences), `changedOrdinals` (question numbers changed). Any other key is rejected. Records are only appended.
- **Review:** a change to this loader or to a resolution record is reviewed by a reviewer other than its author. The mathematics of a fixed question is rechecked independently in the same PR.
