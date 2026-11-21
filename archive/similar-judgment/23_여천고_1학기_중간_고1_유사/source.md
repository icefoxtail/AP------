

```
{"stem": "23_여천고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 23, "totalScore": 100.0, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 4.1

### 발문

두 다항식 \$A, B\$에 대하여 \$A+B=4x^2-3xy+2y^2\$, \$A-B=-2x^2+5xy-6y^2\$ 일 때, \$B-2A=ax^2+bxy+cy^2\$이다. \$a+b+c\$의 값은? (단, \$a, b, c\$는 실수이다.)

### 선지

① \$-3\$ ② \$3\$ ③ \$5\$ ④ \$-1\$ ⑤ \$15\$

### 정답

②

### 해설

\$A+B\$와 \$A-B\$를 더하고 빼서 \$A, B\$를 먼저 구하자. 두 식을 더하면 \$2A=(4x^2-3xy+2y^2)+(-2x^2+5xy-6y^2)=2x^2+2xy-4y^2 \\implies A=x^2+xy-2y^2\$ 두 식을 빼면 \$2B=(4x^2-3xy+2y^2)-(-2x^2+5xy-6y^2)=6x^2-8xy+8y^2 \\implies B=3x^2-4xy+4y^2\$ 따라서 \$\\begin{aligned} B-2A &= (3x^2-4xy+4y^2)-2(x^2+xy-2y^2) \\ &= x^2-6xy+8y^2 \\end{aligned}\$ 계수를 비교하면 \$a=1\$, \$b=-6\$, \$c=8\$이므로 \$a+b+c=1+(-6)+8=3\$이다. 따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "A+B와 A-B를 연립해 A, B를 각각 구한 뒤 B-2A를 계산해 계수의 합 a+b+c=3을 구한다.", "decisiveStep": "두 식의 합과 차로 A, B를 분리한 뒤 B-2A의 동류항 계수를 정리하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): A+B와 A-B 연립 후 B-2A 동류항 정리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 연립 합·차에서 A, B를 구하고 다시 일차결합 B-2A를 계산하는 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A, B$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b+c$의 값은?"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면 $a=1$, $b=-6$, $c=8$이므로", "evidenceType": "NAMED"}], "condition": [{"term": "실수", "src": "stem", "quote": "$a, b, c$는 실수이다."}]}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 4.2

### 발문

복소수 \$z=(1+i)a^2-(7+6i)a+10+5i\$에 대하여 \$z^2\$이 음의 실수가 되도록 하는 실수 \$a\$의 값의 합은? (단, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$0\$ ② \$1\$ ③ \$5\$ ④ \$7\$ ⑤ \$2\$

### 정답

⑤

### 해설

\$z\$를 실수부분과 허수부분으로 나누어 정리하면 \$\\begin{aligned} z &= (a^2-7a+10)+(a^2-6a+5)i \\ &= (a-2)(a-5)+(a-1)(a-5)i \\end{aligned}\$ \$z^2\$이 음의 실수가 되려면 \$z\$가 \$0\$이 아닌 순허수여야 하므로 실수부분은 \$0\$, 허수부분은 \$0\$이 아니어야 한다. 실수부분이 \$0\$이 되는 \$a\$는 \$a=2\$ 또는 \$a=5\$이다.

- \$a=2\$일 때, 허수부분은 \$(2-1)(2-5)=-3 \\neq 0\$이므로 \$z=-3i\$, \$z^2=-9 \< 0\$ (성립)  
- \$a=5\$일 때, 허수부분은 \$0\$이므로 \$z=0\$, \$z^2=0\$ (성립하지 않음) 따라서 조건을 만족하는 실수 \$a\$는 \$2\$뿐이므로 합은 \$2\$이다. 그러므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "z를 실수부분과 허수부분으로 분리해 z^2<0 조건(실수부분=0, 허수부분!=0)에서 a=5를 제외하고 a=2만 선택한다.", "decisiveStep": "z=0이 되는 a=5를 순허수 조건에서 제외하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-021(DIRECT_ACTIVE): 순허수 조건 실수부=0, 허수부!=0 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "z^2<0 조건을 순허수(실수부 0, 허수부 0 아님)로 정확히 해석해 z=0 반례를 걸러내야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=(1+i)a^2-(7+6i)a+10+5i$"}], "goal": [{"term": "합", "src": "stem", "quote": "실수 $a$의 값의 합은?"}], "method": [{"term": "순허수", "src": "solution", "quote": "$0$이 아닌 순허수여야 하므로", "evidenceType": "NAMED"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a$"}]}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4.2

### 발문

다항식 \$P(x)\$를 \$2x-1\$로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$r\$이라 할 때, \$xP(x)\$를 \$x-\\frac{1}{2}\$로 나누었을 때의 몫과 나머지는? (단, \$r\$는 상수이다.)

### 선지

① 몫: \$2xQ(x)+r\$, 나머지: \$\\frac{1}{2}r\$ ② 몫: \$2xQ(x)+r\$, 나머지: \$-\\frac{1}{2}r\$ ③ 몫: \$2xQ(x)-r\$, 나머지: \$\\frac{1}{2}r\$ ④ 몫: \$xQ(x)\$, 나머지: \$r\$ ⑤ 몫: \$xQ(x)+r\$, 나머지: \$\\frac{1}{2}r\$

### 정답

①

### 해설

나눗셈 항등식을 세우면 \$P(x)=(2x-1)Q(x)+r=2\\left(x-\\frac{1}{2}\\right)Q(x)+r\$ 양변에 \$x\$를 곱하면 \$xP(x)=2x\\left(x-\\frac{1}{2}\\right)Q(x)+xr\$ 여기서 \$xr=r\\left(x-\\frac{1}{2}\\right)+\\frac{1}{2}r\$이므로 \$xP(x)=\\left(x-\\frac{1}{2}\\right){2xQ(x)+r}+\\frac{1}{2}r\$ 따라서 \$x-\\frac{1}{2}\$로 나누었을 때의 몫은 \$2xQ(x)+r\$, 나머지는 \$\\frac{1}{2}r\$이다. 그러므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "P(x)=2(x-1/2)Q(x)+r 양변에 x를 곱한 뒤 xr=r(x-1/2)+r/2로 변형해 몫과 나머지를 구한다.", "decisiveStep": "일차식 xr을 제수 (x-1/2)로 한 번 더 나누어 상수 나머지 r/2를 분리하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 나눗셈 항등식 변형으로 몫과 나머지 분리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제수의 상수배 조정과 차수 초과 나머지 xr의 재분리를 동시에 처리해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "goal": [{"term": "다항식의나눗셈", "src": "stem", "quote": "몫과 나머지는?"}, {"term": "나머지", "src": "stem", "quote": "나머지는?"}], "method": [{"term": "항등식", "src": "solution", "quote": "나눗셈 항등식을 세우면", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "$r$는 상수이다."}]}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.2

### 발문

\$x-y=2\$, \$x^3-y^3=-16\$일 때, \$xy\$의 값은?

### 선지

① \$-8\$ ② \$-6\$ ③ \$-4\$ ④ \$-2\$ ⑤ \$4\$

### 정답

③

### 해설

곱셈공식의 변형 \$x^3-y^3=(x-y)^3+3xy(x-y)\$에 주어진 값을 대입하면 \$-16=2^3+3xy\\cdot 2\$ \$-16=8+6xy \\implies 6xy=-24 \\implies xy=-4\$ 따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "곱셈공식 변형 x^3-y^3=(x-y)^3+3xy(x-y)에 x-y=2, x^3-y^3=-16을 대입해 xy=-4를 구한다.", "decisiveStep": "세제곱 차 변형 공식에 주어진 두 값을 바로 대입해 xy에 관한 일차방정식을 푸는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 세제곱 차 곱셈공식 변형으로 xy 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세제곱 차의 곱셈공식 변형을 역으로 이용해 xy를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "값", "src": "stem", "quote": "$x-y=2$, $x^3-y^3=-16$일 때"}], "goal": [{"term": "곱", "src": "stem", "quote": "$xy$의 값은?"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈공식의 변형", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.7

### 발문

다항식 \$f(x)=3x^3-5x^2-4x+a\$를 인수분해하면 \$(x-1)g(x)\$의 꼴이 된다. 이때 다항식 \$g(x)\$의 모든 계수와 상수항의 합은? (단, \$a\$는 상수이다.) \[3.7점\]

### 선지

① \$-8\$ ② \$-7\$ ③ \$-6\$ ④ \$-5\$ ⑤ \$-4\$

### 정답

④

### 해설

\$f(x)\$가 \$x-1\$을 인수로 가지므로 인수정리에 의하여 \$f(1)=0\$이다. \$f(1)=3-5-4+a=0 \\implies a=6\$ 따라서 \$f(x)=3x^3-5x^2-4x+6\$이고, \$x-1\$로 조립제법을 이용해 나누면 \$f(x)=(x-1)(3x^2-2x-6)\$ 즉 \$g(x)=3x^2-2x-6\$이므로 모든 계수와 상수항의 합은 \$g(1)=3-2-6=-5\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "인수정리 f(1)=0으로 a=6을 구하고 조립제법으로 몫 g(x)=3x^2-2x-6을 구해 g(1)=-5를 계산한다.", "decisiveStep": "f(1)=0으로 상수항을 확정한 뒤 나눗셈으로 몫 g(x)를 구해 x=1을 대입하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012(RPM_ONLY): 인수정리 f(1)=0과 조립제법으로 몫 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리와 조립제법(다항식의 나눗셈)을 순차 적용하는 기본 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)=3x^3-5x^2-4x+a$"}], "goal": [{"term": "합", "src": "stem", "quote": "모든 계수와 상수항의 합은?"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여 $f(1)=0$이다.", "evidenceType": "NAMED"}, {"term": "조립제법", "src": "solution", "quote": "조립제법을 이용해 나누면", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "$a$는 상수이다."}]}}, "hold": "RPM_ONLY"}
```

