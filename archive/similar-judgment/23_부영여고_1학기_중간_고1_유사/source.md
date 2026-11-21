

```
{"stem": "23_부영여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

두 다항식 \$A=3x^2-4x+2\$, \$B=-x^2+7x-5\$에 대하여 다항식 \$3A-(2A-B)\$를 간단히 한 것은?

### 선지

① \$4x^2-11x+7\$ ② \$2x^2-3x-3\$ ③ \$2x^2+3x-3\$ ④ \$2x^2+3x+7\$ ⑤ \$4x^2+3x-3\$

### 정답

③

### 해설

\$3A-(2A-B)=3A-2A+B=A+B\$ \$\\begin{aligned} A+B &= (3x^2-4x+2)+(-x^2+7x-5) \\ &= (3-1)x^2+(-4+7)x+(2-5) \\ &= 2x^2+3x-3 \\end{aligned}\$ 따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "3A-(2A-B)를 A+B로 먼저 정리한 뒤 동류항의 계수를 합하여 다항식을 구한다.", "decisiveStep": "괄호를 풀어 3A-(2A-B)=A+B로 식을 단순화하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 3A-(2A-B)=A+B 정리 후 동류항 덧셈"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 덧셈과 뺄셈 성질을 직접 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=3x^2-4x+2$, $B=-x^2+7x-5$"}], "goal": [{"term": "다항식", "src": "stem", "quote": "다항식 $3A-(2A-B)$를 간단히 한 것은?"}], "method": [{"term": "동류항", "src": "solution", "quote": "(3-1)x^2+(-4+7)x+(2-5)", "evidenceType": "IMPLIED", "justification": "동류항의 계수끼리 묶어 덧셈을 수행함"}], "condition": []}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

모든 실수 \$x\$에 대하여 \$a(x-2)^2+b(x-2)+c=2x^2-3x+1\$이 성립할 때, \$a+b+c\$의 값은? (단, \$a, b, c\$는 상수이다.)

### 선지

① \$10\$ ② \$0\$ ③ \$3\$ ④ \$11\$ ⑤ \$12\$

### 정답

①

### 해설

주어진 등식이 \$x\$에 대한 항등식이므로 \$x-2=1\$, 즉 \$x=3\$을 양변에 대입한다. \$\\text{좌변} \= a(3-2)^2+b(3-2)+c \= a+b+c\$ \$\\text{우변} \= 2\\cdot 3^2-3\\cdot 3+1 \= 18-9+1 \= 10\$ 따라서 \$a+b+c=10\$이므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "항등식 a(x-2)^2+b(x-2)+c=2x^2-3x+1에 x=3을 대입해 a+b+c의 값을 바로 구한다.", "decisiveStep": "x-2=1이 되도록 x=3을 선택해 대입하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): 항등식 수치대입 x=3으로 a+b+c 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항등식의 성질과 수치대입법을 곧바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "항등식", "src": "solution", "quote": "주어진 등식이 $x$에 대한 항등식이므로"}], "goal": [{"term": "값", "src": "stem", "quote": "$a+b+c$의 값은?"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "$x=3$을 양변에 대입한다.", "evidenceType": "IMPLIED", "justification": "x-2=1이 되는 특정 수치 x=3을 대입해 계수의 합을 구함"}], "condition": [{"term": "양화", "src": "stem", "quote": "모든 실수 $x$에 대하여"}, {"term": "실수", "src": "stem", "quote": "모든 실수 $x$에 대하여"}, {"term": "상수", "src": "stem", "quote": "$a, b, c$는 상수이다."}]}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$f(x)=x^3+px^2+qx-6\$이 \$(x-1)(x+2)\$로 나누어떨어질 때, \$pq\$의 값은? (단, \$p, q\$는 상수이다.)

### 선지

① \$-4\$ ② \$0\$ ③ \$6\$ ④ \$4\$ ⑤ \$8\$

### 정답

④

### 해설

\$f(x)\$가 \$(x-1)(x+2)\$로 나누어떨어지므로 인수정리에 의하여 \$f(1)=0\$, \$f(-2)=0\$이다. \$f(1)=1+p+q-6=0 \\implies p+q=5\$ \$f(-2)=-8+4p-2q-6=0 \\implies 4p-2q=14 \\implies 2p-q=7\$ 두 식을 변변 더하면 \$3p=12\$이므로 \$p=4\$이다. \$p+q=5\$에 대입하면 \$q=1\$이다. 따라서 \$pq=4\\cdot 1=4\$이므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "인수정리로 f(1)=0, f(-2)=0을 세워 p, q에 대한 연립일차방정식을 푼다.", "decisiveStep": "인수정리를 이용해 두 조건식 p+q=5와 2p-q=7을 얻는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012(RPM_ONLY): 인수정리 f(1)=0, f(-2)=0 연립으로 p, q 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리 적용 후 연립일차방정식을 푸는 2단계 표준 초입 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)=x^3+px^2+qx-6$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$pq$의 값은?"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여 $f(1)=0$, $f(-2)=0$이다.", "evidenceType": "NAMED"}, {"term": "연립일차방정식", "src": "solution", "quote": "두 식을 변변 더하면 $3p=12$", "evidenceType": "IMPLIED", "justification": "p, q에 대한 두 일차방정식을 가감법으로 연립하여 해를 구함"}], "condition": [{"term": "상수", "src": "stem", "quote": "$p, q$는 상수이다."}]}}, "hold": "RPM_ONLY"}
```

## Q04

- 형식: 객관식  
- 배점: 3.9

### 발문

다항식 \$4x^3+2x^2+bx-5\$를 \$x-a\$로 나누는 조립제법 과정이 다음과 같을 때, \$a+b+c\$의 값은?

| \$a\$ | \$4\$ | \$2\$ | \$b\$ | \$-5\$ |
| :---- | :---- | :---- | :---- | :---- |
|  |  | \$4a\$ | \$4a\$ | \$6a\$ |
|  | \$4\$ | \$4\$ | \$6\$ | \$c\$ |

### 선지

① \$\\frac{1}{2}\$ ② \$\\frac{5}{2}\$ ③ \$\\frac{3}{2}\$ ④ \$\\frac{7}{2}\$ ⑤ \$\\frac{9}{2}\$

### 정답

②

### 해설

