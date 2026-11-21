

```
{"stem": "25_매산여고_2학기_중간_고2_수학II_유사", "sourceArchiveFile": "original/high/h2/2mid/25_매산여고_2학기_중간_고2_수학II.js", "examFolder": "2mid", "grade": "고2", "subject": "수학II", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-21"}
```

## Q01

- 형식: 객관식  
- 배점: 3.5

### 발문

\$\\lim\_{x\\to \-2}\\dfrac{x^2+5x+6}{x+2}\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

②

### 해설

\$x\\ne \-2\$일 때 \$\\dfrac{x^2+5x+6}{x+2} \= \\dfrac{(x+2)(x+3)}{x+2} \= x+3\$이므로

\$\$\\lim\_{x\\to \-2}\\frac{x^2+5x+6}{x+2} \= \\lim\_{x\\to \-2}(x+3) \= \-2+3 \= 1\$\$

따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q01", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "분자 x^2+5x+6=(x+2)(x+3)에서 공통인수 x+2를 약분해 x=-2 대입으로 극한값 1 산출", "decisiveStep": "(x+2) 약분 후 lim(x+3) = 1", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "함수의 극한", "l4": "극한값 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": null, "why": "함수의 극한 > 극한값 계산 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "0/0 꼴 유리식 극한을 이차식 인수분해와 약분으로 구하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["극한"], "goal": ["극한", "값"], "method": ["인수분해", "극한"], "condition": []}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.5

### 발문

함수 \$y=f(x)\$의 그래프가 그림과 같을 때, \$\\lim\_{x\\to 0-}f(x) \+ \\lim\_{x\\to 1+}f(x)\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

④

### 해설

그래프에서 \$x\\to 0-\$일 때 곡선은 열린 점 \$(0,\\ 2)\$에 가까워지므로 \$\\lim\_{x\\to 0-}f(x) \= 2\$이고, \$x\\to 1+\$일 때 직선은 열린 점 \$(1,\\ \-1)\$에서 시작하므로 \$\\lim\_{x\\to 1+}f(x) \= \-1\$이다.

따라서 구하는 값은 \$2 \+ (-1) \= 1\$이다. 정답은 ④이다.

```
{"figureType": "piecewise_graph_limits", "description": "구간 (-1,0)에서 열린 점 (0,2)로 향하는 곡선과 x>1에서 열린 점 (1,-1)에서 시작하는 직선, x=0과 x=1에서의 함숫값 점이 표시된 함수 y=f(x)의 그래프", "elements": ["coordinate axes", "curve approaching open circle (0,2) from left", "line starting at open circle (1,-1) to right", "solid dots at x=0 and x=1"]}
```