## Q06

- 형식: 객관식  
- 배점: 4.2

### 발문

\$\\frac{1}{i}+\\frac{2}{i^2}+\\frac{3}{i^3}+\\frac{4}{i^4}+\\frac{5}{i^5}+\\frac{6}{i^6}=a+bi\$일 때, 실수 \$a, b\$에 대하여 \$ab\$의 값은? (단, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$-12\$ ② \$12\$ ③ \$-7\$ ④ \$7\$ ⑤ \$-6\$

### 정답

②

### 해설

허수단위 \$i\$의 거듭제곱의 주기성에 의하여 \$\\frac{1}{i}=-i\$, \$\\frac{2}{i^2}=-2\$, \$\\frac{3}{i^3}=3i\$, \$\\frac{4}{i^4}=4\$, \$\\frac{5}{i^5}=-5i\$, \$\\frac{6}{i^6}=-6\$ 모두 더하면 \$(-2+4-6)+(-1+3-5)i=-4-3i\$ 따라서 \$a=-4\$, \$b=-3\$이므로 \$ab=(-4)(-3)=12\$이다. 그러므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "i의 역수 거듭제곱 주기를 이용해 6개 항을 각각 정리하고 실수부 a=-4, 허수부 b=-3을 곱한다.", "decisiveStep": "1/i=-i, 1/i^3=i의 부호를 정확히 계산해 실수부와 허수부를 합산하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): i 역수 거듭제곱 주기성으로 실수부·허수부 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "i의 거듭제곱 역수 계산을 실수 없이 합산해야 하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "복소수", "src": "stem", "quote": "$\\frac{1}{i}+\\frac{2}{i^2}+\\frac{3}{i^3}+\\frac{4}{i^4}+\\frac{5}{i^5}+\\frac{6}{i^6}=a+bi$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$ab$의 값은?"}], "method": [{"term": "거듭제곱", "src": "solution", "quote": "거듭제곱의 주기성에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}]}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.2

### 발문

복소수 \$z=\\sqrt{-4}\\sqrt{-9}+\\frac{\\sqrt{50}}{\\sqrt{-2}}\$일 때, \$z\\overline{z}\$의 값은? (단, \$\\overline{z}\$는 \$z\$의 켤레복소수이고, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$11\$ ② \$25\$ ③ \$36\$ ④ \$50\$ ⑤ \$61\$

### 정답

⑤

### 해설

음수의 제곱근을 \$i\$를 사용하여 나타내면 \$\\sqrt{-4}\\sqrt{-9}=(2i)(3i)=6i^2=-6\$ \$\\frac{\\sqrt{50}}{\\sqrt{-2}}=\\frac{5\\sqrt{2}}{i\\sqrt{2}}=\\frac{5}{i}=\\frac{5i}{i^2}=-5i\$ 따라서 \$z=-6-5i\$이고 \$\\overline{z}=-6+5i\$이므로 \$z\\overline{z}=(-6-5i)(-6+5i)=(-6)^2+5^2=36+25=61\$ 그러므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "음수의 제곱근을 i로 바꾸어 z=-6-5i를 구한 뒤 켤레복소수 곱 z*conj(z)=(-6)^2+5^2=61을 계산한다.", "decisiveStep": "분모에 음수 제곱근이 있는 나눗셈 5/i=-5i의 부호를 정확히 처리하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 음수의 제곱근 i 변환 후 z*conj(z) 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 제곱근 계산과 켤레복소수의 곱을 순차 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\sqrt{-4}\\sqrt{-9}+\\frac{\\sqrt{50}}{\\sqrt{-2}}$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$z\\overline{z}$의 값은?"}], "method": [{"term": "허수단위", "src": "stem", "quote": "$i=\\sqrt{-1}$", "evidenceType": "NAMED"}, {"term": "켤레복소수", "src": "stem", "quote": "$\\overline{z}$는 $z$의 켤레복소수이고", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.2

### 발문

\$2a^3+3a^2b-b^3=289\$를 만족시키는 두 자연수 \$a, b\$에 대하여 \$ab\$의 값은?

### 선지

① \$66\$ ② \$44\$ ③ \$55\$ ④ \$77\$ ⑤ \$88\$

### 정답

①

### 해설

좌변을 인수분해하기 위해 \$a\$에 대하여 내림차순으로 정리하거나 \$a=-b\$를 대입해 보면 \$2(-b)^3+3(-b)^2b-b^3=0\$이므로 \$a+b\$를 인수로 갖는다. 조립제법으로 인수분해하면 \$2a^3+3a^2b-b^3=(a+b)(2a^2+ab-b^2)=(a+b)^2(2a-b)\$ 따라서 \$(a+b)^2(2a-b)=289=17^2\$이다. \$a, b\$는 자연수이므로 \$a+b \\ge 2\$이고 \$289\$의 양의 약수 중 제곱수는 \$1\$과 \$17^2\$뿐이다. 그러므로 \$a+b=17\$, \$2a-b=1\$이어야 한다. 두 식을 더하면 \$3a=18 \\implies a=6\$이고, \$b=11\$이다. 따라서 \$ab=6\\cdot 11=66\$이다. 그러므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "좌변을 (a+b)^2(2a-b)=17^2으로 인수분해하고 자연수 조건 a+b>=2로 a+b=17, 2a-b=1을 연립해 a=6, b=11을 구한다.", "decisiveStep": "삼차 동차식 2a^3+3a^2b-b^3을 (a+b)^2(2a-b)로 인수분해해 소인수분해 17^2에 대응하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 조건식 인수분해와 자연수 조건 연립"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 변수 삼차식의 인수분해와 소인수분해를 이용한 자연수 부정방정식을 결합해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "등식", "src": "stem", "quote": "$2a^3+3a^2b-b^3=289$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$ab$의 값은?"}], "method": [{"term": "인수분해", "src": "solution", "quote": "조립제법으로 인수분해하면", "evidenceType": "NAMED"}, {"term": "부정방정식", "src": "solution", "quote": "$a+b=17$, $2a-b=1$이어야 한다.", "evidenceType": "IMPLIED", "justification": "자연수 조건과 약수 분해로 정수해 연립방정식을 세움"}], "condition": [{"term": "자연수", "src": "stem", "quote": "두 자연수 $a, b$에 대하여"}]}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.2

