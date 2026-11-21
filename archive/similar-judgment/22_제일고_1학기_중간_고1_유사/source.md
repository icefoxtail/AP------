

```
{"stem": "22_제일고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_제일고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 4.1

### 발문

다항식 \$A\$를 \$x^2-x+2\$로 나누었더니 몫이 \$3x+1\$이고 나머지가 \$2x-3\$이었다. 이때 다항식 \$A\$를 구한 것으로 알맞은 것은?

### 선지

① \$3x^3-2x^2+7x+1\$ ② \$3x^3-2x^2+5x-1\$ ③ \$3x^3-2x^2+7x-1\$ ④ \$3x^3+2x^2+7x-1\$ ⑤ \$3x^3-4x^2+7x-1\$

### 정답

③

### 해설

다항식의 나눗셈 관계식에 의하여 \$\$ \\begin{aligned} A &= (x^2-x+2)(3x+1)+(2x-3) \\ &= (3x^3+x^2-3x^2-x+6x+2)+(2x-3) \\ &= (3x^3-2x^2+5x+2)+(2x-3) \\ &= 3x^3-2x^2+7x-1 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "나눗셈 관계식 A=BQ+R을 전개해 다항식 A를 구하는 순수 연산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "나눗셈 검산식 $A=(x^2-x+2)(3x+1)+(2x-3)$을 전개하고 동류항을 정리해 $A$를 구한다.", "decisiveStep": "곱 $(x^2-x+2)(3x+1)=3x^3-2x^2+5x+2$를 전개한 뒤 나머지 $2x-3$을 더한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "고차식 전개"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-004(DIRECT_ACTIVE): 나눗셈 검산식 전개와 동류항 정리로 다항식 A를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 나눗셈 관계식 $A=BQ+R$에 몫과 나머지를 대입해 전개하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "다항식 $A$를 구한"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "나눗셈 관계식에 의하여", "evidenceType": "IMPLIED", "justification": "나눗셈 항등식 A=BQ+R을 이용해 피제수 다항식 A를 복원함"}], "given": [{"term": "나머지", "src": "stem", "quote": "나머지가 $2x-3$"}], "condition": []}, "reasons": {"method": "나눗셈 관계식 A=BQ+R을 전개하여 다항식 A를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 4.2

### 발문

다음 중 다항식 \$x^4-x^3-4x^2-x+1\$의 인수인 것을 고르면?

### 선지

① \$x^2-3x+1\$ ② \$x^2+3x+1\$ ③ \$x^2-3x-1\$ ④ \$x^2+2x+3\$ ⑤ \$x^2-2x+2\$

### 정답

①

### 해설

\$P(x)=x^4-x^3-4x^2-x+1\$이라 하면 \$P(-1)=1+1-4+1+1=0\$이므로 \$x+1\$을 인수로 갖는다. 조립제법을 적용하면 \$\$ P(x) \= (x+1)(x^3-2x^2-2x+1) \$\$ \$Q(x)=x^3-2x^2-2x+1\$에 다시 \$x=-1\$을 대입하면 \$Q(-1)=-1-2+2+1=0\$이므로 \$x+1\$을 한 번 더 인수로 갖는다. \$\$ P(x) \= (x+1)^2(x^2-3x+1) \$\$ 따라서 보기 중 인수인 것은 ① \$x^2-3x+1\$이다.

```
{"status": "EXEMPT", "reason": "사차다항식을 인수정리와 조립제법으로 인수분해해 이차 인수를 찾는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$P(-1)=0$으로 일차인수 $(x+1)$을 두 번 추출하여 $P(x)=(x+1)^2(x^2-3x+1)$로 인수분해한다.", "decisiveStep": "$x=-1$이 중근임을 두 번의 인수정리 대입으로 확인해 이차인수 $x^2-3x+1$을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 인수정리 x=-1 두 번 적용으로 사차식을 단계적 인수분해함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "고차다항식에 인수정리를 연속 적용해 이차 인수를 찾아내는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "인수인 것을"}], "method": [{"term": "인수정리", "src": "solution", "quote": "$P(-1)=1+1-4+1+1=0$이므로 $x+1$을 인수", "evidenceType": "IMPLIED", "justification": "x=-1을 대입해 0이 되는 일차인수 (x+1)을 찾아 나눗셈을 반복함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^4-x^3-4x^2-x+1$"}], "condition": []}, "reasons": {"method": "인수정리로 (x+1)^2을 분리하여 이차인수 x^2-3x+1을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4.3

### 발문

다음은 조립제법을 이용하여 \$(2x^3+5x^2+4x+4)\\div(2x+1)\$의 몫과 나머지를 구하는 과정이다. 빈칸에 알맞은 것을 고르면?

| (가) | \$2\$ | (나) | \$4\$ | \$4\$ |
| :---- | :---- | :---- | :---- | :---- |
|  |  | \$-1\$ | \$-2\$ | (다) |
|  | \$2\$ | \$4\$ | \$2\$ | (마) |

\$2x^3+5x^2+4x+4 \= \\left(x+\\dfrac{1}{2}\\right)(2x^2+4x+2)+\\text{(마)} \= (2x+1)\\times\\text{(라)}+\\text{(마)}\$

### 선지

① (가) \$\\dfrac{1}{2}\$ ② (나) \$-5\$ ③ (다) \$1\$ ④ (라) \$2x^2+4x+2\$ ⑤ (마) \$3\$

### 정답

⑤

### 해설

나누는 식 \$2x+1=2\\left(x+\\dfrac{1}{2}\\right)\$이므로 조립제법 왼쪽에 적는 수는 \$(\\text{가})=-\\dfrac{1}{2}\$이다. 원래 다항식의 \$x^2\$항 계수가 \$5\$이므로 \$(\\text{나})=5\$이고, 셋째 열에서 \$2\\cdot\\left(-\\dfrac{1}{2}\\right)=-1\$이므로 \$(\\text{다})=-1\$이다. 나머지는 \$(\\text{마})=4+(-1)=3\$이며, \$2x+1=2\\left(x+\\dfrac{1}{2}\\right)\$이므로 실제 몫은 \$(\\text{라})=\\dfrac{2x^2+4x+2}{2}=x^2+2x+1\$이다. 따라서 보기 중 옳은 것은 ⑤이다.

```
{"status": "EXEMPT", "reason": "발문에 표로 제시된 조립제법 과정의 빈칸을 채워 몫과 나머지를 구하는 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "조립제법 표에서 $2x+1=2(x+1/2)$에 따라 (가)$=-1/2$를 정하고 각 칸과 실제 몫 (라)를 계산한다.", "decisiveStep": "나머지 (마)$=4-1=3$과 $2$로 나눈 실제 몫 (라)$=x^2+2x+1$을 구분한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "다항식을 일차식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-005(DIRECT_ACTIVE): 일차식 2x+1 나눗셈의 조립제법 빈칸과 실제 몫을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조립제법 빈칸 채우기와 일차항 계수 $2$에 대한 몫 보정을 함께 묻는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫과 나머지를 구하는 과정"}], "method": [{"term": "다항식의나눗셈", "src": "stem", "quote": "조립제법을 이용하여", "evidenceType": "IMPLIED", "justification": "조립제법 연산과 제수 상수배 보정으로 몫과 나머지를 구함"}], "given": [{"term": "계수", "src": "solution", "quote": "계수가 $5$이므로"}], "condition": []}, "reasons": {"method": "조립제법 빈칸을 채우고 2x+1 나눗셈의 실제 몫과 나머지를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.4

### 발문

다음 중 옳지 않은 것을 고른 것은?

### 선지

① \$(a+b)(a-b)=a^2-b^2\$ ② \$a^3+b^3=(a+b)^3+3ab(a+b)\$ ③ \$a^3-b^3=(a-b)(a^2+ab+b^2)\$ ④ \$(a+b+c)^2=a^2+b^2+c^2+2ab+2bc+2ca\$ ⑤ \$a^4+a^2b^2+b^4=(a^2+ab+b^2)(a^2-ab+b^2)\$

### 정답

②

### 해설

②의 우변을 전개하면 \$\$ (a+b)^3+3ab(a+b) \= a^3+3a^2b+3ab^2+b^3+3a^2b+3ab^2 \= a^3+6a^2b+6ab^2+b^3 \$\$ 이므로 \$a^3+b^3\$과 같지 않다. (올바른 변형 공식은 \$a^3+b^3=(a+b)^3-3ab(a+b)\$이다.) 나머지 ①, ③, ④, ⑤는 모두 옳은 곱셈·인수분해 공식이다.

```
{"status": "EXEMPT", "reason": "곱셈 공식과 인수분해 공식의 정오를 전개로 판별하는 순수 식 변형 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "다섯 보기의 곱셈·인수분해 공식을 전개하여 부호가 잘못된 ② $(a+b)^3+3ab(a+b)$를 가려낸다.", "decisiveStep": "②의 우변을 전개할 때 $3a^2b+3ab^2$가 소거되지 않고 $6a^2b+6ab^2$가 됨을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈·인수분해 공식 전개를 대조해 옳지 않은 식을 찾음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기본 곱셈 공식과 변형 공식의 부호를 정확히 암기·검산하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "전개", "src": "solution", "quote": "우변을 전개하면"}], "method": [{"term": "전개", "src": "solution", "quote": "우변을 전개하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "solution", "quote": "a^3+6a^2b+6ab^2+b^3"}], "condition": []}, "reasons": {"method": "각 공식의 우변을 전개해 좌변과 비교하여 틀린 공식을 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.4

### 발문

\$x^2-xy-6y^2+7x-11y+10\$의 인수로 알맞은 것은?

### 선지

① \$x+3y+2\$ ② \$x-2y+5\$ ③ \$x+2y-5\$ ④ \$x-3y+2\$ ⑤ \$x-3y-2\$

### 정답

④

### 해설

\$x\$에 대하여 내림차순으로 정리하면 \$\$ \\begin{aligned} x^2+(-y+7)x-(6y^2+11y-10) &= x^2+(-y+7)x-(3y-2)(2y+5) \\ &= (x-3y+2)(x+2y+5) \\end{aligned} \$\$ 따라서 보기 중 알맞은 인수는 ④ \$x-3y+2\$이다.

```
{"status": "EXEMPT", "reason": "두 문자 이차식을 한 문자에 대해 내림차순 정리해 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "이차식 $x^2-xy-6y^2+7x-11y+10$을 $x$에 대해 내림차순 정리한 뒤 상수항 부분을 인수분해해 $(x-3y+2)(x+2y+5)$를 얻는다.", "decisiveStep": "$-(6y^2+11y-10)=-(3y-2)(2y+5)$를 대각선 인수분해하여 일차항 $(-y+7)x$를 맞춘다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "이차식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-017(DIRECT_ACTIVE): 두 문자 이차식을 내림차순 정리 후 대각선 인수분해함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자가 두 개인 이차식을 한 문자 기준 내림차순 정리로 인수분해하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "solution", "quote": "(x-3y+2)(x+2y+5)"}], "method": [{"term": "인수분해", "src": "solution", "quote": "내림차순으로 정리하면", "evidenceType": "IMPLIED", "justification": "x에 대한 내림차순 정리 후 상수항을 인수분해하여 X자 인수분해를 수행함"}], "given": [{"term": "이차식", "src": "stem", "quote": "x^2-xy-6y^2+7x-11y+10"}], "condition": []}, "reasons": {"method": "x 기준 내림차순 정리 후 대각선 인수분해로 일차 인수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.5

### 발문

방정식 \$x^3=-1\$의 한 허근을 \$u\$라고 할 때, 다음 중 옳은 것을 모두 고른 것은? (단, \$\\overline{u}\$는 \$u\$의 켤레복소수이다.) \<보기\> ㄱ. \$u^2-u+1=0\$ ㄴ. \$u^2=\\dfrac{1}{u}\$ ㄷ. \$\\dfrac{1}{u+1}+\\dfrac{1}{\\overline{u}+1}=-1\$

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

①

### 해설

\$x^3+1=(x+1)(x^2-x+1)=0\$의 허근이 \$u\$이므로 \$u^3=-1\$, \$u^2-u+1=0\$이고 근과 계수의 관계에 의해 \$u+\\overline{u}=1\$, \$u\\overline{u}=1\$이다.

- ㄱ. \$u^2-u+1=0\$이므로 참이다.  
- ㄴ. \$u^3=-1\$을 \$u\$로 나누면 \$u^2=-\\dfrac{1}{u}\$이므로 거짓이다.  
- ㄷ. \$\\dfrac{1}{u+1}+\\dfrac{1}{\\overline{u}+1} \= \\dfrac{u+\\overline{u}+2}{u\\overline{u}+u+\\overline{u}+1} \= \\dfrac{1+2}{1+1+1} \= 1\\ne \-1\$이므로 거짓이다. 따라서 옳은 것은 ㄱ뿐이다.

```
{"status": "EXEMPT", "reason": "x^3=-1의 허근 u의 관계식과 켤레복소수 분수식 값을 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$x^3+1=(x+1)(x^2-x+1)=0$에서 $u^3=-1, u^2-u+1=0$, $u+\\overline{u}=1, u\\overline{u}=1$을 이용해 ㄱ, ㄴ, ㄷ을 판별한다.", "decisiveStep": "ㄷ을 통분해 $\\frac{u+\\overline{u}+2}{u\\overline{u}+u+\\overline{u}+1}=1$임을 계산해 $-1$이 아님을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): x^3+1=0의 허근 성질과 켤레복소수 관계를 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식 $x^3=-1$의 허근 성질과 켤레근 통분 계산을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "한 허근을 $u$라고 할 때"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "방정식", "src": "stem", "quote": "방정식 $x^3=-1$"}], "condition": [{"term": "켤레복소수", "src": "stem", "quote": "켤레복소수이다"}]}, "reasons": {"method": "x^3=-1 인수분해와 근과 계수의 관계로 u의 성질 참거짓을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.6

### 발문

\$x\$에 대한 삼차방정식 \$x^3-ax^2+(a+2)x-a^2-2a=0\$의 서로 다른 실근의 개수를 \$f(a)\$라 할 때, \$f(-3)+f(-2)+f(-1)+f(0)+f(1)\$의 값으로 알맞은 것은?

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$

### 정답

③

### 해설

주어진 삼차식을 인수분해하면 \$\$ \\begin{aligned} x^3-ax^2+(a+2)x-a(a+2) &= x^2(x-a)+(a+2)(x-a) \\ &= (x-a)(x^2+a+2) \= 0 \\end{aligned} \$\$

- \$a=-3\$일 때 \$(x+3)(x^2-1)=0\$이므로 실근은 \$-3, \-1, 1\$로 \$f(-3)=3\$이다.  
- \$a=-2\$일 때 \$(x+2)x^2=0\$이므로 실근은 \$-2, 0\$으로 \$f(-2)=2\$이다.  
- \$a=-1, 0, 1\$일 때 \$a+2\>0\$이므로 \$x^2+a+2=0\$은 허근을 갖고 실근은 \$x=a\$뿐이다. 즉 \$f(-1)=f(0)=f(1)=1\$이다. 따라서 \$f(-3)+f(-2)+f(-1)+f(0)+f(1)=3+2+1+1+1=8\$이다.

```
{"status": "EXEMPT", "reason": "매개변수 포함 삼차방정식을 인수분해하여 a 값별 실근 개수를 세는 순수 방정식 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "삼차식을 $(x-a)(x^2+a+2)=0$으로 인수분해한 뒤 $a+2$의 부호에 따라 $x^2+a+2=0$의 실근 개수를 판정한다.", "decisiveStep": "$a=-3$일 때 3개, $a=-2$일 때 중근 $0$ 포함 2개, $a\\ge -1$일 때 1개로 분류한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039(DIRECT_ACTIVE): 삼차방정식 인수분해 후 근의 개수에 따른 경우를 분류함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수분해 후 매개변수 값에 따른 이차인수의 실근 개수와 중근 여부를 판정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "서로 다른 실근의 개수를 $f(a)$"}], "method": [{"term": "인수분해", "src": "solution", "quote": "삼차식을 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-ax^2+(a+2)x-a^2-2a=0$"}], "condition": []}, "reasons": {"method": "삼차식을 (x-a)(x^2+a+2)=0으로 인수분해해 a별 실근 개수를 셈"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.7

### 발문

두 이차다항식 \$P(x)\$, \$Q(x)\$가 다음 조건을 만족시킨다. (가) 모든 실수 \$x\$에 대하여 \$P(x)+Q(x)=0\$ (나) \$P(x)Q(x)\$는 \$x^2-4\$로 나누어떨어진다. \$P(0)=4\$일 때, \$Q(3)\$의 값으로 알맞은 것은?

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

②

### 해설

조건 (가)에서 \$Q(x)=-P(x)\$이므로 \$P(x)Q(x)=-{P(x)}^2\$이다. 조건 (나)에서 \$-{P(x)}^2\$이 \$x^2-4=(x-2)(x+2)\$로 나누어떨어지므로 \$P(2)=P(-2)=0\$이다. \$P(x)\$는 이차다항식이므로 \$P(x)=c(x-2)(x+2)=c(x^2-4)\$로 놓을 수 있다. \$P(0)=-4c=4\$에서 \$c=-1\$이므로 \$P(x)=-(x^2-4)\$, 따라서 \$Q(x)=-P(x)=x^2-4\$이다. 그러므로 \$Q(3)=3^2-4=5\$이다.

```
{"status": "EXEMPT", "reason": "다항식 항등식과 인수정리로 이차다항식 P(x), Q(x)를 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$Q(x)=-P(x)$를 조건 (나)에 대입해 $-\\{P(x)\\}^2$이 $x^2-4$로 나누어떨어짐을 보이고 $P(x)=c(x^2-4)$를 결정한다.", "decisiveStep": "$P(x)Q(x)=-\\{P(x)\\}^2$이 $(x-2)(x+2)$의 배수이면 $P(2)=P(-2)=0$이 됨을 도출한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "인수 판정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-011(RPM_ONLY): 다항식 나눗셈 배수 조건으로 인수정리를 적용하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 항등식 소거와 제곱식 나눗셈의 인수정리를 결합해 이차식을 확정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 이차다항식 $P(x)$, $Q(x)$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "$P(2)=P(-2)=0$이다", "evidenceType": "IMPLIED", "justification": "-{P(x)}^2이 x^2-4로 나누어떨어지는 조건에서 P(±2)=0을 도출함"}], "given": [{"term": "항등식", "src": "stem", "quote": "모든 실수 $x$에 대하여 $P(x)+Q(x)=0$"}], "condition": []}, "reasons": {"method": "Q=-P 대입 후 인수정리로 P(x)=c(x^2-4)를 세워 Q(3)을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q09

- 형식: 객관식  
- 배점: 4.8

### 발문

다항식 \$1+x+2x^2+3x^3+\\cdots+12x^{12}\$을 \$x-1\$로 나누었을 때의 몫을 \$Q(x)\$라 하자. \$Q(x)\$를 \$x+1\$로 나누었을 때의 나머지로 알맞은 것은?

### 선지

① \$32\$ ② \$33\$ ③ \$34\$ ④ \$35\$ ⑤ \$36\$

### 정답

⑤

### 해설

\$S(x)=1+x+2x^2+3x^3+\\cdots+12x^{12}\$이라 두면 나눗셈 항등식은 \$\$ S(x) \= (x-1)Q(x)+S(1) \$\$ 여기서 \$S(1)=1+(1+2+3+\\cdots+12)=1+78=79\$이다. \$Q(x)\$를 \$x+1\$로 나눈 나머지는 \$Q(-1)\$이므로 양변에 \$x=-1\$을 대입하면 \$\$ S(-1) \= 1+(-1+2)+(-3+4)+\\cdots+(-11+12) \= 1+6\\cdot 1 \= 7 \$\$ 따라서 \$7=(-2)Q(-1)+79 \\implies 2Q(-1)=72 \\implies Q(-1)=36\$이다.

```
{"status": "EXEMPT", "reason": "나눗셈 항등식에 x=1과 x=-1을 대입하여 몫 Q(x)의 나머지 Q(-1)을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "나눗셈 항등식 $S(x)=(x-1)Q(x)+S(1)$에 $x=1$과 $x=-1$을 대입해 $Q(-1)$을 구한다.", "decisiveStep": "$S(1)=79$와 교대합 $S(-1)=7$을 나눗셈 항등식에 대입해 $Q(-1)=36$을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): 나눗셈 항등식에 x=1, -1을 대입해 Q(-1)을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "고차다항식의 나눗셈 항등식에서 몫 $Q(x)$를 직접 구하지 않고 수치대입으로 $Q(-1)$을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지로"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "양변에 $x=-1$을 대입하면", "evidenceType": "IMPLIED", "justification": "나눗셈 항등식에 x=1, -1을 대입하여 몫의 함숫값 Q(-1)을 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $1+x+2x^2+3x^3+\\cdots+12x^{12}$"}], "condition": [{"term": "나머지정리", "src": "solution", "quote": "S(x) = (x-1)Q(x)+S(1)"}]}, "reasons": {"method": "나눗셈 항등식에 x=1, -1을 대입해 몫의 나머지 Q(-1)을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.2

### 발문

다음 중 옳은 것은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$\\dfrac{1}{3-i}\$의 실수부분은 \$\\dfrac{1}{3}\$이다. ② \$2-\\sqrt{5}i\$의 허수부분은 \$\\sqrt{5}\$이다. ③ \$\\dfrac{\\sqrt{6}}{\\sqrt{-2}}=-\\sqrt{3}\$이다. ④ \$\\sqrt{-3}\\sqrt{-12}=-6\$이다. ⑤ \$a=0\$이면 \$a+bi\$는 순허수이다. (단, \$a, b\$는 실수)

### 정답

④

### 해설

- ① \$\\dfrac{1}{3-i}=\\dfrac{3+i}{10}\$이므로 실수부분은 \$\\dfrac{3}{10}\$이다. (거짓)  
- ② \$2-\\sqrt{5}i\$의 허수부분은 \$-\\sqrt{5}\$이다. (거짓)  
- ③ \$\\dfrac{\\sqrt{6}}{\\sqrt{-2}}=\\dfrac{\\sqrt{6}}{\\sqrt{2}i}=-\\sqrt{3}i\$이다. (거짓)  
- ④ \$\\sqrt{-3}\\sqrt{-12}=(\\sqrt{3}i)(2\\sqrt{3}i)=6i^2=-6\$이다. (참)  
- ⑤ \$a=0, b=0\$이면 \$a+bi=0\$은 실수이므로 거짓이다. 따라서 옳은 것은 ④이다.

```
{"status": "EXEMPT", "reason": "복소수의 실수부·허수부 정의와 음수의 제곱근 계산의 정오를 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "복소수 실수부·허수부 정의, 순허수 조건($b\\ne 0$), 음수의 제곱근 곱·나눗셈 성질을 각각 검증한다.", "decisiveStep": "$\\sqrt{-3}\\sqrt{-12}=(\\sqrt{3}i)(2\\sqrt{3}i)=-6$이 참임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 복소수 정의, 순허수 조건, 음수 제곱근 성질을 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 기본 정의와 음수 제곱근 연산의 부호 실수를 점검하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수부분", "src": "solution", "quote": "실수부분은 $\\dfrac{3}{10}$"}], "method": [{"term": "제곱근", "src": "solution", "quote": "(\\sqrt{3}i)(2\\sqrt{3}i)=6i^2=-6", "evidenceType": "IMPLIED", "justification": "음수의 제곱근을 허수단위 i로 바꾸어 곱셈을 계산함"}], "given": [{"term": "실수부분", "src": "solution", "quote": "실수부분은 $\\dfrac{3}{10}$"}], "condition": []}, "reasons": {"method": "음수의 제곱근과 복소수 기본 개념의 정오를 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.7

### 발문

\$x=\\dfrac{2}{1+\\sqrt{3}i}\$일 때, \$4x^3-4x^2+6x-1\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-\\sqrt{3}i\$ ② \$\\sqrt{3}i\$ ③ \$-i\$ ④ \$i\$ ⑤ \$2i\$

### 정답

①

### 해설

분모를 실수화하면 \$\$ x \= \\frac{2(1-\\sqrt{3}i)}{(1+\\sqrt{3}i)(1-\\sqrt{3}i)} \= \\frac{2(1-\\sqrt{3}i)}{4} \= \\frac{1-\\sqrt{3}i}{2} \$\$ \$2x-1=-\\sqrt{3}i\$의 양변을 제곱하면 \$4x^2-4x+1=-3\$, 즉 \$x^2-x+1=0\$이다. 따라서 \$x^2=x-1\$이고 \$x^3=x^2-x=(x-1)-x=-1\$이다. 주어진 식에 대입하면 \$\$ 4x^3-4x^2+6x-1 \= 4(-1)-4(x-1)+6x-1 \= 2x-1 \= \-\\sqrt{3}i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수 근이 만족하는 이차방정식을 세워 삼차식의 차수를 낮추어 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$x=\\frac{1-\\sqrt{3}i}{2}$에서 $x^2-x+1=0$($x^3=-1$)을 유도해 삼차식을 일차식 $2x-1$로 차수를 낮추어 계산한다.", "decisiveStep": "$2x-1=-\\sqrt{3}i$ 제곱으로 $x^2-x+1=0$을 얻어 $4x^3-4x^2+6x-1$을 $2x-1$로 단순화한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): 복소수 x에서 이차식 x^2-x+1=0을 유도해 삼차식 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분모 실수화 후 허수 부분을 분리 제곱하여 차수를 낮추는 식의 값 계산 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "solution", "quote": "x^2-x+1=0"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "(1+\\sqrt{3}i)(1-\\sqrt{3}i)", "evidenceType": "IMPLIED", "justification": "분모의 켤레복소수를 곱해 실수화한 뒤 이차방정식으로 차수를 낮춤"}], "given": [{"term": "허수", "src": "stem", "quote": "i=\\sqrt{-1}"}], "condition": []}, "reasons": {"method": "분모 실수화 후 x^2-x+1=0을 유도해 삼차식의 차수를 낮추어 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.4

### 발문

\$0\$이 아닌 복소수 \$z\$에 대하여 다음 \<보기\> 중 항상 실수인 것만을 있는 대로 고른 것은? (단, \$\\overline{z}\$는 \$z\$의 켤레복소수) \<보기\> ㄱ. \$z-\\overline{z}\$ ㄴ. \$z\\overline{z}\$ ㄷ. \$(z+\\overline{z})^2\$ ㄹ. \$z^2-\\overline{z}^2\$ ㅁ. \$\\dfrac{1}{z}+\\dfrac{1}{\\overline{z}}\$

### 선지

① ㄱ, ㄴ, ㄷ ② ㄱ, ㄷ, ㄹ ③ ㄴ, ㄷ, ㅁ ④ ㄴ, ㄷ, ㄹ ⑤ ㄴ, ㄹ, ㅁ

### 정답

③

### 해설

\$z=a+bi\$ (\$a, b\$는 실수, \$a^2+b^2\\ne 0\$)라 하면 \$\\overline{z}=a-bi\$이다.

- ㄱ. \$z-\\overline{z}=2bi\$ (\$b\\ne 0\$이면 순허수)  
- ㄴ. \$z\\overline{z}=a^2+b^2\$ (항상 실수)  
- ㄷ. \$(z+\\overline{z})^2=(2a)^2=4a^2\$ (항상 실수)  
- ㄹ. \$z^2-\\overline{z}^2=4abi\$ (\$ab\\ne 0\$이면 순허수)  
- ㅁ. \$\\dfrac{1}{z}+\\dfrac{1}{\\overline{z}}=\\dfrac{z+\\overline{z}}{z\\overline{z}}=\\dfrac{2a}{a^2+b^2}\$ (항상 실수) 따라서 항상 실수인 것은 ㄴ, ㄷ, ㅁ이다.

```
{"status": "EXEMPT", "reason": "복소수 z=a+bi와 켤레복소수의 연산 결과가 항상 실수인지 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=a+bi$와 $\\overline{z}=a-bi$를 다섯 식에 대입해 허수부분이 사라지는 식을 찾는다.", "decisiveStep": "ㄱ과 ㄹ은 $2bi, 4abi$로 허수부분이 남고 ㄴ, ㄷ, ㅁ만 실수임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): z=a+bi 대입으로 켤레복소수 연산이 실수가 되는 식을 찾음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 $z$와 $\\overline{z}$의 합·곱·제곱·역수의 합 중 항상 실수인 것을 고르는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "항상 실수인 것만을"}], "method": [{"term": "켤레복소수", "src": "stem", "quote": "\\overline{z}$는 $z$의 켤레복소수", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "stem", "quote": "$0$이 아닌 복소수 $z$"}], "condition": []}, "reasons": {"method": "z=a+bi와 켤레복소수를 대입해 허수부가 소거되는 식을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 3.7

### 발문

\$f(x)=x^2-2x+9\$일 때, 이차방정식 \$f(2x+1)=0\$의 두 근의 곱은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

⑤

### 해설

\$f(x)=x^2-2x+9\$에 \$x\$ 대신 \$2x+1\$을 대입하면 \$\$ \\begin{aligned} f(2x+1) &= (2x+1)^2-2(2x+1)+9 \\ &= (4x^2+4x+1)-(4x+2)+9 \\ &= 4x^2+8 \= 0 \\end{aligned} \$\$ 따라서 이차방정식 \$4x^2+8=0\$에서 근과 계수의 관계에 의해 두 근의 곱은 \$\\dfrac{8}{4}=2\$이다.

```
{"status": "EXEMPT", "reason": "합성식 f(2x+1)=0을 전개한 뒤 근과 계수의 관계로 두 근의 곱을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$f(2x+1)=(2x+1)^2-2(2x+1)+9=4x^2+8=0$으로 정리한 뒤 근과 계수의 관계로 두 근의 곱을 구한다.", "decisiveStep": "$f(2x+1)=4x^2+8=0$의 상수항과 최고차항 계수의 비 $8/4=2$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 합성방정식 f(2x+1)=0을 정리해 근과 계수의 관계를 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식에 일차식을 대입해 전개한 뒤 근과 계수의 관계를 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱", "src": "stem", "quote": "두 근의 곱은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $f(2x+1)=0$"}], "condition": []}, "reasons": {"method": "f(2x+1)을 전개하고 근과 계수의 관계로 두 근의 곱을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q14

- 형식: 객관식  
- 배점: 3.8

### 발문

이차식 \$2x^2+6x+5\$를 복소수의 범위에서 인수분해하면?

### 선지

① \$2\\left(x+\\dfrac{3+i}{2}\\right)\\left(x-\\dfrac{3-i}{2}\\right)\$ ② \$2\\left(x+\\dfrac{3+i}{2}\\right)\\left(x+\\dfrac{3-i}{2}\\right)\$ ③ \$2\\left(x-\\dfrac{3+i}{2}\\right)\\left(x-\\dfrac{3-i}{2}\\right)\$ ④ \$\\left(x+\\dfrac{3+i}{2}\\right)\\left(x+\\dfrac{3-i}{2}\\right)\$ ⑤ \$4\\left(x+\\dfrac{3+i}{2}\\right)\\left(x+\\dfrac{3-i}{2}\\right)\$

### 정답

②

### 해설

이차방정식 \$2x^2+6x+5=0\$의 두 근을 근의 공식으로 구하면 \$\$ x \= \\frac{-3\\pm\\sqrt{3^2-2\\cdot 5}}{2} \= \\frac{-3\\pm i}{2} \$\$ 최고차항의 계수가 \$2\$이므로 복소수 범위에서 인수분해하면 \$\$ 2x^2+6x+5 \= 2\\left(x-\\frac{-3+i}{2}\\right)\\left(x-\\frac{-3-i}{2}\\right) \= 2\\left(x+\\frac{3-i}{2}\\right)\\left(x+\\frac{3+i}{2}\\right) \$\$ 이다.

```
{"status": "EXEMPT", "reason": "근의 공식으로 두 허근을 구해 이차식을 복소수 범위에서 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-QUADRATIC_SOLVING", "conceptClusterKey": null, "primaryMethod": "$2x^2+6x+5=0$의 두 허근 $\\frac{-3\\pm i}{2}$를 근의 공식으로 구한 뒤 최고차항 계수 $2$를 붙여 인수분해한다.", "decisiveStep": "최고차항 계수 $2$를 빠뜨리지 않고 부호 $x-\\alpha$를 정확히 정리한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "인수분해·근의 공식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-027(RPM_ONLY): 이차방정식의 두 허근을 구해 복소수 범위에서 인수분해하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근의 공식을 이용해 이차식을 복소수 범위의 두 일차식의 곱으로 인수분해하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "복소수의 범위에서 인수분해하면?"}], "method": [{"term": "근의공식", "src": "solution", "quote": "근의 공식으로 구하면", "evidenceType": "NAMED"}], "given": [{"term": "이차식", "src": "stem", "quote": "이차식 $2x^2+6x+5$"}], "condition": [{"term": "복소수", "src": "stem", "quote": "복소수의 범위에서"}]}, "reasons": {"method": "근의 공식으로 두 허근을 구하고 최고차항 계수 2를 붙여 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q15

- 형식: 객관식  
- 배점: 4.5

### 발문

이차방정식 \$x^2-2x+5=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라고 할 때, \$\\dfrac{1}{\\alpha^2-3\\alpha+7}+\\dfrac{1}{\\beta^2-3\\beta+7}\$의 값은?

### 선지

① \$\\dfrac{1}{5}\$ ② \$\\dfrac{3}{10}\$ ③ \$\\dfrac{1}{3}\$ ④ \$\\dfrac{2}{5}\$ ⑤ \$\\dfrac{1}{2}\$

### 정답

④

### 해설

\$lpha, \\beta\$가 \$x^2-2x+5=0\$의 두 근이므로 \$\\alpha^2=2\\alpha-5\$, \$\\beta^2=2\\beta-5\$이다. 따라서 각 분모를 일차식으로 낮추면 \$\$ \\alpha^2-3\\alpha+7 \= (2\\alpha-5)-3\\alpha+7 \= 2-\\alpha, \\qquad \\beta^2-3\\beta+7 \= 2-\\beta \$\$ 한편 근과 계수의 관계에 의하여 \$\\alpha+\\beta=2\$, \$\\alpha\\beta=5\$이므로 통분하면 \$\$ \\frac{1}{2-\\alpha}+\\frac{1}{2-\\beta} \= \\frac{4-(\\alpha+\\beta)}{4-2(\\alpha+\\beta)+\\alpha\\beta} \= \\frac{4-2}{4-4+5} \= \\frac{2}{5} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차방정식 근의 대입으로 분모 차수를 낮춘 뒤 근과 계수의 관계로 통분 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha^2=2\\alpha-5$를 대입해 분모를 $2-\\alpha, 2-\\beta$로 낮춘 뒤 통분하여 근과 계수의 관계 $\\alpha+\\beta=2, \\alpha\\beta=5$를 대입한다.", "decisiveStep": "이차식 분모 $\\alpha^2-3\\alpha+7$을 방정식 대입으로 $2-\\alpha$로 낮추는 차수 축소가 핵심이다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 이차방정식 차수 낮추기 후 통분식에 근과 계수의 관계를 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "방정식의 근을 이용한 차수 축소와 통분 후 근과 계수의 관계 대입을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "4-(\\alpha+\\beta)"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2x+5=0$"}], "condition": []}, "reasons": {"method": "방정식 대입으로 분모 차수를 일차로 낮춘 뒤 근과 계수의 관계로 통분 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q16

- 형식: 객관식  
- 배점: 4.3

### 발문

이차방정식 \$x^2-(2k+4)x+2k+3=0\$의 두 근의 차가 \$4\$일 때, 모든 실수 \$k\$의 값의 합을 구하면?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

①

### 해설

두 근을 \$\\alpha, \\beta\$라 하면 근과 계수의 관계에 의하여 \$\\alpha+\\beta=2k+4\$, \$\\alpha\\beta=2k+3\$이다. 두 근의 차가 \$4\$이므로 \$(\\alpha-\\beta)^2=16\$, 즉 판별식 \$D=16\$이다. \$\$ \\begin{aligned} D &= (2k+4)^2-4(2k+3) \= 4k^2+8k+4 \= 16 \\ 4k^2+8k-12 &= 0 \\implies k^2+2k-3 \= 0 \\implies (k+3)(k-1) \= 0 \\end{aligned} \$\$ 따라서 \$k=-3\$ 또는 \$k=1\$이므로 모든 실수 \$k\$의 값의 합은 \$-3+1=-2\$이다.

```
{"status": "EXEMPT", "reason": "두 근의 차 조건을 판별식 D=16으로 세워 이차방정식을 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "최고차항 계수가 $1$인 이차방정식에서 $(\\alpha-\\beta)^2=D=4^2$을 세워 $k^2+2k-3=0$의 두 근 합을 구한다.", "decisiveStep": "두 근의 차 $4$가 $D=16$과 같음을 이용해 $4k^2+8k+4=16$을 푼다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 두 근의 차 조건을 근과 계수의 관계(판별식)로 풀어 k를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근의 차와 판별식($(\\alpha-\\beta)^2=D$)의 관계를 이용해 미지수 $k$의 합을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "stem", "quote": "값의 합을 구하면?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=16$", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-(2k+4)x+2k+3=0$"}], "condition": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여"}]}, "reasons": {"method": "두 근의 차 제곱이 판별식과 같음을 이용해 k의 이차방정식을 푼다"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q17

- 형식: 객관식  
- 배점: 5.2

### 발문

\$1\\le x\\le 3\$에서 이차함수 \$f(x)=-x^2+4ax+2a-8\$의 최댓값이 \$4\$일 때, 실수 \$a\$의 값의 합은?

### 선지

① \$1\$ ② \$\\dfrac{3}{2}\$ ③ \$2\$ ④ \$\\dfrac{5}{2}\$ ⑤ \$3\$

### 정답

②

### 해설

\$f(x)=-(x-2a)^2+4a^2+2a-8\$이므로 위로 볼록하고 꼭짓점의 \$x\$좌표는 \$2a\$이다.

- (1) \$2a\<1\$ (\$a\<\\dfrac{1}{2}\$)일 때: 최댓값은 \$f(1)=6a-9=4 \\implies a=\\dfrac{13}{6}\$ (범위에 속하지 않는다.)  
- (2) \$1\\le 2a\\le 3\$ (\$\\dfrac{1}{2}\\le a\\le\\dfrac{3}{2}\$)일 때: 최댓값은 꼭짓점의 \$y\$좌표이므로 \$\$4a^2+2a-8=4 \\implies 2a^2+a-6=(2a-3)(a+2)=0\$\$ 범위에 속하는 값은 \$a=\\dfrac{3}{2}\$이다.  
- (3) \$2a\>3\$ (\$a\>\\dfrac{3}{2}\$)일 때: 최댓값은 \$f(3)=14a-17=4 \\implies a=\\dfrac{3}{2}\$ (범위 \$a\>\\frac{3}{2}\$에 속하지 않는다.) 따라서 조건을 만족하는 실수 \$a\$는 \$\\dfrac{3}{2}\$뿐이므로 합도 \$\\dfrac{3}{2}\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [0, 4], "viewport": [0, 4, -6, 6], "pieces": [{"domain": [0, 4], "coefficients": ["-5", "6", "-1"]}], "requiredPoints": [{"id": "V", "x": "3", "y": "4", "label": "최댓값(3, 4)"}, {"id": "L", "x": "1", "y": "0", "label": "(1, 0)"}]}, "caption": "a=3/2일 때 구간 [1, 3]에서 f(x)=-x^2+6x-5의 최댓값 4"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "대칭축 $x=2a$의 위치를 구간 $[1,3]$의 왼쪽, 내부, 오른쪽 3가지로 나누어 최댓값 $4$가 되는 $a$를 찾고 범위 적합성을 판정한다.", "decisiveStep": "각 경우에서 구한 해 $\\frac{13}{6}, \\frac{3}{2}, -2$ 중 해당 구간 조건을 만족하는 $a=\\frac{3}{2}$만 채택한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 대칭축 x=2a와 구간 [1, 3]의 위치 관계별 최댓값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "매개변수 축 위치에 따른 3가지 경우 분류와 각 구간의 범위 부등식 검증이 필수인 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값이 $4$일 때"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-(x-2a)^2+4a^2+2a-8", "evidenceType": "IMPLIED", "justification": "대칭축 x=2a를 구해 구간과의 위치 관계를 분류하기 위해 완전제곱식으로 변형함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=-x^2+4ax+2a-8$"}], "condition": [{"term": "꼭짓점", "src": "solution", "quote": "꼭짓점의 $x$좌표는 $2a$"}]}, "reasons": {"method": "대칭축 2a와 구간 [1,3]의 위치 관계 3가지로 나누어 가능한 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 5.2

### 발문

\$(0, 4)\$를 지나는 직선 \$y=ax+b\$에 대하여 이차함수 \$f(x)=-x^2+2x+3\$과 한 점에서 접하고, \$g(x)=x^2+6x+9\$와 서로 다른 두 점에서 만날 때, \$a+b\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

④

### 해설

직선 \$y=ax+b\$가 \$(0, 4)\$를 지나므로 \$b=4\$이다. 직선 \$y=ax+4\$가 \$f(x)=-x^2+2x+3\$과 접하므로 \$-x^2+2x+3=ax+4\$, 즉 \$x^2+(a-2)x+1=0\$의 판별식 \$D\_1=0\$이다. \$\$ D\_1 \= (a-2)^2-4 \= 0 \\implies a-2 \= \\pm 2 \\implies a=0 \\text{ 또는 } a=4 \$\$ 또한 \$y=ax+4\$가 \$g(x)=x^2+6x+9\$와 서로 다른 두 점에서 만나므로 \$x^2+(6-a)x+5=0\$의 판별식 \$D\_2\>0\$이어야 한다. \$\$ D\_2 \= (6-a)^2-20 \> 0 \$\$

- \$a=0\$이면 \$D\_2=36-20=16\>0\$ (성립)  
- \$a=4\$이면 \$D\_2=4-20=-16\<0\$ (불가) 따라서 \$a=0\$, \$b=4\$이므로 \$a+b=4\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-6, 4], "viewport": [-6, 4, -2, 10], "pieces": [{"domain": [-6, 4], "coefficients": ["3", "2", "-1"]}], "referenceCurves": [{"coefficients": ["9", "6", "1"], "label": "g(x)"}], "referenceLines": [{"slope": "0", "intercept": "4", "label": "y=4"}], "requiredPoints": [{"id": "T", "x": "1", "y": "4", "label": "접점(1, 4)"}]}, "caption": "직선 y=4가 f(x)=-x^2+2x+3에 접하고 g(x)=x^2+6x+9와 두 점에서 만나는 모습"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$(0,4)$ 대입으로 $b=4$를 구한 뒤, $f$와의 접선 조건 $D_1=0$으로 $a=0, 4$를 얻고 $g$와의 교점 조건 $D_2>0$으로 $a=0$을 선택한다.", "decisiveStep": "두 번째 판별식 $(6-a)^2-20>0$에 $a=0, 4$를 대입해 $a=4$를 탈락시킨다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 이차함수와 직선의 접선 조건 D=0과 판별식을 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선과 두 이차함수의 접선($D=0$)·두 교점($D>0$) 조건을 연쇄 판별하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "교점", "src": "solution", "quote": "서로 다른 두 점에서 만나므로"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D_1=0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=-x^2+2x+3$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=ax+b$"}], "condition": [{"term": "실근", "src": "solution", "quote": "D_2 = (6-a)^2-20 > 0"}]}, "reasons": {"method": "f와의 접선 조건 D_1=0과 g와의 교점 조건 D_2>0을 연립해 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 3

