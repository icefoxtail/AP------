```json:exam
{
  "stem": "24_연향중_1학기_기말_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1final/24_연향중_1학기_기말_중2_기출.js",
  "examFolder": "1final",
  "grade": "중2",
  "curriculum": "2015",
  "questionCount": 23,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
다음 중에서 미지수가 $2$개인 일차방정식인 것은? [3점]
### 선지
① $\dfrac{1}{2}x - 2y + 3 = 0$
② $x^2 + 2y = 3x$
③ $4x - y = 2(2x - y) + 1$
④ $3(x - 1) = 2x + 5$
⑤ $2x - 3y = 2x - 3y + 4$
### 정답
①
### 해설
미지수가 $2$개인 일차방정식은 동류항을 모두 이항하여 정리했을 때 $ax + by + c = 0$ ($a, b, c$는 상수, $a \ne 0, b \ne 0$)의 꼴로 나타내어져야 한다.
$$
\begin{aligned}
\text{① } & \frac{1}{2}x - 2y + 3 = 0 \implies x, y\text{의 } 2\text{개의 미지수가 있고 모두 차수가 } 1\text{이므로 미지수가 } 2\text{개인 일차방정식이다. (참)} \\
\text{② } & x^2 + 2y - 3x = 0 \implies x\text{의 최고차수가 } 2\text{이므로 일차방정식이 아니다. (거짓)} \\
\text{③ } & 4x - y = 4x - 2y + 1 \implies y - 1 = 0 \implies x\text{가 소거되어 미지수가 } 1\text{개뿐이다. (거짓)} \\
\text{④ } & 3x - 3 = 2x + 5 \implies x - 8 = 0 \implies 미지수가 } x \text{ } 1\text{개뿐이다. (거짓)} \\
\text{⑤ } & 2x - 3y = 2x - 3y + 4 \implies 0 = 4 \implies 미지수가 모두 소거되어 거짓인 등식이 된다. (거짓)
\end{aligned}
$$
따라서 미지수가 $2$개인 일차방정식인 것은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "미지수가 2개인 일차방정식의 정의 및 판별 기본 문항"
}
```
```json:meta
{
  "sourceQid": 1,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
  "conceptClusterKey": "LINEAR_EQUATION_TWO_VARIABLES_DEFINITION",
  "primaryMethod": "식들을 정리하여 ax+by+c=0(a, b≠0) 꼴이 되는 선지 ①을 식별한다.",
  "decisiveStep": "x, y의 1차항이 모두 보존되는 선지 ① 판정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "미지수가 2개인 일차방정식",
    "l4": "미지수가 2개인 일차방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_EQUATION_TWO_VARS_TEST",
    "templateKey": "TPL_EQUATION_TWO_VARS_TRUE_FALSE",
    "why": "미지수가 2개인 일차방정식의 정의를 충족하는 식을 선별하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_EQUATION_DEFINITION"
  ],
  "conditionKeys": [
    "COND_NONE"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차방정식의 정의를 직접 대조하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차방정식"
    ],
    "goal": [
      "일차방정식"
    ],
    "method": [
      "판정"
    ],
    "condition": [
      "방정식"
    ]
  },
  "hold": ""
}
```


## Q02
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} ax - 3y = 3 \\ 3x + 2y = -1 \end{cases}$ 의 해가 $x = 3, y = b$ 일 때, $ab$의 값을 구하면? (단, $a, b$는 상수) [4점]
### 선지
① $-20$ ② $20$ ③ $-12$ ④ $15$ ⑤ $24$
### 정답
②
### 해설
1단계: $x = 3, y = b$를 두 번째 식 $3x + 2y = -1$에 대입하여 $b$를 구한다.
$$
\begin{aligned}
3(3) + 2b &= -1 \\
9 + 2b &= -1 \\
2b &= -10 \\
b &= -5
\end{aligned}
$$


2단계: 구한 해 $x = 3, y = -5$를 첫 번째 식 $ax - 3y = 3$에 대입하여 $a$를 구한다.
$$
\begin{aligned}
a(3) - 3(-5) &= 3 \\
3a + 15 &= 3 \\
3a &= -12 \\
a &= -4
\end{aligned}
$$


3단계: $ab$의 값을 계산한다.
$$
ab = (-4) \times (-5) = 20
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "연립방정식의 해 대입을 통한 미정계수 산출 및 곱셈 계산 문항"
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
  "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
  "conceptClusterKey": "SYSTEM_EQUATION_SOLUTION_SUBSTITUTION",
  "primaryMethod": "x=3, y=b를 둘째 식에 대입해 b=-5를 얻고, 첫째 식에서 a=-4를 구해 ab=20을 산출한다.",
  "decisiveStep": "b=-5와 a=-4 도출 후 곱 20 계산",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "연립일차방정식의 풀이",
    "l4": "해가 주어진 경우"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_EQUATION_COEFFICIENT_GIVEN_SOLUTION",
    "templateKey": "TPL_SYSTEM_LINEAR_EQUATION_SUBSTITUTION_PRODUCT",
    "why": "연립방정식의 해를 대입하여 두 상수를 순차적으로 구하고 곱하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SUBSTITUTION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "해의 대입을 통해 일차방정식을 2회 풀고 계수곱을 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립일차방정식",
      "해"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "대입",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q03
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} \dfrac{x}{3} - 0.2y = 1.1 \\ \dfrac{x}{6} - \dfrac{y-2}{3} = 2 \end{cases}$ 의 해가 일차방정식 $x - 2y = k$를 만족시킬 때, 상수 $k$의 값은? [4점]
### 선지
① $2$ ② $4$ ③ $6$ ④ $8$ ⑤ $10$
### 정답
④
### 해설
연립방정식의 두 번째 식을 정리하여 $x - 2y$의 형태를 직접 유도한다.
$$
\frac{x}{6} - \frac{y-2}{3} = 2
$$
양변에 분모의 최소공배수인 $6$을 곱한다.
$$
\begin{aligned}
6 \times \left(\frac{x}{6}\right) - 6 \times \left(\frac{y-2}{3}\right) &= 6 \times 2 \\
x - 2(y - 2) &= 12 \\
x - 2y + 4 &= 12 \\
x - 2y &= 12 - 4 \\
x - 2y &= 8
\end{aligned}
$$
연립방정식의 해가 $x - 2y = k$를 만족시키므로
$$
k = 8
$$
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "복잡한 연립방정식 식의 구조적 변형을 통한 식의 값 도출 문항"
}
```
```json:meta
{
  "sourceQid": 3,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
  "conceptClusterKey": "SYSTEM_EQUATION_STRUCTURAL_EVALUATION",
  "primaryMethod": "둘째 식의 양변에 6을 곱해 x-2(y-2)=12로부터 x-2y=8을 얻어 k=8을 확정한다.",
  "decisiveStep": "양변 6 곱셈 후 x-2y=8 구조 도출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "연립일차방정식의 풀이",
    "l4": "복잡한 연립방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_EQUATION_EXPRESSION_EVALUATION",
    "templateKey": "TPL_SYSTEM_LINEAR_COMBINATION_EVAL",
    "why": "연립방정식의 개별 해를 구하지 않고도 식 변형을 통해 특정 일차식의 값을 직접 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수 계수 방정식의 분모 제거 및 식의 구조적 조작을 수행하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립일차방정식"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "방정식",
      "사칙연산",
      "연산"
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
- 배점: 4
### 발문
연립방정식 $\begin{cases} x + 2y = a \\ 4x - by = 28 \end{cases}$ 의 해가 무수히 많을 때, $a - b$의 값을 구하면? (단, $a, b$는 상수) [4점]
### 선지
① $-15$ ② $-1$ ③ $1$ ④ $7$ ⑤ $15$
### 정답
⑤
### 해설
연립방정식의 해가 무수히 많으려면 두 일차방정식의 계수와 상수항의 비가 모두 같아야 한다.
즉, $\dfrac{1}{4} = \dfrac{2}{-b} = \dfrac{a}{28}$ 이 성립해야 한다.


1단계: $b$의 값을 구한다.
$$
\frac{1}{4} = \frac{2}{-b} \implies -b = 4 \times 2 = 8 \implies b = -8
$$


2단계: $a$의 값을 구한다.
$$
\frac{1}{4} = \frac{a}{28} \implies 4a = 28 \implies a = 7
$$


3단계: $a - b$의 값을 계산한다.
$$
a - b = 7 - (-8) = 7 + 8 = 15
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "해가 무수히 많은 연립방정식의 비례 관계를 이용한 계수 결정 및 차 계산 문항"
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
  "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
  "conceptClusterKey": "INFINITE_SOLUTIONS_SYSTEM_LINEAR_EQUATIONS",
  "primaryMethod": "1/4 = 2/(-b) = a/28의 일치 조건에서 b=-8, a=7을 구하고 a-b=15를 계산한다.",
  "decisiveStep": "계수비 일치 조건으로 b=-8, a=7 산출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "연립일차방정식의 풀이",
    "l4": "특수한 해를 갖는 연립방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_EQUATION_INFINITE_SOLUTIONS",
    "templateKey": "TPL_INFINITE_SOLUTIONS_COEFFICIENT_DIFF",
    "why": "해가 무수히 많은 특수한 해 조건에서 미정계수들의 차를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_RATIO_PROPORTION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "비례식을 세워 두 미정계수를 찾고 뺄셈을 수행하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립일차방정식",
      "해"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "방정식",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q05
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} 2x - ay = 4 \\ x - 5y = 6 \end{cases}$ 을 만족시키는 $x$의 값이 $y$의 $2$배일 때, 상수 $a$의 값을 구하면? [4점]
### 선지
① $-6$ ② $-4$ ③ $6$ ④ $8$ ⑤ $10$
### 정답
③
### 해설
$x$의 값이 $y$의 $2$배이므로 다음 관계식이 성립한다.
$$
x = 2y
$$
1단계: $x = 2y$를 두 번째 식 $x - 5y = 6$에 대입한다.
$$
\begin{aligned}
2y - 5y &= 6 \\
-3y &= 6 \\
y &= -2
\end{aligned}
$$
따라서 $x$의 값은
$$
x = 2(-2) = -4
$$


