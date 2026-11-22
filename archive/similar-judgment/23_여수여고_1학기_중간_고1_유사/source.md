

```
{"stem": "23_여수여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 21, "totalScore": 90.3, "generatedAt": "2026-11-18"}
```

## Q01

- 형식: 객관식  
- 배점: 3.3



### 발문



두 다항식 \$A=2x^2+3xy-y^2\$, \$B=x^2-2xy+3y^2\$에 대하여 \$2A-3B\$를 구하면?



### 선지



① \$x^2+12xy-11y^2\$ ② \$x^2-12xy-11y^2\$ ③ \$x^2+12xy+7y^2\$ ④ \$7x^2+12xy-11y^2\$ ⑤ \$x^2+7y^2\$



### 정답



①



### 해설



\$2A-3B\$에 두 다항식을 대입하여 동류항끼리 정리하면 \$\\begin{aligned} 2A-3B &= 2(2x^2+3xy-y^2)-3(x^2-2xy+3y^2) \\ &= 4x^2+6xy-2y^2-3x^2+6xy-9y^2 \\ &= x^2+12xy-11y^2 \\end{aligned}\$ 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "A=2x^2+3xy-y^2, B=x^2-2xy+3y^2을 2A-3B에 대입한 뒤 분배법칙으로 전개해 동류항을 정리한다.", "decisiveStep": "-3B를 전개할 때 -3(-2xy)=+6xy 부호를 정확히 계산하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 2A-3B 분배법칙 전개 및 동류항 정리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 실수배와 뺄셈을 직접 계산하는 1단계 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=2x^2+3xy-y^2$, $B=x^2-2xy+3y^2$"}], "goal": [{"term": "다항식", "src": "stem", "quote": "$2A-3B$를 구하면?"}], "method": [{"term": "동류항", "src": "solution", "quote": "동류항끼리 정리하면", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.5



### 발문



\$x-y=2\$, \$x^2+y^2=7\$일 때, \$x^3-y^3\$의 값은?



### 선지



① \$11\$ ② \$13\$ ③ \$15\$ ④ \$17\$ ⑤ \$19\$



### 정답



④



### 해설



먼저 \$(x-y)^2=x^2-2xy+y^2\$에서 \$2^2=7-2xy \\implies 2xy=3 \\implies xy=\\frac{3}{2}\$ 곱셈공식의 변형에 의하여 \$\\begin{aligned} x^3-y^3 &= (x-y)^3+3xy(x-y) \\ &= 2^3+3\\cdot\\frac{3}{2}\\cdot 2 \\ &= 8+9=17 \\end{aligned}\$ 따라서 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "(x-y)^2=x^2-2xy+y^2으로 xy=3/2을 먼저 구한 뒤 x^3-y^3=(x-y)^3+3xy(x-y)에 대입한다.", "decisiveStep": "x-y와 x^2+y^2에서 xy=3/2을 역산하여 세제곱 차 공식에 연결하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈공식 변형으로 xy 구한 뒤 x^3-y^3 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곱셈공식 변형을 두 단계로 연결해 xy를 구한 뒤 세제곱 차를 계산해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "값", "src": "stem", "quote": "$x-y=2$, $x^2+y^2=7$일 때"}], "goal": [{"term": "차", "src": "stem", "quote": "$x^3-y^3$의 값은?"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈공식의 변형에 의하여", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.7



### 발문



\$(3x-1)(2x^2+x+2)\$를 전개하면 \$ax^3+bx^2+cx-2\$이다. \$a-b+c\$의 값은? (단, \$a, b, c\$는 상수이다.)



### 선지



① \$8\$ ② \$10\$ ③ \$12\$ ④ \$14\$ ⑤ \$16\$



### 정답



②



### 해설



주어진 식을 전개하여 정리하면 \$\\begin{aligned} (3x-1)(2x^2+x+2) &= 6x^3+3x^2+6x-2x^2-x-2 \\ &= 6x^3+x^2+5x-2 \\end{aligned}\$ 계수를 비교하면 \$a=6\$, \$b=1\$, \$c=5\$이므로 \$a-b+c=6-1+5=10\$ 따라서 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "(3x-1)(2x^2+x+2)를 전개해 동류항을 정리하고 계수비교로 a=6, b=1, c=5를 구한다.", "decisiveStep": "전개식 6x^3+x^2+5x-2에서 a, b, c를 읽어 a-b+c를 계산하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "고차식 전개"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-004(DIRECT_ACTIVE): 다항식 곱 전개 후 계수비교"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식과 이차식의 곱을 전개해 계수를 비교하는 1단계 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "$(3x-1)(2x^2+x+2)$"}], "goal": [{"term": "값", "src": "stem", "quote": "$a-b+c$의 값은?"}], "method": [{"term": "전개", "src": "stem", "quote": "전개하면", "evidenceType": "NAMED"}, {"term": "계수비교", "src": "solution", "quote": "계수를 비교하면 $a=6$, $b=1$, $c=5$이므로", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "$a, b, c$는 상수이다."}]}}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4



### 발문



다항식 \$A=3x^4-2x^3+5x-4\$, \$B=x^2+1\$에 대하여 \$A\$를 \$B\$로 나누었을 때의 나머지는?



### 선지



① \$3x-1\$ ② \$3x+1\$ ③ \$7x-7\$ ④ \$7x+1\$ ⑤ \$7x-1\$



### 정답



⑤



### 해설



\$A\$를 \$B=x^2+1\$로 직접 나누면 \$3x^4 \\div x^2=3x^2\$이므로 \$A-3x^2B=(3x^4-2x^3+5x-4)-(3x^4+3x^2)=-2x^3-3x^2+5x-4\$ \$-2x^3 \\div x^2=-2x\$이므로 \$(-2x^3-3x^2+5x-4)-(-2x)B=-3x^2+7x-4\$ \$-3x^2 \\div x^2=-3\$이므로 \$(-3x^2+7x-4)-(-3)B=7x-1\$ 나머지의 차수는 \$2\$보다 작으므로 구하는 나머지는 \$7x-1\$이다. 따라서 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "사차식 A=3x^4-2x^3+5x-4를 이차식 B=x^2+1로 내림차순 나눗셈하여 일차 이하의 나머지 7x-1을 구한다.", "decisiveStep": "이차항 계수가 0인 사차식에서 차수를 맞추며 -2x^3-3x^2+5x-4를 이어서 나누는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 사차식을 이차식으로 나눈 몫과 나머지 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 직접 나눗셈에서 빈 차수(x^2항) 자리에 주의하며 끝까지 나머지를 구해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $A=3x^4-2x^3+5x-4$, $B=x^2+1$"}], "goal": [{"term": "나머지", "src": "stem", "quote": "나머지는?"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "$A$를 $B=x^2+1$로 직접 나누면", "evidenceType": "IMPLIED", "justification": "최고차항부터 차례로 소거하여 다항식의 직접 나눗셈을 수행함"}], "condition": []}}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.3



### 발문



다항식 \$P(x)\$를 \$x-a\$로 나누었을 때의 몫을 \$Q(x)\$, 나머지를 \$R\$이라 하자. \$x^3P(x)\$를 \$x(x-a)\$로 나누었을 때의 나머지를 \$T(x)\$라 할 때, \$T(a)\$의 값은? (단, \$a, R\$은 상수이다.)



### 선지



① \$aR\$ ② \$a^2R\$ ③ \$a^3R\$ ④ \$-a^3R\$ ⑤ \$3a^2R\$



### 정답



③



### 해설



