

```
{"stem": "22_효천고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_효천고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.6

### 발문

\$x-y=-3\$, \$xy=2\$일 때, \$x^3-y^3\$의 값은?

### 선지

① \$-45\$ ② \$-27\$ ③ \$-9\$ ④ \$-36\$ ⑤ \$-54\$

### 정답

①

### 해설

곱셈 공식의 변형에 의하여 \$\$ \\begin{aligned} x^3-y^3 &= (x-y)^3+3xy(x-y) \\ &= (-3)^3+3\\cdot 2\\cdot (-3) \\ &= \-27-18 \= \-45 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "곱셈 공식의 변형에 x-y와 xy를 대입해 x^3-y^3을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "곱셈 공식의 변형 $x^3-y^3=(x-y)^3+3xy(x-y)$에 $x-y=-3$, $xy=2$를 대입해 계산한다.", "decisiveStep": "차와 곱으로 세제곱의 차를 나타내는 항등식에 주어진 두 값을 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈 공식 변형으로 x^3-y^3의 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곱셈 공식 변형을 한 번 적용해 값을 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식의 변형에 의하여"}], "method": [{"term": "대입", "src": "solution", "quote": "(-3)^3+3\\cdot 2\\cdot (-3)", "evidenceType": "IMPLIED", "justification": "x^3-y^3의 곱셈 공식 변형식에 x-y=-3, xy=2를 대입함"}], "given": [{"term": "다항식", "src": "stem", "quote": "$x^3-y^3$"}], "condition": []}, "reasons": {"method": "곱셈 공식 변형에 차와 곱을 대입해 x^3-y^3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.7

### 발문

\$-2\$와 \$4\$를 근으로 하고 \$x^2\$의 계수가 \$3\$인 이차방정식은?

### 선지

① \$x^2-2x-8=0\$ ② \$3x^2+6x-24=0\$ ③ \$3x^2-6x-24=0\$ ④ \$3x^2-6x+24=0\$ ⑤ \$3x^2+2x-8=0\$

### 정답

③

### 해설

두 수 \$-2\$, \$4\$를 근으로 하고 \$x^2\$의 계수가 \$3\$인 이차방정식은 \$\$ 3(x+2)(x-4)=0 \\implies 3(x^2-2x-8)=0 \\implies 3x^2-6x-24=0 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 근과 최고차항 계수로 이차방정식을 작성하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 근 $-2, 4$와 최고차항 계수 $3$을 이용해 $3(x+2)(x-4)=0$을 세운 뒤 전개한다.", "decisiveStep": "인수분해 꼴 $3(x+2)(x-4)=0$에 최고차항 계수 $3$을 빠뜨리지 않고 곱한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 두 근과 최고차항 계수로 이차방정식을 구성함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근과 이차항 계수가 주어졌을 때 이차방정식을 바로 작성하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식은"}], "method": [{"term": "전개", "src": "solution", "quote": "3(x^2-2x-8)=0", "evidenceType": "IMPLIED", "justification": "두 근을 인수로 갖는 식 3(x+2)(x-4)=0을 전개하여 일반형으로 정리함"}], "given": [{"term": "계수", "src": "stem", "quote": "$x^2$의 계수가 $3$"}], "condition": []}, "reasons": {"method": "두 근 -2, 4와 이차항 계수 3으로 이차방정식을 세워 전개함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q03

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$x^2-5x-2=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, \$\\dfrac{\\beta}{\\alpha}+\\dfrac{\\alpha}{\\beta}\$의 값은?

### 선지

① \$-\\dfrac{21}{2}\$ ② \$-\\dfrac{25}{2}\$ ③ \$\\dfrac{29}{2}\$ ④ \$-\\dfrac{27}{2}\$ ⑤ \$-\\dfrac{29}{2}\$

### 정답

⑤

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=5\$, \$\\alpha\\beta=-2\$이다. 따라서 \$\$ \\frac{\\beta}{\\alpha}+\\frac{\\alpha}{\\beta} \= \\frac{\\alpha^2+\\beta^2}{\\alpha\\beta} \= \\frac{(\\alpha+\\beta)^2-2\\alpha\\beta}{\\alpha\\beta} \= \\frac{5^2-2(-2)}{-2} \= \-\\frac{29}{2} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계와 대칭식 변형으로 두 근의 비의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계로 $\\alpha+\\beta=5$, $\\alpha\\beta=-2$를 구하고 통분해 $\\frac{(\\alpha+\\beta)^2-2\\alpha\\beta}{\\alpha\\beta}$를 계산한다.", "decisiveStep": "분자 $\\alpha^2+\\beta^2$을 $(\\alpha+\\beta)^2-2\\alpha\\beta$로 변형해 합과 곱을 대입한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계로 합·곱을 구해 대칭식 값을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 근과 계수의 관계 및 곱셈 공식 변형을 직접 결합한 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "\\frac{\\alpha^2+\\beta^2}{\\alpha\\beta}"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-5x-2=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 합과 곱을 구한 뒤 통분식 값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q04

- 형식: 객관식  
- 배점: 3.9

### 발문

다항식 \$P(x)=2x^3-5x^2+ax+b\$가 \$x^2-3x+2\$로 나누어떨어질 때, 상수 \$a\$, \$b\$에 대하여 \$2a+b\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

②

### 해설

\$x^2-3x+2=(x-1)(x-2)\$이므로 인수정리에 의하여 \$P(1)=0\$, \$P(2)=0\$이다. \$\$ \\begin{aligned} P(1) &= 2-5+a+b \= 0 \\implies a+b \= 3 \\ P(2) &= 16-20+2a+b \= 0 \\implies 2a+b \= 4 \\end{aligned} \$\$ 따라서 \$2a+b=4\$이다.

```
{"status": "EXEMPT", "reason": "이차식 인수정리 P(1)=0, P(2)=0으로 미정계수 식 2a+b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나누는 식 $x^2-3x+2=(x-1)(x-2)$를 인수분해한 뒤 인수정리 $P(1)=0, P(2)=0$을 적용한다.", "decisiveStep": "$P(2)=16-20+2a+b=0$에서 구하는 식 $2a+b=4$가 곧바로 나온다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012(RPM_ONLY): 제수 인수분해 후 인수정리 P(1)=0, P(2)=0으로 미정계수를 구하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식으로 나누어떨어지는 조건을 두 일차인수의 인수정리로 바꾸어 푸는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$에 대하여"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여 $P(1)=0$, $P(2)=0$", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)=2x^3-5x^2+ax+b$"}], "condition": []}, "reasons": {"method": "제수 인수분해 후 인수정리 P(1)=0, P(2)=0으로 2a+b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차식 \$x^2-(2a+6)x+a-3\$이 완전제곱식이 되도록 하는 모든 복소수 \$a\$의 값의 곱은?

### 선지

① \$-12\$ ② \$6\$ ③ \$-6\$ ④ \$12\$ ⑤ \$9\$

### 정답

④

### 해설

\$x\$에 대한 이차식 \$x^2-(2a+6)x+a-3\$이 완전제곱식이 되려면 판별식 \$D=0\$이어야 하므로 \$\$ \\frac{D}{4} \= (a+3)^2-(a-3) \= a^2+5a+12 \= 0 \$\$ \$a\$에 대한 이차방정식 \$a^2+5a+12=0\$의 두 복소수 근의 곱은 근과 계수의 관계에 의하여 \$12\$이다.

```
{"status": "EXEMPT", "reason": "완전제곱식 조건 판별식 D=0을 세워 복소수 a의 곱을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "완전제곱식 조건 $D/4=(a+3)^2-(a-3)=0$으로 $a$의 이차방정식 $a^2+5a+12=0$을 얻고 근과 계수의 관계를 쓴다.", "decisiveStep": "복소수 범위에서 $a^2+5a+12=0$의 두 근의 곱이 상수항 $12$임을 바로 읽는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 완전제곱식 조건(판별식 D=0)으로 계수 방정식을 세움"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식 판별식 조건과 복소수 범위에서의 근과 계수의 관계를 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "모든 복소수 $a$의 값의 곱"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이어야", "evidenceType": "NAMED"}], "given": [{"term": "완전제곱식", "src": "stem", "quote": "완전제곱식이 되도록"}], "condition": []}, "reasons": {"method": "완전제곱식 판별식 D=0으로 얻은 a의 이차방정식에 근과 계수의 관계를 적용함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.1

### 발문

\$102^3-(100+2)(10004-200)\$의 값을 곱셈공식을 이용하여 구한 값은?

### 선지

① \$61200\$ ② \$60200\$ ③ \$61000\$ ④ \$60120\$ ⑤ \$62400\$

### 정답

①

### 해설

\$a=100\$, \$b=2\$로 놓으면 \$10004-200 \= a^2-ab+b^2\$이므로 \$\$ \\begin{aligned} 102^3-(100+2)(10004-200) &= (a+b)^3-(a+b)(a^2-ab+b^2) \\ &= (a+b)^3-(a^3+b^3) \\ &= 3ab(a+b) \\ &= 3\\cdot 100\\cdot 2\\cdot 102 \= 61200 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "수 계산을 치환해 곱셈 공식 (a+b)^3-(a^3+b^3)=3ab(a+b)로 간단히 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$a=100, b=2$로 치환하여 $(a+b)^3-(a^3+b^3)=3ab(a+b)$ 공식으로 수 값을 계산한다.", "decisiveStep": "$10004-200=100^2-100\\cdot 2+2^2$ 구조를 알아보고 $a^3+b^3$으로 묶어 소거한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "수의 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-018(DIRECT_ACTIVE): 치환과 곱셈·인수분해 공식 변형으로 수의 계산을 수행함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "큰 수의 거듭제곱 차를 문자 치환과 곱셈 공식으로 단순화하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "stem", "quote": "곱셈공식을 이용하여"}], "method": [{"term": "치환", "src": "solution", "quote": "a=100$, $b=2$로 놓으면", "evidenceType": "IMPLIED", "justification": "100과 2를 문자 a, b로 치환해 (a+b)^3-(a^3+b^3)=3ab(a+b) 공식을 적용함"}], "given": [{"term": "다항식", "src": "solution", "quote": "(a+b)^3-(a^3+b^3)"}], "condition": []}, "reasons": {"method": "100과 2를 치환해 세제곱 합·차 공식으로 61200을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.2

### 발문

다항식 \$P(x)=(x^2-x+1)(x-5)+7x+11\$에 대한 설명으로 옳은 것을 \<보기\>에서 모두 고른 것은? \<보기\> ㄱ. \$P(5)\$는 \$P(x)\$를 \$x-5\$로 나눈 나머지이다. ㄴ. \$P(x)\$를 \$x^2-x+1\$로 나눈 나머지는 \$7x+11\$이다. ㄷ. \$P(x)\$를 \$x-5\$로 나눈 나머지는 \$7x+11\$이다.

### 선지

① ㄱ ② ㄱ, ㄷ ③ ㄱ, ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

③

### 해설

- ㄱ. 나머지정리에 의하여 \$P(x)\$를 일차식 \$x-5\$로 나눈 나머지는 \$P(5)\$이다. (참)  
- ㄴ. \$P(x)=(x^2-x+1)(x-5)+(7x+11)\$에서 나누는 식 \$x^2-x+1\$은 이차식이고 \$7x+11\$의 차수가 \$1\<2\$이므로 나머지는 \$7x+11\$이다. (참)  
- ㄷ. 일차식 \$x-5\$로 나눈 나머지는 상수 \$P(5)=7(5)+11=46\$이어야 하므로 \$7x+11\$은 나머지가 아니다. (거짓) 따라서 옳은 것은 ㄱ, ㄴ이다.

```
{"status": "EXEMPT", "reason": "다항식 나눗셈의 나머지 차수 조건과 나머지정리를 비교 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "나눗셈에서 나머지의 차수는 제수의 차수보다 작아야 함을 이용해 이차식 나눗셈(ㄴ)과 일차식 나눗셈(ㄱ, ㄷ)을 구분한다.", "decisiveStep": "일차식 $x-5$로 나눌 때는 $7x+11$의 차수가 같거나 크므로 나머지가 될 수 없음을 짚는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 다항식 나눗셈에서 나머지의 차수 조건을 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항등식 형태에서 나누는 식의 차수에 따라 나머지 여부가 갈림을 확인하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지이다"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)=(x^2-x+1)(x-5)+7x+11$"}], "condition": []}, "reasons": {"method": "제수 차수 조건과 나머지정리로 ㄱ, ㄴ, ㄷ의 참·거짓을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.3

### 발문

등식 \$a(x+y)+b(x-y)+2=5x+y+c\$가 \$x\$, \$y\$에 대한 항등식일 때, 상수 \$a\$, \$b\$, \$c\$의 곱 \$abc\$의 값은?

### 선지

① \$6\$ ② \$8\$ ③ \$10\$ ④ \$-12\$ ⑤ \$12\$

### 정답

⑤

### 해설

좌변을 \$x\$, \$y\$에 대하여 정리하면 \$\$ (a+b)x+(a-b)y+2 \= 5x+y+c \$\$ \$x\$, \$y\$에 대한 항등식이므로 계수를 비교하면 \$\$ a+b=5, \\qquad a-b=1, \\qquad c=2 \$\$ 연립하면 \$a=3\$, \$b=2\$, \$c=2\$이므로 \$abc=3\\cdot 2\\cdot 2=12\$이다.

```
{"status": "EXEMPT", "reason": "두 변수 x, y에 대한 항등식을 정리해 계수비교법으로 a, b, c를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "좌변을 $(a+b)x+(a-b)y+2$로 정리한 뒤 양변의 $x, y$ 계수와 상수항을 비교해 $a, b, c$를 푼다.", "decisiveStep": "$a+b=5$와 $a-b=1$을 연립해 $a=3, b=2$를 얻고 상수항 $c=2$와 곱한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): x, y 항등식 정리 후 계수비교법으로 a, b, c를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 문자에 대한 항등식에서 동류항 정리 후 계수비교법을 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$, $c$의 곱"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "stem", "quote": "$x$, $y$에 대한 항등식"}], "condition": []}, "reasons": {"method": "x, y에 대해 정리 후 계수비교법으로 a, b, c를 구해 곱함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.4

### 발문

다항식 \$P(x)\$를 \$x-1\$로 나누었을 때 나머지가 \$2\$이고 \$x-3\$으로 나누었을 때 나머지가 \$8\$이다. \$P(x)\$를 \$(x-1)(x-3)\$으로 나누었을 때의 나머지가 \$mx+n\$일 때, \$m+2n\$의 값은?

### 선지

① \$-1\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$5\$

### 정답

②

### 해설

나머지정리에 의하여 \$P(1)=2\$, \$P(3)=8\$이다. 나눗셈 항등식 \$P(x)=(x-1)(x-3)Q(x)+mx+n\$에 \$x=1\$과 \$x=3\$을 대입하면 \$\$ m+n=2, \\qquad 3m+n=8 \$\$ 두 식을 빼면 \$2m=6 \\implies m=3\$, \$n=2-3=-1\$이다. 따라서 \$m+2n=3+2(-1)=1\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리 두 조건을 연립해 이차식으로 나눈 일차 나머지 mx+n을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리 $P(1)=2, P(3)=8$을 나눗셈 항등식 $P(x)=(x-1)(x-3)Q(x)+mx+n$에 대입해 연립한다.", "decisiveStep": "일차 나머지 $mx+n$에 $x=1, 3$을 대입해 $2m=6$을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 나눗셈 항등식에 x=1, 3을 대입해 일차 나머지를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 일차식 나머지가 주어졌을 때 곱인 이차식으로 나눈 나머지를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지가 $mx+n$일 때"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": []}, "reasons": {"method": "나머지정리 P(1)=2, P(3)=8을 연립해 m, n을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.5

### 발문

다항식 \$f(x)\$를 \$x^2+3\$으로 나누었을 때 나머지가 \$3x-1\$이고 \$x-1\$로 나누었을 때 나머지는 \$10\$이다. 이때 다항식 \$f(x)\$를 \$(x^2+3)(x-1)\$로 나누었을 때의 나머지는?

### 선지

① \$2x^2+3x+2\$ ② \$x^2+3x+6\$ ③ \$2x^2-3x+5\$ ④ \$2x^2+3x+5\$ ⑤ \$2x^2+6x+2\$

### 정답

④

### 해설

\$f(x)\$를 삼차식 \$(x^2+3)(x-1)\$로 나눈 나머지를 \$R(x)\$라 하면, \$R(x)\$는 이차 이하의 다항식이고 \$x^2+3\$으로 나눈 나머지가 \$3x-1\$이어야 하므로 \$\$ R(x) \= a(x^2+3)+3x-1 \$\$ 이라 놓을 수 있다. 조건에서 \$f(1)=10\$이므로 \$R(1)=a(1+3)+3(1)-1=4a+2=10 \\implies a=2\$이다. 따라서 구하는 나머지는 \$R(x)=2(x^2+3)+3x-1=2x^2+3x+5\$이다.

```
{"status": "EXEMPT", "reason": "삼차식으로 나눈 나머지를 R(x)=a(x^2+3)+3x-1로 설정해 f(1)=10으로 a를 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지를 $R(x)=a(x^2+3)+3x-1$로 세워 미지수를 $a$ 하나로 줄인 뒤 $f(1)=R(1)=10$으로 $a=2$를 구한다.", "decisiveStep": "이차 나머지 $R(x)$를 $x^2+3$으로 나눈 몫을 상수 $a$로 두어 $a(x^2+3)+3x-1$로 표현한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_NESTED_DIVISION", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 삼차식 나눗셈의 나머지를 a(x^2+3)+3x-1로 설정해 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차식 나눗셈의 이차 나머지를 이차식 나눗셈 조건으로 축약해 푸는 대표 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지는"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "조건에서 $f(1)=10$이므로", "evidenceType": "IMPLIED", "justification": "이차 나머지 R(x)를 a(x^2+3)+3x-1로 두고 나머지정리 f(1)=10을 대입해 a를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "삼차식 나머지를 a(x^2+3)+3x-1로 설정하고 f(1)=10을 대입해 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.6

### 발문

모든 실수 \$x\$에 대하여 \$x^8+2=a\_8(x+1)^8+a\_7(x+1)^7+\\cdots+a\_1(x+1)+a\_0\$가 성립할 때, \$a\_0+a\_2+a\_4+a\_6+a\_8\$의 값은?

### 선지

① \$130\$ ② \$128\$ ③ \$129\$ ④ \$258\$ ⑤ \$260\$

### 정답

①

### 해설

주어진 항등식에서 \$x+1=1\$이 되는 \$x=0\$과 \$x+1=-1\$이 되는 \$x=-2\$를 각각 대입하면 \$\$ \\begin{aligned} 0^8+2 &= a\_8+a\_7+a\_6+\\cdots+a\_1+a\_0 \= 2 \\ (-2)^8+2 &= a\_8-a\_7+a\_6-\\cdots-a\_1+a\_0 \= 258 \\end{aligned} \$\$ 두 식을 변끼리 더하면 \$\$ 2(a\_0+a\_2+a\_4+a\_6+a\_8) \= 2+258 \= 260 \$\$ 따라서 \$a\_0+a\_2+a\_4+a\_6+a\_8=130\$이다.

```
{"status": "EXEMPT", "reason": "(x+1) 거듭제곱 전개 항등식에 x+1=1, -1이 되는 값을 대입해 짝수차 계수합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$x+1=1$($x=0$)과 $x+1=-1$($x=-2$)을 대입해 두 식을 더함으로써 짝수차 계수합을 구한다.", "decisiveStep": "거듭제곱 밑 $(x+1)$이 $\\pm 1$이 되도록 $x=0, -2$를 선택해 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): x=0, -2 수치대입법으로 짝수차 계수합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$(x+1)$에 대한 내림차순 항등식에서 수치대입으로 짝수차 계수합을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "a_0+a_2+a_4+a_6+a_8=130"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "각각 대입하면", "evidenceType": "IMPLIED", "justification": "x+1이 1과 -1이 되는 x=0, -2를 대입한 두 식을 더해 짝수차 계수합을 구함"}], "given": [{"term": "항등식", "src": "solution", "quote": "주어진 항등식에서"}], "condition": []}, "reasons": {"method": "x=0과 x=-2를 대입한 두 식을 더해 짝수차 계수의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.7

### 발문

\$x\$에 대한 방정식 \$(a^2-8)x+a(2x-1)+2=0\$의 해가 존재하지 않을 때, 상수 \$a\$의 값은?

### 선지

① \$2\$ ② \$2, \-4\$ ③ \$-4\$ ④ \$4\$ ⑤ \$-2\$

### 정답

③

### 해설

방정식을 \$x\$에 대하여 정리하면 \$\$ (a^2+2a-8)x \= a-2 \\iff (a+4)(a-2)x \= a-2 \$\$ 일차방정식의 해가 존재하지 않으려면 \$x\$의 계수는 \$0\$이고 상수항은 \$0\$이 아니어야 하므로 \$\$ (a+4)(a-2)=0 \\quad \\text{이고} \\quad a-2\\ne 0 \$\$ 따라서 \$a=-4\$이다. (\$a=2\$이면 \$0\\cdot x=0\$이 되어 해가 무수히 많다.)

```
{"status": "EXEMPT", "reason": "미지수 계수 일차방정식 Ax=B에서 해가 없을 조건 A=0, B≠0을 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-QUADRATIC_SOLVING", "conceptClusterKey": null, "primaryMethod": "방정식을 $(a+4)(a-2)x=a-2$로 정리한 뒤 해가 없을 조건 $A=0, B\\ne 0$을 적용해 $a=-4$를 찾는다.", "decisiveStep": "$a=2$일 때는 $0\\cdot x=0$으로 해가 무수히 많음을 구분하여 $a=-4$만 남긴다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "인수분해·근의 공식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-027(RPM_ONLY): 일차방정식의 해가 없을 조건을 계수 분기로 판별하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자 계수 방정식에서 불능($0\\cdot x=B\\ne 0$)과 부정($0\\cdot x=0$)을 정확히 구별하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값은"}], "method": [{"term": "일차방정식", "src": "solution", "quote": "일차방정식의 해가 존재하지 않으려면", "evidenceType": "NAMED"}], "given": [{"term": "방정식", "src": "stem", "quote": "$x$에 대한 방정식"}], "condition": []}, "reasons": {"method": "Ax=B 꼴로 정리 후 불능 조건 A=0, B≠0으로 a=-4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q13

- 형식: 객관식  
- 배점: 4.9

### 발문

자연수 \$n\$에 대하여 \$f(n)=\\left(\\dfrac{1+i}{\\sqrt{2}}\\right)^n+\\left(\\dfrac{1-i}{\\sqrt{2}}\\right)^n\$이라 할 때, \$f(2)+f(4)+f(6)+\\cdots+f(100)\$의 값은?

### 선지

① \$0\$ ② \$2\$ ③ \$i\$ ④ \$-i\$ ⑤ \$-2\$

### 정답

⑤

### 해설

\$\\left(\\dfrac{1+i}{\\sqrt{2}}\\right)^2 \= \\dfrac{2i}{2}=i\$, \$\\left(\\dfrac{1-i}{\\sqrt{2}}\\right)^2 \= \\dfrac{-2i}{2}=-i\$이므로 \$\$ f(2k) \= i^k+(-i)^k \$\$ \$k=1, 2, 3, 4\$일 때 값을 구하면

- \$f(2) \= i+(-i) \= 0\$  
- \$f(4) \= i^2+(-i)^2 \= \-1-1 \= \-2\$  
- \$f(6) \= i^3+(-i)^3 \= \-i+i \= 0\$  
- \$f(8) \= i^4+(-i)^4 \= 1+1 \= 2\$ 따라서 연속한 \$4\$개 항의 합은 \$0+(-2)+0+2=0\$이고 주기가 \$4\$이다. 총 항수는 \$50\$개이고 \$50=4\\times 12+2\$이므로 \$\$ f(2)+f(4)+\\cdots+f(100) \= f(2)+f(4) \= 0+(-2) \= \-2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "((1±i)/√2)^2=±i를 이용해 짝수항 합을 4주기 소거로 계산하는 순수 복소수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$\\left(\\frac{1\\pm i}{\\sqrt{2}}\\right)^2=\\pm i$를 이용해 $f(2k)=i^k+(-i)^k$의 주기 $4$ 묶음 합이 $0$임을 밝히고 나머지 $2$항을 더한다.", "decisiveStep": "$50$개 항에서 $4\\times 12=48$개 항이 $0$으로 소거되고 $f(2)+f(4)=-2$만 남음을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 복소수 거듭제곱의 4주기성을 이용해 50항의 합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 제곱의 허수단위화와 $4$주기 소거를 결합한 짝수항 합 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "연속한 $4$개 항의 합은"}], "method": [{"term": "복소수", "src": "solution", "quote": "주기가 $4$이다", "evidenceType": "IMPLIED", "justification": "f(2k)가 k에 대해 주기 4로 반복되며 4항 합이 0임을 이용해 50항 합을 계산함"}], "given": [{"term": "자연수", "src": "stem", "quote": "자연수 $n$에 대하여"}], "condition": []}, "reasons": {"method": "제곱으로 ±i를 얻은 뒤 4주기 소거로 50개 짝수항의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 5

### 발문

(가) \$\\dfrac{\\sqrt{x+2}}{\\sqrt{x-3}}=-\\sqrt{\\dfrac{x+2}{x-3}}\$ (나) \$\\sqrt{2-y}\\sqrt{y-4}=-\\sqrt{-y^2+6y-8}\$ 일 때, (가)와 (나)를 만족하는 정수 \$x\$, \$y\$의 개수를 각각 \$m\$, \$n\$이라 할 때 \$m+n\$의 값은?

### 선지

① \$6\$ ② \$8\$ ③ \$7\$ ④ \$5\$ ⑤ \$9\$

### 정답

②

### 해설

- 조건 (가): \$\\dfrac{\\sqrt{A}}{\\sqrt{B}}=-\\sqrt{\\dfrac{A}{B}}\$가 성립하려면 \$A\\ge 0\$, \$B\<0\$이어야 하므로 \$\$x+2\\ge 0 \\quad \\text{이고} \\quad x-3\<0 \\implies \-2\\le x\<3\$\$ 따라서 정수 \$x\$는 \$-2, \-1, 0, 1, 2\$로 \$m=5\$개이다.  
- 조건 (나): \$-y^2+6y-8=(2-y)(y-4)\$이고 \$\\sqrt{A}\\sqrt{B}=-\\sqrt{AB}\$가 성립하려면 \$A\\le 0\$, \$B\\le 0\$이어야 하므로 \$\$2-y\\le 0 \\quad \\text{이고} \\quad y-4\\le 0 \\implies 2\\le y\\le 4\$\$ 따라서 정수 \$y\$는 \$2, 3, 4\$로 \$n=3\$개이다. 그러므로 \$m+n=5+3=8\$이다.

```
{"status": "EXEMPT", "reason": "음수의 제곱근 곱셈·나눗셈 부호 반전 조건의 등호 포함 여부를 판별해 정수 개수를 세는 순수 개념 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "나눗셈 음수 제곱근 조건($A\\ge 0, B<0$)과 곱셈 음수 제곱근 조건($A\\le 0, B\\le 0$)의 경계 등호를 구분해 정수 $x, y$를 센다.", "decisiveStep": "분모 $B\\ne 0$과 분자 $A=0$ 및 곱셈 양 인수의 $0$ 포함 여부를 정확히 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 음수의 제곱근 곱셈·나눗셈 부호 조건을 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 제곱근 연산 성질에서 부등호의 등호 포함 경계를 정확히 묻는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $x$, $y$의 개수를"}], "method": [{"term": "제곱근", "src": "solution", "quote": "\\dfrac{\\sqrt{A}}{\\sqrt{B}}=-\\sqrt{\\dfrac{A}{B}}", "evidenceType": "IMPLIED", "justification": "음수의 제곱근 나눗셈과 곱셈에서 음의 부호가 나오는 부호 및 등호 조건을 적용함"}], "given": [{"term": "부등식", "src": "solution", "quote": "-2\\le x<3"}], "condition": []}, "reasons": {"method": "음수 제곱근 나눗셈·곱셈 부호 조건의 경계 등호를 구분해 정수 개수를 셈"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 5.1

### 발문

\$\\left(\\dfrac{1-i}{\\sqrt{2}}\\right)^n+\\left(\\dfrac{\\sqrt{3}-i}{2}\\right)^n=2\$를 만족시키는 자연수 \$n\$의 최솟값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$12\$ ② \$16\$ ③ \$20\$ ④ \$24\$ ⑤ \$48\$

### 정답

④

### 해설

\$z\_1=\\dfrac{1-i}{\\sqrt{2}}\$, \$z\_2=\\dfrac{\\sqrt{3}-i}{2}\$이라 하면 \$\|z\_1\|=\|z\_2\|=1\$이므로 두 수의 거듭제곱의 합이 \$2\$가 되려면 \$\$ z\_1^n=1 \\quad \\text{이고} \\quad z\_2^n=1 \$\$ 이어야 한다.

- \$z\_1^2=-i\$, \$z\_1^4=-1\$, \$z\_1^8=1\$이므로 \$z\_1^n=1 \\iff n\$은 \$8\$의 배수.  
- \$z\_2^2=\\dfrac{1-\\sqrt{3}i}{2}\$, \$z\_2^3=z\_2^2\\cdot z\_2=-i\$, \$z\_2^6=-1\$, \$z\_2^{12}=1\$이므로 \$z\_2^n=1 \\iff n\$은 \$12\$의 배수. 따라서 자연수 \$n\$은 \$8\$과 \$12\$의 공배수이므로 최솟값은 \$\\operatorname{lcm}(8, 12)=24\$이다.

```
{"status": "EXEMPT", "reason": "두 단위 복소수의 거듭제곱 합이 2가 되는 최소 자연수 n을 주기 최소공배수로 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "두 복소수의 주기가 각각 $8$과 $12$임을 거듭제곱 계산으로 구한 뒤 합이 $2$가 되는 공배수의 최솟값 $24$를 구한다.", "decisiveStep": "$z_1^n+z_2^n=2$가 $z_1^n=1$이고 $z_2^n=1$일 때만 성립함을 이용해 최소공배수 $\\operatorname{lcm}(8, 12)=24$를 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 두 복소수 거듭제곱의 주기 8, 12의 공배수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 특수 복소수의 주기 $8$과 $12$를 구해 최소공배수로 연결하는 중고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "자연수 $n$의 최솟값은"}], "method": [{"term": "최소공배수", "src": "solution", "quote": "최솟값은 $\\operatorname{lcm}(8, 12)=24$", "evidenceType": "IMPLIED", "justification": "두 복소수가 각각 1이 되는 최소 지수 8과 12의 최소공배수를 구함"}], "given": [{"term": "복소수", "src": "solution", "quote": "z_1=\\dfrac{1-i}{\\sqrt{2}}"}], "condition": []}, "reasons": {"method": "두 복소수의 주기 8, 12를 구하고 최소공배수 24를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 5.2

### 발문

\$n=\\dfrac{x^3+4x^2+15x+12}{x^2+4x+3}\$가 자연수가 되도록 하는 모든 자연수 \$x\$의 값의 합은?

### 선지

① \$10\$ ② \$12\$ ③ \$13\$ ④ \$15\$ ⑤ \$16\$

### 정답

③

### 해설

분자를 분모 \$x^2+4x+3=(x+1)(x+3)\$으로 나누어 정리하면 \$\$ \\begin{aligned} x^3+4x^2+15x+12 &= x(x^2+4x+3)+12x+12 \\ &= x(x^2+4x+3)+12(x+1) \\end{aligned} \$\$ 따라서 \$x\$가 자연수일 때 \$x+1\>0\$을 약분하면 \$\$ n \= x+\\frac{12(x+1)}{(x+1)(x+3)} \= x+\\frac{12}{x+3} \$\$ \$n\$이 자연수가 되려면 \$x+3\$이 \$12\$의 양의 약수이어야 한다. \$x\\ge 1\$이므로 \$x+3\\ge 4\$인 \$12\$의 약수는 \$4, 6, 12\$이고, 대응하는 \$x\$는 \$1, 3, 9\$이다. 따라서 모든 자연수 \$x\$의 값의 합은 \$1+3+9=13\$이다.

```
{"status": "EXEMPT", "reason": "삼차식을 이차식으로 나누어 몫과 약분 후 분수식 12/(x+3)의 자연수 조건으로 x를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "분자 $x^3+4x^2+15x+12$를 분모로 나눈 뒤 $(x+1)$을 약분해 $n=x+\\frac{12}{x+3}$ 꼴로 만들고 $x+3\\ge 4$인 $12$의 약수를 구한다.", "decisiveStep": "나머지 $12(x+1)$과 분모 $(x+1)(x+3)$에서 $(x+1)$이 약분되어 $\\frac{12}{x+3}$만 남는 것을 발견한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "식의 값"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-019(DIRECT_ACTIVE): 다항식 나눗셈과 약분으로 정수 조건의 해를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 나눗셈, 공통인수 약분, 정수 약수 조건을 결합한 고난도 객관식 끝 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "모든 자연수 $x$의 값의 합"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "분자를 분모 $x^2+4x+3=(x+1)(x+3)$으로 나누어", "evidenceType": "IMPLIED", "justification": "삼차식을 이차식으로 나눈 뒤 (x+1)을 약분하여 12의 약수 조건으로 환원함"}], "given": [{"term": "인수분해", "src": "solution", "quote": "(x+1)(x+3)"}], "condition": []}, "reasons": {"method": "삼차식 나눗셈 후 (x+1) 약분으로 12의 약수 조건을 풀어 x 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 서답형  
- 배점: 4

### 발문

세 다항식 \$A\$, \$B\$, \$C\$가 \$A=2x^2-xy+y^2\$, \$B=x^2-3xy\$, \$C=x^2+2y^2\$와 같을 때, 아래 식을 계산하여 \$x\$에 대한 내림차순으로 나타내고 그 과정을 서술하시오. \[각 2점\] (1) \$(A+B)+(2A-B)\$ (2) \$BC-2CB\$

### 선지

없음

### 정답

(1) \$6x^2-3xy+3y^2\$, (2) \$-x^4+3x^3y-2x^2y^2+6xy^3\$

### 해설

(1) 먼저 식을 간단히 하면 \$\$ (A+B)+(2A-B) \= 3A \= 3(2x^2-xy+y^2) \= 6x^2-3xy+3y^2 \$\$ (2) 다항식의 곱셈은 교환법칙이 성립하므로 \$CB=BC\$이고 \$\$ \\begin{aligned} BC-2CB &= \-BC \\ &= \-(x^2-3xy)(x^2+2y^2) \\ &= \-(x^4+2x^2y^2-3x^3y-6xy^3) \\ &= \-x^4+3x^3y-2x^2y^2+6xy^3 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "다항식 연산 법칙으로 식을 간단히 한 뒤 대입해 x에 대해 내림차순 정리하는 순수 연산 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "주어진 식을 먼저 $3A$와 $-BC$로 간단히 정리한 뒤 $A, B, C$를 대입하고 $x$에 대한 내림차순으로 전개한다.", "decisiveStep": "$B, C$를 바로 대입하지 않고 $(A+B)+(2A-B)=3A$, $BC-2CB=-BC$로 먼저 축약한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 식 정리 후 다항식 덧셈·곱셈의 동류항 계수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 사칙연산과 내림차순 정리를 묻는 기본 서술형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "내림차순", "src": "stem", "quote": "$x$에 대한 내림차순으로"}], "method": [{"term": "전개", "src": "solution", "quote": "-(x^4+2x^2y^2-3x^3y-6xy^3)", "evidenceType": "IMPLIED", "justification": "문자식을 3A와 -BC로 단순화한 뒤 대입하여 전개하고 x에 대해 내림차순 정리함"}], "given": [{"term": "다항식", "src": "stem", "quote": "세 다항식 $A$, $B$, $C$"}], "condition": []}, "reasons": {"method": "식을 3A, -BC로 먼저 정리한 뒤 대입해 x에 대한 내림차순으로 전개함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 4

### 발문

허수 \$z\$에 대하여 \$z+\\dfrac{4}{z}\$이 실수일 때, \$z\\overline{z}\$의 값을 구하고 그 과정을 서술하시오. (단, \$\\overline{z}\$는 \$z\$의 켤레복소수이다.)

### 선지

없음

### 정답

\$4\$

### 해설

\$z+\\dfrac{4}{z}\$이 실수이므로 그 켤레복소수와 같다. \$\$ z+\\frac{4}{z} \= \\overline{z+\\frac{4}{z}} \= \\overline{z}+\\frac{4}{\\overline{z}} \$\$ 이항하여 정리하면 \$\$ (z-\\overline{z})+4\\left(\\frac{1}{z}-\\frac{1}{\\overline{z}}\\right) \= (z-\\overline{z})+4\\cdot\\frac{\\overline{z}-z}{z\\overline{z}} \= (z-\\overline{z})\\left(1-\\frac{4}{z\\overline{z}}\\right) \= 0 \$\$ \$z\$가 허수이므로 \$z\\ne\\overline{z}\$, 즉 \$z-\\overline{z}\\ne 0\$이다. 따라서 \$1-\\dfrac{4}{z\\overline{z}}=0\$이므로 \$z\\overline{z}=4\$이다.

```
{"status": "EXEMPT", "reason": "복소수가 실수일 조건 w=w_bar를 이용해 z*z_bar=4를 도출하는 순수 복소수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z+\\frac{4}{z}$이 실수이므로 켤레복소수와 같다는 식을 세워 $(z-\\overline{z})\\left(1-\\frac{4}{z\\overline{z}}\\right)=0$으로 인수분해한다.", "decisiveStep": "허수 조건에서 $z-\\overline{z}\\ne 0$임을 이용해 $z\\overline{z}=4$를 유일하게 도출한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): 복소수가 실수가 될 조건(켤레복소수 상등)으로 z*bar(z)를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실수 판별 조건 $w=\\overline{w}$와 허수 조건 $z\\ne\\overline{z}$를 결합한 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "$z$의 켤레복소수이다"}], "method": [{"term": "인수분해", "src": "solution", "quote": "(z-\\overline{z})\\left(1-\\frac{4}{z\\overline{z}}\\right) = 0", "evidenceType": "IMPLIED", "justification": "실수 조건 w=w_bar를 이항·통분하여 (z-z_bar)로 인수분해함"}], "given": [{"term": "허수", "src": "stem", "quote": "허수 $z$에 대하여"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수일 때"}]}, "reasons": {"method": "w=w_bar를 인수분해하고 z≠z_bar 조건으로 z*z_bar=4를 도출함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 5

### 발문

\$0\$이 아닌 세 실수 \$a\$, \$b\$, \$c\$에 대하여 \$a^3+b^3+c^3=3abc\$일 때, 가능한 \$\\dfrac{3a^2}{b^2+c^2-a^2}+\\dfrac{3b^2}{c^2+a^2-b^2}+\\dfrac{3c^2}{a^2+b^2-c^2}\$의 모든 값의 합을 구하고 그 과정을 서술하시오. (단, 필요하다면 아래의 \<공식\>을 증명 없이 사용할 수 있다.) \<공식\> \$a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)\$

