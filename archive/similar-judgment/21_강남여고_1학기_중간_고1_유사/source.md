

```
{"stem": "21_강남여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/21_강남여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 26, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 2.5

### 발문

\$x+y=4\$, \$xy=3\$일 때, \$x^3+y^3\$의 값을 구하면?

### 선지

① \$28\$ ② \$30\$ ③ \$32\$ ④ \$36\$ ⑤ \$40\$

### 정답

①

### 해설

곱셈 공식의 변형에 의하여 \$\$ x^3+y^3 \= (x+y)^3-3xy(x+y) \= 4^3-3\\cdot 3\\cdot 4 \= 64-36 \= 28 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "곱셈 공식의 변형에 합과 곱을 대입하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "곱셈 공식의 변형 $x^3+y^3=(x+y)^3-3xy(x+y)$에 $x+y=4, xy=3$을 대입한다.", "decisiveStep": "$x^3+y^3$을 합과 곱의 식으로 변형해 주어진 값을 바로 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세제곱의 합 곱셈 공식 변형을 한 번 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "곱셈 공식의 변형에 의하여"}], "method": [{"term": "대입", "src": "solution", "quote": "4^3-3\\cdot 3\\cdot 4", "evidenceType": "IMPLIED", "justification": "세제곱의 합 변형 공식에 x+y=4, xy=3을 대입함"}], "given": [{"term": "다항식", "src": "stem", "quote": "$x^3+y^3$"}], "condition": []}, "reasons": {"method": "곱셈 공식 변형에 합과 곱을 대입해 x^3+y^3을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 2.5

### 발문

\$(x^2+x)^2-5x^2-5x+6\$을 인수분해하면?

### 선지

① \$(x-2)(x+1)(x^2+x-3)\$ ② \$(x+2)(x-1)(x^2-x-3)\$ ③ \$(x+2)(x-1)(x^2+x-3)\$ ④ \$(x+2)(x+1)(x^2+x-3)\$ ⑤ \$(x-2)(x-1)(x^2+x+3)\$

### 정답

③

### 해설

\$x^2+x=t\$로 치환하면 \$\$ \\begin{aligned} (x^2+x)^2-5(x^2+x)+6 &= t^2-5t+6 \\ &= (t-2)(t-3) \\ &= (x^2+x-2)(x^2+x-3) \\ &= (x+2)(x-1)(x^2+x-3) \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "공통부분 x^2+x를 치환해 사차식을 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "공통부분 $x^2+x=t$로 치환해 $t^2-5t+6=(t-2)(t-3)$으로 분해한 뒤 $x^2+x-2$를 더 인수분해한다.", "decisiveStep": "치환을 되돌린 후 $(x^2+x-2)$가 $(x+2)(x-1)$로 추가 인수분해됨을 끝까지 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공통부분 치환 후 이차식 인수분해를 한 번 더 수행하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하면"}], "method": [{"term": "치환", "src": "solution", "quote": "x^2+x=t$로 치환하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "solution", "quote": "(x^2+x)^2-5(x^2+x)+6"}], "condition": []}, "reasons": {"method": "x^2+x를 t로 치환해 인수분해한 뒤 x^2+x-2를 추가 분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 2.5

### 발문

\$-1 \\le x \\le 5\$에서 이차함수 \$y=x^2-4x+1\$의 최댓값과 최솟값의 합은?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

⑤

### 해설

\$y=x^2-4x+1=(x-2)^2-3\$이므로 아래로 볼록하고 축이 \$x=2\$이다. 구간 \$-1 \\le x \\le 5\$에 축 \$x=2\$가 포함되므로

- 최솟값: \$x=2\$일 때 \$-3\$  
- 최댓값: 축에서 가장 먼 \$x=-1\$ 또는 \$x=5\$일 때 \$(-1-2)^2-3=6\$ 따라서 최댓값과 최솟값의 합은 \$6+(-3)=3\$이다.

```
{"status": "EXEMPT", "reason": "이차함수를 표준형으로 고쳐 제한 범위에서의 최대·최소 합을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "완전제곱식 $y=(x-2)^2-3$으로 고쳐 축 $x=2$가 구간 $[-1, 5]$ 안에 있음을 확인하고 최솟값 $-3$과 최댓값 $6$을 구한다.", "decisiveStep": "꼭짓점 $x=2$가 구간 내부에 있고 양 끝점 $-1, 5$가 대칭임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 구간에 꼭짓점이 포함된 이차함수의 최대·최소를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값의 합"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-4x+1$", "evidenceType": "IMPLIED", "justification": "표준형 변환으로 꼭짓점 x=2와 양 끝점 함숫값을 비교함"}], "given": [{"term": "축", "src": "solution", "quote": "축이 $x=2$이다"}], "condition": []}, "reasons": {"method": "표준형 변환 후 꼭짓점과 양 끝점 함숫값으로 최대·최소의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 2.5

### 발문

삼차방정식 \$x^3=1\$의 한 허근을 \$\\omega\$라 할 때, \$\\omega+\\omega^2+\\omega^3+\\omega^4+\\omega^5+\\omega^6+\\omega^7\$의 값은?

### 선지

① \$0\$ ② \$\\omega\$ ③ \$1\$ ④ \$-\\omega\$ ⑤ \$\\omega^2\$

### 정답

②

### 해설

\$x^3-1=(x-1)(x^2+x+1)=0\$의 한 허근이 \$\\omega\$이므로 \$\\omega^3=1\$, \$\\omega^2+\\omega+1=0\$이다. 따라서 \$\$ \\begin{aligned} \\omega+\\omega^2+\\omega^3+\\omega^4+\\omega^5+\\omega^6+\\omega^7 &= (\\omega+\\omega^2+1)+\\omega^3(\\omega+\\omega^2+1)+\\omega^6\\cdot\\omega \\ &= 0+0+1\\cdot\\omega \= \\omega \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "x^3=1의 허근 ω의 성질 ω^3=1, ω^2+ω+1=0으로 거듭제곱 합을 간단히 하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$\\omega^3=1$과 $\\omega^2+\\omega+1=0$을 이용해 연속한 $3$개 항씩 묶어 $0$으로 소거하고 남은 $\\omega^7=\\omega$를 구한다.", "decisiveStep": "$3$개씩 묶은 두 묶음이 모두 $0$이 되어 $\\omega^7=\\omega$만 남는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차방정식 $x^3=1$의 허근 $\\omega$의 주기성과 합 성질을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "한 허근을 $\\omega$라 할 때"}], "method": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3=1$", "evidenceType": "IMPLIED", "justification": "ω^3=1과 ω^2+ω+1=0을 이용해 3항씩 0으로 묶어 소거함"}], "given": [{"term": "인수분해", "src": "solution", "quote": "x^3-1=(x-1)(x^2+x+1)=0"}], "condition": []}, "reasons": {"method": "ω^3=1과 ω^2+ω+1=0으로 3항씩 묶어 소거해 ω를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3

### 발문

세 다항식 \$A=3x^2-2xy+y^2\$, \$B=-x^2+xy+2y^2\$, \$C=2x^2-7xy\$에 대하여 \$(A-B)+(A+C)\$를 계산하면?

### 선지

① \$9x^2-12xy+4y^2\$ ② \$7x^2-12xy\$ ③ \$9x^2-10xy\$ ④ \$9x^2-12xy\$ ⑤ \$9x^2+12xy\$

### 정답

④

### 해설

식을 먼저 정리하면 \$(A-B)+(A+C)=2A-B+C\$이므로 \$\$ \\begin{aligned} 2A-B+C &= 2(3x^2-2xy+y^2)-(-x^2+xy+2y^2)+(2x^2-7xy) \\ &= (6+1+2)x^2+(-4-1-7)xy+(2-2)y^2 \\ &= 9x^2-12xy \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "세 다항식의 덧셈과 뺄셈 식을 2A-B+C로 정리해 동류항을 계산하는 순수 연산 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$(A-B)+(A+C)=2A-B+C$로 간단히 한 뒤 $A, B, C$를 대입하여 동류항 계수를 합산한다.", "decisiveStep": "$y^2$항의 계수가 $2-2=0$으로 소거됨을 정확히 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 다항식의 일차 결합을 정리하고 동류항을 모으는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "세 다항식 $A=3x^2-2xy+y^2$"}], "method": [{"term": "동류항", "src": "solution", "quote": "2A-B+C", "evidenceType": "IMPLIED", "justification": "식을 2A-B+C로 정리한 뒤 x^2, xy, y^2 동류항끼리 계수를 합산함"}], "given": [{"term": "다항식", "src": "stem", "quote": "세 다항식 $A=3x^2-2xy+y^2$"}], "condition": []}, "reasons": {"method": "2A-B+C로 정리 후 각 차수별 동류항 계수를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3

### 발문

다항식 \$f(x)=3x^3-2x^2+5x-4\$를 \$x-2\$로 나눈 나머지를 구하면?

### 선지

① \$22\$ ② \$18\$ ③ \$20\$ ④ \$24\$ ⑤ \$26\$

### 정답

①

### 해설

나머지정리에 의하여 \$f(x)\$를 \$x-2\$로 나눈 나머지는 \$\$ f(2) \= 3\\cdot 2^3-2\\cdot 2^2+5\\cdot 2-4 \= 24-8+10-4 \= 22 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "일차식 x-2로 나눈 나머지를 나머지정리 f(2)로 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리에 따라 $f(x)$에 $x=2$를 대입해 $f(2)=22$를 계산한다.", "decisiveStep": "일차식 $x-2$로 나눈 나머지가 $f(2)$와 같음을 바로 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-009 (RPM_ONLY) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리를 직접 적용해 수치를 대입하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지를 구하면"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)=3x^3-2x^2+5x-4$"}], "condition": []}, "reasons": {"method": "나머지정리에 의해 x=2를 대입하여 나머지 22를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q07