\$P(x)\$를 \$x-a\$로 나눈 나눗셈 항등식은 \$P(x)=(x-a)Q(x)+R\$ 양변에 \$x^3\$을 곱하면 \$x^3P(x)=x^3(x-a)Q(x)+Rx^3\$ 여기서 \$\\begin{aligned} Rx^3 &= Rx(x^2-a^2)+a^2Rx \\ &= Rx(x+a)(x-a)+a^2Rx \\end{aligned}\$ 이므로 \$x^3P(x)=x(x-a){x^2Q(x)+R(x+a)}+a^2Rx\$ 따라서 \$T(x)=a^2Rx\$이고, \$T(a)=a^2R\\cdot a=a^3R\$이다. 그러므로 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "P(x)=(x-a)Q(x)+R 양변에 x^3을 곱한 뒤 Rx^3을 x(x-a)로 묶어 나머지 T(x)=a^2Rx를 분리한다.", "decisiveStep": "Rx^3=Rx(x+a)(x-a)+a^2Rx로 변형해 일차 이하의 나머지 T(x)를 추출하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006(DIRECT_ACTIVE): 나눗셈 항등식에 x^3 곱한 뒤 나머지 분리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나눗셈 항등식에 x^3을 곱한 뒤 제수 x(x-a)에 대한 나머지 차수 조건을 맞추어 재정리해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$T(a)$의 값은?"}], "method": [{"term": "항등식", "src": "solution", "quote": "나눗셈 항등식은", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "$a, R$은 상수이다."}]}}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.7



### 발문



다음 중 \$x\$에 대한 항등식인 것을 모두 고르면?



### 선지



① \$x^2=3x-2\$ ② \$2(x+3)+x=3(x+2)\$ ③ \$(x+3)^2-12x=(x-3)^2\$ ④ \$(x+3)^2-(x-3)^2=6x\$ ⑤ \$2x-1=2x+4\$



### 정답



②, ③



### 해설



항등식은 모든 \$x\$의 값에 대하여 항상 성립해야 하므로 각 식의 양변을 정리하여 비교하면 ① \$x^2=3x-2\$는 특정한 \$x\$(\$x=1, 2\$)에서만 성립하는 방정식이다. ② (좌변)\$=2x+6+x=3x+6\$, (우변)\$=3x+6\$으로 양변이 같으므로 항등식이다. ③ (좌변)\$=x^2+6x+9-12x=x^2-6x+9=(x-3)^2=\$(우변)이므로 항등식이다. ④ (좌변)\$=(x^2+6x+9)-(x^2-6x+9)=12x \\neq 6x\$이므로 항등식이 아니다. ⑤ \$2x-1=2x+4\$는 \$-1=4\$로 모순이므로 성립하지 않는다. 따라서 항등식은 ②, ③이다.

```
"NONE"
```

```
{"sourceQid": "6", "variationType": "CONCEPT", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "각 선지의 좌변과 우변을 전개해 x의 모든 차수 계수가 일치하는 항등식(②, ③)을 판별한다.", "decisiveStep": "②의 3x+6과 ③의 (x-3)^2이 좌우변 항등적으로 일치함을 확인하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 전개식 계수 비교로 항등식 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다섯 개의 등식을 전개하여 방정식·불능·항등식을 구분하는 개념 확인 문항이다.", "level": "중", "item4slot": {"format": "복수 정답", "slots": {"given": [{"term": "항등식", "src": "stem", "quote": "$x$에 대한 항등식인 것을"}], "goal": [{"term": "진리값", "src": "stem", "quote": "모두 고르면?"}], "method": [{"term": "전개", "src": "solution", "quote": "양변을 정리하여 비교하면", "evidenceType": "IMPLIED", "justification": "각 등식의 좌변과 우변을 전개해 계수가 같은지 확인함"}], "condition": []}}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.3



### 발문



다음은 \$x\$의 값에 관계없이 등식 \$(x+1)^3=a(x-1)^3+b(x-1)^2+c(x-1)+d\$가 항상 성립할 때, 상수 \$a, b, c, d\$에 대하여 \$a-b+c-d\$의 값을 구하는 과정이다. 다음 (가), (나), (다)에 들어갈 말로 알맞게 짝지은 것을 고르면?

| \$(x+1)^3=a(x-1)^3+b(x-1)^2+c(x-1)+d\$를 다시 정리하면 \$(x+1)^3=(x-1)\$ (가) \$+d\$이므로 나머지정리를 이용하면 \$d=\$ (나) \$^3\$이다. 상수 \$c\$를 구하기 위하여 (가) \$=(x-1)Q(x)+c\$이므로 \$c=12\$이다. 이 나눗셈 과정을 반복하여 \$a, b, c, d\$의 값을 구할 수 있고 \$a-b+c-d\$의 값은 (다) 이다. |
| :---- |

## 

### 선지

 ① (가) \$a(x-1)^2+b(x-1)+c\$, (나) \$2\$, (다) \$-1\$ ② (가) \$a(x-1)^2-b(x-1)+c\$, (나) \$2\$, (다) \$-1\$ ③ (가) \$a(x-1)^2+b(x-1)+c\$, (나) \$2\$, (다) \$1\$ ④ (가) \$a(x-1)^2-b(x-1)+c\$, (나) \$1\$, (다) \$-1\$ ⑤ (가) \$a(x-1)^2+b(x-1)+c\$, (나) \$1\$, (다) \$1\$ 

### 정답

 ① 

### 해설

 우변을 \$x-1\$로 묶으면 \$(x+1)^3=(x-1)\\{a(x-1)^2+b(x-1)+c\\}+d\$ 이므로 (가)는 \$a(x-1)^2+b(x-1)+c\$이다. 양변에 \$x=1\$을 대입하면 \$d=(1+1)^3=2^3=8\$이므로 (나)는 \$2\$이다. 또한 \$t=x-1\$로 놓으면 \$x+1=t+2\$이므로 \$(x+1)^3=(t+2)^3=t^3+6t^2+12t+8=(x-1)^3+6(x-1)^2+12(x-1)+8\$ 따라서 \$a=1, b=6, c=12, d=8\$이므로 \$a-b+c-d=1-6+12-8=-1\$ 그러므로 (다)는 \$-1\$이고, 정답은 ①이다. ```json:plan
