

```
{ "stem": "24_매산고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/24_매산고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 20, "totalScore": 100, "generatedAt": "2026-11-18" }
```

## Q01

- 형식: 객관식  
- 배점: 3.7

### 발문

두 다항식 \$A=3x^2+xy-2y^2\$, \$B=2x^2-xy+y^2\$에 대하여 \$A-2B\$를 간단히 하면?

### 선지

① \$-x^2-xy-4y^2\$ ② \$-x^2+3xy-4y^2\$ ③ \$x^2+3xy\$ ④ \$-x^2+3xy\$ ⑤ \$7x^2-xy-4y^2\$

### 정답

②

### 해설

\$\$\\begin{aligned} A-2B &= (3x^2+xy-2y^2)-2(2x^2-xy+y^2) \\ &= 3x^2+xy-2y^2-4x^2+2xy-2y^2 \\ &= \-x^2+3xy-4y^2 \\end{aligned}\$\$ 따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q01", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "다항식 B에 -2를 곱해 전개한 뒤 A의 동류항과 계수를 합산하여 정리한다.", "decisiveStep": "x^2, xy, y^2의 계수를 각각 (3-4), (1+2), (-2-2)로 계산해 -x^2+3xy-4y^2을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "차수·계수 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-001(DIRECT_ACTIVE): 다항식의 덧셈과 뺄셈/차수·계수 정리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차 결합 A-2B를 전개해 동류항만 정리하는 기초 연산 문항이다.", "level": "하", "item4slot": {"topic": "다항식의뺄셈", "task": "식정리", "given": "두이차다항식", "condition": "NONE"}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$2x^2-3x+1\$을 \$x-2\$로 나눈 나머지를 \$a\$, \$x+1\$로 나눈 나머지를 \$b\$라 할 때, \$a+b\$의 값은?

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

④

### 해설

\$f(x)=2x^2-3x+1\$이라 하면 나머지정리에 의하여 \$\$\\begin{aligned} a &= f(2)=2(2)^2-3(2)+1=8-6+1=3 \\ b &= f(-1)=2(-1)^2-3(-1)+1=2+3+1=6 \\end{aligned}\$\$ 따라서 \$a+b=3+6=9\$이므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q02", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리를 이용해 f(2)와 f(-1)을 각각 계산한 뒤 합을 구한다.", "decisiveStep": "a=f(2)=3, b=f(-1)=6을 구해 a+b=9를 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009(RPM_ONLY): 나머지정리/일차식으로 나눈 나머지"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 나눗셈의 나머지를 나머지정리로 두 번 대입해 더하는 기본 문항이다.", "level": "하", "item4slot": {"topic": "나머지정리", "task": "식의값구하기", "given": "이차다항식과두일차식", "condition": "NONE"}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 3.9

### 발문

\$\\dfrac{4-i}{1+i}\$의 실수부분과 허수부분의 합은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$4\$

### 정답

①

### 해설

분모와 분자에 분모의 켤레복소수 \$1-i\$를 곱하면 \$\$\\dfrac{4-i}{1+i}=\\dfrac{(4-i)(1-i)}{(1+i)(1-i)}=\\dfrac{4-4i-i+i^2}{1-i^2}=\\dfrac{3-5i}{2}=\\dfrac{3}{2}-\\dfrac{5}{2}i\$\$ 실수부분은 \$\\dfrac{3}{2}\$, 허수부분은 \$-\\dfrac{5}{2}\$이므로 그 합은 \$\$\\dfrac{3}{2}+\\left(-\\dfrac{5}{2}\\right)=-1\$\$ 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q03", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "분모의 켤레복소수 1-i를 분모·분자에 곱해 실수화한 뒤 실수부분과 허수부분을 더한다.", "decisiveStep": "(3-5i)/2에서 실수부분 3/2과 허수부분 -5/2를 분리해 합 -1을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-021(DIRECT_ACTIVE): 복소수의 뜻/실수부·허수부"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 나눗셈을 켤레복소수로 실수화해 실수부·허수부를 읽는 기초 문항이다.", "level": "하", "item4slot": {"topic": "복소수의나눗셈", "task": "실수부허수부합", "given": "복소수분수식", "condition": "NONE"}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.0

### 발문

이차방정식 \$x^2-6x-5=0\$의 서로 다른 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, \$\\alpha^2+\\beta^2\$의 값은?

### 선지

① \$26\$ ② \$31\$ ③ \$36\$ ④ \$41\$ ⑤ \$46\$

### 정답

⑤

### 해설

