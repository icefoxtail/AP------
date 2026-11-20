```json:exam
{"stem": "24_승평중_1학기_기말_중2_유사", "sourceArchiveFile": "original/middle/m2/1final/24_승평중_1학기_기말_중2_기출.js", "examFolder": "1final", "grade": "중2", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-15"}
```


## Q01
- 형식: 객관식
- 배점: 4
### 발문
다음 중 등식 $(a-3)x+3y-1=4x-2y+5$가 미지수가 $2$개인 일차방정식일 때, 상수 $a$가 될 수 없는 값을 구하면?
### 선지
① $3$ ② $4$ ③ $5$ ④ $6$ ⑤ $7$
### 정답
⑤
### 해설
주어진 등식의 모든 항을 좌변으로 이항하여 정리하면
$(a-3)x - 4x + 3y + 2y - 1 - 5 = 0$
$(a-7)x + 5y - 6 = 0$
미지수가 $2$개인 일차방정식이 되려면 $x$의 계수가 $0$이 아니어야 하므로
$a-7 \ne 0$, 즉 $a \ne 7$
따라서 상수 $a$가 될 수 없는 값은 $7$이므로 정답은 ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-TWO_VAR_LINEAR_EQ_CONDITION", "primaryMethod": "모든 항을 좌변으로 이항해 (a - 7)x + 5y - 6 = 0으로 정리한 뒤 x의 계수가 0이 되지 않는 조건을 구한다.", "decisiveStep": "동류항 정리 후 x의 계수 a - 7 != 0에서 a != 7을 얻는다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수가 2개인 일차방정식이 되기 위한 계수 조건"}, "crossConceptKeys": ["CC_LINEAR_EQUATIONS_TWO_VARIABLES", "CC_ALGEBRAIC_SIMPLIFICATION"], "conditionKeys": ["COND_NONZERO"], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "식을 이항해 정리한 뒤 미지수 x의 계수가 0이 아님을 바로 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차방정식"], "goal": ["계수"], "method": ["동류항"], "condition": ["미지수"]}, "hold": "원본 JS에 문항별 배점이 없어 객관식 4점/서답형 5점(총 100점)으로 배정함"}
```


## Q02
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases} ax+y=8 \\ 3x-by=4 \end{cases}$의 해가 $(2, 2)$이고, 이 해는 일차방정식 $ax+by=c$도 만족할 때, $c$의 값을 구하면? (단, $a$, $b$, $c$는 상수)
### 선지
① $0$ ② $-8$ ③ $8$ ④ $-4$ ⑤ $4$
### 정답
③
### 해설
$x=2$, $y=2$를 연립방정식의 두 식에 각각 대입하면
$2a+2=8 \implies 2a=6 \implies a=3$
$3(2)-2b=4 \implies 6-2b=4 \implies 2b=2 \implies b=1$
$a=3$, $b=1$과 $x=2$, $y=2$를 $ax+by=c$에 대입하면
$c = 3(2) + 1(2) = 6 + 2 = 8$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-SOLUTION_COEFFICIENTS_TO_THIRD_EQ", "primaryMethod": "공통 해 (2, 2)를 연립방정식에 대입해 a = 3, b = 1을 구한 뒤 ax + by = c에 대입해 c를 구한다.", "decisiveStep": "앞의 두 식에서 a = 3, b = 1을 먼저 결정한 다음 세 번째 식에 대입한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주어진 해로 계수 a, b를 구한 뒤 추가 식의 상수항 결정"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS", "CC_COEFFICIENT_DETERMINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "해 (2, 2)로 두 계수 a, b를 먼저 구하고 그 값을 세 번째 식에 다시 대입해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식", "해"], "goal": ["계수"], "method": ["대입"], "condition": ["해"]}, "hold": ""}
```


## Q03
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases}0.5x-0.2y=1.1\\0.2x+0.3y=1.2\end{cases}$의 해가 $x=a$, $y=b$일 때, $a+b$의 값을 구하면?
### 선지
① $4$ ② $5$ ③ $6$ ④ $\dfrac{11}{2}$ ⑤ $-\dfrac{1}{2}$
### 정답
②
### 해설
두 식의 양변에 각각 $10$을 곱하면
$\begin{cases}5x-2y=11 \\ 2x+3y=12\end{cases}$
첫째 식에 $3$, 둘째 식에 $2$를 곱하면
$\begin{cases}15x-6y=33 \\ 4x+6y=24\end{cases}$
두 식을 변끼리 더하면 $19x=57 \implies x=3$
$x=3$을 $2x+3y=12$에 대입하면 $6+3y=12 \implies 3y=6 \implies y=2$
따라서 $a=3$, $b=2$이므로 $a+b = 3+2 = 5$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-DECIMAL_COEFF_ELIMINATION", "primaryMethod": "두 소수 계수 식에 10을 곱해 정수 계수로 바꾼 뒤 가감법으로 x = 3, y = 2를 구한다.", "decisiveStep": "15x - 6y = 33과 4x + 6y = 24를 더해 y를 소거하고 x = 3을 구한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "복잡한 꼴의 연립방정식", "l4": "분수·소수가 있는 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "소수 계수 연립방정식 풀이"}, "crossConceptKeys": ["CC_DECIMAL_COEFFICIENTS", "CC_LINEAR_COMBINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "양변에 10을 곱해 계수를 정수로 정리한 뒤 최소공배수를 맞춰 가감법을 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식"], "goal": ["해"], "method": ["가감법"], "condition": ["연립방정식"]}, "hold": ""}
```


## Q04
- 형식: 객관식
- 배점: 4
### 발문
다음은 연립방정식 $\begin{cases}\text{① } x-2y=3\\\text{② } 3x+y=16\end{cases}$을 풀기 위한 설명이다. 옳은 것을 고르면?
### 선지
① $x$를 소거하기 위하여 $\text{①}\times 3+\text{②}$를 하였다. ② $y$를 소거하기 위하여 $\text{①}-\text{②}\times 2$를 하였다. ③ 대입법으로 풀기 위해 $\text{①}$식을 $x=2y-3$으로 변형하여 $\text{②}$식에 대입하였다. ④ $x=5$이다. ⑤ $y=-1$이다.
### 정답
④
### 해설
① $x$의 계수의 부호가 같으므로 $\text{①}\times 3 - \text{②}$를 해야 한다.
② $y$의 계수의 부호가 다르므로 $\text{①} + \text{②}\times 2$를 해야 한다.
③ $\text{①}$식을 $x$에 대하여 풀면 $x = 2y+3$이다.
④, ⑤ $x = 2y+3$을 $\text{②}$식에 대입하면 $3(2y+3)+y=16 \implies 7y=7 \implies y=1$, $x=5$이다.
따라서 옳은 설명은 ④이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-METHOD_ANALYSIS_AND_SOLUTION", "primaryMethod": "가감법의 부호 조건과 대입법 변형 식을 검증하고 실제 해 (5, 1)을 구해 옳은 선지를 고른다.", "decisiveStep": "소거 연산의 부호 오류(①, ②)와 이항 부호 오류(③)를 거르고 해 x = 5, y = 1을 확인한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "대입법"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "연립방정식 풀이 과정과 해 판별"}, "crossConceptKeys": ["CC_LINEAR_COMBINATION", "CC_SUBSTITUTION_IN_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "가감법·대입법 과정의 옳고 그름을 각각 따지고 해까지 구해 대조해야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식"], "goal": ["해"], "method": ["가감법", "대입법"], "condition": ["연립방정식"]}, "hold": ""}
```


