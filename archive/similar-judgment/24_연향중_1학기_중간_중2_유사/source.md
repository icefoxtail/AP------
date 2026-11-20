```json:exam
{
  "stem": "24_연향중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/24_연향중_1학기_중간_중2_기출.js",
  "examFolder": "1mid",
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
분수 $\dfrac{7}{54}$을 순환소수로 나타내었을 때, 순환마디를 구하면? [3점]
### 선지
① $296$ ② $962$ ③ $629$ ④ $129$ ⑤ $2962$
### 정답
①
### 해설
분수 $\dfrac{7}{54}$을 나눗셈하여 순환소수로 나타낸다.
$$
7 \div 54 = 0.1296296296\dots
$$
소수점 아래 첫째 자리 $1$ 다음부터 $296$이 끝없이 되풀이된다.
$$
\frac{7}{54} = 0.1\dot{2}9\dot{6}
$$
따라서 순환마디는 되풀이되는 가장 짧은 한 부분인 $296$이다.
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "분수의 순환소수 나눗셈 변환을 통한 순환마디 식별 기본 문항"
}
```
```json:meta
{
  "sourceQid": 1,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_FIND_PERIOD",
  "primaryMethod": "7/54 = 0.1(296)으로 직접 나눗셈하여 되풀이되는 최소 순환마디 296을 구한다.",
  "decisiveStep": "순환마디 296 식별",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_FIND_PERIOD",
    "templateKey": "TPL_FRACTION_TO_REPEATING_PERIOD",
    "why": "분수를 소수로 전개하여 순환마디를 정확히 찾아내는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NONE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직접 나눗셈을 통해 순환하는 숫자 배열을 확인하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "분수"
    ],
    "goal": [
      "순환소수"
    ],
    "method": [
      "사칙연산",
      "연산"
    ],
    "condition": [
      "소수"
    ]
  },
  "hold": ""
}
```


## Q02
- 형식: 객관식
- 배점: 4
### 발문
순환소수를 분수로 나타낼 때, $1000x - 10x$를 이용하는 것이 가장 편리한 것은? [4점]
### 선지
① $2.\dot{3}\dot{7}$ ② $0.5\dot{2}\dot{8}$ ③ $1.\dot{4}1\dot{6}$ ④ $3.4\dot{7}$ ⑤ $0.12\dot{5}$
### 정답
②
### 해설
$x$에 $10$의 거듭제곱을 곱하여 소수점 아래 순환마디의 숫자 배열을 완전히 일치시켜 뺀다.
$1000x - 10x$를 이용한다는 것은 다음과 같은 구조를 갖는다.
- $1000x$: 소수점 아래 셋째 자리까지 순환마디가 끝나므로 소수점을 오른쪽으로 $3$자리 이동시킨다.
- $10x$: 소수점 아래 첫째 자리는 순환하지 않으므로 소수점을 오른쪽으로 $1$자리 이동시켜 순환마디 바로 앞에 맞춘다.
따라서 소수점 아래 첫째 자리는 비순환이고, 둘째와 셋째 자리가 순환마디인 $0.a\dot{b}\dot{c}$ 꼴이어야 한다.
$$
\begin{aligned}
\text{① } & x = 2.\dot{3}\dot{7} \implies 100x - x \\
\text{② } & x = 0.5\dot{2}\dot{8} \implies 1000x = 528.2828\dots, \quad 10x = 5.2828\dots \implies 1000x - 10x \text{ (참)} \\
\text{③ } & x = 1.\dot{4}1\dot{6} \implies 1000x - x \\
\text{④ } & x = 3.4\dot{7} \implies 100x - 10x \\
\text{⑤ } & x = 0.12\dot{5} \implies 1000x - 100x
\end{aligned}
$$
그러므로 가장 편리한 식은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "순환마디 자릿수 구조에 따른 분수 변환 최적 10의 거듭제곱 뺄셈식 판정 문항"
}
```
```json:meta
{
  "sourceQid": 2,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_CONVERSION_STRATEGY",
  "primaryMethod": "소수 셋째 자리까지 순환하고 첫째 자리가 비순환인 0.5(2)(8)에 1000x-10x가 대응됨을 확인한다.",
  "decisiveStep": "순환마디 위치 분석으로 1000x-10x 최적 순환소수 식별",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_TO_FRACTION_EQ",
    "templateKey": "TPL_REPEATING_FRACTION_EQUATION_CHOICE",
    "why": "순환마디의 시작과 끝 자릿수에 맞추어 10의 거듭제곱 식을 매칭하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DECIMAL_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_DECIMAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자릿수 이동 원리와 순환마디의 위치 관계를 분석하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "방정식",
      "연산"
    ],
    "condition": [
      "소수"
    ]
  },
  "hold": ""
}
```


## Q03
- 형식: 객관식
- 배점: 4
### 발문
다음 보기의 분수 중 순환소수로 나타낼 수 있는 것은 모두 몇 개인가? [4점]


$$\dfrac{21}{70}, \quad \dfrac{14}{2 \times 3^{2} \times 7}, \quad \dfrac{35}{2^{2} \times 5^{2} \times 7}, \quad \dfrac{15}{2^{3} \times 3 \times 11}, \quad \dfrac{20}{75}$$
### 선지
① $0$개 ② $1$개 ③ $2$개 ④ $3$개 ⑤ $4$개
### 정답
④
### 해설
기약분수로 약분한 후 분모를 소인수분해했을 때, $2$ 또는 $5$ 이외의 소인수가 남아 있으면 순환소수이다.
$$
\begin{aligned}
\text{1) } & \frac{21}{70} = \frac{3}{10} = \frac{3}{2 \times 5} \implies \text{분모 소인수 } 2, 5 \implies \text{유한소수} \\
\text{2) } & \frac{14}{2 \times 3^2 \times 7} = \frac{14}{14 \times 3^2} = \frac{1}{3^2} \implies \text{분모에 소인수 } 3\text{이 남으므로 순환소수 (1)} \\
\text{3) } & \frac{35}{2^2 \times 5^2 \times 7} = \frac{35}{2^2 \times 25 \times 7} = \frac{5 \times 7}{2^2 \times 5^2 \times 7} = \frac{1}{2^2 \times 5} \implies \text{분모 소인수 } 2, 5 \implies \text{유한소수} \\
\text{4) } & \frac{15}{2^3 \times 3 \times 11} = \frac{3 \times 5}{2^3 \times 3 \times 11} = \frac{5}{2^3 \times 11} \implies \text{분모에 소인수 } 11\text{이 남으므로 순환소수 (2)} \\
\text{5) } & \frac{20}{75} = \frac{4}{15} = \frac{4}{3 \times 5} \implies \text{분모에 소인수 } 3\text{이 남으므로 순환소수 (3)}
\end{aligned}
$$
따라서 순환소수로 나타낼 수 있는 분수는 $3$개이다.
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "기약분수 소인수 분석을 통한 순환소수 개수 카운팅 문항"
}
```
```json:meta
{
  "sourceQid": 3,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_COUNTING",
  "primaryMethod": "5개의 분수를 기약분수로 약분하여 분모에 2, 5 외의 소인수가 남는 3개를 카운팅한다.",
  "decisiveStep": "1/3^2, 5/(2^3*11), 4/(3*5)의 3개 선별",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_COUNT",
    "templateKey": "TPL_REPEATING_DECIMAL_COLLECTION_COUNT",
    "why": "여러 분수 목록에서 순환소수가 되는 것의 총 개수를 세는 템플릿"
  },
  "crossConceptKeys": [
    "CC_REDUCING_FRACTION"
  ],
  "conditionKeys": [
    "COND_IRREDUCIBLE"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "약분과 소인수분해를 5개 분수에 대해 체계적으로 수행하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "분수",
      "기약분수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "소인수분해",
      "약수"
    ],
    "condition": [
      "소인수"
    ]
  },
  "hold": ""
}
```


