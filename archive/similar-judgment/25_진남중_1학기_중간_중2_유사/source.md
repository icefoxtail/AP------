

```
{
  "stem": "25_진남중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/25_진남중_1학기_중간_중2_기출.js",
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
- 배점: 4

### 발문

분수 \$\\dfrac{7}{2^3 \\times 5}\$을 유한소수로 나타내는 과정이다. 다음 빈칸을 채워 \$A \+ B \\times C\$의 값을 구하면? \[4점\]

\$\$\\dfrac{7}{2^3 \\times 5} \= \\dfrac{A}{2^3 \\times 5^3} \= \\dfrac{A}{B} \= C\$\$

### 선지

① 175 ② 350 ③ 525 ④ 700 ⑤ 875

### 정답

②

### 해설

분모를 \$10\$의 거듭제곱인 \$10^3 \= 1000\$으로 만들기 위해 분모와 분자에 \$5^2 \= 25\$를 곱한다. \$\$ \\frac{7}{2^3 \\times 5} \= \\frac{7 \\times 5^2}{2^3 \\times 5 \\times 5^2} \= \\frac{7 \\times 25}{2^3 \\times 5^3} \= \\frac{175}{1000} \= 0.175 \$\$ 따라서 각 빈칸의 값은 다음과 같다. \$\$ A \= 175, \\quad B \= 1000, \\quad C \= 0.175 \$\$ 구하는 식의 값을 계산한다. \$\$ \\begin{aligned} A \+ B \\times C &= 175 \+ 1000 \\times 0.175 \\ &= 175 \+ 175 \\ &= 350 \\end{aligned} \$\$ 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "10의 거듭제곱 분모 확장을 통한 유한소수 변환 및 빈칸 계산 문항"
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
  "conceptClusterKey": "FINITE_DECIMAL_POWERS_OF_TEN_FILL",
  "primaryMethod": "분모를 2^3*5^3=1000으로 만들기 위해 5^2=25를 곱해 A=175, B=1000, C=0.175를 구하고 175+175=350을 계산한다.",
  "decisiveStep": "A=175, B*C=175 도출 후 합 350 산출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수로 나타내기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_CONVERSION_BLANK",
    "templateKey": "TPL_DECIMAL_POWERS_OF_TEN_MATCH",
    "why": "10의 거듭제곱 분모 구성 과정을 대수 빈칸으로 추론하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분모와 분자에 곱할 5의 거듭제곱을 찾아 대입 계산하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "분수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "사칙연산",
      "연산"
    ],
    "condition": [
      "거듭제곱"
    ]
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 3

### 발문

다음 분수 중에서 순환소수로만 나타낼 수 있는 것은? \[3점\]

### 선지

① \$\\dfrac{7}{35}\$ ② \$\\dfrac{27}{180}\$ ③ \$\\dfrac{63}{2^2 \\times 3^2 \\times 5^2}\$ ④ \$\\dfrac{42}{2^3 \\times 3 \\times 7}\$ ⑤ \$\\dfrac{21}{2^2 \\times 3^2 \\times 5}\$

### 정답

⑤

### 해설

기약분수로 나타내었을 때 분모의 소인수가 \$2\$ 또는 \$5\$ 이외의 소인수를 가지면 순환소수이다. \$\$ \\begin{aligned} \\text{① } & \\frac{7}{35} \= \\frac{1}{5} \\implies \\text{분모 소인수 } 5 \\text{ (유한소수)} \\ \\text{② } & \\frac{27}{180} \= \\frac{3}{20} \= \\frac{3}{2^2 \\times 5} \\implies \\text{분모 소인수 } 2, 5 \\text{ (유한소수)} \\ \\text{③ } & \\frac{63}{2^2 \\times 3^2 \\times 5^2} \= \\frac{7 \\times 9}{2^2 \\times 9 \\times 5^2} \= \\frac{7}{2^2 \\times 5^2} \\implies \\text{분모 소인수 } 2, 5 \\text{ (유한소수)} \\ \\text{④ } & \\frac{42}{2^3 \\times 3 \\times 7} \= \\frac{42}{2^3 \\times 21} \= \\frac{2}{2^3} \= \\frac{1}{2^2} \\implies \\text{분모 소인수 } 2 \\text{ (유한소수)} \\ \\text{⑤ } & \\frac{21}{2^2 \\times 3^2 \\times 5} \= \\frac{3 \\times 7}{2^2 \\times 9 \\times 5} \= \\frac{7}{2^2 \\times 3 \\times 5} \\implies \\text{분모에 } 3\\text{이 남아 순환소수} \\end{aligned} \$\$ 따라서 순환소수로만 나타낼 수 있는 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "기약분수 분모 소인수 검사를 통한 순환소수 판정 기본 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_IDENTIFICATION",
  "primaryMethod": "기약분수 약분 후 분모에 2, 5 이외의 소인수 3이 남는 ⑤를 선별한다.",
  "decisiveStep": "21/(2^2*3^2*5) = 7/(2^2*3*5)에서 분모 소인수 3 확인",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_TEST",
    "templateKey": "TPL_REPEATING_DECIMAL_FACTOR_SEARCH",
    "why": "소인수분해된 분모의 약분을 거쳐 순환소수가 되는 분수를 선별하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_REDUCING_FRACTION"
  ],
  "conditionKeys": [
    "COND_IRREDUCIBLE"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "약분 후 분모의 소인수를 확인하여 순환소수를 고르는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "기약분수",
      "분수"
    ],
    "goal": [
      "순환소수"
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

## Q03

- 형식: 객관식  
- 배점: 3

### 발문

두 수의 대소관계를 바르게 나타낸 것은? \[3점\]

### 선지

① \$0.72 \< 0.\\dot{7}\$ ② \$0.40 \> 0.\\dot{4}0\\dot{0}\$ ③ \$5.32\\dot{3} \< 5.\\dot{3}\\dot{2}\$ ④ \$0.234 \> 0.2\\dot{3}\\dot{4}\$ ⑤ \$0.5\\dot{8} \< 0.58\$

### 정답

①

### 해설

순환소수를 소수 전개 꼴로 펼쳐서 소수점 아래 자릿수를 순서대로 비교한다. \$\$ \\begin{aligned} \\text{① } & 0.72 \= 0.720000\\dots, \\quad 0.\\dot{7} \= 0.777777\\dots \\ & 0.72 \< 0.777\\dots \\text{이므로 옳은 표현이다. (참)} \\ \\text{② } & 0.40 \= 0.400000\\dots, \\quad 0.\\dot{4}0\\dot{0} \= 0.400400\\dots \\ & 0.4000\\dots \< 0.4004\\dots \\text{이므로 } 0.40 \< 0.\\dot{4}0\\dot{0} \\text{ (거짓)} \\ \\text{③ } & 5.32\\dot{3} \= 5.323333\\dots, \\quad 5.\\dot{3}\\dot{2} \= 5.323232\\dots \\ & 5.3233\\dots \> 5.3232\\dots \\text{이므로 } 5.32\\dot{3} \> 5.\\dot{3}\\dot{2} \\text{ (거짓)} \\ \\text{④ } & 0.234 \= 0.234000\\dots, \\quad 0.2\\dot{3}\\dot{4} \= 0.234343\\dots \\ & 0.2340\\dots \< 0.2343\\dots \\text{이므로 } 0.234 \< 0.2\\dot{3}\\dot{4} \\text{ (거짓)} \\ \\text{⑤ } & 0.5\\dot{8} \= 0.588888\\dots, \\quad 0.58 \= 0.580000\\dots \\ & 0.5888\\dots \> 0.5800\\dots \\text{이므로 } 0.5\\dot{8} \> 0.58 \\text{ (거짓)} \\end{aligned} \$\$ 따라서 대소관계를 바르게 나타낸 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수 전개를 통한 자리별 대소 비교 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_ORDER_COMPARISON",
  "primaryMethod": "각 수를 소수 셋째~넷째 자리까지 전개하여 처음 달라지는 자릿수의 크기를 비교한다.",
  "decisiveStep": "0.72 = 0.720... < 0.(7) = 0.777...의 명백한 대소 판정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수의 대소 비교"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_ORDER",
    "templateKey": "TPL_DECIMAL_EXPANSION_ORDER_CHECK",
    "why": "순환소수와 유한소수의 자릿수별 크기 비교 타당성을 점검하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_DECIMAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소수 자릿수를 펼쳐서 대소를 직접 대조하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "순환소수",
      "소수"
    ],
    "goal": [
      "대소비교"
    ],
    "method": [
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

분수 \$\\dfrac{25}{11}\$를 소수로 나타내었을 때, 소수점 아래 \$26\$번째 자리의 숫자와 \$27\$번째 자리의 숫자의 곱은? \[4점\]

### 선지

① 4 ② 9 ③ 10 ④ 14 ⑤ 49

### 정답

④

### 해설

분수를 순환소수로 변환하여 순환마디의 주기를 파악한다. 1단계: \$25 \\div 11\$을 계산한다. \$\$ \\frac{25}{11} \= 2.272727\\cdots \= 2.\\dot{2}\\dot{7} \$\$ 순환마디는 \$27\$로 길이는 \$2\$이다. 소수점 아래 홀수 번째 자리의 숫자는 \$2\$이고, 짝수 번째 자리의 숫자는 \$7\$이다. 2단계: \$26\$번째와 \$27\$번째 숫자를 각각 구한다.

- \$26\$은 짝수이므로 소수점 아래 \$26\$번째 자리의 숫자는 \$7\$이다.  
- \$27\$은 홀수이므로 소수점 아래 \$27\$번째 자리의 숫자는 \$2\$이다. 3단계: 두 숫자의 곱을 계산한다. \$\$ 7 \\times 2 \= 14 \$\$ 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "순환마디 길이 2의 홀/짝 주기성에 따른 자릿수 값 추출 및 곱셈 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_EVEN_ODD_DIGIT_PRODUCT",
  "primaryMethod": "25/11 = 2.(2)(7)에서 짝수 자리 7과 홀수 자리 2의 곱 7*2=14를 산출한다.",
  "decisiveStep": "26번째=7, 27번째=2 식별 후 7*2=14 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "소수점 아래 n번째 자리의 숫자"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_NTH_DIGIT",
    "templateKey": "TPL_DECIMAL_CONSECUTIVE_DIGITS_PRODUCT",
    "why": "순환마디 주기에서 연속된 두 자릿수를 찾아 곱을 구하는 템플릿"
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
  "difficultyReason": "홀수/짝수 위치에 대응하는 순환마디 숫자를 판별하고 곱하는 2단계 문항",
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
      "자릿수",
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

## Q05

- 형식: 객관식  
- 배점: 5

### 발문

두 순환소수 \$0.\\dot{a}\\dot{b}\$와 \$0.\\dot{b}\\dot{a}\$의 합이 \$0.\\dot{7}\$일 때, \$0.\\dot{a} \- 0.\\dot{b}\$의 값을 순환소수로 나타낸 것은? (단, \$a, b\$는 한 자리의 자연수이고 \$a\$와 \$b\$는 소수(prime number)이며, \$a \> b\$이다.) \[5점\]

### 선지

① \$0.\\dot{1}\$ ② \$0.\\dot{2}\$ ③ \$0.\\dot{3}\$ ④ \$0.\\dot{4}\$ ⑤ \$0.\\dot{5}\$

### 정답

③

### 해설

순환소수를 분수로 나타내어 \$a \+ b\$를 결정하고 소수 조건을 적용한다. 1단계: 두 순환소수의 합을 분수로 나타낸다. \$\$ 0.\\dot{a}\\dot{b} \= \\frac{10a \+ b}{99}, \\quad 0.\\dot{b}\\dot{a} \= \\frac{10b \+ a}{99} \$\$ 두 수의 합은 다음과 같다. \$\$ \\frac{10a \+ b}{99} \+ \\frac{10b \+ a}{99} \= \\frac{11a \+ 11b}{99} \= \\frac{11(a \+ b)}{99} \= \\frac{a \+ b}{9} \$\$ 우변의 값 \$0.\\dot{7} \= \\dfrac{7}{9}\$이므로 \$\$ \\frac{a \+ b}{9} \= \\frac{7}{9} \\implies a \+ b \= 7 \$\$ 2단계: 소수 조건 \$a, b \\in {2, 3, 5, 7}\$ 및 \$a \> b\$를 적용한다. 합이 \$7\$이 되는 두 소수의 쌍은 \$5 \+ 2 \= 7\$뿐이다. \$a \> b\$이므로 \$\$ a \= 5, \\quad b \= 2 \$\$ 3단계: \$0.\\dot{a} \- 0.\\dot{b}\$의 값을 구한다. \$\$ \\begin{aligned} 0.\\dot{a} \- 0.\\dot{b} &= 0.\\dot{5} \- 0.\\dot{2} \\ &= \\frac{5}{9} \- \\frac{2}{9} \= \\frac{3}{9} \\ &= 0.\\dot{3} \\end{aligned} \$\$ 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "대칭 순환소수의 합 대수화와 한 자리 소수 조건의 부정방정식 연계 문항"
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
  "conceptClusterKey": "SYMMETRIC_REPEATING_PRIME_CONSTRAINTS",
  "primaryMethod": "(a+b)/9 = 7/9에서 a+b=7이고 소수 조건으로 a=5, b=2를 구하여 0.(5)-0.(2)=0.(3)을 산출한다.",
  "decisiveStep": "a+b=7에서 소수쌍 (5, 2) 유일 결정 및 0.(3) 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수의 덧셈과 뺄셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_ARITHMETIC_PRIME",
    "templateKey": "TPL_SYMMETRIC_REPEATING_SUM_DIFF_PRIME",
    "why": "대칭형 순환소수 덧셈 식을 정수 조건 및 소수 조건과 융합한 템플릿"
  },
  "crossConceptKeys": [
    "CC_PRIME_FACTORIZATION",
    "CC_DIOPHANTINE_BOUNDS"
  ],
  "conditionKeys": [
    "COND_PRIME",
    "COND_NATURAL"
  ],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환소수 대수식 정리와 정수론적 소수 조건(a+b=7)을 결합해 해를 좁히는 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수",
      "자연수"
    ],
    "goal": [
      "순환소수"
    ],
    "method": [
      "방정식",
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

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

어떤 기약분수를 소수로 나타내는데, 준우는 분모를 잘못 보아 \$0.41\\dot{6}\$으로 나타내고, 하은이는 분자를 잘못 보아 \$0.\\dot{2}\\dot{7}\$로 나타내었다. 처음 기약분수를 소수로 바르게 나타낸 것은? \[4점\]

### 선지

① \$0.\\dot{4}\$ ② \$0.\\dot{4}\\dot{5}\$ ③ \$0.4\\dot{5}\$ ④ \$0.45\$ ⑤ \$0.45\\dot{4}\$

### 정답

②

### 해설

두 학생이 각각 바르게 본 부분(분자 또는 분모)을 추출하여 원래의 기약분수를 복원한다. 1단계: 준우의 결과를 기약분수로 나타내어 바른 분자를 찾는다. \$\$ 0.41\\dot{6} \= \\frac{416 \- 41}{900} \= \\frac{375}{900} \= \\frac{5}{12} \$\$ 준우는 분모를 잘못 보았으므로 원래의 분자는 \$5\$이다. 2단계: 하은이의 결과를 기약분수로 나타내어 바른 분모를 찾는다. \$\$ 0.\\dot{2}\\dot{7} \= \\frac{27}{99} \= \\frac{3}{11} \$\$ 하은이는 분자를 잘못 보았으므로 원래의 분모는 \$11\$이다. 3단계: 처음 기약분수를 복원하고 소수로 나타낸다. 처음 기약분수는 \$\\dfrac{5}{11}\$이다. \$\$ 5 \\div 11 \= 0.454545\\cdots \= 0.\\dot{4}\\dot{5} \$\$ 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "오답 관측치로부터 원래 기약분수의 분자와 분모를 각각 복원하여 소수로 변환하는 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REVERSE_ENGINEER_ORIGINAL_FRACTION",
  "primaryMethod": "0.41(6) = 5/12에서 분자 5, 0.(2)(7) = 3/11에서 분모 11을 추출해 5/11 = 0.(4)(5)를 구한다.",
  "decisiveStep": "두 순환소수를 기약분수 5/12, 3/11로 바꾼 뒤 올바른 성분 조합 5/11 도출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_RESTORE_FRACTION",
    "templateKey": "TPL_INCORRECT_READING_FRACTION_RECOVERY",
    "why": "두 학생의 분수 변환 오류 정보로부터 원래 기약분수를 복원하는 대표 템플릿"
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
  "difficultyReason": "순환소수 2개를 각각 기약분수로 변환하고 성분을 결합해 다시 순환소수로 바꾸는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "순환소수"
    ],
    "method": [
      "기약분수",
      "약수",
      "사칙연산"
    ],
    "condition": [
      "소수"
    ]
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

다음 \<보기\> 중 옳은 것만을 있는 대로 고른 것은? \[4점\]

\<보기\> ㄱ. 모든 순환소수는 분수로 나타낼 수 있으므로 유리수이다. ㄴ. 유리수를 소수로 나타내면 유한소수 또는 순환소수가 된다. ㄷ. 분모에 \$2\$나 \$5\$ 이외의 소인수가 있는 모든 분수는 순환소수이다.

### 선지

① ㄱ, ㄴ ② ㄱ, ㄷ ③ ㄴ, ㄷ ④ ㄱ ⑤ ㄱ, ㄴ, ㄷ

### 정답

①

### 해설

유리수와 순환소수의 정의 및 성질을 검토한다. \$\$ \\begin{aligned} \\text{ㄱ: } & \\text{모든 순환소수는 } 10\\text{의 거듭제곱을 이용하여 정수 분수 } \\frac{a}{b} \\text{ (\$b \\ne 0\$) 꼴로 나타낼 수 있으므로 유리수이다. (참)} \\ \\text{ㄴ: } & \\text{정수가 아닌 유리수를 소수로 나타내면 분모의 소인수에 따라 유한소수 또는 순환소수로 반드시 나타난다. (참)} \\ \\text{ㄷ: } & \\text{분수가 기약분수라는 조건이 없으면, 분모에 } 2, 5 \\text{ 이외의 소인수(예: } 3\\text{)가 있더라도 } \\ & \\frac{21}{30} \= \\frac{7}{10} \= 0.7\\text{처럼 분자와 약분되어 유한소수가 될 수 있다. 따라서 거짓이다.} \\end{aligned} \$\$ 따라서 옳은 것은 ㄱ, ㄴ이므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "유리수와 순환소수 정의 및 기약분수 조건 유무에 따른 유한소수 판정 명제 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "RATIONAL_DECIMAL_DEFINITION_AUDIT",
  "primaryMethod": "순환소수의 유리수성(ㄱ)과 소수 분류(ㄴ)를 참으로, 기약분수 조건 누락 반례(ㄷ)를 거짓으로 판별한다.",
  "decisiveStep": "ㄷ에서 기약분수 조건 누락 시 약분 반례 식별로 배제",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RATIONAL_DECIMAL_TRUE_FALSE",
    "templateKey": "TPL_RATIONAL_DECIMAL_PROPERTIES",
    "why": "기약분수 소인수 조건의 전제조건 결여 오류를 판정하는 대표 템플릿"
  },
  "crossConceptKeys": [
    "CC_IRREDUCIBLE_FRACTION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수 체계 명제 진위를 판정하고 기약분수 전제 누락을 가려내는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "유리수",
      "순환소수",
      "분수"
    ],
    "goal": [
      "판정"
    ],
    "method": [
      "소인수분해"
    ],
    "condition": [
      "소인수"
    ]
  },
  "hold": ""
}
```

