

```
{"stem": "22_순천여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_순천여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.6

### 발문

두 다항식 \$A=2x^2+xy-3y^2\$, \$B=x^2-2xy+2y^2\$에 대하여 \$2X-B=2A+3B\$를 만족하는 다항식 \$X=ax^2+bxy+cy^2\$일 때, \$a+b+c\$의 값은?

### 선지

① \$0\$ ② \$2\$ ③ \$4\$ ④ \$6\$ ⑤ \$8\$

### 정답

②

### 해설

주어진 등식을 \$X\$에 대하여 정리하면 \$\$ 2X \= 2A+4B \\implies X \= A+2B \$\$ \$A\$와 \$B\$를 대입하여 계산하면 \$\$ \\begin{aligned} X &= (2x^2+xy-3y^2)+2(x^2-2xy+2y^2) \\ &= 4x^2-3xy+y^2 \\end{aligned} \$\$ 따라서 \$a=4\$, \$b=-3\$, \$c=1\$이므로 \$a+b+c=4-3+1=2\$이다.

```
{"status": "EXEMPT", "reason": "다항식 등식을 정리하고 대입하여 계수의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "등식 $2X-B=2A+3B$를 $X=A+2B$로 정리한 뒤 $A, B$를 대입하여 계수 $a, b, c$를 구한다.", "decisiveStep": "$X=A+2B$로 먼저 정리한 후 동류항 계산으로 $a=4, b=-3, c=1$을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): X=A+2B 정리 후 다항식 덧셈으로 동류항 계수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 일차방정식 변형과 대입 연산으로 계수를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "만족하는 다항식 $X=ax^2+bxy+cy^2$"}], "method": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=2x^2+xy-3y^2$", "evidenceType": "IMPLIED", "justification": "등식을 X에 대해 정리하고 다항식의 실수배·덧셈을 수행함"}], "given": [{"term": "계수", "src": "solution", "quote": "X = A+2B"}], "condition": []}, "reasons": {"method": "등식을 X=A+2B로 정리해 다항식을 대입하고 계수 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.6

### 발문

\$x\$에 대한 다항식 \$x^3-2x^2+ax+7\$을 \$x+1\$로 나누어떨어지게 하는 상수 \$a\$를 구하면?

### 선지

① \$-4\$ ② \$-2\$ ③ \$2\$ ④ \$4\$ ⑤ \$6\$

### 정답

④

### 해설

\$P(x)=x^3-2x^2+ax+7\$이라 하면 \$x+1\$로 나누어떨어지므로 인수정리에 의하여 \$P(-1)=0\$이다. \$\$ P(-1) \= (-1)^3-2(-1)^2+a(-1)+7 \= \-1-2-a+7 \= 4-a \= 0 \$\$ 따라서 \$a=4\$이다.