- 형식: 객관식  
- 배점: 3

### 발문

두 복소수 \$\\alpha, \\beta\$가 \$\\alpha=2+i\$, \$\\beta=1-2i\$일 때, \$\\alpha\\cdot\\beta^2+\\overline{\\alpha}\\cdot\\overline{\\beta}^2\$의 값을 구하면?

### 선지

① \$-8\$ ② \$-6\$ ③ \$-4\$ ④ \$4\$ ⑤ \$8\$

### 정답

③

### 해설

\$\\beta^2 \= (1-2i)^2 \= 1-4i-4 \= \-3-4i\$이므로 \$\$ \\alpha\\beta^2 \= (2+i)(-3-4i) \= \-6-8i-3i+4 \= \-2-11i \$\$ 켤레복소수의 성질에 의하여 \$\\overline{\\alpha}\\cdot\\overline{\\beta}^2 \= \\overline{\\alpha\\beta^2} \= \-2+11i\$이므로 \$\$ \\alpha\\beta^2+\\overline{\\alpha}\\cdot\\overline{\\beta}^2 \= (-2-11i)+(-2+11i) \= \-4 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수 곱 αβ^2을 계산하고 켤레복소수 성질로 αβ^2 + bar(αβ^2)을 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha\\beta^2=-2-11i$를 먼저 계산한 뒤 $\\overline{\\alpha}\\cdot\\overline{\\beta}^2=\\overline{\\alpha\\beta^2}$ 성질로 실수부분의 $2$배인 $-4$를 구한다.", "decisiveStep": "$\\overline{\\alpha}\\cdot\\overline{\\beta}^2$를 따로 전개하지 않고 $\\overline{\\alpha\\beta^2}$로 묶어 합을 $2\\operatorname{Re}(\\alpha\\beta^2)$로 처리한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 곱셈과 켤레복소수 분배 성질을 결합해 계산량을 줄이는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "두 복소수 $\\alpha, \\beta$"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수의 성질에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "실수부분", "src": "solution", "quote": "-2-11i"}], "condition": []}, "reasons": {"method": "αβ^2 계산 후 켤레복소수 성질로 실수부분의 2배를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3

### 발문

이차함수 \$y=x^2\$의 그래프와 일차함수 \$y=6x+7\$의 그래프는 두 점 \$(a, b)\$, \$(c, d)\$에서 만난다. 이때 \$a+c\$의 값을 구하면?

### 선지

① \$-6\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

두 그래프의 교점의 \$x\$좌표 \$a, c\$는 이차방정식 \$\$ x^2 \= 6x+7 \\iff x^2-6x-7 \= 0 \$\$ 의 두 실근이다. 근과 계수의 관계에 의하여 \$a+c=6\$이다.

```
{"status": "EXEMPT", "reason": "포물선과 직선의 교점 x좌표 합을 연립방정식 근과 계수의 관계로 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 식을 연립한 이차방정식 $x^2-6x-7=0$의 두 근이 $a, c$임을 이용해 근과 계수의 관계로 $a+c=6$을 구한다.", "decisiveStep": "교점을 직접 구하지 않고도 연립방정식 $x^2-6x-7=0$의 두 근의 합이 $6$임을 읽는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 교점 $x$좌표를 이차방정식의 근과 계수의 관계로 연결하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "교점", "src": "solution", "quote": "두 그래프의 교점의 $x$좌표"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2$"}], "condition": []}, "reasons": {"method": "연립이차방정식에 근과 계수의 관계를 적용해 x좌표 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 3.5

### 발문

이차함수 \$y=-4x^2+4x+k\$의 그래프와 \$x\$축이 서로 다른 두 점에서 만날 때, 실수 \$k\$의 값의 범위는?

### 선지

① \$k \< \-1\$ ② \$k \> \-1\$ ③ \$k \\ge \-1\$ ④ \$k \> 1\$ ⑤ \$k \< 1\$

### 정답

②

### 해설

이차방정식 \$-4x^2+4x+k=0\$이 서로 다른 두 실근을 가져야 하므로 판별식 \$D\>0\$이다. \$\$ \\frac{D}{4} \= 2^2-(-4)k \= 4+4k \> 0 \\implies k \> \-1 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차함수와 x축이 서로 다른 두 점에서 만날 조건을 판별식 D>0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$-4x^2+4x+k=0$의 판별식 $D/4=4+4k>0$을 풀어 $k>-1$을 얻는다.", "decisiveStep": "'서로 다른 두 점' 조건에 따라 등호 없는 $D>0$을 정확히 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-034 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 $x$축의 위치 관계에서 서로 다른 두 점 조건 $D>0$을 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값의 범위"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-4x^2+4x+k$"}], "condition": []}, "reasons": {"method": "서로 다른 두 점 조건에 판별식 D/4>0을 적용해 k 범위를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 3.5

### 발문

다항식 \$f(x)\$를 \$x^2-4x\$로 나눈 나머지가 \$2x+3\$일 때, 다항식 \$f(x)\$를 \$x-4\$로 나눈 나머지는?

### 선지

① \$3\$ ② \$7\$ ③ \$9\$ ④ \$11\$ ⑤ \$13\$

### 정답

④

### 해설

나눗셈 항등식을 세우면 \$\$ f(x) \= x(x-4)Q(x)+2x+3 \$\$ 나머지정리에 의하여 \$f(x)\$를 \$x-4\$로 나눈 나머지는 \$f(4)\$이므로 \$\$ f(4) \= 0 \+ 2\\cdot 4+3 \= 11 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차식 x(x-4) 나눗셈 항등식에 x=4를 대입해 일차식 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$f(x)=x(x-4)Q(x)+2x+3$에 $x=4$를 대입해 $f(4)=11$을 구한다.", "decisiveStep": "제수 $x^2-4x=x(x-4)$가 인수 $x-4$를 포함하므로 $f(4)$가 곧바로 $2(4)+3$이 됨을 본다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": null, "why": "high1.json H1-RPM-010 (FAMILY_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차식 나눗셈 항등식에서 인수 중 하나로 나눈 나머지를 수치대입으로 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "$x-4$로 나눈 나머지는"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "x^2-4x=x(x-4) 나눗셈 항등식에 x=4를 대입해 나머지를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 3.5

### 발문

\$\\left(\\dfrac{1+i}{1-i}\\right)^{2022}+\\left(\\dfrac{1-i}{1+i}\\right)^{2023}\$의 값은? (단, \$i=\\sqrt{-1}\$)

### 선지

① \$-1+i\$ ② \$-1-i\$ ③ \$1+i\$ ④ \$1-i\$ ⑤ \$0\$

### 정답

①

### 해설

분모를 실수화하면 \$\$ \\frac{1+i}{1-i} \= \\frac{(1+i)^2}{(1-i)(1+i)} \= \\frac{2i}{2} \= i, \\qquad \\frac{1-i}{1+i} \= \-i \$\$ \$i^4=1\$이므로 \$2022=4\\times 505+2\$, \$2023=4\\times 505+3\$에서 \$\$ i^{2022}+(-i)^{2023} \= i^2+(-i)^3 \= \-1+i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "(1±i)/(1∓i)를 ±i로 단순화한 뒤 i^4=1 주기성으로 고차 거듭제곱 합을 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모 실수화로 $\\frac{1+i}{1-i}=i$, $\\frac{1-i}{1+i}=-i$를 얻고 $i^4=1$ 주기성을 적용해 $-1+i$를 구한다.", "decisiveStep": "$2022\\equiv 2, 2023\\equiv 3 \\pmod 4$와 $(-i)^3=i$의 부호를 정확히 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 분수식의 실수화와 $i$의 $4$주기 거듭제곱을 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "solution", "quote": "i^{2022}+(-i)^{2023}"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모를 실수화하면", "evidenceType": "IMPLIED", "justification": "분모의 켤레복소수를 곱해 ±i로 정리한 뒤 4주기 성질을 적용함"}], "given": [{"term": "허수", "src": "stem", "quote": "i=\\sqrt{-1}"}], "condition": []}, "reasons": {"method": "분모 실수화로 ±i를 얻고 i의 4주기로 거듭제곱 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 3.5

### 발문

이차방정식 \$x^2-4x+1=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\dfrac{\\beta}{\\alpha}+\\dfrac{\\alpha}{\\beta}\$의 값은?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

③

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=4\$, \$\\alpha\\beta=1\$이므로 \$\$ \\frac{\\beta}{\\alpha}+\\frac{\\alpha}{\\beta} \= \\frac{\\alpha^2+\\beta^2}{\\alpha\\beta} \= \\frac{(\\alpha+\\beta)^2-2\\alpha\\beta}{\\alpha\\beta} \= \\frac{4^2-2\\cdot 1}{1} \= 14 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계로 합과 곱을 구해 통분 대칭식 값을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계 $\\alpha+\\beta=4, \\alpha\\beta=1$을 통분식 $\\frac{(\\alpha+\\beta)^2-2\\alpha\\beta}{\\alpha\\beta}$에 대입한다.", "decisiveStep": "분모 $\\alpha\\beta=1$과 분자 $\\alpha^2+\\beta^2=16-2$를 바로 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029 (DIRECT_BINDING_GAP) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계와 대칭식 변형을 직접 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "\\frac{\\alpha^2+\\beta^2}{\\alpha\\beta}"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-4x+1=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 합과 곱을 구해 통분식 값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$3x^3-x^2-10x+15\$를 \$x+2\$로 나누었을 때의 몫과 나머지를 차례로 나열한 것은?

### 선지

① \$3x^2-7x+4,; 5\$ ② \$3x^2+7x+4,; 7\$ ③ \$3x^2-7x-4,; 7\$ ④ \$3x^2+5x+4,; 7\$ ⑤ \$3x^2-7x+4,; 7\$

### 정답

⑤

### 해설

\$x=-2\$로 조립제법을 적용하면

- \$x^2\$항 계수: \$3\$  
- \$x\$항 계수: \$-1 \+ 3(-2) \= \-7\$  
- 상수항: \$-10 \+ (-7)(-2) \= 4\$  
- 나머지: \$15 \+ 4(-2) \= 7\$ 따라서 몫은 \$3x^2-7x+4\$, 나머지는 \$7\$이다.

```
{"status": "EXEMPT", "reason": "삼차다항식을 일차식 x+2로 나눈 몫과 나머지를 조립제법으로 구하는 순수 연산 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "$x=-2$를 조립제법의 수로 삼아 삼차식 $3x^3-x^2-10x+15$의 몫 $3x^2-7x+4$와 나머지 $7$을 구한다.", "decisiveStep": "조립제법에서 $x+2=0$인 $x=-2$를 부호 반전해 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "몫과 나머지"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json H1-RPM-006 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식으로 나눈 몫과 나머지를 조립제법으로 구하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫과 나머지를 차례로"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "조립제법을 적용하면", "evidenceType": "IMPLIED", "justification": "x=-2로 조립제법을 수행하여 몫과 나머지를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $3x^3-x^2-10x+15$"}], "condition": []}, "reasons": {"method": "x=-2 조립제법으로 몫과 나머지를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$(x-1)(x+3)(x-3)(x+5)+35\$를 인수분해하였더니 \$(x+a)(x+b)(x^2+2x+c)\$가 되었다. 이때 정수 \$a, b, c\$에 대하여 \$a+b+c\$의 값은?

### 선지

① \$-10\$ ② \$-8\$ ③ \$-6\$ ④ \$-4\$ ⑤ \$-2\$

### 정답

②

### 해설

일차항의 계수가 같도록 두 개씩 짝지어 전개하면 \$\$ {(x-1)(x+3)}{(x-3)(x+5)}+35 \= (x^2+2x-3)(x^2+2x-15)+35 \$\$ \$x^2+2x=t\$로 치환하면 \$\$ \\begin{aligned} (t-3)(t-15)+35 &= t^2-18t+80 \\ &= (t-8)(t-10) \\ &= (x^2+2x-8)(x^2+2x-10) \\ &= (x+4)(x-2)(x^2+2x-10) \\end{aligned} \$\$ 따라서 \$a+b=4+(-2)=2\$, \$c=-10\$이므로 \$a+b+c=-8\$이다.

```
{"status": "EXEMPT", "reason": "네 일차식의 곱을 공통부분 x^2+2x가 나오도록 짝지어 치환 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "상수항의 합이 $2$로 같아지도록 $(x-1)(x+3)$과 $(x-3)(x+5)$로 짝지어 $x^2+2x=t$로 치환 인수분해한다.", "decisiveStep": "$(t-3)(t-15)+35=t^2-18t+80=(t-8)(t-10)$으로 분해한 뒤 $x^2+2x-8$을 일차식으로 마저 인수분해한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "네 일차식의 곱+상수 꼴에서 상수항 합이 같은 쌍을 묶어 치환 인수분해하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하였더니"}], "method": [{"term": "치환", "src": "solution", "quote": "x^2+2x=t$로 치환하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $(x-1)(x+3)(x-3)(x+5)+35$"}], "condition": []}, "reasons": {"method": "상수항 합이 같은 쌍을 짝지어 x^2+2x를 치환해 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차방정식 \$x^2-(2k-3)x+k^2-4=0\$이 허근을 갖도록 하는 자연수 \$k\$의 최솟값을 구하면?

### 선지

① \$1\$ ② \$2\$ ③ \$4\$ ④ \$3\$ ⑤ \$5\$

### 정답

④

### 해설

허근을 가지려면 판별식 \$D\<0\$이어야 하므로 \$\$ D \= (2k-3)^2-4(k^2-4) \= 4k^2-12k+9-4k^2+16 \= \-12k+25 \< 0 \$\$ 따라서 \$k \> \\dfrac{25}{12}=2.08\\cdots\$이므로 자연수 \$k\$의 최솟값은 \$3\$이다.

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "판별식 $D=(2k-3)^2-4(k^2-4)=-12k+25<0$을 풀어 $k>\\frac{25}{12}$를 만족하는 최소 자연수를 구한다.", "decisiveStep": "전개 시 $4k^2$이 소거되어 일차부등식 $-12k+25<0$이 됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허근 판별식 부등식에서 이차항이 소거된 뒤 자연수 최솟값을 찾는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "자연수 $k$의 최솟값을"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$이어야", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-(2k-3)x+k^2-4=0$"}], "condition": [{"term": "허근", "src": "stem", "quote": "허근을 갖도록"}]}, "reasons": {"method": "허근 조건 판별식 D<0으로 k>25/12를 구해 최소 자연수 3을 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

길이가 \$60\\text{m}\$인 철망을 이용하여 그림과 같이 벽면을 빗변으로 하는 직각삼각형 모양의 꽃밭을 만들려고 한다. 꽃밭의 넓이의 최댓값을 구하면?

### 선지

① \$450\\text{m}^2\$ ② \$400\\text{m}^2\$ ③ \$500\\text{m}^2\$ ④ \$600\\text{m}^2\$ ⑤ \$900\\text{m}^2\$

### 정답

①

### 해설

직각을 낀 두 변의 길이를 \$x\\text{m}\$, \$y\\text{m}\$ (\$x\>0, y\>0\$)라 하면 철망의 길이 조건에서 \$x+y=60\$, 즉 \$y=60-x\$ (\$0\<x\<60\$)이다. 꽃밭의 넓이 \$S\$는 \$\$ S \= \\frac{1}{2}xy \= \\frac{1}{2}x(60-x) \= \-\\frac{1}{2}(x-30)^2+450 \$\$ 따라서 \$x=30\$일 때 넓이의 최댓값은 \$450\\text{m}^2\$이다.

```
{"capability": "construction-spike-v1", "mode": "PLANE_FIGURE_v1", "caption": "벽면 AB를 빗변으로 하고 직각을 낀 두 변 AC, BC에 길이 합 60m인 철망을 두른 직각삼각형 꽃밭", "mathPlan": {"nodes": [{"id": "C", "kind": "SOURCE_POINT", "x": 0, "y": 0, "label": "C"}, {"id": "A", "kind": "SOURCE_POINT", "x": 0, "y": 3, "label": "A"}, {"id": "B", "kind": "SOURCE_POINT", "x": 3, "y": 0, "label": "B"}], "segments": [{"from": "A", "to": "B", "label": "벽면", "style": "thick"}, {"from": "A", "to": "C", "label": "x"}, {"from": "C", "to": "B", "label": "y"}]}}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "직각을 낀 두 변을 $x, 60-x$로 두고 넓이 $S=\\frac{1}{2}x(60-x)$의 이차함수 최댓값을 구한다.", "decisiveStep": "벽면이 빗변이므로 철망 길이 $60$이 두 변의 합 $x+y$임을 도형에서 파악한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 활용에서 둘레 조건을 일차식으로 세워 이차함수 최댓값을 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "넓이의 최댓값을"}], "method": [{"term": "이차함수", "src": "solution", "quote": "-\\frac{1}{2}(x-30)^2+450", "evidenceType": "IMPLIED", "justification": "두 변의 길이 합 x+y=60으로 넓이를 x의 이차함수로 나타내 최댓값을 구함"}], "given": [{"term": "직각삼각형", "src": "stem", "quote": "직각삼각형 모양의 꽃밭"}], "condition": []}, "reasons": {"method": "철망 길이 x+y=60으로 넓이 이차함수를 세워 최댓값 450을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.5

### 발문

두 다항식 \$f(x), g(x)\$에 대하여 \$f(x)+g(x)\$는 \$x+1\$로 나누어떨어지고, \$f(x)-g(x)\$를 \$x+1\$로 나누었을 때의 나머지가 \$4\$이다. 다음 \<보기\>의 다항식 중 \$x+1\$로 나누어떨어지는 것만을 고르시오. \<보기\> ㄱ. \$2x+f(x)\$ ㄴ. \$f(x)-xg(x)\$ ㄷ. \$4x^2+f(x)g(x)\$ ㄹ. \$f(x)+2xg(x)\$

### 선지

① ㄱ, ㄴ ② ㄱ, ㄷ ③ ㄷ, ㄹ ④ ㄱ, ㄴ, ㄷ ⑤ ㄴ, ㄷ, ㄹ

### 정답

④

### 해설

나머지정리에 의하여 \$f(-1)+g(-1)=0\$, \$f(-1)-g(-1)=4\$이다. 두 식을 연립하면 \$f(-1)=2\$, \$g(-1)=-2\$이다. 각 보기의 다항식에 \$x=-1\$을 대입하면

- ㄱ. \$2(-1)+f(-1) \= \-2+2 \= 0\$ (나누어떨어짐)  
- ㄴ. \$f(-1)-(-1)g(-1) \= 2+(-2) \= 0\$ (나누어떨어짐)  
- ㄷ. \$4(-1)^2+f(-1)g(-1) \= 4+2(-2) \= 0\$ (나누어떨어짐)  
- ㄹ. \$f(-1)+2(-1)g(-1) \= 2-2(-2) \= 6 \\ne 0\$ (나누어떨어지지 않음) 따라서 \$x+1\$로 나누어떨어지는 것은 ㄱ, ㄴ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "나머지정리로 f(-1), g(-1) 값을 구한 뒤 네 보기에 x=-1을 대입해 0 여부를 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "조건에서 $f(-1)=2, g(-1)=-2$를 연립해 구한 뒤 네 보기에 $x=-1$을 대입하여 값이 $0$인 것을 고른다.", "decisiveStep": "합과 차의 나머지 조건으로 $f(-1), g(-1)$의 값을 먼저 확정한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": null, "why": "high1.json H1-RPM-010 (FAMILY_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 다항식의 합·차 나머지 조건을 연립해 합성식의 인수 여부를 판별하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "<보기>의 다항식 중"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "나머지", "src": "stem", "quote": "나머지가 $4$이다"}], "condition": []}, "reasons": {"method": "나머지정리로 f(-1)=2, g(-1)=-2를 구해 각 보기의 x=-1 대입값을 확인함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.5

### 발문

최고차항의 계수가 \$1\$인 두 이차식 \$f(x), g(x)\$에 대하여 \$(x+2)f(x)=(x-3)g(x)\$가 항상 성립한다. \$f(-2)=10\$일 때, \$g(4)\$의 값은?

### 선지

① \$12\$ ② \$18\$ ③ \$24\$ ④ \$30\$ ⑤ \$-24\$

### 정답

③

### 해설

항등식 \$(x+2)f(x)=(x-3)g(x)\$에 \$x=3\$을 대입하면 \$5f(3)=0 \\implies f(3)=0\$이고, \$x=-2\$를 대입하면 \$0=-5g(-2) \\implies g(-2)=0\$이다. 최고차항의 계수가 \$1\$인 두 이차식이므로 \$\$ f(x)=(x-3)(x-k), \\qquad g(x)=(x+2)(x-k) \$\$ 라 놓을 수 있다. (항등식에 대입해 나머지 일차인수가 같음을 확인) \$f(-2)=(-5)(-2-k)=10\$에서 \$-2-k=-2 \\implies k=0\$이다. 따라서 \$g(x)=x(x+2)\$이므로 \$g(4)=4\\cdot 6=24\$이다.

```
{"status": "EXEMPT", "reason": "다항식 항등식 (x+2)f(x)=(x-3)g(x)에서 두 이차식의 공통 인수를 파악해 g(4)를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x=3$과 $x=-2$를 대입해 $f(3)=0, g(-2)=0$을 구하고 공통 일차인수 $(x-k)$를 두어 $f(-2)=10$으로 $k=0$을 결정한다.", "decisiveStep": "양변 비교로 $f(x)=(x-3)(x-k), g(x)=(x+2)(x-k)$가 같은 $(x-k)$를 공유함을 파악한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012 (RPM_ONLY) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 항등식에서 인수정리와 공통인수 구조를 추론해 미정계수를 구하는 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차식", "src": "stem", "quote": "두 이차식 $f(x), g(x)$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "f(3)=0$이고, $x=-2$를 대입하면", "evidenceType": "IMPLIED", "justification": "항등식에 x=3, -2를 대입해 인수를 찾고 나머지 공통인수 (x-k)를 비교 결정함"}], "given": [{"term": "항등식", "src": "solution", "quote": "항등식 $(x+2)f(x)=(x-3)g(x)$"}], "condition": []}, "reasons": {"method": "항등식 수치대입으로 인수를 찾고 공통인수 x-k를 결정해 g(4)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q19

- 형식: 객관식  
- 배점: 4.5

### 발문

\$0\$이 아닌 세 실수 \$p, q, r\$에 대하여 이차방정식 \$x^2+px+q=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$x^2+rx+p=0\$은 두 근 \$2\\alpha, 2\\beta\$를 갖는다. 이때 \$\\dfrac{r}{q}\$의 값은?

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$16\$ ⑤ \$8\$

### 정답

⑤

### 해설

두 이차방정식에 근과 계수의 관계를 각각 적용하면 \$\$ \\alpha+\\beta=-p, \\qquad \\alpha\\beta=q \$\$ \$\$ 2\\alpha+2\\beta=-r, \\qquad (2\\alpha)(2\\beta)=p \$\$ 따라서 \$2(-p)=-r \\implies r=2p\$이고, \$4q=p\$이다. 그러므로 \$r=2(4q)=8q\$이므로 \$\\dfrac{r}{q}=8\$이다.

```
{"status": "EXEMPT", "reason": "두 이차방정식의 근과 계수의 관계를 연립해 계수 비 r/q를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 방정식에 근과 계수의 관계를 적용해 $r=2p$와 $p=4q$를 얻고 $\\frac{r}{q}=8$을 계산한다.", "decisiveStep": "두 근이 $2\\alpha, 2\\beta$일 때 합은 $2$배, 곱은 $4$배가 됨을 이용해 $p, q, r$을 한 문자로 통일한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030 (DIRECT_BINDING_GAP) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차방정식의 근의 실수배 관계를 근과 계수의 관계로 연립하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "근과 계수의 관계를 각각 적용하면"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계를 각각 적용하면", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+px+q=0$"}], "condition": []}, "reasons": {"method": "두 이차방정식의 근과 계수의 관계를 연립해 r/q=8을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q20

- 형식: 객관식  
- 배점: 4.5

### 발문

세 실수 \$a, b, c\$에 대하여 한 근이 \$1+\\sqrt{3}i\$인 삼차방정식 \$x^3+ax^2+bx+c=0\$과 이차방정식 \$x^2+ax+6=0\$이 공통인 근 \$m\$을 가질 때, \$m\$의 값은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$6\$ ⑤ \$8\$

### 정답

②

### 해설

계수 \$a, b, c\$가 모두 실수이므로 삼차방정식 \$x^3+ax^2+bx+c=0\$은 \$1+\\sqrt{3}i\$와 그 켤레복소수 \$1-\\sqrt{3}i\$를 근으로 가진다. 만약 공통근 \$m\$이 \$1\\pm\\sqrt{3}i\$라면 실계수 이차방정식 \$x^2+ax+6=0\$의 두 근이 \$1\\pm\\sqrt{3}i\$이어야 하지만, 두 근의 곱이 \$(1+\\sqrt{3}i)(1-\\sqrt{3}i)=4\\ne 6\$이므로 모순이다. 따라서 \$m\$은 삼차방정식의 실근이다. 근과 계수의 관계에 의하여 삼차방정식의 세 근의 합은 \$\$ (1+\\sqrt{3}i)+(1-\\sqrt{3}i)+m \= \-a \\implies a \= \-(m+2) \$\$ \$m\$이 \$x^2+ax+6=0\$의 근이므로 \$m^2+am+6=0\$에 \$a=-(m+2)\$를 대입하면 \$\$ m^2-(m+2)m+6 \= \-2m+6 \= 0 \\implies m=3 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "실계수 삼차방정식의 켤레근 성질과 이차방정식 공통근 조건을 결합해 실근 m을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "실계수 삼차방정식의 켤레근 $1\\pm\\sqrt{3}i$ 곱이 $4\\ne 6$이므로 공통근 $m$이 실근임을 밝히고 세 근의 합 $2+m=-a$를 이차방정식에 대입한다.", "decisiveStep": "공통근 $m$이 허근 $1\\pm\\sqrt{3}i$일 수 없음을 상수항 $4\\ne 6$으로 배제한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043 (RPM_ONLY) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실계수 방정식의 켤레근, 공통근 경우 배제, 근과 계수의 관계를 결합한 중고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "공통근", "src": "solution", "quote": "공통근 $m$이"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수 $1-\\sqrt{3}i$를 근으로", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3+ax^2+bx+c=0$"}], "condition": []}, "reasons": {"method": "삼차방정식 켤레근과 상수항 비교로 실근 m을 확정해 대입함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q21

- 형식: 객관식  
- 배점: 5

### 발문

그림과 같이 점 \$O\$를 중심으로 하는 반원에 내접하는 직사각형 \$ABCD\$가 다음 조건을 만족시킨다. (가) \$\\overline{OC}+\\overline{CD}=x+y+6\$ (나) \$\\overline{DA}+\\overline{AB}+\\overline{BO}=3x+y+12\$

직사각형 \$ABCD\$의 넓이를 \$x, y\$의 식으로 나타내면?

### 선지

① \$(x+3)(y+3)\$ ② \$2(x-3)(y+3)\$ ③ \$2(x+3)(y-3)\$ ④ \$2(x+3)(y+3)\$ ⑤ \$2(x+2)(y+3)\$

### 정답

④

### 해설

\$\\overline{OC}=\\overline{BO}=p\$, \$\\overline{CD}=\\overline{AB}=q\$라 하면 반원 대칭성에 의해 \$\\overline{DA}=2p\$이다. 조건 (가), (나)에 대입하면 \$\$ p+q \= x+y+6, \\qquad 3p+q \= 3x+y+12 \$\$ 두 식을 빼면 \$2p=2x+6 \\implies p=x+3\$, 이를 첫 식에 대입하면 \$q=y+3\$이다. 따라서 직사각형 \$ABCD\$의 넓이는 \$\\overline{DA}\\cdot\\overline{AB}=2pq=2(x+3)(y+3)\$이다.

```
{"capability": "construction-spike-v1", "mode": "PLANE_FIGURE_v1", "caption": "중심 O인 반원에 내접하는 직사각형 ABCD (A, D는 반원 호 위, B, C는 지름 위)", "mathPlan": {"nodes": [{"id": "O", "kind": "SOURCE_POINT", "x": 0, "y": 0, "label": "O"}, {"id": "B", "kind": "SOURCE_POINT", "x": -2, "y": 0, "label": "B"}, {"id": "C", "kind": "SOURCE_POINT", "x": 2, "y": 0, "label": "C"}, {"id": "A", "kind": "SOURCE_POINT", "x": -2, "y": 2, "label": "A"}, {"id": "D", "kind": "SOURCE_POINT", "x": 2, "y": 2, "label": "D"}], "segments": [{"from": "A", "to": "B"}, {"from": "B", "to": "C"}, {"from": "C", "to": "D"}, {"from": "D", "to": "A"}]}}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "반원의 대칭성으로 $\\overline{OC}=\\overline{BO}=p, \\overline{DA}=2p, \\overline{CD}=q$라 두고 (가),(나)를 연립해 $p, q$를 $x, y$로 나타낸다.", "decisiveStep": "직사각형이 반원 중심 $O$에 대칭이므로 $\\overline{DA}=2\\overline{OC}$임을 도형에서 읽어 미지수를 $2$개로 줄인다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-002 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "도형 대칭성을 이용해 선분 길이를 연립방정식으로 풀고 다항식 넓이로 나타내는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "넓이", "src": "stem", "quote": "직사각형 $ABCD$의 넓이"}], "method": [{"term": "연립방정식", "src": "solution", "quote": "두 식을 빼면 $2p=2x+6", "evidenceType": "IMPLIED", "justification": "반원 대칭성으로 미지수 p, q를 잡아 조건 (가), (나)를 연립해 넓이 2pq를 구함"}], "given": [{"term": "직사각형", "src": "stem", "quote": "내접하는 직사각형 $ABCD$"}], "condition": []}, "reasons": {"method": "반원 대칭성으로 변 길이를 p, q로 두고 두 조건을 연립해 넓이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 객관식  
- 배점: 5

### 발문

두 다항식 \$P(x), Q(x)\$에 대하여 \$P(x)=x^2+2ax+(a-2)^2\$, \$Q(x)=x^2+2(a+2)x+a^2\$일 때, 항상 옳은 것만을 \<보기\>에서 모두 고르면? \<보기\> ㄱ. \$P(x)=0\$이 실근을 가지면 \$Q(x)=0\$도 실근을 갖는다. ㄴ. \$P(x)=0\$이 중근을 가지면 \$Q(x)=0\$은 서로 다른 두 실근을 갖는다. ㄷ. \$P(x)=0\$이 서로 다른 두 허근을 가지면 \$Q(x)=0\$도 서로 다른 두 허근을 갖는다.

### 선지

① ㄱ, ㄴ ② ㄴ, ㄷ ③ ㄱ, ㄷ ④ ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

①

### 해설

\$P(x)=0\$과 \$Q(x)=0\$의 판별식을 각각 \$D\_P, D\_Q\$라 하면 \$\$ \\frac{D\_P}{4} \= a^2-(a-2)^2 \= 4a-4, \\qquad \\frac{D\_Q}{4} \= (a+2)^2-a^2 \= 4a+4 \$\$ 따라서 항상 \$\\dfrac{D\_Q}{4} \= \\dfrac{D\_P}{4}+8 \> \\dfrac{D\_P}{4}\$이다.

- ㄱ. \$D\_P\\ge 0\$이면 \$D\_Q\>0\$이므로 \$Q(x)=0\$도 서로 다른 두 실근을 갖는다. (참)  
- ㄴ. \$D\_P=0\$이면 \$\\dfrac{D\_Q}{4}=8\>0\$이므로 \$Q(x)=0\$은 서로 다른 두 실근을 갖는다. (참)  
- ㄷ. \$D\_P\<0\$일 때 예를 들어 \$a=0\$이면 \$\\dfrac{D\_P}{4}=-4\<0\$이지만 \$\\dfrac{D\_Q}{4}=4\>0\$이므로 \$Q(x)=0\$은 실근을 갖는다. (거짓) 따라서 항상 옳은 것은 ㄱ, ㄴ이다.

```
{"status": "EXEMPT", "reason": "두 이차방정식의 판별식 D_P, D_Q 사이의 대소 관계 D_Q=D_P+32를 이용해 참·거짓 명제를 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "두 방정식의 판별식 $\\frac{D_P}{4}=4a-4$, $\\frac{D_Q}{4}=4a+4$를 계산해 $\\frac{D_Q}{4}=\\frac{D_P}{4}+8$ 관계로 ㄱ, ㄴ, ㄷ의 명제를 판정한다.", "decisiveStep": "$D_Q>D_P$가 $a$에 관계없이 항상 성립함과 ㄷ의 반례 $a=0$을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차방정식의 판별식 사이의 상수 차이 관계를 이용해 근의 존재 명제를 판별하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "판별식", "src": "solution", "quote": "판별식을 각각 $D_P, D_Q$"}], "method": [{"term": "판별식", "src": "solution", "quote": "\\dfrac{D_Q}{4} = \\dfrac{D_P}{4}+8", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $P(x), Q(x)$"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근을 가지면"}]}, "reasons": {"method": "두 이차방정식 판별식 사이의 차 D_Q/4 = D_P/4 + 8로 명제의 참·거짓을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 1\] 등식 \$a(x-3y)+b(x+y)-2=4x-4y+c\$가 \$x, y\$의 값에 관계없이 항상 성립할 때, 상수 \$a, b, c\$에 대하여 \$a+b+c\$의 값을 구하시오. (단, 풀이과정을 자세히 쓰시오)

### 선지

없음

### 정답

\$2\$

### 해설

좌변을 \$x, y\$에 대하여 내림차순 정리하면 \$\$ (a+b)x+(-3a+b)y-2 \= 4x-4y+c \$\$ \$x, y\$에 대한 항등식이므로 계수비교법에 의하여 \$\$ a+b=4, \\qquad \-3a+b=-4, \\qquad c=-2 \$\$ 앞의 두 식을 빼면 \$4a=8 \\implies a=2\$, 따라서 \$b=2\$이다. 그러므로 \$a+b+c \= 2+2+(-2) \= 2\$이다.

```
{"status": "EXEMPT", "reason": "두 변수 x, y 항등식에서 계수비교법으로 a, b, c를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "좌변을 $x, y$에 대해 정리한 뒤 양변 계수를 비교해 $a+b=4, -3a+b=-4, c=-2$를 연립한다.", "decisiveStep": "$a+b=4$와 $-3a+b=-4$를 빼서 $a=2, b=2$를 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 문자에 대한 항등식에서 계수비교법을 적용해 연립방정식을 푸는 서술형 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b, c$에 대하여"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수비교법에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "solution", "quote": "x, y$에 대한 항등식이므로"}], "condition": []}, "reasons": {"method": "x, y에 대해 정리 후 계수비교법으로 a, b, c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 2\] 복소수 \$z=a^2(1+i)-a(3+i)-(4+2i)\$가 \$0\$이 아닌 실수가 되도록 하는 실수 \$a\$의 값을 \$p\$, 순허수가 되도록 하는 실수 \$a\$의 값을 \$q\$라 할 때, \$pq\$의 값을 구하시오. (단, 풀이과정을 자세히 쓰시오)

### 선지

없음

### 정답

\$8\$

### 해설

\$z\$를 실수부분과 허수부분으로 정리하면 \$\$ z \= (a^2-3a-4)+(a^2-a-2)i \= (a+1)(a-4)+(a+1)(a-2)i \$\$

1) \$z\$가 \$0\$이 아닌 실수이려면 허수부분이 \$0\$이고 실수부분이 \$0\$이 아니어야 하므로 \$(a+1)(a-2)=0\$이고 \$(a+1)(a-4)\\ne 0 \\implies a=2\$, 즉 \$p=2\$이다.  
2) \$z\$가 순허수이려면 실수부분이 \$0\$이고 허수부분이 \$0\$이 아니어야 하므로 \$(a+1)(a-4)=0\$이고 \$(a+1)(a-2)\\ne 0 \\implies a=4\$, 즉 \$q=4\$이다. 따라서 \$pq \= 2\\times 4 \= 8\$이다.

```
{"status": "EXEMPT", "reason": "복소수 z의 실수부·허수부를 정리해 0이 아닌 실수 조건과 순허수 조건을 만족하는 a를 각각 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=(a+1)(a-4)+(a+1)(a-2)i$로 정리한 뒤 $z=0$이 되는 공통근 $a=-1$을 제외하고 $p=2, q=4$를 구한다.", "decisiveStep": "$a=-1$일 때 실수부분과 허수부분이 동시에 $0$이 되므로 $p$와 $q$에서 모두 제외함을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-026 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수가 $0$이 아닌 실수·순허수가 될 조건에서 공통인수 $a=-1$을 걸러내는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=a^2(1+i)-a(3+i)-(4+2i)$"}], "method": [{"term": "순허수", "src": "stem", "quote": "순허수가 되도록", "evidenceType": "NAMED"}], "given": [{"term": "실수부분", "src": "solution", "quote": "실수부분과 허수부분으로"}], "condition": []}, "reasons": {"method": "실수부·허수부 인수분해 후 z=0이 되는 a=-1을 제외해 p, q를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q25

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 3\] 이차함수 \$y=ax^2+bx+c\$의 그래프는 꼭짓점의 좌표가 \$(3, \-2)\$이고, \$x\$축과 두 점 \$P, Q\$에서 만난다. \$\\overline{PQ}=6\$일 때, 상수 \$a, b, c\$의 합 \$a+b+c\$의 값을 구하시오. (단, 풀이과정을 자세히 쓰시오)

