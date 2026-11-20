

```
{
  "stem": "25_매산고_1학기_중간_고1_유사",
  "sourceArchiveFile": "original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js",
  "examFolder": "1mid",
  "grade": "고1",
  "curriculum": "2022",
  "questionCount": 20,
  "totalScore": 100.0,
  "generatedAt": "2026-11-17"
}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$(3x - 2y - 4z)^2\$의 전개식에서 \$yz\$의 계수는?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

④

### 해설

전개 공식 \$(a \+ b \+ c)^2 \= a^2 \+ b^2 \+ c^2 \+ 2ab \+ 2bc \+ 2ca\$에서 \$yz\$ 항은 \$2(-2y)(-4z)\$뿐이다. \$\$2(-2y)(-4z) \= 16yz\$\$ 따라서 \$yz\$의 계수는 \$16\$이다.

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
  "primaryMethod": "세 항의 완전제곱식 공식에서 $yz$ 항에 해당하는 $2(-2y)(-4z)$만 계산해 계수를 구한다.",
  "decisiveStep": "부호에 유의해 $2(-2)(-4)=16$을 계산하는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "다항식의 연산",
    "l3": "다항식의 곱셈",
    "l4": "고차식 전개"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION",
    "templateKey": "TPL_H1_POLY_OPERATION_DIRECT",
    "why": "high1.json H1-RPM-137(DIRECT_ACTIVE): 다항식의 곱셈/고차식 전개"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "세 항의 제곱 전개 공식에서 특정 항의 계수만 바로 추출하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "다항식의연산",
    "concept": "곱셈공식",
    "skill": "특정항계수추출",
    "context": "세항완전제곱식"
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 3.9

### 발문

이차방정식 \$x^2 - 6x \+ 2 \= 0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\dfrac{1}{\\alpha} \+ \\dfrac{1}{\\beta}\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

근과 계수의 관계에 의하여 \$\\alpha \+ \\beta \= 6\$, \$\\alpha\\beta \= 2\$이다. \$\$\\frac{1}{\\alpha} \+ \\frac{1}{\\beta} \= \\frac{\\alpha \+ \\beta}{\\alpha\\beta} \= \\frac{6}{2} \= 3\$\$

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
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "근과 계수의 관계로 $\\alpha+\\beta=6, \\alpha\\beta=2$를 구하고 통분식 $\\frac{\\alpha+\\beta}{\\alpha\\beta}$에 대입한다.",
  "decisiveStep": "$\\frac{1}{\\alpha}+\\frac{1}{\\beta}=\\frac{\\alpha+\\beta}{\\alpha\\beta}$로 통분해 대입하는 단계",
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
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "근과 계수의 관계와 통분 식 변형을 한 번씩 적용하는 기본 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의근과계수의관계",
    "skill": "역수근합계산",
    "context": "두근대칭식"
  },
  "hold": ""
}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

등식 \$\\dfrac{1 \+ i}{1 - i} - \\dfrac{2(1 - i)}{1 \+ i} \= a \+ bi\$가 성립할 때, 두 실수 \$a, b\$에 대하여 \$a - b\$의 값은? (단, \$i \= \\sqrt{-1}\$)

### 선지

① \$-7\$ ② \$-6\$ ③ \$-5\$ ④ \$-4\$ ⑤ \$-3\$

### 정답

⑤

### 해설

각 분수의 분모를 실수화하면 \$\$\\frac{1 \+ i}{1 - i} \= \\frac{(1 \+ i)^2}{(1 - i)(1 \+ i)} \= \\frac{2i}{2} \= i, \\quad \\frac{1 - i}{1 \+ i} \= \\frac{(1 - i)^2}{(1 \+ i)(1 - i)} \= \\frac{-2i}{2} \= \-i\$\$ 주어진 식에 대입하면 \$\$i - 2(-i) \= 3i \= 0 \+ 3i \= a \+ bi\$\$ \$a, b\$가 실수이므로 \$a \= 0, b \= 3\$이고 \$a - b \= 0 - 3 \= \-3\$이다.

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
  "primaryMethod": "두 분수 복소수의 분모를 실수화하여 $i$와 $-i$로 정리한 뒤 복소수 상등 조건으로 $a, b$를 구한다.",
  "decisiveStep": "$\\frac{1+i}{1-i}=i$와 $\\frac{1-i}{1+i}=-i$를 계산해 $3i$를 얻는 단계",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분모 실수화 두 번과 복소수 상등 비교를 차례로 수행하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "복소수의상등",
    "skill": "분모실수화후계수비교",
    "context": "분수복소수차"
  },
  "hold": ""
}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$y \= x^2 \+ 2ax \+ 6a - 5\$의 그래프가 \$x\$축과 한 점에서 만나도록 하는 모든 실수 \$a\$의 값의 곱은?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

①

### 해설

이차함수의 그래프가 \$x\$축과 한 점에서 만나려면 이차방정식 \$x^2 \+ 2ax \+ 6a - 5 \= 0\$이 중근을 가져야 하므로 판별식 \$\\frac{D}{4} \= 0\$이다. \$\$\\frac{D}{4} \= a^2 - (6a - 5\) \= a^2 - 6a \+ 5 \= 0\$\$ 이차방정식 \$a^2 - 6a \+ 5 \= 0\$의 판별식은 \$(-3)^2 - 5 \= 4 \> 0\$이므로 서로 다른 두 실근을 갖는다. 근과 계수의 관계에 의하여 모든 실수 \$a\$의 값의 곱은 \$5\$이다.

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
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH",
  "conceptClusterKey": null,
  "primaryMethod": "$x$축 접선 조건 $D/4=0$에서 얻은 이차방정식 $a^2-6a+5=0$에 근과 계수의 관계를 적용한다.",
  "decisiveStep": "판별식 식 $a^2-6a+5=0$이 실근을 가짐을 확인하고 두 근의 곱을 구하는 단계",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선 판별식 조건과 매개변수에 대한 근과 계수의 관계를 연결하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수의그래프와x축의위치관계",
    "skill": "접선조건근과계수",
    "context": "x축접하는포물선"
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 4.1

### 발문

다항식 \$P(x) \= ax^3 - 4x^2 \+ 3ax \+ 6a\$가 \$x \+ 1\$로 나누어떨어질 때, \$P(x)\$를 \$x - 1\$로 나누었을 때의 몫을 \$Q(x)\$라 하자. \$Q(1)\$의 값은? (단, \$a\$는 상수이다.)

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

③

### 해설

\$P(x)\$가 \$x \+ 1\$로 나누어떨어지므로 인수정리에 의하여 \$P(-1) \= 0\$이다. \$\$P(-1) \= \-a - 4 - 3a \+ 6a \= 2a - 4 \= 0 \\implies a \= 2\$\$ 따라서 \$P(x) \= 2x^3 - 4x^2 \+ 6x \+ 12\$이다. \$x \= 1\$로 조립제법을 수행하면 몫의 계수는 \$(2, \-2, 4)\$이고 나머지는 \$16\$이므로 \$\$Q(x) \= 2x^2 - 2x \+ 4\$\$ 따라서 \$Q(1) \= 2(1)^2 - 2(1) \+ 4 \= 4\$이다.

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
  "standardUnitKey": "H22-C-02",
  "subUnitKey": "H22-C-02-CORE",
  "conceptClusterKey": null,
  "primaryMethod": "인수정리 $P(-1)=0$으로 $a=2$를 구한 뒤 조립제법으로 $x-1$로 나눈 몫 $Q(x)$를 구해 $Q(1)$을 계산한다.",
  "decisiveStep": "나머지가 아니라 몫 $Q(x)$를 구해야 하므로 조립제법을 시행해 $Q(x)=2x^2-2x+4$를 얻는 단계",
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
  "difficultyReason": "인수정리, 조립제법 몫 구하기, 함숫값 대입의 세 단계가 순차적으로 이어진다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "인수정리와조립제법",
    "skill": "몫다항식결정",
    "context": "삼차식나눗셈몫"
  },
  "hold": "RPM_ONLY"
}
```

