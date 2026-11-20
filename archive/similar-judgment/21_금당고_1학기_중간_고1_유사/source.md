

```
{"stem": "21_금당고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/21_금당고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.6

### 발문

두 다항식 \$A\$, \$B\$가 \$A=3x^2-2xy+4y^2\$, \$B=x^2-5xy+2y^2\$일 때, \$4A-3A-2B\$의 값은?

### 선지

① \$x^2-8xy\$ ② \$x^2+8xy\$ ③ \$x^2+8xy+8y^2\$ ④ \$2x^2+8xy\$ ⑤ \$x^2-12xy\$

### 정답

②

### 해설

식을 간단히 하면 \$4A-3A-2B=A-2B\$이므로 \$\$ \\begin{aligned} A-2B &= (3x^2-2xy+4y^2)-2(x^2-5xy+2y^2) \\ &= (3-2)x^2+(-2+10)xy+(4-4)y^2 \\ &= x^2+8xy \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "다항식의 일차 결합을 간단히 하여 동류항을 계산하는 순수 연산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$4A-3A-2B=A-2B$로 먼저 줄인 뒤 $A, B$를 대입해 동류항 계수를 합산한다.", "decisiveStep": "$4A-3A$를 먼저 계산해 $A-2B$로 만들고 $y^2$항이 $4-4=0$으로 소거됨을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 동류항 정리로 다항식 A-2B를 직접 덧셈·뺄셈하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 덧셈과 뺄셈을 동류항 정리로 바로 수행하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A$, $B$"}], "method": [{"term": "동류항", "src": "solution", "quote": "A-2B$이므로", "evidenceType": "IMPLIED", "justification": "A-2B로 정리한 뒤 x^2, xy, y^2 동류항끼리 계수를 계산함"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A$, $B$"}], "condition": []}, "reasons": {"method": "A-2B로 식을 정리 후 동류항 연산을 수행함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.6

### 발문

등식 \$a(x-1)+b(x-3)=3x-5\$가 \$x\$에 대한 항등식일 때, 상수 \$a+b\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$4\$ ④ \$3\$ ⑤ \$5\$

### 정답

④

### 해설

좌변을 \$x\$에 대하여 내림차순 정리하면 \$\$ (a+b)x-(a+3b) \= 3x-5 \$\$ \$x\$에 대한 항등식이므로 계수비교법에 의하여 \$a+b=3\$이다.

```
{"status": "EXEMPT", "reason": "x에 대한 일차 항등식에서 계수비교법으로 a+b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "좌변을 $(a+b)x-(a+3b)$로 정리하고 우변의 $x$ 계수와 비교해 $a+b=3$을 구한다.", "decisiveStep": "$a, b$를 따로 구하지 않고도 $x$의 계수 비교만으로 $a+b=3$이 즉시 결정된다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): x에 대한 항등식을 내림차순 정리 후 계수비교법으로 a+b를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차 항등식에서 계수비교법을 한 번 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a+b$의 값은"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수비교법에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "stem", "quote": "$x$에 대한 항등식"}], "condition": []}, "reasons": {"method": "x에 대해 정리 후 계수비교법으로 a+b=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.6

### 발문

다항식 \$x^3+ax^2+bx-4\$를 \$x+1\$로 나누었을 때의 나머지가 \$-2\$이고, \$x-1\$로 나누었을 때의 나머지가 \$4\$일 때, 상수 \$a\$, \$b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$7\$ ② \$5\$ ③ \$3\$ ④ \$6\$ ⑤ \$8\$

### 정답

①

### 해설