### 선지

없음

### 정답

\$\\dfrac{9}{2}\$

### 해설

주어진 공식에 의하여 \$a^3+b^3+c^3-3abc=(a+b+c)\\cdot\\dfrac{1}{2}{(a-b)^2+(b-c)^2+(c-a)^2}=0\$이므로 \$a+b+c=0\$ 또는 \$a=b=c\$이다.

1) \$a+b+c=0\$일 때: \$b+c=-a\$이므로 \$b^2+c^2-a^2=b^2+c^2-(b+c)^2=-2bc\$이고, 같은 방식으로 \$c^2+a^2-b^2=-2ca\$, \$a^2+b^2-c^2=-2ab\$이다. 따라서 \$\$ \\frac{3a^2}{-2bc}+\\frac{3b^2}{-2ca}+\\frac{3c^2}{-2ab} \= \-\\frac{3(a^3+b^3+c^3)}{2abc} \= \-\\frac{3(3abc)}{2abc} \= \-\\frac{9}{2} \$\$  
2) \$a=b=c\\ne 0\$일 때: \$\$ \\frac{3a^2}{a^2+a^2-a^2}+\\frac{3a^2}{a^2+a^2-a^2}+\\frac{3a^2}{a^2+a^2-a^2} \= 3+3+3 \= 9 \$\$ 그러므로 구하는 모든 값의 합은 \$-\\dfrac{9}{2}+9=\\dfrac{9}{2}\$이다.