"NONE"
```

```
:meta
{ "sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": null, "curriculum": "2015", "standardUnitKey": null, "subUnitKey": null, "conceptClusterKey": null, "primaryMethod": "(x-1)로 묶어 (가)와 나머지정리 d=2^3을 구하고 t=x-1 치환 전개로 a=1, b=6, c=12, d=8을 확정한다.", "decisiveStep": "t=x-1 치환을 이용해 (t+2)^3 전개식으로 계수 a, b, c, d를 구하는 단계", "rpm": null, "ptTplCandidate": { "problemTypeKey": null, "templateKey": null, "why": "메타\_키선택표\_고1.json이 정본 폴더에 없어 선택표 기반 키를 확정할 수 없음" }, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내림차순 묶기와 t=x-1 치환 전개를 결합해 빈칸 3개를 모두 채워야 한다.", "level": "중", "item4slot": { "format": "빈칸 추론", "slots": { "given": \[ { "term": "등식", "src": "stem", "quote": "등식 \$(x+1)^3=a(x-1)^3+b(x-1)^2+c(x-1)+d\$" } \], "goal": \[ { "term": "값", "src": "stem", "quote": "\$a-b+c-d\$의 값을 구하는 과정이다." } \], "method": \[ { "term": "나머지정리", "src": "stem", "quote": "나머지정리를 이용하면", "evidenceType": "NAMED" }, { "term": "치환", "src": "solution", "quote": "\$t=x-1\$로 놓으면", "evidenceType": "IMPLIED", "justification": "x-1을 t로 치환해 (t+2)^3을 전개함" } \], "condition": \[ { "term": "항상성립", "src": "stem", "quote": "\$x\$의 값에 관계없이 등식" } \] } }, "hold": "메타\_키선택표\_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate 비움" }
```

## Q08



- 형식: 객관식  
- 배점: 4.5



### 발문



최고차항의 계수가 \$1\$인 삼차식 \$P(x)\$에 대하여 \$P(3-x)\$를 \$x-3\$으로 나누었을 때의 나머지가 \$4\$이고, \$P(x)-x^2\$은 \$(x-1)(x+2)\$로 나누어떨어진다. 이때 \$P(3)\$의 값은?



### 선지



① \$13\$ ② \$15\$ ③ \$17\$ ④ \$19\$ ⑤ \$21\$



### 정답



④



### 해설



\$P(3-x)\$를 \$x-3\$으로 나눈 나머지가 \$4\$이므로 나머지정리에 의하여 \$x=3\$을 대입하면 \$P(3-3)=P(0)=4\$ \$P(x)\$가 최고차항의 계수가 \$1\$인 삼차식이고 \$P(x)-x^2\$이 \$(x-1)(x+2)\$로 나누어떨어지므로, 상수 \$c\$에 대하여 \$P(x)-x^2=(x-1)(x+2)(x+c)\$ 로 놓을 수 있다. 여기에 \$x=0\$을 대입하면 \$P(0)-0=(-1)(2)c=4 \\implies \-2c=4 \\implies c=-2\$ 따라서 \$P(x)=(x-1)(x+2)(x-2)+x^2\$이므로 \$P(3)=(3-1)(3+2)(3-2)+3^2=2\\cdot 5\\cdot 1+9=19\$ 그러므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리로 P(0)=4를 구하고 P(x)-x^2=(x-1)(x+2)(x+c)에 x=0을 대입해 c=-2를 결정한 뒤 P(3)을 계산한다.", "decisiveStep": "합성식 P(3-x)에서 P(0)=4를 뽑아 삼차식 P(x)-x^2의 미정인수 (x+c)를 확정하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 나머지정리 P(0)=4와 인수정리 결합해 P(3) 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "나머지정리와 인수정리를 연쇄 적용해 삼차식 P(x)의 모든 계수를 결정해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "최고차항의 계수가 $1$인 삼차식 $P(x)$"}], "goal": [{"term": "함숫값", "src": "stem", "quote": "$P(3)$의 값은?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}, {"term": "인수정리", "src": "stem", "quote": "나누어떨어진다.", "evidenceType": "IMPLIED", "justification": "나누어떨어진다는 조건으로 P(x)-x^2=(x-1)(x+2)(x+c)를 세움"}], "condition": [{"term": "최고차항", "src": "stem", "quote": "최고차항의 계수가 $1$인"}]}}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4



### 발문



다항식 \$x^2+4xy-x+3y^2+y-2\$를 인수분해하면 \$(x+ay+b)(x+cy+d)\$가 된다. 이때 \$ac+bd\$의 값은? (단, \$a, b, c, d\$는 실수인 상수이다.)



### 선지



① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$



### 정답



⑤



### 해설



주어진 식을 \$x\$에 대하여 내림차순으로 정리하면 \$x^2+(4y-1)x+(3y^2+y-2)\$ 상수항 부분 \$3y^2+y-2\$를 인수분해하면 \$3y^2+y-2=(3y-2)(y+1)\$ 이고 \$(3y-2)+(y+1)=4y-1\$이므로 \$x^2+(4y-1)x+(3y-2)(y+1)=(x+3y-2)(x+y+1)\$ 따라서 두 일차식의 순서를 바꾸어도 \$ac+bd\$의 값은 같으므로 \$ac+bd=3\\cdot 1+(-2)\\cdot 1=1\$ 그러므로 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "x에 대해 내림차순 정리 후 상수항 3y^2+y-2=(3y-2)(y+1)을 인수분해해 전체 식을 (x+3y-2)(x+y+1)로 분해한다.", "decisiveStep": "두 일차식 (3y-2)와 (y+1)의 합이 x의 계수 4y-1과 일치함을 확인해 인수분해하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "이차식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-017(DIRECT_ACTIVE): 이차다항식 x 내림차순 정리 후 상수항 인수분해"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 문자가 포함된 이차식을 한 문자 내림차순으로 정리해 X자 인수분해를 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^2+4xy-x+3y^2+y-2$"}], "goal": [{"term": "값", "src": "stem", "quote": "$ac+bd$의 값은?"}], "method": [{"term": "내림차순", "src": "solution", "quote": "내림차순으로 정리하면", "evidenceType": "NAMED"}, {"term": "인수분해", "src": "stem", "quote": "인수분해하면", "evidenceType": "NAMED"}], "condition": [{"term": "상수", "src": "stem", "quote": "실수인 상수이다."}]}}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4



### 발문



삼차식 \$3x^3+ax^2+bx-6\$이 두 일차식 \$3x-1\$과 \$x-2\$를 인수로 갖도록 상수 \$a, b\$를 정하고 이 식을 인수분해했을 때의 나머지 일차인수는?



### 선지



① \$x-2\$ ② \$x-3\$ ③ \$x+3\$ ④ \$x-1\$ ⑤ \$3x+1\$



### 정답



②



### 해설



주어진 삼차식의 최고차항의 계수가 \$3\$이고 \$3x-1\$, \$x-2\$를 인수로 가지므로, 나머지 일차인수를 \$x-r\$ (\$r\$은 상수)이라 하면 \$3x^3+ax^2+bx-6=(3x-1)(x-2)(x-r)\$ 양변의 상수항을 비교하면 \$(-1)(-2)(-r)=-6 \\implies \-2r=-6 \\implies r=3\$ 따라서 나머지 일차인수는 \$x-3\$이다. 그러므로 정답은 ②이다.

```
"NONE"
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "인수분해 꼴 (3x-1)(x-2)(x-r)을 세우고 상수항 비교 (-1)(-2)(-r)=-6으로 나머지 인수 x-3을 구한다.", "decisiveStep": "a, b를 직접 구하지 않고 최고차항 계수 3과 상수항 -6 비교만으로 나머지 인수를 결정하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 인수분해 꼴과 상수항 비교로 나머지 인수 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리 항등식의 상수항만 비교하면 미지수 a, b를 거치지 않고 바로 인수를 구할 수 있다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "삼차식", "src": "stem", "quote": "삼차식 $3x^3+ax^2+bx-6$"}], "goal": [{"term": "인수", "src": "stem", "quote": "나머지 일차인수는?"}], "method": [{"term": "계수비교", "src": "solution", "quote": "양변의 상수항을 비교하면", "evidenceType": "IMPLIED", "justification": "인수분해 항등식의 상수항을 비교해 미정 근 r을 구함"}], "condition": [{"term": "상수", "src": "stem", "quote": "상수 $a, b$를"}]}}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 3.6



### 발문



\$\\sqrt{-3}\\sqrt{-5}+\\frac{\\sqrt{27}}{\\sqrt{-3}}-\\frac{\\sqrt{-12}}{\\sqrt{-20}}=a+bi\$를 만족시키는 실수 \$a, b\$에 대하여 \$ab\$의 값은? (단, \$i=\\sqrt{-1}\$이다.)



### 선지



① \$\\frac{18\\sqrt{15}}{5}\$ ② \$-\\frac{18\\sqrt{15}}{5}\$ ③ \$\\frac{12\\sqrt{15}}{5}\$ ④ \$3\\sqrt{15}\$ ⑤ \$-3\\sqrt{15}\$



### 정답



①



### 해설



음수의 제곱근을 허수단위 \$i\$를 사용하여 나타내면 \$\\sqrt{-3}\\sqrt{-5}=(i\\sqrt{3})(i\\sqrt{5})=i^2\\sqrt{15}=-\\sqrt{15}\$ \$\\frac{\\sqrt{27}}{\\sqrt{-3}}=\\frac{3\\sqrt{3}}{i\\sqrt{3}}=\\frac{3}{i}=\\frac{3i}{i^2}=-3i\$ \$\\frac{\\sqrt{-12}}{\\sqrt{-20}}=\\frac{2\\sqrt{3}i}{2\\sqrt{5}i}=\\sqrt{\\frac{3}{5}}=\\frac{\\sqrt{15}}{5}\$ 따라서 주어진 식은 \$-\\sqrt{15}-3i-\\frac{\\sqrt{15}}{5}=-\\frac{6\\sqrt{15}}{5}-3i\$ 이므로 \$a=-\\frac{6\\sqrt{15}}{5}\$, \$b=-3\$이다. 그러므로 \$ab=\\left(-\\frac{6\\sqrt{15}}{5}\\right)(-3)=\\frac{18\\sqrt{15}}{5}\$이다. 따라서 정답은 ①이다.

```
"NONE"
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "세 항의 음수 제곱근을 모두 i를 꺼내어 계산한 뒤 실수부 a=-6sqrt(15)/5와 허수부 b=-3을 곱한다.", "decisiveStep": "분모·분자가 모두 음수인 제곱근 나눗셈에서 i가 약분되어 실수 sqrt(15)/5가 됨을 정확히 처리하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 음수의 제곱근 i 변환 계산 후 실수부·허수부 곱"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 제곱근 곱셈·나눗셈에서 부호 규칙 세 가지를 한 번에 정확히 적용해야 한다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "근호", "src": "stem", "quote": "$\\sqrt{-3}\\sqrt{-5}+\\frac{\\sqrt{27}}{\\sqrt{-3}}-\\frac{\\sqrt{-12}}{\\sqrt{-20}}=a+bi$"}], "goal": [{"term": "곱", "src": "stem", "quote": "$ab$의 값은?"}], "method": [{"term": "허수단위", "src": "solution", "quote": "음수의 제곱근을 허수단위 $i$를 사용하여 나타내면", "evidenceType": "NAMED"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $a, b$에 대하여"}]}}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.3



### 발문



복소수 \$z\$와 그 켤레복소수 \$\\overline{z}\$에 대하여 옳은 것만을 \<보기\>에서 있는 대로 고른 것은? (단, 복소수 \$z\$의 실수부분과 허수부분은 모두 \$0\$이 아니고, \$i=\\sqrt{-1}\$이다.)

| ㄱ. \$z\\overline{z}\$는 양의 실수이다. ㄴ. \$\\frac{z-\\overline{z}}{z\\overline{z}}\$는 실수이다. ㄷ. \$\\omega=\\frac{-1+\\sqrt{3}i}{2}\$일 때, \$\\omega^3+2\\omega^6=3\$이다. |
| :---- |

## 

### 선지

 ① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ 

### 정답

 ③ 

### 해설

 \$z=a+bi\$ (\$a, b\$는 \$0\$이 아닌 실수)라 하면 \$\\overline{z}=a-bi\$이다. ㄱ. \$z\\overline{z}=(a+bi)(a-bi)=a^2+b^2 \> 0\$이므로 양의 실수이다. (참) ㄴ. \$z-\\overline{z}=2bi\$이므로 \$\\frac{z-\\overline{z}}{z\\overline{z}}=\\frac{2b}{a^2+b^2}i\$이다. \$b \\neq 0\$이므로 순허수이지 실수가 아니다. (거짓) ㄷ. \$\\omega=\\frac{-1+\\sqrt{3}i}{2}\$에서 \$2\\omega+1=\\sqrt{3}i\$이므로 양변을 제곱하면 \$4\\omega^2+4\\omega+1=-3 \\implies \\omega^2+\\omega+1=0\$이다. 양변에 \$\\omega-1\$을 곱하면 \$\\omega^3-1=0 \\implies \\omega^3=1\$이다. 따라서 \$\\omega^3+2\\omega^6=1+2\\cdot 1^2=3\$이다. (참) 그러므로 옳은 것은 ㄱ, ㄷ이고, 정답은 ③이다. ```json:plan
"NONE"
```

```
:meta
{ "sourceQid": "12", "variationType": "CONCEPT", "standardCourse": "수학(상)", "courseKey": null, "curriculum": "2015", "standardUnitKey": null, "subUnitKey": null, "conceptClusterKey": null, "primaryMethod": "z=a+bi 대입으로 ㄱ, ㄴ의 실수/순허수 여부를 판별하고 ㄷ은 w^2+w+1=0에서 w^3=1을 유도해 계산한다.", "decisiveStep": "ㄴ의 분자가 2bi(b\\!=0)이므로 순허수가 되어 거짓임을 판별하고 ㄷ의 세제곱 단위근 w^3=1을 적용하는 단계", "rpm": null, "ptTplCandidate": { "problemTypeKey": null, "templateKey": null, "why": "메타\_키선택표\_고1.json이 정본 폴더에 없어 선택표 기반 키를 확정할 수 없음" }, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "CASE\_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "켤레복소수 성질 판별과 허수 세제곱근 w^3=1 계산이 함께 결합된 합답형 문항이다.", "level": "상", "item4slot": { "format": "합답형", "slots": { "given": \[ { "term": "복소수", "src": "stem", "quote": "복소수 \$z\$와 그 켤레복소수 \$\\overline{z}\$" } \], "goal": \[ { "term": "진리값", "src": "stem", "quote": "옳은 것만을 에서 있는 대로 고른 것은?" } \], "method": \[ { "term": "켤레복소수", "src": "stem", "quote": "켤레복소수 \$\\overline{z}\$", "evidenceType": "NAMED" }, { "term": "거듭제곱", "src": "solution", "quote": "\\omega^3+2\\omega^6=1+2\\cdot 1^2=3", "evidenceType": "IMPLIED", "justification": "w^3=1을 이용해 거듭제곱 식을 계산함" } \], "condition": \[ { "term": "실수부분", "src": "stem", "quote": "실수부분과 허수부분은 모두 \$0\$이 아니고" } \] } }, "hold": "메타\_키선택표\_고1.json 부재로 courseKey, standardUnitKey, subUnitKey, conceptClusterKey, rpm, ptTplCandidate 비움" }
```

## Q13



- 형식: 객관식  
- 배점: 3.5



### 발문



\$x\$에 대한 이차방정식 \$2x^2-2(a+4)x+2a+6=0\$이 중근을 가질 때, 상수 \$a\$의 값은?



### 선지



① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$



### 정답



④



### 해설



주어진 이차방정식이 중근을 가지므로 판별식 \$D=0\$이어야 한다. \$\\begin{aligned} \\frac{D}{4} &= {-(a+4)}^2-2(2a+6) \\ &= a^2+8a+16-4a-12 \\ &= a^2+4a+4 \\ &= (a+2)^2 \= 0 \\end{aligned}\$ 따라서 \$a=-2\$이다. 그러므로 정답은 ④이다.

```
"NONE"
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 D/4=(a+4)^2-2(2a+6)=0을 전개해 완전제곱식 (a+2)^2=0으로 a=-2를 구한다.", "decisiveStep": "D/4=a^2+4a+4=(a+2)^2=0으로 인수분해하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 중근 조건 짝수 판별식 D/4=0 풀이"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 중근 조건 D/4=0을 계산해 상수 a를 구하는 기본 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $2x^2-2(a+4)x+2a+6=0$"}], "goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이어야 한다.", "evidenceType": "NAMED"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 가질 때"}]}}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 5



