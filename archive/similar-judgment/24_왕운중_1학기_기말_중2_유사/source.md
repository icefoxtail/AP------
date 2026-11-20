```json:exam
{
  "stem": "24_왕운중_1학기_기말_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1final/24_왕운중_1학기_기말_중2_기출.js",
  "examFolder": "1final",
  "grade": "중2",
  "curriculum": "2015",
  "questionCount": 24,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
함수 $f(x)=4x-5$에 대하여 $f(3)$의 값은? [3점]
### 선지
① 5
② 7
③ 9
④ 11
⑤ 13
### 정답
②
### 해설
함수 $f(x)=4x-5$에 $x=3$을 대입하여 함숫값을 구한다.
$$
f(3) = 4 \times 3 - 5 = 12 - 5 = 7
$$
따라서 정답은 ②이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 1,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "FUNCTION_VALUE_EVALUATION",
  "primaryMethod": "주어진 일차함수 식에 x=3을 대입하여 계산한다.",
  "decisiveStep": "f(3) = 4*3 - 5 = 7 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "함수의 뜻과 함숫값",
    "l4": "함숫값 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FUNCTION_VALUE",
    "templateKey": "TPL_FUNCTION_VALUE_SUBSTITUTION",
    "why": "일차식 형태의 함수에 특정 값을 대입하여 함숫값을 구하는 기본 유형"
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
  "difficultyReason": "일차함수 식에 정수를 단순 대입하는 1단계 기본 연산 문항",
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


## Q02
- 형식: 객관식
- 배점: 3
### 발문
일차방정식 $3x-2y=k$가 $x=4$, $y=1$을 해로 가질 때, 상수 $k$의 값은? [3점]
### 선지
① 4
② 6
③ 8
④ 10
⑤ 12
### 정답
④
### 해설
순서쌍 $(x, y)=(4, 1)$이 일차방정식 $3x-2y=k$의 해이므로 식에 $x=4, y=1$을 대입한다.
$$
3 \times 4 - 2 \times 1 = k
$$
$$
12 - 2 = k \implies k = 10
$$
따라서 상수 $k$의 값은 $10$이고 정답은 ④이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_BASIC",
  "conceptClusterKey": "LINEAR_EQUATION_SOLUTION_SUBSTITUTION",
  "primaryMethod": "주어진 해 (4, 1)을 일차방정식에 대입하여 미정계수 k를 구한다.",
  "decisiveStep": "3*4 - 2*1 = 10 으로부터 k=10 산출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "미지수가 2개인 일차방정식",
    "l4": "일차방정식의 해"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_EQ_SOLUTION",
    "templateKey": "TPL_LINEAR_EQ_CONSTANT_DETERMINATION",
    "why": "주어진 해를 대입하여 미지의 상수를 결정하는 유형"
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
  "difficultyReason": "미지수가 2개인 일차방정식에 해를 대입하여 상수를 구하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차방정식",
      "해"
    ],
    "goal": [
      "식의값"
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
일차함수 $y=4x$의 그래프를 $y$축의 방향으로 $-3$만큼 평행이동하면 일차함수 $y=ax+b$의 그래프가 된다. 이때 $a+b$의 값은? [3점]
### 선지
① 1
② 2
③ 3
④ 4
⑤ 5
### 정답
①
### 해설
일차함수 $y=4x$의 그래프를 $y$축의 방향으로 $-3$만큼 평행이동한 일차함수의 식은
$$
y = 4x - 3
$$
이 식이 $y=ax+b$와 같으므로
$$
a = 4, \quad b = -3
$$
따라서 구하는 값은
$$
a + b = 4 + (-3) = 1
$$
정답은 ①이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 3,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_TRANSLATION",
  "primaryMethod": "y축 방향 평행이동 식 y = 4x - 3을 세우고 계수 a, b를 비교한다.",
  "decisiveStep": "a=4, b=-3으로부터 a+b=1 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프",
    "l4": "일차함수의 그래프의 평행이동"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_TRANSLATION",
    "templateKey": "TPL_LINEAR_TRANSLATION_Y_AXIS",
    "why": "y축 방향 평행이동에 따른 함수식 작성 및 계수 합 계산 유형"
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
  "difficultyReason": "y축 방향 평행이동의 기본 개념을 묻는 1단계 문항",
  "level": "하",
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


## Q04
- 형식: 객관식
- 배점: 3
### 발문
연립방정식 $\begin{cases}x+2y=8\\3x-2y=0\end{cases}$의 해가 $(a, b)$일 때, $a+b$의 값은? [3점]
### 선지
① 1
② 3
③ 5
④ 7
⑤ 9
### 정답
③
### 해설
두 방정식을 변끼리 더하여 $y$를 소거한다.
$$
\begin{aligned}
(x + 2y) + (3x - 2y) &= 8 + 0 \\
4x &= 8 \implies x = 2
\end{aligned}
$$
$x=2$를 첫 번째 식 $x+2y=8$에 대입하면
$$
2 + 2y = 8 \implies 2y = 6 \implies y = 3
$$
따라서 연립방정식의 해는 $(a, b) = (2, 3)$이므로
$$
a + b = 2 + 3 = 5
$$
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
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_BASIC",
  "conceptClusterKey": "LINEAR_SYSTEM_ADDITION_METHOD",
  "primaryMethod": "가감법을 이용하여 두 식을 더해 y를 소거한 후 x, y의 값을 구한다.",
  "decisiveStep": "4x = 8에서 x=2, y=3 산출 후 a+b=5",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "연립일차방정식의 풀이",
    "l4": "가감법을 이용한 풀이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_SYSTEM_ADDITION",
    "templateKey": "TPL_LINEAR_SYSTEM_ADDITION_BASIC",
    "why": "가감법으로 연립방정식의 해를 구하고 해의 합을 구하는 유형"
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
  "difficultyReason": "계수의 부호가 반대인 미지수를 가감법으로 소거하여 연립방정식을 푸는 전형적 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립방정식"
    ],
    "goal": [
      "해",
      "식의값"
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


## Q05
- 형식: 객관식
- 배점: 3
### 발문
다음 보기 중 $y$가 $x$의 함수가 아닌 것은? [3점]
### 선지
① 현재 나이가 12살인 학생의 $x$년 후의 나이 $y$살
② 한 변의 길이가 $x\text{ cm}$인 정사각형의 둘레의 길이 $y\text{ cm}$
③ 시속 $60\text{ km}$로 $x$시간 동안 달린 거리 $y\text{ km}$
④ 넓이가 $24\text{ cm}^2$인 평행사변형의 밑변의 길이 $x\text{ cm}$와 높이 $y\text{ cm}$
⑤ 자연수 $x$의 약수 $y$
### 정답
⑤
### 해설
함수란 $x$의 각 값에 대하여 $y$의 값이 오직 하나씩 대응하는 관계이다.
① $y = x + 12$이므로 $x$의 각 값에 대하여 $y$가 오직 하나로 정해진다. (함수)
② $y = 4x$이므로 $x$의 각 값에 대하여 $y$가 오직 하나로 정해진다. (함수)
③ $y = 60x$이므로 $x$의 각 값에 대하여 $y$가 오직 하나로 정해진다. (함수)
④ $y = \dfrac{24}{x}$이므로 $x$의 각 값에 대하여 $y$가 오직 하나로 정해진다. (함수)
⑤ 자연수 $x=6$일 때 약수는 $1, 2, 3, 6$으로 $y$의 값이 $4$개 존재하므로 오직 하나씩 대응하지 않는다. 따라서 함수가 아니다.


그러므로 함수가 아닌 것은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 5,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "FUNCTION_DEFINITION_JUDGMENT",
  "primaryMethod": "x의 각 값에 대응하는 y의 값이 오직 하나인지 판별한다.",
  "decisiveStep": "자연수 x의 약수는 1개가 아닐 수 있으므로 함수가 아님을 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "함수의 뜻과 함숫값",
    "l4": "함수의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FUNCTION_CONCEPT",
    "templateKey": "TPL_FUNCTION_PROPERTY_JUDGMENT",
    "why": "일상적 상황에서 x에 대응하는 y의 유일성을 판별하는 함수의 기본 개념 유형"
  },
  "crossConceptKeys": [
    "CC_DIVISOR"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "함수의 정의를 바탕으로 다가 대응 여부를 확인하는 기초 개념 문항",
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


## Q06
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y=-\dfrac{1}{2}x+3$의 그래프의 $x$절편을 $a$, $y$절편을 $b$라 할 때, $a+b$의 값은? [4점]
### 선지
① 7
② 9
③ 11
④ 13
⑤ 15
### 정답
②
### 해설
일차함수 $y=-\dfrac{1}{2}x+3$에서
1. $x$절편 $a$는 $y=0$일 때의 $x$의 값이므로
$$
0 = -\frac{1}{2}x + 3 \implies \frac{1}{2}x = 3 \implies x = 6 \implies a = 6
$$
2. $y$절편 $b$는 $x=0$일 때의 $y$의 값이므로
$$
y = -\frac{1}{2}(0) + 3 = 3 \implies b = 3
$$
따라서 구하는 값은
$$
a + b = 6 + 3 = 9
$$
정답은 ②이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_INTERCEPTS",
  "primaryMethod": "y=0을 대입하여 x절편을 구하고 x=0을 대입하여 y절편을 구한 뒤 합한다.",
  "decisiveStep": "a=6, b=3 산출 후 a+b=9 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프",
    "l4": "x절편, y절편"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INTERCEPT",
    "templateKey": "TPL_LINEAR_INTERCEPT_CALCULATION",
    "why": "일차함수의 두 절편을 구하여 연산하는 유형"
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
  "difficultyReason": "x절편과 y절편의 정의를 적용하여 값을 계산하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "x절편",
      "y절편",
      "식의값"
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


## Q07
- 형식: 객관식
- 배점: 4
### 발문
일차부등식 $\dfrac{1}{2}x - \dfrac{x-3}{3} < \dfrac{5}{6}$를 풀면? [4점]
### 선지
① $x < -1$
② $x > -1$
③ $x < 1$
④ $x > 1$
⑤ $x < 3$
### 정답
①
### 해설
분모의 최소공배수인 $6$을 양변에 곱하여 분모를 없앤다.
$$
6 \times \left( \frac{1}{2}x - \frac{x-3}{3} \right) < 6 \times \frac{5}{6}
$$
$$
3x - 2(x - 3) < 5
$$
괄호를 전개하여 동류항을 정리한다.
$$
3x - 2x + 6 < 5
$$
$$
x + 6 < 5
$$
상수항 $6$을 우변으로 이항한다.
$$
x < 5 - 6 \implies x < -1
$$
따라서 부등식의 해는 $x < -1$이며, 정답은 ①이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_SOLVE",
  "conceptClusterKey": "FRACTIONAL_LINEAR_INEQUALITY",
  "primaryMethod": "양변에 분모의 최소공배수 6을 곱해 정수 계수로 바꾼 뒤 이항하여 푼다.",
  "decisiveStep": "3x - 2(x-3) < 5 에서 x < -1 산출",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "복잡한 일차부등식의 풀이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_FRACTION",
    "templateKey": "TPL_INEQUALITY_FRACTION_COEFFICIENT",
    "why": "분수 계수를 포함하는 일차부등식 풀이 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수 계수 정리와 부호 실수를 주의해야 하는 표준 일차부등식 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "이항",
      "사칙연산"
    ],
    "condition": [
      "유리수"
    ]
  },
  "hold": ""
}
```


