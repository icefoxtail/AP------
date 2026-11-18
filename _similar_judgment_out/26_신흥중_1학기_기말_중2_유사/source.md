```json:exam
{"stem": "26_신흥중_1학기_기말_중2_유사", "sourceArchiveFile": "original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js", "examFolder": "1final", "grade": "중2", "curriculum": "2022", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-14"}
```


## Q01
- 형식: 객관식
- 배점: 3
### 발문
$x, y$의 값이 자연수일 때, 일차방정식 $x + 4y = 7$의 해는?
### 선지
① $x=1,\ y=1$ ② $x=2,\ y=1$ ③ $x=3,\ y=1$ ④ $x=1,\ y=2$ ⑤ $x=3,\ y=2$
### 정답
③
### 해설
$x, y$가 자연수이므로 $y = 1$일 때 $x + 4 = 7 \implies x = 3$
$y = 2$일 때 $x + 8 = 7 \implies x = -1$ (자연수가 아님)
따라서 구하는 해는 $x = 3,\ y = 1$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-LINEAR_EQ_NATURAL_SOLUTION", "primaryMethod": "y에 자연수 1, 2를 차례로 대입하여 x도 자연수가 되는 순서쌍 (3, 1)을 찾는다.", "decisiveStep": "y = 1일 때 x = 3이 되고 y >= 2에서는 x가 음수가 됨을 확인한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "자연수 조건 미지수가 2개인 일차방정식의 해"}, "crossConceptKeys": ["CC_LINEAR_EQUATIONS_TWO_VARIABLES"], "conditionKeys": ["COND_NATURAL_NUMBER"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y = 1부터 자연수를 대입하면 바로 유일한 해가 나오는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차방정식", "자연수"], "goal": ["해"], "method": ["대입"], "condition": ["자연수"]}, "hold": ""}
```


## Q02
- 형식: 객관식
- 배점: 3
### 발문
함수 $f(x) = ax + 9$에서 $f(3) = 3$일 때, 수 $a$의 값은?
### 선지
① $-3$ ② $-2$ ③ $-1$ ④ $2$ ⑤ $4$
### 정답
②
### 해설
$f(3) = 3a + 9 = 3$
$3a = -6$
$\therefore a = -2$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-FUNCTION_VALUE_PARAMETER", "primaryMethod": "f(3) = 3을 식 f(x) = ax + 9에 대입하여 일차방정식 3a + 9 = 3을 푼다.", "decisiveStep": "3a + 9 = 3에서 a = -2를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT_FUNCTION_VALUE", "templateKey": null, "why": "함숫값 조건을 이용한 계수 결정"}, "crossConceptKeys": ["CC_FUNCTION_VALUE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 함숫값 x = 3을 한 번 대입하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["함수", "함숫값"], "goal": ["상수"], "method": ["대입"], "condition": ["함숫값"]}, "hold": ""}
```


## Q03
- 형식: 객관식
- 배점: 3
### 발문
다음 일차함수의 그래프 중 $x$의 값이 $4$만큼 증가할 때 $y$의 값이 $12$만큼 감소하는 것은?
### 선지
① $y = 4x + 3$ ② $y = 3x - 7$ ③ $y = -\frac{1}{3}x + 2$ ④ $y = -3x + 5$ ⑤ $y = -4x + 1$
### 정답
④
### 해설
기울기는 $\frac{y\text{의 값의 증가량}}{x\text{의 값의 증가량}} = \frac{-12}{4} = -3$이다.
따라서 기울기가 $-3$인 일차함수는 ④ $y = -3x + 5$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-SLOPE_FROM_CHANGE_RATE", "primaryMethod": "x의 증가량 4와 y의 증가량 -12의 비로 기울기 -3을 구해 일치하는 식을 고른다.", "decisiveStep": "기울기가 -12 / 4 = -3임을 구해 y = -3x + 5를 선택한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "증가량 비로부터 기울기 판별"}, "crossConceptKeys": ["CC_RATE_OF_CHANGE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기의 정의를 직접 계산하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차함수"], "goal": ["일차함수"], "method": ["기울기"], "condition": ["기울기"]}, "hold": ""}
```


## Q04
- 형식: 객관식
- 배점: 3
### 발문
다음 중 점 $(3, 0)$을 지나고 $y$축에 평행한 직선을 그래프로 갖는 방정식은?
### 선지
① $x = 3$ ② $x = -3$ ③ $y = 3$ ④ $y = -3$ ⑤ $x + y = 3$
### 정답
①
### 해설
점 $(3, 0)$을 지나고 $y$축에 평행한 직선은 $x$좌표가 항상 $3$인 점들의 모임이므로 방정식은 $x = 3$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "4", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-VERTICAL_LINE_EQUATION", "primaryMethod": "y축에 평행한 직선의 방정식이 x = p 꼴임을 이용해 점 (3, 0)을 지나는 x = 3을 고른다.", "decisiveStep": "y축에 평행한 직선은 x = 3 꼴임을 바로 판별한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "x축·y축에 평행한 직선"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS", "templateKey": null, "why": "y축에 평행한 직선의 방정식 찾기"}, "crossConceptKeys": ["CC_EQUATIONS_PARALLEL_TO_AXES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "축에 평행한 직선의 방정식 개념을 바로 묻는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["점", "직선"], "goal": ["방정식"], "method": ["직선의방정식"], "condition": ["평행"]}, "hold": ""}
```