2단계: 구한 해 $x = -4, y = -2$를 첫 번째 식 $2x - ay = 4$에 대입하여 $a$를 구한다.
$$
\begin{aligned}
2(-4) - a(-2) &= 4 \\
-8 + 2a &= 4 \\
2a &= 12 \\
a &= 6
\end{aligned}
$$
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "미지수 간의 비례 조건이 주어진 연립방정식의 미정계수 결정 문항"
}
```
```json:meta
{
  "sourceQid": 5,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
  "conceptClusterKey": "SYSTEM_EQUATION_VARIABLE_RATIO_CONDITION",
  "primaryMethod": "x=2y를 x-5y=6에 대입해 y=-2, x=-4를 얻고 첫째 식에 대입해 a=6을 산출한다.",
  "decisiveStep": "x=2y 대입으로 해 (-4, -2) 확정 및 a=6 계산",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "연립일차방정식의 풀이",
    "l4": "조건이 주어진 경우"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_EQUATION_GIVEN_RATIO_SOLVE",
    "templateKey": "TPL_SYSTEM_LINEAR_VARIABLE_MULTIPLE_COEFF",
    "why": "미지수 간의 배수 조건을 추가 방정식으로 삼아 연립방정식을 풀고 미정계수를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SUBSTITUTION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "비례 조건을 대입법으로 연계하여 해를 구한 뒤 상수를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "연립일차방정식"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "대입",
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q06
- 형식: 객관식
- 배점: 4
### 발문
모양과 크기가 같은 직사각형 모양의 타일 여러 장을 이어 붙이려고 한다. 가로의 길이를 $x\,\mathrm{cm}$, 세로의 길이를 $y\,\mathrm{cm}$라 하자 ($x > y$). 타일을 이어 붙였을 때 다음 두 조건이 성립한다.
- 가로로 $2$장 이어 붙인 길이와 세로로 $3$장 이어 붙인 길이의 차가 $8\,\mathrm{cm}$이다.
- 가로로 $1$장, 세로로 $2$장을 이어 붙인 길이의 합이 $18\,\mathrm{cm}$이다.
이때 직사각형 타일 $1$장의 넓이를 구하면? [4점]
### 선지
① $40\,\mathrm{cm}^2$ ② $36\,\mathrm{cm}^2$ ③ $44\,\mathrm{cm}^2$ ④ $48\,\mathrm{cm}^2$ ⑤ $50\,\mathrm{cm}^2$
### 정답
①
### 해설
1단계: 문제의 조건에 따라 연립방정식을 세운다.
$$
\begin{cases}
2x - 3y = 8 \\
x + 2y = 18
\end{cases}
$$


2단계: 연립방정식을 푼다.
두 번째 식에서 $x = 18 - 2y$를 첫 번째 식에 대입한다.
$$
\begin{aligned}
2(18 - 2y) - 3y &= 8 \\
36 - 4y - 3y &= 8 \\
-7y &= 8 - 36 \\
-7y &= -28 \\
y &= 4
\end{aligned}
$$
$y = 4$를 $x = 18 - 2y$에 대입한다.
$$
x = 18 - 2(4) = 18 - 8 = 10
$$


3단계: 직사각형 타일 $1$장의 넓이를 구한다.
$$
\text{넓이} = x \times y = 10 \times 4 = 40\,\mathrm{cm}^2
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "도형 길이 관계를 연립방정식으로 모델링하여 넓이를 구하는 활용 문항"
}
```
```json:meta
{
  "sourceQid": 6,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
  "conceptClusterKey": "GEOMETRIC_TILE_SYSTEM_EQUATION",
  "primaryMethod": "2x-3y=8과 x+2y=18을 연립하여 x=10, y=4를 구하고 타일 넓이 40을 계산한다.",
  "decisiveStep": "연립방정식 해 (10, 4) 도출 후 넓이 10*4=40 산출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "연립일차방정식의 활용",
    "l4": "도형에 대한 문제"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_EQUATION_GEOMETRY",
    "templateKey": "TPL_RECTANGLE_COMBINATION_SYSTEM_EQUATION",
    "why": "직사각형 배열의 가로, 세로 길이 관계를 연립방정식으로 풀어 도형의 넓이를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PLANE_GEOMETRY_AREA"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도형 조건에서 연립방정식을 세우고 곱셈으로 넓이를 산출하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직사각형",
      "둘레"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "방정식",
      "연립일차방정식",
      "사칙연산"
    ],
    "condition": [
      "직사각형"
    ]
  },
  "hold": ""
}
```


## Q07
- 형식: 객관식
- 배점: 5
### 발문
총 거리가 $8\,\mathrm{km}$인 건강 걷기 대회에 참가하였다. 처음에는 분속 $120\,\mathrm{m}$로 걷다가 도중에 힘이 들어 분속 $80\,\mathrm{m}$로 걸어서 $1$시간 $20$분($80$분) 만에 완주하였다. 이때 분속 $120\,\mathrm{m}$로 걸은 거리는? [5점]
### 선지
① $3600\,\mathrm{m}$ ② $4800\,\mathrm{m}$ ③ $5200\,\mathrm{m}$ ④ $5600\,\mathrm{m}$ ⑤ $6000\,\mathrm{m}$
### 정답
②
### 해설
1단계: 단위를 통일한다.
총 거리: $8\,\mathrm{km} = 8000\,\mathrm{m}$
총 걸린 시간: $1\text{시간 } 20\text{분} = 80\text{분}$


2단계: 미지수를 정하고 연립방정식을 세운다.
분속 $120\,\mathrm{m}$로 걸은 시간을 $x$분, 분속 $80\,\mathrm{m}$로 걸은 시간을 $y$분이라 하면
$$
\begin{cases}
x + y = 80 \\
120x + 80y = 8000
\end{cases}
$$


3단계: 연립방정식을 푼다.
두 번째 식의 양변을 $40$으로 나눈다.
$$
3x + 2y = 200
$$
첫 번째 식의 양변에 $2$를 곱한다.
$$
2x + 2y = 160
$$
두 식을 변끼리 빼면
$$
(3x + 2y) - (2x + 2y) = 200 - 160 \implies x = 40\text{분}
$$


4단계: 분속 $120\,\mathrm{m}$로 걸은 거리를 계산한다.
$$
\text{거리} = 120 \times 40 = 4800\,\mathrm{m}
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "속력·거리·시간 관계를 이용한 연립일차방정식 활용 심화 문항"
}
```
```json:meta
{
  "sourceQid": 7,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-03",
  "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD",
  "conceptClusterKey": "SPEED_DISTANCE_TIME_SYSTEM_EQUATION",
  "primaryMethod": "x+y=80과 120x+80y=8000을 연립해 x=40분을 구하고 거리 120*40=4800m를 산출한다.",
  "decisiveStep": "연립방정식 해 x=40분 도출 및 거리 4800m 계산",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "연립일차방정식의 활용",
    "l4": "거리·속력·시간"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_EQUATION_SPEED_DISTANCE_TIME",
    "templateKey": "TPL_SPEED_CHANGE_TOTAL_DISTANCE_TIME",
    "why": "구간별 속력 변화가 있는 이동 상황에서 연립방정식을 세워 이동 거리를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_SPEED_DISTANCE_TIME"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "단위 변환(km→m)과 속력-시간 방정식을 연계하여 거리를 구하는 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "거리",
      "속력"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "방정식",
      "연립일차방정식",
      "사칙연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q08
- 형식: 객관식
- 배점: 3
### 발문
다음 중에서 $y$가 $x$의 일차함수가 아닌 것은? [3점]
### 선지
① 한 변의 길이가 $x\,\mathrm{cm}$인 정삼각형의 둘레의 길이 $y\,\mathrm{cm}$
② 시속 $70\,\mathrm{km}$로 $x$시간 동안 달린 자동차의 이동 거리 $y\,\mathrm{km}$
③ 한 자루에 $500$원인 볼펜 $x$자루를 사고 $5000$원을 냈을 때의 거스름돈 $y$원
④ 넓이가 $30\,\mathrm{cm}^2$인 평행사변형의 밑변의 길이가 $x\,\mathrm{cm}$일 때, 높이 $y\,\mathrm{cm}$
⑤ $100\,\mathrm{L}$의 물이 담긴 물통에서 매분 $4\,\mathrm{L}$씩 물을 뺄 때, $x$분 후 남아 있는 물의 양 $y\,\mathrm{L}$
### 정답
④
### 해설
각 보기를 $x$와 $y$ 사이의 관계식으로 나타낸다.
$$
\begin{aligned}
\text{① } & y = 3x \implies y = ax + b \text{ 꼴이므로 일차함수이다.} \\
\text{② } & y = 70x \implies y = ax + b \text{ 꼴이므로 일차함수이다.} \\
\text{③ } & y = 5000 - 500x = -500x + 5000 \implies y = ax + b \text{ 꼴이므로 일차함수이다.} \\
\text{④ } & x \times y = 30 \implies y = \frac{30}{x} \implies y\text{가 } x\text{에 반비례하는 함수이므로 일차함수가 아니다. (참)} \\
\text{⑤ } & y = 100 - 4x = -4x + 100 \implies y = ax + b \text{ 꼴이므로 일차함수이다.}
\end{aligned}
$$
따라서 $y$가 $x$의 일차함수가 아닌 것은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "실생활 관계식 작성을 통한 일차함수 정의 식별 문항"
}
```
```json:meta
{
  "sourceQid": 8,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_DEFINITION_AUDIT",
  "primaryMethod": "평행사변형 관계식 y = 30/x가 반비례 함수이므로 일차함수가 아님을 선별한다.",
  "decisiveStep": "y=30/x의 분수함수(반비례) 판정",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 뜻과 그래프",
    "l4": "일차함수의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_IDENTIFICATION",
    "templateKey": "TPL_REAL_WORLD_LINEAR_FUNCTION_AUDIT",
    "why": "실생활 상황을 식으로 나타내어 일차함수 y=ax+b 여부를 판별하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FUNCTION_DEFINITION"
  ],
  "conditionKeys": [
    "COND_NONE"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차함수 정의와 반비례 식을 직접 대조하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차함수",
      "함수"
    ],
    "goal": [
      "일차함수"
    ],
    "method": [
      "판정"
    ],
    "condition": [
      "함수"
    ]
  },
  "hold": ""
}
```


