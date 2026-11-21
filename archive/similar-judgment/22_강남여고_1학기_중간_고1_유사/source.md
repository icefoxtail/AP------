

```
{"stem": "22_강남여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/22_강남여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 2.6

### 발문

다음 식을 계산했을 때 \$x^2\$의 계수를 구하면? \$\$(2x^3-x^2+4x+1)+(5x^2+3x-2)\$\$

### 선지

① \$2\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

②

### 해설

두 다항식에서 \$x^2\$항은 각각 \$-x^2\$, \$5x^2\$이다. \$\$ \\begin{aligned} (2x^3-x^2+4x+1)+(5x^2+3x-2) &= 2x^3+(-1+5)x^2+(4+3)x+(1-2) \\ &= 2x^3+4x^2+7x-1 \\end{aligned} \$\$ 따라서 \$x^2\$의 계수는 \$4\$이다.

```
{"status": "EXEMPT", "reason": "다항식의 덧셈에서 동류항의 계수만 합산하는 순수 계산 문항으로 그림이 불필요함"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "두 다항식 $(2x^3-x^2+4x+1)+(5x^2+3x-2)$의 덧셈에서 $x^2$의 동류항 계수 $-1$과 $5$를 더한다.", "decisiveStep": "두 식의 $x^2$항 계수 $-1+5=4$를 구해 정리한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "차수·계수 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "H1-RPM-001(DIRECT_ACTIVE): 다항식의 덧셈과 뺄셈에서 특정 항($x^2$)의 계수를 정리하는 직접 연산 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 덧셈에서 동류항의 계수를 바로 합산하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "stem", "quote": "의 계수를 구하면?"}], "method": [{"term": "다항식", "src": "solution", "quote": "두 다항식에서 $x^2$항은", "evidenceType": "IMPLIED", "justification": "두 다항식을 동류항끼리 모으는 다항식의 덧셈 연산"}], "given": [{"term": "다항식", "src": "solution", "quote": "두 다항식에서"}], "condition": []}, "reasons": {"method": "동류항끼리 계수를 합산하여 $x^2$의 계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 2.8

### 발문

다음 인수분해 공식 중 옳지 않은 것을 고르면?

### 선지

① \$a^2-b^2=(a+b)(a-b)\$ ② \$a^3-3a^2b+3ab^2-b^3=(a-b)^3\$ ③ \$a^3-8=(a-2)(a^2+2a+4)\$ ④ \$a^2+b^2+c^2-2ab-2bc+2ca=(a-b+c)^2\$ ⑤ \$a^4+a^2b^2+b^4=(a^2+ab+b^2)(a^2+ab-b^2)\$

### 정답

⑤

### 해설

각 등식의 우변을 전개하여 좌변과 비교한다. \$\$ \\begin{aligned} (a+b)(a-b) &= a^2-b^2 \\ (a-b)^3 &= a^3-3a^2b+3ab^2-b^3 \\ (a-2)(a^2+2a+4) &= a^3-8 \\ (a-b+c)^2 &= a^2+b^2+c^2-2ab-2bc+2ca \\end{aligned} \$\$ 한편 ⑤의 우변을 전개하면 \$\$ \\begin{aligned} (a^2+ab+b^2)(a^2+ab-b^2) &= (a^2+ab)^2-b^4 \\ &= a^4+2a^3b+a^2b^2-b^4 \\end{aligned} \$\$ 이므로 \$a^4+a^2b^2+b^4\$과 같지 않다. (올바른 인수분해는 \$(a^2+ab+b^2)(a^2-ab+b^2)\$이다.) 따라서 옳지 않은 것은 ⑤이다.

```
{"status": "EXEMPT", "reason": "다항식의 인수분해 공식의 진위를 전개로 판별하는 순수 식 변형 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "보기 ①~⑤의 우변을 곱셈 공식으로 전개하여 좌변 $a^4+a^2b^2+b^4$ 등과 항별로 비교한다.", "decisiveStep": "⑤의 우변 $(a^2+ab+b^2)(a^2+ab-b^2)$를 전개했을 때 $2a^3b$와 $-b^4$ 항이 생겨 다름을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "제곱식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "H1-RPM-015(DIRECT_ACTIVE): 기본 곱셈 공식과 인수분해 공식을 전개·비교하여 옳지 않은 식을 판별하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기본 곱셈 공식과 인수분해 공식을 직접 대조·전개하여 옳지 않은 식을 고르는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "다음 인수분해 공식 중"}], "method": [{"term": "전개", "src": "solution", "quote": "우변을 전개하여", "evidenceType": "NAMED"}], "given": [{"term": "인수분해", "src": "stem", "quote": "인수분해 공식"}], "condition": []}, "reasons": {"method": "우변을 전개해 좌변과 항별로 비교하여 거짓인 공식을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3

### 발문

이차함수의 그래프와 \$x\$축의 위치 관계를 알아보려고 한다. 다음 표에서 각 이차방정식의 판별식 \$D=b^2-4ac\$의 부호와 위치 관계가 옳은 것은?

| 번호 | 이차함수 | 판별식 \$D\$의 부호 | \$x\$축과의 위치 관계 |
| :---- | :---- | :---- | :---- |
| ① | \$y=x^2-6x+5\$ | \$D\>0\$ | 서로 다른 두 점에서 만난다. |
| ② | \$y=-x^2+4x-4\$ | \$D\>0\$ | 서로 다른 두 점에서 만난다. |
| ③ | \$y=2x^2-3x+4\$ | \$D=0\$ | 한 점에서 접한다. |
| ④ | \$y=x^2+2x-5\$ | \$D\<0\$ | 만나지 않는다. |
| ⑤ | \$y=-3x^2+2x-1\$ | \$D\>0\$ | 한 점에서 접한다. |

### 선지

① ① ② ② ③ ③ ④ ④ ⑤ ⑤

### 정답

①

### 해설

이차함수 \$y=ax^2+bx+c\$에서 판별식 \$D=b^2-4ac\$의 부호를 각각 계산한다. \$\$ \\begin{aligned} \\text{① } y=x^2-6x+5 &: D=(-6)^2-4(1)(5)=36-20=16\>0 \\quad (\\text{서로 다른 두 점}) \\ \\text{② } y=-x^2+4x-4 &: D=4^2-4(-1)(-4)=16-16=0 \\quad (\\text{한 점에서 접함}) \\ \\text{③ } y=2x^2-3x+4 &: D=(-3)^2-4(2)(4)=9-32=-23\<0 \\quad (\\text{만나지 않음}) \\ \\text{④ } y=x^2+2x-5 &: D=2^2-4(1)(-5)=4+20=24\>0 \\quad (\\text{서로 다른 두 점}) \\ \\text{⑤ } y=-3x^2+2x-1 &: D=2^2-4(-3)(-1)=4-12=-8\<0 \\quad (\\text{만나지 않음}) \\end{aligned} \$\$ 따라서 판별식의 부호와 위치 관계가 모두 옳은 것은 ①이다.

```
{"status": "EXEMPT", "reason": "발문에 표로 제시된 이차함수의 판별식 부호와 x축 교점 개수를 직접 계산해 판별하는 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "각 이차함수 $y=ax^2+bx+c$의 판별식 $D=b^2-4ac$를 계산하여 $x$축과의 교점 개수 설명과 일치하는지 확인한다.", "decisiveStep": "① $y=x^2-6x+5$에서 $D=16>0$과 '서로 다른 두 점에서 만난다'가 함께 성립함을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "H1-RPM-034(DIRECT_ACTIVE): 판별식 $D$의 부호와 이차함수 그래프의 $x$축 교점 위치 관계를 판별하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식 $D=b^2-4ac$의 부호와 이차함수 그래프의 $x$축 위치 관계를 바로 연결하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "그래프", "src": "stem", "quote": "이차함수의 그래프와"}], "method": [{"term": "판별식", "src": "stem", "quote": "판별식 $D=b^2-4ac$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수의 그래프"}], "condition": []}, "reasons": {"method": "판별식의 부호를 계산하여 x축과의 위치 관계 표의 정오를 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.3

### 발문

이차함수 \$y=x^2-4x+7\$에 대하여 \$3\\le x\\le 5\$의 범위에서 최댓값과 최솟값의 합을 구하면?

### 선지

① \$12\$ ② \$14\$ ③ \$15\$ ④ \$16\$ ⑤ \$18\$

### 정답

④

### 해설

주어진 이차함수를 완전제곱식으로 변형하면 \$\$ \\begin{aligned} y &= x^2-4x+7 \\ &= (x-2)^2+3 \\end{aligned} \$\$ 꼭짓점의 \$x\$좌표는 \$2\$이고 아래로 볼록한 포물선이다. 주어진 범위 \$3\\le x\\le 5\$는 꼭짓점의 오른쪽에 있으므로 이 구간에서 \$x\$가 커질수록 \$y\$의 값도 증가한다. \$\$ \\begin{aligned} x=3\\text{일 때 최솟값: } y(3) &= 3^2-4\\cdot 3+7 \= 4 \\ x=5\\text{일 때 최댓값: } y(5) &= 5^2-4\\cdot 5+7 \= 12 \\end{aligned} \$\$ 따라서 최댓값과 최솟값의 합은 \$12+4=16\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [0, 6], "viewport": [0, 6, 0, 14], "pieces": [{"domain": [0, 6], "coefficients": ["7", "-4", "1"]}], "requiredPoints": [{"id": "V", "x": "2", "y": "3", "label": "(2, 3)"}, {"id": "A", "x": "3", "y": "4", "label": "(3, 4)"}, {"id": "B", "x": "5", "y": "12", "label": "(5, 12)"}]}, "caption": "이차함수 y=x^2-4x+7의 그래프와 구간 [3, 5]에서의 최솟값 (3, 4) 및 최댓값 (5, 12)"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "이차함수 $y=x^2-4x+7=(x-2)^2+3$의 꼭짓점 $x=2$가 구간 $[3,5]$ 밖에 있음을 확인하고 양 끝점 함숫값을 계산한다.", "decisiveStep": "구간 $[3,5]$에서 함수가 증가하므로 $y(3)=4$가 최솟값, $y(5)=12$가 최댓값임을 결정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "H1-RPM-037(DIRECT_ACTIVE): 제한된 구간 $[3,5]$에서 꼭짓점과 양 끝점을 비교해 이차함수의 최대·최소를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱식으로 꼭짓점과 구간의 상대 위치를 판단한 뒤 양 끝점 값을 더하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값의 합"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식으로 변형하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-4x+7$"}], "condition": [{"term": "꼭짓점", "src": "solution", "quote": "꼭짓점의 $x$좌표는 $2$"}]}, "reasons": {"method": "완전제곱식으로 축의 위치를 확인하고 구간 끝점에서 최대·최소를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.4

### 발문

다항식 \$P(x)=2x^2-3x+5\$를 \$x-2\$로 나누었을 때, 나머지를 구하면?

### 선지

① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$

### 정답

③

### 해설

나머지정리에 의하여 다항식 \$P(x)\$를 \$x-2\$로 나눈 나머지는 \$P(2)\$이다. \$\$ \\begin{aligned} P(2) &= 2\\cdot 2^2-3\\cdot 2+5 \\ &= 8-6+5 \\ &= 7 \\end{aligned} \$\$ 따라서 나머지는 \$7\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리를 이용해 일차식으로 나눈 나머지를 대입 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리에 따라 다항식 $P(x)=2x^2-3x+5$에 $x=2$를 대입하여 $P(2)$를 계산한다.", "decisiveStep": "$P(2)=2(4)-3(2)+5=7$을 계산해 나머지를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "H1-RPM-009(RPM_ONLY): 일차식으로 나눈 나머지를 구하는 문항으로, 정본 키선택표에서 안전 대응 키가 미확정(RPM_ONLY) 상태"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 $x-2$로 나눈 나머지에 나머지정리를 직접 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 구하면?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)=2x^2-3x+5$"}], "condition": []}, "reasons": {"method": "나머지정리로 x=2를 대입하여 나머지를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q06

