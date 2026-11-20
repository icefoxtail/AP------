```json:exam
{"stem": "26_왕운중_1학기_기말_중2_유사", "sourceArchiveFile": "original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js", "examFolder": "1final", "grade": "중2", "curriculum": "2022", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-14"}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
식 $ax - 4y + 5 = -3x + by - 2$가 미지수가 $2$개인 일차방정식이 되기 위한 조건을 구하면? (단, $a, b$는 상수)
### 선지
① $a \ne -3,\ b = -4$ ② $a \ne -3,\ b \ne -4$ ③ $a = -3,\ b \ne -4$ ④ $a \ne 3,\ b \ne 4$ ⑤ $a \ne 3,\ b = 4$
### 정답
②
### 해설
$ax - 4y + 5 = -3x + by - 2$의 모든 항을 좌변으로 이항하여 정리하면
$(a + 3)x - (b + 4)y + 7 = 0$
미지수가 $2$개인 일차방정식이 되려면 $x$와 $y$의 계수가 모두 $0$이 아니어야 하므로
$a + 3 \ne 0,\ b + 4 \ne 0$
$\therefore a \ne -3,\ b \ne -4$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-TWO_VAR_LINEAR_EQ_CONDITION", "primaryMethod": "모든 항을 좌변으로 이항해 (a+3)x - (b+4)y + 7 = 0으로 정리한 뒤 두 계수가 모두 0이 아닌 조건을 구한다.", "decisiveStep": "a + 3 != 0, b + 4 != 0에서 a != -3, b != -4를 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수가 2개인 일차방정식이 될 조건"}, "crossConceptKeys": ["CC_LINEAR_EQUATIONS_TWO_VARIABLES"], "conditionKeys": ["COND_NONZERO"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이항 후 x와 y의 계수가 0이 아님을 확인하는 1단계 개념 문항이다.", "level": "하", "item4slot": {"given": ["일차방정식", "상수"], "goal": ["조건"], "method": ["이항"], "condition": ["계수"]}, "hold": ""}
```


## Q02
- 형식: 객관식
- 배점: 3
### 발문
일차방정식 $x + 2y = 11$을 만족시키는 자연수 $x, y$에 대하여 $x - y$의 값이 될 수 없는 것을 고르면?
### 선지
① $8$ ② $5$ ③ $2$ ④ $-1$ ⑤ $-3$
### 정답
⑤
### 해설
$x, y$가 자연수이므로 $y$에 $1$부터 차례로 대입하면
$y = 1$일 때 $x = 9 \implies x - y = 8$
$y = 2$일 때 $x = 7 \implies x - y = 5$
$y = 3$일 때 $x = 5 \implies x - y = 2$
$y = 4$일 때 $x = 3 \implies x - y = -1$
$y = 5$일 때 $x = 1 \implies x - y = -4$
따라서 $x - y$의 값이 될 수 없는 것은 ⑤ $-3$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-LINEAR_EQ_NATURAL_PAIR_DIFF", "primaryMethod": "y = 1, 2, 3, 4, 5를 대입해 자연수 해 (x, y)를 모두 구하고 각각의 x - y 값을 계산한다.", "decisiveStep": "가능한 x - y 값이 8, 5, 2, -1, -4이므로 -3이 불가능함을 확인한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수 2개인 일차방정식의 자연수 해 차 판별"}, "crossConceptKeys": ["CC_LINEAR_EQUATIONS_TWO_VARIABLES"], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y = 1~5를 대입해 모든 자연수 해를 나열하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차방정식", "자연수"], "goal": ["차"], "method": ["대입"], "condition": ["자연수"]}, "hold": ""}
```


## Q03
- 형식: 객관식
- 배점: 3
### 발문
일차방정식 $4x - 3(ay - 2) = 2$의 한 해가 $(2, -1)$일 때, 상수 $a$의 값을 구하면?
### 선지
① $-4$ ② $-2$ ③ $2$ ④ $4$ ⑤ $8$
### 정답
①
### 해설
$x = 2,\ y = -1$을 $4x - 3(ay - 2) = 2$에 대입하면
$4 \times 2 - 3(-a - 2) = 2$
$8 + 3a + 6 = 2$
$3a = -12 \implies a = -4$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-SUBSTITUTE_SOLUTION_FOR_PARAM", "primaryMethod": "주어진 해 (2, -1)을 일차방정식에 대입하여 a에 대한 일차방정식을 푼다.", "decisiveStep": "8 + 3a + 6 = 2에서 a = -4를 구한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주어진 해를 대입해 상수 구하기"}, "crossConceptKeys": ["CC_SUBSTITUTION_IN_EQUATIONS", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "해의 좌표를 한 번 대입하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차방정식", "해"], "goal": ["상수"], "method": ["대입"], "condition": ["해"]}, "hold": ""}
```