## Q09
- 형식: 객관식
- 배점: 3
### 발문
함수 $f(x) = -\dfrac{18}{x} + 4$ 에 대하여 $3f(9) + f(-3)$의 값을 구하면? [4점]
### 선지
① $8$ ② $10$ ③ $12$ ④ $14$ ⑤ $16$
### 정답
⑤
### 해설
1단계: $f(9)$의 값을 구한다.
$$
f(9) = -\frac{18}{9} + 4 = -2 + 4 = 2
$$


2단계: $f(-3)$의 값을 구한다.
$$
f(-3) = -\frac{18}{-3} + 4 = 6 + 4 = 10
$$


3단계: $3f(9) + f(-3)$의 값을 계산한다.
$$
\begin{aligned}
3f(9) + f(-3) &= 3(2) + 10 \\
&= 6 + 10 \\
&= 16
\end{aligned}
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "함숫값의 정의 및 사칙연산 결합 계산 문항"
}
```
```json:meta
{
  "sourceQid": 9,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "FUNCTION_VALUE_ARITHMETIC_EVALUATION",
  "primaryMethod": "f(9)=2와 f(-3)=10을 구하고 3*2+10=16을 계산한다.",
  "decisiveStep": "f(9)=2, f(-3)=10 도출 후 3f(9)+f(-3)=16 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 뜻과 그래프",
    "l4": "함숫값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FUNCTION_VALUE_EVALUATION",
    "templateKey": "TPL_FUNCTION_VALUE_LINEAR_COMBINATION",
    "why": "주어진 함수식에 특정 값을 대입하여 함숫값의 일차결합을 계산하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SUBSTITUTION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 함숫값을 각각 구한 후 선형 결합을 계산하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "대입",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q10
- 형식: 객관식
- 배점: 3
### 발문
일차함수 $y = \dfrac{3}{4}x - 3$ 의 그래프를 $y$축의 방향으로 $\dfrac{3}{2}$만큼 평행이동한 그래프의 $x$절편을 구하면? [4점]
### 선지
① $-2$ ② $1$ ③ $2$ ④ $3$ ⑤ $4$
### 정답
③
### 해설
1단계: 평행이동한 일차함수의 식을 구한다.
일차함수 $y = \dfrac{3}{4}x - 3$의 그래프를 $y$축의 방향으로 $\dfrac{3}{2}$만큼 평행이동하면
$$
\begin{aligned}
y &= \frac{3}{4}x - 3 + \frac{3}{2} \\
&= \frac{3}{4}x - \frac{6}{2} + \frac{3}{2} \\
&= \frac{3}{4}x - \frac{3}{2}
\end{aligned}
$$


2단계: $x$절편을 구한다.
$x$절편은 그래프가 $x$축과 만나는 점의 $x$좌표이므로 $y = 0$을 대입한다.
$$
\begin{aligned}
0 &= \frac{3}{4}x - \frac{3}{2} \\
\frac{3}{4}x &= \frac{3}{2} \\
x &= \frac{3}{2} \times \frac{4}{3} = 2
\end{aligned}
$$
따라서 $x$절편은 $2$이다.
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "일차함수의 y축 평행이동 및 x절편 산출 문항"
}
```
```json:meta
{
  "sourceQid": 10,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_TRANSLATION_X_INTERCEPT",
  "primaryMethod": "y = (3/4)x - 3/2로 평행이동한 뒤 y=0을 대입하여 x절편 2를 구한다.",
  "decisiveStep": "평행이동식 y=(3/4)x-3/2 도출 및 x절편 2 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 뜻과 그래프",
    "l4": "평행이동"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_TRANSLATION_INTERCEPT",
    "templateKey": "TPL_LINEAR_FUNCTION_Y_SHIFT_X_INTERCEPT",
    "why": "일차함수를 y축으로 평행이동한 후 x절편을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_INTERCEPT"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행이동 식 작성과 일차방정식 풀이를 연결하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수"
    ],
    "goal": [
      "절편"
    ],
    "method": [
      "평행이동",
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q11
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y = ax + b$의 그래프는 일차함수 $y = 2x - 5$의 그래프와 평행하고, 일차함수 $y = \dfrac{2}{3}x - 4$의 그래프와 $x$축 위에서 만난다고 한다. 이때 $a + b$의 값을 구하면? (단, $a, b$는 상수) [4점]
### 선지
① $-10$ ② $-8$ ③ $-6$ ④ $6$ ⑤ $14$
### 정답
①
### 해설
1단계: 기울기 $a$를 구한다.
일차함수 $y = ax + b$의 그래프가 $y = 2x - 5$의 그래프와 평행하므로 기울기가 같다.
$$
a = 2
$$


2단계: $x$축과의 교점을 구한다.
$y = \dfrac{2}{3}x - 4$의 그래프가 $x$축과 만나는 점($x$절편)을 구하기 위해 $y = 0$을 대입한다.
$$
\frac{2}{3}x - 4 = 0 \implies \frac{2}{3}x = 4 \implies x = 4 \times \frac{3}{2} = 6
$$
따라서 교점의 좌표는 $(6, 0)$이다.


3단계: $y$절편 $b$를 구한다.
$y = 2x + b$의 그래프가 점 $(6, 0)$을 지나므로 대입한다.
$$
0 = 2(6) + b \implies 12 + b = 0 \implies b = -12
$$


4단계: $a + b$의 값을 계산한다.
$$
a + b = 2 + (-12) = -10
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "평행 조건(기울기 일치)과 x축 교점을 이용한 일차함수 식 결정 문항"
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
  "conceptClusterKey": "PARALLEL_LINES_AND_X_INTERCEPT",
  "primaryMethod": "평행에서 a=2, x절편 (6, 0) 대입에서 b=-12를 구해 a+b=-10을 산출한다.",
  "decisiveStep": "기울기 a=2와 점 (6, 0) 대입으로 b=-12 도출 후 합 -10 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 그래프의 성질",
    "l4": "평행과 일치"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_PARALLEL_AND_POINT",
    "templateKey": "TPL_LINEAR_FUNCTION_PARALLEL_X_AXIS_MEET",
    "why": "평행 조건에서 기울기를 구하고 다른 직선의 x절편을 지나도록 상수를 정하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PARALLEL_CONDITION",
    "CC_COORDINATE_INTERCEPT"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행 조건과 절편 좌표를 단계별로 결합하여 상수를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수",
      "평행"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "기울기",
      "대입"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q12
- 형식: 객관식
- 배점: 3
### 발문
일차함수 $y = -4x + \dfrac{5}{2}$ 의 그래프에서 $x$의 값이 $3$만큼 감소할 때, $y$의 값은 $k$만큼 증가한다고 한다. 이때 상수 $k$의 값을 구하면? [3점]
### 선지
① $-12$ ② $12$ ③ $7$ ④ $-7$ ⑤ $\dfrac{4}{3}$
### 정답
②
### 해설
일차함수 $y = ax + b$에서 기울기 $a$의 정의는 다음과 같다.
$$
\text{기울기} = \frac{y\text{의 값의 증가량}}{x\text{의 값의 증가량}}
$$
주어진 일차함수의 기울기는 $-4$이다.
$x$의 값이 $3$만큼 감소하므로 $x$의 값의 변화량은 $-3$이다.
$y$의 값의 증가량이 $k$이므로
$$
\frac{k}{-3} = -4
$$
양변에 $-3$을 곱하여 $k$의 값을 구한다.
$$
k = (-4) \times (-3) = 12
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "일차함수의 기울기 정의(x와 y의 변화량의 비)를 이용한 미지수 산출 문항"
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
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "SLOPE_DEFINITION_INCREMENT_RELATION",
  "primaryMethod": "기울기 k/(-3) = -4로부터 k = 12를 구한다.",
  "decisiveStep": "x 감소량(-3)과 기울기(-4)로부터 k=12 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 뜻과 그래프",
    "l4": "기울기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_SLOPE_CALCULATION",
    "templateKey": "TPL_SLOPE_RATIO_VARIABLE_SOLVE",
    "why": "기울기 정의식에 x와 y의 변화량을 대입하여 미지의 증가량을 구하는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_SLOPE_FORMULA"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기울기 정의 공식을 1단계로 적용하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차함수",
      "기울기"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "기울기",
      "사칙연산",
      "연산"
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
세 점 $(-2, -1)$, $(3, k)$, $(5, k+6)$ 이 한 직선 위에 있을 때, 상수 $k$의 값을 구하면? [4점]
### 선지
① $8$ ② $10$ ③ $12$ ④ $14$ ⑤ $16$
### 정답
④
### 해설
세 점이 한 직선 위에 있으므로, 임의의 두 점을 택하여 구한 기울기가 모두 서로 같아야 한다.
1단계: 점 $(3, k)$와 점 $(5, k+6)$을 지나는 직선의 기울기를 구한다.
$$
\text{기울기} = \frac{(k+6) - k}{5 - 3} = \frac{6}{2} = 3
$$


2단계: 점 $(-2, -1)$과 점 $(3, k)$를 지나는 직선의 기울기도 $3$이어야 하므로 식을 세운다.
$$
\begin{aligned}
\frac{k - (-1)}{3 - (-2)} &= 3 \\
\frac{k + 1}{5} &= 3 \\
k + 1 &= 15 \\
k &= 14
\end{aligned}
$$
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "세 점이 한 직선 위에 있을 조건(기울기 일치)을 이용한 미지수 결정 문항"
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
  "conceptClusterKey": "COLLINEAR_POINTS_SLOPE_EQUALITY",
  "primaryMethod": "두 점 (3, k), (5, k+6)의 기울기 3을 구하고 (k+1)/5 = 3에서 k=14를 산출한다.",
  "decisiveStep": "기울기 3 산출 후 (k+1)/5=3에서 k=14 도출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 그래프의 성질",
    "l4": "세 점이 한 직선 위에 있을 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_COLLINEAR_POINTS_SLOPE",
    "templateKey": "TPL_THREE_POINTS_COLLINEAR_PARAMETER_SOLVE",
    "why": "한 직선 위의 세 점 사이의 기울기 동등성을 일차방정식으로 풀어내는 템플릿"
  },
  "crossConceptKeys": [
    "CC_SLOPE_FORMULA"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기울기 공식을 세우고 일차방정식을 풀어 미지수를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직선",
      "좌표"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "기울기",
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
일차방정식 $2x + ky - 4k = 0$ 의 그래프가 점 $(3, -2)$를 지날 때, 이 그래프가 $x$축과 만나는 점의 좌표를 구하면? (단, $k$는 상수) [4점]
### 선지
① $(0, 2)$ ② $(0, 4)$ ③ $(1, 0)$ ④ $(4, 0)$ ⑤ $(2, 0)$
### 정답
⑤
### 해설
1단계: 점 $(3, -2)$를 일차방정식 $2x + ky - 4k = 0$에 대입하여 $k$의 값을 구한다.
$$
\begin{aligned}
2(3) + k(-2) - 4k &= 0 \\
6 - 2k - 4k &= 0 \\
6 - 6k &= 0 \\
6k &= 6 \\
k &= 1
\end{aligned}
$$


2단계: $k = 1$을 대입하여 일차방정식을 완성한다.
$$
2x + y - 4 = 0
$$


3단계: 그래프가 $x$축과 만나는 점의 좌표를 구한다.
$x$축 위의 점은 $y = 0$이므로 대입한다.
$$
2x - 4 = 0 \implies 2x = 4 \implies x = 2
$$
따라서 $x$축과 만나는 점의 좌표는 $(2, 0)$이다.
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "지나는 점을 통한 미정계수 결정 및 x축 교점(x절편) 좌표 산출 문항"
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
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
  "conceptClusterKey": "LINEAR_EQUATION_POINT_SUBSTITUTION_INTERCEPT",
  "primaryMethod": "점 (3, -2) 대입으로 k=1을 구하고 2x+y-4=0에서 y=0일 때 x=2를 찾아 (2, 0)을 산출한다.",
  "decisiveStep": "k=1 결정 및 x축 교점 좌표 (2, 0) 도출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차함수와 일차방정식의 관계",
    "l4": "일차방정식의 그래프"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_EQUATION_COEFF_AND_INTERCEPT",
    "templateKey": "TPL_LINEAR_EQUATION_SUBSTITUTE_THEN_INTERCEPT",
    "why": "점의 좌표를 대입해 미정계수를 찾고 축과의 교점 좌표를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_INTERCEPT"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "점 대입을 통한 상수 결정과 절편 좌표 계산의 2단계를 거치는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식",
      "좌표"
    ],
    "goal": [
      "좌표"
    ],
    "method": [
      "대입",
      "방정식"
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
- 배점: 5
### 발문
직사각형 $ABCD$에서 가로 $BC = 12\,\mathrm{cm}$, 세로 $AB = 8\,\mathrm{cm}$이다. 점 $P$가 점 $B$를 출발하여 점 $C$를 향해 변 $BC$ 위를 매초 $2\,\mathrm{cm}$의 속력으로 움직이고 있다. 점 $P$가 점 $B$를 출발한 지 $x$초 후에 사다리꼴 $APCD$의 넓이가 $64\,\mathrm{cm}^2$가 된다고 할 때, $x$의 값을 구하면? [5점]
### 선지
① $2$ ② $3$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
③
### 해설
1단계: $x$초 후 선분의 길이를 $x$에 대한 식으로 나타낸다.
점 $P$가 매초 $2\,\mathrm{cm}$로 움직이므로
$$
BP = 2x\,\mathrm{cm}
$$
변 $BC = 12\,\mathrm{cm}$이므로 선분 $PC$의 길이는
$$
PC = 12 - 2x\,\mathrm{cm}
$$


2단계: 사다리꼴 $APCD$의 넓이를 구하는 관계식을 세운다.
윗변 $AD = 12\,\mathrm{cm}$, 아랫변 $PC = (12 - 2x)\,\mathrm{cm}$, 높이 $CD = 8\,\mathrm{cm}$이므로
$$
\begin{aligned}
\text{사다리꼴 } APCD\text{의 넓이} &= \frac{1}{2} \times (AD + PC) \times CD \\
&= \frac{1}{2} \times \{12 + (12 - 2x)\} \times 8 \\
&= 4 \times (24 - 2x) \\
&= 96 - 8x
\end{aligned}
$$


3단계: 사다리꼴의 넓이가 $64\,\mathrm{cm}^2$가 되는 $x$를 구한다.
$$
\begin{aligned}
96 - 8x &= 64 \\
-8x &= 64 - 96 \\
-8x &= -32 \\
x &= 4
\end{aligned}
$$
따라서 점 $P$가 출발한 지 $4$초 후이다.
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "도형 위를 움직이는 점에 따른 사다리꼴 넓이의 일차함수 모델링 및 방정식 문항"
}
```
```json:meta
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
  "conceptClusterKey": "MOVING_POINT_GEOMETRIC_AREA_FUNCTION",
  "primaryMethod": "PC=12-2x를 이용해 사다리꼴 넓이 96-8x=64를 세우고 x=4를 산출한다.",
  "decisiveStep": "넓이 식 96-8x=64 수립 및 x=4 도출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차함수와 일차방정식의 관계",
    "l4": "도형에의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_MOVING_POINT_AREA",
    "templateKey": "TPL_MOVING_POINT_TRAPEZOID_AREA_EQUATION",
    "why": "움직이는 점의 이동 거리를 변수로 하여 사다리꼴 넓이 식을 세우고 특정 넓이가 되는 시간을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PLANE_GEOMETRY_AREA"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "동점의 위치에 따른 선분 길이 식을 구성하고 넓이 공식을 연계하여 방정식을 푸는 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "직사각형",
      "속력"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "방정식",
      "넓이"
    ],
    "condition": [
      "직사각형"
    ]
  },
  "hold": ""
}
```


## Q16
- 형식: 객관식
- 배점: 4
### 발문
일차방정식 $4x + 3y - 12 = 0$ 의 그래프에 대한 설명으로 옳은 것은? [4점]
### 선지
① $x$절편은 $3$이고, $y$절편은 $4$이다.
② 점 $(3, 4)$를 지난다.
③ 제$4$사분면을 지나지 않는다.
④ $x$의 값이 증가하면 $y$의 값도 증가한다.
⑤ 일차함수 $y = \dfrac{4}{3}x$의 그래프를 $y$축의 방향으로 $4$만큼 평행이동한 것이다.
### 정답
①
### 해설
일차방정식을 $y$에 대하여 정리하여 일차함수의 꼴로 나타낸다.
$$
3y = -4x + 12 \implies y = -\frac{4}{3}x + 4
$$
각 선지의 설명을 검토한다.
$$
\begin{aligned}
\text{① } & x\text{절편: } y = 0 \implies -\frac{4}{3}x + 4 = 0 \implies x = 3 \\
& y\text{절편: } x = 0 \implies y = 4 \\
& \text{따라서 } x\text{절편은 } 3\text{이고, } y\text{절편은 } 4\text{이다. (참)} \\
\text{② } & x = 3, y = 4\text{를 대입하면 } 4(3) + 3(4) - 12 = 12 \ne 0\text{이므로 점 } (3, 4)\text{를 지나지 않는다. (거짓)} \\
\text{③ } & \text{기울기가 } -\frac{4}{3} < 0\text{이고 } y\text{절편이 } 4 > 0\text{이므로 제}1, 2, 4\text{사분면을 지나고 제}3\text{사분면을 지나지 않는다. (거짓)} \\
\text{④ } & \text{기울기가 음수이므로 } x\text{의 값이 증가하면 } y\text{의 값은 감소한다. (거짓)} \\
\text{⑤ } & y = -\frac{4}{3}x\text{의 그래프를 } y\text{축 방향으로 } 4\text{만큼 평행이동한 것이다. (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "일차방정식 그래프의 절편, 사분면, 증가감소, 평행이동 성질 종합 판정 문항"
}
```
```json:meta
{
  "sourceQid": 16,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
  "conceptClusterKey": "LINEAR_EQUATION_PROPERTIES_AUDIT",
  "primaryMethod": "식 y=-(4/3)x+4로 정리하여 x절편 3, y절편 4임을 확인해 선지 ①을 확정한다.",
  "decisiveStep": "x절편 3과 y절편 4 계산 및 일치 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차함수와 일차방정식의 관계",
    "l4": "일차방정식의 그래프"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_EQUATION_PROPERTIES_CHECK",
    "templateKey": "TPL_LINEAR_EQUATION_GRAPH_PROPERTIES_AUDIT",
    "why": "일차방정식을 일차함수 형태로 고쳐 기울기, 절편, 사분면 성질을 종합 검토하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_INTERCEPT"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차방정식의 그래프의 다각적 성질을 선지별로 대조하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식"
    ],
    "goal": [
      "절편",
      "사분면"
    ],
    "method": [
      "기울기",
      "평행이동"
    ],
    "condition": [
      "직선"
    ]
  },
  "hold": ""
}
```


