

```
{
  "stem": "26_동산중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/26_동산중_1학기_중간_중2_기출.js",
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

다음 중 무한소수인 것은? \[3점\]

### 선지

① \$0.6\$ ② \$2.48\$ ③ \$5.125\$ ④ \$0.3434\$ ⑤ \$0.555\\cdots\$

### 정답

⑤

### 해설

소수점 아래의 \$0\$이 아닌 숫자가 끝없이 계속되는 소수를 무한소수라고 한다. 각 선지를 살펴보면 ① \$0.6\$ (유한소수) ② \$2.48\$ (유한소수) ③ \$5.125\$ (유한소수) ④ \$0.3434\$ (유한소수) ⑤ \$0.555\\cdots\$는 소수점 아래에서 \$5\$가 끝없이 반복되므로 무한소수이다. 따라서 무한소수인 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "유한소수와 무한소수의 기본 정의를 구분하는 선지 판별 문항"
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
  "conceptClusterKey": "FINITE_VS_INFINITE_DECIMAL",
  "primaryMethod": "소수점 아래 숫자의 자릿수가 유한한지 무한한지 판별하여 무한소수를 찾는다.",
  "decisiveStep": "0.555...가 소수점 아래 0이 아닌 숫자가 끝없이 계속되는 무한소수임을 식별한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_DECIMAL_CLASSIFICATION_BASIC",
    "templateKey": "TPL_FINITE_INFINITE_DECIMAL_IDENTIFICATION",
    "why": "유한소수와 무한소수를 판별하는 기본 개념 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소수의 표기를 보고 무한소수의 정의를 직접 대조하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "소수"
    ],
    "goal": [
      "순환소수"
    ],
    "method": [
      "대소비교"
    ],
    "condition": [
      "유리수"
    ]
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

㉠과 ㉡에 들어갈 것으로 알맞게 짝지어진 것은? \[4점\]

정수가 아닌 유리수는 나눗셈을 하여 소수로 나타낼 수 있다.

\$\\dfrac{5}{6} \= (\\quad\\text{㉠}\\quad) \= (\\quad\\text{㉡}\\quad)\$

### 선지

① ㉠: \$5 \\div 6\$, ㉡: \$0.8333\\cdots\$ ② ㉠: \$5 \\div 6\$, ㉡: \$1.2\$ ③ ㉠: \$5 \\div 6\$, ㉡: \$0.8383\\cdots\$ ④ ㉠: \$6 \\div 5\$, ㉡: \$0.8333\\cdots\$ ⑤ ㉠: \$6 \\div 5\$, ㉡: \$1.2\$

### 정답

①

### 해설

분수 \$\\frac{a}{b}\$는 분자 \$a\$를 분모 \$b\$로 나눈 것이므로 \$\$ \\frac{5}{6} \= 5 \\div 6 \$\$ 따라서 ㉠에 들어갈 나눗셈 식은 \$5 \\div 6\$이다. \$5\$를 \$6\$으로 나누어 소수로 나타내면 \$\$ 5 \\div 6 \= 0.8333\\cdots \$\$ 이므로 ㉡에 들어갈 소수는 \$0.8333\\cdots\$이다. 따라서 ㉠, ㉡에 알맞은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "분수를 나눗셈 식과 소수로 변환하는 기본 개념 연결 문항"
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
  "conceptClusterKey": "FRACTION_TO_DECIMAL_DIVISION",
  "primaryMethod": "분수를 분자 나누기 분모 형태로 바꾸고 실제 나눗셈을 수행하여 순환소수를 구한다.",
  "decisiveStep": "5/6 = 5 ÷ 6 = 0.8333...의 나눗셈 몫 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "분수를 소수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FRACTION_TO_DECIMAL_DIVISION",
    "templateKey": "TPL_FRACTION_DIVISION_MATCHING",
    "why": "분수의 나눗셈 표현과 소수 변환 결과를 연결하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수와 나눗셈의 관계 및 기본 나눗셈을 수행하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "분수",
      "유리수"
    ],
    "goal": [
      "소수"
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

## Q03

- 형식: 객관식  
- 배점: 3

### 발문

순환소수 \$0.353535\\cdots\$의 순환마디는? \[3점\]

### 선지

① \$3\$ ② \$5\$ ③ \$35\$ ④ \$53\$ ⑤ \$353\$

### 정답

③

### 해설

순환소수에서 소수점 아래의 어떤 자리에서부터 일정하게 되풀이되는 숫자의 배열을 순환마디라고 한다. 주어진 순환소수 \$0.353535\\cdots\$는 소수점 아래 첫째 자리부터 두 숫자 \$3, 5\$가 차례로 반복되므로 순환마디는 \$35\$이다. 따라서 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "순환소수의 순환마디를 식별하는 기본 개념 문항"
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
  "conceptClusterKey": "REPEATING_PERIOD_IDENTIFICATION",
  "primaryMethod": "소수점 아래에서 반복되는 최소 단위의 숫자 묶음을 찾아 순환마디로 결정한다.",
  "decisiveStep": "소수점 아래 반복 마디가 35임을 식별한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_PERIOD_BASIC",
    "templateKey": "TPL_REPEATING_PERIOD_EXTRACTION",
    "why": "순환소수의 전개식에서 순환마디를 추출하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환마디의 정의를 적용하여 반복되는 숫자를 바로 읽어내는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "대소비교"
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
- 배점: 3

### 발문

순환소수 \$0.8222\\cdots\$를 순환마디에 점을 찍어 간단히 나타낸 것으로 옳은 것은? \[3점\]

### 선지

① \$0.82\$ ② \$0.8\\dot{2}\$ ③ \$0.\\dot{8}2\\dot{2}\$ ④ \$0.\\dot{8}\\dot{2}\$ ⑤ \$0.822\$

### 정답

②

### 해설

순환소수 \$0.8222\\cdots\$에서 소수점 아래 첫째 자리의 숫자 \$8\$은 순환하지 않고, 둘째 자리부터 숫자 \$2\$가 계속 반복되므로 순환마디는 \$2\$이다. 순환마디를 이루는 숫자가 \$1\$개일 때는 그 숫자 위에 점을 \$1\$개 찍어 나타내므로 \$\$ 0.8222\\cdots \= 0.8\\dot{2} \$\$ 따라서 옳은 것은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "순환마디 기호 표기법의 정확성을 확인하는 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_NOTATION",
  "primaryMethod": "비순환 자리와 순환마디를 구분하여 순환마디의 숫자 위에 점을 올바르게 찍는다.",
  "decisiveStep": "순환마디가 2이므로 0.8(2) 꼴로 점을 찍는 것을 확인한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_NOTATION",
    "templateKey": "TPL_REPEATING_DOT_NOTATION",
    "why": "순환마디의 점 표기 규칙을 적용하는 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "비순환 자릿수와 순환마디에 점을 찍는 기본 표기법 적용 문항",
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

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

다음 분수 중 순환소수로만 나타낼 수 있는 것은? \[4점\]

### 선지

① \$\\dfrac{7}{20}\$ ② \$\\dfrac{33}{88}\$ ③ \$\\dfrac{21}{70}\$ ④ \$\\dfrac{3 \\times 5^2}{2 \\times 3 \\times 5}\$ ⑤ \$\\dfrac{3^2 \\times 5 \\times 13}{2^3 \\times 3 \\times 5 \\times 7}\$

### 정답

⑤

### 해설

기약분수로 나타내었을 때 분모의 소인수가 \$2\$ 또는 \$5\$뿐이면 유한소수이고, \$2\$와 \$5\$ 이외의 소인수가 있으면 순환소수가 된다. 각 선지를 기약분수로 나타내어 분모의 소인수를 확인하면 다음과 같다. ① \$\\frac{7}{20} \= \\frac{7}{2^2 \\times 5}\$ 분모의 소인수가 \$2\$와 \$5\$뿐이므로 유한소수이다. ② \$\\frac{33}{88} \= \\frac{3}{8} \= \\frac{3}{2^3}\$ 분모의 소인수가 \$2\$뿐이므로 유한소수이다. ③ \$\\frac{21}{70} \= \\frac{3}{10} \= \\frac{3}{2 \\times 5}\$ 분모의 소인수가 \$2\$와 \$5\$뿐이므로 유한소수이다. ④ \$\\frac{3 \\times 5^2}{2 \\times 3 \\times 5} \= \\frac{5}{2}\$ 분모의 소인수가 \$2\$뿐이므로 유한소수이다. ⑤ \$\\frac{3^2 \\times 5 \\times 13}{2^3 \\times 3 \\times 5 \\times 7} \= \\frac{3 \\times 13}{2^3 \\times 7} \= \\frac{39}{2^3 \\times 7}\$ 기약분수의 분모에 \$2\$와 \$5\$ 이외의 소인수 \$7\$이 있으므로 순환소수로만 나타낼 수 있다. 따라서 정답은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "약분 후 분모 소인수에 따른 유한소수와 순환소수 판별 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_PRIME_FACTOR",
  "primaryMethod": "분수를 기약분수로 약분한 뒤 분모의 소인수에 2, 5 이외의 소인수가 남는지 검토한다.",
  "decisiveStep": "⑤에서 약분 후 분모에 2^3·7이 남아 소인수 7로 인해 순환소수가 됨을 확인한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "분모의 소인수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_CONDITIONS",
    "templateKey": "TPL_FINITE_DECIMAL_PRIME_FACTORS",
    "why": "기약분수의 분모 소인수 조건으로 순환소수를 판별하는 유형"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "거듭제곱 분수의 약분 후 분모 소인수를 분석하여 순환소수를 판정하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "분수",
      "기약분수"
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

## Q06

- 형식: 객관식  
- 배점: 4.5

### 발문

순환소수 \$2.5\\dot{3}8\\dot{1}\$의 소수점 아래 첫 번째 자리의 숫자부터 25번째 자리의 숫자까지의 합은? \[4.5점\]

### 선지

① \$89\$ ② \$93\$ ③ \$97\$ ④ \$101\$ ⑤ \$105\$

### 정답

④

### 해설

순환소수 \$2.5\\dot{3}8\\dot{1} \= 2.5381381381\\cdots\$에서

- 소수점 아래 첫 번째 자리의 숫자는 순환하지 않는 숫자 \$5\$이다.  
- 소수점 아래 둘째 자리부터는 세 숫자 \$3, 8, 1\$이 순환마디를 이루어 반복된다. 소수점 아래 \$2\$번째 자리부터 \$25\$번째 자리까지의 숫자의 개수는 \$\$ 25 \- 1 \= 24\\text{ (개)} \$\$ 순환마디의 길이가 \$3\$이므로 \$24\$개의 숫자는 순환마디 \$(3, 8, 1)\$이 정확히 \$\$ 24 \\div 3 \= 8\\text{ (번)} \$\$ 반복된 것이다. 순환마디의 세 숫자의 합은 \$\$ 3 \+ 8 \+ 1 \= 12 \$\$ 이므로 \$24\$개의 순환하는 숫자의 합은 \$\$ 12 \\times 8 \= 96 \$\$ 여기에 소수점 아래 첫 번째 자리의 숫자 \$5\$를 더하면 \$\$ 5 \+ 96 \= 101 \$\$ 따라서 소수점 아래 첫 번째 자리부터 \$25\$번째 자리까지의 숫자의 합은 \$101\$이다. 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "순환마디의 주기성과 비순환 자릿수를 고려한 자릿수 합 계산 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_DIGIT_SUM",
  "primaryMethod": "비순환 첫째 자리 숫자를 분리하고 순환마디의 주기 횟수에 마디 합을 곱하여 총합을 구한다.",
  "decisiveStep": "순환마디 8회 반복 합 12*8=96에 첫째 자리 5를 더해 101을 도출한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "소수점 아래 n번째 자리의 숫자"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_DIGIT_SUM",
    "templateKey": "TPL_REPEATING_DECIMAL_PERIODIC_SUM",
    "why": "순환소수 자릿수의 주기적 합을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "비순환 자릿수 1개를 제외하고 주기의 배수를 곱한 후 첫째 자리를 더하는 2단계 계산 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수",
      "자연수"
    ],
    "goal": [
      "합"
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

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

다음은 순환소수 \$0.2\\dot{5}\\dot{4}\$를 분수로 나타내는 과정이다. ㉠\~㉤ 안에 들어갈 것으로 옳은 것은? \[4점\]

\$0.2\\dot{5}\\dot{4}\$를 \$x\$라고 하면

\$\$x \= 0.2545454\\cdots \\quad \\cdots \\text{(가)}\$\$

(가)의 양변에 \$\\boxed{\\text{㉠}}\$을 곱하면

\$\$\\boxed{\\text{㉠}}x \= 2.545454\\cdots \\quad \\cdots \\text{(나)}\$\$

(가)의 양변에 \$\\boxed{\\text{㉡}}\$을 곱하면

\$\$\\boxed{\\text{㉡}}x \= 254.545454\\cdots \\quad \\cdots \\text{(다)}\$\$

(다)에서 (나)를 변끼리 빼면

\$\$\\boxed{\\text{㉢}}x \= \\boxed{\\text{㉣}}, \\quad x \= \\boxed{\\text{㉤}}\$\$

### 선지

① ㉠: \$100\$ ② ㉡: \$100\$ ③ ㉢: \$900\$ ④ ㉣: \$254\$ ⑤ ㉤: \$\\dfrac{14}{55}\$

### 정답

⑤

### 해설

순환소수 \$x \= 0.2545454\\cdots\$에서 소수점 아래의 순환마디 시작점 앞까지 소수점을 옮기기 위해 (가)의 양변에 \$10\$을 곱하면 \$\$ 10x \= 2.545454\\cdots \\quad \\cdots \\text{(나)} \\implies \\text{㉠} \= 10 \$\$ 순환마디 끝점 뒤까지 소수점을 옮기기 위해 (가)의 양변에 \$1000\$을 곱하면 \$\$ 1000x \= 254.545454\\cdots \\quad \\cdots \\text{(다)} \\implies \\text{㉡} \= 1000 \$\$ (다)에서 (나)를 변끼리 빼면 소수점 아래 순환마디 부분이 소거되므로 \$\$ 1000x \- 10x \= 254 \- 2 \\implies 990x \= 252 \\implies \\text{㉢} \= 990, \\ \\text{㉣} \= 252 \$\$ 양변을 \$990\$으로 나누고 기약분수로 약분하면 \$\$ x \= \\frac{252}{990} \= \\frac{252 \\div 18}{990 \\div 18} \= \\frac{14}{55} \\implies \\text{㉤} \= \\frac{14}{55} \$\$ 따라서 선지 중 옳은 것은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "10의 거듭제곱을 이용한 순환소수의 분수 변환 과정 추론 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_TO_FRACTION_PROOF",
  "primaryMethod": "10의 거듭제곱을 곱해 순환부분을 일치시켜 뺀 뒤 기약분수를 도출한다.",
  "decisiveStep": "1000x - 10x = 252에서 x = 252/990 = 14/55가 됨을 확인한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_CONVERSION_PROOF",
    "templateKey": "TPL_REPEATING_DECIMAL_TO_FRACTION_STEPS",
    "why": "순환소수를 분수로 고치는 단계별 빈칸 추론 유형"
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
  "difficultyReason": "순환소수 분수화 원리(10^n 배수 뺄셈)와 기약분수 약분을 확인하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "분수",
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

## Q08

- 형식: 객관식  
- 배점: 3

### 발문

\$x^4 \\times y^3 \\times x^2 \\times y^5\$을 간단히 한 식으로 옳은 것은? \[3점\]

### 선지

① \$x^8 y^8\$ ② \$x^6 y^{15}\$ ③ \$x^8 y^{15}\$ ④ \$x^6 y^8\$ ⑤ \$xy^{14}\$

### 정답

④

### 해설

밑이 같은 거듭제곱끼리 모아 지수법칙 \$a^m \\times a^n \= a^{m+n}\$을 적용한다. \$\$ x^4 \\times y^3 \\times x^2 \\times y^5 \= (x^4 \\times x^2) \\times (y^3 \\times y^5) \$\$ 각각의 지수를 더하면 \$\$ x^{4+2} \\times y^{3+5} \= x^6 y^8 \$\$ 따라서 옳은 것은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식에서 밑이 같은 거듭제곱의 곱셈 지수법칙 기본 연산 문항"
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
  "conceptClusterKey": "EXPONENT_PRODUCT_RULE",
  "primaryMethod": "교환법칙으로 같은 밑끼리 모은 뒤 지수의 합 공식을 적용한다.",
  "decisiveStep": "x^(4+2) * y^(3+5) = x^6 y^8 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 곱·몫"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_PRODUCT",
    "templateKey": "TPL_EXPONENT_PRODUCT_BASIC",
    "why": "거듭제곱의 곱셈 지수법칙을 묻는 기본 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "밑이 같은 문자끼리 지수를 더하는 기본 지수법칙 1단계 문항",
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

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

\$\\left(\\dfrac{x^3}{2y^a}\\right)^b \= \\dfrac{x^c}{16y^{12}}\$일 때, 세 자연수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은? \[4점\]

### 선지

① \$15\$ ② \$17\$ ③ \$19\$ ④ \$21\$ ⑤ \$23\$

### 정답

③

### 해설

좌변에 지수법칙 \$\\left(\\frac{A}{B}\\right)^b \= \\frac{A^b}{B^b}\$와 \$(A^m)^n \= A^{mn}\$을 적용하면 \$\$ \\left(\\frac{x^3}{2y^a}\\right)^b \= \\frac{(x^3)^b}{2^b (y^a)^b} \= \\frac{x^{3b}}{2^b y^{ab}} \$\$ 이 식이 우변 \$\\frac{x^c}{16y^{12}}\$과 같아야 하므로 분모와 분자의 각 부분을 비교한다.

1) 분모의 상수 부분: \$\$ 2^b \= 16 \= 2^4 \\implies b \= 4 \$\$  
2) 분모의 \$y\$의 지수 부분: \$\$ ab \= 12 \\implies 4a \= 12 \\implies a \= 3 \$\$  
3) 분자의 \$x\$의 지수 부분: \$\$ 3b \= c \\implies c \= 3 \\times 4 \= 12 \$\$ 따라서 세 자연수 \$a, b, c\$의 합은 \$\$ a \+ b \+ c \= 3 \+ 4 \+ 12 \= 19 \$\$ 그러므로 정답은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "분수식 거듭제곱의 지수법칙을 적용하여 미정지수를 결정하는 문항"
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
  "conceptClusterKey": "EXPONENT_FRACTION_POWER",
  "primaryMethod": "분수 거듭제곱 공식을 전개한 뒤 밑과 지수의 계수를 비교하여 a, b, c를 차례로 구한다.",
  "decisiveStep": "2^b=16에서 b=4, ab=12에서 a=3, c=3b=12를 구하여 a+b+c=19를 산출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_POWER_UNKNOWN",
    "templateKey": "TPL_EXPONENT_EQUATION_COEFFICIENTS",
    "why": "거듭제곱의 거듭제곱 공식으로 미지수를 결정하는 유형"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SUM"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분모의 수 거듭제곱과 문자의 거듭제곱 지수법칙을 연립 비교하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "거듭제곱",
      "자연수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "지수법칙"
    ],
    "condition": [
      "등식"
    ]
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

\$24x^5y^6 \\div 6x^3y^2\$을 간단히 한 식으로 옳은 것은? \[4점\]

### 선지

① \$4x^2y^4\$ ② \$4x^8y^8\$ ③ \$18x^2y^4\$ ④ \$144x^2y^4\$ ⑤ \$4x^2y^3\$

### 정답

①

### 해설

단항식의 나눗셈에서 계수는 계수끼리 나누고, 문자는 지수법칙을 적용하여 지수를 뺀다. \$\$ 24x^5y^6 \\div 6x^3y^2 \= \\frac{24x^5y^6}{6x^3y^2} \$\$ 계수와 각 문자를 나누어 계산하면 \$\$ \\frac{24}{6} \\times x^{5-3} \\times y^{6-2} \= 4x^2y^4 \$\$ 따라서 옳은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "단항식의 나눗셈 계수 및 문자 지수 연산 기본 문항"
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
  "conceptClusterKey": "MONOMIAL_DIVISION_BASIC",
  "primaryMethod": "계수끼리의 나눗셈과 같은 문자끼리의 지수 뺄셈 법칙을 적용한다.",
  "decisiveStep": "24/6=4, x^(5-3)=x^2, y^(6-2)=y^4를 계산하여 4x^2y^4를 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "단항식의 나눗셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_MULTIPLICATION_DIVISION",
    "templateKey": "TPL_MONOMIAL_DIVISION_DIRECT",
    "why": "단항식의 나눗셈 결과를 직접 계산하는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_MONOMIAL_DIVISION"
  ],
  "conditionKeys": [],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "단항식 나눗셈의 지수 뺄셈과 계수 나눗셈을 직접 적용하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "단항식"
    ],
    "goal": [
      "단항식"
    ],
    "method": [
      "지수법칙"
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
- 배점: 3

### 발문

\$(4a \+ 3b) \+ (2a \+ 7b)\$를 계산한 식으로 옳은 것은? \[3점\]

### 선지

① \$6a \+ 21b\$ ② \$8a \+ 10b\$ ③ \$6a \+ 10b\$ ④ \$16ab\$ ⑤ \$8a \+ 21b\$

### 정답

③

### 해설

괄호를 풀고 동류항끼리 모아서 계수를 더한다. \$\$ (4a \+ 3b) \+ (2a \+ 7b) \= 4a \+ 3b \+ 2a \+ 7b \$\$ \$a\$를 포함하는 동류항과 \$b\$를 포함하는 동류항끼리 묶으면 \$\$ (4 \+ 2)a \+ (3 \+ 7)b \= 6a \+ 10b \$\$ 따라서 옳은 것은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식의 덧셈에서 동류항 정리 기본 연산 문항"
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
  "conceptClusterKey": "POLYNOMIAL_ADDITION_BASIC",
  "primaryMethod": "동류항끼리 묶어서 계수를 합산하여 식을 간단히 정리한다.",
  "decisiveStep": "(4+2)a + (3+7)b = 6a + 10b 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "동류항 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_ADDITION",
    "templateKey": "TPL_POLYNOMIAL_ADDITION_DIRECT",
    "why": "다항식의 덧셈과 동류항 정리를 다루는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_ADDITION"
  ],
  "conditionKeys": [],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "동류항의 계수를 더하는 다항식 연산의 가장 기본적인 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
      "동류항"
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

어떤 식에 \$2x^2 \- xy \+ 3y^2\$을 더해야 할 것을 잘못하여 뺐더니 \$x^2 \+ 4xy \- 5y^2\$이 되었다. 바르게 계산한 식은? \[4점\]

### 선지

① \$x^2 \+ 5xy \- 8y^2\$ ② \$3x^2 \+ 3xy \- 2y^2\$ ③ \$5x^2 \- 2xy \+ y^2\$ ④ \$4x^2 \+ 2xy \- y^2\$ ⑤ \$5x^2 \+ 2xy \+ y^2\$

### 정답

⑤

### 해설

어떤 식을 \$A\$라 하자. 잘못 계산한 식에서 \$2x^2 \- xy \+ 3y^2\$을 뺐으므로 \$\$ A \- (2x^2 \- xy \+ 3y^2) \= x^2 \+ 4xy \- 5y^2 \$\$ 어떤 식 \$A\$를 구하기 위해 \$(2x^2 \- xy \+ 3y^2)\$을 우변으로 이항하여 더하면 \$\$ A \= (x^2 \+ 4xy \- 5y^2) \+ (2x^2 \- xy \+ 3y^2) \= 3x^2 \+ 3xy \- 2y^2 \$\$ 이제 바르게 계산하려면 구한 어떤 식 \$A\$에 \$(2x^2 \- xy \+ 3y^2)\$을 더해야 하므로 \$\$ \\text{(바른 식)} \= A \+ (2x^2 \- xy \+ 3y^2) \$\$ \$\$ \= (3x^2 \+ 3xy \- 2y^2) \+ (2x^2 \- xy \+ 3y^2) \= 5x^2 \+ 2xy \+ y^2 \$\$ 따라서 바르게 계산한 식은 ⑤이다.

```
{
  "status": "EXEMPT",
  "reason": "잘못된 연산식에서 원래 식을 역산한 뒤 올바른 다항식 연산을 수행하는 문항"
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
  "conceptClusterKey": "WRONG_OPERATION_POLYNOMIAL_CORRECTION",
  "primaryMethod": "역연산으로 어떤 식을 복원한 후 원래 의도된 다항식 덧셈을 수행한다.",
  "decisiveStep": "A=3x^2+3xy-2y^2을 구한 후 다시 더하여 5x^2+2xy+y^2을 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "동류항 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION",
    "templateKey": "TPL_POLYNOMIAL_CORRECTION_TWO_STEP",
    "why": "잘못 계산한 다항식의 바른 계산을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_ERROR_CORRECTION",
    "CC_POLYNOMIAL_ADDITION"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "어떤 식 역산 후 재연산을 거치는 2단계 다항식 연산 문항",
  "level": "중하",
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

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

\$-\\dfrac{8a^2b \- 12ab^2}{4ab}\$를 계산한 식으로 옳은 것은? \[4점\]

### 선지

① \$-2a \+ 3b\$ ② \$-2a \- 3b\$ ③ \$2a \- 3b\$ ④ \$-2a \+ 12b\$ ⑤ \$-4ab\$

### 정답

①

### 해설

분수를 각 항별로 분리하여 나누고, 앞의 음수 부호를 분배한다. \$\$ \\frac{8a^2b \- 12ab^2}{4ab} \= \\frac{8a^2b}{4ab} \- \\frac{12ab^2}{4ab} \= 2a \- 3b \$\$ 식 앞에 음의 부호가 있으므로 괄호를 씌워 부호를 반대로 바꾸면 \$\$ \-\\left(\\frac{8a^2b \- 12ab^2}{4ab}\\right) \= \-(2a \- 3b) \= \-2a \+ 3b \$\$ 따라서 옳은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식을 단항식으로 나누고 부호를 처리하는 연산 문항"
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
  "conceptClusterKey": "POLYNOMIAL_DIVISION_SIGN",
  "primaryMethod": "다항식의 각 항을 단항식으로 나눈 뒤 식 앞의 음수 부호를 분배하여 정리한다.",
  "decisiveStep": "-(2a - 3b) = -2a + 3b의 부호 반전 처리",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "단항식과 다항식의 곱셈·나눗셈",
    "l4": "다항식을 단항식으로 나누기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_DIVISION_DIRECT",
    "templateKey": "TPL_POLYNOMIAL_DIVISION_EXPANSION",
    "why": "다항식을 단항식으로 나누는 계산 유형"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_DIVISION_BY_MONOMIAL"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수 나눗셈과 음수 부호 분배 처리를 정확히 수행해야 하는 문항",
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

## Q14

- 형식: 객관식  
- 배점: 5

### 발문

\$x \= \\dfrac{2}{3}\$, \$y \= \-\\dfrac{1}{11}\$일 때, 다음 식의 값은? \[5점\]

\$\$12xy(x-2) \- (8x^2y^2 \+ 6xy^2) \\div \\dfrac{2}{3}y\$\$

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

②

### 해설

주어진 식을 먼저 간단히 정리한 후 문자의 값을 대입한다. 첫 번째 항을 분배법칙으로 전개하면 \$\$ 12xy(x \- 2\) \= 12x^2y \- 24xy \$\$ 두 번째 항의 나눗셈을 역수의 곱셈으로 고쳐 계산하면 \$\$ (8x^2y^2 \+ 6xy^2) \\div \\frac{2}{3}y \= (8x^2y^2 \+ 6xy^2) \\times \\frac{3}{2y} \$\$ \$\$ \= 8x^2y^2 \\times \\frac{3}{2y} \+ 6xy^2 \\times \\frac{3}{2y} \= 12x^2y \+ 9xy \$\$ 이제 두 식을 빼면 \$\$ (12x^2y \- 24xy) \- (12x^2y \+ 9xy) \= 12x^2y \- 24xy \- 12x^2y \- 9xy \= \-33xy \$\$ 간단히 정리된 식 \$-33xy\$에 \$x \= \\frac{2}{3}\$, \$y \= \-\\frac{1}{11}\$을 대입하면 \$\$ \-33xy \= \-33 \\times \\frac{2}{3} \\times \\left(-\\frac{1}{11}\\right) \$\$ 음수끼리의 곱은 양수이고 약분하면 \$\$ \= \\left(-33 \\times \-\\frac{1}{11}\\right) \\times \\frac{2}{3} \= 3 \\times \\frac{2}{3} \= 2 \$\$ 따라서 구하는 식의 값은 \$2\$이다. 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "다항식과 단항식의 사칙 혼합 계산 후 분수 값을 대입하여 식의 값을 구하는 문항"
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
  "conceptClusterKey": "POLYNOMIAL_SIMPLIFICATION_VALUE",
  "primaryMethod": "식 전체를 전개 및 동류항 소거하여 단항식으로 단순화한 뒤 분수 값을 대입하여 계산한다.",
  "decisiveStep": "전개 결과 -33xy를 얻고 x=2/3, y=-1/11을 대입해 2를 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "식의 값과 활용",
    "l4": "식의 값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_EVALUATION",
    "templateKey": "TPL_SIMPLIFY_THEN_EVALUATE",
    "why": "다항식을 전개 정리한 후 식의 값을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SIMPLIFICATION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차항 소거를 포함한 복합 전개 후 분수 부호 곱셈을 침착하게 처리해야 하는 문항",
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
      "분배법칙",
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

## Q15

- 형식: 객관식  
- 배점: 3

### 발문

다음 문장을 부등식으로 나타낸 것으로 옳은 것은? \[3점\]

어떤 수 \$x\$의 \$2\$배에서 \$3\$을 뺀 값은 \$9\$보다 작다.

### 선지

① \$2x \- 3 \< 9\$ ② \$2x \- 3 \> 9\$ ③ \$2x \- 3 \\le 9\$ ④ \$2(x \- 3\) \< 9\$ ⑤ \$2(x \- 3\) \> 9\$

### 정답

①

### 해설

문장의 수량 관계를 차례대로 식으로 세운다.

- 어떤 수 \$x\$의 \$2\$배: \$2x\$  
- 거기서 \$3\$을 뺀 값: \$2x \- 3\$  
- '\$9\$보다 작다': \$\< 9\$ 따라서 주어진 문장을 부등식으로 나타내면 \$\$ 2x \- 3 \< 9 \$\$ 그러므로 옳은 것은 ①이다.

```
{
  "status": "EXEMPT",
  "reason": "일상 언어의 수량 관계를 일차부등식 기호로 번역하는 기본 문항"
}
```

```
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_TRANSLATION_BASIC",
  "primaryMethod": "문장의 어휘(작다, 뺀 값, 배)를 연산 기호와 부등호로 직관 번역한다.",
  "decisiveStep": "2x - 3 < 9의 식 구성",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_EXPRESSION_MODELING",
    "templateKey": "TPL_STATEMENT_TO_INEQUALITY",
    "why": "문장제를 부등식으로 나타내는 기본 템플릿"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "DIRECT",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등호의 방향과 연산 순서를 그대로 기호화하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "미지수"
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
- 배점: 4

### 발문

\$x \= 2\$를 해로 갖는 부등식은? \[4점\]

### 선지

① \$3x \- 1 \> 8\$ ② \$x \- 5 \\ge 0\$ ③ \$2x \+ 1 \\le 7\$ ④ \$-2x \+ 3 \> 1\$ ⑤ \$4 \- x \\le 1\$

### 정답

③

### 해설

부등식에 \$x \= 2\$를 대입하여 참이 되는 부등식을 찾는다. ① \$3(2) \- 1 \= 6 \- 1 \= 5 \\not\> 8\$ (거짓) ② \$2 \- 5 \= \-3 \\not\\ge 0\$ (거짓) ③ \$2(2) \+ 1 \= 4 \+ 1 \= 5 \\le 7\$ (참) ④ \$-2(2) \+ 3 \= \-4 \+ 3 \= \-1 \\not\> 1\$ (거짓) ⑤ \$4 \- 2 \= 2 \\not\\le 1\$ (거짓) 따라서 \$x \= 2\$를 해로 갖는 부등식은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "주어진 수치를 부등식에 대입하여 부등식의 참·거짓을 판별하는 문항"
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
  "conceptClusterKey": "INEQUALITY_SOLUTION_SUBSTITUTION",
  "primaryMethod": "x=2를 각 부등식에 대입하여 부등호가 성립하는 참인 식을 판별한다.",
  "decisiveStep": "2(2)+1 = 5 ≤ 7이 참임을 확인한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "기본형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_ROOT_VERIFICATION",
    "templateKey": "TPL_SUBSTITUTE_ROOT_INEQUALITY",
    "why": "특정 수가 부등식의 해가 되는지 대입 판정하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_SUBSTITUTION_IN_EQUATIONS"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "PARALLEL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수치를 대입하여 사칙계산 후 부등호 참 거짓을 확인하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식",
      "해"
    ],
    "goal": [
      "대소비교"
    ],
    "method": [
      "부등식의성질"
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
- 배점: 3

### 발문

\$a \< b\$일 때, 다음 중 옳지 않은 것은? \[3점\]

### 선지

① \$a \+ 4 \< b \+ 4\$ ② \$a \- 3 \< b \- 3\$ ③ \$5a \< 5b\$ ④ \$\\dfrac{a}{-3} \< \\dfrac{b}{-3}\$ ⑤ \$-2a \+ 5 \> \-2b \+ 5\$

### 정답

④

### 해설

부등식의 양변에 음수를 곱하거나 양변을 음수로 나누면 부등호의 방향이 반대로 바뀐다. ① \$a \< b\$의 양변에 \$4\$를 더하면 \$a \+ 4 \< b \+ 4\$ (참) ② \$a \< b\$의 양변에서 \$3\$을 빼면 \$a \- 3 \< b \- 3\$ (참) ③ \$a \< b\$의 양변에 양수 \$5\$를 곱하면 \$5a \< 5b\$ (참) ④ \$a \< b\$의 양변을 음수 \$-3\$으로 나누면 부등호의 방향이 바뀌어야 하므로 \$\$ \\frac{a}{-3} \> \\frac{b}{-3} \$\$ 이어야 한다. 따라서 ④는 옳지 않다. ⑤ \$a \< b\$의 양변에 음수 \$-2\$를 곱하면 \$-2a \> \-2b\$이고, 양변에 \$5\$를 더하면 \$-2a \+ 5 \> \-2b \+ 5\$ (참) 따라서 옳지 않은 것은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "음수로 나눌 때의 부등호 방향 역전 성질 판정 기본 문항"
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
  "conceptClusterKey": "INEQUALITY_PROPERTIES_BASIC",
  "primaryMethod": "부등식의 기본 성질 중 음수로 나눌 때 부등호 방향이 바뀌는 규칙을 점검한다.",
  "decisiveStep": "음수 -3으로 나눌 때 부등호 방향이 역전되어야 함을 식별한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE",
    "templateKey": "TPL_INEQUALITY_OPERATION_PROPERTIES",
    "why": "부등식의 양변 연산에 따른 부등호 방향 변화를 판정하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DIRECTION_OF_INEQUALITY"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식의 성질 중 음수 곱셈·나눗셈 시 부등호 역전 규칙을 묻는 1단계 문항",
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

다음 ㉠과 ㉡의 과정에서 사용된 부등식의 성질을 \<보기\>에서 골라 차례대로 나열한 것으로 옳은 것은? \[4점\]

\$\$\\begin{matrix} 2x \+ 7 \< 5x \- 2 \\\\ \\downarrow \\text{㉠} \\\\ 2x \- 5x \< \-2 \- 7 \\\\ \\\\ \-3x \< \-9 \\\\ \\downarrow \\text{㉡} \\\\ x \> 3 \\end{matrix}\$\$

**\<보기\>**

(가) 부등식의 양변에 같은 수를 더하거나 양변에서 같은 수를 빼어도 부등호의 방향은 바뀌지 않는다.

(나) 부등식의 양변에 같은 양수를 곱하거나 양변을 같은 양수로 나누어도 부등호의 방향은 바뀌지 않는다.

(다) 부등식의 양변에 같은 음수를 곱하거나 양변을 같은 음수로 나누면 부등호의 방향이 바뀐다.

### 선지

① (가), (나) ② (가), (다) ③ (나), (다) ④ (다), (가) ⑤ (다), (나)

### 정답

②

### 해설

부등식의 풀이 단계를 성질과 연결한다.

1) ㉠의 과정: \$2x \+ 7 \< 5x \- 2\$의 양변에서 \$5x\$를 빼고, 양변에서 \$7\$을 빼어 이항한 것이므로 '부등식의 양변에 같은 수를 더하거나 빼어도 부등호의 방향은 바뀌지 않는다'인 (가)를 사용하였다.  
2) ㉡의 과정: \$-3x \< \-9\$의 양변을 음수 \$-3\$으로 나누면서 부등호의 방향이 \$\<\$에서 \$\>\$로 바뀌었으므로 '부등식의 양변에 같은 음수를 곱하거나 양변을 같은 음수로 나누면 부등호의 방향이 바뀐다'인 (다)를 사용하였다. 따라서 ㉠, ㉡에 사용된 성질은 차례대로 (가), (다)이다. 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "일차부등식 이항 및 음수 나눗셈에 적용된 부등식 성질을 매칭하는 문항"
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
  "conceptClusterKey": "INEQUALITY_SOLVING_STEPS_PROPERTIES",
  "primaryMethod": "이항 연산에 쓰인 덧셈·뺄셈 성질과 계수 나눗셈에 쓰인 음수 나눗셈 성질을 구분한다.",
  "decisiveStep": "이항 단계가 (가), 음수 -3 나눗셈 단계가 (다)임을 매칭한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SOLVING_STEPS",
    "templateKey": "TPL_PROPERTY_TO_STEP_MAPPING",
    "why": "부등식 풀이 단계에 사용된 공리를 찾는 템플릿"
  },
  "crossConceptKeys": [
    "CC_INEQUALITY_PROPERTIES"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "풀이 과정의 이항과 음수 나눗셈에 각각 대응하는 부등식 성질을 정확히 식별하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "부등식의성질"
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

일차부등식 \$4x \+ 9 \\ge 7x \- 3\$의 해를 수직선 위에 바르게 나타낸 것은? \[4점\]

### 선지

① 수직선 위 \$x \= \-4\$에 칠해진 점(폐구간)에서 오른쪽으로 향하는 영역 ② 수직선 위 \$x \= \-4\$에 빈 동그라미(개구간)에서 왼쪽으로 향하는 영역 ③ 수직선 위 \$x \= 4\$에 칠해진 점(폐구간)에서 왼쪽으로 향하는 영역 ④ 수직선 위 \$x \= 4\$에 칠해진 점(폐구간)에서 오른쪽으로 향하는 영역 ⑤ 수직선 위 \$x \= 4\$에 빈 동그라미(개구간)에서 왼쪽으로 향하는 영역

### 정답

③

### 해설

일차부등식의 \$x\$항은 좌변으로, 상수항은 우변으로 이항하여 정리한다. \$\$ 4x \- 7x \\ge \-3 \- 9 \$\$ 동류항을 계산하면 \$\$ \-3x \\ge \-12 \$\$ 양변을 음수 \$-3\$으로 나누면 부등호의 방향이 반대로 바뀌므로 \$\$ x \\le 4 \$\$ 이 해를 수직선 위에 나타내면 경계값 \$4\$를 포함하므로 점 \$4\$에 색칠된 동그라미(●)를 하고, \$4\$보다 작거나 같으므로 왼쪽 방향으로 화살표를 그린다. 따라서 이를 바르게 설명한 것은 ③이다.

```
{
  "status": "EXEMPT",
  "reason": "일차부등식 풀이 후 수직선 상의 해의 영역과 경계점 포함 여부를 표현하는 문항"
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
  "conceptClusterKey": "INEQUALITY_NUMBER_LINE_REPRESENTATION",
  "primaryMethod": "일차부등식을 풀어 x ≤ 4를 얻은 후 수직선의 색칠된 경계점과 왼쪽 방향 영역을 찾는다.",
  "decisiveStep": "-3x ≥ -12로부터 x ≤ 4를 풀고 4 이하의 닫힌 왼쪽 영역을 도출한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "수직선으로 해 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SOLVING_GRAPH",
    "templateKey": "TPL_SOLVE_AND_GRAPH_NUMBER_LINE",
    "why": "일차부등식의 해를 구하고 수직선에 그래프로 나타내는 유형"
  },
  "crossConceptKeys": [
    "CC_NUMBER_LINE",
    "CC_LINEAR_INEQUALITIES"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식 음수 나눗셈 부등호 반전과 수직선 경계점 포함(등호)을 정확히 연계하는 문항",
  "level": "중하",
  "item4slot": {
    "given": [
      "일차부등식"
    ],
    "goal": [
      "수직선",
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

## Q20

- 형식: 객관식  
- 배점: 4.5

### 발문

일차부등식 \$\\dfrac{1}{5} \- \\dfrac{x}{2} \> \-0.4(x \+ 1)\$을 만족시키는 모든 자연수 \$x\$의 값의 합은? \[4.5점\]

### 선지

① \$10\$ ② \$15\$ ③ \$21\$ ④ \$28\$ ⑤ \$35\$

### 정답

②

### 해설

분수와 소수가 혼합된 일차부등식이므로 소수 \$-0.4\$를 분수 \$-\\frac{4}{10} \= \-\\frac{2}{5}\$로 생각하고 양변에 분모의 최소공배수 \$10\$을 곱한다. \$\$ 10 \\times \\left(\\frac{1}{5} \- \\frac{x}{2}\\right) \> 10 \\times {-0.4(x \+ 1)} \$\$ 좌변과 우변을 전개하면 \$\$ 2 \- 5x \> \-4(x \+ 1\) \\implies 2 \- 5x \> \-4x \- 4 \$\$ \$x\$항을 좌변으로, 상수항을 우변으로 이항하면 \$\$ \-5x \+ 4x \> \-4 \- 2 \\implies \-x \> \-6 \$\$ 양변에 \$-1\$을 곱하면 부등호의 방향이 반대로 바뀌므로 \$\$ x \< 6 \$\$ \$x \< 6\$을 만족시키는 자연수 \$x\$는 \$\$ 1, 2, 3, 4, 5 \$\$ 이다. 따라서 모든 자연수 \$x\$의 값의 합은 \$\$ 1 \+ 2 \+ 3 \+ 4 \+ 5 \= 15 \$\$ 그러므로 정답은 ②이다.

```
{
  "status": "EXEMPT",
  "reason": "분수와 소수가 포함된 복잡한 일차부등식을 풀고 자연수 해의 총합을 계산하는 문항"
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
  "conceptClusterKey": "COMPLEX_INEQUALITY_NATURAL_SUM",
  "primaryMethod": "양변에 10을 곱해 정수 계수로 바꾼 뒤 일차부등식을 풀고 해 범위 안의 자연수 합을 구한다.",
  "decisiveStep": "x < 6을 구한 뒤 자연수 1+2+3+4+5=15를 합산한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "괄호·분수·소수가 있는 부등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_LINEAR_INEQUALITY_NATURAL_ROOTS_SUM",
    "templateKey": "TPL_FRACTION_DECIMAL_INEQUALITY_NATURAL_SUM",
    "why": "분수·소수 계수 부등식을 풀고 자연수 해의 합을 구하는 유형"
  },
  "crossConceptKeys": [
    "CC_NATURAL_NUMBER_SUM"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수·소수 혼합 계수 정리와 괄호 분배, 음수 나눗셈 후 자연수 총합을 구하는 종합 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "일차부등식",
      "자연수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "이항",
      "부등식의성질"
    ],
    "condition": [
      "해"
    ]
  },
  "hold": ""
}
```

## Q21

- 형식: 객관식  
- 배점: 5

### 발문

다음 문제를 해결하기 위해 세운 일차부등식으로 옳은 것은? \[5점\]

원가가 \$12000\$원인 상품을 정가의 \$15\\,\\%\$를 할인하여 판매하여 원가의 \$20\\,\\%\$ 이상의 이익을 얻으려고 할 때, 정가를 \$x\$원이라 하자. 정가 \$x\$에 대한 부등식으로 옳은 것은?

### 선지

① \$12000 \- 0.85x \\ge 2400\$ ② \$12000 \- 0.85x \\le 2400\$ ③ \$0.85x \- 12000 \\le 2400\$ ④ \$0.85x \- 12000 \\ge 2400\$ ⑤ \$0.85x \+ 12000 \\ge 2400\$

### 정답

④

### 해설

원가, 정가, 판매 가격, 이익의 관계를 파악하여 부등식을 세운다.

- 정가가 \$x\$원이므로 정가의 \$15,%\$를 할인하여 판매한 가격은 \$\$ (\\text{판매 가격}) \= x \\times (1 \- 0.15) \= 0.85x\\text{ (원)} \$\$  
- 이익은 판매 가격에서 원가를 뺀 것이므로 \$\$ (\\text{이익}) \= (\\text{판매 가격}) \- (\\text{원가}) \= 0.85x \- 12000\\text{ (원)} \$\$  
- 원가의 \$20,%\$ 이상의 이익을 얻어야 하므로 목표 이익의 기준값은 \$\$ 12000 \\times \\frac{20}{100} \= 2400\\text{ (원)} \$\$ 따라서 구하는 일차부등식은 \$\$ 0.85x \- 12000 \\ge 2400 \$\$ 그러므로 정답은 ④이다.

```
{
  "status": "EXEMPT",
  "reason": "원가, 정가, 할인율, 이익률의 경제적 수량 관계를 일차부등식으로 모델링하는 문항"
}
```

```
{
  "sourceQid": 21,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2022",
  "standardUnitKey": "M2-02",
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "COST_PROFIT_INEQUALITY_MODELING",
  "primaryMethod": "판매 가격(0.85x)에서 원가를 뺀 순이익이 목표 이익 2400원 이상이라는 부등식을 구성한다.",
  "decisiveStep": "이익 식 0.85x - 12000 ≥ 2400을 도출한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식의 활용",
    "l3": "비율·가격·도형",
    "l4": "할인·이익"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_WORD_PROBLEM_PROFIT",
    "templateKey": "TPL_COST_PROFIT_MODELING",
    "why": "할인 판매 시 원가 대비 이익 보장을 위한 정가 부등식을 세우는 유형"
  },
  "crossConceptKeys": [
    "CC_APPLIED_WORD_PROBLEMS"
  ],
  "conditionKeys": [
    "COND_INEQUALITY_CONSTRAINT"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "할인가격 0.85x와 순이익(판매가-원가)의 경제 개념을 정확한 부등호로 표현하는 활용 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "미지수",
      "자연수"
    ],
    "goal": [
      "일차부등식"
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

## Q22

- 형식: 서답형  
- 배점: 6

### 발문

\[서답형 1\]

두 분수 \$\\dfrac{14}{60}\$와 \$\\dfrac{15}{78}\$에 같은 자연수 \$A\$를 각각 곱하여 모두 유한소수로 나타내려고 한다. \$A\$가 될 수 있는 수 중 두 번째로 작은 자연수를 구하는 풀이과정을 자세히 서술하시오. \[6점\]

### 정답

\$78\$

### 해설

1단계: 두 분수를 각각 기약분수로 나타내고 분모를 소인수분해한다. \$\$ \\frac{14}{60} \= \\frac{7}{30} \= \\frac{7}{2 \\times 3 \\times 5} \$\$ \$\$ \\frac{15}{78} \= \\frac{5}{26} \= \\frac{5}{2 \\times 13} \$\$

2단계: 각 분수가 유한소수가 되기 위한 자연수 \$A\$의 조건을 구한다.

- \$\\frac{7}{2 \\times 3 \\times 5} \\times A\$가 유한소수가 되려면 분모의 소인수 \$3\$이 약분되어야 하므로 \$A\$는 \$3\$의 배수이어야 한다. \[2점\]  
- \$\\frac{5}{2 \\times 13} \\times A\$가 유한소수가 되려면 분모의 소인수 \$13\$이 약분되어야 하므로 \$A\$는 \$13\$의 배수이어야 한다. \[2점\]

3단계: 두 분수를 모두 유한소수가 되게 하려면 \$A\$는 \$3\$과 \$13\$의 공배수이어야 한다. \$3\$과 \$13\$은 서로소이므로 최소공배수는 \$\$ 3 \\times 13 \= 39 \$\$ 따라서 \$A\$는 \$39\$의 배수이어야 하므로 \$A\$가 될 수 있는 자연수를 작은 수부터 차례로 나열하면 \$\$ 39, 78, 117, \\cdots \$\$ 이다. 따라서 두 번째로 작은 자연수 \$A\$의 값은 \$78\$이다. \[2점\]

```
{
  "status": "EXEMPT",
  "reason": "두 분수를 동시에 유한소수로 만들기 위한 최소공배수의 배수 역산 서술형 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "COMMON_FINITE_DECIMAL_MULTIPLIER",
  "primaryMethod": "두 분수를 기약분수로 만들어 각각의 분모 소인수를 제거하는 공배수 조건을 구한다.",
  "decisiveStep": "A가 3과 13의 공배수임을 찾아 최소공배수 39의 2배인 78을 계산한다.",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "분모의 소인수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_ESSAY_COMMON_MULTIPLIER_FINITE",
    "templateKey": "TPL_LCM_MULTIPLIER_FOR_TWO_FRACTIONS",
    "why": "두 분수를 유한소수로 만드는 최소공배수 배수를 서술하는 유형"
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
  "difficultyReason": "두 기약분수 분모의 소인수 분해와 최소공배수 배수 체계를 논리적으로 서술해야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "분수",
      "기약분수",
      "자연수"
    ],
    "goal": [
      "유한소수"
    ],
    "method": [
      "소인수분해",
      "배수"
    ],
    "condition": [
      "소인수"
    ]
  },
  "hold": ""
}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

\[서답형 2\]  
밑면의 반지름의 길이가 \$a\$, 높이가 \$3a \- 6b\$인 원기둥 모양의 그릇에 가득 들어 있는 물을 밑면의 반지름의 길이가 \$3a\$인 원뿔 모양의 그릇에 모두 부었더니 물이 넘치지 않고 가득 찼다. 다음 물음에 답하시오. (단, 그릇의 두께는 생각하지 않는다.) \[7점\]

(1) 원기둥의 부피를 구하는 과정을 서술하시오. \[3점\]

(2) (1)에서 구한 원기둥의 부피를 이용하여 원뿔의 높이를 구하는 과정을 서술하시오. \[4점\]

### 정답

(1) \$(3a^3 \- 6a^2b)\\pi\$ (또는 \$\\pi a^2(3a \- 6b)\$) (2) \$a \- 2b\$

### 해설

(1) 원기둥의 부피는 \$(\\text{밑넓이}) \\times (\\text{높이})\$이다. 밑면의 반지름의 길이가 \$a\$이므로 밑넓이는 \$\$ \\pi \\times a^2 \= \\pi a^2 \$\$ 높이가 \$3a \- 6b\$이므로 원기둥의 부피 \$V\$는 \$\$ V \= \\pi a^2 (3a \- 6b) \= (3a^3 \- 6a^2b)\\pi \$\$ 따라서 원기둥의 부피는 \$(3a^3 \- 6a^2b)\\pi\$이다. \[3점\]

(2) 원뿔의 높이를 \$h\$라 하자. 원뿔의 밑면의 반지름의 길이가 \$3a\$이므로 밑넓이는 \$\$ \\pi \\times (3a)^2 \= 9\\pi a^2 \$\$ 원뿔의 부피는 \$\\frac{1}{3} \\times (\\text{밑넓이}) \\times (\\text{높이})\$이므로 \$\$ \\frac{1}{3} \\times 9\\pi a^2 \\times h \= 3\\pi a^2 h \$\$ 원기둥의 물을 부어 원뿔에 가득 찼으므로 원기둥의 부피와 원뿔의 부피는 서로 같다. \$\$ 3\\pi a^2 h \= \\pi a^2 (3a \- 6b) \$\$ 양변을 \$3\\pi a^2\$으로 나누어 \$h\$를 구하면 \$\$ h \= \\frac{\\pi a^2 (3a \- 6b)}{3\\pi a^2} \= \\frac{3a \- 6b}{3} \= a \- 2b \$\$ 따라서 원뿔의 높이는 \$a \- 2b\$이다. \[4점\]

```
{
  "status": "EXEMPT",
  "reason": "원기둥 부피와 원뿔 부피의 등식을 이용한 식의 계산 및 높이 다항식 유도 문항"
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
  "conceptClusterKey": "GEOMETRIC_VOLUME_POLYNOMIAL_EQUATION",
  "primaryMethod": "원기둥 부피를 문자로 표현하고 원뿔 부피 공식과 같다는 등식을 세워 높이 h를 다항식 나눗셈으로 구한다.",
  "decisiveStep": "3πa^2 h = πa^2(3a-6b)로부터 h = a - 2b를 도출한다.",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "혼합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_ESSAY_CYLINDER_CONE_VOLUME",
    "templateKey": "TPL_VOLUME_CONSERVATION_ALGEBRAIC",
    "why": "입체도형의 부피 공식을 다항식 계산으로 연계하는 서술형 유형"
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
  "difficultyReason": "원뿔 부피 계수 1/3과 다항식을 단항식으로 나누는 계산을 단계별로 완전 서술해야 하는 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "원기둥",
      "원뿔",
      "반지름"
    ],
    "goal": [
      "부피",
      "높이"
    ],
    "method": [
      "방정식",
      "다항식의나눗셈"
    ],
    "condition": [
      "넓이"
    ]
  },
  "hold": ""
}
```

## Q24

- 형식: 서답형  
- 배점: 7

### 발문

\[서답형 3\]  
민우는 휴대전화에 저장된 사진을 인화하려고 한다. 같은 크기의 사진으로 인화하려고 할 때, 인터넷 사진관 \$\\text{A}\$와 \$\\text{B}\$의 가격표가 다음과 같다.

| 사진관 | 인화 가격(1장) | 배송비 |
| :---: | :---: | :---: |
| \$\\text{A}\$ | \$250\$원 | 무료 배송 |
| \$\\text{B}\$ | \$150\$원 | \$3000\$원 |

사진을 몇 장 이상 인화해야 인터넷 사진관 \$\\text{B}\$를 이용하는 것이 더 저렴한지 구하는 과정을 서술하시오. (단, 일차부등식을 세워서 해결해야 함.) \[7점\]

### 정답

\$31\$장 이상 (또는 \$31\$)

### 해설

1단계: 미지수를 정하고 각 사진관의 총 이용 금액을 세운다. 인화할 사진의 수를 \$x\$장 (\$x\$는 자연수)이라 하자.

- 사진관 \$\\text{A}\$를 이용할 때 드는 비용: \$250x\$ (원) \[1점\]  
- 사진관 \$\\text{B}\$를 이용할 때 드는 비용: \$150x \+ 3000\$ (원) \[1점\]

2단계: 문제의 조건에 맞게 일차부등식을 세운다. 사진관 \$\\text{B}\$를 이용하는 것이 더 저렴해야 하므로 \$\\text{B}\$의 비용이 \$\\text{A}\$의 비용보다 작아야 한다. \$\$ 150x \+ 3000 \< 250x \\quad \[2점\] \$\$

3단계: 일차부등식을 풀고 문제의 조건에 맞는 답을 구한다. \$150x\$를 우변으로 이항하면 \$\$ 3000 \< 250x \- 150x \\implies 100x \> 3000 \$\$ 양변을 \$100\$으로 나누면 \$\$ x \> 30 \\quad \[2점\] \$\$ \$x\$는 자연수이므로 \$x\$의 최솟값은 \$31\$이다. 따라서 사진을 \$31\$장 이상 인화해야 인터넷 사진관 \$\\text{B}\$를 이용하는 것이 더 저렴하다. \[1점\]

```
{
  "status": "EXEMPT",
  "reason": "단가 차이와 기본 배송비를 고려한 실생활 비용 비교 일차부등식 활용 서술형 문항"
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
  "conceptClusterKey": "SERVICE_COST_COMPARISON_INEQUALITY",
  "primaryMethod": "사진 장수 x에 대해 두 업체의 총비용 식을 세우고 B < A 부등식을 풀어 최소 자연수를 구한다.",
  "decisiveStep": "150x + 3000 < 250x로부터 x > 30을 얻고 최소 장수 31을 산출한다.",
  "rpm": {
    "majorUnit": "일차부등식",
    "midUnit": "일차부등식의 활용",
    "l3": "비율·가격·도형",
    "l4": "할인·이익"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_WORD_PROBLEM_SERVICE",
    "templateKey": "TPL_COST_COMPARISON_SERVICE_CHARGE",
    "why": "배송비가 포함된 두 옵션의 비용 비교 일차부등식 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_APPLIED_WORD_PROBLEMS"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미지수 설정, 비용식 및 부등식 구성, 해 풀이와 자연수 해석의 전 과정을 채점 기준에 맞춰 서술",
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

