

```
{
  "stem": "25_왕운중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js",
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

다음 수 중에서 유리수의 개수를 \$a\$, 순환소수의 개수를 \$b\$라 할 때, \$a \+ b\$의 값을 구하면? \[3점\]

\$\$1.7, \\quad 0.555\\dots, \\quad 2.131313\\dots, \\quad 0.12345, \\quad 4.020020002\\dots, \\quad \\pi\$\$

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

②

### 해설

유한소수와 순환소수는 분수로 나타낼 수 있으므로 유리수이고, 순환하지 않는 무한소수는 무리수이다. 1단계: 유리수를 선별한다.

- \$1.7\$: 유한소수이므로 유리수이다.  
- \$0.555\\dots \= 0.\\dot{5}\$: 순환소수이므로 유리수이다.  
- \$2.131313\\dots \= 2.\\dot{1}\\dot{3}\$: 순환소수이므로 유리수이다.  
- \$0.12345\$: 유한소수이므로 유리수이다.  
- \$4.020020002\\dots\$: 순환마디가 없는 무한소수이므로 유리수가 아니다.  
- \$\\pi\$: 원주율로 순환하지 않는 무한소수(무리수)이므로 유리수가 아니다. 따라서 유리수의 개수 \$a \= 4\$이다.

2단계: 순환소수를 선별한다. 소수점 아래 숫자가 일정한 규칙으로 끝없이 반복되는 수는 \$0.555\\dots\$와 \$2.131313\\dots\$의 \$2\$개이다. 따라서 순환소수의 개수 \$b \= 2\$이다.

3단계: \$a \+ b\$의 값을 구한다. \$\$ a \+ b \= 4 \+ 2 \= 6 \$\$ 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "소수 목록에서 유리수와 순환소수를 분류하고 개수를 합산하는 기본 문항"
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
  "conceptClusterKey": "RATIONAL_AND_REPEATING_CLASSIFICATION",
  "primaryMethod": "유한소수와 순환소수를 유리수로 분류(a=4), 순환소수 개수(b=2)를 세어 a+b=6을 계산한다.",
  "decisiveStep": "비순환 무한소수 2개를 배제하여 a=4, b=2 도출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유리수와 순환소수의 분류"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RATIONAL_DECIMAL_CLASSIFICATION",
    "templateKey": "TPL_RATIONAL_REPEATING_COUNT_SUM",
    "why": "수의 목록에서 유리수와 순환소수의 정의를 적용해 개수를 카운팅하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_NUMBER_CLASSIFICATION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "유리수와 순환소수의 정의를 직관적으로 판별하여 개수를 더하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "소수",
      "유리수",
      "순환소수"
    ],
    "goal": [
      "개수"
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
- 배점: 3

### 발문

다음 중에서 순환소수의 순환마디를 점을 찍어 간단히 나타낸 것으로 옳지 않은 것은? \[3점\]

### 선지

① \$0.777\\dots \= 0.\\dot{7}\$ ② \$1.353535\\dots \= 1.\\dot{3}\\dot{5}\$ ③ \$0.6242424\\dots \= 0.6\\dot{2}\\dot{4}\$ ④ \$3.152152\\dots \= 3.\\dot{1}5\\dot{2}\$ ⑤ \$2.484848\\dots \= 2.4\\dot{8}\$

### 정답

⑤

### 해설

순환마디의 양 끝 숫자 위에만 점을 찍어 표기하는 규칙을 각 선지별로 점검한다. \$\$ \\begin{aligned} \\text{① } & 0.777\\dots\\text{는 } 7\\text{이 반복되므로 } 0.\\dot{7} \\text{ (참)} \\ \\text{② } & 1.353535\\dots\\text{는 } 35\\text{가 반복되므로 } 1.\\dot{3}\\dot{5} \\text{ (참)} \\ \\text{③ } & 0.6242424\\dots\\text{는 } 6\\text{ 뒤에 } 24\\text{가 반복되므로 } 0.6\\dot{2}\\dot{4} \\text{ (참)} \\ \\text{④ } & 3.152152\\dots\\text{는 } 152\\text{가 반복되므로 양 끝에 점을 찍어 } 3.\\dot{1}5\\dot{2} \\text{ (참)} \\ \\text{⑤ } & 2.484848\\dots\\text{는 소수점 바로 아래부터 } 48\\text{이 반복되므로 } 2.\\dot{4}\\dot{8}\\text{로 나타내어야 한다.} \\ & \\text{선지의 표기 } 2.4\\dot{8}\\text{은 순환마디의 시작을 잘못 표시하였다. (거짓)} \\end{aligned} \$\$ 따라서 옳지 않은 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수 순환마디의 점 표기 규칙 오류 검출 기본 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_NOTATION",
  "primaryMethod": "2.484848...의 순환마디가 48이므로 2.(4)(8)이어야 함을 확인하여 ⑤의 오류를 찾는다.",
  "decisiveStep": "순환마디 48의 시작점 점 표기 누락 식별",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_NOTATION",
    "templateKey": "TPL_REPEATING_DOT_NOTATION",
    "why": "순환소수의 순환마디 양 끝 점 표기 원칙을 대조하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_REPEATING_NOTATION"
  ],
  "conditionKeys": [
    "COND_DECIMAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환마디 표기 규칙을 직접 대조하여 오류를 찾는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "소수"
    ],
    "method": [
      "자릿수"
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
- 배점: 4

### 발문

다음 중에서 옳은 것은 모두 몇 개인가? \[4점\]

ㄱ. 모든 무한소수는 순환소수이다. ㄴ. 기약분수의 분모의 소인수가 \$2\$ 또는 \$5\$뿐이면 유한소수로 나타낼 수 있다. ㄷ. 모든 유리수는 유한소수로만 나타낼 수 있다. ㄹ. 순환하지 않는 무한소수도 분수로 나타낼 수 있다.

### 선지

① \$1\$개 ② \$2\$개 ③ \$3\$개 ④ \$4\$개 ⑤ \$0\$개

### 정답

①

### 해설

유리수와 소수의 분류 체계에 관한 각 명제의 진위를 검토한다. \$\$ \\begin{aligned} \\text{ㄱ: } & \\text{무한소수 중에는 순환하지 않는 무한소수(무리수, 예: } \\pi, 0.101001\\dots\\text{)도 있으므로 거짓이다.} \\ \\text{ㄴ: } & \\text{기약분수의 분모에 } 2\\text{ 또는 } 5 \\text{ 이외의 다른 소인수가 없으면 분모를 } 10\\text{의 거듭제곱으로 만들 수 있으므로 } \\ & \\text{유한소수로 나타낼 수 있다. (참)} \\ \\text{ㄷ: } & \\frac{1}{3} \= 0.333\\dots\\text{처럼 유리수 중에는 순환소수로만 나타낼 수 있는 수도 있으므로 거짓이다.} \\ \\text{ㄹ: } & \\text{순환하지 않는 무한소수는 무리수이므로 분수 } \\frac{a}{b} \\text{ (\$a, b\$는 정수, \$b \\ne 0\$) 꼴로 나타낼 수 없다. (거짓)} \\end{aligned} \$\$ 따라서 옳은 것은 ㄴ의 \$1\$개뿐이다. 그러므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "유리수, 유한소수, 순환소수, 무한소수의 정의 및 분류 명제 종합 판정 문항"
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
  "conceptClusterKey": "RATIONAL_DECIMAL_TRUE_FALSE_SET",
  "primaryMethod": "소수 분류 체계에서 ㄴ(유한소수 판정 조건)만 참이고 ㄱ, ㄷ, ㄹ이 반례에 의해 거짓임을 판별한다.",
  "decisiveStep": "ㄴ만 참임을 확인하여 참인 명제 개수 1개 확정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RATIONAL_DECIMAL_TRUE_FALSE",
    "templateKey": "TPL_RATIONAL_DECIMAL_PROPERTIES",
    "why": "소수의 분류 및 유리수 개념 진위 판별 템플릿"
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
  "difficultyReason": "수 체계의 4개 명제에 대해 반례를 검증하여 참인 개수를 도출하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "유리수",
      "기약분수",
      "소수"
    ],
    "goal": [
      "개수"
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

다음 중 분수를 유한소수로 잘못 나타낸 것을 고르면? \[4점\]

### 선지

① \$\\dfrac{7}{4} \= 1.75\$ ② \$\\dfrac{9}{40} \= 0.225\$ ③ \$\\dfrac{317}{200} \= 1.575\$ ④ \$\\dfrac{7}{20} \= 0.35\$ ⑤ \$\\dfrac{3}{8} \= 0.375\$

### 정답

③

### 해설

분모를 \$10\$의 거듭제곱으로 변형하여 각 분수를 소수로 바꾼다. \$\$ \\begin{aligned} \\text{① } & \\frac{7}{4} \= \\frac{7 \\times 25}{4 \\times 25} \= \\frac{175}{100} \= 1.75 \\text{ (옳음)} \\ \\text{② } & \\frac{9}{40} \= \\frac{9 \\times 25}{40 \\times 25} \= \\frac{225}{1000} \= 0.225 \\text{ (옳음)} \\ \\text{③ } & \\frac{317}{200} \= \\frac{317 \\times 5}{200 \\times 5} \= \\frac{1585}{1000} \= 1.585 \\ & \\text{선지에서는 } 1.575\\text{로 잘못 나타내었다. (옳지 않음)} \\ \\text{④ } & \\frac{7}{20} \= \\frac{7 \\times 5}{20 \\times 5} \= \\frac{35}{100} \= 0.35 \\text{ (옳음)} \\ \\text{⑤ } & \\frac{3}{8} \= \\frac{3 \\times 125}{8 \\times 125} \= \\frac{375}{1000} \= 0.375 \\text{ (옳음)} \\end{aligned} \$\$ 따라서 잘못 나타낸 것은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "10의 거듭제곱 분모 확장을 통한 유한소수 변환 계산 검증 문항"
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
  "conceptClusterKey": "FINITE_DECIMAL_CONVERSION_AUDIT",
  "primaryMethod": "317/200 = 1585/1000 = 1.585인데 1.575로 오기된 ③을 선별한다.",
  "decisiveStep": "317 * 5 = 1585를 통한 소수점 변환 1.585 확인",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수로 나타내기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_DECIMAL_CONVERSION_EVAL",
    "templateKey": "TPL_POWERS_OF_TEN_EXPANSION_MATCH",
    "why": "분수를 10의 거듭제곱 분모로 확장하여 소수로 변환하는 정확성을 평가하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_IRREDUCIBLE"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분모에 적절한 수를 곱해 소수로 변환하는 기본 계산 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "분수"
    ],
    "goal": [
      "유한소수"
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

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

정수가 아닌 유리수 \$\\dfrac{n}{20}, \\dfrac{n}{42}\$를 모두 유한소수로 나타낼 수 있을 때, \$n\$의 값이 될 수 있는 자연수 중에서 \$200\$에 가장 가까운 수를 구하면? \[4점\]

### 선지

① \$147\$ ② \$168\$ ③ \$175\$ ④ \$189\$ ⑤ \$231\$

### 정답

④

### 해설

두 분수가 유한소수가 되기 위한 분모의 소인수 조건과 '정수가 아닌 유리수' 조건을 모두 분석한다. 1단계: 각 분모를 소인수분해한다. \$\$ \\frac{n}{20} \= \\frac{n}{2^2 \\times 5}, \\quad \\frac{n}{42} \= \\frac{n}{2 \\times 3 \\times 7} \$\$ 2단계: 유한소수가 될 조건을 세운다.

- \$\\dfrac{n}{20}\$: 분모의 소인수가 \$2, 5\$뿐이므로 모든 자연수 \$n\$에 대하여 유한소수이다.  
- \$\\dfrac{n}{42}\$: 분모에 \$2, 5\$ 이외의 소인수 \$3\$과 \$7\$이 있으므로, 이들이 약분되어야 한다. 따라서 \$n\$은 \$3 \\times 7 \= 21\$의 배수이어야 한다. 3단계: '정수가 아닌 유리수' 조건을 적용한다.  
- \$\\dfrac{n}{20}\$이 정수가 아니어야 하므로 \$n\$은 \$20\$의 배수가 아니어야 한다.  
- \$\\dfrac{n}{42}\$가 정수가 아니어야 하므로 \$n\$은 \$42\$의 배수가 아니어야 한다. 4단계: \$200\$에 가장 가까운 \$21\$의 배수를 조사한다. \$21\$의 배수들을 \$200\$ 근처에서 나열하면 다음과 같다.  
- \$21 \\times 8 \= 168\$: \$168 \= 42 \\times 4\$이므로 \$42\$의 배수이다. (제외)  
- \$21 \\times 9 \= 189\$: \$42\$의 배수가 아니고 \$20\$의 배수도 아니다. (가능) \$\|189 \- 200\| \= 11\$  
- \$21 \\times 10 \= 210\$: \$210 \= 42 \\times 5\$이므로 \$42\$의 배수이다. (제외)  
- \$21 \\times 11 \= 231\$: \$42\$의 배수가 아니고 \$20\$의 배수도 아니다. (가능) \$\|231 \- 200\| \= 31\$ 두 후보 \$189\$와 \$231\$ 중 \$200\$과의 차이가 \$11\$로 더 작은 수는 \$189\$이다. 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "유한소수 조건과 정수 배제 조건을 결합하여 특정 기준값에 가장 가까운 배수를 찾는 문항"
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
  "conceptClusterKey": "FINITE_DECIMAL_CONDITIONAL_MULTIPLIER",
  "primaryMethod": "n이 21의 배수이면서 42와 20의 배수가 아닌 수 중 200에 가장 가까운 189를 선별한다.",
  "decisiveStep": "21*8=168과 21*10=210을 42의 배수로 제외하고 189(|189-200|=11) 확정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수가 되도록 하는 미지수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_PROXIMITY_SEARCH",
    "templateKey": "TPL_NON_INTEGER_FRACTION_LCM_SEARCH",
    "why": "공배수 조건과 분모 약수 배제 조건을 동시에 만족하는 최적 자연수를 탐색하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_LCM",
    "CC_DIVISIBILITY_CONSTRAINTS"
  ],
  "conditionKeys": [
    "COND_NATURAL",
    "COND_PROXIMITY"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "유한소수 소인수 조건, 정수 제외 조건, 기준점 최근접 수 탐색의 3단계를 수행하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "기약분수",
      "분수",
      "유리수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "소인수분해",
      "배수",
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

다음은 순환소수 \$0.2\\dot{4}\\dot{5}\$를 분수로 나타내는 과정이다.

\$x \= 0.2454545\\dots\$ …… ㉠ ㉠의 양변에 (가)를 곱하면 \$(가)x \= 245.454545\\dots\$ …… ㉡ ㉠의 양변에 (나)를 곱하면 \$(나)x \= 2.454545\\dots\$ …… ㉢ ㉡에서 ㉢을 변끼리 빼면 \$x \= \\dfrac{q}{p}\$ (단, \$\\dfrac{q}{p}\$는 기약분수)이다. 위의 (가), (나)에 알맞은 수를 각각 \$a, b\$라 할 때, \$\\dfrac{a}{b} \+ p \+ q\$의 값을 구하면? \[4점\]

### 선지

① \$235\$ ② \$237\$ ③ \$239\$ ④ \$241\$ ⑤ \$243\$

### 정답

②

### 해설

순환소수를 10의 거듭제곱 뺄셈으로 분수로 나타내는 과정을 확인한다. 1단계: ㉠의 양변에 적절한 거듭제곱을 곱하여 순환마디의 위치를 일치시킨다.

- 소수점 아래 첫째 자리부터 순환마디 둘째 자리까지 건너뛰어 \$245.4545\\dots\$를 만들려면 소수점을 오른쪽으로 \$3\$자리 이동해야 하므로 \$1000\$을 곱한다. \$\$a \= (가) \= 1000\$\$  
- 소수점 아래 순환하지 않는 한 자리 \$2\$를 건너뛰어 \$2.4545\\dots\$를 만들려면 소수점을 오른쪽으로 \$1\$자리 이동해야 하므로 \$10\$을 곱한다. \$\$b \= (나) \= 10\$\$ 따라서 \$\\dfrac{a}{b} \= \\dfrac{1000}{10} \= 100\$이다.

2단계: ㉡에서 ㉢을 변끼리 뺀다. \$\$ \\begin{aligned} 1000x \- 10x &= 245 \- 2 \\ 990x &= 243 \\ x &= \\frac{243}{990} \\end{aligned} \$\$ 3단계: 기약분수로 약분하여 \$p, q\$를 구한다. 분모와 분자를 각각 \$9\$로 나눈다. \$\$ \\frac{243 \\div 9}{990 \\div 9} \= \\frac{27}{110} \$\$ \$27 \= 3^3\$, \$110 \= 2 \\times 5 \\times 11\$이므로 서로소이다. 따라서 \$p \= 110, q \= 27\$이다.

4단계: \$\\dfrac{a}{b} \+ p \+ q\$의 값을 계산한다. \$\$ \\frac{a}{b} \+ p \+ q \= 100 \+ 110 \+ 27 \= 237 \$\$ 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "혼순환소수의 분수 변환 단계별 미정 배수 및 기약분수 분모·분자 합산 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_EXPONENTIAL_EQUATION",
  "primaryMethod": "a=1000, b=10에서 a/b=100을 얻고 990x=243의 기약분수 27/110에서 p=110, q=27을 합산한다.",
  "decisiveStep": "243/990 = 27/110 기약분수 약분 후 100 + 110 + 27 = 237 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_FRACTION_EQUATION_UNKNOWN",
    "templateKey": "TPL_REPEATING_CONVERSION_COMBINED_SUM",
    "why": "순환소수 10의 거듭제곱 방정식 빈칸과 기약분수 항들을 결합 계산하는 템플릿"
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
  "difficultyReason": "거듭제곱 배수 식별과 분수 약분을 순차적으로 처리해 값을 결합하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "방정식",
      "약수",
      "연산"
    ],
    "condition": [
      "기약분수"
    ]
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

다음 순환소수를 분수로 옳게 나타낸 것을 고르면? \[4점\]

### 선지

① \$0.\\dot{4}\\dot{5} \= \\dfrac{5}{11}\$ ② \$0.\\dot{8} \= \\dfrac{4}{5}\$ ③ \$0.3\\dot{6} \= \\dfrac{36}{99}\$ ④ \$0.21\\dot{5} \= \\dfrac{215}{900}\$ ⑤ \$1.2\\dot{3} \= \\dfrac{123}{90}\$

### 정답

①

### 해설

각 선지의 순환소수를 공식에 따라 분수로 변환하여 비교한다. \$\$ \\begin{aligned} \\text{① } & 0.\\dot{4}\\dot{5} \= \\frac{45}{99} \= \\frac{5}{11} \\text{ (옳음)} \\ \\text{② } & 0.\\dot{8} \= \\frac{8}{9} \\ne \\frac{4}{5} \\text{ (거짓)} \\ \\text{③ } & 0.3\\dot{6} \= \\frac{36 \- 3}{90} \= \\frac{33}{90} \= \\frac{11}{30} \\ne \\frac{36}{99} \\text{ (거짓)} \\ \\text{④ } & 0.21\\dot{5} \= \\frac{215 \- 21}{900} \= \\frac{194}{900} \= \\frac{97}{450} \\ne \\frac{215}{900} \\text{ (거짓)} \\ \\text{⑤ } & 1.2\\dot{3} \= \\frac{123 \- 12}{90} \= \\frac{111}{90} \= \\frac{37}{30} \\ne \\frac{123}{90} \\text{ (거짓)} \\end{aligned} \$\$ 따라서 옳게 나타낸 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수 분수 변환 공식(순환마디 9, 비순환 0, 전체수-비순환수) 검증 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_TO_FRACTION_FORMULA",
  "primaryMethod": "0.(4)(5) = 45/99 = 5/11을 확인하여 옳은 것을 고른다.",
  "decisiveStep": "45/99 = 5/11의 기약분수 일치 확인",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_TO_FRACTION_CHECK",
    "templateKey": "TPL_REPEATING_DECIMAL_CONVERSION_AUDIT",
    "why": "순환소수의 분수 변환 공식 적용 정확도를 검증하는 템플릿"
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
  "difficultyReason": "공식을 사용하여 순환소수를 분수로 바꾸고 기약분수를 확인하는 1단계 문항",
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
      "약수"
    ],
    "condition": [
      "소수"
    ]
  },
  "hold": ""
}
```

