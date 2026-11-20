

```
{"stem": "21_매산고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/21_매산고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 20, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.9

### 발문

다음 두 다항식 \$A=2x^2+3x-1\$, \$B=x^2+5x+4\$에 대하여 \$A+B=ax^2+bx+c\$이다. \$a+b+c\$의 값은? (단, \$a, b, c\$는 실수)

### 선지

① \$14\$ ② \$10\$ ③ \$12\$ ④ \$16\$ ⑤ \$18\$

### 정답

①

### 해설

동류항끼리 모아서 더하면 \$\$ A+B \= (2+1)x^2+(3+5)x+(-1+4) \= 3x^2+8x+3 \$\$ 따라서 \$a=3, b=8, c=3\$이므로 \$a+b+c=3+8+3=14\$이다.

```
{"status": "EXEMPT", "reason": "두 이차다항식의 합을 동류항 정리로 구하고 계수 합을 계산하는 순수 연산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "두 다항식 $A, B$를 동류항끼리 더해 $3x^2+8x+3$을 구하고 계수 $a+b+c$를 합산한다.", "decisiveStep": "차수별 동류항 계수 $a=3, b=8, c=3$을 정확히 더한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "다항식의 덧셈·뺄셈 및 동류항 계수 합산 문항으로 H1-RPM-002(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 덧셈과 계수 합을 묻는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "a=3, b=8, c=3"}], "method": [{"term": "동류항", "src": "solution", "quote": "동류항끼리 모아서 더하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=2x^2+3x-1$"}], "condition": []}, "reasons": {"method": "두 다항식의 동류항을 더해 계수 합 14를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.9

### 발문

\$x^3-27=(x-3)(x^2+ax+9)\$일 때, 상수 \$a\$의 값은?

### 선지

① \$-3\$ ② \$0\$ ③ \$1\$ ④ \$3\$ ⑤ \$6\$

### 정답

④

### 해설

인수분해 공식 \$A^3-B^3=(A-B)(A^2+AB+B^2)\$에 의하여 \$\$ x^3-27 \= x^3-3^3 \= (x-3)(x^2+3x+9) \$\$ 따라서 \$a=3\$이다.

```
{"status": "EXEMPT", "reason": "세제곱의 차 인수분해 공식으로 일차항 계수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "세제곱의 차 인수분해 공식 $x^3-3^3=(x-3)(x^2+3x+9)$를 적용해 $a=3$을 구한다.", "decisiveStep": "$27=3^3$으로 보고 $A^3-B^3$ 인수분해 공식의 가운데 항 $+3x$를 읽는다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "합과 차"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "세제곱의 차 인수분해 공식(A^3-B^3) 적용 문항으로 H1-RPM-016(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기본 인수분해 공식 $A^3-B^3$을 직접 적용하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값은"}], "method": [{"term": "인수분해", "src": "solution", "quote": "인수분해 공식 $A^3-B^3=(A-B)(A^2+AB+B^2)$에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "solution", "quote": "(x-3)(x^2+3x+9)"}], "condition": []}, "reasons": {"method": "세제곱의 차 인수분해 공식으로 a=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 4.1

### 발문

다음 중 이차함수 \$y=x^2+4x+2\$의 그래프와 직선 \$y=4x+k\$가 만나지 않도록 하는 \$k\$의 값은?

### 선지

① \$3\$ ② \$1\$ ③ \$2\$ ④ \$4\$ ⑤ \$5\$

### 정답

②

### 해설

두 그래프가 만나지 않으려면 이차방정식 \$\$ x^2+4x+2 \= 4x+k \\iff x^2+(2-k) \= 0 \$\$ 이 실근을 갖지 않아야 하므로 판별식 \$D\<0\$이다. \$\$ D \= 0^2-4(2-k) \= 4k-8 \< 0 \\implies k \< 2 \$\$ 보기 중 \$k\<2\$를 만족하는 값은 ② \$1\$이다.

```
{"status": "EXEMPT", "reason": "이차함수와 직선이 만나지 않을 조건을 판별식 D<0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "두 식을 연립한 $x^2+2-k=0$의 판별식 $D=4k-8<0$을 풀어 $k<2$를 만족하는 보기를 고른다.", "decisiveStep": "'만나지 않는다'는 조건을 연립방정식의 $D<0$으로 해석한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "이차함수와 직선이 만나지 않는 조건(판별식 D<0) 문항으로 H1-RPM-035(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 비교점 조건에 판별식을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$이다"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+4x+2$"}], "condition": []}, "reasons": {"method": "연립방정식 판별식 D<0으로 k<2를 구해 보기 중 1을 선택함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4.1

### 발문

다음 주어진 이차방정식들 중 허근을 가지는 이차방정식은? (가) \$x^2+4x-2=0\$ (나) \$x^2+2x+5=0\$ (다) \$x^2+4=0\$

### 선지

① (가) ② (나) ③ (다) ④ (가), (나) ⑤ (나), (다)

### 정답

⑤

### 해설

각 이차방정식의 판별식 \$D\$의 부호를 조사하면

- (가) \$D/4 \= 2^2-1\\cdot(-2) \= 6 \> 0\$ (서로 다른 두 실근)  
- (나) \$D/4 \= 1^2-1\\cdot 5 \= \-4 \< 0\$ (서로 다른 두 허근)  
- (다) \$x^2=-4\$이므로 \$x=\\pm 2i\$ (서로 다른 두 허근) 따라서 허근을 가지는 것은 (나), (다)이다.

```
{"status": "EXEMPT", "reason": "세 이차방정식의 판별식 부호로 허근 여부를 판별하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "세 이차방정식 (가), (나), (다)의 판별식 $D<0$ 여부를 각각 계산해 허근을 갖는 식을 고른다.", "decisiveStep": "(가)는 $D/4=6>0$으로 실근이고, (나)와 (다)만 $D<0$으로 허근을 가짐을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "이차방정식의 판별식 부호로 허근 여부를 판별하는 문항으로 H1-RPM-028(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 판별식 부호로 실근과 허근을 판별하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "허근을 가지는"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D$의 부호를", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "주어진 이차방정식들"}], "condition": []}, "reasons": {"method": "각 이차방정식의 판별식 부호를 조사해 허근을 갖는 (나), (다)를 고름"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4.2

### 발문

다음은 다항식 \$P(x)=(x^2+2x+3)(x^2+2x+1)-8\$을 인수분해하는 학생들의 대화이다. (가)\~(마)에 들어갈 내용으로 알맞지 않은 것은?

교사: 지난 시간에 배운 방법으로 \$P(x)=(x^2+2x+3)(x^2+2x+1)-8\$을 인수분해하자\! 재현: 위 다항식은 치환을 이용해서 인수분해할 수 있어. 세찬: \$P(x)=(x^2+2x+3)(x^2+2x+1)-8\$에서 (가)를 \$X\$로 치환하자. 병일: 그러면 \$P(x)=X^2+\$ (나)\$X+\$ (다)인 셈이네? 이제 인수분해하면 되겠어\! 두관: \$P(x)=(X+5)\\times\$ (라)니까 \$X\$에 (가)를 대입하자\! 경태: 그러면 \$P(x)=(x^2+2x+5)\\times\$ (마)이구나\!

### 선지

① (가): \$x^2+2x\$ ② (나): \$4\$ ③ (다): \$-8\$ ④ (라): \$(X-1)\$ ⑤ (마): \$(x^2+2x-1)\$

### 정답

③

### 해설

\$X=x^2+2x\$로 치환하면 \$\$ \\begin{aligned} P(x) &= (X+3)(X+1)-8 \\ &= X^2+4X+3-8 \\ &= X^2+4X-5 \\ &= (X+5)(X-1) \\ &= (x^2+2x+5)(x^2+2x-1) \\end{aligned} \$\$ 따라서 (가) \$x^2+2x\$, (나) \$4\$, (다) \$-5\$, (라) \$(X-1)\$, (마) \$(x^2+2x-1)\$이므로 알맞지 않은 것은 ③이다.

```
{"status": "EXEMPT", "reason": "공통부분 x^2+2x 치환 인수분해 과정의 빈칸 중 틀린 것을 찾는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$x^2+2x=X$로 치환해 $(X+3)(X+1)-8=X^2+4X-5=(X+5)(X-1)$을 전개·인수분해하여 빈칸 (다)의 오류를 찾는다.", "decisiveStep": "상수항 계산 $3\\cdot 1-8=-5$에서 (다)가 $-8$이 아님을 확인한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "공통부분 치환을 통한 단계적 인수분해 문항으로 H1-RPM-014(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "치환을 이용한 사차식 인수분해의 단계별 빈칸을 검증하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해하는 학생들의"}], "method": [{"term": "치환", "src": "stem", "quote": "치환을 이용해서", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)=(x^2+2x+3)(x^2+2x+1)-8$"}], "condition": []}, "reasons": {"method": "x^2+2x 치환 후 전개·인수분해 과정에서 틀린 빈칸 (다)를 찾음"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4.3

### 발문

\$2x^4+3x^3-5x^2-x+1=(ax+1)(x-b)(x^2+cx-1)\$이다. \$abc\$의 값은? (단, \$a, b, c\$는 실수)

### 선지

① \$4\$ ② \$-4\$ ③ \$2\$ ④ \$-2\$ ⑤ \$6\$

### 정답

①

### 해설

우변을 전개하면 \$\$ (ax+1)(x-b)(x^2+cx-1) \= {ax^2+(1-ab)x-b}(x^2+cx-1) \$\$ 양변의 계수를 비교하면

- 상수항: \$(-b)(-1) \= b \= 1\$  
- \$x^4\$항 계수: \$a \= 2\$ \$a=2, b=1\$을 대입하면 \$(2x^2-x-1)(x^2+cx-1)\$의 \$x^3\$항 계수는 \$2c-1=3 \\implies c=2\$이다. (이때 \$x^2\$항은 \$-2-c-1=-5\$, \$x\$항은 \$1-c=-1\$로 일치한다.) 따라서 \$abc=2\\cdot 1\\cdot 2=4\$이다.

```
{"status": "EXEMPT", "reason": "사차항등식의 우변을 전개해 계수비교법으로 a, b, c를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "상수항과 최고차항 계수 비교로 $b=1, a=2$를 먼저 구한 뒤 $x^3$항 계수 $2c-1=3$으로 $c=2$를 구한다.", "decisiveStep": "상수항 $(-b)(-1)=1$과 $x^4$항 계수 $a=2$를 먼저 확정해 계산을 단순화한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "사차항등식의 계수비교법(미정계수법) 문항으로 H1-RPM-007(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사차다항식의 인수분해 항등식에서 차수별 계수비교를 순차 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "$a, b, c$는 실수"}], "method": [{"term": "계수비교", "src": "solution", "quote": "양변의 계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "solution", "quote": "(2x^2-x-1)(x^2+cx-1)"}], "condition": []}, "reasons": {"method": "최고차항·상수항부터 계수비교해 a, b, c를 구한 뒤 abc를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 4.4

### 발문

이차방정식 \$x^2+2x+p+pq-2q=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 하자. 위 등식이 \$q\$의 값에 관계없이 항상 성립할 때, \$\\alpha+\\beta\$, \$\\dfrac{1}{\\alpha}+\\dfrac{1}{\\beta}\$를 두 근으로 하고 \$x^2\$의 계수가 \$2\$인 이차방정식은 \$ax^2+bx+c=0\$이다. \$\\dfrac{ab}{c}\$의 값은? (단, \$a, b, c, p, q\$는 실수이고 \$c\\ne 0\$)

### 선지

① \$1\$ ② \$2\$ ③ \$4\$ ④ \$3\$ ⑤ \$6\$

### 정답

④

### 해설

주어진 등식을 \$q\$에 대하여 정리하면 \$\$ (p-2)q+(x^2+2x+p)=0 \$\$ \$q\$의 값에 관계없이 성립하므로 \$p-2=0 \\implies p=2\$이고 이차방정식은 \$x^2+2x+2=0\$이다. 근과 계수의 관계에 의하여 \$\\alpha+\\beta=-2\$, \$\\alpha\\beta=2\$이므로 \$\$ \\frac{1}{\\alpha}+\\frac{1}{\\beta} \= \\frac{\\alpha+\\beta}{\\alpha\\beta} \= \\frac{-2}{2} \= \-1 \$\$ 두 수 \$-2, \-1\$을 근으로 하고 \$x^2\$의 계수가 \$2\$인 이차방정식은 \$\$ 2(x+2)(x+1) \= 2x^2+6x+4 \= 0 \$\$ 따라서 \$a=2, b=6, c=4\$이므로 \$\\dfrac{ab}{c}=\\dfrac{2\\cdot 6}{4}=3\$이다.

```
{"status": "EXEMPT", "reason": "q 항등식 조건으로 p를 구하고 근과 계수의 관계로 새 이차방정식을 작성하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$q$에 대한 항등식 정리 $(p-2)q+(x^2+2x+p)=0$으로 $p=2$를 구하고, 근과 계수의 관계로 새 두 근 $-2, -1$의 이차방정식을 세운다.", "decisiveStep": "$q$ 항등식 조건으로 $p=2$를 먼저 확정해 이차방정식 $x^2+2x+2=0$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "근과 계수의 관계로 변환된 두 근의 이차방정식을 구성하는 문항으로 H1-RPM-030(DIRECT_BINDING_GAP)에 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자 $q$에 대한 항등식 조건, 근과 계수의 관계, 새 이차방정식 작성을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식은 $ax^2+bx+c=0$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "solution", "quote": "q$의 값에 관계없이 성립하므로"}], "condition": []}, "reasons": {"method": "q 항등식으로 p=2를 구한 뒤 새 두 근으로 이차방정식을 작성함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q08

- 형식: 객관식  
- 배점: 4.3

### 발문

연립방정식 \$\\begin{cases} ax+y=-2 \\ x+2y=5 \\end{cases}\$의 해가 연립방정식 \$\\begin{cases} x+y=b \\ x^2+y^2=25 \\end{cases}\$을 만족시킨다고 할 때, 실수 \$a\$, \$b\$에 대하여 \$ab\$의 값은? (단, \$a\\ne\\dfrac{1}{2}\$, \$b\<2\$)

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

②

### 해설

\$x+2y=5\$에서 \$x=5-2y\$를 \$x^2+y^2=25\$에 대입하면 \$\$ (5-2y)^2+y^2=25 \\implies 5y^2-20y=0 \\implies y=0 \\text{ 또는 } y=4 \$\$

- \$y=0\$이면 \$x=5\$이므로 \$b=x+y=5\$ (\$b\<2\$에 모순)  
- \$y=4\$이면 \$x=-3\$이므로 \$b=x+y=1\<2\$ (성립) \$x=-3, y=4\$를 \$ax+y=-2\$에 대입하면 \$-3a+4=-2 \\implies a=2\$이다. 따라서 \$ab=2\\cdot 1=2\$이다.

```
{"status": "EXEMPT", "reason": "미지수 a를 포함하지 않은 두 식 x+2y=5와 x^2+y^2=25를 먼저 연립해 공통해를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-SUBSTITUTION_SYSTEM", "conceptClusterKey": null, "primaryMethod": "$a, b$가 없는 두 식 $x+2y=5$와 $x^2+y^2=25$를 연립해 해를 구하고 $b<2$ 조건으로 $(-3, 4)$를 택해 $a, b$를 구한다.", "decisiveStep": "미지수 없는 두 방정식을 먼저 묶어 풀고 $b<2$ 조건으로 $(5, 0)$을 배제한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "연립방정식", "l4": "이차식이 포함된 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_SYSTEM_EQUATION", "templateKey": "TPL_H1_SYSTEM_DIRECT", "why": "이차식이 포함된 연립방정식의 공통해 풀이 문항으로 H1-RPM-041(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공통해를 갖는 두 연립방정식에서 상수 계수 식을 먼저 연립해 푸는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$, $b$에 대하여"}], "method": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식 $\\begin{cases} ax+y=-2 \\\\ x+2y=5 \\end{cases}$의 해", "evidenceType": "IMPLIED", "justification": "미지수가 없는 두 식 x+2y=5와 x^2+y^2=25를 먼저 연립해 해를 구함"}], "given": [{"term": "대입", "src": "solution", "quote": "x^2+y^2=25$에 대입하면"}], "condition": []}, "reasons": {"method": "x+2y=5와 x^2+y^2=25를 먼저 연립해 b<2를 만족하는 해 (-3, 4)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4.4

### 발문

다음 \<보기\> 중 옳지 않은 것의 개수는? (단, \$x, y\\ne 0\$) \<보기\> ㄱ. \$\\sqrt{x}\\sqrt{y}=\\sqrt{xy}\$이면 \$\\dfrac{\\sqrt{y}}{\\sqrt{x}}=\\sqrt{\\dfrac{y}{x}}\$이다. ㄴ. \$x\<y\<3\$일 때, \$\\dfrac{\\sqrt{(y-x)^2}}{\\sqrt{(x-y)^2}}\\times\\dfrac{\\sqrt{(3-y)^2}}{\\sqrt{(y-3)^2}}=i\$이다. ㄷ. \$\\dfrac{\\sqrt{y}}{\\sqrt{x}}=\\sqrt{\\dfrac{y}{x}}\$이면 \$x\>0, y\>0\$이다. ㄹ. 복소수 \$z\$에 대하여 \$z=-\\overline{z}\$이면 \$z^2\<0\$이다.

### 선지

① \$0\$개 ② \$1\$개 ③ \$2\$개 ④ \$3\$개 ⑤ \$4\$개

### 정답

⑤

### 해설

- ㄱ. \$x=-1, y=1\$이면 \$\\sqrt{-1}\\sqrt{1}=i=\\sqrt{-1}\$로 가정은 성립하지만 \$\\dfrac{\\sqrt{1}}{\\sqrt{-1}}=-i=-\\sqrt{-1}\\ne\\sqrt{-1}\$이므로 거짓이다.  
- ㄴ. \$x\<y\<3\$이므로 \$y-x\>0, 3-y\>0\$이고 \$\\sqrt{(y-x)^2}=\\sqrt{(x-y)^2}=y-x\$, \$\\sqrt{(3-y)^2}=\\sqrt{(y-3)^2}=3-y\$이다. 따라서 좌변은 \$1\\times 1=1\\ne i\$이므로 거짓이다.  
- ㄷ. \$x\<0, y\<0\$일 때도 \$\\dfrac{\\sqrt{y}}{\\sqrt{x}}=\\dfrac{\\sqrt{-y}i}{\\sqrt{-x}i}=\\sqrt{\\dfrac{y}{x}}\$가 성립하므로 거짓이다.  
- ㄹ. \$z=0\$이면 \$0=-\\overline{0}\$을 만족하지만 \$z^2=0\$이므로 \$z^2\<0\$이 거짓이다. 따라서 옳지 않은 것은 ㄱ, ㄴ, ㄷ, ㄹ의 \$4\$개이다.

```
{"status": "EXEMPT", "reason": "음수의 제곱근, 절댓값 제곱근, 순허수 조건의 반례를 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "음수 제곱근 부호 조건(ㄱ, ㄷ), 제곱근 절댓값 성질(ㄴ), $z=0$ 경계 반례(ㄹ)를 각각 점검해 거짓인 명제를 센다.", "decisiveStep": "ㄱ의 $x<0, y>0$ 반례, ㄷ의 $x<0, y<0$ 반례, ㄹ의 $z=0$ 반례를 모두 포착한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "음수의 제곱근 및 켤레복소수 조건의 참·거짓 판별 문항으로 H1-RPM-026(DIRECT_ACTIVE)에 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 제곱근과 복소수 명제의 숨은 반례를 정확히 가려내는 중상 개념 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $z$에 대하여"}], "method": [{"term": "제곱근", "src": "solution", "quote": "\\sqrt{-1}\\sqrt{1}=i=\\sqrt{-1}", "evidenceType": "IMPLIED", "justification": "음수 제곱근 연산 성질의 반례와 z=0 반례를 들어 4개 보기의 거짓을 판별함"}], "given": [{"term": "켤레복소수", "src": "stem", "quote": "z=-\\overline{z}"}], "condition": []}, "reasons": {"method": "음수 제곱근과 z=0 반례를 점검해 4개 보기가 모두 거짓임을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4.3

### 발문

양수 \$a\_1, a\_2, a\_3, \\cdots, a\_{2021}\$에 대하여 \$a\_1a\_2a\_3\\cdots a\_{2021}=900\$일 때, \$\\sqrt{-a\_1}\\sqrt{-a\_2}\\sqrt{-a\_3}\\cdots\\sqrt{-a\_{2021}}\$의 값은?

### 선지

① \$-30\$ ② \$-30i\$ ③ \$30i\$ ④ \$30\$ ⑤ \$90i\$

### 정답

③

### 해설

각 \$a\_k\>0\$에 대하여 \$\\sqrt{-a\_k}=\\sqrt{a\_k}i\$이므로 \$\$ \\begin{aligned} \\sqrt{-a\_1}\\sqrt{-a\_2}\\cdots\\sqrt{-a\_{2021}} &= (\\sqrt{a\_1}i)(\\sqrt{a\_2}i)\\cdots(\\sqrt{a\_{2021}}i) \\ &= \\sqrt{a\_1a\_2\\cdots a\_{2021}}\\cdot i^{2021} \\ &= \\sqrt{900}\\cdot i^{4\\times 505+1} \= 30i \\end{aligned} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "음수의 제곱근 2021개의 곱을 √a_k*i로 변환하고 i의 거듭제곱 주기를 적용하는 순수 복소수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "모든 $\\sqrt{-a_k}$를 $\\sqrt{a_k}i$로 고쳐 양수의 제곱근 곱 $\\sqrt{900}=30$과 $i^{2021}=i$를 곱한다.", "decisiveStep": "$2021=4\\times 505+1$이므로 $i^{2021}=i$가 됨을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "음수 제곱근 곱에서 허수단위 i의 거듭제곱 주기성을 적용하는 문항으로 H1-RPM-025(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "여러 개의 음수 제곱근 곱을 허수단위 $i$로 변환해 주기성을 적용하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "제곱근", "src": "stem", "quote": "\\sqrt{-a_1}\\sqrt{-a_2}\\sqrt{-a_3}\\cdots\\sqrt{-a_{2021}}$의 값"}], "method": [{"term": "복소수", "src": "solution", "quote": "\\sqrt{-a_k}=\\sqrt{a_k}i$이므로", "evidenceType": "IMPLIED", "justification": "각 음수 제곱근을 √a_k*i로 변환한 뒤 i^2021=i를 적용함"}], "given": [{"term": "양수", "src": "stem", "quote": "양수 $a_1, a_2, a_3, \\cdots, a_{2021}$"}], "condition": []}, "reasons": {"method": "각 음수 제곱근을 √a_k*i로 바꾸고 i^2021=i를 적용해 30i를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4.6

### 발문

자연수 \$n\$에 대하여 \$f(n)=\\left(\\dfrac{1-i}{1+i}\\right)^n+\\left(\\dfrac{1+i}{1-i}\\right)^{n+2}\$일 때, 다음 \<보기\> 중 옳은 것의 개수는? \<보기\> ㄱ. \$f(2021)=2i\$ ㄴ. \$f(1)+f(2)+f(3)+\\cdots+f(98)=-2i\$ ㄷ. \$f(6n)=f(2n)\$ ㄹ. \$f(1)f(3)+f(3)f(5)+f(5)f(7)+\\cdots+f(49)f(51)=96\$ ㅁ. \$f(n)=0\$의 해 중 \$100\$ 이하의 자연수는 \$50\$개이다.

### 선지

① \$3\$ ② \$1\$ ③ \$2\$ ④ \$4\$ ⑤ \$5\$

### 정답

①

### 해설

\$\\dfrac{1-i}{1+i}=-i\$, \$\\dfrac{1+i}{1-i}=i\$이고 \$i^{n+2}=-i^n\$이므로 \$f(n)=(-i)^n-i^n\$이다. \$n=1, 2, 3, 4\$일 때 \$f(1)=-2i, f(2)=0, f(3)=2i, f(4)=0\$으로 주기 \$4\$로 반복된다.

- ㄱ. \$2021=4\\times 505+1\$이므로 \$f(2021)=f(1)=-2i\\ne 2i\$. (거짓)  
- ㄴ. \$4\$개씩 합이 \$0\$이고 \$98=4\\times 24+2\$이므로 \$f(1)+f(2)=-2i+0=-2i\$. (참)  
- ㄷ. \$2n\$과 \$6n\$은 모두 짝수이므로 \$f(6n)=f(2n)=0\$. (참)  
- ㄹ. \$f(1)f(3)=(-2i)(2i)=4\$, \$f(3)f(5)=(2i)(-2i)=4\$ 등 총 \$25\$개 항이 모두 \$4\$이므로 합은 \$25\\times 4=100\\ne 96\$. (거짓)  
- ㅁ. \$f(n)=0\$은 \$n\$이 짝수일 때 성립하므로 \$100\$ 이하 자연수 중 \$50\$개이다. (참) 따라서 옳은 것은 ㄴ, ㄷ, ㅁ의 \$3\$개이다.

```
{"status": "EXEMPT", "reason": "f(n)=(-i)^n-i^n의 4주기 규칙을 구해 다섯 보기의 참·거짓 개수를 세는 순수 복소수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$f(n)=(-i)^n-i^n$이 주기 $4$로 $-2i, 0, 2i, 0$을 반복함을 이용해 ㄱ~ㅁ 다섯 명제를 각각 검증한다.", "decisiveStep": "짝수 $n$에서 $f(n)=0$, 홀수 $n$에서 $\\pm 2i$가 교대함을 이용해 합과 곱의 항 개수를 정확히 센다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "복소수 분수식의 i 거듭제곱 4주기 규칙을 검증하는 문항으로 H1-RPM-025(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 분수식의 주기 함수 $f(n)$에 대해 다섯 가지 성질을 종합 검증하는 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "solution", "quote": "f(n)=(-i)^n-i^n$이다"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "f(1)=-2i, f(2)=0, f(3)=2i, f(4)=0", "evidenceType": "IMPLIED", "justification": "분수식을 ±i로 실수화해 f(n)의 4주기 값 -2i, 0, 2i, 0을 구하고 각 보기를 판별함"}], "given": [{"term": "자연수", "src": "stem", "quote": "자연수 $n$에 대하여"}], "condition": []}, "reasons": {"method": "±i로 단순화한 f(n)의 4주기 값으로 ㄱ~ㅁ 5개 명제의 참·거짓을 판별함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4.6

### 발문

다항식 \$P(x)\$를 \$x+4\$로 나누었을 때의 나머지는 \$-2\$이고, \$x-2\$로 나누었을 때의 나머지는 \$-4\$이다. \$(x^2+2)P(x)\$를 \$x^2+2x-8\$로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(-1)\$의 값을 \$m\$이라고 하자. 다항식 \$Q(x)=-x^3-nx^2+5x+10\$에 대하여 \$Q(x+3)\$이 \$x+5\$로 나누어떨어질 때, 상수 \$n\$에 대하여 \$m+n\$의 값은?

### 선지

① \$-24\$ ② \$-26\$ ③ \$-30\$ ④ \$-28\$ ⑤ \$-32\$

### 정답

④

### 해설

나머지정리에 의해 \$P(-4)=-2, P(2)=-4\$이고 \$x^2+2x-8=(x+4)(x-2)\$이다. \$(x^2+2)P(x)=(x+4)(x-2)A(x)+ax+b\$에 \$x=-4, 2\$를 대입하면 \$\$ \\begin{aligned} (16+2)(-2) &= \-4a+b \\implies \-4a+b \= \-36 \\ (4+2)(-4) &= 2a+b \\implies 2a+b \= \-24 \\end{aligned} \$\$ 두 식을 빼면 \$6a=12 \\implies a=2, b=-28\$이므로 \$R(x)=2x-28\$, \$m=R(-1)=-30\$이다. 한편 \$Q(x+3)\$이 \$x+5\$로 나누어떨어지므로 \$x=-5\$를 대입하면 \$Q(-2)=0\$이다. \$\$ Q(-2) \= 8-4n-10+10 \= 8-4n \= 0 \\implies n=2 \$\$ 따라서 \$m+n=-30+2=-28\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리로 (x^2+2)P(x)의 나머지 R(x)를 구하고 인수정리 Q(-2)=0으로 n을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$P(-4)=-2, P(2)=-4$를 $(x^2+2)P(x)$ 나눗셈 항등식에 대입해 $m=R(-1)=-30$을 구하고, 인수정리 $Q(-2)=0$으로 $n=2$를 구한다.", "decisiveStep": "$Q(x+3)$이 $x+5$로 나누어떨어지는 조건이 $Q(-2)=0$임을 정확히 변환한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "합성 제수 (x+4)(x-2)에 나머지정리를 결합하고 인수정리를 적용하는 문항으로 H1-RPM-010(FAMILY_ACTIVE)에 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곱해진 다항식의 나머지정리 연립과 평행이동된 다항식의 인수정리를 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 할 때"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의해", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": [{"term": "인수정리", "src": "solution", "quote": "Q(-2)=0$이다"}]}, "reasons": {"method": "나머지정리로 m=R(-1)을 구하고 인수정리 Q(-2)=0으로 n을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4.7

### 발문

다항식 \$f(x)\$에 관하여 모든 실수 \$x\$에 대하여 \$f(x^2)=x^3f(x+1)-6x^4+6x^2\$이 성립할 때, \$f(5)\$를 구하면?

### 선지

① \$150\$ ② \$180\$ ③ \$120\$ ④ \$210\$ ⑤ \$240\$

### 정답

②

### 해설

\$f(x)\$의 차수를 \$d\$라 하면 좌변은 \$2d\$차, 우변은 \$\\max(d+3, 4)\$차이므로 \$2d=d+3 \\implies d=3\$, 즉 \$f(x)\$는 삼차다항식이다. 항등식에 \$x=0\$을 대입하면 \$f(0)=0\$, \$x=-1\$을 대입하면 \$f(1)=-f(0)=0\$, \$x=1\$을 대입하면 \$f(1)=f(2)=0\$이다. 따라서 \$f(x)=kx(x-1)(x-2)\$ (\$k\\ne 0\$)라 놓을 수 있다. 주어진 항등식에 대입하면 \$\$ \\begin{aligned} kx^2(x^2-1)(x^2-2) &= x^3\\cdot k(x+1)x(x-1)-6x^4+6x^2 \\ kx^2(x^2-1)(x^2-2-x^2) &= \-6x^2(x^2-1) \\ \-2kx^2(x^2-1) &= \-6x^2(x^2-1) \\end{aligned} \$\$ 따라서 \$k=3\$이므로 \$f(x)=3x(x-1)(x-2)\$이고 \$f(5)=3\\cdot 5\\cdot 4\\cdot 3=180\$이다.

```
{"status": "EXEMPT", "reason": "다항식 함수 방정식에서 차수 비교와 x=0,-1,1 대입으로 인수를 찾아 f(x)를 결정하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "차수 비교로 $f(x)$가 삼차식임을 밝히고 $x=0, -1, 1$을 대입해 $f(0)=f(1)=f(2)=0$을 찾아 $f(x)=3x(x-1)(x-2)$를 구한다.", "decisiveStep": "$x=0, -1, 1$ 세 값을 차례로 대입해 삼차식의 세 근 $0, 1, 2$를 모두 찾는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "항등식에 x=0,-1,1을 연쇄 대입하는 수치대입법 문항으로 H1-RPM-008(DIRECT_ACTIVE)에 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 항등식의 차수 결정, 연쇄 수치대입을 통한 인수 추출, 계수비교를 결합한 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$에 관하여"}], "method": [{"term": "인수정리", "src": "solution", "quote": "f(0)=0$, $x=-1$을 대입하면", "evidenceType": "IMPLIED", "justification": "차수 결정 후 x=0, -1, 1 대입으로 f(0)=f(1)=f(2)=0을 찾아 삼차식을 결정함"}], "given": [{"term": "항등식", "src": "solution", "quote": "항등식에 $x=0$을 대입하면"}], "condition": []}, "reasons": {"method": "차수 비교와 x=0,-1,1 연쇄 대입으로 삼차식 f(x)=3x(x-1)(x-2)를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.6

### 발문

모든 실수 \$x\$에 대하여 등식 \$(x^2-4x)^6=a\_{12}(x-2)^{12}+a\_{11}(x-2)^{11}+\\cdots+a\_1(x-2)+a\_0\$이 성립할 때, \$4^6a\_{12}+4^5a\_{10}+4^4a\_8+4^3a\_6+4^2a\_4+4a\_2+a\_0\$의 값은? (단, \$a\_0, a\_1, \\cdots, a\_{12}\$는 유리수이다.)

### 선지

① \$-4^6\$ ② \$-4^3\$ ③ \$4^3\$ ④ \$4^6\$ ⑤ \$0\$

### 정답

⑤

### 해설

\$x-2=t\$라 하면 \$x^2-4x=(x-2)^2-4=t^2-4\$이므로 \$\$ (t^2-4)^6 \= a\_{12}t^{12}+a\_{11}t^{11}+\\cdots+a\_1t+a\_0 \$\$ 좌변이 \$t^2\$의 다항식이므로 홀수차 계수는 모두 \$0\$이다. 양변에 \$t=2\$ (\$x=4\$)를 대입하면 \$\$ (2^2-4)^6 \= a\_{12}2^{12}+a\_{10}2^{10}+\\cdots+a\_22^2+a\_0 \= 4^6a\_{12}+4^5a\_{10}+\\cdots+4a\_2+a\_0 \= 0 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "x-2=t 치환 후 홀수차 계수 소거 및 t=2 대입으로 가중 계수합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "$x-2=t$로 치환해 $(t^2-4)^6$의 홀수차 계수가 $0$임을 확인하고 $t=2$를 대입해 가중 계수합 $0$을 구한다.", "decisiveStep": "$2^{2k}=4^k$이므로 $t=2$를 대입하면 구하는 식이 곧바로 나옴을 파악한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "x-2=t 치환 후 t=2를 대입해 가중 계수합을 구하는 수치대입법 문항으로 H1-RPM-008(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 전개 항등식에서 $t=x-2$ 치환과 $t=2$ 수치대입을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "계수", "src": "solution", "quote": "홀수차 계수는 모두 $0$"}], "method": [{"term": "수치대입법", "src": "solution", "quote": "양변에 $t=2$ ($x=4$)를 대입하면", "evidenceType": "IMPLIED", "justification": "x-2=t 치환 후 t=2를 대입해 4^k*a_{2k}의 합을 즉시 구함"}], "given": [{"term": "유리수", "src": "stem", "quote": "유리수이다"}], "condition": []}, "reasons": {"method": "x-2=t 치환으로 홀수차 계수를 소거하고 t=2를 대입해 0을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.6

### 발문

다음 \<보기\>를 모두 만족시키는 세 실수 \$x, y, z\$에 대하여 \$x^2+y^2+z^2\$의 최솟값은? \<보기\> 조건 1\) \$x+y+z=3\$ 조건 2\) \$x+2y+3z=10\$

