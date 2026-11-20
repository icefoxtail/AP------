

```
{ "stem": "24_매산여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/24_매산여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-18" }
```

## Q01

- 형식: 객관식  
- 배점: 3.5

### 발문

두 다항식 \$A=2x^3-x^2+4x\$, \$B=x^2-3x+2\$일 때, \$A-2B\$를 계산하면?

### 선지

① \$2x^3-3x^2-2x-4\$ ② \$2x^3+x^2+10x-4\$ ③ \$2x^3-3x^2+10x-4\$ ④ \$2x^3-3x^2+10x+4\$ ⑤ \$2x^3-x^2+7x-2\$

### 정답

③

### 해설

\$\$\\begin{aligned} A-2B &= (2x^3-x^2+4x)-2(x^2-3x+2) \\ &= 2x^3-x^2+4x-2x^2+6x-4 \\ &= 2x^3-3x^2+10x-4 \\end{aligned}\$\$ 따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q01", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "다항식 B에 -2를 곱해 전개한 뒤 A의 동류항과 계수를 합산하여 내림차순으로 정리한다.", "decisiveStep": "x^2항 (-1-2)와 x항 (4+6)의 부호 계산을 거쳐 2x^3-3x^2+10x-4를 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "차수·계수 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-001(DIRECT_ACTIVE): 다항식의 덧셈과 뺄셈/차수·계수 정리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차다항식과 이차다항식의 일차결합 A-2B를 동류항 정리만으로 구하는 기초 연산 문항이다.", "level": "하", "item4slot": {"topic": "다항식의뺄셈", "task": "식정리", "given": "삼차다항식과이차다항식", "condition": "NONE"}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.6

### 발문

다항식 \$P(x)=x^3-3x+5\$를 \$x+2\$로 나누었을 때, 나머지를 구하면?

### 선지

① \$3\$ ② \$1\$ ③ \$-1\$ ④ \$5\$ ⑤ \$7\$

### 정답

①

### 해설

나머지정리에 의하여 \$P(x)\$를 \$x+2\$로 나눈 나머지는 \$P(-2)\$이다. \$\$P(-2)=(-2)^3-3(-2)+5=-8+6+5=3\$\$ 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q02", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리에 따라 P(x)=x^3-3x+5에 x=-2를 대입하여 나머지를 계산한다.", "decisiveStep": "(-2)^3-3(-2)+5=3을 계산해 나머지를 바로 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009(RPM_ONLY): 나머지정리/일차식으로 나눈 나머지"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 x+2로 나눈 나머지를 나머지정리 P(-2)에 대입해 바로 구하는 1단계 문항이다.", "level": "하", "item4slot": {"topic": "나머지정리", "task": "나머지구하기", "given": "삼차다항식과일차식", "condition": "NONE"}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 3.7

### 발문

\<보기\>에서 인수분해가 바른 것만을 있는 대로 고른 것은? \<보기\> ㄱ. \$(x+2y-1)(x+2y+4)-6=(x+2y-2)(x+2y+5)\$ ㄴ. \$27x^3+1=(3x+1)(9x^2+3x+1)\$ ㄷ. \$x^3-x^2-x+1=(x-1)^2(x+1)\$

### 선지

① ㄱ, ㄴ, ㄷ ② ㄱ, ㄴ ③ ㄴ, ㄷ ④ ㄱ, ㄷ ⑤ ㄱ

### 정답

④

### 해설

ㄱ. \$t=x+2y\$라 하면 \$(t-1)(t+4)-6=t^2+3t-10=(t-2)(t+5)=(x+2y-2)(x+2y+5)\$이므로 옳다. ㄴ. \$27x^3+1=(3x)^3+1^3=(3x+1)(9x^2-3x+1)\$이므로 일차항 부호가 틀려 옳지 않다. ㄷ. \$x^3-x^2-x+1=x^2(x-1)-(x-1)=(x-1)(x^2-1)=(x-1)^2(x+1)\$이므로 옳다. 따라서 바른 것은 ㄱ, ㄷ이므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q03", "variationType": "CONDITION", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "치환(t=x+2y), 세제곱의 합 공식, 두 항씩 묶기를 각각 적용하여 세 등식의 참·거짓을 판별한다.", "decisiveStep": "ㄴ에서 27x^3+1의 중간항 부호가 -3x여야 함을 짚어 거짓임을 판별한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "식의 값"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-019(DIRECT_ACTIVE): 인수분해의 활용/식의 값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "치환·공식·항 묶기 세 가지 인수분해 기법을 독립적으로 검증하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "인수분해", "task": "참거짓판별", "given": "인수분해등식보기", "condition": "NONE"}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.7

### 발문

다음 중 다항식 \$x^4-x^3-3x^2+x+2\$의 인수가 아닌 것은?

### 선지

① \$x+1\$ ② \$x^2+1\$ ③ \$x-2\$ ④ \$x^2-1\$ ⑤ \$x^2+2x+1\$

### 정답

②

### 해설

\$P(x)=x^4-x^3-3x^2+x+2\$라 하면 \$P(1)=1-1-3+1+2=0\$이므로 \$x-1\$을 인수로 갖는다. 조립제법으로 인수분해하면 \$\$P(x)=(x-1)(x^3-3x-2)\$\$ 다시 \$x=-1\$을 대입하면 \$(-1)^3-3(-1)-2=0\$이므로 \$\$x^3-3x-2=(x+1)(x^2-x-2)=(x+1)^2(x-2)\$\$ 따라서 \$\$P(x)=(x+1)^2(x-1)(x-2)\$\$ 이므로 \$x+1\$, \$x-2\$, \$x^2-1=(x+1)(x-1)\$, \$x^2+2x+1=(x+1)^2\$은 모두 인수이고, \$x^2+1\$은 인수가 아니다. 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q04", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "인수정리와 조립제법으로 사차다항식을 완전 인수분해한 뒤 각 선지의 인수 여부를 확인한다.", "decisiveStep": "P(x)=(x+1)^2(x-1)(x-2)로 분해하여 x^2+1이 인수가 아님을 판별한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 공통인수/단계적 인수분해"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사차식을 인수정리로 두 번 분해해 일차·이차 인수 조합을 대조하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "인수정리", "task": "인수판별", "given": "사차다항식", "condition": "NONE"}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.9

