```json:exam
{
  "stem": "24_신흥중_1학기_중간_중2_유사",
  "sourceArchiveFile": "original/middle/m2/1mid/24_신흥중_1학기_중간_중2_기출c.js",
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
다음은 분수와 소수의 실생활 쓰임과 역사에 대해 친구들이 발표한 것이다. 친구들의 설명 중 바르지 못한 것은? [3점]
### 선지
① 민준 : 야구에서 타자의 타율은 주로 분수로 나타내요.
② 서연 : 분수는 고대 이집트에서 빵이나 토지를 똑같이 나누는 과정에서 생겨났어요.
③ 지호 : 음악 시간에 $4$분의 $3$박자나 $4$분의 $4$박자처럼 박자를 나타낼 때 분수가 쓰여요.
④ 수아 : 소수점 기호는 분수보다 훨씬 늦게 체계화되어 쓰이기 시작했어요.
⑤ 하은 : 키, 몸무게, 체온을 측정할 때는 소수로 나타내는 경우가 많아요.
### 정답
①
### 해설
분수와 소수의 역사적 배경 및 실생활 활용 사례를 각 보기별로 확인한다.
$$
\begin{aligned}
\text{① } & \text{야구에서 타자의 타율은 } 0.325 \text{와 같이 주로 소수(할, 푼, 리)로 나타낸다. 따라서 분수로 나타낸다는 설명은 바르지 못하다. (거짓)} \\
\text{② } & \text{분수는 고대 문명에서 양을 균등하게 분할(나눗셈)하는 과정에서 일찍부터 사용되었다. (참)} \\
\text{③ } & \text{음악의 박자표는 4분의 3박자, 4분의 4박자 등 분수 표기법을 사용한다. (참)} \\
\text{④ } & \text{소수점 표기법은 16세기 스테빈(Stevin) 등에 의해 분수보다 훨씬 늦게 체계화되었다. (참)} \\
\text{⑤ } & \text{키, 몸무게, 체온 등 정밀한 측정값은 주로 소수로 표현한다. (참)}
\end{aligned}
$$
따라서 바르지 못한 설명은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "분수와 소수의 실생활 표현 및 수학사적 지식 진위 판정 문항"
}
```
```json:meta
{
  "sourceQid": 1,
  "variationType": "CONTEXT",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FRACTION_DECIMAL_REAL_LIFE_HISTORY",
  "primaryMethod": "야구 타율은 소수로 표현되므로 선지 ①의 분수 진술 오류를 판정한다.",
  "decisiveStep": "야구 타율의 소수 표기 실생활 사례 확인",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "유리수와 순환소수의 분류"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_DECIMAL_REAL_WORLD_CONTEXT",
    "templateKey": "TPL_FRACTION_DECIMAL_APPLICATION_AUDIT",
    "why": "분수와 소수의 실생활 활용과 역사적 맥락을 점검하는 개념 템플릿"
  },
  "crossConceptKeys": [
    "CC_REAL_WORLD_MATH"
  ],
  "conditionKeys": [
    "COND_NONE"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수와 소수의 기본 개념과 실생활 쓰임을 대조하는 1단계 상식 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "분수",
      "소수"
    ],
    "goal": [
      "소수"
    ],
    "method": [
      "판정"
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
다음 분수 중에서 유한소수로 나타낼 수 있는 것은? (정답 2개) [4점]
### 선지
① $\dfrac{7}{21}$ ② $\dfrac{21}{2^{3}\times3\times7}$ ③ $\dfrac{9}{2\times3^{2}\times7}$ ④ $\dfrac{27}{2^{2}\times3^{3}\times5}$ ⑤ $\dfrac{11}{2\times5\times11^{2}}$
### 정답
②, ④
### 해설
기약분수로 나타내었을 때 분모의 소인수가 $2$ 또는 $5$뿐이면 유한소수이다.
$$
\begin{aligned}
\text{① } & \frac{7}{21} = \frac{1}{3} \implies \text{분모에 소인수 } 3\text{이 남아 순환소수} \\
\text{② } & \frac{21}{2^3\times3\times7} = \frac{21}{2^3\times21} = \frac{1}{2^3} \implies \text{분모 소인수가 } 2\text{뿐이므로 유한소수 (참)} \\
\text{③ } & \frac{9}{2\times3^2\times7} = \frac{9}{2\times9\times7} = \frac{1}{2\times7} \implies \text{분모에 소인수 } 7\text{이 남아 순환소수} \\
\text{④ } & \frac{27}{2^2\times3^3\times5} = \frac{27}{2^2\times27\times5} = \frac{1}{2^2\times5} \implies \text{분모 소인수가 } 2, 5\text{뿐이므로 유한소수 (참)} \\
\text{⑤ } & \frac{11}{2\times5\times11^2} = \frac{1}{2\times5\times11} \implies \text{분모에 소인수 } 11\text{이 남아 순환소수}
\end{aligned}
$$
따라서 유한소수로 나타낼 수 있는 것은 ②, ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "기약분수 분모 소인수분해를 통한 유한소수 판정 복수정답 문항"
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
  "conceptClusterKey": "FINITE_DECIMAL_DETERMINATION",
  "primaryMethod": "기약분수 약분 후 분모에 2와 5 이외의 소인수가 없는 ②와 ④를 선별한다.",
  "decisiveStep": "21/(2^3*21)=1/2^3과 27/(2^2*27*5)=1/(2^2*5)의 분모 소인수 확인",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "유한소수 판별"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_TEST",
    "templateKey": "TPL_REPEATING_DECIMAL_FACTOR_SEARCH",
    "why": "약분을 거쳐 분모 소인수 2, 5 조건을 만족하는 분수를 모두 고르는 템플릿"
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
  "difficultyReason": "소인수 약분 과정을 꼼꼼히 거쳐 2개의 정답을 고르는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "기약분수",
      "분수"
    ],
    "goal": [
      "유한소수"
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
다음 중 순환소수의 순환마디와 그 표현이 옳은 것은? [3점]
### 선지
① $5.232323\dots$, 순환마디: $32$, 표현: $5.\dot{2}\dot{3}$
② $12.8454545\dots$, 순환마디: $845$, 표현: $12.8\dot{4}\dot{5}$
③ $40.518518518\dots$, 순환마디: $518$, 표현: $40.\dot{5}1\dot{8}$
④ $0.202020\dots$, 순환마디: $2$, 표현: $0.\dot{2}\dot{0}$
⑤ $1.47894789\dots$, 순환마디: $4789$, 표현: $1.\dot{4}\dot{7}\dot{8}\dot{9}$
### 정답
③
### 해설
순환마디는 소수점 아래에서 일정하게 되풀이되는 가장 짧은 한 부분이며, 순환마디의 양 끝 숫자 위에만 점을 찍어 표기한다.
$$
\begin{aligned}
\text{① } & 5.232323\dots \text{의 순환마디는 } 23\text{이다. } 32\text{라 하였으므로 거짓이다.} \\
\text{② } & 12.8454545\dots \text{의 순환마디는 } 45\text{이다. } 845\text{라 하였으므로 거짓이다.} \\
\text{③ } & 40.518518518\dots \text{의 순환마디는 } 518\text{이고, 양 끝 숫자 위에 점을 찍어 } 40.\dot{5}1\dot{8}\text{로 바르게 표기하였다. (참)} \\
\text{④ } & 0.202020\dots \text{의 순환마디는 } 20\text{이다. } 2\text{라 하였으므로 거짓이다.} \\
\text{⑤ } & 1.47894789\dots \text{의 순환마디는 } 4789\text{이며, 양 끝 숫자 위에만 점을 찍어야 하므로 } 1.\dot{4}78\dot{9}\text{로 나타내어야 한다. (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "순환마디 식별 및 순환소수 점 표기 규칙 정확성 판정 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_NOTATION",
  "primaryMethod": "순환마디 518과 양 끝 점 표기 40.(5)1(8)이 모두 일치하는 ③을 선별한다.",
  "decisiveStep": "최소 순환마디 518 식별 및 양 끝 점 표기 규칙 대조",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_NOTATION",
    "templateKey": "TPL_REPEATING_DOT_NOTATION",
    "why": "순환소수의 순환마디와 점 표기법의 정확성을 판정하는 기본 템플릿"
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
  "difficultyReason": "순환마디와 점 찍기 규칙을 직접 대조하는 1단계 기본 문항",
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
분수 $\dfrac{8}{27}$을 소수로 나타낼 때, 소수점 아래 50번째 자리의 숫자를 구하면? [4점]
### 선지
① $2$ ② $4$ ③ $6$ ④ $7$ ⑤ $9$
### 정답
⑤
### 해설
분수 $\dfrac{8}{27}$을 나눗셈하여 순환소수로 나타낸다.
$$
8 \div 27 = 0.296296296\dots = 0.\dot{2}9\dot{6}
$$
순환마디는 $296$으로 숫자의 개수는 $3$개이다.
소수점 아래 $50$번째 자리의 숫자는 $50$을 순환마디의 길이 $3$으로 나눈 나머지에 의해 결정된다.
$$
50 = 3 \times 16 + 2
$$
나머지가 $2$이므로 소수점 아래 $50$번째 자리의 숫자는 순환마디 $296$의 두 번째 숫자인 $9$이다.
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "분수의 순환소수 변환 및 나머지 주기를 이용한 특정 자릿수 추론 문항"
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
  "primaryMethod": "8/27 = 0.(2)9(6)의 순환마디 296에서 50 = 3*16+2의 나머지 2를 적용해 두 번째 숫자 9를 확정한다.",
  "decisiveStep": "주기 3에 대한 50의 나머지 2 산출 및 두 번째 숫자 9 결정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환마디와 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_DIGIT_CYCLE",
    "templateKey": "TPL_REPEATING_DECIMAL_NTH_DIGIT_ARITHMETIC",
    "why": "나눗셈을 거쳐 순환소수의 자릿수 나머지를 통해 특정 자릿수를 구하는 템플릿"
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
  "difficultyReason": "순환마디 길이 계산 후 나머지 정리를 적용하는 2단계 문항",
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
다음 중에서 옳은 것은? (정답 2개) [5점]
### 선지
① 모든 순환소수는 분수로 나타낼 수 있으므로 유리수이다.
② 순환하지 않는 무한소수 중에는 유리수인 것도 있다.
③ 유한소수 중에는 분수로 나타낼 수 없는 수도 있다.
④ 기약분수의 분모에 소인수 $3$이 남아 있으면 유한소수로 나타낼 수 있다.
⑤ 기약분수의 분모의 소인수가 $2$ 또는 $5$뿐이면 유한소수로 나타낼 수 있다.
### 정답
①, ⑤
### 해설
유리수와 소수의 분류 체계 및 성질을 각 선지별로 검토한다.
$$
\begin{aligned}
\text{① } & \text{순환소수는 모두 분수 } \frac{a}{b} \text{ (} a, b\text{는 정수, } b \ne 0\text{) 꼴로 나타낼 수 있으므로 유리수이다. (참)} \\
\text{② } & \text{순환하지 않는 무한소수는 분수로 나타낼 수 없는 무리수이므로 유리수가 될 수 없다. (거짓)} \\
\text{③ } & \text{모든 유한소수는 분모가 } 10\text{의 거듭제곱인 분수로 나타낼 수 있다. (거짓)} \\
\text{④ } & \text{기약분수의 분모에 } 2\text{ 또는 } 5 \text{ 이외의 소인수인 } 3\text{이 있으면 무한소수(순환소수)가 된다. (거짓)} \\
\text{⑤ } & \text{기약분수의 분모의 소인수가 } 2\text{ 또는 } 5\text{뿐이면 분모를 } 10\text{의 거듭제곱으로 고칠 수 있으므로 유한소수가 된다. (참)}
\end{aligned}
$$
따라서 옳은 것은 ①, ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "유리수와 순환소수, 유한소수의 수학적 성질 종합 판정 복수정답 문항"
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
  "conceptClusterKey": "RATIONAL_NUMBER_DECIMAL_THEORY_AUDIT",
  "primaryMethod": "소수 분류 체계에서 순환소수의 유리수성(①)과 기약분수 유한소수 조건(⑤)을 참으로 식별한다.",
  "decisiveStep": "선지 ①과 ⑤의 수학적 정의 일치 확인",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유리수와 소수 표현",
    "l4": "유리수와 순환소수의 분류"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_RATIONAL_DECIMAL_THEORY_CHECK",
    "templateKey": "TPL_RATIONAL_DECIMAL_TRUE_FALSE_SET",
    "why": "유리수와 소수의 정의, 기약분수의 소인수 조건을 종합 검증하는 템플릿"
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
  "difficultyReason": "수 체계의 정의와 성질을 엄밀하게 비교 검토하는 2단계 문항",
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


## Q06
- 형식: 객관식
- 배점: 4
### 발문
보기는 순환소수 $0.\dot{2}4\dot{7} = 0.247247\dots$에 $1$ 또는 $10$의 거듭제곱을 곱한 순환소수들이다. 보기의 두 순환소수를 골라 뺀 결과가 정수가 나오는 것은? [4점]


<보기>
㉠ $0.247247\dots$
㉡ $2.472472\dots$
㉢ $24.724724\dots$
㉣ $247.247247\dots$
㉤ $2472.472472\dots$
㉥ $24724.724724\dots$
### 선지
① ㉡ - ㉠ ② ㉣ - ㉠ ③ ㉤ - ㉣ ④ ㉥ - ㉡ ⑤ ㉢ - ㉠
### 정답
②
### 해설
두 순환소수를 뺀 결과가 정수가 되려면 소수점 아래의 숫자 배열이 완전히 같아 뺄 때 소수 부분이 소거되어야 한다.
$x = 0.\dot{2}4\dot{7} = 0.247247\dots$라 하면 보기의 수들은 각각 다음과 같다.
$$
\begin{aligned}
㉠ &= x = 0.247247\dots \\
㉡ &= 10x = 2.472472\dots \\
㉢ &= 100x = 24.724724\dots \\
㉣ &= 1000x = 247.247247\dots \\
㉤ &= 10000x = 2472.472472\dots \\
㉥ &= 100000x = 24724.724724\dots
\end{aligned}
$$
소수점 아래 부분이 일치하는 쌍은 다음과 같다.
$$
\begin{aligned}
\text{소수점 아래가 } .247247\dots \text{인 쌍: } & ㉠ \text{과 } ㉣ \\
\text{소수점 아래가 } .472472\dots \text{인 쌍: } & ㉡ \text{과 } ㉤ \\
\text{소수점 아래가 } .724724\dots \text{인 쌍: } & ㉢ \text{과 } ㉥
\end{aligned}
$$
선지 ②의 $㉣ - ㉠$을 계산하면
$$
㉣ - ㉠ = 1000x - x = 247.247247\dots - 0.247247\dots = 247
$$
소수 부분이 완전히 소거되어 정수가 된다.
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "순환소수의 10의 거듭제곱 배수 뺄셈을 통한 소수 부분 소거 원리 문항"
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
  "conceptClusterKey": "REPEATING_DECIMAL_SUBTRACTION_INTEGER",
  "primaryMethod": "소수점 아래 숫자가 .247247...로 일치하는 ㉣과 ㉠의 차가 정수 247임을 확인한다.",
  "decisiveStep": "소수점 아래 배열 일치 쌍 ㉣-㉠ 식별",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_DECIMAL_CONVERSION_PRINCIPLE",
    "templateKey": "TPL_REPEATING_DECIMAL_SUBTRACTION_CHOICE",
    "why": "순환소수의 분수 변환 원리인 소수 부분 일치 뺄셈식을 고르는 템플릿"
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
  "difficultyReason": "자릿수 이동에 따른 소수점 아래 배열 패턴을 대조하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "정수"
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


## Q07
- 형식: 객관식
- 배점: 3
### 발문
다음 중에서 옳은 것은? [3점]
### 선지
① $x^{3} \times x^{4} = x^{12}$ ② $x^{8} \div x^{2} = x^{4}$ ③ $\left(\dfrac{a^{3}}{3b^{2}}\right)^{2} = \dfrac{a^{6}}{6b^{4}}$ ④ $\left(-2x^{2}y\right)^{3} = -8x^{6}y^{3}$ ⑤ $y^{4} \div y^{4} = 0$
### 정답
④
### 해설
지수법칙을 각 선지에 적용하여 계산 결과를 검증한다.
$$
\begin{aligned}
\text{① } & x^3 \times x^4 = x^{3+4} = x^7 \ne x^{12} \text{ (거짓)} \\
\text{② } & x^8 \div x^2 = x^{8-2} = x^6 \ne x^4 \text{ (거짓)} \\
\text{③ } & \left(\frac{a^3}{3b^2}\right)^2 = \frac{(a^3)^2}{3^2 \times (b^2)^2} = \frac{a^6}{9b^4} \ne \frac{a^6}{6b^4} \text{ (거짓)} \\
\text{④ } & (-2x^2 y)^3 = (-2)^3 \times (x^2)^3 \times y^3 = -8x^6 y^3 \text{ (참)} \\
\text{⑤ } & y^4 \div y^4 = 1 \ne 0 \text{ (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "지수법칙 기본 공식(곱, 몫, 거듭제곱, 부호) 성립 여부 판정 문항"
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
  "conceptClusterKey": "EXPONENT_LAWS_BASIC_RULES",
  "primaryMethod": "(-2x^2 y)^3 = -8x^6 y^3의 부호와 지수 계산이 정확한 선지 ④를 확정한다.",
  "decisiveStep": "거듭제곱 부호 (-2)^3=-8 및 지수 6, 3 일치 확인",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_LAW_AUDIT",
    "templateKey": "TPL_EXPONENT_LAWS_TRUE_FALSE_SET",
    "why": "기본 지수법칙 공식의 올바른 적용을 점검하는 템플릿"
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
  "difficultyReason": "지수법칙 공식을 보기별로 직접 대조하는 1단계 기본 문항",
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


## Q08
- 형식: 객관식
- 배점: 4
### 발문
$\left(\dfrac{x^{a}}{2y^{3b}}\right)^{3} = \dfrac{x^{6}}{8y^{27}}$ 일 때, 두 자연수 $a$와 $b$의 합 $a+b$의 값을 구하면? [4점]
### 선지
① $5$ ② $6$ ③ $7$ ④ $8$ ⑤ $9$
### 정답
①
### 해설
좌변을 지수법칙을 이용하여 전개한다.
$$
\left(\frac{x^a}{2y^{3b}}
ight)^3 = \frac{(x^a)^3}{2^3 \times (y^{3b})^3} = \frac{x^{3a}}{8y^{9b}}
$$
우변 $\dfrac{x^6}{8y^{27}}$과 각 문자의 지수를 비교한다.
$$
\begin{aligned}
3a &= 6 \implies a = 2 \\
9b &= 27 \implies b = 3
\end{aligned}
$$
따라서 두 자연수 $a, b$의 합 $a+b$를 계산한다.
$$
a + b = 2 + 3 = 5
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식 분수의 거듭제곱 지수법칙 적용 및 지수 비교 합산 문항"
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
  "conceptClusterKey": "MONOMIAL_FRACTION_POWER_EXPANSION",
  "primaryMethod": "x^(3a)=x^6에서 a=2, y^(9b)=y^27에서 b=3을 구하여 a+b=5를 산출한다.",
  "decisiveStep": "3a=6, 9b=27로부터 a=2, b=3 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 거듭제곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_EXPONENT_COMPARE_EQUATION",
    "templateKey": "TPL_MONOMIAL_POWER_COEFFICIENT_MATCH",
    "why": "분수 꼴 거듭제곱을 전개해 미지 지수를 구하는 템플릿"
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
  "difficultyReason": "거듭제곱 전개 후 각 문자의 지수를 일차방정식으로 해결하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "단항식",
      "거듭제곱"
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
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q09
- 형식: 객관식
- 배점: 5
### 발문
$1 \times 2 \times 3 \times \dots \times 16 = 2^{a} \times b$에서 $b$가 홀수일 때, 자연수 $a$의 값을 구하면? [5점]
### 선지
① $11$ ② $13$ ③ $15$ ④ $16$ ⑤ $17$
### 정답
③
### 해설
$b$가 홀수이므로 $2^a$는 $1$부터 $16$까지의 자연수의 곱(팩토리얼 $16!$)에 포함된 소인수 $2$의 총 개수를 의미한다.
각 자연수에서 소인수 $2$가 몇 번 곱해지는지 세기 위해 $2$의 거듭제곱의 배수의 개수를 구한다.
$$
\begin{aligned}
1\text{부터 } 16\text{까지 } 2\text{의 배수의 개수: } & \left\lfloor \frac{16}{2} \right\rfloor = 8\text{개} \\
1\text{부터 } 16\text{까지 } 4\text{의 배수의 개수: } & \left\lfloor \frac{16}{4} \right\rfloor = 4\text{개} \\
1\text{부터 } 16\text{까지 } 8\text{의 배수의 개수: } & \left\lfloor \frac{16}{8} \right\rfloor = 2\text{개} \\
1\text{부터 } 16\text{까지 } 16\text{의 배수의 개수: } & \left\lfloor \frac{16}{16} \right\rfloor = 1\text{개}
\end{aligned}
$$
따라서 소인수 $2$의 총 지수 $a$는
$$
a = 8 + 4 + 2 + 1 = 15
$$
그러므로 정답은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "연속한 자연수의 곱에 포함된 특정 소인수의 지수 계산(르장드르 공식) 문항"
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
  "conceptClusterKey": "FACTORIAL_PRIME_FACTOR_EXPONENT",
  "primaryMethod": "16까지의 2, 4, 8, 16의 배수의 개수를 합산하여 a = 8+4+2+1 = 15를 구한다.",
  "decisiveStep": "2의 거듭제곱 배수 개수 8, 4, 2, 1 합산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "소인수분해와 지수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_CONSECUTIVE_PRODUCT_PRIME_EXPONENT",
    "templateKey": "TPL_PRODUCT_PRIME_FACTOR_COUNT",
    "why": "연속한 자연수의 곱에서 특정 소인수의 총 거듭제곱 지수를 세는 템플릿"
  },
  "crossConceptKeys": [
    "CC_PRIME_FACTORIZATION"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "2의 거듭제곱 배수의 포함 관계를 고려하여 소인수를 계수하는 3단계 심화 문항",
  "level": "상",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "자연수"
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


## Q10
- 형식: 객관식
- 배점: 4
### 발문
$5^{3} \times 20^{5}$을 $a \times 10^{n}$ (단, $1 \le a < 10$, $n$은 자연수)의 꼴로 나타낼 때, 두 수 $a$와 $n$의 합 $a+n$의 값은? [4점]
### 선지
① $8$ ② $9$ ③ $10$ ④ $11$ ⑤ $12$
### 정답
⑤
### 해설
$20$을 소인수분해하여 지수법칙을 적용한다.
$$
20 = 2^2 \times 5 \implies 20^5 = (2^2 \times 5)^5 = (2^2)^5 \times 5^5 = 2^{10} \times 5^5
$$
주어진 식을 소인수 $2$와 $5$의 거듭제곱으로 나타낸다.
$$
\begin{aligned}
5^3 \times 20^5 &= 5^3 \times (2^{10} \times 5^5) \\
&= 2^{10} \times 5^{3+5} \\
&= 2^{10} \times 5^8
\end{aligned}
$$
$10$의 거듭제곱인 $10 = 2 \times 5$를 만들기 위해 지수를 분리한다.
$$
\begin{aligned}
2^{10} \times 5^8 &= 2^{2+8} \times 5^8 \\
&= 2^2 \times (2^8 \times 5^8) \\
&= 4 \times (2 \times 5)^8 \\
&= 4 \times 10^8
\end{aligned}
$$
$a \times 10^n$과 비교하면 $1 \le 4 < 10$이므로
$$
a = 4, \quad n = 8
$$
따라서 $a+n$의 값을 계산한다.
$$
a + n = 4 + 8 = 12
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "합성수 소인수분해와 10의 거듭제곱 꼴 표준 표기 변환 문항"
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
  "conceptClusterKey": "POWERS_OF_TEN_SCIENTIFIC_FORM",
  "primaryMethod": "5^3 * 20^5 = 2^10 * 5^8 = 4 * 10^8로 변형하여 a=4, n=8, a+n=12를 구한다.",
  "decisiveStep": "2^10 * 5^8 = 4 * 10^8 변형 후 a=4, n=8 도출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 곱·몫"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_SCIENTIFIC_NOTATION",
    "templateKey": "TPL_POWERS_OF_TEN_REPRESENTATION",
    "why": "소인수분해와 지수법칙을 활용해 a * 10^n 꼴로 정리하고 계수를 합산하는 템플릿"
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
  "difficultyReason": "20의 소인수분해 후 2와 5의 지수를 묶는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "소인수분해",
      "지수법칙",
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
$\dfrac{24^{6}}{72^{3}} = 2^{a}$, $\dfrac{9^{5}+9^{5}+9^{5}}{3^{4}+3^{4}+3^{4}} = 3^{b}$ 일 때, $a-b$의 값을 구하면? [4점]
### 선지
① $1$ ② $3$ ③ $5$ ④ $7$ ⑤ $9$
### 정답
②
### 해설
밑을 소인수분해하여 지수법칙으로 각각의 식을 간단히 정리한다.
1단계: 첫 번째 식을 정리하여 $a$를 구한다.
$$
\begin{aligned}
24 &= 2^3 \times 3 \implies 24^6 = (2^3 \times 3)^6 = 2^{18} \times 3^6 \\
72 &= 2^3 \times 3^2 \implies 72^3 = (2^3 \times 3^2)^3 = 2^9 \times 3^6 \\
\frac{24^6}{72^3} &= \frac{2^{18} \times 3^6}{2^9 \times 3^6} = 2^{18-9} = 2^9
\end{aligned}
$$
따라서 $2^a = 2^9$이므로 $a = 9$이다.


2단계: 두 번째 식을 정리하여 $b$를 구한다.
$$
\begin{aligned}
\text{분자: } 9^5 + 9^5 + 9^5 &= 3 \times 9^5 = 3 \times (3^2)^5 = 3 \times 3^{10} = 3^{11} \\
\text{분모: } 3^4 + 3^4 + 3^4 &= 3 \times 3^4 = 3^5 \\
\frac{9^5+9^5+9^5}{3^4+3^4+3^4} &= \frac{3^{11}}{3^5} = 3^{11-5} = 3^6
\end{aligned}
$$
따라서 $3^b = 3^6$이므로 $b = 6$이다.


3단계: $a-b$의 값을 계산한다.
$$
a - b = 9 - 6 = 3
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "합성수 소인수 지수 정리 및 거듭제곱 합의 곱셈 전환 지수 차 계산 문항"
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
  "conceptClusterKey": "EXPONENT_BASE_REDUCTION_AND_SUM",
  "primaryMethod": "소인수분해로 a=9를 얻고, 거듭제곱 합 묶기로 b=6을 구해 a-b=3을 산출한다.",
  "decisiveStep": "a=9와 b=6 도출 후 차 3 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "지수법칙",
    "l4": "거듭제곱의 곱·몫"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_EXPONENT_COMPLEX_SIMPLIFY",
    "templateKey": "TPL_EXPONENT_REDUCTION_SUM_DIFFERENCE",
    "why": "밑이 다른 지수식의 약분과 동일 거듭제곱 덧셈의 곱셈 변환을 결합한 템플릿"
  },
  "crossConceptKeys": [
    "CC_PRIME_FACTORIZATION",
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 가지 서로 다른 지수 변형 기법을 각각 수행하여 차를 구하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "거듭제곱"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "소인수분해",
      "지수법칙",
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
$(-3x^{3})^{2} \times (-4x^{2}) \div 6x^{5}$ 을 계산하면? [4점]
### 선지
① $6x^{3}$ ② $6x^{2}$ ③ $-6x^{2}$ ④ $-6x^{3}$ ⑤ $-12x^{3}$
### 정답
④
### 해설
단항식의 거듭제곱을 먼저 계산한 후, 계수와 문자를 순서대로 계산한다.
1단계: 거듭제곱을 계산한다.
$$
(-3x^3)^2 = (-3)^2 \times (x^3)^2 = 9x^6
$$


2단계: 곱셈을 계산한다.
$$
9x^6 \times (-4x^2) = [9 \times (-4)] \times x^{6+2} = -36x^8
$$


3단계: 나눗셈을 계산한다.
$$
-36x^8 \div 6x^5 = \frac{-36x^8}{6x^5} = \left(\frac{-36}{6}\right) x^{8-5} = -6x^3
$$
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식의 거듭제곱과 곱셈, 나눗셈 혼합 연산 기본 문항"
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
  "conceptClusterKey": "MONOMIAL_ARITHMETIC_MIXED",
  "primaryMethod": "(-3x^3)^2 = 9x^6 전개 후 -36x^8 / 6x^5 = -6x^3을 계산한다.",
  "decisiveStep": "거듭제곱 9x^6 계산 후 -36x^8 / 6x^5 = -6x^3 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "혼합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_MIXED_OPERATION",
    "templateKey": "TPL_MONOMIAL_POWER_MULT_DIV_SIMPLIFY",
    "why": "거듭제곱, 곱셈, 나눗셈이 결합된 단항식 혼합 계산 템플릿"
  },
  "crossConceptKeys": [
    "CC_MONOMIAL_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_MONOMIAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호와 거듭제곱 순서를 정확히 지켜 계산하는 2단계 문항",
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


## Q13
- 형식: 객관식
- 배점: 4
### 발문
$3x^{2}y \times A \div (-2xy^{3}) = 6x^{2}y$ 를 만족하는 식 $A$를 구하면? [4점]
### 선지
① $-4xy^{3}$ ② $-4x^{2}y^{2}$ ③ $4xy^{3}$ ④ $-6xy^{2}$ ⑤ $6x^{2}y^{3}$
### 정답
①
### 해설
주어진 등식에서 미지 식 $A$를 구하기 위해 역연산을 적용한다.
$$
3x^2 y \times A \div (-2xy^3) = 6x^2 y
$$
양변에 $(-2xy^3)$을 곱한다.
$$
\begin{aligned}
3x^2 y \times A &= 6x^2 y \times (-2xy^3) \\
3x^2 y \times A &= -12x^3 y^4
\end{aligned}
$$
양변을 $3x^2 y$로 나눈다.
$$
\begin{aligned}
A &= \frac{-12x^3 y^4}{3x^2 y} \\
&= \left(\frac{-12}{3}\right) x^{3-2} y^{4-1} \\
&= -4xy^3
\end{aligned}
$$
그러므로 정답은 ①이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "단항식 곱셈·나눗셈 등식에서 미지의 단항식 역연산 추론 문항"
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
  "conceptClusterKey": "MONOMIAL_EQUATION_UNKNOWN_FIND",
  "primaryMethod": "A = 6x^2 y * (-2xy^3) / (3x^2 y) = -12x^3 y^4 / (3x^2 y) = -4xy^3을 계산한다.",
  "decisiveStep": "역연산 식 A = -12x^3 y^4 / (3x^2 y) 세우기 및 -4xy^3 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "단항식의 계산",
    "l3": "단항식의 곱셈과 나눗셈",
    "l4": "혼합 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_MONOMIAL_UNKNOWN_SOLVE",
    "templateKey": "TPL_MONOMIAL_EQUATION_ISOLATION",
    "why": "단항식의 곱과 몫으로 이루어진 등식에서 특정 다항식을 구하는 템플릿"
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
  "difficultyReason": "등식의 성질을 이용해 미지 식을 고립시키고 나눗셈을 수행하는 2단계 문항",
  "level": "중",
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
      "연산",
      "방정식"
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
- 배점: 3
### 발문
다음 식을 간단히 정리한 후 여러 가지 수학 용어를 이용하여 설명한 것이다. 옳은 것은? [3점]


$$4x^{2} + \dfrac{x}{2} - 5 - 3x^{2} + 1$$
### 선지
① 주어진 식을 간단히 했을 때, 항은 $2$개이다.
② $4x^{2}$과 $\dfrac{x}{2}$는 동류항이다.
③ 주어진 식을 간단히 했을 때, $x$의 계수는 $\dfrac{1}{2}$이다.
④ 주어진 식을 간단히 했을 때, 상수항은 $4$이다.
⑤ 이 다항식의 차수는 $1$이다.
### 정답
③
### 해설
주어진 식을 동류항끼리 모아 간단히 정리한다.
$$
\begin{aligned}
4x^2 + \frac{x}{2} - 5 - 3x^2 + 1 &= (4x^2 - 3x^2) + \frac{1}{2}x + (-5 + 1) \\
&= x^2 + \frac{1}{2}x - 4
\end{aligned}
$$
각 선지의 진위를 검토한다.
$$
\begin{aligned}
\text{① } & \text{항은 } x^2, \frac{1}{2}x, -4\text{의 } 3\text{개이다. (거짓)} \\
\text{② } & 4x^2\text{은 } 2\text{차항이고 } \frac{x}{2}\text{는 } 1\text{차항이므로 차수가 달라 동류항이 아니다. (거짓)} \\
\text{③ } & x\text{의 계수는 } \frac{1}{2}\text{이다. (참)} \\
\text{④ } & \text{상수항은 } -4\text{이다. (거짓)} \\
\text{⑤ } & \text{최고차항이 } x^2\text{이므로 이 다항식의 차수는 } 2\text{이다(이차식). (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ③이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "다항식 동류항 정리 후 항, 계수, 상수항, 차수 용어 진위 판정 문항"
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
  "conceptClusterKey": "POLYNOMIAL_VOCABULARY_AND_STRUCTURE",
  "primaryMethod": "식 x^2 + (1/2)x - 4로 정리한 후 x의 계수가 1/2임을 판정한다.",
  "decisiveStep": "식 정리 x^2 + (1/2)x - 4 도출 후 x의 계수 1/2 확인",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "동류항과 다항식의 덧셈·뺄셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_TERMS_COEFFICIENTS",
    "templateKey": "TPL_POLYNOMIAL_COMPONENT_AUDIT",
    "why": "다항식을 정리하여 구성 요소(항, 계수, 차수, 상수항)의 정확성을 평가하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_SIMPLIFY"
  ],
  "conditionKeys": [
    "COND_POLYNOMIAL"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항식의 기본 용어 정의를 동류항 정리와 함께 대조하는 1단계 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "계수"
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


## Q15
- 형식: 객관식
- 배점: 4
### 발문
어떤 식에서 $3x^{2}-4x+5$를 빼야 할 것을 잘못하여 더했더니 $7x^{2}-x+2$가 되었다. 이때 바르게 계산한 식은? [4점]
### 선지
① $x^{2}-7x+8$ ② $4x^{2}+3x-3$ ③ $x^{2}+x-8$ ④ $x^{2}+7x+2$ ⑤ $x^{2}+7x-8$
### 정답
⑤
### 해설
잘못 계산한 식으로부터 어떤 식 $A$를 구한다.
$$
A + (3x^2 - 4x + 5) = 7x^2 - x + 2
$$
양변에서 $(3x^2 - 4x + 5)$를 뺀다.
$$
\begin{aligned}
A &= (7x^2 - x + 2) - (3x^2 - 4x + 5) \\
&= 7x^2 - x + 2 - 3x^2 + 4x - 5 \\
&= 4x^2 + 3x - 3
\end{aligned}
$$
바르게 계산한 식은 원래 식 $A$에서 $(3x^2 - 4x + 5)$를 빼야 하므로 대입하여 계산한다.
$$
\begin{aligned}
A - (3x^2 - 4x + 5) &= (4x^2 + 3x - 3) - (3x^2 - 4x + 5) \\
&= 4x^2 + 3x - 3 - 3x^2 + 4x - 5 \\
&= (4-3)x^2 + (3+4)x + (-3-5) \\
&= x^2 + 7x - 8
\end{aligned}
$$
그러므로 정답은 ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "이차다항식 연산 오류 역추적을 통한 원래 식 복원 및 바른 계산 산출 문항"
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
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_ERROR_RECOVERY_QUADRATIC",
  "primaryMethod": "A = (7x^2-x+2)-(3x^2-4x+5) = 4x^2+3x-3을 구하고, A-(3x^2-4x+5) = x^2+7x-8을 계산한다.",
  "decisiveStep": "A=4x^2+3x-3 도출 후 바른 차 x^2+7x-8 산출",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "식의 값과 활용",
    "l4": "조건식 활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_MISTAKE_CORRECTION",
    "templateKey": "TPL_POLYNOMIAL_WRONG_OPERATION_RECOVER",
    "why": "덧셈과 뺄셈을 혼동하여 잘못 계산한 식에서 올바른 결과를 구하는 템플릿"
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
  "difficultyReason": "다항식의 뺄셈 전개와 괄호 처리를 2회 반복하는 2단계 문항",
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


## Q16
- 형식: 객관식
- 배점: 4
### 발문
$2x - \{3x - 2y - (-2x + 3y) - 4\}$ 를 계산하면? [4점]
### 선지
① $-3x-5y+4$ ② $-3x+5y+4$ ③ $-3x+5y-4$ ④ $3x-5y+4$ ⑤ $-7x+5y+4$
### 정답
②
### 해설
괄호가 있는 다항식의 계산은 소괄호, 중괄호 순서로 안쪽부터 풀어 정리한다.
1단계: 소괄호를 풀고 중괄호 안의 식을 정리한다.
$$
\begin{aligned}
& 3x - 2y - (-2x + 3y) - 4 \\
&= 3x - 2y + 2x - 3y - 4 \\
&= (3+2)x + (-2-3)y - 4 \\
&= 5x - 5y - 4
\end{aligned}
$$


2단계: 중괄호 앞의 뺄셈 부호를 분배하여 정리한다.
$$
\begin{aligned}
2x - \{5x - 5y - 4\} &= 2x - 5x + 5y + 4 \\
&= (2-5)x + 5y + 4 \\
&= -3x + 5y + 4
\end{aligned}
$$
그러므로 정답은 ②이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "다중 괄호(소괄호, 중괄호)가 포함된 다항식의 덧셈과 뺄셈 전개 문항"
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
  "conceptClusterKey": "POLYNOMIAL_NESTED_BRACKETS_SIMPLIFY",
  "primaryMethod": "중괄호 안 5x-5y-4를 정리한 후 2x-(5x-5y-4) = -3x+5y+4를 계산한다.",
  "decisiveStep": "중괄호 내부 5x-5y-4 도출 및 최종 부호 분배",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "괄호가 있는 식의 덧셈·뺄셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_NESTED_PARENTHESES",
    "templateKey": "TPL_POLYNOMIAL_MULTIPLE_BRACKET_EVAL",
    "why": "소괄호와 중괄호를 순차적으로 풀며 동류항을 결합하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_DISTRIBUTIVE_LAW"
  ],
  "conditionKeys": [
    "COND_POLYNOMIAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부호 규칙에 주의하여 괄호를 순서대로 푸는 1단계 기본 문항",
  "level": "하",
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


## Q17
- 형식: 객관식
- 배점: 4
### 발문
보기 중에서 $x=3$이 해가 되는 부등식을 모두 고른 것은? [4점]


<보기>
ㄱ. $x-1 > 4$
ㄴ. $2x+1 \ge 7$
ㄷ. $5-2x > -1$
ㄹ. $3x-2 \le x+5$
### 선지
① ㄱ, ㄷ ② ㄱ, ㄴ, ㄷ ③ ㄴ, ㄷ ④ ㄴ, ㄹ ⑤ ㄴ, ㄷ, ㄹ
### 정답
④
### 해설
$x=3$을 보기의 각 부등식에 대입하여 부등식이 참이 되는지 확인한다.
$$
\begin{aligned}
\text{ㄱ: } & 3 - 1 = 2 > 4 \text{ (거짓)} \\
\text{ㄴ: } & 2(3) + 1 = 7 \ge 7 \text{ (참)} \\
\text{ㄷ: } & 5 - 2(3) = -1 > -1 \text{ (거짓: } -1\text{은 } -1\text{보다 크지 않다)} \\
\text{ㄹ: } & 3(3) - 2 = 7, \quad 3 + 5 = 8 \implies 7 \le 8 \text{ (참)}
\end{aligned}
$$
따라서 $x=3$이 해가 되는 부등식은 ㄴ, ㄹ이다.
그러므로 정답은 ④이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "특정 값 대입을 통한 부등식의 참/거짓 판정 기본 문항"
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
  "conceptClusterKey": "INEQUALITY_SOLUTION_TEST",
  "primaryMethod": "x=3을 각 보기에 대입하여 부등호 성립 여부를 확인해 ㄴ, ㄹ을 고른다.",
  "decisiveStep": "ㄴ(7>=7 참)과 ㄹ(7<=8 참), ㄷ(-1>-1 거짓) 판정",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "일차부등식의 풀이",
    "l4": "기본형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_SOLUTION_CHECK",
    "templateKey": "TPL_INEQUALITY_VALUE_MEMBERSHIP_TEST",
    "why": "특정 수의 대입을 통해 부등식의 해가 되는지 판별하는 템플릿"
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
  "difficultyReason": "부등식의 해의 정의에 따라 대입 계산하는 1단계 기본 문항",
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


## Q18
- 형식: 객관식
- 배점: 4
### 발문
다음은 실생활 상황을 미지수 $x$를 사용하여 부등식으로 나타낸 것이다. 옳지 않은 것은? (정답 2개) [4점]
### 선지
① 수험생의 최소 수면 권장 시간은 $7$시간이다. ($x$: 수면 시간) $\implies x \le 7$
② 도로의 제한 속도는 시속 $80\,\mathrm{km}$ 이하이다. ($x$: 주행 속도) $\implies x \le 80$
③ 미술관 무료 입장 대상은 $6$세 미만이다. ($x$: 무료 입장 나이) $\implies x < 6$
④ 승강기 적재 정원은 최대 $15$명이다. ($x$: 탑승 인원) $\implies x \le 15$
⑤ 키 $130\,\mathrm{cm}$ 이하는 이 놀이기구를 탈 수 없습니다. ($x$: 놀이기구 이용 가능한 키) $\implies x \ge 130$
### 정답
①, ⑤
### 해설
실생활 용어인 '최소', '이하', '미만', '최대'의 수학적 의미를 부등호로 바르게 나타내었는지 검토한다.
$$
\begin{aligned}
\text{① } & \text{'최소 } 7\text{시간'은 } 7\text{시간 이상을 뜻하므로 } x \ge 7\text{이어야 한다. } x \le 7\text{이라 하였으므로 옳지 않다. (거짓)} \\
\text{② } & \text{'시속 } 80\,\mathrm{km} \text{ 이하'는 } x \le 80\text{이므로 옳다. (참)} \\
\text{③ } & \text{'6세 미만'은 } 6\text{을 포함하지 않고 작아야 하므로 } x < 6\text{이 맞다. (참)} \\
\text{④ } & \text{'최대 15명'은 } 15\text{명 이하를 뜻하므로 } x \le 15\text{가 맞다. (참)} \\
\text{⑤ } & 130\,\mathrm{cm} \text{ '이하'는 이용할 수 없으므로 이용 가능한 키는 } 130\,\mathrm{cm}\text{를 초과해야 한다. 즉 } x > 130\text{이어야 한다.} \\
& x \ge 130\text{이라 하면 } 130\,\mathrm{cm}\text{인 사람도 포함되므로 옳지 않다. (거짓)}
\end{aligned}
$$
따라서 옳지 않은 것은 ①, ⑤이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "실생활 부등식 표현(이상/이하/초과/미만)의 정확한 부등호 모델링 판정 문항"
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
  "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD",
  "conceptClusterKey": "REAL_WORLD_INEQUALITY_MODELING",
  "primaryMethod": "최소(이상) 표현의 x<=7 오류와 이하 배제 시 x>130이어야 하는 오류를 선별한다.",
  "decisiveStep": "최소 조건(x>=7)과 탑승 불가 조건(x>130) 대조",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 활용",
    "l4": "부등식의 뜻과 표현"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_WORD_PROBLEM_SETUP",
    "templateKey": "TPL_REAL_WORLD_INEQUALITY_TRANSLATION",
    "why": "실생활 조건 문장을 수학적 부등호 관계로 모델링하는 템플릿"
  },
  "crossConceptKeys": [
    "CC_REAL_WORLD_MATH"
  ],
  "conditionKeys": [
    "COND_INEQUALITY"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "실생활 국어 표현을 수학적 부등호로 직관 대조하는 1단계 기본 문항",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "부등식"
    ],
    "method": [
      "판정"
    ],
    "condition": [
      "부등식"
    ]
  },
  "hold": ""
}
```


