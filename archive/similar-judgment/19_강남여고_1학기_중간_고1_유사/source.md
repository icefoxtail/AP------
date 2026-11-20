

```
{"stem": "19_강남여고_1학기_중간_고1_유사", "sourceArchiveFile": "original/high/h1/1mid/19_강남여고_1학기_중간_고1_기출.js", "examFolder": "1mid", "grade": "고1", "curriculum": "2015", "questionCount": 26, "totalScore": 100, "generatedAt": "2026-11-20"}
```

## Q01

- 형식: 객관식  
- 배점: 2.5

### 발문

등식 \$x^2+ax+6=x(x+3)+b\$가 \$x\$에 대한 항등식일 때, 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$9\$ ② \$7\$ ③ \$5\$ ④ \$11\$ ⑤ \$13\$

### 정답

①

### 해설

우변을 전개하면 \$x(x+3)+b=x^2+3x+b\$이다. \$x\$에 대한 항등식이므로 계수를 비교하면 \$a=3, b=6\$이고, \$a+b=3+6=9\$이다.

```
{"status": "EXEMPT", "reason": "이차 항등식의 계수 비교로 a+b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-IDENTITY", "conceptClusterKey": null, "primaryMethod": "우변 $x(x+3)+b=x^2+3x+b$를 전개해 좌변과 계수비교법으로 $a=3, b=6$을 구한다.", "decisiveStep": "일차항 계수와 상수항을 각각 비교해 $a=3, b=6$을 즉시 얻는다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-007(DIRECT_ACTIVE): 항등식 전개 후 계수비교법으로 미정계수 a, b를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항등식에서 전개와 계수비교법을 한 번 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b$에 대하여"}], "method": [{"term": "계수비교", "src": "solution", "quote": "계수를 비교하면", "evidenceType": "NAMED"}], "given": [{"term": "항등식", "src": "stem", "quote": "$x$에 대한 항등식"}], "condition": []}, "reasons": {"method": "우변 전개 후 계수비교법으로 a=3, b=6을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 2.5

### 발문

\$x^3-27=(x-a)(x^2+bx+9)\$일 때, 두 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$0\$ ② \$3\$ ③ \$6\$ ④ \$9\$ ⑤ \$12\$

### 정답

③

### 해설

\$x^3-27=x^3-3^3=(x-3)(x^2+3x+9)\$이므로 \$a=3, b=3\$이고 \$a+b=6\$이다.

```
{"status": "EXEMPT", "reason": "세제곱의 차 인수분해 공식으로 a, b를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "세제곱의 차 인수분해 공식 $x^3-3^3=(x-3)(x^2+3x+9)$를 적용해 $a=3, b=3$을 구한다.", "decisiveStep": "$27=3^3$으로 보고 $A^3-B^3$ 인수분해 공식을 바로 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해 공식", "l4": "합과 차"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-016(DIRECT_ACTIVE): 세제곱의 차 인수분해 공식으로 a, b를 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세제곱의 차 인수분해 공식을 직접 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "두 상수 $a, b$에 대하여"}], "method": [{"term": "인수분해", "src": "solution", "quote": "(x-3)(x^2+3x+9)", "evidenceType": "IMPLIED", "justification": "A^3-B^3=(A-B)(A^2+AB+B^2) 인수분해 공식을 적용함"}], "given": [{"term": "다항식", "src": "stem", "quote": "$x^3-27=(x-a)(x^2+bx+9)$"}], "condition": []}, "reasons": {"method": "세제곱의 차 인수분해 공식으로 a=3, b=3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 2.5

### 발문

이차함수 \$y=-x^2+2ax+b-5\$가 \$x=4\$일 때 최댓값 \$7\$을 갖는다. 두 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$-8\$ ② \$-4\$ ③ \$4\$ ④ \$8\$ ⑤ \$0\$

### 정답

⑤

### 해설

완전제곱식으로 정리하면 \$\$ y \= \-(x^2-2ax)+b-5 \= \-(x-a)^2+a^2+b-5 \$\$ 이다. \$x=4\$에서 최댓값 \$7\$을 가지므로 \$a=4\$이고, \$a^2+b-5=16+b-5=7 \\implies b=-4\$이다. 따라서 \$a+b=4+(-4)=0\$이다.

```
{"status": "EXEMPT", "reason": "이차함수를 표준형으로 고쳐 꼭짓점 좌표와 (4, 7)을 비교하는 순수 함수 문항임"}
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$y=-(x-a)^2+a^2+b-5$로 고쳐 꼭짓점 $(a, a^2+b-5)=(4, 7)$에서 $a, b$를 구한다.", "decisiveStep": "최댓값 조건에서 $a=4$와 $a^2+b-5=7$을 순서대로 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 이차함수 표준형 꼭짓점으로 최댓값 조건을 해석함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수 표준형 변형으로 꼭짓점을 구해 계수를 정하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "두 상수 $a, b$에 대하여"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "완전제곱식으로 정리하면", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=-x^2+2ax+b-5$"}], "condition": [{"term": "최댓값", "src": "stem", "quote": "최댓값 $7$을 갖는다"}]}, "reasons": {"method": "완전제곱식으로 꼭짓점 (4, 7)을 비교해 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 2.5

### 발문

삼차방정식 \$x^3-2x^2+ax-3=0\$의 한 근이 \$1\$일 때, 상수 \$a\$의 값은?

### 선지

① \$2\$ ② \$4\$ ③ \$6\$ ④ \$3\$ ⑤ \$5\$

### 정답

②

### 해설

한 근이 \$1\$이므로 \$x=1\$을 대입하면 \$1^3-2(1)^2+a(1)-3=0 \\implies a-4=0\$, 즉 \$a=4\$이다.

```
{"status": "EXEMPT", "reason": "방정식의 한 근 x=1을 대입해 상수 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "삼차방정식의 한 근 $x=1$을 좌변에 직접 대입해 $1-2+a-3=0$에서 $a=4$를 구한다.", "decisiveStep": "근의 정의에 따라 $x=1$을 바로 대입한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY): 삼차방정식의 한 근 대입으로 미정계수를 구하는 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "방정식의 근을 대입해 미정계수를 구하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a$의 값은?"}], "method": [{"term": "대입", "src": "solution", "quote": "$x=1$을 대입하면", "evidenceType": "NAMED"}], "given": [{"term": "삼차방정식", "src": "stem", "quote": "삼차방정식 $x^3-2x^2+ax-3=0$"}], "condition": []}, "reasons": {"method": "주어진 근 x=1을 대입해 a=4를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q05

- 형식: 객관식  
- 배점: 3

### 발문

\$x=1+\\sqrt{2}\$, \$y=1-\\sqrt{2}\$일 때, \$x^3-y^3\$의 값은?

### 선지

① \$4\\sqrt{2}\$ ② \$6\\sqrt{2}\$ ③ \$8\\sqrt{2}\$ ④ \$10\\sqrt{2}\$ ⑤ \$12\\sqrt{2}\$

### 정답

④

### 해설

\$x-y=2\\sqrt{2}\$, \$xy=(1+\\sqrt{2})(1-\\sqrt{2})=1-2=-1\$이므로 \$\$ x^3-y^3 \= (x-y)^3+3xy(x-y) \= (2\\sqrt{2})^3+3(-1)(2\\sqrt{2}) \= 16\\sqrt{2}-6\\sqrt{2} \= 10\\sqrt{2} \$\$ 이다.

```
{"status": "EXEMPT", "reason": "켤레무리수의 차와 곱을 구해 세제곱의 차 곱셈 공식에 대입하는 순수 대수 문항임"}
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$x-y=2\\sqrt{2}, xy=-1$을 구한 뒤 곱셈 공식의 변형 $x^3-y^3=(x-y)^3+3xy(x-y)$에 대입한다.", "decisiveStep": "$x-y$와 $xy$를 먼저 구해 세제곱 전개 계산을 줄인다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 켤레무리수의 차와 곱으로 세제곱 차 곱셈공식 변형 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레무리수의 차와 곱에 세제곱 차 곱셈 공식 변형을 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "곱셈공식", "src": "solution", "quote": "(x-y)^3+3xy(x-y)"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "(x-y)^3+3xy(x-y)", "evidenceType": "IMPLIED", "justification": "세제곱의 차 곱셈 공식 변형에 x-y와 xy를 대입함"}], "given": [{"term": "무리수", "src": "stem", "quote": "$x=1+\\sqrt{2}$, $y=1-\\sqrt{2}$"}], "condition": []}, "reasons": {"method": "x-y와 xy를 구해 세제곱 차 변형 공식에 대입함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3

### 발문

\$x^2+xy-2y-4\$를 인수분해하였을 때, 다음 중 이 다항식의 인수인 것은?

### 선지

① \$x+y+2\$ ② \$x+y-2\$ ③ \$x-y+2\$ ④ \$y-2\$ ⑤ \$x+2\$

### 정답

①

### 해설

차수가 가장 낮은 문자 \$y\$에 대하여 내림차순으로 정리하면 \$\$ x^2+xy-2y-4 \= (x-2)y+(x^2-4) \= (x-2)y+(x-2)(x+2) \= (x-2)(x+y+2) \$\$ 이다. 따라서 보기 중 인수는 \$x+y+2\$이다.

```
{"status": "EXEMPT", "reason": "두 문자 다항식을 낮은 차수 y에 대해 정리해 공통인수 x-2로 인수분해하는 문항임"}
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "일차인 문자 $y$에 대하여 $(x-2)y+(x^2-4)$로 묶은 뒤 공통인수 $x-2$로 인수분해한다.", "decisiveStep": "$x^2-4=(x-2)(x+2)$를 인수분해해 공통인수 $(x-2)$를 뽑아낸다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 낮은 차수 문자 y로 내림차순 정리 후 공통인수 묶기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "낮은 차수 문자에 대한 내림차순 정리와 공통인수 묶기를 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "이 다항식의 인수인 것은?"}], "method": [{"term": "인수분해", "src": "stem", "quote": "인수분해하였을 때", "evidenceType": "IMPLIED", "justification": "y에 대해 정리한 뒤 공통인수 (x-2)로 인수분해함"}], "given": [{"term": "다항식", "src": "stem", "quote": "$x^2+xy-2y-4$"}], "condition": []}, "reasons": {"method": "y에 대해 정리 후 공통인수 x-2로 묶어 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3

### 발문

이차함수 \$y=x^2+7x+8\$의 그래프와 직선 \$y=x+k\$가 서로 다른 두 점에서 만날 때, 실수 \$k\$의 값의 범위는?

### 선지

① \$k\<-1\$ ② \$k\>-\\dfrac{1}{4}\$ ③ \$k\>-1\$ ④ \$k\>1\$ ⑤ \$k\<1\$

### 정답

③

### 해설

두 그래프가 서로 다른 두 점에서 만나므로 연립방정식 \$x^2+7x+8=x+k\$, 즉 \$x^2+6x+(8-k)=0\$이 서로 다른 두 실근을 가져야 한다. 따라서 판별식 \$\\dfrac{D}{4}=3^2-(8-k)=k+1\>0\$이므로 \$k\>-1\$이다.

```
{"status": "EXEMPT", "reason": "이차함수와 직선의 두 교점 조건을 판별식 D>0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "연립방정식 $x^2+6x+8-k=0$의 짝수 판별식 $\\frac{D}{4}=k+1>0$을 풀어 $k>-1$을 구한다.", "decisiveStep": "서로 다른 두 교점 조건을 연립방정식의 $D>0$으로 전환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "직선과 포물선", "l4": "교점 개수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_INTERSECTION_TANGENCY", "why": "high1.json H1-RPM-035(DIRECT_ACTIVE): 이차함수와 직선의 서로 다른 두 교점 조건에 판별식 D>0 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수와 직선의 두 교점 조건에 판별식 $D>0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "범위", "src": "stem", "quote": "실수 $k$의 값의 범위는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $\\dfrac{D}{4}=3^2-(8-k)=k+1>0$", "evidenceType": "NAMED"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2+7x+8$"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값의 범위"}]}, "reasons": {"method": "연립방정식 판별식 D/4>0을 풀어 k>-1을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3

### 발문

\$2\\le x\\le a\$에서 이차함수 \$y=x^2-4x\$의 최댓값이 \$21\$, 최솟값이 \$b\$일 때, 상수 \$a, b\$에 대하여 \$a+b\$의 값은?

### 선지

① \$-1\$ ② \$1\$ ③ \$2\$ ④ \$4\$ ⑤ \$3\$

### 정답

⑤

### 해설

\$y=x^2-4x=(x-2)^2-4\$이므로 구간 \$2\\le x\\le a\$ (\$a\\ge 2\$)에서 이차함수는 증가한다. 따라서 최솟값은 \$x=2\$일 때 \$b=-4\$이고, 최댓값은 \$x=a\$일 때 \$a^2-4a=21\$이다. \$a^2-4a-21=(a-7)(a+3)=0\$에서 \$a\\ge 2\$이므로 \$a=7\$이다. 그러므로 \$a+b=7+(-4)=3\$이다.

```
{"status": "EXEMPT", "reason": "축 x=2 오른쪽 구간 [2, a]에서 증가하는 이차함수의 최대·최소로 a, b를 구하는 문항임"}
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$y=(x-2)^2-4$가 $2\\le x\\le a$에서 증가하므로 $x=2$에서 최솟값 $b=-4$, $x=a$에서 최댓값 $21$을 이용해 $a=7$을 구한다.", "decisiveStep": "구간의 왼쪽 끝이 축 $x=2$이므로 $x=a$에서 최댓값이 됨을 확인한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 제한 구간 [2, a]에서 표준형 변형으로 최댓값·최솟값 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제한 범위 오른쪽 끝이 미지수 $a$인 이차함수의 최대·최소를 구하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "최댓값이 $21$, 최솟값이 $b$일 때"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x-2)^2-4", "evidenceType": "IMPLIED", "justification": "표준형으로 축 x=2를 확인하고 x=a에서 최댓값 21을 풀어 a를 구함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-4x$"}], "condition": [{"term": "범위", "src": "stem", "quote": "$2\\le x\\le a$에서"}]}, "reasons": {"method": "표준형 변형 후 증가 구간 [2, a]의 양 끝값으로 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 3.5