## Q05
- 형식: 객관식
- 배점: 3
### 발문
다음 보기에서 일차함수의 그래프가 오른쪽 아래를 향하는 것을 있는 대로 고른 것은?


ㄱ. $y = 5x - 3$
ㄴ. $y = -4x + 7$
ㄷ. $y = \frac{2}{3}x - 1$
ㄹ. $y = -\frac{1}{2}x + 6$
### 선지
① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄹ ⑤ ㄷ, ㄹ
### 정답
④
### 해설
일차함수 $y = ax + b$의 그래프가 오른쪽 아래를 향하려면 기울기 $a < 0$이어야 한다.
ㄱ. 기울기 $5 > 0$
ㄴ. 기울기 $-4 < 0$
ㄷ. 기울기 $\frac{2}{3} > 0$
ㄹ. 기울기 $-\frac{1}{2} < 0$
따라서 오른쪽 아래를 향하는 것은 ㄴ, ㄹ이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-SLOPE_SIGN_DIRECTION", "primaryMethod": "각 일차함수의 기울기 부호를 확인해 기울기가 음수인 ㄴ, ㄹ을 고른다.", "decisiveStep": "기울기가 음수인 식이 ㄴ(-4)과 ㄹ(-1/2)임을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "증가·감소"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "기울기 부호에 따른 그래프 방향 판별"}, "crossConceptKeys": ["CC_SLOPE_SIGN"], "conditionKeys": ["COND_NEGATIVE"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기의 부호만 보고 그래프 방향을 판정하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차함수"], "goal": ["일차함수"], "method": ["기울기"], "condition": ["음수"]}, "hold": ""}
```


## Q06
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} 3x + 2y = 18 \\ 3x - y = 9 \end{cases}$의 해를 $x = a,\ y = b$라고 할 때, $a + b$의 값은?
### 선지
① $5$ ② $6$ ③ $7$ ④ $8$ ⑤ $9$
### 정답
③
### 해설
$\begin{cases} 3x + 2y = 18 \quad \cdots\cdots \text{㉠} \\ 3x - y = 9 \quad \cdots\cdots \text{㉡} \end{cases}$
㉠에서 ㉡을 변끼리 빼면 $3y = 9 \implies y = 3$
$y = 3$을 ㉡에 대입하면 $3x - 3 = 9 \implies 3x = 12 \implies x = 4$
따라서 $a = 4, b = 3$이므로 $a + b = 4 + 3 = 7$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-ELIMINATION_METHOD_BASIC", "primaryMethod": "x의 계수가 3으로 같으므로 두 식을 변끼리 빼 y = 3을 구한 뒤 x = 4를 구해 합한다.", "decisiveStep": "3y = 9에서 y = 3을 구하고 대입하여 x = 4, 합 7을 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "가감법"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_SYSTEM_OF_EQUATIONS_ADDITION_SUBTRACTION_METHOD", "templateKey": null, "why": "가감법으로 연립방정식 해 구하기"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "계수가 맞춰진 두 식을 바로 빼면 풀리는 1단계 가감법 문항이다.", "level": "하", "item4slot": {"given": ["연립방정식"], "goal": ["합"], "method": ["가감법", "대입"], "condition": ["해"]}, "hold": ""}
```


## Q07
- 형식: 객관식
- 배점: 4
### 발문
다음 보기에서 $y$가 $x$의 함수인 것을 있는 대로 고른 것은?


ㄱ. 자연수 $x$보다 작은 자연수 $y$
ㄴ. 한 변의 길이가 $x$인 정사각형의 둘레의 길이 $y$
ㄷ. 자연수 $x$와 서로소인 수 $y$
ㄹ. $1000$원짜리 공책 $x$권의 가격 $y$원
### 선지
① ㄱ, ㄷ ② ㄴ, ㄷ ③ ㄴ, ㄹ ④ ㄱ, ㄴ, ㄹ ⑤ ㄴ, ㄷ, ㄹ
### 정답
③
### 해설
ㄱ. $x = 3$일 때 $y = 1, 2$로 여러 개가 대응하므로 함수가 아니다.
ㄴ. $y = 4x$로 $x$의 값에 따라 $y$의 값이 오직 하나씩 정해지므로 함수이다.
ㄷ. $x = 2$일 때 $y = 3, 5, 7, \cdots$로 여러 개가 대응하므로 함수가 아니다.
ㄹ. $y = 1000x$로 $x$의 값에 따라 $y$의 값이 오직 하나씩 정해지므로 함수이다.
따라서 $y$가 $x$의 함수인 것은 ㄴ, ㄹ이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "7", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-FUNCTION_DEFINITION_CHECK", "primaryMethod": "x의 각 값에 y의 값이 오직 하나씩 대응하는지 보기 ㄱ~ㄹ별로 반례를 들어 판별한다.", "decisiveStep": "정사각형 둘레 ㄴ과 공책 가격 ㄹ만 유일 대응을 만족함을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION", "templateKey": null, "why": "함수의 정의 판별"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수의 기본 정의(유일 대응)를 문장형 보기에서 판별하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["자연수", "정사각형"], "goal": ["함수"], "method": ["대응"], "condition": ["함수"]}, "hold": ""}
```


## Q08
- 형식: 객관식
- 배점: 4
### 발문
두 일차방정식 $ax - 3y = 6$, $-6x + 2y = 5$의 그래프의 교점이 존재하지 않을 때, 수 $a$의 값은?
### 선지
① $6$ ② $9$ ③ $12$ ④ $15$ ⑤ $18$
### 정답
②
### 해설
두 일차방정식의 그래프의 교점이 존재하지 않으려면 두 직선이 평행해야 한다.
$\frac{a}{-6} = \frac{-3}{2} \ne \frac{6}{5}$
$\frac{a}{-6} = -\frac{3}{2} \implies 2a = 18 \implies a = 9$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-PARALLEL_LINES_NO_INTERSECTION", "primaryMethod": "교점이 없기 위한 두 직선의 평행 조건을 이용해 x계수 비와 y계수 비를 등치시켜 a를 구한다.", "decisiveStep": "a / (-6) = -3 / 2에서 a = 9를 얻고 상수항 비 6 / 5와 다름을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "두 직선의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION", "templateKey": null, "why": "두 직선이 교점이 없을(평행) 조건"}, "crossConceptKeys": ["CC_COEFFICIENT_RATIOS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행 조건(기울기 같음, y절편 다름)을 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차방정식", "교점"], "goal": ["상수"], "method": ["비례식"], "condition": ["평행"]}, "hold": ""}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
두 점 $(-1, 2)$, $(3, k)$를 지나는 직선이 일차함수 $y = \frac{3}{2}x - 4$의 그래프와 평행할 때, 수 $k$의 값은?
### 선지
① $4$ ② $5$ ③ $6$ ④ $7$ ⑤ $8$
### 정답
⑤
### 해설
두 직선이 평행하므로 기울기가 같다.
$\frac{k - 2}{3 - (-1)} = \frac{3}{2}$
$\frac{k - 2}{4} = \frac{3}{2} \implies k - 2 = 6 \implies k = 8$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-PARALLEL_SLOPE_TWO_POINTS", "primaryMethod": "두 점 (-1, 2), (3, k)를 지나는 직선의 기울기를 일차함수의 기울기 3/2와 같다고 놓고 푼다.", "decisiveStep": "(k - 2)/4 = 3/2에서 k = 8을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "일차함수 그래프의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION", "templateKey": null, "why": "평행한 직선 위의 미지 좌표 구하기"}, "crossConceptKeys": ["CC_SLOPE_FORMULA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 점의 기울기 공식과 평행 조건(기울기 일치)을 바로 결합하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["점", "일차함수"], "goal": ["상수"], "method": ["기울기"], "condition": ["평행"]}, "hold": ""}
```


## Q10
- 형식: 객관식
- 배점: 4
### 발문
두 일차함수 $y = x - 6$, $y = -2x + 3$의 그래프의 교점의 좌표를 $(a, b)$라고 할 때, $a + b$의 값은?
### 선지
① $-4$ ② $-3$ ③ $-2$ ④ $-1$ ⑤ $0$
### 정답
⑤
### 해설
$x - 6 = -2x + 3$
$3x = 9 \implies x = 3$
$y = 3 - 6 = -3$
따라서 교점의 좌표는 $(3, -3)$이므로 $a + b = 3 + (-3) = 0$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-INTERSECTION_COORDINATES_SUM", "primaryMethod": "두 일차함수의 식 x - 6과 -2x + 3을 같다고 놓아 교점의 x좌표 3과 y좌표 -3을 구해 합한다.", "decisiveStep": "교점 (3, -3)을 구하여 a + b = 0을 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "교점과 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION", "templateKey": null, "why": "두 일차함수 그래프의 교점 좌표 합"}, "crossConceptKeys": ["CC_INTERSECTION_OF_TWO_GRAPHS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 식을 연립하여 교점 좌표를 바로 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차함수"], "goal": ["합"], "method": ["연립방정식", "대입"], "condition": ["교점"]}, "hold": ""}
```


## Q11
- 형식: 객관식
- 배점: 4
### 발문
두 수 $a, b$에 대하여 다음 두 연립방정식의 해가 서로 같을 때, $a + b$의 값은?


$\begin{cases} 3x + y = 1 \\ ax + 2y = -7 \end{cases} \qquad \begin{cases} 4x - by = 2 \\ x - 2y = 5 \end{cases}$
### 선지
① $-4$ ② $-3$ ③ $-2$ ④ $-1$ ⑤ $0$
### 정답
①
### 해설
두 연립방정식의 공통 해는 $\begin{cases} 3x + y = 1 \\ x - 2y = 5 \end{cases}$의 해와 같다.
첫째 식에 $2$를 곱하여 둘째 식과 더하면 $7x = 7 \implies x = 1$, $y = 1 - 3 = -2$
$x = 1, y = -2$를 $ax + 2y = -7$에 대입하면 $a - 4 = -7 \implies a = -3$
$x = 1, y = -2$를 $4x - by = 2$에 대입하면 $4 + 2b = 2 \implies 2b = -2 \implies b = -1$
$\therefore a + b = -3 + (-1) = -4$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-COMMON_SOLUTION_PARAMETERS", "primaryMethod": "미지수 a, b가 없는 두 식 3x + y = 1과 x - 2y = 5를 연립해 공통 해 (1, -2)를 구한 뒤 나머지 두 식에 대입해 a, b를 구한다.", "decisiveStep": "공통 해 x = 1, y = -2를 구하고 각각 대입하여 a = -3, b = -1을 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_SYSTEM_OF_EQUATIONS_COMMON_SOLUTION", "templateKey": null, "why": "해가 같은 두 연립방정식의 계수 합"}, "crossConceptKeys": ["CC_COMMON_SOLUTION", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상수 계수인 두 식을 먼저 뽑아 연립하고 구한 해를 미지 계수 식에 대입하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식"], "goal": ["합"], "method": ["가감법", "대입"], "condition": ["해"]}, "hold": ""}
```