## Q05
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases}4x+3y=12\\ ax+by=12\end{cases}$에서 각 일차방정식의 그래프의 교점이 없을 때, 상수 $a$, $b$에 대하여 다음 중 $b$의 값이 될 수 없는 것을 고르면?
### 선지
① $2$ ② $3$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
②
### 해설
두 일차방정식의 그래프의 교점이 없으려면 두 직선이 서로 평행하고 일치하지 않아야 한다.
즉, $\dfrac{a}{4} = \dfrac{b}{3} \ne \dfrac{12}{12}$이어야 하므로
$\dfrac{b}{3} \ne 1$, 즉 $b \ne 3$
만약 $b=3$이면 $\dfrac{a}{4}=1$에서 $a=4$가 되어 두 직선이 일치하므로 교점이 무수히 많다.
따라서 $b$의 값이 될 수 없는 것은 ②이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-NO_INTERSECTION_COEFF_CONDITION", "primaryMethod": "두 직선의 교점이 없을 조건 a/4 = b/3 != 12/12로부터 b != 3임을 도출한다.", "decisiveStep": "상수항의 비 12/12 = 1과 같아지는 b = 3이면 두 직선이 일치함을 구분한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "두 직선의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 일차방정식 그래프의 교점이 없을 계수 조건"}, "crossConceptKeys": ["CC_COEFFICIENT_RATIOS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행 조건(기울기 같음)뿐 아니라 불일치 조건(y절편 다름)까지 함께 판단해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["연립방정식"], "goal": ["계수"], "method": ["비율", "평행"], "condition": ["교점"]}, "hold": ""}
```


## Q06
- 형식: 객관식
- 배점: 4
### 발문
민지와 오빠가 $40\text{ km}$ 떨어진 두 지점에서 서로를 향하여 출발하였다. 오빠는 시속 $6\text{ km}$로 자전거를 타고 민지는 시속 $4\text{ km}$로 걸어서 한 지점에서 만났을 때, 오빠는 민지보다 몇 $\text{km}$를 더 이동하였는지 구하면?
### 선지
① $8\text{ km}$ ② $10\text{ km}$ ③ $12\text{ km}$ ④ $16\text{ km}$ ⑤ $24\text{ km}$
### 정답
①
### 해설
만날 때까지 걸린 시간을 $t$시간이라 하면 오빠와 민지가 이동한 거리의 합이 $40        ext{ km}$이므로
$6t + 4t = 40$
$10t = 40 \implies t = 4$
오빠가 이동한 거리는 $6 \times 4 = 24        ext{ km}$, 민지가 이동한 거리는 $4 \times 4 = 16        ext{ km}$이므로
오빠가 민지보다 더 이동한 거리는 $24 - 16 = 8        ext{ km}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-OPPOSITE_DIRECTION_MEETING_DISTANCE", "primaryMethod": "만날 때까지 걸린 시간 t에 대해 거리의 합 6t + 4t = 40을 풀어 t = 4를 구한 뒤 두 거리의 차를 계산한다.", "decisiveStep": "t = 4를 구한 뒤 오빠의 이동 거리 24 km와 민지의 이동 거리 16 km의 차이를 구한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "속력·시간·거리", "l4": "마주가기·따라가기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "서로 마주 보고 출발해 만날 때 이동 거리 차이"}, "crossConceptKeys": ["CC_SPEED_DISTANCE_TIME"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "만날 때까지 걸린 시간을 먼저 구하고 각자의 이동 거리를 계산해 차이를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["거리", "속력"], "goal": ["거리"], "method": ["방정식"], "condition": ["거리"]}, "hold": ""}
```


## Q07
- 형식: 객관식
- 배점: 4
### 발문
어느 중학교의 작년 전체 학생 수는 $600$명이었다. 올해는 작년에 비해 남학생 수는 $10\%$ 감소하고 여학생 수는 $20\%$ 증가하여 전체 학생 수가 $630$명이 되었다. 올해 남학생의 수를 구하면?
### 선지
① $240$명 ② $255$명 ③ $270$명 ④ $300$명 ⑤ $360$명
### 정답
③
### 해설
작년 남학생 수를 $x$명, 작년 여학생 수를 $y$명이라 하면
$\begin{cases}x+y=600 \\ -0.1x+0.2y=30\end{cases}$
둘째 식에 $10$을 곱하면 $-x+2y=300$
첫째 식과 더하면 $3y=900 \implies y=300$, 따라서 $x=300$
올해 남학생 수는 작년보다 $10\%$ 감소하였으므로
$300 \times \left(1 - \dfrac{10}{100}\right) = 300 \times 0.9 = 270$명
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD", "conceptClusterKey": "M2-03-PERCENT_CHANGE_POPULATION", "primaryMethod": "작년 남녀 학생 수 x, y로 전체 수와 증감량 연립방정식을 세워 x = 300을 구한 뒤 0.9를 곱해 올해 남학생 수를 구한다.", "decisiveStep": "증감량 식 -0.1x + 0.2y = 30으로 작년 남학생 수 300명을 구한 뒤 올해 수 270명으로 환산한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "농도·비율", "l4": "증감률"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "작년·올해 학생 수 증감률 연립방정식 활용"}, "crossConceptKeys": ["CC_SIMULTANEOUS_LINEAR_EQUATIONS", "CC_APPLIED_WORD_PROBLEMS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "작년 학생 수를 미지수로 놓고 증감 식을 세운 뒤 마지막에 올해 학생 수로 다시 환산해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["비율"], "goal": ["미지수"], "method": ["연립방정식", "가감법"], "condition": ["비율"]}, "hold": ""}
```


## Q08
- 형식: 객관식
- 배점: 4
### 발문
다음 <보기> 중에서 $y$가 $x$의 함수가 아닌 것은 몇 개인가?


<보기>
(가) 자연수 $x$의 배수 $y$
(나) 절댓값이 자연수 $x$인 수 $y$
(다) 약수의 개수가 $x$개인 자연수 $y$
(라) 자연수 $x$를 $7$로 나누었을 때의 나머지 $y$
(마) $120\text{ km}$를 시속 $x\text{ km}$로 일정하게 달릴 때, 걸린 시간 $y$시간
(바) 가로의 길이가 $x\text{ cm}$이고, 넓이가 $18\text{ cm}^{2}$인 직사각형의 세로의 길이 $y\text{ cm}$
### 선지
① 0개 ② 1개 ③ 2개 ④ 3개 ⑤ 4개
### 정답
④
### 해설
(가) 하나의 $x$에 배수 $y$가 무수히 많이 대응하므로 함수가 아니다.
(나) $|y|=x$에서 $y=x$ 또는 $y=-x$로 $2$개 대응하므로 함수가 아니다.
(다) 예를 들어 $x=2$일 때 소수 $y=2, 3, 5, \dots$ 등 여러 개가 대응하므로 함수가 아니다.
(라) 나머지는 $0$부터 $6$까지의 값 중 하나로 유일하게 정해지므로 함수이다.
(마) $y=\dfrac{120}{x}$로 하나씩 정해지므로 함수이다.
(바) $y=\dfrac{18}{x}$로 하나씩 정해지므로 함수이다.
따라서 함수가 아닌 것은 (가), (나), (다)의 $3$개이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-COUNT_NON_FUNCTIONS", "primaryMethod": "6개의 대응 관계 각각에 대해 하나의 x에 y가 유일하게 대응하는지 확인한다.", "decisiveStep": "(가), (나), (다)에서 하나의 x에 복수의 y가 대응하는 반례를 찾아 3개로 판별한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION", "templateKey": null, "why": "여러 조건 중 함수가 아닌 것의 개수 판별"}, "crossConceptKeys": ["CC_CLASSIFICATION", "CC_COUNTEREXAMPLE_CONDITION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "6개의 서로 다른 수학·실생활 문장에 함수의 정의를 일일이 적용해 개수를 세는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["함수"], "goal": ["함수"], "method": ["조건"], "condition": ["자연수"]}, "hold": ""}
```