### 발문

다음 등식에서 다항식 \$A\$를 \$f(x)\$, 다항식 \$B\$를 \$g(x)\$라 할 때, \$f(0)+g(1)\$의 값을 구하면? \$\$2x^3+5x^2+4x+3=\\left(x+\\dfrac{1}{2}\\right)A+2=(2x+1)B+2\$\$

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

주어진 등식의 각 변에서 \$2\$를 빼면 \$\$2x^3+5x^2+4x+1=\\left(x+\\dfrac{1}{2}\\right)A=(2x+1)B\$\$ 좌변을 인수분해하면 \$x=-\\dfrac{1}{2}\$일 때 \$0\$이므로 \$\$2x^3+5x^2+4x+1=(2x+1)(x^2+2x+1)=(2x+1)(x+1)^2\$\$ 따라서 \$B=g(x)=(x+1)^2\$이고, \$x+\\dfrac{1}{2}=\\dfrac{2x+1}{2}\$이므로 \$A=f(x)=2(x+1)^2\$이다. 그러므로 \$f(0)=2(1)^2=2\$, \$g(1)=(1+1)^2=4\$이고, \$\$f(0)+g(1)=2+4=6\$\$ 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q05", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "양변에서 상수 2를 뺀 다항식을 2x+1로 인수분해한 뒤 x+1/2=(2x+1)/2의 몫 관계로 f(x), g(x)를 복원한다.", "decisiveStep": "2x^3+5x^2+4x+1=(2x+1)(x+1)^2에서 g(x)=(x+1)^2, f(x)=2(x+1)^2임을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "다항식을 일차식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-005(DIRECT_ACTIVE): 다항식의 나눗셈/다항식을 일차식으로 나누기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공통 나머지 2를 이항해 인수분해하고 일차식 상수배 차이에 따른 몫 변화를 연결하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "다항식의나눗셈", "task": "함숫값합구하기", "given": "몫비교항등식", "condition": "NONE"}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.0

### 발문

다음에서 \$A+B\$의 값을 구하면? (가) \$x^2-4x+1=0\$일 때, 식 \$x^2+\\dfrac{1}{x^2}\$의 값은 \$A\$이다. (나) \$x=1-\\sqrt{3}\$, \$y=1+\\sqrt{3}\$일 때, 식 \$x^3-y^3\$의 값은 \$B\$이다.

### 선지

① \$14-12\\sqrt{3}\$ ② \$14+12\\sqrt{3}\$ ③ \$16-12\\sqrt{3}\$ ④ \$12-14\\sqrt{3}\$ ⑤ \$-14+12\\sqrt{3}\$

### 정답

①

### 해설

(가) \$x\\ne 0\$이므로 \$x^2-4x+1=0\$의 양변을 \$x\$로 나누면 \$x+\\dfrac{1}{x}=4\$이다. \$\$A=x^2+\\dfrac{1}{x^2}=\\left(x+\\dfrac{1}{x}\\right)^2-2=4^2-2=14\$\$ (나) \$x=1-\\sqrt{3}\$, \$y=1+\\sqrt{3}\$이므로 \$\$x-y=-2\\sqrt{3}, \\quad x+y=2, \\quad xy=1-3=-2\$\$ 따라서 \$x^2+xy+y^2=(x+y)^2-xy=4-(-2)=6\$이므로 \$\$B=x^3-y^3=(x-y)(x^2+xy+y^2)=(-2\\sqrt{3})\\times 6=-12\\sqrt{3}\$\$ 그러므로 \$A+B=14-12\\sqrt{3}\$이고, 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q06", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "방정식 양변을 x로 나누어 x+1/x=4를 구하고, 무리수 켤레쌍의 차·합·곱을 이용해 세제곱의 차를 계산한다.", "decisiveStep": "A=(x+1/x)^2-2=14와 B=(x-y){(x+y)^2-xy}=-12sqrt(3)을 각각 구해 합산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 다항식의 곱셈/곱셈공식"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "역수 대칭식 변형과 무리수 세제곱 차 공식 변형 두 독립 절차를 모두 계산해야 하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "곱셈공식의변형", "task": "식의값구하기", "given": "이차방정식과무리수쌍", "condition": "NONE"}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.5

### 발문

복소수 \$z=(3-i)x+3(1+i)\$에 대하여 복소수 \$z\$가 실수가 되도록 하는 실수 \$x\$의 값을 \$a\$라 하고, 복소수 \$z\$가 순허수가 되도록 하는 실수 \$x\$의 값을 \$b\$라 할 때, \$ab\$의 값을 구하면? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-1\$ ② \$-2\$ ③ \$-3\$ ④ \$1\$ ⑤ \$3\$

### 정답

③

### 해설

\$z\$를 실수부분과 허수부분으로 정리하면 \$\$z=(3x+3)+(-x+3)i\$\$ \$z\$가 실수이려면 허수부분이 \$0\$이어야 하므로 \$-x+3=0 \\implies a=3\$이다. \$z\$가 순허수이려면 실수부분이 \$0\$이고 허수부분이 \$0\$이 아니어야 하므로 \$3x+3=0 \\implies b=-1\$이다. (이때 허수부분은 \$4\\ne 0\$) 따라서 \$ab=3\\times(-1)=-3\$이므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q07", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "복소수 z를 실수부 (3x+3)과 허수부 (-x+3)으로 분리한 뒤 실수 조건과 순허수 조건을 적용한다.", "decisiveStep": "-x+3=0에서 a=3, 3x+3=0에서 b=-1을 구해 곱 -3을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-021(DIRECT_ACTIVE): 복소수의 뜻/실수부·허수부"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수를 실수부·허수부로 묶어 실수 조건과 순허수 조건 두 방정식을 푸는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "복소수의실수순허수조건", "task": "매개변수곱구하기", "given": "일차식계수복소수", "condition": "실수순허수조건"}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.8

### 발문

두 복소수 \$\\alpha\$, \$\\beta\$가 \$\\alpha=2+3i\$, \$\\beta=1+i\$일 때, \$\\alpha\\bar{\\beta}+\\bar{\\alpha}\\beta\$의 값을 구하면? (단, \$\\bar{\\alpha}\$, \$\\bar{\\beta}\$는 각각 \$\\alpha\$, \$\\beta\$의 켤레복소수이다.)

