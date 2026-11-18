

```
{
  "stem": "26_연향중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/26_연향중_1학기_중간_중2_기출.js",
  "examFolder": "1mid",
  "grade": "중2",
  "curriculum": "2022",
  "questionCount": 23,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```

## Q01

- 형식: 객관식  
- 배점: 3

### 발문

다음 분수를 소수로 나타낼 때, 유한소수인 것은?

### 선지

① \$\\frac{21}{2^3 \\times 3 \\times 5}\$ ② \$\\frac{7}{18}\$ ③ \$\\frac{11}{24}\$ ④ \$\\frac{9}{2^2 \\times 3^3 \\times 5}\$ ⑤ \$\\frac{14}{75}\$

### 정답

①

### 해설

분수를 기약분수로 나타낸 후 분모를 소인수분해했을 때, 분모의 소인수가 \$2\$ 또는 \$5\$뿐이면 유한소수이다. 각 선지를 기약분수로 나타내어 분모의 소인수를 확인하면 다음과 같다. ① \$\\frac{21}{2^3 \\times 3 \\times 5} \= \\frac{7}{2^3 \\times 5}\$ 분모의 소인수가 \$2\$와 \$5\$뿐이므로 유한소수이다. ② \$\\frac{7}{18} \= \\frac{7}{2 \\times 3^2}\$ 분모에 \$2\$와 \$5\$ 이외의 소인수 \$3\$이 있으므로 순환소수이다. ③ \$\\frac{11}{24} \= \\frac{11}{2^3 \\times 3}\$ 분모에 소인수 \$3\$이 있으므로 순환소수이다. ④ \$\\frac{9}{2^2 \\times 3^3 \\times 5} \= \\frac{1}{2^2 \\times 3 \\times 5}\$ 분모에 소인수 \$3\$이 있으므로 순환소수이다. ⑤ \$\\frac{14}{75} \= \\frac{14}{3 \\times 5^2}\$ 분모에 소인수 \$3\$이 있으므로 순환소수이다. 따라서 유한소수인 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "기약분수 분모의 소인수 분해를 이용한 유한소수 판별 기본 연산 문항"
}
```

```
{
  "sourceQid": 1,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FINITE_DECIMAL_CONDITIONS",
  "primaryMethod": "기약분수의 분모를 소인수분해하여 분모에 2 또는 5 이외의 소인수가 있는지 판별한다.",
  "decisiveStep": "21/(2^3·3·5)=7/(2^3·5)로 기약분수화하여 분모 소인수가 2와 5뿐임을 도출한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_IDENTIFICATION",
    "templateKey": "TPL_FINITE_DECIMAL_PRIME_FACTORS",
    "why": "기약분수의 분모 소인수가 2 또는 5만 존재하는지 확인하는 유형"
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
  "difficultyReason": "기약분수의 분모 소인수 분해를 통해 유한소수를 바로 판정하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "분수",
      "기약분수"
    ],
    "goal": [
      "유한소수"
    ],
    "method": [
      "소인수분해"
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

분수 \$\\frac{13}{55}\$을 소수로 나타낼 때, 소수점 아래 2026번째 자리의 숫자는?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

분수 \$\\frac{13}{55}\$을 소수로 나타내기 위해 분자 \$13\$을 분모 \$55\$로 나누면 \$\$ \\frac{13}{55} \= 0.2363636\\cdots \= 0.2\\dot{3}\\dot{6} \$\$ 소수점 아래 첫째 자리의 숫자는 \$2\$이고, 소수점 아래 둘째 자리부터는 두 개의 숫자 \$3, 6\$이 순환마디를 이루어 반복된다. 소수점 아래 \$2026\$번째 자리의 숫자는 순환마디의 시작인 소수점 아래 둘째 자리부터 세었을 때 \$\$ 2026 \- 1 \= 2025\\text{ (번째)} \$\$ 순환마디의 길이가 \$2\$이므로 \$2025\$를 \$2\$로 나누면 \$\$ 2025 \= 2 \\times 1012 \+ 1 \$\$ 따라서 순환마디의 첫 번째 숫자인 \$3\$이 된다. 그러므로 소수점 아래 \$2026\$번째 자리의 숫자는 \$3\$이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수의 순환마디 주기성을 이용한 자릿수 계산 문항"
}
```

```
{
  "sourceQid": 2,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_PERIODICITY",
  "primaryMethod": "분수를 순환소수로 변환한 뒤 순환마디의 주기와 자릿수의 나눗셈 나머지를 이용해 숫자를 구한다.",
  "decisiveStep": "2026-1=2025를 주기 2로 나눈 나머지가 1이므로 순환마디의 첫 번째 수 3을 도출한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_DIGIT",
    "templateKey": "TPL_REPEATING_DECIMAL_PERIODIC_DIGIT",
    "why": "순환마디의 시작 위치와 주기를 고려하여 특정 자릿수의 숫자를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "비순환 자릿수 1개를 제외하고 주기를 적용해 특정 위치 숫자를 추적하는 전형 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "분수",
      "자연수"
    ],
    "goal": [
      "순환소수"
    ],
    "method": [
      "사칙연산"
    ],
    "condition": [
      "자릿수"
    ]
  },
  "hold": ""
}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

분수 \$\\frac{33}{2 \\times 3 \\times 5 \\times a}\$이 순환소수가 되도록 하는 한 자리 자연수 \$a\$의 값의 개수는?

### 선지

① \$8\$개 ② \$7\$개 ③ \$6\$개 ④ \$5\$개 ⑤ \$4\$개

### 정답

⑤

### 해설

주어진 분수의 분자와 분모를 \$3\$으로 약분하여 기약분수로 나타내면 \$\$ \\frac{33}{2 \\times 3 \\times 5 \\times a} \= \\frac{11}{2 \\times 5 \\times a} \= \\frac{11}{10a} \$\$ 이 분수가 순환소수가 되려면 기약분수의 분모에 \$2\$와 \$5\$ 이외의 소인수가 존재해야 한다. 한 자리 자연수 \$a\$는 \$1, 2, 3, 4, 5, 6, 7, 8, 9\$이다. 먼저 유한소수가 되는 \$a\$를 찾으면, \$a\$의 소인수가 \$2\$ 또는 \$5\$뿐이어야 하므로 \$\$ a \\in {1, 2, 4, 5, 8} \$\$ 로 \$5\$개이다. (분자의 \$11\$과 약분되는 한 자리 자연수는 없다.) 전체 한 자리 자연수의 개수 \$9\$개 중 유한소수가 되는 경우를 제외하면 순환소수가 되므로 \$\$ a \\in {3, 6, 7, 9} \$\$ 따라서 순환소수가 되도록 하는 한 자리 자연수 \$a\$의 값의 개수는 \$4\$개이다.

```
{
  "status": "EXEMPT",
  "reason": "약분 후 분모 소인수 조건을 분석하여 순환소수가 되는 미지수 개수를 세는 문항"
}
```

```
{
  "sourceQid": 3,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_CONDITIONS",
  "primaryMethod": "분수를 약분한 뒤 분모의 소인수 조건을 이용해 유한소수가 되는 값을 제외하여 순환소수의 개수를 구한다.",
  "decisiveStep": "약분 후 11/(10a)에서 a=3, 6, 7, 9의 4개가 순환소수가 됨을 도출한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "분모의 소인수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_CONDITIONS",
    "templateKey": "TPL_REPEATING_DECIMAL_UNKNOWN_DENOMINATOR",
    "why": "분모의 미지수 조건에 따라 순환소수가 되는 정수 개수를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_NUMBER_OF_ELEMENTS"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "약분 후 2와 5 이외의 소인수를 갖는 한 자리 자연수를 빠짐없이 분류하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "분수",
      "자연수"
    ],
    "goal": [
      "순환소수"
    ],
    "method": [
      "소인수분해",
      "약분"
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

일차방정식 \$0.2x \+ 0.0\\dot{5} \= 0.\\dot{7}\$의 해를 순환소수로 바르게 나타낸 것은?

### 선지

① \$3.5\\dot{8}\$ ② \$3.6\\dot{1}\$ ③ \$3.\\dot{6}\\dot{1}\$ ④ \$3.7\\dot{2}\$ ⑤ \$3.\\dot{7}\\dot{2}\$

### 정답

②

### 해설

순환소수를 분수로 고치면 \$\$ 0.0\\dot{5} \= \\frac{5}{90} \= \\frac{1}{18},\\qquad 0.\\dot{7} \= \\frac{7}{9} \= \\frac{14}{18} \$\$ 소수 \$0.2\$는 \$\\frac{1}{5}\$이므로 주어진 일차방정식은 \$\$ \\frac{1}{5}x \+ \\frac{1}{18} \= \\frac{14}{18} \$\$ 양변에서 \$\\frac{1}{18}\$을 빼면 \$\$ \\frac{1}{5}x \= \\frac{14}{18} \- \\frac{1}{18} \= \\frac{13}{18} \$\$ 양변에 \$5\$를 곱하여 \$x\$를 구하면 \$\$ x \= \\frac{13}{18} \\times 5 \= \\frac{65}{18} \$\$ \$\\frac{65}{18}\$을 순환소수로 나타내면 \$\$ 65 \\div 18 \= 3.6111\\cdots \= 3.6\\dot{1} \$\$ 따라서 구하는 해를 순환소수로 바르게 나타낸 것은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수를 분수로 변환하여 일차방정식을 푼 뒤 다시 순환소수로 표현하는 계산 문항"
}
```

