

```
{
  "stem": "25_연향중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js",
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

순환소수 \$0.\\dot{3}\\dot{8}\$을 분수로 나타낼 때 다음 중 가장 편리한 식을 고르면? (단, \$x=0.\\dot{3}\\dot{8}\$) \[3점\]

### 선지

① \$10x \- x\$ ② \$100x \- x\$ ③ \$1000x \- x\$ ④ \$100x \- 10x\$ ⑤ \$1000x \- 10x\$

### 정답

②

### 해설

순환마디의 숫자가 \$2\$개인 순환소수는 소수점 아래 순환마디 부분을 완전히 일치시켜 소거하기 위해 \$100x\$와 \$x\$를 이용한다. \$\$ \\begin{aligned} x &= 0.383838\\cdots \\ 100x &= 38.383838\\cdots \\end{aligned} \$\$ 두 식을 변끼리 빼면 소수점 아래 순환하는 부분이 모두 소거되어 \$99x \= 38\$이라는 정수 계수의 일차방정식으로 정리된다. 따라서 가장 편리한 식은 \$100x \- x\$이므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수의 순환마디 길이에 따른 분수 변환 최적 식 판정 문항"
}
```

```
{
  "sourceQid": 1,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_CONVERSION_STRATEGY",
  "primaryMethod": "x = 0.(3)(8)에서 순환마디가 소수 둘째 자리까지이므로 100x - x를 선택한다.",
  "decisiveStep": "순환마디 길이 2에 대응하는 100x - x 식별",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_TO_FRACTION_EQ",
    "templateKey": "TPL_REPEATING_FRACTION_EQUATION_CHOICE",
    "why": "순환소수 분수 변환을 위한 거듭제곱 뺄셈식을 선택하는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_CONVERSION"
  ],
  "conditionKeys": [
    "COND_DECIMAL"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환마디의 길이에 맞춰 10의 거듭제곱 배수를 바로 선택하는 1단계 기본 문항",
  "level": "하",
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

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

순환소수 \$x \= 2.15333\\cdots\$에 대한 다음 설명으로 옳지 않은 것은? \[4점\]

### 선지

① 순환마디는 \$3\$이다. ② \$x \= \\dfrac{2153 \- 215}{900}\$이다. ③ \$x\$는 무한소수이면서 유리수이다. ④ \$x \= 2.15\\dot{3}\$으로 나타낸다. ⑤ \$100x \- 10x\$를 이용하면 분수로 나타낼 수 있다.

### 정답

⑤

### 해설

순환소수 \$x \= 2.15333\\cdots\$의 성질을 각 선지별로 검토한다. \$\$ \\begin{aligned} \\text{① } & \\text{소수점 아래에서 } 3\\text{이 끝없이 반복되므로 순환마디는 } 3\\text{이다. (참)} \\ \\text{② } & 1000x \= 2153.333\\cdots, \\quad 100x \= 215.333\\cdots \\ & 1000x \- 100x \= 2153 \- 215 \\implies 900x \= 2153 \- 215 \\ & x \= \\frac{2153 \- 215}{900} \\text{ (참)} \\ \\text{③ } & x\\text{는 소수점 아래 숫자가 끝없이 계속되는 무한소수이며, 분수로 나타낼 수 있으므로 유리수이다. (참)} \\ \\text{④ } & \\text{순환마디의 양 끝 숫자 위에 점을 찍으므로 } x \= 2.15\\dot{3}\\text{으로 표기한다. (참)} \\ \\text{⑤ } & 100x \= 215.333\\cdots, \\quad 10x \= 21.533\\cdots \\ & \\text{두 식을 빼면 소수점 아래 자릿수가 일치하지 않아 순환마디가 소거되지 않는다. } \\ & \\text{따라서 분수로 나타내기 위해서는 } 1000x \- 100x\\text{를 이용해야 한다. (거짓)} \\end{aligned} \$\$ 따라서 옳지 않은 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "혼순환소수의 순환마디, 분수 변환 공식, 소수 분류 종합 진위 판정 문항"
}
```

```
{
  "sourceQid": 2,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "MIXED_REPEATING_DECIMAL_AUDIT",
  "primaryMethod": "1000x와 100x를 이용해야 순환마디가 소거되므로 100x-10x를 주장한 ⑤의 오류를 식별한다.",
  "decisiveStep": "1000x-100x가 아닌 100x-10x로는 소수 부분 소거 불가능 확인",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_PROPERTY_AUDIT",
    "templateKey": "TPL_MIXED_REPEATING_DECIMAL_CLAIMS",
    "why": "혼순환소수의 분수 변환 원리와 순환마디 표기 규칙을 포괄 검증하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_REPEATING_NOTATION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "혼순환소수의 소거 원리와 분수 변환 공식을 종합적으로 대조하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "유리수"
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

분수 \$\\dfrac{1}{3}\$과 \$\\dfrac{4}{27}\$를 소수로 나타내었을 때의 순환마디의 숫자의 개수를 각각 \$x, y\$라 할 때, \$x \+ y\$의 값을 구하면? \[4점\]

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

①

### 해설

각 분수를 나눗셈하여 순환마디를 구하고 그 길이를 센다. 1단계: \$\\dfrac{1}{3}\$을 소수로 나타낸다. \$\$ \\frac{1}{3} \= 0.333\\cdots \= 0.\\dot{3} \$\$ 순환마디는 \$3\$으로 숫자의 개수는 \$1\$개이다. \$\$ x \= 1 \$\$ 2단계: \$\\dfrac{4}{27}\$를 소수로 나타낸다. \$\$ 4 \\div 27 \= 0.148148148\\cdots \= 0.\\dot{1}4\\dot{8} \$\$ 순환마디는 \$148\$로 숫자의 개수는 \$3\$개이다. \$\$ y \= 3 \$\$ 3단계: \$x \+ y\$의 값을 계산한다. \$\$ x \+ y \= 1 \+ 3 \= 4 \$\$ 따라서 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "두 분수의 순환마디 길이 계산 및 합산 기본 문항"
}
```

```
{
  "sourceQid": 3,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_PERIOD_LENGTH_SUM",
  "primaryMethod": "1/3=0.(3)에서 x=1, 4/27=0.(1)4(8)에서 y=3을 구하여 1+3=4를 산출한다.",
  "decisiveStep": "4/27의 순환마디 148(길이 3) 식별 후 1+3=4 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_PERIOD_LENGTH",
    "templateKey": "TPL_FRACTION_TO_PERIOD_LENGTH_SUM",
    "why": "두 분수의 소수 전개 순환마디 길이를 각각 세어 합산하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_CONVERSION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직접 나눗셈을 통해 순환마디를 구하고 자릿수 개수를 더하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "기약분수",
      "분수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "사칙연산",
      "자릿수"
    ],
    "condition": [
      "소수"
    ]
  },
  "hold": ""
}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

분수 \$\\dfrac{5}{13}\$를 소수로 나타낼 때 소수점 아래 100번째 자리의 숫자를 구하면? \[4점\]

### 선지

① \$3\$ ② \$8\$ ③ \$4\$ ④ \$6\$ ⑤ \$1\$

### 정답

④

### 해설

분수를 소수로 변환하여 순환마디를 구한 후 주기를 이용한다. 1단계: \$5 \\div 13\$의 나눗셈을 수행한다. \$\$ \\frac{5}{13} \= 0.384615384615\\cdots \= 0.\\dot{3}8461\\dot{5} \$\$ 순환마디는 \$384615\$이며 순환마디의 길이는 \$6\$이다. 2단계: \$100\$을 순환마디의 길이 \$6\$으로 나눈 나머지를 구한다. \$\$ 100 \= 6 \\times 16 \+ 4 \$\$ 나머지가 \$4\$이므로 소수점 아래 100번째 자리의 숫자는 순환마디 \$384615\$의 \$4\$번째 숫자와 같다. 순환마디의 \$4\$번째 숫자는 \$6\$이다. 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "분수의 순환소수 전개 후 주기성을 이용한 특정 자릿수 결정 문항"
}
```

