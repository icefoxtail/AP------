# M1 Meta Foundation — Batch 12 checkpoint report

- BASE_MAIN_SHA: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`
- Branch: `codex/meta-foundation/middle1`
- Source: `original/middle/m1/2mid/24_왕운중_2학기_중간_중1_기출.js`
- Exam title: 24_왕운중_2학기_중간_중1_기출
- Rows / unique UID: **23/23**
- Existing L1/L2 baseline used UIDs: **16/23**
- Confirmed L1_L2_CONFLICT UIDs: **7**
- Root-opened source-grounded L1/L2 candidates not flagged by A/B: **2**
- A/B reviewed: **23/23**
- A/B semantic agreement / actual conflict: **12/11**
- A/B actual conflict rate: **47.8%**
- C blind reviewed: **11/11**
- Worker-quality affected UIDs with targeted closure: **3** (C evidence rejected: 2; A/B evidence rejected: 1)
- Difficulty first-pass quality rejected and fresh blind-reviewed UIDs: **1**
- Root difficulty adjudications: **0**
- Sol direct source read (including image where relevant): **11 UID** (1, 3, 9, 10, 13, 14, 15, 16, 18, 19, 20)
- Semantic HOLD / ROUTE_OUT: **1/0**
- Source/solution quality HOLD: **23**; source/answer BLOCK **1**
- L1 corrections / L2 corrections: **2/7**
- Batch mapped L3 / L4 / CrossConcept usage (HOLD and ROUTE_OUT excluded): **21/22/0**
- Cumulative candidate L3 / L4 / CrossConcept: **137/241/2**
- Difficulty distribution 1–5: **3 / 7 / 10 / 2 / 0**
- Difficulty first-pass denominator: **23/23**
- Legacy compatibility: NORMAL 20; UNKNOWN 1; BORDERLINE_ACCEPTABLE 2
- Mandatory difficulty recheck: **17/17**
- Difficulty recheck rate: **73.9%**
- Recheck triggers: BOUNDARY_FLAG 15; LEGACY_BORDERLINE 4; LOW_CONFIDENCE 1; REVIEWER_REQUESTED_RECHECK 16; VISUAL_DIFFICULTY_IMPACT 9
- Visual-triggered recheck count: **9**
- Validator: **SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING**, failure count **0**
- Protected field mutation: **0**; non-metadata mutation **0**
- Metadata writeback / ROUTE_OUT skip / HOLD skip: **22/0/1** (closure 23/23)
- Source JS SHA-256 after writeback: `0377559ca7d76ef7a6101fd4e9baca6f8ae22fcd50537149c983337837ec4723`

## Deferred global gates

ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.

## Source quality and worker findings

22 archived solutions remain on explicit quality HOLD; source/answer BLOCK count: 1. Off-topic solution ordinals: none. Misleading solution ordinals: none. Root direct-read ordinals: #1, #3, #9, #10, #13, #14, #15, #16, #18, #19, #20. No protected source field was edited.

## Artifact SHA-256

- `INVENTORY.json`: `7cebc74d0378b1a4da00b3159672fc519d821de89f57c1ad315c563a9c151500`
- `INPUT_BUNDLE.jsonl`: `e4ac622cca830080ef167130cb511870d2437d659d7ce99f519aef6a3f7864ee`
- `LUNA_A.jsonl`: `dfb52d74aa616476139018fafae3ea3b4965e8e43f77893c7d3ecea280da9eea`
- `LUNA_B.jsonl`: `60d3de188696ecee5c1c068b61c12e1930d2e4ce830a5b7c4e8188693e8a5c97`
- `AB_COMPARISON.jsonl`: `649f5eb8e9dba9ff305becf055603bed918c9076c7cf6e59f4767518fef200f4`
- `CONFLICT_INPUT.jsonl`: `d5441dee50bc67eaf5e7614f2a725fdf21c237f421cb06c591c50f30f67568b8`
- `CONFLICT_C.jsonl`: `6b4ab092cc2b193ae770fc59120feadfbca64d08c64c57ffabfba0b3b10cdd42`
- `CONSENSUS.jsonl`: `f5ef1136e083008bad15d8f505933a8f9cc126bf523514d0124d3eb0e4daef9b`
- `SOURCE_QUALITY.jsonl`: `53d50c74de1c3d42ef0080d13471b6d42a1d106cc166471f5d2a7fa55522d638`
- `DIFFICULTY_INPUT.jsonl`: `6a03a3089a7fee23ed5f594bbefdefe2bbda74c0059e3975dc11e4cf66e71835`
- `DIFFICULTY.jsonl`: `ab1c95f4659d7df749addfa75c9d99c01e00271ca92387c3fad531937ec67e68`
- `DIFFICULTY_FREEZE_RECEIPT.json`: `6488542f698b184fea57bbafe9cdfb77dfe31fc8c2a88d04a85af6385026f008`
- `LEGACY_COMPARE.jsonl`: `eafb3e95add57461ee9c2900ad8c266194ec4603c5d268d0c13fb9aca6296df9`
- `DIFFICULTY_RECHECK_QUEUE.jsonl`: `9362f3b5960c5118c259d856eb070de38665fb83d60405c3267f4e52d1d34d84`
- `DIFFICULTY_RECHECK.jsonl`: `6c16aced05f02a018688e36606e734f630922fa5501d3751a3edacb915f116b8`
- `DIFFICULTY_FINAL.jsonl`: `2e591cb6606b7541b36d97340e64a9eadec42db11af3f463b4733095a6d57b5e`
- `WRITEBACK_RECEIPT.json`: `217e84a4028d4a3ec4117c4ca61de42bc2424d327cc558b8f2093a17a0ccc1c2`
- `VALIDATION.json`: `b7f1725650a206f51e77ddda496f3a7bbd48f8847feb6acdfed9c86e75100fc2`
- `CONSENSUS_PLAN.json`: `bed7499dae91d57a79d0179cf8e3c11c34258c58ce7fb9ae1ce39916247e475b`
- `SOURCE_QUALITY_PLAN.json`: `ec9b1d0aaf40d7a625df67804f6b3e854bd7ce0f21e38848b2acd88887d19429`
- `DIFFICULTY_DRAFT.jsonl`: `cc735cb25e49d2f642e3bee92e23246be0e7392c76f216471826c34e8e1ffaeb`
- `C_QUALITY_DEFECTS.json`: `1bfc6b7e9d481008bd2f0d619bb1d43f09bcb01060228e21c6c3dfb67f206b23`
- `AB_QUALITY_DEFECTS.json`: `7dc62dc435e2abf09e674a4017075e3feeb74f94986781cfac4327fa3f32e979`
- `DIFFICULTY_BLIND_INPUT_Q12.jsonl`: `54df8756230c7305fee51616546516f3ac06d5af37793cf0b1c0988d2308dda4`
- `DIFFICULTY_BLIND_CORRECTION_Q12.jsonl`: `169648d750842bfac6bb1b77816115feac88f479e599b96242e2a20a1918c7fe`
- `DIFFICULTY_BLIND_CORRECTION_Q12_POLICY_REVIEW_RAW.jsonl`: `22e5430b235767d0370d8834b21803dbe1fc47a0423f6ef89e35482c876abdd3`
- `DIFFICULTY_BLIND_CORRECTION_Q12_POLICY_REVIEW.jsonl`: `89662e55c62669e1d7fb0cefec407acfc9db7943958b0a9a070cfb65059a5a81`
- `B12_Q12_POLICY_REVIEW_RECEIPT.json`: `776065c36452a5069c5a4cca8e7e149d8fc2258e575c9a73c5daa8faeadad5e7`
- `B12_Q12_POLICY_FIELD_NORMALIZATION.json`: `106433ff34b48ef8c85412d90680b850c82764e512e3a36e46cb776917fb485e`
- `B12_DIFFICULTY_QUALITY_REJECTION.json`: `9822a8efda9ccf649ce2fc130d77f495c0600fc9d892cafb7b71c86d68b3230d`
- `L1_L2_CONFLICT_PLAN.json`: `1739d735292d72203356b48fe1ce3b447dc9bd5dffcc111d0a6daca32ec43fec`
- `L1_L2_BASELINE_AUDIT.jsonl`: `6c3797980abe02a38247237a99430cea8bef59f38750dae44b3b51b07e3d6c66`
- `L1_L2_BASELINE_SUMMARY.json`: `53ba563065e34bbd9b3b874727e8d02fd2dff8b264a2269ee9a87644663b4ed0`
- `ROOT_Q01_INTERSECTING_LINES_SOURCE_EVIDENCE.md`: `32143018206fffa1fd66e99c2d66405e406d2da64c288721e78d8c4898233459`
- `ROOT_Q03_PLANE_MEASURE_L1L2_EVIDENCE.md`: `150536690e11c7375ffa9cc6a53a20a0902106d258d5144643f177d4ea84e5c0`
- `ROOT_Q09_TRIANGLE_UNIQUENESS_CRITERION.md`: `35e222971cad3b9dd0270b26086e1405d27782663b431f7407ed6d06c898389c`
- `ROOT_Q10_CONSTRUCTION_ORDER_SOURCE_HOLD.md`: `123207eda21d6a2f687395a1e9d196285a1959668b0f9c430450c0a9cd5a4455`
- `ROOT_Q13_TRIANGLE_MARKS_ASA_EVIDENCE.md`: `8a96c542ed5c6aa0fda2c12a04501b47a219ee96235655183c8455c0022c7ffd`
- `ROOT_Q14_QUADRILATERAL_PARENT_EVIDENCE.md`: `a7da52dc84221d54a52ace950225f5a21b374ac40ecb6e9ef8a34e8f41e5c9cf`
- `ROOT_Q15_HISTOGRAM_RANK_L2_EVIDENCE.md`: `6053b33bfde563058e705b4876a5466e6b52ad61f5466789631c97d1c3aaae2e`
- `ROOT_Q16_SHARED_IMAGE_RANK_EVIDENCE.md`: `3780b52d9043cf53d69408b5cdbf874728169c3adbdf8f0b71716920f4fd5028`
- `ROOT_Q18_FREQUENCY_TABLE_PARENT_AND_NUMERIC_EVIDENCE.md`: `9712938f7a46ea9d7a2e3e8f3a1584a71f334b9e2607067a0321d9ace01a2274`
- `ROOT_Q19_FREQUENCY_POLYGON_THRESHOLD_L2_EVIDENCE.md`: `1630d8f5d2a0698c124cbb8539b9749af8b3d7545fb3cee253e742d84a8919df`
- `ROOT_Q20_TORN_POLYGON_L2_EVIDENCE.md`: `63613a340c9b762bfe1465c4f0a053e6ed28de586e6355dd344841379977d0f7`