\$P(x)=x^3+ax^2+bx-4\$라 하면 나머지정리에 의하여 \$P(1)=4\$이므로 \$\$ 1+a+b-4 \= 4 \\implies a+b \= 7 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "나머지정리 P(1)=4를 적용해 a+b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리에 따라 $x-1$로 나눈 나머지 조건 $P(1)=4$에 $x=1$을 대입해 $a+b=7$을 구한다.", "decisiveStep": "$P(1)=1+a+b-4=4$에서 구하는 값 $a+b$가 바로 얻어진다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009(RPM_ONLY): 일차식으로 나눈 나머지정리(P(1)=4) 문항으로 현재 ACTIVE 대응 키 미구비"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리를 직접 적용해 미정계수의 합을 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$에 대하여"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^3+ax^2+bx-4$"}], "condition": []}, "reasons": {"method": "나머지정리 P(1)=4를 이용해 a+b=7을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q04

- 형식: 객관식  
- 배점: 3.6

### 발문

복소수 \$\\dfrac{a+3i}{1+i}\$의 허수부분이 \$0\$이 되도록 하는 실수 \$a\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-3\$ ② \$1\$ ③ \$3\$ ④ \$2\$ ⑤ \$-1\$

### 정답

③

### 해설

분모를 실수화하면 \$\$ \\frac{a+3i}{1+i} \= \\frac{(a+3i)(1-i)}{(1+i)(1-i)} \= \\frac{(a+3)+(3-a)i}{2} \$\$ 허수부분이 \$0\$이므로 \$\\dfrac{3-a}{2}=0 \\implies a=3\$이다.

```
{"status": "EXEMPT", "reason": "복소수 분수식을 실수화하여 허수부분이 0이 되는 실수 a를 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "분모에 켤레복소수 $1-i$를 곱해 실수화한 뒤 허수부분 $\\frac{3-a}{2}=0$을 푼다.", "decisiveStep": "실수화 후 분자의 허수 계수 $3-a=0$을 놓는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-021(DIRECT_ACTIVE): 복소수 분수식을 실수화하여 허수부분이 0이 되는 실수 a를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 나눗셈의 실수화와 허수부분 조건을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$의 값은"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모를 실수화하면", "evidenceType": "IMPLIED", "justification": "분모의 켤레복소수 1-i를 곱해 실수화한 뒤 허수부분을 0으로 둠"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $\\dfrac{a+3i}{1+i}$"}], "condition": []}, "reasons": {"method": "분모 실수화 후 허수부분이 0이 되는 a=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.6

### 발문

이차방정식 \$4x^2-2kx+9=0\$이 중근을 가질 때, 양수 \$k\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

중근을 가지므로 판별식 \$D=0\$이다. \$\$ \\frac{D}{4} \= (-k)^2-4\\cdot 9 \= k^2-36 \= 0 \\implies k \= \\pm 6 \$\$ \$k\>0\$이므로 \$k=6\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 중근 조건 판별식 D=0으로 양수 k를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "이차방정식 $4x^2-2kx+9=0$의 짝수 판별식 $D/4=k^2-36=0$을 풀어 양수 $k=6$을 구한다.", "decisiveStep": "중근 조건 $D/4=0$과 양수 조건 $k>0$을 함께 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식의 중근 조건 판별식 D/4=0을 적용하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 중근 판별식 공식을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "양수", "src": "stem", "quote": "양수 $k$의 값은"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $4x^2-2kx+9=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 가질 때"}]}, "reasons": {"method": "중근 판별식 D/4=0을 풀어 양수 k=6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.6

### 발문

이차함수 \$y=-x^2+6x+2\$가 \$x=a\$일 때 최댓값 \$b\$를 가질 때, \$a+b\$의 값은?

### 선지

① \$12\$ ② \$14\$ ③ \$11\$ ④ \$13\$ ⑤ \$15\$

### 정답

②

### 해설

\$y=-x^2+6x+2 \= \-(x-3)^2+11\$이므로 \$x=3\$일 때 최댓값 \$11\$을 갖는다. 따라서 \$a=3, b=11\$이므로 \$a+b=14\$이다.

```
{"status": "EXEMPT", "reason": "위로 볼록한 이차함수를 표준형으로 변형해 최댓값과 꼭짓점 x좌표를 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "표준형 $y=-(x-3)^2+11$로 고쳐 최댓값을 갖는 $a=3$과 최댓값 $b=11$을 구한다.", "decisiveStep": "완전제곱식 변형으로 꼭짓점 $(3, 11)$을 바로 읽는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 이차함수를 표준형으로 변형하여 꼭짓점에서 최댓값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "전체 실수에서 이차함수의 최댓값을 표준형으로 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값 $b$를 가질 때"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2+6x+2$", "evidenceType": "IMPLIED", "justification": "이차함수를 표준형 -(x-3)^2+11로 변형해 꼭짓점에서 최댓값을 읽음"}], "given": [{"term": "완전제곱식", "src": "solution", "quote": "-(x-3)^2+11"}], "condition": []}, "reasons": {"method": "표준형 -(x-3)^2+11로 변형해 a=3, b=11을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.6

### 발문

\$x\$에 대한 삼차방정식 \$ax^3+x^2+2x-5=0\$의 한 근이 \$1\$일 때, 나머지 두 근의 합은? (단, \$a\$는 상수이다.)

### 선지

① \$-\\dfrac{1}{2}\$ ② \$-1\$ ③ \$-\\dfrac{5}{2}\$ ④ \$-\\dfrac{3}{2}\$ ⑤ \$-2\$

### 정답

④

### 해설

한 근이 \$x=1\$이므로 대입하면 \$\$ a+1+2-5 \= 0 \\implies a \= 2 \$\$ 삼차방정식 \$2x^3+x^2+2x-5=0\$의 세 근을 \$1, \\alpha, \\beta\$라 하면 근과 계수의 관계에 의하여 \$\$ 1+\\alpha+\\beta \= \-\\frac{1}{2} \\implies \\alpha+\\beta \= \-\\frac{3}{2} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차방정식에 근 x=1을 대입해 계수 a를 구하고 근과 계수의 관계로 나머지 두 근의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$x=1$을 대입해 $a=2$를 구한 뒤 삼차방정식의 세 근의 합 $-\\frac{1}{2}$에서 $1$을 빼 나머지 두 근의 합을 구한다.", "decisiveStep": "삼차방정식을 직접 인수분해하지 않고 세 근의 합 $1+\\alpha+\\beta=-1/2$을 이용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY): 삼차방정식의 한 근 대입 및 근과 계수의 관계 문항으로 현재 ACTIVE 대응 키 미구비"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근 대입으로 미정계수를 구한 뒤 삼차방정식 근과 계수의 관계를 적용하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $ax^3+x^2+2x-5=0$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "상수", "src": "stem", "quote": "$a$는 상수이다"}], "condition": []}, "reasons": {"method": "x=1 대입으로 a=2를 구하고 세 근의 합 공식으로 나머지 두 근의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q08

- 형식: 객관식  
- 배점: 3.8

### 발문

계수가 모두 실수인 이차방정식 \$x^2+bx+c=0\$의 한 허근이 \$3-3i\$이다. 이때 \$\\sqrt{\\dfrac{c}{b}}\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$\\sqrt{3}i\$ ② \$-\\sqrt{3}i\$ ③ \$\\sqrt{3}\$ ④ \$3i\$ ⑤ \$-3i\$

### 정답

①

### 해설

계수가 모두 실수이므로 한 허근이 \$3-3i\$이면 다른 한 근은 \$3+3i\$이다. 근과 계수의 관계에 의하여 \$\$ b \= \-{(3-3i)+(3+3i)} \= \-6, \\qquad c \= (3-3i)(3+3i) \= 9+9 \= 18 \$\$ 따라서 \$\\sqrt{\\dfrac{c}{b}} \= \\sqrt{\\dfrac{18}{-6}} \= \\sqrt{-3} \= \\sqrt{3}i\$이다.

```
{"status": "EXEMPT", "reason": "실계수 이차방정식의 켤레근과 근과 계수의 관계로 b, c를 구해 음수의 제곱근을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "실계수 이차방정식의 켤레근 $3+3i$와 근과 계수의 관계로 $b=-6, c=18$을 구한 뒤 $\\sqrt{-3}=\\sqrt{3}i$를 계산한다.", "decisiveStep": "$\\frac{c}{b}=-3<0$이므로 음수의 제곱근 $\\sqrt{-3}=\\sqrt{3}i$로 정확히 변환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json H1-RPM-031(DIRECT_BINDING_GAP): 실계수 이차방정식의 켤레 허근 성질과 근과 계수의 관계를 적용하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레근 성질, 근과 계수의 관계, 음수의 제곱근 계산을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "제곱근", "src": "stem", "quote": "\\sqrt{\\dfrac{c}{b}}$의 값은"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "허근", "src": "stem", "quote": "한 허근이 $3-3i$"}], "condition": [{"term": "켤레복소수", "src": "solution", "quote": "다른 한 근은 $3+3i$"}]}, "reasons": {"method": "켤레근과 근과 계수의 관계로 b, c를 구한 뒤 음수의 제곱근을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q09

- 형식: 객관식  
- 배점: 3.8

### 발문

\$3x^2+7xy+2y^2+4x+3y+1\$을 \$(x+ay+1)(3x+by+1)\$로 인수분해할 때, 상수 \$a\$, \$b\$에 대하여 \$2a+b\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

③

### 해설

\$(x+ay+1)(3x+by+1)\$을 전개하여 계수를 비교하면

- \$xy\$항의 계수: \$3a+b=7\$  
- \$y\$항의 계수: \$a+b=3\$ 두 식을 빼면 \$2a=4 \\implies a=2\$, \$b=1\$이다. (이때 \$y^2\$항 계수는 \$ab=2\$로 일치한다.) 따라서 \$2a+b=2(2)+1=5\$이다.

```
{"status": "EXEMPT", "reason": "이변수 이차식의 인수분해 계수를 전개 후 계수비교해 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$(x+ay+1)(3x+by+1)$의 $xy$항과 $y$항 계수를 원식과 비교해 $3a+b=7, a+b=3$을 연립한다.", "decisiveStep": "$xy$ 계수 $3a+b=7$과 $y$ 계수 $a+b=3$으로 $a, b$를 일차 연립방정식으로 푼다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "이차식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-017(DIRECT_ACTIVE): 두 문자 이차식을 일차식의 곱으로 인수분해하여 계수를 비교하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 문자 이차식의 인수분해를 계수비교 연립방정식으로 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$에 대하여"}], "method": [{"term": "계수비교", "src": "solution", "quote": "전개하여 계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "인수분해", "src": "stem", "quote": "인수분해할 때"}], "condition": []}, "reasons": {"method": "인수분해 꼴을 전개해 xy와 y 계수를 비교하여 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$f(x)=x^2+(2k-a)x+(k^2-4k+b)\$의 그래프가 실수 \$k\$의 값과 관계없이 항상 \$x\$축에 접할 때, 실수 \$a+4b\$의 값은?

### 선지

① \$12\$ ② \$14\$ ③ \$16\$ ④ \$18\$ ⑤ \$20\$

### 정답

⑤

### 해설

\$x\$축에 접하므로 \$x\$에 대한 이차방정식 \$f(x)=0\$의 판별식 \$D=0\$이다. \$\$ D \= (2k-a)^2-4(k^2-4k+b) \= (16-4a)k+(a^2-4b) \= 0 \$\$ 이 등식이 실수 \$k\$의 값에 관계없이 성립하는 \$k\$에 대한 항등식이므로 \$\$ 16-4a=0, \\qquad a^2-4b=0 \$\$ 따라서 \$a=4\$, \$b=\\dfrac{16}{4}=4\$이므로 \$a+4b \= 4+16 \= 20\$이다.

```
{"status": "EXEMPT", "reason": "x축 접선 판별식 D=0을 k에 대한 항등식으로 정리해 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "판별식 $D=(2k-a)^2-4(k^2-4k+b)=0$을 $k$에 대해 정리한 뒤 $k$ 항등식 계수비교로 $a=4, b=4$를 구한다.", "decisiveStep": "$4k^2$이 소거된 $k$의 일차식 $(16-4a)k+(a^2-4b)=0$에 항등식 조건을 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): 이차함수의 x축 접선 판별식 D=0과 매개변수 k 항등식 조건을 결합한 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$축 접선 판별식과 매개변수 $k$에 대한 항등식을 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a+4b$의 값은"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2+(2k-a)x+(k^2-4k+b)$"}], "condition": [{"term": "항등식", "src": "solution", "quote": "k$에 대한 항등식이므로"}]}, "reasons": {"method": "x축 접선 판별식 D=0을 세우고 k 항등식 계수비교로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

두 이차다항식 \$P(x), Q(x)\$가 다음 조건을 만족시킨다. (가) 모든 실수 \$x\$에 대하여 \$P(x)+2Q(x)=0\$이다. (나) \$P(x)Q(x)\$는 \$x^2-3x-4\$로 나누어떨어진다. \$Q(0)=8\$일 때, \$P(5)\$의 값은?

### 선지

① \$12\$ ② \$24\$ ③ \$36\$ ④ \$-24\$ ⑤ \$48\$

### 정답

②

### 해설

조건 (가)에서 \$P(x)=-2Q(x)\$이므로 \$P(x)Q(x)=-2{Q(x)}^2\$이다. 조건 (나)에서 \$-2{Q(x)}^2\$이 \$x^2-3x-4=(x-4)(x+1)\$로 나누어떨어지므로 \$Q(4)=Q(-1)=0\$이다. \$Q(x)\$는 이차다항식이므로 \$Q(x)=c(x-4)(x+1)\$이라 놓자. \$Q(0)=-4c=8\$에서 \$c=-2\$이므로 \$Q(x)=-2(x-4)(x+1)\$이고 \$P(x)=-2Q(x)=4(x-4)(x+1)\$이다. 따라서 \$P(5)=4(5-4)(5+1)=24\$이다.

```
{"status": "EXEMPT", "reason": "항등식 P(x)=-2Q(x)를 대입해 제곱식 나눗셈 인수정리로 이차다항식 P(x)를 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$P(x)=-2Q(x)$를 (나)에 대입해 $-2\\{Q(x)\\}^2$이 $(x-4)(x+1)$로 나누어떨어짐을 보이고 $Q(x)=c(x-4)(x+1)$을 결정한다.", "decisiveStep": "$\\{Q(x)\\}^2$이 $(x-4)(x+1)$의 배수이면 $Q(4)=Q(-1)=0$이 됨을 인수정리로 도출한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012(RPM_ONLY): 인수정리로 이차다항식의 미정계수를 결정하는 문항으로 현재 ACTIVE 대응 키 미구비"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 항등식 소거와 제곱식 나눗셈의 인수정리를 결합해 이차식을 확정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 이차다항식 $P(x), Q(x)$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "$Q(4)=Q(-1)=0$이다", "evidenceType": "IMPLIED", "justification": "-2{Q(x)}^2이 (x-4)(x+1)로 나누어떨어지므로 Q(4)=Q(-1)=0임을 도출함"}], "given": [{"term": "항등식", "src": "stem", "quote": "모든 실수 $x$에 대하여 $P(x)+2Q(x)=0$"}], "condition": []}, "reasons": {"method": "P=-2Q 대입 후 인수정리로 Q(x)=c(x-4)(x+1)을 결정해 P(5)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

길이가 \$240\\text{m}\$인 철망을 사용하여 그림과 같이 \$2\$개의 직사각형 모양의 꽃밭을 나란히 만들려고 한다. 꽃밭의 전체 넓이의 최댓값은? (단, 철망의 두께는 생각하지 않는다.)

### 선지

① \$2000\$ ② \$2100\$ ③ \$2250\$ ④ \$2400\$ ⑤ \$2700\$

### 정답

④

### 해설

그림은 두 직사각형을 나란히 두고 가운데 세로 철망을 함께 사용하는 구조이다. 전체 가로 길이를 \$w\\text{m}\$, 세로 길이를 \$h\\text{m}\$ (\$w\>0, h\>0\$)라 하면 철망의 총 길이는 \$\$ 2w+3h \= 240 \\implies w \= \\frac{240-3h}{2} \$\$ 꽃밭 전체의 넓이 \$S\$는 \$\$ S \= wh \= \\frac{h(240-3h)}{2} \= \-\\frac{3}{2}h^2+120h \= \-\\frac{3}{2}(h-40)^2+2400 \$\$ \$h=40\$일 때 \$w=60\>0\$이므로 전체 넓이의 최댓값은 \$2400\$이다.

```
{"capability": "construction-spike-v1", "mode": "PLANE_FIGURE_v1", "caption": "가운데 세로 칸막이를 공유하여 나란히 붙은 2개의 직사각형 꽃밭 (가로 w, 세로 h)", "mathPlan": {"nodes": [{"id": "A", "kind": "SOURCE_POINT", "x": 0, "y": 2, "label": "A"}, {"id": "B", "kind": "SOURCE_POINT", "x": 0, "y": 0, "label": "B"}, {"id": "C", "kind": "SOURCE_POINT", "x": 2, "y": 0, "label": "C"}, {"id": "D", "kind": "SOURCE_POINT", "x": 4, "y": 0, "label": "D"}, {"id": "E", "kind": "SOURCE_POINT", "x": 4, "y": 2, "label": "E"}, {"id": "F", "kind": "SOURCE_POINT", "x": 2, "y": 2, "label": "F"}], "segments": [{"from": "A", "to": "B"}, {"from": "B", "to": "D"}, {"from": "D", "to": "E"}, {"from": "E", "to": "A"}, {"from": "F", "to": "C"}]}}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "칸막이를 포함한 철망 길이 $2w+3h=240$을 세워 넓이 $S=wh=-\\frac{3}{2}(h-40)^2+2400$의 최댓값을 구한다.", "decisiveStep": "가운데 공유 세로 철망을 포함해 세로가 $3$개, 가로가 $2$개임을 그림에서 정확히 센다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 직사각형 철망 길이 조건식을 세워 이차함수 넓이의 최댓값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 철망 활용에서 칸막이 포함 둘레 식 $2w+3h=240$을 세워 이차함수 최댓값을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "전체 넓이의 최댓값은"}], "method": [{"term": "이차함수", "src": "solution", "quote": "-\\frac{3}{2}(h-40)^2+2400", "evidenceType": "IMPLIED", "justification": "철망 길이 2w+3h=240을 대입해 넓이를 h의 이차함수로 나타내 최댓값을 구함"}], "given": [{"term": "직사각형", "src": "stem", "quote": "$2$개의 직사각형"}], "condition": []}, "reasons": {"method": "2w+3h=240 조건을 넓이 식에 대입해 이차함수 최댓값 2400을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.2

### 발문

방정식 \$x^3=1\$의 한 허근을 \$\\omega\$라 할 때, \$\\dfrac{1}{\\omega^3+3\\omega^2+4\\omega+3}=a\\omega+b\$를 만족하는 두 실수 \$a\$, \$b\$에 대하여 \$a-b\$의 값은?

### 선지

① \$-1\$ ② \$-2\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

①

### 해설

\$\\omega^3=1\$이고 \$\\omega^2+\\omega+1=0\$이므로 \$\\omega^2=-\\omega-1\$이다. 분모를 정리하면 \$\$ \\omega^3+3\\omega^2+4\\omega+3 \= 1+3(-\\omega-1)+4\\omega+3 \= \\omega+1 \= \-\\omega^2 \$\$ 따라서 \$\$ \\frac{1}{\\omega^3+3\\omega^2+4\\omega+3} \= \\frac{1}{-\\omega^2} \= \-\\frac{\\omega^3}{\\omega^2} \= \-\\omega \$\$ \$\\omega\$는 허수이므로 계수를 비교하면 \$a=-1\$, \$b=0\$이고, 따라서 \$a-b=-1\$이다.

```
{"status": "EXEMPT", "reason": "x^3=1의 허근 ω 성질로 분모를 단항식 -ω^2으로 줄이고 역수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$\\omega^3=1, \\omega^2+\\omega+1=0$으로 분모를 $-\\omega^2$으로 줄인 뒤 $\\frac{1}{-\\omega^2}=-\\omega$로 바꾸어 $a, b$를 구한다.", "decisiveStep": "분모 $\\omega+1$을 $-\\omega^2$으로 바꾸고 $\\omega^3=1$을 이용해 분모를 없앤다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY): 방정식 x^3=1의 허근 ω 성질 활용 문항으로 현재 ACTIVE 대응 키 미구비"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식 허근 $\\omega$의 차수 축소와 역수 변형을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "두 실수 $a$, $b$에 대하여"}], "method": [{"term": "허근", "src": "stem", "quote": "한 허근을 $\\omega$라 할 때", "evidenceType": "IMPLIED", "justification": "ω^3=1, ω^2+ω+1=0 성질을 이용해 분모를 단항식으로 줄이고 역수를 구함"}], "given": [{"term": "허수", "src": "solution", "quote": "\\omega$는 허수이므로"}], "condition": []}, "reasons": {"method": "ω^3=1, ω^2+ω+1=0으로 분모를 단항식으로 줄여 a=-1, b=0을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q14

- 형식: 객관식  
- 배점: 4.2

### 발문

이차방정식 \$x^2-4x+7=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, \$\\dfrac{\\alpha-3}{2\\alpha^2-5\\alpha+2}\$, \$\\dfrac{\\beta-3}{2\\beta^2-5\\beta+2}\$를 두 근으로 하는 이차방정식 \$ax^2+bx+1=0\$의 계수인 실수 \$a\$, \$b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$\\dfrac{43}{4}\$ ② \$\\dfrac{49}{4}\$ ③ \$\\dfrac{53}{4}\$ ④ \$\\dfrac{57}{4}\$ ⑤ \$13\$

### 정답

③

### 해설

\$\\alpha, \\beta\$가 \$x^2-4x+7=0\$의 근이므로 \$\\alpha^2=4\\alpha-7\$, \$\\beta^2=4\\beta-7\$이고 \$\\alpha+\\beta=4\$, \$\\alpha\\beta=7\$이다. 분모를 일차식으로 낮추면 \$\$ 2\\alpha^2-5\\alpha+2 \= 2(4\\alpha-7)-5\\alpha+2 \= 3(\\alpha-4), \\qquad 2\\beta^2-5\\beta+2 \= 3(\\beta-4) \$\$ 두 근을 \$u=\\dfrac{\\alpha-3}{3(\\alpha-4)}\$, \$v=\\dfrac{\\beta-3}{3(\\beta-4)}\$라 하면 \$\$ (\\alpha-4)(\\beta-4) \= \\alpha\\beta-4(\\alpha+\\beta)+16 \= 7-16+16 \= 7 \$\$ \$\$ (\\alpha-3)(\\beta-3) \= \\alpha\\beta-3(\\alpha+\\beta)+9 \= 7-12+9 \= 4 \$\$ 따라서 두 근의 합과 곱은 \$\$ \\begin{aligned} u+v &= \\frac{(\\alpha-3)(\\beta-4)+(\\beta-3)(\\alpha-4)}{9(\\alpha-4)(\\beta-4)} \= \\frac{2\\alpha\\beta-7(\\alpha+\\beta)+24}{63} \= \\frac{14-28+24}{63} \= \\frac{10}{63} \\ uv &= \\frac{(\\alpha-3)(\\beta-3)}{9(\\alpha-4)(\\beta-4)} \= \\frac{4}{63} \\end{aligned} \$\$ \$ax^2+bx+1=0\$의 두 근이 \$u, v\$이므로 근과 계수의 관계에서 \$\$ \\frac{1}{a} \= \\frac{4}{63} \\implies a \= \\frac{63}{4}, \\qquad \-\\frac{b}{a} \= \\frac{10}{63} \\implies b \= \-\\frac{10}{63}\\cdot\\frac{63}{4} \= \-\\frac{5}{2} \$\$ 그러므로 \$a+b \= \\dfrac{63}{4}-\\dfrac{10}{4} \= \\dfrac{53}{4}\$이다.

```
{"status": "EXEMPT", "reason": "근의 대입으로 분모 차수를 낮춘 뒤 새로운 두 근의 합과 곱으로 이차방정식 계수 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha^2=4\\alpha-7$로 분모를 $3(\\alpha-4)$로 낮추고, 두 분수 근의 합 $u+v$와 곱 $uv$를 근과 계수의 관계로 구해 $a, b$를 역산한다.", "decisiveStep": "분모 차수를 낮춘 뒤 $uv=\\frac{1}{a}$, $u+v=-\\frac{b}{a}$로 상수항이 $1$인 이차방정식의 계수를 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 근과 계수의 관계와 차수 축소로 변형된 두 근의 이차방정식을 구성하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "차수 낮추기와 새 이차방정식 작성(근과 계수의 관계)을 결합한 중상 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "계수인 실수 $a$, $b$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에서", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-4x+7=0$"}], "condition": []}, "reasons": {"method": "근 대입으로 분모 일차화 후 두 근의 합·곱으로 새 방정식 계수 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q15

- 형식: 객관식  
- 배점: 4.3

### 발문

다항식 \$f(x)\$를 \$x^2-x+1\$로 나누었을 때의 나머지가 \$2x+7\$이고, \$x+1\$로 나누었을 때의 나머지가 \$8\$일 때, \$f(x)\$를 \$x^3+1\$로 나누었을 때의 나머지를 \$R(x)\$라 하면 \$R(2)\$의 값은?

### 선지

① \$8\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$14\$

### 정답

⑤

### 해설

\$x^3+1=(x+1)(x^2-x+1)\$이므로 \$f(x)\$를 \$x^3+1\$로 나눈 나머지 \$R(x)\$는 이차 이하의 다항식이고 \$x^2-x+1\$로 나눈 나머지가 \$2x+7\$이어야 한다. 따라서 \$R(x)=a(x^2-x+1)+2x+7\$이라 놓을 수 있다. 조건에서 \$f(-1)=R(-1)=8\$이므로 \$\$ a(1+1+1)+2(-1)+7 \= 3a+5 \= 8 \\implies a \= 1 \$\$ 그러므로 \$R(x)=(x^2-x+1)+2x+7 \= x^2+x+8\$이고, \$R(2)=4+2+8=14\$이다.

```
{"status": "EXEMPT", "reason": "삼차식 x^3+1 나눗셈 나머지를 a(x^2-x+1)+2x+7로 두고 f(-1)=8로 a를 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x^3+1=(x+1)(x^2-x+1)$임을 이용해 $R(x)=a(x^2-x+1)+2x+7$로 두고 $f(-1)=8$을 대입해 $a=1$을 구한다.", "decisiveStep": "삼차식 나눗셈의 이차 나머지를 이차 인수 $x^2-x+1$에 대한 나눗셈 꼴로 표현한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 합성 제수 x^3+1=(x+1)(x^2-x+1)의 나머지 조건을 결합하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차식으로 나눈 나머지를 이차식 나눗셈 조건으로 축약해 푸는 대표 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 하면"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "f(-1)=R(-1)=8", "evidenceType": "IMPLIED", "justification": "R(x)=a(x^2-x+1)+2x+7로 설정하고 나머지정리 f(-1)=8을 대입해 a를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "R(x)=a(x^2-x+1)+2x+7 설정 후 f(-1)=8 대입으로 R(2)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.3

### 발문

삼차방정식 \$x^3-4x^2-(m-3)x+m-3=0\$의 세 근 \$\\alpha\$, \$\\beta\$, \$\\gamma\$가 모두 정수일 때, \$\\alpha^2+\\beta^2+\\gamma^2-m\$의 값은?

### 선지

① \$11\$ ② \$13\$ ③ \$15\$ ④ \$17\$ ⑤ \$19\$

### 정답

②

### 해설

좌변을 \$f(x)=x^3-4x^2-(m-3)x+m-3\$이라 하면 \$f(x)=(x-\\alpha)(x-\\beta)(x-\\gamma)\$이다. \$x=1\$을 대입하면 \$m\$이 소거되어 \$\$ (1-\\alpha)(1-\\beta)(1-\\gamma) \= f(1) \= 1-4-(m-3)+m-3 \= \-3 \$\$ 세 근 \$\\alpha, \\beta, \\gamma\$가 모두 정수이므로 \$1-\\alpha, 1-\\beta, 1-\\gamma\$는 곱이 \$-3\$인 세 정수이다. 한편 근과 계수의 관계에서 \$\\alpha+\\beta+\\gamma=4\$이므로 \$\$ (1-\\alpha)+(1-\\beta)+(1-\\gamma) \= 3-(\\alpha+\\beta+\\gamma) \= \-1 \$\$ 곱이 \$-3\$이고 합이 \$-1\$인 세 정수는 \$1, 1, \-3\$뿐이므로 \${\\alpha, \\beta, \\gamma}={0, 0, 4}\$이다. 따라서 \$f(x)=x^2(x-4)=x^3-4x^2\$이므로 \$m=3\$이고, \$\\alpha^2+\\beta^2+\\gamma^2-m \= 0+0+16-3 \= 13\$이다.

```
{"status": "EXEMPT", "reason": "삼차방정식에 x=1을 대입해 m을 소거한 뒤 정수 근의 곱과 합 조건으로 세 근과 m을 확정하는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$x=1$을 대입해 $m$을 소거한 $(1-\\alpha)(1-\\beta)(1-\\gamma)=-3$과 세 근의 합 $\\alpha+\\beta+\\gamma=4$를 연립해 세 정수 근을 찾는다.", "decisiveStep": "$m$을 소거하는 값 $x=1$을 대입해 곱이 $-3$, 합이 $-1$인 세 정수를 유일하게 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY): 삼차방정식의 정수 근 조건 문항으로 현재 ACTIVE 대응 키 미구비"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미지수 $m$ 소거를 위한 수치대입과 정수근 부정방정식을 결합한 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "모두 정수일 때"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에서 $\\alpha+\\beta+\\gamma=4$", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-4x^2-(m-3)x+m-3=0$"}], "condition": []}, "reasons": {"method": "x=1 대입으로 m을 소거한 뒤 정수 인수의 합·곱으로 세 근을 확정함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q17

- 형식: 객관식  
- 배점: 4.3

### 발문

모든 실수 \$x\$에 대하여 두 이차다항식 \$P(x)\$, \$Q(x)\$가 다음 조건을 만족시킨다. (가) \$P(x)+Q(x)=6\$ (나) \${P(x)}^3+{Q(x)}^3 \= 18x^4+36x^3+18x^2+54\$ \$P(x)\$의 최고차항의 계수가 양수일 때, \$P(2)+Q(1)\$의 값은?

### 선지

① \$6\$ ② \$8\$ ③ \$12\$ ④ \$10\$ ⑤ \$14\$

### 정답

④

### 해설

곱셈 공식 \${P(x)}^3+{Q(x)}^3 \= {P(x)+Q(x)}^3-3P(x)Q(x){P(x)+Q(x)}\$에 조건 (가), (나)를 대입하면 \$\$ 6^3-18P(x)Q(x) \= 18(x^4+2x^3+x^2)+54 \$\$ 양변을 \$18\$로 나누어 정리하면 \$\$ P(x)Q(x) \= 9-(x^2+x)^2 \= (x^2+x+3)(-x^2-x+3) \$\$ \$P(x)+Q(x)=6\$이고 \$P(x)\$의 최고차항의 계수가 양수이므로 \$\$ P(x)=x^2+x+3, \\qquad Q(x)=-x^2-x+3 \$\$ 따라서 \$P(2)+Q(1) \= (4+2+3)+(-1-1+3) \= 9+1 \= 10\$이다.

```
{"status": "EXEMPT", "reason": "세제곱의 합 곱셈 공식 변형으로 P(x)Q(x)를 구하고 인수분해해 P(x), Q(x)를 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$P^3+Q^3=(P+Q)^3-3PQ(P+Q)$로 $P(x)Q(x)=9-(x^2+x)^2$을 얻은 뒤 합차 인수분해로 $P(x), Q(x)$를 결정한다.", "decisiveStep": "$9-(x^2+x)^2=(x^2+x+3)(-x^2-x+3)$에서 두 인수의 합이 $6$이고 최고차항 부호로 $P, Q$가 갈림을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 세제곱 합의 곱셈공식 변형과 인수분해로 다항식을 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식에 대한 세제곱 합 곱셈 공식 변형과 합차 공식 인수분해를 결합한 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 이차다항식 $P(x)$, $Q(x)$"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식 $\\{P(x)\\}^3+\\{Q(x)\\}^3", "evidenceType": "NAMED"}], "given": [{"term": "인수분해", "src": "solution", "quote": "(x^2+x+3)(-x^2-x+3)"}], "condition": []}, "reasons": {"method": "세제곱 합 변형 공식으로 P(x)Q(x)를 구하고 합차 인수분해로 P, Q를 결정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.4

### 발문

함수 \$f(x)=\\begin{cases} x^2+2x+5 & (x\<0) \\ x^2-4x+5 & (x\\ge 0\) \\end{cases}\$에 대하여 \$A={f(x)}^2-7f(x)\$라 하자. \$-2\\le x\\le 3\$의 범위에서 \$A\$는 \$x=a\$일 때 최댓값 \$b\$이다. 이때 \$a+b\$의 값은? (단, \$x\\ne 0\$)

### 선지

① \$-4\$ ② \$-2\$ ③ \$0\$ ④ \$2\$ ⑤ \$4\$

### 정답

①

### 해설

\$x\\ne 0\$인 \$-2\\le x\\le 3\$에서 \$f(x)\$의 값의 범위를 구하면

- \$-2\\le x\<0\$일 때: \$f(x)=(x+1)^2+4\$이므로 \$4\\le f(x)\<5\$  
- \$0\<x\\le 3\$일 때: \$f(x)=(x-2)^2+1\$이므로 \$1\\le f(x)\<5\$ 따라서 \$t=f(x)\$라 두면 \$t\$의 범위는 \$1\\le t\<5\$이다. \$A \= t^2-7t \= \\left(t-\\dfrac{7}{2}\\right)^2-\\dfrac{49}{4}\$는 \$1\\le t\<5\$에서 꼭짓점 \$t=\\dfrac{7}{2}\$으로부터 가장 먼 \$t=1\$(\$x=2\$)일 때 최댓값을 갖는다. 따라서 \$a=2\$, 최댓값 \$b=1^2-7\\cdot 1=-6\$이므로 \$a+b=2+(-6)=-4\$이다.

```
{"status": "EXEMPT", "reason": "구간별 이차함수의 치역을 구해 합성 이차식 t^2-7t의 최댓값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "두 구간 $[-2, 0)$과 $(0, 3]$에서 $t=f(x)$의 치역 $1\\le t<5$를 구한 뒤 $A=t^2-7t$의 최댓값을 구한다.", "decisiveStep": "$t=f(x)$ 치역 $1\\le t<5$에서 $t=1$이 축 $t=7/2$에서 가장 멀어 최댓값이 유일하게 $x=2$에서 나옴을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 구간별 이차함수 치역을 치환하여 제한 범위 이차식의 최댓값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조각 이차함수의 치역 합집합과 치환 이차함수의 최대·최소를 결합한 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값 $b$이다"}], "method": [{"term": "치환", "src": "solution", "quote": "t=f(x)$라 두면", "evidenceType": "IMPLIED", "justification": "f(x)의 치역 1<=t<5를 구한 뒤 t=f(x)로 치환해 이차식의 최댓값을 구함"}], "given": [{"term": "이차함수", "src": "solution", "quote": "(x+1)^2+4"}], "condition": []}, "reasons": {"method": "구간별 f(x)의 치역 1<=t<5를 구한 뒤 t^2-7t의 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.7

### 발문

두 양수 \$p\$, \$q\$에 대하여 이차함수 \$f(x)=-x^2+px-q\$의 그래프가 \$x\$축에 접하고, \$-p\\le x\\le p\$에서 최솟값이 \$-45\$일 때, \$p^2+q^2\$의 값은?

### 선지

① \$25\$ ② \$36\$ ③ \$45\$ ④ \$50\$ ⑤ \$65\$

### 정답

③

### 해설

\$y=f(x)\$의 그래프가 \$x\$축에 접하므로 판별식 \$D=p^2-4q=0 \\implies q=\\dfrac{p^2}{4}\$이다. 따라서 \$f(x) \= \-\\left(x-\\dfrac{p}{2}\\right)^2\$이고 위로 볼록하며 축은 \$x=\\dfrac{p}{2}\$(\$p\>0\$)이다. 구간 \$-p\\le x\\le p\$에서 축 \$x=\\dfrac{p}{2}\$로부터 가장 먼 점은 \$x=-p\$이므로 최솟값은 \$\$ f(-p) \= \-\\left(-p-\\frac{p}{2}\\right)^2 \= \-\\frac{9}{4}p^2 \= \-45 \\implies p^2 \= 20 \$\$ \$q=\\dfrac{p^2}{4}=5\$이므로 \$q^2=25\$이다. 따라서 \$p^2+q^2=20+25=45\$이다.

```
{"status": "EXEMPT", "reason": "x축 접선 조건으로 f(x)=-(x-p/2)^2을 세우고 [-p, p]에서의 최솟값 -45로 p, q를 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$x$축 접선 조건 $p^2=4q$로 $f(x)=-(x-p/2)^2$을 세우고, 구간 $[-p, p]$의 최솟값 $f(-p)=-\\frac{9}{4}p^2=-45$를 푼다.", "decisiveStep": "양수 $p>0$에 대하여 축 $p/2$에서 가장 먼 끝점이 $-p$임을 판별해 $-\\frac{9}{4}p^2=-45$를 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 대칭 구간 [-p, p]에서 이차함수의 최솟값 조건을 풀어내는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$축 접선 조건과 대칭 범위에서의 최솟값을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "최솟값이 $-45$일 때"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=p^2-4q=0", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=-x^2+px-q$"}], "condition": [{"term": "양수", "src": "stem", "quote": "두 양수 $p$, $q$에 대하여"}]}, "reasons": {"method": "판별식 D=0으로 f(x)=-(x-p/2)^2을 세우고 f(-p)=-45로 p, q를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.8

### 발문

\$1\$보다 큰 자연수 \$k\$에 대하여 다항식 \$P(x)=x^4+(n-1)x^3+nx^2+(n-1)x+1\$이 \$x^2+kx+1\$을 인수로 가질 때의 자연수 \$n\$을 \$f(k)\$라 하자. 이때 \$f(6)-f(4)\$의 값은?

### 선지

① \$1\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$2\$

### 정답

⑤

### 해설

\$P(x)\$가 \$x^2+kx+1\$을 인수로 가지고 상수항과 최고차항의 계수가 모두 \$1\$이므로 \$\$ P(x) \= (x^2+kx+1)(x^2+cx+1) \= x^4+(k+c)x^3+(kc+2)x^2+(k+c)x+1 \$\$ 계수를 비교하면 \$k+c=n-1\$, \$kc+2=n\$이다. 두 식을 빼면 \$\$ kc+2-(k+c) \= 1 \\implies (k-1)(c-1) \= 0 \$\$ \$k\>1\$이므로 \$c=1\$이고, 따라서 \$n=k+2\$, 즉 \$f(k)=k+2\$이다. 그러므로 \$f(6)-f(4)=8-6=2\$이다.

```
{"status": "EXEMPT", "reason": "상반 사차다항식의 이차인수 계수비교로 n=k+2 관계를 도출해 f(6)-f(4)를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$P(x)=(x^2+kx+1)(x^2+cx+1)$로 두고 계수비교해 $(k-1)(c-1)=0$에서 $c=1$, $f(k)=k+2$를 구한다.", "decisiveStep": "계수비교 두 식을 빼 $(k-1)(c-1)=0$을 얻고 조건 $k>1$로 $c=1$을 확정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 상반 사차다항식의 이차인수 조건식을 계수비교로 풀어내는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상반 사차식의 이차인수 조건을 계수비교와 부정방정식 인수분해로 푸는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "인수로 가질 때"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "IMPLIED", "justification": "나머지 인수를 x^2+cx+1로 두고 계수를 비교하여 (k-1)(c-1)=0을 도출함"}], "given": [{"term": "자연수", "src": "stem", "quote": "$1$보다 큰 자연수 $k$"}], "condition": []}, "reasons": {"method": "나머지 인수를 x^2+cx+1로 두고 계수비교로 f(k)=k+2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 10

### 발문

직선 \$y=2kx+3\$은 이차함수 \$y=-x^2+(2k+4)x-4k+4\$와 서로 다른 두 점에서 만나고, 이차함수 \$y=x^2+4kx+k^2+2k+10\$과는 만나지 않는다. (1) 이를 만족하는 실수 \$k\$의 값의 범위를 구하고, 이를 구하는 풀이과정을 설명하시오. (2) (1)에서 \$k\$가 자연수일 때, \$x\\ge 2\$에서 \$y=-(x^2-2kx)^2+4k(x^2-2kx)+3k\$의 최댓값을 구하고, 풀이과정을 설명하시오.

### 선지

없음

### 정답

(1) \$-\\dfrac{7}{2}\<k\<\\dfrac{5}{4}\$, (2) \$7\$

### 해설

(1) 직선 \$y=2kx+3\$과 첫째 이차함수 \$y=-x^2+(2k+4)x-4k+4\$를 연립하면 \$\$ x^2-4x+4k-1 \= 0 \$\$ 서로 다른 두 점에서 만나므로 판별식 \$D\_1\>0\$에서 \$\$ \\frac{D\_1}{4} \= (-2)^2-(4k-1) \= 5-4k \> 0 \\implies k \< \\frac{5}{4} \$\$ 직선 \$y=2kx+3\$과 둘째 이차함수 \$y=x^2+4kx+k^2+2k+10\$을 연립하면 \$\$ x^2+2kx+k^2+2k+7 \= 0 \$\$ 만나지 않으므로 판별식 \$D\_2\<0\$에서 \$\$ \\frac{D\_2}{4} \= k^2-(k^2+2k+7) \= \-2k-7 \< 0 \\implies k \> \-\\frac{7}{2} \$\$ 따라서 구하는 \$k\$의 범위는 \$-\\dfrac{7}{2}\<k\<\\dfrac{5}{4}\$이다. (2) (1)의 범위에서 자연수 \$k\$는 \$k=1\$이다. \$x\\ge 2\$에서 \$t=x^2-2x=(x-1)^2-1\$이라 두면 \$x=2\$일 때 최솟값 \$0\$을 가지므로 \$t\\ge 0\$이다. 주어진 함수는 \$\$ y \= \-t^2+4t+3 \= \-(t-2)^2+7 \$\$ 이고 \$t=2\$가 범위 \$t\\ge 0\$에 포함되므로 구하는 최댓값은 \$7\$이다.

```
{"status": "EXEMPT", "reason": "(1) 두 판별식 연립부등식으로 k 범위를 구하고 (2) 자연수 k=1일 때 치환 사차함수의 최댓값을 구하는 순수 대수·함수 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "(1) 두 위치 관계의 판별식 $D_1>0, D_2<0$을 연립해 $-\\frac{7}{2}<k<\\frac{5}{4}$를 구하고, (2) 자연수 $k=1$에서 $t=x^2-2x\\ge 0$ 치환으로 최댓값 $7$을 구한다.", "decisiveStep": "(2)에서 $x\\ge 2$ 조건에 따른 치환 변수 $t=x^2-2x$의 범위 $t\\ge 0$을 구하고 꼭짓점 $t=2$의 포함 여부를 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 직선과 두 포물선의 교점 개수 조건(판별식)과 치환 최댓값을 결합한 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선·이차함수 위치 관계 판별식 연립과 제한 범위 치환 사차함수 최댓값을 결합한 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값을 구하고"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D_1>0$에서", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2+(2k+4)x-4k+4$"}], "condition": [{"term": "치환", "src": "solution", "quote": "t=x^2-2x=(x-1)^2-1$이라 두면"}]}, "reasons": {"method": "두 판별식 연립으로 k 범위를 구하고 자연수 k=1에서 t>=0 치환 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 10

### 발문

최고차항의 계수가 \$1\$인 다항식 \$f(x)\$가 다음 조건을 만족시킨다. (가) 다항식 \$f(x)\$를 다항식 \$g(x)\$로 나눈 몫과 나머지는 모두 \$g(x)-5x^2\$이다. (나) 다항식 \$f(x)\$를 \$x-1\$로 나눈 나머지는 \$-9\$이다. \$f(3)\$의 값을 구하시오.

### 선지

없음

### 정답

\$-\\dfrac{2821}{25}\$

### 해설

조건 (가)에 의하여 \$\$ f(x) \= g(x){g(x)-5x^2}+{g(x)-5x^2} \= {g(x)+1}{g(x)-5x^2} \$\$ 나머지 \$g(x)-5x^2\$의 차수는 나누는 식 \$g(x)\$의 차수보다 작아야 하므로 \$g(x)\$는 \$5x^2\$이 소거되는 이차식 \$g(x)=5x^2+ax+b\$이다. 그러면 \$g(x)-5x^2=ax+b\$이고, \$f(x)\$의 최고차항은 \$5x^2\\cdot ax=5ax^3\$이므로 최고차항 계수가 \$1\$이 되려면 \$5a=1 \\implies a=\\dfrac{1}{5}\$이다. 조건 (나)에서 \$f(1)=-9\$이므로 \$u=g(1)\$이라 하면 \$\$ (u+1)(u-5) \= \-9 \\implies u^2-4u+4 \= (u-2)^2 \= 0 \\implies u \= g(1) \= 2 \$\$ \$g(1) \= 5+\\dfrac{1}{5}+b \= 2\$에서 \$b \= \-\\dfrac{16}{5}\$이므로 \$g(x) \= 5x^2+\\dfrac{1}{5}x-\\dfrac{16}{5}\$이다. 따라서 \$g(3) \= 45+\\dfrac{3}{5}-\\dfrac{16}{5} \= \\dfrac{212}{5}\$, \$g(3)-45 \= \-\\dfrac{13}{5}\$이므로 \$\$ f(3) \= \\left(\\frac{212}{5}+1\\right)\\left(-\\frac{13}{5}\\right) \= \\frac{217}{5}\\cdot\\left(-\\frac{13}{5}\\right) \= \-\\frac{2821}{25} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "다항식 나눗셈의 차수 조건으로 g(x)의 차수와 최고차항을 결정하고 f(1)=-9 중근 방정식으로 g(1)을 확정하는 순수 대수 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "나머지 차수 조건으로 $g(x)=5x^2+ax+b$를 확정하고 $f(x)$의 최고차항 계수 $5a=1$과 $f(1)=-9$ 중근 조건 $(g(1)-2)^2=0$으로 $g(x)$를 구한다.", "decisiveStep": "나머지 $g(x)-5x^2$의 차수가 $g(x)$보다 작으므로 $g(x)$의 이차항이 $5x^2$이어야 함을 추론한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 다항식 나눗셈의 몫과 나머지 차수 조건으로 다항식을 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 나눗셈의 차수 조건 추론, 최고차항 계수 결정, 중근 조건을 통합한 최고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$가"}], "method": [{"term": "다항식의나눗셈", "src": "stem", "quote": "다항식 $g(x)$로 나눈 몫과 나머지", "evidenceType": "IMPLIED", "justification": "나머지의 차수가 제수 g(x)보다 작다는 성질로 g(x)의 이차항을 결정하고 f(1)=-9를 대입함"}], "given": [{"term": "계수", "src": "stem", "quote": "최고차항의 계수가 $1$"}], "condition": [{"term": "나머지정리", "src": "stem", "quote": "$x-1$로 나눈 나머지는 $-9$"}]}, "reasons": {"method": "나머지 차수 조건으로 g(x)=5x^2+ax+b를 세우고 f(1)=-9로 g(x)를 확정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

