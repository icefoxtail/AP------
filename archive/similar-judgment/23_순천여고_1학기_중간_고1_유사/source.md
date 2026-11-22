

```
{"stem": "23_순천여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/23_순천여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 23, "totalScore": 100.0, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 3.6



### 발문



\$1+i+i^2+\\cdots+i^{11}+\\frac{1}{i^3}\$을 간단히 하면? (단, \$i=\\sqrt{-1}\$이다.)



### 선지



① \$i\$ ② \$-i\$ ③ \$1+i\$ ④ \$1-i\$ ⑤ \$0\$



### 정답



①



### 해설



허수단위 \$i\$의 거듭제곱은 주기가 \$4\$이고 \$1+i+i^2+i^3=1+i-1-i=0\$이다. \$1+i+i^2+\\cdots+i^{11}\$은 연속한 \$4\$개 항의 묶음이 \$3\$개이므로 \$1+i+i^2+\\cdots+i^{11}=0\$ 또한 \$\\frac{1}{i^3}=\\frac{1}{-i}=\\frac{i}{-i^2}=i\$이므로 \$1+i+i^2+\\cdots+i^{11}+\\frac{1}{i^3}=0+i=i\$ 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "i의 거듭제곱 주기성으로 4항씩 묶어 0으로 소거하고 1/i^3=i를 계산해 더한다.", "decisiveStep": "연속한 4개 항의 합이 0임을 이용해 1부터 i^11까지를 한 번에 소거하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): i 거듭제곱 주기 4 합=0으로 분수식 합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허수단위 i의 순환성만 적용하면 바로 풀리는 1단계 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "허수단위", "src": "stem", "quote": "$i=\\sqrt{-1}$"}], "goal": [{"term": "복소수", "src": "stem", "quote": "간단히 하면?"}], "method": [{"term": "거듭제곱", "src": "solution", "quote": "허수단위 $i$의 거듭제곱은 주기가 $4$이고", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.7



### 발문



등식 \$(2-i)\\overline{z}=10i\$를 만족시키는 복소수 \$z\$는? (단, \$\\overline{z}\$는 \$z\$의 켤레복소수이고, \$i=\\sqrt{-1}\$이다.)



### 선지



① \$-2+4i\$ ② \$2-4i\$ ③ \$-2-4i\$ ④ \$4-2i\$ ⑤ \$-4-2i\$



### 정답



③



### 해설



양변을 \$2-i\$로 나누면 \$\\begin{aligned} \\overline{z} &= \\frac{10i}{2-i} \\ &= \\frac{10i(2+i)}{(2-i)(2+i)} \\ &= \\frac{20i+10i^2}{4-i^2} \\ &= \\frac{-10+20i}{5} \= \-2+4i \\end{aligned}\$ 따라서 구하는 복소수 \$z\$는 \$\\overline{z}\$의 켤레복소수이므로 \$z=-2-4i\$이다. 그러므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모의 실수화로 conj(z)=-2+4i를 구한 뒤 켤레복소수를 취해 z=-2-4i를 얻는다.", "decisiveStep": "분모에 켤레복소수 2+i를 곱해 실수화한 뒤 z의 켤레를 다시 취하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 분모의 실수화 후 켤레복소수 z 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 나눗셈과 켤레복소수의 정의를 직접 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z$"}], "goal": [{"term": "켤레복소수", "src": "stem", "quote": "$\\overline{z}$는 $z$의 켤레복소수이고"}], "method": [{"term": "유리화", "src": "solution", "quote": "\\frac{10i(2+i)}{(2-i)(2+i)}", "evidenceType": "IMPLIED", "justification": "분모와 분자에 분모의 켤레복소수 2+i를 곱해 분모를 실수로 만듦"}], "condition": [{"term": "허수단위", "src": "stem", "quote": "$i=\\sqrt{-1}$"}]}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.7



### 발문



이차방정식 \$x^2-4x+7=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\alpha^2+\\beta^2\$의 값은?



### 선지



① \$-2\$ ② \$2\$ ③ \$9\$ ④ \$16\$ ⑤ \$30\$



### 정답



②



### 해설



이차방정식의 근과 계수의 관계에 의하여 \$\\alpha+\\beta=4\$, \$\\alpha\\beta=7\$이다. 곱셈공식의 변형에 의하여 \$\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=4^2-2\\cdot 7=16-14=2\$ 따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근의 방정식 t^2=6t-10으로 분모의 차수를 일차로 낮춘 뒤 통분해 근과 계수의 관계를 적용한다.", "decisiveStep": "분모 t^2-2t+11을 4t+1로 줄여 합 6과 곱 10을 대입한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계와 제곱합 곱셈공식 변형"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계와 곱셈공식 변형을 바로 결합하는 1단계 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-4x+7=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "$\\alpha^2+\\beta^2$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}, {"term": "곱셈공식", "src": "solution", "quote": "곱셈공식의 변형에 의하여", "evidenceType": "NAMED"}], "condition": []}}, "hold": "BINDING_GAP"}
```

## Q04

- 형식: 객관식  
- 배점: 3.8



### 발문



이차함수 \$y=2x^2-3x+a\$의 그래프와 직선 \$y=x+5\$가 접할 때, 상수 \$a\$의 값은?



### 선지



① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$



### 정답



⑤



### 해설



이차함수 \$y=2x^2-3x+a\$의 그래프와 직선 \$y=x+5\$가 접하므로 방정식 \$2x^2-3x+a=x+5\$, 즉 \$2x^2-4x+a-5=0\$ 이 중근을 가져야 한다. 이 이차방정식의 판별식을 \$D\$라 하면 \$\\frac{D}{4}=(-2)^2-2(a-5)=4-2a+10=14-2a=0\$ 따라서 \$a=7\$이다. 그러므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 식을 연립한 이차방정식 2x^2-4x+a-5=0의 판별식 D/4=0을 풀어 a=7을 구한다.", "decisiveStep": "접한다는 조건을 연립방정식의 판별식 D/4=0으로 바꾸는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 이차함수와 직선 접선 조건 판별식 D/4=0"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 접선 조건을 판별식 D=0으로 연결하는 기본 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=2x^2-3x+a$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=x+5$"}], "goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식을 $D$라 하면", "evidenceType": "NAMED"}], "condition": [{"term": "접함", "src": "stem", "quote": "접할 때"}]}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.8



### 발문



삼차방정식 \$x^3+ax^2+bx-5=0\$의 한 근이 \$\\sqrt{5}\$일 때, 유리수 \$a, b\$에 대하여 \$a+b\$의 값은?



### 선지



① \$-6\$ ② \$-5\$ ③ \$-2\$ ④ \$-4\$ ⑤ \$4\$



### 정답



④



### 해설



