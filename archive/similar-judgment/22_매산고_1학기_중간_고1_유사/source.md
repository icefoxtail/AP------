

```
{"stem": "22_매산고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_매산고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 20, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.6

### 발문

두 다항식 \$A=5x^3-4x^2+7x\$, \$B=3x^3-2x+4\$에 대하여 \$3(A-X)+B=4B\$일 때, 다항식 \$X\$의 \$x\$의 계수를 구하면?

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

④

### 해설

주어진 등식을 \$X\$에 대하여 정리하면 \$\$ \\begin{aligned} 3A-3X+B &= 4B \\ 3X &= 3A-3B \\ X &= A-B \\end{aligned} \$\$ 여기에 \$A\$, \$B\$를 대입하여 계산하면 \$\$ \\begin{aligned} X &= (5x^3-4x^2+7x)-(3x^3-2x+4) \\ &= 2x^3-4x^2+9x-4 \\end{aligned} \$\$ 따라서 다항식 \$X\$의 \$x\$의 계수는 \$9\$이다.

```
{"status": "EXEMPT", "reason": "다항식 일차방정식을 정리해 차를 구하는 순수 연산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "등식 $3(A-X)+B=4B$를 $X=A-B$로 정리한 뒤 $A, B$를 대입하여 $x$항의 계수를 구한다.", "decisiveStep": "$3X=3A-3B$에서 $X=A-B$를 도출해 $7x-(-2x)=9x$를 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 다항식 등식을 X=A-B로 정리해 동류항 계수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 사칙연산으로 미지 다항식 $X$를 정리하고 동류항 계수를 읽는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "의 계수를 구하면?"}], "method": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=5x^3-4x^2+7x$", "evidenceType": "IMPLIED", "justification": "등식을 정리해 다항식 X=A-B를 구하는 다항식 연산"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $X$의"}], "condition": []}, "reasons": {"method": "등식을 X=A-B로 정리한 뒤 다항식의 뺄셈으로 x의 계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$f(x)=2x^3+3x^2-4x+7\$을 \$x+2\$로 나눈 나머지를 구하면?

### 선지

① \$11\$ ② \$9\$ ③ \$7\$ ④ \$5\$ ⑤ \$3\$

### 정답

①

### 해설

나머지정리에 의하여 다항식 \$f(x)\$를 \$x+2\$로 나눈 나머지는 \$f(-2)\$이다. \$\$ \\begin{aligned} f(-2) &= 2(-2)^3+3(-2)^2-4(-2)+7 \\ &= \-16+12+8+7 \\ &= 11 \\end{aligned} \$\$ 따라서 구하는 나머지는 \$11\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리로 x=-2를 대입해 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리에 따라 다항식 $f(x)=2x^3+3x^2-4x+7$에 $x=-2$를 대입해 $f(-2)$를 계산한다.", "decisiveStep": "$f(-2)=-16+12+8+7=11$을 계산해 나머지를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009(RPM_ONLY): 일차식 x+2로 나눈 나머지를 나머지정리 f(-2)로 구하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 $x+2$로 나눈 나머지에 나머지정리를 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지를 구하면?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)=2x^3+3x^2-4x+7$"}], "condition": []}, "reasons": {"method": "나머지정리로 x=-2를 대입해 나머지를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 3.9

### 발문

복소수 \$z=6-5i\$일 때, \$z+\\overline{z}\$의 값은?

### 선지

① \$6\$ ② \$10\$ ③ \$12\$ ④ \$14\$ ⑤ \$16\$

### 정답

③

### 해설

\$z=6-5i\$의 켤레복소수는 \$\\overline{z}=6+5i\$이므로 \$\$ z+\\overline{z} \= (6-5i)+(6+5i) \= 12 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수와 켤레복소수의 합을 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "복소수 $z=6-5i$의 켤레복소수 $\\overline{z}=6+5i$를 구해 두 복소수를 더한다.", "decisiveStep": "허수부분이 상쇄되어 $z+\\overline{z}=6+6=12$를 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 복소수와 켤레복소수의 합을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레복소수를 구한 뒤 합산하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "z+\\overline{z} = (6-5i)+(6+5i)"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수는 $\\overline{z}=6+5i$", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=6-5i$"}], "condition": []}, "reasons": {"method": "켤레복소수를 구해 원 복소수와 더하여 실수부의 2배를 얻음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.2

### 발문

\$x\$, \$y\$에 대한 이차식 \$x^2-2xy+y^2-5x+5y+6\$을 인수분해하면?

### 선지

① \$(x+y-2)(x+y-3)\$ ② \$(x-y-2)(x-y-3)\$ ③ \$(x-y+2)(x-y+3)\$ ④ \$(x-y-1)(x-y-6)\$ ⑤ \$(x+y+2)(x-y-3)\$

### 정답

②

### 해설