## Q17
- 형식: 객관식
- 배점: 4
### 발문
두 점 $(2a - 3, 5)$ 와 $(4a + 5, a)$ 를 지나는 직선이 $y$축에 평행할 때, 상수 $a$의 값을 구하면? [4점]
### 선지
① $-6$ ② $-4$ ③ $-2$ ④ $2$ ⑤ $4$
### 정답
②
### 해설
$y$축에 평행한 직선은 $x = k$ ($k$는 상수)의 꼴로 나타내어지며, 이 직선 위의 모든 점은 $x$좌표가 서로 같다.
따라서 두 점 $(2a - 3, 5)$와 $(4a + 5, a)$의 $x$좌표를 같다고 놓고 방정식을 푼다.
$$
\begin{aligned}
2a - 3 &= 4a + 5 \\
2a - 4a &= 5 + 3 \\
-2a &= 8 \\
a &= -4
\end{aligned}
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "y축 평행 직선(x=k)의 성질을 이용한 미정계수 결정 문항"
}
```
```json:meta
{
  "sourceQid": 17,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
  "conceptClusterKey": "PARALLEL_TO_AXIS_EQUATION",
  "primaryMethod": "y축 평행 직선 위의 점은 x좌표가 같으므로 2a-3 = 4a+5에서 a=-4를 구한다.",
  "decisiveStep": "2a-3 = 4a+5 수립 및 a=-4 산출",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차함수와 일차방정식의 관계",
    "l4": "x=p, y=q의 그래프"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINE_PARALLEL_TO_AXIS_POINTS",
    "templateKey": "TPL_POINTS_PARALLEL_TO_AXIS_PARAMETER_SOLVE",
    "why": "좌표축에 평행한 직선 위의 두 점의 좌표 관계를 방정식으로 해결하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PARALLEL_CONDITION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "축 평행 직선의 좌표 특징을 이해하고 일차방정식을 세워 해결하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직선",
      "좌표",
      "평행"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q18
- 형식: 객관식
- 배점: 5
### 발문
두 일차함수 $y = -x + 4$ 와 $y = \dfrac{1}{2}x + 1$ 의 그래프와 $x$축으로 둘러싸인 삼각형의 넓이를 구하면? [5점]
### 선지
① $3$ ② $4$ ③ $5$ ④ $6$ ⑤ $8$
### 정답
④
### 해설
1단계: 두 직선의 교점의 좌표를 구한다.
$$
\begin{aligned}
-x + 4 &= \frac{1}{2}x + 1 \\
양변에 } 2\text{를 곱하면 } -2x + 8 &= x + 2 \\
-3x &= -6 \\
x &= 2
\end{aligned}
$$
$x = 2$를 $y = -x + 4$에 대입하면
$$
y = -2 + 4 = 2
$$
따라서 두 직선의 교점의 좌표는 $(2, 2)$이다.
이 교점의 $y$좌표인 $2$가 삼각형의 높이가 된다.


