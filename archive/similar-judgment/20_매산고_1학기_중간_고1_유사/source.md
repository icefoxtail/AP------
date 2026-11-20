

```
{"stem": "20_매산고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/20_매산고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 20, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

세 다항식 \$A=3x^3-x^2+4x+1\$, \$B=x^3+3x^2-x+2\$, \$C=-2x^3+x^2-2x+3\$에 대하여 \$A+2B-C\$를 계산할 때, \$x\$의 계수는?

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

②

### 해설

\$A+2B-C\$에서 \$x\$의 계수는 각 다항식의 \$x\$항의 계수만 모아서 계산하면 된다.

- \$A\$의 \$x\$의 계수: \$4\$  
- \$2B\$의 \$x\$의 계수: \$2\\cdot(-1)=-2\$  
- \$-C\$의 \$x\$의 계수: \$-(-2)=2\$ 따라서 \$A+2B-C\$의 \$x\$의 계수는 \$4+(-2)+2=4\$이다.

```
{"status": "EXEMPT", "reason": "세 다항식의 일차 결합에서 특정 항의 계수만 추출해 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$A, B, C$에서 $x$항의 계수 $4, -1, -2$만 추출해 $4+2(-1)-(-2)$를 계산한다.", "decisiveStep": "전체를 전개하지 않고 $x$의 계수만 선별해 부호를 반영하여 더한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "차수·계수 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-001(DIRECT_ACTIVE) 기준 다항식의 덧셈·뺄셈에서 x항 계수 정리 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 덧셈·뺄셈에서 특정 차수의 계수만 바로 계산하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "$x$의 계수는?"}], "method": [{"term": "동류항", "src": "solution", "quote": "각 다항식의 $x$항의 계수만 모아서", "evidenceType": "IMPLIED", "justification": "x항의 동류항 계수만 모아서 일차 결합을 계산함"}], "given": [{"term": "다항식", "src": "stem", "quote": "세 다항식 $A=3x^3-x^2+4x+1$"}], "condition": []}, "reasons": {"method": "세 다항식의 x항 계수만 추출해 4+2(-1)-(-2)를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.9

### 발문

다항식 \$x^3+4x-2\$를 \$x-2\$로 나눈 나머지는?

### 선지

① \$8\$ ② \$10\$ ③ \$12\$ ④ \$14\$ ⑤ \$16\$

### 정답

④

### 해설

\$f(x)=x^3+4x-2\$라 하면 나머지정리에 의하여 \$x-2\$로 나눈 나머지는 \$f(2)\$이다. \$\$ f(2) \= 2^3+4\\cdot 2-2 \= 8+8-2 \= 14 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "나머지정리 f(2)를 한 번 적용해 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리에 따라 다항식 $f(x)=x^3+4x-2$에 $x=2$를 대입해 나머지 $f(2)$를 구한다.", "decisiveStep": "일차식 $x-2$로 나눈 나머지가 $f(2)$임을 바로 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009(RPM_ONLY) 기준 일차식으로 나눈 나머지정리 문항으로 ACTIVE 매핑 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리를 한 번 직접 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지는?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^3+4x-2$"}], "condition": []}, "reasons": {"method": "나머지정리 f(2)를 적용해 14를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$y=x^2+ax-8\$의 그래프와 \$x\$축의 교점의 \$x\$좌표가 \$2\$, \$b\$일 때, 상수 \$a\$, \$b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

①

### 해설

이차함수 \$y=x^2+ax-8\$의 그래프와 \$x\$축의 교점의 \$x\$좌표는 이차방정식 \$x^2+ax-8=0\$의 두 실근이므로 두 근이 \$2, b\$이다. 근과 계수의 관계에 의하여 \$\$ 2b \= \-8 \\implies b \= \-4, \\qquad 2+b \= \-a \\implies 2-4 \= \-a \\implies a \= 2 \$\$ 이다. 따라서 \$a+b \= 2+(-4) \= \-2\$이다.

```
{"status": "EXEMPT", "reason": "이차함수의 x절편을 이차방정식의 두 근으로 해석해 근과 계수의 관계를 적용하는 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$x$축과의 교점 $x$좌표 $2, b$가 $x^2+ax-8=0$의 두 근임을 이용해 근과 계수의 관계로 $b, a$를 구한다.", "decisiveStep": "두 근의 곱 $2b=-8$에서 $b=-4$를 먼저 구한 뒤 합 $2+b=-a$로 $a=2$를 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE) 기준 이차함수 그래프와 x축 교점 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$절편과 이차방정식의 근과 계수의 관계를 연결하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$에 대하여 $a+b$의 값은"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+ax-8$"}], "condition": []}, "reasons": {"method": "x축 교점을 이차방정식 근으로 보고 근과 계수의 관계로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.1

### 발문

다음 중 인수분해가 잘못된 것은?

### 선지

① \$27x^3+27x^2+9x+1=(3x+1)^3\$ ② \$x^3+27=(x+3)(x^2-3x+9)\$ ③ \$3x^3-2x^2+4x-5=(x-1)(3x^2+x+5)\$ ④ \$x^2+4y^2+z^2-4xy-4yz+2zx=(x-2y+z)^2\$ ⑤ \$x^4+x^2+1=(x^2+1)^2\$

### 정답

⑤

### 해설

- ① \$(3x+1)^3 \= 27x^3+27x^2+9x+1\$ (옳음)  
- ② \$x^3+3^3 \= (x+3)(x^2-3x+9)\$ (옳음)  
- ③ \$(x-1)(3x^2+x+5) \= 3x^3-2x^2+4x-5\$ (옳음)  
- ④ \$(x-2y+z)^2 \= x^2+4y^2+z^2-4xy-4yz+2zx\$ (옳음)  
- ⑤ \$(x^2+1)^2 \= x^4+2x^2+1\$이므로 \$x^4+x^2+1\$과 \$x^2\$의 계수가 다르다. (바른 인수분해는 \$(x^2+x+1)(x^2-x+1)\$) 따라서 잘못된 것은 ⑤이다.

```
{"status": "EXEMPT", "reason": "인수분해 공식과 전개를 비교해 잘못된 등식을 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "다섯 보기의 우변을 곱셈 공식으로 전개해 좌변의 계수와 일치하지 않는 등식을 찾는다.", "decisiveStep": "⑤의 우변 $(x^2+1)^2=x^4+2x^2+1$이 좌변의 $x^2$ 계수 $1$과 다름을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "제곱식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-015(DIRECT_ACTIVE) 기준 인수분해 공식 판별 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기본 인수분해 공식 5가지를 전개와 대조해 오류를 판별하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해가 잘못된 것은?"}], "method": [{"term": "전개", "src": "solution", "quote": "x^4+2x^2+1", "evidenceType": "IMPLIED", "justification": "각 보기의 우변을 전개하여 좌변과 계수를 비교함"}], "given": [{"term": "다항식", "src": "choices", "quote": "$x^4+x^2+1=(x^2+1)^2$"}], "condition": []}, "reasons": {"method": "보기 우변을 전개해 좌변과 계수가 다른 ⑤를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.2

### 발문

다항식 \$2x^4-3x^2+7\$을 \$x-3\$으로 나누었을 때의 몫과 나머지를 각각 \$Q(x)\$, \$R\$이라 할 때, 다항식 \$2x^4-3x^2+7\$을 \$3x-9\$로 나누었을 때의 몫과 나머지를 순서대로 구하면?

### 선지

① \$Q(x),;R\$ ② \$3Q(x),;R\$ ③ \$\\dfrac{1}{3}Q(x),;R\$ ④ \$\\dfrac{1}{3}Q(x),;\\dfrac{1}{3}R\$ ⑤ \$3Q(x),;3R\$

### 정답

③

### 해설

주어진 나눗셈 항등식은 \$\$ 2x^4-3x^2+7 \= (x-3)Q(x)+R \$\$ 이다. \$3x-9 \= 3(x-3)\$이므로 \$x-3 \= \\dfrac{1}{3}(3x-9)\$를 대입하면 \$\$ 2x^4-3x^2+7 \= (3x-9)\\cdot\\dfrac{1}{3}Q(x)+R \$\$ 이다. 따라서 \$3x-9\$로 나누었을 때의 몫은 \$\\dfrac{1}{3}Q(x)\$이고 나머지는 \$R\$이다.

```
{"status": "EXEMPT", "reason": "나눗셈 항등식에서 제수의 상수배 변형에 따른 몫과 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "$2x^4-3x^2+7=(x-3)Q(x)+R$에서 $x-3=\\frac{1}{3}(3x-9)$를 대입해 몫과 나머지를 읽는다.", "decisiveStep": "제수가 $3$배가 될 때 몫은 $\\frac{1}{3}$배가 되고 나머지 $R$은 그대로 유지됨을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE) 기준 다항식 나눗셈의 몫과 나머지 변형 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나눗셈 항등식의 제수 상수배 변형을 통해 몫과 나머지를 구하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫과 나머지를 순서대로"}], "method": [{"term": "항등식", "src": "solution", "quote": "주어진 나눗셈 항등식은", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $2x^4-3x^2+7$"}], "condition": []}, "reasons": {"method": "나눗셈 항등식을 (3x-9) 기준으로 변형해 몫과 나머지를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.3

### 발문

이차함수 \$y=x^2+(2k+a+2)x+k^2-b\$의 그래프가 실수 \$k\$의 값에 관계없이 항상 직선 \$y=2x-3\$과 접할 때, 상수 \$a\$, \$b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

①

### 해설

이차함수와 직선이 접하므로 연립방정식 \$\$ x^2+(2k+a+2)x+k^2-b \= 2x-3 \\iff x^2+(2k+a)x+k^2-b+3 \= 0 \$\$ 이 중근을 가져야 한다. 판별식 \$D=0\$에서 \$\$ D \= (2k+a)^2-4(k^2-b+3) \= 4ak+a^2+4b-12 \= 0 \$\$ 이다. 이 등식이 실수 \$k\$의 값에 관계없이 항상 성립하므로 \$k\$에 대한 항등식의 성질에 의해 \$\$ 4a=0, \\qquad a^2+4b-12=0 \$\$ 따라서 \$a=0\$, \$b=3\$이므로 \$a+b=0+3=3\$이다.

```
{"status": "EXEMPT", "reason": "접점 판별식 D=0이 k에 대한 항등식이 되도록 계수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 식을 연립한 방정식의 판별식 $D=4ak+a^2+4b-12=0$이 $k$에 대한 항등식이 되도록 $4a=0, a^2+4b-12=0$을 푼다.", "decisiveStep": "판별식을 $k$에 대해 내림차순 정리한 뒤 $k$의 계수와 상수항을 모두 $0$으로 둔다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE) 기준 포물선과 직선의 접선 조건 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "접점 조건 $D=0$과 $k$에 대한 항등식 조건을 순서대로 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$에 대하여 $a+b$의 값은"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$에서", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+(2k+a+2)x+k^2-b$"}], "condition": [{"term": "접함", "src": "stem", "quote": "항상 직선 $y=2x-3$과 접할 때"}]}, "reasons": {"method": "연립방정식의 판별식 D=0을 k에 대한 항등식으로 풀어 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.3

### 발문

이차방정식 \$x^2-3x+a=0\$의 두 근이 \$\\alpha\$, \$\\beta\$이고, 이차방정식 \$x^2+x-b=0\$의 두 근이 \$\\alpha+\\beta\$, \$\\alpha\\beta\$일 때, 실수 \$a\$, \$b\$에 대하여 \$ab\$의 값은?

### 선지

① \$-60\$ ② \$-56\$ ③ \$-52\$ ④ \$-48\$ ⑤ \$-44\$

### 정답

④

### 해설

첫째 이차방정식 \$x^2-3x+a=0\$에서 근과 계수의 관계에 의하여 \$\\alpha+\\beta=3\$, \$\\alpha\\beta=a\$이다. 둘째 이차방정식 \$x^2+x-b=0\$의 두 근이 \$3, a\$이므로 근과 계수의 관계에 의하여 \$\$ 3+a \= \-1 \\implies a \= \-4, \\qquad 3a \= \-b \\implies 3(-4) \= \-b \\implies b \= 12 \$\$ 이다. 따라서 \$ab \= (-4)\\cdot 12 \= \-48\$이다.

```
{"status": "EXEMPT", "reason": "두 이차방정식에 근과 계수의 관계를 연속 적용해 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "첫째 방정식에서 $\\alpha+\\beta=3, \\alpha\\beta=a$를 구하고, 이를 둘째 방정식의 두 근으로 두고 근과 계수의 관계를 다시 적용한다.", "decisiveStep": "두 근의 합 $3+a=-1$에서 $a=-4$를 구한 뒤 곱 $3a=-b$로 $b=12$를 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP) 기준 근과 계수의 관계로 이차방정식 계수를 결정하는 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계를 두 방정식에 연속 적용하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$, $b$에 대하여 $ab$의 값은"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-3x+a=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계를 두 이차방정식에 연속 적용해 ab=-48을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q08

- 형식: 객관식  
- 배점: 4.5

### 발문

다음은 조립제법을 이용하여 다항식 \$P(x)=2x^3+3x^2+2x+7\$을 \$2x-1\$로 나누었을 때의 몫과 나머지를 구하는 과정이다. \$\$ \\begin{array}{c\|rrrr} k & 2 & 3 & 2 & 7 \\ &   & a & b & c \\ \\hline & 2 & 4 & 4 & R \\end{array} \$\$ \$P(x)=(2x-1)Q(x)+R\$일 때, \$k\\times{Q(3)+R}\$의 값은? (단, \$a, b, c\$는 상수)

### 선지

① \$11\$ ② \$13\$ ③ \$15\$ ④ \$17\$ ⑤ \$19\$

### 정답

②

### 해설

조립제법의 각 단계에서 첫 계수 \$2\$를 내린 뒤 \$k\$를 곱해 다음 열에 더하므로 \$\$ a \= 2k, \\qquad 3+a \= 4 \\implies a \= 1 \\implies k \= \\dfrac{1}{2} \$\$ 이다. 계속해서 계산하면 \$\$ b \= 4k \= 4\\cdot\\dfrac{1}{2} \= 2, \\qquad c \= 4k \= 4\\cdot\\dfrac{1}{2} \= 2, \\qquad R \= 7+c \= 7+2 \= 9 \$\$ 이다. 아래 줄의 \$2, 4, 4\$는 \$x-\\dfrac{1}{2}\$로 나눈 몫 \$2x^2+4x+4\$의 계수이고, \$2x-1=2\\left(x-\\dfrac{1}{2}\\right)\$이므로 \$2x-1\$로 나눈 몫 \$Q(x)\$는 \$\$ Q(x) \= \\dfrac{1}{2}(2x^2+4x+4) \= x^2+2x+2 \$\$ 이다. 따라서 \$Q(3) \= 3^2+2\\cdot 3+2 \= 17\$이므로 \$\$ k{Q(3)+R} \= \\dfrac{1}{2}(17+9) \= 13 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "조립제법 연산 표를 발문 내 KaTeX array 수식 표로 직접 구현함"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "조립제법 표에서 $3+a=4$로 $a=1, k=\\frac{1}{2}$을 찾고, $2x-1=2(x-\\frac{1}{2})$이므로 아래 계수를 $2$로 나누어 $Q(x)$를 구한다.", "decisiveStep": "일차항 계수가 $2$인 $2x-1$로 나눈 몫 $Q(x)$가 조립제법 몫의 $\\frac{1}{2}$배임을 반영한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "다항식을 일차식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-005(DIRECT_ACTIVE) 기준 조립제법을 이용한 일차식 나눗셈 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조립제법의 빈칸 추론과 일차항 계수 $2$에 대한 몫 보정을 함께 묻는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫과 나머지를 구하는 과정"}], "method": [{"term": "다항식의나눗셈", "src": "stem", "quote": "조립제법을 이용하여", "evidenceType": "IMPLIED", "justification": "조립제법 표의 빈칸을 채우고 제수 2x-1에 맞게 몫을 보정함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)=2x^3+3x^2+2x+7$"}], "condition": []}, "reasons": {"method": "조립제법 표로 k, R을 구하고 2x-1에 맞게 Q(x)를 보정해 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.4

### 발문

등식 \$z^2=3+4\\sqrt{10}i\$를 만족시키는 복소수 \$z\$에 대하여 \$z\\bar{z}\$의 값은? (단, \$i=\\sqrt{-1}\$이고, \$\\bar{z}\$는 \$z\$의 켤레복소수이다.)

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$13\$

### 정답

⑤

### 해설

등식 \$z^2=3+4\\sqrt{10}i\$의 양변에 각각 켤레복소수를 취하면 \$\\overline{z^2} \= (\\bar{z})^2 \= 3-4\\sqrt{10}i\$이다. 두 식을 변끼리 곱하면 \$\$ (z\\bar{z})^2 \= z^2(\\bar{z})^2 \= (3+4\\sqrt{10}i)(3-4\\sqrt{10}i) \= 3^2-(4\\sqrt{10}i)^2 \= 9+160 \= 169 \= 13^2 \$\$ 이다. \$z=a+bi\$ (\$a, b\$는 실수)라 하면 \$z\\bar{z}=a^2+b^2\>0\$이므로 \$z\\bar{z}=13\$이다.

```
{"status": "EXEMPT", "reason": "켤레복소수의 곱 성질 (zzbar)^2 = z^2 * (zbar)^2를 이용해 zzbar를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "$z^2=3+4\\sqrt{10}i$와 그 켤레식 $(\\bar{z})^2=3-4\\sqrt{10}i$를 곱해 $(z\\bar{z})^2=169$를 얻고 양수인 $z\\bar{z}=13$을 구한다.", "decisiveStep": "$z$를 직접 구하지 않고 $(z\\bar{z})^2=z^2\\overline{z^2}$ 성질을 바로 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE) 기준 켤레복소수의 곱 계산 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수를 직접 풀지 않고 켤레복소수 곱의 성질로 $z\\bar{z}$를 바로 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "$z\\bar{z}$의 값은?"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "양변에 각각 켤레복소수를 취하면", "evidenceType": "NAMED"}], "given": [{"term": "등식", "src": "stem", "quote": "등식 $z^2=3+4\\sqrt{10}i$"}], "condition": []}, "reasons": {"method": "켤레복소수를 취해 곱함으로써 (zzbar)^2=169에서 zzbar=13을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.4

### 발문

삼차방정식 \$3x^3-114x+450=0\$의 세 근을 \$\\alpha\$, \$\\beta\$, \$\\gamma\$라 할 때, \$(\\alpha+\\beta)^3+(\\beta+\\gamma)^3+(\\gamma+\\alpha)^3\$의 값은?

### 선지

① \$150\$ ② \$300\$ ③ \$450\$ ④ \$600\$ ⑤ \$750\$

### 정답

③

### 해설

삼차방정식 \$3x^3-114x+450=0\$에서 \$x^2\$의 계수가 \$0\$이므로 근과 계수의 관계에 의하여 \$\$ \\alpha+\\beta+\\gamma \= 0, \\qquad \\alpha\\beta\\gamma \= \-\\dfrac{450}{3} \= \-150 \$\$ 이다. \$\\alpha+\\beta+\\gamma=0\$에서 \$\\alpha+\\beta=-\\gamma\$, \$\\beta+\\gamma=-\\alpha\$, \$\\gamma+\\alpha=-\\beta\$이므로 \$\$ (\\alpha+\\beta)^3+(\\beta+\\gamma)^3+(\\gamma+\\alpha)^3 \= \-(\\alpha^3+\\beta^3+\\gamma^3) \$\$ 이다. 항등식 \$\\alpha^3+\\beta^3+\\gamma^3-3\\alpha\\beta\\gamma \= (\\alpha+\\beta+\\gamma)(\\alpha^2+\\beta^2+\\gamma^2-\\alpha\\beta-\\beta\\gamma-\\gamma\\alpha)\$에 \$\\alpha+\\beta+\\gamma=0\$을 대입하면 \$\\alpha^3+\\beta^3+\\gamma^3=3\\alpha\\beta\\gamma\$이다. 따라서 구하는 값은 \$-3\\alpha\\beta\\gamma \= \-3(-150) \= 450\$이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 근과 계수의 관계와 세제곱 항등식으로 대칭식을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha+\\beta+\\gamma=0$을 이용해 구하는 식을 $-(\\alpha^3+\\beta^3+\\gamma^3)$으로 바꾸고 항등식 $\\alpha^3+\\beta^3+\\gamma^3=3\\alpha\\beta\\gamma$를 적용한다.", "decisiveStep": "$\\alpha+\\beta=-\\gamma$ 치환과 $\\alpha+\\beta+\\gamma=0$일 때 $\\sum \\alpha^3=3\\alpha\\beta\\gamma$ 성질을 결합한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY) 기준 삼차방정식의 근과 계수의 관계 활용 문항으로 ACTIVE 매핑 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식의 근의 합 $0$ 조건을 두 번 활용해 대칭식을 $-3\\alpha\\beta\\gamma$로 축약하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "\\alpha^3+\\beta^3+\\gamma^3-3\\alpha\\beta\\gamma"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $3x^3-114x+450=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계와 세제곱 항등식으로 -3(alpha*beta*gamma)=450을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q11