앞의 세 항을 묶고 일차항을 \$(x-y)\$로 묶으면 \$\$ \\begin{aligned} x^2-2xy+y^2-5x+5y+6 &= (x-y)^2-5(x-y)+6 \\ &= {(x-y)-2}{(x-y)-3} \\ &= (x-y-2)(x-y-3) \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "공통부분 x-y로 치환해 이차식을 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$x^2-2xy+y^2=(x-y)^2$으로 묶어 공통부분 $(x-y)$에 대한 이차식 $(x-y)^2-5(x-y)+6$을 인수분해한다.", "decisiveStep": "일차항 $-5x+5y$를 $-5(x-y)$로 묶어 치환 꼴을 완성한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 공통부분 (x-y)를 묶어 치환 꼴로 단계적 인수분해함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식 묶기와 공통부분 치환을 결합해 두 일차식의 곱으로 인수분해하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하면?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x-y)^2-5(x-y)+6", "evidenceType": "IMPLIED", "justification": "앞의 세 항을 (x-y)^2 완전제곱식으로 묶어 치환함"}], "given": [{"term": "이차식", "src": "stem", "quote": "$x$, $y$에 대한 이차식"}], "condition": []}, "reasons": {"method": "(x-y)를 공통부분으로 묶어 이차식 인수분해를 적용함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.2

### 발문

\$a\$, \$b\$, \$c\$가 양수이고 \$a^3+b^3+c^3=3abc\$일 때, \$\\dfrac{3b+2c}{5a}+\\dfrac{a-4c}{3b}+\\dfrac{8a+b}{3c}\$의 값은?

### 선지

① \$1\$ ② \$\\dfrac{3}{2}\$ ③ \$2\$ ④ \$\\dfrac{5}{2}\$ ⑤ \$3\$

### 정답

⑤

### 해설

인수분해 공식에 의하여 \$\$ a^3+b^3+c^3-3abc \= \\frac{1}{2}(a+b+c){(a-b)^2+(b-c)^2+(c-a)^2} \= 0 \$\$ \$a, b, c\$가 모두 양수이므로 \$a+b+c\>0\$이고, 따라서 \$\$ (a-b)^2+(b-c)^2+(c-a)^2 \= 0 \\implies a \= b \= c \$\$ 이다. 이를 주어진 식에 대입하면 \$\$ \\frac{3a+2a}{5a}+\\frac{a-4a}{3a}+\\frac{8a+a}{3a} \= \\frac{5a}{5a}+\\frac{-3a}{3a}+\\frac{9a}{3a} \= 1+(-1)+3 \= 3 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "세제곱 항등식 인수분해로 a=b=c를 도출해 분수식을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$a^3+b^3+c^3-3abc=\\frac{1}{2}(a+b+c)\\{(a-b)^2+(b-c)^2+(c-a)^2\\}=0$과 $a,b,c>0$ 조건으로 $a=b=c$를 얻어 대입한다.", "decisiveStep": "$a+b+c>0$이므로 세 제곱의 합이 $0$이 되어 $a=b=c$임을 확정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): a^3+b^3+c^3-3abc=0 인수분해 조건식으로 a=b=c를 도출함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 문자 세제곱 인수분해 공식과 양수 조건을 결합해 $a=b=c$를 도출하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "1+(-1)+3 = 3"}], "method": [{"term": "인수분해", "src": "solution", "quote": "인수분해 공식에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "실수", "src": "stem", "quote": "$a$, $b$, $c$가 양수이고"}], "condition": []}, "reasons": {"method": "a^3+b^3+c^3-3abc 인수분해 공식으로 a=b=c를 구해 대입함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.3

### 발문

\$x\$에 대한 이차방정식 \$(k-2)x^2+4(k-2)x+3k-2=0\$이 실근을 가질 때, 실수 \$k\$의 값이 될 수 없는 것은?

### 선지

① \$4\$ ② \$-1\$ ③ \$0\$ ④ \$6\$ ⑤ \$8\$

### 정답

①

### 해설

주어진 식이 \$x\$에 대한 이차방정식이므로 \$k-2\\ne 0\$, 즉 \$k\\ne 2\$이다. (\$k=2\$일 때는 \$4=0\$이 되어 성립하지도 않는다.) 이차방정식이 실근을 가지려면 판별식 \$D\\ge 0\$이어야 하므로 \$\$ \\begin{aligned} \\frac{D}{4} &= {2(k-2)}^2-(k-2)(3k-2) \\ &= (k-2){4(k-2)-(3k-2)} \\ &= (k-2)(k-6) \\ge 0 \\end{aligned} \$\$ \$k\\ne 2\$이므로 이를 풀면 \$k\<2\$ 또는 \$k\\ge 6\$이다. 보기 중 이 범위에 속하지 않는 값은 \$4\$뿐이다.

```
{"status": "EXEMPT", "reason": "이차방정식 최고차항 조건과 판별식 부등식으로 가능한 k 범위를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "이차방정식 조건 $k\\ne 2$와 실근 조건 $D/4=(k-2)(k-6)\\ge 0$을 결합해 $k<2$ 또는 $k\\ge 6$을 구한다.", "decisiveStep": "판별식 $D/4=(k-2)(k-6)\\ge 0$을 인수분해하여 불가능한 구간 $2\\le k<6$을 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식 조건 k!=2와 실근 판별식 D>=0을 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "최고차항 계수 조건($k\\ne 2$) 확인과 판별식 이차부등식을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값이 될 수 없는"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D\\ge 0$", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $(k-2)x^2+4(k-2)x+3k-2=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "실근을 가질 때"}]}, "reasons": {"method": "이차방정식의 실근 조건 D>=0과 최고차항 계수 조건으로 범위를 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.5

### 발문

이차함수 \$y=x^2-2x+5\$의 그래프와 직선 \$y=4x-m+2\$가 만나지 않도록 하는 자연수 \$m\$의 최솟값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

④

### 해설

이차함수 \$y=x^2-2x+5\$의 그래프와 직선 \$y=4x-m+2\$의 교점의 \$x\$좌표는 방정식 \$\$ x^2-2x+5 \= 4x-m+2 \\implies x^2-6x+(m+3) \= 0 \$\$ 의 실근이다. 두 그래프가 만나지 않으려면 이 이차방정식이 실근을 갖지 않아야 하므로 판별식 \$D\<0\$이어야 한다. \$\$ \\frac{D}{4} \= (-3)^2-(m+3) \= 6-m \< 0 \\implies m \> 6 \$\$ 따라서 조건을 만족하는 자연수 \$m\$의 최솟값은 \$7\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-1, 5], "viewport": [-1, 5, -6, 20], "pieces": [{"domain": [-1, 5], "coefficients": ["5", "-2", "1"]}], "referenceLines": [{"slope": "4", "intercept": "-5", "label": "y=4x-5 (m=7)"}], "requiredPoints": [{"id": "V", "x": "1", "y": "4", "label": "꼭짓점(1, 4)"}]}, "caption": "m=7일 때 만나지 않는 이차함수 y=x^2-2x+5와 직선 y=4x-5"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 식을 연립한 방정식 $x^2-6x+(m+3)=0$이 만나지 않도록 판별식 $D/4=6-m<0$을 풀어 자연수 최솟값을 구한다.", "decisiveStep": "$m>6$ 부등식을 얻어 최소 자연수 $m=7$을 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 이차함수와 직선이 만나지 않을 조건 D<0을 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 위치 관계를 연립방정식의 판별식 $D<0$으로 해석하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "자연수 $m$의 최솟값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-2x+5$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=4x-m+2$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $m$의"}]}, "reasons": {"method": "연립이차방정식의 판별식 D<0으로 m>6을 구해 최소 자연수를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.4

### 발문

연립방정식 \$\\begin{cases} x^2+xy-2y=24 \\ x^2-y^2=0 \\end{cases}\$의 해를 \$\\begin{cases} x=\\alpha \\ y=\\beta \\end{cases}\$라 할 때, \$\\alpha+\\beta\$의 최댓값은?

### 선지

① \$6\$ ② \$8\$ ③ \$10\$ ④ \$12\$ ⑤ \$14\$

### 정답

②

### 해설

둘째 식 \$x^2-y^2=(x-y)(x+y)=0\$에서 \$x=y\$ 또는 \$x=-y\$이다.

1) \$x=y\$인 경우 첫째 식에 대입하면 \$\$ 2x^2-2x-24=0 \\implies x^2-x-12=0 \\implies (x-4)(x+3)=0 \$\$ 이므로 해는 \$(4, 4)\$, \$(-3, \-3)\$이고, 이때 \$\\alpha+\\beta\$의 값은 각각 \$8\$, \$-6\$이다.  
2) \$x=-y\$인 경우 첫째 식에 대입하면 \$\$ y^2-y^2-2y=24 \\implies \-2y=24 \\implies y=-12 \$\$ 이므로 해는 \$(12, \-12)\$이고, 이때 \$\\alpha+\\beta=0\$이다. 따라서 \$\\alpha+\\beta\$의 최댓값은 \$8\$이다.

```
{"status": "EXEMPT", "reason": "인수분해 가능한 연립이차방정식을 두 경우로 나누어 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-SUBSTITUTION_SYSTEM", "conceptClusterKey": null, "primaryMethod": "$x^2-y^2=0$을 $x=y$와 $x=-y$ 두 경우로 나누어 $x^2+xy-2y=24$에 대입하고 모든 해의 $\\alpha+\\beta$를 비교한다.", "decisiveStep": "$x=y$일 때 $x^2-x-12=0$에서 해 $(4,4)$를 얻어 최댓값 $8$을 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "연립방정식", "l4": "이차식이 포함된 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_SYSTEM_EQUATION", "templateKey": "TPL_H1_SYSTEM_DIRECT", "why": "high1.json H1-RPM-041(DIRECT_ACTIVE): 인수분해 가능한 이차연립방정식을 x=±y로 분기해 풂"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수분해되는 이차식으로부터 두 일차식을 얻어 각각 대입해 최대 합을 비교하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "$\\alpha+\\beta$의 최댓값은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "x^2-y^2=(x-y)(x+y)=0", "evidenceType": "IMPLIED", "justification": "둘째 식을 인수분해하여 두 일차 관계식 x=y, x=-y로 분리함"}], "given": [{"term": "방정식", "src": "stem", "quote": "연립방정식"}], "condition": []}, "reasons": {"method": "둘째 식 인수분해로 얻은 x=±y를 첫째 식에 대입해 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.4

### 발문

복소수 \$z=(1+i)x^2-(6+i)x+9+4i\$에 대하여 \$z^2\$이 음의 실수일 때, 실수 \$x\$의 값은?

### 선지

① \$-3\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$3\$

### 정답

⑤

### 해설

복소수 \$z\$를 실수부분과 허수부분으로 정리하면 \$\$ z \= (x^2-6x+9)+(x^2-x+4)i \= (x-3)^2+(x^2-x+4)i \$\$ \$z^2\$이 음의 실수가 되려면 \$z\$가 순허수이어야 하므로 실수부분이 \$0\$이고 허수부분이 \$0\$이 아니어야 한다. \$\$ (x-3)^2 \= 0 \\implies x \= 3 \$\$ 이때 허수부분은 \$3^2-3+4=10\\ne 0\$이므로 \$z=10i\$, \$z^2=-100\<0\$으로 조건을 만족한다. 따라서 \$x=3\$이다.

```
{"status": "EXEMPT", "reason": "복소수 제곱이 음의 실수가 되는 순허수 조건으로 x를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z$를 실수부분 $(x-3)^2$과 허수부분 $(x^2-x+4)$로 정리하고, $z^2<0$ 조건인 순허수(실수부 $0$, 허수부 $\\ne 0$)를 적용한다.", "decisiveStep": "$z^2$이 음의 실수일 조건이 $z$의 순허수 조건임을 이용해 $(x-3)^2=0$에서 $x=3$을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): z^2<0(순허수 조건)에서 실수부 0, 허수부!=0을 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 제곱이 음의 실수가 될 조건을 순허수 조건으로 바꾸어 푸는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $x$의 값은?"}], "method": [{"term": "실수부분", "src": "solution", "quote": "실수부분과 허수부분으로 정리하면", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=(1+i)x^2-(6+i)x+9+4i$"}], "condition": [{"term": "허수부분", "src": "solution", "quote": "허수부분이 $0$이 아니어야"}]}, "reasons": {"method": "z를 실수부·허수부로 정리해 순허수 조건으로 x를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.4

### 발문

방정식 \$x^3=-1\$의 한 허근을 \$\\omega\$라 할 때, 다음 \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$\\omega^2-\\omega+1=0\$ ㄴ. \$\\omega+\\overline{\\omega}=-1\$ ㄷ. \$\\omega^4=-\\omega\$

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

③

### 해설

\$x^3+1=(x+1)(x^2-x+1)=0\$이고 \$\\omega\$는 허근이므로 \$\\omega^3=-1\$, \$\\omega^2-\\omega+1=0\$이다.

- ㄱ. \$\\omega^2-\\omega+1=0\$이므로 옳다.  
- ㄴ. \$x^2-x+1=0\$의 두 허근이 \$\\omega, \\overline{\\omega}\$이므로 근과 계수의 관계에 의해 \$\\omega+\\overline{\\omega}=1\$이다. 따라서 거짓이다.  
- ㄷ. \$\\omega^3=-1\$이므로 \$\\omega^4=\\omega^3\\cdot\\omega=-\\omega\$이다. 따라서 옳다. 그러므로 옳은 것은 ㄱ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "x^3=-1의 허근 ω의 대수적 성질 3가지를 판별하는 순수 방정식 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$x^3+1=(x+1)(x^2-x+1)=0$에서 $\\omega^3=-1$, $\\omega^2-\\omega+1=0$과 근과 계수의 관계 $\\omega+\\overline{\\omega}=1$로 ㄱ, ㄴ, ㄷ을 판정한다.", "decisiveStep": "$x^2-x+1=0$의 두 근의 합이 $+1$임을 이용해 ㄴ의 부호 함정을 가려낸다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): x^3=-1의 허근 성질과 근과 계수의 관계 명제를 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식 $x^3=-1$의 허근 $\\omega$가 만족하는 기본 관계식과 켤레근의 합을 판별하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "한 허근을 $\\omega$라 할 때"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "방정식", "src": "stem", "quote": "방정식 $x^3=-1$"}], "condition": []}, "reasons": {"method": "x^3+1의 인수분해와 이차방정식 근과 계수의 관계로 ω 성질의 참거짓을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.5

### 발문

이차함수 \$f(x)=x^2+6x-1\$과 서로 다른 두 실수 \$a\$, \$b\$ (\$a\<b\$)가 \$f(a)=2b\$, \$f(b)=2a\$를 만족할 때, 함수 \$y=(x+2a)(x+2b)\$의 최솟값은?

### 선지

① \$-4\$ ② \$-2\$ ③ \$0\$ ④ \$2\$ ⑤ \$4\$

### 정답

①

### 해설

\$f(a)=a^2+6a-1=2b\$, \$f(b)=b^2+6b-1=2a\$에서 두 식을 빼면 \$\$ \\begin{aligned} (a^2-b^2)+6(a-b) &= 2(b-a) \\ (a-b)(a+b+6) &= \-2(a-b) \\end{aligned} \$\$ \$a\\ne b\$이므로 양변을 \$a-b\$로 나누면 \$a+b+6=-2\$, 즉 \$a+b=-8\$이다. 한편 두 식을 더하면 \$\$ (a^2+b^2)+6(a+b)-2 \= 2(a+b) \\implies a^2+b^2 \= \-4(a+b)+2 \= 32+2 \= 34 \$\$ 따라서 \$\$ ab \= \\frac{(a+b)^2-(a^2+b^2)}{2} \= \\frac{64-34}{2} \= 15 \$\$ (\$a, b\$는 \$t^2+8t+15=0\$의 두 근 \$-5, \-3\$으로 서로 다른 실수가 존재한다.) 구하는 함수는 \$\$ y \= (x+2a)(x+2b) \= x^2+2(a+b)x+4ab \= x^2-16x+60 \= (x-8)^2-4 \$\$ 이므로 최솟값은 \$-4\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [4, 12], "viewport": [4, 12, -6, 12], "pieces": [{"domain": [4, 12], "coefficients": ["60", "-16", "1"]}], "requiredPoints": [{"id": "V", "x": "8", "y": "-4", "label": "꼭짓점(8, -4)"}]}, "caption": "함수 y=(x+2a)(x+2b)=x^2-16x+60의 꼭짓점 (8, -4)에서의 최솟값 -4"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$f(a)-f(b)=2(b-a)$를 $a-b\\ne 0$으로 나누어 $a+b=-8$을 구하고, $f(a)+f(b)$로 $ab=15$를 구해 $y=x^2-16x+60$의 최솟값을 구한다.", "decisiveStep": "두 식의 차에서 $a-b$를 약분해 $a+b=-8$을 얻고 합에서 $ab=15$를 도출한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 두 식의 차·합에서 근과 계수의 관계로 대칭식 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭 조건 두 식의 차·합을 연립해 대칭식 $a+b, ab$를 구하고 이차함수 최솟값으로 연결하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "의 최솟값은?"}], "method": [{"term": "대칭식", "src": "solution", "quote": "(a+b)^2-(a^2+b^2)", "evidenceType": "IMPLIED", "justification": "a+b와 a^2+b^2으로부터 곱 ab를 구하는 대칭식 변형"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2+6x-1$"}], "condition": [{"term": "실수", "src": "stem", "quote": "서로 다른 두 실수 $a$, $b$"}]}, "reasons": {"method": "두 조건식의 차와 합으로 a+b, ab를 구한 뒤 이차함수 최솟값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q12

- 형식: 객관식  
- 배점: 4.6

### 발문

\$-1\\le x\\le 1\$에서 함수 \$y=-(x^2-2x)^2+2(x^2-2x)+5\$의 최댓값을 \$M\$, 최솟값을 \$m\$이라 할 때, \$M+m\$의 값은?

### 선지

① \$4\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$10\$

### 정답

④

### 해설

\$t=x^2-2x=(x-1)^2-1\$로 치환하자. \$-1\\le x\\le 1\$에서 \$t\$는 \$x=1\$일 때 최솟값 \$-1\$, \$x=-1\$일 때 최댓값 \$(-1)^2-2(-1)=3\$을 가지므로 \$\$ \-1 \\le t \\le 3 \$\$ 주어진 함수는 \$t\$에 대하여 \$\$ y \= \-t^2+2t+5 \= \-(t-1)^2+6 \$\$ 이다. 구간 \$-1\\le t\\le 3\$ 안에 꼭짓점 \$t=1\$이 포함되므로 최댓값은 \$M=6\$이다. 구간의 양 끝점에서의 값은 \$t=-1\$일 때 \$y=-(-1-1)^2+6=2\$, \$t=3\$일 때 \$y=-(3-1)^2+6=2\$이므로 최솟값은 \$m=2\$이다. 따라서 \$M+m=6+2=8\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-1, 3], "viewport": [-2, 4, 0, 8], "pieces": [{"domain": [-1, 3], "coefficients": ["5", "2", "-1"]}], "requiredPoints": [{"id": "V", "x": "1", "y": "6", "label": "최댓값(1, 6)"}, {"id": "L", "x": "-1", "y": "2", "label": "(-1, 2)"}, {"id": "R", "x": "3", "y": "2", "label": "(3, 2)"}]}, "caption": "치환 범위 -1<=t<=3에서 y=-t^2+2t+5의 최댓값 6과 최솟값 2"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$t=x^2-2x$로 치환하여 $-1\\le x\\le 1$에서의 $t$의 범위 $[-1,3]$을 먼저 구한 뒤, $y=-(t-1)^2+6$의 최대·최소를 구한다.", "decisiveStep": "치환 변수 $t=(x-1)^2-1$의 범위 $-1\\le t\\le 3$을 정확히 구해 이차함수 최대·최소에 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): t=x^2-2x 치환 범위 [-1, 3]에서 이차함수 최대·최소를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공통부분 치환 시 정의역 제한에 따른 치환 변수의 치역을 먼저 구해야 하는 2중 최대·최소 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값을 $M$, 최솟값을 $m$"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-(t-1)^2+6", "evidenceType": "IMPLIED", "justification": "치환된 이차함수를 완전제곱식으로 변형해 구간 내 최대·최소를 구함"}], "given": [{"term": "이차함수", "src": "solution", "quote": "t=x^2-2x=(x-1)^2-1"}], "condition": []}, "reasons": {"method": "x 범위에서 치환변수 t의 범위를 구한 뒤 완전제곱식으로 최대·최소를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.6

### 발문

\$a+b+c=2024\$, \$\\dfrac{1}{a}+\\dfrac{1}{b}+\\dfrac{1}{c}=\\dfrac{1}{2024}\$일 때, \$\\dfrac{1}{a^{2025}}+\\dfrac{1}{b^{2025}}+\\dfrac{1}{c^{2025}}\$의 값은?

### 선지

① \$\\dfrac{1}{2024^{2024}}\$ ② \$\\dfrac{1}{2024^{2025}}\$ ③ \$\\dfrac{1}{2025^{2024}}\$ ④ \$\\dfrac{1}{2025^{2025}}\$ ⑤ \$\\dfrac{3}{2024^{2025}}\$

### 정답

②

### 해설

\$u=\\dfrac{1}{a}\$, \$v=\\dfrac{1}{b}\$, \$w=\\dfrac{1}{c}\$라 두면 주어진 두 조건은 \$\$ u+v+w \= \\frac{1}{2024}, \\qquad uv+vw+wu \= 2024uvw \$\$ 이다. \$X=2024u\$, \$Y=2024v\$, \$Z=2024w\$라 두면 \$X+Y+Z=1\$, \$XY+YZ+ZX=XYZ\$가 된다. \$X, Y, Z\$를 세 근으로 하는 삼차방정식은 \$\$ t^3-t^2+(XYZ)t-XYZ \= (t-1)(t^2+XYZ) \= 0 \$\$ 으로 인수분해된다. 따라서 세 수 \$X, Y, Z\$ 중 하나는 \$1\$이고, 나머지 둘은 \$t^2+XYZ=0\$의 두 근이므로 서로 부호가 반대(합이 \$0\$)이다. 그러므로 홀수 거듭제곱의 합에서 두 항은 서로 상쇄되어 \$\$ X^{2025}+Y^{2025}+Z^{2025} \= 1^{2025} \= 1 \$\$ 이다. 따라서 \$\$ \\frac{1}{a^{2025}}+\\frac{1}{b^{2025}}+\\frac{1}{c^{2025}} \= \\frac{X^{2025}+Y^{2025}+Z^{2025}}{2024^{2025}} \= \\frac{1}{2024^{2025}} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 근과 계수의 관계 및 인수분해로 대칭 홀수거듭제곱 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$X=\\frac{2024}{a}, Y=\\frac{2024}{b}, Z=\\frac{2024}{c}$로 치환해 $X+Y+Z=1$, $XY+YZ+ZX=XYZ$를 삼차방정식 $(t-1)(t^2+XYZ)=0$으로 인수분해한다.", "decisiveStep": "삼차식 $t^3-t^2+(XYZ)t-XYZ=(t-1)(t^2+XYZ)$에서 한 근이 $1$이고 나머지 두 근의 합이 $0$임을 보인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039(DIRECT_ACTIVE): 치환 후 삼차방정식 인수분해로 근을 구해 식의 값을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "역수 치환 후 삼차방정식을 구성·인수분해하여 홀수 제곱의 상쇄를 이끌어내는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "홀수 거듭제곱의 합에서"}], "method": [{"term": "인수분해", "src": "solution", "quote": "으로 인수분해된다", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "solution", "quote": "세 근으로 하는 삼차방정식은"}], "condition": []}, "reasons": {"method": "역수 치환으로 삼차방정식을 세워 인수분해하고 홀수 제곱의 상쇄를 도출함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.7

### 발문

사차방정식 \$(4x^2+2x+1)(4x^2-2x+1)=0\$의 서로 다른 네 근을 \$\\alpha\$, \$\\beta\$, \$\\gamma\$, \$\\delta\$라 할 때, \$\\dfrac{1}{\\alpha^6}+\\dfrac{1}{\\beta^6}+\\dfrac{1}{\\gamma^6}+\\dfrac{1}{\\delta^6}\$의 값은?

### 선지

① \$2^6\$ ② \$2^7\$ ③ \$2^8\$ ④ \$2^9\$ ⑤ \$2^{10}\$

### 정답

③

### 해설

\$4x^2+2x+1=0\$의 두 근을 \$\\alpha, \\beta\$라 하면 \$x\\ne 0\$이므로 양변을 \$x^2\$으로 나누어 \$t=\\dfrac{1}{x}\$이라 두면 \$\$ t^2+2t+4 \= 0 \$\$ 양변에 \$(t-2)\$를 곱하면 \$t^3-8=0\$, 즉 \$t^3=8\$이므로 \$\\dfrac{1}{\\alpha^3}=\\dfrac{1}{\\beta^3}=8\$이다. 따라서 \$\\dfrac{1}{\\alpha^6}=\\dfrac{1}{\\beta^6}=8^2=2^6\$이다. 마찬가지로 \$4x^2-2x+1=0\$의 두 근 \$\\gamma, \\delta\$에 대하여 \$t=\\dfrac{1}{x}\$은 \$t^2-2t+4=0\$을 만족하므로 양변에 \$(t+2)\$를 곱하면 \$t^3=-8\$이다. 따라서 \$\\dfrac{1}{\\gamma^6}=\\dfrac{1}{\\delta^6}=(-8)^2=2^6\$이다. 그러므로 구하는 값은 \$4\\times 2^6 \= 2^8\$이다.

```
{"status": "EXEMPT", "reason": "역수 치환과 세제곱 차·합 공식으로 여섯제곱의 합을 구하는 순수 방정식 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "두 이차방정식에서 $t=1/x$로 치환해 $t^2\\pm 2t+4=0$을 얻고, 양변에 $(t\\mp 2)$를 곱해 $t^3=\\pm 8$, $t^6=2^6$을 도출한다.", "decisiveStep": "$t^2\\pm 2t+4=0$에 $(t\\mp 2)$를 곱해 $t^3=\\pm 8$로 차수를 낮추어 $t^6=2^6$을 바로 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): t=1/x 치환 및 (t∓2) 곱으로 차수를 낮춰 거듭제곱 합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "역수 방정식 변환과 $t^3\\pm 8=0$ 인수분해 역활용을 통해 고차 거듭제곱을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "구하는 값은 $4\\times 2^6 = 2^8$"}], "method": [{"term": "사차방정식", "src": "stem", "quote": "사차방정식 $(4x^2+2x+1)(4x^2-2x+1)=0$", "evidenceType": "IMPLIED", "justification": "역수 방정식에 (t∓2)를 곱해 세제곱 값을 구하는 차수 축소법"}], "given": [{"term": "사차방정식", "src": "stem", "quote": "사차방정식 $(4x^2+2x+1)(4x^2-2x+1)=0$"}], "condition": []}, "reasons": {"method": "t=1/x 변환 후 (t∓2)를 곱해 t^3=±8을 얻어 여섯제곱을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.9

### 발문

두 이차함수 \$f(x)=(x-2a)^2-4a^2\$, \$g(x)=-(x-a)^2+a^2-b\$에서 방정식 \$f(x)=g(x)\$는 서로 다른 두 실근 \$\\alpha\$, \$\\beta\$ (\$\\alpha\<\\beta\$)를 갖고 두 근의 차가 \$3\$이다. \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$5a^2\<b\$이다. ㄴ. \$f(\\alpha)-g(\\beta)\\le g(a)-f(2a)\$ ㄷ. \$g(\\alpha)=f(\\beta)+5a^2-b\$이면 \$b=36\$이다.

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄴ, ㄷ

### 정답

⑤

### 해설

두 식을 전개하면 \$f(x)=x^2-4ax\$, \$g(x)=-x^2+2ax-b\$이다. 방정식 \$f(x)=g(x)\$는 \$2x^2-6ax+b=0\$이므로 근과 계수의 관계에 의해 \$\\alpha+\\beta=3a\$, \$\\alpha\\beta=\\dfrac{b}{2}\$이다. 두 근의 차가 \$3\$이므로 \$(\\beta-\\alpha)^2=(\\alpha+\\beta)^2-4\\alpha\\beta=9a^2-2b=9\$, 즉 \$b=\\dfrac{9a^2-9}{2}\$이다.

- ㄱ. \$5a^2\<\\dfrac{9a^2-9}{2} \\iff 10a^2\<9a^2-9 \\iff a^2\<-9\$이므로 성립할 수 없다. (거짓)  
- ㄴ. \$f(\\alpha)=g(\\alpha)\$이므로 좌변은 \$\$f(\\alpha)-g(\\beta)=g(\\alpha)-g(\\beta)=(\\beta-\\alpha)(\\alpha+\\beta-2a)=3(3a-2a)=3a\$\$ 우변은 \$g(a)-f(2a)=(a^2-b)-(-4a^2)=5a^2-b=5a^2-\\dfrac{9a^2-9}{2}=\\dfrac{a^2+9}{2}\$이다. 따라서 \$3a\\le\\dfrac{a^2+9}{2} \\iff a^2-6a+9=(a-3)^2\\ge 0\$이므로 항상 참이다.  
- ㄷ. \$g(\\alpha)=f(\\beta)+5a^2-b\$는 \$g(\\alpha)-g(\\beta)=5a^2-b\$, 즉 \$3a=\\dfrac{a^2+9}{2}\$와 같으므로 \$(a-3)^2=0\$에서 \$a=3\$이다. 이때 \$b=\\dfrac{9\\cdot 9-9}{2}=36\$이다. (참) 따라서 옳은 것은 ㄴ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "두 이차함수 교점 방정식의 근과 계수의 관계로 합답형 명제를 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "교점 방정식 $2x^2-6ax+b=0$에서 두 근의 차 조건으로 $b=\\frac{9a^2-9}{2}$를 도출하고, ㄱ·ㄴ·ㄷ을 완전제곱 부등식 $(a-3)^2\\ge 0$으로 판정한다.", "decisiveStep": "좌변 $f(\\alpha)-g(\\beta)=g(\\alpha)-g(\\beta)=3a$와 우변 $5a^2-b=\\frac{a^2+9}{2}$의 차가 $\\frac{1}{2}(a-3)^2\\ge 0$임을 보인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): 두 이차함수의 교점 방정식 근과 계수의 관계 및 함수값 조건을 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차함수 교점의 차 조건과 함숫값 부등식·등식을 근과 계수의 관계 및 완전제곱 판별로 연결하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근 $\\alpha$, $\\beta$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "두 이차함수 $f(x)=(x-2a)^2-4a^2$"}], "condition": [{"term": "완전제곱식", "src": "solution", "quote": "(a-3)^2\\ge 0"}]}, "reasons": {"method": "교점 방정식의 근과 계수의 관계로 b를 a로 표현해 ㄱ, ㄴ, ㄷ을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 서답형  
- 배점: 4

### 발문

두 다항식 \$f(x)\$, \$g(x)\$가 다음 조건을 만족시킨다. (가) 모든 실수 \$x\$에 대하여 \$f(2x)=g(x)(x-3)+7\$이다. (나) \$g(x)-3x\$를 \$x-6\$으로 나누었을 때의 나머지는 \$4\$이다. \$f(x)g(x)\$를 \$x-6\$으로 나누었을 때의 나머지를 구하시오.

### 선지

없음

### 정답

\$154\$

### 해설

조건 (나)에서 나머지정리에 의하여 \$x=6\$을 대입하면 \$\$ g(6)-3\\cdot 6 \= 4 \\implies g(6) \= 22 \$\$ 조건 (가)는 모든 실수 \$x\$에 대하여 성립하므로 \$x=3\$을 대입하면 \$\$ f(6) \= g(3)(3-3)+7 \= 7 \$\$ 따라서 \$f(x)g(x)\$를 \$x-6\$으로 나누었을 때의 나머지는 나머지정리에 의하여 \$\$ f(6)g(6) \= 7\\cdot 22 \= 154 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "항등식 수치대입과 나머지정리를 결합해 곱 다항식의 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "조건 (나)에 $x=6$을 대입해 $g(6)=22$를 얻고, 항등식 (가)에 $x=3$을 대입해 $f(6)=7$을 구한 뒤 $f(6)g(6)$을 계산한다.", "decisiveStep": "항등식 $f(2x)=g(x)(x-3)+7$에서 $g(3)$을 몰라도 $x=3$ 대입으로 $f(6)=7$을 바로 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): 항등식에 x=3을 대입해 f(6)의 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수치대입법과 나머지정리를 결합해 두 함숫값의 곱을 구하는 단답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지를 구하시오"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $f(x)$, $g(x)$"}], "condition": [{"term": "수치대입법", "src": "solution", "quote": "x=3$을 대입하면", "evidenceType": "IMPLIED", "justification": "항등식에 x=3을 대입해 미지의 g(3)을 소거함"}]}, "reasons": {"method": "나머지정리와 항등식 수치대입으로 f(6), g(6)을 각각 구해 곱함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 서답형  
- 배점: 5

### 발문

삼차방정식 \$x^3-4x^2+(a+3)x-a=0\$의 세 실근 중 어떤 한 근이 다른 한 근의 \$2\$배일 때, 상수 \$a\$의 값의 곱을 \$A\$라 하면 \$4A\$의 값을 구하시오.

### 선지

없음

### 정답

\$10\$

### 해설

주어진 삼차방정식의 좌변은 \$x=1\$을 대입하면 \$1-4+a+3-a=0\$이므로 \$(x-1)\$을 인수로 갖는다. 인수분해하면 \$\$ (x-1)(x^2-3x+a) \= 0 \$\$ 세 실근은 \$1\$과 이차방정식 \$x^2-3x+a=0\$의 두 근이다.

1) \$x^2-3x+a=0\$의 두 근이 \$r, 2r\$인 경우: 두 근의 합 \$3r=3\$에서 \$r=1\$이므로 두 근은 \$1, 2\$이고 \$a=1\\cdot 2=2\$이다.  
2) \$1\$과 \$x^2-3x+a=0\$의 한 근이 \$2\$배 관계인 경우:  
- 한 근이 \$2\$이면 \$2^2-3\\cdot 2+a=0 \\implies a=2\$ (1)과 동일, 세 근 \$1, 1, 2\$).  
- 한 근이 \$\\dfrac{1}{2}\$이면 \$\\left(\\dfrac{1}{2}\\right)^2-3\\left(\\dfrac{1}{2}\\right)+a=0 \\implies a=\\dfrac{5}{4}\$ (다른 한 근은 \$\\dfrac{5}{2}\$, 세 실근 \$\\dfrac{1}{2}, 1, \\dfrac{5}{2}\$). 따라서 서로 다른 상수 \$a\$의 값은 \$2\$, \$\\dfrac{5}{4}\$이므로 \$\$ A \= 2\\cdot\\frac{5}{4} \= \\frac{5}{2}, \\qquad 4A \= 10 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 인수분해 후 두 근의 배수 관계를 경우 나누어 푸는 순수 방정식 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "인수정리로 $(x-1)(x^2-3x+a)=0$으로 인수분해한 뒤, $2$배 관계가 이차식 내부($1,2$)인지 $1$과의 관계($2$ 또는 $1/2$)인지 경우 나누어 $a$를 구한다.", "decisiveStep": "$x^2-3x+a=0$의 두 근이 $2$배일 때 $a=2$로 겹치고, $1$과 $\\frac{1}{2}$이 $2$배일 때 $a=\\frac{5}{4}$가 추가로 나옴을 빠짐없이 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039(DIRECT_ACTIVE): 인수정리로 삼차방정식을 분해해 세 근의 2배 관계 경우를 분류함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리로 한 실근 $1$을 분리한 뒤 두 근의 $2$배 관계에 대한 모든 경우를 누락 없이 분류해야 하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱", "src": "stem", "quote": "상수 $a$의 값의 곱을 $A$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "$(x-1)$을 인수로 갖는다", "evidenceType": "IMPLIED", "justification": "x=1을 대입해 0임을 확인하고 인수정리로 삼차식을 인수분해함"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-4x^2+(a+3)x-a=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "세 실근 중"}]}, "reasons": {"method": "인수정리로 x=1을 분리한 뒤 2배 관계의 모든 경우를 분류해 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 6