```
{
  "sourceQid": 4,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_NTH_DIGIT",
  "primaryMethod": "5/13=0.(3)8461(5)에서 마디 길이 6, 100=6*16+4의 나머지 4로부터 4번째 숫자 6을 구한다.",
  "decisiveStep": "100 mod 6 = 4에서 순환마디 384615의 4번째 숫자 6 선택",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "소수점 아래 n번째 자리의 숫자"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_NTH_DIGIT",
    "templateKey": "TPL_DECIMAL_PERIODIC_MODULO",
    "why": "순환마디 주기의 나머지 연산으로 자릿수 값을 결정하는 대표 템플릿"
  },
  "crossConceptKeys": [
    "CC_PERIODICITY_MODULO"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환마디를 전개하고 정수 나눗셈의 나머지를 대응시키는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "기약분수",
      "분수"
    ],
    "goal": [
      "자릿수"
    ],
    "method": [
      "사칙연산",
      "자릿수"
    ],
    "condition": [
      "소수"
    ]
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 5

### 발문

분수 \$\\dfrac{18}{75 \\times x}\$를 소수로 나타내면 유한소수가 될 때, \$x\$의 값이 될 수 있는 모든 한 자리 자연수의 합을 구하면? \[5점\]

### 선지

① \$25\$ ② \$27\$ ③ \$29\$ ④ \$31\$ ⑤ \$33\$

### 정답

③

### 해설

분수를 기약분수로 나타내어 분모의 소인수 조건을 분석한다. 1단계: 분모와 분자를 소인수분해하여 약분한다. \$\$ \\frac{18}{75 \\times x} \= \\frac{2 \\times 3^2}{(3 \\times 5^2) \\times x} \= \\frac{2 \\times 3}{5^2 \\times x} \= \\frac{6}{25x} \$\$ 2단계: \$\\dfrac{6}{25x}\$가 유한소수가 되려면 기약분수의 분모의 소인수가 \$2\$ 또는 \$5\$뿐이어야 한다. 이미 분모에 \$5^2\$이 있으므로, 한 자리 자연수 \$x\$는 소인수로 \$2\$와 \$5\$만을 갖거나, 분자의 소인수 \$3\$과 약분되어 분모에 소인수 \$3\$이 남지 않아야 한다. 즉, \$x\$의 소인수 중 \$2\$와 \$5\$ 이외의 소인수는 분자의 \$3\$과 최대 한 번 약분될 수 있는 \$3\$뿐이다. 3단계: 한 자리 자연수 \$x \\in {1, 2, 3, 4, 5, 6, 7, 8, 9}\$를 각각 검토한다.

- \$x \= 1 \= 1\$ (유한소수 가능)  
- \$x \= 2 \= 2\$ (유한소수 가능)  
- \$x \= 3\$: 분자의 \$3\$과 약분되어 분모에 \$2, 5\$만 남음 (유한소수 가능)  
- \$x \= 4 \= 2^2\$ (유한소수 가능)  
- \$x \= 5 \= 5\$ (유한소수 가능)  
- \$x \= 6 \= 2 \\times 3\$: \$3\$이 분자와 약분되어 분모에 \$2\$만 남음 (유한소수 가능)  
- \$x \= 7\$: 분모에 소인수 \$7\$이 남아 불가 (순환소수)  
- \$x \= 8 \= 2^3\$ (유한소수 가능)  
- \$x \= 9 \= 3^2\$: 분자의 \$3\$과 약분되어도 분모에 \$3\$이 남아 불가 (순환소수) 따라서 가능한 한 자리 자연수 \$x\$는 \$1, 2, 3, 4, 5, 6, 8\$이다. 4단계: 모든 \$x\$의 합을 구한다. \$\$ 1 \+ 2 \+ 3 \+ 4 \+ 5 \+ 6 \+ 8 \= 29 \$\$ 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "분자의 소인수 약분을 고려한 유한소수 형성 조건 및 한 자리 자연수 전수 조사 문항"
}
```

```
{
  "sourceQid": 5,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FINITE_DECIMAL_DIVISOR_SUM",
  "primaryMethod": "18/(75x) = 6/(25x)에서 x의 소인수가 2, 5 또는 분자 3과 약분되는 수 x=1,2,3,4,5,6,8의 합 29를 구한다.",
  "decisiveStep": "x=3, 6이 분자의 3과 약분 가능함을 포함하고 x=9(3 잔존)를 배제하여 합 29 산출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수가 되도록 하는 미지수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_DIGIT_ENUM",
    "templateKey": "TPL_SINGLE_DIGIT_FINITE_DECIMAL_SUM",
    "why": "분자 약분 효과를 고려하여 한 자리 정수 중 유한소수 조건을 만족하는 수를 전수 합산하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PRIME_FACTORIZATION",
    "CC_REDUCING_FRACTION"
  ],
  "conditionKeys": [
    "COND_NATURAL",
    "COND_RANGE"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분자와의 약분 가능 여부(x=3, 6 허용, x=9 배제)를 단계적으로 검증하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "기약분수",
      "분수"
    ],
    "goal": [
      "자연수"
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

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

다음 중 계산 결과가 나머지 넷과 다른 하나를 고르면? \[4점\]

### 선지

① \$a^5 \\times a^3\$ ② \$a^{16} \\div a^2\$ ③ \$(a^2)^4\$ ④ \$(ab)^4 \\div \\left(\\dfrac{b}{a}\\right)^4\$ ⑤ \$a \\times a^3 \\times a^4\$

### 정답

②

### 해설

지수법칙을 적용하여 각 선지의 식을 밑 \$a\$의 단일 거듭제곱으로 정리한다. \$\$ \\begin{aligned} \\text{① } & a^5 \\times a^3 \= a^{5+3} \= a^8 \\ \\text{② } & a^{16} \\div a^2 \= a^{16-2} \= a^{14} \\ \\text{③ } & (a^2)^4 \= a^{2 \\times 4} \= a^8 \\ \\text{④ } & (ab)^4 \\div \\left(\\frac{b}{a}\\right)^4 \= a^4b^4 \\div \\frac{b^4}{a^4} \= a^4b^4 \\times \\frac{a^4}{b^4} \= a^{4+4} \= a^8 \\ \\text{⑤ } & a \\times a^3 \\times a^4 \= a^{1+3+4} \= a^8 \\end{aligned} \$\$ ①, ③, ④, ⑤의 계산 결과는 모두 \$a^8\$이지만, ②만 \$a^{14}\$이다. 따라서 나머지 넷과 다른 하나는 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "지수법칙 4가지(곱, 거듭제곱, 나눗셈, 분수 거듭제곱) 적용 결과 일치 비교 문항"
}
```

```
{
  "sourceQid": 6,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "EXPONENT_LAWS_COMPARATIVE_AUDIT",
  "primaryMethod": "지수법칙으로 각 식을 a^8 또는 a^14로 단순화하여 다른 하나를 찾는다.",
  "decisiveStep": "② a^{16} / a^2 = a^{14} != a^8 식별",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수법칙 종합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_LAWS_EQUIVALENCE",
    "templateKey": "TPL_EXPONENT_EXPRESSION_DIFFERENT_ONE",
    "why": "다양한 지수법칙 표현식들의 결과를 표준 거듭제곱형으로 환원해 비교하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기본 지수법칙을 각각 적용하여 동일한 결과를 갖지 않는 선지를 고르는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "거듭제곱"
    ],
    "method": [
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

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

컴퓨터에서 데이터의 양을 나타내는 가장 작은 단위를 \$1\\text{ bit}\$(비트)라고 한다. 데이터의 양의 단위 사이의 관계가 다음과 같을 때, \$8\\text{ MB}\$는 몇 \$\\text{bit}\$인가? \[4점\]

- \$1\\text{ B} \= 2^3\\text{ bit}\$  
- \$1\\text{ KB} \= 2^{10}\\text{ B}\$  
- \$1\\text{ MB} \= 2^{10}\\text{ KB}\$

### 선지

① \$2^{26}\\text{ bit}\$ ② \$2^{27}\\text{ bit}\$ ③ \$2^{28}\\text{ bit}\$ ④ \$2^{29}\\text{ bit}\$ ⑤ \$2^{30}\\text{ bit}\$

### 정답

①

### 해설

주어진 단위 환산 관계를 거듭제곱의 곱셈으로 차례대로 연결한다. 1단계: \$1\\text{ MB}\$를 \$\\text{bit}\$ 단위로 변환한다. \$\$ \\begin{aligned} 1\\text{ MB} &= 2^{10}\\text{ KB} \\ &= 2^{10} \\times 2^{10}\\text{ B} \= 2^{20}\\text{ B} \\ &= 2^{20} \\times 2^3\\text{ bit} \= 2^{23}\\text{ bit} \\end{aligned} \$\$ 2단계: \$8\\text{ MB}\$를 밑이 \$2\$인 거듭제곱으로 나타낸다. \$\$ 8 \= 2^3 \$\$ 따라서 \$8\\text{ MB}\$는 다음과 같다. \$\$ 8\\text{ MB} \= 2^3 \\times 1\\text{ MB} \= 2^3 \\times 2^{23}\\text{ bit} \= 2^{3 \+ 23}\\text{ bit} \= 2^{26}\\text{ bit} \$\$ 그러므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "데이터 단위 환산의 2의 거듭제곱 지수 덧셈 법칙 적용 문항"
}
```