삼차방정식의 계수가 모두 유리수이고 한 근이 \$\\sqrt{5}\$이므로 켤레근 \$-\\sqrt{5}\$도 근이다. 나머지 한 근을 \$\\gamma\$라 하면 삼차방정식의 근과 계수의 관계에 의하여 세 근의 곱은 \$\\sqrt{5}\\cdot(-\\sqrt{5})\\cdot\\gamma=5 \\implies \-5\\gamma=5 \\implies \\gamma=-1\$ 세 근이 \$\\sqrt{5}, \-\\sqrt{5}, \-1\$이므로 \$-a=\\sqrt{5}+(-\\sqrt{5})+(-1)=-1 \\implies a=1\$ \$b=\\sqrt{5}(-\\sqrt{5})+(-\\sqrt{5})(-1)+(-1)\\sqrt{5}=-5\$ 따라서 \$a+b=1+(-5)=-4\$이다. 그러므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "유리계수 삼차방정식의 켤레근 성질로 -sqrt(5)를 찾고 세 근의 곱으로 나머지 근 -1을 구해 계수 a, b를 정한다.", "decisiveStep": "상수항 -5에서 세 근의 곱으로 나머지 한 근 gamma=-1을 구하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json H1-RPM-031(DIRECT_BINDING_GAP): 유리계수 삼차방정식 켤레근 성질로 계수 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리수 켤레근 성질과 삼차방정식의 근과 계수의 관계를 순차 적용해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3+ax^2+bx-5=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "유리수", "src": "stem", "quote": "유리수 $a, b$에 대하여"}]}}, "hold": "BINDING_GAP"}
```

## Q06

- 형식: 객관식  
- 배점: 3.9



### 발문



두 복소수 \$z\_1, z\_2\$와 그 켤레복소수 \$\\overline{z\_1}, \\overline{z\_2}\$에 대하여 다음 중 옳지 않은 것은? (단, \$i=\\sqrt{-1}\$이다.)



### 선지



① \$z\_1+\\overline{z\_1}\$은 항상 실수이다. ② \$\\overline{z\_1}=-z\_1\$이면 \$z\_1\$은 순허수이다. ③ \$z\_1\\overline{z\_1}\$은 항상 \$0\$ 이상의 실수이다. ④ \$\\overline{z\_1+z\_2}=\\overline{z\_1}+\\overline{z\_2}\$가 성립한다. ⑤ \$z\_1=\\overline{z\_1}\$이고 \$z\_2=\\overline{z\_2}\$이면 \$z\_1 z\_2\$는 실수이다.



### 정답



②



### 해설



\$z\_1=a+bi\$ (\$a, b\$는 실수)라 하면 \$\\overline{z\_1}=a-bi\$이다. ① \$z\_1+\\overline{z\_1}=2a\$이므로 항상 실수이다. (참) ② \$\\overline{z\_1}=-z\_1\$이면 \$a-bi=-a-bi \\implies 2a=0 \\implies a=0\$이므로 \$z\_1=bi\$이다. 이때 \$b=0\$, 즉 \$z\_1=0\$이면 \$z\_1\$은 실수이지 순허수가 아니다. (거짓) ③ \$z\_1\\overline{z\_1}=a^2+b^2\\ge 0\$이므로 항상 \$0\$ 이상의 실수이다. (참) ④, ⑤ 켤레복소수의 성질에 의하여 모두 참이다. 따라서 옳지 않은 것은 ②이다.

```
"NONE"
```

```
{"sourceQid": "6", "variationType": "CONCEPT", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "복소수를 z1=a+bi로 두고 각 선지의 참·거짓을 판별하여 z1=0 반례를 찾는다.", "decisiveStep": "conj(z1)=-z1에서 a=0일 때 b=0인 경우(z1=0)가 순허수가 아님을 확인하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "사칙연산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-023(DIRECT_ACTIVE): 복소수 연산 성질 및 z1=0 반례 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 0이 conj(z)=-z를 만족하지만 순허수가 아니라는 예외를 정확히 짚어야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "복소수", "src": "stem", "quote": "두 복소수 $z_1, z_2$"}], "goal": [{"term": "켤레복소수", "src": "stem", "quote": "그 켤레복소수 $\\overline{z_1}, \\overline{z_2}$에 대하여 다음 중 옳지 않은 것은?"}], "method": [{"term": "반례", "src": "solution", "quote": "이때 $b=0$, 즉 $z_1=0$이면 $z_1$은 실수이지 순허수가 아니다.", "evidenceType": "IMPLIED", "justification": "z1=0이라는 구체적 반례를 들어 명제가 거짓임을 보임"}], "condition": [{"term": "순허수", "src": "choices", "quote": "$z_1$은 순허수이다."}]}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.9



### 발문



절댓값 기호를 포함한 부등식 \$\|x+a\| \\le b\$의 해가 \$-2 \\le x \\le 6\$일 때, 실수 \$a, b\$에 대하여 \$ab\$의 값은? (단, \$b\>0\$이다.)



### 선지



① \$-8\$ ② \$-4\$ ③ \$-2\$ ④ \$4\$ ⑤ \$8\$



### 정답



①



### 해설



\$b\>0\$이므로 \$\|x+a\| \\le b\$를 풀면 \$-b \\le x+a \\le b \\implies \-b-a \\le x \\le b-a\$ 주어진 해가 \$-2 \\le x \\le 6\$이므로 \$-b-a=-2, \\quad b-a=6\$ 두 식을 연립하여 더하면 \$-2a=4 \\implies a=-2\$이고, \$b=4\$이다. 따라서 \$ab=(-2)\\cdot 4=-8\$이다. 그러므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "절댓값 부등식 |x+a|<=b를 -b-a<=x<=b-a로 풀고 양 끝값을 -2, 6과 비교해 연립방정식으로 a, b를 구한다.", "decisiveStep": "부등식 해의 양 끝점 -b-a=-2, b-a=6을 연립하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "해의 범위"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_INTERVAL", "why": "high1.json H1-RPM-045(DIRECT_ACTIVE): 절댓값 일차부등식 해 범위 비교 연립방정식"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 부등식의 해를 구한 뒤 계수와 상수항을 연립하여 역추적하는 기본 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "절댓값", "src": "stem", "quote": "부등식 $|x+a| \\le b$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$ab$의 값은?"}], "method": [{"term": "연립방정식", "src": "solution", "quote": "두 식을 연립하여 더하면", "evidenceType": "IMPLIED", "justification": "양 끝점 식 -b-a=-2와 b-a=6을 연립방정식으로 풀이함"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}]}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4



### 발문



연립방정식 \$\\begin{cases} x-y=2 \\ x^2+y^2=20 \\end{cases}\$의 해를 \$x=\\alpha, y=\\beta\$라 할 때, \$\|\\alpha+\\beta\|\$의 값은?



### 선지



① \$2\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$8\$



### 정답



④



### 해설



\$x-y=2\$의 양변을 제곱하면 \$x^2-2xy+y^2=4\$ 여기에 \$x^2+y^2=20\$을 대입하면 \$20-2xy=4 \\implies xy=8\$이다. 따라서 \$(x+y)^2=x^2+y^2+2xy=20+2\\cdot 8=36\$ 이므로 \$\|\\alpha+\\beta\|=\\sqrt{36}=6\$이다. 그러므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "x-y=2를 제곱해 xy=8을 구한 뒤 (x+y)^2=x^2+y^2+2xy=36에서 |alpha+beta|=6을 구한다.", "decisiveStep": "곱셈공식 변형으로 xy=8을 구하고 (x+y)^2 값을 바로 도출하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈공식 변형으로 (x+y)^2 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차·이차 연립방정식을 직접 해를 구하지 않고 곱셈공식 변형으로 해결할 수 있다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식 $\\begin{cases} x-y=2 \\\\ x^2+y^2=20 \\end{cases}$"}], "goal": [{"term": "절댓값", "src": "stem", "quote": "$|\\alpha+\\beta|$의 값은?"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "$(x+y)^2=x^2+y^2+2xy=20+2\\cdot 8=36$", "evidenceType": "IMPLIED", "justification": "x-y와 x^2+y^2에서 xy를 구하고 (x+y)^2으로 연결하는 곱셈공식 변형을 적용함"}], "condition": []}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4