## Q08

- 형식: 객관식  
- 배점: 5

### 발문

\$\\dfrac{2}{37}\$를 소수로 나타내었을 때, 소수점 아래 \$n\$번째 자리의 수를 \$f(n)\$이라고 하자. 이때 \$f(1) \+ f(3) \+ f(5) \+ \\dots \+ f(201)\$의 값을 구하면? \[5점\]

### 선지

① \$295\$ ② \$297\$ ③ \$298\$ ④ \$300\$ ⑤ \$301\$

### 정답

⑤

### 해설

분수의 순환마디를 구하고 홀수 번째 자릿수의 규칙성을 찾아 합산한다. 1단계: \$\\dfrac{2}{37}\$를 소수로 변환한다. \$\$ 2 \\div 37 \= 0.054054054\\cdots \= 0.\\dot{0}5\\dot{4} \$\$ 순환마디는 \$0, 5, 4\$의 \$3\$개 숫자가 반복된다. 2단계: 각 자릿수 \$f(n)\$의 값을 나열하여 홀수 번째 항의 규칙을 찾는다. \$\$ \\begin{aligned} f(1) &= 0 \\ f(2) &= 5 \\ f(3) &= 4 \\ f(4) &= 0 \\ f(5) &= 5 \\ f(6) &= 4 \\ f(7) &= 0 \\ f(9) &= 4 \\ f(11) &= 5 \\end{aligned} \$\$ 홀수 번째 항 \$f(2k \- 1)\$들을 차례대로 살펴보면 다음과 같다. \$\$ f(1) \= 0, \\quad f(3) \= 4, \\quad f(5) \= 5, \\quad f(7) \= 0, \\quad f(9) \= 4, \\quad f(11) \= 5, \\dots \$\$ 즉, 홀수 번째 자릿수는 \$0, 4, 5\$의 \$3\$개 숫자가 이 순서대로 계속 반복된다. 한 묶음의 합은 다음과 같다. \$\$ 0 \+ 4 \+ 5 \= 9 \$\$ 3단계: 홀수 번째 항의 총 개수를 구한다. \$1\$부터 \$201\$까지의 홀수의 개수는 다음과 같다. \$\$ 2k \- 1 \= 201 \\implies 2k \= 202 \\implies k \= 101\\text{ (개)} \$\$ 4단계: \$101\$개의 항을 \$3\$개씩 묶어 합산한다. \$\$ 101 \= 3 \\times 33 \+ 2 \$\$ 따라서 \$3\$개짜리 묶음이 \$33\$번 반복되고, 그 뒤에 \$2\$개의 항이 남는다. 남은 두 항은 묶음의 첫 번째와 두 번째 숫자인 \$0\$과 \$4\$이다. \$\$ \\begin{aligned} \\text{구하는 합} &= 33 \\times (0 \+ 4 \+ 5\) \+ (0 \+ 4\) \\ &= 33 \\times 9 \+ 4 \\ &= 297 \+ 4 \\ &= 301 \\end{aligned} \$\$ 그러므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "순환마디 주기성을 부분 수열(홀수 항)로 추출하여 군수열 합을 구하는 응용 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_SERIES_SUM",
  "primaryMethod": "2/37의 홀수 자리 숫자가 0, 4, 5로 3개 주기 반복됨을 파악해 33*9 + (0+4) = 301을 계산한다.",
  "decisiveStep": "101개 홀수 항의 3주기 분할 33*9 + 4 = 301 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "소수점 아래 n번째 자리의 숫자"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_SERIES_SUM",
    "templateKey": "TPL_PERIODIC_SUBSEQUENCE_SUM",
    "why": "순환마디 주기의 등차 인덱스 추출 수열의 합을 군수열 기법으로 산출하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PERIODICITY_MODULO"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환마디 전개, 홀수 인덱스 주기성 추출, 몫과 나머지를 이용한 군수열 합산의 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "기약분수",
      "분수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "자릿수",
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
- 배점: 3