```
{"status": "EXEMPT", "reason": "a^3+b^3+c^3=3abc 조건을 a+b+c=0과 a=b=c 두 경우로 나누어 식의 값을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$a^3+b^3+c^3=3abc$에서 $a+b+c=0$과 $a=b=c$의 두 경우로 분기하여 각각의 식의 값을 구한 뒤 합한다.", "decisiveStep": "$a+b+c=0$일 때 분모 $b^2+c^2-a^2$을 $-2bc$로 변형하고 $a^3+b^3+c^3=3abc$를 다시 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): a^3+b^3+c^3=3abc 인수분해 조건식으로 식의 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 수의 세제곱 항등식의 두 가지 해 조건을 빠짐없이 분기해야 하는 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "stem", "quote": "모든 값의 합을 구하고"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "a^3+b^3+c^3-3abc=", "evidenceType": "IMPLIED", "justification": "세제곱 항등식 인수분해로 a+b+c=0과 a=b=c 두 경우를 도출해 식의 값을 구함"}], "given": [{"term": "실수", "src": "stem", "quote": "$0$이 아닌 세 실수 $a$, $b$, $c$"}], "condition": []}, "reasons": {"method": "a+b+c=0과 a=b=c 두 경우로 분기해 식의 값의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 5

### 발문

\$x\$에 대한 사차다항식 \$2x^4+24x^3-52x^2+28x+3\$을 \$a(2x-2)^4+b(2x-2)^3+c(2x-2)^2+d(2x-2)+e\$로 나타낼 때, \$ac+bd+e\$의 값을 구하고 그 과정을 서술하시오. (단, \$a\$, \$b\$, \$c\$, \$d\$, \$e\$는 상수이다.)

### 선지

없음

### 정답

\$14\$

### 해설

\$2x-2=2(x-1)\$이므로 \$f(x)=2x^4+24x^3-52x^2+28x+3\$을 \$x=1\$로 조립제법을 연속 적용해 \$(x-1)\$에 대하여 정리하면

- \$1\$차 나눗셈: 몫 \$2x^3+26x^2-26x+2\$, 나머지 \$5\$  
- \$2\$차 나눗셈: 몫 \$2x^2+28x+2\$, 나머지 \$4\$  
- \$3\$차 나눗셈: 몫 \$2x+30\$, 나머지 \$32\$  
- \$4\$차 나눗셈: 몫 \$2\$, 나머지 \$32\$ 따라서 \$\$ \\begin{aligned} f(x) &= 2(x-1)^4+32(x-1)^3+32(x-1)^2+4(x-1)+5 \\ &= \\frac{1}{8}(2x-2)^4+4(2x-2)^3+8(2x-2)^2+2(2x-2)+5 \\end{aligned} \$\$ 이므로 \$a=\\dfrac{1}{8}, b=4, c=8, d=2, e=5\$이다. 따라서 \$ac+bd+e \= \\dfrac{1}{8}\\cdot 8 \+ 4\\cdot 2 \+ 5 \= 1+8+5 \= 14\$이다.

```
{"status": "EXEMPT", "reason": "사차다항식을 연속 조립제법으로 (2x-2)의 거듭제곱 꼴로 전개해 계수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "$2x-2=2(x-1)$임을 이용해 $x=1$로 연속 조립제법을 수행하고 각 항의 $2^k$ 인자를 분리해 $a, b, c, d, e$를 구한다.", "decisiveStep": "$(x-1)^k = \\frac{1}{2^k}(2x-2)^k$ 변환으로 조립제법 나머지에서 $a, b, c, d, e$를 정확히 환산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "다항식을 일차식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-005(DIRECT_ACTIVE): 연속 조립제법으로 내림차순 항등식 계수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연속 조립제법과 일차항 계수 $2$ 보정이 결합된 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수이다"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "조립제법을 연속 적용해", "evidenceType": "IMPLIED", "justification": "x=1로 연속 조립제법을 수행해 (x-1) 거듭제곱 계수를 구한 뒤 2^k으로 나눔"}], "given": [{"term": "다항식", "src": "stem", "quote": "사차다항식 $2x^4+24x^3-52x^2+28x+3$"}], "condition": []}, "reasons": {"method": "x=1 연속 조립제법과 2^k 환산으로 계수 a, b, c, d, e를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

다항식 \$f(x)=x^{2022}+x^{2021}+x^{2020}+x^2+2\$에 대하여 \$f(3)\$을 \$26\$으로 나눈 나머지를 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

\$24\$

### 해설

\$26=3^3-1\$이므로 다항식 \$f(x)\$를 \$x^3-1\$로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$R(x)\$라 하자. \$x^{2022}=(x^3)^{674}\$, \$x^{2021}=x^2(x^3)^{673}\$, \$x^{2020}=x(x^3)^{673}\$이고 \$x^3-1\$로 나눈 나머지는 \$x^3\$에 \$1\$을 대입한 것과 같으므로 \$\$ R(x) \= 1^{674}+x^2\\cdot 1^{673}+x\\cdot 1^{673}+x^2+2 \= 2x^2+x+3 \$\$ 즉 \$f(x)=(x^3-1)Q(x)+2x^2+x+3\$이다. 양변에 \$x=3\$을 대입하면 \$\$ f(3) \= (3^3-1)Q(3)+2\\cdot 3^2+3+3 \= 26Q(3)+24 \$\$ \$Q(3)\$은 정수이고 \$0\\le 24\<26\$이므로 \$f(3)\$을 \$26\$으로 나눈 나머지는 \$24\$이다.

```
{"status": "EXEMPT", "reason": "수 나눗셈을 x=3 치환 후 다항식 x^3-1 나눗셈의 나머지로 환원해 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$26=3^3-1$에 착안해 $f(x)$를 $x^3-1$로 나눈 나머지 $R(x)=2x^2+x+3$을 구한 뒤 $x=3$을 대입한다.", "decisiveStep": "$x^3-1$로 나눈 나머지에서 $x^3=1$ 대입으로 $f(x)$를 $2x^2+x+3$으로 축약하고 $0\\le R(3)<26$을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): x^3-1 나눗셈 나머지를 이용해 큰 수의 나눗셈 나머지를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "큰 수의 거듭제곱 합 나눗셈을 다항식의 나눗셈 항등식으로 변환해 푸는 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "$26$으로 나눈 나머지를"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "다항식 $f(x)$를 $x^3-1$로 나누었을 때", "evidenceType": "IMPLIED", "justification": "26=3^3-1을 이용해 f(x)를 x^3-1로 나눈 나머지에 x=3을 대입함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)=x^{2022}+x^{2021}+x^{2020}+x^2+2$"}], "condition": []}, "reasons": {"method": "26=3^3-1을 이용해 f(x)를 x^3-1로 나눈 나머지에 x=3을 대입함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 6

### 발문

\$x\$에 대한 이차방정식 \$x^2+px+q=0\$이 부호가 다른 두 실근 \$\\alpha\$, \$\\beta\$를 갖는다. \$\|\\alpha\|\$, \$\|\\beta\|\$가 이차방정식 \$x^2-(p-q)x+p+q=0\$의 두 근일 때, 상수 \$p\$, \$q\$에 대하여 \$p^2+q^2\$의 값을 구하고 그 과정을 서술하시오.

### 선지

없음

### 정답

\$\\dfrac{16}{5}\$

### 해설

\$\\alpha, \\beta\$의 부호가 다르므로 \$\\alpha\\beta=q\<0\$이고 \$\|\\alpha\|\|\\beta\|=-\\alpha\\beta=-q\$이다. \$\|\\alpha\|, \|\\beta\|\$가 \$x^2-(p-q)x+p+q=0\$의 두 근이므로 근과 계수의 관계에 의하여 \$\$ \|\\alpha\|+\|\\beta\| \= p-q, \\qquad \|\\alpha\|\|\\beta\| \= p+q \$\$ 두 번째 식에서 \$-q=p+q \\implies p=-2q\$이다. 한편 \$\|\\alpha\|+\|\\beta\|\>0\$이므로 \$p-q=-3q\>0\$이고, 양변을 제곱하면 \$\$ (\|\\alpha\|+\|\\beta\|)^2 \= \\alpha^2+\\beta^2+2\|\\alpha\\beta\| \= (\\alpha+\\beta)^2-2\\alpha\\beta-2\\alpha\\beta \= p^2-4q \$\$ 따라서 \$(p-q)^2 \= p^2-4q\$이다. 여기에 \$p=-2q\$를 대입하면 \$\$ (-3q)^2 \= (-2q)^2-4q \\implies 9q^2 \= 4q^2-4q \\implies 5q^2+4q \= 0 \$\$ \$q\<0\$이므로 \$q=-\\dfrac{4}{5}\$, \$p=-2q=\\dfrac{8}{5}\$이다. 그러므로 \$p^2+q^2 \= \\left(\\dfrac{8}{5}\\right)^2+\\left(-\\dfrac{4}{5}\\right)^2 \= \\dfrac{64+16}{25} \= \\dfrac{16}{5}\$이다.

```
{"status": "EXEMPT", "reason": "부호가 다른 두 근의 절댓값 합과 곱을 근과 계수의 관계로 연립해 p, q를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha\\beta=q<0$으로 $|\\alpha||\\beta|=-q=p+q$에서 $p=-2q$를 구하고 $(|\\alpha|+|\\beta|)^2=p^2-4q=(p-q)^2$을 연립한다.", "decisiveStep": "부호가 다른 두 실근이므로 $(|\\alpha|+|\\beta|)^2=(\\alpha-\\beta)^2=p^2-4q$가 됨을 정확히 식 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 부호가 다른 두 실근의 절댓값 합·곱에 근과 계수의 관계를 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 근의 합과 곱에 부호 조건 $\\alpha\\beta<0$을 결합해 연립방정식을 푸는 최고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $p$, $q$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+px+q=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "부호가 다른 두 실근"}]}, "reasons": {"method": "부호 다른 두 근 조건으로 |α||β|=-q, (|α|+|β|)^2=p^2-4q를 연립함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