### 발문



이차함수 \$y=x^2-kx-5\$의 그래프가 \$x\$축과 만나는 두 점 사이의 거리가 \$6\$일 때, \$\|k\|\$의 값은? (단, \$k\$는 상수이다.)



### 선지



① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$



### 정답



③



### 해설



이차함수 \$y=x^2-kx-5\$의 그래프가 \$x\$축과 만나는 두 점의 \$x\$좌표를 \$\\alpha, \\beta\$라 하면 \$\\alpha, \\beta\$는 이차방정식 \$x^2-kx-5=0\$의 두 실근이다. 근과 계수의 관계에 의하여 \$\\alpha+\\beta=k\$, \$\\alpha\\beta=-5\$이다. 두 점 사이의 거리가 \$6\$이므로 \$\|\\alpha-\\beta\|=6\$이고, 양변을 제곱하면 \$(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta=k^2-4(-5)=k^2+20=36\$ 따라서 \$k^2=16\$이므로 \$\|k\|=4\$이다. 그러므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "x축 교점 거리를 |alpha-beta|=6으로 놓고 근과 계수의 관계와 곱셈공식 변형으로 k^2+20=36을 풀어 |k|=4를 구한다.", "decisiveStep": "|alpha-beta|^2=(alpha+beta)^2-4*alpha*beta=36 식을 세우는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): 이차함수 x축 교점 거리와 근과 계수의 관계"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 x절편 사이 거리를 이차방정식 두 근의 차로 전환해 풀어야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-kx-5$"}], "goal": [{"term": "절댓값", "src": "stem", "quote": "$|k|$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}, {"term": "곱셈공식", "src": "solution", "quote": "(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta", "evidenceType": "IMPLIED", "justification": "두 근의 차의 제곱을 합과 곱으로 변형함"}], "condition": [{"term": "거리", "src": "stem", "quote": "두 점 사이의 거리가 $6$일 때"}]}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4



### 발문



연립일차부등식 \$\\begin{cases} 2x+3 \\le k-x \\ 5-4x \\le 2x-7 \\end{cases}\$이 해를 갖도록 하는 정수 \$k\$의 최솟값은?



### 선지



① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$



### 정답



⑤



### 해설



첫 번째 부등식 \$2x+3 \\le k-x\$를 풀면 \$3x \\le k-3 \\implies x \\le \\frac{k-3}{3}\$ 두 번째 부등식 \$5-4x \\le 2x-7\$을 풀면 \$12 \\le 6x \\implies x \\ge 2\$ 이 연립부등식이 해를 가지려면 수직선 위에서 공통부분이 존재해야 하므로 \$2 \\le \\frac{k-3}{3} \\implies 6 \\le k-3 \\implies k \\ge 9\$ 따라서 정수 \$k\$의 최솟값은 \$9\$이다. 그러므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "두 일차부등식을 각각 풀어 x<=(k-3)/3과 x>=2를 얻고, 해가 존재할 조건 2<=(k-3)/3에서 k>=9를 구한다.", "decisiveStep": "공통 해가 존재하기 위한 경계 조건 2<=(k-3)/3(등호 포함)을 세우는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "해의 범위"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_INTERVAL", "why": "high1.json H1-RPM-045(DIRECT_ACTIVE): 연립일차부등식 해가 존재할 k의 범위"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연립부등식이 해를 가질 조건에서 양쪽 부등호가 모두 등호를 포함함을 확인해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "연립일차부등식", "src": "stem", "quote": "연립일차부등식 $\\begin{cases} 2x+3 \\le k-x \\\\ 5-4x \\le 2x-7 \\end{cases}$"}], "goal": [{"term": "최솟값", "src": "stem", "quote": "정수 $k$의 최솟값은?"}], "method": [{"term": "부등식", "src": "solution", "quote": "공통부분이 존재해야 하므로", "evidenceType": "IMPLIED", "justification": "두 부등식 해의 교집합이 공집합이 아니도록 경계 대소 관계를 세움"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $k$"}]}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4



### 발문



다항식 \$3x^3-4x^2+ax+b\$가 \$(x-1)^2\$으로 나누어떨어질 때의 몫을 \$P(x)\$라 하자. 이때 \$P(2)\$의 값은? (단, \$a, b\$는 상수이다.)



### 선지



① \$2\$ ② \$5\$ ③ \$8\$ ④ \$11\$ ⑤ \$14\$



### 정답



③



### 해설



다항식 \$3x^3-4x^2+ax+b\$가 \$(x-1)^2\$으로 나누어떨어지고 최고차항의 계수가 \$3\$이므로, 몫 \$P(x)\$를 \$P(x)=3x+c\$ (\$c\$는 상수)로 놓을 수 있다. \$\\begin{aligned} 3x^3-4x^2+ax+b &= (x-1)^2(3x+c) \\ &= (x^2-2x+1)(3x+c) \\ &= 3x^3+(c-6)x^2+(3-2c)x+c \\end{aligned}\$ 양변의 \$x^2\$의 계수를 비교하면 \$c-6=-4\$이므로 \$c=2\$이다. 따라서 \$P(x)=3x+2\$이므로 \$P(2)=3\\cdot 2+2=8\$이다. 그러므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "몫을 P(x)=3x+c로 놓고 (x-1)^2(3x+c)를 전개해 x^2 계수비교로 c=2를 구한 뒤 P(2)=8을 계산한다.", "decisiveStep": "삼차식을 (x-1)^2으로 나눈 몫을 일차식 3x+c로 설정해 계수비교하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 완전제곱 인수와 몫 설정 후 전개 계수비교"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제수가 완전제곱식일 때 몫을 일차식으로 설정하고 계수비교로 해결하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $3x^3-4x^2+ax+b$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$P(2)$의 값은?"}], "method": [{"term": "항등식", "src": "solution", "quote": "3x^3-4x^2+ax+b &= (x-1)^2(3x+c)", "evidenceType": "IMPLIED", "justification": "나누어떨어진다는 조건으로 나눗셈 항등식을 세움"}, {"term": "계수비교", "src": "solution", "quote": "양변의 $x^2$의 계수를 비교하면", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "$a, b$는 상수이다."}]}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4



### 발문



\$-1 \\le x \\le 3\$에서 이차부등식 \$x^2-4x-a^2+13 \\ge 0\$이 항상 성립하도록 하는 정수 \$a\$의 최댓값은?



### 선지



① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$



### 정답



①



### 해설



\$f(x)=x^2-4x-a^2+13=(x-2)^2+9-a^2\$이라 하자. 이차함수 \$f(x)\$는 아래로 볼록하고 꼭짓점의 \$x\$좌표 \$2\$가 주어진 범위 \$-1 \\le x \\le 3\$에 포함되므로, 이 범위에서 \$f(x)\$의 최솟값은 \$f(2)=9-a^2\$이다. 부등식 \$f(x) \\ge 0\$이 항상 성립하려면 최솟값이 \$0\$ 이상이어야 하므로 \$9-a^2 \\ge 0 \\implies a^2 \\le 9 \\implies \-3 \\le a \\le 3\$ 따라서 정수 \$a\$의 최댓값은 \$3\$이다. 그러므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "f(x)=(x-2)^2+9-a^2의 꼭짓점 x=2가 구간 [-1,3]에 속함을 확인하고 최솟값 f(2)=9-a^2>=0에서 max a=3을 구한다.", "decisiveStep": "제한된 범위에서 이차함수의 최솟값이 꼭짓점 x=2에서 발생함을 판정하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 제한 구간 [-1, 3] 꼭짓점 최솟값 >=0 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한된 범위에서의 이차부등식 절대 성립 조건을 꼭짓점 위치로 판별해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차부등식", "src": "stem", "quote": "이차부등식 $x^2-4x-a^2+13 \\ge 0$"}], "goal": [{"term": "최댓값", "src": "stem", "quote": "정수 $a$의 최댓값은?"}], "method": [{"term": "최솟값", "src": "solution", "quote": "이 범위에서 $f(x)$의 최솟값은 $f(2)=9-a^2$이다.", "evidenceType": "NAMED"}], "condition": [{"term": "항상성립", "src": "stem", "quote": "항상 성립하도록 하는"}]}}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.1



