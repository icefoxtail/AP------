

```
{"stem": "26_강남여고_2학기_중간_고2_미적분I_유사", "sourceArchiveFile": "original/high/h2/2mid/26_강남여고_2학기_중간_고2_미적분I.js", "examFolder": "2mid", "grade": "고2", "subject": "미적분I", "curriculum": "2022", "questionCount": 25, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3



### 발문



다음 극한값은?

\$\$\\lim\_{x\\to3}\\frac{x^2+2x-15}{x-3}\$\$



### 선지



① \$8\$ ② \$6\$ ③ \$4\$ ④ \$2\$ ⑤ \$-2\$



### 정답



①



### 해설



\$x\\to3\$일 때 분모 \$x-3\\to0\$이고 분자 \$x^2+2x-15\\to0\$인 \$\\frac{0}{0}\$ 꼴의 극한이므로 분자를 인수분해하여 약분한다.

\$\$\\begin{aligned} \\lim\_{x\\to3}\\frac{x^2+2x-15}{x-3} &= \\lim\_{x\\to3}\\frac{(x-3)(x+5)}{x-3} \\ &= \\lim\_{x\\to3}(x+5) \\ &= 3+5 \= 8 \\end{aligned}\$\$

따라서 정답은 ①이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "x=3에서 0/0 꼴 유리식 극한의 분자 인수분해 (x-3)(x+5) 후 약분 계산",
  "decisiveStep": "분자 x^2+2x-15를 (x-3)(x+5)로 인수분해하여 (x-3)을 소거",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "함수의 극한",
    "l4": "극한값 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": null,
    "why": "함수의 극한 > 극한값 계산 (FAMILY_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차식의 단순 인수분해 후 대입으로 해결되는 기본 극한 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "유리식",
      "극한"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "인수분해",
      "부정형"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q02

- 형식: 객관식  
- 배점: 3



### 발문



함수 \$y=f(x)\$의 그래프가 다음 그림과 같을 때, \$\\displaystyle\\lim\_{x\\to-1^-}f(x)+\\lim\_{x\\to1^+}f(x)\$의 값은?



### 선지



① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$



### 정답



②



### 해설



주어진 그래프에서 \$x=-1\$의 좌극한과 \$x=1\$의 우극한을 각각 읽는다.

\$\$\\begin{aligned} \\lim\_{x\\to-1^-}f(x) &= 1 \\ \\lim\_{x\\to1^+}f(x) &= \-3 \\end{aligned}\$\$

따라서 두 극한값의 합은

\$\$\\lim\_{x\\to-1^-}f(x)+\\lim\_{x\\to1^+}f(x) \= 1+(-3) \= \-2\$\$

이므로 정답은 ②이다.

```
{
  "family": "piecewise-linear-v1",
  "caption": "x=-1과 x=1에서 불연속인 구간별 일차함수 y=f(x)의 그래프",
  "sourceQuote": "함수 y=f(x)의 그래프가 다음 그림과 같을 때",
  "pieces": [
    {
      "domain": "(-inf,-1)",
      "expr": "-0.5*x+0.5",
      "openEnd": true
    },
    {
      "domain": "(-1,1]",
      "expr": "-2",
      "openStart": true,
      "closedEnd": true
    },
    {
      "domain": "(1,inf)",
      "expr": "x-4",
      "openStart": true
    }
  ],
  "isolatedPoints": [
    [
      -1,
      3
    ]
  ],
  "viewport": [
    -3.5,
    4.5,
    -4,
    4
  ]
}
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
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "구간별 함수 그래프에서 x=-1 좌극한(1)과 x=1 우극한(-3)을 읽어 합산",
  "decisiveStep": "빈 원과 닫힌 점을 구분하여 x->-1- 및 x->1+의 극한값 읽기",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "함수의 극한",
    "l4": "좌극한·우극한"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_DIRECTIONAL_APPROACH",
    "why": "함수의 극한 > 좌극한·우극한 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "그래프에서 좌극한과 우극한의 높이를 직접 읽어 더하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "그래프",
      "좌극한",
      "우극한"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "좌극한",
      "우극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q03

- 형식: 객관식  
- 배점: 3



### 발문



함수 \$f(x)=x^3-4x^2+3x\$에 대하여 \$f'(2)\$의 값은?



### 선지



① \$-5\$ ② \$-3\$ ③ \$-1\$ ④ \$1\$ ⑤ \$3\$



### 정답



③



### 해설



다항함수의 미분법을 이용하여 도함수 \$f'(x)\$를 구한 뒤 \$x=2\$를 대입한다.

\$\$\\begin{aligned} f'(x) &= 3x^2-8x+3 \\ f'(2) &= 3\\cdot 2^2-8\\cdot 2+3 \= 12-16+3 \= \-1 \\end{aligned}\$\$

따라서 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "삼차함수 f(x)=x^3-4x^2+3x의 도함수 f'(x)=3x^2-8x+3을 구해 x=2 대입",
  "decisiveStep": "거듭제곱 미분 공식을 적용해 도함수를 구하고 x=2를 대입",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "도함수",
    "l4": "미분법"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "도함수 > 미분법 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기본 다항함수의 도함수 계산과 함숫값 대입만으로 끝나는 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "삼차함수"
    ],
    "goal": [
      "미분계수"
    ],
    "method": [
      "도함수",
      "미분"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q04

- 형식: 객관식  
- 배점: 3



### 발문



함수 \$f(x)=x^2+2x+3\$에 대하여 \$x\$의 값이 \$1\$에서 \$a+1\$까지 변할 때의 평균변화율이 \$8\$일 때, 양수 \$a\$의 값은?



### 선지



① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$



### 정답



④



### 해설



\$x\$의 값이 \$1\$에서 \$a+1\$까지 변할 때의 평균변화율을 식으로 세워 \$a\$를 구한다.

\$\$\\begin{aligned} \\frac{f(a+1)-f(1)}{(a+1)-1} &= \\frac{{(a+1)^2+2(a+1)+3}-(1+2+3)}{a} \\ &= \\frac{(a^2+2a+1+2a+2+3)-6}{a} \\ &= \\frac{a^2+4a}{a} \= a+4 \\end{aligned}\$\$

평균변화율이 \$8\$이므로 \$a+4=8\$, 따라서 \$a=4\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "이차함수 f(x)=x^2+2x+3의 구간 [1, a+1] 평균변화율 식 a+4=8 풀이",
  "decisiveStep": "평균변화율 분자를 전개해 a로 약분한 식 a+4=8 세우기",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "미분계수",
    "l4": "평균변화율·순간변화율"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RATE_RELATION",
    "templateKey": "TPL_AVERAGE_RATE_DERIVATIVE_LINK",
    "why": "미분계수 > 평균변화율·순간변화율 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균변화율 정의식에 미지수를 대입하고 약분해 일차방정식을 푸는 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이차함수",
      "평균변화율"
    ],
    "goal": [
      "실수"
    ],
    "method": [
      "평균변화율"
    ],
    "condition": [
      "양수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q05

- 형식: 객관식  
- 배점: 3



### 발문



등식 \$\\displaystyle\\lim\_{x\\to2}\\frac{\\sqrt{x+a}-b}{x-2}=\\frac14\$이 성립하도록 상수 \$a,b\$의 값을 정할 때, \$a+b\$의 값은?



### 선지



① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$



### 정답



⑤



### 해설



\$x\\to2\$일 때 극한값이 존재하고 분모 \$x-2\\to0\$이므로 분자도 \$0\$으로 수렴해야 한다.

\$\$\\sqrt{2+a}-b=0 \\implies b=\\sqrt{2+a} \\quad (b\\ge 0)\$\$

분자를 유리화하여 극한을 계산한다.

\$\$\\begin{aligned} \\lim\_{x\\to2}\\frac{\\sqrt{x+a}-b}{x-2} &= \\lim\_{x\\to2}\\frac{(x+a)-b^2}{(x-2)(\\sqrt{x+a}+b)} \\ &= \\lim\_{x\\to2}\\frac{x-2}{(x-2)(\\sqrt{x+a}+b)} \\ &= \\frac{1}{2b} \= \\frac{1}{4} \\end{aligned}\$\$

따라서 \$b=2\$이고 \$2+a=b^2=4\$에서 \$a=2\$이므로 \$a+b=2+2=4\$이다. 정답은 ⑤이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "x=2에서 무리식 극한의 수렴 조건 b=sqrt(2+a)와 유리화 극한 1/(2b)=1/4 연립",
  "decisiveStep": "분자 수렴 조건으로 b^2=2+a를 얻고 유리화로 x-2를 약분",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "미정계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "why": "극한의 성질 > 미정계수 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "0/0 꼴 미정계수 결정과 분자 유리화의 두 단계가 순차 결합된 표준 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "극한",
      "실수"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "부정형",
      "유리화"
    ],
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q06

