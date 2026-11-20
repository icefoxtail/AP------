

```
{
  "stem": "25_금당고_1학기_중간_고1_유사",
  "sourceArchiveFile": "original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js",
  "examFolder": "1mid",
  "grade": "고1",
  "curriculum": "2022",
  "questionCount": 22,
  "totalScore": 100.0,
  "generatedAt": "2026-11-17"
}
```

## Q01

- 형식: 객관식  
- 배점: 3.5

### 발문

복소수 \$7 - 4i\$의 켤레복소수는?

### 선지

① \$-7 - 4i\$ ② \$-7 \+ 4i\$ ③ \$7 \+ 4i\$ ④ \$7 - 4i\$ ⑤ \$4 \+ 7i\$

### 정답

③

### 해설

복소수 \$z \= a \+ bi\$ (\$a, b\$는 실수)의 켤레복소수 \$\\bar{z}\$는 허수부분의 부호를 반대로 바꾼 \$a - bi\$이다. 주어진 복소수 \$7 - 4i\$의 실수부분은 \$7\$, 허수부분은 \$-4\$이므로 켤레복소수는 \$7 \+ 4i\$이다.

```
"NONE"
```

```
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-04", "subUnitKey": "H22-C-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "켤레복소수의 정의에 따라 $7-4i$의 허수부분 $-4$의 부호를 반대로 바꾸어 $7+4i$를 구한다.", "decisiveStep": "실수부분 $7$은 유지하고 허수부분 $-4$의 부호만 $+4$로 바꾸는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-154(DIRECT_ACTIVE): 복소수의 뜻/실수부·허수부"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "켤레복소수의 정의를 직접 적용해 한 번에 답을 구하는 문항이다.", "level": "하", "item4slot": {"domain": "복소수", "concept": "켤레복소수", "skill": "켤레복소수구하기", "context": "복소수표현"}, "hold": ""}
```

## Q02

- 형식: 객관식  
- 배점: 3.5

### 발문

다항식 \$(x - 3)(x^2 \+ 3x \+ 9)\$를 전개한 식은?

### 선지

① \$x^3 - 27\$ ② \$x^3 \+ 27\$ ③ \$x^3 - 9x - 27\$ ④ \$x^3 \+ 9x - 27\$ ⑤ \$x^3 - 6x^2 \+ 27\$

### 정답

①

### 해설

곱셈 공식 \$(a - b)(a^2 \+ ab \+ b^2) \= a^3 - b^3\$을 이용하면 \$\$(x - 3)(x^2 \+ 3x \+ 9\) \= (x - 3)(x^2 \+ 3x \+ 3^2) \= x^3 - 3^3 \= x^3 - 27\$\$

```
"NONE"
```

```
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-01", "subUnitKey": "H22-C-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "곱셈 공식 $(a-b)(a^2+ab+b^2)=a^3-b^3$에 $a=x, b=3$을 적용하여 전개한다.", "decisiveStep": "$x^2+3x+9$가 $x^2+3x+3^2$ 꼴임을 확인해 세제곱의 차 공식을 적용하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "고차식 전개"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-137(DIRECT_ACTIVE): 다항식의 곱셈/고차식 전개"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세제곱의 차 곱셈 공식을 바로 적용하는 기본 전개 문항이다.", "level": "하", "item4slot": {"domain": "다항식의연산", "concept": "곱셈공식", "skill": "다항식전개", "context": "세제곱차공식"}, "hold": ""}
```

## Q03

- 형식: 객관식  
- 배점: 3.5

### 발문

두 다항식 \$A \= 2x^2 \+ 4xy - y^2\$, \$B \= 2x^2 \+ xy - y^2\$에 대하여 \$-A \+ 3B - (-2A \+ 4B)\$를 간단히 한 식은?

### 선지

① \$5xy\$ ② \$-3xy\$ ③ \$4x^2 \+ 3xy - 2y^2\$ ④ \$4x^2 \+ 5xy - 2y^2\$ ⑤ \$3xy\$

### 정답

⑤

### 해설

주어진 식을 먼저 간단히 정리하면 \$\$-A \+ 3B - (-2A \+ 4B) \= \-A \+ 3B \+ 2A - 4B \= A - B\$\$ 여기에 \$A, B\$를 대입하면 \$\$A - B \= (2x^2 \+ 4xy - y^2) - (2x^2 \+ xy - y^2) \= 3xy\$\$

```
"NONE"
```

```
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-01", "subUnitKey": "H22-C-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "문자로 주어진 식 $-A+3B-(-2A+4B)$를 $A-B$로 먼저 정리한 뒤 다항식을 대입해 동류항을 정리한다.", "decisiveStep": "식에 바로 대입하지 않고 $A-B$로 축약한 뒤 빼는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 덧셈과 뺄셈", "l4": "다항식의 덧셈·뺄셈"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_OPERATION_EXPANSION", "templateKey": "TPL_H1_POLY_OPERATION_DIRECT", "why": "high1.json H1-RPM-135(DIRECT_ACTIVE): 다항식의 덧셈과 뺄셈/다항식의 덧셈·뺄셈"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 정리 후 두 이차다항식의 뺄셈을 수행하는 기본 연산 문항이다.", "level": "중", "item4slot": {"domain": "다항식의연산", "concept": "다항식의덧셈과뺄셈", "skill": "동류항정리", "context": "다항식대입계산"}, "hold": ""}
```

## Q04

- 형식: 객관식  
- 배점: 3.5

### 발문

\$(5 - 2i) - (-4i)\$를 계산한 값은?

### 선지

① \$5 - 6i\$ ② \$5 \+ 2i\$ ③ \$5 - 2i\$ ④ \$1 \+ 2i\$ ⑤ \$5 \+ 6i\$

### 정답

②

### 해설

\$\$(5 - 2i) - (-4i) \= 5 - 2i \+ 4i \= 5 \+ (-2 \+ 4)i \= 5 \+ 2i\$\$

```
"NONE"
```

```
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-04", "subUnitKey": "H22-C-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "괄호를 풀고 실수부분과 허수부분끼리 각각 계산하여 $5+2i$를 구한다.", "decisiveStep": "$-(-4i)=+4i$로 부호를 정리해 허수부분을 합산하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-154(DIRECT_ACTIVE): 복소수의 뜻/실수부·허수부"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수의 기본 뺄셈 한 단계로 끝나는 계산 문항이다.", "level": "하", "item4slot": {"domain": "복소수", "concept": "복소수의사칙연산", "skill": "복소수뺄셈", "context": "복소수단순계산"}, "hold": ""}
```

## Q05

- 형식: 객관식  
- 배점: 3.7

### 발문

이차함수 \$y \= x^2 - 4x \+ 4\$의 그래프와 \$x\$축의 서로 다른 교점의 개수는?

### 선지

① \$4\$ ② \$3\$ ③ \$2\$ ④ \$1\$ ⑤ \$0\$

### 정답

④

### 해설

