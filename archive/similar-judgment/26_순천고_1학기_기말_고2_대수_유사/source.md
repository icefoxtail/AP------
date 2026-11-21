\`\`\`json:exam  
{"stem": "26\_순천고\_1학기\_기말\_고2\_대수\_유사", "sourceArchiveFile": "original/high/h2/1final/26\_순천고\_1학기\_기말\_고2\_대수.js", "examFolder": "1final", "grade": "고2", "subject": "대수", "curriculum": "2022", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-21"}  
\`\`\`

\## Q01  
- 형식: 객관식  
- 배점: 3.2  
\#\## 발문  
\$\\cos\\frac{5}{6}\\pi\$의 값은?  
\#\## 선지  
① \$-1\$ ② \$-\\frac{\\sqrt{3}}{2}\$ ③ \$-\\frac{1}{2}\$ ④ \$\\frac{1}{2}\$ ⑤ \$\\frac{\\sqrt{3}}{2}\$  
\#\## 정답  
②  
\#\## 해설  
\$\$\\cos\\frac{5}{6}\\pi \= \\cos\\left(\\pi - \\frac{\\pi}{6}\\right) \= \-\\cos\\frac{\\pi}{6} \= \-\\frac{\\sqrt{3}}{2}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_BASIC", "conceptClusterKey": "", "primaryMethod": "보각 변환 \$\\\\cos(\\\\pi-\\\\theta)=-\\\\cos\\\\theta\$를 적용해 특수각 코사인값을 구한다.", "decisiveStep": "\$\\\\cos(\\\\pi-\\\\frac{\\\\pi}{6})=-\\\\cos\\\\frac{\\\\pi}{6}\$으로 부호를 결정하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 성질", "l4": "주기·대칭"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_TRIG\_PROPERTIES", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-099, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제2사분면 각의 코사인 부호와 특수각 값을 묻는 기초 문항이다.", "level": "하", "item4slot": {"given": \["삼각함수"\], "goal": \["값"\], "method": \["삼각함수의성질"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q02  
- 형식: 객관식  
- 배점: 3.2  
\#\## 발문  
첫째항이 \$2\$, 공비가 \$\\sqrt{2}\$인 등비수열 \$\\{a\_n\\}\$의 제\$7\$항은?  
\#\## 선지  
① \$4\\sqrt{2}\$ ② \$8\$ ③ \$8\\sqrt{2}\$ ④ \$12\$ ⑤ \$16\$  
\#\## 정답  
⑤  
\#\## 해설  
등비수열의 일반항 \$a\_n \= a\_1 r^{n-1}\$에 \$a\_1 \= 2\$, \$r \= \\sqrt{2}\$, \$n \= 7\$을 대입하면  
\$\$a\_7 \= 2(\\sqrt{2})^{7-1} \= 2(\\sqrt{2})^6 \= 2 \\times 2^3 \= 16\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "등비수열 일반항 \$a\_n \= a\_1 r^{n-1}\$에 \$n=7\$을 대입한다.", "decisiveStep": "\$(\\\\sqrt{2})^6 \= 2^3 \= 8\$을 계산해 \$16\$을 얻는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-118, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등비수열 일반항 공식 1회 대입으로 바로 풀린다.", "level": "하", "item4slot": {"given": \["등비수열"\], "goal": \["값"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q03  
- 형식: 객관식  
- 배점: 3.3  
\#\## 발문  
등차수열 \$\\{a\_n\\}\$에 대하여 \$a\_3 \= 8\$, \$a\_6 \= 20\$일 때, \$a\_{10}\$의 값은?  
\#\## 선지  
① \$32\$ ② \$34\$ ③ \$36\$ ④ \$38\$ ⑤ \$40\$  
\#\## 정답  
③  
\#\## 해설  
공차를 \$d\$라 하면 \$a\_6 - a\_3 \= 3d \= 20 - 8 \= 12 \\implies d \= 4\$이다.  
따라서 \$a\_{10} \= a\_6 \+ 4d \= 20 \+ 4 \\times 4 \= 36\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "두 항의 차 \$a\_6-a\_3=3d\$로 공차를 구한 뒤 \$a\_{10}=a\_6+4d\$를 계산한다.", "decisiveStep": "\$3d=12\$에서 \$d=4\$를 구해 \$a\_{10}=36\$을 얻는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-115, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차수열의 두 항으로부터 공차와 다른 항을 구하는 기본 문항이다.", "level": "하", "item4slot": {"given": \["등차수열"\], "goal": \["값"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q04  
- 형식: 객관식  
- 배점: 3.3  
\#\## 발문  
둘레의 길이가 \$10\\pi\$인 원에 내접하는 삼각형 \$ABC\$에서 \$\\sin A \= \\frac{2}{5}\$일 때, \$\\overline{BC}\$의 값은?  
\#\## 선지  
① \$4\$ ② \$2\$ ③ \$3\$ ④ \$5\$ ⑤ \$6\$  
\#\## 정답  
①  
\#\## 해설  
원의 둘레가 \$10\\pi\$이므로 반지름 \$R \= 5\$이다.  
사인법칙에 의해 \$\\frac{\\overline{BC}}{\\sin A} \= 2R\$이므로  
\$\$\\overline{BC} \= 2R\\sin A \= 10 \\times \\frac{2}{5} \= 4\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "원 둘레로 외접원 반지름 \$R=5\$를 구한 뒤 사인법칙 \$\\\\overline{BC}=2R\\\\sin A\$를 적용한다.", "decisiveStep": "\$2R \= 10\$과 \$\\\\sin A \= \\\\frac{2}{5}\$를 곱해 \$\\\\overline{BC}=4\$를 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_SINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-110, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원 둘레에서 지름을 찾고 사인법칙에 바로 대입하면 된다.", "level": "하", "item4slot": {"given": \["원", "삼각형"\], "goal": \["길이"\], "method": \["사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q05  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
함수 \$y \= 3\\sin\\left(2x - \\frac{\\pi}{4}\\right) - 1\$의 최댓값을 \$a\$, 최솟값을 \$b\$, 주기를 \$c\$라 할 때, \$abc\$의 값은?  
\#\## 선지  
① \$-4\\pi\$ ② \$-6\\pi\$ ③ \$8\\pi\$ ④ \$-8\\pi\$ ⑤ \$4\\pi\$  
\#\## 정답  
④  
\#\## 해설  
\$-1 \\le \\sin\\left(2x - \\frac{\\pi}{4}\\right) \\le 1\$이므로 최댓값 \$a \= 3 - 1 \= 2\$, 최솟값 \$b \= \-3 - 1 \= \-4\$이다.  
주기는 \$c \= \\frac{2\\pi}{2} \= \\pi\$이므로 \$abc \= 2 \\times (-4) \\times \\pi \= \-8\\pi\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_GRAPH", "conceptClusterKey": "", "primaryMethod": "삼각함수 진폭·수직이동·주기 공식으로 \$a, b, c\$를 각각 구해 곱한다.", "decisiveStep": "\$a=2, b=-4, c=\\\\pi\$를 구해 곱 \$-8\\\\pi\$를 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 그래프", "l3": "그래프 변환", "l4": "주기·진폭"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_TRIG\_GRAPH\_TRANSFORM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-105, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사인함수의 최댓값·최솟값·주기 기본 공식을 바로 확인한다.", "level": "하", "item4slot": {"given": \["삼각함수"\], "goal": \["값"\], "method": \["평행이동", "삼각함수"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q06  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
삼각형 \$ABC\$에서 \$\\overline{AB} \= 4\$, \$\\overline{BC} \= 6\$, \$\\cos B \= \\frac{\\sqrt{7}}{4}\$일 때, 삼각형 \$ABC\$의 넓이는?  
\#\## 선지  
① \$6\$ ② \$8\$ ③ \$9\$ ④ \$12\$ ⑤ \$6\\sqrt{7}\$  
\#\## 정답  
③  
\#\## 해설  
삼각형의 내각 \$B\$에 대하여 \$\\sin B \> 0\$이므로  
\$\$\\sin B \= \\sqrt{1 - \\cos^2 B} \= \\sqrt{1 - \\frac{7}{16}} \= \\frac{3}{4}\$\$  
따라서 삼각형 \$ABC\$의 넓이는  
\$\$S \= \\frac{1}{2} \\cdot \\overline{AB} \\cdot \\overline{BC} \\cdot \\sin B \= \\frac{1}{2} \\times 4 \\times 6 \\times \\frac{3}{4} \= 9\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "\$\\\\sin B=\\\\sqrt{1-\\\\cos^2 B}\$로 사인값을 구한 뒤 두 변과 끼인각 넓이 공식에 대입한다.", "decisiveStep": "\$\\\\sin B \= \\\\frac{3}{4}\$을 구해 \$S \= \\\\frac{1}{2}\\\\cdot 4\\\\cdot 6\\\\cdot \\\\frac{3}{4}=9\$를 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "두 변과 끼인각"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-113, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "\$\\\\cos B\$에서 \$\\\\sin B\$를 구하는 상호관계와 넓이 공식을 결합한 문항이다.", "level": "중하", "item4slot": {"given": \["삼각형", "길이"\], "goal": \["넓이"\], "method": \["삼각함수의상호관계", "삼각형넓이공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q07  
- 형식: 객관식  
- 배점: 3.6  
\#\## 발문  
첫째항이 \$3\$, 제\$6\$항이 \$18\$인 등차수열의 첫째항부터 제\$10\$항까지의 합은?  
\#\## 선지  
① \$150\$ ② \$165\$ ③ \$180\$ ④ \$195\$ ⑤ \$210\$  
\#\## 정답  
②  
\#\## 해설  
공차를 \$d\$라 하면 \$a\_6 \= 3 \+ 5d \= 18 \\implies d \= 3\$이다.  
제\$10\$항은 \$a\_{10} \= 3 \+ 9 \\times 3 \= 30\$이므로 첫째항부터 제\$10\$항까지의 합은  
\$\$S\_{10} \= \\frac{10(3 \+ 30)}{2} \= 5 \\times 33 \= 165\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "제6항 조건으로 공차 \$d=3\$을 구한 뒤 제10항과 등차수열 합 공식을 적용한다.", "decisiveStep": "\$5d=15\$에서 \$a\_{10}=30\$을 찾아 \$S\_{10}=165\$를 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공차 계산 후 등차수열 합 공식에 대입하는 기본 문항이다.", "level": "하", "item4slot": {"given": \["등차수열"\], "goal": \["합"\], "method": \["수열의합"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q08  
- 형식: 객관식  
- 배점: 3.8  
\#\## 발문  
수열 \$\\{a\_n\\}\$의 일반항이 \$a\_n \= n \+ 8\$일 때, \$\\sum\_{k=1}^{40} \\frac{1}{\\sqrt{a\_k} \+ \\sqrt{a\_{k+1}}}\$의 값은?  
\#\## 선지  
① \$1\$ ② \$2\$ ③ \$3\$ ④ \$5\$ ⑤ \$4\$  
\#\## 정답  
⑤  
\#\## 해설  
\$a\_k \= k \+ 8\$, \$a\_{k+1} \= k \+ 9\$이므로 분모를 유리화하면  
\$\$\\frac{1}{\\sqrt{k \+ 8} \+ \\sqrt{k \+ 9}} \= \\frac{\\sqrt{k \+ 9} - \\sqrt{k \+ 8}}{(k \+ 9\) - (k \+ 8)} \= \\sqrt{k \+ 9} - \\sqrt{k \+ 8}\$\$  
따라서 \$k \= 1\$부터 \$40\$까지 더하면 인접한 항이 소거되어  
\$\$\\sum\_{k=1}^{40} (\\sqrt{k \+ 9} - \\sqrt{k \+ 8}) \= \\sqrt{49} - \\sqrt{9} \= 7 - 3 \= 4\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_SUM", "conceptClusterKey": "", "primaryMethod": "분모를 유리화해 \$\\\\sqrt{k+9}-\\\\sqrt{k+8}\$ 형태로 바꾼 뒤 망원급수로 소거한다.", "decisiveStep": "소거 후 \$\\\\sqrt{49}-\\\\sqrt{9}=4\$를 얻는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "여러 가지 수열의 합", "l4": "부분분수·망원급수형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SEQUENCE\_SUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-126, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리식 분모 유리화를 통한 망원급수 소거의 표준 문항이다.", "level": "중하", "item4slot": {"given": \["수열"\], "goal": \["합"\], "method": \["유리화", "시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q09  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
삼각형 \$ABC\$에 대하여 \$\\overline{BC} \= a\$, \$\\overline{CA} \= b\$, \$\\overline{AB} \= c\$, 넓이를 \$S\$라 할 때, \$S \= \\frac{1}{4}a^2\\tan B\$를 만족시키는 삼각형은 어떤 삼각형인가? (단, \$\\angle B \\ne \\frac{\\pi}{2}\$)  
\#\## 선지  
① \$a \= b\$인 이등변삼각형 ② \$a \= c\$인 이등변삼각형 ③ \$A \= \\frac{\\pi}{2}\$인 직각삼각형 ④ \$b \= c\$인 이등변삼각형 ⑤ \$C \= \\frac{\\pi}{2}\$인 직각삼각형  
\#\## 정답  
④  
\#\## 해설  
삼각형의 넓이 \$S \= \\frac{1}{2}ac\\sin B\$를 조건식에 대입하면  
\$\$\\frac{1}{2}ac\\sin B \= \\frac{1}{4}a^2\\frac{\\sin B}{\\cos B}\$\$  
\$a \> 0, \\sin B \> 0, \\cos B \\ne 0\$이므로 양변을 정리하면 \$2c\\cos B \= a\$이다.  
코사인법칙 \$b^2 \= a^2 \+ c^2 - 2ac\\cos B\$에 \$2c\\cos B \= a\$를 대입하면  
\$\$b^2 \= a^2 \+ c^2 - a^2 \= c^2 \\implies b \= c\$\$  
따라서 \$b \= c\$인 이등변삼각형이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "넓이 공식 \$S=\\\\frac{1}{2}ac\\\\sin B\$로 \$2c\\\\cos B=a\$를 얻은 뒤 코사인법칙에 대입해 변 관계를 판정한다.", "decisiveStep": "\$b^2=a^2+c^2-2ac\\\\cos B\$에 \$2c\\\\cos B=a\$를 대입해 \$b=c\$를 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "삼각형 판정"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-112, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각형 넓이 식과 \$\\\\tan B \= \\\\frac{\\\\sin B}{\\\\cos B}\$, 코사인법칙을 연결해 도형을 판정한다.", "level": "중", "item4slot": {"given": \["삼각형", "넓이"\], "goal": \["삼각형"\], "method": \["삼각형넓이공식", "코사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q10  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
두 수열 \$\\{a\_n\\}, \\{b\_n\\}\$에 대하여 \$\\sum\_{k=1}^{10} (2a\_k - b\_k) \= 11\$, \$\\sum\_{k=1}^{10} (a\_k \+ 2b\_k) \= 18\$일 때, \$\\sum\_{k=1}^{10} (a\_k - b\_k)\$의 값은?  
\#\## 선지  
① \$3\$ ② \$5\$ ③ \$7\$ ④ \$9\$ ⑤ \$11\$  
\#\## 정답  
①  
\#\## 해설  
\$A \= \\sum\_{k=1}^{10} a\_k\$, \$B \= \\sum\_{k=1}^{10} b\_k\$라 하면  
\$\$2A - B \= 11, \\qquad A \+ 2B \= 18\$\$  
첫째 식을 \$2\$배하여 둘째 식과 더하면 \$5A \= 40 \\implies A \= 8\$이고, \$B \= 2(8) - 11 \= 5\$이다.  
따라서 \$\\sum\_{k=1}^{10} (a\_k - b\_k) \= A - B \= 8 - 5 \= 3\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "\$\\\\sum a\_k \= A, \\\\sum b\_k \= B\$로 치환해 연립일차방정식을 푼다.", "decisiveStep": "\$2A-B=11, A+2B=18\$에서 \$A=8, B=5\$를 구해 \$A-B=3\$을 얻는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "합의 기호 Σ", "l4": "성질"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SIGMA\_NOTATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-124, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "\$\\\\sum\$의 선형성을 이용해 두 합의 연립일차방정식을 푸는 문항이다.", "level": "중하", "item4slot": {"given": \["수열의합"\], "goal": \["값"\], "method": \["시그마", "연립방정식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q11  
- 형식: 객관식  
- 배점: 4.1  
\#\## 발문  
삼각형 \$ABC\$가 다음 조건을 만족시킬 때, 삼각형 \$ABC\$의 넓이는?

(가) \$\\cos A \= \\frac{1}{2}\$  
(나) 삼각형 \$ABC\$의 외접원의 넓이는 \$\\frac{196}{3}\\pi\$이다.  
(다) \$\\overline{AB} : \\overline{AC} \= 3 : 8\$이다.  
\#\## 선지  
① \$12\\sqrt{3}\$ ② \$16\\sqrt{3}\$ ③ \$20\\sqrt{3}\$ ④ \$24\\sqrt{3}\$ ⑤ \$28\\sqrt{3}\$  
\#\## 정답  
④  
\#\## 해설  
(가) \$\\cos A \= \\frac{1}{2}\$이고 \$0 \< A \< \\pi\$이므로 \$A \= 60^\\circ\$이다.  
(나) 외접원 반지름 \$R\$에 대하여 \$\\pi R^2 \= \\frac{196}{3}\\pi \\implies R \= \\frac{14}{\\sqrt{3}}\$이다.  
사인법칙에 의해 \$\\overline{BC} \= 2R\\sin 60^\\circ \= 2 \\cdot \\frac{14}{\\sqrt{3}} \\cdot \\frac{\\sqrt{3}}{2} \= 14\$이다.  
(다) \$\\overline{AB} \= 3t\$, \$\\overline{AC} \= 8t\$ (\$t \> 0\$)라 두고 코사인법칙을 적용하면  
\$\$14^2 \= (3t)^2 \+ (8t)^2 - 2(3t)(8t)\\cos 60^\\circ \= (9 \+ 64 - 24)t^2 \= 49t^2\$\$  
\$t \> 0\$이므로 \$t \= 2\$이고 \$\\overline{AB} \= 6\$, \$\\overline{AC} \= 16\$이다.  
따라서 넓이는 \$S \= \\frac{1}{2} \\times 6 \\times 16 \\times \\sin 60^\\circ \= 24\\sqrt{3}\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "외접원 넓이와 사인법칙으로 \$\\\\overline{BC}=14\$를 구한 뒤 변의 비와 코사인법칙으로 두 변을 확정한다.", "decisiveStep": "\$49t^2 \= 196\$에서 \$t=2\$를 구해 넓이 \$24\\\\sqrt{3}\$을 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외접원 넓이·사인법칙·코사인법칙·삼각형 넓이 공식을 순차적으로 연결해야 한다.", "level": "중", "item4slot": {"given": \["삼각형", "원", "비율"\], "goal": \["넓이"\], "method": \["사인법칙", "코사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q12  
- 형식: 객관식  
- 배점: 4.2  
\#\## 발문  
함수 \$y \= \\tan\\left(2x - \\frac{\\pi}{2}\\right) \+ 3\$의 그래프에 대한 설명으로 옳지 않은 것은?  
\#\## 선지  
① 치역은 실수 전체의 집합이다. ② 점근선의 방정식은 \$x \= \\frac{n\\pi}{2} \+ \\frac{\\pi}{4}\$ (단, \$n\$은 정수)이다. ③ 주기는 \$\\frac{\\pi}{2}\$이다. ④ 최댓값은 존재하지 않는다. ⑤ 점 \$\\left(\\frac{\\pi}{4}, 3\\right)\$을 지난다.  
\#\## 정답  
②  
\#\## 해설  
① 탄젠트함수의 치역은 실수 전체이므로 참이다.  
② 점근선은 \$2x - \\frac{\\pi}{2} \= \\frac{\\pi}{2} \+ n\\pi\$ (\$n\$은 정수)일 때이므로 \$2x \= (n \+ 1)\\pi \\implies x \= \\frac{(n \+ 1)\\pi}{2}\$, 즉 \$x \= \\frac{m\\pi}{2}\$ (\$m\$은 정수)이다. 따라서 ②는 거짓이다.  
③ 주기는 \$\\frac{\\pi}{2}\$이므로 참이다.  
④ 탄젠트함수는 최댓값·최솟값이 없으므로 참이다.  
⑤ \$x \= \\frac{\\pi}{4}\$일 때 \$y \= \\tan 0 \+ 3 \= 3\$이므로 참이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_GRAPH", "conceptClusterKey": "", "primaryMethod": "탄젠트 함수의 점근선 조건 \$2x-\\\\frac{\\\\pi}{2}=\\\\frac{\\\\pi}{2}+n\\\\pi\$를 풀어 선지별 성질을 판별한다.", "decisiveStep": "\$2x-\\\\frac{\\\\pi}{2}=\\\\frac{\\\\pi}{2}+n\\\\pi\$에서 점근선이 \$x=\\\\frac{m\\\\pi}{2}\$임을 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 그래프", "l3": "그래프 변환", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_TRANSFORM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-106, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동된 탄젠트 함수의 점근선 이동을 정확히 계산해야 오답 선지를 가릴 수 있다.", "level": "중하", "item4slot": {"given": \["삼각함수"\], "goal": \["성질"\], "method": \["평행이동", "점근선"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q13  
- 형식: 객관식  
- 배점: 4.2  
\#\## 발문  
첫째항이 \$1\$인 등비수열 \$\\{a\_n\\}\$에 대하여 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 하자. \$S\_n \= 7\$, \$S\_{2n} \= 63\$일 때, \$\\sum\_{k=1}^n a\_{2k}\$의 값은?  
\#\## 선지  
① \$21\$ ② \$30\$ ③ \$36\$ ④ \$40\$ ⑤ \$42\$  
\#\## 정답  
⑤  
\#\## 해설  
공비를 \$r\$이라 하면 \$S\_{2n} \= S\_n(1 \+ r^n)\$이므로 \$63 \= 7(1 \+ r^n) \\implies r^n \= 8\$이다.  
\$r \\ne 1\$이고 \$a\_1 \= 1\$이므로 \$S\_n \= \\frac{r^n - 1}{r - 1} \= \\frac{7}{r - 1} \= 7 \\implies r \= 2\$이다.  
짝수 번째 항 \$a\_{2k} \= 2^{2k-1} \= 2 \\cdot 4^{k-1}\$의 첫 \$n\$항의 합은  
\$\$\\sum\_{k=1}^n a\_{2k} \= 2 \\cdot \\frac{4^n - 1}{4 - 1} \= \\frac{2\\{(2^n)^2 - 1\\}}{3} \= \\frac{2(8^2 - 1)}{3} \= \\frac{2 \\times 63}{3} \= 42\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "\$S\_{2n}=S\_n(1+r^n)\$으로 \$r^n=8\$과 공비 \$r=2\$를 구한 뒤 짝수항 등비합에 대입한다.", "decisiveStep": "\$r^n=8, r=2\$에서 \$4^n=(r^n)^2=64\$를 대입해 \$42\$를 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-120, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부분합의 비로 \$r^n\$과 \$r\$을 구하고 짝수항만의 등비수열 합 공식을 적용해야 한다.", "level": "중", "item4slot": {"given": \["등비수열", "합"\], "goal": \["합"\], "method": \["수열의합"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q14  
- 형식: 객관식  
- 배점: 4.3  
\#\## 발문  
수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 할 때, \$S\_n \= \-n^2 \+ 7n \+ 8\$이다. \$\\sum\_{k=1}^7 \|a\_k\|\$의 값은?  
\#\## 선지  
① \$32\$ ② \$28\$ ③ \$30\$ ④ \$34\$ ⑤ \$36\$  
\#\## 정답  
①  
\#\## 해설  
\$a\_1 \= S\_1 \= \-1 \+ 7 \+ 8 \= 14\$이다.  
\$n \\ge 2\$일 때 \$a\_n \= S\_n - S\_{n-1} \= (-n^2 \+ 7n \+ 8\) - \\{-(n-1)^2 \+ 7(n-1) \+ 8\\} \= \-2n \+ 8\$이다.  
따라서 \$a\_2, a\_3, \\dots, a\_7\$은 차례로 \$4, 2, 0, \-2, \-4, \-6\$이므로  
\$\$\\sum\_{k=1}^7 \|a\_k\| \= 14 \+ 4 \+ 2 \+ 0 \+ 2 \+ 4 \+ 6 \= 32\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "\$a\_1=S\_1\$과 \$n\\\\ge 2\$의 \$a\_n=S\_n-S\_{n-1}\$을 분리해 구한 뒤 각 항의 절댓값을 합산한다.", "decisiveStep": "상수항 \$8\$ 때문에 \$a\_1=14\$를 별도 처리해 절댓값 합 \$32\$를 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "조건으로 수열 결정"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-121, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상수항이 있는 \$S\_n\$에서 \$a\_1\$ 예외와 절댓값 부호 전환을 함께 처리해야 한다.", "level": "중하", "item4slot": {"given": \["수열", "합"\], "goal": \["합"\], "method": \["일반항", "절댓값"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q15  
- 형식: 객관식  
- 배점: 4.4  
\#\## 발문  
\$0 \\le x \< 12\$에서 함수 \$y \= 4\\sin\\frac{\\pi}{4}x\$의 그래프와 직선 \$y \= 2\$가 만나는 네 점을 \$x\$좌표가 작은 것부터 차례로 \$A, B, C, D\$라 하자. 이때 삼각형 \$BOC\$의 넓이를 \$S\$, 선분 \$AD\$의 길이를 \$l\$이라 하면 \$S \+ l\$의 값은? (단, \$O\$는 원점이다.)  
\#\## 선지  
① \$12\$ ② \$14\$ ③ \$16\$ ④ \$18\$ ⑤ \$20\$  
\#\## 정답  
③  
\#\## 해설  
\$4\\sin\\frac{\\pi}{4}x \= 2 \\implies \\sin\\frac{\\pi}{4}x \= \\frac{1}{2}\$이다.  
\$0 \\le x \< 12\$에서 \$0 \\le \\frac{\\pi}{4}x \< 3\\pi\$이므로 \$\\frac{\\pi}{4}x \= \\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{13\\pi}{6}, \\frac{17\\pi}{6}\$이다.  
따라서 네 점의 \$x\$좌표는 차례로 \$\\frac{2}{3}, \\frac{10}{3}, \\frac{26}{3}, \\frac{34}{3}\$이다.  
네 점의 \$y\$좌표가 모두 \$2\$이므로 \$\\overline{BC} \= \\frac{26}{3} - \\frac{10}{3} \= \\frac{16}{3}\$이고,  
\$\$S \= \\frac{1}{2} \\times \\frac{16}{3} \\times 2 \= \\frac{16}{3}, \\qquad l \= \\overline{AD} \= \\frac{34}{3} - \\frac{2}{3} \= \\frac{32}{3}\$\$  
따라서 \$S \+ l \= \\frac{16}{3} \+ \\frac{32}{3} \= 16\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_GRAPH", "conceptClusterKey": "", "primaryMethod": "삼각방정식 \$\\\\sin\\\\frac{\\\\pi}{4}x=\\\\frac{1}{2}\$의 네 교점 좌표를 구해 삼각형 넓이와 선분 길이를 합산한다.", "decisiveStep": "교점 \$x\$좌표 \$\\\\frac{2}{3}, \\\\frac{10}{3}, \\\\frac{26}{3}, \\\\frac{34}{3}\$을 구해 \$S+l=16\$을 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 그래프", "l3": "그래프 활용", "l4": "교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-107, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주기 구간 \$\[0, 12)\$의 교점 네 개를 모두 구한 뒤 기하적 넓이·길이를 계산해야 한다.", "level": "중", "item4slot": {"given": \["삼각함수", "직선"\], "goal": \["합"\], "method": \["삼각방정식", "삼각형넓이공식"\], "condition": \["구간"\]}, "hold": ""}  
\`\`\`

\## Q16  
- 형식: 객관식  
- 배점: 4.4  
\#\## 발문  
수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 할 때, \$S\_n \= 2^{n+2} - 4\$가 성립한다. 이때 \$\\sum\_{k=1}^{12} \\log\_2\\left(\\frac{a\_k}{2}\\right)\$의 값은?  
\#\## 선지  
① \$66\$ ② \$78\$ ③ \$84\$ ④ \$91\$ ⑤ \$105\$  
\#\## 정답  
②  
\#\## 해설  
\$a\_1 \= S\_1 \= 8 - 4 \= 4 \= 2^{1+1}\$이고, \$n \\ge 2\$일 때  
\$\$a\_n \= S\_n - S\_{n-1} \= (2^{n+2} - 4\) - (2^{n+1} - 4\) \= 2^{n+1}\$\$  
이므로 모든 자연수 \$k\$에 대하여 \$a\_k \= 2^{k+1}\$이다.  
따라서 \$\\log\_2\\left(\\frac{a\_k}{2}\\right) \= \\log\_2(2^k) \= k\$이므로  
\$\$\\sum\_{k=1}^{12} \\log\_2\\left(\\frac{a\_k}{2}\\right) \= \\sum\_{k=1}^{12} k \= \\frac{12 \\times 13}{2} \= 78\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_SUM", "conceptClusterKey": "", "primaryMethod": "\$S\_n-S\_{n-1}\$로 일반항 \$a\_k=2^{k+1}\$을 구한 뒤 로그로 지수를 내려 자연수의 합을 계산한다.", "decisiveStep": "\$\\\\log\_2(a\_k/2)=k\$로 단순화해 \$\\\\sum\_{k=1}^{12} k \= 78\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "여러 가지 수열의 합", "l4": "자연수 거듭제곱의 합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SEQUENCE\_SUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-125, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수형 \$S\_n\$에서 일반항을 구하고 로그 성질을 이용해 시그마 합으로 연결한다.", "level": "중하", "item4slot": {"given": \["수열", "합"\], "goal": \["합"\], "method": \["일반항", "로그"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q17  
- 형식: 객관식  
- 배점: 4.7  
\#\## 발문  
모든 자연수 \$n\$에 대하여 함수 \$y \= 3\|\\sin 2x\|\$의 그래프와 직선 \$y \= \\frac{3}{n\\pi}x\$의 교점의 개수를 \$f(n)\$이라 하자. 이때 \$f(1) \+ f(2) \+ f(3) \+ f(4)\$의 값은?  
\#\## 선지  
① \$32\$ ② \$36\$ ③ \$38\$ ④ \$40\$ ⑤ \$44\$  
\#\## 정답  
④  
\#\## 해설  
방정식 \$3\|\\sin 2x\| \= \\frac{3}{n\\pi}x\$는 \$\|\\sin 2x\| \= \\frac{x}{n\\pi}\$와 같다.  
\$0 \\le \|\\sin 2x\| \\le 1\$이므로 교점은 \$0 \\le x \\le n\\pi\$에서만 생긴다.  
\$\|\\sin 2x\|\$의 주기는 \$\\frac{\\pi}{2}\$이므로 구간 \$\[0, n\\pi\]\$에는 높이 \$1\$인 봉우리가 \$2n\$개 있다.  
- 첫 구간 \$\\left\[0, \\frac{\\pi}{2}\\right\]\$에서는 원점 \$(0, 0)\$과 내려가는 부분에서 각각 \$1\$번씩 만나므로 \$2\$개다.  
- 나머지 \$2n - 1\$개의 구간에서는 각 봉우리 꼭대기에서 직선의 높이가 \$1\$ 미만이므로 올라갈 때와 내려갈 때 각각 \$1\$번씩, 구간마다 \$2\$개씩 만난다.  
따라서 \$f(n) \= 2 \+ 2(2n - 1\) \= 4n\$이므로  
\$\$f(1) \+ f(2) \+ f(3) \+ f(4) \= 4 \+ 8 \+ 12 \+ 16 \= 40\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_GRAPH", "conceptClusterKey": "", "primaryMethod": "\$\|\\\\sin 2x\| \= \\\\frac{x}{n\\\\pi}\$의 치역 제한으로 \$0\\\\le x\\\\le n\\\\pi\$에서 봉우리 \$2n\$개당 교점 \$2\$개씩을 센다.", "decisiveStep": "봉우리 \$2n\$개 각각에서 교점이 \$2\$개씩 생겨 \$f(n)=4n\$임을 도출하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 그래프", "l3": "그래프 활용", "l4": "교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-107, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 사인 그래프의 주기와 직선 기울기 \$1/(n\\\\pi)\$의 교점 개수를 일반화해야 한다.", "level": "상", "item4slot": {"given": \["삼각함수", "직선"\], "goal": \["합"\], "method": \["그래프", "교점"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q18  
- 형식: 객관식  
- 배점: 4.7  
\#\## 발문  
\$\\overline{AB} \= 8\$, \$\\overline{BC} \= 15\$, \$\\angle ABC \= \\frac{\\pi}{3}\$인 삼각형 \$ABC\$가 있다. 선분 \$AC\$ 위의 점 \$P\$에서 두 직선 \$AB, BC\$에 내린 수선의 발을 각각 \$Q, R\$이라 할 때, 선분 \$QR\$의 길이의 최솟값은?  
\#\## 선지  
① \$\\frac{90}{13}\$ ② \$\\frac{60\\sqrt{3}}{13}\$ ③ \$\\frac{45}{13}\$ ④ \$\\frac{120}{13}\$ ⑤ \$\\frac{30\\sqrt{3}}{13}\$  
\#\## 정답  
①  
\#\## 해설  
\$\\angle BQP \= \\angle BRP \= \\frac{\\pi}{2}\$이므로 네 점 \$B, Q, P, R\$은 선분 \$BP\$를 지름으로 하는 한 원 위에 있다.  
따라서 \$\\triangle BQR\$의 외접원의 지름이 \$\\overline{BP}\$이므로 사인법칙에 의하여  
\$\$\\overline{QR} \= \\overline{BP} \\cdot \\sin\\frac{\\pi}{3} \= \\frac{\\sqrt{3}}{2}\\overline{BP}\$\$  
그러므로 \$\\overline{QR}\$이 최소일 때는 \$\\overline{BP}\$가 최소일 때, 즉 점 \$B\$에서 선분 \$AC\$에 내린 수선의 길이 \$h\$와 같을 때이다. (예각삼각형이므로 수선의 발은 선분 \$AC\$ 위에 놓인다.)  
\$\\triangle ABC\$에서 코사인법칙에 의해  
\$\$\\overline{AC}^2 \= 8^2 \+ 15^2 - 2 \\cdot 8 \\cdot 15 \\cdot \\cos\\frac{\\pi}{3} \= 64 \+ 225 - 120 \= 169 \\implies \\overline{AC} \= 13\$\$  
삼각형 \$ABC\$의 넓이 \$S \= \\frac{1}{2} \\cdot 8 \\cdot 15 \\cdot \\sin\\frac{\\pi}{3} \= 30\\sqrt{3} \= \\frac{1}{2} \\cdot 13 \\cdot h\$에서 \$h \= \\frac{60\\sqrt{3}}{13}\$이므로  
\$\$\\overline{QR}\_{\\min} \= \\frac{\\sqrt{3}}{2} \\cdot \\frac{60\\sqrt{3}}{13} \= \\frac{90}{13}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "사각형 \$BQPR\$의 외접원 지름이 \$\\\\overline{BP}\$임을 이용해 \$\\\\overline{QR}=\\\\overline{BP}\\\\sin\\\\frac{\\\\pi}{3}\$로 바꾸고 수선의 길이 \$h\$를 구한다.", "decisiveStep": "\$\\\\overline{QR}=\\\\frac{\\\\sqrt{3}}{2}\\\\overline{BP}\$에서 \$\\\\overline{BP}\$의 최솟값이 \$\\\\overline{AC}=13\$에 대한 높이 \$\\\\frac{60\\\\sqrt{3}}{13}\$임을 연결하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수선의 발 사각형의 내접원 성질과 사인법칙·코사인법칙·넓이를 통합하는 고난도 문항이다.", "level": "상", "item4slot": {"given": \["삼각형", "수선"\], "goal": \["최솟값"\], "method": \["사인법칙", "코사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q19  
- 형식: 객관식  
- 배점: 4.8  
\#\## 발문  
수열 \$\\{a\_n\\}\$이 다음 조건을 모두 만족시킬 때, \$a\_2 \+ a\_5\$의 값은?

(가) \$\|a\_1\| \= 1\$  
(나) 모든 자연수 \$n\$에 대하여 \$\|a\_{n+1}\| \= 2\|a\_n\|\$이다.  
(다) \$\\sum\_{k=1}^6 a\_k \= 29\$  
\#\## 선지  
① \$-18\$ ② \$-16\$ ③ \$-14\$ ④ \$-12\$ ⑤ \$-10\$  
\#\## 정답  
③  
\#\## 해설  
(가), (나)에서 \$\|a\_1\|, \|a\_2\|, \\dots, \|a\_6\|\$은 차례로 \$1, 2, 4, 8, 16, 32\$이고, 모두 양수일 때의 합은 \$63\$이다.  
어떤 항의 부호가 음수이면 전체 합은 그 항 절댓값의 \$2\$배만큼 감소한다.  
음수인 항들의 절댓값의 합을 \$T\$라 하면 \$63 - 2T \= 29 \\implies 2T \= 34 \\implies T \= 17\$이다.  
\$\\{1, 2, 4, 8, 16, 32\\}\$의 부분집합 중 합이 \$17\$이 되는 조합은 \$1 \+ 16\$뿐이므로 \$a\_1 \= \-1, a\_5 \= \-16\$이고 나머지 항은 양수이다.  
따라서 \$a\_2 \+ a\_5 \= 2 \+ (-16) \= \-14\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "절댓값 수열의 총합 \$63\$에서 음수항 절댓값 합 \$T\$의 \$2\$배를 빼는 방정식 \$63-2T=29\$를 푼다.", "decisiveStep": "\$T=17\$을 이진법 분해 \$1+16\$으로 유일하게 결정해 \$a\_1=-1, a\_5=-16\$을 찾는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "귀납적 패턴"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-122, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부호가 불확정인 등비 절댓값 수열에서 총합 감소량 \$2T\$를 이진 표현으로 역산해야 한다.", "level": "중", "item4slot": {"given": \["수열", "절댓값"\], "goal": \["합"\], "method": \["부호"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q20  
- 형식: 객관식  
- 배점: 4.8  
\#\## 발문  
다음은 수열 \$\\{a\_n\\}\$이 \$a\_1 \= 2\$이고, 모든 자연수 \$n\$에 대하여 \$\\sum\_{k=1}^n a\_k \= n^2 a\_n\$을 만족시킬 때, 모든 자연수 \$n\$에 대하여  
\$\$a\_n \= \\frac{4}{n(n+1)} \\qquad \\cdots (\*)\$\$  
임을 수학적 귀납법을 이용하여 증명한 것이다.

(ⅰ) \$n \= 1\$일 때, \$(\\text{좌변}) \= 2\$이고 \$(\\text{우변}) \= \\frac{4}{1 \\times 2} \= 2\$이므로 \$(\*)\$이 성립한다.  
(ⅱ) \$n \= m\$일 때, \$a\_m \= \\frac{4}{m(m+1)}\$이 성립한다고 가정하자.  
\$n \= m \+ 1\$일 때, \$\\sum\_{k=1}^{m+1} a\_k \= (m+1)^2 a\_{m+1}\$이다.  
\$\\sum\_{k=1}^{m+1} a\_k \= \\sum\_{k=1}^m a\_k \+ a\_{m+1}\$이고, 주어진 식과 가정에 의하여 \$\\sum\_{k=1}^m a\_k \= m^2 a\_m \= (\\text{가})\$ 이므로 \$(\\text{가}) \+ a\_{m+1} \= (m+1)^2 a\_{m+1}\$이다.  
식을 \$a\_{m+1}\$에 대하여 묶어서 정리하면 \$(\\text{가}) \= (\\text{나}) \\times a\_{m+1}\$이다.  
따라서 \$a\_{m+1} \= \\frac{4}{(m+1)(m+2)}\$이다. 그러므로 \$n \= m \+ 1\$일 때도 \$(\*)\$이 성립한다.  
(ⅰ), (ⅱ)에 의하여 모든 자연수 \$n\$에 대하여 \$(\*)\$이 성립한다.

위의 (가), (나)에 알맞은 식을 각각 \$f(m), g(m)\$이라 할 때, \$f(3) \\times g(4)\$의 값은?  
\#\## 선지  
① \$48\$ ② \$54\$ ③ \$60\$ ④ \$64\$ ⑤ \$72\$  
\#\## 정답  
⑤  
\#\## 해설  
(가) 귀납 가정 \$a\_m \= \\frac{4}{m(m+1)}\$을 대입하면  
\$\$f(m) \= m^2 a\_m \= m^2 \\cdot \\frac{4}{m(m+1)} \= \\frac{4m}{m \+ 1}\$\$  
(나) \$f(m) \+ a\_{m+1} \= (m \+ 1)^2 a\_{m+1}\$에서 \$a\_{m+1}\$ 항을 모으면  
\$\$f(m) \= \\{(m \+ 1)^2 - 1\\} a\_{m+1} \= m(m \+ 2\) a\_{m+1} \\implies g(m) \= m(m \+ 2)\$\$  
따라서 \$f(3) \= \\frac{12}{4} \= 3\$, \$g(4) \= 4 \\times 6 \= 24\$이므로 \$f(3) \\times g(4) \= 3 \\times 24 \= 72\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "귀납 가정 \$a\_m=\\\\frac{4}{m(m+1)}\$을 \$m^2 a\_m\$에 대입해 \$f(m)\$을 구하고 \$a\_{m+1}\$ 계수로 \$g(m)\$을 찾는다.", "decisiveStep": "\$f(m)=\\\\frac{4m}{m+1}\$과 \$g(m)=(m+1)^2-1=m(m+2)\$를 도출하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수학적 귀납법", "l4": "등식 증명"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_MATHEMATICAL\_INDUCTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-131, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수학적 귀납법 빈칸 추론의 식 변형 논리를 그대로 따라가며 미지식을 채워야 한다.", "level": "중", "item4slot": {"given": \["수열", "등식"\], "goal": \["값"\], "method": \["수학적귀납법"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q21  
- 형식: 서술형  
- 배점: 4  
\#\## 발문  
등차수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 하자. \$S\_3 \= 27\$, \$S\_8 \= 32\$일 때, \$S\_n\$의 값이 최대가 되는 \$n\$의 값을 구하는 과정을 풀이 과정과 함께 서술하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$6\$  
\#\## 해설  
첫째항을 \$a\$, 공차를 \$d\$라 하면  
\$\$S\_3 \= \\frac{3}{2}(2a \+ 2d) \= 27 \\implies a \+ d \= 9\$\$  
\$\$S\_8 \= \\frac{8}{2}(2a \+ 7d) \= 32 \\implies 2a \+ 7d \= 8\$\$  
첫째 식의 \$2\$배를 둘째 식에서 빼면 \$5d \= \-10 \\implies d \= \-2\$이고 \$a \= 11\$이다.  
따라서 \$S\_n \= \\frac{n}{2}\\{22 - 2(n - 1)\\} \= n(12 - n) \= 36 - (n - 6)^2\$이므로 \$n \= 6\$일 때 최댓값 \$36\$을 갖는다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "\$S\_3, S\_8\$ 연립방정식으로 \$a, d\$를 구한 뒤 \$S\_n\$의 이차식을 완전제곱식으로 변형해 최댓값 항을 찾는다.", "decisiveStep": "\$S\_n \= 36 - (n-6)^2\$으로 변형해 \$n=6\$을 확정하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차수열의 합 연립과 이차식 최댓값 판별을 결합한 표준 서술형이다.", "level": "중하", "item4slot": {"given": \["등차수열", "합"\], "goal": \["자연수"\], "method": \["수열의합", "완전제곱식"\], "condition": \["최댓값"\]}, "hold": ""}  
\`\`\`

\## Q22  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
\$0 \\le x \\le 3\\pi\$일 때, 부등식 \$-2\\cos^2(\\pi \+ x) \+ \\cos\\left(\\frac{\\pi}{2} - x\\right) \+ 1 \\ge 0\$의 해를 구하는 과정을 풀이 과정과 함께 서술하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$\\left\[\\frac{\\pi}{6}, \\frac{5\\pi}{6}\\right\] \\cup \\left\\{\\frac{3\\pi}{2}\\right\\} \\cup \\left\[\\frac{13\\pi}{6}, \\frac{17\\pi}{6}\\right\]\$  
\#\## 해설  
\$\\cos(\\pi \+ x) \= \-\\cos x\$, \$\\cos\\left(\\frac{\\pi}{2} - x\\right) \= \\sin x\$이므로 주어진 부등식은  
\$\$-2\\cos^2 x \+ \\sin x \+ 1 \\ge 0\$\$  
\$\\cos^2 x \= 1 - \\sin^2 x\$를 대입하면  
\$\$-2(1 - \\sin^2 x) \+ \\sin x \+ 1 \\ge 0 \\implies 2\\sin^2 x \+ \\sin x - 1 \\ge 0 \\implies (2\\sin x - 1)(\\sin x \+ 1\) \\ge 0\$\$  
\$-1 \\le \\sin x \\le 1\$이므로 \$\\sin x \\ge \\frac{1}{2}\$ 또는 \$\\sin x \= \-1\$이다.  
\$0 \\le x \\le 3\\pi\$에서 \$\\sin x \\ge \\frac{1}{2}\$의 해는 \$\\frac{\\pi}{6} \\le x \\le \\frac{5\\pi}{6}\$ 또는 \$\\frac{13\\pi}{6} \\le x \\le \\frac{17\\pi}{6}\$이고, \$\\sin x \= \-1\$의 해는 \$x \= \\frac{3\\pi}{2}\$이다.  
따라서 구하는 해는 \$\\left\[\\frac{\\pi}{6}, \\frac{5\\pi}{6}\\right\] \\cup \\left\\{\\frac{3\\pi}{2}\\right\\} \\cup \\left\[\\frac{13\\pi}{6}, \\frac{17\\pi}{6}\\right\]\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_EQUATION", "conceptClusterKey": "", "primaryMethod": "각 변환과 \$\\\\cos^2x=1-\\\\sin^2x\$로 \$\\\\sin x\$ 이차부등식을 만든 뒤 \$\\\\sin x \= \-1\$ 고립해를 포함해 푼다.", "decisiveStep": "\$(2\\\\sin x - 1)(\\\\sin x \+ 1\) \\\\ge 0\$에서 등호 성립 고립점 \$\\\\sin x \= \-1\$ (\$x=\\\\frac{3\\\\pi}{2}\$)을 빠뜨리지 않는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각방정식·부등식", "l4": "주기 구간의 해"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_TRIG\_EQUATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-102, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주기 \$3\\\\pi\$ 범위의 해와 이차삼각부등식 등호 고립점 \$x=\\\\frac{3\\\\pi}{2}\$을 모두 챙겨야 한다.", "level": "중", "item4slot": {"given": \["삼각부등식", "구간"\], "goal": \["해"\], "method": \["삼각함수의성질", "삼각부등식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q23  
- 형식: 서술형  
- 배점: 4  
\#\## 발문  
삼각형 \$ABC\$에서 \$\\sin^2 A \+ 3\\sin^2 B \= 4\\sin^2 C\$일 때, \$\\cos C\$의 최솟값을 구하는 과정을 풀이 과정과 함께 서술하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$\\frac{\\sqrt{3}}{4}\$  
\#\## 해설  
세 변의 길이를 \$a, b, c\$라 하면 사인법칙에 의해 \$\\sin A : \\sin B : \\sin C \= a : b : c\$이므로 \$a^2 \+ 3b^2 \= 4c^2\$, 즉 \$c^2 \= \\frac{a^2 \+ 3b^2}{4}\$이다.  
코사인법칙에 대입하면  
\$\$\\cos C \= \\frac{a^2 \+ b^2 - c^2}{2ab} \= \\frac{a^2 \+ b^2 - \\frac{a^2 \+ 3b^2}{4}}{2ab} \= \\frac{3a^2 \+ b^2}{8ab} \= \\frac{1}{8}\\left(\\frac{3a}{b} \+ \\frac{b}{a}\\right)\$\$  
\$a \> 0, b \> 0\$이므로 산술·기하평균의 부등식에 의하여  
\$\$\\cos C \\ge \\frac{1}{8} \\cdot 2\\sqrt{\\frac{3a}{b} \\cdot \\frac{b}{a}} \= \\frac{\\sqrt{3}}{4}\$\$  
등호는 \$\\frac{3a}{b} \= \\frac{b}{a}\$ (\$b \= \\sqrt{3}a\$, \$c \= \\frac{\\sqrt{10}}{2}a\$로 삼각형이 성립)일 때 성립하므로 최솟값은 \$\\frac{\\sqrt{3}}{4}\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "사인법칙으로 사인 제곱식을 변의 제곱식으로 바꾼 뒤 코사인법칙과 산술·기하평균 부등식을 적용한다.", "decisiveStep": "\$\\\\cos C \= \\\\frac{1}{8}(\\\\frac{3a}{b}+\\\\frac{b}{a})\$에 산술·기하평균을 적용해 \$\\\\frac{\\\\sqrt{3}}{4}\$을 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사인법칙·코사인법칙·산술기하평균을 결합하고 삼각형 성립까지 확인하는 서술형 문항이다.", "level": "중", "item4slot": {"given": \["삼각형", "등식"\], "goal": \["최솟값"\], "method": \["사인법칙", "코사인법칙", "산술기하평균"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q24  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
수열 \$\\{a\_n\\}\$이 다음과 같이 귀납적으로 정의되어 있다.  
\$\$a\_1 \= 1, \\qquad a\_{n+1} \= a\_n \+ \\frac{2}{(2n - 1)(2n \+ 1)} \\quad (n \= 1, 2, 3, \\cdots)\$\$  
모든 자연수 \$n\$에 대하여 \$a\_n \= 2 - \\frac{1}{2n - 1}\$이 성립함을 수학적 귀납법으로 증명하시오.  
\#\## 선지  
없음  
\#\## 정답  
주어진 등식은 모든 자연수 \$n\$에 대하여 성립한다.  
\#\## 해설  
(ⅰ) \$n \= 1\$일 때,  
\$a\_1 \= 1\$이고 \$2 - \\frac{1}{2(1) - 1} \= 2 - 1 \= 1\$이므로 성립한다.

(ⅱ) \$n \= k\$일 때 \$a\_k \= 2 - \\frac{1}{2k - 1}\$이 성립한다고 가정하자.  
점화식에 대입하면  
\$\$a\_{k+1} \= a\_k \+ \\frac{2}{(2k - 1)(2k \+ 1)} \= 2 - \\frac{1}{2k - 1} \+ \\frac{2}{(2k - 1)(2k \+ 1)}\$\$  
\$\$= 2 - \\frac{(2k \+ 1\) - 2}{(2k - 1)(2k \+ 1)} \= 2 - \\frac{2k - 1}{(2k - 1)(2k \+ 1)} \= 2 - \\frac{1}{2k \+ 1}\$\$  
따라서 \$n \= k \+ 1\$일 때도 성립한다.

(ⅰ), (ⅱ)에 의하여 모든 자연수 \$n\$에 대하여 \$a\_n \= 2 - \\frac{1}{2n - 1}\$이 성립한다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "24", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "기초 단계 \$n=1\$을 확인하고 귀납 가정을 점화식에 대입해 분수 통분·약분으로 \$n=k+1\$식을 유도한다.", "decisiveStep": "\$-\\\\frac{1}{2k-1}+\\\\frac{2}{(2k-1)(2k+1)} \= \-\\\\frac{2k-1}{(2k-1)(2k+1)}\$로 약분하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수학적 귀납법", "l4": "등식 증명"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_MATHEMATICAL\_INDUCTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-131, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "점화식이 주어진 일반항을 수학적 귀납법으로 통분·약분해 증명하는 기본 서술형이다.", "level": "중하", "item4slot": {"given": \["수열", "등식"\], "goal": \["증명"\], "method": \["수학적귀납법"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`  
