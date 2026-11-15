# Unchanged values omitted from an M2 native review delta

This explicit source-review lane transports a value that the original native
review left out of its `after` delta. It does not infer that value from the
current metadata, promote an unresolved primary, or create a new definition.
Ordinary requests without this opt-in keep their existing refusal behavior.

```json
{
  "sourceReview": {
    "schemaVersion": "archive-reviewed-source-reassessment-v1",
    "reviewCommit": "<exact immutable native commit>",
    "reviewPath": "<native review path at that commit>",
    "reviewRef": { "path": "<local exact native copy>", "sha256": "<raw SHA256>" },
    "retainedFields": {
      "schemaVersion": "archive-reviewed-native-retained-fields-v1",
      "fields": ["problemTypeKey", "templateKey", "conditionKeys"]
    }
  }
}
```

The existing source reassessment authenticates the native review, the entire
bank denominator, the selected UID and ordinal, and both immutable student
payloads before calling this helper. This lane additionally requires an
ordinary `PARTIAL_UIDS` / `FINAL_QA` request and a settled M2S2 native review.
It refuses identity-only, source rebind, renderer continuity, proposal
finalization, registry mutations, unresolved proposals and explicit holds.

## Exact retained values

The eight governed values are `standardCourse`, `standardUnitKey`, `subUnitKey`,
`problemTypeKey`, `templateKey`, `crossConceptKeys`, `conditionKeys` and
`integrationPattern`. Each selected field must be absent from the accepted
native delta, present in both actual Git source snapshots, and equal in those
snapshots, the current source, the request and the final metadata row.

The optional `standardUnit` and `subUnit` display labels have an additional
restriction: the corresponding parent key must itself be selected for
retention, and the value must equal the existing active master row's exact
`labelKo`. A free-form display label is not admissible. The parent hierarchy
and the native RPM record must independently agree with the final parent.

The native RPM record is read from the original review commit, and its raw
file SHA must occur in both evidence lists. Its curriculum and M2S2 scope must
equal the final curriculum and course. Current ACTIVE PT/TPL definitions and
the unique exact curriculum binding must remain byte-equivalent as objects
before and after registration; the template parent and definition owner must
also agree.

An omitted primary requires the native `activeDefinitionMatch` to explicitly
name that same ACTIVE PT and template, their parent and one exact ACTIVE
curriculum binding. A null or different match is rejected even when the
current definitions list the selected UID. Supporting UID membership is
recorded as additional provenance; missing membership does not replace the
mandatory per-item native match, exact binding and field review.

For auxiliary fields, the helper checks the original per-field review as well
as the source values. An empty CC or condition set requires an explicit absence
review. This version only retains empty conditions. A nonempty CC must name an
unchanged ACTIVE concept whose exact canonical label appears in that native
review. Integration admits only the observed `NONE` and `SEQUENTIAL` forms
with their corresponding explicit native review. Optional prose such as
`integrationReason` is not added to this retention contract.

## Receipt and subsequent gates

The receipt's `fingerprintRepairs[].sourceReview.retainedNativeFields` contains
the exact field-value hashes, native item and field-review hashes, original
source blobs, native RPM reference, primary definition hashes, exact binding
hash and any master/concept bindings. The original native-only lane records no
new field judgment. Both lanes record no new mathematical QA, definition or
inferred value. The registrar still performs
its complete metadata, identity, runtime and Consumer gates. This proof is
not a new review authority or a production-registration claim.

The initial real diagnostic separates 58 source-consistent applications from
six null or conflicting native primary matches. The native-only lane rejects
all six. Requests which copied optional prose absent from the native delta
omit that requested change and preserve the previous metadata value; the
source prose is not silently approved. All native review documents remain
unchanged.

## Independently reviewed existing primary

An explicit `retainedFields.independentPrimary` reference can separately bind
an independent disposition of an existing PT/TPL. It has exactly the keys
`schemaVersion: archive-reviewed-existing-primary-disposition-v1`,
`reviewCommit` and `reviewRef: {path, sha256}`. Its raw evidence is fixed in Git
and in both the approval and selected-item evidence lists. This option never
rewrites the original null or different native match or expands the native
`after` delta.

The independent document uses schema
`archive-independent-existing-primary-disposition-v1`, scope
`EXISTING_PRIMARY_RETENTION_ONLY`, a distinct named reviewer and the exact
selected UID and ordinal. It binds the original native item, `after` and match
hashes, both immutable source snapshots, the independent current-source
snapshot and the full unchanged current ACTIVE PT/TPL and unique binding
records. Supporting UID membership must be reported truthfully; an independent
applicability decision is not a change to a GLOBAL definition's support list.

Only the existing primary pair and explicitly reviewed empty CC/condition
sets may be retained. The independent decision cannot approve a changed
student payload, new definitions, difficulty, REVIEW2 or full mathematical
QA. All referenced renderer assets require a complete inventory, actual
visual-inspection evidence and matching raw/Git hashes in the original,
reviewed and current snapshots; their live bytes are checked on every call.
Current source differences outside absent exact native curriculum/course
transport are rejected.

The receipt records the independent reference and applicability decision
separately from the unchanged native item/match/after. It deliberately omits
the native-only `newFieldJudgments: false` flag for this branch. The actual
diagnostic has five independent approvals and one explicit HOLD (E015 Q22);
the HOLD remains excluded from the 63 selected registration candidates.

Receipt replay repeats the explicit retained-fields proof against the original
request, metadata/identity before fingerprints, immutable native and independent
witnesses, current ACTIVE definitions and live renderer bytes. It requires the
exact selected proof inventory and complete recalculated source-review equality;
deleting or changing a stored witness is refused. Renderer, retained-fields and
native-parent replay share one immutable-evidence cache and validated per-UID
context. Ordinary source reviews without these opt-ins retain their existing
replay behavior.