## Q06

- 형식: 객관식  
- 배점: 4.1

### 발문

\$\\sqrt{-9}\\sqrt{-16} \+ \\dfrac{\\sqrt{-12}}{\\sqrt{3}} - \\dfrac{\\sqrt{-48}}{\\sqrt{-3}} - \\dfrac{\\sqrt{24}}{\\sqrt{-6}} \= a \+ bi\$일 때, 두 실수 \$a, b\$에 대하여 \$a^2 \+ b^2\$의 값은? (단, \$i \= \\sqrt{-1}\$)

### 선지

① \$256\$ ② \$260\$ ③ \$264\$ ④ \$268\$ ⑤ \$272\$

### 정답

⑤

### 해설

각 항을 허수단위 \$i\$를 사용하여 정리하면

- \$\\sqrt{-9}\\sqrt{-16} \= (3i)(4i) \= 12i^2 \= \-12\$  
- \$\\dfrac{\\sqrt{-12}}{\\sqrt{3}} \= \\dfrac{2\\sqrt{3}i}{\\sqrt{3}} \= 2i\$  
- \$\\dfrac{\\sqrt{-48}}{\\sqrt{-3}} \= \\dfrac{4\\sqrt{3}i}{\\sqrt{3}i} \= 4\$  
- \$\\dfrac{\\sqrt{24}}{\\sqrt{-6}} \= \\dfrac{2\\sqrt{6}}{\\sqrt{6}i} \= \\dfrac{2}{i} \= \-2i\$

주어진 식에 대입하면 \$\$-12 \+ 2i - 4 - (-2i) \= \-16 \+ 4i \= a \+ bi\$\$ 이므로 \$a \= \-16\$, \$b \= 4\$이다. \$\$a^2 \+ b^2 \= (-16)^2 \+ 4^2 \= 256 \+ 16 \= 272\$\$

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
  "standardUnitKey": "H22-C-04",
  "subUnitKey": "H22-C-04-COMPLEX_OPERATION",
  "conceptClusterKey": null,
  "primaryMethod": "음수의 제곱근을 $i$로 변환하여 네 항을 각각 계산한 뒤 실수부 $a$와 허수부 $b$를 구한다.",
  "decisiveStep": "$\\sqrt{-9}\\sqrt{-16}=-12$와 $\\frac{\\sqrt{24}}{\\sqrt{-6}}=-2i$의 부호 변환을 정확히 처리하는 단계",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음수의 제곱근 곱셈·나눗셈 부호 규칙 네 가지를 모두 적용해 합산하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "음수의제곱근",
    "skill": "제곱근부호변환계산",
    "context": "음수제곱근혼합계산"
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 4.2

### 발문

\$x\$에 대한 이차방정식 \$f(x) \= 0\$의 두 근의 합이 \$16\$일 때, \$x\$에 대한 이차방정식 \$f(100 - 4x) \= 0\$의 두 근의 합은?

### 선지

① \$44\$ ② \$46\$ ③ \$48\$ ④ \$50\$ ⑤ \$52\$

### 정답

②

### 해설

