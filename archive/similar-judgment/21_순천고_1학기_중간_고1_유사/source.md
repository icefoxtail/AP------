

```
{"stem": "21_순천고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/21_순천고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.9

### 발문

\$x=3+i\$, \$y=3-i\$일 때, \$\\dfrac{y}{x}+\\dfrac{x}{y}\$의 값은?

### 선지

① \$\\dfrac{8}{5}\$ ② \$-\\dfrac{8}{5}\$ ③ \$\\dfrac{6}{5}\$ ④ \$\\dfrac{4}{5}\$ ⑤ \$\\dfrac{7}{5}\$

### 정답

①

### 해설

\$x+y=(3+i)+(3-i)=6\$, \$xy=(3+i)(3-i)=9+1=10\$이다. 따라서 \$\$ \\frac{y}{x}+\\frac{x}{y} \= \\frac{x^2+y^2}{xy} \= \\frac{(x+y)^2-2xy}{xy} \= \\frac{6^2-2\\cdot 10}{10} \= \\frac{16}{10} \= \\frac{8}{5} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "켤레복소수 x, y의 합과 곱을 구해 통분식 값을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "켤레복소수 $x=3+i, y=3-i$의 합 $6$과 곱 $10$을 구해 통분식 $\\frac{(x+y)^2-2xy}{xy}$에 대입한다.", "decisiveStep": "분자 $x^2+y^2$을 $(x+y)^2-2xy$로 변형해 계산량을 줄인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "H1-RPM-024 (DIRECT_ACTIVE): 켤레복소수 x, y의 합과 곱을 구해 대칭 분수식 값을 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레복소수의 합과 곱으로 대칭 유리식 값을 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "\\frac{x^2+y^2}{xy}"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "\\frac{(x+y)^2-2xy}{xy}", "evidenceType": "IMPLIED", "justification": "x+y와 xy를 구한 뒤 곱셈 공식의 변형으로 x^2+y^2을 계산함"}], "given": [{"term": "복소수", "src": "stem", "quote": "x=3+i$, $y=3-i$"}], "condition": []}, "reasons": {"method": "켤레복소수 합·곱을 구한 뒤 곱셈 공식 변형으로 분수식 값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.3

### 발문

\$x^3-7x^2+15x-9\$를 바르게 인수분해한 것은?

### 선지

① \$(x-1)(x+3)^2\$ ② \$(x-1)^2(x-3)\$ ③ \$(x-1)(x-3)^2\$ ④ \$(x+1)(x-3)^2\$ ⑤ \$(x-1)(x-2)(x-3)\$

### 정답

③

### 해설

\$P(x)=x^3-7x^2+15x-9\$라 하면 \$P(1)=1-7+15-9=0\$이므로 \$x-1\$을 인수로 갖는다. 조립제법을 적용하면 \$\$ P(x) \= (x-1)(x^2-6x+9) \= (x-1)(x-3)^2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차다항식을 인수정리와 조립제법으로 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$P(1)=0$으로 일차인수 $(x-1)$을 찾고 조립제법으로 몫 $x^2-6x+9=(x-3)^2$을 얻는다.", "decisiveStep": "$x=1$ 대입으로 인수 $x-1$을 분리한 뒤 남은 이차식을 완전제곱식으로 묶는다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "H1-RPM-014 (DIRECT_ACTIVE): 인수정리와 조립제법으로 삼차다항식을 단계적으로 인수분해하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차다항식에 인수정리와 조립제법을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "바르게 인수분해한 것은"}], "method": [{"term": "인수정리", "src": "solution", "quote": "P(1)=1-7+15-9=0$이므로 $x-1$을 인수로", "evidenceType": "IMPLIED", "justification": "x=1 대입으로 0이 되는 인수를 찾아 조립제법으로 인수분해함"}], "given": [{"term": "다항식", "src": "stem", "quote": "x^3-7x^2+15x-9"}], "condition": []}, "reasons": {"method": "P(1)=0 인수정리와 조립제법으로 삼차식을 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.4

### 발문

다항식 \$A\$, \$B\$가 \$A=2x^3-3x+2\$, \$B=x^3+2x^2-4x-1\$일 때, \$-5A-2(B-3A)\$의 값은?

### 선지

① \$4x^2+5x+4\$ ② \$-4x^2-5x+4\$ ③ \$-4x^2+5x\$ ④ \$4x^3-4x^2+5x+4\$ ⑤ \$-4x^2+5x+4\$

### 정답

⑤

### 해설

주어진 식을 간단히 정리하면 \$-5A-2B+6A=A-2B\$이므로 \$\$ \\begin{aligned} A-2B &= (2x^3-3x+2)-2(x^3+2x^2-4x-1) \\ &= (2-2)x^3-4x^2+(-3+8)x+(2+2) \\ &= \-4x^2+5x+4 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "다항식의 일차 결합을 A-2B로 정리한 뒤 동류항을 계산하는 순수 연산 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$-5A-2(B-3A)=A-2B$로 정리한 뒤 $A, B$를 대입해 동류항을 계산한다.", "decisiveStep": "$x^3$항의 계수가 $2-2=0$으로 소거됨을 정확히 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "H1-RPM-002 (DIRECT_ACTIVE): 다항식의 일차결합을 A-2B로 정리해 동류항을 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "괄호를 풀어 다항식을 정리하고 동류항 덧셈·뺄셈을 하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "다항식 $A$, $B$가"}], "method": [{"term": "동류항", "src": "solution", "quote": "A-2B &amp;=", "evidenceType": "IMPLIED", "justification": "식을 A-2B로 정리한 뒤 차수별 동류항 계수를 계산함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $A$, $B$가"}], "condition": []}, "reasons": {"method": "식을 A-2B로 간단히 한 뒤 동류항 연산을 수행함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.5

### 발문

\$x\$에 대한 이차식 \$x^2-2(3k-1)x+9k^2-4k+5\$가 완전제곱식이 될 때, 실수 \$k\$의 값은?

### 선지

① \$-4\$ ② \$-2\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

②

### 해설

완전제곱식이 되려면 판별식 \$D=0\$이어야 하므로 \$\$ \\frac{D}{4} \= (3k-1)^2-(9k^2-4k+5) \= \-2k-4 \= 0 \\implies k=-2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차식의 완전제곱식 조건 판별식 D=0으로 실수 k를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 $D/4=(3k-1)^2-(9k^2-4k+5)=-2k-4=0$을 풀어 $k=-2$를 구한다.", "decisiveStep": "전개 시 $9k^2$이 소거되어 일차방정식 $-2k-4=0$이 됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "H1-RPM-028 (DIRECT_ACTIVE): 이차식의 완전제곱식 조건(판별식 D/4=0)으로 k를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식의 완전제곱식 판별식 공식을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값은"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이어야", "evidenceType": "NAMED"}], "given": [{"term": "완전제곱식", "src": "stem", "quote": "완전제곱식이 될 때"}], "condition": []}, "reasons": {"method": "완전제곱식 판별식 D/4=0을 풀어 k=-2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.6

### 발문

이차방정식 \$3x^2+4x-k=0\$이 허근을 갖도록 하는 가장 큰 정수 \$k\$의 값은?

### 선지

① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$

### 정답

④

### 해설

허근을 가지므로 판별식 \$D\<0\$이다. \$\$ \\frac{D}{4} \= 2^2-3(-k) \= 4+3k \< 0 \\implies k \< \-\\frac{4}{3} \= \-1.\\overline{3} \$\$ 따라서 가장 큰 정수 \$k\$의 값은 \$-2\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식 허근 조건 D<0을 풀어 최대 정수 k를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 $D/4=4+3k&lt;0$을 풀어 $k&lt;-\\frac{4}{3}$을 만족하는 최대 정수 $-2$를 구한다.", "decisiveStep": "음수 부등식 $k&lt;-1.\\overline{3}$에서 가장 큰 정수가 $-2$임을 정확히 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "H1-RPM-028 (DIRECT_ACTIVE): 이차방정식의 허근 조건(판별식 D/4<0)으로 최대 정수 k를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허근 판별식 부등식을 풀어 음의 정수 최댓값을 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "가장 큰 정수 $k$"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D&lt;0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $3x^2+4x-k=0$"}], "condition": [{"term": "허근", "src": "stem", "quote": "허근을 갖도록"}]}, "reasons": {"method": "허근 조건 판별식 D/4&lt;0으로 최대 정수 k=-2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.8

### 발문

연립부등식 \$3x-7\<4x-9\\le 2x+1\$을 만족시키는 모든 양의 정수 \$x\$의 값의 합은?

### 선지

① \$12\$ ② \$10\$ ③ \$11\$ ④ \$13\$ ⑤ \$14\$

### 정답

①

### 해설

연립부등식을 두 부등식으로 나누어 풀면

- \$3x-7\<4x-9 \\implies x\>2\$  
- \$4x-9\\le 2x+1 \\implies 2x\\le 10 \\implies x\\le 5\$ 따라서 \$2\<x\\le 5\$이고, 양의 정수 \$x\$는 \$3, 4, 5\$이므로 합은 \$3+4+5=12\$이다.

```
{"status": "EXEMPT", "reason": "A<B<=C 꼴 연립일차부등식을 풀어 정수 해의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "$3x-7&lt;4x-9$와 $4x-9\\le 2x+1$을 각각 풀어 공통 범위 $2&lt;x\\le 5$의 정수 합을 구한다.", "decisiveStep": "연립부등식 해 $2&lt;x\\le 5$에서 $2$를 제외하고 $5$를 포함해 $3, 4, 5$를 더한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "정수해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_PARAMETER_INTEGER", "why": "H1-RPM-046 (DIRECT_ACTIVE): A<B<=C 꼴 연립일차부등식의 해에서 양의 정수해의 합을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$A&lt;B\\le C$ 꼴 연립일차부등식의 정수 해를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "모든 양의 정수 $x$의 값의 합"}], "method": [{"term": "연립부등식", "src": "stem", "quote": "연립부등식 $3x-7&lt;4x-9\\le 2x+1$", "evidenceType": "NAMED"}], "given": [{"term": "부등식", "src": "solution", "quote": "두 부등식으로 나누어"}], "condition": []}, "reasons": {"method": "연립일차부등식을 풀어 공통 범위 내 정수 3, 4, 5의 합 12를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.7

### 발문

사차방정식 \$x^4+x^3-7x^2-x+6=0\$의 가장 큰 근을 \$\\alpha\$, 가장 작은 근을 \$\\beta\$라 할 때, \$\\alpha-\\beta\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

③

### 해설

\$P(x)=x^4+x^3-7x^2-x+6\$이라 하면 \$P(1)=1+1-7-1+6=0\$, \$P(-1)=1-1-7+1+6=0\$이다. 조립제법을 연속 적용하면 \$\$ (x-1)(x+1)(x^2+x-6) \= (x-1)(x+1)(x+3)(x-2) \= 0 \$\$ 따라서 네 근은 \$-3, \-1, 1, 2\$이고 \$\\alpha=2, \\beta=-3\$이므로 \$\\alpha-\\beta=2-(-3)=5\$이다.

```
{"status": "EXEMPT", "reason": "사차방정식을 인수정리와 조립제법으로 인수분해해 최대·최소 근의 차를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "인수정리 $P(1)=0, P(-1)=0$과 조립제법으로 네 근 $-3, -1, 1, 2$를 구한 뒤 $\\alpha-\\beta$를 계산한다.", "decisiveStep": "$x=\\pm 1$로 두 일차인수를 추출한 뒤 남은 이차식 $x^2+x-6$을 마저 인수분해한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "H1-RPM-039 (DIRECT_ACTIVE): 인수정리와 조립제법으로 사차방정식을 인수분해해 네 근을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사차방정식을 인수정리와 조립제법으로 풀어 네 실근을 비교하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "사차방정식", "src": "stem", "quote": "사차방정식 $x^4+x^3-7x^2-x+6=0$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "P(1)=1+1-7-1+6=0$, $P(-1)=1-1-7+1+6=0$", "evidenceType": "IMPLIED", "justification": "x=1, -1 대입으로 인수를 찾아 조립제법으로 네 근을 구함"}], "given": [{"term": "다항식", "src": "solution", "quote": "P(x)=x^4+x^3-7x^2-x+6"}], "condition": []}, "reasons": {"method": "인수정리와 조립제법으로 사차방정식의 네 근을 구해 최대·최소 차를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.7

### 발문

세 수 \$x, y, z\$에 대하여 \$x+y+z=4\$, \$xy+yz+zx=-3\$, \$xyz=-5\$일 때, \$(x+y)(y+z)(z+x)\$의 값은?

### 선지

① \$-17\$ ② \$-12\$ ③ \$-5\$ ④ \$7\$ ⑤ \$-7\$

### 정답

⑤

### 해설

\$x+y+z=4\$에서 \$x+y=4-z\$, \$y+z=4-x\$, \$z+x=4-y\$이므로 \$\$ \\begin{aligned} (x+y)(y+z)(z+x) &= (4-x)(4-y)(4-z) \\ &= 4^3-(x+y+z)\\cdot 4^2+(xy+yz+zx)\\cdot 4-xyz \\ &= 64-4\\cdot 16+(-3)\\cdot 4-(-5) \\ &= 64-64-12+5 \= \-7 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "x+y+z=4를 이용해 (x+y)(y+z)(z+x)를 (4-x)(4-y)(4-z) 전개식으로 변환해 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$x+y=4-z$ 등으로 치환한 $(4-x)(4-y)(4-z)$를 전개해 세 기본대칭식 값을 대입한다.", "decisiveStep": "세 문자 두 개씩의 합을 $4-\\text{나머지}$로 바꾸어 삼차 전개 공식에 바로 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "H1-RPM-003 (DIRECT_ACTIVE): 세 문자의 기본대칭식이 주어졌을 때 곱셈공식 변형으로 대칭식 값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 변수의 기본대칭식이 주어졌을 때 $(x+y)(y+z)(z+x)$를 곱셈 공식으로 변형해 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "(4-x)(4-y)(4-z)"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "4^3-(x+y+z)\\cdot 4^2+(xy+yz+zx)\\cdot 4-xyz", "evidenceType": "IMPLIED", "justification": "(4-x)(4-y)(4-z) 전개 공식에 세 기본대칭식 값을 대입함"}], "given": [{"term": "전개", "src": "solution", "quote": "(4-x)(4-y)(4-z)"}], "condition": []}, "reasons": {"method": "x+y=4-z 변형 후 삼차 전개 공식에 대칭식 값을 대입해 -7을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.9

### 발문

\$2000\$개의 이차식 \$2000x^2-3x-1\$, \$1999x^2-3x-1\$, \$\\cdots\$, \$x^2-3x-1\$ 중에서 \$x\$의 계수와 상수항이 정수인 두 일차식의 곱으로 인수분해되는 것의 개수는?

### 선지

① \$41\$ ② \$43\$ ③ \$44\$ ④ \$45\$ ⑤ \$47\$

### 정답

②

### 해설

\$kx^2-3x-1\$ (\$1\\le k\\le 2000\$)이 정수 계수 두 일차식의 곱으로 인수분해되려면 상수항 곱이 \$-1\$이므로 \$\$ kx^2-3x-1 \= (ax+1)(bx-1) \= abx^2+(b-a)x-1 \$\$ 꼴이어야 한다. (단, \$a, b\$는 자연수) 따라서 \$b-a=-3\$ 또는 \$b-a=3\$이고, 대칭성에 의해 \$a=m, b=m+3\$ (\$m\$은 자연수)로 두면 \$\$ k \= ab \= m(m+3) \\le 2000 \$\$ \$43\\times 46 \= 1978 \\le 2000\$이고 \$44\\times 47 \= 2068 \> 2000\$이므로 가능한 자연수 \$m\$은 \$1, 2, \\cdots, 43\$의 \$43\$개이다.

```
{"status": "EXEMPT", "reason": "정수 계수 인수분해 (ax+1)(bx-1) 조건에서 k=m(m+3)<=2000을 만족하는 자연수 개수를 세는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$kx^2-3x-1=(ax+1)(bx-1)$에서 $b-a=\\pm 3$, $k=m(m+3)\\le 2000$을 세워 만족하는 자연수 $m$을 센다.", "decisiveStep": "상수항 $-1$의 정수 분해가 $\\pm 1$뿐임을 이용해 $k=m(m+3)$ 부등식으로 환원한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "H1-RPM-020 (DIRECT_ACTIVE): 정수 계수 일차식의 곱으로 인수분해되는 조건을 k=m(m+3)&lt;=2000으로 환원해 세는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정수 계수 이차식의 인수분해 가능 조건을 부정방정식 $k=m(m+3)\\le 2000$으로 바꾸어 세는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해되는 것의 개수는"}], "method": [{"term": "자연수", "src": "solution", "quote": "m$은 자연수", "evidenceType": "IMPLIED", "justification": "상수항 -1 분해로 kx^2-3x-1=(ax+1)(bx-1)을 세워 k=m(m+3)&lt;=2000을 풂"}], "given": [{"term": "계수", "src": "stem", "quote": "$x$의 계수와 상수항이 정수"}], "condition": []}, "reasons": {"method": "정수 계수 인수분해 조건을 k=m(m+3)&lt;=2000으로 환원해 43개를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.2

### 발문

복소수 \$z=\\dfrac{1-i}{\\sqrt{2}}\$일 때, \$z^{430}\$의 값은?

### 선지

① \$-i\$ ② \$-1\$ ③ \$\\dfrac{1-i}{\\sqrt{2}}\$ ④ \$i\$ ⑤ \$1\$

### 정답

④

### 해설

\$z^2 \= \\left(\\dfrac{1-i}{\\sqrt{2}}\\right)^2 \= \\dfrac{-2i}{2} \= \-i\$이므로 \$\$ z^{430} \= (z^2)^{215} \= (-i)^{215} \$\$ \$215 \= 4\\times 53+3\$이고 \$(-i)^4=1\$이므로 \$(-i)^{215}=(-i)^3 \= \-i^3 \= i\$이다.

```
{"status": "EXEMPT", "reason": "z^2=-i임을 이용해 z^430을 (-i)^215로 바꾸어 계산하는 순수 복소수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z^2=-i$를 먼저 구한 뒤 $z^{430}=(-i)^{215}$에 주기 $4$를 적용해 $i$를 구한다.", "decisiveStep": "$430=2\\times 215$로 제곱을 먼저 묶어 $-i$로 단순화한 뒤 $(-i)^3=i$의 부호를 정확히 처리한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "H1-RPM-025 (DIRECT_ACTIVE): z^2=-i를 구한 뒤 i의 거듭제곱 주기성으로 z^430을 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "특수 복소수 $\\frac{1-i}{\\sqrt{2}}$의 제곱 성질을 이용해 고차 거듭제곱을 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\dfrac{1-i}{\\sqrt{2}}$"}], "method": [{"term": "허수", "src": "solution", "quote": "z^2 = \\left(\\dfrac{1-i}{\\sqrt{2}}\\right)^2 = \\dfrac{-2i}{2} = -i$", "evidenceType": "IMPLIED", "justification": "z^2=-i를 구한 뒤 (-i)^4=1 주기성을 적용해 430제곱을 계산함"}], "given": [{"term": "지수", "src": "solution", "quote": "215 = 4\\times 53+3"}], "condition": []}, "reasons": {"method": "z^2=-i를 구하고 4주기 성질로 z^430=i를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.1

### 발문

다항식 \$P(x)\$를 \$x-4\$로 나누었을 때의 나머지는 \$7\$이고, \$x+2\$로 나누었을 때의 나머지는 \$-5\$이다. 다항식 \$P(x)\$를 \$(x-4)(x+2)\$로 나누었을 때의 나머지는?

### 선지

① \$2x-1\$ ② \$2x+1\$ ③ \$x+3\$ ④ \$3x-5\$ ⑤ \$2x-3\$

### 정답

①

### 해설

나머지정리에 의하여 \$P(4)=7\$, \$P(-2)=-5\$이다. \$P(x)=(x-4)(x+2)Q(x)+ax+b\$에 \$x=4\$와 \$x=-2\$를 대입하면 \$\$ 4a+b=7, \\qquad \-2a+b=-5 \$\$ 두 식을 빼면 \$6a=12 \\implies a=2, b=-1\$이므로 구하는 나머지는 \$2x-1\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리 두 조건을 연립해 이차식 나눗셈의 일차 나머지 ax+b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리 $P(4)=7, P(-2)=-5$를 일차 나머지 $ax+b$에 대입해 연립방정식을 푼다.", "decisiveStep": "두 식을 빼서 $6a=12 \\implies a=2$를 구한 뒤 $b=-1$을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "H1-RPM-010 (FAMILY_ACTIVE): 두 일차식 나머지 조건 P(4)=7, P(-2)=-5를 결합해 (x-4)(x+2)로 나눈 나머지를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 일차식 나머지를 연립해 곱인 이차식으로 나눈 일차 나머지를 구하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지는"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": []}, "reasons": {"method": "나머지정리 P(4)=7, P(-2)=-5를 연립해 나머지 2x-1을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.5

### 발문

이차방정식 \$x^2-4x-3=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\alpha^2+\\beta^2\$과 \$\\alpha\\beta\$를 두 근으로 하고 \$x^2\$의 계수가 \$1\$인 이차방정식은?

### 선지

① \$x^2-19x+66=0\$ ② \$x^2+19x-66=0\$ ③ \$x^2-19x-66=0\$ ④ \$x^2-13x-66=0\$ ⑤ \$x^2-25x-66=0\$

### 정답

③

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=4\$, \$\\alpha\\beta=-3\$이다. 따라서 \$\$ \\alpha^2+\\beta^2 \= (\\alpha+\\beta)^2-2\\alpha\\beta \= 16-2(-3) \= 22 \$\$ 두 수 \$22\$와 \$-3\$을 근으로 하고 \$x^2\$의 계수가 \$1\$인 이차방정식은 \$\$ x^2-(22-3)x+22\\cdot(-3) \= x^2-19x-66 \= 0 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계로 새 두 근을 구하고 합·곱으로 이차방정식을 작성하는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계로 $\\alpha^2+\\beta^2=22$, $\\alpha\\beta=-3$을 구한 뒤 두 근의 합 $19$와 곱 $-66$으로 이차방정식을 세운다.", "decisiveStep": "새 두 근 $22, -3$의 합과 곱을 각각 일차항(음부호)과 상수항 계수로 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "H1-RPM-030 (DIRECT_BINDING_GAP): 근과 계수의 관계로 새 두 근을 구해 이차방정식을 작성하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 이차방정식의 근으로부터 변형된 두 근을 갖는 새 이차방정식을 작성하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "대칭식", "src": "solution", "quote": "(\\alpha+\\beta)^2-2\\alpha\\beta"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 새 두 근 22, -3을 구해 이차방정식을 작성함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q13

- 형식: 객관식  
- 배점: 4.8

### 발문

함수 \$f(x)=x^2-3x+7\$에 대하여 \$f(\\alpha)=3\$, \$f(\\beta)=3\$일 때, \$\\alpha^3+\\beta^3\$의 값은? (단, \$\\alpha\\ne\\beta\$)

### 선지

① \$-27\$ ② \$-18\$ ③ \$-12\$ ④ \$9\$ ⑤ \$-9\$

### 정답

⑤

### 해설

\$f(x)=3\$에서 \$x^2-3x+7=3 \\iff x^2-3x+4=0\$이다. \$\\alpha\\ne\\beta\$이므로 \$\\alpha, \\beta\$는 이차방정식 \$x^2-3x+4=0\$의 두 근이고, 근과 계수의 관계에 의하여 \$\\alpha+\\beta=3\$, \$\\alpha\\beta=4\$이다. 따라서 \$\$ \\alpha^3+\\beta^3 \= (\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta) \= 3^3-3\\cdot 4\\cdot 3 \= 27-36 \= \-9 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "f(x)=3 방정식의 두 근에 근과 계수의 관계와 세제곱 합 공식을 적용하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$f(x)=3$에서 $x^2-3x+4=0$의 두 근 $\\alpha, \\beta$에 대해 합 $3$, 곱 $4$를 구하고 $\\alpha^3+\\beta^3$을 계산한다.", "decisiveStep": "$\\alpha\\ne\\beta$ 조건으로 $\\alpha, \\beta$가 $x^2-3x+4=0$의 서로 다른 두 근임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "H1-RPM-029 (DIRECT_BINDING_GAP): f(x)=3의 두 근에 근과 계수의 관계와 세제곱 합 공식을 적용하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함숫값 조건 $f(\\alpha)=f(\\beta)=3$을 방정식의 두 근으로 해석해 근과 계수의 관계를 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "(\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta)"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "solution", "quote": "이차방정식 $x^2-3x+4=0$"}], "condition": []}, "reasons": {"method": "f(x)=3의 두 근에 근과 계수의 관계와 세제곱 합 변형을 적용함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$y=x^2+4x-k\$의 그래프가 \$x\$축과 서로 다른 두 점에서 만나고, 그 두 점 사이의 거리가 \$6\$일 때, 실수 \$k\$의 값은?

### 선지

① \$3\$ ② \$5\$ ③ \$4\$ ④ \$6\$ ⑤ \$7\$

### 정답

②

### 해설

\$x^2+4x-k=0\$의 두 실근을 \$\\alpha, \\beta\$라 하면 근과 계수의 관계에 의해 \$\\alpha+\\beta=-4\$, \$\\alpha\\beta=-k\$이다. 두 점 사이의 거리가 \$\|\\alpha-\\beta\|=6\$이므로 양변을 제곱하면 \$\$ (\\alpha-\\beta)^2 \= (\\alpha+\\beta)^2-4\\alpha\\beta \= (-4)^2-4(-k) \= 16+4k \= 36 \$\$ 따라서 \$4k=20 \\implies k=5\$이다.

```
{"status": "EXEMPT", "reason": "x축 두 교점 거리 |α-β|=6과 근과 계수의 관계로 상수 k를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$x^2+4x-k=0$의 두 근 차의 제곱 $(\\alpha+\\beta)^2-4\\alpha\\beta=16+4k=36$을 풀어 $k=5$를 구한다.", "decisiveStep": "두 교점 사이의 거리를 $|\\alpha-\\beta|=6$으로 두고 제곱 공식으로 연결한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "H1-RPM-033 (DIRECT_ACTIVE): 이차함수 그래프와 x축 두 교점의 거리 조건을 근과 계수의 관계로 푸는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$절편 사이 거리 조건을 근과 계수의 관계로 푸는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값은"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+4x-k$"}], "condition": []}, "reasons": {"method": "두 절편 거리 제곱 공식에 근과 계수의 관계를 적용해 k=5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.6

### 발문

이차함수 \$y=x^2-2ax+a^2+6a\$의 그래프가 실수 \$a\$의 값에 관계없이 항상 직선 \$y=2mx+n\$에 접할 때, 실수 \$m\$, \$n\$에 대하여 \$m+n\$의 값은?

### 선지

① \$-9\$ ② \$-3\$ ③ \$-12\$ ④ \$-6\$ ⑤ \$0\$

### 정답

④

### 해설

이차함수와 직선이 접하므로 \$x^2-2ax+a^2+6a=2mx+n\$, 즉 \$\$ x^2-2(a+m)x+(a^2+6a-n)=0 \$\$ 의 판별식 \$D=0\$이다. \$\$ \\frac{D}{4} \= (a+m)^2-(a^2+6a-n) \= (2m-6)a+(m^2+n) \= 0 \$\$ 이 등식이 실수 \$a\$의 값에 관계없이 성립하는 \$a\$에 대한 항등식이므로 \$\$ 2m-6=0, \\qquad m^2+n=0 \$\$ 따라서 \$m=3\$, \$n=-9\$이므로 \$m+n=3+(-9)=-6\$이다.

```
{"status": "EXEMPT", "reason": "접선 판별식 D=0을 a에 대한 항등식으로 정리해 직선의 계수 m, n을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "접선 판별식 $D/4=(2m-6)a+(m^2+n)=0$을 $a$에 대한 항등식으로 풀어 $m=3, n=-9$를 구한다.", "decisiveStep": "판별식에서 $a^2$항이 소거되어 $a$의 일차식 $(2m-6)a+(m^2+n)=0$이 됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "H1-RPM-036 (DIRECT_ACTIVE): 이차함수와 직선의 접선 판별식 D/4=0을 매개변수 a의 항등식으로 푸는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 접선 조건을 매개변수 $a$에 대한 항등식 계수비교로 푸는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $m$, $n$에 대하여"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-2ax+a^2+6a$"}], "condition": [{"term": "항등식", "src": "solution", "quote": "a$에 대한 항등식이므로"}]}, "reasons": {"method": "접선 판별식을 세운 뒤 a 항등식 계수비교로 m, n을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.4

### 발문

\$-3\\le x\\le 2\$일 때, 이차함수 \$y=x^2+4x+k\$의 최댓값이 \$15\$일 때, 이 이차함수의 최솟값은? (단, \$k\$는 상수이다.)

### 선지

① \$-1\$ ② \$-3\$ ③ \$0\$ ④ \$1\$ ⑤ \$3\$

### 정답

①

### 해설

\$y=x^2+4x+k=(x+2)^2+k-4\$이므로 아래로 볼록하고 축이 \$x=-2\$이다. 구간 \$-3\\le x\\le 2\$에서 축 \$x=-2\$로부터 가장 먼 끝점은 \$x=2\$이므로 최댓값은 \$\$ y(2) \= (2+2)^2+k-4 \= 12+k \= 15 \\implies k=3 \$\$ 축 \$x=-2\$가 구간 안에 포함되므로 최솟값은 \$y(-2)=k-4=3-4=-1\$이다.

```
{"status": "EXEMPT", "reason": "제한 범위 이차함수의 최댓값 조건으로 k를 구하고 꼭짓점 최솟값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$y=(x+2)^2+k-4$에서 $[-3, 2]$의 최댓값 $y(2)=12+k=15$로 $k=3$을 구하고 꼭짓점 최솟값 $-1$을 구한다.", "decisiveStep": "축 $x=-2$가 구간 내부에 있으므로 최솟값은 $x=-2$, 최댓값은 먼 끝점 $x=2$에서 나온다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "H1-RPM-037 (DIRECT_ACTIVE): 제한 구간 [-3, 2]에서 이차함수의 최댓값 조건으로 k를 구하고 최솟값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한 범위 이차함수의 최댓값 조건으로 상수를 구하고 최솟값까지 찾는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "이차함수의 최솟값은"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+4x+k$", "evidenceType": "IMPLIED", "justification": "표준형 변환으로 x=2 최댓값에서 k=3을 구하고 꼭짓점 최솟값을 구함"}], "given": [{"term": "최댓값", "src": "stem", "quote": "최댓값이 $15$일 때"}], "condition": []}, "reasons": {"method": "표준형 [-3, 2] 최댓값으로 k=3을 구한 뒤 꼭짓점 최솟값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.3

### 발문

연립방정식 \$\\begin{cases} x+y=-4 \\ x^2+y^2=a+2 \\end{cases}\$의 해가 오직 한 쌍 \$x=b, y=c\$만 가질 때, \$ab-2c\$의 값은? (단, \$a\$는 상수이다.)

### 선지

① \$-16\$ ② \$-12\$ ③ \$-8\$ ④ \$-4\$ ⑤ \$4\$

### 정답

③

### 해설

\$y=-4-x\$를 \$x^2+y^2=a+2\$에 대입하면 \$\$ x^2+(-4-x)^2=a+2 \\implies 2x^2+8x+(14-a)=0 \$\$ 해가 오직 한 쌍뿐이려면 이 이차방정식이 중근을 가져야 한다. \$\$ \\frac{D}{4} \= 4^2-2(14-a) \= 2a-12 \= 0 \\implies a=6 \$\$ 이때 방정식은 \$2(x+2)^2=0\$이므로 \$b=x=-2\$, \$c=y=-4-(-2)=-2\$이다. 따라서 \$ab-2c \= 6(-2)-2(-2) \= \-12+4 \= \-8\$이다.

```
{"status": "EXEMPT", "reason": "일차식 대입 후 얻은 이차방정식이 중근을 가질 조건 D=0으로 유일해와 상수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-SUBSTITUTION_SYSTEM", "conceptClusterKey": null, "primaryMethod": "$y=-4-x$를 대입한 $2x^2+8x+14-a=0$의 중근 조건 $D/4=2a-12=0$으로 $a=6$과 유일해 $(-2, -2)$를 구한다.", "decisiveStep": "연립이차방정식의 해가 오직 한 쌍일 조건을 일변수 이차방정식의 중근 판별식 $D=0$으로 연결한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "연립방정식", "l4": "이차식이 포함된 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_SYSTEM_EQUATION", "templateKey": "TPL_H1_SYSTEM_DIRECT", "why": "H1-RPM-041 (DIRECT_ACTIVE): 일차식을 이차식에 대입한 뒤 중근 판별식 D/4=0으로 유일해를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연립이차방정식의 유일해 조건을 대입과 판별식 $D=0$으로 푸는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식 $\\begin{cases} x+y=-4"}], "method": [{"term": "판별식", "src": "solution", "quote": "\\frac{D}{4} = 4^2-2(14-a) = 2a-12 = 0", "evidenceType": "IMPLIED", "justification": "대입 후 얻은 이차방정식의 중근 조건에 판별식 D/4=0을 적용함"}], "given": [{"term": "중근", "src": "solution", "quote": "중근을 가져야"}], "condition": []}, "reasons": {"method": "y=-4-x 대입 후 이차방정식 중근 판별식 D/4=0으로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 5.1

### 발문

\$x\$에 대한 등식 \$(x^3-x^2-2x)^5=a\_0+a\_1x+a\_2x^2+\\cdots+a\_{15}x^{15}\$이 모든 실수 \$x\$에 대하여 성립할 때, \$a\_3+a\_7+a\_9+a\_{11}+a\_{13}\$의 값은? (단, \$a\_0, a\_1, \\cdots, a\_{15}\$는 상수이다.)

### 선지

① \$-16\$ ② \$-15\$ ③ \$0\$ ④ \$15\$ ⑤ \$16\$

### 정답

④

### 해설

\$(x^3-x^2-2x)^5 \= x^5(x^2-x-2)^5\$이므로 \$4\$차 이하 항의 계수는 \$0\$이고 \$a\_3=0\$, \$a\_5=(-2)^5=-32\$, 최고차항 계수 \$a\_{15}=1\$이다. 항등식의 양변에 \$x=1\$과 \$x=-1\$을 대입하면 \$\$ (1-1-2)^5 \= \-32 \= a\_0+a\_1+\\cdots+a\_{15}, \\qquad (-1-1+2)^5 \= 0 \= a\_0-a\_1+\\cdots-a\_{15} \$\$ 두 식을 빼서 \$2\$로 나누면 \$\$ a\_1+a\_3+a\_5+a\_7+a\_9+a\_{11}+a\_{13}+a\_{15} \= \\frac{-32-0}{2} \= \-16 \$\$ \$a\_1=0, a\_5=-32, a\_{15}=1\$이므로 \$\$ a\_3+a\_7+a\_9+a\_{11}+a\_{13} \= \-16-(-32)-1 \= 15 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "x^5 인수 분리로 저차·최고차 계수를 찾고 x=1, -1 수치대입으로 홀수차 계수 일부의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$x^5(x^2-x-2)^5$에서 $a_1=a_3=0, a_5=-32, a_{15}=1$을 먼저 구하고 $x=\\pm 1$ 수치대입으로 홀수차 계수합 $-16$에서 빼서 구한다.", "decisiveStep": "홀수차 계수합 $-16$에서 직접 읽을 수 있는 $a_5=-32$와 $a_{15}=1$을 제외해 원하는 부분합 $15$를 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "H1-RPM-008 (DIRECT_ACTIVE): x^5 인수로 계수를 파악하고 x=±1 수치대입법으로 홀수차 계수 부분합을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수 $x^5$로 인한 계수 $0$ 조건과 $x=\\pm 1$ 수치대입을 결합해 부분 홀수차 계수합을 구하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "최고차항 계수 $a_{15}=1$"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "양변에 $x=1$과 $x=-1$을 대입하면", "evidenceType": "IMPLIED", "justification": "x=1, -1 수치대입으로 홀수차 계수합을 구한 뒤 a_5와 a_15를 빼서 구함"}], "given": [{"term": "항등식", "src": "solution", "quote": "항등식의 양변에"}], "condition": []}, "reasons": {"method": "x^5 인수로 a_1,a_3,a_5,a_15를 파악하고 x=±1 대입으로 부분합 15를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 5.2

### 발문

현우는 불우 이웃 돕기 성금을 마련하기 위하여 친구들과 함께 샌드위치를 만들어 팔기로 하였다. 한 개당 \$1200\$원의 이익을 남기고 팔면 하루에 \$20\$개를 팔 수 있는데, 한 개당 이익금을 \$100\$원씩 줄일 때마다 하루에 \$5\$개씩 더 팔린다고 한다. 하루의 이익금이 최대일 때, 하루에 팔리는 샌드위치의 개수는?

### 선지

① \$35\$ ② \$40\$ ③ \$45\$ ④ \$50\$ ⑤ \$30\$

### 정답

②

### 해설

이익금을 \$100x\$원 (\$0\\le x\<12\$) 줄였다고 하면 개당 이익은 \$(1200-100x)\$원, 판매량은 \$(20+5x)\$개이다. 하루의 총 이익금 \$P\$는 \$\$ P \= (1200-100x)(20+5x) \= 500(12-x)(4+x) \= \-500(x-4)^2+32000 \$\$ 따라서 \$x=4\$일 때 이익금이 최대이고, 이때 팔리는 샌드위치의 개수는 \$20+5\\cdot 4=40\$개이다.

```
{"status": "EXEMPT", "reason": "가격 할인 횟수를 x로 두고 총 이익금 이차함수의 최댓값에서 판매량을 구하는 순수 활용 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "할인 횟수 $x$로 총 이익금 $P=500(12-x)(4+x)=-500(x-4)^2+32000$을 세워 $x=4$일 때 판매량 $40$개를 구한다.", "decisiveStep": "최대 이익금이 아니라 그때의 판매량 $20+5x$를 묻는 것임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "H1-RPM-038 (DIRECT_ACTIVE): 판매 이익 실생활 활용 문제를 이차함수로 모델링해 최댓값 지점의 판매량을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판매 이익 극대화 실생활 활용 문제에서 이차함수의 꼭짓점을 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "solution", "quote": "x=4$일 때 이익금이 최대"}], "method": [{"term": "이차함수", "src": "solution", "quote": "-500(x-4)^2+32000", "evidenceType": "IMPLIED", "justification": "총 이익금을 할인 횟수 x의 이차함수로 세워 꼭짓점 x=4에서 판매량을 구함"}], "given": [{"term": "완전제곱식", "src": "solution", "quote": "-500(x-4)^2+32000"}], "condition": []}, "reasons": {"method": "할인 횟수 x에 대한 이익금 이차함수 꼭짓점 x=4에서 판매량 40을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 6

### 발문

이차함수 \$y=f(x)\$의 그래프가 \$x\$축과 만나는 점의 \$x\$좌표는 \$-3\$, \$5\$이고 \$y\$축과 만나는 점의 \$y\$좌표는 \$30\$일 때, 이 이차함수의 최댓값을 구하는 풀이 과정과 답을 서술하시오.

### 선지

없음

### 정답

\$32\$

### 해설

\$x\$축과의 교점이 \$(-3, 0), (5, 0)\$이므로 \$f(x)=a(x+3)(x-5)\$ (\$a\\ne 0\$)라 두자. \$y\$축과의 교점이 \$(0, 30)\$이므로 \$f(0)=-15a=30 \\implies a=-2\$이다. 따라서 \$\$ f(x) \= \-2(x+3)(x-5) \= \-2(x^2-2x-15) \= \-2(x-1)^2+32 \$\$ 이므로 이 이차함수의 최댓값은 \$32\$이다.

```
{"status": "EXEMPT", "reason": "x절편과 y절편으로 이차함수를 결정해 최댓값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$x$절편으로 $f(x)=a(x+3)(x-5)$를 세우고 $f(0)=30$으로 $a=-2$를 구한 뒤 표준형 최댓값 $32$를 구한다.", "decisiveStep": "$x$절편 인수 형태 $a(x+3)(x-5)$를 바로 세워 미지수를 $a$ 하나로 줄인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "H1-RPM-037 (DIRECT_ACTIVE): x절편과 y절편으로 이차함수를 결정해 꼭짓점 최댓값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$절편과 $y$절편으로 식을 세워 최댓값을 구하는 서술형 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값을 구하는"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=f(x)$", "evidenceType": "IMPLIED", "justification": "x절편을 인수로 식을 세우고 y절편으로 a를 구해 표준형 최댓값을 계산함"}], "given": [{"term": "교점", "src": "solution", "quote": "x$축과의 교점이 $(-3, 0), (5, 0)$"}], "condition": []}, "reasons": {"method": "x절편으로 식을 세우고 y절편 대입 후 표준형 최댓값 32를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 7

### 발문

복소수 \$z=x^2+(2+i)x-15-3i\$에 대하여 \$z\$가 실수가 되도록 하는 실수 \$x\$의 값을 \$a\$, \$z^2\$이 음의 실수가 되도록 하는 실수 \$x\$의 값을 \$b\$라 할 때, \$a-b\$의 값을 구하는 풀이 과정과 답을 서술하시오.

### 선지

없음

### 정답

\$8\$

### 해설

\$z\$를 실수부분과 허수부분으로 정리하면 \$\$ z \= (x^2+2x-15)+(x-3)i \= (x+5)(x-3)+(x-3)i \$\$

1) \$z\$가 실수이려면 허수부분이 \$0\$이어야 하므로 \$x-3=0 \\implies a=3\$이다.  
2) \$z^2\$이 음의 실수이려면 \$z\$는 순허수이어야 하므로 실수부분이 \$0\$이고 허수부분이 \$0\$이 아니어야 한다. \$(x+5)(x-3)=0\$이고 \$x-3\\ne 0\$이므로 \$b=-5\$이다. 따라서 \$a-b=3-(-5)=8\$이다.

```
{"status": "EXEMPT", "reason": "복소수의 실수 조건과 z^2<0(순허수) 조건을 만족하는 x를 각각 구해 a-b를 계산하는 순수 복소수 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=(x+5)(x-3)+(x-3)i$로 정리해 실수 조건($\\operatorname{Im}(z)=0$)에서 $a=3$, 순허수 조건($z^2&lt;0$)에서 $b=-5$를 구한다.", "decisiveStep": "$z^2$이 음의 실수일 때 허수부분 $x-3\\ne 0$ 조건으로 $x=3$을 제외하고 $b=-5$만 취한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "H1-RPM-026 (DIRECT_ACTIVE): 복소수의 실수 조건과 z^2<0(순허수 조건)을 만족하는 실수 x를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수가 실수·순허수가 될 조건에서 $z=0$ 경계값을 구분하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $x$의 값을 $a$"}], "method": [{"term": "순허수", "src": "solution", "quote": "z$는 순허수이어야", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=x^2+(2+i)x-15-3i$"}], "condition": []}, "reasons": {"method": "실수부·허수부 분리 후 실수 조건 a=3과 순허수 조건 b=-5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

\$x\$에 대한 방정식 \$x^3-27=m(x-3)\$이 중근을 갖도록 하는 모든 실수 \$m\$의 값의 합을 구하는 풀이 과정과 답을 서술하시오.

### 선지

없음

### 정답

\$\\dfrac{135}{4}\$

### 해설

좌변을 인수분해해 이항하면 \$\$ (x-3)(x^2+3x+9-m) \= 0 \$\$ 이므로 \$x=3\$ 또는 \$x^2+3x+9-m=0\$이다. 삼차방정식이 중근을 가지는 경우는 다음 두 가지이다.

1) \$x^2+3x+9-m=0\$이 \$x=3\$을 근으로 가질 때: \$3^2+3\\cdot 3+9-m \= 27-m \= 0 \\implies m=27\$ (이때 \$x^2+3x-18=(x-3)(x+6)=0\$이므로 \$x=3\$이 중근이다.)  
2) \$x^2+3x+9-m=0\$ 자체가 중근을 가질 때: 판별식 \$D \= 3^2-4(9-m) \= 4m-27 \= 0 \\implies m=\\dfrac{27}{4}\$ 따라서 모든 실수 \$m\$의 값의 합은 \$27+\\dfrac{27}{4}=\\dfrac{135}{4}\$이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 (x-3)(x^2+3x+9-m)=0의 중근 조건을 x=3 공유와 이차식 D=0 두 경우로 나누어 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$(x-3)(x^2+3x+9-m)=0$으로 인수분해한 뒤 $x=3$을 근으로 갖는 경우($m=27$)와 이차식이 중근을 갖는 경우($D=0, m=\\frac{27}{4}$)를 합한다.", "decisiveStep": "삼차방정식 $(x-3)g(x)=0$의 중근은 $g(3)=0$과 $g(x)=0$의 판별식 $D=0$ 두 갈래임을 빠뜨리지 않는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "H1-RPM-043 (RPM_ONLY): 삼차방정식의 중근 조건을 다루는 문항으로 현재 ACTIVE 대응 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수분해된 삼차방정식의 중근 조건을 두 경우로 분기하여 빠짐없이 구하는 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "중근", "src": "stem", "quote": "중근을 갖도록 하는"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D = 3^2-4(9-m)$", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "solution", "quote": "삼차방정식이 중근을"}], "condition": []}, "reasons": {"method": "인수분해 후 x=3 대입 경우와 이차식 판별식 D=0 경우의 m을 모두 합산함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

