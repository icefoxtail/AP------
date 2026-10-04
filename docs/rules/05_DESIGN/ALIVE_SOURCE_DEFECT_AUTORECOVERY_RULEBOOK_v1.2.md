# ALIVE Source Defect Auto-Recovery Rulebook v1.2

> 상태: **DESIGN_CANDIDATE / NOT YET OPERATIVE**  
> 현재 제안 위치: `alive/05_DESIGN/ALIVE_SOURCE_DEFECT_AUTORECOVERY_RULEBOOK_v1.2.md`  
> Canonical 승격 시 이동 위치: `alive/01_CANONICAL/ALIVE_SOURCE_DEFECT_AUTORECOVERY_RULEBOOK_v1.2.md`  
> 목적: 기출·원문 기반 문항 생성 과정에서 확인된 **source defect를 원본 훼손 없이 자동 복구 가능한 파생문항으로 전환**하고, 사람 검토를 최종 예외 경로로 축소한다.  
> 적용 전제: 본 문서는 `alive/00_ALIVE_INDEX.md`, `ALIVE_MASTER_RULEBOOK`, Prompt Compiler, Validation Sidecar, Archive/Similar Skill, Runtime과 연결되기 전까지 운영 정본으로 간주하지 않는다.

---

## v1.2 변경 요약

v1.1 전수 정합성 검수에서 확인된 **P0 3건 / P1 4건 / P2 2건**과,
그 검수 이후 확정한 정책 경계를 반영했다.

핵심 변경:

- 기존 `APPROVED_SOURCE_REPAIR` 의미를 변경하지 않고 세 개념을 완전 분리
  - `SOURCE_FIDELITY_RESTORATION`
  - `APPROVED_SOURCE_REPAIR`
  - `DERIVED_SOURCE_RECOVERY`
- `DERIVED_REPLACEMENT_VERIFIED`를 **신규 canonical scope disposition 후보**로 정의
- 최초 `INITIAL_INCLUDED_SCOPE_UID_SET`을 줄이지 않고 source slot이 recovered slot으로 1:1 승계되는 denominator closure 정의
- `SHADOW_ONLY / BOUNDED_PRODUCTION / DEFAULT_PRODUCTION` recovery authority 축 신설
- `NOT_AUTHORIZED / AUTHORIZED / ADOPTED` production adoption 축 신설
- `SHADOW_AUTO_RECOVER` 결과가 release authority로 사용되지 못하도록 HARD gate 추가
- tier 상태를 `applicability / capability / execution` 3축으로 분리
- R6 reduced fingerprint에서 `broad problem family / problemType / solutionEntry`를 `IF STABLY INFERABLE` 추가 lock으로 통일
- `RECOVERY_TARGETED_REPAIR`를 frozen candidate mutation이 아니라 **동일 recoveryPlanId 아래 새 candidateVersion 생성**으로 재정의
- source evidence 부족을 `SOURCE_RECOVERY_EVIDENCE_BLOCKED` + resume contract로 분리
- `AUTO_RECOVERY_EXHAUSTED`를 status enum에서 제거하고 `exhaustionStatus` evidence로만 사용
- 최종 기본 흐름을 무조건 AUTO_RECOVER가 아니라 `APPLY sourceRecoveryPolicy`로 수정
- Common Protocol / 통합운영프로토콜 / Validation Sidecar / Master / Runtime / Prompt Compiler에 필요한 **정본 보강과 유지 영역을 명시적으로 분리**

## v1.2 정책 경계 확정

본 버전은 "새 문서를 기존 정본에 무조건 맞추는 것"을 목표로 하지 않는다.

이번 설계가 요구하는 변화 중 일부는 **기존 정본을 의도적으로 확장해야 하는 신규 lifecycle**이다.
반면 기존 안전장치의 의미는 유지한다.

### 변경하지 않는 기존 정본 원칙

다음은 본 규칙이 supersede하지 않는다.

```text
SOURCE TRUTH / 원본 성역
기존 APPROVED_SOURCE_REPAIR의 명시 승인 원칙
수학 오류 검증기의 검증 전용 / 수정안 출력 금지
blind independent math
Candidate FREEZE
일반 Runtime REGENERATE
initial denominator 축소 우회 금지
unresolved correctness defect Final Seal 금지
ALIVE finalStatus = PASS | HOLD | BLOCKED | FAIL
actual render / final closure
source lineage / SHA / ledger
```

### 신규로 추가하는 개념

```text
DERIVED_SOURCE_RECOVERY
DERIVED_REPLACEMENT_VERIFIED
recoveryAuthority
productionAdoptionStatus
tier applicability/capability/execution
SOURCE_RECOVERY_EVIDENCE_BLOCKED
recovery replacement lineage parity
```

### 기존 정본에 필요한 보강

본 규칙의 production 승격을 위해 최소 다음 정본은 **의미를 약화하지 않고 확장**해야 한다.

```text
COMMON_PROTOCOL
  -> DERIVED_REPLACEMENT_VERIFIED final-scope disposition
  -> 1:1 replacement parity
  -> unauthorized recovery adoption release gate

통합운영프로토콜
  -> 기존 APPROVED_SOURCE_REPAIR 의미 유지
  -> DERIVED_SOURCE_RECOVERY 별도 route 연결

Validation Sidecar
  -> recovery / authority / adoption / evidence-blocked schema + codes

ALIVE Master
  -> source defect recovery 문서로 route하는 얇은 연결

Runtime / Prompt Compiler
  -> recovery state/resume/current-tier rules 조건부 연결

Index / rule_pack.py / MANIFEST / pipeline-core
  -> canonical promotion 이후 active ruleset 및 closure에 실제 편입
```

본 문서가 `05_DESIGN`에 있는 동안 위 변경은 **required amendment proposal**이며,
현재 production authority를 자동으로 변경하지 않는다.

## 0. 문서 목적

현재 APMath/ALIVE 파이프라인은 다음 능력을 이미 분리해 가지고 있다.

- 원본 source lock 및 source fidelity 확인
- 문항별 독립 풀이
- 정답·보기·발문의 충돌 탐지
- source defect / answer defect 보존
- 유사문항 생성
- candidate build
- 독립 수학 검증
- curriculum / fidelity / distractor / visual 검증
- serializer / render / package / freeze
- source resolution ledger 및 approved repair 추적

그러나 현재 운영은 **source defect를 발견한 뒤 사람이 판단해야 하는 HOLD/REVIEW 경로에 과도하게 의존**한다.

본 문서의 목적은 이 빈 연결을 다음 구조로 닫는 것이다.

```text
SOURCE DEFECT
  -> defect diagnosis
  -> sourceRecoveryPolicy
  -> automatic recovery search
  -> independent validation
  -> recovered derived artifact
  -> continue pipeline
```

기본 철학은 다음과 같다.

> **원본은 절대 훼손하지 않는다.**
>
> **사용 가능한 문항은 가능한 한 AI가 끝까지 복구한다.**
>
> **HUMAN_REQUIRED는 자동복구의 기본값이 아니라 최종 fallback이다.**

---

# 1. 최상위 원칙

## 1.1 SOURCE ORIGINAL IMMUTABILITY

원본 PDF, 스캔, 원문 이미지, 원본 선택지, 원본 발문은 source truth다.

확정된 실제 source defect가 있더라도 원본 source bytes를 고쳐서 정상 원문인 것처럼 만들지 않는다.

반드시 다음 두 객체를 분리한다.

```text
SOURCE_ORIGINAL
DERIVED_RECOVERY_ARTIFACT
```

`DERIVED_RECOVERY_ARTIFACT`는 원본 기출의 교정본이라고 위장하지 않는다.

## 1.2 AUTO-RECOVERY IS THE TARGET DEFAULT, NOT THE PRE-PROMOTION DEFAULT

본 설계의 장기 운영 목표는 source defect를 기본적으로 자동복구하는 것이다.

그러나 본 문서가 `DESIGN_CANDIDATE`인 동안에는 production 기본값을 즉시 `AUTO_RECOVER`로 바꾸지 않는다.

승격 단계별 기본은 §36을 따른다.

```text
P0 DOCUMENT / P1 OFFLINE:
  operative production default 없음

P2 SHADOW:
  sourceRecoveryPolicy = SHADOW_AUTO_RECOVER

P3 BOUNDED PRODUCTION:
  승인된 defect category/scope만 AUTO_RECOVER
  나머지는 SHADOW_AUTO_RECOVER 또는 PRESERVE_ONLY

P4 DEFAULT AUTO_RECOVER:
  sourceRecoveryPolicy = AUTO_RECOVER
```

따라서 **AUTO_RECOVER는 목표 기본값이며 P4 승격 전 전역 production 기본값이 아니다.**

어떤 단계에서도 defect가 있다는 이유만으로 사용자에게 즉시 질문하는 것을 기본 행동으로 삼지 않는다.

## 1.3 HUMAN REVIEW LAST

다음 사유만으로 HUMAN_REQUIRED로 보내지 않는다.

- 복구안이 2개 이상 존재함
- 원저자의 정확한 의도를 100% 알 수 없음
- 보기 하나가 잘못됨
- 정답이 없음
- 복수정답임
- 조건 하나가 빠짐
- 조건 하나가 충돌함
- 상수나 부호가 잘못됨
- 발문 목표를 일부 다시 써야 함
- 원문 그래프/도형과 발문이 충돌함
- 문항을 상당 부분 다시 구성해야 함

위 상황은 모두 자동복구 대상이다.

HUMAN_REQUIRED는 §15의 최종 조건을 만족할 때만 허용한다.

## 1.4 DEFECT ITEM != BATCH STOP

```text
ONE QUESTION DEFECT != EXAM STOP
ONE EXAM DEFECT != NIGHT JOB STOP
ONE RECOVERY FAILURE != PIPELINE STOP
```

결함문항은 독립 recovery lane으로 보내고 나머지 문항·시험지는 계속 처리한다.

## 1.5 NO ANSWER REVERSE-ENGINEERING

다음은 절대 금지한다.

- 인쇄 정답에 맞추기 위해 발문을 역산
- 저장 answer에 맞추기 위해 조건을 임의 조작
- source solution을 정답의 근거로 사용
- 오답표를 정답으로 만들기 위해 보기만 억지로 끼워 맞춤
- 원문 오류 가능성을 감추기 위해 source를 조용히 수정

정답·성립 여부는 독립 풀이에서 출발한다.

---

# 2. 적용 범위

본 규칙은 다음 작업에 적용할 수 있다.

- 신규 기출 JS 생성
- 기출 PDF/JPG/scan import
- 기존 기출 source defect 재처리
- source answer key conflict
- source choices conflict
- source stem defect
- source visual defect
- similar-question generation의 source seed defect
- whole-exam generation 중 일부 source question defect
- 외부검수에서 확인된 source defect의 자동 재생성

다음은 본 규칙의 직접 대상이 아니다.

- 단순 JS 문법 오류
- 단순 metadata 오류
- 원문과 JS가 다른 extraction/OCR 오류
- 정상 문항의 solution 서술 품질 문제
- 정상 문항의 SVG 스타일 문제

위 항목은 먼저 해당 기존 파이프라인에서 처리한다.

---

# 3. SOURCE DEFECT 판정 전에 반드시 분리할 세 종류

source conflict가 보이면 바로 repair를 시작하지 않는다.

먼저 아래 세 종류를 구분한다.

## 3.1 EXTRACTION_DEFECT

원본 PDF/스캔은 정상인데 JS 추출 결과가 원본과 다른 경우.

예:

- `-1`을 `1`로 읽음
- 보기 하나 누락
- 조건 한 줄 누락
- 그래프 라벨 crop 누락
- OCR 부호 오인식

처리:

```text
EXTRACTION_DEFECT
-> source full-page recheck
-> JS를 실제 원본에 맞게 복원
-> SOURCE_FIDELITY_RESTORATION
```

이것은 source repair variant가 아니다.

## 3.2 ANSWER_KEY_DEFECT

문제의 발문·보기·시각자료는 정상이고 정답이 유일하게 결정되지만,
인쇄 답지 또는 저장 source answer만 잘못된 경우.

처리:

```text
SOURCE QUESTION PAYLOAD = PRESERVE
INDEPENDENT ANSWER = authoritative runtime answer
PRINTED ANSWER DEFECT = ledger
```

이 경우 별도 파생문항이 필수는 아니다.

학생용 solution은 독립 계산값을 기준으로 작성한다.

원본 인쇄 정답의 결함 사실은 sidecar/report/ledger에 남긴다.

## 3.3 QUESTION_PAYLOAD_DEFECT

실제 원본 발문·보기·조건·시각자료 자체가 수학적으로 정상 문항을 이루지 못하는 경우.

예:

- 정답 없음
- 복수정답
- 조건 부족
- 조건 모순
- 정의역 문제
- 발문 목표 미결정
- 잘못된 계수/부호/상수
- 잘못된 보기
- 그래프와 발문 불일치
- 도형 수치와 조건 불일치
- 문항 논리 자체 불완전

