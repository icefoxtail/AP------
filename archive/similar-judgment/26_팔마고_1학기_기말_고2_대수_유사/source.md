\`\`\`json:exam  
{"stem": "26\_팔마고\_1학기\_기말\_고2\_대수\_유사", "sourceArchiveFile": "original/high/h2/1final/26\_팔마고\_1학기\_기말\_고2\_대수.js", "examFolder": "1final", "grade": "고2", "subject": "대수", "curriculum": "2022", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-21"}  
\`\`\`

\## Q01  
- 형식: 객관식  
- 배점: 3.3  
\#\## 발문  
다음은 합의 기호 \$\\sum\$의 사용 사례를 나타낸 것이다.

\$\$\\sum\_{k=3}^6 k^2 \= 3^2 \+ 4^2 \+ 5^2 \+ 6^2 \= 86\$\$

\$\\sum\_{k=3}^6 k(k \+ 1)\$을 계산한 값으로 알맞은 것은?  
\#\## 선지  
① \$96\$ ② \$100\$ ③ \$104\$ ④ \$108\$ ⑤ \$112\$  
\#\## 정답  
③  
\#\## 해설  
\$k \= 3, 4, 5, 6\$을 차례로 대입해 더하면  
\$\$\\sum\_{k=3}^6 k(k \+ 1\) \= 3(4) \+ 4(5) \+ 5(6) \+ 6(7) \= 12 \+ 20 \+ 30 \+ 42 \= 104\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "합의 기호 \$\\\\sum\_{k=3}^6\$의 정의에 따라 \$k=3, 4, 5, 6\$을 직접 대입해 합산한다.", "decisiveStep": "\$12+20+30+42=104\$를 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "합의 기호 Σ", "l4": "Σ 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SIGMA\_NOTATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-123, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "항이 4개뿐이어서 합의 기호의 정의대로 전개해 더하면 즉시 풀린다.", "level": "하", "item4slot": {"given": \["수열"\], "goal": \["합"\], "method": \["시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q02  
- 형식: 객관식  
- 배점: 3.3  
\#\## 발문  
삼각형 \$ABC\$에서 \$A \= 45^\\circ\$, \$a \= 8\\sqrt{2}\$일 때, 외접원의 반지름의 길이는?  
\#\## 선지  
① \$8\$ ② \$4\\sqrt{2}\$ ③ \$6\$ ④ \$6\\sqrt{2}\$ ⑤ \$16\$  
\#\## 정답  
①  
\#\## 해설  
사인법칙 \$2R \= \\frac{a}{\\sin A}\$에 \$a \= 8\\sqrt{2}\$, \$A \= 45^\\circ\$를 대입하면  
\$\$2R \= \\frac{8\\sqrt{2}}{\\sin 45^\\circ} \= \\frac{8\\sqrt{2}}{\\sqrt{2}/2} \= 16 \\implies R \= 8\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "한 변 \$a\$와 대각 \$A\$를 사인법칙 \$2R=\\\\frac{a}{\\\\sin A}\$에 대입한다.", "decisiveStep": "\$2R \= 16\$에서 반지름 \$R \= 8\$을 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "사인법칙", "l4": "외접원 반지름"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_SINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-109, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "그림 조건을 텍스트로 제시한 뒤 사인법칙 1회 적용으로 반지름을 구한다.", "level": "하", "item4slot": {"given": \["삼각형", "길이"\], "goal": \["반지름"\], "method": \["사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q03  
- 형식: 객관식  
- 배점: 3.6  
\#\## 발문  
등차수열 \$\\{a\_n\\}\$에 대하여 \$a\_2 \= 3\$, \$a\_4 \+ a\_8 \= 30\$일 때, \$a\_{12}\$의 값은?  
\#\## 선지  
① \$27\$ ② \$30\$ ③ \$31\$ ④ \$33\$ ⑤ \$36\$  
\#\## 정답  
④  
\#\## 해설  
등차중항에 의해 \$a\_4 \+ a\_8 \= 2a\_6 \= 30 \\implies a\_6 \= 15\$이다.  
공차를 \$d\$라 하면 \$a\_6 - a\_2 \= 4d \= 15 - 3 \= 12 \\implies d \= 3\$이다.  
따라서 \$a\_{12} \= a\_2 \+ 10d \= 3 \+ 10 \\times 3 \= 33\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "등차중항으로 \$a\_6=15\$를 구한 뒤 \$a\_6-a\_2=4d\$로 공차를 찾아 \$a\_{12}\$를 계산한다.", "decisiveStep": "\$a\_4+a\_8=2a\_6=30\$에서 \$a\_6=15, d=3\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "중항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-116, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차중항으로 \$a\_6\$을 먼저 구하면 공차와 \$a\_{12}\$가 연쇄적으로 풀린다.", "level": "중하", "item4slot": {"given": \["등차수열"\], "goal": \["값"\], "method": \["등차중항", "일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q04  
- 형식: 객관식  
- 배점: 3.6  
\#\## 발문  
두 수 \$1\$과 \$81\$ 사이에 \$7\$개의 수를 넣어 만든 수열  
\$\$1, x\_1, x\_2, x\_3, x\_4, x\_5, x\_6, x\_7, 81\$\$  
이 이 순서대로 등비수열이 되도록 하는 \$x\_4\$의 값으로 알맞은 것은?  
\#\## 선지  
① \$3\$ ② \$9\$ ③ \$3\\sqrt{3}\$ ④ \$27\$ ⑤ \$9\\sqrt{3}\$  
\#\## 정답  
②  
\#\## 해설  
공비를 \$r\$이라 하면 제\$1\$항이 \$1\$, 제\$9\$항이 \$81\$이므로 \$r^8 \= 81\$이다.  
\$x\_4\$는 제\$5\$항이므로 \$x\_4 \= r^4\$이고 \$(r^4)^2 \= 81\$, \$r^4 \> 0\$이므로 \$x\_4 \= r^4 \= 9\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "제9항 \$r^8=81\$에서 제5항 \$x\_4=r^4\>0\$을 바로 구한다.", "decisiveStep": "\$(r^4)^2 \= 81\$과 \$r^4 \> 0\$에서 \$x\_4 \= 9\$를 결정하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-118, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "가운데 항 \$x\_4\$가 등비중항임을 이용하면 \$r^4\$이 양수로 유일하게 결정된다.", "level": "하", "item4slot": {"given": \["등비수열"\], "goal": \["값"\], "method": \["등비중항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q05  
- 형식: 객관식  
- 배점: 3.9  
\#\## 발문  
세 기둥 중에서 한 기둥에 크기가 서로 다른 \$n\$개의 원판이 큰 것부터 차례로 쌓여 있다. 이 원판은 한 번에 한 개씩만 다른 기둥으로 옮길 수 있고, 큰 원판을 작은 원판 위에 놓을 수 없다. 이때 \$n\$개의 원판을 다른 한 기둥으로 모두 옮기는 데 필요한 최소 이동 횟수를 \$a\_n\$이라 하면 \$a\_2 \= 3\$이다. \$a\_7\$의 값으로 알맞은 것은?  
\#\## 선지  
① \$31\$ ② \$63\$ ③ \$64\$ ④ \$126\$ ⑤ \$127\$  
\#\## 정답  
⑤  
\#\## 해설  
\$n\$개의 원판을 옮기려면 위의 \$n - 1\$개를 보조 기둥에 옮긴 뒤(\$a\_{n-1}\$회), 가장 큰 원판을 목표 기둥에 옮기고(\$1\$회), 다시 \$n - 1\$개를 목표 기둥 위로 옮겨야(\$a\_{n-1}\$회) 한다.  
따라서 \$a\_n \= 2a\_{n-1} \+ 1\$이고 \$a\_2 \= 3\$에서 차례로 계산하면  
\$a\_3 \= 7\$, \$a\_4 \= 15\$, \$a\_5 \= 31\$, \$a\_6 \= 63\$, \$a\_7 \= 2 \\times 63 \+ 1 \= 127\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "원판 이동 규칙에서 점화식 \$a\_n \= 2a\_{n-1} \+ 1\$을 세워 \$a\_2=3\$부터 \$a\_7\$까지 계산한다.", "decisiveStep": "점화식 \$a\_n=2a\_{n-1}+1\$을 도출해 \$a\_7=127\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수열의 귀납적 정의", "l4": "점화식으로 항 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_RECURSIVE\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-129, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "하노이 탑 문제의 점화식 \$a\_n=2a\_{n-1}+1\$을 세워 7항까지 전개하는 문항이다.", "level": "중하", "item4slot": {"given": \["수열"\], "goal": \["최솟값"\], "method": \["귀납적정의"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q06  
- 형식: 객관식  
- 배점: 3.9  
\#\## 발문  
수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합 \$S\_n\$이 \$S\_n \= 2n^2 - 3n \+ 5\$일 때, \$a\_1 \+ a\_{10}\$의 값은?  
\#\## 선지  
① \$39\$ ② \$35\$ ③ \$37\$ ④ \$41\$ ⑤ \$43\$  
\#\## 정답  
①  
\#\## 해설  
\$a\_1 \= S\_1 \= 2 - 3 \+ 5 \= 4\$이다.  
\$a\_{10} \= S\_{10} - S\_9 \= (2 \\cdot 100 - 30 \+ 5\) - (2 \\cdot 81 - 27 \+ 5\) \= 175 - 140 \= 35\$이다.  
따라서 \$a\_1 \+ a\_{10} \= 4 \+ 35 \= 39\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "\$a\_1=S\_1\$과 \$a\_{10}=S\_{10}-S\_9\$를 각각 계산해 합산한다.", "decisiveStep": "상수항 \$5\$ 때문에 \$a\_1=S\_1=4\$를 별도로 구해 \$35\$와 더하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "조건으로 수열 결정"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-121, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부분합 \$S\_n\$에서 첫째항과 제10항을 바로 구해 더하는 기본 문항이다.", "level": "하", "item4slot": {"given": \["수열", "합"\], "goal": \["합"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q07  
- 형식: 객관식  
- 배점: 4.3  
\#\## 발문  
공차가 \$d\$인 등차수열 \$\\{a\_n\\}\$에 대하여 다음 문장이 모두 참이 되게 하는 값을 \$A, B, C\$라 할 때, \$A \+ B \+ C\$의 값으로 옳은 것은?

• \$a\_1, a\_4, a\_7, \\cdots\$는 공차가 \$A\$인 등차수열이다.  
• \$2a\_1, 2a\_2, 2a\_3, \\cdots\$는 공차가 \$B\$인 등차수열이다.  
• \$a\_1 \+ a\_2 \+ a\_3, a\_4 \+ a\_5 \+ a\_6, a\_7 \+ a\_8 \+ a\_9, \\cdots\$는 공차가 \$C\$인 등차수열이다.  
\#\## 선지  
① \$11d\$ ② \$12d\$ ③ \$14d\$ ④ \$15d\$ ⑤ \$18d\$  
\#\## 정답  
③  
\#\## 해설  
- \$A \= a\_4 - a\_1 \= 3d\$  
- \$B \= 2a\_2 - 2a\_1 \= 2(a\_2 - a\_1) \= 2d\$  
- \$C \= (a\_4 \+ a\_5 \+ a\_6) - (a\_1 \+ a\_2 \+ a\_3) \= (a\_4 - a\_1) \+ (a\_5 - a\_2) \+ (a\_6 - a\_3) \= 3d \+ 3d \+ 3d \= 9d\$  
따라서 \$A \+ B \+ C \= 3d \+ 2d \+ 9d \= 14d\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "재구성된 등차수열 각각의 이웃한 두 항의 차를 원래 공차 \$d\$로 나타낸다.", "decisiveStep": "\$3\$항씩 묶은 수열의 공차 \$C=9d\$를 구해 \$3d+2d+9d=14d\$를 얻는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-115, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부분수열·상수배·묶음수열의 공차 변화를 모두 확인해야 한다.", "level": "중하", "item4slot": {"given": \["등차수열"\], "goal": \["합"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q08  
- 형식: 객관식  
- 배점: 4.3  
\#\## 발문  
\$1 \+ \\frac{1}{1 \+ 2} \+ \\frac{1}{1 \+ 2 \+ 3} \+ \\cdots \+ \\frac{1}{1 \+ 2 \+ 3 \+ \\cdots \+ 40}\$의 값으로 알맞은 것은?  
\#\## 선지  
① \$\\frac{77}{41}\$ ② \$\\frac{78}{41}\$ ③ \$\\frac{79}{41}\$ ④ \$\\frac{80}{41}\$ ⑤ \$\\frac{81}{41}\$  
\#\## 정답  
④  
\#\## 해설  
\$1 \+ 2 \+ \\cdots \+ k \= \\frac{k(k \+ 1)}{2}\$이므로 제\$k\$항은 \$\\frac{2}{k(k \+ 1)} \= 2\\left(\\frac{1}{k} - \\frac{1}{k \+ 1}\\right)\$이다.  
따라서 \$k \= 1\$부터 \$40\$까지 더하면  
\$\$\\sum\_{k=1}^{40} 2\\left(\\frac{1}{k} - \\frac{1}{k \+ 1}\\right) \= 2\\left(1 - \\frac{1}{41}\\right) \= \\frac{80}{41}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_SUM", "conceptClusterKey": "", "primaryMethod": "분모 \$1+\\\\cdots+k=\\\\frac{k(k+1)}{2}\$을 뒤집어 부분분수 망원급수로 합산한다.", "decisiveStep": "\$\\\\frac{2}{k(k+1)}=2(\\\\frac{1}{k}-\\\\frac{1}{k+1})\$로 분해해 \$2(1-\\\\frac{1}{41})\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "여러 가지 수열의 합", "l4": "부분분수·망원급수형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SEQUENCE\_SUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-126, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "자연수 합의 역수를 일반항으로 세운 뒤 부분분수 소거를 적용하는 문항이다.", "level": "중하", "item4slot": {"given": \["수열"\], "goal": \["합"\], "method": \["시그마", "부분분수"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q09  
- 형식: 객관식  
- 배점: 4.6  
\#\## 발문  
연이율이 \$5\\%\$이고, \$1\$년마다 복리로 매년 초에 \$200\$만 원씩 \$10\$년 동안 적립할 때, \$10\$년째 말의 적립금의 원리합계는? (단, \$1.05^{10} \= 1.63\$으로 계산한다.)  
\#\## 선지  
① \$2520\$만 원 ② \$2646\$만 원 ③ \$2600\$만 원 ④ \$2730\$만 원 ⑤ \$2800\$만 원  
\#\## 정답  
②  
\#\## 해설  
매년 초에 적립(기수불)하므로 \$10\$년째 말의 원리합계는  
\$\$200 \\times 1.05 \\times \\frac{1.05^{10} - 1}{1.05 - 1} \= 200 \\times 1.05 \\times \\frac{1.63 - 1}{0.05} \= 4200 \\times 0.63 \= 2646\\text{만 원}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "기수불 원리합계 공식 \$A(1+r)\\\\frac{(1+r)^n-1}{r}\$에 수치를 대입한다.", "decisiveStep": "\$200\\\\times 1.05 \\\\times \\\\frac{0.63}{0.05} \= 4200\\\\times 0.63 \= 2646\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "귀납적 패턴"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-122, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "기수불 복리 적금의 등비수열 합 공식 적용 및 소수 연산 문항이다.", "level": "중하", "item4slot": {"given": \["등비수열", "비율"\], "goal": \["합"\], "method": \["수열의합"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q10  
- 형식: 객관식  
- 배점: 4.6  
\#\## 발문  
삼각형 \$ABC\$에서 \$a \= 5\$, \$b \= 6\$, \$\\sin(A \+ B) \= \\frac{2}{5}\$일 때, 삼각형 \$ABC\$의 넓이는?  
\#\## 선지  
① \$3\$ ② \$4\$ ③ \$5\$ ④ \$8\$ ⑤ \$6\$  
\#\## 정답  
⑤  
\#\## 해설  
삼각형의 내각의 합 \$A \+ B \+ C \= \\pi\$에서 \$A \+ B \= \\pi - C\$이므로  
\$\$\\sin C \= \\sin(\\pi - C) \= \\sin(A \+ B) \= \\frac{2}{5}\$\$  
따라서 삼각형 \$ABC\$의 넓이는 \$S \= \\frac{1}{2}ab\\sin C \= \\frac{1}{2} \\times 5 \\times 6 \\times \\frac{2}{5} \= 6\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "\$A+B=\\\\pi-C\$를 이용해 \$\\\\sin C \= \\\\sin(A+B)\$를 구한 뒤 삼각형 넓이 공식에 대입한다.", "decisiveStep": "\$\\\\sin(A+B)=\\\\sin C=\\\\frac{2}{5}\$를 얻어 넓이 \$6\$을 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "두 변과 끼인각"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-113, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각형 내각 보각 성질과 넓이 공식을 1회씩 결합한다.", "level": "중하", "item4slot": {"given": \["삼각형", "길이"\], "goal": \["넓이"\], "method": \["삼각함수의성질", "삼각형넓이공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q11  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합 \$S\_n\$이 \$S\_n \= 3n^2 - 22n \+ 2\$일 때, 다음 보기 중 옳은 것만을 있는 대로 고른 것은?

ㄱ. 수열 \$\\{a\_n\\}\$은 등차수열이다. (\$n \= 1, 2, 3, \\cdots\$)  
ㄴ. \$S\_n\$이 최소가 되는 자연수 \$n\$의 값은 \$4\$이다.  
ㄷ. \$a\_1 \+ a\_5 \= \-12\$이다.  
\#\## 선지  
① ㄱ ② ㄴ ③ ㄴ, ㄷ ④ ㄱ, ㄴ ⑤ ㄱ, ㄴ, ㄷ  
\#\## 정답  
③  
\#\## 해설  
\$a\_1 \= S\_1 \= 3 - 22 \+ 2 \= \-17\$이고, \$n \\ge 2\$일 때  
\$\$a\_n \= S\_n - S\_{n-1} \= (3n^2 - 22n \+ 2\) - \\{3(n - 1)^2 - 22(n - 1\) \+ 2\\} \= 6n - 25\$\$  
ㄱ. \$a\_2 \= \-13\$, \$a\_3 \= \-7\$이므로 \$a\_2 - a\_1 \= 4 \\ne 6 \= a\_3 - a\_2\$이다. 따라서 등차수열이 아니다. (거짓)  
ㄴ. \$S\_n \= 3\\left(n - \\frac{11}{3}\\right)^2 - \\frac{121}{3} \+ 2\$에서 \$\\frac{11}{3} \= 3.\\overline{6}\$에 가장 가까운 자연수는 \$n \= 4\$이다. (참)  
ㄷ. \$a\_5 \= 6(5) - 25 \= 5\$이므로 \$a\_1 \+ a\_5 \= \-17 \+ 5 \= \-12\$이다. (참)  
따라서 옳은 것은 ㄴ, ㄷ이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "\$a\_1=S\_1\$과 \$n\\\\ge 2\$의 \$a\_n=S\_n-S\_{n-1}\$을 분리하고 \$S\_n\$의 축으로 최솟값 항을 판별한다.", "decisiveStep": "상수항 \$2\$ 때문에 첫째항부터 등차수열이 아님을 확인하고 \$\\\\frac{11}{3}\$에 가장 가까운 \$n=4\$를 판정하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "조건으로 수열 결정"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-121, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상수항 있는 이차식 \$S\_n\$의 첫째항 예외와 이차함수 최솟값 자연수 판정을 종합 점검한다.", "level": "중", "item4slot": {"given": \["수열", "합"\], "goal": \["성질"\], "method": \["일반항", "완전제곱식"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q12  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
다음은 \$2\$ 이상인 모든 자연수 \$n\$에 대하여 부등식  
\$\$\\sum\_{k=1}^{n-1} \\frac{n}{n - k} \\cdot \\frac{1}{3^{k-1}} \< 3 \\qquad \\cdots (\*)\$\$  
이 성립함을 증명하는 과정의 일부이다.

\[증명\]  
\$2\$ 이상인 모든 자연수 \$n\$에 대하여 \$a\_n \= \\sum\_{k=1}^{n-1} \\frac{n}{n - k} \\cdot \\frac{1}{3^{k-1}}\$라 하자.  
\$a\_{n+1} \= \\sum\_{k=1}^n \\frac{n \+ 1}{n \+ 1 - k} \\cdot \\frac{1}{3^{k-1}} \= (\\text{가}) \+ \\frac{n \+ 1}{n - 1}\\cdot\\frac{1}{3} \+ \\frac{n \+ 1}{n - 2}\\cdot\\frac{1}{3^2} \+ \\cdots \+ \\frac{n \+ 1}{3^{n-1}}\$  
이 식을 정리하면 \$a\_{n+1} \= (\\text{나})a\_n \+ \\frac{n \+ 1}{n}\$ (\$n \\ge 2\$)를 얻는다.  
\$a\_2 \= 2 \< 3\$, \$a\_3 \= \\frac{5}{2} \< 3\$이므로 귀납적으로 \$(\*)\$이 성립한다.

(가)의 식을 (나)의 식으로 나눈 값으로 알맞은 것은?  
\#\## 선지  
① \$3\$ ② \$2\$ ③ \$1\$ ④ \$\\frac{1}{3}\$ ⑤ \$\\frac{1}{2}\$  
\#\## 정답  
①  
\#\## 해설  
\$a\_{n+1}\$의 합에서 \$k \= 1\$인 첫 항은 \$\\frac{n \+ 1}{n}\$이므로 \$(\\text{가}) \= \\frac{n \+ 1}{n}\$이다.  
나머지 \$k \= 2\$부터 \$n\$까지의 합에서 \$j \= k - 1\$로 치환하면  
\$\$\\sum\_{j=1}^{n-1} \\frac{n \+ 1}{n - j} \\cdot \\frac{1}{3^j} \= \\frac{n \+ 1}{3n} \\sum\_{j=1}^{n-1} \\frac{n}{n - j} \\cdot \\frac{1}{3^{j-1}} \= \\frac{n \+ 1}{3n} a\_n\$\$  
이므로 \$(\\text{나}) \= \\frac{n \+ 1}{3n}\$이다. 따라서 두 식의 비는 \$\\frac{(n+1)/n}{(n+1)/(3n)} \= 3\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "\$a\_{n+1}\$의 첫 항을 분리하고 나머지 합을 \$j=k-1\$로 평행이동해 \$a\_n\$의 계수를 추출한다.", "decisiveStep": "\$\\\\sum\_{j=1}^{n-1}\\\\frac{n+1}{n-j}\\\\frac{1}{3^j} \= \\\\frac{n+1}{3n}a\_n\$으로 묶어내는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수학적 귀납법", "l4": "부등식·나눗셈 증명"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_MATHEMATICAL\_INDUCTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-132, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "시그마 첨자 이동과 공통인수 분리를 통해 \$a\_{n+1}\$과 \$a\_n\$ 사이의 점화식을 끌어내야 한다.", "level": "상", "item4slot": {"given": \["수열", "부등식"\], "goal": \["비율"\], "method": \["수학적귀납법", "시그마"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q13  
- 형식: 객관식  
- 배점: 5.3  
\#\## 발문  
\$\\angle A \= \\frac{\\pi}{3}\$이고 \$\\overline{AB} : \\overline{AC} \= 2 : 1\$인 삼각형 \$ABC\$가 있다. 삼각형 \$ABC\$의 외접원의 반지름의 길이가 \$6\$일 때, 선분 \$AC\$의 길이는?  
\#\## 선지  
① \$4\$ ② \$6\$ ③ \$8\$ ④ \$4\\sqrt{3}\$ ⑤ \$6\\sqrt{3}\$  
\#\## 정답  
②  
\#\## 해설  
\$\\overline{AC} \= x\$ (\$x \> 0\$)라 하면 \$\\overline{AB} \= 2x\$이다. 코사인법칙에 의해  
\$\$\\overline{BC}^2 \= (2x)^2 \+ x^2 - 2(2x)(x)\\cos\\frac{\\pi}{3} \= 4x^2 \+ x^2 - 2x^2 \= 3x^2 \\implies \\overline{BC} \= \\sqrt{3}x\$\$  
사인법칙 \$\\frac{\\overline{BC}}{\\sin(\\pi/3)} \= 2R \= 12\$에 대입하면  
\$\$\\frac{\\sqrt{3}x}{\\sqrt{3}/2} \= 12 \\implies 2x \= 12 \\implies x \= 6\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "변의 비로 \$\\\\overline{AB}=2x, \\\\overline{AC}=x\$를 놓고 코사인법칙으로 \$\\\\overline{BC}\$를 구한 뒤 사인법칙에 대입한다.", "decisiveStep": "\$\\\\overline{BC}=\\\\sqrt{3}x\$를 \$\\\\frac{\\\\overline{BC}}{\\\\sin 60^\\\\circ}=12\$에 대입해 \$x=6\$을 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "변의 비율 조건에 코사인법칙과 사인법칙을 연속으로 적용하는 문항이다.", "level": "중", "item4slot": {"given": \["삼각형", "원", "비율"\], "goal": \["길이"\], "method": \["코사인법칙", "사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q14  
- 형식: 객관식  
- 배점: 5.3  
\#\## 발문  
두 수열 \$\\{a\_n\\}, \\{b\_n\\}\$은 \$a\_1 \= 1\$, \$b\_1 \= 1\$이고 모든 자연수 \$n\$에 대하여  
\$\$a\_{n+1} \= a\_n \+ b\_n, \\qquad b\_{n+1} \= \\sin\\frac{a\_n}{2}\\pi\$\$  
를 만족시킨다. \$a\_{2027} \+ b\_{2027}\$의 값은?  
\#\## 선지  
① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$  
\#\## 정답  
④  
\#\## 해설  
\$(a\_1, b\_1) \= (1, 1)\$부터 차례로 계산하면  
- \$(a\_2, b\_2) \= (2, \\sin\\frac{\\pi}{2}) \= (2, 1)\$  
- \$(a\_3, b\_3) \= (3, \\sin\\pi) \= (3, 0)\$  
- \$(a\_4, b\_4) \= (3, \\sin\\frac{3\\pi}{2}) \= (3, \-1)\$  
- \$(a\_5, b\_5) \= (2, \\sin\\frac{3\\pi}{2}) \= (2, \-1)\$  
- \$(a\_6, b\_6) \= (1, \\sin\\pi) \= (1, 0)\$  
- \$(a\_7, b\_7) \= (1, \\sin\\frac{\\pi}{2}) \= (1, 1)\$  
따라서 순서쌍 \$(a\_n, b\_n)\$은 주기 \$6\$으로 반복된다.  
\$2027 \= 6 \\times 337 \+ 5\$이므로 \$(a\_{2027}, b\_{2027}) \= (a\_5, b\_5) \= (2, \-1)\$이고, \$a\_{2027} \+ b\_{2027} \= 2 \+ (-1) \= 1\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "연립 점화식을 항별로 계산해 \$(a\_7, b\_7)=(a\_1, b\_1)\$이 되는 주기 \$6\$을 발견하고 나머지로 항을 구한다.", "decisiveStep": "주기 \$6\$을 찾아 \$2027 \\\\equiv 5 \\\\pmod 6\$에서 \$(a\_5, b\_5)=(2, \-1)\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수열의 귀납적 정의", "l4": "점화식으로 항 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_RECURSIVE\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-129, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "연립 점화식과 삼각함수 값을 직접 나열해 주기 \$6\$을 발견해야 한다.", "level": "중", "item4slot": {"given": \["수열", "삼각함수"\], "goal": \["합"\], "method": \["귀납적정의", "주기"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q15  
- 형식: 단답형  
- 배점: 5  
\#\## 발문  
\$2000\$의 모든 양의 약수를 작은 수부터 크기순으로 나열할 때, \$k\$번째 수를 \$a\_k\$라 하자. \$2000\$의 모든 양의 약수의 개수는 \$p\$이고 \$\\sum\_{k=1}^p a\_k \= q\$일 때, \$p \+ q\$의 값을 구하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$4856\$  
\#\## 해설  
\$2000 \= 2^4 \\times 5^3\$이므로 양의 약수의 개수는 \$p \= (4 \+ 1)(3 \+ 1\) \= 20\$이다.  
모든 양의 약수의 총합은  
\$\$q \= (1 \+ 2 \+ 2^2 \+ 2^3 \+ 2^4)(1 \+ 5 \+ 5^2 \+ 5^3) \= 31 \\times 156 \= 4836\$\$  
따라서 \$p \+ q \= 20 \+ 4836 \= 4856\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "소인수분해 \$2000=2^4\\\\cdot 5^3\$으로 약수 개수와 등비수열 합 형태의 약수 총합을 구한다.", "decisiveStep": "\$(1+2+\\\\cdots+2^4)(1+5+\\\\cdots+5^3)=31\\\\times 156=4836\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-120, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "약수의 총합을 두 등비수열 합의 곱으로 계산하는 표준 단답형이다.", "level": "중하", "item4slot": {"given": \["자연수"\], "goal": \["합"\], "method": \["소인수분해", "수열의합"\], "condition": \["약수"\]}, "hold": ""}  
\`\`\`

\## Q16  
- 형식: 단답형  
- 배점: 5  
\#\## 발문  
첫째항이 \$1\$인 수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 할 때, 수열 \$\\{a\_n\\}\$이 모든 자연수 \$n\$에 대하여 다음 조건을 만족시킨다.

(가) \$S\_{2n} \= 0\$  
(나) 수열 \$\\{a\_n a\_{n+1}\\}\$은 공비가 \$0\$이 아닌 등비수열이다.

\$S\_7 \= 8\$일 때, \$S\_{11}\$의 값을 구하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$32\$  
\#\## 해설  
(가)에서 \$S\_2 \= a\_1 \+ a\_2 \= 0\$이므로 \$a\_2 \= \-1\$이고, \$n \\ge 2\$일 때 \$S\_{2n} - S\_{2n-2} \= a\_{2n-1} \+ a\_{2n} \= 0\$이므로 모든 자연수 \$k\$에 대해 \$a\_{2k} \= \-a\_{2k-1}\$이다.  
(나)에서 \$\\{a\_n a\_{n+1}\\}\$의 공비를 \$r\$ (\$r \\ne 0\$)이라 하면  
\$\$r \= \\frac{a\_{2k}a\_{2k+1}}{a\_{2k-1}a\_{2k}} \= \\frac{a\_{2k+1}}{a\_{2k-1}}\$\$  
이므로 홀수 항 \$\\{a\_{2k-1}\\}\$은 첫째항 \$1\$, 공비 \$r\$인 등비수열이다.  
\$S\_6 \= 0\$이므로 \$S\_7 \= S\_6 \+ a\_7 \= a\_7 \= r^3 \= 8\$에서 \$r \= 2\$이다.  
따라서 \$S\_{10} \= 0\$이므로 \$S\_{11} \= S\_{10} \+ a\_{11} \= a\_{11} \= r^5 \= 2^5 \= 32\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "\$S\_{2n}=0\$에서 \$a\_{2k}=-a\_{2k-1}\$을 얻어 곱수열의 공비 \$r\$이 홀수항의 공비임을 유도한다.", "decisiveStep": "\$r \= \\\\frac{a\_{2k+1}}{a\_{2k-1}}\$임을 도출해 \$r^3=8 \\\\implies r=2\$로 \$a\_{11}=32\$를 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "조건으로 수열 결정"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-121, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "짝수 합 \$0\$ 조건과 이웃항 곱 등비수열 조건을 결합해 홀수항의 등비성을 이끌어야 한다.", "level": "상", "item4slot": {"given": \["수열", "합", "등비수열"\], "goal": \["값"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q17  
- 형식: 단답형  
- 배점: 5  
\#\## 발문  
길이가 \$6\$인 선분 \$AB\$를 지름으로 하는 반원이 있다. 선분 \$AB\$의 중점을 \$O\$라 하고, 호 \$AB\$ 위의 점 \$C\$에 대하여 \$\\angle CAB \= \\frac{\\pi}{6}\$라 하자. 점 \$A\$를 지나고 선분 \$OC\$와 평행한 직선이 호 \$AB\$와 만나는 점을 \$P\$, 선분 \$OC\$와 선분 \$BP\$의 교점을 \$Q\$라 하자. 점 \$Q\$를 지나고 선분 \$PO\$와 평행한 직선이 선분 \$OB\$와 만나는 점을 \$D\$라 할 때, 삼각형 \$QDB\$의 넓이 \$S\$와 삼각형 \$PQC\$의 넓이 \$T\$의 합 \$S \+ T\$를 구하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$\\frac{27\\sqrt{3}}{16}\$  
\#\## 해설  
\$O(0, 0)\$을 원점으로 하고 \$AB\$를 \$x\$축 위에 놓으면 \$A(-3, 0)\$, \$B(3, 0)\$, 반원은 \$x^2 \+ y^2 \= 9\$ (\$y \\ge 0\$)이다.  
\$\\angle CAB \= \\frac{\\pi}{6}\$이므로 중심각 \$\\angle COB \= \\frac{\\pi}{3}\$이고 \$C\\left(\\frac{3}{2}, \\frac{3\\sqrt{3}}{2}\\right)\$이다.  
\$AP \\parallel OC\$이므로 \$\\angle PAB \= \\frac{\\pi}{3}\$이고 중심각 \$\\angle POB \= \\frac{2\\pi}{3}\$에서 \$P\\left(-\\frac{3}{2}, \\frac{3\\sqrt{3}}{2}\\right)\$이다.  
직선 \$OC: y \= \\sqrt{3}x\$와 직선 \$BP: y \= \-\\frac{1}{\\sqrt{3}}(x - 3)\$의 교점 \$Q\$를 구하면  
\$\$\\sqrt{3}x \= \-\\frac{x - 3}{\\sqrt{3}} \\implies 3x \= 3 - x \\implies x \= \\frac{3}{4} \\implies Q\\left(\\frac{3}{4}, \\frac{3\\sqrt{3}}{4}\\right)\$\$  
\$QD \\parallel PO\$이고 \$PO\$의 기울기는 \$-\\sqrt{3}\$이므로 \$Q\$를 지나고 기울기가 \$-\\sqrt{3}\$인 직선의 \$x\$절편은 \$D\\left(\\frac{3}{2}, 0\\right)\$이다.  
따라서 \$\\overline{DB} \= 3 - \\frac{3}{2} \= \\frac{3}{2}\$이므로 \$S \= \\frac{1}{2} \\cdot \\frac{3}{2} \\cdot \\frac{3\\sqrt{3}}{4} \= \\frac{9\\sqrt{3}}{16}\$이고,  
\$\\overline{PC} \= \\frac{3}{2} - \\left(-\\frac{3}{2}\\right) \= 3\$, \$Q\$에서 \$PC\$까지 높이는 \$\\frac{3\\sqrt{3}}{2} - \\frac{3\\sqrt{3}}{4} \= \\frac{3\\sqrt{3}}{4}\$이므로 \$T \= \\frac{1}{2} \\cdot 3 \\cdot \\frac{3\\sqrt{3}}{4} \= \\frac{18\\sqrt{3}}{16}\$이다.  
그러므로 \$S \+ T \= \\frac{9\\sqrt{3}}{16} \+ \\frac{18\\sqrt{3}}{16} \= \\frac{27\\sqrt{3}}{16}\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "반원의 중심을 원점으로 좌표 설정하고 원주각·중심각으로 \$C, P, Q, D\$ 좌표를 구해 두 넓이를 합산한다.", "decisiveStep": "\$Q(\\\\frac{3}{4}, \\\\frac{3\\\\sqrt{3}}{4})\$과 \$D(\\\\frac{3}{2}, 0)\$을 구해 \$S\$와 \$T\$를 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "복합도형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-114, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행선과 교점으로 이어지는 기하 구성을 좌표평면에 올려 정확히 계산해야 한다.", "level": "상", "item4slot": {"given": \["반원", "삼각형"\], "goal": \["합"\], "method": \["직선", "삼각형넓이공식"\], "condition": \["평행"\]}, "hold": ""}  
\`\`\`

\## Q18  
- 형식: 단답형  
- 배점: 5  
\#\## 발문  
공차가 자연수인 등차수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 하자. 어떤 자연수 \$k\$에 대하여 \$a\_k \+ a\_{k+1} \+ a\_{k+2} \= 15\$, \$S\_{k+3} \= 13\$이 성립할 때, \$a\_{k+5}\$의 값을 구하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$9\$  
\#\## 해설  
등차중항에 의해 \$3a\_{k+1} \= 15 \\implies a\_{k+1} \= 5\$이고 공차를 자연수 \$d\$라 하면 \$a\_1 \= 5 - kd\$이다.  
\$S\_{k+3} \= \\frac{k \+ 3}{2}\\{2(5 - kd) \+ (k \+ 2)d\\} \= 13 \\implies (k \+ 3)\\{10 \+ (2 - k)d\\} \= 26\$  
\$k \+ 3 \\ge 4\$인 \$26\$의 양의 약수는 \$13, 26\$이다.  
- \$k \+ 3 \= 13\$ (\$k \= 10\$): \$10 - 8d \= 2 \\implies d \= 1\$ (자연수)  
- \$k \+ 3 \= 26\$ (\$k \= 23\$): \$10 - 21d \= 1 \\implies d \= \\frac{9}{21}\$ (탈락)  
따라서 \$a\_{k+5} \= a\_{k+1} \+ 4d \= 5 \+ 4(1) \= 9\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "등차중항으로 \$a\_{k+1}=5\$를 구하고 합 공식의 정수 약수 조건으로 자연수 \$k, d\$를 결정한다.", "decisiveStep": "\$(k+3)\\\\{10+(2-k)d\\\\}=26\$에서 \$k=10, d=1\$을 확정하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차수열 합 식을 자연수 \$k, d\$에 대한 약수 부정방정식으로 풀어내야 한다.", "level": "상", "item4slot": {"given": \["등차수열", "합"\], "goal": \["값"\], "method": \["등차중항", "수열의합"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q19  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
\$2\$ 이상인 모든 자연수 \$n\$에 대하여 다음 부등식이 성립함을 수학적 귀납법으로 증명하시오.  
\$\$1 \+ \\frac{1}{2} \+ \\frac{1}{3} \+ \\cdots \+ \\frac{1}{2^n} \> 1 \+ \\frac{n}{2}\$\$  
\#\## 선지  
없음  
\#\## 정답  
주어진 부등식은 \$2\$ 이상인 모든 자연수 \$n\$에 대하여 성립한다.  
\#\## 해설  
\$S\_n \= 1 \+ \\frac{1}{2} \+ \\cdots \+ \\frac{1}{2^n}\$이라 하자.  
(ⅰ) \$n \= 2\$일 때, \$S\_2 \= 1 \+ \\frac{1}{2} \+ \\frac{1}{3} \+ \\frac{1}{4} \= \\frac{25}{12} \> 2 \= 1 \+ \\frac{2}{2}\$이므로 성립한다.

(ⅱ) \$n \= k\$ (\$k \\ge 2\$)일 때 \$S\_k \> 1 \+ \\frac{k}{2}\$가 성립한다고 가정하자.  
\$n \= k \+ 1\$일 때,  
\$\$S\_{k+1} \= S\_k \+ \\left(\\frac{1}{2^k \+ 1} \+ \\frac{1}{2^k \+ 2} \+ \\cdots \+ \\frac{1}{2^{k+1}}\\right)\$\$  
괄호 안의 항은 모두 \$2^k\$개이고 각 항은 최소값 \$\\frac{1}{2^{k+1}}\$ 이상이므로  
\$\$S\_{k+1} \> \\left(1 \+ \\frac{k}{2}\\right) \+ 2^k \\cdot \\frac{1}{2^{k+1}} \= 1 \+ \\frac{k}{2} \+ \\frac{1}{2} \= 1 \+ \\frac{k \+ 1}{2}\$\$  
따라서 \$n \= k \+ 1\$일 때도 성립한다.

(ⅰ), (ⅱ)에 의하여 \$2\$ 이상인 모든 자연수 \$n\$에 대하여 주어진 부등식이 성립한다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "귀납 가정에 추가되는 \$2^k\$개 항을 모두 최소 항 \$\\\\frac{1}{2^{k+1}}\$로 아래에서 묶어 부등식을 증명한다.", "decisiveStep": "\$2^k\$개 항의 합이 \$2^k\\\\cdot\\\\frac{1}{2^{k+1}}=\\\\frac{1}{2}\$ 이상임을 보이는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수학적 귀납법", "l4": "부등식·나눗셈 증명"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_MATHEMATICAL\_INDUCTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-132, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수학적 귀납법으로 조화급수 구간 합을 최솟값으로 하한 평가해 부등식을 증명해야 한다.", "level": "중", "item4slot": {"given": \["부등식", "자연수"\], "goal": \["증명"\], "method": \["수학적귀납법"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q20  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
직각을 낀 두 변의 길이가 \$2\$인 직각이등변삼각형이 있다. 이 직각이등변삼각형의 빗변에 \$2\$개의 꼭짓점이 있고 직각을 낀 두 변에 나머지 \$2\$개의 꼭짓점이 있는 정사각형에 색칠하여 얻은 그림을 \$R\_1\$이라 하자. 그림 \$R\_1\$에서 색칠된 정사각형 바깥에 남는 합동인 \$2\$개의 직각이등변삼각형에 각각 같은 방법으로 정사각형을 색칠하여 얻은 그림을 \$R\_2\$라 하고, 이와 같은 과정을 계속하여 \$n\$번째 얻은 그림 \$R\_n\$에 색칠되어 있는 모든 정사각형의 넓이의 합을 \$S\_n\$이라 하자. \$S\_6 \= \\frac{q}{p}\\left(1 - \\left(\\frac{m}{n}\\right)^{12}\\right)\$일 때, \$p \+ q \+ m \+ n\$의 값을 구하는 풀이과정과 답을 서술하시오. (단, \$p, q\$는 서로소인 자연수, \$m, n\$은 서로소인 자연수이다.)  
\#\## 선지  
없음  
\#\## 정답  
\$18\$  
\#\## 해설  
직각을 낀 두 변이 \$2\$인 직각이등변삼각형의 빗변의 길이는 \$2\\sqrt{2}\$이다.  
첫 정사각형의 한 변의 길이를 \$s\$라 하면 양 끝에 생기는 직각이등변삼각형의 빗변 위의 조각 길이도 각각 \$s\$이므로 \$3s \= 2\\sqrt{2} \\implies s \= \\frac{2\\sqrt{2}}{3}\$이다.  
따라서 첫 정사각형의 넓이는 \$A\_1 \= s^2 \= \\frac{8}{9}\$이다.  
각 단계마다 남는 직각이등변삼각형의 닮음비는 \$\\frac{s}{2} \= \\frac{\\sqrt{2}}{3}\$이고 개수가 \$2\$배씩 늘어나므로 새로 색칠되는 넓이의 비(공비)는 \$r \= 2 \\times \\left(\\frac{\\sqrt{2}}{3}\\right)^2 \= \\frac{4}{9}\$이다.  
따라서 \$S\_6\$은 첫째항 \$\\frac{8}{9}\$, 공비 \$\\frac{4}{9}\$인 등비수열의 제\$6\$항까지의 합이므로  
\$\$S\_6 \= \\frac{\\frac{8}{9}\\left(1 - \\left(\\frac{4}{9}\\right)^6\\right)}{1 - \\frac{4}{9}} \= \\frac{8}{5}\\left(1 - \\left(\\frac{2}{3}\\right)^{12}\\right)\$\$  
그러므로 \$p \= 5, q \= 8, m \= 2, n \= 3\$이고 \$p \+ q \+ m \+ n \= 5 \+ 8 \+ 2 \+ 3 \= 18\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "빗변 \$3\$등분으로 첫 정사각형 한 변과 넓이를 구하고 닮음비 제곱에 개수비 \$2\$를 곱해 공비 \$\\\\frac{4}{9}\$를 얻는다.", "decisiveStep": "닮음비 \$\\\\frac{\\\\sqrt{2}}{3}\$과 개수 \$2\$배에서 공비 \$\\\\frac{4}{9}\$를 구해 등비수열 합 \$S\_6\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "귀납적 패턴"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-122, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "프랙탈 도형의 내접 정사각형 변 길이, 닮음비, 개수비, 등비수열 합을 종합해야 한다.", "level": "상", "item4slot": {"given": \["직각이등변삼각형", "정사각형"\], "goal": \["합"\], "method": \["닮음", "수열의합"\], "condition": \["서로소"\]}, "hold": ""}  
\`\`\`

\## Q21  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
\$\\overline{AB} \= 4\$, \$\\cos(\\angle BAC) \= \\frac{1}{5}\$인 삼각형 \$ABC\$가 있다. 선분 \$AC\$ 위의 한 점 \$D\$에 대하여 직선 \$BD\$가 삼각형 \$ABC\$의 외접원과 만나는 점 중 \$B\$가 아닌 점을 \$E\$라 하자. \$\\overline{DE} \= 5\$, \$\\overline{CD} \+ \\overline{CE} \= 7\$일 때, 삼각형 \$ABC\$의 외접원의 넓이를 구하는 풀이과정과 답을 서술하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$\\frac{5425\\pi}{96}\$  
\#\## 해설  
\$\\overline{CD} \= x\$, \$\\overline{CE} \= y\$라 하면 \$x \+ y \= 7\$이다.  
네 점 \$A, B, C, E\$가 한 원 위에 있으므로 원주각의 성질에 의해 \$\\angle CED \= \\angle CEB \= \\angle CAB \= A\$이다.  
\$\\triangle CDE\$에서 코사인법칙을 적용하면  
\$\$(7 - y)^2 \= y^2 \+ 5^2 - 2 \\cdot y \\cdot 5 \\cdot \\frac{1}{5} \\implies 49 - 14y \+ y^2 \= y^2 \+ 25 - 2y \\implies 12y \= 24 \\implies y \= 2\$\$  
따라서 \$\\overline{CE} \= 2\$, \$\\overline{CD} \= 5\$이다.  
맞꼭지각 \$\\angle CDE \= \\angle BDA\$와 원주각 \$\\angle CED \= \\angle BAD\$에 의해 \$\\triangle CDE \\sim \\triangle BDA\$이므로  
\$\$\\frac{\\overline{CE}}{\\overline{BA}} \= \\frac{\\overline{DE}}{\\overline{DA}} \\implies \\frac{2}{4} \= \\frac{5}{\\overline{DA}} \\implies \\overline{DA} \= 10\$\$  
따라서 \$\\overline{AC} \= \\overline{CD} \+ \\overline{DA} \= 5 \+ 10 \= 15\$이다.  
\$\\triangle ABC\$에서 코사인법칙에 의해  
\$\$\\overline{BC}^2 \= 4^2 \+ 15^2 - 2 \\cdot 4 \\cdot 15 \\cdot \\frac{1}{5} \= 16 \+ 225 - 24 \= 217\$\$  
\$\\sin^2 A \= 1 - \\left(\\frac{1}{5}\\right)^2 \= \\frac{24}{25}\$이고 외접원의 반지름을 \$R\$이라 하면 사인법칙에서  
\$\$4R^2 \= \\frac{\\overline{BC}^2}{\\sin^2 A} \= \\frac{217}{24/25} \= \\frac{5425}{24} \\implies R^2 \= \\frac{5425}{96}\$\$  
따라서 외접원의 넓이는 \$\\pi R^2 \= \\frac{5425\\pi}{96}\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "원주각으로 \$\\\\angle CED=\\\\angle CAB\$를 찾아 코사인법칙으로 \$\\\\overline{CD}, \\\\overline{CE}\$를 구하고 \$\\\\triangle CDE \\\\sim \\\\triangle BDA\$ 닮음으로 \$\\\\overline{AC}\$를 구해 외접원 넓이를 계산한다.", "decisiveStep": "\$\\\\triangle CDE \\\\sim \\\\triangle BDA\$ 닮음으로 \$\\\\overline{DA}=10\$을 구해 \$\\\\overline{AC}=15\$를 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_SINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-110, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 5, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원주각, 코사인법칙 연립, 삼각형 닮음, 사인법칙 외접원 넓이까지 4단계 추론이 모두 필요한 최고난도 문항이다.", "level": "상", "item4slot": {"given": \["삼각형", "원"\], "goal": \["넓이"\], "method": \["코사인법칙", "닮음", "사인법칙"\], "condition": \["내접"\]}, "hold": ""}  
\`\`\`  
