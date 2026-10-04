# M1 Meta Foundation — Batch 09 checkpoint report

- BASE_MAIN_SHA: `522c915eaa0c9e54bf43f3884f809d65075e1dbe`
- Branch: `codex/meta-foundation/middle1`
- Source: `original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js`
- Exam title: 23_향림중_2학기_중간_중1_기출
- Rows / unique UID: **26/26**
- A/B reviewed: **26/26**
- A/B semantic agreement / actual conflict: **16/10**
- A/B actual conflict rate: **38.5%**
- C blind reviewed: **10/10**
- Worker-quality rejected and source-revised UIDs: **1**
- Difficulty first-pass quality rejected and fresh blind-reviewed UIDs: **2**
- Root difficulty adjudications: **1**
- Sol direct source read (including image where relevant): **5 UID** (1, 3, 9, 14, 18)
- Semantic HOLD / ROUTE_OUT: **3/0**
- Source/solution quality HOLD: **26**; source/answer BLOCK **3**
- L1 corrections / L2 corrections: **0/1**
- Batch provisional L3 / L4 / CrossConcept usage: **20/26/0**
- Cumulative candidate L3 / L4 / CrossConcept: **117/196/2**
- Difficulty distribution 1–5: **3 / 12 / 6 / 2 / 0**
- Difficulty first-pass denominator: **26/26**
- Legacy compatibility: NORMAL 18; BORDERLINE_ACCEPTABLE 4; UNKNOWN 3; STRONG_CONFLICT 1
- Mandatory difficulty recheck: **18/18**
- Difficulty recheck rate: **69.2%**
- Recheck triggers: BOUNDARY_FLAG 11; LEGACY_BORDERLINE 6; LEGACY_STRONG_CONFLICT 1; LOW_CONFIDENCE 3; REVIEWER_REQUESTED_RECHECK 15; SOURCE_SOLUTION_DIFFICULTY_CONFLICT 3; VISUAL_DIFFICULTY_IMPACT 10
- Visual-triggered recheck count: **10**
- Validator: **SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING**, failure count **0**
- Protected field mutation: **0**; non-metadata mutation **0**
- Metadata writeback / ROUTE_OUT skip / HOLD skip: **23/0/3** (closure 26/26)
- Source JS SHA-256 after writeback: `bff507779c9aa8317141ac62257337fae2dd8591b4fcbd6f0cf158fe5137eed1`

## Deferred global gates

ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.

## Source quality and worker findings

23 archived solutions remain on explicit quality HOLD; source/answer BLOCK count: 3. Off-topic solution ordinals: none. Misleading solution ordinals: none. Root direct-read ordinals: #1, #3, #9, #14, #18. No protected source field was edited.

## Artifact SHA-256

- `INVENTORY.json`: `b873b30fe2305c73bdba1d52629811433a9a5773f90cd969c1f62e92f7782022`
- `INPUT_BUNDLE.jsonl`: `8c525c75bd018867887093ec8827c27e0102e6bf03d1a3505c5fc7b6d0ff348f`
- `LUNA_A.jsonl`: `542f6a74dbb389b1f25bbda2d6e995ae0dd2db084c46ccd9e7beb88fe332549e`
- `LUNA_B.jsonl`: `9880443f3e8d2617283fe6a6ba369eb34212ddb04eaa16184a8a550bac9c3fbc`
- `AB_COMPARISON.jsonl`: `b6d5f476282daea3215deb17095020c6b43ad135cda83af6891f53123735f441`
- `CONFLICT_INPUT.jsonl`: `1fdd0879d708ad955d2cec4d5cd500120648b8cb9047194a1d3f97c3dcfaed77`
- `CONFLICT_C.jsonl`: `88b56c44d3dd9565ce8bd312d140562a197baf831fec65e2af65ce93f92cf080`
- `CONSENSUS.jsonl`: `607e3688f20626f0f30d8dd934c78eaa2c64bc05b81f2d745a31d399195565f8`
- `SOURCE_QUALITY.jsonl`: `5cec8be0493765d72e9d493f0b21cf765f38f87f02c2872d45626928656cc06c`
- `DIFFICULTY_INPUT.jsonl`: `bb9c975e086086bdfd5ca368552797225e69c5eee0eb747b5b1de7373ac61166`
- `DIFFICULTY.jsonl`: `b85f3d330dcbebd6cd4e6188979732570205377bcbc32df798ab8c089e456873`
- `DIFFICULTY_FREEZE_RECEIPT.json`: `253ef7c1f27f0290ef556edc2ccf838eed488c0c5f45f4a4d136222ae83f9ccf`
- `LEGACY_COMPARE.jsonl`: `0c1069d8d59b46a45326d90cf30014fcb0886f7abb424c4809319de32d298cbb`
- `DIFFICULTY_RECHECK_QUEUE.jsonl`: `3f93795846613069c6b3a4b757beaf5a05fe9b627e6d763f890f5fb73ae4eb07`
- `DIFFICULTY_RECHECK.jsonl`: `e1637e967527b94776f0286dd4057f6cfd0d4a9315f7d0e4774d8f6564528705`
- `DIFFICULTY_FINAL.jsonl`: `48e5873846eae165cc8affd573ad069a80946d9e5e14f7db535a47f5383fb8a7`
- `WRITEBACK_RECEIPT.json`: `82c7c085ef51e80aeb6db5d843155326f4c57e279c91538cfce8b7342b05d2c2`
- `VALIDATION.json`: `baf65c313ec29bd778e6a91dcd66a507cb14fc30ec57639ccfa216d9562b1aca`
- `B_REVIEW_INPUT_18.jsonl`: `376f582cd418c11540d0ebc5b13112ad8bb1b84b9590d9e279e8edb5b7e39f9a`
- `LUNA_B_PRE_CORRECTION.jsonl`: `639cc72094613f0f7603f52ee9455552c9a31301d12241ca463d34ba6976cf1f`
- `LUNA_B_REVISION_18.jsonl`: `694466f49c2e1f9be2a89cd786d709cadd691a21f3a9934d162749acc5393655`
- `WORKER_QUALITY_REJECTION_B_B09.json`: `656f60cde99f6af64281b874b71abc6d70802072aeb9a5b4ce2c92166b4dd1ae`
- `DIFFICULTY_BLIND_INPUT_01_03.jsonl`: `94364050c1def69110a426b67ba008b416857af730a3cc3b84786c303cca5703`
- `DIFFICULTY_BLIND_CORRECTION_01_03_PRE_SCHEMA.jsonl`: `446c339db83e6fc5d21ffc48ac67bbf30bcd200b78e1e64607c790654b652825`
- `DIFFICULTY_BLIND_CORRECTION_01_03.jsonl`: `e1dd8d32b94f3cf91fe153c0c4c4cd92f9ffe1d37bd3ed468899f6bfff6f3904`
- `B09_DIFFICULTY_QUALITY_REJECTION.json`: `775cef9f4ca75f10f73e919720435164d536b7ef63d8502bb1491a9ba20025db`
- `DIFFICULTY_ROOT_ADJUDICATION.json`: `4eca8d2735203a8c74c79a2b6ba66a7d80a5f8d93e7ac12ff5f8c6bac172ebcc`
- `ROOT_Q09_FOLD_TAPE_EVIDENCE.md`: `53884698be9505821865494fcfc1d5d7abf0cd20c884d7f18b36c5efb10530a7`
- `ROOT_Q14_EQUILATERAL_ROTATION_EVIDENCE.md`: `d7856d7d9fd63bd5d600233b6f612cc9d572f3c28171f1edd1e55b2f1ccbc150`
