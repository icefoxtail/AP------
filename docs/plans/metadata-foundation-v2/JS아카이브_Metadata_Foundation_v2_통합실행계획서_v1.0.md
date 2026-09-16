# JS아카이브 Metadata Foundation v2 통합 실행계획서 v1.0

작성일: 2026-09-16  
대상: 코드검사실 / JS아카이브  
상태: FOUNDATION LOCK 이후 실행계획 확정
기본 실행 모델: Luna xhigh  
기본 작업 단위: **L1 대단원 1개**  
목표: **RPM Primary L1~L4 정본 + difficultyBucket 1~5를 하나의 문항 메타데이터 파이프라인으로 통합하고, 전 아카이브 문항의 canonical metadata를 재현 가능하게 업그레이드·검증한다.**

---

## 0. 한 줄 결론

이번 작업은 `분류체계 작업`과 `난이도 세분화 작업`을 따로 돌리지 않는다.

문항을 한 번 읽을 때 다음을 동시에 확정한다.

- L1 `majorUnit`
- L2 `midUnit`
- L3 `concept`
- L4 `problemType`
- `difficultyBucket` 1~5
- 필요한 경우 `secondaryConceptKeys`
- taxonomy applicability / confidence / review 상태

기존 `level: 하/중/상`은 유지한다.  
`difficultyBucket`은 기존 level을 대체하지 않고 내부 정밀 난이도로 활성화한다.

---

# 1. 현재 기준선

## 1.1 Taxonomy 기준

현재 taxonomy 정본:

`docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/`

상태: `TAXONOMY_AUTHORITY = LOCKED`

검증된 현재 규모:

- L1: 90
- L2: 221
- L3: 678
- L4: 1,400
- 교육과정별 Markdown: 26
- curriculum applicability 표시 node: 5

현재 v0.3 검증 상태:

- JSON full-path duplicate L2: PASS
- JSON full-path duplicate L3: PASS
- JSON full-path duplicate L4: PASS
- JSON ↔ CSV cardinality: PASS
- 26개 Markdown ↔ master: PASS
- 2015 M3-2 원의 성질 Pilot ↔ master: PASS
- `RPM_EXTENDED_CANDIDATE` 기본 출력 제외: PASS
- production migration: taxonomy lock만으로는 시작하지 않으며, Metadata Contract v2와 실제 L1 gate 이후 별도 branch에서 시작

## 1.2 Taxonomy 계층

```text
Curriculum
  ↓
Grade / Course
  ↓
Semester (중등)
  ↓
L1 majorUnit
  ↓
L2 midUnit
  ↓
L3 concept
  ↓
L4 problemType
```

별도 축:

```text
difficultyBucket
secondaryConceptKeys
skillTags
representationTags
templateKey
curriculumApplicability
defaultSelectable
tagConfidence
tagStatus
reviewStatus
```

## 1.3 기존 필드 주의

현재 repo의 `standardUnitKey / subUnitKey`는 교육과정·학년·과목에 따라 계층 깊이가 일정하지 않다.

따라서:

```text
기존 standardUnitKey = 새 L1
기존 subUnitKey      = 새 L2
```

라고 기계적으로 치환하지 않는다.

새 taxonomy와 기존 key 사이에는 반드시 migration map을 둔다.

---

# 2. 난이도 Authority

## 2.1 기존 level

기존:

```text
level = 하 | 중 | 상
```

유지한다.

기존 level은 과거 JS 작업 및 3차 검수를 거친 자산이므로 전면 폐기·전면 재작성하지 않는다.

## 2.2 신규 difficultyBucket

정식 허용값:

```text
difficultyBucket = 1 | 2 | 3 | 4 | 5
```

기존 level과의 기본 관계:

```text
1   → 하
2,3 → 중
4,5 → 상
```

중요:

- bucket 2를 `하`로 취급하지 않는다.
- bucket 5를 별도 `최상`이라는 기존 level로 만들지 않는다.
- 기존 3단계와 신규 5단계는 역할이 다르다.