### 발문



\$x\$에 대한 이차방정식 \$x^2-(3a+b)x+2ab=0\$의 두 실근의 절댓값이 같고 부호가 다를 때, 가능한 모든 실수 \$ab\$의 값의 합은? (단, \$a\$는 자연수이고, 두 근의 곱은 \$-120\$ 이상이다.)



### 선지



① \$-42\$ ② \$-54\$ ③ \$-72\$ ④ \$-84\$ ⑤ \$-90\$



### 정답



⑤



### 해설



두 실근의 절댓값이 같고 부호가 다르므로 두 근을 \$r, \-r\$ (\$r \\neq 0\$)이라 할 수 있다. 근과 계수의 관계에 의하여 두 근의 합은 \$0\$이므로 \$3a+b=0 \\implies b=-3a\$ 따라서 \$ab=a(-3a)=-3a^2\$이다. 또한 두 근의 곱은 \$2ab=-6a^2\$이고, 조건에서 두 근의 곱이 \$-120\$ 이상이므로 \$-6a^2 \\ge \-120 \\implies a^2 \\le 20\$ \$a\$는 자연수이므로 \$a=1, 2, 3, 4\$이다. 각각에 대한 \$ab=-3a^2\$의 값은 \$-3, \-12, \-27, \-48\$이므로 모든 \$ab\$의 값의 합은 \$-3+(-12)+(-27)+(-48)=-90\$ 따라서 정답은 ⑤이다.