근과 계수의 관계에 의하여 \$\$\\alpha+\\beta=6, \\quad \\alpha\\beta=-5\$\$ 따라서 곱셈 공식의 변형을 이용하면 \$\$\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=6^2-2(-5)=36+10=46\$\$ 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q04", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "이차방정식 x^2-6x-5=0의 근과 계수의 관계로 합과 곱을 구한 뒤 대칭식 (alpha+beta)^2-2alpha*beta에 대입한다.", "decisiveStep": "alpha+beta=6, alpha*beta=-5를 제곱합 변형식에 대입해 46을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 근과 계수의 관계/근으로 방정식 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계와 곱셈공식의 변형 두 단계를 연속 적용하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "근과계수의관계", "task": "식의값구하기", "given": "이차방정식과두근", "condition": "NONE"}, "hold": "BINDING_GAP"}
```

## Q05

- 형식: 객관식  
- 배점: 4.1

### 발문

사차방정식 \$x^4-3x^3-8x^2-3x+1=0\$의 가장 큰 근을 \$\\alpha\$, 가장 작은 근을 \$\\beta\$라 할 때, \$\\alpha-\\beta\$의 값은?

### 선지

① \$\\dfrac{3+\\sqrt{21}}{2}\$ ② \$\\dfrac{5+\\sqrt{21}}{2}\$ ③ \$\\dfrac{7+\\sqrt{21}}{2}\$ ④ \$\\dfrac{9+\\sqrt{21}}{2}\$ ⑤ \$\\dfrac{11+\\sqrt{21}}{2}\$

### 정답

③

### 해설

주어진 사차방정식의 좌변을 인수정리와 조립제법으로 인수분해하면 \$x=-1\$을 중근으로 가지므로 \$\$x^4-3x^3-8x^2-3x+1=(x+1)^2(x^2-5x+1)=0\$\$ 따라서 네 근은 \$\$x=-1 \\text{ (중근)}, \\quad x=\\dfrac{5\\pm\\sqrt{21}}{2}\$\$ 이때 \$\\dfrac{5-\\sqrt{21}}{2}\>0\$이므로 가장 작은 근은 \$\\beta=-1\$, 가장 큰 근은 \$\\alpha=\\dfrac{5+\\sqrt{21}}{2}\$이다. 그러므로 \$\$\\alpha-\\beta=\\dfrac{5+\\sqrt{21}}{2}-(-1)=\\dfrac{7+\\sqrt{21}}{2}\$\$ 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q05", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "사차방정식을 (x+1)^2(x^2-5x+1)=0으로 인수분해한 뒤 모든 실근의 대소를 비교해 alpha-beta를 구한다.", "decisiveStep": "(5-sqrt(21))/2 > 0임을 확인하여 최소근 beta=-1과 최대근 alpha=(5+sqrt(21))/2를 확정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사차식의 중근 인수분해, 근의 공식, 무리근 대소 비교를 모두 거쳐야 하는 4단계 문항이다.", "level": "상", "item4slot": {"topic": "사차방정식", "task": "두근의차구하기", "given": "사차방정식", "condition": "최대근최소근"}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.2

### 발문

이차방정식 \$x^2+(2p-6)x+p+3=0\$이 중근을 갖게 하는 모든 \$p\$의 값의 합은? (단, \$p\$는 실수)

### 선지

① \$7\$ ② \$6\$ ③ \$5\$ ④ \$4\$ ⑤ \$3\$

### 정답

①

### 해설

이차방정식이 중근을 가지므로 판별식 \$D=0\$이다. \$\$\\dfrac{D}{4}=(p-3)^2-(p+3)=p^2-7p+6=(p-1)(p-6)=0\$\$ 따라서 \$p=1\$ 또는 \$p=6\$이고, 모든 \$p\$의 값의 합은 \$1+6=7\$이다. 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q06", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "중근 조건 D/4=0을 세워 p에 대한 이차방정식 p^2-7p+6=0을 푼다.", "decisiveStep": "(p-3)^2-(p+3)=0에서 p=1, 6을 구해 합 7을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식의 근/판별식"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식 D=0 조건으로 매개변수 이차방정식을 세워 합을 구하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "판별식", "task": "매개변수합구하기", "given": "중근을갖는이차방정식", "condition": "실수조건"}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.3

### 발문

모든 실수 \$x\$에 대하여 \$ax^2+2bx+5=(a-2)(x+1)^2+2(x-1)^2+7\$이 항상 성립할 때, 상수 \$a\$, \$b\$에 대하여 \$ab\$의 값은?

### 선지

① \$6\$ ② \$8\$ ③ \$10\$ ④ \$12\$ ⑤ \$14\$

### 정답

④

### 해설

우변을 전개하여 정리하면 \$\$\\begin{aligned} (a-2)(x+1)^2+2(x-1)^2+7 &= (a-2)(x^2+2x+1)+2(x^2-2x+1)+7 \\ &= ax^2+(2a-8)x+(a+7) \\end{aligned}\$\$ 양변의 동류항의 계수를 비교하면 상수항에서 \$5=a+7 \\implies a=-2\$이고, \$x\$의 계수에서 \$2b=2a-8=2(-2)-8=-12 \\implies b=-6\$이다. 따라서 \$ab=(-2)(-6)=12\$이므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q07", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "우변을 내림차순으로 전개한 뒤 항등식의 계수비교법으로 상수항과 일차항 계수를 연립한다.", "decisiveStep": "상수항 a+7=5에서 a=-2를 먼저 구하고 2b=2a-8에 대입해 b=-6을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 항등식/미정계수법"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식 두 개를 전개한 뒤 항등식 계수비교로 두 미지수를 차례로 구하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "항등식", "task": "식의값구하기", "given": "이차항등식", "condition": "항등식조건"}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.3

### 발문

\$x\$, \$y\$에 대한 연립방정식 \$\\begin{cases}x+y=3 \\ ax^2-(a+1)xy+y^2=11\\end{cases}\$의 해가 연립방정식 \$\\begin{cases}x-y=b \\ x^2+y^2=29\\end{cases}\$을 만족시킨다고 할 때, 실수 \$a\$, \$b\$에 대하여 \$ab\$의 값은? (단, \$b\<0\$)

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

②

### 해설

\$x+y=3\$, \$x^2+y^2=29\$에서 \$\$(x+y)^2=x^2+y^2+2xy \\implies 9=29+2xy \\implies xy=-10\$\$ 따라서 \$x\$, \$y\$는 이차방정식 \$t^2-3t-10=0\$, 즉 \$(t-5)(t+2)=0\$의 두 근이다. \$b=x-y\<0\$이므로 \$x\<y\$이고, \$x=-2\$, \$y=5\$, \$b=-7\$이다. 이를 \$ax^2-(a+1)xy+y^2=11\$에 대입하면 \$\$4a+10(a+1)+25=11 \\implies 14a=-24 \\implies a=-\\dfrac{12}{7}\$\$ 따라서 \$ab=\\left(-\\dfrac{12}{7}\\right)(-7)=12\$이므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q08", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "x+y=3과 x^2+y^2=29에서 xy=-10을 구해 이차방정식 t^2-3t-10=0으로 x, y를 결정한 뒤 b<0 조건으로 순서를 정한다.", "decisiveStep": "x=-2, y=5, b=-7을 확정하고 ax^2-(a+1)xy+y^2=11에 대입해 a=-12/7을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): i의 거듭제곱/복소수 조건"}, "crossConceptKeys": [], "conditionKeys": ["COND_NEGATIVE"], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭식 연립방정식으로 두 근을 구한 뒤 부호 조건 b<0으로 해를 확정하고 매개변수를 역산하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "연립이차방정식", "task": "매개변수곱구하기", "given": "두연립방정식", "condition": "음수조건"}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.4

### 발문

다항식 \$2x^3+ax^2-4x+b\$가 \$x^2-2x-3\$으로 나누어떨어질 때, 실수 \$a\$, \$b\$에 대하여 \$b-a\$의 값은?

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

⑤

### 해설

\$P(x)=2x^3+ax^2-4x+b\$라 하자. \$P(x)\$가 \$x^2-2x-3=(x-3)(x+1)\$로 나누어떨어지므로 인수정리에 의하여 \$P(3)=0\$, \$P(-1)=0\$이다. \$\$\\begin{aligned} P(3) &= 2(27)+9a-12+b=0 \\implies 9a+b=-42 \\ P(-1) &= \-2+a+4+b=0 \\implies a+b=-2 \\end{aligned}\$\$ 두 식을 빼면 \$8a=-40 \\implies a=-5\$이고, \$b=-2-(-5)=3\$이다. 따라서 \$b-a=3-(-5)=8\$이므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q09", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "x^2-2x-3=(x-3)(x+1)로 인수분해한 뒤 인수정리 P(3)=0, P(-1)=0을 연립한다.", "decisiveStep": "9a+b=-42와 a+b=-2를 연립하여 a=-5, b=3을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "식의 값"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-019(DIRECT_ACTIVE): 인수분해의 활용/식의 값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차 나누는 식을 인수분해해 인수정리 두 식을 연립하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "인수정리", "task": "식의값구하기", "given": "삼차다항식과이차인수", "condition": "나누어떨어짐"}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.5

### 발문

삼차방정식 \$x^3=1\$의 한 허근을 \$\\omega\$라 할 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$\\omega^2+\\omega+1=0\$ ㄴ. \$\\omega^{10}+\\omega^{20}+1=0\$ ㄷ. \$(\\omega x+\\omega^2 y+1)(\\omega^2 x+\\omega y+1)=x^2+xy+y^2-x-y+1\$

### 선지

① ㄱ ② ㄷ ③ ㄱ, ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

③

### 해설

\$\\omega\$는 \$x^3-1=(x-1)(x^2+x+1)=0\$의 허근이므로 \$\\omega^3=1\$, \$\\omega^2+\\omega+1=0\$이다. ㄱ. \$\\omega^2+\\omega+1=0\$이므로 참이다. ㄴ. \$\\omega^3=1\$이므로 \$\\omega^{10}=\\omega\$, \$\\omega^{20}=\\omega^2\$이다. 따라서 \$\\omega^{10}+\\omega^{20}+1=\\omega+\\omega^2+1=0\$이므로 참이다. ㄷ. 좌변을 전개하면 \$\$\\omega^3 x^2+(\\omega^2+\\omega^4)xy+\\omega^3 y^2+(\\omega+\\omega^2)x+(\\omega^2+\\omega)y+1\$\$ 여기서 \$\\omega^3=1\$, \$\\omega^4=\\omega\$, \$\\omega+\\omega^2=-1\$을 대입하면 \$x^2-xy+y^2-x-y+1\$이므로 우변의 \$+xy\$와 부호가 달라 거짓이다. 따라서 옳은 것은 ㄱ, ㄴ이므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q10", "variationType": "CONDITION", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "x^3=1의 허근 omega의 성질 omega^3=1, omega^2+omega+1=0을 이용해 거듭제곱과 다항식 전개를 판별한다.", "decisiveStep": "ㄷ의 xy 계수 omega^2+omega^4=omega^2+omega=-1임을 계산해 거짓임을 가려낸다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039(DIRECT_ACTIVE): 삼차·사차방정식/인수분해형"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "단위근 omega의 주기성과 이변수 곱셈 전개를 결합해 합답형 선지를 판별하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "삼차방정식의허근", "task": "참거짓판별", "given": "단위근omega", "condition": "NONE"}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.6

### 발문

이차함수 \$y=x^2+(a^2+6a+5)x+2a+3\$의 그래프와 \$x\$축이 서로 다른 두 점에서 만난다. 그 두 교점의 \$x\$좌표는 절댓값이 같고 부호가 서로 다를 때, 상수 \$a\$의 값은?

### 선지

① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$

### 정답

①

### 해설

\$x\$축과의 두 교점의 \$x\$좌표는 방정식 \$x^2+(a^2+6a+5)x+2a+3=0\$의 두 실근이다. 절댓값이 같고 부호가 서로 다르므로 두 근의 합이 \$0\$이다. \$\$-(a^2+6a+5)=0 \\implies (a+1)(a+5)=0 \\implies a=-1 \\text{ 또는 } a=-5\$\$

- \$a=-1\$일 때: \$y=x^2+1\$이 되어 \$x\$축과 만나지 않는다.  
- \$a=-5\$일 때: \$y=x^2-7\$이 되어 \$x\$축과 서로 다른 두 점 \$(\\pm\\sqrt{7}, 0)\$에서 만난다.

따라서 \$a=-5\$이므로 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 근의 합이 0인 조건에서 a 후보 -1, -5를 구한 뒤 서로 다른 두 교점(두 근의 곱<0) 조건으로 거른다.", "decisiveStep": "a=-1일 때 상수항이 양수(+1)여서 x축과 만나지 않음을 확인하고 a=-5만 남긴다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): 그래프와 근/x축과의 교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근의 합=0 조건으로 얻은 두 후보 중 x축과 서로 다른 두 점에서 만날 조건을 검산해야 하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "이차함수와x축의교점", "task": "계수구하기", "given": "대칭교점조건이차함수", "condition": "부호반대절댓값같음"}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.7

### 발문

자연수 \$m\$에 대하여 이차함수 \$y=x^2+(m+k)x+4(m-k)^2\$이 \$x\$축과 한 점에서 만나도록 하는 양의 실수 \$k\$의 최솟값은?

### 선지

① \$\\dfrac{1}{5}\$ ② \$\\dfrac{2}{5}\$ ③ \$\\dfrac{1}{3}\$ ④ \$\\dfrac{3}{5}\$ ⑤ \$\\dfrac{5}{3}\$

### 정답

④

### 해설

\$x\$축과 한 점에서 만나므로 이차방정식 \$x^2+(m+k)x+4(m-k)^2=0\$의 판별식 \$D=0\$이다. \$\$D=(m+k)^2-16(m-k)^2=0 \\implies (m+k)^2={4(m-k)}^2\$\$ 따라서 \$m+k=4(m-k)\$ 또는 \$m+k=-4(m-k)\$이다.

- \$m+k=4m-4k\$에서 \$5k=3m \\implies k=\\dfrac{3}{5}m\$  
- \$m+k=-4m+4k\$에서 \$3k=5m \\implies k=\\dfrac{5}{3}m\$

\$m\$은 자연수이고 \$k\>0\$이므로 \$k\$의 최솟값은 \$m=1\$일 때 \$k=\\dfrac{3}{5}\$이다. 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "x축 접점 조건 D=(m+k)^2-16(m-k)^2=0을 제곱차로 풀어 두 관계식을 얻고 자연수 m=1에서 최솟값을 택한다.", "decisiveStep": "k=3m/5와 k=5m/3 중 더 작은 식에 최소 자연수 m=1을 대입해 3/5을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": ["COND_NATURAL_NUMBER", "COND_POSITIVE"], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식 등식을 두 경우로 분기하고 자연수·양수 조건을 동시에 만족하는 최솟값을 판정하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "이차함수의접선조건", "task": "최솟값구하기", "given": "x축과접하는이차함수", "condition": "자연수양수조건"}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.8

### 발문

삼차다항식 \$f(x)\$가 다음 조건을 모두 만족시킨다. (가) 다항식 \$f(x)\$를 \$(x-2)(x+1)\$로 나눈 몫과 나머지가 같다. (나) \$f(2x+1)\$을 \$(x+1)^2\$으로 나눈 나머지는 \$3\$이다. \$f(0)\$의 값은?

### 선지

① \$-9\$ ② \$-12\$ ③ \$-15\$ ④ \$-18\$ ⑤ \$-21\$

### 정답

②

### 해설

조건 (가)에서 \$f(x)\$가 삼차다항식이므로 몫과 나머지는 모두 일차식이다. 이를 \$ux+v\$ (\$u\\ne 0\$)라 하면 \$\$f(x)=(x-2)(x+1)(ux+v)+(ux+v)=(x^2-x-1)(ux+v)\$\$ 조건 (나)를 적용하기 위해 \$t=x+1\$로 치환하면 \$x=t-1\$, \$2x+1=2t-1\$이므로 \$\$f(2x+1)=f(2t-1)={(2t-1)^2-(2t-1)-1}{u(2t-1)+v}=(4t^2-6t+1){2ut+(v-u)}\$\$ 이 식을 \$t^2=(x+1)^2\$으로 나눈 나머지는 \$t\$에 대한 일차 이하의 항이므로 \$\$(v-u)+{2u-6(v-u)}t=3\$\$ \$t\$에 대한 계수를 비교하면 \$\$v-u=3, \\quad 2u-6(v-u)=0\$\$ \$v-u=3\$을 두 번째 식에 대입하면 \$2u-18=0 \\implies u=9\$이고, \$v=12\$이다. 따라서 \$f(0)=(0^2-0-1)(v)=-12\$이므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "f(x)=(x^2-x-1)(ux+v)로 설정한 뒤 t=x+1 치환을 이용해 f(2t-1)의 t^2 미만 항만 추출해 나머지 3과 비교한다.", "decisiveStep": "f(2t-1)=(4t^2-6t+1)(2ut+v-u)에서 상수항 v-u=3과 일차항 계수 2u-6(v-u)=0을 연립한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009(RPM_ONLY): 나머지정리/일차식으로 나눈 나머지"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "몫·나머지 일치 조건의 식 구성과 평행이동 치환 t=x+1을 통한 t^2 나머지 추출이 결합된 4단계 문항이다.", "level": "상", "item4slot": {"topic": "나머지정리", "task": "함숫값구하기", "given": "몫과나머지가같은삼차식", "condition": "완전제곱식나머지조건"}, "hold": "RPM_ONLY"}
```

