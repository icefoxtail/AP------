```json:exam
{"stem": "24_삼산중_1학기_기말_중2_유사", "sourceArchiveFile": "original/middle/m2/1final/24_삼산중_1학기_기말_중2_기출.js", "examFolder": "1final", "grade": "중2", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-15"}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
다음 중에서 해가 $x=2$, $y=-1$인 연립방정식을 찾으시오.
### 선지
① $\begin{cases}x-y=1\\x+y=3\end{cases}$ ② $\begin{cases}2x+y=3\\x-2y=4\end{cases}$ ③ $\begin{cases}3x-y=5\\x+3y=1\end{cases}$ ④ $\begin{cases}x+2y=2\\2x-y=3\end{cases}$ ⑤ $\begin{cases}y=2x-3\\3x+y=4\end{cases}$
### 정답
②
### 해설
$x=2$, $y=-1$을 각 연립방정식에 대입한다.
① $x-y = 2-(-1) = 3 \ne 1$
② $2x+y = 2(2)+(-1) = 3$, $x-2y = 2-2(-1) = 4$ (모두 성립)
③ $3x-y = 3(2)-(-1) = 7 \ne 5$
④ $x+2y = 2+2(-1) = 0 \ne 2$
⑤ $y = -1$, $2x-3 = 4-3 = 1$이므로 $-1 \ne 1$
따라서 해가 $x=2$, $y=-1$인 연립방정식은 ②이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-VERIFY_SOLUTION_BY_SUBSTITUTION", "primaryMethod": "주어진 해 x = 2, y = -1을 각 보기의 두 일차방정식에 대입하여 모두 참이 되는 ②를 찾는다.", "decisiveStep": "2x + y = 3과 x - 2y = 4에 (2, -1)을 대입해 두 등식이 동시에 성립함을 확인한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주어진 순서쌍을 연립방정식에 대입하여 해 판별"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS", "CC_SUBSTITUTION_IN_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 해 (2, -1)을 각 선택지의 두 식에 직접 대입해 참·거짓만 판별하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["연립방정식", "해"], "goal": ["연립방정식"], "method": ["대입"], "condition": ["해"]}, "hold": ""}
```


## Q02
- 형식: 객관식
- 배점: 3.5
### 발문
연립방정식 $\begin{cases}2x+3y=8\\4x+ay=2\end{cases}$의 해가 $x=1$, $y=b$일 때, $ab$의 값은? (단, $a$, $b$는 수)
### 선지
① $-6$ ② $-4$ ③ $-3$ ④ $-2$ ⑤ $2$
### 정답
④
### 해설
$x=1$, $y=b$를 첫째 식 $2x+3y=8$에 대입하면
$2(1)+3b=8$
$3b=6$
$b=2$
$x=1$, $y=2$를 둘째 식 $4x+ay=2$에 대입하면
$4(1)+2a=2$
$2a=-2$
$a=-1$
따라서 $ab = (-1)\times 2 = -2$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-FIND_COEFFICIENTS_FROM_SOLUTION", "primaryMethod": "x = 1, y = b를 2x + 3y = 8에 대입해 b = 2를 구한 뒤 4x + ay = 2에 대입해 a = -1을 구한다.", "decisiveStep": "첫째 식에서 b = 2를 먼저 확정한 다음 둘째 식에서 a = -1을 구해 곱한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "해의 일부와 미정계수를 순차 대입으로 구하는 문항"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "첫째 식에서 b를 구하고 그 결과를 둘째 식에 다시 대입해 a를 구하는 2단계 절차 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식", "해"], "goal": ["계수"], "method": ["대입"], "condition": ["해"]}, "hold": ""}
```


## Q03
- 형식: 객관식
- 배점: 3.5
### 발문
일차방정식 $3x+2y=19$를 만족시키는 자연수 $x$와 $y$의 순서쌍 $(x, y)$의 개수는?
### 선지
① 1개 ② 2개 ③ 3개 ④ 4개 ⑤ 5개
### 정답
③
### 해설
$3x+2y=19$에서 $2y=19-3x$이므로
$y=\dfrac{19-3x}{2}$
$x$, $y$가 자연수이므로 $19-3x > 0$이고 $19-3x$는 짝수여야 한다.
$x=1$일 때 $y=\dfrac{19-3}{2}=8$
$x=3$일 때 $y=\dfrac{19-9}{2}=5$
$x=5$일 때 $y=\dfrac{19-15}{2}=2$
$x\ge 7$이면 $19-3x < 0$이므로 자연수 $y$가 존재하지 않는다.
따라서 순서쌍 $(x, y)$는 $(1, 8)$, $(3, 5)$, $(5, 2)$의 $3$개이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-NATURAL_NUMBER_ORDERED_PAIRS", "primaryMethod": "3x + 2y = 19에서 x에 자연수 1부터 대입하여 y가 자연수가 되는 순서쌍을 모두 찾는다.", "decisiveStep": "19 - 3x가 양의 짝수가 되는 홀수 x = 1, 3, 5를 빠짐없이 나열한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "수와 개수", "l4": "두 수 관계"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수가 2개인 일차방정식의 자연수 해 개수"}, "crossConceptKeys": ["CC_LINEAR_EQUATIONS_TWO_VARIABLES"], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "자연수 조건과 홀짝성·상한 조건을 함께 고려해 순서쌍 개수를 세어야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차방정식"], "goal": ["순서쌍"], "method": ["대입"], "condition": ["자연수"]}, "hold": ""}
```


