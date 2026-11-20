```json:exam
{
  "stem": "24_문성중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/24_문성중_1학기_중간_중2_기출.js",
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
분수 $\dfrac{9}{2^{3}\times5}$을 유한소수로 나타내는 과정이다. 다음 빈칸을 채워 $A+B\times C$의 값을 구하면? [4점]


$$\dfrac{9}{2^{3}\times5}=\dfrac{A}{2^{3}\times5^{3}}=\dfrac{A}{B}=C$$
### 선지
① $450$ ② $225$ ③ $350$ ④ $525$ ⑤ $675$
### 정답
①
### 해설
분모를 $10$의 거듭제곱인 $10^3=1000$으로 만들기 위해 분모와 분자에 $5^2=25$를 곱한다.
$$
\frac{9}{2^3\times5}=\frac{9\times5^2}{2^3\times5\times5^2}=\frac{9\times25}{2^3\times5^3}=\frac{225}{1000}=0.225
$$
따라서 빈칸 $A, B, C$의 값은 각각 다음과 같다.
$$
A=225, \quad B=1000, \quad C=0.225
$$
구하는 식의 값을 계산한다.
$$
\begin{aligned}
A+B\times C &= 225 + 1000\times0.225 \\
&= 225 + 225 \\
&= 450
\end{aligned}
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "10의 거듭제곱 분모 확장을 통한 유한소수 변환 및 빈칸 대수 계산 문항"
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
  "conceptClusterKey": "FINITE_DECIMAL_POWERS_OF_TEN_FILL",
  "primaryMethod": "분모를 2^3*5^3=1000으로 만들기 위해 5^2=25를 곱해 A=225, B=1000, C=0.225를 구하고 225+225=450을 계산한다.",
  "decisiveStep": "A=225, B*C=225 도출 후 합 450 산출",
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
다음 분수 중에서 순환소수로만 나타낼 수 있는 것은? [3점]
### 선지
① $\dfrac{14}{70}$ ② $\dfrac{21}{2^{2}\times3^{2}\times5}$ ③ $\dfrac{27}{180}$ ④ $\dfrac{63}{2^{3}\times3^{2}\times7}$ ⑤ $\dfrac{45}{2\times3^{2}\times5^{2}}$
### 정답
②
### 해설
기약분수로 나타내었을 때 분모의 소인수에 $2$ 또는 $5$ 이외의 소인수가 있으면 순환소수이다.
$$
\begin{aligned}
\text{① } & \frac{14}{70} = \frac{1}{5} \implies \text{분모 소인수 } 5 \text{ (유한소수)} \\
\text{② } & \frac{21}{2^2\times3^2\times5} = \frac{3\times7}{2^2\times9\times5} = \frac{7}{2^2\times3\times5} \implies \text{분모에 소인수 } 3\text{이 남아 순환소수} \\
\text{③ } & \frac{27}{180} = \frac{3}{20} = \frac{3}{2^2\times5} \implies \text{분모 소인수 } 2, 5 \text{ (유한소수)} \\
\text{④ } & \frac{63}{2^3\times3^2\times7} = \frac{63}{2^3\times63} = \frac{1}{2^3} \implies \text{분모 소인수 } 2 \text{ (유한소수)} \\
\text{⑤ } & \frac{45}{2\times3^2\times5^2} = \frac{45}{2\times9\times25} = \frac{1}{2\times5} \implies \text{분모 소인수 } 2, 5 \text{ (유한소수)}
\end{aligned}
$$
따라서 순환소수로만 나타낼 수 있는 것은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "기약분수 분모 소인수 판정을 통한 순환소수 판별 기본 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_IDENTIFICATION",
  "primaryMethod": "기약분수로 약분 후 분모에 2, 5 이외의 소인수 3이 남는 분수를 선별한다.",
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
    "why": "약분을 거쳐 분모의 소인수를 확인하고 순환소수를 선별하는 템플릿"
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
  "difficultyReason": "약분 후 분모의 소인수를 판정하는 1단계 기본 문항",
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
두 수의 대소관계를 바르게 나타낸 것은? [3점]
### 선지
① $0.45 > 0.\dot{4}\dot{5}$ ② $3.2\dot{7} < 3.27$ ③ $0.62 > 0.\dot{6}$ ④ $0.345 < 0.3\dot{4}\dot{5}$ ⑤ $5.\dot{8}\dot{1} > 5.81\dot{8}$
### 정답
④
### 해설
순환소수를 소수 전개 꼴로 펼쳐서 소수점 아래 자릿수를 순서대로 비교한다.
$$
\begin{aligned}
\text{① } & 0.45 = 0.450000\dots, \quad 0.\dot{4}\dot{5} = 0.454545\dots \implies 0.45 < 0.\dot{4}\dot{5} \text{ (거짓)} \\
\text{② } & 3.2\dot{7} = 3.277777\dots, \quad 3.27 = 3.270000\dots \implies 3.2\dot{7} > 3.27 \text{ (거짓)} \\
\text{③ } & 0.62 = 0.620000\dots, \quad 0.\dot{6} = 0.666666\dots \implies 0.62 < 0.\dot{6} \text{ (거짓)} \\
\text{④ } & 0.345 = 0.345000\dots, \quad 0.3\dot{4}\dot{5} = 0.345454\dots \implies 0.345 < 0.3\dot{4}\dot{5} \text{ (참)} \\
\text{⑤ } & 5.\dot{8}\dot{1} = 5.818181\dots, \quad 5.81\dot{8} = 5.818888\dots \implies 5.\dot{8}\dot{1} < 5.81\dot{8} \text{ (거짓)}
\end{aligned}
$$
따라서 바르게 나타낸 것은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "순환소수 전개 자릿수 대조를 통한 대소비교 진위 판정 문항"
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
  "conceptClusterKey": "DECIMAL_EXPANSION_COMPARISON",
  "primaryMethod": "각 선지의 수를 소수점 아래 여러 자리까지 전개하여 자릿수별로 대소를 비교한다.",
  "decisiveStep": "소수 넷째 자리 비교(0 vs 4)를 통한 ④번 참 판정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "대소비교"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_DECIMAL_MAGNITUDE_COMPARE",
    "templateKey": "TPL_DECIMAL_EXPANSION_PAIR_COMPARE",
    "why": "순환소수의 순환마디 전개를 통한 소수 자릿수 대소 판정 템플릿"
  },
  "crossConceptKeys": [
    "CC_DECIMAL_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_DECIMAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자릿수별 숫자를 순서대로 대조하는 1단계 기본 문항",
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
분수 $\dfrac{29}{11}$를 소수로 나타내었을 때, 소수점 아래 45번째 자리의 숫자와 46번째 자리의 숫자의 곱은? [4점]
### 선지
① $9$ ② $12$ ③ $15$ ④ $16$ ⑤ $18$
### 정답
⑤
### 해설
분수 $\dfrac{29}{11}$를 나눗셈하여 소수로 나타낸다.
$$
\frac{29}{11} = 2.636363\dots = 2.\dot{6}\dot{3}
$$
순환마디는 $63$으로 숫자의 개수는 $2$개이다.
소수점 아래 $n$번째 자리의 숫자는 $n$을 순환마디의 길이 $2$로 나눈 나머지에 의해 결정된다.
$$
\begin{aligned}
45 &= 2 \times 22 + 1 \implies \text{나머지 } 1 \text{이므로 소수점 아래 45번째 자리의 숫자는 } 6 \\
46 &= 2 \times 23 + 0 \implies \text{나머지 } 0 \text{이므로 소수점 아래 46번째 자리의 숫자는 } 3
\end{aligned}
$$
따라서 두 숫자의 곱을 계산한다.
$$
6 \times 3 = 18
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "순환마디 주기성을 이용한 특정 자릿수 결정 및 곱셈 계산 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_NTH_DIGIT",
  "primaryMethod": "29/11 = 2.(6)(3)의 순환마디 63에서 45번째 자리 6과 46번째 자리 3의 곱 18을 계산한다.",
  "decisiveStep": "홀수 번째 6, 짝수 번째 3 파악 후 곱 18 도출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_DIGIT_CYCLE",
    "templateKey": "TPL_REPEATING_DECIMAL_NTH_DIGIT_ARITHMETIC",
    "why": "나머지 연산을 통해 순환소수의 특정 자릿수 값을 찾아 곱하는 템플릿"
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
  "difficultyReason": "순환마디의 주기를 찾아 자릿수 나머지를 적용하는 2단계 문항",
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


## Q05
- 형식: 객관식
- 배점: 5
### 발문
두 순환소수 $0.\dot{a}\dot{b}$와 $0.\dot{b}\dot{a}$의 합이 $0.\dot{7}$일 때, $0.\dot{a}-0.\dot{b}$의 값을 순환소수로 나타낸 것은? (단, $a, b$는 한 자리의 자연수이고 $a$와 $b$는 소수(prime number)이며, $a > b$이다.) [5점]
### 선지
① $0.\dot{1}$ ② $0.\dot{2}$ ③ $0.\dot{3}$ ④ $0.\dot{4}$ ⑤ $0.\dot{5}$
### 정답
③
### 해설
두 순환소수를 분수로 나타내어 합을 구한다.
$$
\begin{aligned}
0.\dot{a}\dot{b} &= \frac{10a+b}{99}, \quad 0.\dot{b}\dot{a} = \frac{10b+a}{99} \\
0.\dot{a}\dot{b} + 0.\dot{b}\dot{a} &= \frac{(10a+b) + (10b+a)}{99} = \frac{11(a+b)}{99} = \frac{a+b}{9}
\end{aligned}
$$
주어진 조건에서 두 순환소수의 합이 $0.\dot{7} = \dfrac{7}{9}$이므로
$$
\frac{a+b}{9} = \frac{7}{9} \implies a+b = 7
$$
$a, b$는 한 자리의 자연수이자 소수(prime number)이고 $a > b$이다.
한 자리의 소수는 $2, 3, 5, 7$이므로 두 소수의 합이 $7$이 되는 쌍은 다음과 같다.
$$
a = 5, \quad b = 2
$$
따라서 $0.\dot{a}-0.\dot{b}$의 값을 계산한다.
$$
\begin{aligned}
0.\dot{a}-0.\dot{b} &= 0.\dot{5} - 0.\dot{2} \\
&= \frac{5}{9} - \frac{2}{9} \\
&= \frac{3}{9} = \frac{1}{3} = 0.\dot{3}
\end{aligned}
$$
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "순환소수 분수 변환과 자릿수 방정식, 소수 조건 결합 고난도 추론 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_DIGIT_EQUATION",
  "primaryMethod": "(a+b)/9=7/9에서 a+b=7을 얻고, 소수 조건 a=5, b=2를 결정하여 0.(5)-0.(2)=0.(3)을 산출한다.",
  "decisiveStep": "a+b=7과 소수 조건에서 a=5, b=2 도출 후 차 0.(3) 계산",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_ALGEBRAIC_RELATION",
    "templateKey": "TPL_REPEATING_DECIMAL_SUM_DIFFERENCE_PRIME",
    "why": "순환소수 분수 변환 식을 연립하여 소수 정수 조건을 만족하는 미지수를 추론하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PRIME_NUMBER_PROPERTIES"
  ],
  "conditionKeys": [
    "COND_PRIME",
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "순환소수 대수식 정리와 정수론적 소수 조건을 동시에 만족시키는 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "순환소수",
      "소수"
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
      "자연수",
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
어떤 기약분수를 소수로 나타내는데, 민우는 분모를 잘못 보아 $0.41\dot{6}$으로 나타내고, 지호는 분자를 잘못 보아 $0.\dot{7}\dot{2}$로 나타내었다. 처음 기약분수를 소수로 바르게 나타낸 것은? [4점]
### 선지
① $0.\dot{4}\dot{5}$ ② $0.4\dot{5}$ ③ $0.\dot{5}\dot{4}$ ④ $0.\dot{4}$ ⑤ $0.45$
### 정답
①
### 해설
두 학생이 잘못 본 분수를 기약분수로 나타내어 바른 분자와 분모를 찾는다.
1단계: 민우가 얻은 순환소수를 기약분수로 변환한다.
$$
0.41\dot{6} = \frac{416-41}{900} = \frac{375}{900} = \frac{5}{12}
$$
민우는 분모를 잘못 보았으므로 원래 기약분수의 분자는 올바르게 보았다. 따라서 처음 기약분수의 분자는 $5$이다.


2단계: 지호가 얻은 순환소수를 기약분수로 변환한다.
$$
0.\dot{7}\dot{2} = \frac{72}{99} = \frac{8}{11}
$$
지호는 분자를 잘못 보았으므로 원래 기약분수의 분모는 올바르게 보았다. 따라서 처음 기약분수의 분모는 $11$이다.


3단계: 처음 기약분수를 구하고 소수로 나타낸다.
$$
\text{처음 기약분수} = \frac{5}{11}
$$
이를 소수로 나타내면
$$
\frac{5}{11} = 0.454545\dots = 0.\dot{4}\dot{5}
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "오류 관찰 역추적을 통한 기약분수 복원 및 순환소수 변환 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FRACTION_RECONSTRUCTION_FROM_REPEATING_DECIMAL",
  "primaryMethod": "0.41(6)=5/12에서 분자 5, 0.(72)=8/11에서 분모 11을 추출하여 5/11 = 0.(45)를 도출한다.",
  "decisiveStep": "바른 분자 5와 분모 11을 결합하여 5/11=0.(45) 산출",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "조건을 만족하는 유리수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_RECONSTRUCT_FRACTION",
    "templateKey": "TPL_MISTAKEN_REPEATING_DECIMAL_FRACTION_RECOVERY",
    "why": "잘못 본 분수 표현에서 올바른 분자와 분모를 분리 추출해 원래 기약분수를 복원하는 템플릿"
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
  "difficultyReason": "순환소수 분수 변환과 기약분수 역추적을 수행하는 2단계 문항",
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


## Q07
- 형식: 객관식
- 배점: 4
### 발문
다음 중에서 옳은 것만을 있는 대로 고른 것은? [4점]


ㄱ. 순환소수 중에는 유리수가 아닌 것도 있다.
ㄴ. 모든 유한소수는 분수로 나타낼 수 있다.
ㄷ. 기약분수의 분모를 소인수분해했을 때 2 또는 5 이외의 소인수가 있으면 순환소수로 나타내어진다.
ㄹ. 분수를 소수로 나타내었을 때 순환하지 않는 무한소수가 되는 것도 있다.
### 선지
① ㄱ, ㄴ ② ㄴ, ㄷ ③ ㄴ, ㄹ ④ ㄱ, ㄷ ⑤ ㄴ, ㄷ, ㄹ
### 정답
②
### 해설
유리수와 소수의 정의 및 분류 체계를 각 보기별로 확인한다.
$$
\begin{aligned}
\text{ㄱ: } & \text{모든 순환소수는 분수 } \frac{a}{b} \text{ (} a, b\text{는 정수, } b \ne 0\text{) 꼴로 나타낼 수 있으므로 항상 유리수이다. (거짓)} \\
\text{ㄴ: } & \text{모든 유한소수는 분모가 } 10\text{의 거듭제곱인 분수로 나타낼 수 있다. (참)} \\
\text{ㄷ: } & \text{기약분수의 분모에 } 2\text{ 또는 } 5 \text{ 이외의 소인수가 있으면 유한소수가 될 수 없으므로 무한소수(순환소수)가 된다. (참)} \\
\text{ㄹ: } & \text{분수는 유리수이므로 소수로 나타내면 항상 유한소수이거나 순환소수이다. 순환하지 않는 무한소수가 될 수 없다. (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ㄴ, ㄷ이므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "유리수와 유한소수, 순환소수 정의 및 분류 체계 진위 판정 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "RATIONAL_NUMBER_DECIMAL_THEORY_AUDIT",
  "primaryMethod": "소수 분류 체계에서 순환소수의 유리수성 및 기약분수의 소인수 성질을 대조하여 ㄴ, ㄷ을 판정한다.",
  "decisiveStep": "ㄱ(거짓), ㄴ(참), ㄷ(참), ㄹ(거짓) 판정 후 조합",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "분수를 소수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RATIONAL_DECIMAL_THEORY_CHECK",
    "templateKey": "TPL_RATIONAL_DECIMAL_TRUE_FALSE_SET",
    "why": "유리수와 순환소수의 정의와 분류 명제를 참/거짓으로 판별하는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_NUMBER_CLASSIFICATION"
  ],
  "conditionKeys": [
    "COND_RATIONAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수학적 정의와 반례를 검토하여 명제의 진위를 가리는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "유리수",
      "순환소수",
      "유한소수"
    ],
    "goal": [
      "유리수"
    ],
    "method": [
      "소인수분해"
    ],
    "condition": [
      "기약분수"
    ]
  },
  "hold": ""
}
```