```
"NONE"
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 근의 합 3a+b=0으로 b=-3a를 구하고 곱 2ab=-6a^2>=-120과 자연수 조건으로 a=1,2,3,4를 찾아 ab 값을 합산한다.", "decisiveStep": "두 근이 절댓값이 같고 부호가 다름을 합=0, 곱<0 조건으로 번역하고 -6a^2>=-120 부등식을 푸는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계와 자연수 조건으로 ab 값 합산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "근과 계수의 관계와 부등식·자연수 조건을 결합하여 가능한 모든 곱을 누락 없이 합해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-(3a+b)x+2ab=0$"}], "goal": [{"term": "합", "src": "stem", "quote": "모든 실수 $ab$의 값의 합은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "자연수", "src": "stem", "quote": "$a$는 자연수이고"}, {"term": "절댓값", "src": "stem", "quote": "두 실근의 절댓값이 같고 부호가 다를 때"}]}}, "hold": "BINDING_GAP"}
```

## Q15

- 형식: 객관식  
- 배점: 3.8



### 발문



\$x\$에 대한 이차함수 \$y=x^2+2(3k-a)x+9k^2-7a+a^2\$의 그래프가 \$a\$의 값에 관계없이 \$x\$축에 접할 때, 상수 \$k\$의 값은?



### 선지



① \$-\\frac{7}{6}\$ ② \$\\frac{7}{6}\$ ③ \$\\frac{7}{3}\$ ④ \$-\\frac{7}{3}\$ ⑤ \$\\frac{6}{7}\$



### 정답



②



### 해설



이차함수의 그래프가 \$x\$축에 접하려면 이차방정식 \$x^2+2(3k-a)x+9k^2-7a+a^2=0\$이 중근을 가져야 하므로 판별식 \$D=0\$이어야 한다. \$\\begin{aligned} \\frac{D}{4} &= (3k-a)^2-(9k^2-7a+a^2) \\ &= 9k^2-6ka+a^2-9k^2+7a-a^2 \\ &= a(7-6k) \= 0 \\end{aligned}\$ 이 식이 실수 \$a\$의 값에 관계없이 항상 성립해야 하므로 \$a\$에 대한 항등식이다. 따라서 \$7-6k=0\$이므로 \$k=\\frac{7}{6}\$이다. 그러므로 정답은 ②이다.