```
{"sourceQid": "Q02", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "그래프에서 x->0- 좌극한 2와 x->1+ 우극한 -1을 각각 읽어 합 1 계산", "decisiveStep": "lim_{x->0-} f(x) = 2, lim_{x->1+} f(x) = -1", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "함수의 극한", "l4": "좌극한·우극한"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": "TPL_LIMIT_DIRECTIONAL_APPROACH", "why": "함수의 극한 > 좌극한·우극한 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 그래프에서 좌극한과 우극한의 높이를 바로 읽어 더하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["곡선", "극한"], "goal": ["합", "값"], "method": ["극한"], "condition": []}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.6

### 발문

함수 \$f(x)=\\begin{cases}x^2+3x&(x\\le 1)\\a&(x\>1)\\end{cases}\$이 \$x=1\$에서 연속일 때, 상수 \$a\$의 값은?

### 선지

① \$4\$ ② \$2\$ ③ \$3\$ ④ \$5\$ ⑤ \$6\$

### 정답

①

### 해설

\$x=1\$에서 연속이므로 \$\\lim\_{x\\to 1+}f(x) \= f(1)\$이어야 한다.

\$\$a \= 1^2 \+ 3(1) \= 4\$\$

따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q03", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-02", "subUnitKey": "H15-M2-02-CONTINUITY", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "x=1에서 함숫값 f(1)=1+3=4와 우극한 a를 일치시켜 a=4 산출", "decisiveStep": "f(1) = 4 = a", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 연속", "l3": "연속 조건", "l4": "구간별 함수"}, "ptTplCandidate": {"problemTypeKey": "PT_CONTINUITY_CONDITION", "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH", "why": "연속 조건 > 구간별 함수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 함수의 경계점 x=1에서 함숫값과 우극한을 같게 두는 기초 문항이다.", "level": "하", "item4slot": {"given": ["구간", "실수"], "goal": ["값"], "method": ["연속"], "condition": []}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.6

### 발문

두 함수 \$f(x)=\\begin{cases}2x-5&(x\\ge 1)\\-x+4&(x\<1)\\end{cases}\$, \$g(x)=3^x+k\$에 대하여 함수 \$f(x)g(x)\$가 \$x=1\$에서 연속일 때, 상수 \$k\$의 값은?

### 선지

① \$-9\$ ② \$-6\$ ③ \$-4\$ ④ \$-1\$ ⑤ \$-3\$

### 정답

⑤

### 해설

\$x\\to 1-\$일 때 \$f(x)\\to \-1+4=3\$이고 \$f(1)=2-5=-3\$이다.

곱함수 \$f(x)g(x)\$가 \$x=1\$에서 연속이려면 \$3(3+k) \= \-3(3+k)\$이어야 하므로 \$6(3+k)=0\$, 즉 \$k \= \-3\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q04", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-02", "subUnitKey": "H15-M2-02-CONTINUITY", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "x=1 불연속 함수 f(x)와의 곱이 연속이 되도록 연속인 g(1)=3+k=0을 풀어 k=-3 산출", "decisiveStep": "g(1) = 3 + k = 0 -> k = -3", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 연속", "l3": "연속 조건", "l4": "미정계수"}, "ptTplCandidate": {"problemTypeKey": "PT_CONTINUITY_CONDITION", "templateKey": null, "why": "연속 조건 > 미정계수 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "불연속 함수와 연속 함수의 곱이 경계점에서 연속이 되기 위한 g(1)=0 조건을 적용하는 문항이다.", "level": "하", "item4slot": {"given": ["구간", "실수"], "goal": ["값"], "method": ["연속", "극한"], "condition": []}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.7

### 발문

함수 \$f(x)=3x^2-4x+5\$의 \$x=2\$에서의 미분계수의 값은?

### 선지

① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$

### 정답

③

### 해설

\$f'(x) \= 6x - 4\$이므로 \$f'(2) \= 6(2) - 4 \= 8\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q05", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "다항함수 f(x)=3x^2-4x+5를 미분한 f'(x)=6x-4에 x=2를 대입해 8 계산", "decisiveStep": "f'(2) = 6(2) - 4 = 8", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "도함수", "l4": "도함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION", "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION", "why": "도함수 > 도함수 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차다항식의 도함수를 구해 x=2에서의 미분계수를 바로 계산하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["이차함수"], "goal": ["미분계수", "값"], "method": ["도함수"], "condition": []}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.7

### 발문

함수 \$f(x)=x^2-4x+5\$에 대하여 \$\\lim\_{h\\to 0}\\dfrac{f(5+h)-f(5)}{2h}\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

주어진 극한은 \$\\dfrac{1}{2}\\lim\_{h\\to 0}\\dfrac{f(5+h)-f(5)}{h} \= \\dfrac{1}{2}f'(5)\$이다.

\$f'(x) \= 2x - 4\$이므로 \$f'(5) \= 10 - 4 \= 6\$이고, 구하는 값은 \$\\dfrac{1}{2}\\times 6 \= 3\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q06", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-03", "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "극한을 (1/2)f'(5)로 변형하고 f'(x)=2x-4에서 f'(5)=6을 대입해 3 계산", "decisiveStep": "(1/2)f'(5) = (1/2)*6 = 3", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분계수", "l4": "정의로 미분계수"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_DEFINITION", "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION", "why": "미분계수 > 정의로 미분계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미분계수의 정의 식에서 분모 계수 2를 분리해 (1/2)f'(5)를 계산하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["이차함수", "극한"], "goal": ["값"], "method": ["미분계수", "도함수"], "condition": []}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.8

### 발문

함수 \$f(x)\$에 대하여 \$x\$의 값이 \$1\$에서 \$3\$까지 변할 때의 평균변화율은 \$3\$이고, \$x\$의 값이 \$3\$에서 \$6\$까지 변할 때의 평균변화율은 \$8\$이다. \$x\$의 값이 \$1\$에서 \$6\$까지 변할 때의 평균변화율은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

④

### 해설

\$f(3)-f(1) \= 3(3-1) \= 6\$, \$f(6)-f(3) \= 8(6-3) \= 24\$이므로

\$\$\\frac{f(6)-f(1)}{6-1} \= \\frac{6+24}{5} \= 6\$\$

따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q07", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-03", "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "두 구간의 함숫값 변화량 3*(3-1)=6과 8*(6-3)=24를 더해 전체 길이 5로 나누어 평균변화율 6 계산", "decisiveStep": "(6 + 24) / (6 - 1) = 6", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분계수", "l4": "평균변화율·순간변화율"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_RATE_RELATION", "templateKey": "TPL_AVERAGE_RATE_DERIVATIVE_LINK", "why": "미분계수 > 평균변화율·순간변화율 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인접한 두 구간의 평균변화율로부터 전체 구간의 가중 평균변화율을 구하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["구간"], "goal": ["값"], "method": ["미분계수"], "condition": []}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.8

### 발문

함수 \$f(x)=(2x+5)g(x)\$이고, 곡선 \$y=g(x)\$ 위의 점 \$(1,\\ \-4)\$에서의 접선의 기울기가 \$3\$일 때, \$f'(1)\$의 값은?

### 선지

① \$13\$ ② \$9\$ ③ \$11\$ ④ \$15\$ ⑤ \$17\$

### 정답

①

### 해설

\$g(1)=-4,\\ g'(1)=3\$이고 곱의 미분법에 의하여 \$f'(x) \= 2g(x) \+ (2x+5)g'(x)\$이므로

\$\$f'(1) \= 2(-4) \+ 7(3) \= \-8 \+ 21 \= 13\$\$

따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q08", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "곱의 미분법 f'(x)=2g(x)+(2x+5)g'(x)에 g(1)=-4, g'(1)=3을 대입해 f'(1)=13 계산", "decisiveStep": "2(-4) + 7(3) = 13", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "도함수", "l4": "미분법"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION", "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION", "why": "도함수 > 미분법 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "접선 조건에서 g(1)과 g'(1)을 읽어 곱의 미분법에 바로 대입하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["곡선", "기울기"], "goal": ["미분계수", "값"], "method": ["도함수", "미분계수"], "condition": []}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 3.9

### 발문

함수 \$f(x)=\\begin{cases}x^3+ax&(x\<1)\\bx^2-2x+3&(x\\ge 1)\\end{cases}\$이 \$x=1\$에서 미분가능할 때, \$a+b\$의 값은? (단, \$a,\\ b\$는 상수)

### 선지

① \$6\$ ② \$8\$ ③ \$10\$ ④ \$12\$ ⑤ \$14\$

### 정답

③

### 해설

\$x=1\$에서 연속 조건은 \$1+a \= b-2+3 \\implies a \= b\$이다.

좌미분계수와 우미분계수의 일치 조건은 \$3(1)^2+a \= 2b(1)-2 \\implies 3+a \= 2b-2\$이다.

\$a=b\$를 대입하면 \$3+b=2b-2 \\implies b=5,\\ a=5\$이므로 \$a+b=10\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q09", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "x=1 연속 조건 1+a=b+1과 미분계수 일치 조건 3+a=2b-2를 연립해 a=b=5, 합 10 산출", "decisiveStep": "a=b 및 3+a=2b-2 -> a=5, b=5", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분가능성과 연속", "l4": "미분가능 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION", "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION", "why": "미분가능성과 연속 > 미분가능 조건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 다항함수의 경계점 미분가능성을 연속 조건과 도함수 일치 조건으로 연립해 푸는 표준 문항이다.", "level": "중", "item4slot": {"given": ["구간", "실수"], "goal": ["합", "값"], "method": ["미분계수", "연속"], "condition": ["미분가능"]}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 3.9

### 발문

함수 \$f(x)=\\dfrac{\|x^3-8\|}{x-2}\$에서 \$\\lim\_{x\\to 2+}f(x)=a\$, \$\\lim\_{x\\to 2-}f(x)=b\$라 할 때, \$a-b\$의 값은? (단, \$a,\\ b\$는 상수)

### 선지

① \$0\$ ② \$6\$ ③ \$12\$ ④ \$18\$ ⑤ \$24\$

### 정답

⑤

### 해설

\$x\\to 2+\$일 때 \$x^3-8\>0\$이므로 \$f(x) \= \\dfrac{(x-2)(x^2+2x+4)}{x-2} \= x^2+2x+4 \\to 12\$, 즉 \$a=12\$이다.

\$x\\to 2-\$일 때 \$x^3-8\<0\$이므로 \$f(x) \= \-(x^2+2x+4) \\to \-12\$, 즉 \$b=-12\$이다.

따라서 \$a-b \= 12 - (-12) \= 24\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q10", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "|x^3-8|/(x-2)의 x->2+ 극한 12와 x->2- 극한 -12를 구해 차 a-b=24 계산", "decisiveStep": "a = 12, b = -12 -> a-b = 24", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "함수의 극한", "l4": "좌극한·우극한"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": "TPL_LIMIT_DIRECTIONAL_APPROACH", "why": "함수의 극한 > 좌극한·우극한 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 식의 부호에 따라 좌우 극한을 나누어 약분 계산하는 표준 문항이다.", "level": "중", "item4slot": {"given": ["절댓값", "극한"], "goal": ["차", "값"], "method": ["인수분해", "극한"], "condition": []}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 3.9

### 발문

실수 전체의 집합에서 정의된 두 함수 \$f(x),\\ g(x)\$에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?

ㄱ. \$\\lim\_{x\\to\\infty}xf(x)\$의 값이 존재하면 \$\\lim\_{x\\to\\infty}f(x)=0\$이다. ㄴ. \$\\lim\_{x\\to\\infty}\\dfrac{1}{f(x)}=0\$이면 \$\\lim\_{x\\to\\infty}f(x)\$의 값이 존재한다. ㄷ. \$\\lim\_{x\\to a}f(x)\$와 \$\\lim\_{x\\to a}{f(x)+g(x)}\$의 값이 존재하면 \$\\lim\_{x\\to a}g(x)\$의 값도 존재한다. ㄹ. \$\\lim\_{x\\to 0}f(x)=\\infty\$, \$\\lim\_{x\\to 0}g(x)=0\$이면 \$\\lim\_{x\\to 0}f(x)g(x)=0\$이다.

### 선지

① ㄱ ② ㄱ, ㄷ ③ ㄴ, ㄷ ④ ㄱ, ㄹ ⑤ ㄱ, ㄷ, ㄹ

### 정답

②

### 해설

- ㄱ: \$\\lim\_{x\\to\\infty}xf(x)=L\$이라 하면 \$f(x)=\\dfrac{xf(x)}{x}\$이고 \$\\lim\_{x\\to\\infty}\\dfrac{1}{x}=0\$이므로 \$\\lim\_{x\\to\\infty}f(x)=L\\cdot 0=0\$이다. (참)  
- ㄴ: \$f(x)=x\$이면 \$\\lim\_{x\\to\\infty}\\dfrac{1}{x}=0\$이지만 \$\\lim\_{x\\to\\infty}x=\\infty\$로 수렴하지 않는다. (거짓)  
- ㄷ: \$g(x)={f(x)+g(x)}-f(x)\$이므로 극한의 차 성질에 의하여 \$\\lim\_{x\\to a}g(x)\$도 존재한다. (참)  
- ㄹ: \$f(x)=\\dfrac{1}{x^2},\\ g(x)=x^2\$이면 \$\\lim\_{x\\to 0}f(x)g(x)=1\\ne 0\$이다. (거짓)

따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q11", "variationType": "CONDITION", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "수렴 곱의 극한(ㄱ), 차의 극한(ㄷ) 참과 발산 역(ㄴ), inf*0 부정형 반례(ㄹ) 거짓 판별", "decisiveStep": "ㄱ, ㄷ 참 및 ㄴ(f=x), ㄹ(1/x^2, x^2) 반례 판별", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "극한의 성질", "l4": "대수적 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": "TPL_LIMIT_OPERATION_LAWS", "why": "극한의 성질 > 대수적 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "극한의 기본 성질과 무한대/부정형 반례를 정확히 구별해야 하는 진위 판별 문항이다.", "level": "중", "item4slot": {"given": ["극한"], "goal": ["극한"], "method": ["극한"], "condition": []}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

다항함수 \$f(x)\$가 \$\\lim\_{x\\to 2}\\dfrac{f(x)}{x-2}=3\$, \$\\lim\_{x\\to 4}\\dfrac{f(x-1)}{x}=2\$를 만족시킬 때, \$\\lim\_{x\\to 3}\\dfrac{f(x-1)f(x)}{x-3}\$의 값은?

### 선지

① \$12\$ ② \$16\$ ③ \$20\$ ④ \$24\$ ⑤ \$28\$

### 정답

④

### 해설

첫째 극한에서 분모가 \$0\$으로 가므로 \$f(2)=0\$이고 \$f'(2)=3\$이다.

둘째 극한에서 분모가 \$4\$로 수렴하므로 \$\\dfrac{f(3)}{4}=2 \\implies f(3)=8\$이다.

\$\$\\lim\_{x\\to 3}\\frac{f(x-1)f(x)}{x-3} \= \\lim\_{x\\to 3}\\frac{f(x-1)-f(2)}{(x-1)-2}\\cdot f(x) \= f'(2)\\cdot f(3) \= 3\\times 8 \= 24\$\$

따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q12", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-03", "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "f(2)=0, f'(2)=3과 f(3)=8을 추출해 구하는 극한을 f'(2)*f(3)=24로 계산", "decisiveStep": "f'(2)*f(3) = 3 * 8 = 24", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분계수", "l4": "정의로 미분계수"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_DEFINITION", "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION", "why": "미분계수 > 정의로 미분계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 극한 조건에서 f'(2)와 f(3)을 각각 뽑아 평행이동된 미분계수 극한을 계산하는 문항이다.", "level": "중", "item4slot": {"given": ["다항함수", "극한"], "goal": ["극한", "값"], "method": ["미분계수", "극한"], "condition": []}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

곡선 \$y=\\dfrac{\\sqrt{3}x}{x-1}\$ (\$x\>1\$)과 두 직선 \$y=t\$ (\$t\>3\$), \$y=3\$의 교점을 각각 \$A,\\ B\$라 하고, 점 \$A\$에서 직선 \$y=3\$에 내린 수선의 발을 \$H\$라 할 때, \$\\lim\_{t\\to 3+}\\dfrac{\\overline{AH}}{\\overline{BH}} \= a+b\\sqrt{3}\$ (\$a,\\ b\$는 유리수)이다. \$a+b\$의 값은?

### 선지

① \$-2\$ ② \$-3\$ ③ \$-1\$ ④ \$1\$ ⑤ \$2\$

### 정답

①

### 해설

\$s \= \\dfrac{\\sqrt{3}x}{x-1}\$을 \$x\$에 대하여 풀면 \$x \= \\dfrac{s}{s-\\sqrt{3}}\$이므로 \$x\_A \= \\dfrac{t}{t-\\sqrt{3}}\$, \$x\_B \= \\dfrac{3}{3-\\sqrt{3}}\$이다.

\$\\overline{AH} \= t-3\$이고, \$\\overline{BH} \= x\_B - x\_A \= \\dfrac{3(t-\\sqrt{3})-t(3-\\sqrt{3})}{(3-\\sqrt{3})(t-\\sqrt{3})} \= \\dfrac{\\sqrt{3}(t-3)}{(3-\\sqrt{3})(t-\\sqrt{3})}\$이므로

\$\$\\lim\_{t\\to 3+}\\frac{\\overline{AH}}{\\overline{BH}} \= \\lim\_{t\\to 3+}\\frac{(3-\\sqrt{3})(t-\\sqrt{3})}{\\sqrt{3}} \= \\frac{(3-\\sqrt{3})^2}{\\sqrt{3}} \= \\frac{12-6\\sqrt{3}}{\\sqrt{3}} \= 4\\sqrt{3} - 6\$\$

따라서 \$a=-6,\\ b=4\$이므로 \$a+b \= \-2\$이다. 정답은 ①이다.

```
{"figureType": "rational_curve_horizontal_lines", "description": "점근선이 x=1, y=sqrt(3)인 유리함수 y=sqrt(3)x/(x-1) (x>1)의 그래프와 두 수평선 y=t (t>3), y=3의 교점 A, B 및 수선의 발 H로 이루어진 직각삼각형 ABH 그림", "elements": ["coordinate axes", "hyperbolic branch y=sqrt(3)x/(x-1) for x>1", "horizontal lines y=t and y=3", "points A, B, and foot H on y=3"]}
```

```
{"sourceQid": "Q13", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "교점 x좌표 x_A=t/(t-sqrt(3)), x_B=3/(3-sqrt(3))로 AH/BH를 약분해 극한 4sqrt(3)-6, a+b=-2 산출", "decisiveStep": "BH = sqrt(3)(t-3)/((3-sqrt(3))(t-sqrt(3))) 및 t-3 약분", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "함수의 극한", "l4": "극한값 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": null, "why": "함수의 극한 > 극한값 계산 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수 역관계로 교점 좌표를 매개변수 t로 표현한 뒤 (t-3) 인수를 약분해 유리화 극한을 구하는 문항이다.", "level": "상", "item4slot": {"given": ["곡선", "직선", "교점", "수선의발"], "goal": ["극한", "합", "값"], "method": ["극한", "유리화"], "condition": []}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.1

### 발문

\$\\lim\_{x\\to\\infty}(\\sqrt{9x^2+6x+1}-ax)=b\$를 만족시키는 상수 \$a,\\ b\$의 합 \$a+b\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

⑤

### 해설

\$x\\to\\infty\$일 때 극한값이 수렴하려면 최고차항이 상쇄되어야 하므로 \$a=3\$이다.

\$\$\\lim\_{x\\to\\infty}(\\sqrt{9x^2+6x+1}-3x) \= \\lim\_{x\\to\\infty}\\frac{6x+1}{\\sqrt{9x^2+6x+1}+3x} \= \\frac{6}{3+3} \= 1\$\$

따라서 \$b=1\$이므로 \$a+b \= 3+1 \= 4\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q14", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "최고차항 상쇄 조건으로 a=3을 정한 뒤 유리화로 lim(6x+1)/(sqrt(9x^2+6x+1)+3x)=1을 구해 a+b=4 산출", "decisiveStep": "a=3 결정 후 유리화로 b = 6/(3+3) = 1", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "무한대에서의 극한", "l4": "다항·유리함수"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": "TPL_LIMIT_INFINITY_LEADING_TERM", "why": "무한대에서의 극한 > 다항·유리함수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리식 ∞-∞ 꼴이 수렴할 조건으로 미정계수 a를 먼저 정하고 유리화로 b를 구하는 문항이다.", "level": "중", "item4slot": {"given": ["극한", "실수"], "goal": ["합", "값"], "method": ["유리화", "극한"], "condition": []}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.2

### 발문

실수 \$t\$에 대하여 직선 \$y=t\$와 함수 \$y=\\dfrac{4x+1}{x+2}\$의 그래프의 교점의 개수를 \$f(t)\$라 하자. 함수 \$f(x)\$와 함수 \$g(x)=-3x+a\$에 대하여 함수 \$f(x)g(x)\$가 실수 전체의 집합에서 연속일 때, 상수 \$a\$의 값은?

### 선지

① \$8\$ ② \$10\$ ③ \$12\$ ④ \$14\$ ⑤ \$16\$

### 정답

③

### 해설

\$y \= \\dfrac{4x+1}{x+2} \= 4 - \\dfrac{7}{x+2}\$의 치역은 \${y\\mid y\\ne 4}\$이므로 \$f(t)=1\$ (\$t\\ne 4\$), \$f(4)=0\$이다.

따라서 \$f(x)\$는 \$x=4\$에서만 불연속이므로 \$f(x)g(x)\$가 실수 전체에서 연속이려면 \$g(4) \= \-3(4)+a \= 0 \\implies a \= 12\$여야 한다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q15", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-02", "subUnitKey": "H15-M2-02-CONTINUITY", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "유리함수 점근선 y=4에서 f(t)가 불연속이므로 일차함수 g(4)=-12+a=0에서 a=12 산출", "decisiveStep": "점근선 y=4 불연속 -> g(4) = 0 -> a=12", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 연속", "l3": "연속 조건", "l4": "미정계수"}, "ptTplCandidate": {"problemTypeKey": "PT_CONTINUITY_CONDITION", "templateKey": null, "why": "연속 조건 > 미정계수 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수와 수평선의 교점 개수 함수의 불연속점을 점근선으로 찾고 곱의 연속 조건 g(4)=0을 적용하는 문항이다.", "level": "중", "item4slot": {"given": ["직선", "교점"], "goal": ["값"], "method": ["연속"], "condition": []}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.4

### 발문

실수 \$m\$에 대하여 직선 \$y=mx\$와 함수 \$f(x)=4x+3+\|x-1\|\$의 그래프의 교점의 개수를 \$g(m)\$이라 하자. 최고차항의 계수가 \$1\$인 이차함수 \$h(x)\$에 대하여 함수 \$g(x)h(x)\$가 실수 전체의 집합에서 연속일 때, \$h(9)\$의 값은?

### 선지

① \$24\$ ② \$15\$ ③ \$18\$ ④ \$21\$ ⑤ \$28\$

### 정답

①

### 해설

\$f(x) \= \\begin{cases}3x+4 & (x\<1)\\ 5x+2 & (x\\ge 1)\\end{cases}\$이다.

- \$x\<1\$: \$mx=3x+4 \\implies x=\\dfrac{4}{m-3}\<1 \\iff m\<3\$ 또는 \$m\>7\$  
- \$x\\ge 1\$: \$mx=5x+2 \\implies x=\\dfrac{2}{m-5}\\ge 1 \\iff 5\<m\\le 7\$

따라서 \$g(m)=1\$ (\$m\<3\$), \$0\$ (\$3\\le m\\le 5\$), \$1\$ (\$m\>5\$)이므로 \$g\$는 \$m=3,\\ 5\$에서 불연속이다. 그러므로 \$h(x)=(x-3)(x-5)\$이고 \$h(9)=6\\times 4 \= 24\$이다. 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q16", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-02", "subUnitKey": "H15-M2-02-CONTINUITY", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "절댓값 함수의 두 반직선과 y=mx의 교점 개수 g(m)의 불연속점 m=3,5를 h(x)의 두 근으로 잡아 h(9)=24 산출", "decisiveStep": "g 불연속점 m=3, 5 -> h(x)=(x-3)(x-5)", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 연속", "l3": "연속 조건", "l4": "미정계수"}, "ptTplCandidate": {"problemTypeKey": "PT_CONTINUITY_CONDITION", "templateKey": null, "why": "연속 조건 > 미정계수 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 함수와 직선의 교점 개수 함수 g(m)의 불연속점을 모두 구한 뒤 이차함수 곱의 연속 조건으로 h(x)를 결정하는 문항이다.", "level": "상", "item4slot": {"given": ["절댓값", "직선", "교점", "이차함수"], "goal": ["값"], "method": ["연속", "부등식"], "condition": []}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.4

### 발문

집합 \${x\\mid 0\<x\<2}\$에서 정의된 함수 \$f(x)=\\begin{cases}\\dfrac{2}{x}-2&(0\<x\\le 1)\\\\dfrac{2}{x-1}-2&(1\<x\<2)\\end{cases}\$일 때, 함수 \$y=f(x)g(x)\$가 \$x=1\$에서 연속이 되도록 하는 최고차항의 계수가 \$3\$인 이차함수 \$g(x)\$에 대하여 \$g(3)\$의 값은?

### 선지

① \$3\$ ② \$6\$ ③ \$9\$ ④ \$12\$ ⑤ \$15\$

### 정답

④

### 해설

\$x\\to 1-\$일 때 \$f(x)\\to 0\$이고 \$f(1)=0\$이므로 좌극한과 함숫값은 모두 \$0\$이다.

\$x\\to 1+\$일 때 \$f(x) \= \\dfrac{2(2-x)}{x-1}\$이므로 \$\\lim\_{x\\to 1+}f(x)g(x) \= 0\$이 되려면 \$g(x)\$가 \$(x-1)^2\$을 인수로 가져야 한다.

최고차항의 계수가 \$3\$이므로 \$g(x) \= 3(x-1)^2\$이고, \$g(3) \= 3(3-1)^2 \= 12\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q17", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-02", "subUnitKey": "H15-M2-02-CONTINUITY", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "x->1+에서 1/(x-1) 발산을 상쇄하기 위해 g(x)=3(x-1)^2 중근 조건을 도출해 g(3)=12 계산", "decisiveStep": "lim_{x->1+} g(x)/(x-1) = 0 -> g(x) = 3(x-1)^2", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 연속", "l3": "연속 조건", "l4": "구간별 함수"}, "ptTplCandidate": {"problemTypeKey": "PT_CONTINUITY_CONDITION", "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH", "why": "연속 조건 > 구간별 함수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "한쪽 극한이 0이고 다른 쪽이 1/(x-1) 발산인 경계점에서 곱함수가 연속이 되기 위한 (x-1)^2 인수 조건을 이끌어내는 문항이다.", "level": "상", "item4slot": {"given": ["구간", "이차함수"], "goal": ["값"], "method": ["연속", "극한"], "condition": []}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.6

### 발문

최고차항의 계수가 \$3\$인 삼차함수 \$f(x)\$와 함수 \$g(x)=\\begin{cases}\\dfrac{1}{x-2}&(x\\ne 2)\\5&(x=2)\\end{cases}\$에 대하여 \$h(x)=f(x)g(x)\$라 할 때, 함수 \$h(x)\$는 실수 전체의 집합에서 미분가능하고 \$h'(2)=9\$이다. \$f(3)\$의 값은?

### 선지

① \$9\$ ② \$12\$ ③ \$15\$ ④ \$18\$ ⑤ \$21\$

### 정답

②

### 해설

\$h(x)\$가 \$x=2\$에서 연속이려면 \$\\lim\_{x\\to 2}\\dfrac{f(x)}{x-2}\$가 존재해야 하므로 \$f(2)=0\$이고, \$h(2)=5f(2)=0\$이므로 \$f'(2)=0\$이다.

따라서 \$f(x) \= 3(x-2)^2(x-r)\$로 놓을 수 있으며, 모든 실수 \$x\$에서 \$h(x) \= 3(x-2)(x-r)\$이다.

\$h'(x) \= 3(x-r) \+ 3(x-2)\$이므로 \$h'(2) \= 3(2-r) \= 9 \\implies r \= \-1\$이다.

따라서 \$f(3) \= 3(3-2)^2(3+1) \= 12\$이다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q18", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "h(x)의 x=2 연속으로 f(2)=f'(2)=0을 얻어 f(x)=3(x-2)^2(x-r)로 두고 h'(2)=9에서 r=-1, f(3)=12 산출", "decisiveStep": "f(x)=3(x-2)^2(x-r), h'(2)=3(2-r)=9 -> r=-1", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분가능성과 연속", "l4": "미분가능 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION", "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION", "why": "미분가능성과 연속 > 미분가능 조건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "1/(x-2) 분수 불연속점과 곱해진 삼차함수가 연속·미분가능 조건을 통해 (x-2)^2 인수를 갖도록 결정하는 문항이다.", "level": "상", "item4slot": {"given": ["삼차함수", "구간"], "goal": ["값"], "method": ["도함수", "연속"], "condition": ["미분가능"]}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.7

### 발문

최고차항의 계수가 \$1\$인 삼차함수 \$f(x)\$가 모든 실수 \$x\$에 대하여 \$f'(2+x)=f'(2-x)\$를 만족시키고, \$f(-1)=f'(-1)=0\$일 때, \$f(1)\$의 값은?

### 선지

① \$-20\$ ② \$-22\$ ③ \$-24\$ ④ \$-26\$ ⑤ \$-28\$

### 정답

⑤

### 해설

\$f(x) \= x^3 \+ px^2 \+ qx \+ r\$이라 하면 \$f'(x) \= 3x^2 \+ 2px \+ q\$이다.

\$f'(2+x)=f'(2-x)\$에서 이차함수 \$f'(x)\$의 대칭축이 \$x=2\$이므로 \$-\\dfrac{2p}{6} \= 2 \\implies p \= \-6\$이다.

\$f'(-1) \= 3(1) \+ 12 \+ q \= 0 \\implies q \= \-15\$이고, \$f(-1) \= \-1 - 6 \+ 15 \+ r \= 0 \\implies r \= \-8\$이다.

따라서 \$f(x) \= x^3 - 6x^2 - 15x - 8\$이므로 \$f(1) \= 1 - 6 - 15 - 8 \= \-28\$이다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q19", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "f'(x)의 x=2 대칭축으로 p=-6, f'(-1)=0으로 q=-15, f(-1)=0으로 r=-8을 결정해 f(1)=-28 산출", "decisiveStep": "f' 대칭축 x=2 -> p=-6, q=-15, r=-8", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "도함수", "l4": "도함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION", "templateKey": "TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE", "why": "도함수 > 도함수 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도함수의 선대칭 조건과 x=-1에서의 함숫값·미분계수 조건을 결합해 삼차함수를 완성하는 문항이다.", "level": "상", "item4slot": {"given": ["삼차함수", "대칭성"], "goal": ["값"], "method": ["도함수", "미분계수"], "condition": []}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.7

### 발문

실수 \$a\$에 대하여 함수 \$f(x)=\\begin{cases}(x-1)(x-a)&(x\<1)\\0&(1\\le x\<2)\\2&(x\\ge 2)\\end{cases}\$라 하자. 양의 실수 \$t\$에 대하여 함수 \$f(x)\$에서 \$x\$의 값이 \$0\$에서 \$t\$까지 변할 때의 평균변화율을 \$g(t)\$라 하자. \$g(k)=g(k+1)=g(k+2)\$를 만족시키는 \$0\<k\<2\$인 실수 \$k\$가 존재할 때, \$f(-1)\$의 값은?

### 선지

① \$-\\dfrac{8}{3}\$ ② \$-3\$ ③ \$-\\dfrac{10}{3}\$ ④ \$-\\dfrac{11}{3}\$ ⑤ \$-4\$

### 정답

③

### 해설

\$f(0)=a\$이므로 평균변화율 \$g(t)\$는 \$0\<t\<1\$일 때 \$t-a-1\$, \$1\\le t\<2\$일 때 \$-\\dfrac{a}{t}\$, \$t\\ge 2\$일 때 \$\\dfrac{2-a}{t}\$이다.

1. \$0\<k\<1\$일 때: \$g(k+1)=g(k+2)\$에서 \$-\\dfrac{a}{k+1} \= \\dfrac{2-a}{k+2} \\implies a \= \-2k-2\$이다. 이때 \$g(k+1) \= \\dfrac{2k+2}{k+1} \= 2\$이므로 \$g(k) \= k - (-2k-2) - 1 \= 3k+1 \= 2 \\implies k=\\dfrac{1}{3}\$이고 \$a \= \-\\dfrac{8}{3}\$이다.  
2. \$1\\le k\<2\$일 때: \$g(k+1)=g(k+2)\$에서 \$a=2\$이나 \$g(k)=-\\dfrac{2}{k}\\ne 0=g(k+1)\$이므로 모순이다.

따라서 \$f(-1) \= (-1-1)\\left(-1+\\dfrac{8}{3}\\right) \= \-\\dfrac{10}{3}\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q20", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-03", "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "구간별 평균변화율 g(t)를 세워 0<k<1에서 g(k+1)=g(k+2)로 a=-2k-2를 구해 k=1/3, a=-8/3, f(-1)=-10/3 산출", "decisiveStep": "-a/(k+1) = (2-a)/(k+2) -> a=-2k-2, 3k+1=2 -> k=1/3", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분계수", "l4": "평균변화율·순간변화율"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_RATE_RELATION", "templateKey": "TPL_AVERAGE_RATE_ANALYSIS", "why": "미분계수 > 평균변화율·순간변화율 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 함수의 평균변화율 함수를 구간별로 구한 뒤 k의 범위를 나누어 세 함숫값 일치 방정식을 풀어야 하는 문항이다.", "level": "상", "item4slot": {"given": ["구간", "실수"], "goal": ["값"], "method": ["미분계수"], "condition": []}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

\[주관식1 (서술형)\] 다항함수 \$f(x)\$가 \$\\lim\_{x\\to\\infty}\\dfrac{f(x)-x^3}{x^2+3x}=-3\$, \$\\lim\_{x\\to 2}\\dfrac{f(x)}{x^2+x-6}=2\$를 만족시킬 때, \$f(x)\$를 풀이과정과 함께 구하시오.

### 선지

없음

### 정답

\$f(x)=x^3-3x^2+10x-16\$

### 해설

첫째 극한에서 \$f(x) \= x^3 - 3x^2 \+ bx \+ c\$로 둘 수 있다.

둘째 극한의 분모는 \$x^2+x-6 \= (x-2)(x+3)\$이므로 극한이 유한하려면 \$f(2)=0\$이어야 하고, 그때 \$\\dfrac{f'(2)}{2+3} \= 2 \\implies f'(2) \= 10\$이다.

\$f'(x) \= 3x^2 - 6x \+ b\$이므로 \$f'(2) \= 12 - 12 \+ b \= 10 \\implies b \= 10\$이고, \$f(2) \= 8 - 12 \+ 20 \+ c \= 0 \\implies c \= \-16\$이다.

따라서 \$f(x) \= x^3 - 3x^2 \+ 10x - 16\$이다.

```
"NONE"
```

```
{"sourceQid": "Q21", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "무한대 극한으로 f(x)=x^3-3x^2+bx+c를 잡고 x->2 극한으로 f(2)=0, f'(2)=10을 얻어 b=10, c=-16 산출", "decisiveStep": "f(2)=0, f'(2)/5 = 2 -> f'(2)=10", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "극한의 성질", "l4": "미정계수"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION", "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER", "why": "극한의 성질 > 미정계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무한대 극한과 0/0 꼴 극한의 미정계수 조건을 결합해 삼차다항식을 결정하는 서술형 문항이다.", "level": "중", "item4slot": {"given": ["다항함수", "극한"], "goal": ["다항식"], "method": ["극한", "미분계수", "인수분해"], "condition": []}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

\[주관식2 (서술형)\] 다항함수 \$f(x)\$에 대하여 \$\\lim\_{x\\to\\infty}\\dfrac{f(x)-x^4}{x^3}=3\$, \$\\lim\_{x\\to 1}\\dfrac{f(x)-4}{x-1}=-2\$, \$f'(-1)=18\$일 때, \$f'(0)+f(-1)\$의 값을 풀이과정과 함께 구하시오.

### 선지

없음

### 정답

\-1

### 해설

첫째 극한에서 \$f(x) \= x^4 \+ 3x^3 \+ ax^2 \+ bx \+ c\$로 놓을 수 있고, 둘째 극한에서 \$f(1)=4\$, \$f'(1)=-2\$이다.

\$f'(x) \= 4x^3 \+ 9x^2 \+ 2ax \+ b\$이므로 \$\$f'(1) \= 13 \+ 2a \+ b \= \-2 \\implies 2a+b \= \-15\$\$ \$\$f'(-1) \= 5 - 2a \+ b \= 18 \\implies \-2a+b \= 13\$\$

두 식을 더하면 \$2b \= \-2 \\implies b \= \-1\$, \$a \= \-7\$이다. 또한 \$f(1) \= 1+3-7-1+c \= 4\$에서 \$c \= 8\$이다.

따라서 \$f'(0) \= b \= \-1\$, \$f(-1) \= 1-3-7+1+8 \= 0\$이므로 \$f'(0)+f(-1) \= \-1\$이다.

```
"NONE"
```

```
{"sourceQid": "Q22", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "사차식 f(x)=x^4+3x^3+ax^2+bx+c에서 f'(1)=-2, f'(-1)=18을 연립해 a=-7, b=-1, c=8을 구해 -1 산출", "decisiveStep": "2a+b=-15, -2a+b=13 -> a=-7, b=-1", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "도함수", "l4": "도함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION", "templateKey": "TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE", "why": "도함수 > 도함수 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "극한 조건으로 사차함수의 상위 차수 계수와 f(1), f'(1)을 구한 뒤 f'(-1)과 연립해 계수를 확정하는 서술형 문항이다.", "level": "상", "item4slot": {"given": ["다항함수", "극한", "미분계수"], "goal": ["합", "값"], "method": ["도함수", "극한"], "condition": []}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

\[주관식3 (서술형)\] 함수 \$f(x)=\\begin{cases}ax+b&(x\<1)\\cx^2+kx&(x\\ge 1)\\end{cases}\$이 실수 전체의 집합에서 연속이고 역함수를 갖는다. 방정식 \$f(x)=f^{-1}(x)\$의 해가 \$3\$개이고, 그 해가 \$-1,\\ 1,\\ 2\$일 때, \$a+b+c+k\$의 값을 풀이과정과 함께 구하시오. (단, \$a,\\ b,\\ c,\\ k\$는 상수)

### 선지

없음

### 정답

\$2\$

### 해설

\$f\$는 실수 전체에서 연속이고 역함수를 가지므로 순증가 또는 순감소 함수이다.

1. 만약 \$f\$가 증가함수라면 \$f(x)=f^{-1}(x)\$의 모든 해는 \$f(x)=x\$의 해여야 하므로 \$f(1)=1,\\ f(2)=2\$가 되어야 하나, \$-1,\\ 1,\\ 2\$에서 \$f(-1)=-1,\\ f(1)=1\$이면 \$x\<1\$인 직선 \$ax+b=x\$가 되어 \$x\<1\$ 전체가 해가 되므로 해가 \$3\$개라는 조건에 모순이다.  
2. 따라서 \$f\$는 감소함수이고, 세 해 \$-1\<1\<2\$에 대하여 \$f(-1)=2,\\ f(1)=1,\\ f(2)=-1\$이 성립한다.

\$x\\ge 1\$에서 \$f(1) \= c+k \= 1\$, \$f(2) \= 4c+2k \= \-1\$을 연립하면 \$2c \= \-3 \\implies c \= \-\\dfrac{3}{2},\\ k \= \\dfrac{5}{2}\$이다.

\$x\<1\$에서 \$f(-1) \= \-a+b \= 2\$이고, \$x=1\$ 연속 조건에서 \$a+b \= f(1) \= 1\$이므로 \$b \= \\dfrac{3}{2},\\ a \= \-\\dfrac{1}{2}\$이다.

따라서 \$a+b+c+k \= \-\\dfrac{1}{2} \+ \\dfrac{3}{2} - \\dfrac{3}{2} \+ \\dfrac{5}{2} \= 2\$이다.

```
"NONE"
```

```
{"sourceQid": "Q23", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-02", "subUnitKey": "H15-M2-02-CONTINUITY", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "연속·역함수 존재 조건으로 f가 감소함수임을 밝히고 f(-1)=2, f(1)=1, f(2)=-1 연립으로 a+b+c+k=2 산출", "decisiveStep": "감소함수 확정 -> f(-1)=2, f(1)=1, f(2)=-1", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 연속", "l3": "연속 조건", "l4": "구간별 함수"}, "ptTplCandidate": {"problemTypeKey": "PT_CONTINUITY_CONDITION", "templateKey": "TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH", "why": "연속 조건 > 구간별 함수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연속과 역함수 존재 조건으로 증가/감소를 가려낸 뒤 f(x)=f^{-1}(x)의 해 대칭 대응으로 계수를 결정하는 최고난도 문항이다.", "level": "상", "item4slot": {"given": ["구간", "방정식", "실근"], "goal": ["합", "값"], "method": ["연속"], "condition": []}, "hold": ""}
```

