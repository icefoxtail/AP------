# M1 Meta Foundation — Batch 14 checkpoint report

- BASE_MAIN_SHA: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`
- Branch: `codex/meta-foundation/middle1`
- Source: `original/middle/m1/2mid/25_동산중_2학기_중간_중1_수학.js`
- Exam title: 25_동산중_2학기_중간_중1_수학
- Rows / unique UID: **24/24**
- Existing L1/L2 baseline used UIDs: **24/24**
- Confirmed L1_L2_CONFLICT UIDs: **0**
- Root-opened source-grounded L1/L2 candidates not flagged by A/B: **0**
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
- Sol direct source read (including image where relevant): **2 UID** (12, 22)
- Semantic HOLD / ROUTE_OUT: **2/0**
- Source/solution quality HOLD: **2**; source/answer BLOCK **2**
- L1 corrections / L2 corrections: **0/0**
- Batch mapped L3 / L4 / CrossConcept usage (HOLD and ROUTE_OUT excluded): **20/21/0**
- Cumulative candidate L3 / L4 / CrossConcept: **148/268/2**
- Difficulty distribution 1–5: **6 / 10 / 4 / 2 / 0**
- Difficulty first-pass denominator: **24/24**
- Legacy compatibility: NORMAL 19; BORDERLINE_ACCEPTABLE 3; UNKNOWN 2
- Mandatory difficulty recheck: **12/12**
- Independent difficulty recheck runtime model verified: **true**
- Difficulty recheck rate: **50.0%**
- Recheck triggers: BOUNDARY_FLAG 9; LEGACY_BORDERLINE 4; LOW_CONFIDENCE 2; REVIEWER_REQUESTED_RECHECK 11; SOURCE_SOLUTION_DIFFICULTY_CONFLICT 2
- Visual-triggered recheck count: **0**
- Validator: **SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING**, failure count **0**
- Protected field mutation: **0**; non-metadata mutation **0**
- Metadata writeback / ROUTE_OUT skip / HOLD skip: **22/0/2** (closure 24/24)
- Source JS SHA-256 after writeback: `c469a83cb8b443148d5f3c62b4b76652912dc6d2498c15731df10cacdc35d6a6`

## Deferred global gates

ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.

## Source quality and worker findings

0 archived solutions remain on explicit quality HOLD; source/answer BLOCK count: 2. Off-topic solution ordinals: none. Misleading solution ordinals: none. Root direct-read ordinals: #12, #22. No protected source field was edited.

## Artifact SHA-256

- `INVENTORY.json`: `22a3a1972eab7daebac24ae9678b80d6ea5ca5d37c6208dd9d8934f0ccdead5a`
- `INPUT_BUNDLE.jsonl`: `39d22d699d569a8668f5619982a7b97ad4a598c3d0cc23cf2bca8e458a6e36b1`
- `LUNA_A.jsonl`: `b870e85e76ea3a6dd5b5886b2e4673af36649037d9ec5084982f43ad17cd14ce`
- `LUNA_B.jsonl`: `a67b63f54a33b4b7ab7ee353ed116efab1e02e391b651e32f8cb2fcc639eb092`
- `AB_COMPARISON.jsonl`: `e3d6223ffc99b86228c47ca49a2343937f82862327913be6b98dbfefd19e2eac`
- `CONFLICT_INPUT.jsonl`: `f0742543adccc5e0c5de948bf35c413afb263145572c96e9ed288254d407260e`
- `CONFLICT_C.jsonl`: `15446bf75353adc824f7859f9b63d5471a24baa387f5b5195572cad90326b63c`
- `CONSENSUS.jsonl`: `7c8de528ee06c35b7eff333e5c5564974330d355b4b0c893c618bad5fbe3f346`
- `SOURCE_QUALITY.jsonl`: `74182542921e7fd4b7d76d2fd5a9500f8fa0e61fb317429dabeb08c21e3bbf80`
- `DIFFICULTY_INPUT.jsonl`: `21dd7a7ddacefd5a964551d834f5cd4715cac68aa2eac871114f41fee652dea5`
- `DIFFICULTY.jsonl`: `691208edb89c793f09a7d44151ef26a3ef2cc24fa3df4565d5dfb84af44498bc`
- `DIFFICULTY_FREEZE_RECEIPT.json`: `1f5b88a79af4cf988b73b25a93fbe34252de8ff5d19e5c9455848c3621fc4463`
- `LEGACY_COMPARE.jsonl`: `2a5af33920e54e7cf885bc0a1c7c3cd9d190fd61c6d5dfb58dff022fc74153a9`
- `DIFFICULTY_RECHECK_QUEUE.jsonl`: `b245fd8eaa9baf1f5b257073ee70d2c4b71656fb2f417a80fd3ed67237a19f68`
- `DIFFICULTY_RECHECK.jsonl`: `0b7d5f38944b7f0c9f9672f554efc79523564ca1522405e42836bc485d632de5`
- `DIFFICULTY_FINAL.jsonl`: `b6986b2ad45f609e49925c4b17d722301ed6a301415fcea29c20a3cf5cef9873`
- `WRITEBACK_RECEIPT.json`: `faf871988387766bfcede190e60465a7451f0e2013505405a752c57c7d46b838`
- `VALIDATION.json`: `f78871ab7d04d663d03c11e88bc1f95a9fb7616f2980a9787c98737f42ebaacf`
- `CONSENSUS_PLAN.json`: `0bd1bd3505d977d7c294c2243fb4e06871443906a41ecda4e55d7efd76a9b368`
- `SOURCE_QUALITY_PLAN.json`: `ffb72c7d6ac6f7492aaff2f1558228ee5d036da656dbe7bf742f4341ab1c65db`
- `DIFFICULTY_DRAFT.jsonl`: `691208edb89c793f09a7d44151ef26a3ef2cc24fa3df4565d5dfb84af44498bc`
- `L1_L2_CONFLICT_PLAN.json`: `25482534d05596650e5b9cc184499c65b669e5a9e78edee39aca528a4550575e`
- `L1_L2_BASELINE_AUDIT.jsonl`: `16f5a8708a20dde15a1ec697c86d001fcfd99120e4826e5bb97e78184165c473`
- `L1_L2_BASELINE_SUMMARY.json`: `4c142a35f7d3f458686a9ee465c02a403da138c6ed58533ab1bbb52070fefa35`
- `ROOT_Q12_NUMBER_LINE_SOURCE_BLOCK.md`: `83aabe8a21cef9518d796c6a0c6839e3fd3424bb1574984b12b6d6b89b4ffa65`
- `ROOT_Q22_MISSING_A_DOMAIN_SOURCE_HOLD.md`: `76f84297152e92cb918d62afca9396aef1b430cbb49c171dfc92f001de967532`