## Q12
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y = \frac{1}{2}x - 3$의 그래프와 $x$축 위에서 만나고, 일차함수 $y = 4x + 3$의 그래프와 $y$축 위에서 만나는 두 점을 지나는 일차함수의 기울기는?
### 선지
① $-\frac{3}{2}$ ② $-\frac{1}{2}$ ③ $\frac{1}{2}$ ④ $\frac{2}{3}$ ⑤ $\frac{3}{2}$
### 정답
②
### 해설
$y = \frac{1}{2}x - 3$의 $x$절편은 $y = 0$일 때 $\frac{1}{2}x - 3 = 0 \implies x = 6$이므로 점 $(6, 0)$을 지난다.
$y = 4x + 3$의 $y$절편은 $3$이므로 점 $(0, 3)$을 지난다.
두 점 $(6, 0), (0, 3)$을 지나는 직선의 기울기는 $\frac{3 - 0}{0 - 6} = -\frac{1}{2}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-SLOPE_FROM_INTERCEPTS", "primaryMethod": "첫째 함수의 x절편 (6, 0)과 둘째 함수의 y절편 (0, 3)을 구한 뒤 두 점을 잇는 직선의 기울기를 계산한다.", "decisiveStep": "x절편 6과 y절편 3으로부터 기울기 -3/6 = -1/2를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "x절편·y절편 조건을 이용한 기울기 구하기"}, "crossConceptKeys": ["CC_INTERCEPTS", "CC_SLOPE_FORMULA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x축·y축 위에서 만나는 점의 좌표를 각각 절편으로 해석하고 기울기를 구해야 한다.", "level": "중", "item4slot": {"given": ["일차함수"], "goal": ["기울기"], "method": ["x절편", "y절편", "기울기"], "condition": ["절편"]}, "hold": ""}
```


## Q13
- 형식: 객관식
- 배점: 4
### 발문
함수 $y = \frac{2}{3}x - 2$의 그래프를 $y$축의 방향으로 $6$만큼 평행이동한 그래프가 점 $(k, 2)$를 지날 때, 수 $k$의 값은?
### 선지
① $0$ ② $-1$ ③ $-2$ ④ $-3$ ⑤ $-4$
### 정답
④
### 해설
$y = \frac{2}{3}x - 2$의 그래프를 $y$축의 방향으로 $6$만큼 평행이동하면
$y = \frac{2}{3}x - 2 + 6 = \frac{2}{3}x + 4$
이 그래프가 점 $(k, 2)$를 지나므로
$2 = \frac{2}{3}k + 4 \implies \frac{2}{3}k = -2 \implies k = -3$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-VERTICAL_TRANSLATION_POINT", "primaryMethod": "y축 방향으로 6만큼 평행이동한 식 y = (2/3)x + 4를 세운 뒤 점 (k, 2)를 대입해 k를 구한다.", "decisiveStep": "2 = (2/3)k + 4에서 k = -3을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION", "templateKey": null, "why": "y축 방향 평행이동과 지나는 점 대입"}, "crossConceptKeys": ["CC_PARALLEL_TRANSLATION", "CC_POINT_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 식을 쓰고 점 좌표를 대입하면 바로 풀리는 기본 문항이다.", "level": "하", "item4slot": {"given": ["일차함수", "점"], "goal": ["상수"], "method": ["평행이동", "대입"], "condition": ["평행이동"]}, "hold": ""}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y = f(x)$의 그래프가 두 점 $(2, 5)$, $(5, 7)$을 지날 때, $f(1)$의 값은?
### 선지
① $\frac{13}{3}$ ② $\frac{14}{3}$ ③ $5$ ④ $\frac{16}{3}$ ⑤ $\frac{17}{3}$
### 정답
①
### 해설
두 점 $(2, 5), (5, 7)$을 지나는 직선의 기울기는 $\frac{7 - 5}{5 - 2} = \frac{2}{3}$
$f(x) = \frac{2}{3}x + b$에 $(2, 5)$를 대입하면 $5 = \frac{4}{3} + b \implies b = \frac{11}{3}$
따라서 $f(x) = \frac{2}{3}x + \frac{11}{3}$이므로 $f(1) = \frac{2}{3} + \frac{11}{3} = \frac{13}{3}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-LINE_FROM_TWO_POINTS_EVAL", "primaryMethod": "두 점 (2, 5), (5, 7)로 기울기 2/3와 y절편 11/3을 구해 f(x)를 세운 뒤 f(1)을 계산한다.", "decisiveStep": "f(x) = (2/3)x + 11/3을 확정해 f(1) = 13/3을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 점을 지나는 일차함수 식 구하기 및 함숫값"}, "crossConceptKeys": ["CC_SLOPE_FORMULA", "CC_FUNCTION_VALUE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 점으로 일차함수 식을 먼저 구한 뒤 x = 1을 대입하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차함수", "점"], "goal": ["함숫값"], "method": ["기울기", "대입"], "condition": ["일차함수"]}, "hold": ""}
```


