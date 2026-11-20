

```
{
  "stem": "26_효천고_1학기_중간_고1_유사",
  "sourceArchiveFile": "original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js",
  "examFolder": "1mid",
  "grade": "고1",
  "curriculum": "2022",
  "questionCount": 26,
  "totalScore": 100.0,
  "generatedAt": "2026-11-17"
}
```

## Q01

- 형식: 객관식  
- 배점: 3

### 발문

\$x - y \= 2\$, \$xy \= 3\$일 때, \$x^3 - y^3\$의 값은?

### 선지

① \$20\$ ② \$22\$ ③ \$24\$ ④ \$26\$ ⑤ \$28\$

### 정답

④

### 해설

곱셈 공식의 변형 \$x^3 - y^3 \= (x - y)^3 \+ 3xy(x - y)\$에 주어진 값을 대입하면 \$\$x^3 - y^3 \= 2^3 \+ 3 \\times 3 \\times 2 \= 8 \+ 18 \= 26\$\$

```
"NONE"
```

```
{
  "sourceQid": "1",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-01",
  "subUnitKey": "H22-C-01-POLYNOMIAL_BASIC",
  "conceptClusterKey": null,
  "primaryMethod": "곱셈 공식의 변형 $x^3-y^3=(x-y)^3+3xy(x-y)$에 $x-y=2$, $xy=3$을 대입해 계산한다.",
  "decisiveStep": "세제곱의 차를 $(x-y)$와 $xy$에 대한 항등식으로 변형하여 값을 대입하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "다항식의 연산",
    "l3": "다항식의 곱셈",
    "l4": "곱셈공식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC",
    "templateKey": "TPL_H1_FORMULA_SYMMETRIC",
    "why": "high1.json H1-RPM-136(DIRECT_ACTIVE): 다항식의 곱셈/곱셈공식"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "세제곱의 차 곱셈 공식 변형에 주어진 두 수를 직접 대입해 바로 답을 구하는 문항이다.",
  "level": "하",
  "item4slot": {
    "domain": "다항식의연산",
    "concept": "곱셈공식의변형",
    "skill": "식의값계산",
    "context": "두변수대칭식"
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 3

### 발문

다항식 \$2x^2 - 5x \+ 4\$를 \$x - 2\$로 나누었을 때의 몫과 나머지를 옳게 구한 것은?

### 선지

① \$2x - 1,\\ 2\$ ② \$2x - 1,\\ 4\$ ③ \$2x \+ 1,\\ 2\$ ④ \$2x \+ 1,\\ 4\$ ⑤ \$2x - 3,\\ 2\$

### 정답

①

### 해설

조립제법을 이용하여 다항식 \$2x^2 - 5x \+ 4\$를 \$x - 2\$로 나누면 \$\$2x^2 - 5x \+ 4 \= (x - 2)(2x - 1\) \+ 2\$\$ 따라서 몫은 \$2x - 1\$이고, 나머지는 \$2\$이다.

```
"NONE"
```

```
{
  "sourceQid": "2",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-01",
  "subUnitKey": "H22-C-01-POLYNOMIAL_BASIC",
  "conceptClusterKey": null,
  "primaryMethod": "일차식 $x-2$로 나누는 조립제법 또는 직접 나눗셈으로 이차식의 몫 $2x-1$과 나머지 $2$를 구한다.",
  "decisiveStep": "계수 $(2, -5, 4)$에 $x=2$로 조립제법을 적용해 몫의 계수 $(2, -1)$과 나머지 $2$를 구하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "다항식의 연산",
    "l3": "다항식의 나눗셈",
    "l4": "몫과 나머지"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_DIVISION",
    "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION",
    "why": "high1.json H1-RPM-139(DIRECT_ACTIVE): 다항식의 나눗셈/몫과 나머지"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차식으로 나누는 기본 조립제법 한 번으로 몫과 나머지를 바로 구하는 문항이다.",
  "level": "하",
  "item4slot": {
    "domain": "다항식의연산",
    "concept": "다항식의나눗셈",
    "skill": "조립제법계산",
    "context": "일차식나눗셈"
  },
  "hold": ""
}
```

## Q03

- 형식: 객관식  
- 배점: 3

### 발문

다음 중 그 켤레복소수가 자기 자신과 같은 복소수는?

### 선지

① \$2 \+ 5i\$ ② \$-4i\$ ③ \$3 - \\sqrt{5}\$ ④ \$2 \+ \\sqrt{-3}\$ ⑤ \$1 - 3i\$

### 정답

③

### 해설

복소수 \$z \= a \+ bi\$ (\$a, b\$는 실수)에 대하여 \$\\bar{z} \= z\$이면 \$\$a - bi \= a \+ bi \\implies 2bi \= 0 \\implies b \= 0\$\$ 즉, \$z\$는 실수여야 한다. 선택지 중 ①, ②, ⑤는 허수부분이 \$0\$이 아니고, ④ \$2 \+ \\sqrt{-3} \= 2 \+ \\sqrt{3}i\$ 역시 허수이다. 따라서 실수인 것은 ③ \$3 - \\sqrt{5}\$이다.

```
"NONE"
```

```
{
  "sourceQid": "3",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-04",
  "subUnitKey": "H22-C-04-COMPLEX_OPERATION",
  "conceptClusterKey": null,
  "primaryMethod": "$\\bar{z}=z$가 실수 조건과 동치임을 이용해 선택지 중 허수부분이 $0$인 실수를 고른다.",
  "decisiveStep": "$2+\\sqrt{-3}=2+\\sqrt{3}i$가 허수이고 $3-\\sqrt{5}$만 실수임을 판별하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "복소수",
    "l3": "i의 거듭제곱",
    "l4": "복소수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION",
    "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT",
    "why": "high1.json H1-RPM-159(DIRECT_ACTIVE): i의 거듭제곱/복소수 조건"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "켤레복소수의 정의와 실수 판별을 직접 적용하는 개념 확인 문항이다.",
  "level": "하",
  "item4slot": {
    "domain": "복소수",
    "concept": "켤레복소수",
    "skill": "실수판별",
    "context": "복소수분류"
  },
  "hold": ""
}
```

## Q04

- 형식: 객관식  
- 배점: 3.5

### 발문

삼차방정식 \$ax^3 \+ bx^2 \+ cx \+ 4 \= 0\$의 두 근이 \$2\$, \$1 \+ \\sqrt{3}\$일 때, 유리수 \$a, b, c\$에 대하여 \$a - b \+ c\$의 값은?

### 선지

① \$-1\$ ② \$1\$ ③ \$3\$ ④ \$5\$ ⑤ \$7\$

### 정답

⑤

### 해설

유리수 계수 삼차방정식의 한 근이 \$1 \+ \\sqrt{3}\$이므로 다른 한 근은 \$1 - \\sqrt{3}\$이다. 세 근 \$2, 1 \+ \\sqrt{3}, 1 - \\sqrt{3}\$에 대하여 삼차방정식의 근과 계수의 관계를 적용하면

1. 세 근의 곱: \$2(1 \+ \\sqrt{3})(1 - \\sqrt{3}) \= 2(1 - 3\) \= \-4 \= \-\\frac{4}{a} \\implies a \= 1\$  
2. 세 근의 합: \$2 \+ (1 \+ \\sqrt{3}) \+ (1 - \\sqrt{3}) \= 4 \= \-\\frac{b}{a} \\implies b \= \-4\$  
3. 두 근끼리의 곱의 합: \$2(1 \+ \\sqrt{3}) \+ 2(1 - \\sqrt{3}) \+ (1 \+ \\sqrt{3})(1 - \\sqrt{3}) \= 4 - 2 \= 2 \= \\frac{c}{a} \\implies c \= 2\$

따라서 구하는 값은 \$\$a - b \+ c \= 1 - (-4) \+ 2 \= 7\$\$

```
"NONE"
```

```
{
  "sourceQid": "4",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "유리수 계수 조건에서 켤레무리근 $1-\\sqrt{3}$을 찾고, 삼차방정식의 근과 계수의 관계로 $a, b, c$를 결정한다.",
  "decisiveStep": "세 근의 곱이 $-4=-\\frac{4}{a}$임을 이용해 최고차항 계수 $a=1$을 먼저 확정하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식",
    "l3": "근과 계수의 관계",
    "l4": "근의 합·곱"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION",
    "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE",
    "why": "high1.json H1-RPM-162(DIRECT_ACTIVE): 근과 계수의 관계/근의 합·곱"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "켤레근 성질과 삼차방정식 근과 계수의 관계 세 식을 차례로 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "여러가지방정식",
    "concept": "삼차방정식의근과계수의관계",
    "skill": "켤레근미정계수결정",
    "context": "유리수계수삼차방정식"
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 3.5

### 발문

\$\\dfrac{2026^3 - 1}{2026^2 \+ 2027}\$의 값은?

### 선지

① \$2024\$ ② \$2025\$ ③ \$2026\$ ④ \$2027\$ ⑤ \$2028\$

### 정답

②

### 해설

\$2026 \= x\$로 놓으면 \$2027 \= x \+ 1\$이므로 주어진 식은 \$\$\\frac{x^3 - 1}{x^2 \+ (x \+ 1)} \= \\frac{(x - 1)(x^2 \+ x \+ 1)}{x^2 \+ x \+ 1} \= x - 1\$\$ 따라서 구하는 값은 \$2026 - 1 \= 2025\$이다.

```
"NONE"
```

```
{
  "sourceQid": "5",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-03",
  "subUnitKey": "H22-C-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "$2026=x$로 치환하여 분자 $x^3-1$을 인수분해한 뒤 분모 $x^2+x+1$로 약분한다.",
  "decisiveStep": "$2027=2026+1$임을 파악해 분모가 $x^2+x+1$이 됨을 확인하고 약분하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "인수분해",
    "l3": "인수분해의 활용",
    "l4": "수의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_APPLICATION",
    "why": "high1.json H1-RPM-151(DIRECT_ACTIVE): 인수분해의 활용/수의 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "문자로 치환한 뒤 세제곱의 차 인수분해 공식으로 바로 약분되는 문항이다.",
  "level": "하",
  "item4slot": {
    "domain": "인수분해",
    "concept": "인수분해공식",
    "skill": "치환후수계산",
    "context": "수의계산응용"
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 3.5

### 발문

두 다항식 \$f(x), g(x)\$가 다음 조건을 만족시킨다.

(가) \$f(x) \+ g(x) \= 1\$ (나) \${f(x)}^2 - {g(x)}^2 \= 2x^2 - 4x \+ 1\$

다항식 \$f(x)g(x)\$를 \$x - 3\$으로 나눈 나머지는?

### 선지

① \$-12\$ ② \$-6\$ ③ \$0\$ ④ \$6\$ ⑤ \$12\$

### 정답

①

### 해설

조건 (나)의 좌변을 인수분해하면 \$\${f(x) \+ g(x)}{f(x) - g(x)} \= 2x^2 - 4x \+ 1\$\$ 조건 (가)에서 \$f(x) \+ g(x) \= 1\$이므로 \$\$f(x) - g(x) \= 2x^2 - 4x \+ 1\$\$ 두 식을 연립하여 더하면 \$\$2f(x) \= 2x^2 - 4x \+ 2 \\implies f(x) \= x^2 - 2x \+ 1\$\$ 따라서 \$g(x) \= 1 - (x^2 - 2x \+ 1\) \= \-x^2 \+ 2x\$이다. 나머지정리에 의하여 \$f(x)g(x)\$를 \$x - 3\$으로 나눈 나머지는 \$f(3)g(3)\$이므로 \$\$f(3) \= 9 - 6 \+ 1 \= 4, \\quad g(3) \= \-9 \+ 6 \= \-3\$\$ \$\$f(3)g(3) \= 4 \\times (-3) \= \-12\$\$

```
"NONE"
```

```
{
  "sourceQid": "6",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-02",
  "subUnitKey": "H22-C-02-CORE",
  "conceptClusterKey": null,
  "primaryMethod": "합차 공식으로 $f(x)-g(x)$를 구한 뒤 (가)와 연립해 $f(x), g(x)$를 찾고 나머지정리 $f(3)g(3)$을 계산한다.",
  "decisiveStep": "$f(x)^2-g(x)^2=(f+g)(f-g)$에서 $f(x)-g(x)$를 구해 연립하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "항등식과 나머지정리",
    "l3": "나머지정리",
    "l4": "일차식으로 나눈 나머지"
  },
  "ptTplCandidate": null,
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "합차 공식과 연립, 나머지정리를 순차적으로 연결하여 계산하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "나머지정리",
    "skill": "합차공식연립후대입",
    "context": "두다항식곱나머지"
  },
  "hold": "RPM_ONLY"
}
```

## Q07

- 형식: 객관식  
- 배점: 3.6

### 발문

두 다항식 \$\$P(x) \= 2x^4 - 5x^3 \+ 5x^2 - 7x \+ 2, \\quad Q(x) \= x^4 - 3x^2 - 4\$\$ 을 각각 인수분해하였을 때, 공통인 인수로 옳은 것은?

### 선지

① \$x \+ 1\$ ② \$x - 1\$ ③ \$x \+ 2\$ ④ \$x - 2\$ ⑤ \$x^2 \+ 1\$

### 정답

④

### 해설

\$Q(x) \= x^4 - 3x^2 - 4\$를 인수분해하면 \$\$Q(x) \= (x^2 - 4)(x^2 \+ 1\) \= (x - 2)(x \+ 2)(x^2 \+ 1)\$\$ \$Q(x)\$의 인수 중 \$P(x)\$의 인수가 되는 것을 인수정리로 확인하면 \$\$P(2) \= 2(16) - 5(8) \+ 5(4) - 7(2) \+ 2 \= 32 - 40 \+ 20 - 14 \+ 2 \= 0\$\$ \$\$P(-2) \= 32 \+ 40 \+ 20 \+ 14 \+ 2 \= 108 \\neq 0\$\$ 또한 \$P(i) \= 2 - 5(-i) \+ 5(-1) - 7i \+ 2 \= \-1 - 2i \\neq 0\$이므로 \$x^2 \+ 1\$도 인수가 아니다. 따라서 두 다항식의 공통인 인수는 \$x - 2\$이다.

```
"NONE"
```

```
{
  "sourceQid": "7",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-03",
  "subUnitKey": "H22-C-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "보기차식 $Q(x)$를 먼저 인수분해하여 후보 인수를 얻고, 인수정리로 $P(x)$와의 공통인수를 판별한다.",
  "decisiveStep": "$Q(x)=(x-2)(x+2)(x^2+1)$로 분해한 뒤 $P(2)=0$임을 확인하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "인수분해",
    "l3": "인수분해의 활용",
    "l4": "식의 값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_APPLICATION",
    "why": "high1.json H1-RPM-152(DIRECT_ACTIVE): 인수분해의 활용/식의 값"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "보기차식 인수분해와 고차식 인수정리 대입을 차례로 수행하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "인수분해",
    "concept": "고차식의인수분해",
    "skill": "공통인수판별",
    "context": "사차다항식두개"
  },
  "hold": ""
}
```

## Q08

- 형식: 객관식  
- 배점: 3.6

### 발문

실수 \$a\_1, a\_2, \\dots, a\_9\$에 대하여 등식 \$\$x^8 \= a\_1(x - 1)^8 \+ a\_2(x - 1)^7 \+ \\dots \+ a\_8(x - 1\) \+ a\_9\$\$ 가 \$x\$에 대한 항등식일 때, \$a\_2 \+ a\_4 \+ a\_6 \+ a\_8\$의 값은?

### 선지

① \$2^6\$ ② \$2^7\$ ③ \$2^8\$ ④ \$2^9\$ ⑤ \$2^{10}\$

### 정답

②

### 해설

주어진 항등식의 양변에 \$x \= 2\$ (\$x - 1 \= 1\$)를 대입하면 \$\$2^8 \= a\_1 \+ a\_2 \+ a\_3 \+ a\_4 \+ a\_5 \+ a\_6 \+ a\_7 \+ a\_8 \+ a\_9 \\quad \\cdots \\text{①}\$\$ 양변에 \$x \= 0\$ (\$x - 1 \= \-1\$)을 대입하면 \$\$0 \= a\_1 - a\_2 \+ a\_3 - a\_4 \+ a\_5 - a\_6 \+ a\_7 - a\_8 \+ a\_9 \\quad \\cdots \\text{②}\$\$ ①에서 ②를 변변 빼면 \$\$2^8 \= 2(a\_2 \+ a\_4 \+ a\_6 \+ a\_8)\$\$ 따라서 구하는 값은 \$\$a\_2 \+ a\_4 \+ a\_6 \+ a\_8 \= 2^7\$\$

```
"NONE"
```

```
{
  "sourceQid": "8",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-02",
  "subUnitKey": "H22-C-02-CORE",
  "conceptClusterKey": null,
  "primaryMethod": "전개식 $(x-1)$의 거듭제곱이 $1$과 $-1$이 되도록 $x=2$와 $x=0$을 대입한 뒤 두 식을 빼서 짝수 첨자 계수의 합을 구한다.",
  "decisiveStep": "$x=2$와 $x=0$을 대입한 두 식의 차를 이용해 홀수 첨자 계수를 소거하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "항등식과 나머지정리",
    "l3": "항등식",
    "l4": "수치대입법"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT",
    "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE",
    "why": "high1.json H1-RPM-141(DIRECT_ACTIVE): 항등식/수치대입법"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "항등식의 거듭제곱 형태에서 적절한 수치 $x=2, 0$을 선택해 대입하고 가감하는 사고가 필요하다.",
  "level": "상",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "항등식",
    "skill": "수치대입계수합추출",
    "context": "다항식거듭제곱전개"
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 3.6

### 발문

이차함수 \$y \= x^2 - 2x \+ 3\$의 그래프와 직선 \$y \= 4x \+ k\$가 만나도록 하는 실수 \$k\$의 값의 범위는?

### 선지

① \$k \< \-6\$ ② \$k \\le \-6\$ ③ \$k \> \-6\$ ④ \$k \\ge 6\$ ⑤ \$k \\ge \-6\$

### 정답

⑤

### 해설

두 그래프가 만나려면 이차방정식 \$\$x^2 - 2x \+ 3 \= 4x \+ k \\implies x^2 - 6x \+ (3 - k) \= 0\$\$ 이 실근을 가져야 한다. 판별식을 \$D\$라 하면 \$\$\\frac{D}{4} \= (-3)^2 - (3 - k) \= 6 \+ k \\ge 0 \\implies k \\ge \-6\$\$

```
"NONE"
```

```
{
  "sourceQid": "9",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH",
  "conceptClusterKey": null,
  "primaryMethod": "이차함수와 직선을 연립한 이차방정식 $x^2-6x+3-k=0$의 판별식 조건 $D/4 \\ge 0$을 푼다.",
  "decisiveStep": "만난다는 조건(접하는 경우 포함)을 판별식 $D \\ge 0$으로 연결하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식과 이차함수",
    "l3": "그래프와 근",
    "l4": "판별식과 위치"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION",
    "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY",
    "why": "high1.json H1-RPM-167(DIRECT_ACTIVE): 그래프와 근/판별식과 위치"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "포물선과 직선의 교점 존재 조건을 판별식 부등식 하나로 바로 해결하는 문항이다.",
  "level": "하",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수와직선의위치관계",
    "skill": "판별식부등식풀이",
    "context": "포물선과직선교점"
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 3.8

### 발문

최고차항의 계수가 양수인 다항식 \$P(x)\$가 모든 실수 \$x\$에 대하여 \$\${P(x)}^2 \+ 2xP(x) \= x^4 \+ 4x^3 \+ x^2 - 4x \+ 1\$\$ 을 만족시킬 때, \$P(x)\$로 옳은 것은?

### 선지

① \$P(x) \= x^2 - x \+ 1\$ ② \$P(x) \= x^2 \+ x \+ 1\$ ③ \$P(x) \= x^2 \+ x - 1\$ ④ \$P(x) \= x^2 \+ 2x - 1\$ ⑤ \$P(x) \= x^2 - 2x \+ 1\$

### 정답

③

### 해설

주어진 식의 양변에 \$x^2\$을 더하여 좌변을 완전제곱식으로 만들면 \$\${P(x)}^2 \+ 2xP(x) \+ x^2 \= x^4 \+ 4x^3 \+ 2x^2 - 4x \+ 1\$\$ \$\${P(x) \+ x}^2 \= (x^2 \+ 2x - 1)^2\$\$ \$P(x)\$의 최고차항의 계수가 양수이므로 \$\$P(x) \+ x \= x^2 \+ 2x - 1 \\implies P(x) \= x^2 \+ x - 1\$\$

```
"NONE"
```

```
{
  "sourceQid": "10",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-03",
  "subUnitKey": "H22-C-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "양변에 $x^2$을 더해 $\\{P(x)+x\\}^2$ 꼴로 만든 뒤 우변을 사차식의 완전제곱식 $(x^2+2x-1)^2$으로 변형한다.",
  "decisiveStep": "양변에 $x^2$을 보태어 양변을 동시에 완전제곱식으로 인수분해하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "인수분해",
    "l3": "인수분해의 활용",
    "l4": "식의 값"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_APPLICATION",
    "why": "high1.json H1-RPM-152(DIRECT_ACTIVE): 인수분해의 활용/식의 값"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "완전제곱식 구조를 스스로 착안해 양변을 변형하고 사차식의 제곱근을 구해야 한다.",
  "level": "상",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "항등식",
    "skill": "완전제곱식변형추론",
    "context": "다항식방정식항등식"
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 3.8

### 발문

사차방정식 \$(x^2 - 2x)(x^2 - 4x \+ 3\) \= 24\$의 한 허근을 \$\\omega\$라 할 때, \$\\omega^2 - 3\\omega\$의 값은?

### 선지

① \$-12\$ ② \$-10\$ ③ \$-8\$ ④ \$-6\$ ⑤ \$4\$

### 정답

④

### 해설

좌변을 일차식으로 인수분해한 뒤 공통부분이 생기도록 짝지어 전개하면 \$\$x(x - 2)(x - 1)(x - 3\) \= {x(x - 3)}{(x - 1)(x - 2)} \= (x^2 - 3x)(x^2 - 3x \+ 2\) \= 24\$\$ \$x^2 - 3x \= t\$로 치환하면 \$\$t(t \+ 2\) \= 24 \\implies t^2 \+ 2t - 24 \= 0 \\implies (t \+ 6)(t - 4\) \= 0\$\$ 따라서 \$t \= 4\$ 또는 \$t \= \-6\$이다.

- \$t \= 4\$이면 \$x^2 - 3x - 4 \= 0\$의 판별식 \$D \= 9 \+ 16 \> 0\$이므로 실근을 갖는다.  
- \$t \= \-6\$이면 \$x^2 - 3x \+ 6 \= 0\$의 판별식 \$D \= 9 - 24 \= \-15 \< 0\$이므로 허근을 갖는다.

따라서 허근 \$\\omega\$는 \$\\omega^2 - 3\\omega \+ 6 \= 0\$을 만족시키므로 \$\\omega^2 - 3\\omega \= \-6\$이다.

```
"NONE"
```

```
{
  "sourceQid": "11",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-06",
  "subUnitKey": "H22-C-06-HIGHER_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "네 일차식을 재조합해 $x^2-3x=t$로 치환하여 $t$를 구한 뒤 판별식으로 허근이 나오는 $t=-6$을 선택한다.",
  "decisiveStep": "치환식 $x^2-3x=t$의 두 해 중 판별식 $D<0$을 만족하는 $t=-6$을 허근 조건으로 거르는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "여러 가지 방정식",
    "l3": "삼차·사차방정식",
    "l4": "인수분해형"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION",
    "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT",
    "why": "high1.json H1-RPM-172(DIRECT_ACTIVE): 삼차·사차방정식/인수분해형"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공통부분 치환 후 두 이차방정식의 판별식을 각각 확인해 허근에 해당하는 값을 골라내야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "여러가지방정식",
    "concept": "고차방정식의풀이",
    "skill": "치환후허근판별",
    "context": "사차방정식허근"
  },
  "hold": ""
}
```

## Q12

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$3x^2 - 5x \+ 1 \= 0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$x^2\$의 계수가 \$1\$이고 \$\\dfrac{1}{\\alpha}, \\dfrac{1}{\\beta}\$을 두 근으로 하는 이차방정식은?

### 선지

① \$x^2 - 5x - 3 \= 0\$ ② \$x^2 - 5x \+ 3 \= 0\$ ③ \$x^2 \+ 5x \+ 3 \= 0\$ ④ \$x^2 - 3x \+ 5 \= 0\$ ⑤ \$x^2 \+ 3x - 5 \= 0\$

### 정답

②

### 해설

이차방정식 \$3x^2 - 5x \+ 1 \= 0\$의 근과 계수의 관계에 의하여 \$\$\\alpha \+ \\beta \= \\frac{5}{3}, \\quad \\alpha\\beta \= \\frac{1}{3}\$\$ 두 수 \$\\frac{1}{\\alpha}, \\frac{1}{\\beta}\$의 합과 곱은 각각 \$\$\\frac{1}{\\alpha} \+ \\frac{1}{\\beta} \= \\frac{\\alpha \+ \\beta}{\\alpha\\beta} \= \\frac{5/3}{1/3} \= 5, \\quad \\frac{1}{\\alpha} \\times \\frac{1}{\\beta} \= \\frac{1}{\\alpha\\beta} \= \\frac{1}{1/3} \= 3\$\$ 따라서 \$x^2\$의 계수가 \$1\$인 이차방정식은 \$x^2 - 5x \+ 3 \= 0\$이다.

```
"NONE"
```

```
{
  "sourceQid": "12",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "근과 계수의 관계로 $\\alpha+\\beta, \\alpha\\beta$를 구한 뒤 역수 근의 합과 곱을 계산해 이차방정식을 세운다.",
  "decisiveStep": "$\\frac{1}{\\alpha}+\\frac{1}{\\beta}=\\frac{\\alpha+\\beta}{\\alpha\\beta}$로 역수 근의 합과 곱을 구하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식",
    "l3": "근과 계수의 관계",
    "l4": "근으로 방정식 구성"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION",
    "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT",
    "why": "high1.json H1-RPM-163(DIRECT_ACTIVE): 근과 계수의 관계/근으로 방정식 구성"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "근과 계수의 관계를 구하고 이를 다시 역수 근의 합·곱에 대입해 방정식을 작성하는 문항이다.",
  "level": "하",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의근과계수의관계",
    "skill": "역수근방정식작성",
    "context": "이차방정식작성"
  },
  "hold": ""
}
```

## Q13

- 형식: 객관식  
- 배점: 3.8

### 발문

삼차방정식 \$x^3 \= \-1\$의 한 허근을 \$\\omega\$라 할 때, \<보기\>에서 옳은 것의 개수는?

\<보기\> ㄱ. \$\\omega^3 \= \-1\$ ㄴ. \$\\omega^2 \+ \\omega \+ 1 \= 0\$ ㄷ. \$\\omega \+ \\bar{\\omega} \= \-1\$ ㄹ. \$\\omega\\bar{\\omega} \= \-1\$ ㅁ. \$\\dfrac{1}{\\omega} \+ \\dfrac{1}{\\bar{\\omega}} \= 1\$ ㅂ. \$\\bar{\\omega} \= \\omega^2\$ ㅅ. 실수 \$a, b\$에 대하여 \$a\\omega \+ b \= 0\$이면 \$a \= 1, b \= 0\$이다.

### 선지

① \$2\$개 ② \$3\$개 ③ \$4\$개 ④ \$5\$개 ⑤ \$6\$개

### 정답

①

### 해설

\$x^3 \+ 1 \= (x \+ 1)(x^2 - x \+ 1\) \= 0\$에서 \$\\omega\$는 \$x^2 - x \+ 1 \= 0\$의 한 허근이고 다른 한 허근은 \$\\bar{\\omega}\$이다.

- ㄱ. \$\\omega\$는 \$x^3 \= \-1\$의 근이므로 \$\\omega^3 \= \-1\$이다. (참)  
- ㄴ. \$\\omega^2 - \\omega \+ 1 \= 0\$이므로 \$\\omega^2 \+ \\omega \+ 1 \= 2\\omega \\neq 0\$이다. (거짓)  
- ㄷ. 이차방정식 \$x^2 - x \+ 1 \= 0\$의 근과 계수의 관계에 의하여 \$\\omega \+ \\bar{\\omega} \= 1\$이다. (거짓)  
- ㄹ. 근과 계수의 관계에 의하여 \$\\omega\\bar{\\omega} \= 1\$이다. (거짓)  
- ㅁ. \$\\frac{1}{\\omega} \+ \\frac{1}{\\bar{\\omega}} \= \\frac{\\omega \+ \\bar{\\omega}}{\\omega\\bar{\\omega}} \= \\frac{1}{1} \= 1\$이다. (참)  
- ㅂ. \$\\omega\\bar{\\omega} \= 1\$이고 \$\\omega^3 \= \-1\$이므로 \$\\bar{\\omega} \= \\frac{1}{\\omega} \= \-\\omega^2\$이다. (거짓)  
- ㅅ. \$\\omega\$는 허수이고 \$a, b\$는 실수이므로 \$a\\omega \+ b \= 0\$이면 \$a \= 0, b \= 0\$이다. (거짓)

따라서 옳은 것은 ㄱ, ㅁ의 \$2\$개이다.

```
"NONE"
```

```
{
  "sourceQid": "13",
  "variationType": "CONDITION",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "$x^3+1=(x+1)(x^2-x+1)=0$에서 허근 $\\omega$와 $\\bar{\\omega}$의 대수적 성질과 근과 계수의 관계를 이용해 각 명제의 참·거짓을 판별한다.",
  "decisiveStep": "$\\omega$가 $x^2-x+1=0$의 근임을 이용해 합 $\\omega+\\bar{\\omega}=1$, 곱 $\\omega\\bar{\\omega}=1$을 정확히 구분하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식",
    "l3": "근과 계수의 관계",
    "l4": "근으로 방정식 구성"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION",
    "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT",
    "why": "high1.json H1-RPM-163(DIRECT_ACTIVE): 근과 계수의 관계/근으로 방정식 구성"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "$x^3=-1$의 허근에 관한 일곱 가지 성질을 부호에 주의하여 모두 검증해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "여러가지방정식",
    "concept": "삼차방정식의허근성질",
    "skill": "오메가성질참거짓판별",
    "context": "보기개수세기"
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 3.8

### 발문

\$0\$이 아닌 복소수 \$z\$에 대하여 다음 두 조건을 모두 만족시키는 두 실수 \$a, b\$에 대하여 \$a \+ b\$의 값은? (단, \$i \= \\sqrt{-1}\$)

(가) \$z - 2\$는 이차방정식 \$x^2 - ax \+ 4 \= 0\$의 한 근이다. (나) \$z - 2i\$는 이차방정식 \$x^2 - bx \+ 4 \= 0\$의 한 근이다.

### 선지

① \$-4\$ ② \$-2\$ ③ \$0\$ ④ \$2\$ ⑤ \$4\$

### 정답

⑤

### 해설

\$z \= x \+ yi\$ (\$x, y\$는 실수)라 하자. 실계수 이차방정식 \$x^2 - kx \+ 4 \= 0\$의 한 근이 \$w \= s \+ ti\$ (\$s, t\$는 실수)이면 \$k \= w \+ \\frac{4}{w}\$가 실수여야 하므로 \$t \= 0\$ 또는 \$s^2 \+ t^2 \= 4\$이다.

- 조건 (가)에서 \$z - 2 \= (x - 2\) \+ yi\$이므로 \$y \= 0\$ 또는 \$(x - 2)^2 \+ y^2 \= 4\$이다.  
- 조건 (나)에서 \$z - 2i \= x \+ (y - 2)i\$이므로 \$y \= 2\$ 또는 \$x^2 \+ (y - 2)^2 \= 4\$이다.

\$z \\neq 0\$이므로 두 조건을 동시에 만족시키는 순서쌍 \$(x, y)\$를 구하면 \$(x, y) \= (2, 2)\$, 즉 \$z \= 2 \+ 2i\$뿐이다.

1. 조건 (가): \$z - 2 \= 2i\$이므로 두 근은 \$2i, \-2i\$이고 \$a \= 2i \+ (-2i) \= 0\$이다.  
2. 조건 (나): \$z - 2i \= 2\$이므로 \$x^2 - bx \+ 4 \= 0\$은 \$(x - 2)^2 \= 0\$이 되어 \$b \= 4\$이다.

따라서 구하는 값은 \$a \+ b \= 0 \+ 4 \= 4\$이다.

```
"NONE"
```

```
{
  "sourceQid": "14",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "실계수 이차방정식 $x^2-kx+4=0$의 근 $w$가 실수이거나 $|w|^2=4$임을 이용해 $z=2+2i$를 구한 뒤 $a, b$를 계산한다.",
  "decisiveStep": "$z \\neq 0$ 조건으로 원과 직선의 교점 중 $(0,0)$을 제외하고 $z=2+2i$를 유일하게 결정하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식",
    "l3": "복소수 근",
    "l4": "계수 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT",
    "templateKey": null,
    "why": "high1.json H1-RPM-165(FAMILY_ACTIVE): 복소수 근/계수 조건"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "복소수의 실수 조건과 켤레근 성질을 기하적 또는 대수적 경우 나누기로 종합해 $z$를 특정해야 한다.",
  "level": "상",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의켤레근",
    "skill": "실계수조건복소수추론",
    "context": "복소수근과원"
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$y \= f(x)\$의 그래프가 \$x\$축과 두 점 \$(2, 0)\$, \$(5, 0)\$에서 만날 때, \$x\$에 대한 이차방정식 \$f(x - a) \= 0\$의 서로 다른 두 실근의 곱이 \$a^2 \+ 24\$가 되도록 하는 상수 \$a\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

③

### 해설

이차함수 \$y \= f(x)\$의 \$x\$절편이 \$2\$와 \$5\$이므로 \$f(2) \= 0\$, \$f(5) \= 0\$이다. 따라서 이차방정식 \$f(x - a) \= 0\$을 만족시키는 \$x\$는 \$\$x - a \= 2 \\text{ 또는 } x - a \= 5 \\implies x \= a \+ 2 \\text{ 또는 } x \= a \+ 5\$\$ 두 실근의 곱이 \$a^2 \+ 24\$이므로 \$\$(a \+ 2)(a \+ 5\) \= a^2 \+ 24 \\implies a^2 \+ 7a \+ 10 \= a^2 \+ 24 \\implies 7a \= 14 \\implies a \= 2\$\$

```
"NONE"
```

```
{
  "sourceQid": "15",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH",
  "conceptClusterKey": null,
  "primaryMethod": "$f(2)=f(5)=0$에서 평행이동된 방정식 $f(x-a)=0$의 두 근 $a+2, a+5$를 구하고 곱의 조건식을 푼다.",
  "decisiveStep": "$f(x-a)=0$의 두 근이 $a+2, a+5$임을 파악해 $(a+2)(a+5)=a^2+24$를 세우는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식과 이차함수",
    "l3": "그래프와 근",
    "l4": "x축과의 교점"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION",
    "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY",
    "why": "high1.json H1-RPM-166(DIRECT_ACTIVE): 그래프와 근/x축과의 교점"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행이동된 이차방정식의 두 근을 표현해 일차방정식을 푸는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수의그래프와이차방정식",
    "skill": "평행이동근계산",
    "context": "절편기반평행이동"
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 4.2

### 발문

다항식 \$f(x)\$가 모든 실수 \$x\$에 대하여 등식 \$f(x)f(-x) \= f(x^2)\$을 만족시킬 때, \<보기\>에서 옳은 것의 개수는?

\<보기\> ㄱ. \$f(0) \= 1\$이다. ㄴ. \$f(-1) \= 0\$이면 \$f(1) \= 0\$이다. ㄷ. \$f(x)\$가 \$x - 1\$을 인수로 갖지 않으면 \$f(x)\$를 \$x \+ 1\$로 나눈 나머지는 \$-1\$이다. ㄹ. 차수가 \$2\$이고 최고차항의 계수가 \$1\$인 다항식 \$f(x)\$의 개수는 \$4\$이다. ㅁ. 차수가 \$3\$이고 최고차항의 계수가 \$1\$인 다항식 \$f(x)\$가 존재한다.

### 선지

① \$1\$개 ② \$2\$개 ③ \$3\$개 ④ \$4\$개 ⑤ \$5\$개

### 정답

②

### 해설

- ㄱ. \$x \= 0\$을 대입하면 \${f(0)}^2 \= f(0)\$이므로 \$f(0) \= 0\$ 또는 \$f(0) \= 1\$이다. (예: \$f(x)=0\$ 또는 \$f(x)=x^2\$) 따라서 반드시 \$f(0)=1\$인 것은 아니다. (거짓)  
- ㄴ. \$x \= 1\$을 대입하면 \$f(1)f(-1) \= f(1)\$이다. \$f(-1) \= 0\$이면 \$0 \= f(1)\$이다. (참)  
- ㄷ. \$f(x)\$가 \$x - 1\$을 인수로 갖지 않으면 \$f(1) \\neq 0\$이므로 \$f(1)f(-1) \= f(1)\$에서 \$f(-1) \= 1\$이다. 따라서 \$x \+ 1\$로 나눈 나머지는 \$1\$이다. (거짓)  
- ㄹ. \$f(x) \= x^2 \+ ax \+ b\$라 하면 \$\$f(x)f(-x) \= (x^2 \+ b)^2 - a^2x^2 \= x^4 \+ (2b - a^2)x^2 \+ b^2\$\$ 이것이 \$f(x^2) \= x^4 \+ ax^2 \+ b\$와 같아야 하므로 \$b^2 \= b \\implies b \= 0, 1\$이다.  
  - \$b \= 0\$: \$-a^2 \= a \\implies a \= 0, \-1\$ (\$2\$개)  
  - \$b \= 1\$: \$2 - a^2 \= a \\implies a^2 \+ a - 2 \= 0 \\implies a \= \-2, 1\$ (\$2\$개) 총 \$4\$개이다. (참)  
- ㅁ. \$f(x) \= x^3 \+ ax^2 \+ bx \+ c\$라 하면 \$f(x)f(-x)\$의 최고차항은 \$-x^6\$이고 \$f(x^2)\$의 최고차항은 \$x^6\$이므로 모순이다. (거짓)

따라서 옳은 것은 ㄴ, ㄹ의 \$2\$개이다.

```
"NONE"
```

```
{
  "sourceQid": "16",
  "variationType": "CONDITION",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-02",
  "subUnitKey": "H22-C-02-CORE",
  "conceptClusterKey": null,
  "primaryMethod": "다항식 항등식 $f(x)f(-x)=f(x^2)$에 수치대입($x=0, 1$)과 차수별 계수비교를 적용해 다섯 명제를 판별한다.",
  "decisiveStep": "ㄹ에서 이차식 계수비교로 $(a,b)$ 쌍 $4$개를 구하고 ㅁ에서 최고차항 부호 모순을 확인하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "항등식과 나머지정리",
    "l3": "항등식",
    "l4": "미정계수법"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT",
    "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE",
    "why": "high1.json H1-RPM-140(DIRECT_ACTIVE): 항등식/미정계수법"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수치대입, 인수정리, 계수비교, 최고차항 부호 비교를 모두 동원해 다섯 보기를 판별해야 한다.",
  "level": "상",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "항등식",
    "skill": "다항식함수방정식추론",
    "context": "합답형개수"
  },
  "hold": ""
}
```

## Q17

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$f(x) \= (x - 2)^2 - 3\$ (\$k \\le x \\le k \+ 2\$)의 최댓값이 \$13\$, 최솟값이 \$1\$이 되도록 하는 모든 상수 \$k\$의 값의 합은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

①

### 해설

이차함수 \$f(x) \= (x - 2)^2 - 3\$은 아래로 볼록하고 꼭짓점이 \$(2, \-3)\$이다. 구간 \$\[k, k \+ 2\]\$에서의 최솟값이 \$1 \> \-3\$이므로 꼭짓점의 \$x\$좌표 \$2\$는 구간 \$\[k, k \+ 2\]\$에 포함되지 않는다.

1. \$k \> 2\$일 때: 구간에서 \$f(x)\$는 증가하므로 최솟값은 \$f(k)\$이다. \$\$(k - 2)^2 - 3 \= 1 \\implies (k - 2)^2 \= 4 \\implies k \= 4 \\quad (k \> 2)\$\$ 이때 최댓값은 \$f(6) \= (6 - 2)^2 - 3 \= 13\$으로 조건을 만족한다.  
2. \$k \+ 2 \< 2\$, 즉 \$k \< 0\$일 때: 구간에서 \$f(x)\$는 감소하므로 최솟값은 \$f(k \+ 2)\$이다. \$\${(k \+ 2\) - 2}^2 - 3 \= 1 \\implies k^2 \= 4 \\implies k \= \-2 \\quad (k \< 0)\$\$ 이때 최댓값은 \$f(-2) \= (-2 - 2)^2 - 3 \= 13\$으로 조건을 만족한다.

따라서 모든 상수 \$k\$의 값의 합은 \$4 \+ (-2) \= 2\$이다.

```
"NONE"
```

```
{
  "sourceQid": "17",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_APPLICATION",
  "conceptClusterKey": null,
  "primaryMethod": "최솟값이 꼭짓점의 $y$좌표 $-3$보다 크므로 축 $x=2$가 구간 바깥에 있음을 파악해 $k>2$와 $k<0$ 두 경우로 나누어 푼다.",
  "decisiveStep": "최솟값 $1 \\neq -3$에서 구간 $[k, k+2]$가 대칭축 $x=2$를 포함하지 않음을 파악하고 좌우로 분기하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식과 이차함수",
    "l3": "최대·최소",
    "l4": "구간 최대·최소"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_QUADRATIC_EXTREMA",
    "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL",
    "why": "high1.json H1-RPM-170(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "제한된 구간에서 대칭축 위치에 따라 최대·최소 지점을 두 경우로 나누어 모두 검증해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수의최대와최소",
    "skill": "축미포함구간분기",
    "context": "이동구간최대최소"
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 4.3

### 발문

최고차항의 계수가 \$1\$인 이차함수 \$y \= f(x)\$의 그래프가 \$x\$축과 두 점 \$\\mathrm{A}(2, 0)\$, \$\\mathrm{B}(a, 0)\$ (\$a \> 2\$)에서 만난다. 이 이차함수의 그래프의 꼭짓점을 \$\\mathrm{P}\$라 하고, 점 \$\\mathrm{A}\$를 지나고 직선 \$\\mathrm{PB}\$에 평행한 직선이 이차함수 \$y \= f(x)\$의 그래프와 만나는 점 중 \$\\mathrm{A}\$가 아닌 점을 \$\\mathrm{Q}\$, 점 \$\\mathrm{Q}\$에서 \$x\$축에 내린 수선의 발을 \$\\mathrm{R}\$이라 하자. 직선 \$\\mathrm{PB}\$의 기울기를 \$m\$이라 할 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은?

\<보기\> ㄱ. \$f(5) \= 15 - 3a\$ ㄴ. 두 점 \$\\mathrm{Q}, \\mathrm{R}\$의 \$x\$좌표는 \$2m \+ a\$이다. ㄷ. 삼각형 \$\\mathrm{BQR}\$의 넓이가 \$12\$일 때, \$m \= 2\$이다.

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄴ, ㄷ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

\$f(x) \= (x - 2)(x - a)\$이다.

- ㄱ. \$f(5) \= (5 - 2)(5 - a) \= 3(5 - a) \= 15 - 3a\$이다. (참)  
- ㄴ. \$f(x) \= \\left(x - \\frac{a \+ 2}{2}\\right)^2 - \\frac{(a - 2)^2}{4}\$이므로 꼭짓점 \$\\mathrm{P}\$의 좌표는 \$\\left(\\frac{a \+ 2}{2}, \-\\frac{(a - 2)^2}{4}\\right)\$이다. 직선 \$\\mathrm{PB}\$의 기울기는 \$\$m \= \\frac{0 - \\left(-\\frac{(a - 2)^2}{4}\\right)}{a - \\frac{a \+ 2}{2}} \= \\frac{a - 2}{2}\$\$ 직선 \$\\mathrm{AQ}\$의 방정식은 \$y \= m(x - 2)\$이므로 \$f(x)\$와 연립하면 \$\$(x - 2)(x - a) \= m(x - 2)\$\$ \$x \\neq 2\$이므로 \$x - a \= m \\implies x \= m \+ a\$이다. 따라서 \$\\mathrm{Q}, \\mathrm{R}\$의 \$x\$좌표는 \$m \+ a\$이다. (거짓)  
- ㄷ. \$m \= \\frac{a - 2}{2}\$에서 \$a - 2 \= 2m\$이고, \$\\mathrm{Q}\$의 \$y\$좌표는 \$m(m \+ a - 2\) \= 3m^2\$이다. 선분 \$\\mathrm{BR}\$의 길이는 \$(m \+ a) - a \= m\$이므로 삼각형 \$\\mathrm{BQR}\$의 넓이는 \$\$\\frac{1}{2} \\times m \\times 3m^2 \= \\frac{3}{2}m^3 \= 12 \\implies m^3 \= 8 \\implies m \= 2\$\$ (참)

따라서 옳은 것은 ㄱ, ㄷ이다.

```
"NONE"
```

```
{
  "sourceQid": "18",
  "variationType": "CONDITION",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH",
  "conceptClusterKey": null,
  "primaryMethod": "$f(x)=(x-2)(x-a)$에서 꼭짓점 $\\mathrm{P}$와 기울기 $m=\\frac{a-2}{2}$를 구한 뒤 직선 $\\mathrm{AQ}$와의 교점 $\\mathrm{Q}$의 좌표로 삼각형 $\\mathrm{BQR}$의 넓이를 표현한다.",
  "decisiveStep": "직선 $\\mathrm{PB}$의 기울기 $m=\\frac{a-2}{2}$와 교점 좌표 $x=m+a$를 연결해 넓이를 $\\frac{3}{2}m^3$으로 나타내는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식과 이차함수",
    "l3": "직선과 포물선",
    "l4": "교점 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION",
    "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY",
    "why": "high1.json H1-RPM-168(DIRECT_ACTIVE): 직선과 포물선/교점 개수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "포물선 절편식·꼭짓점·직선 평행 조건·교점 좌표·삼각형 넓이를 단계적으로 연결해 참거짓을 판별해야 한다.",
  "level": "상",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수와직선의위치관계",
    "skill": "기하조건대수연계추론",
    "context": "포물선과삼각형넓이"
  },
  "hold": ""
}
```

## Q19

- 형식: 서답형  
- 배점: 3

### 발문

다항식 \$P(x) \= 3x^3 - 2x^2 - kx \+ 4\$가 \$x - 2\$로 나누어떨어질 때, 실수 \$k\$의 값을 구하시오.

### 선지

없음

### 정답

\$10\$

### 해설

인수정리에 의하여 \$P(x)\$가 \$x - 2\$로 나누어떨어지므로 \$P(2) \= 0\$이다. \$\$P(2) \= 3(2)^3 - 2(2)^2 - k(2) \+ 4 \= 24 - 8 - 2k \+ 4 \= 20 - 2k \= 0\$\$ 따라서 \$2k \= 20\$이므로 \$k \= 10\$이다.

```
"NONE"
```

```
{
  "sourceQid": "19",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-02",
  "subUnitKey": "H22-C-02-CORE",
  "conceptClusterKey": null,
  "primaryMethod": "인수정리 $P(2)=0$을 적용해 미정계수 $k$에 대한 일차방정식을 푼다.",
  "decisiveStep": "$x-2$로 나누어떨어진다는 조건에서 $P(2)=0$ 식을 세우는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "항등식과 나머지정리",
    "l3": "나머지정리",
    "l4": "고차식 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_REMAINDER_THEOREM",
    "templateKey": null,
    "why": "high1.json H1-RPM-143(FAMILY_ACTIVE): 나머지정리/고차식 조건"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수정리를 이용해 $x=2$를 한 번 대입하면 바로 풀리는 기본 단답형 문항이다.",
  "level": "하",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "인수정리",
    "skill": "미정계수계산",
    "context": "일차식나누어떨어짐"
  },
  "hold": ""
}
```

## Q20

- 형식: 서답형  
- 배점: 4

### 발문

다항식 \$3x^4 - x^3 \+ 3x^2 - 4x \+ 2\$를 \$3x - 1\$로 나누었을 때의 몫과 나머지를 조립제법을 이용하여 구하려고 한다. 조립제법에 사용되는 수 \$a\$의 값과 이때의 몫 \$Q(x)\$를 각각 구하시오.

### 선지

없음

### 정답

\$a \= \\dfrac{1}{3}\$, \$Q(x) \= x^3 \+ x - 1\$

### 해설

제식 \$3x - 1 \= 3\\left(x - \\frac{1}{3}\\right)\$이므로 조립제법에 사용되는 수 \$a\$의 값은 \$\\frac{1}{3}\$이다. 계수 \$3, \-1, 3, \-4, 2\$에 대하여 \$\\frac{1}{3}\$로 조립제법을 수행하면 몫의 계수는 \$(3, 0, 3, \-3)\$이고 나머지는 \$1\$이다. \$\$3x^4 - x^3 \+ 3x^2 - 4x \+ 2 \= \\left(x - \\frac{1}{3}\\right)(3x^3 \+ 3x - 3\) \+ 1 \= (3x - 1)(x^3 \+ x - 1\) \+ 1\$\$ 따라서 \$a \= \\frac{1}{3}\$이고, 몫은 \$Q(x) \= x^3 \+ x - 1\$이다.

```
"NONE"
```

```
{
  "sourceQid": "20",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-01",
  "subUnitKey": "H22-C-01-POLYNOMIAL_BASIC",
  "conceptClusterKey": null,
  "primaryMethod": "$3x-1=3(x-\\frac{1}{3})$에서 조립제법 기준값 $a=\\frac{1}{3}$을 찾고, 조립제법 결과의 몫 계수를 $3$으로 나누어 실제 몫 $Q(x)$를 구한다.",
  "decisiveStep": "일차항 계수가 $3$인 $3x-1$로 나눌 때 조립제법으로 얻은 몫을 $3$으로 나누어야 함을 적용하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "다항식의 연산",
    "l3": "다항식의 나눗셈",
    "l4": "몫과 나머지"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_DIVISION",
    "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION",
    "why": "high1.json H1-RPM-139(DIRECT_ACTIVE): 다항식의 나눗셈/몫과 나머지"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "일차항 계수가 $1$이 아닌 경우의 조립제법 몫 보정을 적용하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "다항식의연산",
    "concept": "조립제법",
    "skill": "일차식계수보정나눗셈",
    "context": "사차식조립제법"
  },
  "hold": ""
}
```

## Q21

- 형식: 서답형  
- 배점: 3

### 발문

허수단위 \$i \= \\sqrt{-1}\$에 대하여 \$i \+ i^2 \+ i^3 \+ \\dots \+ i^{2027}\$의 값을 구하시오.

### 선지

없음

### 정답

\$-1\$

### 해설

연속한 \$4\$개의 거듭제곱의 합은 \$\$i \+ i^2 \+ i^3 \+ i^4 \= i - 1 - i \+ 1 \= 0\$\$ 이고, \$2027 \= 4 \\times 506 \+ 3\$이므로 앞에서부터 \$4\$개씩 묶으면 모두 \$0\$이 되고 마지막 \$3\$개 항만 남는다. 따라서 구하는 값은 \$\$i \+ i^2 \+ i^3 \= i - 1 - i \= \-1\$\$

```
"NONE"
```

```
{
  "sourceQid": "21",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-04",
  "subUnitKey": "H22-C-04-COMPLEX_OPERATION",
  "conceptClusterKey": null,
  "primaryMethod": "허수단위 $i$의 $4$주기성과 연속 $4$항의 합이 $0$임을 이용해 $2027$을 $4$로 나눈 나머지 $3$개 항의 합을 구한다.",
  "decisiveStep": "$2027 = 4 \\times 506 + 3$에서 남는 $3$항 $i+i^2+i^3$의 합을 계산하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "복소수",
    "l3": "i의 거듭제곱",
    "l4": "주기성"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT",
    "templateKey": "TPL_H1_COMPLEX_I_PERIOD",
    "why": "high1.json H1-RPM-158(DIRECT_ACTIVE): i의 거듭제곱/주기성"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "$i$의 거듭제곱 주기성을 그대로 적용하는 기본 계산 문항이다.",
  "level": "하",
  "item4slot": {
    "domain": "복소수",
    "concept": "허수단위의거듭제곱",
    "skill": "주기성합계산",
    "context": "복소수거듭제곱합"
  },
  "hold": ""
}
```

## Q22

- 형식: 서답형  
- 배점: 4

### 발문

연립이차방정식 \$\$\\begin{cases} a^2 \+ ab - 2b^2 \= 0 \\ a^2 \+ b^2 \= 40 \\end{cases}\$\$ 의 해를 순서쌍 \$(a, b)\$로 모두 나타내시오.

### 선지

없음

### 정답

\$(2\\sqrt{5}, 2\\sqrt{5}),\\ (-2\\sqrt{5}, \-2\\sqrt{5}),\\ (-4\\sqrt{2}, 2\\sqrt{2}),\\ (4\\sqrt{2}, \-2\\sqrt{2})\$

### 해설

첫 번째 식을 인수분해하면 \$\$a^2 \+ ab - 2b^2 \= (a - b)(a \+ 2b) \= 0 \\implies a \= b \\text{ 또는 } a \= \-2b\$\$

1. \$a \= b\$일 때: \$b^2 \+ b^2 \= 40 \\implies 2b^2 \= 40 \\implies b^2 \= 20 \\implies b \= \\pm 2\\sqrt{5}\$ 따라서 \$(2\\sqrt{5}, 2\\sqrt{5})\$, \$(-2\\sqrt{5}, \-2\\sqrt{5})\$이다.  
2. \$a \= \-2b\$일 때: \$(-2b)^2 \+ b^2 \= 40 \\implies 5b^2 \= 40 \\implies b^2 \= 8 \\implies b \= \\pm 2\\sqrt{2}\$ 따라서 \$(-4\\sqrt{2}, 2\\sqrt{2})\$, \$(4\\sqrt{2}, \-2\\sqrt{2})\$이다.

```
"NONE"
```

```
{
  "sourceQid": "22",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-03",
  "subUnitKey": "H22-C-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "상수항이 $0$인 동차 이차방정식 $a^2+ab-2b^2=0$을 인수분해해 얻은 두 일차식을 두 번째 식에 각각 대입한다.",
  "decisiveStep": "$(a-b)(a+2b)=0$에서 $a=b$와 $a=-2b$ 두 경우로 나누어 네 순서쌍을 구하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "인수분해",
    "l3": "공통인수",
    "l4": "단계적 인수분해"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_STANDARD",
    "why": "high1.json H1-RPM-147(DIRECT_ACTIVE): 공통인수/단계적 인수분해"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수분해 가능한 연립이차방정식의 표준 풀이를 두 경우에 대해 반복 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "여러가지방정식",
    "concept": "연립이차방정식",
    "skill": "인수분해후대입풀이",
    "context": "동차식이차연립"
  },
  "hold": ""
}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

다항식 \$P(x)\$를 \$x \+ 2\$로 나누었을 때의 나머지가 \$-1\$이고, \$x - 2\$로 나누었을 때의 나머지가 \$7\$이다. \$P(x)\$를 \$(x \+ 2)(x - 2)\$로 나누었을 때의 나머지를 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$2x \+ 3\$

### 해설

나머지정리에 의하여 \$P(-2) \= \-1\$, \$P(2) \= 7\$이다. \$P(x)\$를 이차식 \$(x \+ 2)(x - 2)\$로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$ax \+ b\$ (\$a, b\$는 상수)라 하면 \$\$P(x) \= (x \+ 2)(x - 2)Q(x) \+ ax \+ b\$\$ 양변에 \$x \= \-2\$와 \$x \= 2\$를 각각 대입하면 \$\$\\begin{cases} \-2a \+ b \= \-1 \\ 2a \+ b \= 7 \\end{cases}\$\$ 두 식을 더하면 \$2b \= 6\$에서 \$b \= 3\$이고, \$2a \+ 3 \= 7\$에서 \$a \= 2\$이다. 따라서 구하는 나머지는 \$2x \+ 3\$이다.

```
"NONE"
```

```
{
  "sourceQid": "23",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-02",
  "subUnitKey": "H22-C-02-CORE",
  "conceptClusterKey": null,
  "primaryMethod": "이차식으로 나눈 나머지를 일차식 $ax+b$로 놓고 나머지정리 조건 $P(-2)=-1, P(2)=7$을 대입해 연립한다.",
  "decisiveStep": "나머지 식 $R(x)=ax+b$를 설정하고 두 나머지정리 조건으로 연립방정식을 세우는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "항등식과 나머지정리",
    "l3": "나머지정리",
    "l4": "일차식으로 나눈 나머지"
  },
  "ptTplCandidate": {
    "problemTypeKey": null,
    "templateKey": null,
    "why": "high1.json H1-RPM-142(RPM_ONLY): 나머지정리/일차식으로 나눈 나머지"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차식으로 나눈 나머지를 미지수 두 개의 일차식으로 설정해 연립하는 표준 서술형 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "나머지정리",
    "skill": "이차식나눗셈나머지결정",
    "context": "서술형나머지정리"
  },
  "hold": "RPM_ONLY"
}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

다항식 \$f(x) \= x^4 \+ ax^3 - 7x^2 - x \+ b\$가 \$x - 1\$, \$x - 2\$, \$g(x)\$, \$h(x)\$를 인수로 갖고 \$g(x) - h(x) \= 2\$가 성립할 때, \$\\dfrac{g(a) \\times h(b)}{f(0)}\$의 값을 구하는 과정을 서술하시오. (단, \$a, b\$는 상수이고, \$g(x), h(x)\$는 일차식이다.)

### 선지

없음

### 정답

\$\\dfrac{14}{3}\$

### 해설

1단계: \$a, b\$ 구하기 \$f(x)\$가 \$x - 1\$과 \$x - 2\$를 인수로 가지므로 인수정리에 의하여 \$f(1) \= 0\$, \$f(2) \= 0\$이다. \$\$\\begin{cases} f(1) \= 1 \+ a - 7 - 1 \+ b \= 0 \\implies a \+ b \= 7 \\ f(2) \= 16 \+ 8a - 28 - 2 \+ b \= 0 \\implies 8a \+ b \= 14 \\end{cases}\$\$ 두 식을 연립하여 빼면 \$7a \= 7\$에서 \$a \= 1\$, \$b \= 6\$이다.

2단계: \$g(x), h(x)\$ 구하기 \$f(x) \= x^4 \+ x^3 - 7x^2 - x \+ 6\$을 \$(x - 1)(x - 2\) \= x^2 - 3x \+ 2\$로 나누면 몫은 \$x^2 \+ 4x \+ 3 \= (x \+ 1)(x \+ 3)\$이다. \$g(x) - h(x) \= 2\$를 만족해야 하므로 \$g(x) \= x \+ 3\$, \$h(x) \= x \+ 1\$이다.

3단계: 식의 값 계산 \$f(0) \= 6\$, \$g(a) \= g(1) \= 4\$, \$h(b) \= h(6) \= 7\$이므로 \$\$\\frac{g(a) \\times h(b)}{f(0)} \= \\frac{4 \\times 7}{6} \= \\frac{14}{3}\$\$

```
"NONE"
```

```
{
  "sourceQid": "24",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-03",
  "subUnitKey": "H22-C-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "인수정리 $f(1)=f(2)=0$으로 $a, b$를 먼저 구한 뒤 사차식 나눗셈과 인수분해로 $g(x), h(x)$를 확정해 식의 값을 계산한다.",
  "decisiveStep": "몫 $x^2+4x+3=(x+1)(x+3)$을 구하고 $g(x)-h(x)=2$ 조건으로 두 일차식을 구분하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "인수분해",
    "l3": "인수분해의 활용",
    "l4": "수의 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_APPLICATION",
    "why": "high1.json H1-RPM-151(DIRECT_ACTIVE): 인수분해의 활용/수의 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수정리 연립, 다항식 나눗셈 및 인수분해, 조건에 따른 일차식 배정이 차례로 연결되는 서술형이다.",
  "level": "중",
  "item4slot": {
    "domain": "인수분해",
    "concept": "인수정리와인수분해",
    "skill": "미정계수후완전인수분해",
    "context": "사차식인수분해응용"
  },
  "hold": ""
}
```

## Q25

- 형식: 서답형  
- 배점: 5

### 발문

이차함수 \$y \= x^2 - 6kx \+ a\$의 그래프와 직선 \$y \= 2bx - 9k^2 \+ 12k\$가 실수 \$k\$의 값에 관계없이 항상 한 점에서 만날 때, 실수 \$2a - b\$의 값을 구하는 과정을 서술하시오. (단, \$a, b\$는 상수이다.)

### 선지

없음

### 정답

\$10\$

### 해설

두 식을 연립하여 정리하면 \$\$x^2 - 6kx \+ a \= 2bx - 9k^2 \+ 12k \\implies x^2 - 2(3k \+ b)x \+ 9k^2 - 12k \+ a \= 0\$\$ 두 그래프가 항상 한 점에서 만나므로 이 이차방정식의 판별식을 \$D\$라 하면 \$\\frac{D}{4} \= 0\$이다. \$\$\\frac{D}{4} \= (3k \+ b)^2 - (9k^2 - 12k \+ a) \= 0\$\$ \$\$9k^2 \+ 6bk \+ b^2 - 9k^2 \+ 12k - a \= 0 \\implies (6b \+ 12)k \+ (b^2 - a) \= 0\$\$ 이 등식이 실수 \$k\$의 값에 관계없이 항상 성립해야 하므로 \$k\$에 대한 항등식이다. \$\$6b \+ 12 \= 0, \\quad b^2 - a \= 0\$\$ 따라서 \$b \= \-2\$, \$a \= (-2)^2 \= 4\$이고 구하는 값은 \$\$2a - b \= 2(4) - (-2) \= 10\$\$

```
"NONE"
```

```
{
  "sourceQid": "25",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH",
  "conceptClusterKey": null,
  "primaryMethod": "연립이차방정식의 판별식 $D/4=0$을 구한 뒤, 그 식이 $k$에 대한 항등식이 되도록 $k$의 계수와 상수항을 $0$으로 둔다.",
  "decisiveStep": "판별식 $D/4=0$에서 $k^2$ 항이 소거된 일차식 $(6b+12)k+(b^2-a)=0$에 항등식 조건을 적용하는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식과 이차함수",
    "l3": "그래프와 근",
    "l4": "판별식과 위치"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION",
    "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY",
    "why": "high1.json H1-RPM-167(DIRECT_ACTIVE): 그래프와 근/판별식과 위치"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선 판별식 조건과 임의의 실수 $k$에 대한 항등식 계수비교가 순차적으로 결합된 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수와직선의위치관계",
    "skill": "판별식과항등식결합",
    "context": "매개변수접선조건"
  },
  "hold": ""
}
```

## Q26

- 형식: 서답형  
- 배점: 5

### 발문

두 이차함수 \$f(x) \= \-(x \+ 1)^2 \+ 1\$, \$g(x) \= x^2 - 4\$에 대하여 함수 \$\$h(x) \= \\begin{cases} f(x) & (x \\le \-2 \\text{ 또는 } x \\ge 1\) \\ g(x) & (-2 \< x \< 1\) \\end{cases}\$\$ 라 하자. 직선 \$y \= mx - 5\$와 함수 \$y \= h(x)\$의 그래프가 서로 다른 세 점에서 만나도록 하는 모든 실수 \$m\$의 값의 합을 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$-\\dfrac{9}{2}\$

### 해설

바깥 구간(\$x \\le \-2\$ 또는 \$x \\ge 1\$)과 안쪽 구간(\$-2 \< x \< 1\$)에서 직선 \$y \= mx - 5\$와의 교점 개수를 각각 구한다.

1. 바깥 구간 (\$x \\le \-2\$ 또는 \$x \\ge 1\$): \$\$-(x \+ 1)^2 \+ 1 \= mx - 5 \\implies P\_m(x) \= x^2 \+ (m \+ 2)x - 5 \= 0\$\$ 두 근의 곱이 \$-5 \< 0\$이므로 항상 음의 근 \$x\_-\$와 양의 근 \$x\_+\$가 하나씩 존재한다. \$P\_m(-2) \= \-2m - 5 \\le 0 \\iff m \\ge \-\\frac{5}{2}\$일 때 \$x\_- \\le \-2\$이고, \$P\_m(1) \= m - 2 \\le 0 \\iff m \\le 2\$일 때 \$x\_+ \\ge 1\$이다. (경계 \$x \= \-2, 1\$은 바깥 구간에 포함된다.)  
     
2. 안쪽 구간 (\$-2 \< x \< 1\$): \$\$x^2 - 4 \= mx - 5 \\implies Q\_m(x) \= x^2 - mx \+ 1 \= 0\$\$  
     
   - \$m \< \-\\frac{5}{2}\$: \$Q\_m(-2) \= 2m \+ 5 \< 0 \< Q\_m(0) \= 1\$이므로 \$(-2, 0)\$에 근 \$1\$개 (안쪽 \$1\$개, 바깥쪽 \$1\$개 \$\\implies\$ 총 \$2\$개)  
   - \$m \= \-\\frac{5}{2}\$: \$Q\_m(x) \= (x \+ 2)\\left(x \+ \\frac{1}{2}\\right) \= 0\$이므로 안쪽 근 \$x \= \-\\frac{1}{2}\$ \$1\$개 (총 \$1 \+ 2 \= 3\$개)  
   - \$-\\frac{5}{2} \< m \< \-2\$: \$Q\_m(-2) \> 0, Q\_m(-1) \= m \+ 2 \< 0, Q\_m(0) \= 1 \> 0\$이므로 \$(-2, 0)\$에 근 \$2\$개 (총 \$2 \+ 2 \= 4\$개)  
   - \$m \= \-2\$: \$Q\_m(x) \= (x \+ 1)^2 \= 0\$이므로 중근 \$x \= \-1\$ \$1\$개 (총 \$1 \+ 2 \= 3\$개)  
   - \$-2 \< m \< 2\$: 판별식 \$m^2 - 4 \< 0\$이므로 근 \$0\$개 (총 \$0 \+ 2 \= 2\$개)  
   - \$m \= 2\$: \$Q\_m(x) \= (x - 1)^2 \= 0\$이고 \$x \= 1\$은 안쪽 구간 제외이므로 근 \$0\$개 (총 \$0 \+ 2 \= 2\$개)  
   - \$m \> 2\$: \$Q\_m(0) \= 1 \> 0 \> Q\_m(1) \= 2 - m\$이므로 \$(0, 1)\$에 근 \$1\$개 (총 \$1 \+ 1 \= 2\$개)

따라서 서로 다른 세 점에서 만나도록 하는 \$m\$의 값은 \$-\\frac{5}{2}, \-2\$이고, 그 합은 \$\$-\\frac{5}{2} \+ (-2) \= \-\\frac{9}{2}\$\$

```
"NONE"
```

```
{
  "sourceQid": "26",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH",
  "conceptClusterKey": null,
  "primaryMethod": "바깥 구간($P_m(x)=0$)과 안쪽 구간($Q_m(x)=0$)의 근의 위치를 경계 함숫값과 판별식으로 나누어 기울기 $m$의 구간별 전체 교점 수를 집계한다.",
  "decisiveStep": "경계 $x=-2, 1$의 포함 여부와 접선 $m=\\pm 2$를 기준으로 $m$의 전 범위를 분할해 교점 수가 $3$개인 $m=-\\frac{5}{2}, -2$를 찾는 단계",
  "rpm": {
    "majorUnit": "방정식과 부등식",
    "midUnit": "이차방정식과 이차함수",
    "l3": "직선과 포물선",
    "l4": "교점 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION",
    "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY",
    "why": "high1.json H1-RPM-168(DIRECT_ACTIVE): 직선과 포물선/교점 개수"
  },
  "crossConceptKeys": [],
  "conditionKeys": ["COND_PIECEWISE_DOMAIN_PARTITION"],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간별 이차함수의 경계 포함 여부, 근의 분리, 접선 조건을 모두 통합하여 기울기별 교점 수를 전수 분류해야 하는 최고난도 서술형이다.",
  "level": "상",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "구간별이차함수와직선의교점",
    "skill": "경계및접선전수분기",
    "context": "구간별포물선교점수"
  },
  "hold": ""
}
```

---

```
{
  "examId": "26_효천고_1학기_중간_고1_유사",
  "sourceExamId": "26_효천고_1학기_중간_고1_기출",
  "totalQuestions": 26,
  "mcqCount": 18,
  "essayCount": 8,
  "answerDistribution": {
    "1": 4,
    "2": 4,
    "3": 3,
    "4": 4,
    "5": 3
  },
  "maxConsecutiveSameChoice": 1,
  "scoreCheck": {
    "mcqScoreSum": 66.0,
    "essayScoreSum": 34.0,
    "totalScore": 100.0
  },
  "textExplicitImageReplacements": [
    "Q02",
    "Q15",
    "Q20"
  ]
}
```