- 형식: 객관식  
- 배점: 3.5

### 발문

이차방정식 \$x^2-6x+a+2=0\$이 중근을 가질 때, 상수 \$a\$의 값을 구하면? (단, \$a\$는 실수)

### 선지

① \$7\$ ② \$8\$ ③ \$9\$ ④ \$10\$ ⑤ \$11\$

### 정답

①

### 해설

이차방정식 \$x^2-6x+a+2=0\$이 중근을 가지려면 판별식 \$D=0\$이어야 한다. \$\$ \\begin{aligned} \\frac{D}{4} &= (-3)^2-1\\cdot(a+2) \\ &= 9-a-2 \\ &= 7-a \= 0 \\end{aligned} \$\$ 따라서 \$a=7\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 중근 조건 D=0을 세워 일차방정식을 푸는 순수 계산 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "이차방정식 $x^2-6x+a+2=0$의 판별식 $D/4=(-3)^2-(a+2)=0$을 세워 $a$를 구한다.", "decisiveStep": "$7-a=0$에서 상수 $a=7$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "H1-RPM-028(DIRECT_ACTIVE): 이차방정식의 중근 조건 $D=0$을 적용해 미정계수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 조건 $D=0$을 판별식 공식에 바로 대입해 상수를 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값을 구하면?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-6x+a+2=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 가질 때"}]}, "reasons": {"method": "중근 조건인 판별식 D=0을 적용하여 미지수 a를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.6

### 발문

이차방정식 \$x^2-4x-5=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라고 할 때, \$\\alpha^2+\\beta^2\$의 값은?

### 선지

① \$6\$ ② \$16\$ ③ \$21\$ ④ \$24\$ ⑤ \$26\$

### 정답

⑤

### 해설

이차방정식 \$x^2-4x-5=0\$의 두 근이 \$\\alpha\$, \$\\beta\$이므로 근과 계수의 관계에 의하여 \$\$ \\alpha+\\beta=4, \\quad \\alpha\\beta=-5 \$\$ 곱셈 공식의 변형을 이용하면 \$\$ \\begin{aligned} \\alpha^2+\\beta^2 &= (\\alpha+\\beta)^2-2\\alpha\\beta \\ &= 4^2-2(-5) \\ &= 16+10 \= 26 \\end{aligned} \$\$ 따라서 \$\\alpha^2+\\beta^2\$의 값은 \$26\$이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계와 곱셈 공식 변형으로 대칭식을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "이차방정식 $x^2-4x-5=0$에서 근과 계수의 관계로 $\\alpha+\\beta=4$, $\\alpha\\beta=-5$를 구한 뒤 $(\\alpha+\\beta)^2-2\\alpha\\beta$를 계산한다.", "decisiveStep": "$\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=16+10=26$으로 값을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계로 두 근의 대칭식을 구하는 문항(exact binding 누락으로 BINDING_GAP)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계로 합과 곱을 구한 뒤 제곱의 합 대칭식 공식에 대입하는 2단계 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "$\\alpha^2+\\beta^2$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-4x-5=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 두 근의 합과 곱을 구해 제곱합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q08

- 형식: 객관식  
- 배점: 3.6

### 발문

\$x\$에 대한 삼차방정식 \$x^3-ax^2+5x-6=0\$의 세 근을 \$2\$, \$\\alpha\$, \$\\beta\$라고 할 때, \$\\alpha+\\beta\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

②

### 해설

\$2\$가 삼차방정식 \$x^3-ax^2+5x-6=0\$의 근이므로 \$x=2\$를 대입하면 \$\$ \\begin{aligned} 2^3-a\\cdot 2^2+5\\cdot 2-6 &= 0 \\ 8-4a+10-6 &= 0 \\ 12-4a &= 0 \\ a &= 3 \\end{aligned} \$\$ 삼차방정식의 근과 계수의 관계에 의하여 세 근의 합은 \$\$ 2+\\alpha+\\beta \= \-(-a) \= a \= 3 \$\$ 따라서 \$\\alpha+\\beta \= 3-2 \= 1\$이다.