## Q04
- 형식: 객관식
- 배점: 4
### 발문
다음 중 $y$가 $x$의 함수가 아닌 것을 고르면?
### 선지
① 형이 동생보다 3살 많을 때 형의 나이 $x$살과 동생의 나이 $y$살 ② 가로의 길이가 $x$, 세로의 길이가 $y$일 때 직사각형의 넓이가 $24$ ③ 용돈 $3000$원으로 $x$원짜리 공책을 사고 남은 돈 $y$원 ④ 자연수 $x$의 약수 $y$ ⑤ $1$개에 $800$원인 연필 $x$자루의 값 $y$원
### 정답
④
### 해설
$x$의 값이 하나 정해질 때 $y$의 값이 오직 하나씩 대응하면 $y$는 $x$의 함수이다.
① $y = x - 3$ (함수)
② $y = \dfrac{24}{x}$ (함수)
③ $y = 3000 - x$ (함수)
④ 예를 들어 $x=4$이면 약수 $y$는 $1$, $2$, $4$로 여러 개 대응하므로 함수가 아니다.
⑤ $y = 800x$ (함수)
따라서 정답은 ④이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "4", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-FUNCTION_DEFINITION_CHECK", "primaryMethod": "각 대응 관계에서 x 하나의 값에 y의 값이 오직 하나만 정해지는지 반례로 판별한다.", "decisiveStep": "④에서 x = 4일 때 약수 y가 1, 2, 4로 복수 대응함을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION", "templateKey": null, "why": "일상 및 수 개념에서 함수 여부 판별"}, "crossConceptKeys": ["CC_CLASSIFICATION", "CC_COUNTEREXAMPLE_CONDITION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수의 정의(하나의 x에 하나의 y 대응)를 곧바로 적용해 반례를 찾는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["함수"], "goal": ["함수"], "method": ["조건"], "condition": ["자연수"]}, "hold": ""}
```


## Q05
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $f(x)=3x-4$에 대하여 $f(-2)=a$, $f(3)=b$일 때, $a+b$의 값은? (단, $a$, $b$는 수)
### 선지
① $-5$ ② $-3$ ③ $-1$ ④ $1$ ⑤ $5$
### 정답
①
### 해설
$a = f(-2) = 3(-2)-4 = -6-4 = -10$
$b = f(3) = 3(3)-4 = 9-4 = 5$
따라서 $a+b = -10+5 = -5$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-FUNCTION_VALUE_EVALUATION", "primaryMethod": "f(x) = 3x - 4에 x = -2와 x = 3을 각각 대입해 a, b를 구한 뒤 합한다.", "decisiveStep": "f(-2) = -10과 f(3) = 5를 정확히 계산해 더한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 함숫값을 구해 더하는 기본 계산"}, "crossConceptKeys": ["CC_FUNCTION_VALUE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함숫값의 정의에 따라 x = -2, 3을 대입해 바로 계산하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차함수"], "goal": ["함숫값"], "method": ["대입"], "condition": ["일차함수"]}, "hold": ""}
```


## Q06
- 형식: 객관식
- 배점: 3
### 발문
다음 중 $y$가 $x$에 대한 일차함수인 것을 고르면?
### 선지
① $2x-5$ ② $y=\dfrac{5}{x}$ ③ $y=2x^{2}-1$ ④ $y=7$ ⑤ $y=-4x+3$
### 정답
⑤
### 해설
$y = ax+b$ ($a \ne 0$, $a$, $b$는 상수) 꼴로 나타낼 수 있는 함수를 일차함수라 한다.
① $y=$ 꼴의 함수식이 아니다.
② 분모에 $x$가 있으므로 일차함수가 아니다.
③ $x^{2}$항이 있으므로 이차함수이다.
④ $x$항의 계수가 $0$이므로 일차함수가 아니다.
⑤ $y = -4x+3$은 $a=-4 \ne 0$인 일차함수이다.
따라서 정답은 ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-IDENTIFY_LINEAR_FUNCTION", "primaryMethod": "y = ax + b (a != 0) 꼴의 정의를 기준으로 각 식의 차수와 분모 위치를 확인한다.", "decisiveStep": "⑤ y = -4x + 3만이 x의 계수가 0이 아닌 일차식 형태임을 판별한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION", "templateKey": null, "why": "주어진 식들 중 일차함수 판별"}, "crossConceptKeys": ["CC_CLASSIFICATION", "CC_POLYNOMIAL_DEGREE"], "conditionKeys": ["COND_NONZERO"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차함수의 정의 y = ax + b (a != 0)를 바로 대조해 고르는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["함수"], "goal": ["일차함수"], "method": ["조건"], "condition": ["일차함수"]}, "hold": ""}
```


## Q07
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y=-3x$의 그래프를 $y$축의 방향으로 $k$만큼 평행이동한 그래프가 점 $(3, -4)$를 지날 때, 수 $k$의 값은?
### 선지
① $-5$ ② $-1$ ③ $1$ ④ $5$ ⑤ $9$
### 정답
④
### 해설
$y=-3x$의 그래프를 $y$축의 방향으로 $k$만큼 평행이동한 그래프의 식은
$y = -3x + k$
이 그래프가 점 $(3, -4)$를 지나므로
$-4 = -3(3) + k$
$-4 = -9 + k$
$k = 5$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-VERTICAL_TRANSLATION_POINT", "primaryMethod": "y = -3x를 y축 방향으로 k만큼 평행이동한 식 y = -3x + k에 (3, -4)를 대입한다.", "decisiveStep": "평행이동한 식 y = -3x + k를 세우고 (-4) = -9 + k에서 k = 5를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "그래프 그리기"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION", "templateKey": null, "why": "y축 방향 평행이동 후 지나는 점 대입"}, "crossConceptKeys": ["CC_PARALLEL_TRANSLATION", "CC_POINT_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 공식을 적용해 식을 쓰고 한 점의 좌표를 대입하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차함수", "점"], "goal": ["계수"], "method": ["평행이동", "대입"], "condition": ["그래프"]}, "hold": ""}
```


