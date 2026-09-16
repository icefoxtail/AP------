# M3 L1 Closeout — 2015 원의 성질

상태: **PASS / CLOSED**

- curriculum: 2015
- semester: 2
- scope: M3-2
- L1 key: 2015-M3-06-CIRCLE_PROPERTIES
- L1 name: 원의 성질
- questionCount: 320
- sourceFileCount: 28

## Taxonomy

- L2 사용 수: 2
- L3 사용 수: 3
- L4 canonical path 수: 13
- primary path: 문항당 1개
- 접선이 등장해도 자동으로 원과 직선에 넣지 않음
- 핵심 정리가 현/접선 성질이면 원과 직선, 원주각/호/내접각 정리이면 원주각
- 원·사각형·입체 표현은 context이며 결정 전략을 기준으로 판정

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선 | 33 |
| 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기 | 75 |
| 원주각 > 원주각의 활용 > 내접사각형의 각 | 15 |
| 원주각 > 원주각의 활용 > 복합 각 추론 | 22 |
| 원주각 > 원주각과 중심각 > 중심각과 원주각 | 49 |
| 원과 직선 > 원의 접선 > 접선 조건으로 각 구하기 | 21 |
| 원주각 > 원주각의 활용 > 네 점이 한 원 위에 있을 조건 | 23 |
| 원과 직선 > 원의 중심과 현 > 중심거리와 현의 길이 | 15 |
| 원주각 > 원주각과 중심각 > 같은 호에 대한 원주각 | 28 |
| 원주각 > 원주각의 활용 > 접선과 현이 이루는 각 | 20 |
| 원과 직선 > 원의 중심과 현 > 현의 수직이등분선과 중심 | 7 |
| 원주각 > 원주각과 중심각 > 반원에 대한 원주각 | 11 |
| 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선 | 1 |

모든 path는 RPM Primary Taxonomy v1.0의 2015 M3-2 scope에 존재한다.

## Difficulty

| difficultyBucket | 문항 수 |
|---:|---:|
| 1 | 41 |
| 2 | 24 |
| 3 | 153 |
| 4 | 94 |
| 5 | 8 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 43 |
| medium | 277 |
| low | 0 |

| difficultyBoundaryFlag | 문항 수 |
|---|---:|
| NONE | 79 |
| B12 | 44 |
| B23 | 42 |
| B34 | 139 |
| B45 | 16 |

## Legacy level compatibility

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 149 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 132 |
| STRONG_CONFLICT | 39 |
| UNKNOWN | 0 |

기존 level은 수정하지 않았다. 인접 mismatch 132건은 independent recheck
후 BORDERLINE_ACCEPTABLE로 adjudication했고, STRONG_CONFLICT 39건은
blind bucket 유지 adjudication을 완료했다.

## Recheck

- boundary recheck: 241
- low confidence recheck: 0
- strong conflict recheck/adjudication: 39
- same-type outlier recheck: 22
- independent recheck resolved: 320
- independent recheck hold: 0

## Review

- reviewed_pass: 320
- HOLD/manual_review: 0
- RPM_EXTENDED: 0
- RPM_EXTENDED_CANDIDATE: 0
- curriculumApplicability DEFAULT_SCOPE: 320
- defaultSelectable=true: 320

## Validation

- denominator before == after: PASS (320 == 320)
- UID cardinality / source join: PASS
- L1/L2/L3/L4 assigned: PASS
- invalid taxonomy path: 0
- unapproved taxonomy node: 0
- duplicate primary path: 0
- difficultyBucket/confidence/boundary enum: PASS
- BORDERLINE_REVIEW unresolved: 0
- STRONG_CONFLICT unadjudicated: 0
- low confidence without recheck: 0
- reviewStatus unresolved: 0
- source/content fingerprint mutation: 0 / PASS
- source JS SHA mutation: 0 / PASS
- problem/choices/answer/solution/image/layoutTag/wide mutation: 0 / PASS
- builder parity: PASS
- runtime sidecar parity: PASS
- JSON parse / JS syntax: PASS

Machine receipts:

- blind_first_pass.json
- first_pass_freeze.json
- legacy_compare.json
- independent_recheck.json
- metadata_candidate.json
- apply_receipt.json
- validation.json
- review_queue.json
- status.json

## Changed files

- archive/data/question_metadata.json: 320 target records only
- archive/_generated/intelligence/phase3/metadata-foundation-m3/2015-M3-06-CIRCLE_PROPERTIES/*

비대상 M3/H1/중1/중2/고1/고2 record mutation: 0.

- metadata apply commit SHA: e30c04d9cd5fd6e7b4c8dba4c7dfcd6bbc74d6c7
- push result: PASS
- remote: origin/codex/metadata-foundation-m3
- HEAD == remote after closeout: PASS

본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.
Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.
