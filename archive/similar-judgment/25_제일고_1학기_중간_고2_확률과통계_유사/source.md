

```
{"stem": "25_제일고_1학기_중간_고2_확률과통계_유사", "sourceArchiveFile": "original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js", "examFolder": "1mid", "grade": "고2", "subject": "확률과 통계", "curriculum": "2022", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.7

### 발문

오지선다형 문제 \$4\$개가 있다. 각 문제의 답을 하나씩 임의로 고를 때, 고를 수 있는 모든 경우의 수는?

### 선지

① \$125\$ ② \$625\$ ③ \$1024\$ ④ \$256\$ ⑤ \$3125\$

### 정답

②

### 해설

\$4\$개의 문제마다 \$5\$가지 선택지가 있으므로 \${}*{5}\\Pi*{4}=5^4=625\$이다. 정답은 ②이다.

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
  "primaryMethod": "4문항에 5지선다를 중복 선택하는 중복순열 5^4=625 계산",
  "decisiveStep": "5^4 = 625",
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
  "difficultyReason": "중복순열의 기본 공식 n^r를 바로 적용하는 기초 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복순열"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q02

- 형식: 객관식  
- 배점: 3.7

### 발문

이번 시즌에서 어느 프로 야구 선수가 \$250\$번의 타석에서 \$75\$개의 안타를 쳤다. 이 선수가 한 번의 타석에서 안타를 칠 확률은?

### 선지

① \$\\dfrac{1}{5}\$ ② \$\\dfrac{1}{4}\$ ③ \$\\dfrac{7}{25}\$ ④ \$\\dfrac{3}{10}\$ ⑤ \$\\dfrac{7}{20}\$

### 정답

④

### 해설

전체 시도 횟수 \$250\$ 중 성공 횟수가 \$75\$이므로 구하는 확률은 \$\\dfrac{75}{250}=\\dfrac{3}{10}\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-PS-03",
  "subUnitKey": "H22-PS-03-PROBABILITY_BASIC",
  "conceptClusterKey": "PROBABILITY",
  "primaryMethod": "시행 횟수 250에 대한 안타 75의 상대도수 75/250=3/10 계산",
  "decisiveStep": "75/250 기약분수 약분 3/10",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률의 뜻과 활용",
    "l3": "확률의 기본",
    "l4": "확률 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "확률의 기본 > 확률 계산 (ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "상대도수 비율로 통계적 확률을 바로 계산하는 기초 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "사건"
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

## Q03

- 형식: 객관식  
- 배점: 3.7

### 발문

\$A\$와 \$B\$를 포함한 \$8\$명의 학생이 원 모양의 탁자에 둘러앉으려고 한다. \$A\$와 \$B\$가 마주 보고 앉는 모든 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$120\$ ② \$240\$ ③ \$720\$ ④ \$1440\$ ⑤ \$5040\$

### 정답

③

### 해설

\$A\$를 고정하면 맞은편 자리에 \$B\$가 앉는 경우는 \$1\$가지이고, 남은 \$6\$명을 배열하는 방법은 \$6\!=720\$가지이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "A를 기준 고정하고 맞은편에 B를 앉힌 뒤 나머지 6명 직순열 6!=720 계산",
  "decisiveStep": "1 * 6! = 720",
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
  "difficultyReason": "원순열에서 마주 보는 두 사람을 고정한 뒤 나머지 인원을 일렬 배열하는 기초 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "원"
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

## Q04

- 형식: 객관식  
- 배점: 3.7

### 발문

\$(a+b+c+d)^3\$의 전개식에서 서로 다른 종류의 항의 개수는?

### 선지

① \$20\$ ② \$15\$ ③ \$24\$ ④ \$30\$ ⑤ \$35\$

### 정답

①

### 해설

\$4\$개의 문자 \$a,\\ b,\\ c,\\ d\$에서 중복을 허용하여 \$3\$개를 택하는 중복조합의 수와 같으므로 \${}*{4}\\mathrm{H}*{3}={}*{6}\\mathrm{C}*{3}=20\$이다. 정답은 ①이다.

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
  "primaryMethod": "동류항이 아닌 전개 항의 개수를 중복조합 4H3=6C3=20으로 계산",
  "decisiveStep": "4H3 = 6C3 = 20",
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
  "difficultyReason": "다항식 전개식의 서로 다른 항의 개수를 중복조합 공식으로 바로 구하는 기초 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식"
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

## Q05

- 형식: 객관식  
- 배점: 3.7

### 발문

\$(3x+1)^4\$의 전개식에서 \$x^2\$의 계수는?

### 선지

① \$12\$ ② \$27\$ ③ \$36\$ ④ \$48\$ ⑤ \$54\$

### 정답

⑤

### 해설

일반항 \${}*{4}\\mathrm{C}*{r}(3x)^{4-r}\\cdot 1^r\$에서 \$4-r=2 \\implies r=2\$이므로 \$x^2\$의 계수는 \${}*{4}\\mathrm{C}*{2}\\cdot 3^2=6\\times 9=54\$이다. 정답은 ⑤이다.

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
  "primaryMethod": "(3x+1)^4의 일반항에서 x^2 항 계수 4C2*3^2=54 계산",
  "decisiveStep": "4C2 * 3^2 = 54",
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
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "단항 이항정리 공식으로 특정 항의 계수를 직접 구하는 기초 문항이다.",
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

## Q06

- 형식: 객관식  
- 배점: 3.9

### 발문

\$1\$부터 \$7\$까지의 자연수가 하나씩 적혀 있는 \$7\$장의 카드를 일정한 간격으로 원형으로 배치할 때, 합이 \$13\$인 두 카드가 이웃하지 않도록 배열하는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$360\$ ② \$480\$ ③ \$504\$ ④ \$600\$ ⑤ \$720\$

### 정답

②

### 해설

전체 원순열은 \$(7-1)\!=6\!=720\$가지이고, 합이 \$13\$인 두 카드는 \${6,\\ 7}\$뿐이다. \$6,\\ 7\$이 이웃하는 경우는 \$(6-1)\!\\times 2\!=120\\times 2=240\$가지이므로 구하는 경우의 수는 \$720-240=480\$이다. 정답은 ②이다.

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
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "전체 원순열 6!=720에서 합 13 쌍 {6,7}이 이웃하는 5!*2!=240을 여사건으로 빼 480 산출",
  "decisiveStep": "6! - 5!*2! = 480",
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
  "difficultyReason": "원순열에서 특정 조건(합이 13)을 만족하는 유일한 두 카드의 비이웃 조건을 여사건으로 푸는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "원순열",
      "여사건"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 3.9

### 발문

두 개의 숫자 \$1,\\ 2\$ 중에서 중복을 허용하여 자연수를 만들 때, 각 자리의 숫자의 합이 \$9\$인 수의 개수는?

### 선지

① \$34\$ ② \$45\$ ③ \$50\$ ④ \$55\$ ⑤ \$64\$

### 정답

④

### 해설

숫자 \$1\$의 개수를 \$x\$, \$2\$의 개수를 \$y\$라 하면 \$x+2y=9\$(\$x,\\ y\$는 음이 아닌 정수)이다. \$\$\\begin{aligned} y=4,\\ x=1 &: \\frac{5\!}{4\!1\!}=5, \\quad y=3,\\ x=3 : \\frac{6\!}{3\!3\!}=20 \\ y=2,\\ x=5 &: \\frac{7\!}{2\!5\!}=21, \\quad y=1,\\ x=7 : \\frac{8\!}{1\!7\!}=8, \\quad y=0,\\ x=9 : 1 \\end{aligned}\$\$ 따라서 구하는 개수는 \$5+20+21+8+1=55\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "x+2y=9를 y=0..4로 분류해 각 (x,y)의 같은 것이 있는 순열 5+20+21+8+1=55 합산",
  "decisiveStep": "y=0..4별 (x+y)C_y 합산",
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
  "difficultyReason": "1과 2의 사용 횟수 방정식 x+2y=9의 모든 해를 구한 뒤 각각 같은 것이 있는 순열로 합산하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "같은것이있는순열",
      "경우분류"
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
- 배점: 3.9

### 발문

\${}*{9}\\mathrm{C}*{0}3^9+{}*{9}\\mathrm{C}*{1}3^8+{}*{9}\\mathrm{C}*{2}3^7+\\cdots+{}*{9}\\mathrm{C}*{8}3+{}*{9}\\mathrm{C}*{9}\$의 값은?

### 선지

① \$2^{18}\$ ② \$2^{16}\$ ③ \$2^{17}\$ ④ \$2^{19}\$ ⑤ \$2^{20}\$

### 정답

①

### 해설

이항정리에 의해 주어진 식은 \$(3+1)^9=4^9=(2^2)^9=2^{18}\$이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "이항전개식 sum 9Cr 3^(9-r)을 (3+1)^9=4^9=2^18로 역압축",
  "decisiveStep": "(3+1)^9 = 2^18",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "전개된 이항계수 급수를 (a+b)^n 꼴로 되돌려 2의 거듭제곱으로 정리하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "이항"
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

## Q09

- 형식: 객관식  
- 배점: 3.9

### 발문

사과 맛 사탕 \$5\$개와 포도 맛 사탕 \$6\$개가 들어 있는 상자에서 임의로 사탕 \$2\$개를 동시에 꺼낼 때, 꺼낸 \$2\$개의 사탕이 모두 사과 맛 사탕일 확률은?

### 선지

① \$\\dfrac{1}{11}\$ ② \$\\dfrac{3}{22}\$ ③ \$\\dfrac{3}{11}\$ ④ \$\\dfrac{4}{11}\$ ⑤ \$\\dfrac{2}{11}\$

### 정답

⑤

### 해설

전체 \$11\$개 중 \$2\$개를 택하는 경우는 \${}*{11}\\mathrm{C}*{2}=55\$, 사과 맛 \$5\$개 중 \$2\$개를 택하는 경우는 \${}*{5}\\mathrm{C}*{2}=10\$이므로 구하는 확률은 \$\\dfrac{10}{55}=\\dfrac{2}{11}\$이다. 정답은 ⑤이다.

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
  "standardUnitKey": "H22-PS-03",
  "subUnitKey": "H22-PS-03-PROBABILITY_BASIC",
  "conceptClusterKey": "PROBABILITY",
  "primaryMethod": "전체 11C2=55 중 사과 5C2=10의 비 10/55=2/11 계산",
  "decisiveStep": "5C2 / 11C2 = 10/55 = 2/11",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률의 뜻과 활용",
    "l3": "확률의 기본",
    "l4": "확률 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "확률의 기본 > 확률 계산 (ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "조합을 이용해 표본공간과 사건의 경우의 수 비율로 수학적 확률을 구하는 기본 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "사건"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "조합",
      "확률"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q10

- 형식: 객관식  
- 배점: 4.0

### 발문

\$1\$부터 \$9\$까지 아홉 개의 자연수를 모두 사용하여 그림과 같은 \$9\$개의 정사각형 칸을 채우려고 한다. 음영이 칠해진 가운데 칸에는 홀수인 소수를 넣고 나머지 \$8\$칸에 남은 숫자를 채우는 경우의 수가 \$7\!\\times n\$일 때, 상수 \$n\$의 값은? (단, 한 칸에는 하나의 숫자만 넣고, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$4\$ ② \$8\$ ③ \$6\$ ④ \$10\$ ⑤ \$12\$

### 정답

③

### 해설

가운데 칸에 들어갈 수 있는 홀수인 소수는 \$3,\\ 5,\\ 7\$의 \$3\$가지이다. 나머지 \$8\$칸은 \$90^\\circ\$ 회전 시 \$4\$가지가 일치하므로 \$\\dfrac{8\!}{4}\$가지이다. \$\$3\\times\\frac{8\!}{4} \= \\frac{3}{4}\\times 8\\times 7\! \= 6\\times 7\!\$\$ 따라서 \$n=6\$이다. 정답은 ③이다.

```
{"figureType": "grid_3x3_center_shaded", "description": "가운데 칸이 음영 처리된 3x3 정사각형 격자", "elements": ["3x3 square grid", "center cell shaded"]}
```

```
{
  "sourceQid": "Q10",
  "variationType": "CONDITION",
  "standardCourse": "확률과 통계",
  "courseKey": "H22-PS",
  "curriculum": "2022",
  "standardUnitKey": "H22-PS-01",
  "subUnitKey": "H22-PS-01-CORE",
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "가운데 칸 홀수 소수 {3,5,7} 3가지와 주변 8칸 4회전 대칭 8!/4를 곱해 6*7! 산출",
  "decisiveStep": "3 * (8!/4) = 6 * 7!",
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
  "difficultyReason": "고정 중심 칸의 조건 선택과 정사각형 4배 회전 대칭 원순열을 결합해 계수를 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "정사각형",
      "자연수"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "원순열"
    ],
    "condition": [
      "소수",
      "홀수"
    ]
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 4.0