```
{
  "sourceQid": 4,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_EQUATION",
  "primaryMethod": "순환소수를 분수로 나타낸 후 일차방정식을 풀고 그 해를 순환소수로 다시 변환한다.",
  "decisiveStep": "x=65/18을 구한 뒤 65÷18=3.6111...=3.6(1)을 도출한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_EQUATION",
    "templateKey": "TPL_EQUATION_WITH_REPEATING_DECIMALS",
    "why": "순환소수 계수 및 상수를 분수로 변환하여 일차방정식을 해결하는 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환소수와 분수 상호 변환 및 일차방정식 풀이를 결합한 전형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수",
      "일차방정식"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "방정식"
    ],
    "condition": [
      "분수"
    ]
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

순환소수 \$0.2\\dot{7}\$에 어떤 자연수 \$n\$을 곱하면 유한소수로 나타낼 수 있을 때, 다음 중 \$n\$의 값이 될 수 없는 것은?

### 선지

① \$9\$ ② \$18\$ ③ \$27\$ ④ \$30\$ ⑤ \$36\$

### 정답

④

### 해설

순환소수 \$0.2\\dot{7}\$을 분수로 나타내면 \$\$ 0.2\\dot{7} \= \\frac{27 \- 2}{90} \= \\frac{25}{90} \= \\frac{5}{18} \$\$ 분모 \$18\$을 소인수분해하면 \$\$ \\frac{5}{18} \= \\frac{5}{2 \\times 3^2} \$\$ 이 식에 자연수 \$n\$을 곱한 식 \$\$ \\frac{5}{2 \\times 3^2} \\times n \$\$ 이 유한소수가 되려면 분모의 소인수 \$3^2=9\$가 약분되어 사라져야 하므로 \$n\$은 \$9\$의 배수이어야 한다. 선지의 수들을 살펴보면 ① \$9 \= 9 \\times 1\$ (\$9\$의 배수) ② \$18 \= 9 \\times 2\$ (\$9\$의 배수) ③ \$27 \= 9 \\times 3\$ (\$9\$의 배수) ④ \$30\$은 \$9\$의 배수가 아니다. (\$30\$을 곱하면 \$\\frac{5}{18} \\times 30 \= \\frac{25}{3}\$으로 분모에 \$3\$이 남아 유한소수가 될 수 없다.) ⑤ \$36 \= 9 \\times 4\$ (\$9\$의 배수) 따라서 \$n\$의 값이 될 수 없는 것은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수에 자연수를 곱해 유한소수를 만들기 위한 배수 조건 판별 문항"
}
```

```
{
  "sourceQid": 5,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FINITE_DECIMAL_MULTIPLIER",
  "primaryMethod": "순환소수를 기약분수로 나타내어 분모의 2와 5 이외 소인수를 약분할 수 있는 배수 조건을 구한다.",
  "decisiveStep": "분모가 2·3^2이므로 n이 9의 배수여야 함을 파악하고 30이 9의 배수가 아님을 판별한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "분모의 소인수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MULTIPLIER_FOR_FINITE_DECIMAL",
    "templateKey": "TPL_MULTIPLIER_FOR_FINITE_DECIMAL",
    "why": "순환소수를 유한소수로 만들기 위한 곱하는 수의 배수 조건을 찾는 유형"
  },
  "crossConceptKeys": [
    "CC_LEAST_COMMON_MULTIPLE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분모 소인수분해 후 3^2을 없애기 위해 9의 배수가 아닌 선지를 고르는 기본 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "순환소수",
      "자연수"
    ],
    "goal": [
      "유한소수"
    ],
    "method": [
      "소인수분해"
    ],
    "condition": [
      "배수"
    ]
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

다음 \<보기\> 중 옳지 않은 것만을 있는 대로 고른 것은?

### 선지

① ㄱ, ㄹ ② ㄴ, ㄷ ③ ㄱ, ㄷ ④ ㄴ, ㄹ ⑤ ㄱ, ㄴ, ㄹ

### 정답

①

### 해설

\<보기\>의 각 문장의 참, 거짓을 판정하면 다음과 같다. ㄱ. 무한소수 중에는 순환소수와 같이 유리수인 것도 있지만, \$\\pi\$와 같이 순환하지 않는 무한소수는 유리수가 아니다. 따라서 '무한소수는 모두 유리수이다.'는 옳지 않다. (거짓) ㄴ. 모든 순환소수는 분수 \$\\frac{a}{b}\$ (\$a, b\$는 정수, \$b \\ne 0\$) 꼴로 나타낼 수 있으므로 유리수이다. (참) ㄷ. 기약분수의 분모를 소인수분해했을 때 분모의 소인수가 \$2\$ 또는 \$5\$뿐이면 10의 거듭제곱 꼴로 변형할 수 있어 유한소수로 나타낼 수 있다. (참) ㄹ. 기약분수의 분모에 \$2\$ 또는 \$5\$ 이외의 소인수(예: \$3, 7\$ 등)가 있으면 유한소수로 나타낼 수 없고 순환소수로 나타내어진다. 따라서 '모든 기약분수는 분모의 소인수와 관계없이 유한소수로 나타낼 수 있다.'는 옳지 않다. (거짓) 이상에서 옳지 않은 것은 ㄱ, ㄹ이다. 따라서 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "유리수와 순환소수 개념 체계의 참·거짓 판정 문항"
}
```

```
{
  "sourceQid": 6,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "RATIONAL_AND_DECIMAL_CONCEPTS",
  "primaryMethod": "유리수, 유한소수, 순환소수, 무한소수의 정의와 포함 관계를 바탕으로 각 보기를 판정한다.",
  "decisiveStep": "비순환무한소수의 반례로 ㄱ이 거짓임을 밝히고 분모 소인수 조건으로 ㄹ이 거짓임을 확인한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "유리수와 소수 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RATIONAL_DECIMAL_TRUE_FALSE",
    "templateKey": "TPL_RATIONAL_DECIMAL_PROPERTIES",
    "why": "소수의 분류 및 유리수의 개념적 정의를 판별하는 유형"
  },
  "crossConceptKeys": [
    "CC_CLASSIFICATION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수 체계 정의(순환소수, 무한소수, 유리수)의 포함 관계를 정밀하게 이해하고 있는지 평가",
  "level": "중",
  "item4slot": {
    "given": [
      "유리수",
      "순환소수"
    ],
    "goal": [
      "유한소수"
    ],
    "method": [
      "분수"
    ],
    "condition": [
      "소인수"
    ]
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 3

### 발문

다음 계산 중 옳은 것은?

### 선지

① \$a^4 \\times a^3 \= a^{12}\$ ② \$(x^3)^4 \= x^7\$ ③ \$(-3a^2)^3 \= \-27a^6\$ ④ \$2^8 \\div 2^5 \\div 2^3 \= 2\$ ⑤ \$\\left(\\frac{2x}{y^3}\\right)^3 \= \\frac{6x^3}{y^9}\$

### 정답

③

### 해설

지수법칙을 적용하여 각 선지를 바르게 계산하면 다음과 같다. ① \$a^4 \\times a^3 \= a^{4+3} \= a^7 \\ne a^{12}\$ (옳지 않음) ② \$(x^3)^4 \= x^{3 \\times 4} \= x^{12} \\ne x^7\$ (옳지 않음) ③ \$(-3a^2)^3 \= (-3)^3 \\times (a^2)^3 \= \-27a^6\$ (옳음) ④ \$2^8 \\div 2^5 \\div 2^3 \= 2^{8-5} \\div 2^3 \= 2^3 \\div 2^3 \= 1 \\ne 2\$ (옳지 않음) ⑤ \$\\left(\\frac{2x}{y^3}\\right)^3 \= \\frac{2^3 \\times x^3}{(y^3)^3} \= \\frac{8x^3}{y^9} \\ne \\frac{6x^3}{y^9}\$ (옳지 않음) 따라서 옳은 것은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "거듭제곱의 곱, 몫, 거듭제곱의 거듭제곱 등 지수법칙 기본 연산 확인 문항"
}
```