## Q04
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} 3x + y = 7 \\ 2x - y = 3 \end{cases}$의 해가 $x = m,\ y = n$일 때, 연립방정식 $\begin{cases} mx + ny = 7 \\ nx - my = 1 \end{cases}$의 해를 구하면?
### 선지
① $x=1,\ y=3$ ② $x=2,\ y=1$ ③ $x=3,\ y=1$ ④ $x=3,\ y=-1$ ⑤ $x=-3,\ y=1$
### 정답
③
### 해설
$\begin{cases} 3x + y = 7 \\ 2x - y = 3 \end{cases}$에서 두 식을 더하면 $5x = 10 \implies x = 2$
$y = 7 - 6 = 1$이므로 $m = 2,\ n = 1$이다.
이를 두 번째 연립방정식에 대입하면 $\begin{cases} 2x + y = 7 \\ x - 2y = 1 \end{cases}$
첫째 식에 $2$를 곱하여 둘째 식과 더하면 $5x = 15 \implies x = 3$
$y = 7 - 6 = 1$
따라서 해는 $x = 3,\ y = 1$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-CHAINED_SIMULTANEOUS_SYSTEMS", "primaryMethod": "첫째 연립방정식을 풀어 m = 2, n = 1을 구한 뒤 둘째 연립방정식에 대입해 다시 가감법으로 해를 구한다.", "decisiveStep": "m = 2, n = 1을 대입한 연립방정식 2x + y = 7, x - 2y = 1을 풀어 x = 3, y = 1을 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "가감법"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_SYSTEM_OF_EQUATIONS_ADDITION_SUBTRACTION_METHOD", "templateKey": null, "why": "연립방정식 해를 계수로 하는 연립방정식 풀이"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 번의 연립방정식 풀이를 순차적으로 연결해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식"], "goal": ["해"], "method": ["가감법", "대입"], "condition": ["해"]}, "hold": ""}
```


## Q05
- 형식: 객관식
- 배점: 5
### 발문
방정식 $0.\dot{3}x + 1.\dot{6}y = \frac{1}{6}x + 2y = 7$을 만족시키는 $x, y$에 대하여 $xy$의 값을 구하면?
### 선지
① $-18$ ② $-9$ ③ $9$ ④ $18$ ⑤ $21$
### 정답
④
### 해설
$0.\dot{3} = \frac{3}{9} = \frac{1}{3}$, $1.\dot{6} = \frac{16 - 1}{9} = \frac{15}{9} = \frac{5}{3}$이므로
$\begin{cases} \frac{1}{3}x + \frac{5}{3}y = 7 \\ \frac{1}{6}x + 2y = 7 \end{cases}$
첫째 식에 $3$, 둘째 식에 $6$을 곱하면
$\begin{cases} x + 5y = 21 \\ x + 12y = 42 \end{cases}$
둘째 식에서 첫째 식을 빼면 $7y = 21 \implies y = 3$
$x = 21 - 15 = 6$
$\therefore xy = 6 \times 3 = 18$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-REPEATING_DECIMAL_FRACTION_SYSTEM", "primaryMethod": "순환소수 0.3...과 1.6...을 각각 분수 1/3, 5/3으로 바꾼 뒤 분모를 없애 연립방정식을 푼다.", "decisiveStep": "x + 5y = 21과 x + 12y = 42를 연립하여 x = 6, y = 3을 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "복잡한 꼴의 연립방정식", "l4": "분수·소수가 있는 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_SYSTEM_OF_EQUATIONS_DECIMAL_COEFFICIENTS", "templateKey": null, "why": "순환소수와 분수 계수가 섞인 A=B=C 꼴 연립방정식"}, "crossConceptKeys": ["CC_FRACTION_COEFFICIENTS", "CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "순환소수의 분수 변환과 A=B=C 꼴 연립방정식 풀이를 결합해야 한다.", "level": "중", "item4slot": {"given": ["방정식", "순환소수", "분수"], "goal": ["곱"], "method": ["연립방정식", "가감법"], "condition": ["해"]}, "hold": ""}
```


## Q06
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} 3x - 2y = -13 \\ y = x + 5 \end{cases}$의 해를 구하면?
### 선지
① $x=-3,\ y=2$ ② $x=-2,\ y=3$ ③ $x=2,\ y=7$ ④ $x=3,\ y=8$ ⑤ $x=-4,\ y=1$
### 정답
①
### 해설
$y = x + 5$를 $3x - 2y = -13$에 대입하면
$3x - 2(x + 5) = -13$
$3x - 2x - 10 = -13 \implies x = -3$
$y = -3 + 5 = 2$
따라서 해는 $x = -3,\ y = 2$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-SUBSTITUTION_METHOD_BASIC", "primaryMethod": "y = x + 5를 첫째 식에 대입하여 x = -3을 구한 뒤 y = 2를 얻는다.", "decisiveStep": "3x - 2(x + 5) = -13에서 x = -3을 구한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "대입법"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "대입법 기본 연립방정식 풀이"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "한 문자로 정리된 식을 바로 대입해 푸는 1단계 대입법 문항이다.", "level": "하", "item4slot": {"given": ["연립방정식"], "goal": ["해"], "method": ["대입법"], "condition": ["해"]}, "hold": ""}
```


## Q07
- 형식: 객관식
- 배점: 5
### 발문
연립방정식 $\begin{cases} ax + by + c = 0 \\ a'x + b'y + c' = 0 \end{cases}$ ($a, b, c, a', b', c'$는 상수)에 대한 설명으로 옳은 것은?
### 선지
① $a \ne a',\ b \ne b'$이면 해가 없다. ② $a = a',\ b = b',\ c = c'$일 때, 해가 없다. ③ $a = a',\ b = b',\ c \ne c'$일 때, 해가 무수히 많다. ④ $a \ne 0,\ b = 0$이고 $a' = 0,\ b' \ne 0$이면 해가 하나뿐이다. ⑤ $a = 1,\ b = 1,\ c = 2$이고 $a' = 1,\ b' = 2,\ c' = 4$일 때, 해는 $x = 0,\ y = 2$이다.
### 정답
④
### 해설
① 두 식의 계수 비 $\frac{a}{a'}$와 $\frac{b}{b'}$가 다를 때 해가 하나뿐이며, 단순히 $a \ne a', b \ne b'$라도 비가 같으면 해가 무수히 많거나 없을 수 있다. (거짓)
② 두 식이 완전히 같으므로 해가 무수히 많다. (거짓)
③ $x, y$의 계수가 같고 상수항만 다르므로 해가 없다. (거짓)
④ $ax + c = 0$에서 $x = -\frac{c}{a}$, $b'y + c' = 0$에서 $y = -\frac{c'}{b'}$로 해가 오직 하나뿐이다. (참)
⑤ $x + y + 2 = 0$에 $x = 0, y = 2$를 대입하면 $4 \ne 0$이므로 해가 아니다. (거짓)
따라서 옳은 것은 ④이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "7", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-SOLUTION_EXISTENCE_CONDITIONS", "primaryMethod": "일반형 연립일차방정식의 계수 조건에 따른 해의 개수(유일·무수히 많음·없음)를 보기별로 판별한다.", "decisiveStep": "a != 0, b = 0과 a' = 0, b' != 0이면 두 식이 각각 x = -c/a, y = -c'/b'가 되어 해가 유일함을 확인한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해가 특수한 연립방정식", "l4": "계수 조건으로 해의 상태 판단"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "연립방정식 해의 존재 조건 참·거짓 판별"}, "crossConceptKeys": ["CC_COEFFICIENT_RATIOS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자로 주어진 연립방정식 계수 조건의 반례와 성립 조건을 정확히 판별해야 한다.", "level": "중", "item4slot": {"given": ["연립방정식", "상수"], "goal": ["조건"], "method": ["비례식"], "condition": ["해"]}, "hold": ""}
```