## Q04
- 형식: 객관식
- 배점: 4
### 발문
어떤 기약분수를 소수로 나타내는데 유진이는 분모를 잘못 보아 $0.\dot{4}\dot{7}$이라 하였고, 태호는 분자를 잘못 보아 $0.\dot{5}\dot{4}$라 하였다. 처음 기약분수를 순환소수로 바르게 나타내면? [4점]
### 선지
① $4.\dot{2}$ ② $4.\dot{7}$ ③ $4.2\dot{7}$ ④ $4.\dot{7}\dot{2}$ ⑤ $4.\dot{2}\dot{7}$
### 정답
⑤
### 해설
1단계: 유진이가 잘못 본 순환소수를 기약분수로 나타낸다.
$$
0.\dot{4}\dot{7} = \frac{47}{99}
$$
$47$은 소수이므로 $\dfrac{47}{99}$은 기약분수이다.
유진이는 분모를 잘못 보았으므로 원래 기약분수의 분자는 $47$이다.


2단계: 태호가 잘못 본 순환소수를 기약분수로 나타낸다.
$$
0.\dot{5}\dot{4} = \frac{54}{99} = \frac{6}{11}
$$
태호는 분자를 잘못 보았으므로 원래 기약분수의 분모는 $11$이다.


3단계: 처음 기약분수를 구하고 순환소수로 나타낸다.
$$
\text{처음 기약분수} = \frac{47}{11}
$$
이를 소수로 나타내면
$$
\frac{47}{11} = 4.272727\dots = 4.\dot{2}\dot{7}
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "오류 보고 역추적을 통한 기약분수 복원 및 순환소수 변환 문항"
}
```
```json:meta
{
  "sourceQid": 4,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FRACTION_RECONSTRUCTION_FROM_REPEATING_DECIMAL",
  "primaryMethod": "0.(47)=47/99에서 분자 47, 0.(54)=6/11에서 분모 11을 추출하여 47/11 = 4.(2)(7)을 산출한다.",
  "decisiveStep": "바른 분수 47/11 확정 후 순환소수 4.(2)(7) 변환",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "조건을 만족하는 유리수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_RECONSTRUCT_FRACTION",
    "templateKey": "TPL_MISTAKEN_REPEATING_DECIMAL_FRACTION_RECOVERY",
    "why": "두 사람이 각각 분모와 분자를 잘못 본 순환소수로부터 원래 기약분수를 복원하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_REDUCING_FRACTION"
  ],
  "conditionKeys": [
    "COND_IRREDUCIBLE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환소수 분수 변환과 기약분수 역추적, 순환소수 재변환의 3단계를 수행하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수",
      "기약분수"
    ],
    "goal": [
      "순환소수"
    ],
    "method": [
      "사칙연산",
      "연산"
    ],
    "condition": [
      "기약분수"
    ]
  },
  "hold": ""
}
```


## Q05
- 형식: 객관식
- 배점: 4
### 발문
분수 $\dfrac{2}{7}$를 소수로 나타낼 때, 소수점 아래 40번째 숫자를 $a$, 60번째 숫자를 $b$라 하자. 이때 $a+b$의 값은? [4점]
### 선지
① $7$ ② $9$ ③ $11$ ④ $13$ ⑤ $15$
### 정답
③
### 해설
분수 $\dfrac{2}{7}$를 나눗셈하여 순환소수로 나타낸다.
$$
2 \div 7 = 0.285714285714\dots = 0.\dot{2}8571\dot{4}
$$
순환마디는 $285714$로 숫자의 개수는 $6$개이다.


1단계: 소수점 아래 $40$번째 숫자 $a$를 구한다.
$40$을 순환마디의 길이 $6$으로 나눈 나머지를 계산한다.
$$
40 = 6 \times 6 + 4
$$
나머지가 $4$이므로 $a$는 순환마디 $285714$의 $4$번째 숫자인 $7$이다.
$$
a = 7
$$


2단계: 소수점 아래 $60$번째 숫자 $b$를 구한다.
$60$을 순환마디의 길이 $6$으로 나눈 나머지를 계산한다.
$$
60 = 6 \times 10 + 0
$$
나누어떨어지므로 $b$는 순환마디 $285714$의 마지막($6$번째) 숫자인 $4$이다.
$$
b = 4
$$


3단계: $a+b$의 값을 계산한다.
$$
a + b = 7 + 4 = 11
$$
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "분수의 순환마디 주기성을 이용한 다중 특정 자릿수 결정 및 합산 문항"
}
```
```json:meta
{
  "sourceQid": 5,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_DIGIT_CYCLE_SUM",
  "primaryMethod": "2/7 = 0.(285714)에서 40=6*6+4로 a=7, 60=6*10으로 b=4를 구해 a+b=11을 산출한다.",
  "decisiveStep": "a=7, b=4 도출 후 합 11 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_DIGIT_CYCLE",
    "templateKey": "TPL_REPEATING_DECIMAL_NTH_DIGIT_ARITHMETIC",
    "why": "순환마디의 주기성과 나머지 연산을 통해 두 자릿수 값의 합을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DIVISION_REMAINDER"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "나머지 계산을 두 번 적용하여 자릿수를 결정하고 합산하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "분수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "사칙연산",
      "연산",
      "자릿수"
    ],
    "condition": [
      "순환소수"
    ]
  },
  "hold": ""
}
```