## Q15
- 형식: 객관식
- 배점: 4
### 발문
지면에서 $10\text{ km}$까지는 높이가 $1\text{ km}$ 높아질 때마다 기온이 $6^{\circ}\text{C}$씩 일정하게 낮아진다고 한다. 지면의 기온이 $20^{\circ}\text{C}$일 때, 높이가 $1.8\text{ km}$인 산 정상의 기온은?
### 선지
① $9^{\circ}\text{C}$ ② $9.2^{\circ}\text{C}$ ③ $9.4^{\circ}\text{C}$ ④ $9.6^{\circ}\text{C}$ ⑤ $9.8^{\circ}\text{C}$
### 정답
②
### 해설
높이가 $x\text{ km}$일 때 기온을 $y^{\circ}\text{C}$라 하면
$y = 20 - 6x$
$x = 1.8$을 대입하면 $y = 20 - 6 \times 1.8 = 20 - 10.8 = 9.2$
따라서 산 정상의 기온은 $9.2^{\circ}\text{C}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-WORD_TEMPERATURE_ALTITUDE", "primaryMethod": "지면 기온 20도와 고도당 감소율 -6도로 일차함수 식 y = 20 - 6x를 세워 x = 1.8을 대입한다.", "decisiveStep": "y = 20 - 6(1.8) = 9.2를 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_WORD_PROBLEM_TEMPERATURE", "templateKey": null, "why": "고도에 따른 기온 변화 일차함수 활용"}, "crossConceptKeys": ["CC_APPLIED_WORD_PROBLEMS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일정한 변화율로 일차함수 식을 바로 세워 대입하는 1단계 활용 문항이다.", "level": "하", "item4slot": {"given": ["높이", "일차함수"], "goal": ["함숫값"], "method": ["대입"], "condition": ["일차함수"]}, "hold": ""}
```


## Q16
- 형식: 객관식
- 배점: 5
### 발문
연립방정식 $\begin{cases} 4x - 3y = 18 \\ x + 2y = a \end{cases}$를 만족시키는 $x$와 $y$의 값의 비가 $3 : 2$일 때, 수 $a$의 값은?
### 선지
① $21$ ② $22$ ③ $23$ ④ $24$ ⑤ $25$
### 정답
①
### 해설
$x : y = 3 : 2$이므로 $x = 3k,\ y = 2k$ ($k \ne 0$)라 하자.
$4x - 3y = 18$에 대입하면 $12k - 6k = 18 \implies 6k = 18 \implies k = 3$
따라서 $x = 9,\ y = 6$이므로
$a = x + 2y = 9 + 2 \times 6 = 21$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-RATIO_SOLUTION_PARAMETER", "primaryMethod": "x = 3k, y = 2k로 놓아 4x - 3y = 18에서 k = 3을 구한 뒤 x = 9, y = 6을 x + 2y = a에 대입한다.", "decisiveStep": "12k - 6k = 18에서 k = 3, x = 9, y = 6을 얻어 a = 21을 구한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "해의 비가 주어진 연립방정식의 상수 결정"}, "crossConceptKeys": ["CC_RATIO_AND_PROPORTION", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "비례상수 k를 도입해 해를 구하고 둘째 식의 상수 a까지 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식", "비"], "goal": ["상수"], "method": ["대입"], "condition": ["비"]}, "hold": ""}
```