### 발문

삼차방정식 \$x^3-2x^2+3x-1=0\$의 세 근을 \$\\alpha\$, \$\\beta\$, \$\\gamma\$라 할 때, \$\\dfrac{1}{\\alpha}\$, \$\\dfrac{1}{\\beta}\$, \$\\dfrac{1}{\\gamma}\$를 세 근으로 하고 \$x^3\$의 계수가 \$1\$인 삼차방정식을 구하시오.

### 선지

없음

### 정답

\$x^3-3x^2+2x-1=0\$

### 해설

상수항이 \$-1\\ne 0\$이므로 \$\\alpha, \\beta, \\gamma\$는 모두 \$0\$이 아니다. 원래 방정식의 근을 \$t\$라 하면 \$t^3-2t^2+3t-1=0\$이 성립한다. 새 방정식의 근을 \$x=\\dfrac{1}{t}\$이라 두면 \$t=\\dfrac{1}{x}\$이므로 대입하면 \$\$ \\frac{1}{x^3}-\\frac{2}{x^2}+\\frac{3}{x}-1 \= 0 \$\$ 양변에 \$-x^3\$을 곱하여 정리하면 구하는 삼차방정식은 \$\$ x^3-3x^2+2x-1 \= 0 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 역수근 변환 t=1/x 대입으로 새 방정식을 구하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "원래 방정식에 $t=1/x$을 대입하고 양변에 $-x^3$을 곱해 역수근을 갖는 최고차항 계수 $1$인 삼차방정식을 구한다.", "decisiveStep": "$t=1/x$ 치환 대입으로 계수의 순서를 거꾸로 뒤집어 방정식을 바로 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY): 삼차방정식의 역수근 방정식을 t=1/x 치환으로 구하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식의 역수근 방정식을 치환 $t=1/x$로 구하는 서술형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식을 구하시오"}], "method": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-2x^2+3x-1=0$", "evidenceType": "IMPLIED", "justification": "근의 역수 변환 t=1/x를 방정식에 대입해 역수근 방정식을 구함"}], "given": [{"term": "계수", "src": "stem", "quote": "$x^3$의 계수가 $1$인"}], "condition": []}, "reasons": {"method": "t=1/x 변환 대입으로 역수근을 갖는 삼차방정식을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q20

