

```
{"stem": "21_효천고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/21_효천고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 5.1

### 발문

다항식 \$(2x^3-3x^2+6x-4)-(x^3-2x^2+2x-5)\$를 바르게 계산한 것은?

### 선지

① \$x^3-5x^2+4x+1\$ ② \$x^3-x^2+4x+1\$ ③ \$x^3-x^2+8x+1\$ ④ \$x^3-x^2+4x-9\$ ⑤ \$3x^3-x^2+4x+1\$

### 정답

②

### 해설

괄호 앞의 빼기 부호를 둘째 다항식의 각 항에 분배하여 동류항끼리 정리하면 \$\$ \\begin{aligned} (2x^3-3x^2+6x-4)-(x^3-2x^2+2x-5) &= 2x^3-3x^2+6x-4-x^3+2x^2-2x+5 \\ &= (2-1)x^3+(-3+2)x^2+(6-2)x+(-4+5) \\ &= x^3-x^2+4x+1 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 삼차다항식의 뺄셈을 동류항 정리로 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "둘째 다항식의 각 항의 부호를 반대로 바꾸어 괄호를 푼 뒤 차수별 동류항 계수를 합산한다.", "decisiveStep": "$-(x^3-2x^2+2x-5)$의 부호를 모두 반전하여 $+2x^2, +5$를 정확히 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 두 삼차다항식의 뺄셈을 부호 분배 및 동류항 정리로 직접 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 뺄셈에서 부호 분배와 동류항 덧셈을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "다항식 $(2x^3-3x^2+6x-4)-(x^3-2x^2+2x-5)$"}], "method": [{"term": "동류항", "src": "solution", "quote": "동류항끼리 정리하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(2x^3-3x^2+6x-4)-(x^3-2x^2+2x-5)$"}], "condition": []}, "reasons": {"method": "괄호 부호 분배 후 동류항을 정리해 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 4.9

### 발문

\$x+y=4\$, \$xy=-3\$일 때, \$x^3+y^3\$의 값은?

### 선지

① \$28\$ ② \$52\$ ③ \$76\$ ④ \$100\$ ⑤ \$112\$

### 정답

④

### 해설

곱셈 공식의 변형에 의하여 \$\$ \\begin{aligned} x^3+y^3 &= (x+y)^3-3xy(x+y) \\ &= 4^3-3\\cdot(-3)\\cdot 4 \\ &= 64+36 \= 100 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "합과 곱이 주어질 때 곱셈 공식 변형으로 세제곱의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "곱셈 공식의 변형 $x^3+y^3=(x+y)^3-3xy(x+y)$에 $x+y=4, xy=-3$을 대입한다.", "decisiveStep": "$-3xy(x+y)$에 $xy=-3$을 대입할 때 부호를 $+36$으로 처리한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 합과 곱이 주어질 때 곱셈공식 변형으로 대칭식 x^3+y^3을 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세제곱의 합 곱셈 공식 변형을 한 번 적용해 대입하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식의 변형에 의하여"}], "method": [{"term": "대입", "src": "solution", "quote": "4^3-3\\cdot(-3)\\cdot 4", "evidenceType": "IMPLIED", "justification": "세제곱의 합 변형 공식에 합과 곱을 대입함"}], "given": [{"term": "다항식", "src": "stem", "quote": "$x^3+y^3$의 값은"}], "condition": []}, "reasons": {"method": "곱셈 공식 변형에 합과 곱을 대입해 100을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 5.2

### 발문

최고차항의 계수가 \$1\$인 삼차다항식 \$f(x)=x^3+ax^2+bx+c\$가 \$f(-2)=f(1)=f(3)=7\$을 만족할 때, \$a+b+c\$의 값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

③

### 해설

조건 \$f(1)=7\$에서 \$x=1\$을 \$f(x)\$에 대입하면 \$\$ f(1) \= 1^3+a\\cdot 1^2+b\\cdot 1+c \= 1+a+b+c \= 7 \$\$ 이므로 \$a+b+c=6\$이다.

```
{"status": "EXEMPT", "reason": "삼차다항식에 x=1을 대입하여 계수의 합 a+b+c를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "구하는 식 $a+b+c$가 $f(1)-1$임을 이용해 조건 $f(1)=7$에 $x=1$을 바로 대입한다.", "decisiveStep": "세 조건 $f(-2)=f(1)=f(3)=7$을 전개하지 않고 $f(1)=7$만 선택해 $1+a+b+c=7$을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): f(1)=7에 x=1을 수치대입하여 계수의 합 a+b+c를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 계수 합이 $f(1)$과 연결됨을 파악해 대입 한 번으로 답을 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "$a+b+c$의 값은"}], "method": [{"term": "대입", "src": "solution", "quote": "x=1$을 $f(x)$에 대입하면", "evidenceType": "NAMED"}], "given": [{"term": "삼차식", "src": "stem", "quote": "삼차다항식 $f(x)=x^3+ax^2+bx+c$"}], "condition": []}, "reasons": {"method": "f(1)=7 조건에 x=1을 대입해 a+b+c=6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.8

### 발문

다항식 \$f(x)\$를 \$x-\\dfrac{1}{4}\$로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$R\$이라 할 때, \$f(x)\$를 \$4x-1\$로 나누었을 때의 몫과 나머지를 차례대로 나열한 것은?

### 선지

① \$\\dfrac{1}{4}Q(x),;R\$ ② \$4Q(x),;R\$ ③ \$Q(x),;R\$ ④ \$\\dfrac{1}{4}Q(x),;\\dfrac{1}{4}R\$ ⑤ \$4Q(x),;4R\$

### 정답

①

### 해설

주어진 나눗셈을 항등식으로 나타내면 \$\$ f(x) \= \\left(x-\\dfrac{1}{4}\\right)Q(x)+R \$\$ 이다. \$4x-1 \= 4\\left(x-\\dfrac{1}{4}\\right)\$이므로 이를 변형하면 \$\$ f(x) \= (4x-1)\\cdot\\dfrac{1}{4}Q(x)+R \$\$ 따라서 \$4x-1\$로 나누었을 때의 몫은 \$\\dfrac{1}{4}Q(x)\$이고 나머지는 \$R\$이다.

```
{"status": "EXEMPT", "reason": "나눗셈 항등식에서 일차식의 상수배 변형에 따른 몫과 나머지를 판정하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "$f(x)=\\left(x-\\frac{1}{4}\\right)Q(x)+R$에서 $x-\\frac{1}{4}=\\frac{1}{4}(4x-1)$로 묶어 몫과 나머지를 읽는다.", "decisiveStep": "제수가 $4$배가 되면 몫은 $\\frac{1}{4}$배가 되고 나머지 $R$은 변하지 않음을 항등식으로 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 나눗셈 항등식을 (4x-1) 기준으로 변형해 몫과 나머지를 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 제수의 상수배 변형에 따른 몫의 변화를 항등식 변형으로 확인하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫과 나머지를 차례대로"}], "method": [{"term": "항등식", "src": "solution", "quote": "주어진 나눗셈을 항등식으로 나타내면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "나눗셈 항등식을 (4x-1) 기준으로 변형해 몫과 나머지를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 5.1

### 발문

다항식 \$(x-y+4)(x-y-4)-9\$를 인수분해한 것은?

### 선지

① \$(x-y-1)(x-y+1)\$ ② \$(x-y-3)(x-y+3)\$ ③ \$(x-y-4)(x-y+4)\$ ④ \$(x-y-5)^2\$ ⑤ \$(x-y-5)(x-y+5)\$

### 정답

⑤

### 해설

\$x-y=A\$로 치환하면 \$\$ \\begin{aligned} (x-y+4)(x-y-4)-9 &= (A+4)(A-4)-9 \\ &= A^2-16-9 \\ &= A^2-25 \\ &= (A-5)(A+5) \\ &= (x-y-5)(x-y+5) \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "공통부분 x-y를 치환해 합차 공식으로 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "공통부분 $x-y=A$로 치환해 $(A+4)(A-4)-9=A^2-25$로 정리한 뒤 합차 공식으로 인수분해한다.", "decisiveStep": "치환 후 전개한 $A^2-25$를 $(A-5)(A+5)$로 인수분해하고 원래 식을 되돌린다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "합과 차"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-016(DIRECT_ACTIVE): 공통부분 치환 후 합차 공식으로 인수분해"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공통부분 치환과 합차 공식을 한 번씩 적용하는 기본 인수분해 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해한 것은"}], "method": [{"term": "치환", "src": "solution", "quote": "$x-y=A$로 치환하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(x-y+4)(x-y-4)-9$"}], "condition": []}, "reasons": {"method": "x-y를 A로 치환 후 합차 공식으로 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.9

### 발문

복소수 \$\\dfrac{3-i}{1+3i}\$를 \$a+bi\$ 꼴로 나타낸 것은? (단, \$a, b\$는 실수, \$i=\\sqrt{-1}\$)

### 선지

① \$1-i\$ ② \$3-i\$ ③ \$i\$ ④ \$-i\$ ⑤ \$-1-i\$

### 정답

④

### 해설

분모의 켤레복소수 \$1-3i\$를 분모와 분자에 각각 곱하면 \$\$ \\begin{aligned} \\dfrac{3-i}{1+3i} &= \\dfrac{(3-i)(1-3i)}{(1+3i)(1-3i)} \\ &= \\dfrac{3-9i-i+3i^2}{1^2-(3i)^2} \\ &= \\dfrac{3-10i-3}{1+9} \\ &= \\dfrac{-10i}{10} \= \-i \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "분모의 켤레복소수를 곱해 복소수 나눗셈을 계산하는 순수 연산 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모 $1+3i$의 켤레복소수 $1-3i$를 분자·분모에 곱해 분모를 실수화하고 $i^2=-1$로 정리한다.", "decisiveStep": "분자 $(3-i)(1-3i)=3-10i+3i^2=-10i$에서 실수부가 $0$으로 소거됨을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 분모의 켤레복소수 1-3i를 곱해 분모를 실수화"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레복소수를 이용한 분모의 실수화를 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $\\dfrac{3-i}{1+3i}$"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모의 켤레복소수 $1-3i$를", "evidenceType": "NAMED"}], "given": [{"term": "실수", "src": "stem", "quote": "$a, b$는 실수"}], "condition": [{"term": "실수", "src": "stem", "quote": "$a, b$는 실수"}]}, "reasons": {"method": "분모의 켤레복소수 1-3i를 곱해 실수화함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 5.2

### 발문

\$x\$에 대한 이차방정식 \$x^2-2kx+k^2-2k+6=0\$이 서로 다른 두 실근을 가질 때, 실수 \$k\$의 값의 범위는?

### 선지

① \$k\<3\$ ② \$k\\le 3\$ ③ \$k\>3\$ ④ \$k\\ge 3\$ ⑤ \$k\>-3\$

### 정답

③

### 해설

이차방정식이 서로 다른 두 실근을 가지려면 판별식 \$D\>0\$이어야 한다. \$\$ \\dfrac{D}{4} \= (-k)^2 - (k^2-2k+6) \= k^2-k^2+2k-6 \= 2k-6 \> 0 \$\$ 따라서 \$2k\>6\$이므로 \$k\>3\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 판별식 D>0으로 실수 k의 범위를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "이차방정식 $x^2-2kx+k^2-2k+6=0$의 짝수 판별식 $\\frac{D}{4}=2k-6>0$을 푼다.", "decisiveStep": "$k^2$ 항이 소거되어 일차부등식 $2k-6>0$으로 간단히 정리됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 서로 다른 두 실근 조건에 판별식 D>0 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "서로 다른 두 실근 조건에 판별식 $D>0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "부등식", "src": "solution", "quote": "2k-6 > 0"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$이어야 한다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2kx+k^2-2k+6=0$"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값의 범위"}]}, "reasons": {"method": "짝수 판별식 D/4>0으로 k>3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.8

### 발문

\$3+2i\$, \$3-2i\$를 두 근으로 하고 \$x^2\$의 계수가 \$1\$인 이차방정식은?

### 선지

① \$x^2+6x+13=0\$ ② \$x^2-6x+13=0\$ ③ \$x^2-6x+5=0\$ ④ \$x^2-6x-13=0\$ ⑤ \$x^2+6x-13=0\$

### 정답

②

### 해설

두 근을 \$\\alpha=3+2i\$, \$\\beta=3-2i\$라 하면 두 근의 합과 곱은 \$\$ \\alpha+\\beta \= (3+2i)+(3-2i) \= 6, \\qquad \\alpha\\beta \= (3+2i)(3-2i) \= 9-4i^2 \= 13 \$\$ 이다. 따라서 \$x^2\$의 계수가 \$1\$인 이차방정식은 \$x^2-(\\alpha+\\beta)x+\\alpha\\beta=0\$이므로 \$\$ x^2-6x+13=0 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 복소수 근의 합과 곱으로 이차방정식을 세우는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 근 $3+2i, 3-2i$의 합 $6$과 곱 $13$을 구해 $x^2-(\\alpha+\\beta)x+\\alpha\\beta=0$에 대입한다.", "decisiveStep": "$(3+2i)(3-2i)=9-4i^2=13$에서 $i^2=-1$ 부호를 정확히 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 두 켤레복소수 근의 합과 곱으로 이차방정식 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근이 주어졌을 때 합과 곱으로 이차방정식을 작성하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "두 근의 합과 곱은", "evidenceType": "IMPLIED", "justification": "두 근의 합 6과 곱 13을 이용해 x^2-(합)x+(곱)=0을 세움"}], "given": [{"term": "복소수", "src": "stem", "quote": "$3+2i$, $3-2i$를 두 근으로"}], "condition": []}, "reasons": {"method": "두 켤레복소수 근의 합과 곱으로 이차방정식을 세움"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q09

- 형식: 객관식  
- 배점: 5.1

### 발문

이차함수 \$y=x^2-5x+3\$의 그래프와 직선 \$y=-x+k\$가 한 점에서 만날 때, 실수 \$k\$의 값은?

### 선지

① \$-1\$ ② \$-2\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

①

### 해설

두 그래프가 만나는 점의 \$x\$좌표는 이차방정식 \$\$ x^2-5x+3 \= \-x+k \\iff x^2-4x+(3-k) \= 0 \$\$ 의 실근과 같다. 한 점에서 만나려면 이 이차방정식이 중근을 가져야 하므로 판별식 \$D=0\$이다. \$\$ \\dfrac{D}{4} \= (-2)^2 - (3-k) \= 4-3+k \= k+1 \= 0 \$\$ 따라서 \$k=-1\$이다.

```
{"status": "EXEMPT", "reason": "이차함수와 직선이 한 점에서 만날 조건을 판별식 D=0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 식을 연립한 $x^2-4x+3-k=0$이 중근을 갖도록 판별식 $\\frac{D}{4}=k+1=0$을 푼다.", "decisiveStep": "'한 점에서 만난다'를 연립방정식의 판별식 $D=0$으로 전환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 이차함수와 직선이 한 점에서 만날 접선 조건을 판별식 D=0으로 해결"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 접점 조건을 판별식 $D=0$으로 연결하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값은"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-5x+3$"}], "condition": [{"term": "접함", "src": "stem", "quote": "한 점에서 만날 때"}]}, "reasons": {"method": "연립방정식의 판별식 D/4=0을 풀어 k=-1을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.9

### 발문

어느 야구선수가 공을 쳤을 때, \$x\$초 후 지면에서 공의 높이 \$y\\text{ m}\$는 \$y=-2x^2+8x+3\$으로 나타낼 수 있다고 한다. 이 공이 가장 높이 올라갔을 때의 높이는?

### 선지

① \$7\\text{ m}\$ ② \$9\\text{ m}\$ ③ \$11\\text{ m}\$ ④ \$13\\text{ m}\$ ⑤ \$15\\text{ m}\$

### 정답

③

### 해설

이차함수를 표준형으로 변형하면 \$\$ y \= \-2x^2+8x+3 \= \-2(x^2-4x+4)+8+3 \= \-2(x-2)^2+11 \$\$ 이다. 시간 \$x\>0\$에서 \$x=2\$일 때 최댓값 \$11\$을 가지므로, 공이 가장 높이 올라갔을 때의 높이는 \$11\\text{ m}\$이다.

```
{"status": "EXEMPT", "reason": "이차함수를 표준형으로 고쳐 최댓값을 구하는 실생활 응용 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "이차함수 $y=-2x^2+8x+3$을 완전제곱식 $y=-2(x-2)^2+11$로 변형해 최댓값을 구한다.", "decisiveStep": "꼭짓점의 $x$좌표 $x=2$가 양수 범위($x>0$)에 속함을 확인하고 최댓값 $11$을 읽는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 완전제곱식 변형 후 x>0 범위에서 꼭짓점 최댓값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 표준형 변형으로 최댓값을 바로 읽는 기본 활용 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "solution", "quote": "최댓값 $11$을 가지므로"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-2(x-2)^2+11", "evidenceType": "IMPLIED", "justification": "이차식을 완전제곱식으로 고쳐 꼭짓점의 y좌표를 구함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "$y=-2x^2+8x+3$"}], "condition": []}, "reasons": {"method": "이차함수를 완전제곱식으로 변형해 최댓값 11m를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 3.9

### 발문

\$x=\\sqrt{3}+1\$, \$y=\\sqrt{3}-1\$일 때, \$x^3-y^3\$의 값은?

### 선지

① \$14\$ ② \$20\$ ③ \$24\$ ④ \$20\\sqrt{3}\$ ⑤ \$24\\sqrt{3}\$

### 정답

②

### 해설

주어진 값에서 \$x-y\$, \$xy\$, \$x+y\$를 구하면 \$\$ x-y \= (\\sqrt{3}+1)-(\\sqrt{3}-1) \= 2, \\quad xy \= (\\sqrt{3}+1)(\\sqrt{3}-1) \= 3-1 \= 2, \\quad x+y \= 2\\sqrt{3} \$\$ 이다. 따라서 \$x^2+y^2 \= (x+y)^2-2xy \= (2\\sqrt{3})^2-2\\cdot 2 \= 12-4 \= 8\$이므로 \$x^2+xy+y^2 \= 8+2 \= 10\$이다. 세제곱의 차 공식에 대입하면 \$\$ x^3-y^3 \= (x-y)(x^2+xy+y^2) \= 2\\cdot 10 \= 20 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "켤레무리수의 차와 곱을 구해 세제곱의 차를 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$x-y=2, xy=2, x+y=2\\sqrt{3}$을 먼저 구한 뒤 $x^3-y^3=(x-y)(x^2+xy+y^2)$에 대입한다.", "decisiveStep": "$x^2+y^2=(x+y)^2-2xy=8$을 거쳐 $x^2+xy+y^2=10$을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 켤레무리수의 차·합·곱을 구해 세제곱의 차 곱셈공식에 대입"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레무리수의 차·합·곱을 차례로 구해 세제곱의 차 공식에 대입하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "x^3-y^3 = (x-y)(x^2+xy+y^2)"}], "method": [{"term": "대입", "src": "solution", "quote": "세제곱의 차 공식에 대입하면", "evidenceType": "NAMED"}], "given": [{"term": "무리수", "src": "stem", "quote": "$x=\\sqrt{3}+1$, $y=\\sqrt{3}-1$"}], "condition": []}, "reasons": {"method": "x-y, xy, x+y를 구해 x^3-y^3을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.2

### 발문

부피가 \$(x^3+8x^2+21x+18)\\pi\$인 원기둥의 밑면의 반지름과 높이가 각각 \$x\$의 계수가 \$1\$인 일차식이다. 이 원기둥의 겉넓이가 \$2\\pi(x+a)(bx+5)\$일 때, 상수 \$a, b\$에 대하여 \$ab\$의 값은? (단, \$x\>0\$)

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

부피에서 \$\\pi\$를 제외한 다항식 \$P(x)=x^3+8x^2+21x+18\$에 대하여 \$P(-2)=-8+32-42+18=0\$이므로 조립제법으로 인수분해하면 \$\$ x^3+8x^2+21x+18 \= (x+2)(x^2+6x+9) \= (x+3)^2(x+2) \$\$ 이다. 원기둥의 부피 \$V=\\pi r^2 h\$에서 반지름 \$r\$은 제곱 인수로, 높이 \$h\$는 일차 인수로 나타나고 두 식 모두 \$x\$의 계수가 \$1\$이므로 \$r=x+3\$, \$h=x+2\$이다. 따라서 겉넓이 \$S\$는 \$\$ S \= 2\\pi r^2 \+ 2\\pi rh \= 2\\pi r(r+h) \= 2\\pi(x+3)(2x+5) \$\$ 이므로 \$a=3\$, \$b=2\$이고 \$ab=6\$이다.

```
{"status": "EXEMPT", "reason": "삼차다항식을 인수분해하여 원기둥의 반지름과 높이를 구하고 겉넓이를 비교하는 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "부피의 다항식을 $(x+3)^2(x+2)$로 인수분해해 $r=x+3, h=x+2$를 정하고 겉넓이 $2\\pi r(r+h)$를 구한다.", "decisiveStep": "원기둥 부피 $\\pi r^2 h$의 구조에서 제곱 인수 $(x+3)^2$이 반지름의 제곱임을 판별한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 부피 다항식을 인수분해하여 반지름과 높이를 구하고 겉넓이에 활용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리·조립제법으로 삼차식을 인수분해하고 원기둥의 부피·겉넓이 공식을 연결하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b$에 대하여 $ab$의 값은"}], "method": [{"term": "인수분해", "src": "solution", "quote": "조립제법으로 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "부피", "src": "stem", "quote": "부피가 $(x^3+8x^2+21x+18)\\pi$"}], "condition": [{"term": "일차식", "src": "stem", "quote": "$x$의 계수가 $1$인 일차식"}]}, "reasons": {"method": "부피 다항식을 (x+3)^2(x+2)로 인수분해해 겉넓이 계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.1

### 발문

등식 \$\\left(\\dfrac{4x}{1+\\sqrt{-3}}+\\dfrac{8y}{1-\\sqrt{-3}}\\right)^2=-3\$을 만족시키는 실수 \$x, y\$의 값을 올바르게 구한 것은? (단, \$x\<y\$)

### 선지

① \$x=-\\dfrac{1}{2},;y=\\dfrac{1}{4}\$ ② \$x=\\dfrac{1}{2},;y=-\\dfrac{1}{4}\$ ③ \$x=-\\dfrac{1}{4},;y=\\dfrac{1}{2}\$ ④ \$x=-\\dfrac{1}{2},;y=\\dfrac{1}{2}\$ ⑤ \$x=-\\dfrac{1}{3},;y=\\dfrac{1}{6}\$

### 정답

①

### 해설

각 항의 분모를 실수화하면 \$\$ \\dfrac{4x}{1+\\sqrt{-3}} \= \\dfrac{4x(1-\\sqrt{-3})}{1-(-3)} \= x(1-\\sqrt{-3}), \\qquad \\dfrac{8y}{1-\\sqrt{-3}} \= \\dfrac{8y(1+\\sqrt{-3})}{1-(-3)} \= 2y(1+\\sqrt{-3}) \$\$ 이다. 괄호 안의 식을 정리하면 \$\$ (x+2y) \+ (2y-x)\\sqrt{-3} \$\$ 이고, \$A=x+2y\$, \$B=2y-x\$라 두면 \$A, B\$는 실수이며 \$(A+B\\sqrt{-3})^2 \= \-3\$이다. 좌변을 전개하면 \$\$ (A^2-3B^2) \+ 2AB\\sqrt{-3} \= \-3 \$\$ 복소수가 서로 같을 조건에 의해 \$A^2-3B^2=-3\$, \$2AB=0\$이다. \$B=0\$이면 \$A^2=-3\$이 되어 실수 \$A\$가 존재하지 않으므로 \$A=0\$이다. 따라서 \$-3B^2=-3\$에서 \$B=1\$ 또는 \$B=-1\$이다. \$A=x+2y=0\$에서 \$x=-2y\$이므로 \$B=2y-x=4y\$이다.

- \$B=1\$이면 \$y=\\dfrac{1}{4}\$, \$x=-\\dfrac{1}{2}\$ (\$x\<y\$ 만족)  
- \$B=-1\$이면 \$y=-\\dfrac{1}{4}\$, \$x=\\dfrac{1}{2}\$ (\$x\<y\$ 불만족) 따라서 \$x=-\\dfrac{1}{2}\$, \$y=\\dfrac{1}{4}\$이다.

```
{"status": "EXEMPT", "reason": "분모 실수화 후 복소수 상등 조건과 대소 조건 x<y로 실수 x, y를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "분모를 실수화해 $(x+2y)+(2y-x)\\sqrt{-3}$으로 정리한 뒤 복소수 상등 조건과 $x<y$로 해를 결정한다.", "decisiveStep": "$A^2-3B^2=-3, 2AB=0$에서 실수 조건에 의해 $B=0$이 불가능하므로 $A=0$을 선택한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-022(DIRECT_ACTIVE): 분모 실수화 후 복소수 상등 조건과 x<y로 실수 x, y 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분모 실수화, 복소수 상등, 실수 부호 조건 $x<y$를 순차적으로 판정하는 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $x, y$의 값을"}], "method": [{"term": "복소수", "src": "solution", "quote": "복소수가 서로 같을 조건에 의해", "evidenceType": "NAMED"}], "given": [{"term": "등식", "src": "stem", "quote": "등식 $\\left(\\dfrac{4x}{1+\\sqrt{-3}}+\\dfrac{8y}{1-\\sqrt{-3}}\\right)^2=-3$"}], "condition": [{"term": "실수", "src": "stem", "quote": "단, $x<y$"}]}, "reasons": {"method": "분모 실수화 후 복소수 상등과 x<y 조건으로 연립방정식을 품"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 3.8

### 발문

그림과 같이 일차함수 \$y=f(x)\$의 그래프는 점 \$(6,0)\$을 지나고, 이차함수 \$y=g(x)\$의 그래프는 직선 \$x=6\$을 축으로 한다. 두 함수 \$y=f(x)\$와 \$y=g(x)\$의 그래프가 만나는 서로 다른 두 점의 \$x\$좌표가 각각 \$3, 12\$일 때, 방정식 \$f(x)+\|g(x)\|=0\$의 실근의 개수는? (단, 두 함수 \$f(x), g(x)\$의 최고차항의 계수는 양수이다.)

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

③

### 해설

일차함수 \$y=f(x)\$는 점 \$(6,0)\$을 지나고 최고차항의 계수가 양수이므로 \$\$ f(x) \= m(x-6) \\quad (m\>0) \$\$ 이라 둘 수 있다. 이차함수 \$y=g(x)\$는 직선 \$x=6\$을 축으로 하고 최고차항의 계수가 양수이므로 \$\$ g(x) \= a(x-6)^2+c \\quad (a\>0) \$\$ 이라 둘 수 있다. \$t=x-6\$이라 하면 두 교점의 \$t\$좌표는 \$t=3-6=-3\$과 \$t=12-6=6\$이다. 두 함수의 값이 같으므로 \$\$ \-3m \= 9a+c, \\qquad 6m \= 36a+c \$\$ 두 식을 빼면 \$9m=27a\$에서 \$m=3a\$이고, 이를 첫째 식에 대입하면 \$-9a=9a+c\$에서 \$c=-18a\$이다. 따라서 방정식 \$f(x)+\|g(x)\|=0\$은 \$\$ 3at \+ \|a(t^2-18)\| \= a{3t \+ \|t^2-18\|} \= 0 \$\$ 이고 \$a\>0\$이므로 \$3t \+ \|t^2-18\| \= 0\$과 동치이다.

1) \$t^2-18 \\ge 0\$ (즉, \$\|t\| \\ge 3\\sqrt{2}\$)일 때: \$\$ t^2+3t-18 \= (t+6)(t-3) \= 0 \\implies t=-6 \\text{ 또는 } t=3 \$\$ 이 중 \$\|t\| \\ge 3\\sqrt{2}\$를 만족하는 것은 \$t=-6\$뿐이다.  
2) \$t^2-18 \\le 0\$ (즉, \$\|t\| \\le 3\\sqrt{2}\$)일 때: \$\$ \-t^2+3t+18 \= \-(t-6)(t+3) \= 0 \\implies t=-3 \\text{ 또는 } t=6 \$\$ 이 중 \$\|t\| \\le 3\\sqrt{2}\$를 만족하는 것은 \$t=-3\$뿐이다. 따라서 실근은 \$t=-6, \-3\$, 즉 \$x=0, 3\$의 \$2\$개이다.

```
{"status": "READY", "pattern": "piecewise-polynomial-spike-v1", "viewBox": "0 0 420 320", "axes": {"xRange": [-1, 15], "yRange": [-6, 7], "origin": [6, 0]}, "elements": [{"type": "curve", "id": "parabola_g", "expr": "0.25*(x-6)**2 - 4.5", "domain": [0.5, 13.5], "label": "$y=g(x)$"}, {"type": "line", "id": "line_f", "expr": "0.75*(x-6)", "domain": [0, 14], "label": "$y=f(x)$"}, {"type": "dashed_line", "id": "axis_x6", "points": [[6, -5.5], [6, 6]], "label": "$x=6$"}, {"type": "point", "coords": [3, -2.25], "label": "$3$", "projX": true}, {"type": "point", "coords": [6, 0], "label": "$6$"}, {"type": "point", "coords": [12, 4.5], "label": "$12$", "projX": true}], "note": "x=6을 축으로 하는 아래로 볼록 이차함수 g(x)=(1/4)(x-6)^2-9/2와 (6,0)을 지나는 증가 직선 f(x)=(3/4)(x-6)의 교점 x=3, 12를 표시"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$t=x-6$으로 평행이동해 $f, g$의 계수 관계 $m=3a, c=-18a$를 구한 뒤 절댓값 방정식 $3t+|t^2-18|=0$을 구간별로 푼다.", "decisiveStep": "교점 조건 $x=3, 12$로 미지수를 $a$ 하나로 줄이고, 절댓값 부호 구간 $|t|\\ge 3\\sqrt{2}$에서 후보 근을 걸러낸다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 이차함수와 직선의 교점 조건으로 계수를 구하고 절댓값 방정식의 실근 개수를 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "그림에서 축과 교점 정보를 읽어 두 함수의 계수를 하나로 통일하고 절댓값 방정식의 근 개수를 판정하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "실근의 개수는?"}], "method": [{"term": "절댓값", "src": "solution", "quote": "3t + |t^2-18| = 0", "evidenceType": "IMPLIED", "justification": "계수를 a로 통일한 뒤 절댓값 안의 부호 구간에 따라 방정식을 나누어 품"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=g(x)$의 그래프"}], "condition": [{"term": "양수", "src": "stem", "quote": "최고차항의 계수는 양수이다"}]}, "reasons": {"method": "교점 조건으로 계수를 통일해 절댓값 방정식의 실근 개수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 3.5

### 발문

\$x\$에 대한 다항식 \$ax^7+bx^6+1\$이 다항식 \$x^2-x-1\$로 나누어떨어지기 위한 정수 \$a\$의 값은?

### 선지

① \$5\$ ② \$8\$ ③ \$13\$ ④ \$21\$ ⑤ \$34\$

### 정답

②

### 해설

\$x^2-x-1\$로 나눈 나머지를 구하기 위해 \$x^2 \\equiv x+1\$로 차수를 낮추어 차례로 계산하면 \$\$ \\begin{aligned} x^2 &\\equiv x+1 \\ x^3 &\\equiv x(x+1) \= x^2+x \\equiv 2x+1 \\ x^4 &\\equiv x(2x+1) \= 2x^2+x \\equiv 3x+2 \\ x^5 &\\equiv x(3x+2) \= 3x^2+2x \\equiv 5x+3 \\ x^6 &\\equiv x(5x+3) \= 5x^2+3x \\equiv 8x+5 \\ x^7 &\\equiv x(8x+5) \= 8x^2+5x \\equiv 13x+8 \\end{aligned} \$\$ 이다. 따라서 \$ax^7+bx^6+1\$을 \$x^2-x-1\$로 나눈 나머지는 \$\$ a(13x+8)+b(8x+5)+1 \= (13a+8b)x+(8a+5b+1) \$\$ 이고, 나누어떨어지려면 \$\$ 13a+8b=0, \\qquad 8a+5b+1=0 \$\$ 이어야 한다. 첫째 식에 \$5\$, 둘째 식에 \$8\$을 곱하면 \$65a+40b=0\$, \$64a+40b+8=0\$이므로 두 식을 빼면 \$a-8=0\$, 즉 \$a=8\$이다. (이때 \$b=-13\$)

```
{"status": "EXEMPT", "reason": "이차식 x^2-x-1=0의 차수 낮추기로 고차식 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x^2\\equiv x+1$을 반복 적용해 $x^6, x^7$을 일차식으로 줄인 뒤 나머지 계수가 모두 $0$이 되도록 연립방정식을 푼다.", "decisiveStep": "$13a+8b=0, 8a+5b+1=0$을 연립해 정수 $a=8$을 결정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 이차식 x^2-x-1로 나눈 나머지를 차수 낮추기로 구해 미정계수 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "차수 낮추기 점화 구조로 고차 다항식의 나머지를 일차식으로 환원해 계수를 비교하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $a$의 값은?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "x^2 \\equiv x+1$로 차수를 낮추어", "evidenceType": "IMPLIED", "justification": "x^2=x+1 관계를 반복 적용해 나눗셈의 나머지를 일차식으로 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $ax^7+bx^6+1$"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $a$의 값은?"}]}, "reasons": {"method": "x^2=x+1 차수 낮추기로 나머지를 0으로 두어 a=8을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 3.5

### 발문

삼차다항식 \$f(x)\$에 대하여 \$f(x)\$는 \$x^2-1\$로 나누어떨어지고, \$f(x^3+1)\$을 \$x^2-1\$로 나누면 나머지가 \$6x+9\$이다. \$f(3)\$의 값은?

### 선지

① \$48\$ ② \$56\$ ③ \$64\$ ④ \$72\$ ⑤ \$80\$

### 정답

④

### 해설

삼차다항식 \$f(x)\$가 \$x^2-1\$로 나누어떨어지므로 \$f(x) \= (x^2-1)(ax+b)\$ (\$a, b\$는 상수)로 놓을 수 있다. \$x^2-1\$로 나눈 나머지를 구할 때 \$x^2 \\equiv 1\$이므로 \$x^3+1 \= x\\cdot x^2+1 \\equiv x+1\$이다. 따라서 \$\$ \\begin{aligned} f(x^3+1) &= ((x^3+1)^2-1){a(x^3+1)+b} \\ &\\equiv ((x+1)^2-1)(ax+a+b) \\ &= (x^2+2x)(ax+a+b) \\ &\\equiv (2x+1)(ax+a+b) \\ &= 2ax^2+(3a+2b)x+(a+b) \\ &\\equiv (3a+2b)x+(3a+b) \\end{aligned} \$\$ 이다. 이 나머지가 \$6x+9\$와 같으므로 \$\$ 3a+2b=6, \\qquad 3a+b=9 \$\$ 두 식을 빼면 \$b=-3\$이고 \$3a-3=9\$에서 \$a=4\$이다. 그러므로 \$f(x)=(x^2-1)(4x-3)\$이고 \$f(3)=(3^2-1)(4\\cdot 3-3)=8\\cdot 9=72\$이다.

```
{"status": "EXEMPT", "reason": "합성식 f(x^3+1)을 x^2-1로 나눈 나머지를 x^2=1 치환으로 구해 f(x)를 결정하는 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$f(x)=(x^2-1)(ax+b)$로 두고 $x^2\\equiv 1$을 이용해 $f(x^3+1)$의 나머지를 구한 뒤 $6x+9$와 비교한다.", "decisiveStep": "$x^3+1\\equiv x+1$과 $x^2+2x\\equiv 2x+1$로 차수를 줄여 $(3a+2b)x+(3a+b)$를 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 이차식 x^2-1로 나눈 나머지를 x^2=1 변형으로 구해 f(x) 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 설정과 $x^2\\equiv 1$ 합동 변형을 결합해 미정계수를 결정하는 중상 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "method": [{"term": "계수비교", "src": "solution", "quote": "나머지가 $6x+9$와 같으므로", "evidenceType": "IMPLIED", "justification": "x^2=1 대입으로 일차 나머지를 구한 뒤 6x+9와 계수 비교함"}], "given": [{"term": "삼차식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "f(x)=(x^2-1)(ax+b) 설정 후 x^2=1 변형으로 계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 3.1

### 발문

\$xyz=36\$이고 \$\\dfrac{1}{x}+\\dfrac{1}{z}=\\dfrac{2}{y}\$를 만족시키는 자연수 \$x, y, z\$에 대하여 \$x+y+z\$의 값은? (단, \$x\>y\>z\$이다.)

### 선지

① \$7\$ ② \$8\$ ③ \$9\$ ④ \$10\$ ⑤ \$11\$

### 정답

⑤

### 해설

\$u=xz\$라 두면 \$xyz=36\$에서 \$y=\\dfrac{36}{u}\$이다. 주어진 식을 정리하면 \$\$ \\dfrac{1}{x}+\\dfrac{1}{z} \= \\dfrac{x+z}{xz} \= \\dfrac{x+z}{u} \= \\dfrac{2}{y} \= \\dfrac{2u}{36} \= \\dfrac{u}{18} \$\$ 이므로 \$x+z \= \\dfrac{u^2}{18}\$이다. \$x, z\$가 자연수이므로 \$u\$는 \$36\$의 약수이면서 \$u^2\$이 \$18=2\\cdot 3^2\$의 배수여야 하므로 \$u\$는 \$6\$의 배수이다. 따라서 가능한 값은 \$u=6, 12, 18, 36\$이다. \$S=x+z=\\dfrac{u^2}{18}\$라 두면 \$x, z\$는 이차방정식 \$r^2-Sr+u=0\$의 두 근이므로 판별식 \$D=S^2-4u\$가 \$0\$ 이상의 제곱수여야 한다.

- \$u=6\$: \$S=2,; D=4-24=-20 \< 0\$ (불가능)  
- \$u=12\$: \$S=8,; D=64-48=16=4^2\$ (가능)  
- \$u=18\$: \$S=18,; D=324-72=252\$ (\$15^2\<252\<16^2\$, 제곱수 아님)  
- \$u=36\$: \$S=72,; D=5184-144=5040\$ (\$70^2\<5040\<71^2\$, 제곱수 아님) 따라서 \$u=12\$뿐이다. 이때 \$x+z=8, xz=12\$이므로 \$r^2-8r+12=(r-2)(r-6)=0\$이고, \$x\>z\$에서 \$x=6, z=2\$이다. 또한 \$y=\\dfrac{36}{12}=3\$으로 \$x\>y\>z\$를 만족한다. 그러므로 \$x+y+z=6+3+2=11\$이다.

```
{"status": "EXEMPT", "reason": "자연수 조건과 대칭식 치환 u=xz를 이용해 부정방정식의 유일한 해를 구하는 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$u=xz$로 치환해 $x+z=\\frac{u^2}{18}$을 유도하고, $u$의 약수 후보 중 판별식 $S^2-4u$가 제곱수인 경우를 찾는다.", "decisiveStep": "자연수 조건에서 $u$가 $6$의 배수인 $36$의 약수로 좁혀짐을 이용해 $4$개 후보만 검증한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY): 자연수 조건 부정방정식은 현재 ACTIVE에 대응 키가 없어 RPM 경로만 보존"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수식 정리, 약수·배수 제한, 이차방정식 판별식의 제곱수 조건을 결합한 심화 부정방정식 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "자연수 $x, y, z$에 대하여 $x+y+z$의 값은"}], "method": [{"term": "부정방정식", "src": "solution", "quote": "판별식 $D=S^2-4u$가 $0$ 이상의 제곱수여야 한다", "evidenceType": "IMPLIED", "justification": "자연수 해 조건을 u=xz의 약수 범위와 이차방정식 판별식 제곱수 조건으로 해결함"}], "given": [{"term": "등식", "src": "stem", "quote": "$xyz=36$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $x, y, z$"}]}, "reasons": {"method": "u=xz 치환 후 약수 조건과 판별식 제곱수 조건으로 해를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q18

- 형식: 객관식  
- 배점: 3.9

### 발문

삼차다항식 \$P(x)=ax^3+(2a+b)x^2+(a+2b)x+2a+5b\$를 복소수의 범위에서 인수분해하면 \$a(x-p)(x-q)(x-r)\$일 때, \$\\dfrac{1}{p+q}+\\dfrac{1}{q+r}+\\dfrac{1}{r+p}\$의 최댓값은? (단, \$a\\ne 0\$, \$b\\ne 0\$이다.)

### 선지

① \$\\dfrac{2}{5}\$ ② \$\\dfrac{1}{2}\$ ③ \$\\dfrac{3}{5}\$ ④ \$\\dfrac{4}{5}\$ ⑤ \$1\$

### 정답

①

### 해설

\$t=\\dfrac{b}{a}\$라 두면 \$a, b\\ne 0\$이므로 \$t\\ne 0\$이고 \$\$ \\dfrac{P(x)}{a} \= x^3+(2+t)x^2+(1+2t)x+(2+5t) \$\$ 이다. 삼차방정식 \$P(x)=0\$의 세 근이 \$p, q, r\$이므로 근과 계수의 관계에 의하여 \$\$ s\_1 \= p+q+r \= \-(2+t), \\quad s\_2 \= pq+qr+rp \= 1+2t, \\quad s\_3 \= pqr \= \-(2+5t) \$\$ 이다. 구하는 식을 통분하면 분자는 \$\$ (q+r)(r+p)+(r+p)(p+q)+(p+q)(q+r) \= p^2+q^2+r^2+3(pq+qr+rp) \= s\_1^2+s\_2 \$\$ 이고, 분모는 \$(s\_1-r)(s\_1-p)(s\_1-q) \= s\_1s\_2-s\_3\$이다. 각각 \$t\$로 나타내면 \$\$ s\_1^2+s\_2 \= (2+t)^2+(1+2t) \= t^2+6t+5 \$\$ \$\$ s\_1s\_2-s\_3 \= \-(2+t)(1+2t)+(2+5t) \= \-(2+5t+2t^2)+(2+5t) \= \-2t^2 \$\$ 이므로 \$\$ \\dfrac{s\_1^2+s\_2}{s\_1s\_2-s\_3} \= \\dfrac{t^2+6t+5}{-2t^2} \= \-\\dfrac{1}{2}-\\dfrac{3}{t}-\\dfrac{5}{2t^2} \= \-\\dfrac{5}{2}\\left(\\dfrac{1}{t}+\\dfrac{3}{5}\\right)^2+\\dfrac{2}{5} \$\$ 이다. \$\\dfrac{1}{t}=-\\dfrac{3}{5}\$ (즉 \$t=-\\dfrac{5}{3}\$)일 때 실수 조건 \$a, b\\ne 0\$을 만족하며 최댓값은 \$\\dfrac{2}{5}\$이다.

```
{"status": "EXEMPT", "reason": "삼차방정식의 근과 계수의 관계와 대칭식 변형 후 이차식의 최댓값을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$t=\\frac{b}{a}$로 두고 삼차방정식의 근과 계수의 관계로 $s_1, s_2, s_3$을 나타낸 뒤 $\\frac{s_1^2+s_2}{s_1s_2-s_3}$을 $\\frac{1}{t}$의 이차식으로 만든다.", "decisiveStep": "분모 $s_1s_2-s_3$이 $-2t^2$의 단항식으로 정리됨을 포착해 $\\frac{1}{t}$에 대한 완전제곱식으로 최댓값을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계로 대칭식의 값을 정리해 최댓값 산출"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B34", "difficultyReason": "삼차식 근과 계수의 관계, 3변수 대칭식 통분, $\\frac{1}{t}$ 치환 최대가 결합된 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "삼차식", "src": "stem", "quote": "삼차다항식 $P(x)=ax^3+(2a+b)x^2+(a+2b)x+2a+5b$"}], "condition": []}, "reasons": {"method": "t=b/a 치환과 근과 계수의 관계로 분수식을 1/t의 이차식으로 정리함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q19

- 형식: 서답형  
- 배점: 5

### 발문

서술형 1번. 다음 등식이 \$x\$에 대한 항등식이 되도록 상수 \$a, b, c\$의 값을 구하시오.

\$2x^2-5x+7=a(x-2)(x+1)+b(x-2)+c\$

### 선지

없음

### 정답

\$a=2,;b=-3,;c=5\$

### 해설

우변을 전개하여 \$x\$에 대하여 내림차순 정리하면 \$\$ \\begin{aligned} a(x-2)(x+1)+b(x-2)+c &= a(x^2-x-2)+bx-2b+c \\ &= ax^2+(-a+b)x+(-2a-2b+c) \\end{aligned} \$\$ 이다. \$x\$에 대한 항등식이므로 양변의 같은 차수의 계수를 비교하면 \$\$ a=2, \\qquad \-a+b=-5, \\qquad \-2a-2b+c=7 \$\$ 이다. \$a=2\$를 둘째 식에 대입하면 \$-2+b=-5\$이므로 \$b=-3\$이고, 이를 셋째 식에 대입하면 \$-4+6+c=7\$이므로 \$c=5\$이다. 따라서 \$a=2,;b=-3,;c=5\$이다.

```
{"status": "EXEMPT", "reason": "이차 항등식을 전개해 계수비교법으로 미정계수를 구하는 서술형 기본 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "우변을 전개해 $ax^2+(-a+b)x+(-2a-2b+c)$로 정리한 뒤 좌변과 계수비교법을 적용한다.", "decisiveStep": "이차항, 일차항, 상수항 계수를 순서대로 비교해 $a, b, c$를 순차적으로 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 우변을 전개하여 계수비교법으로 미정계수 a, b, c 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차 항등식에서 전개와 계수비교법을 바로 적용하는 서술형 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b, c$의 값을"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "IMPLIED", "justification": "우변을 내림차순 전개한 뒤 좌변과 차수별 계수를 비교함"}], "given": [{"term": "항등식", "src": "stem", "quote": "$x$에 대한 항등식"}], "condition": []}, "reasons": {"method": "우변 전개 후 계수비교법으로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 5

### 발문

서술형 2번. 삼차다항식 \$f(x)\$가 다음 조건을 만족한다.

(가) \$f(2)=3\$ (나) \$f(x)\$를 \$(x-2)^2\$으로 나눈 몫과 나머지가 같다.

\$f(x)\$를 \$(x-2)^3\$으로 나눈 나머지를 \$R(x)\$라 하자. \$R(1)=R(4)\$일 때, \$R(x)\$를 구하시오.

### 선지

없음

### 정답

\$R(x)=3x^2-15x+21\$

### 해설

\$u=x-2\$로 두면 \$f(x)\$는 삼차식이므로 \$u^2\$으로 나눈 몫은 일차식이고 나머지는 일차 이하의 다항식이다. 조건 (나)에 의해 몫과 나머지가 같으므로 공통식을 \$mu+n\$이라 놓으면 \$\$ f(x) \= u^2(mu+n)+(mu+n) \= mu^3+nu^2+mu+n \$\$ 이다. 조건 (가)에서 \$f(2)=3\$, 즉 \$u=0\$일 때 값이 \$3\$이므로 \$n=3\$이다. \$f(x)\$를 \$u^3=(x-2)^3\$으로 나눈 나머지 \$R(x)\$는 \$mu^3\$을 제외한 부분이므로 \$\$ R(x) \= 3u^2+mu+3 \= 3(x-2)^2+m(x-2)+3 \$\$ 이다. 이제 \$R(1)=R(4)\$를 대입하면 \$\$ R(1) \= 3(-1)^2+m(-1)+3 \= 6-m, \\qquad R(4) \= 3(2)^2+m(2)+3 \= 15+2m \$\$ 이므로 \$6-m \= 15+2m \\implies 3m=-9 \\implies m=-3\$이다. 따라서 \$\$ R(x) \= 3(x-2)^2-3(x-2)+3 \= 3(x^2-4x+4)-3x+6+3 \= 3x^2-15x+21 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차다항식을 (x-2)^2으로 나눈 몫과 나머지가 같다는 조건으로 (x-2)^3 나머지를 구하는 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$u=x-2$로 치환해 $f(x)=u^2(mu+n)+(mu+n)$으로 세우고 $f(2)=3$과 $R(1)=R(4)$로 $n, m$을 결정한다.", "decisiveStep": "$f(x)=mu^3+nu^2+mu+n$에서 $(x-2)^3$으로 나눈 나머지가 $nu^2+mu+n$임을 바로 분리한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_NESTED_DIVISION", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): (x-2)^2과 (x-2)^3의 중첩 나눗셈 항등식으로 R(x) 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "몫과 나머지가 같다는 나눗셈 조건을 $x-2$ 거듭제곱 꼴로 설정해 푸는 표준 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 하자"}], "method": [{"term": "치환", "src": "solution", "quote": "$u=x-2$로 두면", "evidenceType": "IMPLIED", "justification": "x-2를 u로 치환해 나눗셈 항등식과 나머지를 간명히 표현함"}], "given": [{"term": "삼차식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "u=x-2 치환으로 나눗셈 항등식을 세워 R(x)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 4

### 발문

서술형 3번. 함수 \$f(x)=\|x^2-2x-3\|\$의 그래프와 직선 \$y=x+k\$가 서로 다른 세 점에서 만나도록 하는 정수 \$k\$에 대하여 \$10k\$의 값을 구하시오.

### 선지

없음

### 정답

\$10\$

### 해설

두 그래프의 교점의 \$x\$좌표는 방정식 \$\|x^2-2x-3\|=x+k\$, 즉 \$\$ h(x) \= \|x^2-2x-3\|-x \= k \$\$ 의 실근과 같다. \$x^2-2x-3=(x-3)(x+1)\$이므로 구간을 나누면

- \$x \\le \-1\$ 또는 \$x \\ge 3\$일 때: \$\$ h(x) \= x^2-3x-3 \= \\left(x-\\dfrac{3}{2}\\right)^2-\\dfrac{21}{4} \$\$ (\$x \\le \-1\$에서 \$h(-1)=1\$이고 감소하다가 \$x \\le \-1\$로 갈수록 증가, \$x \\ge 3\$에서 \$h(3)=-3\$이고 계속 증가)  
- \$-1 \\le x \\le 3\$일 때: \$\$ h(x) \= \-x^2+x+3 \= \-\\left(x-\\dfrac{1}{2}\\right)^2+\\dfrac{13}{4} \$\$ (양 끝값 \$h(-1)=1, h(3)=-3\$, 최댓값 \$h\\left(\\dfrac{1}{2}\\right)=\\dfrac{13}{4}\$) 따라서 직선 \$y=k\$와 \$y=h(x)\$의 교점의 개수는  
- \$k \< \-3\$: \$0\$개, \$k \= \-3\$: \$1\$개, \$-3 \< k \< 1\$: \$2\$개  
- \$k \= 1\$: \$x=-1\$과 \$(-1, 3)\$ 내부, \$x\>3\$에서 각 \$1\$개씩 총 \$3\$개  
- \$1 \< k \< \\dfrac{13}{4}\$: \$4\$개, \$k \= \\dfrac{13}{4}\$: \$3\$개, \$k \> \\dfrac{13}{4}\$: \$2\$개 서로 다른 세 점에서 만나는 \$k\$는 \$k=1\$ 또는 \$k=\\dfrac{13}{4}\$이고, \$k\$는 정수이므로 \$k=1\$이다. 따라서 \$10k=10\$이다.

```
{"status": "EXEMPT", "reason": "절댓값 이차함수와 직선의 교점 개수를 h(x)=k의 구간별 증감으로 분석하는 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$h(x)=|x^2-2x-3|-x=k$로 변형해 $x=-1, 3$을 경계로 구간별 그래프와 $y=k$의 교점 개수를 센다.", "decisiveStep": "구간 경계값 $h(-1)=1$과 꼭짓점 최댓값 $\\frac{13}{4}$에서 교점이 $3$개가 됨을 찾고 정수 조건으로 $k=1$을 택한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 절댓값 이차함수와 직선의 교점 개수가 3개가 되는 정수 k 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 포함 방정식을 $h(x)=k$로 분리해 구간별 이차함수의 최댓값·경계값으로 실근 개수를 판정하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $k$에 대하여 $10k$의 값을"}], "method": [{"term": "절댓값", "src": "stem", "quote": "함수 $f(x)=|x^2-2x-3|$", "evidenceType": "IMPLIED", "justification": "절댓값 안의 이차식 부호가 바뀌는 x=-1, 3을 기준으로 h(x)=k의 구간별 그래프를 분석함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "함수 $f(x)=|x^2-2x-3|$"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $k$에 대하여"}]}, "reasons": {"method": "h(x)=|x^2-2x-3|-x=k의 구간별 경계값으로 교점 3개인 정수 k=1을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 6

### 발문

서술형 4번. \$x^2\$의 계수가 \$a\$인 이차다항식 \$f(x)\$를 \$x+1\$로 나누었을 때 몫이 \$Q\_1(x)\$, 나머지가 \$2a\$이고, \$x^2\$의 계수가 \$b\$인 이차다항식 \$g(x)\$를 \$x+3\$으로 나누었을 때 몫이 \$Q\_2(x)\$, 나머지가 \$2b\$이다. \$x^2=-1\$의 한 근 \$w\$에 대하여 \$Q\_1(w^3+3w^2+w)=2\$, \$Q\_2(w^3+w^2+w)=2\$일 때, \$xf(x)+xg(x)\$를 \$x^2+4x+3\$으로 나눈 몫과 나머지를 구하시오.

### 선지

없음

### 정답

몫: \$(a+b)x+4\$, 나머지: \$(2a+2b-8)x-12\$

### 해설

\$w^2=-1\$이므로 \$w^3=w\\cdot w^2=-w\$이다. 따라서 \$\$ w^3+3w^2+w \= \-w-3+w \= \-3, \\qquad w^3+w^2+w \= \-w-1+w \= \-1 \$\$ 이다. \$f(x), g(x)\$는 각각 \$x^2\$의 계수가 \$a, b\$인 이차다항식이므로 일차식으로 나눈 몫을 \$\$ Q\_1(x) \= ax+c\_1, \\qquad Q\_2(x) \= bx+c\_2 \$\$ 이라 둘 수 있다. 주어진 조건에 대입하면 \$\$ Q\_1(-3) \= \-3a+c\_1 \= 2 \\implies c\_1 \= 3a+2, \\qquad Q\_2(-1) \= \-b+c\_2 \= 2 \\implies c\_2 \= b+2 \$\$ 이다. 따라서 \$\$ \\begin{aligned} f(x) &= (x+1)(ax+3a+2)+2a \= ax^2+(4a+2)x+(5a+2) \\ g(x) &= (x+3)(bx+b+2)+2b \= bx^2+(4b+2)x+(5b+6) \\end{aligned} \$\$ 이다. \$s=a+b\$라 두면 \$\$ f(x)+g(x) \= sx^2+(4s+4)x+(5s+8) \$\$ 이므로 \$\$ xf(x)+xg(x) \= sx^3+(4s+4)x^2+(5s+8)x \$\$ 이다. 이를 \$x^2+4x+3\$으로 나누기 위해 몫을 \$sx+4\$로 두고 곱하면 \$\$ (x^2+4x+3)(sx+4) \= sx^3+(4s+4)x^2+(3s+16)x+12 \$\$ 원래 식에서 이를 빼면 나머지는 \$((5s+8)-(3s+16))x-12 \= (2s-8)x-12\$이다. \$s=a+b\$를 대입하면 몫은 \$(a+b)x+4\$, 나머지는 \$(2a+2b-8)x-12\$이다.

```
{"status": "EXEMPT", "reason": "복소수 w^2=-1의 차수 축소와 두 이차다항식의 나눗셈 항등식을 결합한 서술형 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "$w^2=-1$로 대입값을 $-3, -1$로 줄여 $Q_1, Q_2$와 $f(x), g(x)$를 결정한 뒤 $xf(x)+xg(x)$를 $x^2+4x+3$으로 나눈다.", "decisiveStep": "$w^3=-w$를 이용해 $w^3+3w^2+w=-3$과 $w^3+w^2+w=-1$을 먼저 상수로 간단히 한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): f(x), g(x) 복원 후 xf(x)+xg(x)를 이차식으로 나눈 몫과 나머지 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B34", "difficultyReason": "복소수 거듭제곱 계산, 나눗셈 항등식으로 이차식 복원, 삼차식 직접 나눗셈이 결합된 종합 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 몫과 나머지를 구하시오"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "이를 $x^2+4x+3$으로 나누기 위해", "evidenceType": "IMPLIED", "justification": "f(x), g(x)를 복원한 뒤 xf(x)+xg(x)를 x^2+4x+3으로 직접 나누어 몫과 나머지를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "이차다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "w^2=-1로 Q1, Q2 조건을 풀고 xf(x)+xg(x)를 x^2+4x+3으로 나눔"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

