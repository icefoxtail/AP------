

```
{"stem": "22_매산여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_매산여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 102.8, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.4

### 발문

다항식 \$(3x^2-2x+5)(x^3+2x^2-4x+3)\$의 전개식에서 \$x^2\$의 계수를 구하시오.

### 선지

① \$17\$ ② \$22\$ ③ \$27\$ ④ \$32\$ ⑤ \$37\$

### 정답

③

### 해설

전개식에서 \$x^2\$항은 두 다항식에서 차수의 합이 \$2\$가 되는 항끼리 곱할 때만 나온다. \$\$ \\begin{aligned} (3x^2)\\cdot 3 &= 9x^2 \\ (-2x)\\cdot(-4x) &= 8x^2 \\ 5\\cdot(2x^2) &= 10x^2 \\end{aligned} \$\$ 따라서 \$x^2\$의 계수는 \$9+8+10=27\$이다.

```
{"status": "EXEMPT", "reason": "다항식 곱 전개에서 x^2항을 만드는 항끼리만 곱해 계수를 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "다항식 $(3x^2-2x+5)(x^3+2x^2-4x+3)$에서 차수의 합이 $2$가 되는 세 항의 쌍만 골라 곱하고 더한다.", "decisiveStep": "$3x^2\\cdot 3$, $(-2x)(-4x)$, $5\\cdot 2x^2$의 계수 $9, 8, 10$을 합산해 $27$을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "차수·계수 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-001(DIRECT_ACTIVE): 다항식 곱셈 전개에서 x^2 항의 계수만 추출해 정리함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "전개식 전체를 쓰지 않고 차수 합이 2인 항의 쌍만 선택해 곱하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "의 계수를 구하시오"}], "method": [{"term": "전개", "src": "stem", "quote": "전개식에서 $x^2$의", "evidenceType": "IMPLIED", "justification": "필요한 차수의 항만 선택해 곱하는 다항식 전개"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(3x^2-2x+5)(x^3+2x^2-4x+3)$"}], "condition": []}, "reasons": {"method": "차수 합이 2가 되는 항들의 곱만 추려 계수를 합산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.6

### 발문

다음은 조립제법을 이용하여 \$(2x^3+7x^2+7x+5)\\div(2x+1)\$의 몫과 나머지를 구하는 과정이다. 두 다항식 \$P(x)\$, \$Q(x)\$와 네 실수 \$a\$, \$b\$, \$c\$, \$d\$에 대하여 \$P(1)+Q(1)+a+bc-d\$의 값을 구하시오.

| \$b\$ | \$2\$ | \$7\$ | \$7\$ | \$5\$ |
| :---- | :---- | :---- | :---- | :---- |
|  |  | \$-1\$ | \$d\$ | \$-2\$ |
|  | \$2\$ | \$c\$ | \$4\$ | \$a\$ |

조립제법에서 \$2x+1=2\\left(x+\\dfrac{1}{2}\\right)\$이므로 \$2x^3+7x^2+7x+5=\\left(x+\\dfrac{1}{2}\\right)P(x)+a=(2x+1)Q(x)+a\$이고, 구하는 몫은 \$Q(x)\$, 나머지는 \$a\$이다.

### 선지

① \$21\$ ② \$22\$ ③ \$23\$ ④ \$24\$ ⑤ \$25\$

### 정답

①

### 해설

일차식 \$2x+1=2\\left(x+\\dfrac{1}{2}\\right)\$에서 조립제법 왼쪽에 쓰는 수는 \$b=-\\dfrac{1}{2}\$이다. 표의 빈칸을 차례로 계산하면 \$\$ \\begin{aligned} c &= 7+(-1) \= 6 \\ d &= bc \= \\left(-\\frac{1}{2}\\right)\\cdot 6 \= \-3 \\ a &= 5+(-2) \= 3 \\end{aligned} \$\$ 조립제법으로 얻은 몫은 \$P(x)=2x^2+6x+4\$이므로 \$P(1)=2+6+4=12\$이다. 실제 나누는 식이 \$2x+1=2\\left(x+\\frac{1}{2}\\right)\$이므로 구하는 몫은 \$\$ Q(x) \= \\frac{P(x)}{2} \= x^2+3x+2 \$\$ 이고 \$Q(1)=1+3+2=6\$이다. 따라서 \$\$ P(1)+Q(1)+a+bc-d \= 12+6+3+\\left(-\\frac{1}{2}\\right)\\cdot 6-(-3) \= 21-3+3 \= 21 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "발문에 표로 제시된 조립제법 과정의 빈칸과 몫·나머지를 구하는 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "조립제법 표에서 $b=-1/2$, $c=6$, $d=-3$, $a=3$을 구하고 $2x+1=2(x+1/2)$ 관계로 $Q(x)=P(x)/2$를 계산한다.", "decisiveStep": "$P(x)=2x^2+6x+4$를 $2$로 나누어 실제 몫 $Q(x)=x^2+3x+2$를 구하는 단계가 핵심이다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "다항식을 일차식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-005(DIRECT_ACTIVE): 조립제법 표 역산 및 2x+1 나눗셈의 실제 몫을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조립제법의 빈칸 추론과 일차항 계수가 1이 아닌 제수로 나눌 때 몫 보정을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $P(x)$, $Q(x)$"}], "method": [{"term": "다항식의나눗셈", "src": "stem", "quote": "조립제법을 이용하여", "evidenceType": "IMPLIED", "justification": "조립제법으로 몫 P(x)를 구한 뒤 2로 나누어 Q(x)를 구함"}], "given": [{"term": "나머지", "src": "stem", "quote": "나머지는 $a$이다"}], "condition": []}, "reasons": {"method": "조립제법 표를 완성해 P(x)를 구하고 2로 나누어 몫 Q(x)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.7

### 발문

실수 \$a\$, \$b\$에 대하여 이차방정식 \$ax^2+bx+19=0\$의 한 근이 \$4+\\sqrt{3}i\$일 때, \$a-b\$의 값을 구하시오. (단, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$-9\$ ② \$-7\$ ③ \$0\$ ④ \$7\$ ⑤ \$9\$

### 정답

⑤

### 해설

이차방정식 \$ax^2+bx+19=0\$의 계수 \$a, b, 19\$가 모두 실수이므로 한 근이 \$4+\\sqrt{3}i\$이면 켤레복소수 \$4-\\sqrt{3}i\$도 근이다. 근과 계수의 관계에 의하여 \$\$ \\begin{aligned} (4+\\sqrt{3}i)+(4-\\sqrt{3}i) &= 8 \= \-\\frac{b}{a} \\ (4+\\sqrt{3}i)(4-\\sqrt{3}i) &= 16+3 \= 19 \= \\frac{19}{a} \\end{aligned} \$\$ 두 번째 식에서 \$a=1\$이고, 첫 번째 식에 대입하면 \$b=-8\$이다. 따라서 \$a-b \= 1-(-8) \= 9\$이다.

```
{"status": "EXEMPT", "reason": "실계수 이차방정식의 켤레근 성질과 근과 계수의 관계를 적용하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "실계수 조건에서 켤레근 $4-\\sqrt{3}i$를 얻어 두 근의 합 $8=-b/a$와 곱 $19=19/a$를 연립한다.", "decisiveStep": "두 근의 곱 $19=19/a$에서 $a=1$, 합 $8=-b/a$에서 $b=-8$을 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json H1-RPM-031(DIRECT_BINDING_GAP): 실계수 이차방정식의 켤레복소수 근과 근과 계수의 관계를 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레근의 성질과 이차방정식 근과 계수의 관계를 연결해 계수를 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$, $b$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $ax^2+bx+19=0$"}], "condition": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수 $4-\\sqrt{3}i$"}]}, "reasons": {"method": "실계수 이차방정식의 켤레근과 근과 계수의 관계로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q04

- 형식: 객관식  
- 배점: 4.2

### 발문

\$x\$, \$y\$에 대한 이차식 \$x^2-2xy+y^2-7x+7y+12\$를 인수분해하면?

### 선지

① \$(x+y-3)(x+y-4)\$ ② \$(x-y-3)(x-y-4)\$ ③ \$(x-y+3)(x-y+4)\$ ④ \$(x-y-2)(x-y-6)\$ ⑤ \$(x+y-3)(x-y-4)\$

### 정답

②

### 해설

\$t=x-y\$로 치환하면 주어진 식은 \$\$ \\begin{aligned} x^2-2xy+y^2-7x+7y+12 &= (x-y)^2-7(x-y)+12 \\ &= t^2-7t+12 \\ &= (t-3)(t-4) \\ &= (x-y-3)(x-y-4) \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "공통부분 x-y를 치환해 이차식을 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$x^2-2xy+y^2=(x-y)^2$과 $-7x+7y=-7(x-y)$를 $t=x-y$로 치환해 $t^2-7t+12=(t-3)(t-4)$로 인수분해한다.", "decisiveStep": "$t=x-y$ 치환으로 이변수 이차식을 일변수 이차식으로 바꾼다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): t=x-y 치환으로 이변수 이차식을 단계적 인수분해함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식 묶기와 치환을 이용해 두 일차식의 곱으로 인수분해하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하면?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "(t-3)(t-4)", "evidenceType": "IMPLIED", "justification": "공통부분 t=x-y로 치환해 이차식을 인수분해함"}], "given": [{"term": "이차식", "src": "stem", "quote": "$x$, $y$에 대한 이차식"}], "condition": []}, "reasons": {"method": "(x-y)로 치환한 뒤 이차식을 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.2

### 발문

\$a\$, \$b\$, \$c\$가 양수이고 \$a^3+b^3+c^3=3abc\$일 때, \$\\dfrac{4b+c}{5a}+\\dfrac{a-5c}{2b}+\\dfrac{9a+3b}{4c}\$의 값은?

### 선지

① \$\\dfrac{1}{2}\$ ② \$1\$ ③ \$\\dfrac{3}{2}\$ ④ \$2\$ ⑤ \$\\dfrac{5}{2}\$

### 정답

④

### 해설

인수분해 공식에 의하여 \$\$ a^3+b^3+c^3-3abc \= \\frac{1}{2}(a+b+c){(a-b)^2+(b-c)^2+(c-a)^2} \= 0 \$\$ \$a, b, c\$가 모두 양수이므로 \$a+b+c\>0\$이고, 따라서 \$(a-b)^2+(b-c)^2+(c-a)^2=0\$, 즉 \$a=b=c\$이다. 이를 주어진 식에 대입하면 \$\$ \\frac{4a+a}{5a}+\\frac{a-5a}{2a}+\\frac{9a+3a}{4a} \= 1+(-2)+3 \= 2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "세제곱 인수분해 항등식으로 a=b=c를 도출해 분수식을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$a^3+b^3+c^3-3abc$의 인수분해 공식과 $a,b,c>0$ 조건으로 $a=b=c$를 얻어 분수식에 대입한다.", "decisiveStep": "$a+b+c>0$이므로 세 완전제곱의 합이 $0$이 되어 $a=b=c$임을 확정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): a^3+b^3+c^3-3abc=0 인수분해 조건식으로 a=b=c를 도출함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 문자 세제곱 인수분해 공식과 양수 조건을 결합해 비를 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "1+(-2)+3 = 2"}], "method": [{"term": "인수분해", "src": "solution", "quote": "인수분해 공식에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "실수", "src": "stem", "quote": "$a$, $b$, $c$가 양수이고"}], "condition": []}, "reasons": {"method": "세제곱 인수분해 공식으로 a=b=c를 도출하여 대입 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.3

### 발문

\$x\$에 대한 이차방정식 \$(k-3)x^2+4(k-3)x+3k-5=0\$이 실근을 가질 때, 실수 \$k\$의 값이 될 수 없는 것은?

### 선지

① \$5\$ ② \$-1\$ ③ \$2\$ ④ \$7\$ ⑤ \$9\$

### 정답

①

### 해설

이차방정식이므로 최고차항 계수 \$k-3\\ne 0\$, 즉 \$k\\ne 3\$이다. 실근을 가지려면 판별식 \$D\\ge 0\$이어야 하므로 \$\$ \\begin{aligned} \\frac{D}{4} &= {2(k-3)}^2-(k-3)(3k-5) \\ &= (k-3){4(k-3)-(3k-5)} \\ &= (k-3)(k-7) \\ge 0 \\end{aligned} \$\$ \$k\\ne 3\$이므로 \$k\<3\$ 또는 \$k\\ge 7\$이다. 보기 중 이 범위에 속하지 않는 수는 \$5\$이다.

```
{"status": "EXEMPT", "reason": "최고차항 계수 조건과 판별식 부등식으로 k의 범위를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "이차방정식 조건 $k\\ne 3$과 판별식 $D/4=(k-3)(k-7)\\ge 0$을 풀어 $k<3$ 또는 $k\\ge 7$에 없는 값을 찾는다.", "decisiveStep": "$D/4=(k-3)(k-7)\\ge 0$과 $k\\ne 3$으로 불가능한 구간 $3\\le k<7$을 판별한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식 조건 k!=3과 판별식 D>=0을 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 정의 조건($k\\ne 3$)과 실근 조건($D\\ge 0$)을 함께 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값이 될 수 없는"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D\\ge 0$", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $(k-3)x^2+4(k-3)x+3k-5=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "실근을 가질 때"}]}, "reasons": {"method": "최고차항 조건과 판별식 D>=0을 연립해 k의 가능 범위를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.5

### 발문

이차함수 \$y=x^2-6x+7\$의 그래프와 직선 \$y=2x-m+3\$이 만나지 않도록 하는 최소의 자연수 \$m\$의 값은?

### 선지

① \$11\$ ② \$12\$ ③ \$13\$ ④ \$14\$ ⑤ \$15\$

### 정답

③

### 해설

두 그래프가 만나지 않으려면 연립방정식 \$x^2-6x+7=2x-m+3\$, 즉 \$\$ x^2-8x+(m+4)=0 \$\$ 이 실근을 갖지 않아야 한다. 판별식 \$D\<0\$이므로 \$\$ \\frac{D}{4} \= (-4)^2-(m+4) \= 12-m \< 0 \\implies m \> 12 \$\$ 따라서 최소의 자연수 \$m\$은 \$13\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [0, 6], "viewport": [0, 6, -12, 10], "pieces": [{"domain": [0, 6], "coefficients": ["7", "-6", "1"]}], "referenceLines": [{"slope": "2", "intercept": "-10", "label": "y=2x-10 (m=13)"}], "requiredPoints": [{"id": "V", "x": "3", "y": "-2", "label": "꼭짓점(3, -2)"}]}, "caption": "m=13일 때 만나지 않는 이차함수 y=x^2-6x+7과 직선 y=2x-10"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $x^2-8x+(m+4)=0$에 만나지 않을 조건 $D/4=12-m<0$을 적용해 최소 자연수를 구한다.", "decisiveStep": "$m>12$에서 최소 자연수 $m=13$을 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 이차함수와 직선이 만나지 않을 조건 D<0을 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선이 만나지 않을 조건을 연립방정식의 판별식 $D<0$으로 해석하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "자연수 $m$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-6x+7$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=2x-m+3$"}], "condition": [{"term": "실근", "src": "solution", "quote": "실근을 갖지 않아야"}]}, "reasons": {"method": "연립이차방정식의 판별식 D<0으로 m의 하한을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.4

### 발문

연립방정식 \$\\begin{cases} x^2+xy-4y=30 \\ x^2-y^2=0 \\end{cases}\$의 해를 \$\\begin{cases} x=\\alpha \\ y=\\beta \\end{cases}\$라 할 때, \$\\alpha+\\beta\$의 최댓값은?

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

⑤

### 해설

\$x^2-y^2=(x-y)(x+y)=0\$에서 \$x=y\$ 또는 \$x=-y\$이다.

1) \$x=y\$이면 첫째 식은 \$2x^2-4x-30=0\$, 즉 \$x^2-2x-15=(x-5)(x+3)=0\$이므로 \$(x,y)=(5,5), (-3,-3)\$이고, 합은 각각 \$10, \-6\$이다.  
2) \$x=-y\$이면 \$-4y=30\$에서 \$(x,y)=\\left(\\dfrac{15}{2}, \-\\dfrac{15}{2}\\right)\$이고, 합은 \$0\$이다. 따라서 \$\\alpha+\\beta\$의 최댓값은 \$10\$이다.

