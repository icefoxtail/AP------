# JS아카이브 difficultyBucket 5단계 v1.1 독립재검보고서

작성일: 2026-09-16  
검수 대상: docs/proposals/metadata-foundation-v2/difficulty/JS아카이브_difficultyBucket_5단계_운영규칙_v1.1.md  
원본: C:\Users\USER\Downloads\JS아카이브_difficultyBucket_5단계_운영규칙_v1.1.md  
원본 크기: 30,554 bytes  
원본 SHA-256: acbf5f960169393712ec2bc78ffec9705fc6a20cf2805e31c9dbf78c6974f221  
판정: FAIL — CANONICAL_CANDIDATE 유지, canonical 승격 금지

## 1. 재검 대상과 방법

v1.0 독립검수보고서의 DF-001·DF-002를 먼저 확인한 뒤, v1.1의 30개 절을 처음부터 끝까지 다시 읽고 다음 30개 축으로 대조했다.

1. 기존 level 하/중/상 보존
2. difficultyBucket 1~5 의미
3. 1→하 / 2,3→중 / 4,5→상
4. 1↔2 경계
5. 2↔3 경계
6. 3↔4 경계
7. 4↔5 경계
8. 계산량만으로 난이도 상승 금지
9. solution 길이로 판정 금지
10. 기출 중심 난이도 원칙
11. curriculum-relative 원칙
12. blind first-pass
13. first-pass freeze
14. legacy level compare
15. strong conflict 처리
16. same-type outlier
17. confidence
18. boundary
19. independent recheck
20. 분포 강제 금지
21. L1 작업 단위와 drift 방지
22. adaptive batch
23. metadata-only migration
24. source content fingerprint 불변
25. production apply
26. tagStatus / reviewStatus 관계
27. Archive 2.0 UNKNOWN 처리
28. 자동출제 gate
29. Foundation defect 처리
30. Adoption gate

## 2. DF-001 / DF-002 재검

### DF-001 — PASS

v1.1은 v1.0의 bucket/state 충돌을 다음과 같이 해결했다.

- difficultyBucket 저장값: 1|2|3|4|5|UNKNOWN
- UNKNOWN: 미분류 sentinel이며 난이도 단계가 아님
- reviewStatus = HOLD: 보류 상태
- difficultyBucket = HOLD, manual_review, reviewed_pass 금지
- validator가 HOLD를 bucket 허용값으로 인정하지 않음
- §21과 §25에서도 UNKNOWN과 reviewStatus = HOLD를 분리

따라서 v1.0의 DF-001에 대해서는 PASS다.

### DF-002 — PASS

v1.1은 Metadata Foundation v2 계획서의 canonical field명을 본문·sidecar·보고서 mapping에 반영했다.

- difficultyConfidence
- difficultyBoundaryFlag
- legacyLevelCompatibility

CSV/report export는 다음 snake_case mapping으로 명시되어 있다.

- difficulty_confidence ← difficultyConfidence
- difficulty_boundary_flag ← difficultyBoundaryFlag
- legacy_level_compatibility ← legacyLevelCompatibility

v1.0에서 문제였던 실제 field identifier confidence, boundaryFlag, compatibilityStatus는 v1.1 canonical field로 남아 있지 않다. 따라서 DF-002도 PASS다.

## 3. 30개 절 재검 결과