```
{
  "sourceQid": 7,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "BINARY_DATA_UNIT_EXPONENT",
  "primaryMethod": "8 MB = 2^3 * 2^10 * 2^10 * 2^3 = 2^(3+10+10+3) = 2^26 bit를 계산한다.",
  "decisiveStep": "지수들의 합 3 + 10 + 10 + 3 = 26 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수의 합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_DATA_UNIT_EXPONENT_CHAIN",
    "templateKey": "TPL_BINARY_UNIT_CHAIN_EXPONENT_SUM",
    "why": "데이터 저장 용량 단위를 밑 2의 거듭제곱의 합 법칙으로 누적 계산하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "밑 2의 거듭제곱 곱셈 법칙을 실생활 단위 환산에 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "거듭제곱"
    ],
    "method": [
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

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

\$2^5 \= A\$일 때, \$\\dfrac{1}{16^5}\$을 \$A\$를 사용하여 나타내면? \[4점\]

### 선지

① \$\\dfrac{1}{A^2}\$ ② \$\\dfrac{1}{A^3}\$ ③ \$A^4\$ ④ \$\\dfrac{1}{A^5}\$ ⑤ \$\\dfrac{1}{A^4}\$

### 정답

⑤

### 해설

밑 \$16\$을 소인수 \$2\$의 거듭제곱으로 변형하여 \$2^5 \= A\$와 연결한다. 1단계: \$16\$은 \$2^4\$이므로 \$16^5\$의 지수를 변형한다. \$\$ 16^5 \= (2^4)^5 \= 2^{4 \\times 5} \= 2^{20} \$\$ 2단계: \$2^{20}\$을 \$2^5\$의 거듭제곱 형태로 변형한다. \$\$ 2^{20} \= (2^5)^4 \$\$ 3단계: \$2^5 \= A\$를 대입한다. \$\$ 16^5 \= A^4 \$\$ 따라서 역수를 취하면 다음과 같다. \$\$ \\frac{1}{16^5} \= \\frac{1}{A^4} \$\$ 그러므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "거듭제곱의 곱셈 성질을 이용한 밑 변환 및 문자 대입 표현 문항"
}
```

```
{
  "sourceQid": 8,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "POWER_BASE_CHANGE_REPRESENTATION",
  "primaryMethod": "16^5 = (2^4)^5 = 2^20 = (2^5)^4 = A^4로부터 1/16^5 = 1/A^4를 구한다.",
  "decisiveStep": "16^5 = (2^5)^4 = A^4의 지수 분해 및 역수 취하기",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수법칙의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POWER_VARIABLE_REPRESENTATION",
    "templateKey": "TPL_EXPONENT_SUBSTITUTION_POWER_OF_BASE",
    "why": "소인수 밑 변환을 통해 거듭제곱을 기준 문자의 거듭제곱으로 나타내는 템플릿"
  },
  "crossConceptKeys": [
    "CC_VARIABLE_SUBSTITUTION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "밑 16을 밑 2로 바꾸고 지수를 20 = 5*4로 묶어 대입하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "거듭제곱"
    ],
    "method": [
      "대입",
      "연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

\$(-3x^A y^2)^2 \\times x^4 y^3 \\div \\left(\\dfrac{x}{y^3}\\right)^B \= C x^7 y^{16}\$일 때, 세 상수 \$A, B, C\$에 대하여 \$A \+ B \+ C\$의 값을 구하면? \[4점\]

### 선지

① \$13\$ ② \$14\$ ③ \$15\$ ④ \$16\$ ⑤ \$17\$

### 정답

③

### 해설

좌변을 지수법칙을 이용하여 정리한 후 우변의 계수 및 지수와 비교한다. 1단계: 좌변의 거듭제곱과 곱셈, 나눗셈을 전개한다. \$\$ (-3x^A y^2)^2 \= (-3)^2 (x^A)^2 (y^2)^2 \= 9 x^{2A} y^4 \$\$ \$\$ 9 x^{2A} y^4 \\times x^4 y^3 \= 9 x^{2A \+ 4} y^{4 \+ 3} \= 9 x^{2A \+ 4} y^7 \$\$ \$\$ \\div \\left(\\frac{x}{y^3}\\right)^B \= \\div \\frac{x^B}{y^{3B}} \= \\times \\frac{y^{3B}}{x^B} \$\$ 따라서 좌변은 다음과 같다. \$\$ 9 x^{2A \+ 4 \- B} y^{7 \+ 3B} \$\$ 2단계: 우변 \$C x^7 y^{16}\$과 계수 및 각 문자의 지수를 비교한다.

- 계수 비교: \$\$ C \= 9 \$\$  
- \$y\$의 지수 비교: \$\$ 7 \+ 3B \= 16 \\implies 3B \= 9 \\implies B \= 3 \$\$  
- \$x\$의 지수 비교: \$\$ 2A \+ 4 \- B \= 7 \\implies 2A \+ 4 \- 3 \= 7 \\implies 2A \+ 1 \= 7 \\implies 2A \= 6 \\implies A \= 3 \$\$ 3단계: \$A \+ B \+ C\$의 값을 구한다. \$\$ A \+ B \+ C \= 3 \+ 3 \+ 9 \= 15 \$\$ 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식 곱셈·나눗셈의 혼합 계산 및 계수·지수 연립 비교 문항"
}
```

```
{
  "sourceQid": 9,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "COMPOSITE_MONOMIAL_SYSTEM",
  "primaryMethod": "좌변을 9 x^(2A+4-B) y^(7+3B)로 정리하고 C=9, 7+3B=16(B=3), 2A+4-3=7(A=3)을 구해 합 15를 계산한다.",
  "decisiveStep": "B=3 도출 후 A=3, C=9를 차례로 구해 3+3+9=15 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "단항식의 계산 종합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_SYSTEM_EQUATION",
    "templateKey": "TPL_MONOMIAL_COEFFICIENT_EXPONENTS_SOLVE",
    "why": "단항식의 계수 및 각 변수의 지수를 연립방정식으로 풀어 상수를 결정하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호, x의 지수 방정식, y의 지수 방정식을 연계하여 3개 상수를 구하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "단항식",
      "거듭제곱"
    ],
    "goal": [
      "상수"
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

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

다음 식 \$a(6a \- 4b) \- a(8a \- 11b)\$를 전개하여 간단히 했을 때, \$a^2\$의 계수를 \$A\$, \$ab\$의 계수를 \$B\$라 하자. 이때 \$A \+ B\$의 값을 구하면? \[4점\]

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

④

### 해설

분배법칙으로 괄호를 풀고 동류항끼리 모아 정리한다. \$\$ \\begin{aligned} a(6a \- 4b) \- a(8a \- 11b) &= (6a^2 \- 4ab) \- (8a^2 \- 11ab) \\ &= 6a^2 \- 4ab \- 8a^2 \+ 11ab \\ &= (6 \- 8)a^2 \+ (-4 \+ 11)ab \\ &= \-2a^2 \+ 7ab \\end{aligned} \$\$ 따라서 \$a^2\$의 계수 \$A \= \-2\$, \$ab\$의 계수 \$B \= 7\$이다. 두 계수의 합을 구하면 \$\$ A \+ B \= \-2 \+ 7 \= 5 \$\$ 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식과 다항식의 분배법칙 전개 및 동류항 계수 합 계산 문항"
}
```

