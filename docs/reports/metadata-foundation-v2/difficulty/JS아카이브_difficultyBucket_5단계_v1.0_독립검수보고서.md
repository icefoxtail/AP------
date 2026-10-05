# JS아카이브 `difficultyBucket` 5단계 v1.0 독립검수보고서

작성일: 2026-09-16  
검수 대상: `docs/proposals/metadata-foundation-v2/difficulty/JS아카이브_difficultyBucket_5단계_운영규칙_v1.0.md`  
원본: `C:\Users\USER\Downloads\JS아카이브_difficultyBucket_5단계_운영규칙_v1.0.md`  
원본 SHA-256: `3792ed640a5e4a81dcd55139ed4793ea3e9e9ecd10940a2e53bceac3d7b6f56f`  
판정: **FAIL — `CANONICAL_CANDIDATE` 유지, canonical 승격 금지**

## 1. 검수 범위

문서 전체 30개 절을 읽고 다음 항목을 전수 대조했다.

- 기존 `level` 하/중/상 보존 및 compatibility
- bucket 1~5 정의와 기출 중심 원칙
- `1↔2`, `2↔3`, `3↔4`, `4↔5` 경계
- blind first-pass와 freeze 순서
- 문제·보기·visual/shared material·검수 완료 solution evidence
- confidence `high/medium/low`
- boundary `B12/B23/B34/B45`
- legacy conflict, same-type outlier, independent recheck
- 분포 강제 금지와 curriculum-relative 원칙
- taxonomy와 difficulty의 독립 축 관계
- Metadata Foundation v2의 L1 단위 작업, metadata-only migration, source fingerprint 불변, UNKNOWN/HOLD 처리
- `tagConfidence`/`tagStatus`, `reviewed_pass`, production apply, validation, adoption gate

## 2. 총평

난이도 의미론 자체는 현재 문서 구조와 대체로 정합하다. 특히 다음은 PASS다.

| 항목 | 판정 | 근거 |
|---|---|---|
| 기존 level 보존 | PASS | 3단계 `level`을 유지하고 bucket을 보조 메타데이터로 둔다. |
| 기본 compatibility | PASS | `1→하`, `2,3→중`, `4,5→상`으로 정의되어 있으며 `1~2→하`로 바꾸지 않는다. |
| 네 개 경계 | PASS | 전략 선택, 복합조건 구조화, decisive insight를 각각 인접 경계의 중심 기준으로 둔다. |
| 기출 중심 | PASS | 교재식 별도 체계나 `최상` level을 도입하지 않는다. |
| blind first-pass | PASS | 기존 level·bucket·이전 verdict를 숨기고 결과를 freeze한 뒤 compare한다. |
| solution evidence | PASS | 풀이 구조를 사용하되 해설 길이·문장 수를 난이도 근거로 금지한다. |
| conflict 처리 | PASS | 기존 level을 즉시 수정하지 않고 conflict 추출→독립 재검→adjudication 순서를 둔다. |
| 분포 강제 금지 | PASS | 균등분배·부족 bucket 보충·학교 평균 난도 상향을 금지한다. |
| curriculum-relative | PASS | 교육과정·과목·학습 단계의 인지 부담으로 비교한다. |
| taxonomy 독립성 | PASS | v0.3 schema의 orthogonal tag 구조 및 계획서의 별도 축과 충돌하지 않는다. |

그러나 다음 두 결함은 Metadata Contract와 production validation이 동일한 저장 계약을 사용한다는 보장이 없으므로 canonical LOCK 전에 해결되어야 한다.

## 3. FAIL findings

### [P1] DF-001 — `difficultyBucket` 허용값과 UNKNOWN/HOLD 상태가 문서 안에서 충돌한다

현재 조항:

- §2 원칙 1: `difficultyBucket`은 반드시 `1|2|3|4|5` 중 하나로 판정한다고 명시한다.
- §21: 미분류 문항을 `difficultyBucket = UNKNOWN`으로 취급한다고 명시한다.
- §25: validation에서 `difficultyBucket ∈ {1,2,3,4,5} 또는 explicit UNKNOWN/HOLD`를 허용한다.
- §20: `manual_review` 등의 상태를 자동 추천·자동출제에서 제외한다.

문제:

동일 필드가 동시에 “항상 1~5만 허용되는 판정값”이면서 “미분류·보류 시 UNKNOWN/HOLD를 저장할 수 있는 상태값”으로 정의되어 있다. 그러면 다음 두 validator가 모두 문서상 가능해진다.

1. §2를 엄격히 적용하여 `UNKNOWN/HOLD`를 invalid로 거부하는 validator
2. §21·§25를 적용하여 `UNKNOWN/HOLD`를 유효한 `difficultyBucket` 값으로 허용하는 validator

