# M3 L1 Closeout — 2015 삼각비

상태: **PASS / CLOSED**

- curriculum: 2015
- semester: 2
- scope: M3-2
- L1 key: 2015-M3-05-TRIG_RATIO
- L1 name: 삼각비
- questionCount: 206
- sourceFileCount: 14

## Taxonomy

- L2 사용 수: 2
- L3 사용 수: 5
- L4 canonical path 수: 7
- primary path: 문항당 1개
- 도형/입체 표현은 context이며 삼각비의 결정적 개념·전략을 기준으로 분류

| L2 > L3 > L4 | 문항 수 |
|---|---:|
| 삼각비 > 삼각비의 뜻 > sin·cos·tan | 44 |
| 삼각비의 활용 > 측정 문제 > 높이·거리 | 57 |
| 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이 | 26 |
| 삼각비 > 특수각의 삼각비 > 30°·45°·60° | 16 |
| 삼각비 > 특수각의 삼각비 > 특수각 계산 | 47 |
| 삼각비 > 삼각비의 뜻 > 삼각비의 관계 | 14 |
| 삼각비의 활용 > 복합도형 > 보조선 활용 | 2 |

모든 path는 RPM Primary Taxonomy v1.0의 2015 M3-2 scope에 존재한다.

## Difficulty

| difficultyBucket | 문항 수 |
|---:|---:|
| 1 | 80 |
| 2 | 86 |
| 3 | 34 |
| 4 | 6 |
| 5 | 0 |

| difficultyConfidence | 문항 수 |
|---|---:|
| high | 26 |
| medium | 180 |
| low | 0 |

| difficultyBoundaryFlag | 문항 수 |
|---|---:|
| NONE | 30 |
| B12 | 83 |
| B23 | 86 |
| B34 | 7 |
| B45 | 0 |

## Legacy level compatibility

| legacyLevelCompatibility | 문항 수 |
|---|---:|
| NORMAL | 94 |
| BORDERLINE_REVIEW | 0 |
| BORDERLINE_ACCEPTABLE | 84 |
| STRONG_CONFLICT | 28 |
| UNKNOWN | 0 |

기존 level은 수정하지 않았다. 인접 mismatch 84건은 independent recheck
후 BORDERLINE_ACCEPTABLE로 adjudication했고, STRONG_CONFLICT 28건은
blind bucket 유지 adjudication을 완료했다.

## Recheck

- boundary recheck: 176
- low confidence recheck: 0
- strong conflict recheck/adjudication: 28
- same-type outlier recheck: 13
- independent recheck resolved: 205
- independent recheck hold: 0

## Review

- reviewed_pass: 206
- HOLD/manual_review: 0
- RPM_EXTENDED: 0
- RPM_EXTENDED_CANDIDATE: 0
- curriculumApplicability DEFAULT_SCOPE: 206
- defaultSelectable=true: 206

## Validation

- denominator before == after: PASS (206 == 206)
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

- archive/data/question_metadata.json: 206 target records only
- archive/_generated/intelligence/phase3/metadata-foundation-m3/2015-M3-05-TRIG_RATIO/*

비대상 M3/H1/중1/중2/고1/고2 record mutation: 0.

- metadata apply commit SHA: c2a6dbfd24ce8d653631207ceae16c38e49c35b3
- push result: PASS
- remote: origin/codex/metadata-foundation-m3
- HEAD == remote after closeout: PASS

본 branch는 중3 Metadata Foundation / canonical metadata upgrade 전용이다.
Archive 2.0 구현 및 고1·중1·중2·고2 metadata 작업은 수행하지 않았다.