```
{
  "sourceQid": 7,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "EXPONENT_LAWS_BASIC",
  "primaryMethod": "지수의 곱셈, 나눗셈, 거듭제곱 공식을 선지별로 엄밀하게 적용하여 옳은 식을 찾는다.",
  "decisiveStep": "(-3a^2)^3 = (-3)^3 · (a^2)^3 = -27a^6이 성립함을 검증한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 곱·몫"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_LAWS_BASIC",
    "templateKey": "TPL_EXPONENT_LAWS_VERIFICATION",
    "why": "기본 지수법칙의 계산 오류 유발 선지 속에서 옳은 계산을 고르는 유형"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SIMPLIFICATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "지수의 덧셈, 곱셈, 음수 부호 거듭제곱 법칙을 확인하는 기본 계산 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "지수법칙"
    ],
    "method": [
      "단항식"
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

\$A \= 2^8 \\times 3^3 \\times 5^6\$일 때, \$A\$는 몇 자리 자연수인가?

### 선지

① \$5\$자리 ② \$6\$자리 ③ \$7\$자리 ④ \$8\$자리 ⑤ \$9\$자리

### 정답

⑤

### 해설

\$10 \= 2 \\times 5\$임을 이용하여 \$2\$와 \$5\$를 같은 지수로 묶어 \$10\$의 거듭제곱으로 나타낸다. \$\$ A \= 2^8 \\times 3^3 \\times 5^6 \= 2^2 \\times 3^3 \\times (2^6 \\times 5^6) \$\$ 앞부분의 수를 계산하면 \$\$ 2^2 \\times 3^3 \= 4 \\times 27 \= 108 \$\$ \$2^6 \\times 5^6 \= 10^6\$이므로 \$\$ A \= 108 \\times 10^6 \$\$ \$108\$은 \$3\$자리 자연수이고, 뒤에 \$0\$이 \$6\$개 붙으므로 \$A\$의 자릿수는 \$\$ 3 \+ 6 \= 9\\text{ (자리)} \$\$ 따라서 \$A\$는 \$9\$자리 자연수이다.

```
{
  "status": "EXEMPT",
  "reason": "2와 5의 거듭제곱을 10의 거듭제곱으로 묶어 자연수의 자릿수를 결정하는 문항"
}
```

```
{
  "sourceQid": 8,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "NUMBER_OF_DIGITS_EXPONENT",
  "primaryMethod": "2^n * 5^n = 10^n 꼴로 묶어 k * 10^n 꼴로 변형한 뒤 자릿수를 계산한다.",
  "decisiveStep": "108 * 10^6 꼴로 변형하여 3 + 6 = 9자리임을 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 곱·몫"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_DIGITS_OF_LARGE_NUMBER",
    "templateKey": "TPL_NUMBER_OF_DIGITS_BASE_10",
    "why": "거듭제곱의 표현을 10의 거듭제곱 꼴로 바꾸어 자릿수를 계산하는 유형"
  },
  "crossConceptKeys": [
    "CC_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "2와 5의 짝을 맞추어 10의 거듭제곱으로 묶고 남은 계수의 자릿수를 더하는 전형 문제",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱",
      "자연수"
    ],
    "goal": [
      "자릿수"
    ],
    "method": [
      "지수법칙"
    ],
    "condition": [
      "소인수분해"
    ]
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 5

### 발문

\$1 \\times 2 \\times 3 \\times \\cdots \\times 12 \= 3^a \\times b\$일 때, 자연수 \$a\$의 값은? (단, \$b\$는 \$3\$의 배수가 아닌 자연수이다.)

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

②

### 해설

\$1\$부터 \$12\$까지의 자연수의 곱에서 소인수 \$3\$의 개수를 구한다. \$1\$부터 \$12\$까지의 자연수 중 소인수로 \$3\$을 포함하는 수들을 소인수분해하면 다음과 같다.

- \$3 \= 3^1\$ (\$3\$이 \$1\$개)  
- \$6 \= 2 \\times 3^1\$ (\$3\$이 \$1\$개)  
- \$9 \= 3^2\$ (\$3\$이 \$2\$개)  
- \$12 \= 2^2 \\times 3^1\$ (\$3\$이 \$1\$개) 그 외의 수인 \$1, 2, 4, 5, 7, 8, 10, 11\$은 소인수 \$3\$을 갖지 않는다. 따라서 전체 곱에 포함된 소인수 \$3\$의 총 개수 \$a\$는 \$\$ a \= 1 \+ 1 \+ 2 \+ 1 \= 5 \$\$ 소인수 \$3\$을 모두 묶어내면 \$3^5 \\times b\$의 꼴이 되며, 이때 \$b\$는 \$3\$을 소인수로 갖지 않으므로 \$3\$의 배수가 아니다. 따라서 자연수 \$a\$의 값은 \$5\$이다.

```
{
  "status": "EXEMPT",
  "reason": "연속한 자연수의 곱에 포함된 특정 소인수의 지수를 집계하는 문항"
}
```

```
{
  "sourceQid": 9,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "FACTORIAL_PRIME_EXPONENT",
  "primaryMethod": "각 합성수의 소인수분해에서 나타나는 소인수 3의 거듭제곱 지수를 모두 합산한다.",
  "decisiveStep": "3(1개), 6(1개), 9(2개), 12(1개)로부터 1+1+2+1=5를 계산한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_PRIME_FACTOR_EXPONENT_PRODUCT",
    "templateKey": "TPL_PRIME_FACTOR_COUNT_CONSECUTIVE",
    "why": "연속한 자연수의 곱에서 특정 소인수의 지수를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_LEAST_COMMON_MULTIPLE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "9가 소인수 3을 2개 포함한다는 점을 놓치지 않고 집계해야 하는 사고력 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수",
      "배수"
    ],
    "goal": [
      "지수"
    ],
    "method": [
      "소인수분해"
    ],
    "condition": [
      "소수"
    ]
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 5

### 발문

자연수 \$a, b\$에 대하여 아래 두 식을 만족할 때, \$a+b\$의 값은?

\$\$\\frac{24^2}{36} \= 2^a\\ ,\\qquad \\frac{5^6 \+ 5^6 \+ 5^6 \+ 5^6 \+ 5^6}{25^2} \= 5^b\$\$

### 선지

① \$10\$ ② \$9\$ ③ \$8\$ ④ \$7\$ ⑤ \$6\$

### 정답

④

### 해설

첫 번째 식의 밑을 소인수분해하여 지수법칙을 적용하면 \$\$ 24 \= 2^3 \\times 3,\\qquad 36 \= 2^2 \\times 3^2 \$\$ 이므로 \$\$ 24^2 \= (2^3 \\times 3)^2 \= (2^3)^2 \\times 3^2 \= 2^6 \\times 3^2 \$\$ 따라서 첫 번째 식의 좌변은 \$\$ \\frac{24^2}{36} \= \\frac{2^6 \\times 3^2}{2^2 \\times 3^2} \= 2^{6-2} \= 2^4 \$\$ \$2^4 \= 2^a\$이므로 \$a \= 4\$이다.

두 번째 식에서 분자는 같은 수 \$5^6\$을 \$5\$번 더한 것이므로 곱셈으로 나타내면 \$\$ 5^6 \+ 5^6 \+ 5^6 \+ 5^6 \+ 5^6 \= 5 \\times 5^6 \= 5^{1+6} \= 5^7 \$\$ 분모 \$25^2\$은 밑을 \$5\$로 고치면 \$\$ 25^2 \= (5^2)^2 \= 5^{2 \\times 2} \= 5^4 \$\$ 따라서 두 번째 식의 좌변은 \$\$ \\frac{5^7}{5^4} \= 5^{7-4} \= 5^3 \$\$ \$5^3 \= 5^b\$이므로 \$b \= 3\$이다.

따라서 구하는 \$a+b\$의 값은 \$\$ a \+ b \= 4 \+ 3 \= 7 \$\$ 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "소인수분해를 통한 지수 연산 및 같은 거듭제곱의 덧셈을 곱셈으로 변환하는 지수법칙 종합 문항"
}
```