### 발문

그림과 같이 \$\\triangle\\mathrm{ABC}\$의 변 \$\\mathrm{AB}\$ 위를 움직이는 점 \$\\mathrm{P}\$에 대하여 선분 \$\\mathrm{BP}\$의 중점을 \$\\mathrm{Q}\$라고 하자. 또, 두 점 \$\\mathrm{P}\$, \$\\mathrm{Q}\$에서 각각 변 \$\\mathrm{BC}\$에 평행한 선을 그어 변 \$\\mathrm{AC}\$와 만나는 점을 \$\\mathrm{S}\$, \$\\mathrm{R}\$라고 하자. \$\\triangle\\mathrm{ABC}\$의 넓이가 \$24\$일 때, 사각형 \$\\mathrm{PQRS}\$의 넓이의 최댓값을 구하시오.

### 선지

없음

### 정답

\$8\$

### 해설

\$\\overline{\\mathrm{PS}}\\parallel\\overline{\\mathrm{QR}}\\parallel\\overline{\\mathrm{BC}}\$이므로 \$\\triangle\\mathrm{APS}\$와 \$\\triangle\\mathrm{AQR}\$는 각각 \$\\triangle\\mathrm{ABC}\$와 닮음이다. \$\\dfrac{\\overline{\\mathrm{BP}}}{\\overline{\\mathrm{BA}}}=t\$ (\$0\\le t\\le 1\$)라 두면 \$\\dfrac{\\overline{\\mathrm{AP}}}{\\overline{\\mathrm{AB}}}=1-t\$이고, 점 \$\\mathrm{Q}\$가 선분 \$\\mathrm{BP}\$의 중점이므로 \$\\dfrac{\\overline{\\mathrm{AQ}}}{\\overline{\\mathrm{AB}}}=1-\\dfrac{t}{2}\$이다. 닮은 두 도형의 넓이의 비는 닮음비의 제곱과 같으므로 \$\$ \\triangle\\mathrm{AQR} \= 24\\left(1-\\frac{t}{2}\\right)^2, \\qquad \\triangle\\mathrm{APS} \= 24(1-t)^2 \$\$ 사각형 \$\\mathrm{PQRS}\$의 넓이 \$S(t)\$는 두 삼각형 넓이의 차와 같으므로 \$\$ \\begin{aligned} S(t) &= 24\\left(1-\\frac{t}{2}\\right)^2 - 24(1-t)^2 \\ &= 24\\left(1-t+\\frac{t^2}{4}-1+2t-t^2\\right) \\ &= 24\\left(t-\\frac{3}{4}t^2\\right) \= \-18t^2+24t \\ &= \-18\\left(t-\\frac{2}{3}\\right)^2+8 \\end{aligned} \$\$ \$t=\\dfrac{2}{3}\$은 \$0\\le t\\le 1\$에 포함되므로 사각형 \$\\mathrm{PQRS}\$의 넓이의 최댓값은 \$8\$이다.