\$f(x) \= 0\$의 두 근을 \$\\alpha, \\beta\$라 하면 \$\\alpha \+ \\beta \= 16\$이다. 방정식 \$f(100 - 4x) \= 0\$의 두 근 \$x\_1, x\_2\$는 \$\$100 - 4x\_1 \= \\alpha, \\quad 100 - 4x\_2 \= \\beta\$\$ 을 만족시키므로 \$x\_1 \= \\frac{100 - \\alpha}{4}\$, \$x\_2 \= \\frac{100 - \\beta}{4}\$이다. \$\$x\_1 \+ x\_2 \= \\frac{200 - (\\alpha \+ \\beta)}{4} \= \\frac{200 - 16}{4} \= \\frac{184}{4} \= 46\$\$

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
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "$f(\\alpha)=f(\\beta)=0$에서 $100-4x=\\alpha, \\beta$로 놓고 $x_1+x_2$를 $\\alpha+\\beta$로 표현한다.",
  "decisiveStep": "$100-4x_1=\\alpha, 100-4x_2=\\beta$를 변변 더하여 $x_1+x_2$를 구하는 단계",
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
  "difficultyReason": "일차식이 합성된 방정식 $f(100-4x)=0$의 근을 원래 근으로 표현해 합을 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의근과계수의관계",
    "skill": "합성방정식근의합계산",
    "context": "일차식합성이차방정식"
  },
  "hold": ""
}
```

## Q08

- 형식: 객관식  
- 배점: 4.3

### 발문

\$0 \\le x \\le 4\$에서 이차함수 \$f(x) \= \-x^2 \+ 2ax - 5\$의 최댓값을 \$g(a)\$라 할 때, \$g(1) \+ g(3) \+ g(5)\$의 값은?

### 선지

① \$13\$ ② \$15\$ ③ \$17\$ ④ \$19\$ ⑤ \$21\$

### 정답

④

### 해설

\$f(x) \= \-(x - a)^2 \+ a^2 - 5\$이므로 위로 볼록하고 대칭축은 \$x \= a\$이다.

- \$a \= 1\$: 축 \$x \= 1\$이 구간 \$\[0, 4\]\$에 속하므로 \$g(1) \= f(1) \= 1^2 - 5 \= \-4\$  
- \$a \= 3\$: 축 \$x \= 3\$이 구간 \$\[0, 4\]\$에 속하므로 \$g(3) \= f(3) \= 3^2 - 5 \= 4\$  
- \$a \= 5\$: 축 \$x \= 5\$가 구간 \$\[0, 4\]\$의 오른쪽에 있으므로 구간에서 함수가 증가한다. 따라서 최댓값은 \$g(5) \= f(4) \= \-(4)^2 \+ 2(5)(4) - 5 \= 19\$

\$\$g(1) \+ g(3) \+ g(5) \= \-4 \+ 4 \+ 19 \= 19\$\$

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
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_APPLICATION",
  "conceptClusterKey": null,
  "primaryMethod": "대칭축 $x=a$가 구간 $[0,4]$에 속하는지 여부에 따라 $a=1, 3$에서는 꼭짓점, $a=5$에서는 $x=4$에서 최댓값을 구한다.",
  "decisiveStep": "$a=5$일 때 축이 구간 $[0,4]$ 밖에 있어 최댓값이 $f(4)$에서 발생함을 구분하는 단계",
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
  "difficultyReason": "매개변수 값에 따라 대칭축의 구간 포함 여부가 달라지므로 경우를 구분해 최댓값을 구해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수의최대와최소",
    "skill": "축위치별최댓값함수계산",
    "context": "제한범위최댓값합"
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 4.4

### 발문

인수분해를 이용하여 \$\\dfrac{505 \\times 495 \+ 9}{279}\$의 값을 구하면?

### 선지

① \$896\$ ② \$912\$ ③ \$928\$ ④ \$944\$ ⑤ \$960\$

### 정답

①

### 해설

\$500 \= x\$로 놓으면 분자는 \$\$(x \+ 5)(x - 5\) \+ 9 \= x^2 - 25 \+ 9 \= x^2 - 16 \= (x - 4)(x \+ 4)\$\$ \$x \= 500\$을 대입하면 분자는 \$496 \\times 504\$이다. \$496 \= 16 \\times 31\$, \$504 \= 9 \\times 56\$, \$279 \= 9 \\times 31\$이므로 \$\$\\frac{496 \\times 504}{279} \= \\frac{(16 \\times 31\) \\times (9 \\times 56)}{9 \\times 31} \= 16 \\times 56 \= 896\$\$

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
  "standardUnitKey": "H22-C-03",
  "subUnitKey": "H22-C-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "중간값 $500=x$로 치환해 분자를 $(x-4)(x+4)=496\\times 504$로 인수분해한 뒤 소인수 약분으로 계산한다.",
  "decisiveStep": "분자 $x^2-16=(x-4)(x+4)$를 얻어 $496 \\times 504$와 $279=9 \\times 31$의 공약수를 약분하는 단계",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "치환과 합차 공식 인수분해 후 분모와 약분하는 수의 계산 응용 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "인수분해",
    "concept": "인수분해의활용",
    "skill": "치환인수분해약분",
    "context": "큰수분수계산"
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 4.5

### 발문

이차함수 \$y \= x^2 - 6x\$의 그래프와 직선 \$y \= \-2x \+ k\$가 서로 다른 두 점에서 만날 때, 두 교점의 \$x\$좌표의 차의 제곱을 \$f(k)\$, 곱을 \$g(k)\$라 하자. \${g(k)}^2 \= f(0) \\times f(5)\$를 만족시키는 양의 실수 \$k\$의 값은?

### 선지

① \$16\$ ② \$20\$ ③ \$24\$ ④ \$28\$ ⑤ \$32\$

### 정답

③

### 해설

두 식을 연립하면 \$x^2 - 6x \= \-2x \+ k \\implies x^2 - 4x - k \= 0\$이다. 두 교점의 \$x\$좌표를 \$\\alpha, \\beta\$라 하면 근과 계수의 관계에 의하여 \$\\alpha \+ \\beta \= 4\$, \$\\alpha\\beta \= \-k\$이다. 따라서 \$\$g(k) \= \\alpha\\beta \= \-k\$\$ \$\$f(k) \= (\\alpha - \\beta)^2 \= (\\alpha \+ \\beta)^2 - 4\\alpha\\beta \= 4^2 - 4(-k) \= 16 \+ 4k\$\$ 조건 \${g(k)}^2 \= f(0) \\times f(5)\$에 대입하면 \$\$(-k)^2 \= (16 \+ 0\) \\times (16 \+ 20\) \= 16 \\times 36 \= 576\$\$ \$k \> 0\$이므로 \$k \= 24\$이다. (이때 판별식 \$\\frac{D}{4} \= 4 \+ 24 \> 0\$을 만족한다.)

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
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH",
  "conceptClusterKey": null,
  "primaryMethod": "연립방정식 $x^2-4x-k=0$의 근과 계수의 관계로 $f(k)=16+4k$, $g(k)=-k$를 구해 방정식 $k^2=f(0)f(5)$를 푼다.",
  "decisiveStep": "두 교점 차의 제곱 $(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta$를 $k$의 일차식으로 나타내는 단계",
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
  "difficultyReason": "교점 방정식의 근과 계수의 관계, 곱셈 공식 변형, 함수식 대입이 연속으로 결합된 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수와직선의위치관계",
    "skill": "교점차제곱과곱관계식",
    "context": "교점좌표함수식"
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 4.6

### 발문

윗면이 개방된 원통형 물통에 높이가 \$h\$인 지점까지 물이 채워져 있다. 물통 옆면의 높이 \$a\$인 지점에 작은 구멍을 뚫었을 때 물이 바닥에 떨어지는 지점까지의 수평거리를 \$b\$라 하면 다음과 같은 관계식이 성립한다. \$\$b^2 \= 4a(h - a) \\quad (\\text{단, } 0 \< a \< h)\$\$ \$h \= 10\$일 때, \$b^2\$의 최댓값은?

### 선지

① \$96\$ ② \$100\$ ③ \$104\$ ④ \$108\$ ⑤ \$112\$

### 정답

②

### 해설

\$h \= 10\$을 대입하면 \$\$b^2 \= 4a(10 - a) \= \-4a^2 \+ 40a \= \-4(a - 5)^2 \+ 100\$\$ \$0 \< a \< 10\$에서 \$a \= 5\$일 때 \$b^2\$은 최댓값 \$100\$을 갖는다.

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
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_APPLICATION",
  "conceptClusterKey": null,
  "primaryMethod": "관계식에 $h=10$을 대입해 얻은 이차식 $-4a^2+40a$를 완전제곱식으로 변형해 최댓값을 구한다.",
  "decisiveStep": "꼭짓점 $a=5$가 범위 $0<a<10$에 속함을 확인해 최댓값 $100$을 구하는 단계",
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
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "주어진 이차 관계식에 상수를 대입한 뒤 꼭짓점 최댓값을 바로 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수의최대와최소",
    "skill": "관계식이차함수최댓값",
    "context": "물통수평거리최대"
  },
  "hold": ""
}
```

