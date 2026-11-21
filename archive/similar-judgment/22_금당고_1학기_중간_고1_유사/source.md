

```
{"stem": "22_금당고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_금당고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$(3x+4y-5)(2x+5y+7)\$의 전개식에서 \$y^2\$의 계수를 구하면?

### 선지

① \$20\$ ② \$22\$ ③ \$24\$ ④ \$26\$ ⑤ \$28\$

### 정답

①

### 해설

전개식에서 \$y^2\$항은 첫째 괄호의 \$y\$항과 둘째 괄호의 \$y\$항을 곱할 때만 생긴다. 첫째 괄호의 \$y\$항은 \$4y\$, 둘째 괄호의 \$y\$항은 \$5y\$이므로 \$\$ (4y)(5y) \= 20y^2 \$\$ 따라서 \$y^2\$의 계수는 \$20\$이다.

```
{"status": "EXEMPT", "reason": "다항식 전개에서 특정 항의 계수만 추출해 곱하는 순수 계산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "다항식 $(3x+4y-5)(2x+5y+7)$의 전개에서 $y^2$항을 만드는 두 일차항 $4y$와 $5y$만 선택해 곱한다.", "decisiveStep": "$(4y)(5y)=20y^2$에서 $y^2$의 계수 $20$을 바로 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "차수·계수 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-001 (DIRECT_ACTIVE): 다항식 전개에서 특정 항(y^2)의 계수를 정리하여 추출"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "전개식에서 필요한 동류항을 만드는 항만 뽑아 곱하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "의 계수를 구하면?"}], "method": [{"term": "전개", "src": "stem", "quote": "전개식에서 $y^2$의", "evidenceType": "IMPLIED", "justification": "필요한 항만 선택해 곱하는 다항식 전개 원리"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(3x+4y-5)(2x+5y+7)$"}], "condition": []}, "reasons": {"method": "y^2항을 생성하는 항만 선택해 곱하여 계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$3x^3-2x^2+5x-4\$를 \$x-2\$로 나누었을 때의 나머지는?

### 선지

① \$16\$ ② \$18\$ ③ \$20\$ ④ \$22\$ ⑤ \$24\$

### 정답

④

### 해설

\$P(x)=3x^3-2x^2+5x-4\$라 하면 나머지정리에 의하여 \$x-2\$로 나눈 나머지는 \$P(2)\$이다. \$\$ \\begin{aligned} P(2) &= 3\\cdot 2^3-2\\cdot 2^2+5\\cdot 2-4 \\ &= 24-8+10-4 \\ &= 22 \\end{aligned} \$\$ 따라서 나머지는 \$22\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리로 x=2를 대입해 나머지를 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "다항식 $P(x)=3x^3-2x^2+5x-4$에 나머지정리를 적용해 $P(2)$를 계산한다.", "decisiveStep": "$P(2)=24-8+10-4=22$를 계산해 나머지를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009 (RPM_ONLY): 일차식(x-2)으로 나눈 나머지를 나머지정리로 구함 (ACTIVE 대응 키 미확정)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 $x-2$로 나눈 나머지에 나머지정리를 직접 대입하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지는?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $3x^3-2x^2+5x-4$"}], "condition": []}, "reasons": {"method": "나머지정리로 x=2를 대입해 나머지를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 3.8

### 발문

복소수 \$z=7-4i\$일 때, 그 켤레복소수 \$\\overline{z}\$의 값은?

### 선지

① \$-7+4i\$ ② \$7+4i\$ ③ \$7-4i\$ ④ \$-7-4i\$ ⑤ \$4+7i\$

### 정답

②

### 해설

복소수 \$z=a+bi\$ (\$a, b\$는 실수)의 켤레복소수 \$\\overline{z}\$는 실수부분은 그대로 두고 허수부분의 부호를 바꾸어 \$a-bi\$로 구한다. 따라서 \$z=7-4i\$의 켤레복소수는 \$\$ \\overline{z} \= 7+4i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수의 켤레복소수를 정의대로 구하는 순수 개념 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "복소수 $z=7-4i$의 실수부분 $7$은 유지하고 허수부분 $-4$의 부호를 바꾸어 $\\overline{z}=7+4i$를 구한다.", "decisiveStep": "허수부분의 부호를 반대로 바꾸어 $\\overline{z}=7+4i$를 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024 (DIRECT_ACTIVE): 복소수의 켤레복소수를 정의대로 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레복소수의 정의를 바로 적용하는 기본 개념 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "그 켤레복소수 $\\overline{z}$의 값은?"}], "method": [{"term": "허수부분", "src": "solution", "quote": "허수부분의 부호를 바꾸어", "evidenceType": "IMPLIED", "justification": "허수부분의 부호를 반전시키는 켤레복소수의 정의 적용"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=7-4i$"}], "condition": []}, "reasons": {"method": "켤레복소수의 정의에 따라 허수부분의 부호를 바꾸어 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$y=x^2-6x+14\$의 최솟값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

⑤

### 해설

주어진 이차함수를 완전제곱식으로 변형하면 \$\$ \\begin{aligned} y &= x^2-6x+14 \\ &= (x-3)^2-9+14 \\ &= (x-3)^2+5 \\end{aligned} \$\$ \$(x-3)^2\\ge 0\$이므로 \$x=3\$일 때 최솟값은 \$5\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [0, 6], "viewport": [0, 6, 0, 16], "pieces": [{"domain": [0, 6], "coefficients": ["14", "-6", "1"]}], "requiredPoints": [{"id": "V", "x": "3", "y": "5", "label": "꼭짓점(3, 5)"}]}, "caption": "이차함수 y=x^2-6x+14의 그래프와 꼭짓점 (3, 5)에서의 최솟값 5"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "이차함수 $y=x^2-6x+14$를 완전제곱식 $(x-3)^2+5$로 변형해 꼭짓점의 $y$좌표로 최솟값을 구한다.", "decisiveStep": "$y=(x-3)^2+5$에서 $(x-3)^2\\ge 0$이므로 최솟값 $5$를 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037 (DIRECT_ACTIVE): 완전제곱식으로 꼭짓점의 y좌표(최솟값)를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "전체 실수 범위에서 아래로 볼록한 이차함수의 꼭짓점 최솟값을 바로 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "의 최솟값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식으로 변형하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-6x+14$"}], "condition": []}, "reasons": {"method": "완전제곱식 변형으로 꼭짓점의 y좌표인 최솟값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

\$x-y=4\$, \$xy=5\$일 때, \$x^3-y^3\$의 값은?

### 선지

① \$104\$ ② \$114\$ ③ \$124\$ ④ \$134\$ ⑤ \$144\$

### 정답

③

### 해설

곱셈 공식의 변형에 의하여 \$\$ x^3-y^3 \= (x-y)^3+3xy(x-y) \$\$ 여기에 \$x-y=4\$, \$xy=5\$를 대입하면 \$\$ \\begin{aligned} x^3-y^3 &= 4^3+3\\cdot 5\\cdot 4 \\ &= 64+60 \\ &= 124 \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "곱셈 공식의 변형 식에 주어진 값을 대입해 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "세제곱의 차 변형 공식 $x^3-y^3=(x-y)^3+3xy(x-y)$에 $x-y=4, xy=5$를 대입한다.", "decisiveStep": "$(x-y)^3+3xy(x-y)=64+60=124$를 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003 (DIRECT_ACTIVE): 세제곱의 차 곱셈 공식 변형에 차와 곱을 대입해 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기본 곱셈 공식의 변형에 두 주어진 값을 바로 대입하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "stem", "quote": "$x^3-y^3$의 값은?"}], "method": [{"term": "곱", "src": "stem", "quote": "$xy=5$일 때", "evidenceType": "IMPLIED", "justification": "차와 곱이 주어졌을 때 세제곱 차 변형 공식 적용"}], "given": [{"term": "곱", "src": "stem", "quote": "$xy=5$"}], "condition": []}, "reasons": {"method": "세제곱의 차 곱셈 공식 변형에 차와 곱을 대입해 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

이차방정식 \$x^2-2kx+k^2+2k-6=0\$이 중근을 갖도록 하는 \$k\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

②

### 해설

이차방정식 \$x^2-2kx+k^2+2k-6=0\$이 중근을 가지려면 판별식 \$D=0\$이어야 한다. \$\$ \\begin{aligned} \\frac{D}{4} &= (-k)^2-1\\cdot(k^2+2k-6) \\ &= k^2-k^2-2k+6 \\ &= \-2k+6 \= 0 \\end{aligned} \$\$ 따라서 \$2k=6\$이므로 \$k=3\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 중근 조건 D=0을 세워 일차방정식을 푸는 순수 계산 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "이차방정식 $x^2-2kx+k^2+2k-6=0$의 판별식 $D/4=(-k)^2-(k^2+2k-6)=0$에서 $k^2$을 소거해 $k$를 구한다.", "decisiveStep": "$-2k+6=0$으로 일차방정식이 되어 $k=3$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028 (DIRECT_ACTIVE): 중근 조건 판별식 D/4=0을 적용해 k를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 조건 $D=0$을 판별식에 대입하면 $k^2$이 소거되어 바로 풀리는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "$k$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2kx+k^2+2k-6=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 갖도록"}]}, "reasons": {"method": "중근 조건 D=0을 적용해 k^2을 소거하고 k를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4

### 발문

\$2\\le x\\le 5\$에서 이차함수 \$y=x^2-4x+k\$의 최댓값이 \$14\$일 때, \$k\$의 값은? (단, \$k\$는 상수이다.)

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$13\$

### 정답

①

### 해설

주어진 이차함수를 완전제곱식으로 변형하면 \$\$ y \= x^2-4x+k \= (x-2)^2+k-4 \$\$ 아래로 볼록하고 꼭짓점의 \$x\$좌표는 \$2\$이다. 구간 \$2\\le x\\le 5\$에서 꼭짓점 \$x=2\$로부터 가장 먼 오른쪽 끝점 \$x=5\$일 때 최댓값을 가진다. \$\$ y(5) \= (5-2)^2+k-4 \= 9+k-4 \= k+5 \$\$ 최댓값이 \$14\$이므로 \$k+5=14\$, 즉 \$k=9\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [1, 6], "viewport": [1, 6, 3, 16], "pieces": [{"domain": [1, 6], "coefficients": ["9", "-4", "1"]}], "requiredPoints": [{"id": "V", "x": "2", "y": "5", "label": "꼭짓점(2, 5)"}, {"id": "M", "x": "5", "y": "14", "label": "최댓값(5, 14)"}]}, "caption": "구간 [2, 5]에서 이차함수 y=x^2-4x+9의 꼭짓점 (2, 5)와 최댓값 (5, 14)"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "이차함수 $y=(x-2)^2+k-4$의 꼭짓점 $x=2$가 구간 $[2,5]$의 왼쪽 끝이므로 $x=5$에서 최댓값 $k+5=14$를 구한다.", "decisiveStep": "$y(5)=k+5=14$를 세워 상수 $k=9$를 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037 (DIRECT_ACTIVE): 제한된 구간 [2, 5]에서 꼭짓점과 끝점 비교로 최댓값 위치 판정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식으로 꼭짓점 위치를 확인한 뒤 구간 내 최댓값 지점을 판정하여 미정계수를 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "$k$는 상수이다"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식으로 변형하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-4x+k$"}], "condition": [{"term": "최댓값", "src": "stem", "quote": "최댓값이 $14$일 때"}]}, "reasons": {"method": "완전제곱식 변형으로 구간 내 최댓값 위치를 판정해 k를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4.2

### 발문

다항식 \$P(x)\$를 \$x+2\$로 나누었을 때 나머지가 \$-1\$이고, \$x-2\$로 나누었을 때 나머지가 \$7\$이다. \$P(x)\$를 \$(x+2)(x-2)\$로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(3)\$의 값은?

### 선지

① \$5\$ ② \$7\$ ③ \$9\$ ④ \$11\$ ⑤ \$13\$

### 정답

③

### 해설

\$P(x)\$를 이차식 \$(x+2)(x-2)\$로 나눈 나머지 \$R(x)\$는 일차 이하의 다항식이므로 \$R(x)=ax+b\$ (\$a, b\$는 상수)라 두자. 몫을 \$Q(x)\$라 하면 \$P(x)=(x+2)(x-2)Q(x)+ax+b\$이다. 나머지정리에 의하여 \$P(-2)=-1\$, \$P(2)=7\$이므로 \$\$ \\begin{aligned} R(-2) &= \-2a+b \= \-1 \\ R(2) &= 2a+b \= 7 \\end{aligned} \$\$ 두 식을 더하면 \$2b=6\$이므로 \$b=3\$이고, 대입하면 \$2a+3=7\$이므로 \$a=2\$이다. 따라서 \$R(x)=2x+3\$이고 \$R(3)=2\\cdot 3+3=9\$이다.

```
{"status": "EXEMPT", "reason": "이차식으로 나눈 나머지를 일차식 ax+b로 두고 나머지정리를 연립하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "이차식 $(x+2)(x-2)$로 나눈 나머지를 $R(x)=ax+b$로 두고 $P(-2)=-1, P(2)=7$을 연립해 $R(3)$을 구한다.", "decisiveStep": "$-2a+b=-1$과 $2a+b=7$을 연립해 $a=2, b=3$을 얻어 $R(x)=2x+3$을 확정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010 (FAMILY_ACTIVE): 합성 제수 (x+2)(x-2)로 나눈 나머지를 두 일차식 나머지 조건과 연립"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식 나눗셈의 나머지 차수 조건과 두 나머지정리 식의 연립이 결합된 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 할 때"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": [{"term": "상수", "src": "solution", "quote": "$a, b$는 상수"}]}, "reasons": {"method": "나머지 R(x)=ax+b를 설정하고 두 일차식 나머지 조건을 연립함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.2

### 발문

모든 실수 \$x\$에 대하여 등식 \$(3x^2-x+4)(3x^2-x-8)+36=(3x^2+ax+b)^2\$을 만족시킬 때, \$a^2+b^2\$의 값은? (단, \$a\$, \$b\$는 상수이다.)

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

⑤

### 해설

\$t=3x^2-x\$로 치환하면 좌변은 \$\$ \\begin{aligned} (t+4)(t-8)+36 &= t^2-4t-32+36 \\ &= t^2-4t+4 \\ &= (t-2)^2 \\ &= (3x^2-x-2)^2 \\end{aligned} \$\$ 따라서 모든 실수 \$x\$에 대하여 \$(3x^2-x-2)^2=(3x^2+ax+b)^2\$이 성립한다. 양변의 이차식 최고차항 계수가 \$3\$으로 같으므로 \$\$ 3x^2+ax+b \= 3x^2-x-2 \$\$ 계수를 비교하면 \$a=-1\$, \$b=-2\$이므로 \$a^2+b^2=(-1)^2+(-2)^2=5\$이다.

```
{"status": "EXEMPT", "reason": "공통부분을 치환해 완전제곱식으로 정리한 뒤 항등식 계수를 비교하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "공통부분 $t=3x^2-x$로 치환하여 $(t+4)(t-8)+36=(t-2)^2$으로 인수분해한 뒤 계수비교로 $a, b$를 구한다.", "decisiveStep": "$(t-2)^2=(3x^2-x-2)^2$과 우변 $(3x^2+ax+b)^2$의 계수를 비교해 $a=-1, b=-2$를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007 (DIRECT_ACTIVE): 치환 후 완전제곱식으로 정리하여 항등식 계수비교로 a, b 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공통부분 치환 후 완전제곱식 변형과 항등식 계수비교를 함께 쓰는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "$a$, $b$는 상수이다"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "stem", "quote": "모든 실수 $x$에 대하여 등식"}], "condition": [{"term": "완전제곱식", "src": "solution", "quote": "(t-2)^2"}]}, "reasons": {"method": "공통부분을 치환해 완전제곱식으로 묶고 계수비교로 a, b를 결정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$y=x^2+6ax+b\$의 그래프는 \$x\$축에 접하고, 직선 \$y=3x\$와 적어도 한 점에서 만날 때, 실수 \$a\$의 최댓값은? (단, \$b\$는 상수이다.)

### 선지

① \$-\\dfrac{1}{4}\$ ② \$\\dfrac{1}{4}\$ ③ \$\\dfrac{1}{2}\$ ④ \$\\dfrac{3}{4}\$ ⑤ \$1\$

### 정답

②

### 해설

이차함수 \$y=x^2+6ax+b\$의 그래프가 \$x\$축에 접하므로 방정식 \$x^2+6ax+b=0\$이 중근을 가진다. \$\$ \\frac{D\_1}{4} \= (3a)^2-b \= 0 \\implies b \= 9a^2 \$\$ 또한 이 이차함수의 그래프가 직선 \$y=3x\$와 적어도 한 점에서 만나려면 방정식 \$\$ x^2+6ax+9a^2 \= 3x \\implies x^2+(6a-3)x+9a^2 \= 0 \$\$ 이 실근을 가져야 하므로 판별식 \$D\_2\\ge 0\$이어야 한다. \$\$ \\begin{aligned} D\_2 &= (6a-3)^2-4\\cdot 1\\cdot 9a^2 \\ &= 36a^2-36a+9-36a^2 \\ &= \-36a+9 \\ge 0 \\end{aligned} \$\$ 따라서 \$36a\\le 9\$이므로 \$a\\le\\dfrac{1}{4}\$이고, 실수 \$a\$의 최댓값은 \$\\dfrac{1}{4}\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-2, 2], "viewport": [-2, 2, -2, 6], "pieces": [{"domain": [-2, 2], "coefficients": ["9/16", "3/2", "1"]}], "referenceLines": [{"slope": "3", "intercept": "0", "label": "y=3x"}], "requiredPoints": [{"id": "T1", "x": "-3/4", "y": "0", "label": "x축 접점(-3/4, 0)"}, {"id": "T2", "x": "3/4", "y": "9/4", "label": "접점(3/4, 9/4)"}]}, "caption": "a=1/4일 때 x축에 접하는 이차함수 y=x^2+(3/2)x+9/16와 직선 y=3x의 접점"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$x$축 접선 조건 $D_1=0$에서 $b=9a^2$을 얻고, 직선 $y=3x$와의 교점 조건 $D_2\\ge 0$에 대입해 $a$의 범위를 구한다.", "decisiveStep": "$D_2=(6a-3)^2-36a^2=-36a+9\\ge 0$에서 $a^2$ 항이 소거되어 $a\\le 1/4$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-036 (DIRECT_ACTIVE): x축 접선 조건(D1=0)과 직선 교점 조건(D2>=0) 연쇄 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 개의 판별식 조건($D_1=0$과 $D_2\\ge 0$)을 연쇄적으로 적용해 상한을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "실수 $a$의 최댓값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D_2\\ge 0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+6ax+b$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=3x$"}], "condition": [{"term": "실근", "src": "solution", "quote": "실근을 가져야 하므로"}]}, "reasons": {"method": "x축 접선 조건과 직선 교점 조건에 판별식을 연속 적용해 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$y=x^2+ax+2a-13\$의 그래프는 \$a\$의 값에 관계없이 항상 점 \$P\$를 지나고, 점 \$P\$가 이 이차함수 그래프의 꼭짓점일 때, 이 이차함수 그래프와 \$x\$축이 두 점 \$(\\alpha, 0)\$, \$(\\beta, 0)\$에서 만난다. 이때 \$\|lpha\|+\|\\beta\|\$의 값은? (단, \$a\$는 실수이다.)

### 선지

① \$2\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$8\$

### 정답

④

### 해설

주어진 식을 \$a\$에 대하여 정리하면 \$\$ y \= x^2-13+a(x+2) \$\$ \$a\$의 값에 관계없이 항상 지나는 점 \$P\$는 \$x+2=0\$일 때 성립하므로 \$x=-2\$, \$y=(-2)^2-13=-9\$이다. 즉 \$P(-2, \-9)\$이다. 점 \$P\$가 꼭짓점이므로 이차함수 \$y=x^2+ax+2a-13\$의 대칭축의 방정식은 \$\$ x \= \-\\frac{a}{2} \= \-2 \\implies a \= 4 \$\$ 따라서 이차함수는 \$y=x^2+4x-5=(x+5)(x-1)\$이고, \$x\$축과의 두 교점의 \$x\$좌표는 \$-5\$, \$1\$이다. 그러므로 \$\|\\alpha\|+\|\\beta\|=\|-5\|+\|1\|=5+1=6\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-6, 2], "viewport": [-6, 2, -10, 4], "pieces": [{"domain": [-6, 2], "coefficients": ["-5", "4", "1"]}], "requiredPoints": [{"id": "P", "x": "-2", "y": "-9", "label": "P(-2, -9)"}, {"id": "A", "x": "-5", "y": "0", "label": "(-5, 0)"}, {"id": "B", "x": "1", "y": "0", "label": "(1, 0)"}]}, "caption": "꼭짓점 P(-2, -9)를 지나고 x축과 (-5, 0), (1, 0)에서 만나는 이차함수 y=x^2+4x-5"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "식을 $a$에 대한 항등식으로 묶어 정점 $P(-2,-9)$를 찾고, $P$가 꼭짓점인 조건 $-a/2=-2$로 $a=4$를 구한 뒤 $x$절편을 찾는다.", "decisiveStep": "$y=x^2-13+a(x+2)$에서 정점 $P(-2,-9)$를 구하고 축 $-a/2=-2$와 연결해 $a=4$를 확정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033 (DIRECT_ACTIVE): 정점과 꼭짓점 축 조건을 연결한 뒤 x축과의 교점 좌표를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정점 조건(항등식)과 꼭짓점 축 방정식, 그리고 $x$절편 구하기를 3단계로 연결하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "교점", "src": "solution", "quote": "두 교점의 $x$좌표"}], "method": [{"term": "꼭짓점", "src": "stem", "quote": "그래프의 꼭짓점일 때", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+ax+2a-13$"}], "condition": [{"term": "항등식", "src": "solution", "quote": "$a$의 값에 관계없이"}]}, "reasons": {"method": "a에 대한 항등식으로 정점 P를 구하고 축 조건으로 a를 확정해 x절편을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.4

### 발문

방정식 \$(x^2-7x+12)(x^2-3x+2)=35\$의 한 허근을 \$\\omega\$라 할 때, \$\\omega^2-5\\omega\$의 값은?

### 선지

① \$-11\$ ② \$-9\$ ③ \$-7\$ ④ \$-5\$ ⑤ \$-3\$

### 정답

①

### 해설

두 이차식을 각각 인수분해한 뒤 일차항의 계수가 같도록 짝지어 묶는다. \$\$ \\begin{aligned} (x^2-7x+12)(x^2-3x+2) &= (x-4)(x-3)(x-2)(x-1) \\ &= {(x-4)(x-1)}{(x-3)(x-2)} \\ &= (x^2-5x+4)(x^2-5x+6) \= 35 \\end{aligned} \$\$ \$t=x^2-5x\$로 치환하면 \$\$ (t+4)(t+6)=35 \\implies t^2+10t-11=0 \\implies (t-1)(t+11)=0 \$\$ 따라서 \$x^2-5x-1=0\$ 또는 \$x^2-5x+11=0\$이다. \$x^2-5x-1=0\$은 판별식 \$D=25+4=29\>0\$이므로 실근을 가지고, \$x^2-5x+11=0\$은 판별식 \$D=25-44=-19\<0\$이므로 허근을 가진다. 따라서 허근 \$\\omega\$는 \$\\omega^2-5\\omega+11=0\$을 만족하므로 \$\\omega^2-5\\omega=-11\$이다.

```
{"status": "EXEMPT", "reason": "사차방정식을 인수분해 후 공통부분 치환과 판별식으로 허근의 방정식을 찾는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "좌변을 네 일차식의 곱으로 인수분해해 $x^2-5x$가 공통으로 나오게 재조합하고, 치환 후 판별식으로 허근이 속한 이차방정식을 판별한다.", "decisiveStep": "치환 방정식 $(t-1)(t+11)=0$에서 $D<0$인 $x^2-5x+11=0$만 허근 $\\omega$를 가짐을 판별한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "치환형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_SUBSTITUTION_REDUCTION", "why": "high1.json H1-RPM-040 (DIRECT_ACTIVE): 인수분해 후 공통부분 x^2-5x 치환 및 판별식으로 허근 방정식 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수분해 후 재조합 치환, 이차방정식 풀이, 판별식을 통한 허근 분별을 모두 거치는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "한 허근을 $\\omega$라 할 때"}], "method": [{"term": "인수분해", "src": "solution", "quote": "각각 인수분해한 뒤", "evidenceType": "NAMED"}], "given": [{"term": "방정식", "src": "stem", "quote": "방정식 $(x^2-7x+12)(x^2-3x+2)=35$"}], "condition": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=25-44=-19<0$"}]}, "reasons": {"method": "공통부분이 생기도록 짝지어 치환하고 판별식으로 허근 조건을 가려냄"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.4

### 발문

최고차항의 계수가 \$1\$인 두 다항식 \$f(x)\$, \$g(x)\$가 모든 실수 \$x\$에 대하여 다음 조건을 만족시킬 때, \$g(x)\$를 \$x-4\$로 나눈 나머지는? (가) \$g(x)={f(x)}^2\$ (나) \$g(x)+(x+1)f(x)=x^4-5x^3+7x^2-3x\$

### 선지

① \$4\$ ② \$9\$ ③ \$16\$ ④ \$25\$ ⑤ \$36\$

### 정답

③

### 해설

조건 (가)에서 \$g(x)={f(x)}^2\$이고 조건 (나)의 우변이 사차식이므로 \$f(x)\$는 최고차항의 계수가 \$1\$인 이차식이다. \$f(x)=x^2+px+q\$라 두면 \$\$ g(x)+(x+1)f(x) \= f(x){f(x)+x+1} \= (x^2+px+q){x^2+(p+1)x+(q+1)} \$\$ 우변과 전개식의 \$x^3\$항, \$x^2\$항의 계수를 비교하면 \$\$ \\begin{aligned} p+(p+1) &= \-5 \\implies 2p=-6 \\implies p=-3 \\ p(p+1)+q+(q+1) &= 7 \\implies (-3)(-2)+2q+1=7 \\implies 2q=0 \\implies q=0 \\end{aligned} \$\$ (일차항 계수 \$p(q+1)+q(p+1)=-3\$과 상수항 \$q(q+1)=0\$도 모두 일치한다.) 따라서 \$f(x)=x^2-3x\$, \$g(x)=(x^2-3x)^2\$이므로 \$g(x)\$를 \$x-4\$로 나눈 나머지는 \$\$ g(4) \= (4^2-3\\cdot 4)^2 \= 4^2 \= 16 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "다항식의 차수 결정과 계수비교 및 나머지정리를 적용하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "조건 (가)와 (나)의 차수를 비교해 $f(x)=x^2+px+q$를 세우고, $f(x)\\{f(x)+x+1\\}$의 계수비교로 $p, q$를 구한 뒤 $g(4)$를 계산한다.", "decisiveStep": "$x^3$ 계수 $2p+1=-5$에서 $p=-3$, $x^2$ 계수 $6+2q+1=7$에서 $q=0$을 결정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007 (DIRECT_ACTIVE): 차수 추론 후 항등식 계수비교로 f(x)의 미정계수를 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 차수 추론, 미정계수 계수비교, 나머지정리를 결합한 3단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지는?"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $f(x)$, $g(x)$"}], "condition": [{"term": "최고차항", "src": "stem", "quote": "최고차항의 계수가 $1$인"}]}, "reasons": {"method": "차수 결정 후 f(x)를 이차식으로 두고 계수비교하여 g(4)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.4

### 발문

자연수 \$n\$에 대하여 \$f(n)=\\left(\\dfrac{1+i}{1-i}\\right)^n\$, \$g(n)=\\left(\\dfrac{1-i}{1+i}\\right)^n\$이라 하자. \$6\$ 이하의 서로 다른 두 자연수 \$a\$, \$b\$에 대하여 \$f(a)+g(b)=0\$을 만족하는 순서쌍 \$(a, b)\$의 개수는? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

분모를 실수화하여 간단히 하면 \$\$ \\frac{1+i}{1-i} \= \\frac{(1+i)^2}{2} \= i, \\qquad \\frac{1-i}{1+i} \= \\frac{(1-i)^2}{2} \= \-i \$\$ 이므로 \$f(n)=i^n\$, \$g(n)=(-i)^n\$이다. \$1\\le a, b\\le 6\$에서 \$f(a)\$와 \$g(b)\$의 값을 나열하면 다음과 같다. \$\$ \\begin{aligned} f(a) &: f(1)=i,; f(2)=-1,; f(3)=-i,; f(4)=1,; f(5)=i,; f(6)=-1 \\ g(b) &: g(1)=-i,; g(2)=-1,; g(3)=i,; g(4)=1,; g(5)=-i,; g(6)=-1 \\end{aligned} \$\$ \$f(a)+g(b)=0\$이면서 \$a\\ne b\$를 만족하는 순서쌍 \$(a, b)\$를 찾으면

- \$f(a)=i,; g(b)=-i\$: \$(1, 5), (5, 1)\$ (\$a=b\$인 \$(1,1), (5,5)\$ 제외)  
- \$f(a)=-1,; g(b)=1\$: \$(2, 4), (6, 4)\$  
- \$f(a)=-i,; g(b)=i\$: \$(3, 3)\$은 \$a=b\$이므로 제외  
- \$f(a)=1,; g(b)=-1\$: \$(4, 2), (4, 6)\$ 따라서 조건을 만족하는 순서쌍은 모두 \$6\$개이다.

```
{"status": "EXEMPT", "reason": "복소수 i의 거듭제곱 주기성을 이용해 조건을 만족하는 순서쌍 개수를 세는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$\\frac{1+i}{1-i}=i$와 $\\frac{1-i}{1+i}=-i$로 간단히 한 뒤 $1\\le a,b\\le 6$의 주기 값을 나열해 $a\\ne b$인 $f(a)+g(b)=0$ 쌍을 센다.", "decisiveStep": "$f(a)+g(b)=0$이 되는 쌍 중 $a=b$인 $(1,1), (3,3), (5,5)$를 제외하고 $6$개를 센다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025 (DIRECT_ACTIVE): 복소수 비를 i, -i로 간단히 한 뒤 i의 거듭제곱 주기성 활용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허수단위 $i$의 거듭제곱 주기성을 확인하고 서로 다른 두 자연수 조건으로 순서쌍을 세는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "순서쌍 $(a, b)$의 개수는?"}], "method": [{"term": "복소수", "src": "solution", "quote": "분모를 실수화하여", "evidenceType": "IMPLIED", "justification": "복소수 나눗셈을 간단히 한 뒤 i의 주기성을 활용함"}], "given": [{"term": "자연수", "src": "stem", "quote": "자연수 $n$에 대하여"}], "condition": [{"term": "자연수", "src": "stem", "quote": "서로 다른 두 자연수 $a$, $b$"}]}, "reasons": {"method": "복소수 비를 i, -i로 정리한 뒤 주기표를 작성해 a≠b 순서쌍을 셈"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.4

### 발문

이차방정식 \$x^2+ax-2a=0\$이 서로 다른 두 실근 \$\\alpha\$, \$\\beta\$를 가질 때, \$\|\\alpha\|+\|\\beta\|\$, \$\|\\alpha\|\|\\beta\|\$를 두 근으로 갖는 이차방정식은 \$x^2-5ax+6a^2=0\$이다. 양수 \$a\$의 값은?

### 선지

① \$\\dfrac{1}{2}\$ ② \$1\$ ③ \$\\dfrac{3}{2}\$ ④ \$2\$ ⑤ \$\\dfrac{5}{2}\$

### 정답

②

### 해설

이차방정식 \$x^2+ax-2a=0\$에서 근과 계수의 관계에 의하여 \$\$ \\alpha+\\beta \= \-a, \\qquad \\alpha\\beta \= \-2a \< 0 \\quad (a\>0) \$\$ 두 근의 곱이 음수이므로 \$\\alpha\$와 \$\\beta\$는 서로 다른 부호를 가지며 \$\|\\alpha\|\|\\beta\|=\|\\alpha\\beta\|=2a\$이다. 한편 방정식 \$x^2-5ax+6a^2=(x-2a)(x-3a)=0\$의 두 근은 \$2a\$, \$3a\$이므로 \$\|\\alpha\|+\|\\beta\|=3a\$이다. \$\\alpha\$와 \$\\beta\$의 부호가 다르므로 \$\|\\alpha\|+\|\\beta\|=\|\\alpha-\\beta\|\$가 성립한다. \$\$ \\begin{aligned} (3a)^2 &= (\\alpha-\\beta)^2 \= (\\alpha+\\beta)^2-4\\alpha\\beta \\ 9a^2 &= (-a)^2-4(-2a) \= a^2+8a \\ 8a^2 &= 8a \\end{aligned} \$\$ \$a\>0\$이므로 양변을 \$8a\$로 나누면 \$a=1\$이다.

```
{"status": "EXEMPT", "reason": "근의 부호 판정과 곱셈 공식 변형으로 이차방정식 미지수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha\\beta=-2a<0$에서 두 근의 부호가 다름을 확인해 $|\\alpha|+|\\beta|=|\\alpha-\\beta|=3a$를 얻고, $(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta$로 $a$를 구한다.", "decisiveStep": "두 근의 부호가 다르므로 $|\\alpha|+|\\beta|=|\\alpha-\\beta|$임을 이용해 $9a^2=a^2+8a$를 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029 (DIRECT_BINDING_GAP): 근과 계수의 관계와 부호 판정 후 대칭식 변형으로 a를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근의 부호 판정, 두 근이 주어진 방정식 인수분해, 차의 제곱 공식을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+ax-2a=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근 $\\alpha$, $\\beta$"}]}, "reasons": {"method": "근과 계수의 관계와 부호 판정으로 |α|+|β|=|α-β|를 도출해 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q16

- 형식: 객관식  
- 배점: 4.6

### 발문

삼차방정식 \$x^3-2x^2-kx+2k=0\$의 세 근을 \$\\alpha\$, \$\\beta\$, \$\\gamma\$라 하자. \$\\alpha\$, \$\\beta\$ 중 실근은 하나뿐이고 \$\\alpha^2=-3\\beta\$일 때, \$\\alpha^2+\\beta^2+\\gamma^2\$의 값은? (단, \$k\$는 \$0\$이 아닌 실수이다.)

### 선지

① \$-12\$ ② \$-10\$ ③ \$-9\$ ④ \$-8\$ ⑤ \$-6\$

### 정답

④

### 해설

주어진 삼차방정식의 좌변을 인수분해하면 \$\$ x^3-2x^2-kx+2k \= x^2(x-2)-k(x-2) \= (x-2)(x^2-k) \= 0 \$\$ 따라서 세 근은 \$2\$와 \$x^2=k\$의 두 근이다. \$lpha, \\beta\$ 중 실근이 하나뿐이고 \$\\alpha^2=-3\\beta\$에서, 만약 \$\\alpha\$가 실근이면 \$\\beta=-\\frac{1}{3}\\alpha^2\$도 실근이 되어 모순이다. 그러므로 \$\\alpha\$는 허근이고 \$\\beta\$가 실근이며, 허근을 가지려면 \$k\<0\$이어야 한다. \$k\<0\$일 때 이 방정식의 유일한 실근은 \$2\$이므로 \$\\beta=2\$이고, 허근 \$\\alpha, \\gamma\$는 모두 \$x^2=k\$의 근이다. 따라서 \$\$ \\alpha^2 \= \-3\\beta \= \-3\\cdot 2 \= \-6, \\qquad k \= \-6 \$\$ 나머지 허근 \$\\gamma\$도 \$\\gamma^2=k=-6\$을 만족하므로 \$\$ \\alpha^2+\\beta^2+\\gamma^2 \= \-6+2^2+(-6) \= \-8 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 인수분해 후 실근·허근 경우 나누기로 k를 결정하는 순수 방정식 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "삼차방정식을 $(x-2)(x^2-k)=0$으로 인수분해한 뒤 $\\alpha, \\beta$ 중 실근이 하나뿐인 조건과 $\\alpha^2=-3\\beta$로 $\\beta=2, k=-6$을 구한다.", "decisiveStep": "$\\alpha$가 실근이면 $\\beta=-\\alpha^2/3$도 실근이 되어 모순이므로 $\\alpha$가 허근, $\\beta=2$가 유일한 실근임을 확정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039 (DIRECT_ACTIVE): 삼차방정식을 (x-2)(x^2-k)=0으로 인수분해해 실근·허근 조건 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수분해 후 실근과 허근의 존재 조건을 귀류적으로 판별해 세 근의 제곱합을 구하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실근", "src": "stem", "quote": "실근은 하나뿐이고"}], "method": [{"term": "인수분해", "src": "solution", "quote": "좌변을 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-2x^2-kx+2k=0$"}], "condition": [{"term": "허근", "src": "solution", "quote": "$\\alpha$는 허근이고"}]}, "reasons": {"method": "삼차식을 인수분해한 뒤 실근 유일성 논리로 β=2와 k=-6을 확정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.6

### 발문

두 삼차다항식 \$f(x)\$, \$g(x)\$가 다음 조건을 만족시킨다. (가) \$x\$에 대한 방정식 \$f(x)=g(x)\$의 실근은 \$1\$, \$3\$뿐이다. (나) \$f(x)\$, \$g(x)\$를 \$x-4\$로 나눈 나머지는 각각 \$-3\$, \$3\$이다. 이때, \$\|f(5)-g(5)\|\$의 최솟값은?

### 선지

① \$16\$ ② \$18\$ ③ \$20\$ ④ \$24\$ ⑤ \$32\$

### 정답

①

### 해설

\$h(x)=f(x)-g(x)\$라 두면 \$h(x)\$는 삼차 이하의 다항식이다. 조건 (나)에서 \$f(4)=-3\$, \$g(4)=3\$이므로 \$h(4)=f(4)-g(4)=-3-3=-6\$이다. 조건 (가)에서 방정식 \$h(x)=0\$의 실근은 \$1, 3\$뿐이므로 \$h(x)\$의 차수에 따라 경우를 나눈다.

1) \$f(x), g(x)\$의 최고차항이 소거되어 \$h(x)\$가 이차식인 경우: \$h(x)=c(x-1)(x-3)\$ (\$c\\ne 0\$)이라 두면 \$h(4)=3c=-6\$이므로 \$c=-2\$이다. 따라서 \$\|h(5)\|=\|-2(5-1)(5-3)\|=16\$이다.  
2) \$h(x)\$가 삼차식인 경우: 실근이 \$1, 3\$뿐이려면 \$1\$ 또는 \$3\$이 중근이어야 한다.  
- \$h(x)=c(x-1)^2(x-3)\$이면 \$h(4)=9c=-6 \\implies c=-\\dfrac{2}{3}\$, \$\|h(5)\|=\\left\|-\\dfrac{2}{3}\\cdot 16\\cdot 2\\right\|=\\dfrac{64}{3}\$이다.  
- \$h(x)=c(x-1)(x-3)^2\$이면 \$h(4)=3c=-6 \\implies c=-2\$, \$\|h(5)\|=\|-2\\cdot 4\\cdot 4\|=32\$이다. (참고: \$h(x)=c(x-1)(x^2+px+q)\$로 허근을 갖는 경우에도 판별식 \$p^2-4q\<0\$ 조건에서 값이 더 커진다.) 따라서 \$\|f(5)-g(5)\|\$의 최솟값은 \$16\$이다.

```
{"status": "EXEMPT", "reason": "차 다항식 h(x)=f(x)-g(x)의 차수와 인수를 경우 나누어 최솟값을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "차 다항식 $h(x)=f(x)-g(x)$를 설정해 $h(4)=-6$과 실근 $1, 3$ 조건으로 이차·삼차 경우를 모두 계산해 $|h(5)|$의 최솟값을 구한다.", "decisiveStep": "$h(x)$가 이차식인 경우 $c(x-1)(x-3)$과 삼차식 중근 경우의 $|h(5)|$ 값을 비교해 최솟값 $16$을 찾는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012 (RPM_ONLY): 실근 조건과 인수정리로 차 다항식 h(x)의 차수·중근 경우 나누어 최솟값 판정 (ACTIVE 대응 키 미확정)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 삼차식의 차가 이차식 또는 삼차식이 되는 차수 분기와 중근 인수를 모두 비교해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "의 최솟값은?"}], "method": [{"term": "인수정리", "src": "solution", "quote": "실근은 $1, 3$뿐이므로", "evidenceType": "IMPLIED", "justification": "방정식의 실근으로부터 다항식 h(x)의 인수를 구성함"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 삼차다항식 $f(x)$, $g(x)$"}], "condition": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지는 각각 $-3$, $3$"}]}, "reasons": {"method": "차 다항식 h(x)의 차수와 중근 인수를 경우 나누어 최솟값을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q18

- 형식: 서답형  
- 배점: 4

### 발문

이차방정식 \$x^2+ax+b=0\$의 한 근이 \$\\dfrac{5}{1-2i}\$일 때, 실수 \$a\$, \$b\$에 대하여 \$\\dfrac{a}{b}\$의 값을 구하시오. (단, \$i=\\sqrt{-1}\$)

### 선지

없음

### 정답

\$-\\dfrac{2}{5}\$

### 해설

주어진 근의 분모를 실수화하면 \$\$ \\frac{5}{1-2i} \= \\frac{5(1+2i)}{(1-2i)(1+2i)} \= \\frac{5(1+2i)}{1+4} \= 1+2i \$\$ 이차방정식 \$x^2+ax+b=0\$의 계수가 모두 실수이므로 다른 한 근은 켤레복소수 \$1-2i\$이다. 근과 계수의 관계에 의하여 \$\$ \\begin{aligned} (1+2i)+(1-2i) &= 2 \= \-a \\implies a \= \-2 \\ (1+2i)(1-2i) &= 1+4 \= 5 \= b \\implies b \= 5 \\end{aligned} \$\$ 따라서 \$\\dfrac{a}{b}=-\\dfrac{2}{5}\$이다.

```
{"status": "EXEMPT", "reason": "복소수 근의 실수화, 켤레근 성질, 근과 계수의 관계를 순서대로 적용하는 순수 대수 단답형 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "분모를 실수화해 한 근 $1+2i$를 구하고, 실계수 조건의 켤레근 $1-2i$와 근과 계수의 관계로 $a, b$를 구한다.", "decisiveStep": "두 근 $1\\pm 2i$의 합과 곱으로 $a=-2, b=5$를 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json H1-RPM-031 (DIRECT_BINDING_GAP): 분모 실수화 후 실계수 이차방정식의 켤레복소수 근 성질 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분모 실수화, 켤레근 성질, 근과 계수의 관계를 차례로 연결하는 단답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$, $b$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+ax+b=0$"}], "condition": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수 $1-2i$"}]}, "reasons": {"method": "분모 실수화 후 켤레근과 근과 계수의 관계로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q19

- 형식: 서답형  
- 배점: 5

### 발문

\$10\$ 이상의 자연수 \$n\$에 대하여 다항식 \$P\_n(x)=(1+x)(1+x^2)(1+x^3)\\cdots(1+x^{n-1})(1+x^n)-64\$가 \$x^2+x+1\$을 인수로 가질 때, 이를 만족하는 자연수 \$n\$의 값을 모두 구하시오.

### 선지

없음

### 정답

\$18, 20\$

### 해설

\$x^2+x+1=0\$의 한 허근을 \$\\omega\$라 하면 \$\\omega^3=1\$, \$\\omega^2+\\omega+1=0\$이다. \$P\_n(x)\$가 \$x^2+x+1\$을 인수로 가지려면 \$P\_n(\\omega)=0\$, 즉 \$\$ (1+\\omega)(1+\\omega^2)(1+\\omega^3)\\cdots(1+\\omega^n) \= 64 \= 2^6 \$\$ 이어야 한다. 연속한 세 항의 곱은 \$\\omega^3=1\$과 \$1+\\omega=-\\omega^2\$, \$1+\\omega^2=-\\omega\$를 이용하면 \$\$ (1+\\omega)(1+\\omega^2)(1+\\omega^3) \= (-\\omega^2)(-\\omega)\\cdot 2 \= 2\\omega^3 \= 2 \$\$ 이다. 이제 \$n\$을 \$3\$으로 나눈 나머지에 따라 나눈다.

1) \$n=3q\$일 때: 전체 곱은 \$2^q=2^6\$이므로 \$q=6\$, 즉 \$n=18\$이다.  
2) \$n=3q+1\$일 때: 전체 곱은 \$2^q(1+\\omega)=-2^q\\omega^2\$이므로 실수 \$64\$가 될 수 없다.  
3) \$n=3q+2\$일 때: \$(1+\\omega)(1+\\omega^2)=\\omega^3=1\$이므로 전체 곱은 \$2^q=2^6\$이다. 따라서 \$q=6\$, 즉 \$n=20\$이다. 그러므로 조건을 만족하는 자연수 \$n\$은 \$18, 20\$이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 허근 ω의 성질과 나머지 분류로 n을 구하는 순수 대수 단답형 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x^2+x+1=0$의 허근 $\\omega$를 대입해 세 항씩 묶은 곱이 $2$임을 밝히고, $n$을 $3$으로 나눈 나머지로 분류해 $2^6=64$가 되는 $n$을 구한다.", "decisiveStep": "$(1+\\omega)(1+\\omega^2)=1$과 $(1+\\omega)(1+\\omega^2)(1+\\omega^3)=2$를 이용해 $n=3q$와 $n=3q+2$의 두 경우를 모두 찾는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "인수 판정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-011 (RPM_ONLY): 허근 ω 대입 및 3주기 나머지 분류로 x^2+x+1 인수 조건을 만족하는 n 판정 (ACTIVE 대응 키 미확정)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리에 허근 $\\omega$를 대입하고 주기 $3$에 따른 나머지 경우 분류까지 완결해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "자연수 $n$의 값을 모두 구하시오"}], "method": [{"term": "인수정리", "src": "stem", "quote": "$x^2+x+1$을 인수로 가질 때", "evidenceType": "IMPLIED", "justification": "다항식이 x^2+x+1을 인수로 가질 조건으로 P_n(ω)=0을 적용함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P_n(x)="}], "condition": [{"term": "허근", "src": "solution", "quote": "한 허근을 $\\omega$라 하면"}]}, "reasons": {"method": "허근 ω의 세제곱 주기성과 3으로 나눈 나머지 분류로 모든 n을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q20

- 형식: 서답형  
- 배점: 10

### 발문

삼차다항식 \$f(x)\$가 다음 조건을 만족시킨다. (가) \$f(n)=kn\$ (\$n=1, 2, 3\$) (단, \$k\$는 상수이다.) (나) \$f(x+2)-12\$는 \$x+2\$로 나누어떨어지고, \$f(x)-3\$은 \$x-1\$로 나누어떨어진다. 이때, \$f(x)\$를 \$(x-1)^2(x-3)\$으로 나눈 나머지를 \$R(x)\$라 할 때, \$R(-1)\$의 값을 구하시오.

### 선지

없음

### 정답

\$13\$

### 해설

조건 (나)에 나머지정리를 적용하면

- \$f(x+2)-12\$가 \$x+2\$로 나누어떨어지므로 \$x=-2\$를 대입하면 \$f(0)-12=0\$, 즉 \$f(0)=12\$이다.  
- \$f(x)-3\$이 \$x-1\$로 나누어떨어지므로 \$x=1\$을 대입하면 \$f(1)-3=0\$, 즉 \$f(1)=3\$이다. 조건 (가)에서 \$f(1)=k\$이므로 \$k=3\$이고, \$f(2)=6\$, \$f(3)=9\$이다. 따라서 방정식 \$f(x)-3x=0\$의 세 근이 \$1, 2, 3\$이므로 삼차다항식 \$f(x)\$는 최고차항의 계수 \$A\$에 대하여 \$\$ f(x) \= A(x-1)(x-2)(x-3)+3x \$\$ 로 놓을 수 있다. \$f(0)=12\$를 대입하면 \$\$ 12 \= A(-1)(-2)(-3)+0 \= \-6A \\implies A \= \-2 \$\$ 이제 \$x-2=(x-1)-1\$을 이용해 \$f(x)\$를 \$(x-1)^2(x-3)\$으로 나눈 몫과 나머지를 구하면 \$\$ \\begin{aligned} f(x) &= \-2(x-1){(x-1)-1}(x-3)+3x \\ &= \-2(x-1)^2(x-3)+2(x-1)(x-3)+3x \\end{aligned} \$\$ \$2(x-1)(x-3)+3x\$는 이차식이므로 \$R(x)=2(x-1)(x-3)+3x\$이다. 따라서 \$\$ R(-1) \= 2(-1-1)(-1-3)+3(-1) \= 2(-2)(-4)-3 \= 16-3 \= 13 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "인수정리로 삼차다항식을 구성한 뒤 식 변형으로 삼차식 나눗셈의 나머지를 구하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리로 $f(0)=12, f(1)=3$을 얻어 $k=3$을 구하고, 인수정리로 $f(x)=A(x-1)(x-2)(x-3)+3x$를 결정한 뒤 $(x-1)^2(x-3)$으로 나눈 나머지를 구한다.", "decisiveStep": "$f(n)=3n$ ($n=1,2,3$)으로부터 $f(x)-3x=A(x-1)(x-2)(x-3)$을 세우고 $x-2=(x-1)-1$로 나머지를 분리한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010 (FAMILY_ACTIVE): 나머지정리·인수정리로 f(x)를 세우고 합성 제수 (x-1)^2(x-3)으로 나눈 나머지 분리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리, 인수정리를 통한 삼차식 작성, 삼차식으로 나눈 나머지 식 변형을 결합한 고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지를 $R(x)$라 할 때"}], "method": [{"term": "인수정리", "src": "solution", "quote": "세 근이 $1, 2, 3$이므로", "evidenceType": "IMPLIED", "justification": "f(n)-3n=0인 세 값으로부터 인수정리를 써서 삼차식 f(x)를 세움"}], "given": [{"term": "다항식", "src": "stem", "quote": "삼차다항식 $f(x)$"}], "condition": [{"term": "나머지정리", "src": "solution", "quote": "조건 (나)에 나머지정리를 적용하면"}]}, "reasons": {"method": "나머지정리와 인수정리로 f(x)를 세우고 (x-1)^2(x-3)으로 나눈 나머지를 분리함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 10

### 발문

두 이차함수 \$f(x)=(x-a)^2-a^2\$, \$g(x)=-(x-2a)^2+4a^2+b\$가 다음 조건을 만족시킨다. (가) 방정식 \$f(x)=g(x)\$는 서로 다른 두 실근 \$\\alpha\$, \$\\beta\$를 갖는다. (나) \$\\beta-\\alpha=4\$ (다) \$f(\\beta)-g(\\alpha)\\le g(2a)-f(a)\$ (라) \$g(\\beta)=f(\\alpha)+5a^2+b\$ 다음 조건을 모두 만족하는 \$a\$, \$b\$에 대하여 \$ab\$의 값을 구하고 서술하시오. (단, \$a\$, \$b\$는 상수이다.)

### 선지

없음

### 정답

\$-256\$

### 해설

두 함수를 전개하면 \$f(x)=x^2-2ax\$, \$g(x)=-x^2+4ax+b\$이다. 방정식 \$f(x)=g(x)\$에서 \$2x^2-6ax-b=0\$이므로 근과 계수의 관계에 의하여 \$\$ \\alpha+\\beta \= 3a, \\qquad \\alpha\\beta \= \-\\frac{b}{2} \$\$ 조건 (나)의 \$\\beta-\\alpha=4\$와 곱셈 공식의 변형 \$(\\alpha+\\beta)^2-(\\beta-\\alpha)^2=4\\alpha\\beta\$를 이용하면 \$\$ (3a)^2-4^2 \= 4\\left(-\\frac{b}{2}\\right) \\implies 9a^2-16 \= \-2b \\implies b \= 8-\\frac{9}{2}a^2 \$\$ 조건 (가)에서 \$f(\\beta)=g(\\beta)\$이므로 조건 (다)의 좌변은 \$\$ \\begin{aligned} f(\\beta)-g(\\alpha) &= g(\\beta)-g(\\alpha) \= (-\\beta^2+4a\\beta+b)-(-\\alpha^2+4a\\alpha+b) \\ &= (\\beta-\\alpha){4a-(\\alpha+\\beta)} \= 4(4a-3a) \= 4a \\end{aligned} \$\$ 우변은 \$g(2a)-f(a)=(4a^2+b)-(-a^2)=5a^2+b\$이므로 조건 (다)는 \$4a\\le 5a^2+b\$이다. 이제 조건 (라) \$g(\\beta)-f(\\alpha)=5a^2+b\$를 정리하면 \$\$ \\begin{aligned} g(\\beta)-f(\\alpha) &= (-\\beta^2+4a\\beta+b)-(\\alpha^2-2a\\alpha) \\ &= \-(\\alpha^2+\\beta^2)+4a\\beta+2a\\alpha+b \\ &= \-{(\\alpha+\\beta)^2-2\\alpha\\beta}+3a(\\alpha+\\beta)+a(\\beta-\\alpha)+b \\ &= \-(9a^2+b)+9a^2+4a+b \= 4a \\end{aligned} \$\$ 따라서 \$4a \= 5a^2+b\$이고(조건 (다)의 등호도 성립), 여기에 \$b=8-\\dfrac{9}{2}a^2\$을 대입하면 \$\$ 4a \= 5a^2+8-\\frac{9}{2}a^2 \= \\frac{1}{2}a^2+8 \\implies \\frac{1}{2}a^2-4a+8 \= 0 \\implies \\frac{1}{2}(a-4)^2 \= 0 \$\$ 그러므로 \$a=4\$이고 \$b=8-\\dfrac{9}{2}\\cdot 16=-64\$이다. 따라서 \$ab=4\\cdot(-64)=-256\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-2, 10], "viewport": [-2, 10, -20, 5], "pieces": [{"domain": [-2, 10], "coefficients": ["0", "-8", "1"]}], "referenceCurves": [{"coefficients": ["-64", "16", "-1"], "label": "g(x)"}], "requiredPoints": [{"id": "A", "x": "4", "y": "-16", "label": "교점(4, -16)"}, {"id": "B", "x": "8", "y": "0", "label": "교점(8, 0)"}]}, "caption": "a=4, b=-64일 때 두 이차함수 f(x)=x^2-8x와 g(x)=-x^2+16x-64의 두 교점 (4, -16), (8, 0)"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $2x^2-6ax-b=0$에서 근과 계수의 관계와 $\\beta-\\alpha=4$로 $b=8-\\frac{9}{2}a^2$을 얻고, 조건 (라)를 대칭식으로 정리해 $a=4$를 구한다.", "decisiveStep": "조건 (라)의 $g(\\beta)-f(\\alpha)$를 $4a$로 단순화하여 $4a=\\frac{1}{2}a^2+8$ 즉 $(a-4)^2=0$을 이끌어낸다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029 (DIRECT_BINDING_GAP): 교점 방정식의 근과 계수의 관계와 대칭식 변형으로 a, b 확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차함수의 교점 관계식과 복잡한 함숫값 등식을 근과 계수의 관계·대칭식 변형으로 단순화하는 최고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱", "src": "stem", "quote": "$ab$의 값을 구하고"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "두 이차함수 $f(x)=(x-a)^2-a^2$"}], "condition": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근 $\\alpha$, $\\beta$"}]}, "reasons": {"method": "교점 방정식의 근과 계수의 관계와 대칭식 변형으로 a, b를 확정함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