## Q08
- 형식: 객관식
- 배점: 3
### 발문
$(2^{6})^{3} \div (2^{\Box})^{2} = 2^{10}$일 때, $\Box$ 안에 알맞은 수는? [3점]
### 선지
① $1$ ② $2$ ③ $3$ ④ $4$ ⑤ $5$
### 정답
④
### 해설
지수법칙을 이용하여 좌변의 식을 정리한다.
$$
\begin{aligned}
(2^6)^3 &= 2^{6 \times 3} = 2^{18} \\
(2^{\Box})^2 &= 2^{2 \times \Box}
\end{aligned}
$$
나눗셈 지수법칙에 의하여
$$
(2^6)^3 \div (2^{\Box})^2 = 2^{18 - 2\Box}
$$
우변이 $2^{10}$이므로 지수를 비교하면
$$
\begin{aligned}
18 - 2\Box &= 10 \\
2\Box &= 8 \\
\Box &= 4
\end{aligned}
$$
따라서 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "지수법칙 거듭제곱의 거듭제곱 및 나눗셈 기본 방정식 문항"
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
  "conceptClusterKey": "EXPONENT_LAW_POWER_AND_DIVISION",
  "primaryMethod": "2^(18-2x) = 2^10에서 18-2x=10, x=4를 푼다.",
  "decisiveStep": "지수 방정식 18-2x=10에서 x=4 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_LAW_EQUATION",
    "templateKey": "TPL_EXPONENT_DIVISION_VARIABLE_SOLVE",
    "why": "거듭제곱의 거듭제곱과 나눗셈 공식을 결합해 미지 지수를 구하는 템플릿"
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
  "difficultyReason": "지수법칙을 직접 적용하는 1단계 기본 일차방정식 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "지수법칙",
      "방정식"
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
$A = 2^{x-1}$일 때, $8^{x}$을 $A$에 관한 식으로 나타내면? [4점]
### 선지
① $2A^{3}$ ② $4A^{2}$ ③ $4A^{3}$ ④ $8A^{2}$ ⑤ $8A^{3}$
### 정답
⑤
### 해설
$A$와 $2^x$의 관계를 먼저 구한다.
$$
\begin{aligned}
A &= 2^{x-1} = \frac{2^x}{2} \\
2^x &= 2A
\end{aligned}
$$
$8^x$을 밑이 $2$인 거듭제곱으로 변형한다.
$$
\begin{aligned}
8^x &= (2^3)^x = (2^x)^3
\end{aligned}
$$
여기에 $2^x = 2A$를 대입한다.
$$
\begin{aligned}
(2^x)^3 &= (2A)^3 \\
&= 2^3 \times A^3 \\
&= 8A^3
\end{aligned}
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "지수 표현식의 치환 및 거듭제곱 변형 대수 문항"
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
  "conceptClusterKey": "EXPONENT_BASE_CONVERSION_AND_SUBSTITUTION",
  "primaryMethod": "2^x = 2A를 도출하고 8^x = (2^x)^3 = (2A)^3 = 8A^3을 전개한다.",
  "decisiveStep": "2^x = 2A 대입 및 (2A)^3 = 8A^3 전개",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_SUBSTITUTION",
    "templateKey": "TPL_EXPONENT_BASE_CHANGE_REPRESENTATION",
    "why": "밑을 통일하여 지수 표현식을 치환 문자로 나타내는 템플릿"
  },
  "crossConceptKeys": [
    "CC_ALGEBRAIC_SUBSTITUTION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "치환식을 세우고 밑의 거듭제곱을 변형하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "지수법칙",
      "대입"
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
$2^{n+3} + 2^{n+2} + 2^{n+1} = 224$일 때, 자연수 $n$의 값은? [5점]
### 선지
① $2$ ② $3$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
③
### 해설
좌변의 공통인수 $2^n$을 묶어 식을 정리한다.
$$
\begin{aligned}
2^{n+3} + 2^{n+2} + 2^{n+1} &= 2^n \times 2^3 + 2^n \times 2^2 + 2^n \times 2^1 \\
&= 2^n \times (8 + 4 + 2) \\
&= 2^n \times 14
\end{aligned}
$$
이 식이 $224$와 같으므로
$$
\begin{aligned}
2^n \times 14 &= 224 \\
2^n &= \frac{224}{14} = 16
\end{aligned}
$$
$16 = 2^4$이므로 지수를 비교하면
$$
n = 4
$$
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "거듭제곱 덧셈에서 공통인수 묶기를 통한 지수방정식 해결 문항"
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
  "conceptClusterKey": "EXPONENT_SUM_FACTORING",
  "primaryMethod": "2^n*(8+4+2) = 14*2^n = 224로부터 2^n = 16, n=4를 구한다.",
  "decisiveStep": "공통인수 2^n 묶기 후 2^n = 16 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 곱·몫"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_SUM_EQUATION",
    "templateKey": "TPL_EXPONENT_FACTOR_OUT_SUM_SOLVE",
    "why": "거듭제곱의 합을 분배법칙으로 묶어 단항 거듭제곱 방정식으로 전환하는 템플릿"
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
  "difficultyReason": "거듭제곱의 합을 묶어내는 대수적 조작이 필요한 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "지수법칙",
      "인수분해"
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
$(x^{3}y^{2})^{4} \times (x^{5}y^{3})^{2} = x^{a}y^{b}$일 때, $a+b$의 값은? [4점]
### 선지
① $36$ ② $32$ ③ $28$ ④ $24$ ⑤ $20$
### 정답
①
### 해설
지수법칙을 적용하여 거듭제곱을 먼저 전개한다.
$$
\begin{aligned}
(x^3 y^2)^4 &= (x^3)^4 \times (y^2)^4 = x^{12} y^8 \\
(x^5 y^3)^2 &= (x^5)^2 \times (y^3)^2 = x^{10} y^6
\end{aligned}
$$
두 식의 곱을 계산한다.
$$
\begin{aligned}
x^{12} y^8 \times x^{10} y^6 &= x^{12+10} y^{8+6} \\
&= x^{22} y^{14}
\end{aligned}
$$
우변 $x^a y^b$와 비교하면
$$
a = 22, \quad b = 14
$$
따라서 $a+b$의 값을 계산한다.
$$
a + b = 22 + 14 = 36
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식 거듭제곱과 곱셈 지수법칙의 순차적 적용 및 합산 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_POWER_AND_PRODUCT",
  "primaryMethod": "(x^3 y^2)^4 = x^12 y^8과 (x^5 y^3)^2 = x^10 y^6의 곱 x^22 y^14에서 a+b=36을 산출한다.",
  "decisiveStep": "a=22, b=14 도출 후 합 36 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_EXPONENT_PRODUCT",
    "templateKey": "TPL_MONOMIAL_POWER_PRODUCT_COEFFICIENT_SUM",
    "why": "단항식의 거듭제곱과 곱셈 법칙을 적용해 지수의 합을 구하는 템플릿"
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
  "difficultyReason": "지수법칙의 곱셈과 거듭제곱 공식을 차례로 계산하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "단항식"
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
      "거듭제곱"
    ]
  },
  "hold": ""
}
```


## Q12
- 형식: 객관식
- 배점: 5
### 발문
네 자연수 $a, b, c, d$에 대하여 $(x^{a}y^{b}z^{c})^{d} = x^{36}y^{48}z^{60}$이 성립할 때, $a+b+c$의 최솟값은? [5점]
### 선지
① $10$ ② $12$ ③ $14$ ④ $24$ ⑤ $36$
### 정답
②
### 해설
좌변을 지수법칙으로 전개하여 우변과 비교한다.
$$
(x^a y^b z^c)^d = x^{ad} y^{bd} z^{cd} = x^{36} y^{48} z^{60}
$$
따라서 다음 세 식이 성립한다.
$$
ad = 36, \quad bd = 48, \quad cd = 60
$$
$a, b, c, d$는 자연수이므로 $d$는 $36, 48, 60$의 공약수이다.
$a+b+c$의 값을 나타내면
$$
a+b+c = \frac{36}{d} + \frac{48}{d} + \frac{60}{d} = \frac{36+48+60}{d} = \frac{144}{d}
$$
$a+b+c$가 최솟값을 가지려면 분모 $d$가 최대이어야 하므로, $d$는 $36, 48, 60$의 최대공약수이다.
$$
\begin{aligned}
36 &= 2^2 \times 3^2 \\
48 &= 2^4 \times 3 \\
60 &= 2^2 \times 3 \times 5 \\
\gcd(36, 48, 60) &= 2^2 \times 3 = 12
\end{aligned}
$$
따라서 $d$의 최댓값은 $12$이다.
이때 $a, b, c$의 값을 구하면
$$
a = \frac{36}{12} = 3, \quad b = \frac{48}{12} = 4, \quad c = \frac{60}{12} = 5
$$
따라서 $a+b+c$의 최솟값은
$$
a + b + c = 3 + 4 + 5 = 12
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "지수법칙과 최대공약수를 연계하여 식의 최솟값을 추론하는 융합 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "EXPONENT_GCD_EXTREMA",
  "primaryMethod": "ad=36, bd=48, cd=60에서 d=gcd(36,48,60)=12일 때 a+b+c가 최소가 되므로 3+4+5=12를 구한다.",
  "decisiveStep": "최대공약수 d=12 산출 및 a+b+c=12 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_GCD_OPTIMIZATION",
    "templateKey": "TPL_EXPONENT_COMMON_FACTOR_MINIMUM",
    "why": "공약수 성질을 이용해 다중 지수 거듭제곱의 계수 합 최솟값을 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_GCD_LCM"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "지수법칙과 최대공약수 개념을 연계하여 최적해를 도출하는 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "최솟값",
      "자연수"
    ],
    "method": [
      "지수법칙",
      "최대공약수",
      "약수"
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
$(-2x^{2}y)^{3} \times (xy^{3})^{2} \div \left(-\dfrac{2}{3}x^{5}y^{4}\right)$을 계산하면? [4점]
### 선지
① $-12x^{3}y^{5}$ ② $-6x^{3}y^{5}$ ③ $6x^{3}y^{5}$ ④ $12x^{3}y^{5}$ ⑤ $18x^{3}y^{5}$
### 정답
④
### 해설
단항식의 거듭제곱을 먼저 계산한다.
$$
\begin{aligned}
(-2x^2 y)^3 &= (-2)^3 \times (x^2)^3 \times y^3 = -8x^6 y^3 \\
(xy^3)^2 &= x^2 \times (y^3)^2 = x^2 y^6
\end{aligned}
$$
나눗셈은 역수를 곱하는 곱셈으로 바꾼다.
$$
\div \left(-\frac{2}{3}x^5 y^4\right) = \times \left(-\frac{3}{2x^5 y^4}\right)
$$
전체 식을 곱셈으로 결합하여 계수와 문자를 정리한다.
$$
\begin{aligned}
& (-8x^6 y^3) \times (x^2 y^6) \times \left(-\frac{3}{2x^5 y^4}\right) \\
&= \left[(-8) \times 1 \times \left(-\frac{3}{2}\right)\right] \times \frac{x^{6+2} y^{3+6}}{x^5 y^4} \\
&= 12 \times \frac{x^8 y^9}{x^5 y^4} \\
&= 12 x^{8-5} y^{9-4} \\
&= 12 x^3 y^5
\end{aligned}
$$
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식 거듭제곱, 곱셈, 나눗셈 역수 처리 혼합 계산 기본 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_ARITHMETIC_MIXED",
  "primaryMethod": "거듭제곱 전개 후 역수 곱셈으로 전환하여 계수 12와 문자 x^3 y^5를 정확히 정리한다.",
  "decisiveStep": "계수 12와 지수 x^3 y^5 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "혼합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_MIXED_OPERATION",
    "templateKey": "TPL_MONOMIAL_POWER_MULT_DIV_SIMPLIFY",
    "why": "단항식의 거듭제곱과 곱셈, 나눗셈이 혼합된 식을 정리하는 템플릿"
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
  "difficultyReason": "부호 처리와 분수 역수 계산을 정확히 수행하는 2단계 문항",
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


## Q14
- 형식: 객관식
- 배점: 4
### 발문
밑면의 가로의 길이가 $3a^{2}b$, 세로의 길이가 $2ab^{2}$이고 부피가 $24a^{5}b^{5}$인 직육면체의 높이는? [4점]
### 선지
① $2ab^{2}$ ② $2a^{2}b^{2}$ ③ $4ab^{2}$ ④ $4a^{2}b$ ⑤ $4a^{2}b^{2}$
### 정답
⑤
### 해설
직육면체의 부피 공식은 다음과 같다.
$$
\text{부피} = \text{밑넓이} \times \text{높이}
$$
밑면의 넓이를 계산한다.
$$
\begin{aligned}
\text{밑넓이} &= (3a^2 b) \times (2ab^2) \\
&= (3 \times 2) \times (a^2 \times a) \times (b \times b^2) \\
&= 6a^3 b^3
\end{aligned}
$$
따라서 직육면체의 높이는 부피를 밑넓이로 나눈 값이다.
$$
\begin{aligned}
\text{높이} &= \frac{24a^5 b^5}{6a^3 b^3} \\
&= \frac{24}{6} \times a^{5-3} \times b^{5-3} \\
&= 4a^2 b^2
\end{aligned}
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "직육면체 부피 공식을 활용한 단항식의 나눗셈 기하 응용 문항"
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
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_GEOMETRY_VOLUME",
  "primaryMethod": "밑넓이 6a^3 b^3을 구하고 부피 24a^5 b^5를 나누어 높이 4a^2 b^2를 산출한다.",
  "decisiveStep": "24a^5 b^5 / 6a^3 b^3 = 4a^2 b^2 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "단항식의 나눗셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_GEOMETRIC_APPLICATION",
    "templateKey": "TPL_CUBOID_HEIGHT_FROM_VOLUME_MONOMIAL",
    "why": "직육면체의 가로, 세로, 부피가 단항식으로 주어졌을 때 높이를 구하는 템플릿"
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
  "difficultyReason": "도형 공식과 단항식 나눗셈을 결합하여 해결하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "직육면체",
      "부피",
      "단항식"
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


## Q15
- 형식: 객관식
- 배점: 4
### 발문
$2^{17} \times 5^{14}$이 $n$자리 자연수일 때, $n$의 값은? [4점]
### 선지
① $13$ ② $14$ ③ $15$ ④ $16$ ⑤ $17$
### 정답
③
### 해설
$10$의 거듭제곱인 $10 = 2 \times 5$의 성질을 이용하기 위해 지수를 일치시킨다.
$$
\begin{aligned}
2^{17} \times 5^{14} &= 2^{3+14} \times 5^{14} \\
&= 2^3 \times (2^{14} \times 5^{14}) \\
&= 8 \times (2 \times 5)^{14} \\
&= 8 \times 10^{14}
\end{aligned}
$$
$8 \times 10^{14}$은 숫자 $8$ 뒤에 $0$이 $14$개 붙는 수이다.
따라서 자릿수 $n$은
$$
n = 1 + 14 = 15
$$
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "2와 5의 소인수 결합을 통한 10의 거듭제곱 밑 변환 및 자릿수 결정 문항"
}
```
```json:meta
{
  "sourceQid": 15,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "NUMBER_OF_DIGITS_POWERS_OF_TEN",
  "primaryMethod": "2^17 * 5^14 = 8 * 10^14로 변형하여 8 뒤에 0이 14개 붙는 15자리 수임을 산출한다.",
  "decisiveStep": "8 * 10^14 변형 후 1+14=15자리 확정",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 곱·몫"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_DIGIT_COUNT",
    "templateKey": "TPL_POWERS_OF_TWO_FIVE_DIGIT_COUNT",
    "why": "2와 5의 거듭제곱 곱을 10의 거듭제곱 꼴로 바꾸어 자릿수를 구하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DECIMAL_PLACE_VALUE"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "지수를 분리하여 10의 거듭제곱으로 묶어 자릿수를 계산하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "지수법칙",
      "자릿수"
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
$3x-2y+4$에 어떤 식 $A$를 더해야 할 것을 잘못하여 빼었더니 $7x-5y-1$이 되었다. 바르게 계산한 답은? [4점]
### 선지
① $-x+y+9$ ② $-x+y+5$ ③ $-4x+3y+5$ ④ $-x-y+9$ ⑤ $7x-5y+9$
### 정답
①
### 해설
잘못 계산한 식으로부터 어떤 식 $A$를 구한다.
$$
(3x-2y+4) - A = 7x-5y-1
$$
양변을 이항하여 $A$에 대하여 정리한다.
$$
\begin{aligned}
A &= (3x-2y+4) - (7x-5y-1) \\
&= 3x - 2y + 4 - 7x + 5y + 1 \\
&= -4x + 3y + 5
\end{aligned}
$$
바르게 계산한 식은 원래의 식에 $A$를 더한 값이므로 대입하여 계산한다.
$$
\begin{aligned}
(3x-2y+4) + A &= (3x-2y+4) + (-4x+3y+5) \\
&= (3-4)x + (-2+3)y + (4+5) \\
&= -x + y + 9
\end{aligned}
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "다항식 연산 오류 역추적을 통한 다항식 복원 및 올바른 연산 결과 산출 문항"
}
```
```json:meta
{
  "sourceQid": 16,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_ERROR_RECOVERY_ARITHMETIC",
  "primaryMethod": "(3x-2y+4)-A = 7x-5y-1에서 A=-4x+3y+5를 구하고, (3x-2y+4)+A = -x+y+9를 계산한다.",
  "decisiveStep": "A=-4x+3y+5 도출 후 바른 합 -x+y+9 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "식의 값과 활용",
    "l4": "조건식 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_MISTAKE_CORRECTION",
    "templateKey": "TPL_POLYNOMIAL_WRONG_OPERATION_RECOVER",
    "why": "덧셈 대신 뺄셈을 한 식에서 미지 다항식을 찾아 올바른 연산을 수행하는 템플릿"
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
  "difficultyReason": "다항식의 뺄셈 이항과 덧셈 결합을 단계별로 수행하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "다항식"
    ],
    "method": [
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


## Q17
- 형식: 객관식
- 배점: 4
### 발문
$(6x^{2}-3x^{3}) \div \dfrac{1}{3}x + \left(\dfrac{3}{4}x^{3}-\dfrac{9}{4}x^{4}\right) \div \left(-\dfrac{3}{4}x^{2}\right)$을 계산하였을 때, $x^2$의 계수를 $a$, $x$의 계수를 $b$라 하자. 이때 $b-a$의 값은? [4점]
### 선지
① $11$ ② $23$ ③ $29$ ④ $-11$ ⑤ $-23$
### 정답
②
### 해설
두 나눗셈 식을 각각 전개하여 계산한다.
1단계: 첫 번째 식을 계산한다.
$$
\begin{aligned}
(6x^2 - 3x^3) \div \frac{1}{3}x &= (6x^2 - 3x^3) \times \frac{3}{x} \\
&= 6x^2 \times \frac{3}{x} - 3x^3 \times \frac{3}{x} \\
&= 18x - 9x^2
\end{aligned}
$$


2단계: 두 번째 식을 계산한다.
$$
\begin{aligned}
\left(\frac{3}{4}x^3 - \frac{9}{4}x^4\right) \div \left(-\frac{3}{4}x^2\right) &= \left(\frac{3}{4}x^3 - \frac{9}{4}x^4\right) \times \left(-\frac{4}{3x^2}\right) \\
&= \frac{3}{4}x^3 \times \left(-\frac{4}{3x^2}\right) - \frac{9}{4}x^4 \times \left(-\frac{4}{3x^2}\right) \\
&= -x + 3x^2
\end{aligned}
$$


3단계: 두 결과의 합을 동류항끼리 정리한다.
$$
\begin{aligned}
(18x - 9x^2) + (-x + 3x^2) &= (-9+3)x^2 + (18-1)x \\
&= -6x^2 + 17x
\end{aligned}
$$
따라서 $x^2$의 계수 $a$와 $x$의 계수 $b$는 다음과 같다.
$$
a = -6, \quad b = 17
$$
구하는 식 $b-a$의 값을 계산한다.
$$
b - a = 17 - (-6) = 17 + 6 = 23
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "다항식을 단항식으로 나누는 분배법칙 및 동류항 계수 차 계산 문항"
}
```
```json:meta
{
  "sourceQid": 17,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_MONOMIAL_DIVISION_EXPANSION",
  "primaryMethod": "각 괄호를 역수 곱셈으로 전개하여 -6x^2 + 17x를 얻고, b-a = 17-(-6)=23을 산출한다.",
  "decisiveStep": "전개식 -6x^2 + 17x 도출 및 b-a = 23 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "단항식과 다항식의 곱셈·나눗셈",
    "l4": "다항식을 단항식으로 나누기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_DIVISION_COEFFICIENT_DIFF",
    "templateKey": "TPL_POLYNOMIAL_MONOMIAL_DIV_COEFF_EVAL",
    "why": "다항식을 단항식으로 나누는 복합식을 계산해 특정 차수의 계수를 결합하는 템플릿"
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
  "difficultyReason": "분수 계수 나눗셈의 부호와 지수 처리를 정확히 수행하는 2단계 문항",
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


## Q18
- 형식: 객관식
- 배점: 3
### 발문
다음 부등식 중에서 $x=2$를 해로 갖는 것은? [3점]
### 선지
① $3x-1 > 7$ ② $2x \le 5-x$ ③ $4-3x \ge 0$ ④ $5x-4 < 3x+3$ ⑤ $1-2x > x$
### 정답
④
### 해설
$x=2$를 각 부등식에 대입하여 부등식이 참이 되는지 확인한다.
$$
\begin{aligned}
\text{① } & 3(2) - 1 = 5 > 7 \text{ (거짓)} \\
\text{② } & 2(2) = 4 \le 5 - 2 = 3 \text{ (거짓)} \\
\text{③ } & 4 - 3(2) = -2 \ge 0 \text{ (거짓)} \\
\text{④ } & 5(2) - 4 = 6 < 3(2) + 3 = 9 \text{ (참)} \\
\text{⑤ } & 1 - 2(2) = -3 > 2 \text{ (거짓)}
\end{aligned}
$$
따라서 $x=2$를 해로 갖는 부등식은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "부등식의 해 정의 확인을 위한 대입 판정 기본 문항"
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
  "conceptClusterKey": "INEQUALITY_SOLUTION_TEST",
  "primaryMethod": "x=2를 선지 ④에 대입하여 6 < 9가 참임을 확인하고 오답 선지를 판정한다.",
  "decisiveStep": "x=2 대입 시 6 < 9 성립 판정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "기본형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SOLUTION_CHECK",
    "templateKey": "TPL_INEQUALITY_VALUE_MEMBERSHIP_TEST",
    "why": "주어진 수의 부등식 해 여부를 대입하여 판별하는 기본 템플릿"
  },
  "crossConceptKeys": [
    "CC_INEQUALITY_BASIC"
  ],
  "conditionKeys": [
    "COND_INEQUALITY"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식의 해의 정의를 대입으로 판정하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식",
      "해"
    ],
    "goal": [
      "일차부등식"
    ],
    "method": [
      "대입",
      "연산"
    ],
    "condition": [
      "부등식"
    ]
  },
  "hold": ""
}
```