## Q08
- 형식: 객관식
- 배점: 4
### 발문
보기 중에서 일차함수인 것을 모두 고른 것은? [4점]


$$
\begin{aligned}
&\text{ㄱ. } y = 3x - 1 \\
&\text{ㄴ. } y = 7 \\
&\text{ㄷ. } y = \frac{4}{x} \\
&\text{ㄹ. } y = x(x+2) - x^2
\end{aligned}
$$
### 선지
① ㄱ
② ㄴ
③ ㄱ, ㄷ
④ ㄱ, ㄹ
⑤ ㄴ, ㄹ
### 정답
④
### 해설
일차함수는 $y = ax + b$ ($a, b$는 상수, $a \ne 0$)의 꼴로 나타내어지는 함수이다.
ㄱ. $y = 3x - 1$은 $x$에 대한 일차식이므로 일차함수이다. (참)
ㄴ. $y = 7$은 우변의 $x$의 일차항의 계수가 $0$이므로 일차함수가 아니다. (상수함수) (거짓)
ㄷ. $y = \dfrac{4}{x}$는 분모에 미지수 $x$가 있으므로 다항식이 아니며 일차함수가 아니다. (반비례 관계) (거짓)
ㄹ. $y = x^2 + 2x - x^2 = 2x$이므로 $x$에 대한 일차식이 되어 일차함수이다. (참)


