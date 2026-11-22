

```
{"stem": "26_효천고_2학기_중간_고2_미적분I_유사", "sourceArchiveFile": "original/high/h2/2mid/26_효천고_2학기_중간_고2_미적분I.js", "examFolder": "2mid", "grade": "고2", "subject": "미적분I", "curriculum": "2022", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.3



### 발문



함수 \$f(x)=4x^2-3\$의 \$x=1\$에서의 미분계수는?



### 선지



① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$



### 정답



③



### 해설



\$f'(x)=8x\$이므로 \$f'(1)=8\\cdot 1=8\$이다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q01",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "4x^2-3을 미분한 도함수 f'(x)=8x에 x=1을 대입해 8 계산",
  "decisiveStep": "f'(1) = 8",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "도함수",
    "l4": "도함수 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "도함수 > 도함수 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차다항식을 미분해 x=1에서의 미분계수를 바로 구하는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이차함수"
    ],
    "goal": [
      "미분계수"
    ],
    "method": [
      "도함수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q02

- 형식: 객관식  
- 배점: 3.4



### 발문



함수 \$f(x)=\\begin{cases}x+a&(x\<-2)\\2x-3&(x\\ge \-2)\\end{cases}\$에 대하여 \$\\lim\_{x\\to \-2^+}f(x)=\\lim\_{x\\to \-2^-}f(x)\$를 만족시킬 때, 상수 \$a\$의 값은?



### 선지



① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$



### 정답



①



### 해설



\$\\lim\_{x\\to \-2^+}f(x)=2(-2)-3=-7\$이고 \$\\lim\_{x\\to \-2^-}f(x)=-2+a\$이므로 \$-2+a=-7 \\implies a=-5\$이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q02",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "x=-2 우극한 -7과 좌극한 -2+a를 같게 놓아 a=-5 결정",
  "decisiveStep": "-2+a = -7",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "함수의 극한",
    "l4": "좌극한·우극한"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_DIRECTIONAL_APPROACH",
    "why": "함수의 극한 > 좌극한·우극한"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간별 일차함수의 좌극한과 우극한을 일치시키는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "좌극한",
      "우극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q03

- 형식: 객관식  
- 배점: 3.5



### 발문



극한 \$\\lim\_{x\\to 2}\\dfrac{\\sqrt{x+1}-\\sqrt{3}}{x-2}\$의 값은?



### 선지



① \$\\dfrac{\\sqrt{3}}{2}\$ ② \$\\dfrac{\\sqrt{3}}{3}\$ ③ \$\\dfrac{\\sqrt{3}}{4}\$ ④ \$\\dfrac{\\sqrt{3}}{6}\$ ⑤ \$\\dfrac{1}{3}\$



### 정답



④



### 해설



분자를 유리화하여 약분하면 \$\$\\lim\_{x\\to 2}\\frac{x-2}{(x-2)(\\sqrt{x+1}+\\sqrt{3})}=\\lim\_{x\\to 2}\\frac{1}{\\sqrt{x+1}+\\sqrt{3}}=\\frac{1}{2\\sqrt{3}}=\\frac{\\sqrt{3}}{6}\$\$ 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q03",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "무리식 분자 유리화로 (x-2) 약분 후 x=2 대입해 sqrt(3)/6 계산",
  "decisiveStep": "분자 유리화 후 1/(sqrt(x+1)+sqrt(3)) 극한 대입",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "함수의 극한",
    "l4": "극한값 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": null,
    "why": "함수의 극한 > 극한값 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "0/0 꼴 무리식 극한을 켤레식으로 유리화해 계산하는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "무리함수"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "유리화",
      "극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q04

- 형식: 객관식  
- 배점: 3.6



### 발문



함수 \$f(x)=\\begin{cases}x^2+4x+a&(x\\ne a)\\-2x-6&(x=a)\\end{cases}\$이 실수 전체의 집합에서 연속일 때, 모든 실수 \$a\$의 값의 곱은?



### 선지



① \$3\$ ② \$6\$ ③ \$9\$ ④ \$12\$ ⑤ \$15\$



### 정답



②



### 해설



\$x=a\$에서의 연속 조건 \$\\lim\_{x\\to a}f(x)=f(a)\$에서 \$a^2+5a=-2a-6\$이다. \$\$a^2+7a+6=(a+1)(a+6)=0 \\implies a=-1,\\ \-6\$\$ 따라서 모든 실수 \$a\$의 값의 곱은 \$(-1)(-6)=6\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q04",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "x=a 연속 등식 a^2+5a=-2a-6을 인수분해해 a=-1,-6의 곱 6 계산",
  "decisiveStep": "a^2+7a+6=(a+1)(a+6)=0",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속 조건",
    "l4": "미정계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": null,
    "why": "연속 조건 > 미정계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "경계점 x=a에서 극한값과 함숫값이 같도록 하는 이차방정식의 두 근의 곱을 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "연속",
      "이차방정식"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q05

- 형식: 객관식  
- 배점: 3.7



### 발문



함수 \$f(x)=x^3-ax^2+bx-4\$의 그래프 위의 점 \$(2,\\ 0)\$에서의 접선의 기울기가 \$4\$일 때, 두 상수 \$a,\\ b\$에 대하여 \$a+b\$의 값은?



### 선지



① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$



### 정답



⑤



### 해설



\$f(2)=8-4a+2b-4=0 \\implies 2a-b=2\$, \$f'(2)=12-4a+b=4 \\implies 4a-b=8\$이다. 두 식을 연립하면 \$a=3,\\ b=4\$이므로 \$a+b=7\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q05",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "f(2)=0과 f'(2)=4를 연립해 a=3, b=4 및 합 7 계산",
  "decisiveStep": "2a-b=2, 4a-b=8 연립",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "접선",
    "l4": "접선의 방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "why": "접선 > 접선의 방정식"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접점의 함숫값과 미분계수 조건을 연립일차방정식으로 풀어 계수를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수",
      "점"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "도함수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q06

- 형식: 객관식  
- 배점: 3.7



### 발문



양수 \$k\$와 함수 \$f(x)=2x^3+6x^2+4x\$에 대하여 닫힌구간 \$\[-k,\\ 0\]\$에서 롤의 정리를 만족시키는 실수 \$c\$가 존재하도록 하는 모든 양수 \$k\$의 값의 합은?



### 선지



① \$3\$ ② \$1\$ ③ \$2\$ ④ \$4\$ ⑤ \$5\$



### 정답



①



### 해설



\$f(-k)=f(0)=0\$이어야 하므로 \$-2k^3+6k^2-4k=-2k(k-1)(k-2)=0\$이다. \$k\>0\$이므로 \$k=1,\\ 2\$이고 합은 \$1+2=3\$이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q06",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "롤의 정리 전제조건 f(-k)=f(0)=0을 인수분해해 양수 k=1,2의 합 3 계산",
  "decisiveStep": "-2k(k-1)(k-2)=0에서 k>0 해 선택",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "롤의 정리와 평균값 정리",
    "l4": "롤의 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_MEAN_VALUE_THEOREM",
    "templateKey": "TPL_MVT_ROLLE_DIRECT",
    "why": "롤의 정리와 평균값 정리 > 롤의 정리"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항함수에 대한 롤의 정리 적용 조건 f(a)=f(b)를 풀어 양수 구간 끝점을 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수",
      "구간"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "인수분해",
      "롤의정리"
    ],
    "condition": [
      "양수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q07

- 형식: 객관식  
- 배점: 3.8



### 발문



실수 \$t\$에 대하여 유리함수 \$y=\\dfrac{5}{2x-1}+3\$과 직선 \$y=t\$가 만나는 점의 개수를 \$f(t)\$라 하자. 함수 \$g(x)=3x+a\$에 대하여 함수 \$f(x)g(x)\$가 실수 전체의 집합에서 연속일 때, 상수 \$a\$의 값은?



### 선지



① \$-3\$ ② \$-6\$ ③ \$-9\$ ④ \$6\$ ⑤ \$9\$



### 정답



③



### 해설



\$f(t)=0\$ (\$t=3\$), \$1\$ (\$t\\ne 3\$)이므로 \$x=3\$에서 \$f(x)g(x)\$가 연속이 되려면 \$g(3)=9+a=0\$, 즉 \$a=-9\$여야 한다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q07",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "유리함수 점근선 y=3에서 불연속인 f(x)와의 곱 연속 조건 g(3)=0으로 a=-9 산출",
  "decisiveStep": "점근선 t=3 불연속점을 g(3)=0으로 상쇄",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속 조건",
    "l4": "구간별 함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "why": "연속 조건 > 구간별 함수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "유리함수의 수평선 교점 개수 함수의 불연속점을 일차함수 영점으로 상쇄해 연속을 만드는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "유리함수",
      "직선"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "연속"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q08

- 형식: 객관식  
- 배점: 3.9



### 발문



함수 \$f(x)=mx+2\$에 대하여 \$\\lim\_{h\\to 0}\\dfrac{f(a+3h)+f(a)-6}{h}=15\$일 때, \$f(2a)\$의 값은? (단, \$m,\\ a\$는 상수이다.)



### 선지



① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$



### 정답



②



### 해설



분자는 \$2ma-2+3mh\$이므로 극한이 유한하려면 \$2ma-2=0 \\implies ma=1\$이고, 극한값 \$3m=15 \\implies m=5,\\ a=\\dfrac{1}{5}\$이다. 따라서 \$f(2a)=5(2a)+2=2+2=4\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q08",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "분자 (2ma-2)+3mh의 0/0 수렴 조건 ma=1과 극한값 3m=15로 m=5, a=1/5 결정",
  "decisiveStep": "2ma-2=0 및 3m=15 연립",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "미정계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "why": "극한의 성질 > 미정계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "0/0 꼴 수렴 조건과 극한값을 이용해 일차함수의 계수와 점을 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "일차함수",
      "극한"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q09

- 형식: 객관식  
- 배점: 4



### 발문



닫힌구간 \$\[-1,\\ 4\]\$에서 정의된 함수 \$f(x)=\\lim\_{t\\to\\infty}\\dfrac{2-tx}{1+t}(x-4)\$의 최댓값과 최솟값의 곱은?



### 선지



① \$20\$ ② \$16\$ ③ \$-12\$ ④ \$-16\$ ⑤ \$-20\$



### 정답



⑤



### 해설



\$f(x)=-x(x-4)=-(x-2)^2+4\$이므로 \$\[-1,\\ 4\]\$에서 최댓값은 \$f(2)=4\$, 최솟값은 \$f(-1)=-5\$이다. 따라서 곱은 \$4\\times(-5)=-20\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q09",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "t->무한대 극한으로 f(x)=-x(x-4)를 확정한 뒤 [-1,4] 최댓값 4, 최솟값 -5의 곱 -20 산출",
  "decisiveStep": "극한식 정리 f(x)=-(x-2)^2+4 후 양끝점과 꼭짓점 비교",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "최대·최소",
    "l4": "구간 최대·최소"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "why": "최대·최소 > 구간 최대·최소"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "매개변수 무한대 극한으로 함수를 먼저 구한 뒤 닫힌구간에서의 최대·최소 곱을 계산하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "극한",
      "구간"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "극한",
      "최대최소정리"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q10

- 형식: 객관식  
- 배점: 4.1



### 발문



다항함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$f(1)\$의 값은? (단, \$k\$는 상수이다.) (가) \$\\lim\_{x\\to\\infty}\\dfrac{f(x)+2x^2-x}{x^2-f(x)}=-4\$ (나) \$\\lim\_{x\\to \-2}\\dfrac{f(x)}{(x+2)^2}=k\$



### 선지



① \$9\$ ② \$12\$ ③ \$16\$ ④ \$18\$ ⑤ \$24\$



### 정답



④



### 해설



(가)에서 \$f(x)=Ax^2+Bx+C\$라 하면 \$\\dfrac{A+2}{1-A}=-4 \\implies A+2=-4+4A \\implies A=2\$이다. (나)에서 \$f(x)\$는 \$(x+2)^2\$을 인수로 가지므로 \$f(x)=2(x+2)^2\$이고 \$f(1)=2\\cdot 3^2=18\$이다. 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q10",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "무한대 극한 계수비 (A+2)/(1-A)=-4로 A=2를 구하고 (x+2)^2 인수로 f(x)=2(x+2)^2 결정",
  "decisiveStep": "(A+2)/(1-A)=-4에서 최고차항 계수 A=2 도출",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "미정계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "why": "극한의 성질 > 미정계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "무한대 극한과 유한 점 제곱 인자 극한을 결합해 이차다항식을 결정하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "다항함수",
      "극한"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "극한",
      "인수분해"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q11

- 형식: 객관식  
- 배점: 4.3



### 발문



그림과 같이 직선 \$y=\\dfrac{1}{3}x+1\$ 위의 두 점 \$A(-3,\\ 0)\$, \$P\\left(t,\\ \\dfrac{1}{3}t+1\\right)\$이 있다. 점 \$P\$를 지나고 직선 \$y=\\dfrac{1}{3}x+1\$에 수직인 직선이 \$y\$축과 만나는 점을 \$Q\$라 할 때, \$\\lim\_{t\\to\\infty}\\dfrac{\\overline{AP}^2}{\\overline{AQ}^2}\$의 값은?



### 선지



① \$\\dfrac{1}{10}\$ ② \$\\dfrac{1}{9}\$ ③ \$\\dfrac{1}{8}\$ ④ \$\\dfrac{1}{5}\$ ⑤ \$\\dfrac{1}{3}\$



### 정답



①



### 해설



수선의 기울기는 \$-3\$이므로 \$y-\\left(\\dfrac{1}{3}t+1\\right)=-3(x-t)\$에서 \$x=0\$일 때 \$Q\\left(0,\\ \\dfrac{10}{3}t+1\\right)\$이다. \$\$\\overline{AP}^2=\\frac{10}{9}(t+3)^2, \\quad \\overline{AQ}^2=9+\\left(\\frac{10}{3}t+1\\right)^2\$\$ 따라서 \$\\lim\_{t\\to\\infty}\\dfrac{\\overline{AP}^2}{\\overline{AQ}^2}=\\dfrac{10/9}{100/9}=\\dfrac{1}{10}\$이다. 정답은 ①이다.

```
{"figureType": "line_perpendicular_triangle_limit", "description": "직선 y=(1/3)x+1 위의 점 A(-3,0), P와 수선이 y축과 만나는 점 Q", "elements": ["line y=(1/3)x+1", "points A(-3,0) and P(t, t/3+1)", "perpendicular at P meeting y-axis at Q"]}
```

```
{
  "sourceQid": "Q11",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "점 P에서의 수선 y절편 Q(0, 10t/3+1)을 구해 AP^2/AQ^2 최고차항 계수비 1/10 계산",
  "decisiveStep": "Q의 y좌표 (10/3)t+1 산출 후 t^2 계수비 비교",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "무한대에서의 극한",
    "l4": "다항·유리함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_INFINITY_LEADING_TERM",
    "why": "무한대에서의 극한 > 다항·유리함수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수직 직선의 y절편과 두 선분 길이 제곱을 매개변수 t로 나타낸 뒤 무한대 극한을 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "직선",
      "점"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한",
      "거리"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q12

- 형식: 객관식  
- 배점: 4.5



### 발문



좌표평면 위에서 곡선 \$y=x^2+5x+4\$ 위의 점과 직선 \$y=-x-8\$ 위의 점 사이의 거리의 최솟값은?



### 선지



① \$\\dfrac{\\sqrt{2}}{2}\$ ② \$\\sqrt{2}\$ ③ \$\\dfrac{3\\sqrt{2}}{2}\$ ④ \$2\\sqrt{2}\$ ⑤ \$\\dfrac{5\\sqrt{2}}{2}\$



### 정답



③



### 해설



곡선 위의 점 \$(x,\\ x^2+5x+4)\$에서 직선 \$x+y+8=0\$까지의 거리는 \$\$d(x)=\\frac{\|x^2+6x+12\|}{\\sqrt{2}}=\\frac{(x+3)^2+3}{\\sqrt{2}}\\ge\\frac{3}{\\sqrt{2}}=\\frac{3\\sqrt{2}}{2}\$\$ 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q12",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "포물선 위 점에서 직선 x+y+8=0까지 거리를 이차식 ((x+3)^2+3)/sqrt(2)로 정리해 최솟값 3sqrt(2)/2 계산",
  "decisiveStep": "(x+3)^2+3 >= 3 완전제곱식 최솟값 도출",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "최대·최소",
    "l4": "활용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_MODELED_QUANTITY_OPTIMIZATION",
    "why": "최대·최소 > 활용"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "곡선과 직선 사이의 최단 거리를 점과 직선 사이 거리 공식 또는 평행 접선으로 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
      "직선"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "점과직선사이의거리"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q13

- 형식: 객관식  
- 배점: 4.7



### 발문



다항식 \$(x^2-1)(x^2+ax)-12\$를 \$(x-2)^2\$으로 나누었을 때의 나머지를 \$R(x)\$라 하자. \$R(x)\$가 \$x-2\$로 나누어떨어질 때, \$R(a+1)\$의 값은? (단, \$a\$는 상수이다.)



### 선지



① \$-14\$ ② \$-28\$ ③ \$-36\$ ④ \$-42\$ ⑤ \$-56\$



### 정답



②



### 해설



\$P(x)=(x^2-1)(x^2+ax)-12\$라 하면 \$R(2)=P(2)=3(4+2a)-12=6a=0 \\implies a=0\$이다. \$P(x)=x^4-x^2-12\$이므로 \$P'(x)=4x^3-2x\$이고 \$P'(2)=32-4=28\$이다. 따라서 \$R(x)=28(x-2)\$이고 \$R(a+1)=R(1)=-28\$이다. 정답은 ②이다.

```
"NONE"
```

```
{
  "sourceQid": "Q13",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "R(2)=P(2)=0으로 a=0을 구하고 미분 R'(2)=P'(2)=28로 R(x)=28(x-2)를 세워 R(1)=-28 산출",
  "decisiveStep": "P(2)=0에서 a=0 결정 후 P'(2)=28 계산",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "도함수",
    "l4": "미분법"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "도함수 > 미분법"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미정계수 포함 사차식의 (x-2)^2 나눗셈 나머지를 원식과 도함수의 x=2 값으로 결정하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "다항식"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "도함수",
      "나머지정리"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q14

- 형식: 객관식  
- 배점: 4.8



### 발문



양의 실수 전체의 집합에서 연속인 함수 \$f(x)\$가 모든 양의 실수 \$x\$에 대하여 \$(\\sqrt{x}-3)f(x)=x^2+ax+b\$를 만족시키고 \$f(1)=8\$일 때, \$f(9)\$의 값은? (단, \$a,\\ b\$는 상수이다.)



### 선지



① \$42\$ ② \$48\$ ③ \$54\$ ④ \$56\$ ⑤ \$60\$



### 정답



⑤



### 해설



\$x=1\$에서 \$-2\\cdot 8=1+a+b \\implies a+b=-17\$, \$x=9\$에서 \$81+9a+b=0\$이므로 연립하면 \$a=-8,\\ b=-9\$이다. \$x^2-8x-9=(x-9)(x+1)\$이므로 \$x\\ne 9\$에서 \$f(x)=(\\sqrt{x}+3)(x+1)\$이고, 연속성에 의해 \$f(9)=6\\times 10=60\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q14",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "x=1 함숫값과 x=9 분모 0 조건으로 a=-8, b=-9를 구해 약분 극한 f(9)=60 계산",
  "decisiveStep": "(x-9)/(sqrt(x)-3) = sqrt(x)+3 약분 후 x=9 대입",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속 조건",
    "l4": "미정계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": null,
    "why": "연속 조건 > 미정계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "무리인수를 포함한 등식에서 연속성으로 미정계수를 찾고 0/0 약분을 통해 함숫값을 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "연속",
      "유리화"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q15

- 형식: 객관식  
- 배점: 4.8



### 발문



함수 \$f(x)=\|x-2\|\$, \$g(x)=\\begin{cases}x-2&(x\<0)\\x^3+ax^2+bx+c&(x\\ge 0)\\end{cases}\$에 대하여 함수 \$f(x)g(x)\$가 실수 전체의 집합에서 미분가능할 때, 세 상수 \$a,\\ b,\\ c\$에 대하여 \$a+b+c\$의 값은?



### 선지



① \$-6\$ ② \$-5\$ ③ \$-4\$ ④ \$-3\$ ⑤ \$-2\$



### 정답



④



### 해설



\$h(x)=f(x)g(x)\$가 \$x=0\$에서 연속이므로 \$2(-2)=2c \\implies c=-2\$이다. \$x\<0\$에서 \$h(x)=-(x-2)^2 \\implies h'(0^-)=4\$, \$0\<x\<2\$에서 \$h'(0^+)=2+2b\$이므로 \$b=1\$이다. \$x=2\$에서 미분가능하려면 \$g(2)=0\$이어야 하므로 \$8+4a+2-2=0 \\implies a=-2\$이다. 따라서 \$a+b+c=-3\$이다. 정답은 ④이다.

```
"NONE"
```

```
{
  "sourceQid": "Q15",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x=0 연속(c=-2)·미분가능(b=1)과 x=2 첨점 상쇄(g(2)=0, a=-2)를 연립해 합 -3 계산",
  "decisiveStep": "x=0 좌우미분계수 일치와 x=2 영점 조건 g(2)=0 결합",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "미분가능성과 연속",
    "l4": "미분가능 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "why": "미분가능성과 연속 > 미분가능 조건 (ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "경계 x=0의 미분가능 조건과 절댓값 첨점 x=2의 상쇄 조건을 모두 풀어 세 계수를 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "미분가능",
      "절댓값"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": ""
}
```

## Q16

- 형식: 객관식  
- 배점: 4.9



### 발문



다항함수 \$f(x)\$가 \$\\lim\_{x\\to 0}\\dfrac{f(x)}{x}=5\$, \$\\lim\_{x\\to 2}\\dfrac{f(x)}{x-2}=3\$을 만족시킬 때, 극한값 \$\\lim\_{x\\to 2}\\dfrac{f(f(x))}{2x^2+x-10}\$의 값은?



### 선지



① \$\\dfrac{5}{3}\$ ② \$\\dfrac{1}{3}\$ ③ \$\\dfrac{2}{3}\$ ④ \$\\dfrac{4}{3}\$ ⑤ \$2\$



### 정답



①



### 해설



\$2x^2+x-10=(x-2)(2x+5)\$이고 \$x\\to 2\$일 때 \$f(x)\\to 0\$이므로 \$\$\\lim\_{x\\to 2}\\frac{f(f(x))}{2x^2+x-10}=\\lim\_{x\\to 2}\\frac{f(f(x))}{f(x)}\\cdot\\frac{f(x)}{x-2}\\cdot\\frac{1}{2x+5}=5\\times 3\\times\\frac{1}{9}=\\frac{5}{3}\$\$ 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q16",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "분모 (x-2)(2x+5) 인수분해 후 f(f(x))/f(x)와 f(x)/(x-2) 곱으로 분리해 5*3/9=5/3 산출",
  "decisiveStep": "u=f(x)->0 치환으로 f(u)/u -> 5 적용",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "대수적 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "why": "극한의 성질 > 대수적 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "합성함수 f(f(x))의 극한을 두 개의 알려진 미분계수 꼴 극한의 곱으로 분해해 계산하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "다항함수",
      "극한"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한의성질",
      "인수분해"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q17

- 형식: 객관식  
- 배점: 5.0



### 발문



\$-2\<x\<2\$에서 정의된 함수 \$y=f(x)\$의 그래프가 그림과 같을 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? (단, \$f^{-1}(x)\$는 함수 \$f(x)\$의 역함수이다.) ㄱ. \$\\lim\_{x\\to 1^-}f(x)=-1\$ ㄴ. \$\\lim\_{x\\to 1^+}f^{-1}(x)=1\$ ㄷ. \$\\lim\_{x\\to a^-}f^{-1}(x)+\\lim\_{x\\to a^+}f^{-1}(x)=\\dfrac{1}{2}\$을 만족시키는 실수 \$a\$는 존재하지 않는다.



### 선지



① ㄴ ② ㄷ ③ ㄱ ④ ㄱ, ㄴ ⑤ ㄱ, ㄷ



### 정답



③



### 해설



ㄱ. \$(0,\\ 1\]\$에서 \$(0,\\ 0)\$에서 \$(1,\\ \-1)\$로 향하므로 \$\\lim\_{x\\to 1^-}f(x)=-1\$이다(참). ㄴ. \$(1,\\ 2)\$에서 \$(1,\\ 2)\$와 \$(2,\\ 1)\$을 잇는 선분이므로 \$y\\to 1^+\$일 때 \$x\\to 2\$이다. 즉 \$\\lim\_{x\\to 1^+}f^{-1}(x)=2\$이다(거짓). ㄷ. \$a=-\\dfrac{1}{4}\$일 때 \$f^{-1}\\left(-\\dfrac{1}{4}\\right)=\\dfrac{1}{4}\$이고 연속이므로 좌·우극한의 합은 \$\\dfrac{1}{2}\$이다(거짓). 정답은 ③이다.

```
{"figureType": "piecewise_invertible_graph", "description": "(-2,0)에서 (-2,-2)~(0,0), (0,1]에서 (0,0)~(1,-1), (1,2)에서 (1,2)~(2,1) 선분 그래프", "elements": ["segment (-2,-2) to (0,0)", "segment (0,0) to (1,-1) closed at (1,-1)", "open segment (1,2) to (2,1)"]}
```

```
{
  "sourceQid": "Q17",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "원래 함수 그래프에서 y축 방향 접근으로 역함수의 우극한(2)과 연속점(-1/4)을 읽어 ㄱ만 참 판정",
  "decisiveStep": "y->1+ 역함수 극한 2와 a=-1/4 반례 확인",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "함수의 극한",
    "l4": "좌극한·우극한"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_DIRECTIONAL_APPROACH",
    "why": "함수의 극한 > 좌극한·우극한"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간별 불연속 함수의 그래프에서 역함수의 좌·우극한을 y축 기준으로 읽어내야 하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "그래프",
      "역함수"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "좌극한",
      "우극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q18

- 형식: 서답형  
- 배점: 3



### 발문



두 함수 \$f(x),\\ g(x)\$에 대하여 \$\\lim\_{x\\to 3}f(x)=-3\$, \$\\lim\_{x\\to 3}g(x)=a\$이고 \$\\lim\_{x\\to 3}f(x)g(x)=-12\$일 때, \$\\lim\_{x\\to 3}{f(x)+2g(x)}\$의 값을 구하시오.



### 선지



없음



### 정답



5



### 해설



\$-3a=-12 \\implies a=4\$이므로 \$\\lim\_{x\\to 3}{f(x)+2g(x)}=-3+2\\cdot 4=5\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q18",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "극한의 성질 곱셈 (-3)a=-12로 a=4를 구해 -3+2(4)=5 계산",
  "decisiveStep": "-3a=-12 -> a=4",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "대수적 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "why": "극한의 성질 > 대수적 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수렴하는 두 극한의 사칙연산 성질을 바로 적용하는 기초 단답형 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "극한"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한의성질"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q19

- 형식: 서답형  
- 배점: 3



### 발문



함수 \$y=(2x^2+3)(4-x^2)\$의 도함수를 구하시오.



### 선지



없음



### 정답



\$-8x^3+10x\$



### 해설



\$y=-2x^4+5x^2+12\$이므로 각 항을 미분하면 \$y'=-8x^3+10x\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q19",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "(2x^2+3)(4-x^2)=-2x^4+5x^2+12를 전개해 도함수 -8x^3+10x 계산",
  "decisiveStep": "(-2x^4+5x^2+12)' = -8x^3+10x",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "도함수",
    "l4": "도함수 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "도함수 > 도함수 계산"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 이차식의 곱을 전개하거나 곱의 미분법으로 도함수를 구하는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "다항함수"
    ],
    "goal": [
      "도함수"
    ],
    "method": [
      "도함수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q20

- 형식: 서답형  
- 배점: 5



### 발문



\[서술형 1\] 실수 전체의 집합에서 미분가능하고 다음 조건을 만족시키는 모든 함수 \$f(x)\$에 대하여 \$f(6)\$의 최솟값을 구하고 그 과정을 서술하시오. (가) \$f(1)=2\$ (나) \$1\<x\<6\$인 모든 실수 \$x\$에 대하여 \$f'(x)\\ge 3\$이다.



### 선지



없음



### 정답



17



### 해설



평균값 정리에 의해 \$\\dfrac{f(6)-f(1)}{6-1}=f'(c)\$인 \$c\\in(1,\\ 6)\$이 존재한다. \$\\dfrac{f(6)-2}{5}=f'(c)\\ge 3 \\implies f(6)\\ge 17\$이며, \$f(x)=3x-1\$일 때 등호가 성립한다. 따라서 최솟값은 \$17\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q20",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "구간 [1,6] 평균값 정리 (f(6)-2)/5=f'(c)>=3과 등호 실현 함수 f(x)=3x-1 제시로 최솟값 17 도출",
  "decisiveStep": "평균값 정리로 (f(6)-2)/5 >= 3 부등식 수립",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "롤의 정리와 평균값 정리",
    "l4": "평균값 정리의 조건과 적용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_MEAN_VALUE_THEOREM",
    "templateKey": "TPL_MVT_ROLLE_DIRECT",
    "why": "롤의 정리와 평균값 정리 > 평균값 정리의 조건과 적용"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도함수의 하한 조건을 평균값 정리에 적용해 함숫값의 최솟값을 증명하는 서술형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수",
      "구간"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "평균값정리"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q21

- 형식: 서답형  
- 배점: 6



### 발문



\[서술형 2\] 함수 \$f(x)=\\begin{cases}ax+b&(\|x\|\\ge 2)\\\\dfrac{\|x\|-2}{\|x^2-4\|}&(\|x\|\<2)\\end{cases}\$이 실수 전체의 집합에서 연속일 때, 상수 \$a,\\ b\$에 대하여 \$4a+8b\$의 값을 구하고 그 과정을 서술하시오.



### 선지



없음



### 정답



\-2



### 해설



\$\|x\|\<2\$에서 \$f(x)=\\dfrac{-(2-\|x\|)}{(2-\|x\|)(2+\|x\|)}=-\\dfrac{1}{2+\|x\|}\$이므로 \$x\\to 2^-\$ 및 \$x\\to \-2^+\$일 때 극한값은 모두 \$-\\dfrac{1}{4}\$이다. \$2a+b=-\\dfrac{1}{4}\$, \$-2a+b=-\\dfrac{1}{4}\$을 연립하면 \$a=0,\\ b=-\\dfrac{1}{4}\$이므로 \$4a+8b=-2\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q21",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "|x|<2 식을 -1/(2+|x|)로 약분해 x=+-2 극한 -1/4을 얻고 연립으로 a=0, b=-1/4 산출",
  "decisiveStep": "(|x|-2)/(4-x^2) = -1/(2+|x|) 약분",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속 조건",
    "l4": "구간별 함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "why": "연속 조건 > 구간별 함수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "절댓값 분수식의 부호를 정리해 약분한 뒤 두 경계 x=+-2 연속 조건을 연립하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "연속",
      "절댓값"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q22

- 형식: 서답형  
- 배점: 6



### 발문



\[서술형 3\] 삼차함수 \$f(x)\$에 대하여 \$\\left{t;\\middle\|;\\lim\_{x\\to t}\\dfrac{f(x)-x^2-2x}{x-t}=6t-10\\right}={1,\\ 3}\$일 때, \$f(4)\$의 값을 구하고 그 과정을 서술하시오.



### 선지



없음



### 정답



39



### 해설



\$g(x)=f(x)-x^2-2x\$라 하면 \$g(1)=g(3)=0\$, \$g'(1)=-4\$, \$g'(3)=8\$이다. \$g(x)=A(x-1)(x-3)(x-r)\$이라 두면 \$g'(1)=-2A(1-r)=-4 \\implies A(1-r)=2\$, \$g'(3)=2A(3-r)=8 \\implies A(3-r)=4\$이다. 두 식을 빼면 \$2A=2 \\implies A=1,\\ r=-1\$이므로 \$g(x)=(x-1)(x-3)(x+1)=x^3-3x^2-x+3\$이다. 따라서 \$f(x)=x^3-2x^2+x+3\$이고 \$f(4)=64-32+4+3=39\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q22",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "g(x)=f(x)-x^2-2x의 근 t=1,3과 미분계수 g'(1)=-4, g'(3)=8로 g(x)=(x-1)(x-3)(x+1) 확정",
  "decisiveStep": "g(t)=0, g'(t)=6t-10 조건으로 삼차식 인수 A(x-1)(x-3)(x-r) 결정",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "미분계수",
    "l4": "정의로 미분계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_DEFINITION",
    "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION",
    "why": "미분계수 > 정의로 미분계수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "극한 집합 조건에서 차함수의 두 근과 도함수값을 추출해 삼차함수를 역추적하는 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "집합",
      "극한"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "미분계수",
      "인수분해"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q23

- 형식: 서답형  
- 배점: 7



### 발문



\[서술형 4\] 다음 조건을 만족시키는 모든 다항함수 \$f(x)\$에 대하여 \$f(1)\$의 최댓값을 구하고 그 과정을 서술하시오. \$\\lim\_{x\\to\\infty}\\dfrac{f(x)-4x^4+6x^3}{x^{n+1}+2}=4\$, \$\\lim\_{x\\to 0}\\dfrac{f(x)}{x^n}=2\$인 자연수 \$n\$이 존재한다.



### 선지



없음



### 정답



10



### 해설



\$x\\to 0\$ 극한에서 \$f(x)\$의 최저차항은 \$2x^n\$이다. \$n\$의 값에 따라 나누면 다음과 같다. ① \$n=1\$: \$f(x)=4x^4-6x^3+4x^2+2x \\implies f(1)=4\$ ② \$n=2\$: \$f(x)=4x^4-2x^3+2x^2 \\implies f(1)=4\$ ③ \$n=3\$: \$f(x)=8x^4+2x^3 \\implies f(1)=10\$ ④ \$n\\ge 4\$: \$f(x)=4x^{n+1}+2x^n \\implies f(1)=6\$ 따라서 \$f(1)\$의 최댓값은 \$10\$이다.

```
"NONE"
```

```
{
  "sourceQid": "Q23",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "n=1,2,3,4이상으로 분류해 최저차항 2x^n과 최고차항 계수비 4 조건을 맞추어 f(1) 최댓값 10 산출",
  "decisiveStep": "n=3일 때 4x^4 상쇄분 합산으로 8x^4+2x^3 도출",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "무한대에서의 극한",
    "l4": "다항·유리함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_INFINITY_LEADING_TERM",
    "why": "무한대에서의 극한 > 다항·유리함수"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자연수 차수 n의 값에 따라 분자 다항식의 최고차항과 최저차항이 겹치거나 분리되는 4가지 경우를 모두 분류해 최댓값을 구하는 최고난도 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "다항함수",
      "극한"
    ],
    "goal": [
      "최댓값"
    ],
    "method": [
      "극한",
      "경우분류"
    ],
    "condition": [
      "자연수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