## 2.3 핵심 경계

### 1 ↔ 2

질문:

> 문제를 읽자마자 사용할 개념·절차가 사실상 결정되는가?

1:
- 개념 1개 직접 적용
- 공식/절차가 거의 즉시 결정
- 조건 해석 부담 매우 낮음
- 직선적 풀이

2:
- 한 번의 조건 해석 또는 단순 변형 필요
- 전략 자체는 익숙
- 계산이 길어도 전략 선택 부담은 작음

### 2 ↔ 3

질문:

> 익숙한 풀이 틀을 그대로 적용하면 되는가, 풀이 방향을 한 번 선택해야 하는가?

2:
- 조건 → 방법 즉시 결정 → 실행

3:
- 조건 관계 파악
- 표현/식/접근 선택 필요
- 표준적인 내신 변별 요소 존재

### 3 ↔ 4

질문:

> 표준적인 개념 결합인가, 비정형 변형·복합조건 구조화가 필요한가?

3:
- 전형적인 내신 표준
- 둘 이상의 개념 결합 가능
- 유형 학습 안에서 예상 가능한 구조

4:
- 복합 조건
- 비정형 변형
- 경우 분기 / 범위 / 정수조건 / 존재성 판단 등이 중심부에 등장
- 상위권 변별

### 4 ↔ 5

질문:

> 어렵지만 익숙한 고난도인가, 결정적 발상 없이는 진행 자체가 어려운가?

4:
- 학습된 고난도 패턴의 조합
- 여러 단계 추론
- 접근법이 완전히 감춰지지는 않음

5:
- 결정적 관찰/발상 필요
- 문제 구조 재구성 필요
- 그 insight가 없으면 시작 또는 중간 진행이 막힘
- 계산량 자체는 5의 근거가 아님

---

# 3. 난이도 판정 Evidence

난이도는 다음을 함께 본다.

```text
content
+ choices
+ 필요한 visual
+ shared material
+ 검수 완료 solution
+ curriculum / course / unit context
```

solution은 적극 사용하되 **해설 길이·친절함 자체는 절대 난이도 근거로 사용하지 않는다.**

내부 audit evidence는 필요 시 다음처럼 구조화한다.

```text
conceptCount
conditionInterpretation
strategyChoice
nonRoutineTransformation
caseBranching
rangeConstraint
integerConstraint
existenceCheck
decisiveInsight
executionBurden
confidence
```

이 상세 evidence를 반드시 production JS에 전부 넣을 필요는 없다.

---

# 4. Curriculum applicability 정책

Taxonomy 존재 여부와 실제 현행 교육과정 기본 출력 여부를 분리한다.

## DEFAULT_SCOPE

- 해당 교육과정 기본 출력 허용
- production migration 승인 후 기본 선택 가능

## RPM_EXTENDED

- 공식 교육과정 기본 범위를 넘을 수 있으나 RPM에서 실제 유형으로 확인
- taxonomy에는 유지
- `defaultSelectable=false`
- 확장 유형 포함을 명시했을 때만 사용

## RPM_EXTENDED_CANDIDATE

- RPM/심화/실제 아카이브에 존재할 가능성이 있어 삭제하면 손실 위험이 있으나 근거가 아직 완전히 잠기지 않은 유형
- taxonomy에는 보존
- `defaultSelectable=false`
- 자동출제 사용 금지
- 실제 문항 migration 과정에서 evidence를 확보하면:
  - `RPM_EXTENDED` 승격
  - 또는 실제 근거가 없으면 `DELETE`

원칙:

> `교육과정 밖 = taxonomy에서 삭제`가 아니다.

과거 기출의 역사적 분류도 현행 교육과정 필터 때문에 삭제하지 않는다.

---

# 5. Scope Lock — 이번 프로젝트가 하는 것 / 안 하는 것

## 한다