### 발문

다음은 세 학생이 주어진 식을 지수법칙을 이용하여 간단히 나타낸 것이다. 바르게 푼 학생만을 있는 대로 고른 것은? \[3점\]

- 지우: \$a^4 \\times a^3 \= a^{4 \\times 3} \= a^{12}\$  
- 민호: \$3^{50} \\times 3 \\times 3^3 \= 3^{53}\$  
- 서연: \$(b^{15})^4 \= b^{60}\$

### 선지

① 지우 ② 민호 ③ 서연 ④ 지우, 서연 ⑤ 민호, 서연

### 정답

③

### 해설

지수법칙을 적용하여 각 학생의 계산 과정을 검토한다. \$\$ \\begin{aligned} \\text{지우: } & a^4 \\times a^3 \= a^{4 \+ 3} \= a^7 \\ & \\text{지수끼리 곱하여 } a^{12}\\text{로 계산하였으므로 틀렸다.} \\ \\text{민호: } & 3^{50} \\times 3 \\times 3^3 \= 3^{50} \\times 3^1 \\times 3^3 \= 3^{50 \+ 1 \+ 3} \= 3^{54} \\ & 3 \= 3^1\\text{의 지수 } 1\\text{을 빠뜨리고 } 50 \+ 3 \= 53\\text{으로 계산하였으므로 틀렸다.} \\ \\text{서연: } & (b^{15})^4 \= b^{15 \\times 4} \= b^{60} \\ & \\text{거듭제곱의 거듭제곱에서 지수끼리 곱하여 바르게 계산하였다. (옳음)} \\end{aligned} \$\$ 따라서 바르게 푼 학생은 서연 한 명이다. 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "지수의 합 공식 및 거듭제곱 거듭제곱 지수 곱 공식의 오개념 분석 문항"
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
  "conceptClusterKey": "EXPONENT_LAW_MISCONCEPTION_AUDIT",
  "primaryMethod": "지수의 덧셈과 곱셈 혼동, 3=3^1 누락 오류를 분석하여 서연만 바르게 풀었음을 확인한다.",
  "decisiveStep": "지우(지수 곱 오류)와 민호(지수 1 누락)를 배제하고 서연 선택",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수의 곱과 합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_LAW_STUDENT_AUDIT",
    "templateKey": "TPL_STUDENT_EXPONENT_SOLUTION_CHECK",
    "why": "학생 풀이의 전형적인 지수법칙 오개념을 식별하고 참인 풀이를 선별하는 템플릿"
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
  "difficultyReason": "지수법칙의 기본 덧셈·곱셈 규칙을 직접 대조하는 1단계 문항",
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

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