## Q08
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y=-3x+12$의 그래프와 $x$축, $y$축으로 둘러싸인 도형의 넓이는?
### 선지
① $12$ ② $24$ ③ $30$ ④ $36$ ⑤ $48$
### 정답
②
### 해설
$y=-3x+12$에서
$y=0$을 대입하면 $0=-3x+12 \implies x=4$이므로 $x$절편은 $4$
$x=0$을 대입하면 $y=12$이므로 $y$절편은 $12$
따라서 $x$축, $y$축으로 둘러싸인 직각삼각형의 넓이는
$\dfrac{1}{2} \times 4 \times 12 = 24$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-AXIS_INTERCEPT_TRIANGLE_AREA", "primaryMethod": "y = -3x + 12의 x절편 4와 y절편 12를 구해 직각삼각형의 넓이를 계산한다.", "decisiveStep": "두 절편 4와 12를 밑변과 높이로 삼아 (1/2)*4*12 = 24를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA", "templateKey": null, "why": "일차함수와 두 좌표축이 만드는 삼각형 넓이"}, "crossConceptKeys": ["CC_INTERCEPTS", "CC_POLYGON_AREA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x절편과 y절편을 먼저 구한 뒤 삼각형 넓이 공식에 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차함수"], "goal": ["넓이"], "method": ["x절편", "y절편"], "condition": ["직각삼각형"]}, "hold": ""}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
일차방정식 $ax+by+6=0$의 그래프가 점 $(-3, 0)$을 지나고 $y$축에 평행한 직선일 때, 두 수 $a$, $b$에 대하여 $b-a$의 값은?
### 선지
① $-2$ ② $-1$ ③ $0$ ④ $1$ ⑤ $2$
### 정답
①
### 해설
점 $(-3, 0)$을 지나고 $y$축에 평행한 직선의 방정식은 $x = -3$이다.
$ax+by+6=0$이 $x=-3$과 같으려면 $y$의 계수가 $0$이어야 하므로
$b = 0$
$ax+6=0$에 $x=-3$을 대입하면
$-3a+6=0 \implies a=2$
따라서 $b-a = 0 - 2 = -2$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "9", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-VERTICAL_LINE_COEFFICIENTS", "primaryMethod": "y축에 평행하고 (-3, 0)을 지나는 직선 x = -3과 ax + by + 6 = 0을 비교해 b = 0, a = 2를 구한다.", "decisiveStep": "y축에 평행한 직선 조건에서 b = 0임을 먼저 확정한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "x축·y축에 평행한 직선"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS", "templateKey": null, "why": "y축에 평행한 일차방정식의 계수 결정"}, "crossConceptKeys": ["CC_EQUATIONS_PARALLEL_TO_AXES", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y축에 평행한 직선의 형태가 x = 상수임을 파악하고 계수 b = 0과 a를 구해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차방정식", "점"], "goal": ["계수"], "method": ["평행", "대입"], "condition": ["직선"]}, "hold": ""}
```


## Q10
- 형식: 객관식
- 배점: 4
### 발문
점 $(-3, 0)$을 지나고 $y$축에 평행한 직선의 방정식과 직선의 방정식 $x+3y=9$는 한 점에서 만난다. 그 교점의 좌표를 $(a, b)$라 할 때, $a+b$의 값은? (단, $a$, $b$는 수)
### 선지
① $-3$ ② $-1$ ③ $1$ ④ $3$ ⑤ $4$
### 정답
③
### 해설
점 $(-3, 0)$을 지나고 $y$축에 평행한 직선의 방정식은 $x = -3$이다.
이 직선과 $x+3y=9$의 교점의 좌표를 구하기 위해 $x=-3$을 대입하면
$-3+3y=9$
$3y=12$
$y=4$
따라서 교점은 $(-3, 4)$이므로 $a=-3$, $b=4$이고
$a+b = -3+4 = 1$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-INTERSECTION_WITH_VERTICAL_LINE", "primaryMethod": "(-3, 0)을 지나고 y축에 평행한 직선 x = -3을 x + 3y = 9에 대입해 교점 (-3, 4)를 구한다.", "decisiveStep": "직선 x = -3을 세워 x + 3y = 9에 대입함으로써 y = 4를 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "교점과 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "y축 평행 직선과 일반 직선의 교점 구하기"}, "crossConceptKeys": ["CC_EQUATIONS_PARALLEL_TO_AXES", "CC_INTERSECTION_OF_TWO_GRAPHS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y축에 평행한 직선의 식 x = -3을 먼저 세운 뒤 다른 직선과 연립해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["점", "직선"], "goal": ["교점"], "method": ["평행", "대입"], "condition": ["직선"]}, "hold": ""}
```


