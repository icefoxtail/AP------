# Durable inputs for explicit native source-review proofs

The official v2 writer emits one `archive-reviewed-source-binding-v1` sidecar
when selected items opt into proposal finalization, retained native fields,
native scope-field binding or a native reviewed parent. Its path is
`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/<requestId>.source-review-binding.json`.
Ordinary source reviews and the existing renderer sidecar keep their own
contracts. This sidecar supplies no metadata values or review authority.

## Exact persisted input

The sidecar preserves the complete JSON `requestSnapshot`, including every
selected `before`, `identityBefore`, source-review reference, registry change
and approval reference. Its stable JSON SHA must equal the registration
receipt's `requestSha256`. The source path, raw SHA, Git blob, partial selection
and full exam denominator are bound separately.

`sourceReviewUidCount` counts only items using these explicit proof contracts;
`partialUidCount` is the entire request selection. Each typed record binds its
UID and ordinal, complete source-review SHA, complete fingerprint-repair SHA
and native-parent proof SHA where present. The sidecar cannot be constructed
without exactly one corresponding complete proof.

Only these typed selected UIDs receive the sidecar path in both accepted
metadata and runtime `approvalEvidence`. The receipt's `outputDigests` binds
the sidecar's raw bytes. A request containing ordinary selected neighbours
does not add this marker to those neighbours.

## Replay and subsequent consumption

Replay rebuilds the sidecar from the original request and issued proofs,
checks its exact bytes/digest and verifies the metadata/runtime markers. It
then re-executes the relevant source-review contract against current source,
definitions, independent witnesses and renderer bytes. Proof deletion or
alteration cannot be hidden by resigning a local evidence file or merely
retaining an approval status.

The snapshot remains available after the inbox request is consumed. A consumer
of this contract must authenticate the marker, sidecar and complete issued
proof before using the stored request to re-execute review validation. The
presence of a marker or a matching request hash alone is insufficient.

Unpublished local receipts created before this sidecar contract require fresh
official issuance for its verification. They are not retroactively described
as having this binding. Plain native and existing renderer receipts are not
made dependent on this new sidecar.