이차함수 \$y \= x^2 - 4x \+ 4\$의 그래프와 \$x\$축의 교점의 개수는 이차방정식 \$x^2 - 4x \+ 4 \= 0\$의 서로 다른 실근의 개수와 같다. 판별식을 \$D\$라 하면 \$\$\\frac{D}{4} \= (-2)^2 - 1 \\times 4 \= 4 - 4 \= 0\$\$ 이므로 서로 다른 실근의 개수는 \$1\$이고, 교점의 개수는 \$1\$이다.

```
"NONE"
```

```
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-05", "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_GRAPH", "conceptClusterKey": null, "primaryMethod": "이차방정식 $x^2-4x+4=0$의 판별식 $D/4=0$임을 이용해 $x$축과의 교점 개수를 구한다.", "decisiveStep": "판별식 $D/4=0$에서 중근을 가지므로 $x$축과 한 점에서 접함을 판별하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "그래프와 근", "l4": "판별식과 위치"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_GRAPH_INTERSECTION", "templateKey": "TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY", "why": "high1.json H1-RPM-167(DIRECT_ACTIVE): 그래프와 근/판별식과 위치"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "판별식의 부호를 한 번 계산해 $x$축과의 교점 개수를 바로 판단하는 문항이다.", "level": "중", "item4slot": {"domain": "이차방정식과이차함수", "concept": "이차함수의그래프와x축의위치관계", "skill": "판별식교점개수판별", "context": "포물선과x축교점"}, "hold": ""}
```

## Q06

- 형식: 객관식  
- 배점: 3.7

### 발문

다항식 \$P(x) \= x^3 - 3x^2 \+ ax \+ 4\$를 \$x - 1\$로 나누었을 때의 나머지가 \$5\$이다. \$P(x)\$를 \$x - 2\$로 나누었을 때의 나머지는? (단, \$a\$는 상수이다.)

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$

### 정답

①

### 해설

나머지정리에 의하여 \$P(1) \= 5\$이므로 \$\$P(1) \= 1^3 - 3(1)^2 \+ a(1) \+ 4 \= a \+ 2 \= 5 \\implies a \= 3\$\$ 따라서 \$P(x) \= x^3 - 3x^2 \+ 3x \+ 4\$이고, \$x - 2\$로 나누었을 때의 나머지는 \$P(2)\$이므로 \$\$P(2) \= 2^3 - 3(2)^2 \+ 3(2) \+ 4 \= 8 - 12 \+ 6 \+ 4 \= 6\$\$

```
"NONE"
```

```
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-02", "subUnitKey": "H22-C-02-CORE", "conceptClusterKey": null, "primaryMethod": "나머지정리 $P(1)=5$에서 미정계수 $a=3$을 먼저 구한 뒤 $P(2)$를 계산한다.", "decisiveStep": "$P(1)=5$로 $a$를 확정한 뒤 $x=2$를 다시 대입하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-141(DIRECT_ACTIVE): 항등식/수치대입법"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "나머지정리를 두 번 연속 적용해 미정계수와 나머지를 구하는 문항이다.", "level": "중", "item4slot": {"domain": "항등식과나머지정리", "concept": "나머지정리", "skill": "미정계수결정후나머지계산", "context": "삼차다항식나머지"}, "hold": ""}
```

## Q07

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$(x - 2)(x^2 \+ 3x - 1)\$의 전개식에서 \$x^2\$의 계수는?

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

③

### 해설

\$(x - 2)(x^2 \+ 3x - 1)\$의 전개식에서 \$x^2\$ 항이 나오는 부분만 계산하면 \$\$(x)(3x) \+ (-2)(x^2) \= 3x^2 - 2x^2 \= x^2\$\$ 따라서 \$x^2\$의 계수는 \$1\$이다.

```
"NONE"
```

```
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-08", "subUnitKey": "H22-C-08-COMBINATION", "conceptClusterKey": null, "primaryMethod": "분배법칙에서 $x^2$ 항이 생성되는 두 곱 $(x)(3x)$와 $(-2)(x^2)$만 선택해 계수를 합산한다.", "decisiveStep": "전체 전개 대신 $x^2$ 항이 되는 조합만 골라 더하는 단계", "rpm": {"majorUnit": "경우의 수", "midUnit": "조합", "l3": "조합의 뜻과 계산", "l4": "조합 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_COUNTING_SELECTION_DISTRIBUTION", "templateKey": "TPL_COMBINATION_SELECTION", "why": "high1.json H1-RPM-192(DIRECT_ACTIVE): 조합의 뜻과 계산/조합 계산"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "특정 차수 항의 계수만 선택적으로 추출하는 기본 전개 문항이다.", "level": "하", "item4slot": {"domain": "다항식의연산", "concept": "다항식의곱셈", "skill": "특정항계수추출", "context": "다항식곱전개"}, "hold": ""}
```

## Q08

- 형식: 객관식  
- 배점: 3.8

### 발문

다항식 \$(2x^4 - x^3 \+ 3x^2 \+ x - 2)(3x \+ 2)\$를 전개하였을 때, 상수항을 제외한 모든 항의 계수의 합은?

### 선지

① \$17\$ ② \$19\$ ③ \$21\$ ④ \$23\$ ⑤ \$25\$

### 정답

②

### 해설

주어진 다항식을 \$f(x) \= (2x^4 - x^3 \+ 3x^2 \+ x - 2)(3x \+ 2)\$라 하자.

1. 모든 항의 계수의 합: \$\$f(1) \= (2 - 1 \+ 3 \+ 1 - 2)(3 \+ 2\) \= 3 \\times 5 \= 15\$\$  
2. 상수항: \$\$f(0) \= (-2) \\times 2 \= \-4\$\$

따라서 상수항을 제외한 모든 항의 계수의 합은 \$\$f(1) - f(0) \= 15 - (-4) \= 19\$\$

```
"NONE"
```

```
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-02", "subUnitKey": "H22-C-02-CORE", "conceptClusterKey": null, "primaryMethod": "다항식 $f(x)$의 모든 계수 합 $f(1)=15$에서 상수항 $f(0)=-4$를 빼서 구한다.", "decisiveStep": "$f(1)$이 상수항을 포함한 합임을 알고 $f(0)$을 빼는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "수치대입법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_SPECIAL_VALUE", "why": "high1.json H1-RPM-141(DIRECT_ACTIVE): 항등식/수치대입법"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수치대입 $x=1$과 $x=0$을 함께 사용해 상수항 제외 계수 합을 구하는 문항이다.", "level": "중", "item4slot": {"domain": "항등식과나머지정리", "concept": "항등식", "skill": "계수의합계산", "context": "다항식곱계수합"}, "hold": ""}
```

## Q09

- 형식: 객관식  
- 배점: 4

### 발문

\$N \= 21^3 - 4 \\times 21^2 - 11 \\times 21 - 6\$일 때, 자연수 \$N\$의 양의 약수의 개수는?

### 선지

① \$18\$ ② \$24\$ ③ \$28\$ ④ \$32\$ ⑤ \$36\$