## Q08
- 형식: 객관식
- 배점: 5
### 발문
모양과 크기가 같은 직사각형 모양의 타일 $11$장을 겹치지 않게 빈틈없이 이어 붙여(위쪽에 가로로 긴 방향으로 $5$장, 아래쪽에 세로로 긴 방향으로 $6$장을 나란히 붙여) 둘레의 길이가 $164\text{ cm}$인 큰 직사각형을 만들었다. 이때 타일 한 장의 넓이를 구하면?
### 선지
① $40\text{ cm}^{2}$ ② $60\text{ cm}^{2}$ ③ $80\text{ cm}^{2}$ ④ $100\text{ cm}^{2}$ ⑤ $120\text{ cm}^{2}$
### 정답
⑤
### 해설
타일 한 장의 짧은 변의 길이를 $x\text{ cm}$, 긴 변의 길이를 $y\text{ cm}$라 하자.
위쪽 가로 길이 $5y$와 아래쪽 가로 길이 $6x$가 같으므로 $6x = 5y \quad \cdots\cdots \text{㉠}$
큰 직사각형의 가로 길이는 $6x\text{ cm}$, 세로 길이는 $(x + y)\text{ cm}$이므로 둘레의 길이는
$2(6x + x + y) = 164 \implies 7x + y = 82 \quad \cdots\cdots \text{㉡}$
㉡에서 $y = 82 - 7x$를 ㉠에 대입하면
$6x = 5(82 - 7x) \implies 6x = 410 - 35x \implies 41x = 410 \implies x = 10$
$y = 82 - 70 = 12$
따라서 타일 한 장의 넓이는 $10 \times 12 = 120\text{ cm}^{2}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-WORD_TILE_RECTANGLE_AREA", "primaryMethod": "타일의 짧은 변 x와 긴 변 y에 대해 가로 일치 조건 6x = 5y와 둘레 조건 2(6x + x + y) = 164를 연립해 넓이를 구한다.", "decisiveStep": "6x = 5y와 7x + y = 82를 연립하여 x = 10, y = 12를 구해 넓이 120을 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "도형 활용", "l4": "도형 조건을 이용한 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "타일 배치 도형 조건 연립방정식 활용"}, "crossConceptKeys": ["CC_RECTANGLE_AREA", "CC_PERIMETER"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "타일 배치로부터 가로 일치 식과 둘레 식 두 개를 세워 연립하고 넓이를 계산해야 한다.", "level": "중", "item4slot": {"given": ["직사각형", "둘레"], "goal": ["넓이"], "method": ["연립방정식", "대입법"], "condition": ["길이"]}, "hold": ""}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
다음 중 $y$가 $x$의 함수가 아닌 것은?
### 선지
① 자연수 $x$보다 작은 짝수의 개수 $y$ ② 자연수 $x$를 $4$로 나눈 나머지 $y$ ③ 한 변의 길이가 $x\text{ cm}$인 정삼각형의 둘레의 길이 $y\text{ cm}$ ④ 한 자루에 $800$원인 연필 $x$자루의 가격 $y$원 ⑤ 자연수 $x$의 약수 $y$
### 정답
⑤
### 해설
①~④는 $x$의 값에 따라 $y$의 값이 오직 하나씩 정해지므로 함수이다.
⑤ 예를 들어 $x = 6$일 때 약수 $y$는 $1, 2, 3, 6$으로 여러 개이므로 함수가 아니다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "9", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-NON_FUNCTION_IDENTIFICATION", "primaryMethod": "다섯 문장 중 x 하나의 값에 y 값이 여러 개 대응하는 경우를 찾아 함수가 아닌 보기를 고른다.", "decisiveStep": "자연수 x의 약수 y는 값이 여러 개 대응하므로 함수가 아님을 판별한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION", "templateKey": null, "why": "함수가 아닌 관계 고르기"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수의 정의(유일 대응)를 일상·수학 문장에서 판별하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["자연수"], "goal": ["함수"], "method": ["대응"], "condition": ["함수"]}, "hold": ""}
```


## Q10
- 형식: 객관식
- 배점: 3
### 발문
함수 $f(x) = 3x - a$에서 $f(2) = 1$, $f(b) = 7$일 때, $ab$의 값을 구하면? (단, $a$는 상수)
### 선지
① $-20$ ② $-12$ ③ $12$ ④ $20$ ⑤ $25$
### 정답
④
### 해설
$f(2) = 3 \times 2 - a = 1 \implies 6 - a = 1 \implies a = 5$
따라서 $f(x) = 3x - 5$이고, $f(b) = 3b - 5 = 7 \implies 3b = 12 \implies b = 4$
$\therefore ab = 5 \times 4 = 20$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-FUNCTION_VALUE_TWO_STEP", "primaryMethod": "f(2) = 1로 a = 5를 먼저 구한 뒤 f(b) = 7에서 b = 4를 구해 곱 ab를 계산한다.", "decisiveStep": "a = 5를 확정한 후 3b - 5 = 7에서 b = 4를 얻어 ab = 20을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_VALUE", "templateKey": null, "why": "두 함숫값 조건을 이용한 미지수 곱"}, "crossConceptKeys": ["CC_FUNCTION_VALUE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함숫값을 두 번 차례대로 대입해 상수를 구하는 기본 문항이다.", "level": "하", "item4slot": {"given": ["함수", "함숫값"], "goal": ["곱"], "method": ["대입"], "condition": ["함숫값"]}, "hold": ""}
```