## Q08

- 형식: 객관식  
- 배점: 3

### 발문

\$(2^6)^4 \\div (2^\\Box)^3 \= 2^{12}\$일 때, \$\\Box\$ 안에 알맞은 수는? \[3점\]

### 선지

① 1 ② 2 ③ 3 ④ 5 ⑤ 4

### 정답

⑤

### 해설

거듭제곱의 거듭제곱 및 같은 밑의 나눗셈 법칙을 적용한다. 빈칸을 \$x\$라 하면 \$\$ (2^6)^4 \= 2^{6 \\times 4} \= 2^{24}, \\quad (2^x)^3 \= 2^{3x} \$\$ 나눗셈을 계산하면 \$\$ 2^{24} \\div 2^{3x} \= 2^{24 \- 3x} \$\$ 우변이 \$2^{12}\$이므로 지수끼리 비교한다. \$\$ \\begin{aligned} 24 \- 3x &= 12 \\ 3x &= 24 \- 12 \\ 3x &= 12 \\ x &= 4 \\end{aligned} \$\$ 따라서 \$\\Box\$ 안에 알맞은 수는 \$4\$이므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "지수법칙의 거듭제곱 곱과 나눗셈 차 공식을 적용한 일차방정식 문항"
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
  "conceptClusterKey": "EXPONENT_DIVISION_SOLVE_BOX",
  "primaryMethod": "24 - 3x = 12 일차방정식을 풀어 x = 4를 도출한다.",
  "decisiveStep": "24 - 3x = 12에서 x = 4 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수의 나눗셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_DIVISION_EQUATION",
    "templateKey": "TPL_EXPONENT_LINEAR_EQUATION_BOX",
    "why": "거듭제곱 나눗셈 식을 지수 일차방정식으로 바꾸어 빈칸을 구하는 템플릿"
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
  "difficultyReason": "거듭제곱 거듭제곱 곱과 나눗셈 지수 차를 이용한 1단계 기본 방정식 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "방정식",
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

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

