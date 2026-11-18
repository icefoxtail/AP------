

```
{
  "stem": "26_왕운중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/26_왕운중_1학기_중간_중2_기출.js",
  "examFolder": "1mid",
  "grade": "중2",
  "curriculum": "2022",
  "questionCount": 24,
  "totalScore": 100,
  "generatedAt": "2026-11-12"
}
```

## Q01

- 형식: 객관식  
- 배점: 3

### 발문

순환소수 \$0.\\overline{47}\$을 기약분수로 나타낸 것은? \[3점\]

### 선지

① \$\\dfrac{47}{99}\$ ② \$\\dfrac{47}{90}\$ ③ \$\\dfrac{47}{100}\$ ④ \$\\dfrac{474}{999}\$ ⑤ \$\\dfrac{23}{50}\$

### 정답

①

### 해설

순환소수 \$0.\\overline{47}\$을 \$x\$라 하면 \$\$ x \= 0.474747\\cdots \$\$ 순환마디가 소수점 아래 두 자리이므로 양변에 \$100\$을 곱하면 \$\$ 100x \= 47.474747\\cdots \$\$ 두 식을 변끼리 빼면 \$\$ 100x \- x \= 47.474747\\cdots \- 0.474747\\cdots \$\$ \$\$ 99x \= 47 \$\$ \$\$ x \= \\frac{47}{99} \$\$ \$47\$과 \$99\$는 공약수가 \$1\$뿐인 서로소이므로 이미 기약분수이다. 그러므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수를 10의 거듭제곱을 이용하여 기약분수로 변환하는 기본 계산 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_FRACTION_CONVERSION",
  "primaryMethod": "100x - x = 47을 세워 순환소수 0.(47)을 기약분수 47/99로 변환한다.",
  "decisiveStep": "99x = 47로부터 x = 47/99 산출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_TO_FRACTION",
    "templateKey": "TPL_REPEATING_DECIMAL_CONVERSION_ALGEBRAIC",
    "why": "순환소수를 10의 거듭제곱 방정식으로 기약분수화하는 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환마디 길이에 맞춰 100을 곱해 기약분수를 도출하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "기약분수"
    ],
    "method": [
      "사칙연산",
      "약분"
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

다음 분수를 소수로 나타낼 때, 순환소수로만 나타낼 수 있는 것의 개수는? \[3점\]

\$\\dfrac{3}{11}\$, \$\\quad \\dfrac{21}{2 \\times 3 \\times 5 \\times 7}\$, \$\\quad \-\\dfrac{2}{17}\$, \$\\quad \\dfrac{15}{75}\$, \$\\quad \-\\dfrac{14}{2 \\times 3 \\times 7}\$

### 선지

① 1개 ② 2개 ③ 3개 ④ 4개 ⑤ 5개

### 정답

③

### 해설

분수를 기약분수로 나타내었을 때 분모의 소인수가 \$2\$ 또는 \$5\$뿐이면 유한소수이고, \$2\$와 \$5\$ 이외의 소인수가 있으면 순환소수가 된다. 각 분수를 기약분수로 나타내어 분모의 소인수를 확인한다.

1. \$\\frac{3}{11}\$ : 기약분수이며 분모의 소인수가 \$11\$이므로 순환소수이다.  
2. \$\\frac{21}{2 \\times 3 \\times 5 \\times 7} \= \\frac{21}{21 \\times 2 \\times 5} \= \\frac{1}{2 \\times 5} \= \\frac{1}{10}\$ : 분모 소인수가 \$2, 5\$뿐이므로 유한소수이다.  
3. \$-\\frac{2}{17}\$ : 기약분수이며 분모의 소인수가 \$17\$이므로 순환소수이다.  
4. \$\\frac{15}{75} \= \\frac{1}{5}\$ : 분모 소인수가 \$5\$뿐이므로 유한소수이다.  
5. \$-\\frac{14}{2 \\times 3 \\times 7} \= \-\\frac{14}{14 \\times 3} \= \-\\frac{1}{3}\$ : 기약분수의 분모 소인수가 \$3\$이므로 순환소수이다. 따라서 순환소수로만 나타낼 수 있는 것은 \$\\frac{3}{11}\$, \$-\\frac{2}{17}\$, \$-\\frac{14}{2 \\times 3 \\times 7}\$로 총 \$3\$개이다. 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "기약분수화 및 분모 소인수 판별을 통해 순환소수 개수를 세는 문항"
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
  "conceptClusterKey": "FINITE_VS_REPEATING_DECIMAL_IDENTIFICATION",
  "primaryMethod": "각 분수를 기약분수로 약분한 뒤 분모 소인수에 2, 5 이외의 소인수가 남는 순환소수를 계수한다.",
  "decisiveStep": "3/11, -2/17, -1/3의 3개가 순환소수임을 판별",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_COUNTING",
    "templateKey": "TPL_PRIME_FACTOR_COUNT_REPEATING",
    "why": "기약분수의 분모 소인수 조건으로 순환소수 개수를 찾는 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "약분과 소인수분해를 통해 5개 분수의 유한/순환 여부를 직접 확인하는 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "분수",
      "기약분수"
    ],
    "goal": [
      "순환소수"
    ],
    "method": [
      "약분",
      "소인수분해"
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
- 배점: 4

### 발문

다음 \<보기\> 중 옳은 것만을 있는 대로 고른 것은? \[4점\]

ㄱ. 모든 무한소수는 유리수이다.

ㄴ. 모든 순환소수는 분수로 나타낼 수 있으므로 유리수이다.

ㄷ. \$\\pi\$는 순환소수이다.

ㄹ. \$\\dfrac{49}{80}\$은 유한소수로 나타낼 수 있다.

ㅁ. 유한소수 중에는 유리수가 아닌 것도 있다.

### 선지

① ㄱ, ㄴ ② ㄴ, ㄹ ③ ㄴ, ㄷ ④ ㄷ, ㄹ ⑤ ㄴ, ㄹ, ㅁ

### 정답

②

### 해설

\<보기\>의 각 진술의 참, 거짓을 확인한다. ㄱ. 무한소수 중 순환하지 않는 무한소수(무리수)는 유리수가 아니므로 모든 무한소수가 유리수인 것은 아니다. (거짓) ㄴ. 모든 순환소수는 분수 \$\\frac{a}{b}\$ (\$a, b\$는 정수, \$b \\ne 0\$) 꼴로 나타낼 수 있으므로 유리수이다. (참) ㄷ. \$\\pi \= 3.141592\\cdots\$는 순환하지 않는 무한소수이다. (거짓) ㄹ. \$\\frac{49}{80}\$의 분모 \$80\$을 소인수분해하면 \$80 \= 2^4 \\times 5\$이다. 기약분수의 분모의 소인수가 \$2\$와 \$5\$뿐이므로 유한소수로 나타낼 수 있다. (참) ㅁ. 모든 유한소수는 분모가 \$10\$의 거듭제곱인 분수로 나타낼 수 있으므로 유리수이다. 유리수가 아닌 유한소수는 없다. (거짓) 따라서 옳은 것은 ㄴ, ㄹ이다. 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "유리수와 순환소수, 무한소수의 수 체계 개념 진위를 판별하는 문항"
}
```

```
{
  "sourceQid": 3,
  "variationType": "STRUCTURAL",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "RATIONAL_AND_DECIMAL_CONCEPTS_AUDIT",
  "primaryMethod": "유한소수, 순환소수, 무리수의 개념적 정의를 대조하여 참인 보기를 선별한다.",
  "decisiveStep": "ㄴ(순환소수의 유리수성)과 ㄹ(49/80의 유한소수성)의 참 판정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "유리수와 소수 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RATIONAL_DECIMAL_TRUE_FALSE",
    "templateKey": "TPL_RATIONAL_DECIMAL_PROPERTIES",
    "why": "소수 체계의 분류와 유리수 개념 판별 템플릿"
  },
  "crossConceptKeys": [
    "CC_CLASSIFICATION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수 체계 정의와 기약분수 소인수 조건을 종합 대조하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "유리수",
      "순환소수"
    ],
    "goal": [
      "유한소수"
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

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

두 분수 \$\\dfrac{3}{70}\$, \$\\dfrac{2}{5}\$ 사이에 있는 분모가 \$70\$인 분수 중에서 유한소수로 나타낼 수 있는 분수는 모두 몇 개인가? (단, 분자는 자연수이다.) \[4점\]

### 선지

① 1개 ② 2개 ③ 4개 ④ 3개 ⑤ 5개

### 정답

④

### 해설

두 분수를 분모가 \$70\$인 분수로 통분하여 크기를 비교한다. \$\$ \\frac{3}{70} \< \\frac{n}{70} \< \\frac{2}{5} \$\$ \$\$ \\frac{2}{5} \= \\frac{2 \\times 14}{5 \\times 14} \= \\frac{28}{70} \$\$ 따라서 구하는 분수의 분자 \$n\$의 범위는 \$\$ 3 \< n \< 28 \\implies n \\in {4, 5, 6, \\dots, 27} \$\$ 분수 \$\\frac{n}{70}\$의 분모를 소인수분해하면 \$\$ 70 \= 2 \\times 5 \\times 7 \$\$ \$\\frac{n}{70}\$이 유한소수로 나타내어지려면 분모의 소인수 \$7\$이 분자 \$n\$과 약분되어 없어져야 한다. 따라서 \$n\$은 \$7\$의 배수이어야 한다. \$4 \\le n \\le 27\$ 범위에 속하는 \$7\$의 배수는 \$\$ 7, 14, 21 \$\$ 로 총 \$3\$개이다. 따라서 유한소수로 나타낼 수 있는 분수의 개수는 \$3\$개이다. 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "두 분수 사이의 범위에서 분모의 소인수 약분 조건을 만족하는 배수 개수 도출 문항"
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
  "conceptClusterKey": "FINITE_DECIMAL_RANGE_COUNT",
  "primaryMethod": "3/70 < n/70 < 28/70 범위에서 70=2·5·7의 7을 약분하는 7의 배수 n=7,14,21을 계수한다.",
  "decisiveStep": "4 <= n <= 27 범위 내 7의 배수 개수 3개 산출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_RANGE_COUNT",
    "templateKey": "TPL_FINITE_DECIMAL_INTERVAL_MULTIPLES",
    "why": "구간 내에서 유한소수가 되는 배수 조건을 만족하는 분수 개수 구하기"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "통분하여 분자 범위를 설정하고 소인수 7의 약분 배수를 세는 전형 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "분수",
      "자연수"
    ],
    "goal": [
      "유한소수"
    ],
    "method": [
      "약분",
      "대소비교"
    ],
    "condition": [
      "소인수"
    ]
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 5