따라서 일차함수인 것은 ㄱ, ㄹ이다.
정답은 ④이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 8,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_IDENTIFICATION",
  "primaryMethod": "식의 우변을 전개 및 정리하여 y = ax + b (a != 0) 꼴인지 확인한다.",
  "decisiveStep": "ㄹ의 이차항 소거 후 일차식 여부 확인 및 분모 미지수 제외",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 뜻과 그래프",
    "l4": "일차함수의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_DEFINITION",
    "templateKey": "TPL_LINEAR_FUNCTION_IDENTIFICATION",
    "why": "다양한 형태의 식에서 일차함수를 판별하는 유형"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_EXPANSION"
  ],
  "conditionKeys": [
    "COND_REAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차항 소거 및 분모 미지수 함정 등을 판별하는 일차함수 식별 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "전개",
      "동류항"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
민우는 총 거리가 $8\text{ km}$인 산책로를 걷는데, 처음에는 시속 $2\text{ km}$로 걷다가 도중에 시속 $4\text{ km}$로 걸어서 총 $3$시간 만에 산책을 마쳤다. 시속 $4\text{ km}$로 걸은 거리는? [4점]
### 선지
① $2\text{ km}$
② $3\text{ km}$
③ $4\text{ km}$
④ $5\text{ km}$
⑤ $6\text{ km}$
### 정답
③
### 해설
시속 $4\text{ km}$로 걸은 거리를 $x\text{ km}$라 하면, 시속 $2\text{ km}$로 걸은 거리는 $(8 - x)\text{ km}$이다.
걸린 시간은 $\dfrac{\text{거리}}{\text{속력}}$이므로
$$
\frac{8 - x}{2} + \frac{x}{4} = 3
$$
양변에 $4$를 곱하여 분모를 없앤다.
$$
2(8 - x) + x = 12
$$
$$
16 - 2x + x = 12
$$
$$
16 - x = 12 \implies x = 4
$$
따라서 시속 $4\text{ km}$로 걸은 거리는 $4\text{ km}$이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_APPLICATION",
  "conceptClusterKey": "SPEED_DISTANCE_TIME_WORD_PROBLEM",
  "primaryMethod": "속력과 거리의 관계식을 세워 총 시간 방정식을 풀이한다.",
  "decisiveStep": "(8-x)/2 + x/4 = 3 으로부터 x=4 산출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식의 활용",
    "l3": "거리, 속력, 시간에 대한 문제",
    "l4": "도중에 속력이 바뀌는 문제"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SPEED_DISTANCE_TIME",
    "templateKey": "TPL_DISTANCE_SPEED_TIME_LINEAR_EQ",
    "why": "구간별 속력 변화에 따른 시간 합 방정식 활용 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거리-속력-시간 관계를 방정식으로 모델링하는 전형적 활용 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거리",
      "속력"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "사칙연산",
      "이항"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q10
- 형식: 객관식
- 배점: 4
### 발문
가로의 길이가 세로의 길이보다 $4\text{ cm}$ 더 긴 직사각형이 있다. 이 직사각형의 둘레의 길이가 $64\text{ cm}$ 이하가 되도록 할 때, 세로의 길이의 최댓값은? [4점]
### 선지
① $10\text{ cm}$
② $11\text{ cm}$
③ $12\text{ cm}$
④ $13\text{ cm}$
⑤ $14\text{ cm}$
### 정답
⑤
### 해설
직사각형의 세로의 길이를 $x\text{ cm}$라 하면, 가로의 길이는 $(x + 4)\text{ cm}$이다.
직사각형의 둘레의 길이는 $2 \times (\text{가로} + \text{세로})$이므로
$$
2\{ (x + 4) + x \} \le 64
$$
$$
2(2x + 4) \le 64
$$
$$
4x + 8 \le 64
$$
양변에서 $8$을 빼면
$$
4x \le 56 \implies x \le 14
$$
따라서 세로의 길이의 최댓값은 $14\text{ cm}$이다.
정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 10,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_APPLICATION",
  "conceptClusterKey": "GEOMETRIC_PERIMETER_INEQUALITY",
  "primaryMethod": "세로를 미지수로 두고 둘레의 길이 공식을 이용하여 부등식을 세운다.",
  "decisiveStep": "2(2x+4) <= 64 로부터 x <= 14 산출",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식의 활용",
    "l3": "도형에 대한 문제",
    "l4": "직사각형의 둘레에 대한 문제"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PERIMETER",
    "templateKey": "TPL_RECTANGLE_PERIMETER_INEQUALITY",
    "why": "도형의 둘레 조건을 일차부등식으로 표현하여 최댓값을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_PERIMETER"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도형의 가로, 세로 관계를 일차부등식으로 세워 해결하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직사각형",
      "둘레"
    ],
    "goal": [
      "최댓값"
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


## Q11
- 형식: 객관식
- 배점: 4
### 발문
$x$절편이 $-3$이고 $y$절편이 $6$인 일차함수의 그래프의 기울기는? [4점]
### 선지
① 1
② 2
③ 3
④ 4
⑤ 6
### 정답
②
### 해설
$x$절편이 $-3$이므로 그래프는 점 $(-3, 0)$을 지나고,
$y$절편이 $6$이므로 그래프는 점 $(0, 6)$을 지난다.
두 점 $(-3, 0)$과 $(0, 6)$을 지나는 직선의 기울기는
$$
\text{기울기} = \frac{6 - 0}{0 - (-3)} = \frac{6}{3} = 2
$$
따라서 기울기는 $2$이며, 정답은 ②이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_SLOPE_FROM_INTERCEPTS",
  "primaryMethod": "x절편과 y절편으로 두 점의 좌표를 찾아 기울기 공식을 적용한다.",
  "decisiveStep": "(6 - 0) / (0 - (-3)) = 2 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프",
    "l4": "기울기 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_SLOPE",
    "templateKey": "TPL_LINEAR_SLOPE_TWO_POINTS",
    "why": "절편을 좌표로 변환하여 기울기를 산출하는 유형"
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
  "difficultyReason": "두 절편으로부터 기울기를 정의에 따라 계산하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "x절편",
      "y절편"
    ],
    "goal": [
      "기울기"
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


## Q12
- 형식: 객관식
- 배점: 4
### 발문
일차방정식 $3x + y - 5 = 0$의 그래프와 평행한 일차함수의 식은? [4점]
### 선지
① $y = 3x - 2$
② $y = \dfrac{1}{3}x + 4$
③ $y = -\dfrac{1}{3}x - 1$
④ $y = -3x + 2$
⑤ $y = -4x + 3$
### 정답
④
### 해설
주어진 일차방정식 $3x + y - 5 = 0$을 $y$에 관하여 풀면
$$
y = -3x + 5
$$
따라서 이 그래프의 기울기는 $-3$이고 $y$절편은 $5$이다.
두 직선이 평행하려면 기울기가 같고 $y$절편은 달라야 하므로, 기울기가 $-3$이고 $y$절편이 $5$가 아닌 일차함수를 찾으면 ④ $y = -3x + 2$이다.


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
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "PARALLEL_LINEAR_EQUATION_REPRESENTATION",
  "primaryMethod": "일차방정식을 일차함수 표준형으로 변형하여 기울기를 구하고 평행 조건을 적용한다.",
  "decisiveStep": "y = -3x + 5로부터 기울기 -3 확인 후 평행한 식 선택",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차방정식과 일차함수",
    "l4": "일차방정식의 그래프의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_PARALLEL_LINES",
    "templateKey": "TPL_PARALLEL_LINE_IDENTIFICATION",
    "why": "일차방정식을 함수 꼴로 정리하여 평행한 직선을 고르는 유형"
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
  "difficultyReason": "일차방정식을 일차함수 형태로 변형하여 평행 관계를 파악하는 표준 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식",
      "평행"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "이항"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q13
- 형식: 객관식
- 배점: 4
### 발문
두 일차함수 $y = \dfrac{a}{3}x + 4$, $y = 2x - b$의 그래프가 일치할 때, 두 상수 $a, b$에 대하여 $a + b$의 값은? [4점]
### 선지
① 2
② 4
③ 6
④ 8
⑤ 10
### 정답
①
### 해설
두 일차함수의 그래프가 일치하려면 기울기와 $y$절편이 각각 서로 같아야 한다.
1. 기울기가 같으므로
$$
\frac{a}{3} = 2 \implies a = 6
$$
2. $y$절편이 같으므로
$$
4 = -b \implies b = -4
$$
따라서 두 상수 $a, b$의 합은
$$
a + b = 6 + (-4) = 2
$$
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
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "COINCIDENT_LINES_CONDITION",
  "primaryMethod": "두 직선의 일치 조건(기울기 동일, y절편 동일)을 연립하여 a, b를 구한다.",
  "decisiveStep": "a/3 = 2에서 a=6, -b=4에서 b=-4 도출 후 합 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "두 일차함수의 그래프의 위치 관계",
    "l4": "두 일차함수의 그래프가 일치할 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_COINCIDENT_LINES",
    "templateKey": "TPL_COINCIDENT_LINES_COEFFICIENTS",
    "why": "두 직선이 일치할 때 미정계수의 값을 결정하는 유형"
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
  "difficultyReason": "두 직선의 일치 조건을 적용하여 계수를 비교하는 문항",
  "level": "중",
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
      "정수"
    ]
  },
  "hold": ""
}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
점 $(-3, 5)$를 지나고, 일차방정식 $x = 1$의 그래프와 평행한 직선의 방정식은? [4점]
### 선지
① $x = 5$
② $y = 5$
③ $x = -3$
④ $y = -3$
⑤ $x = 1$
### 정답
③
### 해설
일차방정식 $x = 1$의 그래프는 점 $(1, 0)$을 지나고 $y$축에 평행한(또는 $x$축에 수직인) 직선이다.
이 직선과 평행한 직선은 $x = k$ ($k$는 상수)의 꼴로 나타내어진다.
이 직선이 점 $(-3, 5)$를 지나므로 $x$좌표가 항상 $-3$이어야 한다.
따라서 구하는 직선의 방정식은
$$
x = -3
$$
정답은 ③이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "VERTICAL_HORIZONTAL_LINE_EQUATION",
  "primaryMethod": "x=1과 평행한 직선의 일반형 x=k를 설정하고 지나는 점의 x좌표를 대입한다.",
  "decisiveStep": "점 (-3, 5)를 지나는 수직선 x = -3 결정",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "좌표축에 평행한 직선의 방정식",
    "l4": "y축에 평행한 직선의 방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_AXIS_PARALLEL_LINE",
    "templateKey": "TPL_VERTICAL_LINE_FROM_POINT",
    "why": "축에 평행한 직선의 방정식을 점의 좌표를 통해 작성하는 유형"
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
  "difficultyReason": "y축에 평행한 직선의 방정식 형태(x=k)를 알고 대입하는 기본 문항",
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