### 발문

\$5^6-1\$을 자연수 \$n\$으로 나누었을 때, 다음 중 나누어떨어지지 않는 자연수 \$n\$은?

### 선지

① \$6\$ ② \$8\$ ③ \$10\$ ④ \$31\$ ⑤ \$63\$

### 정답

③

### 해설

곱셈공식을 이용하여 \$5^6-1\$을 인수분해하면 \$\\begin{aligned} 5^6-1 &= (5^3-1)(5^3+1) \\ &= 124 \\cdot 126 \\ &= (2^2 \\cdot 31)(2 \\cdot 3^2 \\cdot 7\) \\ &= 2^3 \\cdot 3^2 \\cdot 7 \\cdot 31 \\end{aligned}\$ 따라서 \$6=2\\cdot 3\$, \$8=2^3\$, \$31\$, \$63=3^2\\cdot 7\$은 모두 \$5^6-1\$의 약수이므로 나누어떨어진다. 반면 \$10=2\\cdot 5\$는 소인수 \$5\$를 포함하고 있으나 \$5^6-1\$은 \$5\$로 나누어떨어지지 않으므로 \$10\$으로 나누어떨어지지 않는다. 그러므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "5^6-1=(5^3-1)(5^3+1)=124*126을 소인수분해하여 약수 여부를 판별한다.", "decisiveStep": "합차 공식으로 124*126을 얻고 소인수 5가 없음을 확인해 10을 제외하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "수의 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-018(DIRECT_ACTIVE): 5^6-1 합차·세제곱 인수분해로 약수 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "거듭제곱 수의 합차 인수분해 후 소인수분해를 통해 약수를 판별하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "자연수", "src": "stem", "quote": "자연수 $n$으로"}], "goal": [{"term": "약수", "src": "solution", "quote": "약수이므로 나누어떨어진다.", "evidenceType": "NAMED"}], "method": [{"term": "인수분해", "src": "solution", "quote": "$5^6-1$을 인수분해하면", "evidenceType": "NAMED"}, {"term": "소인수분해", "src": "solution", "quote": "2^3 \\cdot 3^2 \\cdot 7 \\cdot 31", "evidenceType": "IMPLIED", "justification": "124*126을 소인수의 곱으로 분해해 약수를 판별함"}], "condition": []}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.2

### 발문

다음 \<보기\>에서 서로 다른 두 실근을 갖는 이차방정식을 모두 고른 것은? \<보기\> ㄱ. \$3x^2-x-2=0\$ ㄴ. \$4x^2+12x+9=0\$ ㄷ. \$x^2-2x+5=0\$ ㄹ. \$2x^2-6x+1=0\$

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄴ, ㄷ ④ ㄱ, ㄹ ⑤ ㄷ, ㄹ

### 정답

④

### 해설