용량이 \$512\\text{ KiB}\$인 음원 파일 \$128\$개의 전체 용량은 몇 \$\\text{GiB}\$인지 구하면? (단, \$1\\text{ GiB} \= 2^{20}\\text{ KiB}\$) \[4점\]

### 선지

① \$\\dfrac{1}{64}\\text{ GiB}\$ ② \$\\dfrac{1}{32}\\text{ GiB}\$ ③ \$\\dfrac{3}{32}\\text{ GiB}\$ ④ \$\\dfrac{1}{16}\\text{ GiB}\$ ⑤ \$\\dfrac{1}{8}\\text{ GiB}\$

### 정답

④

### 해설

밑을 \$2\$로 소인수분해하여 전체 용량을 구하고 단위 환산을 적용한다. 1단계: 전체 용량을 \$\\text{KiB}\$ 단위로 계산한다. \$512 \= 2^9\$이고, \$128 \= 2^7\$이다. 따라서 \$128\$개의 전체 용량은 다음과 같다. \$\$ 2^9 \\times 2^7 \= 2^{9 \+ 7} \= 2^{16}\\text{ KiB} \$\$ 2단계: \$1\\text{ GiB} \= 2^{20}\\text{ KiB}\$이므로 \$\\text{GiB}\$ 단위로 변환한다. \$\$ \\frac{2^{16}}{2^{20}} \= \\frac{1}{2^{20 \- 16}} \= \\frac{1}{2^4} \= \\frac{1}{16}\\text{ GiB} \$\$ 따라서 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "이진 데이터 단위 변환과 밑 2의 거듭제곱 나눗셈 지수법칙 문항"
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
  "conceptClusterKey": "BINARY_UNIT_DIVISION_EXPONENT",
  "primaryMethod": "2^9 * 2^7 = 2^16 KiB를 구하고 2^16 / 2^20 = 1/2^4 = 1/16 GiB를 계산한다.",
  "decisiveStep": "2^{16} / 2^{20} = 1/16 나눗셈 지수 차 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수의 차"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_DATA_UNIT_EXPONENT_CHAIN",
    "templateKey": "TPL_BINARY_UNIT_QUOTIENT_FRACTION",
    "why": "단위 변환의 거듭제곱 나눗셈을 통해 단위 환산 분수를 구하는 템플릿"
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
  "difficultyReason": "2의 거듭제곱 곱셈 후 단위 환산 나눗셈을 적용하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "분수"
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

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

다음 중에서 옳은 것만을 있는 대로 고른 것은? (단, \$a \\neq 0, b \\neq 0\$이고, \$m, n\$은 자연수) \[4점\]

ㄱ. \$3^{40} \+ 3^{40} \+ 3^{40} \= 3^{41}\$ ㄴ. \$a^8 \\div a^8 \= 0\$ ㄷ. \$-(2a^3b)^2 \= \-4a^6b^2\$ ㄹ. \$\\dfrac{(-a^2b)^3}{b^3} \= a^6\$

### 선지

① ㄱ, ㄷ ② ㄱ, ㄴ ③ ㄴ, ㄷ ④ ㄴ, ㄹ ⑤ ㄱ, ㄷ, ㄹ

### 정답

①

### 해설