## Q15
- 형식: 객관식
- 배점: 4
### 발문
$x, y$가 자연수일 때, 일차방정식 $2x + 3y = 31$을 만족시키는 순서쌍 $(x, y)$의 개수는? [4점]
### 선지
① 1개
② 2개
③ 3개
④ 4개
⑤ 5개
### 정답
⑤
### 해설
$2x + 3y = 31$에서 $x, y$가 자연수이므로 $x \ge 1, y \ge 1$이다.
$x$에 관하여 식을 정리하면
$$
2x = 31 - 3y
$$
우변 $31 - 3y$는 짝수이어야 하고 양수이어야 한다.
$31$이 홀수이므로 $3y$가 홀수이어야 하며, 따라서 $y$는 홀수 자연수이다.
또한 $2x > 0$이므로 $31 - 3y > 0 \implies 3y < 31 \implies y \le 10$이다.
따라서 가능한 홀수 자연수 $y$의 값은 $1, 3, 5, 7, 9$이다.
각 경우의 $x$의 값을 구하면:
1. $y = 1$일 때: $2x = 31 - 3 = 28 \implies x = 14$ $\implies (14, 1)$
2. $y = 3$일 때: $2x = 31 - 9 = 22 \implies x = 11$ $\implies (11, 3)$
3. $y = 5$일 때: $2x = 31 - 15 = 16 \implies x = 8$ $\implies (8, 5)$
4. $y = 7$일 때: $2x = 31 - 21 = 10 \implies x = 5$ $\implies (5, 7)$
5. $y = 9$일 때: $2x = 31 - 27 = 4 \implies x = 2$ $\implies (2, 9)$