이차방정식이 서로 다른 두 실근을 가지려면 판별식 \$D \> 0\$이어야 한다. ㄱ. \$D=(-1)^2-4\\cdot 3\\cdot(-2)=1+24=25 \> 0\$ (서로 다른 두 실근) ㄴ. \$\\frac{D}{4}=6^2-4\\cdot 9=36-36=0\$ (중근) ㄷ. \$\\frac{D}{4}=(-1)^2-1\\cdot 5=-4 \< 0\$ (서로 다른 두 허근) ㄹ. \$\\frac{D}{4}=(-3)^2-2\\cdot 1=7 \> 0\$ (서로 다른 두 실근) 따라서 서로 다른 두 실근을 갖는 것은 ㄱ, ㄹ이므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "10", "variationType": "CONCEPT", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "네 이차방정식의 판별식 D 부호를 각각 계산해 D>0인 ㄱ, ㄹ을 고른다.", "decisiveStep": "네 방정식의 판별식 부호를 비교해 D=0(ㄴ)과 D<0(ㄷ)을 제외하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 네 이차방정식의 판별식 D>0 부호 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 판별식 부호와 근의 종류 관계를 직접 적용하는 기본 문항이다.", "level": "중", "item4slot": {"format": "합답형", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식을"}], "goal": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근을 갖는"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D > 0$이어야 한다.", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.2

### 발문

이차방정식 \$x^2+4x-1=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\frac{\\beta+1}{\\alpha}+\\frac{\\alpha+1}{\\beta}\$의 값은?

### 선지

① \$-16\$ ② \$-14\$ ③ \$-12\$ ④ \$14\$ ⑤ \$16\$

### 정답

②

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=-4\$, \$\\alpha\\beta=-1\$이다. 주어진 식을 통분하여 정리하면 \$\\begin{aligned} \\frac{\\beta+1}{\\alpha}+\\frac{\\alpha+1}{\\beta} &= \\frac{\\beta(\\beta+1)+\\alpha(\\alpha+1)}{\\alpha\\beta} \\ &= \\frac{\\alpha^2+\\beta^2+\\alpha+\\beta}{\\alpha\\beta} \\ &= \\frac{(\\alpha+\\beta)^2-2\\alpha\\beta+(\\alpha+\\beta)}{\\alpha\\beta} \\ &= \\frac{(-4)^2-2(-1)+(-4)}{-1} \\ &= \\frac{16+2-4}{-1}=-14 \\end{aligned}\$ 따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "통분 후 분자를 (alpha+beta)^2-2*alpha*beta+(alpha+beta)로 변형해 근과 계수의 관계 값을 대입한다.", "decisiveStep": "분모 통분 뒤 대칭식 alpha^2+beta^2을 합과 곱으로 변형하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 통분 후 제곱합 변형에 근과 계수의 관계 대입"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수식 통분과 대칭식 곱셈공식 변형을 결합해 값을 계산하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+4x-1=0$"}], "goal": [{"term": "식의값", "src": "stem", "quote": "$\\frac{\\beta+1}{\\alpha}+\\frac{\\alpha+1}{\\beta}$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}, {"term": "대칭식", "src": "solution", "quote": "\\frac{\\alpha^2+\\beta^2+\\alpha+\\beta}{\\alpha\\beta}", "evidenceType": "IMPLIED", "justification": "통분한 분자를 alpha, beta의 기본 대칭식으로 정리함"}], "condition": []}}, "hold": "BINDING_GAP"}
```

## Q12

- 형식: 객관식  
- 배점: 4.2

### 발문

실수 \$a, b\$에 대하여 \$x\$에 대한 이차방정식 \$x^2+ax+b=0\$의 한 근이 \$3-i\$이다. \$x\$에 대한 이차방정식 \$mx^2+nx-1=0\$의 두 근이 \$\\frac{1}{a}, \\frac{1}{b}\$일 때, 실수 \$m, n\$에 대하여 \$mn\$의 값은? (단, \$i=\\sqrt{-1}\$이다.)

### 선지

① \$240\$ ② \$-240\$ ③ \$120\$ ④ \$-120\$ ⑤ \$60\$

### 정답

①

### 해설

\$a, b\$가 실수이고 한 근이 \$3-i\$이므로 켤레복소수 \$3+i\$도 근이다. 근과 계수의 관계에 의하여 \$-a=(3-i)+(3+i)=6 \\implies a=-6\$ \$b=(3-i)(3+i)=9-i^2=10\$ 따라서 두 번째 이차방정식 \$mx^2+nx-1=0\$의 두 근은 \$-\\frac{1}{6}\$, \$\\frac{1}{10}\$이다. 근과 계수의 관계에 의하여 두 근의 곱: \$-\\frac{1}{m}=\\left(-\\frac{1}{6}\\right)\\cdot\\frac{1}{10}=-\\frac{1}{60} \\implies m=60\$ 두 근의 합: \$-\\frac{n}{m}=-\\frac{1}{6}+\\frac{1}{10}=-\\frac{1}{15} \\implies \-\\frac{n}{60}=-\\frac{1}{15} \\implies n=4\$ 그러므로 \$mn=60\\cdot 4=240\$이다. 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "실계수 이차방정식 켤레근으로 a=-6, b=10을 구하고 역수 -1/6, 1/10을 두 근으로 하는 방정식에서 m=60, n=4를 구한다.", "decisiveStep": "두 번째 방정식의 상수항 -1을 이용해 두 근의 곱에서 m=60을 먼저 확정하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json H1-RPM-031(DIRECT_BINDING_GAP): 실계수 이차방정식 켤레근 및 역수 근 방정식 작성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레복소수 근 성질과 두 번째 방정식의 근과 계수의 관계를 순차 연결해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+ax+b=0$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$mn$의 값은?"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수 $3+i$도 근이다.", "evidenceType": "NAMED"}, {"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}]}}, "hold": "BINDING_GAP"}
```

## Q13

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$y=x^2+ax+4\$의 그래프와 직선 \$y=3x+b\$가 서로 다른 두 점에서 만나고 두 교점의 \$x\$좌표가 \$-1\$과 \$2\$일 때, \$a+b\$의 값은? (단, \$a, b\$는 상수이다.)

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

⑤

### 해설

두 그래프의 교점의 \$x\$좌표는 이차방정식 \$x^2+ax+4=3x+b\$, 즉 \$x^2+(a-3)x+(4-b)=0\$ 의 두 실근 \$-1, 2\$이다. 근과 계수의 관계에 의하여 \$-1+2=-(a-3) \\implies 1=3-a \\implies a=2\$ \$(-1)\\cdot 2=4-b \\implies \-2=4-b \\implies b=6\$ 따라서 \$a+b=2+6=8\$이다. 그러므로 정답은 ⑤이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 포물선과 직선의 교점 그림을 제시한다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "4",
        "2",
        "1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -3,
        3
      ],
      "viewport": [
        -3,
        3,
        -1,
        14
      ],
      "referenceLines": [
        {
          "id": "l",
          "slope": "3",
          "intercept": "6"
        }
      ],
      "requiredPoints": [
        {
          "id": "P",
          "x": -1,
          "y": 3
        },
        {
          "id": "Q",
          "x": 2,
          "y": 12
        }
      ],
      "axisTickValues": {
        "x": [
          -1,
          2
        ],
        "y": []
      }
    },
    "caption": "포물선 y=x^2+2x+4와 직선 y=3x+6은 x=-1, x=2에서 만난다."
  }
}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 식을 연립한 x^2+(a-3)x+(4-b)=0의 두 근 -1, 2에 근과 계수의 관계를 적용해 a=2, b=6을 구한다.", "decisiveStep": "교점의 x좌표를 연립이차방정식의 두 근으로 전환해 합과 곱을 적용하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 포물선과 직선 교점 근과 계수의 관계 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 교점을 이차방정식의 근으로 해석해 미지수를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+ax+4$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=3x+b$"}], "goal": [{"term": "합", "src": "stem", "quote": "$a+b$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "$a, b$는 상수이다."}]}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$y=-\\frac{1}{2}x^2+x\$의 그래프와 접하고 기울기가 음수인 직선이 점 \$(0, 3)\$을 지날 때, 이 직선의 방정식은?

### 선지

① \$y=(1-\\sqrt{3})x+3\$ ② \$y=(1+\\sqrt{6})x+3\$ ③ \$y=(1-\\sqrt{6})x+3\$ ④ \$y=(2-\\sqrt{6})x+3\$ ⑤ \$y=(1-2\\sqrt{6})x+3\$

### 정답

③

### 해설