### 선지

① \$8\$ ② \$10\$ ③ \$12\$ ④ \$2i\$ ⑤ \$10+2i\$

### 정답

②

### 해설

\$\\bar{\\alpha}=2-3i\$, \$\\bar{\\beta}=1-i\$이므로 \$\$\\begin{aligned} \\alpha\\bar{\\beta} &= (2+3i)(1-i)=2-2i+3i-3i^2=5+i \\ \\bar{\\alpha}\\beta &= (2-3i)(1+i)=2+2i-3i-3i^2=5-i \\end{aligned}\$\$ 따라서 구하는 값은 \$\$\\alpha\\bar{\\beta}+\\bar{\\alpha}\\beta=(5+i)+(5-i)=10\$\$ 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q08", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "켤레복소수 bar(alpha), bar(beta)를 구해 alpha*bar(beta)와 bar(alpha)*beta를 전개한 뒤 더한다.", "decisiveStep": "(5+i)+(5-i)=10에서 허수부가 상쇄됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-021(DIRECT_ACTIVE): 복소수의 뜻/실수부·허수부"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레복소수 표현과 복소수 곱셈 두 번을 수행해 합산하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "켤레복소수의연산", "task": "식의값구하기", "given": "두복소수와켤레식", "condition": "NONE"}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.0

### 발문

이차식 \$f(x)\$가 모든 실수 \$x\$에 대하여 \$(x-2)^2f(x)=x^4-3x^3+2x^2+px+q\$를 만족시킬 때, 상수 \$p\$와 \$q\$에 대하여 \$p+q+f(1)\$의 값은?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

⑤

### 해설

우변의 최고차항 계수가 \$1\$이고 \$(x-2)^2\$의 최고차항 계수가 \$1\$이므로 \$f(x)=x^2+ax+b\$라 놓을 수 있다. 좌변을 전개하면 \$\$(x^2-4x+4)(x^2+ax+b)=x^4+(a-4)x^3+(b-4a+4)x^2+(4a-4b)x+4b\$\$ 우변과 동류항의 계수를 비교하면

- \$x^3\$의 계수: \$a-4=-3 \\implies a=1\$  
- \$x^2\$의 계수: \$b-4(1)+4=2 \\implies b=2\$

따라서 \$f(x)=x^2+x+2\$이고, \$p=4a-4b=4-8=-4\$, \$q=4b=8\$이다. \$f(1)=1+1+2=4\$이므로 \$\$p+q+f(1)=-4+8+4=8\$\$ 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q09", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "최고차항 계수가 1인 이차식 f(x)=x^2+ax+b를 설정해 좌변을 전개한 뒤 항등식 계수비교로 a, b, p, q를 순차 결정한다.", "decisiveStep": "x^3, x^2 계수 비교로 a=1, b=2를 먼저 확정하고 x, 상수항 계수로 p=-4, q=8을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 항등식/미정계수법"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미정 이차식 f(x)를 세워 네 차수의 계수를 순차 연립해 p, q와 f(1)을 구하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "항등식과다항식결정", "task": "식의값구하기", "given": "사차항등식과이차식", "condition": "항등식조건"}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 3.6

### 발문

이차함수 \$y=-x^2+6x+k\$의 그래프가 \$x\$축과 만나고, 직선 \$y=4x-2\$와는 만나지 않도록 하는 모든 정수 \$k\$의 값의 합을 구하면?

### 선지

① \$-30\$ ② \$-33\$ ③ \$-36\$ ④ \$-39\$ ⑤ \$-42\$

### 정답

④

### 해설

1) \$x\$축과 만나려면 방정식 \$-x^2+6x+k=0\$, 즉 \$x^2-6x-k=0\$이 실근을 가져야 하므로 \$\$\\dfrac{D\_1}{4}=(-3)^2-(-k)=9+k\\ge 0 \\implies k\\ge \-9\$\$  
2) 직선 \$y=4x-2\$와 만나지 않으려면 방정식 \$-x^2+6x+k=4x-2\$, 즉 \$x^2-2x-(k+2)=0\$이 실근을 갖지 않아야 하므로 \$\$\\dfrac{D\_2}{4}=(-1)^2-{-(k+2)}=k+3\<0 \\implies k\<-3\$\$ 따라서 \$-9\\le k\<-3\$을 만족시키는 정수 \$k\$는 \$-9, \-8, \-7, \-6, \-5, \-4\$이고, 그 합은 \$\$(-9)+(-8)+(-7)+(-6)+(-5)+(-4)=-39\$\$ 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-10", "subUnitKey": "H15-SA-10-PARALLEL_PERPENDICULAR", "conceptClusterKey": null, "primaryMethod": "x축 교점 조건 D_1>=0과 직선 비교점 조건 D_2<0을 각각 세워 공통 정수 k를 합산한다.", "decisiveStep": "9+k>=0과 k+3<0의 공통 범위 -9<=k<-3에서 정수 6개를 빠짐없이 더한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "직선의 방정식", "l3": "두 직선의 위치 관계", "l4": "교점"}, "ptTplCandidate": {"problemTypeKey": "PT_LINE_RELATION", "templateKey": "TPL_RELATION_MULTIPLE_POSITION", "why": "high1.json H1-RPM-063(DIRECT_ACTIVE): 두 직선의 위치 관계/교점"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 판별식 부등식의 공통 범위를 구해 정수의 합을 계산하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "이차함수와직선의위치관계", "task": "정수합구하기", "given": "이차함수와x축및직선", "condition": "위치관계조건"}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.0

### 발문

\$x\$의 값의 범위가 \$-1\\le x\\le 4\$일 때, 이차함수 \$y=x^2-2x+k\$의 최솟값은 \$3\$이다. 이 범위에서 이차함수의 최댓값을 구하면?

### 선지

① \$12\$ ② \$10\$ ③ \$8\$ ④ \$7\$ ⑤ \$15\$

### 정답

①

### 해설

\$\$y=x^2-2x+k=(x-1)^2+k-1\$\$ 구간 \$-1\\le x\\le 4\$에 꼭짓점의 \$x\$좌표 \$x=1\$이 포함되므로 최솟값은 \$k-1=3 \\implies k=4\$이다. 따라서 \$y=(x-1)^2+3\$이고, 양 끝점에서의 함숫값을 비교하면