## Q06
- 형식: 객관식
- 배점: 4
### 발문
다음 중 계산이 옳은 것은? [4점]
### 선지
① $\left(a^{4}\right)^{3} = a^{12}$ ② $a^{3} \times a^{5} = a^{15}$ ③ $a^{8} \div a^{4} = a^{2}$ ④ $a^{6} \div a^{6} = 0$ ⑤ $\left(2a^{2}b\right)^{3} = 6a^{6}b^{3}$
### 정답
①
### 해설
지수법칙을 각 선지에 적용하여 계산 결과를 검증한다.
$$
\begin{aligned}
\text{① } & (a^4)^3 = a^{4 \times 3} = a^{12} \text{ (참)} \\
\text{② } & a^3 \times a^5 = a^{3+5} = a^8 \ne a^{15} \text{ (거짓)} \\
\text{③ } & a^8 \div a^4 = a^{8-4} = a^4 \ne a^2 \text{ (거짓)} \\
\text{④ } & a^6 \div a^6 = 1 \ne 0 \text{ (거짓)} \\
\text{⑤ } & (2a^2 b)^3 = 2^3 \times (a^2)^3 \times b^3 = 8a^6 b^3 \ne 6a^6 b^3 \text{ (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "거듭제곱의 거듭제곱 및 지수법칙 기본 연산 규칙 진위 판정 문항"
}
```
```json:meta
{
  "sourceQid": 6,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "EXPONENT_LAWS_BASIC_RULES",
  "primaryMethod": "(a^4)^3 = a^(4*3) = a^12의 거듭제곱 공식 일치성을 식별한다.",
  "decisiveStep": "거듭제곱의 거듭제곱 지수곱 a^12 확인",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_LAW_AUDIT",
    "templateKey": "TPL_EXPONENT_LAWS_TRUE_FALSE_SET",
    "why": "기본 지수법칙 공식의 정확한 전개를 점검하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_MONOMIAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "지수법칙의 기본 공식을 선지별로 대조하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "단항식",
      "거듭제곱"
    ],
    "goal": [
      "단항식"
    ],
    "method": [
      "지수법칙"
    ],
    "condition": [
      "단항식"
    ]
  },
  "hold": ""
}
```


## Q07
- 형식: 객관식
- 배점: 4
### 발문
$A = 4x^{3}y^{2} \times (-2xy^{2})^{2}$, $B = 18x^{4}y^{5} \div \dfrac{9}{4}x^{2}y$ 일 때, $A \div B$를 계산하면? [4점]
### 선지
① $2x^{2}y^{3}$ ② $2x^{3}y^{2}$ ③ $4x^{3}y^{2}$ ④ $8x^{3}y^{2}$ ⑤ $2x^{7}y^{10}$
### 정답
②
### 해설
1단계: 식 $A$를 간단히 계산한다.
$$
(-2xy^2)^2 = (-2)^2 \times x^2 \times (y^2)^2 = 4x^2 y^4
$$
$$
\begin{aligned}
A &= 4x^3 y^2 \times 4x^2 y^4 \\
&= (4 \times 4) \times x^{3+2} y^{2+4} \\
&= 16x^5 y^6
\end{aligned}
$$


2단계: 식 $B$를 역수 곱셈으로 간단히 계산한다.
$$
\begin{aligned}
B &= 18x^4 y^5 \div \frac{9}{4}x^2 y \\
&= 18x^4 y^5 \times \frac{4}{9x^2 y} \\
&= \left(18 \times \frac{4}{9}\right) x^{4-2} y^{5-1} \\
&= 8x^2 y^4
\end{aligned}
$$


3단계: $A \div B$를 계산한다.
$$
\begin{aligned}
A \div B &= \frac{16x^5 y^6}{8x^2 y^4} \\
&= \left(\frac{16}{8}\right) x^{5-2} y^{6-4} \\
&= 2x^3 y^2
\end{aligned}
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식 곱셈, 나눗셈 분수 역수 처리 및 복합 단항식 나눗셈 문항"
}
```
```json:meta
{
  "sourceQid": 7,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_CHAIN_OPERATIONS",
  "primaryMethod": "A = 16x^5 y^6과 B = 8x^2 y^4를 구하고 나눗셈 A/B = 2x^3 y^2를 계산한다.",
  "decisiveStep": "A=16x^5 y^6, B=8x^2 y^4 도출 후 몫 2x^3 y^2 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "혼합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_CHAIN_EVALUATION",
    "templateKey": "TPL_MONOMIAL_TWO_STEP_DIVISION",
    "why": "두 단항식 식 A, B를 각각 계산한 후 몫을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_MONOMIAL_DIVISION"
  ],
  "conditionKeys": [
    "COND_MONOMIAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거듭제곱과 분수 나눗셈을 각각 정리한 후 나눗셈을 한 번 더 수행하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "단항식"
    ],
    "goal": [
      "단항식"
    ],
    "method": [
      "사칙연산",
      "연산",
      "지수법칙"
    ],
    "condition": [
      "단항식"
    ]
  },
  "hold": ""
}
```


## Q08
- 형식: 객관식
- 배점: 3
### 발문
다음 $\square$ 안에 알맞은 단항식은? [3점]


