\`\`\`json:exam  
{"stem": "25\_왕운중\_1학기\_기말\_중2\_유사", "sourceArchiveFile": "original/middle/m2/1final/25\_왕운중\_1학기\_기말\_중2\_수학.js", "examFolder": "1final", "grade": "중2", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-15"}  
\`\`\`

\#\# Q01  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
다음 중에서 미지수가 \$2\$개인 일차방정식을 모두 찾은 것을 고르면?

ㄱ. \$x \+ y \= 0\$  
ㄴ. \$3x \- 2y \+ 4\$  
ㄷ. \$3y \- 4x \+ 5 \= 0\$  
ㄹ. \$2x \+ y \- 1 \= 2x \- y \+ 3\$  
\#\#\# 선지  
① ㄱ, ㄴ ② ㄱ, ㄷ ③ ㄱ, ㄹ ④ ㄴ, ㄷ ⑤ ㄷ, ㄹ  
\#\#\# 정답  
②  
\#\#\# 해설  
ㄱ. \$x \+ y \= 0\$은 미지수가 \$2\$개인 일차방정식이다.  
ㄴ. 등호가 없으므로 방정식이 아니다.  
ㄷ. \$-4x \+ 3y \+ 5 \= 0\$은 미지수가 \$2\$개인 일차방정식이다.  
ㄹ. 이항하여 정리하면 \$2y \- 4 \= 0\$이므로 미지수가 \$1\$개이다.  
따라서 옳은 것은 ② ㄱ, ㄷ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-IDENTIFY\_TWO\_VAR\_LINEAR\_EQ", "primaryMethod": "등호 유무와 이항 정리 후 x, y 두 미지수가 모두 남는 일차방정식을 ㄱ\~ㄹ에서 고른다.", "decisiveStep": "등호 없는 ㄴ과 x가 소거되는 ㄹ을 제외하고 ㄱ, ㄷ을 선택한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수가 2개인 일차방정식 고르기"}, "crossConceptKeys": \["CC\_LINEAR\_EQUATIONS\_TWO\_VARIABLES"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이항 정리 후 미지수 개수와 등호 유무만 확인하면 되는 1단계 개념 문항이다.", "level": "하", "item4slot": {"given": \["방정식"\], "goal": \["일차방정식"\], "method": \["이항"\], "condition": \["일차방정식"\]}, "hold": ""}  
\`\`\`

\#\# Q02  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
\$x, y\$가 자연수일 때, 일차방정식 \$3x \+ y \= 13\$의 해의 개수는?  
\#\#\# 선지  
① \$1\$개 ② \$2\$개 ③ \$3\$개 ④ \$4\$개 ⑤ \$5\$개  
\#\#\# 정답  
④  
\#\#\# 해설  
\$x\$에 \$1\$부터 차례로 자연수를 대입하면  
\$x \= 1\$일 때 \$y \= 10\$  
\$x \= 2\$일 때 \$y \= 7\$  
\$x \= 3\$일 때 \$y \= 4\$  
\$x \= 4\$일 때 \$y \= 1\$  
\$x \\ge 5\$이면 \$y \\le \-2\$이므로 자연수가 아니다.  
따라서 해는 \$4\$개이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-LINEAR\_EQ\_NATURAL\_COUNT", "primaryMethod": "계수가 큰 x에 1부터 자연수를 대입하여 y가 자연수가 되는 순서쌍 개수를 센다.", "decisiveStep": "x \= 1, 2, 3, 4일 때 y \= 10, 7, 4, 1로 4개임을 확인한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수가 2개인 일차방정식의 자연수 해 개수"}, "crossConceptKeys": \["CC\_LINEAR\_EQUATIONS\_TWO\_VARIABLES"\], "conditionKeys": \["COND\_NATURAL\_NUMBER"\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "자연수 x를 대입해 y가 자연수인지 바로 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차방정식", "자연수"\], "goal": \["개수"\], "method": \["대입"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\#\# Q03  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음은 식의 대입을 이용하여 연립방정식

\$\\begin{cases} x \= 3y & \\cdots \\text{㉠} \\\\ x \+ y \= 8 & \\cdots \\text{㉡} \\end{cases}\$

을 푸는 과정이다. \$\\fbox{1} \+ \\fbox{2} \+ \\fbox{3}\$의 값은?

\$x\$를 없애기 위하여 ㉠을 ㉡에 대입하면 \$3y \+ y \= 8\$  
일차방정식을 풀면 \$4y \= \\fbox{1}\$, \$y \= \\fbox{2}\$  
\$y \= \\fbox{2}\$를 ㉠에 대입하면 \$x \= \\fbox{3}\$  
따라서 구하는 해는 \$x \= \\fbox{3},\\ y \= \\fbox{2}\$  
\#\#\# 선지  
① \$12\$ ② \$13\$ ③ \$14\$ ④ \$15\$ ⑤ \$16\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
\$4y \= 8\$이므로 \$\\fbox{1} \= 8\$, \$y \= 2\$이므로 \$\\fbox{2} \= 2\$  
\$y \= 2\$를 ㉠에 대입하면 \$x \= 6\$이므로 \$\\fbox{3} \= 6\$  
\$\\therefore \\fbox{1} \+ \\fbox{2} \+ \\fbox{3} \= 8 \+ 2 \+ 6 \= 16\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-SUBSTITUTION\_STEPS\_SUM", "primaryMethod": "대입법 풀이 과정의 빈칸 수치를 차례로 구해 8 \+ 2 \+ 6을 계산한다.", "decisiveStep": "4y \= 8, y \= 2, x \= 6을 각각 구해 합 16을 얻는다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "대입법"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "대입법 과정 빈칸 채우기"}, "crossConceptKeys": \["CC\_SIMULTANEOUS\_LINEAR\_EQUATIONS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제시된 대입법 풀이 단계의 빈칸을 그대로 채우는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식"\], "goal": \["합"\], "method": \["대입법"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q04  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
연립방정식 \$\\begin{cases} ax \- by \= 10 \\\\ ax \+ by \= 2 \\end{cases}\$의 해가 \$(1, \-2)\$일 때, \$a \+ b\$의 값은? (단, \$a, b\$는 상수)  
\#\#\# 선지  
① \$8\$ ② \$7\$ ③ \$6\$ ④ \$5\$ ⑤ \$4\$  
\#\#\# 정답  
①  
\#\#\# 해설  
\$x \= 1,\\ y \= \-2\$를 두 식에 대입하면  
\$\\begin{cases} a \+ 2b \= 10 \\\\ a \- 2b \= 2 \\end{cases}\$  
두 식을 더하면 \$2a \= 12 \\implies a \= 6\$  
\$6 \+ 2b \= 10 \\implies 2b \= 4 \\implies b \= 2\$  
\$\\therefore a \+ b \= 6 \+ 2 \= 8\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-GIVEN\_SOLUTION\_TO\_PARAMS", "primaryMethod": "해 (1, \-2)를 두 식에 대입해 a, b에 대한 연립방정식을 만들고 가감법으로 풀어 합한다.", "decisiveStep": "a \+ 2b \= 10과 a \- 2b \= 2를 연립해 a \= 6, b \= 2를 얻는다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "해가 주어진 연립방정식 계수 합 구하기"}, "crossConceptKeys": \["CC\_SUBSTITUTION\_IN\_EQUATIONS", "CC\_COEFFICIENT\_DETERMINATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "해를 대입하면 바로 a, b에 대한 간단한 합·차 연립방정식이 되는 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식", "해"\], "goal": \["합"\], "method": \["대입", "가감법"\], "condition": \["상수"\]}, "hold": ""}  
\`\`\`

\#\# Q05  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
호수공원에서 시속 \$6\\text{ km}\$로 뛰다가 힘들어서 시속 \$3\\text{ km}\$로 걸었더니 한 바퀴 도는 데 \$2\$시간 \$20\$분이 걸렸다. 뛰어간 거리와 걸어간 거리의 차가 \$2\\text{ km}\$일 때, 호수공원의 둘레를 구하면? (단, 뛰어간 거리가 걸어간 거리보다 길다.)  
\#\#\# 선지  
① \$8\\text{ km}\$ ② \$9\\text{ km}\$ ③ \$10\\text{ km}\$ ④ \$11\\text{ km}\$ ⑤ \$12\\text{ km}\$  
\#\#\# 정답  
③  
\#\#\# 해설  
뛰어간 거리를 \$x\\text{ km}\$, 걸어간 거리를 \$y\\text{ km}\$라 하면 \$2\$시간 \$20\$분 \$= \\frac{7}{3}\$시간이므로  
\$\\begin{cases} x \- y \= 2 \\\\ \\frac{x}{6} \+ \\frac{y}{3} \= \\frac{7}{3} \\end{cases}\$  
둘째 식에 \$6\$을 곱하면 \$x \+ 2y \= 14\$  
\$x \= y \+ 2\$를 대입하면 \$(y \+ 2\) \+ 2y \= 14 \\implies 3y \= 12 \\implies y \= 4\$, \$x \= 6\$  
따라서 호수공원의 둘레는 \$x \+ y \= 6 \+ 4 \= 10\\text{ km}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION\_WORD", "conceptClusterKey": "M2-03-WORD\_PARK\_PERIMETER", "primaryMethod": "거리 차 x \- y \= 2와 총 시간 x/6 \+ y/3 \= 7/3을 연립해 x, y를 구하여 합한다.", "decisiveStep": "2시간 20분을 7/3시간으로 바꾸어 x \+ 2y \= 14와 x \- y \= 2를 연립한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "속력·시간·거리", "l4": "마주가기·따라가기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "속력·시간·거리 연립방정식 활용"}, "crossConceptKeys": \["CC\_SPEED\_DISTANCE\_TIME", "CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "시간 단위를 통일하고 거리 차와 시간 합 조건으로 연립방정식을 세워 풀어야 한다.", "level": "중", "item4slot": {"given": \["속력", "거리"\], "goal": \["둘레"\], "method": \["연립방정식", "대입법"\], "condition": \["거리"\]}, "hold": ""}  
\`\`\`

\#\# Q06  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
연립방정식 \$\\begin{cases} 3x \+ 2y \= 5 \\\\ x \+ 3y \= a \\end{cases}\$의 해를 구하는 과정 중 \$x \= \-1\$가 됨을 알게 되었다. 이때 상수 \$a\$의 값을 구하면?  
\#\#\# 선지  
① \$9\$ ② \$11\$ ③ \$13\$ ④ \$15\$ ⑤ \$17\$  
\#\#\# 정답  
②  
\#\#\# 해설  
\$x \= \-1\$을 \$3x \+ 2y \= 5\$에 대입하면 \$-3 \+ 2y \= 5 \\implies 2y \= 8 \\implies y \= 4\$  
\$x \= \-1, y \= 4\$를 \$x \+ 3y \= a\$에 대입하면 \$a \= \-1 \+ 3 \\times 4 \= 11\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-PARTIAL\_SOLUTION\_TO\_PARAM", "primaryMethod": "x \= \-1을 첫째 식에 대입해 y \= 4를 구한 뒤 ( \-1, 4 )를 둘째 식에 대입해 a를 구한다.", "decisiveStep": "y \= 4를 구하고 a \= \-1 \+ 12 \= 11을 계산한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "한 미지수 값이 주어졌을 때 상수 구하기"}, "crossConceptKeys": \["CC\_SUBSTITUTION\_IN\_EQUATIONS", "CC\_COEFFICIENT\_DETERMINATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 x 값을 첫째 식과 둘째 식에 차례로 대입하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식", "해"\], "goal": \["상수"\], "method": \["대입"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q07  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
연립방정식 \$\\begin{cases} 0.4x \+ 0.3(y \- 2\) \= 3 \\\\ \\frac{x \- 2}{4} \- \\frac{y \- 1}{3} \= 0 \\end{cases}\$의 해를 \$(a, b)\$라고 할 때, \$2a \- b\$의 값을 구하면?  
\#\#\# 선지  
① \$4\$ ② \$6\$ ③ \$8\$ ④ \$10\$ ⑤ \$12\$  
\#\#\# 정답  
③  
\#\#\# 해설  
첫째 식에 \$10\$, 둘째 식에 \$12\$를 곱하면  
\$\\begin{cases} 4x \+ 3(y \- 2\) \= 30 \\\\ 3(x \- 2\) \- 4(y \- 1\) \= 0 \\end{cases} \\implies \\begin{cases} 4x \+ 3y \= 36 & \\cdots \\text{㉠} \\\\ 3x \- 4y \= 2 & \\cdots \\text{㉡} \\end{cases}\$  
\$\\text{㉠} \\times 4 \+ \\text{㉡} \\times 3\$을 하면 \$25x \= 150 \\implies x \= 6\$  
\$x \= 6\$을 ㉠에 대입하면 \$24 \+ 3y \= 36 \\implies 3y \= 12 \\implies y \= 4\$  
따라서 \$a \= 6,\\ b \= 4\$이므로 \$2a \- b \= 12 \- 4 \= 8\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-COMPLEX\_DEC\_FRAC\_BRACKET\_SYSTEM", "primaryMethod": "소수·괄호 식에 10, 분수·괄호 식에 12를 곱해 4x \+ 3y \= 36, 3x \- 4y \= 2로 정리한 뒤 가감법으로 푼다.", "decisiveStep": "25x \= 150에서 x \= 6, y \= 4를 구해 2a \- b \= 8을 계산한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "복잡한 꼴의 연립방정식", "l4": "분수·소수가 있는 연립방정식"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_SYSTEM\_OF\_EQUATIONS\_DECIMAL\_COEFFICIENTS", "templateKey": null, "why": "소수·분수·괄호가 섞인 연립방정식"}, "crossConceptKeys": \["CC\_DECIMAL\_COEFFICIENTS", "CC\_FRACTION\_COEFFICIENTS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "소수와 분수, 괄호를 모두 정수 계수 표준형으로 정리한 뒤 가감법을 적용해야 한다.", "level": "중", "item4slot": {"given": \["연립방정식", "분수"\], "goal": \["차"\], "method": \["분배법칙", "가감법"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q08  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
두 연립방정식 \$\\begin{cases} 3x \+ y \= 7 \\\\ 2x \- 3y \= a \\end{cases},\\quad \\begin{cases} x \+ y \= 3 \\\\ bx \+ y \= 7 \\end{cases}\$의 해가 서로 같을 때, \$a \+ b\$의 값을 구하면? (단, \$a, b\$는 상수)  
\#\#\# 선지  
① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$  
\#\#\# 정답  
①  
\#\#\# 해설  
공통 해는 \$\\begin{cases} 3x \+ y \= 7 \\\\ x \+ y \= 3 \\end{cases}\$의 해와 같다.  
첫째 식에서 둘째 식을 빼면 \$2x \= 4 \\implies x \= 2\$, \$y \= 3 \- 2 \= 1\$  
\$x \= 2, y \= 1\$을 \$2x \- 3y \= a\$에 대입하면 \$a \= 4 \- 3 \= 1\$  
\$x \= 2, y \= 1\$을 \$bx \+ y \= 7\$에 대입하면 \$2b \+ 1 \= 7 \\implies b \= 3\$  
\$\\therefore a \+ b \= 1 \+ 3 \= 4\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-COMMON\_SOLUTION\_PARAMETERS", "primaryMethod": "상수 계수인 두 식 3x \+ y \= 7과 x \+ y \= 3을 연립해 (2, 1)을 구한 뒤 대입해 a, b를 구한다.", "decisiveStep": "공통 해 (2, 1)로부터 a \= 1, b \= 3을 구해 합 4를 얻는다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_SYSTEM\_OF\_EQUATIONS\_COMMON\_SOLUTION", "templateKey": null, "why": "해가 같은 두 연립방정식의 상수 합"}, "crossConceptKeys": \["CC\_COMMON\_SOLUTION", "CC\_COEFFICIENT\_DETERMINATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미지 계수가 없는 두 식을 골라 공통 해를 구하고 나머지 식에 대입하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["연립방정식", "상수"\], "goal": \["합"\], "method": \["가감법", "대입"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q09  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
다음 두 변수 \$x, y\$에 대하여 \$y\$가 \$x\$의 함수가 아닌 것을 고르면?  
\#\#\# 선지  
① 한 자루에 \$700\$원 하는 연필을 \$x\$자루 살 때, 지불하는 금액 \$y\$원 ② 넓이가 \$24\\text{ cm}^{2}\$인 직사각형의 가로의 길이 \$x\\text{ cm}\$와 세로의 길이 \$y\\text{ cm}\$ ③ 자연수 \$x\$의 약수의 개수 \$y\$개 ④ 시속 \$x\\text{ km}\$로 \$5\$시간 달린 거리 \$y\\text{ km}\$ ⑤ 자연수 \$x\$보다 큰 자연수 \$y\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
① \$y \= 700x\$, ② \$y \= \\frac{24}{x}\$, ③ 약수의 개수는 유일함, ④ \$y \= 5x\$로 모두 함수이다.  
⑤ 자연수 \$x\$보다 큰 자연수 \$y\$는 무수히 많으므로 함수가 아니다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-NON\_FUNCTION\_IDENTIFICATION", "primaryMethod": "x의 값 하나에 y의 값이 오직 하나씩 정해지지 않는 관계를 보기에서 찾는다.", "decisiveStep": "자연수 x보다 큰 자연수 y는 무수히 많으므로 함수가 아님을 판별한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_FUNCTION\_AND\_LINEAR\_FUNCTION\_IDENTIFICATION", "templateKey": null, "why": "함수가 아닌 관계 고르기"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수의 기본 정의(유일 대응)를 문장형 보기에서 판정하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["자연수"\], "goal": \["함수"\], "method": \["대응"\], "condition": \["함수"\]}, "hold": ""}  
\`\`\`

\#\# Q10  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
한 개의 무게가 \$180\\text{ g}\$인 배 \$x\$개의 무게를 \$y\\text{ g}\$이라고 하면 \$y\$는 \$x\$의 함수이다. 이 함수를 \$y \= f(x)\$라고 할 때, \$f(5)\$의 값을 구하면?  
\#\#\# 선지  
① \$800\$ ② \$850\$ ③ \$900\$ ④ \$950\$ ⑤ \$1000\$  
\#\#\# 정답  
③  
\#\#\# 해설  
\$f(x) \= 180x\$이므로 \$f(5) \= 180 \\times 5 \= 900\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-FUNCTION\_VALUE\_WORD\_BASIC", "primaryMethod": "관계식 f(x) \= 180x를 세운 뒤 x \= 5를 대입하여 함숫값 900을 구한다.", "decisiveStep": "f(5) \= 180 \* 5 \= 900을 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_VALUE", "templateKey": null, "why": "실생활 함수식 세우기 및 함숫값 계산"}, "crossConceptKeys": \["CC\_FUNCTION\_VALUE"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "단위 무게에 개수를 곱하는 비례식을 세워 대입하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["함수"\], "goal": \["함숫값"\], "method": \["대입"\], "condition": \["함수"\]}, "hold": ""}  
\`\`\`

\#\# Q11  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
다음 중에서 일차함수인 것을 모두 찾은 것을 고르면?

ㄱ. \$y \= 4x \- 3\$  
ㄴ. \$y \= 2x\$  
ㄷ. \$y \= \\frac{5}{x}\$  
ㄹ. \$y \= \-2x \+ y \+ 1\$  
ㅁ. \$y \= x(x \- 3)\$  
\#\#\# 선지  
① ㄱ, ㄴ ② ㄱ, ㄷ ③ ㄷ, ㄹ ④ ㄱ, ㄴ, ㄷ ⑤ ㄷ, ㄹ, ㅁ  
\#\#\# 정답  
①  
\#\#\# 해설  
ㄱ. \$y \= 4x \- 3\$ (일차함수)  
ㄴ. \$y \= 2x\$ (일차함수)  
ㄷ. 분모에 \$x\$가 있으므로 일차함수가 아니다.  
ㄹ. \$y\$가 소거되어 \$-2x \+ 1 \= 0\$이므로 함수가 아니다.  
ㅁ. \$y \= x^{2} \- 3x\$ (이차함수)  
따라서 일차함수인 것은 ① ㄱ, ㄴ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-IDENTIFY\_LINEAR\_FUNCTION", "primaryMethod": "y \= ax \+ b (a \!= 0\) 꼴이 되는 식만 ㄱ\~ㅁ 중에서 골라낸다.", "decisiveStep": "분모 x(ㄷ), y 소거(ㄹ), 이차식(ㅁ)을 제외하고 ㄱ, ㄴ을 선택한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_FUNCTION\_AND\_LINEAR\_FUNCTION\_IDENTIFICATION", "templateKey": null, "why": "일차함수인 식 모두 고르기"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차함수의 정의 y \= ax \+ b (a \!= 0)에 맞는지 각 식을 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["함수"\], "goal": \["일차함수"\], "method": \["이항"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q12  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= \-3x \+ 2\$의 그래프는 두 점 \$(1, p), (2, q)\$를 지난다. 이때 \$p \+ q\$의 값을 구하면?  
\#\#\# 선지  
① \$-2\$ ② \$-3\$ ③ \$-4\$ ④ \$-5\$ ⑤ \$-6\$  
\#\#\# 정답  
④  
\#\#\# 해설  
\$x \= 1\$일 때 \$p \= \-3(1) \+ 2 \= \-1\$  
\$x \= 2\$일 때 \$q \= \-3(2) \+ 2 \= \-4\$  
\$\\therefore p \+ q \= \-1 \+ (-4) \= \-5\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-GRAPH\_POINTS\_EVAL\_SUM", "primaryMethod": "x \= 1과 x \= 2를 y \= \-3x \+ 2에 각각 대입해 p \= \-1, q \= \-4를 구해 더한다.", "decisiveStep": "p \= \-1, q \= \-4를 구해 합 \-5를 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_VALUE", "templateKey": null, "why": "그래프 위의 두 점 y좌표 합 구하기"}, "crossConceptKeys": \["CC\_POINT\_SUBSTITUTION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x좌표 두 개를 식에 대입해 y좌표를 구해 더하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수", "점"\], "goal": \["합"\], "method": \["대입"\], "condition": \["점"\]}, "hold": ""}  
\`\`\`

\#\# Q13  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= 2x\$의 그래프를 \$y\$축의 방향으로 \$-5\$만큼 평행이동한 직선을 그래프로 하는 일차함수의 식을 구하면?  
\#\#\# 선지  
① \$y \= \-2x\$ ② \$y \= 2x \- 5\$ ③ \$y \= 2x \+ 5\$ ④ \$y \= 5x \- 2\$ ⑤ \$y \= \-5x \+ 2\$  
\#\#\# 정답  
②  
\#\#\# 해설  
\$y \= 2x\$의 그래프를 \$y\$축의 방향으로 \$-5\$만큼 평행이동한 직선의 식은 \$y \= 2x \- 5\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-VERTICAL\_TRANSLATION\_BASIC", "primaryMethod": "y \= 2x의 우변에 평행이동량 \-5를 더해 식을 구한다.", "decisiveStep": "y \= 2x \+ (-5) \= 2x \- 5를 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_VERTICAL\_TRANSLATION", "templateKey": null, "why": "y축 방향 평행이동한 일차함수 식 구하기"}, "crossConceptKeys": \["CC\_PARALLEL\_TRANSLATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y축 방향 평행이동 공식을 한 번 적용하면 바로 답이 나오는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["일차함수"\], "method": \["평행이동"\], "condition": \["평행이동"\]}, "hold": ""}  
\`\`\`

\#\# Q14  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= \-4x \+ 5\$의 그래프는 일차함수 \$y \= \-4x \- 2\$의 그래프를 \$y\$축의 방향으로 얼마만큼 평행이동한 것인지 구하면?  
\#\#\# 선지  
① \$-7\$ ② \$-3\$ ③ \$3\$ ④ \$5\$ ⑤ \$7\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
\$y \= \-4x \- 2\$의 그래프를 \$y\$축의 방향으로 \$k\$만큼 평행이동하면 \$y \= \-4x \- 2 \+ k\$  
\$-2 \+ k \= 5 \\implies k \= 7\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-TRANSLATION\_AMOUNT", "primaryMethod": "두 그래프의 y절편 \-2와 5의 차 5 \- (-2) \= 7로 평행이동량을 구한다.", "decisiveStep": "-2 \+ k \= 5에서 k \= 7을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_VERTICAL\_TRANSLATION", "templateKey": null, "why": "y축 방향 평행이동한 크기 구하기"}, "crossConceptKeys": \["CC\_PARALLEL\_TRANSLATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 일차함수의 상수항 차이만 계산하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["상수"\], "method": \["평행이동"\], "condition": \["평행이동"\]}, "hold": ""}  
\`\`\`

\#\# Q15  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= \-x \- 5\$의 그래프의 \$x\$절편과 \$y\$절편을 순서대로 바르게 구한 것은?  
\#\#\# 선지  
① \$-5, \-5\$ ② \$-5, 5\$ ③ \$5, \-5\$ ④ \$5, 5\$ ⑤ \$-1, \-5\$  
\#\#\# 정답  
①  
\#\#\# 해설  
\$y \= 0\$일 때 \$0 \= \-x \- 5 \\implies x \= \-5\$이므로 \$x\$절편은 \$-5\$  
\$x \= 0\$일 때 \$y \= \-5\$이므로 \$y\$절편은 \$-5\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-FIND\_BOTH\_INTERCEPTS", "primaryMethod": "y \= 0을 대입해 x절편 \-5를 구하고 상수항에서 y절편 \-5를 읽는다.", "decisiveStep": "x절편 \-5와 y절편 \-5를 순서대로 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "일차함수의 x절편과 y절편 구하기"}, "crossConceptKeys": \["CC\_INTERCEPTS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절편의 정의에 따라 x \= 0, y \= 0을 각각 대입하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["x절편", "y절편"\], "method": \["x절편", "y절편"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q16  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
두 점 \$(0, 6)\$, \$(2, 0)\$을 지나는 일차함수의 그래프의 기울기를 구하면?  
\#\#\# 선지  
① \$6\$ ② \$3\$ ③ \$-1\$ ④ \$-3\$ ⑤ \$-6\$  
\#\#\# 정답  
④  
\#\#\# 해설  
기울기는 \$\\frac{0 \- 6}{2 \- 0} \= \\frac{-6}{2} \= \-3\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-SLOPE\_FROM\_INTERCEPTS", "primaryMethod": "두 점 (0, 6), (2, 0)의 y좌표 차를 x좌표 차로 나누어 기울기 \-3을 구한다.", "decisiveStep": "(0 \- 6)/(2 \- 0\) \= \-3을 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 절편을 지나는 직선의 기울기"}, "crossConceptKeys": \["CC\_SLOPE\_FORMULA", "CC\_INTERCEPTS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기울기 공식을 한 번 적용하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수", "점"\], "goal": \["기울기"\], "method": \["기울기"\], "condition": \["점"\]}, "hold": ""}  
\`\`\`

\#\# Q17  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 일차함수 중에서 그래프가 오른쪽 아래를 향하는 것을 모두 찾은 것을 고르면?

ㄱ. \$y \= \-2x \+ 4\$  
ㄴ. \$y \= \-3 \+ 4x\$  
ㄷ. \$y \= \\frac{2}{5}x \- 3\$  
ㄹ. \$y \= \-5x\$  
ㅁ. \$y \= \-3(x \- 1\) \+ 2\$  
\#\#\# 선지  
① ㄱ, ㄴ, ㄷ ② ㄱ, ㄴ, ㄹ ③ ㄱ, ㄹ, ㅁ ④ ㄴ, ㄹ, ㅁ ⑤ ㄷ, ㄹ, ㅁ  
\#\#\# 정답  
③  
\#\#\# 해설  
그래프가 오른쪽 아래를 향하려면 기울기가 음수이어야 한다.  
ㄱ. 기울기 \$-2 \< 0\$  
ㄴ. 기울기 \$4 \> 0\$  
ㄷ. 기울기 \$\\frac{2}{5} \> 0\$  
ㄹ. 기울기 \$-5 \< 0\$  
ㅁ. \$y \= \-3x \+ 5\$이므로 기울기 \$-3 \< 0\$  
따라서 옳은 것은 ③ ㄱ, ㄹ, ㅁ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-SLOPE\_SIGN\_DIRECTION", "primaryMethod": "ㅁ을 전개해 정리한 뒤 다섯 식 중 기울기가 음수인 식을 모두 고른다.", "decisiveStep": "기울기가 음수인 ㄱ(-2), ㄹ(-5), ㅁ(-3)을 선택한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "증가·감소"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "기울기 부호에 따른 그래프 방향 판별"}, "crossConceptKeys": \["CC\_SLOPE\_SIGN"\], "conditionKeys": \["COND\_NEGATIVE"\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "각 일차함수의 x 계수 부호만 확인하면 되는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["일차함수"\], "method": \["기울기"\], "condition": \["음수"\]}, "hold": ""}  
\`\`\`

\#\# Q18  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
일차함수 \$y \= ax \+ b\$의 그래프가 제\$1, 2, 4\$사분면을 지날 때, 일차함수 \$y \= \-ax \- b\$의 그래프가 지나지 않는 사분면을 구하면? (단, \$a, b\$는 상수)  
\#\#\# 선지  
① 제\$1\$사분면 ② 제\$2\$사분면 ③ 제\$3\$사분면 ④ 제\$4\$사분면 ⑤ 제\$2, 4\$사분면  
\#\#\# 정답  
②  
\#\#\# 해설  
\$y \= ax \+ b\$의 그래프가 제\$1, 2, 4\$사분면을 지나므로 기울기 \$a \< 0\$, \$y\$절편 \$b \> 0\$이다.  
따라서 \$y \= \-ax \- b\$에서 기울기 \$-a \> 0\$, \$y\$절편 \$-b \< 0\$이므로  
제\$1, 3, 4\$사분면을 지나고 제\$2\$사분면을 지나지 않는다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-QUADRANT\_SIGN\_FLIP", "primaryMethod": "y \= ax \+ b가 지나는 사분면으로 a \< 0, b \> 0을 정한 뒤 부호를 바꾼 \-a \> 0, \-b \< 0으로 새 직선의 사분면을 판별한다.", "decisiveStep": "기울기 \-a \> 0, y절편 \-b \< 0에서 제2사분면을 지나지 않음을 결정한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_QUADRANT\_CONDITION", "templateKey": null, "why": "부호 판정 후 지나지 않는 사분면 구하기"}, "crossConceptKeys": \["CC\_QUADRANTS", "CC\_SLOPE\_SIGN"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사분면에서 a, b 부호를 먼저 구하고 \-a, \-b 부호로 그래프를 다시 판정해야 한다.", "level": "중", "item4slot": {"given": \["일차함수", "사분면"\], "goal": \["사분면"\], "method": \["기울기", "y절편"\], "condition": \["사분면"\]}, "hold": ""}  
\`\`\`

\#\# Q19  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= \-2x \+ 3\$의 그래프에 대한 설명으로 옳지 않은 것을 고르면?  
\#\#\# 선지  
① \$x\$의 값이 \$2\$ 증가할 때, \$y\$의 값은 \$4\$ 감소한다. ② 오른쪽 아래로 향하는 직선이다. ③ 일차함수 \$y \= \-2x \- 1\$의 그래프와 평행하다. ④ 점 \$(2, 1)\$을 지난다. ⑤ 일차함수 \$y \= 3x \+ 3\$의 그래프와 \$y\$축 위에서 만난다.  
\#\#\# 정답  
④  
\#\#\# 해설  
① 기울기가 \$-2\$이므로 \$x\$가 \$2\$ 증가할 때 \$y\$는 \$4\$ 감소한다. (옳음)  
② 기울기가 음수이므로 오른쪽 아래로 향한다. (옳음)  
③ 기울기가 \$-2\$로 같고 \$y\$절편이 다르므로 평행하다. (옳음)  
④ \$x \= 2\$를 대입하면 \$y \= \-4 \+ 3 \= \-1 \\ne 1\$이므로 점 \$(2, 1)\$을 지나지 않는다. (옳지 않음)  
⑤ 두 그래프 모두 \$y\$절편이 \$3\$이므로 \$y\$축 위에서 만난다. (옳음)  
따라서 옳지 않은 것은 ④이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-LINEAR\_GRAPH\_PROPERTIES\_CHECK", "primaryMethod": "y \= \-2x \+ 3의 기울기, 평행, 지나는 점, y절편 성질을 다섯 보기별로 검증한다.", "decisiveStep": "x \= 2를 대입하면 y \= \-1이므로 점 (2, 1)을 지나지 않음을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "일차함수 그래프 성질 옳지 않은 것 고르기"}, "crossConceptKeys": \["CC\_SLOPE\_AND\_INTERCEPT", "CC\_POINT\_SUBSTITUTION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차함수의 기울기와 y절편, 점 대입을 바로 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["성질"\], "method": \["대입", "기울기"\], "condition": \["평행"\]}, "hold": ""}  
\`\`\`

\#\# Q20  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
일차함수 \$y \= ax \+ b\$의 그래프가 두 점 \$(-1, 5), (2, \-4)\$를 지날 때, \$ab\$의 값을 구하면?  
\#\#\# 선지  
① \$-14\$ ② \$-12\$ ③ \$-10\$ ④ \$-8\$ ⑤ \$-6\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
\$a \= \\frac{-4 \- 5}{2 \- (-1)} \= \\frac{-9}{3} \= \-3\$  
\$y \= \-3x \+ b\$에 \$(-1, 5)\$를 대입하면 \$5 \= 3 \+ b \\implies b \= 2\$  
\$\\therefore ab \= (-3) \\times 2 \= \-6\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-TWO\_POINTS\_SLOPE\_INTERCEPT\_PROD", "primaryMethod": "두 점 (-1, 5), (2, \-4)로 기울기 a \= \-3과 y절편 b \= 2를 구해 곱한다.", "decisiveStep": "a \= \-3, b \= 2를 구해 ab \= \-6을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 점을 지나는 일차함수 계수 곱"}, "crossConceptKeys": \["CC\_SLOPE\_FORMULA", "CC\_POINT\_SUBSTITUTION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 점으로 기울기를 구하고 한 점을 대입해 y절편을 구하는 기본 문항이다.", "level": "하", "item4slot": {"given": \["일차함수", "점"\], "goal": \["곱"\], "method": \["기울기", "대입"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q21  
\- 형식: 서답형  
\- 배점: 5  
\#\#\# 발문  
\[서술형 1\] 다음 두 방정식을 변끼리 더하거나 빼서 연립방정식 \$\\begin{cases} 4x \- y \= 9 \\\\ x \+ y \= 11 \\end{cases}\$을 푸는 과정을 서술하여라.  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$x \= 4,\\ y \= 7\$  
\#\#\# 해설  
\$\\begin{cases} 4x \- y \= 9 \\quad \\cdots\\cdots \\text{㉠} \\\\ x \+ y \= 11 \\quad \\cdots\\cdots \\text{㉡} \\end{cases}\$  
㉠과 ㉡을 변끼리 더하여 \$y\$를 소거하면 \$5x \= 20 \\implies x \= 4\$  
\$x \= 4\$를 ㉡에 대입하면 \$4 \+ y \= 11 \\implies y \= 7\$  
따라서 구하는 해는 \$x \= 4,\\ y \= 7\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-ELIMINATION\_METHOD\_BASIC", "primaryMethod": "y의 계수가 \-1과 \+1이므로 두 식을 변끼리 더해 x \= 4를 구하고 대입해 y \= 7을 구한다.", "decisiveStep": "5x \= 20에서 x \= 4를 얻고 y \= 7을 구한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "가감법"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_SYSTEM\_OF\_EQUATIONS\_ADDITION\_SUBTRACTION\_METHOD", "templateKey": null, "why": "가감법 서술형 풀이"}, "crossConceptKeys": \["CC\_SIMULTANEOUS\_LINEAR\_EQUATIONS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 식을 바로 더하면 y가 소거되는 1단계 가감법 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식"\], "goal": \["해"\], "method": \["가감법", "대입"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q22  
\- 형식: 서답형  
\- 배점: 5  
\#\#\# 발문  
\[서술형 2\] 어느 농장에는 소와 오리가 모두 \$25\$마리 있다. 소와 오리의 다리의 수의 합이 \$74\$개일 때, 소의 꼬리와 오리의 날개의 수의 합을 구하는 과정을 서술하여라.  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$38\$  
\#\#\# 해설  
소의 마릿수를 \$x\$, 오리의 마릿수를 \$y\$라 하면  
\$\\begin{cases} x \+ y \= 25 \\\\ 4x \+ 2y \= 74 \\end{cases}\$  
둘째 식의 양변을 \$2\$로 나누면 \$2x \+ y \= 37\$  
\$2x \+ y \= 37\$에서 \$x \+ y \= 25\$를 변끼리 빼면 \$x \= 12\$  
\$y \= 25 \- 12 \= 13\$  
소는 꼬리가 \$1\$개, 오리는 날개가 \$2\$개씩 있으므로  
소의 꼬리와 오리의 날개의 수의 합은 \$12 \\times 1 \+ 13 \\times 2 \= 12 \+ 26 \= 38\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "22", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION\_WORD", "conceptClusterKey": "M2-03-WORD\_ANIMALS\_LEGS\_COUNT", "primaryMethod": "마릿수 합 x \+ y \= 25와 다리 수 합 4x \+ 2y \= 74를 연립해 x \= 12, y \= 13을 구한 뒤 x \+ 2y를 계산한다.", "decisiveStep": "x \= 12, y \= 13을 구하고 꼬리·날개 합 12 \+ 26 \= 38을 계산한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "수와 개수", "l4": "개수·가격"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "동물의 마릿수와 다리 수 연립방정식 활용"}, "crossConceptKeys": \["CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \["COND\_NATURAL\_NUMBER"\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "마릿수와 다리 수로 연립방정식을 세워 풀고 마지막에 꼬리·날개 수를 환산해야 한다.", "level": "중", "item4slot": {"given": \["개수"\], "goal": \["합"\], "method": \["연립방정식", "가감법"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\#\# Q23  
\- 형식: 서답형  
\- 배점: 5  
\#\#\# 발문  
\[서술형 3\] 일차함수 \$y \= \-3x \+ 2\$의 그래프와 평행하고, \$x\$절편이 \$3\$인 직선을 그래프로 하는 일차함수의 식을 구하는 과정을 서술하여라.  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$y \= \-3x \+ 9\$  
\#\#\# 해설  
\$y \= \-3x \+ 2\$의 그래프와 평행하므로 구하는 일차함수의 기울기는 \$-3\$이다.  
\$y \= \-3x \+ b\$라 하면 \$x\$절편이 \$3\$, 즉 점 \$(3, 0)\$을 지나므로  
\$0 \= \-3 \\times 3 \+ b \\implies b \= 9\$  
따라서 구하는 일차함수의 식은 \$y \= \-3x \+ 9\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-PARALLEL\_AND\_X\_INTERCEPT\_LINE", "primaryMethod": "평행 조건으로 기울기 \-3을 정하고 x절편 (3, 0)을 대입해 y절편 9를 구한다.", "decisiveStep": "0 \= \-9 \+ b에서 b \= 9를 구해 y \= \-3x \+ 9를 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTIONS\_PARALLEL\_CONDITION", "templateKey": null, "why": "평행 조건과 x절편으로 일차함수 식 구하기"}, "crossConceptKeys": \["CC\_X\_INTERCEPT"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행한 기울기와 x절편 점 좌표를 대입하면 바로 풀리는 기본 문항이다.", "level": "하", "item4slot": {"given": \["일차함수", "x절편"\], "goal": \["일차함수"\], "method": \["기울기", "대입"\], "condition": \["평행"\]}, "hold": ""}  
\`\`\`

\#\# Q24  
\- 형식: 서답형  
\- 배점: 5  
\#\#\# 발문  
\[서술형 4\] 어떤 양초에 불을 붙이면 양초의 길이는 시간이 지남에 따라 일정하게 줄어든다고 한다. 이 양초에 불을 붙인 지 \$4\$분, \$8\$분이 지났을 때, 남은 양초의 길이는 각각 \$20\\text{ cm}\$, \$17\\text{ cm}\$가 되었다. 양초에 불을 붙인 지 \$24\$분이 지났을 때, 남은 양초의 길이를 구하는 과정을 서술하여라. (단, 양초에 불을 붙인 지 \$x\$분 지났을 때, 남은 양초의 길이를 \$y\\text{ cm}\$라고 하여 문제를 푸시오.)  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$5\\text{ cm}\$  
\#\#\# 해설  
두 점 \$(4, 20), (8, 17)\$을 지나므로 기울기는 \$\\frac{17 \- 20}{8 \- 4} \= \-\\frac{3}{4}\$  
\$y \= \-\\frac{3}{4}x \+ b\$에 \$(4, 20)\$을 대입하면 \$20 \= \-3 \+ b \\implies b \= 23\$  
따라서 관계식은 \$y \= \-\\frac{3}{4}x \+ 23\$  
\$x \= 24\$를 대입하면 \$y \= \-\\frac{3}{4} \\times 24 \+ 23 \= \-18 \+ 23 \= 5\$  
따라서 남은 양초의 길이는 \$5\\text{ cm}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-WORD\_CANDLE\_BURNING", "primaryMethod": "두 점 (4, 20), (8, 17)로 일차함수 식 y \= \-(3/4)x \+ 23을 세운 뒤 x \= 24를 대입한다.", "decisiveStep": "기울기 \-3/4와 y절편 23으로 식을 구하고 x \= 24일 때 y \= 5를 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "양초 연소 길이 일차함수 활용 서술형"}, "crossConceptKeys": \["CC\_APPLIED\_WORD\_PROBLEMS", "CC\_SLOPE\_FORMULA"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문장에서 두 점 좌표를 추출해 일차함수 식을 세우고 x \= 24에서의 함숫값을 구해야 한다.", "level": "중", "item4slot": {"given": \["일차함수", "점"\], "goal": \["길이"\], "method": \["기울기", "대입"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`  