### 발문

다항식 \$x^3+ax^2+7x+b\$가 \$(x-1)^2\$으로 나누어떨어질 때, 상수 \$a, b\$에 대하여 \$ab\$의 값은?

### 선지

① \$12\$ ② \$15\$ ③ \$18\$ ④ \$20\$ ⑤ \$24\$

### 정답

②

### 해설

\$P(x)=x^3+ax^2+7x+b\$라 두고 \$x=1\$로 조립제법을 두 번 연속 적용하면

- 첫째 나머지: \$1+a+7+b=a+b+8=0\$  
- 첫째 몫은 \$x^2+(a+1)x+(a+8)\$이고, 이 몫도 \$x-1\$로 나누어떨어지므로 \$1+(a+1)+(a+8)=2a+10=0 \\implies a=-5\$이다. 이를 \$a+b+8=0\$에 대입하면 \$b=-3\$이므로 \$ab=(-5)(-3)=15\$이다.

```
{"status": "EXEMPT", "reason": "삼차식이 (x-1)^2으로 나누어떨어질 조건을 연속 조립제법으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$P(x)$를 $x-1$로 나눈 나머지 $a+b+8=0$과 그 몫에 $x=1$을 대입한 $2a+10=0$을 연립해 $a, b$를 구한다.", "decisiveStep": "$(x-1)^2$으로 나누어떨어지므로 $P(1)=0$뿐만 아니라 몫 $Q(1)=0$도 성립함을 적용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012(RPM_ONLY): (x-1)^2 인수정리/연속 조립제법으로 미정계수 결정, 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "$(x-1)^2$으로 나누어떨어질 조건에 연속 조립제법(또는 두 번의 인수정리)을 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "상수", "src": "stem", "quote": "상수 $a, b$에 대하여"}], "method": [{"term": "다항식의나눗셈", "src": "solution", "quote": "조립제법을 두 번 연속 적용하면", "evidenceType": "IMPLIED", "justification": "x=1로 조립제법을 두 번 수행해 두 나머지를 모두 0으로 둠"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $x^3+ax^2+7x+b$"}], "condition": []}, "reasons": {"method": "x=1 연속 조립제법의 두 나머지를 0으로 두어 a, b를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q10

- 형식: 객관식  
- 배점: 3.5

### 발문

\$x\$에 대한 이차방정식 \$x^2+6x+k-2=0\$이 실근을 갖도록 하는 모든 자연수 \$k\$의 개수는?

### 선지

① \$8\$ ② \$9\$ ③ \$10\$ ④ \$11\$ ⑤ \$12\$

### 정답

④

### 해설

이차방정식이 실근을 가지려면 판별식 \$D\\ge 0\$이어야 한다. \$\$ \\dfrac{D}{4} \= 3^2-(k-2) \= 11-k \\ge 0 \\implies k \\le 11 \$\$ 따라서 자연수 \$k\$는 \$1, 2, \\ldots, 11\$의 \$11\$개이다.

```
{"status": "EXEMPT", "reason": "이차방정식의 실근 조건 D>=0으로 자연수 개수를 세는 순수 대수 문항임"}
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-DISCRIMINANT", "conceptClusterKey": null, "primaryMethod": "짝수 판별식 $\\frac{D}{4}=11-k\\ge 0$을 풀어 $k\\le 11$을 만족하는 자연수 개수를 센다.", "decisiveStep": "'실근을 갖도록'에는 중근도 포함되므로 $D\\ge 0$을 적용한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-028(DIRECT_ACTIVE): 이차방정식의 실근 조건에 판별식 D>=0 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 실근 존재 조건에 판별식 $D\\ge 0$을 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "개수", "src": "stem", "quote": "자연수 $k$의 개수는?"}], "method": [{"term": "판별식", "src": "solution", "quote": "판별식 $D\\ge 0$이어야 한다", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+6x+k-2=0$"}], "condition": [{"term": "자연수", "src": "stem", "quote": "자연수 $k$의 개수는?"}]}, "reasons": {"method": "판별식 D/4>=0을 풀어 k<=11인 자연수 개수를 셈"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 3.5

### 발문

이차방정식 \$x^2+6x-a=0\$의 두 근의 차가 \$4\$일 때, 실수 \$a\$의 값은?

### 선지

① \$-5\$ ② \$-4\$ ③ \$-3\$ ④ \$-2\$ ⑤ \$-1\$

### 정답

①

### 해설

두 근의 차가 \$4\$이므로 두 근을 \$r, r+4\$라 두면 근과 계수의 관계에 의하여 \$\$ r+(r+4) \= 2r+4 \= \-6 \\implies 2r \= \-10 \\implies r \= \-5 \$\$ 이다. 따라서 두 근은 \$-5, \-1\$이고, 두 근의 곱은 \$(-5)(-1)=5=-a\$이므로 \$a=-5\$이다.

```
{"status": "EXEMPT", "reason": "두 근의 차 조건을 r, r+4로 놓고 근과 계수의 관계로 a를 구하는 순수 대수 문항임"}
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "두 근을 $r, r+4$로 두고 합 $-6$으로 $r=-5$를 구한 뒤 곱 $(-5)(-1)=-a$에서 $a=-5$를 구한다.", "decisiveStep": "두 근의 합으로 $r$을 먼저 결정하고 곱으로 미정계수 $a$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 두 근의 차 조건에 근과 계수의 관계 적용, exact binding 미구비"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 근의 차가 주어진 이차방정식에 근과 계수의 관계를 바로 적용하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $a$의 값은?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2+6x-a=0$"}], "condition": []}, "reasons": {"method": "두 근을 r, r+4로 두고 근과 계수의 관계로 a=-5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q12

- 형식: 객관식  
- 배점: 3.5

### 발문

연립방정식 \$\\begin{cases}x+y=k\\x^2-3x+y=1\\end{cases}\$이 오직 한 쌍의 해를 갖도록 하는 실수 \$k\$의 값은?

### 선지

① \$3\$ ② \$5\$ ③ \$7\$ ④ \$-3\$ ⑤ \$-5\$

### 정답

②

### 해설

\$y=k-x\$를 둘째 식에 대입하면 \$x^2-3x+(k-x)=1\$, 즉 \$x^2-4x+(k-1)=0\$이다. 연립방정식이 오직 한 쌍의 해를 가지려면 이 이차방정식이 중근을 가져야 하므로 \$\$ \\dfrac{D}{4} \= (-2)^2-(k-1) \= 5-k \= 0 \\implies k \= 5 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "일차·이차 연립방정식의 유일해 조건을 대입 후 판별식 D=0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-SUBSTITUTION_SYSTEM", "conceptClusterKey": null, "primaryMethod": "$y=k-x$를 대입한 $x^2-4x+k-1=0$이 중근을 갖도록 판별식 $\\frac{D}{4}=5-k=0$을 푼다.", "decisiveStep": "연립방정식의 유일해 조건을 소거된 이차방정식의 중근 조건 $D=0$으로 전환한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "연립방정식", "l4": "이차식이 포함된 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_SYSTEM_EQUATION", "templateKey": "TPL_H1_SYSTEM_DIRECT", "why": "high1.json H1-RPM-041(DIRECT_ACTIVE): 일차·이차 연립방정식에서 대입 소거 후 중근 판별식 적용"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연립방정식의 유일해 조건에 대입법과 판별식 $D=0$을 적용하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값은?"}], "method": [{"term": "판별식", "src": "solution", "quote": "\\dfrac{D}{4} = (-2)^2-(k-1) = 5-k = 0", "evidenceType": "IMPLIED", "justification": "y를 소거해 얻은 이차방정식에 중근 판별식 D=0을 적용함"}], "given": [{"term": "연립방정식", "src": "stem", "quote": "연립방정식"}], "condition": [{"term": "실수", "src": "stem", "quote": "실수 $k$의 값은?"}]}, "reasons": {"method": "y 소거 후 중근 판별식 D/4=0을 풀어 k=5를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q13

- 형식: 객관식  
- 배점: 4

### 발문

\$a=2+\\sqrt{3}\$, \$b=2-\\sqrt{3}\$일 때, \$a^2+b^2\$의 값을 \$m\$, \$a^3+b^3\$의 값을 \$n\$이라 할 때, \$m+n\$의 값은?

### 선지

① \$52\$ ② \$58\$ ③ \$62\$ ④ \$66\$ ⑤ \$70\$

### 정답

④

### 해설

\$a+b=4\$, \$ab=(2+\\sqrt{3})(2-\\sqrt{3})=4-3=1\$이므로 \$\$ m \= a^2+b^2 \= (a+b)^2-2ab \= 4^2-2\\cdot 1 \= 14 \$\$ \$\$ n \= a^3+b^3 \= (a+b)^3-3ab(a+b) \= 4^3-3\\cdot 1\\cdot 4 \= 52 \$\$ 이다. 따라서 \$m+n=14+52=66\$이다.

```
{"status": "EXEMPT", "reason": "켤레무리수의 합과 곱으로 제곱 합과 세제곱 합을 구해 더하는 순수 대수 문항임"}
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$a+b=4, ab=1$을 구해 곱셈 공식 변형으로 $m=a^2+b^2=14, n=a^3+b^3=52$를 각각 계산해 합한다.", "decisiveStep": "합과 곱 $a+b=4, ab=1$을 먼저 구해 두 대칭식을 동시에 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 켤레무리수의 합과 곱으로 대칭식 a^2+b^2, a^3+b^3 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레무리수의 합과 곱으로 $a^2+b^2$과 $a^3+b^3$을 함께 구하는 표준 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "stem", "quote": "$a^2+b^2$의 값을 $m$, $a^3+b^3$의 값을 $n$"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "(a+b)^2-2ab", "evidenceType": "IMPLIED", "justification": "곱셈 공식의 변형으로 제곱의 합과 세제곱의 합을 구함"}], "given": [{"term": "무리수", "src": "stem", "quote": "$a=2+\\sqrt{3}$, $b=2-\\sqrt{3}$"}], "condition": []}, "reasons": {"method": "a+b, ab를 구해 곱셈 공식 변형으로 m+n=66을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4

### 발문

다음 중 \$x^4-7x^2+1\$의 인수인 것은?

### 선지

① \$x-1\$ ② \$x^2+1\$ ③ \$x^2-3x+1\$ ④ \$x^2-7x+1\$ ⑤ \$x^2+3x-1\$

### 정답

③

### 해설

주어진 복이차식을 완전제곱의 차 \$A^2-B^2\$ 꼴로 변형하면 \$\$ x^4-7x^2+1 \= (x^4+2x^2+1)-9x^2 \= (x^2+1)^2-(3x)^2 \= (x^2-3x+1)(x^2+3x+1) \$\$ 이다. 따라서 보기 중 인수인 것은 \$x^2-3x+1\$이다.

```
{"status": "EXEMPT", "reason": "복이차식을 완전제곱식의 차 A^2-B^2 꼴로 변형해 인수분해하는 순수 대수 문항임"}
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-03", "subUnitKey": "H15-SA-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "복이차식 $x^4-7x^2+1$을 $(x^2+1)^2-(3x)^2$으로 변형한 뒤 합차 공식으로 인수분해한다.", "decisiveStep": "$-7x^2$을 $+2x^2-9x^2$으로 쪼개어 완전제곱식의 차를 만든다.", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "공통인수", "l4": "단계적 인수분해"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_STANDARD", "why": "high1.json H1-RPM-014(DIRECT_ACTIVE): 복이차식을 완전제곱식의 차 A^2-B^2 꼴로 변형해 단계적으로 인수분해함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복이차식을 $A^2-B^2$ 꼴로 변형해 인수분해하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "인수", "src": "stem", "quote": "인수인 것은?"}], "method": [{"term": "복이차식", "src": "solution", "quote": "복이차식을 완전제곱의 차", "evidenceType": "NAMED"}], "given": [{"term": "복이차식", "src": "stem", "quote": "$x^4-7x^2+1$"}], "condition": []}, "reasons": {"method": "복이차식을 (x^2+1)^2-(3x)^2으로 변형해 인수분해함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4

### 발문

복소수 \$z=1+2i\$에 대하여 \$\\omega=\\dfrac{z+1}{z-1}\$일 때, \$\\omega\\bar{\\omega}\$의 값은? (단, \$i=\\sqrt{-1}\$이고, \$\\bar{\\omega}\$는 \$\\omega\$의 켤레복소수이다.)

### 선지

① \$1\$ ② \$\\sqrt{2}\$ ③ \$4\$ ④ \$5\$ ⑤ \$2\$

### 정답

⑤

### 해설

\$z=1+2i\$를 대입하면 \$\$ \\omega \= \\dfrac{(1+2i)+1}{(1+2i)-1} \= \\dfrac{2+2i}{2i} \= \\dfrac{1+i}{i} \= \\dfrac{1}{i}+1 \= 1-i \$\$ 이다. 따라서 \$\\bar{\\omega}=1+i\$이므로 \$\\omega\\bar{\\omega}=(1-i)(1+i)=1-i^2=2\$이다.

```
{"status": "EXEMPT", "reason": "복소수를 대입해 분모를 실수화하고 켤레복소수와의 곱을 계산하는 순수 대수 문항임"}
```

```
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=1+2i$를 대입해 $\\omega=1-i$를 구한 뒤 켤레복소수 $\\bar{\\omega}=1+i$와의 곱을 계산한다.", "decisiveStep": "$\\frac{2+2i}{2i}=1-i$로 간단히 한 뒤 $\\omega\\bar{\\omega}=1^2+(-1)^2=2$를 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 연산", "l4": "켤레복소수"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_CONJUGATE_NORM", "why": "high1.json H1-RPM-024(DIRECT_ACTIVE): 복소수 나눗셈 정리 후 켤레복소수와의 곱을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 나눗셈과 켤레복소수 곱의 계산을 순서대로 수행하는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "켤레복소수", "src": "stem", "quote": "$\\bar{\\omega}$는 $\\omega$의 켤레복소수이다"}], "method": [{"term": "켤레복소수", "src": "stem", "quote": "$\\bar{\\omega}$는 $\\omega$의 켤레복소수이다", "evidenceType": "IMPLIED", "justification": "w=1-i를 구한 뒤 켤레복소수 1+i와의 곱을 계산함"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=1+2i$"}], "condition": []}, "reasons": {"method": "z=1+2i 대입 후 w=1-i와 켤레복소수의 곱 2를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차함수 \$y=x^2-2ax+a^2+a-3\$의 그래프가 \$x\$축과 만나도록 하는 정수 \$a\$의 최댓값은?

### 선지

① \$3\$ ② \$2\$ ③ \$1\$ ④ \$4\$ ⑤ \$5\$

### 정답

①

### 해설

\$y=x^2-2ax+a^2+a-3=(x-a)^2+a-3\$이므로 아래로 볼록하고 최솟값은 \$a-3\$이다. 그래프가 \$x\$축과 만나려면 최솟값이 \$0\$ 이하이어야 하므로 \$a-3\\le 0 \\implies a\\le 3\$이다. 따라서 정수 \$a\$의 최댓값은 \$3\$이다.

```
{"status": "EXEMPT", "reason": "아래로 볼록 이차함수의 x축 교점 조건을 꼭짓점 y좌표<=0으로 푸는 순수 대수 문항임"}
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-05", "subUnitKey": "H15-SA-05-EQUATION_FUNCTION_RELATION", "conceptClusterKey": null, "primaryMethod": "완전제곱식 $y=(x-a)^2+a-3$의 꼭짓점 $y$좌표 $a-3\\le 0$을 풀어 정수 최댓값 $3$을 구한다.", "decisiveStep": "$x$축과 만날 조건을 꼭짓점의 $y$좌표 $a-3\\le 0$으로 해석한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "x축과의 교점"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-033(DIRECT_ACTIVE): 이차함수 그래프의 x축 교점 조건을 꼭짓점 y좌표 <= 0으로 해석함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 $x$축 교점 조건을 완전제곱식의 꼭짓점 부호로 푸는 기본 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "정수 $a$의 최댓값은?"}], "method": [{"term": "완전제곱식", "src": "solution", "quote": "(x-a)^2+a-3", "evidenceType": "IMPLIED", "justification": "완전제곱식으로 꼭짓점의 y좌표를 구해 <=0 조건을 적용함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $y=x^2-2ax+a^2+a-3$"}], "condition": [{"term": "정수", "src": "stem", "quote": "정수 $a$의 최댓값은?"}]}, "reasons": {"method": "표준형 변형 후 꼭짓점 y좌표 a-3<=0으로 정수 최댓값 3을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.5

### 발문

다음 조건을 만족시키는 다항식 \$f(x)\$를 \$x^2-3x+2\$로 나눈 나머지를 \$R(x)\$라 할 때, \$R(6)\$의 값은?

(가) \$xf(x-1)\$을 \$x-2\$로 나눈 나머지는 \$8\$이다. (나) \$(x+3)f(x+1)\$을 \$x-1\$로 나눈 나머지는 \$32\$이다.

### 선지

① \$18\$ ② \$20\$ ③ \$24\$ ④ \$26\$ ⑤ \$28\$

### 정답

③

### 해설

조건 (가)에 \$x=2\$를 대입하면 \$2f(1)=8 \\implies f(1)=4\$이다. 조건 (나)에 \$x=1\$을 대입하면 \$4f(2)=32 \\implies f(2)=8\$이다. \$x^2-3x+2=(x-1)(x-2)\$로 나눈 나머지 \$R(x)=px+q\$라 하면 \$\$ R(1)=p+q=4, \\qquad R(2)=2p+q=8 \$\$ 이므로 \$p=4, q=0\$이다. 따라서 \$R(x)=4x\$이고 \$R(6)=24\$이다.

```
{"status": "EXEMPT", "reason": "나머지정리로 f(1), f(2) 값을 얻어 (x-1)(x-2)로 나눈 일차 나머지를 결정하는 문항임"}
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "나머지정리로 $f(1)=4, f(2)=8$을 구한 뒤 $R(x)=px+q$에 대입해 $R(x)=4x$를 얻어 $R(6)$을 계산한다.", "decisiveStep": "두 조건에서 얻은 $f(1), f(2)$를 $(x-1)(x-2)$로 나눈 나머지 $R(x)$에 바로 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): 두 조건으로 f(1), f(2)를 얻어 합성 제수 (x-1)(x-2)로 나눈 나머지를 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "변형 다항식의 나머지정리와 이차식으로 나눈 나머지 결정을 연속 적용하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나눈 나머지를 $R(x)$라 할 때"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "2f(1)=8", "evidenceType": "IMPLIED", "justification": "나머지정리로 x=2, x=1을 대입해 f(1), f(2)를 구하고 R(x)를 결정함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "나머지정리로 f(1)=4, f(2)=8을 구해 R(x)=4x를 결정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.5

### 발문

최고차항의 계수가 \$1\$이고, \$f(2)=g(2)=0\$인 두 이차다항식 \$f(x), g(x)\$가 있다. \$f(x)+g(x)\$를 \$x-1\$로 나눈 나머지가 \$3\$일 때, \$f(4)+g(4)\$의 값은?

### 선지

① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$

### 정답

②

### 해설

\$f(2)=g(2)=0\$이고 두 이차다항식의 최고차항 계수가 모두 \$1\$이므로 \$\$ f(x)=(x-2)(x+r), \\qquad g(x)=(x-2)(x+s) \$\$ 이라 두자. \$h(x)=f(x)+g(x)=(x-2)(2x+r+s)\$라 하면 \$h(1)=3\$이므로 \$\$ (1-2)(2+r+s)=3 \\implies r+s=-5 \$\$ 이다. 따라서 \$f(4)+g(4)=h(4)=(4-2)(8-5)=2\\cdot 3=6\$이다.

```
{"status": "EXEMPT", "reason": "공통인수 (x-2)를 갖는 두 이차다항식의 합 h(x)에 나머지정리 h(1)=3을 적용하는 문항임"}
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$f(x)+g(x)=(x-2)(2x+r+s)$로 합을 묶어 $h(1)=3$에서 $r+s=-5$를 구하고 $h(4)$를 계산한다.", "decisiveStep": "$r, s$를 개별적으로 구하지 않고 합 $r+s$만으로 $h(4)$가 결정됨을 이용한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "인수정리", "l4": "미정계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-012(RPM_ONLY): 인수정리로 두 이차식의 공통인수 (x-2)를 설정하고 미정계수 합을 결정, 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "인수정리로 두 이차식의 합을 표현하고 나머지정리로 $r+s$를 구하는 표준 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "다항식", "src": "stem", "quote": "두 이차다항식 $f(x), g(x)$"}], "method": [{"term": "인수정리", "src": "solution", "quote": "f(x)=(x-2)(x+r)", "evidenceType": "IMPLIED", "justification": "f(2)=g(2)=0에서 인수정리로 (x-2) 인수를 설정해 합을 간단히 함"}], "given": [{"term": "다항식", "src": "stem", "quote": "두 이차다항식 $f(x), g(x)$"}], "condition": []}, "reasons": {"method": "공통인수 x-2로 f(x)+g(x)를 묶고 h(1)=3으로 r+s를 구함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q19

- 형식: 객관식  
- 배점: 4.5

### 발문

이차함수 \$f(x)=x^2+ax+b\$에서 \$f(-4)=f(2)\$가 성립할 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? (단, \$a, b\$는 상수이다.)

\<보기\> ㄱ. \$f(x)\$의 최솟값은 \$f(-1)\$이다. ㄴ. \$-\\dfrac{8}{3}\\le x\\le \\dfrac{1}{3}\$에서 \$f(x)\$의 최댓값은 \$f\\left(\\dfrac{1}{3}\\right)\$이다. ㄷ. \$b\>1\$이면 모든 실수 \$x\$에 대하여 \$f(x)\>0\$이다.

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

\$f(-4)=f(2)\$에서 대칭축은 \$x=\\dfrac{-4+2}{2}=-1\$이므로 \$a=2\$이고 \$f(x)=(x+1)^2+b-1\$이다.

- ㄱ. 아래로 볼록하고 축이 \$x=-1\$이므로 최솟값은 \$f(-1)\$이다. (참)  
- ㄴ. 축 \$x=-1\$에서 양 끝점까지의 거리는 \$\\left\|-\\dfrac{8}{3}-(-1)\\right\|=\\dfrac{5}{3}\$, \$\\left\|\\dfrac{1}{3}-(-1)\\right\|=\\dfrac{4}{3}\$이므로 최댓값은 \$f\\left(-\\dfrac{8}{3}\\right)\$이다. (거짓)  
- ㄷ. \$b\>1\$이면 \$b-1\>0\$이므로 모든 실수 \$x\$에 대하여 \$f(x)=(x+1)^2+(b-1)\>0\$이다. (참) 따라서 옳은 것은 ㄱ, ㄷ이다.

```
{"status": "EXEMPT", "reason": "f(-4)=f(2)에서 대칭축 x=-1을 구해 최솟값, 제한구간 최댓값, 절대부등식을 판정하는 합답형 문항임"}
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-13", "subUnitKey": "H15-SA-13-QUADRATIC_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$f(-4)=f(2)$에서 축 $x=-1$을 구해 $f(x)=(x+1)^2+b-1$을 얻고, 축과의 거리 비교 및 $b>1$ 조건으로 ㄱ, ㄴ, ㄷ을 판정한다.", "decisiveStep": "축 $x=-1$로부터 양 끝점까지의 거리 $\\frac{5}{3}$와 $\\frac{4}{3}$를 비교해 ㄴ이 거짓임을 판별한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-037(DIRECT_ACTIVE): 대칭축 x=-1을 구해 최솟값과 제한 구간 최댓값을 판정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 대칭성, 제한 구간 거리 비교 최댓값, 이차절대부등식을 함께 묻는 합답형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "최댓값", "src": "stem", "quote": "$f(x)$의 최댓값은"}], "method": [{"term": "축", "src": "solution", "quote": "대칭축은 $x=\\dfrac{-4+2}{2}=-1$", "evidenceType": "IMPLIED", "justification": "대칭축 x=-1을 구해 꼭짓점 최솟값, 거리 비교 최댓값, 절대부등식을 판정함"}], "given": [{"term": "이차함수", "src": "stem", "quote": "이차함수 $f(x)=x^2+ax+b$"}], "condition": []}, "reasons": {"method": "f(-4)=f(2)에서 축 x=-1을 구해 ㄱ, ㄴ, ㄷ을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q20

- 형식: 객관식  
- 배점: 4.5

### 발문

\$f(x)=x^3-ax^2+bx-c\$이고 방정식 \$f(x)=0\$의 세 근이 \$\\alpha, \\beta, \\gamma\$일 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은?

\<보기\> ㄱ. 방정식 \$f(3x)=0\$의 세 근은 \$\\dfrac{\\alpha}{3}, \\dfrac{\\beta}{3}, \\dfrac{\\gamma}{3}\$이다. ㄴ. 방정식 \$f\\left(\\dfrac{x}{3}\\right)=0\$의 세 근의 합이 \$6\$이면 \$a=2\$이다. ㄷ. \$\\alpha=1\$이고 방정식 \$f(2x-1)=0\$의 세 근의 곱이 \$0\$이면 \$b=1\$이다.

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ

### 정답

⑤

### 해설

- ㄱ. \$f(3x)=0\$에서 \$3x=\\alpha, \\beta, \\gamma\$이므로 세 근은 \$\\dfrac{\\alpha}{3}, \\dfrac{\\beta}{3}, \\dfrac{\\gamma}{3}\$이다. (참)  
- ㄴ. \$f\\left(\\dfrac{x}{3}\\right)=0\$의 세 근은 \$3\\alpha, 3\\beta, 3\\gamma\$이고, 그 합은 \$3(\\alpha+\\beta+\\gamma)=3a=6\$이므로 \$a=2\$이다. (참)  
- ㄷ. \$f(2x-1)=0\$의 세 근은 \$\\dfrac{\\alpha+1}{2}, \\dfrac{\\beta+1}{2}, \\dfrac{\\gamma+1}{2}\$이고, 세 근의 곱이 \$0\$이면 \$f(x)=0\$의 한 근이 \$-1\$이다. 이미 \$\\alpha=1\$이므로 세 근을 \$1, \-1, \\gamma\$라 하면 \$b=1(-1)+(-1)\\gamma+\\gamma(1)=-1\\ne 1\$이다. (거짓) 따라서 옳은 것은 ㄱ, ㄴ이다.

```
{"status": "EXEMPT", "reason": "삼차방정식 f(px+q)=0의 근 변환과 근과 계수의 관계를 판정하는 합답형 문항임"}
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-EQUATION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "$f(px+q)=0$의 근이 $\\frac{r-q}{p}$ 꼴임을 이용해 세 근의 합·곱에 근과 계수의 관계를 적용한다.", "decisiveStep": "ㄷ에서 $f(2x-1)=0$의 한 근이 $0$이면 원래 방정식의 한 근이 $-1$임을 도출해 $b=-1$을 구한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "방정식의 활용", "l4": "근의 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-043(RPM_ONLY): 삼차방정식 일차 치환 근 변환과 근과 계수의 관계 결합 문항으로 대응 ACTIVE 키 미확정"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항방정식의 일차 치환 근 변환과 삼차방정식 근과 계수의 관계를 결합한 합답형 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "삼차방정식", "src": "stem", "quote": "방정식 $f(x)=0$의 세 근이"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "3(\\alpha+\\beta+\\gamma)=3a=6", "evidenceType": "IMPLIED", "justification": "일차 변환된 방정식의 근을 구해 삼차방정식 근과 계수의 관계를 적용함"}], "given": [{"term": "삼차식", "src": "stem", "quote": "$f(x)=x^3-ax^2+bx-c$"}], "condition": []}, "reasons": {"method": "f(px+q)=0의 근 변환과 근과 계수의 관계로 ㄱ, ㄴ, ㄷ을 판정함"}, "steps": [], "scenarioNote": ""}, "hold": "RPM_ONLY"}
```

## Q21

- 형식: 객관식  
- 배점: 5

### 발문

오른쪽 그림과 같이 한 변의 길이가 \$12\$인 정사각형 \$ABCD\$에 내접하는 원이 있다. 원 위의 점 \$P\$에서 선분 \$AB\$에 내린 수선의 발을 \$Q\$, 선분 \$BC\$에 내린 수선의 발을 \$R\$라 하자. 직사각형 \$PQBR\$의 둘레의 길이가 \$32\$, 넓이가 \$50\$일 때, 선분 \$DP\$의 길이는?

### 선지

① \$2\\sqrt{15}\$ ② \$3\\sqrt{7}\$ ③ \$4\\sqrt{3}\$ ④ \$8\$ ⑤ \$2\\sqrt{17}\$

### 정답

①

### 해설

\$B(0, 0), C(12, 0), A(0, 12), D(12, 12)\$로 좌표평면 위에 놓고 \$P(x, y)\$라 하면 \$\\overline{PQ}=x, \\overline{PR}=y\$이다. 직사각형 \$PQBR\$의 둘레가 \$32\$, 넓이가 \$50\$이므로 \$\$ 2(x+y)=32 \\implies x+y=16, \\qquad xy=50 \$\$ 이다. 따라서 \$x^2+y^2=(x+y)^2-2xy=16^2-2\\cdot 50=156\$이다. 점 \$D(12, 12)\$와 점 \$P(x, y)\$ 사이의 거리의 제곱은 \$\$ \\overline{DP}^2 \= (12-x)^2+(12-y)^2 \= x^2+y^2-24(x+y)+288 \= 156-24\\cdot 16+288 \= 60 \$\$ 이므로 \$\\overline{DP}=\\sqrt{60}=2\\sqrt{15}\$이다.

```
{"status": "READY", "pattern": "construction-spike-v1", "viewBox": "0 0 320 320", "elements": [{"type": "polygon", "id": "square_ABCD", "points": [[40, 280], [280, 280], [280, 40], [40, 40]], "labels": ["B", "C", "D", "A"]}, {"type": "circle", "id": "inscribed_circle", "center": [160, 160], "radius": 120}, {"type": "polygon", "id": "rect_PQBR", "points": [[40, 280], [40, 100], [180, 100], [180, 280]], "labels": ["B", "Q", "P", "R"]}, {"type": "segment", "id": "seg_DP", "points": [[280, 40], [180, 100]]}, {"type": "label", "pos": [160, 300], "text": "$12$"}], "note": "한 변이 12인 정사각형 ABCD와 내접원, 원 위의 점 P에서 AB, BC에 내린 수선의 발 Q, R 및 선분 DP 도식"}
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-01", "subUnitKey": "H15-SA-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "$B$를 원점으로 좌표를 잡아 $x+y=16, xy=50$에서 $x^2+y^2=156$을 구한 뒤 $\\overline{DP}^2=(12-x)^2+(12-y)^2$을 계산한다.", "decisiveStep": "둘레와 넓이 조건을 합 $x+y$와 곱 $xy$로 번역해 대칭식 $(12-x)^2+(12-y)^2$에 대입한다.", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-003(DIRECT_ACTIVE): 도형 조건을 x+y, xy로 번역해 곱셈공식 변형으로 선분 길이를 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정사각형 도형을 좌표로 해석하고 곱셈 공식 변형으로 선분 길이를 구하는 중상 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "길이", "src": "stem", "quote": "선분 $DP$의 길이는?"}], "method": [{"term": "곱셈공식", "src": "solution", "quote": "(x+y)^2-2xy", "evidenceType": "IMPLIED", "justification": "좌표 설정 후 둘레·넓이를 x+y, xy로 바꾸어 곱셈 공식으로 DP^2을 계산함"}], "given": [{"term": "정사각형", "src": "stem", "quote": "정사각형 $ABCD$"}], "condition": [{"term": "내접", "src": "stem", "quote": "내접하는 원"}]}, "reasons": {"method": "좌표 설정과 곱셈 공식 변형으로 선분 DP의 길이를 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q22

- 형식: 객관식  
- 배점: 5

### 발문

다음 조건을 만족시키는 실수 \$a, b\$의 순서쌍 \$(a, b)\$의 개수는?

이차방정식 \$x^2-ax+b=0\$의 서로 다른 두 실근은 \$\\alpha, \\beta\$이고, 이차방정식 \$x^2-7ax+3b^2=0\$의 서로 다른 두 실근은 \$\\alpha^3, \\beta^3\$이다.

### 선지

① \$2\$개 ② \$4\$개 ③ \$3\$개 ④ \$5\$개 ⑤ \$6\$개

### 정답

②

### 해설

근과 계수의 관계에 의하여 \$\\alpha+\\beta=a, \\alpha\\beta=b\$이고, \$\\alpha^3+\\beta^3=7a, \\alpha^3\\beta^3=3b^2\$이다. 따라서 \$a^3-3ab=7a\$이고 \$b^3=3b^2 \\implies b^2(b-3)=0\$이므로 \$b=0\$ 또는 \$b=3\$이다.

1) \$b=0\$일 때: \$a^3=7a \\implies a(a^2-7)=0\$에서 \$a=0\$ 또는 \$a=\\pm\\sqrt{7}\$. \$a=0\$이면 \$x^2=0\$으로 중근이므로 제외하고, \$a=\\pm\\sqrt{7}\$이면 서로 다른 두 실근 \$0, a\$를 가지므로 \$(a, b)=(\\sqrt{7}, 0), (-\\sqrt{7}, 0)\$의 \$2\$개.  
2) \$b=3\$일 때: \$a^3-9a=7a \\implies a(a^2-16)=0\$에서 \$a=0\$ 또는 \$a=\\pm 4\$. \$a=0\$이면 \$x^2+3=0\$으로 실근이 없으므로 제외하고, \$a=\\pm 4\$이면 판별식 \$D=a^2-4b=16-12=4\>0\$이므로 \$(4, 3), (-4, 3)\$의 \$2\$개. 따라서 순서쌍 \$(a, b)\$는 모두 \$4\$개이다.

```
{"status": "EXEMPT", "reason": "두 이차방정식의 근과 계수의 관계 및 판별식 D>0 조건을 경우 분류해 순서쌍 개수를 세는 문항임"}
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "$b^3=3b^2$에서 $b=0, 3$으로 경우를 나눈 뒤 $a^3-3ab=7a$의 해 중 서로 다른 두 실근 조건 $a^2-4b>0$을 만족하는 쌍만 센다.", "decisiveStep": "$a=0$일 때 중근 또는 허근이 되므로 반드시 판별식 $D=a^2-4b>0$으로 검증해 제외한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-030(DIRECT_BINDING_GAP): 세제곱 근으로 구성된 이차방정식과 근과 계수의 관계 연립, exact binding 미구비"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계 연립방정식 풀이 후 서로 다른 두 실근 조건 $D>0$으로 무연근을 걸러내는 심화 문항이다.", "level": "상", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "순서쌍", "src": "stem", "quote": "순서쌍 $(a, b)$의 개수는?"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x^2-ax+b=0$"}], "condition": [{"term": "실근", "src": "stem", "quote": "서로 다른 두 실근은 $\\alpha, \\beta$이고"}]}, "reasons": {"method": "b=0, 3 경우 분류 후 판별식 D>0으로 유효한 순서쌍 4개를 셈"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q23

- 형식: 서답형  
- 배점: 5

### 발문

서술형1) 다항식 \$f(x)\$를 \$x-1\$로 나누었을 때의 나머지가 \$3\$, \$x+1\$로 나누었을 때의 나머지가 \$5\$일 때, 다항식 \$(x^2+2x+2)f(x)\$를 \$x^2-1\$로 나누었을 때의 나머지를 구하여라. (단, 풀이과정을 자세히 쓰시오.)