```
{"status": "EXEMPT", "reason": "인수정리 P(-1)=0을 적용해 상수 a를 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "다항식 $P(x)=x^3-2x^2+ax+7$에 인수정리를 적용해 $P(-1)=0$을 푼다.", "decisiveStep": "$P(-1)=4-a=0$에서 $a=4$를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012(RPM_ONLY): 인수정리 P(-1)=0으로 미정계수 a를 구하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식으로 나누어떨어질 조건에 인수정리를 바로 대입하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$를 구하면?"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^3-2x^2+ax+7$"}], "condition": []}, "reasons": {"method": "인수정리 P(-1)=0을 적용해 미정계수 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 3.7

### 발문

다음 등식 \$(a-2)x+5=4x+b+1\$이 \$x\$에 대한 항등식이 되도록 하는 상수 \$a\$, \$b\$에 대하여 \$ab\$의 값은?

### 선지

① \$24\$ ② \$18\$ ③ \$12\$ ④ \$8\$ ⑤ \$6\$

### 정답

①

### 해설

\$x\$에 대한 항등식이므로 양변의 \$x\$의 계수와 상수항이 각각 같다. \$\$ a-2=4 \\implies a=6, \\qquad 5=b+1 \\implies b=4 \$\$ 따라서 \$ab=6\\cdot 4=24\$이다.

```
{"status": "EXEMPT", "reason": "일차항등식의 계수비교법으로 상수 a, b를 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "일차항등식 $(a-2)x+5=4x+b+1$의 양변에서 $x$의 계수와 상수항을 비교한다.", "decisiveStep": "$a-2=4$와 $b+1=5$를 각각 풀어 $a=6, b=4$를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 일차항등식 계수비교법으로 상수 a, b를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항등식의 계수비교법을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$에 대하여"}], "method": [{"term": "계수비교", "src": "solution", "quote": "양변의 $x$의 계수와 상수항이 각각 같다", "evidenceType": "IMPLIED", "justification": "항등식의 양변 동류항 계수를 비교하여 미정계수를 구함"}], "given": [{"term": "항등식", "src": "stem", "quote": "$x$에 대한 항등식"}], "condition": []}, "reasons": {"method": "일차항등식의 계수비교로 a, b를 구해 곱을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.7

### 발문

\$\\dfrac{2x}{1+i}+2y=7-3i\$를 만족시키는 실수 \$x\$, \$y\$에 대하여 \$x+y\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

⑤

### 해설

분모의 켤레복소수 \$1-i\$를 분모와 분자에 곱하면 \$\$ \\frac{2x}{1+i} \= \\frac{2x(1-i)}{(1+i)(1-i)} \= \\frac{2x(1-i)}{2} \= x-xi \$\$ 주어진 식에 대입하면 \$(x+2y)-xi \= 7-3i\$이다. \$x, y\$가 실수이므로 실수부분과 허수부분을 비교하면 \$-x=-3 \\implies x=3\$, \$x+2y=7 \\implies 3+2y=7 \\implies y=2\$이다. 따라서 \$x+y=3+2=5\$이다.

```
{"status": "EXEMPT", "reason": "복소수 분모 실수화와 복소수 상등 조건으로 x, y를 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "$\\frac{2x}{1+i}=x-xi$로 실수화한 뒤 실수부분 $x+2y=7$과 허수부분 $-x=-3$을 연립한다.", "decisiveStep": "분모 실수화로 $(x+2y)-xi=7-3i$를 얻어 $x=3, y=2$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-022(DIRECT_ACTIVE): 분모 실수화 후 서로 같은 복소수 조건으로 x, y를 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분모의 실수화와 복소수 상등 조건을 연결해 연립방정식을 푸는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $x$, $y$에 대하여"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모의 켤레복소수 $1-i$", "evidenceType": "NAMED"}], "given": [{"term": "실수부분", "src": "solution", "quote": "실수부분과 허수부분을 비교하면"}], "condition": []}, "reasons": {"method": "분모 실수화 후 실수부·허수부 비교로 x, y를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$x^2-3x+1=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라고 할 때, \$\\dfrac{\\beta^2}{\\alpha}+\\dfrac{\\alpha^2}{\\beta}\$의 값은?

### 선지

① \$9\$ ② \$12\$ ③ \$18\$ ④ \$24\$ ⑤ \$27\$

### 정답

③

### 해설

이차방정식 \$x^2-3x+1=0\$에서 근과 계수의 관계에 의하여 \$\\alpha+\\beta=3\$, \$\\alpha\\beta=1\$이다. 구하는 식을 통분하면 \$\$ \\frac{\\beta^2}{\\alpha}+\\frac{\\alpha^2}{\\beta} \= \\frac{\\alpha^3+\\beta^3}{\\alpha\\beta} \= \\frac{(\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta)}{\\alpha\\beta} \$\$ 따라서 \$\\dfrac{3^3-3\\cdot 1\\cdot 3}{1} \= 27-9 \= 18\$이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계와 세제곱 합 변형 공식으로 대칭식을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계로 $\\alpha+\\beta=3, \\alpha\\beta=1$을 구한 뒤 통분한 식 $\\frac{\\alpha^3+\\beta^3}{\\alpha\\beta}$를 계산한다.", "decisiveStep": "통분 후 $\\alpha^3+\\beta^3=(\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta)$ 변형 공식을 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계로 합·곱을 구해 세제곱 합 대칭식을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "통분, 세제곱 합 곱셈 공식 변형, 근과 계수의 관계를 결합한 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "(\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta)"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-3x+1=0$"}], "condition": []}, "reasons": {"method": "통분 후 근과 계수의 관계와 세제곱 합 변형 공식으로 값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q06

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$(x+1)(x+3)(x+5)(x+7)+k\$가 \$x\$에 대한 이차식의 제곱으로 인수분해되도록 하는 상수 \$k\$의 값은?

### 선지

① \$4\$ ② \$16\$ ③ \$8\$ ④ \$12\$ ⑤ \$20\$

### 정답

②

### 해설

상수항의 합이 같도록 두 일차식씩 짝지어 전개하면 \$\$ \\begin{aligned} (x+1)(x+7) &= x^2+8x+7 \\ (x+3)(x+5) &= x^2+8x+15 \\end{aligned} \$\$ \$t=x^2+8x+11\$로 치환하면 주어진 식은 \$(t-4)(t+4)+k \= t^2-16+k\$이다. 이 식이 이차식의 제곱이 되려면 \$-16+k=0\$이어야 하므로 \$k=16\$이다.

```
{"status": "EXEMPT", "reason": "네 일차식의 곱을 짝지어 치환한 뒤 완전제곱식 조건을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$(x+1)(x+7)$과 $(x+3)(x+5)$로 짝지어 $t=x^2+8x+11$로 치환한 뒤 $(t-4)(t+4)+k=t^2$ 조건에서 $k=16$을 구한다.", "decisiveStep": "공통부분의 중앙값 $t=x^2+8x+11$로 치환하여 $t^2-16+k$에서 상수항 $0$ 조건을 쓴다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 상수항 합이 같은 쌍을 치환해 완전제곱식 인수분해 조건을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "네 일차식의 곱을 짝지어 치환하고 완전제곱식 조건을 결정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "완전제곱식", "src": "stem", "quote": "이차식의 제곱으로 인수분해"}], "method": [{"term": "인수분해", "src": "stem", "quote": "인수분해되도록", "evidenceType": "IMPLIED", "justification": "두 일차식씩 짝지어 전개 후 치환하여 완전제곱식을 만듦"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(x+1)(x+3)(x+5)(x+7)+k$"}], "condition": []}, "reasons": {"method": "짝지어 전개 후 치환하여 완전제곱식 상수항 조건으로 k를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.9

### 발문

\$0\$이 아닌 복소수 \$z\$와 그 켤레복소수 \$\\overline{z}\$에 대하여 \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$\\dfrac{1}{z}+\\dfrac{1}{\\overline{z}}\$는 실수이다. ㄴ. \$z^2\$이 실수이면 \$(z-1)^2\$도 실수이다. ㄷ. \$(2+z)(2+\\overline{z})\$는 실수이다.

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

- ㄱ. \$\\dfrac{1}{z}+\\dfrac{1}{\\overline{z}} \= \\dfrac{z+\\overline{z}}{z\\overline{z}}\$에서 분모 \$z\\overline{z}\$는 \$0\$이 아닌 실수이고 분자 \$z+\\overline{z}\$도 실수이므로 참이다.  
- ㄴ. \$z=i\$이면 \$z^2=-1\$은 실수이지만 \$(z-1)^2=(i-1)^2=-2i\$는 실수가 아니므로 거짓이다.  
- ㄷ. \$\\overline{2+z}=2+\\overline{z}\$이므로 \$(2+z)(2+\\overline{z})=(2+z)\\overline{(2+z)}\$는 실수이다. (참) 따라서 옳은 것은 ㄱ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "복소수와 켤레복소수의 연산 결과가 실수인지 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "복소수 합·곱 $z+\\overline{z}, z\\overline{z}$의 실수 성질과 반례 $z=i$를 이용해 ㄱ, ㄴ, ㄷ의 실수 여부를 판별한다.", "decisiveStep": "ㄴ에서 반례 $z=i$일 때 $(i-1)^2=-2i$가 실수가 아님을 보인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 켤레복소수의 합·곱 실수 성질과 반례로 명제를 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레복소수와의 합·곱이 실수임을 이용하고 반례로 거짓 명제를 가려내는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수이다"}], "method": [{"term": "켤레복소수", "src": "stem", "quote": "켤레복소수 $\\overline{z}$", "evidenceType": "IMPLIED", "justification": "복소수와 그 켤레복소수의 합과 곱이 항상 실수인 성질을 이용함"}], "given": [{"term": "복소수", "src": "stem", "quote": "$0$이 아닌 복소수 $z$"}], "condition": []}, "reasons": {"method": "켤레복소수 연산의 실수 성질과 반례 z=i로 보기를 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.9

### 발문

이차함수 \$y=x^2+kx+5\$의 그래프와 직선 \$y=-4x+2\$의 그래프가 접하도록 하는 모든 실수 \$k\$의 값의 합은?

### 선지

① \$-8\$ ② \$-4\$ ③ \$0\$ ④ \$4\$ ⑤ \$8\$

### 정답

①

### 해설

두 그래프가 접하려면 연립방정식 \$x^2+kx+5=-4x+2\$, 즉 \$\$ x^2+(k+4)x+3=0 \$\$ 이 중근을 가져야 하므로 판별식 \$D=0\$이다. \$\$ D \= (k+4)^2-4\\cdot 1\\cdot 3 \= 0 \\implies (k+4)^2=12 \\implies k \= \-4\\pm 2\\sqrt{3} \$\$ 따라서 모든 실수 \$k\$의 값의 합은 \$(-4+2\\sqrt{3})+(-4-2\\sqrt{3})=-8\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-4, 4], "viewport": [-4, 4, -2, 14], "pieces": [{"domain": [-4, 4], "coefficients": ["5", "-4+2*sqrt(3)", "1"]}], "referenceLines": [{"slope": "-4", "intercept": "2", "label": "y=-4x+2"}], "requiredPoints": [{"id": "T", "x": "-sqrt(3)", "y": "2+4*sqrt(3)", "label": "접점"}]}, "caption": "k=-4+2sqrt(3)일 때 이차함수 y=x^2+kx+5와 직선 y=-4x+2가 접하는 모습"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $x^2+(k+4)x+3=0$의 접선 조건 $D=(k+4)^2-12=0$에서 두 $k$ 값의 합을 구한다.", "decisiveStep": "$k^2+8k+4=0$ 또는 $k=-4\\pm 2\\sqrt{3}$에서 두 값의 합 $-8$을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 이차함수와 직선의 접선 조건 D=0에서 k 값의 합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 접선 조건을 판별식 $D=0$으로 세워 $k$의 합을 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "stem", "quote": "값의 합은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+kx+5$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=-4x+2$"}], "condition": [{"term": "중근", "src": "solution", "quote": "중근을 가져야"}]}, "reasons": {"method": "연립이차방정식의 판별식 D=0으로 k를 구해 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

연립부등식 \$\\begin{cases} x-2\<3x+1 \\ a-x\\ge x \\end{cases}\$를 만족시키는 정수 \$x\$의 합이 \$9\$가 되도록 하는 정수 \$a\$의 최솟값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

⑤

### 해설

첫째 부등식 \$x-2\<3x+1\$에서 \$-3\<2x\$, 즉 \$x\>-\\dfrac{3}{2}\$이다. 둘째 부등식 \$a-x\\ge x\$에서 \$2x\\le a\$, 즉 \$x\\le\\dfrac{a}{2}\$이다. 따라서 연립부등식의 해는 \$-\\dfrac{3}{2}\<x\\le\\dfrac{a}{2}\$이고, 만족하는 정수는 \$-1, 0, 1, \\ldots, m\$ (\$m=\\left\\lfloor\\dfrac{a}{2}\\right\\rfloor\$)이다. 이 정수들의 합이 \$9\$가 되려면 \$\$ (-1)+0+1+2+3+4 \= 9 \$\$ 이어야 하므로 가장 큰 정수는 \$m=4\$이다. 따라서 \$4\\le\\dfrac{a}{2}\<5\$, 즉 \$8\\le a\<10\$이므로 정수 \$a\$의 최솟값은 \$8\$이다.

```
{"status": "EXEMPT", "reason": "연립일차부등식의 정수해 합 조건으로 미지수 a의 범위를 구하는 순수 부등식 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "연립부등식 $-\\frac{3}{2}<x\\le\\frac{a}{2}$의 정수해가 $-1$부터 시작함을 구하고, 합이 $9$가 되는 상한 정수 $4$로 $4\\le\\frac{a}{2}<5$를 세운다.", "decisiveStep": "정수해 $-1, 0, 1, 2, 3, 4$의 합이 $9$임으로부터 부등식 $4\\le\\frac{a}{2}<5$를 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "정수해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_PARAMETER_INTEGER", "why": "high1.json H1-RPM-046(DIRECT_ACTIVE): 연립일차부등식의 정수해 합 조건으로 상수 a의 범위를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연립부등식의 해집합에서 정수해의 합 조건을 만족하는 경계 정수 범위를 역산하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "정수 $a$의 최솟값은?"}], "method": [{"term": "정수", "src": "stem", "quote": "정수 $x$의 합이 $9$", "evidenceType": "IMPLIED", "justification": "연립일차부등식의 해 범위 내 정수를 순서대로 더해 상한을 확정함"}], "given": [{"term": "부등식", "src": "solution", "quote": "첫째 부등식"}], "condition": []}, "reasons": {"method": "부등식 해 범위에서 정수해 합이 9가 되는 상한을 찾아 a의 최솟값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

삼각형 \$\\mathrm{ABC}\$의 세 변의 길이 \$a\$, \$b\$, \$c\$ 사이에 다음과 같은 관계가 성립할 때, 삼각형 \$\\mathrm{ABC}\$는 어떤 삼각형인지 구하면? \$\$a^3+3a^2b+ab^2-ac^2-3bc^2+3b^3=0\$\$

### 선지

① \$a=b\$인 이등변삼각형 ② \$b=c\$인 이등변삼각형 ③ 빗변의 길이가 \$c\$인 직각삼각형 ④ 빗변의 길이가 \$a\$인 직각삼각형 ⑤ 정삼각형

### 정답

③

### 해설

주어진 식을 차수가 가장 낮은 문자 \$c\$에 대하여 내림차순으로 정리하면 \$\$ \\begin{aligned} \-(a+3b)c^2+(a^3+3a^2b+ab^2+3b^3) &= \-(a+3b)c^2+{a^2(a+3b)+b^2(a+3b)} \\ &= (a+3b)(a^2+b^2-c^2) \= 0 \\end{aligned} \$\$ \$a\>0\$, \$b\>0\$이므로 \$a+3b\>0\$이다. 따라서 \$a^2+b^2-c^2=0\$, 즉 \$a^2+b^2=c^2\$이다. 피타고라스 정리의 역에 의하여 삼각형 \$\\mathrm{ABC}\$는 빗변의 길이가 \$c\$인 직각삼각형이다.

```
{"status": "EXEMPT", "reason": "삼각형 세 변에 대한 다항식을 내림차순 인수분해하여 삼각형 모양을 판정하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "차수가 가장 낮은 문자 $c$에 대해 내림차순 정리해 $(a+3b)(a^2+b^2-c^2)=0$으로 인수분해하고 $a+3b>0$ 조건을 적용한다.", "decisiveStep": "$c^2$을 포함한 항을 묶어 $(a+3b)(a^2+b^2-c^2)=0$으로 인수분해한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 다문자 조건식을 내림차순 인수분해해 직각삼각형을 판정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식을 낮은 차수의 문자로 정리해 인수분해한 뒤 변의 양수 조건으로 직각삼각형을 판정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "직각삼각형", "src": "solution", "quote": "빗변의 길이가 $c$인 직각삼각형"}], "method": [{"term": "인수분해", "src": "solution", "quote": "(a+3b)(a^2+b^2-c^2) = 0", "evidenceType": "IMPLIED", "justification": "낮은 차수 문자 c에 대해 정리해 공통인수 (a+3b)로 인수분해함"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $\\mathrm{ABC}$의 세 변"}], "condition": [{"term": "피타고라스정리", "src": "solution", "quote": "피타고라스 정리의 역에 의하여"}]}, "reasons": {"method": "문자 c 기준 내림차순 인수분해로 a^2+b^2=c^2을 도출함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

\$-3\\le x\\le 0\$에서 이차함수 \$y=-x^2-4x+k\$의 최솟값이 \$-2\$일 때, 이 이차함수의 최댓값은? (단, \$k\$는 상수이다.)

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

①

### 해설

완전제곱식으로 변형하면 \$\$ y \= \-x^2-4x+k \= \-(x+2)^2+k+4 \$\$ 위로 볼록하고 꼭짓점의 \$x\$좌표 \$-2\$가 구간 \$-3\\le x\\le 0\$에 포함되므로 최댓값은 \$k+4\$이다. 구간의 양 끝점에서의 함숫값은 \$x=-3\$일 때 \$k+3\$, \$x=0\$일 때 \$k\$이므로 최솟값은 \$k\$이다. 최솟값이 \$-2\$이므로 \$k=-2\$이고, 따라서 최댓값은 \$-2+4=2\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-3, 0], "viewport": [-4, 1, -4, 4], "pieces": [{"domain": [-3, 0], "coefficients": ["-2", "-4", "-1"]}], "requiredPoints": [{"id": "V", "x": "-2", "y": "2", "label": "최댓값(-2, 2)"}, {"id": "R", "x": "0", "y": "-2", "label": "최솟값(0, -2)"}]}, "caption": "구간 [-3, 0]에서 이차함수 y=-x^2-4x-2의 최솟값 -2와 최댓값 2"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "이차함수를 $y=-(x+2)^2+k+4$로 변형해 끝점 $x=0$에서의 최솟값 $k=-2$를 구한 뒤 꼭짓점 최댓값 $k+4$를 구한다.", "decisiveStep": "꼭짓점 $x=-2$로부터 더 먼 끝점 $x=0$에서 최솟값 $k=-2$가 나옴을 판정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 위로 볼록 이차함수의 제한 구간 최솟값으로 k를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한된 범위의 이차함수에서 최솟값 조건으로 $k$를 구한 뒤 최댓값을 계산하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "이 이차함수의 최댓값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식으로 변형하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2-4x+k$"}], "condition": [{"term": "최솟값", "src": "stem", "quote": "최솟값이 $-2$일 때"}]}, "reasons": {"method": "완전제곱식 변형으로 최솟값 지점에서 k를 구하고 최댓값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

