# M1 Meta Foundation — Batch 10 checkpoint report

- BASE_MAIN_SHA: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`
- Branch: `codex/meta-foundation/middle1`
- Source: `original/middle/m1/2mid/24_매산중_2학기_중간_중1_기출.js`
- Exam title: 24_매산중_2학기_중간_중1_기출
- Rows / unique UID: **24/24**
- Existing L1/L2 baseline used UIDs: **21/24**
- Confirmed L1_L2_CONFLICT UIDs: **3**
- A/B reviewed: **24/24**
- A/B semantic agreement / actual conflict: **13/11**
- A/B actual conflict rate: **45.8%**
- C blind reviewed: **11/11**
- Worker-quality rejected and source-revised UIDs: **0**
- Difficulty first-pass quality rejected and fresh blind-reviewed UIDs: **0**
- Root difficulty adjudications: **0**
- Sol direct source read (including image where relevant): **11 UID** (6, 7, 10, 11, 14, 15, 16, 17, 19, 21, 22)
- Semantic HOLD / ROUTE_OUT: **4/0**
- Source/solution quality HOLD: **24**; source/answer BLOCK **4**
- L1 corrections / L2 corrections: **1/3**
- Batch mapped L3 / L4 / CrossConcept usage (HOLD and ROUTE_OUT excluded): **18/20/3**
- Cumulative candidate L3 / L4 / CrossConcept: **123/215/2**
- Difficulty distribution 1–5: **5 / 7 / 6 / 2 / 0**
- Difficulty first-pass denominator: **24/24**
- Legacy compatibility: NORMAL 13; BORDERLINE_ACCEPTABLE 7; UNKNOWN 4
- Mandatory difficulty recheck: **18/18**
- Difficulty recheck rate: **75.0%**
- Recheck triggers: BOUNDARY_FLAG 8; LEGACY_BORDERLINE 10; LOW_CONFIDENCE 4; REVIEWER_REQUESTED_RECHECK 13; VISUAL_DIFFICULTY_IMPACT 10
- Visual-triggered recheck count: **10**
- Validator: **SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING**, failure count **0**
- Protected field mutation: **0**; non-metadata mutation **0**
- Metadata writeback / ROUTE_OUT skip / HOLD skip: **20/0/4** (closure 24/24)
- Source JS SHA-256 after writeback: `734583f30952489c9d2965756f9eef10a115a5ea8df749521c00ef0071efa2f3`

## Deferred global gates

ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.

## Source quality and worker findings

20 archived solutions remain on explicit quality HOLD; source/answer BLOCK count: 4. Off-topic solution ordinals: none. Misleading solution ordinals: none. Root direct-read ordinals: #6, #7, #10, #11, #14, #15, #16, #17, #19, #21, #22. No protected source field was edited.

## Artifact SHA-256

- `INVENTORY.json`: `a9ab99cbc442dcba71bbbc859020d538089d90b46cb8c68cb0a3fda68a365e72`
- `INPUT_BUNDLE.jsonl`: `fbbd7f827408179d4eb5c0ff77688c7c9356386b9b98f23c107eea31a3323808`
- `LUNA_A.jsonl`: `4b4ceb5f688d87466ee6afe486d3033248ce916a264c5ce20a69b0103e2cc505`
- `LUNA_B.jsonl`: `31ae67e6a9dd8d2e61a19d5a90e8fa645579c9bb1fffb83599c819f22dd2bd17`
- `AB_COMPARISON.jsonl`: `912a85f20e64bd4056d3ef326b3c5072a5063d3afb57f0c499e24448ec3f233e`
- `CONFLICT_INPUT.jsonl`: `cf50a648940491a229654a602d63136c4965434b8522c2d328b5d919ac92e053`
- `CONFLICT_C.jsonl`: `737e32bbec009296c22d2ebaabbdddc4f9fcd1b5581f3ebbab5a3aaaa3480c59`
- `CONSENSUS.jsonl`: `bf9401391b2fe3166bbc8a4e835fa9c1c00bb54578c56e3af0200672821dfda5`
- `SOURCE_QUALITY.jsonl`: `faab460fc47d041a4dc81fcc92200a67a49af6654093a4d815dc494765d712e3`
- `DIFFICULTY_INPUT.jsonl`: `68d63ab92286c4fa68abf982b87c5c9ef53f659d3d8a9f331f4d9631d340d047`
- `DIFFICULTY.jsonl`: `5ff0e99d5e4f789e8d87cfcb0fc85cdb297469af7cb7306f0baf0e1c69165da4`
- `DIFFICULTY_FREEZE_RECEIPT.json`: `e072a018b74e3e01f63cdfc7044978ec74741aae6d08c70bf66d4a3cfe4fc3ce`
- `LEGACY_COMPARE.jsonl`: `a3c285f757f6f3b89a00d1ca7587416ac315b775f85815dbf232109b51b86a96`
- `DIFFICULTY_RECHECK_QUEUE.jsonl`: `1b5b059442358a83842ebf595bce5da1df41a4d5ebc4aae5fe633fd78fa2c358`
- `DIFFICULTY_RECHECK.jsonl`: `8ec0752abd7fa02fbb834d2efb6d633cdec6aa2c91f2fbae1753c75f351190dc`
- `DIFFICULTY_FINAL.jsonl`: `a157ac238e33a01761749e327a9b9f5ffed1a72d0e7eddc7837f8aafdd9d7c82`
- `WRITEBACK_RECEIPT.json`: `248dd45180efc0fd37ec9f08dddab3bad787709ceb03e7eb5c3b379a7aec72b2`
- `VALIDATION.json`: `dc6104660e165ce09ca16ca561ae67b90b96b15dfc06073213ae06d524db3088`
- `CONSENSUS_PLAN.json`: `a1e8047f70d581b80ef3ebff4614ea4988c6fd4922e9bf550f4841947edd2245`
- `SOURCE_QUALITY_PLAN.json`: `d27afba8f42d12e21d0281aba564b65ab79c717e70c56b510e51821cd6077ef9`
- `DIFFICULTY_DRAFT.jsonl`: `5ff0e99d5e4f789e8d87cfcb0fc85cdb297469af7cb7306f0baf0e1c69165da4`
- `L1_L2_CONFLICT_PLAN.json`: `13f58427fee7efbcb16916eae25c7a1667184600dc5e28420590f735b481e92b`
- `L1_L2_BASELINE_AUDIT.jsonl`: `f849f2f87c6417a60ee57db870b637ef6a337942e2eda708d08ca5f994d13776`
- `L1_L2_BASELINE_SUMMARY.json`: `ea17b5eb703fc4ff7d6962089b5a06c4080e05878f75c6dec99cab078d60cdc7`
- `AB_COMPARISON_PRE_BASELINE.jsonl`: `8a4ea1c6d68fd40b4234088a20422d1ee05bf48452def503bce832639df28e77`
- `CONFLICT_INPUT_PRE_BASELINE.jsonl`: `51b529b9a8692e621fd3daa9c5dd16574cb611bbd2d787ee2a27e25f3f504f9d`
- `B10_C_SCOPE_DELTA.json`: `5c16006d38ece154f28e76757e0961e3a314e47031c9df7de98ff6008c3ba2a6`
- `ROOT_Q06_PARALLEL_EVIDENCE.md`: `de6f77d6252a543f2f89ad9ed0b16de780a6462c6ef6dab993f8a36c580508c5`
- `ROOT_Q15_CUBE_NET_EVIDENCE.md`: `a4041d45078f3039f29ad383aff9226e50a779ddc26901c53c8ad65958d8e64d`
- `ROOT_B10_UNRESOLVED_VISUAL_HOLDS.md`: `f76e3f11f001872094410874902f918d8ceec7d865566a715db19ed5696ab56a`
