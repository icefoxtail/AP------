# Palma B01–B07 APPROVED_UIDS / HOLD_UIDS closure

This is a SHA-bound **pre-registration eligibility roster**, not a claim of Consumer DB registration or student supply.

- Draft candidates: **27**
- APPROVED_UIDS: **4**
- HOLD_UIDS: **23**
- Ordered list commitment (SHA-256): $( @{rosterVersion=PALMA_H1_2025_B01_B07_APPROVAL_ROSTER_V1; purpose=Pre-registration control-plane eligibility roster; this is not Consumer DB registration or student-supply verification.; candidateCount=27; approvedCount=4; holdCount=23; APPROVED_UIDS=System.Object[]; HOLD_UIDS=System.Object[]; excludedSourceHolds=System.Object[]; evidenceHashes=; orderedUidListCommitment=; registrationState=}.orderedUidListCommitment.combinedApprovedHoldListsSha256 )
- Review and receipt SHA-256 values, candidate hashes, contract hashes, and the deterministic payload rule are in APPROVED_UIDS.json.

## Approved

These four B07 candidates have content PASS and completed-review evidence ACTIVE_MAPPING_RECORDED for exact active H1 crosswalk/PT-TPL/curriculum bindings (H1-RPM-232, -233, -235, -236). Under the current consumer closeout contract they are eligible for the approved registry. Their displayed RPM L3/L4 taxonomy status remains CANONICAL_DRAFT; no taxonomy promotion is made.

- ALITE-PALMA25-H1-2MID-B07-Q01-BP01
- ALITE-PALMA25-H1-2MID-B07-Q01-BP02
- ALITE-PALMA25-H1-2MID-B07-Q13-BP01
- ALITE-PALMA25-H1-2MID-B07-Q13-BP02

## Holds

- B01 0001, 0002, 0003, and 0006; B02 Q08/Q20; all B03; all B04; B05 Q09/Q18; and all B06: content PASS, but the bound review JSON/receipt does not explicitly record an exact active consumer projection. Their existing L3/L4 labels are CANONICAL_DRAFT; absent mapping eligibility evidence, they remain HOLD.
- B01 Q12/Q19 and B05 Q04: proposed EXT-L4 entries remain unpromoted and non-consumer-selectable.
- B02 Q10: static SVG mathematics passed, but actual exam-engine render is NOT_RUN; supply remains blocked pending render.
- B07 Q13-BP03: content PASS, but exact candidate-specific projection remains PROJECTION_BINDING_PENDING.

Source-level HOLD qids B02/16 and B03/11 are excluded because they have no candidate rows. The B01 Q22 difficulty pinpoint recheck is PASS; its corrected target difficulty is level 중, bucket 3. No candidate files or taxonomy keys were changed. consumerDbRegistered=false, studentSupplyVerified=false, and no render pass is claimed.