### 발문

분수 \$\\dfrac{8}{27}\$을 소수로 나타낼 때, 순환마디를 이루는 숫자의 개수를 \$a\$개, 소수점 아래 \$2026\$번째 자리의 숫자를 \$b\$라고 하자. \$\\dfrac{b^a+b^a+b^a}{a}\$의 값은? \[5점\]

### 선지

① 2 ② 4 ③ 6 ④ 7 ⑤ 8

### 정답

⑤

### 해설

분자 \$8\$을 분모 \$27\$로 나누어 순환소수를 구한다. \$\$ 8 \\div 27 \= 0.296296\\cdots \= 0.\\overline{296} \$\$ 1단계: 순환마디는 \$296\$이므로 순환마디를 이루는 숫자의 개수는 \$\$ a \= 3 \$\$ 2단계: 소수점 아래 \$2026\$번째 자리의 숫자를 구한다. 순환마디의 길이가 \$3\$이므로 \$2026\$을 \$3\$으로 나눈 몫과 나머지를 계산하면 \$\$ 2026 \= 3 \\times 675 \+ 1 \$\$ 나머지가 \$1\$이므로 소수점 아래 \$2026\$번째 자리의 숫자는 순환마디의 첫 번째 숫자인 \$2\$이다. \$\$ b \= 2 \$\$ 3단계: 구하는 식의 값을 계산한다. \$\$ \\frac{b^a \+ b^a \+ b^a}{a} \= \\frac{2^3 \+ 2^3 \+ 2^3}{3} \= \\frac{8 \+ 8 \+ 8}{3} \= \\frac{24}{3} \= 8 \$\$ 그러므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "순환마디 주기성과 거듭제곱 식의 값을 연계 계산하는 문항"
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
  "conceptClusterKey": "REPEATING_PERIOD_AND_POWER_EVALUATION",
  "primaryMethod": "8/27 = 0.(296)에서 a=3, 2026 = 3*675+1에서 b=2를 구한 뒤 (2^3+2^3+2^3)/3=8을 계산한다.",
  "decisiveStep": "주기 나머지 1로부터 b=2 도출 후 (8+8+8)/3=8 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_DIGIT",
    "templateKey": "TPL_REPEATING_PERIODIC_DIGIT_AND_EXPRESSION",
    "why": "순환마디 자릿수 추적과 거듭제곱 대수식의 값을 결합한 유형"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_CALCULATION",
    "CC_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직접 나눗셈으로 순환마디를 구하고 주기성과 거듭제곱 합 계산을 순차 수행하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "분수",
      "자연수"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "사칙연산",
      "거듭제곱"
    ],
    "condition": [
      "자릿수"
    ]
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

다음 보기는 세 학생이 어느 날의 날짜 \$a\$월 \$b\$일을 분수 \$\\dfrac{a}{b}\$로 나타내는 활동을 하고 이에 대한 내용을 나눈 대화이다. 옳은 설명을 한 학생을 모두 고른 것은? (단, \$1\$보다 작은 분수로 나타낼 수 있는 날짜만 생각한다.) \[4점\]

민준: 5월 20일은 분수를 소수로 나타내면 유한소수야.

서아: \$b=16\$일 때, 분수가 순환소수가 되는 \$a\$는 존재하지 않아.

하은: 2월은 분수가 순환소수가 되는 날의 개수가 20개야.

### 선지

① 민준 ② 민준, 서아 ③ 서아, 하은 ④ 민준, 하은 ⑤ 민준, 서아, 하은

### 정답

②

### 해설

\$1\$보다 작은 분수로 나타내므로 \$a \< b\$이다. 세 학생의 설명을 각각 검토한다.