삼차방정식 \$x^3+ax^2+bx-15=0\$의 한 근이 \$1+2i\$일 때, 실수 \$a\$, \$b\$에 대하여 \$a+b\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$

### 정답

②

### 해설

계수가 모두 실수이므로 \$1+2i\$가 근이면 켤레복소수 \$1-2i\$도 근이다. 두 근 \$1\\pm 2i\$를 갖는 이차식은 \$(x-1)^2+4=x^2-2x+5\$이다. 나머지 한 실근을 \$r\$라 두면 상수항 비교에서 \$(-r)\\cdot 5=-15 \\implies r=3\$이다. 따라서 \$\$ (x^2-2x+5)(x-3) \= x^3-5x^2+11x-15 \$\$ 이므로 \$a=-5\$, \$b=11\$이고 \$a+b=-5+11=6\$이다.

```
{"status": "EXEMPT", "reason": "실계수 삼차방정식의 켤레근과 상수항 비교로 계수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "켤레근 $1-2i$로 이차인수 $x^2-2x+5$를 만들고 상수항 $-15$와 비교해 나머지 실근 $3$을 찾아 전개한다.", "decisiveStep": "상수항 $-5r=-15$에서 나머지 실근 $r=3$을 구해 삼차식을 전개한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json H1-RPM-031(DIRECT_BINDING_GAP): 실계수 삼차방정식의 켤레근과 상수항 비교로 계수를 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실계수 삼차방정식의 켤레근 성질과 인수 전개를 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$, $b$에 대하여"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수 $1-2i$도 근이다", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3+ax^2+bx-15=0$"}], "condition": []}, "reasons": {"method": "켤레근으로 이차인수를 만들고 상수항으로 실근을 구해 계수를 결정함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q13

- 형식: 객관식  
- 배점: 4.1

### 발문

자연수 \$n\$에 대하여 \$f(n)=i^n+\\dfrac{1}{i^{n+1}}\$이라 할 때, \$f(1)+f(2)+f(3)+\\cdots+f(58)\$의 값은? (단, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$-2-2i\$ ② \$-1+i\$ ③ \$0\$ ④ \$-2+2i\$ ⑤ \$2-2i\$

### 정답

④

### 해설

\$f(n)=i^n+\\dfrac{1}{i^{n+1}}\$의 처음 네 항을 계산하면 \$\$ \\begin{aligned} f(1) &= i+\\frac{1}{i^2} \= \-1+i \\ f(2) &= \-1+\\frac{1}{i^3} \= \-1+i \\ f(3) &= \-i+\\frac{1}{i^4} \= 1-i \\ f(4) &= 1+\\frac{1}{i^5} \= 1-i \\end{aligned} \$\$ 주기가 \$4\$이고 한 주기의 합은 \$f(1)+f(2)+f(3)+f(4)=0\$이다. \$58=4\\cdot 14+2\$이므로 \$\$ f(1)+\\cdots+f(58) \= f(1)+f(2) \= (-1+i)+(-1+i) \= \-2+2i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "허수단위 i의 거듭제곱 주기 4를 이용해 58항까지의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$f(1), f(2), f(3), f(4)$를 계산해 주기 $4$의 합이 $0$임을 보이고 $58=4\\cdot 14+2$의 나머지 두 항을 더한다.", "decisiveStep": "한 주기 $4$항의 합이 $0$이므로 $58\\equiv 2\\pmod 4$에 따라 $f(1)+f(2)$만 남는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 복소수 함수의 주기 4를 이용해 58항의 합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허수단위 $i$의 주기 $4$ 성질을 이용해 수열의 합을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "한 주기의 합은"}], "method": [{"term": "복소수", "src": "solution", "quote": "주기가 $4$이고", "evidenceType": "IMPLIED", "justification": "허수단위 i의 거듭제곱이 주기 4로 순환하는 성질을 이용함"}], "given": [{"term": "자연수", "src": "stem", "quote": "자연수 $n$에 대하여"}], "condition": []}, "reasons": {"method": "i^n의 주기 4를 이용해 58항까지의 합을 f(1)+f(2)로 줄여 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.1

### 발문

삼차방정식 \$x^3-11x+20=0\$의 한 허근을 \$\\omega\$라고 할 때, \$(\\omega^3-10\\omega+17)(\\overline{\\omega}^3-10\\overline{\\omega}+17)\$의 값은? (단, \$\\overline{\\omega}\$는 \$\\omega\$의 켤레복소수이다.)

### 선지

① \$1\$ ② \$10\$ ③ \$5\$ ④ \$8\$ ⑤ \$2\$

### 정답

⑤

### 해설

허근 \$\\omega\$는 방정식의 근이므로 \$\\omega^3=11\\omega-20\$이다. 이를 대입해 차수를 낮추면 \$\$ \\omega^3-10\\omega+17 \= (11\\omega-20)-10\\omega+17 \= \\omega-3 \$\$ 마찬가지로 \$\\overline{\\omega}^3-10\\overline{\\omega}+17=\\overline{\\omega}-3\$이다. 한편 \$x^3-11x+20=(x+4)(x^2-4x+5)=0\$이므로 두 허근 \$\\omega, \\overline{\\omega}\$는 \$x^2-4x+5=0\$의 두 근 \$2\\pm i\$이다. 따라서 \$\$ (\\omega-3)(\\overline{\\omega}-3) \= (-1+i)(-1-i) \= 1+1 \= 2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 대입으로 차수를 낮추고 인수분해된 이차식의 두 허근으로 켤레곱을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$\\omega^3=11\\omega-20$으로 식을 $\\omega-3$으로 낮추고, $x^3-11x+20=(x+4)(x^2-4x+5)$에서 허근 $2\\pm i$를 대입한다.", "decisiveStep": "삼차식 차수 낮추기 $\\omega^3=11\\omega-20$과 인수분해를 함께 써서 $(\\omega-3)(\\overline{\\omega}-3)$을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): 삼차방정식 근의 차수 낮추기와 인수분해로 식의 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "방정식을 이용한 차수 축소와 삼차방정식 인수분해·켤레곱을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱", "src": "solution", "quote": "(\\omega-3)(\\overline{\\omega}-3)"}], "method": [{"term": "인수분해", "src": "solution", "quote": "(x+4)(x^2-4x+5)=0", "evidenceType": "IMPLIED", "justification": "차수를 낮춘 뒤 삼차식을 인수분해해 허근이 속한 이차식을 구함"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-11x+20=0$"}], "condition": [{"term": "허근", "src": "stem", "quote": "한 허근을 $\\omega$"}]}, "reasons": {"method": "방정식으로 ω^3 차수를 낮추고 인수분해로 허근 켤레곱을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.2

### 발문

이차방정식 \$x^2+11x+9=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, \$(\\sqrt{\\alpha}-\\sqrt{\\beta})^2\$의 값은?

### 선지

① \$-17\$ ② \$-11\$ ③ \$-5\$ ④ \$1\$ ⑤ \$7\$

### 정답

③

### 해설

근과 계수의 관계에서 \$\\alpha+\\beta=-11\<0\$, \$\\alpha\\beta=9\>0\$이고 판별식 \$D=121-36=85\>0\$이므로 두 근 \$\\alpha, \\beta\$는 모두 음수이다. 음수의 제곱근 성질에 의하여 \$\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}=-\\sqrt{9}=-3\$이다. 따라서 \$\$ (\\sqrt{\\alpha}-\\sqrt{\\beta})^2 \= \\alpha+\\beta-2\\sqrt{\\alpha}\\sqrt{\\beta} \= \-11-2(-3) \= \-5 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 음수 근의 제곱근 곱의 부호 성질과 근과 계수의 관계를 결합한 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "판별식 $D>0$과 합 $<0$, 곱 $>0$으로 두 근이 모두 음수임을 확인해 $\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}$를 적용한다.", "decisiveStep": "두 근이 모두 음수이므로 $\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}=-3$이 되는 부호 판정이 핵심이다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 판별식과 합·곱 부호로 두 근의 음수 부호를 판정해 제곱근을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근의 부호 판정과 음수의 제곱근 곱셈 성질을 근과 계수의 관계에 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "제곱근", "src": "solution", "quote": "음수의 제곱근 성질"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에서", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+11x+9=0$"}], "condition": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=121-36=85>0$"}]}, "reasons": {"method": "두 근이 음수임을 판정해 음수 제곱근 곱의 부호와 근과 계수의 관계를 적용함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q16

- 형식: 객관식  
- 배점: 4.2

### 발문

오른쪽 그림과 같이 반지름의 길이가 \$5\$인 원에 둘레의 길이가 \$28\$인 직사각형이 내접할 때, 이 직사각형의 긴 변의 길이는?

### 선지

① \$6\$ ② \$8\$ ③ \$7\$ ④ \$9\$ ⑤ \$10\$

### 정답

②

### 해설

원에 내접하는 직사각형의 대각선의 길이는 원의 지름 \$10\$과 같다. 직사각형의 가로와 세로의 길이를 \$a, b\$라 하면 둘레가 \$28\$이므로 \$2(a+b)=28 \\implies a+b=14\$이다. 피타고라스 정리에 의해 \$a^2+b^2=10^2=100\$이므로 \$\$ (a+b)^2 \= a^2+b^2+2ab \\implies 196 \= 100+2ab \\implies ab \= 48 \$\$ 따라서 \$a, b\$는 \$t^2-14t+48=(t-6)(t-8)=0\$의 두 근 \$6, 8\$이므로 긴 변의 길이는 \$8\$이다.

```
{"capability": "plane", "title": "반지름이 5인 원에 내접하는 직사각형", "points": [{"id": "O", "x": 0, "y": 0, "label": "O"}, {"id": "A", "x": -4, "y": 3, "label": "A"}, {"id": "B", "x": -4, "y": -3, "label": "B"}, {"id": "C", "x": 4, "y": -3, "label": "C"}, {"id": "D", "x": 4, "y": 3, "label": "D"}], "circles": [{"id": "k", "center": "O", "radius": 5}], "segments": [{"id": "sAB", "from": "A", "to": "B"}, {"id": "sBC", "from": "B", "to": "C"}, {"id": "sCD", "from": "C", "to": "D"}, {"id": "sDA", "from": "D", "to": "A"}, {"id": "sAC", "from": "A", "to": "C", "label": "10"}], "planeMarks": {"facts": [{"kind": "ON_CIRCLE", "circle": "k", "points": ["A", "B", "C", "D"]}]}, "caption": "반지름이 5인 원에 내접하는 둘레 28인 직사각형 ABCD"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "내접 직사각형의 대각선이 원의 지름 $10$임을 이용해 $a+b=14$, $a^2+b^2=100$을 연립하고 이차방정식 $t^2-14t+48=0$을 푼다.", "decisiveStep": "직사각형 대각선=지름 조건으로 $a^2+b^2=100$을 세워 $ab=48$을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 내접 직사각형 조건에 곱셈 공식 변형을 적용해 넓이를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원 내접 직사각형의 대각선 성질과 대칭식 연립이차방정식을 연결하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "직사각형", "src": "stem", "quote": "직사각형의 긴 변의 길이는?"}], "method": [{"term": "피타고라스정리", "src": "solution", "quote": "피타고라스 정리에 의해", "evidenceType": "NAMED"}], "given": [{"term": "원", "src": "stem", "quote": "반지름의 길이가 $5$인 원에"}], "condition": [{"term": "반지름", "src": "stem", "quote": "반지름의 길이가 $5$인"}]}, "reasons": {"method": "내접 직사각형의 대각선=지름 조건과 둘레로 연립이차방정식을 푼다"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.3

### 발문

다항식 \$f(x)=x^4-3ax^3+5x-2-3a\$에 대하여 다항식 \$f(x+1)f(x+2)\$가 \$x+2\$로 나누어떨어질 때, 다항식 \$f(x)\$를 \$x-1\$로 나누었을 때의 나머지를 구하시오. (단, \$a\$는 상수이다.)

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

④

### 해설

\$f(x+1)f(x+2)\$가 \$x+2\$로 나누어떨어지므로 \$x=-2\$를 대입하면 \$f(-1)f(0)=0\$이다. 먼저 \$f(-1)\$을 계산하면 \$\$ f(-1) \= (-1)^4-3a(-1)^3+5(-1)-2-3a \= 1+3a-5-2-3a \= \-6 \\ne 0 \$\$ 이므로 반드시 \$f(0)=0\$이어야 한다. \$f(0)=-2-3a=0\$에서 \$a=-\\dfrac{2}{3}\$이다. 따라서 \$f(x)\$를 \$x-1\$로 나눈 나머지는 \$\$ f(1) \= 1-3a+5-2-3a \= 4-6a \= 4-6\\left(-\\frac{2}{3}\\right) \= 4+4 \= 8 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "곱 다항식의 인수정리 조건에서 0이 아닌 인수를 소거해 미정계수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$x=-2$ 대입으로 얻은 $f(-1)f(0)=0$에서 $f(-1)=-6\\ne 0$임을 확인하여 $f(0)=0$으로 $a$를 구한 뒤 $f(1)$을 계산한다.", "decisiveStep": "$f(-1)$ 계산 시 $3a$가 소거되어 상수 $-6\\ne 0$이 되므로 $f(0)=0$만 가능함을 판별한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): 항등식 수치대입 x=-2로 f(0)=0을 판정해 미정계수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곱 다항식의 나누어떨어짐 조건에서 두 경우 중 하나를 직접 계산으로 배제하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지를 구하시오"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나눈 나머지는", "evidenceType": "IMPLIED", "justification": "x=-2 대입으로 f(-1)f(0)=0을 얻고 나머지정리로 f(1)을 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)=x^4-3ax^3+5x-2-3a$"}], "condition": []}, "reasons": {"method": "f(-1)f(0)=0에서 f(-1)≠0임을 보여 f(0)=0으로 a를 구하고 f(1)을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.3