### 발문

\$5\$개의 숫자 \$0,\\ 1,\\ 2,\\ 3,\\ 4\$에서 중복을 허용하여 \$4\$개를 택해 네 자리의 자연수를 만들 때, 숫자 \$1\$과 \$3\$을 각각 한 개 이상 포함하는 수의 개수는?

### 선지

① \$164\$ ② \$170\$ ③ \$176\$ ④ \$182\$ ⑤ \$188\$

### 정답

②

### 해설

전체 네 자리 자연수는 \$4\\times 5^3=500\$개이다. \$1\$을 포함하지 않는 수는 \$3\\times 4^3=192\$개, \$3\$을 포함하지 않는 수는 \$3\\times 4^3=192\$개, \$1\$과 \$3\$을 모두 포함하지 않는 수는 \$2\\times 3^3=54\$개이다. 따라서 구하는 개수는 \$500-(192+192-54)=500-330=170\$이다. 정답은 ②이다.

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
  "primaryMethod": "전체 4*5^3=500에서 1 또는 3 미포함 192+192-54=330을 포함배제·여사건으로 빼 170 계산",
  "decisiveStep": "500 - (192 + 192 - 54) = 170",
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
  "difficultyReason": "0 포함 첫 자리 제한과 두 숫자 동시 포함 조건을 포함·배제 원리로 여사건 처리하는 문항이다.",
  "level": "상",
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