## Q11
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y = -3x + a$의 그래프를 $y$축의 방향으로 $-4$만큼 평행이동한 그래프의 $x$절편이 $-2$일 때, 상수 $a$의 값을 구하면?
### 선지
① $-6$ ② $-2$ ③ $2$ ④ $4$ ⑤ $6$
### 정답
②
### 해설
$y = -3x + a$를 $y$축의 방향으로 $-4$만큼 평행이동하면 $y = -3x + a - 4$
$x$절편이 $-2$이므로 점 $(-2, 0)$을 지난다.
$0 = -3 \times (-2) + a - 4 \implies 0 = 6 + a - 4 \implies a = -2$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-TRANSLATION_X_INTERCEPT", "primaryMethod": "y축 방향으로 -4만큼 평행이동한 식 y = -3x + a - 4에 x절편 점 (-2, 0)을 대입해 a를 구한다.", "decisiveStep": "0 = 6 + a - 4에서 a = -2를 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION", "templateKey": null, "why": "평행이동 후 x절편 조건으로 상수 구하기"}, "crossConceptKeys": ["CC_PARALLEL_TRANSLATION", "CC_X_INTERCEPT"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 식을 쓰고 x절편 (-2, 0)을 대입하면 바로 풀리는 문항이다.", "level": "하", "item4slot": {"given": ["일차함수", "x절편"], "goal": ["상수"], "method": ["평행이동", "대입"], "condition": ["x절편"]}, "hold": ""}
```


## Q12
- 형식: 객관식
- 배점: 4
### 발문
다음 보기의 일차함수들에 대한 설명으로 옳은 것은?


ㄱ. $y = -3x + 2$
ㄴ. $y = 2 - 4x$
ㄷ. $y = \frac{1}{3}x - 6$
ㄹ. $y = -2x$
ㅁ. $y = -3x - 12$
### 선지
① 일차함수의 그래프가 오른쪽 아래로 향하는 것은 $2$개다. ② $x$절편과 $y$절편이 같은 일차함수는 $0$개다. ③ $x$절편이 음수인 일차함수는 $3$개다. ④ 서로 평행한 두 그래프는 $2$쌍이다. ⑤ $x$의 값이 증가할 때 $y$의 값이 증가하는 그래프는 $1$개다.
### 정답
⑤
### 해설
① 기울기가 음수인 것은 ㄱ, ㄴ, ㄹ, ㅁ의 $4$개다. (거짓)
② ㄹ($y = -2x$)은 $x$절편과 $y$절편이 모두 $0$으로 같다. (거짓)
③ 각 식의 $x$절편은 ㄱ: $\frac{2}{3}$, ㄴ: $\frac{1}{2}$, ㄷ: $18$, ㄹ: $0$, ㅁ: $-4$로 음수인 것은 ㅁ의 $1$개다. (거짓)
④ 기울기가 같고 $y$절편이 다른 평행한 쌍은 ㄱ과 ㅁ의 $1$쌍이다. (거짓)
⑤ 기울기가 양수인 그래프는 ㄷ($\frac{1}{3}$)의 $1$개다. (참)
따라서 옳은 것은 ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-GRAPH_PROPERTIES_MULTIPLE_CHECK", "primaryMethod": "다섯 일차함수의 기울기, x절편, y절편을 각각 구한 뒤 다섯 보기의 진위를 판별한다.", "decisiveStep": "기울기가 양수인 식이 ㄷ 하나뿐임을 확인해 ⑤를 고른다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "여러 일차함수 그래프 성질 종합 판별"}, "crossConceptKeys": ["CC_SLOPE_AND_INTERCEPT", "CC_INTERCEPTS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "5개 일차함수의 기울기, x절편, y절편, 평행 여부를 모두 점검해야 한다.", "level": "중", "item4slot": {"given": ["일차함수"], "goal": ["개수"], "method": ["기울기", "x절편", "y절편"], "condition": ["평행"]}, "hold": ""}
```


