```json:exam
{
  "stem": "26_동산중_1학기_기말_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js",
  "examFolder": "1final",
  "grade": "중2",
  "curriculum": "2022",
  "questionCount": 24,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```


## Q01
- 형식: 객관식
- 배점: 4
### 발문
다음 두 변수 $x, y$에 대하여 $y$가 $x$의 함수가 아닌 것은? [4점]
### 선지
① 한 자루에 $600$원인 색연필 $x$자루의 가격 $y$원
② 자연수 $x$의 배수 $y$
③ 시속 $50\text{ km}$로 $x$시간 동안 달린 거리 $y\text{ km}$
④ 현재 나이가 $14$세인 학생의 $x$년 후의 나이 $y$세
⑤ $200\text{ mL}$의 우유를 매초 $5\text{ mL}$씩 마실 때, $x$초 후 남은 우유의 양 $y\text{ mL}$
### 정답
②
### 해설
함수는 $x$의 각 값에 대하여 $y$의 값이 오직 하나씩 정해지는 대응 관계이다.
① 색연필 $x$자루의 가격은 $y = 600x$로 $x$의 값에 따라 $y$가 오직 하나로 결정된다. (함수)
② 자연수 $x=2$의 배수는 $2, 4, 6, 8, \dots$과 같이 무수히 많으므로 $x$의 값 하나에 $y$의 값이 오직 하나로 정해지지 않는다. (함수가 아님)
③ 거리는 속력과 시간의 곱이므로 $y = 50x$로 오직 하나로 결정된다. (함수)
④ 나이는 $y = x + 14$로 오직 하나로 결정된다. (함수)
⑤ 남은 양은 $y = 200 - 5x$로 오직 하나로 결정된다. (함수)