## Q09
- 형식: 객관식
- 배점: 4
### 발문
함수 $f(x)=\dfrac{x}{4}$에 대하여 $f(a)=6$, $f(20)=b$일 때, $a-b$의 값을 구하면?
### 선지
① $17$ ② $19$ ③ $21$ ④ $23$ ⑤ $25$
### 정답
②
### 해설
$f(a) = \dfrac{a}{4} = 6 \implies a = 24$
$b = f(20) = \dfrac{20}{4} = 5$
따라서 $a-b = 24 - 5 = 19$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-FUNCTION_VALUE_AND_INVERSE_EVAL", "primaryMethod": "f(a) = 6에서 a = 24를 구하고 f(20) = b에서 b = 5를 구해 a - b를 계산한다.", "decisiveStep": "a/4 = 6에서 a = 24, 20/4 = 5에서 b = 5를 각각 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "함숫값 조건을 이용한 미지수 및 함숫값 계산"}, "crossConceptKeys": ["CC_FUNCTION_VALUE"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함숫값 식 f(x) = x/4에 a와 20을 바로 대입해 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["함수"], "goal": ["함숫값"], "method": ["대입"], "condition": ["함수"]}, "hold": ""}
```


## Q10
- 형식: 객관식
- 배점: 4
### 발문
다음 <보기>에 해당하는 일차함수의 그래프에 대한 설명으로 옳지 않은 것은?


<보기>
(가) $y=3x+4$  (나) $y=-3x-2$
(다) $y=-\dfrac{2}{3}x+2$  (라) $y=3x-2$
### 선지
① 오른쪽 위로 향하는 직선은 (가), (라)이다. ② 제2사분면을 지나지 않는 그래프는 (라)이다. ③ (다)의 그래프의 $x$절편은 $3$이고, $y$절편은 $2$이다. ④ $x$의 값이 $2$만큼 증가할 때, $y$의 값이 $6$만큼 감소하는 그래프는 (나)이다. ⑤ (가)의 그래프는 (라)의 그래프를 $y$축의 방향으로 $4$만큼 평행이동한 직선이다.
### 정답
⑤
### 해설
① (가), (라)는 기울기가 $3>0$이므로 오른쪽 위로 향한다. (참)
② (라)는 기울기가 $3>0$이고 $y$절편이 $-2<0$이므로 제1, 3, 4사분면을 지나 제2사분면을 지나지 않는다. (참)
③ (다)에서 $y=0$이면 $x=3$, $x=0$이면 $y=2$이다. (참)
④ 기울기가 $\dfrac{-6}{2}=-3$인 직선은 (나)이다. (참)
⑤ (라) $y=3x-2$를 $y$축의 방향으로 $6$만큼 평행이동해야 (가) $y=3x+4$가 된다. (거짓)
따라서 옳지 않은 것은 ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-GRAPH_PROPERTIES_MULTIPLE_CHOICE", "primaryMethod": "네 일차함수의 기울기와 절편을 구해 증가·감소, 사분면, 평행이동에 관한 5개 설명의 참·거짓을 판별한다.", "decisiveStep": "(라) y = 3x - 2에서 (가) y = 3x + 4로의 y축 평행이동량이 4 - (-2) = 6임을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "일차함수 그래프의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "여러 일차함수 그래프 성질 종합 판별"}, "crossConceptKeys": ["CC_SLOPE_AND_INTERCEPT", "CC_QUADRANTS", "CC_PARALLEL_TRANSLATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기, 절편, 사분면, 평행이동 등 여러 성질을 네 식에 대조해 오류를 찾는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차함수"], "goal": ["그래프"], "method": ["기울기", "평행이동"], "condition": ["일차함수"]}, "hold": ""}
```