$$\square \times (-4x^{3}) = 24x^{8}$$
### 선지
① $6x^{5}$ ② $-6x^{4}$ ③ $6x^{4}$ ④ $-6x^{5}$ ⑤ $-8x^{5}$
### 정답
④
### 해설
등식의 성질을 이용하여 $\square$를 구한다.
$$
\begin{aligned}
\square &= \frac{24x^8}{-4x^3} \\
&= \left(\frac{24}{-4}\right) x^{8-3} \\
&= -6x^5
\end{aligned}
$$
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식 곱셈 등식에서 미지의 단항식 나눗셈 역산 기본 문항"
}
```
```json:meta
{
  "sourceQid": 8,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_BLANK_DIVISION",
  "primaryMethod": "24x^8 / (-4x^3) = -6x^5를 계산한다.",
  "decisiveStep": "부호 음수 및 지수 8-3=5 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "단항식의 나눗셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_BLANK_SOLVE",
    "templateKey": "TPL_MONOMIAL_PRODUCT_BLANK",
    "why": "단항식 곱셈식에서 빈칸을 나눗셈으로 해결하는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_MONOMIAL_DIVISION"
  ],
  "conditionKeys": [
    "COND_MONOMIAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기본 단항식 나눗셈을 1단계로 해결하는 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "단항식",
      "등식"
    ],
    "goal": [
      "단항식"
    ],
    "method": [
      "사칙연산",
      "연산"
    ],
    "condition": [
      "단항식"
    ]
  },
  "hold": ""
}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
$\left(\dfrac{8}{3}\right)^{a} = \dfrac{2^{b}}{81}$ 일 때, 두 자연수 $a, b$의 값으로 옳은 것은? [4점]
### 선지
① $a=2, b=6$ ② $a=3, b=9$ ③ $a=4, b=8$ ④ $a=4, b=10$ ⑤ $a=4, b=12$
### 정답
⑤
### 해설
좌변을 소인수 $2$와 $3$의 거듭제곱으로 나타낸다.
$$
8 = 2^3 \implies \left(\frac{8}{3}\right)^a = \left(\frac{2^3}{3}\right)^a = \frac{(2^3)^a}{3^a} = \frac{2^{3a}}{3^a}
$$
우변의 분모 $81$을 소인수분해한다.
$$
81 = 3^4
$$
따라서 주어진 등식은 다음과 같다.
$$
\frac{2^{3a}}{3^a} = \frac{2^b}{3^4}
$$
분모의 지수를 비교하면
$$
a = 4
$$
분자의 지수를 비교하면
$$
b = 3a = 3 \times 4 = 12
$$
따라서 $a = 4, b = 12$이다.
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "분수 거듭제곱 소인수 지수 분리 및 연립 비교 문항"
}
```
```json:meta
{
  "sourceQid": 9,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "EXPONENT_FRACTION_BASE_EQUATION",
  "primaryMethod": "3^a = 3^4에서 a=4, 2^(3a) = 2^b에서 b=12를 구한다.",
  "decisiveStep": "분모 a=4 결정 후 분자 b=12 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_COMPARE_FRACTION",
    "templateKey": "TPL_EXPONENT_POWER_FRACTION_SOLVE",
    "why": "분수의 거듭제곱을 전개하여 분자와 분모의 지수를 각각 비교하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PRIME_FACTORIZATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소인수분해 후 분자·분모의 지수를 각각 대응시키는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱",
      "분수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "지수법칙",
      "소인수분해"
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
등식 $3x^{A} \times (-2x)^{2} \div 4x^{3} = Bx^{6}$ 이 성립할 때, $A+B$의 값은? (단, $A$는 자연수, $B$는 상수) [4점]
### 선지
① $8$ ② $9$ ③ $10$ ④ $11$ ⑤ $12$
### 정답
③
### 해설
좌변을 지수법칙을 이용하여 정리한다.
1단계: $(-2x)^2$을 거듭제곱한다.
$$
(-2x)^2 = (-2)^2 \times x^2 = 4x^2
$$


2단계: 곱셈과 나눗셈을 순서대로 계산한다.
$$
\begin{aligned}
3x^A \times 4x^2 \div 4x^3 &= 12x^{A+2} \div 4x^3 \\
&= \left(\frac{12}{4}\right) x^{A+2-3} \\
&= 3x^{A-1}
\end{aligned}
$$


3단계: 우변 $Bx^6$과 계수 및 지수를 비교한다.
$$
\begin{aligned}
B &= 3 \\
A - 1 &= 6 \implies A = 7
\end{aligned}
$$


4단계: $A+B$의 값을 계산한다.
$$
A + B = 7 + 3 = 10
$$
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식 혼합 계산을 통한 계수 및 지수 미정계수 결정 문항"
}
```
```json:meta
{
  "sourceQid": 10,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_COEFFICIENT_EXPONENT_SOLVE",
  "primaryMethod": "좌변 3x^(A-1) = Bx^6에서 B=3, A=7을 구하고 A+B=10을 계산한다.",
  "decisiveStep": "좌변 전개 3x^(A-1) 도출 및 A=7, B=3 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "혼합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_UNKNOWN_COEFFICIENT_EXPONENT",
    "templateKey": "TPL_MONOMIAL_MIXED_COEFFICIENT_DEGREE_MATCH",
    "why": "단항식의 혼합 계산 결과를 목표 단항식과 비교하여 계수와 차수를 찾는 템플릿"
  },
  "crossConceptKeys": [
    "CC_MONOMIAL_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거듭제곱과 나눗셈 후 미지 지수와 계수를 각각 비교하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "단항식",
      "등식"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "지수법칙",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "계수"
    ]
  },
  "hold": ""
}
```


## Q11
- 형식: 객관식
- 배점: 4
### 발문
$\{4y + 3(2x-1)\} - 4\{x - (3y+2)\}$ 를 간단히 하였을 때, 상수항을 포함한 모든 계수의 합은? [4점]
### 선지
① $23$ ② $25$ ③ $27$ ④ $29$ ⑤ $31$
### 정답
①
### 해설
소괄호와 중괄호를 순서대로 풀어 동류항끼리 정리한다.
1단계: 첫 번째 중괄호 안의 식을 전개한다.
$$
\begin{aligned}
\{4y + 3(2x-1)\} &= 4y + 6x - 3 \\
&= 6x + 4y - 3
\end{aligned}
$$


2단계: 두 번째 중괄호 안의 식을 전개한다.
$$
\begin{aligned}
x - (3y+2) &= x - 3y - 2 \\
-4\{x - 3y - 2\} &= -4x + 12y + 8
\end{aligned}
$$


3단계: 전체 식을 동류항끼리 정리한다.
$$
\begin{aligned}
(6x + 4y - 3) + (-4x + 12y + 8) &= (6-4)x + (4+12)y + (-3+8) \\
&= 2x + 16y + 5
\end{aligned}
$$


4단계: 상수항을 포함한 모든 계수의 합을 구한다.
$x$의 계수: $2$
$y$의 계수: $16$
상수항: $5$
$$
2 + 16 + 5 = 23
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "복합 다항식 전개 및 상수항 포함 모든 계수 합산 문항"
}
```
```json:meta
{
  "sourceQid": 11,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_EXPANSION_COEFFICIENT_SUM",
  "primaryMethod": "식 2x+16y+5로 전개 정리한 후 계수와 상수항의 합 2+16+5=23을 계산한다.",
  "decisiveStep": "전개식 2x+16y+5 도출 및 합 23 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "괄호가 있는 식의 덧셈·뺄셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_COEFFICIENT_SUM",
    "templateKey": "TPL_POLYNOMIAL_BRACKETS_SUM_EVAL",
    "why": "다중 괄호 식을 전개하고 모든 계수와 상수항의 총합을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_POLYNOMIAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소괄호와 중괄호 분배법칙을 거쳐 동류항을 모으고 합산하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "동류항",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "계수"
    ]
  },
  "hold": ""
}
```