## Q13
- 형식: 객관식
- 배점: 3
### 발문
다음 일차함수의 그래프 중 $x$의 값이 $3$만큼 증가할 때 $y$의 값이 $15$만큼 감소하는 것은?
### 선지
① $y = -5x + 1$ ② $y = 5x - 3$ ③ $y = -15x + 2$ ④ $y = -\frac{1}{5}x - 4$ ⑤ $y = \frac{1}{5}x + 3$
### 정답
①
### 해설
기울기는 $\frac{-15}{3} = -5$이므로 구하는 일차함수는 ① $y = -5x + 1$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-SLOPE_FROM_CHANGE_RATE", "primaryMethod": "x의 증가량 3에 대한 y의 증가량 -15의 비 -15/3 = -5를 기울기로 갖는 식을 찾는다.", "decisiveStep": "기울기 -5인 식 y = -5x + 1을 선택한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "증가량 비를 이용한 기울기 판별"}, "crossConceptKeys": ["CC_RATE_OF_CHANGE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기 정의를 한 번 계산하면 바로 답을 고르는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차함수"], "goal": ["일차함수"], "method": ["기울기"], "condition": ["기울기"]}, "hold": ""}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
두 점 $(-2, 1)$, $(3, 11)$을 지나는 직선의 그래프의 기울기가 $a$이고, 점 $(b, 7)$을 지날 때, $a + b$의 값을 구하면?
### 선지
① $5$ ② $4$ ③ $3$ ④ $2$ ⑤ $1$
### 정답
③
### 해설
기울기 $a = \frac{11 - 1}{3 - (-2)} = \frac{10}{5} = 2$
$y = 2x + c$에 $(-2, 1)$을 대입하면 $1 = -4 + c \implies c = 5$
직선의 방정식은 $y = 2x + 5$이므로 점 $(b, 7)$을 대입하면
$7 = 2b + 5 \implies 2b = 2 \implies b = 1$
$\therefore a + b = 2 + 1 = 3$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-TWO_POINTS_LINE_MISSING_COORD", "primaryMethod": "두 점 (-2, 1), (3, 11)로 기울기 a = 2와 식 y = 2x + 5를 구한 뒤 (b, 7)을 대입해 b = 1을 구한다.", "decisiveStep": "y = 2x + 5에 y = 7을 대입해 b = 1을 얻어 합 3을 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 점으로 직선의 식을 구해 미지 좌표 찾기"}, "crossConceptKeys": ["CC_SLOPE_FORMULA", "CC_POINT_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 점으로 직선의 식을 세운 뒤 세 번째 점의 x좌표를 역산해야 한다.", "level": "중", "item4slot": {"given": ["점", "직선"], "goal": ["합"], "method": ["기울기", "대입"], "condition": ["기울기"]}, "hold": ""}
```


## Q15
- 형식: 객관식
- 배점: 5
### 발문
일차함수 $y = bx - a$의 그래프가 제$1, 2, 4$사분면을 지날 때, 일차함수 $y = abx + (a + b)$의 그래프가 지나지 않는 사분면을 구하면? (단, $a, b$는 상수)
### 선지
① 제$1$사분면 ② 제$2$사분면 ③ 제$3$사분면 ④ 제$4$사분면 ⑤ 제$1, 2$사분면
### 정답
②
### 해설
$y = bx - a$의 그래프가 제$1, 2, 4$사분면을 지나므로 오른쪽 아래로 향하고 $y$절편이 양수이다.
즉, 기울기 $b < 0$이고 $y$절편 $-a > 0 \implies a < 0$
따라서 $y = abx + (a + b)$에서
기울기 $ab > 0$, $y$절편 $a + b < 0$
기울기가 양수이고 $y$절편이 음수인 직선은 제$1, 3, 4$사분면을 지나고 제$2$사분면을 지나지 않는다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "15", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-QUADRANT_SIGN_PROPAGATION", "primaryMethod": "y = bx - a가 지나는 사분면에서 b < 0, a < 0의 부호를 결정한 뒤 ab > 0과 a + b < 0으로 새 직선의 사분면을 판별한다.", "decisiveStep": "ab > 0(양의 기울기), a + b < 0(음의 y절편)에서 제2사분면을 지나지 않음을 결정한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_QUADRANT_CONDITION", "templateKey": null, "why": "부호 결정 후 지나지 않는 사분면 판별"}, "crossConceptKeys": ["CC_QUADRANTS", "CC_SLOPE_SIGN"], "conditionKeys": ["COND_NEGATIVE"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사분면 조건으로 a, b 부호를 추론하고 이를 다시 곱과 합의 부호로 변환해 그래프를 판별해야 한다.", "level": "중", "item4slot": {"given": ["일차함수", "사분면"], "goal": ["사분면"], "method": ["기울기", "y절편"], "condition": ["음수"]}, "hold": ""}
```