따라서 $y$가 $x$의 함수가 아닌 것은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 1,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "FUNCTION_DEFINITION_UNIQUENESS",
  "primaryMethod": "x의 각 값에 대응하는 y의 값이 오직 하나인지 판별한다.",
  "decisiveStep": "자연수의 배수는 무수히 많으므로 함수가 아님을 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "함수의 뜻과 함숫값",
    "l4": "함수의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FUNCTION_CONCEPT",
    "templateKey": "TPL_FUNCTION_UNIQUENESS_PROPERTY",
    "why": "수량 관계에서 함수의 정의를 만족하는지 판별하는 기본 유형"
  },
  "crossConceptKeys": [
    "CC_MULTIPLE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "함수의 일대일 대응 여부를 일상 언어 수량 관계에서 판별하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q02
- 형식: 객관식
- 배점: 3
### 발문
함수 $f(x) = 2x - 1$에 대하여 $f(4)$의 값은? [3점]
### 선지
① 4
② 5
③ 6
④ 7
⑤ 8
### 정답
④
### 해설
함수식 $f(x) = 2x - 1$에 $x = 4$를 대입하여 계산한다.
$$
f(4) = 2 \times 4 - 1 = 8 - 1 = 7
$$
따라서 정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 2,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "FUNCTION_VALUE_EVALUATION",
  "primaryMethod": "일차식 형태의 함수에 주어진 입력값을 대입하여 함숫값을 산출한다.",
  "decisiveStep": "f(4) = 2*4 - 1 = 7 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "함수의 뜻과 함숫값",
    "l4": "함숫값 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FUNCTION_VALUE",
    "templateKey": "TPL_FUNCTION_VALUE_SUBSTITUTION",
    "why": "함수식에 정수를 대입하여 함숫값을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정수 대입을 통한 기본 사칙연산 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "대입",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q03
- 형식: 객관식
- 배점: 3
### 발문
다음 중 $y$가 $x$에 대한 일차함수인 것은? [3점]
### 선지
① $y = 3x - 5$
② $y = \dfrac{2}{x}$
③ $y = x^2 - 4$
④ $y = 2x - (2x + 3)$
⑤ $y = x(x - 2)$
### 정답
①
### 해설
일차함수는 우변을 정리했을 때 $y = ax + b$ ($a, b$는 상수, $a \ne 0$)의 꼴로 나타내어지는 함수이다.
① $y = 3x - 5$는 $x$에 대한 일차식이므로 일차함수이다. (참)
② $y = \dfrac{2}{x}$는 분모에 미지수 $x$가 있으므로 다항식이 아니며 일차함수가 아니다. (반비례 관계)
③ $y = x^2 - 4$는 $x^2$ 항이 있으므로 이차함수이다.
④ $y = 2x - (2x + 3) = 2x - 2x - 3 = -3$은 상수함수이므로 일차함수가 아니다.
⑤ $y = x(x - 2) = x^2 - 2x$는 이차함수이다.


따라서 일차함수인 것은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 3,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_IDENTIFICATION",
  "primaryMethod": "식의 동류항을 정리하여 y = ax + b (a != 0) 형태인지 확인한다.",
  "decisiveStep": "1차 다항식 형태인 y = 3x - 5 판별",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 뜻과 그래프",
    "l4": "일차함수의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_DEFINITION",
    "templateKey": "TPL_LINEAR_FUNCTION_IDENTIFICATION",
    "why": "다양한 대수식 중에서 일차함수를 식별하는 기본 유형"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_EXPANSION"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차함수의 기본 정의를 묻는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "동류항"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q04
- 형식: 객관식
- 배점: 3
### 발문
일차함수 $y = 4x$의 그래프를 $y$축의 방향으로 $-5$만큼 평행이동한 직선의 식은? [3점]
### 선지
① $y = 4x + 5$
② $y = -5x + 4$
③ $y = 4x - 5$
④ $y = -5x$
⑤ $y = -4x - 5$
### 정답
③
### 해설
일차함수 $y = ax$의 그래프를 $y$축의 방향으로 $b$만큼 평행이동하면 식은 $y = ax + b$가 된다.
따라서 일차함수 $y = 4x$의 그래프를 $y$축의 방향으로 $-5$만큼 평행이동한 직선의 식은
$$
y = 4x - 5
$$
이다.
정답은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 4,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_Y_AXIS_TRANSLATION",
  "primaryMethod": "y축 방향 평행이동 공식 y = ax + b를 직접 적용한다.",
  "decisiveStep": "y = 4x - 5 작성",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프",
    "l4": "일차함수의 그래프의 평행이동"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_TRANSLATION",
    "templateKey": "TPL_LINEAR_TRANSLATION_Y_AXIS",
    "why": "y축 평행이동 시 상수항 변환을 묻는 기본 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행이동 공식을 그대로 대입하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차함수",
      "평행"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q05
- 형식: 객관식
- 배점: 3
### 발문
일차함수 $y = 2x + 4$의 그래프의 $y$절편을 $a$, 기울기를 $b$라 할 때, $a + b$의 값은? [3점]
### 선지
① 2
② 3
③ 4
④ 5
⑤ 6
### 정답
⑤
### 해설
일차함수 $y = 2x + 4$에서
- $x$의 계수가 기울기이므로 $b = 2$이다.
- 상수항이 $y$절편이므로 $a = 4$이다.
따라서 구하는 값은
$$
a + b = 4 + 2 = 6
$$
정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 5,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_SLOPE_Y_INTERCEPT_SUM",
  "primaryMethod": "표준형 y = mx + n에서 기울기와 y절편을 식별하여 합산한다.",
  "decisiveStep": "a=4, b=2 도출 후 a+b=6 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프",
    "l4": "기울기와 y절편"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SLOPE_INTERCEPT_SUM",
    "templateKey": "TPL_LINEAR_COEFFICIENTS_READING",
    "why": "일차함수 식에서 기울기와 y절편을 판독하여 합을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기울기와 절편의 계수 정의를 직접 확인하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q06
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y = -3x + 6$의 그래프에 대한 설명으로 옳은 것은? [4점]
### 선지
① $x$절편은 $-2$이다.
② $y = -3x$의 그래프와 평행하다.
③ $y$축과의 교점의 좌표는 $(0, -6)$이다.
④ $x$의 값이 증가할 때 $y$의 값도 증가한다.
⑤ 제3사분면을 지난다.
### 정답
②
### 해설
일차함수 $y = -3x + 6$의 성질을 분석한다.
- 기울기는 $-3$, $y$절편은 $6$이다.
- $x$절편은 $y=0$일 때 $0 = -3x + 6 \implies x = 2$이므로 $x$절편은 $2$이다. (①은 거짓)
- 기울기가 $-3$으로 같고 $y$절편이 다르므로 $y = -3x$의 그래프와 평행하다. (②는 참)
- $y$축과의 교점의 좌표는 $(0, 6)$이다. (③은 거짓)
- 기울기가 음수이므로 $x$의 값이 증가할 때 $y$의 값은 감소한다. (④는 거짓)
- $x$절편이 $2$ (양수), $y$절편이 $6$ (양수)이므로 제$1$, $2$, $4$사분면을 지나고 제$3$사분면은 지나지 않는다. (⑤는 거짓)


따라서 옳은 것은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 6,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_PROPERTIES_AUDIT",
  "primaryMethod": "기울기, 절편, 증가/감소, 사분면 통과 및 평행 조건을 종합 분석한다.",
  "decisiveStep": "기울기가 -3으로 같아 y = -3x와 평행함을 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프의 성질",
    "l4": "일차함수의 그래프의 평행과 일치"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_PROPERTIES",
    "templateKey": "TPL_LINEAR_FUNCTION_MULTI_PROPERTIES",
    "why": "일차함수의 절편, 기울기, 평행성, 사분면을 종합 점검하는 유형"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_PLANE"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차함수의 기본 그래프 성질을 참/거짓으로 검증하는 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차함수",
      "평행"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "대소비교"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q07
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y = ax + b$의 그래프에서 $x$의 값이 $3$만큼 증가할 때 $y$의 값은 $2$만큼 감소한다. $x$의 값이 $-3$에서 $6$까지 증가할 때, $y$의 값의 증가량은? [4점]
### 선지
① $-6$
② $-4$
③ $-2$
④ $4$
⑤ $6$
### 정답
①
### 해설
1. 일차함수의 기울기를 구한다.
$x$의 값이 $3$만큼 증가할 때 $y$의 값은 $2$만큼 감소하므로
$$
\text{기울기 } a = \frac{\Delta y}{\Delta x} = \frac{-2}{3} = -\frac{2}{3}
$$
2. $x$의 값이 $-3$에서 $6$까지 증가할 때 $x$의 증가량은
$$
\Delta x = 6 - (-3) = 9
$$
3. $y$의 값의 증가량은
$$
\Delta y = a \times \Delta x = -\frac{2}{3} \times 9 = -6
$$
따라서 정답은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 7,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "SLOPE_RATE_OF_CHANGE_CALCULATION",
  "primaryMethod": "기울기 공식 Delta y / Delta x를 세우고 새로운 x 변화량에 곱한다.",
  "decisiveStep": "기울기 -2/3 도출 후 Delta y = (-2/3) * 9 = -6 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프",
    "l4": "기울기의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RATE_OF_CHANGE",
    "templateKey": "TPL_SLOPE_CHANGE_PROPORTIONALITY",
    "why": "기울기를 구하고 x의 증가량에 따른 y의 증가량을 계산하는 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기울기 정의와 비례 관계식을 적용하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수",
      "기울기"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q08
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y = ax + b$의 그래프는 $y = -3x + 4$의 그래프와 평행하고, $y = 2x - 3$의 그래프와 $y$축 위에서 만난다. 이때 상수 $a, b$에 대하여 $ab$의 값은? [4점]
### 선지
① $-9$
② $-6$
③ $6$
④ $9$
⑤ $12$
### 정답
④
### 해설
1. $y = ax + b$의 그래프가 $y = -3x + 4$의 그래프와 평행하므로 기울기가 같다.
$$
a = -3
$$
2. $y = ax + b$의 그래프가 $y = 2x - 3$의 그래프와 $y$축 위에서 만나므로 $y$절편이 같다.
$$
b = -3
$$
3. 두 상수 $a, b$의 곱은
$$
ab = (-3) \times (-3) = 9
$$
따라서 정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 8,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "PARALLEL_AND_Y_INTERCEPT_CONCURRENCE",
  "primaryMethod": "평행 조건에서 기울기를, y축 교점 조건에서 y절편을 각각 추출하여 곱한다.",
  "decisiveStep": "a = -3, b = -3 도출 후 ab = 9 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 식 구하기",
    "l4": "기울기와 y절편이 주어진 일차함수의 식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINE_FORMULATION_CONDITIONS",
    "templateKey": "TPL_PARALLEL_AND_INTERCEPT_PRODUCT",
    "why": "평행 조건과 y절편 조건을 조합해 계수 곱을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행과 y축 교점의 의미를 각각 해석해 계수를 결정하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수",
      "평행"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
$x$절편이 $-3$이고 $y$절편이 $-6$인 일차함수의 식은? [4점]
### 선지
① $y = 2x - 6$
② $y = -2x + 6$
③ $y = -2x - 6$
④ $y = -\dfrac{1}{2}x - 6$
⑤ $y = -\dfrac{1}{2}x + 6$
### 정답
③
### 해설
$x$절편이 $-3$, $y$절편이 $-6$이므로 그래프는 두 점 $(-3, 0)$과 $(0, -6)$을 지난다.
기울기는
$$
\text{기울기 } a = \frac{-6 - 0}{0 - (-3)} = \frac{-6}{3} = -2
$$
$y$절편이 $-6$이므로 구하는 일차함수의 식은
$$
y = -2x - 6
$$
이다.
정답은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 9,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "TWO_INTERCEPTS_LINE_EQUATION",
  "primaryMethod": "두 절편 좌표 (-3, 0), (0, -6)으로 기울기를 구하고 y절편을 결합한다.",
  "decisiveStep": "기울기 -2 산출 후 y = -2x - 6 완성",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 식 구하기",
    "l4": "x절편과 y절편이 주어진 일차함수의 식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINE_FROM_INTERCEPTS",
    "templateKey": "TPL_TWO_INTERCEPTS_LINEAR_EQUATION",
    "why": "두 절편이 주어졌을 때 일차함수 식을 작성하는 유형"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_PLANE"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 절편으로부터 기울기를 구하고 함수식을 완성하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "x절편",
      "y절편"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q10
- 형식: 객관식
- 배점: 4.5
### 발문
일차함수 $y = ax + b$의 그래프가 제$4$사분면을 지나지 않을 때, 일차함수 $y = -\dfrac{b}{a}x + b$의 그래프가 지나지 않는 사분면은? [4.5점]
### 선지
① 제1사분면
② 제2사분면
③ 제4사분면
④ 제1, 2사분면
⑤ 제3사분면
### 정답
⑤
### 해설
1. $y = ax + b$의 그래프가 제$4$사분면을 지나지 않으려면
- 오른쪽 위로 향해야 하므로 기울기 $a > 0$이다.
- $y$축의 양의 부분을 지나야 하므로 $y$절편 $b > 0$이다. (만약 $b \le 0$이면 제$4$사분면을 지나게 된다.)
따라서
$$
a > 0, \quad b > 0
$$
2. 이제 일차함수 $y = -\dfrac{b}{a}x + b$의 그래프를 분석한다.
- 기울기는 $-\dfrac{b}{a}$이고, $a > 0, b > 0$이므로 $-\dfrac{b}{a} < 0$ (음수)이다.
- $y$절편은 $b > 0$ (양수)이다.
3. 기울기가 음수이고 $y$절편이 양수인 직선은 오른쪽 아래로 향하며 $y$축의 양의 부분을 지나므로,
제$1$사분면, 제$2$사분면, 제$4$사분면을 지나고 제$3$사분면은 지나지 않는다.


따라서 정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 10,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "QUADRANT_CONDITION_COEFFICIENT_SIGNS",
  "primaryMethod": "지나지 않는 사분면으로부터 a, b 부호를 결정한 후 변형된 함수의 사분면 개형을 추론한다.",
  "decisiveStep": "a>0, b>0 도출 후 기울기 음수, 절편 양수로 제3사분면 미경유 판정",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프의 성질",
    "l4": "a, b의 부호와 일차함수의 그래프"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_QUADRANT_ANALYSIS",
    "templateKey": "TPL_QUADRANT_SIGN_ANALYSIS_LINEAR",
    "why": "사분면 통과 조건으로부터 미정계수 부호를 유추하는 심화 유형"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_PLANE"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호 추론과 제2함수의 개형 분석을 연계하는 2단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "대소비교"
    ],
    "condition": [
      "상수",
      "양수"
    ]
  },
  "hold": ""
}
```


## Q11
- 형식: 객관식
- 배점: 5
### 발문
가로의 길이가 $20\text{ cm}$, 세로의 길이가 $8\text{ cm}$인 직사각형 $ABCD$에서 점 $P$는 점 $B$를 출발하여 변 $BC$를 따라 점 $C$까지 매초 $2\text{ cm}$의 속력으로 움직인다. 점 $P$가 출발한 지 $x$초 후의 사다리꼴 $APCD$의 넓이를 $y\text{ cm}^2$라 할 때, 보기에서 옳은 것만을 있는 대로 고른 것은? [5점]


$$
\begin{aligned}
&\text{ㄱ. } y = -8x + 160 \\
&\text{ㄴ. 사다리꼴의 넓이는 } 1\text{초에 } 8\text{ cm}^2\text{씩 줄어든다.} \\
&\text{ㄷ. 사다리꼴 } APCD\text{의 넓이가 } 100\text{ cm}^2\text{가 되는 것은 점 } P\text{가 출발한 지 } 8\text{초 후이다.}
\end{aligned}
$$
### 선지
① ㄱ
② ㄱ, ㄴ
③ ㄱ, ㄷ
④ ㄴ, ㄷ
⑤ ㄱ, ㄴ, ㄷ
### 정답
②
### 해설
1. $x$초 후 선분 $BP$의 길이는 $2x\text{ cm}$이다.
직사각형 $ABCD$의 전체 넓이는
$$
20 \times 8 = 160\text{ (cm}^2\text{)}
$$
삼각형 $ABP$는 밑변이 $BP = 2x$, 높이가 $AB = 8$이므로 넓이는
$$
\triangle ABP = \frac{1}{2} \times 2x \times 8 = 8x\text{ (cm}^2\text{)}
$$
사다리꼴 $APCD$의 넓이 $y$는 직사각형의 넓이에서 $\triangle ABP$의 넓이를 뺀 것이므로
$$
y = 160 - 8x = -8x + 160
$$
따라서 ㄱ은 옳다.


2. 관계식 $y = -8x + 160$에서 $x$의 계수가 $-8$이므로 $x$가 $1$ 증가할 때 $y$는 $8$씩 감소한다.
즉, 사다리꼴의 넓이는 $1$초에 $8\text{ cm}^2$씩 줄어든다.
따라서 ㄴ은 옳다.


3. $y = 100$일 때의 시간을 구하면
$$
100 = -8x + 160 \implies 8x = 60 \implies x = \frac{60}{8} = 7.5\text{ (초)}
$$
따라서 $8$초 후가 아니라 $7.5$초 후이므로 ㄷ은 옳지 않다.


그러므로 옳은 것은 ㄱ, ㄴ이다.
정답은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 11,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_APPLICATION",
  "conceptClusterKey": "MOVING_POINT_GEOMETRIC_AREA_FUNCTION",
  "primaryMethod": "동점의 이동 거리를 일차식으로 나타내어 전체 도형 넓이에서 감산하여 관계식을 세운다.",
  "decisiveStep": "y = -8x + 160 도출 및 y=100일 때 x=7.5 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수의 활용",
    "l3": "일차함수의 활용",
    "l4": "도형에서의 일차함수의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MOVING_POINT_AREA",
    "templateKey": "TPL_RECTANGLE_MOVING_POINT_TRAPEZOID",
    "why": "동점 이동에 따른 사다리꼴 넓이 변화를 일차함수로 모델링하는 유형"
  },
  "crossConceptKeys": [
    "CC_TRAPEZOID_AREA"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "동점 기하 모델링과 함숫값 역산 검증을 결합한 표준 합답형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직사각형",
      "사다리꼴"
    ],
    "goal": [
      "넓이",
      "일차함수"
    ],
    "method": [
      "이항",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q12
- 형식: 객관식
- 배점: 3
### 발문
다음 중 미지수가 $2$개인 일차방정식인 것은? [3점]
### 선지
① $2x - 3 = 5$
② $3x + y = 3x - 2$
③ $x^2 + 2y = 1$
④ $3x - 5y = 7$
⑤ $xy + 2 = 0$
### 정답
④
### 해설
미지수가 $2$개인 일차방정식은 동류항을 정리했을 때 $ax + by = c$ ($a, b, c$는 상수, $a \ne 0, b \ne 0$)의 꼴이어야 한다.
① $2x = 8$로 미지수가 $x$ 하나뿐이다.
② 동류항을 이항하여 정리하면 $y = -2$가 되어 미지수가 $y$ 하나뿐이다.
③ $x^2$ 항이 있으므로 차수가 $2$이다.
④ $3x - 5y = 7$은 $x, y$ 미지수가 $2$개이고 각각 차수가 $1$인 일차방정식이다. (참)
⑤ $xy$ 항은 $x, y$에 대한 차수가 $2$이므로 일차방정식이 아니다.


따라서 정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 12,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_BASIC",
  "conceptClusterKey": "TWO_VARIABLE_LINEAR_EQUATION_DEFINITION",
  "primaryMethod": "모든 항을 정리하여 ax + by = c (a!=0, b!=0) 꼴인지 확인한다.",
  "decisiveStep": "3x - 5y = 7 의 미지수 2개 및 1차식 충족 확인",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "미지수가 2개인 일차방정식",
    "l4": "미지수가 2개인 일차방정식의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_EQ_DEFINITION",
    "templateKey": "TPL_TWO_VARIABLE_LINEAR_EQUATION_JUDGMENT",
    "why": "미지수가 2개인 일차방정식을 식별하는 기본 개념 유형"
  },
  "crossConceptKeys": [
    "CC_DEGREE_OF_POLYNOMIAL"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미지수 개수와 차수의 정의를 직접 대조하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차방정식"
    ],
    "goal": [
      "일차방정식"
    ],
    "method": [
      "동류항"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q13
- 형식: 객관식
- 배점: 4
### 발문
일차방정식 $2x + y - 6 = 0$의 해에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은? [4점]


$$
\begin{aligned}
&\text{ㄱ. } (1, 4)\text{는 이 일차방정식의 해이다.} \\
&\text{ㄴ. } x, y\text{가 자연수일 때, 해는 무수히 많다.} \\
&\text{ㄷ. } x, y\text{의 값의 범위가 수 전체일 때, 해를 나타내는 그래프는 한 점이다.}
\end{aligned}
$$
### 선지
① ㄱ
② ㄴ
③ ㄱ, ㄴ
④ ㄱ, ㄷ
⑤ ㄱ, ㄴ, ㄷ
### 정답
①
### 해설
보기의 각 명제를 판별한다.
ㄱ. $x = 1, y = 4$를 식 $2x + y - 6 = 0$에 대입하면
$$
2(1) + 4 - 6 = 0
$$
이므로 성립한다. 따라서 $(1, 4)$는 해이다. (참)
ㄴ. $y = 6 - 2x$에서 $x, y$가 자연수이어야 하므로
- $x = 1$일 때 $y = 4$ $\implies (1, 4)$
- $x = 2$일 때 $y = 2$ $\implies (2, 2)$
- $x \ge 3$이면 $y \le 0$이 되어 자연수가 아니다.
따라서 자연수인 해는 $2$개뿐이므로 무수히 많다는 설명은 거짓이다.
ㄷ. $x, y$의 범위가 수 전체일 때 해를 좌표평면에 나타내면 한 점이 아니라 '직선'이 된다. (거짓)


따라서 옳은 것은 ㄱ이다.
정답은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 13,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "LINEAR_EQUATION_SOLUTION_SET_ANALYSIS",
  "primaryMethod": "해의 대입 검증, 자연수 해 카운팅, 실수 범위 그래프 연속성을 순차적으로 판별한다.",
  "decisiveStep": "자연수 해 (1, 4), (2, 2) 2개로 유한함 확인 및 그래프가 직선임 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차방정식과 일차함수",
    "l4": "일차방정식의 해와 그래프"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_SOLUTION_SET",
    "templateKey": "TPL_LINEAR_EQ_SOLUTION_DOMAIN_PROPERTIES",
    "why": "수 체계 조건에 따른 일차방정식 해의 개수와 그래프 연속성을 판별하는 유형"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_PLANE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자연수 조건하의 해와 실수 전체에서의 직선 그래프 개념을 구별하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식",
      "해"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "대입",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
일차방정식 $2x + 3y - 6 = 0$의 그래프에 대한 설명으로 옳은 것은? [4점]
### 선지
① $x$절편은 $-3$이다.
② $y = \dfrac{2}{3}x$의 그래프와 평행하다.
③ 제$1$사분면, 제$2$사분면, 제$4$사분면을 지난다.
④ 오른쪽 위로 향하는 직선이다.
⑤ 점 $(3, 2)$를 지난다.
### 정답
③
### 해설
일차방정식 $2x + 3y - 6 = 0$을 $y$에 관하여 풀면
$$
3y = -2x + 6 \implies y = -\frac{2}{3}x + 2
$$
- 기울기는 $-\dfrac{2}{3}$ (음수)이므로 오른쪽 아래로 향한다.
- $x$절편은 $y=0$일 때 $2x = 6 \implies x = 3$이다. (①은 거짓)
- 기울기가 $-\dfrac{2}{3}$이므로 $y = \dfrac{2}{3}x$와 평행하지 않다. (②는 거짓)
- 점 $(3, 2)$를 대입하면 $2(3) + 3(2) - 6 = 6 \ne 0$이므로 지나지 않는다. (⑤는 거짓)
- $x$절편 $3$ (양수), $y$절편 $2$ (양수)이고 기울기가 음수이므로 제$1$, $2$, $4$사분면을 지나고 제$3$사분면은 지나지 않는다. (③은 참)


따라서 정답은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 14,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "LINEAR_EQUATION_GRAPH_PROPERTIES",
  "primaryMethod": "일차방정식을 표준형 일차함수로 변형하여 절편과 기울기 및 사분면을 판정한다.",
  "decisiveStep": "y = -2/3x + 2 로부터 x절편 3, y절편 2로 1, 2, 4분면 통과 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차방정식과 일차함수",
    "l4": "일차방정식의 그래프"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_EQ_GRAPH",
    "templateKey": "TPL_LINEAR_EQUATION_GRAPHICAL_AUDIT",
    "why": "일차방정식을 함수 표준형으로 고쳐 그래프 성질을 검증하는 유형"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_PLANE"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "방정식을 함수형으로 바꾸어 여러 성질을 대조 판정하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "이항"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q15
- 형식: 객관식
- 배점: 3
### 발문
점 $(0, -3)$을 지나고 $x$축에 평행한 직선의 방정식은? [3점]
### 선지
① $x = -3$
② $x = 3$
③ $y = 3$
④ $x + y = -3$
⑤ $y = -3$
### 정답
⑤
### 해설
$x$축에 평행한(또는 $y$축에 수직인) 직선은 모든 점의 $y$좌표가 일정하므로 $y = k$ ($k$는 상수)의 꼴로 나타내어진다.
이 직선이 점 $(0, -3)$을 지나므로 구하는 직선의 방정식은
$$
y = -3
$$
이다.
정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "HORIZONTAL_LINE_EQUATION",
  "primaryMethod": "x축에 평행한 직선의 방정식 y=k에 지나는 점의 y좌표를 대입한다.",
  "decisiveStep": "점 (0, -3)으로부터 y = -3 결정",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "좌표축에 평행한 직선의 방정식",
    "l4": "x축에 평행한 직선의 방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_AXIS_PARALLEL_LINE",
    "templateKey": "TPL_HORIZONTAL_LINE_FROM_POINT",
    "why": "특정 점을 지나고 x축에 평행한 직선의 식을 구하는 기본 유형"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_PLANE"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "x축에 평행한 직선의 형태 y=k를 이해하는 기초 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차방정식",
      "평행"
    ],
    "goal": [
      "일차방정식"
    ],
    "method": [
      "대입"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q16
- 형식: 객관식
- 배점: 3
### 발문
다음 일차방정식 중 순서쌍 $(2, -1)$을 해로 갖는 두 일차방정식으로 짝지어진 것은? [3점]


$$
\begin{aligned}
&\text{(가) } 2x + y = 3 \\
&\text{(나) } x - 3y = 5 \\
&\text{(다) } 3x + 2y = 8 \\
&\text{(라) } x + 2y = 4
\end{aligned}
$$
### 선지
① (가)와 (다)
② (가)와 (나)
③ (나)와 (다)
④ (나)와 (라)
⑤ (다)와 (라)
### 정답
②
### 해설
순서쌍 $(x, y) = (2, -1)$을 각 방정식의 좌변에 대입하여 계산한다.
- (가): $2(2) + (-1) = 4 - 1 = 3$ (참)
- (나): $2 - 3(-1) = 2 + 3 = 5$ (참)
- (다): $3(2) + 2(-1) = 6 - 2 = 4 \ne 8$ (거짓)
- (라): $2 + 2(-1) = 2 - 2 = 0 \ne 4$ (거짓)


따라서 $(2, -1)$을 해로 갖는 두 일차방정식은 (가)와 (나)이다.
정답은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 16,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_BASIC",
  "conceptClusterKey": "SOLUTION_PAIR_EQUATION_MATCHING",
  "primaryMethod": "주어진 순서쌍을 4개 식에 대입하여 등식이 성립하는 조합을 찾는다.",
  "decisiveStep": "(가), (나)에서 등식 성립 확인",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "미지수가 2개인 일차방정식",
    "l4": "일차방정식의 해"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_SOLUTION_MATCH",
    "templateKey": "TPL_EQUATION_PAIR_BY_SOLUTION",
    "why": "공통해를 만족하는 방정식을 역선별하는 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정수 대입 계산을 복수 방정식에 적용하여 판정하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식",
      "해"
    ],
    "goal": [
      "일차방정식"
    ],
    "method": [
      "대입",
      "사칙연산"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q17
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} x - y = -4 \\ 2x + 3y = 7 \end{cases}$의 해는? [4점]
### 선지
① $x = -1,\ y = 3$
② $x = 1,\ y = 5$
③ $x = -2,\ y = 2$
④ $x = 2,\ y = 1$
⑤ $x = -3,\ y = 1$
### 정답
①
### 해설
대입법 또는 가감법을 이용하여 푼다.
첫 번째 식에서
$$
x = y - 4
$$
이를 두 번째 식에 대입하면
$$
2(y - 4) + 3y = 7
$$
$$
2y - 8 + 3y = 7
$$
$$
5y = 15 \implies y = 3
$$
$y = 3$을 $x = y - 4$에 대입하면
$$
x = 3 - 4 = -1
$$
따라서 해는 $x = -1, y = 3$이다.
정답은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 17,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_SOLVE",
  "conceptClusterKey": "LINEAR_SYSTEM_SUBSTITUTION_BASIC",
  "primaryMethod": "x = y - 4로 정리하여 두 번째 식에 대입하여 일차방정식을 푼다.",
  "decisiveStep": "5y = 15에서 y=3, x=-1 도출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식의 풀이",
    "l3": "연립일차방정식의 풀이",
    "l4": "대입법을 이용한 풀이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_SYSTEM_SUBSTITUTION",
    "templateKey": "TPL_LINEAR_SYSTEM_SUBSTITUTION_BASIC",
    "why": "기본 대입법을 활용한 연립방정식 풀이 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대입법의 표준 풀이 과정을 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "연립방정식"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "대입법",
      "이항"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q18
- 형식: 객관식
- 배점: 4.5
### 발문
민지와 수지가 연립방정식 $\begin{cases} ax - y = 4 \\ x + by = -1 \end{cases}$을 푸는데, 민지는 $a$를 잘못 보아 $x = 2, y = -3$을 얻었고, 수지는 $b$를 잘못 보아 $x = 3, y = 2$를 얻었다. 이 연립방정식을 바르게 푼 해는? [4.5점]
### 선지
① $x = 2,\ y = 0$
② $x = -1,\ y = -6$
③ $x = 1,\ y = -2$
④ $x = 3,\ y = 2$
⑤ $x = -2,\ y = 1$
### 정답
③
### 해설
1. 민지는 $a$만 잘못 보았으므로 둘째 식 $x + by = -1$은 올바르게 성립한다.
$x = 2, y = -3$을 둘째 식에 대입하면
$$
2 + b(-3) = -1 \implies -3b = -3 \implies b = 1
$$
2. 수지는 $b$만 잘못 보았으므로 첫째 식 $ax - y = 4$는 올바르게 성립한다.
$x = 3, y = 2$를 첫째 식에 대입하면
$$
a(3) - 2 = 4 \implies 3a = 6 \implies a = 2
$$
3. 바른 연립방정식은
$$
\begin{cases}
2x - y = 4 \quad \cdots\text{㉠} \\
x + y = -1 \quad \cdots\text{㉡}
\end{cases}
$$
두 식을 변끼리 더하면
$$
3x = 3 \implies x = 1
$$
$x = 1$을 ㉡에 대입하면
$$
1 + y = -1 \implies y = -2
$$
따라서 바르게 푼 해는 $x = 1, y = -2$이다.
정답은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 18,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_SOLVE",
  "conceptClusterKey": "WRONGLY_VIEWED_COEFFICIENT_RESTORATION",
  "primaryMethod": "잘못 보지 않은 식에 각각의 해를 대입하여 원래 계수 a, b를 복원한 뒤 연립방정식을 푼다.",
  "decisiveStep": "b=1, a=2 복원 후 2x-y=4, x+y=-1 풀어 x=1, y=-2 도출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식의 풀이",
    "l3": "연립일차방정식의 풀이",
    "l4": "계수를 잘못 보고 푼 문제"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MISREAD_COEFFICIENTS",
    "templateKey": "TPL_MISREAD_COEFFICIENTS_SYSTEM_SOLVE",
    "why": "계수를 잘못 본 조건으로부터 올바른 방정식을 재구성하여 해를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "조건 분기와 계수 역산 및 연립방정식 풀이를 결합한 전형적 활용 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립방정식",
      "해"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "대입",
      "가감법"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q19
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} 0.4x - 0.2y = 0.8 \\ \dfrac{x}{3} + \dfrac{y}{2} = 2 \end{cases}$의 해는? [4점]
### 선지
① $x = 1,\ y = -2$
② $x = 2,\ y = 0$
③ $x = 4,\ y = 4$
④ $x = 3,\ y = 2$
⑤ $x = 5,\ y = 6$
### 정답
④
### 해설
1. 첫 번째 식의 양변에 $10$을 곱한다.
$$
4x - 2y = 8 \implies 2x - y = 4 \quad \cdots\text{㉠}
$$
2. 두 번째 식의 양변에 $6$을 곱한다.
$$
2x + 3y = 12 \quad \cdots\text{㉡}
$$
3. ㉡에서 ㉠을 변끼리 뺀다.
$$
(2x + 3y) - (2x - y) = 12 - 4
$$
$$
4y = 8 \implies y = 2
$$
4. $y = 2$를 ㉠에 대입한다.
$$
2x - 2 = 4 \implies 2x = 6 \implies x = 3
$$
따라서 해는 $x = 3, y = 2$이다.
정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 19,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_SOLVE",
  "conceptClusterKey": "DECIMAL_FRACTION_COEFFICIENT_SYSTEM",
  "primaryMethod": "소수 식과 분수 식을 정수 계수로 변환한 후 가감법으로 해결한다.",
  "decisiveStep": "2x-y=4, 2x+3y=12 로부터 x=3, y=2 산출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식의 풀이",
    "l3": "여러 가지 연립일차방정식",
    "l4": "계수가 소수 또는 분수인 연립방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_DECIMAL_FRACTION",
    "templateKey": "TPL_DECIMAL_FRACTION_COEFFICIENTS_SYSTEM",
    "why": "계수가 소수와 분수인 연립방정식을 정수화하여 푸는 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC",
    "CC_DECIMAL_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정수 계수화 변환과 가감법 풀이 절차를 요구하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립방정식"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "가감법",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q20
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} 2x - y = a \\ bx + y = 5 \end{cases}$의 두 일차방정식의 그래프의 교점의 좌표가 $(1, 3)$일 때, 두 상수 $a, b$에 대하여 $a + b$의 값은? [4점]
### 선지
① $-3$
② $-1$
③ $1$
④ $3$
⑤ $5$
### 정답
③
### 해설
두 일차방정식의 그래프의 교점의 좌표 $(1, 3)$은 연립방정식의 해이다.
1. 첫 번째 식 $2x - y = a$에 $x = 1, y = 3$을 대입하면
$$
2(1) - 3 = a \implies a = -1
$$
2. 두 번째 식 $bx + y = 5$에 $x = 1, y = 3$을 대입하면
$$
b(1) + 3 = 5 \implies b = 2
$$
3. 두 상수의 합은
$$
a + b = -1 + 2 = 1
$$
따라서 정답은 ③이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 20,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "INTERSECTION_POINT_SYSTEM_SOLUTION_SUM",
  "primaryMethod": "두 그래프의 교점이 연립방정식의 해임을 이용하여 미정계수 a, b를 구하고 합산한다.",
  "decisiveStep": "a = -1, b = 2 도출 후 a+b = 1 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "두 일차방정식의 그래프와 연립방정식",
    "l4": "연립방정식의 해와 두 직선의 교점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INTERSECTION_PARAMETERS",
    "templateKey": "TPL_INTERSECTION_COORDINATE_SUBSTITUTION",
    "why": "직선의 교점 좌표를 대입하여 미정계수의 합을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_PLANE"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "교점의 기하학적 의미를 대수적 해로 연결하는 기본 연계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립방정식",
      "일차함수"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "대입",
      "사칙연산"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q21
- 형식: 객관식
- 배점: 5
### 발문
일차방정식 $ax + 3y - 6 = 0$의 그래프가 다음 두 조건을 만족시킬 때, 상수 $a, b$의 순서쌍 $(a, b)$는? [5점]


$$
\begin{aligned}
&\cdot \text{직선 } (b + 1)x - 3y + 2 = 0\text{과 만나지 않는다.} \\
&\cdot \text{직선 } (-b + 5)x + 6y - 12 = 0\text{과 무수히 많은 점에서 만난다.}
\end{aligned}
$$
### 선지
① $a = -2,\ b = 1$
② $a = 4,\ b = -5$
③ $a = -6,\ b = 7$
④ $a = 5,\ b = -6$
⑤ $a = 6,\ b = -7$
### 정답
⑤
### 해설
1. 직선 $(b + 1)x - 3y + 2 = 0$과 만나지 않으려면 두 직선이 평행해야 한다.
$ax + 3y - 6 = 0$의 기울기는 $-\dfrac{a}{3}$이고, $(b + 1)x - 3y + 2 = 0$의 기울기는 $\dfrac{b + 1}{3}$이다.
두 직선의 기울기가 같아야 하므로
$$
-\frac{a}{3} = \frac{b + 1}{3} \implies a = -b - 1 \quad \cdots\text{㉠}
$$
$y$절편은 각각 $2$와 $\dfrac{2}{3}$로 서로 다르므로 평행 조건이 성립한다.


2. 직선 $(-b + 5)x + 6y - 12 = 0$과 무수히 많은 점에서 만나려면 두 직선이 일치해야 한다.
$ax + 3y - 6 = 0$의 양변에 $2$를 곱하면
$$
2ax + 6y - 12 = 0
$$
이 식이 $(-b + 5)x + 6y - 12 = 0$과 완전히 같아야 하므로 $x$의 계수가 같아야 한다.
$$
2a = -b + 5 \quad \cdots\text{㉡}
$$
3. ㉠의 $a = -b - 1$을 ㉡에 대입하면
$$
2(-b - 1) = -b + 5
$$
$$
-2b - 2 = -b + 5 \implies -b = 7 \implies b = -7
$$
$b = -7$을 ㉠에 대입하면
$$
a = -(-7) - 1 = 6
$$
따라서 $a = 6, b = -7$이다.
정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 21,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "PARALLEL_AND_COINCIDENT_LINES_SIMULTANEOUS",
  "primaryMethod": "평행 조건(기울기 일치)과 일치 조건(계수비 일치)을 연립하여 a, b를 구한다.",
  "decisiveStep": "a = -b - 1 과 2a = -b + 5 연립하여 b = -7, a = 6 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "두 일차방정식의 그래프와 연립방정식",
    "l4": "해가 특수한 연립방정식과 두 직선의 위치 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SPECIAL_LINES_CONDITIONS",
    "templateKey": "TPL_PARALLEL_AND_COINCIDENT_SYSTEM",
    "why": "두 직선의 평행과 일치 조건을 결합하여 미정계수를 연립방정식으로 푸는 심화 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행과 일치의 기하학적 위치 관계를 2개의 대수 방정식으로 변환하여 해결하는 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "일차방정식",
      "평행"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "가감법",
      "사칙연산"
    ],
    "condition": [
      "상수",
      "정수"
    ]
  },
  "hold": ""
}
```