조립제법의 각 열에서 위쪽 두 수의 합이 아래쪽 수와 같다. 두 번째 열에서 \$2+4a=4\$이므로 \$4a=2\$, 즉 \$a=\\frac{1}{2}\$이다. 세 번째 열에서 \$b+4a=6\$이므로 \$b+2=6\$, 즉 \$b=4\$이다. 네 번째 열에서 \$c=-5+6a=-5+6\\cdot\\frac{1}{2}=-5+3=-2\$이다. 따라서 \$a+b+c=\\frac{1}{2}+4-2=\\frac{5}{2}\$이므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "조립제법 표의 각 열 합 관계를 이용해 2+4a=4, b+4a=6, c=-5+6a를 차례로 구한다.", "decisiveStep": "두 번째 열의 2+4a=4에서 a=1/2을 역산하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "다항식을 일차식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-005(DIRECT_ACTIVE): 조립제법 표 역산으로 다항식 나눗셈 계수 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조립제법의 계산 규칙을 역으로 따라 미지수를 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $4x^3+2x^2+bx-5$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b+c$의 값은?"}], "method": [{"term": "조립제법", "src": "stem", "quote": "조립제법 과정이 다음과 같을 때", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.9

### 발문

\$(3+2i)(2-i)+(2+i^2)=a+bi\$일 때, 실수 \$a, b\$에 대하여 \$a+b\$의 값은? (단, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$6\$ ② \$8\$ ③ \$11\$ ④ \$12\$ ⑤ \$10\$

### 정답

⑤

### 해설

\$i^2=-1\$을 이용하여 전개하고 실수부분과 허수부분으로 정리한다. \$\\begin{aligned} (3+2i)(2-i)+(2+i^2) &= (6-3i+4i-2i^2)+(2-1) \\ &= (6+i+2)+1 \\ &= 9+i \\end{aligned}\$ \$9+i=a+bi\$이고 \$a, b\$는 실수이므로 \$a=9, b=1\$이다. 따라서 \$a+b=9+1=10\$이므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "i^2=-1을 적용해 복소수 식을 9+i로 정리한 뒤 복소수의 상등으로 a, b를 구한다.", "decisiveStep": "복소수 곱셈 전개 후 i^2=-1로 실수부분과 허수부분을 분리하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "사칙연산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-023(DIRECT_ACTIVE): 복소수 사칙연산 정리 후 복소수 상등으로 a, b 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 기본 곱셈과 i^2=-1 성질을 직접 적용하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "복소수", "src": "stem", "quote": "$(3+2i)(2-i)+(2+i^2)=a+bi$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b$의 값은?"}], "method": [{"term": "전개", "src": "solution", "quote": "$i^2=-1$을 이용하여 전개하고", "evidenceType": "NAMED"}, {"term": "상등", "src": "solution", "quote": "$9+i=a+bi$이고 $a, b$는 실수이므로 $a=9, b=1$", "evidenceType": "IMPLIED", "justification": "두 복소수가 같을 조건으로 실수부분과 허수부분을 비교함"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}]}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.9

### 발문

이차방정식 \$x^2-6x+5-a=0\$이 실근을 갖도록 하는 실수 \$a\$의 최솟값은?

### 선지

① \$-4\$ ② \$-6\$ ③ \$-5\$ ④ \$-3\$ ⑤ \$-2\$

### 정답

①

### 해설

이차방정식 \$x^2-6x+5-a=0\$이 실근을 가지려면 판별식 \$D \\ge 0\$이어야 한다. \$\\frac{D}{4} \= (-3)^2 - 1\\cdot(5-a) \= 9-5+a \= 4+a \\ge 0\$ 따라서 \$a \\ge \-4\$이므로 실수 \$a\$의 최솟값은 \$-4\$이다. 그러므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "x^2-6x+5-a=0의 판별식 D/4=4+a>=0을 풀어 실수 a의 최솟값을 구한다.", "decisiveStep": "실근 조건을 판별식 D/4=9-(5-a)>=0으로 전환하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식 실근 조건 판별식 D/4>=0"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실근 조건을 판별식 부등식으로 해석하는 기본 적용 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-6x+5-a=0$"}], "goal": [{"term": "최솟값", "src": "stem", "quote": "실수 $a$의 최솟값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D \\ge 0$이어야 한다.", "evidenceType": "NAMED"}], "condition": [{"term": "실근", "src": "stem", "quote": "실근을 갖도록 하는"}, {"term": "실수", "src": "stem", "quote": "실수 $a$"}]}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

이차방정식 \$x^2-3x+1=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\alpha^3+\\beta^3\$의 값은?

### 선지

① \$12\$ ② \$15\$ ③ \$18\$ ④ \$24\$ ⑤ \$36\$

### 정답