## Q12

- 형식: 객관식  
- 배점: 4.0

### 발문

다항식 \$\\dfrac{1}{3}(x+3y)^n\$의 전개식에서 \$x^2y^2\$의 계수를 \$m\$이라 할 때, \$m+n\$의 값은? (단, \$n\$은 자연수이다.)

### 선지

① \$18\$ ② \$19\$ ③ \$21\$ ④ \$22\$ ⑤ \$24\$

### 정답

④

### 해설

\$x^2y^2\$ 항이 존재하므로 차수의 합 \$n=2+2=4\$이다. \$m=\\dfrac{1}{3}\\cdot{}*{4}\\mathrm{C}*{2}\\cdot 3^2=\\dfrac{1}{3}\\cdot 6\\cdot 9=18\$이므로 \$m+n=18+4=22\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "차수 합으로 n=4를 확정하고 (1/3)*4C2*3^2=18을 구해 m+n=22 산출",
  "decisiveStep": "n=2+2=4 결정 후 계수 m=18 계산",
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
  "difficultyReason": "동차 전개식의 차수 합으로부터 지수 n을 먼저 찾고 계수를 계산하는 문항이다.",
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
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q13

- 형식: 객관식  
- 배점: 4.0

### 발문

다음 조건을 만족시키는 정수 \$a,\\ b,\\ c,\\ d\$의 모든 순서쌍 \$(a,\\ b,\\ c,\\ d)\$의 개수는? (가) \$a+b+c+3d=8\$ (나) \$a\\ge 1,\\ b\\ge \-1,\\ c\\ge 2,\\ d\\ge 0\$

