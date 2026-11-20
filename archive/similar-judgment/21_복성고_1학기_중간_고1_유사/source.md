

```
{"stem": "21_복성고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/21_복성고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}
```

## Q01

- 형식: 객관식  
- 배점: 3.5

### 발문

다음 나눗셈의 몫과 나머지를 구하시오. \$\$(x^3-2x^2+3x+1)\\div(x+1)\$\$

### 선지

① 몫: \$x^2-3x+6\$, 나머지: \$-5\$ ② 몫: \$x^2-3x+6\$, 나머지: \$5\$ ③ 몫: \$x^2-x+2\$, 나머지: \$-1\$ ④ 몫: \$x^2-3x+6\$, 나머지: \$-3\$ ⑤ 몫: \$x^2+3x+6\$, 나머지: \$-5\$

### 정답

①

### 해설

\$x=-1\$로 조립제법을 적용하면

- \$x^2\$항 계수: \$1\$  
- \$x\$항 계수: \$-2+1(-1)=-3\$  
- 상수항: \$3+(-3)(-1)=6\$  
- 나머지: \$1+6(-1)=-5\$ 따라서 몫은 \$x^2-3x+6\$, 나머지는 \$-5\$이다.

```
{"status": "EXEMPT", "reason": "삼차식을 일차식 x+1로 나눈 몫과 나머지를 조립제법으로 구하는 순수 연산 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_DIVISION", "conceptClusterKey": null, "primaryMethod": "$x=-1$로 조립제법을 적용하여 몫 $x^2-3x+6$과 나머지 $-5$를 구한다.", "decisiveStep": "일차식 $x+1$에 대응하는 $x=-1$을 부호 반전해 조립제법을 수행한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 나눗셈", "l4": "다항식을 일차식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_DIVISION", "templateKey": "TPL_H1_POLY_DIVISION_EXECUTION", "why": "high1.json 정본(H1-RPM-005, DIRECT_ACTIVE) 매핑: 일차식 나눗셈 조립제법"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식으로 나눈 몫과 나머지를 조립제법으로 바로 구하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "몫과 나머지를 구하시오"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "조립제법을 적용하면", "evidenceType": "IMPLIED", "justification": "x=-1 조립제법으로 몫과 나머지를 구함"}], "given": [{"term": "계수", "src": "solution", "quote": "계수: $1$"}], "condition": []}, "reasons": {"method": "x=-1 조립제법으로 몫과 나머지를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.5

### 발문

다항식 \$P(x)=x^3-ax^2+5x-6\$을 \$x-2\$로 나누어떨어지게 할 때, 상수 \$a\$의 값을 구하시오.

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

③

### 해설

인수정리에 의하여 \$P(2)=0\$이므로 \$\$ P(2) \= 8-4a+10-6 \= 12-4a \= 0 \\implies a=3 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "인수정리 P(2)=0으로 미정계수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "인수정리 $P(2)=0$에 $x=2$를 대입해 $12-4a=0$에서 $a=3$을 구한다.", "decisiveStep": "$x-2$로 나누어떨어지는 조건을 $P(2)=0$으로 바로 전환한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json 정본(H1-RPM-012, RPM_ONLY) 매핑: 인수정리 미정계수 결정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리를 직접 적용해 상수 $a$를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값을"}], "method": [{"term": "인수정리", "src": "solution", "quote": "인수정리에 의하여 $P(2)=0$", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)=x^3-ax^2+5x-6$"}], "condition": []}, "reasons": {"method": "인수정리 P(2)=0을 적용해 a=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q03

- 형식: 객관식  
- 배점: 3.5

### 발문

다음 \$(2+3i)(4-i)\$를 계산하시오.

### 선지

① \$5+10i\$ ② \$11-10i\$ ③ \$5-10i\$ ④ \$8+10i\$ ⑤ \$11+10i\$

### 정답

⑤

### 해설

복소수의 곱셈을 전개하고 \$i^2=-1\$을 적용하면 \$\$ (2+3i)(4-i) \= 8-2i+12i-3i^2 \= 8+10i+3 \= 11+10i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 복소수의 곱셈을 전개하고 i^2=-1을 적용해 계산하는 순수 연산 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "$(2+3i)(4-i)$를 전개한 뒤 $i^2=-1$을 대입해 실수부와 허수부를 정리한다.", "decisiveStep": "$-3i^2=+3$의 부호를 정확히 계산해 실수부 $11$을 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "사칙연산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json 정본(H1-RPM-023, DIRECT_ACTIVE) 매핑: 복소수 사칙연산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 곱셈을 직접 전개해 정리하는 기본 연산 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "solution", "quote": "복소수의 곱셈을"}], "method": [{"term": "전개", "src": "solution", "quote": "복소수의 곱셈을 전개하고", "evidenceType": "NAMED"}], "given": [{"term": "허수", "src": "solution", "quote": "i^2=-1"}], "condition": []}, "reasons": {"method": "복소수 곱셈 전개 후 i^2=-1을 적용해 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.5

### 발문

이차방정식 \$x^2-8x+m+3=0\$이 서로 다른 두 실근을 갖도록 하는 자연수 \$m\$의 개수는?

### 선지

① \$11\$ ② \$12\$ ③ \$13\$ ④ \$14\$ ⑤ \$10\$

### 정답

②

### 해설

서로 다른 두 실근을 가지므로 판별식 \$D\>0\$이다. \$\$ \\frac{D}{4} \= (-4)^2-(m+3) \= 13-m \> 0 \\implies m \< 13 \$\$ 따라서 자연수 \$m\$은 \$1, 2, \\cdots, 12\$의 \$12\$개이다.

```
{"status": "EXEMPT", "reason": "판별식 D>0 부등식을 풀어 자연수 m의 개수를 세는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "판별식 $D/4=13-m>0$을 풀어 $m<13$을 만족하는 자연수 $12$개를 센다.", "decisiveStep": "부등식 $m<13$의 등호 미포함을 확인해 $12$개를 얻는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json 정본(H1-RPM-028, DIRECT_ACTIVE) 매핑: 서로 다른 두 실근 판별식"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 서로 다른 두 실근 판별식을 직접 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "자연수 $m$의 개수는"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D>0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-8x+m+3=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근"}]}, "reasons": {"method": "판별식 D/4>0을 풀어 자연수 m의 개수 12를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.5

### 발문

\$-2\$와 \$3\$을 근으로 하고 \$x^2\$의 계수가 \$1\$인 이차방정식으로 옳은 것은?

### 선지

① \$x^2+x-6=0\$ ② \$x^2-5x-6=0\$ ③ \$x^2-x+6=0\$ ④ \$x^2-x-6=0\$ ⑤ \$x^2+5x+6=0\$

### 정답

④

### 해설

두 근의 합은 \$-2+3=1\$, 곱은 \$(-2)\\cdot 3=-6\$이고 \$x^2\$의 계수가 \$1\$이므로 구하는 이차방정식은 \$\$ x^2-x-6=0 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "두 근과 최고차항 계수로 이차방정식을 작성하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 근 $-2, 3$의 합 $1$과 곱 $-6$으로 이차방정식 $x^2-x-6=0$을 작성한다.", "decisiveStep": "일차항 계수가 $-(\\text{합})=-1$임을 부호 실수 없이 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json 정본(H1-RPM-030, DIRECT_BINDING_GAP) 매핑: 두 근으로 이차방정식 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근이 주어진 이차방정식을 바로 작성하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식으로 옳은 것은"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "두 근의 합은 $-2+3=1$, 곱은 $(-2)\\cdot 3=-6$", "evidenceType": "IMPLIED", "justification": "두 근의 합과 곱을 이용해 이차방정식 x^2-(합)x+(곱)=0을 세움"}], "given": [{"term": "계수", "src": "stem", "quote": "$x^2$의 계수가 $1$"}], "condition": []}, "reasons": {"method": "두 근의 합과 곱으로 이차방정식 x^2-x-6=0을 작성함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q06

- 형식: 객관식  
- 배점: 3.5

### 발문

이차함수 \$y=2x^2-4x+k\$의 그래프가 \$x\$축과 접할 때, 실수 \$k\$의 값은?

### 선지

① \$2\$ ② \$1\$ ③ \$\\dfrac{1}{2}\$ ④ \$\\dfrac{3}{2}\$ ⑤ \$4\$

### 정답

①

### 해설

\$x\$축과 접하므로 이차방정식 \$2x^2-4x+k=0\$의 판별식 \$D=0\$이다. \$\$ \\frac{D}{4} \= (-2)^2-2k \= 4-2k \= 0 \\implies k=2 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차함수가 x축과 접할 조건을 판별식 D=0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "$2x^2-4x+k=0$의 판별식 $D/4=4-2k=0$을 풀어 $k=2$를 구한다.", "decisiveStep": "$x$축 접선 조건을 판별식 $D=0$으로 전환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json 정본(H1-RPM-034, DIRECT_ACTIVE) 매핑: 이차함수 x축 접선 판별식"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$축 접선 조건에 판별식을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값은"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$이다", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=2x^2-4x+k$"}], "condition": []}, "reasons": {"method": "x축 접선 조건에 판별식 D/4=0을 적용해 k=2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.5

### 발문

이차함수 \$y=-x^2+6x+4\$의 최댓값은?

### 선지

① \$9\$ ② \$11\$ ③ \$13\$ ④ \$15\$ ⑤ \$17\$

### 정답

③

### 해설

\$y=-x^2+6x+4 \= \-(x-3)^2+13\$이므로 \$x=3\$일 때 최댓값은 \$13\$이다.

```
{"status": "EXEMPT", "reason": "이차함수를 표준형으로 변형해 최댓값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "표준형 $y=-(x-3)^2+13$으로 변형하여 최댓값 $13$을 읽는다.", "decisiveStep": "완전제곱식 변형으로 꼭짓점의 $y$좌표 $13$을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json 정본(H1-RPM-037, DIRECT_ACTIVE) 매핑: 이차함수 표준형 최댓값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 최댓값을 표준형으로 바로 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값은"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "-(x-3)^2+13", "evidenceType": "IMPLIED", "justification": "이차식을 완전제곱식으로 변형해 꼭짓점에서 최댓값을 구함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2+6x+4$"}], "condition": []}, "reasons": {"method": "표준형 -(x-3)^2+13으로 변형해 최댓값 13을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$(x+a)(x+b)(x+2)\$의 전개식에서 \$x^2\$의 계수가 \$7\$이고, \$x\$의 계수가 \$14\$일 때, \$a^2+b^2\$의 값을 구하시오. (단, \$a\$, \$b\$는 상수이다.)

### 선지

① \$9\$ ② \$13\$ ③ \$15\$ ④ \$19\$ ⑤ \$17\$

### 정답

⑤

### 해설

주어진 식을 전개하면 \$\$ (x+a)(x+b)(x+2) \= x^3+(a+b+2)x^2+(ab+2a+2b)x+2ab \$\$ 계수 조건에서 \$a+b+2=7 \\implies a+b=5\$이고, \$ab+2(a+b)=14 \\implies ab+10=14 \\implies ab=4\$이다. 따라서 \$a^2+b^2 \= (a+b)^2-2ab \= 5^2-2\\cdot 4 \= 17\$이다.

```
{"status": "EXEMPT", "reason": "전개 계수 비교로 a+b와 ab를 구한 뒤 곱셈 공식 변형으로 a^2+b^2을 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "전개식의 $x^2$항과 $x$항 계수에서 $a+b=5, ab=4$를 구한 뒤 $a^2+b^2=(a+b)^2-2ab$를 계산한다.", "decisiveStep": "$a, b$를 따로 풀지 않고 $a+b=5$와 $ab=4$만으로 제곱의 합을 구한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json 정본(H1-RPM-003, DIRECT_ACTIVE) 매핑: 전개 계수와 곱셈공식 변형"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "전개 계수 조건과 대칭식 곱셈 공식 변형을 결합한 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "(a+b)^2-2ab"}], "method": [{"term": "전개", "src": "solution", "quote": "주어진 식을 전개하면", "evidenceType": "NAMED"}], "given": [{"term": "계수", "src": "stem", "quote": "$x^2$의 계수가 $7$"}], "condition": []}, "reasons": {"method": "전개 계수로 a+b=5, ab=4를 구해 a^2+b^2=17을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$P(x)\$를 \$x^2-1\$로 나누었을 때 나머지가 \$2x+2\$이고, \$x^2-4\$로 나누었을 때 나머지가 \$-x+8\$이다. \$P(x)\$를 \$x^2+x-2\$로 나누었을 때 나머지를 구하시오.

### 선지

① \$-2x+4\$ ② \$-2x+6\$ ③ \$2x+2\$ ④ \$-2x+2\$ ⑤ \$2x+6\$

### 정답

②

### 해설

나머지정리에 의하여 \$x^2-1=(x-1)(x+1)\$이므로 \$P(1)=2(1)+2=4\$이고, \$x^2-4=(x-2)(x+2)\$이므로 \$P(-2)=-(-2)+8=10\$이다. \$P(x)\$를 \$x^2+x-2=(x+2)(x-1)\$로 나눈 나머지를 \$ax+b\$라 하면 \$\$ a+b=4, \\qquad \-2a+b=10 \$\$ 두 식을 빼면 \$3a=-6 \\implies a=-2, b=6\$이므로 구하는 나머지는 \$-2x+6\$이다.

```
{"status": "EXEMPT", "reason": "두 이차식 나머지 조건에서 P(1), P(-2) 값을 추출해 x^2+x-2 나눗셈 나머지를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$x^2-1, x^2-4$ 나눗셈 조건에서 $P(1)=4, P(-2)=10$을 추출해 $x^2+x-2=(x+2)(x-1)$ 나눗셈의 일차 나머지 $ax+b$를 연립한다.", "decisiveStep": "$x^2+x-2$의 두 일차인수 $x-1, x+2$에 대응하는 함숫값만 앞의 두 조건에서 뽑아낸다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": null, "why": "high1.json 정본(H1-RPM-010, FAMILY_ACTIVE) 매핑: 이차식 나눗셈 나머지정리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이차식 나머지에서 필요한 일차 나머지정리 조건을 추출해 결합하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 구하시오"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "나머지정리에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $P(x)$"}], "condition": []}, "reasons": {"method": "P(1)=4, P(-2)=10을 추출해 연립방정식으로 나머지 -2x+6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

다음 다항식의 인수분해가 바르지 않은 것은?

### 선지

① \$8a^3-12a^2b+6ab^2-b^3=(2a-b)^3\$ ② \$8x^3+27y^3=(2x+3y)(4x^2-6xy+9y^2)\$ ③ \$x^2+y^2+16z^2-2xy+8yz-8xz=(x-y-4z)^2\$ ④ \$x^4-5x^2+4=(x-1)^2(x-2)^2\$ ⑤ \$(3x-y+2)(3x-y-4)+5=(3x-y+1)(3x-y-3)\$

### 정답

④

### 해설

④에서 보기차식 \$x^4-5x^2+4\$를 인수분해하면 \$\$ x^4-5x^2+4 \= (x^2-1)(x^2-4) \= (x-1)(x+1)(x-2)(x+2) \$\$ 이므로 \$(x-1)^2(x-2)^2\$과 같지 않다. 나머지 ①, ②, ③, ⑤는 모두 옳은 인수분해이다.

```
{"status": "EXEMPT", "reason": "다섯 가지 인수분해 공식 및 치환 인수분해의 정오를 판별하는 순수 개념 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "다섯 보기의 인수분해를 각각 전개·분해해 보기차식 $x^4-5x^2+4=(x-1)(x+1)(x-2)(x+2)$의 부호·지수 오류를 찾는다.", "decisiveStep": "④에서 합차 공식 $(x^2-1)(x^2-4)$가 완전제곱 $(x-1)^2(x-2)^2$이 아님을 바로 가려낸다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "합과 차"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json 정본(H1-RPM-016, DIRECT_ACTIVE) 매핑: 인수분해 공식 및 보기차식 합차 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차식·세 항 제곱·보기차식·치환 인수분해의 정오를 종합 점검하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수분해", "src": "stem", "quote": "인수분해가 바르지"}], "method": [{"term": "인수분해", "src": "solution", "quote": "보기차식 $x^4-5x^2+4$를 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "다항식", "src": "stem", "quote": "다음 다항식의"}], "condition": []}, "reasons": {"method": "보기차식 인수분해 오류를 가려내 ④를 선택함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

복소수 \$z=\\dfrac{1-i}{1+i}\$에 대하여 \$z+z^2+\\cdots+z^{2021}\$의 값은?

### 선지

① \$-i\$ ② \$i\$ ③ \$-1\$ ④ \$0\$ ⑤ \$1\$

### 정답

①

### 해설

분모를 실수화하면 \$\$ z \= \\frac{1-i}{1+i} \= \\frac{(1-i)^2}{(1+i)(1-i)} \= \\frac{-2i}{2} \= \-i \$\$ \$z+z^2+z^3+z^4 \= \-i-1+i+1 \= 0\$이고 \$2021=4\\times 505+1\$이므로 \$\$ z+z^2+\\cdots+z^{2021} \= z^{2021} \= (-i)^{4\\times 505+1} \= \-i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "(1-i)/(1+i)=-i로 실수화한 뒤 4주기 합이 0임을 이용해 2021항 합을 구하는 순수 복소수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "분모 실수화로 $z=-i$를 얻고 연속 $4$항의 합 $-i-1+i+1=0$을 이용해 $2021=4\\times 505+1$에서 $-i$를 구한다.", "decisiveStep": "$4$개 항씩 $0$으로 소거되어 마지막 $z^{2021}=-i$만 남음을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json 정본(H1-RPM-025, DIRECT_ACTIVE) 매핑: 복소수 실수화 후 4주기 거듭제곱"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 분수식의 실수화와 $4$주기 거듭제곱 합 소거를 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\dfrac{1-i}{1+i}$"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모를 실수화하면", "evidenceType": "IMPLIED", "justification": "분모의 켤레복소수를 곱해 z=-i를 구한 뒤 4주기 합 소거를 적용함"}], "given": [{"term": "합", "src": "solution", "quote": "z+z^2+z^3+z^4 = -i-1+i+1 = 0"}], "condition": []}, "reasons": {"method": "분모 실수화로 z=-i를 얻고 4주기 합 소거로 2021항 합을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

이차방정식 \$3x^2-ax+7b=0\$이 중근을 가질 때, \$a\$의 값이 최소가 되게 하는 \$b\$의 값과 이때의 \$a\$값에 대하여 \$\\dfrac{a}{b}\$의 값은? (단, \$a\$, \$b\$는 자연수이다.)

### 선지

① \$1\$ ② \$3\$ ③ \$2\$ ④ \$6\$ ⑤ \$7\$

### 정답

③

### 해설

중근을 가지므로 판별식 \$D=0\$에서 \$\$ D \= a^2-4\\cdot 3\\cdot 7b \= a^2-84b \= 0 \\implies a^2 \= 2^2\\cdot 3\\cdot 7\\cdot b \$\$ \$a, b\$가 자연수이고 \$a\$가 최소가 되려면 \$b\$는 \$3\\cdot 7=21\$의 소인수를 보충하는 최소 자연수 \$b=21\$이어야 한다. 이때 \$a^2=2^2\\cdot 21^2 \\implies a=42\$이므로 \$\\dfrac{a}{b}=\\dfrac{42}{21}=2\$이다.

```
{"status": "EXEMPT", "reason": "중근 판별식 a^2=84b에서 소인수분해로 최소 자연수 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "중근 판별식 $a^2=84b=2^2\\cdot 3\\cdot 7\\cdot b$를 소인수분해해 제곱수가 되는 최소 자연수 $b=21, a=42$를 구한다.", "decisiveStep": "$84=2^2\\cdot 3\\cdot 7$의 지수가 홀수인 소인수 $3, 7$을 채워 $b=21$을 최소로 잡는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json 정본(H1-RPM-028, DIRECT_ACTIVE) 매핑: 중근 판별식과 자연수 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "중근 판별식과 자연수 제곱수 조건(소인수분해)을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "자연수", "src": "stem", "quote": "$a$, $b$는 자연수이다"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D=0$에서", "evidenceType": "NAMED"}], "given": [{"term": "중근", "src": "stem", "quote": "중근을 가질 때"}], "condition": []}, "reasons": {"method": "판별식 a^2=84b에 소인수분해 제곱수 조건을 적용해 a/b=2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

이차함수 \$y=x^2+ax+3\$의 그래프와 직선 \$y=3x+b\$의 두 교점의 \$x\$좌표가 \$-1\$, \$3\$일 때, 실수 \$a+b\$의 값은?

### 선지

① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$

### 정답

⑤

### 해설

두 교점의 \$x\$좌표 \$-1, 3\$은 이차방정식 \$x^2+(a-3)x+(3-b)=0\$의 두 근이다. 근과 계수의 관계에 의하여 \$\$ \-1+3 \= \-(a-3) \\implies a=1, \\qquad (-1)\\cdot 3 \= 3-b \\implies b=6 \$\$ 따라서 \$a+b=1+6=7\$이다.

```
{"status": "EXEMPT", "reason": "포물선과 직선의 교점 x좌표를 연립이차방정식의 두 근으로 두고 근과 계수의 관계로 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립이차방정식 $x^2+(a-3)x+(3-b)=0$의 두 근 $-1, 3$에 근과 계수의 관계를 적용해 $a=1, b=6$을 구한다.", "decisiveStep": "교점의 $x$좌표 $-1, 3$의 합과 곱을 각각 일차항·상수항 계수와 연결한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json 정본(H1-RPM-035, DIRECT_ACTIVE) 매핑: 포물선과 직선의 교점과 근과 계수의 관계"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 교점 $x$좌표가 주어졌을 때 근과 계수의 관계로 미정계수를 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "교점", "src": "stem", "quote": "두 교점의 $x$좌표가"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+ax+3$"}], "condition": []}, "reasons": {"method": "연립이차방정식의 두 근 -1, 3에 근과 계수의 관계를 적용해 a+b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$값의 범위가 \$0\\le x\\le 4\$일 때, 이차함수 \$y=x^2-6x+k\$의 최솟값은 \$2\$이다. 이 범위에서 이차함수의 최댓값은?

### 선지

① \$9\$ ② \$11\$ ③ \$10\$ ④ \$12\$ ⑤ \$13\$

### 정답

②

### 해설

\$y=x^2-6x+k=(x-3)^2+k-9\$이므로 아래로 볼록하고 축이 \$x=3\$이다. 구간 \$0\\le x\\le 4\$에 꼭짓점 \$x=3\$이 포함되므로 최솟값은 \$x=3\$일 때 \$k-9=2 \\implies k=11\$이다. 축 \$x=3\$에서 가장 먼 끝점은 \$x=0\$이므로 최댓값은 \$f(0)=k=11\$이다.

```
{"status": "EXEMPT", "reason": "제한 범위 이차함수의 최솟값으로 상수 k를 구한 뒤 같은 범위의 최댓값을 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$y=(x-3)^2+k-9$에서 구간 $[0, 4]$의 최솟값 $k-9=2$로 $k=11$을 구한 뒤 먼 끝점 $x=0$의 최댓값 $11$을 구한다.", "decisiveStep": "축 $x=3$이 구간 $[0, 4]$ 내부에 있으므로 최솟값은 꼭짓점, 최댓값은 먼 끝점 $x=0$에서 나온다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json 정본(H1-RPM-037, DIRECT_ACTIVE) 매핑: 제한 범위 이차함수 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한 범위 이차함수에서 최솟값 조건으로 상수를 구하고 최댓값까지 이어 구하는 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "이차함수의 최댓값은"}], "method": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-6x+k$", "evidenceType": "IMPLIED", "justification": "표준형 변환 후 [0, 4]의 꼭짓점 최솟값으로 k를 구하고 x=0 최댓값을 계산함"}], "given": [{"term": "최솟값", "src": "stem", "quote": "최솟값은 $2$이다"}], "condition": []}, "reasons": {"method": "표준형 [0, 4] 최솟값 조건으로 k=11을 구한 뒤 x=0에서 최댓값을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.5

### 발문

\$\\dfrac{98\\times 10204-98^3}{100}\$의 값을 구하시오.

### 선지

① \$576\$ ② \$582\$ ③ \$584\$ ④ \$588\$ ⑤ \$594\$

### 정답

④

### 해설

분자를 공통인수 \$98\$로 묶으면 \$\$ \\frac{98(10204-98^2)}{100} \$\$ \$a=100\$이라 하면 \$98=a-2\$이고 \$10204=a^2+2a+4\$이므로 \$\$ 10204-98^2 \= (a^2+2a+4)-(a-2)^2 \= (a^2+2a+4)-(a^2-4a+4) \= 6a \= 600 \$\$ 따라서 구하는 값은 \$\\dfrac{98\\times 600}{100} \= 98\\times 6 \= 588\$이다.

```
{"status": "EXEMPT", "reason": "수 계산을 공통인수 98과 a=100 치환으로 단순화해 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "분자를 $98(10204-98^2)$로 묶고 $a=100$으로 치환해 $(a^2+2a+4)-(a-2)^2=6a=600$을 계산한다.", "decisiveStep": "$10204=100^2+2\\cdot 100+4$를 $a=100$으로 치환해 $a^2$과 상수항을 소거한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "수의 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json 정본(H1-RPM-018, DIRECT_ACTIVE) 매핑: 인수분해 활용 수의 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "큰 수의 사칙연산을 공통인수와 문자 치환 곱셈 공식으로 간단히 하는 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "(a^2+2a+4)-(a-2)^2"}], "method": [{"term": "치환", "src": "solution", "quote": "a=100$이라 하면", "evidenceType": "IMPLIED", "justification": "98로 묶은 뒤 100=a로 치환해 제곱항과 상수항을 소거함"}], "given": [{"term": "다항식", "src": "solution", "quote": "10204-98^2"}], "condition": []}, "reasons": {"method": "98로 묶고 a=100 치환으로 10204-98^2=600을 구해 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.5

### 발문

\$x\$에 대한 다항식 \$f(x)\$를 \$x+1\$로 나누었을 때의 나머지는 \$13\$이고, \$(x-2)^2\$으로 나누었을 때의 나머지는 \$2x-3\$이다. \$f(x)\$를 \$(x-2)^2(x+1)\$로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(3)\$을 구하시오.

### 선지

① \$5\$ ② \$3\$ ③ \$4\$ ④ \$6\$ ⑤ \$7\$

### 정답

①

### 해설

\$f(x)\$를 삼차식 \$(x-2)^2(x+1)\$로 나눈 나머지 \$R(x)\$는 \$(x-2)^2\$으로 나눈 나머지가 \$2x-3\$이어야 하므로 \$\$ R(x) \= a(x-2)^2+2x-3 \$\$ 이라 놓을 수 있다. 조건에서 \$f(-1)=R(-1)=13\$이므로 \$\$ a(-1-2)^2+2(-1)-3 \= 9a-5 \= 13 \\implies a \= 2 \$\$ 따라서 \$R(x)=2(x-2)^2+2x-3\$이므로 \$R(3)=2(3-2)^2+2(3)-3=2+6-3=5\$이다.

```
{"status": "EXEMPT", "reason": "삼차식 (x-2)^2(x+1) 나눗셈 나머지를 a(x-2)^2+2x-3으로 설정해 f(-1)=13으로 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "이차 나머지 $R(x)=a(x-2)^2+2x-3$으로 두고 $f(-1)=R(-1)=13$을 대입해 $a=2$를 구한다.", "decisiveStep": "제곱 인수 $(x-2)^2$의 나머지 조건을 $a(x-2)^2+2x-3$으로 압축해 미지수를 줄인다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": null, "why": "high1.json 정본(H1-RPM-010, FAMILY_ACTIVE) 매핑: 삼차식 나눗셈 나머지정리"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "완전제곱 인수를 포함한 삼차식 나눗셈 나머지를 결정하는 대표 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나머지를 $R(x)$라 할 때"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "f(-1)=R(-1)=13$이므로", "evidenceType": "IMPLIED", "justification": "R(x)=a(x-2)^2+2x-3으로 두고 나머지정리 f(-1)=13을 대입해 a를 구함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "R(x)=a(x-2)^2+2x-3 설정 후 f(-1)=13 대입으로 R(3)=5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.5

### 발문

방정식 \$(x^2+x+a)(x^2+x+12-a)=0\$의 근 중 서로 다른 허근의 개수가 \$2\$개이기 위한 자연수 \$a\$의 값의 개수는? (\$a\\le 100\$)

### 선지

① \$88\$ ② \$89\$ ③ \$90\$ ④ \$91\$ ⑤ \$92\$

### 정답

③

### 해설

첫째 이차식 \$x^2+x+a=0\$의 판별식은 \$D\_1=1-4a\<0\$ (\$a\\ge 1\$인 자연수)이므로 항상 서로 다른 두 허근을 갖는다. 따라서 전체 방정식의 서로 다른 허근이 \$2\$개뿐이려면 둘째 이차식 \$x^2+x+12-a=0\$이

1) 실근을 갖거나 (\$D\_2\\ge 0\$): \$D\_2=1-4(12-a)=4a-47\\ge 0 \\implies a\\ge \\dfrac{47}{4}=11.75\$, 즉 \$12\\le a\\le 100\$ (\$89\$개)  
2) 첫째 이차식과 같은 두 허근을 가져야 한다: \$a=12-a \\implies a=6\$ (\$1\$개) 따라서 조건을 만족하는 자연수 \$a\$의 개수는 \$89+1=90\$개이다.

```
{"status": "EXEMPT", "reason": "두 이차방정식 곱에서 서로 다른 허근이 2개일 조건을 판별식 D2>=0과 중근 식 일치로 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "첫째 식이 항상 서로 다른 두 허근을 가지므로 둘째 식이 실근을 갖는 $D_2\\ge 0$($a\\ge 12$)과 두 식이 일치하는 $a=6$을 합해 $90$개를 구한다.", "decisiveStep": "서로 다른 허근 $2$개 조건에서 두 이차식이 완전히 일치해 중근을 갖는 예외 $a=6$을 놓치지 않는다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "계수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": null, "why": "high1.json 정본(H1-RPM-032, FAMILY_BINDING_GAP) 매핑: 사차방정식 허근 개수 계수 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사차방정식의 서로 다른 허근 개수 조건에서 판별식과 식 일치(중근) 예외를 함께 찾는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "허근", "src": "stem", "quote": "서로 다른 허근의 개수가 $2$개"}], "method": [{"term": "판별식", "src": "solution", "quote": "D_1=1-4a<0", "evidenceType": "NAMED"}], "given": [{"term": "자연수", "src": "stem", "quote": "자연수 $a$의 값의 개수"}], "condition": []}, "reasons": {"method": "판별식 D2>=0 범위와 두 인수가 일치하는 a=6을 합산해 90개를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q18

- 형식: 객관식  
- 배점: 4.5

### 발문

정수 \$n\$에 대해 방정식 \$x^2+nx+10=0\$의 한 해가 \$a+bi\$일 때, 가능한 \$n\$의 개수는? (단, \$a, b\$는 정수이다.)

### 선지

① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$

### 정답

⑤

### 해설

\$n\$이 정수이므로 실계수 방정식이다.

1) \$b=0\$일 때 (정수 근 \$a\$): \$a\$는 \$10\$의 약수 \$\\pm 1, \\pm 2, \\pm 5, \\pm 10\$이고, \$n=-\\left(a+\\dfrac{10}{a}\\right)\$에서 \$n=\\pm 11, \\pm 7\$ (\$4\$개)  
2) \$b\\ne 0\$일 때 (켤레복소수 근 \$a\\pm bi\$): 두 근의 곱 \$a^2+b^2=10\$을 만족하는 \$0\$ 아닌 정수 쌍 \$(\|a\|, \|b\|)\$는 \$(1, 3), (3, 1)\$이므로 \$a\\in{\\pm 1, \\pm 3}\$이다. 두 근의 합 \$2a=-n\$에서 \$n=\\pm 2, \\pm 6\$ (\$4\$개) 따라서 가능한 정수 \$n\$은 \$\\pm 2, \\pm 6, \\pm 7, \\pm 11\$의 모두 \$8\$개이다.

