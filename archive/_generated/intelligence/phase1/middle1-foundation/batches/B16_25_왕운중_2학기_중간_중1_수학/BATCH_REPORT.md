# M1 Meta Foundation — Batch 16 checkpoint report

- BASE_MAIN_SHA: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`
- Branch: `codex/meta-foundation/middle1`
- Source: `original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js`
- Exam title: 25_왕운중_2학기_중간_중1_수학
- Rows / unique UID: **24/24**
- Existing L1/L2 baseline used UIDs: **23/24**
- Confirmed L1_L2_CONFLICT UIDs: **1**
- Root-opened source-grounded L1/L2 candidates not flagged by A/B: **1**
- A/B reviewed: **24/24**
- A/B semantic agreement / actual conflict: **22/2**
- A/B actual conflict rate: **8.3%**
- C blind reviewed: **2/2**
- Worker-quality affected UIDs with targeted closure: **0** (C evidence rejected: 0; A/B evidence rejected: 0; A targeted replacement: 0)
- Rejected pre-ledger worker attempts (accepted UID 0): **0**
- Worker A schema / taxonomy-array corrected UIDs before consensus: **0/0**
- Worker B taxonomy-array corrected UIDs before consensus: **0**
- Conflict C schema-corrected / parent-rejudged UIDs before consensus: **0/0**
- Difficulty first-pass quality rejected and fresh blind-reviewed UIDs: **0**
- Root difficulty adjudications: **0**
- Sol direct source read (including image where relevant): **1 UID** (14)
- Semantic HOLD / ROUTE_OUT: **0/0**
- Source/solution quality HOLD: **0**; source/answer BLOCK **0**
- L1 corrections / L2 corrections: **1/1**
- Batch mapped L3 / L4 / CrossConcept usage (HOLD and ROUTE_OUT excluded): **23/24/0**
- Cumulative candidate L3 / L4 / CrossConcept: **170/293/5**
- Difficulty distribution 1–5: **0 / 9 / 12 / 3 / 0**
- Difficulty first-pass denominator: **24/24**
- Legacy compatibility: NORMAL 14; BORDERLINE_ACCEPTABLE 10
- Mandatory difficulty recheck: **23/23**
- Independent difficulty recheck runtime model verified: **true**
- Difficulty recheck rate: **95.8%**
- Recheck triggers: BOUNDARY_FLAG 17; LEGACY_BORDERLINE 9; LEGACY_STRONG_CONFLICT 1; REVIEWER_REQUESTED_RECHECK 17; VISUAL_DIFFICULTY_IMPACT 12
- Visual-triggered recheck count: **12**
- Validator: **SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING**, failure count **0**
- Protected field mutation: **0**; non-metadata mutation **0**
- Metadata writeback / ROUTE_OUT skip / HOLD skip: **24/0/0** (closure 24/24)
- Source JS SHA-256 after writeback: `2fa5e84f73db4c7f7cf48d8fd3bed3965576ef9e368edc0e1b297f1a31e64aa7`

## Deferred global gates

ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.

## Source quality and worker findings

0 archived solutions remain on explicit quality HOLD; source/answer BLOCK count: 0. Off-topic solution ordinals: none. Misleading solution ordinals: none. Root direct-read ordinals: #14. No protected source field was edited.

## Artifact SHA-256

- `INVENTORY.json`: `951a1f30afd4597ed0ca619295481d05c501d3221d480391ccdf7475efe44356`
- `INPUT_BUNDLE.jsonl`: `2b8b6c54c3b3e6215d26d74b3b6966af9fe2581c8d3d443c05433b6fe0be5f5a`
- `LUNA_A.jsonl`: `77e084474d22c98b6fba5791cb912be031edb27cbc2bfe8ec33936e60261ce78`
- `LUNA_B.jsonl`: `9e17442587c6467d4748fa8775558807e34930da5eaaff399875e42ef591e131`
- `AB_COMPARISON.jsonl`: `e4ef780f56ca313953f13e13f831c2d0af6779d9890c67581873e386a5d56bab`
- `CONFLICT_INPUT.jsonl`: `a8b9d8cc5f07e8c0032cdb5d817b9bcd2f930a3a981f29fe11c745a3a4da9942`
- `CONFLICT_C.jsonl`: `7c2ef118d88d5dfc91ece6965644b1973436872bd0b5cbebd3dd3ae32e26256b`
- `CONSENSUS.jsonl`: `dc3c7c29cc907c1fba5db09bbc23b1669bd227f78ed0253261b1826bd56cb5b0`
- `SOURCE_QUALITY.jsonl`: `8d5fd67081beb76955554be5e926e6486fc19ef0f2315f9a701516f2c6d891e0`
- `DIFFICULTY_INPUT.jsonl`: `e5b2daea9a956e8f2113fc544d859a44f1b2b0a0a5b0125cf6414c171546c296`
- `DIFFICULTY.jsonl`: `29b463e9e2c210abda4c4e7ca991d677b03f34015b35f74d1202417dadeede30`
- `DIFFICULTY_FREEZE_RECEIPT.json`: `a2f2749e11a73fb24a1c9a12357621f3944bfcc901c72dd6e01ecec7319722e0`
- `LEGACY_COMPARE.jsonl`: `e9b98d4286d4e551985f156225d84ae249ac087ea13f67835eeca78d914a402b`
- `DIFFICULTY_RECHECK_QUEUE.jsonl`: `12c5faba5be0e2d29e49aead85d7bf28462de7b0bf874a7fdc70a5a85cb1265a`
- `DIFFICULTY_RECHECK.jsonl`: `2af4c97c1db8fbc87f93b13d5b569fa4fe5d7bec60980a56f8984c39e04708a6`
- `DIFFICULTY_FINAL.jsonl`: `4333ddc5bd4e7ef5e1b6f96e0acceb384b0da25379c557e34fc10ebae29ead56`
- `WRITEBACK_RECEIPT.json`: `e1fd943a2f5f2d26eee277d48274bb9ae05c692498f2dc9706e17712d313f42d`
- `VALIDATION.json`: `69db674efef5c6a728cab238d7d8c078dc720d29e60aaa55ae3394d3fd8f3722`
- `CONSENSUS_PLAN.json`: `5a3e6b1c4e275e0856841e0de8b80c2e7deb7a84c40fe013d6e0baeade6d2f3e`
- `SOURCE_QUALITY_PLAN.json`: `88d1716cda5efdc3977feb734a537ccf274b89057799d4cb642a863e254457c3`
- `DIFFICULTY_DRAFT.jsonl`: `29b463e9e2c210abda4c4e7ca991d677b03f34015b35f74d1202417dadeede30`
- `L1_L2_CONFLICT_PLAN.json`: `3b9ec6b0486ced250986f4f28c578e98863cb0d70dcc8138e243fd823c2f76d1`
- `L1_L2_BASELINE_AUDIT.jsonl`: `b80a60bb67fb0abffd4df2ca29e114a9205b3340e55c7983474cd2307e188de7`
- `L1_L2_BASELINE_SUMMARY.json`: `df5f9a433fb7f618cd31850dfdc47a3fcfeb64b557f14a6bcc5ae11e1d3c7f29`
- `ROOT_Q14_PARALLELOGRAM_PARENT_EVIDENCE.md`: `21e423096f9ba0dc311e2368e1a2bbf5e6cbc2fbbf18d1345f8f36326bac14f2`