### 정답

⑤

### 해설

\$21 \= x\$로 놓고 다항식 \$P(x) \= x^3 - 4x^2 - 11x - 6\$을 인수분해하자. \$P(-1) \= \-1 - 4 \+ 11 - 6 \= 0\$이므로 \$P(x)\$는 \$x \+ 1\$을 인수로 갖는다. 조립제법으로 인수분해하면 \$\$P(x) \= (x \+ 1)(x^2 - 5x - 6\) \= (x \+ 1)^2(x - 6)\$\$ 여기에 \$x \= 21\$을 대입하면 \$\$N \= 22^2 \\times 15 \= (2 \\times 11)^2 \\times (3 \\times 5\) \= 2^2 \\times 3^1 \\times 5^1 \\times 11^2\$\$ 따라서 자연수 \$N\$의 양의 약수의 개수는 \$\$(2 \+ 1)(1 \+ 1)(1 \+ 1)(2 \+ 1\) \= 3 \\times 2 \\times 2 \\times 3 \= 36\$\$

```
"NONE"
```

```
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-03", "subUnitKey": "H22-C-03-FACTORIZATION", "conceptClusterKey": null, "primaryMethod": "$21=x$로 치환해 삼차식 $x^3-4x^2-11x-6$을 $(x+1)^2(x-6)$으로 인수분해한 뒤 $x=21$을 대입해 소인수분해하고 약수의 개수를 구한다.", "decisiveStep": "인수정리 $P(-1)=0$으로 고차식을 인수분해하여 큰 수 $N$을 소인수분해 형태로 얻는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "인수분해", "l3": "인수분해의 활용", "l4": "수의 계산"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FACTORIZATION", "templateKey": "TPL_H1_FACTORIZATION_APPLICATION", "why": "high1.json H1-RPM-151(DIRECT_ACTIVE): 인수분해의 활용/수의 계산"}, "crossConceptKeys": [], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자로 치환한 고차식 인수분해와 소인수분해 기반 약수 개수 공식을 연결해야 한다.", "level": "상", "item4slot": {"domain": "인수분해", "concept": "인수분해의활용", "skill": "치환인수분해후약수개수", "context": "수의소인수분해"}, "hold": ""}
```

## Q10

- 형식: 객관식  
- 배점: 4

### 발문

복소수 \$\\dfrac{a \+ 2i}{2 \+ i}\$의 실수부분과 허수부분의 합이 \$3\$일 때, 실수 \$a\$의 값은?

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$

### 정답

④

### 해설

분모의 켤레복소수 \$2 - i\$를 분모와 분자에 곱하여 실수화하면 \$\$\\frac{a \+ 2i}{2 \+ i} \= \\frac{(a \+ 2i)(2 - i)}{(2 \+ i)(2 - i)} \= \\frac{2a - ai \+ 4i - 2i^2}{2^2 \+ 1^2} \= \\frac{2a \+ 2 \+ (4 - a)i}{5} \= \\frac{2a \+ 2}{5} \+ \\frac{4 - a}{5}i\$\$ 실수부분과 허수부분의 합이 \$3\$이므로 \$\$\\frac{2a \+ 2}{5} \+ \\frac{4 - a}{5} \= 3 \\implies \\frac{a \+ 6}{5} \= 3 \\implies a \+ 6 \= 15 \\implies a \= 9\$\$

```
"NONE"
```

```
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-04", "subUnitKey": "H22-C-04-COMPLEX_BASIC", "conceptClusterKey": null, "primaryMethod": "분모를 실수화하여 $\\frac{2a+2}{5}+\\frac{4-a}{5}i$로 정리한 뒤 실수부분과 허수부분의 합이 $3$인 일차방정식을 푼다.", "decisiveStep": "분모 실수화 후 실수부와 허수부 계수를 분리해 합 조건을 적용하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "복소수의 뜻", "l4": "실수부·허수부"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_OPERATION", "templateKey": "TPL_H1_COMPLEX_COMPONENT_OPERATION", "why": "high1.json H1-RPM-154(DIRECT_ACTIVE): 복소수의 뜻/실수부·허수부"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복소수 나눗셈(분모 실수화)과 미지수 방정식 풀이를 연달아 수행하는 문항이다.", "level": "중", "item4slot": {"domain": "복소수", "concept": "복소수의나눗셈", "skill": "분모실수화후계수결정", "context": "실수부허수부합"}, "hold": ""}
```

## Q11

- 형식: 객관식  
- 배점: 4

### 발문

\$x\$에 대한 이차방정식 \$x^2 \+ (k \+ 2a)x \+ \\dfrac{k^2}{4} - 3k - b \= 0\$이 실수 \$k\$의 값에 관계없이 항상 중근을 가질 때, 두 실수 \$a, b\$에 대하여 \$a - b\$의 값은?

### 선지

① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$

### 정답

①

### 해설

이차방정식이 항상 중근을 가지므로 판별식 \$D \= 0\$이다. \$\$D \= (k \+ 2a)^2 - 4\\left(\\frac{k^2}{4} - 3k - b\\right) \= 0\$\$ \$\$k^2 \+ 4ak \+ 4a^2 - k^2 \+ 12k \+ 4b \= 0 \\implies (4a \+ 12)k \+ (4a^2 \+ 4b) \= 0\$\$ 이 식이 실수 \$k\$의 값에 관계없이 항상 성립해야 하므로 \$k\$에 대한 항등식이다. \$\$4a \+ 12 \= 0, \\quad 4a^2 \+ 4b \= 0\$\$ 따라서 \$a \= \-3\$, \$b \= \-(-3)^2 \= \-9\$이므로 \$\$a - b \= \-3 - (-9) \= 6\$\$

```
"NONE"
```

```
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-04", "subUnitKey": "H22-C-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "중근 조건 $D=0$을 전개해 $k^2$을 소거하고 $k$에 대한 항등식 $(4a+12)k+(4a^2+4b)=0$의 계수를 $0$으로 둔다.", "decisiveStep": "판별식 $D=0$의 결과를 $k$에 대하여 내림차순 정리해 항등식 성질을 적용하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-159(DIRECT_ACTIVE): i의 거듭제곱/복소수 조건"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 중근 판별식과 임의의 실수 $k$에 대한 항등식 계수비교가 결합된 문항이다.", "level": "상", "item4slot": {"domain": "복소수와이차방정식", "concept": "이차방정식의판별식", "skill": "판별식항등식적용", "context": "항상중근조건"}, "hold": ""}
```

## Q12

- 형식: 객관식  
- 배점: 4

### 발문

다항식 \$f(x)\$를 \$x^2 - 5x \+ 6\$으로 나누었을 때의 나머지가 \$3\$이고, \$x - 1\$로 나누었을 때의 나머지가 \$5\$이다. \$f(x)\$를 \$(x - 1)(x - 2)(x - 3)\$으로 나누었을 때의 나머지를 \$R(x)\$라 할 때, \$R(x)\$를 \$x \+ 1\$로 나누었을 때의 나머지는?