이 모순은 아직 production migration이 시작되지 않았더라도 Metadata Contract v2의 타입, migration gate, Archive 2.0 reader가 서로 다른 계약을 구현하게 만들 수 있다.

핀포인트 수정안:

다음 중 하나의 저장 모델을 문서에 명시하고 전 절의 표현을 통일해야 한다.

권장안:

```text
difficultyBucket:
  확정 판정 상태 = 1|2|3|4|5
  미분류 상태 = UNKNOWN

reviewStatus:
  HOLD / manual_review 등은 상태 필드에 저장
```

최소 수정으로는 §2의 “반드시 `1|2|3|4|5` 중 하나로 판정”을 “확정 판정값은 `1|2|3|4|5` 중 하나이며, 미분류·보류 문항은 명시적으로 `UNKNOWN/HOLD` 상태로 남길 수 있다”로 바꾸고, `HOLD`가 `difficultyBucket` 값인지 `reviewStatus` 값인지 명시해야 한다. §21·§25와 Metadata Contract 후보도 같은 모델로 맞춰야 한다.

### [P1] DF-002 — Metadata Contract v2 후보 필드명과 운영규칙 필드명이 매핑되지 않는다

Metadata Foundation v2 통합 실행계획서 §6의 후보 canonical 필드는 다음과 같다.

```text
difficultyConfidence
difficultyBoundaryFlag
legacyLevelCompatibility
```

그러나 difficulty 운영규칙은 다음 이름을 사용한다.

```text
confidence
boundaryFlag
compatibilityStatus
```

보고서 권장 컬럼은 다시 다음 snake_case 이름을 사용한다.

```text
confidence
boundary_flag
compatibility_status
```

문제:

운영규칙이 canonical authority로 승격될 경우 어떤 이름이 실제 metadata contract의 정본 필드인지 결정되어 있지 않다. 이 상태로는 builder/runtime/sidecar가 `difficultyConfidence`와 `confidence`를 서로 다른 필드로 만들거나, `legacyLevelCompatibility`와 `compatibilityStatus`를 중복 생성할 수 있다. 기존 canonical 문서의 `tagConfidence`, `tagStatus`, `reviewStatus`와도 저장 계층이 명확히 구분되지 않는다.

핀포인트 수정안:

운영규칙 또는 Metadata Contract v2 초안에 아래와 같은 단일 매핑 표를 추가하고, 운영규칙의 본문·검증 게이트·보고서 컬럼에 적용해야 한다.

```text
canonical field: difficultyConfidence
operating alias: confidence
report column: confidence

canonical field: difficultyBoundaryFlag
operating alias: boundaryFlag
report column: boundary_flag

canonical field: legacyLevelCompatibility
operating alias: compatibilityStatus
report column: compatibility_status
```

또는 canonical 필드명을 운영규칙 전체에서 직접 사용해야 한다. 어느 방식을 택하든 LOCK 전에 하나로 고정해야 한다.

## 4. 기존 canonical 문서와의 충돌

직접적인 의미 충돌은 확인되지 않았다.

- `JS아카이브룰북_v2.6`의 `difficultyBucket`은 `level`을 대체하지 않는 보조 난이도 필드라는 원칙과 일치한다.
- `JS아카이브_3차검수_프로토콜.md`의 level 허용값 `하/중/상`, 기존 level을 복사하지 않는 원칙, 계산량만으로 판단하지 않는 원칙과 일치한다.
- 통합운영프로토콜의 `LEVEL BORDERLINE STABILITY LOCK` 및 원문·solution 보호 원칙과 일치한다.
- taxonomy v0.3의 orthogonal tags, primary L1→L4 path, `RPM_EXTENDED_CANDIDATE` 자동출제 금지와 충돌하지 않는다.

다만 DF-002는 기존 문서와의 의미 충돌이 아니라 Metadata Contract v2로 연결되는 필드명 정합성 결함이다.

## 5. 최종 판정 및 후속 조치

- 독립검수: **FAIL**
- difficulty 원문: proposal candidate로 보존
- canonical copy: 생성하지 않음
- `CANONICAL_CANDIDATE → LOCKED`: 승격하지 않음
- 기존 canonical 문서: 수정하지 않음
- production migration / 전수 태깅: 시작하지 않음
- Archive 2.0 코드·runtime: 수정하지 않음

먼저 DF-001과 DF-002를 핀포인트 수정하고 동일 전체 조항 검수를 다시 수행해야 한다. 재검 PASS 및 LOCK 이후 정상적인 다음 작업은 `Metadata Contract v2` 작성이다. 이번 작업에서는 Metadata Contract를 작성하지 않았다.