```
{"status": "EXEMPT", "reason": "연립이차방정식을 인수분해해 두 일차 경우로 나누어 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-SUBSTITUTION_SYSTEM", "conceptClusterKey": null, "primaryMethod": "$x^2-y^2=0$을 $x=y$와 $x=-y$로 나누어 $x^2+xy-4y=30$에 대입해 모든 해의 $\\alpha+\\beta$를 구한다.", "decisiveStep": "$x=y$일 때 $(x-5)(x+3)=0$에서 해 $(5,5)$를 얻어 최댓값 $10$을 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "연립방정식", "l4": "이차식이 포함된 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_SYSTEM_EQUATION", "templateKey": "TPL_H1_SYSTEM_DIRECT", "why": "high1.json H1-RPM-041(DIRECT_ACTIVE): 인수분해 가능한 이차연립방정식을 x=±y로 분기해 풂"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상수항이 $0$인 이차식을 인수분해해 얻은 두 일차 관계식을 각각 대입하는 연립이차방정식 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "$\\alpha+\\beta$의 최댓값은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "x^2-y^2=(x-y)(x+y)=0", "evidenceType": "IMPLIED", "justification": "둘째 식을 인수분해하여 x=y, x=-y로 경우를 나눔"}], "given": [{"term": "방정식", "src": "stem", "quote": "연립방정식"}], "condition": []}, "reasons": {"method": "x^2-y^2=0을 인수분해한 뒤 첫째 식에 대입해 최대 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.4

### 발문

복소수 \$z=(1+i)x^2-(8+i)x+16+5i\$에 대하여 \$z^2\$이 음의 실수일 때, 실수 \$x\$의 값은?

### 선지

① \$-4\$ ② \$4\$ ③ \$-2\$ ④ \$2\$ ⑤ \$0\$

### 정답

②

### 해설

\$z\$를 실수부분과 허수부분으로 정리하면 \$\$ z \= (x^2-8x+16)+(x^2-x+5)i \= (x-4)^2+(x^2-x+5)i \$\$ 허수부분 \$x^2-x+5=\\left(x-\\dfrac{1}{2}\\right)^2+\\dfrac{19}{4}\>0\$이므로 \$z^2\$이 음의 실수가 되려면 \$z\$가 순허수, 즉 실수부분이 \$0\$이어야 한다. \$\$ (x-4)^2 \= 0 \\implies x \= 4 \$\$ 이때 \$z=17i\$이므로 \$z^2=-289\<0\$이 성립한다.

```
{"status": "EXEMPT", "reason": "복소수 제곱이 음의 실수가 되는 순허수 조건으로 x를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=(x-4)^2+(x^2-x+5)i$로 정리하고, $z^2<0$ 조건(실수부 $0$, 허수부 $\\ne 0$)을 적용해 $x=4$를 구한다.", "decisiveStep": "허수부 $x^2-x+5>0$임을 확인하고 실수부 $(x-4)^2=0$에서 $x=4$를 확정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): z^2<0(순허수 조건)에서 실수부 0, 허수부!=0을 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 제곱이 음의 실수일 조건을 순허수 조건으로 환원해 푸는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $x$의 값은?"}], "method": [{"term": "실수부분", "src": "solution", "quote": "실수부분과 허수부분으로 정리하면", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=(1+i)x^2-(8+i)x+16+5i$"}], "condition": [{"term": "허수부분", "src": "solution", "quote": "허수부분 $x^2-x+5="}]}, "reasons": {"method": "복소수를 실수부·허수부로 정리해 순허수 조건으로 x를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.4

### 발문

방정식 \$x^3=-1\$의 한 허근을 \$\\omega\$라 할 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$\\omega\\overline{\\omega}=1\$ ㄴ. \$\\omega^2-\\omega+1=0\$ ㄷ. \$\\omega^2=\\overline{\\omega}\$

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄱ, ㄴ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

\$x^3+1=(x+1)(x^2-x+1)=0\$이므로 허근 \$\\omega\$는 \$\\omega^3=-1\$, \$\\omega^2-\\omega+1=0\$을 만족한다. 또한 \$x^2-x+1=0\$의 두 허근이 \$\\omega, \\overline{\\omega}\$이므로 근과 계수의 관계에 의해 \$\\omega+\\overline{\\omega}=1\$, \$\\omega\\overline{\\omega}=1\$이다.

- ㄱ. \$\\omega\\overline{\\omega}=1\$이므로 참이다.  
- ㄴ. \$\\omega^2-\\omega+1=0\$이므로 참이다.  
- ㄷ. \$\\omega^2=\\omega-1=-\\overline{\\omega}\\ne\\overline{\\omega}\$이므로 거짓이다. 따라서 옳은 것은 ㄱ, ㄴ이다.

```
{"status": "EXEMPT", "reason": "x^3=-1의 허근 ω의 기본 관계식과 켤레근 성질을 판별하는 순수 방정식 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$x^3+1=(x+1)(x^2-x+1)=0$과 근과 계수의 관계 $\\omega+\\overline{\\omega}=1, \\omega\\overline{\\omega}=1$을 이용해 ㄱ, ㄴ, ㄷ의 참거짓을 판별한다.", "decisiveStep": "$\\omega^2=\\omega-1=-\\overline{\\omega}$임을 보여 ㄷ의 부호 함정을 가려낸다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): x^3=-1의 허근 성질과 켤레근 관계를 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식 $x^3=-1$의 허근 $\\omega$의 이차식 관계와 켤레근의 성질을 판별하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "한 허근을 $\\omega$라 할 때"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "방정식", "src": "stem", "quote": "방정식 $x^3=-1$"}], "condition": []}, "reasons": {"method": "인수분해와 근과 계수의 관계로 ω 성질의 참거짓을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.5

### 발문

이차함수 \$f(x)=x^2+8x+4\$와 서로 다른 두 실수 \$a\$, \$b\$ (\$a\<b\$)가 \$f(a)=2b\$, \$f(b)=2a\$를 만족할 때, 함수 \$y=(x+2a)(x+2b)\$의 최솟값을 구하면?

### 선지

① \$-4\$ ② \$-2\$ ③ \$0\$ ④ \$2\$ ⑤ \$4\$

### 정답

①

### 해설

\$f(a)=a^2+8a+4=2b\$, \$f(b)=b^2+8b+4=2a\$에서 두 식을 빼면 \$\$ (a-b)(a+b+8) \= \-2(a-b) \$\$ \$a\\ne b\$이므로 \$a+b+8=-2\$, 즉 \$a+b=-10\$이다. 두 식을 더하면 \$\$ (a^2+b^2)+8(a+b)+8 \= 2(a+b) \\implies a^2+b^2 \= \-6(a+b)-8 \= 60-8 \= 52 \$\$ 따라서 \$ab \= \\dfrac{(a+b)^2-(a^2+b^2)}{2} \= \\dfrac{100-52}{2} \= 24\$이다. (\$a=-6, b=-4\$로 존재한다.) 구하는 함수는 \$\$ y \= (x+2a)(x+2b) \= x^2+2(a+b)x+4ab \= x^2-20x+96 \= (x-10)^2-4 \$\$ 이므로 최솟값은 \$-4\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [6, 14], "viewport": [6, 14, -6, 12], "pieces": [{"domain": [6, 14], "coefficients": ["96", "-20", "1"]}], "requiredPoints": [{"id": "V", "x": "10", "y": "-4", "label": "꼭짓점(10, -4)"}]}, "caption": "함수 y=(x+2a)(x+2b)=x^2-20x+96의 꼭짓점 (10, -4)에서의 최솟값 -4"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$f(a)-f(b)=2(b-a)$에서 $a+b=-10$을 구하고, $f(a)+f(b)$에서 $ab=24$를 구해 $y=x^2-20x+96$의 최솟값을 구한다.", "decisiveStep": "차에서 $a-b\\ne 0$을 약분해 $a+b=-10$을 얻은 뒤 합과 곱셈 공식 변형으로 $ab=24$를 도출한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 두 식의 차·합에서 근과 계수의 관계로 대칭식 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭 연립식의 차와 합으로 $a+b, ab$를 구해 새 이차함수의 최솟값을 찾는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "최솟값을 구하면?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x-10)^2-4", "evidenceType": "IMPLIED", "justification": "구한 이차함수를 완전제곱식으로 변형해 최솟값을 구함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2+8x+4$"}], "condition": [{"term": "실수", "src": "stem", "quote": "서로 다른 두 실수 $a$, $b$"}]}, "reasons": {"method": "두 조건식의 차와 합으로 a+b, ab를 구한 뒤 완전제곱식으로 최솟값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q12

- 형식: 객관식  
- 배점: 4.6

### 발문

\$-1\\le x\\le 1\$에서 함수 \$y=-(x^2-2x)^2+4(x^2-2x)+2\$의 최댓값을 \$M\$, 최솟값을 \$m\$이라 할 때, \$M+m\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

③

### 해설

\$t=x^2-2x=(x-1)^2-1\$로 치환하면 \$-1\\le x\\le 1\$에서 \$-1\\le t\\le 3\$이다. 주어진 함수는 \$\$ y \= \-t^2+4t+2 \= \-(t-2)^2+6 \$\$ 꼭짓점 \$t=2\$가 구간 \$\[-1, 3\]\$ 안에 있으므로 최댓값은 \$M=6\$이다. 양 끝점의 값은 \$y(-1)=-1-4+2=-3\$, \$y(3)=-9+12+2=5\$이므로 최솟값은 \$m=-3\$이다. 따라서 \$M+m=6+(-3)=3\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-1, 3], "viewport": [-2, 4, -4, 8], "pieces": [{"domain": [-1, 3], "coefficients": ["2", "4", "-1"]}], "requiredPoints": [{"id": "V", "x": "2", "y": "6", "label": "최댓값(2, 6)"}, {"id": "L", "x": "-1", "y": "-3", "label": "최솟값(-1, -3)"}]}, "caption": "치환 범위 -1<=t<=3에서 y=-t^2+4t+2의 최댓값 6과 최솟값 -3"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$t=x^2-2x$로 치환해 $-1\\le t\\le 3$ 범위를 구한 뒤 $y=-(t-2)^2+6$의 최대·최소를 구한다.", "decisiveStep": "치환 범위 $-1\\le t\\le 3$ 내의 꼭짓점 $t=2$에서 최댓값 $6$, 끝점 $t=-1$에서 최솟값 $-3$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): t=x^2-2x 치환 범위 [-1, 3]에서 이차함수 최대·최소를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "치환된 변수의 범위 산출과 제한된 범위의 이차함수 최대·최소를 연속으로 수행하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값을 $M$, 최솟값을 $m$"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-(t-2)^2+6", "evidenceType": "IMPLIED", "justification": "치환 후 이차함수를 완전제곱식으로 변형해 최대·최소를 구함"}], "given": [{"term": "이차함수", "src": "solution", "quote": "t=x^2-2x=(x-1)^2-1"}], "condition": []}, "reasons": {"method": "치환 변수의 범위를 구한 뒤 완전제곱식으로 최대·최소 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.6

### 발문

\$a+b+c=2025\$, \$\\dfrac{1}{a}+\\dfrac{1}{b}+\\dfrac{1}{c}=\\dfrac{1}{2025}\$일 때, \$\\dfrac{1}{a^{2027}}+\\dfrac{1}{b^{2027}}+\\dfrac{1}{c^{2027}}\$의 값은?

### 선지

① \$\\dfrac{1}{2025^{2025}}\$ ② \$\\dfrac{1}{2025^{2027}}\$ ③ \$\\dfrac{1}{2026^{2027}}\$ ④ \$\\dfrac{1}{2027^{2027}}\$ ⑤ \$\\dfrac{3}{2025^{2027}}\$

### 정답

②

### 해설

\$S=a+b+c=2025\$라 하면 \$\\dfrac{ab+bc+ca}{abc}=\\dfrac{1}{S}\$이므로 \$S(ab+bc+ca)=abc\$이다. 곱셈 항등식 \$(a+b)(b+c)(c+a)=(a+b+c)(ab+bc+ca)-abc=0\$에서 세 수 중 두 수의 합이 \$0\$이다. 합이 \$0\$인 두 수의 역수의 \$2027\$제곱(홀수 제곱)은 서로 부호가 반대이므로 합하면 \$0\$이 되고, 남은 한 수는 \$S=2025\$와 같다. 따라서 \$\\dfrac{1}{a^{2027}}+\\dfrac{1}{b^{2027}}+\\dfrac{1}{c^{2027}}=\\dfrac{1}{2025^{2027}}\$이다.

```
{"status": "EXEMPT", "reason": "곱셈 항등식 (a+b)(b+c)(c+a)=0을 도출해 홀수 거듭제곱 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "통분 식 $(a+b+c)(ab+bc+ca)=abc$를 $(a+b)(b+c)(c+a)=0$으로 인수분해하여 두 수의 합이 $0$임을 보인다.", "decisiveStep": "항등식 $(a+b)(b+c)(c+a)=0$에서 두 수의 홀수 제곱이 상쇄됨을 이끌어낸다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 대칭 조건식을 (a+b)(b+c)(c+a)=0으로 인수분해해 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수 조건을 곱셈 항등식으로 인수분해하여 대칭 홀수 제곱 상쇄를 도출하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "두 수의 합이 $0$이다"}], "method": [{"term": "인수분해", "src": "solution", "quote": "(a+b)(b+c)(c+a)=(a+b+c)(ab+bc+ca)-abc=0", "evidenceType": "IMPLIED", "justification": "대칭식 항등식을 (a+b)(b+c)(c+a)로 인수분해함"}], "given": [{"term": "항등식", "src": "solution", "quote": "곱셈 항등식"}], "condition": []}, "reasons": {"method": "통분 조건을 (a+b)(b+c)(c+a)=0으로 인수분해해 홀수 제곱 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.7

### 발문

사차방정식 \$(16x^2+4x+1)(16x^2-4x+1)=0\$의 서로 다른 네 근을 \$\\alpha\$, \$\\beta\$, \$\\gamma\$, \$\\delta\$라 할 때, \$\\dfrac{1}{\\alpha^6}+\\dfrac{1}{\\beta^6}+\\dfrac{1}{\\gamma^6}+\\dfrac{1}{\\delta^6}\$의 값은?

### 선지

① \$2^{10}\$ ② \$2^{11}\$ ③ \$2^{12}\$ ④ \$2^{13}\$ ⑤ \$2^{14}\$

### 정답

⑤

### 해설

\$y=4x\$로 두면 두 이차방정식은 각각 \$y^2+y+1=0\$, \$y^2-y+1=0\$이다.

- \$y^2+y+1=0\$의 양변에 \$(y-1)\$을 곱하면 \$y^3=1\$이므로 \$y^6=1\$이다.  
- \$y^2-y+1=0\$의 양변에 \$(y+1)\$을 곱하면 \$y^3=-1\$이므로 \$y^6=1\$이다. 따라서 네 근 모두 \$(4x)^6=1\$, 즉 \$\\dfrac{1}{x^6}=4^6=2^{12}\$이다. 그러므로 네 근의 역수 \$6\$제곱의 합은 \$4\\times 2^{12}=2^{14}\$이다.

```
{"status": "EXEMPT", "reason": "치환 y=4x와 세제곱 공식으로 네 근의 역수 6제곱 합을 구하는 순수 방정식 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$y=4x$로 치환하여 $y^2\\pm y+1=0$에서 $y^3=\\pm 1$, 즉 $y^6=1$을 얻어 $\\frac{1}{x^6}=2^{12}$를 계산한다.", "decisiveStep": "$4x=y$ 치환으로 네 근 모두 $(4x)^6=1$을 만족함을 밝혀 $4\\times 2^{12}=2^{14}$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): y=4x 치환으로 y^6=1을 유도해 거듭제곱 합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "치환과 $y^3\\pm 1=0$ 공식을 이용해 네 허근의 고차 거듭제곱 합을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "6$제곱의 합은 $4\\times 2^{12}=2^{14}$"}], "method": [{"term": "사차방정식", "src": "stem", "quote": "사차방정식 $(16x^2+4x+1)(16x^2-4x+1)=0$", "evidenceType": "IMPLIED", "justification": "y=4x 치환 후 y∓1을 곱해 y^6=1을 도출함"}], "given": [{"term": "사차방정식", "src": "stem", "quote": "사차방정식 $(16x^2+4x+1)(16x^2-4x+1)=0$"}], "condition": []}, "reasons": {"method": "y=4x 치환과 세제곱 공식으로 네 근의 역수 6제곱 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.9

### 발문

두 이차함수 \$f(x)=(x-2a)^2-4a^2\$, \$g(x)=-(x-a)^2+a^2-b\$에서 방정식 \$f(x)=g(x)\$는 서로 다른 두 실근 \$\\alpha\$, \$\\beta\$ (\$\\alpha\<\\beta\$)를 갖고 두 근의 차가 \$7\$이다. \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$5a^2\<b\$이다. ㄴ. \$f(\\alpha)-g(\\beta)\\le g(a)-f(2a)\$ ㄷ. \$g(\\alpha)=f(\\beta)+5a^2-b\$이면 \$b=196\$이다.

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

\$f(x)=x^2-4ax\$, \$g(x)=-x^2+2ax-b\$이므로 \$f(x)=g(x)\$는 \$2x^2-6ax+b=0\$이다. 근과 계수의 관계에서 \$\\alpha+\\beta=3a\$, \$\\alpha\\beta=\\dfrac{b}{2}\$이고, \$\\beta-\\alpha=7\$이므로 \$\$ 49 \= (3a)^2-4\\cdot\\frac{b}{2} \= 9a^2-2b \\implies b \= \\frac{9a^2-49}{2} \$\$

- ㄱ. \$5a^2\<\\dfrac{9a^2-49}{2} \\iff a^2\<-49\$이므로 거짓이다.  
- ㄴ. \$f(\\alpha)-g(\\beta)=g(\\alpha)-g(\\beta)=(\\beta-\\alpha)(\\alpha+\\beta-2a)=7a\$이고, \$g(a)-f(2a)=5a^2-b=\\dfrac{a^2+49}{2}\$이다. \$7a\\le\\dfrac{a^2+49}{2} \\iff (a-7)^2\\ge 0\$이므로 참이다.  
- ㄷ. \$g(\\alpha)=f(\\beta)+5a^2-b\$는 \$7a=\\dfrac{a^2+49}{2}\$와 같으므로 \$(a-7)^2=0 \\implies a=7\$, \$b=\\dfrac{9\\cdot 49-49}{2}=196\$이다. (참) 따라서 옳은 것은 ㄴ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "두 이차함수 교점 방정식의 근과 계수의 관계로 합답형 명제를 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "교점 방정식 $2x^2-6ax+b=0$에서 $b=\\frac{9a^2-49}{2}$를 구해 ㄱ·ㄴ·ㄷ을 완전제곱 부등식 $(a-7)^2\\ge 0$으로 판별한다.", "decisiveStep": "$f(\\alpha)-g(\\beta)=7a$와 $5a^2-b=\\frac{a^2+49}{2}$의 대소 비교가 $(a-7)^2\\ge 0$으로 귀결됨을 보인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): 두 이차함수의 교점 방정식 근과 계수의 관계 및 함수값 조건을 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차함수 교점의 차 조건과 함숫값 부등식·등식을 완전제곱 판별로 연결하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근 $\\alpha$, $\\beta$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에서", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "두 이차함수 $f(x)=(x-2a)^2-4a^2$"}], "condition": [{"term": "완전제곱식", "src": "solution", "quote": "(a-7)^2\\ge 0"}]}, "reasons": {"method": "교점 방정식의 근과 계수의 관계로 b를 정리해 ㄱ, ㄴ, ㄷ을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.6

### 발문

점 \$(a, 3)\$을 지나고 이차함수 \$y=x^2+5x+7\$의 그래프에 접하는 두 직선의 기울기의 합이 \$10\$일 때, 실수 \$a\$의 값을 구하시오.

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

②

### 해설

점 \$(a, 3)\$을 지나고 기울기가 \$m\$인 직선 \$y=m(x-a)+3\$이 포물선 \$y=x^2+5x+7\$에 접하려면 \$\$ x^2+5x+7 \= m(x-a)+3 \\implies x^2+(5-m)x+(ma+4)=0 \$\$ 이 중근을 가져야 하므로 판별식 \$D=0\$이다. \$\$ D \= (5-m)^2-4(ma+4) \= m^2-(10+4a)m+9 \= 0 \$\$ 서로 다른 두 접선의 기울기 \$m\_1, m\_2\$는 이 이차방정식의 두 근이므로 근과 계수의 관계에 의해 \$\$ m\_1+m\_2 \= 10+4a \= 10 \\implies a \= 0 \$\$ (\$a=0\$일 때 \$m^2-10m+9=0\$의 판별식은 \$100-36=64\>0\$으로 서로 다른 두 접선이 존재한다.) 따라서 \$a=0\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-5, 3], "viewport": [-5, 3, -2, 18], "pieces": [{"domain": [-5, 3], "coefficients": ["7", "5", "1"]}], "referenceLines": [{"slope": "1", "intercept": "3", "label": "y=x+3"}, {"slope": "9", "intercept": "3", "label": "y=9x+3"}], "requiredPoints": [{"id": "P", "x": "0", "y": "3", "label": "(0, 3)"}, {"id": "T1", "x": "-2", "y": "1", "label": "접점(-2, 1)"}, {"id": "T2", "x": "2", "y": "21", "label": "접점(2, 21)"}]}, "caption": "점 (0, 3)에서 이차함수 y=x^2+5x+7에 그은 두 접선 y=x+3, y=9x+3"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "접선 $y=m(x-a)+3$과 이차함수의 접선 조건 $D=0$에서 $m$에 대한 이차방정식 $m^2-(10+4a)m+9=0$을 세워 근과 계수의 관계를 쓴다.", "decisiveStep": "$m$에 대한 이차방정식의 두 근의 합 $10+4a=10$에서 $a=0$을 구하고 $D_m>0$을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 접선 D=0 조건으로 얻은 m의 이차방정식 근과 계수의 관계를 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기 $m$을 미지수로 둔 접선 판별식 방정식에서 다시 $m$에 대한 근과 계수의 관계를 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "stem", "quote": "기울기의 합이 $10$일 때"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+5x+7$"}], "condition": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해"}]}, "reasons": {"method": "접선 판별식 D=0으로 얻은 m의 이차방정식에 근과 계수의 관계를 적용함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.8

### 발문

\$0\\le x\\le 4\$에서 함수 \$f(x)=-x^2+2ax-4a+7\$의 최댓값과 최솟값의 합이 \$0\$이 되도록 하는 모든 실수 \$a\$의 값의 합은?

### 선지

① \$4\$ ② \$2\$ ③ \$0\$ ④ \$-2\$ ⑤ \$-4\$

### 정답

①

### 해설

\$f(x)=-(x-a)^2+a^2-4a+7\$이고 양 끝점에서의 값은 \$f(0)=-4a+7\$, \$f(4)=4a-9\$이다.

- \$a\<0\$ 또는 \$a\>4\$이면 꼭짓점이 구간 밖에 있으므로 최댓값과 최솟값의 합은 \$f(0)+f(4)=-2\\ne 0\$이다.  
- \$0\\le a\\le 2\$이면 꼭짓점이 구간 안에 있고 \$f(0)\\ge f(4)\$이므로 최댓값은 \$f(a)=a^2-4a+7\$, 최솟값은 \$f(4)=4a-9\$이다. 합이 \$0\$이므로 \$(a^2-4a+7)+(4a-9)=a^2-2=0\$, \$0\\le a\\le 2\$에서 \$a=\\sqrt{2}\$이다.  
- \$2\<a\\le 4\$이면 최댓값은 \$f(a)=a^2-4a+7\$, 최솟값은 \$f(0)=-4a+7\$이다. 합이 \$0\$이므로 \$a^2-8a+14=0\$, \$2\<a\\le 4\$에서 \$a=4-\\sqrt{2}\$이다. 따라서 모든 실수 \$a\$의 값의 합은 \$\\sqrt{2}+(4-\\sqrt{2})=4\$이다.

```
{"status": "EXEMPT", "reason": "축의 위치 a에 따라 구간 [0, 4]에서의 최대·최소 식을 경우 나누어 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "대칭축 $x=a$의 위치를 $a<0$, $0\\le a\\le 2$, $2<a\\le 4$, $a>4$로 나누어 최대·최소 합이 $0$인 $a$를 모두 구한다.", "decisiveStep": "구간 중앙 $x=2$를 기준으로 최솟값 위치가 $f(4)$에서 $f(0)$으로 바뀌는 두 구간에서 $\\sqrt{2}$와 $4-\\sqrt{2}$를 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 대칭축 x=a와 구간 [0, 4]의 위치 관계별 최솟값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "매개변수 축의 위치에 따른 4가지 경우 분류와 이차방정식 근의 범위 필터링이 필요한 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값의 합이 $0$"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-(x-a)^2+a^2-4a+7", "evidenceType": "IMPLIED", "justification": "대칭축 x=a를 구하기 위해 완전제곱식으로 변형함"}], "given": [{"term": "이차함수", "src": "solution", "quote": "f(x)=-(x-a)^2+a^2-4a+7"}], "condition": [{"term": "실수", "src": "stem", "quote": "모든 실수 $a$의"}]}, "reasons": {"method": "대칭축 a의 위치에 따라 구간을 나누어 최대·최소 합 조건을 푼다"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 4

### 발문

복소수 \$z=\\dfrac{1+i}{1-i}\$에 대하여 \$f(n)=z^n\$이라 할 때, \$f(1)+f(2)+f(3)+\\cdots+f(n)=-1\$인 \$60\$ 이하의 자연수 \$n\$의 개수를 구하시오. (단, \$i=\\sqrt{-1}\$이다.)

### 선지

없음

### 정답

\$15\$

### 해설

분모를 실수화하면 \$\$ z \= \\frac{1+i}{1-i} \= \\frac{(1+i)^2}{(1-i)(1+i)} \= \\frac{2i}{2} \= i \$\$ 이다. \$i^1=i\$, \$i^2=-1\$, \$i^3=-i\$, \$i^4=1\$이 주기 \$4\$로 반복되며 한 주기의 합은 \$i-1-i+1=0\$이다. 따라서 첫 항부터 \$n\$항까지의 합이 \$-1\$이 되려면 \$n\$을 \$4\$로 나눈 나머지가 \$3\$이어야 한다. \$60\$ 이하의 자연수 중 \$n=4k+3\$ (\$k\\ge 0\$)인 수는 \$3, 7, 11, \\ldots, 59\$이므로 개수는 \$\$ \\frac{59-3}{4}+1 \= 15 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수 i의 거듭제곱 합 주기성을 이용해 자연수 n의 개수를 세는 순수 대수 단답형 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=\\frac{1+i}{1-i}=i$로 정리하고 주기 $4$의 합 $0$을 이용해 부분합이 $-1$이 되는 $n\\equiv 3\\pmod 4$의 개수를 센다.", "decisiveStep": "한 주기 합이 $0$이므로 $i+(-1)+(-i)=-1$이 되는 $n\\equiv 3\\pmod 4$만 해당함을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 분모 실수화 z=i 후 4주기 부분합 조건을 만족하는 n을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 실수화 후 $i^n$의 주기 $4$ 성질을 이용해 조건을 만족하는 자연수 개수를 세는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "자연수 $n$의 개수를 구하시오"}], "method": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\dfrac{1+i}{1-i}$", "evidenceType": "IMPLIED", "justification": "복소수 나눗셈 실수화 후 허수단위 i의 주기성을 활용함"}], "given": [{"term": "자연수", "src": "stem", "quote": "$60$ 이하의 자연수 $n$"}], "condition": []}, "reasons": {"method": "z=i로 정리하고 거듭제곱 주기 4를 이용해 합이 -1이 되는 n을 셈"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 4

