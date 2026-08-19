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

## 4. 조건부 포함

### TYPE_BANK
- 대표유형/기본형/구조변형/사고확장 중 현재 stage만 포함
- STRICT_VARIANT 규칙 제외

### EXAM_FOLLOWUP
- Source Fingerprint
- 확인/심화 규칙
- A~F / QUALITY
- 원문 fidelity

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

### JS_ARCHIVE
- Structured Schema + Serializer/V7 계약 포함

## 5. 충돌 감지

Compiler는 다음 충돌을 막아야 한다.

- TYPE_BANK 숫자갈이 금지 + STRICT_VARIANT 숫자변형 허용 동시 삽입
- PROBLEM_ANSWER_ONLY 때문에 Validator 삭제
- 객관식이 아닌데 Distractor 5개 강제
- visual NONE인데 ESSENTIAL asset 생성 강제
- 2015/2022 단원 규칙 혼용

충돌 해결 불가 → `BLOCKED: MODE_CONFLICT`.

## 6. provenance

생성된 Runtime Prompt에는 내부적으로 다음을 추적 가능하게 한다.

```json
{
  "rulebookVersion": "9.1",
  "compilerVersion": "1.0",
  "includedSections": [],
  "excludedSections": [],
  "mode": "",
  "profile": ""
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