### 발문



\$x\$에 대한 이차방정식 \$(a-3)x^2+(a-b)x-(b-3)=0\$이 중근을 가질 때, \$a+b\$의 값은? (단, \$a, b\$는 상수이다.)



### 선지



① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$



### 정답



⑤



### 해설



주어진 \$x\$에 대한 이차방정식이 중근을 가지므로 판별식 \$D=0\$이어야 한다. \$\\begin{aligned} D &= (a-b)^2-4(a-3){-(b-3)} \\ &= a^2-2ab+b^2+4(ab-3a-3b+9) \\ &= a^2+2ab+b^2-12(a+b)+36 \\ &= (a+b)^2-12(a+b)+36 \\ &= (a+b-6)^2 \= 0 \\end{aligned}\$ 따라서 \$a+b=6\$이다. 그러므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "판별식 D=0을 전개해 (a+b)^2-12(a+b)+36=(a+b-6)^2=0으로 인수분해하여 a+b=6을 구한다.", "decisiveStep": "전개된 판별식 D를 (a+b)에 대한 완전제곱식 (a+b-6)^2=0으로 묶는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 판별식 D=0 완전제곱식 인수분해로 a+b 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 문자 a, b가 섞인 판별식을 전개한 뒤 (a+b)의 완전제곱식으로 정리해야 풀린다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $(a-3)x^2+(a-b)x-(b-3)=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이어야 한다.", "evidenceType": "NAMED"}, {"term": "완전제곱식", "src": "solution", "quote": "(a+b-6)^2 = 0", "evidenceType": "IMPLIED", "justification": "D식을 (a+b-6)^2의 완전제곱식으로 변형함"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 가질 때"}]}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.1



### 발문



삼차방정식 \$x^3-2x^2+2x+5=0\$의 한 허근을 \$\\omega\$라 하고, \$z=\\frac{\\omega}{\\omega-1}\$이라 할 때, \$z+\\overline{z}\$의 값은? (단, \$\\overline{z}\$는 \$z\$의 켤레복소수이다.)



### 선지



① \$\\frac{5}{3}\$ ② \$\\frac{7}{3}\$ ③ \$3\$ ④ \$\\frac{10}{3}\$ ⑤ \$4\$



### 정답



②



### 해설



\$P(x)=x^3-2x^2+2x+5\$라 하면 \$P(-1)=-1-2-2+5=0\$이므로 조립제법으로 인수분해하면 \$x^3-2x^2+2x+5=(x+1)(x^2-3x+5)=0\$ \$\\omega\$는 허근이므로 이차방정식 \$x^2-3x+5=0\$의 한 근이고, 다른 한 허근은 \$\\overline{\\omega}\$이다. 근과 계수의 관계에 의하여 \$\\omega+\\overline{\\omega}=3\$, \$\\omega\\overline{\\omega}=5\$이다. 따라서 \$\\begin{aligned} z+\\overline{z} &= \\frac{\\omega}{\\omega-1}+\\frac{\\overline{\\omega}}{\\overline{\\omega}-1} \\ &= \\frac{\\omega(\\overline{\\omega}-1)+\\overline{\\omega}(\\omega-1)}{(\\omega-1)(\\overline{\\omega}-1)} \\ &= \\frac{2\\omega\\overline{\\omega}-(\\omega+\\overline{\\omega})}{\\omega\\overline{\\omega}-(\\omega+\\overline{\\omega})+1} \\ &= \\frac{2\\cdot 5-3}{5-3+1}=\\frac{7}{3} \\end{aligned}\$ 그러므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "삼차식을 (x+1)(x^2-3x+5)=0으로 인수분해해 허근 w, conj(w)의 합과 곱을 구하고 z+conj(z)를 통분해 대입한다.", "decisiveStep": "인수정리로 (x+1)을 분리한 뒤 이차방정식의 두 허근 합·곱을 z+conj(z) 통분식에 대입하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039(DIRECT_ACTIVE): 삼차식 인수분해 후 허근 켤레합·곱 대입"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식의 실근을 먼저 분리한 후 켤레허근의 대칭식으로 유리식을 계산해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-2x^2+2x+5=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "$z+\\overline{z}$의 값은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "조립제법으로 인수분해하면", "evidenceType": "NAMED"}, {"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여 $\\omega+\\overline{\\omega}=3$, $\\omega\\overline{\\omega}=5$이다.", "evidenceType": "NAMED"}], "condition": [{"term": "허근", "src": "stem", "quote": "한 허근을 $\\omega$라 하고"}]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.1



### 발문



부등식 \$ax^2-2ax-5 \\ge 0\$이 해를 갖지 않도록 하는 정수 \$a\$의 개수는?



### 선지



① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$



### 정답



④



### 해설



(i) \$a=0\$일 때, 주어진 부등식은 \$-5 \\ge 0\$이 되어 해를 갖지 않는다. (ii) \$a \\neq 0\$일 때, 모든 실수 \$x\$에 대하여 \$ax^2-2ax-5 \< 0\$이어야 하므로 \$a \< 0\$이고 판별식 \$D \< 0\$이어야 한다. \$\\frac{D}{4}=(-a)^2-a(-5)=a^2+5a=a(a+5) \< 0 \\implies \-5 \< a \< 0\$ (i), (ii)에 의하여 \$-5 \< a \\le 0\$이므로 정수 \$a\$는 \$-4, \-3, \-2, \-1, 0\$으로 모두 \$5\$개이다. 따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-QUADRATIC_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "a=0인 경우(-5>=0, 해 없음)와 a<0이면서 D/4<0인 경우(-5<a<0)로 나누어 정수 개수를 구한다.", "decisiveStep": "이차항 계수 a=0일 때 상수부등식 -5>=0이 모순이 되어 해가 없음을 빠뜨리지 않고 포함하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "이차부등식", "l4": "근의 위치와 해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_INEQUALITY", "templateKey": "TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL", "why": "high1.json H1-RPM-048(DIRECT_ACTIVE): 이차부등식 해가 존재하지 않을 a=0 및 D/4<0 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_SPLIT", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "최고차항 계수에 미지수 a가 있어 a=0인 일차·상수 케이스를 반드시 분리해야 한다.", "level": "중", "item4slot": {"format": "개수", "slots": {"given": [{"term": "부등식", "src": "stem", "quote": "부등식 $ax^2-2ax-5 \\ge 0$"}], "goal": [{"term": "개수", "src": "stem", "quote": "정수 $a$의 개수는?"}], "method": [{"term": "경우분류", "src": "solution", "quote": "(i) $a=0$일 때", "evidenceType": "IMPLIED", "justification": "이차항 계수 a=0과 a!=0인 경우로 나누어 판정함"}, {"term": "판별식", "src": "solution", "quote": "판별식 $D < 0$이어야 한다.", "evidenceType": "NAMED"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $a$"}]}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.1