1. 민준: 5월 20일은 \$a \= 5, b \= 20\$이므로 \$\$ \\frac{5}{20} \= \\frac{1}{4} \= \\frac{1}{2^2} \$\$ 기약분수의 분모 소인수가 \$2\$뿐이므로 유한소수이다. (참)  
2. 서아: \$b \= 16\$일 때 \$a \< 16\$인 자연수 \$a\$에 대하여 \$\$ \\frac{a}{16} \= \\frac{a}{2^4} \$\$ 분모 \$16\$의 소인수는 \$2\$뿐이므로 분자 \$a\$의 값에 관계없이 기약분수로 나타내어도 분모의 소인수는 \$2\$뿐이다. 따라서 모든 \$a\$에 대하여 항상 유한소수가 되며, 순환소수가 되는 \$a\$는 존재하지 않는다. (참)  
3. 하은: 2월은 \$a \= 2\$이다. 2월의 날짜는 \$1\$일부터 \$28\$일까지이므로 \$a \< b\$를 만족하는 \$b\$는 \$3\$부터 \$28\$까지 총 \$26\$개이다. \$\\frac{2}{b}\$가 유한소수가 되는 경우를 찾으면, 약분 후 기약분수의 분모의 소인수가 \$2, 5\$뿐이어야 한다.  
- \$b\$가 홀수일 때: 분자 \$2\$와 약분되지 않으므로 \$b\$ 자체가 \$5\$의 거듭제곱이어야 한다. \$b \= 5, 25\$ (\$2\$개)  
- \$b\$가 짝수일 때: \$b \= 2k\$라 하면 \$\\frac{2}{2k} \= \\frac{1}{k}\$이므로 \$k\$의 소인수가 \$2, 5\$뿐이어야 한다 (\$2 \\le k \\le 14\$). \$k \\in {2, 4, 5, 8, 10} \\implies b \\in {4, 8, 10, 16, 20}\$ (\$5\$개) 따라서 유한소수가 되는 날은 총 \$2 \+ 5 \= 7\$개이다. 순환소수가 되는 날의 개수는 전체 \$26\$개에서 유한소수 \$7\$개를 제외한 \$\$ 26 \- 7 \= 19\\text{ (개)} \$\$ 이므로 \$20\$개라고 한 하은의 설명은 옳지 않다. (거짓) 따라서 옳은 설명을 한 학생은 민준, 서아이다. 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "실생활 소재 날짜 분수의 기약분수 소인수 성질을 대화문 형태로 판정하는 문항"
}
```

```
{
  "sourceQid": 6,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FINITE_DECIMAL_CONTEXTUAL_ANALYSIS",
  "primaryMethod": "민준(5/20=1/4), 서아(b=16에서 2^4 분모로 순환소수 불가), 하은(26-7=19개)의 참거짓을 분석한다.",
  "decisiveStep": "b=16의 분모 소인수 특성과 2월 순환소수 일수 19개 검증",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_APPLICATION",
    "templateKey": "TPL_CALENDAR_FRACTION_FINITE_ANALYSIS",
    "why": "날짜 분수 모델에서 유한소수와 순환소수의 조건을 진위 판별하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC",
    "CC_NUMBER_OF_ELEMENTS"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "실생활 날짜 분수의 조건을 수학적 기약분수 소인수 모델로 정밀 판정하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "분수",
      "자연수"
    ],
    "goal": [
      "유한소수"
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

## Q07

- 형식: 객관식  
- 배점: 3

### 발문

다음 중 순환소수를 분수로 나타낸 것으로 옳지 않은 것은? \[3점\]

### 선지

① \$0.\\dot{7} \= \\dfrac{7}{9}\$ ② \$0.\\overline{35} \= \\dfrac{35}{99}\$ ③ \$0.5\\dot{8} \= \\dfrac{53}{90}\$ ④ \$1.4\\overline{18} \= \\dfrac{78}{55}\$ ⑤ \$0.23\\dot{4} \= \\dfrac{211}{990}\$

### 정답

⑤

### 해설

순환소수를 분수로 고치는 공식을 적용하여 각 선지를 확인한다. ① \$0.\\dot{7} \= \\frac{7}{9}\$ (옳음) ② \$0.\\overline{35} \= \\frac{35}{99}\$ (옳음) ③ \$0.5\\dot{8} \= \\frac{58 \- 5}{90} \= \\frac{53}{90}\$ (옳음) ④ \$1.4\\overline{18} \= \\frac{1418 \- 14}{990} \= \\frac{1404}{990}\$ 분모와 분자를 \$18\$로 약분하면 \$\$ \\frac{1404 \\div 18}{990 \\div 18} \= \\frac{78}{55} \\quad (\\text{옳음}) \$\$ ⑤ \$0.23\\dot{4}\$의 분모는 순환마디 숫자가 \$1\$개이므로 \$9\$가 \$1\$개, 순환하지 않는 소수점 아래 숫자가 \$2\$개이므로 \$0\$이 \$2\$개여서 \$900\$이어야 한다. \$\$ 0.23\\dot{4} \= \\frac{234 \- 23}{900} \= \\frac{211}{900} \$\$ 선지의 \$\\frac{211}{990}\$은 분모가 잘못되었으므로 옳지 않다. 따라서 옳지 않은 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수의 분수 변환 공식 및 약분 결과를 검증하는 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_TO_FRACTION_FORMULA",
  "primaryMethod": "순환소수의 분수화 공식 분모 9와 0의 자릿수 규칙과 분자 감산 규칙을 대조한다.",
  "decisiveStep": "0.23(4)의 분모가 990이 아니라 900임을 확인하여 ⑤의 오류 식별",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_TO_FRACTION",
    "templateKey": "TPL_REPEATING_DECIMAL_CONVERSION_AUDIT",
    "why": "순환소수를 분수로 고치는 공식의 정확성을 평가하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공식 적용 시 분모 자릿수(900 vs 990) 오류를 선별하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "분수",
      "기약분수"
    ],
    "method": [
      "약분",
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
- 배점: 5

### 발문

두 유리수 \$\\dfrac{1}{3}\$과 \$\\dfrac{3}{7}\$을 각각 소수로 나타낼 때, 소수점 아래 \$n\$번째 자리의 숫자를 각각 \$a\_n\$, \$b\_n\$이라고 하자. \$a\_n \+ b\_n \= 7\$을 만족하는 \$20\$ 이하의 자연수 \$n\$의 개수는? \[5점\]

### 선지

① 4개 ② 3개 ③ 2개 ④ 5개 ⑤ 1개

### 정답

①

### 해설

두 분수를 소수로 나타내어 각 자릿수 숫자의 규칙을 찾는다.

1. \$\\frac{1}{3} \= 0.3333\\cdots \= 0.\\dot{3}\$ 소수점 아래 모든 자리의 숫자가 \$3\$이므로 모든 자연수 \$n\$에 대하여 \$\$ a\_n \= 3 \$\$  
2. \$\\frac{3}{7} \= 0.428571428571\\cdots \= 0.\\overline{428571}\$ 소수점 아래 첫째 자리부터 \$6\$개의 숫자 \$4, 2, 8, 5, 7, 1\$이 순환마디를 이루어 반복된다.  
3. \$a\_n \+ b\_n \= 7\$에서 \$a\_n \= 3\$을 대입하면 \$\$ 3 \+ b\_n \= 7 \\implies b\_n \= 4 \$\$ 즉, \$\\frac{3}{7}\$의 소수점 아래 \$n\$번째 자리의 숫자가 \$4\$이어야 한다. 순환마디 \$4, 2, 8, 5, 7, 1\$에서 숫자 \$4\$는 첫 번째 숫자이므로 \$n\$을 \$6\$으로 나눈 나머지가 \$1\$이어야 한다. \$\$ n \\equiv 1 \\pmod 6 \$\$ \$20\$ 이하의 자연수 중에서 이를 만족하는 \$n\$은 \$\$ n \= 1, 7, 13, 19 \$\$ 로 총 \$4\$개이다. 그러므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수의 자릿수 주기성과 연립 자릿수 조건 분석 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_DIGIT_PERIODICITY",
  "primaryMethod": "a_n=3이므로 b_n=4가 되는 주기 6의 나머지 1인 위치 n=1,7,13,19를 산출한다.",
  "decisiveStep": "b_n=4를 만족하는 n = 6k+1 형태의 20 이하 자연수 4개 카운트",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_DIGIT",
    "templateKey": "TPL_REPEATING_DECIMAL_PERIODIC_CONDITION",
    "why": "두 순환소수의 자릿수 합 조건을 만족하는 자연수 개수를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_PLACE_VALUE",
    "CC_NUMBER_OF_ELEMENTS"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자릿수 주기 분할과 나머지 합동 조건을 융합하여 개수를 세는 문항",
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
      "사칙연산"
    ],
    "condition": [
      "자릿수"
    ]
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 3

### 발문

다음 중 계산 결과가 옳지 않은 것은? \[3점\]

### 선지

① \$(-3a^3)^2 \= 9a^6\$ ② \$x^2 \\times x^4 \\times x \= x^7\$ ③ \$(a^2)^3 \\times a^4 \\div a^2 \= a^7\$ ④ \$\\left(-\\dfrac{1}{3}xy^2\\right)^3 \= \-\\dfrac{x^3y^6}{27}\$ ⑤ \$y^{12} \\div y^4 \= y^8\$

### 정답

③

### 해설