따라서 조건을 만족시키는 순서쌍 $(x, y)$는 총 $5$개이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_BASIC",
  "conceptClusterKey": "NATURAL_SOLUTION_ENUMERATION",
  "primaryMethod": "계수가 큰 미지수 y에 홀수 자연수를 대입하여 자연수 x를 결정한다.",
  "decisiveStep": "y=1, 3, 5, 7, 9에 대응하는 5개의 자연수 해 순서쌍 산출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "미지수가 2개인 일차방정식",
    "l4": "자연수 해 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_NATURAL_SOLUTIONS",
    "templateKey": "TPL_LINEAR_EQ_NATURAL_SOLUTIONS_COUNT",
    "why": "자연수 조건 하에서 일차방정식의 해의 개수를 체계적으로 카운팅하는 유형"
  },
  "crossConceptKeys": [
    "CC_PARITY"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자연수 조건과 홀짝성을 활용하여 부정방정식의 해를 빠짐없이 나열하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식",
      "자연수"
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


## Q16
- 형식: 객관식
- 배점: 5
### 발문
두 상수 $a, b$에 대하여 연립방정식 $\begin{cases} 6x - 4y = 8 \\ ax + 2y = b \end{cases}$의 해가 무수히 많을 때, $ab$의 값은? [5점]
### 선지
① 6
② 12
③ 18
④ -12
⑤ -6
### 정답
②
### 해설
연립방정식 $\begin{cases} 6x - 4y = 8 \\ ax + 2y = b \end{cases}$의 해가 무수히 많으려면 두 일차방정식의 각 미지수의 계수의 비와 상수항의 비가 모두 같아야 한다.
즉,
$$
\frac{6}{a} = \frac{-4}{2} = \frac{8}{b}
$$
여기서 $\dfrac{-4}{2} = -2$이므로
1. $\dfrac{6}{a} = -2 \implies -2a = 6 \implies a = -3$
2. $\dfrac{8}{b} = -2 \implies -2b = 8 \implies b = -4$


따라서 두 상수 $a, b$의 곱은
$$
ab = (-3) \times (-4) = 12
$$
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
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_SOLVE",
  "conceptClusterKey": "INFINITELY_MANY_SOLUTIONS_CONDITION",
  "primaryMethod": "계수비 a1/a2 = b1/b2 = c1/c2 조건을 이용하여 a와 b를 구한다.",
  "decisiveStep": "6/a = -4/2 = 8/b = -2로부터 a=-3, b=-4, ab=12 산출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식의 풀이",
    "l3": "특수한 해를 갖는 연립일차방정식",
    "l4": "해가 무수히 많은 연립방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SPECIAL_SOLUTIONS",
    "templateKey": "TPL_INFINITELY_MANY_SOLUTIONS_COEFFICIENTS",
    "why": "연립방정식의 해가 무수히 많을 조건으로 미정계수의 곱을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_RATIO"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "해가 무수히 많은 연립방정식의 계수비 일치 조건을 적용하는 대표 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립방정식",
      "해"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q17
- 형식: 객관식
- 배점: 5
### 발문
직선 $ax + by + 1 = 0$의 그래프가 제$3$사분면을 지나지 않을 때, 일차함수 $y = ax + b$의 그래프가 지나지 않는 사분면은? [5점]
### 선지
① 제1사분면
② 제2사분면
③ 제3사분면
④ 제4사분면
⑤ 모든 사분면을 지난다.
### 정답
①
### 해설
주어진 직선의 방정식 $ax + by + 1 = 0$을 $y$에 관하여 풀면
$$
by = -ax - 1 \implies y = -\frac{a}{b}x - \frac{1}{b}
$$
이 직선의 그래프가 제$3$사분면을 지나지 않으려면
1. 기울기 $-\dfrac{a}{b} < 0 \implies \dfrac{a}{b} > 0$ (즉, $a$와 $b$는 같은 부호)
2. $y$절편 $-\dfrac{1}{b} > 0 \implies b < 0$


$b < 0$이고 $\dfrac{a}{b} > 0$이므로
$$
a < 0, \quad b < 0
$$
이제 일차함수 $y = ax + b$를 살펴보면
- 기울기 $a < 0$ (음수이므로 오른쪽 아래로 향함)
- $y$절편 $b < 0$ (음수이므로 $y$축의 음의 부분과 만남)


따라서 이 그래프는 제$2$사분면, 제$3$사분면, 제$4$사분면을 지나고, 제$1$사분면은 지나지 않는다.
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
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQ",
  "conceptClusterKey": "LINEAR_GRAPH_QUADRANTS_SIGN_DETERMINATION",
  "primaryMethod": "직선 식을 정리하여 기울기와 y절편의 부호를 도출한 후 y=ax+b의 개형을 판단한다.",
  "decisiveStep": "b < 0, a < 0 도출 후 기울기 음수, y절편 음수이므로 제1사분면 미경유 판정",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차방정식과 일차함수",
    "l4": "직선의 방정식 계수의 부호와 그래프"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_QUADRANT_ANALYSIS",
    "templateKey": "TPL_QUADRANT_SIGN_ANALYSIS_LINEAR",
    "why": "직선의 계수 부호 판정을 통해 다른 일차함수가 지나지 않는 사분면을 찾는 유형"
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
  "difficultyReason": "부호 분석을 거쳐 사분면 통과 여부를 2단계로 추론해야 하는 응용 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "대소비교",
      "이항"
    ],
    "condition": [
      "상수",
      "음수"
    ]
  },
  "hold": ""
}
```


## Q18
- 형식: 객관식
- 배점: 5
### 발문
집에서 $1500\text{ m}$ 떨어진 공원까지 가는데 동생은 걸어서 가고, 형은 동생이 출발한 지 $4$분 후에 킥보드를 타고 출발하였다. 형은 출발한 지 $6$분 만에 공원에 도착하였다. 형과 동생이 집에서 $1000\text{ m}$ 떨어진 지점에서 만났다면, 동생이 공원까지 가는 데 걸린 시간은? [5점]
### 선지
① $18$분
② $16$분
③ $14$분
④ $12$분
⑤ $10$분
### 정답
④
### 해설
1. 형의 속력과 이동 시간:
형은 출발하여 $6$분 만에 $1500\text{ m}$를 이동하였으므로 형의 속력은
$$
\text{형의 속력} = \frac{1500\text{ m}}{6\text{분}} = 250\text{ m/분}
$$
형이 집에서 $1000\text{ m}$ 떨어진 만남 지점까지 가는 데 걸린 시간은
$$
\frac{1000}{250} = 4\text{분}
$$
형은 동생이 출발한 지 $4$분 후에 출발하였으므로, 두 사람이 만난 시각은 동생이 출발한 지
$$
4 + 4 = 8\text{분 후}
$$
이다.


2. 동생의 속력과 총 소요 시간:
동생은 출발한 지 $8$분 만에 $1000\text{ m}$ 지점에 도착하였으므로 동생의 속력은
$$
\text{동생의 속력} = \frac{1000\text{ m}}{8\text{분}} = 125\text{ m/분}
$$
따라서 동생이 공원($1500\text{ m}$)까지 가는 데 걸린 시간은
$$
\frac{1500\text{ m}}{125\text{ m/분}} = 12\text{분}
$$
이다.


따라서 정답은 ④이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_APPLICATION",
  "conceptClusterKey": "SPEED_DISTANCE_LINEAR_FUNCTION_MEETING",
  "primaryMethod": "형의 이동 속력과 만남 시각을 계산하여 동생의 속력 및 총 소요 시간을 구한다.",
  "decisiveStep": "동생의 속력 125 m/분 도출 후 1500/125 = 12분 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수의 활용",
    "l3": "일차함수의 활용",
    "l4": "거리, 속력에 대한 일차함수의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_SPEED",
    "templateKey": "TPL_DISTANCE_TIME_LINEAR_FUNCTION_MEETING",
    "why": "출발 시각 차이가 있는 두 사람의 이동을 분석하여 소요 시간을 계산하는 활용 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "시차 출발과 중간 만남 조건을 단계적으로 추론하여 해결하는 실생활 일차함수 활용 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거리",
      "속력"
    ],
    "goal": [
      "거리"
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


## Q19
- 형식: 객관식
- 배점: 5
### 발문
일차부등식 $3x - a < 0$을 만족시키는 자연수 $x$의 개수가 $2$일 때, 상수 $a$의 값의 범위를 구하면? [5점]
### 선지
① $3 < a \le 6$
② $3 \le a < 6$
③ $6 < a \le 9$
④ $6 \le a < 9$
⑤ $6 < a < 9$
### 정답
③
### 해설
주어진 일차부등식을 풀면
$$
3x < a \implies x < \frac{a}{3}
$$
이 부등식을 만족시키는 자연수 $x$의 개수가 $2$이어야 하므로,
수직선 위에서 $x=1, 2$는 해에 포함되고 $x=3$은 해에 포함되지 않아야 한다.
- $x=2$가 해에 포함되려면 $2 < \dfrac{a}{3}$이어야 한다.
- $x=3$이 해에 포함되지 않으려면 $\dfrac{a}{3} \le 3$이어야 한다. (만약 $\dfrac{a}{3}=3$이면 $x < 3$이므로 자연수 해는 $1, 2$로 여전히 $2$개이다.)


따라서 $\dfrac{a}{3}$의 범위는
$$
2 < \frac{a}{3} \le 3
$$
각 변에 $3$을 곱하면
$$
6 < a \le 9
$$
정답은 ③이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_SOLVE",
  "conceptClusterKey": "INEQUALITY_NATURAL_SOLUTION_COUNT_RANGE",
  "primaryMethod": "x < a/3 에서 자연수 1, 2를 포함하고 3을 배제하는 경계값 부등식을 세운다.",
  "decisiveStep": "2 < a/3 <= 3 으로부터 6 < a <= 9 산출",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "해의 조건이 주어진 일차부등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_INTEGER_COUNT",
    "templateKey": "TPL_INEQUALITY_PARAMETER_RANGE_COUNT",
    "why": "자연수 해의 개수 조건으로부터 부등식 미정계수의 범위를 구하는 고난도 유형"
  },
  "crossConceptKeys": [
    "CC_NUMBER_LINE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "경계값 포함 여부(등호 성립 조건)를 정확히 판별해야 하는 상위 변별력 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "일차부등식",
      "자연수"
    ],
    "goal": [
      "대소비교"
    ],
    "method": [
      "이항",
      "사칙연산"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q20
- 형식: 객관식
- 배점: 5
### 발문
네 직선 $x=1$, $x=5$, $y=3$, $y=7$에 의해 둘러싸인 직사각형 모양의 도형이 있다. 일차함수 $y=ax-1$ ($a\ne0$)의 그래프가 이 직사각형 모양의 도형과 만날 때, 보기에서 옳은 것을 모두 고른 것은? [5점]


$$
\begin{aligned}
&\text{ㄱ. 직사각형 모양의 도형의 넓이는 } 16\text{이다.} \\
&\text{ㄴ. } a\text{의 최댓값을 } m\text{, 최솟값을 } n\text{이라 하면 } m = 10n\text{이다.} \\
&\text{ㄷ. } a=2\text{일 때 } y=ax-1\text{의 그래프는 직사각형 모양의 도형의 넓이를 이등분한다.}
\end{aligned}
$$
### 선지
① ㄱ
② ㄴ
③ ㄱ, ㄴ
④ ㄱ, ㄷ
⑤ ㄱ, ㄴ, ㄷ
### 정답
⑤
### 해설
직사각형의 네 꼭짓점은 $(1, 3), (5, 3), (5, 7), (1, 7)$이다.


ㄱ. 직사각형의 가로의 길이는 $5 - 1 = 4$, 세로의 길이는 $7 - 3 = 4$이므로
$$
\text{넓이} = 4 \times 4 = 16
$$
따라서 ㄱ은 옳다.


ㄴ. 직선 $y = ax - 1$은 항상 점 $(0, -1)$을 지난다.
이 직선이 직사각형과 만나기 위한 기울기 $a$의 범위는
- 점 $(5, 3)$을 지날 때 최소:
$$
3 = 5a - 1 \implies 5a = 4 \implies a = \frac{4}{5} \implies n = \frac{4}{5}
$$
- 점 $(1, 7)$을 지날 때 최대:
$$
7 = 1a - 1 \implies a = 8 \implies m = 8
$$
따라서
$$
10n = 10 \times \frac{4}{5} = 8 = m
$$
이므로 $m = 10n$이 성립한다. 따라서 ㄴ은 옳다.


ㄷ. 직사각형의 중심(두 대각선의 교점)의 좌표는
$$
\left( \frac{1 + 5}{2}, \frac{3 + 7}{2} \right) = (3, 5)
$$
직사각형은 중심에 대하여 점대칭 도형이므로 중심 $(3, 5)$를 지나는 모든 직선은 직사각형의 넓이를 이등분한다.
$a = 2$일 때 일차함수 $y = 2x - 1$에 $x = 3$을 대입하면
$$
y = 2(3) - 1 = 5
$$
이므로 직선은 직사각형의 중심 $(3, 5)$를 지난다.
따라서 이 직선은 직사각형의 넓이를 이등분한다. 그러므로 ㄷ은 옳다.


따라서 옳은 것은 ㄱ, ㄴ, ㄷ이다.
정답은 ⑤이다.
```json:plan
{
  "exempt": true,
  "reason": "STRICT_VARIANT"
}
```
```json:meta
{
  "sourceQid": 20,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_APPLICATION",
  "conceptClusterKey": "RECTANGLE_INTERSECTION_AND_BISECTION",
  "primaryMethod": "꼭짓점 대입으로 기울기 범위를 구하고 직사각형 중심 통과 여부로 넓이 이등분을 판정한다.",
  "decisiveStep": "m=8, n=4/5에서 m=10n 확인 및 중심 (3, 5) 통과 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수의 활용",
    "l3": "일차함수의 그래프와 도형",
    "l4": "도형과 만나는 직선의 기울기의 범위"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_GRAPH_GEOMETRY",
    "templateKey": "TPL_RECTANGLE_SLOPE_RANGE_BISECT",
    "why": "도형과 직선의 위치 관계, 기울기 범위, 넓이 이등분 조건을 종합적으로 묻는 심화 유형"
  },
  "crossConceptKeys": [
    "CC_CENTRAL_SYMMETRY"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "정점(0, -1)을 지나는 직선의 회전, 기울기 극값, 중심 대칭을 통한 이등분 개념을 통합한 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "직사각형",
      "일차함수"
    ],
    "goal": [
      "최댓값",
      "기울기"
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


## Q21
- 형식: 서술형
- 배점: 4
### 발문
연립방정식 $\begin{cases}2x+3y=13\\4x-y=a+1\end{cases}$을 만족시키는 $x$의 값이 $2$일 때, 상수 $a$의 값을 구하고 그 과정을 서술하시오. [4점]
### 정답
4
### 해설
[풀이 과정]
1단계: $x=2$를 첫 번째 일차방정식 $2x + 3y = 13$에 대입한다.
$$
2(2) + 3y = 13
$$
$$
4 + 3y = 13 \implies 3y = 9 \implies y = 3
$$


2단계: 구한 해 $(x, y) = (2, 3)$을 두 번째 일차방정식 $4x - y = a + 1$에 대입한다.
$$
4(2) - 3 = a + 1
$$
$$
8 - 3 = a + 1
$$
$$
5 = a + 1 \implies a = 4
$$


따라서 상수 $a$의 값은 $4$이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-LINEAR_SYSTEM_SOLVE",
  "conceptClusterKey": "GIVEN_ONE_VARIABLE_SOLUTION_DETERMINATION",
  "primaryMethod": "x값을 첫 식에 대입하여 y를 구한 뒤 두 번째 식에 대입하여 a를 구한다.",
  "decisiveStep": "y=3 구한 뒤 8 - 3 = a + 1 에서 a=4 산출",
  "rpm": {
    "majorUnit": "연립일차방정식",
    "midUnit": "연립일차방정식의 풀이",
    "l3": "연립일차방정식의 해의 조건",
    "l4": "한 미지수의 값이 주어진 경우"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_ONE_VARIABLE_GIVEN",
    "templateKey": "TPL_LINEAR_SYSTEM_SUBSTITUTION_PARAMETER",
    "why": "한 미지수의 해가 주어졌을 때 단계적으로 다른 미지수와 상수를 구하는 서술형 유형"
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
  "difficultyReason": "2단계 대입 과정을 논리적으로 서술해야 하는 기본 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립방정식",
      "해"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "대입",
      "사칙연산"
    ],
    "condition": [
      "상수",
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q22
- 형식: 서술형
- 배점: 5
### 발문
일차함수 $y = -\dfrac{2}{3}x + k$의 그래프를 $y$축의 방향으로 $4$만큼 평행이동한 그래프가 점 $(6, 3)$을 지날 때, 상수 $k$의 값을 구하고 그 과정을 서술하시오. [5점]
### 정답
3
### 해설
[풀이 과정]
1단계: 일차함수 $y = -\dfrac{2}{3}x + k$의 그래프를 $y$축의 방향으로 $4$만큼 평행이동한 일차함수의 식을 구한다.
$$
y = -\frac{2}{3}x + k + 4
$$


2단계: 이 그래프가 점 $(6, 3)$을 지나므로 식에 $x = 6, y = 3$을 대입한다.
$$
3 = -\frac{2}{3}(6) + k + 4
$$
$$
3 = -4 + k + 4
$$
$$
3 = k \implies k = 3
$$


따라서 상수 $k$의 값은 $3$이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "TRANSLATED_LINE_POINT_SUBSTITUTION",
  "primaryMethod": "평행이동한 함수식을 작성하고 점의 좌표를 대입하여 미정계수 k를 구한다.",
  "decisiveStep": "3 = -4 + k + 4 로부터 k=3 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 그래프",
    "l4": "평행이동한 그래프가 지나는 점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_TRANSLATION_POINT",
    "templateKey": "TPL_TRANSLATION_POINT_SUBSTITUTION",
    "why": "평행이동된 식에 점을 대입하여 상수를 구하는 서술형 유형"
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
  "difficultyReason": "평행이동 식 작성과 점 대입 과정을 정확히 서술하는 문항",
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
      "대입",
      "사칙연산"
    ],
    "condition": [
      "상수",
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q23
- 형식: 서술형
- 배점: 5
### 발문
일차함수의 그래프가 두 점 $(-2, 1)$, $(3, 11)$을 지날 때, 그 일차함수의 식을 구하고 그 과정을 서술하시오. [5점]
### 정답
$y = 2x + 5$
### 해설
[풀이 과정]
1단계: 두 점 $(-2, 1)$, $(3, 11)$을 지나는 직선의 기울기를 구한다.
$$
\text{기울기 } a = \frac{11 - 1}{3 - (-2)} = \frac{10}{5} = 2
$$


2단계: 기울기가 $2$이므로 구하는 일차함수의 식을 $y = 2x + b$라 한다.
이 그래프가 점 $(3, 11)$을 지나므로 대입하면
$$
11 = 2 \times 3 + b
$$
$$
11 = 6 + b \implies b = 5
$$


따라서 구하는 일차함수의 식은
$$
y = 2x + 5
$$
이다.
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
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "TWO_POINTS_LINEAR_EQUATION_FORMULATION",
  "primaryMethod": "두 점을 이용해 기울기를 구하고 한 점을 대입하여 y절편을 산출한다.",
  "decisiveStep": "기울기 2 도출 후 11 = 6 + b에서 b=5 도출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그래프",
    "l3": "일차함수의 식 구하기",
    "l4": "서로 다른 두 점을 지나는 직선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINE_FROM_TWO_POINTS",
    "templateKey": "TPL_TWO_POINTS_LINEAR_FUNCTION_EQUATION",
    "why": "두 점의 좌표로부터 일차함수의 식을 완성하는 기본 서술형 유형"
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
  "difficultyReason": "기울기와 y절편을 순차적으로 구해 함수식을 작성하는 필수 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "기울기",
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


## Q24
- 형식: 서술형
- 배점: 6
### 발문
어느 미술관의 1인당 입장료는 $5000$원인데, $30$명 이상의 단체 관람객에게는 입장료의 $20\,\%$를 할인해 준다고 한다. $30$명 미만의 모임에서 몇 명 이상부터 $30$명의 단체 입장권을 구입하는 것이 더 유리한지(더 저렴한지) 구하고, 그 과정을 서술하시오. [6점]
### 정답
25명
### 해설
[풀이 과정]
1단계: 미지수 설정 및 비용 표현
입장하려는 학생 수를 $x$명 ($x < 30$, $x$는 자연수)이라 하자.
개인별로 입장권을 구매할 때 지불해야 하는 총 금액은
$$
5000x\text{ (원)}
$$
$30$명 이상의 단체 입장권은 $1$인당 입장료의 $20\,\%$를 할인받으므로
$$
5000 \times \left(1 - \frac{20}{100}\right) = 5000 \times 0.8 = 4000\text{ (원)}
$$
따라서 $30$명의 단체 입장권을 구입하는 총 금액은
$$
4000 \times 30 = 120000\text{ (원)}
$$


2단계: 부등식 세우기 및 풀이
$30$명의 단체 입장권을 구입하는 것이 개인별로 구매하는 것보다 더 유리하려면(금액이 더 적으려면)
$$
120000 < 5000x
$$
양변을 $5000$으로 나누면
$$
x > \frac{120000}{5000} \implies x > 24
$$


3단계: 해의 확인 및 결론
$x$는 자연수이므로 $x \ge 25$이다.
따라서 $25$명 이상부터 $30$명의 단체 입장권을 구입하는 것이 더 유리하다.


답: 25명
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
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_APPLICATION",
  "conceptClusterKey": "GROUP_DISCOUNT_INEQUALITY_APPLICATION",
  "primaryMethod": "개인 구매 금액과 30명 단체 할인 구매 금액을 비교하는 부등식을 세워 최소 인원을 구한다.",
  "decisiveStep": "120000 < 5000x 로부터 x > 24 산출 후 25명 결정",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식의 활용",
    "l3": "실생활에 대한 문제",
    "l4": "단체 입장료에 대한 문제"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_GROUP_DISCOUNT_INEQUALITY",
    "templateKey": "TPL_DISCOUNT_TICKET_INEQUALITY",
    "why": "단체 할인과 개인 지불 비용을 비교하여 유리한 인원을 산출하는 활용 서술형 유형"
  },
  "crossConceptKeys": [
    "CC_PERCENTAGE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "할인율 적용과 부등식 수립 및 정수 조건 해석을 모두 요구하는 고난도 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "일차부등식",
      "자연수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "사칙연산",
      "대소비교"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```