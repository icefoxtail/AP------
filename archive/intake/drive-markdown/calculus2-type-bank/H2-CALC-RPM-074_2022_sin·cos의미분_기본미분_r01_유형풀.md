

```
{
  "stem": "H2-CALC-RPM-074_2022_sin·cos의미분_기본미분_r01_유형풀",
  "mode": "TYPE_BANK",
  "round": 1,
  "targetRpmId": "H2-CALC-RPM-074",
  "grade": "고2",
  "subject": "미적분II",
  "curriculum": "2022",
  "questionCount": 5,
  "generatedAt": "2026-11-22"
}
```

# **Q01**

* 형식: 객관식  
* 배점: 4점

## **발문**

함수 \$f(x) \= e^x(\\sin x \+ 2\\cos x)\$에 대하여 \$f'(0)\$의 값은?

## **선지**

① \$-1\$  
② \$1\$  
③ \$2\$  
④ \$3\$  
⑤ \$4\$

## **정답**

④

## **해설**

곱의 미분법과 삼각함수의 미분법을 적용하면  
\$\$\\begin{aligned}  
f'(x) &= e^x(\\sin x \+ 2\\cos x) \+ e^x(\\cos x \- 2\\sin x) \\  
&= e^x(-\\sin x \+ 3\\cos x)  
\\end{aligned}\$\$  
\$x \= 0\$을 대입하면 \$\\sin 0 \= 0\$, \$\\cos 0 \= 1\$이므로  
\$\$f'(0) \= e^0(0 \+ 3 \\cdot 1\) \= 3\$\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "지수함수와 삼각함수의 곱으로 이루어진 함수의 기본 도함수 및 미분계수를 구하는 순수 계산 문항으로 시각 자료가 필요하지 않다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "곱의 미분법과 $\\sin x, \\cos x$ 도함수 공식을 적용해 $x=0$을 대입하는 대수 계산만으로 완결된다."
  }
}
```

```
{
  "qNo": 1,
  "role": "기본형",
  "rpm": "H2-CALC-RPM-074",
  "standardUnitKey": "H22-M2-04",
  "subUnitKey": null,
  "curriculum": "2022",
  "difficultyBucket": 1,
  "format": "객관식",
  "score": 4,
  "ptTplCandidate": {
    "mappingStatus": "DIRECT_BINDING_GAP",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "bindingStatus": "MISSING"
  },
  "item4slot": [
    "함수",
    "지수함수",
    "도함수",
    "미분"
  ],
  "answer": "④"
}
```

# **Q02**

* 형식: 객관식  
* 배점: 4.5점

## **발문**

함수 \$f(x) \= a\\sin x \+ b\\cos x\$에 대하여 곡선 \$y \= f(x)\$ 위의 점 \$\\left(\\frac{\\pi}{6}, 2\\right)\$에서의 접선의 기울기가 \$0\$일 때, 두 실수 \$a, b\$에 대하여 \$a^2 \+ b^2\$의 값은?

## **선지**

① \$2\$  
② \$3\$  
③ \$4\$  
④ \$5\$  
⑤ \$8\$

## **정답**

③

## **해설**

곡선 \$y \= f(x)\$가 점 \$\\left(\\frac{\\pi}{6}, 2\\right)\$를 지나므로  
\$\$f\\left(\\frac{\\pi}{6}\\right) \= \\frac{1}{2}a \+ \\frac{\\sqrt{3}}{2}b \= 2 \\implies a \+ \\sqrt{3}b \= 4 \\quad \\cdots \\text{①}\$\$  
한편, \$f'(x) \= a\\cos x \- b\\sin x\$이고 \$x \= \\frac{\\pi}{6}\$에서의 접선의 기울기가 \$0\$이므로  
\$\$f'\\left(\\frac{\\pi}{6}\\right) \= \\frac{\\sqrt{3}}{2}a \- \\frac{1}{2}b \= 0 \\implies b \= \\sqrt{3}a \\quad \\cdots \\text{②}\$\$  
②를 ①에 대입하면 \$a \+ 3a \= 4\$에서 \$a \= 1\$이고, \$b \= \\sqrt{3}\$이다.  
따라서  
\$\$a^2 \+ b^2 \= 1^2 \+ (\\sqrt{3})^2 \= 4\$\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "함숫값 조건과 접선의 기울기 조건으로부터 삼각함수 일차결합의 미정계수를 역산하는 문항으로 그림이 필요하지 않다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "$f(\\pi/6)=2$와 $f'(\\pi/6)=0$ 두 조건을 연립일차방정식으로 풀어 계수를 결정하는 대수 절차로 충분하다."
  }
}
```

