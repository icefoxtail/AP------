# Bounded canonical parent retry for Main AutoMeta

## Authority and scope

This operation registers metadata already explicitly present in a merged source. It does not create `FINAL_QA`, `REVIEW2`, `META_PIPELINE_AUDIT`, an independent mathematical review, or a new curriculum scope. The ordinary AutoMeta path retains its existing `CANONICAL_LABELS_MISSING` refusal.

The initial request selects exactly six questions in `original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js`: ordinals 2, 7, 11, 12, 16, and 19. The existing C1/C2 review and adjudication are reused only for the recorded metadata scope. The other 40 registration-pending M1S2 questions and all M3S1 questions are excluded from this retry.

An explicit request may read `binding.L1 || unit.labelKo` and `binding.L2 || sub.labelKo`, the same parent-label rule used by `reviewed-exam-registration-v2.mjs`. The master is `archive/data/master_tables/js_archive_tag_master.json`. An ACTIVE unit, ACTIVE subunit, unambiguous parent relation, exact ACTIVE course binding, and matching PT/TPL are required. Explicit source or current metadata labels that disagree are rejected. Curriculum inference remains the existing ACTIVE validator's source/year inference; an explicit conflicting curriculum is rejected.

## Immutable input and row compare-and-swap

`archive/data/meta-foundation/main-auto-parent-retries-v1.json` lists immutable request path/SHA pairs. An absent index leaves normal scheduling unchanged. A configured empty or malformed index fails validation.

Each request binds its source path, raw SHA-256, Git blob, question count, actual pending base commit, prior source bytes, ACTIVE registry digest, master bytes, existing review evidence hashes, exact UID/ordinal set, current metadata row hash, and identity row hash. Metadata and identity hashes use the same recursively sorted JSON representation as AutoMeta. Student fields must be unchanged from the actual pending base.

Global metadata/identity file hashes are provenance, not per-UID authority. A legitimate earlier producer may change other UID rows before this operation. The selected rows must still match their exact request pins. The registrar independently checks that all rows outside its applied set stay unchanged during this operation.

The request/master digests participate in the selected questions' input hash and attempt signature. A registered receipt also binds the original metadata row hash, identity row hash, and exact registered metadata row hash. Explicit reuse or replay validates the current source, prior source, registry, master, evidence, identity, and registered row again. A changed master or changed selected row cannot borrow the old receipt.

## Existing writer integration

No writer lane is added and the `reviewed → semantic → shared` producer order is retained. When an outstanding request exists, the existing semantic lane passes its exact path and SHA to the existing `archive-main-auto-meta-pass.sh`. That invocation selects only the request's UID set; it does not combine it with the ordinary pending queue or the pilot target.

The same semantic pass performs the ordinary compile/materialize/build steps, the bounded write, official Consumer verification, source/identity checks, and exact replay. Its report remains at the standard path, so the writer's existing final Consumer and whole-operation unrelated-row checks remain effective. Before a following invocation can replace that report, the bounded report/verification/replay are retained in the native evidence directory under the request SHA.

The bounded operation does not advance `lastProcessedCommit` and does not edit `completedPilots`. The remaining pending queue is preserved. Existing continuation scheduling runs a later ordinary batch using its existing cursor.

## Completion and failure isolation

The write is buffered. A missing selected target, pending-base conflict, any refused UID, scope mismatch, invalid master, source/evidence drift, or row CAS failure aborts the entire bounded batch before metadata, runtime, state, requests, or receipts are written.

A completed operation records the exact generated receipt SHA for every selected UID in `completedCanonicalParentRetries`. Discovery verifies the immutable request and all completion receipts, then excludes that already-completed operation from automatic selection. This is historical completion, not a current-edition approval: explicit retry/replay still performs all current pin checks. Tampering with a completion receipt fails closed. A missing or unverified completion marker cannot suppress the request.

As in the existing semantic producer, the main writer publishes the data and cursor only after its Consumer and replay checks succeed. A failed Consumer or failed replay is not a successful completion to publish. Read-only replay must apply zero records and plan zero output paths.

## Meaning of the initial six registrations

The actual local Consumer verifies six source-bound records and DIRECT access to all six. They remain `MAIN_MERGE` with `review_required`; no independent/native semantic approval is created and their existing D5 values are preserved. VERIFIED and basic/advanced automatic eligibility remain false. Existing `course_namespace_invalid`, `assignment_missing`, and `canonical_parent_missing` debt is reported separately and is not relabeled as a successful semantic approval. The four-slot registration path is unchanged.