### 선지

① \$35\$ ② \$37\$ ③ \$39\$ ④ \$41\$ ⑤ \$43\$

### 정답

③

### 해설

\$a'=a-1,\\ b'=b+1,\\ c'=c-2\$로 놓으면 \$a',\\ b',\\ c'\\ge 0\$이고 \$a'+b'+c'+3d=6\$이다. ① \$d=0\$: \${}*{3}\\mathrm{H}*{6}={}*{8}\\mathrm{C}*{2}=28\$ ② \$d=1\$: \${}*{3}\\mathrm{H}*{3}={}*{5}\\mathrm{C}*{2}=10\$ ③ \$d=2\$: \${}*{3}\\mathrm{H}*{0}=1\$ 따라서 전체 순서쌍의 개수는 \$28+10+1=39\$이다. 정답은 ③이다.

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
  "primaryMethod": "하한 치환으로 a'+b'+c'+3d=6을 만들고 d=0,1,2별 3H6+3H3+3H0=39 합산",
  "decisiveStep": "하한 치환 후 d=0, 1, 2 케이스별 중복조합 합산",
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
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음수 포함 하한 조건을 치환한 뒤 계수가 3인 변수 d의 값별로 중복조합을 합산하는 문항이다.",
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
      "경우분류"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": ""
}
```

## Q14

- 형식: 객관식  
- 배점: 4.1

### 발문

좌표평면 위를 움직이는 점 \$P\$는 원점에서 출발하여 \$1\$회에 \$x\$축 또는 \$y\$축의 양의 방향으로 \$1\$만큼씩 이동한다. \$6\$회 이하로 움직일 때, 점 \$P\$가 도착할 수 있는 제1사분면 위의 서로 다른 점의 개수는?

### 선지

① \$15\$ ② \$10\$ ③ \$18\$ ④ \$21\$ ⑤ \$28\$

### 정답

①

### 해설

제1사분면 위의 점 \$(x,\\ y)\$는 \$x\\ge 1,\\ y\\ge 1\$이므로 \$2\\le x+y\\le 6\$인 자연수 순서쌍을 센다. \$\$1+2+3+4+5 \= 15\$\$ 정답은 ①이다.

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
  "primaryMethod": "x+y=k(k=2..6)의 자연수 순서쌍 개수 1+2+3+4+5=15 계산",
  "decisiveStep": "제1사분면 조건 x>=1, y>=1 및 합 2<=x+y<=6",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "좌표축 위 점을 제외한 제1사분면 도착 격자점 개수를 이동 횟수별로 세는 문항이다.",
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
      "경우분류"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 4.1

### 발문

\$11\$부터 \$16\$까지의 \$6\$개의 자연수가 적힌 \$6\$장의 카드를 일정한 간격을 두고 원형으로 배열할 때, 이웃한 두 수의 곱이 모두 짝수가 되도록 배열하는 경우의 수는? (단, 회전하여 일치하는 것은 같은 것으로 본다.)

### 선지

① \$6\$ ② \$8\$ ③ \$10\$ ④ \$16\$ ⑤ \$12\$

### 정답

⑤

### 해설

이웃한 두 수의 곱이 모두 짝수이려면 홀수끼리 이웃하지 않아야 하므로 짝수 \$3\$개(\$12,\\ 14,\\ 16\$)와 홀수 \$3\$개(\$11,\\ 13,\\ 15\$)를 교대로 배열해야 한다. \$\$(3-1)\!\\times 3\! \= 2\\times 6 \= 12\$\$ 정답은 ⑤이다.

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
  "conceptClusterKey": "COMBINATORICS",
  "primaryMethod": "홀수 비이웃 교대 원순열로 (3-1)!*3!=12 계산",
  "decisiveStep": "짝수 원순열 (3-1)! 사이 빈자리에 홀수 3! 배치",
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
  "difficultyReason": "이웃한 두 수의 곱이 짝수라는 조건을 홀수 비이웃 교대 원순열로 해석하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "원순열"
    ],
    "condition": [
      "짝수"
    ]
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 4.1

### 발문

중복을 허용하여 \$0,\\ 1,\\ 2,\\ 3,\\ 4\$로 만든 자연수를 크기가 작은 수부터 차례로 나열할 때, \$3124\$는 몇 번째 수인가?

### 선지

① \$412\$ ② \$413\$ ③ \$414\$ ④ \$415\$ ⑤ \$416\$

### 정답

③

### 해설

한 자리 수 \$4\$개, 두 자리 수 \$4\\times 5=20\$개, 세 자리 수 \$4\\times 5^2=100\$개로 \$3\$자리 이하 자연수는 총 \$124\$개이다. 네 자리 수 중 \$1,\\ 2\$로 시작하는 수 \$2\\times 5^3=250\$개, \$30\$으로 시작하는 수 \$5^2=25\$개, \$310,\\ 311\$로 시작하는 수 \$2\\times 5=10\$개, \$3120\\sim 3123\$의 \$4\$개 다음이 \$3124\$이다. \$\$124+250+25+10+4+1 \= 414\$\$ 정답은 ③이다.

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
  "primaryMethod": "자릿수별 5진법 중복순열 누적합 124+250+25+10+4+1=414 산출",
  "decisiveStep": "앞자리별 구간 분할 누적 카운팅",
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
  "difficultyReason": "0을 포함한 5개 숫자로 만든 자연수의 크기순 나열에서 특정 네 자리 수의 순번을 정확히 누적해 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "자연수"
    ],
    "goal": [
      "순서"
    ],
    "method": [
      "중복순열",
      "경우분류"
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
- 배점: 4.3

### 발문

집합 \$X={1,\\ 2,\\ 3}\$의 공집합이 아닌 모든 부분집합 \$7\$개 중에서 임의로 서로 다른 \$2\$개의 부분집합을 뽑아 일렬로 나열하고, 나열된 순서대로 \$A,\\ B\$라 할 때, \$A\\subset B\$일 확률은?

### 선지

① \$\\dfrac{2}{7}\$ ② \$\\dfrac{1}{7}\$ ③ \$\\dfrac{3}{14}\$ ④ \$\\dfrac{5}{21}\$ ⑤ \$\\dfrac{1}{3}\$

### 정답

①

### 해설

전체 경우의 수는 \$7\\times 6=42\$이다. \$n(B)=2\$일 때 \${}*{3}\\mathrm{C}*{2}(2^2-2)=6\$가지, \$n(B)=3\$일 때 \${}*{3}\\mathrm{C}*{3}(2^3-2)=6\$가지이므로 \$A\\subset B\$인 순서쌍은 \$12\$가지이다. 따라서 구하는 확률은 \$\\dfrac{12}{42}=\\dfrac{2}{7}\$이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-PS-03",
  "subUnitKey": "H22-PS-03-PROBABILITY_BASIC",
  "conceptClusterKey": "PROBABILITY",
  "primaryMethod": "전체 7*6=42 중 n(B)=2,3별 진부분집합 수 6+6=12의 비 12/42=2/7 산출",
  "decisiveStep": "n(B)=k일 때 공집합·자기 자신 제외 2^k-2 계산",
  "rpm": {
    "majorUnit": "확률",
    "midUnit": "확률의 뜻과 활용",
    "l3": "확률의 기본",
    "l4": "표본공간과 사건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_PROBABILITY_PROPERTIES_APPLICATION",
    "templateKey": "TPL_PROBABILITY_BASIC_COUNT_RATIO",
    "why": "확률의 기본 > 표본공간과 사건 (ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공집합이 아닌 서로 다른 두 부분집합의 포함관계 순서쌍 개수를 B의 원소 수별로 세어 확률을 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "집합",
      "부분집합"
    ],
    "goal": [
      "확률"
    ],
    "method": [
      "조합",
      "확률"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q18

- 형식: 객관식  
- 배점: 4.4

### 발문

\$4\$개의 서로 다른 인형에 각각 양말을 먼저 신긴 다음에 신발을 신기려고 한다. \$4\$개의 인형에 양말과 신발을 신기는 순서를 정하는 모든 경우의 수는? (단, 각 인형에서 양말과 신발을 연속하여 신기지 않아도 된다.)

### 선지

① \$1680\$ ② \$1960\$ ③ \$2160\$ ④ \$2400\$ ⑤ \$2520\$

### 정답

⑤

### 해설

각 인형마다 ‘양말 \$\\to\$ 신발’의 순서가 고정되어 있으므로 전체 \$8\$개의 작업을 일렬로 나열하는 같은 것이 있는 순열과 같다. \$\$\\frac{8\!}{2\!,2\!,2\!,2\!} \= \\frac{40320}{16} \= 2520\$\$ 정답은 ⑤이다.

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
  "primaryMethod": "4개 인형 각각의 2단계 순서 고정에 8!/(2!)^4=2520 같은 것이 있는 순열 적용",
  "decisiveStep": "8! / (2!2!2!2!) = 2520",
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
  "difficultyReason": "각 대상 내부의 작업 순서가 고정된 다중 작업 스케줄링을 같은 것이 있는 순열로 모델링하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "집합"
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

## Q19

- 형식: 객관식  
- 배점: 4.5

### 발문

볼펜 \$3\$개와 연필 \$3\$개를 \$4\$명의 학생 \$A,\\ B,\\ C,\\ D\$에게 다음 규칙에 따라 남김없이 나누어 주는 경우의 수는? (단, 볼펜과 연필은 각각 서로 구별되지 않고, 볼펜과 연필을 받지 못하는 학생이 있을 수 있다.) (가) 두 학생 \$A,\\ B\$가 받은 볼펜과 연필의 개수의 합은 홀수이다. (나) 학생 \$C\$가 받은 볼펜과 연필의 개수의 합은 학생 \$D\$가 받은 볼펜과 연필의 개수의 합의 \$2\$배이다. (다) 학생 \$D\$는 볼펜 또는 연필을 적어도 \$1\$개 받는다.

### 선지

① \$28\$ ② \$32\$ ③ \$36\$ ④ \$40\$ ⑤ \$44\$

### 정답

②

### 해설

\$D,\\ C\$가 받은 개수를 \$d,\\ c\$라 하면 \$c=2d,\\ d\\ge 1\$이고 총합 \$6\$이므로 \$(d,\\ c)=(1,\\ 2)\$ 또는 \$(2,\\ 4)\$이다. \$d=2,\\ c=4\$이면 \$A+B=0\$이 되어 (가)에 모순이므로 \$d=1,\\ c=2\$이고 \$A+B=3\$이다. ① \$D\$가 볼펜 \$1\$개: \$C\$가 볼펜 \$p\$개(\$0\\le p\\le 2\$), 연필 \$2-p\$개를 받으면 \$A,\\ B\$는 볼펜 \$2-p\$개, 연필 \$p+1\$개를 나누어 받으므로 \$\\sum\_{p=0}^{2}(3-p)(p+2)=6+6+4=16\$가지 ② \$D\$가 연필 \$1\$개: \$C\$가 볼펜 \$p\$개(\$0\\le p\\le 2\$), 연필 \$2-p\$개를 받으면 \$A,\\ B\$는 볼펜 \$3-p\$개, 연필 \$p\$개를 나누어 받으므로 \$\\sum\_{p=0}^{2}(4-p)(p+1)=4+6+6=16\$가지 따라서 구하는 경우의 수는 \$16+16=32\$이다. 정답은 ②이다.

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
  "primaryMethod": "홀수 조건으로 d=1, c=2를 확정한 뒤 D의 종류(볼펜/연필)와 C의 볼펜 수 p=0,1,2별 2명 분배 합산 32 계산",
  "decisiveStep": "d=2, c=4 배제 후 D 종류 2가지와 C의 볼펜 개수 p별 (n+1)(m+1) 합산",
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
  "difficultyReason": "두 종류 물건의 4명 분배에서 배수·홀짝 조건으로 각 그룹 총량을 결정하고 내부 구성비까지 이중 분류해 세어야 하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "방정식"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "중복조합",
      "경우분류"
    ],
    "condition": [
      "홀수"
    ]
  },
  "hold": ""
}
```