### 선지

없음

### 정답

\$5x+10\$

### 해설

\$g(x)=(x^2+2x+2)f(x)\$라 두고 \$x^2-1\$로 나눈 나머지를 \$R(x)=px+q\$라 놓자. 조건에서 \$f(1)=3, f(-1)=5\$이므로 \$\$ R(1) \= g(1) \= (1+2+2)f(1) \= 5\\cdot 3 \= 15 \\implies p+q \= 15 \$\$ \$\$ R(-1) \= g(-1) \= (1-2+2)f(-1) \= 1\\cdot 5 \= 5 \\implies \-p+q \= 5 \$\$ 두 식을 더하면 \$2q=20\$에서 \$q=10\$이고 \$p=5\$이다. 따라서 구하는 나머지는 \$5x+10\$이다.

```
{"status": "EXEMPT", "reason": "곱해진 다항식 (x^2+2x+2)f(x)에 나머지정리 x=1, -1을 대입해 일차 나머지를 구하는 서술형 문항임"}
```

```
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-02", "subUnitKey": "H15-SA-02-REMAINDER_FACTOR", "conceptClusterKey": null, "primaryMethod": "$g(x)=(x^2+2x+2)f(x)$에 $x=1, -1$을 대입해 얻은 $g(1)=15, g(-1)=5$를 $R(x)=px+q$에 연립한다.", "decisiveStep": "새로운 다항식 $g(x)$의 함숫값을 $f(1), f(-1)$로부터 바로 계산한다.", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "고차식 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_REMAINDER_THEOREM", "templateKey": "TPL_H1_REMAINDER_COMPOSITE_DIVISOR", "why": "high1.json H1-RPM-010(FAMILY_ACTIVE): f(1), f(-1) 조건으로 합성 제수 (x-1)(x+1) 나눗셈의 나머지를 결정함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곱해진 다항식에 나머지정리를 적용해 이차식으로 나눈 나머지를 구하는 서술형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "나머지", "src": "stem", "quote": "나누었을 때의 나머지를 구하여라"}], "method": [{"term": "나머지정리", "src": "solution", "quote": "R(1) = g(1)", "evidenceType": "IMPLIED", "justification": "나머지정리에 따라 x=1과 x=-1을 대입해 일차 나머지 R(x)를 결정함"}], "given": [{"term": "다항식", "src": "stem", "quote": "다항식 $f(x)$"}], "condition": []}, "reasons": {"method": "x=1, -1 대입으로 g(1)=15, g(-1)=5를 구해 나머지를 결정함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q24

- 형식: 서답형  
- 배점: 5

### 발문

서술형2) 복소수 \$z=\\dfrac{1-i}{1+i}\$에 대하여 \$1+z+z^2+\\cdots+z^{125}\$의 값을 구하여라. (단, \$i=\\sqrt{-1}\$이고 풀이과정을 자세히 쓰시오.)

### 선지

없음

### 정답

\$1-i\$

### 해설

분모를 실수화하면 \$z \= \\dfrac{(1-i)^2}{(1+i)(1-i)} \= \\dfrac{-2i}{2} \= \-i\$이다. \$(-i)^4=1\$이므로 연속한 네 항의 합은 \$1+(-i)+(-i)^2+(-i)^3 \= 1-i-1+i \= 0\$이다. 주어진 합은 \$1=z^0\$부터 \$z^{125}\$까지 총 \$126\$개의 항으로 이루어져 있고 \$126=4\\cdot 31+2\$이므로 \$\$ 1+z+z^2+\\cdots+z^{125} \= z^{124}+z^{125} \= (-i)^{124}+(-i)^{125} \= 1-i \$\$ 이다.

```
{"status": "EXEMPT", "reason": "복소수 실수화 후 주기 4 순환합이 0임을 이용해 126개 항의 합을 구하는 서술형 문항임"}
```

```
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-04", "subUnitKey": "H15-SA-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=-i$로 간단히 한 뒤 주기 $4$ 순환합 $0$과 총 항수 $126=4\\cdot 31+2$를 이용해 마지막 두 항만 계산한다.", "decisiveStep": "$1$부터 $z^{125}$까지의 항 개수가 $125$개가 아니라 $126$개임을 정확히 센다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-025(DIRECT_ACTIVE): z=-i로 정리 후 주기 4 순환합이 0임을 이용해 거듭제곱 합을 계산함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 분모 실수화와 주기 $4$ 순환합 $0$을 이용한 항 개수 카운팅 서술형 문항이다.", "level": "하", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\dfrac{1-i}{1+i}$"}], "method": [{"term": "켤레복소수", "src": "solution", "quote": "분모를 실수화하면", "evidenceType": "IMPLIED", "justification": "분모의 켤레복소수를 곱해 z=-i를 구한 뒤 주기 4 순환합을 적용함"}], "given": [{"term": "복소수", "src": "stem", "quote": "복소수 $z=\\dfrac{1-i}{1+i}$"}], "condition": []}, "reasons": {"method": "분모 실수화로 z=-i를 구하고 주기 4 순환합으로 126항의 합을 계산함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

## Q25

- 형식: 서답형  
- 배점: 5

### 발문

서술형3) 이차방정식 \$x(x-1)+x(x-3)+(x-1)(x-3)=0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\dfrac{1}{\\alpha\\beta}+\\dfrac{2}{(\\alpha-1)(\\beta-1)}+\\dfrac{4}{(\\alpha-3)(\\beta-3)}\$의 값을 구하여라. (단, 풀이과정을 자세히 쓰시오.)