```
{
  "sourceQid": 10,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "EXPONENT_COMBINED_OPERATIONS",
  "primaryMethod": "합성수 밑을 소인수분해하여 지수법칙을 적용하고 거듭제곱의 덧셈을 곱셈으로 고쳐 미지수를 구한다.",
  "decisiveStep": "24^2/36=2^4에서 a=4를 구하고 5·5^6/5^4=5^3에서 b=3을 구해 a+b=7을 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_COMBINED_EQUATIONS",
    "templateKey": "TPL_EXPONENT_ADDITION_AND_DIVISION",
    "why": "거듭제곱의 나눗셈과 거듭제곱의 덧셈을 다루는 복합 지수법칙 유형"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SUM"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거듭제곱의 덧셈(5^6의 5배)과 밑 변환 나눗셈을 정확히 통합 처리해야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱",
      "자연수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "지수법칙",
      "소인수분해"
    ],
    "condition": [
      "등식"
    ]
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 3

### 발문

다음 계산 중 옳은 것은?

### 선지

① \$18a^3b^2 \\div (-6ab^2) \= \-3a^2\$ ② \$4x \\times 5x \= 20x\$ ③ \$15x^3y \\div 3x \= 5x^4y\$ ④ \$3a^3 \\times (-4a^5) \= 12a^8\$ ⑤ \$\\frac{3}{4}xy^2 \\times (2x^2y)^2 \= 3x^4y^4\$

### 정답

①

### 해설

단항식의 곱셈과 나눗셈 법칙에 따라 각 선지를 계산하면 다음과 같다. ① \$18a^3b^2 \\div (-6ab^2) \= \\frac{18a^3b^2}{-6ab^2} \= \-3a^{3-1}b^{2-2} \= \-3a^2\$ (옳음) ② \$4x \\times 5x \= (4 \\times 5\) \\times (x \\times x) \= 20x^2 \\ne 20x\$ (옳지 않음) ③ \$15x^3y \\div 3x \= \\frac{15x^3y}{3x} \= 5x^{3-1}y \= 5x^2y \\ne 5x^4y\$ (옳지 않음) ④ \$3a^3 \\times (-4a^5) \= {3 \\times (-4)} \\times a^{3+5} \= \-12a^8 \\ne 12a^8\$ (옳지 않음) ⑤ \$\\frac{3}{4}xy^2 \\times (2x^2y)^2 \= \\frac{3}{4}xy^2 \\times 4x^4y^2 \= \\left(\\frac{3}{4} \\times 4\\right) x^{1+4}y^{2+2} \= 3x^5y^4 \\ne 3x^4y^4\$ (옳지 않음) 따라서 옳은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식의 곱셈과 나눗셈 계수 및 문자 지수 계산 확인 문항"
}
```

```
{
  "sourceQid": 11,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_OPERATIONS",
  "primaryMethod": "단항식의 계수는 계수끼리, 문자는 지수법칙을 적용하여 선지별 참·거짓을 판별한다.",
  "decisiveStep": "18a^3b^2 / (-6ab^2) = -3a^2을 정확히 계산하여 ①이 옳음을 확인한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "단항식의 나눗셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_MULTIPLICATION_DIVISION",
    "templateKey": "TPL_MONOMIAL_ARITHMETIC_VERIFICATION",
    "why": "단항식의 곱셈과 나눗셈 계산 과정에서 부호 및 지수 계산의 정확도를 묻는 유형"
  },
  "crossConceptKeys": [
    "CC_MONOMIAL_DIVISION"
  ],
  "conditionKeys": [
    "COND_NONZERO"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호와 문자의 지수를 올바르게 계산하는 단항식 사칙연산의 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "단항식"
    ],
    "goal": [
      "지수법칙"
    ],
    "method": [
      "사칙연산"
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

다음 식을 전개한 식에서 \$x\$의 계수와 상수항의 합은?

\$\$(x^2 \- 4xy \+ x) \\div \\frac{1}{2}x\$\$

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

다항식을 단항식으로 나눌 때, 나누는 식의 역수를 곱하여 분배법칙을 적용한다. \$\\frac{1}{2}x \= \\frac{x}{2}\$이므로 역수는 \$\\frac{2}{x}\$이다. \$\$ (x^2 \- 4xy \+ x) \\div \\frac{1}{2}x \= (x^2 \- 4xy \+ x) \\times \\frac{2}{x} \$\$ 각 항에 \$\\frac{2}{x}\$를 분배하여 곱하면 \$\$ x^2 \\times \\frac{2}{x} \- 4xy \\times \\frac{2}{x} \+ x \\times \\frac{2}{x} \= 2x \- 8y \+ 2 \$\$ 전개한 식 \$2x \- 8y \+ 2\$에서

- \$x\$의 계수는 \$2\$  
- 상수항은 \$2\$ 따라서 \$x\$의 계수와 상수항의 합은 \$\$ 2 \+ 2 \= 4 \$\$ 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식을 단항식으로 나누어 전개한 뒤 특정 항의 계수와 상수항의 합을 구하는 문항"
}
```

```
{
  "sourceQid": 12,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_DIVISION_BY_MONOMIAL",
  "primaryMethod": "역수의 곱셈 및 분배법칙으로 다항식을 전개한 후 x의 계수와 상수항을 찾아 더한다.",
  "decisiveStep": "전개식 2x - 8y + 2에서 계수 2와 상수항 2를 찾아 2 + 2 = 4를 계산한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "단항식과 다항식의 곱셈·나눗셈",
    "l4": "다항식을 단항식으로 나누기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_EXPANSION_COEFFICIENT",
    "templateKey": "TPL_POLYNOMIAL_DIVISION_EXPANSION",
    "why": "다항식을 단항식으로 나눈 식에서 계수 및 상수항을 추출하는 유형"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_DIVISION_BY_MONOMIAL"
  ],
  "conditionKeys": [
    "COND_NONZERO"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수 꼴 단항식의 역수를 분배법칙으로 올바르게 곱하고 동류항·계수를 식별하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "다항식",
      "단항식"
    ],
    "goal": [
      "계수",
      "상수항"
    ],
    "method": [
      "분배법칙",
      "다항식의나눗셈"
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
- 배점: 5

### 발문

다음 표에서 가로, 세로, 대각선에 있는 세 다항식의 합이 모두 같을 때, \$A-B\$의 값은?

|  | \$B\$ | \$2x^2+x+1\$ |
| :---: | :---: | :---: |
| \$x^2-x+4\$ | \$x^2+2x-3\$ | \$A\$ |
|  |  |  |

### 선지

① \$3x^2 \- 2x \+ 4\$ ② \$2x^2 \- 3x \+ 5\$ ③ \$-x^2 \+ 4x \- 6\$ ④ \$-2x^2 \+ 5x \- 8\$ ⑤ \$2x^2 \+ 4x \- 6\$

### 정답

⑤

### 해설

\$3 \\times 3\$ 마방진에서 가로, 세로, 대각선에 있는 세 다항식의 합을 \$S\$라 하자. 중앙에 위치한 다항식은 \$x^2 \+ 2x \- 3\$이므로, 마방진의 성질에 의해 한 줄의 합 \$S\$는 중앙 다항식의 \$3\$배와 같다. \$\$ S \= 3(x^2 \+ 2x \- 3\) \= 3x^2 \+ 6x \- 9 \$\$ 먼저 제2행(가로 둘째 줄)의 세 다항식의 합이 \$S\$이므로 \$\$ (x^2 \- x \+ 4\) \+ (x^2 \+ 2x \- 3\) \+ A \= 3x^2 \+ 6x \- 9 \$\$ 좌변의 동류항을 정리하면 \$\$ (2x^2 \+ x \+ 1\) \+ A \= 3x^2 \+ 6x \- 9 \$\$ 따라서 \$A\$는 \$\$ A \= (3x^2 \+ 6x \- 9\) \- (2x^2 \+ x \+ 1\) \= x^2 \+ 5x \- 10 \$\$ 다음으로 제3행 제1열의 칸을 \$C\_{31}\$이라 하면, 오른쪽 위에서 왼쪽 아래로 이어지는 대각선의 세 다항식의 합이 \$S\$이므로 \$\$ C\_{31} \+ (x^2 \+ 2x \- 3\) \+ (2x^2 \+ x \+ 1\) \= 3x^2 \+ 6x \- 9 \$\$ \$\$ C\_{31} \+ (3x^2 \+ 3x \- 2\) \= 3x^2 \+ 6x \- 9 \\implies C\_{31} \= 3x \- 7 \$\$ 이제 제1열(세로 첫째 줄)의 세 다항식의 합이 \$S\$이므로, 제1행 제1열의 칸을 \$C\_{11}\$이라 하면 \$\$ C\_{11} \+ (x^2 \- x \+ 4\) \+ C\_{31} \= 3x^2 \+ 6x \- 9 \$\$ \$\$ C\_{11} \+ (x^2 \- x \+ 4\) \+ (3x \- 7\) \= 3x^2 \+ 6x \- 9 \$\$ \$\$ C\_{11} \+ (x^2 \+ 2x \- 3\) \= 3x^2 \+ 6x \- 9 \\implies C\_{11} \= 2x^2 \+ 4x \- 6 \$\$ 이제 제1행(가로 첫째 줄)의 세 다항식의 합이 \$S\$이므로 \$\$ C\_{11} \+ B \+ (2x^2 \+ x \+ 1\) \= 3x^2 \+ 6x \- 9 \$\$ \$\$ (2x^2 \+ 4x \- 6\) \+ B \+ (2x^2 \+ x \+ 1\) \= 3x^2 \+ 6x \- 9 \$\$ \$\$ (4x^2 \+ 5x \- 5\) \+ B \= 3x^2 \+ 6x \- 9 \$\$ \$\$ B \= (3x^2 \+ 6x \- 9\) \- (4x^2 \+ 5x \- 5\) \= \-x^2 \+ x \- 4 \$\$ 따라서 구하는 \$A \- B\$의 값은 \$\$ A \- B \= (x^2 \+ 5x \- 10\) \- (-x^2 \+ x \- 4\) \= 2x^2 \+ 4x \- 6 \$\$ 그러므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "3x3 마방진 구조에서 다항식의 덧셈과 뺄셈을 연쇄 적용하여 미지의 다항식을 구하는 문항"
}
```