지수법칙을 적용하여 각 선지의 계산 결과를 확인한다. ① \$(-3a^3)^2 \= (-3)^2 \\times (a^3)^2 \= 9a^6\$ (옳음) ② \$x^2 \\times x^4 \\times x \= x^{2+4+1} \= x^7\$ (옳음) ③ 지수법칙에 의해 곱셈과 나눗셈을 순서대로 계산하면 \$\$ (a^2)^3 \\times a^4 \\div a^2 \= a^{2 \\times 3} \\times a^4 \\div a^2 \= a^6 \\times a^4 \\div a^2 \= a^{6+4-2} \= a^8 \$\$ 선지에는 \$a^7\$로 주어졌으므로 옳지 않다. ④ \$\\left(-\\frac{1}{3}xy^2\\right)^3 \= \\left(-\\frac{1}{3}\\right)^3 \\times x^3 \\times (y^2)^3 \= \-\\frac{1}{27}x^3y^6 \= \-\\frac{x^3y^6}{27}\$ (옳음) ⑤ \$y^{12} \\div y^4 \= y^{12-4} \= y^8\$ (옳음) 따라서 옳지 않은 것은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식의 거듭제곱, 지수 곱셈 및 나눗셈 기본 연산 규칙 판정 문항"
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
  "conceptClusterKey": "EXPONENT_LAWS_BASIC_OPERATIONS",
  "primaryMethod": "(a^2)^3 * a^4 / a^2 = a^(6+4-2) = a^8임을 확인하여 a^7로 잘못 표기된 선지를 찾는다.",
  "decisiveStep": "지수 연산 6 + 4 - 2 = 8 != 7 식별",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 곱·몫"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_LAWS_BASIC",
    "templateKey": "TPL_EXPONENT_LAWS_VERIFICATION",
    "why": "기본 지수법칙 적용의 정확성을 판별하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SIMPLIFICATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거듭제곱의 곱셈·나눗셈 지수 가감 규칙을 적용하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "단항식"
    ],
    "method": [
      "지수법칙"
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

\$2^3 \= A\$라고 할 때, \$16^6\$을 \$A\$를 사용하여 나타내면? \[4점\]

### 선지

① \$A^4\$ ② \$A^6\$ ③ \$2A^8\$ ④ \$A^8\$ ⑤ \$A^{12}\$

### 정답

④

### 해설

밑 \$16\$을 \$2\$의 거듭제곱으로 나타내면 \$16 \= 2^4\$이다. 이를 주어진 식에 대입하면 \$\$ 16^6 \= (2^4)^6 \= 2^{4 \\times 6} \= 2^{24} \$\$ \$2^{24}\$를 \$2^3\$의 거듭제곱 형태로 변형하면 \$\$ 2^{24} \= 2^{3 \\times 8} \= (2^3)^8 \$\$ \$2^3 \= A\$이므로 \$\$ (2^3)^8 \= A^8 \$\$ 따라서 \$16^6\$을 \$A\$를 사용하여 나타내면 \$A^8\$이다. 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "거듭제곱의 밑을 통일하고 기준 문자로 치환하는 지수법칙 문항"
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
  "conceptClusterKey": "POWER_BASE_TRANSFORMATION_SUBSTITUTION",
  "primaryMethod": "16^6 = (2^4)^6 = 2^24 = (2^3)^8 = A^8로 치환한다.",
  "decisiveStep": "2^24 = (2^3)^8 = A^8 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_SUBSTITUTION",
    "templateKey": "TPL_EXPONENT_POWER_REPLACE",
    "why": "거듭제곱의 밑 변환 및 지수 치환 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "밑을 2로 변환하고 지수 24를 3의 배수로 묶어내는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "단항식"
    ],
    "method": [
      "지수법칙"
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

다음을 계산한 식에 대한 설명으로 옳은 것은? \[4점\]

\$(12a^2b^3 \+ 18ab^4) \\div 2b \- (15a^3b \- 9a^2b^2)\$

### 선지

① 상수항은 9이다. ② \$a^2b^2\$의 계수는 15이다. ③ \$a\$에 대한 일차식이다. ④ 모든 항의 계수의 합은 0이다. ⑤ \$ab^3\$의 계수는 6이다.

### 정답

②

### 해설

식을 순서대로 계산하여 간단히 정리한다. 1단계: 첫 번째 괄호를 단항식 \$2b\$로 나눈다. \$\$ (12a^2b^3 \+ 18ab^4) \\div 2b \= \\frac{12a^2b^3}{2b} \+ \\frac{18ab^4}{2b} \= 6a^2b^2 \+ 9ab^3 \$\$ 2단계: 둘째 괄호를 빼서 동류항끼리 정리한다. \$\$ (6a^2b^2 \+ 9ab^3) \- (15a^3b \- 9a^2b^2) \= 6a^2b^2 \+ 9ab^3 \- 15a^3b \+ 9a^2b^2 \$\$ 동류항인 \$a^2b^2\$항을 묶어 계산하면 \$\$ \-15a^3b \+ (6 \+ 9)a^2b^2 \+ 9ab^3 \= \-15a^3b \+ 15a^2b^2 \+ 9ab^3 \$\$ 3단계: 각 선지의 설명을 검토한다. ① 상수항은 존재하지 않는다(\$0\$). (거짓) ② \$a^2b^2\$의 계수는 \$15\$이다. (참) ③ \$a\$에 대한 최고차항이 \$-15a^3b\$이므로 \$3\$차식이다. (거짓) ④ 모든 항의 계수의 합은 \$-15 \+ 15 \+ 9 \= 9\$이다. (거짓) ⑤ \$ab^3\$의 계수는 \$9\$이다. (거짓) 따라서 옳은 것은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식과 단항식의 나눗셈 및 동류항 정리 결과의 성질 판별 문항"
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
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_DIVISION_AND_SUBTRACTION",
  "primaryMethod": "2b로 나눈 뒤 괄호 뺄셈의 부호를 분배하여 -15a^3b + 15a^2b^2 + 9ab^3을 얻고 계수를 확인한다.",
  "decisiveStep": "6a^2b^2 + 9a^2b^2 = 15a^2b^2 계수 15 확인",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "동류항 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_SIMPLIFY",
    "templateKey": "TPL_POLYNOMIAL_DIVISION_AND_AUDIT",
    "why": "다항식 나눗셈과 뺄셈 혼합 연산 후 식의 성질을 감사하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_DIVISION_BY_MONOMIAL"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식 나눗셈과 음수 부호 분배 후 동류항 계수를 감사하는 전형 문항",
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
      "다항식의나눗셈",
      "동류항"
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
- 배점: 4

### 발문

\$A \= x^2 \- 4x \+ 2\$, \$B \= \-x \+ 3\$이고, \$-2A \- {4B \- 3(A \- B)} \- 5\$를 간단히 하였을 때, \$x\$의 계수와 상수항의 합을 구하면? \[4점\]

### 선지

① \-15 ② \-17 ③ \-19 ④ 3 ⑤ \-21

### 정답

⑤

### 해설

먼저 대입할 식을 \$A, B\$에 관하여 간단히 정리한다. 중괄호 안을 먼저 전개하면 \$\$ 4B \- 3(A \- B) \= 4B \- 3A \+ 3B \= \-3A \+ 7B \$\$ 따라서 주어진 전체 식은 \$\$ \-2A \- (-3A \+ 7B) \- 5 \= \-2A \+ 3A \- 7B \- 5 \= A \- 7B \- 5 \$\$ 여기에 \$A \= x^2 \- 4x \+ 2\$, \$B \= \-x \+ 3\$을 대입하면 \$\$ (x^2 \- 4x \+ 2\) \- 7(-x \+ 3\) \- 5 \$\$ 분배법칙으로 전개하면 \$\$ x^2 \- 4x \+ 2 \+ 7x \- 21 \- 5 \$\$ 동류항끼리 모아 정리하면 \$\$ x^2 \+ (-4 \+ 7)x \+ (2 \- 21 \- 5\) \= x^2 \+ 3x \- 24 \$\$ 따라서 \$x\$의 계수는 \$3\$이고, 상수항은 \$-24\$이다. 두 값의 합을 구하면 \$\$ 3 \+ (-24) \= \-21 \$\$ 그러므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "복합 괄호 대수식을 문자 단위로 선 정리한 후 다항식을 대입하여 계수 합을 구하는 문항"
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
  "conceptClusterKey": "NESTED_POLYNOMIAL_SUBSTITUTION",
  "primaryMethod": "식 전체를 A - 7B - 5로 먼저 정리한 뒤 대입하여 x^2 + 3x - 24를 얻고 3 + (-24) = -21을 계산한다.",
  "decisiveStep": "A - 7B - 5로 축약 후 동류항 계산하여 3 - 24 = -21 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "소·중·대괄호"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_NESTED_BRACKETS",
    "templateKey": "TPL_BRACKETS_SIMPLIFY_THEN_SUBSTITUTE",
    "why": "중괄호와 소괄호가 포함된 식의 선 정리 후 대입 템플릿"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_SUBSTITUTION"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "괄호 전개 순서와 음수 계수 분배를 정확히 수행한 후 계수 합을 구하는 전형 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "동류항",
      "분배법칙"
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
- 배점: 5

### 발문

가로의 길이가 \$3x^2y\$, 세로의 길이가 \$2x^2y\$인 직사각형 \$ABCD\$에서 변 \$AB\$는 세로이다. 변 \$AB\$를 회전축으로 하여 직각삼각형 \$ABC\$를 \$1\$회전시킬 때 생기는 회전체의 부피를 \$V\_1\$, 변 \$AB\$를 지름으로 하는 반원을 지름 \$AB\$를 축으로 하여 \$1\$회전시킬 때 생기는 회전체의 부피를 \$V\_2\$라고 할 때, \$V\_1 \+ V\_2\$를 구하면? \[5점\]

### 선지

① \$\\dfrac{22}{3}\\pi x^6y^3\$ ② \$7\\pi x^6y^3\$ ③ \$\\dfrac{20}{3}\\pi x^6y^3\$ ④ \$8\\pi x^6y^3\$ ⑤ \$\\dfrac{25}{3}\\pi x^6y^3\$

### 정답

①

### 해설

회전축 \$AB\$의 길이는 세로인 \$2x^2y\$이고, 밑면의 반지름에 해당하는 가로 \$BC\$의 길이는 \$3x^2y\$이다. 1단계: 직각삼각형 \$ABC\$를 변 \$AB\$를 축으로 \$1\$회전시키면 밑면의 반지름이 \$r \= 3x^2y\$, 높이가 \$h \= 2x^2y\$인 원뿔이 생긴다. 원뿔의 부피 \$V\_1\$은 \$\$ V\_1 \= \\frac{1}{3}\\pi r^2 h \= \\frac{1}{3}\\pi (3x^2y)^2 (2x^2y) \= \\frac{1}{3}\\pi (9x^4y^2)(2x^2y) \= 6\\pi x^6y^3 \$\$ 2단계: 지름이 \$AB \= 2x^2y\$인 반원을 지름을 축으로 \$1\$회전시키면 반지름이 \$R \= \\frac{2x^2y}{2} \= x^2y\$인 구가 생긴다. 구의 부피 \$V\_2\$는 \$\$ V\_2 \= \\frac{4}{3}\\pi R^3 \= \\frac{4}{3}\\pi (x^2y)^3 \= \\frac{4}{3}\\pi x^6y^3 \$\$ 3단계: 두 회전체의 부피의 합 \$V\_1 \+ V\_2\$를 구한다. \$\$ V\_1 \+ V\_2 \= 6\\pi x^6y^3 \+ \\frac{4}{3}\\pi x^6y^3 \= \\left(6 \+ \\frac{4}{3}\\right)\\pi x^6y^3 \= \\frac{22}{3}\\pi x^6y^3 \$\$ 그러므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "직각삼각형과 반원의 회전체(원뿔과 구) 부피 공식을 단항식 지수법칙과 융합 계산하는 문항"
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
  "conceptClusterKey": "ROTATIONAL_SOLID_VOLUME_CALCULATION",
  "primaryMethod": "원뿔 부피 V1 = 6pi x^6 y^3과 구 부피 V2 = (4/3)pi x^6 y^3을 더해 (22/3)pi x^6 y^3을 구한다.",
  "decisiveStep": "V1 = 6pi x^6 y^3과 V2 = (4/3)pi x^6 y^3 합산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "도형에의 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_GEOMETRIC_APPLICATION",
    "templateKey": "TPL_ROTATIONAL_BODY_VOLUME_SUM",
    "why": "입체도형 회전체의 부피를 단항식 거듭제곱과 결합하여 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_CALCULATION"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원뿔과 구의 부피 공식을 문자로 표현하고 단항식 거듭제곱 연산을 결합하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "단항식",
      "직사각형"
    ],
    "goal": [
      "부피"
    ],
    "method": [
      "거듭제곱",
      "지수법칙"
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
- 배점: 5

### 발문

\$x\$에 대한 이차식 \$A\$가 다음 조건을 모두 만족시킬 때, 상수 \$a, b\$에 대하여 \$a \+ b\$의 값을 구하면? \[5점\]

(가) \$5x^2 \- x \+ 3\$에서 \$A\$를 빼면 \$-x^2 \+ 5x \- b\$

(나) \$A\$를 \$2x\$로 나누면 \$3x \- a \+ \\dfrac{5}{x}\$이다.

### 선지

① 8 ② 9 ③ 10 ④ 11 ⑤ 12

### 정답

③

### 해설

두 조건으로부터 이차식 \$A\$를 각각 표현하여 계수를 비교한다. 1단계: 조건 (가)에서 \$5x^2 \- x \+ 3 \- A \= \-x^2 \+ 5x \- b\$이므로 \$\$ A \= (5x^2 \- x \+ 3\) \- (-x^2 \+ 5x \- b) \$\$ \$\$ A \= 5x^2 \- x \+ 3 \+ x^2 \- 5x \+ b \= 6x^2 \- 6x \+ 3 \+ b \$\$ 2단계: 조건 (나)에서 \$A \\div 2x \= 3x \- a \+ \\frac{5}{x}\$이므로 양변에 \$2x\$를 곱하면 \$\$ A \= 2x\\left(3x \- a \+ \\frac{5}{x}\\right) \= 6x^2 \- 2ax \+ 10 \$\$ 3단계: 두 식의 각 항의 계수가 일치해야 하므로

- \$x\$의 계수 비교: \$\$ \-6 \= \-2a \\implies a \= 3 \$\$  
- 상수항 비교: \$\$ 3 \+ b \= 10 \\implies b \= 7 \$\$ 따라서 구하는 \$a \+ b\$의 값은 \$\$ a \+ b \= 3 \+ 7 \= 10 \$\$ 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식의 뺄셈 역산과 나눗셈 검산식의 계수 비교를 연립하여 미정계수를 구하는 문항"
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
  "conceptClusterKey": "POLYNOMIAL_UNDETERMINED_COEFFICIENTS",
  "primaryMethod": "조건 (가) A = 6x^2 - 6x + 3 + b와 조건 (나) A = 6x^2 - 2ax + 10의 계수를 비교해 a=3, b=7을 구한다.",
  "decisiveStep": "-2a = -6, 3+b = 10으로부터 a+b = 10 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "식의 값과 활용",
    "l4": "조건식 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_COEFFICIENT_MATCH",
    "templateKey": "TPL_DUAL_POLYNOMIAL_RELATION_COEFFICIENT",
    "why": "두 관계식에서 미지의 다항식을 동치 정리하여 계수를 결정하는 유형"
  },
  "crossConceptKeys": [
    "CC_COEFFICIENT_DETERMINATION"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식 뺄셈의 역연산과 단항식 나눗셈의 곱셈 환원을 연결하여 연립하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "동류항",
      "다항식의나눗셈"
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

\$\\dfrac{24a^2 \- 16ab}{8a} \- \\dfrac{18ab \+ 12b^3}{6b}\$를 간단히 하였을 때, 모든 항의 계수의 합을 구하면? \[4점\]

### 선지

① \-1 ② \-2 ③ \-3 ④ \-4 ⑤ \-5

### 정답

④

### 해설

각 분수를 단항식으로 나누어 계산한다. 1단계: 첫 번째 분수 나눗셈: \$\$ \\frac{24a^2 \- 16ab}{8a} \= \\frac{24a^2}{8a} \- \\frac{16ab}{8a} \= 3a \- 2b \$\$ 2단계: 두 번째 분수 나눗셈: \$\$ \\frac{18ab \+ 12b^3}{6b} \= \\frac{18ab}{6b} \+ \\frac{12b^3}{6b} \= 3a \+ 2b^2 \$\$ 3단계: 두 식의 뺄셈을 수행한다. \$\$ (3a \- 2b) \- (3a \+ 2b^2) \= 3a \- 2b \- 3a \- 2b^2 \= \-2b \- 2b^2 \$\$ 4단계: 간단히 정리된 식 \$-2b \- 2b^2\$에서 모든 항의 계수의 합을 구한다. \$b\$의 계수는 \$-2\$, \$b^2\$의 계수는 \$-2\$이므로 계수의 합은 \$\$ \-2 \+ (-2) \= \-4 \$\$ 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식을 단항식으로 나눈 후 괄호 뺄셈 및 계수 합을 계산하는 문항"
}
```

```
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_DIVISION_COEFFICIENT_SUM",
  "primaryMethod": "각 분수를 나눈 (3a - 2b) - (3a + 2b^2) = -2b - 2b^2에서 계수 합 -2 - 2 = -4를 계산한다.",
  "decisiveStep": "-2b - 2b^2의 계수 합 -2 + (-2) = -4 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 곱셈과 나눗셈",
    "l4": "다항식÷단항식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_DIVISION_SIMPLIFICATION",
    "templateKey": "TPL_POLYNOMIAL_DIVISION_COEFFICIENT_EXTRACTION",
    "why": "다항식 나눗셈 정리 후 특정 계수 또는 계수 합을 도출하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_DIVISION_BY_MONOMIAL"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식의 단항식 나눗셈과 괄호 앞 음수 부호 처리를 결합한 문항",
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
      "다항식의나눗셈",
      "동류항"
    ],
    "condition": [
      "상수"
    ]
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 3

