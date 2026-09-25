# M1 Meta Foundation — Batch 15 checkpoint report

- BASE_MAIN_SHA: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`
- Branch: `codex/meta-foundation/middle1`
- Source: `original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js`
- Exam title: 25_연향중_2학기_중간_중1_기출
- Rows / unique UID: **24/24**
- Existing L1/L2 baseline used UIDs: **24/24**
- Confirmed L1_L2_CONFLICT UIDs: **0**
- Root-opened source-grounded L1/L2 candidates not flagged by A/B: **0**
- A/B reviewed: **24/24**
- A/B semantic agreement / actual conflict: **21/3**
- A/B actual conflict rate: **12.5%**
- C blind reviewed: **3/3**
- Worker-quality affected UIDs with targeted closure: **0** (C evidence rejected: 0; A/B evidence rejected: 0; A targeted replacement: 0)
- Rejected pre-ledger worker attempts (accepted UID 0): **0**
- Worker A schema / taxonomy-array corrected UIDs before consensus: **0/0**
- Worker B taxonomy-array corrected UIDs before consensus: **0**
- Conflict C schema-corrected / parent-rejudged UIDs before consensus: **0/0**
- Difficulty first-pass quality rejected and fresh blind-reviewed UIDs: **0**
- Root difficulty adjudications: **0**
- Sol direct source read (including image where relevant): **2 UID** (15, 23)
- Semantic HOLD / ROUTE_OUT: **1/0**
- Source/solution quality HOLD: **9**; source/answer BLOCK **1**
- L1 corrections / L2 corrections: **0/0**
- Batch mapped L3 / L4 / CrossConcept usage (HOLD and ROUTE_OUT excluded): **23/23/3**
- Cumulative candidate L3 / L4 / CrossConcept: **158/280/5**
- Difficulty distribution 1–5: **1 / 9 / 10 / 3 / 0**
- Difficulty first-pass denominator: **24/24**
- Legacy compatibility: NORMAL 19; BORDERLINE_ACCEPTABLE 4; UNKNOWN 1
- Mandatory difficulty recheck: **18/18**
- Independent difficulty recheck runtime model verified: **true**
- Difficulty recheck rate: **75.0%**
- Recheck triggers: BOUNDARY_FLAG 15; LEGACY_BORDERLINE 5; LOW_CONFIDENCE 1; REVIEWER_REQUESTED_RECHECK 16; SOURCE_SOLUTION_DIFFICULTY_CONFLICT 1; VISUAL_DIFFICULTY_IMPACT 11
- Visual-triggered recheck count: **11**
- Validator: **SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING**, failure count **0**
- Protected field mutation: **0**; non-metadata mutation **0**
- Metadata writeback / ROUTE_OUT skip / HOLD skip: **23/0/1** (closure 24/24)
- Source JS SHA-256 after writeback: `c8b703abb9e0a4f034ebc85ffe789786da85a7b639bf6df8ca53a4c02541437c`

## Deferred global gates

ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.

## Source quality and worker findings

8 archived solutions remain on explicit quality HOLD; source/answer BLOCK count: 1. Off-topic solution ordinals: none. Misleading solution ordinals: none. Root direct-read ordinals: #15, #23. No protected source field was edited.

## Artifact SHA-256

- `INVENTORY.json`: `6fe7afd70bf0b0576d8eaae89596265b4756a777a64ec89cbe4333211670e5a5`
- `INPUT_BUNDLE.jsonl`: `72b3176a5e70e6476940350d9ff2d4a7b5aa5545e8f20090d118f57286cc0410`
- `LUNA_A.jsonl`: `68bafb483fe0a644ea35cc434afd8a0ff50233741c978e7995ab2437ed5db5ef`
- `LUNA_B.jsonl`: `35ca7b9eb6698ecf82ac3a6be8a0c2e7c281fd20d4e64bfcea259780d2530367`
- `AB_COMPARISON.jsonl`: `a89f6a15dda455213fff0c4a06d195d39ae8c8fafeac208e3650d8fde20585fe`
- `CONFLICT_INPUT.jsonl`: `c71b7c520cf4fe98fc171825134ffca4a90800b6f4984f245c23b7f486144eb8`
- `CONFLICT_C.jsonl`: `4e5219a3f5714f3432cb6d8953fe02f887ee674ace79fa6cc73ec9c9affbd67d`
- `CONSENSUS.jsonl`: `3e215c617ce287abec109098f2b37884ff91476aa842d2385b836cbded47c410`
- `SOURCE_QUALITY.jsonl`: `0a96c518d1be528e9c07a6f59ce09fa32d4e9b3f8317d7fe9ed72fb55b564d3c`
- `DIFFICULTY_INPUT.jsonl`: `f5480b870dca74df13ca87b2aa194648fee11302abd15f4b74dedc2faa0e295f`
- `DIFFICULTY.jsonl`: `16accdadbe8cd814666a0bf45e9ea70e0d2cd3747a4e0d78c5882bfb4cb83251`
- `DIFFICULTY_FREEZE_RECEIPT.json`: `ca20edbac37fccac1f90f57e0683fd0235c5392d4eb511b873aa3fd264fa9530`
- `LEGACY_COMPARE.jsonl`: `8b858848725c363ab364428d0ca60ca8c868444c99665650092ec6736707a452`
- `DIFFICULTY_RECHECK_QUEUE.jsonl`: `3fde017519c84586e5d84efeacb2c1e9f4508088c13479787fb2d8af8edadbf7`
- `DIFFICULTY_RECHECK.jsonl`: `083fd175bf3026ee5c8af60877993d91a0a63d0dad5ba2eaff6537ac7c4d3051`
- `DIFFICULTY_FINAL.jsonl`: `40a763e1879549ed67c5c3c2ca585ee2eb6b520f20d30e2de06a67ccff778f42`
- `WRITEBACK_RECEIPT.json`: `d4e8a1f82defe573e5e1611756aa947bb60943b82b9d4ceb2eb16cb033a104a8`
- `VALIDATION.json`: `a31f0670033482154d735e315686e285250ff7c451dcce2e94c2c11b19bb99c7`
- `CONSENSUS_PLAN.json`: `5c464fb7b56b15b18e8687c7b5f51f8ad776a0efb85572533240d849e713111d`
- `SOURCE_QUALITY_PLAN.json`: `8f44528e4798de986575da65ff732316406388bc8dde774718348d024cffc222`
- `DIFFICULTY_DRAFT.jsonl`: `16accdadbe8cd814666a0bf45e9ea70e0d2cd3747a4e0d78c5882bfb4cb83251`
- `L1_L2_CONFLICT_PLAN.json`: `cf54e8c528d27da7e5a622a18a87bfb5b5f2d2262260292a2eb824eaffda3949`
- `L1_L2_BASELINE_AUDIT.jsonl`: `69aa2456587b53ba5ccb71707291782da63d5bec303be42a52ab4e172c530c2d`
- `L1_L2_BASELINE_SUMMARY.json`: `1ffab511110b18d66d9760145438c5a7d375176b1fb943cf15e82ff5f27aeba5`
- `ROOT_Q15_UNDERDETERMINED_DIAGRAM.md`: `2a04ad90c0441278dc99bec7175a0236e1d5e0651fe251a304f9709a157fef2b`
- `ROOT_Q23_FOLD_ANGLE_RESOLUTION.md`: `1c7f33781a11dd2dd0628dc06ad89b717e69d7ac061d8c2d2adf7e62a18e97a5`