```
{
  "qNo": 2,
  "role": "구조변형",
  "rpm": "H2-CALC-RPM-074",
  "standardUnitKey": "H22-M2-04",
  "subUnitKey": null,
  "curriculum": "2022",
  "difficultyBucket": 2,
  "format": "객관식",
  "score": 4.5,
  "ptTplCandidate": {
    "mappingStatus": "DIRECT_BINDING_GAP",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "bindingStatus": "MISSING"
  },
  "item4slot": [
    "함수",
    "도함수",
    "접선",
    "실수"
  ],
  "answer": "③"
}
```

# **Q03**

* 형식: 객관식  
* 배점: 4.5점

## **발문**

함수 \$f(x) \= (2x \- 1)\\sin x \+ (x \+ 2)\\cos x\$에 대하여  
\$\$\\lim\_{h \\to 0} \\frac{f\\left(\\frac{\\pi}{2} \+ 2h\\right) \- f\\left(\\frac{\\pi}{2} \- h\\right)}{h}\$\$  
의 값은?

## **선지**

① \$-\\frac{\\pi}{2}\$  
② \$-\\pi\$  
③ \$\\frac{\\pi}{2}\$  
④ \$\\frac{3\\pi}{2}\$  
⑤ \$-\\frac{3\\pi}{2}\$

## **정답**

⑤

## **해설**