## Q22
- 형식: 서술형
- 배점: 6
### 발문
[서술형 1] 주전자에 담긴 물을 가열하면서 $1$분마다 물의 온도를 측정하였더니 아래 표와 같이 온도가 일정하게 상승하였다. 물을 가열하기 시작한 지 $x$분 후의 물의 온도를 $y^\circ\text{C}$라 할 때, 다음 물음에 답하고 그 풀이 과정을 서술하시오. [총 6점]


| $x$ (분) | 0 | 1 | 2 | 3 | 4 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| $y$ ($^\circ\text{C}$) | 10 | 14 | 18 | 22 | 26 |


(1) $x$와 $y$ 사이의 관계식을 구하시오. [3점]
(2) 물의 온도가 $90^\circ\text{C}$가 되는 것은 가열하기 시작한 지 몇 분 후인지 구하시오. [3점]
### 정답
(1) $y = 4x + 10$ / (2) $20$분 후
### 해설
[풀이 과정]
(1) $x$와 $y$ 사이의 관계식 구하기:
가열하기 시작할 때($x = 0$)의 처음 온도가 $10^\circ\text{C}$이므로 $y$절편은 $10$이다.
$x$가 $1$분씩 증가할 때마다 물의 온도 $y$는 $4^\circ\text{C}$씩 일정하게 증가하므로 기울기는 $4$이다.
따라서 $x$와 $y$ 사이의 관계식은
$$
y = 4x + 10
$$
이다.


