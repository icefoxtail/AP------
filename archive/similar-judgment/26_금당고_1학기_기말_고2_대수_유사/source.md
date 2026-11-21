\`\`\`json:exam  
{"stem": "26\_금당고\_1학기\_기말\_고2\_대수\_유사", "sourceArchiveFile": "original/high/h2/1final/26\_금당고\_1학기\_기말\_고2\_대수.js", "examFolder": "1final", "grade": "고2", "subject": "대수", "curriculum": "2022", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-21"}  
\`\`\`

\## Q01  
- 형식: 객관식  
- 배점: 3  
\#\## 발문  
다음 함수 \$y \= 4\\cos(3x) - 2\$에 대한 설명으로 옳지 않은 것은?  
\#\## 선지  
① 치역은 \$\\{y \\mid \-4 \\le y \\le 4\\}\$이다. ② 주기는 \$\\frac{2\\pi}{3}\$이다. ③ 최댓값은 \$2\$이다. ④ 최솟값은 \$-6\$이다. ⑤ 정의역은 실수 전체의 집합이다.  
\#\## 정답  
①  
\#\## 해설  
\$-1 \\le \\cos(3x) \\le 1\$에 \$4\$를 곱하고 \$2\$를 빼면  
\$\$-4 \\le 4\\cos(3x) \\le 4 \\implies \-6 \\le 4\\cos(3x) - 2 \\le 2\$\$  
따라서 최댓값은 \$2\$, 최솟값은 \$-6\$이고 치역은 \$\\{y \\mid \-6 \\le y \\le 2\\}\$이다.  
주기는 \$\\frac{2\\pi}{3}\$, 정의역은 실수 전체의 집합이므로 옳지 않은 것은 ①이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_GRAPH", "conceptClusterKey": "", "primaryMethod": "\$-1\\\\le\\\\cos(3x)\\\\le 1\$의 범위에 상수배와 평행이동을 적용해 치역과 주기를 판별한다.", "decisiveStep": "치역이 \$\[-6, 2\]\$임을 구해 \$\[-4, 4\]\$라는 ①이 거짓임을 확인하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 그래프", "l3": "그래프 변환", "l4": "주기·진폭"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_TRIG\_GRAPH\_TRANSFORM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-105, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "코사인 함수의 진폭·수직이동·주기 공식만 확인하면 즉시 풀린다.", "level": "하", "item4slot": {"given": \["삼각함수"\], "goal": \["성질"\], "method": \["평행이동", "삼각함수"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q02  
- 형식: 객관식  
- 배점: 3  
\#\## 발문  
등차수열 \$\\{a\_n\\}\$에서 \$a\_3 \= 5\$, \$a\_6 \= 17\$일 때, 수열 \$\\{a\_n\\}\$의 공차는?  
\#\## 선지  
① \$2\$ ② \$3\$ ③ \$5\$ ④ \$4\$ ⑤ \$6\$  
\#\## 정답  
④  
\#\## 해설  
공차를 \$d\$라 하면 \$a\_6 - a\_3 \= 3d\$이므로  
\$\$3d \= 17 - 5 \= 12 \\implies d \= 4\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "두 항의 차 \$a\_6 - a\_3 \= 3d\$로부터 공차를 구한다.", "decisiveStep": "\$3d \= 12\$에서 \$d \= 4\$를 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-115, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차수열 두 항의 차를 항 번호 차로 나누는 기초 계산 문항이다.", "level": "하", "item4slot": {"given": \["등차수열"\], "goal": \["공차"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q03  
- 형식: 객관식  
- 배점: 3  
\#\## 발문  
삼각형 \$ABC\$에서 \$A \= 30^\\circ\$, \$B \= 45^\\circ\$, \$a \= 5\$일 때, 외접원의 반지름의 길이 \$R\$의 값은?  
\#\## 선지  
① \$4\$ ② \$5\$ ③ \$6\$ ④ \$5\\sqrt{2}\$ ⑤ \$10\$  
\#\## 정답  
②  
\#\## 해설  
변 \$a\$와 그 대각 \$A \= 30^\\circ\$가 주어졌으므로 사인법칙에 의하여  
\$\$2R \= \\frac{a}{\\sin A} \= \\frac{5}{\\sin 30^\\circ} \= \\frac{5}{1/2} \= 10 \\implies R \= 5\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "사인법칙 \$\\\\frac{a}{\\\\sin A} \= 2R\$에 \$a=5, A=30^\\\\circ\$를 대입한다.", "decisiveStep": "\$2R \= \\\\frac{5}{1/2} \= 10\$에서 \$R \= 5\$를 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "사인법칙", "l4": "외접원 반지름"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_SINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-109, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "한 변과 대각이 주어져 사인법칙 1회 적용으로 반지름을 구한다.", "level": "하", "item4slot": {"given": \["삼각형", "길이"\], "goal": \["반지름"\], "method": \["사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q04  
- 형식: 객관식  
- 배점: 3.2  
\#\## 발문  
삼각형 \$ABC\$에서 \$a \= 8\$, \$b \= 5\$, \$C \= 60^\\circ\$일 때, 삼각형 \$ABC\$의 넓이는?  
\#\## 선지  
① \$8\\sqrt{3}\$ ② \$10\$ ③ \$10\\sqrt{2}\$ ④ \$12\\sqrt{3}\$ ⑤ \$10\\sqrt{3}\$  
\#\## 정답  
⑤  
\#\## 해설  
두 변 \$a \= 8\$, \$b \= 5\$와 끼인각 \$C \= 60^\\circ\$를 넓이 공식에 대입하면  
\$\$S \= \\frac{1}{2}ab\\sin C \= \\frac{1}{2} \\times 8 \\times 5 \\times \\sin 60^\\circ \= 20 \\times \\frac{\\sqrt{3}}{2} \= 10\\sqrt{3}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "두 변과 끼인각을 삼각형 넓이 공식 \$\\\\frac{1}{2}ab\\\\sin C\$에 대입한다.", "decisiveStep": "\$20\\\\sin 60^\\\\circ \= 10\\\\sqrt{3}\$을 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "두 변과 끼인각"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-113, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "그림의 변·각 조건을 텍스트로 제시해 넓이 공식을 바로 적용한다.", "level": "하", "item4slot": {"given": \["삼각형", "길이"\], "goal": \["넓이"\], "method": \["삼각형넓이공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q05  
- 형식: 객관식  
- 배점: 3.3  
\#\## 발문  
\$0 \\le x \< 2\\pi\$일 때, 부등식 \$\\sin x \> \\frac{\\sqrt{3}}{2}\$의 해는?  
\#\## 선지  
① \$\\frac{\\pi}{6} \< x \< \\frac{5\\pi}{6}\$ ② \$\\frac{\\pi}{3} \\le x \\le \\frac{2\\pi}{3}\$ ③ \$\\frac{\\pi}{3} \< x \< \\frac{2\\pi}{3}\$ ④ \$\\frac{\\pi}{4} \< x \< \\frac{3\\pi}{4}\$ ⑤ \$0 \< x \< \\frac{\\pi}{3}\$  
\#\## 정답  
③  
\#\## 해설  
\$0 \\le x \< 2\\pi\$에서 방정식 \$\\sin x \= \\frac{\\sqrt{3}}{2}\$의 두 해는 \$x \= \\frac{\\pi}{3}, \\frac{2\\pi}{3}\$이다.  
\$y \= \\sin x\$의 그래프가 직선 \$y \= \\frac{\\sqrt{3}}{2}\$보다 위쪽에 있는 구간은 \$\\frac{\\pi}{3} \< x \< \\frac{2\\pi}{3}\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_EQUATION", "conceptClusterKey": "", "primaryMethod": "\$\\\\sin x \= \\\\frac{\\\\sqrt{3}}{2}\$의 경계각을 구하고 사인 그래프 위쪽 구간을 선택한다.", "decisiveStep": "제1·2사분면 경계 \$\\\\frac{\\\\pi}{3}, \\\\frac{2\\\\pi}{3}\$ 사이의 열린구간을 택하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각방정식·부등식", "l4": "그래프를 이용한 해"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_TRIG\_EQUATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-101, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "한 주기 내 기본 삼각부등식의 경계를 구하는 기본 문항이다.", "level": "하", "item4slot": {"given": \["삼각부등식", "구간"\], "goal": \["해"\], "method": \["삼각부등식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q06  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
첫째항이 \$4\$이고 공비가 \$2\$인 등비수열에서 처음으로 \$500\$ 이상이 되는 항은 제 몇 항인가?  
\#\## 선지  
① 제\$8\$항 ② 제\$6\$항 ③ 제\$7\$항 ④ 제\$9\$항 ⑤ 제\$10\$항  
\#\## 정답  
①  
\#\## 해설  
일반항은 \$a\_n \= 4 \\cdot 2^{n-1} \= 2^{n+1}\$이다.  
\$2^8 \= 256 \< 500\$이고 \$2^9 \= 512 \\ge 500\$이므로 \$n \+ 1 \\ge 9\$, 즉 \$n \\ge 8\$이다.  
따라서 처음으로 \$500\$ 이상이 되는 항은 제\$8\$항이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "일반항 \$a\_n \= 2^{n+1}\$을 세워 \$2^{n+1} \\\\ge 500\$을 만족하는 최소 자연수 \$n\$을 구한다.", "decisiveStep": "\$2^8 \= 256 \< 500 \\\\le 512 \= 2^9\$에서 \$n+1=9\$를 찾는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-118, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "\$2\$의 거듭제곱 비교로 등비수열 부등식을 바로 풀 수 있다.", "level": "하", "item4slot": {"given": \["등비수열"\], "goal": \["자연수"\], "method": \["일반항"\], "condition": \["부등식"\]}, "hold": ""}  
\`\`\`

\## Q07  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
\$\\sum\_{k=1}^{12} a\_k \= 5\$일 때, \$\\sum\_{k=1}^{12} (3a\_k - 2)\$의 값은?  
\#\## 선지  
① \$-13\$ ② \$-11\$ ③ \$-9\$ ④ \$-7\$ ⑤ \$-5\$  
\#\## 정답  
③  
\#\## 해설  
\$\\sum\$의 선형성에 의해  
\$\$\\sum\_{k=1}^{12} (3a\_k - 2\) \= 3\\sum\_{k=1}^{12} a\_k - \\sum\_{k=1}^{12} 2 \= 3(5) - 2 \\times 12 \= 15 - 24 \= \-9\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "\$\\\\sum\$의 상수배와 상수항 합 공식을 분리 적용한다.", "decisiveStep": "\$\\\\sum\_{k=1}^{12} 2 \= 24\$를 빼서 \$15 - 24 \= \-9\$를 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "합의 기호 Σ", "l4": "성질"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SIGMA\_NOTATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-124, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합의 기호 선형성과 상수항 \$12\$번 더하기만 확인하면 된다.", "level": "하", "item4slot": {"given": \["수열의합"\], "goal": \["값"\], "method": \["시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q08  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
삼각형 \$ABC\$에 대하여 \$\\sin C \= \\frac{\\sqrt{6}}{3}\$일 때, \$\\cos(A \+ B) \\times \\sin\\left(\\frac{\\pi}{2} \+ C\\right)\$의 값은?  
\#\## 선지  
① \$-\\frac{2}{3}\$ ② \$-\\frac{1}{2}\$ ③ \$\\frac{1}{3}\$ ④ \$\\frac{2}{3}\$ ⑤ \$-\\frac{1}{3}\$  
\#\## 정답  
⑤  
\#\## 해설  
삼각형의 내각의 합 \$A \+ B \+ C \= \\pi\$에서 \$A \+ B \= \\pi - C\$이므로  
\$\$\\cos(A \+ B) \= \\cos(\\pi - C) \= \-\\cos C\$\$  
또 각 변환에 의해 \$\\sin\\left(\\frac{\\pi}{2} \+ C\\right) \= \\cos C\$이다.  
따라서 구하는 식의 값은  
\$\$(-\\cos C)(\\cos C) \= \-\\cos^2 C \= \-(1 - \\sin^2 C) \= \-\\left(1 - \\frac{6}{9}\\right) \= \-\\frac{1}{3}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_BASIC", "conceptClusterKey": "", "primaryMethod": "\$A+B=\\\\pi-C\$와 각 변환으로 식을 \$-\\\\cos^2 C\$로 정리한 뒤 \$\\\\sin^2 C+\\\\cos^2 C=1\$을 적용한다.", "decisiveStep": "\$\\\\cos(\\\\pi-C)\\\\sin(\\\\frac{\\\\pi}{2}+C) \= \-\\\\cos^2 C\$로 단순화하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 성질", "l4": "삼각함수 관계"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_TRIG\_PROPERTIES", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-100, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각형 내각 관계와 여각·보각 변환을 함께 적용해 제곱관계로 값을 구한다.", "level": "중하", "item4slot": {"given": \["삼각형", "삼각함수"\], "goal": \["값"\], "method": \["삼각함수의성질", "삼각함수의상호관계"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q09  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
두 대각선이 이루는 각의 크기가 \$150^\\circ\$이고 넓이가 \$16\$인 등변사다리꼴의 한 대각선의 길이는?  
\#\## 선지  
① \$6\$ ② \$8\$ ③ \$7\$ ④ \$9\$ ⑤ \$10\$  
\#\## 정답  
②  
\#\## 해설  
등변사다리꼴의 두 대각선의 길이는 같으므로 이를 \$d\$라 하면 사각형의 넓이는  
\$\$S \= \\frac{1}{2} d^2 \\sin 150^\\circ \= \\frac{1}{2} d^2 \\cdot \\frac{1}{2} \= \\frac{1}{4}d^2\$\$  
넓이가 \$16\$이므로 \$\\frac{1}{4}d^2 \= 16 \\implies d^2 \= 64\$이고 \$d \> 0\$이므로 \$d \= 8\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "등변사다리꼴의 두 대각선 길이가 같음을 이용해 사각형 넓이 공식 \$\\\\frac{1}{2}d^2\\\\sin\\\\theta\$에 대입한다.", "decisiveStep": "\$\\\\frac{1}{2}d^2\\\\sin 150^\\\\circ \= 16\$에서 \$d^2 \= 64\$를 푸는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "복합도형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-114, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사각형의 두 대각선 길이와 끼인각으로 넓이를 구하는 공식과 등변사다리꼴 성질을 결합한다.", "level": "중하", "item4slot": {"given": \["사각형", "넓이"\], "goal": \["길이"\], "method": \["삼각형넓이공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q10  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
삼각형 \$ABC\$에서 \$(\\sin A \+ \\sin B) : (\\sin B \+ \\sin C) : (\\sin C \+ \\sin A) \= 4 : 6 : 4\$일 때, \$\\cos C\$의 값은?  
\#\## 선지  
① \$\\frac{1}{2}\$ ② \$\\frac{1}{3}\$ ③ \$\\frac{1}{4}\$ ④ \$\\frac{1}{6}\$ ⑤ \$\\frac{1}{8}\$  
\#\## 정답  
④  
\#\## 해설  
비례식에서 첫째 항과 셋째 항의 비가 같으므로 \$\\sin A \+ \\sin B \= \\sin C \+ \\sin A \\implies \\sin B \= \\sin C\$이다.  
삼각형의 내각에서 \$B \+ C \= \\pi\$이면 \$A \= 0\$이 되어 모순이므로 \$B \= C\$이다.  
\$x \= \\sin A\$, \$y \= \\sin B \= \\sin C\$ (\$x, y \> 0\$)라 하면 \$(x \+ y) : 2y \= 4 : 6\$에서  
\$\$6(x \+ y) \= 8y \\implies 6x \= 2y \\implies y \= 3x\$\$  
사인법칙에 의해 \$a : b : c \= \\sin A : \\sin B : \\sin C \= 1 : 3 : 3\$이므로 \$a \= t\$, \$b \= 3t\$, \$c \= 3t\$ (\$t \> 0\$)로 놓을 수 있다.  
코사인법칙에 의하여  
\$\$\\cos C \= \\frac{a^2 \+ b^2 - c^2}{2ab} \= \\frac{t^2 \+ 9t^2 - 9t^2}{2 \\cdot t \\cdot 3t} \= \\frac{t^2}{6t^2} \= \\frac{1}{6}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "비례식으로 세 사인의 비를 구하고 사인법칙을 통해 세 변의 비로 바꾼 뒤 코사인법칙을 적용한다.", "decisiveStep": "\$a:b:c \= 1:3:3\$을 도출해 \$\\\\cos C \= \\\\frac{1+9-9}{6} \= \\\\frac{1}{6}\$을 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사인의 비에서 이등변 조건과 세 변의 비를 끌어낸 뒤 코사인법칙까지 연결해야 한다.", "level": "중", "item4slot": {"given": \["삼각형", "비율"\], "goal": \["값"\], "method": \["사인법칙", "코사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q11  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
등비수열 \$\\{a\_n\\}\$에 대하여 제\$2\$항이 \$3\$이고 제\$4\$항이 \$12\$일 때, \$a\_1^2 \+ a\_2^2 \+ a\_3^2 \+ \\cdots \+ a\_8^2\$의 값은?  
\#\## 선지  
① \$\\frac{3}{4}(4^8 - 1)\$ ② \$\\frac{1}{4}(4^8 - 1)\$ ③ \$\\frac{9}{4}(4^8 - 1)\$ ④ \$\\frac{3}{4}(4^7 - 1)\$ ⑤ \$3(4^8 - 1)\$  
\#\## 정답  
①  
\#\## 해설  
등비수열 \$\\{a\_n\\}\$의 공비를 \$r\$이라 하면 \$a\_4 \= a\_2 r^2\$이므로 \$12 \= 3r^2 \\implies r^2 \= 4\$이다.  
또 \$a\_2^2 \= a\_1^2 r^2\$에서 \$9 \= 4a\_1^2 \\implies a\_1^2 \= \\frac{9}{4}\$이다.  
수열 \$\\{a\_n^2\\}\$은 첫째항이 \$\\frac{9}{4}\$, 공비가 \$r^2 \= 4\$인 등비수열이므로 처음 \$8\$항의 합은  
\$\$\\sum\_{n=1}^8 a\_n^2 \= \\frac{9}{4} \\cdot \\frac{4^8 - 1}{4 - 1} \= \\frac{3}{4}(4^8 - 1)\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "제곱수열 \$\\\\{a\_n^2\\\\}\$이 공비 \$r^2=4\$인 등비수열임을 이용해 등비수열 합 공식에 대입한다.", "decisiveStep": "\$a\_1^2 \= \\\\frac{9}{4}\$과 공비 \$r^2=4\$로 \$\\\\frac{9}{4}\\\\cdot\\\\frac{4^8-1}{3}\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-120, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공비의 부호와 무관하게 \$a\_n^2\$의 공비가 \$r^2\$이 됨을 파악하는 문항이다.", "level": "중하", "item4slot": {"given": \["등비수열"\], "goal": \["합"\], "method": \["수열의합"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q12  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
모든 항이 실수인 등비수열 \$\\{a\_n\\}\$에 대하여 \$a\_1 \+ a\_3 \= 10\$, \$a\_4 \+ a\_6 \= 270\$이 성립한다. 새로운 수열 \$\\{b\_n\\}\$을 \$b\_n \= a\_n \\times a\_{n+1}\$로 정의할 때, 수열 \$\\{b\_n\\}\$의 첫째항부터 제\$4\$항까지의 합은?  
\#\## 선지  
① \$2440\$ ② \$2460\$ ③ \$2480\$ ④ \$2500\$ ⑤ \$2520\$  
\#\## 정답  
②  
\#\## 해설  
공비를 \$r\$이라 하면 \$a\_4 \+ a\_6 \= r^3(a\_1 \+ a\_3)\$이므로 \$270 \= 10r^3 \\implies r^3 \= 27\$이고 실수 조건에서 \$r \= 3\$이다.  
\$a\_1 \+ a\_1 r^2 \= 10\$에 \$r \= 3\$을 대입하면 \$10a\_1 \= 10 \\implies a\_1 \= 1\$이므로 \$a\_n \= 3^{n-1}\$이다.  
따라서 \$b\_n \= 3^{n-1} \\cdot 3^n \= 3^{2n-1}\$이고 첫 네 항은 \$3, 27, 243, 2187\$이므로 합은  
\$\$3 \+ 27 \+ 243 \+ 2187 \= 2460\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "두 항 합의 비로 실수 공비 \$r=3\$과 첫째항을 구한 뒤 수열 \$b\_n=3^{2n-1}\$의 합을 계산한다.", "decisiveStep": "\$a\_4+a\_6=r^3(a\_1+a\_3)\$에서 \$r=3, a\_1=1\$을 구해 \$b\_1+b\_2+b\_3+b\_4=2460\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-120, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항 묶음의 비로 공비를 찾고 곱 수열 \$b\_n\$의 합을 계산하는 2단계 문항이다.", "level": "중하", "item4slot": {"given": \["등비수열"\], "goal": \["합"\], "method": \["일반항", "수열의합"\], "condition": \["실수"\]}, "hold": ""}  
\`\`\`

\## Q13  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
직육면체의 가로의 길이, 세로의 길이, 높이가 이 순서대로 등차수열을 이룬다. 이 직육면체의 모든 모서리의 길이의 합이 \$72\$이고 겉넓이가 \$198\$일 때, 이 직육면체의 부피는?  
\#\## 선지  
① \$144\$ ② \$150\$ ③ \$156\$ ④ \$162\$ ⑤ \$168\$  
\#\## 정답  
④  
\#\## 해설  
등차수열을 이루는 세 길이를 \$x - d, x, x \+ d\$라 하자.  
모든 모서리의 길이의 합이 \$72\$이므로 \$4\\{(x - d) \+ x \+ (x \+ d)\\} \= 12x \= 72 \\implies x \= 6\$이다.  
겉넓이 조건에서  
\$\$2\\{6(6 - d) \+ 6(6 \+ d) \+ (6 - d)(6 \+ d)\\} \= 2(72 \+ 36 - d^2) \= 2(108 - d^2) \= 198\$\$  
따라서 \$108 - d^2 \= 99 \\implies d^2 \= 9\$이다. 세 길이는 \$3, 6, 9\$ (모두 양수)이므로 부피는  
\$\$V \= 6(36 - d^2) \= 6(36 - 9\) \= 6 \\times 27 \= 162\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "대칭 등차 세 수 \$x-d, x, x+d\$로 놓아 모서리 합으로 \$x=6\$, 겉넓이로 \$d^2=9\$를 구한다.", "decisiveStep": "\$2(108-d^2)=198\$에서 \$d^2=9\$를 구해 부피 \$6(36-9)=162\$를 얻는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "중항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-116, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대칭 등차 미지수 설정으로 미지수를 순차 소거해 부피를 구해야 한다.", "level": "중", "item4slot": {"given": \["직육면체", "등차수열"\], "goal": \["부피"\], "method": \["등차중항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q14  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
두 함수 \$f(x) \= 4\\sin x - 1\$, \$g(x) \= \\frac{\\pi}{3}\\cos(\\pi x)\$에 대하여 합성함수 \$y \= (f \\circ g)(x)\$의 최댓값과 최솟값의 합은?  
\#\## 선지  
① \$-4\$ ② \$-3\$ ③ \$-2\$ ④ \$-1\$ ⑤ \$0\$  
\#\## 정답  
③  
\#\## 해설  
\$t \= g(x) \= \\frac{\\pi}{3}\\cos(\\pi x)\$라 하면 \$-1 \\le \\cos(\\pi x) \\le 1\$이므로 \$-\\frac{\\pi}{3} \\le t \\le \\frac{\\pi}{3}\$이다.  
구간 \$\\left\[-\\frac{\\pi}{3}, \\frac{\\pi}{3}\\right\]\$에서 \$\\sin t\$는 증가하므로 최솟값은 \$\\sin\\left(-\\frac{\\pi}{3}\\right) \= \-\\frac{\\sqrt{3}}{2}\$, 최댓값은 \$\\sin\\frac{\\pi}{3} \= \\frac{\\sqrt{3}}{2}\$이다.  
따라서 \$y \= 4\\sin t - 1\$의 최댓값은 \$2\\sqrt{3} - 1\$, 최솟값은 \$-2\\sqrt{3} - 1\$이므로 두 값의 합은  
\$\$(2\\sqrt{3} - 1\) \+ (-2\\sqrt{3} - 1\) \= \-2\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_GRAPH", "conceptClusterKey": "", "primaryMethod": "내부 함수 \$g(x)\$의 치역을 구해 \$t\$의 구간을 잡은 뒤 외부 함수 \$f(t)\$의 최대·최소를 구한다.", "decisiveStep": "\$-\\\\frac{\\\\pi}{3} \\\\le t \\\\le \\\\frac{\\\\pi}{3}\$에서 \$4\\\\sin t - 1\$의 양 끝값을 구해 더하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 그래프", "l3": "그래프 활용", "l4": "최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_EXTREMUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-108, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합성 삼각함수의 치역 제한과 사인함수의 단조성을 연결해야 한다.", "level": "중", "item4slot": {"given": \["삼각함수", "합성함수"\], "goal": \["합"\], "method": \["치환", "삼각함수"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q15  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
삼각형 \$ABC\$의 넓이가 \$12\\sqrt{3}\$이고 두 변 \$b, c\$가 이루는 각의 크기가 \$60^\\circ\$일 때, 두 변 \$b, c\$의 길이의 합 \$b \+ c\$의 최솟값은?  
\#\## 선지  
① \$4\\sqrt{3}\$ ② \$6\\sqrt{3}\$ ③ \$12\$ ④ \$8\\sqrt{2}\$ ⑤ \$8\\sqrt{3}\$  
\#\## 정답  
⑤  
\#\## 해설  
삼각형의 넓이 공식에 의해  
\$\$\\frac{1}{2}bc\\sin 60^\\circ \= 12\\sqrt{3} \\implies \\frac{\\sqrt{3}}{4}bc \= 12\\sqrt{3} \\implies bc \= 48\$\$  
\$b \> 0, c \> 0\$이므로 산술·기하평균의 부등식에 의하여  
\$\$b \+ c \\ge 2\\sqrt{bc} \= 2\\sqrt{48} \= 8\\sqrt{3}\$\$  
등호는 \$b \= c \= 4\\sqrt{3}\$일 때 성립하므로 최솟값은 \$8\\sqrt{3}\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "넓이 조건으로 두 변의 곱 \$bc=48\$을 구한 뒤 산술·기하평균 부등식을 적용한다.", "decisiveStep": "\$bc=48\$에서 \$b+c\\\\ge 2\\\\sqrt{48}=8\\\\sqrt{3}\$을 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "두 변과 끼인각"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-113, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각형 넓이 공식과 산술·기하평균 부등식을 결합한 대표 문항이다.", "level": "중", "item4slot": {"given": \["삼각형", "넓이"\], "goal": \["최솟값"\], "method": \["삼각형넓이공식", "산술기하평균"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q16  
- 형식: 객관식  
- 배점: 5.2  
\#\## 발문  
다음 조건을 만족시키는 자연수 \$k\$의 개수가 \$15\$가 되도록 하는 자연수 \$n\$의 최솟값은?

수열 \$1, a\_1, a\_2, \\cdots, a\_k, 5^n\$이 공비가 정수인 등비수열이 되도록 하는 \$k\$개의 정수 \$a\_1, \\cdots, a\_k\$가 존재한다.  
\#\## 선지  
① \$96\$ ② \$120\$ ③ \$144\$ ④ \$180\$ ⑤ \$210\$  
\#\## 정답  
②  
\#\## 해설  
첫째항 \$1\$에서 마지막 항 \$5^n\$까지 공비 \$r\$을 \$(k \+ 1)\$번 곱하므로 \$r^{k+1} \= 5^n\$이다.  
\$r\$이 정수이고 \$n \\ge 1\$이므로 \$\|r\| \= 5^t\$ (\$t\$는 자연수) 꼴이어야 하며 \$t(k \+ 1\) \= n\$이다.  
\$k \\ge 1\$이므로 \$k \+ 1\$은 \$2\$ 이상인 \$n\$의 양의 약수이고, 반대로 \$k \+ 1\$이 \$2\$ 이상인 \$n\$의 양의 약수이면 \$r \= 5^{n/(k+1)}\$로 조건을 만족하는 정수 수열이 존재한다.  
따라서 가능한 \$k\$의 개수는 \$(n\\text{의 양의 약수의 개수}) - 1 \= 15\$이므로 \$n\$의 양의 약수의 개수는 \$16\$개여야 한다.  
소인수분해 지수의 \$(e\_1 \+ 1)\\cdots(e\_j \+ 1\) \= 16\$인 분해 중 가장 작은 자연수 후보를 비교하면:  
- \$16\$: \$2^{15} \= 32768\$  
- \$8 \\times 2\$: \$2^7 \\cdot 3 \= 384\$  
- \$4 \\times 4\$: \$2^3 \\cdot 3^3 \= 216\$  
- \$4 \\times 2 \\times 2\$: \$2^3 \\cdot 3 \\cdot 5 \= 120\$  
- \$2 \\times 2 \\times 2 \\times 2\$: \$2 \\cdot 3 \\cdot 5 \\cdot 7 \= 210\$  
그러므로 \$n\$의 최솟값은 \$120\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "등비수열 항 관계 \$r^{k+1}=5^n\$을 약수 조건 \$t(k+1)=n\$으로 환원해 약수가 \$16\$개인 최소 자연수를 찾는다.", "decisiveStep": "약수 개수 \$16\$의 곱셈 분해 \$4\\\\times 2\\\\times 2\$에서 최소 자연수 \$2^3\\\\cdot 3\\\\cdot 5=120\$을 결정하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "귀납적 패턴"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-122, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등비수열 정수 공비 조건을 지수 약수 개수로 해석하고 소인수분해 최솟값을 비교해야 한다.", "level": "상", "item4slot": {"given": \["등비수열", "자연수"\], "goal": \["최솟값"\], "method": \["일반항", "소인수분해"\], "condition": \["정수"\]}, "hold": ""}  
\`\`\`

\## Q17  
- 형식: 객관식  
- 배점: 5.5  
\#\## 발문  
공차가 자연수인 등차수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 하자. 어떤 자연수 \$k\$에 대하여 \$a\_k \+ a\_{k+1} \+ a\_{k+2} \= 15\$, \$S\_{k+3} \= 13\$이 성립할 때, \$\\sum\_{m=1}^{15} \|a\_m\|\$의 값은?  
\#\## 선지  
① \$60\$ ② \$54\$ ③ \$58\$ ④ \$62\$ ⑤ \$65\$  
\#\## 정답  
①  
\#\## 해설  
등차중항에 의해 \$a\_k \+ a\_{k+1} \+ a\_{k+2} \= 3a\_{k+1} \= 15 \\implies a\_{k+1} \= 5\$이다.  
공차를 자연수 \$d\$라 하면 \$a\_1 \+ kd \= 5 \\implies a\_1 \= 5 - kd\$이다.  
\$S\_{k+3} \= 13\$에 등차수열 합 공식을 적용하면  
\$\$\\frac{k \+ 3}{2}\\{2(5 - kd) \+ (k \+ 2)d\\} \= 13 \\implies (k \+ 3)\\{10 \+ (2 - k)d\\} \= 26\$\$  
\$k\$가 자연수이므로 \$k \+ 3 \\ge 4\$이고 \$26\$의 약수여야 하므로 \$k \+ 3 \= 13\$ 또는 \$26\$이다.  
- \$k \+ 3 \= 13\$ (\$k \= 10\$): \$10 - 8d \= 2 \\implies d \= 1\$ (자연수)  
- \$k \+ 3 \= 26\$ (\$k \= 23\$): \$10 - 21d \= 1 \\implies d \= \\frac{9}{21}\$ (탈락)  
따라서 \$k \= 10, d \= 1, a\_{11} \= 5\$이므로 \$a\_m \= 5 \+ (m - 11\) \= m - 6\$이다.  
\$\$\\sum\_{m=1}^{15} \|m - 6\| \= (5 \+ 4 \+ 3 \+ 2 \+ 1\) \+ 0 \+ (1 \+ 2 \+ \\cdots \+ 9\) \= 15 \+ 45 \= 60\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "등차중항으로 \$a\_{k+1}\$을 구한 뒤 합 방정식의 약수 조건으로 자연수 \$(k, d)\$를 결정하고 절댓값 합을 계산한다.", "decisiveStep": "\$(k+3)\\\\{10+(2-k)d\\\\}=26\$에서 \$k+3=13, d=1\$을 찾아내는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차중항·합 공식·자연수 약수 부정방정식·절댓값 합을 연쇄적으로 풀어야 한다.", "level": "상", "item4slot": {"given": \["등차수열", "합"\], "goal": \["합"\], "method": \["등차중항", "수열의합"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q18  
- 형식: 객관식  
- 배점: 5.5  
\#\## 발문  
자연수 \$n\$에 대하여 \$0 \\le x \\le n\$에서 함수 \$y \= 2\\sin\\left\\{\\frac{\\pi}{6}(x \+ 1)\\right\\}\$의 최댓값을 \$f(n)\$, 최솟값을 \$g(n)\$이라 할 때, 부등식 \$2 \< f(n) - g(n) \< 4\$를 만족시키는 모든 자연수 \$n\$의 값의 합은?  
\#\## 선지  
① \$11\$ ② \$12\$ ③ \$14\$ ④ \$13\$ ⑤ \$15\$  
\#\## 정답  
④  
\#\## 해설  
\$t \= \\frac{\\pi}{6}(x \+ 1)\$이라 하면 \$0 \\le x \\le n\$일 때 \$\\frac{\\pi}{6} \\le t \\le \\frac{n \+ 1}{6}\\pi\$이다.  
- \$1 \\le n \\le 5\$이면 \$\\frac{n+1}{6}\\pi \\le \\pi\$이므로 \$0 \\le \\sin t \\le 1\$에서 \$f(n) - g(n) \\le 2\$이다. (불가)  
- \$6 \\le n \\le 7\$이면 \$\\pi \< \\frac{n+1}{6}\\pi \< \\frac{3\\pi}{2}\$이므로 \$t \= \\frac{\\pi}{2}\$를 포함해 \$f(n) \= 2\$이고, \$-2 \< g(n) \< 0\$이다. 따라서 \$2 \< f(n) - g(n) \< 4\$를 만족한다.  
- \$n \\ge 8\$이면 \$\\frac{n+1}{6}\\pi \\ge \\frac{3\\pi}{2}\$이므로 \$f(n) \= 2, g(n) \= \-2\$에서 \$f(n) - g(n) \= 4\$이다. (불가)  
따라서 가능한 자연수는 \$n \= 6, 7\$이고 합은 \$6 \+ 7 \= 13\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_GRAPH", "conceptClusterKey": "", "primaryMethod": "각 \$t=\\\\frac{\\\\pi}{6}(x+1)\$의 구간의 오른쪽 끝을 \$\\\\pi\$와 \$\\\\frac{3\\\\pi}{2}\$ 기준으로 나누어 진폭을 판별한다.", "decisiveStep": "\$\\\\pi \< \\\\frac{n+1}{6}\\\\pi \< \\\\frac{3\\\\pi}{2}\$에서 \$n=6, 7\$을 가려내는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 그래프", "l3": "그래프 활용", "l4": "최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_EXTREMUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-108, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "자연수 \$n\$에 따라 변하는 삼각함수 정의역 구간에서 최댓값·최솟값 차의 엄격한 부등식을 판별해야 한다.", "level": "상", "item4slot": {"given": \["삼각함수", "구간"\], "goal": \["합"\], "method": \["치환", "부등식"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q19  
- 형식: 객관식  
- 배점: 5.8  
\#\## 발문  
원 \$O\$에 내접하는 사각형 \$ABCD\$에서 두 대각선 \$AC, BD\$가 점 \$E\$에서 만난다. \$\\overline{AB} \= 6\$, \$\\overline{BC} \= 7\$, \$\\cos(\\angle BCD) \= \\frac{1}{4}\$이고, 삼각형 \$EAB\$의 외접원과 삼각형 \$ECD\$의 외접원의 반지름의 길이의 비가 \$3 : 4\$일 때, 원 \$O\$의 반지름의 길이는?  
\#\## 선지  
① \$\\frac{\\sqrt{51}}{3}\$ ② \$\\frac{4\\sqrt{51}}{3}\$ ③ \$\\frac{2\\sqrt{51}}{3}\$ ④ \$\\frac{2\\sqrt{51}}{5}\$ ⑤ \$\\frac{\\sqrt{51}}{2}\$  
\#\## 정답  
③  
\#\## 해설  
두 선분 \$AC, BD\$의 교점이 \$E\$이므로 \$\\angle AEB \= \\angle CED\$ (맞꼭지각)이다. 이 각을 \$\\theta\$라 하고 두 외접원 반지름을 \$R\_1, R\_2\$라 하면 사인법칙에 의해  
\$\$\\frac{\\overline{AB}}{\\overline{CD}} \= \\frac{2R\_1\\sin\\theta}{2R\_2\\sin\\theta} \= \\frac{R\_1}{R\_2} \= \\frac{3}{4}\$\$  
\$\\overline{AB} \= 6\$이므로 \$\\overline{CD} \= 8\$이다.  
\$\\triangle BCD\$에서 \$\\angle BCD \= \\phi\$라 하면 \$\\cos\\phi \= \\frac{1}{4}\$이므로 코사인법칙에 의해  
\$\$\\overline{BD}^2 \= 7^2 \+ 8^2 - 2 \\cdot 7 \\cdot 8 \\cdot \\frac{1}{4} \= 49 \+ 64 - 28 \= 85 \\implies \\overline{BD} \= \\sqrt{85}\$\$  
또한 \$\\sin\\phi \= \\sqrt{1 - \\left(\\frac{1}{4}\\right)^2} \= \\frac{\\sqrt{15}}{4}\$이고 \$\\triangle BCD\$의 외접원이 원 \$O\$이므로 사인법칙에 의해  
\$\$2R \= \\frac{\\sqrt{85}}{\\sqrt{15}/4} \= \\frac{4\\sqrt{17}}{\\sqrt{3}} \= \\frac{4\\sqrt{51}}{3} \\implies R \= \\frac{2\\sqrt{51}}{3}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "맞꼭지각에 대한 외접원 반지름 비로 \$\\\\overline{CD}\$를 구하고 \$\\\\triangle BCD\$에 코사인법칙과 사인법칙을 연속 적용한다.", "decisiveStep": "\$\\\\overline{CD}=8\$을 구해 \$\\\\overline{BD}=\\\\sqrt{85}\$와 \$\\\\sin\\\\phi=\\\\frac{\\\\sqrt{15}}{4}\$로 외접원 반지름을 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외접원 비, 코사인법칙, 삼각함수 항등식, 사인법칙의 4단계를 연속 결합한 고난도 문항이다.", "level": "상", "item4slot": {"given": \["원", "사각형"\], "goal": \["반지름"\], "method": \["사인법칙", "코사인법칙"\], "condition": \["내접"\]}, "hold": ""}  
\`\`\`

\## Q20  
- 형식: 서술형  
- 배점: 8  
\#\## 발문  
\$x \> 0\$에서 정의된 함수 \$f(x) \= \\frac{kx \+ 3k \+ 10}{x \+ 1}\$이 있다. 자연수 \$k\$에 대하여 함수 \$f(x)\$의 치역에 속하는 모든 정수를 작은 수부터 크기순으로 나열하여 만든 수열을 \$\\{a\_n\\}\$이라 할 때, 수열 \$\\{a\_n\\}\$의 모든 항의 합이 \$221\$이 되도록 하는 자연수 \$k\$의 값을 풀이과정과 함께 구하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$k \= 4\$  
\#\## 해설  
\$f(x) \= \\frac{k(x \+ 1\) \+ 2k \+ 10}{x \+ 1} \= k \+ \\frac{2k \+ 10}{x \+ 1}\$이다.  
\$x \> 0\$일 때 \$x \+ 1 \> 1\$이므로 \$0 \< \\frac{1}{x \+ 1} \< 1\$이고 \$2k \+ 10 \> 0\$이므로  
\$\$k \< f(x) \< 3k \+ 10\$\$  
따라서 치역에 속하는 정수는 \$k \+ 1, k \+ 2, \\dots, 3k \+ 9\$이며, 항의 개수는 \$(3k \+ 9\) - (k \+ 1\) \+ 1 \= 2k \+ 9\$개다.  
공차가 \$1\$인 등차수열의 합이 \$221\$이므로  
\$\$\\frac{(2k \+ 9)\\{(k \+ 1\) \+ (3k \+ 9)\\}}{2} \= (2k \+ 9)(2k \+ 5\) \= 221\$\$  
\$\$4k^2 \+ 28k \+ 45 \= 221 \\implies k^2 \+ 7k - 44 \= 0 \\implies (k \+ 11)(k - 4\) \= 0\$\$  
\$k\$는 자연수이므로 \$k \= 4\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "유리함수 \$f(x)\$의 치역 구간 \$(k, 3k+10)\$ 안의 연속 정수 합을 등차수열 합으로 세워 \$k\$를 푼다.", "decisiveStep": "\$(2k+9)(2k+5)=221\$을 인수분해해 자연수 \$k=4\$를 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리함수 치역의 열린구간 경계를 정확히 잡아 연속 정수의 등차합 이차방정식을 풀어야 한다.", "level": "상", "item4slot": {"given": \["유리함수", "수열"\], "goal": \["자연수"\], "method": \["수열의합", "이차방정식"\], "condition": \["정수"\]}, "hold": ""}  
\`\`\`

\## Q21  
- 형식: 서술형  
- 배점: 12  
\#\## 발문  
두 함수 \$f(x) \= \\frac{3}{a}\|x - 2\| \+ b\$, \$g(x) \= \\sin\\frac{\\pi}{b}x \+ 2\$가 다음 조건을 만족시키도록 하는 두 자연수 \$a, b\$의 순서쌍 \$(a, b)\$를 모두 풀이과정과 함께 구하시오.

(가) 함수 \$y \= f(g(x))\$의 그래프는 직선 \$x \= 2\$에 대하여 대칭이다.  
(나) \$0 \\le x \\le 4\$일 때, 함수 \$y \= g(f(x))\$의 그래프가 직선 \$y \= 2\$와 만나는 점의 개수는 \$3\$이다.  
\#\## 선지  
없음  
\#\## 정답  
\$(4, 1), (5, 1), (6, 1), (2, 2), (3, 2), (1, 4)\$  
\#\## 해설  
\*\*(가)\*\* \$f(g(x)) \= \\frac{3}{a}\\left\|\\sin\\frac{\\pi x}{b}\\right\| \+ b\$가 직선 \$x \= 2\$에 대하여 대칭이면 \$x \= 0\$과 \$x \= 4\$에서 함숫값이 같아야 하므로  
\$\$\\frac{3}{a}\\left\|\\sin\\frac{4\\pi}{b}\\right\| \+ b \= b \\implies \\sin\\frac{4\\pi}{b} \= 0\$\$  
따라서 \$\\frac{4}{b}\$는 자연수이므로 \$b \\in \\{1, 2, 4\\}\$이다. 실제로 \$\\frac{4}{b} \= m\$ (정수)이면 \$\\left\|\\sin\\frac{\\pi(4-x)}{b}\\right\| \= \\left\|\\sin\\left(m\\pi - \\frac{\\pi x}{b}\\right)\\right\| \= \\left\|\\sin\\frac{\\pi x}{b}\\right\|\$이므로 모두 대칭 조건을 만족한다.

\*\*(나)\*\* \$g(f(x)) \= 2 \\iff \\sin\\left(\\frac{\\pi}{b}f(x)\\right) \= 0 \\iff f(x) \= jb\$ (\$j\$는 정수)이다.  
\$0 \\le x \\le 4\$에서 \$b \\le f(x) \\le b \+ \\frac{6}{a}\$이고, 최솟값 \$b\$는 \$x \= 2\$에서 \$1\$번, \$b\$보다 큰 값은 대칭인 두 점에서 \$2\$번씩 얻어진다.  
따라서 교점이 \$3\$개이려면 \$f(x)\$의 치역이 \$b\$와 \$2b\$만 포함하고 \$3b\$는 포함하지 않아야 하므로  
\$\$2b \\le b \+ \\frac{6}{a} \< 3b \\implies b \\le \\frac{6}{a} \< 2b \\implies 3 \< ab \\le 6\$\$  
- \$b \= 1\$일 때: \$3 \< a \\le 6 \\implies a \= 4, 5, 6\$  
- \$b \= 2\$일 때: \$3 \< 2a \\le 6 \\implies a \= 2, 3\$  
- \$b \= 4\$일 때: \$3 \< 4a \\le 6 \\implies a \= 1\$  
따라서 모든 순서쌍은 \$(4, 1), (5, 1), (6, 1), (2, 2), (3, 2), (1, 4)\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_GRAPH", "conceptClusterKey": "", "primaryMethod": "(가)의 선대칭 조건으로 \$b\$의 약수 후보를 좁히고 (나)의 \$f(x)=jb\$ 교점 개수를 치역 부등식 \$3\<ab\\\\le 6\$으로 푼다.", "decisiveStep": "V자 그래프 \$f(x)\$의 치역 \$\[b, b+\\\\frac{6}{a}\]\$가 \$2b\$는 포함하고 \$3b\$는 제외할 조건 \$3 \< ab \\\\le 6\$을 세우는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 그래프", "l3": "그래프 활용", "l4": "교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-107, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합성삼각함수의 선대칭 주기와 절댓값 V자 함수의 교점 개수 조건을 결합한 최고난도 문항이다.", "level": "상", "item4slot": {"given": \["삼각함수", "합성함수"\], "goal": \["순서쌍"\], "method": \["대칭성", "그래프"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`  
