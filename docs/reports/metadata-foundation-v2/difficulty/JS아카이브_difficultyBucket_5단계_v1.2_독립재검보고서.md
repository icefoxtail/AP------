# JS아카이브 difficultyBucket 5단계 v1.2 독립재검보고서

작성일: 2026-09-16  
검수 대상: docs/proposals/metadata-foundation-v2/difficulty/JS아카이브_difficultyBucket_5단계_운영규칙_v1.2.md  
원본: C:\Users\USER\Downloads\JS아카이브_difficultyBucket_5단계_운영규칙_v1.2.md  
원본 크기: 36,563 bytes  
원본 SHA-256: 395d6e55c10b4c790a9c63ed28284d985de943cad2490894c5ac7b0ba4b3799e  
판정: FAIL — CANONICAL_CANDIDATE 유지, canonical 승격 금지

## 1. 재검 대상과 방법

v1.1 독립재검보고서의 DF-003·DF-004를 먼저 대조한 뒤, v1.2의 30개 절을 처음부터 끝까지 다시 읽었다.

검수축:

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

## 2. DF-001 ~ DF-004 재검

### DF-001 — PASS

v1.2는 다음을 명확히 분리한다.

- difficultyBucket: 1|2|3|4|5|UNKNOWN
- UNKNOWN: 미분류 sentinel
- reviewStatus = HOLD: 보류 상태
- difficultyBucket에 HOLD, manual_review, reviewed_pass 저장 금지
- validator가 HOLD를 bucket 값으로 허용하지 않음

v1.0의 bucket/state 혼용 문제는 해결되었다.

### DF-002 — PASS

v1.2 본문은 다음 canonical field명을 사용한다.

- difficultyConfidence
- difficultyBoundaryFlag
- legacyLevelCompatibility

v1.0의 confidence, boundaryFlag, compatibilityStatus 식별자 문제는 해결되었다.

### DF-003 — PASS

v1.2는 legacyLevelCompatibility enum에 BORDERLINE_ACCEPTABLE을 추가하고, 다음 의미와 전이를 고정했다.

- BORDERLINE_REVIEW: 인접 legacy-level mismatch의 재검 대기
- BORDERLINE_ACCEPTABLE: 재검 후 LEVEL BORDERLINE STABILITY LOCK에 따라 mismatch를 허용하기로 확정
- 순수 difficulty 경계 B12/B23/B34/B45만으로는 BORDERLINE_ACCEPTABLE을 기록하지 않음
- BORDERLINE_ACCEPTABLE은 reviewStatus나 difficultyBoundaryFlag가 아님

v1.1의 저장 위치·enum 결함은 해결되었다.

### DF-004 — PASS

v1.2는 다음 4개 필드를 canonical metadata layer에 함께 저장하도록 명시한다.

- difficultyBucket
- difficultyConfidence
- difficultyBoundaryFlag
- legacyLevelCompatibility

또한 generated metadata/runtime sidecar가 존재하는 경우 4개 필드의 1:1 parity를 요구하고, 선택적인 audit sidecar 정보와 구분한다.

v1.1의 difficultyConfidence persistence 누락은 해결되었다.

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
| 10 | 기출 중심 | PASS | 별도 기초/최상 level 체계 미도입 |
| 11 | curriculum-relative | PASS | 교육과정·과목·학습 단계 인지 부담 기준 |
| 12 | blind first-pass | PASS | 기존 level·bucket·verdict 숨김 |
| 13 | first-pass freeze | PASS | freeze 후 legacy compare |
| 14 | legacy compare | PASS | 기존 level 즉시 수정 금지 |
| 15 | strong conflict | PASS | independent recheck→adjudication |
| 16 | same-type outlier | PASS | 차이 ≥2는 review trigger, 자동 FAIL 아님 |
| 17 | confidence | PASS | difficultyConfidence와 UNKNOWN storage 구분 |
| 18 | boundary | PASS | difficultyBoundaryFlag와 legacy mismatch를 구분 |
| 19 | independent recheck | PASS | low/boundary/conflict/outlier 대상 재검 |
| 20 | 분포 강제 금지 | PASS | 균등분배·부족 bucket 보정 금지 |
| 21 | L1/drift | PASS | L1 단위, 기준 재로드, 임의 상향 금지 |
| 22 | adaptive batch | PASS | 고정 문항 수가 아닌 token·복잡도 기반 |
| 23 | metadata-only | PASS | content/choices/answer/solution/image 등 보호 |
| 24 | field/report parity | FAIL | DF-005: 4필드 parity와 report mapping 불일치 |
| 25 | production apply | PASS | 4개 canonical field의 metadata persistence 명시 |
| 26 | tag/review status | PASS | reviewStatus와 legacyLevelCompatibility 역할 구분 |
| 27 | UNKNOWN 처리 | PASS | UNKNOWN과 HOLD를 분리 |
| 28 | 자동출제 gate | PASS | reviewed_pass 조건과 conflict gate 명시 |
| 29 | foundation defect | PASS | 즉석 규칙 변경 금지, 별도 후보 기록 |
| 30 | adoption gate | FAIL | DF-005 해소 조건 미충족 |