2단계: 두 직선의 $x$절편을 각각 구한다.
- $y = -x + 4$에서 $y = 0$이면 $x = 4$이다. 즉 점 $(4, 0)$
- $y = \dfrac{1}{2}x + 1$에서 $y = 0$이면 $\dfrac{1}{2}x = -1 \implies x = -2$이다. 즉 점 $(-2, 0)$


3단계: 삼각형의 밑변의 길이를 구한다.
$x$축 위의 두 교점 사이의 거리이므로
$$
\text{밑변} = 4 - (-2) = 6
$$


4단계: 삼각형의 넓이를 계산한다.
$$
\text{넓이} = \frac{1}{2} \times \text{밑변} \times \text{높이} = \frac{1}{2} \times 6 \times 2 = 6
$$
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "두 일차함수의 교점 및 x절편을 이용한 삼각형 넓이 산출 문항"
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
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
  "conceptClusterKey": "TWO_LINES_AXIS_ENCLOSED_AREA",
  "primaryMethod": "교점 (2, 2)와 x절편 4, -2로부터 밑변 6, 높이 2를 얻어 넓이 (1/2)*6*2=6을 산출한다.",
  "decisiveStep": "교점 (2, 2) 및 x절편 -2, 4 도출 후 넓이 6 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차함수와 일차방정식의 관계",
    "l4": "두 일차방정식의 그래프와 넓이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_TWO_LINES_AXIS_TRIANGLE_AREA",
    "templateKey": "TPL_TWO_LINEAR_FUNCTIONS_X_AXIS_AREA",
    "why": "두 일차함수와 x축의 교점들로 이루어진 삼각형의 넓이를 연립방정식과 절편으로 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_INTERCEPT",
    "CC_PLANE_GEOMETRY_AREA"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "교점 연립과 두 절편 계산, 밑변-높이 도형 넓이 공식을 종합 수행하는 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "일차함수",
      "좌표"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "교점",
      "절편",
      "사칙연산"
    ],
    "condition": [
      "직선"
    ]
  },
  "hold": ""
}
```


## Q19
- 형식: 객관식
- 배점: 5
### 발문
두 일차방정식 $x - y = -4$ 와 $ax + 2y = 10$ 의 그래프의 교점의 좌표가 $(-1, b)$ 일 때, $a + b$의 값을 구하면? (단, $a, b$는 상수) [5점]
### 선지
① $-7$ ② $-5$ ③ $-3$ ④ $1$ ⑤ $-1$
### 정답
⑤
### 해설
1단계: 교점 $(-1, b)$를 첫 번째 식 $x - y = -4$에 대입하여 $b$를 구한다.
$$
\begin{aligned}
-1 - b &= -4 \\
-b &= -4 + 1 \\
-b &= -3 \\
b &= 3
\end{aligned}
$$
따라서 두 직선의 교점의 좌표는 $(-1, 3)$이다.


2단계: 교점 $(-1, 3)$을 두 번째 식 $ax + 2y = 10$에 대입하여 $a$를 구한다.
$$
\begin{aligned}
a(-1) + 2(3) &= 10 \\
-a + 6 &= 10 \\
-a &= 4 \\
a &= -4
\end{aligned}
$$


3단계: $a + b$의 값을 계산한다.
$$
a + b = -4 + 3 = -1
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "두 일차방정식의 교점 성질을 이용한 미정계수 연쇄 결정 문항"
}
```
```json:meta
{
  "sourceQid": 19,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION",
  "conceptClusterKey": "TWO_LINES_INTERSECTION_PARAMETERS",
  "primaryMethod": "(-1, b)를 x-y=-4에 대입해 b=3을 얻고 ax+2y=10에 대입해 a=-4를 구해 a+b=-1을 산출한다.",
  "decisiveStep": "교점 (-1, 3) 확정 및 a=-4 산출 후 a+b=-1 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 일차방정식",
    "l3": "일차함수와 일차방정식의 관계",
    "l4": "두 일차방정식의 교점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_TWO_LINES_INTERSECTION_POINT_PARAMETERS",
    "templateKey": "TPL_INTERSECTION_POINT_UNKNOWN_COEFF_SUM",
    "why": "두 직선의 교점 좌표가 주어졌을 때 각 식에 순차 대입하여 미정계수들의 합을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SUBSTITUTION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "교점을 첫 식에 대입해 y좌표를 찾고 둘째 식에 대입해 계수를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차방정식",
      "교점"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "대입",
      "방정식"
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
일차함수 $y = ax + b$의 그래프가 제$1$, $3$, $4$사분면을 지날 때, 일차함수 $y = -\dfrac{a}{b}x + ab$ 의 그래프의 개형으로 옳은 것은? (단, $a, b$는 상수) [5점]
### 선지
① 기울기가 음수이고 $y$절편이 양수인 직선 (제$1$, $2$, $4$사분면)
② 기울기가 음수이고 $y$절편이 음수인 직선 (제$2$, $3$, $4$사분면)
③ 기울기가 양수이고 $y$절편이 음수인 직선 (제$1$, $3$, $4$사분면)
④ 기울기가 양수이고 $y$절편이 양수인 직선 (제$1$, $2$, $3$사분면)
⑤ $x$축에 평행한 직선
### 정답
③
### 해설
1단계: $a$와 $b$의 부호를 판정한다.
일차함수 $y = ax + b$의 그래프가 제$1$, $3$, $4$사분면을 지나므로
- 오른쪽 위로 향하므로 기울기 $a > 0$이다.
- $y$축의 음의 부분과 만나므로 $y$절편 $b < 0$이다.


2단계: 새 일차함수 $y = -\dfrac{a}{b}x + ab$의 기울기와 $y$절편의 부호를 확인한다.
- 기울기: $a > 0, b < 0$이므로 $\dfrac{a}{b} < 0$이다.
  따라서 기울기는 $-\dfrac{a}{b} > 0$ (양수)이다.
- $y$절편: $ab$에서 양수와 음수의 곱이므로 $ab < 0$ (음수)이다.


3단계: 그래프의 개형 및 지나는 사분면을 판단한다.
기울기가 양수이므로 오른쪽 위로 향하고, $y$절편이 음수이므로 $y$축의 음의 부분에서 만난다.
따라서 제$1$, $3$, $4$사분면을 지나는 직선이다.
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "사분면 통과 조건으로부터 계수 부호 추론 및 새 일차함수 개형 판정 문항"
}
```
```json:meta
{
  "sourceQid": 20,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-04",
  "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC",
  "conceptClusterKey": "LINEAR_FUNCTION_QUADRANTS_SIGN_ANALYSIS",
  "primaryMethod": "y=ax+b가 1, 3, 4사분면을 지나므로 a>0, b<0이고, 새 함수의 기울기 -a/b>0, y절편 ab<0을 판정한다.",
  "decisiveStep": "a>0, b<0 판정 및 새 함수 기울기 양수, y절편 음수 확인",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 그래프의 성질",
    "l4": "그래프가 지나는 사분면"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_QUADRANT_SIGN_PREDICTION",
    "templateKey": "TPL_QUADRANTS_SIGN_TRANSFORM_GRAPH_SHAPE",
    "why": "사분면 정보로 계수의 부호를 찾고 복합 부호가 적용된 새 일차함수의 개형을 예측하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_QUADRANT_SIGNS"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "그래프의 기하적 위치에서 대수 부호를 역추적하고 다시 기하 개형으로 전환하는 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "일차함수",
      "사분면"
    ],
    "goal": [
      "기울기",
      "절편"
    ],
    "method": [
      "판정"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q21
- 형식: 서술형
- 배점: 7
### 발문
[서술형 1번]
민재와 서아가 연립방정식 $\begin{cases} ax + 2y = 5 \\ 3x - by = 4 \end{cases}$ 를 푸는데, 민재는 $a$를 잘못 보고 풀어 $x = 2, y = 1$을 얻었고, 서아는 $b$를 잘못 보고 풀어 $x = 3, y = -2$를 얻었다. 다음 물음에 답하시오. (단, $a, b$는 상수) [7점]
(1) 두 수 $a$와 $b$의 값을 각각 구하시오. [4점]
(2) 처음 연립방정식의 해를 바르게 구하시오. [3점]
### 정답
(1) $a = 3, b = 2$
(2) $x = \dfrac{3}{2}, y = \dfrac{1}{4}$
### 해설
(1) 두 상수 $a, b$의 값을 구한다.
민재는 $a$를 잘못 보았으므로 두 번째 식 $3x - by = 4$는 바르게 보았다.
$x = 2, y = 1$을 대입하면
$$
\begin{aligned}
3(2) - b(1) &= 4 \\
6 - b &= 4 \\
b &= 2
\end{aligned}
$$
서아는 $b$를 잘못 보았으므로 첫 번째 식 $ax + 2y = 5$는 바르게 보았다.
$x = 3, y = -2$를 대입하면
$$
\begin{aligned}
a(3) + 2(-2) &= 5 \\
3a - 4 &= 5 \\
3a &= 9 \\
a &= 3
\end{aligned}
$$
따라서 $a = 3, b = 2$이다.


(2) 처음 연립방정식을 바르게 푼다.
$a = 3, b = 2$를 대입하면 원래의 연립방정식은
$$
\begin{cases}
3x + 2y = 5 \quad \cdots \text{㉠} \\
3x - 2y = 4 \quad \cdots \text{㉡}
\end{cases}
$$
㉠과 ㉡을 변끼리 더한다.
$$
(3x + 2y) + (3x - 2y) = 5 + 4 \implies 6x = 9 \implies x = \frac{9}{6} = \frac{3}{2}
$$
$x = \dfrac{3}{2}$를 ㉠에 대입한다.
$$
3\left(\frac{3}{2}\right) + 2y = 5 \implies \frac{9}{2} + 2y = 5 \implies 2y = 5 - \frac{9}{2} = \frac{1}{2} \implies y = \frac{1}{4}
$$
따라서 처음 연립방정식의 해는 $x = \dfrac{3}{2}, y = \dfrac{1}{4}$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "잘못 보고 푼 연립방정식 역추적 및 원래 연립방정식 해법 서술형 문항"
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
  "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION",
  "conceptClusterKey": "MISTAKEN_COEFFICIENT_RECOVERY_SYSTEM",
  "primaryMethod": "민재 해를 둘째 식에 대입해 b=2, 서아 해를 첫째 식에 대입해 a=3을 얻고 3x+2y=5, 3x-2y=4를 풀어 해를 산출한다.",
  "decisiveStep": "b=2, a=3 산출 후 연립방정식 가감법으로 x=3/2, y=1/4 도출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "연립일차방정식",
    "l3": "연립일차방정식의 풀이",
    "l4": "잘못 보고 푼 경우"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SYSTEM_EQUATION_MISTAKEN_COEFF_SOLVE",
    "templateKey": "TPL_SYSTEM_LINEAR_MISTAKEN_COEFFICIENTS_RECOVERY",
    "why": "각자가 바르게 본 방정식에 각각의 해를 대입하여 원래 계수를 복원하고 바른 해를 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SUBSTITUTION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "오류 정보를 분리하여 계수를 복원한 뒤 연립방정식을 다시 푸는 다단계 서술형 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "연립일차방정식",
      "해"
    ],
    "goal": [
      "해",
      "상수"
    ],
    "method": [
      "대입",
      "가감법",
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q22
- 형식: 서술형
- 배점: 6
### 발문
[서술형 2번]
어느 저수지에서 오늘 정오에 수문을 열어 $600\,\mathrm{t}$의 물을 방류한 후 수문을 닫았고, 오후 2시부터 다시 수문을 열어 $15$분마다 $40\,\mathrm{t}$의 물을 일정하게 방류한다고 한다. 오후 2시부터 $x$시간이 지났을 때, 오늘 정오부터 방류한 물의 전체 양을 $y\,\mathrm{t}$라 하자. 다음 물음에 답하시오. [6점]
(1) $y$를 $x$에 대한 식으로 나타내시오. [3점]
(2) 오늘 정오부터 방류한 물의 전체 양이 $1400\,\mathrm{t}$가 되는 시각은 오후 몇 시 몇 분인지 구하시오. [3점]
### 정답
(1) $y = 160x + 600$
(2) 오후 7시
### 해설
(1) $y$를 $x$에 대한 식으로 나타낸다.
$15$분마다 $40\,\mathrm{t}$의 물을 방류하므로, $1$시간($60$분) 동안 방류하는 물의 양은
$$
40 \times \frac{60}{15} = 40 \times 4 = 160\,\mathrm{t}
$$
따라서 오후 2시부터 $x$시간 동안 방류한 물의 양은 $160x\,\mathrm{t}$이다.
오늘 정오에 이미 방류한 물 $600\,\mathrm{t}$이 있으므로, 오늘 정오부터 방류한 물의 전체 양 $y\,\mathrm{t}$는 다음과 같다.
$$
y = 160x + 600
$$


(2) 전체 방류량이 $1400\,\mathrm{t}$가 되는 시각을 구한다.
$y = 1400$을 (1)의 식에 대입한다.
$$
\begin{aligned}
160x + 600 &= 1400 \\
160x &= 800 \\
x &= \frac{800}{160} = 5
\end{aligned}
$$
따라서 오후 2시부터 $5$시간이 지난 시각이므로
$$
\text{오후 } 2\text{시} + 5\text{시간} = \text{오후 } 7\text{시}
$$
그러므로 구하는 시각은 오후 7시이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "실생활 시간별 물 방류량을 일차함수식으로 표현하고 특정 시각을 도출하는 서술형 문항"
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
  "conceptClusterKey": "LINEAR_FUNCTION_WATER_FLOW_MODELING",
  "primaryMethod": "시간당 160톤 변화율로 y=160x+600을 세우고, y=1400에서 x=5를 구해 오후 7시를 산출한다.",
  "decisiveStep": "관계식 y=160x+600 도출 및 x=5시간 후 오후 7시 결정",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 활용",
    "l4": "수량 변화"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_FUNCTION_RATE_OF_CHANGE_APPLICATION",
    "templateKey": "TPL_RATE_TIME_LINEAR_FUNCTION_SOLVE",
    "why": "단위 시간당 변화율을 기울기로 삼아 일차함수식을 모델링하고 특정 함숫값에 도달하는 시각을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_REAL_WORLD_MATH"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "시간당 변화율 계산 후 초기값을 더해 함수식을 세우고 역산하는 2단계 서술형 문항",
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
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```