## Q12
- 형식: 객관식
- 배점: 4
### 발문
어떤 식에 $-3x^{2}+2x-5$를 더해야 할 것을 잘못하여 빼었더니 $5x^{2}-4x+3$이 되었다. 바르게 계산한 식은? [4점]
### 선지
① $-x^{2}+4x-7$ ② $-x^{2}-7$ ③ $2x^{2}-2x-2$ ④ $-x^{2}+7$ ⑤ $8x^{2}-6x+8$
### 정답
②
### 해설
잘못 계산한 등식으로부터 어떤 식 $A$를 구한다.
$$
A - (-3x^2 + 2x - 5) = 5x^2 - 4x + 3
$$
양변에 $(-3x^2 + 2x - 5)$를 더한다.
$$
\begin{aligned}
A &= (5x^2 - 4x + 3) + (-3x^2 + 2x - 5) \\
&= (5-3)x^2 + (-4+2)x + (3-5) \\
&= 2x^2 - 2x - 2
\end{aligned}
$$
바르게 계산한 식은 원래 식 $A$에 $(-3x^2 + 2x - 5)$를 더한 값이므로 계산한다.
$$
\begin{aligned}
A + (-3x^2 + 2x - 5) &= (2x^2 - 2x - 2) + (-3x^2 + 2x - 5) \\
&= (2-3)x^2 + (-2+2)x + (-2-5) \\
&= -x^2 + 0x - 7 \\
&= -x^2 - 7
\end{aligned}
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "다항식 덧셈/뺄셈 오류 역추적 및 바른 결과 산출 문항"
}
```
```json:meta
{
  "sourceQid": 12,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_ERROR_RECOVERY_QUADRATIC",
  "primaryMethod": "A = (5x^2-4x+3)+(-3x^2+2x-5) = 2x^2-2x-2를 구하고, 바른 식 A+(-3x^2+2x-5) = -x^2-7을 계산한다.",
  "decisiveStep": "A=2x^2-2x-2 도출 후 바른 합 -x^2-7 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "식의 값과 활용",
    "l4": "조건식 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_MISTAKE_CORRECTION",
    "templateKey": "TPL_POLYNOMIAL_WRONG_OPERATION_RECOVER",
    "why": "잘못된 연산 결과로부터 미지의 다항식을 찾아 바른 계산을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_ADD_SUBTRACT"
  ],
  "conditionKeys": [
    "COND_POLYNOMIAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차식의 이항 덧셈과 동류항 덧셈을 연속 수행하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
      "동류항",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "다항식"
    ]
  },
  "hold": ""
}
```


## Q13
- 형식: 객관식
- 배점: 4
### 발문
$x = 5, y = \dfrac{4}{3}$ 일 때, 식 $6x - \{5y + (8x^{2}-4xy) \div 2x\}$ 의 값은? [4점]
### 선지
① $2$ ② $4$ ③ $5$ ④ $6$ ⑤ $8$
### 정답
④
### 해설
1단계: 소괄호 안의 다항식을 단항식으로 나눈다.
$$
\begin{aligned}
(8x^2 - 4xy) \div 2x &= \frac{8x^2}{2x} - \frac{4xy}{2x} \\
&= 4x - 2y
\end{aligned}
$$


2단계: 중괄호 안의 식을 정리한다.
$$
5y + (4x - 2y) = 4x + 3y
$$


3단계: 전체 식을 간단히 정리한다.
$$
\begin{aligned}
6x - (4x + 3y) &= 6x - 4x - 3y \\
&= 2x - 3y
\end{aligned}
$$


4단계: $x = 5, y = \dfrac{4}{3}$를 대입하여 식의 값을 구한다.
$$
\begin{aligned}
2x - 3y &= 2(5) - 3\left(\frac{4}{3}\right) \\
&= 10 - 4 \\
&= 6
\end{aligned}
$$
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "다항식의 나눗셈 전개 정리 후 분수 유리수 대입을 통한 식의 값 산출 문항"
}
```
```json:meta
{
  "sourceQid": 13,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_SIMPLIFY_AND_EVALUATION",
  "primaryMethod": "식을 2x-3y로 간단히 정리한 후 x=5, y=4/3을 대입하여 10-4=6을 구한다.",
  "decisiveStep": "간단히 한 식 2x-3y 도출 및 대입 계산 6 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "식의 값과 활용",
    "l4": "식의 값 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_SUBSTITUTION_EVALUATION",
    "templateKey": "TPL_POLYNOMIAL_SIMPLIFY_THEN_EVALUATE",
    "why": "복합 다항식을 먼저 간단히 정리한 후 분수 값을 대입하여 계산하는 템플릿"
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
  "difficultyReason": "다항식 나눗셈 정리와 분수 대입 계산을 차례로 수행하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식",
      "유리수"
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
      "유리수"
    ]
  },
  "hold": ""
}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
$\dfrac{1}{3}a(9a-6b) - \dfrac{3}{4}a(8a-12b)$ 를 간단히 하였을 때, $ab$의 계수에서 $a^2$의 계수를 뺀 값은? [4점]
### 선지
① $-10$ ② $-4$ ③ $4$ ④ $7$ ⑤ $10$
### 정답
⑤
### 해설
1단계: 분배법칙을 이용하여 각 식을 전개한다.
$$
\begin{aligned}
\frac{1}{3}a(9a-6b) &= \frac{1}{3}a \times 9a - \frac{1}{3}a \times 6b \\
&= 3a^2 - 2ab
\end{aligned}
$$
$$
\begin{aligned}
-\frac{3}{4}a(8a-12b) &= -\frac{3}{4}a \times 8a + \left(-\frac{3}{4}a\right) \times (-12b) \\
&= -6a^2 + 9ab
\end{aligned}
$$


2단계: 동류항끼리 모아 식을 정리한다.
$$
\begin{aligned}
(3a^2 - 2ab) + (-6a^2 + 9ab) &= (3-6)a^2 + (-2+9)ab \\
&= -3a^2 + 7ab
\end{aligned}
$$
따라서 $a^2$의 계수는 $-3$이고, $ab$의 계수는 $7$이다.


3단계: $ab$의 계수에서 $a^2$의 계수를 뺀 값을 계산한다.
$$
7 - (-3) = 7 + 3 = 10
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식과 다항식의 곱셈 전개 및 동류항 계수 차 계산 문항"
}
```
```json:meta
{
  "sourceQid": 14,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_EXPANSION_COEFFICIENT_DIFF",
  "primaryMethod": "전개하여 -3a^2 + 7ab를 얻고 ab의 계수 7에서 a^2의 계수 -3을 뺀 7-(-3)=10을 구한다.",
  "decisiveStep": "전개식 -3a^2 + 7ab 도출 및 7-(-3)=10 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "단항식과 다항식의 곱셈·나눗셈",
    "l4": "단항식과 다항식의 곱셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_EXPANSION_COEFFICIENT_SUBTRACTION",
    "templateKey": "TPL_POLYNOMIAL_DISTRIBUTIVE_COEFF_DIFF",
    "why": "분수 계수의 단항식 분배 전개 후 특정 계수들의 차를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_POLYNOMIAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분배법칙의 부호 처리에 유의하여 전개한 뒤 계수 차를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식",
      "단항식"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "사칙연산",
      "연산"
    ],
    "condition": [
      "계수"
    ]
  },
  "hold": ""
}
```