```
{
  "sourceQid": 10,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_DISTRIBUTIVE_COEFFICIENT_SUM",
  "primaryMethod": "분배법칙으로 전개하여 -2a^2 + 7ab를 얻은 뒤 A=-2, B=7의 합 -2+7=5를 계산한다.",
  "decisiveStep": "-4ab - (-11ab) = 7ab 부호 처리 후 A+B=5 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식과 다항식의 곱셈",
    "l4": "다항식의 전개와 계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONO_POLY_EXPANSION_SUM",
    "templateKey": "TPL_MONO_POLY_SUBTRACTION_COEFFICIENT_SUM",
    "why": "두 단항식과 다항식 곱의 차를 전개하여 계수들의 합을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_COEFFICIENT"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분배법칙과 동류항 정리를 통해 계수를 직접 계산하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "다항식",
      "계수"
    ],
    "goal": [
      "계수"
    ],
    "method": [
      "전개",
      "분배법칙",
      "연산"
    ],
    "condition": [
      "동류항"
    ]
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

다음 \$\\square\$ 안에 알맞은 식을 구하면? \[4점\]

\$\$\\dfrac{3}{2}xy \\times (\\square) \\div x^2y \= 12x^2y \- 18xy^2\$\$

### 선지

① \$8x^3y \- 12x^2y^2\$ ② \$8x^2y \- 12xy^2\$ ③ \$6x^3y \- 9x^2y^2\$ ④ \$18x^3y \- 27x^2y^2\$ ⑤ \$8xy \- 12y^2\$

### 정답

①

### 해설

등식의 성질과 역연산을 이용하여 \$\\square\$에 대하여 식을 푼다. 1단계: \$\\square\$를 구하기 위해 양변에 \$x^2y\$를 곱하고 \$\\dfrac{3}{2}xy\$로 나눈다. \$\$ \\begin{aligned} \\square &= (12x^2y \- 18xy^2) \\times x^2y \\div \\left(\\frac{3}{2}xy\\right) \\ &= (12x^2y \- 18xy^2) \\times x^2y \\times \\frac{2}{3xy} \\end{aligned} \$\$ 2단계: 먼저 \$x^2y \\times \\dfrac{2}{3xy}\$를 계산한다. \$\$ \\frac{2x^2y}{3xy} \= \\frac{2x}{3} \$\$ 3단계: 다항식에 분배하여 곱한다. \$\$ \\begin{aligned} \\square &= (12x^2y \- 18xy^2) \\times \\frac{2x}{3} \\ &= 12x^2y \\times \\frac{2x}{3} \- 18xy^2 \\times \\frac{2x}{3} \\ &= 4 \\times 2 x^{2+1}y \- 6 \\times 2 x^{1+1}y^2 \\ &= 8x^3y \- 12x^2y^2 \\end{aligned} \$\$ 따라서 알맞은 식은 \$8x^3y \- 12x^2y^2\$이므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식 곱셈·나눗셈 역연산을 통한 빈칸 다항식 계산 문항"
}
```

```
{
  "sourceQid": 11,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_ISOLATION_INVERSE_OP",
  "primaryMethod": "빈칸 = (12x^2y - 18xy^2) * (2x/3) = 8x^3y - 12x^2y^2 역연산으로 고립시켜 분배한다.",
  "decisiveStep": "x^2y * 2/(3xy) = 2x/3 계산 후 다항식 각 항에 분배",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식과 다항식의 곱셈과 나눗셈",
    "l4": "어떤 식 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FIND_UNKNOWN_POLYNOMIAL",
    "templateKey": "TPL_INVERSE_OPERATION_ISOLATE_BOX",
    "why": "단항식 곱셈과 나눗셈이 결합된 등식에서 미지의 다항식을 역연산으로 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_NONZERO"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "역수 곱셈으로 미지 다항식을 격리한 뒤 다항식 분배법칙을 전개하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "다항식",
      "단항식"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
      "사칙연산",
      "분배법칙",
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

어떤 다항식을 \$-\\dfrac{1}{2}xy\$로 나누어야 할 것을 잘못하여 곱했더니 \$4x^2y \- 8xy^2\$이 되었다. 이때 바르게 계산한 식을 구하면? \[4점\]

### 선지

① \$-\\dfrac{16}{y} \+ \\dfrac{32}{x}\$ ② \$-\\dfrac{8}{y} \+ \\dfrac{16}{x}\$ ③ \$\\dfrac{16}{y} \- \\dfrac{32}{x}\$ ④ \$\\dfrac{32}{x} \- \\dfrac{16}{y}\$ ⑤ \$16x \- 32y\$

### 정답

③

### 해설

어떤 다항식을 먼저 구한 후 원래의 나눗셈을 바르게 수행한다. 1단계: 어떤 다항식을 \$P\$라 하자. 잘못하여 곱한 결과가 \$4x^2y \- 8xy^2\$이므로 \$\$ P \\times \\left(-\\frac{1}{2}xy\\right) \= 4x^2y \- 8xy^2 \$\$ 양변을 \$-\\dfrac{1}{2}xy\$로 나눈다. \$\$ \\begin{aligned} P &= (4x^2y \- 8xy^2) \\div \\left(-\\frac{1}{2}xy\\right) \\ &= (4x^2y \- 8xy^2) \\times \\left(-\\frac{2}{xy}\\right) \\ &= \-8x \+ 16y \\end{aligned} \$\$ 2단계: 바르게 계산한 식을 구한다. \$P\$를 원래 나누어야 했던 \$-\\dfrac{1}{2}xy\$로 나눈다. \$\$ \\begin{aligned} P \\div \\left(-\\frac{1}{2}xy\\right) &= (-8x \+ 16y) \\times \\left(-\\frac{2}{xy}\\right) \\ &= \\frac{(-8x) \\times (-2)}{xy} \+ \\frac{16y \\times (-2)}{xy} \\ &= \\frac{16x}{xy} \- \\frac{32y}{xy} \\ &= \\frac{16}{y} \- \\frac{32}{x} \\end{aligned} \$\$ 따라서 바르게 계산한 식은 \$\\dfrac{16}{y} \- \\dfrac{32}{x}\$이므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "잘못된 곱셈 결과로부터 원식을 복원하고 원래 나눗셈을 적용하는 2단계 문항"
}
```

```
{
  "sourceQid": 12,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "WRONG_OPERATION_CORRECT_EXPRESSION",
  "primaryMethod": "원식 P = (4x^2y - 8xy^2) * (-2/xy) = -8x + 16y를 구하고 P * (-2/xy) = 16/y - 32/x를 계산한다.",
  "decisiveStep": "P = -8x + 16y 복원 후 다시 (-2/xy)를 곱해 16/y - 32/x 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식과 다항식의 곱셈과 나눗셈",
    "l4": "바르게 계산한 식 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_CORRECT_CALCULATION_UNKNOWN",
    "templateKey": "TPL_REVERSE_WRONG_OPERATION_THEN_REAPPLY",
    "why": "잘못 적용된 연산의 역연산으로 원래 식을 복원하고 올바른 연산을 수행하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_NONZERO"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "역연산으로 원래 다항식을 찾고 다시 나눗셈을 연속 적용하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "다항식",
      "단항식"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
      "사칙연산",
      "분배법칙",
      "연산"
    ],
    "condition": [
      "동류항"
    ]
  },
  "hold": ""
}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

다음 식 \$\\dfrac{4x \- 2x^3}{x} \- \\dfrac{9x^3 \- 7x^5}{x^3}\$을 바르게 계산하면? \[4점\]

### 선지

① \$5x^2 \+ 5\$ ② \$5x^2 \- 5\$ ③ \$-5x^2 \- 5\$ ④ \$9x^2 \- 5\$ ⑤ \$5x^2 \- 9\$

### 정답

②

### 해설

두 분수식을 각각 항별로 약분하여 정리한 후 뺄셈을 수행한다. 1단계: 첫 번째 분수식을 계산한다. \$\$ \\frac{4x \- 2x^3}{x} \= \\frac{4x}{x} \- \\frac{2x^3}{x} \= 4 \- 2x^2 \$\$ 2단계: 두 번째 분수식을 계산한다. \$\$ \\frac{9x^3 \- 7x^5}{x^3} \= \\frac{9x^3}{x^3} \- \\frac{7x^5}{x^3} \= 9 \- 7x^2 \$\$ 3단계: 두 식의 뺄셈을 괄호를 풀어 계산한다. \$\$ \\begin{aligned} (4 \- 2x^2) \- (9 \- 7x^2) &= 4 \- 2x^2 \- 9 \+ 7x^2 \\ &= (-2 \+ 7)x^2 \+ (4 \- 9\) \\ &= 5x^2 \- 5 \\end{aligned} \$\$ 따라서 바르게 계산한 식은 \$5x^2 \- 5\$이므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식의 단항식 나눗셈 항별 약분 및 다항식 뺄셈 문항"
}
```