## Q20

- 형식: 객관식  
- 배점: 4.4

### 발문

다음 조건을 만족시키는 다섯 개의 자연수 \$a,\\ b,\\ c,\\ d,\\ e\$의 모든 순서쌍 \$(a,\\ b,\\ c,\\ d,\\ e)\$의 개수는? (가) \$a+b+c+d+e=9\$ (나) \$a\\times b\\times c\\times d\\times e\$는 \$4\$의 배수이다.

### 선지

① \$40\$ ② \$45\$ ③ \$50\$ ④ \$55\$ ⑤ \$60\$

### 정답

④

### 해설

합이 \$9\$인 다섯 자연수 조합 중 곱이 \$4\$의 배수인 경우는 다음과 같다. ① \${4,\\ 2,\\ 1,\\ 1,\\ 1}\$: \$\\dfrac{5\!}{3\!}=20\$가지 ② \${3,\\ 2,\\ 2,\\ 1,\\ 1}\$: \$\\dfrac{5\!}{2\!,2\!}=30\$가지 ③ \${2,\\ 2,\\ 2,\\ 2,\\ 1}\$: \$\\dfrac{5\!}{4\!}=5\$가지 따라서 구하는 개수는 \$20+30+5=55\$이다. 정답은 ④이다.

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
  "primaryMethod": "합이 9인 5개 자연수 분할 중 곱이 4의 배수인 3가지 조합의 같은 것이 있는 순열 20+30+5=55 합산",
  "decisiveStep": "4의 배수 조건(4 포함 또는 2 이상 2개 포함)에 맞는 자연수 분할 3종 열거",
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
  "difficultyReason": "합이 9인 자연수 분할을 빠짐없이 찾은 뒤 곱이 4의 배수인 조합만 골라 배열 수를 합산하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "방정식",
      "자연수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "같은것이있는순열",
      "경우분류"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": ""
}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