### 선지

① \$13\$ ② \$15\$ ③ \$17\$ ④ \$19\$ ⑤ \$21\$

### 정답

②

### 해설

\$x^2 - 5x \+ 6 \= (x - 2)(x - 3)\$이므로 \$f(x)\$를 \$(x - 1)(x - 2)(x - 3)\$으로 나누었을 때의 나머지 \$R(x)\$를 \$(x - 2)(x - 3)\$으로 나눈 나머지도 \$3\$이어야 한다. \$R(x)\$는 이차 이하의 다항식이므로 상수 \$a\$에 대하여 \$\$R(x) \= a(x - 2)(x - 3\) \+ 3\$\$ 으로 놓을 수 있다. 나머지정리에 의하여 \$R(1) \= f(1) \= 5\$이므로 \$\$R(1) \= a(1 - 2)(1 - 3\) \+ 3 \= 2a \+ 3 \= 5 \\implies a \= 1\$\$ 따라서 \$R(x) \= (x - 2)(x - 3\) \+ 3\$이고, \$R(x)\$를 \$x \+ 1\$로 나누었을 때의 나머지는 \$\$R(-1) \= (-1 - 2)(-1 - 3\) \+ 3 \= (-3)(-4) \+ 3 \= 15\$\$

```
"NONE"
```

```
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-02", "subUnitKey": "H22-C-02-CORE", "conceptClusterKey": null, "primaryMethod": "삼차식으로 나눈 나머지 $R(x)$를 $a(x-2)(x-3)+3$으로 설정한 뒤 $R(1)=5$로 $a$를 구해 $R(-1)$을 계산한다.", "decisiveStep": "이차식 $x^2-5x+6$의 인수분해와 나머지 조건을 결합해 $R(x)=a(x-2)(x-3)+3$으로 놓는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-142(RPM_ONLY): 나머지정리/일차식으로 나눈 나머지"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼차식 나눗셈의 나머지를 이차식 나눗셈 나머지 조건을 반영해 설정하는 표준 심화 문항이다.", "level": "상", "item4slot": {"domain": "항등식과나머지정리", "concept": "나머지정리", "skill": "삼차식나눗셈나머지설정", "context": "이차식일차식나머지결합"}, "hold": "RPM_ONLY"}
```

## Q13

- 형식: 객관식  
- 배점: 4.2

### 발문

복소수 \$z \= \\dfrac{1 \+ i}{1 - i}\$에 대하여 \$\$z \+ \\frac{1}{z} \+ z^2 \+ \\frac{1}{z^2} \+ z^3 \+ \\frac{1}{z^3} \+ \\dots \+ z^{26} \+ \\frac{1}{z^{26}}\$\$ 의 값은?

### 선지

① \$4\$ ② \$2\$ ③ \$0\$ ④ \$-1\$ ⑤ \$-2\$

### 정답

⑤

### 해설

\$\$z \= \\frac{1 \+ i}{1 - i} \= \\frac{(1 \+ i)^2}{(1 - i)(1 \+ i)} \= \\frac{2i}{2} \= i, \\quad \\frac{1}{z} \= \\frac{1}{i} \= \-i\$\$ 각 항을 \$4\$개씩 묶어 주기성을 확인하면

- \$z \+ \\frac{1}{z} \= i \+ (-i) \= 0\$  
- \$z^2 \+ \\frac{1}{z^2} \= (-1) \+ (-1) \= \-2\$  
- \$z^3 \+ \\frac{1}{z^3} \= (-i) \+ i \= 0\$  
- \$z^4 \+ \\frac{1}{z^4} \= 1 \+ 1 \= 2\$

이므로 연속한 \$4\$쌍의 합은 \$0 \+ (-2) \+ 0 \+ 2 \= 0\$이다. \$26 \= 4 \\times 6 \+ 2\$이므로 처음 \$24\$쌍의 합은 \$0\$이고 마지막 \$2\$쌍만 남는다. \$\$\\left(z^{25} \+ \\frac{1}{z^{25}}\\right) \+ \\left(z^{26} \+ \\frac{1}{z^{26}}\\right) \= \\left(z \+ \\frac{1}{z}\\right) \+ \\left(z^2 \+ \\frac{1}{z^2}\\right) \= 0 \+ (-2) \= \-2\$\$

```
"NONE"
```

```
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-04", "subUnitKey": "H22-C-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "$z=i$, $\\frac{1}{z}=-i$로 간단히 한 뒤 $4$주기마다 합이 $0$이 됨을 이용해 $26$을 $4$로 나눈 나머지 $2$쌍을 계산한다.", "decisiveStep": "$z=i$로 환원하고 연속 $4$쌍의 합이 $0$임을 확인해 $26=4\\times 6+2$를 적용하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "주기성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_POWER_ROOT", "templateKey": "TPL_H1_COMPLEX_I_PERIOD", "why": "high1.json H1-RPM-158(DIRECT_ACTIVE): i의 거듭제곱/주기성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수 복소수를 $i$로 간단히 한 뒤 주기성을 이용해 유한합을 구하는 문항이다.", "level": "중", "item4slot": {"domain": "복소수", "concept": "허수단위의거듭제곱", "skill": "복소수역수거듭제곱합", "context": "복소수주기합"}, "hold": ""}
```

## Q14

- 형식: 객관식  
- 배점: 4.2

### 발문

이차방정식 \$x^2 \+ 2nx - 10n \= 0\$의 한 근은 \$3\$보다 작고, 다른 한 근은 \$3\$보다 크도록 하는 정수 \$n\$의 최솟값은?

### 선지

① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$

### 정답

③

### 해설

이차함수 \$f(x) \= x^2 \+ 2nx - 10n\$이라 하면 그래프가 아래로 볼록하므로 이차방정식 \$f(x) \= 0\$의 두 근 사이에 \$3\$이 있으려면 \$f(3) \< 0\$이어야 한다. \$\$f(3) \= 3^2 \+ 2n(3) - 10n \= 9 - 4n \< 0 \\implies 4n \> 9 \\implies n \> \\frac{9}{4} \= 2.25\$\$ 따라서 이를 만족시키는 정수 \$n\$의 최솟값은 \$3\$이다.

```
"NONE"
```

```
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-05", "subUnitKey": "H22-C-05-QUADRATIC_EQUATION", "conceptClusterKey": null, "primaryMethod": "아래로 볼록한 포물선 $f(x)=x^2+2nx-10n$에서 두 근 사이에 $3$이 놓일 필요충분조건 $f(3)<0$을 푼다.", "decisiveStep": "판별식이나 축 조건 없이 경계 함숫값 $f(3)<0$만으로 충분함을 파악하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "이차방정식의 근", "l4": "판별식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_DISCRIMINANT", "templateKey": "TPL_H1_DISCRIMINANT_ROOT_EXISTENCE", "why": "high1.json H1-RPM-161(DIRECT_ACTIVE): 이차방정식의 근/판별식"}, "crossConceptKeys": [], "conditionKeys": ["COND_INTEGER"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근의 분리에서 두 근 사이에 한 수가 있는 기본 조건 $f(3)<0$을 바로 적용하는 문항이다.", "level": "상", "item4slot": {"domain": "이차방정식과이차함수", "concept": "이차방정식의근의분리", "skill": "경계함숫값부호판단", "context": "두근사이경계값"}, "hold": ""}
```