- \$x=-1\$일 때: \$(-1-1)^2+3=7\$  
- \$x=4\$일 때: \$(4-1)^2+3=12\$

그러므로 최댓값은 \$12\$이고, 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "표준형 (x-1)^2+k-1에서 꼭짓점이 구간 안에 있음을 이용해 k=4를 구하고 양 끝점 함숫값을 비교한다.", "decisiveStep": "x=1에서 최솟값 k-1=3으로 k=4를 확정한 뒤 x=4에서 최댓값 12를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "꼭짓점이 포함된 닫힌 구간에서 최솟값으로 상수 k를 먼저 구하고 끝점 비교로 최댓값을 구하는 2단계 문항이다.", "level": "하", "item4slot": {"topic": "이차함수의최대최소", "task": "최댓값구하기", "given": "제한된범위이차함수", "condition": "최솟값조건"}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.2

### 발문

두 실수 \$a\$, \$b\$가 \$(a+2)^2+(b+3)^2=13\$, \$a+b=\\sqrt{13}\$을 만족시킬 때, \$(a+2)(b+3)=m+n\\sqrt{13}\$이라 하자. 이때 두 유리수 \$m\$, \$n\$에 대하여 \$m-n\$의 값을 구하면?

### 선지

① \$\\dfrac{11}{2}\$ ② \$\\dfrac{13}{2}\$ ③ \$\\dfrac{15}{2}\$ ④ \$\\dfrac{17}{2}\$ ⑤ \$\\dfrac{19}{2}\$

### 정답

③

### 해설

\$u=a+2\$, \$v=b+3\$이라 치환하면 \$u^2+v^2=13\$이고 \$\$u+v=(a+b)+5=5+\\sqrt{13}\$\$ 이다. \$(u+v)^2=u^2+v^2+2uv\$에 대입하면 \$\$(5+\\sqrt{13})^2=13+2uv \\implies 38+10\\sqrt{13}=13+2uv\$\$ \$\$2uv=25+10\\sqrt{13} \\implies uv=\\dfrac{25}{2}+5\\sqrt{13}\$\$ 유리수 \$m, n\$에 대하여 \$m=\\dfrac{25}{2}\$, \$n=5\$이므로 \$\$m-n=\\dfrac{25}{2}-5=\\dfrac{15}{2}\$\$ 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "u=a+2, v=b+3으로 치환해 u^2+v^2과 u+v로부터 곱 uv를 구한 뒤 무리수 상등으로 m, n을 분리한다.", "decisiveStep": "(5+sqrt(13))^2=13+2uv에서 uv=25/2+5sqrt(13)을 얻어 m-n=15/2를 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 다항식의 곱셈/곱셈공식"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 치환 후 곱셈공식 변형과 유리수·무리수 계수 비교까지 이어지는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "곱셈공식의변형", "task": "식의값구하기", "given": "제곱합과일차합", "condition": "유리수조건"}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.2

### 발문

이차방정식 \$x^2+mx+n=0\$의 두 근을 \$\\alpha\$, \$\\beta\$ (\$\\alpha\<\\beta\$)라 하면 이차방정식 \$4x^2+mx-1=0\$의 두 근은 \$\\alpha+2\$, \$-\\dfrac{1}{\\beta}\$일 때, 실수 \$m\$, \$n\$에 대하여 \$m+n\$의 값은?

### 선지

① \$-9\$ ② \$-7\$ ③ \$-5\$ ④ \$-3\$ ⑤ \$-1\$

### 정답

②

### 해설

첫째 이차방정식에서 근과 계수의 관계에 의하여 \$\\alpha+\\beta=-m\$, \$\\alpha\\beta=n\$이다. 둘째 이차방정식 \$4x^2+mx-1=0\$의 두 근이 \$\\alpha+2\$, \$-\\dfrac{1}{\\beta}\$이므로 두 근의 곱은 \$\$(\\alpha+2)\\left(-\\dfrac{1}{\\beta}\\right)=-\\dfrac{1}{4} \\implies \\beta=4(\\alpha+2)\$\$ 또한 두 근의 합은 \$-\\dfrac{m}{4}=\\dfrac{\\alpha+\\beta}{4}\$이므로 \$\$\\alpha+2-\\dfrac{1}{4(\\alpha+2)}=\\dfrac{\\alpha+4(\\alpha+2)}{4}=\\dfrac{5\\alpha+8}{4}\$\$ \$u=\\alpha+2\$라 치환하면 \$\\alpha=u-2\$이고 \$5\\alpha+8=5u-2\$이므로 \$\$u-\\dfrac{1}{4u}=\\dfrac{5u-2}{4}\$\$ 양변에 \$4u\$를 곱하여 정리하면 \$\$4u^2-1=5u^2-2u \\implies u^2-2u+1=0 \\implies (u-1)^2=0\$\$ 따라서 \$u=1\$, 즉 \$\\alpha=-1\$이고 \$\\beta=4(1)=4\$ (\$\\alpha\<\\beta\$ 만족)이다. 그러므로 \$m=-(-1+4)=-3\$, \$n=(-1)(4)=-4\$이고 \$\$m+n=-3+(-4)=-7\$\$ 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 이차방정식의 근과 계수의 관계로 beta=4(alpha+2)를 얻고, 합 관계식에 u=alpha+2를 대입해 이차방정식을 푼다.", "decisiveStep": "u-1/(4u)=(5u-2)/4를 정리해 완전제곱식 (u-1)^2=0에서 alpha=-1, beta=4를 확정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 근과 계수의 관계/근으로 방정식 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "변환된 근을 갖는 두 방정식의 근과 계수를 소거·치환하여 알파·베타를 역추적하는 4단계 문항이다.", "level": "상", "item4slot": {"topic": "이차방정식의근과계수", "task": "계수합구하기", "given": "근이변환된두이차방정식", "condition": "대소조건"}, "hold": "BINDING_GAP"}
```

## Q14

- 형식: 객관식  
- 배점: 4.3

### 발문

다항식 \$f(x)\$를 \$x^2+x+1\$로 나누었을 때의 몫이 \$Q\_1(x)\$, 나머지가 \$3x+4\$이고, \$Q\_1(x)\$를 \$x^2-x+1\$로 나누었을 때의 몫이 \$(x-1)Q\_2(x)\$, 나머지가 \$x-2\$이다. \$f(x)\$를 \$x^3-1\$로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(2)\$의 값을 구하면?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

⑤

### 해설

주어진 나눗셈 관계를 식으로 나타내면 \$\$\\begin{aligned} f(x) &= (x^2+x+1)Q\_1(x)+3x+4 \\ Q\_1(x) &= (x^2-x+1)(x-1)Q\_2(x)+x-2 \\end{aligned}\$\$ 둘째 식을 첫째 식에 대입하면 \$x^3-1=(x-1)(x^2+x+1)\$이므로 \$\$f(x)=(x^3-1)(x^2-x+1)Q\_2(x)+(x^2+x+1)(x-2)+3x+4\$\$ 뒤의 식을 전개하여 \$x^3-1\$로 묶으면 \$\$\\begin{aligned} (x^2+x+1)(x-2)+3x+4 &= (x^3-x^2-x-2)+3x+4 \\ &= x^3-x^2+2x+2 \\ &= (x^3-1)+(-x^2+2x+3) \\end{aligned}\$\$ 따라서 \$R(x)=-x^2+2x+3\$이고, 구하는 값은 \$\$R(2)=-4+4+3=3\$\$ 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "Q14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "Q_1(x) 식을 f(x)에 대입해 x^3-1=(x-1)(x^2+x+1) 인수를 분리한 뒤 남은 삼차식을 x^3-1로 다시 나눈다.", "decisiveStep": "x^3-x^2+2x+2에서 (x^3-1)을 덜어내 이차 나머지 R(x)=-x^2+2x+3을 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009(RPM_ONLY): 나머지정리/일차식으로 나눈 나머지"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중첩 나눗셈 항등식 대입과 x^3-1 인수 분리 및 잔여 삼차식 차수 내림이 결합된 4단계 문항이다.", "level": "상", "item4slot": {"topic": "나머지정리", "task": "나머지함숫값", "given": "중첩다항식나눗셈", "condition": "NONE"}, "hold": "RPM_ONLY"}
```