## Q11
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y=ax+b$의 그래프가 오른쪽 아래로 향하고 $y$축과 원점 아래에서 만날 때, 일차함수 $y=\dfrac{b}{a}x-b$의 그래프가 지나지 않는 사분면을 구하면? (단, $a$, $b$는 상수)
### 선지
① 제1사분면 ② 제2사분면 ③ 제3사분면 ④ 제4사분면 ⑤ 제3, 4사분면
### 정답
④
### 해설
$y=ax+b$의 그래프가 오른쪽 아래로 향하므로 $a<0$이고,
$y$축과 원점 아래에서 만나므로 $y$절편 $b<0$이다.
따라서 $y=\dfrac{b}{a}x-b$에서
기울기 $\dfrac{b}{a} > 0$, $y$절편 $-b > 0$
기울기가 양수이고 $y$절편이 양수인 직선은 제1, 2, 3사분면을 지나므로 제4사분면을 지나지 않는다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "11", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-QUADRANT_FROM_TRANSFORMED_SIGNS", "primaryMethod": "원래 직선 조건에서 a < 0, b < 0을 구한 뒤 새 일차함수의 기울기 b/a > 0과 y절편 -b > 0의 부호로 사분면을 판별한다.", "decisiveStep": "a < 0, b < 0으로부터 b/a > 0과 -b > 0을 추론해 제4사분면을 지나지 않음을 보인다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "증가·감소"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_QUADRANT_CONDITION", "templateKey": null, "why": "계수 부호 추론 후 새 직선이 지나지 않는 사분면"}, "crossConceptKeys": ["CC_SLOPE_SIGN", "CC_QUADRANTS"], "conditionKeys": ["COND_NEGATIVE", "COND_POSITIVE"], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원래 직선의 성질로 a, b 부호를 정한 뒤 변형된 계수 b/a, -b의 부호로 사분면을 판단하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차함수", "부호"], "goal": ["그래프"], "method": ["기울기", "y절편"], "condition": ["부호"]}, "hold": ""}
```


## Q12
- 형식: 객관식
- 배점: 4
### 발문
두 점 $(0, -2)$, $(4, 0)$을 지나는 직선과 평행하고, $x$절편이 $6$인 직선을 그래프로 하는 일차함수의 식이 $y=ax+b$일 때, $ab$의 값을 구하면? (단, $a$, $b$는 상수)
### 선지
① $-\dfrac{3}{2}$ ② $-1$ ③ $0$ ④ $1$ ⑤ $\dfrac{3}{2}$
### 정답
①
### 해설
두 점 $(0, -2)$, $(4, 0)$을 지나는 직선의 기울기는
$\dfrac{0-(-2)}{4-0} = \dfrac{2}{4} = \dfrac{1}{2}$
평행한 직선의 기울기는 같으므로 $a = \dfrac{1}{2}$
$y=\dfrac{1}{2}x+b$의 $x$절편이 $6$이므로 $(6, 0)$을 대입하면
$0 = \dfrac{1}{2}(6) + b \implies 3 + b = 0 \implies b = -3$
따라서 $ab = \dfrac{1}{2} \times (-3) = -\dfrac{3}{2}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "12", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-PARALLEL_SLOPE_AND_X_INTERCEPT", "primaryMethod": "두 점 (0, -2), (4, 0)에서 기울기 a = 1/2을 구한 뒤 x절편 6을 대입해 b = -3을 구한다.", "decisiveStep": "평행 조건으로 기울기 a = 1/2을 얻고 (6, 0)을 대입해 y절편 b = -3을 확정한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION", "templateKey": null, "why": "평행 조건과 x절편으로 일차함수 계수 구하기"}, "crossConceptKeys": ["CC_SLOPE_FORMULA", "CC_X_INTERCEPT"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 점으로 기울기를 먼저 구하고 x절편 조건을 이용해 y절편까지 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["점", "x절편"], "goal": ["계수"], "method": ["기울기", "평행"], "condition": ["평행"]}, "hold": ""}
```