## Q17
- 형식: 객관식
- 배점: 5
### 발문
지수네 반 학생 $25$명이 체험 학습을 가기 위해 버스를 탔는데 요금의 총액이 $22{,}700$원이었다. 버스 요금을 교통카드로 지불하면 $800$원이고, 현금으로 지불하면 $1{,}100$원일 때, 교통카드로 지불한 학생 수와 현금으로 지불한 학생 수의 차는?
### 선지
① $3$ ② $4$ ③ $5$ ④ $6$ ⑤ $7$
### 정답
⑤
### 해설
교통카드로 지불한 학생 수를 $x$명, 현금으로 지불한 학생 수를 $y$명이라 하면
$\begin{cases} x + y = 25 \\ 800x + 1100y = 22700 \end{cases}$
둘째 식의 양변을 $100$으로 나누면 $8x + 11y = 227$
첫째 식에서 $x = 25 - y$를 대입하면 $8(25 - y) + 11y = 227 \implies 200 + 3y = 227 \implies 3y = 27 \implies y = 9$
따라서 $x = 16$이므로 두 학생 수의 차는 $16 - 9 = 7$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-WORD_COUNT_AND_COST", "primaryMethod": "학생 수 합 x + y = 25와 요금 합 800x + 1100y = 22700으로 연립방정식을 세워 풀어 차를 구한다.", "decisiveStep": "x = 16, y = 9를 구한 뒤 두 수의 차 16 - 9 = 7을 계산한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "수와 개수", "l4": "개수·가격"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_SYSTEM_OF_EQUATIONS_WORD_PROBLEM_COST", "templateKey": null, "why": "인원수와 요금 합 연립방정식 활용"}, "crossConceptKeys": ["CC_APPLIED_WORD_PROBLEMS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문장에서 두 개의 일차방정식을 세워 연립하고 마지막에 두 해의 차를 구해야 한다.", "level": "중", "item4slot": {"given": ["개수"], "goal": ["차"], "method": ["연립방정식", "대입법"], "condition": ["자연수"]}, "hold": ""}
```


## Q18
- 형식: 객관식
- 배점: 5
### 발문
세 일차방정식 $y = -2x + 15$, $y = \frac{1}{2}x$, $x = 2$의 그래프로 둘러싸인 도형의 넓이는?
### 선지
① $14$ ② $16$ ③ $18$ ④ $20$ ⑤ $22$
### 정답
④
### 해설
$y = -2x + 15$와 $y = \frac{1}{2}x$의 교점은 $-2x + 15 = \frac{1}{2}x \implies \frac{5}{2}x = 15 \implies x = 6,\ y = 3$이므로 $(6, 3)$이다.
$x = 2$와 $y = -2x + 15$의 교점은 $(2, 11)$, $x = 2$와 $y = \frac{1}{2}x$의 교점은 $(2, 1)$이다.
따라서 둘러싸인 삼각형의 밑변의 길이는 $11 - 1 = 10$, 높이는 $6 - 2 = 4$이므로
넓이는 $\frac{1}{2} \times 10 \times 4 = 20$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-TRIANGLE_AREA_THREE_LINES", "primaryMethod": "세 직선의 교점 (6, 3), (2, 11), (2, 1)을 구해 x = 2 위의 밑변 10과 높이 4로 삼각형 넓이를 계산한다.", "decisiveStep": "세 꼭짓점을 모두 구해 밑변 10, 높이 4인 삼각형 넓이 20을 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA", "templateKey": null, "why": "세 일차방정식 그래프로 둘러싸인 삼각형의 넓이"}, "crossConceptKeys": ["CC_INTERSECTION_OF_TWO_GRAPHS", "CC_POLYGON_AREA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 직선의 교점을 각각 구한 뒤 좌표 차로 밑변과 높이를 결정해 넓이를 계산해야 한다.", "level": "중", "item4slot": {"given": ["일차방정식", "삼각형"], "goal": ["넓이"], "method": ["연립방정식", "교점"], "condition": ["교점"]}, "hold": ""}
```


