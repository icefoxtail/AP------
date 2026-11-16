# M2 S1 current definition application v1

This opt-in connects a separately approved current template and exact UID application to an unchanged native source review. The existing native record and original independent review stay unchanged. Passing the contract is a registration prerequisite; only a persisted official writer receipt proves registration.

## Files and entry point

Module: `archive/tools/meta-foundation/reviewed-m2s1-current-definition-application.mjs`.

Export `validateM2S1CurrentDefinitionApplication(ctx)` consumes the same `root/request/patch/native/row/accepted/question/final/canonicalBefore/canonicalAfter/cache/studentPayload/bankFromBytes` context as source reassessment, plus `studentFields: REASSESSED_STUDENT_FIELDS`.

It returns `null` when the opt-in is absent. When present, it returns:

- `fields`: only the new approved PT/TPL, the explicit `standardCourse` unchanged in both native and current source snapshots and the approved exact binding, two retained rationale values, and the four native RPM/scope aliases (`rpmPrimaryId`, `rpmL1`, `rpmL2`, `courseKey`). Native `after` and difficulty already supply all other values.
- `retainedRationaleFields`: a map of the two unchanged source rationale strings, for precise proof origins in the caller.
- `nativeRpmAliasFields`: a map of the four immutable RPM-derived values.
- `proof`: the immutable review/source/definition/binding/delta evidence. It explicitly records no retroactive native proposal, no new mathematical QA, no source-quality approval and no new difficulty judgment.

## Opt-in shape

The exact request object is:

```json
{
  "sourceReview": {
    "schemaVersion": "archive-reviewed-source-reassessment-v1",
    "reviewCommit": "<unchanged exact native commit>",
    "reviewPath": "<native review path in that commit>",
    "reviewRef": { "path": "<unchanged local native copy>", "sha256": "<raw SHA256>" },
    "currentDefinitionApplication": {
      "schemaVersion": "archive-m2s1-current-definition-application-v1",
      "evidenceCommit": "<one exact immutable evidence commit>",
      "definitionApprovalRef": { "path": "<original root definition approval>", "sha256": "<raw SHA256>" },
      "independentReviewRef": { "path": "<unchanged original M3 application review>", "sha256": "<raw SHA256>" },
      "applicationRef": { "path": "<root checked format-binding sidecar>", "sha256": "<raw SHA256>" }
    }
  }
}
```

All three opt-in refs must be included in both request approval and selected item evidence refs. The module compares their local bytes to the same immutable `evidenceCommit`. The source at that evidence commit is the source after the approved metadata-only changes. The sidecar omits its own commit SHA to avoid a self-reference cycle.

## Exact application sidecar

The sidecar has exactly the following keys. This is a format description, not an approval artifact.

| Key | Required value or binding |
| --- | --- |
| `schemaVersion` | `archive-m2s1-current-definition-application-binding-v1` |
| `reviewer` | Root definition approval `reviewer`; the independent reviewer remains separately identified in the original review |
| `decision` | `BIND_APPROVED_CURRENT_DEFINITION_TO_UNCHANGED_STUDENT_PAYLOAD` |
| `questionUid`, `sourceOrdinal`, `sourceArchiveFile`, `expectedQuestionCount` | E009 Q21 exact identity and whole-exam denominator 23 |
| `definitionApprovalRef`, `independentReviewRef` | The two exact opt-in refs |
| `nativeReviewRef` | `{commit, path, sha256}` of the original native review; no replacement record |
| `nativeItemStableSha256` | SHA256 of stable recursively key-sorted JSON for the actual native item |
| `sourceBeforeRef` | Root definition approval's existing `currentSourceRef` (d511 snapshot), unchanged |
| `currentSourceRef` | Exactly `{path, blobSha1, sha256, questionStableSha256}` after the metadata-only source changes; read from `evidenceCommit` |
| `protectedStudentPayloadSha256` | Stable SHA of the existing official reassessment student-payload projection |
| `noNativeProposal` | `true` |
| `nativeProposalRefs` | `[]` |
| `nativeSupportingProposalCount` | `0`, rechecked against actual native proposal inventory |
| `approvedTemplateStableSha256`, `approvedBindingStableSha256` | Stable full-object hashes from root's original approval |
| `retainedRationale` | Exact `{primaryMethod, decisiveStep}` identical in both native source snapshots, the pre-edit source and the final source |
| `nativeRpmRef` | Exactly `{commit, path, sha256, recordId, recordSha256}` for the actual native-commit `middle2.json` and its `M2-RPM-157` object |
| `sourceMetadataDelta` | Exact seven-value set and four old-value removals described below |

The module reads the original independent review and validates its UID, native item hash, source snapshots, payload field contract, parent and full/semantic definition hashes, root approval reference, rationale continuity and explicit approval boundaries. A newly formatted sidecar cannot substitute for that original review.

## Source delta

`sourceMetadataDelta.set` has exactly these seven fields:

