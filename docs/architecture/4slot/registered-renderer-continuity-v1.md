# Registered renderer continuity for an existing four-slot vector

This narrow route reuses an already issued native semantic renderer receipt for one existing compact item. It does not edit the compact, add a four-slot approval, replace a source hold, or change ordinary search and selection eligibility.

Inputs live outside the compact tree at `.archive-meta-register/4slot-renderer-continuity/*.json`. One sidecar selects one canonical UID and source ordinal. Duplicate or inconsistent selections fail for that UID. The builder retains the entire compact's historical payload and asset baselines, including every unselected item's pending state.

The closed `archive-four-slot-registered-renderer-continuity-v1` object contains:

- `scope: EXISTING_VECTOR_ONLY`, `newFourSlotApprovals: 0`, `newMathematicalQa: false`.
- Exact `sourceArchiveFile`, `questionUid`, `sourceOrdinal`, `sourceQuestionNo`, and `sourceDisplayNumber`.
- `compactRef` and `compactItemSha256`, binding the existing reviewed file and unchanged item, including format, four vectors, candidates, and any hold. A held item cannot use this route.
- `dictionaryRef`, binding the current dictionary bytes and the compact's dictionary version.
- `currentSourceRef` with repository path, raw SHA-256, and Git blob SHA-1.
- `receiptRef`, `rendererBindingRef`, and `independentReviewRef`, each an exact repository path and raw SHA-256.

The receipt must already exist in the official reviewed-exam output directory and bind the exact current source. The current shared record must retain the receipt's issued values and FINAL_QA/ACTIVE approval. Current canonical/compiled registry validation must succeed, and the actual current runtime must have one UID row under its ACTIVE owner with every issued runtime value unchanged. The original `nativeReviewedRendererRebind` validator replays the immutable native decision, independent renderer witness, full asset inventory and current asset bytes. The compact's historical question is passed as the prior payload, so an unrelated earlier snapshot cannot borrow the receipt.

Successful rows use `sourceBinding: REGISTERED_RENDERER_CONTINUITY` and include the sidecar reference. The read-only consumer requires the exact sidecar path/SHA shape and freezes the reference. They retain `independentReviewClaim: false`: the existing vector is reused, not independently reviewed again. Invalid or missing evidence leaves only the selected row pending. No official receipt or renderer-binding output may be hand-authored to satisfy this contract.

The builder cache and main writer include sidecar, official receipt, independent evidence, current shared metadata, canonical/compiled registry and validator inputs. Removing a receipt or changing a bound proof invalidates reuse. The sidecar is an input to the existing single main writer; it does not introduce another index writer or publication path.
