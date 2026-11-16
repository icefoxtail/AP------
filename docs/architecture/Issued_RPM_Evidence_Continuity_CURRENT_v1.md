# Issued RPM evidence continuity v1

## Purpose and authority

An ordinary issued partial `FINAL_QA` receipt can explicitly record
`rpmPrimaryBindings` with `authorityUse: RPM_PATH_PROVENANCE_ONLY` and
`selectsPtTpl: false`. Those bindings identify an already approved RPM path.
They do not let a later crosswalk choose a different primary type, template,
concept, difficulty or student question.

The shared crosswalk contract permits appended rows while preserving earlier
rows and their order. `issued-rpm-evidence-continuity.mjs` authenticates the
original issued snapshot when this specific typed crosswalk ref has a different
current file digest. It does not edit the historical digest or reissue approval.
The original request and receipt remain byte-for-byte unchanged.

## Ordinary branch: required evidence

- The receipt is a committed ordinary partial `FINAL_QA` with no source rebind,
  fingerprint repairs, source reassessment or native parent binding. Every
  selected UID has exactly one explicit RPM-path-only binding.
- The helper locates the unambiguous addition of the exact receipt path and
  raw bytes in actual `HEAD` ancestry, and explicitly checks ancestry. An
  arbitrary same-source snapshot or a separate unmerged branch is insufficient.
- The exact original inbox request is read from that issuance ancestry. Its
  canonical request SHA, source, approval, registry changes and selected values
  must reproduce the receipt's bound input. Consuming the live inbox is allowed;
  deleting or losing the immutable request is not an exemption.
- Every original approval, item and registry-change evidence ref is read from
  the issuance snapshot and checked against its original raw SHA. The issued
  source blob and raw SHA, full denominator and selected UID/ordinal identities
  are checked as well.
- Current source and crosswalk bytes equal fixed `HEAD`. Every selected whole
  question is unchanged from the issued source; outside-UID source changes do
  not grant additional selected scope. Issued metadata/runtime RPM values match.
- All old crosswalk records remain an exact ordered prefix, IDs are unique,
  additions are nonempty, summaries describe actual rows, and every other
  authority-header field is unchanged. The locked canonical master is raw-byte
  identical in the issued snapshot, current `HEAD` and live filesystem.
- The official RPM provenance validator runs against fresh current authorities
  for every selected binding. Record ID, curriculum, course, path and master
  leaf must remain exact and unambiguous. The old `selectsPtTpl: false` boundary
  remains in force.

## Separate single solution-repair leaf

An already issued `PARTIAL_UIDS` `FINAL_QA` with exactly one selected UID and
exactly one original `rebind` fingerprint repair has a separate narrow path.
This does not admit a `sourceReview`, renderer reassessment, source-preservation
receipt, native parent binding, additional repair or a missing repair marker.
All issuance ancestry, original request and evidence, current whole-question,
master, summary and official current RPM provenance checks above still apply.

The original request and receipt must agree on the exact UID, ordinal,
`rebind`, `identityBefore`, and both before/after fingerprints. The explicitly
bound prior Git blob must be available and hash-correct, with the original full
source denominator. The helper recomputes both fingerprints and requires every
student/renderer field except `solution` to remain unchanged. The changed
solution is restricted to plain text and existing mathematical escapes: HTML
tokens, character entities and renderer declarations require a different
contract. This helper neither approves nor edits the solution.

Referenced assets retain the same complete inventory, original issuance bytes,
current `HEAD` bytes and live bytes. SVG checks apply case-insensitively and
reject active or animated elements (including namespace-qualified elements),
base-URI redirection, nested external dependencies, style declarations and
ambiguous entity/CSS escapes. The selected whole question still equals its
issued object. These restrictions never replace a renderer review.

Only in this single solution-repair branch may an **unselected** original
crosswalk row refresh its `mappingStatus`, `bindingStatus`, `standardCourse`
or `binding`. All old IDs remain the same ordered prefix, additions remain
nonempty, and every other old-row field—including curriculum, scope and the
entire RPM path—is exact. The selected original RPM row remains fully equal,
including its mapping fields. Deletion, reordering, a changed selected row or
any non-mapping change fails closed. The ordinary zero-repair branch retains
its stricter full original-row equality without this exception.

The continuity result reports `unselectedMappingRefreshCount` and the selected
full-row SHA. These are evidence boundaries, not new metadata approvals or
permission for a crosswalk to choose PT/TPL. Ordinary native, original-leaf
replay, source-preservation, current canonical and authority-HOLD checks still
decide whether the already approved item is reusable.

## Integration and failure behavior

`archive-pr-native-preview.mjs` may stage the current crosswalk bytes only while
visiting the exact nested issued receipt. A direct request's drifted evidence
still fails. Seeing the same path earlier in the manifest does not skip the
historical typed-ref verification.

The ordinary native reader, preserved-source native leaf, figure claim scan and
renderer claim scan use the same verifier only on that typed mismatch. All
other live SHA checks continue. Claim scans still inspect the evidence; deleting
renderer markers or repair claims remains subject to the existing rejection
rules. Parsed renderer claim data is keyed by the freshly verified current byte
SHA, not by a stale historical digest.

This helper grants no native or Consumer result by itself. The surrounding
current authority-HOLD, ACTIVE canonical, metadata/runtime/identity equality,
whole selected source, preservation chain and original native checks still run.
It adds no verdict cache. Immutable Git bytes, live files, hashes and current RPM
provenance are checked again on each invocation. Missing Git history, changed
selected/original identity records, reordered rows, master drift, typed UID/path
mismatch or an unrelated evidence change fails closed. Only the explicit
single-solution branch admits the unselected mapping-only change described above.

## Verification scope

`tests/archive-issued-rpm-evidence-continuity.test.mjs` uses a small isolated Git
repository and the official ordinary registrar to issue its successful receipt.
It covers preview staging, direct native reuse, a real source-only preserving
receipt and original-leaf replay, alongside committed and warm corruption,
ancestry loss, generic drift and current ACTIVE rejection. Synthetic test
content does not assert production mathematical or visual quality.