## Q19
- 형식: 객관식
- 배점: 4
### 발문
$a+2 \le b+2$일 때, $\Box$ 안에 들어갈 부등호의 방향이 나머지 넷과 다른 하나는? [4점]
### 선지
① $a-5 \;\Box\; b-5$ ② $3a+1 \;\Box\; 3b+1$ ③ $\dfrac{a}{2}-4 \;\Box\; \dfrac{b}{2}-4$ ④ $a-(-3) \;\Box\; b-(-3)$ ⑤ $7-2a \;\Box\; 7-2b$
### 정답
⑤
### 해설
$a+2 \le b+2$의 양변에서 $2$를 빼면
$$
a \le b
$$
부등식의 양변에 같은 수를 더하거나 빼도, 양수를 곱하거나 나누어도 부등호의 방향은 바뀌지 않는다.
그러나 음수를 곱하거나 나누면 부등호의 방향이 바뀐다.
$$
\begin{aligned}
\text{① } & a \le b \implies a-5 \le b-5 \quad (\le) \\
\text{② } & a \le b \implies 3a+1 \le 3b+1 \quad (\le) \\
\text{③ } & a \le b \implies \frac{a}{2}-4 \le \frac{b}{2}-4 \quad (\le) \\
\text{④ } & a \le b \implies a-(-3) \le b-(-3) \quad (\le) \\
\text{⑤ } & a \le b \text{의 양변에 } -2\text{를 곱하면 } -2a \ge -2b, \text{ 양변에 } 7\text{을 더하면 } 7-2a \ge 7-2b \quad (\ge)
\end{aligned}
$$
따라서 부등호의 방향이 나머지 넷과 다른 것은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "부등식의 기본 성질(음수 곱셈 시 방향 전환) 대조 문항"
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
  "conceptClusterKey": "INEQUALITY_PROPERTIES_TRANSFORMATION",
  "primaryMethod": "음수 -2를 곱하여 부등호 방향이 반대로 바뀌는 선지 ⑤를 선별한다.",
  "decisiveStep": "음수 계수 -2에 따른 부등호 방향 전환 확인",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PROPERTY_DIRECTION",
    "templateKey": "TPL_INEQUALITY_TRANSFORM_DIRECTION_AUDIT",
    "why": "부등식의 양변 조작에 따른 부등호 방향 보존 및 반전 성질을 판정하는 템플릿"
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
  "difficultyReason": "부등식의 기본 성질을 선지별로 점검하는 1단계 기본 문항",
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