\$a \= 2^{x-1}\$일 때, \$4^x\$을 \$a\$에 관한 식으로 나타내면? \[4점\]

### 선지

① \$2a\$ ② \$2a^2\$ ③ \$4a^2\$ ④ \$8a^2\$ ⑤ \$16a^2\$

### 정답

③

### 해설

\$a \= 2^{x-1}\$에서 \$2^x\$를 \$a\$에 대한 식으로 먼저 나타낸다. 1단계: \$2^{x-1}\$을 분해한다. \$\$ a \= 2^{x-1} \= \\frac{2^x}{2} \$\$ 양변에 \$2\$를 곱하면 \$\$ 2^x \= 2a \$\$ 2단계: \$4^x\$을 \$2^x\$의 거듭제곱으로 나타낸다. \$\$ 4^x \= (2^2)^x \= (2^x)^2 \$\$ 3단계: \$2^x \= 2a\$를 대입한다. \$\$ 4^x \= (2a)^2 \= 4a^2 \$\$ 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "지수 분해를 통한 기준 거듭제곱 격리 및 제곱 대입 문자식 표현 문항"
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
  "conceptClusterKey": "POWER_BASE_VARIABLE_SUBSTITUTION",
  "primaryMethod": "2^x = 2a를 구한 후 4^x = (2^x)^2 = (2a)^2 = 4a^2를 산출한다.",
  "decisiveStep": "2^x = 2a 분리 후 제곱하여 4a^2 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수법칙의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POWER_VARIABLE_REPRESENTATION",
    "templateKey": "TPL_EXPONENT_SUBSTITUTION_POWER_OF_BASE",
    "why": "지수의 뺄셈을 분수로 변환하여 기준 거듭제곱을 구하고 대입하는 템플릿"
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
  "difficultyReason": "2^(x-1)=a로부터 2^x=2a를 얻고 (2a)^2=4a^2로 제곱 대입하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "다항식"
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