```
{
  "sourceQid": 13,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "MAGIC_SQUARE_POLYNOMIAL",
  "primaryMethod": "중앙 다항식의 3배가 한 줄의 합임을 이용하거나 연립 다항식 덧셈·뺄셈으로 A와 B를 차례로 구한다.",
  "decisiveStep": "A=x^2+5x-10과 B=-x^2+x-4를 각각 구한 뒤 뺄셈하여 2x^2+4x-6을 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "동류항 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MAGIC_SQUARE_POLYNOMIALS",
    "templateKey": "TPL_MAGIC_SQUARE_ALGEBRAIC_EXPRESSIONS",
    "why": "마방진의 등식 조건을 다항식의 덧셈과 뺄셈 연산으로 해결하는 유형"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_SUBTRACTION"
  ],
  "conditionKeys": [
    "COND_ALGEBRAIC_MODELING"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식 마방진의 중앙값 성질을 활용하고 단계별 다항식 연산의 정확성을 요구하는 고난도 문항",
  "level": "중상",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
      "동류항",
      "사칙연산"
    ],
    "condition": [
      "합"
    ]
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

\$\$6b \- {4a \- 3b \- (2a \+ 2b \+ \\boxed{\\phantom{OO}} )} \= a \+ 4b\$\$일 때, \$\\boxed{\\phantom{OO}}\$ 안에 알맞은 식은?

### 선지

① \$4a \+ 5b\$ ② \$3a \- 7b\$ ③ \$2a \- 5b\$ ④ \$a \+ 3b\$ ⑤ \$-a \+ 4b\$

### 정답

②

### 해설

\$\\boxed{\\phantom{OO}}\$ 안에 알맞은 식을 \$X\$라 하고 좌변의 괄호를 안쪽 소괄호부터 차례로 푼다. 중괄호 안의 식을 정리하면 \$\$ 4a \- 3b \- (2a \+ 2b \+ X) \= 4a \- 3b \- 2a \- 2b \- X \= 2a \- 5b \- X \$\$ 이제 좌변 전체의 괄호를 풀면 \$\$ 6b \- (2a \- 5b \- X) \= 6b \- 2a \+ 5b \+ X \= \-2a \+ 11b \+ X \$\$ 주어진 등식에서 좌변과 우변이 같으므로 \$\$ \-2a \+ 11b \+ X \= a \+ 4b \$\$ \$X\$에 대하여 식을 정리하면 \$\$ X \= (a \+ 4b) \- (-2a \+ 11b) \= a \+ 4b \+ 2a \- 11b \= 3a \- 7b \$\$ 따라서 \$\\boxed{\\phantom{OO}}\$ 안에 알맞은 식은 \$3a \- 7b\$이다. 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식의 괄호 풀기와 이항을 이용한 미지의 다항식 구하기 문항"
}
```

```
{
  "sourceQid": 14,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_NESTED_BRACKETS",
  "primaryMethod": "소괄호, 중괄호를 분배법칙으로 풀고 동류항을 정리한 후 미지의 식 X를 구한다.",
  "decisiveStep": "좌변을 -2a + 11b + X로 정리한 후 우변 a + 4b와의 차를 계산하여 3a - 7b를 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "괄호가 있는 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_BRACKETS_UNKNOWN",
    "templateKey": "TPL_POLYNOMIAL_BRACKETS_SOLVING",
    "why": "다중 괄호가 포함된 식에서 네모 안의 다항식을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_SUBTRACTION"
  ],
  "conditionKeys": [
    "COND_ALGEBRAIC_MODELING"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "괄호 앞의 음수 부호 처리 및 동류항 계산의 실수를 방지해야 하는 전형 문항",
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
      "이항"
    ],
    "condition": [
      "등식"
    ]
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

다음 \<보기\> 중 부등식으로 옳게 나타낸 것만을 있는 대로 고른 것은?

**\<보 기\>**

ㄱ. 현재 \$x\$살인 동생과 그보다 4살 더 많은 형의 나이의 합이 30 이상이다. \$\\rightarrow x \+ 4 \\ge 30\$

ㄴ. 무게가 \$a\\,\\text{kg}\$인 상자 3개와 \$5\\,\\text{kg}\$인 가방의 총 무게는 \$35\\,\\text{kg}\$ 이하이다. \$\\rightarrow 3a \+ 5 \\le 35\$

ㄷ. 어떤 수 \$x\$에서 6을 뺀 값의 2배는 14보다 작지 않다. \$\\rightarrow 2(x \- 6\) \\ge 14\$

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

\<보기\>의 각 문장을 부등식으로 바르게 나타내어 판정하면 다음과 같다. ㄱ. 동생의 나이가 \$x\$살이고 형의 나이는 동생보다 \$4\$살 많으므로 \$(x \+ 4)\$살이다. 두 사람의 나이의 합은 \$x \+ (x \+ 4\) \= 2x \+ 4\$이다. 따라서 '나이의 합이 30 이상이다'를 부등식으로 나타내면 \$\$ 2x \+ 4 \\ge 30 \$\$ 이어야 한다. 보기의 \$x \+ 4 \\ge 30\$은 동생의 나이가 빠졌으므로 옳지 않다. (거짓) ㄴ. \$a,\\text{kg}\$인 상자 \$3\$개의 무게는 \$3a,\\text{kg}\$이고, \$5,\\text{kg}\$인 가방을 더한 총 무게는 \$(3a \+ 5),\\text{kg}\$이다. '총 무게가 \$35,\\text{kg}\$ 이하이다'를 부등식으로 나타내면 \$\$ 3a \+ 5 \\le 35 \$\$ 이므로 옳다. (참) ㄷ. 어떤 수 \$x\$에서 \$6\$을 뺀 값은 \$(x \- 6)\$이고, 그 값의 \$2\$배는 \$2(x \- 6)\$이다. '작지 않다'는 '크거나 같다(\$\\ge\$)'와 같은 뜻이므로 \$\$ 2(x \- 6\) \\ge 14 \$\$ 이므로 옳다. (참) 따라서 옳게 나타낸 것은 ㄴ, ㄷ이다. 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "실생활 언어 표현을 수학적 부등식 기호로 정확하게 모델링하는 문항"
}
```