### 선지

없음

### 정답

\$-\\dfrac{10}{9}\$

### 해설

꼭짓점이 \$(3, \-2)\$이므로 \$y=a(x-3)^2-2\$라 두자. 이차함수 그래프는 대칭축 \$x=3\$에 대하여 대칭이고 \$\\overline{PQ}=6\$이므로 \$x\$축과의 두 교점의 \$x\$좌표는 \$3-3=0\$과 \$3+3=6\$이다. 점 \$(0, 0)\$을 지나므로 대입하면 \$\$ 0 \= a(0-3)^2-2 \= 9a-2 \\implies a \= \\frac{2}{9} \$\$ 따라서 \$y=\\dfrac{2}{9}(x-3)^2-2\$이고, \$a+b+c\$는 \$x=1\$을 대입한 함숫값이므로 \$\$ a+b+c \= \\frac{2}{9}(1-3)^2-2 \= \\frac{8}{9}-2 \= \-\\frac{10}{9} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "꼭짓점 (3,-2)와 x축 절편 사이 거리 6으로 이차함수를 결정해 a+b+c를 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "25", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "꼭짓점 $(3, -2)$와 대칭축 $x=3$에서 $\\overline{PQ}=6$으로 $x$절편 $(0, 0), (6, 0)$을 찾아 $a=\\frac{2}{9}$를 구하고 $x=1$을 대입한다.", "decisiveStep": "$a+b+c$를 전개하지 않고 $x=1$에서의 함숫값 $f(1)$로 바로 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 대칭성으로 두 $x$절편을 찾고 $f(1)=a+b+c$를 활용하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "꼭짓점", "src": "stem", "quote": "꼭짓점의 좌표가 $(3, -2)$"}], "method": [{"term": "축", "src": "solution", "quote": "대칭축 $x=3$에 대하여", "evidenceType": "IMPLIED", "justification": "대칭축 x=3과 현의 길이 6을 이용해 x절편 (0,0), (6,0)을 구하고 x=1을 대입함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=ax^2+bx+c$"}], "condition": []}, "reasons": {"method": "대칭축과 두 x절편 거리로 식을 세우고 x=1 대입으로 a+b+c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q26

- 형식: 서답형  
- 배점: 5

### 발문

\[서술형 4\] \$x+y=4\$, \$x\\ge 0\$, \$y\\ge 0\$에서 \$2x^2+y^2\$의 최댓값을 \$M\$, 최솟값을 \$m\$이라 할 때, \$m+M\$의 값을 구하시오. (단, 풀이과정을 자세히 쓰시오)

### 선지

없음

### 정답

\$\\dfrac{128}{3}\$

### 해설

\$y=4-x\$이고 \$x\\ge 0\$, \$y=4-x\\ge 0\$에서 \$0\\le x\\le 4\$이다. 주어진 식에 대입하면 \$\$ 2x^2+(4-x)^2 \= 3x^2-8x+16 \= 3\\left(x-\\frac{4}{3}\\right)^2+\\frac{32}{3} \$\$ 구간 \$0\\le x\\le 4\$에 꼭짓점 \$x=\\dfrac{4}{3}\$이 포함되므로

- 최솟값: \$x=\\dfrac{4}{3}\$일 때 \$m=\\dfrac{32}{3}\$  
- 최댓값: 축에서 가장 먼 끝점 \$x=4\$일 때 \$M=3\\cdot 16-32+16=32\$ 따라서 \$m+M \= \\dfrac{32}{3}+32 \= \\dfrac{128}{3}\$이다.

```
{"status": "EXEMPT", "reason": "일차 제약식 x+y=4를 소거해 제한 범위 0<=x<=4에서 이차식의 최대·최소를 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "26", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$y=4-x$와 $y\\ge 0$에서 범위 $0\\le x\\le 4$를 구한 뒤 $3x^2-8x+16$의 최댓값과 최솟값을 구한다.", "decisiveStep": "두 비음 조건 $x\\ge 0, y\\ge 0$에서 $x$의 유계 범위 $0\\le x\\le 4$를 빠뜨리지 않고 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json H1-RPM-038 (DIRECT_ACTIVE) 정본 매핑"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "조건식 소거 시 변수의 제한 범위 $0\\le x\\le 4$를 도출해 최대·최소를 구하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값을 $M$, 최솟값을 $m$"}], "method": [{"term": "이차함수", "src": "solution", "quote": "3\\left(x-\\frac{4}{3}\\right)^2+\\frac{32}{3}", "evidenceType": "IMPLIED", "justification": "y=4-x를 대입하고 0<=x<=4 범위에서 완전제곱식 최대·최소를 구함"}], "given": [{"term": "부등식", "src": "stem", "quote": "x\\ge 0$, $y\\ge 0$"}], "condition": []}, "reasons": {"method": "y=4-x 소거 후 0<=x<=4 범위에서 이차식 최대·최소의 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