점 \$(0, 3)\$을 지나는 직선의 방정식을 \$y=mx+3\$이라 하자. 이 직선이 이차함수 \$y=-\\frac{1}{2}x^2+x\$의 그래프에 접하므로 방정식 \$-\\frac{1}{2}x^2+x=mx+3 \\implies x^2+2(m-1)x+6=0\$ 이 중근을 가져야 한다. 판별식 \$D=0\$에서 \$\\frac{D}{4}=(m-1)^2-6=0 \\implies (m-1)^2=6 \\implies m=1\\pm\\sqrt{6}\$ 직선의 기울기가 음수이므로 \$m=1-\\sqrt{6}\$이다. 따라서 구하는 직선의 방정식은 \$y=(1-\\sqrt{6})x+3\$이다. 그러므로 정답은 ③이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 포물선과 접선의 관계를 보여준다."
  },
  "solution": {
    "capability": "piecewise-polynomial-spike-v1",
    "graphPlan": {
      "family": "piecewise-polynomial",
      "pieces": [
        {
          "coefficients": [
            "0",
            "1",
            "-1/2"
          ]
        }
      ],
      "breakpoints": [],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "formula": "-1/2*x^2+x",
      "referenceLines": [
        {
          "id": "t",
          "slope": "1-sqrt(6)",
          "intercept": "3"
        }
      ],
      "requiredPoints": [
        {
          "id": "Y",
          "x": 0,
          "y": 3
        }
      ],
      "axisTickValues": {
        "x": [],
        "y": [
          3
        ]
      }
    },
    "caption": "점 (0, 3)을 지나고 기울기가 1-sqrt(6)인 직선이 포물선 y=-1/2x^2+x에 접한다."
  }
}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "점 (0,3)을 지나는 직선 y=mx+3과 포물선을 연립해 D/4=(m-1)^2-6=0을 풀고 음의 기울기 m=1-sqrt(6)을 택한다.", "decisiveStep": "두 접선 기울기 1+-sqrt(6) 중 음수 조건 m<0으로 1-sqrt(6)을 선택하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 정점 지나는 접선 조건 D/4=0에서 기울기 선택"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y절편이 주어진 접선 식을 세우고 판별식 이차방정식과 부호 조건을 차례로 적용해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-\\frac{1}{2}x^2+x$"}], "goal": [{"term": "직선", "src": "stem", "quote": "이 직선의 방정식은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$에서", "evidenceType": "NAMED"}], "condition": [{"term": "접함", "src": "stem", "quote": "접하고"}, {"term": "음수", "src": "stem", "quote": "기울기가 음수인"}]}}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.2

### 발문

\$x\$의 값의 범위가 \$-2 \\le x \\le 3\$일 때, 이차함수 \$y=x^2-2x+k\$의 최솟값은 \$4\$이다. 이 범위에서 이차함수의 최댓값을 구하면?

### 선지

① \$9\$ ② \$10\$ ③ \$12\$ ④ \$13\$ ⑤ \$15\$

### 정답

④

### 해설

\$y=x^2-2x+k=(x-1)^2+k-1\$이므로 아래로 볼록하고 꼭짓점의 \$x\$좌표는 \$1\$이다. 꼭짓점 \$x=1\$이 범위 \$-2 \\le x \\le 3\$에 포함되므로 최솟값은 \$k-1=4 \\implies k=5\$이다. 따라서 \$y=(x-1)^2+4\$이고, 양 끝점에서의 함숫값은

- \$x=-2\$일 때 \$y=(-2-1)^2+4=13\$  
- \$x=3\$일 때 \$y=(3-1)^2+4=8\$ 이므로 이 범위에서의 최댓값은 \$13\$이다. 그러므로 정답은 ④이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 제한 구간의 포물선을 제시한다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "5",
        "-2",
        "1"
      ],
      "sourceDomain": {
        "kind": "CLOSED_INTERVAL",
        "range": [
          -2,
          3
        ]
      },
      "domain": [
        -2,
        3
      ],
      "viewport": [
        -3,
        4,
        2,
        15
      ],
      "requiredPoints": [
        {
          "id": "V",
          "x": 1,
          "y": 4
        },
        {
          "id": "M",
          "x": -2,
          "y": 13
        }
      ],
      "axisTickValues": {
        "x": [
          -2,
          1,
          3
        ],
        "y": [
          4,
          13
        ]
      }
    },
    "caption": "구간 [-2, 3]에서 x=1일 때 최솟값 4, x=-2일 때 최댓값 13을 갖는다."
  }
}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "표준형 (x-1)^2+k-1에서 꼭짓점 x=1이 구간에 속함을 이용해 k=5를 구하고 양 끝점 중 x=-2에서 최댓값 13을 얻는다.", "decisiveStep": "최솟값 조건으로 k=5를 확정한 뒤 대칭축 x=1에서 더 먼 끝점 x=-2의 값을 구하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 제한 구간 이차함수 꼭짓점 포함 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한된 범위에서 이차함수의 최솟값으로 상수 k를 먼저 구하고 최댓값을 찾는 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-2x+k$"}], "goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값을 구하면?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x-1)^2+k-1", "evidenceType": "IMPLIED", "justification": "이차함수를 표준형으로 변형해 꼭짓점 위치를 파악함"}], "condition": [{"term": "범위", "src": "stem", "quote": "$x$의 값의 범위가 $-2 \\le x \\le 3$일 때"}]}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$y=x^2+2(2+a)x+a^2+4\$의 그래프가 \$x\$축과 만나지 않도록 하는 자연수 \$a\$의 개수는?

### 선지

① \$1\$ ② \$0\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

②

### 해설

이차함수의 그래프가 \$x\$축과 만나지 않으려면 이차방정식 \$x^2+2(2+a)x+a^2+4=0\$의 판별식 \$D \< 0\$이어야 한다. \$\\frac{D}{4}=(2+a)^2-(a^2+4)=4+4a+a^2-a^2-4=4a \< 0 \\implies a \< 0\$ 그런데 \$a\$는 자연수이므로 \$a \< 0\$을 만족하는 값은 존재하지 않는다. 따라서 구하는 자연수 \$a\$의 개수는 \$0\$이다. 그러므로 정답은 ②이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 x축과 만나지 않는 예시 포물선을 제시한다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "5",
        "2",
        "1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -4,
        2
      ],
      "viewport": [
        -4,
        2,
        -1,
        10
      ],
      "requiredPoints": [
        {
          "id": "V",
          "x": -1,
          "y": 4
        }
      ],
      "axisTickValues": {
        "x": [
          -1
        ],
        "y": [
          4
        ]
      }
    },
    "caption": "예: a=-1일 때 y=x^2+2x+5의 그래프는 x축 위쪽에 있어 x축과 만나지 않는다."
  }
}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "x축과 만나지 않을 조건 D/4=4a<0에서 a<0을 얻고 자연수 조건과 모순되므로 개수가 0임을 구한다.", "decisiveStep": "판별식에서 a^2이 소거되어 얻은 a<0 조건을 자연수 조건과 대조해 0개임을 판정하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): x축과 만나지 않을 조건 D/4<0과 자연수 모순 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식 계산 후 얻은 범위와 문제의 자연수 조건을 결합하면 해가 없음을 바로 확인할 수 있다.", "level": "중", "item4slot": {"format": "개수", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+2(2+a)x+a^2+4$"}], "goal": [{"term": "개수", "src": "stem", "quote": "자연수 $a$의 개수는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D < 0$이어야 한다.", "evidenceType": "NAMED"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $a$"}]}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.2

### 발문