### 선지

① \$9\$ ② \$10\$ ③ \$11\$ ④ \$12\$ ⑤ \$13\$

### 정답

③

### 해설

조건 2)에서 조건 1)을 빼면 \$y+2z=7 \\implies y=7-2z\$이다. 이를 조건 1)에 대입하면 \$x=3-(7-2z)-z=z-4\$이다. 따라서 \$\$ \\begin{aligned} x^2+y^2+z^2 &= (z-4)^2+(7-2z)^2+z^2 \\ &= 6z^2-36z+65 \\ &= 6(z-3)^2+11 \\end{aligned} \$\$ \$z\$는 모든 실수 값을 가질 수 있으므로 \$z=3\$일 때 최솟값은 \$11\$이다.

```
{"status": "EXEMPT", "reason": "두 일차방정식으로 x, y를 z로 나타낸 뒤 이차함수의 최솟값을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "두 일차식에서 $x=z-4, y=7-2z$로 한 문자 $z$로 통일한 뒤 $x^2+y^2+z^2=6(z-3)^2+11$의 최솟값을 구한다.", "decisiveStep": "세 변수 제곱합을 일변수 $z$의 이차함수로 환원해 완전제곱식 최솟값을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "두 일차 조건식으로 문자를 소거해 이차식 최솟값을 구하는 문항으로 H1-RPM-038(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부정연립일차방정식의 매개변수화로 이차식 최솟값을 구하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "$x^2+y^2+z^2$의 최솟값은"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "6(z-3)^2+11", "evidenceType": "IMPLIED", "justification": "x, y를 z의 식으로 소거한 뒤 이차식을 완전제곱식으로 변형해 최솟값을 구함"}], "given": [{"term": "실수", "src": "stem", "quote": "세 실수 $x, y, z$"}], "condition": []}, "reasons": {"method": "x, y를 z의 식으로 나타낸 뒤 완전제곱식으로 최솟값 11을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 서답형  
- 배점: 4

### 발문

이차방정식 \$3x^2-x+6=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라고 할 때, \$(\\alpha+2)(\\beta+2)\$의 값을 구하시오.

### 선지

없음

### 정답

\$\\dfrac{20}{3}\$

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=\\dfrac{1}{3}\$, \$\\alpha\\beta=\\dfrac{6}{3}=2\$이다. 따라서 \$\$ (\\alpha+2)(\\beta+2) \= \\alpha\\beta+2(\\alpha+\\beta)+4 \= 2+2\\cdot\\frac{1}{3}+4 \= \\frac{20}{3} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계로 합과 곱을 구해 전개 식에 대입하는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계 $\\alpha+\\beta=\\frac{1}{3}, \\alpha\\beta=2$를 전개식 $\\alpha\\beta+2(\\alpha+\\beta)+4$에 대입한다.", "decisiveStep": "$(\\alpha+2)(\\beta+2)$를 전개해 합과 곱으로 표현한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "근과 계수의 관계로 두 근의 대칭식 값을 구하는 문항으로 H1-RPM-029(DIRECT_BINDING_GAP)에 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계를 직접 적용하는 단답형 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $3x^2-x+6=0$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "전개", "src": "solution", "quote": "\\alpha\\beta+2(\\alpha+\\beta)+4"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 합과 곱을 구해 전개식 값을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q17

- 형식: 서답형  
- 배점: 5

### 발문

이차함수 \$f(x)\$가 모든 실수 \$x\$에 대하여 \$f(x-1)+2f(-x)=3x^2-6\$을 만족한다. \$x\$의 값의 범위가 \$1\\le x\\le 4\$일 때, 이 함수의 최댓값과 최솟값의 합을 구하시오.

### 선지

없음

### 정답

\$1\$

### 해설

\$f(x)=ax^2+bx+c\$ (\$a\\ne 0\$)라 두고 주어진 항등식에 대입하면 \$\$ \\begin{aligned} f(x-1)+2f(-x) &= a(x-1)^2+b(x-1)+c+2(ax^2-bx+c) \\ &= 3ax^2+(-2a-b)x+(a-b+3c) \= 3x^2-6 \\end{aligned} \$\$ 계수를 비교하면 \$3a=3, \-2a-b=0, a-b+3c=-6\$이므로 \$a=1, b=-2, c=-3\$이다. 따라서 \$f(x)=x^2-2x-3=(x-1)^2-4\$이고, 구간 \$1\\le x\\le 4\$에서

- 최솟값: \$f(1)=-4\$  
- 최댓값: \$f(4)=16-8-3=5\$ 그러므로 최댓값과 최솟값의 합은 \$5+(-4)=1\$이다.

```
{"status": "EXEMPT", "reason": "다항식 항등식 계수비교로 이차함수 f(x)를 결정한 뒤 제한 범위 최대·최소 합을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$f(x)=ax^2+bx+c$를 항등식에 대입해 $f(x)=x^2-2x-3$을 구하고 구간 $[1, 4]$의 최솟값 $-4$와 최댓값 $5$를 더한다.", "decisiveStep": "$f(x-1)+2f(-x)$를 내림차순 정리해 $3a=3, -2a-b=0, a-b+3c=-6$으로 계수를 확정한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "제한 구간 [1,4]에서 이차함수의 최댓값과 최솟값을 구하는 문항으로 H1-RPM-037(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수 항등식 계수비교와 제한 범위 이차함수 최대·최소를 결합한 단답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값과 최솟값의 합"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}], "condition": [{"term": "항등식", "src": "solution", "quote": "주어진 항등식에"}]}, "reasons": {"method": "항등식 계수비교로 f(x)를 구한 뒤 [1, 4] 최대·최소의 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 서답형  
- 배점: 6

### 발문

다항식 \$f(x)=1+x+x^2+x^3+\\cdots+x^{1010}\$이다. \$f\\left(\\dfrac{\\sqrt{3}+i}{\\sqrt{3}-i}\\right)\$의 값을 유리수 \$a, b, c, d\$에 대하여 \$a+b\\sqrt{3}+i(c+d\\sqrt{3})\$로 나타낼 때, \$80\\left(\\dfrac{a}{2}+b\\right)^2+20\\left(c+\\dfrac{d}{2}\\right)^2\$의 값을 구하시오.

### 선지

없음

### 정답

\$25\$

### 해설

\$z=\\dfrac{\\sqrt{3}+i}{\\sqrt{3}-i}\$의 분모를 실수화하면 \$\$ z \= \\frac{(\\sqrt{3}+i)^2}{3+1} \= \\frac{2+2\\sqrt{3}i}{4} \= \\frac{1+\\sqrt{3}i}{2} \$\$ \$2z-1=\\sqrt{3}i\$의 양변을 제곱하면 \$4z^2-4z+4=0 \\implies z^2-z+1=0\$이다. 양변에 \$z+1\$을 곱하면 \$z^3+1=0\$, 즉 \$z^3=-1, z^6=1\$이고 \$1+z+z^2+z^3+z^4+z^5=0\$이다. \$f(z)\$는 \$z^0\$부터 \$z^{1010}\$까지 총 \$1011\$개 항의 합이고 \$1011=6\\times 168+3\$이므로 \$\$ f(z) \= 1+z+z^2 \= 1+\\frac{1+\\sqrt{3}i}{2}+\\frac{-1+\\sqrt{3}i}{2} \= 1+\\sqrt{3}i \$\$ 따라서 \$a=1, b=0, c=0, d=1\$이므로 \$\$ 80\\left(\\frac{1}{2}+0\\right)^2+20\\left(0+\\frac{1}{2}\\right)^2 \= 80\\cdot\\frac{1}{4}+20\\cdot\\frac{1}{4} \= 20+5 \= 25 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수 z=(√3+i)/(√3-i)의 주기 6 성질을 이용해 1011개 항의 합을 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모 실수화로 $z=\\frac{1+\\sqrt{3}i}{2}$를 얻고 $z^3=-1$($z^6=1$)의 $6$주기 합 $0$을 이용해 $1011$항의 합 $1+z+z^2=1+\\sqrt{3}i$를 구한다.", "decisiveStep": "$1011=6\\times 168+3$이므로 앞의 $3$항 $1+z+z^2$만 남음을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "복소수 z의 6주기(z^3=-1, z^6=1) 성질을 이용하는 문항으로 H1-RPM-025(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 분수식의 주기 $6$ 성질과 등비급수 꼴 소거를 결합한 단답형 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "유리수", "src": "stem", "quote": "유리수 $a, b, c, d$에 대하여"}], "method": [{"term": "복소수", "src": "solution", "quote": "z^3=-1, z^6=1$이고", "evidenceType": "IMPLIED", "justification": "분모 실수화 후 z^2-z+1=0에서 6주기 합이 0임을 이용해 남은 3항을 계산함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)=1+x+x^2+x^3+\\cdots+x^{1010}$"}], "condition": []}, "reasons": {"method": "분모 실수화로 z^6=1 주기를 도출해 1011개 항의 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 10

### 발문

제1사분면 위의 두 점 \$A, D\$가 이차함수 \$y=-x^2+10x\$의 그래프 위에 놓여 있고 변 \$BC\$가 \$x\$축 위에 놓여 있는 직사각형 \$ABCD\$의 둘레의 길이가 최대일 때, 점 \$P(a, 0)\$은 변 \$BC\$ 위를 움직이고 있다. \$a+b=8\$을 만족시키는 실수 \$a, b\$에 대하여 \$2a^2+4b^2\$의 최솟값을 구하시오.

### 선지

없음

### 정답

\$\\dfrac{256}{3}\$

### 해설

\$y=-x^2+10x=-(x-5)^2+25\$의 대칭축이 \$x=5\$이고 \$x\$절편이 \$0, 10\$이므로, 점 \$B\$의 좌표를 \$(t, 0)\$ (\$0\<t\<5\$)라 하면 \$C(10-t, 0)\$이고 \$A(t, \-t^2+10t)\$이다. 직사각형 \$ABCD\$의 둘레의 길이 \$L\$은 \$\$ L \= 2{(10-2t)+(-t^2+10t)} \= \-2t^2+16t+20 \= \-2(t-4)^2+52 \$\$ 따라서 \$t=4\$일 때 둘레가 최대이고, 이때 변 \$BC\$는 \$B(4, 0)\$과 \$C(6, 0)\$을 잇는 선분이므로 \$4\\le a\\le 6\$이다. \$a+b=8\$에서 \$b=8-a\$를 대입하면 \$\$ 2a^2+4b^2 \= 2a^2+4(8-a)^2 \= 6a^2-64a+256 \= 6\\left(a-\\frac{16}{3}\\right)^2+\\frac{256}{3} \$\$ 꼭짓점 \$a=\\dfrac{16}{3}=5.\\overline{3}\$이 범위 \$4\\le a\\le 6\$에 포함되므로 구하는 최솟값은 \$\\dfrac{256}{3}\$이다.

```
{"status": "EXEMPT", "reason": "포물선에 내접하는 직사각형의 최대 둘레 위치로 a의 범위를 확정한 뒤 2a^2+4b^2의 최솟값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "둘레의 최댓값을 주는 $t$로 변 $BC$ 위의 $a$ 범위를 확정한 뒤 $b=8-a$를 대입해 이차식 $2a^2+4b^2$의 최솟값을 구한다.", "decisiveStep": "둘레가 최대일 때의 꼭짓점 $t$로 $a$의 제한 범위를 먼저 결정하고 그 안에 $2a^2+4(8-a)^2$의 축이 포함되는지 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "포물선 내접 직사각형 둘레 최대와 조건식 활용 이차식 최솟값 문항으로 H1-RPM-038(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수 내접 직사각형 둘레 최대화와 제한 범위 이차식 최솟값을 결합한 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "$2a^2+4b^2$의 최솟값을"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2+10x$", "evidenceType": "IMPLIED", "justification": "대칭성으로 둘레 이차함수를 세워 a의 범위를 구하고 2a^2+4(8-a)^2의 최솟값을 구함"}], "given": [{"term": "직사각형", "src": "stem", "quote": "직사각형 $ABCD$의"}], "condition": []}, "reasons": {"method": "내접 직사각형 둘레 최대로 a 범위를 구하고 2a^2+4(8-a)^2 최솟값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 서답형  
- 배점: 10

### 발문

함수 \$f(x)\$와 함수 \$g(x)\$가 다음과 같다. \$f(x)=-x+k\$, \$g(x)=\\begin{cases} \-x^2+9x-14 & (2\\le x\\le 7\) \\ x^2-9x+14 & (x\<2\\text{ 또는 }x\>7) \\end{cases}\$ 함수 \$y=f(x)\$와 함수 \$y=g(x)\$의 그래프가 서로 다른 세 점에서 만날 때 세 점을 \$x\$좌표가 작은 것부터 차례로 \$A, B, C\$라 하고, \$y=g(x)\$의 그래프가 \$x\$축과 만나는 점을 \$x\$좌표가 작은 것부터 차례로 \$P, Q\$라고 하자. 이때 삼각형 \$ABP\$의 넓이가 최대가 되도록 하는 \$k\$의 값과 그때의 삼각형 \$ABP\$의 넓이의 합을 구하시오.

### 선지

없음

### 정답

\$\\dfrac{31+9\\sqrt{13}}{2}\$

### 해설

\$x^2-9x+14=(x-2)(x-7)=0\$이므로 \$P(2, 0)\$, \$Q(7, 0)\$이다. 직선 \$y=-x+k\$가 \$y=g(x)\$와 서로 다른 세 점에서 만나는 경우는 다음 두 가지뿐이다.

1) 직선이 \$Q(7, 0)\$을 지날 때: \$k=7\$이고 교점은 \$A(1, 6), B(3, 4), C(7, 0)\$이다. 이때 \$\\triangle ABP\$의 넓이는 \$\\dfrac{1}{2}\|(1-2)(4-0)-(3-2)(6-0)\| \= 5\$이다.  
2) 직선이 \$2\\le x\\le 7\$ 구간에서 \$y=-x^2+9x-14\$에 접할 때: \$-x^2+9x-14=-x+k \\iff x^2-10x+k+14=0\$의 판별식 \$D/4=25-(k+14)=0\$에서 \$k=11\$이고 접점은 \$B(5, 6)\$이다. 또한 \$x\<2\$ 또는 \$x\>7\$에서 \$x^2-9x+14=-x+11 \\iff x^2-8x+3=0\$이므로 \$A(4-\\sqrt{13}, 7+\\sqrt{13})\$, \$C(4+\\sqrt{13}, 7-\\sqrt{13})\$이다. 두 점 \$A, B\$는 직선 \$x+y-11=0\$ 위에 있으므로  
- \$\\overline{AB} \= \\sqrt{2}{5-(4-\\sqrt{13})} \= \\sqrt{2}(1+\\sqrt{13})\$  
- 점 \$P(2, 0)\$과 직선 \$x+y-11=0\$ 사이의 거리 \$h \= \\dfrac{\|2+0-11\|}{\\sqrt{2}} \= \\dfrac{9}{\\sqrt{2}}\$ 따라서 \$\\triangle ABP\$의 넓이는 \$\\dfrac{1}{2}\\cdot\\sqrt{2}(1+\\sqrt{13})\\cdot\\dfrac{9}{\\sqrt{2}} \= \\dfrac{9+9\\sqrt{13}}{2} \> 5\$이다. 그러므로 넓이가 최대일 때 \$k=11\$, 넓이는 \$\\dfrac{9+9\\sqrt{13}}{2}\$이고, 합은 \$11+\\dfrac{9+9\\sqrt{13}}{2}=\\dfrac{31+9\\sqrt{13}}{2}\$이다.

```
{"status": "EXEMPT", "reason": "접선 및 x절편 통과 조건으로 직선과 구간별 이차함수의 3교점 경우를 나누어 삼각형 넓이 최댓값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "직선 $y=-x+k$가 $y=g(x)$와 $3$점에서 만나는 두 경우($k=7$ 통과, $k=11$ 접선)를 구해 각각의 $\\triangle ABP$ 넓이를 비교한다.", "decisiveStep": "$k=11$ 접선일 때 $A, B$ 사이의 거리와 점 $P(2,0)$까지의 직선 거리로 $\\triangle ABP$ 넓이 $\\frac{9+9\\sqrt{13}}{2}$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "접선 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "구간별 이차함수와 직선의 3교점 및 접선 조건을 활용하는 문항으로 H1-RPM-036(DIRECT_ACTIVE)에 직접 매핑됨"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 이차함수와 직선의 교점 개수 조건 분류 및 삼각형 넓이 비교를 결합한 최고난도 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "넓이가 최대가 되도록"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D/4=25-(k+14)=0$", "evidenceType": "NAMED"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $ABP$의 넓이"}], "condition": [{"term": "교점", "src": "solution", "quote": "교점은 $A(1, 6), B(3, 4), C(7, 0)$"}]}, "reasons": {"method": "3교점 조건(k=7, k=11)으로 교점을 구하고 각 삼각형 ABP 넓이를 비교함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