### 발문

오른쪽 그림과 같이 \$\\angle A=90^\\circ\$, \$\\angle B=60^\\circ\$이고 \$\\overline{AB}=10\$인 직각삼각형 \$ABC\$가 있다. 변 \$AB\$ 위의 한 점 \$P\$에서 변 \$BC\$에 내린 수선의 발을 \$Q\$라 하고, 점 \$P\$를 지나고 변 \$BC\$와 평행한 직선이 변 \$AC\$와 만나는 점을 \$R\$이라 하자. 사각형 \$PQCR\$의 넓이의 최댓값을 구하면? (단, 점 \$P\$는 꼭짓점 \$A\$와 꼭짓점 \$B\$가 아니다.)

### 선지

① \$40\\sqrt{3}\$ ② \$20\\sqrt{3}\$ ③ \$30\\sqrt{3}\$ ④ \$32\\sqrt{3}\$ ⑤ \$48\\sqrt{3}\$

### 정답

①

### 해설

\$A(0, 0)\$, \$B(10, 0)\$, \$C(0, 10\\sqrt{3})\$으로 좌표를 잡고 \$P(p, 0)\$ (\$0\<p\<10\$)이라 두자. 직선 \$PR\$은 \$BC\$와 평행하고 \$\\triangle APR\$는 \$\\angle A=90^\\circ, \\angle P=60^\\circ\$인 직각삼각형이므로 \$\\overline{PR}=2p\$이다. 한편 \$\\overline{PB}=10-p\$이고 \$\\triangle PQB\$에서 \$\\angle B=60^\\circ, \\angle Q=90^\\circ\$이므로 \$\$ \\overline{PQ} \= \\frac{\\sqrt{3}}{2}(10-p), \\qquad \\overline{BQ} \= \\frac{10-p}{2} \$\$ \$\\overline{BC}=20\$이므로 \$\\overline{QC}=20-\\dfrac{10-p}{2}=\\dfrac{p+30}{2}\$이다. 사다리꼴 \$PQCR\$의 넓이 \$S(p)\$는 \$\$ \\begin{aligned} S(p) &= \\frac{1}{2}(\\overline{PR}+\\overline{QC})\\cdot\\overline{PQ} \\ &= \\frac{1}{2}\\left(2p+\\frac{p+30}{2}\\right)\\cdot\\frac{\\sqrt{3}(10-p)}{2} \\ &= \\frac{5\\sqrt{3}}{8}(p+6)(10-p) \\ &= \\frac{5\\sqrt{3}}{8}{64-(p-2)^2} \\end{aligned} \$\$ \$0\<p\<10\$에서 \$p=2\$일 때 최댓값은 \$\\dfrac{5\\sqrt{3}}{8}\\cdot 64 \= 40\\sqrt{3}\$이다.