## Q20
- 형식: 객관식
- 배점: 5
### 발문
$-7 \le x \le 3$일 때, $\dfrac{1}{2} + ax$의 최댓값이 $4$, 최솟값이 $b$이다. $a < 0$일 때, 상수 $a, b$에 대하여 $a-b$의 값은? [5점]
### 선지
① $-\dfrac{3}{2}$ ② $-\dfrac{1}{2}$ ③ $\dfrac{1}{2}$ ④ $\dfrac{3}{2}$ ⑤ $\dfrac{5}{2}$
### 정답
③
### 해설
$a < 0$이므로 부등식 $-7 \le x \le 3$의 각 변에 음수 $a$를 곱하면 부등호의 방향이 바뀐다.
$$
-7 \le x \le 3 \implies 3a \le ax \le -7a
$$
각 변에 $\dfrac{1}{2}$을 더하면
$$
\frac{1}{2} + 3a \le \frac{1}{2} + ax \le \frac{1}{2} - 7a
$$
따라서 $\dfrac{1}{2} + ax$의 최댓값은 $\dfrac{1}{2} - 7a$이고, 최솟값은 $\dfrac{1}{2} + 3a$이다.


1단계: 최댓값 조건을 이용하여 $a$를 구한다.
$$
\begin{aligned}
\frac{1}{2} - 7a &= 4 \\
-7a &= 4 - \frac{1}{2} = \frac{7}{2} \\
a &= -\frac{1}{2}
\end{aligned}
$$
$a = -\frac{1}{2} < 0$이므로 주어진 조건 $a < 0$을 만족한다.