### 발문

다음 일차부등식을 풀면? \[3점\]

\$5x \- 4 \\le 2x \+ 8\$

### 선지

① \$x \< 4\$ ② \$x \\le 4\$ ③ \$x \> 4\$ ④ \$x \\ge 4\$ ⑤ \$x \\le \-4\$

### 정답

②

### 해설

일차부등식의 \$x\$항을 좌변으로, 상수항을 우변으로 이항하여 푼다. \$\$ 5x \- 4 \\le 2x \+ 8 \$\$ \$\$ 5x \- 2x \\le 8 \+ 4 \$\$ 동류항을 정리하면 \$\$ 3x \\le 12 \$\$ 양변을 양수 \$3\$으로 나누면 부등호의 방향이 바뀌지 않으므로 \$\$ x \\le 4 \$\$ 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "일차부등식의 기본 이항과 양수 계수 나눗셈 풀이 문항"
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
  "conceptClusterKey": "LINEAR_INEQUALITY_BASIC_SOLUTION",
  "primaryMethod": "이항하여 3x <= 12를 얻고 양수 3으로 나누어 x <= 4를 도출한다.",
  "decisiveStep": "3x <= 12로부터 부등호 유지 x <= 4 산출",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "기본형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INEQUALITY_SOLVING",
    "templateKey": "TPL_LINEAR_INEQUALITY_BASIC_SOLVE",
    "why": "일차부등식을 이항과 양수 나눗셈으로 해결하는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_LINEAR_INEQUALITIES"
  ],
  "conditionKeys": [],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 기본 이항과 나눗셈을 직관적으로 적용하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
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

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

