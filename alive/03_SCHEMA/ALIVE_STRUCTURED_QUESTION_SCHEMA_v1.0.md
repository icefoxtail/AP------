# ALIVE Structured Question Schema v1.0

LLM 내부 문항 payload와 정답 canonicalization의 최소 계약이다.
최종 JS 직렬화 전 단계에서 사용한다.

## 1. 공통 필드

```json
{
  "id": 1,
  "questionType": "객관식",
  "level": "중",
  "category": "",
  "originalCategory": "",
  "standardCourse": "",
  "standardUnitKey": "",
  "standardUnit": "",
  "standardUnitOrder": 0,
  "layoutTag": "grid",
  "tags": [],
  "wide": false,
  "content": "",
  "choices": [],
  "answer": "",
  "answerType": "choice_index",
  "canonicalAnswer": "",
  "acceptableAnswers": [],
  "equivalencePolicy": "exact",
  "solution": ""
}
```

## 2. 타입

- `id`: integer > 0
- `questionType`: `객관식 | 주관식 | 서술형`
- `level`: `하 | 중 | 상`
- `standardUnitOrder`: integer >= 0
- `tags`: string[]
- `wide`: boolean
- `content`: non-empty string
- `choices`: string[]
- `answer`, `canonicalAnswer`, `solution`: string

## 3. 객관식

```text
questionType = 객관식
choices.length = 5
빈 choice 금지
answerType = choice_index
answer = ①~⑤ 중 하나
canonicalAnswer = 실제 정답 선택지의 정규화된 값 또는 answer와 동일
```

객관식에서 `acceptableAnswers`는 기본 빈 배열이다.

## 4. 주관식/서술형

```text
choices = []
canonicalAnswer 필수
answerType 필수
equivalencePolicy 필수
```

`answer`는 학생에게 보여주는 표준 답안 표현이고, `canonicalAnswer`는 자동 동등성 판정용 내부 표준형이다.

## 5. answerType

권장 enum:

```text
choice_index
integer
rational
decimal
expression
equation
inequality
interval
set
ordered_pair
multiple_values
text
```

필요한 신규 타입은 Schema 버전 변경 후 추가한다.

## 6. equivalencePolicy

```text
exact
normalized_string
numeric_equivalence
symbolic_equivalence
equation_equivalence
set_equivalence
interval_equivalence
```

예:

```json
{
  "answer": "$2x+1$",
  "answerType": "expression",
  "canonicalAnswer": "2*x+1",
  "acceptableAnswers": ["2*x+1", "1+2*x"],
  "equivalencePolicy": "symbolic_equivalence"
}
```

## 7. canonicalization 원칙

- `answer` 문자열 비교만으로 수학적 동등성을 판정하지 않는다.
- `symbolic_equivalence`는 가능한 경우 exact 계산 엔진으로 확인한다.
- 계산 엔진이 파싱 실패하거나 사용할 수 없으면, 먼저 문법적으로 안전하고 의미 보존이 보장된 deterministic normalization만 재시도한다.
- `normalized_string` 일치만으로 `symbolic_equivalence`를 자동 PASS하지 않는다. `normalized_string`은 문항이 해당 정책을 명시적으로 선택한 경우에만 독립적인 판정 정책으로 사용한다.
- equation_equivalence는 양변을 같은 표준식으로 정규화한 뒤 판정한다.
- set/interval은 원소·구간 의미 기준으로 정규화한다.
- 근삿값 허용 오차는 문항별 별도 정책 없이는 임의 설정하지 않는다.
- `acceptableAnswers`는 대표 허용 표기이며 모든 수학적 동치표현을 수동 나열해야 한다는 뜻이 아니다.

### 동등성 검증 Fallback

`symbolic_equivalence` 또는 `equation_equivalence`가 아래 순서로도 확정되지 않으면 정답 동등성 검증을 완료한 것으로 보지 않는다.

```text
1. exact symbolic/equation verification
2. 의미 보존이 보장된 deterministic normalization
3. 다른 exact 방법 또는 사람 검토
4. unresolved
```

`unresolved` 결과는 Validator status=`UNVERIFIED`, code=`SYMBOLIC_EVALUATION_UNRESOLVED`로 기록한다.

- 해당 동등성 검증이 필수 acceptance criterion이면 `finalStatus=BLOCKED`로 두고 `HUMAN_REVIEW`로 라우팅한다.
- 명시적으로 비필수인 보조 표기 검증이면 blocking code를 남기지 않고 Master Rulebook §5에 따라 `HOLD`를 사용할 수 있다.
- 어떤 경우에도 파싱 실패만으로 수학적 FAIL을 확정하거나, 문자열 일치만으로 symbolic PASS를 확정하지 않는다.

## 8. JS_ARCHIVE 출력 경계

`canonicalAnswer`, `acceptableAnswers`, `equivalencePolicy`, `answerType`은 내부 transport/채점 metadata다.
현재 target JS Archive가 이 필드를 공식 지원하는 것이 확인되지 않았다면 최종 `window.questionBank` 객체에 임의 삽입하지 않는다.

최종 JS에는 target의 기존 schema를 우선한다.

## 9. Schema FAIL

다음은 FAIL:
- 객관식 choices != 5
- 주관식/서술형 choices가 비어 있지 않음
- 객관식 answer가 보기와 불일치
- 주관식 canonicalAnswer 누락
- answerType/equivalencePolicy 불일치
- 동일 batch 내 id 충돌
- 필수 문자열이 미종료/빈 값인데도 최종 승인