```
{
  "sourceQid": 15,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_MODELING_STATEMENTS",
  "primaryMethod": "국어적 수량 관계(이상, 이하, 작지 않다)를 정확한 부등호 기호와 미지수 식으로 번역한다.",
  "decisiveStep": "ㄱ에서 동생과 형 나이 합 2x+4를 확인하고 ㄷ에서 '작지 않다'가 ≥임을 판별한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_EXPRESSION_MODELING",
    "templateKey": "TPL_STATEMENT_TO_INEQUALITY",
    "why": "문장으로 제시된 조건 관계를 올바른 부등식으로 세우는 유형"
  },
  "crossConceptKeys": [
    "CC_APPLIED_WORD_PROBLEMS"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "'작지 않다', '이상' 등 부등호 방향 및 포함 관계 어휘의 수학적 의미를 확인",
  "level": "중하",
  "item4slot": {
    "given": [
      "미지수",
      "자연수"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "부등식의성질"
    ],
    "condition": [
      "대소비교"
    ]
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 3

### 발문

다음 중 일차부등식이 아닌 것은?

### 선지

① \$x(x \- 3\) \\le 2x\$ ② \$3x \- 5 \< 2x\$ ③ \$4(x \- 1\) \\ge x \+ 5\$ ④ \$2x \+ 7 \> \-x \+ 1\$ ⑤ \$x \- 3(x \+ 2\) \< 4\$

### 정답

①

### 해설

부등식의 모든 항을 좌변으로 이항하여 정리했을 때 \$\$ ax \+ b \< 0,\\ ax \+ b \\le 0,\\ ax \+ b \> 0,\\ ax \+ b \\ge 0\\ (a \\ne 0,\\ a, b\\text{는 상수}) \$\$ 꼴로 나타나는 부등식을 일차부등식이라고 한다. 각 선지를 정리하면 다음과 같다. ① \$x(x \- 3\) \\le 2x \\implies x^2 \- 3x \- 2x \\le 0 \\implies x^2 \- 5x \\le 0\$ 좌변이 \$x\$에 대한 이차식이므로 일차부등식이 아니라 이차부등식이다. ② \$3x \- 5 \< 2x \\implies x \- 5 \< 0\$ (일차부등식) ③ \$4(x \- 1\) \\ge x \+ 5 \\implies 4x \- 4 \- x \- 5 \\ge 0 \\implies 3x \- 9 \\ge 0\$ (일차부등식) ④ \$2x \+ 7 \> \-x \+ 1 \\implies 3x \+ 6 \> 0\$ (일차부등식) ⑤ \$x \- 3(x \+ 2\) \< 4 \\implies x \- 3x \- 6 \- 4 \< 0 \\implies \-2x \- 10 \< 0\$ (일차부등식) 따라서 일차부등식이 아닌 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "부등식 정리 후 최고차항의 차수를 판별하여 일차부등식 여부를 결정하는 문항"
}
```

```
{
  "sourceQid": 16,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "LINEAR_INEQUALITY_IDENTIFICATION",
  "primaryMethod": "모든 항을 좌변으로 이항하여 최고차항이 일차항(계수≠0)인지 판정한다.",
  "decisiveStep": "x(x-3) ≤ 2x를 정리하면 x^2 - 5x ≤ 0으로 2차항이 소거되지 않아 이차부등식임을 확인한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "기본형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INEQUALITY_IDENTIFICATION",
    "templateKey": "TPL_LINEAR_INEQUALITY_CLASSIFICATION",
    "why": "식을 이항 정리하여 일차부등식의 정의를 만족하는지 판정하는 유형"
  },
  "crossConceptKeys": [
    "CC_INEQUALITY_IDENTIFICATION"
  ],
  "conditionKeys": [
    "COND_POLYNOMIAL_DEGREE_ONE"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "전개 후 이차항이 소거되지 않고 남는 식을 식별하는 기본 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "일차부등식"
    ],
    "method": [
      "이항",
      "동류항"
    ],
    "condition": [
      "차수"
    ]
  },
  "hold": ""
}
```

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

일차부등식 \$8x \- 17 \\le 5x \- 1\$의 해 중 자연수는 몇 개인가?

### 선지

① \$3\$개 ② \$4\$개 ③ \$5\$개 ④ \$6\$개 ⑤ \$7\$개

### 정답

③

### 해설

일차부등식의 \$x\$를 포함하는 항은 좌변으로, 상수항은 우변으로 이항하여 푼다. \$\$ 8x \- 5x \\le \-1 \+ 17 \$\$ 동류항을 정리하면 \$\$ 3x \\le 16 \$\$ 양변을 양수 \$3\$으로 나누면 부등호의 방향은 바뀌지 않으므로 \$\$ x \\le \\frac{16}{3} \$\$ \$\\frac{16}{3} \= 5.333\\cdots\$이므로, \$x \\le \\frac{16}{3}\$을 만족하는 자연수 \$x\$는 \$\$ 1, 2, 3, 4, 5 \$\$ 의 \$5\$개이다. 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "일차부등식을 풀고 수직선 또는 범위 내의 자연수 해 개수를 세는 문항"
}
```

```
{
  "sourceQid": 17,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "LINEAR_INEQUALITY_NATURAL_SOLUTIONS",
  "primaryMethod": "일차부등식을 이항과 나눗셈으로 푼 뒤 해의 범위를 만족하는 자연수의 개수를 센다.",
  "decisiveStep": "x ≤ 16/3을 구하고 16/3 = 5.333... 이하의 자연수가 1, 2, 3, 4, 5의 5개임을 도출한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "해의 조건",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INEQUALITY_NATURAL_ROOTS_COUNT",
    "templateKey": "TPL_LINEAR_INEQUALITY_NATURAL_COUNT",
    "why": "일차부등식의 해의 범위에 포함되는 자연수 해의 개수를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_INEQUALITIES"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 풀이 후 분수 경계값 16/3 이하의 자연수를 정확히 세는 전형 문제",
  "level": "중하",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "자연수",
      "해"
    ],
    "method": [
      "이항",
      "부등식의성질"
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
- 배점: 4

### 발문

수직선 위에 세 수 \$a, b, c\$가 \$a \< 0 \< b \< c\$의 위치에 나타나 있을 때, 다음 중 옳지 않은 것은?

### 선지

① \$ab \> ac\$ ② \$\\frac{a}{c} \< \\frac{b}{c}\$ ③ \$-a \> \-c\$ ④ \$a \- c \< b \- c\$ ⑤ \$\\frac{1}{b} \< \\frac{1}{c}\$

### 정답

⑤

### 해설

세 수의 부호와 대소 관계는 \$a \< 0\$이고 \$0 \< b \< c\$이다. 부등식의 성질을 이용하여 각 선지의 참, 거짓을 확인한다. ① \$b \< c\$의 양변에 음수 \$a\$를 곱하면 부등호의 방향이 반대로 바뀌므로 \$\$ ab \> ac\\text{ (참)} \$\$ ② \$a \< b\$의 양변을 양수 \$c\$로 나누면 부등호의 방향이 바뀌지 않으므로 \$\$ \\frac{a}{c} \< \\frac{b}{c}\\text{ (참)} \$\$ ③ \$a \< c\$의 양변에 음수 \$-1\$을 곱하면 부등호의 방향이 반대로 바뀌므로 \$\$ \-a \> \-c\\text{ (참)} \$\$ ④ \$a \< b\$의 양변에서 같은 수 \$c\$를 빼도 부등호의 방향은 바뀌지 않으므로 \$\$ a \- c \< b \- c\\text{ (참)} \$\$ ⑤ \$0 \< b \< c\$에서 양변을 양수 \$bc\$로 나누면 \$\$ \\frac{b}{bc} \< \\frac{c}{bc} \\implies \\frac{1}{c} \< \\frac{1}{b} \\implies \\frac{1}{b} \> \\frac{1}{c} \$\$ 따라서 \$\\frac{1}{b} \< \\frac{1}{c}\$는 옳지 않다. (거짓) 그러므로 옳지 않은 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "음수와 양수의 대소 관계 및 수직선 위치에 따른 부등식의 기본 성질 판정 문항"
}
```

```
{
  "sourceQid": 18,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_PROPERTIES_NUMBER_LINE",
  "primaryMethod": "부등식의 양변에 같은 수를 더하거나 뺄 때, 양수/음수를 곱하거나 나눌 때의 부등호 방향 성질을 적용한다.",
  "decisiveStep": "0 < b < c일 때 역수를 취하면 1/b > 1/c가 됨을 확인하여 ⑤가 거짓임을 판별한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "수직선으로 해 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE",
    "templateKey": "TPL_INEQUALITY_PROPERTIES_JUDGMENT",
    "why": "수직선 상의 수의 부호와 대소 관계에 따른 부등식의 성질 적용 판정 유형"
  },
  "crossConceptKeys": [
    "CC_DIRECTION_OF_INEQUALITY"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음수 곱셈 시 부등호 역전 및 양수 간 역수 대소 관계를 정확히 이해해야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "수직선",
      "부등식"
    ],
    "goal": [
      "대소비교"
    ],
    "method": [
      "부등식의성질"
    ],
    "condition": [
      "음수",
      "양수"
    ]
  },
  "hold": ""
}
```

## Q19

- 형식: 객관식  
- 배점: 5

### 발문

두 일차부등식 \$\\frac{x-1}{2} \- \\frac{x}{3} \\le a\$와 \$x \+ 4 \\le b\$의 해가 서로 같고, 그 해가 \$x \\le \-1\$일 때, 상수 \$a, b\$에 대하여 \$ab\$의 값은?

### 선지

① \$-3\$ ② \$-2\$ ③ \$-\\frac{3}{2}\$ ④ \$-\\frac{1}{2}\$ ⑤ \$1\$

### 정답

②

### 해설

첫 번째 일차부등식의 양변에 분모의 최소공배수 \$6\$을 곱하면 \$\$ 3(x \- 1\) \- 2x \\le 6a \$\$ 괄호를 풀고 좌변을 정리하면 \$\$ 3x \- 3 \- 2x \\le 6a \\implies x \- 3 \\le 6a \$\$ \$-3\$을 우변으로 이항하면 \$\$ x \\le 6a \+ 3 \$\$ 이 부등식의 해가 \$x \\le \-1\$과 같으므로 \$\$ 6a \+ 3 \= \-1 \\implies 6a \= \-4 \\implies a \= \-\\frac{2}{3} \$\$ 두 번째 일차부등식 \$x \+ 4 \\le b\$에서 \$4\$를 우변으로 이항하면 \$\$ x \\le b \- 4 \$\$ 이 부등식의 해 역시 \$x \\le \-1\$과 같으므로 \$\$ b \- 4 \= \-1 \\implies b \= 3 \$\$ 따라서 상수 \$a\$와 \$b\$의 곱 \$ab\$의 값은 \$\$ ab \= \\left(-\\frac{2}{3}\\right) \\times 3 \= \-2 \$\$ 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "해가 주어진 두 일차부등식에서 각각의 미정계수를 구하여 곱을 계산하는 문항"
}
```

