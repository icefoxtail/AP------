```json:exam
{"stem": "24_금당중_1학기_기말_중2_유사", "sourceArchiveFile": "original/middle/m2/1final/24_금당중_1학기_기말_중2_기출.js", "examFolder": "1final", "grade": "중2", "curriculum": "2015", "questionCount": 25, "totalScore": 100, "generatedAt": "2026-11-15"}
```


## Q01
- 형식: 객관식
- 배점: 4
### 발문
$A = 3x - y$, $B = -x + 3y$일 때, $2(2A - 3B) - (3A - 2B)$를 계산하면?
### 선지
① $-7x - 13y$ ② $-7x + 13y$ ③ $7x - 13y$ ④ $7x + 13y$ ⑤ $13x - 7y$
### 정답
③
### 해설
$2(2A - 3B) - (3A - 2B) = 4A - 6B - 3A + 2B = A - 4B$
$= (3x - y) - 4(-x + 3y)$
$= 3x - y + 4x - 12y = 7x - 13y$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-01", "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS", "conceptClusterKey": "M2-01-SIMPLIFY_THEN_SUBSTITUTE_POLY", "primaryMethod": "주어진 식을 A - 4B로 간단히 한 뒤 A = 3x - y, B = -x + 3y를 대입해 동류항을 정리한다.", "decisiveStep": "A - 4B = (3x - y) - 4(-x + 3y) = 7x - 13y를 계산한다.", "rpm": {"majorUnit": "식의 계산", "midUnit": "다항식의 계산", "l3": "다항식의 덧셈과 뺄셈", "l4": "동류항 정리"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "문자식 간단히 한 후 다항식 대입 계산"}, "crossConceptKeys": ["CC_ALGEBRAIC_SIMPLIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "식을 간단히 정리해 두 일차식을 대입하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["다항식"], "goal": ["다항식"], "method": ["분배법칙", "대입", "동류항"], "condition": ["다항식"]}, "hold": ""}
```


## Q02
- 형식: 객관식
- 배점: 4
### 발문
어떤 식에서 $3x^{2} - x + 4$를 빼야 할 것을 잘못하여 더했더니 $5x^{2} + 3x - 2$가 되었다. 이때 바르게 계산한 식은?
### 선지
① $-x^{2} - 5x - 10$ ② $-x^{2} + 5x - 10$ ③ $-x^{2} + 5x + 10$ ④ $x^{2} + 5x - 10$ ⑤ $x^{2} + 5x + 10$
### 정답
②
### 해설
어떤 식을 $A$라 하면
$A + (3x^{2} - x + 4) = 5x^{2} + 3x - 2$
$A = (5x^{2} + 3x - 2) - (3x^{2} - x + 4) = 2x^{2} + 4x - 6$
따라서 바르게 계산한 식은
$A - (3x^{2} - x + 4) = (2x^{2} + 4x - 6) - (3x^{2} - x + 4) = -x^{2} + 5x - 10$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-01", "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS", "conceptClusterKey": "M2-01-ERROR_CORRECTION_POLYNOMIAL", "primaryMethod": "잘못 더한 결과에서 어떤 식 A = 2x^2 + 4x - 6을 구한 뒤 3x^2 - x + 4를 빼 바른 식을 구한다.", "decisiveStep": "A를 구한 뒤 다시 뺄셈을 수행해 -x^2 + 5x - 10을 얻는다.", "rpm": {"majorUnit": "식의 계산", "midUnit": "다항식의 계산", "l3": "다항식의 덧셈과 뺄셈", "l4": "동류항 정리"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION", "templateKey": null, "why": "잘못 계산한 다항식 바로잡기"}, "crossConceptKeys": ["CC_ERROR_CORRECTION", "CC_POLYNOMIAL_SUBTRACTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "어떤 식 A를 먼저 구하고 바른 뺄셈을 한 번 더 수행해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["다항식"], "goal": ["다항식"], "method": ["사칙연산", "동류항"], "condition": ["다항식"]}, "hold": ""}
```


## Q03
- 형식: 객관식
- 배점: 4
### 발문
$4x - [x + 3y - \{6x - 2y - (x - 4y)\}] = ax + by$일 때, $a$와 $b$의 곱을 구하면? (단, $a, b$는 수이다.)
### 선지
① $-8$ ② $-4$ ③ $4$ ④ $6$ ⑤ $8$
### 정답
①
### 해설
$4x - [x + 3y - \{6x - 2y - (x - 4y)\}]$
$= 4x - [x + 3y - \{6x - 2y - x + 4y\}]$
$= 4x - [x + 3y - (5x + 2y)]$
$= 4x - [x + 3y - 5x - 2y]$
$= 4x - (-4x + y) = 8x - y$
따라서 $a = 8,\ b = -1$이므로 $ab = 8 \times (-1) = -8$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-01", "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS", "conceptClusterKey": "M2-01-NESTED_BRACKETS_COEFF_PROD", "primaryMethod": "소괄호, 중괄호, 대괄호를 안쪽부터 풀어 8x - y로 정리한 뒤 계수 a, b의 곱을 계산한다.", "decisiveStep": "중괄호 5x + 2y와 대괄호 -4x + y를 정확히 정리해 8x - y를 얻는다.", "rpm": {"majorUnit": "식의 계산", "midUnit": "다항식의 계산", "l3": "다항식의 덧셈과 뺄셈", "l4": "괄호가 있는 계산"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "다중 괄호 다항식 계산 후 계수 곱"}, "crossConceptKeys": ["CC_ALGEBRAIC_SIMPLIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "괄호 풀기 순서에 따라 동류항을 정리하고 두 계수를 곱하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["다항식"], "goal": ["곱"], "method": ["동류항"], "condition": ["계수"]}, "hold": ""}
```


## Q04
- 형식: 객관식
- 배점: 4
### 발문
$3x(x - 3) - (3x - 1)(-2x)$를 간단히 한 식에서 $x^{2}$의 계수를 $a$, $x$의 계수를 $b$라고 할 때, $a + b$의 값은?
### 선지
① $-3$ ② $-2$ ③ $-1$ ④ $1$ ⑤ $2$
### 정답
②
### 해설
$3x(x - 3) - (3x - 1)(-2x)$
$= 3x^{2} - 9x - (-6x^{2} + 2x)$
$= 3x^{2} - 9x + 6x^{2} - 2x = 9x^{2} - 11x$
따라서 $a = 9,\ b = -11$이므로 $a + b = 9 + (-11) = -2$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-01", "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS", "conceptClusterKey": "M2-01-DISTRIBUTIVE_COEFF_SUM", "primaryMethod": "분배법칙으로 각 항을 전개해 9x^2 - 11x로 정리한 뒤 계수의 합을 구한다.", "decisiveStep": "-(3x - 1)(-2x) = 6x^2 - 2x의 부호 처리로 9x^2 - 11x를 얻는다.", "rpm": {"majorUnit": "식의 계산", "midUnit": "다항식의 계산", "l3": "단항식과 다항식의 곱셈·나눗셈", "l4": "분배법칙"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "단항식과 다항식의 곱셈 전개 후 계수 합"}, "crossConceptKeys": ["CC_ALGEBRAIC_SIMPLIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분배법칙과 동류항 정리로 계수를 구해 더하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["다항식"], "goal": ["합"], "method": ["분배법칙", "동류항"], "condition": ["계수"]}, "hold": ""}
```