③

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=3\$, \$\\alpha\\beta=1\$이다. \$\\begin{aligned} \\alpha^3+\\beta^3 &= (\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta) \\ &= 3^3-3\\cdot 1\\cdot 3 \\ &= 27-9 \= 18 \\end{aligned}\$ 따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "x^2-3x+1=0에서 근과 계수의 관계로 합과 곱을 구한 뒤 곱셈공식 변형으로 세제곱의 합을 계산한다.", "decisiveStep": "세제곱의 합을 합과 곱의 대칭식 (a+b)^3-3ab(a+b)로 변형하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계와 세제곱 합 곱셈공식 변형"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계와 대칭식 변형을 순차적으로 결합하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-3x+1=0$"}], "goal": [{"term": "식의값", "src": "stem", "quote": "$\\alpha^3+\\beta^3$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여 $\\alpha+\\beta=3$, $\\alpha\\beta=1$이다.", "evidenceType": "NAMED"}, {"term": "대칭식", "src": "solution", "quote": "(\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta)", "evidenceType": "IMPLIED", "justification": "두 근의 세제곱의 합을 기본 대칭식인 합과 곱으로 변형함"}], "condition": []}}, "hold": "BINDING_GAP"}
```

## Q08

- 형식: 객관식  
- 배점: 4.1

### 발문

\$0 \\le x \\le 5\$일 때, 이차함수 \$y=x^2-4x-2\$의 최솟값을 \$m\$, 최댓값을 \$M\$이라 하자. 이때 \$m+M\$의 값은?

### 선지

① \$-8\$ ② \$-3\$ ③ \$-4\$ ④ \$1\$ ⑤ \$9\$

### 정답

②

### 해설

\$f(x)=x^2-4x-2=(x-2)^2-6\$이므로 그래프의 꼭짓점은 \$(2, \-6)\$이다. 축 \$x=2\$가 주어진 구간 \$0 \\le x \\le 5\$ 안에 있으므로 최솟값은 \$m=f(2)=-6\$이다. 최댓값은 축 \$x=2\$에서 더 멀리 떨어진 구간의 끝점 \$x=5\$에서 갖는다. \$f(0)=-2\$, \$f(5)=5^2-4\\cdot 5-2=3\$이므로 \$M=f(5)=3\$이다. 따라서 \$m+M=-6+3=-3\$이므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "y=(x-2)^2-6의 꼭짓점 x=2가 [0, 5]에 포함됨을 확인하고 양 끝점과 비교해 최댓값과 최솟값을 구한다.", "decisiveStep": "축 x=2가 구간 [0, 5] 안에 있어 꼭짓점에서 최소, 더 먼 끝점 x=5에서 최대임을 판정하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 제한 구간 [0, 5]에서 이차함수 최대·최소 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "표준형 변환 후 제한된 범위에서 축과 끝점의 위치를 비교하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-4x-2$"}], "goal": [{"term": "최솟값", "src": "stem", "quote": "최솟값을 $m$"}, {"term": "최댓값", "src": "stem", "quote": "최댓값을 $M$"}, {"term": "합", "src": "stem", "quote": "$m+M$의 값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "$f(x)=x^2-4x-2=(x-2)^2-6$", "evidenceType": "IMPLIED", "justification": "완전제곱식 꼴의 표준형으로 변형해 꼭짓점과 축을 찾음"}, {"term": "끝점", "src": "solution", "quote": "구간의 끝점 $x=5$에서 갖는다.", "evidenceType": "NAMED"}], "condition": [{"term": "정의역제한", "src": "stem", "quote": "$0 \\le x \\le 5$일 때"}]}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.6

### 발문

\$a=1+\\sqrt{3}\$, \$b=1-\\sqrt{3}\$일 때, \$a^5+b^5+a^2b^3+a^3b^2\$의 값은?

### 선지

① \$-160\$ ② \$-32\$ ③ \$32\$ ④ \$128\$ ⑤ \$160\$

### 정답

⑤

### 해설

공통인수로 묶어 인수분해하면 \$\\begin{aligned} a^5+b^5+a^2b^3+a^3b^2 &= a^3(a^2+b^2)+b^3(a^2+b^2) \\ &= (a^3+b^3)(a^2+b^2) \\end{aligned}\$ 주어진 \$a, b\$에 대하여 \$a+b=2\$, \$ab=1^2-(\\sqrt{3})^2=-2\$이다. \$a^2+b^2=(a+b)^2-2ab=2^2-2(-2)=8\$ \$a^3+b^3=(a+b)^3-3ab(a+b)=2^3-3(-2)(2)=8+12=20\$ 따라서 \$(a^3+b^3)(a^2+b^2)=20\\cdot 8=160\$이므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "5차 다항식을 (a^3+b^3)(a^2+b^2)으로 인수분해한 뒤 a+b=2, ab=-2를 대입해 계산한다.", "decisiveStep": "a^5+b^5+a^2b^3+a^3b^2을 (a^3+b^3)(a^2+b^2)으로 인수분해하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "식의 값"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-019(DIRECT_ACTIVE): 5차 다항식 인수분해 후 대칭식 값 대입"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "고차 대칭식을 공통인수로 묶어 인수분해하고 기본 대칭식으로 환원하는 전략 선택이 필요하다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "무리수", "src": "stem", "quote": "$a=1+\\sqrt{3}$, $b=1-\\sqrt{3}$일 때"}], "goal": [{"term": "식의값", "src": "stem", "quote": "$a^5+b^5+a^2b^3+a^3b^2$의 값은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "공통인수로 묶어 인수분해하면", "evidenceType": "NAMED"}, {"term": "대칭식", "src": "solution", "quote": "(a^3+b^3)(a^2+b^2)", "evidenceType": "IMPLIED", "justification": "인수분해된 식을 합 a+b와 곱 ab의 대칭식으로 변환함"}], "condition": []}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.6

### 발문

\$1003^8\$을 \$250\$으로 나누었을 때의 나머지는?

### 선지

① \$24\$ ② \$39\$ ③ \$81\$ ④ \$61\$ ⑤ \$189\$

### 정답

④

### 해설

\$x=1000\$으로 두면 \$1003^8=(x+3)^8\$이다. 다항식 \$(x+3)^8\$을 전개하면 상수항 \$3^8\$을 제외한 모든 항은 \$x\$를 인수로 가지므로 \$x\$로 나누어떨어진다. 즉, \$(x+3)^8 \= xQ(x)+3^8\$ (단, \$Q(x)\$는 다항식) 꼴로 나타낼 수 있다. \$x=1000=250\\cdot 4\$는 \$250\$의 배수이므로 \$1003^8\$을 \$250\$으로 나눈 나머지는 \$3^8\$을 \$250\$으로 나눈 나머지와 같다. \$3^8 \= (3^4)^2 \= 81^2 \= 6561\$ \$6561 \= 250\\cdot 26 \+ 61\$이므로 구하는 나머지는 \$61\$이다. 따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "1000을 x로 치환해 (x+3)^8=xQ(x)+3^8을 세우고 3^8=6561을 250으로 나눈 나머지를 구한다.", "decisiveStep": "1000이 250의 배수임을 이용해 1003^8의 나머지를 3^8의 나머지로 환원하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "수의 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-018(DIRECT_ACTIVE): 1000=x 치환 후 나머지정리로 큰 수 나눗셈 나머지 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "REINTERPRETATION", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수의 나눗셈을 다항식의 나눗셈과 나머지정리 구조로 재해석해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "거듭제곱", "src": "stem", "quote": "$1003^8$을 $250$으로 나누었을 때"}], "goal": [{"term": "나머지", "src": "stem", "quote": "나머지는?"}], "method": [{"term": "치환", "src": "solution", "quote": "$x=1000$으로 두면 $1003^8=(x+3)^8$이다.", "evidenceType": "IMPLIED", "justification": "큰 수의 밑에서 250의 배수 1000을 문자 x로 치환함"}, {"term": "나머지정리", "src": "solution", "quote": "$(x+3)^8 = xQ(x)+3^8$", "evidenceType": "IMPLIED", "justification": "다항식 나눗셈의 항등식 표현으로 나머지 항만 분리함"}], "condition": []}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.6

### 발문

세 변의 길이가 \$a, b, c\$인 삼각형 \$ABC\$가 다음 두 조건을 만족시킬 때, 삼각형 \$ABC\$의 둘레의 길이는?  
(가) \$a^2-4a-5=0\$

(나) \$a^3+b^3+ac^2+bc^2=a^2c+b^2c+2abc\$

### 선지

① \$9\$ ② \$12\$ ③ \$15\$ ④ \$18\$ ⑤ \$20\$

### 정답

③

### 해설

조건 (가)에서 \$a^2-4a-5=(a-5)(a+1)=0\$이다. \$a\$는 삼각형의 변의 길이이므로 \$a\>0\$이고, 따라서 \$a=5\$이다. 조건 (나)의 우변을 좌변으로 이항하여 인수분해한다. \$\\begin{aligned} (a^3+b^3)+(a+b)c^2 - c(a^2+2ab+b^2) &= 0 \\ (a+b)(a^2-ab+b^2)+(a+b)c^2-c(a+b)^2 &= 0 \\ (a+b)(a^2+b^2+c^2-ab-bc-ca) &= 0 \\end{aligned}\$ \$a+b\>0\$이므로 \$a^2+b^2+c^2-ab-bc-ca=0\$이다. 양변을 변형하면 \$\\frac{1}{2}{(a-b)^2+(b-c)^2+(c-a)^2}=0\$이므로 \$a=b=c\$이다. \$a=5\$이므로 삼각형 \$ABC\$의 둘레의 길이는 \$5+5+5=15\$이다. 따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "조건 (가)에서 양수 a=5를 구하고, 조건 (나)를 (a+b)(a^2+b^2+c^2-ab-bc-ca)=0으로 인수분해해 정삼각형임을 밝힌다.", "decisiveStep": "(나)를 공통인수 (a+b)로 묶고 완전제곱식의 합 꼴로 변형해 a=b=c를 도출하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 조건식 인수분해로 정삼각형 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "고차 다항식의 인수분해와 변 길이 양수 조건을 결합해 삼각형의 형태를 판정하는 준고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "삼각형", "src": "stem", "quote": "세 변의 길이가 $a, b, c$인 삼각형 $ABC$"}], "goal": [{"term": "둘레", "src": "stem", "quote": "삼각형 $ABC$의 둘레의 길이는?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "이항하여 인수분해한다.", "evidenceType": "NAMED"}, {"term": "완전제곱식", "src": "solution", "quote": "$\\frac{1}{2}\\{(a-b)^2+(b-c)^2+(c-a)^2\\}=0$", "evidenceType": "IMPLIED", "justification": "세 실수의 제곱의 합이 0이면 각 항이 0임을 이용함"}], "condition": [{"term": "양수", "src": "solution", "quote": "$a>0$이고"}]}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.7

### 발문

복소수 \$z\$와 그 켤레복소수 \$\\bar{z}\$에 대하여 \$(1+i)z+2\\bar{z}=7+3i\$가 성립할 때, \$z^3-4z^2+7z+3\$의 값은? (단, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$7-2i\$ ② \$7+2i\$ ③ \$5-2i\$ ④ \$6-2i\$ ⑤ \$7-i\$

### 정답

①

### 해설

\$z=a+bi\$ (\$a, b\$는 실수)라 두면 \$\\bar{z}=a-bi\$이다. \$\\begin{aligned} (1+i)(a+bi)+2(a-bi) &= (a-b)+(a+b)i+2a-2bi \\ &= (3a-b)+(a-b)i \\end{aligned}\$ 복소수가 서로 같을 조건에 의하여 \$3a-b=7\$, \$a-b=3\$이다. 두 식을 변변 빼면 \$2a=4\$이므로 \$a=2\$, \$b=-1\$이다. 즉, \$z=2-i\$이다. \$z-2=-i\$의 양변을 제곱하면 \$z^2-4z+4=-1\$, 즉 \$z^2-4z+5=0\$이다. 따라서 \$\\begin{aligned} z^3-4z^2+7z+3 &= z(z^2-4z+5)+2z+3 \\ &= z\\cdot 0+2(2-i)+3 \\ &= 7-2i \\end{aligned}\$ 그러므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "z=a+bi로 두고 복소수 상등으로 z=2-i를 구한 뒤, z^2-4z+5=0을 이용해 삼차식의 차수를 낮춘다.", "decisiveStep": "z=2-i에서 z^2-4z+5=0을 유도해 삼차식을 일차식으로 차수 낮추기 하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): 복소수 상등으로 z 결정 후 이차방정식으로 차수 축소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "복소수 결정 후 직접 세제곱하지 않고 이차관계식을 만들어 차수를 낮추는 전략 전환이 필요하다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z$"}, {"term": "켤레복소수", "src": "stem", "quote": "켤레복소수 $\\bar{z}$"}], "goal": [{"term": "식의값", "src": "stem", "quote": "$z^3-4z^2+7z+3$의 값은?"}], "method": [{"term": "상등", "src": "solution", "quote": "복소수가 서로 같을 조건에 의하여", "evidenceType": "NAMED"}, {"term": "연립일차방정식", "src": "solution", "quote": "두 식을 변변 빼면 $2a=4$", "evidenceType": "IMPLIED", "justification": "실수부분과 허수부분 조건을 연립해 a, b를 구함"}, {"term": "다항식의나눗셈", "src": "solution", "quote": "z(z^2-4z+5)+2z+3", "evidenceType": "IMPLIED", "justification": "z^2-4z+5=0으로 삼차식을 나누어 나머지로 차수를 낮춤"}], "condition": []}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.7

### 발문

직선 \$y=2x+k\$가 이차함수 \$y=x^2+4x-1\$의 그래프와 만나고, 이차함수 \$y=2x^2-2x+4\$의 그래프와는 만나지 않도록 하는 정수 \$k\$의 개수는?

### 선지

① \$2\$ ② \$4\$ ③ \$3\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

직선 \$y=2x+k\$가 첫 번째 이차함수 \$y=x^2+4x-1\$과 만나려면 연립방정식 \$x^2+4x-1=2x+k\$, 즉 \$x^2+2x-1-k=0\$이 실근을 가져야 한다. \$\\frac{D\_1}{4} \= 1^2-1\\cdot(-1-k) \= k+2 \\ge 0 \\implies k \\ge \-2\$ 두 번째 이차함수 \$y=2x^2-2x+4\$와 만나지 않으려면 연립방정식 \$2x^2-2x+4=2x+k\$, 즉 \$2x^2-4x+4-k=0\$이 실근을 갖지 않아야 한다. \$\\frac{D\_2}{4} \= (-2)^2-2(4-k) \= 2k-4 \< 0 \\implies k \< 2\$ 두 조건을 동시에 만족시키는 범위는 \$-2 \\le k \< 2\$이다. 이 범위에 속하는 정수 \$k\$는 \$-2, \-1, 0, 1\$의 \$4\$개이다. 따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 이차함수와 직선의 연립방정식에 판별식 D1>=0과 D2<0을 적용해 k의 범위를 구하고 정수를 센다.", "decisiveStep": "만나는 조건(D1>=0)과 만나지 않는 조건(D2<0)의 경계 등호 여부를 구분해 -2<=k<2를 얻는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 두 포물선과 직선의 판별식 D1>=0, D2<0 연립"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "두 위치 관계의 판별식 부등식을 동시에 만족하는 실수 범위와 정수 조건을 정확히 처리해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "직선", "src": "stem", "quote": "직선 $y=2x+k$"}, {"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+4x-1$"}], "goal": [{"term": "개수", "src": "stem", "quote": "정수 $k$의 개수는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "$\\frac{D_1}{4} = 1^2-1\\cdot(-1-k) = k+2 \\ge 0", "evidenceType": "IMPLIED", "justification": "교점의 존재 여부를 이차방정식의 판별식 부호로 판정함"}, {"term": "열거", "src": "solution", "quote": "정수 $k$는 $-2, -1, 0, 1$의 $4$개이다.", "evidenceType": "IMPLIED", "justification": "부등식 범위 안의 정수를 빠짐없이 나열해 셈"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $k$"}, {"term": "범위", "src": "solution", "quote": "범위는 $-2 \\le k < 2$이다."}]}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.8

### 발문

이차방정식 \$x^2-6x+4k-2=0\$의 두 근이 모두 \$1\$보다 크도록 하는 실수 \$k\$의 값의 범위가 \$a \< k \\le b\$일 때, \$a+b\$의 값은?

### 선지

① \$\\frac{5}{2}\$ ② \$\\frac{7}{2}\$ ③ \$\\frac{11}{2}\$ ④ \$\\frac{9}{2}\$ ⑤ \$\\frac{13}{2}\$

### 정답

④

### 해설

\$f(x)=x^2-6x+4k-2\$라 하자. 방정식 \$f(x)=0\$의 두 근이 모두 \$1\$보다 크려면 다음 세 조건을 모두 만족해야 한다. (i) 판별식: \$\\frac{D}{4} \= (-3)^2-(4k-2) \= 11-4k \\ge 0 \\implies k \\le \\frac{11}{4}\$ (ii) 축의 위치: \$f(x)=(x-3)^2+4k-11\$의 축은 \$x=3\$이므로 \$3 \> 1\$을 항상 만족한다. (iii) 경계에서의 함숫값: \$f(1)=1-6+4k-2=4k-7 \> 0 \\implies k \> \\frac{7}{4}\$ (i), (ii), (iii)의 공통 범위는 \$\\frac{7}{4} \< k \\le \\frac{11}{4}\$이다. 따라서 \$a=\\frac{7}{4}\$, \$b=\\frac{11}{4}\$이므로 \$a+b=\\frac{7}{4}+\\frac{11}{4}=\\frac{18}{4}=\\frac{9}{2}\$이다. 그러므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "f(x)=x^2-6x+4k-2에서 판별식 D/4>=0, 축 x=3>1, 경계값 f(1)>0 세 조건의 공통 범위를 구한다.", "decisiveStep": "근의 분리 조건(판별식, 축, 경계 함숫값 부호)을 모두 세워 7/4 < k <= 11/4를 확정하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): 이차함수 근의 위치 조건(판별식, 축, 경계값) 연립"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "이차방정식 근의 위치(근의 분리) 3가지 필수 조건과 등호 포함 여부를 모두 검증해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-6x+4k-2=0$"}], "goal": [{"term": "범위", "src": "stem", "quote": "실수 $k$의 값의 범위가 $a < k \\le b$일 때"}, {"term": "합", "src": "stem", "quote": "$a+b$의 값은?"}], "method": [{"term": "근의분리", "src": "solution", "quote": "두 근이 모두 $1$보다 크려면 다음 세 조건을 모두 만족해야 한다.", "evidenceType": "IMPLIED", "justification": "이차함수의 그래프를 이용해 근이 특정 수보다 클 조건을 판정함"}, {"term": "판별식", "src": "solution", "quote": "판별식: $\\frac{D}{4} = (-3)^2-(4k-2) = 11-4k \\ge 0", "evidenceType": "NAMED"}], "condition": [{"term": "실근", "src": "solution", "quote": "두 근이 모두 $1$보다 크려면"}, {"term": "실수", "src": "stem", "quote": "실수 $k$"}]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 5.1

### 발문

점 \$P(a, b)\$가 점 \$A(0, 8)\$에서 점 \$B(4, 0)\$까지 직선 \$y=-2x+8\$을 따라 움직일 때, \$3a^2+6b\$의 최솟값은?

### 선지

① \$24\$ ② \$30\$ ③ \$36\$ ④ \$42\$ ⑤ \$48\$

### 정답

③

### 해설

점 \$P(a, b)\$가 직선 \$y=-2x+8\$ 위의 점이므로 \$b=-2a+8\$이다. 또한 점 \$P\$가 \$A(0, 8)\$에서 \$B(4, 0)\$까지 움직이므로 \$a\$의 범위는 \$0 \\le a \\le 4\$이다. \$b=-2a+8\$을 주어진 식에 대입하면 \$\\begin{aligned} 3a^2+6b &= 3a^2+6(-2a+8) \\ &= 3a^2-12a+48 \\ &= 3(a-2)^2+36 \\end{aligned}\$ 꼭짓점의 \$a\$좌표 \$a=2\$가 구간 \$0 \\le a \\le 4\$ 안에 있으므로, \$a=2\$일 때 최솟값 \$36\$을 갖는다. 따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "선분 AB 위 점 조건으로 b=-2a+8과 0<=a<=4를 얻어 대입한 뒤 이차식의 최솟값을 구한다.", "decisiveStep": "일차 관계식 b=-2a+8을 대입해 한 문자의 이차식 3(a-2)^2+36으로 바꾸는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 선분 위 점 조건 대입 후 제한 구간 이차식 최솟값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 변수의 구속 조건에서 정의역 범위를 추출하고 이차함수 최솟값 문제로 환원해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "점", "src": "stem", "quote": "점 $P(a, b)$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=-2x+8$"}], "goal": [{"term": "최솟값", "src": "stem", "quote": "$3a^2+6b$의 최솟값은?"}], "method": [{"term": "대입", "src": "solution", "quote": "$b=-2a+8$을 주어진 식에 대입하면", "evidenceType": "NAMED"}, {"term": "완전제곱식", "src": "solution", "quote": "3(a-2)^2+36", "evidenceType": "IMPLIED", "justification": "이차식을 표준형으로 변형하여 꼭짓점에서 최솟값을 찾음"}], "condition": [{"term": "정의역제한", "src": "solution", "quote": "범위는 $0 \\le a \\le 4$이다."}]}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 5.2

### 발문

이차함수 \$y=x^2\$의 그래프와 직선 \$y=2x+k\$가 만나는 두 점을 \$A, B\$라 하고, 점 \$A, B\$에서 \$x\$축에 내린 수선의 발을 각각 \$C, D\$라 하자. 원점 \$O\$에 대하여 두 삼각형 \$AOC\$, \$DOB\$의 넓이를 각각 \$S\_1, S\_2\$라 할 때, \$S\_1-S\_2=22\$를 만족시키는 양수 \$k\$의 값은? (단, 점 \$A\$는 제\$1\$사분면 위의 점이다.)

### 선지

① \$4\$ ② \$5\$ ③ \$7\$ ④ \$8\$ ⑤ \$6\$

### 정답

⑤

### 해설

두 교점 \$A, B\$의 \$x\$좌표를 각각 \$u,(u\>0)\$, \$v,(v\<0)\$라 하자. 교점의 \$x\$좌표는 방정식 \$x^2=2x+k\$, 즉 \$x^2-2x-k=0\$의 두 근이므로 근과 계수의 관계에 의하여 \$u+v=2\$, \$uv=-k\$이다. \$A(u, u^2)\$, \$C(u, 0)\$이고 \$u\>0\$이므로 삼각형 \$AOC\$의 넓이는 \$S\_1 \= \\frac{1}{2}\\cdot u \\cdot u^2 \= \\frac{u^3}{2}\$ \$B(v, v^2)\$, \$D(v, 0)\$이고 \$v\<0\$이므로 밑변 \$OD\$의 길이는 \$-v\$이다. 따라서 삼각형 \$DOB\$의 넓이는 \$S\_2 \= \\frac{1}{2}\\cdot (-v) \\cdot v^2 \= \-\\frac{v^3}{2}\$ 그러므로 \$\\begin{aligned} S\_1-S\_2 &= \\frac{u^3}{2}-\\left(-\\frac{v^3}{2}\\right) \= \\frac{u^3+v^3}{2} \\ &= \\frac{(u+v)^3-3uv(u+v)}{2} \\ &= \\frac{2^3-3(-k)\\cdot 2}{2} \= \\frac{8+6k}{2} \= 4+3k \\end{aligned}\$ \$4+3k=22\$에서 \$3k=18\$이므로 \$k=6\$이다. 따라서 정답은 ⑤이다.

```
{
  "capability": "piecewise-polynomial-spike-v1",
  "graphPlan": {
    "family": "piecewise-polynomial",
    "pieces": [
      {
        "coefficients": [
          "0",
          "0",
          "1"
        ]
      }
    ],
    "breakpoints": [],
    "sourceDomain": {
      "kind": "INTERVAL",
      "range": [
        "-3",
        "4"
      ],
      "states": [
        "CLOSED",
        "CLOSED"
      ]
    },
    "formula": "x^2",
    "requiredPoints": [
      {
        "id": "O",
        "x": 0,
        "y": 0
      }
    ],
    "coordinateBand": {
      "hide": [
        "O"
      ]
    },
    "axisTickValues": {
      "x": [],
      "y": []
    },
    "sampleNote": "예시: k=3",
    "overlays": {
      "lines": [
        {
          "id": "L",
          "slope": "2",
          "intercept": "3",
          "label": "y=2x+k",
          "labelValues": {
            "k": "3"
          }
        }
      ],
      "points": [
        {
          "id": "A",
          "curveX": "3"
        },
        {
          "id": "B",
          "curveX": "-1"
        },
        {
          "id": "C",
          "axis": "x",
          "value": "3"
        },
        {
          "id": "D",
          "axis": "x",
          "value": "-1"
        },
        {
          "id": "O0",
          "x": "0",
          "y": "0",
          "unnamed": true
        }
      ],
      "segments": [
        {
          "id": "OA",
          "from": "O0",
          "to": "A"
        },
        {
          "id": "OB",
          "from": "O0",
          "to": "B"
        },
        {
          "id": "AC",
          "from": "A",
          "to": "C"
        },
        {
          "id": "BD",
          "from": "B",
          "to": "D"
        }
      ],
      "polygons": [
        {
          "id": "S1",
          "points": [
            "A",
            "O0",
            "C"
          ],
          "fill": "BLUE",
          "label": "S_1"
        },
        {
          "id": "S2",
          "points": [
            "D",
            "O0",
            "B"
          ],
          "fill": "WARM",
          "label": "S_2"
        }
      ]
    }
  },
  "pointNames": {
    "A": "A",
    "B": "B",
    "C": "C",
    "D": "D",
    "O": "O"
  },
  "caption": "예시(k=3)일 때 y=x^2과 직선 y=2x+k의 두 교점 A, B와 x축 위 수선의 발 C, D로 만든 두 삼각형 AOC(S_1)와 DOB(S_2)의 배치이다."
}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 교점의 x좌표 u>0, v<0을 근과 계수의 관계로 묶고 S1-S2=(u^3+v^3)/2를 k에 대한 식으로 나타낸다.", "decisiveStep": "v<0 부호를 반영해 S2=-v^3/2로 세우고 S1-S2=(u^3+v^3)/2를 대칭식으로 변환하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): 포물선과 직선 교점 근과 계수로 넓이 차 표현"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "그래프 기하의 부호 있는 길이 해석과 이차방정식 근과 계수의 관계, 3차 대칭식을 결합한 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=2x+k$"}], "goal": [{"term": "매개변수", "src": "stem", "quote": "양수 $k$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여 $u+v=2$, $uv=-k$이다.", "evidenceType": "NAMED"}, {"term": "넓이", "src": "solution", "quote": "삼각형 $AOC$의 넓이는", "evidenceType": "NAMED"}, {"term": "대칭식", "src": "solution", "quote": "\\frac{(u+v)^3-3uv(u+v)}{2}", "evidenceType": "IMPLIED", "justification": "두 교점 x좌표의 세제곱 합을 합과 곱의 대칭식으로 변형함"}], "condition": [{"term": "양수", "src": "stem", "quote": "양수 $k$"}, {"term": "사분면", "src": "stem", "quote": "점 $A$는 제$1$사분면 위의 점이다."}]}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 5.2

