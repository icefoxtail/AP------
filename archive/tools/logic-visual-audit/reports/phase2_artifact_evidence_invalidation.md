# Phase 2 artifact evidence invalidation

- 상태: **PHASE1_EVIDENCE_INVALIDATED_REVIEW_REQUIRED**
- Phase 1 evidence 보존: **true**
- Phase 1 evidence 현재성: **false**
- C denominator 재사용: **false**

- archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|17: SHA unchanged — sha256:b52569e739549bbf845a5a48900e2b092c61cfe1710791a2e9a88f6cb5e714db → sha256:b52569e739549bbf845a5a48900e2b092c61cfe1710791a2e9a88f6cb5e714db
- archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js|22_팔마고_2학기_중간_고1_기출|14: **INVALIDATED** — sha256:0467ee1f99f958a53f1c800682eeaac3f6d087801f1a4c19418ea5ad2b05310e → sha256:6d545c7217bdcad69ebf45dfab63226b4d032eb7d4157f42500ec23064108476
- archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js|22_금당고_2학기_기말_고1_기출|20: SHA unchanged — sha256:80f08f72c5a1e099b0705baf8a0fa49373e0b766f80aabe32d005a5f921ecc04 → sha256:80f08f72c5a1e099b0705baf8a0fa49373e0b766f80aabe32d005a5f921ecc04

asset SHA가 바뀐 문항은 새 V2 artifact-only freeze, V3 parity, C denominator 재계산·재동결 전에는 Phase 1 evidence를 현재 증거로 사용할 수 없다.
