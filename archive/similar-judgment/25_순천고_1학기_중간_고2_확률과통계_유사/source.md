

```
{"stem": "25_순천고_1학기_중간_고2_확률과통계_유사", "sourceArchiveFile": "original/high/h2/1mid/25_순천고_1학기_중간_고2_확률과통계.js", "examFolder": "1mid", "grade": "고2", "subject": "확률과 통계", "curriculum": "2022", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.5

### 발문

남학생 \$5\$명과 여학생 \$5\$명이 원 모양의 탁자에 둘러앉을 때, 남학생과 여학생이 교대로 앉는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$1440\$ ② \$2880\$ ③ \$3600\$ ④ \$5760\$ ⑤ \$14400\$

### 정답

②

### 해설

남학생 \$5\$명을 원형으로 먼저 배열하는 경우의 수는 \$(5-1)\!=4\!=24\$이다. 남학생 사이의 \$5\$개의 자리에 여학생 \$5\$명을 배열하는 경우의 수는 \$5\!=120\$이다. \$\$24\\times 120 \= 2880\$\$ 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q01",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "남학생 5명을 원순열 (5-1)!로 배치한 뒤 사이 5자리에 여학생 5!을 곱해 2880 계산",
  "decisiveStep": "(5-1)!*5!=24*120",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "교대 원순열의 공식 (n-1)!*n!을 바로 적용하는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "원순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 3.5

### 발문

\${}*{6}\\mathrm{C}*{2}+{}*{4}\\Pi*{3}+{}*{4}\\mathrm{H}*{3}\$의 값은?

### 선지

① \$89\$ ② \$94\$ ③ \$95\$ ④ \$99\$ ⑤ \$104\$

### 정답

④

### 해설

\$\${}*{6}\\mathrm{C}*{2}=15, \\quad {}*{4}\\Pi*{3}=4^3=64, \\quad {}*{4}\\mathrm{H}*{3}={}*{6}\\mathrm{C}*{3}=20\$\$ 따라서 \$15+64+20=99\$이다. 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q02",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "조합 6C2=15, 중복순열 4^3=64, 중복조합 6C3=20을 각각 계산해 99 합산",
  "decisiveStep": "6C2+4^3+6C3=15+64+20",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "조합·중복순열·중복조합의 정의를 단순 수치 계산으로 확인하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "조합"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "조합",
      "중복순열",
      "중복조합"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q03

- 형식: 객관식  
- 배점: 3.5

### 발문

그림과 같은 파스칼의 삼각형에서 색칠한 부분(\$r=2\$부터 \$r=10\$까지의 \${}*{r}\\mathrm{C}*{1}\$과 \${}*{r}\\mathrm{C}*{2}\$)에 있는 모든 수의 합은?

### 선지

① \$219\$ ② \$217\$ ③ \$220\$ ④ \$221\$ ⑤ \$225\$

### 정답

①

### 해설

색칠한 부분의 합은 \$\\sum\_{r=2}^{10}({}*{r}\\mathrm{C}*{1}+{}*{r}\\mathrm{C}*{2})\$이다. \$\$\\begin{aligned} \\sum\_{r=2}^{10}{}*{r}\\mathrm{C}*{1} &= 2+3+\\cdots+10 \= \\frac{9\\times 12}{2} \= 54 \\ \\sum\_{r=2}^{10}{}*{r}\\mathrm{C}*{2} &= {}*{11}\\mathrm{C}*{3} \= \\frac{11\\times 10\\times 9}{6} \= 165 \\end{aligned}\$\$ 따라서 구하는 합은 \$54+165=219\$이다. 정답은 ①이다.

```
{"figureType": "pascals_triangle_shaded", "description": "파스칼의 삼각형에서 r=2..10 행의 rC1과 rC2 열이 색칠된 그림", "elements": ["Pascal's triangle rows 0 to 10", "shaded entries rC1 and rC2 for r=2..10"]}
```

```
{
  "sourceQid": "Q03",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "파스칼 삼각형의 두 대각선 합을 자연수 합 54와 하키스틱 정리 11C3=165로 구해 219 산출",
  "decisiveStep": "sum_{r=2}^{10} rC2 = 11C3 = 165 적용",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항계수",
    "l4": "조합 항등식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY",
    "why": "이항계수 > 조합 항등식"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "파스칼의 삼각형에서 색칠된 영역을 조합의 성질(하키스틱 공식)로 합산하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "조합"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "이항정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q04

- 형식: 객관식  
- 배점: 3.5

### 발문

\$8\$명의 학생을 두 반 \$A,\\ B\$에 각각 적어도 한 명 이상 배정하는 방법의 수는?

### 선지

① \$248\$ ② \$250\$ ③ \$252\$ ④ \$256\$ ⑤ \$254\$

### 정답

⑤

### 해설

전체 배정 방법은 \$2^8=256\$가지이고, 한 반에만 모두 배정되는 \$2\$가지를 제외하면 \$256-2=254\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q04",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 중복순열 2^8=256에서 한 반에 몰리는 2가지를 빼 254 산출",
  "decisiveStep": "2^8 - 2 = 254",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "2개 선택지의 중복순열에서 공집합 2가지를 제외하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열",
      "여사건"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q05

- 형식: 객관식  
- 배점: 3.5

### 발문

\$100\<{}*{n}\\mathrm{C}*{1}+{}*{n}\\mathrm{C}*{2}+{}*{n}\\mathrm{C}*{3}+\\cdots+{}*{n}\\mathrm{C}*{n}\<200\$을 만족시키는 자연수 \$n\$의 값은?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

③

### 해설

\${}*{n}\\mathrm{C}*{1}+\\cdots+{}*{n}\\mathrm{C}*{n}=2^n-1\$이므로 \$100\<2^n-1\<200\$, 즉 \$101\<2^n\<201\$이다. \$2^6=64\$, \$2^7=128\$, \$2^8=256\$이므로 \$n=7\$이다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q05",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "이항계수 합 공식 2^n-1을 적용해 부등식 101<2^n<201에서 자연수 n=7 결정",
  "decisiveStep": "2^n-1 치환 후 2^7=128 확인",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항계수",
    "l4": "이항계수의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY",
    "why": "이항계수 > 이항계수의 성질"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이항계수의 합 2^n에서 nC0을 뺀 식을 부등식에 적용하는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "부등식",
      "이항정리"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "이항정리"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 3.5

### 발문

\${}*{18}\\mathrm{C}*{1}-{}*{18}\\mathrm{C}*{2}+{}*{18}\\mathrm{C}*{3}-\\cdots+{}*{18}\\mathrm{C}*{17}\$의 값은?

### 선지

① \$2\$ ② \$-2\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$

### 정답

①

### 해설

\$(1-1)^{18}={}*{18}\\mathrm{C}*{0}-{}*{18}\\mathrm{C}*{1}+{}*{18}\\mathrm{C}*{2}-\\cdots-{}*{18}\\mathrm{C}*{17}+{}*{18}\\mathrm{C}*{18}=0\$이다. 구하는 값을 \$S\$라 하면 \$1-S+1=0\$이므로 \$S=2\$이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q06",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "이항계수 교대합 항등식 sum (-1)^k 18Ck=0에서 양끝항 18C0=18C18=1을 분리해 S=2 산출",
  "decisiveStep": "1 - S + 1 = 0",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항계수",
    "l4": "이항계수의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY",
    "why": "이항계수 > 이항계수의 성질"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이항계수 교대합이 0임을 이용해 양 끝 항을 제외한 합을 구하는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이항정리"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "이항정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 3.5

### 발문

\$(1+2x)+(1+2x)^2+(1+2x)^3+\\cdots+(1+2x)^6\$의 전개식에서 \$x^3\$의 계수는?

### 선지

① \$240\$ ② \$260\$ ③ \$272\$ ④ \$280\$ ⑤ \$296\$

### 정답

④

### 해설

\$k\\ge 3\$인 항 \$(1+2x)^k\$에서 \$x^3\$의 계수는 \${}*{k}\\mathrm{C}*{3}\\cdot 2^3=8,{}*{k}\\mathrm{C}*{3}\$이다. \$\$8({}*{3}\\mathrm{C}*{3}+{}*{4}\\mathrm{C}*{3}+{}*{5}\\mathrm{C}*{3}+{}*{6}\\mathrm{C}*{3}) \= 8(1+4+10+20) \= 8\\times 35 \= 280\$\$ 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q07",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "k=3..6 각 항의 x^3 계수 8*kC3을 합산해 8*(1+4+10+20)=280 계산",
  "decisiveStep": "8*(3C3+4C3+5C3+6C3) 계산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항정리",
    "l4": "특정 항의 계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT",
    "why": "이항정리 > 특정 항의 계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "여러 거듭제곱식의 합에서 x^3 항이 나오는 항만 골라 계수를 합산하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "계수"
    ],
    "method": [
      "이항정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q08

- 형식: 객관식  
- 배점: 3.8

### 발문

한 개의 주사위를 \$3\$번 던져 \$n\$번째 나오는 눈의 수를 \$a\_n\$(\$n=1,\\ 2,\\ 3\$)이라 할 때, \$a\_1\\le a\_2\\le a\_3\$을 만족시키는 경우의 수는?

### 선지

① \$48\$ ② \$56\$ ③ \$64\$ ④ \$72\$ ⑤ \$84\$

### 정답

②

### 해설

\$1\$부터 \$6\$까지의 자연수에서 중복을 허용하여 \$3\$개를 택한 뒤 크기순으로 나열하면 되므로 \${}*{6}\\mathrm{H}*{3}={}*{8}\\mathrm{C}*{3}=56\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q08",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "비감소 조건 a1<=a2<=a3을 중복조합 6H3=8C3=56으로 환산",
  "decisiveStep": "6H3 = 8C3 = 56",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "단조비감소 수열의 개수를 중복조합 공식으로 즉시 계산하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "주사위",
      "부등식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q09

- 형식: 객관식  
- 배점: 3.8

### 발문

\$\\left(x+\\dfrac{1}{x}\\right)^5\\left(x-\\dfrac{1}{x}\\right)^5\$의 전개식에서 \$x^2\$의 계수는?

### 선지

① \$-10\$ ② \$-5\$ ③ \$5\$ ④ \$15\$ ⑤ \$10\$

### 정답

⑤

### 해설

주어진 식은 \$\\left{\\left(x+\\dfrac{1}{x}\\right)\\left(x-\\dfrac{1}{x}\\right)\\right}^5=\\left(x^2-\\dfrac{1}{x^2}\\right)^5\$이다. 일반항은 \${}*{5}\\mathrm{C}*{k}(x^2)^{5-k}\\left(-x^{-2}\\right)^k={}*{5}\\mathrm{C}*{k}(-1)^kx^{10-4k}\$이므로 \$10-4k=2\$에서 \$k=2\$이다. 따라서 \$x^2\$의 계수는 \${}*{5}\\mathrm{C}*{2}(-1)^2=10\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q09",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "합차 공식으로 (x^2-1/x^2)^5으로 묶은 뒤 일반항 지수 10-4k=2에서 k=2의 계수 10 계산",
  "decisiveStep": "(x+1/x)^5(x-1/x)^5 = (x^2-1/x^2)^5 변형",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항정리",
    "l4": "전개식의 항"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT",
    "why": "이항정리 > 전개식의 항"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "지수법칙과 합차 공식을 결합해 단일 이항식으로 줄인 뒤 특정 항의 계수를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "계수"
    ],
    "method": [
      "이항정리",
      "곱셈공식"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 3.8

### 발문

세 정수 \$x,\\ y,\\ z\$에 대하여 \$1\\le \|x\|\\le \|y\|\\le \|z\|\\le 5\$를 만족시키는 모든 순서쌍 \$(x,\\ y,\\ z)\$의 개수는?

### 선지

① \$140\$ ② \$210\$ ③ \$280\$ ④ \$350\$ ⑤ \$420\$

### 정답

③

### 해설

절댓값의 순서쌍 \$(\|x\|,\\ \|y\|,\\ \|z\|)\$의 개수는 \${}*{5}\\mathrm{H}*{3}={}*{7}\\mathrm{C}*{3}=35\$이다. 각 정수는 양수 또는 음수 \$2\$가지 부호를 가질 수 있으므로 전체 순서쌍의 개수는 \$35\\times 2^3=35\\times 8=280\$이다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q10",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "절댓값 크기순 선택 5H3=35에 각 변수의 부호 선택 2^3=8을 곱해 280 계산",
  "decisiveStep": "5H3 * 2^3 = 35 * 8",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "절댓값 대소 선택(중복조합)과 부호 선택(중복순열)을 곱의 법칙으로 결합하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "부등식",
      "정수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합",
      "절댓값"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 3.8

### 발문

반장, 부반장, 회장을 포함한 \$7\$명이 원 모양의 탁자에 일정한 간격을 두고 모두 둘러앉을 때, 반장의 양옆에 부반장과 회장이 앉는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$48\$ ② \$24\$ ③ \$96\$ ④ \$120\$ ⑤ \$240\$

### 정답

①

### 해설

반장을 한 자리에 고정하면 양옆에 부반장과 회장이 앉는 방법은 \$2\!\$가지, 나머지 \$4\$명이 남은 자리에 앉는 방법은 \$4\!\$가지이다. \$\$2\!\\times 4\! \= 2\\times 24 \= 48\$\$ 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q11",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "반장을 기준 위치에 고정하고 양옆 2!과 나머지 4명 배열 4!을 곱해 48 산출",
  "decisiveStep": "기준 고정 후 2! * 4! 계산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원순열에서 특정 인물의 양옆 이웃 조건을 묶음 또는 고정으로 처리하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "원순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q12

- 형식: 객관식  
- 배점: 3.8

### 발문

그림과 같이 가로 \$5\$칸, 세로 \$4\$칸인 직사각형 모양의 도로망이 있다. \$A(0,\\ 0)\$ 지점에서 출발하여 \$B(5,\\ 4)\$ 지점까지 최단 거리로 갈 때, 공사 중인 교차점 \$P(2,\\ 2)\$를 지나지 않고 가는 경우의 수는?

### 선지

① \$54\$ ② \$60\$ ③ \$63\$ ④ \$66\$ ⑤ \$72\$

### 정답

④

### 해설

\$A(0,\\ 0)\$에서 \$B(5,\\ 4)\$까지 최단 거리로 가는 전체 경우의 수는 \$\\dfrac{9\!}{5\!4\!}=126\$이다. \$P(2,\\ 2)\$를 거쳐 가는 경우의 수는 \$\\dfrac{4\!}{2\!2\!}\\times\\dfrac{5\!}{3\!2\!}=6\\times 10=60\$이다. 따라서 구하는 경우의 수는 \$126-60=66\$이다. 정답은 ④이다.

```
{"figureType": "grid_shortest_path_obstacle", "description": "5x4 격자 도로망에서 A(0,0)부터 B(5,4)까지, P(2,2) 지점 공사 표시", "elements": ["5x4 rectangular grid", "start A(0,0), end B(5,4)", "blocked node P(2,2)"]}
```

```
{
  "sourceQid": "Q12",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 최단경로 9C4=126에서 P(2,2) 경유 경로 4C2*5C2=60을 빼 66 계산",
  "decisiveStep": "9C4 - (4C2 * 5C2) = 126 - 60",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "격자 최단경로에서 장애물 지점을 지나는 경우를 여사건으로 빼는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "직사각형"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "같은것이있는순열",
      "여사건"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q13

- 형식: 객관식  
- 배점: 3.8

### 발문

중복을 허락하여 \$0,\\ 1,\\ 2,\\ 3,\\ 4\$의 \$5\$개의 숫자로 만든 네 자리의 자연수를 전송하려고 한다. 단, \$0\$이 연속으로 두 번 이상 있는 수는 전송이 불가능할 때, 전송이 가능한 수의 개수는?

### 선지

① \$460\$ ② \$464\$ ③ \$468\$ ④ \$472\$ ⑤ \$480\$

### 정답

②

### 해설

첫 자리에는 \$0\$이 올 수 없으므로 전체 네 자리 자연수의 개수는 \$4\\times 5^3=500\$이다. 둘째·셋째 자리가 \$00\$인 경우는 \$4\\times 5=20\$가지, 셋째·넷째 자리가 \$00\$인 경우는 \$4\\times 5=20\$가지, 둘째\~넷째 자리가 모두 \$0\$인 경우는 \$4\$가지이다. 따라서 제외할 개수는 \$20+20-4=36\$이고, 전송 가능한 수의 개수는 \$500-36=464\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q13",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 네 자리 수 4*5^3=500에서 00 연속 포함 경우 20+20-4=36을 포함배제로 제외해 464 계산",
  "decisiveStep": "연속 00의 두 위치 합집합 20+20-4=36 제외",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자연수 자리 제한과 연속 00 금지를 여사건 및 포함·배제 원리로 처리해야 하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열",
      "여사건"
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
- 배점: 3.8

### 발문

\$x,\\ y,\\ z\$가 음이 아닌 정수일 때, 방정식 \$x+y+z=n\$의 해의 개수가 \$105\$이다. 이때 자연수 \$n\$의 값은?

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$13\$

### 정답

⑤

### 해설

\${}*{3}\\mathrm{H}*{n}={}*{n+2}\\mathrm{C}*{2}=\\dfrac{(n+2)(n+1)}{2}=105\$이므로 \$(n+2)(n+1)=210=15\\times 14\$이다. 따라서 \$n+2=15\$에서 \$n=13\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q14",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "음이 아닌 정수해 개수 (n+2)C2=105를 풀어 (n+2)(n+1)=210에서 n=13 결정",
  "decisiveStep": "(n+2)(n+1)=210=15*14 인수분해",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 정수해 개수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음이 아닌 정수해 공식 3Hn=(n+2)C2에서 미지수 n을 역산하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "방정식"
    ],
    "goal": [
      "자연수"
    ],
    "method": [
      "중복조합"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 3.8

### 발문

\$\\left(x^2-\\dfrac{1}{x}\\right)^6\$의 전개식에서 \$x^6\$의 계수를 \$a\$, \$\\dfrac{1}{x^3}\$의 계수를 \$b\$라 할 때, \$a+b\$의 값은?

### 선지

① \$5\$ ② \$7\$ ③ \$9\$ ④ \$15\$ ⑤ \$21\$

### 정답

③

### 해설

일반항은 \${}*{6}\\mathrm{C}*{k}(x^2)^{6-k}\\left(-x^{-1}\\right)^k={}*{6}\\mathrm{C}*{k}(-1)^kx^{12-3k}\$이다. \$12-3k=6 \\implies k=2\$이므로 \$a={}*{6}\\mathrm{C}*{2}(-1)^2=15\$이고, \$12-3k=-3 \\implies k=5\$이므로 \$b={}*{6}\\mathrm{C}*{5}(-1)^5=-6\$이다. 따라서 \$a+b=15+(-6)=9\$이다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q15",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "일반항 6Ck(-1)^k x^(12-3k)에서 k=2(계수 15)와 k=5(계수 -6)를 구해 합 9 계산",
  "decisiveStep": "지수 12-3k=6 및 -3에서 k=2, 5 산출",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항정리",
    "l4": "특정 항의 계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT",
    "why": "이항정리 > 특정 항의 계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이항정리 일반항의 지수 방정식을 두 번 풀어 계수의 합을 구하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "이항정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 4.1

### 발문

두 집합 \$A={1,\\ 2,\\ 3,\\ 4,\\ 5}\$, \$B={1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6}\$에 대하여 \$a\\in A\$, \$b\\in A\$이고 \$a\<b\$이면 \$f(a)\\le f(b)\$를 만족시키는 함수 \$f:A\\to B\$ 중에서 \$f(1)f(3)=10\$을 만족시키는 함수 \$f\$의 개수는?

### 선지

① \$12\$ ② \$10\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

①

### 해설

\$f(1)\\le f(3)\$이고 \$f(1),\\ f(3)\\in{1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6}\$이므로 \$f(1)f(3)=10\$을 만족시키는 경우는 \$f(1)=2,\\ f(3)=5\$뿐이다. \$2\\le f(2)\\le 5\$이므로 \$f(2)\$는 \$4\$가지, \$5\\le f(4)\\le f(5)\\le 6\$이므로 \${}*{2}\\mathrm{H}*{2}={}*{3}\\mathrm{C}*{2}=3\$가지이다. 따라서 함수 \$f\$의 개수는 \$4\\times 3=12\$이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q16",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "f(1)f(3)=10에서 f(1)=2, f(3)=5를 고정하고 f(2) 4가지와 (f(4),f(5)) 2H2=3가지를 곱해 12 산출",
  "decisiveStep": "f(1)=2, f(3)=5 유일 결정 후 구간별 독립 선택",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "단조비감소 함수의 치역 곱 조건으로 중간 경계값을 고정한 뒤 양쪽 구간을 중복조합으로 세는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q17

- 형식: 객관식  
- 배점: 4.1

### 발문

\$1\$부터 \$7\$까지의 자연수가 각각 하나씩 적혀 있는 \$7\$장의 카드가 있다. 이 카드를 모두 한 번씩 사용하여 일렬로 배열할 때, 다음 조건을 모두 만족시키는 경우의 수는? (가) \$3\$은 \$5\$보다 왼쪽에 배열한다. (나) 짝수는 왼쪽에서부터 작은 수 순서대로 배열한다.

### 선지

① \$210\$ ② \$280\$ ③ \$360\$ ④ \$420\$ ⑤ \$840\$

### 정답

④

### 해설

전체 배열 \$7\!\$가지 중에서 짝수 \$2,\\ 4,\\ 6\$의 상대적 순서가 고정되므로 \$3\!\$로 나누고, \$3\$과 \$5\$의 상대적 순서가 고정되므로 \$2\!\$로 나눈다. \$\$\\frac{7\!}{3\!\\times 2\!} \= \\frac{5040}{6\\times 2} \= 420\$\$ 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q17",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 7!을 짝수 3개 순서 고정(3!)과 두 수 3,5 순서 고정(2!)으로 나누어 420 계산",
  "decisiveStep": "7! / (3! * 2!) = 420",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "서로 분리된 두 부분집합의 상대적 순서가 모두 고정된 경우를 같은 것이 있는 순열로 푸는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "같은것이있는순열"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 4.1

### 발문

\$4,\\ 5,\\ 6,\\ 7,\\ 8\$의 숫자가 적힌 \$5\$개의 구슬을 \$3\$개의 바구니 \$A,\\ B,\\ C\$에 넣으려고 한다. 어느 바구니에도 넣어진 구슬에 적힌 수의 합이 \$26\$ 이상이 되는 경우가 없도록 구슬을 넣는 방법의 수는?

### 선지

① \$231\$ ② \$234\$ ③ \$237\$ ④ \$240\$ ⑤ \$243\$

### 정답

②

### 해설

다섯 수의 총합은 \$4+5+6+7+8=30\$이므로 전체 배치 \$3^5=243\$가지에서 한 바구니의 합이 \$26\$ 이상이 되는 경우를 뺀다. 특정 바구니의 합이 \$26\$ 이상이 되려면 나머지 구슬의 합이 \$4\$ 이하여야 하므로 모든 구슬이 그 바구니에 들어가거나(\$1\$가지), \$4\$만 다른 두 바구니 중 하나에 들어가야 한다(\$2\$가지). 바구니가 \$3\$개이고 동시에 두 바구니가 \$26\$ 이상일 수 없으므로 제외할 경우는 \$3\\times 3=9\$가지이다. 따라서 \$243-9=234\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q18",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 3^5=243에서 한 바구니 합이 26 이상(외부 합<=4)인 3*3=9가지를 여사건으로 빼 234 계산",
  "decisiveStep": "합>=26 조건을 여사건 '바깥 합<=4'로 전환해 3*(1+2)=9 산출",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "총합의 여집합을 이용해 각 바구니의 합 상한 조건을 여사건으로 간단히 세는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합",
      "부등식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열",
      "여사건"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q19

- 형식: 객관식  
- 배점: 4.1

### 발문

집합 \$X={1,\\ 2,\\ 3,\\ 4,\\ 5}\$에 대하여 다음 조건을 만족시키는 함수 \$f:X\\to X\$의 개수는? (가) \$f(2)+f(4)\$의 값은 홀수이다. (나) \$f(1)\\times f(3)\\times f(5)\$의 값은 짝수이다.

### 선지

① \$1080\$ ② \$1120\$ ③ \$1152\$ ④ \$1164\$ ⑤ \$1176\$

### 정답

⑤

### 해설

\$X\$에는 홀수 \$3\$개(\$1,\\ 3,\\ 5\$), 짝수 \$2\$개(\$2,\\ 4\$)가 있다. (가) \$f(2)+f(4)\$가 홀수인 경우는 (홀수, 짝수) 또는 (짝수, 홀수)이므로 \$3\\times 2+2\\times 3=12\$가지이다. (나) \$f(1)f(3)f(5)\$가 짝수인 경우는 전체 \$5^3=125\$에서 모두 홀수인 경우 \$3^3=27\$을 뺀 \$98\$가지이다. 따라서 구하는 함수의 개수는 \$12\\times 98=1176\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q19",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "(f(2),f(4)) 합 홀수 12가지와 (f(1),f(3),f(5)) 곱 짝수 5^3-3^3=98가지를 곱해 1176 산출",
  "decisiveStep": "(3*2+2*3) * (5^3-3^3) = 12 * 98",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "독립된 두 정의역 부분의 홀짝 합 조건과 곱 조건(여사건)을 곱의 법칙으로 결합하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열",
      "여사건"
    ],
    "condition": [
      "홀수",
      "짝수"
    ]
  },
  "hold": ""
}
```

## Q20

- 형식: 객관식  
- 배점: 4.1

### 발문

집합 \$X={1,\\ 2,\\ 3,\\ 6}\$에 대하여 \$f(1)+f(2)+f(3)+f(6)\\ge 7\$을 만족시키는 함수 \$f:X\\to X\$의 개수는?

### 선지

① \$237\$ ② \$239\$ ③ \$241\$ ④ \$243\$ ⑤ \$245\$

### 정답

③

### 해설

전체 함수의 개수는 \$4^4=256\$이다. 합이 \$6\$ 이하인 여사건을 세기 위해 각 함숫값에서 \$1\$을 뺀 증가분 \$0,\\ 1,\\ 2,\\ 5\$의 합이 \$2\$ 이하인 경우를 센다. 증가분 합이 \$0\$인 경우 \$1\$가지, \$1\$인 경우 \$4\$가지, \$2\$인 경우는 \$(1,\\ 1,\\ 0,\\ 0)\$ 형태 \${}*{4}\\mathrm{C}*{2}=6\$가지와 \$(2,\\ 0,\\ 0,\\ 0)\$ 형태 \$4\$가지로 총 \$10\$가지이다. 따라서 제외할 경우는 \$1+4+10=15\$가지이므로 구하는 함수의 개수는 \$256-15=241\$이다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q20",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 4^4=256에서 네 함숫값 합<=6(1 기준 증가분 합<=2)인 1+4+6+4=15가지를 빼 241 계산",
  "decisiveStep": "증가분 {0,1,2,5}의 합<=2 경우를 (0), (1), (1+1), (2)로 누락 없이 분류",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": null,
    "why": "순열 > 중복·원순열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "여사건으로 전환한 뒤 비등간격 치역 원소들의 합 제한 경우를 빠짐없이 분할해 세어야 하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합",
      "함수",
      "부등식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "여사건",
      "중복순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q21

- 형식: 객관식  
- 배점: 4.1

### 발문

다음 조건을 만족시키는 음이 아닌 정수 \$a,\\ b,\\ c,\\ d,\\ e\$의 모든 순서쌍 \$(a,\\ b,\\ c,\\ d,\\ e)\$의 개수는? (가) \$a(b+c+d+e)=10\$ (나) \$d\\ge 2c\$

### 선지

① \$156\$ ② \$148\$ ③ \$152\$ ④ \$160\$ ⑤ \$164\$

### 정답

①

### 해설

\$a\$는 \$10\$의 양의 약수이므로 \$a\\in{1,\\ 2,\\ 5,\\ 10}\$이고, \$s=b+c+d+e\$는 각각 \$10,\\ 5,\\ 2,\\ 1\$이다. \$d'=d-2c\\ge 0\$으로 놓으면 \$b+d'+e=s-3c\$이므로 고정된 \$c\$마다 \${}*{s-3c+2}\\mathrm{C}*{2}\$가지이다. \$\$\\begin{aligned} s=10 &: {}*{12}\\mathrm{C}*{2}+{}*{9}\\mathrm{C}*{2}+{}*{6}\\mathrm{C}*{2}+{}*{3}\\mathrm{C}*{2} \= 66+36+15+3 \= 120 \\ s=5 &: {}*{7}\\mathrm{C}*{2}+{}*{4}\\mathrm{C}*{2} \= 21+6 \= 27 \\ s=2 &: {}*{4}\\mathrm{C}*{2} \= 6, \\quad s=1 : {}*{3}\\mathrm{C}*{2} \= 3 \\end{aligned}\$\$ 따라서 전체 순서쌍의 개수는 \$120+27+6+3=156\$이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q21",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "a를 10의 약수 1,2,5,10으로 분류하고 d'=d-2c>=0 치환 후 c별 3H_{s-3c} 합산해 156 도출",
  "decisiveStep": "d'=d-2c>=0 치환으로 b+d'+e=s-3c(c>=0)의 중복조합 합산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 정수해 개수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "약수 분류와 선형 부등식 치환(d>=2c) 및 c 값별 중복조합 합산을 모두 수행해야 하는 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "방정식",
      "부등식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합",
      "약수"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```

## Q22

- 형식: 서답형  
- 배점: 6.5

### 발문

\[서술형 1\] 그림과 같이 좌표평면 위에서 상·하 또는 좌·우 방향으로 한 번에 \$1\$만큼씩 움직이는 점 \$P\$가 있다. 원점 \$O\$에서 출발한 점 \$P\$가 \$7\$번 움직여서 최종 위치가 점 \$A(2,\\ 1)\$이 되는 경우의 수를 자세한 풀이와 함께 서술하시오.

### 선지

없음

### 정답

735

### 해설

오른쪽, 왼쪽, 위쪽, 아래쪽 이동 횟수를 각각 \$R,\\ L,\\ U,\\ D\$라 하면 \$R-L=2\$, \$U-D=1\$, \$R+L+U+D=7\$이다. \$(L+2)+L+(D+1)+D=7 \\implies L+D=2\$이므로 가능한 \$(L,\\ D)\$는 \$(0,\\ 2)\$, \$(1,\\ 1)\$, \$(2,\\ 0)\$이다. \$\$\\begin{aligned} (R,L,U,D)=(2,0,3,2) &: \\frac{7\!}{2\!0\!3\!2\!} \= 210 \\ (R,L,U,D)=(3,1,2,1) &: \\frac{7\!}{3\!1\!2\!1\!} \= 420 \\ (R,L,U,D)=(4,2,1,0) &: \\frac{7\!}{4\!2\!1\!0\!} \= 105 \\end{aligned}\$\$ 따라서 구하는 경우의 수는 \$210+420+105=735\$이다.

```
{"figureType": "coordinate_grid_4dir", "description": "좌표평면 위의 격자에서 원점 O(0,0)와 목표점 A(2,1)", "elements": ["coordinate grid", "origin O(0,0)", "target A(2,1)", "4-direction arrows"]}
```

```
{
  "sourceQid": "Q22",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "네 방향 이동 횟수 연립식으로 L+D=2를 구하고 세 경우의 같은 것이 있는 순열 210+420+105=735 계산",
  "decisiveStep": "R=L+2, U=D+1을 총합 7에 대입해 L+D=2 도출",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "4방향 이동 횟수 방정식을 세워 가능한 조합을 나열한 뒤 같은 것이 있는 순열로 합산하는 서술형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "원점",
      "점"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "같은것이있는순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q23

- 형식: 서답형  
- 배점: 7.0

### 발문

\[서술형 2\] 순천고등학교 축제에 제일고 학생 \$2\$명, 팔마고 학생 \$3\$명, 순천여고 학생 \$2\$명이 참가하여 각 학생이 한 번씩 차례대로 공연하려고 한다. 이 \$7\$명의 공연 순서를 다음 조건을 만족시키도록 정하는 경우의 수를 자세한 풀이와 함께 서술하시오. (가) 순천여고 학생끼리는 서로 이웃하여 공연한다. (나) 팔마고 학생끼리는 \$2\$명 이상 연속하여 공연하지 않는다.

### 선지

없음

### 정답

288

### 해설

순천여고 학생 \$2\$명을 한 묶음으로 보면 팔마고 학생이 아닌 단위는 순천여고 묶음 \$1\$개와 제일고 학생 \$2\$명으로 총 \$3\$개이다. 이 \$3\$개 단위를 배열하고 묶음 내부 순서를 정하는 경우의 수는 \$3\!\\times 2\!=12\$이다. \$3\$개 단위의 양 끝과 사이 총 \$4\$개의 빈자리 중 \$3\$곳을 골라 팔마고 학생 \$3\$명을 배열하는 경우의 수는 \${}*{4}\\mathrm{P}*{3}=24\$이다. 따라서 구하는 경우의 수는 \$12\\times 24=288\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q23",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "순천여고 2명을 한 묶음으로 하여 제일고 2명과 3!*2!로 배열한 뒤 4개 빈자리에 팔마고 3명을 4P3으로 끼워 288 계산",
  "decisiveStep": "이웃 묶음 우선 배열(3!*2!) 후 비이웃 3명 사이 끼워넣기(4P3)",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이웃 조건(묶기)과 비이웃 조건(사이 끼워넣기)을 충돌 없이 순서대로 적용해야 하는 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q24

- 형식: 서답형  
- 배점: 7.0

### 발문

\[서술형 3\] 집합 \$X={1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6}\$에 대하여 다음 조건을 만족시키는 함수 \$f:X\\to X\$의 개수를 자세한 풀이와 함께 서술하시오. (가) \$x=1,\\ 2,\\ 3,\\ 4,\\ 5\$일 때, \$f(x)\\le f(x+1)\$이다. (나) \$x\$가 \$6\$의 약수이면 \$(f\\circ f)(x)=x\$이다.

### 선지

없음

### 정답

10

### 해설

조건 (가)에 의해 \$f(1)\\le f(2)\\le f(3)\\le f(4)\\le f(5)\\le f(6)\$이다. 만약 \$f(1)\>1\$이면 \$f(f(1))\\ge f(1)\>1\$이 되어 \$f(f(1))=1\$에 모순이므로 \$f(1)=1\$이다. 같은 방식으로 \$6\$의 약수 \$x\\in{1,\\ 2,\\ 3,\\ 6}\$에 대해 \$f(x)\<x\$이면 \$f(f(x))\\le f(x)\<x\$, \$f(x)\>x\$이면 \$f(f(x))\\ge f(x)\>x\$가 되어 모순이므로 \$f(1)=1,\\ f(2)=2,\\ f(3)=3,\\ f(6)=6\$으로 고정된다. 남은 \$f(4),\\ f(5)\$는 \$3=f(3)\\le f(4)\\le f(5)\\le f(6)=6\$을 만족시키면 되므로 \${3,\\ 4,\\ 5,\\ 6}\$에서 중복을 허용하여 \$2\$개를 택하는 \${}*{4}\\mathrm{H}*{2}={}*{5}\\mathrm{C}*{2}=10\$가지이다. 따라서 구하는 함수의 개수는 \$10\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q24",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "단조성과 f(f(x))=x 대합 조건의 모순 판정으로 f(1)=1, f(2)=2, f(3)=3, f(6)=6을 고정한 뒤 4H2=10 계산",
  "decisiveStep": "단조증가 함수에서 f(f(x))=x이면 f(x)=x임을 증명해 약수 함숫값 고정",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "단조성 조건과 합성 항등식 (f o f)(x)=x로부터 약수 지점의 고정점을 논리적으로 증명해야 하는 최고난도 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "집합",
      "함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합"
    ],
    "condition": [
      "약수"
    ]
  },
  "hold": ""
}
```