- 형식: 객관식  
- 배점: 4.5

### 발문

넓이가 \$18\$인 직각이등변삼각형 \$ABC\$의 세 변의 길이 \$a\$, \$b\$, \$c\$가 등식 \$(c+a-b)(a-b-c)=(a+b+c)(c-a-b)\$를 만족시킬 때, \$\\dfrac{ab}{c}\$의 값은?

### 선지

① \$2\\sqrt{2}\$ ② \$3\\sqrt{2}\$ ③ \$4\\sqrt{2}\$ ④ \$6\$ ⑤ \$6\\sqrt{2}\$

### 정답

②

### 해설

주어진 등식의 양변을 합차 공식으로 정리하면 \$\$ ((a-b)+c)((a-b)-c) \= (c+(a+b))(c-(a+b)) \$\$ \$\$ (a-b)^2-c^2 \= c^2-(a+b)^2 \\implies (a-b)^2+(a+b)^2 \= 2c^2 \$\$ 이다. 좌변을 전개하면 \$2(a^2+b^2)=2c^2\$, 즉 \$a^2+b^2=c^2\$이므로 \$c\$가 빗변이고 직각을 낀 두 변의 길이가 \$a, b\$이다. 직각이등변삼각형이므로 \$a=b\$이고, 넓이가 \$18\$이므로 \$\$ \\dfrac{1}{2}a^2 \= 18 \\implies a^2 \= 36 \\implies a \= b \= 6 \$\$ 이다. 따라서 \$c=\\sqrt{6^2+6^2}=6\\sqrt{2}\$이므로 \$\$ \\dfrac{ab}{c} \= \\dfrac{6\\cdot 6}{6\\sqrt{2}} \= \\dfrac{6}{\\sqrt{2}} \= 3\\sqrt{2} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "다항식 등식을 합차 공식으로 정리해 피타고라스 관계식을 도출하고 삼각형 넓이 조건으로 변의 길이를 구하는 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "등식 양변을 합차 공식으로 정리해 $a^2+b^2=c^2$을 얻고, 직각이등변삼각형 넓이 $18$로 $a=b=6, c=6\\sqrt{2}$를 구한다.", "decisiveStep": "$(a-b)^2+(a+b)^2=2c^2$을 전개해 $a^2+b^2=c^2$의 피타고라스 관계를 도출한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE) 기준 인수분해 조건식으로 삼각형 변 관계 도출 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합차 공식 인수분해 변형과 직각이등변삼각형의 넓이·빗변 조건을 결합한 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "직각이등변삼각형", "src": "stem", "quote": "직각이등변삼각형 $ABC$"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "합차 공식으로 정리하면", "evidenceType": "IMPLIED", "justification": "합차 공식과 완전제곱 전개를 이용해 a^2+b^2=c^2을 유도함"}], "given": [{"term": "넓이", "src": "stem", "quote": "넓이가 $18$인"}], "condition": [{"term": "등식", "src": "stem", "quote": "등식 $(c+a-b)(a-b-c)=(a+b+c)(c-a-b)$"}]}, "reasons": {"method": "등식을 합차 공식으로 정리해 a^2+b^2=c^2을 얻고 ab/c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.6

### 발문

복소수 \$z=a+bi\$ (\$a, b\$는 \$0\$이 아닌 실수)에 대하여 \$z^2-2z\$가 실수일 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? (단, \$i=\\sqrt{-1}\$이고, \$\\bar{z}\$는 \$z\$의 켤레복소수이다.)

\<보기\> ㄱ. \$\\overline{z^2}-2\\bar{z}\$는 실수이다. ㄴ. \$z+\\bar{z}=1\$ ㄷ. \$z\\bar{z}\>1\$

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

\$z=a+bi\$를 대입해 전개하면 \$\$ z^2-2z \= (a^2-b^2-2a)+2b(a-1)i \$\$ 이다. 이 값이 실수이므로 허수부분 \$2b(a-1)=0\$이고, \$b\\ne 0\$이므로 \$a=1\$이다.

- ㄱ. \$\\overline{z^2}-2\\bar{z} \= \\overline{z^2-2z}\$이고, 실수의 켤레복소수는 자기 자신과 같으므로 실수이다. (참)  
- ㄴ. \$z+\\bar{z} \= 2a \= 2\\cdot 1 \= 2 \\ne 1\$이다. (거짓)  
- ㄷ. \$z\\bar{z} \= a^2+b^2 \= 1+b^2\$이고 \$b\\ne 0\$인 실수이므로 \$b^2\>0\$, 즉 \$z\\bar{z}\>1\$이다. (참) 따라서 옳은 것은 ㄱ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "z^2-2z가 실수일 조건으로 실수부 a=1을 구해 켤레복소수의 합과 곱 성질을 판정하는 합답형 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "$z=a+bi$를 $z^2-2z$에 대입해 허수부분 $2b(a-1)=0$에서 $a=1$을 구한 뒤 ㄱ, ㄴ, ㄷ을 판정한다.", "decisiveStep": "$b\\ne 0$ 조건을 이용해 $a=1$을 확정하고 $b^2>0$으로 ㄷ의 부등식을 판정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE) 기준 복소수의 실수 조건 판별 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 실수 조건으로 실수부를 결정하고 켤레복소수 성질 3가지를 판정하는 합답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "$\\bar{z}$는 $z$의 켤레복소수이다"}], "method": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=a+bi$", "evidenceType": "IMPLIED", "justification": "z=a+bi의 허수부분이 0인 조건으로 a=1을 구해 보기 참·거짓을 판정함"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=a+bi$"}], "condition": [{"term": "실수", "src": "stem", "quote": "$z^2-2z$가 실수일 때"}]}, "reasons": {"method": "z^2-2z의 허수부=0에서 a=1을 구해 ㄱ, ㄴ, ㄷ을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.6

### 발문

이차함수 \$y=x^2-2kx+4k+5\$의 그래프는 \$x\$축과 한 점에서 만나고, 이차함수 \$y=-x^2+6x+k-10\$의 그래프는 \$x\$축과 서로 다른 두 점에서 만나도록 하는 실수 \$k\$의 값은?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

①

### 해설

첫째 이차함수 \$y=x^2-2kx+4k+5\$의 그래프가 \$x\$축과 한 점에서 만나므로 방정식 \$x^2-2kx+4k+5=0\$의 판별식 \$D\_1=0\$이다. \$\$ \\dfrac{D\_1}{4} \= (-k)^2-(4k+5) \= k^2-4k-5 \= (k-5)(k+1) \= 0 \\implies k=5 \\text{ 또는 } k=-1 \$\$ 둘째 이차함수 \$y=-x^2+6x+k-10\$의 그래프가 \$x\$축과 서로 다른 두 점에서 만나므로 방정식 \$-x^2+6x+k-10=0\$의 판별식 \$D\_2\>0\$이다. \$\$ \\dfrac{D\_2}{4} \= 3^2-(-1)(k-10) \= 9+k-10 \= k-1 \> 0 \\implies k \> 1 \$\$ 두 조건을 모두 만족시키는 실수 \$k\$의 값은 \$k=5\$이다.

```
{"status": "EXEMPT", "reason": "두 이차함수의 x축 교점 개수 조건을 판별식 D1=0과 D2>0으로 연립해 k를 구하는 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "첫째 이차함수의 $x$축 접점 조건 $D_1=0$에서 $k=5, -1$을 구하고 둘째 조건 $D_2>0$ ($k>1$)으로 $k=5$를 택한다.", "decisiveStep": "두 판별식 조건 $D_1=0$과 $D_2>0$의 교집합에서 유일한 실수 $k=5$를 고른다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE) 기준 이차함수 그래프와 x축 위치 관계 판별식 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차함수의 $x$축 교점 개수 조건을 판별식 등식과 부등식으로 연립하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D_1=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-2kx+4k+5$"}], "condition": [{"term": "접함", "src": "stem", "quote": "$x$축과 한 점에서 만나고"}]}, "reasons": {"method": "두 이차함수의 판별식 D1=0, D2>0을 연립해 k=5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.7

### 발문

세 자연수 \$a\$, \$b\$, \$c\$가 등식 \$(a^2-9b^2-c^2)c^2=a^2(c^2-a^2+9b^2)\$을 만족시킬 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은?

\<보기\> ㄱ. \$3b+c\>a\$ ㄴ. \$a+3b\>c^2\$ ㄷ. \$a=b+c=10\$이면 \$bc=21\$이다.

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

③

### 해설

\$T=a^2-9b^2-c^2\$이라 두면 \$c^2-a^2+9b^2=-T\$이므로 주어진 등식은 \$\$ Tc^2 \= \-Ta^2 \\implies T(a^2+c^2) \= 0 \$\$ 이다. \$a, c\$는 자연수이므로 \$a^2+c^2\>0\$이고, 따라서 \$T=0\$, 즉 \$a^2=c^2+(3b)^2\$이다.

- ㄱ. \$(3b+c)^2 \= 9b^2+6bc+c^2 \> 9b^2+c^2 \= a^2\$이고 \$3b+c\>0, a\>0\$이므로 \$3b+c\>a\$이다. (참)  
- ㄴ. \$(a, b, c)=(10, 2, 8)\$은 \$10^2=8^2+6^2\$을 만족하지만 \$a+3b=10+6=16 \< 64=c^2\$이다. (거짓)  
- ㄷ. \$a=b+c=10\$에서 \$a=10, c=10-b\$를 \$a^2=c^2+9b^2\$에 대입하면 \$100=(10-b)^2+9b^2=100-20b+10b^2 \\implies 10b(b-2)=0\$이다. \$b\$는 자연수이므로 \$b=2, c=8\$이고 \$bc=16\\ne 21\$이다. (거짓) 따라서 옳은 것은 ㄱ뿐이다.

```
{"status": "EXEMPT", "reason": "다항식 등식을 인수분해해 피타고라스 관계식을 구하고 자연수 조건으로 ㄱ, ㄴ, ㄷ을 판정하는 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$T=a^2-9b^2-c^2$으로 치환해 $T(a^2+c^2)=0$에서 $a^2=c^2+9b^2$을 도출한 뒤 자연수 반례와 대입으로 ㄱ, ㄴ, ㄷ을 판정한다.", "decisiveStep": "자연수 조건 $a^2+c^2>0$으로 $a^2=c^2+(3b)^2$을 확정한 뒤 ㄴ의 반례 $(10,2,8)$을 찾는다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE) 기준 다항식 조건식 인수분해 및 자연수 판별 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수분해를 통한 피타고라스 관계식 도출과 자연수 반례 판정이 결합된 합답형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "세 자연수 $a$, $b$, $c$"}], "method": [{"term": "인수분해", "src": "solution", "quote": "T(a^2+c^2) = 0", "evidenceType": "IMPLIED", "justification": "공통인수 T=a^2-9b^2-c^2으로 묶어 인수분해한 뒤 자연수 조건으로 T=0을 얻음"}], "given": [{"term": "등식", "src": "stem", "quote": "등식 $(a^2-9b^2-c^2)c^2=a^2(c^2-a^2+9b^2)$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "세 자연수 $a$, $b$, $c$"}]}, "reasons": {"method": "공통인수 T로 인수분해해 a^2=c^2+9b^2을 얻고 ㄱ, ㄴ, ㄷ을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.7

### 발문

이차방정식 \$x^2-x+1=0\$의 두 근 \$\\alpha\$, \$\\beta\$에 대하여 이차함수 \$f(x)=x^2+px+q\$가 \$f(\\alpha^2)=-5\\alpha\$, \$f(\\beta^2)=-5\\beta\$를 만족시킬 때, 두 상수 \$p\$, \$q\$에 대하여 \$p^2+q^2\$의 값은?

### 선지

① \$18\$ ② \$20\$ ③ \$25\$ ④ \$29\$ ⑤ \$32\$

### 정답

⑤

### 해설

\$x^2-x+1=0\$의 두 근이 \$\\alpha, \\beta\$이므로 \$\\alpha^2=\\alpha-1\$이고 \$\\alpha^3=\\alpha(\\alpha-1)=\\alpha^2-\\alpha=-1\$이다. 따라서 \$\\alpha^4=-\\alpha\$이며 \$\\beta\$에 대해서도 같은 식이 성립한다. 이를 \$f(\\alpha^2)=-5\\alpha\$에 대입하면 \$\$ \\alpha^4+p\\alpha^2+q \= \-\\alpha+p(\\alpha-1)+q \= (p-1)\\alpha+(q-p) \= \-5\\alpha \$\$ 이고, \$(p+4)\\alpha+(q-p)=0\$이다. 마찬가지로 \$(p+4)\\beta+(q-p)=0\$이다. \$\\alpha\\ne \\beta\$이므로 두 식을 빼면 \$(p+4)(\\alpha-\\beta)=0\$에서 \$p=-4\$이고, \$q-p=0\$에서 \$q=-4\$이다. 따라서 \$p^2+q^2 \= (-4)^2+(-4)^2 \= 32\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식 근의 차수 낮추기 alpha^2=alpha-1, alpha^4=-alpha로 f(alpha^2)=-5alpha를 풀어 p, q를 구하는 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha^2=\\alpha-1, \\alpha^4=-\\alpha$로 $f(\\alpha^2)$의 차수를 낮춘 뒤 $\\alpha\\ne \\beta$임을 이용해 $(p+4)\\alpha+(q-p)=0$에서 $p, q$를 구한다.", "decisiveStep": "$\\alpha^3=-1$을 이용해 $\\alpha^4=-\\alpha$로 4차항을 1차항으로 낮춘다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP) 기준 이차방정식 근의 변형식 대입 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "방정식의 차수 낮추기와 서로 다른 두 근의 일차 결합 소거를 결합한 중상 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "두 상수 $p$, $q$에 대하여 $p^2+q^2$의 값은"}], "method": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-x+1=0$", "evidenceType": "IMPLIED", "justification": "근이 x^2=x-1, x^3=-1을 만족함을 이용해 f(alpha^2)의 차수를 낮춤"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2+px+q$"}], "condition": []}, "reasons": {"method": "alpha^2=alpha-1, alpha^4=-alpha 차수 낮추기로 p, q를 결정함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q16