## Q05
- 형식: 객관식
- 배점: 4
### 발문
$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$을 계산하면?
### 선지
① $-3x^{2} + 4x - 8$ ② $3x^{2} - 4x - 8$ ③ $3x^{2} + 4x + 8$ ④ $3x^{2} + 4x - 8$ ⑤ $3x^{2} + 4x + 2$
### 정답
④
### 해설
$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$
$= (-3 + 4x) - (5 - 3x^{2})$
$= -3 + 4x - 5 + 3x^{2} = 3x^{2} + 4x - 8$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-01", "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS", "conceptClusterKey": "M2-01-POLY_DIV_BY_MONOMIAL_DIFF", "primaryMethod": "각 분수식을 항별로 단항식으로 나눈 뒤 괄호를 풀어 동류항을 정리한다.", "decisiveStep": "(-3 + 4x) - (5 - 3x^2)에서 +3x^2과 -8 부호를 정확히 계산한다.", "rpm": {"majorUnit": "식의 계산", "midUnit": "다항식의 계산", "l3": "단항식과 다항식의 곱셈·나눗셈", "l4": "다항식을 단항식으로 나누기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "다항식을 단항식으로 나눈 식의 차"}, "crossConceptKeys": ["CC_POLYNOMIAL_DIVISION_BY_MONOMIAL"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항별 나눗셈 후 뺄셈 괄호를 풀어 정리하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["다항식"], "goal": ["다항식"], "method": ["다항식의나눗셈", "동류항"], "condition": ["다항식"]}, "hold": ""}
```


## Q06
- 형식: 객관식
- 배점: 3
### 발문
다음 중 부등식이 아닌 것을 모두 고르면? (정답 $2$개)
### 선지
① $2x + 5$ ② $x + 3 < 5x$ ③ $3 - 11 \le -6$ ④ $3x^{2} - 2x \ge 3x^{2} + x - 4$ ⑤ $4x - 1 = 3x - 5$
### 정답
①, ⑤
### 해설
부등식은 부등호($<, >, \le, \ge$)를 사용하여 수 또는 식의 대소 관계를 나타낸 식이다.
① 다항식이며 부등호가 없다.
⑤ 등호를 사용한 등식이다.
따라서 부등식이 아닌 것은 ①, ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-02", "subUnitKey": "M2-02-LINEAR_INEQUALITY", "conceptClusterKey": "M2-02-IDENTIFY_INEQUALITY", "primaryMethod": "부등호 사용 여부를 기준으로 다항식 ①과 등식 ⑤를 골라낸다.", "decisiveStep": "부등호가 없는 ①과 등호 =를 쓴 ⑤가 부등식이 아님을 판별한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "일차부등식", "l3": "부등식의 성질", "l4": "부등식의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_INEQUALITY_IDENTIFICATION", "templateKey": null, "why": "부등식이 아닌 식 2개 고르기"}, "crossConceptKeys": ["CC_INEQUALITY_IDENTIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부등식의 기본 정의(부등호 사용 여부)를 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["부등식"], "goal": ["부등식"], "method": ["부등식"], "condition": ["부등식"]}, "hold": ""}
```