이 경우 본 Auto-Recovery Lane을 적용한다.

---

# 4. Source Defect 확인 Gate

`QUESTION_PAYLOAD_DEFECT` 판정 전에는 가능한 source evidence를 다시 확인한다.

최소 확인:

1. full-page source
2. 해당 문항 확대
3. 선택지 전체
4. 공통 조건
5. 시각자료 전체
6. 별도 답지/해설지가 있으면 참고하되 수학적 근거로 신뢰하지 않음
7. source question identity

가능한 경우 source hash와 page reference를 저장한다.

확인 결과 원문과 JS가 달랐다면 §3.1로 되돌린다.

확인 결과 원문 자체가 결함임이 확정되면 recovery를 시작한다.

---

# 5. Source Recovery Policy / Authority / Adoption

Source recovery는 **세 개의 서로 다른 축**을 사용한다.

```text
1. sourceRecoveryPolicy
2. recoveryAuthority
3. productionAdoptionStatus
```

"복구를 생성했다"와 "production에서 사용할 권한이 있다"를 절대 같은 상태로 취급하지 않는다.

## 5.1 sourceRecoveryPolicy

```text
sourceRecoveryPolicy =
  PRESERVE_ONLY
  SHADOW_AUTO_RECOVER
  AUTO_RECOVER
```

### PRESERVE_ONLY

- 원본 defect만 기록한다.
- recovered artifact를 production replacement로 사용하지 않는다.
- 전체 batch execution은 계속한다.
- correctness-affecting defect가 unresolved이면 release/seal은 §16.1에 따라 BLOCKED다.

### SHADOW_AUTO_RECOVER

- 원본 defect를 보존한다.
- recovery candidate를 실제 생성·검증한다.
- recovered artifact와 evidence를 저장한다.
- recovered artifact가 수학적으로 PASS여도 production replacement 권한은 없다.
- P2 shadow 및 P3 비승인 scope에서 사용한다.

### AUTO_RECOVER

- 원본 defect를 보존한다.
- recovered variant를 자동 생성·검증한다.
- **별도 recoveryAuthority와 productionAdoptionStatus가 허용하는 scope에서만**
  production replacement 후보로 채택할 수 있다.
- `AUTO_RECOVER` 자체는 release authority가 아니다.

## 5.2 recoveryAuthority

```text
recoveryAuthority =
  SHADOW_ONLY
  BOUNDED_PRODUCTION
  DEFAULT_PRODUCTION
```

### SHADOW_ONLY

- recovery 생성/검증은 허용
- production slot replacement 금지
- Final Seal의 replacement authority로 사용할 수 없음

### BOUNDED_PRODUCTION

- 명시적으로 승인된 defect category / curriculum / grade / tier / run scope에서만 production adoption 허용
- `authorizationRef`와 `authorizedScope` evidence가 필수

### DEFAULT_PRODUCTION

- P4 승격 이후 canonical default authority
- 그래도 per-item acceptance / replacement parity / final closure는 생략 불가

## 5.3 productionAdoptionStatus

```text
productionAdoptionStatus =
  NOT_AUTHORIZED
  AUTHORIZED
  ADOPTED
```

의미:

```text
NOT_AUTHORIZED
= recovered artifact는 존재할 수 있으나 production slot에 쓸 수 없음

AUTHORIZED
= 해당 scope에서 replacement 사용 권한은 있으나 아직 final target으로 채택되지 않음

ADOPTED
= one-to-one replacement parity와 required closure를 통과하여
  실제 production final target으로 편입됨
```

`RECOVERED`와 `ADOPTED`는 다른 사건이다.

## 5.4 Promotion Phase 기본값

```text
P0 DOCUMENT / P1 OFFLINE:
  production default 변경 없음

P2 SHADOW:
  sourceRecoveryPolicy = SHADOW_AUTO_RECOVER
  recoveryAuthority = SHADOW_ONLY
  productionAdoptionStatus = NOT_AUTHORIZED

P3 BOUNDED PRODUCTION:
  승인 scope:
    sourceRecoveryPolicy = AUTO_RECOVER
    recoveryAuthority = BOUNDED_PRODUCTION
  비승인 scope:
    SHADOW_AUTO_RECOVER 또는 PRESERVE_ONLY

P4 DEFAULT AUTO_RECOVER:
  sourceRecoveryPolicy = AUTO_RECOVER
  recoveryAuthority = DEFAULT_PRODUCTION
```

P4에서도 개별 recovered artifact가 자동으로 `ADOPTED`가 되는 것은 아니다.
§20.4의 `DERIVED_REPLACEMENT_VERIFIED`를 통과해야 한다.

원본 사료성·역사적 fidelity만을 보존하는 명시적 작업에서는 P4 이후에도 `PRESERVE_ONLY`를 선택할 수 있다.

---

# 6. Defect Taxonomy

최소 canonical defect type은 다음과 같다.

```text
ANSWER_KEY_CONFLICT
NO_CORRECT_ANSWER
MULTIPLE_CORRECT_ANSWERS
DUPLICATE_CHOICES
UNDERDETERMINED_STEM
CONTRADICTORY_CONDITIONS
MISSING_CONDITION
INVALID_DOMAIN
INVALID_RANGE
NUMERIC_DEFECT
SIGN_DEFECT
OPERATOR_DEFECT
VARIABLE_OR_SYMBOL_DEFECT
QUESTION_TARGET_DEFECT
RESPONSE_FORM_DEFECT
VISUAL_STEM_CONFLICT
VISUAL_NUMERIC_CONFLICT
VISUAL_LABEL_CONFLICT
COMMON_MATERIAL_CONFLICT
SOURCE_TEXT_AMBIGUITY
OTHER_SOURCE_DEFECT
```

복수 defect가 동시에 있을 수 있다.

```json
{
  "sourceDefectTypes": [
    "UNDERDETERMINED_STEM",
    "MISSING_CONDITION"
  ]
}
```

---

# 7. Recovery 목표

Auto-Recovery의 목표는 원저자의 숨은 의도를 추측해 완벽히 복원하는 것이 아니다.

목표는 다음과 같다.

> **원문의 확정 가능한 핵심 개념·유형·난도 역할·풀이 구조를 최대한 보존하면서, 학생에게 제시 가능한 수학적으로 완전한 정상 문항을 생성한다.**

따라서 원문의 정확한 원래 의도가 불명확해도,
정상적인 파생문항을 만들 수 있으면 자동복구 성공으로 본다.

---

# 8. Source Fingerprint Recovery Lock

복구 전에 가능한 범위에서 source fingerprint를 만든다.

최소 항목:

```text
sourceIdentity
standardCourse
standardUnitKey
concept
problemType
questionFormat
sourceObjective
solutionEntry
solutionGraph
decisionPoints
hiddenConditions
visualDependency
answerForm
difficultyBucket
lockedCore
mutableSurface
forbiddenTransforms
```

원문 일부가 결함이어도 확정 가능한 항목은 동결한다.

## 8.1 HARD LOCK

가능하면 다음을 유지한다.

```text
curriculum boundary
core concept
problemType
solutionEntry
solutionGraph core
questionFormat
difficulty role
visual role
```

## 8.2 SOFT LOCK

복구 필요에 따라 변경 가능:

```text
numeric values
constants
signs
operators
choice values
one condition
question target
domain/range
representation
visual coordinates
surface wording
```

## 8.3 LAST-RESORT LOCK

R6 재구성에서는 최소한 다음만 보존해도 허용한다.

```text
curriculum boundary
core concept
difficulty role
pedagogical purpose
```

R6에서도 이 네 항목을 합리적으로 확정할 수 없다면 HUMAN_REQUIRED 후보가 된다.

---

# 9. Recovery Ladder R0~R6

## 9.0 Tier Applicability / Capability / Execution Contract

R0~R6는 모든 defect에 기계적으로 전부 실행하는 직렬 목록이 아니다.

각 tier는 **세 축을 독립적으로 기록**한다.

### A. applicability

```text
NOT_APPLICABLE
APPLICABLE_PRIMARY
APPLICABLE_FALLBACK
```

- `APPLICABLE_PRIMARY`: diagnosis상 해당 tier가 직접 복구 후보
- `APPLICABLE_FALLBACK`: 낮은 applicable tier가 실패할 때 escalation 후보
- `NOT_APPLICABLE`: 해당 defect와 무관한 tier

### B. capability

```text
ACTIVE
CAPABILITY_BLOCKED
DEFERRED_CAPABILITY
```

- `ACTIVE`: 현재 배포 엔진이 이 tier를 실제 실행 가능
- `CAPABILITY_BLOCKED`: 필요한 engine/tool/validator capability가 없음
- `DEFERRED_CAPABILITY`: capability는 설계되었으나 현재 rollout scope에서 비활성

### C. execution

```text
NOT_RUN
AVAILABLE_PENDING
ATTEMPTED_PASS
ATTEMPTED_EXHAUSTED
SKIPPED_AFTER_LOWER_TIER_PASS
```

`NOT_APPLICABLE`, `CAPABILITY_BLOCKED`, `DEFERRED_CAPABILITY`를 execution 결과처럼 사용하지 않는다.

기본 탐색 순서:

```text
lowest APPLICABLE_PRIMARY tier
-> APPLICABLE_FALLBACK tiers in escalation order
-> highest applicable + capability ACTIVE tier
```

예:

```text
ANSWER_KEY_DEFECT       -> R0 primary
DUPLICATE_CHOICES       -> R1 primary, higher tiers fallback as needed
NUMERIC_DEFECT          -> R2 primary, higher tiers fallback as needed
MISSING_CONDITION       -> R3 primary, R4/R6 fallback as applicable
QUESTION_TARGET_DEFECT  -> R4 primary, R6 fallback
VISUAL_STEM_CONFLICT    -> R5 primary, R6 fallback if semantically valid
```

낮은 tier가 PASS하면 높은 fallback tier는:

```text
applicability = APPLICABLE_FALLBACK
capability = ACTIVE or capability state
execution = SKIPPED_AFTER_LOWER_TIER_PASS
```

로 기록한다.

이것을 `NOT_APPLICABLE`로 위조하지 않는다.

`CAPABILITY_BLOCKED` 또는 `DEFERRED_CAPABILITY`인 tier는 exhaustion으로 계산하지 않는다.

필요한 tier capability가 없지만 더 높은 applicable tier가 그 capability에 의존하지 않고 안전하게 실행 가능하면 다음 active tier로 진행할 수 있다.

그렇지 않으면:

```text
sourceRecovery.status = RECOVERY_CAPABILITY_BLOCKED
```

로 종료하고 §17 mapping을 적용한다.

Auto-Recovery는 낮은 **applicable + active** tier부터 탐색한다.

낮은 tier에서 완전한 정상 후보가 확정되면 더 높은 tier는 기본적으로 실행하지 않는다.

단, 현재 tier 후보가 수학적으로는 정상이나 fidelity / difficulty / pedagogy가 acceptance floor에 미달하면
상위 applicable tier로 escalation할 수 있다.


## R0 — ANSWER / SOURCE KEY RECOVERY

대상:

- 인쇄 답지 오류
- 저장 answer 오류
- source solution 오류
- 문항 payload는 정상

허용:

- source content/choices/visual 변경 없음
- answer / solution을 독립 풀이 결과로 확정
- printed source defect ledger 기록

출력:

```text
ANSWER_KEY_RECOVERED
```

## R1 — CHOICE-LOCAL RECOVERY

대상:

- 정답이 보기에 없음
- 복수정답
- 중복 선택지
- 오답 보기 하나가 실제 정답과 동치

허용:

- 선택지 1개 또는 최소 개수의 선택지 변경
- 정답번호 재분산은 복구 목적이 아님
- 각 오답은 실제 오류 경로를 가져야 함

우선순위:

```text
1 choice mutation
< 2 choice mutation
< stem mutation
```

출력:

```text
MINIMAL_RECOVERED
```

## R2 — TOKEN / NUMERIC RECOVERY

대상:

- 숫자 하나
- 상수 하나
- 계수 하나
- 부호 하나
- 연산자 하나
- 변수/기호 하나

허용 예:

```text
3 -> 4
+ -> -
< -> <=
a -> b
```

R2는 문자 edit distance가 아니라 **semantic impact가 국소적인 경우에만** 적용한다.

예를 들어 `x^2 -> x^3`처럼 토큰 하나만 바뀌어도 solutionGraph, 난도, 함수 성질 또는 problemType이 달라지면 R2로 유지하지 않는다.
그 mutation은 실제 semantic impact에 따라 R3/R4/R6 등 상위 tier로 승격한다.

단, 변경 후 문항이 자연스럽고 원 concept와 해당 tier의 fingerprint lock을 유지해야 한다.

출력:

```text
MINIMAL_RECOVERED
```

## R3 — CONDITION RECOVERY

대상:

- 조건 부족
- 조건 충돌
- 정의역/범위 누락
- 유일성 조건 누락
- 잘못된 제한 조건

허용:

- 조건 1개 수정
- 조건 1개 추가
- 조건 1개 삭제
- 정의역/범위 최소 수정
- 공통자료 조건 최소 수정

조건 추가는 **정답을 맞추기 위한 임의 장치**가 아니라 source fingerprint와 해당 유형의 수학적 성립에 필요한 자연스러운 조건이어야 한다.

출력:

```text
STRUCTURAL_RECOVERED
```

## R4 — QUESTION TARGET / RESPONSE RECOVERY

대상:

- 묻는 값이 결정되지 않음
- 질문 대상이 잘못 지정됨
- 객관식/단답형 응답형식과 실제 수학 구조가 충돌
- 원 조건은 의미 있으나 질문 목표가 부적절

허용:

- 질문 대상 1개 수정
- 합/곱/개수/최댓값/최솟값 등 target 변경
- 응답형식 최소 변경
- 조건은 최대한 유지

출력:

```text
STRUCTURAL_RECOVERED
```

## R5 — VISUAL / STRUCTURAL CO-RECOVERY

대상:

- 그래프와 발문 불일치
- 도형 수치 충돌
- 좌표 라벨 오류
- 시각자료 자체가 문제 성립을 깨뜨림

허용:

- 문항 조건과 visual을 동시에 정상화
- deterministic reconstruction
- Python exact/numerical verification
- current Visual Spec 준수
- 새로운 solution visual과 problem visual 분리

금지:

- 원본 source crop 자체를 조작하여 원본인 것처럼 저장
- 생성형 이미지로 수학적 geometry를 눈대중 복구
- label만 바꿔 실제 geometry mismatch를 숨김

출력:

```text
STRUCTURAL_RECOVERED
```

## R6 — FULL PEDAGOGICAL RECONSTRUCTION

대상:

R0~R5로 정상화하기 어렵지만 다음은 확정 가능한 경우:

```text
curriculum
core concept
problemType 또는 pedagogical role
difficulty role
```

허용:

- 발문 전체 재작성
- 조건 세트 재설계
- 보기 전체 재설계
- 새 수치 설계
- 새 정답 설계
- solutionGraph 재구성
- visual 재구성

R6 산출물은 원문의 "수정본"이 아니다.

반드시:

```text
RECOVERED_RECONSTRUCTION
```

으로 분류한다.

R6에서도 원문의 concept를 사용하지 않고 전혀 다른 문제를 임의 생성하면 FAIL이다.

---

# 10. Adaptive Recovery Search Budget

source defect는 전체 문항 중 희소 예외라는 전제에서,
정상 문항보다 더 높은 reasoning/verification budget을 허용한다.

권장 기본:

```text
R0: deterministic 1회
R1: 최대 3 candidate
R2: 최대 3 candidate
R3: 최대 5 candidate
R4: 최대 5 candidate
R5: 최대 5 candidate
R6: 최대 3 independent reconstruction
```

각 tier의 candidate가 전부 실패하면 다음 tier로 이동한다.

한 candidate의 검증 실패를 이유로 사용자에게 질문하지 않는다.

## 10.1 Bounded Retry / Candidate Immutability

동일 frozen candidate를 무한 수정하지 않는다.

본 lane은 기존 `ALIVE_PIPELINE_RUNTIME_SPEC_v1.0 §11 Retry`와
Master FREEZE의 **"FREEZE 후 기존 Candidate를 직접 수정하지 않는다"** 원칙을 변경하지 않는다.

일반 Runtime의 `REGENERATE`는 계속:

```text
설계/Candidate 단계부터 fresh candidate 생성
```

을 뜻한다.

Source Recovery의 국소 실패에 한해 다음 action 이름을 사용할 수 있다.

```text
RECOVERY_TARGETED_REPAIR
```

그러나 `RECOVERY_TARGETED_REPAIR`의 의미는 **frozen candidate mutation이 아니다.**

반드시:

```text
same recoveryPlanId
old candidateId immutable
old payloadSha immutable

-> new candidateVersion
-> new candidateId
-> new payloadSha
-> new FREEZE
-> independent verifier rerun
```

으로 처리한다.

예:

```text
recoveryPlanId = RP-Q17-R3

candidateVersion = 1
candidateId = RP-Q17-R3-C01
payloadSha = sha_A
FREEZE
verifier = FAIL(localized)

RECOVERY_TARGETED_REPAIR

candidateVersion = 2
candidateId = RP-Q17-R3-C02
payloadSha = sha_B
FREEZE
verifier = PASS
```

old candidate는 immutable failed evidence로 남는다.

Targeted repair 허용 조건:

- verifier failure가 국소적이고 명확함
- 동일 recovery tier 안에서 해결 가능
- lockedCore 변경 없음
- 새로운 semantic dimension 추가 없음
- recoveryPlanId 유지 가능

수정이 lockedCore, solutionGraph core, recovery tier 또는 semantic dimension을 바꿔야 한다면
`RECOVERY_TARGETED_REPAIR`를 사용하지 않고 fresh recovery plan/candidate를 생성한다.

한 recovery candidate lineage에서 targeted-repair child는 기본 최대 1회다.
여전히 실패하면 해당 lineage를 폐기하고 fresh candidate 또는 다음 applicable tier로 진행한다.


---

# 11. Candidate Acceptance Hard Gates

Recovered candidate는 다음을 모두 만족해야 한다.

```text
MATH_VALID
ANSWER_UNIQUE_OR_RESPONSE_CONTRACT_VALID
CURRICULUM_VALID
QUESTION_WELL_FORMED
RECOVERY_FINGERPRINT_GATE_PASS
DIFFICULTY_ROLE_ACCEPTABLE
VISUAL_VALID_IF_APPLICABLE
SERIALIZABLE
```

`RECOVERY_FINGERPRINT_GATE_PASS`는 tier에 따라 다르다.

```text
R0~R5:
  SOURCE_FINGERPRINT_COMPATIBLE_FULL

R6:
  SOURCE_FINGERPRINT_COMPATIBLE_REDUCED
```

R6 reduced fingerprint의 필수 보존축은 최소:

```text
curriculum boundary
core concept
difficulty role
pedagogical purpose
```

이다.

다음은 **source evidence로 안정적으로 확정 가능한 경우에만 추가 lock**이다.

```text
broad problem family
problemType
solutionEntry
visual role
questionFormat
answerForm
```

따라서 broad problem family를 안정적으로 확정할 수 없다는 이유만으로
R6를 자동 차단하지 않는다.

객관식 추가:

```text
choice count matches the active response/target contract
exactly one key for single-answer MCQ
no semantically duplicate choices
all distractors are actually wrong
distractor provenance valid
```

현재 JS Archive target contract가 5지선다를 요구하는 일반 객관식이면 `choices.length == 5`를 강제한다.
source/target profile이 명시적으로 다른 선택지 수 또는 복수선택 응답형식을 허용할 때만 그 canonical response contract를 따른다.

주관식/서술형 추가:

```text
answer form uniquely determined
solution reaches canonical answer
```

---

# 12. Independent Verification

복구 candidate를 만든 builder는 최종 수학 PASS를 선언하지 않는다.

최소:

```text
BUILDER
-> BLINDED INDEPENDENT SOLVER
-> DETERMINISTIC REDUCER
```

중요 defect 또는 고위험 reconstruction은 추가 verifier를 사용할 수 있다.

Verifier에게 숨길 것:

```text
builder intended answer
builder solution
source printed answer
source solution
repair target answer
previous verdict
```

Verifier가 볼 수 있는 핵심:

```text
recovered student-facing content
recovered choices
required assets
curriculum metadata needed for boundary check
```

---

# 13. Recovery Ranking

복수의 PASS candidate가 존재할 때 사람에게 보내지 않는다.

다음 lexicographic ordering으로 자동 선택한다.

```text
1. 수학적 완전성
2. 교육과정 정합
3. core concept 보존
4. problemType 보존
5. solutionGraph core 보존
6. 난도 역할 보존
7. questionFormat / answerForm 보존
8. visual role 보존
9. semantic mutation 최소
10. surface mutation 최소
11. 학생용 자연스러움
12. deterministic tie-break
```

상위 조건에서 차이가 나면 하위 조건은 비교하지 않는다.

## 13.1 여러 정상 복구안은 HUMAN_REQUIRED 사유가 아니다

원저자의 숨은 의도를 특정할 수 없어도,
위 ranking으로 하나를 선택할 수 있으면 자동 선택한다.

## 13.2 Deterministic Tie-break

모든 ranking 항목이 동률이면 canonicalized repair plan의 stable hash 또는 stable candidate order를 사용한다.

동률 자체는 사람 검토 사유가 아니다.

---

# 14. Original / Recovered Artifact Separation

## 14.1 원본

원본 기출은 다음을 유지한다.

```text
sourceUid
source bytes
source content
source choices
source visual
source hash
source page evidence
```

원본 defect는 숨기지 않는다.

## 14.2 Recovered Artifact

파생문항에는 최소 lineage를 둔다.

```json
{
  "recovery": {
    "sourceUid": "",
    "sourceQuestionUid": "",
    "sourceLockSha256": "",
    "sourceDefectTypes": [],
    "sourceRecoveryPolicy": "AUTO_RECOVER",
    "recoveryTier": "R3",
    "recoveryDisposition": "STRUCTURAL_RECOVERED",
    "mutationOperations": [],
    "mutationCost": {},
    "beforePayloadSha256": "",
    "afterPayloadSha256": "",
    "independentVerification": "PASS",
    "pipelineRunId": ""
  }
}
```

이 정보는 학생용 Question Payload가 아니라 sidecar/evidence에 저장한다.

---

# 15. HUMAN_REQUIRED / EVIDENCE_BLOCKED / EXHAUSTION

HUMAN_REQUIRED는 자동복구의 기본 fallback이 아니다.

source evidence 부족, engine capability 부족, 실제 recovery exhaustion을 반드시 분리한다.

## 15.1 Route A0 — SOURCE_RECOVERY_EVIDENCE_BLOCKED

자동 source recheck에 필요한 **외부 source evidence가 실제로 부족**한 경우 HUMAN_REQUIRED로 보내지 않는다.

예:

```text
필요한 페이지가 없음
full scan 누락
공통자료 페이지 누락
문항의 필수 visual source 누락
source identity를 결정할 source file 자체가 미제공
```

출력:

```text
sourceRecovery.status = SOURCE_RECOVERY_EVIDENCE_BLOCKED
finalStatus = BLOCKED
code = SOURCE_RECOVERY_EVIDENCE_BLOCKED
requiredResource = SOURCE_PAGE | FULL_SCAN | COMMON_MATERIAL | SOURCE_VISUAL | SOURCE_FILE
resumeFromStage = SOURCE_RECHECK
```

이 상태는 자동복구 실패가 아니다.
필요 resource가 공급되면 기존 checkpoint에서 재개한다.

## 15.2 Route A1 — SOURCE IDENTITY / INTERPRETATION UNRESOLVED

다음을 모두 만족할 때만 HUMAN_REQUIRED를 허용한다.

1. 현재 이용 가능한 source full-page / 확대 / 공통자료 / answer source를 재확인함
2. 자동 source-resolution 절차를 소진함
3. 필요한 외부 evidence가 누락된 상태가 아님
4. extraction defect인지 source defect인지, 또는 R6 최소 recovery fingerprint를 안정적으로 확정할 수 없음
5. capability 부족이 원인이 아님
6. 추가 자동 시도가 동일 불확실성을 반복할 가능성이 높음

출력:

```text
sourceRecovery.status = HUMAN_REQUIRED
finalStatus = BLOCKED
code = SOURCE_RECOVERY_HUMAN_REQUIRED
reason = SOURCE_IDENTITY_UNRESOLVED
```

## 15.3 Route B — AUTO RECOVERY EXHAUSTED

source defect가 확정된 경우에는 다음을 모두 만족할 때만 HUMAN_REQUIRED를 허용한다.

1. 모든 tier의 applicability/capability/execution matrix가 존재
2. 모든 applicable tier의 capability가 `ACTIVE`
3. 낮은 tier PASS 때문에 skip된 tier가 없는 상태에서 valid candidate가 0개
4. 모든 applicable tier execution이 `ATTEMPTED_EXHAUSTED`
5. 각 tier의 허용 candidate/retry budget을 실제 소진
6. independent verifier PASS candidate가 0개
7. `CAPABILITY_BLOCKED`, `DEFERRED_CAPABILITY`, `AVAILABLE_PENDING`, `NOT_RUN`인 applicable tier가 남지 않음
8. 추가 자동 시도가 동일 실패를 반복할 가능성이 높음

이때:

```text
sourceRecovery.status = HUMAN_REQUIRED
sourceRecovery.exhaustionStatus = AUTO_RECOVERY_EXHAUSTED
finalStatus = BLOCKED
code = SOURCE_RECOVERY_HUMAN_REQUIRED
reason = AUTO_RECOVERY_EXHAUSTED
```

`AUTO_RECOVERY_EXHAUSTED`는 `sourceRecovery.status` 값이 아니라 **exhaustion evidence**다.