### 선지

없음

### 정답

\$0\$

### 해설

주어진 이차방정식을 전개해 정리하면 \$\$ (x^2-x)+(x^2-3x)+(x^2-4x+3) \= 3x^2-8x+3 \= 0 \$\$ 이다. 근과 계수의 관계에 의하여 \$\\alpha+\\beta=\\dfrac{8}{3}\$, \$\\alpha\\beta=1\$이다. 각 분모를 계산하면

- \$\\alpha\\beta \= 1\$  
- \$(\\alpha-1)(\\beta-1) \= \\alpha\\beta-(\\alpha+\\beta)+1 \= 1-\\dfrac{8}{3}+1 \= \-\\dfrac{2}{3}\$  
- \$(\\alpha-3)(\\beta-3) \= \\alpha\\beta-3(\\alpha+\\beta)+9 \= 1-3\\cdot\\dfrac{8}{3}+9 \= 2\$ 따라서 구하는 값은 \$\$ \\dfrac{1}{1}+\\dfrac{2}{-\\frac{2}{3}}+\\dfrac{4}{2} \= 1-3+2 \= 0 \$\$ 이다.

```
{"status": "EXEMPT", "reason": "이차방정식을 전개해 근과 계수의 관계를 구하고 세 대칭식 분모를 계산하는 서술형 문항임"}
```

