# Existing FULL audit: source-only subset preservation

`archive-native-audit-source-preservation-v1` is an explicit preservation subtype of the existing v2 registrar. It retains still-current members of an already issued FULL `META_PIPELINE_AUDIT` preservation receipt after other questions in the same source file change. It creates no classification, mathematical QA, difficulty judgment, or new metadata approval.

The existing `archive-native-audit-preservation-v1` FULL/subset-plus-reviewed-D5 contract and the `FINAL_QA` source-rebind contract remain unchanged.

## Request and authority

The request uses `scope: PARTIAL_UIDS`, `approval.type: META_PIPELINE_AUDIT`, and empty `before`/`after` objects for every selected item. Registry changes, item-level reassessments, identity repair, and difficulty input are forbidden. The `approval.sourceRebind` object has exactly four properties:

- `schemaVersion`: `archive-native-audit-source-preservation-v1`.
- `requestPath`: the exact inbox path of this request.
- `priorCommit`: the full immutable public commit containing the issued prior state.
- `priorReceiptRef`: the exact prior receipt path and raw SHA-256, also present in the approval and item evidence references.

The immediate prior must be a FULL existing audit-preservation receipt, including its original scope representation (no partial scope). The complete original request, evidence, FULL audit lineage, reviewed difficulty input, and every applied metadata/identity/runtime record are replayed through the unchanged historical verifier. A partial historical receipt is not substituted for that authority.

The public metadata, identity and runtime at `priorCommit` identify which original FULL audit rows remain current. A selected row must still equal that published prior row and the live row. Later approvals cannot be resurrected. The selected set is a proper subset, with exact UID, ordinal and full-source denominator checks. Its whole question objects, including renderer references and metadata fields, must be unchanged. A different whole-source blob is required.

Referenced local renderer assets are read from both the immutable prior Git tree and the current filesystem. Their raw bytes must match. References in choices, shared material and other nested question strings are included. External, malformed or unsupported dependencies fail closed, including unquoted SVG attributes. No source or asset is written.

## Issued output and replay

Only `metadataRevision` and appended approval evidence change in selected metadata/runtime rows. All approval types, statuses, field statuses, parent keys, PT/TPL, optional debt, difficulty values and fingerprints are retained. Identity remains wholly unchanged. Nonselected records remain unchanged.

The revision keeps the existing `:exam-meta_pipeline_audit-v2:` authority prefix used by catalog and parent projection, followed by `source-only-v1:<requestId>`. The explicit subtype marker is also required by replay and Native failure detection; the Consumer conflict rules are unchanged.

The writer issues `<requestId>.audit-source-binding.json` in the native receipt directory. This typed sidecar binds the exact request snapshot, prior commit/receipt, current source blob/raw SHA, selected inventory, original metadata/identity/runtime digests, whole-question digests and renderer inventory. The receipt includes its raw digest, and selected metadata/runtime both carry its provenance marker and the explicit source-only revision type.

On registered replay and Native reuse, the sidecar and current source/assets are rechecked. Only immutable historical computation is cached by root, exact prior commit, receipt path and receipt SHA. Live source, sidecar, assets and current row values are never accepted from that cache. A failed typed source-only audit remains pending and cannot fall through to ordinary `MAIN_MERGE` metadata production. Existing plain audit and FINAL_QA receipts do not acquire this sidecar requirement.

Successful inbox consumption is supported through the sealed exact request snapshot. An existing inbox file must still match it. Original consumed D5 input may be read only from its existing historical sealed bytes when that Git path is genuinely absent; a present historical file always wins.

## Counts and required verification

The receipt reports `newMetadataApprovals: 0`, the exact `preservedMetadataApprovals`, and `newDifficultyApprovals: 0` in its audit summary. The typed Changed-UID Consumer verifies the actual selected native rows instead of skipping their empty patches. A writer result alone is not release completion: the official projection, current canonical consumer/query checks, Native old-cursor and caught-up checks, and nonselected preservation checks remain required.

The E029 release case uses the original FULL24 audit and selects the twelve rows outside the proposed twelve new FINAL_QA registrations. The earlier draft request's thirteen items are not a prior partial audit receipt. Future cohorts must be re-counted from the actual registered main; these example counts are not permission to select a fixed quota.