## Q11
- 형식: 객관식
- 배점: 4
### 발문
기울기가 $\dfrac{1}{4}$인 일차함수가 두 점 $(2, 7)$, $(k, 5)$를 지날 때, 수 $k$의 값은?
### 선지
① $-10$ ② $-6$ ③ $-2$ ④ $2$ ⑤ $6$
### 정답
②
### 해설
두 점 $(2, 7)$, $(k, 5)$를 지나는 직선의 기울기는
$\dfrac{5-7}{k-2} = \dfrac{-2}{k-2}$
기울기가 $\dfrac{1}{4}$이므로
$\dfrac{-2}{k-2} = \dfrac{1}{4}$
$k-2 = -8$
$k = -6$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-SLOPE_FROM_TWO_POINTS", "primaryMethod": "두 점 (2, 7), (k, 5)의 기울기 (5 - 7)/(k - 2)가 1/4과 같다고 식을 세워 k를 구한다.", "decisiveStep": "-2 / (k - 2) = 1/4에서 k - 2 = -8임을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 점과 기울기 조건으로 미지 좌표 구하기"}, "crossConceptKeys": ["CC_SLOPE_FORMULA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기 공식 (y의 증가량)/(x의 증가량)에 좌표를 바로 대입해 푸는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["기울기", "점"], "goal": ["좌표"], "method": ["기울기"], "condition": ["일차함수"]}, "hold": ""}
```


## Q12
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y=ax+b$의 그래프에 대하여 $a>0$, $b<0$을 만족하는 그래프의 특징과 $a<0$, $b=0$을 만족하는 그래프의 특징을 아래 <보기>에서 순서대로 바르게 짝지은 것은? (단, $a\ne 0$, $a$, $b$는 상수)


<보기>
ㄱ. 원점을 지나고 오른쪽 위로 향하는 직선
ㄴ. $y$축과 음의 부분에서 만나고 오른쪽 위로 향하는 직선
ㄷ. $y$축과 양의 부분에서 만나고 오른쪽 아래로 향하는 직선
ㄹ. $y$축과 양의 부분에서 만나고 오른쪽 위로 향하는 직선
ㅁ. 원점을 지나고 오른쪽 아래로 향하는 직선
ㅂ. $y$축과 음의 부분에서 만나고 오른쪽 아래로 향하는 직선
### 선지
① ㄱ, ㄷ ② ㄱ, ㅂ ③ ㄴ, ㄹ ④ ㅁ, ㅂ ⑤ ㄴ, ㅁ
### 정답
⑤
### 해설
$a>0$, $b<0$이면 기울기가 양수이므로 오른쪽 위로 향하고, $y$절편이 음수이므로 $y$축과 음의 부분에서 만난다. 따라서 ㄴ이다.
$a<0$, $b=0$이면 기울기가 음수이므로 오른쪽 아래로 향하고, $y$절편이 $0$이므로 원점을 지난다. 따라서 ㅁ이다.
그러므로 순서대로 짝지으면 ㄴ, ㅁ인 ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "12", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-GRAPH_SHAPE_FROM_COEFFICIENTS", "primaryMethod": "기울기 a의 부호로 그래프의 증가·감소 방향을 정하고 y절편 b의 부호로 y축과의 교점 위치를 판별한다.", "decisiveStep": "(a>0, b<0)은 ㄴ, (a<0, b=0)은 ㅁ에 대응함을 각각 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "증가·감소"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_CONDITIONS_MATCHING", "templateKey": null, "why": "a, b의 부호 조건에 맞는 그래프 성질 매칭"}, "crossConceptKeys": ["CC_SLOPE_SIGN", "CC_Y_INTERCEPT", "CC_GRAPH_MATCHING"], "conditionKeys": ["COND_POSITIVE", "COND_NEGATIVE", "COND_NONZERO"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기 부호와 y절편 부호의 기하적 의미를 바로 연결하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차함수", "부호"], "goal": ["그래프"], "method": ["기울기", "y절편"], "condition": ["부호"]}, "hold": ""}
```


## Q13
- 형식: 객관식
- 배점: 4
### 발문
민수와 지수가 계단에서 가위바위보를 하여 이기면 $4$계단 올라가고 지면 $3$계단을 내려가며, 비길 경우는 움직이지 않는 게임을 했다. 처음보다 민수는 $6$계단, 지수는 $13$계단을 더 올라가 있고, 비긴 경우는 $4$번이었다. 가위바위보 게임을 한 총 횟수는?
### 선지
① 17회 ② 19회 ③ 21회 ④ 23회 ⑤ 25회
### 정답
④
### 해설
민수가 이긴 횟수를 $x$, 지수가 이긴 횟수를 $y$라 하자.
민수가 지면 지수가 이기고, 지수가 지면 민수가 이기므로
$\begin{cases}4x - 3y = 6 \\ -3x + 4y = 13\end{cases}$
두 식을 변끼리 더하면
$x + y = 19$
따라서 비긴 경우 $4$번을 더한 총 게임 횟수는
$19 + 4 = 23$회
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-ROCK_PAPER_SCISSORS_STAIRS", "primaryMethod": "민수와 지수가 이긴 횟수를 각각 x, y로 두고 두 사람의 계단 변화량으로 연립방정식을 세운다.", "decisiveStep": "4x - 3y = 6과 -3x + 4y = 13을 더해 x + y = 19를 구하고 비긴 횟수 4를 더한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "수와 개수", "l4": "두 수 관계"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "승패가 엇갈리는 계단 게임의 연립방정식 활용"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS", "CC_INVERSE_WIN_LOSS_RELATIONS"], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상대의 승리가 나의 패배라는 관계를 식으로 세우고 비긴 횟수까지 합산해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["조건"], "goal": ["미지수"], "method": ["연립방정식", "가감법"], "condition": ["자연수"]}, "hold": ""}
```


## Q14
- 형식: 객관식
- 배점: 4.5
### 발문
일차함수 $y=-\dfrac{3}{2}x+1$의 그래프와 평행하고 점 $(4, -2)$를 지나는 일차함수의 그래프의 $x$절편과 $y$절편을 순서대로 구하면?
### 선지
① $-\dfrac{8}{3}$, $4$ ② $\dfrac{8}{3}$, $4$ ③ $\dfrac{8}{3}$, $-4$ ④ $4$, $\dfrac{8}{3}$ ⑤ $-\dfrac{4}{3}$, $4$
### 정답
②
### 해설
일차함수 $y=-\dfrac{3}{2}x+1$의 그래프와 평행하므로 구하는 일차함수의 기울기는 $-\dfrac{3}{2}$이다.
식을 $y=-\dfrac{3}{2}x+b$라 하고 점 $(4, -2)$를 대입하면
$-2 = -\dfrac{3}{2}\times 4 + b$
$-2 = -6 + b \implies b = 4$
따라서 일차함수의 식은 $y=-\dfrac{3}{2}x+4$이다.
$y=0$을 대입하면 $0=-\dfrac{3}{2}x+4 \implies x=\dfrac{8}{3}$이므로 $x$절편은 $\dfrac{8}{3}$, $y$절편은 $4$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "14", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-PARALLEL_LINE_THROUGH_POINT", "primaryMethod": "평행 조건에서 기울기 -3/2를 가져와 y = -(3/2)x + b에 (4, -2)를 대입해 식을 완성한 뒤 절편을 구한다.", "decisiveStep": "b = 4를 구해 식 y = -(3/2)x + 4를 세운 다음 x절편 8/3을 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION", "templateKey": null, "why": "평행한 직선과 한 점으로 식을 세워 절편 구하기"}, "crossConceptKeys": ["CC_SLOPE_AND_INTERCEPT", "CC_INTERCEPTS", "CC_POINT_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행 조건으로 기울기를 정하고 한 점을 대입해 식을 구한 뒤 x절편까지 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차함수", "점"], "goal": ["x절편", "y절편"], "method": ["평행", "대입"], "condition": ["평행"]}, "hold": ""}
```