지수법칙을 각 보기에 적용하여 참과 거짓을 판정한다. \$\$ \\begin{aligned} \\text{ㄱ: } & 3^{40} \+ 3^{40} \+ 3^{40} \= 3 \\times 3^{40} \= 3^{1 \+ 40} \= 3^{41} \\text{ (참)} \\ \\text{ㄴ: } & a^8 \\div a^8 \= \\frac{a^8}{a^8} \= 1 \\ne 0 \\text{ (거짓)} \\ \\text{ㄷ: } & \-(2a^3b)^2 \= \-(2^2 (a^3)^2 b^2) \= \-4a^6b^2 \\text{ (참)} \\ \\text{ㄹ: } & \\frac{(-a^2b)^3}{b^3} \= \\frac{(-1)^3 (a^2)^3 b^3}{b^3} \= \\frac{-a^6 b^3}{b^3} \= \-a^6 \\ne a^6 \\text{ (거짓)} \\end{aligned} \$\$ 따라서 옳은 것은 ㄱ, ㄷ이다. 그러므로 정답은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "지수법칙의 덧셈의 곱셈 변환, 나눗셈(지수 같을 때), 거듭제곱 부호 처리 종합 판별 문항"
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
  "conceptClusterKey": "EXPONENT_PROPERTIES_AUDIT",
  "primaryMethod": "3*3^40=3^41(ㄱ 참), a^8/a^8=1(ㄴ 거짓), -(2a^3b)^2=-4a^6b^2(ㄷ 참), 부호 -a^6(ㄹ 거짓)을 판별한다.",
  "decisiveStep": "ㄴ(0이 아닌 1)과 ㄹ(-a^6)의 오류를 배제하고 ㄱ, ㄷ 확정",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "지수법칙 종합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_LAWS_TRUE_FALSE",
    "templateKey": "TPL_EXPONENT_LAWS_COMPENDIUM_CHECK",
    "why": "다양한 지수법칙 명제의 참/거짓을 종합 검증하는 선다형 템플릿"
  },
  "crossConceptKeys": [
    "CC_EXPONENT_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NONZERO"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호 처리와 덧셈 묶음 등 빈출 함정을 점검하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "거듭제곱"
    ],
    "method": [
      "사칙연산",
      "부호",
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

다음 중에서 옳지 않은 것을 고르면? \[5점\]

### 선지

① \$(-2x^2 \+ 5x \- 3\) \- (3x^2 \- 4x \+ 6\) \= \-5x^2 \+ 9x \- 9\$ ② \$4a^4b^6 \\div (-2a^2b) \\div (-2ab)^2 \= \\dfrac{b^3}{2a}\$ ③ \$(8x^2y \- 4x^2y^2) \\div 2xy \- x(4 \- 3y) \= xy\$ ④ \$4a \- 3b \+ \[-2a \+ {5a \- (2a \- b)}\] \= 5a \- 2b\$ ⑤ \$-\\dfrac{2x^2y \- 6x^2y^2}{2y} \= \-x^2 \+ 3x^2y\$

### 정답

②

### 해설

각 선지의 좌변을 계산하여 우변과 비교한다. \$\$ \\begin{aligned} \\text{① } & (-2x^2 \+ 5x \- 3\) \- (3x^2 \- 4x \+ 6\) \\ &= \-2x^2 \+ 5x \- 3 \- 3x^2 \+ 4x \- 6 \= \-5x^2 \+ 9x \- 9 \\text{ (옳음)} \\ \\text{② } & (-2ab)^2 \= 4a^2b^2 \\ & 4a^4b^6 \\div (-2a^2b) \\div 4a^2b^2 \= \\frac{4a^4b^6}{(-2a^2b) \\times 4a^2b^2} \= \\frac{4a^4b^6}{-8a^4b^3} \= \-\\frac{b^3}{2} \\ & \\text{선지에서는 양의 부호와 분모의 } a\\text{를 오기하여 } \\frac{b^3}{2a}\\text{로 나타내었다. (옳지 않음)} \\ \\text{③ } & (8x^2y \- 4x^2y^2) \\div 2xy \= 4x \- 2xy \\ & x(4 \- 3y) \= 4x \- 3xy \\ & (4x \- 2xy) \- (4x \- 3xy) \= 4x \- 2xy \- 4x \+ 3xy \= xy \\text{ (옳음)} \\ \\text{④ } & 5a \- (2a \- b) \= 3a \+ b \\ & \-2a \+ (3a \+ b) \= a \+ b \\ & 4a \- 3b \+ (a \+ b) \= 5a \- 2b \\text{ (옳음)} \\ \\text{⑤ } & \-\\frac{2x^2y \- 6x^2y^2}{2y} \= \-\\left(\\frac{2x^2y}{2y} \- \\frac{6x^2y^2}{2y}\\right) \= \-(x^2 \- 3x^2y) \= \-x^2 \+ 3x^2y \\text{ (옳음)} \\end{aligned} \$\$ 따라서 옳지 않은 것은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식 및 다항식 덧셈, 뺄셈, 곱셈, 나눗셈, 중첩 괄호 종합 계산 오류 판별 문항"
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
  "conceptClusterKey": "ALGEBRAIC_OPERATIONS_COMPREHENSIVE_AUDIT",
  "primaryMethod": "②의 연산 결과가 -b^3/2인데 b^3/(2a)로 부호 및 문자가 잘못 정리되었음을 식별한다.",
  "decisiveStep": "4a^4b^6 / (-8a^4b^3) = -b^3/2 계산으로 ② 오류 적발",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식과 다항식의 곱셈과 나눗셈",
    "l4": "식의 계산 종합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_ALGEBRA_OPERATION_COMPREHENSIVE",
    "templateKey": "TPL_POLYNOMIAL_ARITHMETIC_ERROR_SEARCH",
    "why": "다양한 유형의 식 계산식 중 부호 및 지수 약분 오류를 찾아내는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW",
    "CC_EXPONENT_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_COEFFICIENT"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식 뺄셈, 다중 단항식 나눗셈, 분배법칙, 다중 괄호를 모두 점검하는 3단계 종합 문항",
  "level": "중",
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
      "부호",
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

\$2^{53} \\times 5^{50}\$은 \$n\$자리 자연수이고 각 자리 숫자의 합은 \$a\$이다. 이때 \$a \+ n\$의 값을 구하면? \[4점\]

### 선지

① \$55\$ ② \$57\$ ③ \$59\$ ④ \$61\$ ⑤ \$63\$

### 정답

③

### 해설

\$2\$와 \$5\$를 같은 지수만큼 묶어 \$10\$의 거듭제곱으로 나타낸다. 1단계: 식을 변형한다. \$\$ \\begin{aligned} 2^{53} \\times 5^{50} &= 2^3 \\times 2^{50} \\times 5^{50} \\ &= 2^3 \\times (2 \\times 5)^{50} \\ &= 8 \\times 10^{50} \\end{aligned} \$\$ 2단계: 자릿수 \$n\$을 구한다. \$8 \\times 10^{50}\$은 숫자 \$8\$ 뒤에 \$0\$이 \$50\$개 붙는 수이므로 전체 자릿수는 다음과 같다. \$\$ n \= 1 \+ 50 \= 51 \$\$ 3단계: 각 자리 숫자의 합 \$a\$를 구한다. 맨 앞자리의 숫자만 \$8\$이고 나머지 \$50\$개의 자리는 모두 \$0\$이므로 \$\$ a \= 8 \+ 0 \+ 0 \+ \\dots \+ 0 \= 8 \$\$ 4단계: \$a \+ n\$의 값을 계산한다. \$\$ a \+ n \= 8 \+ 51 \= 59 \$\$ 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "10의 거듭제곱 묶음을 통한 큰 수의 자릿수 및 자릿수 합 산출 문항"
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
  "conceptClusterKey": "POWER_OF_TEN_DIGIT_COUNT_AND_SUM",
  "primaryMethod": "2^53 * 5^50 = 8 * 10^50에서 자릿수 n=51, 각 자리 합 a=8을 얻어 a+n=59를 구한다.",
  "decisiveStep": "2^3 * (2*5)^50 = 8 * 10^50 변환 및 1+50=51 자릿수 판정",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "지수법칙",
    "l4": "자릿수 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POWER_OF_TEN_DIGITS",
    "templateKey": "TPL_POWERS_OF_2_AND_5_DIGIT_SUM",
    "why": "2와 5의 거듭제곱 곱을 10의 거듭제곱으로 환원하여 자릿수와 합을 구하는 템플릿"
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
  "difficultyReason": "2와 5의 지수를 맞추어 10의 거듭제곱 꼴로 변형하고 자릿수를 세는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자릿수",
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

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

높이가 \$4x\$이고 부피가 \$16x^2y^2\$인 원뿔의 밑넓이를 구하면? \[4점\]

### 선지

① \$4xy^2\$ ② \$4xy\$ ③ \$8xy^2\$ ④ \$12xy\$ ⑤ \$12xy^2\$

### 정답

⑤

### 해설

원뿔의 부피 공식 \$V \= \\dfrac{1}{3}Sh\$ (\$S\$는 밑넓이, \$h\$는 높이)를 적용한다. 1단계: 문제의 조건을 공식에 대입한다. \$\$ 16x^2y^2 \= \\frac{1}{3} \\times S \\times 4x \$\$ 2단계: 양변을 정리하여 밑넓이 \$S\$에 대한 등식으로 나타낸다. \$\$ 16x^2y^2 \= \\frac{4x}{3}S \$\$ 양변에 \$\\dfrac{3}{4x}\$를 곱한다. \$\$ \\begin{aligned} S &= 16x^2y^2 \\times \\frac{3}{4x} \\ &= \\left(\\frac{16 \\times 3}{4}\\right) x^{2-1} y^2 \\ &= 12xy^2 \\end{aligned} \$\$ 따라서 원뿔의 밑넓이는 \$12xy^2\$이므로 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "원뿔 부피 공식(1/3 Sh)과 단항식 나눗셈을 이용한 밑넓이 역산 문항"
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
  "conceptClusterKey": "CONE_VOLUME_BASE_AREA_DIVISION",
  "primaryMethod": "16x^2y^2 = (1/3)*S*4x로부터 S = 16x^2y^2 * (3/4x) = 12xy^2를 산출한다.",
  "decisiveStep": "1/3 계수를 역연산 3배로 넘긴 후 4x로 나누어 12xy^2 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "도형에서의 단항식의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_CONE_BASE_AREA_SOLVE",
    "templateKey": "TPL_CONE_VOLUME_UNKNOWN_BASE_SOLVE",
    "why": "원뿔 부피 공식에서 단항식 나눗셈을 적용하여 미지의 밑넓이를 구하는 템플릿"
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
  "difficultyReason": "입체도형 부피 공식의 1/3 상수를 반영하여 단항식 나눗셈을 처리하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "원뿔",
      "부피",
      "높이"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "방정식",
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
- 배점: 3

### 발문

다음은 고속도로 터널 진입 제한을 나타내는 표지판에 대한 설명이다. 이를 부등식으로 옳게 나타낸 것을 고르면? \[3점\]\\n\\n"차량의 적재 높이 \$h\\text{ m}\$가 \$4.2\\text{ m}\$ 이하이어야 통과할 수 있다."

### 선지

① \$h \< 4.2\$ ② \$h \\le 4.2\$ ③ \$h \> 4.2\$ ④ \$h \\ge 4.2\$ ⑤ \$h \= 4.2\$

### 정답

②

### 해설

'이하'는 기준값보다 작거나 같음을 나타내는 부등호 \$\\le\$를 사용한다. 차량의 적재 높이가 \$4.2\\text{ m}\$ 이하이어야 하므로 \$\$ h \\le 4.2 \$\$ 따라서 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "일상 조건(이하)을 부등호 기호로 번역하는 기본 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "INEQUALITY_SIGN_TRANSLATION_LE",
  "primaryMethod": "‘이하’의 수학적 정의가 작거나 같다(<=)임을 대조하여 h <= 4.2를 선택한다.",
  "decisiveStep": "‘이하’에 대응하는 부등호 <= 선택",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식과 그 해",
    "l4": "부등식으로 나타내기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SYMBOL_SELECTION",
    "templateKey": "TPL_REAL_WORLD_SIGN_MAPPING",
    "why": "실생활 규제 문구의 수량 한계를 부등호 기호로 대응시키는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_SIGN"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "‘이하’의 부등호 정의를 바로 적용하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "부호"
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

\$x\$의 값이 \$-3, \-2, \-1, 0, 1\$일 때, 일차부등식 \$-2x \+ 3 \\ge 3(x \+ 2)\$의 해를 모두 더한 값을 구하면? \[4점\]

### 선지

① \$-3\$ ② \$-4\$ ③ \$-5\$ ④ \$-6\$ ⑤ \$-7\$

### 정답

④

### 해설

일차부등식을 풀어 해의 범위를 구한 후, 주어진 수 중에서 만족하는 값을 찾는다. 1단계: 부등식을 푼다. \$\$ \\begin{aligned} \-2x \+ 3 &\\ge 3x \+ 6 \\ \-2x \- 3x &\\ge 6 \- 3 \\ \-5x &\\ge 3 \\end{aligned} \$\$ 양변을 음수 \$-5\$로 나누면 부등호의 방향이 바뀐다. \$\$ x \\le \-\\frac{3}{5} \= \-0.6 \$\$ 2단계: 주어진 값 \${-3, \-2, \-1, 0, 1}\$ 중 \$x \\le \-0.6\$을 만족시키는 값을 찾는다.

- \$-3 \\le \-0.6\$ (참)  
- \$-2 \\le \-0.6\$ (참)  
- \$-1 \\le \-0.6\$ (참)  
- \$0 \\le \-0.6\$ (거짓)  
- \$1 \\le \-0.6\$ (거짓) 따라서 해가 되는 \$x\$의 값은 \$-3, \-2, \-1\$이다.

3단계: 해를 모두 더한다. \$\$ (-3) \+ (-2) \+ (-1) \= \-6 \$\$ 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "일차부등식 풀이 및 주어진 유한 정수 집합 내의 해 선별 합산 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "FINITE_DOMAIN_INEQUALITY_SUM",
  "primaryMethod": "-5x >= 3에서 x <= -3/5를 풀고 정수 후보 중 -3, -2, -1을 찾아 합 -6을 계산한다.",
  "decisiveStep": "x <= -0.6 조건에서 -3, -2, -1 선택 후 (-3)+(-2)+(-1)=-6 계산",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "괄호가 있는 일차부등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SOL_SUM_OVER_SET",
    "templateKey": "TPL_DISCRETE_CANDIDATE_INEQUALITY_SUM",
    "why": "부등식을 풀고 후보 집합의 원소 중 부등식을 만족하는 해를 취합해 합하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_FINITE_SET"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식을 정확히 풀고 음의 정수 후보 중 해를 빠짐없이 골라 더하는 2단계 문항",
  "level": "중하",
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
      "부등식",
      "연산"
    ],
    "condition": [
      "대소비교"
    ]
  },
  "hold": ""
}
```

## Q17

- 형식: 객관식  
- 배점: 4

### 발문

\$a \\ge b\$일 때, 다음 중 옳지 않은 것을 고르면? \[4점\]

### 선지

① \$-\\dfrac{a}{5} \+ 2 \\ge \-\\dfrac{b}{5} \+ 2\$ ② \$a \+ 4 \\ge b \+ 4\$ ③ \$-2a \+ 3 \\le \-2b \+ 3\$ ④ \$5 \- 3a \\le 5 \- 3b\$ ⑤ \$3a \- 1 \\ge 3b \- 1\$

### 정답

①

### 해설

부등식의 성질을 적용하여 각 선지의 참과 거짓을 검토한다. \$\$ \\begin{aligned} \\text{① } & a \\ge b\\text{의 양변을 음수 } \-5\\text{로 나누면 부등호의 방향이 반대로 바뀌어야 한다.} \\ & \-\\frac{a}{5} \\le \-\\frac{b}{5} \\ & \\text{양변에 } 2\\text{를 더하면 } \-\\frac{a}{5} \+ 2 \\le \-\\frac{b}{5} \+ 2\\text{이어야 한다.} \\ & \\text{선지에서는 부등호 방향을 바꾸지 않았으므로 옳지 않다. (거짓)} \\ \\text{② } & a \\ge b\\text{의 양변에 } 4\\text{를 더하면 } a \+ 4 \\ge b \+ 4 \\text{ (참)} \\ \\text{③ } & a \\ge b\\text{의 양변에 음수 } \-2\\text{를 곱하면 } \-2a \\le \-2b, \\quad 3\\text{을 더하면 } \-2a \+ 3 \\le \-2b \+ 3 \\text{ (참)} \\ \\text{④ } & a \\ge b\\text{의 양변에 음수 } \-3\\text{을 곱하면 } \-3a \\le \-3b, \\quad 5\\text{를 더하면 } 5 \- 3a \\le 5 \- 3b \\text{ (참)} \\ \\text{⑤ } & a \\ge b\\text{의 양변에 } 3\\text{을 곱하면 } 3a \\ge 3b, \\quad 1\\text{을 빼면 } 3a \- 1 \\ge 3b \- 1 \\text{ (참)} \\end{aligned} \$\$ 따라서 옳지 않은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "음수 곱셈·나눗셈 시 부등호 역전 여부를 점검하는 부등식 성질 기본 문항"
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
  "conceptClusterKey": "INEQUALITY_PROPERTY_SIGN_REVERSAL",
  "primaryMethod": "양변에 -1/5을 곱할 때 부등호 방향이 바뀌어야 하므로 ①이 옳지 않음을 판별한다.",
  "decisiveStep": "-a/5 + 2 <= -b/5 + 2이어야 함을 식별하여 ① 선택",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질 종합"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PROPERTIES",
    "templateKey": "TPL_INEQUALITY_SIGN_REVERSAL_CHECK",
    "why": "부등식 양변에 음수를 곱하거나 나눌 때의 부등호 방향 변화를 대조하는 템플릿"
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
  "difficultyReason": "부등식 기본 성질 중 음수 나눗셈 부등호 방향을 대조하는 1단계 문항",
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

## Q18

- 형식: 객관식  
- 배점: 4

### 발문

집 앞 문구점에서는 볼펜 한 자루에 \$1{,}200\$원인데, 대형 할인점에서는 같은 볼펜이 한 자루에 \$800\$원이라고 한다. 대형 할인점에 다녀오려면 왕복 교통비가 \$2{,}400\$원이 들 때, 볼펜을 최소 몇 자루 이상 살 경우 대형 할인점에서 사는 것이 더 유리한지 구하면? \[4점\]

### 선지

① \$5\$자루 ② \$6\$자루 ③ \$7\$자루 ④ \$8\$자루 ⑤ \$9\$자루

### 정답

③

### 해설

볼펜을 \$x\$자루 산다고 하고 두 장소에서의 총비용을 비교하는 부등식을 세운다. 1단계: 총비용 식을 세운다.

- 집 앞 문구점 총비용: \$1200x\$ (원)  
- 대형 할인점 총비용: \$800x \+ 2400\$ (원) 2단계: 대형 할인점에서 사는 것이 더 유리해야 하므로 할인점의 비용이 더 적어야 한다. \$\$ 800x \+ 2400 \< 1200x \$\$ 3단계: 부등식을 푼다. \$\$ \\begin{aligned} 2400 &\< 1200x \- 800x \\ 2400 &\< 400x \\ 400x &\> 2400 \\ x &\> 6 \\end{aligned} \$\$ 4단계: \$x\$는 자연수이므로 \$x \> 6\$을 만족하는 최소의 자연수는 \$7\$이다. 따라서 최소 \$7\$자루 이상 사야 대형 할인점에서 사는 것이 더 유리하다. 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "교통비와 단가 차이를 이용한 구매처 가격 비교 일차부등식 활용 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "INEQUALITY_STORE_COMPARISON",
  "primaryMethod": "800x + 2400 < 1200x에서 400x > 2400, 즉 x > 6을 풀어 최소 자연수 7자루를 구한다.",
  "decisiveStep": "x > 6에서 엄격한 부등호(초과)로 최소 정수 7 도출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 활용",
    "l4": "유리한 방법을 선택하는 문제"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_APPLICATION_STORE_CHOICE",
    "templateKey": "TPL_TRANSPORT_COST_UNIT_PRICE_COMPARISON",
    "why": "교통비가 추가되는 저가 매장과 기본 매장의 총비용을 비교하여 최소 수량을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_LINEAR_MODELING"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "비용 부등식을 세우고 '더 유리하다(미만)'는 조건에서 다음 자연수를 결정하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "부등식",
      "자연수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "부등식",
      "이항",
      "연산"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q19

- 형식: 서술형  
- 배점: 5

### 발문

다음 조건을 만족시키는 \$x\$의 개수를 구하는 풀이 과정과 답을 쓰시오. \[5점\]

(가) \$x\$는 \$3\$의 배수이고 두 자리 자연수이다. (나) 분수 \$\\dfrac{x}{450}\$는 순환소수로 나타낼 수 있다.

### 선지

없음

### 정답

20

### 해설

분모의 소인수분해와 유한소수가 되지 않는 조건을 이용하여 개수를 구한다.

1단계: 분모 \$450\$을 소인수분해한다. \[1점\] \$\$ 450 \= 2 \\times 3^2 \\times 5^2 \$\$

2단계: 순환소수가 될 조건을 분석한다. \[2점\] 분수 \$\\dfrac{x}{450} \= \\dfrac{x}{2 \\times 3^2 \\times 5^2}\$가 순환소수로만 나타내어지려면, 기약분수로 나타내었을 때 분모에 소인수 \$3\$이 최소 하나 이상 남아 있어야 한다. 따라서 분자 \$x\$는 분모의 \$3^2 \= 9\$를 완전히 약분시킬 수 없어야 하므로, \$x\$는 \$9\$의 배수가 아니어야 한다.

3단계: 조건을 만족시키는 \$x\$의 개수를 구한다. \[2점\] 조건 (가)에 의해 \$x\$는 두 자리 자연수(\$10 \\le x \\le 99\$) 중 \$3\$의 배수이다.

- 두 자리 자연수 중 \$3\$의 배수의 개수: \$\$3 \\times 4 \= 12 \\le x \\le 99 \= 3 \\times 33 \\implies 33 \- 4 \+ 1 \= 30\\text{ (개)}\$\$  
- 이 중 \$9\$의 배수가 되면 유한소수가 되므로 제외해야 한다. 두 자리 자연수 중 \$9\$의 배수의 개수: \$\$9 \\times 2 \= 18 \\le x \\le 99 \= 9 \\times 11 \\implies 11 \- 2 \+ 1 \= 10\\text{ (개)}\$\$ 따라서 구하는 순환소수가 되는 \$x\$의 개수는 다음과 같다. \$\$ 30 \- 10 \= 20\\text{ (개)} \$\$

그러므로 정답은 20이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수 형성 조건(분모의 3 잔존)을 여사건(9의 배수 제외)으로 해결하는 서술형 문항"
}
```