## Q16
- 형식: 객관식
- 배점: 4
### 발문
어떤 스마트폰 배터리가 $5$분마다 $4\%$씩 감소한다고 하자. 현재 이 스마트폰의 배터리가 $100\%$라고 할 때, 배터리가 완전히 방전되는 것은 몇 시간 몇 분 후인가? (단, 다른 상황은 생각하지 않는다.)
### 선지
① $1$시간 $45$분 ② $1$시간 $55$분 ③ $2$시간 $5$분 ④ $2$시간 $15$분 ⑤ $2$시간 $25$분
### 정답
③
### 해설
$1$분마다 $\frac{4}{5}\%$씩 감소하므로 $x$분 후의 배터리 잔량을 $y\%$라 하면
$y = 100 - \frac{4}{5}x$
완전히 방전될 때는 $y = 0$이므로 $100 - \frac{4}{5}x = 0 \implies x = 125$(분)
$125$분은 $2$시간 $5$분이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-WORD_BATTERY_DEPLETION", "primaryMethod": "분당 감소율 4/5%로 일차함수 y = 100 - (4/5)x를 세운 뒤 y = 0이 되는 x = 125분을 시·분으로 환산한다.", "decisiveStep": "100 - (4/5)x = 0에서 x = 125분 = 2시간 5분을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "일정한 비율로 감소하는 양의 소진 시간 구하기"}, "crossConceptKeys": ["CC_APPLIED_WORD_PROBLEMS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일정한 감소율로 일차함수 식을 세워 절편을 구하고 시간 단위로 바꾸는 기본 활용 문항이다.", "level": "하", "item4slot": {"given": ["일차함수", "비율"], "goal": ["x절편"], "method": ["대입"], "condition": ["비율"]}, "hold": ""}
```


## Q17
- 형식: 객관식
- 배점: 4
### 발문
다음 중 일차방정식 $-4x + 3y + 2 = 0$의 그래프에 대한 설명으로 옳은 것을 모두 고르면? (정답 $2$개)
### 선지
① $x$절편은 $-\frac{1}{2}$, $y$절편은 $\frac{2}{3}$이다. ② $x$의 값이 증가할 때 $y$의 값은 증가한다. ③ $-8x + 6y + 5 = 0$과 한 점에서 만난다. ④ 제$2$사분면을 지나지 않는다. ⑤ 점 $(2, 3)$을 지난다.
### 정답
②, ④
### 해설
$-4x + 3y + 2 = 0$을 정리하면 $y = \frac{4}{3}x - \frac{2}{3}$
① $x$절편은 $\frac{1}{2}$, $y$절편은 $-\frac{2}{3}$이다. (거짓)
② 기울기가 $\frac{4}{3} > 0$이므로 $x$의 값이 증가할 때 $y$의 값도 증가한다. (참)
③ $-8x + 6y + 5 = 0 \implies y = \frac{4}{3}x - \frac{5}{6}$로 기울기가 같고 $y$절편이 달라 평행하므로 만나지 않는다. (거짓)
④ 기울기가 양수이고 $y$절편이 음수이므로 제$1, 3, 4$사분면을 지나며 제$2$사분면을 지나지 않는다. (참)
⑤ $x = 2, y = 3$을 대입하면 $-8 + 9 + 2 = 3 \ne 0$이므로 지나지 않는다. (거짓)
따라서 옳은 것은 ②, ④이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-LINEAR_EQ_GRAPH_PROPERTIES", "primaryMethod": "일차방정식을 y = (4/3)x - 2/3 꼴로 바꾼 뒤 절편, 증가성, 평행, 사분면, 지나는 점을 모두 점검한다.", "decisiveStep": "기울기 4/3 > 0과 y절편 -2/3 < 0으로부터 ②(증가)와 ④(제2사분면 미통과)를 고른다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "일차방정식의 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES", "templateKey": null, "why": "일차방정식 그래프 성질 복수 정답 판별"}, "crossConceptKeys": ["CC_SLOPE_AND_INTERCEPT", "CC_QUADRANTS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차방정식을 표준형으로 고친 뒤 5가지 그래프 성질을 각각 검증해야 한다.", "level": "중", "item4slot": {"given": ["일차방정식"], "goal": ["성질"], "method": ["기울기", "x절편", "y절편"], "condition": ["사분면"]}, "hold": ""}
```


## Q18
- 형식: 객관식
- 배점: 5
### 발문
세 직선 $y = -2x + 11$, $ax + y + b = 0$, $y = 3$으로 둘러싸인 삼각형 $ABC$에 대하여, $y = -2x + 11$과 $ax + y + b = 0$의 교점 $A$의 $x$좌표를 $k$($k > 0$)라고 하자. 직선 $ax + y + b = 0$과 직선 $y = 3$의 교점 $B$가 $y$축 위에 있고, 직선 $y = -2x + 11$과 직선 $y = 3$의 교점을 $C$라고 할 때, 점 $A$의 $y$좌표가 $3$보다 크고 $\triangle ABC = 8$이다. 이때 $a + b + k$의 값을 구하면? (단, $a, b$는 상수)
### 선지
① $-3$ ② $-1$ ③ $1$ ④ $3$ ⑤ $5$
### 정답
①
### 해설
점 $B$는 $y = 3$과 $y$축 위의 교점이므로 $B(0, 3)$이다.
점 $C$는 $y = -2x + 11$과 $y = 3$의 교점이므로 $3 = -2x + 11 \implies x = 4$, 즉 $C(4, 3)$이다.
밑변 $\overline{BC} = 4 - 0 = 4$이고, 점 $A$의 $y$좌표를 $y_{A}$($y_{A} > 3$)라 하면
$\triangle ABC = \frac{1}{2} \times 4 \times (y_{A} - 3) = 8 \implies y_{A} - 3 = 4 \implies y_{A} = 7$
점 $A(k, 7)$이 $y = -2x + 11$ 위의 점이므로 $7 = -2k + 11 \implies k = 2$, 즉 $A(2, 7)$이다.
직선 $ax + y + b = 0$이 두 점 $B(0, 3), A(2, 7)$을 지나므로
$B(0, 3)$ 대입: $3 + b = 0 \implies b = -3$
$A(2, 7)$ 대입: $2a + 7 - 3 = 0 \implies a = -2$
$\therefore a + b + k = -2 + (-3) + 2 = -3$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-TRIANGLE_AREA_REVERSE_LINE", "primaryMethod": "B(0, 3)과 C(4, 3)에서 밑변 4를 구하고 넓이 8로부터 A의 좌표 (2, 7)을 역산한 뒤 두 점 A, B로 a, b를 구한다.", "decisiveStep": "넓이 조건에서 y_A = 7, k = 2를 확정하고 B(0, 3), A(2, 7) 대입으로 a = -2, b = -3을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA", "templateKey": null, "why": "삼각형 넓이 조건으로부터 직선 계수 역산"}, "crossConceptKeys": ["CC_POLYGON_AREA", "CC_INTERSECTION_OF_TWO_GRAPHS", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "교점 B, C로 밑변을 구한 뒤 넓이로 꼭짓점 A를 역산하고 다시 직선 계수 a, b를 구하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["직선", "삼각형", "넓이"], "goal": ["합"], "method": ["교점", "대입"], "condition": ["양수"]}, "hold": ""}
```


## Q19
- 형식: 객관식
- 배점: 4
### 발문
두 점 $(3a,\ a + 2)$, $(-a + 12,\ 7)$을 지나는 직선이 $y$축에 평행할 때, $a$의 값은?
### 선지
① $2$ ② $3$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
②
### 해설
$y$축에 평행한 직선은 $x$좌표가 모두 같으므로
$3a = -a + 12$
$4a = 12 \implies a = 3$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-VERTICAL_LINE_SAME_X", "primaryMethod": "y축에 평행한 직선 위의 두 점은 x좌표가 같다는 성질로 3a = -a + 12를 푼다.", "decisiveStep": "3a = -a + 12에서 a = 3을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "x축·y축에 평행한 직선"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS", "templateKey": null, "why": "y축에 평행한 직선 위 두 점의 x좌표 일치 조건"}, "crossConceptKeys": ["CC_EQUATIONS_PARALLEL_TO_AXES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y축 평행 조건(x좌표 같음)을 바로 등식으로 세우는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["점", "직선"], "goal": ["상수"], "method": ["등식"], "condition": ["평행"]}, "hold": ""}
```