## Q10

- 형식: 객관식  
- 배점: 5

### 발문

\$2^{n+3} \+ 2^{n+2} \+ 2^{n+1} \= 224\$일 때, 자연수 \$n\$의 값은? \[5점\]

### 선지

① 1 ② 2 ③ 3 ④ 4 ⑤ 5

### 정답

④

### 해설

공통인수를 묶어 좌변을 간단히 정리한 후 지수방정식을 푼다. 1단계: 좌변의 각 항에서 공통인수 \$2^{n+1}\$을 묶는다. \$\$ \\begin{aligned} 2^{n+3} \+ 2^{n+2} \+ 2^{n+1} &= 2^{n+1} \\times 2^2 \+ 2^{n+1} \\times 2^1 \+ 2^{n+1} \\times 1 \\ &= 2^{n+1}(2^2 \+ 2 \+ 1\) \\ &= 2^{n+1}(4 \+ 2 \+ 1\) \\ &= 7 \\times 2^{n+1} \\end{aligned} \$\$ 2단계: 우변 \$224\$와 같다고 놓고 방정식을 푼다. \$\$ 7 \\times 2^{n+1} \= 224 \$\$ 양변을 \$7\$로 나눈다. \$\$ 2^{n+1} \= \\frac{224}{7} \= 32 \$\$ 3단계: \$32\$를 밑이 \$2\$인 거듭제곱으로 나타낸다. \$\$ 32 \= 2^5 \$\$ 따라서 밑이 같으므로 지수끼리 비교한다. \$\$ n \+ 1 \= 5 \\implies n \= 4 \$\$ 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "연속 거듭제곱의 덧셈에서 공통인수를 분배법칙 역연산으로 묶는 지수방정식 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "POWER_SUM_COMMON_FACTOR_EQUATION",
  "primaryMethod": "2^(n+1)*(4+2+1) = 7*2^(n+1) = 224에서 2^(n+1) = 32 = 2^5, n = 4를 도출한다.",
  "decisiveStep": "2^(n+1) 묶음으로 7*2^(n+1) = 224 유도 후 2^(n+1)=32 해결",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수법칙의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_SUM_EQUATION",
    "templateKey": "TPL_CONSECUTIVE_POWERS_SUM_SOLVE",
    "why": "거듭제곱 덧셈에서 최소 차수 거듭제곱을 묶어 상수를 나누어 지수를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공통 거듭제곱 묶기 인수분해와 2의 거듭제곱 방정식 풀이를 결합하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "방정식",
      "분배법칙",
      "연산"
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

\$(x^3 y^2)^3 \\times (x^2 y^4)^2 \= x^a y^b\$일 때, \$a \+ b\$의 값은? \[4점\]

### 선지

① 27 ② 28 ③ 29 ④ 30 ⑤ 31

### 정답

①

### 해설

