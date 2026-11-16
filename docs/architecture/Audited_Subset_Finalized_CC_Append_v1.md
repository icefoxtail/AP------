# Audited subset finalized CC append v1

This explicit operation retains the complete currently issued source-only audit subset of a mixed source and appends one independently finalized cross-concept application to one of its UIDs. It issues no mathematical, difficulty, primary, curriculum, or metadata approval. Ordinary FINAL_QA and the earlier full-source audit CC contract keep their existing meanings.

## Request boundary

The request uses `archive-reviewed-exam-meta-register-request-v2`, `PARTIAL_UIDS`, `META_PIPELINE_AUDIT`, and `approval.sourceRebind.schemaVersion = archive-audit-subset-finalized-cc-append-v1`. The request ID begins with `audit-subset-cc-`. Top-level, approval, sourceRebind, component, and item keys are closed. Every item has empty `before` and `after`; `registryChanges` is exactly an empty array. The request contains the complete UID/ordinal sequence of the issued current audit subset, not a caller-selected sub-subset or the source's newer FINAL_QA rows.

The immediate prior is an immutable, already issued `archive-native-audit-source-preservation-v1` receipt and its durable audit source binding. Its commit must be an ancestor of the validation HEAD. The original full audit is derived from that receipt's sealed request; callers cannot supply a different original approval. Both current receipt and original full receipt are explicit evidence for every retained item.

The native component and finalization continue through the existing exact native review, source evidence, primary/curriculum agreement, proposal binding, and independent CC finalization validators. The installed canonical definition must already be ACTIVE and exactly equal to the final approved definition. A missing definition, additional registry mutation, or a change to any other approved field is rejected.

## Source, assets, and values

The live source must match the request's raw Git blob and contain its full declared question count. Against the actual prior source, the only allowed whole-question change is the selected CC array: the retained audit keys, in order, followed by the one finalized key. Every other source question is exact. Student fields are also compared with the immutable native component source.

The complete source's referenced asset inventory and raw bytes must equal the actual current prior and each original full-audit source snapshot. Assets must be explicit current evidence. SVGs with external or nested dependencies, scripts, SMIL, event attributes, imported styles, CSS animations, entities, `xml:base`, or escaped dependency syntax are rejected. No rendering observation or new asset approval is created by this operation.

The registrar retains each selected row's entire prior metadata, identity, runtime, approval kind, integration value, optional debt, and original evidence. Only the metadata revision and provenance change on all selected audit rows; the selected CC row additionally receives the ordered union and separate component provenance. The registrar's existing outside-UID signatures ensure that it writes no metadata, identity, or runtime changes to the source's newer native siblings or unrelated UIDs.

Those native siblings are outside this operation's approval scope. When the source blob changes, they use a separate existing FINAL_QA source-only preservation request against their actual issued whole cohort. In E029 this gives audit12 plus native12, with one CC application and zero new approvals. The combined 24-UID Consumer remains a required actual-data gate; a synthetic fixture or successful audit-only request does not complete it.

## Durable replay and Consumers

The new sidecar suffix is `.audit-subset-cc-append.json`. It seals the exact request, immediate audit binding, original full receipt, selected records, complete source objects, and all renderer assets. Current Native and AutoMeta reuse authenticate that sidecar and both approval components again. They verify every current selected audit metadata/identity/runtime row and require an ACTIVE runtime container with the registry's nonempty matching version. Success is not cached.

The catalog precedence helper exposes only exact source-to-approved-value pairs for the authenticated audit subset. It returns no precedence for the newer native siblings and returns an empty result if a retained peer, supplied identity, source, runtime, or authority fails. Canonical projection and changed-UID Consumer validation continue through the existing official entrypoints.

The PR preview stages the exact current subset receipt and the original full audit receipt derived from its sealed request. It validates their raw Git anchors, scope, and ancestry. Historical consumed D5/request inbox files remain historical; they are not recreated in the pending inbox. This staging step grants no approval: the disposable official registrar still replays the original full audit and current source-only subset.

## Missing evidence

Explicit revisions, sidecars, or typed receipts identify a mandatory verification. The immutable HEAD ancestry also preserves this obligation after combined marker/file removal, including a merge that drops the issuing parent's tree. Only an immutable claim inventory is cached; live bytes, original approvals, selected values, and native success are always rechecked. An obligation never grants approval.

A valid exact ordinary prior approval can still be reused when its complete old source and values are restored. A remaining CC addition, one-sided metadata/runtime addition, forged ordinary revision/kind, or unrelated concurrent drift cannot borrow that prior approval. Tests cover old and current source cursors, warm and fresh processes, committed deletions, and missing Git for a stripped audit claim.

## Validation scope

Synthetic tests exercise actual original audit, D5 preservation, native registration, current subset preservation, new CC append, preview/shadow, canonical Consumer, and AutoMeta entrypoints. They do not fabricate production approvals. The new suites are registered in the regular and scoped runners, with existing timeouts unchanged.

Actual-data input preparation, publication, full official dry/write/replay, current Native/AutoMeta, and combined Consumer results must be reported separately by exact code and data commit. No production registration is implied by this document or by a prepared request.