```
{"sourceQid": "25", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-06", "subUnitKey": "H15-SA-06-ROOT_COEFFICIENT_RELATION", "conceptClusterKey": null, "primaryMethod": "방정식을 $3x^2-8x+3=0$으로 전개해 $\\alpha+\\beta=\\frac{8}{3}, \\alpha\\beta=1$을 구한 뒤 세 분모를 각각 계산해 합산한다.", "decisiveStep": "세 분모 $(\\alpha-k)(\\beta-k)$를 $\\alpha\\beta-k(\\alpha+\\beta)+k^2$으로 전개해 합과 곱을 대입한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근의 합·곱"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_SYMMETRIC_VALUE", "why": "high1.json H1-RPM-029(DIRECT_BINDING_GAP): 이차방정식 근과 계수의 관계로 대칭 유리식의 합을 계산, exact binding 미구비"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식 전개 후 근과 계수의 관계로 세 대칭 유리식의 합을 구하는 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "대칭식", "src": "solution", "quote": "\\alpha\\beta-3(\\alpha+\\beta)+9"}], "method": [{"term": "근과계수의관계", "src": "solution", "quote": "근과 계수의 관계에 의하여", "evidenceType": "NAMED"}], "given": [{"term": "이차방정식", "src": "stem", "quote": "이차방정식 $x(x-1)+x(x-3)+(x-1)(x-3)=0$"}], "condition": []}, "reasons": {"method": "방정식 전개 후 근과 계수의 관계로 세 대칭식 분모를 계산함"}, "steps": [], "scenarioNote": ""}, "hold": "BINDING_GAP"}
```