```
{
  "sourceQid": 19,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_DIVISIBILITY_COUNT",
  "primaryMethod": "450=2*3^2*5^2에서 x가 9의 배수가 아니어야 함을 유도하고 두 자리 3의 배수(30개) - 9의 배수(10개) = 20개를 구한다.",
  "decisiveStep": "3의 배수 30개 중 9의 배수 10개를 차감하여 20개 산출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수가 되도록 하는 미지수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_DIGIT_COUNT",
    "templateKey": "TPL_COMPLEMENTARY_DIVISIBILITY_COUNT",
    "why": "특정 배수 집합에서 분모 소인수를 완전 소거하는 배수를 여사건으로 제외하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PRIME_FACTORIZATION",
    "CC_COMPLEMENT_COUNTING"
  ],
  "conditionKeys": [
    "COND_NATURAL",
    "COND_RANGE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소인수분해 분석 후 두 자리 배수 개수의 차(여사건)를 계산하여 서술하는 2단계 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "기약분수",
      "분수",
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "소인수분해",
      "배수",
      "사칙연산"
    ],
    "condition": [
      "소인수"
    ]
  },
  "hold": ""
}
```

## Q20

- 형식: 서술형  
- 배점: 5

### 발문

\$x\$의 값이 \$-3, \-2, \-1, 0, 1\$일 때, 부등식 \$x \- 2 \- n \< \-2\$를 참이 되게 하는 \$x\$의 값이 \$3\$개이다. 상수 \$n\$의 값의 범위를 구하시오. \[5점\]