- 형식: 객관식  
- 배점: 3.5



### 발문



방정식 \$x^3+x^2+2x-7=0\$이 오직 하나의 실근을 갖는다. 이 방정식의 실근이 존재하는 구간은?



### 선지



① \$(0,1)\$ ② \$(1,2)\$ ③ \$(2,3)\$ ④ \$(3,4)\$ ⑤ \$(-1,0)\$



### 정답



②



### 해설



\$f(x)=x^3+x^2+2x-7\$이라 하면 \$f(x)\$는 다항함수이므로 실수 전체에서 연속이다. 각 구간의 양 끝점에서 함숫값의 부호를 확인한다.

\$\$\\begin{aligned} f(-1) &= \-1+1-2-7 \= \-9 \< 0 \\ f(0) &= \-7 \< 0 \\ f(1) &= 1+1+2-7 \= \-3 \< 0 \\ f(2) &= 8+4+4-7 \= 9 \> 0 \\end{aligned}\$\$

\$f(1)f(2) \< 0\$이므로 사잇값 정리에 의해 방정식 \$f(x)=0\$의 실근은 열린구간 \$(1,2)\$에 존재한다. 따라서 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": "H22-M1-02-INTERMEDIATE_VALUE",
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "삼차함수 f(x)=x^3+x^2+2x-7의 정수점 함숫값 부호 변화 f(1)<0, f(2)>0 판정",
  "decisiveStep": "연속성 확인 후 f(1)=-3<0과 f(2)=9>0의 부호 반전 포착",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속함수의 성질",
    "l4": "사잇값 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_INTERMEDIATE_VALUE_APPLICATION",
    "templateKey": "TPL_IVT_VALUE_EXISTENCE_INTERVAL",
    "why": "연속함수의 성질 > 사잇값 정리 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간 양 끝점의 함숫값 부호 비교만으로 사잇값 정리를 적용하는 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "삼차방정식",
      "실근"
    ],
    "goal": [
      "열린구간"
    ],
    "method": [
      "사잇값정리",
      "연속"
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



다음 주어진 함수의 구간에서 증가와 감소의 판정을 옳게 한 것은?



### 선지



① 함수 \$f(x)=x^2-4x\$는 구간 \$(2,\\infty)\$에서 증가한다. ② 함수 \$f(x)=x^3\$은 구간 \$(-\\infty,\\infty)\$에서 감소한다. ③ 함수 \$f(x)=-x^2\$은 구간 \$(-\\infty,0)\$에서 감소한다. ④ 함수 \$f(x)=-x^3\$은 구간 \$(0,\\infty)\$에서 증가한다. ⑤ 함수 \$f(x)=-\\sqrt{x+2}\$는 구간 \$\[-2,\\infty)\$에서 증가한다.



### 정답



①



### 해설



각 보기의 도함수 부호 또는 함숫값 변화를 확인한다.

- ① \$f(x)=x^2-4x\$에서 \$f'(x)=2x-4=2(x-2)\>0\$ \$(x\>2)\$이므로 구간 \$(2,\\infty)\$에서 증가한다. (참)  
- ② \$f(x)=x^3\$에서 \$f'(x)=3x^2\\ge 0\$이므로 \$(-\\infty,\\infty)\$에서 증가한다. (거짓)  
- ③ \$f(x)=-x^2\$에서 \$f'(x)=-2x\>0\$ \$(x\<0)\$이므로 \$(-\\infty,0)\$에서 증가한다. (거짓)  
- ④ \$f(x)=-x^3\$에서 \$f'(x)=-3x^2\<0\$ \$(x\>0)\$이므로 \$(0,\\infty)\$에서 감소한다. (거짓)  
- ⑤ \$f(x)=-\\sqrt{x+2}\$는 \$x\$가 커질수록 \$-\\sqrt{x+2}\$가 작아지므로 \$\[-2,\\infty)\$에서 감소한다. (거짓)

따라서 옳은 것은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q07",
  "variationType": "CONDITION",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "다항함수 및 무리함수의 도함수 부호와 증감 성질로 각 보기 참·거짓 판정",
  "decisiveStep": "각 함수의 도함수 f'(x) 부호를 구간별로 대조하여 유일한 참 선지 판별",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "증가·감소와 극값",
    "l4": "증감표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "why": "증가·감소와 극값 > 증감표 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "여러 기본 함수의 증가·감소 판정을 각각 확인해야 하는 선지 분기형 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "다항함수",
      "구간"
    ],
    "goal": [
      "증가감소"
    ],
    "method": [
      "도함수",
      "증가감소"
    ],
    "condition": [
      "구간"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q08

- 형식: 객관식  
- 배점: 3.5



### 발문



함수 \$\\displaystyle f(x)=\\frac{1-2x}{x+1}\$에 대하여 다음 중 옳은 것은?



### 선지



① \$f(x)\$는 닫힌구간 \$\[-3,0\]\$에서 최댓값을 갖는다. ② \$f(x)\$는 닫힌구간 \$\[-3,0\]\$에서 최솟값을 갖는다. ③ \$f(x)\$는 닫힌구간 \$\[0,2\]\$에서 최솟값을 갖지 않는다. ④ \$f(x)\$는 닫힌구간 \$\[-1,2\]\$에서 최댓값을 갖지 않는다. ⑤ \$f(x)\$는 닫힌구간 \$\[0,2\]\$에서 최댓값은 갖지만 최솟값은 갖지 않는다.



### 정답



④



### 해설



유리함수 \$f(x)\$를 변형하면

\$\$f(x)=\\frac{-2(x+1)+3}{x+1}=-2+\\frac{3}{x+1}\$\$

이므로 점근선이 \$x=-1\$, \$y=-2\$이고 \$x\\ne \-1\$에서 항상 감소한다.

- ①, ② 닫힌구간 \$\[-3,0\]\$은 불연속점 \$x=-1\$을 포함하며 \$\\lim\_{x\\to-1^-}f(x)=-\\infty\$, \$\\lim\_{x\\to-1^+}f(x)=+\\infty\$이므로 최댓값과 최솟값을 모두 갖지 않는다. (거짓)  
- ③, ⑤ 닫힌구간 \$\[0,2\]\$에서는 연속이므로 최대·최소 정리에 의해 최댓값 \$f(0)=1\$과 최솟값 \$f(2)=-1\$을 모두 갖는다. (거짓)  
- ④ 구간 \$\[-1,2\]\$에서 \$x=-1\$에서 정의되지 않고 \$\\lim\_{x\\to-1^+}f(x)=+\\infty\$이므로 최댓값을 갖지 않는다. (참)

따라서 정답은 ④이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "FUNCTIONS_GRAPHS",
  "primaryMethod": "유리함수 f(x)=-2+3/(x+1)의 점근선 x=-1 포함 여부에 따른 최대·최소 정리 판정",
  "decisiveStep": "점근선 x=-1이 구간에 포함될 때 좌우 발산으로 최대·최소 부재를 판별",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속함수의 성질",
    "l4": "최대·최소 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_FUNCTION_EXTREMUM",
    "templateKey": "TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT",
    "why": "연속함수의 성질 > 최대·최소 정리 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_RATIONAL_FUNCTION"
  ],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "유리함수의 점근선과 최대·최소 정리의 적용 조건을 결합해 5개 구간을 판정한다.",
  "level": "중",
  "item4slot": {
    "given": [
      "유리함수",
      "닫힌구간"
    ],
    "goal": [
      "최댓값",
      "최솟값"
    ],
    "method": [
      "연속",
      "유리함수"
    ],
    "condition": [
      "닫힌구간"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q09

- 형식: 객관식  
- 배점: 3.5



### 발문



함수 \$f(x)\$의 도함수 \$y=f'(x)\$의 그래프가 다음 그림과 같을 때, 보기 중 옳은 것을 있는 대로 고른 것은?

> **\<보기\>** ㄱ. \$f(x)\$는 열린구간 \$(-3,-2)\$에서 증가한다. ㄴ. \$f(x)\$는 열린구간 \$(1,2)\$에서 감소한다. ㄷ. \$f(x)\$는 \$x=-2\$에서 극댓값을 갖는다. ㄹ. \$f(x)\$는 \$x=3\$에서 극댓값을 갖는다. ㅁ. \$f(x)\$의 극값은 \$2\$개이다.



### 선지



① ㄱ, ㄴ ② ㄴ, ㄷ ③ ㄱ, ㄴ, ㄷ ④ ㄷ, ㄹ ⑤ ㄷ, ㄹ, ㅁ



### 정답



③



### 해설



주어진 그래프는 원함수가 아니라 도함수 \$y=f'(x)\$의 그래프이므로 함숫값의 부호 변화로 \$f(x)\$의 증가·감소와 극값을 판정한다.

- ㄱ. 열린구간 \$(-3,-2)\$에서 \$f'(x)\>0\$이므로 \$f(x)\$는 증가한다. (참)  
- ㄴ. 열린구간 \$(1,2)\$에서 \$f'(x)\<0\$이므로 \$f(x)\$는 감소한다. (참)  
- ㄷ. \$x=-2\$의 좌우에서 \$f'(x)\$의 부호가 \$+\$에서 \$-\$로 바뀌므로 \$f(x)\$는 \$x=-2\$에서 극댓값을 갖는다. (참)  
- ㄹ. \$x=3\$에서 \$f'(3)=0\$이지만 좌우에서 \$f'(x)\$의 부호가 \$-\$에서 \$-\$로 바뀌지 않으므로 극값이 아니다. (거짓)  
- ㅁ. \$f'(x)\$의 부호가 바뀌는 지점은 \$x=-2\$ 하나뿐이므로 극값은 \$1\$개이다. (거짓)

따라서 옳은 것은 ㄱ, ㄴ, ㄷ이므로 정답은 ③이다.

```
{
  "family": "polynomial-spike-v1",
  "caption": "x=-2를 지나고 x=3에서 x축에 접하는 도함수 y=f'(x)의 그래프",
  "sourceQuote": "함수 f(x)의 도함수 y=f'(x)의 그래프가 다음 그림과 같을 때",
  "expr": "-0.1*(x+2)*(x-3)^2",
  "xIntercepts": [
    -2,
    3
  ],
  "formulaLabel": "y=f'(x)",
  "viewport": [
    -3.5,
    4.5,
    -3.5,
    3
  ]
}
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
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "도함수 그래프의 x=-2 부호 반전(+->-)과 x=3 접함(-->-)으로 극값 판정",
  "decisiveStep": "x=3에서 f'(3)=0이지만 부호 변화가 없어 극값이 아님을 구분",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "증가·감소와 극값",
    "l4": "극대·극소"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "why": "증가·감소와 극값 > 극대·극소 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "도함수 그래프에서 접하는 영점(x=3)의 함정을 피해 증감과 극값 개수를 판정해야 한다.",
  "level": "중",
  "item4slot": {
    "given": [
      "도함수",
      "그래프"
    ],
    "goal": [
      "증가감소",
      "극값"
    ],
    "method": [
      "도함수",
      "극대",
      "극소"
    ],
    "condition": [
      "열린구간"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q10

- 형식: 객관식  
- 배점: 4



### 발문



두 함수 \$f(x)\$, \$g(x)\$의 그래프가 다음 그림과 같을 때, 보기에서 극한값이 존재하는 것만을 있는 대로 고른 것은?

> **\<보기\>** ㄱ. \$\\displaystyle\\lim\_{x\\to0}{f(x)+g(x)}\$ ㄴ. \$\\displaystyle\\lim\_{x\\to0}{f(x)-g(x)}\$ ㄷ. \$\\displaystyle\\lim\_{x\\to1}f(x)g(x)\$ ㄹ. \$\\displaystyle\\lim\_{x\\to1}\\frac{g(x)}{f(x)}\$



### 선지



① ㄱ, ㄴ ② ㄴ, ㄷ ③ ㄱ, ㄴ, ㄷ ④ ㄱ, ㄴ, ㄹ ⑤ ㄷ, ㄹ



### 정답



⑤



### 해설



각 보기의 좌극한과 우극한을 그래프에서 읽어 비교한다.

1. \$x\\to0\$일 때: \$\\lim\_{x\\to0^-}f(x)=2\$, \$\\lim\_{x\\to0^+}f(x)=0\$이고 \$\\lim\_{x\\to0^-}g(x)=0\$, \$\\lim\_{x\\to0^+}g(x)=0\$이다.  
     
   - ㄱ. 좌극한은 \$2+0=2\$, 우극한은 \$0+0=0\$으로 다르므로 존재하지 않는다. (거짓)  
   - ㄴ. 좌극한은 \$2-0=2\$, 우극한은 \$0-0=0\$으로 다르므로 존재하지 않는다. (거짓)

   

2. \$x\\to1\$일 때: \$\\lim\_{x\\to1^-}f(x)=-2\$, \$\\lim\_{x\\to1^+}f(x)=2\$이고 \$\\lim\_{x\\to1^-}g(x)=2\$, \$\\lim\_{x\\to1^+}g(x)=-2\$이다.  
     
   - ㄷ. 좌극한은 \$(-2)\\cdot 2=-4\$, 우극한은 \$2\\cdot(-2)=-4\$로 같으므로 극한값이 존재한다. (참)  
   - ㄹ. 좌극한은 \$\\frac{2}{-2}=-1\$, 우극한은 \$\\frac{-2}{2}=-1\$로 같고 분모의 좌·우극한이 \$0\$이 아니므로 극한값이 존재한다. (참)

따라서 극한값이 존재하는 것은 ㄷ, ㄹ이므로 정답은 ⑤이다.

```
{
  "family": "composite-two-panel-v1",
  "caption": "x=0과 x=1에서 불연속인 두 함수 y=f(x)와 y=g(x)의 그래프",
  "sourceQuote": "두 함수 f(x), g(x)의 그래프가 다음 그림과 같을 때",
  "panels": [
    {
      "title": "y=f(x)",
      "pieces": [
        {
          "domain": "(-inf,0)",
          "expr": "x+2",
          "openEnd": true
        },
        {
          "domain": "(0,1)",
          "expr": "-2*x",
          "openStart": true,
          "openEnd": true
        },
        {
          "domain": "(1,inf)",
          "expr": "x+1",
          "openStart": true
        }
      ],
      "isolatedPoints": [
        [
          0,
          0
        ],
        [
          1,
          0
        ]
      ],
      "viewport": [
        -2.5,
        2.5,
        -2.5,
        3
      ]
    },
    {
      "title": "y=g(x)",
      "pieces": [
        {
          "domain": "(-inf,0)",
          "expr": "-(x+1)^2+1",
          "openEnd": true
        },
        {
          "domain": "(0,1]",
          "expr": "2*x",
          "openStart": true,
          "closedEnd": true
        },
        {
          "domain": "(1,inf)",
          "expr": "x^2-3",
          "openStart": true
        }
      ],
      "isolatedPoints": [
        [
          0,
          -2
        ]
      ],
      "viewport": [
        -2.5,
        2.5,
        -2.5,
        3
      ]
    }
  ]
}
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
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "불연속 두 함수 f, g의 좌우극한을 각각 표로 구해 합·차·곱·몫 극한 존재 판정",
  "decisiveStep": "x=1에서 f와 g의 좌우극한이 서로 부호 반대(-2,2 / 2,-2)임을 곱·몫에 대입",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "대수적 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_OPERATION_LAWS",
    "why": "극한의 성질 > 대수적 계산 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 그래프에서 좌우극한을 각각 읽어 4가지 연산(합·차·곱·몫)을 검증하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "그래프",
      "좌극한",
      "우극한"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한의성질",
      "좌극한",
      "우극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q11

- 형식: 객관식  
- 배점: 4



### 발문



두 함수 \$\\displaystyle f(x)=\\begin{cases}x+1&(x\<2)\\5&(x\\ge2)\\end{cases}\$, \$g(x)=3x+a\$에 대하여 함수 \$f(x)g(x)\$가 \$x=2\$에서 연속일 때, \$a+g(3)\$의 값은?



### 선지



① \$-3\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$3\$



### 정답



①



### 해설



\$f(x)g(x)\$가 \$x=2\$에서 연속이려면 좌극한, 우극한, 함숫값이 모두 같아야 한다.

\$\$\\begin{aligned} \\lim\_{x\\to2^-}f(x)g(x) &= 3(6+a) \\ \\lim\_{x\\to2^+}f(x)g(x) &= f(2)g(2) \= 5(6+a) \\end{aligned}\$\$

따라서 \$3(6+a)=5(6+a)\$에서 \$6+a=0\$, 즉 \$a=-6\$이다. 그러면 \$g(x)=3x-6\$이므로 \$g(3)=3\\cdot3-6=3\$이고,

\$\$a+g(3) \= \-6+3 \= \-3\$\$

이다. 정답은 ①이다.

```
"NONE"
```

```
{
  "sourceQid": "Q11",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "x=2에서 불연속인 f(x)와 일차함수 g(x)의 곱 연속 조건 g(2)=0 적용",
  "decisiveStep": "f(2-)≠f(2+)이므로 곱의 연속 조건에서 g(2)=6+a=0 도출",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속 조건",
    "l4": "구간별 함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "why": "연속 조건 > 구간별 함수 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간별 불연속 함수와 다항함수의 곱이 연속이 되도록 미정계수를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항함수",
      "곱"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "연속",
      "좌극한",
      "우극한",
      "함숫값"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q12

- 형식: 객관식  
- 배점: 4



### 발문



실수 전체의 집합에서 미분가능한 함수 \$y=f(x)\$의 그래프가 그림과 같을 때, 다음 중 옳은 것은?



### 선지



① \$f'(0)f'(a)\>0\$ ② \$f'(c)\>0\$ ③ \$f'(a)f'(c)\<0\$ ④ \$f'(a)f'(b)\<0\$ ⑤ \$f'(b)f'(c)\>0\$



### 정답



④



### 해설



주어진 곡선 \$y=f(x)\$ 위의 각 점에서의 접선의 기울기(미분계수의 부호)를 읽는다.

- \$x=0\$에서 곡선이 증가하고 있으므로 \$f'(0)\>0\$  
- \$x=a\$에서 곡선이 감소하고 있으므로 \$f'(a)\<0\$  
- \$x=b\$에서 곡선이 증가하고 있으므로 \$f'(b)\>0\$  
- \$x=c\$에서 곡선이 \$x\$축에 접하며 극솟값을 가지므로 \$f'(c)=0\$

따라서 \$f'(a)f'(b)\<0\$만 참이므로 정답은 ④이다.

```
{
  "family": "polynomial-spike-v1",
  "caption": "x=0(증가), x=a(감소), x=b(증가), x=c(x축과 접하는 극소)가 표시된 곡선 y=f(x)",
  "sourceQuote": "실수 전체의 집합에서 미분가능한 함수 y=f(x)의 그래프가 그림과 같을 때",
  "markedPoints": [
    {
      "x": "a",
      "at": 0.7
    },
    {
      "x": "b",
      "at": 2.4
    },
    {
      "x": "c",
      "at": 3.5
    }
  ],
  "formulaLabel": "y=f(x)",
  "viewport": [
    -0.8,
    4.3,
    -2,
    3.5
  ]
}
```

```
{
  "sourceQid": "Q12",
  "variationType": "CONDITION",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "원함수 그래프의 증가·감소·극소 지점에서 접선 기울기 f'(0), f'(a), f'(b), f'(c) 부호 판정",
  "decisiveStep": "x=c에서 접선이 수평(f'(c)=0)임을 이용해 곱의 부호 선지들 소거",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "증가·감소와 극값",
    "l4": "증감표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "why": "증가·감소와 극값 > 증감표 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "그래프의 증감과 극값에서 미분계수의 부호(+, -, 0)를 읽어 곱의 부호를 판정한다.",
  "level": "중",
  "item4slot": {
    "given": [
      "그래프",
      "미분가능"
    ],
    "goal": [
      "미분계수"
    ],
    "method": [
      "접선",
      "기울기",
      "증가감소"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q13

- 형식: 객관식  
- 배점: 4



### 발문



함수 \$f(x)=x^3-3x^2+ax\$에 대하여 \$\\displaystyle\\lim\_{x\\to2}\\frac{f(x)-b}{x^2-4}=3\$일 때, \$a+b\$의 값은? (단, \$a,b\$는 상수이다.)



### 선지



① \$28\$ ② \$32\$ ③ \$36\$ ④ \$40\$ ⑤ \$44\$



### 정답



②



### 해설



\$x\\to2\$일 때 분모 \$x^2-4\\to0\$이고 극한값이 \$3\$으로 존재하므로 분자도 \$0\$으로 수렴한다.

\$\$\\lim\_{x\\to2}{f(x)-b}=f(2)-b=0 \\implies b=f(2)\$\$

이를 극한식에 대입하고 미분계수의 정의를 적용한다.

\$\$\\begin{aligned} \\lim\_{x\\to2}\\frac{f(x)-f(2)}{(x-2)(x+2)} &= \\lim\_{x\\to2}\\frac{f(x)-f(2)}{x-2}\\cdot\\frac{1}{x+2} \\ &= f'(2)\\cdot\\frac{1}{4} \= 3 \\end{aligned}\$\$

따라서 \$f'(2)=12\$이다. \$f'(x)=3x^2-6x+a\$에서 \$f'(2)=12-12+a=a=12\$이므로 \$a=12\$이다. 그러면 \$b=f(2)=2^3-3\\cdot2^2+12\\cdot2=8-12+24=20\$이므로 \$a+b=12+20=32\$이다. 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "x=2에서의 극한식을 f'(2)/4=3과 b=f(2)로 환원하여 미정계수 a, b 결정",
  "decisiveStep": "f(2)-b=0으로 b=f(2)를 두고 극한식을 f'(2)/4로 변형",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "미분계수",
    "l4": "정의로 미분계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_DEFINITION",
    "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION",
    "why": "미분계수 > 정의로 미분계수 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_LIMIT_INDETERMINATE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "0/0 극한 조건과 미분계수 정의를 순차 연결하여 두 미정계수를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수",
      "극한"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "미분계수",
      "부정형"
    ],
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q14

- 형식: 객관식  
- 배점: 4



### 발문



두 곡선 \$f(x)=x^3+ax+b\$, \$g(x)=cx^2+2\$가 점 \$(1,5)\$에서 만나고 이 점에서 공통인 접선을 가질 때, 실수 \$a+b+c\$의 값을 구하면?



### 선지



① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$



### 정답



⑤



### 해설



두 곡선이 점 \$(1,5)\$를 지나므로 \$f(1)=5\$, \$g(1)=5\$이다.

\$\$\\begin{aligned} g(1) &= c+2=5 \\implies c=3 \\ f(1) &= 1+a+b=5 \\implies a+b=4 \\end{aligned}\$\$

또한 \$x=1\$에서 공통인 접선을 가지므로 \$f'(1)=g'(1)\$이다. \$f'(x)=3x^2+a\$, \$g'(x)=2cx\$이므로

\$\$\\begin{aligned} f'(1) &= 3+a \\ g'(1) &= 2c \= 6 \\end{aligned}\$\$

따라서 \$3+a=6\$에서 \$a=3\$이고, \$a+b=4\$에서 \$b=1\$이다. 그러므로 \$a+b+c=3+1+3=7\$이다. 정답은 ⑤이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "두 곡선의 교점 (1,5) 대입(f(1)=g(1)=5)과 공통접선 조건(f'(1)=g'(1)) 연립",
  "decisiveStep": "g(1)=5로 c를 먼저 구한 뒤 f'(1)=g'(1)로 a 결정",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "접선",
    "l4": "두 곡선의 접선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "why": "접선 > 두 곡선의 접선 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "공통접선 조건을 함숫값 일치와 미분계수 일치로 번역해 연립하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수",
      "이차함수",
      "공통접선"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "도함수",
      "공통접선"
    ],
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q15

- 형식: 객관식  
- 배점: 4



### 발문



함수 \$f(x)=x^2+5x-4\$에 대하여 닫힌구간 \$\[a,3\]\$에서 평균값 정리를 만족시키는 실수 \$c\$의 값이 \$-1\$일 때, 실수 \$a\$의 값은? (단, \$a\<-1\$)



### 선지



① \$-7\$ ② \$-6\$ ③ \$-5\$ ④ \$-4\$ ⑤ \$-3\$



### 정답



③



### 해설



다항함수 \$f(x)=x^2+5x-4\$는 닫힌구간 \$\[a,3\]\$에서 연속이고 열린구간 \$(a,3)\$에서 미분가능하다. \$f'(x)=2x+5\$이므로 평균값 정리에 의해

\$\$\\begin{aligned} \\frac{f(3)-f(a)}{3-a} &= f'(-1) \\ \\frac{(9+15-4)-(a^2+5a-4)}{3-a} &= 2(-1)+5 \\ \\frac{24-a^2-5a}{3-a} &= 3 \\ \\frac{(3-a)(a+8)}{3-a} &= 3 \\end{aligned}\$\$

\$a\<-1\<3\$이므로 \$3-a\\ne0\$이고 양변을 약분하면 \$a+8=3\$, 즉 \$a=-5\$이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "이차함수 f(x)=x^2+5x-4에 구간 [a,3] 평균값 정리 (f(3)-f(a))/(3-a)=f'(-1) 적용",
  "decisiveStep": "분자 24-a^2-5a를 (3-a)(a+8)로 인수분해해 3-a를 약분",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "롤의 정리와 평균값 정리",
    "l4": "평균값 정리의 조건과 적용"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_MEAN_VALUE_THEOREM",
    "templateKey": "TPL_MVT_ROLLE_DIRECT",
    "why": "롤의 정리와 평균값 정리 > 평균값 정리의 조건과 적용 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_BOUND_RANGE"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균값 정리 등식에 c=-1을 대입하고 인수분해로 구간의 왼쪽 끝점 a를 구한다.",
  "level": "중",
  "item4slot": {
    "given": [
      "이차함수",
      "닫힌구간"
    ],
    "goal": [
      "실수"
    ],
    "method": [
      "평균값정리",
      "도함수"
    ],
    "condition": [
      "닫힌구간"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q16

- 형식: 객관식  
- 배점: 4.5



### 발문



포물선 \$y=4-x^2\$이 \$x\$축과 만나는 점을 \$A(-2,0)\$, \$B(2,0)\$이라 하고, 제1사분면에서 포물선 위를 움직이는 점 \$P\$에서의 접선 \$l\$이 \$x\$축과 만나는 점을 \$C\$, 점 \$C\$를 지나고 \$x\$축에 수직인 직선이 직선 \$OP\$와 만나는 점을 \$R\$이라 하자. 점 \$P\$가 곡선을 따라 점 \$B\$에 한없이 가까워질 때, \$\\displaystyle\\frac{\\overline{CR}^{2}}{\\overline{BC}}\$의 극한값은?



### 선지



① \$32\$ ② \$64\$ ③ \$16\$ ④ \$128\$ ⑤ \$8\$



### 정답



②



### 해설



점 \$P\$의 좌표를 \$P(t, 4-t^2)\$ \$(0\<t\<2)\$로 두면, \$P\\to B\$는 \$t\\to 2^-\$를 뜻한다. \$y'=-2x\$이므로 점 \$P\$에서의 접선 \$l\$의 기울기는 \$-2t\$이고, 접선의 방정식은

\$\$y-(4-t^2) \= \-2t(x-t) \\implies y \= \-2tx \+ t^2 \+ 4\$\$

\$y=0\$을 대입하면 점 \$C\$의 \$x\$좌표는 \$\\frac{t^2+4}{2t}\$이다. (\$0\<t\<2\$에서 \$\\frac{t^2+4}{2t} - 2 \= \\frac{(t-2)^2}{2t} \> 0\$이므로 \$\\overline{BC} \= \\frac{(t-2)^2}{2t}\$)

한편 직선 \$OP\$의 방정식은 \$y=\\frac{4-t^2}{t}x\$이므로 \$x=\\frac{t^2+4}{2t}\$에서의 \$y\$좌표, 즉 \$\\overline{CR}\$은

\$\$\\overline{CR} \= \\frac{4-t^2}{t}\\cdot\\frac{t^2+4}{2t} \= \\frac{(2-t)(2+t)(t^2+4)}{2t^2}\$\$

이다. 따라서

\$\$\\begin{aligned} \\lim\_{t\\to2^-}\\frac{\\overline{CR}^2}{\\overline{BC}} &= \\lim\_{t\\to2^-}\\left{\\frac{(2-t)^2(2+t)^2(t^2+4)^2}{4t^4} \\cdot \\frac{2t}{(t-2)^2}\\right} \\ &= \\lim\_{t\\to2^-}\\frac{(2+t)^2(t^2+4)^2}{2t^3} \\ &= \\frac{4^2\\cdot 8^2}{2\\cdot 8} \= 64 \\end{aligned}\$\$

이므로 정답은 ②이다.

```
{
  "family": "coordinate-geometry-v1",
  "caption": "포물선 y=4-x^2 위의 제1사분면 점 P에서의 접선 l이 x축과 만나는 점 C와 직선 OP 위의 수선 교점 R",
  "sourceQuote": "제1사분면에서 포물선 위를 움직이는 점 P에서의 접선 l이 x축과 만나는 점을 C",
  "objects": [
    "parabola y=4-x^2",
    "A(-2,0)",
    "B(2,0)",
    "P(1,3)",
    "tangent l at P",
    "C(2.5,0)",
    "line OP",
    "R(2.5,7.5)"
  ],
  "rightAngles": [
    {
      "at": "C",
      "from": [
        "B",
        "R"
      ]
    }
  ]
}
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
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "포물선 y=4-x^2 위의 점 P(t,4-t^2)의 접선 절편 C와 직선 OP 교점 R의 길이를 t로 표현 후 t->2- 극한",
  "decisiveStep": "CR^2/BC에서 (t-2)^2 인수를 약분하고 t->2- 대입",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "함수의 극한",
    "l4": "극한값 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": null,
    "why": "함수의 극한 > 극한값 계산 (FAMILY_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_TANGENT_EQUATION",
    "CC_COORDINATE_GEOMETRY"
  ],
  "conditionKeys": [
    "COND_QUADRANT_DOMAIN"
  ],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선 방정식, 두 직선의 교점, 0/0 약분 극한이 모두 맞물려 도형 길이를 처리해야 한다.",
  "level": "상",
  "item4slot": {
    "given": [
      "포물선",
      "접선",
      "교점"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "접선의방정식",
      "부정형",
      "인수분해"
    ],
    "condition": [
      "수선"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q17

- 형식: 객관식  
- 배점: 4.5



### 발문



함수 \$y=f(x)\$의 그래프가 그림과 같다. 함수 \$g(x)=3x+a\$에 대하여 함수 \$\|f(x)\|g(x)\$가 \$x=2\$에서 연속일 때, 상수 \$a\$의 값은?



### 선지



① \$-6\$ ② \$-3\$ ③ \$0\$ ④ \$3\$ ⑤ \$6\$



### 정답



①



### 해설



그래프에서 \$x=2\$에서의 \$f(x)\$의 좌극한, 우극한, 함숫값은 각각

\$\$\\lim\_{x\\to2^-}f(x)=2, \\quad \\lim\_{x\\to2^+}f(x)=-4, \\quad f(2)=-4\$\$

이다. 따라서 \$\|f(x)\|\$에 대하여

\$\$\\lim\_{x\\to2^-}\|f(x)\|=2, \\quad \\lim\_{x\\to2^+}\|f(x)\|=4, \\quad \|f(2)\|=4\$\$

이다. 다항함수 \$g(x)=3x+a\$는 \$x=2\$에서 연속이므로 \$\|f(x)\|g(x)\$가 \$x=2\$에서 연속이려면

\$\$2(6+a) \= 4(6+a)\$\$

이어야 한다. 따라서 \$6+a=0\$, 즉 \$a=-6\$이다. 정답은 ①이다.

```
{
  "family": "piecewise-linear-v1",
  "caption": "x=2에서 좌극한이 2, 우극한과 함숫값이 -4인 함수 y=f(x)의 그래프",
  "sourceQuote": "함수 |f(x)|g(x)가 x=2에서 연속일 때, 상수 a의 값은?",
  "pieces": [
    {
      "domain": "(-inf,2)",
      "expr": "-2*x+6",
      "openEnd": true
    },
    {
      "domain": "[2,inf)",
      "expr": "2*x-8",
      "closedStart": true
    }
  ],
  "viewport": [
    -1,
    5.5,
    -5,
    6
  ]
}
```

```
{
  "sourceQid": "Q17",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "그래프에서 x=2 좌우극한 2, -4를 읽어 |f(x)| 불연속을 g(2)=0으로 상쇄",
  "decisiveStep": "절댓값 적용 후 |f(2-)|=2 ≠ |f(2+)|=4이므로 g(2)=6+a=0 도출",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속 조건",
    "l4": "구간별 함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH",
    "why": "연속 조건 > 구간별 함수 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_ABSOLUTE_VALUE"
  ],
  "conditionKeys": [
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "그래프 판독과 절댓값 변환을 거친 뒤 곱의 연속 조건을 적용하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "그래프",
      "다항함수"
    ],
    "goal": [
      "실수"
    ],
    "method": [
      "연속",
      "좌극한",
      "우극한"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q18

- 형식: 객관식  
- 배점: 4.5



### 발문



최고차항의 계수가 \$1\$인 삼차함수 \$f(x)\$와 함수 \$\\displaystyle g(x)=\\begin{cases}\\frac{1}{x-3}&(x\\ne3)\\4&(x=3)\\end{cases}\$에 대하여 \$h(x)=f(x)g(x)\$라 할 때, 함수 \$h(x)\$는 실수 전체의 집합에서 미분가능하고 \$h'(3)=5\$이다. \$\\displaystyle\\frac{f(0)}{3}\$의 값을 구하면?



### 선지



① \$-6\$ ② \$-3\$ ③ \$6\$ ④ \$9\$ ⑤ \$12\$



### 정답



③



### 해설



\$h(x)\$가 \$x=3\$에서 미분가능하므로 먼저 \$x=3\$에서 연속이어야 한다.

\$\$\\lim\_{x\\to3}\\frac{f(x)}{x-3} \= h(3) \= 4f(3)\$\$

분모가 \$0\$으로 수렴하므로 \$f(3)=0\$이어야 하고, 따라서 \$h(3)=0\$이다. 즉 \$\\lim\_{x\\to3}\\frac{f(x)}{x-3}=0\$이므로 삼차함수 \$f(x)\$는 \$(x-3)^2\$을 인수로 갖는다. 최고차항의 계수가 \$1\$이므로 \$f(x)=(x-3)^2(x-k)\$로 두면,

\$\$h(x)=\\begin{cases}(x-3)(x-k)&(x\\ne3)\\0&(x=3)\\end{cases}\$\$

가 되어 실수 전체에서 \$h(x)=(x-3)(x-k)\$와 같다. 이를 미분하면 \$h'(x)=2x-k-3\$이므로

\$\$h'(3)=6-k-3=3-k=5 \\implies k=-2\$\$

이다. 따라서 \$f(x)=(x-3)^2(x+2)\$이고 \$f(0)=9\\cdot 2=18\$이므로 \$\\frac{f(0)}{3}=6\$이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "h(x)=f(x)g(x)의 x=3 연속·미분가능 조건으로 f(x)의 (x-3)^2 인수와 h'(3)=5 결정",
  "decisiveStep": "분모 (x-3) 소거 후에도 h(3)=0이 되려면 f(x)가 (x-3)^2을 인수로 가져야 함",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "미분가능성과 연속",
    "l4": "미분가능 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "why": "미분가능성과 연속 > 미분가능 조건 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [
    "CC_POLYNOMIAL_FACTORIZATION"
  ],
  "conditionKeys": [
    "COND_LEADING_COEFF",
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분모에 x-3이 있는 함수와의 곱이 연속이고 미분가능하려면 (x-3)^2 인수가 필요함을 추론해야 한다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "곱"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "인수분해",
      "연속",
      "미분가능"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": ""
}
```

## Q19

- 형식: 객관식  
- 배점: 4.5



### 발문



다항식 \$(x^2-1)(x^2+ax)-24\$를 \$(x-3)^2\$으로 나누었을 때의 나머지를 \$R(x)\$라 하자. \$R(x)\$가 \$x-3\$으로 나누어떨어질 때, \$\\displaystyle\\frac{R(a)}{a}\$의 값은? (단, \$a\$는 상수이다.)



### 선지



① \$100\$ ② \$110\$ ③ \$120\$ ④ \$125\$ ⑤ \$130\$



### 정답



④



### 해설



다항식 \$P(x)=(x^2-1)(x^2+ax)-24\$라 하면 몫을 \$Q(x)\$라 할 때

\$\$P(x)=(x-3)^2 Q(x)+R(x)\$\$

이고 \$R(x)\$는 일차 이하의 다항식이다. \$R(x)\$가 \$x-3\$으로 나누어떨어지므로 \$R(3)=0\$, 즉 \$R(x)=k(x-3)\$ (\$k\$는 상수) 꼴이다. \$x=3\$을 대입하면 \$P(3)=R(3)=0\$이므로

\$\$(9-1)(9+3a)-24=0 \\implies 8(9+3a)=24 \\implies 9+3a=3 \\implies a=-2\$\$

이다. 한편 항등식 \$P(x)=(x-3)^2 Q(x)+k(x-3)\$의 양변을 \$x\$에 대하여 미분하면

\$\$P'(x)=2(x-3)Q(x)+(x-3)^2 Q'(x)+k\$\$

이다. \$x=3\$을 대입하면 \$k=P'(3)\$이다. \$P(x)=(x^2-1)(x^2-2x)-24\$를 곱의 미분법으로 미분하면

\$\$P'(x)=2x(x^2-2x)+(x^2-1)(2x-2)\$\$

이므로 \$k=P'(3)=6(9-6)+8(6-2)=18+32=50\$이다. 따라서 \$R(x)=50(x-3)\$이고 \$a=-2\$이므로

\$\$\\frac{R(a)}{a}=\\frac{R(-2)}{-2}=\\frac{50(-5)}{-2}=125\$\$

이다. 정답은 ④이다.

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
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "항등식 P(x)=(x-3)^2 Q(x)+k(x-3)에 x=3 대입 및 양변 미분으로 a, k 결정",
  "decisiveStep": "P(3)=0으로 a=-2를 구한 뒤 양변 미분 후 x=3 대입으로 k=P'(3)=50 도출",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "도함수",
    "l4": "도함수 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "도함수 > 도함수 계산 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_REMAINDER_THEOREM",
    "CC_IDENTITY_POLYNOMIAL"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "나머지정리 항등식과 다항식 미분법을 결합해 미정계수와 나머지를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항식",
      "나머지"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "항등식",
      "나머지정리",
      "곱의미분법"
    ],
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q20

- 형식: 객관식  
- 배점: 4.5



### 발문



함수 \$f(x)=ax^3-x^2+x\$에 대하여 곡선 \$y=f(x)\$ 위의 두 점 \$A\\left(4,-\\frac43\\right)\$, \$B\$에서의 접선이 만나는 점을 \$C\$라 하면 삼각형 \$ABC\$는 \$\\angle BCA=90^\\circ\$인 직각삼각형이다. 삼각형 \$ABC\$의 외접원의 넓이는? (단, \$a\$는 상수이고 \$a\\ne0\$이다.)



### 선지



① \$\\frac{5\\pi}{9}\$ ② \$\\frac{7\\pi}{9}\$ ③ \$\\frac{8\\pi}{9}\$ ④ \$\\pi\$ ⑤ \$\\frac{10\\pi}{9}\$



### 정답



⑤



### 해설



점 \$A\\left(4,-\\frac43\\right)\$가 곡선 \$y=f(x)\$ 위의 점이므로

\$\$f(4)=64a-16+4=-\\frac43 \\implies 64a=\\frac{32}{3} \\implies a=\\frac16\$\$

이다. 따라서 \$f(x)=\\frac16x^3-x^2+x\$이고 도함수는

\$\$f'(x)=\\frac12x^2-2x+1=\\frac12(x-2)^2-1\$\$

이다. 점 \$A\$에서의 접선의 기울기는 \$f'(4)=\\frac12(4-2)^2-1=1\$이다. \$ngle BCA=90^\\circ\$이므로 점 \$B\$에서의 접선의 기울기 \$f'(x\_B)\$는 \$-1\$이어야 한다.

\$\$\\frac12(x\_B-2)^2-1=-1 \\implies x\_B=2\$\$

그러므로 점 \$B\$의 좌표는 \$\\left(2, f(2)\\right)=\\left(2, \\frac43-4+2\\right)=\\left(2,-\\frac23\\right)\$이다. 직각삼각형 \$ABC\$에서 빗변 \$AB\$가 외접원의 지름이므로 외접원의 반지름을 \$R\$이라 하면

\$\$\\overline{AB}^2=(4-2)^2+\\left(-\\frac43+\\frac23\\right)^2=4+\\frac49=\\frac{40}{9}\$\$

\$\$R^2=\\frac{\\overline{AB}^2}{4}=\\frac{10}{9}\$\$

따라서 외접원의 넓이는 \$\\pi R^2=\\frac{10\\pi}{9}\$이다. 정답은 ⑤이다.

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
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "A 대입으로 a=1/6 결정 후 접선 수직 조건 f'(x_B)=-1로 유일한 점 B 구해 외접원 넓이 계산",
  "decisiveStep": "도함수의 최솟값이 -1이므로 f'(x_B)=-1이 유일한 점 B(2,-2/3)를 결정함",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "접선",
    "l4": "접선의 방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "why": "접선 > 접선의 방정식 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_PERPENDICULAR_SLOPES",
    "CC_CIRCUMCIRCLE_RIGHT_TRIANGLE"
  ],
  "conditionKeys": [
    "COND_NONZERO"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼차함수 계수 결정, 접선 수직 조건에 의한 유일 점 결정, 직각삼각형 외접원 성질이 결합된 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "접선",
      "직각삼각형"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "도함수",
      "접선",
      "직각삼각형"
    ],
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q21

- 형식: 객관식  
- 배점: 4.5



### 발문



함수 \$f(x)=-x^3+3x^2-ax+4\$가 \$0\<x\<3\$에서 극댓값과 극솟값을 모두 갖도록 하는 정수 \$a\$의 합을 구하면?



### 선지



① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$



### 정답



③



### 해설



도함수는 \$f'(x)=-3x^2+6x-a\$이다. \$f(x)\$가 열린구간 \$(0,3)\$에서 극댓값과 극솟값을 모두 가지려면 이차방정식 \$g(x)=3x^2-6x+a=0\$이 구간 \$(0,3)\$에서 서로 다른 두 실근을 가져야 한다.

1. 판별식 조건: \$\\frac{D}{4}=9-3a\>0 \\implies a\<3\$  
2. 대칭축: \$x=1\$은 구간 \$(0,3)\$ 안에 있다.  
3. 경계 함숫값 조건: \$\$g(0)=a\>0, \\quad g(3)=27-18+a=9+a\>0\$\$

세 조건을 모두 만족하는 범위는 \$0\<a\<3\$이므로 정수 \$a\$는 \$1, 2\$이다. 따라서 정수 \$a\$의 합은 \$1+2=3\$이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "도함수 f'(x)=0의 두 근이 (0,3)에 있도록 이차방정식 근의 분리(판별식·축·경계) 적용",
  "decisiveStep": "이차함수 g(x)=3x^2-6x+a의 판별식>0, g(0)>0, g(3)>0 연립",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "증가·감소와 극값",
    "l4": "극대·극소"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "why": "증가·감소와 극값 > 극대·극소 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_QUADRATIC_ROOT_LOCATION"
  ],
  "conditionKeys": [
    "COND_INTEGER_DOMAIN",
    "COND_OPEN_INTERVAL"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼차함수의 극값 존재 구간 조건을 도함수 이차방정식의 근의 분리로 변환하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수",
      "열린구간"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "도함수",
      "극대",
      "극소"
    ],
    "condition": [
      "정수",
      "열린구간"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q22

- 형식: 서술형  
- 배점: 4



### 발문



\[서술형 1\] 다항함수 \$f(x)\$가 다음 두 조건을 만족할 때, \$f(6)\$의 값을 구하시오.

> Ⅰ. \$\\displaystyle\\lim\_{x\\to\\infty}\\frac{f(x)}{x^2+1}=3\$ Ⅱ. \$\\displaystyle\\lim\_{x\\to2}\\frac{f(x)}{x^2-4}=2\$



### 선지



없음



### 정답



\$80\$



### 해설



조건 Ⅰ에서 \$x\\to\\infty\$일 때 극한값이 \$3\$이므로 \$f(x)\$는 최고차항이 \$3x^2\$인 이차함수이다. 조건 Ⅱ에서 \$x\\to2\$일 때 분모 \$x^2-4\\to0\$이므로 분자 \$f(x)\\to0\$, 즉 \$f(2)=0\$이다. 따라서 \$f(x)=(x-2)(3x+k)\$ (\$k\$는 상수)로 둘 수 있다. 이를 조건 Ⅱ에 대입하면

\$\$\\lim\_{x\\to2}\\frac{(x-2)(3x+k)}{(x-2)(x+2)}=\\lim\_{x\\to2}\\frac{3x+k}{x+2}=\\frac{6+k}{4}=2\$\$

이므로 \$6+k=8\$, 즉 \$k=2\$이다. 따라서 \$f(x)=(x-2)(3x+2)\$이고 \$f(6)=4\\cdot(18+2)=80\$이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "무한대 극한으로 이차식 최고차항 3x^2 결정 후 x=2 극한으로 나머지 일차인수 확정",
  "decisiveStep": "f(x)=(x-2)(3x+k)로 설정해 약분 후 (6+k)/4=2 풀이",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "미정계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION",
    "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER",
    "why": "극한의 성질 > 미정계수 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "무한대와 유한점에서의 극한 조건 두 가지를 결합해 다항함수를 결정하는 기본 서술형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항함수",
      "극한"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "부정형",
      "인수분해"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q23

- 형식: 서술형  
- 배점: 5



### 발문



\[서술형 2\] 모든 실수에서 연속인 함수 \$f(x)\$가 \$(x-2)f(x)=3x^2-x+a\$를 만족시킬 때, \$f(2)\$의 값을 구하시오. (단, \$a\$는 상수)



### 선지



없음



### 정답



\$11\$



### 해설



\$x\\ne2\$일 때 \$f(x)=\\frac{3x^2-x+a}{x-2}\$이다. \$f(x)\$가 모든 실수에서 연속이므로 \$x=2\$에서도 연속이고, \$f(2)=\\lim\_{x\\to2}\\frac{3x^2-x+a}{x-2}\$가 존재해야 한다. 분모가 \$0\$으로 수렴하므로 분자도 \$x=2\$에서 \$0\$이어야 한다.

\$\$3(2)^2-2+a=0 \\implies 10+a=0 \\implies a=-10\$\$

분자를 인수분해하여 극한값을 구하면

\$\$f(2)=\\lim\_{x\\to2}\\frac{3x^2-x-10}{x-2}=\\lim\_{x\\to2}\\frac{(x-2)(3x+5)}{x-2}=\\lim\_{x\\to2}(3x+5)=11\$\$

이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "항등식 (x-2)f(x)=3x^2-x+a에서 연속성으로 f(2)=lim_{x->2} f(x) 극한 계산",
  "decisiveStep": "x=2 대입으로 a=-10을 구한 뒤 (x-2) 인수분해 후 극한 계산",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속 조건",
    "l4": "미정계수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_CONDITION",
    "templateKey": null,
    "why": "연속 조건 > 미정계수 (FAMILY_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "연속조건 f(2)=lim f(x)와 0/0 미정계수 결정을 결합한 서술형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "이차식",
      "연속"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "연속",
      "부정형",
      "인수분해"
    ],
    "condition": [
      "연속",
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q24

- 형식: 서술형  
- 배점: 5



### 발문



\[서술형 3\] 두 다항함수 \$f(x)\$, \$g(x)\$가 다음 조건을 만족시킨다.

> (가) 곡선 \$y=xg(x)\$ 위의 점 \$(3,6)\$에서의 접선의 기울기는 \$-1\$이다. (나) 곡선 \$y=f(x)g(x)\$ 위의 점 \$(3,f(3)g(3))\$에서의 접선의 기울기는 \$2\$이다.

함수 \$y=(f(x)+x^2)g(x)\$의 \$x=3\$에서의 미분계수를 구하시오.



### 선지



없음



### 정답



\$5\$



### 해설



조건 (가)에서 곡선 \$y=xg(x)\$가 점 \$(3,6)\$을 지나므로 \$3g(3)=6\$, 즉 \$g(3)=2\$이다. 또한 \$y=xg(x)\$의 도함수는 \$y'=g(x)+xg'(x)\$이므로 \$x=3\$에서의 접선의 기울기는

\$\$g(3)+3g'(3)=2+3g'(3)=-1 \\implies g'(3)=-1\$\$

이다. 조건 (나)에서 \$(f(x)g(x))'\|\_{x=3}=2\$이다. 구하고자 하는 함수 \$y=(f(x)+x^2)g(x)=f(x)g(x)+x^2g(x)\$를 미분하여 \$x=3\$을 대입하면

\$\$\\begin{aligned} y'\|*{x=3} &= (f(x)g(x))'\|*{x=3} \+ (x^2g(x))'\|\_{x=3} \\ &= 2 \+ {2(3)g(3) \+ 3^2g'(3)} \\ &= 2 \+ (6\\cdot 2 \+ 9\\cdot(-1)) \\ &= 2 \+ 3 \= 5 \\end{aligned}\$\$

이다.

```
"NONE"
```

```
{
  "sourceQid": "Q24",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "곱의 미분법으로 g(3)=2, g'(3)=-1을 구한 뒤 (f(x)+x^2)g(x)를 분리 미분",
  "decisiveStep": "식을 f(x)g(x)+x^2g(x)로 분배해 조건 (나)의 미분계수 2를 그대로 대입",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "도함수",
    "l4": "도함수 계산"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "도함수 > 도함수 계산 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "곱의 미분법을 두 번 적용하고 식을 분배하여 주어진 조건을 직접 활용해야 하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항함수",
      "접선",
      "기울기"
    ],
    "goal": [
      "미분계수"
    ],
    "method": [
      "곱의미분법"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q25

- 형식: 서술형  
- 배점: 6



### 발문



\[서술형 4\] 곡선 \$y=x^3-4x\$ 위의 점 \$A(1,-3)\$에서의 접선을 \$l\$이라 하자. 직선 \$l\$과 이 곡선이 만나는 점 중 \$A\$가 아닌 점을 \$B\$라 하고, 직선 \$l\$과 평행한 직선이 이 곡선과 접할 때 접점의 좌표를 \$C\$라 하자. 두 점 \$B,C\$ 사이의 거리를 \$d\$라고 할 때 \$d^2\$의 값을 구하시오. (단, 점 \$C\$의 \$x\$좌표는 \$1\$이 아니다.)



### 선지



없음



### 정답



\$10\$



### 해설



\$y=f(x)=x^3-4x\$라 하면 \$f'(x)=3x^2-4\$이다. 점 \$A(1,-3)\$에서의 접선 \$l\$의 기울기는 \$f'(1)=3-4=-1\$이므로 직선 \$l\$의 방정식은

\$\$y-(-3)=-1(x-1) \\implies y=-x-2\$\$

직선 \$l\$과 곡선 \$y=x^3-4x\$의 교점을 구하기 위해 연립하면

\$\$x^3-4x=-x-2 \\implies x^3-3x+2=0 \\implies (x-1)^2(x+2)=0\$\$

따라서 \$A\$가 아닌 교점 \$B\$의 좌표는 \$B(-2, 0)\$이다. 한편 직선 \$l\$과 평행한 접선의 기울기도 \$-1\$이므로 접점 \$C\$의 \$x\$좌표는

\$\$3x^2-4=-1 \\implies x^2=1 \\implies x=1 \\text{ 또는 } x=-1\$\$

\$x\\ne1\$이므로 \$C(-1, f(-1))=C(-1, 3)\$이다. 두 점 \$B(-2,0)\$, \$C(-1,3)\$ 사이의 거리의 제곱 \$d^2\$은

\$\$d^2={(-1)-(-2)}^2+(3-0)^2=1^2+3^2=10\$\$

이다.

```
"NONE"
```

```
{
  "sourceQid": "Q25",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "접선 l과 삼차곡선의 교점 B(-2,0) 및 평행 접선 접점 C(-1,3)를 구해 거리 제곱 계산",
  "decisiveStep": "접선 연립식 x^3-3x+2=0의 중근(x=1)과 나머지 실근(x=-2) 분리",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "접선",
    "l4": "접선의 방정식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENT_CONSTRUCTION",
    "why": "접선 > 접선의 방정식 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_DISTANCE_TWO_POINTS"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선 방정식, 삼차방정식 교점, 평행 접선 접점, 두 점 사이 거리 공식을 순차 연결하는 서술형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수",
      "접선"
    ],
    "goal": [
      "거리"
    ],
    "method": [
      "접선의방정식",
      "평행",
      "거리"
    ],
    "condition": [
      "평행"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

