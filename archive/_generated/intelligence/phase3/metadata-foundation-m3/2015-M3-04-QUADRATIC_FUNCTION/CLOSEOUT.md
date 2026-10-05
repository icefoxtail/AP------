# M3 L1 Closeout — 2015 이차함수

상태: **PASS / CLOSED**

- curriculum: 2015
- semester: 1
- scope: M3-1
- L1 key: 2015-M3-04-QUADRATIC_FUNCTION
- L1 name: 이차함수
- questionCount: 196
- sourceFileCount: 17

## Taxonomy

- L2 사용 수: 2
- L3 사용 수: 6
- L4 canonical path 수: 10
- primary path: 문항당 1개
- 그래프는 representation/context이며 함수식·조건·최적화 전략을 기준으로 판정
- M3-04 source-unit였지만 결정 전략이 인수분해인 1건은 M3-02로 transfer하고 이 L1에서 제외
- M3-04 source-unit였지만 결정 전략이 이차방정식 활용인 1건은 M3-03으로 transfer하고 이 L1에서 제외

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 이차함수 y=ax²+bx+c의 그래프 > 그래프와 계수 > 조건으로 식 구하기 | 4 |
| 이차함수와 그 그래프 > 그래프와 식 > 점의 좌표 | 97 |
| 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별 | 11 |
| 이차함수와 그 그래프 > y=ax²의 그래프 > 그래프의 모양 | 16 |
| 이차함수 y=ax²+bx+c의 그래프 > 그래프와 계수 > 그래프 위치 | 20 |
| 이차함수 y=ax²+bx+c의 그래프 > 꼭짓점형 > 평행이동 | 17 |
| 이차함수와 그 그래프 > 이차함수의 뜻 > 함숫값 | 10 |
| 이차함수 y=ax²+bx+c의 그래프 > 꼭짓점형 > 꼭짓점·축 | 14 |
| 이차함수와 그 그래프 > y=ax²의 그래프 > 대칭축·증감 | 4 |
| 이차함수 y=ax²+bx+c의 그래프 > 일반형 > 완전제곱식 변형 | 3 |

## Difficulty

| difficultyBucket | 문항 수 |
|---:|---:|
| 1 | 38 |
| 2 | 88 |
| 3 | 60 |
| 4 | 10 |
| 5 | 0 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 36 |
| medium | 160 |
| low | 0 |

| difficultyBoundaryFlag | 문항 수 |
|---|---:|
| NONE | 39 |
| B12 | 37 |
| B23 | 95 |
| B34 | 25 |
| B45 | 0 |

## Legacy level compatibility

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 112 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 62 |
| STRONG_CONFLICT | 22 |
| UNKNOWN | 0 |

기존 level은 수정하지 않았다. 인접 mismatch 62건은 independent recheck
후 BORDERLINE_ACCEPTABLE로 adjudication했고, STRONG_CONFLICT 22건은
blind bucket 유지 adjudication을 완료했다.

## Recheck

- boundary recheck: 157
- low confidence recheck: 0
- strong conflict recheck/adjudication: 22
- same-type outlier recheck: 9
- independent recheck resolved: 176
- independent recheck hold: 0

## Review

- reviewed_pass: 196
- HOLD/manual_review: 0
- RPM_EXTENDED: 0
- RPM_EXTENDED_CANDIDATE: 0
- curriculumApplicability DEFAULT_SCOPE: 196
- defaultSelectable=true: 196

## Validation

- denominator before == after: PASS (196 == 196)
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

- archive/data/question_metadata.json: 196 target records only
- archive/_generated/intelligence/phase3/metadata-foundation-m3/2015-M3-04-QUADRATIC_FUNCTION/*

비대상 M3/H1/중1/중2/고1/고2 record mutation: 0.

- metadata apply commit SHA: 1a643641ea0794baf2c8fe138339aaa137d7066b
- push result: PASS
- remote: origin/codex/metadata-foundation-m3
- HEAD == remote after closeout: PASS

본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.
Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.