```
{
  "sourceQid": 13,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_BY_MONOMIAL_SUBTRACTION",
  "primaryMethod": "(4 - 2x^2) - (9 - 7x^2) = 5x^2 - 5로 각 항별 약분 후 뺀다.",
  "decisiveStep": "-(9 - 7x^2) = -9 + 7x^2 부호 분배 후 동류항 정리",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "다항식의 나눗셈",
    "l4": "다항식과 단항식의 나눗셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLY_DIV_MONO_SUBTRACT",
    "templateKey": "TPL_TWO_FRACTION_POLYNOMIAL_SUBTRACTION",
    "why": "단항식 분모를 갖는 두 다항식 분수의 차를 항별 약분으로 정리하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_NONZERO"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 분수식을 약분하여 동류항을 더하고 빼는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "다항식",
      "단항식"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
      "사칙연산",
      "연산"
    ],
    "condition": [
      "동류항"
    ]
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

두 원기둥 A, B가 있다. 원기둥 B의 높이는 원기둥 A의 높이의 \$\\dfrac{1}{3}\$배이고, 원기둥 B의 밑면의 반지름의 길이는 원기둥 A의 밑면의 반지름의 길이의 \$2\$배이다. 이때 원기둥 A의 부피는 원기둥 B의 부피의 몇 배인지 구하면? \[4점\]

### 선지

① \$\\dfrac{1}{4}\$배 ② \$\\dfrac{1}{3}\$배 ③ \$\\dfrac{2}{3}\$배 ④ \$\\dfrac{4}{3}\$배 ⑤ \$\\dfrac{3}{4}\$배

### 정답

⑤

### 해설

원기둥의 부피 공식 \$V \= \\pi r^2 h\$를 적용하여 두 원기둥의 부피의 비를 구한다. 1단계: 원기둥 A의 밑면의 반지름의 길이를 \$r\$, 높이를 \$h\$라 하자. 원기둥 A의 부피는 다음과 같다. \$\$ V\_A \= \\pi r^2 h \$\$ 2단계: 원기둥 B의 반지름과 높이를 \$r, h\$로 나타내어 부피를 구한다. 원기둥 B의 반지름은 \$2r\$, 높이는 \$\\dfrac{1}{3}h\$이므로 \$\$ V\_B \= \\pi (2r)^2 \\times \\left(\\frac{1}{3}h\\right) \= \\pi \\times 4r^2 \\times \\frac{1}{3}h \= \\frac{4}{3}\\pi r^2 h \= \\frac{4}{3}V\_A \$\$ 3단계: 원기둥 A의 부피가 원기둥 B의 부피의 몇 배인지 계산한다. \$\$ V\_A \= \\frac{3}{4}V\_B \$\$ 따라서 원기둥 A의 부피는 원기둥 B의 부피의 \$\\dfrac{3}{4}\$배이므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "원기둥 부피 공식을 단항식 거듭제곱 및 비례 관계로 해석하는 문항"
}
```

```
{
  "sourceQid": 14,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "CYLINDER_VOLUME_RATIO_ALGEBRA",
  "primaryMethod": "V_B = pi*(2r)^2*(h/3) = (4/3)*pi*r^2*h = (4/3)V_A에서 V_A = (3/4)V_B를 구한다.",
  "decisiveStep": "반지름 2배 시 넓이 4배, 높이 1/3배 결합으로 V_B = 4/3 V_A 도출 후 역수 취하기",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "도형에서의 단항식의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_CYLINDER_VOLUME_RATIO",
    "templateKey": "TPL_GEOMETRIC_VOLUME_RATIO_EXPONENT",
    "why": "입체도형 부피 공식을 미지수 배수 관계식으로 모델링하여 비를 산출하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_GEOMETRIC_VOLUME"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "반지름 제곱의 비례 효과와 높이의 선형 비례를 결합하여 상대적 비를 산출하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "원기둥",
      "부피"
    ],
    "goal": [
      "유리수"
    ],
    "method": [
      "사칙연산",
      "연산"
    ],
    "condition": [
      "넓이"
    ]
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 3

### 발문

다음 \<보기\> 중에서 일차부등식이 아닌 것만을 있는 대로 고른 것은? \[3점\]

\<보기\> ㄱ. \$9 \- 3x \= 2x \- 1\$ ㄴ. \$3x \+ 4 \> 0\$ ㄷ. \$x \> 7\$ ㄹ. \$2x^2 \- x \\ge 2x^2 \+ 3x \- 5\$ ㅁ. \$-\\dfrac{1}{2x} \- \\dfrac{3}{5} \\ge \\dfrac{1}{5x}\$

### 선지

① ㄱ, ㄴ ② ㄱ, ㅁ ③ ㄴ, ㄷ ④ ㄷ, ㄹ ⑤ ㄹ, ㅁ

### 정답

②

### 해설

부등식을 모든 항을 좌변으로 이항하여 정리했을 때, \$(\\text{일차식}) \> 0, \< 0, \\ge 0, \\le 0\$의 형태가 되는지를 점검한다. \$\$ \\begin{aligned} \\text{ㄱ: } & 9 \- 3x \= 2x \- 1 \\implies \-5x \+ 10 \= 0 \\ & \\text{부등호가 없고 등호만 있는 일차방정식이다. (일차부등식 아님)} \\ \\text{ㄴ: } & 3x \+ 4 \> 0 \\ & \\text{좌변이 일차식인 일차부등식이다. (일차부등식 맞음)} \\ \\text{ㄷ: } & x \- 7 \> 0 \\ & \\text{좌변이 일차식인 일차부등식이다. (일차부등식 맞음)} \\ \\text{ㄹ: } & 2x^2 \- x \\ge 2x^2 \+ 3x \- 5 \\ & 2x^2 \- x \- 2x^2 \- 3x \+ 5 \\ge 0 \\implies \-4x \+ 5 \\ge 0 \\ & \\text{이차항이 소거되고 일차항이 남으므로 일차부등식이다. (일차부등식 맞음)} \\ \\text{ㅁ: } & \-\\frac{1}{2x} \- \\frac{3}{5} \\ge \\frac{1}{5x} \\ & \\text{미지수 } x\\text{가 분모에 있으므로 다항식이 아니며, 일차부등식이 아니다. (일차부등식 아님)} \\end{aligned} \$\$ 따라서 일차부등식이 아닌 것은 ㄱ, ㅁ이므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "일차부등식의 정의(부등호 유무, 이항 후 최고차수 1차 다항식) 판별 문항"
}
```

```
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "LINEAR_INEQUALITY_DEFINITION_CHECK",
  "primaryMethod": "등식(ㄱ)과 분수식(ㅁ)을 일차부등식이 아닌 것으로 가려내고 이차항 소거 식(ㄹ)을 확인한다.",
  "decisiveStep": "방정식 ㄱ과 분모 미지수식 ㅁ을 일차부등식에서 제외",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식과 그 해",
    "l4": "일차부등식의 뜻"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INEQUALITY_IDENTIFY",
    "templateKey": "TPL_IDENTIFY_LINEAR_INEQUALITY_AMONG_EXPRESSIONS",
    "why": "다양한 대수식(방정식, 이차식 소거, 분수식) 중 일차부등식의 정의 부합 여부를 검증하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_SIGN"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차부등식의 정의 요건(부등호, 최고차항 1차)을 직접 대조하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식",
      "다항식"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "이항",
      "차수"
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

다음 문장을 부등식으로 나타낸 것 중 옳지 않은 것은? \[4점\]

### 선지

① \$x\$에서 \$4\$를 뺀 값은 \$x\$의 \$3\$배보다 작다. \$\\rightarrow x \- 4 \< 3x\$ ② 이 놀이기구는 키가 \$120\\text{ cm}\$ 이상 탑승 가능하다. (탑승객의 키: \$x\\text{ cm}\$) \$\\rightarrow x \\ge 120\$ ③ \$1\$개에 \$800\$원인 빵 \$x\$개의 가격은 \$5{,}000\$원 이하이다. \$\\rightarrow 800x \\le 5000\$ ④ 한 자루에 \$1{,}200\$원인 볼펜 \$5\$자루의 값과 필통 값 \$4{,}000\$원을 합한 금액이 \$15{,}000\$원보다 적다. \$\\rightarrow 1200 \+ 5 \+ 4000 \< 15000\$ ⑤ 길이가 \$x\\text{ m}\$인 끈에서 \$5\\text{ m}\$를 사용하고 남은 길이는 \$3\\text{ m}\$보다 길다. \$\\rightarrow x \- 5 \> 3\$

### 정답

④

### 해설

문장의 수량 관계를 부등호 및 사칙연산 기호로 옳게 나타내었는지 검토한다. \$\$ \\begin{aligned} \\text{① } & x\\text{에서 } 4\\text{를 뺀 값: } x \- 4, \\quad x\\text{의 } 3\\text{배보다 작다: } \< 3x \\implies x \- 4 \< 3x \\text{ (옳음)} \\ \\text{② } & x\\text{가 } 120 \\text{ 이상: } x \\ge 120 \\text{ (옳음)} \\ \\text{③ } & 1\\text{개에 } 800\\text{원인 빵 } x\\text{개의 가격: } 800x, \\quad 5000\\text{원 이하: } \\le 5000 \\implies 800x \\le 5000 \\text{ (옳음)} \\ \\text{④ } & 1\\text{자루에 } 1{,}200\\text{원인 볼펜 } 5\\text{자루의 값은 } 1200 \\times 5\\text{원이다.} \\ & \\text{필통 값 } 4{,}000\\text{원을 더한 총금액은 } 1200 \\times 5 \+ 4000\\text{이어야 한다.} \\ & \\text{선지에서는 } 1200 \+ 5 \+ 4000\\text{으로 곱셈을 덧셈으로 잘못 표기하였다. (옳지 않음)} \\ \\text{⑤ } & x\\text{에서 } 5\\text{를 사용하고 남은 길이: } x \- 5, \\quad 3\\text{보다 길다: } \> 3 \\implies x \- 5 \> 3 \\text{ (옳음)} \\end{aligned} \$\$ 따라서 옳지 않은 것은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "일상 언어의 수량 관계 및 부등호 번역의 곱셈·덧셈 오류 검증 문항"
}
```