## Q07
- 형식: 객관식
- 배점: 4
### 발문
$-3a - 2 \le -3b - 2$일 때, 다음 중 옳지 않은 것은?
### 선지
① $a + 2 \ge b + 2$ ② $4a - 1 \ge 4b - 1$ ③ $5 - a \le 5 - b$ ④ $a \ge b$ ⑤ $\frac{a}{3} \le \frac{b}{3}$
### 정답
⑤
### 해설
$-3a - 2 \le -3b - 2$의 양변에 $2$를 더하면 $-3a \le -3b$
양변을 $-3$으로 나누면 부등호 방향이 바뀌어 $a \ge b$
⑤ $a \ge b$의 양변을 양수 $3$으로 나누면 부등호 방향이 바뀌지 않아 $\frac{a}{3} \ge \frac{b}{3}$이어야 한다.
따라서 옳지 않은 것은 ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-02", "subUnitKey": "M2-02-LINEAR_INEQUALITY", "conceptClusterKey": "M2-02-INEQUALITY_PROPERTIES_CHECK", "primaryMethod": "주어진 부등식을 정리해 a >= b를 얻은 뒤 각 보기 연산에서의 부등호 방향을 점검한다.", "decisiveStep": "a >= b를 양수 3으로 나누면 a/3 >= b/3이므로 ⑤가 거짓임을 확인한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "일차부등식", "l3": "부등식의 성질", "l4": "부등식의 성질"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE", "templateKey": null, "why": "부등식의 성질 진위 판별"}, "crossConceptKeys": ["CC_INEQUALITY_PROPERTIES", "CC_DIRECTION_OF_INEQUALITY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부등식의 성질로 a >= b를 유도한 뒤 보기별로 방향을 확인하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["부등식"], "goal": ["부등식"], "method": ["부등식의성질"], "condition": ["부등식"]}, "hold": ""}
```


## Q08
- 형식: 객관식
- 배점: 4
### 발문
다음 중 일차부등식 $12 + x \le 3(x - 2)$의 해가 아닌 것은?
### 선지
① $8$ ② $9$ ③ $10$ ④ $11$ ⑤ $12$
### 정답
①
### 해설
$12 + x \le 3x - 6$
$x - 3x \le -6 - 12$
$-2x \le -18 \implies x \ge 9$
따라서 해가 아닌 것은 ① $8$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-02", "subUnitKey": "M2-02-LINEAR_INEQUALITY", "conceptClusterKey": "M2-02-BRACKET_INEQUALITY_NON_SOLUTION", "primaryMethod": "괄호를 전개하고 이항해 해 x >= 9를 구한 뒤 이 범위에 속하지 않는 보기를 고른다.", "decisiveStep": "-2x <= -18에서 x >= 9를 구해 8이 해가 아님을 판별한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "일차부등식", "l3": "일차부등식의 풀이", "l4": "괄호·분수·소수가 있는 부등식"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_INEQUALITY_SOLVING", "templateKey": null, "why": "괄호가 있는 일차부등식의 해가 아닌 것 찾기"}, "crossConceptKeys": ["CC_NEGATIVE_MULTIPLICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "괄호 전개 후 음수로 나누어 해를 구하는 기본 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차부등식"], "goal": ["해"], "method": ["분배법칙", "이항"], "condition": ["일차부등식"]}, "hold": ""}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
일차부등식 $\frac{1}{3}x - 2 \ge x - a$의 해 중에서 가장 큰 수가 $6$일 때, 수 $a$의 값을 구하면?
### 선지
① $3$ ② $4$ ③ $5$ ④ $6$ ⑤ $7$
### 정답
④
### 해설
$\frac{1}{3}x - 2 \ge x - a$의 양변에 $3$을 곱하면 $x - 6 \ge 3x - 3a$
$-2x \ge 6 - 3a \implies x \le \frac{3a - 6}{2}$
해 중에서 가장 큰 수가 $6$이므로 $\frac{3a - 6}{2} = 6$
$3a - 6 = 12 \implies 3a = 18 \implies a = 6$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-02", "subUnitKey": "M2-02-LINEAR_INEQUALITY", "conceptClusterKey": "M2-02-MAX_SOLUTION_PARAMETER", "primaryMethod": "일차부등식을 x <= (3a - 6)/2로 정리한 뒤 최댓값 6과 같다고 놓고 a를 구한다.", "decisiveStep": "(3a - 6)/2 = 6에서 a = 6을 얻는다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "일차부등식", "l3": "해의 조건", "l4": "계수 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "부등식 해의 최댓값이 주어졌을 때 상수 구하기"}, "crossConceptKeys": ["CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자가 포함된 부등식의 해 범위를 구하고 경계값을 최댓값 6과 등치시켜 풀어야 한다.", "level": "중", "item4slot": {"given": ["일차부등식", "최댓값"], "goal": ["상수"], "method": ["이항", "등식"], "condition": ["해"]}, "hold": ""}
```