## Q15
- 형식: 객관식
- 배점: 4
### 발문
$x$절편이 $8$이고 $y$절편이 $2$인 직선을 그래프로 하는 일차함수의 식을 구하면?
### 선지
① $y=-4x+2$ ② $y=-\dfrac{1}{4}x+8$ ③ $y=4x+8$ ④ $y=\dfrac{1}{4}x+2$ ⑤ $y=-\dfrac{1}{4}x+2$
### 정답
⑤
### 해설
$x$절편이 $8$, $y$절편이 $2$이므로 직선은 두 점 $(8, 0)$, $(0, 2)$를 지난다.
기울기는 $\dfrac{0-2}{8-0} = -\dfrac{2}{8} = -\dfrac{1}{4}$
$y$절편이 $2$이므로 구하는 일차함수의 식은
$y = -\dfrac{1}{4}x + 2$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "15", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-EQUATION_FROM_INTERCEPTS", "primaryMethod": "x절편 (8, 0)과 y절편 (0, 2)로부터 기울기 -1/4을 구해 y = -(1/4)x + 2를 세운다.", "decisiveStep": "기울기 (0 - 2)/(8 - 0) = -1/4을 정확히 부호까지 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "x절편과 y절편으로 일차함수의 식 구하기"}, "crossConceptKeys": ["CC_INTERCEPTS", "CC_SLOPE_FORMULA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x절편과 y절편을 두 점으로 읽어 기울기와 y절편으로 식을 바로 쓰는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["x절편", "y절편"], "goal": ["일차함수"], "method": ["기울기"], "condition": ["직선"]}, "hold": ""}
```


## Q16
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases}\dfrac{x}{4}+\dfrac{y}{6}=\dfrac{7}{6}\\0.2x+ky=-0.8\end{cases}$의 해는 $y$의 값이 $x$의 $2$배일 때, 수 $k$의 값은?
### 선지
① $-0.5$ ② $-0.4$ ③ $-0.3$ ④ $-0.2$ ⑤ $-0.1$
### 정답
③
### 해설
$y$의 값이 $x$의 $2$배이므로 $y=2x$이다.
이를 첫째 식 $\dfrac{x}{4}+\dfrac{y}{6}=\dfrac{7}{6}$에 대입하면
$\dfrac{x}{4}+\dfrac{2x}{6}=\dfrac{7}{6}$
양변에 $12$를 곱하면
$3x + 4x = 14$
$7x = 14 \implies x = 2$
따라서 $y = 2(2) = 4$이다.
$x=2$, $y=4$를 둘째 식 $0.2x+ky=-0.8$에 대입하면
$0.2(2) + 4k = -0.8$
$0.4 + 4k = -0.8$
$4k = -1.2$
$k = -0.3$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-FRACTION_DECIMAL_PARAM_CONDITION", "primaryMethod": "y = 2x 조건을 첫째 분수 방정식에 대입해 x = 2, y = 4를 구한 뒤 둘째 소수 방정식에서 k를 구한다.", "decisiveStep": "y = 2x를 x/4 + y/6 = 7/6에 대입해 x = 2, y = 4를 먼저 확정한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "복잡한 꼴의 연립방정식", "l4": "분수·소수가 있는 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "해 사이의 비례 조건과 분수·소수 계수 연립방정식"}, "crossConceptKeys": ["CC_FRACTION_COEFFICIENTS", "CC_DECIMAL_COEFFICIENTS", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y = 2x 조건을 이용해 분수 방정식을 풀고 그 해를 소수 방정식에 대입해 k를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식", "비율"], "goal": ["계수"], "method": ["대입법"], "condition": ["해"]}, "hold": ""}
```


## Q17
- 형식: 객관식
- 배점: 4
### 발문
두 일차방정식 $ax+y=5$와 $bx-ay=4$의 그래프가 만나는 교점을 $(2, 1)$이라 하자. 이때, 두 수 $a$, $b$에 대하여 $a-b$의 값은?
### 선지
① $-5$ ② $-4$ ③ $-3$ ④ $-2$ ⑤ $-1$
### 정답
⑤
### 해설
교점 $(2, 1)$은 두 일차방정식을 모두 만족시킨다.
$ax+y=5$에 $x=2$, $y=1$을 대입하면
$2a+1=5 \implies 2a=4 \implies a=2$
$bx-ay=4$에 $x=2$, $y=1$, $a=2$를 대입하면
$2b-2(1)=4 \implies 2b=6 \implies b=3$
따라서 $a-b = 2-3 = -1$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-INTERSECTION_COEFFICIENTS", "primaryMethod": "교점 (2, 1)을 ax + y = 5에 대입해 a = 2를 구하고 bx - ay = 4에 대입해 b = 3을 구한다.", "decisiveStep": "첫째 식에서 a = 2를 먼저 결정한 뒤 둘째 식에 a = 2와 (2, 1)을 대입해 b = 3을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "교점과 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 직선의 교점 좌표로 미정계수 결정"}, "crossConceptKeys": ["CC_INTERSECTION_OF_TWO_GRAPHS", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "교점을 두 방정식에 순차적으로 대입해 계수 a, b를 구해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차방정식", "교점"], "goal": ["계수"], "method": ["대입"], "condition": ["교점"]}, "hold": ""}
```


## Q18
- 형식: 객관식
- 배점: 4.5
### 발문
일차함수 $y=ax+b$의 그래프는 일차함수 $y=-\dfrac{1}{2}x+2$의 그래프와 $x$축 위에서 만나고, 일차함수 $y=3x+6$의 그래프와는 $y$축 위에서 만난다. 두 수 $a$, $b$에 대하여 $\dfrac{b}{a}$의 값은?
### 선지
① $-4$ ② $-3$ ③ $-2$ ④ $2$ ⑤ $4$
### 정답
①
### 해설
$y=-\dfrac{1}{2}x+2$의 그래프와 $x$축 위에서 만나므로 두 그래프의 $x$절편이 같다.
$y=0$을 대입하면 $0=-\dfrac{1}{2}x+2 \implies x=4$이므로 점 $(4, 0)$을 지난다.
$y=3x+6$의 그래프와 $y$축 위에서 만나므로 두 그래프의 $y$절편이 같다.
$x=0$을 대입하면 $y=6$이므로 $b=6$이다.
$y=ax+6$에 $(4, 0)$을 대입하면
$0 = 4a+6 \implies a = -\dfrac{3}{2}$
따라서 $\dfrac{b}{a} = 6 \div \left(-\dfrac{3}{2}\right) = 6 \times \left(-\dfrac{2}{3}\right) = -4$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-LINE_FROM_X_AND_Y_INTERCEPT_CONDITIONS", "primaryMethod": "x축 위 교점에서 x절편 4를, y축 위 교점에서 y절편 6을 구해 일차함수의 식과 b/a를 계산한다.", "decisiveStep": "두 조건을 각각 (4, 0)과 (0, 6) 통과 조건으로 해석해 a = -3/2, b = 6을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "x축·y축 위 교점 조건으로부터 일차함수 계수 구하기"}, "crossConceptKeys": ["CC_X_INTERCEPT", "CC_Y_INTERCEPT", "CC_COEFFICIENT_RATIOS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x축 위·y축 위 교점을 각각 절편으로 해석해 두 점으로 식을 세우는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차함수", "교점"], "goal": ["계수"], "method": ["x절편", "y절편"], "condition": ["교점"]}, "hold": ""}
```