```
{
  "sourceQid": 16,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "VERBAL_TO_INEQUALITY_MODELING",
  "primaryMethod": "볼펜 5자루의 가격 1200*5를 1200+5로 잘못 표현한 ④의 식 오류를 식별한다.",
  "decisiveStep": "1200*5+4000과 1200+5+4000의 곱셈/덧셈 혼동 오류 검출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식과 그 해",
    "l4": "부등식으로 나타내기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_VERBAL_INEQUALITY_FORMULATION",
    "templateKey": "TPL_STATEMENT_TO_INEQUALITY_ACCURACY",
    "why": "문장제 조건을 대수 부등식으로 번역할 때 곱셈과 덧셈 연산자 오류를 선별하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_SIGN"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "문장의 곱셈 관계(개수*단가)를 직관적으로 확인하여 오류를 가려내는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "부등식",
      "연산"
    ],
    "condition": [
      "부등식"
    ]
  },
  "hold": ""
}
```

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

일차부등식 \$2 \- 0.5x \\le 0.5\$를 만족시키는 \$x\$의 값 중에서 가장 작은 정수는? \[4점\]

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

③

### 해설

소수 계수를 정수로 변형하여 부등식을 푼다. 1단계: 양변에 \$10\$을 곱한다. \$\$ 20 \- 5x \\le 5 \$\$ 2단계: 상수항 \$20\$을 우변으로 이항한다. \$\$ \-5x \\le 5 \- 20 \\implies \-5x \\le \-15 \$\$ 3단계: 양변을 음수 \$-5\$로 나누면 부등호의 방향이 바뀐다. \$\$ x \\ge \\frac{-15}{-5} \\implies x \\ge 3 \$\$ 4단계: \$x \\ge 3\$을 만족시키는 가장 작은 정수는 \$3\$이다. 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "소수 계수 일차부등식의 풀이 및 정수 해 최솟값 결정 문항"
}
```

```
{
  "sourceQid": 17,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "DECIMAL_INEQUALITY_MIN_INTEGER",
  "primaryMethod": "10을 곱해 20 - 5x <= 5에서 -5x <= -15, 즉 x >= 3을 풀어 최소 정수 3을 구한다.",
  "decisiveStep": "음수 -5로 나눌 때 부등호 방향 역전하여 x >= 3 산출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "계수가 소수인 일차부등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_DECIMAL_INEQUALITY_SOLVE",
    "templateKey": "TPL_DECIMAL_COEFFICIENT_MIN_INTEGER",
    "why": "소수 계수 일차부등식을 풀고 부등식 영역 내 최소 정수를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "계수를 정수화하고 음수 나눗셈 시 부등호 역전을 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식",
      "정수"
    ],
    "goal": [
      "정수"
    ],
    "method": [
      "이항",
      "부등식"
    ],
    "condition": [
      "대소비교"
    ]
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

\$a \< b\$일 때, 다음 중 옳지 않은 것은? \[4점\]

### 선지

① \$a \- 4 \< b \- 4\$ ② \$4a \+ 3 \< 4b \+ 3\$ ③ \$-\\dfrac{a}{3} \> \-\\dfrac{b}{3}\$ ④ \$7 \- a \> 7 \- b\$ ⑤ \$-\\dfrac{a \+ 3}{2} \< \-\\dfrac{b \+ 3}{2}\$

### 정답

⑤

### 해설

부등식의 양변에 음수를 곱하거나 나눌 때만 부등호의 방향이 바뀐다는 기본 성질을 검토한다. \$\$ \\begin{aligned} \\text{① } & a \< b\\text{의 양변에서 } 4\\text{를 빼면 } a \- 4 \< b \- 4 \\text{ (참)} \\ \\text{② } & a \< b\\text{의 양변에 } 4\\text{를 곱하고 } 3\\text{을 더하면 } 4a \+ 3 \< 4b \+ 3 \\text{ (참)} \\ \\text{③ } & a \< b\\text{의 양변을 음수 } \-3\\text{으로 나누면 부등호 방향이 바뀌어 } \-\\frac{a}{3} \> \-\\frac{b}{3} \\text{ (참)} \\ \\text{④ } & a \< b\\text{의 양변에 } \-1\\text{을 곱하면 } \-a \> \-b, \\quad 7\\text{을 더하면 } 7 \- a \> 7 \- b \\text{ (참)} \\ \\text{⑤ } & a \< b\\text{의 양변에 } 3\\text{을 더하면 } a \+ 3 \< b \+ 3, \\ & \\text{양변을 음수 } \-2\\text{로 나누면 부등호 방향이 바뀌어 } \-\\frac{a \+ 3}{2} \> \-\\frac{b \+ 3}{2}\\text{이어야 한다.} \\ & \\text{선지에서는 부등호 방향을 바꾸지 않았으므로 옳지 않다. (거짓)} \\end{aligned} \$\$ 따라서 옳지 않은 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "부등식 기본 연산 성질(음수 나눗셈 시 부등호 역전) 진위 판별 문항"
}
```

```
{
  "sourceQid": 18,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_PROPERTIES_TRANSFORMATION",
  "primaryMethod": "양변을 -2로 나눌 때 부등호가 반대로 바뀌어야 하므로 ⑤가 옳지 않음을 식별한다.",
  "decisiveStep": "-(a+3)/2 > -(b+3)/2이어야 함을 확인하여 ⑤의 오류 판정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질 종합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PROPERTIES",
    "templateKey": "TPL_INEQUALITY_TRANSFORM_SIGN_CHECK",
    "why": "다단계 부등식 변형식에서 음수 나눗셈 부등호 방향 오류를 검출하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_SIGN"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 성질의 핵심인 음수 나눗셈 시 부등호 반전 여부를 판별하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "대소비교"
    ],
    "method": [
      "부호",
      "이항"
    ],
    "condition": [
      "음수"
    ]
  },
  "hold": ""
}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

다음 두 일차부등식의 해가 같을 때, 상수 \$a\$의 값은? \[4점\]

\$\$\\dfrac{1}{2}x \< \\dfrac{3}{4} \+ \\dfrac{1}{8}x, \\quad 2(a \- 0.2x) \> x\$\$

### 선지

① \$\\dfrac{7}{5}\$ ② \$\\dfrac{8}{5}\$ ③ \$\\dfrac{9}{5}\$ ④ \$2\$ ⑤ \$\\dfrac{11}{5}\$

### 정답

①

### 해설

