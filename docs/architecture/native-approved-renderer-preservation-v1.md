# Preserve an existing native approval across an independently reviewed image change

This contract is an explicit, narrow registration route for an original M1 S2 source. It does not change the existing source-only `sourceRebind` or `selectedSubset` contracts. It does not accept a new semantic tuple, a new difficulty value, a newly approved question, or a changed question/answer/solution text.

## Authority and scope

`approval.rendererPreservation.schemaVersion` is `archive-native-approved-renderer-preservation-v1`. The request retains `approval.type: FINAL_QA`, `scope: PARTIAL_UIDS`, and the exact current source blob/count. Each selected item has empty `before` and `after` objects. Neither source reassessment, registry changes, registration modes, nor source-only rebinding may be combined with it.

The original authority is an immutable, complete, terminal FULL native registration receipt. `priorCommit` and `priorReceiptRef` bind its exact raw bytes, its original source, and original image assets. The existing FULL ancestor validator must recognize its complete contiguous inventory. The actual native verifier then replays every original row against the old Git source and the original metadata/runtime/identity snapshot. The original receipt is never truncated or rewritten.

Selected items and `outsideRequest` form a complete disjoint partition of the original receipt. An outside row has only its UID, ordinal, and reason `OUTSIDE_REQUEST_PRESERVE_LIVE_STATE`. That reason grants no approval and makes no claim that the row needs review. The outside rows may already have newer legitimate registration receipts. Their current state is left untouched; the historical whole-receipt proof uses the immutable old state.

The selected set may cover the complete original receipt, with an empty outside inventory. Each item declares one exact mode: `UNCHANGED_WHOLE_QUESTION_AND_ASSETS` or `INDEPENDENTLY_REVIEWED_IMAGE_CONTINUITY`. This preserves one original full approval in one operation when some of its images changed and its other questions stayed identical. At least one genuinely changed, independently reviewed renderer member is required; this route does not replace the ordinary source-only registration contract.

`currentCommit` pins the complete current source to an immutable Git snapshot. Unchanged members must preserve the whole question object and every referenced asset across the original commit, current commit and live bytes. An unchanged question may have no image or referenced assets. It receives no inferred renderer review, new semantic judgment or difficulty judgment. The original terminal FULL shape validator is private to this route; no shared subset contract is introduced or weakened.

Every selected live metadata, identity and runtime object must equal the corresponding original approved object before registration. A changed status, difficulty field, semantic field, provenance or explicit hold rejects the request. The writer derives the output values from the original objects and the officially computed current fingerprints. It does not accept caller-authored approval values.

## Renderer evidence

Only `image` and `imageSize` may differ in a selected complete question object. All other fields must be exactly equal, including content, choices, answer, solution, numbering and metadata producer tags. Inline SVG and remote renderer dependencies are outside this route.

Each independently reviewed renderer item identifies one immutable independent review through `rendererReviewRef`. The same review is listed in the approval's `reviewRefs` and in the item's SHA-bound evidence. The supported origins are:

- `archive-m1-independent-narrow-renderer-review-v1`, with `ACCEPT_NARROW_CURRENT_RENDERER` or the stricter `ACCEPT_SIZE_EFFECT_ONLY` decision.
- `m1-current-renderer-repair-independent-review-v1`, with `ACCEPT_REPAIRED_CURRENT_RENDERER_CONTINUITY`, zero new mathematical/native approval, and actual inspection of the original, production and repaired images.

The origin must identify a separate reviewer and renderer author. It binds the selected UID/ordinal, old/current source raw and Git hashes, old/current selected student payload digests, image paths and byte digests, and the inspection render digest. A size-only review must preserve the image path and bytes. A repair review also verifies the preceding production asset against its source commit. The repaired asset must exist at the immutable review commit and match the live bytes.

The registrar checks every other referenced asset too. Their old/current paths and bytes must remain unchanged. Thus a reviewed main image cannot authorize an unreviewed change to a solution image, companion figure or external SVG dependency.

## Issuance and readback

The only derived changes are source/content fingerprints, the selected identity's source fingerprint, the metadata revision, and appended evidence references. All semantic values, difficulty values, approval types, field status and explicit holds remain unchanged.

The official result declares `newMetadataApprovals: 0` and `preservedMetadataApprovals` equal to the selected count. It emits an immutable `.approved-renderer-preservation.json` binding beside the native receipt. The receipt stores the exact request snapshot and derived proof. Both metadata and runtime reference the binding.

The binding separately counts unchanged whole questions and independently reviewed renderer members. The Consumer recognizes this explicit preservation discriminator, replays the real registrar read-only, and checks every selected preserved value. Empty `before`/`after` objects do not cause these selected items to be skipped as ordinary unchanged patches.

Replay and native readback revalidate the complete historical authority, exact current renderer evidence, selected output records and fingerprint repairs. The explicit typed verifier runs before the generic source-only preservation classifier; a count of zero new approvals cannot misroute this renderer contract. Missing or stripped typed evidence cannot fall back to ordinary FINAL_QA or automatic source registration. Existing manual-selection policy is unchanged.

An independently reviewed renderer member's pending cursor must equal the proven original or exact current whole question. For `UNCHANGED_WHOLE_QUESTION_AND_ASSETS` only, an older AutoMeta cursor may differ in the finite producer fields declared by `UNCHANGED_CURSOR_PRODUCER_FIELDS`. This exception runs only after original/current whole-question and all-asset equality, original FULL authority replay, and selected approval/identity/runtime CAS. Student fields, asset fields, unknown fields and property-presence changes outside that allowlist fail closed. The cursor is never an approval source; release evidence records its exact digest and changed keys.

The CI selector recognizes only the exact renderer schema, `FINAL_QA`, `PARTIAL_UIDS`, empty before/after values, supported item modes and no mixed registration/registry operation. It classifies the request as native approval preservation. Both the registrar result and Consumer must report exactly the selected count as preserved, zero new approvals, and zero selected items skipped as unchanged.

## Release evidence required

Before operational publication, use the official registrar for a scoped dry run, write and replay; explicitly verify native readback and Consumer values for the selected items. Check all questions in the affected source against the actual pending cursor. Demonstrate zero outside-selection APPLY and unchanged outside metadata/identity/runtime, including any separately registered subset. Preserve every prior receipt byte.

The contract regression fixtures test the authority, scope partition, renderer-only delta, byte continuity, explicit HOLD rejection, current-state CAS and stripped-proof boundaries. They do not constitute source mathematics or visual reviews. Actual main writer receipts and Pages verification remain separate release gates.