총계: 28개 PASS, 2개 FAIL.

## 4. 추가 P1 finding

### [P1] DF-005 — 4개 canonical field parity와 §24 report mapping이 불일치함

현재 v1.2의 §19.1과 §25는 canonical difficulty field를 4개로 고정한다.

- difficultyBucket
- difficultyConfidence
- difficultyBoundaryFlag
- legacyLevelCompatibility

또한 builder → generated metadata → runtime sidecar 사이에서 4개 필드의 1:1 parity를 요구한다.

그러나 §24에는 다음 문제가 남아 있다.

1. report CSV에는 final_bucket 컬럼이 있지만, export mapping은 세 필드만 정의한다.

   - difficulty_confidence ← difficultyConfidence
   - difficulty_boundary_flag ← difficultyBoundaryFlag
   - legacy_level_compatibility ← legacyLevelCompatibility

2. difficultyBucket에 대한 final_bucket ← difficultyBucket mapping이 없다.
3. §24에 “builder/runtime/sidecar의 canonical field명은 camelCase 3개”라고 적혀 있어, 앞 절의 4개 field parity와 직접 불일치한다.

문제:

- report의 final_bucket이 difficultyBucket의 export인지 별도 값인지 결정되어 있지 않음
- 보고서·builder·generated metadata·runtime sidecar 사이에서 4개 필드가 동일한 계약인지 문서만으로 보장되지 않음
- v1.2가 해결했다고 선언한 “4개 필드 1:1 parity”가 §24에서 3개 field contract로 축소되어 있음

핀포인트 수정안:

§24 report export mapping을 다음처럼 4개로 고정해야 한다.

- final_bucket ← difficultyBucket
- difficulty_confidence ← difficultyConfidence
- difficulty_boundary_flag ← difficultyBoundaryFlag
- legacy_level_compatibility ← legacyLevelCompatibility

그리고 “camelCase 3개”를 “camelCase 4개”로 수정해야 한다. L1 closeout의 blind_bucket은 first-pass evidence용 별도 report field인지, canonical difficultyBucket의 export인지도 명시해야 한다.

이 수정은 §24와 §25의 parity 문장을 동일하게 맞추는 P1 계약 정합성 수정이다.

## 5. 문서 품질 재검

v1.1에서 보고된 §9·§25의 이중 backtick 표기는 v1.2에서 정상 inline code 표기로 정리되었다.

v1.2의 fenced code block delimiter도 126개로 짝이 맞으며, unpaired fence는 확인되지 않았다.

## 6. 기존 authority와의 정합성

직접적인 의미 충돌은 확인하지 못했다.

- 기존 level = 하/중/상을 유지한다.
- 기존 LEVEL BORDERLINE STABILITY LOCK을 무효화하지 않는다.
- difficultyBucket을 level 대체 필드로 바꾸지 않는다.
- metadata-only migration과 source content fingerprint 불변 원칙을 유지한다.
- UNKNOWN은 미분류 sentinel, HOLD는 reviewStatus라는 분리를 유지한다.
- BORDERLINE_ACCEPTABLE은 순수 difficulty boundary가 아니라 legacy-level 인접 mismatch 허용 상태로 좁혀졌다.
- canonical metadata persistence 4개 field의 방향은 Metadata Foundation v2 계획서와 일치한다.

DF-005는 기존 canonical 문서의 의미 충돌이 아니라, v1.2 내부의 report export field count와 4-field parity 문장 사이의 계약 연결 결함이다.

## 7. 최종 처리

- 전체 30개 절 재검: FAIL
- DF-001: PASS
- DF-002: PASS
- DF-003: PASS
- DF-004: PASS
- 추가 P0: 0건
- 추가 P1: 1건 — DF-005
- v1.0 candidate: 보존
- v1.1 candidate: 보존
- v1.2 candidate: 보존
- canonical copy: 생성하지 않음
- CANONICAL_CANDIDATE → LOCKED: 수행하지 않음
- 기존 canonical 문서: 수정하지 않음
- production metadata/문항/Archive 2.0 코드: 수정하지 않음

DF-005를 핀포인트 수정한 다음 동일한 30개 절 전체 재검을 다시 수행해야 한다. PASS 및 LOCK 이후의 다음 작업은 Metadata Contract v2 작성이며, 이번 작업에서는 시작하지 않았다.
