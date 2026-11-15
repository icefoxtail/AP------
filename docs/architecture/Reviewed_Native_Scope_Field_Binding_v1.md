# Reviewed native scope field binding v1

This optional source reassessment adapter preserves two explicit scope provenance fields that were already present in both immutable M3 native source snapshots but omitted from the native metadata delta. It makes no new course, classification, difficulty, or mathematical judgment.

The only supported pair is `semanticSourceScope: "M3-1"` and `semanticScopeRelation: "CURRENT_SCOPE"`, with explicit original curriculum `2015`, the native `M3-04` quadratic-function classification, and the exact native RPM parent. This contract does not infer a curriculum from a date or turn a lower-grade prerequisite into a current target course.

## Explicit request

An ordinary `PARTIAL_UIDS` / `FINAL_QA` request may add the following member to its existing immutable `item.sourceReview`:

```json
{
  "scopeFieldBinding": {
    "schemaVersion": "archive-native-reviewed-scope-fields-v1",
    "fields": ["semanticSourceScope", "semanticScopeRelation"]
  }
}
```

Both fields must be explicitly present in `item.after` and must remain exact in the resulting metadata. The native `after` document remains unchanged. The ordinary registrar still checks real metadata/identity before values, source fingerprints, source parity, and canonical parent/registry validity.

The optional adapter is exclusive with identity-only, source-rebind, renderer-continuity, other retained-field, and proposal-finalization adapters. Missing opt-in returns no authorization; malformed or mixed opt-in is rejected.

## Required bindings

- Both immutable native source banks, the current source, the request, and the final record must contain exactly the same two own-property values.
- The native decision must be settled for the exact UID, ordinal, and original M3 second-semester source path.
- The native original curriculum and source curriculum must both explicitly be `2015`; the native RPM base, current source RPM ID, final RPM ID, and final `courseKey` must identify the same `M3-1` context.
- The native approved primary tuple must remain exact across both native banks, the current source, and the final metadata. Its PT/TPL definitions must already be ACTIVE and remain byte-equivalent as canonical objects.
- The final registry plan must contain the exact ACTIVE binding in `MIDDLE3`; that pack must own the unit and support both course labels and the curriculum. Its parent labels must equal the native RPM parent.
- A SHA-bound `targetParentRef` to the canonical master, present in both approval and item evidence references, must name that same curriculum, scope, and parent. The normal registrar separately authenticates the referenced master and resolves the parent.

The receipt stores hashes of the two transported fields, native item and RPM base, unchanged PT/TPL definitions, exact ACTIVE binding, and canonical parent reference. It explicitly records that no new classification, definition, or mathematical QA was performed.

## Integration

`bindReviewedNativeScopeFields` belongs after immutable native loading, protected-payload checking, and native `after` construction, and before the ordinary changed-field/complete-after checks. Its returned `fields` are merged into the local accepted-value map; its `proof` is retained as `scopeFieldBindings` in the source reassessment receipt. The original native document is never modified.

The caller must continue to run every ordinary registration and consumer gate. A helper test or a registration dry run is not a production release receipt.