## Q14

- 형식: 객관식  
- 배점: 4.8

### 발문

서로 다른 세 실수 \$\\alpha\$, \$\\beta\$, \$\\gamma\$가 다음 조건을 모두 만족시킨다. (가) \$\\alpha+\\beta+\\gamma-(\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha)=7\$ (나) \$\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha+\\alpha\\beta\\gamma=-11\$ (다) \$\\alpha+\\beta+\\gamma-\\alpha\\beta\\gamma=8\$ \$\\alpha^2+\\beta^2+\\gamma^2=p\$, \$\|(\\alpha-\\beta)(\\beta-\\gamma)(\\gamma-\\alpha)\|=q\$라 할 때, \$p+q\$의 값은?

### 선지

① \$36\$ ② \$38\$ ③ \$40\$ ④ \$42\$ ⑤ \$44\$

### 정답

⑤

### 해설

\$s\_1=\\alpha+\\beta+\\gamma\$, \$s\_2=\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha\$, \$s\_3=\\alpha\\beta\\gamma\$라 하면 \$\$s\_1-s\_2=7, \\quad s\_2+s\_3=-11, \\quad s\_1-s\_3=8\$\$ (가)+(나)에서 \$s\_1+s\_3=-4\$이고, (다)와 연립하면 \$2s\_1=4 \\implies s\_1=2\$, \$s\_3=-6\$, \$s\_2=-5\$이다. 따라서 \$\\alpha\$, \$\\beta\$, \$\\gamma\$를 세 근으로 하는 삼차방정식은 \$\$t^3-2t^2-5t+6=(t-1)(t+2)(t-3)=0\$\$ 이므로 세 실수는 \$-2, 1, 3\$이다. 그러므로 \$\$\\begin{aligned} p &= (-2)^2+1^2+3^2=4+1+9=14 \\ q &= \|(-2-1)(1-3)(3-(-2))\|=\|(-3)(-2)(5)\|=30 \\end{aligned}\$\$ 따라서 \$p+q=14+30=44\$이므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "기본대칭식 s_1, s_2, s_3에 대한 연립일차방정식을 풀어 삼차방정식 t^3-2t^2-5t+6=0을 작성하고 세 근을 구한다.", "decisiveStep": "s_1=2, s_2=-5, s_3=-6에서 인수분해로 세 수 -2, 1, 3을 확정해 p와 q를 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "수의 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-018(DIRECT_ACTIVE): 인수분해의 활용/수의 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연립방정식으로 기본대칭식을 구한 뒤 역으로 삼차방정식을 세워 인수분해하고 대칭식을 계산하는 4단계 문항이다.", "level": "상", "item4slot": {"topic": "삼차방정식의근과계수", "task": "식의값구하기", "given": "기본대칭식연립조건", "condition": "서로다른세실수"}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.9

