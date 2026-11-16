# E043 Q11 current target application

This contract is confined to E043 Q11, UID `qid_v1_916c03908e6a08d858a3e99febc0f465ee8e366e4496ec1788deb8ae87601546`, in `original/middle/m3/2mid/22_풍덕중_2학기_중간_중3_수학.js`. It uses a partial, one-UID metadata registration within the original 25-question denominator.

The immutable native review approved `PT_TRIANGLE_ANGLE_BISECTOR` and `TPL_TRIANGLE_ANGLE_BISECTOR_SIDE_RATIO` in its lower-grade semantic context. A separately approved current application restores the explicit original `M3-05` / `M3-05-TRIG_RATIO` operational target under the current prerequisite rule. Both existing definitions remain unchanged. The only canonical addition is one exact 2015 / 중3 수학 / M3-05 / M3-05-TRIG_RATIO / PT_TRIANGLE_ANGLE_BISECTOR binding in MIDDLE_GEOMETRY.

## Authority and request

The optional `sourceReview.currentTargetApplication` object has exactly four fields:

```json
{
  "schemaVersion": "archive-m3s2-current-target-application-v1",
  "applicationCommit": "<exact immutable commit>",
  "applicationRef": {"path": "<repository evidence path>", "sha256": "<raw SHA-256>"},
  "independentRef": {"path": "<repository evidence path>", "sha256": "<raw SHA-256>"}
}
```

The application document uses `archive-m3s2-current-target-application-binding-v1` and decision `BIND_EXACT_CURRENT_TARGET_ONLY`. Its `rootApprovalRef`, `independentRef`, and `proposalRef` bind the actual separate root approval, independent current application review, and proposal. Every reference must be present in both approval and selected-item evidence, exist locally with the same raw hash, and match the same immutable application commit. The root and independent reviewers must differ from the proposal preparer and native author.

The root approval schema is `archive-m3s2-current-target-root-approval-v1`. The independent review schema is `archive-m3s2-current-target-application-independent-review-v1`. Both decisions must be `APPROVE_EXACT_CURRENT_TARGET_APPLICATION_ONLY`. Historical descriptive local paths inside the preserved independent document are not dereferenced; their raw hashes are compared with the authenticated repository-relative application references.

The application document records the exact native item hash, before/current source references, official student payload hash, source metadata delta, existing definition hashes, exact added binding hash, and unresolved limits. Its `currentSourceRef` is resolved at `applicationCommit`, so the candidate source and authority documents must actually coexist in Git. The request must still pass the ordinary expected whole-source blob and current before-value guards.

`targetParentRef` uses the existing plain CANONICAL_MASTER reference for 2015 / M3-2 / 삼각비 / 삼각비. It has no `nativeSourceReview`, lower-grade crosswalk, or invented exact publisher leaf. The ordinary target-parent and exact ACTIVE binding validation remain required.

## Preserved boundaries

- The original native after-value remains the approved M2 tuple. Current M3 fields are marked `CURRENT_TARGET_APPLICATION` in the receipt, never `NATIVE_AFTER`.
- Original curriculum remains `UNSPECIFIED`. The retained 2015 target curriculum comes only from the explicit current source.
- The native 2015 exact RPM record and publisher parent/leaf remain unresolved. The 2022 comparison is M2-RPM-182; its binding remains unresolved. Rejected M3-RPM-059 is not restored.
- The helper never returns an RPM provenance capability and rejects non-null semantic RPM identifiers or paths. The existing M2 prerequisite capability is unchanged.
- All existing source fields except the exact nine approved target metadata fields remain unchanged. All 25 student payloads and the other 24 complete source question objects must be identical between the immutable initial before/current snapshots.
- The original renderer proof is mandatory and is revalidated by the existing renderer validator before the target helper. Its inspected assets and native/current student payload checks remain required.
- Native rationale, difficulty, source-quality flags, projection debt, and independent solution-QA limitations remain unchanged. This metadata registration does not create full mathematical QA or a `VERIFIED_FINAL` RPM resolver result.
- The shared registry impact guard still checks out-of-scope approved consumers. The helper permits only the exact add-only binding operation and no definition, crosswalk, or other registry edits.

The official registrar's `FINAL_QA` value is the existing metadata approval route. The new proof separately records `fullSemanticResolution:false`, `officialResolverVerifiedFinal:false`, and `newFullMathematicalQa:false`; it must not be reported as a new full solution certification.

## Hash domains

The official protected payload uses the exact exported `REASSESSED_STUDENT_FIELDS` contract and stable JSON hashing. The proposal's earlier four-slot payload hash belongs to a different field set and is retained only as historical evidence. It is not substituted for the official payload hash or source fingerprint.

## Receipt lifecycle

The typed opt-in is listed in the existing source-review binding sidecar contract. Issued source-review proof, original request, metadata/runtime provenance, and the sidecar are checked again on replay and native reuse. The read-only replay context removes only the exact originally added binding from the current lookup map; canonical files are not changed.

For requests combining this typed application with renderer continuity, that same restored before context is available before renderer replay. This preserves the original add-only boundary when the newly added binding already exists after issuance.

The existing source-only receipt path may preserve the approval after a later unrelated question changes. It must retain the complete selected question and current approved metadata/identity/runtime rows and follow the exact issued prior receipt. It cannot erase the typed proof or approve a changed selected question.

## Publication order

The earlier pending Q13/Q16 and preserve22 packets belong to the current source blob. Read their actual issued receipts and stored rows before publishing this source change. Create the required approval-preserving requests from those actual receipts, then run the ordinary changed-UID registration and consumer checks. Do not rewrite pending packets or invent their future receipt hashes.

Code tests issue receipts only inside disposable fixtures. They do not satisfy production registration, current main readback, four-slot generation, or student deployment checks.