```json
{
  "problemTypeKey": "PT_H1_EQUATION_APPLICATION",
  "templateKey": "TPL_H1_EQUATION_KNOWN_WEIGHTS_SWAPPED_QUANTITIES",
  "rpmPrimaryId": "M2-RPM-157",
  "rpmL1": "연립일차방정식",
  "rpmL2": "연립일차방정식의 활용",
  "courseKey": "M2-1",
  "integrationPattern": "NONE"
}
```

`sourceMetadataDelta.remove` preserves the exact old values of the four obsolete source annotations:

```json
{
  "projectionStatus": "RPM_ONLY",
  "ownerPack": null,
  "nullReason": "RPM_ONLY: no exact target-scope ACTIVE PT/TPL pair; null explicit.",
  "projectionReason": "middle2 RPM crosswalk mapping=RPM_ONLY; bindingStatus=NO_ACTIVE_MAPPING."
}
```

The helper reconstructs the selected final whole question from the immutable pre-edit question using exactly this delta and compares the entire object. Every unselected question in those two immutable snapshots must also remain identical. It does not accept an arbitrary `after` object. Rationale, source approval flags, student fields and all other selected-question values must remain identical. Existing native D5 and the native `integrationPattern=NONE` decision remain authoritative.

## Registry and RPM requirements

The current application permits exactly two request registry changes: one add-only template under the unchanged ACTIVE H1 parent and one add-only MIDDLE2 binding matching the native 2022/M2-1 context. Both definitions must match the original root approval and the independent definition evidence. Existing primary values or a new parent definition cannot be replaced through this route.

Current MIDDLE2 owner scope must actually include 2022 before this request is used. The helper does not duplicate that extension or infer its success from a pending request. A pack that lists only 2015 is refused. For the initial E009 application, PR #2226's E007 Q17 official scope-extension receipt must first be persisted and read back.

The helper reads the native-commit `M2-RPM-157` object, checks that the current original row is unchanged, and validates its exact path against the current LOCKED master. The approved additive direct crosswalk row must also exist unchanged. The original RPM_ONLY row is retained. The aliases identify that original path and do not select PT/TPL. The proof binds the selected original and direct records and exact LOCKED leaf, so unrelated crosswalk additions do not invalidate this UID's evidence. A later approval-preserving source rebind may change other questions, but the actual selected whole question and source denominator must still match the immutable application.

The existing `validateRpmPrimaryProvenance` source-declaration guard stays untouched. Root adds the derived aliases explicitly to source before registration. The helper independently checks the derivation and exact source delta.

## Caller integration

1. Keep the existing loadReview UID/denominator/immutable-native checks, settled native semantic decision, source/content/difficulty hold gates and protected student-payload checks before the helper.
2. Build `accepted` from the untouched native `after` and five difficulty fields as today. Let the existing native-proposal validator run and return `null`; no proposal is invented.
3. Invoke the new helper with `studentFields`. Merge only its returned `fields` into the local accepted map. Do not mutate native JSON, `row.after`, source objects, or registry objects.
4. In rationale proof generation, use `CURRENT_DEFINITION_APPLICATION_UNCHANGED_NATIVE_SOURCE` for only the two keys in `retainedRationaleFields`.
5. In RPM proof generation, use `CURRENT_DEFINITION_APPLICATION_NATIVE_RPM_ALIAS` for only keys actually returned in `nativeRpmAliasFields`. Do not call these `NATIVE_AFTER`.
6. Retain the ordinary final-value gate for every other native approved field, including D5 and auxiliary semantic fields.
7. Store the proof at `sourceReview.currentDefinitionApplication`. Add the request/proof pair to `REVIEWED_SOURCE_BINDING_OPT_INS` so the typed source-binding snapshot remains required during write, replay and AutoMeta reuse.
8. Replay restores only the original request's two exact add-only objects before re-running this helper. The original root and independent bytes, current source, exact binding and original RPM authority must all be checked again. Missing proof/sidecar must remain a refusal.
9. The opt-in is exclusive with renderer, retained-field, scope-field, native-proposal-finalization and identity-only modes. The function itself also enforces that exclusivity.

## Verification contract

Positive: exact E009 official dry run, actual write, replay, typed source-binding emission and typed AutoMeta reuse with the same source.

Negative cases with material meaning: original source/content/difficulty hold; any native proposal selecting the UID; nonempty original native primary; wrong UID/ordinal/denominator; changed native item/source/protected payload; reviewer collision; changed raw independent/root review; unapproved parent/TPL/binding; a third registry addition; missing 2022 owner scope; changed old RPM157 object or wrong LOCKED leaf; changed source rationale; changed source approval flags; any source delta outside the seven values/four removals; a request-after field absent from both native accepted values and the helper's bounded returns; removed source-binding proof on replay.

Test execution results and actual writer receipts are recorded separately; this contract does not assert operational success.