## Q15

- 형식: 객관식  
- 배점: 4.1

### 발문

함수 \$f(x)=\\begin{cases}x^2+4x+1 & (-2\\le x\\le 0\) \\ x^2-4x+1 & (0\<x\\le 2)\\end{cases}\$에 대하여 함수 \$y=-{f(x)}^2+4f(x)+1\$의 최댓값과 최솟값의 합은?

### 선지

① \$-10\$ ② \$-12\$ ③ \$-14\$ ④ \$-16\$ ⑤ \$-18\$

### 정답

④

### 해설

먼저 \$f(x)\$의 치역을 구하면

- \$-2\\le x\\le 0\$에서 \$f(x)=(x+2)^2-3\$이므로 \$-3\\le f(x)\\le 1\$  
- \$0\<x\\le 2\$에서 \$f(x)=(x-2)^2-3\$이므로 \$-3\\le f(x)\<1\$

따라서 \$t=f(x)\$라 치환하면 \$t\$의 범위는 \$-3\\le t\\le 1\$이다. 이제 \$\$y=-t^2+4t+1=-(t-2)^2+5\$\$ 에서 꼭짓점 \$t=2\$가 구간 \$\[-3, 1\]\$의 오른쪽 밖에 있으므로 \$t\$가 증가할수록 \$y\$도 증가한다.

- 최솟값: \$t=-3\$일 때 \$-(-3-2)^2+5=-20\$  
- 최댓값: \$t=1\$일 때 \$-(1-2)^2+5=4\$

구하는 합은 \$-20+4=-16\$이므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "Q15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "구간별 정의 함수 f(x)의 치역 -3<=t<=1을 먼저 구한 뒤 치환된 이차함수 y=-(t-2)^2+5의 최대·최소를 구한다.", "decisiveStep": "t의 범위 [-3, 1]이 꼭짓점 t=2의 왼쪽에 있으므로 양 끝점 t=-3, t=1에서 최소·최대가 발생함을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 이차함수의 치역 도출과 치환 후 꼭짓점 외부 구간의 최대·최소 판정을 연쇄 적용하는 4단계 문항이다.", "level": "상", "item4slot": {"topic": "합성함수의최대최소", "task": "최댓값최솟값합", "given": "구간별이차함수", "condition": "치환범위"}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.0

### 발문

\$x\$에 대한 사차방정식 \$x^4-(2a-1)x^2+a^2-a-6=0\$의 서로 다른 실근의 개수를 \$f(a)\$라 할 때, \$f(-1)+f(5)\$의 값을 구하면?

### 선지

① \$6\$ ② \$5\$ ③ \$4\$ ④ \$3\$ ⑤ \$2\$

### 정답

①

### 해설

\$y=x^2\$이라 치환하면 주어진 방정식은 \$\$y^2-(2a-1)y+(a-3)(a+2)=0 \\implies {y-(a-3)}{y-(a+2)}=0\$\$ 따라서 \$x^2=a-3\$ 또는 \$x^2=a+2\$이다.

- \$a=-1\$일 때: \$x^2=-4\$ (실근 없음) 또는 \$x^2=1\$ (\$x=\\pm 1\$)이므로 \$f(-1)=2\$  
- \$a=5\$일 때: \$x^2=2\$ (\$x=\\pm\\sqrt{2}\$) 또는 \$x^2=7\$ (\$x=\\pm\\sqrt{7}\$)이므로 \$f(5)=4\$

그러므로 \$f(-1)+f(5)=2+4=6\$이고, 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "Q16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "x^2=y로 치환해 (y-(a-3))(y-(a+2))=0으로 인수분해한 뒤 a=-1, a=5를 대입해 x^2=k의 실근 개수를 센다.", "decisiveStep": "a=-1에서 x^2=-4가 실근을 갖지 않음을 확인해 f(-1)=2, f(5)=4를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 공통인수/단계적 인수분해"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복이차식을 문자 포함 인수분해한 뒤 두 매개변수 값에 따른 실근 개수를 판정하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "복이차방정식", "task": "실근개수합", "given": "매개변수포함사차방정식", "condition": "NONE"}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.4

### 발문

