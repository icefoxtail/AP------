

```
{"stem": "20_금당고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/20_금당고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 101.5, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

두 다항식 \$A=2x^2-3xy+4y^2\$, \$B=x^2+xy-2y^2\$에 대하여 \$A+2B=ax^2+bxy+cy^2\$일 때, \$a+b+c\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

①

### 해설

동류항끼리 모아 다항식을 계산하면 \$\$ \\begin{aligned} A+2B &= (2x^2-3xy+4y^2)+2(x^2+xy-2y^2) \\ &= 2x^2-3xy+4y^2+2x^2+2xy-4y^2 \\ &= (2+2)x^2+(-3+2)xy+(4-4)y^2 \\ &= 4x^2-xy \\end{aligned} \$\$ 이다. 이를 \$ax^2+bxy+cy^2\$과 비교하면 \$a=4\$, \$b=-1\$, \$c=0\$이므로 \$a+b+c=4+(-1)+0=3\$이다.

```
{"status": "EXEMPT", "reason": "두 이차다항식의 일차 결합을 동류항 정리로 계산해 계수 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$A+2B$를 전개한 뒤 $x^2, xy, y^2$ 동류항끼리 계수를 합산해 $a, b, c$를 구한다.", "decisiveStep": "$y^2$항의 계수가 $4-4=0$으로 소거됨을 확인해 $c=0$을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "차수·계수 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-001 (DIRECT_ACTIVE): 동류항 정리로 A+2B 계수 합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 덧셈과 상수배를 동류항 정리로 바로 계산하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "a=4$, $b=-1$, $c=0$"}], "method": [{"term": "동류항", "src": "solution", "quote": "동류항끼리 모아", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=2x^2-3xy+4y^2$"}], "condition": []}, "reasons": {"method": "A+2B를 전개해 동류항 계수 합 a+b+c=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

\$x\$에 대한 다항식 \$x^4+ax+4\$가 \$x+2\$로 나누어떨어지도록 하는 상수 \$a\$의 값은?

### 선지

① \$6\$ ② \$8\$ ③ \$10\$ ④ \$12\$ ⑤ \$14\$

### 정답

③

### 해설

\$P(x)=x^4+ax+4\$라 하면 \$x+2\$로 나누어떨어지므로 인수정리에 의하여 \$P(-2)=0\$이다. \$\$ P(-2) \= (-2)^4+a(-2)+4 \= 16-2a+4 \= 20-2a \= 0 \$\$ 따라서 \$2a=20\$이므로 \$a=10\$이다.

```
{"status": "EXEMPT", "reason": "인수정리 P(-2)=0으로 미정계수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "다항식 $P(x)=x^4+ax+4$가 $x+2$로 나누어떨어지므로 인수정리 $P(-2)=0$에 $x=-2$를 대입한다.", "decisiveStep": "$(-2)^4=16$과 $-2a$를 계산해 $20-2a=0$에서 $a=10$을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012 (RPM_ONLY): 인수정리 P(-2)=0으로 미정계수 a 결정, ACTIVE 매핑 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리 $P(-2)=0$을 한 번 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값은"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여 $P(-2)=0$", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^4+ax+4$"}], "condition": []}, "reasons": {"method": "인수정리 P(-2)=0을 적용해 a=10을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 3.8

### 발문

등식 \$(x-2i)(3+i)=11+yi\$를 만족시키는 실수 \$x\$, \$y\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$x=3,;y=3\$ ② \$x=3,;y=-3\$ ③ \$x=4,;y=-2\$ ④ \$x=2,;y=-4\$ ⑤ \$x=3,;y=-9\$

### 정답

②

### 해설

좌변을 전개하여 \$i^2=-1\$을 적용하면 \$\$ (x-2i)(3+i) \= 3x+xi-6i-2i^2 \= (3x+2)+(x-6)i \$\$ 이다. 이 식이 \$11+yi\$와 같고 \$x, y\$는 실수이므로 복소수가 서로 같을 조건에 의하여 \$\$ 3x+2=11, \\qquad x-6=y \$\$ 이다. 따라서 \$3x=9\$에서 \$x=3\$이고, \$y=3-6=-3\$이다.

```
{"status": "EXEMPT", "reason": "복소수 곱을 전개한 뒤 실수부와 허수부 비교로 x, y를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "좌변 $(x-2i)(3+i)$를 전개해 실수부와 허수부로 정리한 뒤 $11+yi$와 비교한다.", "decisiveStep": "$-2i^2=+2$를 실수부에 합산하여 $3x+2=11$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-022 (DIRECT_ACTIVE): 복소수 곱 전개 후 실수부·허수부 상등 조건 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 곱셈 전개와 복소수 상등 조건을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $x$, $y$의 값은"}], "method": [{"term": "복소수", "src": "solution", "quote": "복소수가 서로 같을 조건에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "등식", "src": "stem", "quote": "등식 $(x-2i)(3+i)=11+yi$"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $x$, $y$"}]}, "reasons": {"method": "좌변 전개 후 복소수 상등 조건으로 x, y를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$x^2-2kx+4k-4=0\$이 중근을 가질 때, 실수 \$k\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

⑤

### 해설

이차방정식이 중근을 가지려면 판별식 \$D=0\$이어야 한다. \$\$ \\dfrac{D}{4} \= (-k)^2 - 1\\cdot(4k-4) \= k^2-4k+4 \= (k-2)^2 \= 0 \$\$ 따라서 \$k=2\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 중근 조건 D=0으로 실수 k를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "이차방정식 $x^2-2kx+4k-4=0$의 짝수 판별식 $\\frac{D}{4}=(k-2)^2=0$을 푼다.", "decisiveStep": "판별식이 완전제곱식 $(k-2)^2$으로 인수분해됨을 확인해 $k=2$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028 (DIRECT_ACTIVE): 이차방정식 중근 조건에 판별식 D=0 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 중근 조건에 판별식 $D=0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값은"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이어야 한다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2kx+4k-4=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 가질 때"}]}, "reasons": {"method": "짝수 판별식 D/4=0을 풀어 k=2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.8

### 발문

두 수 \$2-3i\$, \$2+3i\$를 근으로 하는 이차방정식이 \$x^2+ax+b=0\$일 때, 실수 \$a+b\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-9\$ ② \$-5\$ ③ \$5\$ ④ \$9\$ ⑤ \$17\$

### 정답

④

### 해설

두 근이 \$2-3i\$, \$2+3i\$이고 \$x^2\$의 계수가 \$1\$인 이차방정식은 \$\$ \\begin{aligned} (x-(2-3i))(x-(2+3i)) &= ((x-2)+3i)((x-2)-3i) \\ &= (x-2)^2-(3i)^2 \\ &= x^2-4x+4+9 \= x^2-4x+13 \= 0 \\end{aligned} \$\$ 이다. \$x^2+ax+b=0\$과 비교하면 \$a=-4\$, \$b=13\$이므로 \$a+b=-4+13=9\$이다.

```
{"status": "EXEMPT", "reason": "두 복소수 근으로 이차방정식을 작성해 계수 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 켤레복소수 근 $2-3i, 2+3i$를 인수로 하는 $(x-2+3i)(x-2-3i)=0$을 전개해 $a, b$를 구한다.", "decisiveStep": "합차 공식을 이용해 $(x-2)^2-(3i)^2=x^2-4x+13$으로 전개한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030 (DIRECT_BINDING_GAP): 주어진 두 근으로 이차방정식을 구성하여 계수 비교"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근이 주어졌을 때 이차방정식을 세워 계수를 비교하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "$x^2+ax+b=0$일 때, 실수 $a+b$의 값은"}], "method": [{"term": "전개", "src": "solution", "quote": "x^2-4x+4+9 = x^2-4x+13 = 0", "evidenceType": "IMPLIED", "justification": "두 일차인수의 곱을 합차 공식으로 전개해 계수 a, b를 구함"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식이 $x^2+ax+b=0$"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a+b$의 값은"}]}, "reasons": {"method": "두 근의 인수를 합차 공식으로 전개해 계수 합 a+b=9를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q06

- 형식: 객관식  
- 배점: 3.8

### 발문

이차함수 \$y=x^2-6x+k\$의 그래프가 \$x\$축과 서로 다른 두 점에서 만나게 하는 자연수 \$k\$의 개수는?

### 선지

① \$7\$ ② \$8\$ ③ \$9\$ ④ \$10\$ ⑤ \$11\$

### 정답

②

### 해설

이차함수 \$y=x^2-6x+k\$의 그래프가 \$x\$축과 서로 다른 두 점에서 만나려면 이차방정식 \$x^2-6x+k=0\$이 서로 다른 두 실근을 가져야 하므로 판별식 \$D\>0\$이어야 한다. \$\$ \\dfrac{D}{4} \= (-3)^2-k \= 9-k \> 0 \\implies k \< 9 \$\$ \$k\$는 자연수이므로 \$k=1, 2, 3, 4, 5, 6, 7, 8\$의 \$8\$개이다.

```
{"status": "EXEMPT", "reason": "이차함수와 x축의 두 교점 조건을 판별식 D>0으로 풀어 자연수 개수를 세는 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$x$축과의 교점 조건을 $x^2-6x+k=0$의 판별식 $\\frac{D}{4}=9-k>0$으로 해석해 자연수 $k$를 센다.", "decisiveStep": "$k<9$를 만족하는 자연수가 $1$부터 $8$까지 $8$개임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033 (DIRECT_ACTIVE): 이차함수 그래프와 x축의 서로 다른 두 교점 조건 D>0"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$축 교점 조건에 판별식 $D>0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "자연수 $k$의 개수는"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$이어야 한다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-6x+k$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $k$"}]}, "reasons": {"method": "판별식 D/4=9-k>0으로 자연수 k의 개수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.8

### 발문

\$x\$에 대한 다항식 \$2x^5-x^4-5x^3+3x+1\$의 인수가 아닌 것은?

### 선지

① \$x-1\$ ② \$x+1\$ ③ \$2x+1\$ ④ \$x^2-x-1\$ ⑤ \$x^2+x-1\$

### 정답

⑤

### 해설

\$P(x)=2x^5-x^4-5x^3+3x+1\$이라 두면 \$\$ P(1)=2-1-5+3+1=0, \\qquad P(-1)=-2-1+5-3+1=0 \$\$ 이므로 \$x-1\$과 \$x+1\$이 모두 인수이다. 조립제법으로 인수분해하면 \$\$ \\begin{aligned} P(x) &= (x-1)(x+1)(2x^3-x^2-3x-1) \\ &= (x-1)(x+1)(2x+1)(x^2-x-1) \\end{aligned} \$\$ 이다. 따라서 ① \$x-1\$, ② \$x+1\$, ③ \$2x+1\$, ④ \$x^2-x-1\$은 모두 인수이고, ⑤ \$x^2+x-1\$은 인수가 아니다.

```
{"status": "EXEMPT", "reason": "고차 다항식을 인수정리와 조립제법으로 인수분해해 인수가 아닌 것을 찾는 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$P(1)=0, P(-1)=0, P(-\\frac{1}{2})=0$으로 일차인수를 찾은 뒤 조립제법으로 $(x-1)(x+1)(2x+1)(x^2-x-1)$로 인수분해한다.", "decisiveStep": "일차인수 분해 후 남은 이차인수가 $x^2-x-1$임을 확인해 $x^2+x-1$을 배제한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "인수 판정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-011 (RPM_ONLY): 인수정리와 조립제법으로 5차 다항식 인수 판정, ACTIVE 매핑 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "5차 다항식에 인수정리와 조립제법을 연속 적용해 인수를 판별하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "인수가 아닌 것은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "조립제법으로 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $2x^5-x^4-5x^3+3x+1$"}], "condition": []}, "reasons": {"method": "인수정리와 조립제법으로 5차식을 인수분해해 인수가 아닌 보기를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q08

- 형식: 객관식  
- 배점: 3.8

### 발문

\$x\$의 값의 범위가 \$-1\\le x\\le 4\$인 이차함수 \$y=x^2-4x+7\$의 최댓값과 최솟값의 합은?

### 선지

① \$15\$ ② \$16\$ ③ \$17\$ ④ \$18\$ ⑤ \$19\$

### 정답

①

### 해설

주어진 이차함수를 \$f(x)=x^2-4x+7=(x-2)^2+3\$이라 하면 아래로 볼록이고 축이 \$x=2\$이다. \$x=2\$가 구간 \$-1\\le x\\le 4\$에 포함되므로 최솟값은 \$f(2)=3\$이다. 구간의 양 끝값은 \$\$ f(-1) \= (-1-2)^2+3 \= 12, \\qquad f(4) \= (4-2)^2+3 \= 7 \$\$ 이므로 최댓값은 \$12\$이다. 따라서 최댓값과 최솟값의 합은 \$12+3=15\$이다.

```
{"status": "EXEMPT", "reason": "제한된 범위에서 이차함수를 표준형으로 고쳐 최대·최소 합을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "완전제곱식 $f(x)=(x-2)^2+3$으로 고쳐 꼭짓점 $x=2$가 구간에 포함됨을 확인하고 양 끝값과 비교한다.", "decisiveStep": "축 $x=2$에서 먼 $x=-1$에서 최댓값 $12$가 됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037 (DIRECT_ACTIVE): 제한된 구간 [-1, 4]에서 이차함수 최대·최소 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 구간에 꼭짓점이 포함된 이차함수의 최대·최소를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값의 합은"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x-2)^2+3", "evidenceType": "IMPLIED", "justification": "이차함수를 완전제곱식으로 고쳐 축과 꼭짓점을 확인함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-4x+7$"}], "condition": [{"term": "범위", "src": "stem", "quote": "값의 범위가 $-1\\le x\\le 4$"}]}, "reasons": {"method": "표준형 변형 후 구간 내 꼭짓점과 양 끝값을 비교해 최대·최소 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 3.8

### 발문

복소수 \$z=\\dfrac{1-i}{1+i}\$일 때, \$f(n)=z^n\$이라 하자. \$f(3)+f(4)+f(5)+\\cdots+f(n)=1\$인 \$120\$ 이하의 자연수 \$n\$의 개수는? (단, \$n\\ge 3\$, \$i=\\sqrt{-1}\$)

### 선지

① \$26\$개 ② \$27\$개 ③ \$28\$개 ④ \$29\$개 ⑤ \$30\$개

### 정답

④

### 해설

먼저 분모를 실수화하면 \$\$ z \= \\dfrac{1-i}{1+i} \= \\dfrac{(1-i)^2}{(1+i)(1-i)} \= \\dfrac{1-2i+i^2}{1-i^2} \= \\dfrac{-2i}{2} \= \-i \$\$ 이다. 따라서 \$f(n)=(-i)^n\$이고, \$(-i)^n\$은 \$n=1, 2, 3, 4\$에 대해 \$-i, \-1, i, 1\$이 주기 \$4\$로 반복된다. 처음 세 항을 더하면 \$f(3)+f(4)+f(5)=i+1+(-i)=1\$이므로 \$n=5\$일 때 조건을 만족한다. 연속한 네 항의 합은 항상 \$0\$이므로 \$n=4t+1\$ (\$t\\ge 1\$)일 때마다 누적합이 \$1\$이 된다. \$4t+1 \\le 120\$에서 \$4t \\le 119\$, 즉 \$t \\le 29\$이므로 \$t=1, 2, \\ldots, 29\$의 \$29\$개이다.

```
{"status": "EXEMPT", "reason": "복소수 실수화 후 주기 4의 순환성을 이용해 누적합 조건을 만족하는 자연수 개수를 세는 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=\\frac{1-i}{1+i}=-i$로 간단히 한 뒤 $(-i)^n$의 주기 $4$ 순환합이 $0$임을 이용해 $n=4t+1$ 꼴을 센다.", "decisiveStep": "첫 세 항 $(-i)^3+(-i)^4+(-i)^5=1$과 연속 $4$항 합 $0$을 결합해 $n=4t+1$ 조건을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025 (DIRECT_ACTIVE): z=-i 실수화 후 주기 4 순환성으로 누적합 조건 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 나눗셈과 $i$ 거듭제곱의 주기성, 합 조건을 연결하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "자연수 $n$의 개수는"}], "method": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\dfrac{1-i}{1+i}$", "evidenceType": "IMPLIED", "justification": "복소수를 실수화하여 -i의 주기 4 성질로 누적합이 1이 되는 n을 구함"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\dfrac{1-i}{1+i}$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "$120$ 이하의 자연수 $n$"}]}, "reasons": {"method": "z=-i의 주기 4 성질로 누적합=1 조건을 만족하는 n=4t+1 개수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$x^4-3x^2+2x+a\$를 \$x-2\$로 나누었을 때의 몫은 \$Q(x)\$, 나머지는 \$6\$이다. \$Q(x)\$를 \$x-a\$로 나눈 나머지는?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

③

### 해설

\$P(x)=x^4-3x^2+2x+a\$라 하면 \$x-2\$로 나눈 나머지가 \$6\$이므로 나머지정리에 의하여 \$\$ P(2) \= 16-3\\cdot 4+2\\cdot 2+a \= 8+a \= 6 \\implies a \= \-2 \$\$ 이다. 이제 \$P(x)=x^4-3x^2+2x-2\$를 \$x-2\$로 조립제법을 이용해 나누면 \$\$ P(x) \= (x-2)(x^3+2x^2+x+4)+6 \$\$ 이므로 \$Q(x)=x^3+2x^2+x+4\$이다. 따라서 \$Q(x)\$를 \$x-a=x+2\$로 나눈 나머지는 \$\$ Q(-2) \= (-2)^3+2(-2)^2+(-2)+4 \= \-8+8-2+4 \= 2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "나머지정리로 a를 정한 뒤 조립제법으로 몫 Q(x)를 구해 다시 나머지정리를 적용하는 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$P(2)=6$으로 $a=-2$를 구한 뒤 조립제법으로 $Q(x)$를 구해 나머지정리 $Q(-2)$를 계산한다.", "decisiveStep": "몫 $Q(x)=x^3+2x^2+x+4$를 정확히 구하고 $x-a=x+2$이므로 $x=-2$를 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_NESTED_DIVISION", "why": "high1.json H1-RPM-010 (FAMILY_ACTIVE): 몫 Q(x)를 다시 일차식으로 나눈 나머지를 구하는 중첩 나눗셈"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리, 조립제법 몫 계산, 재차 나머지정리 적용을 순서대로 수행하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "$Q(x)$를 $x-a$로 나눈 나머지는"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^4-3x^2+2x+a$"}], "condition": []}, "reasons": {"method": "나머지정리로 a를 구하고 조립제법으로 Q(x)를 찾아 Q(-2)를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

\$0\$이 아닌 세 실수 \$x\$, \$y\$, \$z\$가 \$\\sqrt{x}\\sqrt{y}=\\sqrt{xy}\$, \$\\dfrac{\\sqrt{z}}{\\sqrt{x}}=\\sqrt{\\dfrac{z}{x}}\$, \$0\<x\\le y\$를 만족할 때, \$\|y-x\|-\|x+z\|-\\sqrt{(x-y-z)^2}\$을 간단히 하면?

### 선지

① \$x-2z\$ ② \$-x-2z\$ ③ \$-x\$ ④ \$x+2z\$ ⑤ \$-2y-x\$

### 정답

②

### 해설

\$0\<x\\le y\$이므로 \$y\>0\$이고, \$\\sqrt{z}\$가 실수이면서 \$z\\ne 0\$이므로 \$z\>0\$이다. 따라서 각 식의 부호를 판정하면 \$y-x\\ge 0\$, \$x+z\>0\$, \$x-y-z\<0\$이다. 절댓값과 제곱근을 부호에 맞게 풀면 \$\$ \|y-x\| \= y-x, \\qquad \|x+z\| \= x+z, \\qquad \\sqrt{(x-y-z)^2} \= \|x-y-z\| \= y+z-x \$\$ 이다. 그러므로 준식은 \$\$ (y-x)-(x+z)-(y+z-x) \= y-x-x-z-y-z+x \= \-x-2z \$\$ 이다.

```
{"status": "EXEMPT", "reason": "제곱근 성질과 대소 조건으로 부호를 판정해 절댓값과 제곱근 식을 간단히 하는 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$0<x\\le y$와 $z>0$ 부호 조건을 이용해 $y-x\\ge 0, x+z>0, x-y-z<0$을 판정한 뒤 절댓값을 푼다.", "decisiveStep": "$\\sqrt{(x-y-z)^2}=|x-y-z|$의 내부 부호가 음수임을 확인해 $y+z-x$로 푼다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026 (DIRECT_ACTIVE): 제곱근 성질로 실수 부호 조건을 판정해 절댓값·제곱근 식 정리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱근의 정의 범위에서 $z>0$을 확정하고 3개 절댓값의 부호를 처리하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "절댓값", "src": "solution", "quote": "절댓값과 제곱근을"}], "method": [{"term": "절댓값", "src": "solution", "quote": "절댓값과 제곱근을 부호에 맞게 풀면", "evidenceType": "NAMED"}], "given": [{"term": "실수", "src": "stem", "quote": "세 실수 $x$, $y$, $z$"}], "condition": [{"term": "범위", "src": "stem", "quote": "$0<x\\le y$"}]}, "reasons": {"method": "세 변수의 양수 조건을 확인해 절댓값과 제곱근을 전개함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

그림과 같이 한 변의 길이가 \$a+4\$인 정육면체 모양의 큐브에서 중앙에 한 변의 길이가 \$a\$인 정육면체 모양의 큐브를 제거하였다. 제거한 후 남아있는 큐브의 부피가 \$k(3a^2+12a+16)\$일 때, 상수 \$k\$의 값은? (단, \$a\>0\$)

### 선지

① \$4\$ ② \$6\$ ③ \$8\$ ④ \$12\$ ⑤ \$16\$

### 정답

①

### 해설

큰 정육면체의 부피는 \$(a+4)^3\$이고, 제거한 작은 정육면체의 부피는 \$a^3\$이다. 따라서 남아있는 큐브의 부피는 \$\$ \\begin{aligned} (a+4)^3-a^3 &= (a^3+12a^2+48a+64)-a^3 \\ &= 12a^2+48a+64 \\ &= 4(3a^2+12a+16) \\end{aligned} \$\$ 이다. 이것이 \$k(3a^2+12a+16)\$과 같으므로 \$k=4\$이다.

```
{"status": "READY", "pattern": "construction-spike-v1", "viewBox": "0 0 360 320", "elements": [{"type": "cube_3d", "id": "outer_cube", "edgeLength": "a+4", "center": [180, 160], "style": "solid"}, {"type": "cube_3d", "id": "inner_cube", "edgeLength": "a", "center": [180, 160], "style": "dashed_cutout"}], "note": "한 변의 길이가 a+4인 정육면체 내부 중앙에 한 변의 길이가 a인 정육면체가 제거된 입체 도식"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "남은 부피 $(a+4)^3-a^3$을 곱셈 공식으로 전개한 뒤 공통인수 $4$로 묶어 $k$를 구한다.", "decisiveStep": "$(a+4)^3-a^3=12a^2+48a+64$에서 $a^3$이 소거되고 $4(3a^2+12a+16)$으로 묶임을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003 (DIRECT_ACTIVE): 세제곱 곱셈공식으로 정육면체 부피 차 전개"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정육면체 부피 차 $(a+4)^3-a^3$을 곱셈 공식으로 전개해 상수 $k$를 읽는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $k$의 값은"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "(a+4)^3-a^3", "evidenceType": "IMPLIED", "justification": "세제곱 전개 곱셈 공식을 적용해 정육면체 부피 차를 계산함"}], "given": [{"term": "부피", "src": "stem", "quote": "남아있는 큐브의 부피가"}], "condition": []}, "reasons": {"method": "세제곱 전개 공식으로 남은 부피 4(3a^2+12a+16)을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$f(x)\$의 한 실근은 \$18\$이고 모든 실수 \$x\$에 대하여 \$f(x)\\ge f(5)\$이다. 다음 \<보기\>에서 옳은 것만 있는 대로 고른 것은?

\<보기\> ㄱ. \$f(x)=0\$의 다른 실근은 \$-8\$이다. ㄴ. \$f(3)\<f(7)\<f(11)\$ ㄷ. \$f(0)=k\$라 할 때, \$x\$에 대한 방정식 \$f(x)=kx\$의 두 근의 합은 \$24\$이다.

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

①

### 해설

모든 실수 \$x\$에 대하여 \$f(x)\\ge f(5)\$이므로 이차함수 \$y=f(x)\$는 아래로 볼록하고 대칭축은 \$x=5\$이다.

- ㄱ. \$f(x)=0\$의 한 근이 \$18\$이고 대칭축이 \$x=5\$이므로 다른 실근을 \$r\$이라 하면 \$\\dfrac{18+r}{2}=5 \\implies r=-8\$이다. (참)  
- ㄴ. \$3\$과 \$7\$은 대칭축 \$x=5\$로부터 같은 거리 \$2\$만큼 떨어져 있으므로 \$f(3)=f(7)\$이다. (거짓)  
- ㄷ. \$f(x)=a(x-18)(x+8)=a(x^2-10x-144)\$ (\$a\>0\$)라 두면 \$k=f(0)=-144a\$이다. 방정식 \$f(x)=kx\$는 \$a(x^2-10x-144)=-144ax\$, 즉 \$x^2+134x-144=0\$이므로 두 근의 합은 \$-134\$이다. (거짓) 따라서 옳은 것은 ㄱ뿐이다.

```
{"status": "EXEMPT", "reason": "이차함수의 최솟값 조건으로 대칭축을 구해 근과 대칭성, 방정식 근의 합을 판정하는 합답형 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$f(x)\\ge f(5)$에서 대칭축 $x=5$를 확정하고 대칭성으로 다른 근 $-8$과 $f(3)=f(7)$을 판정한 뒤 $f(x)=kx$의 근과 계수의 관계를 계산한다.", "decisiveStep": "축 $x=5$로부터 $3, 7$이 등거리임을 바로 읽어 ㄴ을 기각하고 $f(x)=a(x-18)(x+8)$을 세워 ㄷ을 판정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034 (DIRECT_ACTIVE): 이차함수 대칭축과 근의 위치·대칭성 합답형 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 대칭축, 대칭 함숫값 비교, $f(0)=k$ 대입 방정식 판정을 모두 묻는 합답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "한 실근은 $18$이고"}], "method": [{"term": "축", "src": "solution", "quote": "대칭축은 $x=5$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}], "condition": [{"term": "최솟값", "src": "stem", "quote": "모든 실수 $x$에 대하여 $f(x)\\ge f(5)$"}]}, "reasons": {"method": "최솟값 조건으로 대칭축 x=5를 찾아 ㄱ, ㄴ, ㄷ을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 삼차다항식 \$P(x)=(ax+2)(x^2-x-b)+5\$에 대하여 \$P(x+1)\$을 \$x^2-1\$로 나눈 나머지가 \$3\$일 때, \$\|12a+b\|\$의 값을 구하시오. (단, \$a\$, \$b\$는 상수이다.)

### 선지

① \$19\$ ② \$20\$ ③ \$21\$ ④ \$22\$ ⑤ \$23\$

### 정답

⑤

### 해설

\$F(x)=P(x+1)\$이라 하면 \$F(x)\$를 \$x^2-1=(x-1)(x+1)\$로 나눈 나머지가 상수 \$3\$이므로 \$F(1)=3\$, \$F(-1)=3\$, 즉 \$P(2)=3\$, \$P(0)=3\$이다. \$P(0)=2(-b)+5=3\$에서 \$-2b=-2\$이므로 \$b=1\$이다. \$P(2)=(2a+2)(2^2-2-1)+5=(2a+2)+5=2a+7=3\$에서 \$2a=-4\$이므로 \$a=-2\$이다. 따라서 \$\|12a+b\|=\|12(-2)+1\|=\|-23\|=23\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리로 P(0)=3, P(2)=3을 얻어 미정계수 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$P(x+1)$을 $x^2-1$로 나눈 나머지가 $3$이므로 $x=1, -1$을 대입해 $P(2)=3, P(0)=3$을 얻어 $b, a$를 구한다.", "decisiveStep": "$P(x+1)$에 $x=1, -1$을 대입해 $P(2), P(0)$ 조건으로 환원한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010 (FAMILY_ACTIVE): 합성 제수 x^2-1에 x=1, -1을 대입하는 나머지 조건 결합"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합성식 $P(x+1)$에 $x^2-1$의 근을 대입해 미정계수를 순차 결정하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "단, $a$, $b$는 상수이다"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "P(2)=3$, $P(0)=3$이다", "evidenceType": "IMPLIED", "justification": "x^2-1의 두 근 x=1, -1을 대입하는 나머지정리로 P(2)=3, P(0)=3을 얻음"}], "given": [{"term": "삼차식", "src": "stem", "quote": "삼차다항식 $P(x)=(ax+2)(x^2-x-b)+5$"}], "condition": []}, "reasons": {"method": "나머지정리로 P(0)=3, P(2)=3을 얻어 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.2

### 발문

이차방정식 \$x^2-9x+6=0\$의 두 실근을 \$\\alpha\$, \$\\beta\$ (\$\\alpha\<\\beta\$)라 하자. 그림과 같이 \$\\overline{AB}=\\alpha\$, \$\\overline{BC}=\\beta\$인 직각삼각형 \$ABC\$에 내접하는 정사각형의 한 변의 길이와 넓이가 두 근인 이차방정식이 \$27x^2+mx+n=0\$일 때, \$\|m+n\|\$의 값은? (단, 정사각형의 두 변은 선분 \$AB\$와 선분 \$BC\$ 위에 있다.)

### 선지

① \$18\$ ② \$20\$ ③ \$22\$ ④ \$24\$ ⑤ \$26\$

### 정답

③

### 해설

이차방정식 \$x^2-9x+6=0\$에서 근과 계수의 관계에 의하여 \$\\alpha+\\beta=9\$, \$\\alpha\\beta=6\$이다. 직각삼각형 \$ABC\$에 내접하는 정사각형의 한 변의 길이를 \$s\$라 하면, 닮은 직각삼각형의 비례식에 의하여 \$\$ \\dfrac{s}{\\beta} \= \\dfrac{\\alpha-s}{\\alpha} \\implies \\alpha s \= \\alpha\\beta - \\beta s \\implies (\\alpha+\\beta)s \= \\alpha\\beta \$\$ 이므로 \$s \= \\dfrac{\\alpha\\beta}{\\alpha+\\beta} \= \\dfrac{6}{9} \= \\dfrac{2}{3}\$이고, 정사각형의 넓이는 \$s^2 \= \\dfrac{4}{9}\$이다. 두 수 \$\\dfrac{2}{3}\$, \$\\dfrac{4}{9}\$를 근으로 하고 \$x^2\$의 계수가 \$27\$인 이차방정식은 \$\$ 27\\left(x-\\dfrac{2}{3}\\right)\\left(x-\\dfrac{4}{9}\\right) \= 27\\left(x^2-\\dfrac{10}{9}x+\\dfrac{8}{27}\\right) \= 27x^2-30x+8 \= 0 \$\$ 이므로 \$m=-30\$, \$n=8\$이다. 따라서 \$\|m+n\|=\|-30+8\|=22\$이다.

```
{"status": "READY", "pattern": "construction-spike-v1", "viewBox": "0 0 360 300", "elements": [{"type": "polygon", "id": "triangle_ABC", "points": [[60, 240], [60, 80], [300, 240]], "labels": ["B", "A", "C"]}, {"type": "polygon", "id": "inscribed_square", "points": [[60, 240], [60, 144], [156, 144], [156, 240]], "fill": "none"}, {"type": "right_angle", "vertex": [60, 240]}, {"type": "label", "pos": [42, 160], "text": "$\\alpha$"}, {"type": "label", "pos": [180, 260], "text": "$\\beta$"}], "note": "각 B가 직각이고 AB=alpha, BC=beta인 직각삼각형 ABC의 두 변 AB, BC에 두 변이 놓인 내접 정사각형 도식"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계로 $\\alpha+\\beta=9, \\alpha\\beta=6$을 구하고 닮음 비례식으로 정사각형 한 변 $s=\\frac{\\alpha\\beta}{\\alpha+\\beta}$를 구해 $s, s^2$을 두 근으로 하는 이차방정식을 세운다.", "decisiveStep": "닮음 비례식 $\\frac{s}{\\beta}=\\frac{\\alpha-s}{\\alpha}$에서 $s=\\frac{\\alpha\\beta}{\\alpha+\\beta}=\\frac{2}{3}$을 유도한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030 (DIRECT_BINDING_GAP): 근과 계수의 관계와 닮음으로 구한 변·넓이를 두 근으로 하는 이차방정식 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계, 직각삼각형 내접 정사각형의 닮음, 두 근을 이용한 이차방정식 작성이 결합된 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "두 근인 이차방정식이 $27x^2+mx+n=0$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $ABC$"}], "condition": [{"term": "내접", "src": "stem", "quote": "내접하는 정사각형"}]}, "reasons": {"method": "근과 계수의 관계와 닮음 비례식으로 정사각형 변·넓이를 두 근으로 하는 이차방정식을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q16

- 형식: 객관식  
- 배점: 3.5

### 발문

삼차다항식 \$f(x)\$에 대하여 \$f(x)\$는 \$x^2-1\$로 나누어떨어지고, \$f(x^3+1)\$을 \$x^2-1\$로 나누면 나머지는 \$6x+9\$이다. \$f(3)\$의 값은?

### 선지

① \$48\$ ② \$56\$ ③ \$64\$ ④ \$72\$ ⑤ \$80\$

### 정답

④

### 해설

삼차다항식 \$f(x)\$가 \$x^2-1\$로 나누어떨어지므로 \$f(x)=k(x^2-1)(x-r)\$ (\$k\\ne 0\$)이라 놓을 수 있다. \$f(x^3+1)\$을 \$x^2-1\$로 나눈 나머지가 \$6x+9\$이므로 \$x=1, \-1\$을 대입하면 \$\$ f(1^3+1) \= f(2) \= 6(1)+9 \= 15, \\qquad f((-1)^3+1) \= f(0) \= 6(-1)+9 \= 3 \$\$ 이다. 한편 \$\$ f(0) \= k(-1)(-r) \= kr \= 3, \\qquad f(2) \= k(4-1)(2-r) \= 6k-3kr \= 15 \$\$ 이므로 \$kr=3\$을 대입하면 \$6k-9=15 \\implies 6k=24 \\implies k=4\$이고, \$r=\\dfrac{3}{4}\$이다. 따라서 \$f(3) \= 4(3^2-1)\\left(3-\\dfrac{3}{4}\\right) \= 4\\cdot 8\\cdot\\dfrac{9}{4} \= 72\$이다.

```
{"status": "EXEMPT", "reason": "합성식 f(x^3+1)에 x=1, -1을 대입해 f(2), f(0) 값을 얻어 f(x)를 결정하는 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$f(x)=k(x^2-1)(x-r)$로 두고 $f(x^3+1)$에 $x=1, -1$을 대입해 얻은 $f(2)=15, f(0)=3$을 연립해 $k, r$을 구한다.", "decisiveStep": "$kr=3$을 $6k-3kr=15$에 대입해 $k=4$를 바로 결정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010 (FAMILY_ACTIVE): 합성 제수 x^2-1의 두 근 x=1, -1 대입 나머지 조건 결합"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수 설정과 합성식 나머지정리 대입을 결합해 미정계수를 연립으로 구하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "x=1, -1$을 대입하면", "evidenceType": "IMPLIED", "justification": "나누는 식 x^2-1의 두 근 x=1, -1을 대입해 f(2)와 f(0)의 값을 구함"}], "given": [{"term": "삼차식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "f(x)=k(x^2-1)(x-r) 설정 후 x=1, -1 대입으로 k, r을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.3

### 발문

연립방정식 \$\\begin{cases}x+y=-4\\x^2+y^2=a+2\\end{cases}\$의 해가 오직 한 쌍 \$x=b\$, \$y=c\$만 가질 때, \$ab-3c\$의 값은? (단, \$a\$는 상수이다.)

### 선지

① \$-8\$ ② \$-6\$ ③ \$-4\$ ④ \$4\$ ⑤ \$6\$

### 정답

②

### 해설

두 실수 \$x, y\$에 대하여 \$(x-y)^2\\ge 0\$이므로 \$x^2+y^2\\ge 2xy\$이고, \$\$ (x+y)^2 \= x^2+y^2+2xy \\le 2(x^2+y^2) \$\$ 이다. \$x+y=-4\$를 대입하면 \$16 \\le 2(x^2+y^2)\$, 즉 \$x^2+y^2 \\ge 8\$이다. 등호는 \$x=y\$일 때 성립하므로 \$x+y=-4\$와 연립하면 \$x=y=-2\$이다. 연립방정식의 해가 오직 한 쌍뿐이므로 \$a+2=8 \\implies a=6\$이고 \$b=-2, c=-2\$이다. 따라서 \$ab-3c \= 6(-2)-3(-2) \= \-12+6 \= \-6\$이다.

```
{"status": "EXEMPT", "reason": "연립이차방정식이 오직 한 쌍의 해를 가질 조건을 대칭성 및 완전제곱 부등식으로 푸는 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-SUBSTITUTION_SYSTEM", "conceptClusterKey": null, "primaryMethod": "$(x+y)^2\\le 2(x^2+y^2)$을 이용해 $x^2+y^2\\ge 8$의 최솟값과 등호 조건 $x=y=-2$에서 유일한 해를 구한다.", "decisiveStep": "해가 오직 한 쌍이려면 $x^2+y^2=a+2$가 최솟값 $8$과 같아야 함을 포착한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "연립방정식", "l4": "대칭식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_SYSTEM_EQUATION", "templateKey": "TPL_H1_SYSTEM_BRANCH_COMMON_ROOT", "why": "high1.json H1-RPM-042 (DIRECT_ACTIVE): 대칭 연립이차방정식의 유일해 조건을 대칭성으로 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "대칭 연립방정식의 유일해 조건을 등호 성립 경계 $x=y$로 판정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "단, $a$는 상수이다"}], "method": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식", "evidenceType": "NAMED"}], "given": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식"}], "condition": [{"term": "등식", "src": "stem", "quote": "x+y=-4"}]}, "reasons": {"method": "부등식 (x+y)^2<=2(x^2+y^2)의 등호 조건으로 유일해와 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 5.1

### 발문

\$x\$에 대한 등식 \$(x^3+2x^2-3x)^5=a\_0+a\_1x+a\_2x^2+\\cdots+a\_{15}x^{15}\$이 모든 실수 \$x\$에 대하여 성립할 때, \$a\_4+a\_7+a\_9+a\_{11}+a\_{13}\$의 값은? (단, \$a\_0, a\_1, a\_2, \\cdots, a\_{15}\$는 상수이다.)

### 선지

① \$-512\$ ② \$-271\$ ③ \$-270\$ ④ \$-269\$ ⑤ \$270\$

### 정답

③

### 해설

\$(x^3+2x^2-3x)^5 \= x^5(x^2+2x-3)^5\$이므로 \$(x^2+2x-3)^5 \= b\_0+b\_1x+\\cdots+b\_{10}x^{10}\$이라 두면 \$a\_4=0\$이고 \$a\_7=b\_2, a\_9=b\_4, a\_{11}=b\_6, a\_{13}=b\_8\$이다. 즉, 구하는 값은 \$b\_2+b\_4+b\_6+b\_8\$이다. \$G(x)=(x^2+2x-3)^5\$이라 하면 \$\$ G(1) \= (1+2-3)^5 \= 0, \\qquad G(-1) \= (1-2-3)^5 \= (-4)^5 \= \-1024 \$\$ 이다. \$G(1)+G(-1)\$을 구하면 홀수차항이 소거되어 \$\$ 2(b\_0+b\_2+b\_4+b\_6+b\_8+b\_{10}) \= \-1024 \\implies b\_0+b\_2+b\_4+b\_6+b\_8+b\_{10} \= \-512 \$\$ 이다. 여기서 상수항 \$b\_0=(-3)^5=-243\$이고 최고차항 계수 \$b\_{10}=1\$이므로 \$\$ b\_2+b\_4+b\_6+b\_8 \= \-512 - (-243) - 1 \= \-270 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "x^5을 묶어낸 뒤 G(1)+G(-1)로 짝수차항 계수의 합을 구하고 b_0, b_10을 빼는 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$x^5$을 묶어 $G(x)=(x^2+2x-3)^5$의 $b_2+b_4+b_6+b_8$로 바꾼 뒤 $\\frac{G(1)+G(-1)}{2}$에서 $b_0, b_{10}$을 뺀다.", "decisiveStep": "$a_4=0$과 $a_7, a_9, a_{11}, a_{13}$이 $G(x)$의 짝수차 계수 $b_2, b_4, b_6, b_8$에 대응함을 파악한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008 (DIRECT_ACTIVE): x=1, -1 수치대입으로 짝수차항 계수 합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수 $x^5$ 분리, 항등식 수치대입 $x=\\pm 1$, 양 끝 계수 $b_0, b_{10}$ 제거가 결합된 중상 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "$a_4+a_7+a_9+a_{11}+a_{13}$의 값은"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "G(1)+G(-1)$을 구하면", "evidenceType": "IMPLIED", "justification": "G(x)에 x=1과 x=-1을 대입해 짝수차항의 계수 합을 구함"}], "given": [{"term": "항등식", "src": "stem", "quote": "모든 실수 $x$에 대하여 성립할 때"}], "condition": []}, "reasons": {"method": "x^5을 묶어내고 G(1), G(-1) 수치대입으로 짝수차 계수 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 5.2

### 발문

어느 동아리에서 바자회 성금을 마련하기 위하여 수제 쿠키를 만들어 팔기로 하였다. 한 개당 \$1400\$원의 이익을 남기고 팔면 하루에 \$20\$개를 팔 수 있는데, 한 개당 이익금을 \$100\$원씩 줄일 때마다 하루에 \$5\$개씩 더 팔린다고 한다. 하루의 이익금이 최대일 때, 하루에 팔리는 쿠키의 개수는?

### 선지

① \$25\$ ② \$30\$ ③ \$35\$ ④ \$40\$ ⑤ \$45\$

### 정답

⑤

### 해설

한 개당 이익금을 \$100\$원씩 줄인 횟수를 \$t\$라 하면, 한 개당 이익금은 \$1400-100t\$원이고 하루 판매량은 \$20+5t\$개이다. 따라서 하루의 총이익금 \$P(t)\$는 \$\$ \\begin{aligned} P(t) &= (1400-100t)(20+5t) \\ &= \-500t^2+5000t+28000 \\ &= \-500(t-5)^2+40500 \\end{aligned} \$\$ 이다. \$t=5\$일 때 총이익금이 최대가 되며, 이때 하루에 팔리는 쿠키의 개수는 \$20+5\\cdot 5=45\$개이다.

```
{"status": "EXEMPT", "reason": "판매량과 단가 변화를 이차함수로 모델링해 최댓값일 때의 판매 개수를 구하는 실생활 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "가격 인하 횟수를 $t$로 두고 총이익 $P(t)=(1400-100t)(20+5t)$를 완전제곱식으로 고쳐 최대가 되는 $t=5$를 구한다.", "decisiveStep": "최대 이익금이 아니라 그때의 판매량 $20+5t$를 묻는 것임을 확인해 $45$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038 (DIRECT_ACTIVE): 실생활 판매 단가·수량 조건을 이차함수로 모델링해 최대 지점 도출"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실생활 문장제에서 변수 $t$를 설정해 이차함수 최댓값 조건을 찾는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "쿠키의 개수는?"}], "method": [{"term": "이차함수", "src": "solution", "quote": "-500(t-5)^2+40500", "evidenceType": "IMPLIED", "justification": "총이익을 t에 대한 이차함수로 세우고 완전제곱식으로 최댓값 지점을 구함"}], "given": [{"term": "최댓값", "src": "stem", "quote": "이익금이 최대일 때"}], "condition": []}, "reasons": {"method": "인하 횟수 t에 대한 이차함수의 최댓값 지점 t=5에서 판매량을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 5

### 발문

이차방정식 \$x^2+4x+5=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, 다음 조건을 만족시키는 이차식 \$f(x)\$에 대하여 이차방정식 \$f(x)=0\$의 두 근이 \$p\$, \$q\$일 때, \$\|p-q\|\$의 값은?

(가) \$\\alpha=f(\\beta)\$ (나) \$\\beta=f(\\alpha)\$ (다) \$f(0)=6\$

### 선지

① \$0\$ ② \$\\dfrac{1}{4}\$ ③ \$\\dfrac{1}{3}\$ ④ \$\\dfrac{1}{2}\$ ⑤ \$1\$

### 정답

④

### 해설

이차방정식 \$x^2+4x+5=0\$의 두 근 \$\\alpha, \\beta\$는 \$\\alpha\\ne \\beta\$이고 \$\$ \\alpha^2=-4\\alpha-5, \\qquad \\beta^2=-4\\beta-5, \\qquad \\alpha+\\beta=-4 \$\$ 을 만족한다. 조건 (다)에서 \$f(0)=6\$이므로 \$f(x)=ux^2+vx+6\$ (\$u\\ne 0\$)이라 두자. 조건 (가) \$\\alpha=f(\\beta)\$에 대입하면 \$\$ \-4-\\beta \= u(-4\\beta-5)+v\\beta+6 \= (v-4u)\\beta+6-5u \$\$ 이므로 \$(v-4u+1)\\beta+(10-5u)=0\$이다. 같은 방법으로 조건 (나)에서 \$\$ (v-4u+1)\\alpha+(10-5u)=0 \$\$ 을 얻는다. \$\\alpha\\ne \\beta\$이므로 두 식을 빼면 \$(v-4u+1)(\\beta-\\alpha)=0\$에서 \$v-4u+1=0\$이고 \$10-5u=0\$이다. 따라서 \$u=2\$, \$v=4u-1=7\$이므로 \$\$ f(x) \= 2x^2+7x+6 \= (2x+3)(x+2) \$\$ 이다. \$f(x)=0\$의 두 근은 \$-\\dfrac{3}{2}, \-2\$이므로 \$\|p-q\|=\\left\|-\\dfrac{3}{2}-(-2)\\right\|=\\dfrac{1}{2}\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식 두 근의 차수 낮추기와 합을 이용해 f(beta)=alpha 조건에서 f(x)를 결정하는 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha^2=-4\\alpha-5$와 $\\alpha+\\beta=-4$로 $f(\\beta)=\\alpha$를 일차식 $(v-4u+1)\\beta+(10-5u)=0$으로 줄여 $f(x)$를 구한다.", "decisiveStep": "$\\alpha\\ne \\beta$이므로 일차항 계수와 상수항이 모두 $0$이어야 함을 이용해 $u=2, v=7$을 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030 (DIRECT_BINDING_GAP): 근과 계수의 관계와 차수 낮추기로 이차식 f(x) 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 차수 낮추기, 근의 합 치환, 항등 계수 소거를 결합해 이차식을 결정하는 심화 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차식", "src": "stem", "quote": "이차식 $f(x)$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "\\alpha+\\beta=-4", "evidenceType": "IMPLIED", "justification": "근과 계수의 관계와 차수 낮추기로 f(beta)=alpha를 일차 항등 조건으로 변환함"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+4x+5=0$"}], "condition": []}, "reasons": {"method": "차수 낮추기와 alpha+beta=-4로 f(x)=2x^2+7x+6을 결정함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q21

- 형식: 서답형  
- 배점: 10

### 발문

최고차항의 계수가 \$1\$인 사차식 \$f(x)\$가 \$f(1)=f(-1)=4\$, \$f(2)=f(-2)=1\$을 만족시킨다. 다음 물음에 답하시오. (1) \$f(x)\$를 구하시오. (2) \$k\\ne 2, \-2\$인 정수일 때, \$f(k)\$가 소수가 아님을 설명하시오.

### 선지

없음

### 정답

(1) \$f(x)=x^4-6x^2+9\$; (2) 모든 정수 \$k\\ne\\pm 2\$에서 \$f(k)=(k^2-3)^2\$은 \$2\$ 이상의 정수의 제곱이므로 소수가 아니다.

### 해설

(1) 네 조건에서 \$x=\\pm 1\$일 때 함숫값이 \$4=5-1^2\$, \$x=\\pm 2\$일 때 함숫값이 \$1=5-2^2\$이므로 \$g(x)=f(x)-(5-x^2)\$이라 놓자. 그러면 \$g(1)=g(-1)=g(2)=g(-2)=0\$이고 \$g(x)\$는 최고차항의 계수가 \$1\$인 사차식이므로 \$\$ g(x) \= (x-1)(x+1)(x-2)(x+2) \= (x^2-1)(x^2-4) \= x^4-5x^2+4 \$\$ 이다. 따라서 \$\$ f(x) \= g(x)+(5-x^2) \= x^4-6x^2+9 \= (x^2-3)^2 \$\$ 이다. (2) \$k\\ne \\pm 2\$인 정수에 대하여 \$f(k)=(k^2-3)^2\$이다.

- \$k=0\$이면 \$f(0)=(-3)^2=9\$로 소수가 아니다.  
- \$k=\\pm 1\$이면 \$f(\\pm 1)=(1-3)^2=4\$로 소수가 아니다.  
- \$\|k\|\\ge 3\$이면 \$k^2\\ge 9\$이므로 \$k^2-3\\ge 6\$이고, \$f(k)=(k^2-3)^2\$은 \$6\$ 이상의 정수 \$k^2-3\$ 두 개의 곱이므로 합성수이다. 따라서 \$k\\ne \\pm 2\$인 모든 정수 \$k\$에 대하여 \$f(k)\$는 소수가 아니다.

```
{"status": "EXEMPT", "reason": "사차식의 함숫값 규칙으로 f(x)-(5-x^2)을 인수분해하고 제곱식 꼴로 소수가 아님을 증명하는 서술형 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$g(x)=f(x)-(5-x^2)$을 도입해 $g(\\pm 1)=g(\\pm 2)=0$으로 $f(x)=(x^2-3)^2$을 구한 뒤 정수 대입 시 합성수임을 보인다.", "decisiveStep": "네 조건 $f(\\pm 1)=4, f(\\pm 2)=1$을 $5-x^2$으로 연결해 인수정리를 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012 (RPM_ONLY): 보조식 g(x)=f(x)-(5-x^2)에 인수정리를 적용해 f(x) 결정, ACTIVE 매핑 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "보조 다항식 $f(x)-(5-x^2)$ 설정과 완전제곱식 변환을 이용한 정수론적 판정이 결합된 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "사차식", "src": "stem", "quote": "사차식 $f(x)$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "g(1)=g(-1)=g(2)=g(-2)=0", "evidenceType": "IMPLIED", "justification": "보조식 g(x)=f(x)-(5-x^2)의 네 근을 인수정리로 인수분해함"}], "given": [{"term": "사차식", "src": "stem", "quote": "사차식 $f(x)$"}], "condition": [{"term": "정수", "src": "stem", "quote": "$k\\ne 2, -2$인 정수일 때"}]}, "reasons": {"method": "보조식 g(x)에 인수정리를 적용해 f(x)=(x^2-3)^2을 구하고 소수가 아님을 보임"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q22

- 형식: 서답형  
- 배점: 10

### 발문

이차함수 \$f(x)=x^2-6ax-b^2+6b+5\$가 \$f(0)=f(4)\$이고, 직선 \$y=cx+14\$와 한 점에서 만날 때, 세 실수 \$a\$, \$b\$, \$c\$에 대하여 \$abc\$의 값을 구하시오.

### 선지

없음

### 정답

\$-8\$

### 해설

\$f(0)=f(4)\$에서 \$\$ \-b^2+6b+5 \= 16-24a-b^2+6b+5 \\implies 24a \= 16 \\implies a \= \\dfrac{2}{3} \$\$ 이다. 이차함수 \$y=f(x)\$와 직선 \$y=cx+14\$가 한 점에서 만나므로 이차방정식 \$\$ x^2-6ax-b^2+6b+5 \= cx+14 \$\$ 이 중근을 가져야 한다. \$a=\\dfrac{2}{3}\$를 대입하여 정리하면 \$\$ x^2-(4+c)x-(b^2-6b+9) \= 0 \\iff x^2-(4+c)x-(b-3)^2 \= 0 \$\$ 이다. 이 방정식이 중근을 가지므로 판별식 \$D=0\$이다. \$\$ D \= (4+c)^2+4(b-3)^2 \= 0 \$\$ \$b, c\$는 실수이므로 실수의 제곱의 합이 \$0\$이 되려면 \$4+c=0\$, \$b-3=0\$이어야 한다. 따라서 \$c=-4\$, \$b=3\$이다. 그러므로 \$abc \= \\dfrac{2}{3}\\cdot 3\\cdot (-4) \= \-8\$이다.

```
{"status": "EXEMPT", "reason": "함숫값 조건으로 a를 구하고 접점 판별식 D=0이 실수 제곱합=0이 됨을 이용해 b, c를 구하는 서술형 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$f(0)=f(4)$로 $a=\\frac{2}{3}$을 구한 뒤 직선과의 교점 판별식 $(4+c)^2+4(b-3)^2=0$에서 실수 제곱 성질로 $b, c$를 결정한다.", "decisiveStep": "판별식 $D=(4+c)^2+4(b-3)^2=0$을 실수의 제곱합이 $0$인 부정방정식으로 해석한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036 (DIRECT_ACTIVE): 이차함수와 직선의 접선 조건(판별식 D=0)으로 미정계수 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 접점 판별식과 실수 제곱의 합이 $0$인 성질을 결합한 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "세 실수 $a$, $b$, $c$에 대하여"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2-6ax-b^2+6b+5$"}], "condition": [{"term": "접함", "src": "stem", "quote": "직선 $y=cx+14$와 한 점에서 만날 때"}]}, "reasons": {"method": "f(0)=f(4)와 직선 접점 판별식 D=0의 실수 제곱합 조건으로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

