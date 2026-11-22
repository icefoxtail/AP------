

```
{"stem": "26_팔마고_2학기_중간_고2_미적분I_유사", "sourceArchiveFile": "original/high/h2/2mid/26_팔마고_2학기_중간_고2_미적분I.js", "examFolder": "2mid", "grade": "고2", "subject": "미적분I", "curriculum": "2022", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.3



### 발문



곡선 \$y=-x^2+10x-3\$ 위의 점 \$(1,\\ 6)\$에서의 접선의 기울기는?



### 선지



① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$



### 정답



④



### 해설



\$y'=-2x+10\$이므로 \$x=1\$에서의 접선의 기울기는 \$y'(1)=-2(1)+10=8\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "y=-x^2+10x-3을 미분한 y'=-2x+10에 x=1을 대입해 접선 기울기 8 계산",
  "decisiveStep": "y'(1) = -2 + 10 = 8",
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
  "difficultyReason": "이차함수를 미분해 접점의 x좌표를 대입하면 바로 기울기가 나오는 기초 문항이다.",
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

## Q02

- 형식: 객관식  
- 배점: 3.4



### 발문



다음 \<보기\>의 극한 중 극한값이 존재하는 것만을 있는 대로 고른 것은? ㄱ. \$\\lim\_{x\\to 3}\\left(4-\\dfrac{5}{x-3}\\right)\$ ㄴ. \$\\lim\_{x\\to 3}(x^2-4x+7)\$ ㄷ. \$\\lim\_{x\\to 0}\\dfrac{\\sqrt{x+9}-3}{x}\$



### 선지



① ㄱ ② ㄴ, ㄷ ③ ㄴ ④ ㄱ, ㄴ ⑤ ㄱ, ㄴ, ㄷ



### 정답



②



### 해설



ㄱ. \$x\\to 3^+\$와 \$x\\to 3^-\$에서 부호가 반대로 발산하므로 극한값이 없다. ㄴ. 다항함수이므로 \$3^2-4\\cdot 3+7=4\$로 수렴한다. ㄷ. 분자를 유리화하면 \$\\lim\_{x\\to 0}\\dfrac{1}{\\sqrt{x+9}+3}=\\dfrac{1}{6}\$로 수렴한다. 정답은 ②이다.

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
  "primaryMethod": "분수 발산(ㄱ), 다항식 대입(ㄴ), 무리식 유리화(ㄷ)로 극한 존재 여부 ㄴ, ㄷ 판별",
  "decisiveStep": "ㄱ 발산 확인 및 ㄷ 유리화로 수렴값 1/6 확인",
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
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "발산하는 분수 극한과 수렴하는 다항식·유리화 극한을 구별하는 기본 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "극한"
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

## Q03

- 형식: 객관식  
- 배점: 3.5



### 발문



극한 \$\\lim\_{x\\to 3}\\dfrac{x^2+x-12}{x-3}\$의 값은?



### 선지



① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$



### 정답



⑤



### 해설



\$\$\\lim\_{x\\to 3}\\frac{(x+4)(x-3)}{x-3}=\\lim\_{x\\to 3}(x+4)=7\$\$ 정답은 ⑤이다.

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
  "primaryMethod": "분자 x^2+x-12=(x+4)(x-3) 인수분해 후 약분해 x=3 대입으로 7 산출",
  "decisiveStep": "(x+4)(x-3)/(x-3) 약분 후 x=3 대입",
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
  "difficultyReason": "0/0 꼴 이차식 분자를 인수분해해 약분하는 가장 기초적인 극한 문항이다.",
  "level": "하",
  "item4slot": {
    "given": [
      "유리함수"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "인수분해",
      "극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q04

- 형식: 객관식  
- 배점: 3.9



### 발문



함수 \$f(x)=\\begin{cases}x^2+ax&(x\<2)\\-bx^2&(x\\ge 2)\\end{cases}\$이 \$x=2\$에서 미분가능할 때, 두 상수 \$a,\\ b\$에 대하여 \$a-b\$의 값은?



### 선지



① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$



### 정답



①



### 해설



\$x=2\$에서 연속이므로 \$4+2a=-4b \\implies a+2b=-2\$이다. 좌·우미분계수가 같으므로 \$4+a=-4b \\implies a+4b=-4\$이다. 두 식을 빼면 \$2b=-2 \\implies b=-1\$, \$a=0\$이므로 \$a-b=0-(-1)=1\$이다. 정답은 ①이다.

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
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x=2 연속 조건 a+2b=-2와 미분계수 일치 조건 a+4b=-4를 연립해 a=0, b=-1 결정",
  "decisiveStep": "연속식과 미분계수 일치식 연립으로 b=-1, a=0 산출",
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
  "difficultyReason": "경계점에서의 연속 조건과 좌·우미분계수 일치 조건을 연립해 두 상수를 구하는 문항이다.",
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

## Q05

- 형식: 객관식  
- 배점: 4



### 발문



이차함수 \$f(x)\$가 다음 두 조건을 모두 만족시킬 때, \$f(3)\$의 값은? (가) \$f(0)=4\$ (나) \$\\lim\_{x\\to 1}\\dfrac{f(x)}{x-1}=3\$



### 선지



① \$22\$ ② \$28\$ ③ \$34\$ ④ \$40\$ ⑤ \$46\$



### 정답



③



### 해설



(나)에서 \$f(1)=0,\\ f'(1)=3\$이므로 \$f(x)=A(x-1)^2+3(x-1)\$로 놓을 수 있다. \$f(0)=A-3=4 \\implies A=7\$이므로 \$f(3)=7(3-1)^2+3(3-1)=28+6=34\$이다. 정답은 ③이다.

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
  "primaryMethod": "극한 조건에서 f(1)=0, f'(1)=3을 읽어 f(x)=A(x-1)^2+3(x-1)을 세운 뒤 f(0)=4로 A=7 결정",
  "decisiveStep": "f(1)=0, f'(1)=3을 이용해 (x-1) 중심으로 이차식 설정",
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
  "difficultyReason": "0/0 꼴 극한에서 함숫값과 미분계수를 동시에 읽어 이차함수를 결정하는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "이차함수",
      "극한"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "미분계수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q06

- 형식: 객관식  
- 배점: 4.1



### 발문



\$x=2\$에서 미분가능하지 않은 함수만을 \<보기\>에서 있는 대로 고른 것은? ㄱ. \$f(x)=\|x-2\|\$ ㄴ. \$f(x)=\|x\|^2-2\|x\|\$ ㄷ. \$f(x)=\|x(x-2)^2\|\$



### 선지



① ㄴ ② ㄷ ③ ㄱ, ㄴ ④ ㄱ ⑤ ㄱ, ㄷ



### 정답



④



### 해설



ㄱ. \$x=2\$에서 좌미분계수 \$-1\$, 우미분계수 \$1\$로 다르므로 미분가능하지 않다. ㄴ. \$x=2\$ 근방(\$x\>0\$)에서 \$x^2-2x\$이므로 미분가능하다. ㄷ. \$x=2\$ 근방(\$x\>0\$)에서 \$x(x-2)^2\$이므로 미분가능하다. 정답은 ④이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x=2 근방의 부호를 조사해 일차 절댓값 ㄱ만 좌우미분계수가 다름을 판별",
  "decisiveStep": "x=2 근방에서 ㄴ, ㄷ은 다항식과 일치함 확인",
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
  "difficultyReason": "절댓값 함수의 부호 변화 지점이 x=2인지 확인해 미분가능성을 판정하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "미분가능"
    ],
    "method": [
      "절댓값",
      "미분계수"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q07

- 형식: 객관식  
- 배점: 4.2



### 발문



함수 \$f(x)=-x^3+6x^2-ax+2\$에 대하여 \<보기\>에서 옳은 것만을 있는 대로 고른 것은? ㄱ. \$a=12\$일 때, 함수 \$f(x)\$는 실수 전체에서 감소한다. ㄴ. \$a=12\$일 때, 닫힌구간 \$\[0,\\ 3\]\$에서 평균값 정리를 만족시키는 상수는 \$3\$이다. ㄷ. 열린구간 \$(0,\\ 3)\$에서 \$f(x)\$가 극댓값과 극솟값을 모두 갖도록 하는 실수 \$a\$의 값의 범위는 \$a\<12\$이다.



### 선지



① ㄴ ② ㄱ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ



### 정답



②



### 해설



\$f'(x)=-3x^2+12x-a=12-a-3(x-2)^2\$이다. ㄱ. \$a=12\$이면 \$f'(x)=-3(x-2)^2\\le 0\$이므로 실수 전체에서 감소한다(참). ㄴ. \$a=12\$일 때 \$\\dfrac{f(3)-f(0)}{3-0}=\\dfrac{-7-2}{3}=-3\$이므로 \$f'(c)=-3(c-2)^2=-3\$에서 \$c\\in(0,\\ 3)\$인 값은 \$c=1\$뿐이다(거짓). ㄷ. 두 극값이 \$(0,\\ 3)\$에 모두 있으려면 \$0\<\\sqrt{4-\\frac{a}{3}}\<1\$, 즉 \$9\<a\<12\$여야 한다(거짓). 정답은 ②이다.

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
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "도함수 f'(x)=12-a-3(x-2)^2을 이용해 감소 조건(ㄱ 참), 열린구간 평균값 정리 c=1(ㄴ 거짓), 근의 분리 9<a<12(ㄷ 거짓) 판별",
  "decisiveStep": "평균값 정리 상수 c in (0,3) 제한과 극값 위치 0<sqrt(4-a/3)<1 확인",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "증가·감소와 극값",
    "l4": "증감표"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_MONOTONICITY",
    "templateKey": "TPL_MONOTONICITY_DIRECT",
    "why": "증가·감소와 극값 > 증감표"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼차함수의 단조감소, 열린구간 내 평균값 정리 상수 조건, 제한 구간 내 극값 존재 범위를 모두 따져야 하는 합답형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "구간"
    ],
    "goal": [
      "함수"
    ],
    "method": [
      "도함수",
      "평균값정리"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q08

- 형식: 객관식  
- 배점: 4.4



### 발문



함수 \$f(x)=x^3+ax^2+2ax-7\$이 극값을 가지지 않도록 하는 정수 \$a\$의 개수는?



### 선지



① \$7\$ ② \$5\$ ③ \$6\$ ④ \$8\$ ⑤ \$9\$



### 정답



①



### 해설



\$f'(x)=3x^2+2ax+2a\$가 중근 또는 허근을 가져야 하므로 \$\\dfrac{D}{4}=a^2-6a\\le 0 \\implies 0\\le a\\le 6\$이다. 따라서 정수 \$a\$는 \$0,\\ 1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6\$의 \$7\$개이다. 정답은 ①이다.

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
  "primaryMethod": "도함수 3x^2+2ax+2a의 판별식 D/4=a^2-6a<=0에서 0<=a<=6 정수 7개 계산",
  "decisiveStep": "D/4 = a(a-6) <= 0 부등식 풀이",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "증가·감소와 극값",
    "l4": "극대·극소"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "why": "증가·감소와 극값 > 극대·극소"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "삼차함수가 극값을 갖지 않을 조건 D<=0을 이차부등식으로 푸는 표준 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "삼차함수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "도함수",
      "판별식"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q09

- 형식: 객관식  
- 배점: 4.5



### 발문



함수 \$f(x)\$가 모든 실수 \$x\$에 대하여 \$-3x^2+4x\\le f(x)\\le 3x^2+4x\$를 만족시킬 때, 극한값 \$\\lim\_{x\\to 0^+}\\dfrac{{f(x)}^2}{6x^2-xf(x)}\$의 값은?



### 선지



① \$2\$ ② \$4\$ ③ \$6\$ ④ \$12\$ ⑤ \$8\$



### 정답



⑤



### 해설



\$x\>0\$에서 \$-3x+4\\le\\dfrac{f(x)}{x}\\le 3x+4\$이므로 조임정리에 의해 \$\\lim\_{x\\to 0^+}\\dfrac{f(x)}{x}=4\$이다. \$\$\\lim\_{x\\to 0^+}\\frac{{f(x)}^2}{6x^2-xf(x)} \= \\lim\_{x\\to 0^+}\\frac{\\left(\\frac{f(x)}{x}\\right)^2}{6-\\frac{f(x)}{x}} \= \\frac{4^2}{6-4} \= 8\$\$ 정답은 ⑤이다.

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
  "standardUnitKey": "H22-M1-01",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_LIMIT",
  "primaryMethod": "x>0으로 부등식을 나누어 f(x)/x->4를 얻은 뒤 분모·분자를 x^2으로 나누어 16/2=8 산출",
  "decisiveStep": "lim_{x->0+} f(x)/x = 4 도출 후 x^2으로 나누기",
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
  "difficultyReason": "조임정리로 f(x)/x의 극한을 구한 뒤 동차 유리식 형태로 극한값을 계산하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "부등식"
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

## Q10

- 형식: 객관식  
- 배점: 4.6



### 발문



최고차항의 계수가 \$1\$인 이차함수 \$y=f(x)\$의 그래프가 \$x\$축에 접한다. 함수 \$g(x)=(x-4)f'(x)\$에 대하여 곡선 \$y=g(x)\$가 \$y\$축에 대하여 대칭일 때, \$g(0)\$의 값은?



### 선지



① \$-16\$ ② \$-24\$ ③ \$-32\$ ④ \$16\$ ⑤ \$32\$



### 정답



③



### 해설



\$f(x)=(x-p)^2\$이라 하면 \$f'(x)=2(x-p)\$이므로 \$g(x)=2(x-4)(x-p)=2x^2-2(p+4)x+8p\$이다. \$y\$축 대칭이므로 일차항 계수 \$p+4=0 \\implies p=-4\$이고, \$g(0)=8(-4)=-32\$이다. 정답은 ③이다.

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
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x축 접하는 f(x)=(x-p)^2의 도함수로 g(x)=2(x-4)(x-p)를 세우고 y축 대칭 p=-4로 g(0)=-32 산출",
  "decisiveStep": "y축 대칭 조건으로 일차항 계수 p+4=0 적용",
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
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "완전제곱식 이차함수의 도함수와 우함수(y축 대칭) 조건을 결합해 상수항을 구하는 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "이차함수"
    ],
    "goal": [
      "함숫값"
    ],
    "method": [
      "도함수",
      "대칭성"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q11

- 형식: 객관식  
- 배점: 4.8



### 발문



다항식 \$x^{12}\$을 \$(x-1)^2\$으로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(2)\$의 값은?



### 선지



① \$11\$ ② \$13\$ ③ \$15\$ ④ \$17\$ ⑤ \$19\$



### 정답



②



### 해설



\$x^{12}=(x-1)^2Q(x)+mx+n\$이라 두고 \$x=1\$을 대입하면 \$m+n=1\$이다. 양변을 미분하여 \$x=1\$을 대입하면 \$12=m\$이므로 \$n=-11\$이고 \$R(x)=12x-11\$이다. 따라서 \$R(2)=24-11=13\$이다. 정답은 ②이다.

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
  "standardUnitKey": "H22-M1-05",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x^12=(x-1)^2Q(x)+mx+n에 x=1 대입 및 미분 후 x=1 대입으로 R(x)=12x-11 도출",
  "decisiveStep": "원식과 미분식에 x=1 대입해 m=12, n=-11 결정",
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
  "difficultyReason": "고차 다항식을 완전제곱식으로 나눈 나머지를 도함수 항등식으로 구하는 문항이다.",
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

## Q12

- 형식: 객관식  
- 배점: 5



### 발문



다항함수 \$f(x)\$는 \$\\lim\_{x\\to\\infty}\\dfrac{f(x)}{x^2+3x-1}=2\$를 만족시키고, 함수 \$g(x)=\\begin{cases}\\dfrac{1}{x+3}&(x\\ne \-3)\\5&(x=-3)\\end{cases}\$이다. 함수 \$f(x)g(x)\$가 실수 전체의 집합에서 연속일 때, \$f(0)\$의 값은?



### 선지



① \$9\$ ② \$12\$ ③ \$15\$ ④ \$18\$ ⑤ \$21\$



### 정답



④



### 해설



무한대 극한이 \$2\$이므로 \$f(x)\$는 최고차항의 계수가 \$2\$인 이차함수이다. \$x=-3\$에서 연속이려면 \$\\lim\_{x\\to \-3}\\dfrac{f(x)}{x+3}=5f(-3)\$이어야 하므로 분자 \$f(-3)=0\$이고 극한값 또한 \$0\$이어야 한다. 따라서 \$f(x)\$는 \$(x+3)^2\$을 인수로 가지므로 \$f(x)=2(x+3)^2\$이고 \$f(0)=2\\cdot 9=18\$이다. 정답은 ④이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "무한대 극한으로 최고차항 계수 2 이차함수 결정 후 x=-3 연속 조건으로 f(x)=2(x+3)^2 도출",
  "decisiveStep": "lim f(x)/(x+3) = 5f(-3)에서 f(-3)=0 및 중근 (x+3)^2 도출",
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
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "점 불연속 분수함수와의 곱이 연속이 되려면 다항함수가 중근을 가져야 함을 추론해야 하는 문항이다.",
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
      "연속",
      "극한"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q13

- 형식: 객관식  
- 배점: 5.1



### 발문



실수 전체의 집합에서 미분가능한 함수 \$f(x)\$가 모든 실수 \$x,\\ y\$에 대하여 \$f(x+y)=f(x)+f(y)-3xy\$를 만족시킨다. \$f'(0)=7\$일 때, \$5f'(1)\$의 값은?



### 선지



① \$20\$ ② \$10\$ ③ \$15\$ ④ \$25\$ ⑤ \$30\$



### 정답



①



### 해설



\$x=y=0\$을 대입하면 \$f(0)=0\$이고, \$f'(x)=\\lim\_{h\\to 0}\\dfrac{f(x+h)-f(x)}{h}=\\lim\_{h\\to 0}\\left{\\dfrac{f(h)}{h}-3x\\right}=f'(0)-3x=7-3x\$이다. 따라서 \$f'(1)=7-3=4\$이고 \$5f'(1)=20\$이다. 정답은 ①이다.

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
  "standardUnitKey": "H22-M1-04",
  "subUnitKey": "H22-M1-04-DERIVATIVE_FUNCTION_DETERMINATION",
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "도함수 정의로 f'(x)=7-3x를 구해 5f'(1)=20 산출",
  "decisiveStep": "f'(x) = f'(0) - 3x = 7 - 3x",
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
  "difficultyReason": "함수방정식에서 도함수 정의를 전개해 일차 도함수를 구하는 문항이다.",
  "level": "상",
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

## Q14

- 형식: 객관식  
- 배점: 5.2



### 발문



좌표평면에서 반지름의 길이가 \$t\$인 원 \$x^2+y^2=t^2\$의 내부에 포함되고 \$x\$좌표와 \$y\$좌표가 모두 정수인 점의 개수를 \$f(t)\$라 하자. \$0\<t\<4\$인 실수 \$t\$에 대하여 함수 \$f(t)\$가 불연속이 되는 \$t\$의 개수는?



### 선지



① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$



### 정답



③



### 해설



원의 내부는 \$x^2+y^2\<t^2\$이므로 \$t^2\$이 \$0\<n\<16\$인 두 정수의 제곱합 \$n=x^2+y^2\$을 지날 때마다 \$f(t)\$가 불연속이다. 가능한 \$n\$의 값은 \$1,\\ 2,\\ 4,\\ 5,\\ 8,\\ 9,\\ 10,\\ 13\$으로 총 \$8\$개이다. 정답은 ③이다.

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
  "primaryMethod": "원 내부 격자점 조건 x^2+y^2<t^2에서 1<=n<16 두 제곱수의 합 8개(1,2,4,5,8,9,10,13) 산출",
  "decisiveStep": "1<=x^2+y^2<16이 되는 서로 다른 제곱합 8개 열거",
  "rpm": {
    "majorUnit": "함수의 극한과 연속",
    "midUnit": "함수의 연속",
    "l3": "연속의 뜻",
    "l4": "구간에서의 연속"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_CONTINUITY_JUDGMENT",
    "templateKey": null,
    "why": "연속의 뜻 > 구간에서의 연속"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "기하적 격자점 개수 함수 f(t)의 불연속점을 두 정수 제곱합의 집합 크기로 환원해 빠짐없이 세어야 하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "정수"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "연속",
      "경우분류"
    ],
    "condition": [
      "정수"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q15

- 형식: 서답형  
- 배점: 5



### 발문



실수 전체의 집합에서 연속인 함수 \$f(x)\$가 모든 실수 \$x\$에 대하여 다음 두 조건을 만족시킨다. (가) \$f(-x)=f(x)\$ (나) \$f(x+4)=f(x)\$ \$f(0)=3\$, \$f(1)=-2\$, \$f(2)=4\$일 때, 닫힌구간 \$\[-2,\\ 6\]\$에서 방정식 \$f(x)=0\$은 적어도 \$N\$개의 실근을 갖는다. \$N\$의 값을 구하시오.



### 선지



없음



### 정답



8



### 해설



우함수이면서 주기가 \$4\$이므로 정수 \$x=-2,\\ \-1,\\ 0,\\ 1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6\$에서의 함숫값은 차례로 \$4,\\ \-2,\\ 3,\\ \-2,\\ 4,\\ \-2,\\ 3,\\ \-2,\\ 4\$이다. 인접한 두 정수 사이의 \$8\$개 열린구간에서 모두 부호가 바뀌므로 사잇값 정리에 의해 적어도 \$8\$개의 실근을 갖는다. 따라서 \$N=8\$이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": "H22-M1-02-INTERMEDIATE_VALUE",
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "우함수·주기 4 성질로 [-2,6] 정수점 부호 교대를 확인해 사잇값 정리 실근 8개 도출",
  "decisiveStep": "9개 정수점의 부호 교대로 8개 구간 실근 보장",
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
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "대칭성과 주기성으로 구간 내 모든 정수점의 함숫값 부호를 확장한 뒤 사잇값 정리를 적용하는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "함수",
      "구간"
    ],
    "goal": [
      "개수"
    ],
    "method": [
      "사잇값정리",
      "대칭성"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": ""
}
```