## Q23
- 형식: 서술형
- 배점: 7
### 발문
[서술형 3번]
$48\,\mathrm{L}$, $30\,\mathrm{L}$의 물이 각각 들어 있는 두 물통 $A, B$에서 일정한 속력으로 동시에 물이 빠져나가고 있다. 물이 빠지기 시작한 지 $x$분 후에 물통에 남아 있는 물의 양을 $y\,\mathrm{L}$라 할 때, 물통 $A$는 $6$분 만에 물이 모두 빠졌고, 물통 $B$는 $15$분 만에 물이 모두 빠졌다. 다음 물음에 답하시오. [7점]
(1) 물통 $A$에 대하여 $x$와 $y$ 사이의 관계식을 구하시오. [2점]
(2) 물통 $B$에 대하여 $x$와 $y$ 사이의 관계식을 구하시오. [2점]
(3) 물이 빠지기 시작한 지 몇 분 후에 두 물통 $A, B$에 남아 있는 물의 양이 같아지는지 구하시오. [3점]
### 정답
(1) $y = -8x + 48$
(2) $y = -2x + 30$
(3) $3$분 후
### 해설
(1) 물통 $A$의 관계식을 구한다.
물이 빠지기 전($x = 0$) 물의 양은 $48\,\mathrm{L}$이므로 $y$절편은 $48$이고, $6$분 후 물이 모두 빠졌으므로 점 $(6, 0)$을 지난다.
$$
\text{기울기} = \frac{0 - 48}{6 - 0} = -8
$$
따라서 물통 $A$의 관계식은
$$
y = -8x + 48
$$


