# Repaired M2-S2 compact across two issued metadata additions

## Boundary

`m2-s2-repaired-issued-metadata-continuity-v1` is an explicit successor to a literal, fully validated `currentM2RepairClosure` compact. The initial production target is E017, 24 Yeonhyang midterm: the existing Q2 repair remains unchanged while the already issued Q11 and Q15 native registration adds `courseKey`, `reviewStatus`, `tagConfidence`, and `tagStatus` to the current source.

This contract performs no metadata, mathematical, renderer, difficulty, or four-slot approval. It writes no source or assets. It does not replace the original negative finding or infer a new visual review. A prior `REGISTERED` metadata receipt is evidence of those two existing native decisions only; its separate Consumer or full QA status is not promoted.

## Two source snapshots

The existing repair validator keeps its exact live-source rule. Without the new marker, a source that differs from the original repair source continues to fail.

The new successor first calls the closed `validateHistoricalFile` adapter for the literal prior repaired compact. That adapter executes the original repair checks against the prior Git snapshot, including the complete original v1 vector, denominator, native method, owner repair, ROOT observation, original negative witnesses, unchanged peers and old asset bytes. It accepts no caller-supplied reader or skip flag. It returns the exact set of historical JSON evidence read during this replay.

The new validator requires every returned historical evidence file to remain live and byte-identical. The old compact's header, items, candidates, formats, reviewer and all evidence remain literal. The only compact change is the additional `currentM2RepairMetadataContinuity` group.

## Current metadata binding

The carrier uses the closed scope `PRESERVE_LITERAL_REPAIRED_VECTOR_ACROSS_TWO_ISSUED_METADATA_ADDITIONS_ONLY` and binds:

- The literal prior repaired compact and its original repair carrier.
- A current source at an ancestor commit of HEAD, with exact Git blob, raw SHA, current HEAD bytes and live bytes.
- The original consumed native request, a durable byte-identical copy, the actual issued receipt, and the original native review copy.
- All current question identities, prior/current whole-question hashes, unchanged student payloads, complete current asset refs and the full unchanged compact-items digest.
- The complete historical evidence inventory and zero new-approval counters.

Exactly two source rows may change. They must be the complete selected UID/ordinal partition of the immutable `PARTIAL_UIDS`, `FINAL_QA`, registry-empty request and its `REGISTERED` receipt. Each row may add exactly the four keys above, all previously absent. The original repaired UID is excluded. Values must match both the issued metadata and runtime records, and the request's original native `after` values, native-review refs and issued source-review fingerprint links must remain exact. All other question objects must be identical.

The full source count, stable UID/path/ordinal/printed-number join, original native review count and all receipt partitions are verified. Every student field and every referenced asset path and raw byte remains unchanged. Changed, missing, extra, duplicate, relabeled or unsupported evidence fails closed. Current source, receipt, assets, successor carrier, durable request copy and native-review copy must have Git mode `100644` at both their declared immutable commit and HEAD, with the same path, blob OID and raw bytes. Their immutable commits may remain ancestors of HEAD; the current tree must still contain those exact files. Current live files must be regular files, not symlinks. Identical live bytes cannot compensate for a missing current tree entry or a different HEAD mode.

## History and cache behavior

The full HEAD history is searched for committed successor carriers. Their immutable input identities are pass-local inventory data, not cached validation results. Missing markers, stripped proof files or a changed full vector cannot fall back to the older repair or generic payload comparison. Original v1 negative obligations continue to be enumerated separately and supplied to the original repair replay.

The builder includes the new helper in its implementation digest and every declared live proof in the input digest. The complete current validation runs before cache reuse. Warm and cold reads must both reject missing or altered source, receipt, native copy and historical evidence.

## Publication sequence

Publish the exact consumed request copy first. Then publish a carrier bound to that actual copy commit and the existing source/receipt refs. Finally add only the new evidence group to the literal repaired compact. No old carrier, ROOT observation, source header, vector or negative history may be spliced or rewritten.

Production registration remains unverified until the published inputs run through the official dry/write/check/replay and Consumer path. Synthetic tests are explicitly synthetic and do not establish an actual E017 registration result.

## Tests and CI

The new tests cover the original live-source rejection, successful literal repair replay with two issued metadata additions, truthfully rebound student/asset changes, HEAD mode changes with unchanged live bytes, altered native authority or issued partitions, the excluded repaired UID, a third UID, missing historical coverage, warm/cold evidence removal and committed history stripping. Warm and cold cases also commit deletion of the carrier or either durable copy while preserving the same regular live file. Existing repair tests and assertions remain unchanged. New CJS tests are explicitly registered in `tools/run-tests.js`; the existing `item-4slot-` scoped selector includes them. All commands retain the default 60-second budget, with history cases partitioned exactly once.