지수법칙의 거듭제곱의 곱셈 및 거듭제곱의 거듭제곱을 적용한다. 1단계: 각 괄호의 거듭제곱을 분배한다. \$\$ (x^3 y^2)^3 \= (x^3)^3 (y^2)^3 \= x^{3 \\times 3} y^{2 \\times 3} \= x^9 y^6 \$\$ \$\$ (x^2 y^4)^2 \= (x^2)^2 (y^4)^2 \= x^{2 \\times 2} y^{4 \\times 2} \= x^4 y^8 \$\$ 2단계: 두 단항식을 곱한다. \$\$ x^9 y^6 \\times x^4 y^8 \= x^{9 \+ 4} y^{6 \+ 8} \= x^{13} y^{14} \$\$ 3단계: 우변 \$x^a y^b\$와 지수를 비교한다. \$\$ a \= 13, \\quad b \= 14 \$\$ 따라서 \$a \+ b\$의 값은 다음과 같다. \$\$ a \+ b \= 13 \+ 14 \= 27 \$\$ 그러므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식의 거듭제곱 분배 및 곱셈 지수 덧셈 기본 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_POWERS_PRODUCT_EXPONENTS",
  "primaryMethod": "x^(9+4) y^(6+8) = x^13 y^14에서 a=13, b=14의 합 27을 계산한다.",
  "decisiveStep": "지수 곱 3*3=9, 2*3=6, 2*2=4, 4*2=8 후 지수 합 13+14=27 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수의 곱과 합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_EXPONENT_SUM",
    "templateKey": "TPL_MONOMIAL_POWER_PRODUCT_COEFFICIENT_SUM",
    "why": "두 단항식 거듭제곱 곱의 결과에서 지수들의 합을 구하는 템플릿"
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
  "difficultyReason": "거듭제곱의 분배와 곱셈의 지수 덧셈을 결합하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "단항식",
      "거듭제곱"
    ],
    "goal": [
      "자연수"
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

## Q12

- 형식: 객관식  
- 배점: 5

### 발문

네 자연수 \$a, b, c, d\$에 대하여 \$(x^a y^b z^c)^d \= x^{36} y^{24} z^{48}\$이 성립할 때, \$a \+ b \+ c\$의 최솟값은? \[5점\]

### 선지

① 7 ② 8 ③ 9 ④ 10 ⑤ 12

### 정답

③

### 해설

지수법칙을 적용하여 지수 등식을 세우고 최대공약수를 이용한다. 1단계: 좌변을 전개한다. \$\$ (x^a y^b z^c)^d \= x^{ad} y^{bd} z^{cd} \$\$ 우변 \$x^{36} y^{24} z^{48}\$과 각 문자의 지수를 비교한다. \$\$ ad \= 36, \\quad bd \= 24, \\quad cd \= 48 \$\$ \$a, b, c, d\$가 모두 자연수이므로 \$d\$는 \$36, 24, 48\$의 공약수이어야 한다. 2단계: \$a \+ b \+ c\$를 \$d\$로 표현한다. \$\$ a \= \\frac{36}{d}, \\quad b \= \\frac{24}{d}, \\quad c \= \\frac{48}{d} \$\$ \$\$ a \+ b \+ c \= \\frac{36 \+ 24 \+ 48}{d} \= \\frac{108}{d} \$\$ 3단계: \$a \+ b \+ c\$의 최솟값을 구하려면 분모 \$d\$가 최대이어야 한다. 따라서 \$d\$는 \$36, 24, 48\$의 최대공약수이어야 한다. \$\$ \\gcd(36, 24, 48\) \= 12 \$\$ \$d \= 12\$일 때 \$a, b, c\$의 값은 \$\$ a \= \\frac{36}{12} \= 3, \\quad b \= \\frac{24}{12} \= 2, \\quad c \= \\frac{48}{12} \= 4 \$\$ 따라서 \$a \+ b \+ c\$의 최솟값은 다음과 같다. \$\$ a \+ b \+ c \= 3 \+ 2 \+ 4 \= 9 \$\$ 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "거듭제곱 지수의 곱 성질과 최대공약수를 결합한 지수 합의 최솟값 산출 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "EXPONENT_GCD_MINIMUM_SUM",
  "primaryMethod": "ad=36, bd=24, cd=48에서 a+b+c = 108/d이므로 d=gcd(36,24,48)=12일 때 최소합 9를 구한다.",
  "decisiveStep": "d=12(최대공약수) 대입으로 a=3, b=2, c=4 도출 후 합 9 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수법칙의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_GCD_OPTIMIZATION",
    "templateKey": "TPL_EXPONENT_GCD_MINIMUM_SUM_SEARCH",
    "why": "공통 지수 분배식에서 지수 합의 최솟값을 최대공약수로 최적화하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_GCD"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "지수 곱 분배식과 최대공약수의 역비례 관계를 결합해 최소를 찾는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "단항식",
      "거듭제곱"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "약수",
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

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

\$(3xy^2)^2 \\times (-x^3y)^2 \\times \\dfrac{5y^3}{3x^4}\$을 계산하면? \[4점\]

### 선지

① \$15x^4y^8\$ ② \$15x^4y^9\$ ③ \$-15x^4y^9\$ ④ \$45x^4y^9\$ ⑤ \$15x^5y^9\$

### 정답

②

### 해설

거듭제곱을 먼저 전개한 후 계수와 각 문자의 지수를 차례대로 계산한다. 1단계: 각 괄호의 거듭제곱을 계산한다. \$\$ (3xy^2)^2 \= 3^2 x^2 (y^2)^2 \= 9x^2y^4 \$\$ \$\$ (-x^3y)^2 \= (-1)^2 (x^3)^2 y^2 \= x^6y^2 \$\$ 2단계: 세 단항식을 곱한다. \$\$ 9x^2y^4 \\times x^6y^2 \\times \\frac{5y^3}{3x^4} \= \\frac{9 \\times 5 \\times x^{2+6} y^{4+2+3}}{3x^4} \= \\frac{45x^8y^9}{3x^4} \$\$ 3단계: 분모의 \$3x^4\$로 약분한다. \$\$ \\frac{45}{3} \\times x^{8-4} y^9 \= 15x^4y^9 \$\$ 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식 거듭제곱 전개 및 분수 곱셈 약분 혼합 계산 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_COMPOSITE_PRODUCT_DIVISION",
  "primaryMethod": "9x^2y^4 * x^6y^2 * (5y^3 / 3x^4) = 45x^8y^9 / (3x^4) = 15x^4y^9를 계산한다.",
  "decisiveStep": "계수 45/3=15, x 지수 8-4=4, y 지수 4+2+3=9 종합",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "단항식의 곱셈과 나눗셈의 혼합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_MIXED_CALCULATION",
    "templateKey": "TPL_MONOMIAL_POWERS_FRACTION_MULTIPLICATION",
    "why": "거듭제곱이 포함된 세 단항식의 곱셈과 나눗셈 혼합 연산을 수행하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_COEFFICIENT"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호, 계수 분수 약분, 두 문자의 지수 덧셈/뺄셈을 결합하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "단항식",
      "거듭제곱"
    ],
    "goal": [
      "단항식"
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

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

밑면은 한 변의 길이가 \$3a^2b\$인 정사각형이고 부피가 \$18a^5b^4\$인 직육면체의 높이는? \[4점\]

### 선지

① \$2ab\$ ② \$2a^2b\$ ③ \$3ab^2\$ ④ \$6ab^2\$ ⑤ \$2ab^2\$

### 정답

⑤

### 해설

직육면체의 부피 \$V \= (\\text{밑넓이}) \\times (\\text{높이})\$ 공식을 이용한다. 1단계: 밑면인 정사각형의 넓이를 구한다. 한 변의 길이가 \$3a^2b\$이므로 \$\$ (\\text{밑넓이}) \= (3a^2b)^2 \= 3^2 (a^2)^2 b^2 \= 9a^4b^2 \$\$ 2단계: 높이를 \$h\$라 하고 부피 공식을 세운다. \$\$ 9a^4b^2 \\times h \= 18a^5b^4 \$\$ 3단계: 단항식의 나눗셈으로 높이 \$h\$를 계산한다. \$\$ \\begin{aligned} h &= \\frac{18a^5b^4}{9a^4b^2} \\ &= \\left(\\frac{18}{9}\\right) a^{5-4} b^{4-2} \\ &= 2ab^2 \\end{aligned} \$\$ 따라서 직육면체의 높이는 \$2ab^2\$이므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "정사각형 밑넓이 거듭제곱 및 직육면체 부피 단항식 나눗셈 문항"
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
  "conceptClusterKey": "CUBOID_HEIGHT_MONOMIAL_DIVISION",
  "primaryMethod": "밑넓이 (3a^2b)^2 = 9a^4b^2를 구하고 18a^5b^4 / (9a^4b^2) = 2ab^2를 산출한다.",
  "decisiveStep": "부피를 밑넓이 9a^4b^2로 나누어 2ab^2 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "도형에서의 단항식의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_CUBOID_HEIGHT_SOLVE",
    "templateKey": "TPL_SQUARE_BASE_CUBOID_HEIGHT",
    "why": "정사각형 밑면의 거듭제곱 밑넓이와 부피로부터 높이를 단항식 나눗셈으로 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_GEOMETRIC_VOLUME"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "밑넓이 제곱 후 단항식 나눗셈을 적용하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "정사각형",
      "직육면체",
      "부피"
    ],
    "goal": [
      "높이"
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

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

\$2^{18} \\times 5^{15}\$이 \$n\$자리 자연수일 때, \$n\$의 값은? \[4점\]

### 선지

① 13 ② 14 ③ 15 ④ 16 ⑤ 17

### 정답

④

### 해설

\$2\$와 \$5\$의 지수 중 작은 쪽인 \$15\$에 맞춰 \$10\$의 거듭제곱으로 묶는다. 1단계: 식을 변형한다. \$\$ \\begin{aligned} 2^{18} \\times 5^{15} &= 2^{3 \+ 15} \\times 5^{15} \\ &= 2^3 \\times (2 \\times 5)^{15} \\ &= 8 \\times 10^{15} \\end{aligned} \$\$ 2단계: \$8 \\times 10^{15}\$의 자릿수를 구한다. 한 자리 수 \$8\$ 뒤에 \$0\$이 \$15\$개 이어지므로 전체 자릿수는 다음과 같다. \$\$ n \= 1 \+ 15 \= 16 \$\$ 따라서 \$n \= 16\$이므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "10의 거듭제곱 묶기 지수법칙을 통한 자연수 자릿수 판정 문항"
}
```

```
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "POWER_OF_TEN_DIGIT_COUNTING",
  "primaryMethod": "2^18 * 5^15 = 2^3 * (2*5)^15 = 8 * 10^15에서 1 + 15 = 16자리를 도출한다.",
  "decisiveStep": "2^3 = 8(1자리)과 10^15(0이 15개) 결합으로 16자리 판정",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "자릿수 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POWER_OF_TEN_DIGITS",
    "templateKey": "TPL_POWERS_OF_2_AND_5_DIGIT_COUNT",
    "why": "2와 5의 비대칭 지수 곱을 10의 거듭제곱으로 묶어 자릿수를 산출하는 템플릿"
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
  "difficultyReason": "2와 5의 공통 지수를 묶고 앞자리의 자릿수를 합산하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자릿수"
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

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

\$3x \+ 2y \- 1\$에 어떤 식 \$A\$를 더해야 할 것을 잘못하여 빼었더니 \$4x \- y \+ 2\$가 되었다. 바르게 계산한 식은? \[4점\]

### 선지

① \$x \+ 4y \- 4\$ ② \$2x \+ 3y \- 4\$ ③ \$2x \+ 5y \- 4\$ ④ \$2x \+ 5y \+ 2\$ ⑤ \$-x \+ 5y \- 4\$

### 정답

③

### 해설