```
{"status": "EXEMPT", "reason": "정수 계수 이차방정식의 해 a+bi를 b=0(정수근)과 b!=0(켤레복소수 근)으로 나누어 가능한 n 개수를 세는 순수 대수 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_ROOT", "conceptClusterKey": null, "primaryMethod": "$b=0$인 정수근 경우($10$의 약수)와 $b\\ne 0$인 허근 경우($a^2+b^2=10$ 정수쌍)로 나누어 가능한 정수 $n$의 개수를 센다.", "decisiveStep": "정수 $a, b$ 조건에서 $b=0$인 실근 경우를 빠뜨리지 않고 $a^2+b^2=10$과 함께 센다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "복소수 근", "l4": "허근"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION", "why": "high1.json 정본(H1-RPM-031, DIRECT_BINDING_GAP) 매핑: 정수 계수 이차방정식 복소수 근"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 해 $a+bi$의 정수 계수 조건에서 실근($b=0$)과 허근($b\\ne 0$)을 모두 분기해 세는 고난도 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "정수", "src": "stem", "quote": "정수 $n$에 대해"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "두 근의 곱 $a^2+b^2=10$", "evidenceType": "IMPLIED", "justification": "b=0 실근과 b!=0 켤레허근으로 나누어 근과 계수의 관계로 n을 모두 구함"}], "given": [{"term": "방정식", "src": "stem", "quote": "방정식 $x^2+nx+10=0$"}], "condition": [{"term": "켤레복소수", "src": "solution", "quote": "켤레복소수 근 $a\\pm bi$"}]}, "reasons": {"method": "b=0 실근(약수)과 b!=0 허근(a^2+b^2=10)을 모두 세어 8개를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q19

- 형식: 객관식  
- 배점: 4.5

### 발문

최고차항의 계수가 \$a\$ (\$a\>0\$)인 이차함수 \$f(x)\$와 직선 \$y=ax+7\$이 만나는 두 교점의 \$x\$좌표가 \$-1\$과 \$6\$이다. \$1\\le x\\le 3\$에서 \$f(x)\$의 최솟값은 \$3\$이다. 이때 \$10a\$의 값은?

### 선지

① \$2\$ ② \$4\$ ③ \$5\$ ④ \$8\$ ⑤ \$10\$

### 정답

②

### 해설

두 교점의 \$x\$좌표가 \$-1, 6\$이므로 \$f(x)-(ax+7)=a(x+1)(x-6)\$이다. 따라서 \$\$ f(x) \= a(x^2-5x-6)+ax+7 \= a(x^2-4x-6)+7 \= a(x-2)^2-10a+7 \$\$ \$a\>0\$이고 축 \$x=2\$가 구간 \$1\\le x\\le 3\$에 포함되므로 최솟값은 \$\$ f(2) \= \-10a+7 \= 3 \\implies 10a \= 4 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "교점 x좌표로 f(x)-(ax+7)=a(x+1)(x-6)을 세우고 제한 범위 [1, 3] 최솟값으로 10a를 구하는 순수 함수 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "차의 함수 $f(x)-(ax+7)=a(x+1)(x-6)$으로 $f(x)=a(x-2)^2-10a+7$을 세우고 최솟값 $-10a+7=3$에서 $10a=4$를 구한다.", "decisiveStep": "직선과의 교점 조건을 $f(x)-(ax+7)=a(x+1)(x-6)$으로 한 번에 식 세운다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json 정본(H1-RPM-037, DIRECT_ACTIVE) 매핑: 교점 조건과 제한 범위 최솟값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 교점 인수 작성과 제한 범위 최솟값 조건을 결합한 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "f(x)$의 최솟값은 $3$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "f(x)-(ax+7)=a(x+1)(x-6)", "evidenceType": "IMPLIED", "justification": "교점 x좌표 -1, 6을 이용해 f(x)-(ax+7)을 인수분해 꼴로 세움"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)$"}], "condition": [{"term": "교점", "src": "stem", "quote": "만나는 두 교점의 $x$좌표"}]}, "reasons": {"method": "f(x)-(ax+7)=a(x+1)(x-6) 식 세우기 후 꼭짓점 최솟값으로 10a=4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 5

### 발문

이차방정식 \$x^2+4x+5=0\$의 두 근을 \$\\alpha\$, \$\\beta\$라 할 때, 다음 조건을 만족시키는 이차식 \$f(x)\$에 대하여 이차방정식 \$f(x)=0\$의 두 근이 \$p, q\$일 때, \$\|p-q\|\$의 값은? (가) \$\\alpha=f(\\beta)\$ (나) \$\\beta=f(\\alpha)\$ (다) \$f(0)=6\$

### 선지

① \$0\$ ② \$\\dfrac{1}{4}\$ ③ \$\\dfrac{3}{2}\$ ④ \$\\dfrac{1}{2}\$ ⑤ \$1\$

### 정답

④

### 해설

근과 계수의 관계에서 \$\\alpha+\\beta=-4\$, \$\\alpha\\beta=5\$이다. 조건 (가), (나)에서 \$\\alpha=-4-\\beta\$, \$\\beta=-4-\\alpha\$이므로 \$\$ f(\\beta)+\\beta+4 \= 0, \\qquad f(\\alpha)+\\alpha+4 \= 0 \$\$ 즉 이차식 \$f(x)+x+4\$는 \$\\alpha, \\beta\$를 두 근으로 가지므로 최고차항의 계수를 \$k\$ (\$k\\ne 0\$)라 하면 \$\$ f(x)+x+4 \= k(x^2+4x+5) \\implies f(x) \= k(x^2+4x+5)-x-4 \$\$ 조건 (다)에서 \$f(0)=5k-4=6 \\implies k=2\$이므로 \$\$ f(x) \= 2(x^2+4x+5)-x-4 \= 2x^2+7x+6 \= 0 \$\$ 근과 계수의 관계에서 \$p+q=-\\dfrac{7}{2}\$, \$pq=3\$이므로 \$\$ \|p-q\| \= \\sqrt{(p+q)^2-4pq} \= \\sqrt{\\frac{49}{4}-12} \= \\sqrt{\\frac{1}{4}} \= \\frac{1}{2} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "α+β=-4를 이용해 f(α)+α+4=0 인수정리 형태로 f(x)를 결정하고 두 근의 차를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$\\alpha+\\beta=-4$로 조건 (가),(나)를 $f(\\alpha)+\\alpha+4=f(\\beta)+\\beta+4=0$으로 바꾸어 $f(x)=k(x^2+4x+5)-x-4$를 세운 뒤 $f(0)=6$으로 확정한다.", "decisiveStep": "비대칭 꼴 $\\alpha=f(\\beta)$를 합 $\\alpha+\\beta=-4$를 이용해 한 문자 식 $f(x)+x+4=0$의 근으로 통일한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json 정본(H1-RPM-030, DIRECT_BINDING_GAP) 매핑: 근과 계수의 관계로 이차식 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근의 대칭 치환 $f(\\beta)=\\alpha$를 인수정리 $f(x)+x+4=k(x^2+4x+5)$로 전환하는 최고난도 객관식 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이차식", "src": "stem", "quote": "만족시키는 이차식 $f(x)$"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에서 $\\alpha+\\beta=-4$", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+4x+5=0$"}], "condition": []}, "reasons": {"method": "α+β=-4 치환으로 f(x)+x+4=k(x^2+4x+5)를 세워 |p-q|=1/2을 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q21

- 형식: 서답형  
- 배점: 10

### 발문

세 변의 길이가 \$a, b, c\$인 삼각형 \$ABC\$가 다음 조건을 만족시킨다. (가) \$(b-c)a^2+(2b^2-bc-c^2)a+b^3-bc^2=0\$ (나) \$5a-3b-3c=0\$ (다) 삼각형 \$ABC\$의 가장 긴 변의 길이를 밑변으로 할 때 높이는 \$4\$이다.

다음 물음에 답하시오.

1) (가)의 식을 인수분해하시오. \[3점\]  
2) 1)의 결과와 (나)를 이용하여 삼각형 \$ABC\$가 어떤 삼각형인지 구하시오. \[3점\]  
3) 2)의 결과와 (다)를 이용하여 삼각형의 둘레의 길이를 구하시오. \[4점\]

### 선지

없음

### 정답

1) \$(a+b)(b-c)(a+b+c)\$, 2\) \$b=c\$인 이등변삼각형, 3\) \$16\$

### 해설

1) (가)의 좌변에서 각 계수를 인수분해하면 \$\$ \\begin{aligned} (b-c)a^2+(b-c)(2b+c)a+b(b-c)(b+c) &= (b-c){a^2+(2b+c)a+b(b+c)} \\ &= (a+b)(b-c)(a+b+c) \\end{aligned} \$\$  
2) 세 변의 길이 \$a, b, c\$는 모두 양수이므로 \$a+b\>0, a+b+c\>0\$이고, 따라서 \$b-c=0\$, 즉 \$b=c\$인 이등변삼각형이다. (나)에서 \$5a-3b-3b=0 \\implies a=\\dfrac{6}{5}b\$로 양수 조건 및 삼각형 결정 조건(\$b+b\>\\frac{6}{5}b\$)을 만족한다.  
3) \$a=\\dfrac{6}{5}b \> b=c\$이므로 가장 긴 변은 \$a\$이다. 밑변 \$a\$에 내린 수선의 발이 밑변을 이등분하므로 직각삼각형에서 피타고라스 정리에 의해 \$\$ \\left(\\frac{a}{2}\\right)^2+4^2 \= b^2 \\implies \\left(\\frac{3}{5}b\\right)^2+16 \= b^2 \\implies \\frac{16}{25}b^2 \= 16 \\implies b=5 \$\$ 따라서 \$b=c=5\$, \$a=6\$이므로 둘레의 길이는 \$6+5+5=16\$이다.

```
{"status": "EXEMPT", "reason": "다항식 인수분해로 이등변삼각형을 판별하고 비례식과 피타고라스 정리로 둘레를 구하는 순수 대수·기하 문항임"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "(가)를 $(a+b)(b-c)(a+b+c)=0$으로 인수분해해 $b=c$를 얻고, (나)의 $a=\\frac{6}{5}b$와 (다)의 높이 $4$에 피타고라스 정리를 적용해 $b=5, a=6$을 구한다.", "decisiveStep": "가장 긴 변 $a=\\frac{6}{5}b$에 내린 높이가 밑변을 수직이등분하므로 $3$-$4$-$5$ 직각삼각형 관계 $\\left(\\frac{3}{5}b\\right)^2+4^2=b^2$를 세운다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json 정본(H1-RPM-020, DIRECT_ACTIVE) 매핑: 다문자 조건식 인수분해와 삼각형 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다문자 인수분해, 이등변삼각형 판별, 피타고라스 정리를 단계별로 묻는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "이등변삼각형", "src": "solution", "quote": "b=c$인 이등변삼각형"}], "method": [{"term": "인수분해", "src": "stem", "quote": "식을 인수분해하시오", "evidenceType": "NAMED"}], "given": [{"term": "삼각형", "src": "stem", "quote": "삼각형 $ABC$"}], "condition": []}, "reasons": {"method": "인수분해로 b=c를 밝히고 비례식과 피타고라스 정리로 둘레 16을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 서답형  
- 배점: 10

### 발문

다음 그림과 같이 한 변의 길이가 \$12\$인 정사각형 \$ABCD\$에 내접하는 정사각형 \$EFGH\$의 넓이의 최솟값을 구하고 그 과정을 서술하여라. \[총 10점\]

1) 정사각형 \$EFGH\$의 넓이를 식으로 구하는 과정을 서술하여라. \[5점\]  
2) 1)에서 구한 식을 이용하여 넓이의 최솟값을 구하는 과정을 서술하여라. \[5점\]

