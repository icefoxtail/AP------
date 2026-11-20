\`\`\`json:exam  
{"stem": "25\_연향중\_1학기\_기말\_중2\_유사", "sourceArchiveFile": "original/middle/m2/1final/25\_연향중\_1학기\_기말\_중2\_기출.js", "examFolder": "1final", "grade": "중2", "curriculum": "2015", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-15"}  
\`\`\`

\#\# Q01  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
다음 중에서 미지수가 \$2\$개인 일차방정식인 것을 모두 고르면? (정답 \$2\$개)  
\#\#\# 선지  
① \$4x \- 3y \= 7\$ ② \$\\frac{1}{3}x \+ y \- 4\$ ③ \$x^{2} \- 3y \+ 2 \= 0\$ ④ \$3(x \+ 1\) \= 3x \- 2\$ ⑤ 자전거 \$x\$대와 세발자전거 \$y\$대의 바퀴 수의 합이 \$35\$일 때, \$x\$와 \$y\$ 사이의 관계식  
\#\#\# 정답  
①, ⑤  
\#\#\# 해설  
① \$4x \- 3y \- 7 \= 0\$으로 미지수가 \$2\$개인 일차방정식이다.  
② 등호가 없어 방정식이 아니다.  
③ \$x^{2}\$ 항이 있어 이차방정식이다.  
④ \$3x \+ 3 \= 3x \- 2 \\implies 5 \= 0\$으로 일차방정식이 아니다.  
⑤ \$2x \+ 3y \= 35\$이므로 미지수가 \$2\$개인 일차방정식이다.  
따라서 옳은 것은 ①, ⑤이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-IDENTIFY\_TWO\_VAR\_LINEAR\_EQ", "primaryMethod": "등호 유무, 미지수 개수 2개, 차수 1 조건을 다섯 보기에 적용해 일차방정식 2개를 고른다.", "decisiveStep": "등호 없는 ②, 이차 ③, 소거되는 ④를 제외하고 ①과 ⑤를 선택한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "미지수가 2개인 일차방정식 2개 고르기"}, "crossConceptKeys": \["CC\_LINEAR\_EQUATIONS\_TWO\_VARIABLES"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "미지수가 2개인 일차방정식의 정의를 각 보기에 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["방정식"\], "goal": \["일차방정식"\], "method": \["이항"\], "condition": \["일차방정식"\]}, "hold": ""}  
\`\`\`

\#\# Q02  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
지호가 퀴즈 대회에 참가하여 \$3\$점짜리 문제 \$x\$개와 \$4\$점짜리 문제 \$y\$개를 맞혀 얻은 점수는 \$24\$점이었다. 이를 만족시키는 음이 아닌 정수 \$x\$와 \$y\$의 순서쌍 \$(x, y)\$의 개수는?  
\#\#\# 선지  
① \$1\$개 ② \$2\$개 ③ \$3\$개 ④ \$4\$개 ⑤ \$5\$개  
\#\#\# 정답  
③  
\#\#\# 해설  
\$3x \+ 4y \= 24\$ (\$x, y\$는 음이 아닌 정수)에서 \$y \= 0, 1, 2, \\cdots\$를 대입하면  
\$y \= 0\$일 때 \$3x \= 24 \\implies x \= 8\$  
\$y \= 3\$일 때 \$3x \= 12 \\implies x \= 4\$  
\$y \= 6\$일 때 \$3x \= 0 \\implies x \= 0\$  
따라서 순서쌍 \$(x, y)\$는 \$(8, 0), (4, 3), (0, 6)\$의 \$3\$개이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-NONNEG\_INT\_SOLUTIONS\_COUNT", "primaryMethod": "3x \+ 4y \= 24를 세운 뒤 계수가 큰 y에 0 이상의 정수를 대입해 x도 음이 아닌 정수가 되는 순서쌍을 센다.", "decisiveStep": "(8, 0), (4, 3), (0, 6)의 3쌍이 전부임을 확인한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "해가 주어진 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "음이 아닌 정수 해의 순서쌍 개수"}, "crossConceptKeys": \["CC\_LINEAR\_EQUATIONS\_TWO\_VARIABLES"\], "conditionKeys": \["COND\_INTEGER"\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차방정식을 세우고 0 이상의 정수를 대입해 개수를 세는 기본 문항이다.", "level": "하", "item4slot": {"given": \["일차방정식", "정수"\], "goal": \["개수"\], "method": \["대입"\], "condition": \["정수"\]}, "hold": ""}  
\`\`\`

\#\# Q03  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
연립방정식 \$\\begin{cases} x \= 2y \- 5 \\\\ 3x \+ y \= 6 \\end{cases}\$을 풀면?  
\#\#\# 선지  
① \$x \= 1,\\ y \= 3\$ ② \$x \= 3,\\ y \= 4\$ ③ \$x \= 5,\\ y \= 5\$ ④ \$x \= 7,\\ y \= 6\$ ⑤ \$x \= 9,\\ y \= 7\$  
\#\#\# 정답  
①  
\#\#\# 해설  
\$x \= 2y \- 5\$를 \$3x \+ y \= 6\$에 대입하면  
\$3(2y \- 5\) \+ y \= 6 \\implies 7y \- 15 \= 6 \\implies 7y \= 21 \\implies y \= 3\$  
\$x \= 2(3) \- 5 \= 1\$  
따라서 해는 \$x \= 1,\\ y \= 3\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-SUBSTITUTION\_METHOD\_BASIC", "primaryMethod": "x \= 2y \- 5를 둘째 식에 대입해 y \= 3, x \= 1을 구한다.", "decisiveStep": "7y \= 21에서 y \= 3을 얻고 x \= 1을 구한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "연립방정식의 풀이", "l4": "대입법"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "대입법 기본 연립방정식 풀이"}, "crossConceptKeys": \["CC\_SIMULTANEOUS\_LINEAR\_EQUATIONS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x에 대해 정리된 식을 대입하면 바로 풀리는 1단계 대입법 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식"\], "goal": \["해"\], "method": \["대입법"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q04  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
연립방정식 \$\\begin{cases} x \+ y \= \-5 \\\\ x \- \\frac{1}{3}y \= 3 \\end{cases}\$의 해가 \$(a, b)\$일 때, \$a \- b\$의 값은?  
\#\#\# 선지  
① \$-7\$ ② \$-5\$ ③ \$1\$ ④ \$5\$ ⑤ \$7\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
\$\\begin{cases} x \+ y \= \-5 \\quad \\cdots\\cdots \\text{㉠} \\\\ x \- \\frac{1}{3}y \= 3 \\quad \\cdots\\cdots \\text{㉡} \\end{cases}\$  
㉠에서 ㉡을 변끼리 빼면 \$\\frac{4}{3}y \= \-8 \\implies y \= \-6\$  
\$y \= \-6\$을 ㉠에 대입하면 \$x \- 6 \= \-5 \\implies x \= 1\$  
따라서 \$a \= 1,\\ b \= \-6\$이므로 \$a \- b \= 1 \- (-6) \= 7\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-FRACTION\_ELIMINATION\_DIFF", "primaryMethod": "x의 계수가 1로 같으므로 두 식을 빼 y \= \-6을 구한 뒤 x \= 1을 구해 a \- b를 계산한다.", "decisiveStep": "(4/3)y \= \-8에서 y \= \-6을 얻고 1 \- (-6) \= 7을 계산한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "복잡한 꼴의 연립방정식", "l4": "분수·소수가 있는 연립방정식"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "분수 계수 연립방정식 해의 차"}, "crossConceptKeys": \["CC\_FRACTION\_COEFFICIENTS", "CC\_SIMULTANEOUS\_LINEAR\_EQUATIONS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 식을 바로 빼면 x가 소거되어 분수 계수 y를 구할 수 있는 기본 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식", "분수"\], "goal": \["차"\], "method": \["가감법", "대입"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q05  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
순서쌍 \$(2, 3), (-3, \-7)\$이 모두 일차방정식 \$ax \+ by \= 4\$의 해일 때, 상수 \$a, b\$에 대하여 \$ab\$의 값은?  
\#\#\# 선지  
① \$-32\$ ② \$-16\$ ③ \$-8\$ ④ \$16\$ ⑤ \$32\$  
\#\#\# 정답  
①  
\#\#\# 해설  
두 순서쌍을 \$ax \+ by \= 4\$에 각각 대입하면  
\$\\begin{cases} 2a \+ 3b \= 4 \\quad \\cdots\\cdots \\text{㉠} \\\\ \-3a \- 7b \= 4 \\quad \\cdots\\cdots \\text{㉡} \\end{cases}\$  
\$\\text{㉠} \\times 3 \+ \\text{㉡} \\times 2\$를 하면 \$-5b \= 20 \\implies b \= \-4\$  
\$b \= \-4\$를 ㉠에 대입하면 \$2a \- 12 \= 4 \\implies 2a \= 16 \\implies a \= 8\$  
\$\\therefore ab \= 8 \\times (-4) \= \-32\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-TWO\_SOLUTIONS\_TO\_COEFFS", "primaryMethod": "두 해 (2, 3), (-3, \-7)을 ax \+ by \= 4에 대입해 a, b에 대한 연립방정식을 세워 푼다.", "decisiveStep": "2a \+ 3b \= 4와 \-3a \- 7b \= 4를 연립해 a \= 8, b \= \-4를 구한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 해를 대입해 계수 연립방정식 풀기"}, "crossConceptKeys": \["CC\_SUBSTITUTION\_IN\_EQUATIONS", "CC\_COEFFICIENT\_DETERMINATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 순서쌍을 대입해 계수 a, b에 대한 연립방정식을 새로 세워 풀어야 한다.", "level": "중", "item4slot": {"given": \["일차방정식", "해"\], "goal": \["곱"\], "method": \["대입", "가감법"\], "condition": \["상수"\]}, "hold": ""}  
\`\`\`

\#\# Q06  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
K학교 작년 전체 학생 수는 \$400\$명이었다. 올해는 작년보다 남학생이 \$15\\%\$ 증가하고 여학생은 \$5\\%\$ 감소하여, 전체 학생 수는 \$12\$명이 증가하였다. 올해의 남학생 수는 몇 명인가?  
\#\#\# 선지  
① \$160\$명 ② \$168\$명 ③ \$176\$명 ④ \$184\$명 ⑤ \$192\$명  
\#\#\# 정답  
④  
\#\#\# 해설  
작년 남학생 수를 \$x\$명, 여학생 수를 \$y\$명이라 하면  
\$\\begin{cases} x \+ y \= 400 \\\\ \\frac{15}{100}x \- \\frac{5}{100}y \= 12 \\end{cases}\$  
둘째 식에 \$20\$을 곱하면 \$3x \- y \= 240\$  
두 식을 변끼리 더하면 \$4x \= 640 \\implies x \= 160\$  
올해의 남학생 수는 \$160 \\times \\left(1 \+ \\frac{15}{100}\\right) \= 160 \\times 1.15 \= 184\$(명)  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION\_WORD", "conceptClusterKey": "M2-03-WORD\_PERCENT\_CHANGE\_THIS\_YEAR", "primaryMethod": "작년 남녀 학생 수 x, y로 합과 증감량 연립방정식을 풀어 작년 남학생 수 160명을 구한 뒤 15% 증가한 올해 수를 계산한다.", "decisiveStep": "작년 남학생 수 x \= 160을 구한 뒤 올해 수 160 \* 1.15 \= 184를 계산한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "농도·비율", "l4": "증감률"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "증감률 연립방정식 활용(올해 값 계산)"}, "crossConceptKeys": \["CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \["COND\_NATURAL\_NUMBER"\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "작년 학생 수를 연립방정식으로 구한 뒤 15% 증가율을 적용해 올해 학생 수를 답해야 한다.", "level": "중", "item4slot": {"given": \["비율"\], "goal": \["자연수"\], "method": \["연립방정식", "가감법"\], "condition": \["비율"\]}, "hold": ""}  
\`\`\`

\#\# Q07  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
\$x, y\$에 대한 연립방정식 \$\\begin{cases} 3x \- y \= 11 \\\\ \-x \+ 2y \= 3 \\end{cases}\$의 해가 일차방정식 \$x \+ ay \= 1\$의 해일 때, 상수 \$a\$의 값은?  
\#\#\# 선지  
① \$-2\$ ② \$-1\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$  
\#\#\# 정답  
②  
\#\#\# 해설  
\$3x \- y \= 11\$에서 \$y \= 3x \- 11\$을 \$-x \+ 2y \= 3\$에 대입하면  
\$-x \+ 2(3x \- 11\) \= 3 \\implies 5x \= 25 \\implies x \= 5\$  
\$y \= 15 \- 11 \= 4\$  
이를 \$x \+ ay \= 1\$에 대입하면 \$5 \+ 4a \= 1 \\implies 4a \= \-4 \\implies a \= \-1\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION", "conceptClusterKey": "M2-03-SOLUTION\_SATISFIES\_THIRD\_EQ", "primaryMethod": "연립방정식의 해 (5, 4)를 먼저 구한 뒤 x \+ ay \= 1에 대입해 상수 a를 구한다.", "decisiveStep": "해 (5, 4)를 5 \+ 4a \= 1에 대입해 a \= \-1을 얻는다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식", "l3": "해와 계수", "l4": "계수 결정"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "연립방정식 해를 다른 일차방정식에 대입해 계수 구하기"}, "crossConceptKeys": \["CC\_SUBSTITUTION\_IN\_EQUATIONS", "CC\_COEFFICIENT\_DETERMINATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연립방정식을 풀어 얻은 해를 한 번 대입하면 바로 풀리는 기본 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식", "일차방정식"\], "goal": \["상수"\], "method": \["대입법", "대입"\], "condition": \["해"\]}, "hold": ""}  
\`\`\`

\#\# Q08  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
\$4\\%\$의 소금물과 \$10\\%\$의 소금물을 섞어 농도가 \$6\\%\$인 소금물 \$600\\text{ g}\$을 만들려고 한다. \$4\\%\$의 소금물의 양을 \$x\\text{ g}\$, \$10\\%\$의 소금물의 양을 \$y\\text{ g}\$이라 할 때, 다음은 \$x, y\$를 구하는 과정이다. 빈칸에 들어갈 내용으로 옳지 않은 것은?

\- 소금물의 양: \$x \+ y \= \\fbox{㉠}\$  
\- 소금의 양: \$\\fbox{㉡}x \+ \\frac{10}{100}y \= \\fbox{㉢} \\times 600\$  
두 식을 연립하여 풀면 \$x \= \\fbox{㉣},\\ y \= \\fbox{㉤}\$이다.  
\#\#\# 선지  
① ㉠ \$600\$ ② ㉡ \$\\frac{4}{100}\$ ③ ㉢ \$\\frac{8}{100}\$ ④ ㉣ \$400\$ ⑤ ㉤ \$200\$  
\#\#\# 정답  
③  
\#\#\# 해설  
만들려는 소금물의 양은 \$600\\text{ g}\$이므로 \$\\fbox{㉠} \= 600\$  
\$4\\%\$ 소금물 \$x\\text{ g}\$에 들어 있는 소금의 양은 \$\\frac{4}{100}x\\text{ g}\$이므로 \$\\fbox{㉡} \= \\frac{4}{100}\$  
\$6\\%\$ 소금물 \$600\\text{ g}\$에 들어 있는 소금의 양은 \$\\frac{6}{100} \\times 600\\text{ g}\$이므로 \$\\fbox{㉢} \= \\frac{6}{100}\$  
따라서 ㉢의 \$\\frac{8}{100}\$은 옳지 않다.  
연립방정식 \$\\begin{cases} x \+ y \= 600 \\\\ 4x \+ 10y \= 3600 \\end{cases}\$을 풀면 \$x \= 400,\\ y \= 200\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION\_WORD", "conceptClusterKey": "M2-03-WORD\_SALT\_SOLUTION\_STEPS", "primaryMethod": "소금물 양과 소금 양 등식에서 농도 비율 및 연립방정식 해를 차례로 확인해 틀린 빈칸을 찾는다.", "decisiveStep": "목표 농도가 6%이므로 ㉢은 6/100이어야 함을 판별한다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "농도·비율", "l4": "농도 혼합"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "소금물 농도 혼합 연립방정식 빈칸 판별"}, "crossConceptKeys": \["CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 농도 식의 빈칸 수치를 순서대로 대조하면 바로 풀리는 문항이다.", "level": "하", "item4slot": {"given": \["연립방정식", "비율"\], "goal": \["비율"\], "method": \["연립방정식"\], "condition": \["비율"\]}, "hold": ""}  
\`\`\`

\#\# Q09  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 중 \$y\$가 \$x\$의 함수가 아닌 것은?  
\#\#\# 선지  
① \$1\$개에 \$800\$원인 볼펜 \$x\$개의 값 \$y\$원 ② \$300\$쪽짜리 책을 \$x\$쪽 읽었을 때 남은 쪽수 \$y\$쪽 ③ 자연수 \$x\$와 \$10\$의 공배수 \$y\$ ④ 어느 학교 \$2\$학년 \$x\$반의 학생 수 \$y\$명 ⑤ 가로의 길이가 \$x\$이고, 세로의 길이가 \$y\$인 직사각형의 둘레의 길이가 \$24\$  
\#\#\# 정답  
③  
\#\#\# 해설  
① \$y \= 800x\$, ② \$y \= 300 \- x\$, ④ 반 번호마다 학생 수가 하나로 정해짐, ⑤ \$y \= 12 \- x\$로 모두 함수이다.  
③ 자연수 \$x\$와 \$10\$의 공배수는 무수히 많으므로 함수가 아니다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-NON\_FUNCTION\_IDENTIFICATION", "primaryMethod": "x 하나의 값에 y 값이 여러 개 대응하는 관계를 찾아 함수가 아닌 보기를 고른다.", "decisiveStep": "자연수 x와 10의 공배수 y는 무수히 많으므로 함수가 아님을 판별한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_FUNCTION\_AND\_LINEAR\_FUNCTION\_IDENTIFICATION", "templateKey": null, "why": "함수가 아닌 관계 고르기"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함수의 정의(유일 대응)를 문장에서 바로 판정하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["자연수"\], "goal": \["함수"\], "method": \["대응"\], "condition": \["함수"\]}, "hold": ""}  
\`\`\`

\#\# Q10  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
함수 \$f(x) \= 5x \+ 3\$에 대하여 \$f(a) \= \-12\$일 때, 상수 \$a\$의 값은?  
\#\#\# 선지  
① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$1\$ ⑤ \$3\$  
\#\#\# 정답  
①  
\#\#\# 해설  
\$f(a) \= 5a \+ 3 \= \-12\$  
\$5a \= \-15 \\implies a \= \-3\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-FUNCTION\_VALUE\_PREIMAGE", "primaryMethod": "f(a) \= 5a \+ 3을 \-12와 같다고 놓고 일차방정식을 풀어 a를 구한다.", "decisiveStep": "5a \+ 3 \= \-12에서 a \= \-3을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_VALUE", "templateKey": null, "why": "주어진 함숫값에 해당하는 x값 구하기"}, "crossConceptKeys": \["CC\_FUNCTION\_VALUE"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "함숫값 조건을 일차방정식으로 바로 푸는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["함수", "함숫값"\], "goal": \["상수"\], "method": \["대입"\], "condition": \["함숫값"\]}, "hold": ""}  
\`\`\`

\#\# Q11  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 중 \$y\$가 \$x\$에 대한 일차함수인 것은?  
\#\#\# 선지  
① \$y \= x^{2} \- 3\$ ② \$y \= \\frac{5}{x} \+ 1\$ ③ \$y \- 2 \= 4x \+ 5\$ ④ \$xy \= 8\$ ⑤ \$2x \+ y \= 2x \- 7\$  
\#\#\# 정답  
③  
\#\#\# 해설  
① 이차함수, ② 분모에 \$x\$가 있음, ④ 분모에 \$x\$가 있음(\$y \= \\frac{8}{x}\$), ⑤ \$y \= \-7\$(상수함수)  
③ \$y \= 4x \+ 7\$이므로 일차함수이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-IDENTIFY\_LINEAR\_FUNCTION", "primaryMethod": "각 식을 y에 대해 정리해 y \= ax \+ b (a \!= 0\) 꼴이 되는 식을 고른다.", "decisiveStep": "y \- 2 \= 4x \+ 5를 정리한 y \= 4x \+ 7이 일차함수임을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "일차함수 판별"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_FUNCTION\_AND\_LINEAR\_FUNCTION\_IDENTIFICATION", "templateKey": null, "why": "일차함수 식 판별"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "y에 대해 정리해 일차함수 정의를 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["함수"\], "goal": \["일차함수"\], "method": \["이항"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q12  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= 3x \+ k\$의 그래프를 \$y\$축의 방향으로 \$-5\$만큼 평행이동한 그래프가 점 \$(-1, 4)\$를 지날 때, 상수 \$k\$의 값은?  
\#\#\# 선지  
① \$-4\$ ② \$0\$ ③ \$4\$ ④ \$8\$ ⑤ \$12\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
\$y \= 3x \+ k\$를 \$y\$축의 방향으로 \$-5\$만큼 평행이동하면 \$y \= 3x \+ k \- 5\$  
점 \$(-1, 4)\$를 대입하면 \$4 \= 3(-1) \+ k \- 5 \\implies 4 \= \-8 \+ k \\implies k \= 12\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-VERTICAL\_TRANSLATION\_POINT", "primaryMethod": "y축 방향으로 \-5만큼 평행이동한 식 y \= 3x \+ k \- 5에 점 (-1, 4)를 대입해 k를 구한다.", "decisiveStep": "4 \= \-8 \+ k에서 k \= 12를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_VERTICAL\_TRANSLATION", "templateKey": null, "why": "평행이동한 그래프의 상수 구하기"}, "crossConceptKeys": \["CC\_PARALLEL\_TRANSLATION", "CC\_POINT\_SUBSTITUTION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동 식을 쓰고 점 좌표를 대입하면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수", "점"\], "goal": \["상수"\], "method": \["평행이동", "대입"\], "condition": \["평행이동"\]}, "hold": ""}  
\`\`\`

\#\# Q13  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= 3x \+ 12\$의 그래프의 \$x\$절편이 일차함수 \$y \= \-2x \+ 2k\$의 그래프의 \$y\$절편과 같을 때, 상수 \$k\$의 값은?  
\#\#\# 선지  
① \$-4\$ ② \$-2\$ ③ \$0\$ ④ \$2\$ ⑤ \$4\$  
\#\#\# 정답  
②  
\#\#\# 해설  
\$y \= 3x \+ 12\$의 \$x\$절편은 \$3x \+ 12 \= 0\$에서 \$x \= \-4\$  
\$y \= \-2x \+ 2k\$의 \$y\$절편은 \$2k\$  
두 값이 같으므로 \$2k \= \-4 \\implies k \= \-2\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-X\_INTERCEPT\_EQUALS\_Y\_INTERCEPT", "primaryMethod": "첫째 식의 x절편 \-4와 둘째 식의 y절편 2k를 구해 같다고 놓고 푼다.", "decisiveStep": "2k \= \-4에서 k \= \-2를 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "x절편과 y절편 일치 조건으로 상수 구하기"}, "crossConceptKeys": \["CC\_INTERCEPTS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "x절편과 y절편을 각각 구해 등치시키면 바로 풀리는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["상수"\], "method": \["x절편", "y절편"\], "condition": \["절편"\]}, "hold": ""}  
\`\`\`

\#\# Q14  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 중 일차함수 \$y \= \-\\frac{4}{3}x \+ 8\$의 그래프에 대한 설명으로 옳은 것은?  
\#\#\# 선지  
① \$x\$가 \$3\$만큼 증가할 때, \$y\$는 \$4\$만큼 증가한다. ② \$x\$절편은 \$8\$이다. ③ 제\$4\$사분면을 지나지 않는다. ④ \$x\$축과 만나는 점의 좌표는 \$(6, 0)\$이다. ⑤ \$y \= \-x \+ 8\$의 그래프와 기울기가 같다.  
\#\#\# 정답  
④  
\#\#\# 해설  
① 기울기가 \$-\\frac{4}{3}\$이므로 \$x\$가 \$3\$만큼 증가할 때 \$y\$는 \$4\$만큼 감소한다. (거짓)  
② \$x\$절편은 \$-\\frac{4}{3}x \+ 8 \= 0\$에서 \$x \= 6\$이다. (거짓)  
③ 기울기가 음수이고 \$y\$절편이 양수이므로 제\$1, 2, 4\$사분면을 지난다. (거짓)  
④ \$x\$절편이 \$6\$이므로 \$x\$축과 만나는 점의 좌표는 \$(6, 0)\$이다. (참)  
⑤ 기울기는 \$-\\frac{4}{3}\$로 \$-1\$과 다르다. (거짓)  
따라서 옳은 것은 ④이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-LINEAR\_GRAPH\_PROPERTIES\_CHECK", "primaryMethod": "y \= \-(4/3)x \+ 8의 기울기, x절편, 지나는 사분면을 보기별로 점검해 옳은 설명을 찾는다.", "decisiveStep": "x절편이 6이므로 x축과의 교점이 (6, 0)임을 확인한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "일차함수 그래프 성질 옳은 것 고르기"}, "crossConceptKeys": \["CC\_SLOPE\_AND\_INTERCEPT", "CC\_X\_INTERCEPT"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차함수의 기울기와 절편, 사분면을 바로 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일차함수"\], "goal": \["성질"\], "method": \["기울기", "x절편"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q15  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
세 점 \$(-2, \-3), (0, 3), (p, 3q)\$가 한 직선 위에 있을 때, \$p \- q\$의 값은?  
\#\#\# 선지  
① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$  
\#\#\# 정답  
②  
\#\#\# 해설  
두 점 \$(-2, \-3), (0, 3)\$을 지나는 직선의 기울기는 \$\\frac{3 \- (-3)}{0 \- (-2)} \= \\frac{6}{2} \= 3\$이고 \$y\$절편은 \$3\$이므로  
직선의 식은 \$y \= 3x \+ 3\$  
점 \$(p, 3q)\$가 이 직선 위에 있으므로 \$3q \= 3p \+ 3 \\implies q \= p \+ 1\$  
\$\\therefore p \- q \= \-1\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-COLLINEAR\_THREE\_POINTS\_DIFF", "primaryMethod": "두 점 (-2, \-3), (0, 3)으로 직선 y \= 3x \+ 3을 구한 뒤 (p, 3q)를 대입해 p \- q를 구한다.", "decisiveStep": "3q \= 3p \+ 3의 양변을 3으로 나누어 p \- q \= \-1을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "한 직선 위 세 점 조건으로 두 문자의 차 구하기"}, "crossConceptKeys": \["CC\_SLOPE\_FORMULA", "CC\_POINT\_SUBSTITUTION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 점으로 직선 식을 구하고 세 번째 점을 대입해 미지수 개별로 구하지 않고 p \- q를 도출해야 한다.", "level": "중", "item4slot": {"given": \["점", "직선"\], "goal": \["차"\], "method": \["기울기", "대입"\], "condition": \["직선"\]}, "hold": ""}  
\`\`\`

\#\# Q16  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
일차함수 \$y \= ax \+ 3\$의 그래프는 일차함수 \$y \= 5x \- 4\$의 그래프와 평행하고 점 \$(k, 13)\$을 지날 때, \$a \- k\$의 값은? (단, \$a\$는 상수)  
\#\#\# 선지  
① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$  
\#\#\# 정답  
④  
\#\#\# 해설  
\$y \= ax \+ 3\$이 \$y \= 5x \- 4\$와 평행하므로 \$a \= 5\$  
\$y \= 5x \+ 3\$이 점 \$(k, 13)\$을 지나므로 \$13 \= 5k \+ 3 \\implies 5k \= 10 \\implies k \= 2\$  
\$\\therefore a \- k \= 5 \- 2 \= 3\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-PARALLEL\_SLOPE\_AND\_POINT", "primaryMethod": "평행 조건에서 기울기 a \= 5를 구한 뒤 점 (k, 13)을 대입해 k \= 2를 구하여 차를 계산한다.", "decisiveStep": "a \= 5, 13 \= 5k \+ 3에서 k \= 2를 얻어 a \- k \= 3을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "일차함수 그래프의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTIONS\_PARALLEL\_CONDITION", "templateKey": null, "why": "평행한 일차함수가 지나는 점 좌표 차"}, "crossConceptKeys": \["CC\_POINT\_SUBSTITUTION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행 조건에서 기울기를 읽고 점 좌표를 대입하면 바로 풀리는 기본 문항이다.", "level": "하", "item4slot": {"given": \["일차함수", "점"\], "goal": \["차"\], "method": \["기울기", "대입"\], "condition": \["평행"\]}, "hold": ""}  
\`\`\`

\#\# Q17  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
\$ab \< 0,\\ a \- b \> 0\$일 때, 다음 중 일차함수 \$y \= ax \+ b\$의 그래프가 지나는 사분면을 모두 고른 것은?  
\#\#\# 선지  
① 제\$1, 2, 3\$사분면 ② 제\$1, 3, 4\$사분면 ③ 제\$1, 2, 4\$사분면 ④ 제\$2, 3, 4\$사분면 ⑤ 제\$1, 3\$사분면  
\#\#\# 정답  
②  
\#\#\# 해설  
\$ab \< 0\$이므로 \$a\$와 \$b\$의 부호는 서로 반대이다.  
\$a \- b \> 0\$, 즉 \$a \> b\$이므로 \$a \> 0,\\ b \< 0\$이다.  
따라서 \$y \= ax \+ b\$의 그래프는 기울기가 양수이고 \$y\$절편이 음수이므로 제\$1, 3, 4\$사분면을 지난다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "CONDITION", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-SIGN\_CONDITION\_QUADRANTS", "primaryMethod": "ab \< 0과 a \- b \> 0에서 a \> 0, b \< 0임을 결정해 기울기·y절편 부호로 지나는 사분면을 찾는다.", "decisiveStep": "a \> 0, b \< 0에서 제1, 3, 4사분면을 지남을 확정한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 그래프", "l4": "기울기·절편"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_QUADRANT\_CONDITION", "templateKey": null, "why": "부호 조건으로 일차함수 그래프가 지나는 사분면 판별"}, "crossConceptKeys": \["CC\_QUADRANTS", "CC\_SLOPE\_SIGN"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 부등식 조건에서 a, b 부호를 추론한 뒤 지나는 사분면을 결정해야 한다.", "level": "중", "item4slot": {"given": \["일차함수"\], "goal": \["사분면"\], "method": \["기울기", "y절편"\], "condition": \["사분면"\]}, "hold": ""}  
\`\`\`

\#\# Q18  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
두 일차함수 \$y \= x \- 8\$, \$y \= \-\\frac{1}{3}x \+ 4\$의 그래프와 \$y\$축으로 둘러싸인 도형의 넓이는?  
\#\#\# 선지  
① \$54\$ ② \$60\$ ③ \$66\$ ④ \$72\$ ⑤ \$78\$  
\#\#\# 정답  
①  
\#\#\# 해설  
두 일차함수의 그래프의 교점의 \$x\$좌표는 \$x \- 8 \= \-\\frac{1}{3}x \+ 4 \\implies \\frac{4}{3}x \= 12 \\implies x \= 9\$  
두 그래프의 \$y\$절편은 각각 \$-8, 4\$이므로 \$y\$축 위의 밑변의 길이는 \$4 \- (-8) \= 12\$  
높이는 교점의 \$x\$좌표의 절댓값 \$9\$이므로  
넓이는 \$\\frac{1}{2} \\times 12 \\times 9 \= 54\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_EQUATION", "conceptClusterKey": "M2-04-Y\_AXIS\_TRIANGLE\_AREA", "primaryMethod": "두 직선의 y절편 차 12를 밑변, 두 직선 교점의 x좌표 9를 높이로 하여 삼각형 넓이를 계산한다.", "decisiveStep": "y절편 차 12와 교점 x \= 9로부터 (1/2)\*12\*9 \= 54를 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 일차방정식의 관계", "l3": "그래프 활용", "l4": "넓이"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTIONS\_ENCLOSED\_AREA", "templateKey": null, "why": "두 일차함수와 y축으로 둘러싸인 삼각형의 넓이"}, "crossConceptKeys": \["CC\_INTERSECTION\_OF\_TWO\_GRAPHS", "CC\_POLYGON\_AREA", "CC\_Y\_INTERCEPT"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 직선의 교점과 두 y절편을 구해 밑변과 높이로 삼각형 넓이를 계산해야 한다.", "level": "중", "item4slot": {"given": \["일차함수", "삼각형"\], "goal": \["넓이"\], "method": \["연립방정식", "y절편"\], "condition": \["교점"\]}, "hold": ""}  
\`\`\`

\#\# Q19  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
두 점 \$(-1, 6), (2, 12)\$를 지나는 일차함수의 그래프의 기울기를 \$a\$, \$x\$절편을 \$b\$, \$y\$절편을 \$c\$라 할 때, \$a \+ b \+ c\$의 값은?  
\#\#\# 선지  
① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
기울기 \$a \= \\frac{12 \- 6}{2 \- (-1)} \= \\frac{6}{3} \= 2\$  
\$y \= 2x \+ c\$에 \$(-1, 6)\$을 대입하면 \$6 \= \-2 \+ c \\implies c \= 8\$  
\$y \= 2x \+ 8\$에서 \$y \= 0\$일 때 \$x \= \-4\$이므로 \$x\$절편 \$b \= \-4\$  
\$\\therefore a \+ b \+ c \= 2 \+ (-4) \+ 8 \= 6\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-SLOPE\_AND\_BOTH\_INTERCEPTS\_SUM", "primaryMethod": "두 점으로 기울기 a \= 2와 y절편 c \= 8을 구해 식을 세운 뒤 x절편 b \= \-4를 구하여 합한다.", "decisiveStep": "y \= 2x \+ 8에서 a \= 2, b \= \-4, c \= 8을 모두 구해 합 6을 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "두 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "두 점을 지나는 일차함수의 기울기와 두 절편 합"}, "crossConceptKeys": \["CC\_SLOPE\_FORMULA", "CC\_INTERCEPTS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선 식을 구한 뒤 기울기, x절편, y절편 세 값을 모두 구해 합산해야 한다.", "level": "중", "item4slot": {"given": \["점", "일차함수"\], "goal": \["합"\], "method": \["기울기", "x절편", "y절편"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q20  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
냄비에 담긴 \$100^{\\circ}\\text{C}\$의 물을 실온에 둔 지 \$15\$분 후의 물의 온도가 \$55^{\\circ}\\text{C}\$이었다. 물의 온도가 \$25^{\\circ}\\text{C}\$가 되는 것은 물을 실온에 둔 지 몇 분 후인가? (단, 실온에서 물의 온도가 내려가는 속도는 일정하다.)  
\#\#\# 선지  
① \$22\$분 ② \$23\$분 ③ \$24\$분 ④ \$25\$분 ⑤ \$26\$분  
\#\#\# 정답  
④  
\#\#\# 해설  
\$15\$분 동안 온도가 \$100 \- 55 \= 45(^{\\circ}\\text{C})\$ 내려갔으므로 \$1\$분마다 \$\\frac{45}{15} \= 3(^{\\circ}\\text{C})\$씩 내려간다.  
\$x\$분 후 물의 온도를 \$y^{\\circ}\\text{C}\$라 하면 \$y \= 100 \- 3x\$  
\$y \= 25\$를 대입하면 \$25 \= 100 \- 3x \\implies 3x \= 75 \\implies x \= 25\$(분 후)  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-WORD\_COOLING\_TEMPERATURE", "primaryMethod": "15분 동안 45도 감소로 분당 변화율 \-3도를 구해 y \= 100 \- 3x를 세운 뒤 y \= 25일 때의 x를 구한다.", "decisiveStep": "y \= 100 \- 3x에 y \= 25를 대입해 x \= 25분을 구한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "식 구하기", "l4": "기울기와 한 점으로 식 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_WORD\_PROBLEM\_TEMPERATURE", "templateKey": null, "why": "일정한 속도로 식는 물의 온도 일차함수 활용"}, "crossConceptKeys": \["CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 시점의 온도에서 변화율을 구해 일차함수를 세우고 목표 온도에 도달하는 시간을 구해야 한다.", "level": "중", "item4slot": {"given": \["일차함수"\], "goal": \["함숫값"\], "method": \["기울기", "대입"\], "condition": \["일차함수"\]}, "hold": ""}  
\`\`\`

\#\# Q21  
\- 형식: 서답형  
\- 배점: 7  
\#\#\# 발문  
\[서술형 1\] 민서는 문구점에서 \$1\$개에 \$1200\$원인 형광펜과 \$1\$개에 \$1800\$원인 볼펜을 합하여 \$12\$개를 주문하였다. 그런데 형광펜과 볼펜의 개수가 바뀌어서 배달되면서 처음에 주문한 총 금액보다 \$1200\$원이 더 비싸졌다고 한다. 처음에 주문한 형광펜의 개수는?  
(1) 미지수를 정하고, 문제를 해결하기 위한 연립방정식을 세우시오. \[3점\]  
(2) 연립방정식을 풀고, 처음에 주문한 형광펜의 개수를 구하시오. \[4점\]  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$7\$개  
\#\#\# 해설  
(1) 처음에 주문한 형광펜의 개수를 \$x\$개, 볼펜의 개수를 \$y\$개라 하면  
\$\\begin{cases} x \+ y \= 12 \\\\ (1800x \+ 1200y) \- (1200x \+ 1800y) \= 1200 \\end{cases}\$  
(2) 둘째 식을 정리하면 \$600x \- 600y \= 1200 \\implies x \- y \= 2\$  
\$\\begin{cases} x \+ y \= 12 \\\\ x \- y \= 2 \\end{cases}\$에서 두 식을 더하면 \$2x \= 14 \\implies x \= 7\$, \$y \= 5\$  
따라서 처음에 주문한 형광펜의 개수는 \$7\$개이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "CONTEXT", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-03", "subUnitKey": "M2-03-SIMULTANEOUS\_LINEAR\_EQUATION\_WORD", "conceptClusterKey": "M2-03-WORD\_SWAPPED\_QUANTITIES\_COST", "primaryMethod": "총 개수 x \+ y \= 12와 개수가 바뀌어 늘어난 금액 차 600x \- 600y \= 1200을 연립해 x를 구한다.", "decisiveStep": "바뀐 금액 차 식을 x \- y \= 2로 정리해 x \+ y \= 12와 연립하여 x \= 7을 얻는다.", "rpm": {"majorUnit": "일차부등식과 연립일차방정식", "midUnit": "연립일차방정식의 활용", "l3": "수와 개수", "l4": "개수·가격"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_SYSTEM\_OF\_EQUATIONS\_WORD\_PROBLEM\_COST", "templateKey": null, "why": "바뀐 개수 금액 차 연립방정식 서술형"}, "crossConceptKeys": \["CC\_APPLIED\_WORD\_PROBLEMS"\], "conditionKeys": \["COND\_NATURAL\_NUMBER"\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 물건의 개수가 뒤바뀐 경우의 금액 차를 식으로 세워 연립해야 한다.", "level": "중", "item4slot": {"given": \["개수"\], "goal": \["개수"\], "method": \["연립방정식", "가감법"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\#\# Q22  
\- 형식: 서답형  
\- 배점: 7  
\#\#\# 발문  
\[서술형 2\] 일차함수 \$y \= \-4x \+ 2\$의 그래프를 \$y\$축의 방향으로 \$p\$만큼 평행이동하였더니 일차함수 \$y \= 2ax\$의 그래프를 \$y\$축의 방향으로 \$-6\$만큼 평행이동한 그래프와 겹쳐졌다. 이때 \$a \- p\$의 값은? (단, \$a\$는 상수)  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$6\$  
\#\#\# 해설  
\$y \= \-4x \+ 2\$를 \$y\$축의 방향으로 \$p\$만큼 평행이동한 그래프의 식은 \$y \= \-4x \+ 2 \+ p\$  
\$y \= 2ax\$를 \$y\$축의 방향으로 \$-6\$만큼 평행이동한 그래프의 식은 \$y \= 2ax \- 6\$  
두 그래프가 겹쳐지므로 기울기와 \$y\$절편이 각각 같다.  
\$2a \= \-4 \\implies a \= \-2\$  
\$2 \+ p \= \-6 \\implies p \= \-8\$  
\$\\therefore a \- p \= \-2 \- (-8) \= 6\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-OVERLAPPING\_TRANSLATIONS", "primaryMethod": "두 그래프를 각각 평행이동한 식을 세운 뒤 기울기 일치(2a \= \-4)와 y절편 일치(2 \+ p \= \-6)를 이용해 a \- p를 구한다.", "decisiveStep": "a \= \-2, p \= \-8을 구해 a \- p \= 6을 계산한다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "그래프의 성질", "l4": "일차함수 그래프의 평행·일치"}, "ptTplCandidate": {"problemTypeKey": "PT\_M2\_LINEAR\_FUNCTION\_VERTICAL\_TRANSLATION", "templateKey": null, "why": "평행이동한 두 일차함수 일치 조건"}, "crossConceptKeys": \["CC\_PARALLEL\_TRANSLATION"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "각각 평행이동한 식의 기울기와 y절편을 바로 비교하면 풀리는 기본 문항이다.", "level": "하", "item4slot": {"given": \["일차함수", "상수"\], "goal": \["차"\], "method": \["평행이동", "등식"\], "condition": \["평행이동"\]}, "hold": ""}  
\`\`\`

\#\# Q23  
\- 형식: 서답형  
\- 배점: 6  
\#\#\# 발문  
\[서술형 3\] 두 함수 \$f(x) \= \\frac{4}{3}x\$, \$g(x) \= \\frac{16}{x}\$가 다음 조건을 모두 만족시킬 때, 상수 \$b\$의 값은?

\- (가) \$f(6) \= a\$  
\- (나) \$f(a) \= g(b)\$  
\#\#\# 선지  
없음  
\#\#\# 정답  
\$\\frac{3}{2}\$  
\#\#\# 해설  
(가)에서 \$a \= f(6) \= \\frac{4}{3} \\times 6 \= 8\$  
(나)에서 \$f(a) \= f(8) \= \\frac{4}{3} \\times 8 \= \\frac{32}{3}\$  
\$g(b) \= \\frac{16}{b}\$이므로 \$\\frac{32}{3} \= \\frac{16}{b}\$  
\$32b \= 48 \\implies b \= \\frac{48}{32} \= \\frac{3}{2}\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "중2", "courseKey": "M2-1", "curriculum": "2015", "standardUnitKey": "M2-04", "subUnitKey": "M2-04-LINEAR\_FUNCTION\_BASIC", "conceptClusterKey": "M2-04-CHAINED\_FUNCTION\_EVAL", "primaryMethod": "f(6) \= 8로 a를 먼저 구한 뒤 f(8) \= 32/3을 g(b) \= 16/b와 같다고 놓아 b를 구한다.", "decisiveStep": "32/3 \= 16/b에서 b \= 3/2을 얻는다.", "rpm": {"majorUnit": "일차함수", "midUnit": "일차함수와 그 그래프", "l3": "일차함수의 뜻", "l4": "함숫값"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_VALUE", "templateKey": null, "why": "연쇄 함숫값 조건을 이용한 상수 구하기"}, "crossConceptKeys": \["CC\_FUNCTION\_VALUE"\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 함숫값 식에 차례로 대입해 일차방정식을 풀면 되는 기본 문항이다.", "level": "하", "item4slot": {"given": \["함수", "함숫값"\], "goal": \["상수"\], "method": \["대입"\], "condition": \["함숫값"\]}, "hold": ""}  
\`\`\`  