## Q26

- 형식: 서답형  
- 배점: 5

### 발문

서술형4) 사차방정식 \$2x^4+ax^3+bx^2-6x+a=0\$의 두 근이 \$1, \-2\$일 때, 나머지 두 근의 곱을 구하여라. (단, \$a, b\$는 상수이고 풀이과정을 자세히 쓰시오.)

### 선지

없음

### 정답

\$-1\$

### 해설

두 근 \$x=1, x=-2\$를 각각 대입하면

- \$x=1\$: \$2+a+b-6+a=0 \\implies 2a+b=4 \\implies b=4-2a\$  
- \$x=-2\$: \$32-8a+4b+12+a=0 \\implies 44-7a+4b=0\$ 첫째 식을 둘째 식에 대입하면 \$44-7a+4(4-2a)=60-15a=0 \\implies a=4\$이고, \$b=4-2(4)=-4\$이다. 따라서 사차방정식은 \$2x^4+4x^3-4x^2-6x+4=0\$이고, \$(x-1)(x+2)=x^2+x-2\$로 나누어 인수분해하면 \$\$ (x^2+x-2)(2x^2+2x-2) \= 0 \$\$ 이다. 나머지 두 근은 이차방정식 \$2x^2+2x-2=0\$의 두 근이므로 근과 계수의 관계에 의하여 두 근의 곱은 \$\\dfrac{-2}{2}=-1\$이다.