2단계: 최솟값 $b$를 구한다.
$$
\begin{aligned}
b &= \frac{1}{2} + 3a \\
&= \frac{1}{2} + 3\left(-\frac{1}{2}\right) \\
&= \frac{1}{2} - \frac{3}{2} = -1
\end{aligned}
$$


3단계: $a-b$의 값을 계산한다.
$$
\begin{aligned}
a - b &= -\frac{1}{2} - (-1) \\
&= -\frac{1}{2} + 1 \\
&= \frac{1}{2}
\end{aligned}
$$
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "음수 계수가 곱해진 일차식의 범위 변환 및 최대/최소 연립 방정식 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_LINEAR_RANGE_EXTREMA",
  "primaryMethod": "a<0일 때 x=-7에서 최댓값 4를 적용해 a=-1/2를 얻고, x=3에서 최솟값 b=-1을 구해 a-b=1/2를 계산한다.",
  "decisiveStep": "a=-1/2, b=-1 도출 후 a-b=1/2 산출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "해의 조건",
    "l4": "계수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_COEFFICIENT_CONDITION",
    "templateKey": "TPL_LINEAR_EXPRESSION_BOUND_OPTIMIZATION",
    "why": "변수의 제한 범위와 음수 계수 조건에서 일차식의 최댓값과 최솟값을 매칭하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_INEQUALITY_RANGE_OPERATION"
  ],
  "conditionKeys": [
    "COND_NEGATIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등호 방향 반전과 구간 양 끝값의 대입 해석이 필요한 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "부등식",
      "최댓값",
      "최솟값"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "부등식의성질",
      "사칙연산",
      "연산"
    ],
    "condition": [
      "음수"
    ]
  },
  "hold": ""
}
```


## Q21
- 형식: 서술형
- 배점: 7
### 발문
[서술형 1번] 순환소수 $1.8\dot{6}$에 자연수 $A$를 곱하면 자연수가 된다. 다음 물음에 답하시오. [7점]


(1) 순환소수를 $x$로 놓고 기약분수로 나타내는 과정을 서술하시오. [4점]
(2) $A$의 값 중 가장 작은 세 자리의 자연수를 구하시오. [3점]
### 정답
(1) $\dfrac{28}{15}$, (2) $105$
### 해설
(1) 순환소수 $1.8\dot{6}$을 $x$라 하면
$$
x = 1.8666\dots
$$
소수점 아래 순환마디의 자릿수를 맞추기 위해 양변에 $100$과 $10$을 각각 곱한다.
$$
\begin{aligned}
100x &= 186.666\dots \\
10x &= 18.666\dots
\end{aligned}
$$
변끼리 빼면 소수점 아래 순환마디 부분이 소거된다.
$$
\begin{aligned}
100x - 10x &= 186.666\dots - 18.666\dots \\
90x &= 168 \\
x &= \frac{168}{90} = \frac{28}{15}
\end{aligned}
$$
따라서 구하는 기약분수는 $\dfrac{28}{15}$이다.


(2) $x \times A = \dfrac{28}{15} \times A$가 자연수가 되어야 한다.
$28$과 $15$는 서로소이므로, 분모 $15$가 약분되어 소거되려면 $A$는 $15$의 배수이어야 한다.
$15$의 배수를 작은 수부터 나열하면
$$
15, \quad 30, \quad 45, \quad 60, \quad 75, \quad 90, \quad 105, \quad 120, \quad \dots
$$
이 중 가장 작은 세 자리의 자연수는 $105$이다.
따라서 구하는 $A$의 값은 $105$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "순환소수의 분수 변환 단계별 서술 및 분모 소거 자연수 조건 심화 문항"
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
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_FRACTION_MULTIPLE_CONDITION",
  "primaryMethod": "100x-10x=168로부터 x=28/15를 도출하고, 15의 배수 중 최소 세 자리 자연수 105를 구한다.",
  "decisiveStep": "기약분수 28/15 변환 및 15의 최소 3자리 배수 105 확정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "조건을 만족하는 유리수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_TO_NATURAL_PRODUCT",
    "templateKey": "TPL_REPEATING_FRACTION_MULTIPLIER_DIGIT_BOUND",
    "why": "순환소수를 기약분수로 나타내고 자연수가 되도록 하는 최소 자릿수 배수를 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_MULTIPLE_DIVISOR"
  ],
  "conditionKeys": [
    "COND_NATURAL",
    "COND_IRREDUCIBLE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "방정식을 통한 분수 변환 서술과 약수/배수 조건을 결합하는 2단계 서술형 문항",
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
      "배수"
    ],
    "condition": [
      "자연수",
      "기약분수"
    ]
  },
  "hold": ""
}
```


