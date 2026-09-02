# ALIVE Prompt Compiler Specification v1.0

Master Rulebook 전체를 매 호출에 그대로 넣지 않고 현재 요청에 필요한 규칙만 조립하기 위한 최소 계약이다.

## 1. 원칙

- Master Rulebook이 정책 정본이다.
- Runtime Prompt는 파생물이다.
- Compiler가 규칙 의미를 임의 요약·완화·변경하면 안 된다.
- 현재 MODE/Profile에 불필요한 섹션은 제외한다.

## 2. 입력

```json
{
  "rulebookVersion": "9.1",
  "mode": "EXAM_FOLLOWUP",
  "profile": "PROBLEM_ANSWER_ONLY",
  "schoolLevel": "HIGH",
  "curriculum": "2022",
  "standardCourse": "확률과 통계",
  "standardUnitKey": "H22-PS-03",
  "questionFormat": "객관식",
  "visualDependency": "NONE",
  "followupKind": "CONFIRMATION",
  "assetPolicy": "NONE",
  "tokenBudget": {
    "maxInputTokens": 0,
    "reservedOutputTokens": 0,
    "overflowPolicy": "BLOCKED"
  },
  "inputLevel": "L2"
}
```

## 3. 기본 조립 순서

```text
CORE INTEGRITY
+ RUNTIME ORDER
+ SELECTED MODE
+ SELECTED PROFILE
+ CURRICULUM BOUNDARY
+ RELEVANT HARD CHECK
+ DIFFICULTY RULE
+ RELEVANT VALIDATOR RULES
+ OUTPUT CONTRACT
```

## 3-1. Token budget and truncation boundary

Compiler는 target model tokenizer 기준으로 조립 결과의 예상 입력 토큰 수를 계산한다. 문자 수나 임의의 대략값만으로 예산 충족을 판정하지 않는다.

`tokenBudget`:

- `maxInputTokens`: Runtime Prompt에 허용되는 최대 입력 토큰 수. 구현에서 양의 값으로 설정한다.
- `reservedOutputTokens`: 응답과 구조화된 출력에 남겨둘 토큰 예산.
- `overflowPolicy`: v1.0에서는 `BLOCKED`만 허용한다.

모델 context window를 직접 아는 구현에서는 `maxInputTokens <= contextWindow - reservedOutputTokens`가 되도록 계산한다. 예시의 `0`은 구현 설정 전 placeholder이며, 실제 컴파일 시 양의 예산으로 대체해야 한다.

다음 섹션은 예산 초과 시에도 생략·축약하지 않는 필수 섹션이다.

- CORE INTEGRITY
- RUNTIME ORDER
- SELECTED MODE
- CURRICULUM BOUNDARY
- RELEVANT HARD CHECK
- 현재 작업에 적용되는 Validator 규칙
- OUTPUT CONTRACT

`visualDependency != NONE`이면 V5와 Visual provenance를, `assetPolicy=MANDATORY_NEW`이면 NEW ASSET gate를 필수 섹션으로 취급한다. `followupKind=ADVANCED`이면 심화 조건과 G09 gate도 필수다.

필수가 아닌 섹션은 완전한 섹션 단위로만 제외할 수 있다. 문장 중간 자르기, 규칙의 임의 요약·완화·재작성, 버전이 없는 축약본 생성은 허용하지 않는다.

필수 섹션을 모두 유지한 상태에서 `maxInputTokens`를 초과하면 Runtime Prompt를 생성하지 않고 `finalStatus=BLOCKED`, code=`PROMPT_BUDGET_EXCEEDED`로 종료한다.

## 4. 조건부 포함

### TYPE_BANK
- 대표유형/기본형/구조변형/사고확장 중 현재 stage만 포함
- STRICT_VARIANT 규칙 제외

### EXAM_FOLLOWUP
- Source Fingerprint
- `followupKind=CONFIRMATION`이면 확인 규칙과 Master Rulebook §11의 난도 동치 기준
- `followupKind=ADVANCED`이면 심화 규칙과 Master Rulebook §13의 A~F / QUALITY
- 원문 fidelity

`followupKind`는 MODE가 아니며 `EXAM_FOLLOWUP`에서만 사용한다. 값이 없거나 `CONFIRMATION | ADVANCED`가 아니면 `INPUT_REQUIRED`로 차단한다.

### Similar / Advanced + visual regeneration
- `visualDependency != NONE`이면 Visual Spec §1~§9와 V5 규칙을 포함한다.
- `assetPolicy=MANDATORY_NEW`이면 Similar/Advanced Spec §6~§10, §19~§20의 NEW ASSET, topology, semantic ownership, 동시 FREEZE 규칙을 포함한다.
- `assetPolicy=MANDATORY_NEW`는 기존 asset 경로를 그대로 재사용하는 것을 허용하지 않는다.
- `followupKind=ADVANCED`이면 심화의 새 판단 +1과 Master Rulebook §13의 G09 gate를 함께 포함한다.

`assetPolicy` 권장 값:
- `NONE`: visualDependency가 NONE인 경우
- `REUSE_IF_SEMANTICALLY_IDENTICAL`: 수치·좌표·라벨과 독립적인 설명용 asset
- `MANDATORY_NEW`: 유사·심화 또는 수치·좌표·관계가 바뀐 시각문항

### STRICT_VARIANT
- LOCK/CHANGE
- solution-first
- 숫자변형 예외
- TYPE_BANK 숫자갈이 금지 규칙 제외

### 객관식
- Distractor + V4 포함

### 주관식/서술형
- canonical answer 규칙 포함
- V4 제외

### visual NONE
- V5 상세 제외

### visual OPTIONAL/ESSENTIAL
- V5 Visual Validator
- visual provenance

### JS_ARCHIVE
- Structured Schema + Serializer/V7 계약 포함

## 5. 충돌 감지

Compiler는 다음 충돌을 막아야 한다.

- TYPE_BANK 숫자갈이 금지 + STRICT_VARIANT 숫자변형 허용 동시 삽입
- EXAM_FOLLOWUP인데 `followupKind`가 없거나 허용되지 않은 값인 경우
- `assetPolicy=MANDATORY_NEW`인데 `visualDependency=NONE`인 경우
- PROBLEM_ANSWER_ONLY 때문에 Validator 삭제
- 객관식이 아닌데 Distractor 5개 강제
- visual NONE인데 ESSENTIAL asset 생성 강제
- 2015/2022 단원 규칙 혼용

충돌 해결 불가 → `finalStatus=BLOCKED`, code=`MODE_CONFLICT`.

## 6. provenance

생성된 Runtime Prompt에는 내부적으로 다음을 추적 가능하게 한다.

```json
{
  "rulebookVersion": "9.1",
  "compilerVersion": "1.0",
  "includedSections": [],
  "excludedSections": [],
  "mode": "",
  "profile": "",
  "followupKind": "",
  "assetPolicy": "",
  "tokenBudget": {
    "maxInputTokens": 0,
    "estimatedInputTokens": 0,
    "reservedOutputTokens": 0,
    "overflowAction": "NONE"
  }
}
```

학생용 문항 output에는 이 정보를 넣지 않는다.

## 7. 전문 사용

Master Rulebook 전문을 직접 LLM에 넣는 방식은:
- 개발
- 회귀 검수
- 규칙 리뷰

용도로 허용한다.

운영 기본값은 Compiler가 만든 Runtime Prompt다.

## 8. Compiler가 하지 않는 일

- 문항 생성
- 수학 검산
- curriculum 자체 판정
- 난도 점수 생성
- Serializer 실행

Compiler는 규칙 선택·조립만 담당한다.