```
{"capability": "plane", "title": "직각삼각형 ABC 내부의 사다리꼴 PQCR", "points": [{"id": "A", "x": 0, "y": 0, "label": "A"}, {"id": "B", "x": 10, "y": 0, "label": "B"}, {"id": "C", "x": 0, "y": 17.32, "label": "C"}, {"id": "P", "x": 2, "y": 0, "label": "P"}, {"id": "R", "x": 0, "y": 3.46, "label": "R"}, {"id": "Q", "x": 8, "y": 3.46, "label": "Q"}], "segments": [{"id": "sAB", "from": "A", "to": "B", "label": "10"}, {"id": "sBC", "from": "B", "to": "C"}, {"id": "sCA", "from": "C", "to": "A"}, {"id": "sPR", "from": "P", "to": "R"}, {"id": "sPQ", "from": "P", "to": "Q"}], "rightAngles": [{"vertex": "A", "p1": "C", "p2": "B"}, {"vertex": "Q", "p1": "P", "p2": "C"}], "planeMarks": {"parallels": [{"id": "p1", "count": 1, "segments": ["sPR", "sBC"]}]}, "caption": "직각삼각형 ABC에서 평행선 PR과 수선 PQ로 만든 사다리꼴 PQCR"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "변 $AP=p$를 변수로 두고 $30^\\circ\\text{-}60^\\circ\\text{-}90^\\circ$ 직각삼각형 비로 사다리꼴 $PQCR$의 윗변·아랫변·높이를 구해 넓이 이차함수의 최댓값을 구한다.", "decisiveStep": "사다리꼴 윗변 $2p$, 아랫변 $\\frac{p+30}{2}$, 높이 $\\frac{\\sqrt{3}(10-p)}{2}$를 $p$로 표현해 $(p+6)(10-p)$의 최댓값을 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 삼각비 조건으로 사다리꼴 넓이 이차함수의 최댓값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "특수각 직각삼각형의 변의 비와 평행선 조건으로 사다리꼴 넓이를 이차함수로 모델링하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "넓이의 최댓값을 구하면?"}], "method": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $ABC$가 있다", "evidenceType": "IMPLIED", "justification": "60도 특수각 직각삼각형의 길이 비로 사다리꼴 변과 높이를 표현해 넓이 이차함수를 세움"}], "given": [{"term": "수선", "src": "stem", "quote": "내린 수선의 발을 $Q$"}], "condition": [{"term": "넓이", "src": "stem", "quote": "사각형 $PQCR$의 넓이"}]}, "reasons": {"method": "특수각 삼각비로 사다리꼴 변들을 p로 표현해 넓이 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.4

### 발문

그림과 같이 이차함수 \$y=x^2\$의 그래프와 직선 \$y=ax+8\$이 만나는 두 점을 각각 \$A\$, \$B\$라 하고, 점 \$A\$와 \$B\$에서 \$x\$축에 내린 수선의 발을 \$C\$, \$D\$라 하자. 삼각형 \$AOC\$의 넓이를 \$S\_1\$, 삼각형 \$DOB\$의 넓이를 \$S\_2\$라 할 때, \$S\_1:S\_2=8:1\$을 만족시키는 양수 \$a\$의 값은? (단, \$O\$는 원점이고, 두 점 \$A\$, \$B\$는 각각 제1사분면과 제2사분면 위에 있다.)

### 선지

① \$1\$ ② \$\\dfrac{3}{2}\$ ③ \$2\$ ④ \$\\dfrac{5}{2}\$ ⑤ \$3\$

### 정답

③

### 해설

점 \$A\$의 \$x\$좌표를 \$u\>0\$, 점 \$B\$의 \$x\$좌표를 \$-v\<0\$ (\$v\>0\$)이라 두면 두 점은 \$y=x^2\$ 위의 점이므로 \$A(u, u^2)\$, \$B(-v, v^2)\$이다. 삼각형 \$AOC\$와 \$DOB\$의 넓이는 각각 \$\$ S\_1 \= \\frac{1}{2}\\cdot u\\cdot u^2 \= \\frac{1}{2}u^3, \\qquad S\_2 \= \\frac{1}{2}\\cdot v\\cdot v^2 \= \\frac{1}{2}v^3 \$\$ \$S\_1:S\_2=8:1\$이므로 \$u^3:v^3=8:1 \\implies u:v=2:1\$, 즉 \$u=2v\$이다. 한편 \$u\$와 \$-v\$는 방정식 \$x^2=ax+8 \\implies x^2-ax-8=0\$의 두 근이므로 근과 계수의 관계에 의해 \$\$ u(-v) \= \-8 \\implies uv \= 8 \$\$ \$u=2v\$를 대입하면 \$2v^2=8 \\implies v=2\$ (\$v\>0\$), \$u=4\$이다. 따라서 두 근의 합 \$a \= u+(-v) \= 4-2 \= 2\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-3, 5], "viewport": [-4, 6, -1, 18], "pieces": [{"domain": [-3, 5], "coefficients": ["0", "0", "1"]}], "referenceLines": [{"slope": "2", "intercept": "8", "label": "y=2x+8"}], "requiredPoints": [{"id": "A", "x": "4", "y": "16", "label": "A(4, 16)"}, {"id": "B", "x": "-2", "y": "4", "label": "B(-2, 4)"}, {"id": "C", "x": "4", "y": "0", "label": "C"}, {"id": "D", "x": "-2", "y": "0", "label": "D"}]}, "caption": "이차함수 y=x^2과 직선 y=2x+8의 교점 A, B 및 수선의 발 C, D"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 교점 $A(u, u^2), B(-v, v^2)$의 넓이비 $u^3:v^3=8:1$에서 $u=2v$를 얻고, 연립방정식 $x^2-ax-8=0$의 근과 계수의 관계로 $a$를 구한다.", "decisiveStep": "넓이비 $S_1:S_2=u^3:v^3=8:1$로부터 $u=2v$를 구해 두 근의 곱 $-uv=-8$과 연립한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): 포물선과 직선 교점의 넓이비 조건으로 근의 비와 계수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "포물선 위 점으로 표현된 삼각형 넓이비와 교점 방정식의 근과 계수의 관계를 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "넓이", "src": "stem", "quote": "삼각형 $AOC$의 넓이"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2$의 그래프"}, {"term": "직선", "src": "stem", "quote": "직선 $y=ax+8$"}], "condition": [{"term": "수선", "src": "stem", "quote": "내린 수선의 발을 $C$, $D$"}]}, "reasons": {"method": "넓이비로 두 교점 x좌표 비를 구하고 근과 계수의 관계로 기울기 a를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.4

### 발문

원가가 \$200\$원인 어느 간식의 가격과 예상 판매량은 다음 표와 같다. 가격이 \$50\$원 오를 때마다 판매량이 \$100\$개씩 감소할 때, 이 간식을 팔아 얻을 수 있는 최대 이익을 구하면?

| 가격(원) | \$200\$ | \$250\$ | \$300\$ | \$350\$ |
| :---- | :---- | :---- | :---- | :---- |
| 예상 판매량(개) | \$1200\$ | \$1100\$ | \$1000\$ | \$900\$ |

### 선지

① \$150000\$원 ② \$160000\$원 ③ \$170000\$원 ④ \$175000\$원 ⑤ \$180000\$원

### 정답

⑤

### 해설

가격을 \$200+50t\$원 (\$0\\le t\\le 12\$)이라 두면 예상 판매량은 \$1200-100t\$개이고, 원가가 \$200\$원이므로 \$1\$개당 이익은 \$50t\$원이다. 따라서 총이익 \$P(t)\$는 \$\$ \\begin{aligned} P(t) &= 50t(1200-100t) \\ &= \-5000t^2+60000t \\ &= \-5000(t^2-12t) \\ &= \-5000(t-6)^2+180000 \\end{aligned} \$\$ \$t=6\$은 \$0\\le t\\le 12\$에 포함되므로 최대 이익은 \$180000\$원이다.

```
{"status": "EXEMPT", "reason": "발문에 표로 주어진 가격·판매량 규칙을 이차함수로 세워 최댓값을 구하는 순수 활용 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "가격 인상 횟수 $t$를 변수로 두고 개당 이익 $50t$와 판매량 $1200-100t$의 곱으로 총이익 이차함수 $P(t)$를 세워 최댓값을 구한다.", "decisiveStep": "표의 선형 감소 규칙으로부터 총이익 $P(t)=50t(1200-100t)=-5000(t-6)^2+180000$을 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 가격·판매량 실생활 조건으로 총이익 이차함수의 최댓값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "표에서 선형 관계를 읽어 이익 이차함수를 세우고 완전제곱식으로 최댓값을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "solution", "quote": "최대 이익"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-5000(t-6)^2+180000", "evidenceType": "IMPLIED", "justification": "총이익 이차함수를 완전제곱식으로 변형해 최댓값을 구함"}], "given": [{"term": "이차함수", "src": "solution", "quote": "P(t) &= 50t(1200-100t)"}], "condition": []}, "reasons": {"method": "가격·판매량 규칙으로 이익 이차함수를 세워 완전제곱식으로 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

이차함수 \$y=f(x)\$의 그래프가 그림과 같이 \$x\$축과 두 점 \$(-4, 0)\$, \$(2, 0)\$에서 만나고 이 이차함수의 최솟값이 \$-9\$일 때, \$f(4)\$를 구하시오.

### 선지

없음

### 정답

\$16\$

### 해설

\$x\$축과 두 점 \$(-4, 0)\$, \$(2, 0)\$에서 만나므로 이차함수를 \$f(x)=a(x+4)(x-2)\$ (\$a\>0\$)로 놓을 수 있다. 대칭축은 \$x=\\dfrac{-4+2}{2}=-1\$이므로 꼭짓점 \$x=-1\$에서 최솟값 \$-9\$를 갖는다. \$\$ f(-1) \= a(-1+4)(-1-2) \= \-9a \= \-9 \\implies a \= 1 \$\$ 따라서 \$f(x)=(x+4)(x-2)\$이므로 \$\$ f(4) \= (4+4)(4-2) \= 8\\cdot 2 \= 16 \$\$ 이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-5, 3], "viewport": [-5, 4, -10, 6], "pieces": [{"domain": [-5, 3], "coefficients": ["-8", "2", "1"]}], "requiredPoints": [{"id": "A", "x": "-4", "y": "0", "label": "(-4, 0)"}, {"id": "B", "x": "2", "y": "0", "label": "(2, 0)"}, {"id": "V", "x": "-1", "y": "-9", "label": "(-1, -9)"}]}, "caption": "x축과 (-4, 0), (2, 0)에서 만나고 최솟값이 -9인 이차함수 y=f(x)"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$x$절편 $-4, 2$를 이용해 $f(x)=a(x+4)(x-2)$를 세우고 대칭축 $x=-1$에서의 최솟값 $-9$로 $a=1$을 결정한다.", "decisiveStep": "$x$절편의 중점 $x=-1$에서 최솟값 $f(-1)=-9a=-9$를 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): x절편과 대칭축 최솟값으로 이차함수 식을 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$x$절편 두 개와 최솟값이 주어진 이차함수 식을 작성해 함숫값을 구하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=f(x)$의 그래프"}], "method": [{"term": "인수정리", "src": "solution", "quote": "f(x)=a(x+4)(x-2)", "evidenceType": "IMPLIED", "justification": "x축과의 두 교점으로부터 이차함수를 인수분해 꼴로 설정함"}], "given": [{"term": "교점", "src": "stem", "quote": "$x$축과 두 점 $(-4, 0)$, $(2, 0)$에서"}], "condition": [{"term": "최솟값", "src": "stem", "quote": "최솟값이 $-9$일 때"}]}, "reasons": {"method": "x절편 인수형 식을 세우고 대칭축 최솟값으로 최고차항 계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

