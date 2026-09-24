# M1 Meta Foundation — Batch 11 checkpoint report

- BASE_MAIN_SHA: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`
- Branch: `codex/meta-foundation/middle1`
- Source: `original/middle/m1/2mid/24_연향중_2학기_중간_중1_기출.js`
- Exam title: 24_연향중_2학기_중간_중1_기출
- Rows / unique UID: **22/22**
- Existing L1/L2 baseline used UIDs: **20/22**
- Confirmed L1_L2_CONFLICT UIDs: **2**
- A/B reviewed: **22/22**
- A/B semantic agreement / actual conflict: **13/9**
- A/B actual conflict rate: **40.9%**
- C blind reviewed: **9/9**
- Worker-quality affected UIDs with targeted closure: **2** (C evidence rejected: 2)
- Difficulty first-pass quality rejected and fresh blind-reviewed UIDs: **1**
- Root difficulty adjudications: **0**
- Sol direct source read (including image where relevant): **10 UID** (6, 7, 8, 10, 11, 14, 15, 18, 19, 22)
- Semantic HOLD / ROUTE_OUT: **1/0**
- Source/solution quality HOLD: **22**; source/answer BLOCK **1**
- L1 corrections / L2 corrections: **1/2**
- Batch mapped L3 / L4 / CrossConcept usage (HOLD and ROUTE_OUT excluded): **18/21/0**
- Cumulative candidate L3 / L4 / CrossConcept: **130/228/2**
- Difficulty distribution 1–5: **6 / 7 / 6 / 2 / 0**
- Difficulty first-pass denominator: **22/22**
- Legacy compatibility: NORMAL 17; BORDERLINE_ACCEPTABLE 4; UNKNOWN 1
- Mandatory difficulty recheck: **18/18**
- Difficulty recheck rate: **81.8%**
- Recheck triggers: BOUNDARY_FLAG 11; LEGACY_BORDERLINE 8; LOW_CONFIDENCE 1; REVIEWER_REQUESTED_RECHECK 13; VISUAL_DIFFICULTY_IMPACT 11
- Visual-triggered recheck count: **11**
- Validator: **SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING**, failure count **0**
- Protected field mutation: **0**; non-metadata mutation **0**
- Metadata writeback / ROUTE_OUT skip / HOLD skip: **21/0/1** (closure 22/22)
- Source JS SHA-256 after writeback: `65ececa5d00c68494b828a85f0afb003294eca625c9353f7643205eaa17f6e77`

## Deferred global gates

ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.

## Source quality and worker findings

21 archived solutions remain on explicit quality HOLD; source/answer BLOCK count: 1. Off-topic solution ordinals: none. Misleading solution ordinals: none. Root direct-read ordinals: #6, #7, #8, #10, #11, #14, #15, #18, #19, #22. No protected source field was edited.

## Artifact SHA-256

- `INVENTORY.json`: `2105fbcaf0b598dc20e4fb789d382b6a5ae57548fc6fdfdfb3f85411c9f70f8a`
- `INPUT_BUNDLE.jsonl`: `a16db0c2778f079703a87282518c9aab56ee12b1d68129faa5f77fa9fb6e799c`
- `LUNA_A.jsonl`: `3f29b3ae54c3a97784e93854072b7494c530c1be73b28d9b5b7c04fc9b409349`
- `LUNA_B.jsonl`: `92e4eab33f4324f2a3fd27b0aff59e6c488534dfba5ca29c58ea1b8730763b82`
- `AB_COMPARISON.jsonl`: `128e87023664914b70dbef00764b414d89b160afe20d086fc77383791fddd42a`
- `CONFLICT_INPUT.jsonl`: `58dc5f02511d07409118a0b6d37e9eaff1255db60f1570e39dc6345ea40d1e52`
- `CONFLICT_C.jsonl`: `8f73243c2cb384e22f4e944e1fe795623eb11a1e570e95b77bbe36c0948505fe`
- `CONSENSUS.jsonl`: `ac75b42670bf7fd057356725ce5a58f6b1383cad0ba445b0116b6f55e8c9ed92`
- `SOURCE_QUALITY.jsonl`: `cfbeae17101c568c87ca77aa179845d754bc988ee4e50cc8b955fd8401a4b36f`
- `DIFFICULTY_INPUT.jsonl`: `a7d7bb3d08d8eb39e4f586726dbf7d704e132ee58b8537be25a0ef9e1d727523`
- `DIFFICULTY.jsonl`: `e79f3b530c1261a17188f896d64dbaa67991b4e26810d19d024264ac5ab3d542`
- `DIFFICULTY_FREEZE_RECEIPT.json`: `585e0711ad19911d009e5d4089b90bd35fe2ce6a2d3bd789d90d3e19ed6f3d89`
- `LEGACY_COMPARE.jsonl`: `74a4c6e8153bd5a1aed456ae90f2cacd7aeeed8103c13d20a2d865f19a48b39b`
- `DIFFICULTY_RECHECK_QUEUE.jsonl`: `f89eb7e43365f93793eb733ed4317ff22b56148329df0a5956ecacea8f30e607`
- `DIFFICULTY_RECHECK.jsonl`: `1ea70a066a202d0bda71ab582d7a6a3ee5801b3daa62033e1508cb608a7ace66`
- `DIFFICULTY_FINAL.jsonl`: `ef3f3af55721a782b6c163fc840be93b1d08ea8251dd47d9f9ee2744800b72f3`
- `WRITEBACK_RECEIPT.json`: `30bca883d6c59d7b0b03fbea1d2b610d5c3d03f1facf3c4d219ae58e75c9279f`
- `VALIDATION.json`: `b1bf3653ffa06e92fbec71ffd8d3febc8ff69ac349657af1b8503fa13c619595`
- `CONSENSUS_PLAN.json`: `5fe1c9d8db26e4dacb171f9f022da5d69a9fa3227be26b6ddf34275d8472f86e`
- `SOURCE_QUALITY_PLAN.json`: `d17c83a4ae191a65902189e6f3504e380340e53a001206a15a83e4c74e88a4c3`
- `DIFFICULTY_DRAFT.jsonl`: `da2f030020d7f4ba17f341617a9f865551ef6605925c96605d2049101d85c62a`
- `C_QUALITY_DEFECTS.json`: `4168335b824a2e7d7bf4ea2fb182e7bd5b77cdb56271c632cb4625794563e984`
- `DIFFICULTY_INPUT_PRE_L4_REUSE.jsonl`: `90c0e9a55aae0184328213cf035245e26d56136307a3d622e3f61a542b56ceeb`
- `B11_L4_REUSE_INPUT_DELTA.json`: `65806fefc8503b73e713f58dbe06195fb29f93e952b65ab6184363d1d71597cb`
- `DIFFICULTY_BLIND_INPUT_Q19.jsonl`: `f6ece5daf1c4d6f574a663a62e223d5007ce253e4da11b854745c31a46f42d1f`
- `Q19_SHARED_MATERIAL_REF.json`: `62667d8ecb8a150d492b48fb4c85ee20858f7abd1934b5cdda6798e27f93406d`
- `DIFFICULTY_BLIND_CORRECTION_Q19_RAW.jsonl`: `9351d385e00c45b6aecd1e3216acc94e350821e7689f52d39a59c01a4f614a4f`
- `DIFFICULTY_BLIND_CORRECTION_Q19.jsonl`: `624cd93a6025178d7e709c3613a6df5c87c779fbd0486ec8e02fda5f074ee944`
- `B11_Q19_SCHEMA_NORMALIZATION.json`: `71064eb44428f1762633e7279e704a15c79fbb7ecccdd82797837af557dd042a`
- `B11_DIFFICULTY_QUALITY_REJECTION.json`: `ff7c11a8707eef519a036dc141f1419ead2df82e3ad691b492053a82d7f7e71c`
- `DIFFICULTY_RECHECK_QUEUE_PRE_ADJUDICATION.jsonl`: `169a2ef254f7bce51401b5f16f1df592fb73cc281d7dd1cebf3949e84360f6d3`
- `B11_RECHECK_TRIGGER_ADJUDICATION.json`: `9d0b8490481f9ae0dae45caeb9c8f7def43129342631941253df185835f35cb4`
- `L1_L2_CONFLICT_PLAN.json`: `a9f6ac854d0e4e9742435c0d3c903f8440fb49ec3fb9aefad13b35dcfb4570ec`
- `L1_L2_BASELINE_AUDIT.jsonl`: `c23f14386c5e5816d80c94a548fa255cf8e93eac077bad57d1cf25241699fb27`
- `L1_L2_BASELINE_SUMMARY.json`: `911c60b0fe8ebeb0bceab6fac049b5f34ca65ee9a840b36c0a2893096849469e`
- `ROOT_Q06_ZIGZAG_ANGLE_EVIDENCE.md`: `90d6e8545421320a81a9c04428c731d72eafd51a8ad1a2877564658bcbca1c07`
- `ROOT_Q07_CUBE_NET_L1L2_EVIDENCE.md`: `9ce272937abdf88518ffe346b3aebfe7770e6509b108bddf6f1e6b2f69cf4cda`
- `ROOT_Q08_FOUR_ANGLE_EVIDENCE.md`: `11dcd497c49ba4e769f1fe0d7ea3d27e8cdcdd5d65d6dd1d681a4fd834c7fbb7`
- `ROOT_Q10_CONSTRUCTION_SOURCE_HOLD.md`: `20379db1a00e57f0396e5fb4cd78f220f5e9c0de6506f207923137700f6e9339`
- `ROOT_Q11_CURRICULUM_METHOD_EVIDENCE.md`: `367101821f058035eea6b60a902e38ba84a5663b0a373c2d9441a8bf0842e395`
- `ROOT_Q14_L1L2_EVIDENCE.md`: `799dd2db11253ac22efaf4a4ce9dd9a2f24d0458e900a9c7e51b19cfe2231b0e`
- `ROOT_Q15_SHARED_IMAGE_EVIDENCE.md`: `2eb1b1eb9f2227fdd6389f2f2bb112d4acfb8a03417a4618b1e70b46099305f0`
- `ROOT_Q18_SHARED_IMAGE_EVIDENCE.md`: `b492b70598a5d942408f6e730beb4d94a9b37b42f5461b8da2a3c6dc739f7c2d`
- `ROOT_Q19_SHARED_TABLE_C_DEFECT.md`: `f9152e2d47d6da02d33ea0ef11bd1f1db02abc2d7bcc30fada53a58b1d742a9c`
- `ROOT_Q22_FOLD_ANGLE_C_DEFECT.md`: `534d7ed8fd5983efe30fb4810694e8406731ac7d6f1c2816267162f6b8f7879f`