## Q10
- 형식: 객관식
- 배점: 4
### 발문
두 일차부등식 $\frac{1}{2}(x - 2) \le 0.3(x - 5) - 2.9$, $\frac{2 - x}{3} \ge \frac{a}{2} + \frac{1}{3}$의 해가 서로 같을 때, 수 $a$의 값은?
### 선지
① $10$ ② $11$ ③ $12$ ④ $13$ ⑤ $14$
### 정답
③
### 해설
첫째 부등식의 양변에 $10$을 곱하면 $5(x - 2) \le 3(x - 5) - 29$
$5x - 10 \le 3x - 15 - 29 \implies 2x \le -34 \implies x \le -17$
둘째 부등식의 양변에 $6$을 곱하면 $2(2 - x) \ge 3a + 2$
$4 - 2x \ge 3a + 2 \implies -2x \ge 3a - 2 \implies x \le \frac{2 - 3a}{2}$
두 부등식의 해가 같으므로 $\frac{2 - 3a}{2} = -17 \implies 2 - 3a = -34 \implies 3a = 36 \implies a = 12$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-02", "subUnitKey": "M2-02-LINEAR_INEQUALITY", "conceptClusterKey": "M2-02-EQUIVALENT_INEQUALITY_CONSTANT", "primaryMethod": "소수·분수 계수 부등식에서 x <= -17을 구한 뒤 둘째 부등식의 해 x <= (2 - 3a)/2와 경계값을 등치시켜 a를 구한다.", "decisiveStep": "(2 - 3a)/2 = -17에서 a = 12를 구한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "일차부등식", "l3": "해의 조건", "l4": "계수 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 일차부등식의 해가 같을 때 상수 구하기"}, "crossConceptKeys": ["CC_DECIMAL_COEFFICIENTS", "CC_FRACTION_COEFFICIENTS", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수·소수·괄호가 섞인 두 부등식을 각각 정리해 경계값을 비교해야 한다.", "level": "중", "item4slot": {"given": ["일차부등식", "분수"], "goal": ["상수"], "method": ["분배법칙", "이항", "등식"], "condition": ["해"]}, "hold": ""}
```


## Q11
- 형식: 객관식
- 배점: 4
### 발문
평행사변형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 하자. $\angle BAC = 38^{\circ}$, $\angle ACB = 47^{\circ}$일 때, $\angle ACD + \angle CAD$의 크기는?
### 선지
① $75^{\circ}$ ② $80^{\circ}$ ③ $85^{\circ}$ ④ $90^{\circ}$ ⑤ $95^{\circ}$
### 정답
③
### 해설
평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각의 성질에 의해 $\angle ACD = \angle BAC = 38^{\circ}$
또한 $\overline{AD} \parallel \overline{BC}$이므로 엇각의 성질에 의해 $\angle CAD = \angle ACB = 47^{\circ}$
$\therefore \angle ACD + \angle CAD = 38^{\circ} + 47^{\circ} = 85^{\circ}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_ALTERNATE_ANGLES", "primaryMethod": "평행사변형의 두 쌍의 대변이 각각 평행함을 이용해 엇각으로 ∠ACD와 ∠CAD를 구해 합한다.", "decisiveStep": "엇각 ∠ACD = 38도, ∠CAD = 47도를 구해 합 85도를 얻는다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형과 엇각을 이용한 각의 합"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_ALTERNATE_INTERIOR_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행사변형의 대변 평행과 엇각 성질만으로 바로 각을 구할 수 있는 문항이다.", "level": "하", "item4slot": {"given": ["평행사변형", "대각선"], "goal": ["합"], "method": ["엇각"], "condition": ["평행"]}, "hold": ""}
```


## Q12
- 형식: 객관식
- 배점: 3
### 발문
평행사변형 $ABCD$의 둘레의 길이는 $30\text{ cm}$이고, $\overline{AB} : \overline{AD} = 2 : 3$일 때, $\overline{CD}$의 길이는?
### 선지
① $3\text{ cm}$ ② $4\text{ cm}$ ③ $5\text{ cm}$ ④ $6\text{ cm}$ ⑤ $9\text{ cm}$
### 정답
④
### 해설
평행사변형에서 대변의 길이가 같으므로 $\overline{AB} + \overline{AD} = \frac{30}{2} = 15\text{ cm}$
$\overline{AB} : \overline{AD} = 2 : 3$이므로 $\overline{AB} = 15 \times \frac{2}{2 + 3} = 6\text{ cm}$
$\therefore \overline{CD} = \overline{AB} = 6\text{ cm}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_PERIMETER_RATIO", "primaryMethod": "둘레의 절반 15cm를 2 : 3으로 비례배분해 AB 길이를 구하고 대변 CD 길이와 같음을 이용한다.", "decisiveStep": "AB + AD = 15를 2 : 3으로 나누어 CD = AB = 6을 얻는다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형 둘레와 변의 길이 비"}, "crossConceptKeys": ["CC_PARALLELOGRAMS", "CC_RATIO_AND_PROPORTION", "CC_PERIMETER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행사변형 대변 길이 일치와 비례배분을 한 번 적용하면 풀리는 기본 문항이다.", "level": "하", "item4slot": {"given": ["평행사변형", "둘레", "비"], "goal": ["길이"], "method": ["비례식"], "condition": ["평행사변형"]}, "hold": ""}
```


## Q13
- 형식: 객관식
- 배점: 4
### 발문
평행사변형 $ABCD$에서 $\angle A$와 $\angle D$의 이등분선이 변 $BC$와 만나는 점을 각각 $E, F$라 하자. $\overline{AB} = x$이고 $\overline{AD} = y$ ($2x > y$)일 때, $\overline{EF}$의 길이는?
### 선지
① $\frac{1}{4}y$ ② $\frac{1}{3}x$ ③ $2y - 2x$ ④ $2y - x$ ⑤ $2x - y$
### 정답
⑤
### 해설
$\overline{AD} \parallel \overline{BC}$이므로 $\angle AEB = \angle DAE = \angle BAE$ (엇각과 각의 이등분선)
따라서 $\triangle ABE$는 이등변삼각형이므로 $\overline{BE} = \overline{AB} = x$
마찬가지로 $\triangle DCF$도 이등변삼각형이므로 $\overline{CF} = \overline{CD} = x$
$\overline{BC} = \overline{AD} = y$이고 $2x > y$이므로
$\overline{EF} = \overline{BE} + \overline{CF} - \overline{BC} = x + x - y = 2x - y$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "13", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_ANGLE_BISECTORS_OVERLAP", "primaryMethod": "평행선 엇각으로 두 이등변삼각형 ABE, DCF를 찾아 BE = CF = x를 구한 뒤 겹치는 선분 EF = 2x - y를 계산한다.", "decisiveStep": "BE = x, CF = x와 BC = y의 겹침 관계에서 EF = x + x - y = 2x - y를 도출한다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 성질", "l4": "변·각의 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형 내각 이등분선이 만드는 겹친 선분 길이"}, "crossConceptKeys": ["CC_ANGLE_BISECTOR_PARALLEL", "CC_ISOSCELES_TRIANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "엇각으로 이등변삼각형 두 개를 찾고 2x > y 조건에서 선분 겹침 길이를 식으로 표현해야 한다.", "level": "중", "item4slot": {"given": ["평행사변형", "이등분선"], "goal": ["길이"], "method": ["엇각", "이등변삼각형"], "condition": ["이등분선"]}, "hold": ""}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
사각형 $ABCD$에서 $\angle A = 115^{\circ}$, $\angle B = 65^{\circ}$이고 $\overline{AD} = \overline{BC} = 8\text{ cm}$일 때, $\square ABCD$가 평행사변형이 되는 가장 알맞은 조건은?
### 선지
① 두 쌍의 대변이 각각 평행하다. ② 두 쌍의 대변의 길이가 각각 같다. ③ 두 쌍의 대각의 크기가 각각 같다. ④ 한 쌍의 대변이 평행하고 그 길이가 같다. ⑤ 두 대각선이 서로 다른 것을 이등분한다.
### 정답
④
### 해설
$\angle A + \angle B = 115^{\circ} + 65^{\circ} = 180^{\circ}$이므로 동측내각의 합이 $180^{\circ}$가 되어 $\overline{AD} \parallel \overline{BC}$이다.
여기에 $\overline{AD} = \overline{BC} = 8\text{ cm}$이므로 한 쌍의 대변이 평행하고 그 길이가 같아서 평행사변형이 된다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_CRITERION_MATCH", "primaryMethod": "∠A + ∠B = 180도에서 AD // BC를 이끌어내고 AD = BC 조건과 결합해 평행사변형 조건을 선택한다.", "decisiveStep": "동측내각 합 180도로 평행 조건을 확인해 ④를 고른다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "평행사변형의 판정", "l4": "변·각 조건"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주어진 각·길이 조건에 맞는 평행사변형 판정 조건 고르기"}, "crossConceptKeys": ["CC_PARALLELOGRAM_CRITERIA", "CC_SUPPLEMENTARY_ANGLES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 이웃각의 합 180도로 평행을 판단하고 대변 길이 일치와 연결하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["사각형", "각", "길이"], "goal": ["조건"], "method": ["평행"], "condition": ["평행사변형"]}, "hold": ""}
```


## Q15
- 형식: 객관식
- 배점: 4
### 발문
평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 할 때, 다음 중 평행사변형 $ABCD$가 정사각형이 되는 조건이 아닌 것은? (정답 $2$개)
### 선지
① $\overline{AB} = \overline{BC},\ \overline{AC} = \overline{BD}$ ② $\overline{AO} = \overline{BO},\ \overline{CO} = \overline{DO}$ ③ $\angle A = 90^{\circ},\ \overline{AB} \perp \overline{BC}$ ④ $\angle A = 90^{\circ},\ \overline{AB} = \overline{BC}$ ⑤ $\overline{AC} = \overline{BD},\ \overline{AC} \perp \overline{BD}$
### 정답
②, ③
### 해설
평행사변형이 정사각형이 되려면 직사각형 조건과 마름모 조건을 동시에 추가해야 한다.
① 마름모 조건($\overline{AB} = \overline{BC}$) + 직사각형 조건($\overline{AC} = \overline{BD}$) $\implies$ 정사각형
② $\overline{AC} = \overline{BD}$이므로 직사각형만 된다.
③ $\angle A = 90^{\circ}$와 $\overline{AB} \perp \overline{BC}$는 모두 직사각형 조건이므로 직사각형만 된다.
④ 직사각형 조건($\angle A = 90^{\circ}$) + 마름모 조건($\overline{AB} = \overline{BC}$) $\implies$ 정사각형
⑤ 직사각형 조건($\overline{AC} = \overline{BD}$) + 마름모 조건($\overline{AC} \perp \overline{BD}$) $\implies$ 정사각형
따라서 정사각형이 되는 조건이 아닌 것은 ②, ③이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "15", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_TO_SQUARE_CONDITIONS", "primaryMethod": "평행사변형에 직사각형 조건과 마름모 조건이 모두 추가되는지 보기별로 판별해 직사각형만 되는 2개를 고른다.", "decisiveStep": "②와 ③은 직사각형 조건만 중복되어 마름모 조건이 없음을 확인한다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사각형의 포함 관계", "l4": "조건으로 사각형 판정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형이 정사각형이 될 조건 판별"}, "crossConceptKeys": ["CC_SQUARE_CLASSIFICATION", "CC_QUADRILATERAL_HIERARCHY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "각 보기가 직사각형 조건과 마름모 조건을 모두 포함하는지 구별해야 한다.", "level": "중", "item4slot": {"given": ["평행사변형", "대각선"], "goal": ["조건"], "method": ["정사각형"], "condition": ["정사각형"]}, "hold": ""}
```


## Q16
- 형식: 객관식
- 배점: 4
### 발문
직사각형 모양의 종이를 가로로 한 번, 세로로 한 번 반씩 접어 네 겹이 된 상태에서, 두 접힌 선이 만나는 꼭짓점을 포함한 두 접힌 변 위에 길이가 각각 다른 두 점을 잡아 잇는 길이 $8\text{ cm}$인 선분을 따라 직각삼각형 모양으로 잘라낸 후 폈다. 다음 중 만들어지는 사각형에 대한 설명으로 옳지 않은 것을 모두 고르면? (정답 $2$개)
### 선지
① 대각선이 서로 수직인 직사각형이다. ② 대각선이 서로 수직인 평행사변형이다. ③ 이웃하는 두 변의 길이가 같은 평행사변형이다. ④ 두 쌍의 대각의 크기가 각각 같은 사각형이다. ⑤ 한 내각이 직각인 마름모이다.
### 정답
①, ⑤
### 해설
종이를 가로·세로로 두 번 접어 직각삼각형 모양으로 자른 뒤 펴면, 자른 선분 $4$개가 네 변이 되고 접힌 선이 서로 수직인 두 대각선이 되며 자른 두 변의 길이가 다르므로 직각이 아닌 마름모가 된다.
① 직사각형이 아니다. (거짓)
⑤ 한 내각이 직각인 마름모(정사각형)가 아니다. (거짓)
따라서 옳지 않은 것은 ①, ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PAPER_FOLDING_RHOMBUS", "primaryMethod": "두 번 접어 자른 뒤 편 도형이 네 변의 길이가 모두 8cm이고 직각이 아닌 마름모임을 파악해 틀린 설명 2개를 고른다.", "decisiveStep": "만들어지는 도형이 정사각형이 아닌 일반 마름모이므로 직사각형·직각을 언급한 ①, ⑤가 거짓임을 판별한다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "각 사각형의 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "종이접기 잘라내기로 만든 마름모 성질 판별"}, "crossConceptKeys": ["CC_GEOMETRIC_FOLDING", "CC_RHOMBUS_PROPERTIES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "접어 자른 도형이 마름모임을 추론하고 마름모의 포함 관계와 성질 중 거짓 2개를 골라야 한다.", "level": "중", "item4slot": {"given": ["사각형", "길이"], "goal": ["성질"], "method": ["마름모"], "condition": ["마름모"]}, "hold": ""}
```