- RPM Primary L1~L4 정본 봉인
- difficultyBucket 1~5 운영규칙 봉인
- 현재 production fresh inventory
- 문항별 L1~L4 전수 재분류
- 문항별 difficultyBucket 전수 판정
- 기존 level과 blind compare
- metadata migration
- metadata validator
- Metadata Contract v2 봉인

## 이번 프로젝트의 기본 범위가 아니다

- 문제 본문 수정
- choices 수정
- answer 수정
- solution 품질 전수 업그레이드
- image/SVG 수정
- 모든 templateKey 신규 전수 작성
- 모든 skillTags 전수 작성
- downstream consumer UI 본구현
- 자동출제 알고리즘의 최종 비율 설계

명백한 원문 오류가 발견되면 metadata 작업에 섞어 수정하지 않고 별도 defect queue로 분리한다.

---

# 6. 최종 Metadata Contract 후보

문항별 canonical metadata는 최소 다음을 표현할 수 있어야 한다.

```text
questionUid
sourceArchiveFile
sourceOrdinal
sourceFingerprint

curriculumKey
courseKey

majorUnitKey        # L1
majorUnit
midUnitKey          # L2
midUnit
conceptClusterKey   # L3
conceptCluster
problemTypeKey      # L4
problemType

secondaryConceptKeys[]

curriculumApplicability
defaultSelectable

difficultyBucket    # 1~5
difficultyConfidence
difficultyBoundaryFlag
legacyLevelCompatibility

templateKey         # 기존 값이 신뢰 가능할 때 유지, 이번 작업에서 강제 생성 안 함

tagConfidence
tagStatus
reviewStatus
metadataRevision
```

중요:

기존 `standardUnitKey / subUnitKey / level`은 backward compatibility 때문에 즉시 제거하지 않는다.

새 L1/L2는 기존 key에 억지로 덮어쓰지 않고 migration bridge를 사용한다.

---

# 7. 전체 실행 단계

---

## Phase 0 — Foundation Authority Lock

### 목표

본격 문항 작업 전에 기준을 딱 한 번 잠근다.

### 작업

1. Taxonomy v0.3 bounded acceptance 및 `RPM Primary Taxonomy v1.0 LOCKED`
2. LOCKED difficulty authority 확인
3. 실제 repo code를 읽고 Metadata Contract v2 확정
4. 기존 관련 문서와 field/precedence 정합성 확인
5. migration bridge와 production branch 정책 확정

### difficulty 운영규칙에서 반드시 봉인할 것

- bucket 1~5 정의
- 4개 경계
- blind first-pass
- solution evidence
- 금지 휴리스틱
- confidence
- boundary flag
- legacy level compare
- strong conflict
- independent recheck
- production apply gate

### 종료 Gate

```text
TAXONOMY_AUTHORITY = LOCKED
DIFFICULTY_AUTHORITY = LOCKED
METADATA_SCHEMA = LOCKED
PRODUCTION_QUESTION_MUTATION = 아직 금지
```

### 종료 원칙

이 단계 이후 **재현 가능한 구체적 결함이 없는 한 taxonomy 문서 버전업을 반복하지 않는다.**

---

## Phase 1 — Fresh Production Inventory

### 목표

과거의 `약 11,226문항` 같은 숫자를 분모로 고정하지 않고 현재 repo를 fresh scan한다.

### 전수 수집

- curriculum
- grade/course
- source exam
- questionUid
- sourceOrdinal
- standardUnitKey
- subUnitKey
- conceptClusterKey
- problemTypeKey
- templateKey
- level
- difficultyBucket
- solution 유무
- image/shared material dependency
- fingerprint
- metadata/review 상태

### 산출물

```text
CURRENT_PRODUCTION_INVENTORY.json
CURRENT_PRODUCTION_INVENTORY.csv
METADATA_COVERAGE_BASELINE.md
L1_WORK_QUEUE.json
```

### L1_WORK_QUEUE 필수 정보

각 L1마다:

```text
curriculum
course
L1
questionCount
sourceFileCount
L2Count
visualQuestionCount
sharedMaterialCount
existingMetadataCoverage
estimatedWorkSize
```

### 종료 Gate

```text
전체 denominator 고정
UID 중복/누락 상태 보고
L1 작업 큐 고정
현재 metadata coverage 고정
```

---

## Phase 2 — Calibration Wave

### 목표

랜덤 200~300문항을 따로 뽑아 장기 연구하지 않는다.

**실제 production L1 작업 2~3개를 calibration 겸 실전 작업으로 사용한다.**

단, 서로 다른 성격의 대단원을 고른다.

권장 선택 원칙:

- 중등 대수형 L1 하나
- 고등 함수/도형형 L1 하나
- 확률·미적분 등 추론형 L1 하나

정확한 대상은 Phase 1 inventory 후 결정한다.

### 방식

각 L1을 별도 작업으로 끝까지 수행한다.

1. blind classification
2. blind difficulty
3. legacy compare
4. conflict recheck
5. metadata candidate 생성
6. 독립 검수
7. rubric drift 분석

### Calibration에서 확인할 것

- L3/L4 경계 흔들림
- bucket 1↔2
- bucket 2↔3
- bucket 3↔4
- bucket 4↔5
- 기존 level 강한 충돌
- 동일/유사 problemType 난이도 outlier
- Luna batch drift
- confidence 규칙의 실효성

### 종료 Gate

세 L1에서 기준이 안정적이면:

```text
CLASSIFICATION_RUBRIC = FROZEN
DIFFICULTY_RUBRIC = FROZEN
```

그 이후 threshold나 taxonomy를 작업 중 임의 변경하지 않는다.

---

# 8. Luna xhigh 기본 작업 단위

## 기본

```text
1 작업 = L1 대단원 1개
```

L1 내부의 모든 L2/L3/L4를 함께 본다.

이유:

- 같은 대단원 안에서 유형 경계를 비교할 수 있음
- 난이도의 상대적 위치를 안정적으로 판단 가능
- L2 단위보다 context 활용 효율이 높음
- 작업 종료 지점이 명확함

## 예외 분할

L1이 너무 커서 한 작업에서 기준 drift 또는 context 위험이 있으면:

- L1을 유지한 채
- L2 2~3개 묶음으로만 분할
- 같은 L1을 연속 작업으로 완료한 뒤 다음 L1로 이동

임의로 여러 L1을 한 작업에 섞지 않는다.

분할 여부는 고정 문항 수가 아니라 preflight의:

- source token량
- solution 길이
- image/shared material 비율
- questionCount
- 예상 출력량

을 보고 결정한다.

---

# 9. 모든 Luna 작업에 붙이는 FOUNDATION LOCK

매 L1 작업의 첫머리에 아래 기준을 반복한다.

```text
[METADATA FOUNDATION v2 — FOUNDATION LOCK]

AUTHORITY
- Taxonomy: RPM Primary Canonical v1.0 LOCKED
- Difficulty: difficultyBucket 5단계 운영규칙 v1.0 LOCKED
- Metadata Contract: v2 LOCKED

PRIMARY TAXONOMY
L1 majorUnit
→ L2 midUnit
→ L3 concept
→ L4 problemType

PRIMARY PATH
- 문항당 primary L1→L4는 1개
- 복합 개념은 secondaryConceptKeys
- 키워드만 보고 분류 금지
- 문제 + solution의 실제 핵심 전략 기준
- 도형·그래프·표·입체는 representation/context일 수 있으며, 그 존재만으로 primary path를 결정하거나 source-unit outlier/HOLD를 만들지 않음

DIFFICULTY
difficultyBucket = 1|2|3|4|5

legacy compatibility:
1 → 하
2,3 → 중
4,5 → 상

BLIND RULE
- difficulty first-pass에서 기존 level 숨김
- 기존 difficultyBucket이 있으면 숨김
- 이전 reviewer verdict 숨김

EVIDENCE
- content
- choices
- visual/shared material
- 검수 완료 solution
- curriculum/course/L1 context

FORBIDDEN
- 해설 길이로 난이도 판단 금지
- 계산량만으로 bucket 상승 금지
- 기존 level 복사 금지
- L4를 소재/표현만 보고 판정 금지
- taxonomy node 신규 생성 금지
- LOCKED taxonomy 이름 임의 변경 금지
- 현재 L1 밖 작업 금지
- 문제/정답/해설/이미지 수정 금지

APPLICABILITY
- DEFAULT_SCOPE
- RPM_EXTENDED
- RPM_EXTENDED_CANDIDATE

RPM_EXTENDED_CANDIDATE는 자동출제 후보로 승격 금지.
```