## Q19
- 형식: 객관식
- 배점: 5
### 발문
일차함수 $y = ax + 2$의 그래프가 두 점 $A(2, 18)$, $B(4, 10)$을 이은 선분 $AB$와 만나도록 하는 자연수 $a$의 개수는?
### 선지
① $5$ ② $6$ ③ $7$ ④ $8$ ⑤ $9$
### 정답
③
### 해설
$y = ax + 2$가 점 $A(2, 18)$을 지날 때 $18 = 2a + 2 \implies a = 8$
$y = ax + 2$가 점 $B(4, 10)$을 지날 때 $10 = 4a + 2 \implies a = 2$
선분 $AB$와 만나려면 기울기 $a$가 두 경계값 사이인 $2 \le a \le 8$이어야 하므로
자연수 $a$는 $2, 3, 4, 5, 6, 7, 8$의 $7$개이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-SLOPE_RANGE_SEGMENT_INTERSECT", "primaryMethod": "y = ax + 2가 선분 양 끝점 A(2, 18), B(4, 10)을 지날 때의 기울기 8과 2를 구해 사이 범위의 자연수 개수를 센다.", "decisiveStep": "2 <= a <= 8을 만족하는 자연수가 2부터 8까지 7개임을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "선분과 만나는 일차함수 기울기 조건"}, "crossConceptKeys": ["CC_BOUNDARY_VALUE_ANALYSIS"], "conditionKeys": ["COND_NATURAL_NUMBER", "COND_RANGE"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "선분의 양 끝점을 대입해 기울기의 상·하한을 구하고 경계를 포함한 자연수 개수를 세어야 한다.", "level": "상", "item4slot": {"given": ["일차함수", "선분"], "goal": ["개수"], "method": ["대입", "기울기"], "condition": ["자연수"]}, "hold": ""}
```


## Q20
- 형식: 객관식
- 배점: 5
### 발문
두 수 $a, b$에 대하여 연립방정식 $\begin{cases} 3ax - y = 2 - 3a \\ (10 - 2b)x + 2y = b \end{cases}$의 해가 무수히 많을 때, $a + b$의 값은?
### 선지
① $13$ ② $14$ ③ $15$ ④ $16$ ⑤ $17$
### 정답
⑤
### 해설
첫째 식의 양변에 $-2$를 곱하면 $-6ax + 2y = 6a - 4$
해가 무수히 많으려면 이 식이 둘째 식 $(10 - 2b)x + 2y = b$와 일치해야 하므로
$-6a = 10 - 2b$에서 $3a - b = -5 \quad \cdots\cdots \text{㉠}$
$6a - 4 = b$에서 $6a - b = 4 \quad \cdots\cdots \text{㉡}$
㉡에서 ㉠을 빼면 $3a = 9 \implies a = 3$
$a = 3$을 ㉡에 대입하면 $b = 18 - 4 = 14$
$\therefore a + b = 3 + 14 = 17$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-INFINITE_SOLUTIONS_PARAMETERS", "primaryMethod": "y의 계수를 2로 맞춘 뒤 x의 계수와 상수항이 일치한다는 조건으로 a, b에 대한 연립방정식을 세워 푼다.", "decisiveStep": "3a - b = -5와 6a - b = 4를 연립하여 a = 3, b = 14를 구한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해가 특수한 연립방정식", "l4": "계수 조건으로 해의 상태 판단"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "해가 무수히 많은 연립방정식의 미지 계수 결정"}, "crossConceptKeys": ["CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "해가 무수히 많을 조건으로부터 a, b에 대한 새로운 연립방정식을 구성해 풀어야 한다.", "level": "상", "item4slot": {"given": ["연립방정식"], "goal": ["합"], "method": ["가감법"], "condition": ["해가무수히많다"]}, "hold": ""}
```