### 발문



\$x\$에 대한 이차방정식 \$x^2-(a-3)x+5-a=0\$의 두 근이 모두 정수가 되도록 하는 모든 실수 \$a\$의 값의 합은?



### 선지



① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$



### 정답



①



### 해설



이차방정식의 두 정수근을 \$\\alpha, \\beta\$ (\$lpha \\le \\beta\$)라 하면 근과 계수의 관계에 의하여 \$\\alpha+\\beta=a-3, \\quad \\alpha\\beta=5-a\$ 두 식을 변변 더하여 \$a\$를 소거하면 \$\\alpha\\beta+\\alpha+\\beta=2\$ 양변에 \$1\$을 더하여 인수분해하면 \$(\\alpha+1)(\\beta+1)=3\$ \$\\alpha+1, \\beta+1\$은 정수이고 \$\\alpha \\le \\beta\$이므로 가능한 순서쌍 \$(\\alpha+1, \\beta+1)\$은 \$(1, 3)\$, \$(-3, \-1)\$이다. (i) \$\\alpha+1=1, \\beta+1=3\$일 때, \$\\alpha=0, \\beta=2\$이므로 \$a=\\alpha+\\beta+3=5\$ (ii) \$\\alpha+1=-3, \\beta+1=-1\$일 때, \$\\alpha=-4, \\beta=-2\$이므로 \$a=\\alpha+\\beta+3=-3\$ 따라서 모든 실수 \$a\$의 값의 합은 \$5+(-3)=2\$이다. 그러므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계 두 식에서 a를 소거해 부정방정식 (alpha+1)(beta+1)=3을 만들고 정수해 쌍에서 a=5, -3을 구한다.", "decisiveStep": "a를 소거한 부정방정식 alpha*beta+alpha+beta=2를 (alpha+1)(beta+1)=3으로 인수분해하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계 두 식에서 부정방정식 정수해 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계로 매개변수 a를 소거한 뒤 정수 조건 부정방정식으로 풀어야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-(a-3)x+5-a=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "모든 실수 $a$의 값의 합은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}, {"term": "부정방정식", "src": "solution", "quote": "(\\alpha+1)(\\beta+1)=3", "evidenceType": "IMPLIED", "justification": "두 정수근의 곱 형태 부정방정식으로 인수분해해 순서쌍을 구함"}], "condition": [{"term": "정수", "src": "stem", "quote": "두 근이 모두 정수가 되도록"}]}}, "hold": "BINDING_GAP"}
```

## Q17

- 형식: 객관식  
- 배점: 4.2



### 발문



모든 실수 \$x\$에 대하여 부등식 \$2\|x-2\|+\|x+4\| \\ge k\$가 항상 성립하도록 하는 실수 \$k\$의 최댓값은?



### 선지



① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$



### 정답



⑤



### 해설



\$f(x)=2\|x-2\|+\|x+4\|\$라 하고 절댓값 안이 \$0\$이 되는 \$x=-4, 2\$를 기준으로 구간을 나누면 (i) \$x \< \-4\$일 때, \$f(x)=-2(x-2)-(x+4)=-3x \> 12\$ (ii) \$-4 \\le x \< 2\$일 때, \$f(x)=-2(x-2)+(x+4)=-x+8\$ (\$6 \< f(x) \\le 12\$) (iii) \$x \\ge 2\$일 때, \$f(x)=2(x-2)+(x+4)=3x \\ge 6\$ 따라서 \$f(x)\$는 \$x=2\$에서 최솟값 \$6\$을 가지므로, 부등식 \$f(x) \\ge k\$가 모든 실수 \$x\$에 대하여 성립하려면 \$k \\le 6\$이어야 한다. 그러므로 실수 \$k\$의 최댓값은 \$6\$이다. 따라서 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "x=-4, 2를 기준으로 구간을 나누어 f(x)=2|x-2|+|x+4|의 최솟값이 x=2에서 6임을 구한다.", "decisiveStep": "구간별 일차함수의 증감을 파악해 꺾이는 점 x=2에서 최솟값 6을 찾는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "해의 범위"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_INTERVAL", "why": "high1.json H1-RPM-045(DIRECT_ACTIVE): 절댓값 구간 분류로 함수 f(x) 최솟값 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_SPLIT", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 두 개가 포함된 식을 세 구간으로 나누어 최솟값을 구하는 절대부등식 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "절댓값", "src": "stem", "quote": "부등식 $2|x-2|+|x+4| \\ge k$"}], "goal": [{"term": "최댓값", "src": "stem", "quote": "실수 $k$의 최댓값은?"}], "method": [{"term": "경우분류", "src": "solution", "quote": "기준으로 구간을 나누면", "evidenceType": "NAMED"}], "condition": [{"term": "항상성립", "src": "stem", "quote": "항상 성립하도록 하는"}]}}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.3



### 발문



그림과 같이 \$\\angle C=90^\\circ\$이고 \$\\overline{AC}=10\$, \$\\overline{BC}=5\$인 직각삼각형 \$ABC\$의 빗변 \$AB\$ 위의 점 \$P\$에서 변 \$BC\$, \$AC\$에 내린 수선의 발을 각각 \$Q\$, \$R\$라 하자. 직사각형 \$PQCR\$의 넓이가 두 직각삼각형 \$PBQ\$, \$APR\$의 넓이보다 각각 크도록 하는 선분 \$QC\$의 길이 \$a\$의 값의 범위가 \$m \< a \< n\$일 때, \$m+n\$의 값은?



### 선지



① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$



### 정답



②



### 해설



\$\\overline{QC}=a\$ (\$0 \< a \< 5\$)라 하면 \$\\overline{BQ}=5-a\$이다. \$\\triangle PBQ \\sim \\triangle ABC\$이므로 \$\\overline{PQ}:\\overline{BQ}=\\overline{AC}:\\overline{BC}=10:5=2:1\$이고, \$\\overline{PQ}=2(5-a)=10-2a\$이다. 또한 \$\\overline{PR}=\\overline{QC}=a\$이고 \$\\overline{AR}=10-(10-2a)=2a\$이다. 세 도형의 넓이를 각각 구하면 (직사각형 \$PQCR\$의 넓이) \$=a(10-2a)=10a-2a^2\$ (\$\\triangle PBQ\$의 넓이) \$=\\frac{1}{2}(5-a)(10-2a)=(5-a)^2=a^2-10a+25\$ (\$\\triangle APR\$의 넓이) \$=\\frac{1}{2}\\cdot a\\cdot 2a=a^2\$ 조건에 의하여 (i) \$10a-2a^2 \> a^2-10a+25 \\implies 3a^2-20a+25 \< 0 \\implies (3a-5)(a-5) \< 0 \\implies \\frac{5}{3} \< a \< 5\$ (ii) \$10a-2a^2 \> a^2 \\implies 3a^2-10a \< 0 \\implies a(3a-10) \< 0 \\implies 0 \< a \< \\frac{10}{3}\$ (i), (ii)의 공통 범위는 \$\\frac{5}{3} \< a \< \\frac{10}{3}\$이므로 \$m=\\frac{5}{3}\$, \$n=\\frac{10}{3}\$이다. 따라서 \$m+n=\\frac{5}{3}+\\frac{10}{3}=5\$이다. 그러므로 정답은 ②이다.

```
{
  "stem": {
    "capability": "construction-spike-v1",
    "mode": "PLANE_FIGURE_v1",
    "accessibilityDescription": "각 C가 직각이고 AC=10, BC=5인 직각삼각형 ABC의 빗변 AB 위의 점 P에서 변 BC, AC에 내린 수선의 발을 각각 Q, R로 하여 만든 직사각형 PQCR",
    "planeMarks": {
      "rightAngles": [
        {
          "vertex": "C",
          "rays": [
            "A",
            "B"
          ]
        },
        {
          "vertex": "Q",
          "rays": [
            "P",
            "C"
          ]
        },
        {
          "vertex": "R",
          "rays": [
            "P",
            "C"
          ]
        }
      ],
      "lengths": [
        {
          "from": "A",
          "to": "C",
          "label": "10"
        },
        {
          "from": "B",
          "to": "C",
          "label": "5"
        }
      ]
    },
    "caption": "직각삼각형 ABC 내부에 내접한 직사각형 PQCR"
  },
  "solution": {
    "capability": "construction-spike-v1",
    "mode": "PLANE_FIGURE_v1",
    "accessibilityDescription": "선분 QC의 길이를 a, PQ의 길이를 10-2a로 표시하여 직사각형 PQCR과 두 직각삼각형 PBQ, APR의 넓이를 비교하는 그림",
    "planeMarks": {
      "rightAngles": [
        {
          "vertex": "C",
          "rays": [
            "A",
            "B"
          ]
        },
        {
          "vertex": "Q",
          "rays": [
            "P",
            "C"
          ]
        },
        {
          "vertex": "R",
          "rays": [
            "P",
            "C"
          ]
        }
      ],
      "lengths": [
        {
          "from": "Q",
          "to": "C",
          "label": "a"
        },
        {
          "from": "B",
          "to": "Q",
          "label": "5-a"
        },
        {
          "from": "P",
          "to": "Q",
          "label": "10-2a"
        }
      ]
    },
    "caption": "닮음비를 이용해 각 선분의 길이를 a로 나타낸 도형"
  }
}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-QUADRATIC_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "삼각형 닮음비 2:1로 PQ=10-2a, AR=2a를 표현한 뒤 직사각형 넓이가 두 삼각형 넓이보다 각각 크다는 연립이차부등식을 푼다.", "decisiveStep": "닮음비로 선분 길이를 a에 관한 식으로 표현하고 두 개의 이차부등식을 연립하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "이차부등식", "l4": "근의 위치와 해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_INEQUALITY", "templateKey": "TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL", "why": "high1.json H1-RPM-048(DIRECT_ACTIVE): 닮음비 넓이 조건으로 연립이차부등식 풀이"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 닮음과 연립이차부등식을 결합해 공통 범위를 정확히 구해야 하는 상 난이도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $ABC$"}], "goal": [{"term": "합", "src": "stem", "quote": "$m+n$의 값은?"}], "method": [{"term": "닮음", "src": "solution", "quote": "\\triangle PBQ \\sim \\triangle ABC", "evidenceType": "IMPLIED", "justification": "두 직각삼각형의 닮음비 2:1을 이용해 선분 PQ의 길이를 구함"}, {"term": "연립부등식", "src": "solution", "quote": "(i), (ii)의 공통 범위는", "evidenceType": "IMPLIED", "justification": "두 넓이 조건에서 나온 이차부등식 두 개의 공통 범위를 구함"}], "condition": [{"term": "직사각형", "src": "stem", "quote": "직사각형 $PQCR$"}]}}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.3