```
{"status": "EXEMPT", "reason": "삼차방정식에 한 근을 대입해 계수를 구한 뒤 근과 계수의 관계를 쓰는 순수 방정식 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "한 근 $x=2$를 삼차방정식 $x^3-ax^2+5x-6=0$에 대입해 $a=3$을 구한 뒤, 세 근의 합 $2+\\alpha+\\beta=a$를 적용한다.", "decisiveStep": "$a=3$을 구해 세 근의 합 식 $2+\\alpha+\\beta=3$에서 $\\alpha+\\beta=1$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "H1-RPM-043(RPM_ONLY): 삼차방정식의 한 근이 주어질 때 근과 계수의 관계를 활용하는 문항(정본 키선택표 RPM_ONLY)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 근의 대입으로 미정계수 $a$를 찾고 삼차방정식의 근과 계수의 관계를 연결하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "solution", "quote": "세 근의 합"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-ax^2+5x-6=0$"}], "condition": []}, "reasons": {"method": "한 근 대입 후 삼차방정식의 세 근의 합 공식으로 나머지 두 근의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q09

- 형식: 객관식  
- 배점: 3.8

### 발문

다음 다항식의 인수분해 중 옳은 것은?

### 선지

① \$x^2-4xy+4y^2=(x+2y)^2\$ ② \$27x^3+1=(3x+1)(9x^2+3x+1)\$ ③ \$(x+y+3)(x+y-3)+8=(x+y+1)(x+y-1)\$ ④ \$x^3-2x^2-x+2=(x-1)(x-2)(x+2)\$ ⑤ \$x^4-5x^2+4=(x^2-1)(x+2)^2\$

### 정답

③

### 해설

각 등식의 좌변과 우변을 비교한다. \$\$ \\begin{aligned} \\text{① } (x+2y)^2 &= x^2+4xy+4y^2 \\ne x^2-4xy+4y^2 \\ \\text{② } 27x^3+1 &= (3x+1)(9x^2-3x+1) \\ne (3x+1)(9x^2+3x+1) \\ \\text{③ } t=x+y\\text{로 치환하면 } (t+3)(t-3)+8 &= t^2-9+8 \= t^2-1 \= (t+1)(t-1) \\ &= (x+y+1)(x+y-1) \\ \\text{④ } x^3-2x^2-x+2 &= x^2(x-2)-(x-2) \= (x^2-1)(x-2) \= (x-1)(x+1)(x-2) \\ \\text{⑤ } x^4-5x^2+4 &= (x^2-1)(x^2-4) \= (x^2-1)(x+2)(x-2) \\end{aligned} \$\$ 따라서 옳은 것은 ③이다.

```
{"status": "EXEMPT", "reason": "다항식의 인수분해 결과를 전개 및 치환으로 검증하는 순수 식 변형 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "공통부분 $t=x+y$ 치환과 세제곱·고차식 인수분해 공식을 적용해 다섯 보기의 등식 성립 여부를 판별한다.", "decisiveStep": "③에서 $t=x+y$로 치환해 $(t^2-9)+8=t^2-1=(t+1)(t-1)$이 됨을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "H1-RPM-014(DIRECT_ACTIVE): 치환과 공식을 단계적으로 적용해 다항식의 인수분해 정오를 판별하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "치환, 세제곱 공식, 인수정리를 아울러 다섯 개 인수분해 식의 정오를 가리는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "다항식의 인수분해 중"}], "method": [{"term": "전개", "src": "solution", "quote": "우변을 비교한다", "evidenceType": "IMPLIED", "justification": "공식을 적용하거나 전개해 좌우변 일치 여부를 확인함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다음 다항식의"}], "condition": []}, "reasons": {"method": "치환과 인수분해 공식을 이용해 각 보기의 정오를 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

등식 \$(x-y)+4i=5+2yi\$가 성립할 때, 실수 \$x\$, \$y\$에 대하여 \$x+y\$의 값은?

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$

### 정답

④

### 해설

\$x\$, \$y\$가 실수이므로 복소수가 서로 같을 조건에 의하여 실수부분끼리, 허수부분끼리 각각 같다. \$\$ \\begin{aligned} x-y &= 5 \\ 4 &= 2y \\end{aligned} \$\$ 두 번째 식에서 \$y=2\$이고, 첫 번째 식에 대입하면 \$x-2=5\$이므로 \$x=7\$이다. 따라서 \$x+y=7+2=9\$이다.

```
{"status": "EXEMPT", "reason": "복소수의 상등 조건으로 실수부·허수부를 비교해 연립방정식을 푸는 순수 계산 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "복소수 상등 조건에 따라 $(x-y)+4i=5+2yi$의 실수부분 $x-y=5$와 허수부분 $2y=4$를 연립한다.", "decisiveStep": "$y=2$를 구하고 $x-y=5$에 대입해 $x=7$, $x+y=9$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "서로 같은 복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "H1-RPM-022(DIRECT_ACTIVE): 복소수가 서로 같을 조건을 이용해 실수부분과 허수부분을 비교하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수가 서로 같을 조건을 적용해 실수부와 허수부를 바로 비교하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "합", "src": "stem", "quote": "$x+y$의 값은?"}], "method": [{"term": "실수부분", "src": "solution", "quote": "실수부분끼리, 허수부분끼리", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "solution", "quote": "복소수가 서로 같을 조건"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $x$, $y$에 대하여"}]}, "reasons": {"method": "복소수의 실수부분과 허수부분을 각각 비교하여 x, y를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.1

### 발문

이차함수 \$y=x^2+ax+5\$의 그래프와 직선 \$y=3x+b\$가 만나는 두 점의 \$x\$좌표가 \$-1\$, \$4\$일 때, 실수 \$a\$, \$b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$7\$ ② \$9\$ ③ \$11\$ ④ \$13\$ ⑤ \$15\$

### 정답

②

### 해설

이차함수 \$y=x^2+ax+5\$와 직선 \$y=3x+b\$의 교점의 \$x\$좌표는 방정식 \$\$ x^2+ax+5 \= 3x+b \$\$ 즉, \$\$ x^2+(a-3)x+(5-b) \= 0 \$\$ 의 두 근이다. 이 이차방정식의 두 근이 \$-1\$, \$4\$이므로 근과 계수의 관계에 의하여 \$\$ \\begin{aligned} (-1)+4 &= \-(a-3) \\implies 3 \= \-a+3 \\implies a \= 0 \\ (-1)\\cdot 4 &= 5-b \\implies \-4 \= 5-b \\implies b \= 9 \\end{aligned} \$\$ 따라서 \$a+b \= 0+9 \= 9\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-3, 6], "viewport": [-3, 6, 0, 24], "pieces": [{"domain": [-3, 6], "coefficients": ["5", "0", "1"]}], "referenceLines": [{"slope": "3", "intercept": "9", "label": "y=3x+9"}], "requiredPoints": [{"id": "P1", "x": "-1", "y": "6", "label": "(-1, 6)"}, {"id": "P2", "x": "4", "y": "21", "label": "(4, 21)"}]}, "caption": "이차함수 y=x^2+5의 그래프와 직선 y=3x+9가 x=-1, x=4에서 만나는 교점"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "이차함수 $y=x^2+ax+5$와 직선 $y=3x+b$를 연립한 이차방정식 $x^2+(a-3)x+(5-b)=0$에 두 근 $-1, 4$의 근과 계수의 관계를 적용한다.", "decisiveStep": "두 근의 합 $-1+4=-(a-3)$에서 $a=0$, 곱 $-4=5-b$에서 $b=9$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "H1-RPM-035(DIRECT_ACTIVE): 이차함수와 직선의 교점의 $x$좌표를 연립방정식의 근으로 해석해 미정계수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수의 교점을 방정식의 근으로 전환한 뒤 근과 계수의 관계로 계수를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "교점", "src": "solution", "quote": "교점의 $x$좌표는"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+ax+5$"}, {"term": "직선", "src": "stem", "quote": "직선 $y=3x+b$"}], "condition": []}, "reasons": {"method": "연립이차방정식의 두 근에 근과 계수의 관계를 적용해 미정계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.3

### 발문

세 다항식 \$A\$, \$B\$, \$C\$가 다음과 같을 때, \$(A+2B)+(A-3B)-C\$를 계산한 값은? \$\$A=x^2+2xy-y^2, \\quad B=2x^2-xy+3y^2, \\quad C=-x^2+4xy+2y^2\$\$

### 선지

① \$x^2+xy-7y^2\$ ② \$x^2-xy-7y^2\$ ③ \$3x^2+xy-3y^2\$ ④ \$x^2+9xy-7y^2\$ ⑤ \$5x^2+xy-7y^2\$

### 정답

①

### 해설

먼저 구하는 식을 \$A\$, \$B\$, \$C\$에 대하여 간단히 정리한다. \$\$ (A+2B)+(A-3B)-C \= 2A-B-C \$\$ 여기에 각 다항식을 대입하여 계산하면 \$\$ \\begin{aligned} 2A-B-C &= 2(x^2+2xy-y^2)-(2x^2-xy+3y^2)-(-x^2+4xy+2y^2) \\ &= (2x^2+4xy-2y^2)+(-2x^2+xy-3y^2)+(x^2-4xy-2y^2) \\ &= (2-2+1)x^2+(4+1-4)xy+(-2-3-2)y^2 \\ &= x^2+xy-7y^2 \\end{aligned} \$\$ 따라서 계산한 값은 \$x^2+xy-7y^2\$이다.

```
{"status": "EXEMPT", "reason": "세 다항식의 일차결합을 정리해 대입 계산하는 순수 대수 연산 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "주어진 식 $(A+2B)+(A-3B)-C$를 먼저 $2A-B-C$로 정리한 뒤 $A, B, C$를 대입해 동류항을 모은다.", "decisiveStep": "식을 $2A-B-C$로 단순화한 후 $x^2, xy, y^2$의 계수를 각각 합산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "H1-RPM-002(DIRECT_ACTIVE): 세 다항식의 일차결합을 간단히 정리한 뒤 대입해 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 식을 먼저 정리한 다음 두 문자 이차식을 대입해 부호 실수 없이 계산하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "세 다항식 $A$, $B$, $C$"}], "method": [{"term": "다항식", "src": "solution", "quote": "각 다항식을 대입하여", "evidenceType": "IMPLIED", "justification": "문자로 된 식을 먼저 정리한 뒤 다항식의 덧셈과 뺄셈을 수행함"}], "given": [{"term": "다항식", "src": "stem", "quote": "세 다항식 $A$, $B$, $C$"}], "condition": []}, "reasons": {"method": "주어진 식을 2A-B-C로 정리한 뒤 다항식을 대입해 동류항을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.4

### 발문

다항식 \$P(x)\$가 삼차식일 때, \$P(x)+3\$은 \$(x-1)^2\$으로 나누어떨어지고, \$29-P(x)\$는 \$x^2-9\$로 나누어떨어진다. 다항식 \$P(x)\$를 \$x+1\$로 나눈 나머지는?

### 선지

① \$7\$ ② \$9\$ ③ \$11\$ ④ \$13\$ ⑤ \$15\$

### 정답

④

### 해설

\$P(x)\$가 삼차식이고 \$P(x)+3\$이 \$(x-1)^2\$으로 나누어떨어지므로 상수 \$A\$, \$B\$에 대하여 \$\$ P(x)+3 \= (x-1)^2(Ax+B) \$\$ 즉, \$\$ P(x) \= (x-1)^2(Ax+B)-3 \$\$ 으로 놓을 수 있다. 또한 \$29-P(x)\$가 \$x^2-9=(x-3)(x+3)\$으로 나누어떨어지므로 나머지정리에 의하여 \$P(3)=29\$, \$P(-3)=29\$이다. \$\$ \\begin{aligned} P(3) &= (3-1)^2(3A+B)-3 \= 4(3A+B)-3 \= 29 \\implies 3A+B \= 8 \\ P(-3) &= (-3-1)^2(-3A+B)-3 \= 16(-3A+B)-3 \= 29 \\implies \-3A+B \= 2 \\end{aligned} \$\$ 두 식을 더하면 \$2B=10\$이므로 \$B=5\$, 대입하면 \$3A+5=8\$이므로 \$A=1\$이다. 따라서 \$P(x)=(x-1)^2(x+5)-3\$이고, \$P(x)\$를 \$x+1\$로 나눈 나머지는 \$\$ P(-1) \= (-1-1)^2(-1+5)-3 \= 4\\cdot 4-3 \= 13 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "삼차다항식의 나눗셈 조건을 인수정리와 나머지정리로 연립해 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "삼차식 조건으로 $P(x)=(x-1)^2(Ax+B)-3$을 세우고, $P(3)=P(-3)=29$를 연립해 $A, B$를 구한 뒤 $P(-1)$을 계산한다.", "decisiveStep": "$P(3)=29$와 $P(-3)=29$에서 $3A+B=8$, $-3A+B=2$를 얻어 $A=1, B=5$를 결정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "H1-RPM-010(FAMILY_ACTIVE): 이차식 및 합성 제수 나눗셈 조건을 결합해 삼차다항식 $P(x)$를 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리로 삼차다항식의 뼈대를 세우고 두 개의 나머지 조건을 연립해 계수를 확정하는 3단계 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지는?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$가 삼차식"}], "condition": [{"term": "상수", "src": "solution", "quote": "상수 $A$, $B$에 대하여"}]}, "reasons": {"method": "나눗셈 조건으로부터 삼차식 골격을 세우고 나머지정리 연립으로 미정계수를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.5

### 발문

\$a\$, \$b\$가 정수이고, \$n\$이 \$50\$ 이하의 자연수일 때, 다항식 \$x^3+(ab-4)x-2n\$ 중에서 \$(x+2)(x-a)(x-b)\$의 꼴로 인수분해되는 다항식의 개수를 구하면?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

\$(x+2)(x-a)(x-b)\$를 전개하면 \$\$ \\begin{aligned} (x+2)(x-a)(x-b) &= (x+2){x^2-(a+b)x+ab} \\ &= x^3+(2-a-b)x^2+{ab-2(a+b)}x+2ab \\end{aligned} \$\$ 이 식이 \$x^3+(ab-4)x-2n\$과 같아야 하므로 계수를 비교하면 \$\$ 2-a-b=0 \\implies a+b=2, \\qquad 2ab=-2n \\implies n=-ab \$\$ \$b=2-a\$를 대입하면 \$n=-a(2-a)=a(a-2)\$이다. \$n\$은 \$1\\le n\\le 50\$인 자연수이고 \$a, b\$는 정수이므로, \$a(a-2)\>0\$에서 \$a\\ge 3\$ 또는 \$a\\le \-1\$이다. 한편 \$a\\le \-1\$인 경우는 \$b=2-a\\ge 3\$인 경우와 순서만 바뀐 같은 다항식 \$(x+2)(x-a)(x-b)\$를 만든다. 따라서 \$a\\ge 3\$인 경우만 세면 된다. \$\$ \\begin{aligned} a=3 &\\implies n=3\\cdot 1=3 \\ a=4 &\\implies n=4\\cdot 2=8 \\ a=5 &\\implies n=5\\cdot 3=15 \\ a=6 &\\implies n=6\\cdot 4=24 \\ a=7 &\\implies n=7\\cdot 5=35 \\ a=8 &\\implies n=8\\cdot 6=48 \\le 50 \\ a=9 &\\implies n=9\\cdot 7=63 \> 50 \\end{aligned} \$\$ 서로 다른 \$n\$은 서로 다른 상수항 \$-2n\$을 만들므로 조건을 만족하는 다항식은 모두 \$6\$개이다.

```
{"status": "EXEMPT", "reason": "전개 후 계수비교와 정수·자연수 부등식 범위로 개수를 세는 순수 대수·정수 조건 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$(x+2)(x-a)(x-b)$를 전개해 계수비교로 $a+b=2$, $n=a(a-2)$를 얻고, $1\\le n\\le 50$과 대칭성으로 개수를 센다.", "decisiveStep": "$a$와 $b$의 대칭성에 의해 $a\\ge 3$만 중복 없이 세어 $n\\le 50$인 $a=3,4,5,6,7,8$을 찾는다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "H1-RPM-020(DIRECT_ACTIVE): 인수분해 꼴을 전개해 계수비교와 정수·자연수 조건식으로 개수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "계수비교, 정수 조건, 대칭성에 따른 중복 제거, 부등식 상한 판별을 모두 수행하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "다항식의 개수를 구하면?"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^3+(ab-4)x-2n$"}], "condition": [{"term": "정수", "src": "stem", "quote": "$a$, $b$가 정수이고"}, {"term": "자연수", "src": "stem", "quote": "$50$ 이하의 자연수"}]}, "reasons": {"method": "인수분해 꼴을 전개해 계수비교 후 정수 조건과 대칭성으로 자연수 n의 개수를 셈"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.5

### 발문

복소수 \$z=a+bi\$ (\$a\$, \$b\$는 실수)에 대하여 \$\\dfrac{z-9}{z-3}\$의 허수부분이 \$1\$일 때, \$(z-3-3i)\\times\\overline{(z-3-3i)}\$의 값을 구하면?

### 선지

① \$5\$ ② \$7\$ ③ \$9\$ ④ \$11\$ ⑤ \$13\$

### 정답

③

### 해설

\$u=z-3\$이라 두고 \$x=a-3\$이라 쓰면 \$u=x+bi\$ (\$u\\ne 0\$)이고 \$z-9=u-6\$이다. \$\$ \\frac{z-9}{z-3} \= \\frac{u-6}{u} \= 1 - \\frac{6}{u} \= 1 - \\frac{6(x-bi)}{x^2+b^2} \= \\left(1-\\frac{6x}{x^2+b^2}\\right) \+ \\frac{6b}{x^2+b^2}i \$\$ 허수부분이 \$1\$이므로 \$\$ \\frac{6b}{x^2+b^2} \= 1 \\implies x^2+b^2 \= 6b \$\$ 이제 구하는 식은 \$z-3-3i \= x+(b-3)i\$와 그 켤레복소수의 곱이므로 \$\$ \\begin{aligned} (z-3-3i)\\overline{(z-3-3i)} &= x^2+(b-3)^2 \\ &= x^2+b^2-6b+9 \\ &= 6b-6b+9 \\ &= 9 \\end{aligned} \$\$ 따라서 구하는 값은 \$9\$이다.

```
{"status": "EXEMPT", "reason": "복소수 나눗셈의 실수화와 켤레복소수의 곱 식 변형으로 값을 구하는 순수 계산 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$u=z-3=x+bi$로 치환하여 $\\frac{z-9}{z-3}=1-\\frac{6}{u}$의 허수부분에서 $x^2+b^2=6b$를 얻고 켤레복소수 곱에 대입한다.", "decisiveStep": "$x^2+b^2=6b$ 관계식을 $x^2+(b-3)^2=x^2+b^2-6b+9$에 대입해 소거한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "H1-RPM-024(DIRECT_ACTIVE): 복소수 몫의 허수부분 조건에서 얻은 관계식을 켤레복소수 곱에 대입해 값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분모 실수화로 얻은 $x^2+b^2=6b$ 관계식을 소거 없이 통째로 켤레곱에 대입하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱", "src": "solution", "quote": "켤레복소수의 곱"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수의 곱이므로", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=a+bi$"}], "condition": [{"term": "허수부분", "src": "stem", "quote": "허수부분이 $1$일 때"}]}, "reasons": {"method": "복소수 몫의 허수부분 조건에서 x^2+b^2=6b를 도출해 켤레곱을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.6

### 발문

그림과 같이 반지름의 길이가 \$r\$인 원 \$O\$에서 선분 \$AC\$와 원의 두 교점을 \$B\$, \$C\$라 하고(단, 네 점은 \$A, B, D, C\$ 순), 원의 중심 \$O\$에서 현 \$BC\$에 내린 수선의 발을 \$D\$라 하자. \$\\overline{AD}=3r\$, \$\\overline{OD}=h\$일 때, \$\\overline{AC}\$, \$\\overline{AB}\$를 두 근으로 갖는 이차방정식은?

### 선지

① \$x^2-6rx+8r^2+h^2=0\$ ② \$x^2+6rx+8r^2+h^2=0\$ ③ \$x^2-6rx+8r^2-h^2=0\$ ④ \$x^2-6rx-8r^2+h^2=0\$ ⑤ \$x^2+6rx-8r^2-h^2=0\$

### 정답

①

### 해설

원의 중심 \$O\$에서 현 \$BC\$에 내린 수선 \$OD\$는 현 \$BC\$를 수직이등분하므로 \$\\overline{DB}=\\overline{DC}\$이다. \$\\overline{DC}=d\$라 두면 직각삼각형 \$ODC\$에서 \$\\overline{OC}=r\$, \$\\overline{OD}=h\$이므로 피타고라스 정리에 의하여 \$\$ d^2+h^2=r^2 \\implies d^2=r^2-h^2 \$\$ 네 점이 \$A, B, D, C\$ 순이고 \$\\overline{AD}=3r\$이므로 \$\$ \\overline{AB}=3r-d, \\quad \\overline{AC}=3r+d \$\$ 따라서 두 근의 합과 곱은 다음과 같다. \$\$ \\begin{aligned} \\overline{AB}+\\overline{AC} &= (3r-d)+(3r+d) \= 6r \\ \\overline{AB}\\cdot\\overline{AC} &= (3r-d)(3r+d) \= 9r^2-d^2 \= 9r^2-(r^2-h^2) \= 8r^2+h^2 \\end{aligned} \$\$ 그러므로 \$\\overline{AC}\$, \$\\overline{AB}\$를 두 근으로 갖는 이차방정식은 \$x^2-6rx+8r^2+h^2=0\$이다.

```
{"capability": "plane", "title": "원 O와 현 BC, 수선 OD 및 점 A", "points": [{"id": "O", "x": 0, "y": 0, "label": "O"}, {"id": "D", "x": 0, "y": -3, "label": "D"}, {"id": "B", "x": -4, "y": -3, "label": "B"}, {"id": "C", "x": 4, "y": -3, "label": "C"}, {"id": "A", "x": -15, "y": -3, "label": "A"}], "circles": [{"id": "k", "center": "O", "radius": 5}], "segments": [{"id": "sAC", "from": "A", "to": "C"}, {"id": "sOD", "from": "O", "to": "D"}, {"id": "sOC", "from": "O", "to": "C"}], "rightAngles": [{"vertex": "D", "p1": "O", "p2": "C"}], "planeMarks": {"equalLengths": [{"id": "e1", "count": 1, "segments": ["sBD", "sDC"]}], "facts": [{"kind": "ON_CIRCLE", "circle": "k", "points": ["B", "C"]}]}, "caption": "반지름이 r인 원 O에서 현 BC에 내린 수선 OD와 연장선 위의 점 A"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "원의 중심 $O$에서 현 $BC$에 내린 수선의 성질($DB=DC=d$)과 피타고라스 정리 $d^2=r^2-h^2$을 이용해 $\\overline{AB}, \\overline{AC}$의 합과 곱을 구한다.", "decisiveStep": "$\\overline{AB}=3r-d$, $\\overline{AC}=3r+d$로 나타내어 곱 $9r^2-d^2=8r^2+h^2$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "H1-RPM-030(DIRECT_BINDING_GAP): 두 선분의 합과 곱을 구해 이를 두 근으로 갖는 이차방정식을 작성하는 문항(exact binding 누락으로 BINDING_GAP)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원·현의 수직이등분선과 피타고라스 정리를 이차방정식의 작성으로 연결하는 융합 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "두 근으로 갖는 이차방정식은?"}], "method": [{"term": "피타고라스정리", "src": "solution", "quote": "피타고라스 정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "원", "src": "stem", "quote": "원 $O$에서"}, {"term": "현", "src": "stem", "quote": "현 $BC$에 내린"}], "condition": [{"term": "수선", "src": "stem", "quote": "수선의 발을 $D$라 하자"}]}, "reasons": {"method": "현의 수직이등분과 피타고라스 정리로 두 선분의 합과 곱을 구해 이차방정식을 세움"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q17

- 형식: 객관식  
- 배점: 4.7

### 발문

실수 계수를 갖는 사차식 \$f(x)\$가 다음 조건을 만족한다. (가) \$f(x)\$의 최고차항의 계수는 \$1\$이다. (나) \$f(x)\$의 삼차항의 계수는 \$0\$이다. (다) \$2+i\$는 방정식 \$f(x)=0\$의 한 근이며, 방정식 \$f(x)=0\$은 실수인 중근을 갖는다. \$f(1)\$의 값은?

### 선지

① \$12\$ ② \$14\$ ③ \$16\$ ④ \$18\$ ⑤ \$20\$

### 정답

④

### 해설

\$f(x)\$의 계수가 모두 실수이고 \$2+i\$가 \$f(x)=0\$의 근이므로, 켤레복소수 \$2-i\$도 \$f(x)=0\$의 근이다. 두 근 \$2+i\$, \$2-i\$를 갖는 이차식은 \$\$ {x-(2+i)}{x-(2-i)} \= (x-2)^2+1 \= x^2-4x+5 \$\$ 나머지 두 근은 실수인 중근이므로 이를 \$r, r\$이라 하고 최고차항의 계수가 \$1\$임을 적용하면 \$\$ \\begin{aligned} f(x) &= (x^2-4x+5)(x-r)^2 \\ &= (x^2-4x+5)(x^2-2rx+r^2) \\end{aligned} \$\$ 여기서 \$x^3\$항의 계수는 \$-2r-4\$이다. 조건 (나)에서 삼차항의 계수가 \$0\$이므로 \$\$ \-2r-4 \= 0 \\implies r \= \-2 \$\$ 따라서 \$f(x)=(x^2-4x+5)(x+2)^2\$이므로 \$\$ f(1) \= (1^2-4\\cdot 1+5)(1+2)^2 \= 2\\cdot 9 \= 18 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "켤레근 성질과 인수정리로 사차다항식을 결정해 함숫값을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "실수 계수 조건으로 켤레근 $2-i$를 얻어 인수 $x^2-4x+5$를 만들고, 실수 중근 $r$을 둔 뒤 삼차항 계수 $0$으로 $r=-2$를 구한다.", "decisiveStep": "$f(x)=(x^2-4x+5)(x-r)^2$의 삼차항 계수 $-2r-4=0$에서 중근 $r=-2$를 확정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "H1-RPM-031(DIRECT_BINDING_GAP): 실수 계수 방정식의 켤레복소수 근 성질을 이용해 다항식을 결정하는 문항(exact binding 누락으로 BINDING_GAP)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레근 성질, 중근 인수 설정, 삼차항 계수 비교를 결합한 사차방정식 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "사차식", "src": "stem", "quote": "사차식 $f(x)$가"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수 $2-i$도", "evidenceType": "NAMED"}], "given": [{"term": "사차식", "src": "stem", "quote": "실수 계수를 갖는 사차식"}], "condition": [{"term": "최고차항", "src": "stem", "quote": "최고차항의 계수는 $1$"}, {"term": "중근", "src": "stem", "quote": "실수인 중근을 갖는다"}]}, "reasons": {"method": "켤레근과 중근 인수로 사차식을 세우고 삼차항 계수 조건으로 중근을 결정함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q18

- 형식: 객관식  
- 배점: 5

### 발문

\$x\$, \$y\$에 대한 이차식 \$x^2+5xy+4y^2-3ax-3ay+a^2-b^2-c^2\$이 \$x\$, \$y\$에 대한 두 일차식의 곱으로 인수분해될 때, 양수 \$a\$, \$b\$, \$c\$를 세 변의 길이로 하는 삼각형은 어떤 삼각형인가?

### 선지

① \$a=b\$인 이등변삼각형 ② 빗변의 길이가 \$a\$인 직각삼각형 ③ 빗변의 길이가 \$b\$인 직각삼각형 ④ 빗변의 길이가 \$c\$인 직각삼각형 ⑤ 정삼각형

### 정답

②

### 해설

\$x^2+5xy+4y^2=(x+y)(x+4y)\$이므로 주어진 이차식이 두 일차식의 곱으로 인수분해되면 상수 \$u\$, \$v\$에 대하여 \$\$ (x+y+u)(x+4y+v) \$\$ 의 꼴로 나타낼 수 있다. 이를 전개하여 \$x\$항과 \$y\$항의 계수를 비교하면 \$\$ \\begin{aligned} u+v &= \-3a \\ 4u+v &= \-3a \\end{aligned} \$\$ 두 식을 빼면 \$3u=0\$이므로 \$u=0\$, 따라서 \$v=-3a\$이다. 이 곱의 상수항은 \$uv=0\$이므로 원래 식의 상수항과 비교하면 \$\$ a^2-b^2-c^2 \= 0 \\implies a^2 \= b^2+c^2 \$\$ \$a, b, c\$는 삼각형의 세 변의 길이인 양수이므로 이 삼각형은 빗변의 길이가 \$a\$인 직각삼각형이다.

```
{"capability": "plane", "title": "빗변이 a인 직각삼각형", "points": [{"id": "A", "x": 0, "y": 3, "label": "A"}, {"id": "C", "x": 0, "y": 0, "label": "C"}, {"id": "B", "x": 4, "y": 0, "label": "B"}], "segments": [{"id": "sAB", "from": "A", "to": "B", "label": "a"}, {"id": "sBC", "from": "B", "to": "C", "label": "b"}, {"id": "sCA", "from": "C", "to": "A", "label": "c"}], "rightAngles": [{"vertex": "C", "p1": "A", "p2": "B"}], "caption": "a^2=b^2+c^2을 만족하는 빗변의 길이가 a인 직각삼각형"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "이차항 부분 $x^2+5xy+4y^2=(x+y)(x+4y)$를 바탕으로 두 일차식의 곱 $(x+y+u)(x+4y+v)$를 세워 계수비교로 $a^2=b^2+c^2$을 도출한다.", "decisiveStep": "$u+v=-3a$와 $4u+v=-3a$에서 $u=0$을 얻어 상수항 $a^2-b^2-c^2=uv=0$을 도출한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "H1-RPM-020(DIRECT_ACTIVE): 두 일차식의 곱으로 인수분해되는 조건에서 계수비교로 $a^2=b^2+c^2$을 도출해 삼각형을 판별하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 일차식의 곱 인수분해 조건을 미정계수 계수비교로 풀어 피타고라스 관계식을 도출하는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "직각삼각형", "src": "choices", "quote": "빗변의 길이가 $a$인 직각삼각형"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "이차식", "src": "stem", "quote": "$x$, $y$에 대한 이차식"}], "condition": [{"term": "일차식", "src": "stem", "quote": "두 일차식의 곱으로 인수분해될 때"}]}, "reasons": {"method": "두 일차식의 곱 형태로 놓고 계수비교해 상수항 조건으로 직각삼각형을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 5.1

### 발문

그림과 같이 평평한 지면 위에 있는 두 지점 \$A\$, \$B\$ 사이의 거리는 \$8\\text{m}\$이다. 두 지점 \$A\$, \$B\$에서 각각 \$6\\text{m}\$, \$2\\text{m}\$ 떨어진 \$C\$지점에 지면과 수직으로 높이가 \$4\\text{m}\$인 기둥이 세워져 있다. \$A\$지점에서 쏘아 올린 공이 포물선 모양으로 날아 기둥의 꼭대기에서 지면에 수직으로 \$5\\text{m}\$ 위인 \$P\$지점을 지나 \$B\$지점에 떨어졌다. 이 공이 가장 높이 올라갔을 때의 지면으로부터의 높이는? (단, 포물선의 축은 지면에 수직이고, 공의 크기와 기둥의 굵기는 생각하지 않는다.)

### 선지

① \$8\\text{m}\$ ② \$9\\text{m}\$ ③ \$10\\text{m}\$ ④ \$11\\text{m}\$ ⑤ \$12\\text{m}\$

### 정답

⑤

### 해설

지점 \$A\$를 원점 \$(0, 0)\$, 지면이 \$x\$축이 되도록 좌표평면을 잡으면 \$B(8, 0)\$, \$C(6, 0)\$이다. 기둥의 높이가 \$4\\text{m}\$이고 \$P\$는 기둥 꼭대기보다 \$5\\text{m}\$ 위이므로 \$P(6, 9)\$이다. 공의 궤적은 \$x=0\$과 \$x=8\$에서 지면과 만나므로 포물선의 식을 \$\$ y \= kx(8-x) \$\$ 으로 놓을 수 있다. 이 포물선이 점 \$P(6, 9)\$를 지나므로 \$\$ 9 \= k\\cdot 6\\cdot (8-6) \= 12k \\implies k \= \\frac{3}{4} \$\$ 두 근 \$0\$과 \$8\$의 중점 \$x=4\$에서 대칭축을 가지므로 최댓값(최고 높이)은 \$x=4\$일 때이다. \$\$ y \= \\frac{3}{4}\\cdot 4\\cdot (8-4) \= 12 \$\$ 따라서 공이 가장 높이 올라갔을 때의 지면으로부터의 높이는 \$12\\text{m}\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [0, 8], "viewport": [-1, 9, 0, 14], "pieces": [{"domain": [0, 8], "coefficients": ["0", "6", "-3/4"]}], "requiredPoints": [{"id": "A", "x": "0", "y": "0", "label": "A(0,0)"}, {"id": "B", "x": "8", "y": "0", "label": "B(8,0)"}, {"id": "C", "x": "6", "y": "0", "label": "C(6,0)"}, {"id": "P", "x": "6", "y": "9", "label": "P(6,9)"}, {"id": "V", "x": "4", "y": "12", "label": "최고점(4,12)"}]}, "caption": "지점 A(0,0)에서 출발해 P(6,9)를 지나 B(8,0)에 떨어지는 포물선 궤적 y=(3/4)x(8-x)"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "지면을 $x$축, $A(0,0)$, $B(8,0)$으로 좌표화하여 $y=kx(8-x)$를 세우고 $P(6,9)$를 대입해 최고 높이 $y(4)$를 구한다.", "decisiveStep": "$P(6, 4+5)=(6,9)$를 $y=kx(8-x)$에 대입해 $k=3/4$를 찾고 대칭축 $x=4$에서 높이를 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "H1-RPM-038(DIRECT_ACTIVE): 실생활 포물선 상황을 이차함수로 모델링하여 최댓값(최고 높이)을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실생활 문장을 좌표평면 위 이차함수로 모델링하고 절편형 식과 대칭축으로 최댓값을 구하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "solution", "quote": "최댓값(최고 높이)은"}], "method": [{"term": "포물선", "src": "stem", "quote": "포물선 모양으로 날아", "evidenceType": "IMPLIED", "justification": "두 x절편을 이용해 이차함수 식 y=kx(8-x)를 세우는 포물선 모델링"}], "given": [{"term": "포물선", "src": "stem", "quote": "포물선의 축은"}], "condition": [{"term": "축", "src": "stem", "quote": "포물선의 축은 지면에 수직"}]}, "reasons": {"method": "지면 두 점을 x절편으로 하는 이차함수 식을 세워 한 점 대입 후 꼭짓점 높이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 5.2

### 발문

그림과 같이 두 직선 \$l\_1: 3x-y+3=0\$, \$l\_2: x+y-5=0\$과 \$x\$축으로 둘러싸인 부분에 직사각형이 있다. 이 직사각형의 한 변은 \$x\$축 위에 있고 두 꼭짓점은 각각 직선 \$l\_1\$, \$l\_2\$ 위에 있을 때, 직사각형의 넓이의 최댓값은?

### 선지

① \$\\dfrac{25}{4}\$ ② \$\\dfrac{13}{2}\$ ③ \$\\dfrac{27}{4}\$ ④ \$7\$ ⑤ \$\\dfrac{29}{4}\$

### 정답

③

### 해설

두 직선 \$l\_1: y=3x+3\$, \$l\_2: y=5-x\$의 교점의 \$y\$좌표는 \$3x+3=5-x\$에서 \$x=\\dfrac{1}{2}\$, \$y=\\dfrac{9}{2}\$이다. 직사각형의 세로(높이)의 길이를 \$t\$ (\$0\<t\<\\dfrac{9}{2}\$)라 하면, \$l\_1\$ 위의 꼭짓점의 \$x\$좌표는 \$\\dfrac{t-3}{3}\$이고, \$l\_2\$ 위의 꼭짓점의 \$x\$좌표는 \$5-t\$이다. 따라서 직사각형의 가로 길이는 \$\$ (5-t)-\\frac{t-3}{3} \= 5-t-\\frac{t}{3}+1 \= 6-\\frac{4}{3}t \$\$ 직사각형의 넓이 \$S(t)\$는 \$\$ \\begin{aligned} S(t) &= t\\left(6-\\frac{4}{3}t\\right) \= \-\\frac{4}{3}t^2+6t \\ &= \-\\frac{4}{3}\\left(t^2-\\frac{9}{2}t\\right) \\ &= \-\\frac{4}{3}\\left(t-\\frac{9}{4}\\right)^2+\\frac{27}{4} \\end{aligned} \$\$ \$t=\\dfrac{9}{4}\$는 \$0\<t\<\\dfrac{9}{2}\$에 포함되므로 직사각형의 넓이의 최댓값은 \$\\dfrac{27}{4}\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-1, 5], "viewport": [-2, 6, -1, 6], "pieces": [{"domain": [-1, "1/2"], "coefficients": ["3", "3"]}, {"domain": ["1/2", 5], "coefficients": ["5", "-1"]}], "requiredPoints": [{"id": "I", "x": "1/2", "y": "9/2", "label": "(1/2, 9/2)"}, {"id": "X1", "x": "-1", "y": "0", "label": "(-1, 0)"}, {"id": "X2", "x": "5", "y": "0", "label": "(5, 0)"}]}, "caption": "두 직선 y=3x+3, y=5-x와 x축으로 둘러싸인 삼각형 영역"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "직사각형의 높이 $t$를 변수로 두어 두 직선 $l_1, l_2$ 위 꼭짓점의 $x$좌표 차이로 가로 길이를 표현하고, 넓이 이차함수 $S(t)$의 최댓값을 구한다.", "decisiveStep": "가로 길이 $(5-t)-\\frac{t-3}{3}=6-\\frac{4}{3}t$를 세우고 $S(t)=-\\frac{4}{3}(t-\\frac{9}{4})^2+\\frac{27}{4}$로 완전제곱 변형한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "H1-RPM-038(DIRECT_ACTIVE): 도형 내접 직사각형의 넓이를 이차함수로 모델링하여 최댓값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 내접 직사각형의 변수를 설정해 이차함수의 최댓값 문제로 환원하는 대표 심화 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "넓이의 최댓값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "&= -\\frac{4}{3}\\left(t-\\frac{9}{4}\\right)^2+\\frac{27}{4}", "evidenceType": "IMPLIED", "justification": "이차함수를 완전제곱식으로 변형해 꼭짓점에서 최댓값을 구함"}], "given": [{"term": "직선", "src": "stem", "quote": "두 직선 $l_1:"}, {"term": "직사각형", "src": "stem", "quote": "직사각형이 있다"}], "condition": [{"term": "넓이", "src": "stem", "quote": "직사각형의 넓이의"}]}, "reasons": {"method": "높이 t로 가로 길이를 표현해 넓이 이차함수의 완전제곱식으로 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 5