잘못된 뺄셈 식으로부터 어떤 식 \$A\$를 먼저 구한 후 원래의 덧셈을 수행한다. 1단계: 어떤 식 \$A\$를 구한다. \$\$ (3x \+ 2y \- 1\) \- A \= 4x \- y \+ 2 \$\$ \$\$ \\begin{aligned} A &= (3x \+ 2y \- 1\) \- (4x \- y \+ 2\) \\ &= 3x \+ 2y \- 1 \- 4x \+ y \- 2 \\ &= \-x \+ 3y \- 3 \\end{aligned} \$\$ 2단계: 바르게 계산한 식을 구한다. 원래 계산은 \$3x \+ 2y \- 1\$에 \$A\$를 더하는 것이므로 \$\$ \\begin{aligned} (3x \+ 2y \- 1\) \+ A &= (3x \+ 2y \- 1\) \+ (-x \+ 3y \- 3\) \\ &= (3 \- 1)x \+ (2 \+ 3)y \+ (-1 \- 3\) \\ &= 2x \+ 5y \- 4 \\end{aligned} \$\$ 따라서 바르게 계산한 식은 \$2x \+ 5y \- 4\$이므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식 덧셈/뺄셈 오류에서 원식 복원 후 바른 연산 적용 문항"
}
```

```
{
  "sourceQid": 16,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_ERROR_ADD_SUB_RECOVERY",
  "primaryMethod": "A = (3x+2y-1) - (4x-y+2) = -x+3y-3을 구하고 (3x+2y-1) + A = 2x+5y-4를 도출한다.",
  "decisiveStep": "A = -x+3y-3 복원 후 덧셈으로 2x+5y-4 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "바르게 계산한 식 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_CORRECT_CALCULATION_UNKNOWN",
    "templateKey": "TPL_POLYNOMIAL_ADD_SUB_WRONG_OPERATION",
    "why": "잘못된 뺄셈 등식에서 미지의 다항식을 구하고 본래 덧셈을 수행하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_COEFFICIENT"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호 분배로 어떤 식을 복원하고 다시 덧셈을 수행하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
      "이항",
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

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

\$(6x^2 \- 3x^3) \\div \\left(\\dfrac{1}{3}x\\right) \+ \\left(\\dfrac{3}{4}x^3 \- \\dfrac{9}{4}x^4\\right) \\div \\left(-\\dfrac{1}{4}x^2\\right)\$을 계산하였을 때, \$x^2\$의 계수는 \$a\$, \$x\$의 계수는 \$b\$이다. 이때 \$b \- a\$의 값은? \[4점\]

### 선지

① 12 ② 15 ③ 18 ④ \-15 ⑤ 0

### 정답

②

### 해설

두 다항식을 역수의 곱셈을 이용하여 각각 단항식으로 나눈 뒤 동류항을 정리한다. 1단계: 첫 번째 식을 계산한다. \$\$ \\begin{aligned} (6x^2 \- 3x^3) \\div \\left(\\frac{1}{3}x\\right) &= (6x^2 \- 3x^3) \\times \\frac{3}{x} \\ &= 6x^2 \\times \\frac{3}{x} \- 3x^3 \\times \\frac{3}{x} \\ &= 18x \- 9x^2 \\end{aligned} \$\$ 2단계: 두 번째 식을 계산한다. \$\$ \\begin{aligned} \\left(\\frac{3}{4}x^3 \- \\frac{9}{4}x^4\\right) \\div \\left(-\\frac{1}{4}x^2\\right) &= \\left(\\frac{3}{4}x^3 \- \\frac{9}{4}x^4\\right) \\times \\left(-\\frac{4}{x^2}\\right) \\ &= \\frac{3}{4}x^3 \\times \\left(-\\frac{4}{x^2}\\right) \- \\frac{9}{4}x^4 \\times \\left(-\\frac{4}{x^2}\\right) \\ &= \-3x \+ 9x^2 \\end{aligned} \$\$ 3단계: 두 식을 더한다. \$\$ (18x \- 9x^2) \+ (-3x \+ 9x^2) \= (-9 \+ 9)x^2 \+ (18 \- 3)x \= 15x \$\$ 4단계: 계수를 읽고 \$b \- a\$를 계산한다. \$x^2\$의 계수 \$a \= 0\$, \$x\$의 계수 \$b \= 15\$이다. \$\$ b \- a \= 15 \- 0 \= 15 \$\$ 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "분수 단항식 나눗셈의 역수 분배 및 이차항 소거 후 계수 차 산출 문항"
}
```

```
{
  "sourceQid": 17,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLY_DIV_BY_FRACTIONAL_MONOMIAL",
  "primaryMethod": "(18x - 9x^2) + (-3x + 9x^2) = 15x에서 a=0, b=15를 읽어 b-a=15를 계산한다.",
  "decisiveStep": "x^2 항이 (-9+9)x^2 = 0x^2으로 소거됨을 식별하여 a=0, b=15 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식과 다항식의 곱셈과 나눗셈",
    "l4": "다항식과 단항식의 나눗셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLY_DIV_MONO_COEFFICIENT_DIFF",
    "templateKey": "TPL_TWO_FRACTIONAL_DIVISION_TERM_CANCELLATION",
    "why": "분수 계수 단항식 나눗셈 합에서 특정 차수 항이 소거되는 대수 템플릿"
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
  "difficultyReason": "역수 곱셈 분배 2회와 부호 처리, 이차항 소거를 종합 연산하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "다항식",
      "단항식"
    ],
    "goal": [
      "계수"
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

## Q18

- 형식: 객관식  
- 배점: 3

### 발문

다음 부등식 중에서 \$x \= 2\$를 해로 갖는 것은? \[3점\]

### 선지

① \$3x \- 2 \> 4x\$ ② \$2x \\ge 5x\$ ③ \$4x \< x \- 1\$ ④ \$7 \\le 2x \+ 1\$ ⑤ \$3x \- 1 \< 4x\$

### 정답

⑤

### 해설

\$x \= 2\$를 각 부등식에 대입하여 참과 거짓을 판정한다. \$\$ \\begin{aligned} \\text{① } & 3(2) \- 2 \> 4(2) \\implies 6 \- 2 \> 8 \\implies 4 \> 8 \\text{ (거짓)} \\ \\text{② } & 2(2) \\ge 5(2) \\implies 4 \\ge 10 \\text{ (거짓)} \\ \\text{③ } & 4(2) \< 2 \- 1 \\implies 8 \< 1 \\text{ (거짓)} \\ \\text{④ } & 7 \\le 2(2) \+ 1 \\implies 7 \\le 5 \\text{ (거짓)} \\ \\text{⑤ } & 3(2) \- 1 \< 4(2) \\implies 6 \- 1 \< 8 \\implies 5 \< 8 \\text{ (참)} \\end{aligned} \$\$ 따라서 \$x \= 2\$를 해로 갖는 부등식은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "주어진 수 대입을 통한 부등식 해 여부 판별 기본 문항"
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
  "conceptClusterKey": "INEQUALITY_SOLUTION_SUBSTITUTION_TEST",
  "primaryMethod": "x=2를 대입하여 5 < 8이 성립하는 ⑤를 찾는다.",
  "decisiveStep": "3(2)-1 < 4(2) => 5 < 8 참 판정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식과 그 해",
    "l4": "부등식의 해 판정"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SOLUTION_CHECK",
    "templateKey": "TPL_SUBSTITUTE_TEST_INEQUALITY_SOLUTION",
    "why": "특정 값을 부등식에 직접 대입하여 참인 부등식을 고르는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자연수를 대입하여 사칙연산 후 대소관계를 확인하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식",
      "자연수"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "대입",
      "연산"
    ],
    "condition": [
      "대소비교"
    ]
  },
  "hold": ""
}
```

## Q19

- 형식: 객관식  
- 배점: 4

### 발문

\$a \- 2 \\le b \- 2\$일 때, \$\\Box\$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는? \[4점\]

### 선지

① \$6 \- a \\ \\Box \\ 6 \- b\$ ② \$a \+ 5 \\ \\Box \\ b \+ 5\$ ③ \$3a \+ 2 \\ \\Box \\ 3b \+ 2\$ ④ \$a \- (-3) \\ \\Box \\ b \- (-3)\$ ⑤ \$4 \+ \\dfrac{a}{2} \\ \\Box \\ 4 \+ \\dfrac{b}{2}\$

### 정답

①

### 해설

\$a \- 2 \\le b \- 2\$의 양변에 \$2\$를 더하면 \$a \\le b\$이다. 각 식에서 부등호 방향의 변화를 확인한다. \$\$ \\begin{aligned} \\text{① } & a \\le b\\text{의 양변에 음수 } \-1\\text{을 곱하면 } \-a \\ge \-b, \\quad 6\\text{을 더하면 } 6 \- a \\ge 6 \- b \\implies \\Box \= \\ge \\ \\text{② } & a \\le b\\text{의 양변에 } 5\\text{를 더하면 } a \+ 5 \\le b \+ 5 \\implies \\Box \= \\le \\ \\text{③ } & a \\le b\\text{의 양변에 양수 } 3\\text{을 곱하고 } 2\\text{를 더하면 } 3a \+ 2 \\le 3b \+ 2 \\implies \\Box \= \\le \\ \\text{④ } & a \- (-3) \= a \+ 3, \\quad b \- (-3) \= b \+ 3 \\implies a \+ 3 \\le b \+ 3 \\implies \\Box \= \\le \\ \\text{⑤ } & a \\le b\\text{의 양변을 양수 } 2\\text{로 나누고 } 4\\text{를 더하면 } 4 \+ \\frac{a}{2} \\le 4 \+ \\frac{b}{2} \\implies \\Box \= \\le \\end{aligned} \$\$ ②, ③, ④, ⑤의 부등호 방향은 모두 \$\\le\$이지만, ①만 음수를 곱하여 부등호 방향이 \$\\ge\$로 바뀐다. 따라서 나머지 넷과 다른 하나는 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "부등식 성질(음수 곱셈 시 부등호 역전) 방향 상이 선지 판정 문항"
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
  "conceptClusterKey": "INEQUALITY_SIGN_ORIENTATION_AUDIT",
  "primaryMethod": "a <= b에서 음수 -1을 곱한 ①만 6-a >= 6-b로 방향이 반대가 됨을 식별한다.",
  "decisiveStep": "①만 부등호 방향이 >=로 반전됨을 확인",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질 종합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SIGN_ORIENTATION",
    "templateKey": "TPL_INEQUALITY_SIGN_DIRECTION_OUTLIER",
    "why": "부등식 양변 연산에 따른 부등호 방향을 대조하여 유일한 반대 방향 식을 찾는 템플릿"
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
  "difficultyReason": "음수 곱셈에 따른 부등호 방향 역전을 확인하는 1단계 기본 문항",
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

## Q20

- 형식: 객관식  
- 배점: 5

### 발문

\$-5 \\le x \\le 3\$일 때, \$\\dfrac{1}{4} \+ ax\$의 최댓값이 \$4\$, 최솟값이 \$b\$이다. \$a \< 0\$일 때, 상수 \$a, b\$에 대하여 \$a \- b\$의 값은? \[5점\]

### 선지

① \$\\dfrac{1}{4}\$ ② \$\\dfrac{3}{4}\$ ③ \$1\$ ④ \$\\dfrac{5}{4}\$ ⑤ \$\\dfrac{7}{4}\$

### 정답

④

### 해설

\$a \< 0\$일 때 일차식의 단조감소 성질을 이용하여 \$a\$와 \$b\$를 구한다. 1단계: \$a \< 0\$이므로 \$-5 \\le x \\le 3\$의 각 변에 \$a\$를 곱하면 부등호의 방향이 반대로 바뀐다. \$\$ 3a \\le ax \\le \-5a \$\$ 각 변에 \$\\dfrac{1}{4}\$을 더한다. \$\$ \\frac{1}{4} \+ 3a \\le \\frac{1}{4} \+ ax \\le \\frac{1}{4} \- 5a \$\$ 2단계: 최댓값 조건을 이용하여 \$a\$를 구한다. 최댓값은 \$x \= \-5\$일 때인 \$\\dfrac{1}{4} \- 5a\$이다. 문제에서 최댓값이 \$4\$이므로 \$\$ \\begin{aligned} \\frac{1}{4} \- 5a &= 4 \\ \-5a &= 4 \- \\frac{1}{4} \= \\frac{15}{4} \\ a &= \-\\frac{15}{4} \\times \\frac{1}{5} \= \-\\frac{3}{4} \\end{aligned} \$\$ \$a \= \-\\dfrac{3}{4} \< 0\$이므로 조건을 만족한다.

3단계: 최솟값 \$b\$를 구한다. 최솟값은 \$x \= 3\$일 때인 \$\\dfrac{1}{4} \+ 3a\$이다. \$\$ b \= \\frac{1}{4} \+ 3\\left(-\\frac{3}{4}\\right) \= \\frac{1}{4} \- \\frac{9}{4} \= \-\\frac{8}{4} \= \-2 \$\$ 4단계: \$a \- b\$의 값을 계산한다. \$\$ a \- b \= \-\\frac{3}{4} \- (-2) \= \-\\frac{3}{4} \+ 2 \= \\frac{5}{4} \$\$ 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "음수 계수 일차함수형 식의 닫힌구간 내 최댓값·최솟값 역순 대응 매개변수 산출 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "LINEAR_BOUNDED_INTERVAL_EXTREMA",
  "primaryMethod": "a < 0에서 최댓값은 x=-5일 때 1/4 - 5a = 4이므로 a=-3/4, 최솟값은 x=3일 때 b=-2를 구해 a-b=5/4를 계산한다.",
  "decisiveStep": "1/4 - 5a = 4에서 a = -3/4 도출 후 x=3 대입으로 b = -2 및 차 5/4 산출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "일차부등식의 해의 범위"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INTERVAL_LINEAR_EXTREMA",
    "templateKey": "TPL_BOUNDED_INTERVAL_LINEAR_PARAM_DIFF",
    "why": "구간 내 음수 계수 일차식의 양 끝점 극값 대응으로 매개변수를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON",
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_RANGE",
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음수 곱셈에 따른 극값 위치 역전과 분수 일차방정식, 차 연산을 통합하는 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "부등식",
      "유리수"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "방정식",
      "대소비교",
      "연산"
    ],
    "condition": [
      "음수",
      "최댓값",
      "최솟값"
    ]
  },
  "hold": ""
}
```