(2) 온도가 $90^\circ\text{C}$가 되는 시간 구하기:
물의 온도가 $90^\circ\text{C}$이므로 관계식에 $y = 90$을 대입한다.
$$
90 = 4x + 10
$$
$$
4x = 80 \implies x = 20
$$
따라서 물의 온도가 $90^\circ\text{C}$가 되는 것은 가열하기 시작한 지 $20$분 후이다.


답: (1) y = 4x + 10, (2) 20분 후
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 22,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_APPLICATION",
  "conceptClusterKey": "TEMPERATURE_INCREASE_LINEAR_FUNCTION_APPLICATION",
  "primaryMethod": "표에서 초깃값과 단위 시간당 변화율을 읽어 일차함수 식을 세우고 특정 함숫값에 대한 x를 구한다.",
  "decisiveStep": "y = 4x + 10 도출 후 90 = 4x + 10에서 x = 20분 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수의 활용",
    "l3": "일차함수의 활용",
    "l4": "온도에 대한 일차함수의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_TEMPERATURE_LINEAR_MODEL",
    "templateKey": "TPL_TEMPERATURE_TIME_LINEAR_EQUATION",
    "why": "온도 변화 표를 일차함수로 모델링하여 목표 시간에 도달하는 값을 구하는 실생활 서술형 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "초깃값과 기울기를 판독해 식을 작성하고 일차방정식을 푸는 표준 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "일차함수",
      "자연수"
    ],
    "method": [
      "대입",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q23
- 형식: 서술형
- 배점: 7
### 발문
[서술형 2] 현재 형과 동생의 나이의 차는 $6$살이고, $4$년 후에는 형의 나이가 동생의 나이의 $2$배보다 $5$살 적어진다고 한다. 현재 형과 동생의 나이를 각각 구하고, 그 풀이 과정을 서술하시오. [7점]
### 정답
형 13살, 동생 7살
### 해설
[풀이 과정]
1단계: 미지수 설정 및 연립방정식 세우기
현재 형의 나이를 $x$살, 동생의 나이를 $y$살이라 하자 ($x, y$는 자연수, $x > y$).
- 현재 두 사람의 나이의 차가 $6$살이므로
$$
x - y = 6 \quad \cdots\text{㉠}
$$
- $4$년 후 형의 나이는 $(x + 4)$살, 동생의 나이는 $(y + 4)$살이다.
$4$년 후 형의 나이가 동생의 나이의 $2$배보다 $5$살 적어지므로
$$
x + 4 = 2(y + 4) - 5
$$
괄호를 전개하여 정리하면
$$
x + 4 = 2y + 8 - 5
$$
$$
x - 2y = -1 \quad \cdots\text{㉡}
$$


2단계: 연립방정식 풀기
㉠에서 ㉡을 변끼리 뺀다.
$$
(x - y) - (x - 2y) = 6 - (-1)
$$
$$
y = 7
$$
$y = 7$을 ㉠에 대입한다.
$$
x - 7 = 6 \implies x = 13
$$


3단계: 조건 확인 및 결론
현재 형의 나이는 $13$살, 동생의 나이는 $7$살이다.
나이 차는 $13 - 7 = 6$살이고, $4$년 후 형은 $17$살, 동생은 $11$살이므로
$2 \times 11 - 5 = 22 - 5 = 17$이 되어 문제의 조건에 부합한다.


답: 형 13살, 동생 7살
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 23,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_APPLICATION",
  "conceptClusterKey": "AGE_RELATION_LINEAR_SYSTEM",
  "primaryMethod": "현재 나이와 n년 후 나이의 조건을 미지수로 설정하고 연립방정식을 세워 가감법으로 푼다.",
  "decisiveStep": "x - y = 6, x - 2y = -1 연립하여 y=7, x=13 산출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식의 활용",
    "l3": "실생활에 대한 문제",
    "l4": "나이에 대한 문제"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_AGE_WORD_PROBLEM",
    "templateKey": "TPL_AGE_DIFFERENCE_AND_FUTURE_RATIO",
    "why": "나이 차이와 미래 시점의 배수 관계를 연립일차방정식으로 해결하는 대표 서술형 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_EQUATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미지수 정의, 관계식 수립, 가감법 풀이 및 해 검증의 서술형 4단계를 수행하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립방정식",
      "자연수"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "가감법",
      "대입"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q24
- 형식: 서술형
- 배점: 7
### 발문
[서술형 3] 두 직선 $x - 2y + 6 = 0$, $2x + y - 8 = 0$과 $x$축으로 둘러싸인 삼각형의 넓이를 구하고, 그 풀이 과정을 상세히 서술하시오. [7점]
### 정답
20
### 해설
[풀이 과정]
1단계: 두 직선의 $x$절편 구하기 (밑변의 길이)
삼각형의 밑변은 $x$축 위에 있으므로 두 직선의 $x$축과의 교점($x$절편)을 구한다 ($y = 0$ 대입).
- 첫 번째 직선 $x - 2y + 6 = 0$에 $y = 0$을 대입하면
$$
x + 6 = 0 \implies x = -6
$$
따라서 교점의 좌표는 $(-6, 0)$이다.
- 두 번째 직선 $2x + y - 8 = 0$에 $y = 0$을 대입하면
$$
2x - 8 = 0 \implies 2x = 8 \implies x = 4
$$
따라서 교점의 좌표는 $(4, 0)$이다.
그러므로 삼각형의 밑변의 길이는
$$
4 - (-6) = 10
$$
이다.


2단계: 두 직선의 교점의 좌표 구하기 (높이)
두 직선의 교점의 $y$좌표의 절댓값이 삼각형의 높이가 된다.
연립방정식을 세우면
$$
\begin{cases}
x - 2y = -6 \quad \cdots\text{㉠} \\
2x + y = 8 \quad \cdots\text{㉡}
\end{cases}
$$
㉡의 양변에 $2$를 곱하면
$$
4x + 2y = 16 \quad \cdots\text{㉢}
$$
㉠과 ㉢을 변끼리 더하면
$$
5x = 10 \implies x = 2
$$
$x = 2$를 ㉡에 대입하면
$$
2(2) + y = 8 \implies y = 4
$$
따라서 두 직선의 교점의 좌표는 $(2, 4)$이므로, 삼각형의 높이는 $4$이다.


3단계: 삼각형의 넓이 계산
밑변의 길이가 $10$이고 높이가 $4$이므로 삼각형의 넓이는
$$
\text{넓이} = \frac{1}{2} \times 10 \times 4 = 20
$$
이다.


답: 20
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 24,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "TWO_LINES_AND_AXIS_ENCLOSED_AREA",
  "primaryMethod": "두 직선의 x절편으로 밑변 길이를 구하고 연립방정식으로 교점의 y좌표를 구해 삼각형 넓이를 계산한다.",
  "decisiveStep": "밑변 10, 교점 (2, 4)의 y좌표 4를 구해 넓이 1/2 * 10 * 4 = 20 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "두 일차방정식의 그래프와 연립방정식",
    "l4": "두 직선과 좌표축으로 둘러싸인 도형의 넓이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINES_ENCLOSED_AREA",
    "templateKey": "TPL_TWO_LINES_X_AXIS_TRIANGLE_AREA",
    "why": "두 직선과 x축이 이루는 삼각형의 절편과 교점 높이로 넓이를 구하는 대표 서술형 유형"
  },
  "crossConceptKeys": [
    "CC_TRIANGLE_AREA",
    "CC_COORDINATE_PLANE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "절편 계산, 연립방정식 교점 도출, 도형 넓이 산출의 3단계를 순차적으로 서술하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식",
      "삼각형"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "가감법",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```