```
{"capability": "plane", "title": "삼각형 ABC와 평행선 PS, QR로 만든 사각형 PQRS", "points": [{"id": "A", "x": 2, "y": 6, "label": "A"}, {"id": "B", "x": 0, "y": 0, "label": "B"}, {"id": "C", "x": 8, "y": 0, "label": "C"}, {"id": "P", "x": 0.67, "y": 2, "label": "P"}, {"id": "Q", "x": 1.33, "y": 4, "label": "Q"}, {"id": "S", "x": 6, "y": 2, "label": "S"}, {"id": "R", "x": 4, "y": 4, "label": "R"}], "segments": [{"id": "sAB", "from": "A", "to": "B"}, {"id": "sBC", "from": "B", "to": "C"}, {"id": "sCA", "from": "C", "to": "A"}, {"id": "sPS", "from": "P", "to": "S"}, {"id": "sQR", "from": "Q", "to": "R"}], "planeMarks": {"parallels": [{"id": "p1", "count": 1, "segments": ["sQR", "sPS", "sBC"]}]}, "caption": "삼각형 ABC에서 BP의 중점 Q와 BC에 평행한 선분 PS, QR로 둘러싸인 사각형 PQRS"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "닮음비 $t=\\frac{BP}{BA}$를 변수로 잡아 $\\triangle AQR$과 $\\triangle APS$의 넓이 차 $S(t)=-18(t-\\frac{2}{3})^2+8$을 구한다.", "decisiveStep": "닮음비 제곱 비례를 이용해 $S(t)=24(1-\\frac{t}{2})^2-24(1-t)^2=-18t^2+24t$를 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 삼각형 닮음비 t를 변수로 넓이 이차함수의 최댓값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행선과 닮음비 제곱을 이용해 사다리꼴 넓이를 이차함수로 모델링하여 최댓값을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "넓이의 최댓값을 구하시오"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-18\\left(t-\\frac{2}{3}\\right)^2+8", "evidenceType": "IMPLIED", "justification": "넓이 이차함수를 완전제곱식으로 변형하여 최댓값을 구함"}], "given": [{"term": "삼각형", "src": "stem", "quote": "$\\triangle\\mathrm{ABC}$의 넓이가 $24$"}], "condition": [{"term": "넓이", "src": "stem", "quote": "사각형 $\\mathrm{PQRS}$의 넓이"}]}, "reasons": {"method": "닮음비 제곱으로 두 삼각형 넓이 차를 구해 이차함수 최댓값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 10

### 발문

두 다항식 \$f(x)\$, \$g(x)\$에 대하여 \$f(x)+g(x)\$는 \$x^2+2x-1\$을 인수로 갖고, \$f(-x)-2g(-x)\$를 \$x^2-2x-1\$로 나누었을 때의 나머지가 \$-6\$이다. \$g(x)\$를 \$x^2+2x-1\$로 나눈 나머지를 \$a\$, \$f(x)\$를 \$x^2+2x-1\$로 나눈 나머지를 \$b\$, \$f(x)+kg(x)\$가 \$x^2+2x-1\$을 인수로 갖도록 하는 상수 \$k\$의 값을 \$c\$라 할 때, \$a+b+c\$의 값을 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$1\$

### 해설

\$f(x)+g(x)\$가 \$x^2+2x-1\$을 인수로 가지므로 \$x^2+2x-1\$로 나누어떨어진다. 여기에서 \$x\$ 대신 \$-x\$를 대입하면 \$f(-x)+g(-x)\$는 \$(-x)^2+2(-x)-1 \= x^2-2x-1\$로 나누어떨어진다. 한편 조건에서 \$f(-x)-2g(-x)\$를 \$x^2-2x-1\$로 나눈 나머지가 \$-6\$이므로 \$\$ {f(-x)+g(-x)} - {f(-x)-2g(-x)} \= 3g(-x) \$\$ 를 \$x^2-2x-1\$로 나눈 나머지는 \$0-(-6)=6\$이다. 따라서 \$g(-x)\$를 \$x^2-2x-1\$로 나눈 나머지는 \$2\$이다. 즉, 몫을 \$Q(x)\$라 하면 \$\$ g(-x) \= (x^2-2x-1)Q(x)+2 \$\$ 다시 \$x\$ 대신 \$-x\$를 대입하면 \$\$ g(x) \= (x^2+2x-1)Q(-x)+2 \$\$ 이므로 \$g(x)\$를 \$x^2+2x-1\$로 나눈 나머지는 \$a=2\$이다. 또한 \$f(x)+g(x)\$가 \$x^2+2x-1\$로 나누어떨어지므로 \$b+a=0\$, 즉 \$b=-2\$이다. 끝으로 \$f(x)+kg(x)\$를 \$x^2+2x-1\$로 나눈 나머지는 \$b+ka \= \-2+2k\$이므로, 인수로 가지려면 \$-2+2k=0\$, 즉 \$c=k=1\$이다. 따라서 \$a+b+c \= 2+(-2)+1 \= 1\$이다.

```
{"status": "EXEMPT", "reason": "다항식의 변수 부호 치환(x->-x)과 나머지 성질로 a, b, c를 연립하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$f(x)+g(x)$의 배수 조건에 $x\\mapsto -x$를 대입해 $f(-x)+g(-x)$가 $x^2-2x-1$의 배수임을 보이고, $f(-x)-2g(-x)$와의 차로 $g(x)$의 나머지를 구한다.", "decisiveStep": "$3g(-x)=\\{f(-x)+g(-x)\\}-\\{f(-x)-2g(-x)\\}$의 나머지가 $6$임을 이용해 $g(x)$의 나머지 $a=2$를 도출한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 대칭 대입 x->-x와 두 다항식 결합으로 나눗셈 나머지를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "변수 변환 $x\\mapsto -x$에 따른 나누는 식의 대칭 변환과 나머지 가감 연산을 논리적으로 서술해야 하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지를 $a$"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "g(-x) = (x^2-2x-1)Q(x)+2", "evidenceType": "IMPLIED", "justification": "나눗셈 항등식에서 x를 -x로 바꾸어 g(x)의 나머지를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $f(x)$, $g(x)$"}], "condition": []}, "reasons": {"method": "x->-x 대칭 변환으로 두 조건의 나누는 식을 맞춘 뒤 나머지 차로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 10

### 발문

최고차항의 계수가 \$2\$인 이차함수 \$f(x)\$와 최고차항의 계수가 \$1\$인 이차함수 \$g(x)\$가 있다. 방정식 \${f(x)-3}{g(x)-3}=0\$의 모든 실근이 \$\\alpha\$, \$\\beta\$이고, 방정식 \$f(x)=g(x)\$의 모든 실근은 \$\\alpha\$, \$\\beta+2\$이다. 상수 \$k\$에 대하여 방정식 \${f(x)-k}{g(x)-k}=0\$의 서로 다른 실근의 개수가 \$3\$이고 이 세 실근의 합이 \$16\$일 때, \$\\alpha+\\beta+k\$의 값을 구하는 과정을 서술하시오. (단, \$\\alpha\<\\beta\$)

### 선지

없음

### 정답

\$33\$

### 해설

\$F(x)=f(x)-3\$, \$G(x)=g(x)-3\$이라 두면 \$F(x)G(x)=0\$의 모든 실근이 \$\\alpha, \\beta\$이고 \$f(\\alpha)=g(\\alpha)\$이므로 \$F(\\alpha)=G(\\alpha)=0\$이다. 만약 \$F(x), G(x)\$가 모두 \$(x-\\alpha)(x-\\beta)\$를 인수로 가지면 \$f(\\beta)=g(\\beta)=3\$이 되어 \$f(x)=g(x)\$의 다른 근이 \$\\beta\$가 되므로 모순이다. 또 \$F(x)=2(x-\\alpha)^2\$, \$G(x)=(x-\\alpha)(x-\\beta)\$이면 \$f(x)-g(x)=(x-\\alpha)(x-2\\alpha+\\beta)=0\$의 다른 근이 \$2\\alpha-\\beta\<\\alpha\<\\beta+2\$가 되어 모순이다. 따라서 \$\$ F(x) \= 2(x-\\alpha)(x-\\beta), \\qquad G(x) \= (x-\\alpha)^2 \$\$ 이어야 한다. 이때 \$f(x)-g(x)=2(x-\\alpha)(x-\\beta)-(x-\\alpha)^2=(x-\\alpha)(x-2\\beta+\\alpha)=0\$이므로 다른 한 근은 \$2\\beta-\\alpha\$이다. 조건에서 이 근이 \$\\beta+2\$이므로 \$2\\beta-\\alpha=\\beta+2 \\implies \\beta-\\alpha=2\$이다. \$y=x-\\alpha\$라 두면 \$\\beta-\\alpha=2\$이므로 \$\$ f(x) \= 2y(y-2)+3 \= 2y^2-4y+3, \\qquad g(x) \= y^2+3 \$\$ 이제 \${f(x)-k}{g(x)-k}=0\$의 서로 다른 실근이 \$3\$개가 되려면 \$f(x)=k\$와 \$g(x)=k\$가 각각 서로 다른 두 실근을 가지면서 그중 하나가 공통근이어야 한다. 공통근은 \$f(x)=g(x)\$, 즉 \$y^2-4y=0\$에서 \$y=0\$ 또는 \$y=4\$일 때 발생한다.

- \$y=0\$이면 \$k=3\$이고 실근이 \$\\alpha, \\beta\$의 \$2\$개뿐이므로 불가하다.  
- \$y=4\$이면 \$k=g(\\alpha+4)=4^2+3=19\$이다. 이때 \$f(x)=19 \\iff 2y^2-4y-16=0 \\iff y=4, \-2\$이고, \$g(x)=19 \\iff y^2=16 \\iff y=4, \-4\$이다. 따라서 서로 다른 세 실근은 \$\\alpha-4, \\alpha-2, \\alpha+4\$이고 그 합이 \$16\$이므로 \$\$ (\\alpha-4)+(\\alpha-2)+(\\alpha+4) \= 3\\alpha-2 \= 16 \\implies \\alpha \= 6 \$\$ 그러므로 \$\\beta=\\alpha+2=8\$, \$k=19\$이며, \$\\alpha+\\beta+k \= 6+8+19 \= 33\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [0, 12], "viewport": [0, 12, 0, 25], "pieces": [{"domain": [0, 12], "coefficients": ["99", "-28", "2"]}], "referenceCurves": [{"coefficients": ["39", "-12", "1"], "label": "g(x)"}], "referenceLines": [{"slope": "0", "intercept": "19", "label": "y=19"}], "requiredPoints": [{"id": "A", "x": "6", "y": "3", "label": "교점(6, 3)"}, {"id": "B", "x": "10", "y": "19", "label": "교점(10, 19)"}]}, "caption": "f(x)=2(x-6)(x-8)+3과 g(x)=(x-6)^2+3이 y=19와 만나 서로 다른 세 실근을 만드는 모습"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$F(x)=f(x)-3, G(x)=g(x)-3$의 인수 배치를 모순 제거로 $F=2(x-\\alpha)(x-\\beta), G=(x-\\alpha)^2$로 확정하고, 공통근 $y=4$에서 $k=19, \\alpha=6$을 구한다.", "decisiveStep": "$f(x)=g(x)$의 두 근 중 $\\alpha$가 아닌 $\\beta+2$와 $\\{f-k\\}\\{g-k\\}=0$의 실근 3개 조건으로 공통근 $y=4$($k=19$)를 유일하게 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): 두 이차함수의 교점과 함숫값 집합 조건으로 식을 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차함수의 인수 배치 경우 분류, 평행이동 변수화, 3개 실근 조건의 공통근 판별까지 요구하는 최고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "서로 다른 실근의 개수가 $3$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "$F(\\alpha)=G(\\alpha)=0$이다", "evidenceType": "IMPLIED", "justification": "근 조건으로부터 두 이차식 F(x), G(x)의 일차 인수를 결정함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "최고차항의 계수가 $2$인 이차함수 $f(x)$"}], "condition": [{"term": "최고차항", "src": "stem", "quote": "최고차항의 계수가 $1$인 이차함수"}]}, "reasons": {"method": "두 이차식 F, G의 인수를 모순 제거로 확정한 뒤 3실근 조건으로 k와 α를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