두 부등식을 각각 풀어 해의 범위를 비교한다. 1단계: 첫 번째 부등식의 양변에 분모의 최소공배수 \$8\$을 곱한다. \$\$ \\begin{aligned} 8 \\times \\frac{1}{2}x &\< 8 \\times \\left(\\frac{3}{4} \+ \\frac{1}{8}x\\right) \\ 4x &\< 6 \+ x \\ 3x &\< 6 \\ x &\< 2 \\end{aligned} \$\$ 2단계: 두 번째 부등식을 푼다. \$\$ \\begin{aligned} 2a \- 0.4x &\> x \\ \-0.4x \- x &\> \-2a \\ \-1.4x &\> \-2a \\end{aligned} \$\$ 양변에 \$-10\$을 곱하면 부등호의 방향이 바뀐다. \$\$ 14x \< 20a \\implies x \< \\frac{20a}{14} \= \\frac{10a}{7} \$\$ 3단계: 두 부등식의 해가 서로 같으므로 경계값을 비교한다. \$\$ \\begin{aligned} \\frac{10a}{7} &= 2 \\ 10a &= 14 \\ a &= \\frac{14}{10} \= \\frac{7}{5} \\end{aligned} \$\$ 따라서 상수 \$a\$의 값은 \$\\dfrac{7}{5}\$이므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "분수 및 소수 계수 일차부등식 해의 일치를 이용한 상수 산출 문항"
}
```

```
{
  "sourceQid": 19,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "EQUIVALENT_INEQUALITIES_COEFFICIENT",
  "primaryMethod": "첫째 부등식 해 x < 2와 둘째 부등식 해 x < 10a/7을 같다고 놓아 a = 7/5를 구한다.",
  "decisiveStep": "10a/7 = 2 일차방정식 해결로 a = 7/5 도출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "해가 서로 같은 일차부등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_IDENTICAL_INEQUALITIES_SOLVE",
    "templateKey": "TPL_EQUIVALENT_INEQUALITIES_PARAMETER",
    "why": "두 일차부등식을 표준형으로 각각 풀고 해가 일치하도록 상수를 결정하는 템플릿"
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
  "difficultyReason": "분수 부등식과 소수 괄호 부등식을 각각 풀고 해의 경계를 일치시키는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "부등식",
      "해"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "방정식",
      "이항"
    ],
    "condition": [
      "유리수"
    ]
  },
  "hold": ""
}
```

## Q20

- 형식: 객관식  
- 배점: 5

### 발문

서우가 산을 등산하는 데, 올라갈 때는 시속 \$3\\text{ km}\$로 걷고, 정상에서 \$20\$분 동안 휴식을 취한 후, 내려올 때는 같은 길을 시속 \$4\\text{ km}\$로 걸어서 총 \$2\$시간 \$40\$분 이내에 산행을 마치려고 한다. 서우가 최대 몇 \$\\text{km}\$ 떨어진 곳까지 올라갔다 올 수 있는지 구하면? \[5점\]

### 선지

① \$\\dfrac{5}{2}\\text{ km}\$ ② \$3\\text{ km}\$ ③ \$\\dfrac{7}{2}\\text{ km}\$ ④ \$4\\text{ km}\$ ⑤ \$\\dfrac{9}{2}\\text{ km}\$

### 정답

④

### 해설

등산 코스의 편도 거리를 \$x\\text{ km}\$라 두고 시간 부등식을 세운다. 1단계: 단위(시간)를 일치시킨다.

- 휴식 시간: \$20\\text{분} \= \\dfrac{20}{60}\\text{시간} \= \\dfrac{1}{3}\\text{시간}\$  
- 총 제한 시간: \$2\\text{시간 } 40\\text{분} \= 2 \+ \\dfrac{40}{60} \= 2 \+ \\dfrac{2}{3} \= \\dfrac{8}{3}\\text{시간}\$ 2단계: 총 소요 시간에 대한 부등식을 세운다. \$\$ (\\text{올라갈 때 시간}) \+ (\\text{휴식 시간}) \+ (\\text{내려올 때 시간}) \\le \\frac{8}{3} \$\$ \$\$ \\frac{x}{3} \+ \\frac{1}{3} \+ \\frac{x}{4} \\le \\frac{8}{3} \$\$ 3단계: 양변에 분모의 최소공배수 \$12\$를 곱한다. \$\$ \\begin{aligned} 4x \+ 4 \+ 3x &\\le 32 \\ 7x \+ 4 &\\le 32 \\ 7x &\\le 28 \\ x &\\le 4 \\end{aligned} \$\$ 따라서 최대 \$4\\text{ km}\$ 떨어진 곳까지 올라갔다 올 수 있으므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "속력·거리·시간 및 휴식 시간을 결합한 일차부등식 실생활 활용 문항"
}
```

```
{
  "sourceQid": 20,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "INEQUALITY_HIKING_SPEED_TIME",
  "primaryMethod": "x/3 + 1/3 + x/4 <= 8/3을 세우고 양변에 12를 곱해 7x <= 28에서 x <= 4를 구한다.",
  "decisiveStep": "20분을 1/3시간, 2시간 40분을 8/3시간으로 단위 변환 후 일차부등식 해결",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 활용",
    "l4": "거리, 속력, 시간에 대한 문제"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_APPLICATION_SPEED",
    "templateKey": "TPL_SPEED_TIME_BREAK_INEQUALITY",
    "why": "왕복 속력과 휴식 시간이 포함된 전체 시간 제약을 부등식으로 모델링하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_TIME_SPEED_DISTANCE"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분 단위를 시간 단위로 변환하고 왕복 분수 부등식을 수립·풀이하는 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "부등식",
      "거리",
      "속력"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "부등식",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "대소비교"
    ]
  },
  "hold": ""
}
```

## Q21

- 형식: 서술형  
- 배점: 6

### 발문

\$A \= 3^3 \+ 3^3 \+ 3^3\$, \$B \= 9^4 \+ 9^4 \+ 9^4\$일 때, 다음 물음에 답하시오. (단, 풀이 과정에 지수법칙을 적용한 과정을 구체적으로 나타낼 것) \[6점\]

(1) \$A, B\$를 각각 \$3\$의 거듭제곱을 사용하여 나타내시오. \[4점\] (2) \$B \\div A\$의 값을 구하시오. \[2점\]

### 선지

없음

### 정답

(1) \$A \= 3^4, B \= 3^9\$  (2) \$3^5\$

### 해설

지수법칙과 거듭제곱의 성질을 단계별로 서술한다.

(1) \[4점\] 동일한 거듭제곱의 덧셈을 곱셈으로 바꾸고 밑을 \$3\$으로 통일한다. \$A\$는 \$3^3\$이 \$3\$개 더해진 것이므로 \$\$ A \= 3^3 \+ 3^3 \+ 3^3 \= 3 \\times 3^3 \= 3^{1 \+ 3} \= 3^4 \\quad \[2\\text{점}\] \$\$ \$B\$는 \$9^4\$이 \$3\$개 더해진 것이고 \$9 \= 3^2\$이므로 \$\$ \\begin{aligned} B &= 9^4 \+ 9^4 \+ 9^4 \= 3 \\times 9^4 \\ &= 3 \\times (3^2)^4 \= 3 \\times 3^{2 \\times 4} \\ &= 3^1 \\times 3^8 \= 3^{1 \+ 8} \= 3^9 \\quad \[2\\text{점}\] \\end{aligned} \$\$

(2) \[2점\] 밑이 같은 거듭제곱의 나눗셈 지수법칙을 적용한다. \$\$ \\begin{aligned} B \\div A &= 3^9 \\div 3^4 \\ &= 3^{9 \- 4} \\ &= 3^5 \\quad \[2\\text{점}\] \\end{aligned} \$\$ (참고: \$3^5 \= 243\$으로 답해도 정답으로 인정한다.)

따라서 (1) \$A \= 3^4, B \= 3^9\$, (2) \$3^5\$이다.

```
{
  "status": "EXEMPT",
  "reason": "동일 거듭제곱 합의 곱셈 변환 및 거듭제곱 나눗셈 지수법칙 서술형 문항"
}
```