## Q16

- 형식: 서답형  
- 배점: 5



### 발문



두 다항함수 \$f(x),\\ g(x)\$에 대하여 \$f'(5)=4g'(3)\$이고 \$\\lim\_{x\\to 3}\\dfrac{f(x+2)-g(x)}{x^2-9}=1\$일 때, \$f'(5)\\times g'(3)\$의 값을 구하시오.



### 선지



없음



### 정답



16



### 해설



극한값이 존재하므로 \$f(5)-g(3)=0\$이다. \$\$\\lim\_{x\\to 3}\\frac{{f(x+2)-f(5)}-{g(x)-g(3)}}{x-3}\\cdot\\frac{1}{x+3} \= \\frac{f'(5)-g'(3)}{6} \= 1\$\$ \$f'(5)=4g'(3)\$을 대입하면 \$3g'(3)=6 \\implies g'(3)=2,\\ f'(5)=8\$이므로 \$f'(5)\\times g'(3)=16\$이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "f(5)=g(3)으로 분자를 두 미분계수 차로 분리해 (f'(5)-g'(3))/6=1과 f'(5)=4g'(3) 연립",
  "decisiveStep": "f'(5)-g'(3)=6과 f'(5)=4g'(3) 연립",
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
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "합성 형태의 분자 극한을 두 함수의 미분계수 차로 분리해 연립방정식을 푸는 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "다항함수",
      "극한"
    ],
    "goal": [
      "곱"
    ],
    "method": [
      "미분계수"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q17

- 형식: 서답형  
- 배점: 5



### 발문



함수 \$f(x)=x^2-6x+10\$과 두 상수 \$a,\\ b\$에 대하여 함수 \$g(x)=\\begin{cases}f(x+a)+b&(x\<0)\\f(x)&(x\\ge 0)\\end{cases}\$이 실수 전체의 집합에서 연속이다. 실수 \$t\$에 대하여 함수 \$y=g(x)\$의 그래프와 직선 \$y=t\$가 만나는 점의 개수를 \$h(t)\$라 할 때, \$\\left\|\\lim\_{t\\to k^+}h(t)-\\lim\_{t\\to k^-}h(t)\\right\|=2\$를 만족시키는 서로 다른 모든 실수 \$k\$의 값이 \$1,\\ 6,\\ 10\$이다. \$a+b\$의 값을 구하시오.



### 선지



없음



### 정답



10



### 해설



\$f(x)=(x-3)^2+1\$이므로 오른쪽 가지(\$x\\ge 0\$)는 꼭짓점 \$(3,\\ 1)\$, 경계 \$(0,\\ 10)\$을 갖는다. 연속 조건 \$f(a)+b=10\$에서 \$(a-3)^2+1+b=10\$이다. 새로운 불연속 높이 \$k=6\$은 왼쪽 가지 꼭짓점의 높이 \$1+b=6\$이어야 하므로 \$b=5\$이다. \$(a-3)^2=4\$에서 \$a=1\$ 또는 \$a=5\$인데, 왼쪽 꼭짓점 \$x=3-a\<0\$이 되려면 \$a=5\$여야 한다. 따라서 \$a+b=5+5=10\$이다.

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
  "standardUnitKey": "H22-M1-02",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_CONTINUITY",
  "primaryMethod": "h(t) 불연속점 1,6,10에서 왼쪽 꼭짓점 y좌표 1+b=6으로 b=5를 구하고 정의역 x<0 조건으로 a=5 확정",
  "decisiveStep": "왼쪽 꼭짓점 높이 1+b=6 및 꼭짓점 x좌표 3-a<0 판별",
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
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "평행이동된 구간별 이차함수의 수평선 교점 개수 불연속 높이와 정의역 내 꼭짓점 포함 조건을 결합해야 하는 최고난도 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "이차함수",
      "직선"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "연속",
      "그래프"
    ],
    "condition": [
      "연속"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q18

- 형식: 서답형  
- 배점: 5



### 발문



함수 \$f(x)=x^3-3x^2+ax+10\$에 대하여 함수 \$g(x)=\\begin{cases}b-f(x)&(x\<2)\\f(x)&(x\\ge 2)\\end{cases}\$이 실수 전체의 집합에서 미분가능할 때, 함수 \$g(x)\$의 극솟값을 \$c\$라 하자. \$a+b+c\$의 값을 구하시오. (단, \$a,\\ b,\\ c\$는 상수이다.)



### 선지



없음



### 정답



14



### 해설



\$x=2\$에서 미분가능하려면 \$-f'(2)=f'(2) \\implies f'(2)=0\$이므로 \$3(4)-6(2)+a=0 \\implies a=0\$이다. 연속 조건 \$b-f(2)=f(2)\$에서 \$f(2)=8-12+10=6\$이므로 \$b=12\$이다. \$x\<2\$에서 \$g(x)=12-(x^3-3x^2+10)=-x^3+3x^2+2\$이고 \$g'(x)=-3x(x-2)\$이므로 \$x=0\$에서 극솟값 \$c=g(0)=2\$를 갖는다. 따라서 \$a+b+c=0+12+2=14\$이다.

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
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x=2 미분가능으로 f'(2)=0(a=0)과 b=2f(2)=12를 구한 뒤 x<2 극솟값 c=g(0)=2 산출",
  "decisiveStep": "-f'(2)=f'(2) -> f'(2)=0 및 g'(x)=-3x(x-2) 부호 변화 확인",
  "rpm": {
    "majorUnit": "미분",
    "midUnit": "도함수의 활용",
    "l3": "증가·감소와 극값",
    "l4": "극대·극소"
  },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_EXTREMA",
    "templateKey": "TPL_EXTREMA_VALUE_PARAMETER",
    "why": "증가·감소와 극값 > 극대·극소"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "경계 대칭 반전 함수의 미분가능 조건과 도함수 부호 판별을 통한 극솟값 계산을 결합한 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수"
    ],
    "goal": [
      "값"
    ],
    "method": [
      "미분가능",
      "도함수"
    ],
    "condition": [
      "미분가능"
    ]
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q19

