

```
{ "stem": "H2-CALC-RPM-070_2022_로그함수의미분_lnx형_r01_유형풀", "mode": "TYPE_BANK", "round": 1, "targetRpmId": "H2-CALC-RPM-070", "grade": "고2", "subject": "미적분II", "curriculum": "2022", "questionCount": 5, "generatedAt": "2026-11-22" }
```

# **Q01**

* 형식: 객관식  
* 배점: 4

## **발문**

함수 \$f(x) \= x^2 \\ln x \+ 3 \\log\_2 x\$ (\$x \> 0\$)에 대하여 \$f'(1)\$의 값은?

## **선지**

① \$1 \+ \\frac{1}{\\ln 2}\$ ② \$1 \+ \\frac{3}{\\ln 2}\$ ③ \$2 \+ \\frac{3}{\\ln 2}\$ ④ \$1 \+ 3\\ln 2\$ ⑤ \$2 \+ 3\\ln 2\$

## **정답**

②

## **해설**

곱의 미분법과 로그함수의 도함수 \$(\\ln x)' \= \\frac{1}{x}\$, \$(\\log\_a x)' \= \\frac{1}{x \\ln a}\$를 이용하면  
\$\$\\begin{aligned}  
f'(x) &= 2x \\ln x \+ x^2 \\cdot \\frac{1}{x} \+ \\frac{3}{x \\ln 2} \\  
&= 2x \\ln x \+ x \+ \\frac{3}{x \\ln 2}  
\\end{aligned}\$\$  
따라서 \$x \= 1\$을 대입하면 \$\\ln 1 \= 0\$이므로  
\$\$f'(1) \= 0 \+ 1 \+ \\frac{3}{\\ln 2} \= 1 \+ \\frac{3}{\\ln 2}\$\$  
이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "자연로그와 밑이 2인 로그함수의 도함수를 구해 미분계수를 계산하는 순수 수식 문항" },
  "solutionPlan": { "status": "EXEMPT", "reason": "도함수 공식에 직접 대입하는 순수 대수 계산 문항" }
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
  "conceptClusterKey": "LOG_DERIVATIVE_PRODUCT_BASE_A_BASIC",
  "primaryMethod": "곱의 미분법과 로그함수 도함수 공식으로 $f'(x)=2x\\ln x + x + \\frac{3}{x\\ln 2}$를 구해 $f'(1)=1+\\frac{3}{\\ln 2}$를 계산한다.",
  "decisiveStep": "$\\log_2 x$를 미분할 때 분모에 $\\ln 2$를 정확히 배치한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "로그함수의 미분", "l4": "ln x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "NONE",
  "difficultyBucket": 1,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "자연로그와 상용·임의 밑 로그함수의 도함수 공식을 직접 적용해 미분계수를 구하는 대표 기본형 문항이다.",
  "level": "하",
  "item4slot": {
    "given": ["함수", "로그함수"],
    "goal": ["도함수"],
    "method": ["미분"],
    "condition": []
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

# **Q02**

* 형식: 객관식  
* 배점: 4.5

## **발문**

함수 \$f(x) \= (x^2 \- 3x)\\ln x\$ (\$x \> 0\$)에 대하여  
\$\$\\lim\_{h\\to 0} \\frac{f(e \+ 3h) \- f(e \- 2h)}{h}\$\$  
의 값은?

## **선지**

① \$3e \- 6\$ ② \$10e \- 20\$ ③ \$15e \- 30\$ ④ \$15e \- 15\$ ⑤ \$20e \- 30\$

## **정답**

③

## **해설**

함수 \$f(x)\$는 \$x \> 0\$에서 미분가능하므로 미분계수의 정의에 의하여  
\$\$\\begin{aligned}  
\\lim\_{h\\to 0} \\frac{f(e \+ 3h) \- f(e \- 2h)}{h} &= \\lim\_{h\\to 0} \\left{3\\cdot\\frac{f(e \+ 3h) \- f(e)}{3h} \+ 2\\cdot\\frac{f(e \- 2h) \- f(e)}{-2h}\\right} \\  
&= 3f'(e) \+ 2f'(e) \= 5f'(e)  
\\end{aligned}\$\$  
한편 \$f(x)\$를 미분하면 (\$x \> 0\$)  
\$\$\\begin{aligned}  
f'(x) &= (2x \- 3)\\ln x \+ (x^2 \- 3x)\\cdot \\frac{1}{x} \\  
&= (2x \- 3)\\ln x \+ x \- 3  
\\end{aligned}\$\$  
이므로 \$f'(e) \= (2e \- 3)\\cdot 1 \+ e \- 3 \= 3e \- 6\$이다.  
따라서 구하는 값은  
\$\$5f'(e) \= 5(3e \- 6\) \= 15e \- 30\$\$  
이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "미분계수의 정의 극한과 로그함수 곱의 미분을 결합한 순수 수식 문항" },
  "solutionPlan": { "status": "EXEMPT", "reason": "극한 변형 후 도함수에 x=e를 대입하는 순수 대수 계산 문항" }
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
  "conceptClusterKey": "LOG_DERIVATIVE_LIMIT_DEFINITION_E",
  "primaryMethod": "극한식을 $5f'(e)$로 해석한 뒤 $f'(x)=(2x-3)\\ln x + x - 3$을 구해 $15e-30$을 계산한다.",
  "decisiveStep": "미분계수 계수 $3-(-2)=5$를 정확히 분리하고 $x>0$에서 $\\frac{x^2-3x}{x}=x-3$으로 정리한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "로그함수의 미분", "l4": "ln x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "미분계수의 정의를 극한으로 해석하고 다항식과 자연로그의 곱을 미분해 x=e에서 평가하는 구조변형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": ["함수", "로그함수", "극한"],
    "goal": ["극한"],
    "method": ["미분", "도함수"],
    "condition": []
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

