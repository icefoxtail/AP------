# Binding course spelling correction v1

This operation corrects one existing ACTIVE `MIDDLE1` binding's literal
`standardCourse: "中1 수학"` to `"중1 수학"`. It preserves the existing exam's
approval provenance. It does not register, re-review, rebind fingerprints, or
approve an exam. The ordinary reviewed-exam-v2 guard against affecting another
exam's approved consumers remains unchanged.

## When this request applies

An existing approved exam already uses the correctly spelled native course and
the unchanged PT/TPL/unit/subunit. Its canonical binding contains the spelling
error. The existing compact R2 proof and its indexed SHA must identify the same
UID, source, ordinal, historical fingerprint and runtime pack.

Only one binding and one existing approved source exam are accepted. The tool
computes the union of old/new exact-tuple metadata consumers, runtime consumers
and the binding's supporting UIDs. Missing, extra, unapproved or foreign-exam
consumers are refused. A consumer still using the old spelling is refused: this
operation does not migrate its metadata. An existing correct tuple is also
refused; it must never create duplicate bindings.

The ACTIVE canonical pack must already allow the correctly spelled course and
curriculum. Its version must equal the current runtime envelope version. A
preexisting version mismatch is `VERSION_PRECONDITION_FAILED`, not an implicit
repair opportunity. Finish the independently authorized registration that
normalizes that state before generating this request.

## Request construction

Schema: `archive-binding-course-correction-request-v1`.

Use the read-only, asynchronous `createBindingCourseCorrectionRequest` export
from `archive/tools/meta-foundation/register-binding-course-correction.mjs`.
Provide the current repository root, a unique `requestId`, the one normalized
`sourceArchiveFile`, `requestedBy`, a reason and the exact selected canonical
binding as `before`. The builder reads the authoritative files and official
consumer; it does not write an inbox or apply a correction.

Generate the eventual request from a clean, current main checkout. A working
copy with other unpublished source or consumer changes is not the remote-main
baseline. The existing source question number and native PT/TPL/unit/subunit/
course must match the preserved metadata and identity. Curriculum uses the
existing `curriculumForQuestion` helper, including its source-path rule when
the old source has no explicit curriculum field; no source field is filled in.

It fills:

- `correction`: exact file/collection/full before/full after; only course spelling differs.
- `expectedSourceBlobSha1`, `expectedSourceSha256`, `expectedQuestionCount`.
- `beforeFiles`: raw SHA-256 and byte size for every compiler input, compiled
  baseline, metadata, identity, runtime, source and existing proof/index file.
- `beforeDocuments`: stable parsed-object SHA-256 for binding, pack and runtime
  documents and the registry index; post-verification reconstructs these before
  objects to reject additional canonical, runtime or non-derived index changes.
- `versionBefore`: canonical/runtime version envelope.
- `runtimeRecordsSha256`: all runtime records, including their order.
- `preservedConsumers`: the independently derived exact affected UID set and
  metadata/identity/runtime row hashes plus indexed compact R2 proof references.
- `expectedConsumerStateSha256`: the actual official resolved/page semantic
  snapshot for **every runtime UID in this pack**, not just the binding's support UID.

Object hashes use recursive object-key sorting and preserve array order. File
hashes use raw bytes. Do not hand-edit these bindings or reuse them after a main
change. The old historical question fingerprints are preserved; the current
reviewed-exam fingerprint algorithm is not used to create a new approval.

Unknown request fields, `approval`, `items` and arbitrary `registryChanges` are
not accepted by this schema.

## Allowed transaction

The official registrar may write only:

1. One row's `standardCourse` in the canonical MIDDLE1 bindings file.
2. The MIDDLE1 `packVersion`, incremented by one patch version, and the matching
   runtime `packVersion`/`runtimeVersion` envelope.
3. Deterministic compiled artifacts and registry index hashes/versions.
4. A new distinct `archive-binding-course-correction-receipt-v1` receipt.

All other binding fields and rows, definitions, parents, statuses and counts
remain unchanged. Metadata, identity, source, existing R2 proof and override
index file bytes remain unchanged. The complete runtime `records` array and
all other runtime document fields remain unchanged. A write failure restores
the original bytes of the transaction's outputs.

Compilation reads the same bound input cache. A concurrent change to any
compiler input is refused before writes. Post-verification regenerates exact
deterministic outputs, derives the protected-file set from the request, and
requires exactly one patch version increment. A receipt cannot hide a protected
file, omit an output, or self-declare a different compiled output hash.

The receipt has `approvalCreated: false`,
`metadataApprovalStatus: "NOT_CREATED"`, and
`examFinalQaStatus: "NOT_EVALUATED"`. It is not attached to an old exam's
approvalEvidence and is not a native v2 approval receipt. Its source, request,
before state and preserved consumer snapshot are hash-bound.

## Required writer sequence

Run this as a standalone dependency correction. First apply and verify it on
main; then generate the dependent exam's normal small registration request from
that new main. Combining another exam's metadata changes with a transaction
that promises unchanged metadata file bytes would invalidate that promise.

The existing single writer dispatches this schema through
`register-reviewed-exam-meta-source.mjs`:

```sh
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request REQUEST.json
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request REQUEST.json --write
```

Dry-run is read-only. The normal registration pass compiles and rebuilds its
consumer inputs, then invokes:

```sh
node archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs --request REQUEST.json --verify-projection
node archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs --request REQUEST.json
```

The real shared consumer loader is reused. Verification compares current
resolved/page classification, source integrity, historical review annotations,
approval evidence, pending reasons and selection state with the pre-write
snapshot for the entire runtime pack. Envelope-derived version values are not
semantic approval fields. Any semantic or approval/selection change fails.
An existing `assignment_missing` must remain missing; it is never counted as a
new approval just because the old metadata row says `approved_*`.

The request participates in projection verification, the shared per-request
consumer-refusal collector and the post-main final consumer gate. The collector
and final wrapper need no special skip. Preservation errors use the existing
attributable `VALUE_MISMATCH` result. Global consumer-load failures stay fatal.

## Tests and reporting

Run `node --test tests/archive-binding-course-correction.test.mjs` and the
affected existing registration/consumer/isolation regression tests. Dedicated
fixtures use synthetic consumer data to test mutation boundaries and negative
cases; they do not certify live consumer output. The official isolated/full
writer and post-main consumer verification remain required.

Report correction application, unchanged previous approvals, actual consumer
preservation and main/CI state separately. A successful dry-run does not mean a
registration was applied. This operation never claims fresh mathematical R2 or
exam FINAL QA.