```
{
  "sourceQid": 19,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "SAME_SOLUTION_INEQUALITIES",
  "primaryMethod": "각 부등식을 풀어 해의 형태를 만든 뒤 주어진 해 x ≤ -1과 계수를 비교하여 a와 b를 구한다.",
  "decisiveStep": "6a+3=-1에서 a=-2/3를 구하고 b-4=-1에서 b=3을 구해 ab=-2를 도출한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "해의 조건",
    "l4": "계수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITIES_SAME_SOLUTION",
    "templateKey": "TPL_COEFFICIENT_DETERMINATION_FROM_SOLUTION",
    "why": "공통인 해로부터 두 일차부등식의 미정계수를 각각 결정하는 유형"
  },
  "crossConceptKeys": [
    "CC_COEFFICIENT_DETERMINATION"
  ],
  "conditionKeys": [
    "COND_RATIONAL_COEFFICIENTS"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수 계수 부등식 정리와 미정계수 비교 연립을 요구하는 전형적 중간고사 빈출 문항",
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
      "이항",
      "연산"
    ],
    "condition": [
      "등식"
    ]
  },
  "hold": ""
}
```

## Q20

- 형식: 객관식  
- 배점: 4

### 발문

일의 자리 숫자가 십의 자리 숫자 \$x\$보다 \$3\$만큼 큰 두 자리 자연수 \$A\$가 있다. \$A\$의 십의 자리 숫자와 일의 자리 숫자를 맞바꾼 수가 \$A\$의 \$2\$배보다 작다고 할 때, 자연수 \$x\$에 대한 부등식으로 옳은 것은?

### 선지

① \$10x \+ (x+3) \< 2{10(x+3) \+ x}\$ ② \$10(x-3) \+ x \< 2{10x \+ (x-3)}\$ ③ \$10(x+3) \+ x \> 2{10x \+ (x+3)}\$ ④ \$10(x+3) \+ x \< 2{10x \+ (x+3)}\$ ⑤ \$2{10(x+3) \+ x} \< 10x \+ (x+3)\$

### 정답

④

### 해설