### 선지

없음

### 정답

\$72\$

### 해설

1) 점 \$E, F, G, H\$가 각각 변 \$AB, BC, CD, DA\$ 위에 있고 네 귀퉁이의 직각삼각형 \$\\triangle EBF, \\triangle FCG, \\triangle GDH, \\triangle HAE\$는 모두 합동이다. \$\\overline{AE}=x\$ (\$0\<x\<12\$)라 하면 \$\\overline{AH}=12-x\$이므로 피타고라스 정리에 의해 정사각형 \$EFGH\$의 넓이 \$S\$는 \$\$ S \= \\overline{EH}^2 \= x^2+(12-x)^2 \= 2x^2-24x+144 \$\$  
2) \$S\$를 완전제곱식으로 변형하면 \$\$ S \= 2(x-6)^2+72 \$\$ \$0\<x\<12\$ 범위에서 \$x=6\$일 때 최솟값 \$72\$를 갖는다.

```
{"capability": "construction-spike-v1", "mode": "PLANE_FIGURE_v1", "caption": "한 변의 길이가 12인 정사각형 ABCD에 내접하는 정사각형 EFGH", "mathPlan": {"nodes": [{"id": "A", "kind": "SOURCE_POINT", "x": 0, "y": 4, "label": "A"}, {"id": "B", "kind": "SOURCE_POINT", "x": 0, "y": 0, "label": "B"}, {"id": "C", "kind": "SOURCE_POINT", "x": 4, "y": 0, "label": "C"}, {"id": "D", "kind": "SOURCE_POINT", "x": 4, "y": 4, "label": "D"}, {"id": "E", "kind": "SOURCE_POINT", "x": 0, "y": 2.5, "label": "E"}, {"id": "F", "kind": "SOURCE_POINT", "x": 1.5, "y": 0, "label": "F"}, {"id": "G", "kind": "SOURCE_POINT", "x": 4, "y": 1.5, "label": "G"}, {"id": "H", "kind": "SOURCE_POINT", "x": 2.5, "y": 4, "label": "H"}], "segments": [{"from": "A", "to": "B"}, {"from": "B", "to": "C"}, {"from": "C", "to": "D"}, {"from": "D", "to": "A"}, {"from": "E", "to": "F"}, {"from": "F", "to": "G"}, {"from": "G", "to": "H"}, {"from": "H", "to": "E"}]}}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$\\overline{AE}=x$($0<x<12$)로 두고 합동 직각삼각형에 피타고라스 정리를 적용해 $S=2(x-6)^2+72$의 최솟값 $72$를 구한다.", "decisiveStep": "내접 정사각형 $EFGH$의 네 귀퉁이 직각삼각형이 합동이므로 $\\overline{EH}^2=x^2+(12-x)^2$임을 도출한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "조건식 활용"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_MODEL", "why": "high1.json 정본(H1-RPM-038, DIRECT_ACTIVE) 매핑: 내접 정사각형 넓이 최솟값"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정사각형에 내접하는 정사각형의 넓이를 이차함수로 세워 최솟값을 구하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최솟값", "src": "stem", "quote": "넓이의 최솟값을 구하고"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "S$를 완전제곱식으로 변형하면", "evidenceType": "NAMED"}], "given": [{"term": "정사각형", "src": "stem", "quote": "정사각형 $ABCD$에"}], "condition": [{"term": "직각삼각형", "src": "solution", "quote": "네 귀퉁이의 직각삼각형"}]}, "reasons": {"method": "합동 직각삼각형으로 넓이 이차식을 세우고 완전제곱식으로 최솟값 72를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