## Q19
- 형식: 객관식
- 배점: 5
### 발문
직사각형 $ABCD$에서 점 $P$는 점 $B$를 출발하여 변 $BC$를 따라 점 $C$까지 움직인다. $AD=10\text{ cm}$, $CD=6\text{ cm}$이고, 선분 $PC$의 길이를 $x\text{ cm}$, 삼각형 $ABP$의 넓이를 $y\text{ cm}^{2}$라 하자. $x$와 $y$ 사이의 관계식과 삼각형 $ABP$의 넓이가 $18\text{ cm}^{2}$이 되는 선분 $PC$의 길이를 순서대로 바르게 짝지은 것은?
### 선지
① $y=-3x+30$, $4\text{ cm}$ ② $y=3x+30$, $4\text{ cm}$ ③ $y=-6x+60$, $4\text{ cm}$ ④ $y=-3x+30$, $6\text{ cm}$ ⑤ $y=-6x+60$, $6\text{ cm}$
### 정답
①
### 해설
직사각형 $ABCD$에서 $BC = AD = 10        ext{ cm}$, $AB = CD = 6        ext{ cm}$이다.
$PC = x        ext{ cm}$이므로 $BP = (10 - x)        ext{ cm}$이다.
삼각형 $ABP$의 넓이 $y$는
$y = \dfrac{1}{2} \times BP \times AB = \dfrac{1}{2}(10-x) \times 6 = 3(10-x) = -3x+30$
$y=18$일 때
$-3x+30 = 18$
$-3x = -12 \implies x = 4$
따라서 관계식은 $y=-3x+30$, 선분 $PC$의 길이는 $4        ext{ cm}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-MOVING_POINT_TRIANGLE_AREA", "primaryMethod": "PC = x에서 BP = 10 - x를 구하고 삼각형 ABP의 넓이 식 y = -3x + 30을 세워 y = 18일 때 x를 구한다.", "decisiveStep": "밑변 BP를 10 - x로 표현해 y = (1/2)*(10 - x)*6 = -3x + 30을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "도형 위 동점에 따른 삼각형 넓이의 일차함수 활용"}, "crossConceptKeys": ["CC_RECTANGLE_PROPERTIES", "CC_POLYGON_AREA", "CC_LINEAR_FUNCTIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "동점의 위치 x = PC로부터 밑변 10 - x를 유도하고 넓이 식과 방정식까지 풀어야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["직사각형", "삼각형", "길이"], "goal": ["일차함수", "길이"], "method": ["넓이", "대입"], "condition": ["직사각형"]}, "hold": ""}
```


## Q20
- 형식: 객관식
- 배점: 5
### 발문
점 $(-2, 6)$을 지나고 $x$축에 평행한 직선과 두 직선 $x+y-4=0$, $2x-3y+2=0$이 이루는 도형의 넓이는?
### 선지
① $10$ ② $15$ ③ $20$ ④ $25$ ⑤ $30$
### 정답
③
### 해설
점 $(-2, 6)$을 지나고 $x$축에 평행한 직선의 방정식은 $y=6$이다.
$y=6$과 $x+y-4=0$의 교점은
$x+6-4=0 \implies x=-2$이므로 $(-2, 6)$
$y=6$과 $2x-3y+2=0$의 교점은
$2x-18+2=0 \implies 2x=16 \implies x=8$이므로 $(8, 6)$
두 직선 $x+y-4=0$과 $2x-3y+2=0$의 교점은 $y=4-x$를 대입하면
$2x-3(4-x)+2=0$
$5x-10=0 \implies x=2$
$y=4-2=2$이므로 교점은 $(2, 2)$
세 직선이 이루는 삼각형의 밑변의 길이는 $8-(-2)=10$, 높이는 $6-2=4$이므로
넓이는 $\dfrac{1}{2}\times 10\times 4 = 20$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-THREE_LINES_TRIANGLE_AREA", "primaryMethod": "y = 6과 두 직선의 교점 (-2, 6), (8, 6) 및 두 직선의 교점 (2, 2)를 모두 구해 삼각형 넓이를 계산한다.", "decisiveStep": "세 교점 (-2, 6), (8, 6), (2, 2)를 구해 밑변 10과 높이 4를 결정한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA", "templateKey": null, "why": "세 직선으로 둘러싸인 삼각형의 넓이"}, "crossConceptKeys": ["CC_EQUATIONS_PARALLEL_TO_AXES", "CC_INTERSECTION_OF_TWO_GRAPHS", "CC_POLYGON_AREA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 직선의 세 교점을 연립방정식으로 모두 구한 뒤 밑변과 높이를 계산해 넓이를 구하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["점", "직선"], "goal": ["넓이"], "method": ["교점", "연립방정식"], "condition": ["삼각형"]}, "hold": ""}
```


