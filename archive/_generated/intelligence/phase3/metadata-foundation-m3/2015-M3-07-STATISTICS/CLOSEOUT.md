# M3 L1 Closeout — 2015 통계

상태: **PASS / CLOSED**

- curriculum: 2015
- semester: 2
- scope: M3-2
- L1 key: 2015-M3-07-STATISTICS
- L1 name: 통계
- questionCount: 174
- sourceFileCount: 17

## Taxonomy

- L2 사용 수: 2
- L3 사용 수: 4
- L4 canonical path 수: 9
- primary path: 문항당 1개
- 표·산점도는 representation/context이며 평균·산포·상관관계의 결정 개념을 기준으로 판정

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 대푯값과 산포도 > 대푯값 > 대푯값 비교 | 10 |
| 대푯값과 산포도 > 산포도 > 표준편차 | 37 |
| 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값 | 48 |
| 대푯값과 산포도 > 산포도 > 분산 | 26 |
| 상관관계 > 산점도 > 산점도 읽기 | 22 |
| 상관관계 > 상관관계 > 음의 상관관계 | 6 |
| 상관관계 > 상관관계 > 양의 상관관계 | 15 |
| 대푯값과 산포도 > 산포도 > 편차 | 9 |
| 상관관계 > 상관관계 > 상관관계가 약한 경우 | 1 |

모든 path는 RPM Primary Taxonomy v1.0의 2015 M3-2 scope에 존재한다.

## Difficulty

| difficultyBucket | 문항 수 |
|---:|---:|
| 1 | 86 |
| 2 | 63 |
| 3 | 23 |
| 4 | 2 |
| 5 | 0 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 39 |
| medium | 135 |
| low | 0 |

| difficultyBoundaryFlag | 문항 수 |
|---|---:|
| NONE | 39 |
| B12 | 81 |
| B23 | 46 |
| B34 | 8 |
| B45 | 0 |

## Legacy level compatibility

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 88 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 72 |
| STRONG_CONFLICT | 14 |
| UNKNOWN | 0 |

기존 level은 수정하지 않았다. 인접 mismatch 72건은 independent recheck
후 BORDERLINE_ACCEPTABLE로 adjudication했고, STRONG_CONFLICT 14건은
blind bucket 유지 adjudication을 완료했다.

## Recheck

- boundary recheck: 135
- low confidence recheck: 0
- strong conflict recheck/adjudication: 14
- same-type outlier recheck: 6
- independent recheck resolved: 167
- independent recheck hold: 0

## Review

- reviewed_pass: 174
- HOLD/manual_review: 0
- RPM_EXTENDED: 0
- RPM_EXTENDED_CANDIDATE: 0
- curriculumApplicability DEFAULT_SCOPE: 174
- defaultSelectable=true: 174

## Validation

- denominator before == after: PASS (174 == 174)
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

- archive/data/question_metadata.json: 174 target records only
- archive/_generated/intelligence/phase3/metadata-foundation-m3/2015-M3-07-STATISTICS/*

비대상 M3/H1/중1/중2/고1/고2 record mutation: 0.

- metadata apply commit SHA: af3feac379ae9004576abb131bcf633ba020d0fb
- push result: PASS
- remote: origin/codex/metadata-foundation-m3
- HEAD == remote after closeout: PASS

본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.
Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.