## Q21
- 형식: 서답형
- 배점: 5
### 발문
[서술형 1] 연립방정식 $\begin{cases} 4x - 3y = 10 \\ 5x - 2y = 16 \end{cases}$의 해를 구하고, 그 풀이 과정을 서술하시오.
### 선지
없음
### 정답
$x = 4,\ y = 2$
### 해설
$\begin{cases} 4x - 3y = 10 \quad \cdots\cdots \text{㉠} \\ 5x - 2y = 16 \quad \cdots\cdots \text{㉡} \end{cases}$
$\text{㉠} \times 2 - \text{㉡} \times 3$을 하면
$(8x - 6y) - (15x - 6y) = 20 - 48$
$-7x = -28 \implies x = 4$
$x = 4$를 ㉠에 대입하면 $16 - 3y = 10 \implies -3y = -6 \implies y = 2$
따라서 구하는 해는 $x = 4,\ y = 2$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-ELIMINATION_BOTH_SCALE", "primaryMethod": "첫째 식에 2, 둘째 식에 3을 곱해 y를 소거하여 x = 4를 구한 뒤 대입해 y = 2를 구한다.", "decisiveStep": "-7x = -28에서 x = 4를 얻고 y = 2를 구한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "가감법"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_SYSTEM_OF_EQUATIONS_ADDITION_SUBTRACTION_METHOD", "templateKey": null, "why": "가감법을 이용한 연립방정식 서답형 풀이"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 식의 계수를 최소공배수로 맞추어 소거하는 기본 가감법 문항이다.", "level": "하", "item4slot": {"given": ["연립방정식"], "goal": ["해"], "method": ["가감법", "대입"], "condition": ["해"]}, "hold": ""}
```


## Q22
- 형식: 서답형
- 배점: 7
### 발문
[서술형 2] 방향제의 양이 일정한 속력으로 줄어들어 개봉한 지 $15$일 후에는 $420\text{ mL}$, 개봉한 지 $25$일 후에는 $400\text{ mL}$가 된다고 한다.
(1) 이 방향제를 개봉한 지 $x$일 후의 방향제의 양을 $y\text{ mL}$라고 할 때, $y$를 $x$에 대한 식으로 나타내고 그 풀이 과정을 서술하시오. [5점]
(2) 방향제의 양이 $150\text{ mL}$가 되는 것은 개봉한 지 며칠 후인지 구하고, 그 풀이 과정을 일차함수의 식을 활용하여 서술하시오. [2점]
### 선지
없음
### 정답
(1) $y = -2x + 450$, (2) $150$일 후
### 해설
(1) 두 점 $(15, 420), (25, 400)$을 지나므로 기울기는
$\frac{400 - 420}{25 - 15} = \frac{-20}{10} = -2$
$y = -2x + b$에 $(15, 420)$을 대입하면 $420 = -30 + b \implies b = 450$
따라서 $y = -2x + 450$이다.
(2) $y = 150$을 대입하면 $150 = -2x + 450$
$2x = 300 \implies x = 150$
따라서 개봉한 지 $150$일 후이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-WORD_TWO_POINTS_LINEAR_MODEL", "primaryMethod": "주어진 두 시점의 양 (15, 420), (25, 400)으로 일차함수 식 y = -2x + 450을 세운 뒤 y = 150일 때의 x를 구한다.", "decisiveStep": "기울기 -2와 y절편 450으로 식을 세우고 150 = -2x + 450에서 x = 150을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "일차함수 활용 식 세우기 및 함숫값 역산"}, "crossConceptKeys": ["CC_APPLIED_WORD_PROBLEMS", "CC_SLOPE_FORMULA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실생활 문장에서 두 점 좌표를 추출해 일차함수 식을 세우고 목표값에 해당하는 x를 구해야 한다.", "level": "중", "item4slot": {"given": ["일차함수", "점"], "goal": ["일차함수"], "method": ["기울기", "대입"], "condition": ["일차함수"]}, "hold": ""}
```