## Q13
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y=-\dfrac{1}{4}x+b$의 그래프를 $y$축의 방향으로 $5$만큼 평행이동하면 점 $(8, 4)$를 지난다. 이때 상수 $b$의 값을 구하면?
### 선지
① $-1$ ② $0$ ③ $1$ ④ $2$ ⑤ $3$
### 정답
③
### 해설
$y=-\dfrac{1}{4}x+b$의 그래프를 $y$축의 방향으로 $5$만큼 평행이동한 식은
$y = -\dfrac{1}{4}x + b + 5$
이 그래프가 점 $(8, 4)$를 지나므로
$4 = -\dfrac{1}{4}(8) + b + 5$
$4 = -2 + b + 5$
$4 = b + 3 \implies b = 1$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-VERTICAL_TRANSLATION_FIND_INTERCEPT", "primaryMethod": "y축 방향으로 5만큼 평행이동한 식 y = -(1/4)x + b + 5에 점 (8, 4)를 대입해 b를 구한다.", "decisiveStep": "4 = -2 + b + 5에서 b = 1을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "그래프 그리기"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION", "templateKey": null, "why": "y축 평행이동 후 지나는 점으로 상수항 구하기"}, "crossConceptKeys": ["CC_PARALLEL_TRANSLATION", "CC_POINT_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 식에 5를 더한 뒤 주어진 점 (8, 4)를 바로 대입해 푸는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일차함수", "점"], "goal": ["계수"], "method": ["평행이동", "대입"], "condition": ["그래프"]}, "hold": ""}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
$1\text{ L}$에 $15\text{ km}$를 가는 어떤 자동차의 연료 탱크에 연료를 가득 채운 후, 일정한 속력으로 주행하였더니 $900\text{ km}$를 주행한 후에 연료가 완전히 소모되었다. 이 자동차의 연료 탱크에 연료를 가득 채운 후, $x\text{ km}$ 주행하였을 때 남은 연료의 양을 $y\text{ L}$라고 하자. 남은 연료가 $35\text{ L}$일 때, 이 자동차가 주행한 거리를 구하면?
### 선지
① $375\text{ km}$ ② $400\text{ km}$ ③ $425\text{ km}$ ④ $450\text{ km}$ ⑤ $475\text{ km}$
### 정답
①
### 해설
가득 채운 연료의 양은 $\dfrac{900}{15} = 60        ext{ L}$이다.
$1        ext{ km}$ 주행할 때마다 $\dfrac{1}{15}        ext{ L}$의 연료를 사용하므로
$y = 60 - \dfrac{1}{15}x$
남은 연료가 $35        ext{ L}$일 때 $y=35$를 대입하면
$35 = 60 - \dfrac{1}{15}x$
$\dfrac{1}{15}x = 25 \implies x = 375$
따라서 주행한 거리는 $375        ext{ km}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-FUEL_CONSUMPTION_LINEAR_WORD", "primaryMethod": "총 연료량 60 L와 1 km당 소모량 1/15 L로 y = 60 - x/15를 세운 뒤 y = 35일 때 x를 구한다.", "decisiveStep": "900/15 = 60 L를 먼저 구해 일차함수식 y = 60 - x/15를 완성한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주행 거리에 따른 남은 연료량 일차함수 문장제"}, "crossConceptKeys": ["CC_RATE_OF_CHANGE", "CC_ALGEBRAIC_MODELING"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "초기 연료량을 먼저 계산하고 단위 거리당 감소율로 식을 세워 방정식을 푸는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["거리", "비율"], "goal": ["거리"], "method": ["일차함수", "대입"], "condition": ["비율"]}, "hold": ""}
```


## Q15
- 형식: 객관식
- 배점: 4
### 발문
다음 직선의 그래프가 함수의 그래프라고 할 수 없는 것은?
### 선지
① 기울기가 $2$인 직선의 방정식 ② 두 점 $(1, -3)$, $(-2, 5)$를 지나는 직선의 방정식 ③ 두 점 $(3, -2)$, $(3, 4)$를 지나는 직선의 방정식 ④ $x$축에 평행하고 점 $\left(2, -\dfrac{3}{2}\right)$를 지나는 직선의 방정식 ⑤ $y$축에 수직이고 점 $\left(-\dfrac{1}{2}, \dfrac{1}{3}\right)$을 지나는 직선의 방정식
### 정답
③
### 해설
③ 두 점 $(3, -2)$, $(3, 4)$를 지나는 직선은 $x=3$으로 $y$축에 평행한 직선이다.
이는 $x=3$ 하나의 값에 $y$의 값이 무수히 많이 대응하므로 함수의 그래프가 아니다.
①, ②, ④, ⑤는 모두 $x$의 값 하나에 $y$의 값이 하나씩 대응하므로 함수의 그래프이다.
따라서 정답은 ③이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_BASIC", "conceptClusterKey": "M2-04-VERTICAL_LINE_NOT_FUNCTION", "primaryMethod": "각 조건이 나타내는 직선 중 y축에 평행한 직선 x = 상수 꼴을 찾아 함수가 아님을 판별한다.", "decisiveStep": "③에서 두 점의 x좌표가 모두 3으로 같아 직선 x = 3이 됨을 포착한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "x축·y축에 평행한 직선"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "직선의 방정식 중 함수가 아닌 수직선 판별"}, "crossConceptKeys": ["CC_EQUATIONS_PARALLEL_TO_AXES", "CC_CLASSIFICATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x축 평행(y = k)은 함수이고 y축 평행(x = k)은 함수가 아님을 두 점의 x좌표 비교로 판별하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["직선", "점"], "goal": ["함수"], "method": ["조건"], "condition": ["직선"]}, "hold": ""}
```