\$a \+ 4 \< b \+ 4\$일 때, 다음 중 옳지 않은 것은? \[4점\]

### 선지

① \$3a \< 3b\$ ② \$a \- 7 \< b \- 7\$ ③ \$-\\dfrac{a}{2} \> \-\\dfrac{b}{2}\$ ④ \$5 \- 2a \> 5 \- 2b\$ ⑤ \$-4a \+ 1 \< \-4b \+ 1\$

### 정답

⑤

### 해설

주어진 부등식 \$a \+ 4 \< b \+ 4\$의 양변에서 \$4\$를 빼면 \$\$ a \< b \$\$ 이를 바탕으로 각 선지를 검토한다. ① \$a \< b\$의 양변에 양수 \$3\$을 곱하면 부등호의 방향이 바뀌지 않으므로 \$3a \< 3b\$이다. (참) ② \$a \< b\$의 양변에서 \$7\$을 빼면 부등호의 방향이 바뀌지 않으므로 \$a \- 7 \< b \- 7\$이다. (참) ③ \$a \< b\$의 양변에 음수 \$-\\frac{1}{2}\$을 곱하면 부등호의 방향이 반대로 바뀌므로 \$-\\frac{a}{2} \> \-\\frac{b}{2}\$이다. (참) ④ \$a \< b\$의 양변에 음수 \$-2\$를 곱하면 \$-2a \> \-2b\$이고, 양변에 \$5\$를 더하면 \$5 \- 2a \> 5 \- 2b\$이다. (참) ⑤ \$a \< b\$의 양변에 음수 \$-4\$를 곱하면 부등호의 방향이 반대로 바뀌어 \$-4a \> \-4b\$가 되고, 양변에 \$1\$을 더하면 \$\$ \-4a \+ 1 \> \-4b \+ 1 \$\$ 이어야 한다. 선지의 부등호 방향은 \$\<\$로 잘못 표기되었으므로 옳지 않다. 따라서 옳지 않은 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "부등식의 양변에 음수를 곱할 때 부등호 방향이 바뀌는 성질을 점검하는 문항"
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
  "conceptClusterKey": "INEQUALITY_PROPERTIES_AUDIT",
  "primaryMethod": "a < b에서 음수 -4를 곱하면 부등호가 반전되어 -4a+1 > -4b+1이 됨을 식별한다.",
  "decisiveStep": "음수 곱셈 시 부등호 반전 규칙을 적용하여 ⑤의 오류 판정",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE",
    "templateKey": "TPL_INEQUALITY_PROPERTIES_CHECK",
    "why": "부등식의 사칙연산에 따른 부등호 방향 변화를 판별하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DIRECTION_OF_INEQUALITY"
  ],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음수 곱셈에 따른 부등호 반전 원리를 확인하는 1단계 개념 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "대소비교"
    ],
    "method": [
      "부등식의성질"
    ],
    "condition": [
      "음수"
    ]
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

일차부등식 \$\\dfrac{7}{2}x \- 5 \\le 2x \+ a\$를 만족시키는 해가 모두 음수일 때, 상수 \$a\$의 값의 범위를 구하면? \[4점\]

### 선지

① \$a \< \-5\$ ② \$a \\le \-5\$ ③ \$a \> \-5\$ ④ \$a \< \-3\$ ⑤ \$a \\le \-3\$

### 정답

①

### 해설