## 15.4 CAPABILITY 부족은 HUMAN_REQUIRED가 아니다

필요 tier capability가 없으면:

```text
sourceRecovery.status = RECOVERY_CAPABILITY_BLOCKED
finalStatus = BLOCKED
code = SOURCE_RECOVERY_CAPABILITY_BLOCKED
```

rollout상 의도적으로 미활성화된 경우:

```text
sourceRecovery.status = RECOVERY_DEFERRED_CAPABILITY
finalStatus = BLOCKED
code = SOURCE_RECOVERY_CAPABILITY_DEFERRED
```

capability가 활성화되면 checkpoint에서 재개한다.

## 15.5 HUMAN_REQUIRED가 아닌 사례

```text
복구안 2개가 모두 괜찮음
-> ranker가 선택

정답 없음
-> applicable recovery tiers

복수정답
-> applicable recovery tiers

조건 하나 빠짐
-> R3부터 applicable search

원문 수치 오류
-> R2부터 applicable search

발문 목표 오류
-> R4부터 applicable search

그래프와 조건 불일치
-> R5 if capability ACTIVE

문항 대부분을 다시 써야 함
-> R6 if capability ACTIVE

정확한 원저자 의도 불명
-> recovered derived artifact로 정상화 가능하면 자동 진행

필요 source evidence 누락
-> SOURCE_RECOVERY_EVIDENCE_BLOCKED

필요 tier capability 미구현
-> RECOVERY_CAPABILITY_BLOCKED
```

---

# 16. Batch / Night Automation 규칙

Auto-Recovery는 batch를 멈추지 않는다.

상태 예:

```text
QUESTION_01 DONE
QUESTION_02 RECOVERING
QUESTION_03 DONE
QUESTION_04 HUMAN_REQUIRED
QUESTION_05 DONE
```

문항 4가 HUMAN_REQUIRED여도 문항 5 이후를 계속 처리한다.

시험지 단위에서도:

```text
EXAM_A DONE
EXAM_B DONE_WITH_RECOVERY
EXAM_C PARTIAL_HUMAN_REQUIRED
EXAM_D IN_PROGRESS
```

형태로 계속 진행한다.

사용자 확인 대기는 야간 **execution continuation**의 종료 조건이 아니다.

## 16.1 EXECUTION CONTINUE != RELEASE PASS

```text
EXECUTION CONTINUE != RELEASE PASS
BATCH CLOSURE != PRODUCTION SEAL
RECOVERY PASS != PRODUCTION AUTHORITY
```

결함문항이 HUMAN_REQUIRED, EVIDENCE_BLOCKED, RECOVERY_CAPABILITY_BLOCKED여도
뒤 문항·뒤 시험지 처리는 계속할 수 있다.

그러나 최종 release/seal은 별도 fail-closed gate를 적용한다.

최소 차단 조건:

```text
if humanRequiredCount > 0:
    RELEASE BLOCKED

if recoveryEvidenceBlockedCount > 0:
    RELEASE BLOCKED

if recoveryCapabilityBlockedCount > 0:
    RELEASE BLOCKED

if correctnessAffectingPreserveOnlyCount > 0:
    RELEASE BLOCKED

if shadowRecoveredUnapprovedCount > 0:
    RELEASE BLOCKED

if unauthorizedRecoveryAdoptionCount > 0:
    RELEASE BLOCKED

if derivedReplacementParityFailCount > 0:
    RELEASE BLOCKED
```

`shadowRecoveredUnapprovedCount`는 수학적으로 PASS한 recovery가 있더라도
`recoveryAuthority=SHADOW_ONLY` 또는 `productionAdoptionStatus=NOT_AUTHORIZED`인 상태에서
그 recovery를 final student-facing target으로 사용하려는 건수를 뜻한다.

중간 evidence package / review package / checkpoint package는 만들 수 있지만:

```text
PRODUCTION_RELEASE
FINAL_SEAL
PUBLICATION_READY
```

를 선언해서는 안 된다.

`RECOVERED_WITH_HUMAN_QUEUE`, `SHADOW_RECOVERED` 같은 값은 execution summary일 뿐
ALIVE finalStatus나 release PASS가 아니다.

정상 derived replacement가 production slot을 승계하려면 반드시 §20.4의:

```text
DERIVED_REPLACEMENT_VERIFIED
```

로 source slot lifecycle을 닫아야 한다.

이때도:

```text
INITIAL_INCLUDED_SCOPE_UID_SET
INITIAL_INCLUDED_SCOPE_UID_SET_SHA
```

를 줄이거나 sourceQuestionUid를 denominator에서 삭제하지 않는다.


---

# 17. Recovery Status / Authority Registry

권장 `sourceRecovery.status`:

```text
NOT_REQUIRED
SOURCE_RECHECK
SOURCE_DEFECT_CONFIRMED
RECOVERING
RECOVERED
RECOVERY_VALIDATION_FAILED
SOURCE_RECOVERY_EVIDENCE_BLOCKED
RECOVERY_CAPABILITY_BLOCKED
RECOVERY_DEFERRED_CAPABILITY
HUMAN_REQUIRED
PRESERVE_ONLY
```

`AUTO_RECOVERY_EXHAUSTED`는 status enum에 넣지 않는다.

필요한 경우:

```text
sourceRecovery.exhaustionStatus = AUTO_RECOVERY_EXHAUSTED
```

로만 기록한다.

권장 recovery disposition:

```text
ANSWER_KEY_RECOVERED
MINIMAL_RECOVERED
STRUCTURAL_RECOVERED
RECOVERED_RECONSTRUCTION
SOURCE_PRESERVED_ONLY
DERIVED_REPLACEMENT_VERIFIED
```

권장 authority:

```text
SHADOW_ONLY
BOUNDED_PRODUCTION
DEFAULT_PRODUCTION
```

권장 adoption:

```text
NOT_AUTHORIZED
AUTHORIZED
ADOPTED
```

## 17.1 ALIVE finalStatus Mapping

`sourceRecovery.status` / `recoveryAuthority` / `productionAdoptionStatus`는
ALIVE canonical `finalStatus`를 대체하지 않는다.

ALIVE finalStatus는 기존 네 값만 사용한다.

```text
PASS
HOLD
BLOCKED
FAIL
```

권장 mapping:

| sourceRecovery.status | ALIVE finalStatus | required code / 의미 |
|---|---|---|
| `NOT_REQUIRED` | 기존 validator 결과 | recovery가 final PASS를 자동 부여하지 않음 |
| `RECOVERED` | 기존 validator chain/closure 결과 | recovery PASS만으로 final PASS 아님 |
| `RECOVERY_VALIDATION_FAILED` | `FAIL` 또는 fresh candidate 재시도 중간상태 | `SOURCE_RECOVERY_VALIDATION_FAIL` |
| `SOURCE_RECOVERY_EVIDENCE_BLOCKED` | `BLOCKED` | `SOURCE_RECOVERY_EVIDENCE_BLOCKED` |
| `RECOVERY_CAPABILITY_BLOCKED` | `BLOCKED` | `SOURCE_RECOVERY_CAPABILITY_BLOCKED` |
| `RECOVERY_DEFERRED_CAPABILITY` | `BLOCKED` | `SOURCE_RECOVERY_CAPABILITY_DEFERRED` |
| `HUMAN_REQUIRED` | `BLOCKED` | `SOURCE_RECOVERY_HUMAN_REQUIRED` |
| `PRESERVE_ONLY` + correctness-affecting defect | release `BLOCKED` | source-defect canonical code 사용 |

추가 authority gate:

```text
recoveryAuthority == SHADOW_ONLY
AND recovered artifact가 production target으로 사용됨
=> BLOCKED / SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION
```

```text
productionAdoptionStatus == ADOPTED
AND replacement parity != PASS
=> FAIL or BLOCKED per closure stage
=> DERIVED_REPLACEMENT_PARITY_FAIL
```

신규 code 문자열은 실제 사용 전에
`ALIVE_VALIDATION_SIDECAR_SCHEMA_v1.0.md §9 Status / Code Registry`에 정식 등록해야 한다.

---

# 18. Defect / Recovery Codes

최소 code registry 후보:

```text
SOURCE_DEFECT_DETECTED
SOURCE_RECHECK_REQUIRED
SOURCE_FIDELITY_RESTORATION

ANSWER_KEY_CONFLICT
NO_CORRECT_ANSWER
MULTIPLE_CORRECT_ANSWERS
DUPLICATE_CHOICES
UNDERDETERMINED_STEM
CONTRADICTORY_CONDITIONS
MISSING_CONDITION
INVALID_DOMAIN
INVALID_RANGE
NUMERIC_DEFECT
SIGN_DEFECT
OPERATOR_DEFECT
QUESTION_TARGET_DEFECT
RESPONSE_FORM_DEFECT
VISUAL_STEM_CONFLICT
VISUAL_NUMERIC_CONFLICT
VISUAL_LABEL_CONFLICT
COMMON_MATERIAL_CONFLICT

RECOVERY_CANDIDATE_REJECTED
RECOVERY_VERIFIER_CONFLICT
RECOVERY_CURRICULUM_FAIL
RECOVERY_FIDELITY_FAIL
RECOVERY_VISUAL_FAIL
RECOVERY_EXHAUSTED
SOURCE_RECOVERY_VALIDATION_FAIL

SOURCE_RECOVERY_EVIDENCE_BLOCKED
SOURCE_RECOVERY_CAPABILITY_BLOCKED
SOURCE_RECOVERY_CAPABILITY_DEFERRED
SOURCE_RECOVERY_HUMAN_REQUIRED
SOURCE_RECOVERY_UNAUTHORIZED_ADOPTION

DERIVED_REPLACEMENT_CARDINALITY_FAIL
DERIVED_REPLACEMENT_LINEAGE_FAIL
DERIVED_REPLACEMENT_PARITY_FAIL
DERIVED_REPLACEMENT_QUALITY_CLOSURE_FAIL
```

기존 ALIVE Validation Sidecar registry와 통합할 때
동일 의미의 기존 canonical code가 있으면 기존 code를 우선한다.

등록되지 않은 문자열을 operative sidecar `codes`에 임의 삽입하지 않는다.

---

# 19. Archive Original vs Recovered Delivery

source recovery 결과를 어디에 쓰는지는 delivery 목적에 따라 구분한다.

## 19.1 ORIGINAL_ARCHIVE

원본 기출 아카이브 목적.

- source payload를 recovered payload로 덮어쓰지 않는다.
- source defect를 sidecar/report/ledger에 기록한다.
- answer-key-only defect는 독립 answer/solution을 사용할 수 있다.
- question-payload defect를 정상 원문인 것처럼 봉인하지 않는다.
- recovered artifact는 별도 derived lineage로 둔다.

## 19.2 USABLE_RECOVERED_COPY

학생 사용 가능한 정상 시험지가 목적.

결함 source slot을 recovered derived question이 승계할 수 있다.

단 다음을 모두 만족해야 한다.

```text
recoveryAuthority != SHADOW_ONLY
productionAdoptionStatus = ADOPTED
DERIVED_REPLACEMENT_VERIFIED = PASS
replacementCardinality = 1:1
source original preserved = true
productionOriginalActive = false
productionRecoveredActive = true
```

시험지 전체를 "원본 기출 그대로"라고 표시해서는 안 된다.

권장 외부/내부 명칭 예:

```text
원본 기출 기반 복구본
원본 기출 기반 연습본
recovered review copy
```

원본 source evidence와 recovered lineage는 별도 보존한다.

---

# 20. Source Restoration / Source Repair / Derived Recovery의 경계

세 개념은 절대 섞지 않는다.

## 20.1 SOURCE_FIDELITY_RESTORATION

의미:

```text
실제 SOURCE는 정상
JS/OCR/extraction이 실제 SOURCE와 다름
-> JS/extraction을 실제 SOURCE와 동일하게 복원
```

예:

- OCR에서 `-1`을 `1`로 읽음
- 원문 보기 하나가 추출 과정에서 누락
- 원문 조건 한 줄이 JS에 빠짐
- source crop이 실제 label을 누락

이것은 source 자체를 고치는 행위가 아니다.

## 20.2 APPROVED_SOURCE_REPAIR — 기존 정본 의미 유지

기존 통합운영프로토콜의 `APPROVED_SOURCE_REPAIR`는 다음 의미를 유지한다.

```text
실제 SOURCE 자체가 수학적으로 결함
AND
사용자가 원본보다 문항 성립을 우선하도록 명시 승인
AND
승인된 repair direction을 effective student-facing source로 사용
```

즉 실제 원본의:

```text
content
image / visual
choices
answer
solution
```

등 필요한 계층을 승인된 repair와 일관되게 수정할 수 있는 **기존 예외 경로**다.

복구 후보가 여러 개이고 source 자체를 어떤 방향으로 수정할지 불명확하면
기존 `REPAIR_AMBIGUOUS` / 사용자 승인 요구를 유지한다.

본 Auto-Recovery 문서는 이 의미를 재정의하거나 자동 승인으로 바꾸지 않는다.

