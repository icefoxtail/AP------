

```
{"stem": "26_금당고_2학기_중간_고2_미적분I_유사", "sourceArchiveFile": "original/high/h2/2mid/26_금당고_2학기_중간_고2_미적분I.js", "examFolder": "2mid", "grade": "고2", "subject": "미적분I", "curriculum": "2022", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3



### 발문



\$\\displaystyle\\lim\_{x\\to\\infty}\\frac{(3x+1)(4x-2)}{6x^2+x-5}\$의 값은?



### 선지



① \$2\$ ② \$\\frac{3}{2}\$ ③ \$1\$ ④ \$\\frac{1}{2}\$ ⑤ \$0\$



### 정답



①



### 해설



분자를 전개하면 \$(3x+1)(4x-2)=12x^2-2x-2\$이다. \$x\\to\\infty\$일 때 분모와 분자의 최고차항이 모두 \$x^2\$이므로 최고차항의 계수의 비를 구한다.

\$\$\\lim\_{x\\to\\infty}\\frac{12x^2-2x-2}{6x^2+x-5}=\\frac{12}{6}=2\$\$

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
  "primaryMethod": "분자 전개 후 무한대 유리식 극한에서 최고차항(x^2) 계수비 12/6=2 계산",
  "decisiveStep": "분자 최고차항 계수 3*4=12와 분모 6의 비 계산",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "무한대에서의 극한",
    "l4": "다항·유리함수"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_INFINITY_LEADING_TERM",
    "why": "무한대에서의 극한 > 다항·유리함수 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "무한대에서의 최고차항 계수비만 구하면 끝나는 기본 극한 문항이다.",
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
      "부정형",
      "극한"
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



\$\\displaystyle\\lim\_{x\\to2}\\frac{\\sqrt{x+7}-3}{x-2}\$의 값은?



### 선지



① \$\\frac{1}{4}\$ ② \$\\frac{1}{6}\$ ③ \$\\frac{1}{3}\$ ④ \$\\frac{1}{2}\$ ⑤ \$1\$



### 정답



②



### 해설



분자를 유리화하여 공통인수 \$(x-2)\$를 약분한다.

\$\$\\begin{aligned} \\lim\_{x\\to2}\\frac{\\sqrt{x+7}-3}{x-2} &= \\lim\_{x\\to2}\\frac{(x+7)-9}{(x-2)(\\sqrt{x+7}+3)} \\ &= \\lim\_{x\\to2}\\frac{x-2}{(x-2)(\\sqrt{x+7}+3)} \\ &= \\frac{1}{\\sqrt{9}+3} \= \\frac{1}{6} \\end{aligned}\$\$

따라서 정답은 ②이다.

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
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "x=2에서 0/0 꼴 무리식 극한의 분자를 유리화하여 (x-2) 약분 후 대입",
  "decisiveStep": "분자 유리화로 (x-2) 인수를 만들어 분모와 약분",
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
  "difficultyReason": "기본 분자 유리화로 바로 해결되는 부정형 극한 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "극한"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "유리화",
      "부정형"
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



함수 \$f(x)=\\dfrac{1}{x+4}\$의 정의역의 구간을 바르게 나타낸 것은?



### 선지



① \$(-\\infty,\\infty)\$ ② \$(-\\infty,-4)\$ ③ \$(-\\infty,-4)\\cup(-4,\\infty)\$ ④ \$(-4,\\infty)\$ ⑤ \$(-4,-4)\$



### 정답



③



### 해설



분수함수 \$f(x)=\\frac{1}{x+4}\$은 분모가 \$0\$이 되는 \$x=-4\$를 제외한 모든 실수에서 정의된다. 따라서 정의역을 구간으로 나타내면 \$(-\\infty,-4)\\cup(-4,\\infty)\$이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "분수함수 f(x)=1/(x+4)의 분모 x+4≠0 조건으로 정의역 구간 표기",
  "decisiveStep": "분모가 0이 되는 x=-4를 제외한 두 열린구간의 합집합 선택",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속의 뜻",
    "l4": "구간에서의 연속"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": null,
    "why": "연속의 뜻 > 구간에서의 연속 (FAMILY_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "분모가 0인 점을 제외한 정의역을 구간 기호로 표현하는 개념 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "유리함수"
    ],
    "goal": [
      "구간"
    ],
    "method": [
      "유리함수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q04

- 형식: 객관식  
- 배점: 3.2



### 발문



함수 \$f(x)=\\dfrac{8}{x-1}\$의 구간 \$\[2,5\]\$에서의 최댓값과 최솟값의 합은?



### 선지



① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$



### 정답



④



### 해설



유리함수 \$f(x)=\\frac{8}{x-1}\$은 구간 \$\[2,5\]\$에서 연속이고 감소한다. 따라서 최댓값은 \$x=2\$에서 \$f(2)=\\frac{8}{2-1}=8\$, 최솟값은 \$x=5\$에서 \$f(5)=\\frac{8}{5-1}=2\$이다. 그러므로 최댓값과 최솟값의 합은 \$8+2=10\$이다. 정답은 ④이다.

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
  "conceptClusterKey": "FUNCTIONS_GRAPHS",
  "primaryMethod": "닫힌구간 [2,5]에서 연속·감소하는 유리함수 f(x)=8/(x-1)의 양 끝값 f(2)+f(5) 계산",
  "decisiveStep": "구간 내에 점근선 x=1이 없으므로 양 끝점에서 최대·최소 결정",
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
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "연속인 닫힌구간에서 단조감소 유리함수의 양 끝 함숫값을 더하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "유리함수",
      "닫힌구간"
    ],
    "goal": [
      "합"
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

## Q05

- 형식: 객관식  
- 배점: 3.3



### 발문



두 함수 \$f(x)=x-3\$, \$g(x)=x^2-2x+7\$에 대하여 다음 중 실수 전체의 집합에서 연속인 함수가 아닌 것은?



### 선지



① \$f(x)-3g(x)\$ ② \$f(x)+g(x)\$ ③ \$\\dfrac{f(x)}{g(x)}\$ ④ \$f(x)g(x)\$ ⑤ \$\\dfrac{g(x)}{f(x)}\$



### 정답



⑤



### 해설



\$f(x), g(x)\$는 다항함수이므로 실수 전체에서 연속이다. 따라서 합·차·실수배·곱인 ①, ②, ④는 실수 전체에서 연속이다. ③ \$g(x)=(x-1)^2+6\\ge 6\>0\$이므로 분모가 \$0\$이 되지 않아 실수 전체에서 연속이다. ⑤ \$f(3)=0\$이므로 \$\\frac{g(x)}{f(x)}\$는 \$x=3\$에서 정의되지 않아 실수 전체에서 연속이 아니다. 따라서 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q05",
  "variationType": "CONDITION",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "연속함수의 사칙연산 성질과 분모 영점 유무(g(x)>0 vs f(3)=0) 판별",
  "decisiveStep": "분모 g(x)=(x-1)^2+6>0과 f(3)=0을 비교해 불연속점 존재 함수 선택",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속의 뜻",
    "l4": "구간에서의 연속"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": null,
    "why": "연속의 뜻 > 구간에서의 연속 (FAMILY_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "다항함수의 사칙연산 연속성과 몫 함수에서 분모=0 판별을 확인하는 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "다항함수",
      "유리함수"
    ],
    "goal": [
      "연속"
    ],
    "method": [
      "연속"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q06

- 형식: 객관식  
- 배점: 3.5



### 발문



함수 \$f(x)=4x^2\$의 \$x=2\$에서의 미분계수의 값은?



### 선지



① \$12\$ ② \$16\$ ③ \$20\$ ④ \$24\$ ⑤ \$28\$



### 정답



②



### 해설



\$f'(x)=8x\$이므로 \$x=2\$에서의 미분계수는 \$f'(2)=8\\cdot 2=16\$이다. 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "이차함수 f(x)=4x^2의 도함수 f'(x)=8x에 x=2 대입",
  "decisiveStep": "도함수 f'(x)=8x를 구해 x=2 대입",
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
  "difficultyReason": "다항식 미분법으로 바로 미분계수를 구하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이차함수"
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

## Q07

- 형식: 객관식  
- 배점: 4



### 발문



함수 \$f(x)=x^2-1\$에 대하여 \$x\$의 값이 \$0\$에서 \$3\$까지 변할 때의 평균변화율의 값은?



### 선지



① \$3\$ ② \$2\$ ③ \$1\$ ④ \$0\$ ⑤ \$-1\$



### 정답



①



### 해설



구간 \$\[0,3\]\$에서의 평균변화율은

\$\$\\frac{f(3)-f(0)}{3-0}=\\frac{(9-1)-(0-1)}{3}=\\frac{9}{3}=3\$\$

이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "f(x)=x^2-1의 [0,3] 평균변화율 (f(3)-f(0))/(3-0)=3 계산",
  "decisiveStep": "평균변화율 공식 (f(3)-f(0))/3에 함숫값 대입",
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
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균변화율 정의식에 두 끝점을 대입하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이차함수",
      "평균변화율"
    ],
    "goal": [
      "평균변화율"
    ],
    "method": [
      "평균변화율"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q08

- 형식: 객관식  
- 배점: 4



### 발문



미분가능한 함수 \$f(x)\$에 대하여 \$f'(a)=2\$일 때, \$\\displaystyle\\lim\_{h\\to0}\\frac{f(a+4h)-f(a)}{h}\$의 값은?



### 선지



① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$



### 정답



④



### 해설



미분계수의 정의를 이용하면

\$\$\\lim\_{h\\to0}\\frac{f(a+4h)-f(a)}{h} \= \\lim\_{h\\to0}\\frac{f(a+4h)-f(a)}{4h}\\cdot 4 \= 4f'(a) \= 4\\cdot 2 \= 8\$\$

이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "극한식을 4*(f(a+4h)-f(a))/(4h)=4f'(a)로 변형해 8 계산",
  "decisiveStep": "분모에 4를 맞추어 4f'(a) 형태로 환원",
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
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미분계수 정의의 계수 맞추기 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "미분가능",
      "미분계수",
      "극한"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "미분계수"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q09

- 형식: 객관식  
- 배점: 4



### 발문



다항함수 \$f(x)\$에 대하여 \$f'(1)=-12\$일 때, \$\\displaystyle\\lim\_{x\\to1}\\frac{f(x)-f(1)}{x^3-1}\$의 값은?



### 선지



① \$-12\$ ② \$-6\$ ③ \$-4\$ ④ \$4\$ ⑤ \$6\$



### 정답



③



### 해설



분모를 인수분해하여 미분계수의 정의로 변형한다.

\$\$\\lim\_{x\\to1}\\frac{f(x)-f(1)}{x^3-1} \= \\lim\_{x\\to1}\\left(\\frac{f(x)-f(1)}{x-1}\\cdot\\frac{1}{x^2+x+1}\\right) \= f'(1)\\cdot\\frac{1}{3} \= \-12\\cdot\\frac{1}{3} \= \-4\$\$

이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "분모 x^3-1=(x-1)(x^2+x+1) 인수분해로 f'(1)/3=-4 계산",
  "decisiveStep": "(x-1) 인수를 분리해 f'(1)/(1+1+1) 도출",
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
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수분해와 미분계수의 정의를 연결하는 표준 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "다항함수",
      "미분계수",
      "극한"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "인수분해",
      "미분계수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q10

- 형식: 객관식  
- 배점: 4



### 발문



실수 전체의 집합에서 연속인 함수 \$f(x)\$가 모든 실수 \$x\$에 대하여 \$(x-3)f(x)=x^2+ax+b\$를 만족시킨다. \$f(3)=4\$일 때, \$a+b\$의 값은?



### 선지



① \$-1\$ ② \$-2\$ ③ \$-3\$ ④ \$-4\$ ⑤ \$-5\$



### 정답



⑤



### 해설



\$x\\ne3\$에서 \$f(x)=\\frac{x^2+ax+b}{x-3}\$이고 \$f(x)\$가 \$x=3\$에서 연속이므로 \$\\lim\_{x\\to3}\\frac{x^2+ax+b}{x-3}=f(3)=4\$이다. 분모가 \$0\$이므로 분자도 \$x=3\$에서 \$0\$이어야 한다. 따라서 \$x^2+ax+b=(x-3)(x-k)\$로 두면

\$\$\\lim\_{x\\to3}\\frac{(x-3)(x-k)}{x-3}=3-k=4 \\implies k=-1\$\$

이다. 그러므로 \$x^2+ax+b=(x-3)(x+1)=x^2-2x-3\$에서 \$a=-2\$, \$b=-3\$이고 \$a+b=-5\$이다. 정답은 ⑤이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "연속 조건 f(3)=lim_{x->3} (x^2+ax+b)/(x-3)=4로부터 분자 인수 (x-3)(x+1) 결정",
  "decisiveStep": "x=3 대입 0 조건으로 인수분해 후 극한값 4로 나머지 근 결정",
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
  "difficultyReason": "함수의 연속 정의와 0/0 미정계수 결정을 결합한 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "연속",
      "이차식"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "연속",
      "부정형",
      "인수분해"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q11

- 형식: 객관식  
- 배점: 4



### 발문



함수 \$\\displaystyle f(x)=\\begin{cases}ax-1&(x\\ge3)\\x^2-b&(-1\<x\<3)\\2x+c&(x\\le-1)\\end{cases}\$가 실수 전체의 집합에서 연속이고 \$f(0)=-4\$일 때, \$f(4)+f(-2)\$의 값은?



### 선지



① \$-2\$ ② \$0\$ ③ \$2\$ ④ \$4\$ ⑤ \$6\$



### 정답



③



### 해설



\$f(0)=-b=-4\$이므로 \$b=4\$이다. \$x=3\$에서 연속이므로 \$\\lim\_{x\\to3^-}f(x)=f(3)\$, 즉 \$3^2-4=3a-1 \\implies 5=3a-1 \\implies a=2\$이다. \$x=-1\$에서 연속이므로 \$\\lim\_{x\\to-1^+}f(x)=f(-1)\$, 즉 \$(-1)^2-4=2(-1)+c \\implies \-3=-2+c \\implies c=-1\$이다. 따라서 \$f(4)=2\\cdot 4-1=7\$, \$f(-2)=2(-2)-1=-5\$이므로 \$f(4)+f(-2)=7+(-5)=2\$이다. 정답은 ③이다.

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
  "primaryMethod": "f(0)=-4로 b=4 확정 후 두 경계 x=3, x=-1 연속 조건으로 a=2, c=-1 연립 결정",
  "decisiveStep": "x=3과 x=-1에서의 좌우극한 일치 식 두 개를 차례로 풀이",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "세 구간으로 나뉜 함수의 두 경계점에서 연속 조건을 순차 적용해 계수를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함숫값",
      "연속"
    ],
    "goal": [
      "합"
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

## Q12

- 형식: 객관식  
- 배점: 4



### 발문



함수 \$f(x)\$가 모든 실수 \$x\$에 대하여 \$-4x\\le f(x)\\le x^2+2x+8\$일 때, \$\\displaystyle\\lim\_{x\\to-2}\|(x-1)f(x)\|\$의 값은?



### 선지



① \$16\$ ② \$18\$ ③ \$20\$ ④ \$22\$ ⑤ \$24\$



### 정답



⑤



### 해설



\$x\\to-2\$일 때 양쪽 부등식의 극한은 각각

\$\$\\lim\_{x\\to-2}(-4x)=8, \\qquad \\lim\_{x\\to-2}(x^2+2x+8)=4-4+8=8\$\$

이므로 함수의 극한의 대소 관계(조임 정리)에 의해 \$\\lim\_{x\\to-2}f(x)=8\$이다. 따라서 구하는 극한값은

\$\$\\lim\_{x\\to-2}\|(x-1)f(x)\| \= \|(-2-1)\\cdot 8\| \= \|-24\| \= 24\$\$

이다. 정답은 ⑤이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "조임 정리로 x->-2에서 f(x)->8을 구한 뒤 절댓값 곱 극한 |(-3)*8|=24 계산",
  "decisiveStep": "양끝 함수의 x->-2 극한이 8로 일치함을 확인해 f(x) 극한 확정",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "함수의 극한의 대소 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "why": "극한의 성질 > 함수의 극한의 대소 관계 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_ABSOLUTE_VALUE"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "극한의 대소 관계(조임 정리)와 절댓값 식의 극한 계산을 결합한 문항이다.",
  "level": "중",
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
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q13

- 형식: 객관식  
- 배점: 5



### 발문



함수 \$y=f(x)\$의 그래프가 그림과 같을 때, \$\\displaystyle\\lim\_{t\\to\\infty}f\\left(\\frac{t-2}{t+1}\\right)+\\lim\_{t\\to-\\infty}f\\left(\\frac{1}{t}\\right)\$의 값은?



### 선지



① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$



### 정답



②



### 해설



\$\\frac{t-2}{t+1}=1-\\frac{3}{t+1}\$이므로 \$t\\to\\infty\$일 때 \$\\frac{t-2}{t+1}\\to 1^-\$이다. 그래프에서 \$\\lim\_{x\\to1^-}f(x)=2\$이다. 또 \$t\\to-\\infty\$일 때 \$\\frac{1}{t}\\to 0^-\$이다. 그래프에서 \$\\lim\_{x\\to0^-}f(x)=-1\$이다. 따라서 두 극한의 합은 \$2+(-1)=1\$이다. 정답은 ②이다.

```
{
  "family": "piecewise-linear-v1",
  "caption": "x=0에서 좌극한 -1, x=1에서 좌극한 2를 갖는 함수 y=f(x)의 그래프",
  "sourceQuote": "함수 y=f(x)의 그래프가 그림과 같을 때",
  "pieces": [
    {
      "domain": "(-inf,0)",
      "expr": "-x-1",
      "openEnd": true
    },
    {
      "domain": "[0,1)",
      "expr": "2*x",
      "closedStart": true,
      "openEnd": true
    },
    {
      "domain": "[1,inf)",
      "expr": "-x+2",
      "closedStart": true
    }
  ],
  "viewport": [
    -2.5,
    3.5,
    -2.5,
    3
  ]
}
```

```
{
  "sourceQid": "Q13",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "t->∞와 t->-∞에서 합성 입력값의 접근 방향(1-, 0-)을 판정해 그래프에서 좌극한 합산",
  "decisiveStep": "(t-2)/(t+1)=1-3/(t+1)->1- 및 1/t->0- 접근 방향 결정",
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
  "crossConceptKeys": [
    "CC_COMPOSITE_LIMIT"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "유리식 치환으로 합성극한의 방향(좌·우)을 정확히 판정해 그래프에서 읽어야 하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "그래프",
      "합성함수",
      "극한"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "좌극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q14

- 형식: 객관식  
- 배점: 5



### 발문



함수 \$\\displaystyle f(x)=\\begin{cases}x^2+a&(x\\le3)\\bx&(x\>3)\\end{cases}\$가 \$x=3\$에서 미분가능할 때, \$a+b\$의 값은? (단, \$a,b\$는 상수이다.)



### 선지



① \$15\$ ② \$13\$ ③ \$11\$ ④ \$9\$ ⑤ \$7\$



### 정답



①



### 해설



\$f(x)\$가 \$x=3\$에서 미분가능하므로 먼저 \$x=3\$에서 연속이어야 한다.

\$\$9+a \= 3b\$\$

또한 좌미분계수와 우미분계수가 같아야 하므로

\$\$2(3) \= b \\implies b=6\$\$

이다. 이를 첫째 식에 대입하면 \$9+a=18\$에서 \$a=9\$이다. 따라서 \$a+b=9+6=15\$이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "x=3에서 연속(9+a=3b)과 좌·우미분계수 일치(6=b) 연립으로 a=9, b=6 결정",
  "decisiveStep": "미분가능의 두 조건(함숫값 일치, 좌우미분계수 일치) 연립",
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
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간별 함수의 한 점에서의 미분가능성(연속+좌우미분계수 일치)을 적용하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "이차함수",
      "미분가능"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "연속",
      "좌미분계수",
      "우미분계수"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": ""
}
```

## Q15

- 형식: 객관식  
- 배점: 5



### 발문



두 다항함수 \$f(x)\$, \$g(x)\$가 다음 조건을 만족시킬 때, \$f'(1)\$의 값은?

> (가) \$\\displaystyle\\lim\_{x\\to1}\\frac{f(x)-g(x)+1}{x-1}=5\$ (나) \$\\displaystyle\\lim\_{x\\to1}\\frac{f(x^2)+x^2g(x^2)}{x-1}=4\$



### 선지



① \$\\frac{9}{4}\$ ② \$\\frac{11}{4}\$ ③ \$3\$ ④ \$\\frac{13}{4}\$ ⑤ \$\\frac{7}{2}\$



### 정답



④



### 해설



조건 (가)에서 분모가 \$0\$이므로 \$f(1)-g(1)+1=0\$, 즉 \$f(1)-g(1)=-1\$이고, 미분계수 정의에 의해 \$f'(1)-g'(1)=5\$이다. 조건 (나)에서 분모가 \$0\$이므로 \$f(1)+g(1)=0\$이다. 두 식을 연립하면 \$f(1)=-\\frac{1}{2}\$, \$g(1)=\\frac{1}{2}\$이다. 이제 \$H(x)=f(x^2)+x^2g(x^2)\$라 두면 \$H(1)=0\$이고 조건 (나)는 \$H'(1)=4\$를 뜻한다. 미분하면 \$H'(x)=2xf'(x^2)+2xg(x^2)+2x^3g'(x^2)\$이므로 \$x=1\$을 대입하면

\$\$2f'(1)+2g(1)+2g'(1)=4 \\implies 2f'(1)+1+2g'(1)=4 \\implies f'(1)+g'(1)=\\frac{3}{2}\$\$

이다. \$f'(1)-g'(1)=5\$와 연립하면 \$2f'(1)=\\frac{13}{2}\$, 따라서 \$f'(1)=\\frac{13}{4}\$이다. 정답은 ④이다.

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
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "두 0/0 극한에서 f(1), g(1)과 f'(1)-g'(1)=5, f'(1)+g'(1)=3/2를 도출해 연립",
  "decisiveStep": "H(x)=f(x^2)+x^2g(x^2)를 미분해 H'(1)=4를 f'(1)+g'(1) 관계식으로 환원",
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
    "CC_LIMIT_INDETERMINATE",
    "CC_PRODUCT_RULE"
  ],
  "conditionKeys": [],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "0/0 극한 조건 2개와 합성·곱 미분을 결합해 도함수 값을 연립으로 구하는 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "다항함수",
      "극한"
    ],
    "goal": [
      "미분계수"
    ],
    "method": [
      "미분계수",
      "곱의미분법",
      "합성함수의미분법"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q16

- 형식: 객관식  
- 배점: 5.2



### 발문



그림과 같이 곡선 \$y=\\dfrac{4}{x}\$ (\$x\>0\$) 위의 점 \$P\\left(t,\\dfrac{4}{t}\\right)\$를 지나고 직선 \$OP\$에 수직인 직선 \$l\$이 \$x\$축과 만나는 점을 \$Q\$, \$y\$축과 만나는 점을 \$R\$이라 하자. 삼각형 \$OPQ\$의 넓이를 \$S\_1(t)\$, 삼각형 \$OPR\$의 넓이를 \$S\_2(t)\$라 할 때, \$\\displaystyle\\lim\_{t\\to2}\\frac{S\_2(t)-S\_1(t)}{t-2}\$의 값은? (단, \$O\$는 원점이다.)



### 선지



① \$8\$ ② \$6\$ ③ \$4\$ ④ \$2\$ ⑤ \$1\$



### 정답



①



### 해설



직선 \$OP\$의 기울기가 \$\\frac{4/t}{t}=\\frac{4}{t^2}\$이므로 수직인 직선 \$l\$의 기울기는 \$-\\frac{t^2}{4}\$이다. 점 \$P\\left(t,\\frac{4}{t}\\right)\$를 지나는 직선 \$l\$의 방정식은

\$\$y-\\frac{4}{t}=-\\frac{t^2}{4}(x-t)\$\$

이다. \$y=0\$을 대입하면 \$x\_Q=t+\\frac{16}{t^3}\$이고, \$x=0\$을 대입하면 \$y\_R=\\frac{t^3}{4}+\\frac{4}{t}\$이다. 따라서 \$t\>0\$일 때 두 삼각형의 넓이는

\$\$S\_1(t)=\\frac{1}{2}\\cdot x\_Q\\cdot\\frac{4}{t}=2+\\frac{32}{t^4}, \\qquad S\_2(t)=\\frac{1}{2}\\cdot t\\cdot y\_R=\\frac{t^4}{8}+2\$\$

이다. 그러므로

\$\$\\begin{aligned} \\lim\_{t\\to2}\\frac{S\_2(t)-S\_1(t)}{t-2} &= \\lim\_{t\\to2}\\frac{t^8-256}{8t^4(t-2)} \\ &= \\lim\_{t\\to2}\\frac{(t+2)(t^2+4)(t^4+16)}{8t^4} \\ &= \\frac{4\\cdot 8\\cdot 32}{8\\cdot 16} \= 8 \\end{aligned}\$\$

이다. 정답은 ①이다.

```
{
  "family": "coordinate-geometry-v1",
  "caption": "곡선 y=4/x (x>0) 위의 점 P(t, 4/t)를 지나고 직선 OP에 수직인 직선 l과 절편 Q, R",
  "sourceQuote": "곡선 y=4/x 위의 점 P를 지나고 직선 OP에 수직인 직선 l이 x축과 만나는 점을 Q",
  "objects": [
    "hyperbola y=4/x (x>0)",
    "P(2,2)",
    "line OP",
    "perpendicular line l at P",
    "Q(4,0)",
    "R(0,4)"
  ],
  "rightAngles": [
    {
      "at": "P",
      "from": [
        "O",
        "Q"
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
  "primaryMethod": "점 P(t,4/t)에서 OP 수직 직선 절편 Q, R로 넓이 차 (t^8-256)/(8t^4)을 세워 t->2 극한 계산",
  "decisiveStep": "S2(t)-S1(t)에서 공통인수 (t-2)를 인수분해로 약분해 8 도출",
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
    "CC_PERPENDICULAR_SLOPES",
    "CC_TRIANGLE_AREA"
  ],
  "conditionKeys": [
    "COND_POSITIVE"
  ],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "수직 직선의 절편과 두 삼각형 넓이를 매개변수 t로 표현한 뒤 고차식 인수분해 극한을 계산해야 한다.",
  "level": "상",
  "item4slot": {
    "given": [
      "유리함수",
      "수선",
      "넓이"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "인수분해",
      "부정형"
    ],
    "condition": [
      "수선",
      "양수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q17

- 형식: 객관식  
- 배점: 5.5



### 발문



최고차항의 계수가 \$1\$인 삼차함수 \$f(x)\$와 함수 \$\\displaystyle g(x)=\\begin{cases}\\dfrac{1}{x-3}&(x\\ne3)\\5&(x=3)\\end{cases}\$에 대하여 \$h(x)=f(x)g(x)\$라 할 때, 함수 \$h(x)\$는 실수 전체의 집합에서 미분가능하고 \$h'(3)=4\$이다. \$f(1)\$의 값은?



### 선지



① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$



### 정답



③



### 해설



\$h(x)\$가 \$x=3\$에서 미분가능하려면 먼저 연속이어야 하므로 \$\\lim\_{x\\to3}\\frac{f(x)}{x-3}=h(3)=5f(3)\$이다. 분모가 \$0\$이므로 \$f(3)=0\$이고, 따라서 \$h(3)=0\$이다. 즉 \$\\lim\_{x\\to3}\\frac{f(x)}{x-3}=0\$이므로 \$f(x)\$는 \$(x-3)^2\$을 인수로 갖는다. 최고차항의 계수가 \$1\$이므로 \$f(x)=(x-3)^2(x-k)\$라 하면 실수 전체에서 \$h(x)=(x-3)(x-k)\$이다. 미분하면 \$h'(x)=2x-k-3\$이므로

\$\$h'(3)=6-k-3=3-k=4 \\implies k=-1\$\$

이다. 따라서 \$f(x)=(x-3)^2(x+1)\$이고 \$f(1)=(-2)^2\\cdot 2=8\$이다. 정답은 ③이다.

```
"NONE"
```

```
{
  "sourceQid": "Q17",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "h(x)=f(x)g(x)의 x=3 연속·미분가능 조건으로 f(x)=(x-3)^2(x-k) 설정 후 h'(3)=4 대입",
  "decisiveStep": "분모 (x-3)을 지우고도 h(3)=0이 되려면 (x-3)^2 인수가 필요함을 파악",
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
  "difficultyReason": "불연속 분수함수와의 곱이 미분가능하기 위한 (x-3)^2 인수 조건을 추론해야 하는 고난도 문항이다.",
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

## Q18

- 형식: 객관식  
- 배점: 5.5



### 발문



함수 \$\\displaystyle f(x)=\\begin{cases}ax+b&(x\<3)\\cx^2+2x&(x\\ge3)\\end{cases}\$가 실수 전체의 집합에서 연속이고 역함수를 갖는다. 함수 \$y=f(x)\$의 그래프와 역함수 \$y=f^{-1}(x)\$의 그래프의 교점이 \$3\$개이고 그 교점의 \$x\$좌표가 각각 \$0, 3, 6\$일 때, \$f(-2)+f(9)\$의 값은? (단, \$a,b,c\$는 상수이다.)



### 선지



① \$-4\$ ② \$-3\$ ③ \$-2\$ ④ \$-1\$ ⑤ \$0\$



### 정답



④



### 해설



\$y=f(x)\$와 \$y=f^{-1}(x)\$의 그래프는 직선 \$y=x\$에 대하여 대칭이므로 교점도 \$y=x\$ 대칭쌍을 이룬다. 세 교점의 \$x\$좌표가 \$0, 3, 6\$이고 \$f\$가 역함수를 가지므로 순감소 또는 순증가해야 한다. 순증가이면 모든 교점이 \$y=x\$ 위에 있어 \$(0,0),(3,3),(6,6)\$이어야 하지만, \$b=0\$이면 \$f(3)=9c+6=3\\implies c=-\\frac{1}{3}\$이 되어 \$f(6)=-12+12=0\\ne6\$이므로 모순이다. 따라서 순감소이고 세 교점은 \$(0,6)\$, \$(3,3)\$, \$(6,0)\$이어야 한다.

- \$f(0)=6 \\implies b=6\$  
- \$f(3)=3 \\implies 9c+6=3 \\implies c=-\\frac{1}{3}\$ (이때 \$f(6)=-\\frac{1}{3}\\cdot 36+12=0\$ 성립)  
- \$x=3\$에서 연속이므로 \$3a+6=3 \\implies a=-1\$

따라서 \$f(-2)=(-1)(-2)+6=8\$, \$f(9)=-\\frac{1}{3}\\cdot 81+18=-9\$이므로 \$f(-2)+f(9)=8+(-9)=-1\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "역함수 교점의 y=x 대칭과 단조성으로 (0,6), (3,3), (6,0)을 확정하고 x=3 연속으로 계수 결정",
  "decisiveStep": "단조증가 교점 (0,0),(3,3),(6,6) 모순을 소거해 감소 대칭쌍 (0,6),(6,0) 확정",
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
    "CC_INVERSE_FUNCTION_SYMMETRY"
  ],
  "conditionKeys": [
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "역함수의 대칭성(y=x 밖 교점 쌍)과 구간별 함수의 연속 조건을 통합 추론하는 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "교점",
      "연속"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "대칭이동",
      "연속"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q19

- 형식: 객관식  
- 배점: 5.8



### 발문



이차함수 \$f(x)=(x-k)^2\$ (\$k\>0\$)이 있다. 양수 \$a\$에 대하여 \$\\displaystyle g(x)=\\begin{cases}f(x)&(x\\le4)\\kf(x-a)&(x\>4)\\end{cases}\$이 다음 조건을 만족시킬 때, 보기에서 옳은 것만을 있는 대로 고른 것은?

> (가) \$\\displaystyle\\lim\_{x\\to4}g(x)\$가 존재한다. (나) 함수 \$y=g(x)\$의 그래프는 \$x\$축과 서로 다른 두 점에서 만난다.  
>   
> **\<보기\>** ㄱ. \$f(1)=4\$이면 \$g(3)=0\$이다. ㄴ. \$g(k+a)\<g(4)\$ ㄷ. \$(k-1)(k-2)\\ge0\$



### 선지



① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ



### 정답



②



### 해설



\$x\\le4\$에서 \$g(x)=(x-k)^2\$의 \$x\$절편은 \$x=k\$이고, \$x\>4\$에서 \$g(x)=k(x-a-k)^2\$의 \$x\$절편은 \$x=a+k\$이다. 조건 (나)에서 \$x\$축과 서로 다른 두 점에서 만나려면 \$k\\le4\$이고 \$a+k\>4\$여야 한다. 이때 \$k=4\$이면 \$g(4^-)=0\$이지만 \$g(4^+)=4a^2\>0\$으로 (가)에 모순이므로 \$0\<k\<4\$이고 \$a\>4-k\$이다.

- ㄱ. \$f(1)=(1-k)^2=4\$이고 \$k\>0\$이므로 \$k=3\$이다. 따라서 \$g(3)=(3-3)^2=0\$이다. (참)  
- ㄴ. \$k+a\>4\$이므로 \$g(k+a)=kf(k)=0\$이고, \$0\<k\<4\$이므로 \$g(4)=(4-k)^2\>0\$이다. 따라서 \$g(k+a)\<g(4)\$이다. (참)  
- ㄷ. 조건 (가) \$(4-k)^2=k(4-a-k)^2\$는 \$0\<k\<4\$인 임의의 \$k\$에 대해 양수 \$a=(4-k)+\\frac{4-k}{\\sqrt{k}}\$가 존재하므로 \$k=\\frac{3}{2}\$일 때도 성립한다. 이때 \$(k-1)(k-2)=-\\frac{1}{4}\<0\$이므로 거짓이다.

따라서 옳은 것은 ㄱ, ㄴ이므로 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "x축 교점 2개와 x=4 극한 존재 조건으로 0<k<4, a>4-k 범위를 확정해 ㄱ, ㄴ, ㄷ 판별",
  "decisiveStep": "x=4에서 좌우극한 일치 식이 0<k<4인 모든 k에 대해 양수 a 해를 가짐을 반례 k=3/2로 확인",
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
    "CC_QUADRATIC_VERTEX"
  ],
  "conditionKeys": [
    "COND_POSITIVE",
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간별 이차함수의 극한 존재와 x축 교점 개수 조건을 결합해 파라미터 범위를 추론하는 합답형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
      "극한"
    ],
    "goal": [
      "교점"
    ],
    "method": [
      "좌극한",
      "우극한",
      "이차함수"
    ],
    "condition": [
      "양수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q20

- 형식: 서술형  
- 배점: 8



### 발문



\[서술형 1\] 다항함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$f(x)\$를 구하시오.

> (가) \$\\displaystyle\\lim\_{x\\to\\infty}\\frac{f(x)-2x^2}{x^2+x+1}=2\$ (나) \$\\displaystyle\\lim\_{x\\to2}\\frac{f(x)}{x^2-x-2}=3\$



### 선지



없음



### 정답



\$f(x)=4x^2-7x-2\$



### 해설



조건 (가)에서 \$x\\to\\infty\$일 때 극한값이 \$2\$이므로 \$f(x)-2x^2\$은 최고차항이 \$2x^2\$인 이차식, 즉 \$f(x)\$는 최고차항이 \$4x^2\$인 이차함수이다. 조건 (나)에서 분모 \$x^2-x-2=(x-2)(x+1)\$이 \$x\\to2\$일 때 \$0\$으로 수렴하므로 분자 \$f(x)\$도 \$x=2\$에서 \$0\$이어야 한다. 따라서 \$f(x)=(x-2)(4x+k)\$ (\$k\$는 상수)로 둘 수 있다. 이를 (나)에 대입하면

\$\$\\lim\_{x\\to2}\\frac{(x-2)(4x+k)}{(x-2)(x+1)}=\\lim\_{x\\to2}\\frac{4x+k}{x+1}=\\frac{8+k}{3}=3\$\$

이므로 \$8+k=9\$, 즉 \$k=1\$이다. 따라서 \$f(x)=(x-2)(4x+1)=4x^2-7x-2\$이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "무한대 극한으로 최고차항 4x^2 결정 후 x=2 극한으로 f(x)=(x-2)(4x+k)의 k=1 확정",
  "decisiveStep": "f(2)=0으로부터 (x-2) 인수를 분리해 (8+k)/3=3 계산",
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
  "difficultyReason": "무한대 극한과 유한점 0/0 극한을 순차 결합해 이차함수를 결정하는 서술형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항함수",
      "극한"
    ],
    "goal": [
      "이차함수"
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

## Q21

- 형식: 서술형  
- 배점: 12



### 발문



\[서술형 2\] 최고차항의 계수가 \$1\$인 삼차함수 \$f(x)\$에 대하여 실수 전체의 집합에서 연속인 함수 \$g(x)\$가 다음 조건을 만족시킨다.

> (가) 모든 실수 \$x\$에 대하여 \$f(x)g(x)=x(x+6)\$ (나) \$g(0)=3\$

\$f(1)\$이 자연수일 때, \$g(2)\$의 최솟값을 구하시오.



### 선지



없음



### 정답



\$\\frac{4}{5}\$



### 해설



조건 (가)에 \$x=0\$을 대입하면 \$f(0)g(0)=0\$이고 \$g(0)=3\\ne0\$이므로 \$f(0)=0\$이다. \$f(x)\$는 최고차항의 계수가 \$1\$인 삼차함수이므로 \$f(x)=x(x^2+px+q)\$라 둘 수 있다. \$x\\ne0\$에서 \$g(x)=\\frac{x+6}{x^2+px+q}\$이고 \$g(x)\$가 \$x=0\$에서 연속이므로

\$\$g(0)=\\lim\_{x\\to0}\\frac{x+6}{x^2+px+q}=\\frac{6}{q}=3 \\implies q=2\$\$

이다. 이제 \$g(x)=\\frac{x+6}{x^2+px+2}\$가 실수 전체에서 연속이려면 분모 \$x^2+px+2=0\$이 실근을 갖지 않아야 한다. (만약 \$x=-6\$이 근이면 다른 근 \$-\\frac{1}{3}\$에서 불연속이 된다.) 따라서 판별식 \$D=p^2-8\<0\$, 즉 \$-2\\sqrt{2}\<p\<2\\sqrt{2}\$이다. 한편 \$f(1)=1(1+p+2)=p+3\$이 자연수이므로 가능한 정수 \$p\$는 \$-2,-1,0,1,2\$이다. \$g(2)=\\frac{2+6}{4+2p+2}=\\frac{8}{2p+6}=\\frac{4}{p+3}\$은 \$p\$가 최대일 때 최소가 되므로 \$p=2\$일 때 최솟값 \$\\frac{4}{5}\$를 갖는다.

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
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "f(0)=0, g(0)=3으로 f(x)=x(x^2+px+2) 결정 후 분모 실근 부재(p^2-8<0)와 f(1) 자연수로 p=2 선택",
  "decisiveStep": "x=-6이 근이어도 다른 근 -1/3에서 불연속이므로 D=p^2-8<0 필수임을 판별",
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
  "crossConceptKeys": [
    "CC_DISCRIMINANT_NO_REAL_ROOT"
  ],
  "conditionKeys": [
    "COND_NATURAL_NUMBER_DOMAIN",
    "COND_LEADING_COEFF"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼차함수 계수 결정, 유리함수 전구간 연속을 위한 판별식<0 추론, 자연수 조건 최적화가 결합된 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "연속"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "연속",
      "판별식",
      "부정형"
    ],
    "condition": [
      "연속",
      "자연수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