부등식을 풀어 \$x\$의 범위를 구한다. \$\$ \\frac{7}{2}x \- 5 \\le 2x \+ a \$\$ \$x\$항을 좌변으로, 상수항을 우변으로 이항하면 \$\$ \\frac{7}{2}x \- 2x \\le a \+ 5 \$\$ \$\$ \\frac{3}{2}x \\le a \+ 5 \$\$ 양변에 양수 \$\\frac{2}{3}\$를 곱하면 부등호의 방향은 바뀌지 않으므로 \$\$ x \\le \\frac{2(a \+ 5)}{3} \$\$ 이 부등식을 만족시키는 모든 해가 음수이어야 하므로, 해의 범위의 최댓값(경계값)인 \$\\frac{2(a \+ 5)}{3}\$가 \$0\$보다 작아야 한다. (만약 \$0\$이 되면 \$x \= 0\$도 해에 포함되어 모두 음수라는 조건에 모순이다.) \$\$ \\frac{2(a \+ 5)}{3} \< 0 \$\$ 양변에 \$\\frac{3}{2}\$를 곱하면 \$\$ a \+ 5 \< 0 \$\$ \$\$ a \< \-5 \$\$ 따라서 상수 \$a\$의 값의 범위는 \$a \< \-5\$이다. 그러므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "일차부등식의 해가 음수 조건이 되기 위한 미정계수의 범위를 결정하는 문항"
}
```

```
{
  "sourceQid": 18,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_NEGATIVE_SOLUTION_CONDITION",
  "primaryMethod": "x <= 2(a+5)/3를 구한 뒤 모든 해가 음수가 되기 위해 경계값 2(a+5)/3 < 0을 세워 a < -5를 도출한다.",
  "decisiveStep": "경계점 2(a+5)/3 < 0의 등호 배제 및 a < -5 산출",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "해의 조건",
    "l4": "계수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SOLUTION_SIGN_CONDITION",
    "templateKey": "TPL_INEQUALITY_SIGN_BOUND_DETERMINATION",
    "why": "해의 부호 제약 조건으로부터 미정계수의 범위를 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_COEFFICIENT_DETERMINATION"
  ],
  "conditionKeys": [
    "COND_NEGATIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식을 푼 후 경계점의 0 미만 조건(등호 포함 여부)을 정밀하게 결정하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "상수",
      "해"
    ],
    "method": [
      "이항",
      "부등식의성질"
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

일차부등식 \$1.5x \- 2 \> \\dfrac{1}{4}(4x \- 16)\$을 만족시키는 \$x\$의 값 중 가장 작은 정수는? \[4점\]

### 선지

① \-5 ② \-4 ③ \-2 ④ \-3 ⑤ 0

### 정답

④

### 해설

소수와 분수를 포함한 일차부등식을 푼다. 우변의 괄호를 먼저 전개하면 \$\$ \\frac{1}{4}(4x \- 16\) \= x \- 4 \$\$ 주어진 식은 \$\$ 1.5x \- 2 \> x \- 4 \$\$ \$1.5 \= \\frac{3}{2}\$로 고쳐 쓰면 \$\$ \\frac{3}{2}x \- 2 \> x \- 4 \$\$ \$x\$항을 좌변으로, 상수항을 우변으로 이항하면 \$\$ \\frac{3}{2}x \- x \> \-4 \+ 2 \$\$ \$\$ \\frac{1}{2}x \> \-2 \$\$ 양변에 \$2\$를 곱하면 부등호의 방향은 변하지 않으므로 \$\$ x \> \-4 \$\$ 수직선 위에서 \$x \> \-4\$를 만족시키는 정수 \$x\$는 \$\$ \-3, \-2, \-1, 0, 1, \\dots \$\$ 이 중 가장 작은 정수는 \$-3\$이다. 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "소수와 분수를 포함한 일차부등식을 풀고 조건을 만족하는 최소 정수를 찾는 문항"
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
  "conceptClusterKey": "DECIMAL_FRACTION_INEQUALITY_INTEGER_BOUND",
  "primaryMethod": "1.5x - 2 > x - 4에서 x/2 > -2, 즉 x > -4를 풀고 범위 내 최소 정수 -3을 구한다.",
  "decisiveStep": "x > -4로부터 최소 정수 -3 도출",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "소수·분수 포함형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INEQUALITY_SOLVING",
    "templateKey": "TPL_INEQUALITY_FRACTION_DECIMAL_MIN_INT",
    "why": "소수와 괄호가 포함된 부등식 풀이 및 극값 정수해를 찾는 템플릿"
  },
  "crossConceptKeys": [
    "CC_LINEAR_INEQUALITIES"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "계수 변환 및 이항 정리 후 열린 구간의 최소 정수를 식별하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "정수",
      "해"
    ],
    "method": [
      "이항",
      "부등식의성질"
    ],
    "condition": [
      "대소비교"
    ]
  },
  "hold": ""
}
```

## Q20

- 형식: 객관식  
- 배점: 5

### 발문

다음 (가), (나)의 일차부등식을 만족하는 해 중 정수인 것을 각각 \$a, b\$라고 할 때, \$a \+ b\$의 최솟값을 구하면? \[5점\]

(가) \$5x \+ 7 \> 2x \- 2\$

(나) \$0.02x \- 0.5 \> \-0.1x \+ 0.22\$

### 선지

① 3 ② 4 ③ 5 ④ 6 ⑤ 7

### 정답

③

### 해설

두 일차부등식을 각각 풀어 최소 정수해를 구한다. 1단계: 부등식 (가)를 푼다. \$\$ 5x \+ 7 \> 2x \- 2 \$\$ \$\$ 5x \- 2x \> \-2 \- 7 \$\$ \$\$ 3x \> \-9 \\implies x \> \-3 \$\$ \$x \> \-3\$을 만족하는 정수 \$a\$ 중 가장 작은 값은 \$\$ a \= \-2 \$\$ 2단계: 부등식 (나)를 푼다. 양변에 \$100\$을 곱하여 계수를 정수로 만든다. \$\$ 2x \- 50 \> \-10x \+ 22 \$\$ \$x\$항을 좌변으로, 상수항을 우변으로 이항하면 \$\$ 2x \+ 10x \> 22 \+ 50 \$\$ \$\$ 12x \> 72 \\implies x \> 6 \$\$ \$x \> 6\$을 만족하는 정수 \$b\$ 중 가장 작은 값은 \$\$ b \= 7 \$\$ 3단계: \$a \+ b\$의 최솟값을 구한다. \$a\$와 \$b\$가 각각 최솟값을 가질 때 합도 최소가 되므로 \$\$ a \+ b \= \-2 \+ 7 \= 5 \$\$ 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "두 일차부등식의 최소 정수해를 각각 구하여 합의 최솟값을 산출하는 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "DUAL_INEQUALITY_EXTREMA_SUM",
  "primaryMethod": "(가)에서 x > -3이므로 a=-2, (나)에서 x > 6이므로 b=7을 구해 a+b의 최솟값 5를 계산한다.",
  "decisiveStep": "a=-2, b=7의 최소 정수해 도출 후 -2 + 7 = 5 계산",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "해의 조건",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INEQUALITY_INTEGER_BOUND",
    "templateKey": "TPL_DUAL_INEQUALITY_MIN_INTEGER_SUM",
    "why": "두 부등식의 정수해 최솟값을 각각 구하여 선형 결합하는 유형"
  },
  "crossConceptKeys": [
    "CC_LINEAR_INEQUALITIES"
  ],
  "conditionKeys": [
    "COND_INTEGER"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기본 일차부등식과 소수 계수 부등식을 각각 풀고 정수해의 최솟값을 합산하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "정수",
      "해"
    ],
    "method": [
      "이항",
      "부등식의성질"
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
- 배점: 4

### 발문

\[서술형 1\]

분수 \$\\dfrac{x}{420}\$은 유한소수로 나타낼 수 있고, 기약분수로 나타내면 \$\\dfrac{1}{y}\$가 된다. \$x\$가 \$50\$보다 크고 \$100\$보다 작은 자연수일 때, \$x \+ y\$의 값을 구하고 그 풀이 과정을 서술하시오. \[4점\]

### 선지

없음

### 정답

89

### 해설

1단계: 분수 \$\\frac{x}{420}\$이 기약분수로 \$\\frac{1}{y}\$가 되는 조건을 분석한다. \$\$ \\frac{x}{420} \= \\frac{1}{y} \\implies xy \= 420 \$\$ 분모 \$420\$을 소인수분해하면 \$\$ 420 \= 2^2 \\times 3 \\times 5 \\times 7 \$\$ 기약분수 \$\\frac{1}{y}\$이 유한소수로 나타내어지므로 기약분모 \$y\$의 소인수는 \$2\$ 또는 \$5\$뿐이어야 한다. \[1점\]

2단계: \$x\$의 범위로부터 \$y\$의 범위를 구하고 가능한 \$y\$의 값을 찾는다. \$50 \< x \< 100\$이므로 \$\$ y \= \\frac{420}{x} \$\$ \$\$ \\frac{420}{100} \< y \< \\frac{420}{50} \\implies 4.2 \< y \< 8.4 \$\$ 소인수가 \$2\$ 또는 \$5\$뿐인 자연수 \$y\$ 중에서 \$4.2 \< y \< 8.4\$를 만족하는 후보는 다음과 같다.

- \$y \= 2^m \\times 5^n\$ 형태의 자연수:  
  - \$y \= 5 \= 5^1\$  
  - \$y \= 8 \= 2^3\$ \[1점\]

3단계: 각 \$y\$에 대하여 \$x\$가 자연수이고 유한소수 조건을 만족하는지 확인한다.

- \$y \= 5\$일 때: \$\$ x \= \\frac{420}{5} \= 84 \$\$ \$84\$는 \$50 \< 84 \< 100\$을 만족하는 자연수이다. 실제로 \$\\frac{84}{420} \= \\frac{1}{5} \= 0.2\$이므로 조건을 만족한다.  
- \$y \= 8\$일 때: \$\$ x \= \\frac{420}{8} \= 52.5 \$\$ \$x\$가 자연수가 아니므로 부적합하다. \[1점\]

4단계: \$x \+ y\$의 값을 계산한다. \$x \= 84\$, \$y \= 5\$이므로 \$\$ x \+ y \= 84 \+ 5 \= 89 \\quad \[1점\] \$\$ 따라서 구하는 \$x \+ y\$의 값은 \$89\$이다.

```
{
  "status": "EXEMPT",
  "reason": "유한소수 조건과 분자·분모 제약 조건으로부터 미지수를 구하는 서술형 문항"
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
  "conceptClusterKey": "FINITE_DECIMAL_REVERSE_PARAMETER",
  "primaryMethod": "xy=420에서 4.2 < y < 8.4 범위의 2^m·5^n 형태 자연수 y=5를 찾아 x=84, x+y=89를 구한다.",
  "decisiveStep": "y=5(x=84) 유일해 결정 후 84+5=89 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_PARAMETER_ESSAY",
    "templateKey": "TPL_FINITE_DECIMAL_UNIT_FRACTION_BOUND",
    "why": "단위분수 형태의 유한소수 제약 조건에서 정수해를 역산하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC",
    "CC_PRIME_FACTORIZATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 범위와 소인수 제약 조건을 결합하여 정수해를 추려내는 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "분수",
      "기약분수"
    ],
    "goal": [
      "유한소수",
      "식의값"
    ],
    "method": [
      "소인수분해",
      "약분"
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
- 배점: 5

### 발문

\[서술형 2\]

\$2^a \\times 13 \\times 5^8\$이 \$10\$자리의 자연수라고 할 때, 가능한 자연수 \$a\$의 값을 모두 구하고 그 풀이 과정을 서술하시오. \[5점\]

### 선지

없음

### 정답

8, 9, 10

### 해설

\$10\$의 거듭제곱 꼴 \$10^n \= (2 \\times 5)^n\$을 만들어 자릿수를 분석한다.

1단계: \$a \\ge 8\$인 경우를 조사한다. 지수법칙에 의해 \$2^a \= 2^{a-8} \\times 2^8\$로 분해하면 \$\$ 2^a \\times 13 \\times 5^8 \= 13 \\times 2^{a-8} \\times (2^8 \\times 5^8) \= 13 \\times 2^{a-8} \\times 10^8 \$\$ \$10^8\$을 곱하면 끝에 \$0\$이 \$8\$개 붙게 되므로, 전체 수가 \$10\$자리의 자연수가 되려면 앞의 수 \$13 \\times 2^{a-8}\$이 두 자리 자연수이어야 한다. \$\$ 10 \\le 13 \\times 2^{a-8} \< 100 \\quad \[2점\] \$\$ \$a\$는 자연수이므로 \$a \- 8\$의 값에 따라 조사하면

- \$a \- 8 \= 0 \\implies 13 \\times 2^0 \= 13\$ (두 자리, 성립) \$\\implies a \= 8\$  
- \$a \- 8 \= 1 \\implies 13 \\times 2^1 \= 26\$ (두 자리, 성립) \$\\implies a \= 9\$  
- \$a \- 8 \= 2 \\implies 13 \\times 2^2 \= 52\$ (두 자리, 성립) \$\\implies a \= 10\$  
- \$a \- 8 \= 3 \\implies 13 \\times 2^3 \= 104\$ (\$100\$ 이상이므로 \$11\$자리수가 되어 부적합) \[2점\]

2단계: \$a \< 8\$인 경우를 조사한다. \$a \< 8\$이면 가장 큰 값인 \$a \= 7\$일 때 \$\$ 2^7 \\times 13 \\times 5^8 \= 13 \\times 5 \\times (2^7 \\times 5^7) \= 65 \\times 10^7 \= 650000000\\text{ (9자리수)} \$\$ 이므로 \$a \\le 7\$인 모든 경우 \$9\$자리 이하가 되어 \$10\$자리수가 될 수 없다. \[1점\]

따라서 가능한 자연수 \$a\$의 값은 \$8, 9, 10\$이다.

```
{
  "status": "EXEMPT",
  "reason": "10의 거듭제곱 묶음을 통해 자연수의 자릿수를 분석하는 서술형 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "POWER_OF_TEN_DIGIT_COUNTING_ESSAY",
  "primaryMethod": "2^a·13·5^8 = 13·2^(a-8)·10^8로 변형하여 10 <= 13·2^(a-8) < 100을 만족하는 a=8,9,10을 구한다.",
  "decisiveStep": "13·2^(a-8)의 두 자리 수 조건 10 <= 13·2^(a-8) < 100으로부터 a=8,9,10 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "자릿수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_NUMBER_OF_DIGITS",
    "templateKey": "TPL_EXPONENT_DIGIT_INTERVAL_SOLVE",
    "why": "10의 거듭제곱을 이용하여 자릿수 조건으로부터 지수 미지수를 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_CALCULATION",
    "CC_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "2와 5의 지수를 맞추어 10^8을 묶고 자릿수 부등식으로 지수 범위를 정밀 판별하는 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱",
      "자연수"
    ],
    "goal": [
      "자릿수"
    ],
    "method": [
      "지수법칙",
      "부등식"
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
- 배점: 5

### 발문

\[서술형 3\]

넓이가 각각 \$12a^2b \+ 18ab^3\$, \$20a^3b^2 \- 16a^2b^4\$인 두 직사각형 \$A, B\$를 서로 붙여 놓았다. \$A\$의 세로의 길이가 \$6ab\$, \$B\$의 세로의 길이가 \$4a^2b^2\$이고 두 직사각형의 가로의 길이의 합을 \$L\$이라고 할 때, \$L\$의 값을 구하고 그 풀이 과정을 서술하시오. \[5점\]

### 선지

없음

### 정답

\$7a \- b^2\$

### 해설

직사각형의 가로의 길이는 \$(\\text{넓이}) \\div (\\text{세로의 길이})\$로 구한다.

1단계: 직사각형 \$A\$의 가로의 길이를 구한다. \$\$ \\frac{12a^2b \+ 18ab^3}{6ab} \= \\frac{12a^2b}{6ab} \+ \\frac{18ab^3}{6ab} \= 2a \+ 3b^2 \\quad \[2점\] \$\$

2단계: 직사각형 \$B\$의 가로의 길이를 구한다. \$\$ \\frac{20a^3b^2 \- 16a^2b^4}{4a^2b^2} \= \\frac{20a^3b^2}{4a^2b^2} \- \\frac{16a^2b^4}{4a^2b^2} \= 5a \- 4b^2 \\quad \[2점\] \$\$

3단계: 두 직사각형의 가로의 길이의 합 \$L\$을 구한다. \$\$ L \= (2a \+ 3b^2) \+ (5a \- 4b^2) \$\$ 동류항끼리 묶어 정리하면 \$\$ L \= (2 \+ 5)a \+ (3 \- 4)b^2 \= 7a \- b^2 \\quad \[1점\] \$\$ 따라서 \$L\$의 값은 \$7a \- b^2\$이다.

```
{
  "status": "EXEMPT",
  "reason": "도형 넓이 식으로부터 다항식 나눗셈으로 가로 길이를 각각 구하고 합산하는 서술형 문항"
}
```

```
{
  "sourceQid": 23,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "RECTANGLE_DIMENSION_DIVISION_SUM_ESSAY",
  "primaryMethod": "각 직사각형의 가로 길이 2a + 3b^2과 5a - 4b^2을 나눗셈으로 구하고 합산하여 7a - b^2을 도출한다.",
  "decisiveStep": "2a + 3b^2 및 5a - 4b^2 산출 후 동류항 합 7a - b^2 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 곱셈과 나눗셈",
    "l4": "다항식÷단항식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_GEOMETRIC_APPLICATION",
    "templateKey": "TPL_RECTANGLE_DIMENSION_SUM_ESSAY",
    "why": "도형 넓이 다항식을 단항식으로 나누어 변의 길이를 합산하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_DIVISION_BY_MONOMIAL"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "2회의 다항식 나눗셈과 동류항 덧셈을 단계별 배점에 맞춰 기술하는 서술형 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "다항식",
      "직사각형"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
      "다항식의나눗셈",
      "동류항"
    ],
    "condition": [
      "넓이"
    ]
  },
  "hold": ""
}
```

## Q24

- 형식: 서술형  
- 배점: 6

### 발문

\[서술형 4\]

왕운이가 기차를 기다리는데 출발 시각까지 \$2\$시간 \$30\$분의 여유가 있어서 식당에 가서 점심을 먹고 오려고 한다. 역과 식당 사이를 시속 \$3\\text{ km}\$로 걸어서 왕복하고 식당에서 점심을 \$30\$분 동안 먹으려고 할 때, 역에서 최대 몇 \$\\text{km}\$ 떨어진 식당까지 다녀올 수 있는지 구하고 그 풀이 과정을 서술하시오. \[6점\]

### 선지

없음

### 정답

\$3\\text{ km}\$

### 해설

1단계: 미지수를 정하고 걸린 시간을 문자로 나타낸다. 역에서 식당까지의 거리를 \$x\\text{ km}\$ (\$x \> 0\$)라 하자.

- 시속 \$3\\text{ km}\$로 걸어서 왕복하므로 왕복 거리는 \$2x\\text{ km}\$이다. 왕복 걷는 시간은 \$\$ \\frac{2x}{3}\\text{ (시간)} \\quad \[2점\] \$\$  
- 식당에서 점심을 먹는 시간은 \$\$ 30\\text{분} \= \\frac{30}{60}\\text{시간} \= \\frac{1}{2}\\text{ (시간)} \\quad \[1점\] \$\$  
- 기차 출발 시각까지 남은 여유 시간은 \$\$ 2\\text{시간 } 30\\text{분} \= 2 \+ \\frac{1}{2} \= \\frac{5}{2}\\text{ (시간)} \$\$

2단계: 일차부등식을 세운다. (왕복 걷는 시간) \+ (식사 시간) \$\\le\$ (전체 여유 시간)이므로 \$\$ \\frac{2x}{3} \+ \\frac{1}{2} \\le \\frac{5}{2} \\quad \[2점\] \$\$

3단계: 부등식을 풀고 답을 구한다. 양변에 분모의 최소공배수인 \$6\$을 곱하면 \$\$ 6 \\times \\left(\\frac{2x}{3} \+ \\frac{1}{2}\\right) \\le 6 \\times \\frac{5}{2} \$\$ \$\$ 4x \+ 3 \\le 15 \$\$ 상수항을 이항하면 \$\$ 4x \\le 12 \$\$ 양변을 \$4\$로 나누면 \$\$ x \\le 3 \\quad \[1점\] \$\$ 따라서 역에서 최대 \$3\\text{ km}\$ 떨어진 식당까지 다녀올 수 있다.

```
{
  "status": "EXEMPT",
  "reason": "거리·속력·시간 실생활 소재의 일차부등식 활용 서술형 문항"
}
```

```
{
  "sourceQid": 24,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "SPEED_DISTANCE_TIME_INEQUALITY_ESSAY",
  "primaryMethod": "왕복 걷는 시간 2x/3과 식사 시간 1/2의 합이 5/2 이하라는 부등식 2x/3 + 1/2 <= 5/2를 세워 x <= 3을 구한다.",
  "decisiveStep": "4x + 3 <= 15로부터 x <= 3 도출",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 활용",
    "l4": "거리·속력·시간"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_SPEED_DISTANCE_TIME_WORD_PROBLEM",
    "templateKey": "TPL_ROUND_TRIP_WITH_STAY_TIME_INEQUALITY",
    "why": "왕복 이동 시간과 체류 시간의 합으로 상한 거리를 구하는 일차부등식 활용 템플릿"
  },
  "crossConceptKeys": [
    "CC_SPEED_DISTANCE_TIME",
    "CC_UNIT_CONVERSION"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분 단위 시간의 시간 단위 변환과 왕복 거리 모델링을 결합한 일차부등식 활용 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "이항",
      "부등식의성질"
    ],
    "condition": [
      "미지수"
    ]
  },
  "hold": ""
}
```

