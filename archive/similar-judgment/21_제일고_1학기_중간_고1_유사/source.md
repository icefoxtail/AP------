

```
{"stem": "21_제일고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/21_제일고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.7

### 발문

다항식 \$(x-2)(x^2+2x+4)(x-1)^3\$의 전개식에서 \$x^3\$의 계수를 구하면?

### 선지

① \$-9\$ ② \$-18\$ ③ \$0\$ ④ \$9\$ ⑤ \$18\$

### 정답

①

### 해설

곱셈 공식에 의해 \$(x-2)(x^2+2x+4)=x^3-8\$이고 \$(x-1)^3=x^3-3x^2+3x-1\$이므로 \$\$ (x^3-8)(x^3-3x^2+3x-1) \$\$ 전개식에서 \$x^3\$항은 \$x^3\\cdot(-1)+(-8)\\cdot x^3=-9x^3\$이므로 \$x^3\$의 계수는 \$-9\$이다.

```
{"status": "EXEMPT", "reason": "곱셈 공식으로 식을 간단히 한 뒤 x^3의 계수를 찾는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$(x-2)(x^2+2x+4)=x^3-8$과 $(x-1)^3$ 전개식에서 $x^3$이 나오는 두 항의 곱만 골라 계수를 더한다.", "decisiveStep": "전체를 전개하지 않고 $x^3\\cdot(-1)$과 $(-8)\\cdot x^3$ 두 항만 추출한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "고차식 전개"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-004 (DIRECT_ACTIVE): 고차 다항식 곱셈 전개에서 특정 차수 항의 계수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세제곱 공식 적용 후 특정 차수 항의 계수만 선택해 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "$x^3$의 계수를 구하면"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식에 의해", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(x-2)(x^2+2x+4)(x-1)^3$"}], "condition": []}, "reasons": {"method": "곱셈 공식 적용 후 x^3항이 되는 두 곱만 추출해 계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.9

### 발문

\$2^{10}=1024\$임을 이용하여 \$2^9+2^8+2^7+2^6+2^5+2^4+2^3+2^2+2+1\$을 계산하면?

### 선지

① \$511\$ ② \$1024\$ ③ \$1023\$ ④ \$1022\$ ⑤ \$2047\$

### 정답

③

### 해설

곱셈 공식 \$(x-1)(x^9+x^8+\\cdots+x+1)=x^{10}-1\$에 \$x=2\$를 대입하면 \$\$ (2-1)(2^9+2^8+\\cdots+2+1) \= 2^{10}-1 \= 1024-1 \= 1023 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "인수분해 항등식 (x-1)(x^9+...+1)=x^10-1에 x=2를 대입해 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "항등식 $(x-1)(x^9+\\cdots+1)=x^{10}-1$에 $x=2$를 대입해 $2^{10}-1=1023$을 구한다.", "decisiveStep": "앞에 $(2-1)=1$을 곱해 $2^{10}-1$로 바로 축약한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003 (DIRECT_ACTIVE): 곱셈공식에 x=2를 대입해 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "거듭제곱의 합을 $(x-1)$ 곱셈 공식으로 간단히 계산하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식 $(x-1)(x^9+x^8+\\cdots+x+1)=x^{10}-1$"}], "method": [{"term": "대입", "src": "solution", "quote": "x=2$를 대입하면", "evidenceType": "IMPLIED", "justification": "x^10-1 인수분해 항등식에 x=2를 대입해 합을 구함"}], "given": [{"term": "다항식", "src": "solution", "quote": "x^9+x^8+\\cdots+x+1"}], "condition": []}, "reasons": {"method": "x^10-1 항등식에 x=2를 대입해 1023을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4.6

### 발문

\$x^2-6x+2=0\$일 때, \$x^3+\\dfrac{8}{x^3}\$의 값은?

### 선지

① \$144\$ ② \$198\$ ③ \$216\$ ④ \$162\$ ⑤ \$180\$

### 정답

⑤

### 해설

\$x=0\$은 방정식을 만족하지 않으므로 \$x\\ne 0\$이다. 양변을 \$x\$로 나누면 \$\$ x-6+\\frac{2}{x}=0 \\implies x+\\frac{2}{x}=6 \$\$ 따라서 곱셈 공식의 변형에 의하여 \$\$ x^3+\\frac{8}{x^3} \= \\left(x+\\frac{2}{x}\\right)^3-3\\cdot x\\cdot\\frac{2}{x}\\left(x+\\frac{2}{x}\\right) \= 6^3-6\\cdot 6 \= 216-36 \= 180 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차방정식을 x로 나누어 x+2/x=6을 구한 뒤 곱셈 공식 변형으로 세제곱합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "방정식을 $x$로 나누어 $x+\\frac{2}{x}=6$을 얻고 세제곱 합 변형 공식에 대입해 $180$을 구한다.", "decisiveStep": "$x^3+\\left(\\frac{2}{x}\\right)^3$의 변형에서 교차 곱 계수 $3\\cdot 2=6$을 정확히 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003 (DIRECT_ACTIVE): 역수 꼴 합에서 세제곱 합 곱셈공식 변형을 적용하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식 양변을 $x$로 나누어 역수 꼴 합을 구하고 세제곱 합 변형 공식을 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식의 변형에 의하여"}], "method": [{"term": "대입", "src": "solution", "quote": "6^3-6\\cdot 6", "evidenceType": "IMPLIED", "justification": "x+2/x=6을 구한 뒤 세제곱 합 변형 공식에 대입함"}], "given": [{"term": "이차방정식", "src": "solution", "quote": "방정식을 만족하지"}], "condition": []}, "reasons": {"method": "x로 나누어 x+2/x=6을 얻고 세제곱 합 변형 공식으로 180을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 5.2

### 발문

다음은 조립제법을 이용하여 \$(3x^3-x^2+6x-2)\\div(3x+2)\$의 몫과 나머지를 구하는 과정이다. 빈칸에 알맞지 않은 것은?

| (가) | \$3\$ | \$-1\$ | \$6\$ | \$-2\$ |
| :---- | :---- | :---- | :---- | :---- |
|  |  | \$-2\$ | (나) | (다) |
|  | \$3\$ | \$-3\$ | \$8\$ | (라) |

\$3x^3-x^2+6x-2 \= \\left(x+\\dfrac{2}{3}\\right)(3x^2-3x+8)+\\text{(라)} \= (3x+2)\\times\\text{(마)}+\\text{(라)}\$

### 선지

① (가) \$-\\dfrac{2}{3}\$ ② (마) \$3x^2-3x+8\$ ③ (나) \$2\$ ④ (다) \$-\\dfrac{16}{3}\$ ⑤ (라) \$-\\dfrac{22}{3}\$

### 정답

②

### 해설

\$3x+2=3\\left(x+\\dfrac{2}{3}\\right)\$이므로 (가)\$=-\\dfrac{2}{3}\$이다.

- (나)\$=(-3)\\cdot\\left(-\\dfrac{2}{3}\\right)=2\$  
- (다)\$=8\\cdot\\left(-\\dfrac{2}{3}\\right)=-\\dfrac{16}{3}\$  
- (라)\$=-2-\\dfrac{16}{3}=-\\dfrac{22}{3}\$  
- (마)\$=\\dfrac{3x^2-3x+8}{3}=x^2-x+\\dfrac{8}{3}\$ 따라서 알맞지 않은 것은 ②이다.

```
{"status": "EXEMPT", "reason": "표로 제시된 조립제법 과정의 빈칸을 채우고 일차항 계수 3에 대한 몫 보정을 판별하는 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "조립제법에서 $3x+2=3(x+2/3)$에 따른 각 칸의 수와 $3$으로 나눈 실제 몫 (마)$=x^2-x+\\frac{8}{3}$을 확인한다.", "decisiveStep": "일차항 계수가 $3$인 제수로 나눌 때 몫을 $3$으로 나누어 (마)를 보정해야 함을 포착한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006 (DIRECT_ACTIVE): 조립제법을 이용한 다항식 나눗셈의 몫과 나머지를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조립제법 빈칸 채우기에서 제수의 일차항 계수 보정 오류를 찾는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫과 나머지를 구하는 과정"}], "method": [{"term": "다항식의나눗셈", "src": "stem", "quote": "조립제법을 이용하여", "evidenceType": "IMPLIED", "justification": "조립제법 연산 및 일차항 계수 3에 대한 몫 보정으로 각 빈칸을 검증함"}], "given": [{"term": "다항식", "src": "stem", "quote": "(3x^3-x^2+6x-2)"}], "condition": []}, "reasons": {"method": "조립제법 빈칸과 3x+2 나눗셈 몫 보정 오류를 찾아 ②를 선택함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.4

### 발문

등식 \$(x+3)^4=a\_0+a\_1x+a\_2x^2+a\_3x^3+a\_4x^4\$이 \$x\$에 대한 항등식일 때, \$a\_1+a\_2+a\_3+a\_4\$의 값은?

### 선지

① \$81\$ ② \$128\$ ③ \$256\$ ④ \$175\$ ⑤ \$174\$

### 정답

④

### 해설

항등식의 양변에 \$x=0\$을 대입하면 \$a\_0=3^4=81\$이고, \$x=1\$을 대입하면 \$\$ a\_0+a\_1+a\_2+a\_3+a\_4 \= (1+3)^4 \= 4^4 \= 256 \$\$ 따라서 \$a\_1+a\_2+a\_3+a\_4 \= 256-81 \= 175\$이다.

```
{"status": "EXEMPT", "reason": "항등식에 x=0과 x=1을 대입해 상수항을 제외한 계수 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "항등식에 $x=1$과 $x=0$을 대입해 전체 계수합 $256$에서 상수항 $a_0=81$을 뺀다.", "decisiveStep": "$a_0$이 빠진 $a_1+\\cdots+a_4$를 구하기 위해 $x=0$ 대입값 $81$을 빼준다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008 (DIRECT_ACTIVE): 항등식에 x=0, x=1을 수치대입해 계수 합을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항등식 수치대입으로 전체 계수합과 상수항을 구해 차를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "a_1+a_2+a_3+a_4"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "항등식의 양변에 $x=0$을 대입하면", "evidenceType": "IMPLIED", "justification": "x=0과 x=1을 수치대입하여 a_1+a_2+a_3+a_4를 구함"}], "given": [{"term": "항등식", "src": "stem", "quote": "$x$에 대한 항등식"}], "condition": []}, "reasons": {"method": "x=1과 x=0 수치대입으로 a_1+a_2+a_3+a_4=175를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 5.2

### 발문

다항식 \$f(x)\$를 \$(x-1)^2\$으로 나눈 나머지가 \$2x-7\$이고, \$x-3\$으로 나눈 나머지가 \$3\$일 때, \$f(x)\$를 \$(x-1)^2(x-3)\$으로 나눈 나머지를 \$R(x)\$라 하자. \$R(0)\$의 값은?

### 선지

① \$-6\$ ② \$-4\$ ③ \$-2\$ ④ \$2\$ ⑤ \$6\$

### 정답

①

### 해설

\$f(x)\$를 삼차식 \$(x-1)^2(x-3)\$으로 나눈 나머지 \$R(x)\$는 \$(x-1)^2\$으로 나눈 나머지가 \$2x-7\$이어야 하므로 \$\$ R(x) \= a(x-1)^2+2x-7 \$\$ 조건에서 \$f(3)=R(3)=3\$이므로 \$\$ a(3-1)^2+2(3)-7 \= 4a-1 \= 3 \\implies a=1 \$\$ 따라서 \$R(x)=(x-1)^2+2x-7=x^2-6\$이므로 \$R(0)=-6\$이다.

```
{"status": "EXEMPT", "reason": "삼차식 (x-1)^2(x-3) 나눗셈 나머지를 a(x-1)^2+2x-7로 두고 f(3)=3으로 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "이차 나머지 $R(x)=a(x-1)^2+2x-7$로 설정하고 $f(3)=R(3)=3$을 대입해 $a=1$을 구한다.", "decisiveStep": "$(x-1)^2$의 나머지 조건을 $a(x-1)^2+2x-7$ 형태로 압축해 미지수를 하나로 줄인다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010 (FAMILY_ACTIVE): 합성 제수의 나머지 조건을 결합해 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱 인수를 포함한 삼차식 나눗셈의 나머지를 결정하는 대표 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 하자"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "f(3)=R(3)=3$이므로", "evidenceType": "IMPLIED", "justification": "R(x)=a(x-1)^2+2x-7로 두고 나머지정리 f(3)=3을 대입해 a를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "R(x)=a(x-1)^2+2x-7 설정 후 f(3)=3 대입으로 R(0)=-6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.4

### 발문

다음 중 인수분해가 옳지 않은 것은?

### 선지

① \$x^3-6x^2y+12xy^2-8y^3=(x-2y)^3\$ ② \$x^3-7x^2+14x-8=(x-1)(x-2)(x-4)\$ ③ \$27x^3+8=(3x+2)(9x^2+6x+4)\$ ④ \$a^2+4b^2+9c^2-4ab-12bc+6ca=(a-2b+3c)^2\$ ⑤ \$x^8-y^8=(x-y)(x+y)(x^2+y^2)(x^4+y^4)\$

### 정답

③

### 해설

③에서 \$27x^3+8=(3x)^3+2^3=(3x+2)(9x^2-6x+4)\$이므로 일차항 계수 부호가 틀렸다. 나머지 ①, ②, ④, ⑤는 모두 옳은 인수분해이다.

```
{"status": "EXEMPT", "reason": "다섯 가지 인수분해 공식의 정오를 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "다섯 보기의 인수분해 공식을 점검해 $27x^3+8=(3x+2)(9x^2-6x+4)$의 가운데 항 부호 오류를 찾는다.", "decisiveStep": "$A^3+B^3=(A+B)(A^2-AB+B^2)$에서 가운데 항 부호가 음수임을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "합과 차"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-016 (DIRECT_ACTIVE): 기본 인수분해 공식의 정오를 판별하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기본 인수분해 공식들의 부호를 종합 점검하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해가 옳지"}], "method": [{"term": "인수분해", "src": "solution", "quote": "옳은 인수분해이다", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "choices", "quote": "27x^3+8"}], "condition": []}, "reasons": {"method": "세제곱 합 인수분해 공식의 가운데 항 부호 오류를 찾아 ③을 선택함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.7

### 발문

\$x\$에 대한 삼차방정식 \$x^3-(a+5)x^2+6ax-a^2=0\$이 서로 다른 세 실근을 갖도록 하는 모든 자연수 \$a\$의 합은?

### 선지

① \$11\$ ② \$13\$ ③ \$15\$ ④ \$21\$ ⑤ \$17\$

### 정답

⑤

### 해설

좌변에 \$x=a\$를 대입하면 \$a^3-(a+5)a^2+6a^2-a^2=0\$이므로 \$x-a\$를 인수로 갖는다. 조립제법으로 인수분해하면 \$\$ (x-a)(x^2-5x+a) \= 0 \$\$ 서로 다른 세 실근을 가지려면 이차방정식 \$x^2-5x+a=0\$이 \$a\$가 아닌 서로 다른 두 실근을 가져야 한다.

1) 판별식 \$D=25-4a\>0 \\implies a\<\\dfrac{25}{4}=6.25\$  
2) \$x=a\$가 근이 아니어야 하므로 \$a^2-5a+a=a(a-4)\\ne 0 \\implies a\\ne 0, 4\$ 따라서 조건을 만족하는 자연수 \$a\$는 \$1, 2, 3, 5, 6\$이고 합은 \$1+2+3+5+6=17\$이다.