## Q12

- 형식: 객관식  
- 배점: 4.7

### 발문

이차함수 \$f(x) \= \-x^2 \+ ax \+ b\$가 다음 조건을 만족시킬 때, 구간 \$\[a, b\]\$에서 함수 \$f(x)\$의 최댓값과 최솟값의 차는? (단, \$a, b\$는 상수이다.)

(가) \$f(-1) \= f(5)\$ (나) 함수 \$f(x)\$의 최댓값은 \$9\$이다.

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

⑤

### 해설

조건 (가)에서 \$f(-1) \= f(5)\$이므로 이차함수 그래프의 대칭축은 \$x \= \\frac{-1 \+ 5}{2} \= 2\$이다. \$f(x) \= \-x^2 \+ ax \+ b\$의 축은 \$x \= \\frac{a}{2}\$이므로 \$\\frac{a}{2} \= 2 \\implies a \= 4\$이다. 조건 (나)에서 위로 볼록한 함수 \$f(x) \= \-(x - 2)^2 \+ 4 \+ b\$의 최댓값은 \$f(2) \= 4 \+ b \= 9\$이므로 \$b \= 5\$이다.

따라서 구간 \$\[a, b\] \= \[4, 5\]\$에서 축 \$x \= 2\$가 구간의 왼쪽에 있으므로 \$f(x)\$는 감소한다.

- 최댓값: \$f(4) \= \-(4)^2 \+ 4(4) \+ 5 \= 5\$  
- 최솟값: \$f(5) \= \-(5)^2 \+ 4(5) \+ 5 \= 0\$