## Q20
- 형식: 객관식
- 배점: 4
### 발문
일차방정식 $-x + 2y = 4$의 그래프는 $ax - 4y = -8$의 그래프와는 일치하고, $-3x + 6y = 3b$의 그래프와는 만나지 않는다고 할 때, $a + b$의 값이 될 수 없는 것은? (단, $a, b$는 상수)
### 선지
① $4$ ② $5$ ③ $6$ ④ $7$ ⑤ $8$
### 정답
③
### 해설
$-x + 2y = 4$의 양변에 $-2$를 곱하면 $2x - 4y = -8$이므로 $ax - 4y = -8$과 일치하려면 $a = 2$이다.
$-x + 2y = 4$의 양변에 $3$을 곱하면 $-3x + 6y = 12$이므로 $-3x + 6y = 3b$와 만나지 않으려면(평행) 상수항이 달라야 한다.
즉, $3b \ne 12 \implies b \ne 4$
따라서 $a + b \ne 2 + 4 = 6$이므로 될 수 없는 값은 ③ $6$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-COINCIDENT_AND_PARALLEL_FORBIDDEN_SUM", "primaryMethod": "일치 조건으로 a = 2를 확정하고, 평행(만나지 않음) 조건으로 b != 4를 구해 불가능한 a + b 값을 찾는다.", "decisiveStep": "a = 2, b != 4로부터 a + b != 6임을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "두 직선의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION", "templateKey": null, "why": "일치와 평행 조건을 동시에 만족하는 상수 합 제외값"}, "crossConceptKeys": ["CC_COEFFICIENT_RATIOS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일치 조건과 평행(불일치) 조건을 동시에 해석해 불가능한 합을 찾아야 한다.", "level": "중", "item4slot": {"given": ["일차방정식", "상수"], "goal": ["합"], "method": ["비례식"], "condition": ["평행"]}, "hold": ""}
```


## Q21
- 형식: 서답형
- 배점: 4
### 발문
연립방정식 $\begin{cases} x + 2y = -7 \\ 3x - 2y = 2k - 1 \end{cases}$를 만족시키는 $x$의 값이 $y$의 값보다 $4$만큼 작을 때, 상수 $k$의 값을 구하시오.
### 선지
없음
### 정답
$k = -6$
### 해설
$x$의 값이 $y$의 값보다 $4$만큼 작으므로 $x = y - 4$
이를 $x + 2y = -7$에 대입하면 $(y - 4) + 2y = -7 \implies 3y = -3 \implies y = -1$
$x = -1 - 4 = -5$
$x = -5, y = -1$을 $3x - 2y = 2k - 1$에 대입하면
$-15 + 2 = 2k - 1 \implies 2k = -12 \implies k = -6$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-RELATION_BETWEEN_VARS_PARAM", "primaryMethod": "x = y - 4를 첫째 식에 대입해 x = -5, y = -1을 구한 뒤 둘째 식에 대입해 k를 구한다.", "decisiveStep": "x = -5, y = -1을 3x - 2y = 2k - 1에 대입해 k = -6을 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 변수의 관계식이 주어진 연립방정식 상수 구하기"}, "crossConceptKeys": ["CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문장 조건 x = y - 4를 세워 해를 구하고 둘째 식의 상수 k를 구해야 한다.", "level": "중", "item4slot": {"given": ["연립방정식", "상수"], "goal": ["상수"], "method": ["대입법"], "condition": ["해"]}, "hold": ""}
```


