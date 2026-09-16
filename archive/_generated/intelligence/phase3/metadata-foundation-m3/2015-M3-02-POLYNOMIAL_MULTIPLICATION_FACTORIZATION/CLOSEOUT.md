# M3 L1 Closeout — 2015 다항식의 곱셈과 인수분해

상태: **PASS / CLOSED**

- curriculum: 2015
- semester: 1
- scope: M3-1
- L1 key: 2015-M3-02-POLYNOMIAL_MULTIPLICATION_FACTORIZATION
- L1 name: 다항식의 곱셈과 인수분해
- questionCount: 286
- sourceFileCount: 30

## Taxonomy

- L2 사용 수: 2
- L3 사용 수: 5
- L4 canonical path 수: 14
- primary path: 문항당 1개
- representation/context는 primary taxonomy를 결정하지 않음

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 식의 값 | 65 |
| 다항식의 곱셈 > 곱셈공식 > 합·차의 제곱 | 25 |
| 다항식의 곱셈 > 곱셈공식의 활용 > 곱셈공식을 이용한 수의 계산 | 6 |
| 인수분해 > 인수분해의 활용 > 인수분해를 이용한 식의 값 | 31 |
| 인수분해 > 공통인수 > 공통인수 묶기 | 13 |
| 인수분해 > 인수분해 공식 > 제곱식 | 10 |
| 다항식의 곱셈 > 곱셈공식 > 합과 차의 곱 | 21 |
| 인수분해 > 인수분해 공식 > 합과 차 | 2 |
| 인수분해 > 인수분해의 활용 > 조건식 | 31 |
| 인수분해 > 공통인수 > 단계적 인수분해 | 2 |
| 인수분해 > 인수분해 공식 > 이차식 | 33 |
| 다항식의 곱셈 > 곱셈공식의 활용 > 도형 활용 | 15 |
| 다항식의 곱셈 > 곱셈공식 > 두 일차식의 곱 | 27 |
| 인수분해 > 인수분해의 활용 > 인수분해를 이용한 수의 계산 | 5 |

모든 path는 RPM Primary Taxonomy v1.0의 2015 M3-1 scope에 존재한다.
도형 문항도 도형이라는 표현 때문이 아니라 곱셈공식/인수분해 전략이
결정적인 경우에만 도형 활용 또는 해당 algebraic L4로 판정했다.

## Difficulty

| difficultyBucket | 문항 수 |
|---:|---:|
| 1 | 129 |
| 2 | 60 |
| 3 | 69 |
| 4 | 26 |
| 5 | 2 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 33 |
| medium | 253 |
| low | 0 |

| difficultyBoundaryFlag | 문항 수 |
|---|---:|
| NONE | 80 |
| B12 | 112 |
| B23 | 62 |
| B34 | 28 |
| B45 | 4 |

## Legacy level compatibility

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 114 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 113 |
| STRONG_CONFLICT | 58 |
| UNKNOWN | 0 |

기존 level은 수정하지 않았다. BORDERLINE_REVIEW는 independent recheck 후
BORDERLINE_ACCEPTABLE로 adjudication했고, STRONG_CONFLICT 58건은 blind
bucket을 유지하는 독립 재검/adjudication을 완료했다.

## Recheck

- boundary recheck: 206
- low confidence recheck: 0
- strong conflict recheck/adjudication: 58
- same-type outlier recheck: 24
- independent recheck resolved: 258
- independent recheck hold: 0

## Review

- reviewed_pass: 286
- HOLD/manual_review: 0
- RPM_EXTENDED: 0
- RPM_EXTENDED_CANDIDATE: 0
- curriculumApplicability DEFAULT_SCOPE: 286
- defaultSelectable=true: 286

## Validation

- denominator before == after: PASS (286 == 286)
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

- archive/data/question_metadata.json: 286 target records only
- archive/_generated/intelligence/phase3/metadata-foundation-m3/2015-M3-02-POLYNOMIAL_MULTIPLICATION_FACTORIZATION/*

비대상 M3/H1/중1/중2/고1/고2 record mutation: 0.

- metadata apply commit SHA: pending until reconciled L1 commit
- push result: PASS
- remote: origin/codex/metadata-foundation-m3
- HEAD == remote after closeout: PASS

본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.
Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.