두 자리 자연수 \$A\$의 십의 자리 숫자가 \$x\$이고, 일의 자리 숫자는 \$x\$보다 \$3\$만큼 크므로 일의 자리 숫자는 \$\$ x \+ 3 \$\$ 따라서 처음 두 자리 자연수 \$A\$의 값은 \$\$ A \= 10 \\times x \+ (x \+ 3\) \= 10x \+ (x \+ 3\) \$\$ 십의 자리 숫자와 일의 자리 숫자를 맞바꾼 수는 십의 자리 숫자가 \$(x \+ 3)\$이고 일의 자리 숫자가 \$x\$이므로 \$\$ \\text{(맞바꾼 수)} \= 10(x \+ 3\) \+ x \$\$ 문제에서 맞바꾼 수가 처음 수 \$A\$의 \$2\$배보다 작다고 하였으므로 \$\$ \\text{(맞바꾼 수)} \< 2 \\times A \$\$ 이 관계를 \$x\$에 대한 식으로 나타내면 \$\$ 10(x \+ 3\) \+ x \< 2{10x \+ (x \+ 3)} \$\$ 따라서 옳은 부등식은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "자릿수 관계와 자리 교환 조건을 일차부등식으로 모델링하는 문항"
}
```

```
{
  "sourceQid": 20,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "DIGIT_SWAP_INEQUALITY",
  "primaryMethod": "자릿값 원리를 이용하여 처음 수와 자리를 바꾼 수를 식으로 표현하고 대소 관계 부등식을 세운다.",
  "decisiveStep": "맞바꾼 수 10(x+3)+x가 처음 수의 2배인 2{10x+(x+3)}보다 작다는 부등식을 구성한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식의 활용",
    "l3": "수량 관계",
    "l4": "이상·이하 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_WORD_DIGITS",
    "templateKey": "TPL_INEQUALITY_DIGIT_SWAP_RELATION",
    "why": "두 자리 수의 자릿수 관계를 부등식으로 세우는 활용 유형"
  },
  "crossConceptKeys": [
    "CC_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "십의 자리와 일의 자리 위치 값 모델링 및 '작다'의 부등호 방향을 정확히 구현",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수",
      "자릿수"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "식의값"
    ],
    "condition": [
      "미지수"
    ]
  },
  "hold": ""
}
```

## Q21

- 형식: 서술형  
- 배점: 7

### 발문

\[서술형 1\]  
\$n\$이 자연수일 때, 분수 \$\\frac{n}{180}\$에 대하여 다음 물음에 답하시오. \[7점\]

(1) \$\\frac{n}{180}\$이 유한소수가 되도록 하는 가장 작은 자연수 \$n\$의 값을 구하고, 풀이과정을 자세히 서술하시오. \[3점\]

(2) \$\\frac{n}{180}\$이 순환소수가 되도록 하는 \$180\$ 이하인 자연수 \$n\$의 개수를 구하고, 풀이과정을 자세히 서술하시오. \[4점\]

### 정답

(1) \$9\$ (2) \$160\$개

### 해설

(1) 분모 \$180\$을 소인수분해하면 \$\$ 180 \= 2^2 \\times 3^2 \\times 5 \$\$ 분수 \$\\frac{n}{180} \= \\frac{n}{2^2 \\times 3^2 \\times 5}\$이 유한소수가 되려면 기약분수로 나타내었을 때 분모의 소인수가 \$2\$ 또는 \$5\$뿐이어야 하므로, 분자 \$n\$은 분모의 소인수 \$3^2=9\$를 약분하여 없앨 수 있어야 한다. 따라서 \$n\$은 \$9\$의 배수이어야 한다. 그러므로 구하는 가장 작은 자연수 \$n\$의 값은 \$9\$이다. \[3점\]

(2) \$180\$ 이하의 자연수 \$n\$의 전체 개수는 \$180\$개이다. \$\\frac{n}{180}\$이 유한소수가 되는 경우는 (1)에 의해 \$n\$이 \$9\$의 배수인 경우이다. \$180\$ 이하의 자연수 중 \$9\$의 배수의 개수는 \$\$ 180 \\div 9 \= 20\\text{ (개)} \$\$ \$180\$ 이하의 자연수 \$n\$에 대하여 \$\\frac{n}{180}\$은 유한소수이거나 순환소수이므로, 순환소수가 되는 \$n\$의 개수는 전체 개수에서 유한소수가 되는 개수를 뺀 것과 같다. \$\$ 180 \- 20 \= 160\\text{ (개)} \$\$ 따라서 구하는 자연수 \$n\$의 개수는 \$160\$개이다. \[4점\]

```
{
  "status": "EXEMPT",
  "reason": "소인수분해를 이용한 유한소수 조건 및 여사건 성질을 이용한 순환소수 개수 서술형 문항"
}
```

```
{
  "sourceQid": 21,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FINITE_VS_REPEATING_DECIMAL_ESSAY",
  "primaryMethod": "분모 180을 소인수분해하여 유한소수 조건을 찾고 전체 개수에서 유한소수 개수를 차감한다.",
  "decisiveStep": "180=2^2·3^2·5에서 n이 9의 배수임을 도출하고 180-20=160개를 정확히 계산한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "분모의 소인수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_ESSAY_FINITE_REPEATING_DECIMAL",
    "templateKey": "TPL_ESSAY_FINITE_DECIMAL_COUNTING",
    "why": "유한소수가 되기 위한 소인수 조건과 순환소수의 개수를 논리적으로 서술하는 유형"
  },
  "crossConceptKeys": [
    "CC_NUMBER_OF_ELEMENTS"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "유한소수 판별 조건(소인수 2, 5)과 여사건 논리를 단계별로 완전하게 기술해야 하는 서술형",
  "level": "중",
  "item4slot": {
    "given": [
      "분수",
      "자연수"
    ],
    "goal": [
      "유한소수",
      "순환소수"
    ],
    "method": [
      "소인수분해",
      "배수"
    ],
    "condition": [
      "약분"
    ]
  },
  "hold": ""
}
```

## Q22

- 형식: 서술형  
- 배점: 7

### 발문

\[서술형 2\]  
다음과 같은 원뿔 모양의 종이컵 (가)와 원기둥 모양의 텀블러 (나)가 있다. 다음 물음에 답하시오. \[7점\]  
\- 종이컵 (가): 밑면의 반지름의 길이가 \$6\\rm,cm\$, 높이가 \$12\\rm,cm\$인 원뿔 모양  
\- 텀블러 (나): 밑면의 반지름의 길이가 \$4\\rm,cm\$인 원기둥 모양

(1) 원뿔 모양의 종이컵 (가)의 부피를 구하고, 풀이과정을 자세히 서술하시오. \[3점\]

(2) 종이컵 (가)에 물을 가득 채운 후 텀블러 (나)에 남김없이 부었을 때, 텀블러 (나)에 채워진 물의 높이를 구하고, 풀이과정을 자세히 서술하시오. \[4점\]

(단, 종이컵과 텀블러의 두께는 생각하지 않는다.)

### 정답

(1) \$144\\pi\\rm,cm^3\$ (2) \$9\\rm,cm\$

### 해설

(1) 원뿔의 부피는 \$\\frac{1}{3} \\times (\\text{밑넓이}) \\times (\\text{높이})\$이다. 종이컵 (가)의 밑면의 반지름이 \$6\\rm,cm\$이므로 밑넓이는 \$\$ \\pi \\times 6^2 \= 36\\pi\\rm,cm^2 \$\$ 높이가 \$12\\rm,cm\$이므로 종이컵 (가)의 부피 \$V\$는 \$\$ V \= \\frac{1}{3} \\times 36\\pi \\times 12 \= 144\\pi\\rm,cm^3 \$\$ 따라서 종이컵 (가)의 부피는 \$144\\pi\\rm,cm^3\$이다. \[3점\]

(2) 텀블러 (나)에 채워진 물의 높이를 \$h\\rm,cm\$라 하자. 텀블러 (나)는 밑면의 반지름의 길이가 \$4\\rm,cm\$인 원기둥 모양이므로 밑넓이는 \$\$ \\pi \\times 4^2 \= 16\\pi\\rm,cm^2 \$\$ 텀블러에 채워진 물의 부피는 \$(\\text{밑넓이}) \\times (\\text{물의 높이})\$이므로 \$\$ 16\\pi \\times h\\rm,cm^3 \$\$ 이 물의 부피는 종이컵 (가)에 가득 찬 물의 부피 \$144\\pi\\rm,cm^3\$와 같으므로 다음과 같은 방정식을 세울 수 있다. \$\$ 16\\pi h \= 144\\pi \$\$ 양변을 \$16\\pi\$로 나누어 \$h\$를 구하면 \$\$ h \= \\frac{144\\pi}{16\\pi} \= 9 \$\$ 따라서 텀블러 (나)에 채워진 물의 높이는 \$9\\rm,cm\$이다. \[4점\]

```
{
  "status": "EXEMPT",
  "reason": "원뿔의 부피 공식과 원기둥의 부피 등식을 이용한 높이 계산 실생활 연계 서술형 문항"
}
```

```
{
  "sourceQid": 22,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "SOLID_VOLUME_EQUALITY",
  "primaryMethod": "원뿔 부피 공식으로 수량을 구한 뒤 원기둥 부피 공식과 일차방정식으로 물의 높이를 구한다.",
  "decisiveStep": "1/3·π·6^2·12=144π cm^3을 계산하고 16π·h=144π로부터 h=9 cm를 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "혼합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_ESSAY_GEOMETRIC_VOLUME",
    "templateKey": "TPL_ESSAY_CONE_CYLINDER_VOLUME_EQUATION",
    "why": "원뿔과 원기둥의 부피 보존 관계를 방정식으로 모델링하는 서술형 유형"
  },
  "crossConceptKeys": [
    "CC_CONE_VOLUME",
    "CC_CYLINDER_VOLUME"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원뿔 부피 공식 1/3 누락 없이 계산하고 원기둥 밑넓이와의 비로 높이를 정확히 서술해야 함",
  "level": "중",
  "item4slot": {
    "given": [
      "원뿔",
      "원기둥",
      "반지름"
    ],
    "goal": [
      "부피",
      "높이"
    ],
    "method": [
      "방정식"
    ],
    "condition": [
      "넓이"
    ]
  },
  "hold": ""
}
```

## Q23

- 형식: 서술형  
- 배점: 6

### 발문

\[서술형 3\]

동네 문구점에서 한 자루에 \$1200\$원에 판매하는 볼펜을 대형 할인점에서는 \$5\$자루를 한 묶음으로 \$4200\$원에 판매한다. 대형 할인점을 다녀오는데 왕복 버스비가 총 \$3000\$원 들 때, 볼펜을 최소 몇 묶음 이상 사야 대형 할인점에서 사는 것이 더 저렴한지 구하고, 풀이과정을 자세히 서술하시오. \[6점\]

### 정답

\$2\$묶음 (또는 \$2\$)

### 해설

볼펜을 \$x\$묶음 (\$x\$는 자연수) 산다고 하자. \$1\$묶음에 \$5\$자루가 들어 있으므로, 총 구매하는 볼펜의 수는 \$5x\$자루이다.

1) 동네 문구점에서 볼펜 \$5x\$자루를 살 때 드는 비용은 \$\$ 1200 \\times 5x \= 6000x\\text{ (원)} \$\$ 이다.  
     
2) 대형 할인점에서 볼펜 \$x\$묶음을 살 때 드는 총 비용은 볼펜 가격에 왕복 버스비를 더해야 하므로 \$\$ 4200x \+ 3000\\text{ (원)} \$\$ 이다.

대형 할인점에서 사는 것이 더 저렴하려면 대형 할인점의 총비용이 동네 문구점의 총비용보다 작아야 하므로 \$\$ 4200x \+ 3000 \< 6000x \$\$ \$4200x\$를 우변으로 이항하면 \$\$ 3000 \< 6000x \- 4200x \\implies 1800x \> 3000 \$\$ 양변을 \$1800\$으로 나누면 \$\$ x \> \\frac{3000}{1800} \= \\frac{5}{3} \= 1.666\\cdots \$\$ \$x\$는 자연수이므로 \$x\$의 최솟값은 \$2\$이다. 따라서 볼펜을 최소 \$2\$묶음 이상 사야 대형 할인점에서 사는 것이 더 저렴하다. \[6점\]

```
{
  "status": "EXEMPT",
  "reason": "단가 비교와 교통비를 포함한 실생활 비용 비교 일차부등식 활용 서술형 문항"
}
```

```
{
  "sourceQid": 23,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "COST_COMPARISON_INEQUALITY",
  "primaryMethod": "묶음 수 x에 대한 동네 문구점 비용과 대형 할인점(교통비 포함) 비용의 일차부등식을 세워 최소 자연수 해를 구한다.",
  "decisiveStep": "4200x + 3000 < 6000x로부터 x > 5/3를 풀고 최소 자연수 2를 도출한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식의 활용",
    "l3": "비율·가격·도형",
    "l4": "할인·이익"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_WORD_SHOPPING_COST",
    "templateKey": "TPL_COST_COMPARISON_INEQUALITY",
    "why": "교통비와 묶음 가격 조건을 반영하여 어느 쪽이 유리한지 판단하는 일차부등식 활용 유형"
  },
  "crossConceptKeys": [
    "CC_UNIT_PRICE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미지수 설정, 비용식 수립, 부등식 풀이 및 조건에 맞는 최소 자연수 해 해석을 모두 서술",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수",
      "부등식"
    ],
    "goal": [
      "일차부등식"
    ],
    "method": [
      "이항"
    ],
    "condition": [
      "대소비교"
    ]
  },
  "hold": ""
}
```

