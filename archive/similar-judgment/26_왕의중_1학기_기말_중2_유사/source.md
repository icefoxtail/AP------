\`\`\`json:exam  
{"stem": "26\_왕의중\_1학기\_기말\_중2\_유사", "sourceArchiveFile": "original/middle/m2/1final/26\_왕의중\_1학기\_기말\_중2\_기출.js", "examFolder": "1final", "grade": "중2", "curriculum": "2022", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-14"}  
\`\`\`

\#\# Q01  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
\$x, y\$가 자연수일 때, 일차방정식 \$3x \+ 2y \= 22\$의 해의 개수는?  
\#\#\# 선지  
① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$  
\#\#\# 정답  
④  
\#\#\# 해설  
\$x, y\$가 자연수이므로 \$x\$에 \$1\$부터 차례로 대입하면  
\$x \= 2\$일 때 \$6 \+ 2y \= 22 \\implies y \= 8\$  
\$x \= 4\$일 때 \$12 \+ 2y \= 22 \\implies y \= 5\$  
\$x \= 6\$일 때 \$18 \+ 2y \= 22 \\implies y \= 2\$  
\$x \\ge 8\$이면 \$2y \\le \-2\$이므로 자연수 해가 없다.  
따라서 해는 \$(2, 8), (4, 5), (6, 2)\$의 \$3\$개이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-LINEAR\_EQ\_NATURAL\_COUNT", "primaryMethod": "계수가 큰 항의 x에 자연수를 차례로 대입해 y도 자연수가 되는 순서쌍 개수를 센다.", "decisiveStep": "(2, 8), (4, 5), (6, 2)의 3쌍이 유일함을 확인한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수 2개인 일차방정식의 자연수 해 개수"}, "crossConceptKeys": \["CC\_LINEAR\_EQUATIONS\_TWO\_VARIABLES"\], "conditionKeys": \["COND\_NATURAL\_NUMBER"\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "자연수를 차례로 대입해 해의 개수를 바로 세는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차방정식", "자연수"\], "goal": \["개수"\], "method": \["대입"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\#\# Q02  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 보기의 연립방정식 중 \$x, y\$의 순서쌍 \$(1, \-2)\$를 해로 갖는 것을 있는 대로 고른 것은?

ㄱ. \$\\begin{cases} x \+ y \= \-1 \\\\ 2x \+ y \= 0 \\end{cases}\$  
ㄴ. \$\\begin{cases} 3x \+ y \= 1 \\\\ x \+ 2y \= 3 \\end{cases}\$  
ㄷ. \$\\begin{cases} 4x \+ y \= 2 \\\\ x \- 2y \= 5 \\end{cases}\$  
ㄹ. \$\\begin{cases} 2x \- y \= 0 \\\\ x \- y \= 3 \\end{cases}\$  
\#\#\# 선지  
① ㄱ, ㄴ ② ㄱ, ㄷ ③ ㄱ, ㄹ ④ ㄴ, ㄹ ⑤ ㄷ, ㄹ  
\#\#\# 정답  
②  
\#\#\# 해설  
각 연립방정식에 \$x \= 1, y \= \-2\$를 대입하면  
ㄱ. \$1 \+ (-2) \= \-1\$, \$2(1) \+ (-2) \= 0\$ (해가 됨)  
ㄴ. \$1 \+ 2(-2) \= \-3 \\ne 3\$ (해가 아님)  
ㄷ. \$4(1) \+ (-2) \= 2\$, \$1 \- 2(-2) \= 5\$ (해가 됨)  
ㄹ. \$2(1) \- (-2) \= 4 \\ne 0\$ (해가 아님)  
따라서 해로 갖는 것은 ㄱ, ㄷ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-CHECK\_ORDERED\_PAIR\_SOLUTION", "primaryMethod": "순서쌍 (1, \-2)를 ㄱ\~ㄹ의 두 식에 모두 대입해 두 등식을 동시에 참으로 만드는 보기를 고른다.", "decisiveStep": "ㄱ과 ㄷ만 두 방정식을 모두 만족함을 확인한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "주어진 순서쌍이 해가 되는 연립방정식 고르기"}, "crossConceptKeys": \["CC\_SUBSTITUTION\_IN\_EQUATIONS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x \= 1, y \= \-2를 각 식에 대입하여 참·거짓만 확인하면 되는 기본 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식", "해"\], "goal": \["연립방정식"\], "method": \["대입"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q03  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
두 일차방정식 \$3x \+ 2y \= 12\$, \$y \= 3x \- 3\$을 모두 만족시키는 \$x, y\$에 대하여 \$x \+ y\$의 값은?  
\#\#\# 선지  
① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
\$y \= 3x \- 3\$을 \$3x \+ 2y \= 12\$에 대입하면  
\$3x \+ 2(3x \- 3\) \= 12\$  
\$9x \- 6 \= 12 \\implies 9x \= 18 \\implies x \= 2\$  
\$y \= 3 \\times 2 \- 3 \= 3\$  
\$\\therefore x \+ y \= 2 \+ 3 \= 5\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-SUBSTITUTION\_SUM", "primaryMethod": "y \= 3x \- 3을 3x \+ 2y \= 12에 대입해 x \= 2, y \= 3을 구하여 합한다.", "decisiveStep": "9x \= 18에서 x \= 2, y \= 3을 얻어 합 5를 구한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "대입법"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "대입법으로 두 일차방정식 공통 해의 합 구하기"}, "crossConceptKeys": \["CC\_SIMULTANEOUS\_LINEAR\_EQUATIONS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y에 대해 정리된 식을 바로 대입하여 푸는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차방정식"\], "goal": \["합"\], "method": \["대입법"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q04  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
\$\\begin{cases} \\frac{x}{2} \- \\frac{y}{3} \= 1 \\\\ 0.2x \+ 0.3y \= 1.7 \\end{cases}\$의 해가 \$x \= a,\\ y \= b\$일 때, \$2a \+ b\$의 값은?  
\#\#\# 선지  
① \$5\$ ② \$7\$ ③ \$9\$ ④ \$11\$ ⑤ \$13\$  
\#\#\# 정답  
④  
\#\#\# 해설  
첫째 식에 \$6\$, 둘째 식에 \$10\$을 곱하면  
\$\\begin{cases} 3x \- 2y \= 6 \\quad \\cdots\\cdots \\text{㉠} \\\\ 2x \+ 3y \= 17 \\quad \\cdots\\cdots \\text{㉡} \\end{cases}\$  
\$\\text{㉠} \\times 3 \+ \\text{㉡} \\times 2\$를 하면 \$13x \= 52 \\implies x \= 4\$  
\$x \= 4\$를 ㉠에 대입하면 \$12 \- 2y \= 6 \\implies y \= 3\$  
따라서 \$a \= 4,\\ b \= 3\$이므로 \$2a \+ b \= 8 \+ 3 \= 11\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-FRACTION\_DECIMAL\_SYSTEM", "primaryMethod": "분수 식에 6, 소수 식에 10을 곱해 정수 계수 연립방정식으로 고친 뒤 가감법으로 해를 구한다.", "decisiveStep": "3x \- 2y \= 6과 2x \+ 3y \= 17을 연립해 a \= 4, b \= 3을 얻어 2a \+ b \= 11을 계산한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "복잡한 꼴의 연립방정식", "l4": "분수·소수가 있는 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_SYSTEM\_OF\_EQUATIONS\_DECIMAL\_COEFFICIENTS", "templateKey": null, "why": "분수·소수 계수 연립방정식 풀이"}, "crossConceptKeys": \["CC\_FRACTION\_COEFFICIENTS", "CC\_DECIMAL\_COEFFICIENTS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수와 소수를 각각 정수로 변환한 뒤 최소공배수로 맞추어 가감법을 적용해야 한다.", "level": "중", "item4slot": {"given": \["연립방정식", "분수"\], "goal": \["식의값"\], "method": \["가감법", "대입"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q05  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
연립방정식 \$\\begin{cases} ax \+ 3y \= m \\\\ 2x \- by \= n \\end{cases}\$을 풀 때, 민수는 \$m\$을 \$-1\$로 잘못 보고 풀었더니 해가 \$(1, \-1)\$이 나왔고, 서연이는 \$n\$을 \$-7\$로 잘못 보고 풀었더니 해가 \$(1, 3)\$이 나왔다. 연립방정식을 바르게 풀었을 때의 해를 \$(x, y)\$라 하면 \$x \+ y\$의 값은? (단, \$a, b, m, n\$은 상수)  
\#\#\# 선지  
① \$1\$ ② \$3\$ ③ \$5\$ ④ \$7\$ ⑤ \$9\$  
\#\#\# 정답  
③  
\#\#\# 해설  
민수는 \$m\$을 \$-1\$로 잘못 보고 풀었으므로 \$(1, \-1)\$은 \$ax \+ 3y \= \-1\$과 \$2x \- by \= n\$을 만족한다.  
\$a(1) \+ 3(-1) \= \-1 \\implies a \= 2\$  
\$2(1) \- b(-1) \= n \\implies 2 \+ b \= n \\quad \\cdots\\cdots \\text{㉠}\$  
서연이는 \$n\$을 \$-7\$로 잘못 보고 풀었으므로 \$(1, 3)\$은 \$ax \+ 3y \= m\$과 \$2x \- by \= \-7\$을 만족한다.  
\$2(1) \- b(3) \= \-7 \\implies \-3b \= \-9 \\implies b \= 3\$  
\$b \= 3\$을 ㉠에 대입하면 \$n \= 2 \+ 3 \= 5\$  
\$a \= 2\$를 \$ax \+ 3y \= m\$에 \$(1, 3)\$과 함께 대입하면 \$m \= 2(1) \+ 3(3) \= 11\$  
따라서 바른 연립방정식은 \$\\begin{cases} 2x \+ 3y \= 11 \\\\ 2x \- 3y \= 5 \\end{cases}\$  
두 식을 더하면 \$4x \= 16 \\implies x \= 4\$, \$y \= 1\$  
\$\\therefore x \+ y \= 4 \+ 1 \= 5\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-MISREAD\_CONSTANT\_SYSTEM\_RECOVERY", "primaryMethod": "두 사람이 잘못 본 식과 바르게 본 식에 각각의 해를 대입해 a, b, m, n을 모두 복원한 뒤 바른 연립방정식을 푼다.", "decisiveStep": "민수의 해로 a \= 2, 서연의 해로 b \= 3을 먼저 확정해 m \= 11, n \= 5를 복원한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "상수항을 잘못 보고 푼 두 해로부터 바른 해 복원"}, "crossConceptKeys": \["CC\_ERROR\_CORRECTION", "CC\_COEFFICIENT\_DETERMINATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 사람의 오독 해를 각각 바른 식과 잘못 본 식에 대입해 4개 상수를 모두 복원하고 다시 풀어야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["연립방정식", "해"\], "goal": \["합"\], "method": \["대입", "가감법"\], "condition": \["상수"\]}, "hold": ""}  
\`\`\`

\#\# Q06  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
지난달 어느 학교 도서관의 방문자 수는 남학생과 여학생을 합쳐 모두 \$600\$명이었다. 이번 달에는 남학생 방문자 수가 지난달보다 \$15\\%\$ 증가하고, 여학생 방문자 수는 지난달보다 \$10\\%\$ 감소하여 전체 방문자 수가 지난달보다 \$15\$명 증가하였다. 지난달 남학생 방문자 수는?  
\#\#\# 선지  
① \$250\$명 ② \$300\$명 ③ \$350\$명 ④ \$400\$명 ⑤ \$450\$명  
\#\#\# 정답  
②  
\#\#\# 해설  
지난달 남학생 방문자 수를 \$x\$명, 여학생 방문자 수를 \$y\$명이라 하면  
\$\\begin{cases} x \+ y \= 600 \\\\ \\frac{15}{100}x \- \\frac{10}{100}y \= 15 \\end{cases}\$  
둘째 식의 양변에 \$100\$을 곱하고 \$5\$로 나누면 \$3x \- 2y \= 300\$  
\$y \= 600 \- x\$를 대입하면 \$3x \- 2(600 \- x) \= 300 \\implies 5x \= 1500 \\implies x \= 300\$  
따라서 지난달 남학생 방문자 수는 \$300\$명이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION\_WORD", "conceptClusterKey": "M2-03-WORD\_PERCENT\_CHANGE\_POPULATION", "primaryMethod": "지난달 합 x \+ y \= 600과 증감량 식 0.15x \- 0.1y \= 15를 연립해 지난달 남학생 수 x를 구한다.", "decisiveStep": "증감량 식을 3x \- 2y \= 300으로 정리해 x \+ y \= 600과 연립하여 x \= 300을 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "농도·비율", "l4": "증감률"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "증감률 연립일차방정식 활용"}, "crossConceptKeys": \["CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \["COND\_NATURAL\_NUMBER"\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "비율 증감 조건으로부터 두 번째 일차방정식을 세워 연립해야 하는 활용 문항이다.", "level": "중", "item4slot": {"given": \["비율"\], "goal": \["자연수"\], "method": \["연립방정식", "대입법"\], "condition": \["비율"\]}, "hold": ""}  
\`\`\`

\#\# Q07  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
다음 보기에서 \$y\$가 \$x\$의 함수인 것을 있는 대로 고른 것은?

ㄱ. 절댓값이 \$x\$인 수 \$y\$  
ㄴ. 나이가 \$x\$살인 사람의 키 \$y\\text{ cm}\$  
ㄷ. 자연수 \$x\$보다 작은 홀수의 개수 \$y\$  
ㄹ. 한 개에 \$x\$원인 물건 \$7\$개의 가격 \$y\$원  
\#\#\# 선지  
① ㄱ, ㄷ ② ㄱ, ㄹ ③ ㄴ, ㄷ ④ ㄴ, ㄹ ⑤ ㄷ, ㄹ  
\#\#\# 정답  
⑤  
\#\#\# 해설  
ㄱ. \$x \= 2\$일 때 \$y \= 2, \-2\$로 \$2\$개이므로 함수가 아니다.  
ㄴ. 같은 나이라도 사람마다 키가 다르므로 함수가 아니다.  
ㄷ. 자연수 \$x\$보다 작은 홀수의 개수는 오직 하나로 정해지므로 함수이다.  
ㄹ. \$y \= 7x\$로 \$x\$의 값에 따라 \$y\$의 값이 오직 하나씩 정해지므로 함수이다.  
따라서 함수인 것은 ㄷ, ㄹ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-FUNCTION\_DEFINITION\_CHECK", "primaryMethod": "x의 값 하나에 y의 값이 오직 하나씩 대응하는지 ㄱ\~ㄹ 보기별로 판별한다.", "decisiveStep": "절댓값(복수)과 나이-키(비유일)를 제외하고 ㄷ과 ㄹ만 함수임을 고른다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_FUNCTION\_AND\_LINEAR\_FUNCTION\_IDENTIFICATION", "templateKey": null, "why": "함수의 뜻 판별"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수의 정의(유일 대응)를 보기 문장에서 바로 판정하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["자연수"\], "goal": \["함수"\], "method": \["대응"\], "condition": \["함수"\]}, "hold": ""}  
\`\`\`

\#\# Q08  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
함수 \$f(x) \= \-4x\$에 대하여 \$f(2) \+ 3f(-1)\$의 값은?  
\#\#\# 선지  
① \$-4\$ ② \$0\$ ③ \$2\$ ④ \$4\$ ⑤ \$8\$  
\#\#\# 정답  
④  
\#\#\# 해설  
\$f(2) \= \-4 \\times 2 \= \-8\$  
\$f(-1) \= \-4 \\times (-1) \= 4\$  
\$\\therefore f(2) \+ 3f(-1) \= \-8 \+ 3 \\times 4 \= \-8 \+ 12 \= 4\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-FUNCTION\_VALUE\_LINEAR\_COMB", "primaryMethod": "f(2) \= \-8과 f(-1) \= 4를 각각 구한 뒤 f(2) \+ 3f(-1)을 계산한다.", "decisiveStep": "-8 \+ 3(4) \= 4를 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_VALUE", "templateKey": null, "why": "함숫값의 일차결합 계산"}, "crossConceptKeys": \["CC\_FUNCTION\_VALUE"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 함숫값을 대입해 구한 뒤 사칙연산으로 합산하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["함수"\], "goal": \["함숫값"\], "method": \["대입"\], "condition": \["함수"\]}, "hold": ""}  
\`\`\`

\#\# Q09  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= 2x \- 5\$의 그래프를 \$y\$축의 방향으로 \$k\$만큼 평행이동한 그래프가 점 \$(-3, \-4)\$를 지날 때, \$k\$의 값은?  
\#\#\# 선지  
① \$7\$ ② \$5\$ ③ \$3\$ ④ \$-3\$ ⑤ \$-7\$  
\#\#\# 정답  
①  
\#\#\# 해설  
\$y \= 2x \- 5\$의 그래프를 \$y\$축의 방향으로 \$k\$만큼 평행이동하면 \$y \= 2x \- 5 \+ k\$  
점 \$(-3, \-4)\$를 대입하면  
\$-4 \= 2 \\times (-3) \- 5 \+ k\$  
\$-4 \= \-11 \+ k \\implies k \= 7\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-VERTICAL\_TRANSLATION\_POINT", "primaryMethod": "평행이동한 식 y \= 2x \- 5 \+ k에 점 (-3, \-4)를 대입하여 평행이동량 k를 구한다.", "decisiveStep": "-4 \= \-11 \+ k에서 k \= 7을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_VERTICAL\_TRANSLATION", "templateKey": null, "why": "y축 방향 평행이동량 구하기"}, "crossConceptKeys": \["CC\_PARALLEL\_TRANSLATION", "CC\_POINT\_SUBSTITUTION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 식을 쓰고 주어진 점 좌표를 대입하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수", "점"\], "goal": \["상수"\], "method": \["평행이동", "대입"\], "condition": \["평행이동"\]}, "hold": ""}  
\`\`\`

\#\# Q10  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
두 점 \$(1, a)\$와 \$(3, 12)\$를 지나는 일차함수의 그래프가 두 점 \$(2, 3)\$과 \$(5, 9)\$를 지나는 일차함수의 그래프와 평행할 때, \$a\$의 값은?  
\#\#\# 선지  
① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$  
\#\#\# 정답  
③  
\#\#\# 해설  
두 점 \$(2, 3), (5, 9)\$를 지나는 직선의 기울기는 \$\\frac{9 \- 3}{5 \- 2} \= \\frac{6}{3} \= 2\$  
두 직선이 평행하므로 \$(1, a), (3, 12)\$를 지나는 직선의 기울기도 \$2\$이다.  
\$\\frac{12 \- a}{3 \- 1} \= 2 \\implies 12 \- a \= 4 \\implies a \= 8\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-PARALLEL\_TWO\_POINT\_SLOPES", "primaryMethod": "(2, 3), (5, 9)를 지나는 직선의 기울기 2를 구한 뒤 (1, a), (3, 12)의 기울기 식과 같다고 놓아 a를 구한다.", "decisiveStep": "(12 \- a)/2 \= 2에서 a \= 8을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "일차함수 그래프의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTIONS\_PARALLEL\_CONDITION", "templateKey": null, "why": "평행한 두 직선의 기울기 공식을 이용한 좌표 결정"}, "crossConceptKeys": \["CC\_SLOPE\_FORMULA"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 점 기울기 공식을 두 번 써서 등치시키면 바로 풀리는 기본 문항이다.", "level": "하", "item4slot": {"given": \["점", "일차함수"\], "goal": \["상수"\], "method": \["기울기"\], "condition": \["평행"\]}, "hold": ""}  
\`\`\`

\#\# Q11  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 중 일차함수 \$y \= \-\\frac{2}{3}x \+ 4\$의 그래프에 대한 설명으로 옳지 않은 것은?  
\#\#\# 선지  
① 점 \$(3, 2)\$를 지난다. ② 제\$1, 2, 4\$사분면을 지난다. ③ 오른쪽 아래로 향하는 직선이다. ④ \$y \= \-\\frac{2}{3}x \- 5\$의 그래프와 서로 평행하다. ⑤ \$x\$의 값이 \$6\$만큼 증가할 때, \$y\$의 값은 \$9\$만큼 감소한다.  
\#\#\# 정답  
⑤  
\#\#\# 해설  
① \$x \= 3\$일 때 \$y \= \-2 \+ 4 \= 2\$이므로 점 \$(3, 2)\$를 지난다. (옳음)  
② 기울기가 \$-\\frac{2}{3} \< 0\$, \$y\$절편이 \$4 \> 0\$이므로 제\$1, 2, 4\$사분면을 지난다. (옳음)  
③ 기울기가 음수이므로 오른쪽 아래로 향하는 직선이다. (옳음)  
④ 기울기가 \$-\\frac{2}{3}\$로 같고 \$y\$절편이 다르므로 서로 평행하다. (옳음)  
⑤ 기울기가 \$-\\frac{2}{3}\$이므로 \$x\$의 값이 \$6\$만큼 증가할 때 \$y\$의 값은 \$6 \\times \\left(-\\frac{2}{3}\\right) \= \-4\$, 즉 \$4\$만큼 감소한다. (옳지 않음)  
따라서 옳지 않은 것은 ⑤이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-LINEAR\_GRAPH\_PROPERTIES\_CHECK", "primaryMethod": "y \= \-(2/3)x \+ 4의 지나는 점, 사분면, 방향, 평행, 기울기 비율을 보기별로 점검한다.", "decisiveStep": "기울기 \-2/3에서 x가 6 증가하면 y는 4 감소하므로 ⑤의 9가 틀렸음을 판별한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "일차함수 그래프 성질 옳지 않은 것 고르기"}, "crossConceptKeys": \["CC\_SLOPE\_AND\_INTERCEPT", "CC\_QUADRANTS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차함수 식의 기울기와 y절편으로 기본 성질을 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["성질"\], "method": \["기울기", "대입"\], "condition": \["평행"\]}, "hold": ""}  
\`\`\`

\#\# Q12  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
두 일차함수 \$y \= ax \+ 8\$, \$y \= \-4x \+ 8\$의 그래프와 \$x\$축으로 만들어지는 삼각형의 넓이가 \$24\$일 때, \$a\$의 값은? (단, \$a \> 0\$)  
\#\#\# 선지  
① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$  
\#\#\# 정답  
①  
\#\#\# 해설  
\$y \= ax \+ 8\$의 \$x\$절편은 \$-\\frac{8}{a}\$(\$a \> 0\$이므로 음수), \$y \= \-4x \+ 8\$의 \$x\$절편은 \$2\$이다.  
두 직선의 \$y\$절편은 모두 \$8\$이므로 삼각형의 높이는 \$8\$, 밑변의 길이는 \$2 \- \\left(-\\frac{8}{a}\\right) \= 2 \+ \\frac{8}{a}\$이다.  
삼각형의 넓이가 \$24\$이므로  
\$\\frac{1}{2} \\times \\left(2 \+ \\frac{8}{a}\\right) \\times 8 \= 24\$  
\$4\\left(2 \+ \\frac{8}{a}\\right) \= 24 \\implies 2 \+ \\frac{8}{a} \= 6 \\implies \\frac{8}{a} \= 4 \\implies a \= 2\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_EQUATION", "conceptClusterKey": "M2-04-X\_AXIS\_TRIANGLE\_AREA\_SLOPE", "primaryMethod": "두 직선의 y절편 8을 높이로, 두 x절편 \-8/a와 2 사이의 거리를 밑변으로 하여 넓이 식에서 a를 구한다.", "decisiveStep": "(1/2) \* (2 \+ 8/a) \* 8 \= 24에서 8/a \= 4, 즉 a \= 2를 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTIONS\_ENCLOSED\_AREA", "templateKey": null, "why": "x축과 두 일차함수로 둘러싸인 삼각형 넓이에서 기울기 구하기"}, "crossConceptKeys": \["CC\_X\_INTERCEPT", "CC\_POLYGON\_AREA"\], "conditionKeys": \["COND\_POSITIVE"\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자가 포함된 x절편 \-8/a의 부호를 판단해 밑변 길이를 세우고 넓이 방정식을 풀어야 한다.", "level": "중", "item4slot": {"given": \["일차함수", "삼각형", "넓이"\], "goal": \["상수"\], "method": \["x절편", "y절편"\], "condition": \["양수"\]}, "hold": ""}  
\`\`\`

\#\# Q13  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
기울기가 \$3\$이고 점 \$(2, \-1)\$을 지나는 직선을 그래프로 하는 일차함수의 식은?  
\#\#\# 선지  
① \$y \= 3x \- 3\$ ② \$y \= 3x \- 5\$ ③ \$y \= 3x \- 7\$ ④ \$y \= \-3x \- 5\$ ⑤ \$y \= \-3x \- 7\$  
\#\#\# 정답  
③  
\#\#\# 해설  
기울기가 \$3\$이므로 \$y \= 3x \+ b\$라 하자.  
점 \$(2, \-1)\$을 지나므로 \$-1 \= 3 \\times 2 \+ b \\implies b \= \-7\$  
따라서 구하는 일차함수의 식은 \$y \= 3x \- 7\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-LINE\_FROM\_SLOPE\_AND\_POINT", "primaryMethod": "y \= 3x \+ b에 점 (2, \-1)을 대입해 y절편 b \= \-7을 구한다.", "decisiveStep": "-1 \= 6 \+ b에서 b \= \-7을 구해 y \= 3x \- 7을 확정한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "기울기와 한 점으로 일차함수 식 구하기"}, "crossConceptKeys": \["CC\_POINT\_SUBSTITUTION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기와 한 점의 좌표를 대입해 y절편만 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["기울기", "점"\], "goal": \["일차함수"\], "method": \["대입"\], "condition": \["기울기"\]}, "hold": ""}  
\`\`\`

\#\# Q14  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
두 점 \$(-1, 2)\$, \$(2, 7)\$을 지나는 직선의 그래프와 평행하고 \$y\$절편이 \$4\$인 직선을 그래프로 하는 일차함수의 식은?  
\#\#\# 선지  
① \$y \= \\frac{5}{3}x \+ 4\$ ② \$y \= \-\\frac{5}{3}x \+ 4\$ ③ \$y \= \\frac{5}{3}x \- 4\$ ④ \$y \= \\frac{3}{5}x \+ 4\$ ⑤ \$y \= \-\\frac{3}{5}x \- 4\$  
\#\#\# 정답  
①  
\#\#\# 해설  
두 점 \$(-1, 2), (2, 7)\$을 지나는 직선의 기울기는 \$\\frac{7 \- 2}{2 \- (-1)} \= \\frac{5}{3}\$  
이 직선과 평행하므로 기울기가 \$\\frac{5}{3}\$이고 \$y\$절편이 \$4\$인 일차함수의 식은 \$y \= \\frac{5}{3}x \+ 4\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-PARALLEL\_SLOPE\_AND\_Y\_INTERCEPT", "primaryMethod": "두 점 (-1, 2), (2, 7)의 기울기 5/3와 주어진 y절편 4를 결합해 일차함수 식을 세운다.", "decisiveStep": "기울기 (7-2)/(2+1) \= 5/3과 y절편 4로 y \= (5/3)x \+ 4를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 점으로 기울기를 구해 평행한 일차함수 식 세우기"}, "crossConceptKeys": \["CC\_SLOPE\_FORMULA"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기 공식 한 번과 y절편 결합만으로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["점", "y절편"\], "goal": \["일차함수"\], "method": \["기울기"\], "condition": \["평행"\]}, "hold": ""}  
\`\`\`

\#\# Q15  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
두 점 \$(-4, 3a \- 2)\$, \$(1, a \+ 4)\$를 지나는 직선이 \$y\$축에 수직일 때, \$a\$의 값은?  
\#\#\# 선지  
① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$  
\#\#\# 정답  
③  
\#\#\# 해설  
\$y\$축에 수직인 직선은 \$x\$축에 평행하므로 두 점의 \$y\$좌표가 같다.  
\$3a \- 2 \= a \+ 4\$  
\$2a \= 6 \\implies a \= 3\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_EQUATION", "conceptClusterKey": "M2-04-HORIZONTAL\_LINE\_SAME\_Y", "primaryMethod": "y축에 수직인 직선 위의 두 점은 y좌표가 같음을 이용해 3a \- 2 \= a \+ 4를 푼다.", "decisiveStep": "3a \- 2 \= a \+ 4에서 a \= 3을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "x축·y축에 평행한 직선"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "y축에 수직인 직선 위 두 점의 y좌표 일치 조건"}, "crossConceptKeys": \["CC\_EQUATIONS\_PARALLEL\_TO\_AXES"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y축 수직(= x축 평행) 조건에서 y좌표가 같음을 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["점", "직선"\], "goal": \["상수"\], "method": \["등식"\], "condition": \["평행"\]}, "hold": ""}  
\`\`\`

\#\# Q16  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차방정식 \$ax \+ by \+ 1 \= 0\$의 그래프가 제\$1, 2, 3\$사분면을 지날 때, 다음 중 옳은 것은? (단, \$a, b\$는 상수)  
\#\#\# 선지  
① \$a \> 0,\\ b \> 0\$ ② \$a \> 0,\\ b \< 0\$ ③ \$a \< 0,\\ b \> 0\$ ④ \$a \< 0,\\ b \< 0\$ ⑤ \$a \< 0,\\ b \= 0\$  
\#\#\# 정답  
②  
\#\#\# 해설  
\$ax \+ by \+ 1 \= 0\$이 제\$1, 2, 3\$사분면을 지나려면 \$b \\ne 0\$이고 \$y \= \-\\frac{a}{b}x \- \\frac{1}{b}\$에서  
기울기 \$-\\frac{a}{b} \> 0\$, \$y\$절편 \$-\\frac{1}{b} \> 0\$이어야 한다.  
\$-\\frac{1}{b} \> 0\$에서 \$b \< 0\$  
\$-\\frac{a}{b} \> 0\$이고 \$b \< 0\$이므로 \$a \> 0\$  
따라서 \$a \> 0,\\ b \< 0\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_EQUATION", "conceptClusterKey": "M2-04-STANDARD\_FORM\_QUADRANT\_SIGNS", "primaryMethod": "ax \+ by \+ 1 \= 0을 y \= \-(a/b)x \- 1/b로 고친 뒤 제1, 2, 3사분면 통과 조건으로 기울기와 y절편의 부호에서 a, b의 부호를 구한다.", "decisiveStep": "-1/b \> 0에서 b \< 0을 먼저 확정하고 \-a/b \> 0에서 a \> 0을 도출한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "방정식과 그래프", "l4": "일차방정식의 그래프"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_QUADRANT\_CONDITION", "templateKey": null, "why": "지나는 사분면 조건으로 일차방정식 계수 부호 결정"}, "crossConceptKeys": \["CC\_QUADRANTS", "CC\_SLOPE\_SIGN"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차방정식을 함수 꼴로 변환하고 \-1/b와 \-a/b의 부호로부터 차례로 b, a의 부호를 판정해야 한다.", "level": "중", "item4slot": {"given": \["일차방정식", "사분면"\], "goal": \["조건"\], "method": \["기울기", "y절편"\], "condition": \["사분면"\]}, "hold": ""}  
\`\`\`

\#\# Q17  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
직선 \$l\$은 두 점 \$(8, 0), (0, 8)\$을 지나고, 직선 \$m\$은 두 점 \$(-2, 0), (0, 2)\$를 지날 때, 두 직선 \$l, m\$의 교점의 좌표 \$(a, b)\$가 해가 되는 연립방정식은?  
\#\#\# 선지  
① \$\\begin{cases} x \+ y \= 8 \\\\ x \- y \= \-2 \\end{cases}\$ ② \$\\begin{cases} x \+ y \= \-8 \\\\ x \- y \= \-2 \\end{cases}\$ ③ \$\\begin{cases} x \+ y \= 8 \\\\ x \- y \= 2 \\end{cases}\$ ④ \$\\begin{cases} x \- y \= 8 \\\\ x \+ y \= \-2 \\end{cases}\$ ⑤ \$\\begin{cases} x \- y \= \-8 \\\\ x \+ y \= 2 \\end{cases}\$  
\#\#\# 정답  
①  
\#\#\# 해설  
직선 \$l\$은 \$x\$절편이 \$8\$, \$y\$절편이 \$8\$이므로 \$y \= \-x \+ 8\$, 즉 \$x \+ y \= 8\$  
직선 \$m\$은 \$x\$절편이 \$-2\$, \$y\$절편이 \$2\$이므로 \$y \= x \+ 2\$, 즉 \$x \- y \= \-2\$  
따라서 교점이 해가 되는 연립방정식은 ① \$\\begin{cases} x \+ y \= 8 \\\\ x \- y \= \-2 \\end{cases}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_EQUATION", "conceptClusterKey": "M2-04-GRAPH\_INTERSECTION\_TO\_SYSTEM", "primaryMethod": "두 직선 l, m의 절편 좌표로 각각의 일차방정식을 세워 연립방정식으로 묶는다.", "decisiveStep": "l: x \+ y \= 8과 m: x \- y \= \-2를 구해 ①을 선택한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "교점과 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_SYSTEM\_OF\_EQUATIONS\_GRAPH\_INTERSECTION", "templateKey": null, "why": "두 직선의 방정식을 구해 교점이 해인 연립방정식 찾기"}, "crossConceptKeys": \["CC\_INTERCEPTS", "CC\_INTERSECTION\_OF\_TWO\_GRAPHS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절편으로 두 직선의 방정식을 각각 세운 뒤 연립방정식 형태로 대응시켜야 한다.", "level": "중", "item4slot": {"given": \["직선", "점"\], "goal": \["연립방정식"\], "method": \["x절편", "y절편"\], "condition": \["교점"\]}, "hold": ""}  
\`\`\`

\#\# Q18  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
연립방정식 \$\\begin{cases} \-x \+ 3y \= \-3 \\\\ ax \+ by \= \-6 \\end{cases}\$의 해에 대한 설명으로 옳지 않은 것은? (단, \$b \\ne 0\$)  
\#\#\# 선지  
① 연립방정식의 해는 직선 \$y \= \\frac{1}{3}x \- 1\$ 위에 존재한다. ② 연립방정식의 해는 직선 \$y \= \-\\frac{a}{b}x \- \\frac{6}{b}\$ 위에 존재한다. ③ \$a \= \-2,\\ b \= 6\$이면 해가 무수히 많다. ④ \$a \= 0,\\ b \= \-3\$이면 해가 없다. ⑤ \$a \= \-1,\\ b \= 3\$이면 해가 없다.  
\#\#\# 정답  
④  
\#\#\# 해설  
① \$-x \+ 3y \= \-3\$을 정리하면 \$y \= \\frac{1}{3}x \- 1\$이므로 해는 이 직선 위에 존재한다. (옳음)  
② \$ax \+ by \= \-6\$ (\$b \\ne 0\$)을 정리하면 \$y \= \-\\frac{a}{b}x \- \\frac{6}{b}\$이므로 해는 이 직선 위에 존재한다. (옳음)  
③ \$a \= \-2, b \= 6\$이면 \$-2x \+ 6y \= \-6 \\iff \-x \+ 3y \= \-3\$으로 두 직선이 일치하므로 해가 무수히 많다. (옳음)  
④ \$a \= 0, b \= \-3\$이면 \$-3y \= \-6 \\implies y \= 2\$이고, 첫째 식에 대입하면 \$-x \+ 6 \= \-3 \\implies x \= 9\$로 해가 \$(9, 2)\$ 하나 존재한다. (옳지 않음)  
⑤ \$a \= \-1, b \= 3\$이면 \$-x \+ 3y \= \-6\$이 되어 첫째 식 \$-x \+ 3y \= \-3\$과 평행하므로 해가 없다. (옳음)  
따라서 옳지 않은 것은 ④이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_EQUATION", "conceptClusterKey": "M2-04-SYSTEM\_GRAPH\_INTERPRETATION\_CHECK", "primaryMethod": "각 일차방정식을 직선의 식으로 해석하여 계수 대입 시 일치·평행·한 점 교점 여부를 판별한다.", "decisiveStep": "a \= 0, b \= \-3이면 y \= 2로 기울기가 0이 되어 첫째 직선과 한 점에서 만남을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "교점과 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "연립방정식의 기하적 해 성질 판별"}, "crossConceptKeys": \["CC\_SIMULTANEOUS\_LINEAR\_EQUATIONS", "CC\_COEFFICIENT\_RATIOS"\], "conditionKeys": \["COND\_NONZERO"\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연립방정식과 두 직선의 교점 관계를 5가지 조건에 대해 각각 검증해야 한다.", "level": "중", "item4slot": {"given": \["연립방정식", "상수"\], "goal": \["조건"\], "method": \["직선의방정식", "대입"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q19  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
두 직선 \$y \= 3x \- 4\$, \$y \= \-x\$와 직선 \$y \= ax \+ 2\$가 삼각형을 만들지 않도록 하는 상수 \$a\$의 값들의 합은?  
\#\#\# 선지  
① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$  
\#\#\# 정답  
②  
\#\#\# 해설  
세 직선이 삼각형을 만들지 않는 경우는 다음과 같다.  
(1) \$y \= ax \+ 2\$가 \$y \= 3x \- 4\$ 또는 \$y \= \-x\$와 평행할 때  
\$a \= 3\$ 또는 \$a \= \-1\$  
(2) \$y \= ax \+ 2\$가 두 직선 \$y \= 3x \- 4\$와 \$y \= \-x\$의 교점을 지날 때  
\$3x \- 4 \= \-x \\implies 4x \= 4 \\implies x \= 1,\\ y \= \-1\$  
점 \$(1, \-1)\$을 \$y \= ax \+ 2\$에 대입하면 \$-1 \= a \+ 2 \\implies a \= \-3\$  
따라서 모든 상수 \$a\$의 값의 합은 \$3 \+ (-1) \+ (-3) \= \-1\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_EQUATION", "conceptClusterKey": "M2-04-NO\_TRIANGLE\_THREE\_LINES\_SUM", "primaryMethod": "직선 y \= ax \+ 2가 다른 두 직선과 평행한 경우(a \= 3, \-1)와 두 직선 교점 (1, \-1)을 지나는 경우(a \= \-3)를 모두 구해 합산한다.", "decisiveStep": "a \= 3, \-1, \-3의 세 값을 빠짐없이 구해 합 \-1을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "두 직선의 관계", "l4": "두 직선의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "세 직선이 삼각형을 이루지 않을 상수들의 합"}, "crossConceptKeys": \["CC\_INTERSECTION\_OF\_TWO\_GRAPHS", "CC\_COEFFICIENT\_DETERMINATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행 조건 2가지와 세 직선의 한 점 교차 조건 1가지를 모두 분류해 합을 구해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["직선", "삼각형"\], "goal": \["합"\], "method": \["교점", "대입"\], "condition": \["평행", "교점"\]}, "hold": ""}  
\`\`\`

\#\# Q20  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
두 물통 \$\\text{A}, \\text{B}\$에 각각 \$20\\text{ L}\$, \$36\\text{ L}\$의 물이 들어 있다. 마개를 열면 \$\\text{A}\$에서는 \$1\$분에 \$1\\text{ L}\$, \$\\text{B}\$에서는 \$1\$분에 \$3\\text{ L}\$씩 물이 흘러나온다. 동시에 마개를 연 지 \$x\$분이 지났을 때, 다음 중 옳은 것은?  
\#\#\# 선지  
① \$\\text{A}\$물통에 남아 있는 물의 양을 \$y\\text{ L}\$라 할 때 \$y \= 20 \- 3x\$이다. ② \$\\text{B}\$물통에 남아 있는 물의 양을 \$y\\text{ L}\$라 할 때 \$y \= 36 \- x\$이다. ③ \$5\$분 후 두 물통에 남아 있는 물의 양은 같다. ④ \$9\$분 후 \$\\text{B}\$물통의 물이 \$\\text{A}\$물통의 물보다 많이 남아 있다. ⑤ \$\\text{B}\$물통의 물이 \$\\text{A}\$물통의 물보다 더 빨리 줄어든다.  
\#\#\# 정답  
⑤  
\#\#\# 해설  
\$x\$분 후 물통 \$\\text{A}, \\text{B}\$에 남아 있는 물의 양을 각각 \$y\_{\\text{A}}, y\_{\\text{B}}\$라 하면  
\$y\_{\\text{A}} \= 20 \- x\$, \$y\_{\\text{B}} \= 36 \- 3x\$  
① \$y\_{\\text{A}} \= 20 \- x\$ (거짓)  
② \$y\_{\\text{B}} \= 36 \- 3x\$ (거짓)  
③ \$20 \- x \= 36 \- 3x \\implies 2x \= 16 \\implies x \= 8\$, 즉 \$8\$분 후 같다. (거짓)  
④ \$x \= 9\$일 때 \$y\_{\\text{A}} \= 11\$, \$y\_{\\text{B}} \= 9\$이므로 \$\\text{A}\$물통에 더 많이 남아 있다. (거짓)  
⑤ \$\\text{B}\$는 \$1\$분에 \$3\\text{ L}\$, \$\\text{A}\$는 \$1\$분에 \$1\\text{ L}\$씩 줄어들므로 \$\\text{B}\$물통의 물이 더 빨리 줄어든다. (참)  
따라서 옳은 것은 ⑤이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-WORD\_TWO\_TANKS\_DRAINING", "primaryMethod": "두 물통의 잔량 식 y\_A \= 20 \- x와 y\_B \= 36 \- 3x를 세운 뒤 교점 시간과 변화율을 비교해 옳은 보기를 고른다.", "decisiveStep": "두 식 y\_A \= 20 \- x, y\_B \= 36 \- 3x를 비교해 ⑤만 참임을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 물통 배수 일차함수 비교 진위 판별"}, "crossConceptKeys": \["CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 일차함수 식을 각각 세우고 일치 시각과 특정 시각 대소 비교까지 모두 점검해야 한다.", "level": "중", "item4slot": {"given": \["일차함수"\], "goal": \["조건"\], "method": \["대입", "기울기"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q21  
\- 형식: 서답형  
\- 배점: 5  
\#\#\# 발문  
지윤이는 \$1\$시간 동안 어느 공원 둘레길을 \$\\text{A}\$코스는 분속 \$60\\text{ m}\$로, \$\\text{B}\$코스는 분속 \$40\\text{ m}\$로 걸었다. 지윤이가 걸은 거리가 총 \$2800\\text{ m}\$일 때, \$\\text{A}\$코스와 \$\\text{B}\$코스의 거리를 풀이 과정과 함께 각각 구하시오.  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$\\text{A}\$코스 \$1200\\text{ m}\$, \$\\text{B}\$코스 \$1600\\text{ m}\$  
\#\#\# 해설  
\$\\text{A}\$코스 거리를 \$x\\text{ m}\$, \$\\text{B}\$코스 거리를 \$y\\text{ m}\$라 하면 \$1\$시간 \$= 60\$분이므로  
\$\\begin{cases} x \+ y \= 2800 \\\\ \\frac{x}{60} \+ \\frac{y}{40} \= 60 \\end{cases}\$  
둘째 식의 양변에 \$120\$을 곱하면 \$2x \+ 3y \= 7200\$  
첫째 식에서 \$y \= 2800 \- x\$를 대입하면  
\$2x \+ 3(2800 \- x) \= 7200 \\implies \-x \+ 8400 \= 7200 \\implies x \= 1200\$  
\$y \= 2800 \- 1200 \= 1600\$  
따라서 \$\\text{A}\$코스 거리는 \$1200\\text{ m}\$, \$\\text{B}\$코스 거리는 \$1600\\text{ m}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION\_WORD", "conceptClusterKey": "M2-03-WORD\_DISTANCE\_SPEED\_TIME", "primaryMethod": "총 거리 x \+ y \= 2800과 총 시간 x/60 \+ y/40 \= 60을 연립해 A, B코스 거리를 구한다.", "decisiveStep": "1시간을 60분으로 맞추어 2x \+ 3y \= 7200과 x \+ y \= 2800을 연립한다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "속력·시간·거리", "l4": "마주가기·따라가기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "구간별 속력·시간·거리 연립방정식 서술형"}, "crossConceptKeys": \["CC\_SPEED\_DISTANCE\_TIME", "CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "시간 단위를 분으로 통일해 거리·시간 연립방정식을 세워 풀어야 한다.", "level": "중", "item4slot": {"given": \["거리", "속력"\], "goal": \["거리"\], "method": \["연립방정식", "대입법"\], "condition": \["거리"\]}, "hold": ""}  
\`\`\`

\#\# Q22  
\- 형식: 서답형  
\- 배점: 5  
\#\#\# 발문  
일차함수 \$y \= ax \+ b\$의 그래프를 그리는데 현우는 \$y\$절편을 잘못 보고 두 점 \$(2, 1), (4, 7)\$을 지나는 그래프를 그렸고, 예나는 기울기를 잘못 보고 두 점 \$(1, 2), (3, \-6)\$을 지나는 그래프를 그렸다. 이때 실제 일차함수 \$y \= ax \+ b\$의 그래프의 \$x\$절편을 풀이 과정과 함께 구하시오. (단, \$a, b\$는 상수)  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$-2\$  
\#\#\# 해설  
현우는 \$y\$절편을 잘못 보고 기울기 \$a\$는 바르게 보았으므로 두 점 \$(2, 1), (4, 7)\$을 지나는 직선의 기울기를 구하면  
\$a \= \\frac{7 \- 1}{4 \- 2} \= \\frac{6}{2} \= 3\$  
예나는 기울기를 잘못 보고 \$y\$절편 \$b\$는 바르게 보았으므로 두 점 \$(1, 2), (3, \-6)\$을 지나는 직선의 식을 구하면  
기울기는 \$\\frac{-6 \- 2}{3 \- 1} \= \-4\$이고, \$y \= \-4x \+ b\$에 \$(1, 2)\$를 대입하면 \$2 \= \-4 \+ b \\implies b \= 6\$  
따라서 실제 일차함수의 식은 \$y \= 3x \+ 6\$이다.  
\$y \= 0\$일 때 \$3x \+ 6 \= 0 \\implies x \= \-2\$이므로 구하는 \$x\$절편은 \$-2\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-MISREAD\_RECOVERY\_X\_INTERCEPT", "primaryMethod": "현우의 두 점에서 기울기 a \= 3을, 예나의 두 점에서 y절편 b \= 6을 복원해 식을 세운 뒤 x절편을 구한다.", "decisiveStep": "실제 식 y \= 3x \+ 6을 복원하고 y \= 0을 대입해 x절편 \-2를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "잘못 그린 두 그래프에서 바른 식 복원 후 x절편 구하기"}, "crossConceptKeys": \["CC\_ERROR\_CORRECTION", "CC\_X\_INTERCEPT"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기와 y절편을 각각 바르게 본 사람의 직선에서 복원한 뒤 x절편까지 계산해야 한다.", "level": "중", "item4slot": {"given": \["일차함수", "점"\], "goal": \["x절편"\], "method": \["기울기", "y절편"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q23  
\- 형식: 서답형  
\- 배점: 5  
\#\#\# 발문  
다은이는 감자 튀김을 하기 위해 마트에 갔다. 마트에서 감자 \$100\\text{ g}\$당 가격이 \$500\$원, 튀김가루는 \$500\\text{ g}\$에 \$4000\$원이었다. 감자를 \$x\\text{ g}\$ 사고 튀김가루 \$500\\text{ g}\$을 함께 살 때의 총금액을 \$y\$원이라 하자.  
(1) \$y\$를 \$x\$에 대한 식으로 나타내시오. \[3점\]  
(2) 감자 \$1.2\\text{ kg}\$과 튀김가루 \$500\\text{ g}\$을 살 때의 금액을 (1)에서 구한 식을 이용하여 구하고, 풀이 과정을 쓰시오. \[2점\]  
\#\#\# 선지  
없음  
\#\#\# 정답  
(1) \$y \= 5x \+ 4000\$, (2) \$10000\$원  
\#\#\# 해설  
(1) 감자 \$100\\text{ g}\$당 가격이 \$500\$원이므로 \$1\\text{ g}\$당 가격은 \$5\$원이다.  
따라서 \$y \= 5x \+ 4000\$  
(2) 감자 \$1.2\\text{ kg} \= 1200\\text{ g}\$이므로 \$x \= 1200\$을 대입하면  
\$y \= 5 \\times 1200 \+ 4000 \= 6000 \+ 4000 \= 10000\$  
따라서 총금액은 \$10000\$원이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-WORD\_UNIT\_PRICE\_LINEAR\_FUNC", "primaryMethod": "감자 1g당 가격 5원과 고정 금액 4000원으로 y \= 5x \+ 4000을 세우고 1.2kg \= 1200g을 대입한다.", "decisiveStep": "1.2kg을 1200g으로 환산해 x \= 1200을 대입하여 10000원을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "단위 가격과 고정 금액의 일차함수 활용"}, "crossConceptKeys": \["CC\_UNIT\_PRICE", "CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "1g당 가격을 구해 일차함수를 세우고 kg 단위를 g으로 바꾸어 대입하는 기본 활용 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["함숫값"\], "method": \["대입"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q24  
\- 형식: 서답형  
\- 배점: 5  
\#\#\# 발문  
연립방정식 \$\\begin{cases} 6x \+ 3ay \= 9 \\\\ 2bx \+ 6y \= 9 \\end{cases}\$의 해가 무수히 많을 때 \$ab\$의 값을 \$A\$라 하고, 해가 없을 때의 정수 순서쌍 \$(a, b)\$의 개수를 \$B\$라 하자. \$A, B\$의 값을 풀이 과정과 함께 각각 구하시오. (단, \$a, b\$는 정수이다.)  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$A \= 6,\\ B \= 7\$  
\#\#\# 해설  
(1) 해가 무수히 많으려면 \$\\frac{6}{2b} \= \\frac{3a}{6} \= \\frac{9}{9} \= 1\$이어야 하므로  
\$\\frac{3}{b} \= 1 \\implies b \= 3\$, \$\\frac{a}{2} \= 1 \\implies a \= 2\$  
따라서 \$A \= ab \= 2 \\times 3 \= 6\$이다.  
(2) 해가 없으려면 \$\\frac{6}{2b} \= \\frac{3a}{6} \\ne \\frac{9}{9}\$이어야 하므로  
\$\\frac{3}{b} \= \\frac{a}{2} \\ne 1\$, 즉 \$ab \= 6\$이면서 \$a \\ne 2\$(\$b \\ne 3\$)이어야 한다.  
\$ab \= 6\$을 만족하는 정수 순서쌍 \$(a, b)\$는 \$(1, 6), (2, 3), (3, 2), (6, 1), (-1, \-6), (-2, \-3), (-3, \-2), (-6, \-1)\$의 \$8\$개이고, 이 중 \$(2, 3)\$을 제외하면 \$B \= 7\$이다.  
따라서 \$A \= 6,\\ B \= 7\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2022", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-SPECIAL\_SOLUTIONS\_INTEGER\_PAIRS", "primaryMethod": "계수 비 3/b \= a/2와 상수항 비 1을 비교해 일치 조건에서 A \= 6을 구하고, 평행 조건 ab \= 6(단, a \!= 2)에서 정수 순서쌍 개수 B \= 7을 센다.", "decisiveStep": "ab \= 6인 정수 순서쌍 8개에서 해가 무수히 많은 (2, 3\) 1개를 제외하여 B \= 7을 얻는다.", "rpm": {"majorUnit": "연립일차방정식", "midUnit": "연립일차방정식", "l3": "해가 특수한 연립방정식", "l4": "계수 조건으로 해의 상태 판단"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_SYSTEM\_OF\_EQUATIONS\_NO\_SOLUTION", "templateKey": null, "why": "해가 무수히 많을 조건과 없을 조건의 정수 순서쌍 개수"}, "crossConceptKeys": \["CC\_COEFFICIENT\_RATIOS"\], "conditionKeys": \["COND\_INTEGER"\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "해가 무수히 많은 경우와 없는 경우의 계수 비 조건을 동시에 적용하고 음의 정수까지 포함한 순서쌍을 세어야 한다.", "level": "상", "item4slot": {"given": \["연립방정식", "정수"\], "goal": \["곱", "개수"\], "method": \["비례식"\], "condition": \["정수", "해가무수히많다"\]}, "hold": ""}  
\`\`\`  