### 선지

없음

### 정답

\$-1 \< n \\le 0\$

### 해설

부등식을 풀고 후보 값 중에서 해가 되는 원소의 조건을 분석한다.

1단계: 주어진 부등식을 \$x\$에 관하여 푼다. \[2점\] \$\$ x \- 2 \- n \< \-2 \$\$ 양변에 \$2\$를 더하면 \$\$ x \- n \< 0 \\implies x \< n \$\$

2단계: \$x\$의 후보 값 \${-3, \-2, \-1, 0, 1}\$ 중 \$x \< n\$을 만족시키는 값이 정확히 \$3\$개일 조건을 구한다. \[2점\] 후보 값을 작은 순서대로 나열하면 \$-3, \-2, \-1, 0, 1\$이다. \$x \< n\$을 만족시키는 값이 \$3\$개이려면, 작은 수부터 차례로 \$-3, \-2, \-1\$이 해에 포함되어야 하고, \$0\$과 \$1\$은 해에 포함되지 않아야 한다.

- \$-1\$이 해에 포함되어야 하므로: \$\$-1 \< n\$\$  
- \$0\$이 해에 포함되지 않아야 하므로: \$\$n \\le 0\$\$ (만약 \$n \= 0\$이면 \$x \< 0\$이 되어 \$-3, \-2, \-1\$만 포함되므로 성립한다.)

3단계: 두 부등식을 결합하여 \$n\$의 범위를 구한다. \[1점\] \$\$ \-1 \< n \\le 0 \$\$

따라서 상수 \$n\$의 값의 범위는 \$-1 \< n \\le 0\$이다.

```
{
  "status": "EXEMPT",
  "reason": "유한 정수 집합 내 해의 개수 제약으로부터 미지수 매개변수의 범위를 결정하는 서술형 문항"
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
  "conceptClusterKey": "INEQUALITY_COUNT_PARAM_RANGE",
  "primaryMethod": "x < n에서 작은 쪽 3개(-3, -2, -1)가 포함되고 0이 불포함되어야 하므로 -1 < n <= 0을 결정한다.",
  "decisiveStep": "경계점 -1 < n과 등호 조건 n <= 0의 정확한 결합",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "해가 주어진 일차부등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PARAM_RANGE_COUNT",
    "templateKey": "TPL_DISCRETE_SOLUTION_COUNT_BOUNDARY_RANGE",
    "why": "주어진 정수 집합에서 만족하는 원소의 개수를 만족하도록 부등식 경계 매개변수 범위를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_RANGE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수직선 상에서 경계값의 포함/배제에 따른 등호 성립 여부를 엄밀히 판정해야 하는 3단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "부등식",
      "정수"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "이항",
      "대소비교"
    ],
    "condition": [
      "개수"
    ]
  },
  "hold": ""
}
```

## Q21

- 형식: 서술형  
- 배점: 7

### 발문

어떤 자연수 \$x\$에 \$0.\\dot{3}\$을 곱해야 할 것을 잘못하여 \$0.3\$을 곱하였더니 정답과 오답의 차가 \$2\$가 되었다. 어떤 자연수 \$x\$를 구하는 풀이 과정과 답을 쓰시오. (단, 방정식 세우기 3점, 방정식 풀이 과정 3점, 답쓰기 1점) \[7점\]

### 선지

없음

### 정답

60

### 해설

순환소수와 유한소수를 분수로 변환하여 일차방정식을 세우고 푼다.