\[서술형 1\] \$(1+3x)+(1+3x)^2+(1+3x)^3+\\cdots+(1+3x)^8\$의 전개식에서 \$x^3\$의 계수를 구하는 과정을 구체적으로 서술하시오.

### 선지

없음

### 정답

3402

### 해설

주어진 식은 첫째항이 \$1+3x\$, 공비가 \$1+3x\$인 등비수열의 합이므로 \$\$S \= \\frac{(1+3x){(1+3x)^8-1}}{(1+3x)-1} \= \\frac{(1+3x)^9-(1+3x)}{3x}\$\$ 따라서 \$x^3\$의 계수는 분자의 \$x^4\$ 계수를 \$3\$으로 나눈 값과 같다. \$\$\\frac{{}*{9}\\mathrm{C}*{4}\\cdot 3^4}{3} \= 126\\times 27 \= 3402\$\$

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
  "standardUnitKey": "H22-PS-02",
  "subUnitKey": "H22-PS-02-CORE",
  "conceptClusterKey": "BINOMIAL_THEOREM",
  "primaryMethod": "등비수열 합 공식으로 ((1+3x)^9-(1+3x))/(3x)을 세워 분자 x^4 계수의 1/3인 3402 계산",
  "decisiveStep": "등비수열 합 정리 후 9C4 * 3^3 = 126 * 27 계산",
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
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "등비수열의 합 또는 하키스틱 공식을 이용해 다항식 합의 특정 차수 계수를 구하는 서술형 문항이다.",
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

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