| 번호 | 검수축 | 판정 | 요약 |
|---:|---|---|---|
| 1 | 기존 level 보존 | PASS | 하/중/상 유지, 자동 일괄 수정 금지 |
| 2 | bucket 1~5 의미 | PASS | 기출 중심 5단계 의미 유지 |
| 3 | 기본 compatibility | PASS | 1→하, 2,3→중, 4,5→상 |
| 4 | 1↔2 경계 | PASS | 직접 적용과 1회 조건 해석 구분 |
| 5 | 2↔3 경계 | PASS | 전략 선택 여부를 중심 기준으로 사용 |
| 6 | 3↔4 경계 | PASS | 표준 결합과 비정형·복합조건 구조화 구분 |
| 7 | 4↔5 경계 | PASS | 학습된 고난도와 decisive insight 구분 |
| 8 | 계산량 휴리스틱 금지 | PASS | 계산량만으로 bucket 상승 금지 |
| 9 | solution 길이 금지 | PASS | 문장 수·친절함을 난이도 근거로 금지 |
| 10 | 기출 중심 | PASS | 기초/하/중/상/최상 별도 체계 미도입 |
| 11 | curriculum-relative | PASS | 교육과정·과목·학습 단계 인지 부담 기준 |
| 12 | blind first-pass | PASS | 기존 level·bucket·verdict 숨김 |
| 13 | first-pass freeze | PASS | freeze 후 legacy compare |
| 14 | legacy compare | PASS | 기존 level 즉시 수정 금지 |
| 15 | strong conflict | PASS | independent recheck→adjudication |
| 16 | same-type outlier | PASS | 차이 ≥2는 review trigger, 자동 FAIL 아님 |
| 17 | confidence | PASS | difficultyConfidence high/medium/low 및 UNKNOWN storage |
| 18 | boundary | PASS | difficultyBoundaryFlag와 인접 경계 재검 |
| 19 | independent recheck | PASS | low/boundary/conflict/outlier 대상 재검 |
| 20 | 분포 강제 금지 | PASS | 균등분배·부족 bucket 보정 금지 |
| 21 | L1/drift | PASS | L1 단위, 기준 재로드, 임의 상향 금지 |
| 22 | adaptive batch | PASS | 고정 문항 수가 아닌 token·복잡도 기반 |
| 23 | metadata-only | PASS | content/choices/answer/solution/image 등 보호 |
| 24 | fingerprint | PASS | source content fingerprint mutation 금지 |
| 25 | production apply | FAIL | DF-004: difficultyConfidence 저장 위치 누락 |
| 26 | tag/review status | PASS | reviewStatus에 HOLD/manual_review/reviewed_pass 배치 |
| 27 | UNKNOWN 처리 | PASS | UNKNOWN과 HOLD를 분리 |
| 28 | 자동출제 gate | PASS | reviewed_pass 중심, review 상태 제외 |
| 29 | foundation defect | PASS | 즉석 규칙 변경 금지, 별도 후보 기록 |
| 30 | adoption gate | FAIL | DF-003/DF-004 해소 조건 미충족 |

## 4. 추가 P1 findings

### [P1] DF-003 — BORDERLINE_ACCEPTABLE의 저장 필드와 허용 enum이 정의되지 않음

현재 조항:

- §2.1의 legacyLevelCompatibility 허용값: NORMAL | BORDERLINE_REVIEW | STRONG_CONFLICT | UNKNOWN
- §10의 경계 처리: 재검 후에도 인접 양쪽이 합리적이면 BORDERLINE_ACCEPTABLE을 기록할 수 있음
- 기존 통합운영프로토콜도 BORDERLINE_ACCEPTABLE을 기존 level 안정화 상태로 사용함

문제:

v1.1은 BORDERLINE_ACCEPTABLE을 기록하라고 하지만 legacyLevelCompatibility enum에는 이 값이 없다. 또한 이 값을 legacyLevelCompatibility, reviewStatus, 별도 report-only 상태 중 어디에 저장하는지도 정하지 않았다. 따라서 validator는 다음 중 하나가 된다.

1. §2.1 enum을 엄격히 적용해 BORDERLINE_ACCEPTABLE을 거부
2. §10을 적용해 선언되지 않은 값을 허용

기존 protocol의 상태값을 새 canonical field에 연결하는 경계이므로 LOCK 전 고정이 필요하다.

핀포인트 수정안:

- BORDERLINE_ACCEPTABLE을 legacyLevelCompatibility 허용값에 추가하거나
- 기존 level stability 전용 값임을 명시하고 reviewStatus 또는 별도 legacyLevelReviewStatus로 매핑한다.

어느 방식을 택하든 §2.1, §10, §11, §24 report schema, §25 validation gate에서 같은 저장 위치와 허용값을 사용해야 한다.