## 20.3 DERIVED_SOURCE_RECOVERY — 신규 기본 자동복구 경로

의미:

```text
실제 SOURCE 자체가 결함
-> SOURCE bytes / source evidence 불변 보존
-> 별도 정상 derived question 생성
```

이 경로에서는 원본 자체를 수정하지 않는다.

복수의 valid recovery candidate가 있으면
§13 ranking / independent adjudication / deterministic tie-break로 자동 선택할 수 있다.

이것은 `APPROVED_SOURCE_REPAIR`가 아니다.

## 20.4 DERIVED_REPLACEMENT_VERIFIED — 신규 final-scope disposition 후보

`DERIVED_SOURCE_RECOVERY`가 성공했다는 사실만으로
원본 source slot을 production에서 대체할 수 없다.

production slot 승계는 다음 조건을 모두 만족할 때만 허용한다.

```text
sourceQuestionUid = Q17
recoveredQuestionUid = Q17-R

sourceOriginalPreserved = true

replacementCardinality = 1:1

productionOriginalActive = false
productionRecoveredActive = true

replacementLineageParity = PASS
recoveredQualityClosure = PASS

recoveryAuthority IN {
  BOUNDED_PRODUCTION,
  DEFAULT_PRODUCTION
}

productionAdoptionStatus = ADOPTED
```

그리고:

```text
INITIAL_INCLUDED_SCOPE_UID_SET
INITIAL_INCLUDED_SCOPE_UID_SET_SHA
```

는 replacement 전후 불변이다.

source Q17을 denominator에서 삭제하지 않는다.

대신 source Q17의 final scope disposition을:

```text
DERIVED_REPLACEMENT_VERIFIED(recoveredQuestionUid = Q17-R)
```

로 닫는다.

이 disposition은 **기존 Common Protocol에 아직 없는 신규 lifecycle**이므로,
본 문서가 production operative가 되기 전에 Common Protocol에 정식 추가되어야 한다.

### 20.4.1 Denominator 우회 금지

다음은 금지한다.

```text
source defect Q17
-> Q17을 initial denominator에서 삭제
-> Q17-R만 새 문항으로 추가
```

또는:

```text
Q17 production active = true
AND
Q17-R production active = true
```

로 중복 slot을 만드는 것도 금지한다.

정확히 1:1 승계여야 한다.

### 20.4.2 Withdrawal과의 관계

`DERIVED_REPLACEMENT_VERIFIED`가 canonical disposition으로 채택되면,
일반적인 source-defect auto-recovery마다 무거운 production withdrawal/reset을 강제하지 않는다.

다만 실제 문항을 scope에서 제거하거나 replacement 없이 폐기하는 사건은
기존 verified production withdrawal 계약을 계속 따른다.

### 20.4.3 APPROVED_SOURCE_REPAIR와의 관계

```text
APPROVED_SOURCE_REPAIR
= effective source 자체를 승인 수정

DERIVED_REPLACEMENT_VERIFIED
= original source는 immutable
  + derived question이 production slot을 승계
```

둘은 대체 관계가 아니라 별개의 합법 경로다.

---

# 21. SOURCE_RESOLUTION_LEDGER / Replacement Ledger 연결

기존 `SOURCE_RESOLUTION_LEDGER` 구조와 source-repair/exception history는 유지한다.

Auto-Recovery는 원본 defect와 recovered artifact 사이의 lineage를
append-only evidence로 추가한다.

권장 ledger item:

```json
{
  "sourceQuestionUid": "",
  "sourceDefectTypes": [],
  "sourceDisposition": "SOURCE_DEFECT_PRESERVED",

  "recoveryDisposition": "STRUCTURAL_RECOVERED",
  "recoveredQuestionUid": "",
  "recoveryTier": "R3",

  "recoveryAuthority": "BOUNDED_PRODUCTION",
  "productionAdoptionStatus": "ADOPTED",
  "authorizationRef": "",

  "replacementDisposition": "DERIVED_REPLACEMENT_VERIFIED",
  "replacementCardinality": "1:1",
  "productionOriginalActive": false,
  "productionRecoveredActive": true,
  "replacementLineageParity": "PASS",
  "recoveredQualityClosure": "PASS",

  "sourceSha256": "",
  "recoveredSha256": "",
  "evidenceRef": ""
}
```

`productionAdoptionStatus != ADOPTED`이면
`replacementDisposition = DERIVED_REPLACEMENT_VERIFIED`를 기록할 수 없다.

원본 source repair가 실제로 승인된 사건은 기존 `APPROVED_SOURCE_REPAIR` ledger 의미를 그대로 사용한다.

---

# 22. Visual Defect Recovery

시각문항도 사용자 확인을 기본값으로 하지 않는다.

## 22.1 source visual 판독 가능

source visual의 geometry/labels가 판독 가능하나 stem과 충돌하면:

```text
EXPECTED FACT freeze
-> visual/stem conflict diagnosis
-> R5 recovery candidate
-> deterministic SVG/asset regeneration
-> math/semantic/render validation
```

## 22.2 source visual 자체가 일부 잘못됨

원본 visual은 source evidence로 그대로 보존한다.

recovered variant에는 새 deterministic visual을 생성한다.

## 22.3 source visual 판독 불가

텍스트 조건과 curriculum fingerprint만으로 정상 R6 reconstruction이 가능하면 새 시각문항을 생성할 수 있다.

원본 visual의 정확한 복원본이라고 주장하지 않는다.

---

# 23. Solution 규칙

Recovered question의 solution에는 다음을 넣지 않는다.

```text
원문 오류
OCR
복구함
수정함
보기 오류
AI 판단
검수 결과
PASS
FAIL
HOLD
```

학생용 solution은 정상 문항의 정상 풀이만 제공한다.

defect/recovery 정보는 sidecar/report에만 둔다.

---

# 24. Recovery Quality Floor

Recovered question은 "오류가 없기만 한 문제"로 끝나면 안 된다.

최소 품질:

- 자연스러운 한국어 발문
- 고등/중등 수학 교과서 수준 표현
- 조건 과잉 없음
- 답을 노골적으로 암시하는 조건 없음
- 불필요한 수치 복잡성 없음
- 보기 간 의미 중복 없음
- solution이 실제 학생 풀이로 재현 가능
- 원문보다 비정상적으로 쉬워지거나 어려워지지 않음
- 시각자료가 있으면 실제 의미와 일치

R6 reconstruction도 동일 quality floor를 적용한다.

---

# 25. Recovery Mutation Evidence

각 mutation은 장문 chain-of-thought가 아니라 재검 가능한 짧은 구조 evidence로 기록한다.

예:

```json
{
  "operation": "REPLACE_TOKEN",
  "field": "choices[3]",
  "before": "10",
  "after": "12",
  "reasonCode": "NO_CORRECT_ANSWER",
  "semanticImpact": "LOW"
}
```

조건 추가 예:

```json
{
  "operation": "ADD_CONDITION",
  "field": "content",
  "before": null,
  "after": "a>0",
  "reasonCode": "UNDERDETERMINED_STEM",
  "semanticImpact": "MEDIUM"
}
```

R6 예:

```json
{
  "operation": "RECONSTRUCT_QUESTION",
  "preserved": [
    "standardUnitKey",
    "concept",
    "problemType",
    "difficultyRole"
  ],
  "reasonCode": "RECOVERY_LOWER_TIERS_EXHAUSTED",
  "semanticImpact": "HIGH"
}
```

---

# 26. Recovery Cost Model

mutation cost는 단순 문자 edit distance가 아니다.

권장 차원:

```text
payloadFieldCountChanged
semanticDimensionCountChanged
conditionCountChanged
choiceCountChanged
visualStructureChanged
solutionGraphDepthChanged
difficultyDelta
curriculumDelta
```

`curriculumDelta != 0`은 원칙적으로 FAIL.

lexicographic rank가 주 기준이며, mutation cost는 lower-priority ranking에 사용한다.

---

# 27. Anti-Pathology Gates

Auto-Recovery가 빠져나갈 구멍을 만들지 않도록 다음을 금지한다.

## 27.1 ANSWER-FITTING

정답표 숫자를 먼저 고정하고 그 숫자가 나오도록 조건을 역산하는 행위 금지.

## 27.2 TRIVIALIZATION

복구가 어렵다는 이유로 문항 난도를 크게 낮춰 단순 계산문제로 바꾸는 행위 금지.

## 27.3 CURRICULUM ESCAPE

복구가 어렵다는 이유로 상위 과정 개념을 추가하는 행위 금지.

## 27.4 SOURCE IDENTITY SPOOF

recovered artifact를 original source로 표시 금지.

## 27.5 FAKE MINIMALITY

문자 하나만 바꿨다는 이유로 출제 의도·풀이 구조가 크게 바뀐 변형을 minimal repair로 분류 금지.

## 27.6 SILENT VISUAL PATCH

원본 source crop을 수정한 뒤 원본 이미지인 것처럼 저장 금지.

---

# 28. Recovery Candidate Pool

각 tier는 필요하면 복수 candidate를 만든다.

candidate pool은 최소 다음을 기록한다.

```text
candidateId
tier
mutationPlan
lockedCorePreserved
mathStatus
curriculumStatus
fidelityStatus
visualStatus
difficultyStatus
rank
finalDisposition
```

불합격 candidate는 삭제할 필요는 없지만 학생용/production payload에는 포함하지 않는다.

---

# 29. Recovery Reducer

Reducer는 다음 순서로 처리한다.

```text
1. source defect confirmed?
2. extraction defect excluded?
3. answer-key-only?
4. candidate math PASS?
5. curriculum PASS?
6. core fingerprint PASS?
7. response form PASS?
8. visual PASS if required?
9. difficulty role acceptable?
10. rank PASS candidates
11. freeze winner
```

어떤 단계에서도 printed answer는 tie-break 근거가 아니다.

---

# 30. R6 Reconstruction Safety

R6는 자동복구율을 높이는 핵심이지만 원문과 무관한 새 문제 생성 통로가 되어서는 안 된다.

R6 PASS의 **필수 reduced fingerprint**:

```text
same curriculum boundary
same core concept
same difficulty role within tolerance
same pedagogical purpose/target
independent math PASS
```

다음은 source evidence로 안정적으로 추론 가능한 경우에만 추가 lock이다.

```text
broad problem family
problemType
solutionEntry
questionFormat
answerForm
visual role
```

즉 `same broad problem family`는:

```text
IF STABLY INFERABLE
```

일 때만 HARD lock이다.

source가 심하게 깨져 broad family는 불명확하지만
curriculum/core concept/difficulty role/pedagogical purpose가 안정적으로 확정되면
R6 reconstruction을 계속할 수 있다.

가능한 경우 원문의 다음 요소를 일부 재사용한다.

- context
- variable names
- representation
- answer form
- visual role
- solution entry

하지만 재사용 자체가 오류를 재도입하면 버린다.

R6 산출물은 반드시:

```text
RECOVERED_RECONSTRUCTION
```

으로 분류하며 original source의 교정본이라고 표시하지 않는다.

---

# 31. Common-Material / Linked Questions

공통 지문이나 공통 자료를 공유하는 문항은 한 문항만 독립적으로 고치다가 sibling question을 깨뜨리면 안 된다.

공통자료 defect가 확인되면:

```text
affectedUidSet freeze
-> dependency expansion
-> shared recovery plan
-> all affected questions independent solve
-> group-level acceptance
```

공통자료 변경으로 영향을 받는 모든 문항을 재검증한다.

---

# 32. Objective / Subjective Recovery

## 32.1 객관식

복구 후:

- single-answer MCQ이면 정답 선택지는 정확히 하나
- 선택지 수는 active source/target response contract와 일치
- 일반 JS Archive 5지선다 계약이면 보기 5개
- canonical profile이 명시적으로 복수선택/다른 choice cardinality를 허용하면 해당 response contract 적용
- 의미 중복 없음
- 오답은 실제 오답
- answer index/indices 유효
- distractor provenance 가능

## 32.2 단답형

- canonical answer가 유일하게 결정
- 허용 답안 equivalence 정책 명확
- 표현 차이 때문에 가짜 복수정답을 만들지 않음

## 32.3 서술형

- 발문 요구가 명확
- 필요한 증명/계산 범위가 확정
- scoring intent가 명확하지 않아도 학생 풀이가 완결 가능
- source scoring rubric 복원이 불가능하더라도 문항 자체가 정상화되면 recovered variant 생성 가능

---

# 33. Recovery와 난도

복구의 첫 목적은 정상화이지만 원문의 난도 역할을 무시하지 않는다.

권장:

```text
basic -> basic/standard
standard -> standard
advanced -> advanced
challenge -> advanced/challenge
```

정확한 난도 동치가 불가능해도 한 단계 이상 급격히 떨어지거나 올라가지 않게 한다.

R6에서는 난도 역할 보존을 별도 verifier가 확인한다.

---

# 34. Recovery 성공률 측정