### 발문

양수 \$a\$에 대하여 꼭짓점이 \$A(-2,-a)\$이고 점 \$B(2,0)\$을 지나는 이차함수 \$y=f(x)\$의 그래프와 꼭짓점이 \$C(2,3a)\$인 이차함수 \$y=g(x)\$의 그래프가 있다. 점 \$A\$에서 \$x\$축에 내린 수선의 발을 \$D\$라 할 때, 사각형 \$ABCD\$의 넓이는 \$16\$이다. 이차함수 \$y=g(x)\$의 그래프가 \$y\$축과 만나는 점이 선분 \$CD\$ 위에 있을 때, \$-3\\le t\\le 3\$을 만족시키는 실수 \$t\$에 대하여 \$8f(t)-4g(t)\$의 최댓값과 최솟값의 합은?

### 선지

① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$

### 정답

③

### 해설

네 점 \$A(-2,-a)\$, \$B(2,0)\$, \$C(2,3a)\$, \$D(-2,0)\$에서 선분 \$AD\$와 선분 \$BC\$는 \$y\$축에 평행하고 길이가 각각 \$a\$, \$3a\$이며 두 평행선 사이의 거리는 \$2-(-2)=4\$이다. 사다리꼴 \$ABCD\$의 넓이가 \$16\$이므로 \$\$\\dfrac{1}{2}(a+3a)\\times 4=16 \\implies 8a=16 \\implies a=2\$\$ 따라서 \$A(-2,-2)\$, \$C(2,6)\$, \$D(-2,0)\$이다.