구하는 최댓값과 최솟값의 차는 \$5 - 0 \= 5\$이다.

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
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_APPLICATION",
  "conceptClusterKey": null,
  "primaryMethod": "대칭성 $f(-1)=f(5)$로 축 $x=2$와 $a=4$를 구하고 최댓값 $9$로 $b=5$를 정한 뒤 구간 $[4,5]$의 최댓값과 최솟값 차를 구한다.",
  "decisiveStep": "구간 $[4,5]$에서 축 $x=2$가 바깥 왼쪽에 있어 단조감소함을 파악하는 단계",
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
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대칭성으로 계수를 역산한 뒤 구해진 계수로 정의된 구간에서 다시 최대·최소를 구해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수의최대와최소",
    "skill": "대칭성역산후구간최대최소",
    "context": "계수구간최대최소차"
  },
  "hold": ""
}
```

## Q13

- 형식: 객관식  
- 배점: 4.7

### 발문

복소수 \$z\$와 그 켤레복소수 \$\\bar{z}\$에 대하여 \$z \+ \\bar{z} \= 1\$, \$z\\bar{z} \= 1\$이 성립할 때, \$z \+ z^2 \+ \\dots \+ z^{2026} \+ z^{2027}\$의 값은?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$-2\$

### 정답

①

### 해설

근과 계수의 관계에 의하여 \$z, \\bar{z}\$는 이차방정식 \$t^2 - t \+ 1 \= 0\$의 두 근이다. 따라서 \$z^2 - z \+ 1 \= 0\$이고, 양변에 \$z \+ 1\$을 곱하면 \$z^3 \+ 1 \= 0\$, 즉 \$z^3 \= \-1\$, \$z^6 \= 1\$이다. 연속한 \$6\$개의 항의 합은 \$\$z \+ z^2 \+ z^3 \+ z^4 \+ z^5 \+ z^6 \= z(1 \+ z \+ z^2) \+ z^4(1 \+ z \+ z^2) \= z(1 \+ z \+ z^2)(1 \+ z^3) \= 0\$\$ \$2027 \= 6 \\times 337 \+ 5\$이므로 처음 \$2022\$개 항의 합은 \$0\$이고 마지막 \$5\$개 항만 남는다. \$\$z \+ z^2 \+ z^3 \+ z^4 \+ z^5 \= (z \+ z^2 \+ z^3 \+ z^4 \+ z^5 \+ z^6) - z^6 \= 0 - 1 \= \-1\$\$

```
"NONE"
```

```
{
  "sourceQid": "13",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "$z, \\bar{z}$가 $t^2-t+1=0$의 근임을 이용해 $z^3=-1, z^6=1$의 $6$주기성을 적용하여 $2027$항의 합을 구한다.",
  "decisiveStep": "연속 $6$항의 합이 $0$이고 $2027=6\\times 337+5$임을 이용해 $5$항의 합을 $-z^6=-1$로 계산하는 단계",
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
  "difficultyReason": "합과 곱에서 이차방정식을 유도해 $6$주기성과 $5$항 잔여 합을 처리해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수",
    "concept": "복소수의거듭제곱",
    "skill": "근과계수기반주기합",
    "context": "켤레복소수거듭제곱합"
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 4.8

### 발문

최고차항의 계수가 \$1\$인 삼차다항식 \$p(x)\$가 최고차항의 계수가 \$1\$인 서로 다른 두 이차다항식 \$A(x), B(x)\$로 각각 나누어떨어진다. \$A(x) \+ B(x)\$가 \$(x - 4)^2\$으로 나누어떨어지고 \$A(2) \= 0\$일 때, \$p(3)\$의 값은?

### 선지

① \$-3\$ ② \$-1\$ ③ \$1\$ ④ \$3\$ ⑤ \$5\$

### 정답

④

### 해설

\$p(x)\$가 서로 다른 두 이차다항식 \$A(x), B(x)\$로 모두 나누어떨어지므로 두 이차식은 일차 공통인수 \$(x - k)\$를 가진다. \$A(x) \= (x - k)(x - a)\$, \$B(x) \= (x - k)(x - b)\$ (\$a \\neq b\$)라 하면 \$p(x) \= (x - k)(x - a)(x - b)\$이다. \$\$A(x) \+ B(x) \= (x - k)(2x - a - b)\$\$ 이 식이 \$(x - 4)^2\$으로 나누어떨어지므로 \$k \= 4\$이고 \$2x - a - b \= 2(x - 4)\$에서 \$a \+ b \= 8\$이다. \$A(2) \= (2 - 4)(2 - a) \= 0\$에서 \$a \= 2\$이므로 \$b \= 6\$이다. 따라서 \$p(x) \= (x - 4)(x - 2)(x - 6)\$이고 \$\$p(3) \= (3 - 4)(3 - 2)(3 - 6\) \= (-1)(1)(-3) \= 3\$\$

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
  "standardUnitKey": "H22-C-03",
  "subUnitKey": "H22-C-03-FACTORIZATION",
  "conceptClusterKey": null,
  "primaryMethod": "삼차식 $p(x)$의 두 이차 약수 $A(x), B(x)$가 공통 일차인수 $(x-k)$를 공유함을 파악하고 $A+B$의 완전제곱 조건으로 인수들을 결정한다.",
  "decisiveStep": "$A(x)+B(x)=(x-k)(2x-a-b)$가 $(x-4)^2$으로 나누어떨어짐에서 $k=4, a+b=8$을 얻는 단계",
  "rpm": {
    "majorUnit": "다항식",
    "midUnit": "인수분해",
    "l3": "공통인수",
    "l4": "공통인수 묶기"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_H1_POLY_FACTORIZATION",
    "templateKey": "TPL_H1_FACTORIZATION_STANDARD",
    "why": "high1.json H1-RPM-146(DIRECT_ACTIVE): 공통인수/공통인수 묶기"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 이차 약수의 공통인수 구조를 스스로 설정하고 합 다항식의 완전제곱 조건으로 인수를 추론해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "인수분해",
    "concept": "인수정리와인수분해",
    "skill": "공통인수구조추론",
    "context": "삼차식과두이차약수"
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 4.9

### 발문

두 실수 \$a, b\$ (\$b \> 0\$)에 대하여 함수 \$\$f(x) \= \\begin{cases} x^2 \+ ax \+ b & (x \\le 0\) \\ \-x^2 \+ ax - b & (x \> 0\) \\end{cases}\$\$ 이 다음 조건을 만족시킬 때, \$a \+ b\$의 값은?

(가) \$x\$에 대한 방정식 \$f(x) \= x \+ t\$의 서로 다른 실근의 개수가 \$3\$이 되도록 하는 실수 \$t\$의 개수는 \$1\$이다. (나) 조건 (가)에서 방정식 \$f(x) \= x \+ t\$의 서로 다른 세 실근의 합은 \$-2\$이다.

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

③

### 해설

\$g(x) \= f(x) - x\$라 놓으면 \$\$g(x) \= \\begin{cases} x^2 \+ (a - 1)x \+ b & (x \\le 0\) \\ \-x^2 \+ (a - 1)x - b & (x \> 0\) \\end{cases}\$\$ 이고 \$f(x) \= x \+ t\$의 실근은 \$y \= g(x)\$와 직선 \$y \= t\$의 교점의 \$x\$좌표와 같다. \$x \\le 0\$에서 최솟값은 \$m \= b - \\frac{(a - 1)^2}{4}\$, \$x \> 0\$에서 최댓값은 \$M \= \-b \+ \\frac{(a - 1)^2}{4}\$이다. \$b \> 0\$이므로 교점이 \$3\$개가 되는 \$t\$가 오직 \$1\$개 존재하려면 \$M \= b\$ (또는 \$m \= \-b\$)여야 하고, 두 식 모두 \$\$\\frac{(a - 1)^2}{4} \= 2b \\implies (a - 1)^2 \= 8b\$\$ 로 귀결된다. 이때 유일한 값은 \$t \= b\$이며, 세 실근은

- \$x \\le 0\$: \$x^2 \+ (a - 1)x \= 0 \\implies x \= 0\$ 또는 \$x \= \-(a - 1)\$  
- \$x \> 0\$: \$x^2 - (a - 1)x \+ 2b \= \\left(x - \\frac{a - 1}{2}\\right)^2 \= 0 \\implies x \= \\frac{a - 1}{2}\$

조건 (나)에서 세 실근의 합이 \$-2\$이므로 \$\$0 - (a - 1\) \+ \\frac{a - 1}{2} \= \-\\frac{a - 1}{2} \= \-2 \\implies a - 1 \= 4 \\implies a \= 5\$\$ 이를 \$(a - 1)^2 \= 8b\$에 대입하면 \$16 \= 8b \\implies b \= 2 \> 0\$이다. 따라서 \$a \+ b \= 5 \+ 2 \= 7\$이다.

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
  "primaryMethod": "$g(x)=f(x)-x$로 변환해 두 포물선의 꼭짓점 높이와 $x=0$ 불연속 경계값이 일치할 조건 $(a-1)^2=8b$를 구하고 세 근의 합으로 $a, b$를 결정한다.",
  "decisiveStep": "$y=t$와의 교점이 $3$개인 $t$가 유일할 조건이 $M=b$임과 그 세 근의 합이 $-\\frac{a-1}{2}$임을 도출하는 단계",
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
  "conditionKeys": [
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "불연속 구간별 이차함수의 접선·경계 교점 수 조건과 근의 합을 모두 종합해 미정계수를 결정하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "구간별이차함수와직선의교점",
    "skill": "경계극값일치조건추론",
    "context": "불연속이차함수교점수"
  },
  "hold": ""
}
```

## Q16

- 형식: 서답형  
- 배점: 5

### 발문

다항식 \$P(x) \= x^3 - 4x^2 \+ 5x \+ 3\$을 \$x^2 - 5x \+ 6\$으로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(4)\$의 값을 구하시오.

### 선지

없음

### 정답

\$13\$

### 해설

\$x^2 - 5x \+ 6 \= (x - 2)(x - 3)\$이므로 나눗셈의 항등식을 세우면 (\$R(x) \= ax \+ b\$) \$\$x^3 - 4x^2 \+ 5x \+ 3 \= (x - 2)(x - 3)Q(x) \+ ax \+ b\$\$ 양변에 \$x \= 2\$, \$x \= 3\$을 각각 대입하면 \$\$\\begin{cases} 2a \+ b \= 8 - 16 \+ 10 \+ 3 \= 5 \\ 3a \+ b \= 27 - 36 \+ 15 \+ 3 \= 9 \\end{cases}\$\$ 두 식을 빼면 \$a \= 4\$, \$b \= \-3\$이므로 \$R(x) \= 4x - 3\$이다. 따라서 \$R(4) \= 4(4) - 3 \= 13\$이다.

```
"NONE"
```

```
{
  "sourceQid": "16",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-02",
  "subUnitKey": "H22-C-02-CORE",
  "conceptClusterKey": null,
  "primaryMethod": "이차식으로 나눈 나머지를 $ax+b$로 놓고 인수분해된 두 근 $x=2, 3$을 대입해 연립방정식으로 $R(x)$를 구한다.",
  "decisiveStep": "$x^2-5x+6=(x-2)(x-3)$의 두 근 $2, 3$을 대입해 $a, b$를 구하는 단계",
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
  "difficultyReason": "이차식으로 나눈 나머지 $ax+b$ 설정과 수치대입 연립을 수행하는 표준 단답형이다.",
  "level": "중",
  "item4slot": {
    "domain": "항등식과나머지정리",
    "concept": "나머지정리",
    "skill": "이차식나눗셈나머지결정",
    "context": "삼차식이차식나눗셈"
  },
  "hold": "RPM_ONLY"
}
```

## Q17

- 형식: 서답형  
- 배점: 5

### 발문

이차방정식 \$x^2 \+ 2ax \+ b \= 0\$은 중근을 갖고, 이차방정식 \$x^2 \+ 10x \+ b \= 0\$은 서로 다른 두 실근을 갖도록 하는 두 자연수 \$a, b\$의 순서쌍 \$(a, b)\$의 개수를 \$m\$, 가능한 모든 \$b\$의 값의 합을 \$n\$이라 할 때, \$m \+ n\$의 값을 구하시오.

### 선지

없음

### 정답

\$34\$

### 해설

첫 번째 방정식이 중근을 가지므로 판별식 \$\\frac{D\_1}{4} \= a^2 - b \= 0 \\implies b \= a^2\$이다. 두 번째 방정식이 서로 다른 두 실근을 가지므로 판별식 \$\\frac{D\_2}{4} \= 5^2 - b \> 0 \\implies b \< 25\$이다. \$a, b\$가 자연수이고 \$b \= a^2 \< 25\$이므로 가능한 순서쌍 \$(a, b)\$는 \$\$(1, 1), \\ (2, 4), \\ (3, 9), \\ (4, 16)\$\$ 따라서 \$m \= 4\$, \$n \= 1 \+ 4 \+ 9 \+ 16 \= 30\$이므로 \$\$m \+ n \= 4 \+ 30 \= 34\$\$

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
  "standardUnitKey": "H22-C-04",
  "subUnitKey": "H22-C-04-COMPLEX_OPERATION",
  "conceptClusterKey": null,
  "primaryMethod": "두 이차방정식의 판별식 조건 $b=a^2$과 $b<25$를 결합해 자연수 순서쌍을 모두 나열한다.",
  "decisiveStep": "$a^2=b<25$를 만족하는 자연수 $a \\in \\{1,2,3,4\\}$를 찾는 단계",
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
  "conditionKeys": [
    "COND_NATURAL_NUMBER"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 판별식 조건을 연립 부등식으로 결합하고 자연수 해를 세는 문항이다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의판별식",
    "skill": "판별식자연수순서쌍세기",
    "context": "두이차방정식근조건"
  },
  "hold": ""
}
```

## Q18

- 형식: 서답형  
- 배점: 5

### 발문

양수 \$m\$에 대하여 이차함수 \$y \= \-x^2 \+ m\$의 그래프와 직선 \$y \= 2x\$가 서로 다른 두 점 \$\\mathrm{A}, \\mathrm{B}\$에서 만난다. 두 점 \$\\mathrm{A}, \\mathrm{B}\$에서 \$x\$축에 내린 수선의 발을 각각 \$\\mathrm{C}, \\mathrm{D}\$라 할 때, 삼각형 \$\\mathrm{AOC}\$와 삼각형 \$\\mathrm{BOD}\$의 넓이의 합이 \$24\$이다. 이때 상수 \$m\$의 값을 구하시오. (단, \$\\mathrm{O}\$는 원점이다.)

### 선지

없음

### 정답

\$10\$

### 해설

두 식을 연립하면 \$-x^2 \+ m \= 2x \\implies x^2 \+ 2x - m \= 0\$이다. 이 이차방정식의 두 근을 \$\\alpha, \\beta\$라 하면 근과 계수의 관계에 의하여 \$\\alpha \+ \\beta \= \-2\$, \$\\alpha\\beta \= \-m\$이다. 두 점의 좌표는 \$\\mathrm{A}(\\alpha, 2\\alpha)\$, \$\\mathrm{B}(\\beta, 2\\beta)\$이므로 두 삼각형의 넓이의 합은 \$\$\\triangle\\mathrm{AOC} \+ \\triangle\\mathrm{BOD} \= \\frac{1}{2}\|\\alpha\|\|2\\alpha\| \+ \\frac{1}{2}\|\\beta\|\|2\\beta\| \= \\alpha^2 \+ \\beta^2 \= 24\$\$ 곱셈 공식의 변형에 의하여 \$\$\\alpha^2 \+ \\beta^2 \= (\\alpha \+ \\beta)^2 - 2\\alpha\\beta \= (-2)^2 - 2(-m) \= 4 \+ 2m \= 24\$\$ 따라서 \$2m \= 20\$이므로 \$m \= 10\$이다.

```
"NONE"
```

```
{
  "sourceQid": "18",
  "variationType": "NUMERIC",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "교점의 $x$좌표 $\\alpha, \\beta$로 두 직각삼각형의 넓이 합 $\\alpha^2+\\beta^2=24$를 세우고 근과 계수의 관계로 $m$을 구한다.",
  "decisiveStep": "부호와 무관하게 두 삼각형의 넓이 합이 $\\alpha^2+\\beta^2$으로 표현됨을 파악하는 단계",
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
  "difficultyReason": "포물선과 직선의 교점 좌표를 이용해 넓이의 합을 근과 계수의 관계 식으로 전환해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수와직선의위치관계",
    "skill": "교점삼각형넓이합계산",
    "context": "좌표평면삼각형넓이합"
  },
  "hold": ""
}
```

## Q19

- 형식: 서답형  
- 배점: 10

### 발문

서로 다른 두 복소수 \$\\alpha, \\beta\$가 다음 조건을 만족시킨다.

(가) \$\\alpha^2 \+ \\beta^2 - \\alpha - \\beta \+ 2 \= 0\$ (나) \$2\$ 이상의 모든 자연수 \$n\$에 대하여 \$\\alpha^{n+1} \+ \\beta^{n+1} - (\\alpha^n \+ \\beta^n) \+ \\alpha^{n-1} \+ \\beta^{n-1} \= 0\$

이때 \$\\alpha, \\beta\$의 값과 \$(\\alpha \+ \\alpha^2 \+ \\dots \+ \\alpha^{2025}) \+ (\\beta \+ \\beta^2 \+ \\dots \+ \\beta^{2025})\$의 값을 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$\\alpha, \\beta \= \\dfrac{1 \\pm \\sqrt{3}i}{2}\$, 식의 값: \$-2\$

### 해설

\$A \= \\alpha^2 - \\alpha \+ 1\$, \$B \= \\beta^2 - \\beta \+ 1\$이라 놓자. 조건 (가)는 \$A \+ B \= 0\$이고, 조건 (나)는 \$\\alpha^{n-1}A \+ \\beta^{n-1}B \= 0\$이다. \$n \= 2\$를 대입하면 \$\\alpha A \+ \\beta B \= 0\$이고, 여기서 \$\\beta(A \+ B) \= 0\$을 빼면 \$(\\alpha - \\beta)A \= 0\$이다. \$\\alpha \\neq \\beta\$이므로 \$A \= 0\$, \$B \= 0\$이다. 따라서 \$\\alpha, \\beta\$는 이차방정식 \$x^2 - x \+ 1 \= 0\$의 두 근이므로 \$\$\\alpha, \\beta \= \\frac{1 \\pm \\sqrt{3}i}{2}\$\$ 또한 \$x^3 \+ 1 \= (x \+ 1)(x^2 - x \+ 1\) \= 0\$에서 \$\\alpha^3 \= \-1, \\alpha^6 \= 1\$ 및 \$\\beta^3 \= \-1, \\beta^6 \= 1\$이고 연속한 \$6\$항의 합은 각각 \$0\$이다. \$2025 \= 6 \\times 337 \+ 3\$이므로 남는 \$3\$항씩만 계산하면 \$\$(\\alpha \+ \\alpha^2 \+ \\alpha^3) \+ (\\beta \+ \\beta^2 \+ \\beta^3) \= (\\alpha \+ \\beta) \+ (\\alpha^2 \+ \\beta^2) \+ (\\alpha^3 \+ \\beta^3)\$\$ 근과 계수의 관계에서 \$\\alpha \+ \\beta \= 1, \\alpha\\beta \= 1\$이므로 \$\\alpha^2 \+ \\beta^2 \= 1^2 - 2(1) \= \-1\$이고, \$\\alpha^3 \+ \\beta^3 \= \-1 \+ (-1) \= \-2\$이다. 따라서 구하는 값은 \$1 \+ (-1) \+ (-2) \= \-2\$이다.

```
"NONE"
```

```
{
  "sourceQid": "19",
  "variationType": "CONDITION",
  "standardCourse": "공통수학1",
  "courseKey": "H22-C1",
  "curriculum": "2022",
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_EQUATION",
  "conceptClusterKey": null,
  "primaryMethod": "조건 (가)와 (나)를 $A=\\alpha^2-\\alpha+1, B=\\beta^2-\\beta+1$의 선형 결합으로 정리해 $A=B=0$을 도출하고 $6$주기성을 이용해 $2025$항의 합을 구한다.",
  "decisiveStep": "$A+B=0$과 $\\alpha A+\\beta B=0$에서 $\\alpha \\neq \\beta$ 조건으로 $A=B=0$을 이끌어내는 단계",
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
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "점화식 형태의 항등식을 공통식으로 묶어 두 복소수가 같은 이차방정식의 근임을 논증하고 주기합을 구해야 한다.",
  "level": "중",
  "item4slot": {
    "domain": "복소수와이차방정식",
    "concept": "이차방정식의허근",
    "skill": "항등식논증후주기합",
    "context": "서술형두복소수합"
  },
  "hold": ""
}
```

## Q20

- 형식: 서답형  
- 배점: 10

### 발문

이차함수 \$y \= ax^2 \+ bx \+ c\$의 그래프와 직선 \$y \= 6mx \+ 3m^2 \+ 2m\$이 실수 \$m\$의 값에 관계없이 항상 접할 때, 상수 \$a, b, c\$의 값을 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$a \= \-3\$, \$b \= \-2\$, \$c \= \-\\dfrac{1}{3}\$

### 해설

두 식을 연립하여 정리하면 \$\$ax^2 \+ (b - 6m)x \+ (c - 3m^2 - 2m) \= 0\$\$ 항상 접하므로 판별식 \$D \= 0\$이어야 한다. \$\$D \= (b - 6m)^2 - 4a(c - 3m^2 - 2m) \= 0\$\$ \$\$b^2 - 12bm \+ 36m^2 - 4ac \+ 12am^2 \+ 8am \= 0\$\$ \$m\$에 대하여 내림차순으로 정리하면 \$\$(36 \+ 12a)m^2 \+ (8a - 12b)m \+ (b^2 - 4ac) \= 0\$\$ 이 식이 실수 \$m\$의 값에 관계없이 항상 성립해야 하므로 \$m\$에 대한 항등식이다.

1. \$36 \+ 12a \= 0 \\implies a \= \-3\$  
2. \$8(-3) - 12b \= 0 \\implies \-12b \= 24 \\implies b \= \-2\$  
3. \$(-2)^2 - 4(-3)c \= 0 \\implies 4 \+ 12c \= 0 \\implies c \= \-\\frac{1}{3}\$

따라서 \$a \= \-3\$, \$b \= \-2\$, \$c \= \-\\frac{1}{3}\$이다.

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
  "standardUnitKey": "H22-C-05",
  "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH",
  "conceptClusterKey": null,
  "primaryMethod": "접선 조건 $D=0$을 $m$에 대한 이차항등식으로 정리하여 $m^2, m$의 계수와 상수항이 모두 $0$이 되도록 $a, b, c$를 순차적으로 구한다.",
  "decisiveStep": "판별식을 $m$에 대하여 내림차순 정리한 세 계수를 차례로 $0$으로 놓는 단계",
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
  "difficultyReason": "접선 판별식 조건 후 매개변수에 대한 항등식 계수비교를 세 계수에 순차 적용하는 서술형이다.",
  "level": "중",
  "item4slot": {
    "domain": "이차방정식과이차함수",
    "concept": "이차함수와직선의위치관계",
    "skill": "판별식항등식계수결정",
    "context": "서술형매개변수접선"
  },
  "hold": ""
}
```

---

```
{
  "examId": "25_매산고_1학기_중간_고1_유사",
  "sourceExamId": "25_매산고_1학기_중간_고1_기출",
  "totalQuestions": 20,
  "mcqCount": 15,
  "essayCount": 5,
  "answerDistribution": {
    "1": 3,
    "2": 3,
    "3": 3,
    "4": 3,
    "5": 3
  },
  "maxConsecutiveSameChoice": 1,
  "scoreCheck": {
    "mcqScoreSum": 65.0,
    "essayScoreSum": 35.0,
    "totalScore": 100.0
  },
  "textExplicitImageReplacements": []
}
```