## Q15

- 형식: 객관식  
- 배점: 4.3

### 발문

다항식 \$f(x)\$가 모든 실수 \$x\$에 대하여 등식 \$3f(x)f(-x) \= f(x^2)\$을 만족시킬 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은?

\<보기\> ㄱ. \$f(0) \= \\dfrac{1}{3}\$이다. ㄴ. \$f(x)\$가 \$x - 1\$을 인수로 갖지 않으면 \$f(x) - \\dfrac{1}{3}\$은 \$x \+ 1\$을 인수로 갖는다. ㄷ. 차수가 \$1\$인 다항식 \$f(x)\$의 개수는 \$2\$이다.

### 선지

① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ

### 정답

④

### 해설

- ㄱ. 주어진 항등식에 \$x \= 0\$을 대입하면 \$\$3{f(0)}^2 \= f(0) \\implies f(0){3f(0) - 1} \= 0 \\implies f(0) \= 0 \\text{ 또는 } f(0) \= \\frac{1}{3}\$\$ 따라서 반드시 \$f(0) \= \\frac{1}{3}\$인 것은 아니다. (거짓)  
- ㄴ. \$f(x)\$가 \$x - 1\$을 인수로 갖지 않으므로 \$f(1) \\neq 0\$이다. 항등식에 \$x \= 1\$을 대입하면 \$\$3f(1)f(-1) \= f(1) \\implies f(-1) \= \\frac{1}{3}\$\$ 따라서 \$f(-1) - \\frac{1}{3} \= 0\$이므로 \$f(x) - \\frac{1}{3}\$은 \$x \+ 1\$을 인수로 갖는다. (참)  
- ㄷ. \$f(x) \= ax \+ b\$ (\$a \\neq 0\$)라 놓고 항등식에 대입하면 \$\$3(ax \+ b)(-ax \+ b) \= ax^2 \+ b \\implies \-3a^2x^2 \+ 3b^2 \= ax^2 \+ b\$\$ 계수를 비교하면 \$-3a^2 \= a\$에서 \$a \= \-\\frac{1}{3}\$ (\$a \\neq 0\$), \$3b^2 \= b\$에서 \$b \= 0\$ 또는 \$b \= \\frac{1}{3}\$이다. 따라서 \$f(x) \= \-\\frac{1}{3}x\$ 또는 \$f(x) \= \-\\frac{1}{3}x \+ \\frac{1}{3}\$의 \$2\$개이다. (참)

따라서 옳은 것은 ㄴ, ㄷ이다.

```
"NONE"
```

```
{"sourceQid": "15", "variationType": "CONDITION", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-02", "subUnitKey": "H22-C-02-CORE", "conceptClusterKey": null, "primaryMethod": "항등식 $3f(x)f(-x)=f(x^2)$에 $x=0, 1$ 수치대입과 일차식 $f(x)=ax+b$의 계수비교를 적용해 ㄱ, ㄴ, ㄷ을 판별한다.", "decisiveStep": "ㄱ에서 $f(0)=0$ 가능성을 놓치지 않고 ㄷ에서 일차식 계수비교로 $(a,b)$ 쌍 $2$개를 구하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "항등식", "l4": "미정계수법"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_IDENTITY_COEFFICIENT", "templateKey": "TPL_H1_IDENTITY_COEFFICIENT_COMPARE", "why": "high1.json H1-RPM-140(DIRECT_ACTIVE): 항등식/미정계수법"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수치대입, 인수정리, 미정계수 계수비교를 세 보기에 걸쳐 종합적으로 적용해야 한다.", "level": "상", "item4slot": {"domain": "항등식과나머지정리", "concept": "항등식", "skill": "다항식함수방정식판별", "context": "합답형명제"}, "hold": ""}
```

## Q16

- 형식: 객관식  
- 배점: 4.3

### 발문

\$x\$에 대한 이차방정식 \$x^2 - 2ax \+ a \+ 2 \= 0\$의 두 근 \$\\alpha, \\beta\$가 다음 조건을 만족시킬 때, \$a \+ b \+ c\$의 값은? (단, \$a, b, c\$는 상수이다.)

(가) \$\\alpha^2\\beta \+ \\alpha\\beta^2 \= 48\$, \$\\alpha\\beta \> 0\$ (나) 두 수 \$a - 1, a \+ 1\$을 근으로 하고 \$x^2\$의 계수가 \$1\$인 이차방정식은 \$x^2 \+ bx \+ c \= 0\$이다.

### 선지

① \$11\$ ② \$12\$ ③ \$13\$ ④ \$14\$ ⑤ \$15\$

### 정답

①

### 해설

1. 조건 (가)에서 근과 계수의 관계에 의하여 \$\\alpha \+ \\beta \= 2a\$, \$\\alpha\\beta \= a \+ 2\$이다. \$\$\\alpha^2\\beta \+ \\alpha\\beta^2 \= \\alpha\\beta(\\alpha \+ \\beta) \= (a \+ 2)(2a) \= 48\$\$ \$\$a^2 \+ 2a - 24 \= 0 \\implies (a \+ 6)(a - 4\) \= 0\$\$ \$\\alpha\\beta \= a \+ 2 \> 0\$이므로 \$a \> \-2\$이고, 따라서 \$a \= 4\$이다.  
2. 조건 (나)에서 \$a \= 4\$이므로 두 근은 \$a - 1 \= 3\$, \$a \+ 1 \= 5\$이다. 근과 계수의 관계에 의하여 \$\$b \= \-(3 \+ 5\) \= \-8, \\quad c \= 3 \\times 5 \= 15\$\$

따라서 구하는 값은 \$\$a \+ b \+ c \= 4 \+ (-8) \+ 15 \= 11\$\$

```
"NONE"
```

```
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-05", "subUnitKey": "H22-C-05-QUADRATIC_EQUATION", "conceptClusterKey": null, "primaryMethod": "(가)에서 근과 계수의 관계와 $\\bar{\\alpha\\beta}>0$ 조건으로 $a=4$를 확정한 뒤 (나)의 두 근 $3, 5$로 $b, c$를 구한다.", "decisiveStep": "이차방정식 $(a+6)(a-4)=0$의 근 중 $\\bar{\\alpha\\beta}=a+2>0$ 조건으로 $a=4$를 선택하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식", "l3": "근과 계수의 관계", "l4": "근으로 방정식 구성"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_ROOT_COEFFICIENT_RELATION", "templateKey": "TPL_H1_VIETA_TRANSFORMED_ROOT", "why": "high1.json H1-RPM-163(DIRECT_ACTIVE): 근과 계수의 관계/근으로 방정식 구성"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계를 두 단계에 걸쳐 적용하고 부호 조건으로 미지수를 확정해야 한다.", "level": "상", "item4slot": {"domain": "복소수와이차방정식", "concept": "이차방정식의근과계수의관계", "skill": "부호조건미정계수결정", "context": "이차방정식작성연계"}, "hold": ""}
```