### 발문

다항식 \$P(x)\$를 \$x^2-4\$로 나눈 나머지가 \$3x-7\$일 때, 이 나머지의 \$x\$항의 계수와 상수항의 합은?

### 선지

① \$-4\$ ② \$-10\$ ③ \$4\$ ④ \$10\$ ⑤ \$11\$

### 정답

①

### 해설

문제에서 다항식 \$P(x)\$를 \$x^2-4\$로 나눈 나머지 \$R(x)\$가 \$R(x)=3x-7\$로 직접 주어졌다. 따라서 \$x\$항의 계수는 \$3\$, 상수항은 \$-7\$이다. 구하는 합은 \$3+(-7)=-4\$이므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "주어진 나머지 일차식 3x-7에서 x항의 계수 3과 상수항 -7을 직접 읽어 합한다.", "decisiveStep": "나머지 R(x)=3x-7의 계수와 상수항을 바로 읽는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009(RPM_ONLY): 나눗셈 나머지 일차식 계수 직접 판독"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 나머지 식의 계수와 상수항을 바로 읽어 합하는 1단계 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}, {"term": "나머지", "src": "stem", "quote": "나머지가 $3x-7$일 때"}], "goal": [{"term": "합", "src": "stem", "quote": "$x$항의 계수와 상수항의 합은?"}], "method": [{"term": "계수", "src": "stem", "quote": "$x$항의 계수와 상수항의 합은?", "evidenceType": "NAMED"}], "condition": []}}, "hold": "RPM_ONLY"}
```

## Q18

- 형식: 객관식  
- 배점: 5.3

### 발문

다항식 \$2x^3+ax^2+(2a-2)x+12\$가 정수 계수를 갖는 세 일차식의 곱으로 인수분해될 때, 정수 \$a\$의 개수는?

### 선지

① \$4\$ ② \$6\$ ③ \$5\$ ④ \$7\$ ⑤ \$8\$

### 정답

②

### 해설

\$P(x)=2x^3+ax^2+(2a-2)x+12\$라 두자. \$x=-2\$를 대입하면 \$P(-2)=2(-8)+4a-2(2a-2)+12=-16+4a-4a+4+12=0\$이므로 인수정리에 의하여 \$x+2\$가 \$P(x)\$의 인수이다. 조립제법으로 인수분해하면 \$P(x)=(x+2){2x^2+(a-4)x+6}\$ 남은 이차식 \$2x^2+(a-4)x+6\$이 정수 계수를 갖는 두 일차식의 곱으로 인수분해되려면 \$2x^2+(a-4)x+6=(2x+m)(x+n)\$ (단, \$m, n\$은 정수) 꼴로 놓을 수 있어야 한다. 계수를 비교하면 \$mn=6\$, \$a-4=m+2n\$, 즉 \$a=m+2n+4\$이다. \$mn=6\$인 정수 순서쌍 \$(m, n)\$은 \$(1, 6), (2, 3), (3, 2), (6, 1), (-1, \-6), (-2, \-3), (-3, \-2), (-6, \-1)\$ 이고, 각각에 대응하는 \$a=m+2n+4\$의 값은 \$17, 12, 11, 12, \-9, \-4, \-3, \-4\$이다. 서로 다른 정수 \$a\$의 값은 \$-9, \-4, \-3, 11, 12, 17\$의 \$6\$개이다. 따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "x=-2 대입으로 공통인수 (x+2)를 찾은 뒤 남은 이차식 2x^2+(a-4)x+6을 (2x+m)(x+n)으로 두고 mn=6의 정수쌍으로 a의 개수를 센다.", "decisiveStep": "미지수 a를 소거하는 x=-2를 찾아 (x+2)를 분리한 뒤 부정방정식 mn=6의 중복 값을 제거해 개수를 세는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 공통인수 x+2 추출 후 이차식 정수 인수분해 쌍 셈"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "인수정리로 문자를 소거하는 인수 발견과 정수 계수 인수분해 부정방정식의 중복 제거까지 처리해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $2x^3+ax^2+(2a-2)x+12$"}], "goal": [{"term": "개수", "src": "stem", "quote": "정수 $a$의 개수는?"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여 $x+2$가 $P(x)$의 인수이다.", "evidenceType": "NAMED"}, {"term": "인수분해", "src": "solution", "quote": "조립제법으로 인수분해하면", "evidenceType": "NAMED"}, {"term": "부정방정식", "src": "solution", "quote": "$mn=6$인 정수 순서쌍 $(m, n)$은", "evidenceType": "IMPLIED", "justification": "정수 계수 조건으로 곱이 6인 정수 순서쌍을 열거해 a를 구함"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 계수를 갖는"}]}}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 4

### 발문

\[서술형 1\] 다항식 \$x^3+3x^2-2x+a\$가 \$x^2-x+2\$로 나누어떨어질 때, 상수 \$a\$의 값을 구하시오.

### 선지

없음

### 정답

8

### 해설

다항식 \$x^3+3x^2-2x+a\$가 \$x^2-x+2\$로 나누어떨어지므로 몫을 \$x+k\$ (\$k\$는 상수)라 둘 수 있다. \$\\begin{aligned} x^3+3x^2-2x+a &= (x^2-x+2)(x+k) \\ &= x^3+(k-1)x^2+(2-k)x+2k \\end{aligned}\$ 양변의 \$x^2\$의 계수를 비교하면 \$k-1=3\$이므로 \$k=4\$이다. (이때 \$x\$의 계수는 \$2-4=-2\$로 일치한다.) 상수항을 비교하면 \$a=2k=2\\cdot 4=8\$이다. 따라서 구하는 값은 \$8\$이다.

```
"NONE"
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "나누어떨어지므로 몫을 x+k로 두고 전개한 뒤 계수비교법으로 k와 a를 구한다.", "decisiveStep": "삼차식의 최고차항 계수 1을 이용해 몫을 일차식 x+k로 설정하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 나누어떨어지는 몫 x+k 설정 후 계수비교법"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나누어떨어진다는 조건에서 몫을 일차식으로 설정하고 계수를 비교하는 기본 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^3+3x^2-2x+a$"}], "goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값을 구하시오."}], "method": [{"term": "다항식의나눗셈", "src": "stem", "quote": "$x^2-x+2$로 나누어떨어질 때", "evidenceType": "NAMED"}, {"term": "전개", "src": "solution", "quote": "(x^2-x+2)(x+k)", "evidenceType": "IMPLIED", "justification": "몫을 설정해 우변을 전개함"}, {"term": "계수비교", "src": "solution", "quote": "양변의 $x^2$의 계수를 비교하면", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "상수 $a$"}]}}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 2\] \$P(x)={(x+1)(x+8)}{(x+3)(x+6)}+k\$가 최고차항의 계수가 \$1\$인 이차식 \$f(x)\$의 제곱으로 나타날 때, 상수 \$k\$의 값과 \$f(1)\$의 값을 구하는 과정을 서술하시오.

