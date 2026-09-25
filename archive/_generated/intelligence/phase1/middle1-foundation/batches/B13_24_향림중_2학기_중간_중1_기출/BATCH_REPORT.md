# M1 Meta Foundation — Batch 13 checkpoint report

- BASE_MAIN_SHA: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`
- Branch: `codex/meta-foundation/middle1`
- Source: `original/middle/m1/2mid/24_향림중_2학기_중간_중1_기출.js`
- Exam title: 24_향림중_2학기_중간_중1_기출
- Rows / unique UID: **23/23**
- Existing L1/L2 baseline used UIDs: **21/23**
- Confirmed L1_L2_CONFLICT UIDs: **2**
- Root-opened source-grounded L1/L2 candidates not flagged by A/B: **1**
- A/B reviewed: **23/23**
- A/B semantic agreement / actual conflict: **19/4**
- A/B actual conflict rate: **17.4%**
- C blind reviewed: **4/4**
- Worker-quality affected UIDs with targeted closure: **1** (C evidence rejected: 0; A/B evidence rejected: 0; A targeted replacement: 1)
- Rejected pre-ledger worker attempts (accepted UID 0): **2**
- Worker A schema / taxonomy-array corrected UIDs before consensus: **22/23**
- Worker B taxonomy-array corrected UIDs before consensus: **23**
- Conflict C schema-corrected / parent-rejudged UIDs before consensus: **4/1**
- Difficulty first-pass quality rejected and fresh blind-reviewed UIDs: **0**
- Root difficulty adjudications: **0**
- Sol direct source read (including image where relevant): **4 UID** (6, 11, 16, 18)
- Semantic HOLD / ROUTE_OUT: **0/1**
- Source/solution quality HOLD: **23**; source/answer BLOCK **0**
- L1 corrections / L2 corrections: **2/2**
- Batch mapped L3 / L4 / CrossConcept usage (HOLD and ROUTE_OUT excluded): **20/22/1**
- Cumulative candidate L3 / L4 / CrossConcept: **141/254/2**
- Difficulty distribution 1–5: **3 / 8 / 7 / 5 / 0**
- Difficulty first-pass denominator: **23/23**
- Legacy compatibility: NORMAL 20; BORDERLINE_ACCEPTABLE 3
- Mandatory difficulty recheck: **15/15**
- Independent difficulty recheck runtime model verified: **true**
- Difficulty recheck rate: **65.2%**
- Recheck triggers: BOUNDARY_FLAG 14; LEGACY_BORDERLINE 3; REVIEWER_REQUESTED_RECHECK 15; VISUAL_DIFFICULTY_IMPACT 9
- Visual-triggered recheck count: **9**
- Validator: **SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING**, failure count **0**
- Protected field mutation: **0**; non-metadata mutation **0**
- Metadata writeback / ROUTE_OUT skip / HOLD skip: **22/1/0** (closure 23/23)
- Source JS SHA-256 after writeback: `9463c99c5f8b5cbd1f93197d1e3823c914e13f96c29d5c1954ede213bbc540d7`

## Deferred global gates

ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.

## Source quality and worker findings

23 archived solutions remain on explicit quality HOLD; source/answer BLOCK count: 0. Off-topic solution ordinals: none. Misleading solution ordinals: none. Root direct-read ordinals: #6, #11, #16, #18. No protected source field was edited.

## Artifact SHA-256

- `INVENTORY.json`: `b04e518d417747775c5288710410167e1f908acc2b6885c7fd5db2caef7627a0`
- `INPUT_BUNDLE.jsonl`: `fc05da27d151e6b496d7f262edf709f5b1444d04767a6c43aed392b19b66480c`
- `LUNA_A.jsonl`: `c55dd10e89b30314f71e37c05e2ace42d41510c2e439217ee4cfbae7ca3f5057`
- `LUNA_B.jsonl`: `4d51adde61c38a232b28119737c10d997b84f54498df10ef47f77f6be47884c5`
- `AB_COMPARISON.jsonl`: `1c54cc4f83a289a8ee505f863cc89dc30419fca827a013f531749771f7ab80c2`
- `CONFLICT_INPUT.jsonl`: `5d00bcaceaeca0c6994ba6a7f3725296c600929b174c8ceac711f3b6e21ccc05`
- `CONFLICT_C.jsonl`: `4433a7d11e65d92b0c79dd0fab4805c978ad70931061199eed1d6083bfee1e81`
- `CONSENSUS.jsonl`: `3cd588869dafbf41b48887d2b508b29a59019f51876af468c6adbe5a0a4ec522`
- `SOURCE_QUALITY.jsonl`: `3b1200bfefebe6f71f7288637279d7d622b8e24411553415eee0ef314ee76526`
- `DIFFICULTY_INPUT.jsonl`: `52e3e9cb7c90e40827af1701965765eae920bcd4081595421bc2821d4d5ad4ad`
- `DIFFICULTY.jsonl`: `f1b3676473c0979d37f3ecf743db8a277d42d59940c6f7d22478b01be5d076e5`
- `DIFFICULTY_FREEZE_RECEIPT.json`: `e067519574982b7c5757bb31eecd6522c6132848ea886793f1e5d76ca686ae7d`
- `LEGACY_COMPARE.jsonl`: `6b126b9cd9aef1b1fd7498177cec875d49715c57a0ac2db56f79b588c154e9d2`
- `DIFFICULTY_RECHECK_QUEUE.jsonl`: `947ee52eb8eacf5f2b1d6022c26532a1817c413e2400bf467c1d97ea9257809a`
- `DIFFICULTY_RECHECK.jsonl`: `285ad2d879ab3ad83e701163a657d39ee2694baed1c9297ea790a1b8dbd2e451`
- `DIFFICULTY_FINAL.jsonl`: `4afcb807ccced6cac16d68d06ad592cd24b9d8950cd65136cdc5065a9186d2cd`
- `WRITEBACK_RECEIPT.json`: `a03bccd2d6dede06969c9730bac9c6e8f8529379beb38e38298f85f103f4ee62`
- `VALIDATION.json`: `d688f0f8ab0dd5d3f99dad9e0cfe15766817e4e4b0d41e67d2c6d6ec25e5994f`
- `CONSENSUS_PLAN.json`: `0ae4122bfa8e37f9c0aa921265743edc2b49fe8058f6802d317fddcb8c74a43d`
- `SOURCE_QUALITY_PLAN.json`: `bd982d05367fb5c1ea95930f656988710744bb294babb0bc1e4b2473f7fc7090`
- `DIFFICULTY_DRAFT.jsonl`: `f1b3676473c0979d37f3ecf743db8a277d42d59940c6f7d22478b01be5d076e5`
- `B13_WORKER_QUALITY_REJECTION_A.json`: `28fc3e4ccbdf228f90ab31147a8d0614c493654f32ae8865c3c538a49f713a64`
- `B13_WORKER_QUALITY_REJECTION_B.json`: `e86bb29be58625f7f2b62eadf79c90308eedd0683cafc7bbb029d8772ec5c0a3`
- `LUNA_A_PRE_SCHEMA_CORRECTION.jsonl`: `d338e2e5ad7caffdf3b6a68f912c286ccfd14affcc2463417be7b50d35a8c40a`
- `LUNA_A_SCHEMA_CORRECTION_RECEIPT.json`: `81afe32dcd90255c4ea56709de77c2cb6b887be9b7902353efeb3df9962bee23`
- `LUNA_A_PRE_TAXONOMY_ARRAY_REVIEW.jsonl`: `74653fa4af3be6477089bc55af7af3d9df0686e485feb1bf59710b1b64225687`
- `LUNA_A_ARRAY_REVIEW_RECEIPT.json`: `9dea6b4408a0193f7fd61e9ef52e141299f01ccf942e4ed862b617df0825d0f4`
- `LUNA_B_PRE_TAXONOMY_ARRAY_REVIEW.jsonl`: `47ee139131efa2152d8dcb01ba5d4a2613d63c0610fb655ebf41213658ef4a9a`
- `LUNA_B_ARRAY_REVIEW_RECEIPT.json`: `d632b14795d5e8f2ce25f11d6eddae3934f386a8db7c0c4cdcf96171a8035c82`
- `A_REVIEW_INPUT_Q06.jsonl`: `8f719e6c33e965d99e4fbe3f50fc42bf4e43ace41068d80235ae400a663580d5`
- `LUNA_A_PRE_Q06_QUALITY_CORRECTION.jsonl`: `e1d75b18908401917dbbd3c250f003cdde4917b9f0944d9db69338408451a828`
- `LUNA_A_REVISION_Q06.jsonl`: `6e4c748b3bff0ecc7fc5c1964c15b912d7f8b0178c55206039db6c67bc38fbbf`
- `LUNA_A_REVISION_Q06_NORMALIZED.jsonl`: `3d0acf094717d9aa95f73a6dbaf8a68e68c9f871b8a32b93ffa1f1dc4a9043b6`
- `A_Q06_SCHEMA_NORMALIZATION.json`: `9427670daea0ac1f8641792dd469841e6c0433eb8cbd9cbc05d7093fbb15578d`
- `B13_A_Q06_QUALITY_REJECTION.json`: `3af65add21af31bf9090a6f08fc394b4de1280cc2eaeb5116bee3a053d6148d4`
- `CONFLICT_C_PRE_SCHEMA_CORRECTION.jsonl`: `c7daa49520296aa071329db746ceb8865b073f77d3b56d2671fcebecaef5a6b5`
- `CONFLICT_C_SCHEMA_PARENT_REVIEW_RECEIPT.json`: `60f197cd36e2409506341f365971d08a703d22dffd7fc784895d7b88e1c0dd72`
- `L1_L2_CONFLICT_PLAN.json`: `a91c00924d7013adfede496e2daa2389d61fc1bdea571049464566e0a3043f56`
- `L1_L2_BASELINE_AUDIT.jsonl`: `0ac311ab19756b61fa6dbbcbffc6e314f5aa5aeb51275a7f4070ae529fed9810`
- `L1_L2_BASELINE_SUMMARY.json`: `5cd7507c3d00cbd2798e03bf41711fd656b136c877e22e61074a2d4f1bc39144`
- `ROOT_Q06_PENTAGON_SOURCE_EVIDENCE.md`: `bcb6d0a1e70ae78f9ac76dadd53fbafc3e239ff7163b097aa954424c8fdc6df8`
- `ROOT_Q11_PARALLELOGRAM_PARENT_EVIDENCE.md`: `5ec6d5a890f079ebe1247d95cd9b9dec4d9e26cce2f3a8b737d10d3a0227be9b`
- `ROOT_Q16_CUT_CUBOID_SPATIAL_EVIDENCE.md`: `0057d617b7f1f970825c2ec6715d8a35a6c713dd1043346c541135b42839bdff`
- `ROOT_Q18_CROSS_GRADE_EVIDENCE.md`: `b3d2e38853e546efe8f1d12444136013ecd26eb8e15d43190efc7a441cf8dc35`