- 형식: 서답형  
- 배점: 5

### 발문

\[단답형1\] 이차부등식 \$3x^2+(a-2)x+a-2\\le 0\$이 해를 갖지 않도록 하는 정수 \$a\$의 최댓값을 구하시오.

### 선지

없음

### 정답

\$13\$

### 해설

\$f(x)=3x^2+(a-2)x+a-2\$라 하면 최고차항의 계수가 양수이므로 이차부등식 \$f(x)\\le 0\$이 해를 갖지 않으려면 모든 실수 \$x\$에 대하여 \$f(x)\>0\$이어야 한다. 따라서 이차방정식 \$f(x)=0\$의 판별식 \$D\<0\$이어야 하므로 \$\$ D \= (a-2)^2-4\\cdot 3(a-2) \= (a-2)(a-14) \< 0 \\implies 2 \< a \< 14 \$\$ 이다. 이를 만족하는 정수 \$a\$는 \$3, 4, \\ldots, 13\$이므로 최댓값은 \$13\$이다.

```
{"status": "EXEMPT", "reason": "아래로 볼록 이차부등식 f(x)<=0이 해가 없을 조건을 판별식 D<0으로 푸는 단답형 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-QUADRATIC_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "이차항 계수가 양수인 $3x^2+(a-2)x+a-2\\le 0$이 해를 갖지 않을 조건 $D=(a-2)(a-14)<0$을 푼다.", "decisiveStep": "등호 포함 부등식 $f(x)\\le 0$이 해가 없으려면 $D\\le 0$이 아니라 $D<0$이어야 함을 구분한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "이차부등식", "l4": "그래프를 이용한 해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_INEQUALITY", "templateKey": "TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL", "why": "high1.json H1-RPM-047(DIRECT_ACTIVE) 기준 이차부등식이 해를 갖지 않을 조건 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차부등식의 해가 없을 조건을 판별식 $D<0$으로 전환해 정수 최댓값을 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "정수 $a$의 최댓값을"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$이어야 하므로", "evidenceType": "NAMED"}], "given": [{"term": "이차부등식", "src": "stem", "quote": "이차부등식 $3x^2+(a-2)x+a-2\\le 0$"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $a$의 최댓값"}]}, "reasons": {"method": "판별식 D<0으로 2<a<14를 구해 정수 최댓값 13을 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 서답형  
- 배점: 5

### 발문

\[단답형2\] 최고차항의 계수가 \$2\$인 삼차다항식 \$f(x)\$와 최고차항의 계수가 \$3\$인 이차다항식 \$g(x)\$가 다음 조건을 만족시킨다. (가) 모든 실수 \$x\$에 대하여 \$f(x)+f(-x)=0\$이다. (나) 모든 실수 \$x\$에 대하여 \$g(x)-g(-x)=0\$이다. (다) 다항식 \$f(x)+g(x)\$는 \$x-1\$로 나누어떨어진다. \$f(2)+2g(4)\$의 값을 구하시오.

### 선지

없음

### 정답

\$102\$

### 해설

\$f(x)=2x^3+Ax^2+Bx+C\$라 하면 조건 (가)에서 \$f(x)+f(-x)=2Ax^2+2C=0\$이 모든 실수 \$x\$에 대해 성립하므로 \$A=C=0\$, 즉 \$f(x)=2x^3+Bx\$이다. \$g(x)=3x^2+Dx+E\$라 하면 조건 (나)에서 \$g(x)-g(-x)=2Dx=0\$이 모든 실수 \$x\$에 대해 성립하므로 \$D=0\$, 즉 \$g(x)=3x^2+E\$이다. 조건 (다)에 의해 나머지정리로 \$f(1)+g(1)=0\$이므로 \$(2+B)+(3+E)=0 \\implies B+E=-5\$이다. 따라서 \$\$ f(2)+2g(4) \= (16+2B)+2(48+E) \= 112+2(B+E) \= 112+2(-5) \= 102 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "기함수·우함수 항등 조건으로 다항식의 짝수·홀수차 항을 소거하고 나머지정리로 계수 합을 구하는 단답형 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "(가), (나) 항등식 조건으로 $f(x)=2x^3+Bx, g(x)=3x^2+E$로 줄인 뒤 $f(1)+g(1)=0$에서 $B+E=-5$를 구해 대입한다.", "decisiveStep": "$B, E$를 각각 구하지 않고 $f(2)+2g(4)=112+2(B+E)$로 묶어 $B+E=-5$를 바로 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE) 기준 항등식 대칭 조건으로 미정계수를 구하는 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 대칭 항등 조건과 나머지정리를 결합해 미정계수 합으로 함숫값을 계산하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "method": [{"term": "항등식", "src": "stem", "quote": "모든 실수 $x$에 대하여 $f(x)+f(-x)=0$", "evidenceType": "IMPLIED", "justification": "f(x)+f(-x)=0, g(x)-g(-x)=0 항등식 조건으로 계수를 소거함"}], "given": [{"term": "삼차식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "대칭 항등 조건으로 계수를 줄이고 B+E=-5를 대입해 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 5

### 발문

\[단답형3\] 이차함수 \$y=\\dfrac{1}{4k}(x+2k)^2\$의 그래프는 실수 \$k\$ (\$k\\ne 0\$)의 값에 관계없이 항상 서로 다른 두 직선 \$l\$, \$m\$과 접한다. 두 직선 \$l\$, \$m\$과 직선 \$x=6\$으로 둘러싸인 부분의 넓이를 구하시오.

### 선지

없음

### 정답

\$36\$

### 해설

공통 접선을 \$y=mx+b\$라 두고 이차함수와 연립하면 \$\$ \\dfrac{1}{4k}(x+2k)^2 \= mx+b \\iff x^2+4k(1-m)x+4k^2-4kb \= 0 \$\$ 이다. 접하므로 판별식 \$D=0\$이어야 하고, \$\$ \\dfrac{D}{4} \= 4k^2(1-m)^2-(4k^2-4kb) \= 4k^2(m^2-2m)+4kb \= 4k{km(m-2)+b} \= 0 \$\$ 이다. 이 식이 \$k\\ne 0\$인 모든 실수 \$k\$에 대해 성립하려면 \$m(m-2)=0\$이고 \$b=0\$이어야 하므로 \$m=0\$ 또는 \$m=2\$이다. 따라서 두 직선 \$l, m\$은 \$y=0\$과 \$y=2x\$이다. 두 직선과 \$x=6\$으로 둘러싸인 도형은 꼭짓점이 \$(0,0), (6,0), (6,12)\$인 직각삼각형이므로 넓이는 \$\\dfrac{1}{2}\\cdot 6\\cdot 12 \= 36\$이다.

```
{"status": "EXEMPT", "reason": "포물선족의 공통접선 조건을 판별식 D=0의 k 항등식으로 풀어 두 접선과 x=6의 삼각형 넓이를 구하는 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "직선 $y=mx+b$와의 연립방정식 판별식 $\\frac{D}{4}=4k\\{km(m-2)+b\\}=0$이 $k$에 대한 항등식이 되도록 $m=0, 2$와 $b=0$을 구한다.", "decisiveStep": "$k\\ne 0$을 약분한 뒤 $km(m-2)+b=0$의 $k$ 계수와 상수항을 $0$으로 두어 두 공통접선을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE) 기준 포물선족의 공통접선 조건 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B34", "difficultyReason": "매개변수 $k$에 무관한 공통접선 판별식 항등식과 좌표평면 삼각형 넓이를 결합한 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "넓이", "src": "stem", "quote": "부분의 넓이를 구하시오"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이어야 하고", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=\\dfrac{1}{4k}(x+2k)^2$"}], "condition": [{"term": "접함", "src": "stem", "quote": "항상 서로 다른 두 직선 $l$, $m$과 접한다"}]}, "reasons": {"method": "접선 판별식 D=0의 k 항등식 조건으로 두 접선을 구해 삼각형 넓이를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 10

### 발문

\[서술형1\] 다항식 \$f(x)=x^4-4x^3+2x^2+4x-3\$을 \$x+a\$로 나누었을 때의 몫을 \$Q(x)\$라 하자. 실수 \$a\$에 대하여 다항식 \$f(x)\$가 \$x+a\$로 나누어떨어질 때, \$Q(2a)\$의 최댓값과 최솟값의 합을 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$-246\$

### 해설

인수정리와 조립제법으로 \$f(x)\$를 인수분해하면 \$f(1)=1-4+2+4-3=0\$, \$f(-1)=1+4+2-4-3=0\$, \$f(3)=81-108+18+12-3=0\$이므로 \$\$ f(x) \= (x-1)^2(x+1)(x-3) \$\$ 이다. \$f(x)\$가 \$x+a\$로 나누어떨어지려면 \$x=-a\$가 \$f(x)=0\$의 근이어야 하므로 \$-a \\in {1, \-1, 3}\$, 즉 \$a \\in {-1, 1, \-3}\$이다. 각 경우에 몫 \$Q(x)\$와 \$Q(2a)\$의 값을 구하면 다음과 같다.

- \$a=-1\$일 때: \$Q(x)=(x-1)(x+1)(x-3)\$이므로 \$Q(-2)=(-3)(-1)(-5)=-15\$  
- \$a=1\$일 때: \$Q(x)=(x-1)^2(x-3)\$이므로 \$Q(2)=1^2\\cdot(-1)=-1\$  
- \$a=-3\$일 때: \$Q(x)=(x-1)^2(x+1)\$이므로 \$Q(-6)=(-7)^2\\cdot(-5)=-245\$ 따라서 최댓값은 \$-1\$, 최솟값은 \$-245\$이므로 두 값의 합은 \$-1+(-245)=-246\$이다.

```
{"status": "EXEMPT", "reason": "사차식을 인수분해해 나누어떨어지게 하는 실수 a 후보를 모두 찾고 각 몫의 함숫값 최대·최소를 구하는 서술형 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$f(x)=(x-1)^2(x+1)(x-3)$으로 인수분해해 $a=-1, 1, -3$을 구하고 각 경우의 몫 $Q(x)$에 $2a$를 대입해 최대·최소를 비교한다.", "decisiveStep": "중근 $x=1$을 포함한 $3$개의 서로 다른 근에서 가능한 $a$ 값 $3$가지를 빠짐없이 분류한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE) 기준 사차다항식 인수분해 및 몫 계산 문항으로 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "고차식 인수분해 후 나누어떨어지는 조건에 따른 몫 $Q(x)$의 경우 분류를 요구하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "$Q(2a)$의 최댓값과 최솟값의 합"}], "method": [{"term": "인수분해", "src": "solution", "quote": "f(x)$를 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "사차식", "src": "stem", "quote": "다항식 $f(x)=x^4-4x^3+2x^2+4x-3$"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a$에 대하여"}]}, "reasons": {"method": "사차식을 인수분해해 가능한 a별 몫 Q(2a)의 최대·최소 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 10

### 발문

\[서술형2\] \$x\$에 대한 삼차방정식 \$x^3+3kpx^2-4k^3=0\$의 중근을 \$\\alpha\$, 나머지 한 근을 \$\\beta\$ (\$\\alpha\>\\beta\$)라 하자. \$\\alpha^2+\\beta^2=45\$일 때, 연립부등식 \$\\begin{cases} kp(x-\\alpha)(x-\\beta)\>0 \\ x^2-2(n+1)x+n^2+2n\\ge 0 \\end{cases}\$을 만족시키는 정수 \$x\$의 개수가 \$7\$개가 되도록 하는 정수 \$n\$의 값의 합을 구하는 과정을 서술하시오.

1) \$\\alpha\$, \$\\beta\$의 값을 구하시오. \[2점\]  
2) \$k\$, \$p\$의 값을 구하시오. \[2점\]  
3) 두 부등식의 해를 구하시오. \[2점\]  
4) 정수 \$n\$의 값의 합을 구하시오. \[4점\]

### 선지

없음

### 정답

\$4\$

### 해설

1) 삼차방정식의 세 근이 \$\\alpha, \\alpha, \\beta\$이고 \$x\$의 계수가 \$0\$이므로 근과 계수의 관계에 의하여 \$\$ \\alpha^2+2\\alpha\\beta \= \\alpha(\\alpha+2\\beta) \= 0 \$\$ 이다. 만약 \$\\alpha=0\$이면 \$\\alpha^2\\beta=4k^3\$에서 \$k=0\$이 되어 방정식 \$x^3=0\$의 세 근이 모두 \$0\$이 되므로 \$\\alpha\>\\beta\$에 모순이다. 따라서 \$\\alpha=-2\\beta\$이고, \$\\alpha\>\\beta\$에서 \$-2\\beta\>\\beta \\implies \\beta\<0\$이다. \$\\alpha^2+\\beta^2=45\$에 대입하면 \$5\\beta^2=45 \\implies \\beta^2=9\$이므로 \$\\beta=-3\$, \$\\alpha=6\$이다.  
     
2) 근과 계수의 관계에서 \$2\\alpha+\\beta \= 9 \= \-3kp \\implies kp=-3\$이고, \$\\alpha^2\\beta \= 36(-3) \= \-108 \= 4k^3 \\implies k^3=-27\$이므로 \$k=-3\$, \$p=1\$이다.  
     
3) 첫째 부등식은 \$-3(x-6)(x+3)\>0\$, 즉 \$(x-6)(x+3)\<0\$이므로 \$-3\<x\<6\$이다. 둘째 부등식은 \$(x-n)(x-(n+2))\\ge 0\$이므로 \$x\\le n\$ 또는 \$x\\ge n+2\$이다.  
     
4) 첫째 부등식을 만족하는 정수 \$x\$는 \$-2, \-1, 0, 1, 2, 3, 4, 5\$의 \$8\$개이다. 둘째 부등식에서 제외되는 정수는 \$x=n+1\$ 하나뿐이므로, 연립부등식의 정수해가 \$7\$개가 되려면 제외되는 정수 \$n+1\$이 앞의 \$8\$개 정수 중 하나여야 한다. 따라서 \$n+1 \\in {-2, \-1, 0, 1, 2, 3, 4, 5}\$이므로 \$n \\in {-3, \-2, \-1, 0, 1, 2, 3, 4}\$이고, 모든 정수 \$n\$의 값의 합은 \$\$ (-3)+(-2)+(-1)+0+1+2+3+4 \= 4 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 중근 조건으로 계수와 근을 결정하고 연립이차부등식의 정수해 개수 조건으로 정수 n의 합을 구하는 서술형 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "삼차방정식 근과 계수의 관계로 $\\alpha, \\beta, k, p$를 구한 뒤 $-3<x<6$의 $8$개 정수 중 $x=n+1$만 제외되어 $7$개가 되도록 $n$의 범위를 정한다.", "decisiveStep": "$x\\le n$ 또는 $x\\ge n+2$에서 유일하게 빠지는 정수 $x=n+1$이 $(-3, 6)$ 내부에 들어갈 조건을 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY) 기준 삼차방정식 중근 조건 및 연립부등식 결합 문항으로 ACTIVE 매핑 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식의 중근·근과 계수의 관계와 연립이차부등식의 정수해 개수 판정이 결합된 4소문항 심화 서술형이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $n$의 값의 합을"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3+3kpx^2-4k^3=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 $\\alpha$"}]}, "reasons": {"method": "삼차방정식 근과 계수의 관계로 계수를 정하고 연립부등식 정수해 개수 조건을 품"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