### [P1] DF-004 — canonical field difficultyConfidence의 production apply 저장 위치가 빠져 있음

Metadata Foundation v2 계획서 §6은 문항별 canonical metadata가 다음 필드를 표현해야 한다고 정의한다.

- difficultyBucket
- difficultyConfidence
- difficultyBoundaryFlag
- legacyLevelCompatibility

v1.1 §2.1에서도 difficultyConfidence를 canonical storage field로 정의하고, §24 report에서는 difficulty_confidence export mapping을 정의한다.

그러나 v1.1 §19.1의 production metadata 반영 목록은 다음뿐이다.

- difficultyBucket
- tagConfidence
- tagStatus
- reviewStatus

같은 절의 audit sidecar 목록에는 다음은 있지만:

- difficultyBoundaryFlag
- legacyLevelCompatibility

difficultyConfidence는 없다. §24의 CSV report 컬럼만으로는 production metadata 또는 audit sidecar에 보존된다고 볼 수 없다.

문제:

- low/medium/high 판정 근거가 production 또는 sidecar에 남지 않을 수 있음
- §18 independent recheck와 §20 자동 사용 gate가 동일 confidence 값을 읽을 저장 위치가 없음
- Metadata Contract v2의 canonical field와 production apply가 분리됨

핀포인트 수정안:

§19.1에서 difficultyConfidence를 production metadata 또는 audit sidecar의 명시 필드로 추가하고, 다음을 함께 고정해야 한다.

difficultyConfidence ∈ {high, medium, low, UNKNOWN}

어느 계층에 저장할지, builder/runtime sidecar parity로 어떻게 검증할지, reviewed_pass와의 관계를 §19·§20·§25에 명시해야 한다.

## 5. 비차단 문서 품질 메모

§9의 recheck 문장과 §25 validation 문장에 이중 backtick이 남아 있다.

- difficultyConfidence = medium + difficultyBoundaryFlag != NONE 표기
- difficultyConfidence = low 재검 또는 HOLD 표기

이 문제는 현재 의미론의 P0/P1 판정을 바꾸지는 않지만, canonical 문서로 봉인하기 전 일반적인 inline code 표기로 정리하는 것이 안전하다. candidate 원문은 이번 작업에서 수정하지 않았다.

## 6. 기존 authority와의 정합성

직접적인 의미 충돌은 확인하지 못했다.

- 기존 level = 하/중/상을 유지한다.
- 기존 LEVEL BORDERLINE STABILITY LOCK을 무효화하지 않는다.
- difficultyBucket을 level 대체 필드로 바꾸지 않는다.
- metadata-only migration과 source content fingerprint 불변 원칙을 유지한다.
- UNKNOWN은 미분류 sentinel, HOLD는 reviewStatus라는 분리는 기존 review status 운영과 충돌하지 않는다.
- Metadata Contract 후보의 세 canonical field명은 DF-002 수정으로 일치한다.

DF-003은 기존 통합운영프로토콜의 BORDERLINE_ACCEPTABLE을 새 legacyLevelCompatibility 저장 계약에 연결하지 않은 문제이고, DF-004는 Metadata Contract field와 production apply persistence의 연결 누락이다.

## 7. 최종 처리

- 전체 30개 절 재검: FAIL
- DF-001: PASS
- DF-002: PASS
- 추가 P0: 0건
- 추가 P1: 2건 — DF-003, DF-004
- v1.0 candidate: 보존
- v1.1 candidate: 보존
- canonical copy: 생성하지 않음
- CANONICAL_CANDIDATE → LOCKED: 수행하지 않음
- 기존 canonical 문서: 수정하지 않음
- production metadata/문항/Archive 2.0 코드: 수정하지 않음

DF-003·DF-004를 핀포인트 수정한 다음 동일한 30개 절 전체 재검을 다시 수행해야 한다. PASS 및 LOCK 이후의 다음 작업은 Metadata Contract v2 작성이며, 이번 작업에서는 시작하지 않았다.
