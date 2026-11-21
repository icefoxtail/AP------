

```
{"stem": "22_팔마고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_팔마고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

실수 \$x\$, \$y\$에 대하여 등식 \$3-2i \= (x-1)+(y+4)i\$가 성립할 때, \$x\$, \$y\$의 값을 구하면?

### 선지

① \$x=2\$, \$y=-6\$ ② \$x=4\$, \$y=-6\$ ③ \$x=4\$, \$y=2\$ ④ \$x=-4\$, \$y=-6\$ ⑤ \$x=2\$, \$y=6\$

### 정답

②

### 해설

복소수가 서로 같을 조건에 의하여 실수부분과 허수부분이 각각 같으므로 \$\$ x-1=3, \\quad y+4=-2 \$\$ 따라서 \$x=4\$, \$y=-6\$이다.

```
{"status": "EXEMPT", "reason": "복소수 상등 조건으로 실수부·허수부를 비교하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "복소수가 서로 같을 조건으로 실수부분 $x-1=3$과 허수부분 $y+4=-2$를 연립해 $x, y$를 구한다.", "decisiveStep": "실수 $x, y$ 조건을 근거로 실수부분과 허수부분을 각각 $3$, $-2$와 같다고 둔다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-022(DIRECT_ACTIVE): 서로 같은 복소수 조건으로 실수부와 허수부를 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 상등의 기본 성질을 직접 적용하는 단단계 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $x$, $y$에 대하여"}], "method": [{"term": "복소수", "src": "solution", "quote": "복소수가 서로 같을 조건에 의하여", "evidenceType": "IMPLIED", "justification": "복소수의 상등 성질을 이용해 실수부분과 허수부분을 각각 비교함"}], "given": [{"term": "실수부분", "src": "solution", "quote": "실수부분과 허수부분이"}], "condition": []}, "reasons": {"method": "복소수 상등 조건으로 실수부분과 허수부분을 각각 비교해 x, y를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

두 다항식 \$A=x^3-2x+1\$, \$B=2x^2+3x-4\$에 대하여 \$X+B=2A\$를 만족시키는 다항식 \$X\$는?

### 선지

① \$2x^3+2x^2-7x+6\$ ② \$2x^3-2x^2-x-2\$ ③ \$2x^3-2x^2+7x+6\$ ④ \$2x^3-2x^2-7x+6\$ ⑤ \$2x^3-2x^2-7x-2\$

### 정답

④

### 해설

\$X=2A-B\$이므로 \$\$ \\begin{aligned} X &= 2(x^3-2x+1)-(2x^2+3x-4) \\ &= (2x^3-4x+2)+(-2x^2-3x+4) \\ &= 2x^3-2x^2-7x+6 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "다항식 일차식 X+B=2A를 정리해 동류항을 계산하는 순수 연산 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$X=2A-B$로 식을 정리한 뒤 주어진 다항식 $A, B$를 대입하여 동류항끼리 계산한다.", "decisiveStep": "$2A$를 전개하고 $-B$의 부호를 반전해 차수별로 동류항을 정리한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): X=2A-B 정리 후 다항식의 덧셈·뺄셈 동류항을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 실수배와 뺄셈을 직접 수행하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "만족시키는 다항식 $X$"}], "method": [{"term": "동류항", "src": "solution", "quote": "X=2A-B$이므로", "evidenceType": "IMPLIED", "justification": "X에 대해 정리한 뒤 차수별 동류항의 계수를 합산함"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=x^3-2x+1$"}], "condition": []}, "reasons": {"method": "X=2A-B로 정리 후 동류항 연산을 수행함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.8

### 발문

최고차항의 계수가 \$1\$인 \$x\$에 대한 삼차다항식 \$f(x)\$가 \$f(1)=f(2)=f(4)=0\$을 만족할 때, \$f(5)\$의 값은?

### 선지

① \$12\$ ② \$8\$ ③ \$6\$ ④ \$-6\$ ⑤ \$-12\$

### 정답

①

### 해설

인수정리에 의하여 \$f(x)\$는 \$x-1\$, \$x-2\$, \$x-4\$를 인수로 가지고 최고차항의 계수가 \$1\$인 삼차다항식이므로 \$\$ f(x) \= (x-1)(x-2)(x-4) \$\$ 따라서 \$f(5) \= (5-1)(5-2)(5-4) \= 4\\cdot 3\\cdot 1 \= 12\$이다.

```
{"status": "EXEMPT", "reason": "인수정리로 최고차항 계수가 1인 삼차다항식을 세워 함숫값을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "인수정리를 적용해 $f(x)=(x-1)(x-2)(x-4)$를 작성한 뒤 $x=5$를 대입한다.", "decisiveStep": "세 근 $1, 2, 4$와 최고차항 계수 $1$로 $f(x)$를 인수분해 꼴로 즉시 확정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012(RPM_ONLY): 인수정리로 세 근 1, 2, 4를 갖는 삼차식을 작성하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 함숫값이 $0$인 삼차다항식에 인수정리를 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "계수", "src": "stem", "quote": "최고차항의 계수가 $1$"}], "condition": []}, "reasons": {"method": "인수정리로 f(x)의 세 일차인수를 확정하고 f(5)를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q04

- 형식: 객관식  
- 배점: 3.8

### 발문

모든 실수 \$x\$에 대하여 등식 \$\$(1+2x-x^2)^3 \= a\_0+a\_1x+a\_2x^2+\\cdots+a\_6x^6\$\$ 이 성립할 때, \$a\_1+a\_3+a\_5\$의 값은? (단, \$a\_0, a\_1, \\cdots, a\_6\$은 상수)

### 선지

① \$0\$ ② \$4\$ ③ \$8\$ ④ \$12\$ ⑤ \$16\$

### 정답

③

### 해설

주어진 항등식의 양변에 \$x=1\$과 \$x=-1\$을 각각 대입하면 \$\$ \\begin{aligned} (1+2-1)^3 &= a\_0+a\_1+a\_2+a\_3+a\_4+a\_5+a\_6 \= 8 \\ (1-2-1)^3 &= a\_0-a\_1+a\_2-a\_3+a\_4-a\_5+a\_6 \= \-8 \\end{aligned} \$\$ 두 식을 변끼리 빼면 \$\$ 2(a\_1+a\_3+a\_5) \= 8-(-8) \= 16 \$\$ 따라서 \$a\_1+a\_3+a\_5 \= 8\$이다.

```
{"status": "EXEMPT", "reason": "항등식에 x=1과 x=-1을 대입해 홀수차 계수의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "항등식 양변에 $x=1$과 $x=-1$을 대입해 두 식을 뺌으로써 홀수차 계수합 $a_1+a_3+a_5$를 구한다.", "decisiveStep": "$x=1$의 결과 $8$에서 $x=-1$의 결과 $-8$을 빼 짝수차 계수를 소거한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-008(DIRECT_ACTIVE): 항등식에 x=1, -1을 대입해 홀수차 계수합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 항등식의 계수합 공식에서 수치대입과 식의 차를 결합한 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "a_1+a_3+a_5"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "양변에 $x=1$과 $x=-1$을 각각 대입하면", "evidenceType": "IMPLIED", "justification": "항등식에 x=1, -1을 대입한 두 식을 빼서 홀수차 계수 합을 분리함"}], "given": [{"term": "항등식", "src": "solution", "quote": "주어진 항등식의"}], "condition": []}, "reasons": {"method": "x=1과 x=-1 수치대입 후 두 식을 빼서 홀수차 계수의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.1

### 발문

양수 \$x\$에 대하여 \$\\left(x-\\dfrac{3}{x}\\right)^2+\\left(3x+\\dfrac{1}{x}\\right)^2 \= 40\$일 때, \$x+\\dfrac{1}{x}\$의 값은?

### 선지

① \$\\sqrt{2}\$ ② \$2\$ ③ \$\\sqrt{5}\$ ④ \$3\$ ⑤ \$\\sqrt{6}\$

### 정답

⑤

### 해설

좌변을 전개하여 정리하면 \$\$ \\begin{aligned} \\left(x^2-6+\\frac{9}{x^2}\\right)+\\left(9x^2+6+\\frac{1}{x^2}\\right) &= 10\\left(x^2+\\frac{1}{x^2}\\right) \= 40 \\ x^2+\\frac{1}{x^2} &= 4 \\end{aligned} \$\$ 곱셈 공식의 변형에 의하여 \$\$ \\left(x+\\frac{1}{x}\\right)^2 \= x^2+\\frac{1}{x^2}+2 \= 4+2 \= 6 \$\$ \$x\>0\$이므로 \$x+\\dfrac{1}{x}\>0\$이고, 따라서 \$x+\\dfrac{1}{x}=\\sqrt{6}\$이다.

```
{"status": "EXEMPT", "reason": "역수 꼴 제곱식의 합을 전개해 x^2+1/x^2을 구하고 곱셈 공식 변형으로 x+1/x를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "두 제곱식을 전개해 상수항 $-6, +6$을 소거하고 $x^2+1/x^2=4$를 얻은 뒤 $(x+1/x)^2=x^2+1/x^2+2$로 값을 구한다.", "decisiveStep": "좌변의 교차항 $-6$과 $+6$이 상쇄되어 $10(x^2+1/x^2)=40$으로 묶임을 파악한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈 공식 변형으로 x+1/x의 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱식 전개로 역수 제곱합을 먼저 구한 뒤 곱셈 공식 변형과 양수 조건을 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식의 변형에 의하여"}], "method": [{"term": "전개", "src": "solution", "quote": "좌변을 전개하여 정리하면", "evidenceType": "NAMED"}], "given": [{"term": "양수", "src": "stem", "quote": "양수 $x$에 대하여"}], "condition": []}, "reasons": {"method": "제곱식 전개로 x^2+1/x^2=4를 구한 뒤 곱셈 공식 변형을 적용함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$ax^2+2(a+3)x+a=0\$이 실근을 갖도록 하는 \$5\$ 이하의 정수 \$a\$의 개수는?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$4\$

### 정답

②

### 해설

이차방정식이므로 최고차항의 계수 \$a\\ne 0\$이다. 실근을 가질 조건은 판별식 \$D\\ge 0\$이므로 \$\$ \\frac{D}{4} \= (a+3)^2-a^2 \= 6a+9 \\ge 0 \\implies a \\ge \-\\frac{3}{2} \$\$ 따라서 \$-\\dfrac{3}{2} \\le a \\le 5\$이고 \$a\\ne 0\$인 정수 \$a\$는 \$-1, 1, 2, 3, 4, 5\$의 \$6\$개이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 실근 조건 판별식과 최고차항 계수 조건을 결합해 정수 개수를 세는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "이차방정식 조건 $a\\ne 0$과 판별식 $D/4=6a+9\\ge 0$을 연립해 $5$ 이하 정수 $a$를 센다.", "decisiveStep": "이차방정식이므로 $a=0$을 반드시 제외해 $-1, 1, 2, 3, 4, 5$의 $6$개만 남긴다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식 조건 a!=0과 실근 판별식 D>=0을 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식 부등식과 이차방정식 최고차항 $a\\ne 0$ 함정을 함께 확인하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "$5$ 이하의 정수 $a$의 개수"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D\\ge 0$이므로", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $ax^2+2(a+3)x+a=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "실근을 갖도록"}]}, "reasons": {"method": "a≠0 조건과 판별식 D/4≥0을 결합해 만족하는 정수 개수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.1

### 발문

다음은 복소수의 계산 과정을 표현한 것이다. 등식이 성립하지 않는 부분을 2개 고르면? \$\$\\dfrac{\\sqrt{7}}{\\sqrt{-2}} \\underset{\\text{①}}{=} \\dfrac{\\sqrt{7}}{\\sqrt{2}i} \\underset{\\text{②}}{=} \\sqrt{\\dfrac{7}{2}}i\$\$ \$\$\\sqrt{-5}\\sqrt{-3} \\underset{\\text{③}}{=} (\\sqrt{5}i)(\\sqrt{3}i) \\underset{\\text{④}}{=} \\sqrt{15} \\underset{\\text{⑤}}{=} \\sqrt{(-5)(-3)}\$\$

### 선지

① ① ② ② ③ ③ ④ ④ ⑤ ⑤

### 정답

②, ④

### 해설

- ① \$\\sqrt{-2}=\\sqrt{2}i\$이므로 \$\\dfrac{\\sqrt{7}}{\\sqrt{-2}}=\\dfrac{\\sqrt{7}}{\\sqrt{2}i}\$ (성립)  
- ② \$\\dfrac{1}{i}=-i\$이므로 \$\\dfrac{\\sqrt{7}}{\\sqrt{2}i}=-\\sqrt{\\dfrac{7}{2}}i \\ne \\sqrt{\\dfrac{7}{2}}i\$ (성립하지 않음)  
- ③ \$\\sqrt{-5}=\\sqrt{5}i, \\sqrt{-3}=\\sqrt{3}i\$이므로 성립  
- ④ \$(\\sqrt{5}i)(\\sqrt{3}i)=\\sqrt{15}i^2=-\\sqrt{15} \\ne \\sqrt{15}\$ (성립하지 않음)  
- ⑤ \$\\sqrt{15}=\\sqrt{(-5)(-3)}\$ (성립) 따라서 등식이 성립하지 않는 부분은 ②, ④이다.

```
{"status": "EXEMPT", "reason": "음수의 제곱근 계산 과정에서 부호 오류가 발생한 등식 단계를 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "음수의 제곱근을 $\\sqrt{a}i$($a>0$) 꼴로 고친 뒤 $1/i=-i$와 $i^2=-1$에 따른 부호를 각 등호마다 점검한다.", "decisiveStep": "②에서 분모의 $i$ 실수화 시 음의 부호가 생김과 ④에서 $i^2=-1$이 누락됨을 포착한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 음수의 제곱근과 1/i=-i 계산의 정오를 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 제곱근 나눗셈과 곱셈에서 자주 틀리는 부호 단계를 가려내는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "등식", "src": "stem", "quote": "등식이 성립하지"}], "method": [{"term": "제곱근", "src": "solution", "quote": "\\sqrt{-2}=\\sqrt{2}i$이므로", "evidenceType": "IMPLIED", "justification": "음수의 제곱근을 i로 표현해 1/i=-i 및 i^2=-1 부호 오류를 검증함"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수의 계산 과정을"}], "condition": []}, "reasons": {"method": "음수 제곱근을 허수단위 i로 변환해 각 등호의 부호 정오를 검증함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.2

### 발문

이차방정식 \$x^2-2x+6=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라고 할 때, \$\$\\dfrac{1}{\\alpha^2-3\\alpha+4} \+ \\dfrac{1}{\\beta^2-3\\beta+4}\$\$ 의 값을 구하면?

### 선지

① \$-\\dfrac{6}{7}\$ ② \$-\\dfrac{1}{7}\$ ③ \$-\\dfrac{3}{7}\$ ④ \$\\dfrac{3}{7}\$ ⑤ \$\\dfrac{6}{7}\$

### 정답

③

### 해설

\$\\alpha, \\beta\$가 \$x^2-2x+6=0\$의 근이므로 \$\\alpha^2=2\\alpha-6\$, \$\\beta^2=2\\beta-6\$이다. 따라서 \$\$ \\alpha^2-3\\alpha+4 \= (2\\alpha-6)-3\\alpha+4 \= \-(\\alpha+2), \\quad \\beta^2-3\\beta+4 \= \-(\\beta+2) \$\$ 근과 계수의 관계에 의하여 \$\\alpha+\\beta=2\$, \$\\alpha\\beta=6\$이므로 \$\$ \\begin{aligned} \\frac{1}{\\alpha^2-3\\alpha+4}+\\frac{1}{\\beta^2-3\\beta+4} &= \-\\left(\\frac{1}{\\alpha+2}+\\frac{1}{\\beta+2}\\right) \\ &= \-\\frac{\\alpha+\\beta+4}{\\alpha\\beta+2(\\alpha+\\beta)+4} \\ &= \-\\frac{2+4}{6+4+4} \= \-\\frac{6}{14} \= \-\\frac{3}{7} \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차방정식 근의 대입으로 분모 차수를 낮춘 뒤 근과 계수의 관계로 통분 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha^2=2\\alpha-6$을 대입해 분모를 일차식 $-(\\alpha+2), -(\\beta+2)$로 낮춘 뒤 통분하여 근과 계수의 관계를 적용한다.", "decisiveStep": "이차항을 방정식 $\\alpha^2=2\\alpha-6$으로 치환해 분모를 일차화한 것이 핵심이다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 이차항 차수 낮추기 후 통분식에 근과 계수의 관계를 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근의 성질을 이용한 차수 낮추기와 근과 계수의 관계를 결합한 표준 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "근과 계수의 관계에 의하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2x+6=0$"}], "condition": []}, "reasons": {"method": "근의 대입으로 분모를 일차식으로 낮춘 뒤 근과 계수의 관계를 적용함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q09

- 형식: 객관식  
- 배점: 4.2

### 발문

다음 중 다항식 \$(x^2+3x+4)(x^2+5x+4)-8x^2\$의 인수인 것은?

### 선지

① \$x^2+x+4\$ ② \$x^2+3x+4\$ ③ \$x^2+5x+4\$ ④ \$x^2+8x+4\$ ⑤ \$x^2-x+4\$

### 정답

①

### 해설

\$x^2+4=t\$로 치환하면 \$\$ \\begin{aligned} (t+3x)(t+5x)-8x^2 &= t^2+8xt+15x^2-8x^2 \\ &= t^2+8xt+7x^2 \\ &= (t+x)(t+7x) \\ &= (x^2+x+4)(x^2+7x+4) \\end{aligned} \$\$ 따라서 보기 중 인수인 것은 ① \$x^2+x+4\$이다.

```
{"status": "EXEMPT", "reason": "공통부분 x^2+4를 치환해 동차 이차식으로 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "공통부분 $x^2+4=t$로 치환하여 $t^2+8xt+7x^2=(t+x)(t+7x)$로 인수분해한다.", "decisiveStep": "일차항 계수가 다른 두 이차식에서 공통부분 $x^2+4$를 치환 변수 $t$로 잡는다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 공통부분 x^2+4 치환으로 단계적 인수분해를 수행함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공통부분 치환을 통해 사차다항식을 두 이차인수의 곱으로 분해하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "인수인 것은"}], "method": [{"term": "치환", "src": "solution", "quote": "x^2+4=t$로 치환하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(x^2+3x+4)(x^2+5x+4)-8x^2$"}], "condition": []}, "reasons": {"method": "공통부분 x^2+4를 치환하여 두 이차식으로 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.1

### 발문

다항식 \$f(x)-1\$을 \$x+2\$로 나누었을 때의 나머지가 \$4\$이고, \$2f(x)+1\$을 \$3x-1\$로 나누었을 때의 나머지가 \$5\$이다. \$f(x)\$를 \$(x+2)(3x-1)\$로 나누었을 때의 나머지가 \$R(x)\$일 때, \$R(1)\$의 값은?

### 선지

① \$\\dfrac{6}{7}\$ ② \$\\dfrac{9}{7}\$ ③ \$1\$ ④ \$\\dfrac{8}{7}\$ ⑤ \$\\dfrac{10}{7}\$

### 정답

④

### 해설

나머지정리에 의하여 \$\$ f(-2)-1=4 \\implies f(-2)=5, \\qquad 2f\\left(\\frac{1}{3}\\right)+1=5 \\implies f\\left(\\frac{1}{3}\\right)=2 \$\$ \$f(x)\$를 이차식 \$(x+2)(3x-1)\$로 나눈 나머지 \$R(x)\$는 일차 이하의 다항식이므로 \$R(x)=ax+b\$라 두면 \$\$ f(x) \= (x+2)(3x-1)Q(x)+ax+b \$\$ \$x=-2\$와 \$x=\\dfrac{1}{3}\$을 대입하면 \$\$ \-2a+b=5, \\qquad \\frac{1}{3}a+b=2 \$\$ 두 식을 빼면 \$\\dfrac{7}{3}a=-3 \\implies a=-\\dfrac{9}{7}\$, \$b=5+2a=5-\\dfrac{18}{7}=\\dfrac{17}{7}\$이다. 따라서 \$R(x)=-\\dfrac{9}{7}x+\\dfrac{17}{7}\$이므로 \$R(1)=\\dfrac{8}{7}\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리로 f(-2), f(1/3) 값을 구해 이차식 나눗셈 나머지 R(x)를 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리로 $f(-2)=5$, $f(1/3)=2$를 구한 뒤 $R(x)=ax+b$에 대입해 연립방정식을 푼다.", "decisiveStep": "두 조건식 $f(-2)-1=4$, $2f(1/3)+1=5$를 $f$의 함숫값으로 변환해 일차 나머지 $ax+b$를 확정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 나머지정리 두 함숫값을 구해 일차 나머지 R(x)를 연립함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리 두 조건을 연립해 이차식으로 나눈 일차 나머지를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지가 $R(x)$일 때"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)-1$"}], "condition": []}, "reasons": {"method": "나머지정리로 f(-2), f(1/3)을 구한 뒤 일차 나머지 R(x)를 결정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 3.8

### 발문

이차함수 \$y=3x^2-2x+a-1\$의 그래프가 \$x\$축과 만날 때, 실수 \$a\$의 값의 범위는?

### 선지

① \$a \\le \\dfrac{1}{3}\$ ② \$a \\le \\dfrac{2}{3}\$ ③ \$a \\le 1\$ ④ \$a \\ge \\dfrac{4}{3}\$ ⑤ \$a \\le \\dfrac{4}{3}\$

### 정답

⑤

### 해설

이차함수 \$y=3x^2-2x+a-1\$의 그래프가 \$x\$축과 만나려면 이차방정식 \$3x^2-2x+a-1=0\$이 실근을 가져야 한다. 따라서 판별식 \$D \\ge 0\$이므로 \$\$ \\frac{D}{4} \= (-1)^2-3(a-1) \= 4-3a \\ge 0 \$\$ 그러므로 \$a \\le \\dfrac{4}{3}\$이다.

```
{"status": "EXEMPT", "reason": "이차함수 그래프와 x축의 교점 유무를 판별식 D≥0으로 판정하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "이차방정식 $3x^2-2x+a-1=0$의 판별식 $D/4=4-3a\\ge 0$을 풀어 $a$의 범위를 구한다.", "decisiveStep": "'$x$축과 만난다'는 조건을 한 점(접함)과 두 점을 포함한 $D\\ge 0$으로 해석한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): 이차함수가 x축과 만날 조건 D>=0을 적용함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 $x$축의 위치 관계를 판별식 부등식으로 바로 바꾸는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$의 값의 범위"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D \\ge 0$이므로", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=3x^2-2x+a-1$"}], "condition": []}, "reasons": {"method": "이차함수와 x축이 만나는 조건에 판별식 D/4≥0을 적용함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.1

### 발문

\$x\$에 대한 이차방정식 \$\$x^2+(k-3)x+(k+2)p-q+1=0\$\$ 이 \$k\$의 값에 관계없이 \$x=1\$을 근으로 가질 때, 상수 \$p\$, \$q\$에 대하여 \$2pq\$의 값은?

### 선지

① \$-6\$ ② \$-3\$ ③ \$6\$ ④ \$3\$ ⑤ \$0\$

### 정답

③

### 해설

\$x=1\$을 대입하면 \$\$ 1+(k-3)+(k+2)p-q+1 \= (p+1)k+(2p-q-1) \= 0 \$\$ 이 등식이 \$k\$의 값에 관계없이 성립하는 \$k\$에 대한 항등식이므로 \$\$ p+1=0, \\qquad 2p-q-1=0 \$\$ 따라서 \$p=-1\$, \$q=2(-1)-1=-3\$이고, \$2pq \= 2(-1)(-3) \= 6\$이다.

```
{"status": "EXEMPT", "reason": "x=1 대입 후 k에 대한 항등식으로 계수비교해 p, q를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$x=1$을 대입한 식을 $k$에 대해 내림차순 정리 $(p+1)k+(2p-q-1)=0$으로 두고 항등식 계수비교를 적용한다.", "decisiveStep": "근 대입과 '$k$의 값에 관계없이'라는 항등식 조건을 순서대로 결합해 $p, q$를 푼다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 근 x=1 대입 후 k에 대한 항등식 계수비교법으로 p, q를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 근 조건과 문자 $k$에 대한 항등식을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $p$, $q$에 대하여"}], "method": [{"term": "계수비교", "src": "solution", "quote": "$k$에 대한 항등식이므로", "evidenceType": "IMPLIED", "justification": "k에 대해 정리한 항등식의 일차항과 상수항을 각각 0으로 두어 p, q를 구함"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식"}], "condition": [{"term": "항등식", "src": "solution", "quote": "$k$의 값에 관계없이 성립하는"}]}, "reasons": {"method": "x=1 대입 후 k에 대한 항등식의 계수비교로 p, q를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.7

### 발문

\$x^4+8x^2-9\$가 \$(x-1)(x-2)\$의 배수가 되도록 하는 \$3\$ 이상의 자연수 \$x\$의 개수는?

### 선지

① \$4\$ ② \$2\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

①

### 해설

\$x^4+8x^2-9 \= (x^2-1)(x^2+9) \= (x-1)(x+1)(x^2+9)\$이다. \$x\\ge 3\$이면 \$(x-1)(x-2)\>0\$이고, \$\$ \\frac{x^4+8x^2-9}{(x-1)(x-2)} \= \\frac{(x+1)(x^2+9)}{x-2} \$\$ \$t=x-2\$(\$t\\ge 1\$인 자연수)라 놓으면 \$x=t+2\$이므로 \$\$ \\begin{aligned} \\frac{(t+3){(t+2)^2+9}}{t} &= \\frac{(t+3)(t^2+4t+13)}{t} \\ &= \\frac{t^3+7t^2+25t+39}{t} \\ &= t^2+7t+25+\\frac{39}{t} \\end{aligned} \$\$ 이 값이 자연수가 되려면 \$t\$는 \$39\$의 양의 약수이어야 하므로 \$t\\in{1, 3, 13, 39}\$이다. 각각에 대응하는 자연수 \$x=t+2\$는 \$3, 5, 15, 41\$로 모두 \$3\$ 이상이므로 구하는 개수는 \$4\$개이다.

```
{"status": "EXEMPT", "reason": "사차식을 인수분해해 x-1을 약분하고 x-2=t 치환 후 정수 약수 조건으로 개수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "분자 $x^4+8x^2-9$를 인수분해해 $x-1$을 약분한 뒤 $t=x-2$로 치환하여 상수항 $39$의 약수 개수를 센다.", "decisiveStep": "분수식 $\\frac{(x+1)(x^2+9)}{x-2}$에서 $t=x-2$로 치환해 몫과 나머지 $\\frac{39}{t}$를 분리한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 분자 인수분해 약분 후 치환으로 몫과 나머지를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수분해 약분과 $t=x-2$ 치환을 통한 약수 판별을 결합한 중고난도 정수 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "$3$ 이상의 자연수 $x$의 개수"}], "method": [{"term": "인수분해", "src": "solution", "quote": "(x-1)(x+1)(x^2+9)", "evidenceType": "IMPLIED", "justification": "보기차식을 인수분해해 x-1을 약분하고 x-2로 나눈 나머지가 39임을 구함"}], "given": [{"term": "배수", "src": "stem", "quote": "(x-1)(x-2)$의 배수"}], "condition": []}, "reasons": {"method": "보기차식 인수분해 후 t=x-2 치환으로 39의 약수 개수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.1

### 발문

이차함수 \$y=x^2+ax+b\$의 그래프가 \$x\$축에 접하고 직선 \$y=4x\$와 서로 다른 두 점에서 만난다. 이때, 정수 \$a\$의 최댓값을 구하면?

### 선지

① \$-1\$ ② \$0\$ ③ \$2\$ ④ \$1\$ ⑤ \$3\$

### 정답

④

### 해설

\$y=x^2+ax+b\$의 그래프가 \$x\$축에 접하므로 \$x^2+ax+b=0\$의 판별식 \$\$ D\_1 \= a^2-4b \= 0 \\implies 4b \= a^2 \$\$ 또 직선 \$y=4x\$와 서로 다른 두 점에서 만나므로 \$x^2+(a-4)x+b=0\$의 판별식 \$\$ D\_2 \= (a-4)^2-4b \> 0 \$\$ \$4b=a^2\$을 대입하면 \$\$ (a-4)^2-a^2 \= \-8a+16 \> 0 \\implies a \< 2 \$\$ 따라서 정수 \$a\$의 최댓값은 \$1\$이다.

```
{"status": "EXEMPT", "reason": "x축 접선 조건 D1=0과 직선과의 교점 조건 D2>0을 연립하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$x$축에 접하는 조건 $a^2-4b=0$을 직선 $y=4x$와의 교점 판별식 $(a-4)^2-4b>0$에 대입해 $a<2$를 얻는다.", "decisiveStep": "$4b=a^2$을 그대로 대입해 $a^2$항을 소거하고 일차부등식 $-8a+16>0$을 만든다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): x축 접선 조건 D_1=0을 직선 교점 판별식 D_2>0에 대입함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 위치 관계의 판별식을 연립해 이차항이 소거되는 정수 최댓값 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "정수 $a$의 최댓값"}], "method": [{"term": "판별식", "src": "solution", "quote": "D_1 = a^2-4b = 0", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+ax+b$"}], "condition": []}, "reasons": {"method": "x축 접선 판별식과 직선 교점 판별식을 연립해 정수 a의 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.2

### 발문

양수 \$a\$에 대하여 \$0 \\le x \\le a\$에서 이차함수 \$y=(x-2)^2+a\$의 최솟값이 \$3\$이 되도록 하는 \$a\$의 값을 모두 합하면?

### 선지

① \$\\dfrac{7-\\sqrt{5}}{2}\$ ② \$\\dfrac{9-\\sqrt{5}}{2}\$ ③ \$\\dfrac{9+\\sqrt{5}}{2}\$ ④ \$3\$ ⑤ \$6\$

### 정답

②

### 해설

이차함수 \$y=(x-2)^2+a\$는 아래로 볼록하고 축이 \$x=2\$이다.

1) \$a \\ge 2\$일 때: 축 \$x=2\$가 구간 \$0 \\le x \\le a\$에 포함되므로 최솟값은 \$x=2\$에서 \$a=3\$이다. (\$a=3 \\ge 2\$이므로 성립)  
2) \$0 \< a \< 2\$일 때: 구간 \$0 \\le x \\le a\$는 축의 왼쪽에 있으므로 최솟값은 \$x=a\$에서 \$\$ (a-2)^2+a \= 3 \\implies a^2-3a+1 \= 0 \\implies a \= \\frac{3\\pm\\sqrt{5}}{2} \$\$ \$0 \< a \< 2\$를 만족하는 값은 \$a=\\dfrac{3-\\sqrt{5}}{2}\$뿐이다. 따라서 구하는 \$a\$의 값의 합은 \$3+\\dfrac{3-\\sqrt{5}}{2}=\\dfrac{9-\\sqrt{5}}{2}\$이다.

```
{"status": "EXEMPT", "reason": "구간 끝점 a와 축 x=2의 위치 관계에 따라 경우를 나누어 최솟값 조건을 푸는 순수 함수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "축 $x=2$가 구간 $[0, a]$에 포함되는지($a\\ge 2$ vs $0<a<2$)로 경우를 나누어 각각의 최솟값이 $3$이 되는 $a$를 구한다.", "decisiveStep": "$0<a<2$ 구간에서 나온 두 근 $\\frac{3\\pm\\sqrt{5}}{2}$ 중 범위 조건 $a<2$를 만족하는 $\\frac{3-\\sqrt{5}}{2}$만 취한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 축 x=2와 구간 [0, a]의 포함 여부로 나누어 최솟값 조건을 풂"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한된 범위 $[0, a]$와 대칭축 $x=2$의 상대 위치에 따른 경우 나누기가 핵심인 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "최솟값이 $3$이 되도록"}], "method": [{"term": "이차함수", "src": "solution", "quote": "아래로 볼록하고 축이 $x=2$", "evidenceType": "IMPLIED", "justification": "대칭축 x=2가 구간 [0, a] 안에 있는지 여부로 경우를 나누어 최솟값을 구함"}], "given": [{"term": "양수", "src": "stem", "quote": "양수 $a$에 대하여"}], "condition": []}, "reasons": {"method": "대칭축 x=2와 구간 [0, a]의 위치 관계로 경우를 나누어 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.7

### 발문

자연수 \$n\$에 대하여 등식 \$\$x^n-1=(x-1)(x^{n-1}+x^{n-2}+\\cdots+x+1)\$\$ 이 성립할 때, 다항식 \$x^{15}-1\$을 \$(x-1)^2\$으로 나누었을 때의 나머지가 \$R(x)\$일 때, \$R(3)\$의 값은?

### 선지

① \$15\$ ② \$20\$ ③ \$25\$ ④ \$45\$ ⑤ \$30\$

### 정답

⑤

### 해설

\$x^{15}-1\$을 \$(x-1)^2\$으로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$R(x)=ax+b\$라 두면 \$\$ x^{15}-1 \= (x-1)^2Q(x)+ax+b \$\$ 양변에 \$x=1\$을 대입하면 \$0=a+b \\implies b=-a\$이므로 \$R(x)=a(x-1)\$이다. 주어진 등식에 의하여 좌변은 \$(x-1)(x^{14}+x^{13}+\\cdots+x+1)\$이므로 \$\$ (x-1)(x^{14}+x^{13}+\\cdots+x+1) \= (x-1){(x-1)Q(x)+a} \$\$ 양변에서 \$x-1\$을 약분하면 항등식 \$\$ x^{14}+x^{13}+\\cdots+x+1 \= (x-1)Q(x)+a \$\$ 여기에 \$x=1\$을 대입하면 \$a \= \\underbrace{1+1+\\cdots+1}\_{15\\text{개}} \= 15\$이다. 따라서 \$R(x)=15(x-1)\$이므로 \$R(3)=15(3-1)=30\$이다.

```
{"status": "EXEMPT", "reason": "x^15-1을 (x-1)^2으로 나눈 나머지를 인수분해 약분과 x=1 대입으로 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$R(1)=0$에서 $R(x)=a(x-1)$로 두고 주어진 인수분해 항등식으로 $(x-1)$을 약분한 뒤 $x=1$을 대입해 $a=15$를 구한다.", "decisiveStep": "양변에서 $(x-1)$을 약분한 항등식 $x^{14}+\\cdots+1=(x-1)Q(x)+a$에 $x=1$을 다시 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 나머지정리 항등식에서 (x-1) 약분 후 수치대입으로 나머지를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱 인수로 나눈 나머지를 $(x-1)$ 약분과 재대입으로 결정하는 고전적 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지가 $R(x)$일 때"}], "method": [{"term": "인수분해", "src": "solution", "quote": "양변에서 $x-1$을 약분하면", "evidenceType": "IMPLIED", "justification": "x^15-1 인수분해 항등식으로 x-1을 약분한 뒤 x=1을 대입해 a를 결정함"}], "given": [{"term": "자연수", "src": "stem", "quote": "자연수 $n$에 대하여"}], "condition": []}, "reasons": {"method": "x-1 약분 후 x=1을 재대입하여 (x-1)^2 나눗셈의 나머지를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.7

### 발문

이차함수 \$y=f(x)\$가 다음 조건을 만족시킨다. (가) \$f(-2)=0\$ (나) 모든 실수 \$x\$에 대하여 \$f(x) \\ge f(2)\$

\<보기\>에서 옳은 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$f(0) \< f\\left(\\dfrac{1}{2}\\right) \< f(7)\$ ㄴ. \$-3 \< a \< 1\$, \$\\dfrac{5}{2} \< b \< 6\$인 \$a\$, \$b\$에 대하여 \$\$\\dfrac{f(a)+f(b)}{2} \> f\\left(\\dfrac{a+b}{2}\\right)\$\$ ㄷ. 실수 \$p\$에 대하여 \$p \\le x \\le p+2\$에서 함수 \$y=f(x)\$의 최댓값을 \$g(p)\$라 할 때, 함수 \$g(p)\$의 최솟값이 \$-1\$이면 \$f(2) \= \-\\dfrac{16}{15}\$

### 선지

① ㄱ, ㄴ ② ㄴ ③ ㄴ, ㄷ ④ ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

③

### 해설

조건 (나)에서 \$f(x)\$는 \$x=2\$에서 최솟값을 가지므로 아래로 볼록하고 대칭축은 \$x=2\$이다. 최고차항의 계수를 \$k\$(\$k\>0\$)라 하면 \$f(x)=k(x-2)^2+c\$이고, 조건 (가)에서 \$f(-2)=16k+c=0\$이므로 \$c=-16k\$, 즉 \$f(x)=k(x-2)^2-16k\$이다.

- ㄱ. 대칭축 \$x=2\$로부터의 거리는 \$\\left\|\\dfrac{1}{2}-2\\right\|=\\dfrac{3}{2} \< \|0-2\|=2 \< \|7-2\|=5\$이므로 \$f\\left(\\dfrac{1}{2}\\right) \< f(0) \< f(7)\$이다. (거짓)  
- ㄴ. \$k\>0\$인 아래로 볼록한 이차함수에서 \$a\<b\$이므로 두 점 \$(a, f(a)), (b, f(b))\$를 잇는 선분의 중점의 \$y\$좌표는 중점 \$x=\\dfrac{a+b}{2}\$에서의 함숫값보다 항상 크다. 실제로 \$\\dfrac{f(a)+f(b)}{2}-f\\left(\\dfrac{a+b}{2}\\right)=\\dfrac{k}{4}(a-b)^2\>0\$이므로 성립한다. (참)  
- ㄷ. 길이 \$2\$인 구간 \$\[p, p+2\]\$에서의 최댓값 \$g(p)\$는 구간의 중심 \$p+1\$이 대칭축 \$x=2\$와 일치할 때, 즉 \$p=1\$일 때 최소이다. 이때 최솟값은 \$g(1)=f(1)=f(3)=k(1-2)^2-16k=-15k=-1\$이므로 \$k=\\dfrac{1}{15}\$이고 \$f(2)=-16k=-\\dfrac{16}{15}\$이다. (참) 따라서 옳은 것은 ㄴ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "이차함수의 대칭축, 볼록성 부등식, 이동 구간의 최댓값 최솟값을 종합 판별하는 순수 함수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "조건 (가),(나)로 $f(x)=k(x-2)^2-16k$($k>0$)를 세운 뒤 축 거리 비교(ㄱ), 아래로 볼록 성질(ㄴ), 구간 $[p, p+2]$ 대칭 배치(ㄷ)를 각각 검증한다.", "decisiveStep": "ㄷ에서 구간 $[p, p+2]$의 최댓값 $g(p)$가 구간의 중심 $p+1=2$일 때 최소가 되어 $-15k=-1$임을 포착한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 이차함수의 대칭축과 이동 구간 [p, p+2]의 최대·최소를 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 대칭성, 볼록성(젠센 부등식 꼴), 이동 구간 최댓값의 최솟값을 통합한 최고난도 객관식 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "함수 $g(p)$의 최솟값이 $-1$"}], "method": [{"term": "축", "src": "solution", "quote": "대칭축은 $x=2$", "evidenceType": "IMPLIED", "justification": "대칭축 x=2를 기준으로 함숫값 크기, 볼록성, 이동 구간 최댓값을 판별함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=f(x)$"}], "condition": []}, "reasons": {"method": "이차함수 대칭축 x=2를 기준으로 ㄱ 대소, ㄴ 볼록성, ㄷ 구간 최댓값을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 5

### 발문

\[서답형1 (단답형1)\] 실수 \$a\$, \$b\$에 대하여 \$\$\\dfrac{1}{i^3} \+ \\dfrac{1}{i^{10}} \+ \\dfrac{1}{i^{17}} \+ \\dfrac{1}{i^{24}} \+ \\cdots \+ \\dfrac{1}{i^{2012}} \+ \\dfrac{1}{i^{2019}} \= a+bi\$\$ 일 때, \$a+b\$의 값을 구하시오.

### 선지

없음

### 정답

\$1\$

### 해설

분모의 지수 \$3, 10, 17, \\cdots, 2019\$는 첫째항이 \$3\$, 공차가 \$7\$인 수열이므로 항의 개수는 \$\$ \\frac{2019-3}{7}+1 \= 288+1 \= 289 \$\$ 한편 \$i^4=1\$이고 \$7\\equiv 3 \\pmod 4\$이므로 각 항을 앞에서부터 네 항씩 묶어 보면 \$\$ \\frac{1}{i^3}+\\frac{1}{i^{10}}+\\frac{1}{i^{17}}+\\frac{1}{i^{24}} \= \\frac{1}{-i}+\\frac{1}{-1}+\\frac{1}{i}+\\frac{1}{1} \= i-1-i+1 \= 0 \$\$ 마찬가지로 연속한 네 항의 합은 항상 \$0\$이다. \$289 \= 4\\times 72 \+ 1\$이므로 앞의 \$288\$개 항의 합은 \$0\$이고 마지막 항만 남는다. \$2019 \= 4\\times 504 \+ 3\$이므로 \$\$ \\frac{1}{i^{2019}} \= \\frac{1}{i^3} \= \\frac{1}{-i} \= i \$\$ 따라서 \$a=0, b=1\$이므로 \$a+b=1\$이다.

```
{"status": "EXEMPT", "reason": "i의 거듭제곱 역수 합에서 지수 주기성을 이용해 4항 묶음 소거로 값을 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "지수가 $7$씩 커지는 $289$개 항에서 $i^4=1$ 주기성으로 연속한 $4$항의 합이 $0$임을 이용해 남은 $1$항 $\\frac{1}{i^{2019}}=i$를 구한다.", "decisiveStep": "항의 개수 $289=4\\times 72+1$을 계산하고 연속 $4$항 묶음 합이 $0$임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): i^4=1 주기성을 이용해 289개 항의 합을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차수열 꼴 지수의 항 개수 계산과 $i$의 주기 $4$ 소거를 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$, $b$에 대하여"}], "method": [{"term": "복소수", "src": "solution", "quote": "연속한 네 항의 합은 항상 $0$", "evidenceType": "IMPLIED", "justification": "i^4=1 주기성을 이용해 4항씩 묶어 0으로 소거함"}], "given": [{"term": "합", "src": "solution", "quote": "네 항의 합은"}], "condition": []}, "reasons": {"method": "항 개수 289와 i의 4주기 소거를 이용해 남은 1항의 값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 5

### 발문

\[서답형2 (단답형2)\] 이차함수 \$f(x)\$가 다음 조건을 만족시킨다. (가) \$f(0)=2\$ (나) 모든 실수 \$x\$에 대하여 \$f(x+1)-f(x)=4x\$이다.

\$-1 \\le x \\le 1\$에서 함수 \$f(x)\$의 최댓값과 최솟값의 합을 구하시오.

### 선지

없음

### 정답

\$\\dfrac{15}{2}\$

### 해설

조건 (가)에서 \$f(0)=2\$이므로 \$f(x)=ax^2+bx+2\$ (\$a\\ne 0\$)라 두자. 조건 (나)에 대입하면 \$\$ \\begin{aligned} f(x+1)-f(x) &= {a(x+1)^2+b(x+1)+2}-(ax^2+bx+2) \\ &= 2ax+(a+b) \= 4x \\end{aligned} \$\$ 모든 실수 \$x\$에 대한 항등식이므로 \$2a=4, a+b=0 \\implies a=2, b=-2\$이다. 따라서 \$\$ f(x) \= 2x^2-2x+2 \= 2\\left(x-\\frac{1}{2}\\right)^2+\\frac{3}{2} \$\$ 구간 \$-1 \\le x \\le 1\$에서 꼭짓점 \$x=\\dfrac{1}{2}\$이 구간 안에 있으므로

- 최솟값: \$f\\left(\\dfrac{1}{2}\\right)=\\dfrac{3}{2}\$  
- 최댓값: 축에서 더 먼 끝점 \$x=-1\$에서 \$f(-1)=2+2+2=6\$ 따라서 최댓값과 최솟값의 합은 \$6+\\dfrac{3}{2}=\\dfrac{15}{2}\$이다.

```
{"status": "EXEMPT", "reason": "차분 항등식 f(x+1)-f(x)=4x로 이차식을 결정한 뒤 제한 범위 최대·최소 합을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$f(x)=ax^2+bx+2$를 $f(x+1)-f(x)=4x$에 대입해 항등식 계수비교로 $f(x)=2x^2-2x+2$를 구한 뒤 $[-1, 1]$에서 최대·최소를 구한다.", "decisiveStep": "$f(x+1)-f(x)=2ax+(a+b)=4x$로 $a=2, b=-2$를 구하고 꼭짓점 $x=1/2$과 끝점 $x=-1$에서 최소·최대를 읽는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): f(x+1)-f(x)=4x 항등식 계수비교로 이차함수를 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 항등식으로 이차함수를 결정한 뒤 제한된 구간의 최대·최소를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값의 합"}], "method": [{"term": "계수비교", "src": "solution", "quote": "모든 실수 $x$에 대한 항등식이므로", "evidenceType": "IMPLIED", "justification": "f(x+1)-f(x)=4x 항등식의 계수를 비교해 이차함수를 확정함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}], "condition": []}, "reasons": {"method": "항등식 계수비교로 f(x)를 구한 뒤 [-1, 1] 최대·최소의 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 6

### 발문

\[서답형3 (서술형1)\] ※ 다음은 서술형 문제입니다. (모든 문항 부분점수 있음) 풀이과정을 구체적으로 서술하시오.

실수 \$a\$, \$b\$에 대하여 이차방정식 \$3x^2-ax+b=0\$의 한 근이 \$1-2i\$일 때, \$ab\$의 값을 구하시오.

### 선지

없음

### 정답

\$90\$

### 해설

계수 \$3, \-a, b\$가 모두 실수이므로 한 근이 \$1-2i\$이면 그 켤레복소수 \$1+2i\$도 이차방정식의 다른 한 근이다. 근과 계수의 관계에 의하여 \$\$ \\begin{aligned} (1-2i)+(1+2i) &= \\frac{a}{3} \\implies 2 \= \\frac{a}{3} \\implies a \= 6 \\ (1-2i)(1+2i) &= \\frac{b}{3} \\implies 1+4 \= \\frac{b}{3} \\implies b \= 15 \\end{aligned} \$\$ 따라서 \$ab \= 6\\times 15 \= 90\$이다.

```
{"status": "EXEMPT", "reason": "실계수 이차방정식의 켤레근 성질과 근과 계수의 관계로 계수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "실계수 이차방정식의 켤레근 성질로 다른 한 근 $1+2i$를 구하고 근과 계수의 관계로 $a, b$를 계산한다.", "decisiveStep": "두 근의 합 $2=a/3$과 곱 $5=b/3$을 연립해 $a=6, b=15$를 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json H1-RPM-031(DIRECT_BINDING_GAP): 실계수 이차방정식 켤레근과 근과 계수의 관계로 a, b를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실계수 조건에서 켤레근과 근과 계수의 관계를 바로 적용하는 서술형 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$, $b$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $3x^2-ax+b=0$"}], "condition": [{"term": "켤레복소수", "src": "solution", "quote": "그 켤레복소수 $1+2i$도"}]}, "reasons": {"method": "실계수 이차방정식의 켤레근과 근과 계수의 관계로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q21

- 형식: 서답형  
- 배점: 7

### 발문

\[서답형4 (서술형2)\] 삼각형 \$ABC\$의 세 변의 길이 \$a, b, c\$에 대하여 \$\$a^3c+a^2bc-ac^3+ab^2c+b^3c-bc^3=0\$\$ 이 성립할 때, \$a=5\$, \$c=13\$이면 삼각형 \$ABC\$의 넓이를 구하시오.

### 선지

없음

### 정답

\$30\$

### 해설

주어진 식을 공통인수 \$c\$로 묶고 \$a+b\$가 나타나도록 정리하면 \$\$ \\begin{aligned} c{(a^3+a^2b)+(ab^2+b^3)-(a+b)c^2} &= 0 \\ c{a^2(a+b)+b^2(a+b)-(a+b)c^2} &= 0 \\ c(a+b)(a^2+b^2-c^2) &= 0 \\end{aligned} \$\$ 삼각형의 세 변의 길이이므로 \$a\>0, b\>0, c\>0\$이고 \$c(a+b)\>0\$이다. 따라서 \$a^2+b^2-c^2=0\$, 즉 \$c^2=a^2+b^2\$이므로 \$\\angle C=90^\\circ\$인 직각삼각형이다. \$a=5, c=13\$이므로 \$b=\\sqrt{13^2-5^2}=\\sqrt{144}=12\$이고, 삼각형 \$ABC\$의 넓이는 \$\\dfrac{1}{2}\\times 5\\times 12 \= 30\$이다.

```
{"status": "EXEMPT", "reason": "삼각형 세 변 관계식을 인수분해해 직각삼각형을 판별하고 넓이를 구하는 순수 대수·기하 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "관계식을 $c(a+b)(a^2+b^2-c^2)=0$으로 인수분해해 피타고라스 관계 $c^2=a^2+b^2$를 밝히고 직각삼각형 넓이를 구한다.", "decisiveStep": "변의 길이 양수 조건 $c(a+b)>0$으로 $a^2+b^2=c^2$을 도출한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 삼각형 세 변 조건식을 인수분해해 직각삼각형을 판정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 인수분해를 이용한 삼각형 모양 판별과 넓이 계산의 결합 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "넓이", "src": "stem", "quote": "삼각형 $ABC$의 넓이"}], "method": [{"term": "인수분해", "src": "solution", "quote": "c(a+b)(a^2+b^2-c^2) &= 0", "evidenceType": "IMPLIED", "justification": "공통인수 c와 (a+b)로 묶어 인수분해하여 c^2=a^2+b^2를 도출함"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $ABC$의 세 변"}], "condition": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형이다"}]}, "reasons": {"method": "관계식 인수분해로 직각삼각형을 판별하고 피타고라스 정리로 넓이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

\[서답형5 (서술형3)\] 이차함수 \$y=x^2+2mx-7\$의 그래프와 직선 \$y=4x-m^2\$의 그래프가 서로 다른 두 점에서 만난다. 두 교점의 \$x\$좌표가 각각 \$\\alpha\$, \$\\beta\$일 때, \$(\\alpha-1)(\\beta-1)\$의 최솟값을 구하시오. (단, \$m\$은 실수)

### 선지

없음

### 정답

\$-11\$

### 해설

이차함수와 직선의 교점의 \$x\$좌표 \$\\alpha, \\beta\$는 이차방정식 \$\$ x^2+2mx-7 \= 4x-m^2 \\iff x^2+(2m-4)x+(m^2-7) \= 0 \$\$ 의 서로 다른 두 실근이다. 서로 다른 두 실근을 가질 조건은 판별식 \$D\>0\$이므로 \$\$ \\frac{D}{4} \= (m-2)^2-(m^2-7) \= \-4m+11 \> 0 \\implies m \< \\frac{11}{4} \$\$ 근과 계수의 관계에 의하여 \$\\alpha+\\beta=4-2m\$, \$\\alpha\\beta=m^2-7\$이므로 \$\$ \\begin{aligned} (\\alpha-1)(\\beta-1) &= \\alpha\\beta-(\\alpha+\\beta)+1 \\ &= (m^2-7)-(4-2m)+1 \\ &= m^2+2m-10 \\ &= (m+1)^2-11 \\end{aligned} \$\$ 꼭짓점 \$m=-1\$이 범위 \$m\<\\dfrac{11}{4}\$에 포함되므로 구하는 최솟값은 \$-11\$이다.

```
{"status": "EXEMPT", "reason": "교점 방정식의 판별식 범위 m<11/4 아래 근과 계수의 관계로 이차식의 최솟값을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립이차방정식의 판별식 $D>0$으로 $m<11/4$를 구한 뒤 근과 계수의 관계로 $(\\alpha-1)(\\beta-1)$을 $m$의 이차식으로 나타내 최솟값을 구한다.", "decisiveStep": "서로 다른 두 점 조건 $m<11/4$ 안에 꼭짓점 $m=-1$이 포함됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 연립이차방정식 판별식 D>0과 근과 계수의 관계로 꼭짓점을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수·직선 교점, 판별식 범위 확인, 근과 계수의 관계, 이차식 최솟값을 결합한 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "최솟값을 구하시오"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+2mx-7$"}], "condition": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$이므로"}]}, "reasons": {"method": "판별식으로 m 범위를 확인하고 근과 계수의 관계로 m의 이차식 최솟값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