이차함수 \$y=x^2+3a\$의 그래프와 직선 \$y=2ax-a^2\$의 서로 다른 두 교점의 \$x\$좌표의 곱이 \$10\$일 때, 상수 \$a\$를 구하고 이 두 교점의 \$x\$좌표의 합을 \$b\$라고 할 때, \$b\$를 구하시오.

### 선지

없음

### 정답

\$a=-5,; b=-10\$

### 해설

두 그래프의 교점의 \$x\$좌표는 연립방정식 \$x^2+3a=2ax-a^2\$, 즉 \$\$ x^2-2ax+a^2+3a=0 \$\$ 의 두 실근이다. 두 근의 곱이 \$10\$이므로 근과 계수의 관계에 의해 \$a^2+3a=10\$, 즉 \$\$ a^2+3a-10 \= (a+5)(a-2) \= 0 \\implies a=-5 \\text{ 또는 } a=2 \$\$ 한편 두 교점이 서로 달라야 하므로 판별식 \$D\>0\$이어야 한다. \$\$ \\frac{D}{4} \= (-a)^2-(a^2+3a) \= \-3a \> 0 \\implies a \< 0 \$\$ 따라서 \$a=-5\$이다. 이때 두 교점의 \$x\$좌표의 합 \$b\$는 근과 계수의 관계에 의해 \$b=2a=2(-5)=-10\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-10, 2], "viewport": [-10, 2, -20, 60], "pieces": [{"domain": [-10, 2], "coefficients": ["-15", "0", "1"]}], "referenceLines": [{"slope": "-10", "intercept": "-25", "label": "y=-10x-25"}], "requiredPoints": []}, "caption": "a=-5일 때 이차함수 y=x^2-15와 직선 y=-10x-25가 서로 다른 두 점에서 만나는 모습"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $x^2-2ax+a^2+3a=0$의 두 근의 곱 $a^2+3a=10$에서 $a=-5, 2$를 얻고 판별식 $D/4=-3a>0$으로 $a=-5$를 가린다.", "decisiveStep": "서로 다른 두 교점 조건 $D/4=-3a>0$에서 $a=2$를 탈락시키고 $a=-5$만 남긴다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 이차함수와 직선의 서로 다른 두 교점 조건 D>0과 곱 조건을 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계로 얻은 두 후보 중 판별식 $D>0$ 조건으로 유일한 $a$를 가려내는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "교점", "src": "stem", "quote": "서로 다른 두 교점의"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+3a$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=2ax-a^2$"}], "condition": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해"}]}, "reasons": {"method": "근과 계수의 관계와 판별식 D>0 조건을 함께 적용해 a와 b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 7

### 발문

최고차항의 계수가 양수인 두 다항식 \$f(x)\$, \$g(x)\$가 다음 조건을 만족시킨다. \<보기\> (가) \$f(x)\$를 \$9x^2+g(x)\$로 나눈 몫은 \$x-1\$이고 나머지는 \$9x^2-{g(x)}^2\$이다. (나) \$f(x)\$를 \$g(x)\$로 나눈 나머지는 \$\\dfrac{1}{3}\$이다. \$f(-1)\$의 값을 구하시오. (단, \$f(x)\$와 \$g(x)\$의 계수는 모두 실수이다.)

### 선지

없음

### 정답

\$-17\$

### 해설

조건 (가)에서 \$f(x)=(x-1){9x^2+g(x)}+9x^2-{g(x)}^2\$이다. 나머지 \$9x^2-{g(x)}^2\$의 차수는 나누는 식 \$9x^2+g(x)\$의 차수보다 낮아야 한다. 만약 \$g(x)\$가 \$2\$차 이상이면 \${g(x)}^2\$의 차수가 \$9x^2+g(x)\$보다 크고, \$g(x)\$가 상수이면 나머지의 \$9x^2\$항이 남아 나누는 식과 차수가 같아져 모순이다. 따라서 \$g(x)\$는 일차식 \$g(x)=mx+n\$ (\$m\>0\$)이다. 나머지 \$9x^2-(mx+n)^2=(9-m^2)x^2-2mnx-n^2\$의 차수가 \$2\$보다 작아야 하므로 \$9-m^2=0\$, \$m\>0\$에서 \$m=3\$이다. 즉 \$g(x)=3x+n\$이다. 이제 조건 (가)를 정리하면 \$\$ \\begin{aligned} f(x) &= 9x^3-9x^2+(x-1)g(x)+9x^2-{g(x)}^2 \\ &= 9x^3+(x-1)g(x)-{g(x)}^2 \\end{aligned} \$\$ 조건 (나)에서 \$f(x)\$를 \$g(x)=3x+n\$으로 나눈 나머지가 \$\\dfrac{1}{3}\$이므로 \$x=-\\dfrac{n}{3}\$을 대입하면 \$\$ f\\left(-\\frac{n}{3}\\right) \= 9\\left(-\\frac{n}{3}\\right)^3 \= \-\\frac{n^3}{3} \= \\frac{1}{3} \\implies n^3 \= \-1 \$\$ \$n\$은 실수이므로 \$n=-1\$, 즉 \$g(x)=3x-1\$이다. 따라서 \$\$ f(x) \= 9x^3+(x-1)(3x-1)-(3x-1)^2 \= 9x^3-6x^2+2x \$\$ 이므로 \$f(-1)=9(-1)^3-6(-1)^2+2(-1)=-9-6-2=-17\$이다.

```
{"status": "EXEMPT", "reason": "다항식 나눗셈의 나머지 차수 조건으로 g(x)의 차수와 최고차항 계수를 추론하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "나머지 $9x^2-\\{g(x)\\}^2$의 차수가 제수 $9x^2+g(x)$보다 작아야 한다는 조건으로 $g(x)=3x+n$을 확정하고, $f(-n/3)=1/3$으로 $n=-1$을 구한다.", "decisiveStep": "$g(x)$가 일차식이어야 $9x^2$항이 소거되어 나머지 차수 조건을 만족함을 밝혀 $g(x)=3x+n$을 세운다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 다항식 나눗셈에서 나머지의 차수 조건으로 g(x)를 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나눗셈 나머지 차수 부등식 추론, 최고차항 소거, 나머지정리 대입을 결합한 최고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $f(x)$, $g(x)$"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "나머지 $9x^2-\\{g(x)\\}^2$의 차수는", "evidenceType": "IMPLIED", "justification": "나머지의 차수가 제수의 차수보다 낮아야 하는 다항식 나눗셈 성질을 적용함"}], "given": [{"term": "최고차항", "src": "stem", "quote": "최고차항의 계수가 양수인"}], "condition": [{"term": "나머지정리", "src": "solution", "quote": "f\\left(-\\frac{n}{3}\\right) = 9\\left(-\\frac{n}{3}\\right)^3", "evidenceType": "IMPLIED", "justification": "일차식 g(x)=0의 근을 대입해 나머지를 구하는 나머지정리 적용"}]}, "reasons": {"method": "나눗셈 차수 조건으로 g(x)=3x+n을 추론하고 나머지정리로 n을 확정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

