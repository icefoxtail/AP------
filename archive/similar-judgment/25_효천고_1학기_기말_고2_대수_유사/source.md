\`\`\`json:exam  
{"stem": "25\_효천고\_1학기\_기말\_고2\_대수\_유사", "sourceArchiveFile": "original/high/h2/1final/25\_효천고\_1학기\_기말\_고2\_대수c.js", "examFolder": "1final", "grade": "고2", "subject": "대수", "curriculum": "2022", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-21"}  
\`\`\`

\## Q01  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
\$a\_3 \= \-5\$, \$a\_5 \= 1\$인 등차수열 \$\\{a\_n\\}\$에 대하여 \$a\_7\$의 값은?  
\#\## 선지  
① \$5\$ ② \$6\$ ③ \$7\$ ④ \$8\$ ⑤ \$9\$  
\#\## 정답  
③  
\#\## 해설  
등차수열 \$\\{a\_n\\}\$의 공차를 \$d\$라 하면  
\$\$a\_5 - a\_3 \= 2d \= 1 - (-5) \= 6 \\implies d \= 3\$\$  
따라서 \$a\_7 \= a\_5 \+ 2d \= 1 \+ 2 \\times 3 \= 7\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "두 항의 차 \$a\_5 - a\_3 \= 2d\$로 공차를 구한 뒤 \$a\_7 \= a\_5 \+ 2d\$를 계산한다.", "decisiveStep": "\$2d \= 6\$에서 \$d=3\$을 구해 \$a\_7 \= 1 \+ 6 \= 7\$을 얻는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-115, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차수열의 두 항에서 공차를 구해 다음 항을 찾는 기초 문항이다.", "level": "하", "item4slot": {"given": \["등차수열"\], "goal": \["값"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q02  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
첫째항부터 차례로 \$1, 3, 9, 27, \\cdots\$인 등비수열 \$\\{a\_n\\}\$의 일반항은?  
\#\## 선지  
① \$a\_n \= 3^{n-1}\$ ② \$a\_n \= 3n\$ ③ \$a\_n \= 3^n\$ ④ \$a\_n \= 9^{n-1}\$ ⑤ \$a\_n \= 9^n\$  
\#\## 정답  
①  
\#\## 해설  
첫째항이 \$a\_1 \= 1\$, 공비가 \$r \= 3\$인 등비수열이므로 일반항은  
\$\$a\_n \= 1 \\times 3^{n-1} \= 3^{n-1}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "나열된 수에서 첫째항 \$1\$과 공비 \$3\$을 읽어 등비수열의 일반항 \$a\_1 r^{n-1}\$에 대입한다.", "decisiveStep": "\$a\_1=1\$, \$r=3\$을 대입해 \$a\_n \= 3^{n-1}\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-118, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "첫째항과 공비가 바로 보이는 등비수열의 일반항을 구하는 기초 문항이다.", "level": "하", "item4slot": {"given": \["등비수열"\], "goal": \["일반항"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q03  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 하자. \$S\_n \= 2n^2 \+ 3n - 2\$일 때, \$a\_1\$의 값은?  
\#\## 선지  
① \$-1\$ ② \$0\$ ③ \$1\$ ④ \$2\$ ⑤ \$3\$  
\#\## 정답  
⑤  
\#\## 해설  
첫째항 \$a\_1\$은 \$S\_1\$과 같으므로  
\$\$a\_1 \= S\_1 \= 2(1)^2 \+ 3(1) - 2 \= 3\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "수열의 합과 첫째항의 관계 \$a\_1 \= S\_1\$을 이용해 \$n=1\$을 대입한다.", "decisiveStep": "\$S\_1 \= 2 \+ 3 - 2 \= 3\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "\$S\_n\$ 식에 \$n=1\$을 대입해 첫째항을 바로 구하는 기초 문항이다.", "level": "하", "item4slot": {"given": \["수열", "수열의합"\], "goal": \["값"\], "method": \["수열의합"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q04  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
첫째항이 \$2\$, 제\$15\$항이 \$30\$인 등차수열의 첫째항부터 제\$15\$항까지의 합은?  
\#\## 선지  
① \$225\$ ② \$240\$ ③ \$255\$ ④ \$270\$ ⑤ \$285\$  
\#\## 정답  
②  
\#\## 해설  
등차수열의 합 공식 \$S\_n \= \\frac{n(a\_1 \+ a\_n)}{2}\$에 \$n \= 15\$, \$a\_1 \= 2\$, \$a\_{15} \= 30\$을 대입하면  
\$\$S\_{15} \= \\frac{15(2 \+ 30)}{2} \= 15 \\times 16 \= 240\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "첫째항과 끝항을 알 때의 등차수열의 합 공식 \$\\\\frac{n(a\_1+a\_n)}{2}\$을 적용한다.", "decisiveStep": "\$\\\\frac{15(2+30)}{2} \= 240\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "첫째항과 제15항이 직접 주어져 합 공식에 대입하면 바로 풀린다.", "level": "하", "item4slot": {"given": \["등차수열"\], "goal": \["합"\], "method": \["수열의합"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q05  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
삼각형 \$ABC\$에서 \$\\overline{AB} \= 6\$, \$\\overline{AC} \= 7\$, \$\\angle A \= 60^\\circ\$일 때, 삼각형 \$ABC\$의 넓이는?  
\#\## 선지  
① \$\\frac{15\\sqrt{3}}{2}\$ ② \$9\\sqrt{3}\$ ③ \$10\\sqrt{3}\$ ④ \$\\frac{21\\sqrt{3}}{2}\$ ⑤ \$21\\sqrt{3}\$  
\#\## 정답  
④  
\#\## 해설  
삼각형 \$ABC\$의 넓이 \$S\$는  
\$\$S \= \\frac{1}{2} \\times \\overline{AB} \\times \\overline{AC} \\times \\sin A \= \\frac{1}{2} \\times 6 \\times 7 \\times \\sin 60^\\circ \= 21 \\times \\frac{\\sqrt{3}}{2} \= \\frac{21\\sqrt{3}}{2}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "두 변의 길이와 끼인각을 이용한 삼각형 넓이 공식 \$\\\\frac{1}{2}bc\\\\sin A\$를 적용한다.", "decisiveStep": "\$\\\\frac{1}{2}\\\\cdot 6\\\\cdot 7\\\\cdot \\\\frac{\\\\sqrt{3}}{2} \= \\\\frac{21\\\\sqrt{3}}{2}\$를 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "두 변과 끼인각"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-113, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 변과 끼인각이 주어져 삼각형 넓이 공식에 바로 대입하면 된다.", "level": "하", "item4slot": {"given": \["삼각형", "길이", "각"\], "goal": \["넓이"\], "method": \["삼각형넓이공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q06  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
다음 중 합의 기호 \$\\sum\$의 성질로 옳지 \*\*않은\*\* 것은? (단, \$c\$는 상수이다.)  
\#\## 선지  
① \$\\sum\_{k=1}^{n}(a\_k \+ b\_k) \= \\sum\_{k=1}^{n}a\_k \+ \\sum\_{k=1}^{n}b\_k\$ ② \$\\sum\_{k=1}^{n}(a\_k - b\_k) \= \\sum\_{k=1}^{n}a\_k - \\sum\_{k=1}^{n}b\_k\$ ③ \$\\sum\_{k=1}^{n}(a\_k b\_k) \= \\left(\\sum\_{k=1}^{n}a\_k\\right)\\left(\\sum\_{k=1}^{n}b\_k\\right)\$ ④ \$\\sum\_{k=1}^{n} ca\_k \= c\\sum\_{k=1}^{n} a\_k\$ ⑤ \$\\sum\_{k=1}^{n} c \= cn\$  
\#\## 정답  
③  
\#\## 해설  
\$\\sum\$은 덧셈, 뺄셈, 상수배에 대해서는 선형성이 성립하지만, 두 수열의 곱에 대해서는 일반적으로  
\$\$\\sum\_{k=1}^{n}(a\_k b\_k) \\ne \\left(\\sum\_{k=1}^{n}a\_k\\right)\\left(\\sum\_{k=1}^{n}b\_k\\right)\$\$  
이므로 옳지 않은 것은 ③이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "합의 기호 \$\\\\sum\$이 덧셈·뺄셈·상수배에만 분배되고 곱셈에는 분배되지 않음을 판별한다.", "decisiveStep": "곱의 시그마가 각 시그마의 곱과 같지 않음을 가려내는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "합의 기호 Σ", "l4": "성질"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SIGMA\_NOTATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-124, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "\$\\\\sum\$의 기본 성질과 오개념(곱의 분리)을 직접 판별하는 기초 문항이다.", "level": "하", "item4slot": {"given": \["수열"\], "goal": \["성질"\], "method": \["시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q07  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
공차가 \$4\$인 등차수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 하자. \$S\_n \= pn^2 \+ 5n\$일 때, \$a\_8\$의 값은?  
\#\## 선지  
① \$35\$ ② \$31\$ ③ \$33\$ ④ \$37\$ ⑤ \$39\$  
\#\## 정답  
①  
\#\## 해설  
등차수열의 합 \$S\_n \= \\frac{d}{2}n^2 \+ \\left(a\_1 - \\frac{d}{2}\\right)n\$에서 \$n^2\$의 계수가 \$\\frac{d}{2}\$이므로  
\$\$p \= \\frac{4}{2} \= 2 \\implies S\_n \= 2n^2 \+ 5n\$\$  
\$n \\ge 2\$일 때  
\$\$a\_n \= S\_n - S\_{n-1} \= (2n^2 \+ 5n) - \\{2(n-1)^2 \+ 5(n-1)\\} \= 4n \+ 3\$\$  
\$n \= 1\$일 때도 \$a\_1 \= S\_1 \= 7\$로 성립하므로 \$a\_8 \= 4 \\times 8 \+ 3 \= 35\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "등차수열의 합에서 \$n^2\$의 계수가 \$\\\\frac{d}{2}\$임을 이용해 \$p\$를 정하고 \$S\_n - S\_{n-1} \= a\_n\$으로 \$a\_8\$을 구한다.", "decisiveStep": "\$p \= \\\\frac{4}{2} \= 2\$를 구해 \$S\_n \= 2n^2+5n\$에서 \$a\_n \= 4n+3\$을 도출하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공차와 \$S\_n\$의 이차항 계수 관계를 이용해 미지 계수와 일반항을 구하는 중급 문항이다.", "level": "중", "item4slot": {"given": \["등차수열", "수열의합"\], "goal": \["값"\], "method": \["수열의합", "일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q08  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
\$5^2 \+ 6^2 \+ 7^2 \+ \\cdots \+ 11^2\$의 값은?  
\#\## 선지  
① \$456\$ ② \$462\$ ③ \$468\$ ④ \$472\$ ⑤ \$476\$  
\#\## 정답  
⑤  
\#\## 해설  
주어진 합은 \$1\$부터 \$11\$까지의 제곱의 합에서 \$1\$부터 \$4\$까지의 제곱의 합을 뺀 것과 같으므로  
\$\$\\sum\_{k=1}^{11} k^2 - \\sum\_{k=1}^{4} k^2 \= \\frac{11 \\times 12 \\times 23}{6} - (1^2 \+ 2^2 \+ 3^2 \+ 4^2) \= 506 - 30 \= 476\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_SUM", "conceptClusterKey": "", "primaryMethod": "\$\\\\sum\_{k=1}^{11} k^2\$에서 \$\\\\sum\_{k=1}^{4} k^2\$을 빼어 자연수 제곱의 합 공식을 적용한다.", "decisiveStep": "\$\\\\frac{11\\\\cdot 12\\\\cdot 23}{6} - 30 \= 506 - 30 \= 476\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "여러 가지 수열의 합", "l4": "자연수 거듭제곱의 합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SEQUENCE\_SUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-125, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "시작점이 \$5\$인 제곱의 합을 \$1\$부터의 합으로 보정하여 계산하는 표준 문항이다.", "level": "중", "item4slot": {"given": \["수열"\], "goal": \["합"\], "method": \["시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q09  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
지름 \$\\overline{AB}\$의 길이가 \$26\$인 원 \$O\$ 위의 한 점 \$P\$에 대하여 \$\\overline{AP} \= 24\$이다. \$\\angle PAB \= \\theta\$라 할 때, \$\\cos 2\\theta\$의 값은?  
\#\## 선지  
① \$-\\frac{119}{169}\$ ② \$\\frac{119}{169}\$ ③ \$\\frac{120}{169}\$ ④ \$\\frac{125}{169}\$ ⑤ \$1\$  
\#\## 정답  
②  
\#\## 해설  
\$\\overline{AB}\$가 원 \$O\$의 지름이므로 \$\\angle APB \= 90^\\circ\$이다. 피타고라스 정리에 의해  
\$\$\\overline{BP} \= \\sqrt{26^2 - 24^2} \= \\sqrt{676 - 576} \= 10\$\$  
호 \$PB\$에 대한 원주각이 \$\\angle PAB \= \\theta\$이므로 중심각은 \$\\angle POB \= 2\\theta\$이고, \$\\overline{OP} \= \\overline{OB} \= 13\$이다.  
삼각형 \$POB\$에서 코사인법칙을 적용하면  
\$\$\\cos 2\\theta \= \\frac{13^2 \+ 13^2 - 10^2}{2 \\times 13 \\times 13} \= \\frac{169 \+ 169 - 100}{338} \= \\frac{238}{338} \= \\frac{119}{169}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "지름 원주각으로 \$\\\\overline{BP}\$를 구한 뒤 중심각 \$\\\\angle POB \= 2\\\\theta\$에 코사인법칙을 적용한다.", "decisiveStep": "\$\\\\triangle POB\$에서 변 \$13, 13, 10\$에 코사인법칙을 적용해 \$\\\\cos 2\\\\theta \= \\\\frac{119}{169}\$를 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지름 원주각과 중심각 \$2\\\\theta\$의 관계를 파악해 이등변삼각형에 코사인법칙을 적용해야 한다.", "level": "중", "item4slot": {"given": \["원", "길이", "각"\], "goal": \["값"\], "method": \["코사인법칙"\], "condition": \["내접"\]}, "hold": ""}  
\`\`\`

\## Q10  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
다음과 같이 정의되는 수열 \$\\{a\_n\\}\$에 대하여 \$\\sum\_{k=1}^{24} a\_k\$의 값은?

\$a\_1 \= 1\$, \$a\_2 \= 4\$, \$a\_3 \= 16\$, \$a\_{n-1}a\_{n+1} \= a\_n a\_{n+2}\$ (\$n \= 2, 3, 4, \\cdots\$)  
\#\## 선지  
① \$125\$ ② \$140\$ ③ \$145\$ ④ \$150\$ ⑤ \$160\$  
\#\## 정답  
④  
\#\## 해설  
주어진 관계식에서 \$a\_{n+2} \= \\frac{a\_{n-1}a\_{n+1}}{a\_n}\$이므로 차례로 구하면  
\$\$a\_4 \= \\frac{a\_1 a\_3}{a\_2} \= \\frac{1 \\times 16}{4} \= 4, \\quad a\_5 \= \\frac{a\_2 a\_4}{a\_3} \= \\frac{4 \\times 4}{16} \= 1, \\quad a\_6 \= \\frac{a\_3 a\_5}{a\_4} \= \\frac{16 \\times 1}{4} \= 4\$\$  
따라서 수열 \$\\{a\_n\\}\$은 \$1, 4, 16, 4\$가 반복되는 주기 \$4\$인 수열이다.  
한 주기의 합은 \$1 \+ 4 \+ 16 \+ 4 \= 25\$이므로  
\$\$\\sum\_{k=1}^{24} a\_k \= 6 \\times 25 \= 150\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "귀납적 관계식에 \$n=2, 3, 4, \\\\cdots\$를 대입해 주기 \$4\$를 확인하고 \$6\$묶음의 합을 구한다.", "decisiveStep": "\$a\_4=4, a\_5=1, a\_6=4\$로부터 주기 \$4\$의 합 \$25\$를 구해 \$6 \\\\times 25 \= 150\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수열의 귀납적 정의", "l4": "점화식으로 항 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_RECURSIVE\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-129, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "점화식에 항을 대입해 주기성을 발견하고 반복 주기의 합을 곱하는 표준 문항이다.", "level": "중", "item4slot": {"given": \["수열"\], "goal": \["합"\], "method": \["귀납적정의", "주기"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q11  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
첫째항이 음수인 등비수열 \$\\{a\_n\\}\$에 대하여 \$a\_3 a\_5 \= 16a\_8\$, \$a\_1 \+ \|a\_2\| \+ \|2a\_3\| \= 0\$일 때, \$a\_2\$의 값은?  
\#\## 선지  
① \$1\$ ② \$2\$ ③ \$4\$ ④ \$6\$ ⑤ \$8\$  
\#\## 정답  
③  
\#\## 해설  
등비수열 \$\\{a\_n\\}\$의 공비를 \$r\$라 하면 \$a\_1 \< 0\$이고 \$r \\ne 0\$이다.  
\$a\_3 a\_5 \= a\_1^2 r^6 \= 16a\_1 r^7\$이므로 양변을 \$a\_1 r^6\$으로 나누면 \$a\_1 \= 16r\$이다.  
\$a\_1 \< 0\$이므로 \$r \< 0\$이고, 따라서 \$a\_2 \= 16r^2 \> 0\$, \$2a\_3 \= 32r^3 \< 0\$이다.  
조건 \$a\_1 \+ \|a\_2\| \+ \|2a\_3\| \= 0\$에 대입하면  
\$\$16r \+ 16r^2 - 32r^3 \= 0 \\implies 2r^2 - r - 1 \= 0 \\implies (2r \+ 1)(r - 1\) \= 0\$\$  
\$r \< 0\$이므로 \$r \= \-\\frac{1}{2}\$이고, \$a\_1 \= 16\\left(-\\frac{1}{2}\\right) \= \-8\$이다.  
따라서 \$a\_2 \= a\_1 r \= (-8)\\left(-\\frac{1}{2}\\right) \= 4\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "\$a\_3a\_5=16a\_8\$에서 \$a\_1=16r\$ (\$r\<0\$)을 구해 절댓값 방정식을 \$r\$에 대한 이차방정식으로 푼다.", "decisiveStep": "\$r\<0\$ 부호 판정 후 \$16r \+ 16r^2 - 32r^3 \= 0\$에서 \$r \= \-\\\\frac{1}{2}\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-118, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "첫째항 음수 조건으로 공비의 부호를 추론해 절댓값을 벗겨야 하는 등비수열 문항이다.", "level": "중", "item4slot": {"given": \["등비수열"\], "goal": \["값"\], "method": \["일반항"\], "condition": \["부호", "절댓값"\]}, "hold": ""}  
\`\`\`

\## Q12  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
수열 \$\\{a\_n\\}\$에서 \$a\_n\$은 자연수 \$n\$을 \$n\$개 이어 붙여 만든 자연수라 하자. (예를 들어 \$a\_2 \= 22\$, \$a\_{10} \= 10101010101010101010\$이다.) \$\\log a\_n\$의 정수 부분을 \$b\_n\$이라 할 때, \$\\sum\_{n=1}^{12} b\_n\$의 값은? (단, \$\\log\$는 상용로그이다.)  
\#\## 선지  
① \$99\$ ② \$78\$ ③ \$88\$ ④ \$96\$ ⑤ \$102\$  
\#\## 정답  
①  
\#\## 해설  
\$1 \\le n \\le 9\$일 때, \$n\$은 한 자리 자연수이므로 \$a\_n\$은 \$n\$자리 자연수이다. 따라서 \$\\log a\_n\$의 정수 부분 \$b\_n \= n - 1\$이다.  
\$n \= 10, 11, 12\$일 때, \$n\$은 두 자리 자연수이므로 \$a\_n\$은 \$2n\$자리 자연수이다. 따라서 \$b\_{10} \= 19\$, \$b\_{11} \= 21\$, \$b\_{12} \= 23\$이다.  
그러므로  
\$\$\\sum\_{n=1}^{12} b\_n \= \\sum\_{n=1}^{9} (n - 1\) \+ (19 \+ 21 \+ 23\) \= (0 \+ 1 \+ \\cdots \+ 8\) \+ 63 \= \\frac{8 \\times 9}{2} \+ 63 \= 36 \+ 63 \= 99\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "", "primaryMethod": "상용로그의 정수 부분이 자릿수\$-1\$임을 이용해 한 자리 수(\$1\\\\le n\\\\le 9\$)와 두 자리 수(\$10\\\\le n\\\\le 12\$)를 구분해 합산한다.", "decisiveStep": "\$b\_{10}=19, b\_{11}=21, b\_{12}=23\$으로 자릿수 변화를 반영해 \$36+63=99\$를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "상용로그", "l4": "상용로그표·자릿수"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_COMMON\_LOG", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-077, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상용로그 정수 부분과 자릿수의 관계에서 \$n \\\\ge 10\$ 구간의 자릿수 2배 규칙을 놓치지 않아야 한다.", "level": "중", "item4slot": {"given": \["수열", "자연수"\], "goal": \["합"\], "method": \["상용로그", "시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q13  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
\$h \> 0\$일 때, \$n \\ge 2\$인 모든 자연수 \$n\$에 대하여 부등식 \$(1 \+ h)^n \> 1 \+ nh\$가 성립함을 수학적 귀납법으로 증명하는 과정이다. \[4.5점\]

(ⅰ) \$n \=\$ ①일 때, (좌변) \$= (1 \+ h)^2 \= 1 \+ 2h \+\$ ② \$\> 1 \+ 2h \=\$ (우변)이므로 부등식이 성립한다.  
(ⅱ) \$n \=\$ ③ (\$③ \\ge 2\$)일 때 성립한다고 가정하면 \$(1 \+ h)^k \> 1 \+ kh\$이다.  
양변에 ④를 곱하면  
\$\$(1 \+ h)^{k+1} \> (1 \+ kh)(1 \+ h) \= 1 \+ (k \+ 1)h \+ \\text{⑤} \> 1 \+ (k \+ 1)h\$\$  
이므로 \$n \= k \+ 1\$일 때도 성립한다.

다음 중 ①\~⑤에 알맞은 것으로 옳지 \*\*않은\*\* 것은?  
\#\## 선지  
① \$2\$ ② \$h^2\$ ③ \$k\$ ④ \$1 \+ h\$ ⑤ \$k^2 h\$  
\#\## 정답  
⑤  
\#\## 해설  
(ⅰ) \$n \= 2\$일 때 확인하므로 ①은 \$2\$이고, \$(1 \+ h)^2 \= 1 \+ 2h \+ h^2\$이므로 ②는 \$h^2\$이다.  
(ⅱ) \$n \= k\$일 때 가정하므로 ③은 \$k\$이고, 양변에 양수 \$1 \+ h\$를 곱하므로 ④는 \$1 \+ h\$이다.  
우변을 전개하면 \$(1 \+ kh)(1 \+ h) \= 1 \+ (k \+ 1)h \+ kh^2\$이므로 ⑤에 알맞은 식은 \$kh^2\$이다.  
따라서 옳지 않은 것은 ⑤(\$k^2 h\$)이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "수학적 귀납법의 초기조건(\$n=2\$)과 귀납 단계(\$(1+h)\$ 곱셈 전개)를 따라 각 빈칸의 식을 확인한다.", "decisiveStep": "\$(1+kh)(1+h)\$의 전개식에서 추가되는 양수 항이 \$k^2h\$가 아니라 \$kh^2\$임을 확인하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수학적 귀납법", "l4": "부등식·나눗셈 증명"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_MATHEMATICAL\_INDUCTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-132, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수학적 귀납법으로 부등식을 증명하는 과정의 빈칸 추론 및 전개식 오류 판별 문항이다.", "level": "중", "item4slot": {"given": \["부등식", "자연수"\], "goal": \["증명"\], "method": \["수학적귀납법"\], "condition": \["양수"\]}, "hold": ""}  
\`\`\`

\## Q14  
- 형식: 객관식  
- 배점: 4.8  
\#\## 발문  
원에 내접하는 사각형 \$ABCD\$에서 \$\\overline{AB} \= 2\$, \$\\overline{BC} \= 3\$, \$\\overline{CD} \= 4\$, \$\\overline{DA} \= 5\$일 때, 사각형 \$ABCD\$의 넓이는?  
\#\## 선지  
① \$\\sqrt{30}\$ ② \$2\\sqrt{30}\$ ③ \$3\\sqrt{30}\$ ④ \$\\frac{5\\sqrt{30}}{2}\$ ⑤ \$4\\sqrt{30}\$  
\#\## 정답  
②  
\#\## 해설  
\$\\angle B \= \\theta\$라 하면 사각형 \$ABCD\$가 원에 내접하므로 \$\\angle D \= 180^\\circ - \\theta\$이다.  
\$\\triangle ABC\$와 \$\\triangle ADC\$에서 각각 코사인법칙을 적용하면  
\$\$\\overline{AC}^2 \= 2^2 \+ 3^2 - 2 \\times 2 \\times 3 \\cos\\theta \= 13 - 12\\cos\\theta\$\$  
\$\$\\overline{AC}^2 \= 4^2 \+ 5^2 - 2 \\times 4 \\times 5 \\cos(180^\\circ - \\theta) \= 41 \+ 40\\cos\\theta\$\$  
두 식이 같으므로 \$13 - 12\\cos\\theta \= 41 \+ 40\\cos\\theta \\implies 52\\cos\\theta \= \-28 \\implies \\cos\\theta \= \-\\frac{7}{13}\$이다.  
\$\\sin\\theta \> 0\$이므로 \$\\sin\\theta \= \\sqrt{1 - \\left(-\\frac{7}{13}\\right)^2} \= \\frac{\\sqrt{120}}{13} \= \\frac{2\\sqrt{30}}{13}\$이다.  
따라서 사각형 \$ABCD\$의 넓이 \$S\$는  
\$\$S \= \\frac{1}{2} \\times 2 \\times 3 \\sin\\theta \+ \\frac{1}{2} \\times 4 \\times 5 \\sin(180^\\circ - \\theta) \= (3 \+ 10)\\sin\\theta \= 13 \\times \\frac{2\\sqrt{30}}{13} \= 2\\sqrt{30}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "원 내접 사각형의 대각 관계 \$\\\\angle D \= 180^\\\\circ - \\\\angle B\$와 공통 대각선 \$\\\\overline{AC}^2\$에 코사인법칙을 적용한다.", "decisiveStep": "\$13 - 12\\\\cos\\\\theta \= 41 \+ 40\\\\cos\\\\theta\$에서 \$\\\\cos\\\\theta \= \-\\\\frac{7}{13}\$, \$\\\\sin\\\\theta \= \\\\frac{2\\\\sqrt{30}}{13}\$을 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "복합도형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-114, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원 내접 사각형의 대각 성질, 코사인법칙 연립, 삼각형 넓이 합산을 모두 수행해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"given": \["사각형", "길이"\], "goal": \["넓이"\], "method": \["코사인법칙", "삼각형넓이공식"\], "condition": \["내접"\]}, "hold": ""}  
\`\`\`

\## Q15  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
공차가 \$4\$인 등차수열 \$\\{a\_n\\}\$과 자연수 \$m\$이  
\$\$\\sum\_{k=1}^{m} a\_{k+1} \= 180, \\quad \\sum\_{k=1}^{m} (a\_k \+ m) \= 240\$\$  
을 만족시킬 때, \$m\$의 값은?  
\#\## 선지  
① \$7\$ ② \$8\$ ③ \$9\$ ④ \$10\$ ⑤ \$11\$  
\#\## 정답  
④  
\#\## 해설  
두 번째 식을 전개하면 \$\\sum\_{k=1}^{m} a\_k \+ \\sum\_{k=1}^{m} m \= 240\$이므로  
\$\$\\sum\_{k=1}^{m} a\_k \= 240 - m^2\$\$  
첫 번째 식에서 이 식을 변변 빼면  
\$\$\\sum\_{k=1}^{m} (a\_{k+1} - a\_k) \= 180 - (240 - m^2) \= m^2 - 60\$\$  
공차가 \$4\$이므로 좌변은 \$\\sum\_{k=1}^{m} 4 \= 4m\$이다.  
\$\$m^2 - 4m - 60 \= 0 \\implies (m - 10)(m \+ 6\) \= 0\$\$  
\$m\$은 자연수이므로 \$m \= 10\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "\$\\\\sum\_{k=1}^m m \= m^2\$으로 분리한 뒤 두 합의 차 \$\\\\sum\_{k=1}^m (a\_{k+1}-a\_k) \= 4m\$으로 \$m\$의 이차방정식을 세운다.", "decisiveStep": "\$4m \= m^2 - 60\$을 인수분해해 자연수 \$m \= 10\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "합의 기호 Σ", "l4": "Σ 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SIGMA\_NOTATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-123, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "첨자 변수 \$k\$와 상수 취급되는 \$m\$을 구분해 \$\\\\sum\$을 정리하고 공차 소거를 이용하는 문항이다.", "level": "중", "item4slot": {"given": \["등차수열", "자연수"\], "goal": \["미지수"\], "method": \["시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q16  
- 형식: 객관식  
- 배점: 4.7  
\#\## 발문  
좌표축 위의 다섯 개의 점 \$A(-a, 0)\$, \$B(0, b)\$, \$C(c, 0)\$, \$D(0, \-d)\$, \$E(-e, 0)\$ (\$a, b, c, d, e \> 0\$, \$a \< b\$, \$e \> a\$)에 대하여 \$\\overline{AB} \\perp \\overline{BC}\$, \$\\overline{BC} \\perp \\overline{CD}\$, \$\\overline{CD} \\perp \\overline{DE}\$가 성립한다. 세 선분 \$\\overline{AO}\$, \$2\\overline{OC}\$, \$\\overline{EA}\$의 길이가 이 순서대로 등차수열을 이룰 때, 직선 \$BC\$의 기울기는? (단, \$O\$는 원점이다.) \[4.7점\]  
\#\## 선지  
① \$-\\frac{1}{4}\$ ② \$-\\frac{1}{3}\$ ③ \$-\\frac{1}{2}\$ ④ \$-\\frac{\\sqrt{2}}{2}\$ ⑤ \$-\\frac{\\sqrt{3}}{2}\$  
\#\## 정답  
③  
\#\## 해설  
수직 조건에서 각 인접 직선의 기울기의 곱이 \$-1\$이므로  
\$\$\\frac{b}{a} \\cdot \\left(-\\frac{b}{c}\\right) \= \-1 \\implies b^2 \= ac, \\quad \\left(-\\frac{b}{c}\\right) \\cdot \\frac{d}{c} \= \-1 \\implies c^2 \= bd, \\quad \\frac{d}{c} \\cdot \\left(-\\frac{d}{e}\\right) \= \-1 \\implies d^2 \= ce\$\$  
또한 \$\\overline{AO} \= a\$, \$\\overline{OC} \= c\$, \$\\overline{EA} \= e - a\$가 이 순서대로 등차수열을 이루므로 등차중항의 성질에 의해  
\$\$2(2c) \= a \+ (e - a) \\implies e \= 4c\$\$  
직선 \$BC\$의 기울기를 \$m \= \-\\frac{b}{c}\$ (\$m \< 0\$)라 하면 \$d \= \\frac{c^2}{b} \= \-\\frac{c}{m}\$이다.  
\$d^2 \= ce\$에 대입하면  
\$\$\\left(-\\frac{c}{m}\\right)^2 \= c \\cdot 4c \\implies \\frac{1}{m^2} \= 4 \\implies m^2 \= \\frac{1}{4}\$\$  
\$m \< 0\$이므로 구하는 기울기는 \$m \= \-\\frac{1}{2}\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "수직 조건으로 \$b^2=ac, c^2=bd, d^2=ce\$를 얻고 등차중항으로 \$e=4c\$를 구해 기울기 \$m\$으로 정리한다.", "decisiveStep": "\$e \= 4c\$와 \$d \= \-\\\\frac{c}{m}\$을 \$d^2 \= ce\$에 대입해 \$m^2 \= \\\\frac{1}{4}\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "중항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-116, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선의 수직 조건과 등차중항을 연쇄적으로 연결해 기하적 비율에서 기울기를 도출하는 고난도 문항이다.", "level": "상", "item4slot": {"given": \["좌표", "등차수열"\], "goal": \["기울기"\], "method": \["등차중항"\], "condition": \["수선"\]}, "hold": ""}  
\`\`\`

\## Q17  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
공차가 양수인 등차수열 \$\\{a\_n\\}\$에 대하여 \$a\_5 \+ a\_9 \= 0\$, \$\\sum\_{k=1}^{5} \\frac{1}{a\_k a\_{k+1}} \= \\frac{5}{96}\$일 때, 일반항 \$a\_n\$은?  
\#\## 선지  
① \$a\_n \= 4n - 28\$ ② \$a\_n \= 3n - 21\$ ③ \$a\_n \= 4n - 24\$ ④ \$a\_n \= 5n - 35\$ ⑤ \$a\_n \= 5n - 30\$  
\#\## 정답  
①  
\#\## 해설  
등차중항에 의해 \$a\_5 \+ a\_9 \= 2a\_7 \= 0\$이므로 \$a\_7 \= a\_1 \+ 6d \= 0\$, 즉 \$a\_1 \= \-6d\$ (\$d \> 0\$)이다.  
부분분수 분해를 적용하면  
\$\$\\sum\_{k=1}^{5} \\frac{1}{a\_k a\_{k+1}} \= \\frac{1}{d} \\sum\_{k=1}^{5} \\left(\\frac{1}{a\_k} - \\frac{1}{a\_{k+1}}\\right) \= \\frac{1}{d}\\left(\\frac{1}{a\_1} - \\frac{1}{a\_6}\\right)\$\$  
\$a\_1 \= \-6d\$, \$a\_6 \= \-d\$를 대입하면  
\$\$\\frac{1}{d}\\left(\\frac{1}{-6d} - \\frac{1}{-d}\\right) \= \\frac{5}{6d^2} \= \\frac{5}{96} \\implies d^2 \= 16 \\implies d \= 4 \\ (d \> 0)\$\$  
따라서 \$a\_1 \= \-24\$이므로 \$a\_n \= \-24 \+ 4(n - 1\) \= 4n - 28\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_SUM", "conceptClusterKey": "", "primaryMethod": "등차중항 \$a\_7=0\$으로 항들을 공차 \$d\$로 나타낸 뒤 부분분수 합으로 \$d\$를 구한다.", "decisiveStep": "\$\\\\frac{5}{6d^2} \= \\\\frac{5}{96}\$에서 양수 공차 \$d=4\$를 구해 \$a\_n \= 4n-28\$을 완성하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "여러 가지 수열의 합", "l4": "부분분수·망원급수형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SEQUENCE\_SUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-126, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등차중항과 부분분수 망원급수를 결합해 공차와 일반항을 역산하는 중상급 문항이다.", "level": "중", "item4slot": {"given": \["등차수열"\], "goal": \["일반항"\], "method": \["부분분수", "등차중항"\], "condition": \["양수"\]}, "hold": ""}  
\`\`\`

\## Q18  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
반지름의 길이가 \$R\$인 원 \$C\$에 내접하는 삼각형 \$ABC\$와 직선 \$AE\$가 변 \$BC\$와 만나는 점 \$E\$, 원 \$C\$와 다시 만나는 점 \$D\$가 다음 조건을 만족시킨다. 삼각형 \$ABC\$의 넓이가 삼각형 \$BDE\$의 넓이의 \$4\$배가 되도록 하는 모든 \$\\overline{BE}\$의 값들의 곱은?

(가) \$\\angle DBE \= \\frac{\\pi}{6}\$  
(나) \$\\overline{BD} \= R \= 2\$  
(다) \$\\overline{AB} : \\overline{AC} \= \\overline{BE} : \\overline{CE}\$  
(라) \$\\overline{AB}^2 \+ \\overline{AC}^2 \= \\overline{AB} \\cdot \\overline{AC} \+ 12\$  
\#\## 선지  
① \$\\frac{1}{4}\$ ② \$\\frac{1}{2}\$ ③ \$\\frac{3}{4}\$ ④ \$\\frac{5}{6}\$ ⑤ \$1\$  
\#\## 정답  
⑤  
\#\## 해설  
조건 (나)에서 \$\\overline{BD} \= R \= 2\$이므로 현 \$BD\$에 대한 중심각은 \$60^\\circ\$, 원주각은 \$\\angle BAD \= 30^\\circ\$이다.  
조건 (다)에 의해 \$AE\$는 \$\\angle A\$의 이등분선이므로 \$\\angle BAC \= 60^\\circ\$이다.  
\$\\overline{AB} \= c\$, \$\\overline{AC} \= b\$라 하면 코사인법칙과 조건 (라)에 의해  
\$\$\\overline{BC}^2 \= b^2 \+ c^2 - 2bc\\cos 60^\\circ \= b^2 \+ c^2 - bc \= 12 \\implies \\overline{BC} \= 2\\sqrt{3}\$\$  
\$\\triangle ACE \\sim \\triangle BDE\$ (AA 닮음)이고 닮음비가 \$b : 2\$이므로 넓이의 비는 \$b^2 : 4\$이다.  
따라서 \$\\triangle BDE \= \\triangle ABC \\cdot \\frac{b}{b+c} \\cdot \\frac{4}{b^2} \= \\triangle ABC \\cdot \\frac{4}{b(b+c)}\$이다.  
조건 \$\\triangle ABC \= 4\\triangle BDE\$에서 \$b(b+c) \= 16 \\implies c \= \\frac{16 - b^2}{b}\$이다.  
이를 \$b^2 \+ c^2 - bc \= 12\$에 대입하고 \$t \= b^2\$이라 하면  
\$\$t \+ \\frac{(16 - t)^2}{t} - (16 - t) \= 12 \\implies 3t^2 - 60t \+ 256 \= 0\$\$  
두 근 \$t\_1, t\_2\$는 \$0 \< t\_1, t\_2 \< 16\$을 만족하며 \$t\_1 \+ t\_2 \= 20\$, \$t\_1 t\_2 \= \\frac{256}{3}\$이다.  
한편 \$\\overline{BE} \= \\frac{2\\sqrt{3}c}{b+c} \= \\frac{2\\sqrt{3}(16 - t)}{16} \= \\frac{\\sqrt{3}}{8}(16 - t)\$이므로 모든 \$\\overline{BE}\$의 곱은  
\$\$\\frac{3}{64}(16 - t\_1)(16 - t\_2) \= \\frac{3}{64}\\left(256 - 16 \\cdot 20 \+ \\frac{256}{3}\\right) \= \\frac{3}{64} \\cdot \\frac{64}{3} \= 1\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "원주각·각의 이등분선·코사인법칙으로 \$\\\\overline{BC}\$를 구하고 닮음 넓이 비 조건에서 \$b^2\$의 이차방정식 근과 계수를 적용한다.", "decisiveStep": "\$3t^2-60t+256=0\$과 \$\\\\overline{BE}=\\\\frac{\\\\sqrt{3}}{8}(16-t)\$를 연결해 근과 계수의 관계로 곱 \$1\$을 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "복합도형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-114, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원주각, 닮음 넓이 비, 코사인법칙, 이차방정식 근과 계수의 관계를 모두 결합한 최고난도 문항이다.", "level": "상", "item4slot": {"given": \["삼각형", "원", "넓이"\], "goal": \["곱"\], "method": \["코사인법칙", "닮음"\], "condition": \["내접"\]}, "hold": ""}  
\`\`\`

\## Q19  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
수열 \$\\{a\_n\\}\$이 모든 자연수 \$n\$에 대하여 다음 조건을 만족시킬 때, \$a\_2\$의 값은?

(가) \$1 \< a\_1 \< 2\$  
(나) \$a\_{2n} \= a\_3 a\_n \+ 1\$  
(다) \$a\_{2n+1} \= a\_3 a\_n - 1\$  
(라) \$a\_{12} - a\_{15} \= 8\$  
\#\## 선지  
① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$  
\#\## 정답  
②  
\#\## 해설  
조건 (나)에서 \$a\_6 \= a\_3^2 \+ 1\$이므로 \$a\_{12} \= a\_3 a\_6 \+ 1 \= a\_3^3 \+ a\_3 \+ 1\$이다.  
조건 (다)에서 \$a\_7 \= a\_3^2 - 1\$이므로 \$a\_{15} \= a\_3 a\_7 - 1 \= a\_3^3 - a\_3 - 1\$이다.  
조건 (라)에 대입하면  
\$\$a\_{12} - a\_{15} \= (a\_3^3 \+ a\_3 \+ 1\) - (a\_3^3 - a\_3 - 1\) \= 2a\_3 \+ 2 \= 8 \\implies a\_3 \= 3\$\$  
조건 (다)에 \$n \= 1\$을 대입하면 \$a\_3 \= a\_3 a\_1 - 1 \\implies 3 \= 3a\_1 - 1 \\implies a\_1 \= \\frac{4}{3}\$ (조건 (가) 만족).  
따라서 조건 (나)에 \$n \= 1\$을 대입하면 \$a\_2 \= a\_3 a\_1 \+ 1 \= 3 \\times \\frac{4}{3} \+ 1 \= 5\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "\$a\_{12}\$와 \$a\_{15}\$를 \$a\_3\$의 다항식으로 전개해 \$a\_3\$을 먼저 구한 뒤 \$a\_1, a\_2\$를 역산한다.", "decisiveStep": "\$a\_{12}-a\_{15} \= 2a\_3 \+ 2 \= 8\$에서 \$a\_3=3\$을 구해 \$a\_1=\\\\frac{4}{3}, a\_2=5\$를 찾는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수열의 귀납적 정의", "l4": "점화식으로 항 구하기"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_RECURSIVE\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-129, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "짝수·홀수 점화식을 거듭 대입해 미지 항 \$a\_3\$을 소거하고 초기항을 역추적하는 문항이다.", "level": "중", "item4slot": {"given": \["수열"\], "goal": \["값"\], "method": \["귀납적정의"\], "condition": \["범위"\]}, "hold": ""}  
\`\`\`

\## Q20  
- 형식: 서술형  
- 배점: 5  
\#\## 발문  
첫째항부터 제\$2\$항까지의 합이 \$12\$, 첫째항부터 제\$4\$항까지의 합이 \$120\$인 등비수열의 일반항 \$a\_n\$을 구하는 과정을 서술하시오. (단, 공비는 자연수이다.)  
\#\## 선지  
없음  
\#\## 정답  
\$a\_n \= 3^n\$  
\#\## 해설  
첫째항을 \$a\$, 공비를 \$r\$이라 하자. \$r \= 1\$이면 \$S\_4 \= 2S\_2 \= 24 \\ne 120\$이므로 \$r \\ne 1\$이다.  
\$\$S\_2 \= \\frac{a(r^2 - 1)}{r - 1} \= 12, \\quad S\_4 \= \\frac{a(r^4 - 1)}{r - 1} \= S\_2(r^2 \+ 1\) \= 120\$\$  
따라서 \$12(r^2 \+ 1\) \= 120 \\implies r^2 \+ 1 \= 10 \\implies r^2 \= 9\$이고, 공비 \$r\$이 자연수이므로 \$r \= 3\$이다.  
\$S\_2 \= a(1 \+ 3\) \= 12\$에서 \$a \= 3\$이므로 일반항은 \$a\_n \= 3 \\times 3^{n-1} \= 3^n\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "등비수열의 합 \$S\_4 \= S\_2(r^2+1)\$ 인수분해 관계를 이용해 자연수 공비 \$r\$과 첫째항을 구한다.", "decisiveStep": "\$12(r^2+1) \= 120\$에서 \$r=3\$을 구하고 \$a=3\$을 도출하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-120, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등비수열의 부분합 비율 관계로 공비를 구하는 기본 서술형 문항이다.", "level": "하", "item4slot": {"given": \["등비수열", "수열의합"\], "goal": \["일반항"\], "method": \["수열의합"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q21  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
삼각형 \$ABC\$가 다음 조건을 만족시킬 때, 삼각형 \$ABC\$의 외접원의 반지름의 길이를 구하는 과정을 서술하시오.

(가) 변 \$BC\$를 \$B\$에 가까운 쪽부터 \$3 : 1 : 2\$로 나누는 두 점을 각각 \$P\$, \$Q\$라 한다.  
(나) \$\\sin(\\angle QAP) : \\sin(\\angle APQ) \= 1 : 2\\sqrt{2}\$  
(다) \$\\overline{AB} \= 4\$, \$\\overline{AQ} \= 2\\sqrt{2}\$  
\#\## 선지  
없음  
\#\## 정답  
\$\\frac{8\\sqrt{7}}{7}\$  
\#\## 해설  
\$\\triangle APQ\$에서 사인법칙을 적용하면  
\$\$\\frac{\\overline{PQ}}{\\sin(\\angle QAP)} \= \\frac{\\overline{AQ}}{\\sin(\\angle APQ)} \\implies \\overline{PQ} \= 2\\sqrt{2} \\times \\frac{1}{2\\sqrt{2}} \= 1\$\$  
조건 (가)에 의해 \$\\overline{BP} \= 3\$, \$\\overline{PQ} \= 1\$, \$\\overline{QC} \= 2\$이므로 \$\\overline{BQ} \= 4\$, \$\\overline{BC} \= 6\$이다.  
\$\\triangle ABQ\$에서 코사인법칙을 적용하면  
\$\$\\cos B \= \\frac{4^2 \+ 4^2 - (2\\sqrt{2})^2}{2 \\times 4 \\times 4} \= \\frac{16 \+ 16 - 8}{32} \= \\frac{3}{4}\$\$  
\$\\sin B \= \\sqrt{1 - \\left(\\frac{3}{4}\\right)^2} \= \\frac{\\sqrt{7}}{4}\$이다.  
이제 \$\\triangle ABC\$에서 코사인법칙을 적용하면  
\$\$\\overline{AC}^2 \= 4^2 \+ 6^2 - 2 \\times 4 \\times 6 \\times \\frac{3}{4} \= 16 \+ 36 - 36 \= 16 \\implies \\overline{AC} \= 4\$\$  
따라서 외접원의 반지름의 길이 \$R\$은 사인법칙에 의해  
\$\$2R \= \\frac{\\overline{AC}}{\\sin B} \= \\frac{4}{\\frac{\\sqrt{7}}{4}} \= \\frac{16\\sqrt{7}}{7} \\implies R \= \\frac{8\\sqrt{7}}{7}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "\$\\\\triangle APQ\$ 사인법칙으로 \$\\\\overline{PQ}\$를 확정하고, \$\\\\triangle ABQ\$와 \$\\\\triangle ABC\$에 코사인법칙·사인법칙을 순차 적용한다.", "decisiveStep": "\$\\\\overline{PQ}=1\$에서 \$\\\\overline{BQ}=4, \\\\overline{BC}=6\$을 얻어 \$\\\\cos B=\\\\frac{3}{4}\$, \$\\\\overline{AC}=4\$를 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_SINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-110, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내부 삼각형에서 비례 길이를 확정한 뒤 두 번의 코사인법칙과 사인법칙을 연쇄 적용하는 고난도 서술형이다.", "level": "상", "item4slot": {"given": \["삼각형", "길이"\], "goal": \["반지름"\], "method": \["사인법칙", "코사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q22  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
세 수 \$\\frac{a}{b}\$, \$ab\$, \$2b\$가 다음 조건을 만족시킬 때, 상수 \$a, b\$의 값을 구하는 과정을 서술하시오.

(가) \$a \< 0 \< b \< 1\$  
(나) 세 수는 적당히 배열하면 등차수열이 되고, 또 적당히 배열하면 등비수열이 된다. (등차수열과 등비수열이 되는 배열 순서를 각각 밝혀 서술하시오.)  
\#\## 선지  
없음  
\#\## 정답  
\$a \= \-1,\\ b \= \\frac{1}{2}\$  
\#\## 해설  
\$0 \< b \< 1\$이므로 \$\\frac{1}{b} \> 1 \> b\$이고, \$a \< 0\$을 곱하면 \$\\frac{a}{b} \< a \< ab \< 0 \< 2b\$가 성립한다.  
따라서 세 수가 등차수열을 이루는 배열 순서는 크기순인 \$\\frac{a}{b},\\ ab,\\ 2b\$ (또는 역순)이다. 등차중항에 의해  
\$\$2ab \= \\frac{a}{b} \+ 2b \\quad \\cdots \\text{㉠}\$\$  
세 수 중 \$2\$개는 음수, \$1\$개는 양수이므로 등비수열이 되려면 양수 \$2b\$가 가운데에 위치해야 한다. 따라서 배열 순서는 \$\\frac{a}{b},\\ 2b,\\ ab\$ (또는 역순)이다. 등비중항에 의해  
\$\$(2b)^2 \= \\frac{a}{b} \\cdot ab \= a^2 \\implies 2b \= \-a \\ (a \< 0 \< b) \\quad \\cdots \\text{㉡}\$\$  
㉡에서 \$a \= \-2b\$를 ㉠에 대입하면  
\$\$2(-2b)b \= \-2 \+ 2b \\implies 4b^2 \+ 2b - 2 \= 0 \\implies (2b - 1)(b \+ 1\) \= 0\$\$  
\$0 \< b \< 1\$이므로 \$b \= \\frac{1}{2}\$이고, \$a \= \-2b \= \-1\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "부등식으로 세 수의 대소와 부호를 판정해 등차·등비수열의 유일한 배열 순서를 정한 뒤 중항 식을 연립한다.", "decisiveStep": "부호 조건으로 등비수열 가운데 항이 \$2b\$임을 밝혀 \$a=-2b\$를 대입하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "중항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-119, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "대소 비교와 부호 논리로 두 수열의 배열 순서를 논증하고 이차방정식으로 해를 구하는 고난도 서술형이다.", "level": "상", "item4slot": {"given": \["등차수열", "등비수열"\], "goal": \["상수"\], "method": \["등차중항", "등비중항"\], "condition": \["부호", "범위"\]}, "hold": ""}  
\`\`\`

\## Q23  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
반지름의 길이가 \$\\overline{O\_1 O\_2}\$인 두 원 \$C\_1, C\_2\$의 중심을 각각 \$O\_1, O\_2\$라 하자. 원 \$C\_1\$ 위의 서로 다른 세 점 \$A, B, C\$와 원 \$C\_2\$ 위의 점 \$D\$에 대하여 세 점 \$A, O\_1, O\_2\$와 세 점 \$C, O\_2, D\$는 각각 한 직선 위에 있고, \$\\angle BO\_1 A \= \\theta\_1\$, \$\\angle O\_2 O\_1 C \= \\theta\_2\$, \$\\angle O\_1 O\_2 D \= \\theta\_3\$이라 할 때 \$\\theta\_3 \= \\theta\_1 \+ \\theta\_2\$가 성립한다. \$\\overline{AB} \= 4\$, \$\\overline{O\_1 D} \= 6\\sqrt{2}\$일 때, \$\\overline{CO\_2} \\times \\overline{O\_2 D}\$의 값을 구하는 과정을 서술하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$28\$  
\#\## 해설  
두 원의 반지름의 길이를 \$R\$이라 하자. \$\\triangle O\_1 O\_2 C\$는 \$\\overline{O\_1 C} \= \\overline{O\_1 O\_2} \= R\$인 이등변삼각형이므로 \$\\angle O\_1 O\_2 C \= 90^\\circ - \\frac{\\theta\_2}{2}\$이다.  
세 점 \$C, O\_2, D\$가 한 직선 위에 있으므로 \$\\theta\_3 \= 180^\\circ - \\left(90^\\circ - \\frac{\\theta\_2}{2}\\right) \= 90^\\circ \+ \\frac{\\theta\_2}{2}\$이다.  
조건 \$\\theta\_3 \= \\theta\_1 \+ \\theta\_2\$에 대입하면 \$\\theta\_1 \+ \\frac{\\theta\_2}{2} \= 90^\\circ\$이고, 따라서 \$\\theta\_3 \= 180^\\circ - \\theta\_1\$이다.  
한편 \$\\triangle O\_1 O\_2 C\$에서 코사인법칙에 의해  
\$\$\\overline{CO\_2}^2 \= 2R^2(1 - \\cos\\theta\_2) \= 4R^2\\sin^2\\frac{\\theta\_2}{2} \\implies \\overline{CO\_2} \= 2R\\sin\\frac{\\theta\_2}{2} \= 2R\\cos\\theta\_1\$\$  
따라서 구하는 값은 \$\\overline{CO\_2} \\times \\overline{O\_2 D} \= 2R^2\\cos\\theta\_1\$이다.  
\$\\triangle O\_1 AB\$와 \$\\triangle O\_1 O\_2 D\$에서 각각 코사인법칙을 적용하면  
\$\$\\overline{AB}^2 \= 16 \= 2R^2(1 - \\cos\\theta\_1), \\quad \\overline{O\_1 D}^2 \= 72 \= 2R^2(1 - \\cos\\theta\_3) \= 2R^2(1 \+ \\cos\\theta\_1)\$\$  
두 식을 변변 빼면 \$72 - 16 \= 4R^2\\cos\\theta\_1 \\implies 4R^2\\cos\\theta\_1 \= 56\$이므로  
\$\$\\overline{CO\_2} \\times \\overline{O\_2 D} \= 2R^2\\cos\\theta\_1 \= 28\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "이등변삼각형의 외각으로 \$\\\\theta\_1 \+ \\\\frac{\\\\theta\_2}{2} \= 90^\\\\circ\$와 \$\\\\theta\_3 \= 180^\\\\circ - \\\\theta\_1\$을 유도한 뒤 두 코사인법칙 식을 연립한다.", "decisiveStep": "\$2R^2(1+\\\\cos\\\\theta\_1)=72\$와 \$2R^2(1-\\\\cos\\\\theta\_1)=16\$의 차로 \$2R^2\\\\cos\\\\theta\_1=28\$을 바로 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 원의 반지름 등식과 각 관계 \$\\\\theta\_3 \= 180^\\\\circ - \\\\theta\_1\$을 도출해 코사인법칙을 소거 연립하는 최고난도 서술형이다.", "level": "상", "item4slot": {"given": \["원", "길이", "각"\], "goal": \["값"\], "method": \["코사인법칙"\], "condition": \["이등변삼각형"\]}, "hold": ""}  
\`\`\`  