실수가 아닌 복소수 \$z\$에 대하여 \$z+\\dfrac{1}{z}\$과 \$\\dfrac{z^2}{z-1}\$이 모두 실수일 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? (단, \$\\bar{z}\$는 \$z\$의 켤레복소수이다.) \<보기\> ㄱ. \$z\\bar{z}=1\$ ㄴ. \$z+\\bar{z}=-1\$ ㄷ. \$(z^4+2z^2)(z^2-2z)=3\$

### 선지

① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

③

### 해설

\$z=a+bi\$ (\$a, b\$는 실수)라 하면 \$z\$가 실수가 아니므로 \$b\\ne 0\$이다.

1) \$z+\\dfrac{1}{z}=\\left(a+\\dfrac{a}{a^2+b^2}\\right)+\\left(b-\\dfrac{b}{a^2+b^2}\\right)i\$가 실수이므로 허수부가 \$0\$이다. \$b\\ne 0\$이므로 \$a^2+b^2=1\$, 즉 \$z\\bar{z}=1\$이다. (ㄱ 참)  
2) \$\\bar{z}=\\dfrac{1}{z}\$이고 \$\\dfrac{z^2}{z-1}\$이 실수이므로 자신의 켤레복소수와 같다. \$\$\\dfrac{z^2}{z-1}=\\dfrac{\\bar{z}^2}{\\bar{z}-1}=\\dfrac{1/z^2}{1/z-1}=\\dfrac{1}{z(1-z)}\$\$ \$z^3(1-z)=z-1 \\implies (z-1)(z^3+1)=0\$이고 \$z\\ne 1\$이므로 \$z^3=-1\$이다. \$z\$가 실수가 아니므로 \$z\\ne \-1\$이고 \$z^2-z+1=0\$이다. 따라서 \$z+\\bar{z}=z+\\dfrac{1}{z}=1\$이므로 ㄴ은 거짓이다.  
3) \$z^3=-1\$, \$z^2-z+1=0\$에서 \$z^4=-z\$, \$z^2=z-1\$이므로 \$\$(z^4+2z^2)(z^2-2z)=(2z^2-z)(z^2-2z)=(z-2)(-z-1)=-z^2+z+2=-(z^2-z)+2=1+2=3\$\$ 이므로 ㄷ은 참이다. 따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "Q17", "variationType": "CONDITION", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "실수 조건(w=bar(w))을 연쇄 적용해 z*bar(z)=1과 z^3=-1을 도출한 뒤 z^2-z+1=0으로 식의 값을 판별한다.", "decisiveStep": "bar(z)=1/z을 이용해 z^2/(z-1)=1/(z(1-z))에서 z^3=-1과 z^2-z+1=0을 끌어낸다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-021(DIRECT_ACTIVE): 복소수의 뜻/실수부·허수부"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 5, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 복소분수식의 실수 조건으로부터 |z|=1과 z^3=-1을 연달아 유도하고 고차식을 차수 내림해야 하는 5단계 문항이다.", "level": "상", "item4slot": {"topic": "복소수의실수조건", "task": "참거짓판별", "given": "복소분수실수조건", "condition": "실수아닌복소수"}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.5

### 발문

\$-1\\le x\\le 1\$에서 이차함수 \$y=-x^2+6ax\$의 최댓값이 \$5\$일 때, 상수 \$a\$의 모든 값의 곱을 구하면?

### 선지

① \$-\\dfrac{4}{9}\$ ② \$-1\$ ③ \$-\\dfrac{16}{9}\$ ④ \$-\\dfrac{25}{9}\$ ⑤ \$0\$

### 정답

②

### 해설

\$y=-x^2+6ax=-(x-3a)^2+9a^2\$의 대칭축은 \$x=3a\$이다.

1) \$\|3a\|\\le 1\$, 즉 \$\|a\|\\le \\dfrac{1}{3}\$일 때: 꼭짓점이 구간 \$\[-1, 1\]\$에 포함되므로 최댓값은 \$9a^2\\le 1\$이 되어 \$5\$가 될 수 없다.  
2) \$3a\>1\$, 즉 \$a\>\\dfrac{1}{3}\$일 때: 구간 \$\[-1, 1\]\$에서 \$x\$가 커질수록 \$y\$가 커지므로 \$x=1\$에서 최댓값 \$-1+6a=5 \\implies a=1\$이다.  
3) \$3a\<-1\$, 즉 \$a\<-\\dfrac{1}{3}\$일 때: 구간 \$\[-1, 1\]\$에서 \$x\$가 작을수록 \$y\$가 커지므로 \$x=-1\$에서 최댓값 \$-1-6a=5 \\implies a=-1\$이다.