## Q21
- 형식: 서답형
- 배점: 5
### 발문
일차함수의 그래프가 두 점 $(-4, 0)$, $(0, 5)$를 지날 때, 다음 물음에 답하여라.
(1) 이 그래프의 $x$절편과 $y$절편을 각각 구하여라.
(2) 이 그래프를 일차함수의 식으로 나타내어라.
(3) 위에서 구한 일차함수의 그래프의 성질을 한 문장으로 서술하여라. (기울기, 그래프 방향을 포함하여 서술할 것)
### 선지
없음
### 정답
(1) $x$절편: $-4$, $y$절편: $5$ / (2) $y=\dfrac{5}{4}x+5$ / (3) 기울기가 양수이므로 오른쪽 위로 향하는 직선이다.
### 해설
(1) 그래프가 $(-4, 0)$과 $(0, 5)$를 지나므로
$x$절편은 $-4$, $y$절편은 $5$이다.
(2) 기울기는 $\dfrac{5-0}{0-(-4)} = \dfrac{5}{4}$이고 $y$절편이 $5$이므로
$y = \dfrac{5}{4}x + 5$
(3) 기울기가 양수이므로 오른쪽 위로 향하는 직선이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "21", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-INTERCEPTS_EQUATION_AND_DIRECTION", "primaryMethod": "두 점 (-4, 0), (0, 5)에서 x절편, y절편을 읽고 기울기 5/4로 일차함수 식과 그래프 방향을 서술한다.", "decisiveStep": "두 절편에서 기울기 (5 - 0)/(0 - (-4)) = 5/4를 구해 식을 완성한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 절편에서 일차함수 식과 그래프 방향 서술"}, "crossConceptKeys": ["CC_INTERCEPTS", "CC_SLOPE_FORMULA", "CC_SLOPE_SIGN"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절편 읽기, 식 세우기, 기울기 부호에 따른 방향 서술까지 단계적으로 연결되는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["점"], "goal": ["x절편", "y절편", "일차함수"], "method": ["기울기"], "condition": ["그래프"]}, "hold": ""}
```


## Q22
- 형식: 서답형
- 배점: 4
### 발문
서준이는 무더운 날씨가 이어져 실내 온도가 $34^\circ\mathrm{C}$까지 올라간 상태에서 에어컨을 켜기 시작하였다. 실내 온도가 $22^\circ\mathrm{C}$가 되면 에어컨을 바로 끄기로 하였고, 에어컨을 켜면 $1$시간마다 $3^\circ\mathrm{C}$씩 일정하게 내려간다고 할 때, 다음 물음에 답하여라. (단, 에어컨의 실제 작동 원리는 고려하지 않는다.)
(1) 변수 $x$, $y$를 각각 정하여라.
(2) 문제 상황에 맞는 $x$, $y$ 사이의 관계식을 구하여라.
(3) 몇 시간 후에 에어컨을 꺼야 하는지 구하여라.
### 선지
없음
### 정답
(1) $x$: 에어컨을 켠 후 지난 시간(시간), $y$: 실내 온도($^\circ\mathrm{C}$) / (2) $y=-3x+34$ / (3) $4$시간 후
### 해설
(1) 에어컨을 켠 후 지난 시간을 $x$시간, 그때의 실내 온도를 $y^\circ\mathrm{C}$라 하자.
(2) 처음 온도가 $34^\circ\mathrm{C}$이고 $1$시간마다 $3^\circ\mathrm{C}$씩 내려가므로
$y = 34 - 3x = -3x + 34$
(3) $y=22$를 대입하면
$22 = -3x + 34$
$3x = 12 \implies x = 4$
따라서 $4$시간 후에 에어컨을 꺼야 한다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-TEMPERATURE_LINEAR_FUNCTION_WORD", "primaryMethod": "경과 시간 x와 실내 온도 y를 변수로 정하고 초기값 34와 변화율 -3으로 y = -3x + 34를 세운다.", "decisiveStep": "y = -3x + 34에 y = 22를 대입해 x = 4를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_WORD_PROBLEM_TEMPERATURE", "templateKey": null, "why": "일정한 비율로 변하는 온도 문장제"}, "crossConceptKeys": ["CC_RATE_OF_CHANGE", "CC_ALGEBRAIC_MODELING"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실생활 문장에서 변수를 정의하고 변화율을 기울기로 삼아 일차함수 식을 세우는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["조건"], "goal": ["일차함수"], "method": ["대입"], "condition": ["비율"]}, "hold": ""}
```


