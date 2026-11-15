# AutoMeta reuse of explicit native source proofs

## Scope

`native-reviewed-source-reuse.mjs` revalidates an issued partial FINAL_QA source
review when the original request explicitly selected proposal finalization,
retained native fields, native scope fields, or the native parent carrier. It
does not issue an approval, edit source or metadata, or authorize a change in
student content. The existing figure, renderer, solution and unchanged-student
checks still govern the AutoMeta cursor.

## Durable input and current validation

The official writer's `.source-review-binding.json` stores the exact request
snapshot and selected UID/ordinal proof inventory. Reuse requires its raw output
digest, original stable request hash, exact source binding, full source denominator,
partial selection, fingerprint repair and metadata/runtime provenance markers.
Current source-review witnesses and renderer bytes are reread through the official
source reassessment helper. Native parent proofs are independently reproduced.
The current ACTIVE canonical inputs and compiled registry digests are checked;
add-only replay context is restored with the shared authenticated context helper.
Only immutable Git review objects may be cached.

Missing or changed typed evidence returns `SUPPLEMENT_PENDING` with
`NATIVE_SOURCE_REVIEW_REVALIDATION_FAILED`; it cannot fall through to MAIN_MERGE.
The claim check also recognizes the reserved sidecar file and its output digest
from an exact receipt ID, including when row markers and stored proof were erased
together. A valid mixed partial receipt uses the sidecar's UID inventory so that
another selected row's opt-in does not become this row's claim. Ordinary receipts
without any of these typed witnesses retain their existing validation paths.
An explicit prior-receipt chain is also inspected if a source-only descendant
lost every inherited row marker. A plain ancestor with no typed witness retains
the ordinary path; finding a typed ancestor requires the full authenticated replay.

## Approval-preserving descendants

A later FINAL_QA source-only rebind cannot erase the original review obligations.
The verifier follows SHA-bound prior receipts, requiring the same full denominator,
selected UID set, ordinals, identity rows and approval values. Only metadata revision
and the exact appended receipt evidence may differ. Each prior Git source is checked
against its raw SHA and the selected whole question objects remain unchanged.
The original typed sidecar is then revalidated against current witnesses, assets and
definitions. Cycles, unresolved provenance and new-approval claims are rejected.

This descendant path preserves existing approvals only. It does not silently accept
a concurrent difficulty correction or a different selected question; those operations
need their own official registration and current proof.

The official v2 writer runs this same verifier before issuing a partial source-only
descendant, using the exact prior Git source and issued tuple. Every descendant
replay repeats it with the current source and tuple. A same-path asset change therefore
blocks both first issuance and replay, even when the selected question object is
unchanged. The ordinary untyped rebind contracts remain unchanged.

## Independently inspected correction inputs

Compound renderer reuse accepts an intermediate cursor only when the official
renderer reassessment reproduces an `archive-inspected-renderer-correction-input-v1`
proof. That proof binds the independently inspected source, student payload and
renderer assets before the exact correction. An arbitrary intermediate payload is
rejected. Original native RPM and rationale bindings are replayed from their exact
registered values, and the entire reproduced proof must equal the issued proof.
The legacy figure reuse path is unchanged.

## Validation evidence

The focused regression covers direct reuse, absent/mutated sidecars, before values,
current witnesses and definitions, simultaneous provenance erasure, mixed partial
UID scope, unchanged student obligations and source-rebind ancestors. Local release
validation additionally used fresh official writer-issued root9 receipts and the
fresh retained63 receipts. Same-path SVG mutation was rejected for both direct and
ancestor reuse; restoration returned the same approval without data changes. These
local fixtures are distinct from production main registration.