## Q22
- 형식: 서술형
- 배점: 6
### 발문
[서술형 2번] $\left(\dfrac{2x^{3}}{y^{a}}\right)^{b} = \dfrac{8x^{c}}{y^{12}}$일 때, 상수 $a, b, c$에 대하여 $a+b-c$의 값을 구하는 과정을 서술하시오. [6점]
### 정답
$-2$
### 해설
좌변을 지수법칙을 이용하여 전개한다.
$$
\left(\frac{2x^3}{y^a}\right)^b = \frac{2^b \times (x^3)^b}{(y^a)^b} = \frac{2^b x^{3b}}{y^{ab}}
$$
우변 $\dfrac{8x^c}{y^{12}}$과 계수 및 각 문자의 지수를 비교한다.


1단계: 분자의 계수를 비교한다.
$$
2^b = 8 = 2^3 \implies b = 3
$$


2단계: 분자의 $x$의 지수를 비교한다.
$$
3b = c \implies c = 3 \times 3 = 9
$$


3단계: 분모의 $y$의 지수를 비교한다.
$$
ab = 12 \implies a \times 3 = 12 \implies a = 4
$$


4단계: $a+b-c$의 값을 계산한다.
$$
\begin{aligned}
a + b - c &= 4 + 3 - 9 \\
&= 7 - 9 \\
&= -2
\end{aligned}
$$
따라서 구하는 값은 $-2$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식 분수 거듭제곱 지수법칙 전개 및 계수/지수 비교 서술형 문항"
}
```
```json:meta
{
  "sourceQid": 22,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-EXPONENT_LAW",
  "conceptClusterKey": "MONOMIAL_FRACTION_POWER_COMPARISON",
  "primaryMethod": "2^b=8에서 b=3, 3b=c에서 c=9, ab=12에서 a=4를 구하여 a+b-c = 4+3-9 = -2를 산출한다.",
  "decisiveStep": "b=3, c=9, a=4 도출 후 a+b-c = -2 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_EXPONENT_COMPARE_EQUATION",
    "templateKey": "TPL_MONOMIAL_QUOTIENT_POWER_COEFFICIENT_MATCH",
    "why": "분수 꼴 단항식의 거듭제곱을 전개해 각 항의 지수를 연립으로 비교하는 서술형 템플릿"
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
  "difficultyReason": "계수와 문자의 지수를 체계적으로 대응시키는 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "단항식",
      "거듭제곱"
    ],
    "goal": [
      "정수"
    ],
    "method": [
      "지수법칙",
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
[서술형 3번] $-3 \le x \le 5$일 때, $a \le 4 - \dfrac{1}{2}x \le b$이다. 이때 $4ab$의 값을 구하는 과정을 서술하시오. [7점]
### 정답
$33$
### 해설
주어진 부등식 $-3 \le x \le 5$로부터 $4 - \dfrac{1}{2}x$의 범위를 단계별로 구한다.


1단계: 각 변에 $-\dfrac{1}{2}$을 곱한다. 음수를 곱하므로 부등호의 방향이 바뀐다.
$$
\begin{aligned}
-3 \times \left(-\frac{1}{2}\right) &\ge -\frac{1}{2}x \ge 5 \times \left(-\frac{1}{2}\right) \\
\frac{3}{2} &\ge -\frac{1}{2}x \ge -\frac{5}{2} \\
-\frac{5}{2} &\le -\frac{1}{2}x \le \frac{3}{2}
\end{aligned}
$$


2단계: 각 변에 $4$를 더한다.
$$
\begin{aligned}
4 - \frac{5}{2} &\le 4 - \frac{1}{2}x \le 4 + \frac{3}{2} \\
\frac{8-5}{2} &\le 4 - \frac{1}{2}x \le \frac{8+3}{2} \\
\frac{3}{2} &\le 4 - \frac{1}{2}x \le \frac{11}{2}
\end{aligned}
$$
주어진 부등식 $a \le 4 - \dfrac{1}{2}x \le b$와 비교하면
$$
a = \frac{3}{2}, \quad b = \frac{11}{2}
$$


3단계: $4ab$의 값을 계산한다.
$$
\begin{aligned}
4ab &= 4 \times \frac{3}{2} \times \frac{11}{2} \\
&= 4 \times \frac{33}{4} \\
&= 33
\end{aligned}
$$
따라서 구하는 $4ab$의 값은 $33$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "부등식의 성질을 이용한 일차식의 범위 변환 및 계수곱 서술형 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY",
  "conceptClusterKey": "INEQUALITY_LINEAR_TRANSFORMATION_RANGE",
  "primaryMethod": "-3 <= x <= 5에 -1/2를 곱하고 4를 더해 3/2 <= 4-x/2 <= 11/2를 얻고, 4ab = 4*(3/2)*(11/2) = 33을 계산한다.",
  "decisiveStep": "a=3/2, b=11/2 도출 후 4ab=33 산출",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_INTERVAL_TRANSFORM",
    "templateKey": "TPL_LINEAR_RANGE_PRODUCT_EVAL",
    "why": "부등식의 기본 성질을 적용하여 범위 경곗값을 변환하고 곱셈을 계산하는 서술형 템플릿"
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
  "difficultyReason": "부등호 방향 전환과 분수 통분 덧셈을 단계별로 전개하는 2단계 서술형 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "자연수"
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