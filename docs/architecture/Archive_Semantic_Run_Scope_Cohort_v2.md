# Semantic run scope: exact cohort and complete HEAD inventory v2

This is an opt-in execution boundary for one batch. It grants no registration,
mathematical, metadata, or renderer approval. Native requests retain their original
registrar, provider ordering, immutable evidence, current-value, and Consumer gates.
The v1 descriptor and binding remain unchanged, including its exact-inbox equality
and `EXTRA_INBOX` refusal. V2 is a separate closed schema; it is not a v1 exception.

## Descriptor and activation

An immutable HEAD file under `.archive-meta-register/auto/run-scopes/` has exactly
these keys:

```json
{
  "schemaVersion": "archive-semantic-run-scope-v2",
  "scopeId": "middle-registration-phase1",
  "phase": "phase1",
  "excludedSourcePrefixes": [
    "original/middle/m3/1final/",
    "original/middle/m3/1mid/"
  ],
  "cohortBindings": [
    {"path": ".archive-meta-register/inbox/example.json", "sha256": "<exact raw SHA-256>"}
  ]
}
```

The example is illustrative and cannot pass until its digest is replaced with an
actual request digest. Each binding has only `path` and `sha256`. Paths are unique,
flat inbox JSON paths. The cohort has 1–500 entries. Scope ID, phase, descriptor
path, exclusions, UTF-8 decoding, and regular-file restrictions match v1.

If every cohort path is absent from HEAD, this batch is inactive; other owners'
pending requests do not keep the exclusion alive. If some cohort paths remain,
resolution fails with `PARTIAL_INBOX`. If all remain, each must be a regular
`100644` Git blob with its exact declared raw digest. A changed bound request fails.
An empty cohort, unknown field, duplicate path, or more than one active descriptor
fails. A consumed batch uses the existing stable inactive proof, so an unrelated
future HEAD does not create a new inactive parameter fingerprint.

## Complete inventory and proof

While v2 is active, the resolver reads every tracked entry beneath the inbox from
the same immutable HEAD. Every entry must be a flat JSON path and a `100644` blob.
Nested paths, non-JSON entries, symlinks, executable files, or an inventory exceeding
500 entries fail; the resolver never truncates or silently skips them. Every blob
is read as bytes and hashed before producing a binding. JSON and approval validity
remain the official registrar's responsibility; hashing an input does not approve it.

The `archive-semantic-run-scope-binding-v2` value contains the HEAD, descriptor raw
digest, scope identity, exclusions, sorted `cohortBindings`, and sorted complete
`inboxBindings`. Its `scopeDigest` covers those exact fields. The public report
also exposes `cohortInputCount` and `boundInputCount`. Both arrays, both counts, the
HEAD, and the digest are compared exactly on replay and verify-local. Adding or
changing another owner's request at a new HEAD therefore requires a newly derived
proof; it does not require changing the descriptor's cohort. Working-tree or index
edits and request consumption cannot change the HEAD inventory during an invocation.

The complete inventory count is a byte-binding count, not a registered-UID count.
PR preparation still validates its existing changed-request/provider closure, and
main/push preparation still sends its complete pending request set through the
official registrar. V2 does not add a selector, ignore unknown requests, suppress
unsupported-schema errors, or merge another owner's approval into this cohort.

## Existing protection and verification

AutoMeta, its batch replay and verification, the production writer's parameters and
regeneration, PR preparation, and registration proof verification all resolve the
same helper. An active v2 scope carries the same exact M3S1 exclusions as v1. The
existing private start/end guard still protects metadata, identity, runtime rows,
four-slot rows and cache fields, and pre-existing pending debt. Excluded source/UID
movement, new excluded rows, and removed debt remain forbidden. The sole verified
four-slot cache-rekey capability remains process-local and cannot be forged by JSON.

The resolver does not mark deferred work complete. The existing continuation rule
counts only allowed unattempted work, while excluded debt is retained and reported.
The next HEAD with the entire cohort consumed returns to the normal unscoped policy.
HEAD drift during a guarded operation, missing or modified proof inventories, and
failed scope resolution continue to fail closed before publication. The writer's
existing reset of previous PASS evidence remains before scope resolution.

The new helper suite covers cohort activation and exhaustion, concurrent inventory
binding, raw-byte hashing, malformed entries, immutable-HEAD and working/index
separation, private capabilities, excluded debt, and proof tampering. Existing
AutoMeta, writer, PR prepare, and proof suites exercise the v2 branch alongside their
unchanged v1 cases. No test fixture creates production approval evidence.
