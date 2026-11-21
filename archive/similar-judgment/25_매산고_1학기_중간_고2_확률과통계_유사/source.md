

```
{"stem": "25_매산고_1학기_중간_고2_확률과통계_유사", "sourceArchiveFile": "original/high/h2/1mid/25_매산고_1학기_중간_고2_확률과통계.js", "examFolder": "1mid", "grade": "고2", "subject": "확률과 통계", "curriculum": "2022", "questionCount": 20, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 4

### 발문

\${}*{3}\\Pi*{4}+{}*{5}\\mathrm{H}*{3}\$의 값은?

### 선지

① \$116\$ ② \$109\$ ③ \$102\$ ④ \$96\$ ⑤ \$84\$

### 정답

①

### 해설

중복순열과 중복조합의 정의에 따라 각각 계산한다.

\$\$\\begin{aligned} {}*{3}\\Pi*{4} &= 3^4 \= 81 \\ {}*{5}\\mathrm{H}*{3} &= {}*{5+3-1}\\mathrm{C}*{3} \= {}*{7}\\mathrm{C}*{3} \= \\frac{7\\cdot6\\cdot5}{3\\cdot2\\cdot1} \= 35 \\end{aligned}\$\$

따라서 \${}*{3}\\Pi*{4}+{}*{5}\\mathrm{H}*{3}=81+35=116\$이다. 정답은 ①이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "중복순열 3^4=81과 중복조합 7C3=35를 각각 계산해 합산",
  "decisiveStep": "5H3을 7C3으로 변환해 81+35 계산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_REPEATED_PERMUTATION",
    "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "중복순열과 중복조합의 기본 공식을 바로 적용하는 단순 계산 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "합"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "중복순열",
      "중복조합"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

5명의 학생에게 같은 종류의 책 4권을 나누어 주는 경우의 수는? (단, 책을 받지 못하는 학생이 있을 수 있다.)

### 선지

① \$60\$ ② \$70\$ ③ \$80\$ ④ \$90\$ ⑤ \$100\$

### 정답

②

### 해설

서로 다른 5명의 학생에게 같은 종류의 책 4권을 중복을 허용하여 나누어 주는 것은 방정식 \$x\_1+x\_2+x\_3+x\_4+x\_5=4\$의 음이 아닌 정수해의 개수와 같다.

\$\${}*{5}\\mathrm{H}*{4} \= {}*{5+4-1}\\mathrm{C}*{4} \= {}*{8}\\mathrm{C}*{4} \= \\frac{8\\cdot7\\cdot6\\cdot5}{4\\cdot3\\cdot2\\cdot1} \= 70\$\$

따라서 정답은 ②이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "서로 다른 5명에게 같은 책 4권을 나누어 주는 중복조합 5H4=8C4=70 계산",
  "decisiveStep": "빈 몫 허용 분배를 중복조합 5H4로 대응",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "같은 물건의 중복 허용 분배에 중복조합 공식을 바로 대입하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "개수"
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

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

표본공간 \$S\$의 두 사건 \$A\$, \$B\$가 서로 배반사건이고 \$A\\cup B=S\$이다. \$P(A)=\\dfrac{3}{5}\$일 때, \$P(B)\$는?

### 선지

① \$\\frac{1}{5}\$ ② \$\\frac{3}{10}\$ ③ \$\\frac{2}{5}\$ ④ \$\\frac{1}{2}\$ ⑤ \$\\frac{3}{5}\$

### 정답

③

### 해설

\$A\$와 \$B\$가 서로 배반사건이므로 \$P(A\\cup B)=P(A)+P(B)\$이다. 또 \$A\\cup B=S\$이므로 \$P(A\\cup B)=P(S)=1\$이다.

\$\$P(B) \= 1 - P(A) \= 1 - \\frac{3}{5} \= \\frac{2}{5}\$\$

따라서 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q03",
  "variationType": "NUMERIC",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-03",
  "subUnitKey": "H22-PS-03-PROBABILITY_APPLICATION",
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "배반사건이면서 합사건이 표본공간 S인 두 사건에서 P(B)=1-P(A)=2/5 계산",
  "decisiveStep": "A∩B=∅, A∪B=S로부터 P(A)+P(B)=1 도출",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률의 뜻과 활용",
    "l3": "확률의 덧셈정리",
    "l4": "배반사건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_EVENT_RELATION_COMPLEMENT_ADDITION",
    "why": "확률의 덧셈정리 > 배반사건 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "배반사건과 여사건의 성질을 바로 적용하는 개념 확인 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "배반사건",
      "합집합",
      "표본공간"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "여사건",
      "확률의덧셈정리"
    ],
    "condition": [
      "배반사건"
    ]
  },
  "hold": ""
}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

1부터 80까지의 자연수 중에서 하나의 수를 선택할 때, 선택된 수가 3의 배수이거나 5의 배수일 확률은?

### 선지

① \$\\frac{17}{40}\$ ② \$\\frac{9}{20}\$ ③ \$\\frac{39}{80}\$ ④ \$\\frac{37}{80}\$ ⑤ \$\\frac{1}{2}\$

### 정답

④

### 해설

3의 배수인 사건을 \$A\$, 5의 배수인 사건을 \$B\$라 하면 \$A\\cap B\$는 15의 배수인 사건이다. 80 이하의 자연수 중 각 배수의 개수는

\$\$n(A)=\\left\\lfloor\\frac{80}{3}\\right\\rfloor=26, \\quad n(B)=\\left\\lfloor\\frac{80}{5}\\right\\rfloor=16, \\quad n(A\\cap B)=\\left\\lfloor\\frac{80}{15}\\right\\rfloor=5\$\$

이므로 \$n(A\\cup B)=26+16-5=37\$이다. 따라서 구하는 확률은 \$\\frac{37}{80}\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-PS-03",
  "subUnitKey": "H22-PS-03-PROBABILITY_BASIC",
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "80 이하 3의 배수(26개)와 5의 배수(16개)에서 15의 배수(5개)를 뺀 포함배제 확률 37/80 계산",
  "decisiveStep": "공배수(15의 배수) 5개를 중복 제외하여 n(A∪B)=37 도출",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률의 뜻과 활용",
    "l3": "확률의 기본",
    "l4": "표본공간과 사건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "확률의 기본 > 표본공간과 사건 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "덧셈정리로 3의 배수, 5의 배수, 15의 배수 개수를 세어 확률을 구하는 표준 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "확률의덧셈정리",
      "포함배제의원리"
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

빨간 공 4개, 노란 공 3개, 파란 공 2개가 들어있는 상자에서 임의로 2개의 공을 동시에 꺼낼 때, 서로 다른 색의 공을 꺼낼 확률은?

### 선지

① \$\\frac{5}{9}\$ ② \$\\frac{11}{18}\$ ③ \$\\frac{2}{3}\$ ④ \$\\frac{17}{18}\$ ⑤ \$\\frac{13}{18}\$

### 정답

⑤

### 해설

전체 공은 \$4+3+2=9\$개이므로 2개의 공을 꺼내는 전체 경우의 수는 \${}*{9}\\mathrm{C}*{2}=36\$이다. 여사건은 같은 색의 공 2개를 꺼내는 경우이므로

\$\${}*{4}\\mathrm{C}*{2}+{}*{3}\\mathrm{C}*{2}+{}*{2}\\mathrm{C}*{2} \= 6+3+1 \= 10\$\$

이다. 따라서 서로 다른 색의 공을 꺼낼 확률은

\$\$1 - \\frac{10}{36} \= \\frac{26}{36} \= \\frac{13}{18}\$\$

이다. 정답은 ⑤이다.

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
  "standardUnitKey": "H22-PS-03",
  "subUnitKey": "H22-PS-03-PROBABILITY_APPLICATION",
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "전체 9C2=36에서 같은 색 2개를 뽑는 여사건(4C2+3C2+2C2=10)을 빼서 13/18 계산",
  "decisiveStep": "여사건으로 같은 색 2개 경우의 수 10을 구해 1-10/36 적용",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률의 뜻과 활용",
    "l3": "확률의 덧셈정리",
    "l4": "여사건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_EVENT_RELATION_COMPLEMENT_ADDITION",
    "why": "확률의 덧셈정리 > 여사건 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "조합 계산과 여사건 확률을 결합해 서로 다른 색을 뽑을 확률을 구하는 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "개수"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "조합",
      "여사건"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q06

- 형식: 객관식  
- 배점: 4.5

### 발문

5개의 숫자 \$1, 2, 3, 4, 5\$ 중에서 중복을 허락하여 네 자리 비밀번호를 만들 때, \$5\$는 한 번만 들어가고, 마지막 자리가 소수인 비밀번호의 개수는?

### 선지

① \$144\$ ② \$160\$ ③ \$176\$ ④ \$192\$ ⑤ \$208\$

### 정답

②

### 해설

1부터 5까지의 숫자 중 소수는 \$2, 3, 5\$이다. 마지막 자리의 숫자에 따라 경우를 나눈다.

1. 마지막 자리가 \$5\$인 경우: 앞의 세 자리에는 \$5\$를 제외한 \$1, 2, 3, 4\$ 중에서 중복을 허락하여 넣으므로 \$4^3=64\$가지이다.  
2. 마지막 자리가 \$2\$ 또는 \$3\$인 경우 (\$2\$가지): 앞의 세 자리 중 \$5\$가 들어갈 1자리를 정하는 경우는 \$3\$가지이고, 나머지 두 자리에는 \$1, 2, 3, 4\$가 들어가므로 \$2\\times 3\\times 4^2 \= 96\$가지이다.

따라서 구하는 비밀번호의 개수는 \$64+96=160\$이다. 정답은 ②이다.

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
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "마지막 자리 소수(5 vs 2·3)로 경우를 나누어 5가 정확히 1회 포함되는 중복순열 합산",
  "decisiveStep": "마지막 자리가 5인지(64) 2·3인지(96)로 분류해 중복 없이 계산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_REPEATED_PERMUTATION",
    "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소수 조건과 특정 숫자 1회 등장 조건이 겹쳐 마지막 자리 기준 2가지 케이스 분기가 필요하다.",
  "level": "중",
  "item4slot": {
    "given": [
      "개수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열",
      "합의법칙"
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
- 배점: 4.5

### 발문

\$(1+2x)+(1+2x)^2+(1+2x)^3+\\cdots+(1+2x)^6\$의 전개식에서 \$x^3\$의 계수는?

### 선지

① \$280\$ ② \$240\$ ③ \$320\$ ④ \$360\$ ⑤ \$400\$

### 정답

①

### 해설

\$(1+2x)^k\$ (\$3\\le k\\le 6\$)의 전개식에서 \$x^3\$의 계수는 \${}*{k}\\mathrm{C}*{3}\\cdot 2^3 \= 8\\cdot{}*{k}\\mathrm{C}*{3}\$이다. 따라서 전체 전개식에서 \$x^3\$의 계수는

\$\$8\\left({}*{3}\\mathrm{C}*{3}+{}*{4}\\mathrm{C}*{3}+{}*{5}\\mathrm{C}*{3}+{}*{6}\\mathrm{C}*{3}\\right) \= 8(1+4+10+20) \= 8\\cdot 35 \= 280\$\$

이다. (하키스틱 항등식 \${}*{3}\\mathrm{C}*{3}+\\cdots+{}*{6}\\mathrm{C}*{3}={}*{7}\\mathrm{C}*{4}=35\$ 이용 가능) 정답은 ①이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "각 거듭제곱 항 (1+2x)^k의 x^3 계수 8*C(k,3)을 k=3~6에 대해 합산(하키스틱 항등식)",
  "decisiveStep": "8*(3C3+4C3+5C3+6C3)=8*7C4=280 계산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항계수",
    "l4": "이항계수의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_COEFFICIENT_IDENTITY",
    "why": "이항계수 > 이항계수의 성질 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이항정리 일반항과 조합의 합(하키스틱 항등식)을 연결해 계수를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식",
      "합"
    ],
    "goal": [
      "계수"
    ],
    "method": [
      "이항정리",
      "하키스틱항등식"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q08

- 형식: 객관식  
- 배점: 4.5

### 발문

주사위를 5번 던져 \$n\$번째 나오는 눈을 \$a\_n\$ \$(n=1,2,3,4,5)\$이라고 하자. \$a\_1\\le a\_2\\le a\_3\\le a\_4\\le a\_5\$인 경우의 수는?

### 선지

① \$126\$ ② \$210\$ ③ \$240\$ ④ \$252\$ ⑤ \$300\$

### 정답

④

### 해설

주사위의 눈 \$1, 2, 3, 4, 5, 6\$ 중에서 중복을 허락하여 5개를 택하면 크기 순서대로 \$a\_1\\le a\_2\\le a\_3\\le a\_4\\le a\_5\$로 유일하게 대응된다. 따라서 경우의 수는

\$\${}*{6}\\mathrm{H}*{5} \= {}*{6+5-1}\\mathrm{C}*{5} \= {}*{10}\\mathrm{C}*{5} \= \\frac{10\\cdot9\\cdot8\\cdot7\\cdot6}{5\\cdot4\\cdot3\\cdot2\\cdot1} \= 252\$\$

이다. 정답은 ④이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "등호 포함 단조증가 부등식 a1<=...<=a5의 해 개수를 중복조합 6H5=10C5=252로 계산",
  "decisiveStep": "크기 순서가 고정되어 중복 선택만 하면 되는 6H5 대응",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "등호가 포함된 순서 조건을 중복조합으로 바로 모델링하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "개수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합"
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
- 배점: 4.5

### 발문

\$\\left(x+\\dfrac{1}{x}\\right)^5\\left(x-\\dfrac{1}{x}\\right)^5\$의 전개식에서 \$x^2\$의 계수는?

### 선지

① \$5\$ ② \$8\$ ③ \$10\$ ④ \$15\$ ⑤ \$20\$

### 정답

③

### 해설

지수법칙과 합차공식을 이용하면 식을 하나로 묶을 수 있다.

\$\$\\left(x+\\frac{1}{x}\\right)^5\\left(x-\\frac{1}{x}\\right)^5 \= \\left(x^2-\\frac{1}{x^2}\\right)^5\$\$

이 전개식의 일반항은

\$\${}*{5}\\mathrm{C}*{r}(x^2)^{5-r}\\left(-\\frac{1}{x^2}\\right)^r \= {}*{5}\\mathrm{C}*{r}(-1)^r x^{10-4r}\$\$

이다. \$x^2\$항이 되려면 \$10-4r=2\$에서 \$r=2\$이므로 \$x^2\$의 계수는 \${}*{5}\\mathrm{C}*{2}(-1)^2 \= 10\$이다. 정답은 ③이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "합차공식으로 (x^2-1/x^2)^5로 묶은 뒤 이항정리 일반항에서 10-4r=2(r=2) 대입",
  "decisiveStep": "두 5제곱의 곱을 (x^2-x^-2)^5로 합쳐 단일 이항전개화",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "이항정리",
    "l3": "이항정리",
    "l4": "특정 항의 계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_BINOMIAL_THEOREM",
    "templateKey": "TPL_BINOMIAL_TERM_COEFFICIENT",
    "why": "이항정리 > 특정 항의 계수 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "곱셈공식(합차공식)으로 식을 먼저 단순화한 뒤 이항정리 일반항을 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "유리식",
      "곱"
    ],
    "goal": [
      "계수"
    ],
    "method": [
      "합차공식",
      "이항정리"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 4.5

### 발문

세 정수 \$x,y,z\$에 대하여 \$1\\le \|x\|\\le \|y\|\\le \|z\|\\le 5\$를 만족시키는 모든 순서쌍 \$(x,y,z)\$의 개수는?

### 선지

① \$35\$ ② \$70\$ ③ \$140\$ ④ \$210\$ ⑤ \$280\$

### 정답

⑤

### 해설

먼저 \$(\|x\|, \|y\|, \|z\|)\$의 순서쌍을 정하면 \$1\$부터 \$5\$까지의 자연수 중에서 중복을 허락하여 3개를 뽑는 경우의 수와 같으므로 \${}*{5}\\mathrm{H}*{3}={}*{7}\\mathrm{C}*{3}=35\$가지이다. 각각의 \$\|x\|, \|y\|, \|z\|\$는 모두 \$1\$ 이상이므로 \$x, y, z\$의 부호(\$+\$ 또는 \$-\$)를 정하는 경우는 \$2^3=8\$가지이다. 따라서 구하는 순서쌍 \$(x,y,z)\$의 개수는 \$35\\times 8=280\$이다. 정답은 ⑤이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "절댓값 크기 순서 (|x|,|y|,|z|)를 중복조합 5H3=35로 정한 뒤 부호 2^3=8을 곱해 280 계산",
  "decisiveStep": "절댓값 선택(5H3)과 0이 아닌 세 정수의 부호 선택(2^3) 분리 곱셈",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_INTEGER_DOMAIN"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "절댓값 부등식을 중복조합으로 풀고 각 변수의 양·음 부호 결정을 곱하는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "정수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합",
      "곱의법칙"
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
- 배점: 5

### 발문

4명의 학생에게 같은 종류의 공책 4권을 나누어 주고, 공책을 받지 못한 학생에게는 같은 종류의 연필 5자루를 1자루 이상씩 나누어 주는 경우의 수는?

### 선지

① \$84\$ ② \$96\$ ③ \$108\$ ④ \$120\$ ⑤ \$132\$

### 정답

③

### 해설

공책을 받는 학생의 수를 \$k\$라 하자. 연필을 받을 학생이 적어도 1명 있어야 하므로 \$1\\le k\\le 3\$이다.

1. \$k=1\$일 때: 공책 4권을 모두 받는 학생 1명을 고르는 경우 \${}*{4}\\mathrm{C}*{1}=4\$, 나머지 3명에게 연필 5자루를 1자루 이상씩 나누어 주는 경우 \${}*{3}\\mathrm{H}*{2}={}*{4}\\mathrm{C}*{2}=6\$이므로 \$4\\times 6=24\$가지이다.  
2. \$k=2\$일 때: 공책을 받을 2명을 고르는 경우 \${}*{4}\\mathrm{C}*{2}=6\$, 그 2명에게 공책 4권을 1권 이상씩 주는 경우 \${}*{2}\\mathrm{H}*{2}=3\$, 나머지 2명에게 연필 5자루를 1자루 이상씩 주는 경우 \${}*{2}\\mathrm{H}*{3}=4\$이므로 \$6\\times 3\\times 4=72\$가지이다.  
3. \$k=3\$일 때: 공책을 받을 3명을 고르는 경우 \${}*{4}\\mathrm{C}*{3}=4\$, 그 3명에게 공책 4권을 1권 이상씩 주는 경우 \${}*{3}\\mathrm{H}*{1}=3\$, 나머지 1명에게 연필 5자루를 모두 주는 경우 \$1\$이므로 \$4\\times 3\\times 1=12\$가지이다.

따라서 전체 경우의 수는 \$24+72+12=108\$이다. 정답은 ③이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "공책을 받는 학생 수 k(1,2,3)에 따라 대상을 분할하고 각각 최소 1개 이상 중복조합으로 배분",
  "decisiveStep": "k=4이면 연필 배분이 불가능하므로 k=1,2,3만 분할해 24+72+12 합산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "중복을 허용한 선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 중복을 허용한 선택 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공책 수령자 수에 따른 케이스 분기와 두 종류 물품의 최소 1개 이상 중복조합 배분이 결합되어 있다.",
  "level": "중",
  "item4slot": {
    "given": [
      "개수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "조합",
      "중복조합",
      "합의법칙"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q12

- 형식: 객관식  
- 배점: 5

### 발문

네 자리의 자연수 \$N=a\\times10^3+b\\times10^2+c\\times10+d\$에 대하여 다음 조건을 만족시키는 자연수 \$N\$의 개수는?

> (가) \${a,b,c,d}\\subset{0,1,4,5,8,9}\$ (나) \${0,4,8}\\subset{a,b,c,d}\$

### 선지

① \$54\$ ② \$60\$ ③ \$66\$ ④ \$72\$ ⑤ \$78\$

### 정답

⑤

### 해설

네 자리 자연수이므로 \$a\\ne0\$이고, 집합 \${a,b,c,d}\$는 원소 \$0, 4, 8\$을 반드시 포함해야 하므로 원소의 개수는 \$3\$개 또는 \$4\$개이다.

1. \${a,b,c,d}={0,4,8}\$인 경우 (숫자 3개 사용, 1개가 2번 등장):  
   - \$0\$이 2번, \$4, 8\$이 각 1번: \$a\\in{4,8}\$(\$2\$가지)이고 나머지 세 자리에 \$0,0\$과 남은 1수를 배열(\$\\frac{3\!}{2\!}=3\$가지)하므로 \$2\\times 3=6\$가지이다.  
   - \$4\$ 또는 \$8\$이 2번 등장 (\$2\$가지): 전체 배열 \$\\frac{4\!}{2\!}=12\$가지 중 \$a=0\$인 경우 \$\\frac{3\!}{2\!}=3\$가지를 빼면 \$12-3=9\$가지이므로 \$2\\times 9=18\$가지이다.  
2. \${a,b,c,d}={0,4,8,x}\$ (\$x\\in{1,5,9}\$, \$3\$가지)인 경우 (서로 다른 4개 숫자 사용):  
   - \$x\$를 고르는 경우 \$3\$가지, 각 경우마다 \$a\\ne0\$이므로 \$3\\times 3\!=18\$가지여서 \$3\\times 18=54\$가지이다.

따라서 구하는 자연수 \$N\$의 개수는 \$6+18+54=78\$이다. 정답은 ⑤이다.

```
"NONE"
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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "사용된 숫자 집합 크기(3개 vs 4개)로 분류하고 천의 자리 a≠0 제약을 걸어 같은 것이 있는 순열 계산",
  "decisiveStep": "원소 3개(중복 1쌍)와 원소 4개(모두 상이)로 나누어 a=0 제외",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [
    "CC_SET_CONTAINMENT"
  ],
  "conditionKeys": [
    "COND_NONZERO_LEADING_DIGIT"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "집합 포함 조건을 사용 문자 개수별(3원소·4원소)로 분류하고 맨 앞자리 0 제외를 함께 처리해야 한다.",
  "level": "상",
  "item4slot": {
    "given": [
      "자연수",
      "부분집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "순열",
      "합의법칙"
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
- 배점: 5

### 발문

다음 조건을 만족시키는 \$a,b,c,d\$의 모든 순서쌍 \$(a,b,c,d)\$의 개수는?

> (가) \$a+b+c+d=28\$ (나) 자연수 \$a,b,c,d\$ 중에서 1개는 \$4\$로 나눈 나머지가 \$2\$이고, 2개는 \$4\$로 나눈 나머지가 \$1\$이고, 1개는 \$4\$로 나누어 떨어진다.

### 선지

① \$560\$ ② \$672\$ ③ \$784\$ ④ \$840\$ ⑤ \$1008\$

### 정답

②

### 해설

4개의 변수 \$a, b, c, d\$ 중 \$4\$로 나눈 나머지가 \$(2, 1, 1, 0)\$인 역할에 배정하는 경우의 수는 \$\\frac{4\!}{2\!}=12\$가지이다. 각 배정된 수를 각각 \$4x+2\$, \$4y+1\$, \$4z+1\$, \$4w+4\$ (\$x, y, z, w\$는 음이 아닌 정수, 네 번째 수는 \$4\$의 배수인 자연수이므로 \$4w+4\$)로 놓으면

\$\$(4x+2)+(4y+1)+(4z+1)+(4w+4)=28 \\implies 4(x+y+z+w)+8=28 \\implies x+y+z+w=5\$\$

이다. 음이 아닌 정수해 \$(x,y,z,w)\$의 개수는 \${}*{4}\\mathrm{H}*{5}={}*{8}\\mathrm{C}*{3}=56\$이다. 따라서 구하는 순서쌍의 개수는 \$12\\times 56=672\$이다. 정답은 ②이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "나머지 역할 배정(4!/2!=12) 후 4x+2, 4y+1, 4z+1, 4w+4 치환으로 x+y+z+w=5 중복조합 4H5=56 계산",
  "decisiveStep": "4의 배수인 자연수를 4w+4(w>=0)로 치환해 음이 아닌 정수해 방정식으로 통일",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_NATURAL_NUMBER_DOMAIN",
    "COND_DIVISIBILITY_REMAINDER"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "나머지 조건을 4k+r 형태로 치환하고 자연수 조건에 맞게 상수항을 보정해 중복조합을 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수",
      "합",
      "나머지"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합",
      "곱의법칙"
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
- 배점: 5

### 발문

그림과 같이 정오각뿔의 각 면에 서로 다른 5가지 색을 전부 또는 일부를 사용하여 색칠하려고 한다. 이웃하는 면에는 서로 다른 색을 칠하고, 이웃하지 않는 면에는 서로 같은 색 또는 다른 색을 칠할 때, 칠하는 경우의 수는? (단, 변이 맞닿아 있는 경우는 이웃한다고 하며, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$240\$ ② \$288\$ ③ \$360\$ ④ \$480\$ ⑤ \$720\$

### 정답

①

### 해설

정오각뿔의 밑면(정오각형)과 5개의 옆면(이등변삼각형)을 구분하여 칠한다.

1. 밑면에 색을 칠하는 경우의 수는 \$5\$가지이다.  
2. 밑면과 이웃한 5개의 옆면은 밑면의 색을 제외한 나머지 \$4\$가지 색으로 이웃한 옆면끼리 서로 다른 색이 되도록 원형으로 칠해야 한다. 5개의 옆면에 순서를 매겨 1번\~5번이라 하고, \$4\$가지 색으로 1번부터 차례로 칠할 때 1번과 5번이 같은 색인지 다른 색인지로 나누어 세면:  
   - 1, 3, 5번 같은 색(1가지) / 다름 등을 점화식 또는 케이스로 계산하면 일렬 기준 \$4\\cdot 3^4\$ 중 양 끝이 다른 경우는 \$(4-1)^5 - (4-1) \= 243 - 3 \= 240\$가지이다.  
   - 원순열로 회전하여 일치하는 5가지를 하나로 보면 옆면 색칠 경우의 수는 \$\\frac{240}{5}=48\$가지이다.

따라서 전체 경우의 수는 \$5\\times 48=240\$이다. 정답은 ①이다.

```
{
  "family": "solid-figure-v1",
  "caption": "밑면이 정오각형이고 5개의 합동인 이등변삼각형 옆면을 가진 정오각뿔",
  "sourceQuote": "그림과 같이 정오각뿔의 각 면에 서로 다른 5가지 색을",
  "solids": [
    {
      "type": "pyramid",
      "baseSides": 5
    }
  ]
}
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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "밑면 색 선택(5가지) 후 5개 옆면을 나머지 4색으로 원형 인접 배색((3^5-3)/5=48가지)해 곱셈",
  "decisiveStep": "5원형 인접 배색 수 ((k-1)^5-(k-1))/5 (k=4) 적용",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "중복·원순열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_CIRCULAR_PERMUTATION",
    "why": "순열 > 중복·원순열 (FAMILY_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "밑면 고정과 5개 옆면의 원순열 인접 다른 색 배색(양 끝 색 일치/불일치 분기)이 결합된 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "정오각형",
      "개수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "원순열",
      "곱의법칙"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 5

### 발문

자연수 \$a,b,c,d,e\$에 대하여 부등식 \$a+3b+c+d^2+e\<13\$을 만족시키는 모든 순서쌍 \$(a,b,c,d,e)\$의 개수는?

### 선지

① \$56\$ ② \$66\$ ③ \$72\$ ④ \$76\$ ⑤ \$84\$

### 정답

④

### 해설

\$a,b,c,d,e\$가 자연수이므로 부등식 \$a+3b+c+d^2+e\\le 12\$와 같다. \$a+c+e\\ge 3\$이므로 \$3b+d^2\\le 9\$이다. 가능한 자연수 \$(b,d)\$의 순서쌍에 따라 \$a+c+e\\le 12-(3b+d^2)\$의 자연수해 개수를 구한다. (자연수 \$x,y,z\$에 대해 \$x+y+z\\le m\$의 해 개수는 여유변수 \$u\\ge0\$를 도입해 \$x'+y'+z'+u \= m-3\$의 해 개수 \${}*{4}\\mathrm{H}*{m-3}={}*{m}\\mathrm{C}*{3}\$과 같다.)

1. \$b=1, d=1\$: \$a+c+e\\le 8 \\implies {}*{8}\\mathrm{C}*{3}=56\$  
2. \$b=1, d=2\$: \$a+c+e\\le 5 \\implies {}*{5}\\mathrm{C}*{3}=10\$  
3. \$b=2, d=1\$: \$a+c+e\\le 5 \\implies {}*{5}\\mathrm{C}*{3}=10\$  
4. 그 외 \$(b,d)\$에서는 \$3b+d^2\\ge 10\$이므로 자연수해가 없다.

따라서 구하는 순서쌍의 개수는 \$56+10+10=76\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "계수가 큰 b, d^2를 먼저 케이스 분류한 뒤 남은 a+c+e<=m의 자연수해를 중복조합 mC3으로 계산",
  "decisiveStep": "3b+d^2<=9 조건으로 (b,d) 3쌍만 추출하고 부등식 해를 여유변수로 처리",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_NATURAL_NUMBER_DOMAIN"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "계수가 1이 아닌 항들을 먼저 분류하고 부등식 정수해에 중복조합(여유변수)을 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수",
      "합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합",
      "합의법칙"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q16

- 형식: 단답형  
- 배점: 5

### 발문

\[단답형 1\] 어느 공장에서는 제품 \$C\$, \$D\$를 생산한다. 제품 \$C\$는 \$1500\$개 중 \$3\$개 꼴로 불량품이 발생했고, 제품 \$D\$는 \$4000\$개 중 \$2\$개 꼴로 불량품이 발생했다고 한다. 이 공장에서 생산된 제품 \$C\$와 \$D\$를 임의로 각각 한 개씩 뽑아 검사할 때, \$C\$가 불량품일 확률을 \$r\$, \$D\$가 불량품일 확률을 \$s\$라 하자. 이때 \$\\dfrac{s}{r}\$의 값을 구하시오.

### 선지

없음

### 정답

\$\\frac{1}{4}\$

### 해설

통계적 확률(상대도수)에 의해 제품 \$C\$와 \$D\$의 불량품 발생 확률은 각각

\$\$r \= \\frac{3}{1500} \= \\frac{1}{500}, \\qquad s \= \\frac{2}{4000} \= \\frac{1}{2000}\$\$

이다. 따라서 구하는 비의 값은

\$\$\\frac{s}{r} \= \\frac{1/2000}{1/500} \= \\frac{500}{2000} \= \\frac{1}{4}\$\$

이다.

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
  "standardUnitKey": "H22-PS-03",
  "subUnitKey": "H22-PS-03-PROBABILITY_BASIC",
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "표본 비율로부터 통계적 확률 r=3/1500, s=2/4000을 구해 비율 s/r=1/4 계산",
  "decisiveStep": "각 제품의 상대도수를 확률 r, s로 두고 분수 나눗셈 계산",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률의 뜻과 활용",
    "l3": "확률의 기본",
    "l4": "확률 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "확률의 기본 > 확률 계산 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "주어진 불량률 자료에서 두 통계적 확률의 비를 구하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "확률"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "확률"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q17

- 형식: 단답형  
- 배점: 5.5

### 발문

\[단답형 2\] 그림과 같은 도로망이 있다. 테두리의 굵은 선은 큰 길, 테두리 안의 가는 선은 작은 길을 나타낸다. \$A\$지점에서 출발하여 \$B\$지점까지 직선 도로를 따라 최단 거리로 갈 때, 큰 길을 세 구간만 지나는 경우의 수를 구하시오. (한 교차로와 다음 교차로 사이를 구간이라고 한다.)

### 선지

없음

### 정답

\$60\$

### 해설

도로망은 가로 \$6\$칸, 세로 \$4\$칸의 격자이므로 \$(0,0)\$에서 \$(6,4)\$까지 최단 경로를 따라 이동한다. 큰 길(테두리)을 정확히 \$3\$구간만 지나는 경로는 처음 출발할 때와 마지막 도착할 때 각각 테두리를 따라 몇 구간을 걷는지에 따라 나뉜다. (내부에서 출발해 중간에 테두리에 닿으면 끝까지 테두리를 따라야 하므로, 처음 테두리 구간 수 \$a\\ge1\$과 끝 테두리 구간 수 \$b\\ge1\$의 합이 \$a+b=3\$이어야 한다.)

1. 처음 아래쪽 테두리로 \$a=1\$구간, 마지막 위쪽/오른쪽 테두리로 \$b=2\$구간 이동:  
   - \$(0,0)\\to(1,0)\\to(1,1)\$에서 시작해 \$(4,4)\\to(6,4)\$로 끝나는 경우: \$(1,1)\\to(4,3)\$에서 \$(4,4)\$ 진입은 \${}*{5}\\mathrm{C}*{2}=10\$가지, \$(1,1)\\to(5,2)\$에서 \$(6,2)\$ 진입은 \${}*{5}\\mathrm{C}*{1}=5\$가지로 총 \$15\$가지이다.  
2. 처음 아래쪽 테두리로 \$a=2\$구간, 마지막 \$b=1\$구간 이동:  
   - \$(0,0)\\to(2,0)\\to(2,1)\$에서 \$(5,4)\\to(6,4)\$는 \${}*{5}\\mathrm{C}*{2}=10\$가지, \$(2,1)\\to(5,3)\\to(6,3)\$은 \${}*{5}\\mathrm{C}*{2}=10\$가지가 아니라, 내부 유지 조건에 의해 \$(2,1)\\to(5,3)\$까지는 테두리 없이 이동하므로 \$(2,1)\\to(5,3)\$은 \${}*{5}\\mathrm{C}*{2}\$가 아닌 \$(5,3)\\to(6,3)\$ 진입 전 \$(5,3)\$ 도달(\${}*{5}\\mathrm{C}*{2}=10\$? 주의: \$(x,4)\$를 밟으면 윗변을 타므로 \$(5,3)\$까지만 내부)에서 총 \$10+10\$ 대신 세로 끝 구간 포함 여부를 구분하면: \$(2,1)\\to(5,3)\\to(5,4)\\to(6,4)\$는 \${}*{5}\\mathrm{C}*{2}=10\$가지, \$(2,1)\\to(5,3)\\to(6,3)\\to(6,4)\$는 \${}*{5}\\mathrm{C}*{2}=10\$가지? 잠깐, \$(5,3)\$에서 \$(5,4)\$로 가면 윗변 \$1\$구간, \$(6,3)\$으로 가면 오른쪽변 \$1\$구간이므로 둘 다 정확히 \$b=1\$이다\! 단, \$(2,1)\\to(5,3)\$ 경로 중 \$y=4\$나 \$x=6\$을 밟지 않는 조건은 이미 \$x\\le 5, y\\le 3\$ 안에 있어 자동 만족되므로 각각 \${}*{5}\\mathrm{C}*{2}=10\$가지, 합 \$20\$가지이다.  
3. 위 1, 2와 대칭으로 처음 왼쪽 테두리로 올라가는 경우:  
   - \$a=1, b=2\$: \$(0,0)\\to(0,1)\\to(1,1)\$에서 \$(4,3)\\to(4,4)\\to(6,4)\$ (\${}*{5}\\mathrm{C}*{2}=10\$) 또는 \$(5,2)\\to(6,2)\\to(6,4)\$ (\${}*{5}\\mathrm{C}*{1}=5\$)로 \$15\$가지이다.  
   - \$a=2, b=1\$: \$(0,0)\\to(0,2)\\to(1,2)\$에서 \$(5,3)\\to(5,4)\\to(6,4)\$ (\${}*{5}\\mathrm{C}*{1}=5\$) 또는 \$(5,3)\\to(6,3)\\to(6,4)\$ (\${}*{5}\\mathrm{C}*{1}=5\$)로 \$10\$가지이다.

(또한 \$(1,1)\$ 출발이 아니라 \$a=2\$인 \$(2,0)\$에서 \$(5,4)\$로 가는 경우 중 \$b=1\$은 \$(5,3)\$ 경유뿐이므로 빠짐없음; 단 \$a=1\$인 \$(1,0)\\to(1,1)\$에서 \$b=2\$는 위쪽 \$2\$칸 \$(4,4)\\to(6,4)\$에 \$(4,3)\\to(4,4)\$ \${}*{5}\\mathrm{C}*{2}=10\$과 오른쪽 \$2\$칸 \$(6,2)\\to(6,4)\$에 \$(5,2)\\to(6,2)\$ \${}*{5}\\mathrm{C}*{1}=5\$로 정확히 15가지이다.) 따라서 전체 경우의 수는 \$15+20+15+10=60\$이다.

```
{
  "family": "lattice-path-v1",
  "caption": "바깥 테두리가 큰 길이고 내부가 작은 길인 6×4 격자 도로망(왼쪽 아래 A, 오른쪽 위 B)",
  "sourceQuote": "테두리의 굵은 선은 큰 길, 테두리 안의 가는 선은 작은 길을 나타낸다",
  "grid": [
    6,
    4
  ],
  "start": [
    0,
    0
  ],
  "end": [
    6,
    4
  ],
  "highlightBorder": true
}
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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "6x4 격자에서 테두리 이탈·진입 시점 (a,b) 합이 3이 되는 4가지 경로군으로 분할해 조합 계산",
  "decisiveStep": "a+b=3(a>=1, b>=1)을 만족하는 출발·도착 테두리 진입점별 내부 격자 최단경로 합산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "테두리 3구간 제한을 처음(a)과 끝(b)의 합으로 해석해 내부 격자 진입·탈출 점을 정확히 분할해야 한다.",
  "level": "상",
  "item4slot": {
    "given": [
      "개수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "조합",
      "합의법칙"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q18

- 형식: 단답형  
- 배점: 6

### 발문

\[단답형 3\] 두 집합 \$X={1,2,3,4,5,6}\$, \$Y={1,2,\\cdots,18}\$에 대하여 다음 조건을 만족시키는 함수 \$f:X\\to Y\$의 개수를 구하시오.

> (가) 집합 \$X\$의 임의의 두 원소 \$x\_1, x\_2\$에 대하여 \$x\_1\<x\_2\$이면 \$1+f(x\_1)\<f(x\_2)\$이다. (나) \$f(5)=2f(2)\$

### 선지

없음

### 정답

\$101\$

### 해설

조건 (가)는 인접한 원소마다 \$f(x+1)\\ge f(x)+2\$임을 뜻한다. \$f(2)=k\$라 하면 \$f(5)=2k\$이다. 조건에 의해:

- \$f(1)\\le k-2\$이고 \$f(1)\\ge 1\$이므로 \$k\\ge 3\$  
- \$f(6)\\ge 2k+2\$이고 \$f(6)\\le 18\$이므로 \$2k\\le 16 \\implies k\\le 8\$  
- \$f(2)+2 \\le f(3) \\le f(4)-2 \\le f(5)-4\$이므로 \$k+2 \\le 2k-4 \\implies k\\ge 6\$

따라서 가능한 \$k\$는 \$6, 7, 8\$뿐이다. 각 \$k\$에 대하여 \$f(1)\$은 \$k-2\$가지, \$f(6)\$은 \$18-(2k+2)+1=17-2k\$가지이고, \$(f(3), f(4))\$는 폭이 \$(2k-2)-(k+2)+1 \= k-3\$인 정수 구간에서 차이가 \$2\$ 이상인 두 수 선택이므로 \${}*{(k-3)-1}\\mathrm{C}*{2} \= {}*{k-4}\\mathrm{C}*{2}\$가 아니라, \$a=f(3)-(k+2)\\ge0\$, \$b=f(4)-(k+4)\\ge a\$, \$b\\le k-6\$이므로 \${}*{k-4}\\mathrm{C}*{2}\$이다.

- \$k=6\$: \$4 \\times {}*{2}\\mathrm{C}*{2} \\times 5 \= 4 \\times 1 \\times 5 \= 20\$  
- \$k=7\$: \$5 \\times {}*{3}\\mathrm{C}*{2} \\times 3 \= 5 \\times 3 \\times 3 \= 45\$  
- \$k=8\$: \$6 \\times {}*{4}\\mathrm{C}*{2} \\times 1 \= 6 \\times 6 \\times 1 \= 36\$

따라서 전체 함수의 개수는 \$20+45+36=101\$이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "인접 항 차 >=2 조건 하에서 f(2)=k(6,7,8)로 고정해 f(1), (f(3),f(4)), f(6) 경우의 수 곱 합산",
  "decisiveStep": "f(5)=2k와 최소 간격 2 조건으로 k 범위가 {6,7,8}로 좁혀짐",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "조합",
    "l4": "선택"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_COMBINATION_SELECTION",
    "why": "조합 > 선택 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [
    "CC_FUNCTION_COUNT"
  ],
  "conditionKeys": [
    "COND_STRICT_INCREASING_GAP"
  ],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "함수 간격 조건으로부터 중심 변수 k의 가능 범위를 먼저 좁힌 뒤 구간별 조합을 곱해 합산해야 한다.",
  "level": "상",
  "item4slot": {
    "given": [
      "함수",
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "조합",
      "곱의법칙"
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
- 배점: 8

### 발문

\[서술형 1\] 두 집합 \$X={1,2,3,4,5}\$, \$Y={-2,-1,0,1,2}\$에 대하여 \$X\$에서 \$Y\$로의 함수 \$f\$ 중에서 \$\|f(2)+f(3)+f(4)\|=2\$를 만족시키는 함수 \$f\$의 개수를 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

\$750\$

### 해설

\$f(1)\$과 \$f(5)\$는 조건에 영향을 주지 않으므로 각각 \$Y\$의 원소 \$5\$개 중 아무거나 선택할 수 있어 \$5\\times 5=25\$가지이다. 이제 \$a=f(2), b=f(3), c=f(4)\\in Y={-2,-1,0,1,2}\$에 대하여 \$\|a+b+c\|=2\$인 순서쌍 \$(a,b,c)\$의 개수를 구한다. 대칭성에 의해 \$a+b+c=2\$인 경우와 \$a+b+c=-2\$인 경우의 수는 같다. \$a+b+c=2\$를 만족하는 경우는 \$x=a+2, y=b+2, z=c+2\$ (\$0\\le x,y,z\\le 4\$)로 치환하면 \$x+y+z=8\$과 같다. 음이 아닌 정수해 \${}*{3}\\mathrm{H}*{8}={}*{10}\\mathrm{C}*{2}=45\$개 중에서 \$x,y,z\$ 중 하나가 \$5\$ 이상인 경우를 제외한다. (\$x\\ge5\$이면 \$x'=x-5\\ge0\$으로 두어 \$x'+y+z=3\$의 해 개수 \${}*{3}\\mathrm{H}*{3}={}*{5}\\mathrm{C}*{2}=10\$개, 세 변수 중 선택 \$3\$가지이므로 \$3\\times 10=30\$개. 두 변수가 동시에 \$5\$ 이상일 수는 없음) 따라서 \$a+b+c=2\$인 경우는 \$45-30=15\$가지이고, \$\|a+b+c\|=2\$인 경우는 \$2\\times 15=30\$가지이다. 그러므로 구하는 함수 \$f\$의 개수는 \$30\\times 25=750\$이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "f(1),f(5) 자유 선택(25)과 |f(2)+f(3)+f(4)|=2를 평행이동 치환·상한 제외 중복조합으로 계산",
  "decisiveStep": "x=a+2 치환으로 x+y+z=8(0<=x,y,z<=4) 해 45-30=15 도출 후 대칭성 ×2, ×25",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "중복조합",
    "l4": "정수해 개수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION",
    "templateKey": "TPL_REPEATED_COMBINATION_DISTRIBUTION",
    "why": "중복조합 > 정수해 개수 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [
    "CC_FUNCTION_COUNT",
    "CC_ABSOLUTE_VALUE"
  ],
  "conditionKeys": [
    "COND_INTEGER_DOMAIN"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "함수 개수 계산, 절댓값 대칭성, 상한이 있는 방정식의 중복조합(포함배제)이 결합된 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "함수",
      "집합",
      "합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합",
      "포함배제의원리",
      "곱의법칙"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```

## Q20

- 형식: 서술형  
- 배점: 8

### 발문

\[서술형 2\] \$1\$부터 \$6\$까지 적혀있는 \$6\$종류의 카드가 각각 \$4\$장씩 있다. 카드를 총 \$4\$번 뽑는 과정에서 나온 수를 순서대로 \$a,b,c,d\$라고 한다. \$a\\times b\\times c\\times d\$의 값이 \$18\$의 배수가 되는 \$(a,b,c,d)\$의 순서쌍의 수를 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

\$495\$

### 해설

각 종류의 카드가 \$4\$장씩 있으므로 \$4\$번 뽑는 모든 경우의 수는 \$6^4=1296\$이다. 곱 \$abcd\$가 \$18=2\\times 3^2\$의 배수가 되지 않는 여사건을 구한다.

1. \$abcd\$가 \$2\$의 배수가 아닌 경우 (\$A\$): 4개 모두 홀수 \${1,3,5}\$에서 뽑히므로 \$n(A)=3^4=81\$이다.  
2. \$abcd\$가 \$9\$의 배수가 아닌 경우 (\$B\$): 4개 중 \$3\$의 배수(\$3\$ 또는 \$6\$)가 \$0\$개 또는 \$1\$개 뽑히는 경우이다.  
   - \$0\$개: \$4\$개 모두 \${1,2,4,5}\$에서 뽑히므로 \$4^4=256\$  
   - \$1\$개: 자리 선택 \$4\$가지 × (\$3\$ 또는 \$6\$ 중 \$1\$개) × 나머지 3자리 \$4^3\$ \= \$4\\times 2\\times 64 \= 512\$ 따라서 \$n(B)=256+512=768\$이다.  
3. \$abcd\$가 \$2\$의 배수도 아니고 \$9\$의 배수도 아닌 경우 (\$A\\cap B\$): 4개 모두 홀수 \${1,3,5}\$이면서 \$3\$이 \$0\$개 또는 \$1\$개 뽑히는 경우이다.  
   - \$3\$이 \$0\$개: \${1,5}\$에서 4개 \$\\implies 2^4=16\$  
   - \$3\$이 \$1\$개: 자리 선택 \$4\$가지 × 나머지 3자리 \${1,5}\$ \$\\implies 4\\times 2^3=32\$ 따라서 \$n(A\\cap B)=16+32=48\$이다.

포함배제의 원리에 의해 여사건의 수는 \$n(A\\cup B)=81+768-48=801\$이다. 따라서 구하는 순서쌍의 개수는 \$1296-801=495\$이다.

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
  "conceptClusterKey": "PROBABILITY_STATISTICS",
  "primaryMethod": "전체 6^4=1296에서 18=2*3^2 배수 여사건(2의 배수 아님 U 9의 배수 아님)을 포함배제로 제외",
  "decisiveStep": "여사건 A(모두 홀수, 81), B(3·6 최대 1개, 768), A∩B(홀수 중 3 최대 1개, 48) 계산",
  "rpm": {
    "majorUnit": "경우의 수",
    "midUnit": "순열과 조합",
    "l3": "순열",
    "l4": "일렬 배열"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_COUNTING_ARRANGEMENT",
    "templateKey": "TPL_PERMUTATION_STANDARD_CONSTRAINT",
    "why": "순열 > 일렬 배열 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [
    "CC_PRIME_FACTORIZATION"
  ],
  "conditionKeys": [
    "COND_DIVISIBILITY_REMAINDER"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "소인수분해 조건을 여사건과 포함배제의 원리로 정교하게 분할 계산해야 하는 고난도 서술형이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "자연수",
      "곱"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "여사건",
      "포함배제의원리",
      "중복순열"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