미분계수의 정의에 의하여  
\$\$\\begin{aligned}  
\\lim\_{h \\to 0} \\frac{f\\left(\\frac{\\pi}{2} \+ 2h\\right) \- f\\left(\\frac{\\pi}{2} \- h\\right)}{h} &= \\lim\_{h \\to 0} \\left{ 2\\cdot\\frac{f\\left(\\frac{\\pi}{2} \+ 2h\\right) \- f\\left(\\frac{\\pi}{2}\\right)}{2h} \+ \\frac{f\\left(\\frac{\\pi}{2} \- h\\right) \- f\\left(\\frac{\\pi}{2}\\right)}{-h} \\right} \\  
&= 3f'\\left(\\frac{\\pi}{2}\\right)  
\\end{aligned}\$\$  
곱의 미분법으로 \$f'(x)\$를 구하면  
\$\$\\begin{aligned}  
f'(x) &= 2\\sin x \+ (2x \- 1)\\cos x \+ \\cos x \- (x \+ 2)\\sin x \\  
&= \-x\\sin x \+ 2x\\cos x  
\\end{aligned}\$\$  
\$x \= \\frac{\\pi}{2}\$를 대입하면 \$\\sin\\frac{\\pi}{2} \= 1\$, \$\\cos\\frac{\\pi}{2} \= 0\$이므로  
\$\$f'\\left(\\frac{\\pi}{2}\\right) \= \-\\frac{\\pi}{2} \\cdot 1 \+ \\pi \\cdot 0 \= \-\\frac{\\pi}{2}\$\$  
따라서 구하는 값은 \$3 \\times \\left(-\\frac{\\pi}{2}\\right) \= \-\\frac{3\\pi}{2}\$이다.

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "미분계수의 극한 표현과 다항·삼각함수 곱의 미분법을 결합한 순수 해석 문항으로 시각 자료가 필요하지 않다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "극한식을 $3f'(\\pi/2)$로 변형한 뒤 $f'(x)$를 정리해 대입하는 수식 전개만으로 완결된다."
  }
}
```

```
{
  "qNo": 3,
  "role": "구조변형",
  "rpm": "H2-CALC-RPM-074",
  "standardUnitKey": "H22-M2-04",
  "subUnitKey": null,
  "curriculum": "2022",
  "difficultyBucket": 2,
  "format": "객관식",
  "score": 4.5,
  "ptTplCandidate": {
    "mappingStatus": "DIRECT_BINDING_GAP",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "bindingStatus": "MISSING"
  },
  "item4slot": [
    "함수",
    "도함수",
    "극한",
    "미분"
  ],
  "answer": "⑤"
}
```

# **Q04**

* 형식: 객관식  
* 배점: 5점

## **발문**

닫힌구간 \$\[0, 2\\pi\]\$에서 방정식 \$e^{-x}(\\sin x \+ \\cos x) \= k\$가 서로 다른 두 실근을 갖도록 하는 실수 \$k\$의 값의 범위는?

## **선지**

① \$-e^{-\\pi} \< k \< e^{-2\\pi}\$  
② \$-e^{-\\pi} \< k \\le e^{-2\\pi}\$  
③ \$-e^{-\\pi} \\le k \\le e^{-2\\pi}\$  
④ \$e^{-2\\pi} \< k \< 1\$  
⑤ \$-e^{-\\pi} \< k \< 1\$

## **정답**

②

## **해설**

\$f(x) \= e^{-x}(\\sin x \+ \\cos x)\$ (\$0 \\le x \\le 2\\pi\$)라 하자. 도함수를 구하면  
\$\$\\begin{aligned}  
f'(x) &= \-e^{-x}(\\sin x \+ \\cos x) \+ e^{-x}(\\cos x \- \\sin x) \\  
&= \-2e^{-x}\\sin x  
\\end{aligned}\$\$  
\$e^{-x} \> 0\$이므로 닫힌구간 \$\[0, 2\\pi\]\$에서 \$f'(x) \= 0\$인 점은 \$x \= 0, \\pi, 2\\pi\$이고 증감은 다음과 같다.

* \$0 \< x \< \\pi\$일 때 \$\\sin x \> 0\$이므로 \$f'(x) \< 0\$ (감소)  
* \$\\pi \< x \< 2\\pi\$일 때 \$\\sin x \< 0\$이므로 \$f'(x) \> 0\$ (증가)

따라서 \$f(x)\$는 \$x \= \\pi\$에서 극소이자 최솟값 \$f(\\pi) \= \-e^{-\\pi}\$를 갖고, 양 끝점에서의 함숫값은  
\$\$f(0) \= e^0(0 \+ 1\) \= 1, \\qquad f(2\\pi) \= e^{-2\\pi}(0 \+ 1\) \= e^{-2\\pi}\$\$  
이며 \$-e^{-\\pi} \< e^{-2\\pi} \< 1\$이다.  
그러므로 곡선 \$y \= f(x)\$와 직선 \$y \= k\$가 닫힌구간 \$\[0, 2\\pi\]\$에서 서로 다른 두 점에서 만나려면 \$k\$는 극솟값보다 크고 오른쪽 끝점의 함숫값 이하이어야 하므로  
\$\$-e^{-\\pi} \< k \\le e^{-2\\pi}\$\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "학생이 직접 도함수 $f'(x) = -2e^{-x}\\sin x$의 부호 변화와 구간 양 끝점 함숫값을 비교해 실근 개수를 판별하도록 설계된 문항이므로 발문에 그래프를 제공하지 않는다."
  },
  "solutionPlan": {
    "status": "UNSUPPORTED",
    "reason": "좌표범위 x in [0, 2pi], y in [-0.15, 1.1]에서 곡선 y = e^{-x}(sin x + cos x)를 그리되, 시작점 (0, 1), 극솟점 (pi, -e^{-pi}), 끝점 (2pi, e^{-2pi})을 닫힌 점으로 표시하고, 교점 2개가 생기는 수평선 y = k (-e^{-pi} < k <= e^{-2pi})의 경계 위치(특히 k = e^{-2pi}일 때 끝점 포함 2교점)를 시각적으로 보여주는 작도 명세가 필요하다."
  }
}
```