Luna는 세션 기억에 의존하지 않고 매 작업에서 이 LOCK을 다시 읽는다.

---

# 10. L1 한 건의 표준 실행 파이프라인

## Step A — Scope Preflight

먼저 현재 L1의 정확한 denominator를 확정한다.

출력:

```text
L1
L2 목록
문항 수
source file 수
visual/shared dependency
기존 taxonomy coverage
기존 level 분포
기존 difficultyBucket 분포
```

denominator가 고정되기 전에는 분류 시작 금지.

---

## Step B — Taxonomy Candidate Scope

전체 1,400 L4를 모델에게 매번 던지지 않는다.

현재 L1 아래 허용되는:

```text
L2
L3
L4
```

만 추출한 `L1 taxonomy slice`를 사용한다.

Luna는 이 slice 밖의 canonical node를 만들거나 선택하지 않는다.

---

## Step C — Blind Classification + Blind Difficulty

각 문항에 대해 동시에 판정한다.

```text
questionUid

L1
L2
L3
L4

secondaryConceptKeys

curriculumApplicability

difficultyBucket
difficultyConfidence
difficultyBoundaryFlag

structured difficulty evidence
```

이 단계에서는 기존 `level`과 기존 bucket을 보지 않는다.

---

## Step D — Freeze First Pass

Blind 결과를 먼저 파일로 고정한다.

고정 전 기존 level compare 금지.

목적:

- 기존 값에 끌려가는 anchoring 방지
- 모델이 legacy 값을 단순 복사하는 문제 방지

---

## Step E — Legacy Compare

Blind 결과 고정 후 기존 `level`을 공개한다.

자연스러운 기본 조합:

```text
level 하 + bucket 1
level 중 + bucket 2
level 중 + bucket 3
level 상 + bucket 4
level 상 + bucket 5
```

다음은 review queue로 보낸다.

- strong conflict
- boundary flag
- low confidence
- 기존 metadata와 taxonomy 강한 충돌
- 동일/유사 problemType에서 bucket이 비정상적으로 튀는 문항

기존 level 자체는 자동 수정하지 않는다.

명백한 오분류 후보만 별도 queue로 분리한다.

---

## Step F — Independent Recheck

전체를 또 처음부터 두 번 읽지 않는다.

아래만 독립 재검:

- low confidence
- boundary
- strong legacy conflict
- same-type outlier
- curriculumApplicability 애매
- RPM_EXTENDED_CANDIDATE 관련 문항

필요하면 Luna xhigh 별도 세션으로 재판정한다.

아주 소수의 잔여 충돌만 더 강한 독립 판정으로 보낸다.

---

## Step G — L1 Adjudication

L1 안에서 최종적으로:

- L2/L3/L4 미분류
- duplicate primary
- 이상한 type 분포
- bucket 분포
- legacy conflict
- extended node 사용
- source별 편향

을 확인한다.

분포를 균등하게 만들지 않는다.

특정 bucket이 적다고 강제로 다른 문항을 옮기지 않는다.

---

## Step H — Metadata Apply

승인된 항목만 반영한다.

이번 작업은 metadata-only migration이다.

절대 수정 금지:

- content
- choices
- answer
- solution
- image
- layoutTag / wide
- source math