## Q19
- 형식: 서술형
- 배점: 6
### 발문
[서술형 1번] 분수 $\dfrac{13}{60}$에 어떤 자연수 $a$를 곱하면 유한소수가 된다고 한다. $a$가 한 자리의 자연수라고 할 때, $a$의 값을 모두 구하는 과정을 서술하시오. [6점]
### 정답
$3, 6, 9$
### 해설
1단계: 분모를 소인수분해하여 기약분수의 형태를 확인한다.
$$
60 = 2^2 \times 3 \times 5
$$
따라서 주어진 분수는 다음과 같다.
$$
\frac{13}{60} = \frac{13}{2^2 \times 3 \times 5}
$$
분자 $13$은 소수이므로 분모의 소인수 $3$과 약분되지 않는다.


2단계: 유한소수가 되기 위한 $a$의 조건을 구한다.
$$
\frac{13}{2^2 \times 3 \times 5} \times a
$$
이 수가 유한소수가 되려면 분모에 소인수 $2$ 또는 $5$만 남아야 하므로, 분모의 소인수 $3$이 $a$와 약분되어 소거되어야 한다.
따라서 $a$는 $3$의 배수이어야 한다.


3단계: 한 자리의 자연수 $a$를 모두 구한다.
한 자리의 자연수 중 $3$의 배수는 다음과 같다.
$$
a = 3, \quad 6, \quad 9
$$
따라서 구하는 $a$의 값은 $3, 6, 9$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "분모 소인수분해를 통한 유한소수 조건 해석 및 배수 조건 서술형 문항"
}
```
```json:meta
{
  "sourceQid": 19,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "FINITE_DECIMAL_MULTIPLIER_CONDITION",
  "primaryMethod": "60=2^2*3*5에서 분모의 소인수 3을 소거하기 위해 a가 3의 배수여야 함을 밝히고 3, 6, 9를 산출한다.",
  "decisiveStep": "분모 소인수 3 확인 후 3의 한 자리 배수 3, 6, 9 확정",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "유한소수와 무한소수",
    "l4": "조건을 만족하는 유리수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FINITE_DECIMAL_MULTIPLIER_SEARCH",
    "templateKey": "TPL_FINITE_DECIMAL_FIND_FACTOR_MULTIPLIER",
    "why": "분수에 자연수를 곱해 유한소수가 되도록 하는 소인수 배수를 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_MULTIPLE_DIVISOR"
  ],
  "conditionKeys": [
    "COND_NATURAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소인수분해 후 불필요한 소인수를 약분으로 제거하는 조건을 단계별로 서술하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "분수",
      "소인수분해"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "배수",
      "약수"
    ],
    "condition": [
      "유한소수",
      "자연수"
    ]
  },
  "hold": ""
}
```


## Q20
- 형식: 서술형
- 배점: 6
### 발문
[서술형 2번] 순환소수 $0.2\dot{4}\dot{6}$을 기약분수로 나타내는 과정을 서술하시오. [6점]
### 정답
$\dfrac{122}{495}$
### 해설
1단계: 순환소수 $0.2\dot{4}\dot{6}$을 $x$라 놓는다.
$$
x = 0.2464646\dots
$$


2단계: 소수점 아래 순환마디의 자릿수를 맞추기 위해 양변에 $1000$과 $10$을 각각 곱한다.
$$
\begin{aligned}
1000x &= 246.464646\dots \\
10x &= 2.464646\dots
\end{aligned}
$$


3단계: 두 식을 변끼리 빼어 소수 부분을 소거한다.
$$
\begin{aligned}
1000x - 10x &= 246.464646\dots - 2.464646\dots \\
990x &= 244 \\
x &= \frac{244}{990}
\end{aligned}
$$


4단계: 분모와 분자를 최대공약수 $2$로 약분하여 기약분수로 나타낸다.
$$
x = \frac{244 \div 2}{990 \div 2} = \frac{122}{495}
$$
따라서 구하는 기약분수는 $\dfrac{122}{495}$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "10의 거듭제곱 뺄셈을 통한 혼순환소수의 기약분수 변환 서술형 문항"
}
```
```json:meta
{
  "sourceQid": 20,
  "variationType": "NUMERIC",
  "standardCourse": "중2",
  "courseKey": "M2",
  "curriculum": "2015",
  "standardUnitKey": "M2-01",
  "subUnitKey": "M2-01-REPEATING_DECIMAL",
  "conceptClusterKey": "REPEATING_DECIMAL_CONVERSION_ALGEBRAIC",
  "primaryMethod": "1000x-10x = 244에서 x=244/990 = 122/495를 단계별로 유도한다.",
  "decisiveStep": "990x=244 도출 및 기약분수 122/495 약분",
  "rpm": {
    "majorUnit": "유리수와 순환소수",
    "midUnit": "유리수와 순환소수",
    "l3": "순환소수",
    "l4": "순환소수를 분수로"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_REPEATING_TO_FRACTION_EQ",
    "templateKey": "TPL_REPEATING_DECIMAL_CONVERSION_PROCEDURE",
    "why": "10의 거듭제곱을 곱해 소수 부분을 소거하고 기약분수를 얻는 서술형 템플릿"
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
  "difficultyReason": "방정식 세우기와 뺄셈, 약분 과정을 체계적으로 서술하는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "순환소수"
    ],
    "goal": [
      "기약분수"
    ],
    "method": [
      "방정식",
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


## Q21
- 형식: 서술형
- 배점: 6
### 발문
[서술형 3번] $2x+y - \dfrac{3x-y}{3}$ 을 계산한 식에서 $x$의 계수를 $a$, $y$의 계수를 $b$라고 할 때, $ab$의 값을 구하는 과정을 서술하시오. [6점]
### 정답
$\dfrac{4}{3}$
### 해설
1단계: 공통분모 $3$으로 통분하여 분자를 전개한다.
$$
\begin{aligned}
2x+y - \frac{3x-y}{3} &= \frac{3(2x+y) - (3x-y)}{3} \\
&= \frac{6x + 3y - 3x + y}{3}
\end{aligned}
$$


2단계: 분자의 동류항을 정리한다.
$$
\frac{(6-3)x + (3+1)y}{3} = \frac{3x + 4y}{3}
$$


3단계: 각 항별로 분리하여 $x$와 $y$의 계수를 구한다.
$$
\frac{3x + 4y}{3} = \frac{3}{3}x + \frac{4}{3}y = x + \frac{4}{3}y
$$
따라서 $x$의 계수 $a$와 $y$의 계수 $b$는 다음과 같다.
$$
a = 1, \quad b = \frac{4}{3}
$$


4단계: $ab$의 값을 계산한다.
$$
ab = 1 \times \frac{4}{3} = \frac{4}{3}
$$
그러므로 구하는 값은 $\dfrac{4}{3}$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "분수 형태 다항식의 통분 뺄셈 및 동류항 계수곱 산출 서술형 문항"
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
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "FRACTIONAL_POLYNOMIAL_COEFFICIENT_PRODUCT",
  "primaryMethod": "통분하여 (3x+4y)/3 = x + (4/3)y를 얻고, a=1, b=4/3에서 ab=4/3을 산출한다.",
  "decisiveStep": "통분 전개 (3x+4y)/3 도출 및 계수곱 ab=4/3 계산",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "다항식의 덧셈과 뺄셈",
    "l4": "분수 꼴인 식의 덧셈·뺄셈"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_FRACTIONAL_POLYNOMIAL_COEFFICIENT",
    "templateKey": "TPL_FRACTIONAL_POLYNOMIAL_EVAL",
    "why": "분수식 꼴의 다항식을 통분하여 각 문자의 계수곱을 구하는 서술형 템플릿"
  },
  "crossConceptKeys": [
    "CC_FRACTION_ARITHMETIC"
  ],
  "conditionKeys": [
    "COND_POLYNOMIAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분수식 통분 시 괄호 앞 마이너스 부호 분배에 유의하여 계수를 찾는 2단계 문항",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식",
      "분수"
    ],
    "goal": [
      "식의값"
    ],
    "method": [
      "통분",
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


## Q22
- 형식: 서술형
- 배점: 6
### 발문
[서술형 4번] $(8x^{2}y - 6xy^{2}) \div \dfrac{2}{3}xy - \dfrac{4x^{2}y - 8xy}{4xy}$ 를 계산하는 과정을 서술하시오. [6점]
### 정답
$11x - 9y + 2$
### 해설
1단계: 첫 번째 식을 역수 곱셈으로 바꾸어 전개한다.
$$
\begin{aligned}
(8x^2 y - 6xy^2) \div \frac{2}{3}xy &= (8x^2 y - 6xy^2) \times \frac{3}{2xy} \\
&= 8x^2 y \times \frac{3}{2xy} - 6xy^2 \times \frac{3}{2xy} \\
&= 12x - 9y
\end{aligned}
$$


2단계: 두 번째 분수를 각 항별로 약분하여 정리한다.
$$
\begin{aligned}
\frac{4x^2 y - 8xy}{4xy} &= \frac{4x^2 y}{4xy} - \frac{8xy}{4xy} \\
&= x - 2
\end{aligned}
$$


3단계: 두 결과의 차를 계산한다. 뒤 식 전체에 뺄셈 부호를 분배한다.
$$
\begin{aligned}
(12x - 9y) - (x - 2) &= 12x - 9y - x + 2 \\
&= (12-1)x - 9y + 2 \\
&= 11x - 9y + 2
\end{aligned}
$$
따라서 구하는 식은 $11x - 9y + 2$이다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "다항식과 단항식의 나눗셈 및 분수 약분 혼합 계산 서술형 문항"
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
  "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS",
  "conceptClusterKey": "POLYNOMIAL_MONOMIAL_DIVISION_MIXED",
  "primaryMethod": "첫 항 12x-9y와 둘째 항 x-2를 각각 구하고 차 (12x-9y)-(x-2) = 11x-9y+2를 산출한다.",
  "decisiveStep": "첫 식 12x-9y와 둘째 식 x-2 정리 및 부호 분배",
  "rpm": {
    "majorUnit": "식의 계산",
    "midUnit": "다항식의 계산",
    "l3": "단항식과 다항식의 곱셈·나눗셈",
    "l4": "다항식을 단항식으로 나누기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_POLYNOMIAL_MONOMIAL_MIXED_EVAL",
    "templateKey": "TPL_POLYNOMIAL_DIVISION_SUBTRACTION_COMBINED",
    "why": "다항식의 단항식 나눗셈과 분수 꼴 약분을 결합하여 동류항을 정리하는 서술형 템플릿"
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
  "difficultyReason": "역수 곱셈과 분수 약분 시 부호 처리를 정확히 전개하는 2단계 서술형 문항",
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
      "연산",
      "약수"
    ],
    "condition": [
      "다항식"
    ]
  },
  "hold": ""
}
```