```
{"status": "EXEMPT", "reason": "사차방정식의 두 근을 대입해 a, b를 구하고 인수분해로 이차인수를 분리해 나머지 두 근의 곱을 구하는 서술형 문항임"}
```

```
{"sourceQid": "26", "variationType": "NUMERIC", "standardCourse": "수학(상)", "courseKey": "H15-SA", "curriculum": "2015", "standardUnitKey": "H15-SA-07", "subUnitKey": "H15-SA-07-HIGHER_EQUATION", "conceptClusterKey": null, "primaryMethod": "$x=1, -2$를 대입해 $a=4, b=-4$를 구한 뒤 $(x-1)(x+2)$로 나누어 얻은 $2x^2+2x-2=0$에서 근과 계수의 관계를 적용한다.", "decisiveStep": "두 근 $1, -2$로 만든 $x^2+x-2$로 사차식을 나누어 나머지 이차인수를 분리한다.", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "여러 가지 방정식", "l3": "삼차·사차방정식", "l4": "인수분해형"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_HIGHER_DEGREE_EQUATION", "templateKey": "TPL_H1_HIGHER_FACTOR_ROOT", "why": "high1.json H1-RPM-039(DIRECT_ACTIVE): 사차방정식의 두 근으로 이차인수를 분리해 나머지 두 근의 곱을 구함"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사차방정식의 두 근 대입, 다항식 나눗셈 인수분해, 근과 계수의 관계를 연결한 서술형 문항이다.", "level": "중", "item4slot": {"format": "단일 정답", "slots": {"goal": [{"term": "사차방정식", "src": "stem", "quote": "사차방정식 $2x^4+ax^3+bx^2-6x+a=0$"}], "method": [{"term": "인수분해", "src": "solution", "quote": "나누어 인수분해하면", "evidenceType": "NAMED"}], "given": [{"term": "사차방정식", "src": "stem", "quote": "사차방정식 $2x^4+ax^3+bx^2-6x+a=0$"}], "condition": []}, "reasons": {"method": "두 근 대입으로 계수를 구하고 (x-1)(x+2)로 나누어 나머지 두 근의 곱을 구함"}, "steps": [], "scenarioNote": ""}, "hold": ""}
```