본 문서의 목표는 높은 자동복구율이지만, "99.9%"를 문서 작성만으로 달성했다고 선언하지 않는다.

운영 지표:

```text
SOURCE_DEFECT_COUNT
AUTO_RECOVERY_ATTEMPTED_COUNT
AUTO_RECOVERED_COUNT
HUMAN_REQUIRED_COUNT
RECOVERY_FALSE_PASS_COUNT
RECOVERY_REOPEN_COUNT
```

계산:

```text
AUTO_RECOVERY_RATE =
AUTO_RECOVERED_COUNT / AUTO_RECOVERY_ATTEMPTED_COUNT
```

목표:

```text
pilot target >= 99%
long-term target >= 99.9%
```

단, false PASS가 증가하면 자동복구율 수치보다 correctness를 우선한다.

---

# 35. Regression Corpus

과거 실제 source defect 사례를 regression corpus로 사용한다.

최소 category:

- duplicate choices
- no correct answer
- multiple correct answers
- missing condition
- answer key conflict
- underdetermined stem
- contradictory statement
- source visual conflict
- printed answer vs independent result conflict
- source recovery precedent

각 historical case에 대해:

```text
source defect diagnosis
expected recovery tier
expected preserved core
expected final math result
human-reviewed disposition if available
```

를 gold evidence로 둔다.

---

# 36. Pilot Promotion / Authority Gate

신규 Auto-Recovery 규칙은 바로 전 영역 production authority로 승격하지 않는다.

권장 단계:

```text
P0 DOCUMENT
P1 OFFLINE REGRESSION
P2 SHADOW AUTO_RECOVERY
P3 BOUNDED PRODUCTION
P4 DEFAULT AUTO_RECOVER
```

## P1 — OFFLINE REGRESSION

과거 source defect corpus에서 자동복구를 실행한다.

```text
recoveryAuthority = SHADOW_ONLY
productionAdoptionStatus = NOT_AUTHORIZED
```

production write authority는 없다.

## P2 — SHADOW AUTO_RECOVERY

실제 신규 기출 처리 중:

```text
sourceRecoveryPolicy = SHADOW_AUTO_RECOVER
recoveryAuthority = SHADOW_ONLY
productionAdoptionStatus = NOT_AUTHORIZED
```

로 자동복구를 수행한다.

수학적으로 PASS한 recovered artifact도 release authority로 사용할 수 없다.

## P3 — BOUNDED PRODUCTION

명시적으로 승인된:

```text
defect category
recovery tier
curriculum/course
grade/term
run or batch scope
```

에서만:

```text
sourceRecoveryPolicy = AUTO_RECOVER
recoveryAuthority = BOUNDED_PRODUCTION
```

을 허용한다.

반드시:

```text
authorizationRef
authorizedScope
scopeAuthorizationStatus = PASS
```

를 evidence로 남긴다.

비승인 scope는:

```text
SHADOW_AUTO_RECOVER
or
PRESERVE_ONLY
```

를 유지한다.

## P4 — DEFAULT AUTO_RECOVER

충분한 false-pass / reopen / capability / replacement-parity / release-closure evidence가 쌓이면:

```text
sourceRecoveryPolicy = AUTO_RECOVER
recoveryAuthority = DEFAULT_PRODUCTION
```

을 전역 기본으로 승격할 수 있다.

P4에서도 개별 recovered artifact는
`DERIVED_REPLACEMENT_VERIFIED` 전에는 production slot을 승계하지 못한다.

---

# 37. Integration Contract — ALIVE

본 문서는 generationMode를 대체하지 않는다.

권장 새 축:

```text
sourceRecoveryPolicy
sourceRecoveryStatus
sourceRecoveryTier
```

기존:

```text
generationMode =
TYPE_BANK
EXAM_FOLLOWUP
STRICT_VARIANT
```

는 생성 목적을 계속 담당한다.

Source Recovery Lane은 **원본 결함을 처리하는 직교 축**이다.

---

# 38. Integration Contract — Prompt Compiler

다음 조건이면 본 문서의 recovery section을 Runtime Prompt에 포함한다.

```text
sourceDefectDetected = true
OR
sourceRecoveryPolicy IN {SHADOW_AUTO_RECOVER, AUTO_RECOVER}
```

Compiler는:

- recovery hard rules
- defect taxonomy
- current tier
- locked core
- candidate acceptance gates
- output contract

를 삽입한다.

현재 tier와 무관한 장문의 recovery section은 token budget에 따라 제외할 수 있다.

단 다음은 절대 제외 금지:

```text
SOURCE ORIGINAL IMMUTABILITY
NO ANSWER REVERSE-ENGINEERING
CURRENT RECOVERY TIER CONTRACT
INDEPENDENT VERIFICATION
ORIGINAL/DERIVED SEPARATION
HUMAN_REQUIRED LAST
```

---

# 39. Integration Contract — Validation Sidecar

기존 Sidecar에 optional `sourceRecovery` 객체를 추가하는 것을 권장한다.

핵심은:

```text
recovery result
!=
recovery authority
!=
production adoption
```

이다.

권장 구조:

```json
{
  "sourceRecovery": {
    "policy": "AUTO_RECOVER",
    "status": "RECOVERED",
    "exhaustionStatus": null,

    "defectTypes": ["NO_CORRECT_ANSWER"],

    "recoveryAuthority": "BOUNDED_PRODUCTION",
    "authorizationRef": "evidence/...",
    "authorizedScope": {
      "scopeId": "",
      "status": "PASS"
    },

    "productionAdoptionStatus": "ADOPTED",

    "tierMatrix": {
      "R0": {
        "applicability": "NOT_APPLICABLE",
        "capability": "ACTIVE",
        "execution": "NOT_RUN"
      },
      "R1": {
        "applicability": "APPLICABLE_PRIMARY",
        "capability": "ACTIVE",
        "execution": "ATTEMPTED_PASS"
      },
      "R2": {
        "applicability": "APPLICABLE_FALLBACK",
        "capability": "ACTIVE",
        "execution": "SKIPPED_AFTER_LOWER_TIER_PASS"
      },
      "R3": {
        "applicability": "APPLICABLE_FALLBACK",
        "capability": "ACTIVE",
        "execution": "SKIPPED_AFTER_LOWER_TIER_PASS"
      },
      "R4": {
        "applicability": "APPLICABLE_FALLBACK",
        "capability": "ACTIVE",
        "execution": "SKIPPED_AFTER_LOWER_TIER_PASS"
      },
      "R5": {
        "applicability": "NOT_APPLICABLE",
        "capability": "ACTIVE",
        "execution": "NOT_RUN"
      },
      "R6": {
        "applicability": "APPLICABLE_FALLBACK",
        "capability": "ACTIVE",
        "execution": "SKIPPED_AFTER_LOWER_TIER_PASS"
      }
    },

    "tier": "R1",
    "disposition": "MINIMAL_RECOVERED",

    "sourceQuestionUid": "",
    "recoveredQuestionUid": "",
    "sourceLockSha256": "",

    "beforePayloadSha256": "",
    "afterPayloadSha256": "",

    "mutations": [],
    "candidateCount": 3,
    "selectedCandidateId": "",
    "selectedCandidateVersion": 1,

    "verificationStatus": "PASS",

    "replacement": {
      "status": "DERIVED_REPLACEMENT_VERIFIED",
      "replacementCardinality": "1:1",
      "productionOriginalActive": false,
      "productionRecoveredActive": true,
      "replacementLineageParity": "PASS",
      "recoveredQualityClosure": "PASS"
    },

    "humanRequired": false
  }
}
```

source evidence 부족 상태 예:

```json
{
  "sourceRecovery": {
    "status": "SOURCE_RECOVERY_EVIDENCE_BLOCKED",
    "requiredResource": "SOURCE_PAGE",
    "resumeFromStage": "SOURCE_RECHECK"
  }
}
```

학생용 JS에 내부 recovery / authority / replacement metadata를 넣지 않는다.

신규 enum/code는 operative 사용 전에 Sidecar canonical registry에 정식 등록한다.

---

# 40. Integration Contract — Archive Skill

Archive original import의 처리 순서:

```text
extract
-> full-page fidelity
-> independent solve
-> source conflict diagnosis
-> if extraction defect: restore fidelity
-> if answer-key defect: recover answer/solution
-> if question payload defect:
     APPLY sourceRecoveryPolicy
     PRESERVE_ONLY | SHADOW_AUTO_RECOVER | AUTO_RECOVER
-> original archive disposition
-> recovered variant handoff if any
```

기존 Archive Skill의 "source defect를 보존하고 reverse-engineer하지 않는다"는 원칙은 유지한다.

변경되는 것은 **defect 발견 후의 종착점**이다.

기존:

```text
defect -> unresolved/manual review
```

신규:

```text
defect -> auto recovery lane
       -> recovered or human-required
```

---

# 41. Integration Contract — Similar Question Skill

Similar pipeline은 recovery request를 받을 수 있어야 한다.

권장 입력:

```json
{
  "operation": "SOURCE_RECOVERY",
  "sourceQuestionUid": "",
  "sourceDefectTypes": [],
  "recoveryTierStart": "R1",
  "recoveryTierMax": "R6",
  "lockedCore": {},
  "sourceRecoveryPolicy": "AUTO_RECOVER"
}
```

일반 유사문항 생성과 recovery를 혼동하지 않는다.

recovery는:

```text
defect removal
+ preserved pedagogical identity
```

가 목적이다.

---

# 42. Integration Contract — 기존 수학 오류 검증 프로토콜

`수학_문항오류_검증_프로토콜_v2.1`의 `검증 전용 / 수정안 출력 금지` 원칙은 유지하는 것을 권장한다.

즉 그 프로토콜을 repair engine으로 바꾸지 않는다.

역할 분리:

```text
Math Error Validator
-> FAIL + defect reason
-> Source Defect Router
-> Auto-Recovery
```

검증기와 복구기를 분리해야 검증 결과가 복구 의도에 오염되지 않는다.

---

# 43. Integration Contract — COMMON_PROTOCOL / Final Scope

기존 Common Protocol의 strong denominator / release / seal 원칙은 유지한다.

특히 다음 원칙은 약화하지 않는다.

```text
correctness-affecting defect를 simple scope exclusion로 제거 금지
INITIAL_INCLUDED_SCOPE_UID_SET 불변
unresolved correctness defect Final Seal 금지
verified withdrawal lifecycle 유지
source resolution ledger 유지
```

기존 합법 경로:

```text
REPAIR_VERIFIED
SOURCE_BLOCKED
verified production withdrawal
```

에 더해, 본 설계는 신규 final-scope disposition 후보를 추가한다.

```text
DERIVED_REPLACEMENT_VERIFIED
```

## 43.1 Required Canonical Amendment — fourth disposition

production operative 전 Common Protocol은 다음 의미를 수용해야 한다.

```text
questionUid IN INITIAL_INCLUDED_SCOPE_UID_SET
AND sourceCorrectnessImpactStatus IN {CORRECTNESS_AFFECTING, MIXED}
AND original source is preserved
AND a recovered derived question is proposed as the same production slot
=>
simple exclusion still FORBIDDEN

closure requires one of:
  existing REPAIR_VERIFIED
  existing SOURCE_BLOCKED
  existing verified production withdrawal
  OR
  DERIVED_REPLACEMENT_VERIFIED
```

`DERIVED_REPLACEMENT_VERIFIED` 최소식:

```text
sourceQuestionUid exists in INITIAL_INCLUDED_SCOPE_UID_SET
recoveredQuestionUid is unique
replacementCardinality == 1:1

sourceOriginalPreserved == true

productionOriginalActive == false
productionRecoveredActive == true

replacementLineageParity == PASS
recoveredQualityClosure == PASS

recoveryAuthority in {BOUNDED_PRODUCTION, DEFAULT_PRODUCTION}
productionAdoptionStatus == ADOPTED

INITIAL_INCLUDED_SCOPE_UID_SET unchanged
INITIAL_INCLUDED_SCOPE_UID_SET_SHA unchanged
```

## 43.2 Source slot lifecycle

source Q17은 denominator에서 사라지지 않는다.

예:

```text
INITIAL INCLUDED:
Q01 ... Q17 ... Q25

Q17 sourceCorrectnessImpactStatus = CORRECTNESS_AFFECTING

FINAL SCOPE DISPOSITION:
Q17 -> DERIVED_REPLACEMENT_VERIFIED(Q17-R)
```

Final target/student-facing slot에는 Q17-R이 활성화되지만,
Q17의 initial scope identity와 defect evidence는 그대로 추적된다.

## 43.3 One-to-one substitution parity

다음을 HARD_FAIL로 한다.

```text
0:1 replacement
1:0 replacement
1:N replacement
N:1 replacement
original + recovered 동시 active
recoveredQuestionUid lineage 미결박
replacement candidate가 다른 source slot을 승계
```

자동복구 replacement는 기본적으로 정확히 1:1이다.

공통자료/linked-question recovery처럼 1:N dependency가 필요한 경우에는
§31의 dependency expansion과 별도의 group replacement contract 없이는
`DERIVED_REPLACEMENT_VERIFIED`를 사용할 수 없다.

