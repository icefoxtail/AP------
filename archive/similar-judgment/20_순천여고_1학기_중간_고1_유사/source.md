

```
{"stem": "20_순천여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/20_순천여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.6

### 발문

두 다항식 \$A=2x^2-x+4\$, \$B=x^2-3x+2\$에 대하여 \$3A-(A-B)\$를 계산하면?

### 선지

① \$3x^2-5x+10\$ ② \$5x^2+x+10\$ ③ \$5x^2-5x+10\$ ④ \$5x^2-5x+6\$ ⑤ \$7x^2-5x+10\$

### 정답

③

### 해설

\$3A-(A-B)=2A+B\$이므로 \$\$ 2A+B \= 2(2x^2-x+4)+(x^2-3x+2) \= 4x^2-2x+8+x^2-3x+2 \= 5x^2-5x+10 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "다항식의 일차 결합을 2A+B로 정리해 동류항을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$3A-(A-B)=2A+B$로 먼저 간단히 한 뒤 $A, B$를 대입해 동류항을 정리한다.", "decisiveStep": "$3A-A+B=2A+B$로 식을 먼저 줄여 대입 계산을 단순화한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 다항식 3A-(A-B)=2A+B로 정리해 동류항을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 덧셈·뺄셈을 식 정리 후 동류항 덧셈으로 푸는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=2x^2-x+4$"}], "method": [{"term": "동류항", "src": "solution", "quote": "4x^2-2x+8+x^2-3x+2", "evidenceType": "IMPLIED", "justification": "2A+B로 정리해 대입한 뒤 차수별 동류항을 더함"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=2x^2-x+4$"}], "condition": []}, "reasons": {"method": "3A-(A-B)=2A+B로 정리 후 동류항을 더함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.6

### 발문

실수 \$a, b\$에 대하여 \$a(1+i)-3b=1+7i\$가 성립할 때, \$a+b\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$9\$ ② \$7\$ ③ \$5\$ ④ \$11\$ ⑤ \$13\$

### 정답

①

### 해설

좌변을 정리하면 \$(a-3b)+ai=1+7i\$이고 \$a, b\$는 실수이므로 \$\$ a-3b=1, \\qquad a=7 \$\$ 이다. \$7-3b=1\$에서 \$3b=6 \\implies b=2\$이므로 \$a+b=7+2=9\$이다.

```
{"status": "EXEMPT", "reason": "복소수 상등 조건으로 실수부·허수부를 비교해 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "$(a-3b)+ai=1+7i$에서 실수부와 허수부를 비교해 $a=7, b=2$를 구한다.", "decisiveStep": "허수부 비교 $a=7$을 바로 얻어 $a-3b=1$에 대입한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-022(DIRECT_ACTIVE): 서로 같은 복소수 조건으로 실수부와 허수부를 비교함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수가 서로 같을 조건을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}], "method": [{"term": "복소수", "src": "stem", "quote": "a(1+i)-3b=1+7i", "evidenceType": "IMPLIED", "justification": "실수부분과 허수부분을 각각 비교하여 a, b를 구함"}], "given": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}]}, "reasons": {"method": "복소수 상등 조건으로 a=7, b=2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.6

### 발문

다항식 \$P(x)\$를 \$x-\\dfrac{1}{3}\$로 나누었을 때의 몫과 나머지를 각각 \$Q(x)\$, \$R\$이라 할 때, 다항식 \$P(x)\$를 \$3x-1\$로 나누었을 때의 몫과 나머지를 바르게 나타낸 것은?

### 선지

① 몫: \$Q(x)\$, 나머지: \$R\$ ② 몫: \$3Q(x)\$, 나머지: \$R\$ ③ 몫: \$\\dfrac{1}{3}Q(x)\$, 나머지: \$\\dfrac{1}{3}R\$ ④ 몫: \$\\dfrac{1}{3}Q(x)\$, 나머지: \$R\$ ⑤ 몫: \$Q\\left(\\dfrac{1}{3}x\\right)\$, 나머지: \$R\$

### 정답

④

### 해설

나눗셈 항등식 \$P(x)=\\left(x-\\dfrac{1}{3}\\right)Q(x)+R\$에서 \$3x-1=3\\left(x-\\dfrac{1}{3}\\right)\$이므로 \$\$ P(x) \= (3x-1)\\cdot\\dfrac{1}{3}Q(x)+R \$\$ 이다. 따라서 몫은 \$\\dfrac{1}{3}Q(x)\$, 나머지는 \$R\$이다.

```
{"status": "EXEMPT", "reason": "나눗셈 항등식에서 제수의 상수배 변형에 따른 몫과 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "$P(x)=\\left(x-\\frac{1}{3}\\right)Q(x)+R$을 $3x-1$ 기준으로 변형해 몫 $\\frac{1}{3}Q(x)$와 나머지 $R$을 읽는다.", "decisiveStep": "$x-\\frac{1}{3}=\\frac{1}{3}(3x-1)$을 대입해 몫만 $\\frac{1}{3}$배가 됨을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 다항식 나눗셈 항등식 변형으로 몫과 나머지를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 제수의 상수배 변형에 따른 몫과 나머지를 항등식으로 판정하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫과 나머지를 바르게 나타낸 것은?"}], "method": [{"term": "항등식", "src": "solution", "quote": "나눗셈 항등식", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": []}, "reasons": {"method": "나눗셈 항등식을 (3x-1) 기준으로 변형해 몫과 나머지를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.6

### 발문

이차방정식 \$x^2-6x+3=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, \$(\\alpha-1)(\\beta-1)\$의 값은?

### 선지

① \$-1\$ ② \$-2\$ ③ \$-3\$ ④ \$0\$ ⑤ \$2\$

### 정답

②

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=6\$, \$\\alpha\\beta=3\$이다. 따라서 \$\$ (\\alpha-1)(\\beta-1) \= \\alpha\\beta-(\\alpha+\\beta)+1 \= 3-6+1 \= \-2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 근과 계수의 관계로 대칭식을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계로 $\\alpha+\\beta=6, \\alpha\\beta=3$을 구해 전개식 $\\alpha\\beta-(\\alpha+\\beta)+1$에 대입한다.", "decisiveStep": "식을 전개한 뒤 합과 곱을 바로 대입한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계로 합과 곱을 구한 뒤 전개식 값을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 근과 계수의 관계를 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "stem", "quote": "(\\alpha-1)(\\beta-1)$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-6x+3=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 (alpha-1)(beta-1)을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q05

- 형식: 객관식  
- 배점: 3.6

### 발문

\$(x-2y)(x-2y-4)-5\$를 인수분해한 것으로 옳은 것은?

### 선지

① \$(x-2y-1)(x-2y+5)\$ ② \$(x-2y-5)(x-2y-1)\$ ③ \$(x-2y+5)(x-2y+1)\$ ④ \$(x-2y-3)(x-2y+3)\$ ⑤ \$(x-2y-5)(x-2y+1)\$

### 정답

⑤

### 해설

\$t=x-2y\$로 치환하면 \$\$ (x-2y)(x-2y-4)-5 \= t(t-4)-5 \= t^2-4t-5 \= (t-5)(t+1) \= (x-2y-5)(x-2y+1) \$\$ 이다.

```
{"status": "EXEMPT", "reason": "공통부분 x-2y를 치환해 이차식을 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$t=x-2y$로 치환해 $t^2-4t-5=(t-5)(t+1)$로 인수분해한 뒤 되돌린다.", "decisiveStep": "공통부분 $x-2y$를 한 문자로 치환해 이차식 인수분해로 환원한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 공통부분 x-2y를 치환해 단계적으로 인수분해함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공통부분 치환을 이용한 기본 인수분해 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해한 것으로"}], "method": [{"term": "치환", "src": "solution", "quote": "$t=x-2y$로 치환하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "$(x-2y)(x-2y-4)-5$"}], "condition": []}, "reasons": {"method": "x-2y를 t로 치환해 이차식 인수분해를 수행함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.8

### 발문

\$0\\le x\\le 5\$에서 이차함수 \$f(x)=-x^2+6x+2\$의 최솟값은?

### 선지

① \$2\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

①

### 해설

\$f(x)=-x^2+6x+2=-(x-3)^2+11\$이므로 위로 볼록하고 축이 \$x=3\$이다. 구간 \$0\\le x\\le 5\$에서 최솟값은 양 끝점 \$x=0\$ 또는 \$x=5\$에서 나타나므로 \$\$ f(0) \= 2, \\qquad f(5) \= \-25+30+2 \= 7 \$\$ 이다. 따라서 최솟값은 \$2\$이다.

```
{"status": "EXEMPT", "reason": "위로 볼록 이차함수의 닫힌 구간 최솟값을 양 끝점 비교로 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "위로 볼록한 $f(x)=-(x-3)^2+11$에서 구간의 양 끝점 $f(0)=2, f(5)=7$을 비교해 최솟값을 구한다.", "decisiveStep": "최고차항 계수가 음수이므로 최솟값이 꼭짓점이 아닌 양 끝점 중 먼 $x=0$에서 나옴을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 위로 볼록한 이차함수의 제한 구간 [0, 5]에서 최솟값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "위로 볼록 이차함수의 제한 범위 최솟값을 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "최솟값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-(x-3)^2+11", "evidenceType": "IMPLIED", "justification": "완전제곱식으로 축과 개형을 확인하고 양 끝점 값을 비교함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=-x^2+6x+2$"}], "condition": [{"term": "범위", "src": "stem", "quote": "$0\\le x\\le 5$에서"}]}, "reasons": {"method": "표준형 변형 후 양 끝점 함숫값을 비교해 최솟값 2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.8

### 발문

\$(1+i)^{40}+(1-i)^{40}\$을 간단히 하면? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$0\$ ② \$2^{20}\$ ③ \$2^{21}\$ ④ \$2^{20}i\$ ⑤ \$2^{21}i\$

### 정답

③

### 해설

\$(1+i)^2=2i\$, \$(1+i)^4=-4\$, \$(1+i)^8=16=2^4\$이므로 \$\$ (1+i)^{40} \= {(1+i)^8}^5 \= (2^4)^5 \= 2^{20} \$\$ 이다. 마찬가지로 \$(1-i)^2=-2i\$, \$(1-i)^8=2^4\$이므로 \$(1-i)^{40}=2^{20}\$이다. 따라서 \$(1+i)^{40}+(1-i)^{40} \= 2^{20}+2^{20} \= 2^{21}\$이다.

```
{"status": "EXEMPT", "reason": "1+i, 1-i의 제곱을 거듭제곱해 40제곱의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$(1\\pm i)^2=\\pm 2i$를 이용해 $(1\\pm i)^8=2^4$을 구한 뒤 지수 $40=8\\cdot 5$를 적용해 $2^{20}+2^{20}=2^{21}$을 얻는다.", "decisiveStep": "$(1\\pm i)^8=16=2^4$임을 이용해 $40$제곱을 $2^{20}$으로 줄인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): (1±i)^2=±2i의 주기성을 이용해 40제곱의 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$(1\\pm i)^2=\\pm 2i$의 거듭제곱 규칙을 적용해 고차 제곱합을 구하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "i=\\sqrt{-1}"}], "method": [{"term": "거듭제곱", "src": "solution", "quote": "(1+i)^{40} = \\{(1+i)^8\\}^5", "evidenceType": "IMPLIED", "justification": "1+i와 1-i의 2제곱, 4제곱, 8제곱을 차례로 구해 40제곱을 계산함"}], "given": [{"term": "허수", "src": "stem", "quote": "i=\\sqrt{-1}"}], "condition": []}, "reasons": {"method": "(1+-i)^8=2^4을 이용해 40제곱의 합 2^21을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.8

### 발문

이차함수 \$y=x^2+2x-5\$의 그래프와 직선 \$y=4x-k\$가 접하도록 하는 상수 \$k\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

④

### 해설

두 그래프가 접하므로 연립방정식 \$x^2+2x-5=4x-k\$, 즉 \$x^2-2x+k-5=0\$이 중근을 가져야 한다. 판별식 \$\\dfrac{D}{4}=(-1)^2-(k-5)=6-k=0\$이므로 \$k=6\$이다.

```
{"status": "EXEMPT", "reason": "이차함수와 직선의 접점 조건을 판별식 D=0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $x^2-2x+k-5=0$의 짝수 판별식 $\\frac{D}{4}=6-k=0$을 풀어 $k=6$을 구한다.", "decisiveStep": "두 식을 연립한 이차방정식의 판별식을 $0$으로 둔다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 이차함수와 직선이 접할 조건 D=0을 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 접점 조건에 판별식 $D=0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $k$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $\\dfrac{D}{4}=(-1)^2-(k-5)=6-k=0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+2x-5$"}], "condition": [{"term": "접함", "src": "stem", "quote": "직선 $y=4x-k$가 접하도록"}]}, "reasons": {"method": "연립방정식의 판별식 D/4=0을 풀어 k=6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$P(x)\$는 \$x+3\$으로 나누어떨어지고, \$x-1\$로 나누었을 때의 나머지는 \$8\$이다. \$P(x)\$를 \$x^2+2x-3\$으로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(-1)\$의 값은?

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

②

### 해설

\$x^2+2x-3=(x+3)(x-1)\$이므로 나머지 \$R(x)=ux+v\$라 놓을 수 있다. 나머지정리에 의하여 \$P(-3)=R(-3)=-3u+v=0\$, \$P(1)=R(1)=u+v=8\$이다. 두 식을 빼면 \$4u=8\$에서 \$u=2\$이고, \$v=8-2=6\$이다. 따라서 \$R(x)=2x+6\$이므로 \$R(-1)=2(-1)+6=4\$이다.

```
{"status": "EXEMPT", "reason": "이차식 (x+3)(x-1)로 나눈 나머지를 ux+v로 두고 나머지정리를 연립하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x^2+2x-3=(x+3)(x-1)$이므로 $R(x)=ux+v$로 두고 $R(-3)=0, R(1)=8$을 연립해 $R(-1)$을 구한다.", "decisiveStep": "제수를 인수분해해 나머지정리 두 식 $-3u+v=0, u+v=8$을 세운다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 제수 인수분해 후 나머지정리 두 식을 연립해 나머지를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식으로 나눈 나머지를 일차식으로 설정해 나머지정리 연립방정식을 푸는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 할 때"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": []}, "reasons": {"method": "제수 인수분해 후 나머지정리 두 식을 연립해 R(-1)=4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

\$0\$이 아닌 두 실수 \$a, b\$가 \$\\dfrac{\\sqrt{b}}{\\sqrt{a}}=\\sqrt{\\dfrac{b}{a}}\$를 만족시킬 때, \$\\sqrt{ab}-\\sqrt{a}\\sqrt{b}+\\sqrt{5a}\\sqrt{5a}-\\sqrt{25a^2}\$을 간단히 하면?

### 선지

① \$-10a\$ ② \$-2\\sqrt{ab}\$ ③ \$2\\sqrt{ab}\$ ④ \$10a\$ ⑤ \$0\$

### 정답

⑤

### 해설

주어진 등식에서 근호 안이 음수가 아니어야 하고 \$a, b\\ne 0\$이므로 \$a\>0, b\>0\$이다. 따라서 \$\\sqrt{ab}=\\sqrt{a}\\sqrt{b}\$, \$\\sqrt{5a}\\sqrt{5a}=5a\$, \$\\sqrt{25a^2}=5\|a\|=5a\$이다. 그러므로 준식은 \$\\sqrt{ab}-\\sqrt{ab}+5a-5a=0\$이다.

```
{"status": "EXEMPT", "reason": "분수 제곱근 성질에서 a, b>0을 확인해 제곱근 식을 간단히 하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$\\frac{\\sqrt{b}}{\\sqrt{a}}=\\sqrt{\\frac{b}{a}}$가 성립하는 실수 조건에서 $a>0, b>0$을 확인하고 각 항을 정리한다.", "decisiveStep": "$a>0$이므로 $\\sqrt{25a^2}=5|a|=5a$가 됨을 확인해 항들을 소거한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 음수 제곱근의 나눗셈 성질로 부호 조건을 판정해 식을 정리함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱근 나눗셈 조건에서 $a>0, b>0$을 판정하고 $\\sqrt{a^2}=|a|$를 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "양수", "src": "solution", "quote": "$a>0, b>0$이다"}], "method": [{"term": "제곱근", "src": "solution", "quote": "\\sqrt{25a^2}=5|a|=5a", "evidenceType": "IMPLIED", "justification": "근호 조건에서 a>0, b>0을 판정하고 제곱근 성질을 적용해 식을 간단히 함"}], "given": [{"term": "실수", "src": "stem", "quote": "두 실수 $a, b$"}], "condition": [{"term": "실수", "src": "stem", "quote": "두 실수 $a, b$"}]}, "reasons": {"method": "제곱근 성질로 a>0, b>0을 판정해 식의 값 0을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$y=x^2+2ax+b\$가 \$x=-2\$일 때 최솟값 \$-7\$을 가진다. 이때 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

①

### 해설

\$y=x^2+2ax+b=(x+a)^2+b-a^2\$이므로 \$x=-a\$일 때 최솟값 \$b-a^2\$을 가진다. 조건에서 \$-a=-2 \\implies a=2\$이고, \$b-a^2=b-4=-7 \\implies b=-3\$이다. 따라서 \$a+b=2+(-3)=-1\$이다.

```
{"status": "EXEMPT", "reason": "이차함수의 최솟값과 꼭짓점 x좌표로 계수 a, b를 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "완전제곱식 $y=(x+a)^2+b-a^2$의 꼭짓점 $(-a, b-a^2)$을 $(-2, -7)$과 비교해 $a, b$를 구한다.", "decisiveStep": "$-a=-2$와 $b-a^2=-7$을 순서대로 풀어 $a=2, b=-3$을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 완전제곱식 변형으로 꼭짓점 좌표를 비교해 a, b를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 꼭짓점 좌표를 완전제곱식으로 읽어 계수를 정하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b$에 대하여"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x+a)^2+b-a^2", "evidenceType": "IMPLIED", "justification": "이차식을 완전제곱식으로 고쳐 꼭짓점 좌표를 (-2, -7)과 비교함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+2ax+b$"}], "condition": [{"term": "최솟값", "src": "stem", "quote": "최솟값 $-7$을 가진다"}]}, "reasons": {"method": "완전제곱식으로 꼭짓점을 구해 (-2, -7)과 비교함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$y=x^2-ax+b\$의 그래프와 직선 \$y=2x+3\$이 서로 다른 두 점에서 만난다. 한 교점의 \$x\$좌표가 \$3-\\sqrt{2}\$일 때, 유리수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

③

### 해설

교점의 \$x\$좌표는 이차방정식 \$x^2-ax+b=2x+3\$, 즉 \$x^2-(a+2)x+(b-3)=0\$의 근이다. \$a, b\$가 유리수이므로 계수가 모두 유리수이고, 한 근이 \$3-\\sqrt{2}\$이면 다른 한 근은 켤레근 \$3+\\sqrt{2}\$이다. 근과 계수의 관계에 의하여 \$\$ (3-\\sqrt{2})+(3+\\sqrt{2}) \= 6 \= a+2 \\implies a \= 4 \$\$ \$\$ (3-\\sqrt{2})(3+\\sqrt{2}) \= 9-2 \= 7 \= b-3 \\implies b \= 10 \$\$ 이므로 \$a+b=4+10=14\$이다.

```
{"status": "EXEMPT", "reason": "유리수 계수 이차방정식의 켤레무리근 성질과 근과 계수의 관계로 a, b를 구하는 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $x^2-(a+2)x+(b-3)=0$의 계수가 유리수이므로 다른 근이 $3+\\sqrt{2}$임을 이용해 근과 계수의 관계를 적용한다.", "decisiveStep": "유리수 계수 조건으로 켤레근 $3+\\sqrt{2}$를 확정하고 두 근의 합과 곱을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 유리수 계수 조건에서 켤레근을 확정하고 근과 계수의 관계를 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 교점 방정식에 켤레무리근 성질과 근과 계수의 관계를 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "유리수", "src": "stem", "quote": "유리수 $a, b$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-ax+b$"}], "condition": [{"term": "유리수", "src": "stem", "quote": "유리수 $a, b$에 대하여"}]}, "reasons": {"method": "켤레무리근 3+sqrt(2)와 근과 계수의 관계로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

삼차방정식 \$x^3-3x^2+5x-3=0\$의 두 허근을 \$\\alpha\$, \$\\beta\$라 할 때, \$\\alpha^3+\\beta^3\$의 값은?

### 선지

① \$-14\$ ② \$-10\$ ③ \$-6\$ ④ \$2\$ ⑤ \$8\$

### 정답

②

### 해설

\$x=1\$을 대입하면 \$1-3+5-3=0\$이므로 조립제법으로 인수분해하면 \$\$ x^3-3x^2+5x-3 \= (x-1)(x^2-2x+3) \= 0 \$\$ 이다. \$x^2-2x+3=0\$의 판별식 \$\\frac{D}{4}=1-3=-2\<0\$이므로 두 허근 \$\\alpha, \\beta\$는 이 이차방정식의 두 근이다. 근과 계수의 관계에 의하여 \$\\alpha+\\beta=2\$, \$\\alpha\\beta=3\$이므로 \$\$ \\alpha^3+\\beta^3 \= (\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta) \= 2^3-3\\cdot 3\\cdot 2 \= 8-18 \= \-10 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차방정식을 인수분해해 두 허근의 합과 곱을 구하고 세제곱의 합을 계산하는 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "인수정리로 $(x-1)(x^2-2x+3)=0$으로 분해한 뒤 이차식에서 $\\alpha+\\beta=2, \\alpha\\beta=3$을 얻어 $\\alpha^3+\\beta^3$을 계산한다.", "decisiveStep": "삼차식에서 실근 $x=1$을 떼어내 두 허근이 만족하는 이차식을 분리한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039(DIRECT_ACTIVE): 인수정리로 삼차방정식을 분해해 두 허근의 합과 곱을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식 인수분해, 근과 계수의 관계, 세제곱 합 곱셈 공식을 연결하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "두 허근을 $\\alpha$, $\\beta$라 할 때"}], "method": [{"term": "인수분해", "src": "solution", "quote": "조립제법으로 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-3x^2+5x-3=0$"}], "condition": [{"term": "허근", "src": "stem", "quote": "두 허근을 $\\alpha$, $\\beta$"}]}, "reasons": {"method": "삼차방정식 인수분해 후 두 허근의 합과 곱으로 alpha^3+beta^3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$y=x^2+2(a-k)x+k^2+6k+b\$의 그래프가 실수 \$k\$의 값에 관계없이 항상 \$x\$축에 접할 때, 실수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

\$x\$축에 접하므로 판별식 \$\\dfrac{D}{4}=0\$이 \$k\$에 대한 항등식이어야 한다. \$\$ \\dfrac{D}{4} \= (a-k)^2-(k^2+6k+b) \= \-(2a+6)k+(a^2-b) \= 0 \$\$ 따라서 \$2a+6=0\$, \$a^2-b=0\$이므로 \$a=-3\$, \$b=9\$이고 \$a+b=-3+9=6\$이다.

```
{"status": "EXEMPT", "reason": "x축 접점 판별식이 k에 대한 항등식이 되도록 실수 a, b를 구하는 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 $\\frac{D}{4}=-(2a+6)k+(a^2-b)=0$을 $k$에 대한 항등식으로 풀어 $a=-3, b=9$를 구한다.", "decisiveStep": "$k^2$이 소거된 후 $k$의 계수와 상수항을 각각 $0$으로 둔다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 판별식이 k에 대한 항등식이 되도록 계수비교법으로 a, b를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$축 접점 판별식과 $k$에 대한 항등식 계수 비교를 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $\\dfrac{D}{4}=0$이", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+2(a-k)x+k^2+6k+b$"}], "condition": [{"term": "접함", "src": "stem", "quote": "항상 $x$축에 접할 때"}]}, "reasons": {"method": "판별식 D/4=0을 k에 대한 항등식으로 풀어 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.2

### 발문

연립방정식 \$\\begin{cases}x+y=5\\x^2+y^2=k-2\\end{cases}\$를 만족시키는 실수 \$x, y\$가 존재하도록 하는 자연수 \$k\$의 최솟값은?

### 선지

① \$12\$ ② \$13\$ ③ \$14\$ ④ \$15\$ ⑤ \$16\$

### 정답

④

### 해설

실수 \$x, y\$에 대하여 \$(x-y)^2\\ge 0\$이므로 \$2(x^2+y^2)\\ge (x+y)^2\$이고, \$\$ x^2+y^2 \\ge \\dfrac{(x+y)^2}{2} \= \\dfrac{25}{2} \$\$ 이다. 따라서 \$k-2 \\ge \\dfrac{25}{2}\$, 즉 \$k \\ge \\dfrac{29}{2}=14.5\$이므로 자연수 \$k\$의 최솟값은 \$15\$이다. (실제로 \$k=15\$일 때 \$x+y=5, xy=6\$의 두 실근 \$2, 3\$이 존재한다.)

```
{"status": "EXEMPT", "reason": "연립방정식의 실수해 존재 조건을 완전제곱 부등식 또는 대입 후 판별식>=0으로 푸는 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-ABSOLUTE_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "$(x-y)^2\\ge 0$에서 $x^2+y^2\\ge \\frac{(x+y)^2}{2}=\\frac{25}{2}$를 유도해 $k\\ge 14.5$를 만족하는 최소 자연수 $15$를 구한다.", "decisiveStep": "실수 $x, y$의 존재 조건을 부등식 $x^2+y^2\\ge \\frac{25}{2}$로 전환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "절대부등식", "l4": "산술·기하평균"}, "ptTplCandidate": {"problemTypeKey": "PT_ABSOLUTE_INEQUALITY_EXTREMUM", "templateKey": "TPL_AMGM_MINIMUM", "why": "high1.json H1-RPM-049(DIRECT_BINDING_GAP): 실수 조건에서 완전제곱식 절대부등식으로 최솟값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭 연립방정식의 실근 존재 조건을 완전제곱 부등식으로 판정해 자연수 최솟값을 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "자연수 $k$의 최솟값은?"}], "method": [{"term": "부등식", "src": "solution", "quote": "(x-y)^2\\ge 0", "evidenceType": "IMPLIED", "justification": "완전제곱식 >= 0 성질로 x^2+y^2의 최솟값을 구해 k 범위를 정함"}], "given": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $x, y$가 존재하도록"}]}, "reasons": {"method": "완전제곱 부등식으로 x^2+y^2>=25/2를 구해 최소 자연수 k=15를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q16

- 형식: 객관식  
- 배점: 4.2

### 발문

연립부등식 \$2x-a\<x+2\\le 3x-6\$의 해가 없을 때, 정수 \$a\$의 최댓값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

②

### 해설

두 부등식을 각각 풀면

- \$2x-a\<x+2 \\implies x\<a+2\$  
- \$x+2\\le 3x-6 \\implies 8\\le 2x \\implies x\\ge 4\$ 따라서 \$4\\le x\<a+2\$가 해를 갖지 않으려면 \$a+2\\le 4\$, 즉 \$a\\le 2\$이어야 한다. 그러므로 정수 \$a\$의 최댓값은 \$2\$이다.

```
{"status": "EXEMPT", "reason": "A<B<=C 꼴 연립일차부등식이 해가 없을 경계 조건을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "연립부등식을 $x<a+2$와 $x\\ge 4$로 분해한 뒤 해가 없을 조건 $a+2\\le 4$를 푼다.", "decisiveStep": "등호 포함 경계 $x\\ge 4$와 미포함 경계 $x<a+2$가 만나도 해가 없으므로 $a+2\\le 4$가 됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "해의 범위"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_INTERVAL", "why": "high1.json H1-RPM-045(DIRECT_ACTIVE): 연립일차부등식의 해가 없을 경계 조건을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B12", "difficultyReason": "연립부등식의 해가 없을 조건에서 경계 등호 포함 여부를 판정하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "정수 $a$의 최댓값은?"}], "method": [{"term": "연립부등식", "src": "stem", "quote": "연립부등식 $2x-a<x+2\\le 3x-6$", "evidenceType": "NAMED"}], "given": [{"term": "연립부등식", "src": "stem", "quote": "연립부등식 $2x-a<x+2\\le 3x-6$"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $a$의 최댓값은?"}]}, "reasons": {"method": "두 일차부등식을 분리해 해가 없을 경계 a+2<=4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.5

### 발문

부등식 \$\|ax-2\|\<4\$의 해가 \$-3\<x\<b\$일 때, 실수 \$a, b\$에 대하여 \$ab\$의 값은? (단, \$a\<0\$)

### 선지

① \$-2\$ ② \$-1\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

①

### 해설

\$\|ax-2\|\<4\$에서 \$-4\<ax-2\<4\$, 즉 \$-2\<ax\<6\$이다. \$a\<0\$이므로 양변을 \$a\$로 나누면 부등호 방향이 바뀌어 \$\\dfrac{6}{a}\<x\<-\\dfrac{2}{a}\$이다. 이를 \$-3\<x\<b\$와 비교하면 \$\\dfrac{6}{a}=-3 \\implies a=-2\$이고, \$b=-\\dfrac{2}{-2}=1\$이다. 따라서 \$ab=(-2)\\cdot 1=-2\$이다.

```
{"status": "EXEMPT", "reason": "음수 계수 a를 포함한 절댓값 일차부등식을 풀어 해의 경계를 비교하는 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "$-2<ax<6$을 $a<0$으로 나누어 부등호 방향을 바꾼 $\\frac{6}{a}<x<-\\frac{2}{a}$를 $-3<x<b$와 비교한다.", "decisiveStep": "$a<0$ 조건에 의해 양변을 나눌 때 좌우 경계의 위치가 서로 바뀜을 정확히 처리한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "해의 범위"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_INTERVAL", "why": "high1.json H1-RPM-045(DIRECT_ACTIVE): 음수 계수 나눗셈 시 부등호 방향 전환으로 해의 범위를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 부등식 풀이와 음수 나눗셈 시 부등호 반전을 함께 확인하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}], "method": [{"term": "절댓값", "src": "stem", "quote": "부등식 $|ax-2|<4$", "evidenceType": "IMPLIED", "justification": "절댓값 부등식을 -4<ax-2<4로 푼 뒤 음수 a로 나누어 해를 비교함"}], "given": [{"term": "부등식", "src": "stem", "quote": "부등식 $|ax-2|<4$"}], "condition": [{"term": "음수", "src": "stem", "quote": "단, $a<0$"}]}, "reasons": {"method": "음수 a로 나눌 때 부등호 반전을 적용해 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.5

### 발문

오른쪽 그림과 같이 밑변 \$BC\$의 길이가 \$8\$이고 높이가 \$6\$인 삼각형 \$ABC\$에 내접하는 직사각형 \$PQRS\$가 있다. 다음은 직사각형 \$PQRS\$의 넓이의 최댓값을 구하는 과정이다.

\$\\overline{QR}=\\overline{PS}=x\$, \$\\overline{PQ}=\\overline{SR}=y\$라 하면 \$\\triangle APS \\sim \\triangle ABC\$이므로 \$x:8 \= (\[\\text{빈칸}\]):6\$에서 \$y \= \\text{(가)}\$ 직사각형 \$PQRS\$의 넓이는 \$xy \= \-\\dfrac{3}{4}(x-\\text{(나)})^2+\\text{(다)}\$ 이때 \$0\<x\<8\$이므로 \$xy\$는 \$x=\\text{(라)}\$일 때 최댓값 \$\\text{(다)}\$를 가진다.

(가)의 식을 \$f(x)\$, (나)의 상수를 \$a\$, (다)의 상수를 \$b\$라 할 때, \$abf(4)\$의 값은?

### 선지

① \$96\$ ② \$108\$ ③ \$120\$ ④ \$144\$ ⑤ \$192\$

### 정답

④

### 해설

작은 삼각형 \$APS\$의 높이는 \$6-y\$이므로 닮음비 \$x:8=(6-y):6\$에서 \$\$ 6x \= 48-8y \\implies y \= 6-\\dfrac{3}{4}x \$\$ 이다. 따라서 (가)는 \$f(x)=6-\\dfrac{3}{4}x\$이다. 넓이를 구하면 \$\$ xy \= x\\left(6-\\dfrac{3}{4}x\\right) \= \-\\dfrac{3}{4}x^2+6x \= \-\\dfrac{3}{4}(x-4)^2+12 \$\$ 이므로 (나) \$a=4\$, (다) \$b=12\$, (라) \$4\$이다. \$f(4)=6-\\dfrac{3}{4}\\cdot 4=3\$이므로 \$abf(4) \= 4\\cdot 12\\cdot 3 \= 144\$이다.

```
{"status": "READY", "pattern": "construction-spike-v1", "viewBox": "0 0 360 280", "elements": [{"type": "polygon", "id": "triangle_ABC", "points": [[40, 240], [320, 240], [160, 40]], "labels": ["B", "C", "A"]}, {"type": "polygon", "id": "inscribed_rect_PQRS", "points": [[100, 240], [100, 140], [240, 140], [240, 240]], "labels": ["Q", "P", "S", "R"]}, {"type": "label", "pos": [180, 260], "text": "$8$"}, {"type": "label", "pos": [172, 95], "text": "$6$"}], "note": "밑변 BC=8, 높이 6인 삼각형 ABC의 밑변 BC 위에 QR이 놓이도록 내접한 직사각형 PQRS 도식"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "삼각형 닮음비 $x:8=(6-y):6$으로 $f(x)=6-\\frac{3}{4}x$를 구하고 넓이 $-\\frac{3}{4}(x-4)^2+12$의 계수를 읽어 $abf(4)$를 계산한다.", "decisiveStep": "닮음 비례식에서 작은 삼각형의 높이가 $6-y$임을 파악해 빈칸과 $f(x)$를 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 삼각형 닮음비 조건식으로 넓이의 이차함수 최댓값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각형 내접 직사각형의 닮음 비례식과 이차함수 최대 넓이 유도 빈칸 추론 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "넓이의 최댓값을 구하는 과정"}], "method": [{"term": "이차함수", "src": "solution", "quote": "-\\dfrac{3}{4}(x-4)^2+12", "evidenceType": "IMPLIED", "justification": "닮음비로 y=f(x)를 구한 뒤 넓이를 x에 대한 이차함수로 세워 완전제곱식으로 정리함"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $ABC$에 내접하는 직사각형"}], "condition": [{"term": "내접", "src": "stem", "quote": "내접하는 직사각형 $PQRS$"}]}, "reasons": {"method": "삼각형 닮음비로 f(x)와 넓이 표준형을 구해 abf(4)를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.5

### 발문

실수 \$x, y\$가 \$x+y^2=3\$을 만족시킬 때, \$x^2+2y^2-6x+5\$의 최솟값은?

### 선지

① \$-6\$ ② \$-5\$ ③ \$-4\$ ④ \$-3\$ ⑤ \$-2\$

### 정답

③

### 해설

\$x=3-y^2\$을 주어진 식에 대입하면 \$\$ \\begin{aligned} x^2+2y^2-6x+5 &= (3-y^2)^2+2y^2-6(3-y^2)+5 \\ &= (9-6y^2+y^4)+2y^2-18+6y^2+5 \\ &= y^4+2y^2-4 \\end{aligned} \$\$ 이다. \$y\$는 실수이므로 \$y^2\\ge 0\$, \$y^4\\ge 0\$이고 따라서 \$y^4+2y^2-4\\ge \-4\$이다. (\$y=0, x=3\$일 때 최솟값 \$-4\$)

```
{"status": "EXEMPT", "reason": "x=3-y^2 대입으로 y^2에 대한 식으로 바꾼 뒤 y^2>=0 조건으로 최솟값을 구하는 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$x=3-y^2$을 대입해 $y^4+2y^2-4$로 정리한 뒤 실수 조건 $y^2\\ge 0$으로 최솟값 $-4$를 구한다.", "decisiveStep": "$x$를 소거해 $y^2\\ge 0$의 사차식 $y^4+2y^2-4$를 만들고 $y=0$에서 최소임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 실수 조건 y^2>=0을 반영해 사차식의 최솟값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자 소거 후 실수 제곱 $y^2\\ge 0$ 조건을 이용해 사차식의 최솟값을 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "최솟값은?"}], "method": [{"term": "치환", "src": "solution", "quote": "$x=3-y^2$을 주어진 식에 대입하면", "evidenceType": "IMPLIED", "justification": "x=3-y^2을 대입해 한 문자 y^2의 식으로 정리한 뒤 y^2>=0으로 최솟값을 구함"}], "given": [{"term": "실수", "src": "stem", "quote": "실수 $x, y$가 $x+y^2=3$을 만족시킬 때"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $x, y$가"}]}, "reasons": {"method": "x=3-y^2 대입 후 y^2>=0 조건으로 최솟값 -4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.5

### 발문

다항식 \$x^n(x^2+ax+b)\$를 \$(x-2)^2\$으로 나누었을 때, 나머지가 \$2^{n+1}(x-2)\$가 되도록 하는 상수 \$a, b\$에 대하여 \$a-b\$의 값은? (단, \$n\$은 자연수이다.)

### 선지

① \$-6\$ ② \$-4\$ ③ \$0\$ ④ \$2\$ ⑤ \$-2\$

### 정답

⑤

### 해설

\$x=2+t\$로 치환하면 \$(x-2)^2=t^2\$이고, \$(2+t)^n \= 2^n+n\\cdot 2^{n-1}t+t^2H(t)\$ (단, \$H(t)\$는 다항식)로 쓸 수 있다. 한편 \$(2+t)^2+a(2+t)+b \= (4+2a+b)+(4+a)t+t^2\$이므로, 곱 \$x^n(x^2+ax+b)\$를 \$t^2\$으로 나눈 나머지가 \$2^{n+1}t\$가 되려면 상수항이 \$0\$이어야 한다. 따라서 \$4+2a+b=0\$이고, 이때 일차항의 계수는 \$2^n(4+a)\$이므로 \$\$ 2^n(4+a) \= 2^{n+1} \\implies 4+a \= 2 \\implies a \= \-2 \$\$ 이다. 이를 \$4+2a+b=0\$에 대입하면 \$b=0\$이므로 \$a-b=-2\$이다.

```
{"status": "EXEMPT", "reason": "x=2+t 치환을 통해 (x-2)^2으로 나눈 일차 나머지의 계수를 비교해 a, b를 구하는 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x=2+t$로 치환해 상수항 $4+2a+b=0$과 일차항 계수 $2^n(4+a)=2^{n+1}$을 비교하여 $a=-2, b=0$을 구한다.", "decisiveStep": "$t=x-2$ 치환 후 $t^2$ 이상의 항을 무시해 상수항과 $t$의 일차항 계수만 추출한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): x=2+t 치환을 통해 거듭제곱 다항식 나눗셈의 미정계수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "거듭제곱 $(x-2)^2$ 나눗셈 나머지 조건을 $t=x-2$ 치환으로 푸는 심화 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b$에 대하여 $a-b$의 값은"}], "method": [{"term": "치환", "src": "solution", "quote": "$x=2+t$로 치환하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^n(x^2+ax+b)$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "단, $n$은 자연수이다"}]}, "reasons": {"method": "x=2+t 치환으로 상수항=0과 t 계수 비교를 통해 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

이차방정식 \$x^2-6x+a=0\$이 허근을 가질 때, 방정식 \$\\sqrt{(a-4)^2+\|a\|}=13\$의 해를 구하시오.

### 선지

없음

### 정답

\$a=\\dfrac{7+\\sqrt{661}}{2}\$

### 해설

이차방정식 \$x^2-6x+a=0\$이 허근을 가지므로 판별식 \$D\<0\$이다. \$\$ \\dfrac{D}{4} \= (-3)^2-a \= 9-a \< 0 \\implies a \> 9 \$\$ \$a\>9\$이므로 \$\|a\|=a\$이다. 주어진 방정식의 양변을 제곱하면 \$\$ (a-4)^2+a \= 169 \\implies a^2-8a+16+a-169 \= 0 \\implies a^2-7a-153 \= 0 \$\$ 이다. 근의 공식에 의하여 \$\$ a \= \\dfrac{7\\pm\\sqrt{(-7)^2-4(1)(-153)}}{2} \= \\dfrac{7\\pm\\sqrt{661}}{2} \$\$ 이고, \$a\>9\$를 만족하는 해는 \$a=\\dfrac{7+\\sqrt{661}}{2}\$이다.

```
{"status": "EXEMPT", "reason": "허근 조건 판별식 D<0으로 a>9를 구한 뒤 절댓값과 근호 방정식을 푸는 서술형 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "판별식 $9-a<0$에서 $a>9$를 구해 $|a|=a$로 풀고 양변 제곱 후 근의 공식으로 $a>9$인 근을 택한다.", "decisiveStep": "$a>9$ 조건으로 절댓값 $|a|$를 풀고 마지막에 두 근 중 조건에 맞는 양의 부호 근만 선택한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 허근 조건 D<0에서 절댓값을 풀고 이차방정식의 근을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식 허근 조건과 무리·절댓값 방정식 풀이를 결합한 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "방정식", "src": "stem", "quote": "방정식 $\\sqrt{(a-4)^2+|a|}=13$의 해"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-6x+a=0$"}], "condition": [{"term": "허근", "src": "stem", "quote": "허근을 가질 때"}]}, "reasons": {"method": "판별식 D<0으로 a>9를 얻은 뒤 제곱하여 근의 공식으로 해를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

아래 그림과 같이 이차함수 \$y=f(x)\$의 그래프가 \$x\$축과 만나는 두 점이 각각 \$A, B\$, \$y\$축과 만나는 점이 \$C(0, \-6)\$이다. 축의 방정식이 \$x=2\$이고 삼각형 \$ACB\$의 넓이가 \$24\$일 때, 다음을 구하시오. (1) 점 \$A\$, 점 \$B\$의 좌표를 구하시오. (단, 점 \$A\$의 \$x\$좌표는 점 \$B\$의 \$x\$좌표보다 작다.) (2) 이차함수 \$y=f(x)\$의 식을 구하시오.

### 선지

없음

### 정답

(1) \$A(-2, 0),;B(6, 0)\$ (2) \$f(x)=\\dfrac{1}{2}x^2-2x-6\$

### 해설

(1) 두 점 \$A, B\$는 \$x\$축 위에 있고 점 \$C(0, \-6)\$까지의 높이가 \$\|-6\|=6\$이므로 삼각형 \$ACB\$의 넓이에서 \$\$ \\dfrac{1}{2}\\cdot\\overline{AB}\\cdot 6 \= 24 \\implies \\overline{AB} \= 8 \$\$ 이다. 두 점 \$A(x\_A, 0), B(x\_B, 0)\$ (\$x\_A\<x\_B\$)은 축 \$x=2\$에 대하여 대칭이므로 \$\$ \\dfrac{x\_A+x\_B}{2} \= 2, \\qquad x\_B-x\_A \= 8 \$\$ 이다. 연립하여 풀면 \$x\_A=-2, x\_B=6\$이므로 \$A(-2, 0)\$, \$B(6, 0)\$이다.

(2) \$x\$절편이 \$-2, 6\$이므로 \$f(x)=c(x+2)(x-6)\$ (\$c\\ne 0\$)이라 놓을 수 있다. 점 \$C(0, \-6)\$을 지나므로 \$f(0)=c(2)(-6)=-12c=-6 \\implies c=\\dfrac{1}{2}\$이다. 따라서 \$f(x)=\\dfrac{1}{2}(x+2)(x-6) \= \\dfrac{1}{2}x^2-2x-6\$이다.

```
{"status": "READY", "pattern": "piecewise-polynomial-spike-v1", "viewBox": "0 0 360 280", "elements": [{"type": "curve", "id": "parabola_f", "expr": "0.5*(x+2)*(x-6)", "domain": [-3.5, 7.5], "label": "$y=f(x)$"}, {"type": "dashed_line", "id": "axis_x2", "points": [[2, -9], [2, 5]], "label": "$x=2$"}, {"type": "polygon", "id": "triangle_ACB", "points": [[-2, 0], [0, -6], [6, 0]]}, {"type": "point", "coords": [-2, 0], "label": "$A$"}, {"type": "point", "coords": [6, 0], "label": "$B$"}, {"type": "point", "coords": [0, -6], "label": "$C(0,-6)$"}], "note": "x=2를 축으로 하고 A(-2,0), B(6,0), C(0,-6)을 지나는 아래로 볼록 포물선과 삼각형 ACB 도식"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "삼각형 넓이 $24$로 $\\overline{AB}=8$을 구하고 축 $x=2$의 대칭성으로 $A(-2,0), B(6,0)$을 찾은 뒤 $C(0,-6)$으로 최고차항 계수를 구한다.", "decisiveStep": "축 $x=2$에 대한 대칭성과 밑변 길이 $8$을 연립해 두 $x$절편을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): 이차함수 그래프와 x축 교점 대칭성 및 넓이 조건을 결합함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 대칭성, 삼각형 넓이, $y$절편 대입을 순서대로 결합한 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=f(x)$의 식"}], "method": [{"term": "축", "src": "stem", "quote": "축의 방정식이 $x=2$이고", "evidenceType": "IMPLIED", "justification": "대칭축 x=2와 선분 AB 길이로 두 x절편을 구한 뒤 C(0,-6)으로 이차함수를 결정함"}], "given": [{"term": "넓이", "src": "stem", "quote": "삼각형 $ACB$의 넓이가 $24$일 때"}], "condition": []}, "reasons": {"method": "삼각형 넓이와 대칭축 x=2로 A, B 좌표를 구해 이차함수 식을 결정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

이차함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$f(x)\$를 구하시오.

(가) \$f(-4)=0\$ (나) 모든 실수 \$x\$에 대하여 \$f(-1)\\le f(x)\$이다. (다) 실수 \$p\$에 대하여 \$p\\le x\\le p+2\$에서 함수 \$f(x)\$의 최댓값을 \$g(p)\$라 할 때, 함수 \$g(p)\$의 최솟값이 \$-16\$이다.

### 선지

없음

### 정답

\$f(x)=2(x+1)^2-18\$

### 해설

조건 (나)에 의해 \$f(x)\$는 \$x=-1\$에서 최솟값을 가지므로 \$f(x)=a(x+1)^2+c\$ (\$a\>0\$)로 놓을 수 있다. 조건 (가)에서 \$f(-4)=9a+c=0 \\implies c=-9a\$이므로 \$f(x)=a(x+1)^2-9a\$이다. \$a\>0\$이므로 구간 \$\[p, p+2\]\$에서 \$f(x)\$의 최댓값 \$g(p)\$는 축 \$x=-1\$에서 더 먼 양 끝점 중 하나에서 나타나므로 \$\$ g(p) \= a\\max{(p+1)^2,; (p+3)^2}-9a \$\$ 이다. \$\|p+1\|=\|p+3\|\$일 때 두 끝점이 축 \$x=-1\$로부터 같은 거리에 있어 \$g(p)\$가 최소가 되므로 \$p=-2\$일 때 \$g(-2)=a\\cdot 1-9a=-8a\$이다. 조건 (다)에서 \$-8a=-16 \\implies a=2\$이므로 \$f(x)=2(x+1)^2-18\$ (\$=2x^2+4x-16\$)이다.

```
{"status": "EXEMPT", "reason": "고정 길이 구간 [p, p+2]에서 이차함수 최댓값 g(p)의 최솟값을 대칭성으로 분석해 f(x)를 구하는 문항임"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$f(x)=a(x+1)^2-9a$ ($a>0$)로 설정한 뒤 길이 $2$인 구간 $[p, p+2]$의 최댓값 $g(p)$가 축 $x=-1$이 구간의 중점일 때 최소임을 이용해 $a=2$를 구한다.", "decisiveStep": "구간 $[p, p+2]$의 중점이 축 $x=-1$과 일치하는 $p=-2$에서 최댓값 $g(p)$가 최소가 됨을 포착한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 구간 [p, p+2] 이동에 따른 이차함수의 구간 최댓값·최솟값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이동하는 닫힌 구간에서의 최댓값 함수 $g(p)$의 최솟값을 대칭성으로 해석하는 심화 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$가"}], "method": [{"term": "최댓값", "src": "stem", "quote": "함수 $f(x)$의 최댓값을 $g(p)$라 할 때", "evidenceType": "IMPLIED", "justification": "대칭축이 구간 [p, p+2]의 중앙에 놓일 때 구간 내 최댓값이 최소가 됨을 이용함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$가"}], "condition": [{"term": "최솟값", "src": "stem", "quote": "함수 $g(p)$의 최솟값이 $-16$이다"}]}, "reasons": {"method": "f(x)=a(x+1)^2-9a 설정 후 g(p)의 최솟값 지점 p=-2로 a=2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