### 발문



두 다항식 \$f(x), g(x)\$가 다음 조건을 모두 만족시킬 때, \$g(-1)\$의 값은? (가) \$f(x)+g(x)\$를 \$x-1\$로 나누었을 때의 나머지는 \$6\$이다. (나) \$f(x)-g(x)\$를 \$x-1\$로 나누었을 때의 나머지는 \$2\$이다. (다) \$f(x)\$를 \$x^2-1\$로 나누었을 때의 나머지는 \$3x+1\$이다. (라) \$f(x)g(x)\$를 \$x+1\$로 나누었을 때의 나머지는 \$10\$이다.



### 선지



① \$-8\$ ② \$-7\$ ③ \$-6\$ ④ \$-5\$ ⑤ \$-4\$



### 정답



④



### 해설



나머지정리에 의하여 조건 (가)에서 \$f(1)+g(1)=6\$, 조건 (나)에서 \$f(1)-g(1)=2\$이므로 \$f(1)=4, g(1)=2\$이다. 조건 (다)에서 \$f(x)=(x^2-1)Q(x)+3x+1\$이라 하면 \$f(-1)=3(-1)+1=-2\$ 조건 (라)에서 \$f(-1)g(-1)=10\$이므로 \$-2\\cdot g(-1)=10 \\implies g(-1)=-5\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "조건 (다)의 나눗셈 식에서 f(-1)=-2를 구하고 조건 (라)의 f(-1)g(-1)=10에 대입해 g(-1)=-5를 얻는다.", "decisiveStep": "f(x)를 x^2-1로 나눈 나머지 3x+1에서 f(-1)=-2를 구해 f(-1)g(-1)=10과 연결하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 나눗셈 조건 결합으로 f(-1)g(-1) 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "여러 나머지정리 조건 중 필요한 식을 선별해 연쇄 대입해야 하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $f(x), g(x)$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$g(-1)$의 값은?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "나머지", "src": "stem", "quote": "나머지는 $10$이다."}]}}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.4



### 발문



\$-1 \\le x \\le 3\$에서 이차함수 \$y=x^2-2tx-7\$의 최댓값을 \$g(t)\$라 하자. 방정식 \$g(t)=0\$을 만족시키는 모든 실수 \$t\$의 값의 합은?



### 선지



① \$\\frac{7}{3}\$ ② \$3\$ ③ \$\\frac{10}{3}\$ ④ \$\\frac{11}{3}\$ ⑤ \$4\$



### 정답



③



### 해설