(2) 물통 $B$의 관계식을 구한다.
물이 빠지기 전($x = 0$) 물의 양은 $30\,\mathrm{L}$이므로 $y$절편은 $30$이고, $15$분 후 물이 모두 빠졌으므로 점 $(15, 0)$을 지난다.
$$
\text{기울기} = \frac{0 - 30}{15 - 0} = -2
$$
따라서 물통 $B$의 관계식은
$$
y = -2x + 30
$$


(3) 두 물통에 남아 있는 물의 양이 같아지는 시간을 구한다.
두 식의 $y$값이 같으므로 방정식을 세운다.
$$
\begin{aligned}
-8x + 48 &= -2x + 30 \\
-8x + 2x &= 30 - 48 \\
-6x &= -18 \\
x &= 3
\end{aligned}
$$
따라서 물이 빠지기 시작한 지 $3$분 후에 두 물통에 남아 있는 물의 양이 같아진다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "두 일차함수 그래프의 관계식 수립 및 교점(동일 수량 도달 시각) 도출 서술형 문항"
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
  "conceptClusterKey": "TWO_LINEAR_DRAINAGE_FUNCTIONS_INTERSECTION",
  "primaryMethod": "절편으로부터 y=-8x+48, y=-2x+30을 도출하고 연립방정식 -8x+48=-2x+30을 풀어 x=3분 후를 산출한다.",
  "decisiveStep": "직선식 y=-8x+48, y=-2x+30 수립 및 교점 x=3분 계산",
  "rpm": {
    "majorUnit": "일차함수",
    "midUnit": "일차함수와 그 그래프",
    "l3": "일차함수의 활용",
    "l4": "그래프의 해석"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_TWO_LINEAR_FUNCTIONS_INTERSECTION_WORD",
    "templateKey": "TPL_TWO_RATES_DECREASE_EQUAL_TIME",
    "why": "두 선형 감소 관계식을 각각 구하고 두 양이 같아지는 시점을 연립방정식으로 해결하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_COORDINATE_INTERCEPT"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 일차함수의 식을 절편을 이용하여 유도하고 교점의 x좌표를 구하는 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수",
      "좌표"
    ],
    "goal": [
      "일차함수",
      "식의값"
    ],
    "method": [
      "기울기",
      "절편",
      "방정식"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```