따라서 가능한 모든 \$a\$의 값의 곱은 \$1\\times(-1)=-1\$이므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "Q18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "대칭축 x=3a와 구간 [-1, 1]의 위치 관계를 세 구간으로 분류하여 최댓값 5 조건을 푼다.", "decisiveStep": "|a|<=1/3에서는 최댓값 9a^2<=1이라 불가함을 확인하고 양 끝점 x=±1에서 a=±1을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미정 대칭축의 구간 위치에 따른 3분류와 각 구간의 최댓값 조건 검산이 필요한 4단계 문항이다.", "level": "상", "item4slot": {"topic": "이차함수의최대최소", "task": "매개변수곱구하기", "given": "미정축이차함수와닫힌구간", "condition": "최댓값조건"}, "hold": ""}
```

## Q19

- 형식: 단답형  
- 배점: 4

### 발문

삼차방정식 \$x^3-(2a+1)x^2+ax+a=0\$이 중근과 다른 한 실근을 갖도록 하는 모든 실수 \$a\$의 값의 합을 구하시오.

### 선지

없음

### 정답

\$-\\dfrac{2}{3}\$

### 해설

중근을 \$r\$, 다른 한 실근을 \$s\$ (\$r\\ne s\$)라 하면 \$\$x^3-(2a+1)x^2+ax+a=(x-r)^2(x-s)=x^3-(2r+s)x^2+(r^2+2rs)x-r^2s\$\$ 양변의 계수를 비교하면 \$\$2r+s=2a+1, \\quad r^2+2rs=a, \\quad \-r^2s=a\$\$ 뒤의 두 식에서 \$r^2+2rs=-r^2s \\implies r(r+2s+rs)=0\$이다.

1) \$r=0\$일 때: \$a=0\$이고 방정식은 \$x^2(x-1)=0\$이므로 중근 \$0\$과 다른 실근 \$1\$을 갖는다.  
2) \$r\\ne 0\$일 때: \$r+s(r+2)=0 \\implies s=-\\dfrac{r}{r+2}\$, \$a=-r^2s=\\dfrac{r^3}{r+2}\$이다. 이를 첫째 식 \$2r+s=2a+1\$에 대입해 양변에 \$r+2\$를 곱하면 \$\$2r(r+2)-r=2r^3+(r+2) \\implies 2r^3-2r^2-2r+2=0 \\implies 2(r-1)^2(r+1)=0\$\$  
- \$r=1\$이면 \$s=-\\dfrac{1}{3}\$, \$a=\\dfrac{1}{3}\$ (중근 \$1\$, 다른 실근 \$-\\dfrac{1}{3}\$)  
- \$r=-1\$이면 \$s=1\$, \$a=-1\$ (중근 \$-1\$, 다른 실근 \$1\$)

따라서 가능한 모든 실수 \$a\$의 값의 합은 \$0+\\dfrac{1}{3}+(-1)=-\\dfrac{2}{3}\$이다.

```
"NONE"
```

```
{"sourceQid": "Q19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "(x-r)^2(x-s) 전개식과의 계수비교로 r(r+2s+rs)=0을 얻어 r=0과 r!=0으로 분기해 r, a를 구한다.", "decisiveStep": "s=-r/(r+2), a=r^3/(r+2)를 2r+s=2a+1에 대입해 2(r-1)^2(r+1)=0을 푼다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 근과 계수의 관계/근으로 방정식 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식의 중근·단근 형태를 세 근과 계수로 세운 뒤 소거해 3차 방정식까지 풀어야 하는 4단계 문항이다.", "level": "상", "item4slot": {"topic": "삼차방정식의중근", "task": "매개변수합구하기", "given": "삼차방정식", "condition": "중근과다른한실근"}, "hold": "BINDING_GAP"}
```

## Q20

- 형식: 단답형  
- 배점: 4

### 발문

두 복소수 \$z\_1=\\dfrac{-1+\\sqrt{3}i}{2}\$, \$z\_2=\\dfrac{1-i}{\\sqrt{2}}\$일 때, \$z\_1^n=z\_2^n=1\$을 만족시키는 \$200\$ 이하의 자연수 \$n\$의 개수를 구하시오. (단, \$i=\\sqrt{-1}\$)

### 선지

없음

### 정답

\$8\$

### 해설

\$z\_1=\\dfrac{-1+\\sqrt{3}i}{2}\$에 대하여 \$z\_1^2=\\dfrac{-1-\\sqrt{3}i}{2}\$, \$z\_1^3=1\$이므로 \$z\_1^n=1\$을 만족시키는 자연수 \$n\$은 \$3\$의 배수이다. \$z\_2=\\dfrac{1-i}{\\sqrt{2}}\$에 대하여 \$z\_2^2=-i\$, \$z\_2^4=-1\$, \$z\_2^8=1\$이므로 \$z\_2^n=1\$을 만족시키는 자연수 \$n\$은 \$8\$의 배수이다. 따라서 \$z\_1^n=z\_2^n=1\$을 동시에 만족시키는 자연수 \$n\$은 \$3\$과 \$8\$의 최소공배수인 \$24\$의 배수이다. \$200\$ 이하의 \$24\$의 배수는 \$24\\times 1, 24\\times 2, \\cdots, 24\\times 8\$이므로 모두 \$8\$개이다.

```
"NONE"
```

```
{"sourceQid": "Q20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "z_1의 주기 3과 z_2의 주기 8을 구한 뒤 최소공배수 24의 배수 개수를 200 이하에서 센다.", "decisiveStep": "z_1^3=1과 z_2^8=1로부터 lcm(3,8)=24의 배수 8개를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): i의 거듭제곱/주기성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 복소수의 최소 주기를 각각 구해 최소공배수 조건으로 개수를 세는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "복소수의거듭제곱", "task": "자연수개수구하기", "given": "두복소수의거듭제곱등식", "condition": "200이하자연수"}, "hold": ""}
```

## Q21

- 형식: 서술형  
- 배점: 7

### 발문

다항식 \$P(x)\$를 \$x-2\$로 나누었을 때 나머지가 \$13\$이고, \$x+1\$로 나누었을 때 나머지가 \$4\$이다. \$P(x)\$를 \$(x-2)(x+1)\$로 나누었을 때 몫을 \$Q(x)\$, 나머지를 \$R(x)\$라 하자. 이때, \$R(0)\$을 구하시오.

### 선지

없음

### 정답

\$7\$

### 해설

\$P(x)\$를 이차식 \$(x-2)(x+1)\$로 나누었을 때의 나머지 \$R(x)\$는 일차 이하의 다항식이므로 \$R(x)=ax+b\$ (\$a, b\$는 상수)라 하자. \$\$P(x)=(x-2)(x+1)Q(x)+ax+b\$\$ 나머지정리에 의하여 \$P(2)=13\$, \$P(-1)=4\$이므로 \$\$2a+b=13, \\quad \-a+b=4\$\$ 두 식을 빼면 \$3a=9 \\implies a=3\$이고, \$b=4+3=7\$이다. 따라서 \$R(x)=3x+7\$이므로 \$R(0)=7\$이다.

```
"NONE"
```

```
{"sourceQid": "Q21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지 R(x)=ax+b를 설정하고 나머지정리 P(2)=13, P(-1)=4를 연립해 R(0)=b를 구한다.", "decisiveStep": "2a+b=13과 -a+b=4를 연립해 b=7을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": null, "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 나머지정리/고차식 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차 나머지 두 개를 연립해 이차식으로 나눈 나머지의 상수항을 구하는 기본 2단계 문항이다.", "level": "하", "item4slot": {"topic": "나머지정리", "task": "나머지상수항구하기", "given": "두일차식나머지조건", "condition": "NONE"}, "hold": ""}
```

## Q22

- 형식: 서술형  
- 배점: 7

### 발문

이차함수 \$y=x^2+ax-2a-13\$의 그래프는 \$a\$의 값에 관계없이 항상 점 \$P\$를 지난다. 다음 물음에 답하시오. (단, \$a\$는 실수) (1) 점 \$P\$의 좌표를 구하시오. (2) 점 \$P\$가 이 이차함수의 꼭짓점일 때, 이 이차함수의 \$x\$절편을 모두 구하시오.

### 선지

없음

### 정답

(1) \$(2, \-9)\$ (2) \$-1, 5\$

### 해설

(1) 주어진 식을 \$a\$에 대하여 정리하면 \$\$y=x^2-13+a(x-2)\$\$ \$a\$의 값에 관계없이 항상 지나는 점의 좌표는 \$a\$의 계수가 \$0\$일 때이므로 \$x-2=0 \\implies x=2\$이다. 이때 \$y=2^2-13=-9\$이므로 점 \$P\$의 좌표는 \$(2, \-9)\$이다.

(2) 점 \$P(2, \-9)\$가 꼭짓점이면 꼭짓점의 \$x\$좌표 \$-\\dfrac{a}{2}=2\$이므로 \$a=-4\$이다. 따라서 이차함수는 \$y=x^2-4x-5\$이고, \$x\$절편은 \$y=0\$일 때의 \$x\$값이므로 \$\$x^2-4x-5=(x+1)(x-5)=0 \\implies x=-1 \\text{ 또는 } x=5\$\$ 그러므로 구하는 \$x\$절편은 \$-1, 5\$이다.

```
"NONE"
```

```
{"sourceQid": "Q22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "식을 a에 대해 정리해 정점 P(2,-9)를 구한 뒤 꼭짓점 조건 -a/2=2로 함수를 확정해 x절편을 구한다.", "decisiveStep": "a(x-2)+(x^2-13-y)=0에서 P(2,-9)를 찾고 -a/2=2에서 a=-4를 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "매개변수 항등식으로 정점을 찾고 꼭짓점 조건을 연결해 x절편까지 구하는 3단계 문항이다.", "level": "중", "item4slot": {"topic": "이차함수의그래프", "task": "정점과절편구하기", "given": "매개변수포함이차함수", "condition": "꼭짓점일치조건"}, "hold": ""}
```

## Q23

- 형식: 서술형  
- 배점: 7

### 발문

함수 \$f(x)=\\begin{cases}2x^2+2x & (x\\le \-1) \\ \-x^2-x & (x\>-1)\\end{cases}\$의 그래프와 직선 \$y=mx+3m-1\$이 서로 다른 세 점에서 만나도록 하는 상수 \$m\$의 값의 범위를 구하시오.

### 선지

없음

### 정답

\$m\<-10-2\\sqrt{26}\$ 또는 \$\\dfrac{1}{2}\<m\<5-2\\sqrt{5}\$

### 해설

\$t=x+1\$이라 두면 \$x\\le \-1\$은 \$t\\le 0\$, \$x\>-1\$은 \$t\>0\$이다.

1) \$x\\le \-1\$ (\$t\\le 0\$) 구간: \$2x^2+2x=2t^2-2t\$이고, \$mx+3m-1=mt+2m-1\$이므로 교점 방정식은 \$\$2t^2-(m+2)t+(1-2m)=0\$\$ 판별식은 \$D\_L=(m+2)^2-8(1-2m)=m^2+20m-4\$이고, 두 근의 합은 \$\\dfrac{m+2}{2}\$, 곱은 \$\\dfrac{1-2m}{2}\$이다.  
- \$m\<-10-2\\sqrt{26}\$이면 \$D\_L\>0\$, 합 \$\<0\$, 곱 \$\>0\$이므로 \$t\<0\$인 근이 \$2\$개이다.  
- \$m=-10-2\\sqrt{26}\$이면 \$t\<0\$인 중근 \$1\$개이다.  
- \$-10-2\\sqrt{26}\<m\<\\dfrac{1}{2}\$이면 \$t\\le 0\$인 실근이 \$0\$개이다.  
- \$m\\ge \\dfrac{1}{2}\$이면 곱 \$\\le 0\$이므로 \$t\\le 0\$인 실근이 \$1\$개이다.  
2) \$x\>-1\$ (\$t\>0\$) 구간: \$-x^2-x=-t^2+t\$이므로 교점 방정식은 \$\$t^2+(m-1)t+(2m-1)=0\$\$ 판별식은 \$D\_R=(m-1)^2-4(2m-1)=m^2-10m+5\$이고, 두 근의 합은 \$1-m\$, 곱은 \$2m-1\$이다.  
- \$m\\le \\dfrac{1}{2}\$이면 곱 \$\\le 0\$이므로 \$t\>0\$인 실근이 \$1\$개이다.  
- \$\\dfrac{1}{2}\<m\<5-2\\sqrt{5}\$이면 \$D\_R\>0\$, 합 \$\>0\$, 곱 \$\>0\$이므로 \$t\>0\$인 근이 \$2\$개이다.  
- \$m=5-2\\sqrt{5}\$이면 \$t\>0\$인 중근 \$1\$개, \$m\>5-2\\sqrt{5}\$이면 \$0\$개이다.

두 구간의 교점 개수의 합이 \$3\$이 되는 경우는 \$(2+1)\$개 또는 \$(1+2)\$개이므로 \$\$m\<-10-2\\sqrt{26} \\quad \\text{또는} \\quad \\dfrac{1}{2}\<m\<5-2\\sqrt{5}\$\$

```
"NONE"
```

```
{"sourceQid": "Q23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "구간 경계 x=-1을 t=x+1로 평행이동하여 t<=0과 t>0 각 구간에서 판별식과 근의 부호로 교점 개수를 합산한다.", "decisiveStep": "왼쪽(t<=0) 2개+오른쪽(t>0) 1개인 m<-10-2sqrt(26)과 왼쪽 1개+오른쪽 2개인 1/2<m<5-2sqrt(5)를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 직선과 포물선/교점 개수"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 5, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 두 이차함수와 직선의 교점을 t=x+1 치환 후 양·음근 개수 분류로 합산하는 5단계 최고난도 문항이다.", "level": "상", "item4slot": {"topic": "이차함수와직선의교점개수", "task": "기울기범위구하기", "given": "구간별이차함수와직선", "condition": "교점3개조건"}, "hold": ""}
```