### 선지

없음

### 정답

k=25, f(1)=23

### 해설

공통부분이 생기도록 두 일차식씩 짝을 지어 전개하면 \$(x+1)(x+8)=x^2+9x+8\$, \$(x+3)(x+6)=x^2+9x+18\$ \$t=x^2+9x\$로 치환하면 \$\\begin{aligned} P(x) &= (t+8)(t+18)+k \\ &= t^2+26t+144+k \\end{aligned}\$ \$P(x)\$가 최고차항의 계수가 \$1\$인 이차식 \$f(x)\$의 제곱이 되려면 \$t\$에 대한 이차식 \$t^2+26t+144+k\$가 완전제곱식이어야 한다. 즉, \$t^2+26t+144+k=(t+13)^2=t^2+26t+169\$이므로 \$144+k=169 \\implies k=25\$ 따라서 \$P(x)=(t+13)^2=(x^2+9x+13)^2\$이므로 \$f(x)=x^2+9x+13\$이다. 그러므로 \$f(1)=1^2+9\\cdot 1+13=23\$이다. 따라서 구하는 값은 \$k=25\$, \$f(1)=23\$이다.

```
"NONE"
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "x^2+9x=t로 치환해 P(x)=t^2+26t+144+k가 완전제곱식이 되도록 k=25를 구하고 f(1)을 계산한다.", "decisiveStep": "공통부분 x^2+9x를 t로 치환해 완전제곱식 조건 (t+13)^2으로 연결하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 치환 후 완전제곱식 인수분해 조건으로 k 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "REINTERPRETATION", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "네 일차식의 곱을 공통부분 치환으로 이차식 완전제곱 형태로 재해석해야 한다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "$P(x)=\\{(x+1)(x+8)\\}\\{(x+3)(x+6)\\}+k$"}], "goal": [{"term": "상수", "src": "stem", "quote": "상수 $k$의 값"}, {"term": "함숫값", "src": "stem", "quote": "$f(1)$의 값"}], "method": [{"term": "치환", "src": "solution", "quote": "$t=x^2+9x$로 치환하면", "evidenceType": "NAMED"}, {"term": "완전제곱식", "src": "solution", "quote": "$t^2+26t+144+k$가 완전제곱식이어야 한다.", "evidenceType": "NAMED"}], "condition": [{"term": "이차식", "src": "stem", "quote": "최고차항의 계수가 $1$인 이차식 $f(x)$의 제곱"}]}}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 3\] 이차방정식 \$x^2-6x+a=0\$의 두 근을 \$\\alpha, \\beta\$라 하자. 이차방정식 \$x^2+bx+48=0\$의 두 근이 \$\\alpha+\\beta\$와 \$\\alpha-\\beta\$일 때, \$a+b\$의 값을 구하시오. (단, \$a, b\$는 상수이다.)

### 선지

없음

### 정답

\-21

### 해설

이차방정식 \$x^2-6x+a=0\$에서 근과 계수의 관계에 의하여 \$\\alpha+\\beta=6\$, \$\\alpha\\beta=a\$ \$s=\\alpha+\\beta=6\$, \$d=\\alpha-\\beta\$라 하자. 이차방정식 \$x^2+bx+48=0\$의 두 근이 \$s, d\$이므로 근과 계수의 관계에 의하여 \$sd=48\$, \$s+d=-b\$ \$s=6\$이므로 \$6d=48\$에서 \$d=8\$이다. 따라서 \$-b=6+8=14\$이므로 \$b=-14\$이다. 또한 \$(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta\$이므로 \$8^2=6^2-4a \\implies 64=36-4a \\implies 4a=-28 \\implies a=-7\$ 따라서 \$a+b=-7+(-14)=-21\$이므로 구하는 값은 \$-21\$이다.

```
"NONE"
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 이차방정식에 근과 계수의 관계를 연쇄 적용해 a+b=6과 (a-b)d=48에서 d=8, b=-14, a=-7을 구한다.", "decisiveStep": "두 번째 방정식의 두 근의 곱 6(a-b)=48에서 a-b=8을 구하고 (a-b)^2=(a+b)^2-4ab로 연결하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 두 이차방정식 근과 계수의 관계 연쇄 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 방정식의 근과 계수의 관계를 상호 연결하고 차의 제곱 공식을 적용해야 한다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-6x+a=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b$의 값을 구하시오."}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}, {"term": "대칭식", "src": "solution", "quote": "$(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta$", "evidenceType": "IMPLIED", "justification": "두 근의 합과 차의 제곱 관계식을 이용해 두 근의 곱을 구함"}], "condition": [{"term": "상수", "src": "stem", "quote": "$a, b$는 상수이다."}]}}, "hold": "BINDING_GAP"}
```

## Q22

- 형식: 서답형  
- 배점: 6

### 발문

\[서술형 4\] \$0 \\le x \\le 6\$에서 이차함수 \$y=x^2-2kx+7k\$의 최솟값이 \$10\$이 되도록 하는 모든 실수 \$k\$의 값의 합을 구하시오.

### 선지

없음

### 정답

7

### 해설

\$f(x)=x^2-2kx+7k=(x-k)^2-k^2+7k\$이므로 축은 \$x=k\$이다. 축 \$x=k\$의 위치와 구간 \$0 \\le x \\le 6\$의 관계에 따라 세 경우로 나눈다. (i) \$k \< 0\$일 때: 축이 구간의 왼쪽에 있으므로 \$x=0\$에서 최솟값을 갖는다. \$f(0)=7k=10\$에서 \$k=\\frac{10}{7}\$이지만 \$k\<0\$에 모순이므로 해가 없다. (ii) \$0 \\le k \\le 6\$일 때: 축이 구간 안에 있으므로 꼭짓점 \$x=k\$에서 최솟값을 갖는다. \$f(k)=-k^2+7k=10 \\implies k^2-7k+10=0 \\implies (k-2)(k-5)=0\$ \$k=2, 5\$는 모두 \$0 \\le k \\le 6\$을 만족하므로 가능하다. (iii) \$k \> 6\$일 때: 축이 구간의 오른쪽에 있으므로 \$x=6\$에서 최솟값을 갖는다. \$f(6)=36-12k+7k=36-5k=10 \\implies 5k=26 \\implies k=\\frac{26}{5}\$ 그러나 \$\\frac{26}{5}=5.2\$는 \$k\>6\$에 모순이므로 해가 없다. 따라서 조건을 만족하는 모든 실수 \$k\$는 \$2, 5\$이고 그 합은 \$2+5=7\$이다. 그러므로 구하는 값은 \$7\$이다.

```
"NONE"
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "축 x=k의 위치에 따라 k<0, 0<=k<=6, k>6 세 구간으로 경우 분류해 각 경우의 최솟값=10 방정식을 풀고 범위 적합성을 확인한다.", "decisiveStep": "구간 [0, 6]에 대한 축 x=k의 세 가지 위치 경우 분류와 각 해의 범위 검증 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 대칭축 x=k 위치별 경우 분류로 최솟값=10 풀이"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "미정 축에 대한 구간 내 최솟값 경우 분류 및 각 경우에서 얻은 근의 범위 적합성 검증이 핵심이다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-2kx+7k$"}], "goal": [{"term": "합", "src": "stem", "quote": "모든 실수 $k$의 값의 합을 구하시오."}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "$f(x)=x^2-2kx+7k=(x-k)^2-k^2+7k$", "evidenceType": "IMPLIED", "justification": "이차함수를 표준형으로 고쳐 축의 위치 k를 찾음"}, {"term": "경우분류", "src": "solution", "quote": "세 경우로 나눈다.", "evidenceType": "IMPLIED", "justification": "축 x=k가 구간 왼쪽, 내부, 오른쪽에 있을 때로 나누어 최솟값을 구함"}], "condition": [{"term": "정의역제한", "src": "stem", "quote": "$0 \\le x \\le 6$에서"}, {"term": "실수", "src": "stem", "quote": "모든 실수 $k$"}]}}, "hold": ""}
```