```
{
  "stem": {
    "status": "EXEMPT",
    "reason": "발문에는 그림이 없고 해설에서만 x축에 접하는 두 경우의 포물선을 제시한다."
  },
  "solution": {
    "capability": "composite-panels-v1",
    "panels": [
      {
        "capability": "polynomial-spike-v1",
        "graphPlan": {
          "family": "polynomial",
          "coefficients": [
            "25/4",
            "5",
            "1"
          ],
          "sourceDomain": {
            "kind": "ALL_REALS"
          },
          "domain": [
            -6,
            1
          ],
          "viewport": [
            -6,
            1,
            -2,
            8
          ],
          "requiredPoints": [
            {
              "id": "T1",
              "x": -2.5,
              "y": 0
            }
          ],
          "axisTickValues": {
            "x": [],
            "y": []
          }
        },
        "caption": "a=1일 때 x=-5/2에서 x축에 접한다."
      },
      {
        "capability": "polynomial-spike-v1",
        "graphPlan": {
          "family": "polynomial",
          "coefficients": [
            "9/4",
            "3",
            "1"
          ],
          "sourceDomain": {
            "kind": "ALL_REALS"
          },
          "domain": [
            -5,
            2
          ],
          "viewport": [
            -5,
            2,
            -2,
            8
          ],
          "requiredPoints": [
            {
              "id": "T2",
              "x": -1.5,
              "y": 0
            }
          ],
          "axisTickValues": {
            "x": [],
            "y": []
          }
        },
        "caption": "a=2일 때 x=-3/2에서 x축에 접한다."
      }
    ],
    "caption": "k=7/6일 때 a의 값이 변해도 포물선은 항상 x축에 접한다."
  }
}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "x축 접선 조건 D/4=0을 정리해 a(7-6k)=0을 얻고 a에 대한 항등식 조건으로 k=7/6을 구한다.", "decisiveStep": "판별식에서 k^2과 a^2이 소거된 뒤 a(7-6k)=0을 a에 대한 항등식으로 해석하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): x축 접선 조건 D/4=0을 a에 대한 항등식으로 풀이"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x축 접선 조건(판별식)과 매개변수 a에 대한 항등식 조건을 연결하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+2(3k-a)x+9k^2-7a+a^2$"}], "goal": [{"term": "상수", "src": "stem", "quote": "상수 $k$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이어야 한다.", "evidenceType": "NAMED"}, {"term": "항등식", "src": "solution", "quote": "$a$에 대한 항등식이다.", "evidenceType": "NAMED"}], "condition": [{"term": "접함", "src": "stem", "quote": "$x$축에 접할 때"}, {"term": "항상성립", "src": "stem", "quote": "$a$의 값에 관계없이"}]}}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.7



### 발문



그림과 같이 \$x \< \-2\$ 또는 \$x \> 3\$일 때 \$f(x)=x^2-x-6\$이고, \$-2 \\le x \\le 3\$일 때 \$f(x)=-x^2+x+6\$인 함수 \$f(x)\$의 그래프가 있다. 직선 \$y=x+k\$가 함수 \$y=f(x)\$의 그래프와 서로 다른 네 점에서 만나도록 하는 정수 \$k\$의 개수는?



### 선지



① \$3\$ ② \$1\$ ③ \$2\$ ④ \$4\$ ⑤ \$5\$



### 정답



①



### 해설



(i) 바깥쪽 구간(\$x \< \-2\$ 또는 \$x \> 3\$)에서 \$x^2-x-6=x+k \\implies x^2-2x-(6+k)=0\$의 두 근은 \$x=1\\pm\\sqrt{7+k}\$이다. 오른쪽 근이 \$3\$보다 크고 왼쪽 근이 \$-2\$보다 작아야 두 구간에서 각각 한 점씩 만난다. \$1-\\sqrt{7+k} \< \-2 \\implies \\sqrt{7+k} \> 3 \\implies 7+k \> 9 \\implies k \> 2\$ (이때 \$1+\\sqrt{7+k} \> 1+3=4 \> 3\$도 동시에 성립한다.) (ii) 안쪽 구간(\$-2 \\le x \\le 3\$)에서 \$-x^2+x+6=x+k \\implies x^2=6-k\$이다. 이 구간에서 서로 다른 두 교점이 존재하려면 \$6-k \> 0\$, 즉 \$k \< 6\$이어야 한다. (\$k \> 2\$일 때 \$x=\\pm\\sqrt{6-k}\$는 모두 \$-2 \< x \< 2 \\subset \[-2, 3\]\$에 속한다.) (i), (ii)에서 \$2 \< k \< 6\$이므로 정수 \$k\$는 \$3, 4, 5\$의 \$3\$개이다. 따라서 정답은 ①이다.

```
{
  "stem": {
    "capability": "piecewise-polynomial-spike-v1",
    "graphPlan": {
      "family": "piecewise-polynomial",
      "pieces": [
        {
          "coefficients": [
            "-6",
            "-1",
            "1"
          ]
        },
        {
          "coefficients": [
            "6",
            "1",
            "-1"
          ]
        },
        {
          "coefficients": [
            "-6",
            "-1",
            "1"
          ]
        }
      ],
      "breakpoints": [
        {
          "x": "-2",
          "y": "0"
        },
        {
          "x": "3",
          "y": "0"
        }
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "formula": "abs(x^2-x-6)",
      "requiredPoints": [
        {
          "id": "A",
          "x": -2,
          "y": 0
        },
        {
          "id": "B",
          "x": 3,
          "y": 0
        }
      ],
      "axisTickValues": {
        "x": [
          -2,
          3
        ],
        "y": []
      }
    },
    "caption": "함수 y=f(x)의 그래프"
  },
  "solution": {
    "capability": "piecewise-polynomial-spike-v1",
    "graphPlan": {
      "family": "piecewise-polynomial",
      "pieces": [
        {
          "coefficients": [
            "-6",
            "-1",
            "1"
          ]
        },
        {
          "coefficients": [
            "6",
            "1",
            "-1"
          ]
        },
        {
          "coefficients": [
            "-6",
            "-1",
            "1"
          ]
        }
      ],
      "breakpoints": [
        {
          "x": "-2",
          "y": "0"
        },
        {
          "x": "3",
          "y": "0"
        }
      ],
      "sourceDomain": {
        "kind": "ALL_REALS"
      },
      "formula": "abs(x^2-x-6)",
      "referenceLines": [
        {
          "id": "low",
          "slope": "1",
          "intercept": "2"
        },
        {
          "id": "mid",
          "slope": "1",
          "intercept": "4"
        },
        {
          "id": "high",
          "slope": "1",
          "intercept": "6"
        }
      ],
      "requiredPoints": [
        {
          "id": "A",
          "x": -2,
          "y": 0
        },
        {
          "id": "B",
          "x": 3,
          "y": 0
        }
      ],
      "axisTickValues": {
        "x": [
          -2,
          3
        ],
        "y": []
      }
    },
    "caption": "y=x+k가 (-2,0)을 지나는 k=2와 접하는 k=6 사이에서 네 점에서 만난다."
  }
}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-QUADRATIC_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "바깥 구간 근이 (-2, 3) 밖에 놓일 조건 k>2와 안쪽 구간 x^2=6-k의 서로 다른 두 실근 조건 k<6의 교집합을 구한다.", "decisiveStep": "경계점 (-2, 0)을 지날 때 k=2와 위로 볼록한 포물선에 접할 때 k=6을 경계로 2<k<6을 도출하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "이차부등식", "l4": "근의 위치와 해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_INEQUALITY", "templateKey": "TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL", "why": "high1.json H1-RPM-048(DIRECT_ACTIVE): 이차방정식 근의 위치 조건과 판별식 교집합"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "구간별로 나뉜 이차함수 그래프와 직선의 교점 개수를 경계점 통과와 접선 조건으로 판정해야 한다.", "level": "상", "item4slot": {"format": "개수", "slots": {"given": [{"term": "함수", "src": "stem", "quote": "함수 $f(x)$의 그래프"}, {"term": "직선", "src": "stem", "quote": "직선 $y=x+k$"}], "goal": [{"term": "개수", "src": "stem", "quote": "정수 $k$의 개수는?"}], "method": [{"term": "경우분류", "src": "solution", "quote": "(i) 바깥쪽 구간", "evidenceType": "IMPLIED", "justification": "바깥쪽 구간과 안쪽 구간으로 나누어 교점 조건을 구함"}, {"term": "판별식", "src": "solution", "quote": "서로 다른 두 교점이 존재하려면", "evidenceType": "IMPLIED", "justification": "안쪽 구간 이차방정식 x^2=6-k가 서로 다른 두 실근을 가질 조건을 판정함"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $k$"}]}}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 5.6



### 발문



그림과 같이 폭이 \$6\\text{m}\$이고 높이가 \$9\\text{m}\$인 포물선 모양의 조형물이 있다. 조형물이 지면과 만나는 두 지점을 각각 \$A, B\$라 하고, \$B\$로부터 \$2\\text{m}\$ 떨어진 지면 위의 지점 \$C\$에서 조형물에 레이저를 접하게 쏘아 올릴 때, 레이저와 조형물이 만나는 지점의 지면으로부터의 높이 \$h\$는? (단, 단위는 \$\\text{m}\$이다.)



### 선지



① \$5\\text{m}\$ ② \$6\\text{m}\$ ③ \$7\\text{m}\$ ④ \$8\\text{m}\$ ⑤ \$\\frac{15}{2}\\text{m}\$



### 정답



④



### 해설



선분 \$AB\$의 중점을 원점, 지면을 \$x\$축으로 하는 좌표평면을 잡자. 폭이 \$6\\text{m}\$이고 높이가 \$9\\text{m}\$이므로 \$A(-3, 0)\$, \$B(3, 0)\$, 꼭짓점은 \$(0, 9)\$이고, 포물선의 방정식은 \$y=-x^2+9\$ (\$-3 \\le x \\le 3\$) 점 \$C\$는 \$B\$에서 오른쪽으로 \$2\\text{m}\$ 떨어져 있으므로 \$C(5, 0)\$이다. 점 \$C(5, 0)\$을 지나는 직선의 방정식을 \$y=m(x-5)\$라 하면 이 직선이 포물선에 접하므로 \$-x^2+9=m(x-5) \\implies x^2+mx-(5m+9)=0\$ 이 이차방정식이 중근을 가져야 하므로 판별식 \$D=0\$에서 \$D=m^2+4(5m+9)=m^2+20m+36=(m+2)(m+18)=0\$ 따라서 \$m=-2\$ 또는 \$m=-18\$이다. 접점의 \$x\$좌표는 중근 \$x=-\\frac{m}{2}\$이므로

- \$m=-2\$일 때 \$x=1\$ (조형물의 범위 \$-3 \\le x \\le 3\$ 안에 속함)  
- \$m=-18\$일 때 \$x=9\$ (조형물의 범위 밖이므로 제외) 따라서 접점의 지면으로부터의 높이는 \$h=-1^2+9=8\\text{m}\$이다. 그러므로 정답은 ④이다.