## Q21

- 형식: 서술형  
- 배점: 7

### 발문

순환소수 \$1.8\\dot{3}\$에 자연수 \$A\$를 곱하면 자연수가 된다. 다음 물음에 답하시오. \[7점\]

(1) 순환소수를 \$x\$로 놓고 기약분수로 나타내는 과정을 서술하시오. \[4점\] (2) \$A\$의 값 중 가장 작은 세 자리의 자연수를 구하시오. \[3점\]

### 선지

없음

### 정답

(1) \$\\dfrac{11}{6}\$  (2) 102

### 해설

순환소수를 10의 거듭제곱 방정식으로 기약분수로 변환하고 배수 조건을 적용한다.

(1) \[4점\] \$x \= 1.8333\\dots\$라 두자. 소수점 아래 순환마디의 시작과 끝 위치에 맞춰 \$100\$과 \$10\$을 양변에 곱한다. \$\$ 100x \= 183.3333\\dots \\quad \\cdots\\text{ ㉠} \$\$ \$\$ 10x \= 18.3333\\dots \\quad \\cdots\\text{ ㉡} \$\$ \[1.5점\] ㉠에서 ㉡을 변끼리 빼면 \$\$ \\begin{aligned} 100x \- 10x &= 183 \- 18 \\ 90x &= 165 \\ x &= \\frac{165}{90} \\end{aligned} \$\$ \[1.5점\] 분모와 분자를 최대공약수인 \$15\$로 약분하여 기약분수로 나타낸다. \$\$ x \= \\frac{165 \\div 15}{90 \\div 15} \= \\frac{11}{6} \$\$ 따라서 기약분수는 \$\\dfrac{11}{6}\$이다. \[1점\]

