

```
{"stem": "19_금당고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/19_금당고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100.9, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 3.8

### 발문

두 다항식 \$A=3x^2+4xy-2\$, \$B=3x^2+xy+5\$에 대하여 \$A-B\$를 구하시오.

### 선지

① \$3xy+3\$ ② \$3xy-7\$ ③ \$3xy+7\$ ④ \$5xy-7\$ ⑤ \$5xy+3\$

### 정답

②

### 해설

두 번째 다항식의 부호를 바꾸어 동류항끼리 정리하면 \$\$ A-B \= (3x^2+4xy-2)-(3x^2+xy+5) \= (3-3)x^2+(4-1)xy+(-2-5) \= 3xy-7 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 이차다항식의 뺄셈을 동류항 정리로 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "괄호 앞의 음수 부호를 $B$의 모든 항에 분배해 동류항끼리 뺀다.", "decisiveStep": "$x^2$항이 소거되고 상수항이 $-2-5=-7$임을 정확히 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json(H1-RPM-002, DIRECT_ACTIVE): 두 다항식의 뺄셈에서 동류항을 정리하는 직접 연산 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식의 뺄셈에서 부호 분배와 동류항 계산을 바로 수행하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=3x^2+4xy-2$"}], "method": [{"term": "동류항", "src": "solution", "quote": "동류항끼리 정리하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 다항식 $A=3x^2+4xy-2$"}], "condition": []}, "reasons": {"method": "괄호를 풀어 동류항끼리 정리해 3xy-7을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$P(x)=3x^3-4x^2+5x-2\$를 \$x-2\$로 나누었을 때, 나머지를 구하시오.

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

④

### 해설

나머지정리에 의하여 \$P(x)\$를 \$x-2\$로 나눈 나머지는 \$P(2)\$이므로 \$\$ P(2) \= 3\\cdot 2^3-4\\cdot 2^2+5\\cdot 2-2 \= 24-16+10-2 \= 16 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "나머지정리 P(2)를 한 번 적용해 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리에 따라 $P(x)$에 $x=2$를 대입해 나머지 $P(2)=16$을 구한다.", "decisiveStep": "일차식 $x-2$로 나눈 나머지가 $P(2)$임을 바로 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json(H1-RPM-009, RPM_ONLY): 일차식 x-2로 나눈 나머지를 나머지정리 P(2)로 구하는 문항으로 현재 ACTIVE 대응 키 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리를 한 번 직접 적용해 함숫값을 계산하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 구하시오"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)=3x^3-4x^2+5x-2$"}], "condition": []}, "reasons": {"method": "나머지정리 P(2)를 계산해 16을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$x^4-10x^2+9\$를 인수분해하면 \$(x+a)(x+b)(x+c)(x+d)\$이다. 상수 \$a, b, c, d\$에 대하여 \$\\dfrac{ab+cd}{2}\$의 값은? (단, \$a\<b\<c\<d\$)

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

①

### 해설

\$x^4-10x^2+9=(x^2-9)(x^2-1)=(x-3)(x+3)(x-1)(x+1)\$이다. \$a\<b\<c\<d\$이므로 \$a=-3, b=-1, c=1, d=3\$이다. 따라서 \$\\dfrac{ab+cd}{2} \= \\dfrac{(-3)(-1)+1\\cdot 3}{2} \= \\dfrac{3+3}{2} \= 3\$이다.

```
{"status": "EXEMPT", "reason": "복이차식을 두 번 합차 공식으로 인수분해해 대소 순서에 맞게 상수를 결정하는 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$x^4-10x^2+9=(x^2-9)(x^2-1)$을 합차 공식으로 네 일차식으로 분해해 $a<b<c<d$ 순서로 값을 짝짓는다.", "decisiveStep": "대소 조건 $a<b<c<d$에 맞춰 $-3, -1, 1, 3$을 차례로 대응시킨다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "합과 차"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json(H1-RPM-016, DIRECT_ACTIVE): 복이차식을 합차 공식으로 연속 인수분해하는 표준 인수분해 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복이차식 인수분해와 합차 공식을 연속 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b, c, d$에 대하여"}], "method": [{"term": "인수분해", "src": "stem", "quote": "인수분해하면", "evidenceType": "IMPLIED", "justification": "x^2을 한 문자로 보고 인수분해한 뒤 합차 공식을 연속 적용함"}], "given": [{"term": "복이차식", "src": "stem", "quote": "다항식 $x^4-10x^2+9$"}], "condition": []}, "reasons": {"method": "복이차식을 네 일차식으로 인수분해해 (ab+cd)/2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 4

### 발문

\$i^4+3i^5+4i^6+3i^7+i^8\$을 계산하시오. (단, \$i=\\sqrt{-1}\$)

### 선지

① \$0\$ ② \$-1\$ ③ \$-2\$ ④ \$1\$ ⑤ \$2\$

### 정답

③

### 해설

\$i^4=1, i^5=i, i^6=-1, i^7=-i, i^8=1\$이므로 \$\$ i^4+3i^5+4i^6+3i^7+i^8 \= 1+3i+4(-1)+3(-i)+1 \= (1-4+1)+(3i-3i) \= \-2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "허수단위 i의 거듭제곱 주기 4를 이용해 대수합을 계산하는 순수 연산 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$i^4=1, i^5=i, i^6=-1, i^7=-i, i^8=1$을 대입해 실수부와 허수부끼리 합산한다.", "decisiveStep": "허수부 $3i-3i=0$이 소거되고 실수부 $1-4+1=-2$만 남음을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json(H1-RPM-025, DIRECT_ACTIVE): 허수단위 i의 거듭제곱 주기성으로 대수합을 계산하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허수단위 $i$의 거듭제곱 값을 바로 대입해 정리하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허수", "src": "stem", "quote": "i=\\sqrt{-1}"}], "method": [{"term": "거듭제곱", "src": "stem", "quote": "$i^4+3i^5+4i^6+3i^7+i^8$", "evidenceType": "IMPLIED", "justification": "허수단위 i의 거듭제곱 주기 4 성질을 대입해 실수부와 허수부를 정리함"}], "given": [{"term": "허수", "src": "stem", "quote": "i=\\sqrt{-1}"}], "condition": []}, "reasons": {"method": "i의 거듭제곱 값을 대입해 -2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차방정식 \$x^2-(2k+1)x+k^2+4=0\$이 허근을 갖도록 하는 모든 자연수 \$k\$의 값의 곱은?

### 선지

① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$

### 정답

⑤

### 해설

이차방정식이 허근을 가지므로 판별식 \$D\<0\$이어야 한다. \$\$ D \= {-(2k+1)}^2-4(k^2+4) \= 4k^2+4k+1-4k^2-16 \= 4k-15 \< 0 \\implies k \< \\dfrac{15}{4} \= 3.75 \$\$ 자연수 \$k\$는 \$1, 2, 3\$이므로 모든 자연수 \$k\$의 값의 곱은 \$1\\cdot 2\\cdot 3=6\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 허근 조건 D<0으로 자연수 k의 곱을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "판별식 $D=(2k+1)^2-4(k^2+4)=4k-15<0$을 풀어 자연수 $k=1, 2, 3$의 곱을 구한다.", "decisiveStep": "$k^2$항이 소거된 일차부등식 $4k-15<0$에서 자연수 $1, 2, 3$을 모두 찾는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json(H1-RPM-028, DIRECT_ACTIVE): 이차방정식의 허근 조건을 판별식 D<0으로 판정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "허근 조건에 판별식 $D<0$을 적용해 자연수 해를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "모든 자연수 $k$의 값의 곱은"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D<0$이어야 한다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-(2k+1)x+k^2+4=0$"}], "condition": [{"term": "허근", "src": "stem", "quote": "허근을 갖도록 하는"}]}, "reasons": {"method": "판별식 D<0으로 k<15/4를 구해 자연수 1, 2, 3의 곱 6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 4

### 발문

이차방정식 \$x^2+5x+4=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\alpha^2+\\beta^2\$의 값은?

### 선지

① \$15\$ ② \$17\$ ③ \$19\$ ④ \$21\$ ⑤ \$25\$

### 정답

②

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=-5\$, \$\\alpha\\beta=4\$이므로 \$\$ \\alpha^2+\\beta^2 \= (\\alpha+\\beta)^2-2\\alpha\\beta \= (-5)^2-2\\cdot 4 \= 25-8 \= 17 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 근과 계수의 관계와 곱셈 공식 변형으로 제곱의 합을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "근과 계수의 관계로 $\\alpha+\\beta=-5, \\alpha\\beta=4$를 구해 $\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta$에 대입한다.", "decisiveStep": "합과 곱을 이용해 제곱의 합 $17$을 바로 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json(H1-RPM-029, DIRECT_BINDING_GAP): 근과 계수의 관계로 대칭식 alpha^2+beta^2의 값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계와 제곱합 곱셈 공식 변형을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "stem", "quote": "$\\alpha^2+\\beta^2$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+5x+4=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계와 제곱합 변형 공식으로 17을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q07

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$x^2-2(k-3)x+k^2-15=0\$이 서로 다른 두 실근을 가질 때, 실수 \$k\$의 값의 범위는?

### 선지

① \$k\<4\$ ② \$k\\le 4\$ ③ \$k\>4\$ ④ \$k\<3\$ ⑤ \$k\>3\$

### 정답

①

### 해설

서로 다른 두 실근을 가지므로 판별식 \$D\>0\$이다. \$\$ \\dfrac{D}{4} \= (k-3)^2-(k^2-15) \= \-6k+24 \> 0 \\implies k \< 4 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "서로 다른 두 실근 조건 D>0으로 k의 범위를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 $\\frac{D}{4}=(k-3)^2-(k^2-15)=-6k+24>0$을 풀어 $k<4$를 구한다.", "decisiveStep": "$k^2$이 소거된 일차부등식 $-6k+24>0$에서 음수 $-6$으로 나누어 부등호 방향을 바꾼다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json(H1-RPM-028, DIRECT_ACTIVE): 서로 다른 두 실근 조건을 짝수 판별식 D/4>0으로 판정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "서로 다른 두 실근 조건에 짝수 판별식 $D/4>0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "범위", "src": "stem", "quote": "실수 $k$의 값의 범위는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2(k-3)x+k^2-15=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근을 가질 때"}]}, "reasons": {"method": "짝수 판별식 D/4>0을 풀어 k<4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차방정식 \$x^2-2(a+k)x+k^2-8k-4a=0\$이 실수 \$k\$의 값에 관계없이 항상 중근을 가질 때, 실수 \$a\$의 값은?

### 선지

① \$-8\$ ② \$-6\$ ③ \$-5\$ ④ \$-4\$ ⑤ \$-2\$

### 정답

④

### 해설

판별식 \$\\dfrac{D}{4}=0\$이 \$k\$에 대한 항등식이어야 하므로 \$\$ \\dfrac{D}{4} \= (a+k)^2-(k^2-8k-4a) \= (2a+8)k+(a^2+4a) \= 0 \$\$ 따라서 \$2a+8=0\$, \$a^2+4a=0\$이므로 \$a=-4\$이다.

```
{"status": "EXEMPT", "reason": "중근 판별식이 k에 대한 항등식이 되도록 실수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 $\\frac{D}{4}=(2a+8)k+(a^2+4a)=0$을 $k$에 대한 항등식으로 풀어 $a=-4$를 구한다.", "decisiveStep": "$k$의 계수 $2a+8=0$과 상수항 $a^2+4a=0$을 동시에 만족하는 $a=-4$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "계수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_PARAMETER_IDENTITY", "why": "high1.json(H1-RPM-032, FAMILY_BINDING_GAP): 판별식 D/4=0이 매개변수 k에 대한 항등식이 되도록 계수를 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 판별식과 $k$에 대한 항등식 계수 비교를 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $\\dfrac{D}{4}=0$이", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-2(a+k)x+k^2-8k-4a=0$"}], "condition": [{"term": "중근", "src": "stem", "quote": "항상 중근을 가질 때"}]}, "reasons": {"method": "판별식 D/4=0을 k에 대한 항등식으로 풀어 a=-4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q09

- 형식: 객관식  
- 배점: 4.6

### 발문

이차방정식 \$x^2+6x+4=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$(\\sqrt{\\alpha}+\\sqrt{\\beta})^2\$의 값은?

### 선지

① \$-6\$ ② \$-8\$ ③ \$-10\$ ④ \$-12\$ ⑤ \$-14\$

### 정답

③

### 해설

두 근은 \$x=-3\\pm\\sqrt{5}\$로 모두 음수이고, 근과 계수의 관계에서 \$\\alpha+\\beta=-6, \\alpha\\beta=4\$이다. \$\\alpha\<0, \\beta\<0\$이므로 \$\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}=-2\$이다. 따라서 \$(\\sqrt{\\alpha}+\\sqrt{\\beta})^2=\\alpha+\\beta+2\\sqrt{\\alpha}\\sqrt{\\beta}=-6+2(-2)=-10\$이다.

```
{"status": "EXEMPT", "reason": "두 근이 모두 음수임을 확인하고 음수 제곱근 곱의 성질로 식의 값을 구하는 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 근이 모두 음수임을 확인한 뒤 $\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}=-2$를 이용해 $(\\sqrt{\\alpha}+\\sqrt{\\beta})^2$을 계산한다.", "decisiveStep": "$\\alpha<0, \\beta<0$일 때 $\\sqrt{\\alpha}\\sqrt{\\beta}=-\\sqrt{\\alpha\\beta}$의 부호를 정확히 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json(H1-RPM-029, DIRECT_BINDING_GAP): 두 음수 근의 합과 곱에 음수 제곱근 곱의 성질을 결합한 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식 두 근의 부호 판정과 음수의 제곱근 곱셈 성질을 결합한 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "음수", "src": "solution", "quote": "모두 음수이고"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에서", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+6x+4=0$"}], "condition": []}, "reasons": {"method": "두 근의 음수 부호를 확인해 음수 제곱근 곱의 성질을 적용함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q10

- 형식: 객관식  
- 배점: 3.8

### 발문

이차방정식 \$5x^2-x+1=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\dfrac{1}{\\alpha}, \\dfrac{1}{\\beta}\$을 두 근으로 하고 \$x^2\$의 계수가 \$1\$인 이차방정식은?

### 선지

① \$x^2+x-5=0\$ ② \$x^2-5x+1=0\$ ③ \$x^2+x+5=0\$ ④ \$x^2-\\dfrac{1}{5}x+1=0\$ ⑤ \$x^2-x+5=0\$

### 정답

⑤

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=\\dfrac{1}{5}\$, \$\\alpha\\beta=\\dfrac{1}{5}\$이다. 따라서 \$\\dfrac{1}{\\alpha}+\\dfrac{1}{\\beta}=\\dfrac{\\alpha+\\beta}{\\alpha\\beta}=1\$, \$\\dfrac{1}{\\alpha}\\cdot\\dfrac{1}{\\beta}=\\dfrac{1}{\\alpha\\beta}=5\$이므로 구하는 이차방정식은 \$x^2-x+5=0\$이다.

```
{"status": "EXEMPT", "reason": "근과 계수의 관계로 역수 근의 합과 곱을 구해 이차방정식을 세우는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha+\\beta=\\frac{1}{5}, \\alpha\\beta=\\frac{1}{5}$에서 역수 근의 합 $1$과 곱 $5$를 구해 $x^2-x+5=0$을 작성한다.", "decisiveStep": "역수 근의 합 $\\frac{\\alpha+\\beta}{\\alpha\\beta}=1$과 곱 $\\frac{1}{\\alpha\\beta}=5$를 바로 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json(H1-RPM-030, DIRECT_BINDING_GAP): 역수 근의 합과 곱으로 새 이차방정식을 구성하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계로 역수 근을 갖는 이차방정식을 작성하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "계수가 $1$인 이차방정식은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $5x^2-x+1=0$"}], "condition": []}, "reasons": {"method": "근과 계수의 관계로 역수 근의 합과 곱을 구해 이차방정식을 작성함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

자연수 \$n\$에 대하여 복소수 \$z\_n=\\left(\\dfrac{\\sqrt{2}i}{1-i}\\right)^n\$이라 할 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? (단, \$i=\\sqrt{-1}\$)

\<보기\> ㄱ. \$z\_2=-i\$ ㄴ. \$z\_6=-z\_2\$ ㄷ. \$z\_{n+8}-z\_n=0\$

### 선지

① ㄱ ② ㄱ, ㄴ, ㄷ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄴ, ㄷ

### 정답

②

### 해설

\$w=\\dfrac{\\sqrt{2}i}{1-i}=\\dfrac{\\sqrt{2}i(1+i)}{(1-i)(1+i)}=\\dfrac{\\sqrt{2}(-1+i)}{2}=\\dfrac{-1+i}{\\sqrt{2}}\$이므로 \$w^2=\\dfrac{1-2i-1}{2}=-i\$이다.

- ㄱ. \$z\_2=w^2=-i\$ (참)  
- ㄴ. \$w^4=(-i)^2=-1\$이므로 \$z\_6=w^4w^2=(-1)(-i)=i=-z\_2\$ (참)  
- ㄷ. \$w^8=(w^4)^2=1\$이므로 \$z\_{n+8}-z\_n=w^n(w^8-1)=0\$ (참) 따라서 옳은 것은 ㄱ, ㄴ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "복소수 분모 실수화 후 w^2=-i, w^8=1 성질로 ㄱ, ㄴ, ㄷ을 판정하는 합답형 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모 실수화로 $w=\\frac{-1+i}{\\sqrt{2}}$를 얻고 $w^2=-i, w^4=-1, w^8=1$을 이용해 ㄱ, ㄴ, ㄷ을 판정한다.", "decisiveStep": "$w^2=-i$에서 주기 $8$ ($w^8=1$)을 도출해 세 보기를 한 번에 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json(H1-RPM-025, DIRECT_ACTIVE): 복소수 분모 실수화 후 w^2=-i, w^8=1 주기성으로 보기를 판정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 나눗셈과 제곱을 통한 주기 $8$ 순환성 판정 합답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $z_n=\\left(\\dfrac{\\sqrt{2}i}{1-i}\\right)^n$"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "\\dfrac{\\sqrt{2}i(1+i)}{(1-i)(1+i)}", "evidenceType": "IMPLIED", "justification": "분모의 켤레복소수 1+i를 곱해 실수화한 뒤 거듭제곱의 주기성을 판정함"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z_n=\\left(\\dfrac{\\sqrt{2}i}{1-i}\\right)^n$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $n$에 대하여"}]}, "reasons": {"method": "분모 실수화 후 w^2=-i, w^8=1로 ㄱ, ㄴ, ㄷ을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

이차방정식 \$x^2+4x-3=0\$의 두 실근을 \$\\alpha, \\beta\$라 할 때, \$\\dfrac{8\\beta}{\\alpha^2+4\\alpha-5}+\\dfrac{8\\alpha}{\\beta^2+4\\beta-5}\$의 값은?

### 선지

① \$10\$ ② \$12\$ ③ \$14\$ ④ \$16\$ ⑤ \$18\$

### 정답

④

### 해설

\$\\alpha, \\beta\$는 \$x^2+4x-3=0\$의 두 근이므로 \$\\alpha^2+4\\alpha=3\$, \$\\beta^2+4\\beta=3\$이다. 따라서 두 분모는 모두 \$3-5=-2\$이므로 \$\$ \\dfrac{8\\beta}{-2}+\\dfrac{8\\alpha}{-2} \= \-4(\\alpha+\\beta) \= \-4(-4) \= 16 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차방정식 근의 성질로 분모를 상수 -2로 줄인 뒤 근과 계수의 관계로 합을 구하는 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha^2+4\\alpha=3, \\beta^2+4\\beta=3$을 분모에 대입해 $-2$로 만든 뒤 근과 계수의 관계 $\\alpha+\\beta=-4$를 적용한다.", "decisiveStep": "분모 $\\alpha^2+4\\alpha-5$에서 $\\alpha^2+4\\alpha=3$을 통째로 치환해 상수로 줄인다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json(H1-RPM-029, DIRECT_BINDING_GAP): 근 대입으로 분모를 축약한 뒤 근과 계수의 관계로 합을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "방정식의 근 대입으로 이차 분모를 상수로 줄인 뒤 근과 계수의 관계를 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "-4(\\alpha+\\beta)"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "-4(\\alpha+\\beta) = -4(-4) = 16", "evidenceType": "IMPLIED", "justification": "근 대입으로 분모를 -2로 줄인 뒤 근과 계수의 관계 alpha+beta=-4를 대입함"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+4x-3=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "두 실근을 $\\alpha, \\beta$라 할 때"}]}, "reasons": {"method": "방정식 근 대입으로 분모를 -2로 줄인 뒤 근의 합을 대입함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

다음 그림과 같이 이차함수 \$y=x^2+mx+5\$의 그래프와 직선 \$y=2x+n\$의 두 교점의 \$x\$좌표가 각각 \$2, 3\$일 때, 실수 \$m, n\$에 대하여 \$m\\times n\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$8\$

### 정답

①

### 해설

두 그래프의 교점의 \$x\$좌표가 \$2, 3\$이므로 이차방정식 \$x^2+mx+5=2x+n\$, 즉 \$\$ x^2+(m-2)x+(5-n) \= (x-2)(x-3) \= x^2-5x+6 \$\$ 이다. 계수를 비교하면 \$m-2=-5 \\implies m=-3\$, \$5-n=6 \\implies n=-1\$이므로 \$m\\times n=(-3)(-1)=3\$이다.

```
{"status": "READY", "pattern": "piecewise-polynomial-spike-v1", "viewBox": "0 0 340 260", "elements": [{"type": "curve", "id": "parabola_f", "expr": "x**2 - 3*x + 5", "domain": [0, 4.5], "label": "$y=x^2+mx+5$"}, {"type": "line", "id": "line_g", "expr": "2*x - 1", "domain": [0, 4.5], "label": "$y=2x+n$"}, {"type": "point", "coords": [2, 3], "label": "$2$", "projX": true}, {"type": "point", "coords": [3, 5], "label": "$3$", "projX": true}], "note": "이차함수 y=x^2+mx+5와 직선 y=2x+n이 x=2, 3에서 만나는 그래프"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $x^2+(m-2)x+(5-n)=0$을 $(x-2)(x-3)=x^2-5x+6$과 계수 비교하여 $m, n$을 구한다.", "decisiveStep": "두 교점의 $x$좌표를 연립 이차방정식의 두 근으로 두고 계수를 비교한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json(H1-RPM-035, DIRECT_ACTIVE): 포물선과 직선의 교점 x좌표를 연립이차방정식의 두 근으로 두고 계수를 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 교점 좌표를 이용해 미정계수를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $m, n$에 대하여"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+mx+5$"}], "condition": []}, "reasons": {"method": "연립방정식을 (x-2)(x-3)과 계수 비교해 m, n을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$f(x)=x^2+ax+b\$의 그래프는 직선 \$x=3\$에 대하여 대칭이다. \$1\\le x\\le 4\$에서 함수 \$f(x)\$의 최댓값이 \$10\$일 때, \$a+b\$의 값은? (단, \$a, b\$는 상수)

### 선지

① \$7\$ ② \$8\$ ③ \$9\$ ④ \$10\$ ⑤ \$11\$

### 정답

③

### 해설

대칭축이 \$x=3\$이므로 \$-\\dfrac{a}{2}=3 \\implies a=-6\$이고, \$f(x)=x^2-6x+b=(x-3)^2+b-9\$이다. 구간 \$1\\le x\\le 4\$에서 축 \$x=3\$으로부터 더 먼 끝점은 \$x=1\$이므로 최댓값은 \$f(1)=4+b-9=b-5\$이다. \$b-5=10\$에서 \$b=15\$이므로 \$a+b=-6+15=9\$이다.

```
{"status": "EXEMPT", "reason": "이차함수의 대칭축으로 a를 구하고 제한 구간 최댓값으로 b를 결정하는 순수 함수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "축 $x=3$에서 $a=-6$을 구한 뒤 구간 $[1, 4]$에서 축에서 더 먼 $x=1$의 함숫값 $b-5=10$으로 $b=15$를 구한다.", "decisiveStep": "축 $x=3$과의 거리가 $x=1$에서 $2$, $x=4$에서 $1$이므로 $f(1)$이 최댓값임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json(H1-RPM-037, DIRECT_ACTIVE): 대칭축 x=3과 제한 구간 [1, 4]의 최댓값 조건을 적용하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭축 조건과 제한 구간 최댓값 조건을 순차적으로 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "함수 $f(x)$의 최댓값이 $10$일 때"}], "method": [{"term": "축", "src": "solution", "quote": "대칭축이 $x=3$이므로", "evidenceType": "IMPLIED", "justification": "대칭축 x=3으로 a를 구하고 축에서 가장 먼 x=1에서 최댓값 조건을 적용함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2+ax+b$"}], "condition": [{"term": "범위", "src": "stem", "quote": "$1\\le x\\le 4$에서"}]}, "reasons": {"method": "대칭축 x=3으로 a=-6을 구하고 f(1)=10으로 b=15를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

아래 그림과 같이 유리수 \$a, b\$에 대하여 두 이차함수 \$y=x^2-4x+2\$와 \$y=-x^2+ax+b\$의 그래프가 만나는 두 점을 각각 \$P, Q\$라 하자. 점 \$P\$의 \$x\$좌표가 \$2-\\sqrt{3}\$일 때, \$a+b\$의 값은?

### 선지

① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$

### 정답

⑤

### 해설

두 이차함수의 교점의 \$x\$좌표는 \$x^2-4x+2=-x^2+ax+b\$, 즉 \$2x^2-(4+a)x+(2-b)=0\$의 근이다. \$a, b\$가 유리수이므로 계수가 유리수이고, 한 근이 \$2-\\sqrt{3}\$이면 다른 한 근은 \$2+\\sqrt{3}\$이다. 근과 계수의 관계에 의하여 \$\$ (2-\\sqrt{3})+(2+\\sqrt{3}) \= 4 \= \\dfrac{4+a}{2} \\implies a \= 4 \$\$ \$\$ (2-\\sqrt{3})(2+\\sqrt{3}) \= 1 \= \\dfrac{2-b}{2} \\implies b \= 0 \$\$ 이므로 \$a+b=4+0=4\$이다.

```
{"status": "READY", "pattern": "piecewise-polynomial-spike-v1", "viewBox": "0 0 340 260", "elements": [{"type": "curve", "id": "parabola_1", "expr": "x**2 - 4*x + 2", "domain": [-0.5, 4.5], "label": "$y=x^2-4x+2$"}, {"type": "curve", "id": "parabola_2", "expr": "-x**2 + 4*x", "domain": [-0.5, 4.5], "label": "$y=-x^2+ax+b$"}, {"type": "point", "coords": [0.268, 1.0], "label": "$P$"}, {"type": "point", "coords": [3.732, 1.0], "label": "$Q$"}], "note": "두 이차함수 y=x^2-4x+2와 y=-x^2+ax+b가 두 점 P, Q에서 만나는 그래프"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $2x^2-(4+a)x+(2-b)=0$의 계수가 유리수이므로 켤레근 $2+\\sqrt{3}$을 확정하고 근과 계수의 관계를 적용한다.", "decisiveStep": "유리수 계수 조건을 이용해 무리근의 켤레근 $2+\\sqrt{3}$을 바로 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json(H1-RPM-033, DIRECT_ACTIVE): 두 포물선의 교점 방정식에 켤레무리근과 근과 계수의 관계를 적용하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 포물선의 교점 방정식에 켤레무리근 성질과 근과 계수의 관계를 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "유리수", "src": "stem", "quote": "유리수 $a, b$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "두 이차함수 $y=x^2-4x+2$"}], "condition": [{"term": "유리수", "src": "stem", "quote": "유리수 $a, b$에 대하여"}]}, "reasons": {"method": "켤레무리근 2+sqrt(3)과 근과 계수의 관계로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

복소수 \$z=a+bi\$ (\$a, b\$는 \$0\$이 아닌 실수)에 대하여 \$iz=-\\bar{z}\$일 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? (단, \$i=\\sqrt{-1}\$이고, \$\\bar{z}\$는 \$z\$의 켤레복소수이다.)

\<보기\> ㄱ. \$z+\\bar{z}=2b\$ ㄴ. \$i\\bar{z}=z\$ ㄷ. \$\\dfrac{\\bar{z}}{z}+\\dfrac{z}{\\bar{z}}=1\$

### 선지

① ㄱ, ㄴ ② ㄱ ③ ㄴ, ㄷ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

①

### 해설

\$iz=-b+ai\$이고 \$-\\bar{z}=-a+bi\$이므로 \$-b=-a\$, 즉 \$a=b\$이다.

- ㄱ. \$z+\\bar{z}=2a=2b\$ (참)  
- ㄴ. \$iz=-\\bar{z}\$의 양변에 \$i\$를 곱하면 \$-z=-i\\bar{z} \\implies i\\bar{z}=z\$ (참)  
- ㄷ. \$\\bar{z}=-iz\$이므로 \$\\dfrac{\\bar{z}}{z}=-i\$, \$\\dfrac{z}{\\bar{z}}=\\dfrac{1}{-i}=i\$이고, 합은 \$-i+i=0\\ne 1\$이다. (거짓) 따라서 옳은 것은 ㄱ, ㄴ이다.

```
{"status": "EXEMPT", "reason": "iz=-zbar 조건으로 실수부·허수부 관계 a=b를 구해 복소수 성질을 판정하는 합답형 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$iz=-\\bar{z}$에서 $a=b$를 구하고 양변에 $i$를 곱하거나 비를 계산해 ㄱ, ㄴ, ㄷ을 판정한다.", "decisiveStep": "$iz=-\\bar{z}$에서 $\\frac{\\bar{z}}{z}=-i$를 바로 얻어 ㄷ의 합이 $0$임을 계산한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json(H1-RPM-026, DIRECT_ACTIVE): iz=-zbar 조건에서 실수부·허수부 관계 a=b를 도출해 성질을 판정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 상등 관계 $iz=-\\bar{z}$로부터 대수적 성질을 도출하는 합답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "$\\bar{z}$는 $z$의 켤레복소수이다"}], "method": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=a+bi$", "evidenceType": "IMPLIED", "justification": "복소수 상등 조건 iz=-zbar에서 a=b를 구하고 세 보기의 참·거짓을 판정함"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=a+bi$"}], "condition": [{"term": "실수", "src": "stem", "quote": "$a, b$는 $0$이 아닌 실수"}]}, "reasons": {"method": "iz=-zbar에서 a=b와 zbar/z=-i를 구해 ㄱ, ㄴ, ㄷ을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$f(x)\$에 대하여 \$x\$에 대한 방정식 \$f(x)-3x+4=0\$의 두 근을 \$\\alpha, \\beta\$라 하자. \$\\alpha+\\beta=2, \\alpha\\beta=5\$이고 \$f(-1)=1\$일 때, \$f(3)\$의 값은?

### 선지

① \$11\$ ② \$13\$ ③ \$15\$ ④ \$17\$ ⑤ \$19\$

### 정답

②

### 해설

\$f(x)-3x+4=t(x^2-2x+5)\$ (\$t\\ne 0\$)이라 놓으면 \$f(x)=t(x^2-2x+5)+3x-4\$이다. \$f(-1)=1\$을 대입하면 \$t(1+2+5)-3-4=8t-7=1 \\implies t=1\$이다. 따라서 \$f(x)=x^2-2x+5+3x-4=x^2+x+1\$이므로 \$f(3)=3^2+3+1=13\$이다.

```
{"status": "EXEMPT", "reason": "f(x)-3x+4=0의 두 근의 합과 곱으로 이차함수 식을 설정하고 f(-1)=1로 최고차항 계수를 구하는 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$f(x)=t(x^2-2x+5)+3x-4$로 설정한 뒤 $f(-1)=1$을 대입해 $t=1$을 구하여 $f(3)$을 계산한다.", "decisiveStep": "두 근의 합·곱 조건으로 $f(x)-3x+4$를 $t(x^2-2x+5)$ 형태로 바로 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json(H1-RPM-035, DIRECT_ACTIVE): f(x)-(3x-4)=0의 두 근의 합·곱으로 이차함수를 설정해 값을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 두 근 정보로 이차함수를 설정하고 한 점 대입으로 결정하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$에 대하여"}], "method": [{"term": "근과계수의관계", "src": "stem", "quote": "$\\alpha+\\beta=2, \\alpha\\beta=5$이고", "evidenceType": "IMPLIED", "justification": "두 근의 합과 곱으로 f(x)-3x+4=t(x^2-2x+5)를 세운 뒤 f(-1)=1을 대입함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}], "condition": []}, "reasons": {"method": "두 근의 합과 곱으로 f(x)를 세우고 f(-1)=1로 t=1을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.2

### 발문

이차함수 \$f(x)\$가 다음 조건을 만족시킬 때, \$f(-4)\$의 값은?

(가) 방정식 \$f(x)=0\$의 두 근은 \$-3\$과 \$2\$이다. (나) \$4\\le x\\le 6\$에서 이차함수 \$f(x)\$의 최댓값은 \$108\$이다.

### 선지

① \$12\$ ② \$15\$ ③ \$16\$ ④ \$18\$ ⑤ \$24\$

### 정답

④

### 해설

조건 (가)에 의해 \$f(x)=a(x+3)(x-2)\$ (\$a\\ne 0\$)라 놓을 수 있다. \$4\\le x\\le 6\$에서 \$(x+3)(x-2)\>0\$이고 최댓값이 양수 \$108\$이므로 \$a\>0\$이다. \$x\>2\$에서 \$f(x)\$는 증가하므로 최댓값은 \$f(6)=a(9)(4)=36a=108 \\implies a=3\$이다. 따라서 \$f(-4)=3(-4+3)(-4-2)=3(-1)(-6)=18\$이다.

```
{"status": "EXEMPT", "reason": "이차방정식 두 근으로 f(x)를 세우고 제한 구간 최댓값으로 최고차항 계수 a를 결정하는 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$f(x)=a(x+3)(x-2)$로 두고 $4\\le x\\le 6$의 최댓값 $f(6)=36a=108$에서 $a=3$을 구해 $f(-4)$를 계산한다.", "decisiveStep": "구간 $[4, 6]$에서 $(x+3)(x-2)>0$이고 최댓값이 양수이므로 $a>0$이자 $x=6$에서 최대임을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json(H1-RPM-037, DIRECT_ACTIVE): 두 근으로 이차함수를 세우고 제한 구간 [4, 6]의 최댓값으로 계수를 결정하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수 꼴 이차함수 설정 후 제한 구간 최댓값으로 최고차항 계수를 결정하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}], "method": [{"term": "인수분해", "src": "solution", "quote": "f(x)=a(x+3)(x-2)", "evidenceType": "IMPLIED", "justification": "방정식 f(x)=0의 두 근으로 f(x)를 인수 형태로 설정하고 최댓값으로 a를 구함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}], "condition": [{"term": "최댓값", "src": "stem", "quote": "최댓값은 $108$이다"}]}, "reasons": {"method": "두 근으로 f(x)를 설정하고 f(6)=108로 a=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q19

- 형식: 객관식  
- 배점: 4.2

### 발문

이차식 \$f(x)\$와 일차식 \$g(x)\$가 다음 조건을 만족시킨다.

(가) 방정식 \$f(x)-g(x)=0\$이 중근 \$2\$를 갖는다. (나) 두 다항식 \$f(x), g(x)\$를 \$x-3\$으로 나누었을 때의 나머지는 각각 \$1\$, \$5\$이다.

다항식 \$f(x)-g(x)\$를 \$x+1\$로 나누었을 때의 나머지는?

### 선지

① \$-24\$ ② \$-32\$ ③ \$-36\$ ④ \$-40\$ ⑤ \$-48\$

### 정답

③

### 해설

\$h(x)=f(x)-g(x)\$라 하면 \$h(x)\$는 이차식이고 조건 (가)에서 \$h(x)=c(x-2)^2\$ (\$c\\ne 0\$)이다. 조건 (나)에서 \$f(3)=1, g(3)=5\$이므로 \$h(3)=f(3)-g(3)=1-5=-4\$이다. \$h(3)=c(3-2)^2=c=-4\$이므로 \$h(x)=-4(x-2)^2\$이다. 따라서 \$h(x)\$를 \$x+1\$로 나눈 나머지는 \$h(-1)=-4(-1-2)^2=-36\$이다.

```
{"status": "EXEMPT", "reason": "차 다항식 h(x)=f(x)-g(x)의 중근 조건과 나머지정리를 결합해 h(-1)을 구하는 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$h(x)=f(x)-g(x)=c(x-2)^2$으로 두고 $h(3)=f(3)-g(3)=-4$에서 $c=-4$를 구해 $h(-1)$을 계산한다.", "decisiveStep": "$f(x), g(x)$를 따로 구하지 않고 차이식 $h(x)$만 설정해 나머지정리를 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json(H1-RPM-009, RPM_ONLY): 차 다항식 f(x)-g(x)의 중근 조건과 나머지정리를 결합한 문항으로 현재 ACTIVE 대응 키 없음"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 다항식의 차 $f(x)-g(x)$를 하나의 이차식으로 설정해 중근·나머지 조건을 푸는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지는?"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "$f(3)=1, g(3)=5$이므로", "evidenceType": "IMPLIED", "justification": "중근 조건으로 h(x)=c(x-2)^2을 세우고 나머지정리 h(3)=-4로 c를 결정함"}], "given": [{"term": "이차식", "src": "stem", "quote": "이차식 $f(x)$"}], "condition": [{"term": "중근", "src": "stem", "quote": "중근 $2$를 갖는다"}]}, "reasons": {"method": "h(x)=c(x-2)^2 설정 후 나머지정리 h(3)=-4로 c를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q20

- 형식: 객관식  
- 배점: 4.5

### 발문

어느 수제 자동차공장에서 수출계약을 맺은 자동차를 생산하기 위해 하루에 \$6\$대씩 만들면 \$35\$일, \$8\$대씩 만들면 \$26\$일이 걸린다. 하루에 \$10\$대씩 만들면 며칠이 걸리는지 구하시오.

### 선지

① \$17\$일 ② \$18\$일 ③ \$19\$일 ④ \$20\$일 ⑤ \$21\$일

### 정답

⑤

### 해설

계약한 자동차 수를 자연수 \$N\$이라 하면

- 하루에 \$6\$대씩 \$35\$일 걸리므로 \$6\\cdot 34 \< N \\le 6\\cdot 35 \\implies 204 \< N \\le 210\$  
- 하루에 \$8\$대씩 \$26\$일 걸리므로 \$8\\cdot 25 \< N \\le 8\\cdot 26 \\implies 200 \< N \\le 208\$ 공통 범위는 \$204 \< N \\le 208\$이므로 \$N\\in{205, 206, 207, 208}\$이다. 하루에 \$10\$대씩 만들면 \$20\$일에는 \$200\$대로 부족하고 \$21\$일에는 \$210\$대까지 가능하므로 \$21\$일이 걸린다.

```
{"status": "EXEMPT", "reason": "작업 소요일수 조건을 연립일차부등식으로 세워 자연수 범위에서 일수를 구하는 실생활 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-08", "subUnitKey": "H15-SA-08-SYSTEM_INEQUALITY", "conceptClusterKey": null, "primaryMethod": "총 계약 대수 $N$에 대해 $6\\cdot 34<N\\le 6\\cdot 35$와 $8\\cdot 25<N\\le 8\\cdot 26$을 연립해 $10$대씩 소요일수를 구한다.", "decisiveStep": "$35$일째 완료되므로 $34$일치 초과 $35$일치 이하라는 엄밀한 부등식을 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 부등식", "l3": "연립일차부등식", "l4": "정수해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_LINEAR_SYSTEM_INEQUALITY", "templateKey": "TPL_H1_LINEAR_INEQUALITY_PARAMETER_INTEGER", "why": "high1.json(H1-RPM-046, DIRECT_ACTIVE): 작업 소요일수 조건을 연립일차부등식으로 세워 자연수 범위에서 일수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "작업 소요일수 조건을 연립일차부등식으로 번역해 정수 해 범위를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "solution", "quote": "자연수 $N$이라 하면"}], "method": [{"term": "연립부등식", "src": "solution", "quote": "공통 범위는 $204 < N \\le 208$이므로", "evidenceType": "IMPLIED", "justification": "두 작업 속도 조건을 부등식으로 세워 연립하고 10대씩 소요일수를 계산함"}], "given": [{"term": "부등식", "src": "solution", "quote": "6\\cdot 34 < N \\le 6\\cdot 35"}], "condition": [{"term": "자연수", "src": "solution", "quote": "자연수 $N$이라 하면"}]}, "reasons": {"method": "작업 일수 조건을 연립부등식으로 풀어 21일을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 10

### 발문

\<서술형 1\> 최고차항의 계수가 \$a\$ (\$a\>0\$)인 이차함수 \$f(x)\$가 다음 조건을 만족시킨다. (가) 직선 \$y=4ax-12\$와 함수 \$y=f(x)\$의 그래프가 만나는 두 점의 \$x\$좌표는 \$1\$과 \$7\$이다. (나) \$1\\le x\\le 7\$에서 \$f(x)\$의 최솟값은 \$-6\$이다. \$10\\times a\$의 값을 구하시오.

### 선지

없음

### 정답

\$20\$

### 해설

조건 (가)에 의하여 \$f(x)-(4ax-12)=a(x-1)(x-7)\$이므로 \$\$ f(x) \= a(x^2-8x+7)+4ax-12 \= a(x^2-4x+7)-12 \= a(x-2)^2+3a-12 \$\$ 이다. \$a\>0\$이고 구간 \$1\\le x\\le 7\$에 꼭짓점 \$x=2\$가 포함되므로 최솟값은 \$f(2)=3a-12\$이다. 조건 (나)에서 \$3a-12=-6 \\implies 3a=6 \\implies a=2\$이므로 \$10\\times a=20\$이다.

```
{"status": "EXEMPT", "reason": "직선과의 교점 조건으로 f(x)를 세우고 표준형 변형 후 구간 내 꼭짓점 최솟값으로 a를 구하는 서술형 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$f(x)-(4ax-12)=a(x-1)(x-7)$을 표준형 $a(x-2)^2+3a-12$로 고친 뒤 최솟값 $-6$으로 $a=2$를 구한다.", "decisiveStep": "직선과의 차를 인수 꼴로 두고 완전제곱식으로 바꾸어 꼭짓점 $x=2$가 구간 $[1, 7]$에 속함을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json(H1-RPM-037, DIRECT_ACTIVE): 직선과의 교점 조건으로 이차함수를 세우고 제한 구간 [1, 7] 최솟값으로 계수를 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 함수의 교점 조건으로 이차함수를 설정하고 제한 구간 최솟값으로 계수를 구하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "$f(x)$의 최솟값은 $-6$이다"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$가", "evidenceType": "IMPLIED", "justification": "교점 방정식으로 f(x)를 세우고 완전제곱식으로 최솟값을 구함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$가"}], "condition": [{"term": "양수", "src": "stem", "quote": "a>0"}]}, "reasons": {"method": "교점 조건으로 f(x)를 작성하고 표준형 최솟값으로 10a=20을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 10

### 발문

실수가 아닌 복소수 \$z\$에 대하여 \$z+\\dfrac{3}{z}=\\dfrac{1}{2}\$일 때, \$z^3+(\\bar{z})^3=-\\dfrac{q}{p}\$이다. \$p+q\$의 값을 구하시오. (단, \$p, q\$는 서로소인 자연수이고, \$\\bar{z}\$는 \$z\$의 켤레복소수이다.)

### 선지

없음

### 정답

\$43\$

### 해설

\$z+\\dfrac{3}{z}=\\dfrac{1}{2}\$의 양변에 \$z\$를 곱하면 \$z^2-\\dfrac{1}{2}z+3=0\$이다. 이 실수 계수 이차방정식의 판별식 \$D=\\dfrac{1}{4}-12=-\\dfrac{47}{4}\<0\$이고 \$z\$는 실수가 아니므로, \$\\bar{z}\$도 이 방정식의 근이다. 근과 계수의 관계에 의하여 \$z+\\bar{z}=\\dfrac{1}{2}\$, \$z\\bar{z}=3\$이므로 \$\$ z^3+(\\bar{z})^3 \= (z+\\bar{z})^3-3z\\bar{z}(z+\\bar{z}) \= \\left(\\dfrac{1}{2}\\right)^3-3\\cdot 3\\cdot\\dfrac{1}{2} \= \\dfrac{1}{8}-\\dfrac{9}{2} \= \-\\dfrac{35}{8} \$\$ 이다. \$8\$과 \$35\$는 서로소인 자연수이므로 \$p=8, q=35\$이고, \$p+q=43\$이다.

```
{"status": "EXEMPT", "reason": "복소수 관계식을 실수계수 이차방정식으로 바꾸어 켤레근 성질과 곱셈 공식으로 세제곱 합을 구하는 서술형 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "$z^2-\\frac{1}{2}z+3=0$의 두 근이 $z, \\bar{z}$임을 이용해 근과 계수의 관계로 $z+\\bar{z}, z\\bar{z}$를 구하고 세제곱 합 공식에 대입한다.", "decisiveStep": "실수 계수 이차방정식의 허근 $z$에 대해 $\\bar{z}$도 근이라는 성질을 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json(H1-RPM-031, DIRECT_BINDING_GAP): 실수 계수 이차방정식의 허근과 켤레복소수 근 성질로 세제곱 합을 구하는 문항"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 조건식의 이차방정식 변환, 켤레근 성질, 세제곱 합 공식이 결합된 서술형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "$\\bar{z}$는 $z$의 켤레복소수이다"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "복소수", "src": "stem", "quote": "실수가 아닌 복소수 $z$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "서로소인 자연수이고"}]}, "reasons": {"method": "이차방정식의 켤레근 성질과 세제곱 합 공식으로 p+q=43을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