\$f(x)=x^2-2tx-7=(x-t)^2-t^2-7\$은 아래로 볼록하고 대칭축은 \$x=t\$이다. 구간 \$\[-1, 3\]\$의 중점이 \$x=1\$이므로 (i) \$t \\le 1\$일 때, \$x=3\$에서 최댓값을 가지므로 \$g(t)=f(3)=9-6t-7=2-6t\$ \$g(t)=0 \\implies 2-6t=0 \\implies t=\\frac{1}{3}\$ (조건 \$t \\le 1\$을 만족) (ii) \$t \> 1\$일 때, \$x=-1\$에서 최댓값을 가지므로 \$g(t)=f(-1)=1+2t-7=2t-6\$ \$g(t)=0 \\implies 2t-6=0 \\implies t=3\$ (조건 \$t \> 1\$을 만족) 따라서 모든 실수 \$t\$의 값의 합은 \$\\frac{1}{3}+3=\\frac{10}{3}\$이다. 그러므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "구간 [-1, 3]의 중점 x=1을 기준으로 대칭축 x=t의 위치를 나누어 g(t)를 구하고 g(t)=0의 해 t=1/3, 3을 더한다.", "decisiveStep": "구간 중점 x=1을 기준으로 최댓값이 양 끝점 x=3 또는 x=-1에서 결정됨을 분류하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 대칭축 t 위치별 제한 구간 최댓값 g(t) 분석"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_SPLIT", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미지수 축을 갖는 이차함수의 제한 구간 최댓값 함수를 구간 분류로 직접 구성해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-2tx-7$"}], "goal": [{"term": "합", "src": "stem", "quote": "모든 실수 $t$의 값의 합은?"}], "method": [{"term": "축", "src": "solution", "quote": "대칭축은 $x=t$이다.", "evidenceType": "NAMED"}, {"term": "경우분류", "src": "solution", "quote": "(i) $t \\le 1$일 때", "evidenceType": "IMPLIED", "justification": "대칭축 t와 구간 중점 1의 대소에 따라 최댓값 위치를 나눔"}], "condition": [{"term": "최댓값", "src": "stem", "quote": "최댓값을 $g(t)$라 하자."}]}}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 6



### 발문



최고차항의 계수가 \$1\$인 두 이차다항식 \$P(x), Q(x)\$가 다음 조건을 만족시킬 때, \$P(0)+Q(3)\$의 값을 구하는 과정을 상세히 서술하시오. (가) \$(x-2)P(x)=(x+1)Q(x)\$ (나) \$P(x)Q(x)=x^4+3x^3-2x^2-12x-8\$



### 선지



없음



### 정답



\$7\$



### 해설



조건 (가)에서 \$(x-2)P(x)=(x+1)Q(x)\$가 항등식이므로 \$P(x)\$는 \$x+1\$을 인수로 갖고, \$Q(x)\$는 \$x-2\$를 인수로 갖는다. 또한 두 다항식은 최고차항의 계수가 \$1\$인 이차다항식이므로 상수 \$k\$에 대하여 \$P(x)=(x+1)(x-k), \\quad Q(x)=(x-2)(x-k)\$ 로 놓을 수 있다. 조건 (나)에 의하여 \$P(x)Q(x)=(x+1)(x-2)(x-k)^2=x^4+3x^3-2x^2-12x-8\$ 여기서 \$(x+1)(x-2)=x^2-x-2\$이므로 \$x^4+3x^3-2x^2-12x-8\$을 \$x^2-x-2\$로 나누면 \$x^4+3x^3-2x^2-12x-8=(x^2-x-2)(x^2+4x+4)=(x+1)(x-2)(x+2)^2\$ 따라서 \$(x-k)^2=(x+2)^2\$이므로 \$k=-2\$이다. 즉, \$P(x)=(x+1)(x+2)\$, \$Q(x)=(x-2)(x+2)\$이므로 \$P(0)=1\\cdot 2=2\$, \$Q(3)=1\\cdot 5=5\$ 따라서 \$P(0)+Q(3)=2+5=7\$이다.

```
"NONE"
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "(x-2)P(x)=(x+1)Q(x)에서 공통인수 (x-k)를 설정하고 P(x)Q(x)를 x^2-x-2로 나누어 (x+2)^2을 얻어 P, Q를 확정한다.", "decisiveStep": "항등식 조건으로 P(x)=(x+1)(x-k), Q(x)=(x-2)(x-k)의 꼴을 도출하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 다항식 나눗셈 공통인수 설정으로 P, Q 확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 항등식의 인수 공유 조건을 분석하고 사차식을 인수분해하여 서술해야 한다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "두 이차다항식 $P(x), Q(x)$"}], "goal": [{"term": "합", "src": "stem", "quote": "$P(0)+Q(3)$의 값을 구하는 과정을"}], "method": [{"term": "항등식", "src": "solution", "quote": "$(x-2)P(x)=(x+1)Q(x)$가 항등식이므로", "evidenceType": "NAMED"}, {"term": "인수분해", "src": "solution", "quote": "(x+1)(x-2)(x+2)^2", "evidenceType": "IMPLIED", "justification": "사차식을 이차식 x^2-x-2로 나누어 완전제곱식 (x+2)^2을 구함"}], "condition": [{"term": "최고차항", "src": "stem", "quote": "최고차항의 계수가 $1$인"}]}}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7



### 발문



그림과 같이 이차함수 \$y=f(x)\$의 그래프와 기울기가 \$2\$인 직선 \$y=g(x)\$에 대하여 부등식 \$f(x) \\ge g(x)\$의 해가 \$-1 \\le x \\le 1\$이고, \$f(-2)=f(4)=0\$일 때, \$f(x)\$와 \$g(x)\$를 각각 구하는 과정을 상세히 서술하시오.



### 선지



없음



### 정답



\$f(x)=-x^2+2x+8\$, \$g(x)=2x+7\$



### 해설



\$f(-2)=f(4)=0\$이므로 이차함수 \$f(x)\$를 \$f(x)=a(x+2)(x-4)=a(x^2-2x-8)=ax^2-2ax-8a\$ (\$a \\neq 0\$) 로 놓을 수 있다. 부등식 \$f(x) \\ge g(x)\$, 즉 \$f(x)-g(x) \\ge 0\$의 해가 \$-1 \\le x \\le 1\$이므로 이차항의 계수 \$a \< 0\$이고 \$f(x)-g(x)=a(x+1)(x-1)=a(x^2-1)=ax^2-a\$ 이다. 따라서 \$\\begin{aligned} g(x) &= f(x)-{f(x)-g(x)} \\ &= (ax^2-2ax-8a)-(ax^2-a) \\ &= \-2ax-7a \\end{aligned}\$ 직선 \$y=g(x)\$의 기울기가 \$2\$이므로 \$-2a=2 \\implies a=-1\$ (\$a\<0\$을 만족)이다. 그러므로 구하는 두 식은 \$f(x)=-x^2+2x+8\$, \$g(x)=2x+7\$이다.

```
{
  "stem": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "8",
        "2",
        "-1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -3,
        5
      ],
      "viewport": [
        -3,
        5,
        -3,
        11
      ],
      "referenceLines": [
        {
          "id": "g",
          "slope": "2",
          "intercept": "7"
        }
      ],
      "requiredPoints": [
        {
          "id": "A",
          "x": -2,
          "y": 0
        },
        {
          "id": "B",
          "x": 4,
          "y": 0
        }
      ],
      "axisTickValues": {
        "x": [
          -2,
          4
        ],
        "y": []
      }
    },
    "caption": "이차함수 y=f(x)의 그래프와 기울기가 2인 직선 y=g(x)"
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "8",
        "2",
        "-1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -3,
        5
      ],
      "viewport": [
        -3,
        5,
        -3,
        11
      ],
      "referenceLines": [
        {
          "id": "g",
          "slope": "2",
          "intercept": "7"
        }
      ],
      "requiredPoints": [
        {
          "id": "A",
          "x": -2,
          "y": 0
        },
        {
          "id": "B",
          "x": 4,
          "y": 0
        },
        {
          "id": "P",
          "x": -1,
          "y": 5
        },
        {
          "id": "Q",
          "x": 1,
          "y": 9
        }
      ],
      "axisTickValues": {
        "x": [
          -2,
          -1,
          1,
          4
        ],
        "y": []
      }
    },
    "caption": "두 교점의 x좌표가 -1과 1일 때 f(x)>=g(x)의 해는 -1<=x<=1이다."
  }
}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-QUADRATIC_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "f(-2)=f(4)=0에서 f(x)=a(x+2)(x-4), 해 -1<=x<=1에서 f(x)-g(x)=a(x^2-1)을 세워 g(x)=-2ax-7a의 기울기 2로 a=-1을 구한다.", "decisiveStep": "f(x)에서 f(x)-g(x)를 빼서 g(x)의 기울기 -2a=2를 도출하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "이차부등식", "l4": "근의 위치와 해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_INEQUALITY", "templateKey": "TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL", "why": "high1.json H1-RPM-048(DIRECT_ACTIVE): 이차부등식 해 조건으로 f(x), g(x) 식 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "그래프의 x절편과 부등식 해집합 조건을 두 개의 인수식으로 세워 차를 이용해 직선을 구해야 한다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=f(x)$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=g(x)$"}], "goal": [{"term": "다항식", "src": "stem", "quote": "$f(x)$와 $g(x)$를 각각 구하는 과정을"}], "method": [{"term": "인수", "src": "solution", "quote": "f(x)=a(x+2)(x-4)", "evidenceType": "IMPLIED", "justification": "x절편과 부등식 해의 경계를 이용해 두 식을 인수 형태로 설정함"}], "condition": [{"term": "기울기", "src": "stem", "quote": "기울기가 $2$인"}]}}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 7