## Q15
- 형식: 객관식
- 배점: 4
### 발문
다음 중 $\square$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는? [4점]
### 선지
① $a+4 < b+4 \implies a \;\square\; b$
② $3a-2 < 3b-2 \implies a \;\square\; b$
③ $5-2a < 5-2b \implies a \;\square\; b$
④ $\dfrac{a}{3}+1 < \dfrac{b}{3}+1 \implies a \;\square\; b$
⑤ $a \div (-5) > b \div (-5) \implies a \;\square\; b$
### 정답
③
### 해설
부등식의 성질을 이용하여 각 선지에서 $a$와 $b$의 대소 관계를 구한다.
$$
\begin{aligned}
\text{① } & a+4 < b+4 \implies a < b \quad (<) \\
\text{② } & 3a-2 < 3b-2 \implies 3a < 3b \implies a < b \quad (<) \\
\text{③ } & 5-2a < 5-2b \implies -2a < -2b \implies a > b \quad (>) \\
\text{④ } & \frac{a}{3}+1 < \frac{b}{3}+1 \implies \frac{a}{3} < \frac{b}{3} \implies a < b \quad (<) \\
\text{⑤ } & -\frac{a}{5} > -\frac{b}{5} \implies a < b \quad (<)
\end{aligned}
$$
선지 ①, ②, ④, ⑤는 모두 $a < b$이지만, ③은 $a > b$이다.
따라서 부등호의 방향이 나머지 넷과 다른 하나는 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "부등식의 기본 성질을 이용한 부등호 방향 보존 및 반전 판정 문항"
}
```
```json:meta
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_PROPERTIES_DIRECTION_AUDIT",
  "primaryMethod": "5-2a < 5-2b에서 음수 계수 -2로 인해 a > b가 됨을 식별하여 ③을 선별한다.",
  "decisiveStep": "선지 ③의 부등호 방향 반전(a > b) 판정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PROPERTY_DIRECTION",
    "templateKey": "TPL_INEQUALITY_TRANSFORM_DIRECTION_AUDIT",
    "why": "양변의 사칙연산에 따른 부등호 방향 변화를 판정하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_INEQUALITY_SIGN_FLIP"
  ],
  "conditionKeys": [
    "COND_INEQUALITY"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식의 양변에 음수를 곱하거나 나눌 때 방향이 바뀌는 기본 성질을 확인하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "부등식의성질"
    ],
    "condition": [
      "부등식"
    ]
  },
  "hold": ""
}
```


## Q16
- 형식: 객관식
- 배점: 4
### 발문
일차부등식 $3x-5 \le 10-2x$ 를 만족시키는 자연수 $x$의 개수는? [4점]
### 선지
① $3$개 ② $2$개 ③ $4$개 ④ $5$개 ⑤ $1$개
### 정답
①
### 해설
주어진 일차부등식을 푼다.
$$
\begin{aligned}
3x - 5 &\le 10 - 2x \\
3x + 2x &\le 10 + 5 \\
5x &\le 15 \\
x &\le 3
\end{aligned}
$$
$x \le 3$을 만족시키는 자연수 $x$는 $1, 2, 3$의 $3$개이다.
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "일차부등식 기본 풀이 및 자연수 해 개수 카운팅 문항"
}
```
```json:meta
{
  "sourceQid": 16,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "LINEAR_INEQUALITY_NATURAL_SOLUTIONS",
  "primaryMethod": "5x <= 15에서 x <= 3을 구하고 자연수 해 1, 2, 3의 3개를 산출한다.",
  "decisiveStep": "x <= 3 해 산출 및 자연수 3개 확정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "기본형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INEQUALITY_SOLVE_COUNT",
    "templateKey": "TPL_INEQUALITY_NATURAL_SOLUTION_COUNT",
    "why": "일차부등식을 이항 정리하여 자연수 해의 개수를 세는 템플릿"
  },
  "crossConceptKeys": [
    "CC_INEQUALITY_BASIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차부등식 기본 이항과 자연수 조건 대조를 수행하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "부등식의성질",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q17
- 형식: 객관식
- 배점: 4
### 발문
일차부등식 $2x-a > 5x+1$ 의 해가 $x < -3$ 일 때, 상수 $a$의 값은? [4점]
### 선지
① $6$ ② $8$ ③ $10$ ④ $-8$ ⑤ $-10$
### 정답
②
### 해설
주어진 일차부등식을 $x$에 대하여 푼다.
$$
\begin{aligned}
2x - a &> 5x + 1 \\
2x - 5x &> a + 1 \\
-3x &> a + 1
\end{aligned}
$$
양변을 음수 $-3$으로 나누면 부등호의 방향이 바뀐다.
$$
x < -\frac{a+1}{3}
$$
이 부등식의 해가 $x < -3$과 같으므로 경곗값을 비교한다.
$$
\begin{aligned}
-\frac{a+1}{3} &= -3 \\
a + 1 &= 9 \\
a &= 8
\end{aligned}
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "주어진 해로부터 일차부등식의 미정계수 결정 문항"
}
```
```json:meta
{
  "sourceQid": 17,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_UNKNOWN_COEFFICIENT_FROM_SOLUTION",
  "primaryMethod": "x < -(a+1)/3 = -3에서 a+1=9, a=8을 산출한다.",
  "decisiveStep": "경곗값 방정식 -(a+1)/3 = -3에서 a=8 도출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "해의 조건",
    "l4": "계수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_COEFFICIENT_MATCH",
    "templateKey": "TPL_INEQUALITY_TARGET_SOLUTION_COEFF_SOLVE",
    "why": "부등식의 해가 주어졌을 때 일차방정식으로 미지 계수를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_INEQUALITY_SIGN_FLIP"
  ],
  "conditionKeys": [
    "COND_INEQUALITY"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 정리 후 경곗값을 일차방정식으로 풀어 상수를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차부등식",
      "해"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "부등식의성질",
      "방정식"
    ],
    "condition": [
      "부등식"
    ]
  },
  "hold": ""
}
```


## Q18
- 형식: 객관식
- 배점: 5
### 발문
일차부등식 $x-4 \le -3x+4a$ 의 해 중 가장 큰 정수가 $-1$ 일 때, 상수 $a$의 값의 범위는? [5점]
### 선지
① $-2 < a \le -1$ ② $-2 \le a \le -1$ ③ $-1 \le a < 0$ ④ $-2 \le a < -1$ ⑤ $0 \le a < 1$
### 정답
④
### 해설
1단계: 주어진 부등식을 $x$에 대하여 푼다.
$$
\begin{aligned}
x - 4 &\le -3x + 4a \\
x + 3x &\le 4a + 4 \\
4x &\le 4a + 4 \\
x &\le a + 1
\end{aligned}
$$


2단계: 가장 큰 정수해가 $-1$이 되는 조건을 수직선 위에서 파악한다.
$x \le a+1$을 만족시키는 정수 중 최댓값이 $-1$이 되려면,
$-1$은 해에 포함되어야 하고, $-1$보다 큰 정수인 $0$은 해에 포함되지 않아야 한다.
$$
-1 \le a+1 < 0
$$