## Q22
- 형식: 서답형
- 배점: 5
### 발문
지민이와 태호가 계단에서 가위바위보를 하여 이기면 $4$계단을 올라가고, 지면 $2$계단을 내려가는 게임을 하고 있다. 처음보다 지민이는 $12$계단, 태호는 $24$계단을 더 올라가 있을 때, 태호가 진 횟수를 구하시오. (단, 비기는 경우는 없다.)
### 선지
없음
### 정답
$8$회
### 해설
태호가 이긴 횟수를 $x$회, 진 횟수를 $y$회라 하면 비기는 경우가 없으므로 지민이는 $y$회 이기고 $x$회 진 것이다.
태호의 이동 계단: $4x - 2y = 24 \implies 2x - y = 12 \quad \cdots\cdots \text{㉠}$
지민의 이동 계단: $4y - 2x = 12 \implies -x + 2y = 6 \quad \cdots\cdots \text{㉡}$
$\text{㉠} + \text{㉡} \times 2$를 하면 $3y = 24 \implies y = 8$
따라서 태호가 진 횟수는 $8$회이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-WORD_ROCK_PAPER_SCISSORS_STAIRS", "primaryMethod": "태호의 승·패 횟수 x, y가 지민의 패·승 횟수와 같음을 이용해 두 계단 변화 식을 연립한다.", "decisiveStep": "2x - y = 12와 -x + 2y = 6을 연립하여 태호가 진 횟수 y = 8을 구한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "수와 개수", "l4": "두 수 관계"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_GAME", "templateKey": null, "why": "가위바위보 계단 게임 연립방정식 활용"}, "crossConceptKeys": ["CC_INVERSE_WIN_LOSS_RELATIONS", "CC_APPLIED_WORD_PROBLEMS"], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상대방의 승패가 뒤바뀐다는 점을 이용해 연립방정식을 세워 풀어야 한다.", "level": "중", "item4slot": {"given": ["자연수"], "goal": ["자연수"], "method": ["연립방정식", "가감법"], "condition": ["자연수"]}, "hold": ""}
```


## Q23
- 형식: 서답형
- 배점: 5
### 발문
민수와 수진이가 어떤 일차함수의 식을 보고 그래프를 그리는데 다음 보기와 같이 각각 잘못 그렸다. 처음 일차함수의 그래프가 점 $(5, k)$를 지난다고 할 때, 처음 일차함수의 식과 수 $k$의 값을 구하시오.


- 민수: 기울기를 잘못 보고 그렸더니 두 점 $(3, -1)$, $(1, 5)$를 지나는 그래프를 그렸어.
- 수진: $y$절편을 잘못 보고 그렸더니 $x$절편이 $5$, $y$절편이 $-2$인 그래프를 그렸어.
### 선지
없음
### 정답
$y = \frac{2}{5}x + 8,\ k = 10$
### 해설
민수는 기울기를 잘못 보고 $y$절편은 바르게 보았으므로 두 점 $(3, -1), (1, 5)$를 지나는 직선의 $y$절편을 구한다.
기울기: $\frac{5 - (-1)}{1 - 3} = \frac{6}{-2} = -3$
$y = -3x + b$에 $(1, 5)$를 대입하면 $5 = -3 + b \implies b = 8$ (바른 $y$절편은 $8$)
수진은 $y$절편을 잘못 보고 기울기는 바르게 보았으므로 두 점 $(5, 0), (0, -2)$를 지나는 직선의 기울기를 구한다.
기울기: $\frac{-2 - 0}{0 - 5} = \frac{2}{5}$ (바른 기울기는 $\frac{2}{5}$)
따라서 처음 일차함수의 식은 $y = \frac{2}{5}x + 8$이다.
점 $(5, k)$를 지나므로 $k = \frac{2}{5} \times 5 + 8 = 2 + 8 = 10$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-MISREAD_SLOPE_INTERCEPT_RECOVERY", "primaryMethod": "민수의 직선에서 바른 y절편 8을, 수진의 직선에서 바른 기울기 2/5를 각각 복원해 식을 세운 뒤 (5, k)를 대입한다.", "decisiveStep": "y = (2/5)x + 8을 복원하고 x = 5를 대입해 k = 10을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "잘못 보고 그린 두 그래프에서 바른 일차함수 복원"}, "crossConceptKeys": ["CC_ERROR_CORRECTION", "CC_SLOPE_AND_INTERCEPT"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 사람이 바르게 본 요소를 각각 구해 결합한 뒤 지나는 점의 좌표까지 계산해야 한다.", "level": "중", "item4slot": {"given": ["일차함수", "점"], "goal": ["일차함수", "상수"], "method": ["기울기", "y절편", "대입"], "condition": ["일차함수"]}, "hold": ""}
```


## Q24
- 형식: 서답형
- 배점: 6
### 발문
세 일차방정식 $-x + y - 3 = 0$, $2x + y + 6 = 0$, $ax - y + 4 = 0$의 그래프가 삼각형을 이루지 않도록 하는 수 $a$의 값을 모두 구하시오.
### 선지
없음
### 정답
$a = -2,\ 1,\ \frac{4}{3}$
### 해설
세 직선을 각각 $y$에 대하여 정리하면
$y = x + 3$, $\quad y = -2x - 6$, $\quad y = ax + 4$
세 직선이 삼각형을 이루지 않는 경우는 다음 두 가지이다.
(1) 직선 $y = ax + 4$가 다른 두 직선 중 하나와 평행할 때
$a = 1$ 또는 $a = -2$
(2) 직선 $y = ax + 4$가 두 직선 $y = x + 3$, $y = -2x - 6$의 교점을 지날 때
$x + 3 = -2x - 6 \implies 3x = -9 \implies x = -3,\ y = 0$
교점 $(-3, 0)$을 $ax - y + 4 = 0$에 대입하면 $-3a + 4 = 0 \implies a = \frac{4}{3}$
따라서 구하는 수 $a$의 값은 $-2,\ 1,\ \frac{4}{3}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-NO_TRIANGLE_THREE_LINES", "primaryMethod": "세 직선이 삼각형을 이루지 않는 조건인 평행한 경우(a = 1, -2)와 한 점에서 만나는 경우(교점 (-3, 0) 통과)로 나누어 구한다.", "decisiveStep": "평행 조건 두 개(a = 1, -2)와 두 직선 교점 (-3, 0) 대입 조건(a = 4/3)을 모두 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "두 직선의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "세 직선이 삼각형을 이루지 않을 조건"}, "crossConceptKeys": ["CC_INTERSECTION_OF_TWO_GRAPHS", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행한 2가지 경우와 세 직선이 한 점에서 만나는 1가지 경우를 모두 분류해 3개의 값을 구해야 한다.", "level": "상", "item4slot": {"given": ["일차방정식", "삼각형"], "goal": ["상수"], "method": ["연립방정식", "대입"], "condition": ["평행", "교점"]}, "hold": ""}
```