\[서술형 2\] 주머니 속에 \$1,\\ 2,\\ 3,\\ 4,\\ 5\$가 각각 하나씩 적혀 있는 공 \$5\$개가 들어 있다. 이 주머니에서 \$1\$개의 공을 꺼내어 공에 적힌 수를 확인한 후 다시 넣을 때, 꺼낸 공의 수가 \$3\$ 이하이면 나온 수의 점수를 얻고 \$4\$ 이상이면 \$0\$점을 얻는다. 이 과정을 \$4\$번 반복할 때, 꺼낸 공에 적혀 있는 수를 차례로 \$a,\\ b,\\ c,\\ d\$라 하자. 얻은 네 점수의 합이 \$5\$가 되는 모든 순서쌍 \$(a,\\ b,\\ c,\\ d)\$의 개수를 구하는 과정을 구체적으로 서술하시오.

### 선지

없음

### 정답

100

### 해설

\$0\$점이 나오는 공은 \${4,\\ 5}\$(\$2\$가지), \$1,\\ 2,\\ 3\$점이 나오는 공은 각각 \$1\$가지씩이다. 네 점수의 합이 \$5\$가 되는 경우는 다음과 같다. ① \$(3,\\ 2,\\ 0,\\ 0)\$: \$\\dfrac{4\!}{2\!}\\times 2^2 \= 12\\times 4 \= 48\$ ② \$(3,\\ 1,\\ 1,\\ 0)\$: \$\\dfrac{4\!}{2\!}\\times 2 \= 12\\times 2 \= 24\$ ③ \$(2,\\ 2,\\ 1,\\ 0)\$: \$\\dfrac{4\!}{2\!}\\times 2 \= 12\\times 2 \= 24\$ ④ \$(2,\\ 1,\\ 1,\\ 1)\$: \$\\dfrac{4\!}{3\!}\\times 1 \= 4\$ 따라서 구하는 순서쌍의 개수는 \$48+24+24+4=100\$이다.

