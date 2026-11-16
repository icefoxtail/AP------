# Semantic run scope: checked cache rekey and PR protection v1

## Purpose and boundary

An active `archive-semantic-run-scope-v1` descriptor binds one complete immutable
HEAD inbox. Its existing excluded source prefixes, inbox raw hashes, consumption
rules and native approval requirements remain unchanged. A consumed descriptor
does not establish a permanent policy for later batches.

The excluded metadata, identity and runtime rows, and the full 4slot `records`,
`pending` and `files` rows remain protected. Existing excluded AutoMeta pending
entries must remain exact; the existing allowance to append newly discovered
deferred debt is retained. Source, compact, review and approval mutation guards
continue independently of this comparison.

## A checked derived cache rekey

The global 4slot builder version is part of every file's `inputHash`. A reviewed
builder update can therefore rekey an excluded file even though its registration
values did not change. The only new exception is the `inputHash` property of a
protected `fourSlot.files` row, under all of these conditions:

1. The before and after index builder hashes are valid SHA-256 values and differ.
2. File paths are unique and identical in the two protected sets. Every before
   and after `inputHash` is a present, valid SHA-256 value.
3. Removing only `inputHash` leaves all other protected rows and file properties
   exactly equal. File status, source/compact/evidence hashes, item counts,
   registered values, pending reasons, additions and removals are not exempt.
4. The current main-writer invocation actually completed the fixed command
   `bash tools/ci/archive-four-slot-pass.sh`. Its full builder write, uncached
   `--check`, replay, every registered Consumer row/posting, and source/path
   guards all remain mandatory.
5. The completed pass returns its per-invocation challenge through a transient
   `scope-check.json`. The writer re-reads all three reports and the entire index;
   report hashes, checked index raw SHA, Consumer counts, replay equality, HEAD
   and builder hash must agree. The final persist guard rechecks that same index
   raw SHA. A later index change invalidates the capability.

The challenge is generated inside the writer and is not persisted in the
deterministic 4slot verification/receipt files. The capability is a private
in-process object; a request, proof JSON, `verified: true`, copied report, stale
challenge, failed command, skipped lane or differently configured command cannot
create it. Same-builder `inputHash` changes still fail.

The existing independent 4slot lane failure policy remains: failed generated
output is rolled back and remains blocked for retry. That failure grants no
rekey exception. Unrelated successfully verified lanes retain their existing
transaction policy only when the excluded rows remain exact.

## PR production and proof reuse

`applyNativeRequests` captures a private excluded-scope snapshot before applying
native requests and checks it after application, including immutable plan-shadow
application where dirty-path accounting uses `guard: false`. That option never
disables semantic protection. The shadow also restores the immutable AutoMeta
state needed to preserve existing excluded pending debt.

`preparePrRegistration` shares that snapshot through materialization and database
generation. Its outer PR proof producer checks the same private snapshot again
after catalog stabilization and final registration checks. The serialized proof
contains only the scope binding, counts, digests and comparison result, not the
protected row bodies.

`validateLocalRegistrationProof` does not trust a submitted baseline or success
flag. It re-reads the protected baseline directly from the exact immutable HEAD
and compares the live generated rows, then compares the submitted scope summary.
Missing or changed scope summaries fail for an active descriptor. Historical
proofs without a scope summary remain readable only at an inactive HEAD.

These PR paths do not run the full 4slot producer and receive no checked-rekey
capability. They retain exact comparison, even when a caller declares a different
builder hash. Scope inputs themselves request registration preparation. Existing
native preview validation, time budgets, catalog checks and proof-output checks
remain in place.

## Result interpretation

- `semanticUnchanged: true` means the required protected values and old pending
  debt passed their comparisons.
- `exactRowsUnchanged: true` means the protected row objects, including file
  cache keys, were exactly equal.
- A checked rekey reports `exactRowsUnchanged: false`, `unchanged: false`, and a
  separate `cacheRekey` containing changed paths and checked builder/index hashes.
  It does not claim equal raw row digests or a new content/metadata approval.
- Full production registration, Consumer and CI results require their own actual
  runs; synthetic orchestration tests do not establish those outcomes.
