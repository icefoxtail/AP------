

```
{"stem": "26_매산고_2학기_중간_고2_미적분I_유사", "sourceArchiveFile": "original/high/h2/2mid/26_매산고_2학기_중간_고2_미적분I.js", "examFolder": "2mid", "grade": "고2", "subject": "미적분I", "curriculum": "2022", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.5



### 발문



함수 \$f(x)=2x^3-2x^2+x+5\$에 대하여 \$\\displaystyle\\lim\_{x\\to1}\\frac{f(x)-f(1)}{x-1}\$의 값은?



### 선지



① \$3\$ ② \$1\$ ③ \$2\$ ④ \$4\$ ⑤ \$5\$



### 정답



①



### 해설



미분계수의 정의에 의해 \$\\lim\_{x\\to1}\\frac{f(x)-f(1)}{x-1}=f'(1)\$이다. \$f'(x)=6x^2-4x+1\$이므로 \$f'(1)=6-4+1=3\$이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "미분계수 정의를 f'(1)로 환원한 뒤 도함수 f'(x)=6x^2-4x+1에 x=1 대입",
  "decisiveStep": "극한식을 f'(1)로 바로 해석해 도함수 계산",
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
  "difficultyReason": "미분계수의 정의를 인식하고 삼차함수를 미분해 대입하면 바로 풀리는 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "삼차함수",
      "극한"
    ],
    "goal": [
      "미분계수"
    ],
    "method": [
      "미분계수",
      "도함수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q02

- 형식: 객관식  
- 배점: 3.6



### 발문



함수 \$f(x)=x^3-3x^2+2x-5\$에 대하여 다음 구간 중 방정식 \$f(x)=0\$이 실근을 갖는 구간은?



### 선지



① \$(1,2)\$ ② \$(2,3)\$ ③ \$(0,1)\$ ④ \$(3,4)\$ ⑤ \$(4,5)\$



### 정답



②



### 해설



\$f(x)\$는 다항함수이므로 실수 전체에서 연속이다. 각 정수점에서 함숫값을 구하면

\$\$f(0)=-5, \\quad f(1)=-5, \\quad f(2)=8-12+4-5=-5\<0, \\quad f(3)=27-27+6-5=1\>0\$\$

이다. \$f(2)f(3)\<0\$이므로 사잇값 정리에 의해 방정식 \$f(x)=0\$은 구간 \$(2,3)\$에서 적어도 하나의 실근을 갖는다. 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": "H22-M1-02-INTERMEDIATE_VALUE",
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "삼차함수 f(x)=x^3-3x^2+2x-5의 양 끝점 부호 f(2)=-5<0, f(3)=1>0 판정",
  "decisiveStep": "연속성 확인 후 부호가 바뀌는 구간 (2,3) 탐색",
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
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간 양 끝점의 함숫값 부호 변화로 사잇값 정리를 적용하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "삼차함수",
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

## Q03

- 형식: 객관식  
- 배점: 3.7



### 발문



함수 \$f(x)=(3x+2)(2x^2-x+3)\$에 대하여 \$f'(0)\$의 값은?



### 선지



① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$



### 정답



③



### 해설



곱의 미분법을 적용하면

\$\$f'(x) \= 3(2x^2-x+3) \+ (3x+2)(4x-1)\$\$

이다. \$x=0\$을 대입하면 \$f'(0)=3(3)+2(-1)=9-2=7\$이다. 정답은 ③이다.

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
  "primaryMethod": "곱의 미분법으로 f'(x)를 구한 뒤 x=0 대입해 f'(0)=7 계산",
  "decisiveStep": "곱의 미분법 전개 없이 바로 x=0 대입",
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
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "곱의 미분법을 적용해 x=0을 대입하는 기본 계산 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "다항함수",
      "곱"
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

## Q04

- 형식: 객관식  
- 배점: 3.7



### 발문



함수 \$y=f(x)\$의 그래프가 아래 그림과 같을 때, 함수 \$f(x)\$에 대한 설명으로 옳은 것은?



### 선지



① 함수 \$f(x)\$는 \$x=0\$에서 연속이다. ② \$f(1)=1\$ ③ \$\\displaystyle\\lim\_{x\\to3}f(x)=f(0)\$ ④ 열린구간 \$(1,3)\$에서 함수 \$f(x)\$의 최솟값이 존재한다. ⑤ \$\\displaystyle\\lim\_{x\\to2^-}f(x)=1\$



### 정답



④



### 해설



그래프에서 각 보기를 확인한다.

- ① \$f(0)=-2\$이고 \$\\lim\_{x\\to0}f(x)=1\$이므로 \$x=0\$에서 불연속이다. (거짓)  
- ② \$x=1\$에서 닫힌 점은 \$(1,0)\$이므로 \$f(1)=0\$이다. (거짓)  
- ③ \$\\lim\_{x\\to3}f(x)=1\\ne f(0)=-2\$이다. (거짓)  
- ④ 열린구간 \$(1,3)\$에서 함숫값은 \$x\\ne2\$일 때 \$1\$보다 크고 \$f(2)=1\$이므로 최솟값 \$1\$이 존재한다. (참)  
- ⑤ \$\\lim\_{x\\to2^-}f(x)=2\$이다. (거짓)

따라서 정답은 ④이다.

```
{
  "family": "piecewise-linear-v1",
  "caption": "x=0(점 -2), x=1(점 0), x=2(빈 원 2, 점 1)를 갖는 구간별 함수 y=f(x)의 그래프",
  "sourceQuote": "함수 y=f(x)의 그래프가 아래 그림과 같을 때",
  "pieces": [
    {
      "domain": "(-inf,0)",
      "expr": "1",
      "openEnd": true
    },
    {
      "domain": "(0,1)",
      "expr": "1-x",
      "openStart": true,
      "openEnd": true
    },
    {
      "domain": "(1,2)",
      "expr": "x",
      "openStart": true,
      "openEnd": true
    },
    {
      "domain": "(2,inf)",
      "expr": "4-x",
      "openStart": true
    }
  ],
  "isolatedPoints": [
    [
      0,
      -2
    ],
    [
      1,
      0
    ],
    [
      2,
      1
    ]
  ],
  "viewport": [
    -1.5,
    4.5,
    -3,
    3.5
  ]
}
```

```
{
  "sourceQid": "Q04",
  "variationType": "CONDITION",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "그래프의 열린점·닫힌점을 구분해 연속성, 극한값, 열린구간 최솟값 존재 여부를 판정",
  "decisiveStep": "열린구간 (1,3)에서 x=2의 함숫값 1이 최솟값이 됨을 확인",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속의 뜻",
    "l4": "한 점에서의 연속"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": "TPL_CONTINUITY_POINT_JUDGMENT",
    "why": "연속의 뜻 > 한 점에서의 연속 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CASE_BRANCH",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "그래프에서 함숫값·극한값·연속·최솟값을 동시에 점검해야 하는 선지 분기 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "그래프"
    ],
    "goal": [
      "최솟값",
      "연속"
    ],
    "method": [
      "좌극한",
      "우극한",
      "함숫값"
    ],
    "condition": [
      "열린구간"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q05

- 형식: 객관식  
- 배점: 3.8



### 발문



함수 \$\\displaystyle f(x)=\\begin{cases}2x+a&(x\<-1)\\bx^2+6x+7&(x\\ge-1)\\end{cases}\$이 실수 전체에서 미분가능할 때, 두 상수 \$a,b\$에 대하여 \$ab\$의 값은?



### 선지



① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$



### 정답



⑤



### 해설



\$x=-1\$에서 미분가능하려면 먼저 연속이어야 하므로

\$\$-2+a \= b - 6 \+ 7 \= b+1\$\$

또한 좌미분계수와 우미분계수가 같아야 하므로

\$\$2 \= \-2b+6 \\implies 2b=4 \\implies b=2\$\$

이다. 이를 첫째 식에 대입하면 \$-2+a=3\$에서 \$a=5\$이다. 따라서 \$ab=5\\cdot 2=10\$이다. 정답은 ⑤이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "x=-1에서 연속 조건(-2+a=b+1)과 미분계수 일치(2=-2b+6) 연립으로 a=5, b=2 결정",
  "decisiveStep": "좌우미분계수 일치로 b=2를 먼저 구한 뒤 연속 조건으로 a=5 계산",
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
  "difficultyReason": "구간별 다항함수의 미분가능 조건 두 가지를 연립하는 표준 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이차함수",
      "미분가능"
    ],
    "goal": [
      "곱"
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

## Q06

- 형식: 객관식  
- 배점: 3.9



### 발문



함수 \$f(x)=x^2+4x-5\$에 대하여 닫힌구간 \$\[-4,0\]\$에서 롤의 정리를 만족시키는 실수 \$c\$의 값은?



### 선지



① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$



### 정답



②



### 해설



\$f(-4)=16-16-5=-5\$, \$f(0)=-5\$이므로 \$f(-4)=f(0)\$이다. \$f'(x)=2x+4\$이므로 롤의 정리에 의해 \$f'(c)=2c+4=0\$을 만족시키는 \$c\\in(-4,0)\$은 \$c=-2\$이다. 정답은 ②이다.

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
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "이차함수 f(x)=x^2+4x-5의 [-4,0] 롤의 정리 f'(c)=2c+4=0 풀이",
  "decisiveStep": "f(-4)=f(0) 확인 후 f'(c)=0 해 c=-2 도출",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "롤의 정리와 평균값 정리",
    "l4": "롤의 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_MEAN_VALUE_THEOREM",
    "templateKey": "TPL_MVT_ROLLE_DIRECT",
    "why": "롤의 정리와 평균값 정리 > 롤의 정리 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_OPEN_INTERVAL"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "롤의 정리 식 f'(c)=0을 직접 풀어 c를 구하는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이차함수",
      "닫힌구간"
    ],
    "goal": [
      "실수"
    ],
    "method": [
      "롤의정리",
      "도함수"
    ],
    "condition": [
      "닫힌구간"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q07

- 형식: 객관식  
- 배점: 3.9



### 발문



닫힌구간 \$\[1,5\]\$에서 함수 \$f(x)=x^2-6x+11\$의 최댓값과 최솟값을 각각 \$M, m\$이라고 할 때, \$M+m\$의 값은?



### 선지



① \$8\$ ② \$9\$ ③ \$10\$ ④ \$11\$ ⑤ \$12\$



### 정답



①



### 해설



\$f(x)=(x-3)^2+2\$이므로 꼭짓점 \$x=3\\in\[1,5\]\$에서 최솟값 \$m=f(3)=2\$를 갖는다. 구간의 양 끝점에서는 \$f(1)=1-6+11=6\$, \$f(5)=25-30+11=6\$이므로 최댓값 \$M=6\$이다. 따라서 \$M+m=6+2=8\$이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "닫힌구간 [1,5]에서 이차함수 f(x)=(x-3)^2+2의 꼭짓점 최솟값과 끝점 최댓값 합산",
  "decisiveStep": "대칭축 x=3이 구간에 포함됨을 확인해 m=f(3)=2, M=f(1)=6 계산",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "최대·최소",
    "l4": "구간 최대·최소"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_MAX_MIN",
    "templateKey": "TPL_FUNCTION_DOMAIN_OPTIMIZATION",
    "why": "최대·최소 > 구간 최대·최소 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_CLOSED_INTERVAL"
  ],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "닫힌구간 내 이차함수의 최대·최소 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이차함수",
      "닫힌구간"
    ],
    "goal": [
      "최댓값",
      "최솟값",
      "합"
    ],
    "method": [
      "완전제곱식"
    ],
    "condition": [
      "닫힌구간"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q08

- 형식: 객관식  
- 배점: 3.9



### 발문



다항함수 \$f(x)\$가 \$\\displaystyle\\lim\_{x\\to1}\\frac{f(x)}{(x-1)^2}=9\$, \$\\displaystyle\\lim\_{x\\to\\infty}\\frac{f(x)}{x^3+3x}=3\$을 만족시킬 때, \$f(2)\$의 값은?



### 선지



① \$6\$ ② \$8\$ ③ \$10\$ ④ \$12\$ ⑤ \$14\$



### 정답



④



### 해설



두 번째 극한에서 \$f(x)\$는 최고차항이 \$3x^3\$인 삼차함수이다. 첫 번째 극한에서 \$x\\to1\$일 때 분모 \$(x-1)^2\\to0\$이고 극한값이 \$9\$로 존재하므로 \$f(x)\$는 \$(x-1)^2\$을 인수로 갖는다. 따라서 \$f(x)=3(x-1)^2(x-k)\$로 두면

\$\$\\lim\_{x\\to1}\\frac{3(x-1)^2(x-k)}{(x-1)^2}=3(1-k)=9 \\implies 1-k=3 \\implies k=-2\$\$

이다. 그러므로 \$f(x)=3(x-1)^2(x+2)\$이고 \$f(2)=3\\cdot 1^2\\cdot 4=12\$이다. 정답은 ④이다.

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
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "무한대 극한으로 삼차식 최고차항 3x^3 결정 후 (x-1)^2 인수로 f(x)=3(x-1)^2(x-k) 설정",
  "decisiveStep": "f(x)가 (x-1)^2 인수를 가짐을 파악해 3(1-k)=9로 k=-2 결정",
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
  "difficultyReason": "두 극한 조건으로 최고차항 계수와 중근 인수를 결정해 함숫값을 구하는 문항이다.",
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

## Q09

- 형식: 객관식  
- 배점: 4.3



### 발문



기울기가 \$5\$이고 \$y\$절편이 음수인 직선이 곡선 \$y=x^3-3x^2+5x+1\$에 접할 때, 이 직선은 점 \$(3,k)\$를 지난다. \$k\$의 값은?



### 선지



① \$8\$ ② \$10\$ ③ \$12\$ ④ \$14\$ ⑤ \$16\$



### 정답



③



### 해설



\$f(x)=x^3-3x^2+5x+1\$이라 하면 \$f'(x)=3x^2-6x+5\$이다. 접선의 기울기가 \$5\$이므로

\$\$3x^2-6x+5=5 \\implies 3x(x-2)=0 \\implies x=0 \\text{ 또는 } x=2\$\$

이다.

- \$x=0\$일 때 접점은 \$(0,1)\$이고 접선은 \$y=5x+1\$ (\$y\$절편 \$1\>0\$)  
- \$x=2\$일 때 접점은 \$(2,7)\$이고 접선은 \$y=5(x-2)+7=5x-3\$ (\$y\$절편 \$-3\<0\$)

조건에 맞는 접선은 \$y=5x-3\$이므로 점 \$(3,k)\$를 대입하면 \$k=5\\cdot 3-3=12\$이다. 정답은 ③이다.

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
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "f'(x)=5를 풀어 두 접점 x=0, 2를 구한 뒤 y절편<0 조건으로 접선 y=5x-3 선택",
  "decisiveStep": "두 접선 중 y절편이 음수인 x=2 접선 y=5x-3 선택",
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
  "crossConceptKeys": [],
  "conditionKeys": [
    "COND_NEGATIVE"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기울기가 주어진 접선 두 개를 모두 구해 y절편 부호 조건으로 하나를 골라야 한다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수",
      "기울기",
      "접선"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "접선의방정식",
      "도함수"
    ],
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q10

- 형식: 객관식  
- 배점: 4.5



### 발문



두 함수 \$f(x), g(x)\$에 대하여 다음 보기 중 옳은 것만을 있는 대로 고른 것은?

> **\<보기\>** ㄱ. \$\\displaystyle\\lim\_{x\\to a}f(x)\$, \$\\displaystyle\\lim\_{x\\to a}\\frac{g(x)}{f(x)}\$의 값이 각각 존재하면 \$\\displaystyle\\lim\_{x\\to a}g(x)\$의 값도 존재한다. ㄴ. \$\\displaystyle\\lim\_{x\\to a}\\frac{1}{f(x)}\$의 값이 존재하면 \$\\lim\_{x\\to a}f(x)\\ne 0\$이다. ㄷ. \$\\displaystyle\\lim\_{x\\to a}\\frac{g(x)}{f(x)}\$의 값이 존재하고 \$\\lim\_{x\\to a}f(x)=0\$이면 \$\\lim\_{x\\to a}g(x)=0\$이다.



### 선지



① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ



### 정답



⑤



### 해설



각 보기의 진위를 극한의 성질로 판정한다.

- ㄱ. \$g(x)=f(x)\\cdot\\frac{g(x)}{f(x)}\$이고 두 극한이 각각 존재하므로 곱의 극한 \$\\lim\_{x\\to a}g(x)\$도 존재한다. (참)  
- ㄴ. \$\\lim\_{x\\to a}\\frac{1}{f(x)}=L\$이 존재할 때, 만약 \$\\lim\_{x\\to a}f(x)=0\$이면 \$\\lim\_{x\\to a}1=\\lim\_{x\\to a}f(x)\\cdot\\frac{1}{f(x)}=0\\cdot L=0\$이 되어 모순이다. 따라서 \$\\lim\_{x\\to a}f(x)\\ne 0\$이다. (참)  
- ㄷ. \$\\lim\_{x\\to a}g(x)=\\lim\_{x\\to a}\\left(f(x)\\cdot\\frac{g(x)}{f(x)}\\right)=0\\cdot L=0\$이다. (참)

따라서 옳은 것은 ㄱ, ㄴ, ㄷ이므로 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q10",
  "variationType": "CONDITION",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "극한의 곱 성질을 이용해 합답형 ㄱ, ㄴ, ㄷ의 수렴·0 여부 판정",
  "decisiveStep": "g(x)=f(x)*(g(x)/f(x)) 및 1=f(x)*(1/f(x)) 곱셈 변형으로 세 명제 모두 참 증명",
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
  "difficultyReason": "극한의 성질과 0으로 나눌 수 없는 조건을 정확히 구별해야 하는 진위 판정 문항이다.",
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
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q11

- 형식: 객관식  
- 배점: 4.6



### 발문



삼차함수 \$f(x)\$에 대하여 \$y=f(x)\$의 그래프는 원점에 대하여 대칭이고, 점 \$(-1,-2)\$를 지나며 이 점에서의 접선의 기울기가 \$4\$이다. \$f(x)\$를 \$(x-1)^2\$으로 나눈 나머지를 \$R(x)\$라고 할 때, \$R(3)\$의 값은?



### 선지



① \$6\$ ② \$8\$ ③ \$10\$ ④ \$12\$ ⑤ \$14\$



### 정답



③



### 해설



\$y=f(x)\$가 원점에 대하여 대칭인 삼차함수이므로 \$f(x)=ax^3+bx\$로 둘 수 있다. 점 \$(-1,-2)\$를 지나고 이 점에서의 접선의 기울기가 \$4\$이므로

\$\$f(-1)=-a-b=-2 \\implies a+b=2, \\qquad f'(-1)=3a+b=4\$\$

연립하면 \$a=1\$, \$b=1\$이므로 \$f(x)=x^3+x\$이다. \$f(x)=(x-1)^2 Q(x)+R(x)\$ (\$R(x)=px+q\$)라 하면 \$R(1)=f(1)=2\$, \$R'(1)=f'(1)=3+1=4\$이다. 따라서 \$R(x)=4(x-1)+2=4x-2\$이고 \$R(3)=12-2=10\$이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "원점 대칭 삼차함수 f(x)=ax^3+bx 결정 후 (x-1)^2 나눗셈 나머지를 f(1), f'(1)로 도출",
  "decisiveStep": "기함수 계수 결정과 항등식 양변 미분 R'(1)=f'(1) 결합",
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
    "CC_ODD_FUNCTION",
    "CC_REMAINDER_THEOREM"
  ],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원점 대칭 삼차함수 결정과 나머지정리·미분법을 순차 결합한 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수",
      "원점대칭",
      "나머지"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "항등식",
      "나머지정리",
      "도함수"
    ],
    "condition": [
      "원점대칭"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q12

- 형식: 객관식  
- 배점: 4.8



### 발문



모든 항의 계수가 정수인 이차함수 \$f(x)\$에 대하여 \$\\displaystyle\\lim\_{x\\to-\\infty}\\bigl(\\sqrt{f(x)}+2x\\bigr)=3\$이고, 함수 \$\\dfrac{1}{f(x)}\$이 실수 전체에서 연속이다. 이때, \$f(0)\$의 최솟값은?



### 선지



① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$



### 정답



⑤



### 해설



\$x\\to-\\infty\$일 때 \$2x\\to-\\infty\$이므로 \$\\sqrt{f(x)}+2x\$가 수렴하려면 \$f(x)=4x^2+bx+c\$ 꼴이어야 한다. \$x=-t\$ (\$t\\to\\infty\$)로 치환하면

\$\$\\lim\_{t\\to\\infty}\\left(\\sqrt{4t^2-bt+c}-2t\\right) \= \\lim\_{t\\to\\infty}\\frac{-bt+c}{\\sqrt{4t^2-bt+c}+2t} \= \\frac{-b}{4}=3 \\implies b=-12\$\$

이다. 따라서 \$f(x)=4x^2-12x+c\$이다. 함수 \$\\frac{1}{f(x)}\$가 실수 전체에서 연속이려면 \$f(x)=0\$이 실근을 갖지 않아야 하므로 판별식

\$\$\\frac{D}{4} \= (-6)^2 - 4c \= 36-4c \< 0 \\implies c \> 9\$\$

이다. 모든 항의 계수가 정수이므로 정수 \$c\$의 최솟값은 \$10\$, 즉 \$f(0)=c\$의 최솟값은 \$10\$이다. 정답은 ⑤이다.

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
  "primaryMethod": "x->-∞ 무리식 극한으로 f(x)=4x^2-12x+c 결정 후 1/f(x) 전구간 연속(D<0)으로 c>9 도출",
  "decisiveStep": "x=-t 치환 유리화로 b=-12를 구하고 판별식 36-4c<0에서 최소 정수 c=10 결정",
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
  "crossConceptKeys": [
    "CC_DISCRIMINANT_NO_REAL_ROOT"
  ],
  "conditionKeys": [
    "COND_INTEGER_DOMAIN"
  ],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "x->-∞ 무리식 극한 치환·유리화와 분수함수 연속 조건(판별식<0)을 결합한 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
      "극한",
      "연속"
    ],
    "goal": [
      "최솟값"
    ],
    "method": [
      "유리화",
      "판별식",
      "연속"
    ],
    "condition": [
      "정수",
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q13

- 형식: 객관식  
- 배점: 5.2



### 발문



다항함수 \$f(x)\$에 대하여 실수 전체의 집합에서 미분가능한 함수 \$g(x)\$를 다음과 같이 정의하자.

\$\$g(x)=\\begin{cases}x^2-2x+4&(x\<2)\\f(x)&(2\\le x\<5)\\-x^2+12x-25&(x\\ge5)\\end{cases}\$\$

\$2\<x\<5\$인 모든 실수 \$x\$에 대하여 \$g'(x)\\le 2\$를 만족시킬 때, 세 직선 \$x=1\$, \$x=6\$, \$y=2\$와 곡선 \$y=g(x)\$로 둘러싸인 도형의 넓이는?



### 선지



① \$23\$ ② \$25\$ ③ \$27\$ ④ \$29\$ ⑤ \$31\$



### 정답



②



### 해설



\$g(x)\$가 실수 전체에서 미분가능하므로 \$x=2, 5\$에서 연속이다. \$g(2)=4-4+4=4\$, \$g(5)=-25+60-25=10\$이다. \$\[2,5\]\$에서 \$g'(x)\\le 2\$이므로 \$h(x)=g(x)-2x\$라 하면 \$h'(x)\\le 0\$이어서 \$h(x)\$는 감소하지 않는가 아니라 증가하지 않는다(단조감소). 그런데 \$h(2)=4-4=0\$이고 \$h(5)=10-10=0\$이므로 \$\[2,5\]\$에서 \$h(x)=0\$, 즉 \$g(x)=2x\$이다. 이제 \$1\\le x\\le 6\$에서 \$g(x)\>2\$이므로 구하는 도형의 넓이는 \$g(x)-2\$의 \$\[1,6\]\$ 위에서의 넓이다.

- \$\[1,2\]\$에서 \$g(x)-2=(x-1)^2+1\$ (\$x=1+u\$, \$0\\le u\\le 1\$이면 \$1+u^2\$)  
- \$\[5,6\]\$에서 \$g(x)-2=9-(x-6)^2\$ (\$x=6-u\$, \$0\\le u\\le 1\$이면 \$9-u^2\$) 두 구간의 같은 \$u\$에 대한 높이 합은 \$(1+u^2)+(9-u^2)=10\$이므로 양쪽 곡선 부분의 넓이 합은 밑변 \$1\$, 높이 \$10\$인 직사각형 넓이 \$10\$과 같다. 가운데 \$\[2,5\]\$에서는 \$g(x)-2=2x-2\$로 윗변 \$2\$, 아랫변 \$8\$, 높이 \$3\$인 사다리꼴이므로 넓이는 \$\\frac{(2+8)\\times 3}{2}=15\$이다. 따라서 전체 넓이는 \$10+15=25\$이다. 정답은 ②이다.

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
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "평균값 정리(g'(x)<=2와 기울기 2 일치)로 [2,5] 구간 g(x)=2x 확정 후 대칭 곡선 높이 합=10으로 넓이 계산",
  "decisiveStep": "g(5)-g(2)=2(5-2) 등호 조건으로 f(x)=2x를 확정하고 양끝 곡선 넓이 합을 직사각형으로 치환",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "롤의 정리와 평균값 정리",
    "l4": "평균값 정리를 이용한 함수의 성질"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_MEAN_VALUE_THEOREM",
    "templateKey": "TPL_MVT_BOUND_LIMIT",
    "why": "롤의 정리와 평균값 정리 > 평균값 정리를 이용한 함수의 성질 (DIRECT_BINDING_GAP)"
  },
  "crossConceptKeys": [
    "CC_SYMMETRY_AREA"
  ],
  "conditionKeys": [
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평균값 정리 등호 조건 추론과 대칭 짝짓기 넓이 계산이 결합된 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "다항함수",
      "미분가능",
      "도함수"
    ],
    "goal": [
      "넓이"
    ],
    "method": [
      "평균값정리",
      "도함수"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q14

- 형식: 객관식  
- 배점: 5.4



### 발문



이차함수 \$f(x)\$에 대하여 실수 전체에서 연속인 함수 \$g(x)\$를 다음과 같이 정의하자.

\$\$g(x)=\\begin{cases}\|3x^2-1\|&(x\<1)\\f(x)&(x\\ge1)\\end{cases}\$\$

실수 \$t\$에 대하여 곡선 \$y=g(x)\$와 직선 \$y=x+t\$가 만나는 점의 개수를 \$a(t)\$, 실수 \$k\$에 대하여 곡선 \$y=g(x)\$와 직선 \$y=k\$가 만나는 점의 개수를 \$b(k)\$라고 하자. 함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$g(7)\$의 값은?

> (가) \$\\displaystyle\\lim\_{t\\to\\infty}a(t)=2\$ (나) 함수 \$b(k)\$가 불연속인 \$k\$의 값은 \$2\$개다. (다) \$g(-1)=g(5)\$



### 선지



① \$8\$ ② \$6\$ ③ \$4\$ ④ \$2\$ ⑤ \$0\$



### 정답



①



### 해설



\$g\$가 실수 전체에서 연속이므로 \$f(1)=\|3\\cdot 1^2-1\|=2\$이고, (다)에서 \$f(5)=g(-1)=\|3(-1)^2-1\|=2\$이다. 따라서 이차함수 \$f(x)=A(x-1)(x-5)+2\$ (\$A\\ne 0\$)로 둘 수 있다. (가)에서 \$t\\to\\infty\$일 때 왼쪽 구간 \$x\<1\$의 교점은 \$1\$개이므로 오른쪽 구간 \$x\\ge1\$에서도 교점이 \$1\$개 있어야 하고, 따라서 아래로 볼록(\$A\>0\$)이어야 한다. 왼쪽 구간 \$x\<1\$에서 \$\|3x^2-1\|\$은 \$k=0\$과 \$k=1\$에서 \$b(k)\$의 불연속이 발생한다. 오른쪽 \$f(x)\$의 꼭짓점 \$(3, 2-4A)\$에서 새로운 불연속 \$k=2-4A\$가 생기므로 (나)에 의해 \$2-4A\$는 \$0\$ 또는 \$1\$이어야 한다. 만약 \$2-4A=1\$이면 \$k=1\$에서 왼쪽 구간과 오른쪽 꼭짓점이 겹쳐 불연속이 되더라도 \$k=2\$? 잠깐: \$x=1\$에서 높이 \$2\$는 연속 연결되어 불연속점이 아니지만, \$2-4A=0\$일 때 \$k=0\$에서 불연속이 겹쳐 전체 불연속점이 \$k=0, 1\$ 정확히 \$2\$개가 된다. (\$2-4A=1\$이어도 \$k=0,1\$ 두 개? 주의: \$k=1\$ 위쪽 \$1\<k\<2\$는 좌측 \$x\<1\$에 1개, 우측 \$x\\ge1\$에 2개=3개; \$k=2-4A=1\$이면 \$k=1\$에서 우측 1개+좌측 2개(x=0 접함 포함)=3개, \$k=1\$ 아래는 좌측 2개+우측 0개=2개로 불연속, 총 불연속은 \$k=0, 1\$\! 단 원문과 동일 구조인 \$2-4A=0\$을 선택하면? 잠깐, \$2-4A=1\$도 \$b(k)\$ 불연속 2개인지 확인하자\!) 실제로 \$2-4A=1\$이면 \$k\<0\$: 1개(오른쪽x/왼쪽만), \$k=0\$: 1+2=3개(불연속\!), \$0\<k\<1\$: 왼쪽3+오른쪽0=3개, \$k=1\$: 왼쪽2+오른쪽1=3개(연속\!), \$1\<k\<2\$: 왼쪽1+오른쪽2=3개(연속\!)... 아\! \$2-4A=1\$이면 \$k=0\$ 하나뿐이어서 불연속 1개\! 반면 \$2-4A=0\$이면 \$k\<0\$:1개, \$k=0\$:3개, \$0\<k\<1\$:5개, \$k=1\$:4개, \$1\<k\<2\$:3개이므로 불연속이 \$k=0, 1\$ 정확히 2개이다\! 따라서 \$2-4A=0 \\implies A=\\frac{1}{2}\$이고, \$f(x)=\\frac{1}{2}(x-1)(x-5)+2\$이므로 \$g(7)=f(7)=\\frac{1}{2}(6)(2)+2=8\$이다. 정답은 ①이다.

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
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "연속성·대칭점으로 f(x)=A(x-1)(x-5)+2 설정 후 교점 개수 불연속 2개 조건으로 꼭짓점=0(A=1/2) 확정",
  "decisiveStep": "꼭짓점 y좌표 2-4A=1일 때는 불연속이 1개뿐임을 소거해 2-4A=0(A=1/2) 유일 결정",
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
    "CC_QUADRATIC_VERTEX",
    "CC_ABSOLUTE_VALUE"
  ],
  "conditionKeys": [
    "COND_PIECEWISE_DOMAIN_PARTITION"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "절댓값 이차함수와 미정 이차함수의 수평선·직선 교점 개수 불연속 조건을 정밀 분류하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
      "연속",
      "교점"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "이차함수",
      "연속",
      "그래프의개형"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q15

- 형식: 객관식  
- 배점: 5.5



### 발문



곡선 \$y=9-x^2\$이 \$x\$축과 만나는 두 점을 각각 \$A(-3,0)\$, \$B(3,0)\$이라 하자. \$0\<t\<3\$인 실수 \$t\$에 대하여 곡선 위의 점 \$P(t,9-t^2)\$에 대하여 \$\\angle APB\$의 이등분선이 \$\\overline{AB}\$와 만나는 점을 \$Q\$라 할 때, \$\\displaystyle\\lim\_{t\\to0^+}\\frac{\\overline{OQ}}{t}\$의 값은? (단, \$O\$는 원점이다.)



### 선지



① \$\\frac{1}{2}\$ ② \$\\frac{1}{5}\$ ③ \$\\frac{1}{8}\$ ④ \$\\frac{1}{10}\$ ⑤ \$\\frac{1}{12}\$



### 정답



④



### 해설



두 선분 \$\\overline{PA}, \\overline{PB}\$의 길이를 \$t\$로 나타내면

\$\$\\begin{aligned} \\overline{PA} &= \\sqrt{(t+3)^2+(9-t^2)^2} \= (3+t)\\sqrt{1+(3-t)^2} \\ \\overline{PB} &= \\sqrt{(3-t)^2+(9-t^2)^2} \= (3-t)\\sqrt{1+(3+t)^2} \\end{aligned}\$\$

이다. 각의 이등분선 정리에 의해 \$\\overline{AQ}:\\overline{QB}=\\overline{PA}:\\overline{PB}\$이므로 점 \$Q\$의 \$x\$좌표는

\$\$\\overline{OQ} \= \\frac{3\\overline{PA}-3\\overline{PB}}{\\overline{PA}+\\overline{PB}}\$\$

이다. \$t\\to0^+\$일 때 \$\\overline{PA}+\\overline{PB}\\to 6\\sqrt{10}\$이고, \$\\overline{PA}-\\overline{PB}\$의 극한은

\$\$\\begin{aligned} \\lim\_{t\\to0^+}\\frac{\\overline{PA}-\\overline{PB}}{t} &= \\lim\_{t\\to0^+}\\frac{(3+t)^2(10-6t+t^2)-(3-t)^2(10+6t+t^2)}{t{\\overline{PA}+\\overline{PB}}} \\ &= \\lim\_{t\\to0^+}\\frac{(9+6t+t^2)(10-6t+t^2)-(9-6t+t^2)(10+6t+t^2)}{t{\\overline{PA}+\\overline{PB}}} \\ &= \\frac{2(60-54)}{6\\sqrt{10}} \= \\frac{12}{6\\sqrt{10}} \= \\frac{2}{\\sqrt{10}} \\end{aligned}\$\$

이다. 따라서

\$\$\\lim\_{t\\to0^+}\\frac{\\overline{OQ}}{t} \= \\frac{3}{6\\sqrt{10}}\\cdot\\frac{2}{\\sqrt{10}} \= \\frac{1}{10}\$\$

이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "각의 이등분선 정리로 OQ=3(PA-PB)/(PA+PB)를 세우고 PA-PB를 유리화해 t->0+ 극한 계산",
  "decisiveStep": "PA, PB에서 공통인수 (3+t), (3-t)를 묶어낸 뒤 유리화로 t 약분",
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
    "CC_ANGLE_BISECTOR_THEOREM",
    "CC_DISTANCE_TWO_POINTS"
  ],
  "conditionKeys": [
    "COND_OPEN_INTERVAL"
  ],
  "integrationPattern": "INTERDEPENDENT",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "각의 이등분선 내분비, 두 점 거리 인수분해, 무리식 차의 유리화 극한이 맞물린 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "포물선",
      "거리"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "유리화",
      "부정형",
      "거리"
    ],
    "condition": [
      "양수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q16

- 형식: 객관식  
- 배점: 5.7



### 발문



최고차항의 계수가 \$1\$인 이차함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$f(0)\$의 최댓값은?

> 모든 실수 \$a\$에 대하여 극한값 \$\\displaystyle\\lim\_{x\\to a}\\frac{(x^2-9x+20)f(x+t)}{f(x+t)+f(x-t)}\$이 존재하도록 하는 실수 \$t\$의 집합은 \${t\\mid \|t\|\\ge 2}\\cup{0}\$이다.



### 선지



① \$12\$ ② \$21\$ ③ \$16\$ ④ \$25\$ ⑤ \$29\$



### 정답



②



### 해설



\$f(x)=(x-c)^2+e\$라 두면 분모는 \$f(x+t)+f(x-t)=2{(x-c)^2+t^2+e}\$이다. 조건에 의해 \$0\<\|t\|\<2\$일 때만 극한이 존재하지 않는 \$a\$가 생겨야 하므로 \$e=-d^2\$ (\$d\>0\$)이고, \$\|t\|\>d\$이면 분모가 항상 양수이므로 경계 \$d=2\$, 즉 \$f(x)=(x-c)^2-4\$이다. \$\|t\|=2\$일 때 분모는 \$2(x-c)^2\$이고 분자의 \$f(x\\pm 2)=(x-c)(x-c\\pm 4)\$이다. \$x=c\$에서 극한이 존재하려면 \$x^2-9x+20=(x-4)(x-5)\$가 \$x=c\$에서 \$0\$이어야 하므로 \$c=4\$ 또는 \$c=5\$이다. (두 경우 모두 \$0\<\|t\|\<2\$에서 분모의 두 영점 \$c\\pm\\sqrt{4-t^2}\$가 동시에 \$4, 5\$가 될 수 없으므로 집합 조건을 정확히 만족한다.) 따라서 \$f(0)=c^2-4\$는 \$12\$ 또는 \$21\$이므로 최댓값은 \$21\$이다. 정답은 ②이다.

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
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "f(x)=(x-c)^2+e로 두어 분모 2{(x-c)^2+t^2+e}의 영점 소거 조건으로 e=-4, c∈{4,5} 결정",
  "decisiveStep": "허용 집합 {|t|>=2}U{0}의 경계로부터 e=-d^2=-4를 확정하고 |t|=2에서 c를 {4,5}로 제한",
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
  "crossConceptKeys": [
    "CC_QUADRATIC_VERTEX"
  ],
  "conditionKeys": [
    "COND_LEADING_COEFF"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "매개변수 t의 허용 집합 조건을 분모 영점과 분자 인수 상쇄로 번역해 이차함수 꼭짓점을 확정하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
      "극한"
    ],
    "goal": [
      "최댓값"
    ],
    "method": [
      "부정형",
      "완전제곱식",
      "인수분해"
    ],
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q17

- 형식: 서답형  
- 배점: 4



### 발문



\[단답형 1번\] 다음 극한값을 구하시오. (각 2점)

(1) \$\\displaystyle\\lim\_{x\\to3}\\frac{x^3-27}{x^2-9}\$ (2) \$\\displaystyle\\lim\_{x\\to\\infty}\\bigl(\\sqrt{x^2-3x}-x\\bigr)\$



### 선지



없음



### 정답



(1) \$\\frac{9}{2}\$, (2) \$-\\frac{3}{2}\$



### 해설



(1) 분자·분모를 인수분해하여 \$(x-3)\$을 약분한다.

\$\$\\lim\_{x\\to3}\\frac{(x-3)(x^2+3x+9)}{(x-3)(x+3)} \= \\frac{9+9+9}{3+3} \= \\frac{27}{6} \= \\frac{9}{2}\$\$

(2) 분자를 유리화한 뒤 분모·분자를 \$x\$로 나눈다.

\$\$\\lim\_{x\\to\\infty}\\frac{(x^2-3x)-x^2}{\\sqrt{x^2-3x}+x} \= \\lim\_{x\\to\\infty}\\frac{-3x}{\\sqrt{x^2-3x}+x} \= \\frac{-3}{1+1} \= \-\\frac{3}{2}\$\$

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "(1)은 0/0 인수분해 약분, (2)는 ∞-∞ 무리식 유리화 후 최고차항 나눗셈으로 각각 계산",
  "decisiveStep": "두 부정형(0/0과 ∞-∞)을 각각 인수분해와 유리화로 변형",
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
  "difficultyReason": "0/0 유리식과 ∞-∞ 무리식 극한의 기본 해법을 각각 묻는 단답형 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "극한"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "인수분해",
      "유리화",
      "부정형"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q18

- 형식: 서답형  
- 배점: 6



### 발문



\[단답형 2번\] 이차함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$f(5)\$의 값을 구하시오.

> (가) \$x\_1\<x\_2\$인 모든 실수 \$x\_1, x\_2\$에 대하여 \$x\_1 f(x\_1)+f(x\_2)\<x\_2 f(x\_2)+f(x\_1)\$이다. (나) 곡선 \$y=f(x)\$ 위의 점 \$(3, f(3))\$에서의 접선의 방정식은 \$y=-6x+30\$이다.



### 선지



없음



### 정답



\$12\$



### 해설



조건 (가)를 이항하여 정리하면 \$(x\_1-1)f(x\_1)\<(x\_2-1)f(x\_2)\$이므로 \$h(x)=(x-1)f(x)\$는 실수 전체에서 증가하는 삼차함수이다. 따라서 모든 실수 \$x\$에 대하여 \$h'(x)\\ge 0\$이다. 조건 (나)에서 \$f'(3)=-6\$, \$f(3)=-6(3)+30=12\$이므로

\$\$h'(3)=f(3)+(3-1)f'(3)=12+2(-6)=0\$\$

이다. 음이 아닌 이차함수 \$h'(x)\$가 \$x=3\$에서 \$0\$이므로 \$h'(x)=3a(x-3)^2\$ (\$a\>0\$)이다. \$f(x)=ax^2+bx+c\$로 두면 \$h'(x)=3ax^2+2(b-a)x+(c-b)=3ax^2-18ax+27a\$에서 \$b=-8a\$, \$c=19a\$이다. \$f'(3)=6a+b=-2a=-6\$이므로 \$a=3\$이고, \$f(x)=3x^2-24x+57\$이다. 따라서 \$f(5)=75-120+57=12\$이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "DERIVATIVE",
  "primaryMethod": "부등식을 (x-1)f(x) 증가함수로 해석하고 h'(3)=0을 이용해 h'(x)=3a(x-3)^2로 계수 결정",
  "decisiveStep": "h'(3)=f(3)+2f'(3)=0과 h'(x)>=0을 결합해 완전제곱 도함수 확정",
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
  "crossConceptKeys": [
    "CC_MONOTONICITY_NONNEGATIVE_DERIVATIVE"
  ],
  "conditionKeys": [],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식의 변형을 통한 증가함수 도출과 h'(3)=0을 통한 완전제곱 도함수 결정이 결합된 고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
      "접선"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "증가감소",
      "도함수",
      "곱의미분법"
    ],
    "condition": [
      "실수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q19

- 형식: 서답형  
- 배점: 5



### 발문



\[서술형 1번\] 이차함수 \$f(x)\$에 대하여 \$\\displaystyle\\lim\_{x\\to a}\\frac{f(x-2)}{(x-1){f(x)-6}}\$의 값이 \$a=1\$일 때 \$1\$이고, \$a=2\$일 때 존재하지 않는다. 이때, \$f(3)\$의 값을 구하고, 그 과정을 서술하시오.



### 선지



없음



### 정답



\$24\$



### 해설



\$a=1\$일 때 분모의 \$(x-1)\\to0\$이고 극한값이 \$1\$로 존재하므로 분자 \$\\lim\_{x\\to1}f(x-2)=f(-1)=0\$이어야 한다. 따라서 이차함수 \$f(x)=A(x+1)^2+B(x+1)\$ (\$A\\ne0\$)로 둘 수 있다. 그러면 \$f(x-2)=A(x-1)^2+B(x-1)=(x-1){A(x-1)+B}\$이다. 만약 \$f(1)=6\$이면 분모에 \$(x-1)^2\$ 인수가 생겨 극한이 \$1\$이 되려면 \$B=0\$이어야 하지만, 이때 \$4A=6\\implies A=\\frac{3}{2}\$이 되어 극한값이 \$\\frac{A}{f'(1)}=\\frac{A}{4A}=\\frac{1}{4}\\ne1\$이므로 모순이다. 따라서 \$f(1)\\ne6\$이고 \$(x-1)\$을 약분하면

\$\$\\lim\_{x\\to1}\\frac{A(x-1)+B}{f(x)-6} \= \\frac{B}{4A+2B-6} \= 1 \\implies 4A+B=6\$\$

이다. 한편 \$a=2\$일 때 극한값이 존재하지 않으려면 분모 \$f(2)-6=9A+3B-6=0\$이어야 한다. 두 식 \$4A+B=6\$, \$3A+B=2\$를 연립하면 \$A=4\$, \$B=-10\$이다. (이때 \$f(0)=A+B=-6\\ne0\$이므로 \$x\\to2\$일 때 발산한다.) 따라서 \$f(x)=4(x+1)^2-10(x+1)\$이고 \$f(3)=4\\cdot 16 - 10\\cdot 4 \= 24\$이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "LIMIT_CONTINUITY",
  "primaryMethod": "a=1 수렴 조건으로 f(-1)=0을 얻어 f(x)=A(x+1)^2+B(x+1) 설정 후 a=1, a=2 조건 연립",
  "decisiveStep": "f(1)=6인 경우 모순임을 배제하고 4A+B=6, 9A+3B-6=0 연립",
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
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "두 점에서의 극한 존재·비존재 조건과 f(1)=6 예외 분기를 모두 검증해야 하는 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
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

## Q20

- 형식: 서답형  
- 배점: 7



### 발문



\[서술형 2번\] 어떤 정수 \$a\$에 대하여 함수 \$f(x)=x^3+ax^2+x+2a+2\$가 역함수를 가지며, 그 역함수를 \$g(x)\$라 하자. 이때, 두 곡선 \$y=f(x)\$와 \$y=g(x)\$의 서로 다른 교점의 개수는 \$2\$이다. 점 \$P(4,4)\$를 지나며 곡선 \$y=f(x)\$에 접하는 서로 다른 세 접선의 접점의 \$x\$좌표의 합을 구하고, 그 과정을 서술하시오.



### 선지



없음



### 정답



\$\\frac{13}{2}\$



### 해설



삼차함수 \$f(x)\$가 역함수를 가지려면 실수 전체에서 증가해야 하므로 \$f'(x)=3x^2+2ax+1\\ge 0\$이어야 한다. 판별식 \$\\frac{D}{4}=a^2-3\\le 0\$에서 정수 \$a\$의 후보는 \$-1, 0, 1\$이다. 증가함수 \$y=f(x)\$와 역함수 \$y=g(x)\$의 교점은 직선 \$y=x\$ 위에 있으므로 \$f(x)-x=x^3+ax^2+2a+2=0\$이 서로 다른 실근을 \$2\$개 가져야 한다.

- \$a=-1\$: \$x^3-x^2=x^2(x-1)=0\$ (서로 다른 실근 \$0, 1\$로 \$2\$개)  
- \$a=0\$: \$x^3+2=0\$ (\$1\$개)  
- \$a=1\$: \$x^3+x^2+4=(x+2)(x^2-x+2)=0\$ (\$1\$개) 따라서 \$a=-1\$이고 \$f(x)=x^3-x^2+x\$이다. 접점을 \$(t, f(t))\$라 하면 접선 \$y=(3t^2-2t+1)(x-t)+(t^3-t^2+t)\$가 점 \$P(4,4)\$를 지나므로

\$\$4 \= (3t^2-2t+1)(4-t)+(t^3-t^2+t) \\implies 2t^3-13t^2+9t=0 \\implies t(2t^2-13t+9)=0\$\$

이다. 판별식 \$169-72=97\>0\$이고 \$t=0\$은 중근이 아니므로 서로 다른 세 실근을 갖는다. 따라서 세 접점의 \$x\$좌표의 합은 근과 계수의 관계에 의해 \$0+\\frac{13}{2}=\\frac{13}{2}\$이다.

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
  "primaryMethod": "역함수 존재(a^2<=3)와 y=x 교점 2개 조건으로 a=-1 확정 후 점 P(4,4)에서 그은 3접선 근의 합 계산",
  "decisiveStep": "정수 후보 {-1,0,1} 중 f(x)=x의 실근이 2개인 a=-1을 고르고 3차 방정식 근과 계수의 관계 적용",
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
    "CC_INVERSE_FUNCTION_SYMMETRY",
    "CC_VIETA_FORMULAS"
  ],
  "conditionKeys": [
    "COND_INTEGER_DOMAIN"
  ],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "역함수 존재 조건, 원함수·역함수 교점 개수, 곡선 밖 점에서의 접선 개수가 통합된 고난도 서술형이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "교점",
      "접선"
    ],
    "goal": [
      "합"
    ],
    "method": [
      "도함수",
      "접선의방정식"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 subUnitKey 미결속(bindingStatus: MISSING) 상태임"
}
```

## Q21

- 형식: 서답형  
- 배점: 8



### 발문



\[서술형 3번\] 실수 전체에서 미분가능한 두 함수 \$f(x), g(x)\$가 모든 실수 \$x, y\$에 대하여

\$\$f(x+y)=2f(x)g(y)+2f(y)g(x), \\quad 2g(x+y)=4g(x)g(y)+9f(x)f(y)\$\$

을 만족시키고 \$f(1)=\\dfrac{1}{3}\$, \$\\displaystyle\\lim\_{x\\to0}\\frac{2g(x)-1}{x}=0\$일 때, \${g(1)}^2\$의 값을 구하고, 그 과정을 서술하시오.



### 선지



없음



### 정답



\$\\frac{1}{2}\$



### 해설



\$G(x)=2g(x)\$라 두면 주어진 두 항등식은

\$\$f(x+y)=f(x)G(y)+f(y)G(x), \\quad G(x+y)=G(x)G(y)+9f(x)f(y)\$\$

이고 극한 조건에서 \$G(0)=1\$, \$G'(0)=0\$이다. 둘째 식에 \$x=y=0\$을 대입하면 \$1=1+9{f(0)}^2\$이므로 \$f(0)=0\$이다. \$c=f'(0)\$이라 두자. 도함수의 정의에 의해

\$\$\\begin{aligned} f'(x) &= \\lim\_{y\\to0}\\frac{f(x+y)-f(x)}{y} \= f(x)\\lim\_{y\\to0}\\frac{G(y)-1}{y}+G(x)\\lim\_{y\\to0}\\frac{f(y)}{y} \= cG(x) \\ G'(x) &= \\lim\_{y\\to0}\\frac{G(x+y)-G(x)}{y} \= G(x)\\lim\_{y\\to0}\\frac{G(y)-1}{y}+9f(x)\\lim\_{y\\to0}\\frac{f(y)}{y} \= 9cf(x) \\end{aligned}\$\$

이다. 따라서 \$\\left({G(x)}^2 - 9{f(x)}^2\\right)' \= 2G(x)(9cf(x)) - 18f(x)(cG(x)) \= 0\$이므로 \${G(x)}^2 - 9{f(x)}^2\$은 상수이다. \$x=0\$을 대입하면 \$1^2-0=1\$이므로 모든 실수 \$x\$에서 \${G(x)}^2 - 9{f(x)}^2 \= 1\$이다. \$x=1\$을 대입하고 \$f(1)=\\frac{1}{3}\$을 넣으면 \${G(1)}^2 - 9\\cdot\\frac{1}{9}=1 \\implies {G(1)}^2=2\$이다. \$G(1)=2g(1)\$이므로 \${g(1)}^2=\\frac{2}{4}=\\frac{1}{2}\$이다.

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
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": "H22-M1-04-DERIVATIVE_FUNCTION_DETERMINATION",
  "conceptClusterKey": "FUNCTIONS_GRAPHS",
  "primaryMethod": "G(x)=2g(x) 치환 후 도함수 정의로 f'(x)=cG(x), G'(x)=9cf(x)를 유도해 불변식 G^2-9f^2=1 도출",
  "decisiveStep": "연립 함수방정식 미분 결과로 {G(x)}^2-9{f(x)}^2의 도함수가 0인 상수 불변식 발견",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "도함수",
    "l4": "함수방정식의 미분과 불변식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_FUNCTIONAL_EQUATION",
    "templateKey": "TPL_FUNCTIONAL_EQUATION_DIFFERENTIAL_INVARIANT",
    "why": "도함수 > 함수방정식의 미분과 불변식 (DIRECT_ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "DEEP_COMPOSITE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "연립 함수방정식에서 도함수 정의를 적용해 미분 불변식을 스스로 구성해야 하는 최고난도 서술형이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "미분가능",
      "극한"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "미분계수",
      "곱의미분법"
    ],
    "condition": [
      "미분가능",
      "실수"
    ]
  },
  "hold": ""
}
```