적용 후 source fingerprint가 content 계열 변경 때문에 달라지면 FAIL이다.

---

## Step I — Validation

최소 Gate:

```text
denominator before = denominator after
UID cardinality PASS
source join PASS
L1/L2/L3/L4 primary path PASS
invalid taxonomy path = 0
duplicate primary = 0
unapproved new taxonomy node = 0
difficultyBucket allowed values only
blind-result ledger preserved
review queue resolved or explicit HOLD
DEFAULT_SCOPE / EXTENDED policy PASS
source content fingerprint unchanged
JSON parse PASS
JS syntax PASS
metadata builder PASS
runtime sidecar parity PASS
```

---

## Step J — L1 Closeout

각 L1 완료 시 보고:

```text
L1:
총 문항:
L2:
L3:
L4 사용 유형 수:

difficulty:
1:
2:
3:
4:
5:

confidence:
high:
medium:
low:

legacy conflict:
strong:
boundary:
resolved:
HOLD:

taxonomy:
DEFAULT_SCOPE:
RPM_EXTENDED:
RPM_EXTENDED_CANDIDATE:

unclassified:
L2:
L3:
L4:
difficulty:

검증:
PASS / FAIL

변경 파일:
```

PASS가 아니면 다음 L1로 넘어가지 않는다.

---

# 11. 작업 중단·재개 안전장치

Luna가 긴 작업에서 기준을 잃지 않도록 각 L1에는 상태 파일을 둔다.

예시:

```text
status = NOT_STARTED
status = PREFLIGHT_DONE
status = BLIND_DONE
status = COMPARE_DONE
status = RECHECK_DONE
status = APPLIED
status = VALIDATED
status = SEALED
```

재개 시:

1. FOUNDATION LOCK 다시 읽기
2. 현재 L1 status 읽기
3. 이미 완료된 단계 재실행 금지
4. 다음 미완료 단계부터 시작

중간 batch 결과를 새 기준으로 임의 재해석하지 않는다.

---

# 12. Drift 방지

## 금지

작업 중 다음 발언을 근거로 기준 변경 금지:

- “이번 단원은 어려우니 전체적으로 한 단계 높이자”
- “bucket 1이 너무 적으니 2를 일부 1로 내리자”
- “이 유형이 taxonomy에 없으니 즉석으로 L4를 추가하자”

## 허용

구체적 재현 결함이 발견되면:

```text
FOUNDATION_DEFECT_CANDIDATE
```

로 별도 기록한다.

현재 L1 작업은 기존 LOCK 기준으로 마무리하거나 HOLD한다.

Foundation 변경은 별도 승인 후에만 한다.

---

# 13. Template / Secondary Tags 처리

이번 Foundation 작업의 주목표는:

```text
L1~L4
+
difficultyBucket
```

이다.

따라서:

- 기존 신뢰 가능한 `templateKey`는 보존
- templateKey 미분류를 전수 신규 생성하는 작업으로 확장하지 않음
- `skillTags`, `representationTags`도 필수 전수 작업으로 확장하지 않음
- secondaryConceptKeys는 복합문항에서 실제 필요할 때만 사용

이 원칙으로 scope creep를 막는다.

---

# 14. 확정 Coverage / Rollout 순서

Foundation lock 이후 실제 실행 순서는 다음으로 고정한다. 중간고사 범위인
geometry metadata를 먼저 처리한다. 각 항목은 서로 합치지 않는 독립 작업
단위이며, 각 작업 PASS 후 바로 closeout·commit·push한다.

```text
FOUNDATION LOCK
  → 2015 고1 수학(상) — H15-SA-10 직선의 방정식
  → 2015 고1 수학(상) — H15-SA-11 원의 방정식
  → 2015 고1 수학(상) — H15-SA-12 도형의 이동
  → 2022 고1 공통수학2 — H22-C2-02 직선의 방정식
  → 2022 고1 공통수학2 — H22-C2-03 원의 방정식
  → 2022 고1 공통수학2 — H22-C2-04 도형의 이동

  → 2015/2022 집합은 기존 완료 범위를 유지하고 재작업하지 않음

  → 고1 나머지
  → 중3
  → 중2
  → 중1
  → 고2
```