# **Q03**

* 형식: 객관식  
* 배점: 4.5

## **발문**

함수 \$f(x) \= x^2 \\ln x \+ ax^2 \+ bx\$ (\$x \> 0\$)가 \$x \= 1\$에서 극값 \$2\$를 가질 때, 두 상수 \$a, b\$에 대하여 \$a^2 \+ b^2\$의 값은?

## **선지**

① \$13\$ ② \$20\$ ③ \$25\$ ④ \$29\$ ⑤ \$34\$

## **정답**

⑤

## **해설**

함수 \$f(x)\$는 \$x \> 0\$에서 미분가능하므로 \$x \= 1\$에서 극값 \$2\$를 가지려면 \$f(1) \= 2\$, \$f'(1) \= 0\$이어야 한다.  
먼저 \$f(1) \= 2\$에서  
\$\$1^2 \\ln 1 \+ a \+ b \= 2 \\implies a \+ b \= 2 \\quad \\cdots \\text{①}\$\$  
한편 \$f(x)\$를 미분하면  
\$\$f'(x) \= 2x \\ln x \+ x \+ 2ax \+ b\$\$  
\$f'(1) \= 0\$에서  
\$\$0 \+ 1 \+ 2a \+ b \= 0 \\implies 2a \+ b \= \-1 \\quad \\cdots \\text{②}\$\$  
②에서 ①을 빼면 \$a \= \-3\$이고, ①에 대입하면 \$b \= 5\$이다.  
(검증: \$f'(x) \= 2x \\ln x \- 5x \+ 5\$이고 \$f'(x)\$의 도함수를 확인하면 \$x \= 1\$에서 \$2\\ln 1 \- 3 \= \-3 \< 0\$이므로 \$x \= 1\$ 좌우에서 \$f'(x)\$의 부호가 양에서 음으로 바뀌어 실제로 극댓값 \$2\$를 갖는다.)  
따라서 구하는 값은  
\$\$a^2 \+ b^2 \= (-3)^2 \+ 5^2 \= 34\$\$  
이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "로그함수의 극값 조건으로부터 다항 계수를 역산하는 순수 수식 문항" },
  "solutionPlan": { "status": "EXEMPT", "reason": "f(1)=2와 f'(1)=0 연립방정식으로 계수를 구하는 대수 문항" }
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
  "conceptClusterKey": "LOG_DERIVATIVE_EXTREMUM_PARAMETER_INVERSE",
  "primaryMethod": "$f(1)=2$와 $f'(1)=0$을 연립하여 $a=-3, b=5$를 역산하고 $a^2+b^2=34$를 계산한다.",
  "decisiveStep": "$x^2\\ln x$의 도함수를 구해 $x=1$에서 $\\ln 1=0$으로 정리한 뒤 두 미정계수를 연립한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "로그함수의 미분", "l4": "ln x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "SEQUENTIAL",
  "difficultyBucket": 2,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "B23",
  "difficultyReason": "자연로그가 포함된 함수의 극값 조건으로부터 미정계수를 역산하고 극값 존재를 확인하는 구조변형 문항이다.",
  "level": "중",
  "item4slot": {
    "given": ["함수", "로그함수"],
    "goal": ["합"],
    "method": ["미분", "도함수"],
    "condition": []
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

# **Q04**

* 형식: 객관식  
* 배점: 5

## **발문**

점 \$(0, k)\$에서 곡선 \$y \= x^2 \\ln x\$ (\$x \> 0\$)에 서로 다른 두 개의 접선을 그을 수 있도록 하는 실수 \$k\$의 값의 범위는?

## **선지**

① \$0 \< k \< \\frac{1}{2e^3}\$ ② \$0 \< k \< \\frac{1}{e^3}\$ ③ \$-\\frac{1}{2e^3} \< k \< 0\$ ④ \$k \< \\frac{1}{2e^3}\$ ⑤ \$k \> \\frac{1}{2e^3}\$

## **정답**

①

## **해설**

\$f(x) \= x^2 \\ln x\$ (\$x \> 0\$)이라 하면 \$f'(x) \= 2x \\ln x \+ x\$이다.  
곡선 위의 점 \$(t, t^2 \\ln t)\$ (\$t \> 0\$)에서의 접선의 방정식은  
\$\$y \= (2t \\ln t \+ t)(x \- t) \+ t^2 \\ln t\$\$  
이 접선이 점 \$(0, k)\$를 지나므로 \$x \= 0, y \= k\$를 대입하면  
\$\$k \= \-t(2t \\ln t \+ t) \+ t^2 \\ln t \= \-t^2 (\\ln t \+ 1)\$\$  
곡선에 서로 다른 두 개의 접선을 그을 수 있으려면 \$t \> 0\$에서 방정식 \$-t^2(\\ln t \+ 1\) \= k\$가 서로 다른 두 실근을 가져야 한다.  
\$g(t) \= \-t^2(\\ln t \+ 1)\$ (\$t \> 0\$)이라 하면  
\$\$g'(t) \= \-2t(\\ln t \+ 1\) \- t^2 \\cdot \\frac{1}{t} \= \-t(2\\ln t \+ 3)\$\$  
\$t \> 0\$이므로 \$g'(t) \= 0\$에서 \$\\ln t \= \-\\frac{3}{2}\$, 즉 \$t \= e^{-\\frac{3}{2}}\$이다.

* \$0 \< t \< e^{-\\frac{3}{2}}\$일 때 \$g'(t) \> 0\$ (증가)  
* \$t \> e^{-\\frac{3}{2}}\$일 때 \$g'(t) \< 0\$ (감소)  
* 극댓값: \$g\\left(e^{-\\frac{3}{2}}\\right) \= \-e^{-3}\\left(-\\frac{3}{2} \+ 1\\right) \= \\frac{1}{2e^3}\$  
* \$\\lim\_{t\\to 0+} g(t) \= 0\$ (참고: \$\\lim\_{t\\to 0+} t^2 \\ln t \= 0\$), \$\\lim\_{t\\to\\infty} g(t) \= \-\\infty\$  
  따라서 직선 \$y \= k\$와 곡선 \$y \= g(t)\$ (\$t \> 0\$)가 서로 다른 두 점에서 만나도록 하는 실수 \$k\$의 범위는  
  \$\$0 \< k \< \\frac{1}{2e^3}\$\$  
  이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "외부 점에서의 접선 개수 조건을 방정식의 실근 개수로 해석하는 문항" },
  "solutionPlan": { "status": "UNSUPPORTED", "reason": "t>0에서 g(t)=-t^2(ln t + 1)의 그래프(t->0+에서 빈 원 (0,0) 극한, 극댓점 (e^{-3/2}, 1/(2e^3)), (e^{-1}, 0) 통과 후 -∞로 감소)와 가로선 y=k가 서로 다른 두 점에서 만나는 구간 0 < k < 1/(2e^3)을 표시한 개형 그래프" }
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
  "conceptClusterKey": "LOG_DERIVATIVE_TANGENT_COUNT_DOMAIN",
  "primaryMethod": "접점 $(t, t^2\\ln t)$의 접선이 $(0,k)$를 지나는 방정식 $k=-t^2(\\ln t+1)$ ($t>0$)을 세우고 $g(t)$의 극댓값 $\\frac{1}{2e^3}$과 우극한 $0$으로 두 실근 범위를 구한다.",
  "decisiveStep": "정의역 $t>0$에서 $\\lim_{t\\to 0+} g(t)=0$임을 확인해 $k\\le 0$에서는 교점이 $1$개뿐이고 $0<k<\\frac{1}{2e^3}$에서만 $2$개임을 판별한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "로그함수의 미분", "l4": "ln x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CONCEPT_MIX",
  "difficultyBucket": 3,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "B34",
  "difficultyReason": "외부 점에서의 접선 개수 조건을 정의역 t>0에서의 극댓값 및 우극한 분석으로 전환하는 사고확장 문항이다.",
  "level": "상",
  "item4slot": {
    "given": ["로그함수", "접선", "점"],
    "goal": ["실수", "부등식"],
    "method": ["미분", "도함수"],
    "condition": ["실근"]
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

# **Q05**

* 형식: 서답형  
* 배점: 5

## **발문**

\$a \> 1\$인 상수 \$a\$와 상수 \$b\$에 대하여 함수  
\$\$f(x) \= x^2 \\ln x \- ax^2 \+ b \\quad (x \> 0)\$\$  
가 \$f(1) \= \-1\$을 만족시키고, \$x \> 0\$에서 함수 \$f(x)\$의 극솟값이 \$1 \- \\frac{1}{2}e^3\$일 때, \$10a \+ b\$의 값을 구하시오.

## **선지**

없음

## **정답**

\$21\$

## **해설**

\$f(1) \= \-1\$에서 \$\\ln 1 \= 0\$이므로  
\$\$-a \+ b \= \-1 \\implies b \= a \- 1\$\$  
이제 \$f(x)\$를 미분하면 (\$x \> 0\$)  
\$\$f'(x) \= 2x \\ln x \+ x \- 2ax \= x(2\\ln x \+ 1 \- 2a)\$\$  
\$x \> 0\$이므로 \$f'(x) \= 0\$에서  
\$\$\\ln x \= a \- \\frac{1}{2} \\implies x \= e^{a \- \\frac{1}{2}}\$\$  
\$0 \< x \< e^{a \- \\frac{1}{2}}\$일 때 \$f'(x) \< 0\$이고, \$x \> e^{a \- \\frac{1}{2}}\$일 때 \$f'(x) \> 0\$이므로 함수 \$f(x)\$는 \$x \= e^{a \- \\frac{1}{2}}\$에서 유일한 극솟값을 갖는다.  
극솟값을 계산하면  
\$\$\\begin{aligned}  
f\\left(e^{a \- \\frac{1}{2}}\\right) &= e^{2a \- 1}\\left(a \- \\frac{1}{2}\\right) \- a e^{2a \- 1} \+ a \- 1 \\  
&= a \- 1 \- \\frac{1}{2}e^{2a \- 1}  
\\end{aligned}\$\$  
조건에서 극솟값이 \$1 \- \\frac{1}{2}e^3\$이므로  
\$\$a \- 1 \- \\frac{1}{2}e^{2a \- 1} \= 1 \- \\frac{1}{2}e^3\$\$  
여기서 \$g(a) \= a \- 1 \- \\frac{1}{2}e^{2a \- 1}\$이라 하면 \$a \> 1\$에서 \$g'(a) \= 1 \- e^{2a \- 1} \< 0\$이므로 \$g(a)\$는 순감소한다.  
한편 \$a \= 2\$일 때 \$g(2) \= 2 \- 1 \- \\frac{1}{2}e^3 \= 1 \- \\frac{1}{2}e^3\$이므로 \$a \> 1\$인 해는 \$a \= 2\$로 유일하다.  
따라서 \$b \= 2 \- 1 \= 1\$이므로 구하는 값은  
\$\$10a \+ b \= 10 \\times 2 \+ 1 \= 21\$\$  
이다.

```
{
  "questionPlan": { "status": "EXEMPT", "reason": "로그함수의 함숫값과 극솟값 조건으로 두 미정계수를 역산하는 순수 수식 문항" },
  "solutionPlan": { "status": "EXEMPT", "reason": "도함수로 극솟점을 구하고 단조성을 이용해 유일한 a=2를 확정하는 대수 문항" }
}
```

```
{
  "sourceQid": "TYPE_BANK_Q05",
  "variationType": "DEEPENING",
  "standardCourse": "미적분II",
  "courseKey": "H22-M2",
  "curriculum": "2022",
  "standardUnitKey": "H22-M2-03",
  "subUnitKey": null,
  "conceptClusterKey": "LOG_DERIVATIVE_EXTREMUM_MONOTONICITY_UNIQUE",
  "primaryMethod": "$f'(x)=x(2\\ln x+1-2a)$로 극솟점 $e^{a-1/2}$을 구해 $a-1-\\frac{1}{2}e^{2a-1}=1-\\frac{1}{2}e^3$을 세우고, $a>1$에서의 순감소성으로 $a=2, b=1$을 유일 확정한다.",
  "decisiveStep": "방정식 $a-1-\\frac{1}{2}e^{2a-1}=1-\\frac{1}{2}e^3$에서 $g'(a)=1-e^{2a-1}<0$ ($a>1$)임을 확인해 $a=2$의 유일성을 보장한다.",
  "rpm": { "majorUnit": "미분법", "midUnit": "지수함수와 로그함수의 미분", "l3": "로그함수의 미분", "l4": "ln x형" },
  "ptTplCandidate": {
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "why": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 공식 PT/TPL 후보로 지정됨"
  },
  "crossConceptKeys": [],
  "conditionKeys": [],
  "integrationPattern": "CONCEPT_MIX",
  "difficultyBucket": 4,
  "difficultyConfidence": "high",
  "difficultyBoundaryFlag": "NONE",
  "difficultyReason": "극솟값 조건에서 얻은 초월방정식의 해를 도함수의 부호(단조성)를 이용해 유일하게 확정해야 하는 심화 문항이다.",
  "level": "상",
  "item4slot": {
    "given": ["함수", "로그함수"],
    "goal": ["합"],
    "method": ["미분", "도함수"],
    "condition": []
  },
  "hold": "DIRECT_BINDING_GAP: high2-calculus-calculus2.json에서 H2-CALC-RPM-070의 subUnitKey 미결속, PT/TPL은 공식 후보 적용"
}
```