3단계: 각 변에서 $1$을 빼어 $a$의 범위를 구한다.
$$
-2 \le a < -1
$$
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "최대 정수해 조건을 만족하는 일차부등식 미정계수 범위 결정 고난도 문항"
}
```
```json:meta
{
  "sourceQid": 18,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_INTEGER_SOLUTION_BOUNDARY",
  "primaryMethod": "x <= a+1에서 최대 정수가 -1이 되도록 -1 <= a+1 < 0을 세우고 -2 <= a < -1을 산출한다.",
  "decisiveStep": "경계 부등식 -1 <= a+1 < 0 성립 및 등호 포함 여부 판정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "해의 조건",
    "l4": "정수 해의 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_MAX_INTEGER_CONDITION",
    "templateKey": "TPL_INEQUALITY_INTEGER_BOUND_PARAMETER_RANGE",
    "why": "부등식의 정수해 조건으로부터 매개변수의 범위를 등호 포함 여부까지 판정하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_NUMBER_LINE_INTERVAL"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수직선 상에서 경곗값의 등호 포함 여부를 정밀하게 분석해야 하는 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "일차부등식",
      "정수"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "수직선",
      "부등식의성질"
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
일차부등식 $\dfrac{2x+1}{4} < 0.75 + \dfrac{1}{3}x$ 를 만족시키는 가장 큰 정수 $x$의 값은? [4점]
### 선지
① $-2$ ② $-1$ ③ $0$ ④ $1$ ⑤ $2$
### 정답
⑤
### 해설
1단계: 소수 $0.75$를 분수로 고친다.
$$
0.75 = \frac{75}{100} = \frac{3}{4}
$$
따라서 부등식은 다음과 같다.
$$
\frac{2x+1}{4} < \frac{3}{4} + \frac{1}{3}x
$$


2단계: 분모의 최소공배수인 $12$를 양변에 곱하여 계수를 정수로 만든다.
$$
\begin{aligned}
12 \times \left(\frac{2x+1}{4}\right) &< 12 \times \left(\frac{3}{4} + \frac{1}{3}x\right) \\
3(2x+1) &< 3 \times 3 + 4x \\
6x + 3 &< 9 + 4x
\end{aligned}
$$


3단계: 이항하여 부등식을 푼다.
$$
\begin{aligned}
6x - 4x &< 9 - 3 \\
2x &< 6 \\
x &< 3
\end{aligned}
$$


4단계: $x < 3$을 만족시키는 가장 큰 정수를 구한다.
$3$보다 작은 정수 $\dots, 0, 1, 2$ 중 가장 큰 정수는 $2$이다.
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "분수와 소수가 혼합된 일차부등식의 정수 계수화 풀이 및 최대 정수해 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "LINEAR_INEQUALITY_FRACTION_DECIMAL_MIXED",
  "primaryMethod": "양변에 12를 곱해 6x+3 < 9+4x를 풀고 x < 3에서 가장 큰 정수 2를 산출한다.",
  "decisiveStep": "정수 계수 부등식 2x < 6 도출 및 최대 정수 2 결정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "복잡한 식의 풀이"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_MIXED_COEFFICIENT_SOLVE",
    "templateKey": "TPL_INEQUALITY_FRACTION_DECIMAL_INTEGER_MAX",
    "why": "분수와 소수가 혼합된 부등식을 최소공배수로 정수화하여 최대 정수를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소수를 분수로 바꾸고 최소공배수를 곱해 정수 계수로 변환하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차부등식",
      "소수",
      "분수"
    ],
    "goal": [
      "정수"
    ],
    "method": [
      "부등식의성질",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```


## Q20
- 형식: 객관식
- 배점: 5
### 발문
기차역에서 기차 출발 시각까지 $1$시간 $20$분의 여유가 있다. 상점에 가서 물건을 사는 데 $20$분이 걸리고, 시속 $3\,\mathrm{km}$로 걸어서 다녀오려고 한다. 역에서 최대 몇 $\mathrm{km}$ 떨어진 상점까지 다녀올 수 있는가? [5점]
### 선지
① $1.2\,\mathrm{km}$ ② $1.4\,\mathrm{km}$ ③ $1.5\,\mathrm{km}$ ④ $1.8\,\mathrm{km}$ ⑤ $2.0\,\mathrm{km}$
### 정답
③
### 해설
1단계: 순수하게 걷는 데 사용할 수 있는 시간을 계산한다.
전체 여유 시간은 $1$시간 $20$분이고 물건 사는 데 $20$분이 걸리므로
$$
1\text{시간 } 20\text{분} - 20\text{분} = 1\text{시간}
$$


2단계: 역에서 상점까지의 거리를 $x\,\mathrm{km}$라 하고 부등식을 세운다.
시속 $3\,\mathrm{km}$로 갈 때 걸리는 시간은 $\dfrac{x}{3}$시간이고, 올 때 걸리는 시간도 $\dfrac{x}{3}$시간이다.
왕복 걸린 시간의 합이 $1$시간 이하이어야 하므로
$$
\frac{x}{3} + \frac{x}{3} \le 1
$$


3단계: 부등식을 푼다.
$$
\begin{aligned}
\frac{2x}{3} &\le 1 \\
2x &\le 3 \\
x &\le \frac{3}{2} = 1.5
\end{aligned}
$$
따라서 최대 $1.5\,\mathrm{km}$ 떨어진 상점까지 다녀올 수 있다.
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "속력·거리·시간 관계를 이용한 일차부등식 활용(왕복 시간 제한) 문항"
}
```
```json:meta
{
  "sourceQid": 20,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "SPEED_DISTANCE_TIME_INEQUALITY",
  "primaryMethod": "왕복 이동 가능 시간 1시간에 대하여 x/3 + x/3 <= 1을 세우고 x <= 1.5km를 산출한다.",
  "decisiveStep": "왕복 시간 부등식 2x/3 <= 1 수립 및 x <= 1.5km 도출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 활용",
    "l4": "거리·속력·시간"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SPEED_DISTANCE_TIME",
    "templateKey": "TPL_SPEED_ROUND_TRIP_TIME_LIMIT",
    "why": "제한 시간과 쇼핑 시간이 포함된 왕복 거리 부등식을 세워 최대 거리를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_SPEED_DISTANCE_TIME"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "실생활 시간 조건을 단위 환산 후 거리-속력 부등식으로 모델링하는 2단계 문항",
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
      "부등식의성질",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "부등식"
    ]
  },
  "hold": ""
}
```


## Q21
- 형식: 서술형
- 배점: 6
### 발문
[서술형 1번] 밑면의 반지름의 길이가 $2a$, 높이가 $3b$인 원뿔의 부피는 밑면의 반지름의 길이가 $3b$, 높이가 $2a$인 원기둥의 부피의 몇 배인지 구하고 그 과정을 서술하시오. [6점]
### 정답
$\dfrac{2a}{9b}$배
### 해설
1단계: 밑면의 반지름의 길이가 $2a$, 높이가 $3b$인 원뿔의 부피 $V_1$을 구한다.
$$
\begin{aligned}
V_1 &= \frac{1}{3} \times \pi \times (2a)^2 \times 3b \\
&= \frac{1}{3} \times \pi \times 4a^2 \times 3b \\
&= 4\pi a^2 b
\end{aligned}
$$


2단계: 밑면의 반지름의 길이가 $3b$, 높이가 $2a$인 원기둥의 부피 $V_2$를 구한다.
$$
\begin{aligned}
V_2 &= \pi \times (3b)^2 \times 2a \\
&= \pi \times 9b^2 \times 2a \\
&= 18\pi ab^2
\end{aligned}
$$


3단계: 원뿔의 부피가 원기둥 부피의 몇 배인지 비율 $\dfrac{V_1}{V_2}$를 구한다.
$$
\begin{aligned}
\frac{V_1}{V_2} &= \frac{4\pi a^2 b}{18\pi ab^2} \\
&= \frac{4}{18} \times \frac{a^2}{a} \times \frac{b}{b^2} \\
&= \frac{2a}{9b}
\end{aligned}
$$
따라서 원뿔의 부피는 원기둥 부피의 $\dfrac{2a}{9b}$배이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "원뿔과 원기둥의 부피 공식 적용 및 단항식 분수 나눗셈 서술형 문항"
}
```
```json:meta
{
  "sourceQid": 21,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "GEOMETRIC_VOLUME_RATIO_MONOMIAL",
  "primaryMethod": "원뿔 부피 V1 = 4pi a^2 b와 원기둥 부피 V2 = 18pi ab^2를 구하고 비 V1/V2 = 2a/(9b)를 산출한다.",
  "decisiveStep": "부피 V1=4pi a^2 b, V2=18pi ab^2 계산 후 비 2a/(9b) 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "단항식의 나눗셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_GEOMETRIC_VOLUME_RATIO",
    "templateKey": "TPL_CONE_CYLINDER_VOLUME_RATIO_ALGEBRAIC",
    "why": "회전체의 부피 공식을 단항식으로 표현하여 두 입체도형의 부피 비율을 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_SOLID_GEOMETRY_VOLUME"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "입체도형 부피 공식을 문자로 표현하고 단항식 나눗셈을 수행하는 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원뿔",
      "원기둥",
      "부피",
      "단항식"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "사칙연산",
      "연산"
    ],
    "condition": [
      "단항식"
    ]
  },
  "hold": ""
}
```


## Q22
- 형식: 서술형
- 배점: 7
### 발문
[서술형 2번] 두 일차부등식 $4x-3 \le 2x+5$ 와 $2x-a \ge 4(x-3)+2$ 의 해가 서로 같을 때, 상수 $a$의 값을 구하는 과정을 서술하시오. [7점]
### 정답
$2$
### 해설
1단계: 첫 번째 일차부등식을 푼다.
$$
\begin{aligned}
4x - 3 &\le 2x + 5 \\
4x - 2x &\le 5 + 3 \\
2x &\le 8 \\
x &\le 4
\end{aligned}
$$


2단계: 두 번째 일차부등식을 괄호를 풀어 정리한다.
$$
\begin{aligned}
2x - a &\ge 4(x-3) + 2 \\
2x - a &\ge 4x - 12 + 2 \\
2x - a &\ge 4x - 10 \\
2x - 4x &\ge a - 10 \\
-2x &\ge a - 10
\end{aligned}
$$
양변을 음수 $-2$로 나누면 부등호의 방향이 바뀐다.
$$
x \le \frac{-(a-10)}{2} = \frac{10-a}{2}
$$


3단계: 두 부등식의 해가 서로 같으므로 경곗값을 비교하여 방정식을 세운다.
$$
\begin{aligned}
\frac{10-a}{2} &= 4 \\
10 - a &= 8 \\
a &= 2
\end{aligned}
$$
따라서 구하는 상수 $a$의 값은 $2$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "해가 서로 같은 두 일차부등식의 연립 비교를 통한 미정계수 결정 서술형 문항"
}
```
```json:meta
{
  "sourceQid": 22,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "EQUIVALENT_INEQUALITIES_PARAMETER_SOLVE",
  "primaryMethod": "첫 식에서 x <= 4를 얻고, 둘째 식 x <= (10-a)/2와 같다고 놓아 10-a=8에서 a=2를 산출한다.",
  "decisiveStep": "두 해 x<=4와 x<=(10-a)/2의 경계 일치 방정식 수립 및 a=2 계산",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "해의 조건",
    "l4": "해가 서로 같을 때"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EQUIVALENT_INEQUALITIES_COEFFICIENT",
    "templateKey": "TPL_SAME_SOLUTION_INEQUALITIES_SOLVE",
    "why": "두 부등식의 해가 일치함을 이용하여 일차방정식으로 미지 상수를 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_INEQUALITY_SIGN_FLIP"
  ],
  "conditionKeys": [
    "COND_INEQUALITY"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 부등식을 각각 풀고 해의 일치 조건을 방정식으로 해결하는 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차부등식",
      "해"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "부등식의성질",
      "방정식"
    ],
    "condition": [
      "부등식"
    ]
  },
  "hold": ""
}
```


