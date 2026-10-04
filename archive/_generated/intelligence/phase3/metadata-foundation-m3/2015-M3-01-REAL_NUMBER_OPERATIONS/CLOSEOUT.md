# M3 L1 Closeout — 2015 실수와 그 연산

상태: **PASS / CLOSED**

- curriculum: 2015
- semester: 1
- scope: M3-1
- L1 key: 2015-M3-01-REAL_NUMBER_OPERATIONS
- L1 name: 실수와 그 연산
- questionCount: 318
- sourceFileCount: 23
- 작업 단위: L1 1개

## Taxonomy

- L2 사용 수: 2
- L3 사용 수: 7
- L4 canonical path 수: 12
- primary path: 문항당 1개
- secondaryConceptKeys: primary 중복 없이 빈 배열 유지
- visual/graph/table representation: context/evidence only; taxonomy는 결정 개념·풀이 전략 기준

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 제곱근과 실수 > 제곱근 > 제곱근의 뜻 | 45 |
| 제곱근과 실수 > 제곱근 > 제곱근의 성질 | 24 |
| 제곱근과 실수 > 무리수와 실수 > 실수의 대소 | 42 |
| 제곱근과 실수 > 무리수와 실수 > 무리수 판별 | 36 |
| 제곱근과 실수 > 수직선과 제곱근 > 근삿값 | 28 |
| 제곱근과 실수 > 수직선과 제곱근 > 무리수의 위치 | 25 |
| 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 동류근호 | 30 |
| 근호를 포함한 식의 계산 > 근호의 덧셈과 뺄셈 > 분배법칙 | 1 |
| 근호를 포함한 식의 계산 > 혼합 계산 > 식의 값 | 14 |
| 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 곱 | 49 |
| 근호를 포함한 식의 계산 > 근호의 곱셈과 나눗셈 > 근호의 몫 | 6 |
| 근호를 포함한 식의 계산 > 분모의 유리화 > 한 항의 유리화 | 18 |

모든 path는 RPM Primary Taxonomy v1.0의 2015 M3-1 scope에 존재한다.

## Difficulty

| difficultyBucket | 문항 수 |
|---:|---:|
| 1 | 168 |
| 2 | 81 |
| 3 | 57 |
| 4 | 10 |
| 5 | 2 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 64 |
| medium | 254 |
| low | 0 |

| difficultyBoundaryFlag | 문항 수 |
|---|---:|
| NONE | 110 |
| B12 | 116 |
| B23 | 75 |
| B34 | 15 |
| B45 | 2 |

## Legacy level compatibility

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 135 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 136 |
| STRONG_CONFLICT | 47 |
| UNKNOWN | 0 |

기존 level 값은 수정하지 않았다. BORDERLINE_REVIEW 136건은 독립 재검 후
BORDERLINE_ACCEPTABLE로 adjudication했고, STRONG_CONFLICT 47건은 blind
bucket을 유지하는 독립 재검/adjudication을 완료했다.

## Recheck

- boundary recheck: 208
- low confidence recheck: 0
- strong conflict recheck/adjudication: 47
- same-type outlier recheck: 40
- independent recheck resolved: 300
- independent recheck hold: 0

검수 순서는 blind first pass → freeze → legacy compare → independent recheck다.
동일 L4 outlier는 그룹 중앙값에서 2단계 이상 벗어난 경우에만 표시했다.

## Review

- reviewed_pass: 318
- HOLD/manual_review: 0
- RPM_EXTENDED: 0
- RPM_EXTENDED_CANDIDATE: 0
- curriculumApplicability DEFAULT_SCOPE: 318
- defaultSelectable=true: 318

## Validation

- denominator before == after: PASS (318 == 318)
- UID cardinality: PASS
- source join: PASS
- L1/L2/L3/L4 assigned: PASS
- invalid taxonomy path: 0
- unapproved taxonomy node: 0
- duplicate primary path: 0
- difficultyBucket enum: PASS
- difficultyConfidence enum: PASS
- difficultyBoundaryFlag enum: PASS
- legacyLevelCompatibility enum: PASS
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

- archive/data/question_metadata.json: 318 target records only
- archive/question-meta.js: canonical v2 field-list bridge
- archive/tools/intelligence/build-m3-l1-metadata.mjs
- archive/tools/intelligence/apply-m3-l1-metadata.mjs
- archive/_generated/intelligence/phase3/metadata-foundation-m3/2015-M3-01-REAL_NUMBER_OPERATIONS/*

비대상 M3/H1/중1/중2/고1/고2 record mutation: 0.

- metadata apply commit SHA: 5411e4743000f103d4eb88cfba70344c55df37ee
- push result: PASS
- remote: origin/codex/metadata-foundation-m3
- HEAD == remote: PASS

본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.
Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.