## 43.4 Recovery authority Final Seal gate

다음 중 하나면 Final Seal BLOCKED:

```text
recoveryAuthority == SHADOW_ONLY
AND recovered artifact가 final target으로 사용됨

productionAdoptionStatus != ADOPTED
AND recovered artifact가 final target으로 사용됨

scopeAuthorizationStatus != PASS
AND recoveryAuthority == BOUNDED_PRODUCTION
AND recovered artifact가 final target으로 사용됨
```

권장 aggregate:

```text
UNAUTHORIZED_RECOVERY_ADOPTION_COUNT == 0
SHADOW_RECOVERED_UNAPPROVED_COUNT == 0
DERIVED_REPLACEMENT_PARITY_FAIL_COUNT == 0
```

## 43.5 APPROVED_SOURCE_REPAIR 의미는 유지

Common Protocol / 통합운영프로토콜의 기존 `APPROVED_SOURCE_REPAIR`를
`SOURCE_FIDELITY_RESTORATION`이나 `DERIVED_SOURCE_RECOVERY`로 재정의하지 않는다.

세 lifecycle은 §20을 따른다.

## 43.6 현재 상태

본 문서가 `05_DESIGN`에 있는 동안
`DERIVED_REPLACEMENT_VERIFIED`는 **required canonical amendment proposal**이다.

Common Protocol이 실제로 이 disposition을 수용하고
pipeline-core closure가 이를 검증하기 전에는
derived replacement를 production release-safe로 간주하지 않는다.

---

# 44. Runtime Resume

Auto-Recovery는 중단 복구 가능해야 한다.

최소 저장:

```text
sourceQuestionUid
currentRecoveryTier
tierMatrix
recoveryPlanId
candidateIndex
candidateVersion
acceptedCandidates
rejectedCandidates
lastVerifierResult

recoveryAuthority
authorizationRef
productionAdoptionStatus

requiredResource
resumeFromStage
nextAction
```

재개 시:

- 이미 PASS한 candidate를 다시 생성하지 않는다.
- accepted evidence를 수정하지 않는다.
- 현재 tier의 남은 candidate부터 계속한다.
- tier exhaustion이면 다음 tier로 간다.

---

# 45. Recovery Completion States

문항별 execution/recovery 요약:

```text
SOURCE_OK
SOURCE_ANSWER_KEY_RECOVERED
SOURCE_DEFECT_RECOVERED_MINIMAL
SOURCE_DEFECT_RECOVERED_STRUCTURAL
SOURCE_DEFECT_RECOVERED_RECONSTRUCTION

SOURCE_DEFECT_SHADOW_RECOVERED
SOURCE_RECOVERY_EVIDENCE_BLOCKED
SOURCE_RECOVERY_CAPABILITY_BLOCKED
SOURCE_DEFECT_PRESERVED_ONLY
SOURCE_DEFECT_HUMAN_REQUIRED
```

production slot disposition은 별도다.

```text
ORIGINAL_SOURCE_ACTIVE
APPROVED_SOURCE_REPAIR_ACTIVE
DERIVED_REPLACEMENT_VERIFIED
SOURCE_BLOCKED
VERIFIED_PRODUCTION_WITHDRAWAL
```

시험지 execution summary:

```text
CLEAN
RECOVERED
SHADOW_RECOVERED
RECOVERED_WITH_HUMAN_QUEUE
RECOVERED_WITH_CAPABILITY_BLOCK
RECOVERED_WITH_EVIDENCE_BLOCK
PRESERVE_ONLY_WITH_DEFECTS
```

위 execution summary는 Final Seal status가 아니다.

---

# 46. Report Contract

최종 report에는 최소 다음을 기록한다.

| 항목 | 값 |
|---|---|
| total questions | N |
| source defect count | N |
| answer-key-only | N |
| auto recovered | N |
| shadow recovered | N |
| adopted recovered | N |
| derived replacement verified | N |
| unauthorized recovery adoption | N |
| R1/R2 | N |
| R3/R4 | N |
| R5 | N |
| R6 | N |
| evidence blocked | N |
| capability blocked | N |
| human required | N |
| preserve only | N |
| replacement parity fail | N |

authority 집계:

```text
SHADOW_ONLY count
BOUNDED_PRODUCTION count
DEFAULT_PRODUCTION count
```

adoption 집계:

```text
NOT_AUTHORIZED count
AUTHORIZED count
ADOPTED count
```

결함이 있었지만 자동복구가 성공한 경우에도
원본 defect 사실과 derived lineage를 숨기지 않는다.

---

# 47. 예시 A — 정답이 보기에 없음

원본:

```text
독립 계산 결과 = 12
choices = [3, 6, 9, 10, 15]
```

판정:

```text
NO_CORRECT_ANSWER
R1 candidate
```

복구:

```text
10 -> 12
```

검증:

```text
문항 성립 PASS
정답 유일 PASS
오답 4개 PASS
curriculum PASS
```

결과:

```text
MINIMAL_RECOVERED
```

원본 choices는 source evidence에 그대로 남긴다.

---

# 48. 예시 B — 복수정답

원본:

```text
④ = 4√6
⑤ = 4√6
독립 결과 = 4√6
```

판정:

```text
DUPLICATE_CHOICES
MULTIPLE_CORRECT_ANSWERS
```

R1에서 한 선택지만 실제 오답 경로를 갖는 값으로 교체한다.

원본은 duplicate-choice defect로 보존한다.

---

# 49. 예시 C — 조건 부족

원문만으로:

```text
a = 1, 2, 5
```

세 값이 모두 가능.

판정:

```text
UNDERDETERMINED_STEM
MISSING_CONDITION
```

R3:

- 해당 유형의 core concept
- solutionGraph
- curriculum
- 난도 역할

을 보존하는 최소 조건 후보를 생성한다.

각 candidate를 독립 풀이하고 유일답이 되는 자연스러운 조건을 선택한다.

---

# 50. 예시 D — 발문 목표 자체 오류

조건은 정상이나 질문이 "a의 최댓값"이라고 되어 있고 실제로 최댓값이 존재하지 않는 경우.

R2/R3에서 자연 복구가 안 되면 R4로 이동.

예:

```text
최댓값 -> 상한
```

같은 단순 변경을 무조건 쓰는 것이 아니라 교육과정·원 problemType·학생 응답형식을 검증한 후 채택한다.

필요하면 질문 대상을 완전히 다른 파생값으로 바꿀 수 있다.

---

# 51. 예시 E — 문항 전체 재구성

원문에서:

- 조건 두 개 충돌
- 보기 전부 무의미
- printed answer도 불일치

하지만:

```text
standardUnit = 함수
concept = 최대·최소
problemType = parameter condition
difficulty role = 상
```

이 명확하면 R6를 실행한다.

새 조건·보기·정답·solution을 만들고 동일 concept의 정상 문항으로 재구성한다.

결과:

```text
RECOVERED_RECONSTRUCTION
```

원본 기출 문항의 교정본이라고 부르지 않는다.

---

# 52. 예시 F — 시각자료 오류

원문 그래프의 x절편은 1인데 발문은 x절편이 2라고 명시.

source recheck 후 실제 인쇄 충돌이 맞다면:

```text
VISUAL_STEM_CONFLICT
```

R5에서 두 방향 candidate를 만들 수 있다.

- stem을 graph에 맞춤
- graph를 stem에 맞춘 recovered visual 생성

두 candidate를 독립 수학/유형/fidelity 검증하고 ranking 기준으로 더 자연스러운 파생문항을 선택한다.

원본 source graph는 수정하지 않는다.

---

# 53. 자동복구의 품질 우선순위

본 시스템의 우선순위는:

```text
CORRECTNESS
> CURRICULUM
> PEDAGOGICAL IDENTITY
> RECOVERY COMPLETION
> SOURCE SIMILARITY
> MINIMAL EDIT
```

즉 "한 글자만 바꿨다"는 사실보다 정상적이고 교육적으로 의미 있는 문항인지가 더 중요하다.

---

# 54. 자동복구율과 안전성의 균형

사람 검토를 줄이기 위해 애매하면 무조건 BLOCKED로 보내는 정책은 사용하지 않는다.

대신:

```text
ambiguity
-> candidate diversification
-> independent solve
-> rank
-> bounded reconstruction
```

을 사용한다.

반대로 높은 자동복구율을 위해 검증 gate를 약화하지 않는다.

```text
AUTO_RECOVER does not mean AUTO_ACCEPT
```

복구 생성은 공격적으로, 최종 acceptance는 엄격하게 한다.

---

# 55. 권장 구현 순서

본 v1.2가 설계 검수 PASS를 받은 뒤,
**정책 확정 → 정본 보강 → schema/runtime → engine → regression** 순으로 진행한다.

권장 순서:

```text
1. v1.2를 alive/05_DESIGN에 유지한 채 정합성 재검수

2. COMMON_PROTOCOL amendment
   - DERIVED_REPLACEMENT_VERIFIED fourth disposition
   - 1:1 replacement parity
   - unauthorized/shadow adoption Final Seal gate

3. 통합운영프로토콜 amendment
   - APPROVED_SOURCE_REPAIR 기존 의미 유지
   - SOURCE_FIDELITY_RESTORATION / DERIVED_SOURCE_RECOVERY 경계 연결

4. ALIVE_MASTER_RULEBOOK
   - Source Defect Recovery Rulebook으로 route하는 얇은 연결
   - 기존 FREEZE / blind / retry 원칙 유지

5. Validation Sidecar
   - sourceRecovery object
   - recoveryAuthority
   - productionAdoptionStatus
   - tierMatrix 3축
   - evidence-blocked / replacement codes

6. Runtime / Prompt Compiler
   - recovery policy / authority / current tier
   - SOURCE_RECOVERY_EVIDENCE_BLOCKED resume
   - new candidateVersion targeted repair semantics

7. Archive Skill
   - FAIL detector -> Source Defect Router

8. Similar Skill
   - SOURCE_RECOVERY operation
   - derived artifact generation

9. actual engine path discovery
   - Source Defect Router
   - Recovery Reducer
   - Run Store
   - Sidecar serializer
   - replacement lineage writer

10. alive/engine/rule_pack.py
    - canonical promotion 시 active read order/hash 반영

11. docs/rules/MANIFEST.md / 00_RULES_INDEX
    - canonical active ruleset parity

12. archive/tools/pipeline-core/batch.mjs
    - rule refs / source conflict / scope evidence

13. archive/tools/pipeline-core/closure.mjs
    - DERIVED_REPLACEMENT_VERIFIED closure
    - authority/adoption release gate

14. archive/tools/logic-visual-audit/verify-rule-preflight.mjs
    - rule preflight / capability contract

15. 필요 시 review-isolation / independent verifier packets

16. capability registry + tierMatrix 구현

17. R0~R6 candidate search / ranking / new candidateVersion retry 구현

18. historical source-defect regression corpus 구축

19. P1 offline regression

20. P2 shadow run

21. P3 bounded production

22. P4 default AUTO_RECOVER 승격

23. canonical promotion 시
    alive/05_DESIGN -> alive/01_CANONICAL 이동
```

문서 몇 줄만 추가해서 operative로 간주하지 않는다.

특히 다음이 실제 코드에서 닫히기 전 production authority를 부여하지 않는다.

```text
rule-pack hash parity
Sidecar enum/code validation
replacement one-to-one parity
initial denominator preservation
authority/adoption gate
release closure
resume semantics
independent validation
```

---

# 56. 기존 문서 수정 원칙 — 최소 변경 + 필요한 정본 확장

본 기능을 위해 기존 문서를 대규모 재작성하지 않는다.

그러나 신규 lifecycle을 수용하기 위해 필요한 정본 확장은 회피하지 않는다.

## 그대로 유지

- 수학 오류 검증 프로토콜: **검증 전용**
- 기존 `APPROVED_SOURCE_REPAIR` 의미
- SOURCE TRUTH / 원본 성역
- blind independent math
- Candidate FREEZE
- Runtime 일반 `REGENERATE`
- denominator 축소 우회 금지
- Final Seal fail-closed
- actual render / final closure

## 얇게 연결

- Master Rulebook
- ALIVE Index
- Prompt Compiler

## schema/closure 수준에서 실제 확장

- Validation Sidecar
- COMMON_PROTOCOL
- 통합운영프로토콜
- pipeline-core closure/batch
- rule_pack / MANIFEST
- Recovery Router / Reducer / Run Store

즉 본 규칙은 기존 안전장치를 약화하는 것이 아니라
**"원본은 불변이지만 정상 derived 문항이 production slot을 1:1 승계할 수 있는 새 lifecycle"**을 추가한다.

---

# 57. 절대 금지 요약