## Q23
- 형식: 서술형
- 배점: 6
### 발문
[서술형 5번] $a \le b$일 때, 부등식의 성질을 이용하여 다음 부등식이 성립함을 설명하시오. [6점]


$$-4a + 5 \ge -4b + 5$$
### 정답
성립함 (풀이 참조)
### 해설
1단계: $a \le b$의 양변에 같은 음수 $-4$를 곱한다.
부등식의 양변에 음수를 곱하면 부등호의 방향이 반대로 바뀐다.
$$
\begin{aligned}
a \le b &\implies a \times (-4) \ge b \times (-4) \\
&\implies -4a \ge -4b
\end{aligned}
$$


2단계: 위 부등식의 양변에 같은 양수 $5$를 더한다.
부등식의 양변에 같은 수를 더하여도 부등호의 방향은 바뀌지 않는다.
$$
\begin{aligned}
-4a \ge -4b &\implies -4a + 5 \ge -4b + 5
\end{aligned}
$$
따라서 주어진 부등식 $-4a + 5 \ge -4b + 5$는 성립한다.
```json:plan
{
  "status": "EXEMPT",
  "reason": "부등식의 기본 성질(음수 곱셈 시 방향 전환, 덧셈 시 방향 보존) 논증 서술형 문항"
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
  "conceptClusterKey": "INEQUALITY_PROPERTIES_PROOF",
  "primaryMethod": "양변에 -4를 곱해 부등호 방향 반전(-4a>=-4b) 후 5를 더해 성립함을 증명한다.",
  "decisiveStep": "음수 곱셈에 따른 부등호 방향 반전 서술",
  "rpm": {
    "majorUnit": "일차부등식과 연립일차방정식",
    "midUnit": "일차부등식",
    "l3": "부등식의 성질",
    "l4": "부등식의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_M2_INEQUALITY_PROPERTY_PROOF",
    "templateKey": "TPL_INEQUALITY_TRANSFORM_JUSTIFICATION",
    "why": "부등식의 성질을 근거로 제시하며 부등호 관계의 성립을 단계별로 논증하는 서술형 템플릿"
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
  "difficultyReason": "부등식의 성질을 단계별 수학적 근거와 함께 서술하는 2단계 문항",
  "level": "중",
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