

```
{"stem": "21_매산여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/21_매산여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100.7, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.9

### 발문

다항식 \$x^3+4x^2+5x+3\$을 \$x^2+x-2\$로 나누었을 때 몫을 \$Q(x)\$, 나머지를 \$R(x)\$라 할 때, \$Q(1)+R(-1)\$의 값을 구하시오.

### 선지

① \$9\$ ② \$7\$ ③ \$8\$ ④ \$10\$ ⑤ \$11\$

### 정답

①

### 해설

다항식의 직접 나눗셈을 수행하면 \$\$ x^3+4x^2+5x+3 \= (x^2+x-2)(x+3)+(4x+9) \$\$ 이므로 \$Q(x)=x+3\$, \$R(x)=4x+9\$이다. 따라서 \$Q(1)=1+3=4\$, \$R(-1)=-4+9=5\$이므로 \$Q(1)+R(-1)=4+5=9\$이다.

```
{"status": "EXEMPT", "reason": "삼차다항식을 이차다항식으로 나눈 몫과 나머지를 구하는 순수 연산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "다항식 $x^3+4x^2+5x+3$을 $x^2+x-2$로 직접 나누어 $Q(x)=x+3$, $R(x)=4x+9$를 구한 뒤 대입한다.", "decisiveStep": "직접 나눗셈으로 몫과 일차 나머지 $4x+9$를 정확히 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 삼차다항식을 이차다항식으로 직접 나누어 몫 Q(x)와 나머지 R(x)를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 직접 나눗셈과 함숫값 대입을 바로 수행하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫을 $Q(x)$, 나머지를 $R(x)$"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "다항식의 직접 나눗셈을 수행하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^3+4x^2+5x+3$"}], "condition": []}, "reasons": {"method": "다항식의 직접 나눗셈으로 Q(x), R(x)를 구해 Q(1)+R(-1)을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.9

### 발문

등식 \$x^3+5x^2+7x+4=a(x-1)^3+b(x-1)^2+c(x-1)+d\$가 \$x\$의 값에 관계없이 항상 성립할 때, \$a+b-c+d\$의 값을 구하시오.

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$8\$ ⑤ \$10\$

### 정답

③

### 해설

\$x=1\$로 조립제법을 연속 적용하면

- \$1\$차: 몫 \$x^2+6x+13\$, 나머지 \$17 \\implies d=17\$  
- \$2\$차: 몫 \$x+7\$, 나머지 \$20 \\implies c=20\$  
- \$3\$차: 몫 \$1\$, 나머지 \$8 \\implies b=8, a=1\$ 따라서 \$a+b-c+d=1+8-20+17=6\$이다.

```
{"status": "EXEMPT", "reason": "(x-1) 거듭제곱 전개 항등식에서 연속 조립제법으로 계수를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$x=1$로 연속 조립제법을 수행해 $a=1, b=8, c=20, d=17$을 구한 뒤 $a+b-c+d$를 계산한다.", "decisiveStep": "조립제법의 각 단계 나머지가 $d, c, b, a$ 순으로 대응됨을 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): (x-1)의 거듭제곱 내림차순 항등식에서 연속 조립제법으로 미정계수를 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$(x-1)$ 내림차순 항등식을 연속 조립제법으로 구하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "나머지 $17 \\implies d=17$"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "조립제법을 연속 적용하면", "evidenceType": "IMPLIED", "justification": "x=1로 조립제법을 세 번 연속 수행해 (x-1) 거듭제곱의 계수를 구함"}], "given": [{"term": "등식", "src": "stem", "quote": "등식 $x^3+5x^2+7x+4="}], "condition": []}, "reasons": {"method": "x=1 연속 조립제법으로 계수 a, b, c, d를 구해 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 5

### 발문

\$x\$에 대한 다항식 \$f(x)\$를 \$x-2\$로 나누었을 때의 나머지는 \$12\$이고, \$(x+1)^2\$으로 나누었을 때의 나머지는 \$2x-1\$이다. \$f(x)\$를 \$(x+1)^2(x-2)\$로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(4)\$를 구하시오.

### 선지

① \$24\$ ② \$28\$ ③ \$30\$ ④ \$34\$ ⑤ \$32\$

### 정답

⑤

### 해설

\$f(x)\$를 삼차식 \$(x+1)^2(x-2)\$로 나눈 나머지 \$R(x)\$는 이차 이하의 다항식이고, \$(x+1)^2\$으로 나눈 나머지가 \$2x-1\$이어야 하므로 \$\$ R(x) \= a(x+1)^2+2x-1 \$\$ 이라 놓을 수 있다. 조건에서 \$f(2)=R(2)=12\$이므로 \$\$ a(2+1)^2+2(2)-1 \= 9a+3 \= 12 \\implies a=1 \$\$ 따라서 \$R(x)=(x+1)^2+2x-1=x^2+4x\$이고, \$R(4)=16+16=32\$이다.

```
{"status": "EXEMPT", "reason": "삼차식 (x+1)^2(x-2) 나눗셈 나머지를 a(x+1)^2+2x-1로 두고 f(2)=12로 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "이차 나머지 $R(x)=a(x+1)^2+2x-1$로 설정한 뒤 $f(2)=R(2)=12$를 대입해 $a=1$을 구한다.", "decisiveStep": "$(x+1)^2$으로 나눈 나머지 조건을 $R(x)=a(x+1)^2+2x-1$ 형태로 압축한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): (x+1)^2(x-2) 합성 제수로 나눈 나머지를 a(x+1)^2+2x-1로 두고 f(2)=12 조건을 결합하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱 인수를 포함한 삼차식 나눗셈 나머지의 미지수를 $a$ 하나로 줄여 푸는 대표 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 할 때"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "f(2)=R(2)=12$이므로", "evidenceType": "IMPLIED", "justification": "R(x)=a(x+1)^2+2x-1로 두고 나머지정리 f(2)=12를 대입해 a를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "R(x)=a(x+1)^2+2x-1 설정 후 f(2)=12를 대입해 R(4)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.3

### 발문

다음 중 다항식 \$(x+1)(x+2)(x+4)(x+8)+2x^2\$의 인수인 것을 고르시오.

### 선지

① \$x^2+6x+8\$ ② \$x^2+7x+8\$ ③ \$x^2+5x+8\$ ④ \$x^2+9x+8\$ ⑤ \$x^2+4x+8\$

### 정답

②

### 해설

상수항의 곱이 \$8\$로 같도록 두 개씩 짝지어 전개하면 \$\$ {(x+1)(x+8)}{(x+2)(x+4)}+2x^2 \= (x^2+9x+8)(x^2+6x+8)+2x^2 \$\$ \$x^2+8=t\$로 치환하면 \$\$ \\begin{aligned} (t+9x)(t+6x)+2x^2 &= t^2+15tx+56x^2 \\ &= (t+7x)(t+8x) \\ &= (x^2+7x+8)(x^2+8x+8) \\end{aligned} \$\$ 따라서 보기 중 인수인 것은 ② \$x^2+7x+8\$이다.

```
{"status": "EXEMPT", "reason": "상수항 곱이 같은 두 쌍으로 묶어 x^2+8을 치환해 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "상수항 곱이 $8$로 같은 쌍 $(x+1)(x+8)$과 $(x+2)(x+4)$를 전개해 $x^2+8=t$로 치환 인수분해한다.", "decisiveStep": "상수항 합이 아닌 상수항 곱이 같도록 짝지어 $x^2+8$을 공통부분으로 만든다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 상수항 곱이 같은 쌍을 전개해 공통부분 x^2+8을 치환하여 단계적으로 인수분해하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "네 일차식의 곱$+kx^2$ 꼴에서 상수항 곱이 같은 쌍을 치환해 인수분해하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "인수인 것을 고르시오"}], "method": [{"term": "치환", "src": "solution", "quote": "x^2+8=t$로 치환하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(x+1)(x+2)(x+4)(x+8)+2x^2$"}], "condition": []}, "reasons": {"method": "상수항 곱이 같은 쌍을 묶어 x^2+8을 치환해 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.6

### 발문

실수부분과 허수부분이 모두 \$0\$이 아닌 복소수 \$z\$에 대하여 다음에서 실수가 아닌 것을 모두 고르시오. (정답 2개)

### 선지

① \$z-\\overline{z}\$ ② \$z+\\overline{z}\$ ③ \$z\\overline{z}\$ ④ \$\\dfrac{z}{\\overline{z}}\$ ⑤ \$(2+z)(2+\\overline{z})\$

### 정답

①, ④

### 해설

\$z=a+bi\$ (\$a, b\$는 \$0\$이 아닌 실수)라 하면 \$\\overline{z}=a-bi\$이다.

- ① \$z-\\overline{z}=2bi\$ (\$b\\ne 0\$이므로 순허수, 실수 아님)  
- ② \$z+\\overline{z}=2a\$ (실수)  
- ③ \$z\\overline{z}=a^2+b^2\$ (실수)  
- ④ \$\\dfrac{z}{\\overline{z}}=\\dfrac{(a+bi)^2}{a^2+b^2}=\\dfrac{a^2-b^2+2abi}{a^2+b^2}\$ (\$ab\\ne 0\$이므로 허수, 실수 아님)  
- ⑤ \$(2+z)(2+\\overline{z})=4+2(z+\\overline{z})+z\\overline{z}=4+4a+a^2+b^2\$ (실수) 따라서 실수가 아닌 것은 ①, ④이다.

```
{"status": "EXEMPT", "reason": "복소수 z=a+bi와 켤레복소수의 연산 결과 중 허수부분이 0이 아닌 것을 고르는 순수 개념 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=a+bi$($ab\\ne 0$)와 $\\overline{z}=a-bi$를 대입해 허수부분이 남는 식 ①, ④를 판별한다.", "decisiveStep": "④에서 분모 실수화 후 분자의 허수부분 $2ab\\ne 0$임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 복소수 z와 켤레복소수의 사칙연산 결과가 실수인지 허수인지 판별하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 $z$와 $\\overline{z}$의 사칙연산 결과가 실수인지 허수인지 판별하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수가 &lt;u&gt;아닌&gt; 것을"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "\\overline{z}=a-bi$이다", "evidenceType": "IMPLIED", "justification": "z=a+bi와 켤레복소수 a-bi를 각 식에 대입해 허수부분의 0 여부를 판별함"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z$에 대하여"}], "condition": []}, "reasons": {"method": "z=a+bi와 켤레복소수를 대입해 허수부가 남는 ①, ④를 선택함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 5.1

### 발문

\$0\$이 아닌 실수 \$a\$, \$b\$에 대하여 옳은 것만을 \<보기\>에서 고르시오. \<보기\> ㄱ. \$ab\>0\$이면 \$\\sqrt{a}\\sqrt{b}=\\sqrt{ab}\$이다. ㄴ. \$0\<a\<b\$이면 \$\\dfrac{\\sqrt{b-a}}{\\sqrt{a-b}}-\\dfrac{\\sqrt{b}}{\\sqrt{-b}}=0\$이다. ㄷ. \$\\dfrac{\\sqrt{a}}{\\sqrt{b}}=-\\sqrt{\\dfrac{a}{b}}\$이면 \$\\sqrt{a}\\sqrt{a}+2\\sqrt{b}\$의 켤레복소수는 \$a-2\\sqrt{b}\$이다.

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

- ㄱ. \$a\<0, b\<0\$일 때 \$ab\>0\$이지만 \$\\sqrt{a}\\sqrt{b}=-\\sqrt{ab}\\ne\\sqrt{ab}\$이므로 거짓이다.  
- ㄴ. \$0\<a\<b\$이므로 \$b-a\>0, a-b\<0, b\>0, \-b\<0\$이다. 따라서 \$\$\\frac{\\sqrt{b-a}}{\\sqrt{a-b}}-\\frac{\\sqrt{b}}{\\sqrt{-b}} \= \\frac{\\sqrt{b-a}}{\\sqrt{b-a}i}-\\frac{\\sqrt{b}}{\\sqrt{b}i} \= \-i-(-i) \= 0\$\$ (참)  
- ㄷ. \$\\dfrac{\\sqrt{a}}{\\sqrt{b}}=-\\sqrt{\\dfrac{a}{b}}\$ (\$a, b\\ne 0\$)이므로 \$a\>0, b\<0\$이다. 따라서 \$\\sqrt{a}\\sqrt{a}+2\\sqrt{b}=a+2\\sqrt{-b}i\$이고, 그 켤레복소수는 \$a-2\\sqrt{-b}i=a-2\\sqrt{b}\$이다. (참) 따라서 옳은 것은 ㄴ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "음수의 제곱근 연산 부호 규칙과 켤레복소수 표현을 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "ㄱ의 $a,b<0$ 반례를 찾고, ㄴ과 ㄷ은 $a, b$의 부호에 따라 $\\sqrt{-k}=\\sqrt{k}i$로 바꾸어 계산한다.", "decisiveStep": "ㄷ에서 $a>0, b<0$이므로 $\\sqrt{b}$가 순허수이고 따라서 $\\overline{\\sqrt{b}}=-\\sqrt{b}$가 됨을 파악한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 음수의 제곱근 연산 부호 성질과 순허수 제곱근의 켤레복소수를 판별하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 제곱근 곱·나눗셈 성질과 순허수 제곱근의 켤레복소수를 결합한 고난도 개념 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "켤레복소수는 $a-2\\sqrt{b}$"}], "method": [{"term": "제곱근", "src": "solution", "quote": "\\sqrt{a}\\sqrt{b}=-\\sqrt{ab}", "evidenceType": "IMPLIED", "justification": "음수 제곱근의 부호 성질과 순허수 제곱근의 켤레복소수 성질을 적용함"}], "given": [{"term": "실수", "src": "stem", "quote": "$0$이 아닌 실수 $a$, $b$"}], "condition": []}, "reasons": {"method": "음수 제곱근 부호 성질과 순허수 켤레복소수로 ㄱ, ㄴ, ㄷ을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.2

### 발문

\$x\$에 대한 이차식 \$2cx+a(x^2-1)+b(x^2+1)\$이 완전제곱식일 때, \$a\$, \$b\$, \$c\$를 세 변의 길이로 하는 삼각형의 넓이를 구하시오. (단, \$a\$, \$b\$, \$c\$는 양수이다.)

### 선지

① \$ac\$ ② \$ab\$ ③ \$\\dfrac{1}{2}ac\$ ④ \$\\dfrac{1}{2}ab\$ ⑤ \$\\dfrac{1}{2}bc\$

### 정답

③

### 해설

주어진 식을 \$x\$에 대하여 내림차순 정리하면 \$\$ (a+b)x^2+2cx+(b-a) \$\$ 이 이차식이 완전제곱식이므로 판별식 \$D=0\$에서 \$\$ \\frac{D}{4} \= c^2-(a+b)(b-a) \= c^2-(b^2-a^2) \= 0 \\implies a^2+c^2 \= b^2 \$\$ 따라서 빗변의 길이가 \$b\$인 직각삼각형이므로 넓이는 \$\\dfrac{1}{2}ac\$이다.

```
{"status": "EXEMPT", "reason": "이차식의 완전제곱식 판별식 D=0으로 직각삼각형 변의 관계를 도출해 넓이를 구하는 순수 대수·기하 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "식을 $x$에 대해 정리한 뒤 완전제곱식 판별식 $D/4=c^2-(b^2-a^2)=0$으로 $a^2+c^2=b^2$을 얻어 직각삼각형 넓이를 구한다.", "decisiveStep": "판별식 $c^2-b^2+a^2=0$에서 빗변이 $b$이고 직각을 낀 두 변이 $a, c$임을 파악한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차식의 완전제곱식 조건에 판별식 D=0을 적용하여 삼각형 변의 관계와 넓이를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식 판별식 조건을 피타고라스 정리와 삼각형 넓이로 연결하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "넓이", "src": "stem", "quote": "삼각형의 넓이를 구하시오"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$에서", "evidenceType": "NAMED"}], "given": [{"term": "완전제곱식", "src": "stem", "quote": "완전제곱식일 때"}], "condition": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형이므로"}]}, "reasons": {"method": "완전제곱식 판별식 D=0으로 a^2+c^2=b^2을 도출해 넓이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.7

### 발문

이차방정식 \$x^2-4x-2=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라고 할 때, \$(\\alpha+1)(\\beta+1)\$의 값을 구하시오.

### 선지

① \$-1\$ ② \$1\$ ③ \$2\$ ④ \$5\$ ⑤ \$3\$

### 정답

⑤

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=4\$, \$\\alpha\\beta=-2\$이므로 \$\$ (\\alpha+1)(\\beta+1) \= \\alpha\\beta+(\\alpha+\\beta)+1 \= \-2+4+1 \= 3 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계로 합과 곱을 구해 전개식에 대입하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계 $\\alpha+\\beta=4, \\alpha\\beta=-2$를 $(\\alpha+1)(\\beta+1)=\\alpha\\beta+(\\alpha+\\beta)+1$에 대입한다.", "decisiveStep": "식을 전개해 합과 곱으로 바꾼 뒤 계수를 대입한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 이차방정식의 근과 계수의 관계로 두 근의 합과 곱을 구해 식의 값을 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계를 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-4x-2=0$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "대입", "src": "solution", "quote": "-2+4+1 = 3"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 합과 곱을 구해 전개식 값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q09

- 형식: 객관식  
- 배점: 4.9

### 발문

이차방정식 \$x^2-4x+2k-3=0\$이 서로 다른 두 실근을 갖도록 하는 자연수 \$k\$의 개수를 \$M\$, 이차방정식 \$2x^2-x+k+4=0\$이 서로 다른 두 허근을 갖도록 하는 정수 \$k\$의 최솟값을 \$m\$이라 할 때, \$Mm\$의 값은?

### 선지

① \$-6\$ ② \$-9\$ ③ \$-12\$ ④ \$-3\$ ⑤ \$-15\$

### 정답

②

### 해설

1) 첫째 방정식이 서로 다른 두 실근을 가지므로 \$\$ \\frac{D\_1}{4} \= (-2)^2-(2k-3) \= 7-2k \> 0 \\implies k \< \\frac{7}{2} \$\$ 만족하는 자연수 \$k\$는 \$1, 2, 3\$이므로 \$M=3\$이다.  
2) 둘째 방정식이 서로 다른 두 허근을 가지므로 \$\$ D\_2 \= (-1)^2-4\\cdot 2(k+4) \= \-8k-31 \< 0 \\implies k \> \-\\frac{31}{8}=-3.875 \$\$ 만족하는 정수 \$k\$의 최솟값은 \$m=-3\$이다. 따라서 \$Mm \= 3\\cdot(-3) \= \-9\$이다.

```
{"status": "EXEMPT", "reason": "두 이차방정식의 판별식 부등식을 각각 풀어 자연수 개수 M과 최소 정수 m을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "두 판별식 부등식 $7-2k>0$과 $-8k-31<0$을 각각 풀어 자연수 개수 $M=3$과 최소 정수 $m=-3$을 구한다.", "decisiveStep": "서로 다른 두 실근($D_1>0$)과 서로 다른 두 허근($D_2<0$)의 부등호 방향과 정수 경계를 정확히 센다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 서로 다른 두 실근(D>0)과 서로 다른 두 허근(D<0) 판별식 부등식을 풀어 미정계수 범위를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차방정식의 판별식 부등식을 연이어 풀어 정수·자연수 조건을 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $k$의 최솟값을 $m$"}], "method": [{"term": "판별식", "src": "solution", "quote": "\\frac{D_1}{4} = (-2)^2-(2k-3)", "evidenceType": "IMPLIED", "justification": "서로 다른 두 실근(D1>0)과 두 허근(D2<0) 판별식 부등식을 각각 풀어 M, m을 구함"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-4x+2k-3=0$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $k$의 개수를 $M$"}]}, "reasons": {"method": "두 방정식의 판별식 부등식으로 M=3, m=-3을 구해 곱함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.1

### 발문

이차방정식 \$x^2+ax+18=0\$의 두 근의 차가 \$3\$이고 두 근이 모두 음수일 때, 실수 \$a\$의 값을 구하시오.

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$11\$

### 정답

④

### 해설

두 근을 \$\\alpha, \\beta\$라 하면 근과 계수의 관계에 의해 \$\\alpha+\\beta=-a\$, \$\\alpha\\beta=18\$이다. \$\|\\alpha-\\beta\|=3\$이므로 양변을 제곱하면 \$\$ (\\alpha+\\beta)^2-4\\alpha\\beta \= (-a)^2-4\\cdot 18 \= 9 \\implies a^2 \= 81 \\implies a \= \\pm 9 \$\$ 두 근이 모두 음수이므로 \$\\alpha+\\beta=-a\<0\$, 즉 \$a\>0\$이다. 따라서 \$a=9\$이다.

```
{"status": "EXEMPT", "reason": "두 근의 차 제곱 공식과 두 근 음수 조건으로 계수 a의 부호를 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta$로 $a^2=81$을 구한 뒤 두 근이 모두 음수인 조건 $-a<0$으로 $a=9$를 고른다.", "decisiveStep": "두 근이 모두 음수이므로 합 $\\alpha+\\beta=-a<0$에서 $a>0$을 확정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계와 두 근의 차·부호 조건으로 계수를 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계, 곱셈 공식 변형, 근의 부호 조건을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$의 값을 구하시오"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+ax+18=0$"}], "condition": []}, "reasons": {"method": "두 근의 차 제곱과 두 근 음수 조건으로 a=9를 확정함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q11

- 형식: 객관식  
- 배점: 3.4

### 발문

이차함수 \$y=x^2+4x+k\$의 그래프가 \$x\$축과 만나도록 하는 상수 \$k\$의 값의 범위를 구하시오.

### 선지

① \$k\\le 4\$ ② \$k\<4\$ ③ \$k\\le 2\$ ④ \$k\<2\$ ⑤ \$k\\ge 4\$

### 정답

①

### 해설

이차함수 그래프가 \$x\$축과 만나려면 이차방정식 \$x^2+4x+k=0\$이 실근을 가져야 하므로 \$\$ \\frac{D}{4} \= 2^2-k \= 4-k \\ge 0 \\implies k \\le 4 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차함수가 x축과 만날 조건 D>=0을 바로 적용하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "이차방정식 $x^2+4x+k=0$의 판별식 $D/4=4-k\\ge 0$을 풀어 $k\\le 4$를 구한다.", "decisiveStep": "'$x$축과 만난다'는 조건에 접하는 경우를 포함해 $D\\ge 0$을 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): 이차함수 그래프가 x축과 만날 조건을 판별식 D>=0으로 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 $x$축이 만날 조건을 판별식 부등식으로 바로 푸는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $k$의 값의 범위"}], "method": [{"term": "판별식", "src": "solution", "quote": "\\frac{D}{4} = 2^2-k = 4-k \\ge 0", "evidenceType": "IMPLIED", "justification": "x축과 만날 조건에 판별식 D/4>=0을 적용함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+4x+k$"}], "condition": []}, "reasons": {"method": "판별식 D/4>=0을 적용해 k<=4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.4

### 발문

삼각형의 세 변의 길이가 \$a\$, \$b\$, \$c\$일 때, \$(a-c)b^2+(2a^2-ac-c^2)b+a^3-ac^2=0\$이 성립한다. 이 삼각형은 어떤 삼각형인가?

### 선지

① \$a=b\$인 이등변삼각형 ② \$b=c\$인 이등변삼각형 ③ \$a=c\$인 이등변삼각형 ④ 정삼각형 ⑤ 빗변의 길이가 \$a\$인 직각삼각형

### 정답

③

### 해설

주어진 식을 \$b\$에 대하여 내림차순으로 정리된 각 계수를 인수분해하면 \$\$ (a-c)b^2+(a-c)(2a+c)b+a(a-c)(a+c) \= 0 \$\$ 공통인수 \$(a-c)\$로 묶으면 \$\$ (a-c){b^2+(2a+c)b+a(a+c)} \= (a-c)(b+a)(b+a+c) \= 0 \$\$ \$a, b, c\$는 삼각형의 세 변의 길이로 모두 양수이므로 \$b+a\>0\$, \$b+a+c\>0\$이다. 따라서 \$a-c=0\$, 즉 \$a=c\$인 이등변삼각형이다.

```
{"status": "EXEMPT", "reason": "삼각형 세 변 관계식을 내림차순 공통인수로 인수분해해 이등변삼각형을 판별하는 순수 대수·기하 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "각 계수에서 공통인수 $(a-c)$를 추출해 $(a-c)(b+a)(b+a+c)=0$으로 인수분해하고 변의 길이 양수 조건으로 $a=c$를 도출한다.", "decisiveStep": "$2a^2-ac-c^2=(a-c)(2a+c)$와 $a^3-ac^2=a(a-c)(a+c)$에서 $(a-c)$를 묶어낸다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-020(DIRECT_ACTIVE): 세 변의 길이에 대한 관계식을 공통인수 (a-c)로 인수분해해 삼각형 모양을 판별하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다문자 고차식의 공통인수 추출 인수분해로 삼각형의 모양을 판별하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이등변삼각형", "src": "solution", "quote": "a=c$인 이등변삼각형"}], "method": [{"term": "인수분해", "src": "solution", "quote": "각 계수를 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형의 세 변의 길이"}], "condition": []}, "reasons": {"method": "공통인수 (a-c)로 인수분해 후 양수 조건으로 a=c 이등변삼각형을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.2

### 발문

유리수 \$a\$, \$b\$, \$c\$에 대하여 이차함수 \$y=x^2+ax\$의 그래프와 직선 \$y=bx-c\$가 만나는 두 점을 \$P\$, \$Q\$라 하자. 직선 \$y=bx-c\$가 두 점 \$(0, \-3)\$, \$(1, 0)\$을 지나고, 점 \$P\$, \$Q\$의 \$x\$좌표의 합이 \$5\$일 때, \$a+b+c\$의 값은?

### 선지

① \$-2\$ ② \$0\$ ③ \$2\$ ④ \$6\$ ⑤ \$4\$

### 정답

⑤

### 해설

직선 \$y=bx-c\$가 두 점 \$(0, \-3), (1, 0)\$을 지나므로 대입하면 \$\$ \-c=-3 \\implies c=3, \\qquad b-3=0 \\implies b=3 \$\$ 직선 \$y=3x-3\$과 이차함수 \$y=x^2+ax\$의 교점의 \$x\$좌표는 \$x^2+(a-3)x+3=0\$의 두 근이다. 두 교점의 \$x\$좌표의 합이 \$5\$이므로 근과 계수의 관계에 의해 \$\$ \-(a-3) \= 5 \\implies a \= \-2 \$\$ 따라서 \$a+b+c \= \-2+3+3 \= 4\$이다.

```
{"status": "EXEMPT", "reason": "두 점을 지나는 직선의 방정식을 구한 뒤 포물선과의 교점 x좌표 합으로 a를 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 점 $(0, -3), (1, 0)$으로 직선 $y=3x-3$($b=3, c=3$)을 구하고 연립방정식 $x^2+(a-3)x+3=0$의 두 근의 합 $3-a=5$로 $a=-2$를 구한다.", "decisiveStep": "두 교점 $P, Q$의 $x$좌표의 합을 연립방정식 근과 계수의 관계 $3-a=5$로 연결한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 직선 결정 후 포물선과 직선의 교점 x좌표 합을 연립방정식의 근과 계수의 관계로 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선 결정과 이차함수·직선 교점 $x$좌표 합(근과 계수의 관계)을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "유리수", "src": "stem", "quote": "유리수 $a$, $b$, $c$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의해", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+ax$"}], "condition": [{"term": "교점", "src": "solution", "quote": "교점의 $x$좌표는"}]}, "reasons": {"method": "두 점으로 직선 식을 구한 뒤 연립방정식 근과 계수의 관계로 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.1

### 발문

길이가 \$12\\text{cm}\$인 막대 \$10\$개를 빈틈없이 연결하여 만들 수 있는 직사각형의 최대 넓이를 구하시오. (단, 막대의 모양은 변형할 수 없고, 막대의 두께는 생각하지 않는다.)

### 선지

① \$900\$ ② \$864\$ ③ \$840\$ ④ \$720\$ ⑤ \$960\$

### 정답

②

### 해설

막대를 자르거나 구부릴 수 없으므로 가로와 세로에 사용한 막대의 개수를 각각 \$m, n\$ (\$m, n\$은 자연수)이라 하면 \$\$ 2(m+n)=10 \\implies m+n=5 \$\$ 직사각형의 넓이는 \$(12m)\\cdot(12n)=144mn=144m(5-m)\$이다. \$m\$이 자연수이고 \$1\\le m\\le 4\$일 때

- \$m=1, 4\$일 때 \$mn=4\$  
- \$m=2, 3\$일 때 \$mn=6\$ 따라서 \$mn\$의 최댓값은 \$6\$이므로 최대 넓이는 \$144\\times 6=864\$이다.

```
{"status": "EXEMPT", "reason": "막대 개수의 자연수 제약 조건 m+n=5 아래 직사각형 넓이 144m(5-m)의 최댓값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "막대 변형 불가 조건으로 가로·세로 막대 수 $m+n=5$($m, n\\in\\mathbb{N}$)를 세워 $144m(5-m)$의 최댓값 $864$를 구한다.", "decisiveStep": "둘레 $120\\text{cm}$를 연속 실수가 아닌 막대 개수 자연수 $m+n=5$로 제한해 $m=2, n=3$을 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038(DIRECT_ACTIVE): 막대 개수의 자연수 제약 조건 m+n=5 아래 직사각형 넓이의 최댓값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실수 범위 최댓값($30\\times 30=900$) 함정을 피하고 이산 자연수 조건을 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "solution", "quote": "mn$의 최댓값은 $6$"}], "method": [{"term": "자연수", "src": "solution", "quote": "m, n$은 자연수", "evidenceType": "IMPLIED", "justification": "막대 변형 불가 조건으로 가로·세로 막대 개수를 자연수 m+n=5로 두어 최대 넓이를 구함"}], "given": [{"term": "직사각형", "src": "stem", "quote": "직사각형의 최대 넓이"}], "condition": []}, "reasons": {"method": "막대 개수 자연수 조건 m+n=5에서 최대 넓이 864를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.9

### 발문

방정식 \$x^2+x+1=0\$의 한 허근을 \$\\omega\$라 할 때, \$1+2\\omega+3\\omega^2+4\\omega^3+5\\omega^4+6\\omega^5+7\\omega^6+8\\omega^7=a+b\\omega\$를 만족시키는 두 실수 \$a\$, \$b\$에 대하여 \$a+b\$의 값을 구하시오.

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

④

### 해설

\$\\omega^2+\\omega+1=0\$이고 양변에 \$\\omega-1\$을 곱하면 \$\\omega^3-1=0 \\implies \\omega^3=1\$이다. 주어진 식을 \$\\omega^3=1\$을 이용해 차수를 낮추면 \$\$ \\begin{aligned} 1+2\\omega+3\\omega^2+4\\omega^3+5\\omega^4+6\\omega^5+7\\omega^6+8\\omega^7 &= (1+4+7)+(2+5+8)\\omega+(3+6)\\omega^2 \\ &= 12+15\\omega+9\\omega^2 \\ &= 12+15\\omega+9(-1-\\omega) \= 3+6\\omega \\end{aligned} \$\$ \$\\omega\$가 허수이고 \$a, b\$가 실수이므로 \$a=3, b=6\$, 따라서 \$a+b=9\$이다.

```
{"status": "EXEMPT", "reason": "x^2+x+1=0의 허근 ω의 성질 ω^3=1, ω^2=-1-ω로 다항식을 일차식으로 축소하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$\\omega^3=1$로 각 항을 $1, \\omega, \\omega^2$으로 모은 뒤 $\\omega^2=-1-\\omega$를 대입해 $3+6\\omega$로 정리한다.", "decisiveStep": "$\\omega^3=1$로 3항씩 주기를 맞춰 계수를 먼저 더하고 $\\omega^2=-1-\\omega$로 차수를 $1$차로 낮춘다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY): x^2+x+1=0의 허근 ω의 성질(ω^3=1, ω^2=-1-ω)을 활용해 고차식을 일차식으로 축소하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "방정식 $x^2+x+1=0$의 허근 $\\omega$로 다항식 차수를 축소해 실수 계수를 비교하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "두 실수 $a$, $b$에 대하여"}], "method": [{"term": "허근", "src": "stem", "quote": "한 허근을 $\\omega$라 할 때", "evidenceType": "IMPLIED", "justification": "ω^3=1과 ω^2=-1-ω를 적용해 고차식을 a+bω 형태로 차수 축소함"}], "given": [{"term": "방정식", "src": "stem", "quote": "방정식 $x^2+x+1=0$"}], "condition": []}, "reasons": {"method": "ω^3=1과 ω^2=-1-ω로 8항 합을 3+6ω로 축소해 a+b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q16

- 형식: 객관식  
- 배점: 3.7

### 발문

\$-1\\le x\\le 4\$일 때, 이차함수 \$f(x)=-x^2+2x+k\$의 최댓값과 최솟값의 합이 \$9\$이다. 이때 실수 \$k\$의 값을 구하시오.

### 선지

① \$8\$ ② \$4\$ ③ \$6\$ ④ \$10\$ ⑤ \$12\$

### 정답

①

### 해설

\$f(x)=-(x-1)^2+k+1\$은 위로 볼록하고 축이 \$x=1\$이다. 구간 \$-1\\le x\\le 4\$에 꼭짓점 \$x=1\$이 포함되므로

- 최댓값: \$f(1)=k+1\$  
- 최솟값: 축에서 더 먼 끝점 \$x=4\$에서 \$f(4)=-(4-1)^2+k+1=k-8\$ 최댓값과 최솟값의 합이 \$9\$이므로 \$(k+1)+(k-8)=2k-7=9 \\implies k=8\$이다.

```
{"status": "EXEMPT", "reason": "위로 볼록한 이차함수의 제한 범위 최대·최소 합으로 상수 k를 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$f(x)=-(x-1)^2+k+1$에서 구간 $[-1, 4]$의 최댓값 $f(1)=k+1$과 최솟값 $f(4)=k-8$을 더해 $k=8$을 구한다.", "decisiveStep": "꼭짓점 $x=1$에서 먼 끝점이 $x=4$임을 비교해 최솟값을 $f(4)$로 잡는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 제한 구간 [-1, 4]에서 이차함수의 최댓값과 최솟값의 합 조건으로 미정 상수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한 범위가 주어진 이차함수의 최대·최소 합 조건으로 미정 상수를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값의 합이 $9$"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=-x^2+2x+k$", "evidenceType": "IMPLIED", "justification": "표준형 변환으로 꼭짓점 x=1과 끝점 x=4의 최대·최소를 구해 합산함"}], "given": [{"term": "축", "src": "solution", "quote": "축이 $x=1$이다"}], "condition": []}, "reasons": {"method": "표준형 변환 후 [-1, 4]의 최대·최소 합이 9가 되는 k=8을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.3

### 발문

사차방정식 \$x^4-2x^2-9x+10=0\$은 두 개의 실근과 두 개의 허근을 갖는다. 두 실근의 합을 \$a\$, 두 허근의 곱을 \$b\$라 할 때, \$a+b\$의 값을 구하시오.

### 선지

① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$

### 정답

③

### 해설

\$P(x)=x^4-2x^2-9x+10\$이라 하면 \$P(1)=1-2-9+10=0\$, \$P(2)=16-8-18+10=0\$이다. 조립제법을 연속 적용하면 \$\$ (x-1)(x-2)(x^2+3x+5) \= 0 \$\$ \$x^2+3x+5=0\$의 판별식은 \$D=3^2-4\\cdot 5=-11\<0\$이므로 서로 다른 두 허근을 갖는다. 따라서 두 실근 \$1, 2\$의 합은 \$a=1+2=3\$이고, 두 허근의 곱은 근과 계수의 관계에 의해 \$b=5\$이므로 \$a+b=3+5=8\$이다.

```
{"status": "EXEMPT", "reason": "사차방정식을 인수정리·조립제법으로 인수분해해 실근의 합과 허근의 곱을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "인수정리 $P(1)=0, P(2)=0$과 조립제법으로 $(x-1)(x-2)(x^2+3x+5)=0$을 구해 실근 합 $3$과 허근 곱 $5$를 더한다.", "decisiveStep": "인수분해 후 이차인수 $x^2+3x+5=0$의 판별식 $D<0$으로 허근임을 확인하고 상수항 $5$를 곱으로 읽는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039(DIRECT_ACTIVE): 사차방정식을 인수정리와 조립제법으로 인수분해해 실근의 합과 허근의 곱을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "고차방정식의 인수분해와 근과 계수의 관계를 결합해 실근과 허근을 분리하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "두 실근의 합을 $a$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "P(1)=1-2-9+10=0$, $P(2)=16-8-18+10=0$", "evidenceType": "IMPLIED", "justification": "x=1, 2 대입으로 일차인수를 추출하고 남은 이차식의 두 허근 곱을 구함"}], "given": [{"term": "사차방정식", "src": "stem", "quote": "사차방정식 $x^4-2x^2-9x+10=0$"}], "condition": [{"term": "허근", "src": "stem", "quote": "두 개의 허근을 갖는다"}]}, "reasons": {"method": "인수정리로 두 실근 1, 2를 찾고 남은 이차식에서 허근 곱 5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 4

### 발문

\$\\left(\\dfrac{1-i}{1+i}\\right)^{2021}\$을 간단히 하시오.

### 선지

없음

### 정답

\$-i\$

### 해설

분모를 실수화하면 \$\$ \\frac{1-i}{1+i} \= \\frac{(1-i)^2}{(1+i)(1-i)} \= \\frac{-2i}{2} \= \-i \$\$ \$2021=4\\times 505+1\$이고 \$(-i)^4=1\$이므로 \$\$ \\left(\\frac{1-i}{1+i}\\right)^{2021} \= (-i)^{2021} \= (-i)^{4\\times 505+1} \= \-i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "(1-i)/(1+i)를 -i로 실수화한 뒤 4주기 거듭제곱을 계산하는 순수 복소수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모 실수화로 $\\frac{1-i}{1+i}=-i$를 구한 뒤 $(-i)^4=1$을 이용해 $(-i)^{2021}=-i$를 구한다.", "decisiveStep": "$2021=4\\times 505+1$로 지수를 $1$로 축소한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 분모 실수화로 (1-i)/(1+i)=-i를 구한 뒤 i의 4주기 거듭제곱을 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 분수식 실수화와 $i$의 주기성을 적용하는 단답형 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "solution", "quote": "(-i)^{2021} = (-i)^{4\\times 505+1}"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모를 실수화하면", "evidenceType": "IMPLIED", "justification": "분모의 켤레복소수를 곱해 -i로 단순화한 뒤 4주기 성질을 적용함"}], "given": [{"term": "허수", "src": "solution", "quote": "-i"}], "condition": []}, "reasons": {"method": "분모 실수화로 -i를 얻고 4주기 성질로 2021제곱을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 4

### 발문

\$\\dfrac{(2024+\\sqrt{2022})^3+(2024-\\sqrt{2022})^3}{2024}\$의 값을 \$N\$이라 할 때, 자연수 \$N\$의 일의 자리 숫자를 구하시오.

### 선지

없음

### 정답

\$4\$

### 해설

\$a=2024\$, \$b=\\sqrt{2022}\$라 하면 곱셈 공식에 의하여 \$\$ (a+b)^3+(a-b)^3 \= 2a^3+6ab^2 \= 2a(a^2+3b^2) \$\$ 따라서 \$\$ N \= \\frac{2a(a^2+3b^2)}{a} \= 2(a^2+3b^2) \= 2(2024^2+3\\cdot 2022\) \$\$ \$2024^2\$의 일의 자리 숫자는 \$4^2=16\$에서 \$6\$이고, \$3\\cdot 2022\$의 일의 자리 숫자는 \$3\\cdot 2=6\$이므로, \$2024^2+3\\cdot 2022\$의 일의 자리 숫자는 \$6+6=12\$에서 \$2\$이다. 따라서 \$N\$의 일의 자리 숫자는 \$2\\times 2=4\$이다.

```
{"status": "EXEMPT", "reason": "치환 후 세제곱 합 곱셈 공식으로 식을 단순화해 일의 자리 숫자를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$a=2024, b=\\sqrt{2022}$로 치환해 $N=2(2024^2+3\\cdot 2022)$로 단순화한 뒤 일의 자리 숫자 $4$를 계산한다.", "decisiveStep": "$(a+b)^3+(a-b)^3=2a(a^2+3b^2)$에서 분모 $a$를 약분해 무리수 근호를 소거한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 치환과 세제곱 합 곱셈 공식으로 무리수 식을 단순화해 일의 자리 숫자를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리수 포함 세제곱 합을 문자 치환 곱셈 공식으로 약분해 일의 자리를 구하는 단답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "자연수 $N$의 일의 자리 숫자"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "치환", "src": "solution", "quote": "a=2024$, $b=\\sqrt{2022}$라 하면"}], "condition": []}, "reasons": {"method": "문자 치환과 곱셈 공식으로 무리수를 소거한 뒤 일의 자리 숫자를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 7

### 발문

\$x=3+\\sqrt{2}\$, \$y=3-\\sqrt{2}\$일 때, 다음 식의 값을 구하고 풀이 과정을 자세히 서술하시오. (1) \$x^2+y^2\$ (2) \$x^3+y^3\$

### 선지

없음

### 정답

(1) \$22\$, (2) \$90\$

### 해설

\$x+y=(3+\\sqrt{2})+(3-\\sqrt{2})=6\$, \$xy=(3+\\sqrt{2})(3-\\sqrt{2})=9-2=7\$이다. (1) 곱셈 공식의 변형에 의하여 \$\$ x^2+y^2 \= (x+y)^2-2xy \= 6^2-2\\cdot 7 \= 36-14 \= 22 \$\$ (2) 곱셈 공식의 변형에 의하여 \$\$ x^3+y^3 \= (x+y)^3-3xy(x+y) \= 6^3-3\\cdot 7\\cdot 6 \= 216-126 \= 90 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "합 x+y와 곱 xy를 먼저 구해 곱셈 공식의 변형으로 x^2+y^2과 x^3+y^3을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$x+y=6, xy=7$을 먼저 계산한 뒤 대칭식 곱셈 공식 변형으로 $x^2+y^2$과 $x^3+y^3$을 차례로 구한다.", "decisiveStep": "무리수 $x, y$를 직접 거듭제곱하지 않고 합 $6$과 곱 $7$을 먼저 구해 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 켤레 무리수의 합과 곱을 이용해 대칭식 곱셈 공식 변형으로 제곱합·세제곱합을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레 무리수의 합·곱을 이용해 제곱합과 세제곱합을 구하는 서술형 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "x^2+y^2 = (x+y)^2-2xy"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식의 변형에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "무리수", "src": "stem", "quote": "3+\\sqrt{2}$"}], "condition": []}, "reasons": {"method": "x+y=6, xy=7을 구한 뒤 곱셈 공식 변형으로 제곱합과 세제곱합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 7

### 발문

복소수 \$z=(n-3+3i)^2\$에 대하여 \$z^2\$이 음의 실수가 된다. 실수 \$a, b\$에 대하여 이차방정식 \$x^2+ax+b=0\$은 \$z\$를 한 근으로 갖는다고 하자. \$a, b\$의 값을 구하시오. (단, \$n\$은 자연수이다.)

### 선지

없음

### 정답

\$a=0\$, \$b=324\$

### 해설

\$z^2\$이 음의 실수가 되려면 \$z\$는 순허수이어야 한다. \$z \= {(n-3)^2-9}+6(n-3)i\$이므로 순허수가 될 조건은 \$\$ (n-3)^2-9 \= 0 \\quad \\text{이고} \\quad 6(n-3)\\ne 0 \$\$ 즉 \$n(n-6)=0\$이고 \$n\\ne 3\$이므로 자연수 조건에서 \$n=6\$이다. 따라서 \$z=(3+3i)^2=18i\$이다. 이차방정식 \$x^2+ax+b=0\$의 계수 \$a, b\$가 실수이므로 다른 한 근은 켤레복소수 \$-18i\$이다. 근과 계수의 관계에 의하여 \$\$ a \= \-(18i-18i) \= 0, \\qquad b \= (18i)(-18i) \= 324 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "z^2<0 조건이 z가 순허수임을 이용해 자연수 n을 결정하고 켤레근으로 계수 a, b를 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z^2<0$에서 $z$가 순허수임을 밝히고 실수부 $(n-3)^2-9=0$으로 자연수 $n=6$($z=18i$)을 구한 뒤 켤레근 $-18i$로 $a, b$를 구한다.", "decisiveStep": "$z^2$이 음의 실수 $\\iff z$가 순허수임을 적용하고 자연수 $n>0$으로 $n=0$을 제외한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026(DIRECT_ACTIVE): z^2<0(순허수 조건)으로 실수부=0, 허수부!=0 조건을 적용해 자연수 n과 켤레근 계수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱이 음의 실수가 되는 순허수 조건과 실계수 이차방정식의 켤레근을 결합한 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+ax+b=0$"}], "method": [{"term": "순허수", "src": "solution", "quote": "z$는 순허수이어야", "evidenceType": "NAMED"}], "given": [{"term": "자연수", "src": "stem", "quote": "$n$은 자연수이다"}], "condition": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수 $-18i$이다"}]}, "reasons": {"method": "z^2<0 순허수 조건으로 n=6(z=18i)을 구하고 켤레근으로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

오른쪽 그림과 같이 이차함수 \$y=2x^2+12x+10\$의 그래프가 \$x\$축과 만나는 두 점을 \$A, B\$, \$y\$축과 만나는 점을 \$C\$라 하자. 점 \$P(x, y)\$가 점 \$A\$에서 \$C\$까지 그래프 위를 움직일 때, \$-6x+y+5\$의 최댓값과 최솟값의 합을 구하시오. (단, 점 \$A\$의 \$x\$좌표는 점 \$B\$의 \$x\$좌표보다 작다.)

### 선지

없음

### 정답

\$\\dfrac{91}{2}\$

### 해설

\$2x^2+12x+10=2(x+5)(x+1)=0\$이므로 \$x\$축과의 교점은 \$A(-5, 0), B(-1, 0)\$이고, \$y\$축과의 교점은 \$C(0, 10)\$이다. 점 \$P(x, y)\$가 \$A\$에서 \$C\$까지 움직이므로 \$x\$의 범위는 \$-5\\le x\\le 0\$이고 \$y=2x^2+12x+10\$이다. 이를 \$-6x+y+5\$에 대입하면 \$\$ \-6x+(2x^2+12x+10)+5 \= 2x^2+6x+15 \= 2\\left(x+\\frac{3}{2}\\right)^2+\\frac{21}{2} \$\$ 구간 \$-5\\le x\\le 0\$에 꼭짓점 \$x=-\\dfrac{3}{2}\$이 포함되므로

- 최솟값: \$x=-\\dfrac{3}{2}\$일 때 \$\\dfrac{21}{2}\$  
- 최댓값: 축에서 더 먼 끝점 \$x=-5\$일 때 \$2(-5)^2+6(-5)+15=35\$ 따라서 최댓값과 최솟값의 합은 \$35+\\dfrac{21}{2}=\\dfrac{91}{2}\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-6, 1], "viewport": [-6, 1, -10, 14], "pieces": [{"domain": [-6, 1], "coefficients": ["10", "12", "2"]}], "requiredPoints": [{"id": "A", "x": "-5", "y": "0", "label": "A(-5, 0)"}, {"id": "B", "x": "-1", "y": "0", "label": "B(-1, 0)"}, {"id": "C", "x": "0", "y": "10", "label": "C(0, 10)"}]}, "caption": "y=2x^2+12x+10의 x축 교점 A(-5,0), B(-1,0)과 y축 교점 C(0,10)"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$A(-5, 0), C(0, 10)$에서 $-5\\le x\\le 0$을 구하고 $y=2x^2+12x+10$을 대입한 $2x^2+6x+15$의 최대·최소를 구한다.", "decisiveStep": "구간 $[-5, 0]$에 축 $x=-3/2$가 포함됨을 확인하고 먼 끝점 $x=-5$에서 최댓값 $35$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 포물선 절편으로 구한 제한 구간 [-5, 0]에서 이차식의 최댓값과 최솟값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "포물선 절편에서 $x$ 범위를 읽고 $y$를 소거해 제한 범위 이차식의 최대·최소를 구하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값의 합"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=2x^2+12x+10$", "evidenceType": "IMPLIED", "justification": "x축·y축 절편으로 x 범위 [-5, 0]을 구하고 y를 대입해 이차식 최대·최소를 구함"}], "given": [{"term": "교점", "src": "solution", "quote": "x$축과의 교점은 $A(-5, 0), B(-1, 0)$"}], "condition": []}, "reasons": {"method": "절편 A, C로 x 범위 [-5, 0]을 구하고 y 소거 후 최대·최소 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