```
{"status": "EXEMPT", "reason": "삼차방정식을 (x-a)(x^2-5x+a)=0으로 인수분해하고 서로 다른 세 실근 조건으로 자연수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$x=a$를 근으로 찾아 $(x-a)(x^2-5x+a)=0$으로 인수분해한 뒤 $D>0$과 $x=a$ 비중근 조건을 적용한다.", "decisiveStep": "이차방정식이 $x=a$를 근으로 갖지 않을 조건 $a\\ne 4$를 제외해 $1, 2, 3, 5, 6$을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043 (RPM_ONLY): 삼차방정식의 서로 다른 세 실근 조건 문항으로 현재 ACTIVE 대응 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자 계수 삼차방정식의 인수분해 후 판별식과 중근 배제 조건을 함께 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "모든 자연수 $a$의 합"}], "method": [{"term": "인수정리", "src": "solution", "quote": "x=a$를 대입하면", "evidenceType": "IMPLIED", "justification": "x=a 대입으로 일차인수를 추출하고 이차식의 판별식 D>0 및 x!=a 조건을 적용함"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-(a+5)x^2+6ax-a^2=0$"}], "condition": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=25-4a>0"}]}, "reasons": {"method": "x=a 인수 추출 후 이차식 판별식 D>0 및 a!=4 배제로 자연수 합 17을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q09

- 형식: 객관식  
- 배점: 4.9

### 발문

\$\\sqrt{11\\times 13\\times 15\\times 17+16}\$의 값을 구하면?

### 선지

① \$189\$ ② \$191\$ ③ \$193\$ ④ \$195\$ ⑤ \$187\$

### 정답

②

### 해설

\$x=11\$이라 하면 \$\$ \\begin{aligned} 11\\times 13\\times 15\\times 17+16 &= x(x+2)(x+4)(x+6)+16 \\ &= {x(x+6)}{(x+2)(x+4)}+16 \\ &= (x^2+6x)(x^2+6x+8)+16 \\ &= (x^2+6x)^2+8(x^2+6x)+16 \\ &= (x^2+6x+4)^2 \\end{aligned} \$\$ 따라서 \$\\sqrt{(11^2+6\\cdot 11+4)^2} \= 121+66+4 \= 191\$이다.

```
{"status": "EXEMPT", "reason": "연속 4개 수의 곱+16을 문자 x=11 치환과 완전제곱식으로 변형해 제곱근을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$x=11$로 치환해 $x(x+6)$과 $(x+2)(x+4)$로 짝지어 $(x^2+6x+4)^2$ 꼴로 완전제곱식화한다.", "decisiveStep": "일차항 계수가 $6$으로 같아지도록 짝지어 근호 안을 완전제곱식 $(x^2+6x+4)^2$으로 만든다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "수의 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-018 (DIRECT_ACTIVE): 치환과 완전제곱식 인수분해를 활용해 수의 제곱근을 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연속된 네 수의 곱과 상수 합을 치환으로 완전제곱식화해 제곱근을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "제곱근", "src": "solution", "quote": "\\sqrt{(11^2+6\\cdot 11+4)^2}"}], "method": [{"term": "치환", "src": "solution", "quote": "x=11$이라 하면", "evidenceType": "IMPLIED", "justification": "11을 x로 치환해 짝지어 전개함으로써 근호 안을 완전제곱식으로 정리함"}], "given": [{"term": "완전제곱식", "src": "solution", "quote": "(x^2+6x+4)^2"}], "condition": []}, "reasons": {"method": "x=11 치환과 완전제곱식 변형으로 제곱근 191을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.2

### 발문

복소수 \$z=\\dfrac{1+i}{\\sqrt{2}}\$일 때, \$z^{510}\$의 값은?

### 선지

① \$-1\$ ② \$\\dfrac{1+i}{\\sqrt{2}}\$ ③ \$1\$ ④ \$-i\$ ⑤ \$i\$

### 정답

④

### 해설

\$z^2 \= \\left(\\dfrac{1+i}{\\sqrt{2}}\\right)^2 \= \\dfrac{2i}{2} \= i\$이므로 \$\$ z^{510} \= (z^2)^{255} \= i^{255} \$\$ \$255=4\\times 63+3\$이고 \$i^4=1\$이므로 \$i^{255}=i^3=-i\$이다.

```
{"status": "EXEMPT", "reason": "z^2=i 성질을 이용해 z^510을 i^255로 바꾸고 4주기로 계산하는 순수 복소수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z^2=i$임을 먼저 구하고 $z^{510}=i^{255}$에 $i^4=1$ 주기성을 적용해 $-i$를 구한다.", "decisiveStep": "$510=2\\times 255$로 제곱을 먼저 계산해 $i$로 단순화한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025 (DIRECT_ACTIVE): z^2=i와 허수단위 i의 4주기 성질을 이용하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "특수 복소수 $\\frac{1+i}{\\sqrt{2}}$의 제곱 성질과 $i$의 $4$주기성을 결합한 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\dfrac{1+i}{\\sqrt{2}}$"}], "method": [{"term": "허수", "src": "solution", "quote": "z^2 = \\left(\\dfrac{1+i}{\\sqrt{2}}\\right)^2 = \\dfrac{2i}{2} = i$", "evidenceType": "IMPLIED", "justification": "z^2=i를 구한 뒤 i^4=1 주기성을 적용해 510제곱을 계산함"}], "given": [{"term": "지수", "src": "solution", "quote": "255=4\\times 63+3"}], "condition": []}, "reasons": {"method": "z^2=i를 구한 뒤 4주기 성질로 z^510=-i를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.1

### 발문

등식 \$(1+i)\\overline{z}=(2+3i)z-\\overline{z}+(8-2i)\$를 만족시키는 복소수 \$z\$는? (단, \$\\overline{z}\$는 \$z\$의 켤레복소수이다.)

### 선지

① \$-3+2i\$ ② \$3+2i\$ ③ \$-3-2i\$ ④ \$2-3i\$ ⑤ \$-2+3i\$

### 정답

①

### 해설

\$z=a+bi\$ (\$a, b\$는 실수)라 두면 \$\\overline{z}=a-bi\$이다. 등식의 양변에 대입하면

- 좌변: \$(1+i)(a-bi) \= (a+b)+(a-b)i\$  
- 우변: \$(2+3i)(a+bi)-(a-bi)+(8-2i) \= (a-3b+8)+(3a+3b-2)i\$ 실수부분과 허수부분을 각각 비교하면 \$\$ a+b=a-3b+8 \\implies 4b=8 \\implies b=2 \$\$ \$\$ a-b=3a+3b-2 \\implies 2a+4b=2 \\implies 2a+8=2 \\implies a=-3 \$\$ 따라서 \$z=-3+2i\$이다.

```
{"status": "EXEMPT", "reason": "z=a+bi를 대입하고 복소수 상등 조건으로 실수부·허수부를 비교해 z를 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "$z=a+bi, \\overline{z}=a-bi$를 등식에 대입해 실수부분과 허수부분을 각각 비교하여 $a=-3, b=2$를 구한다.", "decisiveStep": "좌우변의 실수부분 비교에서 $a$가 소거되어 $4b=8 \\implies b=2$가 즉시 구해진다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-022 (DIRECT_ACTIVE): z=a+bi 대입 후 복소수 상등 조건으로 실수부·허수부를 비교하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 방정식에 $z=a+bi$를 대입해 복소수 상등 조건으로 연립방정식을 푸는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "만족시키는 복소수 $z$는"}], "method": [{"term": "켤레복소수", "src": "stem", "quote": "\\overline{z}$는 $z$의 켤레복소수", "evidenceType": "IMPLIED", "justification": "z=a+bi와 켤레복소수 a-bi를 대입해 실수부·허수부를 비교함"}], "given": [{"term": "실수부분", "src": "solution", "quote": "실수부분과 허수부분을"}], "condition": []}, "reasons": {"method": "z=a+bi와 켤레복소수를 대입해 실수부·허수부 비교로 z를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.5

### 발문

복소수 \$z=(1+i)x^2+(1-7i)x+(-6+10i)\$에 대하여 \$z^2\$이 음의 실수가 되도록 하는 실수 \$x\$의 값을 \$a\$, 그때의 \$z\$의 허수부분을 \$b\$라 할 때, \$ab\$의 값은?

### 선지

① \$-40\$ ② \$-80\$ ③ \$-120\$ ④ \$40\$ ⑤ \$120\$

### 정답

③

### 해설

\$z\$를 실수부분과 허수부분으로 정리하면 \$\$ z \= (x^2+x-6)+(-7x+x^2+10)i \= (x+3)(x-2)+(x-2)(x-5)i \$\$ \$z^2\$이 음의 실수가 되려면 \$z\$는 순허수이어야 하므로 실수부분이 \$0\$이고 허수부분이 \$0\$이 아니어야 한다. \$(x+3)(x-2)=0\$이고 \$(x-2)(x-5)\\ne 0\$이므로 \$x=-3\$이다. 따라서 \$a=-3\$이고, 이때 \$z=0+(-3-2)(-3-5)i=40i\$이므로 \$b=40\$이다. 그러므로 \$ab=(-3)\\cdot 40=-120\$이다.

```
{"status": "EXEMPT", "reason": "z^2<0 조건이 z가 순허수임을 이용해 실수 x와 허수부분을 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=(x+3)(x-2)+(x-2)(x-5)i$에서 순허수 조건을 적용해 $z=0$인 $x=2$를 제외하고 $a=-3, b=40$을 구한다.", "decisiveStep": "$x=2$일 때 실수부와 허수부가 모두 $0$이므로 제외하고 $x=-3$만 취한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026 (DIRECT_ACTIVE): 순허수 조건을 만족하는 실수 x와 허수부분을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱이 음의 실수인 순허수 조건과 공통인수 $x=2$ 배제를 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허수부분", "src": "stem", "quote": "z$의 허수부분을 $b$"}], "method": [{"term": "순허수", "src": "solution", "quote": "z$는 순허수이어야", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=(1+i)x^2+(1-7i)x+(-6+10i)$"}], "condition": []}, "reasons": {"method": "실수부·허수부 인수분해 후 순허수 조건으로 a=-3, b=40을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.3

### 발문

이차방정식 \$x^2+2(k+2)x+k^2-ak+4=0\$이 실수 \$k\$의 값에 관계없이 항상 중근을 갖도록 하는 수를 \$a\$, 이차방정식 \$x^2-4x-2b=0\$이 실근을 갖도록 하는 가장 작은 정수를 \$b\$라 할 때, \$a+b\$의 값은?

### 선지

① \$2\$ ② \$0\$ ③ \$-2\$ ④ \$-4\$ ⑤ \$-6\$

### 정답

⑤

### 해설

1) 첫째 방정식이 항상 중근을 가지므로 판별식 \$D\_1=0\$에서 \$\$ \\frac{D\_1}{4} \= (k+2)^2-(k^2-ak+4) \= (a+4)k \= 0 \$\$ \$k\$의 값에 관계없이 성립하므로 \$a+4=0 \\implies a=-4\$이다.  
2) 둘째 방정식이 실근을 가지므로 판별식 \$D\_2\\ge 0\$에서 \$\$ \\frac{D\_2}{4} \= (-2)^2-(-2b) \= 4+2b \\ge 0 \\implies b \\ge \-2 \$\$ 가장 작은 정수 \$b=-2\$이므로 \$a+b=-4+(-2)=-6\$이다.

```
{"status": "EXEMPT", "reason": "두 이차방정식의 중근 항등식 판별식과 실근 판별식 부등식을 풀어 a+b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "첫째 식의 중근 판별식 $(a+4)k=0$으로 $a=-4$를 구하고, 둘째 식의 실근 판별식 $4+2b\\ge 0$으로 최소 정수 $b=-2$를 구한다.", "decisiveStep": "$k$ 항등식 조건과 실근 조건($D_2\\ge 0$에 등호 포함)을 각각 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "계수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_PARAMETER_IDENTITY", "why": "high1.json H1-RPM-032 (FAMILY_BINDING_GAP): 매개변수 k에 관계없이 중근을 가질 판별식 조건 및 실근 조건을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 매개변수 항등식과 실근 판별식 부등식을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "가장 작은 정수를 $b$"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D_1=0$에서", "evidenceType": "NAMED"}], "given": [{"term": "중근", "src": "stem", "quote": "항상 중근을 갖도록"}], "condition": [{"term": "실근", "src": "stem", "quote": "실근을 갖도록"}]}, "reasons": {"method": "중근 k 항등식으로 a=-4, 실근 판별식 D2>=0으로 b=-2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q14

- 형식: 객관식  
- 배점: 4.1

### 발문

이차함수 \$y=2x^2+ax-12\$의 그래프가 \$x\$축과 서로 다른 두 점 \$A(-2, 0)\$, \$B(b, 0)\$에서 만날 때, 실수 \$a, b\$에 대하여 \$a+2b\$의 값은?

### 선지

① \$2\$ ② \$4\$ ③ \$0\$ ④ \$-2\$ ⑤ \$6\$

### 정답

②

### 해설

이차방정식 \$2x^2+ax-12=0\$의 두 근이 \$-2, b\$이므로 근과 계수의 관계에 의하여 \$\$ (-2)b \= \\frac{-12}{2} \= \-6 \\implies b=3 \$\$ \$\$ \-2+3 \= \-\\frac{a}{2} \\implies a=-2 \$\$ 따라서 \$a+2b \= \-2+2(3) \= 4\$이다.

```
{"status": "EXEMPT", "reason": "x축 두 교점의 x좌표를 이차방정식 두 근으로 두고 근과 계수의 관계로 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "방정식 $2x^2+ax-12=0$의 두 근 $-2, b$에 근과 계수의 관계를 적용해 $b=3, a=-2$를 구한다.", "decisiveStep": "두 근의 곱 $-2b=-6$에서 $b=3$을 먼저 구하고 합 $-2+3=-a/2$로 $a$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033 (DIRECT_ACTIVE): 이차함수 그래프와 x축의 교점 좌표를 방정식의 근과 연결하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$절편과 근과 계수의 관계를 연결하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=2x^2+ax-12$"}], "condition": []}, "reasons": {"method": "x절편을 두 근으로 두고 근과 계수의 관계로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.6

### 발문

\$0\$이 아닌 두 실수 \$a\$, \$b\$에 대하여 \$\\dfrac{\\sqrt{a}}{\\sqrt{b}}=-\\sqrt{\\dfrac{a}{b}}\$일 때, 복소수 \$\\sqrt{-a}+\\sqrt{-b}+\\sqrt{ab}+\\sqrt{-ab}\$의 허수부분은?

### 선지

① \$\\sqrt{a}\$ ② \$\\sqrt{-b}\$ ③ \$\\sqrt{a}+\\sqrt{-b}\$ ④ \$\\sqrt{a}+\\sqrt{-ab}\$ ⑤ \$\\sqrt{-b}+\\sqrt{-ab}\$

### 정답

④

### 해설

\$a, b\\ne 0\$이고 \$\\dfrac{\\sqrt{a}}{\\sqrt{b}}=-\\sqrt{\\dfrac{a}{b}}\$이므로 \$a\>0\$, \$b\<0\$이다. 따라서 \$-b\>0\$, \$-ab\>0\$이고 \$-a\<0\$, \$ab\<0\$이므로 각 항을 정리하면

- \$\\sqrt{-a} \= \\sqrt{a}i\$ (순허수)  
- \$\\sqrt{-b}\$ (양의 실수)  
- \$\\sqrt{ab} \= \\sqrt{-ab}i\$ (순허수)  
- \$\\sqrt{-ab}\$ (양의 실수) 그러므로 주어진 복소수의 허수부분은 \$\\sqrt{a}+\\sqrt{-ab}\$이다.

```
{"status": "EXEMPT", "reason": "음수 제곱근 나눗셈 조건으로 a>0, b<0 부호를 판정해 복소수의 허수부분을 구하는 순수 개념 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "$\\frac{\\sqrt{a}}{\\sqrt{b}}=-\\sqrt{\\frac{a}{b}}$에서 $a>0, b<0$을 구한 뒤 각 제곱근의 근호 안 부호를 판별해 허수부분 $\\sqrt{a}+\\sqrt{-ab}$를 찾는다.", "decisiveStep": "근호 안이 음수인 $\\sqrt{-a}$와 $\\sqrt{ab}$를 $\\sqrt{a}i$, $\\sqrt{-ab}i$로 변환해 허수부분을 모은다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-021 (DIRECT_ACTIVE): 음수의 제곱근 부호 판별 후 복소수의 허수부분을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 제곱근 나눗셈 조건에서 $a, b$의 부호를 추론하고 각 근호의 실수·허수 여부를 판별하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허수부분", "src": "stem", "quote": "허수부분은?"}], "method": [{"term": "제곱근", "src": "solution", "quote": "\\sqrt{-a} = \\sqrt{a}i", "evidenceType": "IMPLIED", "justification": "나눗셈 부호 조건으로 a>0, b<0을 정하고 음수 제곱근을 i로 변환해 허수부분을 모음"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $\\sqrt{-a}+\\sqrt{-b}+\\sqrt{ab}+\\sqrt{-ab}$"}], "condition": []}, "reasons": {"method": "음수 제곱근 조건으로 a>0, b<0을 정하고 허수부분을 추출함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.7

### 발문

그림과 같이 이차함수 \$y=12-x^2\$의 그래프가 직선 \$y=kx\$와 서로 다른 두 점 \$A\$, \$B\$에서 만나고, 점 \$A\$에서 \$x\$축에 내린 수선의 발을 \$A'\$, 점 \$B\$에서 내린 수선의 발을 \$B'\$이라 하자. 두 삼각형 \$OAA'\$, \$OBB'\$의 넓이의 비가 \$1:9\$가 되도록 하는 양수 \$k\$의 값은? (단, 점 \$A\$의 \$x\$좌표가 점 \$B\$의 \$x\$좌표보다 크고, \$O\$는 원점이다.)

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$3\$ ⑤ \$5\$

### 정답

②

### 해설

두 삼각형 \$OAA'\$과 \$OBB'\$은 모두 원점 \$O\$를 지나고 빗변이 직선 \$y=kx\$ 위에 있으므로 서로 닮음이다. 넓이의 비가 \$1:9=1^2:3^2\$이므로 닮음비는 \$1:3\$이고, \$k\>0\$이며 점 \$A\$의 \$x\$좌표가 점 \$B\$의 \$x\$좌표보다 크므로 두 교점의 \$x\$좌표를 \$\\alpha, \-3\\alpha\$ (\$\\alpha\>0\$)라 놓을 수 있다. 이들은 이차방정식 \$12-x^2=kx \\iff x^2+kx-12=0\$의 두 근이므로 근과 계수의 관계에 의해 \$\$ \\alpha+(-3\\alpha) \= \-k \\implies \\alpha \= \\frac{k}{2}, \\qquad \\alpha(-3\\alpha) \= \-12 \\implies \\alpha^2 \= 4 \\implies \\alpha \= 2 \$\$ 따라서 \$\\dfrac{k}{2}=2 \\implies k=4\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-7, 4], "viewport": [-7, 4, -26, 14], "pieces": [{"domain": [-7, 4], "coefficients": ["12", "0", "-1"]}], "referenceLines": [{"slope": "4", "intercept": "0", "label": "y=kx"}], "requiredPoints": [{"id": "A", "x": "2", "y": "8", "label": "A"}, {"id": "B", "x": "-6", "y": "-24", "label": "B"}, {"id": "A1", "x": "2", "y": "0", "label": "A'"}, {"id": "B1", "x": "-6", "y": "0", "label": "B'"}, {"id": "O", "x": "0", "y": "0", "label": "O"}]}, "caption": "y=12-x^2과 직선 y=kx의 교점 A, B 및 x축 수선의 발 A', B'"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\triangle OAA'\\sim\\triangle OBB'$의 넓이 비 $1:9$에서 닮음비 $1:3$을 얻어 두 근을 $\\alpha, -3\\alpha$로 두고 근과 계수의 관계로 $k=4$를 구한다.", "decisiveStep": "넓이의 비 $1:9$에서 $x$좌표 절댓값 비 $1:3$과 부호 반대($\\alpha>0, \\beta=-3\\alpha$)를 도출한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033 (DIRECT_ACTIVE): 포물선과 직선의 교점 좌표 및 도형 넓이 비 관계를 이용하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "포물선과 원점 통과 직선의 교점 삼각형 닮음비와 근과 계수의 관계를 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "양수", "src": "stem", "quote": "양수 $k$의 값은"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "삼각형", "src": "stem", "quote": "두 삼각형 $OAA'$, $OBB'$"}], "condition": [{"term": "교점", "src": "solution", "quote": "두 교점의 $x$좌표"}]}, "reasons": {"method": "두 닮음 삼각형 넓이 비 1:9로 근 α, -3α를 세워 k=4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.6