## Q17
- 형식: 객관식
- 배점: 4
### 발문
사각형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 할 때, 다음 중 $\square ABCD$가 마름모가 되는 조건은?
### 선지
① $\overline{AC} = \overline{BD},\ \overline{AC} \perp \overline{BD}$ ② $\overline{AB} \parallel \overline{DC},\ \angle AOB = 90^{\circ}$ ③ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \overline{AC} = \overline{BD}$ ④ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \angle A = 90^{\circ}$ ⑤ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \angle AOB = 90^{\circ}$
### 정답
⑤
### 해설
⑤ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC}$이므로 평행사변형이고, 여기에 $\angle AOB = 90^{\circ}$(두 대각선이 직교)가 추가되므로 마름모가 된다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "17", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-RHOMBUS_SUFFICIENT_CONDITION", "primaryMethod": "일반 사각형이 평행사변형이 되는 조건과 대각선 직교 조건을 모두 갖춘 보기를 찾는다.", "decisiveStep": "한 쌍 대변 평행·길이 일치(평행사변형) + ∠AOB = 90도(직교)를 모두 만족하는 ⑤를 고른다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사각형의 포함 관계", "l4": "조건으로 사각형 판정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "일반 사각형이 마름모가 되는 조건 판별"}, "crossConceptKeys": ["CC_RHOMBUS", "CC_SUFFICIENT_CONDITIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일반 사각형에서 출발하므로 평행사변형 조건과 마름모 조건이 모두 갖추어졌는지 확인해야 한다.", "level": "중", "item4slot": {"given": ["사각형", "대각선"], "goal": ["조건"], "method": ["마름모", "평행사변형"], "condition": ["마름모"]}, "hold": ""}
```


## Q18
- 형식: 객관식
- 배점: 4
### 발문
$\overline{AB} \ne \overline{BC}$인 평행사변형 $ABCD$에서 네 내각의 이등분선의 교점으로 이루어진 사각형 $PQRS$에 대한 설명으로 다음 중 옳지 않은 것은?
### 선지
① $\overline{PS} = \overline{QR}$ ② $\overline{PR} \perp \overline{QS}$ ③ $\angle P = \angle R = 90^{\circ}$ ④ $\overline{PR} = \overline{QS}$ ⑤ $\overline{PQ} = \overline{SR}$
### 정답
②
### 해설
평행사변형 $ABCD$의 네 내각의 이등분선의 교점으로 이루어진 $\square PQRS$는 직사각형이다($\overline{AB} \ne \overline{BC}$이므로 정사각형은 아니다).
직사각형은 두 쌍의 대변의 길이가 같고($\overline{PS} = \overline{QR},\ \overline{PQ} = \overline{SR}$), 네 내각이 모두 $90^{\circ}$이며, 두 대각선의 길이가 같다($\overline{PR} = \overline{QS}$).
그러나 두 대각선은 서로 수직이 아니므로 ② $\overline{PR} \perp \overline{QS}$는 옳지 않다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "18", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_BISECTORS_RECTANGLE", "primaryMethod": "평행사변형의 네 내각 이등분선으로 생기는 사각형 PQRS가 직사각형임을 확인한 뒤 직사각형의 성질이 아닌 것을 고른다.", "decisiveStep": "PQRS는 직사각형이지만 정사각형은 아니므로 대각선 직교 ②가 거짓임을 판별한다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "특수 사각형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형 내각 이등분선이 만드는 직사각형 성질"}, "crossConceptKeys": ["CC_RECTANGLE_PROPERTIES", "CC_ANGLE_BISECTOR_PROPERTY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "네 내각 이등분선이 직사각형을 만든다는 성질을 알고 대각선 직교 여부를 판별해야 한다.", "level": "중", "item4slot": {"given": ["평행사변형", "이등분선"], "goal": ["성질"], "method": ["직사각형"], "condition": ["대각선"]}, "hold": ""}
```