## Q17

- 형식: 객관식  
- 배점: 4.5

### 발문

\$0\$이 아닌 실수 \$x\$에 대하여 \$x^2 - 4x \+ 1 \= 0\$일 때, \$x^5 \+ \\dfrac{1}{x^5}\$의 값은?

### 선지

① \$714\$ ② \$724\$ ③ \$734\$ ④ \$744\$ ⑤ \$754\$

### 정답

②

### 해설

\$x \\neq 0\$이므로 \$x^2 - 4x \+ 1 \= 0\$의 양변을 \$x\$로 나누면 \$x \+ \\frac{1}{x} \= 4\$이다. 곱셈 공식의 변형에 의하여 \$\$x^2 \+ \\frac{1}{x^2} \= \\left(x \+ \\frac{1}{x}\\right)^2 - 2 \= 4^2 - 2 \= 14\$\$ \$\$x^3 \+ \\frac{1}{x^3} \= \\left(x \+ \\frac{1}{x}\\right)^3 - 3\\left(x \+ \\frac{1}{x}\\right) \= 4^3 - 3(4) \= 52\$\$ 따라서 \$\$x^5 \+ \\frac{1}{x^5} \= \\left(x^2 \+ \\frac{1}{x^2}\\right)\\left(x^3 \+ \\frac{1}{x^3}\\right) - \\left(x \+ \\frac{1}{x}\\right) \= 14 \\times 52 - 4 \= 728 - 4 \= 724\$\$

```
"NONE"
```

```
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-01", "subUnitKey": "H22-C-01-POLYNOMIAL_BASIC", "conceptClusterKey": null, "primaryMethod": "양변을 $x$로 나누어 $x+\\frac{1}{x}=4$를 구한 뒤 제곱합($14$)과 세제곱합($52$)을 곱하고 $x+\\frac{1}{x}$을 빼서 $x^5+\\frac{1}{x^5}$을 구한다.", "decisiveStep": "$(x^2+x^{-2})(x^3+x^{-3})$ 전개에서 남는 잉여항 $(x+x^{-1})$을 빼는 항등식을 구성하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "다항식의 연산", "l3": "다항식의 곱셈", "l4": "곱셈공식"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_POLY_FORMULA_SYMMETRIC", "templateKey": "TPL_H1_FORMULA_SYMMETRIC", "why": "high1.json H1-RPM-136(DIRECT_ACTIVE): 다항식의 곱셈/곱셈공식"}, "crossConceptKeys": [], "conditionKeys": ["COND_NONZERO"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제곱합과 세제곱합을 각각 구한 뒤 다섯제곱합 항등식으로 결합해야 하는 문항이다.", "level": "상", "item4slot": {"domain": "다항식의연산", "concept": "곱셈공식의변형", "skill": "고차역수거듭제곱합", "context": "이차식기반역수합"}, "hold": ""}
```

## Q18

- 형식: 객관식  
- 배점: 4.5

### 발문

등식 \$\\left(\\dfrac{\\sqrt{2}}{1 \+ i}\\right)^n \+ \\left(\\dfrac{1 \+ \\sqrt{3}i}{2}\\right)^n \= 0\$을 만족시키는 자연수 \$n\$의 최솟값은?

### 선지

① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$

### 정답

⑤

### 해설

두 복소수를 각각 \$z\_1 \= \\frac{\\sqrt{2}}{1 \+ i}\$, \$z\_2 \= \\frac{1 \+ \\sqrt{3}i}{2}\$라 하자.

1. \$z\_1 \= \\frac{\\sqrt{2}(1 - i)}{(1 \+ i)(1 - i)} \= \\frac{1 - i}{\\sqrt{2}}\$이므로 \$\$z\_1^2 \= \\frac{-2i}{2} \= \-i, \\quad z\_1^4 \= (-i)^2 \= \-1, \\quad z\_1^8 \= 1\$\$  
2. \$z\_2 \= \\frac{1 \+ \\sqrt{3}i}{2}\$이므로 \$\$z\_2^2 \= \\frac{-2 \+ 2\\sqrt{3}i}{4} \= \\frac{-1 \+ \\sqrt{3}i}{2}, \\quad z\_2^3 \= \\frac{-1 - 3}{4} \= \-1, \\quad z\_2^6 \= 1\$\$

\$z\_1^n \+ z\_2^n \= 0\$, 즉 \$z\_1^n \= \-z\_2^n\$이 되려면 \$z\_1^n\$과 \$z\_2^n\$의 실수 여부가 같아야 한다. \$n \= 1, 2, \\dots, 11\$에 대하여 \$z\_2^n\$이 실수인 \$n \= 3, 6, 9\$일 때 \$z\_1^3, z\_1^6 \= i, z\_1^9\$는 모두 실수가 아니다. \$n \= 12\$일 때 \$z\_1^{12} \= z\_1^8 \\cdot z\_1^4 \= \-1\$이고 \$z\_2^{12} \= (z\_2^6)^2 \= 1\$이므로 \$\$z\_1^{12} \+ z\_2^{12} \= \-1 \+ 1 \= 0\$\$ 따라서 조건을 만족시키는 자연수 \$n\$의 최솟값은 \$12\$이다.

```
"NONE"
```

```
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-04", "subUnitKey": "H22-C-04-COMPLEX_OPERATION", "conceptClusterKey": null, "primaryMethod": "두 복소수 $z_1, z_2$의 거듭제곱 주기($8$과 $6$)를 각각 구한 뒤 $z_1^n=-z_2^n$이 성립하는 최소 자연수 $n=12$를 찾는다.", "decisiveStep": "주기 $8$과 $6$에서 $n=12$일 때 $z_1^{12}=-1, z_2^{12}=1$로 상쇄됨을 확인하고 그 이전 자연수를 배제하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "복소수", "l3": "i의 거듭제곱", "l4": "복소수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_COMPLEX_CONDITION_EQUATION", "templateKey": "TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT", "why": "high1.json H1-RPM-159(DIRECT_ACTIVE): i의 거듭제곱/복소수 조건"}, "crossConceptKeys": [], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "서로 다른 두 복소수의 거듭제곱 주기를 각각 구해 합이 $0$이 되는 최소 지수를 찾아야 한다.", "level": "상", "item4slot": {"domain": "복소수", "concept": "복소수의거듭제곱", "skill": "이중주기성최소지수탐색", "context": "복소수거듭제곱합영"}, "hold": ""}
```

## Q19

- 형식: 서답형  
- 배점: 4.5

### 발문