1) \$f(x)=c(x+2)^2-2\$가 \$B(2,0)\$을 지나므로 \$16c-2=0 \\implies c=\\dfrac{1}{8}\$이다. \$\$8f(t)=(t+2)^2-16=t^2+4t-12\$\$  
2) 직선 \$CD\$는 두 점 \$(-2,0)\$, \$(2,6)\$을 지나므로 기울기가 \$\\dfrac{3}{2}\$이고 \$y\$절편은 \$(0,3)\$이다. \$g(x)=d(x-2)^2+6\$이 \$(0,3)\$을 지나므로 \$4d+6=3 \\implies d=-\\dfrac{3}{4}\$이다. \$\$4g(t)=-3(t-2)^2+24=-3t^2+12t+12\$\$ 따라서 \$\$8f(t)-4g(t)=(t^2+4t-12)-(-3t^2+12t+12)=4t^2-8t-24=4(t-1)^2-28\$\$ \$-3\\le t\\le 3\$에서 꼭짓점 \$t=1\$이 범위에 포함되므로  
- 최솟값: \$t=1\$일 때 \$-28\$  
- 최댓값: \$t=-3\$일 때 \$4(-4)^2-28=36\$

구하는 합은 \$36+(-28)=8\$이므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "사다리꼴 넓이 8a=16으로 a=2를 결정하고 f(x), g(x)의 식을 각각 구한 뒤 8f(t)-4g(t)의 제한된 범위 최대·최소를 구한다.", "decisiveStep": "직선 CD의 y절편 (0,3)을 g(0)=3으로 연결해 d=-3/4를 구하고 8f(t)-4g(t)=4(t-1)^2-28을 완성한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": ["COND_RANGE"], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 5, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 넓이, 직선의 y절편, 두 이차함수 식 작성, 합성 이차함수의 제한 범위 최대·최소를 모두 연결하는 5단계 문항이다.", "level": "상", "item4slot": {"topic": "이차함수의최대최소", "task": "최댓값최솟값합", "given": "두이차함수와사다리꼴넓이", "condition": "제한된범위"}, "hold": ""}
```

## Q16

- 형식: 단답형  
- 배점: 4

### 발문

\$x\$에 대한 이차방정식 \$x^2+2(k-2)x+k^2-3k-2=0\$이 서로 다른 두 실근을 갖도록 하는 모든 자연수 \$k\$의 값의 합을 구하시오.

### 선지

없음

### 정답

\$15\$

### 해설

서로 다른 두 실근을 가지므로 판별식 \$D\>0\$이어야 한다. \$\$\\dfrac{D}{4}=(k-2)^2-(k^2-3k-2)=k^2-4k+4-k^2+3k+2=6-k\>0\$\$ 따라서 \$k\<6\$이다. \$k\$는 자연수이므로 \$k=1, 2, 3, 4, 5\$이고, 그 합은 \$\$1+2+3+4+5=15\$\$

```
"NONE"
```

```
{"sourceQid": "Q16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "서로 다른 두 실근 조건 D/4>0을 풀어 k<6을 얻고 자연수 k를 모두 더한다.", "decisiveStep": "(k-2)^2-(k^2-3k-2)=6-k>0에서 자연수 k=1,2,3,4,5를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식의 근/판별식"}, "crossConceptKeys": [], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식 부등식을 풀어 일차부등식 k<6을 얻고 자연수 해를 합산하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "판별식", "task": "자연수합구하기", "given": "서로다른두실근이차방정식", "condition": "자연수조건"}, "hold": ""}
```

## Q17

- 형식: 단답형  
- 배점: 5

### 발문

삼차방정식 \$x^3+(3a-1)x-3a=0\$의 서로 다른 실근의 개수가 \$2\$가 되도록 하는 실수 \$a\$의 값을 모두 구하시오.

### 선지

없음

### 정답

\$-\\dfrac{2}{3}, \\dfrac{1}{12}\$

### 해설

주어진 삼차방정식은 \$x=1\$을 근으로 가지므로 좌변을 인수분해하면 \$\$x^3-x+3a(x-1)=(x-1)(x^2+x+3a)=0\$\$ 서로 다른 실근의 개수가 \$2\$가 되는 경우는 다음 두 가지이다.

1) \$x^2+x+3a=0\$이 \$1\$이 아닌 중근을 가질 때: \$\$D=1^2-4(3a)=1-12a=0 \\implies a=\\dfrac{1}{12}\$\$ 이때 중근은 \$x=-\\dfrac{1}{2}\$로 \$1\$과 다르므로 서로 다른 실근은 \$1, \-\\dfrac{1}{2}\$의 \$2\$개이다.  
2) \$x^2+x+3a=0\$이 \$x=1\$을 근으로 갖고 다른 한 실근이 \$1\$이 아닐 때: \$\$1^2+1+3a=0 \\implies a=-\\dfrac{2}{3}\$\$ 이때 방정식은 \$(x-1)^2(x+2)=0\$이 되어 서로 다른 실근은 \$1, \-2\$의 \$2\$개이다.

따라서 구하는 실수 \$a\$의 값은 \$-\\dfrac{2}{3}, \\dfrac{1}{12}\$이다.

```
"NONE"
```

```
{"sourceQid": "Q17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "x=1로 인수분해한 뒤 남은 이차식 x^2+x+3a=0이 중근을 갖는 경우와 x=1을 근으로 갖는 경우로 나누어 푼다.", "decisiveStep": "D=1-12a=0에서 a=1/12를 얻고 x=1 대입 2+3a=0에서 a=-2/3을 빠뜨리지 않고 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "식의 값"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-019(DIRECT_ACTIVE): 인수분해의 활용/식의 값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식의 실근 개수 2개 조건을 두 가지 중복근 케이스로 분기해 풀어야 하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "삼차방정식의중근", "task": "매개변수구하기", "given": "삼차방정식", "condition": "서로다른실근2개"}, "hold": ""}
```

## Q18

- 형식: 단답형  
- 배점: 6

### 발문

복소수 \$z=a+bi\$ (\$a\\ne 0\$, \$b\>0\$)에 대하여 \$z^2-\\bar{z}=0\$일 때, \$\$\\dfrac{1}{z^{24}+1}+\\dfrac{1}{z^{23}+1}+\\cdots+\\dfrac{1}{z^2+1}+\\dfrac{1}{z+1}+\\dfrac{1}{\\bar{z}+1}+\\dfrac{1}{\\bar{z}^2+1}+\\cdots+\\dfrac{1}{\\bar{z}^{23}+1}+\\dfrac{1}{\\bar{z}^{24}+1}\$\$ 의 값을 구하시오. (단, \$i=\\sqrt{-1}\$, \$\\bar{z}\$는 \$z\$의 켤레복소수이다.)

### 선지

없음

### 정답

\$24\$

### 해설

\$z^2=\\bar{z}\$의 양변에 \$z\$를 곱하면 \$z^3=z\\bar{z}\$이다. 또한 \$z^2=\\bar{z}\$에서 \$\|z\|^2=\|\\bar{z}\|=\|z\|\$이고 \$b\>0\$이므로 \$z\\ne 0\$, 따라서 \$\|z\|=1\$이다. 그러므로 \$z\\bar{z}=\|z\|^2=1\$이고, \$z^3=1\$이다. \$b\>0\$이므로 \$z\\ne 1\$이고 \$z^2+z+1=0\$, 즉 \$z+\\bar{z}=z+z^2=-1\$이다. 이제 각 \$k=1, 2, \\cdots, 24\$에 대하여 쌍 \$\\dfrac{1}{z^k+1}+\\dfrac{1}{\\bar{z}^k+1}\$의 값을 구하면

- \$k\$가 \$3\$의 배수일 때: \$z^k=\\bar{z}^k=1\$이므로 \$\\dfrac{1}{2}+\\dfrac{1}{2}=1\$  
- \$k\$가 \$3\$의 배수가 아닐 때: \${z^k, \\bar{z}^k}={z, \\bar{z}}\$이므로 \$\$\\dfrac{1}{z+1}+\\dfrac{1}{\\bar{z}+1}=\\dfrac{z+\\bar{z}+2}{z\\bar{z}+z+\\bar{z}+1}=\\dfrac{-1+2}{1-1+1}=1\$\$

따라서 \$k=1\$부터 \$24\$까지 모든 쌍의 합이 각각 \$1\$이므로 구하는 전체 합은 \$24\$이다.

```
"NONE"
```

```
{"sourceQid": "Q18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "z^2=bar(z)에서 |z|=1과 z^3=1을 도출하고 지수 k별로 켤레 쌍 1/(z^k+1)+1/(bar(z)^k+1)=1임을 보인다.", "decisiveStep": "z^3=1의 3주기성을 이용해 3의 배수와 비배수 모두 각 켤레 쌍의 합이 1임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): i의 거듭제곱/복소수 조건"}, "crossConceptKeys": [], "conditionKeys": ["COND_NONZERO", "COND_POSITIVE"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 등식에서 z^3=1을 유도한 뒤 24개 켤레 분수 쌍의 대칭 합을 일반화해야 하는 4단계 문항이다.", "level": "상", "item4slot": {"topic": "복소수의거듭제곱", "task": "급수합구하기", "given": "켤레등식만족복소수", "condition": "허수조건"}, "hold": ""}
```

## Q19

- 형식: 서술형  
- 배점: 10

### 발문

다항식 \$f(x)\$를 \$x^2+x+1\$로 나누었을 때의 몫을 \$g(x)\$라 하면 \$f(x)\$와 \$g(x)\$는 다음 조건을 만족시킨다. 아래 물음에 답하시오. (가) 다항식 \$f(x)\$를 \$x^2+x+1\$로 나눈 나머지는 \$2x+3\$이고, \$f(x)\$를 \$x+1\$로 나눈 나머지는 \$-2\$이다. (나) \$g(1)=5\$ (1) \$f(x)\$를 \$x^3-1\$로 나눈 나머지를 구하는 과정을 서술하시오. (4.0점) (2) \$f(x)\$를 \$(x^2+x+1)(x^2-1)\$로 나눈 나머지를 구하는 과정을 서술하시오. (6.0점)

### 선지

없음

### 정답

(1) \$5x^2+7x+8\$ (2) \$4x^3+5x^2+7x+4\$

### 해설

조건 (가)에 의하여 \$\$f(x)=(x^2+x+1)g(x)+2x+3\$\$ 이고, \$f(-1)=-2\$이므로 \$\$(1-1+1)g(-1)-2+3=-2 \\implies g(-1)=-3\$\$ (1) \$g(x)\$를 \$x-1\$로 나누었을 때의 몫을 \$Q\_1(x)\$라 하면 \$g(1)=5\$이므로 \$g(x)=(x-1)Q\_1(x)+5\$이다. 이를 \$f(x)\$에 대입하면 \$x^3-1=(x-1)(x^2+x+1)\$이므로 \$\$\\begin{aligned} f(x) &= (x^2+x+1){(x-1)Q\_1(x)+5}+2x+3 \\ &= (x^3-1)Q\_1(x)+5(x^2+x+1)+2x+3 \\ &= (x^3-1)Q\_1(x)+5x^2+7x+8 \\end{aligned}\$\$ 따라서 구하는 나머지는 \$5x^2+7x+8\$이다.

(2) \$g(x)\$를 \$x^2-1\$로 나누었을 때의 몫을 \$Q\_2(x)\$, 나머지를 \$cx+d\$ (\$c, d\$는 상수)라 하자. \$g(1)=5\$, \$g(-1)=-3\$이므로 \$\$c+d=5, \\quad \-c+d=-3\$\$ 두 식을 연립하면 \$c=4\$, \$d=1\$이다. 따라서 \$g(x)=(x^2-1)Q\_2(x)+4x+1\$을 \$f(x)\$에 대입하면 \$\$\\begin{aligned} f(x) &= (x^2+x+1){(x^2-1)Q\_2(x)+4x+1}+2x+3 \\ &= (x^2+x+1)(x^2-1)Q\_2(x)+(x^2+x+1)(4x+1)+2x+3 \\ &= (x^2+x+1)(x^2-1)Q\_2(x)+4x^3+5x^2+7x+4 \\end{aligned}\$\$ 따라서 구하는 나머지는 \$4x^3+5x^2+7x+4\$이다.

```
"NONE"
```

```
{"sourceQid": "Q19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "f(x)=(x^2+x+1)g(x)+2x+3에서 몫 g(x)를 x-1 및 x^2-1로 나눈 표현으로 치환하여 전개한다.", "decisiveStep": "f(-1)=-2에서 g(-1)=-3을 구한 뒤 g(x)의 x^2-1 나머지 4x+1을 (x^2+x+1)에 곱해 3차 나머지를 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 다항식의 나눗셈/몫과 나머지"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "몫 다항식 g(x)에 대한 나머지정리를 중첩 적용해 3차·4차식 나머지를 단계적으로 도출하는 4단계 문항이다.", "level": "상", "item4slot": {"topic": "다항식나눗셈중첩", "task": "나머지구하기", "given": "몫과나머지가같은삼차식", "condition": "NONE"}, "hold": ""}
```

## Q20

- 형식: 서술형  
- 배점: 10

### 발문

이차함수 \$f(x)=x^2+ax+b\$가 두 점 \$A(2,1)\$, \$B(4,3)\$을 지난다. 아래 물음에 답하시오. (1) 상수 \$a\$, \$b\$의 값을 구하는 과정을 서술하시오. (4.0점) (2) \$2\\le x\\le 4\$인 \$x\$에 대하여 \$f(x)\$가 실수 \$n\$의 값에 관계없이 \$(1,1)\$을 지나는 직선 \$g(x)=nx+1-n\$과 서로 다른 두 점에서 만나게 하는 상수 \$n\$의 범위를 구하는 과정을 서술하시오. (6.0점)

### 선지

없음

### 정답

(1) \$a=-5, b=7\$ (2) \$-3+2\\sqrt{2}\<n\\le 0\$

### 해설

(1) \$f(2)=1\$, \$f(4)=3\$이므로 \$\$4+2a+b=1 \\implies 2a+b=-3\$\$ \$\$16+4a+b=3 \\implies 4a+b=-13\$\$ 두 식을 빼면 \$2a=-10 \\implies a=-5\$이고, \$b=-3-(-10)=7\$이다. 따라서 \$a=-5\$, \$b=7\$이고 \$f(x)=x^2-5x+7\$이다.

(2) 두 그래프의 교점의 \$x\$좌표는 방정식 \$f(x)=g(x)\$, 즉 \$\$F(x)=x^2-(5+n)x+(6+n)=0\$\$ 의 실근이다. \$2\\le x\\le 4\$에서 서로 다른 두 실근을 갖기 위한 조건은 다음 세 가지이다.

1) 경계값 조건: \$F(2)\\ge 0\$이고 \$F(4)\\ge 0\$이어야 한다. \$\$F(2)=4-2(5+n)+6+n=-n\\ge 0 \\implies n\\le 0\$\$ \$\$F(4)=16-4(5+n)+6+n=2-3n\\ge 0 \\implies n\\le \\dfrac{2}{3}\$\$  
2) 대칭축의 위치 조건: \$\$2\<\\dfrac{5+n}{2}\<4 \\implies 4\<5+n\<8 \\implies \-1\<n\<3\$\$  
3) 판별식 조건: 서로 다른 두 실근을 가져야 하므로 \$D\>0\$이다. \$\$D=(5+n)^2-4(6+n)=n^2+6n+1=(n+3)^2-8\>0\$\$ 따라서 \$n\<-3-2\\sqrt{2}\$ 또는 \$n\>-3+2\\sqrt{2}\$이다.

1), 2), 3)의 공통 범위를 구하면 \$-3+2\\sqrt{2}\\approx \-0.172\>-1\$이므로 \$\$-3+2\\sqrt{2}\<n\\le 0\$\$

```
"NONE"
```

```
{"sourceQid": "Q20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-10", "subUnitKey": "H15-SA-10-LINE_EQUATION", "conceptClusterKey": null, "primaryMethod": "두 점을 대입해 f(x)를 구한 뒤 차방정식 F(x)=f(x)-g(x)=0의 근의 분리(경계값, 축, 판별식) 세 조건을 연립한다.", "decisiveStep": "F(2)>=0, F(4)>=0, 축 2<(5+n)/2<4, D=n^2+6n+1>0의 네 부등식 공통범위 -3+2sqrt(2)<n<=0을 구한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "직선의 방정식", "l3": "직선의 방정식", "l4": "두 점을 지나는 직선"}, "ptTplCandidate": {"problemTypeKey": "PT_LINE_EQUATION", "templateKey": "TPL_LINE_TWO_POINTS", "why": "high1.json H1-RPM-060(DIRECT_ACTIVE): 직선의 방정식/두 점을 지나는 직선"}, "crossConceptKeys": [], "conditionKeys": ["COND_RANGE"], "integrationPattern": "DEEP_COMPOSITE", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수 식 결정 후 닫힌 구간 [2,4]에서의 근의 분리 세 조건(경계·축·판별식)을 모두 연립하는 4단계 문항이다.", "level": "상", "item4slot": {"topic": "이차방정식의근의분리", "task": "매개변수범위구하기", "given": "이차함수와정점을지나는직선", "condition": "제한된구간두교점"}, "hold": ""}
```