## Q19
- 형식: 객관식
- 배점: 3
### 발문
다음 보기 중 두 대각선이 서로 다른 것을 이등분하는 사각형은 몇 개인가?


ㄱ. 평행사변형    ㄴ. 사다리꼴
ㄷ. 등변사다리꼴  ㄹ. 정사각형
ㅁ. 직사각형      ㅂ. 마름모
### 선지
① $2$개 ② $3$개 ③ $4$개 ④ $5$개 ⑤ $6$개
### 정답
③
### 해설
두 대각선이 서로 다른 것을 이등분하는 사각형은 평행사변형과 평행사변형에 포함되는 사각형이다.
따라서 ㄱ. 평행사변형, ㄹ. 정사각형, ㅁ. 직사각형, ㅂ. 마름모의 $4$개이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "19", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-DIAGONAL_BISECTION_COUNT", "primaryMethod": "두 대각선이 서로 다른 것을 이등분하는 성질이 평행사변형과 그 하위 특수 사각형에서 성립함을 이용해 개수를 센다.", "decisiveStep": "사다리꼴과 등변사다리꼴을 제외한 ㄱ, ㄹ, ㅁ, ㅂ의 4개를 고른다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사각형의 포함 관계", "l4": "성질 비교"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": null, "why": "대각선 이등분 성질을 만족하는 사각형 개수"}, "crossConceptKeys": ["CC_DIAGONALS", "CC_QUADRILATERAL_HIERARCHY"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행사변형의 대각선 성질이 포함되는 사각형들을 바로 세는 1단계 개념 문항이다.", "level": "하", "item4slot": {"given": ["사각형", "대각선"], "goal": ["개수"], "method": ["평행사변형"], "condition": ["대각선"]}, "hold": ""}
```


## Q20
- 형식: 객관식
- 배점: 3
### 발문
다음 중 사각형과 그 사각형의 각 변의 중점을 연결하여 만든 사각형을 짝지은 것으로 옳지 않은 것은?
### 선지
① 평행사변형 - 직사각형 ② 직사각형 - 마름모 ③ 마름모 - 직사각형 ④ 정사각형 - 정사각형 ⑤ 등변사다리꼴 - 마름모
### 정답
①
### 해설
① 평행사변형의 각 변의 중점을 연결하여 만든 사각형은 평행사변형이다. (직사각형이 아니다.)
②, ③, ④, ⑤는 모두 옳다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "20", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-MIDPOINT_QUADRILATERALS", "primaryMethod": "원래 사각형의 대각선 길이·수직 여부에 따라 중점 연결 사각형이 결정됨을 이용해 틀린 짝을 찾는다.", "decisiveStep": "평행사변형의 중점 연결 사각형은 평행사변형이므로 ①이 거짓임을 확인한다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사다리꼴", "l4": "중점 연결"}, "ptTplCandidate": {"problemTypeKey": "PT_QUADRILATERAL_PROPERTIES", "templateKey": null, "why": "사각형의 각 변 중점을 연결한 사각형 판별"}, "crossConceptKeys": ["CC_QUADRILATERAL_CLASSIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사각형별 중점 연결 도형 결과를 바로 대조하는 1단계 개념 문항이다.", "level": "하", "item4slot": {"given": ["사각형", "중점"], "goal": ["사각형"], "method": ["평행사변형"], "condition": ["중점"]}, "hold": ""}
```


## Q21
- 형식: 객관식
- 배점: 4
### 발문
$\overline{AD} \parallel \overline{BC}$인 등변사다리꼴 $ABCD$에서 $\overline{AB} = \overline{AD}$이고 $\angle DBC = 28^{\circ}$일 때, $\angle BDC$의 크기를 구하면?
### 선지
① $92^{\circ}$ ② $96^{\circ}$ ③ $100^{\circ}$ ④ $104^{\circ}$ ⑤ $108^{\circ}$
### 정답
②
### 해설
$\overline{AD} \parallel \overline{BC}$이므로 $\angle ADB = \angle DBC = 28^{\circ}$ (엇각)
$\overline{AB} = \overline{AD}$이므로 $\triangle ABD$는 이등변삼각형이고 $\angle ABD = \angle ADB = 28^{\circ}$
따라서 $\angle ABC = 28^{\circ} + 28^{\circ} = 56^{\circ}$
등변사다리꼴에서 밑각의 크기가 같으므로 $\angle C = \angle ABC = 56^{\circ}$
$\triangle BCD$에서 $\angle BDC = 180^{\circ} - (28^{\circ} + 56^{\circ}) = 96^{\circ}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-ISOSCELES_TRAPEZOID_ANGLE", "primaryMethod": "엇각으로 ∠ADB = 28도, 이등변삼각형으로 ∠ABD = 28도를 구해 ∠C = 56도를 얻은 뒤 삼각형 BCD 내각 합에서 ∠BDC를 구한다.", "decisiveStep": "∠ABC = ∠C = 56도를 구해 180 - (28 + 56) = 96도를 계산한다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "사다리꼴", "l4": "등변사다리꼴"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "등변사다리꼴과 이등변삼각형을 이용한 각의 크기"}, "crossConceptKeys": ["CC_ISOSCELES_TRAPEZOID", "CC_ISOSCELES_TRIANGLES", "CC_TRIANGLE_ANGLE_SUM"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행선 엇각, 이등변삼각형, 등변사다리꼴 밑각 일치를 순서대로 연결해 각을 구해야 한다.", "level": "중", "item4slot": {"given": ["등변사다리꼴", "각"], "goal": ["각"], "method": ["엇각", "이등변삼각형"], "condition": ["평행"]}, "hold": ""}
```


## Q22
- 형식: 서답형
- 배점: 5
### 발문
[서술형 1] $x = \frac{3}{5}$, $y = 3$일 때, 식 $y - [2x - \{3y + (12y^{2} - 9xy) \div 3y\}]$의 값을 구하려고 한다. 다음 물음에 답하시오.
(1) $y - [2x - \{3y + (12y^{2} - 9xy) \div 3y\}]$를 계산하시오. [3점]
(2) (1)의 결과에 $x = \frac{3}{5}$와 $y = 3$을 대입하여 주어진 식의 값을 구하시오. [2점]
### 선지
없음
### 정답
(1) $-5x + 8y$, (2) $21$
### 해설
(1) $y - [2x - \{3y + (12y^{2} - 9xy) \div 3y\}]$
$= y - [2x - \{3y + (4y - 3x)\}]$
$= y - [2x - (7y - 3x)]$
$= y - (5x - 7y) = -5x + 8y$
(2) $x = \frac{3}{5},\ y = 3$을 대입하면 $-5 \times \frac{3}{5} + 8 \times 3 = -3 + 24 = 21$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-01", "subUnitKey": "M2-01-POLYNOMIAL_OPERATIONS", "conceptClusterKey": "M2-01-SIMPLIFY_AND_EVALUATE", "primaryMethod": "소괄호의 다항식 나눗셈을 먼저 계산해 -5x + 8y로 정리한 뒤 x, y 값을 대입한다.", "decisiveStep": "중괄호 7y - 3x와 대괄호 5x - 7y를 거쳐 -5x + 8y를 얻고 대입해 21을 구한다.", "rpm": {"majorUnit": "식의 계산", "midUnit": "다항식의 계산", "l3": "식의 값과 활용", "l4": "식의 값"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "다항식 나눗셈 및 괄호 정리 후 식의 값"}, "crossConceptKeys": ["CC_POLYNOMIAL_DIVISION_BY_MONOMIAL", "CC_ALGEBRAIC_SIMPLIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "다항식 나눗셈과 다중 괄호 뺄셈을 차례로 정리한 뒤 분수를 대입해야 한다.", "level": "중", "item4slot": {"given": ["다항식", "분수"], "goal": ["식의값"], "method": ["다항식의나눗셈", "대입"], "condition": ["다항식"]}, "hold": ""}
```


## Q23
- 형식: 서답형
- 배점: 5
### 발문
[서술형 2] 준호는 집에서 $8\text{ km}$ 떨어진 도서관까지 가는데, 처음에는 자전거를 타고 시속 $10\text{ km}$로 가다가 도중에 자전거가 고장이 나서 멈추고 $15$분 동안 살펴본 후, 다시 자전거를 끌고 시속 $5\text{ km}$로 걸어갔다. 도서관까지 가는 데 걸린 시간이 $1$시간 $30$분을 넘지 않았을 때, 자전거가 고장 난 지점은 집에서 몇 $\text{km}$ 이상 떨어진 곳인지 구하려고 한다. 다음 물음에 답하시오.
(1) 전체 걸리는 시간이 $1$시간 $30$분을 넘지 않음을 이용하여 부등식을 세우시오. [3점]
(2) 자전거가 고장 난 지점은 집에서 몇 $\text{km}$ 이상 떨어진 곳인지 구하시오. [2점]
### 선지
없음
### 정답
(1) $\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$, (2) $\frac{7}{2}\text{ km}$ 이상
### 해설
(1) 집에서 고장 난 지점까지의 거리를 $x\text{ km}$라 하면 걸어간 거리는 $(8 - x)\text{ km}$이다.
$15$분 $= \frac{15}{60}$시간, $1$시간 $30$분 $= \frac{3}{2}$시간이므로
$\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$
(2) 양변에 $20$을 곱하면 $2x + 5 + 4(8 - x) \le 30$
$-2x + 37 \le 30 \implies -2x \le -7 \implies x \ge \frac{7}{2}$
따라서 집에서 $\frac{7}{2}\text{ km}$($3.5\text{ km}$) 이상 떨어진 곳이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "23", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-02", "subUnitKey": "M2-02-LINEAR_INEQUALITY_WORD", "conceptClusterKey": "M2-02-WORD_BREAKDOWN_DISTANCE", "primaryMethod": "자전거 이동 시간 x/10, 휴식 시간 15/60, 도보 시간 (8-x)/5의 합이 3/2시간 이하라는 일차부등식을 세워 푼다.", "decisiveStep": "양변에 20을 곱해 2x + 5 + 4(8 - x) <= 30을 정리해 x >= 7/2을 얻는다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "일차부등식의 활용", "l3": "거리·속력·시간", "l4": "시간 제한"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED", "templateKey": null, "why": "도중 고장·휴식이 포함된 이동 시간 일차부등식 서술형"}, "crossConceptKeys": ["CC_SPEED_DISTANCE_TIME", "CC_APPLIED_WORD_PROBLEMS"], "conditionKeys": ["COND_UPPER_BOUND"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "휴식 시간 15분을 시간 단위로 환산해 세 구간의 시간 합 부등식을 세워 풀어야 한다.", "level": "중", "item4slot": {"given": ["거리", "속력"], "goal": ["최솟값"], "method": ["일차부등식"], "condition": ["거리", "속력"]}, "hold": ""}
```


## Q24
- 형식: 서답형
- 배점: 6
### 발문
[서술형 3] $\overline{AD} \parallel \overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라고 할 때, $\overline{AO} : \overline{OC} = 2 : 5$이다. $\triangle ODC$의 넓이가 $14\text{ cm}^{2}$일 때, 다음 물음에 답하시오.
(1) $\triangle OAB$와 $\triangle ODC$의 넓이가 같은 이유를 설명하시오. [3점]
(2) $\triangle OBC$의 넓이를 구하시오. [3점]
### 선지
없음
### 정답
(1) $\triangle ABC = \triangle DBC$에서 공통 부분 $\triangle OBC$를 빼면 $\triangle OAB = \triangle ODC$, (2) $35\text{ cm}^{2}$
### 해설
(1) $\overline{AD} \parallel \overline{BC}$이므로 밑변 $\overline{BC}$가 같고 높이가 같은 두 삼각형 $\triangle ABC$와 $\triangle DBC$의 넓이는 같다.
양쪽 넓이에서 공통 부분인 $\triangle OBC$의 넓이를 빼면 $\triangle OAB = \triangle ODC$이다.
(2) $\triangle OAB = \triangle ODC = 14\text{ cm}^{2}$이고, $\triangle OAB$와 $\triangle OBC$는 높이가 같으므로 넓이의 비는 밑변의 길이의 비 $\overline{AO} : \overline{OC} = 2 : 5$와 같다.
$14 : \triangle OBC = 2 : 5 \implies \triangle OBC = 35\text{ cm}^{2}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-TRAPEZOID_DIAGONAL_AREAS", "primaryMethod": "평행선 사이 넓이가 같은 △ABC = △DBC에서 공통 부분 △OBC를 빼 △OAB = 14를 구한 뒤 밑변 비 2 : 5로 △OBC를 구한다.", "decisiveStep": "△OAB : △OBC = AO : OC = 2 : 5에서 △OBC = 35를 얻는다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "평행사변형", "l3": "넓이와 활용", "l4": "평행선과 넓이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "사다리꼴 대각선 분할 삼각형 넓이 비"}, "crossConceptKeys": ["CC_PARALLEL_LINES_EQUAL_AREA", "CC_AREA_RATIO", "CC_TRAPEZOID"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행선과 넓이 성질로 나비 모양 넓이 일치를 설명한 뒤 높이가 같은 삼각형 넓이 비를 적용해야 한다.", "level": "중", "item4slot": {"given": ["사다리꼴", "비", "넓이"], "goal": ["넓이"], "method": ["비례식"], "condition": ["평행"]}, "hold": ""}
```


## Q25
- 형식: 서답형
- 배점: 4
### 발문
[서술형 4] 평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 하고, $\angle CAB = a$, $\angle ODC = b$일 때 다음 물음에 답하시오.
(1) $a = b$이면 직사각형임을 설명하시오. [2점]
(2) $a + b = 90^{\circ}$이면 마름모임을 설명하시오. [2점]
### 선지
없음
### 정답
(1) $\overline{OC} = \overline{OD}$이므로 $\overline{AC} = \overline{BD}$가 되어 직사각형이다, (2) $\angle COD = 90^{\circ}$이므로 두 대각선이 직교하여 마름모이다
### 해설
평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각에 의해 $\angle ACD = \angle CAB = a$이다.
(1) $a = b$이면 $\triangle ODC$에서 $\angle OCD = \angle ODC$이므로 $\overline{OC} = \overline{OD}$이다. 평행사변형의 두 대각선은 서로 다른 것을 이등분하므로 $\overline{AC} = 2\overline{OC} = 2\overline{OD} = \overline{BD}$가 되어 두 대각선의 길이가 같으므로 직사각형이다.
(2) $a + b = 90^{\circ}$이면 $\triangle ODC$에서 $\angle COD = 180^{\circ} - (a + b) = 90^{\circ}$이다. 두 대각선이 서로 수직으로 만나므로 마름모이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "25", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-05", "subUnitKey": "M2-05-QUADRILATERAL_PROPERTIES", "conceptClusterKey": "M2-05-PARALLELOGRAM_ANGLE_TO_RECT_RHOMBUS", "primaryMethod": "엇각 ∠ACD = a를 구한 뒤 △ODC에서 a = b일 때 대각선 길이 일치(직사각형), a + b = 90도일 때 대각선 직교(마름모)를 보인다.", "decisiveStep": "△ODC에서 ∠OCD = a를 이용해 이등변삼각형과 직각삼각형 조건을 도출한다.", "rpm": {"majorUnit": "사각형의 성질", "midUnit": "여러 가지 사각형", "l3": "직사각형·마름모·정사각형", "l4": "특수 사각형의 대각선 성질"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "평행사변형의 각 조건으로 직사각형·마름모 판정 설명"}, "crossConceptKeys": ["CC_ALTERNATE_INTERIOR_ANGLES", "CC_RECTANGLE_PROPERTIES", "CC_RHOMBUS_PROPERTIES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "엇각으로 △ODC의 두 각을 표현한 뒤 대각선의 길이 일치와 수직 조건을 각각 논증해야 한다.", "level": "중", "item4slot": {"given": ["평행사변형", "각"], "goal": ["직사각형", "마름모"], "method": ["엇각", "대각선"], "condition": ["대각선"]}, "hold": ""}
```