### 발문



그림과 같이 이차함수 \$y=x^2-16\$의 그래프와 \$x\$축으로 둘러싸인 부분에 내접하는 직사각형 \$ABCD\$의 두 꼭짓점 \$A, D\$는 \$x\$축 위에 있고, 두 꼭짓점 \$B, C\$는 이차함수 \$y=x^2-16\$의 그래프 위에 있다. 제\$4\$사분면 위의 점 \$C\$의 좌표를 \$(t, t^2-16)\$이라 할 때, 다음 물음에 답하시오. (1) 직사각형 \$ABCD\$의 둘레의 길이 \$L(t)\$를 \$t\$에 대한 식으로 나타내고, \$t\$의 값의 범위를 구하시오. \[4점\] (2) 직사각형 \$ABCD\$의 둘레의 길이 \$L(t)\$의 최댓값을 구하시오. \[3점\]



### 선지



없음



### 정답



(1) \$L(t)=-2t^2+4t+32\$ (\$0 \< t \< 4\$), (2) \$34\$



### 해설



(1) 이차함수 \$y=x^2-16\$의 그래프가 \$x\$축과 만나는 점의 \$x\$좌표는 \$x^2-16=0\$에서 \$x=-4\$ 또는 \$x=4\$이다. 점 \$C(t, t^2-16)\$이 제\$4\$사분면 위에 있으므로 \$0 \< t \< 4\$이다. 그래프가 \$y\$축에 대하여 대칭이므로 \$\\overline{BC}=2t\$이고, 세로의 길이는 \$\\overline{CD}=0-(t^2-16)=16-t^2\$이다. 따라서 직사각형 \$ABCD\$의 둘레의 길이 \$L(t)\$는 \$L(t)=2(2t+16-t^2)=-2t^2+4t+32\$ (\$0 \< t \< 4\$) (2) \$L(t)=-2t^2+4t+32=-2(t-1)^2+34\$ \$0 \< t \< 4\$에서 이차함수 \$L(t)\$는 위로 볼록하고 꼭짓점의 좌표 \$t=1\$이 범위에 속하므로 \$t=1\$일 때 최댓값 \$34\$를 갖는다.

```
{
  "stem": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "-16",
        "0",
        "1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -5,
        5
      ],
      "viewport": [
        -5,
        5,
        -18,
        4
      ],
      "requiredPoints": [
        {
          "id": "C",
          "x": 2,
          "y": -12
        }
      ],
      "axisTickValues": {
        "x": [
          -4,
          4
        ],
        "y": [
          -16
        ]
      }
    },
    "caption": "포물선 y=x^2-16과 x축 사이에 내접하는 직사각형 ABCD"
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "-16",
        "0",
        "1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -5,
        5
      ],
      "viewport": [
        -5,
        5,
        -18,
        4
      ],
      "requiredPoints": [
        {
          "id": "C",
          "x": 1,
          "y": -15
        }
      ],
      "axisTickValues": {
        "x": [
          -4,
          1,
          4
        ],
        "y": [
          -16
        ]
      }
    },
    "caption": "t=1일 때 직사각형 ABCD의 둘레의 길이가 최대가 된다."
  }
}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "포물선의 y축 대칭성으로 가로 2t, 세로 16-t^2을 구해 둘레 L(t)=-2t^2+4t+32 (0<t<4)를 세우고 완전제곱식으로 최댓값 34를 구한다.", "decisiveStep": "세로 길이를 -(t^2-16)=16-t^2으로 정확히 부호 반전하고 L(t)=-2(t-1)^2+34로 변형하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 포물선 대칭성 활용 직사각형 둘레 이차함수 최댓값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "좌표의 부호에 주의하여 세로 길이를 양수로 표현하고 제한 범위에서 최댓값을 구해야 한다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-16$"}, {"term": "직사각형", "src": "stem", "quote": "직사각형 $ABCD$"}], "goal": [{"term": "둘레", "src": "stem", "quote": "둘레의 길이 $L(t)$를"}, {"term": "최댓값", "src": "stem", "quote": "둘레의 길이 $L(t)$의 최댓값을 구하시오."}], "method": [{"term": "대칭성", "src": "solution", "quote": "$y$축에 대하여 대칭이므로", "evidenceType": "IMPLIED", "justification": "포물선 y=x^2-16의 y축 대칭성을 이용해 가로 길이를 2t로 구함"}, {"term": "완전제곱식", "src": "solution", "quote": "-2(t-1)^2+34", "evidenceType": "IMPLIED", "justification": "이차함수를 표준형으로 변형해 꼭짓점에서 최댓값을 구함"}], "condition": [{"term": "사분면", "src": "stem", "quote": "제$4$사분면 위의 점 $C$"}]}}, "hold": ""}
```