최고차항의 계수가 \$1\$인 이차함수 \$y=f(x)\$의 그래프가 \$x\$축과 서로 다른 두 점 \$(\\alpha, 0), (\\beta, 0)\$에서 만나고 \$\\alpha+\\beta=4\$이다. 함수 \$y=f(x)\$의 그래프의 꼭짓점이 직선 \$y=2x-7\$ 위에 있을 때, \$f(3)\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$

### 정답

①

### 해설

이차함수의 그래프가 \$x\$축과 두 점 \$(\\alpha, 0), (\\beta, 0)\$에서 만나므로 대칭축은 \$x=\\frac{\\alpha+\\beta}{2}=\\frac{4}{2}=2\$이다. 따라서 꼭짓점의 \$x\$좌표는 \$2\$이고, 꼭짓점이 직선 \$y=2x-7\$ 위에 있으므로 꼭짓점의 \$y\$좌표는 \$2\\cdot 2-7=-3\$이다. 최고차항의 계수가 \$1\$이고 꼭짓점이 \$(2, \-3)\$이므로 \$f(x)=(x-2)^2-3\$ 따라서 \$f(3)=(3-2)^2-3=1-3=-2\$이다. 그러므로 정답은 ①이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 포물선과 직선 위의 꼭짓점을 보여준다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "1",
        "-4",
        "1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -1,
        5
      ],
      "viewport": [
        -1,
        5,
        -4,
        6
      ],
      "referenceLines": [
        {
          "id": "l",
          "slope": "2",
          "intercept": "-7"
        }
      ],
      "requiredPoints": [
        {
          "id": "V",
          "x": 2,
          "y": -3
        },
        {
          "id": "P",
          "x": 3,
          "y": -2
        }
      ],
      "axisTickValues": {
        "x": [
          2,
          3
        ],
        "y": [
          -3
        ]
      }
    },
    "caption": "대칭축 x=2 위의 꼭짓점 (2, -3)이 직선 y=2x-7 위에 있다."
  }
}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "alpha+beta=4에서 대칭축 x=2를 구하고 직선 y=2x-7 위의 꼭짓점 (2,-3)을 확정해 f(3)=-2를 계산한다.", "decisiveStep": "두 x절편의 중점 (alpha+beta)/2=2가 꼭짓점의 x좌표임을 이용해 꼭짓점을 바로 결정하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 두 근 합으로 대칭축 구해 직선 위 꼭짓점 확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근의 합으로 대칭축을 구하고 직선 위 꼭짓점 조건과 결합해 이차함수를 결정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=f(x)$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$f(3)$의 값은?"}], "method": [{"term": "축", "src": "solution", "quote": "대칭축은 $x=\\frac{\\alpha+\\beta}{2}=\\frac{4}{2}=2$이다.", "evidenceType": "IMPLIED", "justification": "두 x절편의 평균으로 포물선의 축을 구함"}, {"term": "꼭짓점", "src": "stem", "quote": "꼭짓점이 직선 $y=2x-7$ 위에 있을 때", "evidenceType": "NAMED"}], "condition": [{"term": "최고차항", "src": "stem", "quote": "최고차항의 계수가 $1$인"}]}}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.2

### 발문

두 이차함수 \$f(x)=x^2-ax+b\$, \$g(x)=-x^2+cx-d\$에 대하여 함수 \$y=f(x)\$의 그래프는 \$x\$축에 접하고, 두 함수 \$y=f(x)\$와 \$y=g(x)\$의 그래프는 제\$1\$사분면과 제\$2\$사분면에서 만난다. \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$a^2-4b=0\$ ㄴ. \$a^2-4d \\le 0\$ ㄷ. \$(a+c)^2-8(b+d) \> 0\$

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

③

### 해설

ㄱ. \$y=f(x)=x^2-ax+b\$의 그래프가 \$x\$축에 접하므로 이차방정식 \$x^2-ax+b=0\$의 판별식 \$D=a^2-4b=0\$이다. (참) ㄴ. 두 그래프의 교점의 \$x\$좌표는 \$x^2-ax+b=-x^2+cx-d\$, 즉 \$2x^2-(a+c)x+(b+d)=0\$ 의 두 실근이다. 두 교점이 제\$1\$사분면과 제\$2\$사분면에 각각 있으므로 두 근의 부호가 서로 다르다. 따라서 두 근의 곱 \$\\frac{b+d}{2} \< 0\$, 즉 \$b+d \< 0\$이다. ㄱ에서 \$b=\\frac{a^2}{4}\$이므로 \$\\frac{a^2}{4}+d \< 0 \\implies d \< \-\\frac{a^2}{4} \\implies a^2-4d \> 2a^2 \\ge 0\$이다. (거짓) ㄷ. 두 그래프가 서로 다른 두 점에서 만나므로 \$2x^2-(a+c)x+(b+d)=0\$의 판별식 \$D=(a+c)^2-8(b+d) \> 0\$이다. (참) 따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ③이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 두 포물선의 위치 관계 예시를 보여준다."
  },
  "solution": {
    "capability": "piecewise-polynomial-spike-v1",
    "graphPlan": {
      "family": "piecewise-polynomial",
      "pieces": [
        {
          "coefficients": [
            "4",
            "-4",
            "1"
          ]
        }
      ],
      "breakpoints": [],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "formula": "x^2-4x+4",
      "referenceCurves": [
        {
          "id": "g",
          "family": "polynomial",
          "coefficients": [
            "10",
            "0",
            "-1"
          ],
          "sourceDomain": {
            "kind": "ALL_REALS"
          }
        }
      ],
      "requiredPoints": [
        {
          "id": "P",
          "x": 2,
          "y": 0
        }
      ],
      "axisTickValues": {
        "x": [
          2
        ],
        "y": []
      }
    },
    "caption": "예: f(x)=(x-2)^2, g(x)=-x^2+10일 때 x축에 접하고 제1, 2사분면에서 만난다."
  }
}
```

```
{"sourceQid": "18", "variationType": "CONCEPT", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "x축 접선 조건(a^2-4b=0)과 제1·2사분면 교점의 부호 조건(b+d<0) 및 판별식(D>0)으로 ㄱ, ㄴ, ㄷ을 판별한다.", "decisiveStep": "제1·2사분면 교점에서 두 근의 곱 (b+d)/2<0을 이끌어 내고 b=a^2/4를 대입해 a^2-4d>0임을 보이는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034(DIRECT_ACTIVE): x축 접선·교점 부호·판별식 명제 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차함수의 접선 조건과 사분면 교점의 근의 부호 판별을 종합적으로 추론해야 한다.", "level": "상", "item4slot": {"format": "합답형", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "두 이차함수 $f(x)=x^2-ax+b$, $g(x)=-x^2+cx-d$"}], "goal": [{"term": "진리값", "src": "stem", "quote": "옳은 것만을 있는 대로 고른 것은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=a^2-4b=0$이다.", "evidenceType": "NAMED"}, {"term": "근과계수의관계", "src": "solution", "quote": "두 근의 곱 $\\frac{b+d}{2} < 0$", "evidenceType": "IMPLIED", "justification": "교점 x좌표의 부호가 다름을 두 근의 곱<0으로 해석함"}], "condition": [{"term": "접함", "src": "stem", "quote": "$x$축에 접하고"}, {"term": "사분면", "src": "stem", "quote": "제$1$사분면과 제$2$사분면에서 만난다."}]}}, "hold": ""}
```

## Q19

- 형식: 단답형  
- 배점: 5

### 발문

다항식 \$P(x)\$를 \$(x-1)^2\$으로 나누었을 때의 나머지는 \$2x-3\$이고, \$x-2\$로 나누었을 때의 나머지는 \$4\$이다. 이때 \$P(x)\$를 \$(x-1)^2(x-2)\$로 나누었을 때의 나머지를 구하시오.

### 선지

없음

### 정답

\$3x^2-4x\$

### 해설

\$P(x)\$를 \$(x-1)^2(x-2)\$로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$R(x)\$ (\$R(x)\$는 이차 이하의 다항식)라 하자. \$P(x)\$를 \$(x-1)^2\$으로 나누었을 때의 나머지가 \$2x-3\$이므로 상수 \$k\$에 대하여 \$R(x)=k(x-1)^2+2x-3\$ 으로 놓을 수 있다. \$P(x)\$를 \$x-2\$로 나누었을 때의 나머지가 \$4\$이므로 나머지정리에 의하여 \$R(2)=4\$이다. \$R(2)=k(2-1)^2+2\\cdot 2-3=k+1=4 \\implies k=3\$ 따라서 구하는 나머지는 \$R(x)=3(x-1)^2+2x-3=3x^2-6x+3+2x-3=3x^2-4x\$

```
"NONE"
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지 R(x)를 k(x-1)^2+2x-3으로 설정한 뒤 R(2)=4를 대입해 k=3을 구하여 3x^2-4x를 얻는다.", "decisiveStep": "삼차식 제수의 나머지 R(x)를 (x-1)^2으로 나눈 나머지 꼴 k(x-1)^2+2x-3으로 줄여 쓰는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 완전제곱 인수와 나머지정리로 이차 나머지 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차 완전제곱 인수와 일차 인수의 곱으로 나눈 나머지를 미지수 하나로 표현해 결정하는 대표 문항이다.", "level": "중", "item4slot": {"format": "단답형", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 구하시오."}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여 $R(2)=4$이다.", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q20