다음 조건을 만족시키는 모든 이차다항식 \$P(x)\$의 합을 \$T(x)\$라 하자.

(가) \$P(1)P(-1) \= 0\$ (나) 사차다항식 \$P(x){P(x) - 1}\$은 \$x(x - 3)\$으로 나누어떨어진다.

\$T(x)\$를 \$x\$로 나누었을 때의 나머지를 구하시오.

### 선지

없음

### 정답

\$4\$

### 해설

조건 (나)에서 \$P(0){P(0) - 1} \= 0\$이고 \$P(3){P(3) - 1} \= 0\$이므로 \$P(0) \\in {0, 1}\$, \$P(3) \\in {0, 1}\$이다. 조건 (가)에서 \$P(1) \= 0\$ 또는 \$P(-1) \= 0\$이다. \$T(x)\$를 \$x\$로 나눈 나머지는 \$T(0)\$이므로, 조건을 만족시키는 모든 이차다항식 \$P(x)\$의 상수항 \$P(0)\$의 합과 같다. \$P(0) \= 0\$인 경우는 합에 기여하지 않으므로 \$P(0) \= 1\$인 경우만 세면 다음과 같다.

1. \$(P(0), P(3)) \= (1, 1)\$일 때: \$P(x) \= ax(x - 3\) \+ 1\$ (\$a \\neq 0\$)  
   - \$P(1) \= \-2a \+ 1 \= 0 \\implies a \= \\frac{1}{2}\$  
   - \$P(-1) \= 4a \+ 1 \= 0 \\implies a \= \-\\frac{1}{4}\$ (\$2\$개 모두 서로 다른 이차다항식)  
2. \$(P(0), P(3)) \= (1, 0)\$일 때: \$P(x) \= ax^2 \+ bx \+ 1\$에서 \$9a \+ 3b \+ 1 \= 0\$ (\$a \\neq 0\$)  
   - \$P(1) \= a \+ b \+ 1 \= 0\$과 연립하면 \$6a - 2 \= 0 \\implies a \= \\frac{1}{3}, b \= \-\\frac{4}{3}\$  
   - \$P(-1) \= a - b \+ 1 \= 0\$과 연립하면 \$12a \+ 4 \= 0 \\implies a \= \-\\frac{1}{3}, b \= \\frac{2}{3}\$ (\$2\$개 모두 서로 다른 이차다항식)

따라서 \$P(0) \= 1\$인 이차다항식은 총 \$4\$개이므로 \$T(0) \= 1 \\times 4 \= 4\$이다.

```
"NONE"
```

```
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-02", "subUnitKey": "H22-C-02-CORE", "conceptClusterKey": null, "primaryMethod": "조건 (나)에서 $P(0), P(3) \\in \\{0, 1\\}$을 얻고 $T(0)$에 기여하는 $P(0)=1$인 경우를 조건 (가)와 결합해 $4$개의 이차식을 찾는다.", "decisiveStep": "$P(0) \\in \\{0, 1\\}$과 $P(3) \\in \\{0, 1\\}$로 경우를 분기하고 $P(1)=0$ 또는 $P(-1)=0$을 만족하는 이차다항식 개수를 세는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-142(RPM_ONLY): 나머지정리/일차식으로 나눈 나머지"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사차식의 인수정리 조건을 함숫값 집합으로 해석한 뒤 모든 가능한 이차다항식을 케이스별로 결정해야 한다.", "level": "상", "item4slot": {"domain": "항등식과나머지정리", "concept": "인수정리", "skill": "조건부이차다항식결정", "context": "다항식집합합"}, "hold": "RPM_ONLY"}
```

## Q20

- 형식: 객관식  
- 배점: 4.5

### 발문

\$k \> 0\$인 실수 \$k\$에 대하여 이차함수 \$f(x) \= \-x^2 \+ 4x \+ k - 2\$의 그래프와 직선 \$y \= x \+ 2\$가 서로 다른 두 점 \$(\\alpha, f(\\alpha))\$, \$(\\beta, f(\\beta))\$에서 만난다. \$\\alpha \< x \< \\beta\$에서 함수 \$f(x)\$의 최댓값이 \$6\$일 때, \$\\alpha \\le x \\le \\beta\$에서 함수 \$f(x)\$의 최솟값은? (단, \$\\alpha \< \\beta\$)

### 선지

① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$

### 정답

④

### 해설

\$f(x) \= \-(x - 2)^2 \+ k \+ 2\$이므로 그래프는 위로 볼록하고 축은 \$x \= 2\$이다. 직선 \$y \= x \+ 2\$와의 교점의 \$x\$좌표는 \$\$-x^2 \+ 4x \+ k - 2 \= x \+ 2 \\implies x^2 - 3x \+ (4 - k) \= 0\$\$ 의 두 실근 \$\\alpha, \\beta\$이다. \$k \> 0\$이므로 \$x \= 2\$에서 \$(2)^2 - 3(2) \+ 4 - k \= 2 - k\$이고, 축 \$x \= 2\$가 \$(\\alpha, \\beta)\$에 포함되면 최댓값은 꼭짓점의 \$y\$좌표이므로 \$\$k \+ 2 \= 6 \\implies k \= 4\$\$ \$k \= 4\$를 대입하면 \$x^2 - 3x \= 0\$에서 \$\\alpha \= 0, \\beta \= 3\$이므로 실제로 \$2 \\in (0, 3)\$을 만족한다. 구간 \$\[0, 3\]\$에서 최솟값은 축 \$x \= 2\$로부터 더 멀리 떨어진 \$x \= 0\$에서 가지므로 \$\$f(0) \= 4 - 2 \= 2\$\$

```
"NONE"
```

```
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-05", "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "위로 볼록한 포물선의 꼭짓점에서 최댓값 $k+2=6$으로 $k=4$를 구하고 직선과의 교점 $\\alpha=0, \\beta=3$을 구해 구간 $[0,3]$의 최솟값을 구한다.", "decisiveStep": "최댓값 조건으로 $k=4$를 확정한 뒤 교점 구간 $[0,3]$에서 축 $x=2$와 더 먼 끝점 $x=0$의 함숫값을 구하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-170(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수의 최댓값으로 미정계수를 정하고 직선과의 교점 구간을 구한 뒤 다시 최솟값을 구하는 다단계 문항이다.", "level": "상", "item4slot": {"domain": "이차방정식과이차함수", "concept": "이차함수의최대와최소", "skill": "교점구간최대최소연계", "context": "포물선직선교점구간"}, "hold": ""}
```

## Q21

- 형식: 서답형  
- 배점: 8

### 발문

다항식 \$f(x) \= x^3 \+ 2x^2 \+ ax \+ b\$가 \$(x - 2)^2\$으로 나누어떨어질 때, 상수 \$a, b\$의 값과 \$f(x)\$를 \$x - 1\$로 나누었을 때의 나머지를 풀이 과정과 함께 서술하시오.

### 선지

없음

### 정답

