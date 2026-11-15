# Shared binding course spelling correction v2

This is the multi-source extension of [binding course correction v1](binding-course-correction-v1.md).
It corrects **one existing ACTIVE MIDDLE1 binding**, changing only the literal
`standardCourse: "中1 수학"` to `"중1 수학"`. Existing v1 requests, receipts and
their single-source restriction remain supported without migration.

Use v2 when the one binding already has approved consumers in more than one
original M1 exam. It does not authorize changes to those exams, create an
approval, rebind historical fingerprints, or relax the ordinary reviewed-exam-v2
guard against changing another exam's approved consumer signature. It does not
batch several binding corrections.

## Construct from the actual consumer set

Schema: `archive-binding-course-correction-request-v2`.

Call the read-only `createBindingCourseCorrectionRequestV2` export from
`archive/tools/meta-foundation/register-binding-course-correction.mjs` with:

```js
const request = await createBindingCourseCorrectionRequestV2({
  root,
  requestId,
  requestedBy,
  reason,
  before, // Exact current canonical binding row, including its support UIDs.
});
```

There is no source or UID allowlist parameter. The builder independently derives
the union of old/new exact-tuple metadata consumers, runtime consumers and the
binding's supporting UIDs. Every member must have matching metadata, identity
and MIDDLE1 runtime records, the correctly spelled course, existing approved
review state, and an unchanged ACTIVE PT/TPL. Unknown sources, old-spelling
consumer metadata, missing runtime rows and unapproved consumers are refused.

Every derived source must be an original M1 exam. The builder reads its current
JS, verifies the metadata/identity ordinal denominator, and checks the affected
source question number, curriculum and native classification. Each consumer
must carry its existing compact R2 proof, exactly matched to the current
override-index entry and its SHA. The operation preserves this historical
provenance; it does not rerun R2 or calculate new approval fingerprints.

The generated request adds:

- `sourceSnapshots`: a sorted, derived source set. Each entry contains
  `sourceArchiveFile`, raw `expectedSourceSha256`, Git `expectedSourceBlobSha1`,
  `expectedQuestionCount`, and sorted `affectedQuestionUids`.
- `preservedConsumers[].sourceArchiveFile`, alongside each UID, source ordinal,
  metadata/identity/runtime row hashes and prior indexed R2 proof reference.

The other v1 bindings remain: `beforeFiles`, `beforeDocuments`, `versionBefore`,
`runtimeRecordsSha256`, and `expectedConsumerStateSha256`. Every derived source
and proof is included in the protected input snapshot. The official consumer
baseline covers **every UID in the MIDDLE1 runtime pack**, including unrelated
and pending consumers. Other runtime files are protected by raw file hashes.

Do not hand-edit or reduce the generated set. Registration recalculates it from
current authoritative files. Omitted or extra sources/UIDs, source or proof
drift, and a pre-existing corrected binding are refused before writes.

## Transaction and verification

The allowed writes and rollback are the same as v1: one binding course field,
one patch-version increment in the MIDDLE1 pack and runtime envelope,
deterministic compiled/index outputs, and a distinct
`archive-binding-course-correction-receipt-v2` receipt. Metadata, identity,
runtime records, exam JS, existing proofs and approval evidence remain unchanged.

Replay also re-derives the current source/consumer closure and requires every
derived source/proof input to remain protected. A request and receipt cannot
jointly omit the second source and still pass. Output/protection lists are
derived again from canonical inputs; a receipt's declared hashes are not a
replacement for this check.

Use the same dispatcher commands and required build/projection/final consumer
sequence documented in v1. The register pass recognizes v2, runs the correction
regressions, and invokes `--verify-projection`. The shared consumer gate checks
every source blob before comparing the whole-pack resolved/page semantic
snapshot. Classification, approval evidence, pending reasons and selection
state must remain exactly equal. Existing non-approvals stay non-approvals.

The final gate represents this operation as **one request unit**, attributed by
`requestId`, with all preserved UIDs in its denominator. Equal ordinals in two
sources remain distinct UIDs. Source-specific failures retain the same request
attribution so the existing refusal collector can isolate the whole request.
There is no collector skip, new approval lane, or partial-source success.

The PR native preview remains limited to ordinary reviewed-exam-v2 requests;
neither binding-correction v1 nor v2 receives a native-preview PASS. Obtain the
correction's proof through its own isolated transaction, official post-build
consumer verification, and actual main-writer receipt.

Apply this shared dependency before constructing a dependent exam registration
from the new main. Do not combine a subsequent exam metadata mutation with a
transaction that promises byte-identical metadata files.

## Validation and reporting

Run `node --test --test-concurrency=1 tests/archive-binding-course-correction.test.mjs`
and the directly affected consumer/refusal regressions. The file-backed tests
exercise the real transaction, compiler, dispatch and aggregate gate with an
explicitly synthetic consumer dependency. They do not prove live consumer
preservation; the official isolated and post-main comparisons remain required.

Report the exact derived source and consumer denominators, one corrected binding,
whole-pack consumer comparison, protected inputs, receipt and actual main SHA.
Keep `approvalCreated: false`, `metadataApprovalStatus: "NOT_CREATED"` and
`examFinalQaStatus: "NOT_EVALUATED"`. No mathematical review or new exam approval
is implied by a spelling correction.
