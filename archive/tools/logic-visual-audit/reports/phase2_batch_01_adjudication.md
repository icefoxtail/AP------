# 2022 집합 Phase 2 batch 01 adjudication

- 상태: **FAIL_ADJUDICATION_REQUIRED_NOT_RELEASED**
- V3 parity: **1 PASS / 2 FAIL**
- C item PASS 승격: **0**
- production mass edit authorized: **false**
- denominator reuse: **false**
- report SHA: `sha256:868a162d2bf0e4d52d9ca088da3502f069fe6d988409e31759d784ff160b86ec`

- archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js|22_금당고_2학기_기말_고1_기출|20: **CANDIDATE_NOT_C_ITEM_PASS** — BUILD_TYPED_EXPECTED_AND_OBSERVED_FACTS_THEN_RUN_ITEM_SEMANTIC_GATE
- archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|17: **FAIL_ADJUDICATION_REQUIRED** — REOBSERVE_OR_REBUILD_ARTIFACT_UNDER_CANONICAL_VISUAL_TYPE
- archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js|22_팔마고_2학기_중간_고1_기출|14: **FAIL_ADJUDICATION_REQUIRED** — ADJUDICATE_V1_REQUIREMENT_AND_REMOVE_OR_REBUILD_INVALID_LINKAGE

q20은 family parity 후보일 뿐 typed semantic item gate 전이다. q17과 q14는 adjudication/재관찰이 끝나기 전에는 PASS로 승격하지 않는다.