### 발문

모든 실수 \$x\$에 대하여 등식 \$(2x^2+x-1)^4=a\_8x^8+a\_7x^7+\\cdots+a\_1x+a\_0\$이 성립할 때, \$a\_2+a\_4+a\_6+a\_8\$의 값을 구하시오. (단, \$a\_0, a\_1, a\_2, \\cdots, a\_8\$은 상수이다.)

### 선지

없음

### 정답

\$7\$

### 해설

\$P(x)=(2x^2+x-1)^4\$이라 두면 \$\$ \\begin{aligned} P(1) &= (2+1-1)^4 \= 16 \= a\_8+a\_7+\\cdots+a\_1+a\_0 \\ P(-1) &= (2-1-1)^4 \= 0 \= a\_8-a\_7+\\cdots-a\_1+a\_0 \\end{aligned} \$\$ 두 식을 더하여 \$2\$로 나누면 \$\$ a\_0+a\_2+a\_4+a\_6+a\_8 \= \\frac{P(1)+P(-1)}{2} \= \\frac{16+0}{2} \= 8 \$\$ 한편 \$a\_0=P(0)=(-1)^4=1\$이므로 \$\$ a\_2+a\_4+a\_6+a\_8 \= 8-1 \= 7 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "항등식에 x=1, -1, 0을 대입해 짝수 차수 계수의 합을 구하는 순수 대수 단답형 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "항등식에 $x=1, -1$을 대입해 $\\frac{P(1)+P(-1)}{2}=a_0+a_2+a_4+a_6+a_8$을 구한 뒤 $a_0=P(0)$을 뺀다.", "decisiveStep": "$a_0=P(0)=1$을 빼야 $a_2+a_4+a_6+a_8$이 나옴에 유의해 $8-1=7$을 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): 항등식에 x=1, -1, 0을 대입해 짝수차 계수합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항등식 수치대입법($x=1, -1, 0$)을 조합해 짝수 차수 계수 합을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "$a_2+a_4+a_6+a_8$의 값을"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "P(1) &= (2+1-1)^4", "evidenceType": "IMPLIED", "justification": "항등식에 x=1, -1, 0을 대입하여 계수들의 합을 구함"}], "given": [{"term": "항등식", "src": "stem", "quote": "모든 실수 $x$에 대하여 등식"}], "condition": [{"term": "상수", "src": "stem", "quote": "상수이다"}]}, "reasons": {"method": "x=1, -1, 0을 대입한 수치대입법으로 짝수 차수 계수 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 7

### 발문

다항식 \$f(x)\$는 \$x\$로 나누어떨어지고, \$x-1\$로 나눈 나머지가 \$3\$, \$x+1\$로 나눈 나머지가 \$-7\$이다. \$f(x)\$를 \$x^3-x\$로 나눈 나머지를 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$-2x^2+5x\$

### 해설

나누는 식 \$x^3-x=x(x-1)(x+1)\$이 삼차식이므로 나머지 \$R(x)\$는 이차 이하의 다항식 \$R(x)=Ax^2+Bx+C\$이다. 몫을 \$Q(x)\$라 하면 \$f(x)=x(x-1)(x+1)Q(x)+Ax^2+Bx+C\$이다. 나머지정리에 의하여 \$f(0)=0\$, \$f(1)=3\$, \$f(-1)=-7\$이므로 \$\$ \\begin{aligned} R(0) &= C \= 0 \\ R(1) &= A+B \= 3 \\ R(-1) &= A-B \= \-7 \\end{aligned} \$\$ 두 식 \$A+B=3\$, \$A-B=-7\$을 더하면 \$2A=-4\$이므로 \$A=-2\$, 대입하면 \$B=5\$이다. 따라서 구하는 나머지는 \$R(x)=-2x^2+5x\$이다.

```
{"status": "EXEMPT", "reason": "삼차식으로 나눈 나머지를 이차식으로 두고 세 나머지정리 식을 연립하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "삼차식 $x^3-x=x(x-1)(x+1)$로 나눈 나머지를 $R(x)=Ax^2+Bx+C$로 두고 $f(0)=0, f(1)=3, f(-1)=-7$을 연립한다.", "decisiveStep": "$R(0)=C=0$, $A+B=3$, $A-B=-7$을 연립해 $A=-2, B=5$를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 삼차식 x^3-x 나눗셈 나머지를 Ax^2+Bx+C로 두고 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차식 나눗셈의 나머지 차수 설정과 세 일차식 나머지정리의 연립을 서술하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지를 구하는 과정"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$는"}], "condition": []}, "reasons": {"method": "나머지를 이차식으로 설정하고 나머지정리 세 조건을 연립함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 7

### 발문

이차함수 \$f(x)\$는 모든 \$x\$에 대하여 \$f(2-x)=f(2+x)\$를 만족시킨다. \$f(x)\$의 최댓값은 \$3\$이고, \$(0, \-1)\$을 지날 때, 다음 물음에 답하시오. (1) \$f(x)\$를 구하는 과정을 서술하시오. \[3점\] (2) \$0\\le x\\le 3\$에서 \$y={f(x)}^2+2f(x)-5\$의 최댓값과 최솟값을 구하는 과정을 서술하시오. \[4점\]

### 선지

없음

### 정답

(1) \$f(x)=-x^2+4x-1\$ (2) 최댓값 \$10\$, 최솟값 \$-6\$

### 해설

(1) 모든 \$x\$에 대하여 \$f(2-x)=f(2+x)\$이므로 이차함수 \$f(x)\$의 대칭축은 \$x=2\$이다. 최댓값이 \$3\$이므로 \$f(x)=a(x-2)^2+3\$ (\$a\<0\$)이라 둘 수 있다. 점 \$(0, \-1)\$을 지나므로 \$-1=a(0-2)^2+3=4a+3\$, 즉 \$a=-1\$이다. 따라서 \$\$ f(x) \= \-(x-2)^2+3 \= \-x^2+4x-1 \$\$ (2) \$0\\le x\\le 3\$에서 \$f(x)=-(x-2)^2+3\$은 \$x=2\$일 때 최댓값 \$3\$을 갖고, 양 끝점 \$f(0)=-1\$, \$f(3)=2\$ 중 더 작은 \$x=0\$에서 최솟값 \$-1\$을 갖는다. 따라서 \$t=f(x)\$로 치환하면 \$-1\\le t\\le 3\$이다. 구하는 함수는 \$\$ y \= t^2+2t-5 \= (t+1)^2-6 \$\$ 꼭짓점 \$t=-1\$이 구간 \$\[-1, 3\]\$에 포함되므로 \$t=-1\$일 때 최솟값은 \$-6\$이고, \$t=3\$일 때 최댓값은 \$(3+1)^2-6=10\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [0, 3], "viewport": [-1, 4, -2, 5], "pieces": [{"domain": [0, 3], "coefficients": ["-1", "4", "-1"]}], "requiredPoints": [{"id": "V", "x": "2", "y": "3", "label": "꼭짓점(2, 3)"}, {"id": "A", "x": "0", "y": "-1", "label": "(0, -1)"}, {"id": "B", "x": "3", "y": "2", "label": "(3, 2)"}]}, "caption": "구간 [0, 3]에서 f(x)=-x^2+4x-1의 치역 -1<=f(x)<=3"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "대칭 조건 $f(2-x)=f(2+x)$로 축 $x=2$를 구해 $f(x)=-x^2+4x-1$을 완성하고, $t=f(x)\\in[-1,3]$ 치환으로 합성 이차함수의 최대·최소를 구한다.", "decisiveStep": "(1)에서 $f(x)=-(x-2)^2+3$을 결정한 뒤, (2)에서 $0\\le x\\le 3$의 치역 $-1\\le t\\le 3$을 구해 연결한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 대칭 조건으로 이차함수를 세우고 제한 구간 최대·최소를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 선대칭식 해석, 식 작성, 치환을 통한 2단계 최대·최소가 결합된 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값은 $3$이고"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(t+1)^2-6", "evidenceType": "IMPLIED", "justification": "치환된 이차함수식을 완전제곱식으로 변형해 최대·최소를 구함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$는"}], "condition": [{"term": "축", "src": "solution", "quote": "대칭축은 $x=2$"}]}, "reasons": {"method": "대칭식으로 f(x)를 구한 뒤 치역 범위를 산출해 치환 이차함수의 최대·최소를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

세 변의 길이가 \$a\$, \$b\$, \$c\$인 삼각형 \$\\mathrm{ABC}\$가 다음 조건을 만족시킨다. (가) \$a^2b-a^2c+2ab^2-abc-ac^2+b^3-bc^2=0\$ (나) \$b+c=26\$ (다) \$13a=10b\$ 삼각형 \$\\mathrm{ABC}\$의 넓이를 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$60\$

### 해설

조건 (가)의 좌변을 \$(b-c)\$가 드러나도록 인수분해하면 \$\$ \\begin{aligned} a^2(b-c)+a(2b^2-bc-c^2)+b(b^2-c^2) &= (b-c){a^2+a(2b+c)+b(b+c)} \\ &= (b-c)(a+b)(a+b+c) \= 0 \\end{aligned} \$\$ 삼각형의 세 변의 길이는 양수이므로 \$a+b\>0\$, \$a+b+c\>0\$이다. 따라서 \$b-c=0\$, 즉 \$b=c\$이다. 조건 (나)에서 \$b+c=26\$이므로 \$b=c=13\$이고, 조건 (다)에서 \$13a=10\\cdot 13\$이므로 \$a=10\$이다. 따라서 삼각형 \$\\mathrm{ABC}\$는 세 변의 길이가 \$13, 13, 10\$인 이등변삼각형이다. 길이가 \$10\$인 밑변 \$\\mathrm{BC}\$의 중점을 \$\\mathrm{H}\$라 하면 \$\\overline{\\mathrm{AH}}\\perp\\overline{\\mathrm{BC}}\$, \$\\overline{\\mathrm{BH}}=5\$이므로 피타고라스 정리에 의해 높이 \$h=\\overline{\\mathrm{AH}}\$는 \$\$ h \= \\sqrt{13^2-5^2} \= \\sqrt{144} \= 12 \$\$ 따라서 삼각형 \$\\mathrm{ABC}\$의 넓이는 \$\\dfrac{1}{2}\\times 10\\times 12 \= 60\$이다.

```
{"capability": "plane", "title": "세 변이 13, 13, 10인 이등변삼각형 ABC와 높이 AH", "points": [{"id": "A", "x": 5, "y": 12, "label": "A"}, {"id": "B", "x": 0, "y": 0, "label": "B"}, {"id": "C", "x": 10, "y": 0, "label": "C"}, {"id": "H", "x": 5, "y": 0, "label": "H"}], "segments": [{"id": "sAB", "from": "A", "to": "B", "label": "13"}, {"id": "sAC", "from": "A", "to": "C", "label": "13"}, {"id": "sBC", "from": "B", "to": "C", "label": "10"}, {"id": "sAH", "from": "A", "to": "H", "label": "12"}], "rightAngles": [{"vertex": "H", "p1": "A", "p2": "C"}], "planeMarks": {"equalLengths": [{"id": "e1", "count": 1, "segments": ["sAB", "sAC"]}]}, "caption": "b=c=13, a=10인 이등변삼각형 ABC의 밑변에 내린 수선 AH의 길이 12"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "조건 (가)를 $(b-c)(a+b)(a+b+c)=0$으로 인수분해해 이등변삼각형 $b=c=13, a=10$을 구하고, 피타고라스 정리로 높이와 넓이를 구한다.", "decisiveStep": "$a^2b-a^2c+2ab^2-abc-ac^2+b^3-bc^2=(b-c)(a+b)(a+b+c)$로 인수분해하는 단계가 핵심이다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 삼각형 세 변 조건식을 인수분해해 이등변삼각형을 판정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 문자 다항식 인수분해로 삼각형의 모양을 결정한 뒤 피타고라스 정리로 넓이를 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "넓이", "src": "stem", "quote": "삼각형 $\\mathrm{ABC}$의 넓이를"}], "method": [{"term": "인수분해", "src": "solution", "quote": "드러나도록 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $\\mathrm{ABC}$가"}], "condition": [{"term": "피타고라스정리", "src": "solution", "quote": "피타고라스 정리에 의해"}]}, "reasons": {"method": "세 문자 식을 인수분해해 b=c를 얻고 피타고라스 정리로 넓이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