- 형식: 서답형  
- 배점: 6



### 발문



\[서술형 1\] 함수 \$g(x)=\|x-5\|\$에 대하여 \$x=5\$에서의 연속성을 조사하고, 극한값 \$\\lim\_{h\\to 0}\\dfrac{g(5+h)-g(5-h)}{h}\$의 수렴·발산 여부를 판단하여 그 근거를 서술하시오.



### 선지



없음



### 정답



연속, 0으로 수렴



### 해설



\$g(5)=\|5-5\|=0\$이고 \$\\lim\_{x\\to 5}g(x)=\\lim\_{x\\to 5}\|x-5\|=0=g(5)\$이므로 \$x=5\$에서 연속이다. 한편 \$h\\ne 0\$일 때 \$g(5+h)=\|h\|\$, \$g(5-h)=\|-h\|=\|h\|\$이므로 \$\\dfrac{g(5+h)-g(5-h)}{h}=\\dfrac{\|h\|-\|h\|}{h}=0\$이다. 따라서 극한값은 \$0\$으로 수렴한다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": "H22-M1-03-DIFFERENTIABILITY_CONDITION",
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "x=5 좌우극한=함숫값=0으로 연속성을 보이고 대칭차분식 (|h|-|h|)/h=0 수렴 서술",
  "decisiveStep": "g(5+h)=g(5-h)=|h| 대칭 상쇄 확인",
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
  "difficultyReason": "첨점에서 연속성은 성립하고 대칭차분계수 극한이 0으로 수렴함을 직접 서술하는 개념 문항이다.",
  "level": "중",
  "item4slot": {
    "given": [
      "함수"
    ],
    "goal": [
      "연속",
      "극한"
    ],
    "method": [
      "절댓값",
      "극한"
    ],
    "condition": []
  },
  "hold": ""
}
```

## Q20

- 형식: 서답형  
- 배점: 7



### 발문



\[서술형 2\] 그림과 같이 좌표평면에서 원 \$x^2+y^2=20\$과 곡선 \$y=x^2\$이 제1사분면에서 만나는 점을 \$A\$라 하자. 실수 \$t\$(\$0\<t\<3\$)에 대하여 직선 \$y=tx\$가 원 \$x^2+y^2=20\$, 곡선 \$y=x^2\$과 제1사분면에서 만나는 점을 각각 \$P,\\ Q\$라 하자. 선분 \$PQ\$의 길이를 \$l(t)\$라 할 때, \$\\lim\_{t\\to 2^-}\\dfrac{l(t)}{2-t}\$의 값을 풀이과정과 함께 구하시오.



### 선지



없음



### 정답



\$\\dfrac{9\\sqrt{5}}{5}\$



### 해설



제1사분면 교점 \$P\$는 원 위에 있으므로 \$\\overline{OP}=2\\sqrt{5}\$이고, 포물선 \$y=x^2\$과 \$y=tx\$의 교점은 \$Q(t,\\ t^2)\$이므로 \$\\overline{OQ}=t\\sqrt{1+t^2}\$이다. \$t\\to 2^-\$에서 \$t\<2\$이므로 \$l(t)=\\overline{OP}-\\overline{OQ}=2\\sqrt{5}-t\\sqrt{1+t^2}\$이다. \$H(t)=t\\sqrt{1+t^2}\$라 하면 \$H(2)=2\\sqrt{5}\$이므로 구하는 극한은 \$H'(2)\$와 같다. \$\$H'(t)=\\sqrt{1+t^2}+\\frac{t^2}{\\sqrt{1+t^2}} \\implies H'(2)=\\sqrt{5}+\\frac{4}{\\sqrt{5}}=\\frac{9\\sqrt{5}}{5}\$\$

```
{"figureType": "circle_parabola_ray_intersection", "description": "원 x^2+y^2=20과 포물선 y=x^2의 제1사분면 교점 A(2,4) 및 직선 y=tx와의 교점 P, Q", "elements": ["circle x^2+y^2=20", "parabola y=x^2", "intersection A(2,4)", "ray y=tx meeting circle at P and parabola at Q"]}
```

```
{
  "sourceQid": "Q20",
  "variationType": "NUMERIC",
  "standardCourse": "미적분I",
  "courseKey": "H22-M1",
  "curriculum": "2022",
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "l(t)=2sqrt(5)-t*sqrt(1+t^2)을 H(2)-H(t)로 보고 미분계수 H'(2)=9sqrt(5)/5 계산",
  "decisiveStep": "l(t)/(2-t)를 H'(2) 미분계수로 환원",
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
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "원과 포물선, 직선의 제1사분면 교점 거리를 함수 H(t)로 세운 뒤 극한을 미분계수 H'(2)로 해석해 구하는 최고난도 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "원",
      "이차함수",
      "직선"
    ],
    "goal": [
      "극한"
    ],
    "method": [
      "미분계수",
      "거리"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

## Q21

- 형식: 서답형  
- 배점: 7



### 발문



\[서술형 3\] 최고차항의 계수가 \$1\$인 삼차함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$f'(3)\$의 값을 구하는 풀이과정과 답을 서술하시오. (단, 로피탈 정리는 사용하지 않는다.) (가) \$\\lim\_{x\\to 2}\\dfrac{f(x)-f(2)}{(x-2)^2}\$의 값이 존재한다. (나) \$\\lim\_{x\\to 2}\\dfrac{f(x^2-4)-f(0)}{f(x)-f(2)}\$의 값이 존재한다.



### 선지



없음



### 정답



9



### 해설



\$f(x)=x^3+Ax^2+Bx+C\$라 하면 (가)에 의해 \$f'(2)=12+4A+B=0 \\implies B=-12-4A\$이다. 만약 \$A=-6\$이면 \$B=12\$이고 \$f(x)-f(2)=(x-2)^3\$인데, (나)의 분자는 \$f'(0)=12\\ne 0\$으로 \$(x-2)\$를 \$1\$차만 포함해 발산하므로 \$A\\ne \-6\$이다. 따라서 분모는 \$(x-2)^2\$ 인수를 가지며 (나)의 극한이 존재하려면 \$f'(0)=B=0\$이어야 한다. \$12+4A=0 \\implies A=-3\$이므로 \$f'(x)=3x^2-6x\$이고 \$f'(3)=27-18=9\$이다.

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
  "standardUnitKey": "H22-M1-03",
  "subUnitKey": null,
  "conceptClusterKey": "CALCULUS_DERIVATIVE",
  "primaryMethod": "(가)에서 f'(2)=0 및 삼중근 제외를 확인하고 (나) 인수정리로 f'(0)=B=0을 얻어 f'(x)=3x^2-6x, f'(3)=9 도출",
  "decisiveStep": "A=-6 삼중근 모순 배제 후 B=0 도출",
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
  "difficultyBucket": 5,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "로피탈 정리 없이 인수 차수 비교를 통해 삼차함수의 두 미정계수를 엄밀히 결정해야 하는 최고난도 서술형 문항이다.",
  "level": "상",
  "item4slot": {
    "given": [
      "삼차함수",
      "극한"
    ],
    "goal": [
      "미분계수"
    ],
    "method": [
      "인수분해",
      "극한"
    ],
    "condition": []
  },
  "hold": "BINDING_GAP: high2-math2-calculus1.json의 2022 미적분I 해당 레코드가 MISSING(subUnitKey 미지정) 상태임"
}
```