## Q23
- 형식: 서술형
- 배점: 7
### 발문
[서술형 3번] 어느 체험 학습장의 입장료는 어른이 $1200$원, 어린이가 $800$원이다. 어른과 어린이를 합하여 모두 $30$명이 입장하려고 할 때, 총 입장료가 $28000$원 이하가 되게 하려면 어른은 최대 몇 명까지 입장할 수 있는지 구하는 과정을 서술하시오. [7점]
### 정답
$10$명
### 해설
1단계: 미지수를 정한다.
입장하는 어른의 수를 $x$명이라 하면, 전체 인원이 $30$명이므로 어린이의 수는 $(30 - x)$명이다. (단, $x$는 $0 \le x \le 30$인 정수)


2단계: 총 입장료에 대한 부등식을 세운다.
$$
1200x + 800(30 - x) \le 28000
$$


3단계: 부등식을 푼다.
양변을 $100$으로 나눈다.
$$
12x + 8(30 - x) \le 280
$$
괄호를 풀어 전개한다.
$$
\begin{aligned}
12x + 240 - 8x &\le 280 \\
4x + 240 &\le 280 \\
4x &\le 280 - 240 \\
4x &\le 40 \\
x &\le 10
\end{aligned}
$$


4단계: 문제의 조건에 맞는 답을 구한다.
$x \le 10$이므로 어른은 최대 $10$명까지 입장할 수 있다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "실생활 요금 예산 제한에 따른 최대 인원수 일차부등식 활용 서술형 문항"
}
```
```json:meta
{
  "sourceQid": 23,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "INEQUALITY_ADMISSION_FEE_MAX_PEOPLE",
  "primaryMethod": "어른 x명에 대해 1200x + 800(30-x) <= 28000을 세우고 4x <= 40에서 x <= 10명을 산출한다.",
  "decisiveStep": "부등식 1200x+800(30-x)<=28000 수립 및 4x<=40, x<=10 도출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 활용",
    "l4": "비용과 금액"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_TOTAL_COST_LIMIT",
    "templateKey": "TPL_TWO_ITEM_BUDGET_MAX_QUANTITY",
    "why": "두 대상의 합이 고정된 상황에서 총비용 한도를 만족시키는 최대 개수를 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_REAL_WORLD_MATH"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "실생활 요금 합산 모델링 부등식을 세우고 정수 최대 인원을 구하는 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차부등식",
      "자연수"
    ],
    "goal": [
      "최댓값",
      "자연수"
    ],
    "method": [
      "부등식의성질",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```