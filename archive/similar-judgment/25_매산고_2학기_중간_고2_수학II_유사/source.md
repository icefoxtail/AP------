

```
{"stem": "25_매산고_2학기_중간_고2_수학II_유사", "sourceArchiveFile": "original/high/h2/2mid/25_매산고_2학기_중간_고2_수학II.js", "examFolder": "2mid", "grade": "고2", "subject": "수학II", "curriculum": "2015", "questionCount": 20, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 4

### 발문

\$\\lim\_{x\\to 2}(3x^2-4x+5)\$의 값을 구한 것은?

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$

### 정답

④

### 해설

다항함수는 모든 실수에서 연속이므로 \$x=2\$를 직접 대입한다.

\$\$\\lim\_{x\\to 2}(3x^2-4x+5) \= 3(2)^2 - 4(2) \+ 5 \= 12 - 8 \+ 5 \= 9\$\$

따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q01", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "다항함수 3x^2-4x+5의 연속성을 이용해 x=2를 직접 대입하여 극한값 9 계산", "decisiveStep": "x=2 직접 대입 3(4)-4(2)+5=9", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "함수의 극한", "l4": "극한값 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": null, "why": "함수의 극한 > 극한값 계산 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항함수의 극한을 직접 대입 한 단계로 구하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["다항식"], "goal": ["극한", "값"], "method": ["극한"], "condition": []}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 4

### 발문

두 함수 \$f(x),\\ g(x)\$에 대하여 \$\\lim\_{x\\to a}f(x)=4\$, \$\\lim\_{x\\to a}g(x)=-2\$일 때, \$\\lim\_{x\\to a}{2f(x)-3f(x)g(x)}\$의 값을 구한 것은?

### 선지

① \$32\$ ② \$16\$ ③ \$24\$ ④ \$28\$ ⑤ \$36\$

### 정답

①

### 해설

두 함수의 극한값이 각각 존재하므로 극한의 기본 성질을 적용한다.

\$\$\\begin{aligned} \\lim\_{x\\to a}{2f(x)-3f(x)g(x)} &= 2\\lim\_{x\\to a}f(x) - 3\\lim\_{x\\to a}f(x)\\lim\_{x\\to a}g(x) \\ &= 2(4) - 3(4)(-2) \= 8 \+ 24 \= 32 \\end{aligned}\$\$

따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q02", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "수렴하는 두 극한값 4와 -2에 극한의 사칙연산 성질을 적용해 2(4)-3(4)(-2)=32 계산", "decisiveStep": "2*4 - 3*4*(-2) = 32", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "극한의 성질", "l4": "대수적 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": "TPL_LIMIT_OPERATION_LAWS", "why": "극한의 성질 > 대수적 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수렴하는 함수의 상수배·차·곱에 극한의 성질을 바로 대입하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["극한"], "goal": ["극한", "값"], "method": ["극한"], "condition": []}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4.2

### 발문

함수 \$f(x)=\\begin{cases}ax+b&(x\\le \-1)\\x^4&(x\>-1)\\end{cases}\$가 \$x=-1\$에서 미분가능하도록 하는 상수 \$a,\\ b\$에 대하여 \$\|a-b\|\$의 값을 구한 것은?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$7\$

### 정답

③

### 해설

\$x=-1\$에서 미분가능하려면 먼저 연속이어야 하고 좌미분계수와 우미분계수가 같아야 한다.

1. 좌미분계수와 우미분계수의 일치: \$\$a \= \\left.(x^4)'\\right\|\_{x=-1} \= 4(-1)^3 \= \-4\$\$  
2. \$x=-1\$에서의 연속 조건: \$\$-a \+ b \= (-1)^4 \= 1 \\implies 4 \+ b \= 1 \\implies b \= \-3\$\$

따라서 \$\|a-b\| \= \|-4 - (-3)\| \= 1\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q03", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "x=-1에서 좌우 미분계수 일치로 a=-4를 구한 뒤 연속 조건 -a+b=1로 b=-3을 결정해 |a-b|=1 계산", "decisiveStep": "a = 4(-1)^3 = -4, -a+b = 1 -> b = -3", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분가능성과 연속", "l4": "미분가능 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION", "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION", "why": "미분가능성과 연속 > 미분가능 조건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 함수의 경계점에서 연속 조건과 좌우 미분계수 일치 조건을 연립하는 표준 문항이다.", "level": "중", "item4slot": {"given": ["구간", "실수"], "goal": ["차", "값"], "method": ["미분계수", "연속"], "condition": ["미분가능"]}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.2

### 발문

방정식 \$x^3-3x^2-2=0\$이 오직 하나의 실근을 가질 때, 다음 중 방정식의 실근이 존재하는 구간을 구한 것은?

### 선지

① \$(-1,\\ 0)\$ ② \$(0,\\ 1)\$ ③ \$(1,\\ 2)\$ ④ \$(2,\\ 3)\$ ⑤ \$(3,\\ 4)\$

### 정답

⑤

### 해설

\$P(x) \= x^3 - 3x^2 - 2\$라 하면 다항함수 \$P(x)\$는 모든 실수에서 연속이다.

\$\$\\begin{aligned} P(3) &= 3^3 - 3(3)^2 - 2 \= \-2 \< 0 \\ P(4) &= 4^3 - 3(4)^2 - 2 \= 64 - 48 - 2 \= 14 \> 0 \\end{aligned}\$\$

\$P(3)P(4) \< 0\$이므로 사잇값 정리에 의하여 열린구간 \$(3,\\ 4)\$에 \$P(x)=0\$의 실근이 존재한다. 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q04", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-02", "subUnitKey": "H15-M2-02-CONTINUITY", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "P(x)=x^3-3x^2-2의 양 끝점 부호 P(3)=-2<0, P(4)=14>0에 사잇값 정리를 적용해 구간 (3,4) 판정", "decisiveStep": "P(3)=-2 < 0, P(4)=14 > 0", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 연속", "l3": "연속함수의 성질", "l4": "사잇값 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_INTERMEDIATE_VALUE_APPLICATION", "templateKey": "TPL_IVT_VALUE_EXISTENCE_INTERVAL", "why": "연속함수의 성질 > 사잇값 정리 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간 양 끝점의 함숫값 부호 변화로 사잇값 정리를 확인하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["방정식", "실근"], "goal": ["구간"], "method": ["사잇값정리", "연속"], "condition": []}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.3

### 발문

\$x-2\$를 인수로 갖는 다항함수 \$f(x)\$에 대하여 \$\\lim\_{h\\to 0}\\dfrac{f(2+h)-f(2-h)}{h}=8\$일 때, \$\\lim\_{x\\to 2}\\dfrac{x^3-8}{f(x)}\$의 값을 구한 것은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$6\$ ⑤ \$12\$

### 정답

②

### 해설

\$f(x)\$가 \$x-2\$를 인수로 가지므로 \$f(2)=0\$이고, 다항함수는 미분가능하다.

\$\$\\lim\_{h\\to 0}\\frac{f(2+h)-f(2-h)}{h} \= \\lim\_{h\\to 0}\\left{\\frac{f(2+h)-f(2)}{h} \+ \\frac{f(2-h)-f(2)}{-h}\\right} \= 2f'(2) \= 8\$\$

따라서 \$f'(2) \= 4\$이다. 이제 두 번째 극한을 계산한다.

\$\$\\lim\_{x\\to 2}\\frac{x^3-8}{f(x)} \= \\lim\_{x\\to 2}\\frac{(x-2)(x^2+2x+4)}{f(x)-f(2)} \= \\frac{2^2+2(2)+4}{f'(2)} \= \\frac{12}{4} \= 3\$\$

따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q05", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-03", "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "대칭 차분 몫 2f'(2)=8에서 f'(2)=4를 얻고 (x^3-8)/f(x)를 미분계수 역수 12/f'(2)=3으로 계산", "decisiveStep": "2f'(2)=8 -> f'(2)=4 및 (x^2+2x+4)/f'(2) = 12/4", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분계수", "l4": "정의로 미분계수"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_DEFINITION", "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION", "why": "미분계수 > 정의로 미분계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미분계수의 정의를 두 번 연결해 극한식을 f'(2)의 역수 형태로 변환하는 문항이다.", "level": "중", "item4slot": {"given": ["다항함수", "극한"], "goal": ["극한", "값"], "method": ["미분계수", "인수분해"], "condition": []}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.4

### 발문

다항식 \$x^8-ax+3b\$를 \$(x-1)^2\$으로 나눈 나머지가 \$2x+5\$가 되는 상수 \$a,\\ b\$에 대하여 \$3b-a\$의 값을 구한 것은?

### 선지

① \$6\$ ② \$8\$ ③ \$10\$ ④ \$12\$ ⑤ \$18\$

### 정답

①

### 해설

\$P(x) \= x^8 - ax \+ 3b\$, \$R(x) \= 2x \+ 5\$라 하면 \$P(x) \= (x-1)^2 Q(x) \+ R(x)\$이다.

양변을 \$x\$에 대하여 미분하면 \$P'(x) \= 2(x-1)Q(x) \+ (x-1)^2 Q'(x) \+ R'(x)\$이므로 \$P(1) \= R(1)\$이고 \$P'(1) \= R'(1)\$이다.

\$\$\\begin{aligned} P'(x) \= 8x^7 - a &\\implies P'(1) \= 8 - a \= R'(1) \= 2 \\implies a \= 6 \\ P(1) \= 1 - a \+ 3b &= R(1) \= 7 \\implies 1 - 6 \+ 3b \= 7 \\implies 3b \= 12 \\end{aligned}\$\$

따라서 \$3b - a \= 12 - 6 \= 6\$이다. 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q06", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "(x-1)^2으로 나눈 항등식과 그 도함수에 x=1을 대입해 P'(1)=2에서 a=6, P(1)=7에서 3b=12를 구해 3b-a=6 산출", "decisiveStep": "P'(1)=8-a=2, P(1)=1-a+3b=7", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "도함수", "l4": "도함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_RULE_EVALUATION", "templateKey": "TPL_DERIVATIVE_RULE_CALCULATION", "why": "도함수 > 도함수 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식으로 나눈 나머지 정리에 도함수를 결합해 미정계수를 연립하는 문항이다.", "level": "중", "item4slot": {"given": ["다항식", "나머지"], "goal": ["차", "값"], "method": ["도함수"], "condition": []}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.5

### 발문

함수 \$f(x)=3\|x-2\|+1\$과 직선 \$y=kx-3k\$의 교점의 개수를 \$g(k)\$라 하자. 이때, \$g(k)\$가 불연속인 모든 \$k\$의 값의 곱을 구한 것은?

### 선지

① \$-9\$ ② \$-3\$ ③ \$3\$ ④ \$9\$ ⑤ \$12\$

### 정답

④

### 해설

\$f(x) \= \\begin{cases}-3x+7 & (x\<2)\\ 3x-5 & (x\\ge 2)\\end{cases}\$이다.

1. 오른쪽 반직선(\$x\\ge 2\$)과의 교점: \$(k-3)x \= 3k-5\$ \$k\\ne 3\$에서 \$x \= \\dfrac{3k-5}{k-3} \\ge 2 \\iff \\dfrac{k+1}{k-3} \\ge 0 \\iff k \\le \-1\$ 또는 \$k \> 3\$  
2. 왼쪽 반직선(\$x \< 2\$)과의 교점: \$(k+3)x \= 3k+7\$ \$k\\ne \-3\$에서 \$x \= \\dfrac{3k+7}{k+3} \< 2 \\iff \\dfrac{k+1}{k+3} \< 0 \\iff \-3 \< k \< \-1\$

따라서 교점의 개수 \$g(k)\$는 다음과 같다. \$\$g(k) \= \\begin{cases} 1 & (k \\le \-3) \\ 2 & (-3 \< k \< \-1) \\ 1 & (k \= \-1) \\ 0 & (-1 \< k \\le 3\) \\ 1 & (k \> 3\) \\end{cases}\$\$

\$g(k)\$가 불연속인 \$k\$의 값은 \$-3,\\ \-1,\\ 3\$이므로 그 곱은 \$(-3)(-1)(3) \= 9\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q07", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-02", "subUnitKey": "H15-M2-02-CONTINUITY", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "f(x)=3|x-2|+1의 두 반직선과 y=k(x-3)의 교점 존재 부등식을 풀어 g(k) 불연속점 k=-3,-1,3의 곱 9 산출", "decisiveStep": "불연속 경계 기울기 k = -3, -1, 3 도출", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 연속", "l3": "연속의 뜻", "l4": "구간에서의 연속"}, "ptTplCandidate": {"problemTypeKey": "PT_CONTINUITY_JUDGMENT", "templateKey": null, "why": "연속의 뜻 > 구간에서의 연속 (FAMILY_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 함수와 정점을 지나는 직선의 기울기 k에 따른 교점 개수 함수를 직접 구성해 불연속점을 찾는 문항이다.", "level": "중", "item4slot": {"given": ["절댓값", "직선", "교점"], "goal": ["곱", "값"], "method": ["연속", "부등식"], "condition": []}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.6

### 발문

미분가능한 함수 \$f(x)\$의 그래프와 직선 \$y=\\dfrac{1}{3}x\$가 다음 그림과 같이 원점과 점 \$P\\left(p,\\ \\dfrac{1}{3}p\\right)\$에서 만난다. 함수 \$y=f(x)\$의 그래프 위의 두 점 \$A(a,\\ f(a))\$, \$B(b,\\ f(b))\$에 대하여 옳은 것만을 보기에서 있는 대로 고른 것은? (단, \$0 \< a \< p \< b\$)

ㄱ. \$f'(p) \> \\dfrac{1}{3}\$ ㄴ. \$f(a)-f(b) \> \\dfrac{1}{3}(a-b)\$ ㄷ. \$f'(\\alpha) \= \\dfrac{1}{3}\$인 \$\\alpha\$가 열린구간 \$(0,\\ p)\$에 적어도 하나 존재한다.

### 선지

① ㄱ ② ㄱ, ㄷ ③ ㄴ ④ ㄱ, ㄴ ⑤ ㄱ, ㄴ, ㄷ

### 정답

②

### 해설

그림에서 곡선 \$y=f(x)\$는 \$(0, p)\$에서 직선 \$y=\\dfrac{1}{3}x\$보다 아래에 있고, \$x\>p\$에서 직선보다 위에 있으며 점 \$P\$에서 직선을 아래에서 위로 관통한다.

- ㄱ: 점 \$P\$에서 곡선의 접선 기울기가 직선의 기울기 \$\\dfrac{1}{3}\$보다 크므로 \$f'(p) \> \\dfrac{1}{3}\$이다. (참)  
- ㄴ: \$f(a) \< \\dfrac{1}{3}a\$, \$f(b) \> \\dfrac{1}{3}b\$이므로 \$f(a)-f(b) \< \\dfrac{1}{3}(a-b)\$이다. (거짓)  
- ㄷ: \$h(x) \= f(x) - \\dfrac{1}{3}x\$라 두면 \$h(0) \= h(p) \= 0\$이고 닫힌구간 \$\[0, p\]\$에서 연속, 열린구간 \$(0, p)\$에서 미분가능하므로 롤의 정리에 의하여 \$h'(\\alpha) \= 0\$, 즉 \$f'(\\alpha) \= \\dfrac{1}{3}\$인 \$\\alpha \\in (0, p)\$가 적어도 하나 존재한다. (참)

따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ②이다.

```
{"figureType": "curve_line_intersection_mvt", "description": "원점과 점 P(p, p/3)에서 만나는 미분가능한 곡선 y=f(x)와 직선 y=(1/3)x의 그래프. (0,p)에서는 곡선이 직선 아래에 있고 점 A(a, f(a))가 놓여 있으며, x>p에서는 곡선이 직선 위에 있고 점 B(b, f(b))가 놓여 있다.", "elements": ["coordinate axes", "line y=(1/3)x", "smooth curve y=f(x) through O(0,0) and P(p, p/3)", "point A(a, f(a)) with 0<a<p", "point B(b, f(b)) with b>p"]}
```

```
{"sourceQid": "Q08", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-06", "subUnitKey": "H15-M2-06-DERIVATIVE_APPLICATION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "곡선 y=f(x)와 직선 y=(1/3)x의 교점 O, P와 위치 관계로부터 접선 기울기·부등식 및 h(x)=f(x)-x/3의 롤의 정리 판정", "decisiveStep": "h(0)=h(p)=0에 롤의 정리 적용해 f'(alpha)=1/3 존재 확인", "rpm": {"majorUnit": "미분", "midUnit": "도함수의 활용(1)", "l3": "평균값 정리 기초", "l4": "기울기 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_MEAN_VALUE_THEOREM", "templateKey": "TPL_MVT_ROLLE_DIRECT", "why": "평균값 정리 기초 > 기울기 조건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "그래프의 위치 관계로 미분계수 대소, 함숫값 부등식, 롤의 정리 존재성을 종합 판별하는 문항이다.", "level": "중", "item4slot": {"given": ["곡선", "직선", "교점"], "goal": ["부등식", "기울기"], "method": ["롤의정리", "미분계수"], "condition": ["미분가능"]}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.6

### 발문

다음 그림과 같이 곡선 \$y=4x^2\$ 위의 점 \$P\$에서 \$y\$축에 내린 수선의 발을 \$H\$라 하고, 선분 \$OH\$의 중점을 \$Q\$라 하자. 점 \$P\$의 \$x\$좌표가 한없이 커질 때, \$\\overline{PQ}-\\overline{HQ}\$의 극한값을 구한 것은? (단, 점 \$P\$는 제1사분면 위의 점이고, 점 \$O\$는 원점이다.)

### 선지

① \$\\dfrac{1}{8}\$ ② \$\\dfrac{1}{6}\$ ③ \$\\dfrac{1}{5}\$ ④ \$\\dfrac{1}{3}\$ ⑤ \$\\dfrac{1}{4}\$

### 정답

⑤

### 해설

점 \$P\$의 \$x\$좌표를 \$t\$ (\$t\>0\$)라 하면 \$P(t,\\ 4t^2)\$, \$H(0,\\ 4t^2)\$, \$Q(0,\\ 2t^2)\$이다.

\$\$\\overline{PQ} \= \\sqrt{t^2 \+ (4t^2 - 2t^2)^2} \= \\sqrt{t^2 \+ 4t^4}, \\qquad \\overline{HQ} \= 2t^2\$\$

분자를 유리화하여 \$t \\to \\infty\$일 때의 극한을 구하면 다음과 같다.

\$\$\\begin{aligned} \\lim\_{t\\to\\infty}(\\overline{PQ}-\\overline{HQ}) &= \\lim\_{t\\to\\infty}\\frac{(t^2+4t^4) - 4t^4}{\\sqrt{t^2+4t^4}+2t^2} \\ &= \\lim\_{t\\to\\infty}\\frac{t^2}{t^2\\left(\\sqrt{\\dfrac{1}{t^2}+4}+2\\right)} \= \\frac{1}{2+2} \= \\frac{1}{4} \\end{aligned}\$\$

따라서 정답은 ⑤이다.

```
{"figureType": "parabola_distance_limit", "description": "제1사분면의 포물선 y=4x^2 위의 점 P에서 y축에 내린 수선의 발 H와 선분 OH의 중점 Q가 표시된 그림", "elements": ["coordinate axes", "parabola y=4x^2 in quadrant 1", "point P on parabola", "foot H on y-axis", "midpoint Q of OH", "segment PQ"]}
```

```
{"sourceQid": "Q09", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "P(t, 4t^2), H(0, 4t^2), Q(0, 2t^2)로부터 sqrt(t^2+4t^4)-2t^2을 유리화해 t->inf 극한 1/4 계산", "decisiveStep": "분자 유리화 t^2 / (sqrt(t^2+4t^4)+2t^2) -> 1/4", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "무한대에서의 극한", "l4": "다항·유리함수"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": "TPL_LIMIT_INFINITY_LEADING_TERM", "why": "무한대에서의 극한 > 다항·유리함수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 위의 점 좌표를 매개변수 t로 설정한 뒤 무리식 ∞-∞ 꼴을 유리화해 극한을 구하는 문항이다.", "level": "중", "item4slot": {"given": ["곡선", "수선의발", "중점"], "goal": ["극한", "값"], "method": ["유리화", "극한"], "condition": []}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.7

### 발문

다음 두 조건을 만족시키는 다항함수 \$f(x)\$에 대하여 \$f(2)\$의 값을 구한 것은?

(가) \$\\lim\_{x\\to \-\\infty}\\dfrac{f(x)}{2x^3-5} \= 1\$ (나) \$\\lim\_{x\\to 1}\\dfrac{f(x)}{3(x-1)^2} \= 4\$

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

③

### 해설

조건 (가)에서 \$f(x)\$는 최고차항이 \$2x^3\$인 삼차함수이다.

조건 (나)에서 분모가 \$(x-1)^2\$을 인수로 가지고 극한값이 유한하므로 \$f(x)\$도 \$(x-1)^2\$을 인수로 가져야 한다. 따라서 \$f(x) \= 2(x-1)^2(x-r)\$로 놓을 수 있다.

\$\$\\lim\_{x\\to 1}\\frac{2(x-1)^2(x-r)}{3(x-1)^2} \= \\frac{2(1-r)}{3} \= 4 \\implies 1-r \= 6 \\implies r \= \-5\$\$

그러므로 \$f(x) \= 2(x-1)^2(x+5)\$이고, \$f(2) \= 2(2-1)^2(2+5) \= 14\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q10", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "(가)에서 최고차항 2x^3, (나)에서 인수 (x-1)^2을 파악해 f(x)=2(x-1)^2(x-r)로 두고 r=-5를 구해 f(2)=14 산출", "decisiveStep": "f(x)=2(x-1)^2(x-r) 및 2(1-r)/3 = 4", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "극한의 성질", "l4": "미정계수"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_PARAMETER_DETERMINATION", "templateKey": "TPL_LIMIT_FINITE_CONDITION_PARAMETER", "why": "극한의 성질 > 미정계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무한대 극한과 0/0 꼴 극한을 결합해 다항함수의 차수·인수·미정계수를 모두 결정하는 문항이다.", "level": "중", "item4slot": {"given": ["다항함수", "극한"], "goal": ["값"], "method": ["극한", "인수분해"], "condition": []}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 5.1

### 발문

실수 전체의 집합에서 정의된 두 함수 \$f(x),\\ g(x)\$에 대하여 다음 보기 중 옳은 것만을 있는 대로 고른 것은?

ㄱ. \$\\lim\_{x\\to a}f(x)=0\$이고 \$\\lim\_{x\\to a}g(x)=\\infty\$이면 \$\\lim\_{x\\to a}f(x)g(x)=0\$이다. ㄴ. \$\\lim\_{x\\to a}f(x)\$와 \$\\lim\_{x\\to a}{f(x)-g(x)}\$가 각각 존재하면 \$\\lim\_{x\\to a}g(x)\$도 존재한다. ㄷ. 모든 실수 \$x\$에 대하여 \$f(x) \< g(x)\$이면 \$\\lim\_{x\\to a}f(x) \< \\lim\_{x\\to a}g(x)\$이다.

### 선지

① ㄴ ② ㄱ ③ ㄷ ④ ㄱ, ㄴ ⑤ ㄴ, ㄷ

### 정답

①

### 해설

- ㄱ: 반례로 \$a=0\$, \$f(x)=x\$, \$g(x)=\\dfrac{1}{x^2}\$ (\$x\\ne 0\$), \$g(0)=0\$이라 두면 \$\\lim\_{x\\to 0}f(x)=0\$, \$\\lim\_{x\\to 0}g(x)=\\infty\$이지만 \$f(x)g(x)=\\dfrac{1}{x}\$이므로 극한이 존재하지 않는다. (거짓)  
- ㄴ: \$g(x) \= f(x) - {f(x)-g(x)}\$이고 두 함수가 모두 수렴하므로 극한의 성질에 의하여 \$\\lim\_{x\\to a}g(x) \= \\lim\_{x\\to a}f(x) - \\lim\_{x\\to a}{f(x)-g(x)}\$가 존재한다. (참)  
- ㄷ: 수렴할 때에도 \$f(x) \< g(x)\$이면 \$\\lim\_{x\\to a}f(x) \\le \\lim\_{x\\to a}g(x)\$로 등호가 성립할 수 있으며(예: \$f(x)=-x^2\$, \$g(x)=x^2+0\$ 아닌 \$f(x)=0\$, \$g(x)=x^2\$는 \$x=0\$ 제외, 또는 \$f(x)=-\\frac{1}{1+x^2}\$ 등 \$x\\to a\$에서 같아질 수 있고, 애초에 극한이 존재하지 않을 수도 있다). (거짓)

따라서 옳은 것은 ㄴ뿐이므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q11", "variationType": "CONDITION", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "0*inf 부정형 반례(ㄱ), 차의 극한 성질(ㄴ), 엄격 부등식 극한 보존 실패(ㄷ)를 각각 판별", "decisiveStep": "g(x) = f(x) - (f(x)-g(x))의 극한 존재성 판정", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "극한의 성질", "l4": "대수적 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": "TPL_LIMIT_OPERATION_LAWS", "why": "극한의 성질 > 대수적 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "극한의 성질과 대소 관계의 반례를 정확히 찾아 참·거짓을 가려야 하는 개념 판별 문항이다.", "level": "중", "item4slot": {"given": ["극한", "부등식"], "goal": ["극한"], "method": ["극한"], "condition": []}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 5.3

### 발문

점 \$(1,\\ k)\$에서 곡선 \$y=x^3-6x^2+3x+8\$에 서로 다른 세 개의 접선을 그을 때, 세 접점의 \$x\$좌표가 등비수열을 이룬다고 한다. \$k\$의 값을 구한 것은?

### 선지

① \$\\dfrac{143}{27}\$ ② \$\\dfrac{155}{27}\$ ③ \$\\dfrac{161}{27}\$ ④ \$\\dfrac{169}{27}\$ ⑤ \$\\dfrac{175}{27}\$

### 정답

④

### 해설

\$F(x) \= x^3 - 6x^2 \+ 3x \+ 8\$이라 하면 \$F'(x) \= 3x^2 - 12x \+ 3\$이다. 접점의 \$x\$좌표를 \$t\$라 하면 접선의 방정식은 다음과 같다.

\$\$y \= (3t^2-12t+3)(x-t) \+ (t^3-6t^2+3t+8)\$\$

이 접선이 점 \$(1,\\ k)\$를 지나므로 \$x=1,\\ y=k\$를 대입하여 정리한다.

\$\$\\begin{aligned} k &= (3t^2-12t+3)(1-t) \+ (t^3-6t^2+3t+8) \\ &= \-2t^3 \+ 9t^2 - 12t \+ 11 \\ &\\implies 2t^3 - 9t^2 \+ 12t \+ k - 11 \= 0 \\end{aligned}\$\$

세 실근을 등비수열의 순서대로 \$\\alpha,\\ \\beta,\\ \\gamma\$라 하면 \$\\beta^2 \= \\alpha\\gamma\$이고 근과 계수의 관계에서 다음과 같다.

\$\$\\alpha+\\beta+\\gamma \= \\frac{9}{2}, \\qquad \\alpha\\beta+\\beta\\gamma+\\gamma\\alpha \= 6, \\qquad \\alpha\\beta\\gamma \= \\frac{11-k}{2}\$\$

\$\$\\alpha\\beta+\\beta\\gamma+\\alpha\\gamma \= \\beta(\\alpha+\\gamma)+\\beta^2 \= \\beta(\\alpha+\\beta+\\gamma) \= 6 \\implies \\beta\\cdot\\frac{9}{2} \= 6 \\implies \\beta \= \\frac{4}{3}\$\$

따라서 \$\\alpha\\beta\\gamma \= \\beta^3\$이므로

\$\$\\frac{11-k}{2} \= \\left(\\frac{4}{3}\\right)^3 \= \\frac{64}{27} \\implies k \= 11 - \\frac{128}{27} \= \\frac{169}{27}\$\$

따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q12", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-05", "subUnitKey": "H15-M2-05-TANGENT", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "접점 t의 접선이 (1,k)를 지나는 삼차방정식 2t^3-9t^2+12t+k-11=0에서 등비수열 조건 beta^2=alpha*gamma로 beta=4/3을 구해 k=169/27 산출", "decisiveStep": "beta(alpha+beta+gamma) = 6 -> beta = 4/3, (11-k)/2 = (4/3)^3", "rpm": {"majorUnit": "미분", "midUnit": "도함수의 활용(1)", "l3": "접선", "l4": "접점 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_TANGENT_DERIVATIVE", "templateKey": "TPL_TANGENCY_RELATION_GEOMETRY", "why": "접선 > 접점 조건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곡선 밖의 점에서 그은 접선 방정식을 t에 대한 삼차방정식으로 세우고 근과 계수의 관계와 등비수열을 결합하는 고난도 문항이다.", "level": "상", "item4slot": {"given": ["곡선", "접선", "등비수열"], "goal": ["값"], "method": ["접선의방정식", "근과계수의관계"], "condition": []}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 5.5

### 발문

다음 그림과 같이 곡선 \$y=2x^2\$ 위의 점 \$P(t,\\ 2t^2)\$ (\$t\>0\$)에 대하여 \$\\overline{OP}=\\overline{OQ}\$가 되도록 점 \$Q\$를 \$x\$축의 양의 방향에 잡는다. 삼각형 \$POQ\$의 외접원의 지름의 길이를 \$f(t)\$라 할 때, \$\\lim\_{t\\to\\infty}\\dfrac{{f(t)}^2}{t^4}\$의 값을 구한 것은? (단, 점 \$O\$는 원점이다.)

### 선지

① \$4\$ ② \$8\$ ③ \$2\$ ④ \$6\$ ⑤ \$12\$

### 정답

②

### 해설

\$s \= \\overline{OP} \= \\overline{OQ} \= \\sqrt{t^2 \+ 4t^4} \= t\\sqrt{1+4t^2}\$라 하면 \$Q(s,\\ 0)\$이고 \$\\overline{PQ} \= d \= \\sqrt{(s-t)^2 \+ 4t^4}\$이다.

삼각형 \$POQ\$의 넓이는 \$\\dfrac{1}{2} \\cdot \\overline{OQ} \\cdot 2t^2 \= st^2\$이므로 외접원의 지름 \$f(t)\$는 다음과 같다.

\$\$f(t) \= \\frac{s\\cdot s\\cdot d}{2\\cdot (st^2)} \= \\frac{sd}{2t^2}\$\$

따라서

\$\$\\frac{{f(t)}^2}{t^4} \= \\frac{s^2}{4t^4} \\cdot \\frac{d^2}{t^4} \= \\frac{4 \+ \\dfrac{1}{t^2}}{4} \\cdot \\left{\\left(\\sqrt{4+\\frac{1}{t^2}} - \\frac{1}{t}\\right)^2 \+ 4\\right}\$\$

\$t \\to \\infty\$일 때 \$\\dfrac{s^2}{4t^4} \\to 1\$, \$\\dfrac{d^2}{t^4} \\to 2^2 \+ 4 \= 8\$이므로 구하는 극한값은 \$1 \\times 8 \= 8\$이다. 정답은 ②이다.

```
{"figureType": "parabola_circumcircle_limit", "description": "제1사분면의 곡선 y=2x^2 위의 점 P(t, 2t^2)와 OP=OQ인 x축 양의 방향 위의 점 Q로 이루어진 삼각형 POQ와 그 외접원이 그려진 그림", "elements": ["coordinate axes", "parabola y=2x^2", "point P(t, 2t^2)", "point Q on positive x-axis with OP=OQ", "triangle POQ and its circumcircle"]}
```

```
{"sourceQid": "Q13", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-01", "subUnitKey": "H15-M2-01-LIMIT", "conceptClusterKey": "LIMIT_CONTINUITY", "primaryMethod": "삼각형 POQ 넓이 st^2와 외접원 반지름 공식으로 f(t)=sd/(2t^2)을 구해 {f(t)}^2/t^4의 t->inf 극한 8 계산", "decisiveStep": "f(t) = sd/(2t^2) 및 t->inf에서 s^2/(4t^4)->1, d^2/t^4->8", "rpm": {"majorUnit": "함수의 극한과 연속", "midUnit": "함수의 극한", "l3": "무한대에서의 극한", "l4": "다항·유리함수"}, "ptTplCandidate": {"problemTypeKey": "PT_LIMIT_VALUE_CALC", "templateKey": "TPL_LIMIT_INFINITY_LEADING_TERM", "why": "무한대에서의 극한 > 다항·유리함수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외접원 지름을 삼각형 변과 넓이 관계로 표현한 뒤 t^4으로 나누어 최고차 극한을 구해야 하는 고난도 도형 극한 문항이다.", "level": "상", "item4slot": {"given": ["곡선", "삼각형", "선분"], "goal": ["극한", "값"], "method": ["극한", "거리"], "condition": []}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 5.6

### 발문

실수 \$a\$와 최고차항의 계수가 \$1\$인 이차함수 \$f(x)\$에 대하여 함수 \$g(x)\$를 \$g(x)=(x^2-4x+a)f(x)\$라 할 때, 두 함수 \$f(x),\\ g(x)\$는 다음 조건을 모두 만족시킨다.

(가) \$\\lim\_{x\\to 3}\\dfrac{g(x)-f(x)}{x-3}=0\$ (나) \$g'(3)\\ne 0\$ (다) 어떤 실수 \$\\alpha\$에 대하여 \$f(\\alpha)=f'(\\alpha)\$, \$g'(\\alpha)=3f'(\\alpha)\$이다.

이때, \$\\dfrac{g(\\alpha+5)}{16}=\\dfrac{p}{q}\$라 할 때, \$p+q\$를 구한 것은? (단, \$p,\\ q\$는 서로소인 자연수이다.)

### 선지

① \$41\$ ② \$45\$ ③ \$49\$ ④ \$53\$ ⑤ \$57\$

### 정답

③

### 해설

\$N(x) \= g(x)-f(x) \= (x^2-4x+a-1)f(x)\$라 두면 조건 (가)에서 \$N(3) \= 0\$, \$N'(3) \= 0\$이다.

\$\$N(3) \= (a-4)f(3) \= 0, \\qquad N'(3) \= 2f(3) \+ (a-4)f'(3) \= 0\$\$

만약 \$a\\ne 4\$이면 \$f(3)=0\$, \$f'(3)=0\$이 되어 \$g'(3) \= 2f(3)+(a-3)f'(3) \= 0\$이 되므로 조건 (나)에 모순이다.

따라서 \$a=4\$이고 \$f(3)=0\$, \$g'(3)=f'(3)\\ne 0\$이므로 \$f(x) \= (x-3)(x-r)\$ (\$r\\ne 3\$), \$g(x) \= (x-2)^2 f(x)\$이다.

이제 \$g'(x) \= 2(x-2)f(x) \+ (x-2)^2 f'(x)\$에 \$f(\\alpha)=f'(\\alpha)\$를 대입하면

\$\$g'(\\alpha) \= {2(\\alpha-2) \+ (\\alpha-2)^2}f'(\\alpha) \= (\\alpha^2-2\\alpha)f'(\\alpha) \= 3f'(\\alpha)\$\$

\$f'(\\alpha)=0\$이면 \$f(\\alpha)=0\$이 되어 \$f\$가 중근을 가져 \$f'(3)=0\$이므로 모순이다. 따라서 \$\\alpha^2-2\\alpha-3=0\$에서 \$\\alpha=3\$ 또는 \$\\alpha=-1\$이고, \$\\alpha=3\$이면 \$f'(3)=0\$으로 모순이므로 \$\\alpha=-1\$이다.

\$f(-1)=f'(-1)\$에서 \$(-4)(-1-r) \= \-5-r \\implies 5r \= \-9 \\implies r \= \-\\dfrac{9}{5}\$이다.

따라서 \$\\alpha+5=4\$이고 \$g(4) \= 2^2(4-3)\\left(4+\\dfrac{9}{5}\\right) \= \\dfrac{116}{5}\$이므로 \$\\dfrac{g(4)}{16} \= \\dfrac{29}{20}\$, 즉 \$p+q \= 29+20 \= 49\$이다. 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q14", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "N(3)=N'(3)=0과 g'(3)!=0으로 a=4, f(3)=0을 결정한 뒤 (alpha^2-2alpha)f'(alpha)=3f'(alpha)로 alpha=-1, r=-9/5 산출", "decisiveStep": "a=4 도출 후 (alpha^2-2alpha-3)=0에서 alpha=-1 확정", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "도함수", "l4": "도함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION", "templateKey": "TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE", "why": "도함수 > 도함수 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "극한 조건과 비영 미분계수 조건으로 모순을 배제해 매개변수 a와 f, g의 구조를 연쇄 결정해야 하는 최고난도 문항이다.", "level": "상", "item4slot": {"given": ["이차함수", "극한", "도함수"], "goal": ["합", "값"], "method": ["도함수", "미분계수"], "condition": []}, "hold": ""}
```

## Q15

- 형식: 서답형  
- 배점: 4

### 발문

\[서답형 1번\] 함수 \$f(x)=-x^3+ax^2-27x+5\$가 모든 실수에서 감소하도록 하는 실수 \$a\$의 값의 범위가 \$m\\le a\\le n\$일 때, \$n-m\$의 값을 구하시오.

### 선지

없음

### 정답

18

### 해설

다항함수 \$f(x)\$가 모든 실수에서 감소하려면 모든 실수 \$x\$에 대하여 \$f'(x) \\le 0\$이어야 한다.

\$\$f'(x) \= \-3x^2 \+ 2ax - 27 \\le 0\$\$

이차방정식 \$-3x^2 \+ 2ax - 27 \= 0\$의 판별식 \$D\$가 \$D \\le 0\$이어야 하므로

\$\$\\frac{D}{4} \= a^2 - (-3)(-27) \= a^2 - 81 \\le 0 \\implies \-9 \\le a \\le 9\$\$

따라서 \$m \= \-9,\\ n \= 9\$이므로 \$n - m \= 9 - (-9) \= 18\$이다.

```
"NONE"
```

```
{"sourceQid": "Q15", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-06", "subUnitKey": "H15-M2-06-DERIVATIVE_APPLICATION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "f'(x)=-3x^2+2ax-27<=0의 판별식 a^2-81<=0에서 -9<=a<=9를 구해 n-m=18 산출", "decisiveStep": "판별식 D/4 = a^2 - 81 <= 0", "rpm": {"majorUnit": "미분", "midUnit": "도함수의 활용(2)", "l3": "증가·감소와 극값", "l4": "증감표"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_MONOTONICITY", "templateKey": "TPL_MONOTONICITY_CONDITION", "why": "증가·감소와 극값 > 증감표 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차함수의 단조감소 조건을 이차도함수의 판별식 D<=0으로 전환하는 표준 문항이다.", "level": "중", "item4slot": {"given": ["삼차함수", "실수"], "goal": ["차", "값"], "method": ["도함수", "판별식"], "condition": []}, "hold": ""}
```

## Q16

- 형식: 서답형  
- 배점: 5

### 발문

\[서답형 2번\] 실수 \$a,\\ b\$에 대하여 함수 \$f(x)=\\begin{cases}x^2-6x&(x\<1)\\x^2+2ax+b&(x\\ge 1)\\end{cases}\$와 실수 전체의 집합에서 정의된 함수 \$g(x)=\\lim\_{t\\to x+}\\dfrac{f(t)-f(x)}{t-x}-\\lim\_{t\\to x-}\\dfrac{f(t)-f(x)}{t-x}\$가 있다. 함수 \$g(x)\$의 치역의 모든 원소의 합이 \$10\$일 때, \$ab\$의 값을 구하시오.

### 선지

없음

### 정답

\-20

### 해설

\$g(1)\$이 정의되려면 \$x=1\$에서 좌극한과 함숫값이 같아야 하므로 \$f(x)\$는 \$x=1\$에서 연속이다.

\$\$1^2 - 6(1) \= 1^2 \+ 2a \+ b \\implies 2a \+ b \= \-6\$\$

\$x\\ne 1\$에서는 좌미분계수와 우미분계수가 같으므로 \$g(x) \= 0\$이다. \$x=1\$에서는 다음과 같다.

\$\$g(1) \= (2(1)+2a) - (2(1)-6) \= (2+2a) - (-4) \= 6 \+ 2a\$\$

따라서 \$g(x)\$의 치역은 \${0,\\ 6+2a}\$이고 모든 원소의 합이 \$10\$이므로 \$6+2a \= 10 \\implies a \= 2\$이다.

\$2(2) \+ b \= \-6\$에서 \$b \= \-10\$이므로 \$ab \= 2 \\times (-10) \= \-20\$이다.

```
"NONE"
```

```
{"sourceQid": "Q16", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "x=1 연속 조건 2a+b=-6과 g(1)=f'_+(1)-f'_-(1)=6+2a=10에서 a=2, b=-10을 구해 ab=-20 계산", "decisiveStep": "g(1) = (2+2a)-(-4) = 10 -> a=2", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분가능성과 연속", "l4": "미분가능 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_DIFFERENTIABILITY_CONDITION", "templateKey": "TPL_DIFFERENTIABILITY_POINT_CONDITION", "why": "미분가능성과 연속 > 미분가능 조건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "우미분계수와 좌미분계수의 차로 정의된 함수 g(x)의 정의 조건에서 연속성을 이끌어내고 치역 합으로 계수를 결정하는 문항이다.", "level": "중", "item4slot": {"given": ["구간", "치역", "합"], "goal": ["곱", "값"], "method": ["미분계수", "연속"], "condition": []}, "hold": ""}
```

## Q17

- 형식: 서답형  
- 배점: 6

### 발문

\[서답형 3번\] 다항함수 \$f(x)\$가 모든 실수 \$x,\\ y\$에 대하여 \$f(x+y)=f(x)+f(y)-3xy(x+y)+2\$를 만족시킨다. \$\\lim\_{x\\to 1}\\dfrac{f(x)-f'(x)}{x-1}=5\$일 때, \$f'(0)\$의 값을 구하시오.

### 선지

없음

### 정답

2

### 해설

\$y=0\$을 대입하면 \$f(x) \= f(x) \+ f(0) \+ 2\$이므로 \$f(0) \= \-2\$이다.

함수방정식의 혼합항이 \$3\$차이므로 \$f(x) \= Ax^3 \+ Bx^2 \+ Cx \+ D\$라 두면

\$\$f(x+y) - f(x) - f(y) \= 3Axy(x+y) \+ 2Bxy - D \= \-3xy(x+y) \+ 2\$\$

따라서 \$3A \= \-3,\\ 2B \= 0,\\ \-D \= 2\$에서 \$A \= \-1,\\ B \= 0,\\ D \= \-2\$이므로 \$f(x) \= \-x^3 \+ Cx - 2\$, \$f'(x) \= \-3x^2 \+ C\$이다.

\$F(x) \= f(x) - f'(x)\$라 하면 \$F(1) \= (-1+C-2) - (-3+C) \= 0\$이므로

\$\$\\lim\_{x\\to 1}\\frac{F(x)}{x-1} \= F'(1) \= f'(1) - f''(1) \= (-3+C) - (-6) \= C \+ 3 \= 5\$\$

따라서 \$f'(0) \= C \= 2\$이다.

```
"NONE"
```

```
{"sourceQid": "Q17", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "다항식 계수 비교로 f(x)=-x^3+Cx-2를 구한 뒤 F(x)=f(x)-f'(x)의 x=1 미분계수 C+3=5에서 f'(0)=2 산출", "decisiveStep": "F'(1) = f'(1)-f''(1) = C+3 = 5", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "도함수", "l4": "도함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION", "templateKey": "TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE", "why": "도함수 > 도함수 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수방정식에서 다항함수의 최고차항과 상수항을 먼저 결정한 뒤 극한을 F'(1)로 해석해 일차항 계수를 구하는 서술형 문항이다.", "level": "상", "item4slot": {"given": ["다항함수", "방정식", "극한"], "goal": ["미분계수", "값"], "method": ["도함수", "미분계수"], "condition": []}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 5

### 발문

\[서답형 4번\] 함수 \$f(x)=\\begin{cases}x^2+2x&(x\\le 0)\\-3x^2+2x&(x\>0)\\end{cases}\$에 대하여 \$\\dfrac{f(a)-f(-1)}{a+1}=f'(c)\$를 만족시키고 열린구간 \$(-1,\\ a)\$에 속하는 상수 \$c\$의 개수가 \$2\$가 되도록 하는 모든 실수 \$a\$의 값의 범위는 \$p \< a \< q\$이다. \$3(p+q)\$의 값을 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

\$2\\sqrt{3}\$

### 해설

\$f(-1) \= \-1\$이고, 열린구간 \$(-1,\\ a)\$에 해 \$c\$가 \$2\$개 존재하려면 구간이 \$0\$을 포함해야 하므로 \$a \> 0\$이다. 할선의 기울기를 \$S \= \\dfrac{f(a)-f(-1)}{a+1} \= \\dfrac{-3a^2+2a+1}{a+1}\$라 두자.

1. \$-1 \< c \< 0\$에서 \$f'(c) \= 2c+2\$이므로 해가 존재할 조건은 \$0 \< S \< 2\$이다.  
   - \$S \> 0 \\iff \-3a^2+2a+1 \> 0 \\iff (3a+1)(a-1) \< 0 \\implies 0 \< a \< 1\$  
   - \$S \< 2 \\iff \-3a^2+2a+1 \< 2a+2 \\iff \-3a^2 \< 1\$ (항상 성립)  
2. \$0 \< c \< a\$에서 \$f'(c) \= \-6c+2 \= S \\implies c \= \\dfrac{2-S}{6}\$이므로 \$S \> 2-6a\$이어야 한다. \$\$-3a^2+2a+1 \> (2-6a)(a+1) \= \-6a^2-4a+2 \\implies 3a^2+6a-1 \> 0\$\$ \$a \> 0\$이므로 \$a \> \-1 \+ \\dfrac{2\\sqrt{3}}{3}\$이다.

따라서 \$-1 \+ \\dfrac{2\\sqrt{3}}{3} \< a \< 1\$이므로 \$p \= \-1 \+ \\dfrac{2\\sqrt{3}}{3}\$, \$q \= 1\$이다. 그러므로 \$3(p+q) \= 3\\cdot\\dfrac{2\\sqrt{3}}{3} \= 2\\sqrt{3}\$이다.

```
"NONE"
```

```
{"sourceQid": "Q18", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-06", "subUnitKey": "H15-M2-06-DERIVATIVE_APPLICATION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "할선 기울기 S=(-3a^2+2a+1)/(a+1)에 대해 (-1,0)과 (0,a) 구간별 f'(c)=S 해 존재 조건 0<S<2, S>2-6a를 연립해 p, q 산출", "decisiveStep": "0 < S < 2 (0<a<1)와 S > 2-6a (a>-1+2sqrt(3)/3) 연립", "rpm": {"majorUnit": "미분", "midUnit": "도함수의 활용(1)", "l3": "평균값 정리 기초", "l4": "기울기 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_MEAN_VALUE_THEOREM", "templateKey": "TPL_MVT_ROLLE_DIRECT", "why": "평균값 정리 기초 > 기울기 조건 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 이차함수에서 평균변화율과 같은 미분계수 개수가 2개가 되는 경계 a의 부등식을 구간별로 풀어내는 고난도 문항이다.", "level": "상", "item4slot": {"given": ["구간", "부등식"], "goal": ["합", "값"], "method": ["평균값정리", "도함수"], "condition": []}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 7

### 발문

\[서답형 5번\] \$10\$보다 작은 세 자연수 \$a,\\ b,\\ n\$에 대하여 \$\\lim\_{x\\to 5}\\dfrac{\|x-a\|^n-\|a-5\|^n}{x-5}=b\$일 때, \$a^2+b^2\$의 최댓값을 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

97

### 해설

주어진 극한은 \$h(x) \= \|x-a\|^n\$의 \$x=5\$에서의 미분계수 \$h'(5)\$이다.

\$a=5\$이면 극한은 \$n=1\$일 때 존재하지 않고 \$n\\ge 2\$일 때 \$0\$이므로 자연수 \$b\$가 될 수 없다. 따라서 \$a\\ne 5\$이고, \$x=5\$ 근방에서 \$h'(5) \= n(5-a)\|5-a\|^{n-2} \= b \> 0\$이다.

\$b \> 0\$이므로 \$a \< 5\$, 즉 \$a \\in {1,\\ 2,\\ 3,\\ 4}\$이다. 각 \$a\$에 대해 \$b \< 10\$인 경우를 조사하면 다음과 같다.

- \$a \= 4\$: \$b \= n\$이므로 \$n \= 9\$일 때 \$b \= 9\$가 최대이고 \$a^2+b^2 \= 4^2+9^2 \= 97\$  
- \$a \= 3\$: \$b \= n\\cdot 2^{n-1} \< 10\$에서 최대는 \$n \= 2,\\ b \= 4\$이고 \$a^2+b^2 \= 3^2+4^2 \= 25\$  
- \$a \= 2\$: \$b \= n\\cdot 3^{n-1} \< 10\$에서 최대는 \$n \= 2,\\ b \= 6\$이고 \$a^2+b^2 \= 2^2+6^2 \= 40\$  
- \$a \= 1\$: \$b \= n\\cdot 4^{n-1} \< 10\$에서 최대는 \$n \= 2,\\ b \= 8\$이고 \$a^2+b^2 \= 1^2+8^2 \= 65\$

따라서 \$a^2+b^2\$의 최댓값은 \$97\$이다.

```
"NONE"
```

```
{"sourceQid": "Q19", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-03", "subUnitKey": "H15-M2-03-DERIVATIVE_DEFINITION", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "극한을 |x-a|^n의 x=5 미분계수 b=n(5-a)|5-a|^(n-2)로 해석해 a<5와 b<10 자연수 조건을 전수 조사해 최댓값 97 산출", "decisiveStep": "b = n(5-a)|5-a|^(n-2) > 0 -> a∈{1,2,3,4} 조사", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "미분계수", "l4": "정의로 미분계수"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_DEFINITION", "templateKey": "TPL_DERIVATIVE_LIMIT_REDUCTION", "why": "미분계수 > 정의로 미분계수 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 거듭제곱의 미분계수에서 양수 조건과 10 미만 자연수 제한을 결합해 경우를 분류해야 하는 서술형 문항이다.", "level": "상", "item4slot": {"given": ["자연수", "극한", "절댓값"], "goal": ["최댓값"], "method": ["미분계수"], "condition": []}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 8

### 발문

\[서답형 6번\] 삼차함수 \$f(x)=x^3+kx\$에 대하여 다항함수 \$g(x)\$가 다음 조건을 만족시킨다.

(가) \$a\\ne 0\$에 대하여 \$f'(a)=\\dfrac{f(a)-f(g(a))}{a-g(a)}\$이다. (나) 방정식 \$f'(x)\\times f'(g(x))=k^2\$의 실근 중 \$0\$이 아닌 두 실근이 존재하며, 곱은 \$-10\$이다.

\$0\$이 아닌 실수 \$x\$에 대하여 \$g(x)\\ne x\$일 때, \$g\\left(\\dfrac{k}{6}\\right)\$의 값을 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

8

### 해설

\$a\\ne g(a)\$이므로 조건 (가)의 우변을 인수분해하여 정리하면 다음과 같다.

\$\$f'(a) \= 3a^2 \+ k \= \\frac{a^3 - g(a)^3 \+ k{a-g(a)}}{a-g(a)} \= a^2 \+ ag(a) \+ g(a)^2 \+ k\$\$

\$\$2a^2 - ag(a) - g(a)^2 \= (a-g(a))(2a+g(a)) \= 0\$\$

\$0\$이 아닌 실수 \$a\$에 대하여 \$g(a)\\ne a\$이고 \$g\$는 다항함수이므로 \$g(x) \= \-2x\$이다.

따라서 \$f'(g(x)) \= 3(-2x)^2 \+ k \= 12x^2 \+ k\$이므로 조건 (나)의 방정식은 다음과 같다.

\$\$(3x^2+k)(12x^2+k) \= k^2 \\implies 3x^2(12x^2+5k) \= 0\$\$

\$0\$이 아닌 두 실근은 \$x \= \\pm\\sqrt{-\\dfrac{5k}{12}}\$이고, 두 근의 곱이 \$-10\$이므로

\$\$\\frac{5k}{12} \= \-10 \\implies k \= \-24\$\$

따라서 \$\\dfrac{k}{6} \= \-4\$이므로 \$g(-4) \= \-2(-4) \= 8\$이다.

```
"NONE"
```

```
{"sourceQid": "Q20", "variationType": "NUMERIC", "standardCourse": "수학II", "courseKey": "H15-M2", "curriculum": "2015", "standardUnitKey": "H15-M2-04", "subUnitKey": "H15-M2-04-DERIVATIVE", "conceptClusterKey": "DIFFERENTIATION", "primaryMethod": "(가) 평균변화율=f'(a) 인수분해로 g(x)=-2x를 구하고 (나) 방정식의 두 근 곱 5k/12=-10에서 k=-24를 얻어 g(-4)=8 산출", "decisiveStep": "(a-g(a))(2a+g(a))=0 -> g(x)=-2x 및 5k/12=-10", "rpm": {"majorUnit": "미분", "midUnit": "미분계수와 도함수", "l3": "도함수", "l4": "도함수 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_DERIVATIVE_FUNCTION_DETERMINATION", "templateKey": "TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE", "why": "도함수 > 도함수 계산 (DIRECT_ACTIVE)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평균변화율 항등식의 인수분해로 다항함수 g(x)를 특정한 뒤 사차방정식의 비영 실근 곱 조건으로 k를 구하는 문항이다.", "level": "상", "item4slot": {"given": ["삼차함수", "다항함수", "방정식", "곱"], "goal": ["값"], "method": ["도함수", "인수분해"], "condition": []}, "hold": ""}
```