## Q16
- 형식: 객관식
- 배점: 4
### 발문
다음 중 점 $(-2, 5)$를 지나고 $y$축에 수직인 직선의 방정식은?
### 선지
① $2x+4=0$ ② $2x-4=0$ ③ $2y+10=0$ ④ $2y-10=0$ ⑤ $-2x+5y=0$
### 정답
④
### 해설
$y$축에 수직인 직선은 $x$축에 평행하므로 $y=k$ 꼴이다.
점 $(-2, 5)$를 지나므로 $y=5$
양변에 $2$를 곱하고 이항하면 $2y-10=0$이므로 정답은 ④이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-HORIZONTAL_LINE_THROUGH_POINT", "primaryMethod": "y축에 수직인 직선의 식이 y = 상수 꼴임을 이용해 점 (-2, 5)의 y좌표로부터 y = 5를 찾는다.", "decisiveStep": "y = 5와 동치인 방정식 2y - 10 = 0을 선택지에서 고른다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "x축·y축에 평행한 직선"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "한 점을 지나고 y축에 수직인 직선의 방정식"}, "crossConceptKeys": ["CC_EQUATIONS_PARALLEL_TO_AXES"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y축 수직 조건에서 y = 5를 바로 세우고 선택지의 동치식을 고르는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["점"], "goal": ["일차방정식"], "method": ["조건"], "condition": ["직선"]}, "hold": ""}
```


## Q17
- 형식: 객관식
- 배점: 4
### 발문
연립방정식 $\begin{cases}3x-ay=4\\ bx+12y=-8\end{cases}$의 해가 무수히 많을 때, 상수 $a$, $b$에 대하여 $ab$의 값을 구하면?
### 선지
① $-12$ ② $12$ ③ $-18$ ④ $36$ ⑤ $-36$
### 정답
⑤
### 해설
연립방정식의 해가 무수히 많으려면 두 식이 같은 직선을 나타내야 하므로 계수의 비가 모두 같아야 한다.
$\dfrac{3}{b} = \dfrac{-a}{12} = \dfrac{4}{-8} = -\dfrac{1}{2}$
$\dfrac{3}{b} = -\dfrac{1}{2} \implies b = -6$
$\dfrac{-a}{12} = -\dfrac{1}{2} \implies a = 6$
따라서 $ab = 6 \times (-6) = -36$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-INFINITE_SOLUTIONS_COEFF_RATIO", "primaryMethod": "해가 무수히 많을 조건 3/b = -a/12 = 4/(-8)을 이용해 a = 6, b = -6을 구한다.", "decisiveStep": "상수항의 비 4/(-8) = -1/2을 기준으로 a와 b를 동시에 결정한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해가 특수한 연립방정식", "l4": "계수 조건으로 해의 상태 판단"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "해가 무수히 많은 연립방정식의 미정계수"}, "crossConceptKeys": ["CC_COEFFICIENT_RATIOS", "CC_SIMULTANEOUS_LINEAR_EQUATIONS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "해가 무수히 많을 계수 비 공식 3/b = -a/12 = 4/(-8)에 바로 대입해 푸는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["연립방정식"], "goal": ["계수"], "method": ["비율"], "condition": ["해"]}, "hold": ""}
```


## Q18
- 형식: 객관식
- 배점: 4
### 발문
두 점 $(3, 0)$, $(2, -2)$를 지나는 직선과 두 점 $(0, -1)$, $(5, -3)$을 지나는 직선의 교점의 좌표를 해로 갖는 연립방정식은?
### 선지
① $\begin{cases}2x+y=-1\\3x-2y=6\end{cases}$ ② $\begin{cases}6x+y=4\\x-y=10\end{cases}$ ③ $\begin{cases}x+5y=-9\\6x+3y=2\end{cases}$ ④ $\begin{cases}-x+3y=7\\x-y=6\end{cases}$ ⑤ $\begin{cases}-2x+y=-6\\2x+5y=-5\end{cases}$
### 정답
⑤
### 해설
두 점 $(3, 0)$, $(2, -2)$를 지나는 직선의 기울기는 $\dfrac{-2-0}{2-3} = 2$이므로
$y = 2(x-3) = 2x-6$, 즉 $-2x+y = -6$
두 점 $(0, -1)$, $(5, -3)$을 지나는 직선의 기울기는 $\dfrac{-3-(-1)}{5-0} = -\dfrac{2}{5}$이고 $y$절편이 $-1$이므로
$y = -\dfrac{2}{5}x - 1$, 양변에 $5$를 곱해 정리하면 $2x+5y = -5$
따라서 구하는 연립방정식은 ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "18", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-TWO_LINES_TO_SYSTEM", "primaryMethod": "각각 주어진 두 점으로 두 직선의 방정식 -2x + y = -6과 2x + 5y = -5를 구해 연립방정식을 완성한다.", "decisiveStep": "분수 계수 식 y = -(2/5)x - 1을 정수 계수 2x + 5y = -5로 변형해 선지와 대조한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "교점과 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 직선으로부터 대응되는 연립방정식 작성"}, "crossConceptKeys": ["CC_SLOPE_FORMULA", "CC_INTERSECTION_OF_TWO_GRAPHS"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 직선의 식을 각각 세우고 ax + by = c 꼴의 정수 계수 형태로 변형해 찾는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["점", "직선"], "goal": ["연립방정식"], "method": ["기울기"], "condition": ["교점"]}, "hold": ""}
```


## Q19
- 형식: 객관식
- 배점: 4
### 발문
세 직선 $3x+y+3=0$, $4x+y+4=0$, $ax+by-1=0$이 삼각형을 만드는 상수 $a$, $b$의 값을 모두 고르면?
### 선지
① $a=2,\ b=-1$ ② $a=1,\ b=-2$ ③ $a=3,\ b=1$ ④ $a=-1,\ b=2$ ⑤ $a=-1,\ b=1$
### 정답
①, ②
### 해설
앞의 두 직선 $y=-3x-3$, $y=-4x-4$의 교점을 구하면
$-3x-3 = -4x-4 \implies x = -1$, $y = 0$이므로 교점은 $(-1, 0)$이다.
세 직선이 삼각형을 만들지 않으려면 세 번째 직선 $ax+by-1=0$이
1) 앞의 두 직선 중 하나와 평행하거나($b \ne 0$일 때 기울기 $-\dfrac{a}{b}=-3$ 또는 $-4$), 또는
2) 교점 $(-1, 0)$을 지나야 한다($-a-1=0 \implies a=-1$).
③ $a=3, b=1$이면 기울기가 $-3$으로 첫째 직선과 평행하다.
④, ⑤ $a=-1$이므로 교점 $(-1, 0)$을 지난다.
①과 ②는 두 조건에 모두 해당하지 않으므로 삼각형을 만든다. 따라서 정답은 ①, ②이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-THREE_LINES_FORMING_TRIANGLE", "primaryMethod": "앞의 두 직선의 교점 (-1, 0)을 구하고 평행 조건과 한 점에서의 만남 조건을 모두 제외해 삼각형 성립 조건을 찾는다.", "decisiveStep": "기울기 -a/b가 -3, -4인 경우와 교점 (-1, 0)을 지나는 a = -1인 경우를 모두 배제한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "두 직선의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "세 직선이 삼각형을 이루기 위한 계수 조건 판별"}, "crossConceptKeys": ["CC_INTERSECTION_OF_TWO_GRAPHS", "CC_SLOPE_AND_INTERCEPT"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 직선이 삼각형을 이루지 않는 두 가지 기하적 경우(평행, 세 직선의 한 점 교차)를 모두 판별해야 하는 4단계 문항이다.", "level": "상", "item4slot": {"given": ["직선"], "goal": ["계수"], "method": ["교점", "평행"], "condition": ["삼각형"]}, "hold": ""}
```