### 발문

\$x\$의 값의 범위가 \$1\\le x\\le k\$일 때, 이차함수 \$y=-2x^2-4x+k+3\$의 최솟값이 \$-11\$이다. 이 범위에서 이차함수의 최댓값은?

### 선지

① \$-1\$ ② \$-3\$ ③ \$1\$ ④ \$3\$ ⑤ \$5\$

### 정답

①

### 해설

\$y=-2(x+1)^2+k+5\$는 위로 볼록하고 축이 \$x=-1\$이다. 구간 \$1\\le x\\le k\$ (\$k\\ge 1\$)는 축 \$x=-1\$의 오른쪽에 있으므로 이 구간에서 함수는 감소한다. 따라서 최솟값은 \$x=k\$일 때이므로 \$\$ \-2k^2-4k+k+3 \= \-11 \\implies 2k^2+3k-14 \= 0 \\implies (2k+7)(k-2) \= 0 \$\$ \$k\\ge 1\$이므로 \$k=2\$이다. 그러므로 최댓값은 \$x=1\$일 때 \$-2(1)^2-4(1)+2+3=-1\$이다.

```
{"status": "EXEMPT", "reason": "축 x=-1 오른쪽 구간 [1, k]에서 이차함수의 최솟값 조건으로 k를 구하고 최댓값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "축 $x=-1$이 구간 $[1, k]$ 왼쪽에 있어 $x=k$에서 최솟값 $-11$이 됨을 이용해 $k=2$를 구하고 $x=1$ 최댓값을 계산한다.", "decisiveStep": "위로 볼록한 함수의 축 $x=-1<1$이므로 구간 $[1, k]$에서 단조감소함을 판별한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037 (DIRECT_ACTIVE): 제한 구간 [1, k]에서 이차함수의 최솟값·최댓값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "축이 구간 밖에 있는 이차함수에서 미정 구간 끝점 $k$를 최솟값 조건으로 결정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "이차함수의 최댓값은"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-2x^2-4x+k+3$", "evidenceType": "IMPLIED", "justification": "축 x=-1과 구간 [1, k]의 위치 관계로 x=k 최솟값 방정식을 세워 k=2를 구함"}], "given": [{"term": "최솟값", "src": "stem", "quote": "최솟값이 $-11$이다"}], "condition": []}, "reasons": {"method": "축 x=-1 밖 구간 [1, k]의 최솟값으로 k=2를 구하고 최댓값 -1을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.9

### 발문

\$-2\\le x\\le 2\$일 때, 이차함수 \$f(x)=-x^2+2mx+m^2+m\$의 최솟값이 \$6\$이 되도록 하는 정수 \$m\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$5\$ ④ \$-2\$ ⑤ \$-5\$

### 정답

③

### 해설

\$f(x)=-(x-m)^2+2m^2+m\$은 위로 볼록하고 대칭축이 \$x=m\$이다. 구간 \$-2\\le x\\le 2\$의 중점은 \$0\$이므로 축 \$x=m\$과의 거리에 따라 최솟값이 갈린다.

1) \$m\\ge 0\$일 때: 축에서 더 먼 끝점은 \$x=-2\$이므로 최솟값은 \$\$f(-2) \= \-4-4m+m^2+m \= m^2-3m-4 \= 6 \\implies m^2-3m-10 \= (m-5)(m+2) \= 0\$\$ \$m\\ge 0\$이므로 \$m=5\$이다.  
2) \$m\<0\$일 때: 축에서 더 먼 끝점은 \$x=2\$이므로 최솟값은 \$\$f(2) \= \-4+4m+m^2+m \= m^2+5m-4 \= 6 \\implies m^2+5m-10 \= 0\$\$ 이를 만족하는 정수 \$m\$은 없다. 따라서 구하는 정수 \$m\$의 값은 \$5\$이다.

```
{"status": "EXEMPT", "reason": "움직이는 축 x=m과 구간 [-2, 2] 중점 0의 대소로 경우를 나누어 최솟값이 6이 되는 정수 m을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "위로 볼록한 $f(x)$의 축 $x=m$과 구간 $[-2, 2]$ 중점 $0$을 비교해 $m\\ge 0$과 $m<0$으로 나누어 정수 $m=5$를 구한다.", "decisiveStep": "위로 볼록한 함수의 제한 구간 최솟값은 축에서 더 먼 끝점($m\\ge 0$이면 $-2$, $m<0$이면 $2$)에서 나옴을 판별한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037 (DIRECT_ACTIVE): 움직이는 축과 제한 구간 [-2, 2]에서 이차함수의 최솟값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭축 $m$의 부호 분기를 통해 제한 범위 이차함수의 최솟값 조건을 푸는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $m$의 값은"}], "method": [{"term": "축", "src": "solution", "quote": "대칭축이 $x=m$이다", "evidenceType": "IMPLIED", "justification": "대칭축 x=m과 구간 중점 0을 비교해 m>=0, m<0 두 경우로 나누어 최솟값 6을 풂"}], "given": [{"term": "최솟값", "src": "stem", "quote": "최솟값이 $6$이 되도록"}], "condition": []}, "reasons": {"method": "대칭축 m의 부호로 경우를 나누어 최솟값 6을 만족하는 정수 m=5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 4.5

### 발문

어느 직육면체 가로의 길이를 \$a\$, 세로의 길이를 \$b\$, 높이를 \$c\$라 할 때, 겉넓이가 \$44\$이고 모서리 길이의 합은 \$48\$이다. 이 직육면체의 대각선의 길이를 구하는 풀이과정과 답을 서술하시오.

### 선지

없음

### 정답

\$10\$

### 해설

겉넓이 조건에서 \$2(ab+bc+ca)=44\$이고, 모서리 길이 합 조건에서 \$4(a+b+c)=48 \\implies a+b+c=12\$이다. 곱셈 공식의 변형에 의하여 \$\$ a^2+b^2+c^2 \= (a+b+c)^2-2(ab+bc+ca) \= 12^2-44 \= 144-44 \= 100 \$\$ 따라서 직육면체의 대각선의 길이는 \$\\sqrt{a^2+b^2+c^2}=\\sqrt{100}=10\$이다.

```
{"status": "EXEMPT", "reason": "직육면체 겉넓이와 모서리 합으로 곱셈 공식 변형해 대각선 길이를 구하는 순수 대수·도형 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$2(ab+bc+ca)=44$, $a+b+c=12$를 이용해 $a^2+b^2+c^2=100$을 구하고 제곱근 $10$을 구한다.", "decisiveStep": "대각선 길이 공식 $\\sqrt{a^2+b^2+c^2}$을 세 수의 제곱합 변형 공식과 연결한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003 (DIRECT_ACTIVE): 세 문자의 대칭식 곱셈공식 변형으로 직육면체 대각선 길이를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직육면체 활용에서 세 항 제곱합 곱셈 공식을 바로 적용하는 서술형 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대각선", "src": "stem", "quote": "대각선의 길이를"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식의 변형에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "겉넓이", "src": "stem", "quote": "겉넓이가 $44$이고"}], "condition": []}, "reasons": {"method": "겉넓이와 모서리 합에서 곱셈 공식 변형으로 대각선 길이 10을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 5.5

### 발문

다음 \$x^4-6x^3-9x^2+6x+1\$을 인수분해하면 \$(x^2+ax-b)(x^2+cx+d)\$로 나타낼 수 있다. 이때 \$a+b+c+d\$의 값을 구하시오. (단, \$a, b, c, d\$는 정수이다.)

### 선지

없음

### 정답

\$-6\$

### 해설

\$x^4-6x^3-9x^2+6x+1\$을 \$x^2\$으로 묶어 변형하면 (\$x\\ne 0\$) \$\$ x^2\\left{\\left(x^2+\\frac{1}{x^2}\\right)-6\\left(x-\\frac{1}{x}\\right)-9\\right} \= x^2\\left{\\left(x-\\frac{1}{x}\\right)^2-6\\left(x-\\frac{1}{x}\\right)-7\\right} \$\$ \$t=x-\\dfrac{1}{x}\$라 하면 \$t^2-6t-7=(t+1)(t-7)\$이므로 \$\$ x^2\\left(x-\\frac{1}{x}+1\\right)\\left(x-\\frac{1}{x}-7\\right) \= (x^2+x-1)(x^2-7x-1) \$\$ 따라서 두 이차인수는 \$(x^2+x-1)\$과 \$(x^2-7x-1)\$이므로 \${a, c}={1, \-7}\$, \$b=1, d=-1\$이고 \$a+b+c+d \= 1+1+(-7)+(-1) \= \-6\$이다.

```
{"status": "EXEMPT", "reason": "부호 교대 상반 사차식을 x-1/x 치환으로 두 이차식으로 인수분해해 계수 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$x^2$으로 묶어 $x-\\frac{1}{x}=t$로 치환해 $t^2-6t-7=(t+1)(t-7)$로 인수분해한 뒤 $(x^2+x-1)(x^2-7x-1)$을 얻는다.", "decisiveStep": "상수항과 $x^3, x$항의 부호가 반대인 상반방정식 꼴에서 $x-\\frac{1}{x}$를 치환 변수로 잡는다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014 (DIRECT_ACTIVE): 상반 사차식을 x-1/x 치환으로 단계적 인수분해하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부호 교대 상반 사차식의 $x-1/x$ 치환 인수분해를 묻는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하면"}], "method": [{"term": "치환", "src": "solution", "quote": "t=x-\\dfrac{1}{x}$라 하면", "evidenceType": "IMPLIED", "justification": "x^2으로 묶은 뒤 x-1/x=t로 치환해 이차식으로 인수분해함"}], "given": [{"term": "정수", "src": "stem", "quote": "정수이다"}], "condition": []}, "reasons": {"method": "x^2 묶기와 x-1/x 치환으로 상반 사차식을 인수분해해 계수 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 4

### 발문

이차함수 \$y=x^2-5x-k\$의 그래프가 직선 \$y=x-2\$보다 항상 위쪽에 있도록 하는 정수 \$k\$의 최댓값을 구하는 풀이과정과 답을 서술하시오.

### 선지

없음

### 정답

\$-8\$

### 해설

모든 실수 \$x\$에 대하여 \$x^2-5x-k \> x-2\$, 즉 \$\$ x^2-6x+(2-k) \> 0 \$\$ 이 성립해야 하므로 이차방정식 \$x^2-6x+(2-k)=0\$의 판별식 \$D\<0\$이다. \$\$ \\frac{D}{4} \= (-3)^2-(2-k) \= 7+k \< 0 \\implies k \< \-7 \$\$ 따라서 정수 \$k\$의 최댓값은 \$-8\$이다.

```
{"status": "EXEMPT", "reason": "이차함수가 직선보다 항상 위에 있을 조건을 절대이차부등식 판별식 D<0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$x^2-6x+2-k>0$이 항상 성립할 조건 $D/4=7+k<0$을 풀어 최대 정수 $k=-8$을 구한다.", "decisiveStep": "그래프가 직선보다 항상 위쪽 $\\iff$ 차의 이차식 $>0$의 판별식 $D<0$으로 전환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035 (DIRECT_ACTIVE): 포물선이 직선보다 항상 위쪽에 있을 판별식 조건을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 위치 관계 부등식에 판별식 $D<0$을 적용하는 서술형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $k$의 최댓값을"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-5x-k$"}], "condition": []}, "reasons": {"method": "차의 이차부등식에 판별식 D/4<0을 적용해 최대 정수 -8을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 6

### 발문

봉사동아리 친구들이 불우 이웃 돕기 성금을 마련하기 위하여 크로와플을 만들어 팔기로 하였다. 한 개당 \$1200\$원의 이익을 남기고 팔면 하루에 \$30\$개를 팔 수 있는데, 한 개당 이익금을 \$100\$원씩 줄일 때마다 하루에 \$5\$개씩 더 팔린다고 한다. 하루의 이익금이 최대일 때 하루에 팔리는 크로와플의 개수를 구하시오.

### 선지

없음

### 정답

\$45\$

### 해설

이익금을 \$100x\$원 (\$0\\le x\<12\$) 줄였을 때 하루 총 이익금 \$P\$는 \$\$ P \= (1200-100x)(30+5x) \= 500(12-x)(6+x) \= \-500(x-3)^2+40500 \$\$ 따라서 \$x=3\$일 때 하루 이익금이 최대이며, 이때 하루에 팔리는 크로와플의 개수는 \$30+5\\cdot 3=45\$개이다.

```
{"status": "EXEMPT", "reason": "할인 횟수 x에 대한 총 이익금 이차함수의 최댓값에서 판매 개수를 구하는 순수 활용 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "할인 횟수 $x$로 총 이익금 $P=-500(x-3)^2+40500$을 세워 $x=3$일 때 판매량 $45$개를 구한다.", "decisiveStep": "최댓값을 주는 $x=3$을 판매량 식 $30+5x$에 대입해 개수를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038 (DIRECT_ACTIVE): 이익금 조건을 이차함수로 모델링하여 최댓값 지점을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판매 이익 극대화 활용 문제에서 이차함수 꼭짓점을 구해 판매량을 답하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차함수", "src": "solution", "quote": "-500(x-3)^2+40500"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-500(x-3)^2+40500", "evidenceType": "IMPLIED", "justification": "총 이익금 이차식을 완전제곱식으로 변형해 최댓값 위치 x=3을 구함"}], "given": [{"term": "최댓값", "src": "stem", "quote": "이익금이 최대일 때"}], "condition": []}, "reasons": {"method": "할인 횟수 x에 대한 이익금 이차함수 꼭짓점 x=3에서 판매량 45를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

