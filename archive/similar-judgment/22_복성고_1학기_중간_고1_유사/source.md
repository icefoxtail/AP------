

```
{"stem": "22_복성고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_복성고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3

### 발문

두 점 \$A(2, \-1)\$, \$B(-2, 2)\$ 사이의 거리는?

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$\\sqrt{10}\$ ⑤ \$\\sqrt{13}\$

### 정답

②

### 해설

두 점 \$A(2, \-1)\$, \$B(-2, 2)\$ 사이의 거리는 \$\$ \\begin{aligned} \\overline{AB} &= \\sqrt{(-2-2)^2+{2-(-1)}^2} \\ &= \\sqrt{(-4)^2+3^2} \\ &= \\sqrt{16+9} \= \\sqrt{25} \= 5 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 점 사이의 거리 공식을 직접 대입 계산하는 순수 좌표 계산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-09", "subUnitKey": "H15-SA-09-COORDINATE_METRIC", "conceptClusterKey": null, "primaryMethod": "두 점 $A(2,-1)$, $B(-2,2)$에 두 점 사이의 거리 공식 $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$을 적용한다.", "decisiveStep": "$\\sqrt{(-4)^2+3^2}=\\sqrt{25}=5$를 계산한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "평면좌표", "l3": "두 점 사이의 거리", "l4": "거리 공식"}, "ptTplCandidate": {"problemTypeKey": "PT_COORD_DISTANCE", "templateKey": "TPL_COORD_DISTANCE_DIRECT", "why": "high1.json H1-RPM-053(DIRECT_ACTIVE): 두 점 사이의 거리 공식을 직접 적용해 거리를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 점 사이의 거리 공식에 좌표를 바로 대입하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "거리", "src": "stem", "quote": "사이의 거리는?"}], "method": [{"term": "거리", "src": "solution", "quote": "사이의 거리는", "evidenceType": "IMPLIED", "justification": "피타고라스 정리 기반 두 점 사이의 거리 공식 적용"}], "given": [{"term": "좌표", "src": "solution", "quote": "두 점"}], "condition": []}, "reasons": {"method": "두 점 사이의 거리 공식에 두 점의 좌표를 대입해 거리를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3

### 발문

다음 중 중심이 \$(2, \-3)\$이고 반지름의 길이가 \$3\$인 원의 방정식은?

### 선지

① \$(x-2)^2+(y+3)^2=3\$ ② \$(x+2)^2+(y-3)^2=3\$ ③ \$(x+2)^2+(y-3)^2=9\$ ④ \$(x-2)^2+(y+3)^2=9\$ ⑤ \$(x-2)+(y+3)=9\$

### 정답

④

### 해설

중심이 \$(a, b)\$이고 반지름의 길이가 \$r\$인 원의 방정식은 \$(x-a)^2+(y-b)^2=r^2\$이다. \$a=2\$, \$b=-3\$, \$r=3\$을 대입하면 \$\$ (x-2)^2+(y+3)^2=3^2=9 \$\$ 이다.

```
{"capability": "plane", "title": "중심이 (2, -3)이고 반지름이 3인 원", "points": [{"id": "C", "x": 2, "y": -3, "label": "C(2,-3)"}, {"id": "P", "x": 5, "y": -3, "label": ""}], "circles": [{"id": "k", "center": "C", "radius": 3}], "segments": [{"id": "r1", "from": "C", "to": "P", "label": "3"}], "caption": "중심이 (2, -3)이고 반지름의 길이가 3인 원"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-11", "subUnitKey": "H15-SA-11-CIRCLE_EQUATION", "conceptClusterKey": null, "primaryMethod": "원의 중심 $(2,-3)$과 반지름 $3$을 원의 표준형 방정식 $(x-a)^2+(y-b)^2=r^2$에 대입한다.", "decisiveStep": "우변이 반지름의 제곱 $3^2=9$이고 부호가 $(x-2)^2+(y+3)^2$임을 확인한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "원의 방정식", "l3": "원의 방정식", "l4": "중심과 반지름"}, "ptTplCandidate": {"problemTypeKey": "PT_CIRCLE_EQUATION", "templateKey": "TM_CIRCLE_CENTER_RADIUS", "why": "high1.json H1-RPM-066(DIRECT_ACTIVE): 중심과 반지름으로 원의 표준형 방정식을 작성함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원의 중심과 반지름이 주어졌을 때 원의 방정식 표준형을 바로 세우는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "원의방정식", "src": "stem", "quote": "원의 방정식은?"}], "method": [{"term": "원", "src": "solution", "quote": "원의 방정식은 $(x-a)^2+(y-b)^2=r^2$", "evidenceType": "IMPLIED", "justification": "중심과 반지름이 주어진 원의 표준형 공식 대입"}], "given": [{"term": "반지름", "src": "stem", "quote": "반지름의 길이가 $3$"}], "condition": []}, "reasons": {"method": "원의 방정식 표준형 공식에 중심 좌표와 반지름을 대입함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.5

### 발문

두 다항식 \$A=3x^2-xy+2y^2\$, \$B=4x^2-2xy+y^2\$에 대하여 \$2A-B\$는?

### 선지

① \$2x^2+3y^2\$ ② \$2x^2-3y^2\$ ③ \$2x^2-4xy+3y^2\$ ④ \$x^2+3y^2\$ ⑤ \$10x^2-4xy+5y^2\$

### 정답

①

### 해설

먼저 \$2A\$를 구하면 \$2A=6x^2-2xy+4y^2\$이다. 따라서 \$\$ \\begin{aligned} 2A-B &= (6x^2-2xy+4y^2)-(4x^2-2xy+y^2) \\ &= (6-4)x^2+(-2+2)xy+(4-1)y^2 \\ &= 2x^2+3y^2 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 다항식의 실수배와 뺄셈을 동류항끼리 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$2A=6x^2-2xy+4y^2$을 먼저 계산한 뒤 $B=4x^2-2xy+y^2$을 동류항별로 뺀다.", "decisiveStep": "$xy$항이 $-2xy-(-2xy)=0$으로 소거되어 $2x^2+3y^2$이 남는다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002(DIRECT_ACTIVE): 다항식 2A-B에서 동류항을 정리함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 실수배와 뺄셈에서 동류항 계수를 정리하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=3x^2-xy+2y^2$"}], "method": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=3x^2-xy+2y^2$", "evidenceType": "IMPLIED", "justification": "다항식의 실수배 및 뺄셈 연산"}], "given": [{"term": "계수", "src": "solution", "quote": "2A=6x^2-2xy+4y^2"}], "condition": []}, "reasons": {"method": "2A를 계산한 뒤 B를 빼서 동류항끼리 정리함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.5

### 발문

\$(ax+2)(x+b)=2x^2+cx+10\$이 \$x\$에 대한 항등식이 되도록 하는 상수 \$a\$, \$b\$, \$c\$를 바르게 구한 것은?

### 선지

① \$a=2,; b=5,; c=7\$ ② \$a=2,; b=4,; c=10\$ ③ \$a=1,; b=5,; c=7\$ ④ \$a=2,; b=5,; c=10\$ ⑤ \$a=2,; b=5,; c=12\$

### 정답

⑤

### 해설

좌변을 전개하면 \$\$ (ax+2)(x+b) \= ax^2+(ab+2)x+2b \$\$ 우변 \$2x^2+cx+10\$과 양변의 계수를 비교하면 \$\$ a=2, \\qquad 2b=10 \\implies b=5, \\qquad c=ab+2=2\\cdot 5+2=12 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "좌변 전개 후 계수비교법으로 상수 a, b, c를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "좌변 $(ax+2)(x+b)$를 전개해 $ax^2+(ab+2)x+2b$로 정리한 뒤 우변과 계수비교를 수행한다.", "decisiveStep": "$2b=10$에서 $b=5$, $a=2$를 구해 $c=ab+2=12$를 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 다항식 전개 후 계수비교법으로 미정계수를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식의 곱을 전개하여 항등식의 계수를 바로 비교하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$, $c$를"}], "method": [{"term": "계수비교", "src": "solution", "quote": "양변의 계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "stem", "quote": "$x$에 대한 항등식이 되도록"}], "condition": []}, "reasons": {"method": "좌변 전개 후 항등식의 계수비교법으로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

점 \$(2, \-3)\$을 지나고 기울기가 \$3\$인 직선의 방정식을 \$y=f(x)\$라 하자. \$f(4)\$의 값은?

### 선지

① \$-3\$ ② \$0\$ ③ \$3\$ ④ \$6\$ ⑤ \$9\$

### 정답

③

### 해설

점 \$(2, \-3)\$을 지나고 기울기가 \$3\$인 직선의 방정식은 \$\$ y-(-3) \= 3(x-2) \\implies y \= 3x-9 \$\$ 따라서 \$f(x)=3x-9\$이므로 \$f(4)=3\\cdot 4-9=3\$이다.

```
{"status": "EXEMPT", "reason": "한 점과 기울기가 주어진 직선의 방정식을 세워 함숫값을 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-10", "subUnitKey": "H15-SA-10-LINE_EQUATION", "conceptClusterKey": null, "primaryMethod": "점 $(2,-3)$과 기울기 $3$을 직선의 방정식 공식 $y-y_1=m(x-x_1)$에 대입해 $f(4)$를 구한다.", "decisiveStep": "$f(x)=3x-9$를 세워 $f(4)=3$을 계산한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "직선의 방정식", "l3": "직선의 방정식", "l4": "한 점과 기울기"}, "ptTplCandidate": {"problemTypeKey": "PT_LINE_EQUATION", "templateKey": "TPL_LINE_POINT_SLOPE", "why": "high1.json H1-RPM-059(DIRECT_ACTIVE): 한 점과 기울기로 직선의 방정식을 세워 함숫값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "한 점과 기울기가 주어진 직선의 방정식을 세워 대입하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "직선", "src": "stem", "quote": "직선의 방정식을 $y=f(x)$"}], "method": [{"term": "기울기", "src": "stem", "quote": "기울기가 $3$인", "evidenceType": "IMPLIED", "justification": "점과 기울기를 이용한 직선의 방정식 공식 적용"}], "given": [{"term": "직선", "src": "stem", "quote": "점 $(2, -3)$을 지나고"}], "condition": []}, "reasons": {"method": "점과 기울기로 직선의 방정식을 세워 f(4)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

\$x-y=5\$, \$xy=-2\$일 때, \$x^3-y^3\$의 값은?

### 선지

① \$85\$ ② \$95\$ ③ \$105\$ ④ \$115\$ ⑤ \$125\$

### 정답

②

### 해설

곱셈 공식의 변형에 의하여 \$\$ \\begin{aligned} x^3-y^3 &= (x-y)^3+3xy(x-y) \\ &= 5^3+3(-2)\\cdot 5 \\ &= 125-30 \= 95 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "세제곱의 차 곱셈 공식 변형에 수치를 대입해 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "곱셈 공식 변형 $x^3-y^3=(x-y)^3+3xy(x-y)$에 $x-y=5, xy=-2$를 대입한다.", "decisiveStep": "$125+3(-2)(5)=95$를 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 곱셈 공식 변형으로 x^3-y^3의 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세제곱의 차 변형 공식에 주어진 두 값을 바로 대입하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "stem", "quote": "$x^3-y^3$의 값은?"}], "method": [{"term": "곱", "src": "stem", "quote": "$xy=-2$일 때", "evidenceType": "IMPLIED", "justification": "차와 곱이 주어졌을 때 세제곱 차 변형 공식 적용"}], "given": [{"term": "곱", "src": "stem", "quote": "$xy=-2$"}], "condition": []}, "reasons": {"method": "세제곱의 차 변형 공식에 x-y와 xy를 대입해 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.5

### 발문

다음 중 다항식 \$9x^4+6x^3+2x-1\$의 인수가 아닌 것은?

### 선지

① \$3x+1\$ ② \$x+1\$ ③ \$3x-1\$ ④ \$3x^2+1\$ ⑤ \$3x^2+2x-1\$

### 정답

①

### 해설

\$P(x)=9x^4+6x^3+2x-1\$이라 두면 \$P(-1)=9-6-2-1=0\$이므로 \$x+1\$은 인수이다. 조립제법 또는 나눗셈으로 \$P(x)\$를 \$x+1\$로 나누면 \$\$ \\begin{aligned} P(x) &= (x+1)(9x^3-3x^2+3x-1) \\ &= (x+1){3x^2(3x-1)+(3x-1)} \\ &= (x+1)(3x-1)(3x^2+1) \\end{aligned} \$\$ 또 \$(x+1)(3x-1)=3x^2+2x-1\$이므로 ②, ③, ④, ⑤는 모두 \$P(x)\$의 인수이다. 따라서 인수가 아닌 것은 ① \$3x+1\$이다.

```
{"status": "EXEMPT", "reason": "사차다항식을 인수정리와 조립제법으로 인수분해해 인수가 아닌 보기를 고르는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$P(-1)=0$을 이용해 $x+1$로 나눈 뒤 $9x^3-3x^2+3x-1=(3x-1)(3x^2+1)$로 인수분해하여 모든 인수를 확인한다.", "decisiveStep": "인수정리로 $(x+1)$을 분리하고 삼차식을 항 두 개씩 묶어 $(3x-1)(3x^2+1)$로 인수분해한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 인수정리로 (x+1)을 분리하고 단계적으로 인수분해함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리로 일차 인수를 찾고 나머지 삼차식을 공통인수 묶기로 인수분해하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "인수가 아닌 것은?"}], "method": [{"term": "인수정리", "src": "solution", "quote": "$P(-1)=9-6-2-1=0$이므로 $x+1$은 인수", "evidenceType": "IMPLIED", "justification": "P(-1)=0을 이용해 일차인수 x+1을 찾아 나눗셈함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $9x^4+6x^3+2x-1$"}], "condition": []}, "reasons": {"method": "인수정리로 x+1을 분리하고 삼차식을 인수분해해 보기를 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.5

### 발문

다음은 좌표평면 위의 도형에 대한 설명이다. 항상 옳은 것의 개수는? \<보기\> ㄱ. 선분 \$AB\$를 \$2:1\$로 내분하는 점은 선분 \$BA\$를 \$1:2\$로 내분하는 점과 같다. ㄴ. 선분 \$AB\$를 \$1:2\$로 외분하는 점은 선분 \$AB\$ 위에 있다. ㄷ. 두 점 \$A(x\_1, y\_1)\$, \$B(x\_2, y\_2)\$를 지름의 양 끝으로 하는 원의 중심은 선분 \$AB\$의 중점이다. ㄹ. 기울기가 \$m\$이고 \$y\$절편이 \$n\$인 직선의 방정식은 \$y=mx+n\$이다.

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

④

### 해설

각 문장의 참·거짓을 판별한다.

- ㄱ. 선분 \$AB\$ 위에서 \$A\$로부터 거리 비가 \$2:1\$인 점은 \$B\$로부터 거리 비가 \$1:2\$이므로 선분 \$BA\$를 \$1:2\$로 내분하는 점과 같다. (참)  
- ㄴ. 외분점은 선분 \$AB\$의 연장선 위에 있으므로 선분 \$AB\$ 위에 있지 않다. (거짓)  
- ㄷ. 지름의 양 끝점의 중점이 원의 중심이다. (참)  
- ㄹ. 기울기가 \$m\$이고 \$y\$절편이 \$n\$인 직선은 \$y=mx+n\$으로 유일하게 나타난다. (참) 따라서 항상 옳은 것은 ㄱ, ㄷ, ㄹ의 \$3\$개이다.

```
{"status": "EXEMPT", "reason": "내분점·외분점·원의 중심·직선의 방정식 개념의 참거짓을 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "8", "variationType": "CONDITION", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-09", "subUnitKey": "H15-SA-09-GEOMETRY_APPLICATION", "conceptClusterKey": null, "primaryMethod": "내분점과 외분점의 위치 정의, 지름의 중점 성질, 기울기-y절편 표준형 정의를 각각 검증한다.", "decisiveStep": "외분점은 선분 자체가 아니라 연장선 위에 있음을 이용해 ㄴ이 거짓임을 가려낸다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "평면좌표", "l3": "선분의 내분·외분", "l4": "내분점"}, "ptTplCandidate": {"problemTypeKey": "PT_COORD_SECTION", "templateKey": "TPL_SECTION_INTERNAL", "why": "high1.json H1-RPM-055(DIRECT_BINDING_GAP): 내분점·외분점 정의와 중점·직선 표준형 명제를 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "좌표평면 위의 선분 내·외분점, 원, 직선의 기본 개념을 묻는 개념 판별 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "항상 옳은 것의 개수는?"}], "method": [{"term": "내분", "src": "solution", "quote": "선분 $BA$를 $1:2$로 내분하는 점", "evidenceType": "IMPLIED", "justification": "내분점과 외분점, 원의 중심 정의에 기반한 개념 판별"}], "given": [{"term": "직선", "src": "stem", "quote": "직선의 방정식은 $y=mx+n$"}], "condition": []}, "reasons": {"method": "선분 내·외분점, 원의 중심, 직선의 방정식 개념의 정오를 판별함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q09

- 형식: 객관식  
- 배점: 4.5

### 발문

\$\\dfrac{5+12i}{12-5i}=a+bi\$를 만족시키는 실수 \$a\$, \$b\$에 대하여 \$a+b\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-1\$ ② \$-\\dfrac{1}{13}\$ ③ \$1\$ ④ \$\\dfrac{1}{13}\$ ⑤ \$\\dfrac{5}{13}\$

### 정답

③

### 해설

분모의 켤레복소수 \$12+5i\$를 분모와 분자에 곱하면 \$\$ \\frac{5+12i}{12-5i} \= \\frac{(5+12i)(12+5i)}{(12-5i)(12+5i)} \= \\frac{60+25i+144i-60}{144+25} \= \\frac{169i}{169} \= i \$\$ 따라서 \$a=0\$, \$b=1\$이므로 \$a+b=1\$이다.

```
{"status": "EXEMPT", "reason": "복소수 분모 실수화로 실수부와 허수부를 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모 $12-5i$의 켤레복소수 $12+5i$를 분모·분자에 곱해 $a+bi=i$를 얻는다.", "decisiveStep": "분자의 실수부분 $60-60=0$이 소거되어 $\\frac{169i}{169}=i$로 단순화된다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 분모의 켤레복소수를 곱해 복소수 나눗셈을 정리함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 나눗셈의 분모 실수화를 계산해 실수부와 허수부를 더하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$, $b$에 대하여"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모의 켤레복소수 $12+5i$를", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "solution", "quote": "분모의 켤레복소수"}], "condition": []}, "reasons": {"method": "분모의 켤레복소수를 곱해 분모를 실수화한 뒤 a+b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.5

### 발문

세 점 \$A(-2, 3)\$, \$B(4, \-1)\$, \$C(7, 4)\$에 대하여 삼각형 \$ABC\$의 세 변 \$AB\$, \$BC\$, \$CA\$를 \$2:1\$로 내분하는 점을 각각 \$D\$, \$E\$, \$F\$라 하자. 삼각형 \$DEF\$의 무게중심의 좌표를 \$(a, b)\$라 할 때, \$a+b\$의 값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

⑤

### 해설

세 변을 각각 \$2:1\$로 내분하는 점 \$D, E, F\$의 좌표를 구하면 \$\$ \\begin{aligned} D &= \\left(\\frac{-2+2\\cdot 4}{3}, \\frac{3+2\\cdot(-1)}{3}\\right) \= \\left(2, \\frac{1}{3}\\right) \\ E &= \\left(\\frac{4+2\\cdot 7}{3}, \\frac{-1+2\\cdot 4}{3}\\right) \= \\left(6, \\frac{7}{3}\\right) \\ F &= \\left(\\frac{7+2\\cdot(-2)}{3}, \\frac{4+2\\cdot 3}{3}\\right) \= \\left(1, \\frac{10}{3}\\right) \\end{aligned} \$\$ 따라서 삼각형 \$DEF\$의 무게중심 \$(a, b)\$는 \$\$ a \= \\frac{2+6+1}{3} \= 3, \\qquad b \= \\frac{\\frac{1}{3}+\\frac{7}{3}+\\frac{10}{3}}{3} \= \\frac{6}{3} \= 2 \$\$ 그러므로 \$a+b=3+2=5\$이다.

```
{"capability": "plane", "title": "삼각형 ABC와 각 변의 2:1 내분점 D, E, F", "points": [{"id": "A", "x": -2, "y": 3, "label": "A(-2,3)"}, {"id": "B", "x": 4, "y": -1, "label": "B(4,-1)"}, {"id": "C", "x": 7, "y": 4, "label": "C(7,4)"}, {"id": "D", "x": 2, "y": 0.33, "label": "D"}, {"id": "E", "x": 6, "y": 2.33, "label": "E"}, {"id": "F", "x": 1, "y": 3.33, "label": "F"}], "segments": [{"id": "sAB", "from": "A", "to": "B"}, {"id": "sBC", "from": "B", "to": "C"}, {"id": "sCA", "from": "C", "to": "A"}, {"id": "sDE", "from": "D", "to": "E"}, {"id": "sEF", "from": "E", "to": "F"}, {"id": "sFD", "from": "F", "to": "D"}], "caption": "삼각형 ABC의 세 변을 2:1로 내분하는 점 D, E, F로 만든 삼각형 DEF"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-09", "subUnitKey": "H15-SA-09-TRIANGLE_CENTROID_AREA", "conceptClusterKey": null, "primaryMethod": "세 변의 $2:1$ 내분점 $D, E, F$의 좌표를 공식으로 구한 뒤 세 점의 산술평균으로 무게중심 $(a,b)$를 구한다.", "decisiveStep": "분모가 $3$인 내분점 좌표의 평균을 내어 무게중심 $(3,2)$를 구한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "평면좌표", "l3": "삼각형의 무게중심", "l4": "좌표로 무게중심"}, "ptTplCandidate": {"problemTypeKey": "PT_COORD_CENTROID", "templateKey": "TPL_CENTROID_DIRECT", "why": "high1.json H1-RPM-057(DIRECT_ACTIVE): 내분점 좌표와 산술평균으로 삼각형 무게중심을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "선분의 내분점 좌표 공식과 삼각형의 무게중심 공식을 순서대로 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "무게중심", "src": "stem", "quote": "무게중심의 좌표를 $(a, b)$"}], "method": [{"term": "내분", "src": "stem", "quote": "$2:1$로 내분하는 점", "evidenceType": "IMPLIED", "justification": "내분점 공식으로 D, E, F를 구한 뒤 무게중심 공식을 적용함"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $ABC$의 세 변"}], "condition": []}, "reasons": {"method": "내분점 공식으로 D, E, F를 구하고 무게중심 좌표를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.7

### 발문

다항식 \$P(x)\$를 \$x-2\$로 나누었을 때의 나머지는 \$-5\$이고, \$x-4\$로 나누었을 때의 나머지는 \$3\$이다. \$P(x)\$를 \$x^2-6x+8\$로 나누었을 때의 나머지를 \$R(x)\$라 하면 \$R(5)\$의 값은?

### 선지

① \$5\$ ② \$7\$ ③ \$9\$ ④ \$11\$ ⑤ \$13\$

### 정답

②

### 해설

\$x^2-6x+8=(x-2)(x-4)\$로 나눈 나머지 \$R(x)\$는 일차 이하이므로 \$R(x)=ax+b\$라 두자. 나머지정리에 의해 \$P(2)=-5\$, \$P(4)=3\$이므로 \$\$ \\begin{aligned} R(2) &= 2a+b \= \-5 \\ R(4) &= 4a+b \= 3 \\end{aligned} \$\$ 두 식을 빼면 \$2a=8\$이므로 \$a=4\$이고, 대입하면 \$b=-13\$이다. 따라서 \$R(x)=4x-13\$이고 \$R(5)=4\\cdot 5-13=7\$이다.

```
{"status": "EXEMPT", "reason": "이차식으로 나눈 나머지를 ax+b로 두고 나머지정리를 연립하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x^2-6x+8=(x-2)(x-4)$로 나눈 나머지를 $R(x)=ax+b$로 두고 $P(2)=-5, P(4)=3$을 연립해 $R(5)$를 구한다.", "decisiveStep": "$2a+b=-5$와 $4a+b=3$을 연립해 $R(x)=4x-13$을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 제수 인수분해 후 나머지정리를 연립해 나머지를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식 나눗셈의 나머지 차수 설정과 나머지정리 연립을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 하면"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의해", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": []}, "reasons": {"method": "나머지 R(x)=ax+b를 세우고 두 일차식 나머지 조건을 연립함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.7

### 발문

평행한 두 직선 \$5x+12y-3=0\$, \$5x+12y+k=0\$ 사이의 거리가 \$2\$일 때, 가능한 상수 \$k\$의 값들의 합은?

### 선지

① \$-6\$ ② \$-3\$ ③ \$0\$ ④ \$3\$ ⑤ \$6\$

### 정답

①

### 해설

평행한 두 직선 \$5x+12y-3=0\$, \$5x+12y+k=0\$ 사이의 거리는 \$\$ \\frac{\|k-(-3)\|}{\\sqrt{5^2+12^2}} \= \\frac{\|k+3\|}{13} \= 2 \$\$ 따라서 \$\|k+3\|=26\$이므로 \$k+3=26\$ 또는 \$k+3=-26\$, 즉 \$k=23\$ 또는 \$k=-29\$이다. 그러므로 가능한 상수 \$k\$의 값들의 합은 \$23+(-29)=-6\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-6, 6], "viewport": [-6, 6, -5, 5], "pieces": [{"domain": [-6, 6], "coefficients": ["1/4", "-5/12"]}], "referenceLines": [{"slope": "-5/12", "intercept": "-23/12", "label": "5x+12y+23=0"}], "requiredPoints": []}, "caption": "평행한 두 직선 5x+12y-3=0과 5x+12y+23=0 사이의 거리 2"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-10", "subUnitKey": "H15-SA-10-DISTANCE_ANGLE", "conceptClusterKey": null, "primaryMethod": "평행한 두 직선 사이의 거리 공식 $\\frac{|c_1-c_2|}{\\sqrt{a^2+b^2}}$을 적용해 $|k+3|=26$에서 두 $k$ 값을 구한다.", "decisiveStep": "$\\frac{|k+3|}{13}=2$에서 절댓값 방정식을 풀어 $k=23, -29$를 모두 구한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "직선의 방정식", "l3": "점과 직선 사이의 거리", "l4": "거리 공식"}, "ptTplCandidate": {"problemTypeKey": "PT_POINT_LINE_DISTANCE", "templateKey": "TPL_POINT_LINE_DISTANCE_DIRECT", "why": "high1.json H1-RPM-064(DIRECT_ACTIVE): 평행한 두 직선 사이의 거리 공식으로 k 값을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행선 사이 거리 공식과 절댓값 방정식을 연결해 두 해의 합을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "stem", "quote": "값들의 합은?"}], "method": [{"term": "거리", "src": "solution", "quote": "사이의 거리는", "evidenceType": "IMPLIED", "justification": "평행한 두 직선 사이의 거리 공식을 적용함"}], "given": [{"term": "직선", "src": "stem", "quote": "평행한 두 직선"}], "condition": [{"term": "상수", "src": "stem", "quote": "상수 $k$의 값"}]}, "reasons": {"method": "평행선 사이 거리 공식으로 절댓값 방정식을 세워 두 k의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 5

### 발문

\$a\$, \$b\$가 정수이고, \$n\$이 \$200\$ 이하의 자연수일 때, \$x^2+4x-n=(x-a)(x-b)\$의 꼴로 인수분해되도록 하는 자연수 \$n\$의 개수는?

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$13\$

### 정답

④

### 해설

\$(x-a)(x-b)=x^2-(a+b)x+ab\$와 계수를 비교하면 \$a+b=-4\$, \$ab=-n\$이다. \$b=-4-a\$를 대입하면 \$\$ n \= \-a(-4-a) \= a(a+4) \= (a+2)^2-4 \$\$ \$m=\|a+2\|\$라 두면 \$m\$은 음이 아닌 정수이고 \$1\\le m^2-4\\le 200\$, 즉 \$5\\le m^2\\le 204\$이다. 따라서 \$3\\le m\\le 14\$이고, 각 \$m\$마다 서로 다른 \$n=m^2-4\$가 하나씩 정해지므로 개수는 \$14-3+1=12\$개다.

```
{"status": "EXEMPT", "reason": "이차식 계수비교 후 정수 제곱수 부등식 범위를 세는 순수 대수·정수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "계수비교로 $a+b=-4, n=a(a+4)=(a+2)^2-4$를 얻은 뒤 $1\\le m^2-4\\le 200$을 만족하는 정수 $m=|a+2|$의 개수를 센다.", "decisiveStep": "$n=(a+2)^2-4$로 완전제곱 변형해 부등식 $5\\le m^2\\le 204$의 정수 $m$ 범위를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "식의 값"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-019(DIRECT_ACTIVE): 인수분해 계수비교와 완전제곱 변형으로 정수 개수를 셈"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "계수비교와 정수 조건, 완전제곱 변형을 통한 자연수 개수 세기가 결합된 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "자연수 $n$의 개수는?"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "인수분해", "src": "stem", "quote": "꼴로 인수분해되도록"}], "condition": [{"term": "정수", "src": "stem", "quote": "$a$, $b$가 정수이고"}, {"term": "자연수", "src": "stem", "quote": "$200$ 이하의 자연수"}]}, "reasons": {"method": "계수비교로 n=(a+2)^2-4를 얻고 부등식 범위 내 자연수 개수를 셈"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 5

### 발문

좌표평면 위의 두 직선 \$l\_1: y=3x-2\$, \$l\_2: y=3x+4\$가 있다. 다음은 직선 \$l\_1\$, \$l\_2\$ 위의 임의의 점 \$P\$, \$Q\$에 대하여 선분 \$PQ\$를 \$1:2\$로 내분하는 점 \$R\$이 직선 \$y=3x\$ 위의 점임을 보이는 과정이다. 두 점 \$P\$, \$Q\$는 직선 \$l\_1\$, \$l\_2\$ 위의 점이므로 임의의 실수 \$a\$, \$b\$에 대하여 \$P(a, \\text{(가)})\$, \$Q(b, \\text{(나)})\$로 놓자. 선분 \$PQ\$를 \$1:2\$로 내분하는 점 \$R\\left(\\dfrac{2a+b}{3}, \\dfrac{3b+\\text{(다)}}{3}\\right)\$이므로 점 \$R\$은 직선 \$y=3x\$ 위의 점이다. (가), (나), (다)에 들어갈 식을 각각 \$f(a)\$, \$g(b)\$, \$h(a)\$라 할 때, \$f(1)+g(-1)+h(0)\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

③

### 해설

점 \$P\$는 직선 \$y=3x-2\$ 위의 점이므로 \$f(a)=3a-2\$이고, 점 \$Q\$는 직선 \$y=3x+4\$ 위의 점이므로 \$g(b)=3b+4\$이다. 선분 \$PQ\$를 \$1:2\$로 내분하는 점 \$R\$의 \$y\$좌표는 \$\$ \\frac{2(3a-2)+1(3b+4)}{1+2} \= \\frac{3b+6a-4+4}{3} \= \\frac{3b+6a}{3} \$\$ 이므로 \$h(a)=6a\$이다. (실제로 \$R\\left(\\frac{2a+b}{3}, 2a+b\\right)\$는 \$y=3x\$ 위의 점이다.) 따라서 \$f(1)=1\$, \$g(-1)=1\$, \$h(0)=0\$이므로 \$f(1)+g(-1)+h(0)=1+1+0=2\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-2, 3], "viewport": [-2, 3, -4, 8], "pieces": [{"domain": [-2, 3], "coefficients": ["-2", "3"]}], "referenceLines": [{"slope": "3", "intercept": "4", "label": "l2: y=3x+4"}, {"slope": "3", "intercept": "0", "label": "y=3x"}], "requiredPoints": []}, "caption": "평행한 두 직선 y=3x-2, y=3x+4 위 점의 1:2 내분점 자취 y=3x"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-09", "subUnitKey": "H15-SA-09-GEOMETRY_APPLICATION", "conceptClusterKey": null, "primaryMethod": "두 직선 $l_1, l_2$ 위의 점 $P, Q$의 $y$좌표를 대입해 (가), (나)를 정하고, $1:2$ 내분점의 $y$좌표를 계산해 (다)를 찾는다.", "decisiveStep": "내분점 공식의 $y$좌표 $\\frac{2(3a-2)+(3b+4)}{3}$에서 상수항이 소거되어 $h(a)=6a$를 얻는다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "평면좌표", "l3": "선분의 내분·외분", "l4": "내분점"}, "ptTplCandidate": {"problemTypeKey": "PT_COORD_SECTION", "templateKey": "TPL_SECTION_INTERNAL", "why": "high1.json H1-RPM-055(DIRECT_BINDING_GAP): 두 직선 위 점의 내분점 좌표를 조건식에 대입함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선 위 임의의 점의 매개화 및 $1:2$ 내분점 공식을 빈칸 추론으로 구성한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "직선", "src": "stem", "quote": "직선 $y=3x$ 위의 점"}], "method": [{"term": "내분", "src": "solution", "quote": "내분하는 점 $R$의 $y$좌표", "evidenceType": "IMPLIED", "justification": "선분 PQ의 1:2 내분점 공식을 적용해 빈칸 (다)를 채움"}], "given": [{"term": "직선", "src": "stem", "quote": "두 직선 $l_1: y=3x-2$"}], "condition": []}, "reasons": {"method": "두 직선 위 점의 좌표와 1:2 내분점 공식으로 빈칸 식을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q15

- 형식: 객관식  
- 배점: 5

### 발문

두 점 \$(1, 2)\$, \$(5, a+3)\$을 지나는 직선이 직선 \$2x+ay=5\$와 수직일 때, 상수 \$a\$의 값은?

### 선지

① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$\\dfrac{1}{2}\$ ⑤ \$1\$

### 정답

⑤

### 해설

두 점 \$(1, 2)\$, \$(5, a+3)\$을 지나는 직선의 기울기는 \$\\dfrac{(a+3)-2}{5-1}=\\dfrac{a+1}{4}\$이다. 만약 \$a=0\$이면 \$2x=5\$는 \$x\$축에 수직인 직선이고 첫째 직선의 기울기는 \$\\dfrac{1}{4}\\ne 0\$이므로 수직이 아니다. 따라서 \$a\\ne 0\$이다. 직선 \$2x+ay=5\$의 기울기는 \$-\\dfrac{2}{a}\$이고, 두 직선이 수직이므로 기울기의 곱이 \$-1\$이다. \$\$ \\frac{a+1}{4}\\left(-\\frac{2}{a}\\right) \= \-1 \\implies a+1 \= 2a \\implies a \= 1 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 직선의 기울기 곱이 -1인 수직 조건을 방정식으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-10", "subUnitKey": "H15-SA-10-PARALLEL_PERPENDICULAR", "conceptClusterKey": null, "primaryMethod": "두 점을 지나는 직선의 기울기 $\\frac{a+1}{4}$과 직선 $2x+ay=5$의 기울기 $-\\frac{2}{a}$ ($a\\ne 0$)의 곱이 $-1$인 방정식을 푼다.", "decisiveStep": "$a=0$인 예외 경우를 먼저 배제한 뒤 $\\frac{a+1}{4}(-\\frac{2}{a})=-1$에서 $a=1$을 구한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "직선의 방정식", "l3": "두 직선의 위치 관계", "l4": "수직"}, "ptTplCandidate": {"problemTypeKey": "PT_LINE_RELATION", "templateKey": "TPL_RELATION_PERPENDICULAR_PARAMETER", "why": "high1.json H1-RPM-062(DIRECT_ACTIVE): 두 직선의 수직 조건(기울기 곱 -1)으로 a를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 직선의 수직 조건(기울기 곱 $-1$)과 $a=0$ 분모 예외 확인을 포함하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값은?"}], "method": [{"term": "기울기", "src": "solution", "quote": "기울기의 곱이 $-1$", "evidenceType": "IMPLIED", "justification": "두 직선이 수직일 조건인 기울기 곱 -1 적용"}], "given": [{"term": "직선", "src": "stem", "quote": "직선 $2x+ay=5$와 수직"}], "condition": []}, "reasons": {"method": "a=0 배제 후 두 직선의 기울기 곱이 -1임을 이용해 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 5.3

### 발문

다음 중 옳은 것만을 \<보기\>에서 있는 대로 고른 것은? (단, \$i=\\sqrt{-1}\$) \<보기\> ㄱ. \$\\dfrac{\\sqrt{18}}{\\sqrt{-2}}\$의 값은 \$-3i\$이다. ㄴ. \$i^{10}+2i^{11}+3i^{12}+4i^{13}=-2-2i\$이다. ㄷ. \$z\\overline{z}=0\$이면 \$z\$는 허수이다. (단, \$\\overline{z}\$는 \$z\$의 켤레복소수)

### 선지

① ㄱ ② ㄴ ③ ㄷ ④ ㄱ, ㄴ ⑤ ㄱ, ㄷ

### 정답

①

### 해설

- ㄱ. \$\\dfrac{\\sqrt{18}}{\\sqrt{-2}} \= \\dfrac{3\\sqrt{2}}{\\sqrt{2}i} \= \\dfrac{3}{i} \= \-3i\$이므로 참이다.  
- ㄴ. \$i^{10}=-1\$, \$i^{11}=-i\$, \$i^{12}=1\$, \$i^{13}=i\$이므로 \$i^{10}+2i^{11}+3i^{12}+4i^{13} \= \-1-2i+3+4i \= 2+2i\$이다. 따라서 거짓이다.  
- ㄷ. \$z=a+bi\$ (\$a, b\$는 실수)라 하면 \$z\\overline{z}=a^2+b^2=0\$이므로 \$a=b=0\$, 즉 \$z=0\$이다. \$0\$은 실수이므로 거짓이다. 따라서 옳은 것은 ㄱ뿐이다.

```
{"status": "EXEMPT", "reason": "음수의 제곱근 나눗셈, i의 거듭제곱, z와 켤레복소수 곱의 성질을 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "음수의 제곱근 나눗셈 $\\frac{\\sqrt{18}}{\\sqrt{-2}}$, $i^n$의 주기 $4$, $z\\overline{z}=a^2+b^2=0$ 조건을 각각 검증한다.", "decisiveStep": "$\\frac{\\sqrt{18}}{\\sqrt{-2}}=\\frac{3}{i}=-3i$임을 확인하고 $z\\overline{z}=0\\implies z=0$(실수)임을 가려낸다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): 음수의 제곱근 나눗셈과 i^n 주기성, 켤레복소수 성질을 판별함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 음수 제곱근 계산, $i$의 거듭제곱, $z\\overline{z}=0$ 조건을 한 번에 점검하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "켤레복소수"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "z\\overline{z}=a^2+b^2=0", "evidenceType": "IMPLIED", "justification": "복소수와 켤레복소수 곱의 실수 제곱합 성질을 이용해 z=0을 판별"}], "given": [{"term": "허수", "src": "stem", "quote": "$z$는 허수이다"}], "condition": []}, "reasons": {"method": "음수의 제곱근, i의 주기성, z*z_bar=0 조건을 각각 검증함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 5.5

### 발문

\$x\$에 대한 다항식 \$x^n(x^2-ax+b)\$를 \$(x-3)^2\$으로 나누었을 때의 나머지가 \$3^n(x-3)\$일 때, 이를 만족시키는 상수 \$a\$, \$b\$에 대하여 \$a+b\$의 값은? (단, \$n\$은 자연수)

### 선지

① \$9\$ ② \$11\$ ③ \$13\$ ④ \$15\$ ⑤ \$17\$

### 정답

②

### 해설

몫을 \$Q(x)\$라 하면 \$\$ x^n(x^2-ax+b) \= (x-3)^2Q(x)+3^n(x-3) \$\$ 양변에 \$x=3\$을 대입하면 \$3^n(9-3a+b)=0\$이므로 \$x^2-ax+b\$는 \$(x-3)\$을 인수로 갖는다. 따라서 \$x^2-ax+b=(x-3)(x-r)\$로 놓을 수 있고, 이를 대입해 \$(x-3)\$으로 양변을 정리하면 \$\$ (x-3){x^n(x-r)-3^n} \= (x-3)^2Q(x) \$\$ 즉 \$x^n(x-r)-3^n \= (x-3)Q(x)\$이다. 다시 \$x=3\$을 대입하면 \$\$ 3^n(3-r)-3^n \= 0 \\implies 3-r \= 1 \\implies r \= 2 \$\$ 따라서 \$x^2-ax+b=(x-3)(x-2)=x^2-5x+6\$이므로 \$a=5\$, \$b=6\$, 즉 \$a+b=11\$이다.

```
{"status": "EXEMPT", "reason": "제곱 인수 (x-3)^2 나눗셈 조건을 단계적 인수정리와 약분으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x=3$ 대입으로 $x^2-ax+b=(x-3)(x-r)$을 얻은 뒤, $(x-3)$을 약분하고 다시 $x=3$을 대입해 $r=2$를 구한다.", "decisiveStep": "$(x-3)$으로 양변을 나눈 식 $x^n(x-r)-3^n=(x-3)Q(x)$에 $x=3$을 한 번 더 대입하는 단계가 핵심이다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 거듭제곱 다항식 나눗셈에서 인수정리 약분 후 수치대입함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식 $(x-3)^2$으로 나눈 나머지 조건을 미분 없이 두 번의 대입과 약분으로 풀어내는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$에 대하여"}], "method": [{"term": "인수정리", "src": "solution", "quote": "$(x-3)$을 인수로 갖는다", "evidenceType": "IMPLIED", "justification": "x=3 대입으로 인수를 찾고 약분 후 재대입해 나머지 계수를 결정"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^n(x^2-ax+b)$"}], "condition": [{"term": "나머지", "src": "stem", "quote": "나머지가 $3^n(x-3)$일 때"}]}, "reasons": {"method": "(x-3) 인수 추출 후 양변을 나누고 x=3을 재대입하여 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 5.8

### 발문

좌표평면 위의 점 \$A(0, 2)\$가 있다. 이차함수 \$f(x)=\\dfrac{1}{2}x^2\$의 그래프 위의 점 \$P\\left(t, \\dfrac{t^2}{2}\\right)\$ (\$t\>0\$)를 지나고 기울기가 \$t\$인 직선이 \$x\$축과 만나는 점을 \$Q\$라 하자. 선분 \$QA\$를 \$3:2\$로 외분하는 점 \$R\$이 함수 \$y=f(x)\$의 그래프 위의 점일 때, 삼각형 \$RQP\$의 넓이는?

### 선지

① \$3\\sqrt{3}\$ ② \$6\\sqrt{3}\$ ③ \$9\\sqrt{3}\$ ④ \$12\\sqrt{3}\$ ⑤ \$15\\sqrt{3}\$

### 정답

④

### 해설

점 \$P\\left(t, \\dfrac{t^2}{2}\\right)\$를 지나고 기울기가 \$t\$인 직선의 방정식은 \$\$ y-\\frac{t^2}{2} \= t(x-t) \$\$ \$y=0\$을 대입하면 \$-\\dfrac{t^2}{2}=tx-t^2 \\implies x=\\dfrac{t}{2}\$이므로 \$Q\\left(\\dfrac{t}{2}, 0\\right)\$이다. 선분 \$QA\$를 \$3:2\$로 외분하는 점 \$R\$의 좌표는 \$\$ R \= \\left(\\frac{3\\cdot 0-2\\cdot\\frac{t}{2}}{3-2}, \\frac{3\\cdot 2-2\\cdot 0}{3-2}\\right) \= (-t, 6\) \$\$ 점 \$R(-t, 6)\$이 \$y=\\dfrac{1}{2}x^2\$ 위의 점이므로 \$6=\\dfrac{1}{2}(-t)^2\$, 즉 \$t^2=12\$이고 \$t\>0\$이므로 \$t=2\\sqrt{3}\$이다. 따라서 \$Q(\\sqrt{3}, 0)\$, \$P(2\\sqrt{3}, 6)\$, \$R(-2\\sqrt{3}, 6)\$이다. 선분 \$RP\$는 \$x\$축에 평행하고 길이 \$4\\sqrt{3}\$, 점 \$Q\$에서 직선 \$RP\$까지의 높이는 \$6\$이므로 삼각형 \$RQP\$의 넓이는 \$\$ \\frac{1}{2}\\times 4\\sqrt{3}\\times 6 \= 12\\sqrt{3} \$\$ 이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-4, 4], "viewport": [-5, 5, -1, 8], "pieces": [{"domain": [-4, 4], "coefficients": ["0", "0", "1/2"]}], "requiredPoints": [{"id": "A", "x": "0", "y": "2", "label": "A(0, 2)"}, {"id": "Q", "x": "sqrt(3)", "y": "0", "label": "Q"}, {"id": "P", "x": "2*sqrt(3)", "y": "6", "label": "P"}, {"id": "R", "x": "-2*sqrt(3)", "y": "6", "label": "R"}]}, "caption": "포물선 y=(1/2)x^2 위의 점 P, R과 x절편 Q로 이루어진 삼각형 RQP"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-09", "subUnitKey": "H15-SA-09-GEOMETRY_APPLICATION", "conceptClusterKey": null, "primaryMethod": "점 $P$의 직선 $y-\\frac{t^2}{2}=t(x-t)$에서 $x$절편 $Q(\\frac{t}{2},0)$을 구하고, $QA$의 $3:2$ 외분점 $R(-t,6)$을 곡선 $y=\\frac{1}{2}x^2$에 대입해 $t$와 넓이를 구한다.", "decisiveStep": "외분점 $R(-t,6)$이 포물선 위에 있음을 이용해 $t=2\\sqrt{3}$을 확정하고 수평 밑변 $RP=4\\sqrt{3}$을 얻는다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "평면좌표", "l3": "선분의 내분·외분", "l4": "외분점"}, "ptTplCandidate": {"problemTypeKey": "PT_COORD_SECTION", "templateKey": "TPL_SECTION_EXTERNAL", "why": "high1.json H1-RPM-056(DIRECT_BINDING_GAP): 직선의 x절편과 외분점 조건을 포물선 식에 대입함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선의 $x$절편, 외분점 공식, 포물선 대입, 삼각형 넓이 계산을 연속으로 결합한 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "넓이", "src": "stem", "quote": "삼각형 $RQP$의 넓이는?"}], "method": [{"term": "외분", "src": "solution", "quote": "외분하는 점 $R$의 좌표", "evidenceType": "IMPLIED", "justification": "선분 QA의 3:2 외분점 공식으로 점 R의 좌표를 구해 포물선에 대입함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=\\dfrac{1}{2}x^2$"}], "condition": [{"term": "기울기", "src": "stem", "quote": "기울기가 $t$인 직선"}]}, "reasons": {"method": "x절편 Q와 3:2 외분점 R을 구해 포물선에 대입하고 삼각형 넓이를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q19

- 형식: 서답형  
- 배점: 3

### 발문

\$x^4-7x^2-18\$을 인수분해하는 과정을 서술하시오.

### 선지

없음

### 정답

\$(x-3)(x+3)(x^2+2)\$

### 해설

\$x^2=X\$로 놓으면 \$\$ \\begin{aligned} x^4-7x^2-18 &= X^2-7X-18 \\ &= (X-9)(X+2) \\ &= (x^2-9)(x^2+2) \\ &= (x-3)(x+3)(x^2+2) \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복이차식 x^4-7x^2-18을 치환과 합차 공식으로 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$x^2=X$로 치환하여 $X^2-7X-18=(X-9)(X+2)$로 인수분해한 뒤 $x^2-9$를 합차 공식으로 마저 인수분해한다.", "decisiveStep": "$(x^2-9)(x^2+2)$에서 $x^2-9$를 $(x-3)(x+3)$으로 끝까지 인수분해한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): x^2=X 치환 후 합차 공식으로 단계적 인수분해를 완성함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복이차식을 치환해 인수분해하고 합차 공식으로 마무리하는 기본 서술형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하는 과정을"}], "method": [{"term": "인수분해", "src": "stem", "quote": "인수분해하는", "evidenceType": "NAMED"}], "given": [{"term": "이차식", "src": "solution", "quote": "X^2-7X-18"}], "condition": []}, "reasons": {"method": "x^2 치환과 합차 공식으로 복이차식을 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 4

### 발문

좌표평면 위의 두 점 \$A\$, \$B\$에 대하여 선분 \$AB\$를 \$3:1\$로 내분하는 점을 \$P\$, \$3:1\$로 외분하는 점을 \$Q\$라 할 때, 점 \$B\$는 선분 \$PQ\$를 (1) \$m:n\$으로 (2) 내분/외분하는 점이다. 위의 상황을 (3) 그림으로 표현하고 (1), (2), (3)에 들어갈 내용을 차례대로 서술하시오. (단, \$m\$, \$n\$은 서로소인 자연수)

### 선지

없음

### 정답

(1) \$1:2\$, (2) 내분, (3) 한 직선 위에 \$A-P-B-Q\$ 순으로 \$\\overline{AP}:\\overline{PB}:\\overline{BQ}=3:1:2\$가 되도록 나타낸 그림

### 해설

점들의 상대적 위치 비를 구하기 위해 수직선 위에 \$A=0\$, \$B=4\$라 두면 \$\\overline{AB}=4\$이다.

- \$P\$는 \$AB\$를 \$3:1\$로 내분하므로 \$P=\\dfrac{3\\cdot 4+1\\cdot 0}{3+1}=3\$이다.  
- \$Q\$는 \$AB\$를 \$3:1\$로 외분하므로 \$Q=\\dfrac{3\\cdot 4-1\\cdot 0}{3-1}=6\$이다. 따라서 네 점은 직선 위에 \$A(0)-P(3)-B(4)-Q(6)\$ 순으로 놓이며, \$\$ \\overline{PB}=4-3=1, \\qquad \\overline{BQ}=6-4=2 \$\$ 이다. 그러므로 점 \$B\$는 선분 \$PQ\$를 \$1:2\$로 내분하는 점이다. (1) \$1:2\$  (2) 내분  (3) 직선 위에 \$A, P, B, Q\$를 \$\\overline{AP}=3, \\overline{PB}=1, \\overline{BQ}=2\$의 비율로 순서대로 표시한다.

```
{"capability": "plane", "title": "직선 위의 네 점 A, P, B, Q의 위치 관계", "points": [{"id": "A", "x": 0, "y": 0, "label": "A"}, {"id": "P", "x": 3, "y": 0, "label": "P"}, {"id": "B", "x": 4, "y": 0, "label": "B"}, {"id": "Q", "x": 6, "y": 0, "label": "Q"}], "segments": [{"id": "sAQ", "from": "A", "to": "Q"}], "caption": "선분 AB의 3:1 내분점 P와 3:1 외분점 Q에 대한 A-P-B-Q 위치 관계 (PB:BQ=1:2)"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-09", "subUnitKey": "H15-SA-09-GEOMETRY_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$A=0, B=4$로 좌표를 설정해 $3:1$ 내분점 $P=3$과 $3:1$ 외분점 $Q=6$을 구하고 $\\overline{PB}:\\overline{BQ}=1:2$ 내분임을 보인다.", "decisiveStep": "점 $B$가 $P$와 $Q$ 사이에 놓여 내분점이며 $\\overline{PB}=1, \\overline{BQ}=2$임을 계산한다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "평면좌표", "l3": "선분의 내분·외분", "l4": "외분점"}, "ptTplCandidate": {"problemTypeKey": "PT_COORD_SECTION", "templateKey": "TPL_SECTION_EXTERNAL", "why": "high1.json H1-RPM-056(DIRECT_BINDING_GAP): 수직선 위 3:1 내분점과 외분점을 구해 거리비를 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "선분의 내분·외분점 위치를 1차원 좌표로 수치화해 비와 방향을 판정하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "내분", "src": "stem", "quote": "내분하는 점을 $P$"}], "method": [{"term": "외분", "src": "stem", "quote": "외분하는 점을 $Q$", "evidenceType": "IMPLIED", "justification": "1차원 좌표를 잡아 내분점 P와 외분점 Q의 좌표를 직접 구해 비를 비교함"}], "given": [{"term": "직선", "src": "solution", "quote": "네 점은 직선 위에"}], "condition": []}, "reasons": {"method": "수직선 좌표로 P, Q의 위치를 정해 점 B가 선분 PQ의 1:2 내분점임을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q21

- 형식: 서답형  
- 배점: 6

### 발문

좌표평면 위의 세 직선 \$y=2x\$, \$y=-\\dfrac{1}{2}x\$, \$y=mx+6\$으로 둘러싸인 도형이 이등변삼각형일 때, 양수 \$m\$의 값을 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$\\dfrac{1}{3}\$

### 해설

두 직선 \$y=2x\$와 \$y=-\\dfrac{1}{2}x\$는 기울기의 곱이 \$2\\cdot\\left(-\\dfrac{1}{2}\\right)=-1\$이므로 원점 \$O(0,0)\$에서 서로 수직이다. 따라서 세 직선으로 둘러싸인 도형 \$\\triangle OAB\$는 \$\\angle O=90^\\circ\$인 직각삼각형이므로 이등변삼각형이 되려면 \$\\overline{OA}=\\overline{OB}\$이어야 한다.

- \$y=2x\$와 \$y=mx+6\$의 교점 \$A\$: \$2x=mx+6 \\implies x\_A=\\dfrac{6}{2-m}\$이므로 \$\$\\overline{OA} \= \\sqrt{1^2+2^2}\|x\_A\| \= \\frac{6\\sqrt{5}}{\|2-m\|}\$\$  
- \$y=-\\dfrac{1}{2}x\$와 \$y=mx+6\$의 교점 \$B\$: \$-\\dfrac{1}{2}x=mx+6 \\implies x\_B=-\\dfrac{12}{1+2m}\$이므로 \$\$\\overline{OB} \= \\sqrt{1^2+\\left(-\\frac{1}{2}\\right)^2}\|x\_B\| \= \\frac{\\sqrt{5}}{2}\\cdot\\frac{12}{\|1+2m\|} \= \\frac{6\\sqrt{5}}{\|1+2m\|}\$\$ \$\\overline{OA}=\\overline{OB}\$에서 \$\|2-m\|=\|1+2m\|\$이다.  
- \$2-m=1+2m \\implies 3m=1 \\implies m=\\dfrac{1}{3}\$  
- \$2-m=-(1+2m) \\implies m=-3\$ \$m\$은 양수이므로 \$m=\\dfrac{1}{3}\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-6, 6], "viewport": [-6, 6, -2, 10], "pieces": [{"domain": [-6, 6], "coefficients": ["0", "2"]}], "referenceLines": [{"slope": "-1/2", "intercept": "0", "label": "y=-(1/2)x"}, {"slope": "1/3", "intercept": "6", "label": "y=(1/3)x+6"}], "requiredPoints": [{"id": "O", "x": "0", "y": "0", "label": "O(0,0)"}, {"id": "A", "x": "18/5", "y": "36/5", "label": "A"}, {"id": "B", "x": "-36/5", "y": "18/5", "label": "B"}]}, "caption": "원점에서 수직인 두 직선 y=2x, y=-(1/2)x와 직선 y=(1/3)x+6이 이루는 직각이등변삼각형"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-10", "subUnitKey": "H15-SA-10-DISTANCE_ANGLE", "conceptClusterKey": null, "primaryMethod": "두 직선 $y=2x, y=-\\frac{1}{2}x$가 수직임을 확인해 직각이등변삼각형 조건 $\\overline{OA}=\\overline{OB}$를 세우고 $|2-m|=|1+2m|$을 푼다.", "decisiveStep": "빗변이 아닌 두 직각변의 길이가 같음을 이용해 $|2-m|=|1+2m|$ 방정식을 세운다.", "rpm": {"majorUnit": "도형의 방정식", "midUnit": "직선의 방정식", "l3": "점과 직선 사이의 거리", "l4": "도형의 넓이·최소거리"}, "ptTplCandidate": {"problemTypeKey": "PT_POINT_LINE_DISTANCE", "templateKey": "TPL_DISTANCE_AREA_APPLICATION", "why": "high1.json H1-RPM-065(DIRECT_ACTIVE): 수직인 두 직선과 점과 직선 사이 거리로 직각이등변삼각형을 해석함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선의 수직 조건과 교점 거리 표현을 결합해 직각이등변삼각형이 될 기울기 $m$을 구하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "직각삼각형", "src": "solution", "quote": "직각삼각형이므로"}], "method": [{"term": "기울기", "src": "solution", "quote": "기울기의 곱이", "evidenceType": "IMPLIED", "justification": "두 직선의 기울기 곱 -1로 수직임을 확인하고 두 교점 거리를 같게 둠"}], "given": [{"term": "직선", "src": "stem", "quote": "세 직선 $y=2x$"}], "condition": [{"term": "교점", "src": "solution", "quote": "교점 $A$"}]}, "reasons": {"method": "두 직선의 수직 조건을 확인하고 OA=OB 방정식으로 양수 m을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 7

### 발문

다항식 \$f(x)\$에 대하여 \$f(x^2)\$을 \$f(x)\$로 나누었을 때의 몫이 \$x^2-3x+6\$이고 나머지가 \$-30\$일 때, 이를 만족하는 다항식 \$f(x)\$에 대하여 \$f(2)\$의 값을 구하는 과정을 서술하시오.

### 선지

없음

### 정답

\$16\$

### 해설

다항식 \$f(x)\$의 차수를 \$d\$라 하면 \$f(x^2)\$의 차수는 \$2d\$이고, 몫 \$x^2-3x+6\$의 차수가 \$2\$이므로 \$2d=d+2\$, 즉 \$d=2\$이다. \$f(x)=ax^2+bx+c\$ (\$a\\ne 0\$)라 두면 나눗셈 항등식은 \$\$ ax^4+bx^2+c \= (ax^2+bx+c)(x^2-3x+6)-30 \$\$ 우변을 전개하여 양변의 계수를 비교하면

- \$x^3\$의 계수: \$-3a+b=0 \\implies b=3a\$  
- \$x\$의 계수: \$6b-3c=0 \\implies c=2b=6a\$ (\$x^2\$의 계수 \$6a-3b+c=6a-9a+6a=3a=b\$도 자동으로 성립한다.)  
- 상수항: \$c \= 6c-30 \\implies 5c=30 \\implies c=6\$ 따라서 \$6a=6\$에서 \$a=1\$, \$b=3\$, \$c=6\$이므로 \$\$ f(x) \= x^2+3x+6 \$\$ 그러므로 \$f(2) \= 2^2+3\\cdot 2+6 \= 16\$이다.

```
{"status": "EXEMPT", "reason": "다항식의 차수 결정 후 나눗셈 항등식 계수비교로 f(x)를 구하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "차수 비교 $2d=d+2$로 $f(x)$가 이차식임을 밝힌 뒤 $f(x^2)=f(x)(x^2-3x+6)-30$의 양변 계수비교로 $a, b, c$를 구한다.", "decisiveStep": "$f(x^2)$과 $f(x)(x^2-3x+6)$의 차수 등식 $2d=d+2$에서 $f(x)$가 이차식임을 먼저 확정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 다항식 항등식의 차수 비교 후 계수비교법으로 f(x)를 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 항등식의 차수 추론과 미정계수 비교를 결합한 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "만족하는 다항식 $f(x)$에 대하여"}], "method": [{"term": "계수비교", "src": "solution", "quote": "양변의 계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "나머지", "src": "stem", "quote": "나머지가 $-30$일 때"}], "condition": [{"term": "항등식", "src": "solution", "quote": "나눗셈 항등식은"}]}, "reasons": {"method": "차수 추론으로 이차식 f(x)를 설정하고 나눗셈 항등식 계수비교로 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