## Q20
- 형식: 객관식
- 배점: 4
### 발문
일차함수 $y=-\dfrac{2}{3}x+4$의 그래프가 $x$축, $y$축과 만나는 점을 각각 $A$, $B$라 하고, 직선 $y=ax$와 만나는 점을 $P$라고 하자. $\triangle BOP$와 $\triangle POA$의 넓이의 비가 $2:1$일 때, 상수 $a$의 값을 구하면? (단, $O$는 원점, 점 $P$는 제1사분면 위의 점이다.)
### 선지
① $-\dfrac{1}{3}$ ② $\dfrac{1}{3}$ ③ $-3$ ④ $3$ ⑤ $\dfrac{2}{3}$
### 정답
②
### 해설
$y=-\dfrac{2}{3}x+4$에서 $x$절편은 $6$, $y$절편은 $4$이므로 $A(6, 0)$, $B(0, 4)$이다.
제1사분면 위의 교점을 $P(t, y)$ ($t>0, y>0$)라 하면
$\triangle BOP$의 넓이는 $\dfrac{1}{2}\times 4\times t = 2t$
$\triangle POA$의 넓이는 $\dfrac{1}{2}\times 6\times y = 3y$
넓이의 비가 $2:1$이므로 $2t : 3y = 2 : 1 \implies 2t = 6y \implies t = 3y$
점 $P(3y, y)$가 $y=-\dfrac{2}{3}x+4$ 위에 있으므로
$y = -\dfrac{2}{3}(3y) + 4 = -2y + 4$
$3y = 4 \implies y = \dfrac{4}{3}$, $t = 3 \times \dfrac{4}{3} = 4$
점 $P\left(4, \dfrac{4}{3}\right)$이 $y=ax$ 위에 있으므로 $a = \dfrac{4/3}{4} = \dfrac{1}{3}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-AREA_RATIO_TO_ORIGIN_LINE_SLOPE", "primaryMethod": "P(t, y)의 좌표로 두 삼각형 BOP, POA의 넓이 비 2t : 3y = 2 : 1에서 t = 3y를 유도해 직선과 연립한다.", "decisiveStep": "넓이 비 조건에서 얻은 t = 3y를 직선 y = -(2/3)x + 4에 대입해 P(4, 4/3)을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "축 절편 삼각형의 넓이 비 조건으로 원점 통과 직선의 기울기 구하기"}, "crossConceptKeys": ["CC_AREA_RATIO", "CC_INTERCEPTS", "CC_POINT_SUBSTITUTION"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절편 구하기, 좌표 미지수 설정, 넓이 비 식 도출, 직선 대입까지 4단계를 연결해야 하는 4단계 문항이다.", "level": "상", "item4slot": {"given": ["일차함수", "비율"], "goal": ["계수"], "method": ["넓이", "대입"], "condition": ["삼각형"]}, "hold": ""}
```


## Q21
- 형식: 서답형
- 배점: 5
### 발문
연립방정식 $\begin{cases}ax-by=5\\ bx-ay=2\end{cases}$을 푸는데 각 일차방정식에서 $a$와 $b$의 값을 바꾸어 풀었더니 해가 $x=2$, $y=1$이 되었다. 다음 물음에 답하시오.
(1) 두 수 $a$와 $b$의 값을 구하는 과정과 답을 서술하시오.
(2) 처음 연립방정식의 해를 구하는 과정과 답을 서술하시오.
### 선지
없음
### 정답
(1) $a=3$, $b=4$ / (2) $x=-1$, $y=-2$
### 해설
(1) $a$와 $b$를 바꾸어 푼 연립방정식은 $\begin{cases}bx-ay=5 \\ ax-by=2\end{cases}$이다.
해가 $x=2$, $y=1$이므로 대입하면
$\begin{cases}2b-a=5 \\ 2a-b=2\end{cases}$
둘째 식에 $2$를 곱하면 $4a-2b=4$이고 첫째 식과 더하면
$3a=9 \implies a=3$
$2(3)-b=2 \implies b=4$
따라서 $a=3$, $b=4$이다.
(2) 처음 연립방정식은 $\begin{cases}3x-4y=5 \\ 4x-3y=2\end{cases}$이다.
첫째 식에 $4$, 둘째 식에 $3$을 곱하면
$\begin{cases}12x-16y=20 \\ 12x-9y=6\end{cases}$
두 식을 빼면 $-7y=14 \implies y=-2$
$3x-4(-2)=5 \implies 3x=-3 \implies x=-1$
따라서 처음 연립방정식의 해는 $x=-1$, $y=-2$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS_LINEAR_EQUATION", "conceptClusterKey": "M2-03-SWAPPED_COEFFICIENTS_SOLVE", "primaryMethod": "a와 b를 바꾼 식에 (2, 1)을 대입해 a = 3, b = 4를 먼저 구한 뒤 원래 연립방정식을 가감법으로 푼다.", "decisiveStep": "바뀐 연립방정식에서 2b - a = 5, 2a - b = 2를 풀어 a, b를 먼저 확정한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "계수를 잘못 바꾸어 푼 연립방정식 바로잡기"}, "crossConceptKeys": ["CC_COEFFICIENT_SWAP", "CC_LINEAR_COMBINATION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "바뀐 식의 해로 a, b에 대한 연립방정식을 한 번 풀고 원래 식의 연립방정식을 한 번 더 풀어야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["연립방정식", "해"], "goal": ["계수", "해"], "method": ["대입", "가감법"], "condition": ["해"]}, "hold": ""}
```


## Q22
- 형식: 서답형
- 배점: 5
### 발문
두 일차함수 $y=ax+4$ ($a>0$), $y=-x+b$의 그래프가 $y$축 위의 점 $A$에서 만나고, 두 일차함수의 그래프와 $x$축으로 둘러싸인 삼각형 $ABC$의 넓이가 $40$이다. 이때 두 상수 $a$, $b$에 대하여 $ab$의 값을 구하는 과정과 답을 서술하시오.
### 선지
없음
### 정답
$1$
### 해설
두 그래프가 $y$축 위의 점 $A$에서 만나므로 $y$절편이 같다.
$y=ax+4$의 $y$절편이 $4$이므로 $A(0, 4)$이고 $b=4$이다.
$y=-x+4$의 $x$절편은 $4$이므로 $C(4, 0)$이라 두면,
$y=ax+4$의 $x$절편은 $-\dfrac{4}{a}$이므로 $B\left(-\dfrac{4}{a}, 0\right)$이다.
$a>0$이므로 $-\dfrac{4}{a} < 0$이고 삼각형 $ABC$의 밑변의 길이는 $4 - \left(-\dfrac{4}{a}\right) = 4+\dfrac{4}{a}$, 높이는 $4$이다.
넓이가 $40$이므로
$\dfrac{1}{2}\left(4+\dfrac{4}{a}\right)\times 4 = 40$
$2\left(4+\dfrac{4}{a}\right) = 40 \implies 4+\dfrac{4}{a} = 20 \implies \dfrac{4}{a} = 16 \implies a = \dfrac{1}{4}$
따라서 $ab = \dfrac{1}{4} \times 4 = 1$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "22", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-TWO_LINES_X_AXIS_AREA_PARAM", "primaryMethod": "y축 위 교점 (0, 4)에서 b = 4를 구하고 두 x절편 사이의 거리를 밑변으로 삼아 넓이 식에서 a를 구한다.", "decisiveStep": "밑변 길이를 4 + 4/a로 표현해 (1/2)*(4 + 4/a)*4 = 40을 풀어 a = 1/4을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA", "templateKey": null, "why": "y축 위 교점과 x축으로 둘러싸인 삼각형 넓이에서 계수 구하기"}, "crossConceptKeys": ["CC_Y_INTERCEPT", "CC_X_INTERCEPT", "CC_POLYGON_AREA"], "conditionKeys": ["COND_POSITIVE"], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y축 교점으로 b를 먼저 구하고 미지수 a를 포함한 x절편으로 밑변을 세워 방정식을 푸는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["일차함수", "넓이"], "goal": ["계수"], "method": ["x절편", "y절편"], "condition": ["삼각형"]}, "hold": ""}
```


## Q23
- 형식: 서답형
- 배점: 5
### 발문
세 직선 $x+2y-10=0$, $2x+y+4=0$, $y-4=0$이 이루는 삼각형의 넓이를 구하는 과정과 답을 서술하시오.
### 선지
없음
### 정답
$12$
### 해설
$y-4=0$에서 $y=4$이다.
$y=4$와 $x+2y-10=0$의 교점은 $x+8-10=0 \implies x=2$이므로 $(2, 4)$
$y=4$와 $2x+y+4=0$의 교점은 $2x+4+4=0 \implies x=-4$이므로 $(-4, 4)$
$x+2y-10=0$과 $2x+y+4=0$의 교점은 $x=10-2y$를 대입하면
$2(10-2y)+y+4=0 \implies 24-3y=0 \implies y=8$
$x=10-2(8)=-6$이므로 교점은 $(-6, 8)$
삼각형의 밑변의 길이는 $2-(-4)=6$, 높이는 $8-4=4$이므로
넓이는 $\dfrac{1}{2}\times 6\times 4 = 12$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-THREE_LINES_AREA_HORIZONTAL", "primaryMethod": "수평선 y = 4와 두 직선의 교점 (2, 4), (-4, 4) 및 두 사선의 교점 (-6, 8)을 구해 넓이를 계산한다.", "decisiveStep": "세 교점 (2, 4), (-4, 4), (-6, 8)을 구해 밑변 6과 높이 4를 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA", "templateKey": null, "why": "세 일차방정식 직선으로 둘러싸인 삼각형의 넓이"}, "crossConceptKeys": ["CC_INTERSECTION_OF_TWO_GRAPHS", "CC_POLYGON_AREA"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 직선의 교점 세 개를 연립방정식으로 구한 뒤 밑변과 높이를 계산해 넓이를 구하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["일차방정식", "직선"], "goal": ["넓이"], "method": ["교점", "연립방정식"], "condition": ["삼각형"]}, "hold": ""}
```


## Q24
- 형식: 서답형
- 배점: 5
### 발문
일차방정식 $3x-2y+4=0$의 그래프를 $y$축 방향으로 $-a$만큼 평행이동한 그래프가 점 $(a, 6)$을 지날 때, 상수 $a$의 값을 구하는 과정과 답을 서술하시오.
### 선지
없음
### 정답
$8$
### 해설
$3x-2y+4=0$을 $y$에 대하여 풀면
$2y = 3x+4 \implies y = \dfrac{3}{2}x + 2$
이 그래프를 $y$축 방향으로 $-a$만큼 평행이동한 직선의 방정식은
$y = \dfrac{3}{2}x + 2 - a$
이 그래프가 점 $(a, 6)$을 지나므로 대입하면
$6 = \dfrac{3}{2}a + 2 - a$
$4 = \dfrac{1}{2}a \implies a = 8$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR_FUNCTION_EQUATION", "conceptClusterKey": "M2-04-STANDARD_FORM_TRANSLATION_PARAM", "primaryMethod": "3x - 2y + 4 = 0을 y = (3/2)x + 2로 고치고 y축 방향으로 -a만큼 이동한 식에 (a, 6)을 대입한다.", "decisiveStep": "6 = (3/2)a + 2 - a에서 (1/2)a = 4를 풀어 a = 8을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "일차방정식의 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT_M2_LINEAR_EQUATION_TO_LINEAR_FUNCTION_STANDARD_FORM", "templateKey": null, "why": "일차방정식을 일차함수로 변형 후 평행이동 및 점 대입"}, "crossConceptKeys": ["CC_PARALLEL_TRANSLATION", "CC_POINT_SUBSTITUTION"], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "표준형 변형, y축 평행이동, 미지수 a를 포함한 점 대입을 차례로 수행하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일차방정식", "점"], "goal": ["계수"], "method": ["평행이동", "대입"], "condition": ["직선"]}, "hold": ""}
```