```
{
  "sourceQid": 21,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "POWER_SUM_TO_PRODUCT_STEPWISE",
  "primaryMethod": "3*3^3=3^4, 3*(3^2)^4=3^9를 구하고 3^9 / 3^4 = 3^5를 단계별로 서술한다.",
  "decisiveStep": "B = 3 * 9^4 = 3 * 3^8 = 3^9 밑 통일 및 3^9 / 3^4 = 3^5 나눗셈",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수법칙의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_SUM_STEPWISE",
    "templateKey": "TPL_REPEATED_SUM_BASE_UNIFICATION_DIVISION",
    "why": "거듭제곱 덧셈을 곱셈으로 환원하고 밑을 통일하여 지수 나눗셈을 수행하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "덧셈의 곱셈 변환, 거듭제곱의 거듭제곱 밑 변환, 나눗셈 지수 차를 종합 서술하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "거듭제곱"
    ],
    "method": [
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

## Q22

- 형식: 서술형  
- 배점: 7

### 발문

\$x \= \\dfrac{3}{4}, y \= 2\$일 때, 식 \$(8x^2 \- 12xy) \\div (-4x) \- (6x^2y \- 9xy \+ 15xy^2) \\div \\left(\\dfrac{3}{2}xy\\right)\$의 값을 구하려고 한다. 다음 물음에 답하시오. (단, 다항식의 사칙계산을 이용한 풀이 과정을 명확히 나타낼 것) \[7점\]

(1) 주어진 식을 간단히 계산하시오. \[4점\] (2) (1)의 결과에 \$x \= \\dfrac{3}{4}, y \= 2\$를 대입하여 주어진 식의 값을 구하시오. \[3점\]

### 선지

없음

### 정답

(1) \$-6x \- 7y \+ 6\$  (2) \$-\\dfrac{25}{2}\$

### 해설

다항식의 나눗셈을 전개하고 식의 값을 대입하여 계산한다.

(1) \[4점\] 첫 번째 괄호의 나눗셈을 계산한다. \$\$ \\begin{aligned} (8x^2 \- 12xy) \\div (-4x) &= \\frac{8x^2}{-4x} \- \\frac{12xy}{-4x} \\ &= \-2x \+ 3y \\quad \[1.5\\text{점}\] \\end{aligned} \$\$ 두 번째 괄호의 나눗셈을 역수의 곱셈으로 계산한다. \$\$ \\begin{aligned} (6x^2y \- 9xy \+ 15xy^2) \\div \\left(\\frac{3}{2}xy\\right) &= (6x^2y \- 9xy \+ 15xy^2) \\times \\frac{2}{3xy} \\ &= 6x^2y \\times \\frac{2}{3xy} \- 9xy \\times \\frac{2}{3xy} \+ 15xy^2 \\times \\frac{2}{3xy} \\ &= 4x \- 6 \+ 10y \\quad \[1.5\\text{점}\] \\end{aligned} \$\$ 두 식의 뺄셈을 동류항끼리 정리한다. \$\$ \\begin{aligned} (-2x \+ 3y) \- (4x \- 6 \+ 10y) &= \-2x \+ 3y \- 4x \+ 6 \- 10y \\ &= (-2 \- 4)x \+ (3 \- 10)y \+ 6 \\ &= \-6x \- 7y \+ 6 \\quad \[1\\text{점}\] \\end{aligned} \$\$

(2) \[3점\] 간단히 한 식 \$-6x \- 7y \+ 6\$에 \$x \= \\dfrac{3}{4}, y \= 2\$를 대입한다. \$\$ \\begin{aligned} \-6 \\times \\frac{3}{4} \- 7(2) \+ 6 &= \-\\frac{9}{2} \- 14 \+ 6 \\ &= \-\\frac{9}{2} \- 8 \\ &= \-\\frac{9}{2} \- \\frac{16}{2} \\ &= \-\\frac{25}{2} \\quad \[3\\text{점}\] \\end{aligned} \$\$

따라서 (1) \$-6x \- 7y \+ 6\$, (2) \$-\\dfrac{25}{2}\$이다.

```
{
  "status": "EXEMPT",
  "reason": "복합 다항식 나눗셈의 항별 전개, 동류항 정리 및 분수 대입 식의 값 산출 서술형 문항"
}
```

```
{
  "sourceQid": 22,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_DIVISION_EVALUATION_STEPWISE",
  "primaryMethod": "(-2x+3y) - (4x-6+10y) = -6x-7y+6을 구하고 x=3/4, y=2를 대입해 -9/2 - 8 = -25/2를 산출한다.",
  "decisiveStep": "역수 곱셈 분배로 4x-6+10y 도출 후 부호 분배로 -6x-7y+6 완성 및 대입 연산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식과 다항식의 곱셈과 나눗셈",
    "l4": "식의 대입"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLY_DIVISION_SUBSTITUTION",
    "templateKey": "TPL_COMPOUND_DIVISION_VALUE_EVALUATION",
    "why": "다항식 나눗셈 혼합식을 간단히 정리하고 유리수를 대입해 식의 값을 구하는 표준 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC",
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식 나눗셈 2회, 괄호 뺄셈 부호 분배, 분수 수치 대입의 다단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식",
      "단항식",
      "유리수"
    ],
    "goal": [
      "다항식",
      "식의값"
    ],
    "method": [
      "대입",
      "사칙연산",
      "분배법칙",
      "연산"
    ],
    "condition": [
      "동류항"
    ]
  },
  "hold": ""
}
```

## Q23

- 형식: 서술형  
- 배점: 7

### 발문

일차부등식 \$5x \- 3 \\le \-ax \+ b\$의 해를 수직선 위에 나타내었을 때, 경계값 \$-1\$을 포함하여 오른쪽 방향(\$x \\ge \-1\$)을 가리킬 때, \$a \+ b\$의 값을 구하는 풀이 과정과 답을 쓰시오. (단, \$a, b\$는 상수이고 \$a \< \-5\$이다.) \[7점\]

### 선지

없음

### 정답

\-8

### 해설

부등식을 정리하여 수직선의 해집합과 계수를 비교한다.

1단계: 주어진 일차부등식을 \$x\$에 관하여 푼다. \$\$ \\begin{aligned} 5x \- 3 &\\le \-ax \+ b \\ 5x \+ ax &\\le b \+ 3 \\ (5 \+ a)x &\\le b \+ 3 \\quad \[2\\text{점}\] \\end{aligned} \$\$ 조건에서 \$a \< \-5\$이므로 양변에 \$5\$를 더하면 \$\$ 5 \+ a \< 0 \$\$ 즉, \$x\$의 계수 \$5 \+ a\$는 음수이다. 양변을 음수 \$5 \+ a\$로 나누면 부등호의 방향이 반대로 바뀐다. \$\$ x \\ge \\frac{b \+ 3}{5 \+ a} \\quad \[2\\text{점}\] \$\$

2단계: 수직선에 나타난 해와 경계값을 비교한다. 수직선이 나타내는 해는 \$x \\ge \-1\$이므로 \$\$ \\frac{b \+ 3}{5 \+ a} \= \-1 \\quad \[2\\text{점}\] \$\$ 양변에 \$5 \+ a\$를 곱한다. \$\$ b \+ 3 \= \-(5 \+ a) \= \-5 \- a \$\$ \$-a\$를 좌변으로, \$3\$을 우변으로 이항하여 \$a \+ b\$를 정리한다. \$\$ \\begin{aligned} a \+ b &= \-5 \- 3 \\ a \+ b &= \-8 \\quad \[1\\text{점}\] \\end{aligned} \$\$

따라서 \$a \+ b\$의 값은 \$-8\$이다.

```
{
  "status": "EXEMPT",
  "reason": "음수 계수 조건에 따른 부등호 역전 및 수직선 경계값 일치 서술형 문항"
}
```

```
{
  "sourceQid": 23,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_BOUNDARY_MATCH_PARAM",
  "primaryMethod": "(5+a)x <= b+3에서 5+a<0이므로 x >= (b+3)/(5+a) = -1을 풀어 a+b=-8을 도출한다.",
  "decisiveStep": "5+a < 0 판별로 부등호 역전 및 (b+3)/(5+a) = -1에서 a+b = -8 정리",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "해가 주어진 일차부등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_COEFFICIENT_SIGN_MATCH",
    "templateKey": "TPL_PARAMETER_SIGN_BOUNDARY_EQUATE",
    "why": "문자 계수의 부호 조건에 따른 부등호 반전과 해의 경계값을 일치시켜 파라미터 합을 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_SIGN"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "문자 계수 5+a의 부호 판정, 부등호 역전 서술, 분수 방정식 해결의 3단계를 완결하는 고배점 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "부등식",
      "해"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "방정식",
      "부호",
      "이항"
    ],
    "condition": [
      "음수"
    ]
  },
  "hold": ""
}
```