```
{
  "qNo": 4,
  "role": "사고확장",
  "rpm": "H2-CALC-RPM-074",
  "standardUnitKey": "H22-M2-04",
  "subUnitKey": null,
  "curriculum": "2022",
  "difficultyBucket": 3,
  "format": "객관식",
  "score": 5,
  "ptTplCandidate": {
    "mappingStatus": "DIRECT_BINDING_GAP",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "bindingStatus": "MISSING"
  },
  "item4slot": [
    "방정식",
    "실근",
    "그래프",
    "도함수"
  ],
  "answer": "②"
}
```

# **Q05**

* 형식: 서답형  
* 배점: 5점

## **발문**

네 실수 \$a, b, c, d\$에 대하여 함수  
\$\$f(x) \= (x^2 \+ ax \+ b)\\sin x \+ (cx \+ d)\\cos x\$\$  
가 모든 실수 \$x\$에 대하여 \$f'(x) \= (x^2 \+ 3x \+ 1)\\cos x\$를 만족시킬 때, \$a^2 \+ b^2 \+ c^2 \+ d^2\$의 값을 구하시오.

## **선지**

없음

## **정답**

\$23\$

## **해설**

\$f(x)\$를 곱의 미분법으로 미분하여 \$\\sin x\$와 \$\\cos x\$에 대해 정리하면  
\$\$\\begin{aligned}  
f'(x) &= (2x \+ a)\\sin x \+ (x^2 \+ ax \+ b)\\cos x \+ c\\cos x \- (cx \+ d)\\sin x \\  
&= \\bigl{(2 \- c)x \+ (a \- d)\\bigr}\\sin x \+ \\bigl{x^2 \+ ax \+ (b \+ c)\\bigr}\\cos x  
\\end{aligned}\$\$  
이 식이 모든 실수 \$x\$에 대하여 \$(x^2 \+ 3x \+ 1)\\cos x\$와 같아야 하므로 항등식의 계수 비교에 의하여

* \$\\sin x\$의 계수: \$2 \- c \= 0\$, \$a \- d \= 0\$  
* \$\\cos x\$의 계수: \$a \= 3\$, \$b \+ c \= 1\$

따라서 \$a \= 3\$, \$d \= 3\$, \$c \= 2\$, \$b \= \-1\$이다.  
그러므로  
\$\$a^2 \+ b^2 \+ c^2 \+ d^2 \= 3^2 \+ (-1)^2 \+ 2^2 \+ 3^2 \= 9 \+ 1 \+ 4 \+ 9 \= 23\$\$

```
{
  "questionPlan": {
    "status": "EXEMPT",
    "reason": "도함수 식으로부터 원함수의 다항식 계수를 역산하는 항등식 구조의 미분 문항으로 시각 자료가 필요하지 않다."
  },
  "solutionPlan": {
    "status": "EXEMPT",
    "reason": "곱의 미분법으로 $f'(x)$를 전개한 뒤 $\\sin x, \\cos x$ 항의 계수를 비교해 연립하는 대수 풀이로 완결된다."
  }
}
```

```
{
  "qNo": 5,
  "role": "사고확장",
  "rpm": "H2-CALC-RPM-074",
  "standardUnitKey": "H22-M2-04",
  "subUnitKey": null,
  "curriculum": "2022",
  "difficultyBucket": 4,
  "format": "서답형",
  "score": 5,
  "ptTplCandidate": {
    "mappingStatus": "DIRECT_BINDING_GAP",
    "problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION",
    "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION",
    "bindingStatus": "MISSING"
  },
  "item4slot": [
    "함수",
    "도함수",
    "미분",
    "실수"
  ],
  "answer": "$23$"
}
```

