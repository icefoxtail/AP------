# M3 L1 Closeout — 2015 이차방정식

상태: **PASS / CLOSED**

- curriculum: 2015
- semester: 1
- scope: M3-1
- L1 key: 2015-M3-03-QUADRATIC_EQUATION
- L1 name: 이차방정식
- questionCount: 143
- sourceFileCount: 16

## Taxonomy

- L2 사용 수: 2
- L3 사용 수: 7
- L4 canonical path 수: 12
- primary path: 문항당 1개
- 풀이 도구와 활용을 분리했으며 도형 표현은 결정 개념/전략으로만 사용

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 이차방정식의 풀이 > 인수분해를 이용한 풀이 > 기본 인수분해 | 31 |
| 이차방정식의 풀이 > 근의 공식 > 근의 개수·판별 | 14 |
| 이차방정식의 풀이 > 근의 공식 > 근의 공식 | 23 |
| 이차방정식의 풀이 > 이차방정식과 해 > 이차방정식 판별 | 10 |
| 이차방정식의 풀이 > 제곱근·완전제곱식을 이용한 풀이 > 완전제곱식 | 9 |
| 이차방정식의 활용 > 도형 > 길이·넓이 | 8 |
| 이차방정식의 풀이 > 이차방정식과 해 > 해의 확인 | 23 |
| 이차방정식의 풀이 > 이차방정식과 해 > 해가 주어진 이차방정식의 계수 결정 | 11 |
| 이차방정식의 풀이 > 제곱근·완전제곱식을 이용한 풀이 > 제곱근 이용 | 6 |
| 이차방정식의 활용 > 수와 식 > 연속된 수 | 4 |
| 이차방정식의 활용 > 거리·속력·기타 > 증감·개수 | 3 |
| 이차방정식의 활용 > 거리·속력·기타 > 운동 문제 | 1 |

## Difficulty

| difficultyBucket | 문항 수 |
|---:|---:|
| 1 | 17 |
| 2 | 30 |
| 3 | 64 |
| 4 | 31 |
| 5 | 1 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 34 |
| medium | 109 |
| low | 0 |

| difficultyBoundaryFlag | 문항 수 |
|---|---:|
| NONE | 50 |
| B12 | 17 |
| B23 | 38 |
| B34 | 36 |
| B45 | 2 |

## Legacy level compatibility

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 83 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 44 |
| STRONG_CONFLICT | 16 |
| UNKNOWN | 0 |

기존 level은 수정하지 않았다. 인접 mismatch 44건은 independent
recheck 후 BORDERLINE_ACCEPTABLE로 adjudication했고, STRONG_CONFLICT
16건은 blind bucket 유지 adjudication을 완료했다.

## Recheck

- boundary recheck: 93
- low confidence recheck: 0
- strong conflict recheck/adjudication: 16
- same-type outlier recheck: 8
- independent recheck resolved: 115
- independent recheck hold: 0

## Review

- reviewed_pass: 143
- HOLD/manual_review: 0
- RPM_EXTENDED: 0
- RPM_EXTENDED_CANDIDATE: 0
- curriculumApplicability DEFAULT_SCOPE: 143
- defaultSelectable=true: 143

## Validation

- denominator before == after: PASS (143 == 143)
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

- archive/data/question_metadata.json: 143 target records only
- archive/_generated/intelligence/phase3/metadata-foundation-m3/2015-M3-03-QUADRATIC_EQUATION/*

비대상 M3/H1/중1/중2/고1/고2 record mutation: 0.

- metadata apply commit SHA: c192889696271dac47c720268e26c09c2095057e
- push result: PASS
- remote: origin/codex/metadata-foundation-m3
- HEAD == remote after closeout: PASS

본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.
Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.