1단계: \[방정식 세우기\] (3점) 순환소수 \$0.\\dot{3}\$과 유한소수 \$0.3\$을 분수로 나타내면 다음과 같다. \$\$ 0.\\dot{3} \= \\frac{3}{9} \= \\frac{1}{3}, \\quad 0.3 \= \\frac{3}{10} \$\$ 바르게 계산한 결과는 \$\\dfrac{1}{3}x\$이고, 잘못 계산한 결과는 \$\\dfrac{3}{10}x\$이다. \$\\dfrac{1}{3} \> \\dfrac{3}{10}\$이므로 정답과 오답의 차가 \$2\$임을 방정식으로 세우면 \$\$ \\frac{1}{3}x \- \\frac{3}{10}x \= 2 \$\$

2단계: \[방정식 풀이 과정\] (3점) 좌변의 두 분수를 분모의 최소공배수인 \$30\$으로 통분하여 계산한다. \$\$ \\begin{aligned} \\left(\\frac{10}{30} \- \\frac{9}{30}\\right)x &= 2 \\ \\frac{1}{30}x &= 2 \\end{aligned} \$\$ 양변에 \$30\$을 곱한다. \$\$ x \= 2 \\times 30 \= 60 \$\$

3단계: \[답 쓰기\] (1점) 구한 \$x \= 60\$은 자연수이므로 문제의 조건에 부합한다. 따라서 어떤 자연수 \$x\$의 값은 \$60\$이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수와 유한소수 분수 변환 및 분수 일차방정식 3단계 표준 서술형 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_ERROR_EQUATION",
  "primaryMethod": "x/3 - 3x/10 = 2를 세워 x/30 = 2에서 x = 60을 단계별로 도출한다.",
  "decisiveStep": "1/3x - 3/10x = 1/30x = 2에서 양변에 30을 곱해 x = 60 도출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수의 사칙계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_APPLICATION_DIFF",
    "templateKey": "TPL_REPEATING_FINITE_DIFFERENCE_EQUATION",
    "why": "순환소수와 유한소수의 곱셈 오차를 일차방정식으로 모델링하여 미지수를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC",
    "CC_LINEAR_MODELING"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환소수를 분수로 바꾸고 분수 방정식 모델링 및 통분 풀이를 서술하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수",
      "소수",
      "자연수"
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

## Q22

- 형식: 서술형  
- 배점: 7

### 발문

어떤 식 \$A\$에서 \$2x^2 \- 3x \+ 4\$를 빼야 할 것을 잘못하여 더했더니 \$-3x^2 \+ x \+ 2\$가 되었다. 옳게 계산한 식을 구하는 풀이 과정과 답을 쓰시오. (단, 조건에 맞는 식 세우기 2점, 어떤 식 \$A\$를 구하는 과정 3점, 옳게 계산한 식을 구하는 과정 2점) \[7점\]

### 선지

없음

### 정답

\$-7x^2 \+ 7x \- 6\$

### 해설

잘못 계산한 식으로부터 어떤 식 \$A\$를 구한 후 원래 계산을 수행한다.

1단계: \[조건에 맞는 식 세우기\] (2점) 어떤 식 \$A\$에 \$2x^2 \- 3x \+ 4\$를 더한 결과가 \$-3x^2 \+ x \+ 2\$이므로 \$\$ A \+ (2x^2 \- 3x \+ 4\) \= \-3x^2 \+ x \+ 2 \$\$

2단계: \[어떤 식 \$A\$ 구하기\] (3점) 등식의 성질을 이용하여 \$A\$를 구한다. \$\$ \\begin{aligned} A &= (-3x^2 \+ x \+ 2\) \- (2x^2 \- 3x \+ 4\) \\ &= \-3x^2 \+ x \+ 2 \- 2x^2 \+ 3x \- 4 \\ &= (-3 \- 2)x^2 \+ (1 \+ 3)x \+ (2 \- 4\) \\ &= \-5x^2 \+ 4x \- 2 \\end{aligned} \$\$

3단계: \[옳게 계산한 식 구하기\] (2점) 원래 계산은 어떤 식 \$A\$에서 \$2x^2 \- 3x \+ 4\$를 빼는 것이므로 \$\$ \\begin{aligned} A \- (2x^2 \- 3x \+ 4\) &= (-5x^2 \+ 4x \- 2\) \- (2x^2 \- 3x \+ 4\) \\ &= \-5x^2 \+ 4x \- 2 \- 2x^2 \+ 3x \- 4 \\ &= (-5 \- 2)x^2 \+ (4 \+ 3)x \+ (-2 \- 4\) \\ &= \-7x^2 \+ 7x \- 6 \\end{aligned} \$\$

따라서 옳게 계산한 식은 \$-7x^2 \+ 7x \- 6\$이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식 덧셈·뺄셈 오계산 식 세우기, 원식 복원, 바른 식 산출 3단계 서술형 문항"
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
  "conceptClusterKey": "POLYNOMIAL_ADD_SUB_RESTORE_STEPWISE",
  "primaryMethod": "A = (-3x^2+x+2) - (2x^2-3x+4) = -5x^2+4x-2를 구하고 A - (2x^2-3x+4) = -7x^2+7x-6을 도출한다.",
  "decisiveStep": "원식 A = -5x^2+4x-2 복원 후 다시 뺄셈하여 -7x^2+7x-6 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식과 다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "바르게 계산한 식 구하기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_ERROR_RESTORE_STEPWISE",
    "templateKey": "TPL_POLYNOMIAL_ADD_SUB_RESTORE_EVAL",
    "why": "다항식 덧셈/뺄셈 오류 모델링으로부터 원래 식을 찾고 바른 식을 산출하는 서술형 템플릿"
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
  "difficultyReason": "괄호 부호 분배 2회와 동류항 계산을 단계별로 누락 없이 서술해야 하는 2단계 문항",
  "level": "중",
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

## Q23

- 형식: 서술형  
- 배점: 6

### 발문

일차부등식 \$2x \+ 3 \\ge \-x \- 6\$을 풀고, 그 해를 수직선 위에 나타내는 과정을 서술하시오. (단, 부등식의 해를 구하는 과정 3점, 해를 수직선 위에 바르게 나타내는 과정 3점) \[6점\]

### 선지

없음

### 정답

\$x \\ge \-3\$ (경계값 \$-3\$을 포함하여 오른쪽 방향)

### 해설

일차부등식을 이항하여 풀고 수직선 위에 해의 범위를 도식화하는 과정을 서술한다.

1단계: \[부등식 해 구하는 과정\] (3점) \$x\$를 포함하는 항을 좌변으로, 상수항을 우변으로 이항한다. \$\$ \\begin{aligned} 2x \+ x &\\ge \-6 \- 3 \\ 3x &\\ge \-9 \\end{aligned} \$\$ 양변을 양수 \$3\$으로 나눈다. 양수로 나눌 때는 부등호의 방향이 바뀌지 않는다. \$\$ x \\ge \-3 \$\$

2단계: \[해를 수직선 위에 나타내기\] (3점)

- 경계값 \$-3\$에 등호(\$\\ge\$)가 포함되어 있으므로 \$-3\$의 위치에 채워진 점(●)을 표시한다.  
- \$x\$가 \$-3\$보다 크거나 같으므로 \$-3\$에서 오른쪽 방향으로 선을 긋고 화살표를 표시한다.

따라서 부등식의 해는 \$x \\ge \-3\$이며, 수직선 위에 경계값 \$-3\$을 포함하여 오른쪽 방향의 화살표로 나타낸다.

```
{
  "status": "EXEMPT",
  "reason": "일차부등식 이항 풀이 및 수직선 폐구간 오른쪽 반직선 표현 서술형 문항"
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
  "conceptClusterKey": "INEQUALITY_SOLVE_AND_NUMBER_LINE_STEPWISE",
  "primaryMethod": "2x+x >= -6-3에서 3x >= -9, x >= -3을 풀고 경계값 -3 채운 점(●)과 오른쪽 화살표를 서술한다.",
  "decisiveStep": "3x >= -9에서 x >= -3 도출 및 수직선 닫힌 점/오른쪽 방향 명시",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "일차부등식의 풀이와 수직선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SOLVE_NUMBER_LINE",
    "templateKey": "TPL_LINEAR_INEQUALITY_SOLVE_GRAPH",
    "why": "일차부등식을 풀고 수직선 위에 닫힌 점과 방향을 작도하는 기본 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_ORDER_COMPARISON"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_SIGN"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 이항 정리와 수직선의 닫힌 점/방향 표현을 충실히 서술하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "해"
    ],
    "method": [
      "이항",
      "부등식",
      "대소비교"
    ],
    "condition": [
      "부등식"
    ]
  },
  "hold": ""
}
```