## Q23
- 형식: 서답형
- 배점: 8
### 발문
[서술형 3] 수 $a, b$ (단, $a > 0$)에 대하여 일차방정식 $(a + 3)x + 5y - b = 0$의 그래프가 점 $(a, 3a)$를 지난다고 한다. 세 일차방정식 $(a + 3)x + 5y - b = 0$, $x = a$, $y = -9$의 그래프로 둘러싸인 도형의 넓이가 $180$일 때, $a, b$의 값을 각각 구하고자 한다.
(1) 일차방정식 $y = -9$의 그래프가 두 일차방정식 $(a + 3)x + 5y - b = 0$, $x = a$의 그래프와 만나는 교점을 각각 $A, B$라고 하자. 이때 선분 $AB$의 길이를 구하고, 그 풀이 과정을 기울기를 이용하여 서술하시오. [4점]
(2) (1)의 결과를 이용하여 $a, b$의 값을 구하고, 그 풀이 과정을 서술하시오. [4점]
### 선지
없음
### 정답
$\overline{AB} = 15,\ a = 5,\ b = 115$
### 해설
(1) 일차방정식 $(a + 3)x + 5y - b = 0$을 $y$에 대하여 정리하면 $y = -\frac{a + 3}{5}x + \frac{b}{5}$이므로 기울기는 $-\frac{a + 3}{5}$이다.
이 그래프가 두 점 $P(a, 3a)$와 $A(x_{A}, -9)$를 지나므로 기울기 공식에 의해
$\frac{-9 - 3a}{x_{A} - a} = -\frac{a + 3}{5}$
$\frac{-3(a + 3)}{x_{A} - a} = -\frac{a + 3}{5}$
$a > 0$이므로 $a + 3 \ne 0$이고 양변을 $-(a + 3)$으로 나누면 $\frac{3}{x_{A} - a} = \frac{1}{5} \implies x_{A} - a = 15$
점 $B$의 좌표는 $(a, -9)$이므로 $\overline{AB} = |x_{A} - a| = 15$이다.
(2) 세 직선으로 둘러싸인 삼각형 $PAB$에서 밑변을 $\overline{AB} = 15$라 하면 높이는 $P(a, 3a)$와 $B(a, -9)$ 사이의 거리 $3a - (-9) = 3a + 9$이다.
넓이가 $180$이므로 $\frac{1}{2} \times 15 \times (3a + 9) = 180$
$3a + 9 = 24 \implies 3a = 15 \implies a = 5$
점 $(5, 15)$가 $(a + 3)x + 5y - b = 0$ 위의 점이므로 $8 \times 5 + 5 \times 15 - b = 0 \implies b = 40 + 75 = 115$
$\therefore \overline{AB} = 15,\ a = 5,\ b = 115$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-SLOPE_CANCELLATION_AREA_PARAMETERS", "primaryMethod": "기울기 -(a+3)/5와 y변화량 -3(a+3)의 비로 선분 AB 길이 15를 구한 뒤 삼각형 넓이 180으로 a = 5, 지나는 점 (5, 15) 대입으로 b = 115를 구한다.", "decisiveStep": "기울기 식에서 (a + 3)이 약분되어 선분 AB의 길이가 상수 15로 결정됨을 보인다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA", "templateKey": null, "why": "기울기와 도형 넓이를 결합한 미지 계수 결정 서술형"}, "crossConceptKeys": ["CC_SLOPE_FORMULA", "CC_POLYGON_AREA", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자가 포함된 직선의 기울기 식에서 (a+3)을 약분해 밑변을 먼저 확정하고 넓이 조건과 대입을 연결해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["일차방정식", "점", "넓이"], "goal": ["길이", "상수"], "method": ["기울기", "대입"], "condition": ["양수"]}, "hold": ""}
```