(2) \[3점\] \$\\dfrac{11}{6} \\times A\$가 자연수가 되려면, 분모 \$6\$이 \$A\$와 완전히 약분되어야 하므로 \$A\$는 \$6\$의 배수이어야 한다. \[1.5점\] 세 자리 자연수는 \$100\$ 이상 \$999\$ 이하이므로 \$\$ 100 \\div 6 \= 16.666\\dots \$\$ 따라서 \$A\$는 \$6 \\times 17\$부터 세 자리 자연수가 된다. \$\$ A \= 6 \\times 17 \= 102 \$\$ 그러므로 \$A\$의 값 중 가장 작은 세 자리의 자연수는 \$102\$이다. \[1.5점\]

따라서 (1) \$\\dfrac{11}{6}\$, (2) 102이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수 분수 변환 단계별 서술 및 분모 소거를 위한 최소 세 자리 배수 산출 서술형 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_FRACTION_MULTIPLIER_STEPWISE",
  "primaryMethod": "100x-10x=165에서 x=11/6을 도출하고 분모 6의 배수 중 가장 작은 세 자리 수 102를 산출한다.",
  "decisiveStep": "x=11/6 약분 및 6*17=102 결정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_MULTIPLIER_STEPWISE",
    "templateKey": "TPL_REPEATING_CONVERSION_NATURAL_PRODUCT",
    "why": "순환소수를 기약분수로 도출하는 전개 과정과 자연수가 되기 위한 최소 배수를 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_REDUCING_FRACTION",
    "CC_DIVISIBILITY_CONSTRAINTS"
  ],
  "conditionKeys": [
    "COND_NATURAL",
    "COND_RANGE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거듭제곱 뺄셈 분수 변환 전개와 세 자리 최소 배수 탐색을 결합한 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수",
      "기약분수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "방정식",
      "약수",
      "배수",
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
- 배점: 6

### 발문

\$\\left(\\dfrac{2x^3}{y^a}\\right)^b \= \\dfrac{8x^c}{y^{12}}\$일 때, 상수 \$a, b, c\$에 대하여 \$a \+ b \- c\$의 값을 구하는 과정을 서술하시오. (단, \$a, b, c\$는 자연수) \[6점\]

### 선지

없음

### 정답

\-2

### 해설

좌변의 식에 거듭제곱의 분배 및 곱셈 지수법칙을 적용하여 우변과 계수 및 지수를 비교한다.

1단계: 좌변의 괄호를 전개한다. \$\$ \\left(\\frac{2x^3}{y^a}\\right)^b \= \\frac{2^b (x^3)^b}{(y^a)^b} \= \\frac{2^b x^{3b}}{y^{ab}} \\quad \[2\\text{점}\] \$\$

2단계: 우변 \$\\dfrac{8x^c}{y^{12}}\$과 계수 및 각 문자의 지수를 비교한다.

- 계수 비교: \$\$2^b \= 8 \= 2^3 \\implies b \= 3 \\quad \[1.5\\text{점}\]\$\$  
- \$x\$의 지수 비교: \$\$c \= 3b \= 3 \\times 3 \= 9 \\quad \[1\\text{점}\]\$\$  
- \$y\$의 지수 비교: \$\$ab \= 12 \\implies 3a \= 12 \\implies a \= 4 \\quad \[1\\text{점}\]\$\$

3단계: \$a \+ b \- c\$의 값을 계산한다. \$\$ a \+ b \- c \= 4 \+ 3 \- 9 \= 7 \- 9 \= \-2 \\quad \[0.5\\text{점}\] \$\$

따라서 \$a \+ b \- c\$의 값은 \$-2\$이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식 분수 거듭제곱 전개 및 3개 미지 계수·지수 항등 비교 서술형 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_POWER_IDENTITY_SYSTEM_STEPWISE",
  "primaryMethod": "2^b=8에서 b=3, 3b=c에서 c=9, ab=12에서 a=4를 구하고 a+b-c = 4+3-9 = -2를 서술한다.",
  "decisiveStep": "b=3 확정 후 c=9, a=4 산출 및 최종 연산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수법칙의 응용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_SYSTEM_EQUATION",
    "templateKey": "TPL_MONOMIAL_POWER_IDENTITY_STEPWISE",
    "why": "거듭제곱 분배 후 계수와 지수를 일치시켜 세 매개변수의 선형 결합을 구하는 템플릿"
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
  "difficultyReason": "거듭제곱 전개와 계수/지수 방정식 3개를 체계적으로 서술하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "단항식",
      "거듭제곱"
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

\$-2 \\le x \\le 4\$일 때, \$a \\le 4 \- \\dfrac{1}{3}x \\le b\$이다. 이때 \$9ab\$의 값을 구하는 과정을 서술하시오. (단, \$a, b\$는 상수) \[7점\]

### 선지

없음

### 정답

112

### 해설

부등식의 성질을 적용하여 식의 범위를 차례대로 유도하고 곱을 구한다.

1단계: 주어진 부등식 \$-2 \\le x \\le 4\$의 각 변에 \$-\\dfrac{1}{3}\$을 곱한다. 음수를 곱하므로 부등호의 방향이 반대로 바뀐다. \$\$ \-\\frac{1}{3} \\times 4 \\le \-\\frac{1}{3}x \\le \-\\frac{1}{3} \\times (-2) \$\$ \$\$ \-\\frac{4}{3} \\le \-\\frac{1}{3}x \\le \\frac{2}{3} \\quad \[3\\text{점}\] \$\$

2단계: 각 변에 \$4\$를 더한다. \$\$ 4 \- \\frac{4}{3} \\le 4 \- \\frac{1}{3}x \\le 4 \+ \\frac{2}{3} \$\$ 통분하여 계산하면 \$\$ \\frac{8}{3} \\le 4 \- \\frac{1}{3}x \\le \\frac{14}{3} \\quad \[2\\text{점}\] \$\$ 따라서 \$a \= \\dfrac{8}{3}, b \= \\dfrac{14}{3}\$이다. \[1점\]

3단계: \$9ab\$의 값을 계산한다. \$\$ \\begin{aligned} 9ab &= 9 \\times \\frac{8}{3} \\times \\frac{14}{3} \\ &= 9 \\times \\frac{8 \\times 14}{9} \\ &= 8 \\times 14 \\ &= 112 \\quad \[1\\text{점}\] \\end{aligned} \$\$

따라서 \$9ab\$의 값은 \$112\$이다.

```
{
  "status": "EXEMPT",
  "reason": "음수 곱셈 부등호 방향 반전 및 상수 덧셈을 통한 구간 변환 및 곱 계산 서술형 문항"
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
  "conceptClusterKey": "INEQUALITY_INTERVAL_AFFINE_TRANSFORMATION",
  "primaryMethod": "-1/3을 곱해 -4/3 <= -1/3x <= 2/3로 반전 후 4를 더해 a=8/3, b=14/3에서 9ab=112를 서술한다.",
  "decisiveStep": "음수 -1/3 곱셈 시 부등호 역전 서술 및 9ab = 9*(8/3)*(14/3)=112 계산",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질을 이용한 식의 값의 범위"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_RANGE_AFFINE_TRANSFORM",
    "templateKey": "TPL_BOUNDED_INTERVAL_LINEAR_PRODUCT_EVAL",
    "why": "구간 부등식의 선형 변환 후 양 끝점 상수의 곱을 산출하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON",
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_RANGE",
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음수 곱셈에 따른 부등호 반전 서술과 분수 통분, 곱 연산을 결합한 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "부등식",
      "유리수"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "부호",
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