```text
원본 source bytes 자동 수정 금지
recovered variant를 original이라고 표시 금지
printed answer에 맞춘 역산 금지
source solution 신뢰 금지
검증기와 builder 동일 판단으로 PASS 금지
source defect 1건 때문에 batch 중단 금지
복구안 복수라는 이유만으로 user 질문 금지
applicable/available recovery path 미소진 상태에서 HUMAN_REQUIRED 금지
SHADOW_ONLY recovery를 production final target으로 채택 금지
DERIVED_REPLACEMENT_VERIFIED 없이 original slot 대체 금지
INITIAL_INCLUDED_SCOPE_UID_SET 축소로 defect 문항 제거 금지
original + recovered 동시 production active 금지
frozen candidate in-place targeted mutation 금지
학생용 solution에 defect/recovery 메모 금지
visual source를 생성형 방식으로 원본처럼 위조 금지
curriculum 변경으로 복구 금지
난도 급락으로 복구한 척하기 금지
```

---

# 58. 최종 운영 원칙

```text
SOURCE DEFECT
!= USER QUESTION
```

기본 동작은 rollout phase와 현재 policy를 먼저 적용한다.

```text
SOURCE DEFECT
-> PRESERVE ORIGINAL
-> APPLY sourceRecoveryPolicy

   PRESERVE_ONLY
   OR
   SHADOW_AUTO_RECOVER
   OR
   AUTO_RECOVER
```

Recovery lane이 실행되는 경우:

```text
-> BUILD tier applicability/capability/execution matrix
-> GENERATE applicable candidate(s)
-> INDEPENDENT VERIFY
-> SELECT BEST VALID CANDIDATE
-> CHECK recoveryAuthority
-> CHECK productionAdoptionStatus
-> if production adoption:
     DERIVED_REPLACEMENT_VERIFIED
-> CONTINUE EXECUTION
```

사람에게 묻는 것은 원칙적으로 다음 두 경우에 한정한다.

```text
A. available source evidence를 실제 소진했으나
   minimum recovery identity가 여전히 unresolved
   AND missing resource/capability 때문이 아님

OR

B. ALL APPLICABLE + CAPABILITY-ACTIVE RECOVERY PATHS EXHAUSTED
   AND NO VALID CANDIDATE
   AND NO PENDING/BLOCKED/DEFERRED PATH REMAINS
```

다음은 HUMAN_REQUIRED가 아니다.

```text
missing source evidence
-> SOURCE_RECOVERY_EVIDENCE_BLOCKED

missing engine capability
-> RECOVERY_CAPABILITY_BLOCKED

shadow-only recovery
-> NOT_AUTHORIZED / release blocked, not human escalation
```

최종 release는 별도다.

```text
EXECUTION CONTINUE
does not imply
PRODUCTION RELEASE
```

---

# 59. 목표 상태

본 규칙의 장기 목표는 다음이다.

```text
source defect occurrence: rare
auto recovery attempt: default
auto recovery success: >= 99% pilot target
human escalation: exceptional
original fidelity loss: 0
silent source mutation: 0
false recovered PASS: 0 target
```

`99.9%`는 설계 목표이며, 실제 달성 여부는 historical regression + 신규 shadow run의 측정 결과로만 선언한다.

---

# 60. Canonical Promotion 조건

본 문서는 현재 `alive/05_DESIGN/`에 두는 `DESIGN_CANDIDATE`다.

실제 `01_CANONICAL` 정본으로 이동·승격하려면 최소:

1. v1.2 자체 정합성 검수 PASS
2. 기존 `APPROVED_SOURCE_REPAIR` 의미 보존 확인
3. `COMMON_PROTOCOL`에 `DERIVED_REPLACEMENT_VERIFIED` 정식 disposition 반영
4. Common Protocol one-to-one replacement / initial denominator parity 반영
5. unauthorized/shadow recovery adoption Final Seal HARD gate 반영
6. 통합운영프로토콜에 `DERIVED_SOURCE_RECOVERY` 별도 route 연결
7. P1 offline regression PASS
8. P2 shadow evidence 확보
9. P3 bounded production false-pass/reopen/replacement evidence 충족
10. `00_ALIVE_INDEX` canonical read order 반영
11. Master Rulebook 얇은 routing 연결
12. Prompt Compiler recovery routing 연결
13. Validation Sidecar schema + code registry + authority/adoption/tierMatrix 연결
14. `SOURCE_RECOVERY_EVIDENCE_BLOCKED` resume 계약 구현
15. Archive/Similar Skill routing 연결
16. `alive/engine/rule_pack.py` active read order/hash 계약 연결
17. `docs/rules/MANIFEST.md` 및 rule-pack parity 갱신
18. pipeline-core batch/closure에 derived replacement + authority/adoption gate 연결
19. capability registry와 `RECOVERY_CAPABILITY_BLOCKED` resume 계약 구현
20. `RECOVERY_TARGETED_REPAIR`를 new candidateVersion semantics로 구현/회귀검증
21. historical source defect corpus 자동복구 성능 측정
22. original/recovered lineage round-trip 검증
23. `INITIAL_INCLUDED_SCOPE_UID_SET` replacement 전후 불변 회귀검증
24. replacement cardinality 1:1 회귀검증
25. original/recovered simultaneous active 차단 회귀검증
26. human/evidence/capability/preserve-only/unapproved recovery가 남을 때 release BLOCKED 회귀검증
27. canonical promotion commit에서 파일을 `05_DESIGN`에서 `01_CANONICAL`로 이동

이 완료되기 전 본 문서는:

```text
DESIGN_CANDIDATE
NOT_YET_OPERATIVE
```

상태다.

---

# Appendix A. 기존 저장소와의 연결 기준

본 문서는 다음 현재 구조를 전제로 설계했다.

- `alive/00_ALIVE_INDEX.md`
- `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`
- `alive/02_PIPELINES/ALIVE_PROMPT_COMPILER_SPEC_v1.0.md`
- `alive/03_SCHEMA/ALIVE_VALIDATION_SIDECAR_SCHEMA_v1.0.md`
- `.codex/skills/apmath-archive-exams/SKILL.md`
- `.agents/skills/apmath-similar-question-pipeline/SKILL.md`
- `.agents/skills/apmath-similar-question-pipeline/references/fast-exam-workflow.md`
- `docs/rules/03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md`
- `docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`
- `docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`
- `archive/tools/past-exam-pipeline/`
- `alive/engine/rule_pack.py`
- `archive/tools/pipeline-core/batch.mjs`
- `archive/tools/pipeline-core/closure.mjs`
- `archive/tools/logic-visual-audit/verify-rule-preflight.mjs`
- 실제 구현 시 확정할 Source Defect Router / Recovery Reducer / Run Store / Sidecar serializer 경로

특히 현재 수학 오류 검증 프로토콜의 `FAIL만 보고 / 수정안 출력 금지` 계약을 유지하고, 그 다음 단계에 본 Recovery Router를 연결하는 것을 기본 설계로 한다.

현재 `alive/engine/rule_pack.py`는 active `docs/rules` read order와 MANIFEST hash를 직접 고정하므로, 본 규칙이 operative가 될 때 문서만 추가하고 해당 계약을 갱신하지 않는 상태를 허용하지 않는다.

---

# Appendix B. 권장 Runtime pseudo-flow

```text
function handleSourceQuestion(q):

    source = lockAndVerifySource(q)

    if requiredSourceEvidenceMissing(source):
        record(
          sourceRecovery.status = SOURCE_RECOVERY_EVIDENCE_BLOCKED,
          finalStatus = BLOCKED,
          requiredResource = resolveMissingResource(),
          resumeFromStage = SOURCE_RECHECK
        )
        return CONTINUE_EXECUTION

    solve = independentSolve(source.studentPayload)

    diagnosis = classifyConflict(source, solve)

    if diagnosis == EXTRACTION_DEFECT:
        restoreExtractionToActualSource()
        record SOURCE_FIDELITY_RESTORATION
        return CONTINUE_EXECUTION

    if diagnosis == NO_DEFECT:
        buildOriginalArchiveQuestion()
        return CONTINUE_EXECUTION

    if diagnosis == ANSWER_KEY_DEFECT:
        preserveSourcePayload()
        useIndependentAnswerAndSolution()
        recordAnswerKeyDefect()
        return CONTINUE_EXECUTION

    preserveOriginalSourceDefect()

    policy = resolveSourceRecoveryPolicy()
    authority = resolveRecoveryAuthority()

    if policy == PRESERVE_ONLY:
        recordPreserveOnly()
        markReleaseBlockedIfCorrectnessAffecting()
        return CONTINUE_EXECUTION

    fingerprint = freezeRecoverableFingerprint(source)

    tierMatrix = buildTierMatrix(
        diagnosis,
        fingerprint,
        capabilityRegistry
    )

    for tier in applicableActiveTiersInEscalationOrder(tierMatrix):

        candidates = generateCandidates(
            tier,
            fingerprint,
            diagnosis
        )

        verified = []

        for candidate in candidates:

            freeze(candidate)

            result = blindIndependentVerify(candidate)

            if localizedFailure(result) and targetedRepairEligible(candidate, tier):

                repaired = createNewCandidateVersion(
                    sameRecoveryPlanId = candidate.recoveryPlanId,
                    parentCandidateId = candidate.candidateId,
                    newCandidateId = newId(),
                    newPayloadSha = true
                )

                freeze(repaired)

                result = blindIndependentVerify(repaired)

                candidate = repaired

            if result.PASS:
                verified.append(candidate)

        if verified:

            winner = rankAndSelect(verified)

            markTierPass(tier)
            markHigherFallbackTiersSkippedAfterLowerPass(tierMatrix)

            freezeRecoveredArtifact(winner)
            linkLineage(source, winner)

            if policy == SHADOW_AUTO_RECOVER or authority == SHADOW_ONLY:
                record(
                  sourceRecovery.status = RECOVERED,
                  recoveryAuthority = SHADOW_ONLY,
                  productionAdoptionStatus = NOT_AUTHORIZED
                )
                return CONTINUE_EXECUTION

            authorization = verifyAuthorityScope(
                authority,
                authorizationRef,
                source,
                winner
            )

            if not authorization.PASS:
                recordUnauthorizedAdoptionBlocked()
                return CONTINUE_EXECUTION

            mark(
              productionAdoptionStatus = AUTHORIZED
            )

            if not existingCandidateQualityClosure(winner).PASS:
                recordRecoveryValidationFail()
                return CONTINUE_EXECUTION

            replacement = verifyDerivedReplacement(
                sourceQuestionUid = source.questionUid,
                recoveredQuestionUid = winner.questionUid,
                cardinality = "1:1",
                sourceOriginalPreserved = true,
                productionOriginalActive = false,
                productionRecoveredActive = true,
                initialScopeUidSetUnchanged = true,
                lineageParity = PASS,
                recoveredQualityClosure = PASS
            )

            if replacement.PASS:
                mark(
                  productionAdoptionStatus = ADOPTED,
                  replacementDisposition = DERIVED_REPLACEMENT_VERIFIED
                )
                return CONTINUE_EXECUTION

            recordDerivedReplacementParityFail()
            return CONTINUE_EXECUTION

    if anyApplicableTierCapabilityBlocked(tierMatrix):
        recordRecoveryCapabilityBlocked()
        markFinalStatusBlocked()
        return CONTINUE_EXECUTION

    if allApplicableActivePathsExhausted(tierMatrix) and noValidCandidate():
        record(
          sourceRecovery.status = HUMAN_REQUIRED,
          sourceRecovery.exhaustionStatus = AUTO_RECOVERY_EXHAUSTED,
          finalStatus = BLOCKED
        )
        return CONTINUE_EXECUTION

    recordUnresolvedState()
    markFinalStatusBlocked()
    return CONTINUE_EXECUTION


function finalizeExamRelease(exam):

    # Execution may already have processed every later question.
    # Release remains fail-closed.

    if exam.humanRequiredCount > 0:
        return BLOCKED

    if exam.recoveryEvidenceBlockedCount > 0:
        return BLOCKED

    if exam.recoveryCapabilityBlockedCount > 0:
        return BLOCKED

    if exam.correctnessAffectingPreserveOnlyCount > 0:
        return BLOCKED

    if exam.shadowRecoveredUnapprovedCount > 0:
        return BLOCKED

    if exam.unauthorizedRecoveryAdoptionCount > 0:
        return BLOCKED

    if exam.derivedReplacementParityFailCount > 0:
        return BLOCKED

    if not initialIncludedScopeUidSetParity(exam).PASS:
        return BLOCKED

    return existingFinalClosureAndSealGates(exam)
```


---

# Appendix C. 핵심 선언

> **원본을 지키는 것과 자동화를 강화하는 것은 충돌하지 않는다.**
>
> 원본은 immutable source로 지키고, 사용 가능한 정상 문항은 derived recovery artifact로 자동 생성한다.
>
> 따라서 source defect의 발견은 작업 중단 사유가 아니라 **자동복구 lane의 시작 신호**다.
>
> 다만 recovered artifact의 수학적 성공은 production authority와 동일하지 않다.
> production slot 승계는 `DERIVED_REPLACEMENT_VERIFIED`와 기존 Final Closure를 모두 통과한 경우에만 허용한다.
