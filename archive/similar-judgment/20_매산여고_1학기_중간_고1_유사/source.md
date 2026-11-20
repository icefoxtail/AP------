

```
{"stem": "20_매산여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/20_매산여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

다음은 조립제법을 이용하여 다항식 \$2x^3-5x^2+x+6\$을 \$x-2\$로 나누었을 때, 몫과 나머지를 구하는 과정이다. \$\$ \\begin{array}{c\|rrrr} 2 & 2 & \-5 & 1 & 6 \\ &   & 4  & b & d \\ \\hline & a & \-1 & c & e \\end{array} \$\$ 상수 \$a, b, c, d, e\$의 값으로 옳지 않은 것은?

### 선지

① \$a=2\$ ② \$b=2\$ ③ \$c=-1\$ ④ \$d=-2\$ ⑤ \$e=4\$

### 정답

②

### 해설

조립제법의 각 단계를 계산하면 다음과 같다.

- 첫 계수 \$2\$를 그대로 내리므로 \$a=2\$이다.  
- \$2\\times 2=4\$, \$-5+4=-1\$이다.  
- \$b=2\\times(-1)=-2\$, \$c=1+(-2)=-1\$이다.  
- \$d=2\\times(-1)=-2\$, \$e=6+(-2)=4\$이다. 따라서 \$a=2, b=-2, c=-1, d=-2, e=4\$이므로 옳지 않은 것은 ② \$b=2\$이다.

```
{"status": "EXEMPT", "reason": "조립제법 표를 발문 내 KaTeX array로 직접 구현함"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "$x-2$의 근 $2$로 조립제법의 곱셈과 덧셈을 순서대로 계산해 빈칸 $a, b, c, d, e$를 구한다.", "decisiveStep": "두 번째 단계의 곱 $2\\times(-1)=-2$의 부호를 정확히 계산해 $b=-2$임을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "다항식을 일차식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json(H1-RPM-005)의 일차식으로 나눈 조립제법 직접 실행 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조립제법 표의 빈칸을 사칙연산으로 채워 옳지 않은 값을 찾는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b, c, d, e$의 값"}], "method": [{"term": "다항식의나눗셈", "src": "stem", "quote": "조립제법을 이용하여", "evidenceType": "IMPLIED", "justification": "조립제법 표의 각 열 곱셈·덧셈을 수행해 계수와 나머지를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $2x^3-5x^2+x+6$"}], "condition": []}, "reasons": {"method": "조립제법 표의 각 단계를 계산해 b=-2임을 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.6

### 발문

두 다항식 \$f(x)\$, \$g(x)\$를 \$x-2\$로 나누었을 때의 나머지가 각각 \$5\$, \$3\$일 때, 다항식 \$3f(x)-2g(x)\$를 \$x-2\$로 나누었을 때의 나머지는?

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

④

### 해설

나머지정리에 의하여 \$f(2)=5\$, \$g(2)=3\$이다. 따라서 \$3f(x)-2g(x)\$를 \$x-2\$로 나누었을 때의 나머지는 \$\$ 3f(2)-2g(2) \= 3\\cdot 5 - 2\\cdot 3 \= 15-6 \= 9 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "나머지정리 f(2), g(2)를 일차 결합에 대입해 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리로 $f(2)=5, g(2)=3$을 얻은 뒤 $3f(2)-2g(2)$를 계산한다.", "decisiveStep": "일차 결합된 다항식에 $x=2$를 그대로 대입해 $3f(2)-2g(2)$를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json(H1-RPM-009)에서 일차식으로 나눈 나머지정리 유형은 RPM_ONLY로 분류되어 ACTIVE 키가 미확정임"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리를 두 다항식의 일차 결합에 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지는?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $f(x)$, $g(x)$"}], "condition": []}, "reasons": {"method": "나머지정리 f(2)=5, g(2)=3을 3f(2)-2g(2)에 대입함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 3.4

### 발문

다항식 \$2x^3+5x^2-2x+2\$를 다항식 \$A\$로 나누었더니 몫이 \$2x-1\$이고 나머지가 \$3x+1\$이었다. 이때 다항식 \$A\$는?

### 선지

① \$x^2+3x-1\$ ② \$x^2+3x+1\$ ③ \$x^2-3x-1\$ ④ \$x^2+2x-1\$ ⑤ \$x^2+3x-2\$

### 정답

①

### 해설

나눗셈 항등식에 의하여 \$\$ 2x^3+5x^2-2x+2 \= A(2x-1)+(3x+1) \$\$ 이므로 \$A(2x-1) \= 2x^3+5x^2-5x+1\$이다. 우변을 \$2x-1\$로 직접 나누면 \$\$ 2x^3+5x^2-5x+1 \= (2x-1)(x^2+3x-1) \$\$ 이므로 \$A \= x^2+3x-1\$이다.

```
{"status": "EXEMPT", "reason": "나눗셈 항등식에서 나머지를 이항한 뒤 몫으로 나누어 제수 A를 구하는 순수 연산 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "나머지 $3x+1$을 이항해 얻은 $2x^3+5x^2-5x+1$을 $2x-1$로 나누어 $A$를 구한다.", "decisiveStep": "나눗셈 관계식에서 $A(2x-1)=2x^3+5x^2-5x+1$을 먼저 정리한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json(H1-RPM-006)의 다항식 나눗셈 몫과 나머지 직접 실행 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나눗셈 항등식을 정리한 뒤 다항식의 직접 나눗셈을 수행하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "이때 다항식 $A$는?"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "직접 나누면", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "solution", "quote": "나눗셈 항등식에 의하여"}], "condition": []}, "reasons": {"method": "나머지를 이항한 식을 2x-1로 나누어 A를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.3

### 발문

\$x+3y=1\$을 만족하는 모든 실수 \$x\$, \$y\$에 대하여 등식 \$ax^2+by^2+4x-c=0\$이 성립할 때, 상수 \$a\$, \$b\$, \$c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

⑤

### 해설

\$x=1-3y\$를 등식에 대입해 \$y\$에 대하여 내림차순 정리하면 \$\$ a(1-3y)^2+by^2+4(1-3y)-c \= (9a+b)y^2+(-6a-12)y+(a+4-c) \= 0 \$\$ 이다. 모든 실수 \$y\$에 대하여 성립하므로 항등식의 성질에 의해 \$\$ 9a+b=0, \\qquad \-6a-12=0, \\qquad a+4-c=0 \$\$ 이다. 따라서 \$a=-2\$, \$b=18\$, \$c=2\$이므로 \$a+b+c=-2+18+2=18\$이다.

```
{"status": "EXEMPT", "reason": "일차 관계식 x=1-3y를 대입해 한 문자 y에 대한 항등식으로 계수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$x=1-3y$를 대입해 $y$에 대한 이차 항등식으로 정리한 뒤 각 차수의 계수를 $0$으로 두어 $a, b, c$를 구한다.", "decisiveStep": "두 변수 제한 조건 $x+3y=1$을 소거해 독립변수 $y$ 하나만의 항등식으로 만든다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json(H1-RPM-007)의 항등식 미정계수법(계수비교) 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조건부 항등식에서 문자 소거 후 계수비교법을 적용하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$, $c$에 대하여"}], "method": [{"term": "항등식", "src": "solution", "quote": "항등식의 성질에 의해", "evidenceType": "NAMED"}], "given": [{"term": "등식", "src": "stem", "quote": "등식 $ax^2+by^2+4x-c=0$"}], "condition": [{"term": "실수", "src": "stem", "quote": "모든 실수 $x$, $y$에 대하여"}]}, "reasons": {"method": "x=1-3y 대입 후 y에 대한 항등식 계수 비교로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.1

### 발문

\$\\sqrt{-18}\\left(\\sqrt{6}+\\dfrac{1}{\\sqrt{-2}}\\right)+\\dfrac{10-\\sqrt{-12}}{1-\\sqrt{-3}}=a+bi\$일 때, \$a^2+b^2\$의 값은? (단, \$a, b\$는 실수이고 \$i=\\sqrt{-1}\$)

### 선지

① \$169\$ ② \$196\$ ③ \$241\$ ④ \$256\$ ⑤ \$289\$

### 정답

③

### 해설

음수의 제곱근을 \$i\$로 나타내면 \$\\sqrt{-18}=3\\sqrt{2}i\$, \$\\sqrt{-2}=\\sqrt{2}i\$, \$\\sqrt{-12}=2\\sqrt{3}i\$, \$\\sqrt{-3}=\\sqrt{3}i\$이다. 첫째 항은 \$\\dfrac{1}{\\sqrt{2}i}=-\\dfrac{i}{\\sqrt{2}}\$이므로 \$\$ 3\\sqrt{2}i\\left(\\sqrt{6}-\\dfrac{i}{\\sqrt{2}}\\right) \= 6\\sqrt{3}i+3 \$\$ 이다. 둘째 항은 분모의 켤레복소수 \$1+\\sqrt{3}i\$를 곱하면 \$\$ \\dfrac{10-2\\sqrt{3}i}{1-\\sqrt{3}i} \= \\dfrac{(10-2\\sqrt{3}i)(1+\\sqrt{3}i)}{1+3} \= \\dfrac{16+8\\sqrt{3}i}{4} \= 4+2\\sqrt{3}i \$\$ 이다. 두 식을 더하면 \$(3+6\\sqrt{3}i)+(4+2\\sqrt{3}i) \= 7+8\\sqrt{3}i\$이므로 \$a=7\$, \$b=8\\sqrt{3}\$이다. 따라서 \$a^2+b^2 \= 7^2+(8\\sqrt{3})^2 \= 49+192 \= 241\$이다.

```
{"status": "EXEMPT", "reason": "음수의 제곱근을 허수단위 i로 변환하고 분모 실수화를 수행해 a^2+b^2을 구하는 순수 연산 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "음수의 제곱근을 $i$ 꼴로 고쳐 첫째 항을 전개하고 둘째 항을 켤레복소수로 실수화한 뒤 $a^2+b^2$을 구한다.", "decisiveStep": "$\\frac{1}{\\sqrt{-2}}=\\frac{1}{\\sqrt{2}i}=-\\frac{i}{\\sqrt{2}}$의 부호를 정확히 처리한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "사칙연산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json(H1-RPM-023)의 복소수 사칙연산(실수화 포함) 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 제곱근 변환과 복소수 분모 실수화 연산을 함께 수행하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "solution", "quote": "켤레복소수 $1+\\sqrt{3}i$"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모의 켤레복소수 $1+\\sqrt{3}i$를 곱하면", "evidenceType": "NAMED"}], "given": [{"term": "실수", "src": "stem", "quote": "단, $a, b$는 실수이고"}], "condition": [{"term": "실수", "src": "stem", "quote": "단, $a, b$는 실수이고"}]}, "reasons": {"method": "음수 제곱근을 i로 변환 후 켤레복소수 실수화로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.1

### 발문

삼각형 \$ABC\$의 세 변의 길이를 \$a, b, c\$라 할 때, 등식 \$b^3+b^2a+ba^2-c^3-c^2a-ca^2=0\$이 성립한다. 삼각형 \$ABC\$는 어떤 삼각형인가?

### 선지

① \$a=b\$인 이등변삼각형 ② \$b=c\$인 이등변삼각형 ③ \$\\angle A\$가 직각인 직각삼각형 ④ \$\\angle B\$가 직각인 직각삼각형 ⑤ 정삼각형

### 정답

②

### 해설

주어진 식을 \$a\$에 대하여 내림차순으로 정리하여 인수분해하면 \$\$ \\begin{aligned} (b-c)a^2+(b^2-c^2)a+(b^3-c^3) &= (b-c){a^2+(b+c)a+(b^2+bc+c^2)} \= 0 \\end{aligned} \$\$ 이다. \$a, b, c\$는 삼각형의 세 변의 길이이므로 모두 양수이고, 따라서 \$a^2+(b+c)a+b^2+bc+c^2 \> 0\$이다. 그러므로 \$b-c=0\$, 즉 \$b=c\$인 이등변삼각형이다.

```
{"status": "EXEMPT", "reason": "삼차 대칭식을 한 문자로 내림차순 인수분해하고 변의 양수 조건으로 삼각형을 판별하는 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$a$에 대하여 내림차순 정리해 $(b-c)$로 인수분해한 뒤 삼각형 변의 양수 조건으로 $b=c$를 결론짓는다.", "decisiveStep": "인수분해 후 남은 이차 인수 $a^2+(b+c)a+b^2+bc+c^2$이 $a,b,c>0$에서 항상 양수임을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json(H1-RPM-020)의 인수분해 조건식 활용(삼각형 판별) 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 인수분해와 삼각형 변의 양수 조건을 결합해 도형을 판별하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이등변삼각형", "src": "choices", "quote": "$b=c$인 이등변삼각형"}], "method": [{"term": "인수분해", "src": "solution", "quote": "내림차순으로 정리하여 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $ABC$의 세 변의 길이"}], "condition": [{"term": "양수", "src": "solution", "quote": "모두 양수이고"}]}, "reasons": {"method": "a에 대해 내림차순 인수분해 후 양수 조건으로 b=c를 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.4

### 발문

실수 \$x, y\$에 대하여 \$(2+i)x+(1-i)y=6-15i\$가 성립할 때, \$\\dfrac{\\sqrt{y}}{\\sqrt{x}}+\\sqrt{x}\\sqrt{-y}\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-6-2i\$ ② \$-6+2i\$ ③ \$6-2i\$ ④ \$-2-6i\$ ⑤ \$-2+6i\$

### 정답

①

### 해설

좌변을 정리하면 \$(2x+y)+(x-y)i \= 6-15i\$이고 \$x, y\$는 실수이므로 \$\$ 2x+y=6, \\qquad x-y=-15 \$\$ 이다. 두 식을 더하면 \$3x=-9 \\implies x=-3\$이고, \$y=x+15=12\$이다. 따라서 \$\\sqrt{x}=\\sqrt{-3}=\\sqrt{3}i\$, \$\\sqrt{y}=\\sqrt{12}=2\\sqrt{3}\$, \$\\sqrt{-y}=\\sqrt{-12}=2\\sqrt{3}i\$이므로 \$\$ \\dfrac{\\sqrt{y}}{\\sqrt{x}}+\\sqrt{x}\\sqrt{-y} \= \\dfrac{2\\sqrt{3}}{\\sqrt{3}i}+(\\sqrt{3}i)(2\\sqrt{3}i) \= \\dfrac{2}{i}+6i^2 \= \-2i-6 \= \-6-2i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수 상등 조건으로 x, y를 구한 뒤 음수의 제곱근 계산을 수행하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "복소수 상등으로 $x=-3, y=12$를 구한 뒤 $\\sqrt{-3}=\\sqrt{3}i, \\sqrt{-12}=2\\sqrt{3}i$로 변환해 계산한다.", "decisiveStep": "$x<0, -y<0$이므로 음수의 제곱근을 $i$로 먼저 꺼낸 뒤 나눗셈과 곱셈을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json(H1-RPM-022)의 서로 같은 복소수 성질 활용 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 상등 연립방정식과 음수의 제곱근 성질을 연속 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "solution", "quote": "좌변을 정리하면 $(2x+y)+(x-y)i = 6-15i$"}], "method": [{"term": "연립방정식", "src": "solution", "quote": "두 식을 더하면 $3x=-9", "evidenceType": "IMPLIED", "justification": "복소수 상등 조건에서 얻은 두 일차방정식을 연립해 x, y를 구함"}], "given": [{"term": "실수", "src": "stem", "quote": "실수 $x, y$에 대하여"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $x, y$에 대하여"}]}, "reasons": {"method": "복소수 상등 연립으로 x=-3, y=12를 구해 음수 제곱근 식을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$4x^2-(k+4)x+k=0\$의 두 근의 비가 \$2:3\$일 때, 정수 \$k\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$8\$

### 정답

④

### 해설

두 근의 비가 \$2:3\$이므로 두 근을 \$2t, 3t\$ (\$t\\ne 0\$)라 두면 근과 계수의 관계에 의하여 \$\$ 2t+3t \= 5t \= \\dfrac{k+4}{4}, \\qquad (2t)(3t) \= 6t^2 \= \\dfrac{k}{4} \$\$ 이다. \$t=\\dfrac{k+4}{20}\$을 둘째 식에 대입하면 \$\$ 6\\cdot\\dfrac{(k+4)^2}{400} \= \\dfrac{k}{4} \\implies 3(k+4)^2 \= 50k \\implies 3k^2-26k+48 \= 0 \$\$ 인수분해하면 \$(3k-8)(k-6)=0\$이므로 \$k=\\dfrac{8}{3}\$ 또는 \$k=6\$이다. \$k\$는 정수이므로 \$k=6\$이다.

```
{"status": "EXEMPT", "reason": "두 근의 비 2:3을 2t, 3t로 놓고 근과 계수의 관계로 정수 k를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 근을 $2t, 3t$로 두고 근과 계수의 관계 $5t=\\frac{k+4}{4}, 6t^2=\\frac{k}{4}$에서 $t$를 소거해 정수 $k$를 구한다.", "decisiveStep": "이차방정식 $3k^2-26k+48=0$의 두 해 중 정수 조건에 맞는 $k=6$을 택한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json(H1-RPM-029)의 근과 계수의 관계(합·곱) 유형과 일치하나 DIRECT_BINDING_GAP 상태임"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근의 비 조건을 $2t, 3t$로 설정해 근과 계수의 관계로 $k$에 대한 이차방정식을 푸는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $k$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $4x^2-(k+4)x+k=0$"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $k$의 값은?"}]}, "reasons": {"method": "두 근을 2t, 3t로 두고 근과 계수의 관계로 정수 k=6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q09

- 형식: 객관식  
- 배점: 4.5

### 발문

두 복소수 \$\\alpha\$, \$\\beta\$와 각각의 켤레복소수 \$\\bar{\\alpha}\$, \$\\bar{\\beta}\$에 대하여 \<보기\> 중 항상 성립하는 것만을 있는 대로 고른 것은?

\<보기\> ㄱ. \$\\alpha\$, \$\\beta\$가 모두 실수이면 \$\\bar{\\alpha}+\\beta \= \\alpha+\\bar{\\beta}\$이다. ㄴ. \$\\alpha\\bar{\\alpha}=0\$이면 \$\\alpha=\\bar{\\alpha}\$이다. ㄷ. \$\\alpha^2+\\beta^2=0\$이면 \$\\alpha=0\$, \$\\beta=0\$이다. ㄹ. \$\\beta=\\bar{\\alpha}\$, \$\\alpha\\ne 0\$일 때, \$\\alpha+\\beta=0\$이면 \$\\alpha, \\beta\$는 순허수이다.

### 선지

① ㄱ, ㄴ ② ㄴ, ㄹ ③ ㄱ, ㄴ, ㄷ ④ ㄱ, ㄷ, ㄹ ⑤ ㄱ, ㄴ, ㄹ

### 정답

⑤

### 해설

- ㄱ. \$\\alpha, \\beta\$가 실수이면 \$\\bar{\\alpha}=\\alpha, \\bar{\\beta}=\\beta\$이므로 \$\\bar{\\alpha}+\\beta=\\alpha+\\bar{\\beta}\$이다. (참)  
- ㄴ. \$\\alpha=a+bi\$ (\$a, b\$는 실수)라 하면 \$\\alpha\\bar{\\alpha}=a^2+b^2=0\$이므로 \$a=b=0\$, 즉 \$\\alpha=0\$이고 \$\\alpha=\\bar{\\alpha}\$이다. (참)  
- ㄷ. \$\\alpha=i, \\beta=1\$이면 \$\\alpha^2+\\beta^2=-1+1=0\$이지만 \$\\alpha\\ne 0, \\beta\\ne 0\$이다. (거짓)  
- ㄹ. \$\\beta=\\bar{\\alpha}\$에서 \$\\alpha+\\bar{\\alpha}=2\\operatorname{Re}(\\alpha)=0\$이므로 \$\\alpha\$의 실수부분은 \$0\$이고 \$\\alpha\\ne 0\$이므로 \$\\alpha, \\beta\$는 순허수이다. (참) 따라서 옳은 것은 ㄱ, ㄴ, ㄹ이다.

```
{"status": "EXEMPT", "reason": "켤레복소수와 순허수의 정의 및 반례를 통해 명제의 참·거짓을 판별하는 합답형 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "실수·순허수 조건과 $\\alpha\\bar{\\alpha}=a^2+b^2$ 성질을 적용하고, ㄷ에는 $\\alpha=i, \\beta=1$ 반례를 들어 판정한다.", "decisiveStep": "$\\alpha^2+\\beta^2=0$이 복소수 범위에서 $\\alpha=\\beta=0$을 보장하지 않는 반례를 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json(H1-RPM-024)의 켤레복소수 성질 판별 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수와 켤레복소수의 기본 성질 4가지를 정의와 반례로 판별하는 합답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "각각의 켤레복소수 $\\bar{\\alpha}$, $\\bar{\\beta}$"}], "method": [{"term": "복소수", "src": "stem", "quote": "두 복소수 $\\alpha$, $\\beta$", "evidenceType": "IMPLIED", "justification": "복소수의 실수부·허수부와 켤레 성질 및 반례를 이용해 각 명제를 판별함"}], "given": [{"term": "복소수", "src": "stem", "quote": "두 복소수 $\\alpha$, $\\beta$"}], "condition": [{"term": "순허수", "src": "stem", "quote": "$\\alpha, \\beta$는 순허수이다"}]}, "reasons": {"method": "켤레복소수 성질과 반례를 이용해 ㄱ, ㄴ, ㄹ의 참을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.6

### 발문

\$x\$에 대한 이차방정식 \$x^2+2(k-a)x+(bk^2+5k-c)=0\$이 실수 \$k\$의 값에 관계없이 항상 중근을 가질 때, 실수 \$a, b, c\$에 대하여 \$2a+3b+4c\$의 값은?

### 선지

① \$-23\$ ② \$-25\$ ③ \$-27\$ ④ \$-29\$ ⑤ \$-31\$

### 정답

③

### 해설

이차방정식이 항상 중근을 가지므로 판별식 \$\\dfrac{D}{4}=0\$이다. \$\$ \\dfrac{D}{4} \= (k-a)^2-(bk^2+5k-c) \= (1-b)k^2+(-2a-5)k+(a^2+c) \= 0 \$\$ 이 등식이 모든 실수 \$k\$에 대하여 성립하므로 \$k\$에 대한 항등식의 성질에 의하여 \$\$ 1-b=0, \\qquad \-2a-5=0, \\qquad a^2+c=0 \$\$ 이다. 따라서 \$b=1\$, \$a=-\\dfrac{5}{2}\$, \$c=-a^2=-\\dfrac{25}{4}\$이므로 \$\$ 2a+3b+4c \= 2\\left(-\\dfrac{5}{2}\\right)+3(1)+4\\left(-\\dfrac{25}{4}\\right) \= \-5+3-25 \= \-27 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "중근 판별식 D=0이 k에 대한 항등식이 되도록 계수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "판별식 $\\frac{D}{4}=(1-b)k^2+(-2a-5)k+(a^2+c)=0$이 $k$에 대한 항등식이 되도록 세 계수를 모두 $0$으로 둔다.", "decisiveStep": "$k^2$, $k$, 상수항의 계수를 각각 $0$으로 놓아 $b, a, c$를 순서대로 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "계수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_PARAMETER_IDENTITY", "why": "high1.json(H1-RPM-032)의 매개변수와 무관한 판별식 조건 유형과 일치하나 FAMILY_BINDING_GAP 상태임"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식 $D=0$과 이차 항등식 계수 비교를 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a, b, c$에 대하여"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $\\dfrac{D}{4}=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+2(k-a)x+(bk^2+5k-c)=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "항상 중근을 가질 때"}]}, "reasons": {"method": "판별식을 k에 대해 정리 후 항등식 조건으로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q11

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$y=x^2-3x+8\$의 그래프가 직선 \$y=-x+k\$보다 항상 위쪽에 있도록 하는 자연수 \$k\$의 최댓값은?

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$

### 정답

①

### 해설

포물선이 직선보다 항상 위쪽에 있으려면 모든 실수 \$x\$에 대하여 \$\$ (x^2-3x+8)-(-x+k) \= x^2-2x+8-k \= (x-1)^2+7-k \> 0 \$\$ 이어야 한다. \$(x-1)^2\\ge 0\$이므로 최솟값 \$7-k\>0\$, 즉 \$k\<7\$이다. 따라서 이를 만족하는 자연수 \$k\$의 최댓값은 \$6\$이다.

```
{"status": "EXEMPT", "reason": "이차함수가 직선보다 항상 위에 있을 조건을 차의 완전제곱식 최솟값>0으로 푸는 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 식의 차 $x^2-2x+8-k=(x-1)^2+7-k$의 최솟값 $7-k>0$에서 $k<7$을 구한다.", "decisiveStep": "'항상 위쪽' 조건을 차의 최솟값이 양수인 부등식 $7-k>0$으로 전환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json(H1-RPM-035)의 직선과 포물선 위치 관계(교점 없음) 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 위치 관계 부등식을 완전제곱식으로 푸는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "자연수 $k$의 최댓값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x-1)^2+7-k > 0", "evidenceType": "IMPLIED", "justification": "두 함수의 차를 완전제곱식으로 변형해 최솟값이 양수가 되도록 k 범위를 구함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-3x+8$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $k$의 최댓값"}]}, "reasons": {"method": "두 식의 차를 완전제곱식으로 정리해 k<7과 자연수 최댓값 6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.1

### 발문

이차방정식 \$3x^2-ax+4b=0\$이 중근을 가질 때, \$a\$의 값이 최소가 되게 하는 자연수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$12\$ ② \$15\$ ③ \$18\$ ④ \$21\$ ⑤ \$24\$

### 정답

②

### 해설

이차방정식이 중근을 가지므로 판별식 \$D=0\$이다. \$\$ D \= (-a)^2-4\\cdot 3\\cdot 4b \= a^2-48b \= 0 \\implies a^2 \= 48b \= 2^4\\cdot 3\\cdot b \$\$ \$a, b\$는 자연수이고 \$a^2\$이 제곱수이면서 \$2^4\\cdot 3\$의 배수이므로 \$b\$는 \$3\$을 인수로 가져야 하고, \$a\$가 최소일 때 \$b=3\$이다. 이때 \$a^2 \= 2^4\\cdot 3^2 \= 12^2\$이므로 \$a=12\$이다. 따라서 \$a+b=12+3=15\$이다.

```
{"status": "EXEMPT", "reason": "판별식 a^2=48b에서 소인수분해를 이용해 최소 자연수 a, b를 구하는 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "중근 조건 $a^2=48b=2^4\\cdot 3b$에서 $a$가 최소가 되도록 소인수 지수를 짝수로 맞추는 최소 자연수 $b=3$을 찾는다.", "decisiveStep": "$48=2^4\\cdot 3$의 소인수분해를 이용해 $b$의 최솟값이 $3$임을 판정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json(H1-RPM-028)의 판별식 중근 조건 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 판별식과 제곱수 만들기 소인수분해 조건을 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "자연수 $a, b$에 대하여"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $3x^2-ax+4b=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 가질 때"}]}, "reasons": {"method": "판별식 a^2=48b와 소인수분해로 최소 자연수 a=12, b=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.5

### 발문

이차방정식 \$x^2-x-4=0\$의 두 실근을 \$\\alpha\$, \$\\beta\$라 할 때, \$\\dfrac{2\\alpha}{\\alpha^2-3\\alpha-6}+\\dfrac{2\\beta}{\\beta^2-3\\beta-6}\$의 값은?

### 선지

① \$-\\dfrac{5}{2}\$ ② \$-3\$ ③ \$-\\dfrac{13}{4}\$ ④ \$-\\dfrac{7}{2}\$ ⑤ \$-4\$

### 정답

④

### 해설

\$\\alpha, \\beta\$는 \$x^2-x-4=0\$의 두 근이므로 \$\\alpha^2=\\alpha+4\$, \$\\beta^2=\\beta+4\$이다. 따라서 분모는 \$\$ \\alpha^2-3\\alpha-6 \= (\\alpha+4)-3\\alpha-6 \= \-2\\alpha-2 \= \-2(\\alpha+1) \$\$ 이고, 마찬가지로 \$\\beta^2-3\\beta-6 \= \-2(\\beta+1)\$이다. 준식을 정리하면 \$\$ \-\\dfrac{\\alpha}{\\alpha+1}-\\dfrac{\\beta}{\\beta+1} \= \-\\left(1-\\dfrac{1}{\\alpha+1}\\right)-\\left(1-\\dfrac{1}{\\beta+1}\\right) \= \-2+\\left(\\dfrac{1}{\\alpha+1}+\\dfrac{1}{\\beta+1}\\right) \$\$ 이다. 근과 계수의 관계에서 \$\\alpha+\\beta=1\$, \$\\alpha\\beta=-4\$이므로 \$\$ \\dfrac{1}{\\alpha+1}+\\dfrac{1}{\\beta+1} \= \\dfrac{\\alpha+\\beta+2}{\\alpha\\beta+\\alpha+\\beta+1} \= \\dfrac{1+2}{-4+1+1} \= \-\\dfrac{3}{2} \$\$ 이다. 따라서 구하는 값은 \$-2-\\dfrac{3}{2}=-\\dfrac{7}{2}\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식 차수 낮추기로 분모를 일차식으로 줄인 뒤 근과 계수의 관계로 대칭 분수식을 계산하는 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha^2=\\alpha+4$로 분모를 $-2(\\alpha+1)$로 낮춘 뒤 $\\frac{\\alpha}{\\alpha+1}=1-\\frac{1}{\\alpha+1}$로 분리하여 근과 계수의 관계를 적용한다.", "decisiveStep": "분모 차수 낮추기 후 $\\frac{\\alpha}{\\alpha+1}$을 분리해 통분 계산을 단순화한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json(H1-RPM-029)의 근과 계수의 관계 대칭식 유형과 일치하나 DIRECT_BINDING_GAP 상태임"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "차수 낮추기와 대칭 유리식 분리·통분, 근과 계수의 관계가 결합된 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "\\dfrac{1}{\\alpha+1}+\\dfrac{1}{\\beta+1}"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에서", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-x-4=0$"}], "condition": []}, "reasons": {"method": "차수 낮추기로 분모를 일차식으로 줄인 뒤 근과 계수의 관계로 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q14

- 형식: 객관식  
- 배점: 4.3

### 발문

다음 그림과 같이 밑변의 길이가 \$16\$, 높이가 \$10\$인 직각삼각형 \$ABC\$에 내접하는 직사각형 \$EBFD\$를 그렸다. 직사각형 \$EBFD\$의 넓이가 최대일 때 직사각형 \$EBFD\$의 둘레의 길이는?

### 선지

① \$22\$ ② \$24\$ ③ \$26\$ ④ \$28\$ ⑤ \$30\$

### 정답

③

### 해설

직사각형 \$EBFD\$의 가로 길이를 \$\\overline{BF}=x\$, 세로 길이를 \$\\overline{EB}=y\$라 하자. \$\\overline{AB}=10\$, \$\\overline{BC}=16\$이고 \$\\triangle ABC \\sim \\triangle DFC\$이므로 \$\$ \\dfrac{y}{16-x} \= \\dfrac{10}{16} \= \\dfrac{5}{8} \\implies y \= 10-\\dfrac{5}{8}x \$\$ 이다. 직사각형 \$EBFD\$의 넓이 \$S\$는 \$\$ S \= xy \= x\\left(10-\\dfrac{5}{8}x\\right) \= \-\\dfrac{5}{8}(x-8)^2+40 \$\$ 이므로 \$x=8\$ (\$0\<x\<16\$)일 때 넓이가 최대이고, 이때 \$y=10-\\dfrac{5}{8}\\cdot 8=5\$이다. 따라서 직사각형 \$EBFD\$의 둘레의 길이는 \$2(x+y)=2(8+5)=26\$이다.

```
{"status": "READY", "pattern": "construction-spike-v1", "viewBox": "0 0 360 280", "elements": [{"type": "polygon", "id": "triangle_ABC", "points": [[50, 230], [50, 70], [306, 230]], "labels": ["B", "A", "C"]}, {"type": "polygon", "id": "inscribed_rect", "points": [[50, 230], [50, 150], [178, 150], [178, 230]], "labels": ["B", "E", "D", "F"]}, {"type": "right_angle", "vertex": [50, 230]}, {"type": "label", "pos": [30, 150], "text": "$10$"}, {"type": "label", "pos": [178, 250], "text": "$16$"}], "note": "각 B가 직각이고 높이 AB=10, 밑변 BC=16인 직각삼각형 ABC에 내접하는 직사각형 EBFD 도식"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "닮음 비례식 $\\frac{y}{16-x}=\\frac{10}{16}$으로 $y$를 $x$로 나타낸 뒤 넓이 $S=xy$의 이차함수 최댓값 지점에서 둘레를 구한다.", "decisiveStep": "닮음으로 $y=10-\\frac{5}{8}x$를 유도해 넓이를 한 변수 $x$의 이차함수로 바꾼다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json(H1-RPM-038)의 도형 조건식 활용 이차함수 최대·최소 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직각삼각형 닮음 비례식으로 이차함수를 세워 최대 넓이일 때 둘레를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "둘레", "src": "stem", "quote": "둘레의 길이는?"}], "method": [{"term": "이차함수", "src": "solution", "quote": "-\\dfrac{5}{8}(x-8)^2+40", "evidenceType": "IMPLIED", "justification": "닮음으로 두 변의 관계식을 세워 넓이의 이차함수를 완전제곱식으로 정리함"}], "given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 $ABC$"}], "condition": [{"term": "내접", "src": "stem", "quote": "내접하는 직사각형 $EBFD$"}]}, "reasons": {"method": "삼각형 닮음으로 넓이 이차함수를 세워 최대일 때의 둘레를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 3.9

### 발문

이차함수 \$y=x^2+5x+2a-1\$의 그래프가 \$x\$축과 만날 때, \$a\$의 값이 될 수 있는 자연수의 개수는?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$4\$ ⑤ \$3\$

### 정답

⑤

### 해설

이차함수 \$y=x^2+5x+2a-1\$의 그래프가 \$x\$축과 만나려면 이차방정식 \$x^2+5x+2a-1=0\$이 실근을 가져야 하므로 판별식 \$D\\ge 0\$이어야 한다. \$\$ D \= 5^2-4(2a-1) \= 25-8a+4 \= 29-8a \\ge 0 \\implies a \\le \\dfrac{29}{8} \= 3.625 \$\$ 따라서 자연수 \$a\$는 \$1, 2, 3\$의 \$3\$개이다.

```
{"status": "EXEMPT", "reason": "이차함수가 x축과 만날 조건 D>=0으로 자연수 a의 개수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$x$축과 만날 조건을 $x^2+5x+2a-1=0$의 판별식 $D=29-8a\\ge 0$으로 풀어 자연수 $a$를 센다.", "decisiveStep": "'만난다'는 접하는 경우를 포함하므로 $D>0$이 아니라 $D\\ge 0$을 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json(H1-RPM-033)의 이차함수 그래프와 x축 교점 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$축 교점 존재 조건에 판별식 $D\\ge 0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "자연수의 개수는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D\\ge 0$이어야 한다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+5x+2a-1$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수의 개수는?"}]}, "reasons": {"method": "판별식 D>=0을 풀어 a<=29/8을 만족하는 자연수 개수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.1

### 발문

이차함수 \$y=2x^2+mx-7\$의 그래프와 직선 \$y=x+n\$의 두 교점의 \$x\$좌표가 각각 \$-2\$, \$1\$일 때, 실수 \$m, n\$에 대하여 \$2m+3n\$의 값은?

### 선지

① \$-3\$ ② \$-1\$ ③ \$1\$ ④ \$3\$ ⑤ \$5\$

### 정답

①

### 해설

두 그래프의 교점의 \$x\$좌표는 이차방정식 \$2x^2+mx-7=x+n\$, 즉 \$\$ 2x^2+(m-1)x-(7+n) \= 0 \$\$ 의 두 근이다. 두 근이 \$-2, 1\$이고 \$x^2\$의 계수가 \$2\$이므로 \$\$ 2(x+2)(x-1) \= 2(x^2+x-2) \= 2x^2+2x-4 \$\$ 와 계수를 비교하면 \$m-1=2\$, \$-(7+n)=-4\$이다. 따라서 \$m=3\$, \$n=-3\$이므로 \$2m+3n \= 2(3)+3(-3) \= 6-9 \= \-3\$이다.

```
{"status": "EXEMPT", "reason": "두 그래프의 교점 x좌표를 연립 이차방정식의 두 근으로 두고 계수를 비교해 m, n을 구하는 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $2x^2+(m-1)x-(7+n)=0$의 두 근이 $-2, 1$이므로 $2(x+2)(x-1)$과 계수 비교하여 $m, n$을 구한다.", "decisiveStep": "$x^2$의 계수가 $2$임을 유지해 $2(x+2)(x-1)=2x^2+2x-4$와 비교한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json(H1-RPM-035)의 직선과 포물선의 교점 방정식 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 교점 좌표를 연립 이차방정식의 근으로 해석하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $m, n$에 대하여"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=2x^2+mx-7$"}], "condition": []}, "reasons": {"method": "연립방정식을 2(x+2)(x-1)과 계수 비교해 m, n을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.3

### 발문

\$x\$의 값의 범위가 \$-1\\le x\\le 4\$일 때, 이차함수 \$y=x^2-6x+a\$의 최솟값은 \$1\$이다. 이 범위에서 이차함수의 최댓값은? (단, \$a\$는 실수)

### 선지

① \$15\$ ② \$17\$ ③ \$19\$ ④ \$21\$ ⑤ \$23\$

### 정답

②

### 해설

이차함수를 표준형으로 고치면 \$\$ y \= x^2-6x+a \= (x-3)^2+a-9 \$\$ 이다. 꼭짓점의 \$x\$좌표 \$3\$이 구간 \$-1\\le x\\le 4\$에 포함되므로 최솟값은 \$a-9\$이다. 최솟값이 \$1\$이므로 \$a-9=1 \\implies a=10\$이고, \$y=(x-3)^2+1\$이다. 구간의 양 끝값에서 \$x=-1\$일 때 \$y=(-1-3)^2+1=17\$, \$x=4\$일 때 \$y=(4-3)^2+1=2\$이므로 최댓값은 \$17\$이다.

```
{"status": "EXEMPT", "reason": "제한 범위에서 이차함수 최솟값으로 상수 a를 구한 뒤 양 끝점에서 최댓값을 구하는 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$y=(x-3)^2+a-9$의 축 $x=3$이 $[-1, 4]$에 속하므로 $a-9=1$로 $a=10$을 구하고 $x=-1$에서 최댓값을 구한다.", "decisiveStep": "축 $x=3$이 구간에 포함됨을 먼저 확인해 최솟값을 $a-9$로 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json(H1-RPM-037)의 제한 구간 내 이차함수 최대·최소 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한 범위 내 이차함수의 최솟값 조건으로 미정계수를 정한 뒤 최댓값을 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "이차함수의 최댓값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x-3)^2+a-9", "evidenceType": "IMPLIED", "justification": "완전제곱식으로 꼭짓점 위치를 확인해 a를 구하고 양 끝값을 비교함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-6x+a$"}], "condition": [{"term": "범위", "src": "stem", "quote": "값의 범위가 $-1\\le x\\le 4$"}]}, "reasons": {"method": "표준형 변형 후 최솟값으로 a를 구하고 구간 끝에서 최댓값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 5

### 발문

다항식 \$P(x)\$를 \$x-4\$로 나누었을 때 나머지가 \$7\$이고, \$x+2\$로 나누었을 때 나머지가 \$-5\$이다. \$P(x)\$를 \$(x-4)(x+2)\$로 나누었을 때의 나머지를 \$R(x)\$라 하자. \$R(4)\$를 구하시오.

### 선지

없음

### 정답

\$7\$

### 해설

나머지정리에 의하여 \$P(4)=7\$이다. 한편 \$P(x)\$를 \$(x-4)(x+2)\$로 나눈 몫을 \$Q(x)\$, 나머지를 \$R(x)\$라 하면 \$\$ P(x) \= (x-4)(x+2)Q(x)+R(x) \$\$ 이다. 이 항등식의 양변에 \$x=4\$를 대입하면 \$\$ P(4) \= (4-4)(4+2)Q(4)+R(4) \= R(4) \$\$ 이므로 \$R(4)=P(4)=7\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리와 나눗셈 항등식 대입으로 R(4)=P(4)를 바로 구하는 단답형 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나눗셈 항등식 $P(x)=(x-4)(x+2)Q(x)+R(x)$에 $x=4$를 대입해 $R(4)=P(4)=7$을 구한다.", "decisiveStep": "$R(x)$ 전체를 구하지 않고도 $x=4$ 대입만으로 $R(4)=P(4)$가 즉시 얻어진다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json(H1-RPM-010)의 합성 제수 나머지 조건 결합 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나눗셈 항등식에 $x=4$를 대입해 $R(4)=P(4)$임을 바로 읽는 기본 단답형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 하자"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여 $P(4)=7$", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": []}, "reasons": {"method": "나눗셈 항등식에 x=4를 대입해 R(4)=P(4)=7을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 5

### 발문

어느 직육면체의 모든 모서리의 길이의 합이 \$40\$이고 겉넓이가 \$58\$일 때, 이 직육면체의 대각선의 길이를 구하시오.

### 선지

없음

### 정답

\$\\sqrt{42}\$

### 해설

직육면체의 가로, 세로, 높이를 각각 \$a, b, c\$라 하면 모든 모서리의 길이의 합이 \$40\$이므로 \$\$ 4(a+b+c) \= 40 \\implies a+b+c \= 10 \$\$ 이고, 겉넓이가 \$58\$이므로 \$2(ab+bc+ca)=58\$이다. 직육면체의 대각선의 길이를 \$d\$라 하면 \$\$ d^2 \= a^2+b^2+c^2 \= (a+b+c)^2-2(ab+bc+ca) \= 10^2-58 \= 100-58 \= 42 \$\$ 이다. \$d\>0\$이므로 대각선의 길이는 \$\\sqrt{42}\$이다.

```
{"status": "EXEMPT", "reason": "직육면체의 모서리 합과 겉넓이 조건에 곱셈 공식 변형을 적용해 대각선 길이를 구하는 단답형 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$a+b+c=10$과 $2(ab+bc+ca)=58$을 곱셈 공식의 변형 $a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)$에 대입한다.", "decisiveStep": "대각선 길이의 제곱 $a^2+b^2+c^2$을 세 수의 합의 제곱과 둘씩 곱의 합으로 연결한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json(H1-RPM-003)의 곱셈공식 변형 활용 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 문자 곱셈 공식 변형을 직육면체 도형 조건에 바로 적용하는 기본 단답형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대각선", "src": "stem", "quote": "대각선의 길이를 구하시오"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "(a+b+c)^2-2(ab+bc+ca)", "evidenceType": "IMPLIED", "justification": "세 항의 합의 제곱 곱셈 공식 변형을 이용해 대각선 길이의 제곱을 구함"}], "given": [{"term": "겉넓이", "src": "stem", "quote": "겉넓이가 $58$일 때"}], "condition": []}, "reasons": {"method": "모서리 합과 겉넓이에 곱셈 공식 변형을 적용해 대각선 길이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 7

### 발문

허수 \$z\$에 대하여 \$z+\\dfrac{4}{z}\$가 실수일 때, \$z+\\dfrac{4}{z}+(z-1)(\\bar{z}-1)\$의 값을 구하시오. (단, \$\\bar{z}\$는 \$z\$의 켤레복소수이다.)

### 선지

없음

### 정답

\$5\$

### 해설

허수 \$z=a+bi\$ (\$a, b\$는 실수, \$b\\ne 0\$)라 두면 \$\\dfrac{4}{z}=\\dfrac{4(a-bi)}{a^2+b^2}\$이므로 \$\$ z+\\dfrac{4}{z} \= \\left(a+\\dfrac{4a}{a^2+b^2}\\right)+b\\left(1-\\dfrac{4}{a^2+b^2}\\right)i \$\$ 이다. 이 값이 실수이므로 허수부분이 \$0\$이어야 하고, \$b\\ne 0\$이므로 \$1-\\dfrac{4}{a^2+b^2}=0\$, 즉 \$a^2+b^2=4\$이다. 따라서 \$z\\bar{z}=4\$이고 \$\\dfrac{4}{z}=\\bar{z}\$이다. 이를 구하는 식에 대입하면 \$\$ \\begin{aligned} z+\\dfrac{4}{z}+(z-1)(\\bar{z}-1) &= z+\\bar{z}+(z\\bar{z}-z-\\bar{z}+1) \\ &= z\\bar{z}+1 \= 4+1 \= 5 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "허수 z에 대해 z+4/z가 실수일 조건으로 zzbar=4를 도출하고 대칭식을 계산하는 서술형 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=a+bi$ ($b\\ne 0$)에서 $z+\\frac{4}{z}$의 허수부분이 $0$임을 이용해 $z\\bar{z}=4, \\frac{4}{z}=\\bar{z}$를 얻고 식을 전개한다.", "decisiveStep": "$\\frac{4}{z}=\\bar{z}$로 바꾸면 전개 시 $z+\\bar{z}$ 항이 모두 소거되어 $z\\bar{z}+1$만 남는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json(H1-RPM-026)의 복소수 실수 조건 활용 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 실수 조건에서 $z\\bar{z}=4$를 도출해 대칭식을 간단히 계산하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "$\\bar{z}$는 $z$의 켤레복소수이다"}], "method": [{"term": "복소수", "src": "stem", "quote": "허수 $z$에 대하여", "evidenceType": "IMPLIED", "justification": "z=a+bi의 허수부분=0 조건으로 zzbar=4를 유도해 대입함"}], "given": [{"term": "허수", "src": "stem", "quote": "허수 $z$에 대하여"}], "condition": [{"term": "실수", "src": "stem", "quote": "$z+\\dfrac{4}{z}$가 실수일 때"}]}, "reasons": {"method": "z+4/z의 실수 조건에서 zzbar=4를 구해 식의 값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 7

### 발문

\$a, b\$가 정수이고, \$n\$이 \$150\$ 이하의 자연수일 때, 다항식 \$x^3-(ab+9)x+n\$ 중에서 \$(x-3)(x+a)(x-b)\$의 꼴로 인수분해되는 다항식의 개수를 구하시오.

### 선지

없음

### 정답

\$5\$

### 해설

\$(x-3)(x+a)(x-b)\$를 전개하면 \$\$ \\begin{aligned} (x-3)(x+a)(x-b) &= (x-3){x^2+(a-b)x-ab} \\ &= x^3+(a-b-3)x^2+{-ab-3(a-b)}x+3ab \\end{aligned} \$\$ 이다. 이 식이 \$x^3-(ab+9)x+n\$과 같아야 하므로 \$x^2\$의 계수 비교에서 \$a-b-3=0\$, 즉 \$a=b+3\$이다. 이때 \$x\$의 계수는 \$-ab-3(3)=-ab-9\$로 일치하고, 상수항에서 \$n=3ab=3b(b+3)\$이다. \$n\$이 \$150\$ 이하의 자연수이므로 \$1 \\le 3b(b+3) \\le 150\$, 즉 \$1 \\le b(b+3) \\le 50\$이다. 정수 \$b\$에 대하여 가능한 \$b(b+3)\$의 값을 조사하면

- \$b=1\$ 또는 \$b=-4\$: \$b(b+3)=4 \\implies n=12\$  
- \$b=2\$ 또는 \$b=-5\$: \$b(b+3)=10 \\implies n=30\$  
- \$b=3\$ 또는 \$b=-6\$: \$b(b+3)=18 \\implies n=54\$  
- \$b=4\$ 또는 \$b=-7\$: \$b(b+3)=28 \\implies n=84\$  
- \$b=5\$ 또는 \$b=-8\$: \$b(b+3)=40 \\implies n=120\$ (\$b=6\$ 또는 \$b=-9\$이면 \$b(b+3)=54\>50\$) 서로 다른 자연수 \$n\$이 다항식 \$x^3-(ab+9)x+n\$을 서로 다르게 결정하고, \$x\$의 계수 \$-(ab+9)=-\\left(\\frac{n}{3}+9\\right)\$도 유일하므로 구하는 다항식은 \$5\$개이다.

```
{"status": "EXEMPT", "reason": "삼차 인수분해식을 전개해 계수 비교로 n=3b(b+3)을 얻고 범위 내 정수해 개수를 세는 서술형 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$(x-3)(x+a)(x-b)$를 전개해 $a=b+3$과 $n=3b(b+3)$을 얻은 뒤 $1\\le b(b+3)\\le 50$을 만족하는 서로 다른 $n$의 개수를 센다.", "decisiveStep": "$b$와 $-b-3$이 같은 $n$ 값을 만드므로 $b$의 개수가 아니라 서로 다른 $n$의 개수를 센다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json(H1-RPM-020)의 인수분해 조건식 활용 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항등식 계수 비교, 부정방정식 정수 조건, 중복 제거 카운팅이 결합된 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "다항식의 개수를 구하시오"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수 비교에서 $a-b-3=0$", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^3-(ab+9)x+n$"}], "condition": [{"term": "정수", "src": "stem", "quote": "$a, b$가 정수이고"}]}, "reasons": {"method": "인수분해식 전개와 계수 비교로 n=3b(b+3)을 구해 다항식 개수를 셈"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 6

### 발문

한 변의 길이가 \$16,\\mathrm{cm}\$인 정사각형 모양의 철판의 양쪽을 구부려서 오른쪽 그림과 같이 단면이 직사각형 모양인 물받이를 만들려고 한다. 색칠한 단면의 넓이가 최대가 되도록 하려면 물받이의 높이를 몇 \$\\mathrm{cm}\$로 해야 하는지 구하고, 그때의 색칠한 단면의 넓이를 구하시오. (단, 철판의 두께는 생각하지 않는다.)

### 선지

없음

### 정답

높이 \$4,\\mathrm{cm}\$, 넓이 \$32,\\mathrm{cm}^2\$

### 해설

물받이의 높이를 \$x,\\mathrm{cm}\$라 하면 양쪽에서 각각 \$x,\\mathrm{cm}\$씩 구부리므로 밑면의 폭은 \$(16-2x),\\mathrm{cm}\$이고, \$0\<x\<8\$이다. 색칠한 직사각형 단면의 넓이를 \$S\$라 하면 \$\$ S \= x(16-2x) \= \-2x^2+16x \= \-2(x-4)^2+32 \$\$ 이다. \$0\<x\<8\$에서 \$x=4\$일 때 \$S\$는 최댓값 \$32\$를 가진다. 따라서 물받이의 높이는 \$4,\\mathrm{cm}\$, 색칠한 단면의 최대 넓이는 \$32,\\mathrm{cm}^2\$이다.

```
{"status": "READY", "pattern": "construction-spike-v1", "viewBox": "0 0 360 220", "elements": [{"type": "polyline", "id": "gutter_cross_section", "points": [[80, 50], [80, 170], [280, 170], [280, 50]]}, {"type": "polygon", "id": "shaded_area", "points": [[80, 50], [280, 50], [280, 170], [80, 170]], "fill": "shaded"}, {"type": "label", "pos": [60, 110], "text": "$x$"}, {"type": "label", "pos": [180, 190], "text": "$16-2x$"}], "note": "폭 16 cm 철판의 양쪽을 높이 x cm씩 수직으로 구부려 만든 단면 직사각형(높이 x, 밑변 16-2x) 물받이 도식"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "물받이 높이를 $x\\,\\mathrm{cm}$ ($0<x<8$)로 두어 단면 넓이 $S=x(16-2x)=-2(x-4)^2+32$의 최댓값을 구한다.", "decisiveStep": "양쪽을 $x$씩 접으므로 밑면 폭이 $16-2x$임을 세우고 정의역 $0<x<8$을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json(H1-RPM-038)의 실생활 도형 조건식 활용 이차함수 최대·최소 유형과 일치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실생활 도형 문제에서 변수를 설정하고 이차함수 완전제곱식으로 최댓값을 구하는 서술형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "solution", "quote": "최댓값 $32$를 가진다"}], "method": [{"term": "이차함수", "src": "solution", "quote": "-2(x-4)^2+32", "evidenceType": "IMPLIED", "justification": "단면 넓이를 x에 대한 이차함수로 세우고 완전제곱식으로 최댓값을 구함"}], "given": [{"term": "직사각형", "src": "stem", "quote": "단면이 직사각형 모양인"}], "condition": [{"term": "범위", "src": "solution", "quote": "0<x<8"}]}, "reasons": {"method": "단면 넓이 S=x(16-2x)를 완전제곱식으로 변형해 높이와 최대 넓이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