- 형식: 단답형  
- 배점: 5

### 발문

이차함수 \$f(x)=ax^2+bx+c\$가 다음 조건을 만족시킬 때, \$f(0)\$의 값을 구하시오. (단, \$a, b, c\$는 상수이다.) \<보기\> (가) \$f(-1)=f(7)\$ (나) 함수 \$y=f(x)\$의 그래프의 꼭짓점의 \$y\$좌표는 \$-4\$이다. (다) 함수 \$y=f(x)\$의 그래프가 \$x\$축과 두 점 \$P, Q\$에서 만나고 \$\\overline{PQ}=4\$이다.

### 선지

없음

### 정답

\$5\$

### 해설

조건 (가)에서 \$f(-1)=f(7)\$이므로 대칭축은 \$x=\\frac{-1+7}{2}=3\$이다. 조건 (나)에서 꼭짓점의 \$y\$좌표가 \$-4\$이므로 꼭짓점은 \$(3, \-4)\$이고 \$f(x)=a(x-3)^2-4\$ (\$a \\neq 0\$) 조건 (다)에서 대칭축 \$x=3\$을 기준으로 두 \$x\$절편 사이의 거리 \$\\overline{PQ}=4\$이므로 두 \$x\$절편은 \$x=3-2=1\$과 \$x=3+2=5\$이다. 따라서 \$f(5)=0\$이므로 \$a(5-3)^2-4=0 \\implies 4a=4 \\implies a=1\$ 그러므로 \$f(x)=(x-3)^2-4\$이고, \$f(0)=(0-3)^2-4=9-4=5\$이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 조건을 만족하는 포물선 그래프를 제시한다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "5",
        "-6",
        "1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -2,
        8
      ],
      "viewport": [
        -2,
        8,
        -5,
        10
      ],
      "requiredPoints": [
        {
          "id": "V",
          "x": 3,
          "y": -4
        },
        {
          "id": "P",
          "x": 1,
          "y": 0
        },
        {
          "id": "Q",
          "x": 5,
          "y": 0
        }
      ],
      "axisTickValues": {
        "x": [
          1,
          3,
          5
        ],
        "y": [
          -4,
          5
        ]
      }
    },
    "caption": "대칭축 x=3, 꼭짓점 (3, -4), x절편 1과 5를 지나는 포물선 f(x)=(x-3)^2-4"
  }
}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "f(-1)=f(7)에서 축 x=3, 꼭짓점 (3,-4)를 세우고 PQ=4로 x절편 1, 5를 구해 a=1과 f(0)=5를 계산한다.", "decisiveStep": "대칭축 x=3과 거리 PQ=4에서 x절편 x=1, 5를 구해 f(5)=0으로 최고차항 계수 a=1을 확정하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): 대칭축과 x절편 길이로 이차함수 식 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 대칭성, 꼭짓점, x절편 거리의 세 조건을 순차 결합해 함수를 복원해야 한다.", "level": "상", "item4slot": {"format": "단답형", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=ax^2+bx+c$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$f(0)$의 값을 구하시오."}], "method": [{"term": "축", "src": "solution", "quote": "대칭축은 $x=\\frac{-1+7}{2}=3$이다.", "evidenceType": "IMPLIED", "justification": "f(-1)=f(7)의 대칭성을 이용해 중점으로 대칭축을 구함"}, {"term": "꼭짓점", "src": "stem", "quote": "꼭짓점의 $y$좌표는 $-4$이다.", "evidenceType": "NAMED"}], "condition": [{"term": "거리", "src": "solution", "quote": "두 $x$절편 사이의 거리 $\\overline{PQ}=4$이므로", "evidenceType": "NAMED"}]}}, "hold": ""}
```

## Q21

- 형식: 서술형  
- 배점: 5

### 발문

\$x(x+1)(x+2)(x+3)+1\$을 인수분해하고, 이를 이용하여 \$12 \\times 13 \\times 14 \\times 15 \+ 1\$이 어떤 자연수의 제곱인지 서술하시오.

### 선지

없음

### 정답

\$(x^2+3x+1)^2\$, \$181^2\$

### 해설

공통부분이 나오도록 네 일차식을 두 개씩 짝지어 전개하면 \$\\begin{aligned} x(x+1)(x+2)(x+3)+1 &= {x(x+3)}{(x+1)(x+2)}+1 \\ &= (x^2+3x)(x^2+3x+2)+1 \\end{aligned}\$ \$t=x^2+3x\$로 치환하면 \$\\begin{aligned} t(t+2)+1 &= t^2+2t+1 \\ &= (t+1)^2 \\ &= (x^2+3x+1)^2 \\end{aligned}\$ 여기에 \$x=12\$를 대입하면 \$12 \\times 13 \\times 14 \\times 15 \+ 1=(12^2+3\\cdot 12+1)^2=(144+36+1)^2=181^2\$ 따라서 주어진 수는 \$181\$의 제곱이다.

```
"NONE"
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "x(x+3)과 (x+1)(x+2)를 짝지어 t=x^2+3x 치환으로 (x^2+3x+1)^2을 얻고 x=12를 대입해 181^2임을 보인다.", "decisiveStep": "일차항 계수가 같아지도록 짝지어 치환해 완전제곱식으로 인수분해하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "수의 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-018(DIRECT_ACTIVE): 짝짓기 치환 인수분해로 수의 완전제곱식 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "치환을 이용한 사차식 인수분해를 수 계산에 그대로 적용하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "$x(x+1)(x+2)(x+3)+1$을"}], "goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하고"}], "method": [{"term": "치환", "src": "solution", "quote": "$t=x^2+3x$로 치환하면", "evidenceType": "NAMED"}], "condition": [{"term": "자연수", "src": "stem", "quote": "어떤 자연수의 제곱인지"}]}}, "hold": ""}
```

## Q22

- 형식: 단답형  
- 배점: 5

### 발문

최고차항의 계수가 \$a\$ (\$a \> 0\$)인 이차함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$100a\$의 값을 구하시오. (가) 직선 \$y=2ax-8\$과 함수 \$y=f(x)\$의 그래프가 만나는 두 점의 \$x\$좌표는 \$1\$과 \$3\$이다. (나) \$1 \\le x \\le 3\$에서 \$f(x)\$의 최솟값은 \$5\$이다.

### 선지

없음

### 정답

\$650\$

### 해설

조건 (가)에 의하여 \$f(x)-(2ax-8)=0\$의 두 근이 \$1, 3\$이고 최고차항의 계수가 \$a\$이므로 \$f(x)-(2ax-8)=a(x-1)(x-3)=a(x^2-4x+3)\$ 따라서 \$\\begin{aligned} f(x) &= ax^2-4ax+3a+2ax-8 \\ &= ax^2-2ax+3a-8 \\ &= a(x-1)^2+2a-8 \\end{aligned}\$ \$a \> 0\$이고 구간 \$1 \\le x \\le 3\$에 꼭짓점의 \$x\$좌표 \$1\$이 포함되므로 최솟값은 \$f(1)=2a-8\$이다. 조건 (나)에서 \$2a-8=5 \\implies 2a=13 \\implies a=\\frac{13}{2}\$ 따라서 \$100a=100\\cdot\\frac{13}{2}=650\$이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 두 그래프의 교점과 구간 최솟값 예시를 보여준다."
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "-5",
        "-2",
        "1"
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "domain": [
        -1,
        5
      ],
      "viewport": [
        -1,
        5,
        -8,
        6
      ],
      "referenceLines": [
        {
          "id": "l",
          "slope": "2",
          "intercept": "-8"
        }
      ],
      "requiredPoints": [
        {
          "id": "V",
          "x": 1,
          "y": -6
        },
        {
          "id": "Q",
          "x": 3,
          "y": -2
        }
      ],
      "axisTickValues": {
        "x": [
          1,
          3
        ],
        "y": []
      }
    },
    "caption": "예: a=1일 때 f(x)=(x-1)^2-6과 직선 y=2x-8이 x=1, 3에서 만난다."
  }
}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "f(x)-(2ax-8)=a(x-1)(x-3)에서 f(x)=a(x-1)^2+2a-8을 구하고 구간 [1,3]의 최솟값 2a-8=5로 a=13/2를 구한다.", "decisiveStep": "두 식의 차로 f(x)를 세워 표준형으로 정리한 뒤 꼭짓점 x=1에서 최솟값 2a-8=5를 푸는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 교점 조건으로 f(x) 설정 후 구간 최솟값으로 a 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선과의 교점 조건으로 이차함수를 세우고 제한 구간 최솟값으로 미정계수 a를 구해야 한다.", "level": "상", "item4slot": {"format": "단답형", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=2ax-8$"}], "goal": [{"term": "값", "src": "stem", "quote": "$100a$의 값을 구하시오."}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "a(x-1)^2+2a-8", "evidenceType": "IMPLIED", "justification": "이차식을 표준형으로 변형해 꼭짓점에서 최솟값을 구함"}], "condition": [{"term": "최솟값", "src": "stem", "quote": "최솟값은 $5$이다."}, {"term": "양수", "src": "stem", "quote": "$a > 0$"}]}}, "hold": ""}
```

## Q23

- 형식: 단답형  
- 배점: 5

### 발문

길이가 \$3\\text{cm}\$인 막대 \$22\$개를 빈틈없이 연결하여 만들 수 있는 직사각형의 넓이의 최댓값을 구하시오.

### 선지

없음

### 정답

\$270\\text{cm}^2\$

### 해설

직사각형의 가로에 사용하는 막대 수를 \$m\$, 세로에 사용하는 막대 수를 \$n\$ (\$m, n\$은 자연수)이라 하자. 가로와 세로의 길이는 각각 \$3m\\text{cm}\$, \$3n\\text{cm}\$이고, 전체 막대 수가 \$22\$개이므로 \$2m+2n=22 \\implies m+n=11\$ 직사각형의 넓이를 \$S\$라 하면 \$S=(3m)(3n)=9mn=9m(11-m)=-9\\left(m-\\frac{11}{2}\\right)^2+\\frac{1089}{4}\$ \$m\$은 자연수이므로 \$m=\\frac{11}{2}=5.5\$에 가장 가까운 자연수 \$m=5\$ 또는 \$m=6\$일 때 넓이 \$S\$가 최대가 된다. 따라서 최댓값은 \$9\\cdot 5\\cdot 6=270\\text{cm}^2\$이다.

```
"NONE"
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "가로·세로 막대 수 m, n에 대해 m+n=11을 세우고 넓이 S=9m(11-m)의 대칭축 5.5에 가장 가까운 자연수 m=5, 6에서 최댓값 270을 구한다.", "decisiveStep": "막대 개수 m, n이 자연수이므로 이차함수 축 5.5에서 가장 가까운 정수 5, 6을 선택하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 자연수 제약 넓이 이차함수 최댓값 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "둘레가 고정된 직사각형 넓이 이차함수의 최댓값에 자연수 조건을 적용해 정수점을 선택해야 한다.", "level": "중", "item4slot": {"format": "단답형", "slots": {"given": [{"term": "직사각형", "src": "stem", "quote": "직사각형의"}], "goal": [{"term": "넓이", "src": "stem", "quote": "넓이의 최댓값을"}, {"term": "최댓값", "src": "stem", "quote": "최댓값을 구하시오."}], "method": [{"term": "이차함수", "src": "solution", "quote": "넓이 $S$", "evidenceType": "IMPLIED", "justification": "n=11-m을 대입해 m에 대한 이차함수로 넓이 최대를 구함"}], "condition": [{"term": "자연수", "src": "solution", "quote": "$m$은 자연수이므로"}]}}, "hold": ""}
```