## Q23
- 형식: 서답형
- 배점: 6
### 발문
좌표평면 위의 세 직선 (가), (나), (다)가 각각 다음과 같은 두 점을 지날 때, 물음에 답하여라.
- 직선 (가): $(-2, -1)$, $(0, 3)$
- 직선 (나): $(0, -3)$, $(2, 3)$
- 직선 (다): $(1, -3)$, $(3, 1)$
1. 세 직선 (가), (나), (다)의 방정식을 각각 구하여라.
2. 세 직선의 위치 관계를 다음과 같이 분류하여 서술하여라.
(1) 한 점에서 만나는 두 직선을 각각 찾아 기호로 쓰고, 그 교점의 좌표를 구하여라.
(2) 서로 만나지 않는 두 직선을 찾아 기호로 쓰고, 그 이유를 서술하여라.
### 선지
없음
### 정답
1. (가) $y=2x+3$, (나) $y=3x-3$, (다) $y=2x-5$ / 2. (1) (가), (나): $(6, 15)$, (나), (다): $(-2, -9)$ / (2) (가), (다): 기울기가 $2$로 같고 $y$절편이 서로 다르므로 평행하여 만나지 않는다.
### 해설
1. 세 직선의 방정식을 각각 구한다.
(가) 두 점 $(-2, -1)$, $(0, 3)$을 지나므로 기울기는 $\dfrac{3-(-1)}{0-(-2)} = 2$, $y$절편은 $3$이다.
따라서 (가) $y = 2x + 3$
(나) 두 점 $(0, -3)$, $(2, 3)$을 지나므로 기울기는 $\dfrac{3-(-3)}{2-0} = 3$, $y$절편은 $-3$이다.
따라서 (나) $y = 3x - 3$
(다) 두 점 $(1, -3)$, $(3, 1)$을 지나므로 기울기는 $\dfrac{1-(-3)}{3-1} = 2$이다.
$y=2x+c$에 $(1, -3)$을 대입하면 $-3 = 2+c \implies c=-5$
따라서 (다) $y = 2x - 5$
2-(1) 한 점에서 만나는 두 직선과 교점은 다음과 같다.
(가)와 (나): $2x+3 = 3x-3 \implies x=6$, $y=15$이므로 $(6, 15)$
(나)와 (다): $3x-3 = 2x-5 \implies x=-2$, $y=-9$이므로 $(-2, -9)$
2-(2) (가)와 (다)는 기울기가 모두 $2$로 같고 $y$절편이 $3$, $-5$로 서로 다르므로 평행하여 만나지 않는다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "23", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-THREE_LINES_RELATION_AND_INTERSECTIONS", "primaryMethod": "세 직선의 식 y = 2x + 3, y = 3x - 3, y = 2x - 5를 구한 뒤 교점 두 쌍과 평행 조건을 판별한다.", "decisiveStep": "세 직선의 기울기 2, 3, 2를 비교해 만나는 두 쌍의 교점과 평행한 한 쌍을 분류한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "두 직선의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "세 직선의 방정식 도출 및 교점·평행 관계 분류"}, "crossConceptKeys": ["CC_SLOPE_FORMULA", "CC_INTERSECTION_OF_TWO_GRAPHS", "CC_SLOPE_AND_INTERCEPT"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 직선의 식을 각각 구하고 두 쌍의 교점 계산과 평행 조건 서술을 모두 수행해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["점", "직선"], "goal": ["교점", "일차함수"], "method": ["기울기", "연립방정식"], "condition": ["평행"]}, "hold": ""}
```


## Q24
- 형식: 서답형
- 배점: 5
### 발문
지민이는 길이가 $10\text{ km}$인 산책로를 걷는데 처음에는 시속 $4\text{ km}$로 걷다가 도중에 힘이 들어 남은 거리는 시속 $2\text{ km}$로 걸어 총 $3$시간 만에 산책을 마쳤다. 연립방정식을 이용하여 시속 $4\text{ km}$로 걸은 시간과 시속 $2\text{ km}$로 걸은 시간을 구하려고 한다.
(1) 미지수 $x$, $y$를 각각 정하여라.
(2) 두 식을 세워 연립방정식을 풀어라.
(3) 시속 $4\text{ km}$로 걸은 시간과 시속 $2\text{ km}$로 걸은 시간을 각각 구하여라.
### 선지
없음
### 정답
(1) $x$: 시속 $4\text{ km}$로 걸은 시간(시간), $y$: 시속 $2\text{ km}$로 걸은 시간(시간) / (2) $\begin{cases}x+y=3\\4x+2y=10\end{cases}$, $x=2$, $y=1$ / (3) 시속 $4\text{ km}$로 걸은 시간: $2$시간, 시속 $2\text{ km}$로 걸은 시간: $1$시간
### 해설
(1) 시속 $4\text{ km}$로 걸은 시간을 $x$시간, 시속 $2\text{ km}$로 걸은 시간을 $y$시간이라 하자.
(2) 총 걸린 시간과 총 거리에 대한 연립방정식은
$\begin{cases}x+y=3 \\ 4x+2y=10\end{cases}$
둘째 식을 $2$로 나누면 $2x+y=5$
$(2x+y)-(x+y)=5-3 \implies x=2$
$x=2$를 $x+y=3$에 대입하면 $y=1$
(3) 시속 $4\text{ km}$로 걸은 시간은 $2$시간, 시속 $2\text{ km}$로 걸은 시간은 $1$시간이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-SPEED_TIME_DISTANCE_WALK", "primaryMethod": "두 구간에서 걸은 시간을 x, y로 두고 x + y = 3과 4x + 2y = 10을 연립해 푼다.", "decisiveStep": "시간 합 x + y = 3과 거리 합 4x + 2y = 10을 세워 가감법으로 x = 2, y = 1을 구한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "속력·시간·거리", "l4": "마주가기·따라가기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "속력 변화 구간별 시간 구하기 연립방정식 활용"}, "crossConceptKeys": ["CC_SPEED_DISTANCE_TIME", "CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문장제에서 두 구간의 시간을 미지수로 두고 시간·거리 두 방정식을 세워 푸는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["거리", "속력"], "goal": ["미지수"], "method": ["연립방정식", "가감법"], "condition": ["거리"]}, "hold": ""}
```