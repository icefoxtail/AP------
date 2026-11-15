# Appending a separately finalized concept to an existing audit

`archive-audit-finalized-cc-append-v1` is an explicit component operation. It retains an already issued full `META_PIPELINE_AUDIT` preservation receipt and appends one independently finalized cross-concept to one of its UIDs. It does not extend the original v1 preservation operation or issue `FINAL_QA`.

## Two authorities

The original audit supplies every existing metadata, identity and runtime value. Its full preservation history is replayed using the original request, receipt, difficulty input and immutable Git source. The supplied snapshot must also contain the exact receipt records in its actual metadata, identity and runtime stores.

The appended concept has separate authority. The existing native-review loader and native-proposal finalization validator verify the immutable M2 review, exact selected application, independent definition, protected student payload, primary tuple and renderer evidence. A component view isolates the native base concept array and the one finalized addition; it is not a replacement metadata record. Native fields outside that component are never applied. For example, a native `SEQUENTIAL` value does not replace an audited `NONE` value.

The source may change only the selected question's `crossConceptKeys` to the ordered union of the existing audited keys and the single finalized key. Every other field of that question and every whole object outside it must remain exact. All source UIDs retain their original approval kind, status, field status, primary values, curriculum, difficulty, conditions and integration value. Identity records are unchanged.

## Request and issued proof

The request is a full v2 request with no partial scope or alternate registration mode. Its approval remains `META_PIPELINE_AUDIT` and carries `sourceRebind.schemaVersion = archive-audit-finalized-cc-append-v1`, the prior full receipt reference, exact prior snapshot and one component specification. Every ordered source item has empty `before` and `after` objects. Only the exact independently finalized definition ADD is permitted; if the same definition is already installed, no registry change is needed. Extra QA, review-pass and difficulty claims are rejected.

The selected metadata/runtime row receives `crossConceptApprovalComponents`, which identifies the retained original audit and the separate finalized addition. All source rows receive the new receipt/revision binding. The receipt records zero new whole-metadata approvals, the full preserved count and one finalized concept application. A SHA-bound `archive-audit-finalized-cc-binding-v1` sidecar seals the exact request and both authority components.

Every referenced source asset is explicit evidence. Its path and bytes must agree with the current snapshot and each source snapshot authenticated by the original audit-preservation history. Choosing a later commit with an unchanged old receipt cannot authorize a changed non-selected renderer. Nested external SVG dependencies, scripts and unsupported dynamic renderer constructs are rejected by this narrow path.

## Replay and consumers

The official registrar performs the same authority checks before any write and on replay. The native reader replays both components rather than treating markers or a sidecar's existence as approval. Consumed inbox requests can be reconstructed only from the sealed exact request; an existing conflicting input is refused. Explicit component markers keep the proof obligation when evidence disappears. After a valid existing native receipt has had the opportunity to prove the entire current record, failed reuse is checked against the original audit's immutable Git authority. A changed CC in either metadata or runtime requires its separate authority even when revision, evidence references, source CC and other metadata fields are simultaneously erased or changed. A fabricated ordinary revision or an unrelated receipt-shaped reference cannot suppress that check. Only immutable Git receipt inventories are cached; successful replay and mutable evidence are never cached.

The PR selector accepts this exact typed request and its unchanged inherited form. Its shadow reruns the official registrar. Changed-UID Consumer verification invokes official projection and checks the full preserved scope while retaining any previously proven basic-parent projection.

The feature tests issue synthetic original audits and preservation receipts through the real registrars. They cover a full 24-question operation, exact replay, native/AutoMeta reuse, canonical and changed-UID Consumers, official preview/shadow, missing and forged evidence, simultaneous marker deletion, source restoration, immutable native holds, extra approval claims and historical renderer drift. They do not constitute production registration or new mathematical QA.

## Production preparation

After code acceptance, bind a production request to the latest main source, actual prior receipt and current metadata/runtime. Recheck same-source pending inputs before publication, because changing one metadata array changes the whole source blob. Preserve the original receipts and immutable native/finalization documents. Publish generated registration outputs only through the existing writer, then verify actual registration and Consumer results separately from local validation.
## PR staging of an already consumed original audit

The typed append's exact `priorReceiptRef` is checked against both current raw
bytes and the full immutable `priorCommit`. The preview stages that receipt and
the current explicit evidence; its official registrar replay authenticates the
complete historical audit and difficulty authority from the original snapshot.
Historical inbox requests already consumed by that snapshot are not restored to
the current inbox. This boundary applies only to the exact prior receipt of an
`archive-audit-finalized-cc-append-v1` request. All ordinary native receipt chains
and all current approval inputs retain recursive byte and fixed-HEAD checks.