2015와 2022는 하나의 작업으로 합치지 않는다. 완료된 291문항과 완료된
집합 범위는 다시 분류하지 않고, fresh inventory에서 아직 닫히지 않은
geometry 작업 단위부터 지정 순서로 처리한다.

변경이 필요하면 foundation defect를 즉석 수정하지 않고 별도
`FOUNDATION_DEFECT_CANDIDATE`로 기록한다. **L1 단위 실행 규칙은 변경하지
않는다.**

---

# 15. Metadata Foundation 계속 진행 Gate

전체 archive 전수 migration 완료를 기다리지 않고, fresh inventory의 미완료
L1을 하나씩 처리한다. 다음 L1을 시작하려면 직전 L1의 denominator,
canonical path, difficulty 4-field, conflict adjudication, sidecar parity,
source fingerprint gate가 모두 PASS여야 한다.

아직 분류되지 않은 문항은 안전하게:

```text
taxonomyStatus = UNKNOWN
difficultyBucket = UNKNOWN
```

으로 취급할 수 있어야 한다.

# 16. Metadata Foundation이 보장하는 산출물

Foundation data는 canonical metadata 저장 계약과 검증 evidence로만 확정한다.

- L1/L2/L3/L4 primary path
- `secondaryConceptKeys`
- `curriculumApplicability` / `defaultSelectable`
- `difficultyBucket` 1~5 또는 `UNKNOWN`
- `difficultyConfidence` / `difficultyBoundaryFlag`
- `legacyLevelCompatibility`
- `reviewStatus` / `metadataRevision`
- source identity 및 source/content fingerprint
- L1별 blind ledger, freeze, recheck, adjudication, closeout

아직 분류되지 않은 문항은 `taxonomyStatus=UNKNOWN`,
`difficultyBucket=UNKNOWN`으로 명시하며, legacy field를 새 canonical로
추정하지 않는다. `RPM_EXTENDED_CANDIDATE`는 taxonomy policy에 따라 기본
선택에서 제외한다.

---

# 16. Metadata Foundation 최종 산출물

Foundation data가 충분히 채워지면 다음이 가능해야 한다.

```text
L1 범위 출력
L2 범위 출력
L3 개념 출력
L4 세부유형 출력

difficultyBucket 1~5 선택
L4 × 난이도 조합 출제

problemType 중복 제한
template 중복 제한
source 중복 제한

DEFAULT_SCOPE만 출력
확장 유형 포함 출력

학교/연도/시험별 L4 출제 빈도
학생별 취약 L4
동일 L4의 난이도 상승 재출제
shortage 판단
```

이 기능들은 Foundation이 제공하는 metadata를 소비할 뿐,
UI에서 taxonomy를 새로 추론하지 않는다.

---

# 17. 전체 완료 Gate

전체 production 분류 프로젝트의 최종 PASS 조건:

```text
fresh production denominator 100% accounted

L1 assigned: 100%
L2 assigned: 100%
L3 assigned: 100% 또는 명시 HOLD
L4 assigned: 100% 또는 명시 HOLD
difficultyBucket: 100% 또는 명시 HOLD

invalid canonical path: 0
duplicate primary: 0
unknown newly invented node: 0

all strong conflict adjudicated
all low confidence adjudicated or HOLD
all RPM_EXTENDED_CANDIDATE evidence reviewed

source content fingerprint mutation: 0
metadata builder PASS
runtime parity PASS

coverage report generated
migration map generated
Foundation release manifest generated
```

HOLD는 숨기지 않는다.

HOLD를 억지로 분류하여 100% 숫자를 만드는 것보다,
명시적인 HOLD가 있는 것이 정상이다.

---

# 18. 문서 업데이트