- 형식: 서답형  
- 배점: 7

### 발문

삼차방정식 \$x^3-2x^2-2x-3=0\$의 한 허근을 \$w\$라고 할 때, 다음 물음에 답하시오. (1) \$w^{2024}+w^{2023}+w^{2022}+\\cdots+w^2+w+1\$의 값을 구하시오. \[3점\] (2) 계수가 실수인 이차식 \$f(x)\$가 다음 조건을 만족시킬 때, \$f(x)\$를 구하시오. \[4점\] (가) \$\\overline{w}f(w)=2\$ (나) \$f(0)=2\$

### 선지

없음

### 정답

(1) \$0\$, (2) \$f(x)=2x^2+4x+2\$

### 해설

주어진 삼차식을 인수분해하면 \$x^3-2x^2-2x-3=(x-3)(x^2+x+1)=0\$이므로 허근 \$w\$는 \$w^2+w+1=0\$, \$w^3=1\$을 만족한다. (1) 항의 개수는 \$2025\$개이고 \$2025=3\\times 675\$이므로 연속한 세 항씩 묶으면 모두 \$1+w+w^2=0\$이 되어 전체 합은 \$0\$이다. (2) \$w\$의 켤레복소수 \$\\overline{w}=w^2\$이므로 조건 (가)는 \$w^2f(w)=2\$이다. 양변에 \$w\$를 곱하면 \$w^3f(w)=f(w)=2w\$이다. \$f(x)=Ax^2+Bx+C\$ (\$A, B, C\$는 실수, \$A\\ne 0\$)라 두면 조건 (나)에서 \$C=2\$이다. \$Aw^2+Bw+2=2w\$에 \$w^2=-w-1\$을 대입하면 \$\$ A(-w-1)+(B-2)w+2 \= (B-A-2)w+(2-A) \= 0 \$\$ \$w\$가 허수이고 \$A, B\$가 실수이므로 \$2-A=0\$, \$B-A-2=0\$에서 \$A=2\$, \$B=4\$이다. 따라서 \$f(x)=2x^2+4x+2\$이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 허근 w의 주기 3 성질과 복소수 상등 조건으로 이차식 f(x)를 구하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "삼차식을 $(x-3)(x^2+x+1)=0$으로 인수분해해 $w^3=1, w^2+w+1=0$을 얻고, $\\overline{w}=w^2$을 이용해 $f(w)=2w$에서 실계수 항등식으로 $f(x)$를 구한다.", "decisiveStep": "$\\overline{w}f(w)=2$ 양변에 $w$를 곱해 $f(w)=2w$로 바꾼 뒤 $w^2=-w-1$ 대입과 복소수 상등 조건을 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040(DIRECT_ACTIVE): x^3=1의 허근 성질과 켤레근 조건으로 이차식 f(x)를 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허근 $w$의 3주기 소거와 $\\overline{w}=w^2$ 변환을 통한 실계수 이차식 결정을 결합한 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차식", "src": "stem", "quote": "이차식 $f(x)$가"}], "method": [{"term": "인수분해", "src": "solution", "quote": "삼차식을 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-2x^2-2x-3=0$"}], "condition": [{"term": "허근", "src": "stem", "quote": "한 허근을 $w$"}]}, "reasons": {"method": "삼차식 인수분해로 w^3=1을 얻고 켤레변환과 복소수 상등으로 f(x)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

두 실수 \$a\$, \$b\$에 대하여 \$\\dfrac{1}{i}+\\dfrac{2}{i^2}+\\dfrac{3}{i^3}+\\dfrac{4}{i^4}+\\cdots+\\dfrac{101}{i^{101}}=a+bi\$일 때, \$a-b\$의 값을 구하시오. (단, \$i=\\sqrt{-1}\$)

### 선지

없음

### 정답

\$101\$

### 해설

\$i^4=1\$이므로 연속한 네 항씩 묶어 계산하면 \$\$ \\frac{4m+1}{i^{4m+1}}+\\frac{4m+2}{i^{4m+2}}+\\frac{4m+3}{i^{4m+3}}+\\frac{4m+4}{i^{4m+4}} \= \-(4m+1)i-(4m+2)+(4m+3)i+(4m+4) \= 2+2i \$\$ \$101=4\\cdot 25+1\$이므로 처음 \$100\$개의 항은 \$25\$묶음의 합 \$25(2+2i)=50+50i\$이다. 마지막 항은 \$\\dfrac{101}{i^{101}}=\\dfrac{101}{i}=-101i\$이므로 전체 합은 \$\$ (50+50i)-101i \= 50-51i \$\$ 따라서 \$a=50\$, \$b=-51\$이므로 \$a-b=50-(-51)=101\$이다.

```
{"status": "EXEMPT", "reason": "i의 거듭제곱 주기 4에 따른 등차계수 합을 계산하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "연속한 네 항 $\\frac{4m+1}{i}+\\frac{4m+2}{i^2}+\\frac{4m+3}{i^3}+\\frac{4m+4}{i^4}=2+2i$의 규칙을 찾아 $25$묶음과 마지막 항을 합산한다.", "decisiveStep": "네 항씩 묶으면 $m$이 소거되어 항상 상수 $2+2i$가 됨을 보인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): i의 4주기성을 이용해 4항씩 묶어 합의 규칙을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허수단위 역수 거듭제곱의 4주기 규칙에서 연속 4항의 합이 일정함($2+2i$)을 이용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "두 실수 $a$, $b$에 대하여"}], "method": [{"term": "복소수", "src": "solution", "quote": "연속한 네 항씩 묶어", "evidenceType": "IMPLIED", "justification": "i^4=1의 주기성을 이용해 연속 4항의 합 2+2i를 반복 합산함"}], "given": [{"term": "합", "src": "solution", "quote": "전체 합은"}], "condition": []}, "reasons": {"method": "4항 묶음 합이 항상 2+2i임을 이용해 101항까지의 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 5

### 발문

이차함수 \$y=f(x)\$가 다음 조건을 모두 만족시킬 때, 함수 \$y=f(x)\$의 그래프와 \$x\$축의 교점의 좌표를 각각 \$(\\alpha, 0)\$, \$(\\beta, 0)\$이라 하자. 이때 \$\\alpha-\\beta\$의 값을 구하시오. (단, \$\\alpha\>\\beta\$) (가) 모든 실수 \$x\$에 대하여 \$f(3-x)=f(3+x)\$이다. (나) \$x\$의 값의 범위가 \$0\\le x\\le 5\$일 때, 함수 \$f(x)\$의 최댓값은 \$9\$, 최솟값은 \$0\$이다. (다) 이차함수 \$y=f(x)\$의 그래프와 직선 \$y=-2x+16\$은 접한다.

### 선지

없음

### 정답

\$6\$

### 해설

조건 (가)에서 대칭축이 \$x=3\$이므로 \$f(x)=a(x-3)^2+c\$라 두자. 구간 \$0\\le x\\le 5\$에서 꼭짓점 \$x=3\$이 구간 안에 있고, 축에서 더 먼 끝점은 \$x=0\$이다.

1) \$a\>0\$일 때: 최솟값은 \$c=0\$, 최댓값은 \$f(0)=9a=9 \\implies a=1\$이므로 \$f(x)=(x-3)^2\$이다. \$y=-2x+16\$과 연립하면 \$x^2-4x-7=0\$의 판별식 \$D/4=4+7=11\>0\$이므로 접하지 않아 조건 (다)에 모순이다.  
2) \$a\<0\$일 때: 최댓값은 \$c=9\$, 최솟값은 \$f(0)=9a+9=0 \\implies a=-1\$이므로 \$f(x)=-(x-3)^2+9=-x^2+6x\$이다. \$y=-2x+16\$과 연립하면 \$-x^2+6x=-2x+16 \\implies x^2-8x+16=(x-4)^2=0\$으로 중근을 가지므로 접한다. 따라서 \$f(x)=-(x-3)^2+9=0\$에서 \$x=0\$ 또는 \$x=6\$이므로 \$\\alpha=6, \\beta=0\$이고 \$\\alpha-\\beta=6\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-1, 7], "viewport": [-1, 7, -2, 12], "pieces": [{"domain": [-1, 7], "coefficients": ["0", "6", "-1"]}], "referenceLines": [{"slope": "-2", "intercept": "16", "label": "y=-2x+16"}], "requiredPoints": [{"id": "V", "x": "3", "y": "9", "label": "꼭짓점(3, 9)"}, {"id": "T", "x": "4", "y": "8", "label": "접점(4, 8)"}, {"id": "A", "x": "0", "y": "0", "label": "(0, 0)"}, {"id": "B", "x": "6", "y": "0", "label": "(6, 0)"}]}, "caption": "f(x)=-(x-3)^2+9와 접선 y=-2x+16 및 x축 교점 (0, 0), (6, 0)"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "대칭축 $x=3$과 구간 $[0,5]$의 최대·최소로 $a>0$과 $a<0$의 두 이차함수 후보를 구한 뒤 직선 $y=-2x+16$과의 접선 조건으로 $f(x)=-(x-3)^2+9$를 확정한다.", "decisiveStep": "$a>0$일 때 $D/4=11>0$으로 접하지 않음을 보이고 $a<0$일 때 $(x-4)^2=0$으로 접함을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 구간 [0, 5]의 최대·최소로 이차함수를 결정하고 접선 조건을 확인함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "선대칭 조건, 제한된 범위의 최대·최소, 최고차항 부호 분기, 직선과의 접선 판별을 결합한 고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "교점", "src": "stem", "quote": "$x$축의 교점의 좌표를"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D/4=4+7=11>0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=f(x)$가"}], "condition": [{"term": "축", "src": "solution", "quote": "대칭축이 $x=3$"}]}, "reasons": {"method": "대칭축과 구간 최대·최소로 두 후보를 세우고 접선 판별식으로 유일한 f(x)를 확정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