```
{
  "stem": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "9",
        "0",
        "-1"
      ],
      "sourceDomain": {
        "kind": "CLOSED_INTERVAL",
        "range": [
          -3,
          3
        ]
      },
      "domain": [
        -3,
        3
      ],
      "viewport": [
        -4,
        6,
        -1,
        11
      ],
      "referenceLines": [
        {
          "id": "laser",
          "slope": "-2",
          "intercept": "10"
        }
      ],
      "requiredPoints": [
        {
          "id": "A",
          "x": -3,
          "y": 0
        },
        {
          "id": "B",
          "x": 3,
          "y": 0
        }
      ],
      "axisTickValues": {
        "x": [
          -3,
          3
        ],
        "y": [
          9
        ]
      }
    },
    "caption": "폭 6m, 높이 9m인 포물선 조형물과 지점 C에서 쏜 레이저 접선"
  },
  "solution": {
    "capability": "polynomial-spike-v1",
    "graphPlan": {
      "family": "polynomial",
      "coefficients": [
        "9",
        "0",
        "-1"
      ],
      "sourceDomain": {
        "kind": "CLOSED_INTERVAL",
        "range": [
          -3,
          3
        ]
      },
      "domain": [
        -3,
        3
      ],
      "viewport": [
        -4,
        6,
        -1,
        11
      ],
      "referenceLines": [
        {
          "id": "laser",
          "slope": "-2",
          "intercept": "10"
        }
      ],
      "requiredPoints": [
        {
          "id": "A",
          "x": -3,
          "y": 0
        },
        {
          "id": "B",
          "x": 3,
          "y": 0
        },
        {
          "id": "P",
          "x": 1,
          "y": 8
        }
      ],
      "axisTickValues": {
        "x": [
          -3,
          1,
          3
        ],
        "y": [
          8,
          9
        ]
      }
    },
    "caption": "접점 (1, 8)이 조형물 범위 -3<=x<=3 안에 있으므로 높이 h=8m이다."
  }
}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "좌표평면을 도입해 포물선 y=-x^2+9와 C(5,0)을 지나는 접선 D=0에서 기울기 m=-2, 접점 (1,8)을 구한다.", "decisiveStep": "두 접선 기울기 m=-2, -18 중 접점의 x좌표가 조형물 정의역 [-3, 3]에 속하는 m=-2만 선택하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036(DIRECT_ACTIVE): 좌표화 후 포물선 접선 조건 D=0으로 접점 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 5, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B45", "difficultyReason": "실생활 도형에 좌표계를 직접 설정하고 접선 판별식 두 해 중 정의역 조건을 만족하는 해를 걸러내야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "포물선", "src": "stem", "quote": "포물선 모양의 조형물이 있다."}], "goal": [{"term": "높이", "src": "stem", "quote": "높이 $h$는?"}], "method": [{"term": "좌표", "src": "solution", "quote": "좌표평면을 잡자.", "evidenceType": "IMPLIED", "justification": "지면을 x축, AB 중점을 원점으로 좌표계를 도입함"}, {"term": "판별식", "src": "solution", "quote": "판별식 $D=0$에서", "evidenceType": "NAMED"}], "condition": [{"term": "접함", "src": "stem", "quote": "레이저를 접하게 쏘아 올릴 때"}]}}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 5.5



### 발문



\$x\$에 대한 이차방정식 \$x^2-4kx+4k^2-k+3=0\$이 두 실근 \$\\alpha, \\beta\$를 가질 때, \$\\alpha^3+\\beta^3-16k^3\$의 최솟값은? (단, \$k\$는 실수이다.)



### 선지



① \$-27\$ ② \$-12\$ ③ \$0\$ ④ \$12\$ ⑤ \$27\$



### 정답



③



### 해설



이차방정식이 두 실근을 가지므로 판별식 \$D \\ge 0\$이어야 한다. \$\\frac{D}{4}=(2k)^2-(4k^2-k+3)=k-3 \\ge 0 \\implies k \\ge 3\$ 근과 계수의 관계에 의하여 \$\\alpha+\\beta=4k\$, \$\\alpha\\beta=4k^2-k+3\$이다. \$\\begin{aligned} \\alpha^3+\\beta^3 &= (\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta) \\ &= (4k)^3-3(4k^2-k+3)(4k) \\ &= 64k^3-48k^3+12k^2-36k \\ &= 16k^3+12k^2-36k \\end{aligned}\$ 따라서 \$\\alpha^3+\\beta^3-16k^3=12k^2-36k=12\\left(k-\\frac{3}{2}\\right)^2-27\$ \$k \\ge 3\$에서 이차식 \$12\\left(k-\\frac{3}{2}\\right)^2-27\$은 \$k=3\$일 때 최솟값을 가지므로 최솟값은 \$12\\cdot 3^2-36\\cdot 3=108-108=0\$ 따라서 정답은 ③이다.

```
"NONE"
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "실근 조건 D/4>=0으로 k>=3을 구하고 곱셈공식 변형으로 식을 12k^2-36k로 정리해 k=3에서 최솟값 0을 구한다.", "decisiveStep": "판별식에서 얻은 k>=3 범위가 이차식의 축 k=3/2 오른쪽에 있어 경계 k=3에서 최솟값이 나옴을 판정하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 실근 조건 D/4>=0 범위에서 이차식 최솟값 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "판별식으로 실수 k의 범위를 먼저 구한 뒤 세제곱 합 식을 k의 이차함수로 바꾸어 제한 범위 최솟값을 구해야 한다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-4kx+4k^2-k+3=0$"}], "goal": [{"term": "최솟값", "src": "stem", "quote": "$\\alpha^3+\\beta^3-16k^3$의 최솟값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D \\ge 0$이어야 한다.", "evidenceType": "NAMED"}, {"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "실근", "src": "stem", "quote": "두 실근 $\\alpha, \\beta$를 가질 때"}]}}, "hold": ""}
```

## Q19

- 형식: 서술형  
- 배점: 4



### 발문



\[서술형 1번\] 다음 인수분해 공식의 빈칸을 완성하고, 이를 이용하여 (6)\~(8)의 다항식을 인수분해하시오. \[각 0.5점, 4점\] (1) \$a^3+3a^2b+3ab^2+b^3 \= \$ (2) \$a^3-3a^2b+3ab^2-b^3 \= \$ (3) \$a^2+b^2+c^2+2ab+2bc+2ca \= \$ (4) \$a^3+b^3 \= \$ (5) \$a^3-b^3 \= \$ (6) \$4x^2+y^2+9z^2-4xy+6yz-12zx\$ (7) \$27x^3-27x^2+9x-1\$ (8) \$x^3+64\$



### 선지



없음



### 정답



(1) \$(a+b)^3\$ (2) \$(a-b)^3\$ (3) \$(a+b+c)^2\$ (4) \$(a+b)(a^2-ab+b^2)\$ (5) \$(a-b)(a^2+ab+b^2)\$ (6) \$(2x-y-3z)^2\$ (7) \$(3x-1)^3\$ (8) \$(x+4)(x^2-4x+16)\$



### 해설



인수분해 공식을 차례로 적용하면 (1) \$a^3+3a^2b+3ab^2+b^3=(a+b)^3\$ (2) \$a^3-3a^2b+3ab^2-b^3=(a-b)^3\$ (3) \$a^2+b^2+c^2+2ab+2bc+2ca=(a+b+c)^2\$ (4) \$a^3+b^3=(a+b)(a^2-ab+b^2)\$ (5) \$a^3-b^3=(a-b)(a^2+ab+b^2)\$ (6) \$4x^2+y^2+9z^2-4xy+6yz-12zx=(2x)^2+(-y)^2+(-3z)^2+2(2x)(-y)+2(-y)(-3z)+2(-3z)(2x)=(2x-y-3z)^2\$ (7) \$27x^3-27x^2+9x-1=(3x)^3-3(3x)^2\\cdot 1+3(3x)\\cdot 1^2-1^3=(3x-1)^3\$ (8) \$x^3+64=x^3+4^3=(x+4)(x^2-4x+16)\$

```
"NONE"
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "다항식의 기본 인수분해 공식 5가지를 채운 뒤 각각에 항을 대응시켜 (6)~(8)을 인수분해한다.", "decisiveStep": "각 문항의 계수 부호와 세제곱·제곱 항의 밑을 공식에 맞추어 대응시키는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "제곱식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-015(DIRECT_ACTIVE): 기본 인수분해 공식 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "교과서 기본 인수분해 공식을 직접 쓰고 그대로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"format": "서술", "slots": {"given": [{"term": "다항식", "src": "stem", "quote": "(6)~(8)의 다항식을"}], "goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하시오."}], "method": [{"term": "인수분해", "src": "solution", "quote": "인수분해 공식을 차례로 적용하면", "evidenceType": "NAMED"}], "condition": []}}, "hold": ""}
```

## Q20

- 형식: 서술형  
- 배점: 6



### 발문



\[서술형 2번\] 최고차항의 계수가 \$1\$인 삼차식 \$P(x)\$에 대하여 \$P(1)=2\$, \$P(2)=5\$, \$P(3)=10\$일 때, \$P(x)\$를 \$(x-1)(3x-6)\$으로 나누었을 때의 몫과 나머지를 구하시오. \[6점\]



### 선지



없음



### 정답



몫: \$\\frac{1}{3}x-\\frac{2}{3}\$, 나머지: \$3x-1\$



### 해설



\$P(1)=1^2+1\$, \$P(2)=2^2+1\$, \$P(3)=3^2+1\$이므로 \$P(x)-(x^2+1)\$은 \$x=1, 2, 3\$에서 모두 \$0\$이다. \$P(x)\$는 최고차항의 계수가 \$1\$인 삼차식이므로 인수정리에 의하여 \$P(x)-(x^2+1)=(x-1)(x-2)(x-3) \\implies P(x)=(x-1)(x-2)(x-3)+x^2+1\$ 나누는 식이 \$(x-1)(3x-6)=3(x-1)(x-2)\$이므로 몫을 \$Q(x)\$, 나머지를 \$ax+b\$ (\$a, b\$는 상수)라 하면 \$P(x)=3(x-1)(x-2)Q(x)+ax+b\$ \$x=1\$을 대입하면 \$a+b=P(1)=2\$, \$x=2\$를 대입하면 \$2a+b=P(2)=5\$이므로 \$a=3\$, \$b=-1\$이다. 따라서 나머지는 \$3x-1\$이다. 또한 \$\\begin{aligned} P(x)-(3x-1) &= (x-1)(x-2)(x-3)+x^2-3x+2 \\ &= (x-1)(x-2)(x-3)+(x-1)(x-2) \\ &= (x-1)(x-2)^2 \\end{aligned}\$ 이므로 몫은 \$Q(x)=\\frac{1}{3}(x-2)=\\frac{1}{3}x-\\frac{2}{3}\$이다.

```
"NONE"
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "P(k)=k^2+1 규칙으로 P(x)=(x-1)(x-2)(x-3)+x^2+1을 세우고, 3(x-1)(x-2)로 나눈 나머지와 몫을 구한다.", "decisiveStep": "P(k)=k^2+1 패턴을 발견해 인수정리로 P(x)를 확정하고 제수 계수 3을 몫에 반영하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 규칙성 인수정리로 P(x) 설정 후 나눗셈 몫·나머지 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "medium", "difficultyBoundaryFlag": "B34", "difficultyReason": "세 함숫값의 이차식 패턴 파악, 인수정리 식 세우기, 일차 나머지 결정 및 몫 조정을 모두 수행해야 한다.", "level": "상", "item4slot": {"format": "서술", "slots": {"given": [{"term": "삼차식", "src": "stem", "quote": "최고차항의 계수가 $1$인 삼차식 $P(x)$"}], "goal": [{"term": "다항식의나눗셈", "src": "stem", "quote": "나누었을 때의 몫과 나머지를 구하시오."}, {"term": "나머지", "src": "stem", "quote": "나머지를 구하시오."}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여", "evidenceType": "NAMED"}], "condition": [{"term": "최고차항", "src": "stem", "quote": "최고차항의 계수가 $1$인"}]}}, "hold": ""}
```

## Q21

- 형식: 서술형  
- 배점: 5



### 발문



\[서술형 3번\] 민수와 지수가 이차방정식 \$x^2+ax+b=0\$ (\$a, b\$는 실수)의 근을 구하려고 한다. 그런데 민수는 \$x\$의 계수를 잘못 보고 풀어 두 근 \$3+i, 3-i\$를 얻었고, 지수는 상수항을 잘못 보고 풀어 두 근 \$1+2i, 1-2i\$를 얻었다. 이차방정식 \$x^2+ax+b=0\$의 올바른 두 근을 구하시오. (단, \$i=\\sqrt{-1}\$이다.) \[5점\]



### 선지



없음



### 정답



\$1 \\pm 3i\$



### 해설



민수는 \$x\$의 계수만 잘못 보았으므로 상수항 \$b\$는 바르게 보았다. 근과 계수의 관계에 의하여 \$b=(3+i)(3-i)=9-i^2=10\$ 지수는 상수항만 잘못 보았으므로 \$x\$의 계수 \$a\$는 바르게 보았다. 근과 계수의 관계에 의하여 \$-a=(1+2i)+(1-2i)=2 \\implies a=-2\$ 따라서 올바른 이차방정식은 \$x^2-2x+10=0\$이다. 근의 공식을 이용하면 \$x=\\frac{2\\pm\\sqrt{(-2)^2-4\\cdot 1\\cdot 10}}{2}=\\frac{2\\pm\\sqrt{-36}}{2}=\\frac{2\\pm 6i}{2}=1\\pm 3i\$ 그러므로 올바른 두 근은 \$1\\pm 3i\$이다.

```
"NONE"
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-QUADRATIC_SOLVING", "conceptClusterKey": null, "primaryMethod": "민수의 두 근 곱으로 b=10, 지수의 두 근 합으로 a=-2를 구해 올바른 방정식 x^2-2x+10=0의 근 1+-3i를 구한다.", "decisiveStep": "잘못 본 계수를 제외하고 바르게 본 상수항 b와 일차항 계수 a를 각각 근과 계수의 관계로 복원하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "인수분해·근의 공식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-027(RPM_ONLY): 잘못 본 계수 제외 후 올바른 이차방정식 근 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "잘못 본 계수 문제에서 합·곱을 분리 적용한 뒤 올바른 이차방정식의 허근을 구하는 문항이다.", "level": "중", "item4slot": {"format": "서술", "slots": {"given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+ax+b=0$"}], "goal": [{"term": "허근", "src": "stem", "quote": "올바른 두 근을 구하시오."}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}, {"term": "근의공식", "src": "solution", "quote": "근의 공식을 이용하면", "evidenceType": "NAMED"}], "condition": [{"term": "실수", "src": "stem", "quote": "$a, b$는 실수"}]}}, "hold": "RPM_ONLY"}
```