### 발문

등식 \$4x+7=a(x-2)+b(x+1)\$이 \$x\$에 대한 항등식이 되도록 상수 \$a\$, \$b\$의 값을 정할 때, \$b-a\$의 값을 구하시오.

### 선지

없음

### 정답

\$6\$

### 해설

주어진 등식의 우변을 \$x\$에 대하여 내림차순으로 정리하면 \$\$ \\begin{aligned} a(x-2)+b(x+1) &= ax-2a+bx+b \\ &= (a+b)x+(-2a+b) \\end{aligned} \$\$ 양변의 계수를 비교하면 \$\$ \\begin{aligned} a+b &= 4 \\ \-2a+b &= 7 \\end{aligned} \$\$ 첫 번째 식에서 두 번째 식을 빼면 \$3a=-3\$이므로 \$a=-1\$이다. 이를 \$a+b=4\$에 대입하면 \$-1+b=4\$이므로 \$b=5\$이다. 따라서 \$b-a \= 5-(-1) \= 6\$이다.

```
{"status": "EXEMPT", "reason": "항등식의 계수비교법으로 미정계수 a, b를 구하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "항등식 $4x+7=a(x-2)+b(x+1)$의 우변을 $x$에 대해 정리한 뒤 양변의 계수를 비교해 $a, b$를 구한다.", "decisiveStep": "$a+b=4$와 $-2a+b=7$을 연립해 $a=-1, b=5$를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "H1-RPM-007(DIRECT_ACTIVE): 항등식의 미정계수를 계수비교법으로 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항등식의 미정계수를 계수비교법으로 바로 연립해 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "미정계수", "src": "solution", "quote": "계수를 비교하면"}], "method": [{"term": "계수비교", "src": "solution", "quote": "양변의 계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "stem", "quote": "항등식이 되도록"}], "condition": [{"term": "상수", "src": "stem", "quote": "상수 $a$, $b$의 값을"}]}, "reasons": {"method": "항등식의 계수비교법으로 연립방정식을 세워 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 5

### 발문

복소수 \$z=a+bi\$가 다음 조건을 만족시킬 때, \$a^2+b^2+c^2\$의 값을 구하시오. (단, \$a, b, c\$는 실수이다.) (가) \$z-1+2i\$는 음의 실수이다. (나) \$z^2=c+12i\$

### 선지

없음

### 정답

\$38\$

### 해설

조건 (가)에서 \$z-1+2i \= (a-1)+(b+2)i\$가 음의 실수이므로 허수부분은 \$0\$, 실수부분은 음수이어야 한다. \$\$ b+2=0 \\implies b=-2, \\qquad a-1\<0 \\implies a\<1 \$\$ 조건 (나)에서 \$\$ z^2 \= (a+bi)^2 \= (a^2-b^2)+2abi \= c+12i \$\$ \$a, b, c\$가 실수이므로 실수부분과 허수부분을 각각 비교하면 \$\$ a^2-b^2=c, \\qquad 2ab=12 \$\$ \$b=-2\$를 \$2ab=12\$에 대입하면 \$-4a=12\$이므로 \$a=-3\$이다. (\$a=-3\<1\$이므로 조건 (가)를 만족한다.) 따라서 \$c=(-3)^2-(-2)^2=9-4=5\$이다. 그러므로 구하는 값은 \$\$ a^2+b^2+c^2 \= (-3)^2+(-2)^2+5^2 \= 9+4+25 \= 38 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수가 음의 실수일 조건과 복소수 상등을 연립하는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "음의 실수 조건에서 $b=-2, a<1$을 얻고, $z^2=(a^2-b^2)+2abi=c+12i$의 상등 조건으로 $a=-3, c=5$를 구한다.", "decisiveStep": "$2ab=12$에 $b=-2$를 대입해 $a=-3$을 구하고 $a<1$ 조건을 확인한 뒤 $c=a^2-b^2=5$를 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "H1-RPM-026(DIRECT_ACTIVE): 복소수가 음의 실수일 조건과 복소수 상등 조건을 연립해 미지수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음의 실수 조건(허수부 0, 실수부 < 0)과 복소수 제곱의 상등 조건을 순서대로 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=a+bi$"}], "method": [{"term": "실수부분", "src": "solution", "quote": "실수부분과 허수부분을 각각 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "실수", "src": "stem", "quote": "$a, b, c$는 실수이다"}], "condition": [{"term": "허수부분", "src": "solution", "quote": "허수부분은 $0$"}]}, "reasons": {"method": "음의 실수 조건과 복소수 제곱의 실수부·허수부 비교로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

\$x\$에 대한 이차방정식 \$x^2-2kx+k^2-3k+5=0\$의 두 근의 차가 \$4\$일 때, 상수 \$k\$의 값을 구하시오.

### 선지

없음

### 정답

\$3\$

### 해설

이차방정식 \$x^2-2kx+k^2-3k+5=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 하자. 근과 계수의 관계에 의하여 \$\$ \\alpha+\\beta \= 2k, \\qquad \\alpha\\beta \= k^2-3k+5 \$\$ 두 근의 차가 \$4\$이므로 \$(\\alpha-\\beta)^2 \= 4^2 \= 16\$이다. 곱셈 공식의 변형을 이용하면 \$\$ \\begin{aligned} (\\alpha-\\beta)^2 &= (\\alpha+\\beta)^2-4\\alpha\\beta \\ &= (2k)^2-4(k^2-3k+5) \\ &= 4k^2-4k^2+12k-20 \\ &= 12k-20 \\end{aligned} \$\$ 따라서 \$12k-20=16\$이므로 \$12k=36\$, 즉 \$k=3\$이다. (확인: \$k=3\$일 때 방정식은 \$x^2-6x+5=(x-1)(x-5)=0\$으로 두 근은 \$1, 5\$이고 차는 \$4\$이다.)

```
{"status": "EXEMPT", "reason": "두 근의 차 제곱을 근과 계수의 관계로 정리해 일차방정식을 푸는 순수 대수 서술형 문항임"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계 $\\alpha+\\beta=2k$, $\\alpha\\beta=k^2-3k+5$를 구해 $(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta=16$에 대입한다.", "decisiveStep": "$4k^2-4(k^2-3k+5)=12k-20=16$에서 $k^2$ 항이 소거되어 $k=3$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "H1-RPM-029(DIRECT_BINDING_GAP): 근과 계수의 관계와 두 근의 차 제곱 대칭식을 이용해 미지수를 구하는 문항(exact binding 누락으로 BINDING_GAP)"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근의 차의 제곱 공식을 근과 계수의 관계와 결합해 미지수 $k$를 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $k$의 값을 구하시오"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2kx+k^2-3k+5=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계와 두 근의 차 제곱 공식으로 상수 k를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

\$x\$의 값의 범위가 \$a\\le x\\le 4\$일 때, 이차함수 \$y=x^2-4x+m\$의 최댓값은 \$14\$, 최솟값은 \$-2\$이다. 이때 실수 \$m\$, \$a\$에 대하여 \$m-a\$의 값을 구하시오. (단, \$a\<2\$)

### 선지

없음

### 정답

\$4\$

### 해설

주어진 이차함수를 완전제곱식으로 변형하면 \$\$ y \= x^2-4x+m \= (x-2)^2+m-4 \$\$ 포물선은 아래로 볼록하고 꼭짓점의 \$x\$좌표는 \$2\$이다. \$a\<2\$이므로 꼭짓점 \$x=2\$는 구간 \$a\\le x\\le 4\$ 안에 포함된다. 따라서 최솟값은 꼭짓점 \$x=2\$에서 \$m-4\$이므로 \$\$ m-4 \= \-2 \\implies m \= 2 \$\$ 한편 아래로 볼록한 포물선의 닫힌 구간 최댓값은 구간의 양 끝점 \$x=a\$ 또는 \$x=4\$에서 나온다. \$m=2\$일 때 오른쪽 끝점 \$x=4\$에서의 함숫값은 \$\$ y(4) \= 4^2-4\\cdot 4+2 \= 2 \$\$ 이므로 최댓값 \$14\$는 왼쪽 끝점 \$x=a\$에서 얻어진다. \$\$ \\begin{aligned} a^2-4a+2 &= 14 \\ a^2-4a-12 &= 0 \\ (a-6)(a+2) &= 0 \\end{aligned} \$\$ 조건 \$a\<2\$에 의하여 \$a=-2\$이다. 따라서 \$m-a \= 2-(-2) \= 4\$이다.

```
{"capability": "piecewise-polynomial-spike-v1", "graphPlan": {"family": "piecewise_polynomial", "domain": [-3, 5], "viewport": [-3, 5, -4, 16], "pieces": [{"domain": [-3, 5], "coefficients": ["2", "-4", "1"]}], "requiredPoints": [{"id": "V", "x": "2", "y": "-2", "label": "꼭짓점(2, -2)"}, {"id": "L", "x": "-2", "y": "14", "label": "(-2, 14)"}, {"id": "R", "x": "4", "y": "2", "label": "(4, 2)"}]}, "caption": "구간 [-2, 4]에서 이차함수 y=x^2-4x+2의 최솟값 (2, -2)와 최댓값 (-2, 14)"}
```

```
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "꼭짓점 $x=2$가 구간 $[a,4]$에 포함됨을 이용해 최솟값 $-2=m-4$에서 $m=2$를 구하고, 끝점 비교로 $y(a)=14$를 풀어 $a=-2$를 구한다.", "decisiveStep": "오른쪽 끝점 $y(4)=2<14$임을 확인해 최댓값 $14$가 $x=a$에서 나옴을 판정하고 $a^2-4a-12=0$을 푼다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "H1-RPM-037(DIRECT_ACTIVE): 구간 내 꼭짓점 위치와 양 끝점 함숫값 비교로 이차함수 미지수를 역산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간 내 꼭짓점 포함 조건으로 미지수 $m$을 결정하고 양 끝점 비교로 구간의 끝 $a$를 역산하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값은 $14$, 최솟값은 $-2$"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식으로 변형하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-4x+m$"}], "condition": [{"term": "꼭짓점", "src": "solution", "quote": "꼭짓점의 $x$좌표는 $2$"}]}, "reasons": {"method": "완전제곱식으로 꼭짓점 최솟값에서 m을 구하고 끝점 함숫값 비교로 a를 결정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

