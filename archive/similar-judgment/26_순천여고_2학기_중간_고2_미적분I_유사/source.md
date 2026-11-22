

```
{"stem": "26_순천여고_2학기_중간_고2_미적분I_유사", "sourceArchiveFile": "original/high/h2/2mid/26_순천여고_2학기_중간_고2_미적분I.js", "examFolder": "2mid", "grade": "고2", "subject": "미적분I", "curriculum": "2022", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.5



### 발문



극한 \$\\lim\_{x\\to 2}(x^2+3x-1)\$의 값은?



### 선지



① \$9\$ ② \$5\$ ③ \$7\$ ④ \$11\$ ⑤ \$13\$



### 정답



①



### 해설



다항함수는 모든 실수에서 연속이므로 \$x=2\$를 직접 대입한다. \$\$\\lim\_{x\\to 2}(x^2+3x-1) \= 2^2 \+ 3\\cdot 2 - 1 \= 4 \+ 6 - 1 \= 9\$\$ 정답은 ①이다.

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
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "다항함수의 연속성을 이용해 x=2를 x^2+3x-1에 직접 대입해 극한값 9 계산",
  "decisiveStep": "x=2 대입 4+6-1=9",
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
  "difficultyReason": "다항식의 극한에 목표값을 단순 대입해 산출하는 1단계 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "다항함수"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q02

- 형식: 객관식  
- 배점: 3.5



### 발문



극한 \$\\lim\_{x\\to\\infty}\\dfrac{5x^2+4x-12}{2x^2-3x+15}\$의 값은?



### 선지



① \$-\\dfrac{4}{3}\$ ② \$1\$ ③ \$\\dfrac{5}{2}\$ ④ \$\\dfrac{3}{2}\$ ⑤ \$2\$



### 정답



③



### 해설



분모와 분자의 최고차항이 모두 \$x^2\$이므로 분모·분자를 \$x^2\$으로 나눈다. \$\$\\lim\_{x\\to\\infty}\\frac{5x^2+4x-12}{2x^2-3x+15} \= \\lim\_{x\\to\\infty}\\frac{5+\\frac{4}{x}-\\frac{12}{x^2}}{2-\\frac{3}{x}+\\frac{15}{x^2}} \= \\frac{5}{2}\$\$ 정답은 ③이다.

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
  "primaryMethod": "분모·분자를 x^2으로 나누어 x->무한대 극한에서 최고차항 계수비 5/2 도출",
  "decisiveStep": "동차 이차식의 계수비 5/2 읽기",
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
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "무한대 극한의 동차 유리식에서 최고차항 계수비를 바로 읽는 기본 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "유리함수"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한"
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



실수 전체의 집합에서 정의된 함수 \$f(x)=\\begin{cases}\\dfrac{x^2-9}{x+3}&(x\\ne \-3)\\a&(x=-3)\\end{cases}\$이 실수 전체의 집합에서 연속일 때, 상수 \$a\$의 값은?



### 선지



① \$-3\$ ② \$0\$ ③ \$3\$ ④ \$-9\$ ⑤ \$-6\$



### 정답



⑤



### 해설



\$x=-3\$에서 연속이려면 \$\\lim\_{x\\to \-3}f(x)=f(-3)\$이어야 한다. \$\$a \= \\lim\_{x\\to \-3}\\frac{(x-3)(x+3)}{x+3} \= \\lim\_{x\\to \-3}(x-3) \= \-6\$\$ 정답은 ⑤이다.

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
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "x=-3에서 분자 인수분해·약분 후 극한값 -6을 함숫값 a와 일치시킴",
  "decisiveStep": "(x-3)(x+3)/(x+3)=x-3 약분 후 x=-3 대입",
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
  "difficultyReason": "0/0 꼴 극한을 인수분해로 약분한 뒤 함숫값과 같게 놓는 표준 연속 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "연속",
      "인수분해"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q04

- 형식: 객관식  
- 배점: 3.5



### 발문



곡선 \$y=x^2-3x+1\$ 위의 점 \$(2,\\ \-1)\$에서의 접선의 기울기는?



### 선지



① \$-1\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$



### 정답



②



### 해설



\$y'=2x-3\$이므로 \$x=2\$에서의 접선의 기울기는 \$y'(2)=2\\cdot 2-3=1\$이다. 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "y=x^2-3x+1을 미분한 도함수 2x-3에 x=2를 대입해 접선 기울기 1 계산",
  "decisiveStep": "도함수 y'=2x-3에 x=2 대입",
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
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "이차함수를 한 번 미분해 주어진 x좌표를 대입하면 끝나는 기초 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "이차함수",
      "점"
    ],
    "goal": [
      "기울기"
    ],
    "method": [
      "도함수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q05

- 형식: 객관식  
- 배점: 4.0



### 발문



함수 \$f(x)=x^2+4x-1\$에 대하여 \$\\lim\_{h\\to 0}\\dfrac{f(1+4h)-f(1)}{3h}\$의 값은?



### 선지



① \$4\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$12\$



### 정답



④



### 해설



미분계수의 정의를 이용하기 위해 분모를 \$4h\$로 맞춘다. \$\$\\lim\_{h\\to 0}\\frac{f(1+4h)-f(1)}{3h} \= \\frac{4}{3}\\lim\_{h\\to 0}\\frac{f(1+4h)-f(1)}{4h} \= \\frac{4}{3}f'(1)\$\$ \$f'(x)=2x+4\$이므로 \$f'(1)=6\$이고, 구하는 값은 \$\\dfrac{4}{3}\\times 6=8\$이다. 정답은 ④이다.

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
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "극한식을 (4/3)f'(1)로 변형하고 f'(1)=6을 대입해 극한값 8 산출",
  "decisiveStep": "증분 4h와 분모 3h의 계수비 4/3 분리",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미분계수의 정의에서 h의 계수 비를 맞추어 도함수값과 곱하는 기본 유형이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "이차함수"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "미분계수",
      "도함수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q06

- 형식: 객관식  
- 배점: 4.0



### 발문



방정식 \$12x^3-4x^2-3x+1=0\$의 실근이 속하는 구간을 \<보기\>에서 있는 대로 고른 것은? ㄱ. \$(-2,\\ \-1)\$　ㄴ. \$(-1,\\ 0)\$ ㄷ. \$(0,\\ 1)\$　ㄹ. \$(1,\\ 2)\$



### 선지



① ㄴ, ㄷ ② ㄱ, ㄴ ③ ㄴ, ㄹ ④ ㄱ, ㄴ, ㄷ ⑤ ㄴ, ㄷ, ㄹ



### 정답



①



### 해설



좌변을 인수분해하면 다음과 같다. \$\$12x^3-4x^2-3x+1 \= 4x^2(3x-1)-(3x-1) \= (3x-1)(2x-1)(2x+1) \= 0\$\$ 따라서 실근은 \$-\\dfrac{1}{2}\$, \$\\dfrac{1}{3}\$, \$\\dfrac{1}{2}\$이다. \$-\\dfrac{1}{2}\\in(-1,\\ 0)\$이므로 ㄴ, \$\\dfrac{1}{3},\\ \\dfrac{1}{2}\\in(0,\\ 1)\$이므로 ㄷ이 참이고, ㄱ과 ㄹ에는 실근이 없다. 정답은 ①이다.

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
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "삼차방정식을 (3x-1)(2x-1)(2x+1)=0으로 인수분해해 실근 -1/2, 1/3, 1/2의 소속 구간 판별",
  "decisiveStep": "인수분해로 세 실근을 모두 구해 각 열린구간과 대조",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속함수의 성질",
    "l4": "사잇값 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_INTERMEDIATE_VALUE_APPLICATION",
    "templateKey": "TPL_IVT_VALUE_EXISTENCE_INTERVAL",
    "why": "연속함수의 성질 > 사잇값 정리 (ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "인수분해로 실근을 직접 구하거나 사잇값 정리를 적용해 근의 존재 구간을 고르는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차방정식"
    ],
    "goal": [
      "구간"
    ],
    "method": [
      "인수분해",
      "사잇값정리"
    ],
    "condition": [
      "실근"
    ]
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 4.0



### 발문



다항함수 \$f(x)\$에 대하여 곡선 \$y=f(x)\$ 위의 점 \$(1,\\ 4)\$에서의 접선의 방정식이 \$y=6x-2\$일 때, \$\\lim\_{x\\to 1}\\dfrac{f(x)-4}{x^3-1}\$의 값은?



### 선지



① \$\\dfrac{1}{3}\$ ② \$\\dfrac{2}{3}\$ ③ \$1\$ ④ \$\\dfrac{3}{2}\$ ⑤ \$2\$



### 정답



⑤



### 해설



점 \$(1,\\ 4)\$에서의 접선이 \$y=6x-2\$이므로 \$f(1)=4\$, \$f'(1)=6\$이다. \$\$\\lim\_{x\\to 1}\\frac{f(x)-4}{x^3-1} \= \\lim\_{x\\to 1}\\frac{f(x)-f(1)}{x-1}\\cdot\\frac{1}{x^2+x+1} \= f'(1)\\cdot\\frac{1}{3} \= 6\\times\\frac{1}{3} \= 2\$\$ 정답은 ⑤이다.

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
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "접선 y=6x-2에서 f(1)=4, f'(1)=6을 읽고 분모 x^3-1 인수분해로 극한값 6/3=2 계산",
  "decisiveStep": "분모 x^3-1=(x-1)(x^2+x+1) 분리 후 f'(1)=6 적용",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "접선의 기울기를 미분계수로 연결한 뒤 인수분해를 통해 극한을 계산하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "다항함수",
      "접선"
    ],
    "goal": [
      "극한"
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

## Q08

- 형식: 객관식  
- 배점: 4.0



### 발문



함수 \$f(x)=x^3-x^2+2\$의 그래프가 \$x\$축과 만나는 점을 \$A\$라 하자. 점 \$A\$에서의 접선의 방정식은?



### 선지



① \$y=4x+4\$ ② \$y=5x+5\$ ③ \$y=-5x-5\$ ④ \$y=3x+3\$ ⑤ \$y=5x-5\$



### 정답



②



### 해설



\$f(x)=x^3-x^2+2=(x+1)(x^2-2x+2)\$이고, \$x^2-2x+2=(x-1)^2+1\>0\$이므로 \$x\$축과 만나는 점은 \$A(-1,\\ 0)\$뿐이다. \$f'(x)=3x^2-2x\$이므로 \$f'(-1)=3+2=5\$이고, 접선의 방정식은 \$y=5(x+1)=5x+5\$이다. 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x^3-x^2+2=(x+1)(x^2-2x+2)에서 유일한 x절편 A(-1,0)을 구하고 f'(-1)=5로 접선 y=5x+5 도출",
  "decisiveStep": "인수정리로 교점 (-1,0) 확정 후 도함수 대입",
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
  "difficultyReason": "삼차방정식의 실근을 구해 접점을 먼저 찾은 뒤 접선의 방정식을 세우는 2단계 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수"
    ],
    "goal": [
      "접선의방정식"
    ],
    "method": [
      "인수분해",
      "도함수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q09

- 형식: 객관식  
- 배점: 4.0



### 발문



\$0\<x\<7\$에서 정의된 함수 \$y=f(x)\$의 그래프가 아래 그림과 같을 때, 다음 중 함수 \$f(x)\$에 대한 설명으로 옳지 않은 것은?



### 선지



① \$\\lim\_{x\\to 1}f(x)\$의 값이 존재한다. ② \$f'(2)\>0\$ ③ 불연속인 \$x\$의 값은 \$2\$개이다. ④ 미분가능하지 않은 \$x\$의 값은 \$2\$개이다. ⑤ \$f'(x)=0\$인 \$x\$의 값은 \$1\$개이다.



### 정답



④



### 해설



① \$x=1\$에서 좌극한과 우극한이 같으므로 극한값은 존재한다(참). ② \$x=2\$에서 그래프가 증가하므로 \$f'(2)\>0\$이다(참). ③ 불연속점은 함숫값과 극한값이 다른 \$x=1\$과 좌우극한이 다른 \$x=5\$로 \$2\$개이다(참). ④ 미분가능하지 않은 점은 불연속점 \$x=1,\\ 5\$와 뾰족한 점(첨점) \$x=3\$으로 총 \$3\$개이다(거짓). ⑤ 수평 접선을 갖는 매끈한 극값은 \$x=4\$ 하나뿐이다(참). 따라서 옳지 않은 것은 ④이다.

```
{"figureType": "piecewise_graph_0_to_7", "description": "0<x<7에서 정의된 y=f(x) 그래프: x=1 제거가능 불연속, x=2 증가, x=3 첨점, x=4 매끈한 극댓값, x=5 점프 불연속", "elements": ["open/closed dots at x=1", "increasing through x=2", "sharp corner at x=3", "smooth local maximum at x=4", "jump discontinuity at x=5"]}
```

```
{
  "sourceQid": "Q09",
  "variationType": "CONDITION",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "그래프의 x=1(제거가능 불연속), x=3(첨점), x=4(극대), x=5(점프 불연속)를 읽어 미분불능점 3개 판별",
  "decisiveStep": "불연속점 2개(x=1,5)에 첨점(x=3)을 더해 미분불능점 3개 확인",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "미분가능성과 연속",
    "l4": "그래프에서 판정"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_NONDIFFERENTIABILITY_STRUCTURE",
    "why": "미분가능성과 연속 > 그래프에서 판정"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "그래프에서 극한 존재성, 연속성, 첨점, 수평접선 개수를 종합적으로 판별하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "그래프"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "극한",
      "미분가능"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q10

- 형식: 객관식  
- 배점: 4.0



### 발문



함수 \$f(x)=\\begin{cases}x^2+ax+4&(x\>1)\\5x+b&(x\\le 1)\\end{cases}\$이 모든 실수 \$x\$에 대하여 미분가능할 때, \$a+b\$의 값은? (단, \$a,\\ b\$는 실수)



### 선지



① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$



### 정답



③



### 해설



경계 \$x=1\$에서 연속이고 좌우 미분계수가 같아야 한다. \$\$\\begin{aligned} 2(1)+a &= 5 \\implies a \= 3 \\ 1+a+4 &= 5+b \\implies 1+3+4 \= 5+b \\implies b \= 3 \\end{aligned}\$\$ 따라서 \$a+b=3+3=6\$이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x=1에서 좌우 미분계수 일치(2+a=5)와 연속 조건(5+a=5+b)을 연립해 a=3, b=3 결정",
  "decisiveStep": "미분계수 일치식과 연속 조건식 2개 연립",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "구간별 다항함수의 경계점 미분가능 조건(연속+미분계수 일치)으로 두 미정계수를 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "미분가능",
      "연속"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": ""
}
```

## Q11

- 형식: 객관식  
- 배점: 4.0



### 발문



극한 \$\\lim\_{x\\to \-\\infty}\\dfrac{\\sqrt{x^2+2x}+x}{\\sqrt{x^2+5x}+x}\$의 값은?



### 선지



① \$\\dfrac{1}{5}\$ ② \$\\dfrac{2}{5}\$ ③ \$\\dfrac{3}{5}\$ ④ \$\\dfrac{4}{5}\$ ⑤ \$1\$



### 정답



②



### 해설



\$x\<0\$일 때 \$\\sqrt{x^2}=-x\$임에 유의하여 분자와 분모를 각각 유리화한다. \$\$\\frac{\\sqrt{x^2+2x}+x}{\\sqrt{x^2+5x}+x} \= \\frac{2x}{\\sqrt{x^2+2x}-x}\\cdot\\frac{\\sqrt{x^2+5x}-x}{5x} \= \\frac{2}{5}\\cdot\\frac{\\sqrt{1+\\frac{5}{x}}+1}{\\sqrt{1+\\frac{2}{x}}+1}\$\$ \$x\\to \-\\infty\$일 때 \$\\dfrac{1}{x}\\to 0\$이므로 극한값은 \$\\dfrac{2}{5}\\cdot\\dfrac{2}{2}=\\dfrac{2}{5}\$이다. 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "x->-무한대에서 분자·분모 꼴을 각각 유리화하고 sqrt(x^2)=-x 부호를 적용해 극한값 2/5 산출",
  "decisiveStep": "분자·분모 동시 유리화 후 x<0에서 sqrt(x^2)=-x 처리",
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
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "음의 무한대 극한에서 무한대-무한대 부정형 두 개를 동시에 유리화하고 부호를 처리해야 하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "무리함수"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한",
      "유리화"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q12

- 형식: 객관식  
- 배점: 4.0



### 발문



함수 \$f(x)=\\dfrac{x^2-x-6}{\|x-3\|}\$에 대하여 \$\\lim\_{x\\to 3^+}f(x)=a\$, \$\\lim\_{x\\to 3^-}f(x)=b\$라 할 때, \$a-b\$의 값은? (단, \$a,\\ b\$는 실수)



### 선지



① \$0\$ ② \$5\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$



### 정답



④



### 해설



분자를 인수분해하면 \$x^2-x-6=(x-3)(x+2)\$이다. \$\$\\begin{aligned} a &= \\lim\_{x\\to 3^+}\\frac{(x-3)(x+2)}{x-3} \= 5 \\ b &= \\lim\_{x\\to 3^-}\\frac{(x-3)(x+2)}{-(x-3)} \= \-5 \\end{aligned}\$\$ 따라서 \$a-b=5-(-5)=10\$이다. 정답은 ④이다.

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
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "분자 (x-3)(x+2) 인수분해 후 x>3과 x<3의 절댓값 부호 분리로 a=5, b=-5 계산",
  "decisiveStep": "|x-3|의 좌우 부호 분리 후 약분",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "절댓값 기호를 포함한 0/0 꼴에서 우극한과 좌극한의 부호를 나누어 계산하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "극한",
      "절댓값"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q13

- 형식: 객관식  
- 배점: 4.4



### 발문



함수 \$f(x)\$가 모든 실수 \$x\$에 대하여 \$3x^3+2x-1\\le (x^2+1)f(x)\\le 3x^3+3x^2-2\$를 만족시킨다. \$\\lim\_{x\\to\\infty}\\dfrac{f(x)}{x}+\\lim\_{x\\to 1}f(x)\$의 값은?



### 선지



① \$5\$ ② \$3\$ ③ \$4\$ ④ \$6\$ ⑤ \$7\$



### 정답



①



### 해설



\$x^2+1\>0\$이므로 양변을 \$x^2+1\$로 나누면 \$\$\\frac{3x^3+2x-1}{x^2+1} \\le f(x) \\le \\frac{3x^3+3x^2-2}{x^2+1}\$\$ \$x\\to 1\$일 때 양 끝 식의 극한은 모두 \$\\dfrac{4}{2}=2\$이므로 \$\\lim\_{x\\to 1}f(x)=2\$이다. \$x\>0\$일 때 \$x\$로 한 번 더 나누어 \$x\\to\\infty\$ 극한을 취하면 양 끝 극한이 모두 \$3\$이므로 \$\\lim\_{x\\to\\infty}\\dfrac{f(x)}{x}=3\$이다. 따라서 구하는 합은 \$3+2=5\$이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "x^2+1>0으로 부등식을 나눈 뒤 x->1과 x->무한대 양쪽에서 대소 관계 정리로 2와 3 산출",
  "decisiveStep": "샌드위치 정리를 x->1과 x->무한대 두 극한에 각각 적용",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "극한의 성질",
    "l4": "함수의 극한의 대소 관계"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_SQUEEZE",
    "why": "극한의 성질 > 함수의 극한의 대소 관계"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "부등식을 양수로 나눈 뒤 유한 점 극한과 무한대 극한 두 가지를 모두 조임 정리로 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "부등식"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q14

- 형식: 객관식  
- 배점: 4.4



### 발문



그림과 같이 원점 \$O\$를 중심으로 하는 반지름의 길이가 \$2\$인 원이 있다. 점 \$A(-2,\\ 0)\$을 지나는 기울기가 \$t\$(\$t\>0\$)인 직선과 이 원이 만나는 \$A\$가 아닌 점을 \$B\$라 하고, 점 \$C(2,\\ 0)\$에 대하여 삼각형 \$ABC\$의 넓이를 \$S(t)\$라 하자. \$\\lim\_{t\\to\\infty}tS(t)\$의 값은?



### 선지



① \$2\$ ② \$4\$ ③ \$8\$ ④ \$12\$ ⑤ \$16\$



### 정답



③



### 해설



원 \$x^2+y^2=4\$와 직선 \$y=t(x+2)\$를 연립하면 \$\$x^2 \+ t^2(x+2)^2 \= 4 \\implies (1+t^2)x^2 \+ 4t^2x \+ 4(t^2-1) \= 0\$\$ \$x=-2\$가 한 근이므로 근과 계수의 관계에 의해 \$-2x\_B=\\dfrac{4(t^2-1)}{1+t^2}\$, 즉 \$x\_B=\\dfrac{2(1-t^2)}{1+t^2}\$이다. \$y\_B \= t(x\_B+2) \= \\dfrac{4t}{1+t^2}\>0\$이므로 삼각형 \$ABC\$의 넓이는 \$S(t)=\\dfrac{1}{2}\\cdot 4\\cdot\\dfrac{4t}{1+t^2}=\\dfrac{8t}{1+t^2}\$이다. 따라서 \$\\lim\_{t\\to\\infty}tS(t)=\\lim\_{t\\to\\infty}\\dfrac{8t^2}{1+t^2}=8\$이다. 정답은 ③이다.

```
{"figureType": "circle_chord_triangle_limit", "description": "원 x^2+y^2=4 위의 지름 양끝 A(-2,0), C(2,0)와 기울기 t인 직선이 만나는 점 B", "elements": ["circle center O radius 2", "points A(-2,0), C(2,0)", "line through A with slope t>0 meeting circle at B", "triangle ABC shaded"]}
```

```
{
  "sourceQid": "Q14",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "원 x^2+y^2=4와 직선 y=t(x+2)를 연립해 B의 y좌표 4t/(1+t^2)을 구하고 tS(t)=8t^2/(1+t^2) 극한 8 산출",
  "decisiveStep": "근과 계수의 관계로 교점 B의 좌표 (2(1-t^2)/(1+t^2), 4t/(1+t^2)) 도출",
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
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원의 방정식과 직선의 교점 좌표를 매개변수 t로 나타낸 뒤 삼각형 넓이의 무한대 극한을 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "직선",
      "삼각형"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "극한",
      "근과계수의관계"
    ],
    "condition": [
      "양수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q15

- 형식: 객관식  
- 배점: 4.4



### 발문



함수 \$f(x)\$가 \$x=0\$에서 연속일 때, \$x=0\$에서 미분가능한 함수인 것만을 \<보기\>에서 있는 대로 고른 것은? ㄱ. \$y=xf(x)\$ ㄴ. \$y=x^3f(x)\$ ㄷ. \$y=\\dfrac{1}{2+xf(x)}\$



### 선지



① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ



### 정답



⑤



### 해설



\$f\$가 \$x=0\$에서 연속이므로 \$\\lim\_{h\\to 0}f(h)=f(0)\$이다. ㄱ. \$\\lim\_{h\\to 0}\\dfrac{hf(h)-0}{h}=\\lim\_{h\\to 0}f(h)=f(0)\$으로 존재한다(참). ㄴ. \$\\lim\_{h\\to 0}\\dfrac{h^3f(h)-0}{h}=\\lim\_{h\\to 0}h^2f(h)=0\$으로 존재한다(참). ㄷ. \$g(x)=\\dfrac{1}{2+xf(x)}\$라 하면 \$g(0)=\\dfrac{1}{2}\$이고, \$\$\\lim\_{h\\to 0}\\frac{\\frac{1}{2+hf(h)}-\\frac{1}{2}}{h} \= \\lim\_{h\\to 0}\\frac{-hf(h)}{2h{2+hf(h)}} \= \-\\frac{f(0)}{4}\$\$ 이므로 존재한다(참). 따라서 ㄱ, ㄴ, ㄷ 모두 미분가능하다. 정답은 ⑤이다.

```
"NONE"
```

```
{
  "sourceQid": "Q15",
  "variationType": "CONDITION",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x=0 연속 조건 lim f(h)=f(0)을 이용해 세 함수의 미분계수 극한 (g(h)-g(0))/h 존재 여부 직접 판정",
  "decisiveStep": "세 식 모두 (g(h)-g(0))/h에서 인자 h가 약분되어 f(0) 극한으로 수렴 확인",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "미분가능성과 연속",
    "l4": "미분가능 조건"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION",
    "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION",
    "why": "미분가능성과 연속 > 미분가능 조건"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미분가능성이 보장되지 않은 연속함수 f(x)와의 결합 식을 미분계수의 정의로 엄밀히 검증해야 하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "미분가능"
    ],
    "method": [
      "미분계수",
      "연속"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q16

- 형식: 객관식  
- 배점: 4.4



### 발문



최고차항의 계수가 \$1\$인 삼차함수 \$f(x)\$에 대하여 곡선 \$y=f(x)\$ 위의 점 \$(-2,\\ f(-2))\$에서의 접선 \$\\ell\$이 점 \$(3,\\ f(3))\$을 지난다. 접선 \$\\ell\$의 방정식을 \$y=g(x)\$라 할 때, \$\\lim\_{x\\to 3}\\dfrac{f(x)-g(x)}{x-3}\$의 값은?



### 선지



① \$16\$ ② \$25\$ ③ \$20\$ ④ \$30\$ ⑤ \$36\$



### 정답



②



### 해설



\$y=g(x)\$가 \$x=-2\$에서 \$f(x)\$에 접하고 \$x=3\$에서 만나므로 \$f(x)-g(x)=(x+2)^2(x-3)\$이다. \$\$\\lim\_{x\\to 3}\\frac{f(x)-g(x)}{x-3} \= \\lim\_{x\\to 3}(x+2)^2 \= (3+2)^2 \= 25\$\$ 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "접선과 교점 조건으로 f(x)-g(x)=(x+2)^2(x-3)을 세워 약분 후 x=3 대입해 25 산출",
  "decisiveStep": "차함수 f(x)-g(x)=(x+2)^2(x-3) 인수분해식 작성",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "접선",
    "l4": "두 곡선의 접선"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_TANGENT_DERIVATIVE",
    "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY",
    "why": "접선 > 두 곡선의 접선"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼차함수와 접선의 차를 중근과 일차인수의 곱으로 세워 극한을 단번에 계산하는 구조 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "접선"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "인수분해",
      "접선의방정식"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q17

- 형식: 객관식  
- 배점: 4.4



### 발문



곡선 \$y=x^2-5x\$ 위의 서로 다른 두 점 \$A,\\ B\$에서의 접선이 점 \$(3,\\ k)\$에서 만난다. 두 점 \$A,\\ B\$의 \$x\$좌표의 차가 \$6\$일 때, 실수 \$k\$의 값은?



### 선지



① \$-15\$ ② \$-12\$ ③ \$-9\$ ④ \$-6\$ ⑤ \$-3\$



### 정답



①



### 해설



곡선 \$y=x^2-5x\$ 위의 점 \$(t,\\ t^2-5t)\$에서의 접선은 \$y=(2t-5)(x-t)+t^2-5t=(2t-5)x-t^2\$이다. 이 직선이 \$(3,\\ k)\$를 지나므로 \$k=3(2t-5)-t^2=-(t-3)^2-6\$이다. 두 접점의 \$x\$좌표 \$t\_1,\\ t\_2\$는 이차방정식 \$(t-3)^2=-6-k\$의 두 근이므로 \$t\_1+t\_2=6\$이고, \$\|t\_1-t\_2\|=6\$이므로 두 근은 \$0\$과 \$6\$이다. 따라서 \$k=-(0-3)^2-6=-15\$이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "접선 방정식에 (3,k)를 대입해 t에 대한 이차식 k=-(t-3)^2-6을 얻고 두 근 차 6으로 t=0,6 및 k=-15 결정",
  "decisiveStep": "두 접점 x좌표의 대칭축 t=3과 차 6에서 t_1=0, t_2=6 확정",
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
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "외부 점을 지나는 두 접선의 접점 x좌표를 매개변수 t의 이차방정식 두 근으로 해석해 역산하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
      "접선"
    ],
    "goal": [
      "상수"
    ],
    "method": [
      "접선의방정식",
      "근과계수의관계"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q18

- 형식: 서답형  
- 배점: 4.0



### 발문



\[서답형 1\] 미분가능한 함수 \$f(x)\$가 모든 실수 \$x,\\ y\$에 대하여 \$f(x+y)=f(x)+f(y)-6xy\$를 만족시키고 \$f'(0)=12\$일 때, \$f'(1)\$의 값을 구하시오.



### 선지



없음



### 정답



6



### 해설



\$x=y=0\$을 대입하면 \$f(0)=2f(0) \\implies f(0)=0\$이다. \$\$f'(x) \= \\lim\_{h\\to 0}\\frac{f(x+h)-f(x)}{h} \= \\lim\_{h\\to 0}\\frac{f(h)-6xh}{h} \= f'(0)-6x \= 12-6x\$\$ 따라서 \$f'(1)=12-6=6\$이다.

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
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": "H22-M1-04-DERIVATIVE_FUNCTION_DETERMINATION",
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "f(0)=0을 구한 뒤 도함수 정의에 f(x+h)-f(x)=f(h)-6xh를 대입해 f'(x)=12-6x 및 f'(1)=6 도출",
  "decisiveStep": "미분계수 정의식으로 f'(x)=f'(0)-6x 도출",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "도함수",
    "l4": "함수방정식의 미분과 불변식"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_FUNCTIONAL_EQUATION",
    "templateKey": "TPL_FUNCTIONAL_EQUATION_DIFFERENTIAL_INVARIANT",
    "why": "도함수 > 함수방정식의 미분과 불변식 (ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "함수방정식에서 도함수 정의를 직접 전개해 f'(x)를 구하는 표준 서답형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "미분계수"
    ],
    "method": [
      "도함수",
      "미분계수"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": ""
}
```

## Q19

- 형식: 서답형  
- 배점: 5.0



### 발문



\[서답형 2\] 최고차항의 계수가 \$1\$인 사차함수 \$f(x)\$와 실수 전체의 집합에서 연속인 함수 \$g(x)\$가 \$x\\ne 1\$, \$x\\ne 4\$인 모든 실수 \$x\$에 대하여 \$g(x)=\\dfrac{f(x)}{(x-1)(x-4)}\$를 만족시킨다. \$g(1)=5\$, \$g(4)=17\$일 때, \$f(0)\$의 값을 구하시오.



### 선지



없음



### 정답



20



### 해설



\$g(x)\$가 \$x=1,\\ 4\$에서 연속이므로 \$f(1)=f(4)=0\$이다. \$f(x)=(x-1)(x-4)(x^2+ax+b)\$로 놓으면 \$x\\ne 1,\\ 4\$에서 \$g(x)=x^2+ax+b\$이다. \$\$\\begin{aligned} g(1) &= 1+a+b \= 5 \\implies a+b \= 4 \\ g(4) &= 16+4a+b \= 17 \\implies 4a+b \= 1 \\end{aligned}\$\$ 두 식을 연립하면 \$3a=-3 \\implies a=-1\$, \$b=5\$이므로 \$f(0)=(-1)(-4)\\cdot 5=20\$이다.

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
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "분모 0 인수로 f(1)=f(4)=0을 얻어 f(x)=(x-1)(x-4)(x^2+ax+b)로 두고 g(1)=5, g(4)=17 연립",
  "decisiveStep": "g(x)=x^2+ax+b의 두 점 함숫값 연립으로 a=-1, b=5 결정",
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
  "difficultyReason": "유리식의 연속성으로부터 사차함수의 두 일차인수를 추출하고 나머지 이차식의 계수를 연립해 구하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "사차함수",
      "유리함수"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "연속",
      "인수분해"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q20

- 형식: 서답형  
- 배점: 6.0



### 발문



\[서답형 3\] (단답) 함수 \$f(x)=\\begin{cases}(x-3)^2&(x\\ge 0)\\-(x+3)^2+18&(x\<0)\\end{cases}\$과 정수 \$k\$에 대하여 \$g(x)=\\begin{cases}f(x)&(x\\ge k)\\-f(x)&(x\<k)\\end{cases}\$라 하자. 실수 \$t\$에 대하여 함수 \$y=g(x)\$의 그래프와 직선 \$y=t\$가 만나는 점의 개수를 \$h(t)\$라 할 때, 다음 조건을 만족시키는 정수 \$k\$의 최댓값을 \$M\$, 최솟값을 \$m\$이라 하자. \$Mm\$의 값을 구하시오. \<조건\> \$\\left\|h(a)-\\lim\_{t\\to \-a^-}h(t)\\right\|=4\$를 만족시키는 실수 \$a\$가 존재한다.



### 선지



없음



### 정답



32



### 해설



\$g(x)\$는 \$x\<k\$에서 \$f(x)\$의 부호가 반전된 함수이다. \$h(t)\$의 최댓값이 \$4\$가 되려면 \$t\$가 \$18\$에 가까운 값일 때 네 개의 교점이 생겨야 한다. ① \$k\\le \-9\$: \$x\<k\$에서 \$g(x)=(x+3)^2-18\\ge 18\$이므로 \$t\<18\$에서 교점이 최대 \$3\$개이다. ② \$-3\\le k\<0\$: \$k\\le x\<0\$에서 \$f(x)\$가 단조증가하므로 \$t\<18\$에서 교점이 최대 \$3\$개이다. ③ \$k\\ge 0\$: \$t\<0\$에서 \$x\<0\$ 구간 교점은 \$\[-18,\\ \-9)\$에, \$0\\le x\<k\$ 구간 교점은 \$\[-9,\\ 0\]\$에 분리되어 최대 \$3\$개이다. ④ \$-9\<k\<-3\$: \$t\\to 18^-\$일 때 \$x\<k\$에서 \$1\$개, \$k\\le x\<0\$에서 꼭짓점 \$(-3,\\ 18)\$ 좌우로 \$2\$개, \$x\\ge 0\$에서 \$1\$개로 \$\\lim\_{t\\to 18^-}h(t)=4\$이고, \$a=-18\$에서 \$h(-18)=0\$이므로 \$\|0-4\|=4\$가 성립한다. 따라서 가능한 정수는 \$k=-8,\\ \-7,\\ \-6,\\ \-5,\\ \-4\$이므로 \$M=-4\$, \$m=-8\$이고 \$Mm=32\$이다.

```
{"figureType": "piecewise_parabola_reflection", "description": "x>=0에서 (x-3)^2, x<0에서 -(x+3)^2+18인 f(x)의 그래프", "elements": ["right branch parabola vertex (3,0)", "left branch inverted parabola vertex (-3,18) meeting at (0,9)", "horizontal line y=t"]}
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
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "k 구간을 나누어 y=t 교점 개수 h(t)가 4에 수렴하는 범위 -9<k<-3을 찾고 a=-18에서 |0-4|=4 확인",
  "decisiveStep": "x<k 반전 그래프와 (-3,18) 꼭짓점 좌우 교점이 공존하는 -9<k<-3 범위 확정",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 극한",
    "l3": "무한대에서의 극한",
    "l4": "그래프 해석"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_LIMIT_VALUE_CALC",
    "templateKey": "TPL_LIMIT_GRAPH_DIRECTION_READ",
    "why": "무한대에서의 극한 > 그래프 해석"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "경계 k에 따라 구간이 반전되는 함수의 수평선 교점 개수 함수 h(t)의 극한과 함숫값 차가 4가 되는 정수 범위를 전수 분류해야 하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "함수",
      "직선",
      "정수"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "그래프",
      "극한"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q21

- 형식: 서답형  
- 배점: 5.0



### 발문



\[서답형 4\] (서술) 닫힌구간 \$\[0,\\ 4\]\$에서 연속인 함수 \$f(x)\$가 다음 조건을 만족시킬 때, 방정식 \$f(x+1)=f(x)\$는 열린구간 \$(0,\\ 3)\$에서 적어도 \$3\$개의 실근을 가짐을 보이시오. (가) \$f(0)=f(4)\$ (나) \$f(1)-f(0)=4\$, \$f(2)-f(1)=-5\$, \$f(3)-f(2)=3\$



### 선지



없음



### 정답



적어도 3개의 실근



### 해설



\$F(x)=f(x+1)-f(x)\$라 두면 \$f\$가 \$\[0,\\ 4\]\$에서 연속이므로 \$F\$는 \$\[0,\\ 3\]\$에서 연속이다. \$\$\\begin{aligned} F(0) &= f(1)-f(0) \= 4 \> 0 \\ F(1) &= f(2)-f(1) \= \-5 \< 0 \\ F(2) &= f(3)-f(2) \= 3 \> 0 \\ F(3) &= f(4)-f(3) \= f(0)-f(3) \= \-(4-5+3) \= \-2 \< 0 \\end{aligned}\$\$ 따라서 사잇값 정리에 의해 \$(0,\\ 1)\$, \$(1,\\ 2)\$, \$(2,\\ 3)\$에 \$F(x)=0\$인 실근이 각각 적어도 하나씩 존재하므로 열린구간 \$(0,\\ 3)\$에서 적어도 \$3\$개의 서로 다른 실근을 가진다.

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
  "subUnitKey": "H22-M1-02-INTERMEDIATE_VALUE",
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "F(x)=f(x+1)-f(x)를 도입해 F(0)=4, F(1)=-5, F(2)=3, F(3)=-2의 부호 교대를 사잇값 정리로 증명",
  "decisiveStep": "f(4)=f(0)을 이용해 F(3)=-(4-5+3)=-2<0 도출",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속함수의 성질",
    "l4": "사잇값 정리"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_INTERMEDIATE_VALUE_APPLICATION",
    "templateKey": "TPL_IVT_VALUE_EXISTENCE_INTERVAL",
    "why": "연속함수의 성질 > 사잇값 정리 (ACTIVE)"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "차함수 F(x)=f(x+1)-f(x)를 설정하고 네 경계점의 부호 변화를 계산해 사잇값 정리를 서술하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수",
      "구간"
    ],
    "goal": [
      "실근"
    ],
    "method": [
      "사잇값정리"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": ""
}
```

## Q22

- 형식: 서답형  
- 배점: 6.0



### 발문



\[서답형 5\] (서술) 그림과 같이 함수 \$f(x)=x^3\$의 그래프로 나타낼 수 있는 해안선이 있다. 곡선 위의 점 \$A(2,\\ f(2))\$에서 이 해안선에 접하도록 하는 직선 다리를 건설하려고 한다. \$A\$가 아닌 접점을 \$B\$라 할 때, 점 \$B\$의 좌표와 선분 \$AB\$의 길이를 구하는 풀이과정과 답을 서술하시오.



### 선지



없음



### 정답



\$B(-1,\\ \-1)\$, \$3\\sqrt{10}\$



### 해설



\$A(2,\\ 8)\$이고 접점 \$B\$의 좌표를 \$(u,\\ u^3)\$ (\$u\\ne 2\$)이라 하면 \$f'(x)=3x^2\$이므로 접선의 방정식은 다음과 같다. \$\$y - u^3 \= 3u^2(x-u) \\implies y \= 3u^2x - 2u^3\$\$ 이 직선이 \$A(2,\\ 8)\$을 지나므로 \$\$8 \= 6u^2 - 2u^3 \\implies u^3 - 3u^2 \+ 4 \= (u-2)^2(u+1) \= 0\$\$ \$u\\ne 2\$이므로 \$u=-1\$, 즉 \$B(-1,\\ \-1)\$이다. 따라서 선분 \$AB\$의 길이는 \$\\sqrt{(2-(-1))^2+(8-(-1))^2}=\\sqrt{9+81}=\\sqrt{90}=3\\sqrt{10}\$이다.

```
{"figureType": "cubic_tangent_from_curve_point", "description": "y=x^3 그래프 위의 점 A(2,8)에서 곡선에 그은 다른 접점 B(-1,-1)과 선분 AB", "elements": ["cubic curve y=x^3", "point A(2,8) in Q1", "tangent line from A to B(-1,-1) in Q3"]}
```

```
{
  "sourceQid": "Q22",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "접점 B(u,u^3)에서의 접선에 A(2,8)을 대입해 (u-2)^2(u+1)=0으로 B(-1,-1)을 구하고 거리 3sqrt(10) 계산",
  "decisiveStep": "삼차방정식 u^3-3u^2+4=(u-2)^2(u+1)=0에서 u=-1 선택",
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
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "곡선 위의 점에서 곡선에 다시 그은 접선의 접점을 삼차방정식 인수분해로 구한 뒤 두 점 사이 거리까지 계산하는 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "점"
    ],
    "goal": [
      "좌표",
      "거리"
    ],
    "method": [
      "접선의방정식",
      "인수분해"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q23

- 형식: 서답형  
- 배점: 6.0



### 발문



\[서답형 6\] (서술) 그림과 같이 좌표평면 위의 원점 \$O\$와 세 점 \$A(4,\\ 0)\$, \$B(4,\\ 4)\$, \$C(0,\\ 4)\$를 꼭짓점으로 하는 정사각형 \$OABC\$가 있다. 양수 \$t\$에 대하여 직선 \$y=tx\$에 의해 나누어지는 정사각형 \$OABC\$의 두 영역 중 점 \$A\$를 포함하는 영역의 넓이를 \$S(t)\$라 하자. 함수 \$S(t)\$와 극한 \$\\lim\_{t\\to 2}\\dfrac{S(t)-S(2)}{t-2}+\\lim\_{t\\to 0^+}\\dfrac{S(t)}{t}\$의 값을 구하는 풀이과정과 답을 서술하시오.



### 선지



없음



### 정답



\$S(t)=\\begin{cases}8t&(0\<t\\le 1)\\16-\\dfrac{8}{t}&(t\\ge 1)\\end{cases}\$, \$10\$



### 해설



직선 \$y=tx\$가 변 \$AB\$와 만나는 경우(\$0\<t\\le 1\$) 교점은 \$(4,\\ 4t)\$이므로 \$S(t)=\\dfrac{1}{2}\\cdot 4\\cdot 4t=8t\$이다. 변 \$BC\$와 만나는 경우(\$t\\ge 1\$) 교점은 \$\\left(\\dfrac{4}{t},\\ 4\\right)\$이므로 \$S(t)=16-\\dfrac{1}{2}\\cdot 4\\cdot\\dfrac{4}{t}=16-\\dfrac{8}{t}\$이다. 따라서 \$S(2)=16-4=12\$이고 각 극한은 다음과 같다. \$\$\\begin{aligned} \\lim\_{t\\to 2}\\frac{S(t)-S(2)}{t-2} &= \\lim\_{t\\to 2}\\frac{16-\\frac{8}{t}-12}{t-2} \= \\lim\_{t\\to 2}\\frac{4(t-2)}{t(t-2)} \= \\frac{4}{2} \= 2 \\ \\lim\_{t\\to 0^+}\\frac{S(t)}{t} &= \\lim\_{t\\to 0^+}\\frac{8t}{t} \= 8 \\end{aligned}\$\$ 구하는 값은 \$2+8=10\$이다.

```
{"figureType": "square_area_by_line", "description": "O(0,0), A(4,0), B(4,4), C(0,4) 정사각형과 원점을 지나는 직선 y=tx", "elements": ["square OABC side 4", "ray y=tx from O", "shaded region containing A"]}
```

```
{
  "sourceQid": "Q23",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "t=1을 경계로 넓이 S(t)를 구간별 식으로 세운 뒤 t->2와 t->0+ 극한을 각각 계산해 2+8=10 산출",
  "decisiveStep": "t<=1(삼각형 8t)과 t>=1(여집합 사다리꼴 16-8/t) 구간 분할",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "미분계수와 도함수",
    "l3": "미분계수",
    "l4": "평균변화율·순간변화율"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RATE_RELATION",
    "templateKey": "TPL_AVERAGE_RATE_DERIVATIVE_LINK",
    "why": "미분계수 > 평균변화율·순간변화율"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "직선 기울기 t의 범위에 따라 넓이 함수 S(t)를 직접 구간 분할해 세우고 두 극한(미분계수 꼴 포함)을 계산하는 최고난도 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "정사각형",
      "직선"
    ],
    "goal": [
      "함수",
      "극한"
    ],
    "method": [
      "넓이",
      "극한"
    ],
    "condition": [
      "양수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