```
"NONE"
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
  "primaryMethod": "합이 5인 4회 점수 조합 4종마다 배열 수와 0점 공(4,5) 가중치 2^k를 곱해 48+24+24+4=100 산출",
  "decisiveStep": "0점 대응 공이 2개({4,5})임을 반영해 2^(0점 개수) 가중치 곱셈",
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
  "difficultyReason": "동일 점수(0점)에 여러 공이 대응하는 규칙에서 점수 조합별 배열 수와 대응 가짓수를 결합해야 하는 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "집합"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "같은것이있는순열",
      "경우분류"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

\[서술형 3\] 집합 \$X={1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6}\$에 대하여 다음 조건을 만족시키는 함수 \$f:X\\to X\$의 개수를 구하는 과정을 구체적으로 서술하시오. (가) \$f(1)\\times f(6)\$의 값은 \$6\$의 약수이다. (나) \$2f(1)\\le f(2)\\le f(3)\\le f(4)\\le f(5)\\le 2f(6)\$

### 선지

없음

### 정답

171

### 해설

\$f(1)\\le f(6)\$이고 \$f(1)f(6)\\in{1,\\ 2,\\ 3,\\ 6}\$이므로 가능한 \$(f(1),\\ f(6))\$은 \$(1,\\ 1),\\ (1,\\ 2),\\ (1,\\ 3),\\ (1,\\ 6),\\ (2,\\ 3)\$이다. ① \$(1,\\ 1)\$: \$2\\le f(2)\\le\\cdots\\le f(5)\\le 2 \\implies {}*{1}\\mathrm{H}*{4}=1\$ ② \$(1,\\ 2)\$: \$2\\le f(2)\\le\\cdots\\le f(5)\\le 4 \\implies {}*{3}\\mathrm{H}*{4}={}*{6}\\mathrm{C}*{4}=15\$ ③ \$(1,\\ 3)\$: \$2\\le f(2)\\le\\cdots\\le f(5)\\le 6 \\implies {}*{5}\\mathrm{H}*{4}={}*{8}\\mathrm{C}*{4}=70\$ ④ \$(1,\\ 6)\$: 치역이 \$X\$이므로 \$2\\le f(2)\\le\\cdots\\le f(5)\\le 6 \\implies {}*{5}\\mathrm{H}*{4}=70\$ ⑤ \$(2,\\ 3)\$: \$4\\le f(2)\\le\\cdots\\le f(5)\\le 6 \\implies {}*{3}\\mathrm{H}*{4}=15\$ 따라서 구하는 함수의 개수는 \$1+15+70+70+15=171\$이다.

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
  "primaryMethod": "f(1)f(6)이 6의 약수인 5가지 경계 쌍마다 치역 상한 6과 min(2f(6),6)을 반영해 1+15+70+70+15=171 계산",
  "decisiveStep": "(1,6)에서 2f(6)=12가 치역 상한 6으로 제한됨을 반영",
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
  "difficultyReason": "경계 함수값의 곱 약수 조건과 2배 비감소 부등식, 공역 상한 제한을 모두 결합해 중복조합으로 합산해야 하는 최고난도 서술형 문항이다.",
  "level": "상",
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
      "중복조합",
      "경우분류"
    ],
    "condition": [
      "약수"
    ]
  },
  "hold": ""
}
```