\$a \= \-20\$, \$b \= 24\$, 나머지: \$7\$

### 해설

\$f(x)\$가 \$(x - 2)^2\$으로 나누어떨어지므로 \$x - 2\$로 연속하여 두 번 조립제법을 실시하면 나머지가 모두 \$0\$이다.

1. \$1\$차 조립제법 (\$x \= 2\$): 계수 \$1, 2, a, b\$에 대하여 \$2\$로 조립제법을 하면 몫의 계수는 \$(1, 4, a \+ 8)\$이고 나머지는 \$2a \+ b \+ 16 \= 0\$이다.  
2. \$2\$차 조립제법 (\$x \= 2\$): 몫의 계수 \$1, 4, a \+ 8\$에 대하여 다시 \$2\$로 조립제법을 하면 몫의 계수는 \$(1, 6)\$이고 나머지는 \$a \+ 20 \= 0\$이다.

따라서 \$a \= \-20\$이고, 이를 \$2a \+ b \+ 16 \= 0\$에 대입하면 \$\$2(-20) \+ b \+ 16 \= 0 \\implies b \= 24\$\$ 그러므로 \$f(x) \= x^3 \+ 2x^2 - 20x \+ 24\$이고, \$x - 1\$로 나누었을 때의 나머지는 \$\$f(1) \= 1 \+ 2 - 20 \+ 24 \= 7\$\$

```
"NONE"
```

```
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-02", "subUnitKey": "H22-C-02-CORE", "conceptClusterKey": null, "primaryMethod": "연속 조립제법(연조립제법)을 $x=2$로 두 번 시행해 두 나머지가 모두 $0$인 조건으로 $a, b$를 구한 뒤 $f(1)$을 계산한다.", "decisiveStep": "$(x-2)^2$으로 나누어떨어짐을 $2$회 연속 조립제법의 두 나머지 $=0$으로 처리하는 단계", "rpm": {"majorUnit": "다항식", "midUnit": "항등식과 나머지정리", "l3": "나머지정리", "l4": "일차식으로 나눈 나머지"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "high1.json H1-RPM-142(RPM_ONLY): 나머지정리/일차식으로 나눈 나머지"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연속 조립제법을 두 번 적용해 미정계수를 결정하고 나머지정리를 적용하는 표준 서술형 문항이다.", "level": "중", "item4slot": {"domain": "항등식과나머지정리", "concept": "인수정리", "skill": "완전제곱식나누어떨어짐", "context": "서술형연조립제법"}, "hold": "RPM_ONLY"}
```

## Q22

- 형식: 서답형  
- 배점: 12

### 발문

\$1 \\le x \\le 3\$에서 정의된 이차함수 \$f(x) \= x^2 - 2ax \+ 2a^2 - 4\$의 최솟값이 \$13\$일 때, 함수 \$f(x)\$의 최댓값을 풀이 과정과 함께 서술하시오. (단, \$a\$는 양수이고, \$a\$의 값의 범위에 따른 모든 경우를 나누어 서술하시오.)

### 선지

없음

### 정답

\$21\$

### 해설

\$f(x) \= (x - a)^2 \+ a^2 - 4\$이므로 아래로 볼록하고 축은 \$x \= a\$이다. \$a \> 0\$이므로 축 \$x \= a\$의 위치에 따라 세 경우로 나눈다.

1. \$0 \< a \< 1\$일 때: 구간 \$\[1, 3\]\$에서 최솟값은 \$f(1) \= (1 - a)^2 \+ a^2 - 4 \= 2a^2 - 2a - 3 \= 13\$이다. \$a^2 - a - 8 \= 0\$에서 \$a \= \\frac{1 \+ \\sqrt{33}}{2} \> 3\$ (\$a \> 0\$)이므로 \$0 \< a \< 1\$에 모순이다.  
2. \$1 \\le a \\le 3\$일 때: 최솟값은 꼭짓점의 \$y\$좌표 \$f(a) \= a^2 - 4 \= 13\$이다. \$a^2 \= 17\$에서 \$a \= \\sqrt{17} \> 4\$이므로 \$1 \\le a \\le 3\$에 모순이다.  
3. \$a \> 3\$일 때: 구간 \$\[1, 3\]\$에서 최솟값은 \$f(3) \= (3 - a)^2 \+ a^2 - 4 \= 2a^2 - 6a \+ 5 \= 13\$이다. \$\$2a^2 - 6a - 8 \= 0 \\implies a^2 - 3a - 4 \= 0 \\implies (a - 4)(a \+ 1\) \= 0\$\$ \$a \> 3\$이므로 \$a \= 4\$이다.

따라서 \$f(x) \= (x - 4)^2 \+ 12\$이고, 구간 \$\[1, 3\]\$에서 최댓값은 축 \$x \= 4\$에서 가장 먼 \$x \= 1\$일 때이므로 \$\$f(1) \= (1 - 4)^2 \+ 12 \= 9 \+ 12 \= 21\$\$

```
"NONE"
```

```
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "공통수학1", "courseKey": "H22-C1", "curriculum": "2022", "standardUnitKey": "H22-C-05", "subUnitKey": "H22-C-05-QUADRATIC_FUNCTION_APPLICATION", "conceptClusterKey": null, "primaryMethod": "축 $x=a$의 위치에 따라 구간 $0<a<1$, $1 \\le a \\le 3$, $a>3$ 세 구간으로 나누어 최솟값 방정식을 풀고 조건을 만족하는 $a=4$를 찾아 최댓값을 구한다.", "decisiveStep": "세 범위 모두에서 이차방정식을 푼 뒤 $a>3$ 범위와 일치하는 $a=4$만 유효함을 검증하는 단계", "rpm": {"majorUnit": "방정식과 부등식", "midUnit": "이차방정식과 이차함수", "l3": "최대·최소", "l4": "구간 최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT_H1_QUADRATIC_EXTREMA", "templateKey": "TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL", "why": "high1.json H1-RPM-170(DIRECT_ACTIVE): 최대·최소/구간 최대·최소"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "축 미지수 구간 분류 세 경우를 모두 계산해 모순을 배제하고 최댓값을 구해야 하는 서술형이다.", "level": "상", "item4slot": {"domain": "이차방정식과이차함수", "concept": "이차함수의최대와최소", "skill": "미지수축범위분류최대최소", "context": "서술형축위치분기"}, "hold": ""}
```

---

```
{
  "examId": "25_금당고_1학기_중간_고1_유사",
  "sourceExamId": "25_금당고_1학기_중간_고1_기출",
  "totalQuestions": 22,
  "mcqCount": 19,
  "essayCount": 3,
  "answerDistribution": {
    "1": 4,
    "2": 4,
    "3": 3,
    "4": 4,
    "5": 4
  },
  "maxConsecutiveSameChoice": 1,
  "scoreCheck": {
    "mcqScoreSum": 75.5,
    "essayScoreSum": 24.5,
    "totalScore": 100.0
  },
  "textExplicitImageReplacements": []
}
```