Foundation 채택 시 최소 다음 문서의 정합성을 맞춘다.

- `JS아카이브룰북_v2.6`
- `JS아카이브_표준단원키_마스터테이블`
- `JS아카이브_세부단원_운영규칙_v1`
- `JS아카이브_3차검수_프로토콜`
- 통합운영프로토콜
- 신규 `difficultyBucket 5단계 운영규칙`
- 신규 Taxonomy v1.0 canonical
- Metadata Contract v2

각 문서에 같은 난이도 기준을 복제해서 따로 관리하지 않는다.

**difficultyBucket 상세 기준은 신규 canonical 운영규칙을 단일 authority로 두고 다른 문서는 참조한다.**

---

# 19. Git / 작업 안전 규칙

각 L1 작업은 독립 변경셋으로 유지한다.

금지:

```text
git add .
git add -A
git stash
git reset --hard
git clean
```

다른 병렬 작업 파일을 건드리지 않는다.

commit / push / merge는 별도 명시 지시가 있을 때만 한다.

L1 작업 과정에서 만든 임시 산출물을 repo root에 흩뿌리지 않는다.

---

# 20. 권장 실제 진행 순서

```text
[0]
Taxonomy v0.3
→ bounded final acceptance
→ Taxonomy v1.0 LOCKED

[1]
difficultyBucket 핸드오프
→ 운영규칙 v1.0 작성
→ 독립 검수
→ LOCKED

[2]
Metadata Contract v2 작성
→ 기존 builder/runtime와 충돌검사
→ LOCKED

[3]
고1 fresh production inventory
→ 2015/2022 분리
→ exact denominator
→ L1_WORK_QUEUE

[4]
2015 H15-SA-10 직선의 방정식
→ PASS / closeout / commit / push

[5]
2015 H15-SA-11 원의 방정식
→ PASS / closeout / commit / push

[6]
2015 H15-SA-12 도형의 이동
→ PASS / closeout / commit / push

[7]
2022 H22-C2-02 직선의 방정식
→ PASS / closeout / commit / push

[8~]
2022 H22-C2-03 원의 방정식
→ PASS / closeout / commit / push

[9]
2022 H22-C2-04 도형의 이동
→ PASS / closeout / commit / push

[10~]
고1 나머지 → 중3 → 중2 → 중1 → 고2
→ L1 하나씩 production classification + difficulty migration

[마지막]
전체 metadata coverage audit
→ Metadata Foundation v2 release seal
```

---

# 21. 바로 다음 작업

Foundation 문서 lock 이후에는 현재 repo를 fresh scan하여 2015/2022 고1
denominator를 확정하고 `L1_WORK_QUEUE`를 갱신한다. 중간고사 우선순위는
다음과 같다.

1. 2015 `H15-SA-10` 직선의 방정식
2. 2015 `H15-SA-11` 원의 방정식
3. 2015 `H15-SA-12` 도형의 이동
4. 2022 `H22-C2-02` 직선의 방정식
5. 2022 `H22-C2-03` 원의 방정식
6. 2022 `H22-C2-04` 도형의 이동

2015/2022 집합(`H15-SB-01`, `H22-C2-05`)은 완료 범위를 유지하고
재작업하지 않는다. 이후에도 `고1 나머지 → 중3 → 중2 → 중1 → 고2`
순서로 metadata migration을 확장한다.

---

# 22. 종료 정의

Metadata Foundation v2의 목적은 문서 숫자를 늘리는 것이 아니다.

종료 상태는 다음이다.

> 모든 작업자가 동일한 L1~L4와 동일한 difficultyBucket 기준을 사용하고,
> 문항별 canonical metadata가 재현 가능하게 생성·검수되며,
> downstream consumer가 별도 추론 없이 그 데이터를 그대로 소비할 수 있는 상태.

이 상태에 도달하면 Foundation 설계를 멈추고, 봉인된 metadata package를
별도 downstream 작업에 전달한다.
