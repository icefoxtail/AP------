

```
{ "stem": "H2-CALC-RPM-068_2022_지수함수의미분_e^x형_r01_유형풀", "mode": "TYPE_BANK", "round": 1, "targetRpmId": "H2-CALC-RPM-068", "grade": "고2", "subject": "미적분II", "curriculum": "2022", "questionCount": 5, "generatedAt": "2026-11-22" }
```

# **Q01**

* 형식: 객관식  
* 배점: 4

## **발문**

함수 \$f(x) \= (x^2 \+ 2x \- 1)e^x\$에 대하여 \$f'(1)\$의 값은?

## **선지**

① \$3e\$ ② \$4e\$ ③ \$5e\$ ④ \$6e\$ ⑤ \$7e\$

## **정답**

④

## **해설**

곱의 미분법을 이용하여 \$f'(x)\$를 구하면  
\$\$\\begin{aligned}  
f'(x) &= (2x \+ 2)e^x \+ (x^2 \+ 2x \- 1)e^x \\  
&= (x^2 \+ 4x \+ 1)e^x  
\\end{aligned}\$\$  
따라서 \$x \= 1\$을 대입하면  
\$\$f'(1) \= (1 \+ 4 \+ 1)e^1 \= 6e\$\$  
이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "곱의 미분법을 이용해 지수함수의 미분계수를 구하는 순수 수식 문항" },
  "solutionPlan": { "status": "EXEMPT", "reason": "도함수를 구해 x=1을 대입하는 순수 대수 계산 문항" }
}
```

```
{
  "sourceQid": "TYPE_BANK_Q01",
  "variationType": "BASE_TYPE",
  "standardCourse": "미적분II",
  "courseKey": "H22-M2",
  "curriculum": "2022",
  "standardUnitKey": "H22-M2-03",
  "subUnitKey": null,
  "conceptClusterKey": "EXP_DERIVATIVE_PRODUCT_RULE_BASIC",
  "primaryMethod": "곱의 미분법으로 $f'(x)=(x^2+4x+1)e^x$를 구한 뒤 $x=1$을 대입해 $6e$를 계산한다.",
  "decisiveStep": "다항함수와 $e^x$의 곱을 미분할 때 $(e^x)'=e^x$임을 적용해 동류항을 정리한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "지수함수의 미분", "l4": "e^x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "곱의 미분법과 (e^x)'=e^x 공식을 직접 적용해 미분계수를 구하는 대표 기본형 문항이다.",
  "level": "하",
  "item4slot": {
    "given": ["함수", "지수함수"],
    "goal": ["도함수"],
    "method": ["미분"],
    "condition": []
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

# **Q02**

* 형식: 객관식  
* 배점: 4.5

## **발문**

함수 \$f(x) \= (2x \- 3)e^x \+ 3^x\$에 대하여  
\$\$\\lim\_{h\\to 0} \\frac{f(1 \+ 2h) \- f(1 \- h)}{h}\$\$  
의 값은?

## **선지**

① \$e \+ 3\\ln 3\$ ② \$2e \+ 6\\ln 3\$ ③ \$3e \+ 9\\ln 3\$ ④ \$3e \+ 3\\ln 3\$ ⑤ \$4e \+ 9\\ln 3\$

## **정답**

③

## **해설**

함수 \$f(x)\$는 실수 전체에서 미분가능하므로 미분계수의 정의에 의하여  
\$\$\\begin{aligned}  
\\lim\_{h\\to 0} \\frac{f(1 \+ 2h) \- f(1 \- h)}{h} &= \\lim\_{h\\to 0} \\left{2\\cdot\\frac{f(1 \+ 2h) \- f(1)}{2h} \+ \\frac{f(1 \- h) \- f(1)}{-h}\\right} \\  
&= 2f'(1) \+ f'(1) \= 3f'(1)  
\\end{aligned}\$\$  
한편 도함수 \$f'(x)\$를 구하면 \$(a^x)' \= a^x \\ln a\$이므로  
\$\$f'(x) \= 2e^x \+ (2x \- 3)e^x \+ 3^x \\ln 3 \= (2x \- 1)e^x \+ 3^x \\ln 3\$\$  
따라서 \$f'(1) \= e \+ 3\\ln 3\$이므로 구하는 극한값은  
\$\$3f'(1) \= 3e \+ 9\\ln 3\$\$  
이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "미분계수의 정의와 지수함수의 도함수를 결합한 순수 수식 문항" },
  "solutionPlan": { "status": "EXEMPT", "reason": "극한 변형 후 도함수 공식을 적용해 대입하는 순수 대수 문항" }
}
```

```
{
  "sourceQid": "TYPE_BANK_Q02",
  "variationType": "STRUCTURAL_CHANGE",
  "standardCourse": "미적분II",
  "courseKey": "H22-M2",
  "curriculum": "2022",
  "standardUnitKey": "H22-M2-03",
  "subUnitKey": null,
  "conceptClusterKey": "EXP_DERIVATIVE_LIMIT_DEFINITION_BASE_A",
  "primaryMethod": "극한식을 $3f'(1)$로 변형한 뒤 곱의 미분법과 $(3^x)'=3^x\\ln 3$을 적용해 $3e+9\\ln 3$을 계산한다.",
  "decisiveStep": "밑이 $e$인 항과 밑이 $3$인 항의 도함수 차이를 정확히 적용하고 미분계수 계수 $2-(-1)=3$을 결합한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "지수함수의 미분", "l4": "e^x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미분계수의 정의를 극한으로 해석하고 밑이 e인 함수와 일반 지수함수를 함께 미분하는 구조변형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": ["함수", "지수함수", "극한"],
    "goal": ["극한"],
    "method": ["미분", "도함수"],
    "condition": []
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

# **Q03**

* 형식: 객관식  
* 배점: 4.5

## **발문**

함수 \$f(x) \= (x^2 \+ ax \+ b)e^x\$가 다음 조건을 만족시킬 때, 두 상수 \$a, b\$에 대하여 \$a^2 \+ b^2\$의 값은?  
(가) 곡선 \$y \= f(x)\$ 위의 점 \$(0, f(0))\$에서의 접선의 기울기는 \$3\$이다.  
(나) \$\\lim\_{x\\to 1} \\frac{f(x) \- f(1)}{x \- 1} \= 10e\$

## **선지**

① \$17\$ ② \$18\$ ③ \$20\$ ④ \$25\$ ⑤ \$26\$

## **정답**

①

## **해설**

곱의 미분법에 의하여 \$f'(x)\$는  
\$\$f'(x) \= (2x \+ a)e^x \+ (x^2 \+ ax \+ b)e^x \= {x^2 \+ (a \+ 2)x \+ a \+ b}e^x\$\$  
조건 (가)에서 \$f'(0) \= 3\$이므로  
\$\$f'(0) \= (a \+ b)e^0 \= a \+ b \= 3 \\quad \\cdots \\text{①}\$\$  
조건 (나)에서 \$\\lim\_{x\\to 1} \\frac{f(x) \- f(1)}{x \- 1} \= f'(1) \= 10e\$이므로  
\$\$f'(1) \= {1 \+ (a \+ 2\) \+ a \+ b}e \= (2a \+ b \+ 3)e \= 10e\$\$  
따라서 \$2a \+ b \+ 3 \= 10\$, 즉  
\$\$2a \+ b \= 7 \\quad \\cdots \\text{②}\$\$  
②에서 ①을 빼면 \$a \= 4\$이고, ①에 대입하면 \$b \= \-1\$이다.  
그러므로 구하는 값은  
\$\$a^2 \+ b^2 \= 4^2 \+ (-1)^2 \= 17\$\$  
이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "접선의 기울기와 미분계수 조건으로부터 다항 계수를 역산하는 순수 수식 문항" },
  "solutionPlan": { "status": "EXEMPT", "reason": "도함수를 구해 x=0, 1 조건을 연립하는 대수 전개 문항" }
}
```

```
{
  "sourceQid": "TYPE_BANK_Q03",
  "variationType": "STRUCTURAL_CHANGE",
  "standardCourse": "미적분II",
  "courseKey": "H22-M2",
  "curriculum": "2022",
  "standardUnitKey": "H22-M2-03",
  "subUnitKey": null,
  "conceptClusterKey": "EXP_DERIVATIVE_PARAMETER_TANGENT_INVERSE",
  "primaryMethod": "$f'(x)=\\{x^2+(a+2)x+a+b\\}e^x$를 구한 뒤 $f'(0)=3$과 $f'(1)=10e$를 연립해 $a=4, b=-1$을 역산한다.",
  "decisiveStep": "조건 (나)의 극한값이 $f'(1)$임을 파악하여 $e$를 약분한 연립일차방정식을 세운다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "지수함수의 미분", "l4": "e^x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "B23",
  "difficultyReason": "접선의 기울기와 극한으로 주어진 미분계수 조건으로부터 미정계수를 역산하는 구조변형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": ["함수", "지수함수", "접선"],
    "goal": ["합"],
    "method": ["미분", "도함수"],
    "condition": []
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

# **Q04**

* 형식: 객관식  
* 배점: 5

## **발문**

점 \$(0, k)\$에서 곡선 \$y \= x e^x\$에 서로 다른 세 개의 접선을 그을 수 있도록 하는 실수 \$k\$의 값의 범위는?

## **선지**

① \$k \< \-\\frac{4}{e^2}\$ ② \$-\\frac{4}{e^2} \< k \< \\frac{4}{e^2}\$ ③ \$-\\frac{2}{e^2} \< k \< 0\$ ④ \$0 \< k \< \\frac{4}{e^2}\$ ⑤ \$-\\frac{4}{e^2} \< k \< 0\$

## **정답**

⑤

## **해설**

\$f(x) \= x e^x\$이라 하면 \$f'(x) \= (x \+ 1)e^x\$이다.  
곡선 위의 점 \$(t, t e^t)\$에서의 접선의 방정식은  
\$\$y \= (t \+ 1)e^t (x \- t) \+ t e^t\$\$  
이 접선이 점 \$(0, k)\$를 지나므로 \$x \= 0, y \= k\$를 대입하면  
\$\$k \= \-t(t \+ 1)e^t \+ t e^t \= \-t^2 e^t\$\$  
곡선 \$y \= x e^x\$에 서로 다른 세 개의 접선을 그을 수 있으려면 \$t\$에 대한 방정식 \$-t^2 e^t \= k\$가 서로 다른 세 실근을 가져야 한다.  
\$g(t) \= \-t^2 e^t\$이라 하면  
\$\$g'(t) \= \-2t e^t \- t^2 e^t \= \-t(t \+ 2)e^t\$\$  
\$g'(t) \= 0\$에서 \$t \= \-2\$ 또는 \$t \= 0\$이다.

* \$t \< \-2\$일 때 \$g'(t) \< 0\$, \$-2 \< t \< 0\$일 때 \$g'(t) \> 0\$, \$t \> 0\$일 때 \$g'(t) \< 0\$이다.  
* 극솟값: \$g(-2) \= \-\\frac{4}{e^2}\$, 극댓값: \$g(0) \= 0\$  
* \$\\lim\_{t\\to \-\\infty} g(t) \= 0\$ (음수 쪽에서 \$0\$에 한없이 가까워짐), \$\\lim\_{t\\to \\infty} g(t) \= \-\\infty\$  
  따라서 직선 \$y \= k\$와 곡선 \$y \= g(t)\$가 서로 다른 세 점에서 만나도록 하는 실수 \$k\$의 범위는  
  \$\$-\\frac{4}{e^2} \< k \< 0\$\$  
  이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "외부 점에서의 접선 개수 조건을 방정식의 실근 개수로 해석하는 문항" },
  "solutionPlan": { "status": "UNSUPPORTED", "reason": "t축에 대한 함수 g(t)=-t^2 e^t의 그래프(t->-∞일 때 y=0- 점근선, 극솟점 (-2, -4/e^2), 극댓점 (0,0), t->∞일 때 -∞ 감소)와 가로선 y=k가 서로 다른 세 점에서 만나는 구간 -4/e^2 < k < 0을 표시한 개형 그래프" }
}
```

```
{
  "sourceQid": "TYPE_BANK_Q04",
  "variationType": "DEEPENING",
  "standardCourse": "미적분II",
  "courseKey": "H22-M2",
  "curriculum": "2022",
  "standardUnitKey": "H22-M2-03",
  "subUnitKey": null,
  "conceptClusterKey": "EXP_DERIVATIVE_TANGENT_COUNT_EXTREMA",
  "primaryMethod": "접점 $(t, te^t)$의 접선이 $(0,k)$를 지나는 방정식 $k=-t^2e^t$을 세운 뒤 $g(t)=-t^2e^t$의 극값과 점근선으로 세 실근 범위 $-\\frac{4}{e^2}<k<0$을 구한다.",
  "decisiveStep": "접선의 개수가 접점의 $t$좌표 개수와 일대일 대응됨을 이용해 $g(t)=-t^2e^t$의 극솟값 $-\\frac{4}{e^2}$과 극댓값 $0$ 사이의 개형을 판별한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "지수함수의 미분", "l4": "e^x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CONCEPT_MIX",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "B34",
  "difficultyReason": "외부 점에서의 접선 개수 문제를 매개변수 방정식의 실근 개수 및 지수함수 개형 분석으로 전환하는 사고확장 문항이다.",
  "level": "상",
  "item4slot": {
    "given": ["지수함수", "접선", "점"],
    "goal": ["실수", "부등식"],
    "method": ["미분", "도함수"],
    "condition": ["실근"]
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

# **Q05**

* 형식: 서답형  
* 배점: 5

## **발문**

실수 전체의 집합에서 미분가능한 함수  
\$\$f(x) \= \\begin{cases} (x^2 \+ ax \+ b)e^x & (x \< 0\) \\ cx^2 \+ dx \+ 3 & (x \\ge 0\) \\end{cases}\$\$  
가 \$f'(-2) \= \-\\frac{1}{e^2}\$, \$f(1) \= 15\$를 만족시킬 때, 상수 \$a, b, c, d\$에 대하여 \$a \+ b \+ c \+ d\$의 값을 구하시오.

## **선지**

없음

## **정답**

\$19\$

## **해설**

함수 \$f(x)\$가 \$x \= 0\$에서 미분가능하므로 먼저 \$x \= 0\$에서 연속이어야 한다.  
\$\$\\lim\_{x\\to 0-} f(x) \= b e^0 \= b, \\qquad f(0) \= 3 \\implies b \= 3\$\$  
\$x \< 0\$일 때 도함수를 구하면  
\$\$f'(x) \= (2x \+ a)e^x \+ (x^2 \+ ax \+ 3)e^x \= {x^2 \+ (a \+ 2)x \+ a \+ 3}e^x\$\$  
이고, \$x \> 0\$일 때 \$f'(x) \= 2cx \+ d\$이다.  
\$x \= 0\$에서 좌미분계수와 우미분계수가 같아야 하므로  
\$\$\\lim\_{x\\to 0-} f'(x) \= a \+ 3, \\qquad \\lim\_{x\\to 0+} f'(x) \= d \\implies d \= a \+ 3\$\$  
한편 \$f'(-2) \= \-\\frac{1}{e^2}\$이므로 \$x \= \-2\$를 대입하면  
\$\${4 \- 2(a \+ 2\) \+ a \+ 3}e^{-2} \= (3 \- a)e^{-2} \= \-e^{-2}\$\$  
에서 \$3 \- a \= \-1\$, 즉 \$a \= 4\$이다. 따라서 \$d \= 4 \+ 3 \= 7\$이다.  
마지막으로 \$f(1) \= 15\$에서  
\$\$c(1)^2 \+ 7(1) \+ 3 \= 15 \\implies c \= 5\$\$  
그러므로 구하는 값은  
\$\$a \+ b \+ c \+ d \= 4 \+ 3 \+ 5 \+ 7 \= 19\$\$  
이다.n  
{  
"questionPlan": { "status": "EXEMPT", "reason": "구간별 정의 함수의 미분가능 조건과 함숫값으로 계수를 결정하는 순수 수식 문항" },  
"solutionPlan": { "status": "EXEMPT", "reason": "x=0 연속·미분가능 연립 및 f'(-2) 조건으로 계수를 구하는 대수 문항" }  
}

````

```json:meta
{
  "sourceQid": "TYPE_BANK_Q05",
  "variationType": "DEEPENING",
  "standardCourse": "미적분II",
  "courseKey": "H22-M2",
  "curriculum": "2022",
  "standardUnitKey": "H22-M2-03",
  "subUnitKey": null,
  "conceptClusterKey": "EXP_DERIVATIVE_PIECEWISE_DIFFERENTIABILITY",
  "primaryMethod": "$x=0$에서 연속($b=3$)과 미분가능($d=a+3$)을 세운 뒤 $f'(-2)=-e^{-2}$로 $a=4, d=7$을 구하고 $f(1)=15$에서 $c=5$를 확정한다.",
  "decisiveStep": "음의 구간 도함수 $f'(x)=\\{x^2+(a+2)x+a+3\\}e^x$를 구해 $x=0$에서의 좌미분계수 $a+3$과 $x=-2$ 조건을 순차 결합한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "지수함수의 미분", "l4": "e^x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "지수함수와 다항함수로 나뉜 구간 함수의 연속성과 미분가능성 및 도함수 값을 연쇄적으로 연립해야 하는 심화 문항이다.",
  "level": "상",
  "item4slot": {
    "given": ["함수", "지수함수"],
    "goal": ["합"],
    "method": ["미분", "도함수"],
    "condition": ["미분가능"]
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-068의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
````

