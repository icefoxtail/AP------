\`\`\`json:exam  
{"stem": "26\_제일고\_1학기\_기말\_고2\_대수\_유사", "sourceArchiveFile": "original/high/h2/1final/26\_제일고\_1학기\_기말\_고2\_대수.js", "examFolder": "1final", "grade": "고2", "subject": "대수", "curriculum": "2022", "questionCount": 21, "totalScore": 100, "generatedAt": "2026-11-21"}  
\`\`\`

\## Q01  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
삼각형 \$ABC\$의 외접원의 반지름의 길이가 \$6\$이고 \$\\angle A \= 45^\\circ\$일 때, 선분 \$BC\$의 길이는?  
\#\## 선지  
① \$6\\sqrt{2}\$ ② \$3\\sqrt{2}\$ ③ \$4\\sqrt{2}\$ ④ \$5\\sqrt{2}\$ ⑤ \$12\$  
\#\## 정답  
①  
\#\## 해설  
사인법칙 \$\\frac{\\overline{BC}}{\\sin A} \= 2R\$에 \$R \= 6\$, \$A \= 45^\\circ\$를 대입하면  
\$\$\\overline{BC} \= 2 \\times 6 \\times \\sin 45^\\circ \= 12 \\times \\frac{\\sqrt{2}}{2} \= 6\\sqrt{2}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "외접원 반지름 \$R=6\$과 대각 \$A=45^\\\\circ\$를 사인법칙 \$\\\\overline{BC}=2R\\\\sin A\$에 대입한다.", "decisiveStep": "\$2R\\\\sin 45^\\\\circ \= 12 \\\\cdot \\\\frac{\\\\sqrt{2}}{2} \= 6\\\\sqrt{2}\$를 계산하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_SINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-110, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "외접원의 반지름과 한 각이 주어져 사인법칙 1회 적용으로 바로 풀린다.", "level": "하", "item4slot": {"given": \["삼각형", "원"\], "goal": \["길이"\], "method": \["사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q02  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
첫째항이 \$5\$이고 공차가 \$-3\$인 등차수열 \$\\{a\_n\\}\$의 일반항은?  
\#\## 선지  
① \$a\_n \= \-3n \+ 2\$ ② \$a\_n \= \-3n \+ 5\$ ③ \$a\_n \= 3n \+ 2\$ ④ \$a\_n \= \-3n \+ 8\$ ⑤ \$a\_n \= 5n - 3\$  
\#\## 정답  
④  
\#\## 해설  
등차수열의 일반항 공식 \$a\_n \= a\_1 \+ (n - 1)d\$에 \$a\_1 \= 5\$, \$d \= \-3\$을 대입하면  
\$\$a\_n \= 5 \+ (n - 1)(-3) \= \-3n \+ 8\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "등차수열 일반항 공식 \$a\_n \= a\_1 \+ (n-1)d\$에 첫째항과 공차를 대입한다.", "decisiveStep": "\$5 - 3(n-1) \= \-3n+8\$로 전개하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-115, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "첫째항과 공차가 직접 주어져 일반항 공식에 바로 대입하면 된다.", "level": "하", "item4slot": {"given": \["등차수열"\], "goal": \["일반항"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q03  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
\$\\sum\_{k=3}^{10} k^2\$의 값은?  
\#\## 선지  
① \$375\$ ② \$380\$ ③ \$385\$ ④ \$390\$ ⑤ \$395\$  
\#\## 정답  
②  
\#\## 해설  
\$1\$부터 \$10\$까지의 제곱의 합에서 \$k \= 1, 2\$일 때의 합을 빼면  
\$\$\\sum\_{k=3}^{10} k^2 \= \\sum\_{k=1}^{10} k^2 - (1^2 \+ 2^2) \= \\frac{10 \\times 11 \\times 21}{6} - 5 \= 385 - 5 \= 380\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_SUM", "conceptClusterKey": "", "primaryMethod": "\$\\\\sum\_{k=1}^{10} k^2\$에서 앞의 두 항 \$1^2+2^2\$을 빼서 자연수 제곱의 합 공식을 적용한다.", "decisiveStep": "\$\\\\frac{10\\\\cdot 11\\\\cdot 21}{6}-5 \= 385-5 \= 380\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "여러 가지 수열의 합", "l4": "자연수 거듭제곱의 합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SEQUENCE\_SUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-125, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "시작 첨자가 \$3\$인 제곱합을 \$1\$부터의 합으로 보정하는 기본 문항이다.", "level": "하", "item4slot": {"given": \["수열"\], "goal": \["합"\], "method": \["시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q04  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
다음 중 임의의 두 수열 \$\\{a\_n\\}, \\{b\_n\\}\$에 대하여 항상 성립하는 것은? (단, \$p, q\$는 상수이다.)  
\#\## 선지  
① \$\\sum\_{k=1}^n q \= q\$ ② \$\\sum\_{k=1}^n \\frac{a\_k}{b\_k} \= \\frac{\\sum\_{k=1}^n a\_k}{\\sum\_{k=1}^n b\_k}\$ (단, \$b\_k \\ne 0\$, \$\\sum\_{k=1}^n b\_k \\ne 0\$) ③ \$\\sum\_{k=1}^n a\_k b\_k \= \\left(\\sum\_{k=1}^n a\_k\\right)\\left(\\sum\_{k=1}^n b\_k\\right)\$ ④ \$\\sum\_{k=1}^n (a\_k \+ k) \= \\sum\_{k=1}^n a\_k \+ n\$ ⑤ \$\\sum\_{k=1}^n (pa\_k - qb\_k) \= p\\sum\_{k=1}^n a\_k - q\\sum\_{k=1}^n b\_k\$  
\#\## 정답  
⑤  
\#\## 해설  
\$\\sum\$의 선형성에 의해 \$\\sum\_{k=1}^n (pa\_k - qb\_k) \= p\\sum\_{k=1}^n a\_k - q\\sum\_{k=1}^n b\_k\$는 항상 성립한다. (⑤)  
① \$\\sum\_{k=1}^n q \= nq\$이므로 거짓이다.  
②③ 나눗셈과 곱셈은 \$\\sum\$으로 분리할 수 없으므로 거짓이다.  
④ \$\\sum\_{k=1}^n (a\_k \+ k) \= \\sum\_{k=1}^n a\_k \+ \\frac{n(n+1)}{2}\$이므로 거짓이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "합의 기호 \$\\\\sum\$의 선형성이 덧셈·뺄셈·상수배에만 성립함을 판별한다.", "decisiveStep": "상수합 \$nq\$, 곱·몫의 비선형성, \$\\\\sum k\$의 오답을 가려내고 ⑤를 선택하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "합의 기호 Σ", "l4": "성질"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SIGMA\_NOTATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-124, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "\$\\\\sum\$의 기본 성질과 대표적인 오답 유형을 비교 판별하는 문항이다.", "level": "하", "item4slot": {"given": \["수열"\], "goal": \["성질"\], "method": \["시그마"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q05  
- 형식: 객관식  
- 배점: 4.1  
\#\## 발문  
다음 중 제\$2\$항이 \$41\$, 제\$10\$항이 \$-15\$인 등차수열 \$\\{a\_n\\}\$에 대한 설명으로 옳은 것은?  
\#\## 선지  
① 공차는 \$7\$이다. ② 제\$21\$항은 \$-99\$이다. ③ 첫째항부터 제\$15\$항까지의 합 \$S\_{15}\$는 \$-15\$이다. ④ 일반항 \$a\_n\$은 \$a\_n \= \-7n \+ 48\$이다. ⑤ 첫째항부터 제\$n\$항까지의 합 \$S\_n\$은 \$\\frac{n(100 - 7n)}{2}\$이다.  
\#\## 정답  
③  
\#\## 해설  
공차를 \$d\$라 하면 \$a\_{10} - a\_2 \= 8d \= \-15 - 41 \= \-56 \\implies d \= \-7\$이다. (① 거짓)  
\$a\_1 \= a\_2 - d \= 41 - (-7) \= 48\$이므로 일반항은 \$a\_n \= 48 - 7(n - 1\) \= \-7n \+ 55\$이다. (④ 거짓)  
\$a\_{21} \= \-7(21) \+ 55 \= \-92\$이다. (② 거짓)  
\$a\_{15} \= \-7(15) \+ 55 \= \-50\$이므로 \$S\_{15} \= \\frac{15(48 - 50)}{2} \= \-15\$이다. (③ 참)  
\$S\_n \= \\frac{n(48 \+ 55 - 7n)}{2} \= \\frac{n(103 - 7n)}{2}\$이다. (⑤ 거짓)  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "두 항으로 공차 \$d=-7\$과 첫째항 \$a\_1=48\$을 구한 뒤 일반항과 부분합으로 각 선지를 검증한다.", "decisiveStep": "\$S\_{15} \= \\\\frac{15(48-50)}{2} \= \-15\$가 참임을 확인하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-117, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "공차·일반항·특정 항·부분합을 모두 직접 계산해 옳은 선지를 골라야 한다.", "level": "중하", "item4slot": {"given": \["등차수열"\], "goal": \["성질"\], "method": \["일반항", "수열의합"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q06  
- 형식: 객관식  
- 배점: 4.1  
\#\## 발문  
\$\\sum\_{k=1}^8 (k \+ 1)^3 - 3\\sum\_{k=1}^8 k(k \+ 1\) - 7\$의 값은?  
\#\## 선지  
① \$1295\$ ② \$1297\$ ③ \$1299\$ ④ \$1301\$ ⑤ \$1303\$  
\#\## 정답  
②  
\#\## 해설  
합의 범위가 \$k \= 1\$부터 \$8\$까지로 같으므로 하나의 \$\\sum\$로 합쳐 정리한다.  
\$\$(k \+ 1)^3 - 3k(k \+ 1\) \= (k^3 \+ 3k^2 \+ 3k \+ 1\) - (3k^2 \+ 3k) \= k^3 \+ 1\$\$  
따라서 구하는 값은  
\$\$\\sum\_{k=1}^8 (k^3 \+ 1\) - 7 \= \\left(\\frac{8 \\times 9}{2}\\right)^2 \+ 8 - 7 \= 36^2 \+ 1 \= 1296 \+ 1 \= 1297\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_SUM", "conceptClusterKey": "", "primaryMethod": "같은 범위의 두 \$\\\\sum\$을 하나로 묶어 세제곱식을 \$k^3+1\$로 소거한 뒤 세제곱 합 공식을 적용한다.", "decisiveStep": "\$(k+1)^3-3k(k+1)=k^3+1\$로 단순화해 \$36^2+1\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "여러 가지 수열의 합", "l4": "자연수 거듭제곱의 합"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SEQUENCE\_SUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-125, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "곱셈공식 소거로 \$\\\\sum k^3\$ 꼴을 만든 뒤 세제곱 합 공식을 적용해야 한다.", "level": "중하", "item4slot": {"given": \["수열"\], "goal": \["합"\], "method": \["시그마", "곱셈공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q07  
- 형식: 객관식  
- 배점: 4.4  
\#\## 발문  
삼각형 \$ABC\$에 대하여 \$\\overline{AC}\\cos C \+ \\overline{AB}\\cos B \= \\overline{AB}\$를 만족시키는 삼각형 \$ABC\$에 대한 설명으로 옳은 것은?  
\#\## 선지  
① \$\\overline{BC} \= \\overline{AB}\$인 이등변삼각형 ② \$\\triangle ABC\$는 정삼각형 ③ \$\\angle A \= 90^\\circ\$인 직각삼각형 ④ \$\\angle B \= 90^\\circ\$인 직각삼각형 ⑤ \$\\overline{AB} \= \\overline{AC}\$인 이등변삼각형  
\#\## 정답  
①  
\#\## 해설  
세 변의 길이를 \$a \= \\overline{BC}\$, \$b \= \\overline{CA}\$, \$c \= \\overline{AB}\$라 하면 주어진 조건은 \$b\\cos C \+ c\\cos B \= c\$이다.  
코사인법칙 \$\\cos C \= \\frac{a^2 \+ b^2 - c^2}{2ab}\$, \$\\cos B \= \\frac{a^2 \+ c^2 - b^2}{2ac}\$를 대입하면  
\$\$b \\cdot \\frac{a^2 \+ b^2 - c^2}{2ab} \+ c \\cdot \\frac{a^2 \+ c^2 - b^2}{2ac} \= \\frac{a^2 \+ b^2 - c^2 \+ a^2 \+ c^2 - b^2}{2a} \= \\frac{2a^2}{2a} \= a\$\$  
따라서 \$a \= c\$, 즉 \$\\overline{BC} \= \\overline{AB}\$인 이등변삼각형이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "코사인법칙으로 \$\\\\cos B, \\\\cos C\$를 변의 길이로 치환해 좌변을 \$a\$로 정리한다.", "decisiveStep": "\$b\\\\cos C \+ c\\\\cos B \= a\$임을 유도해 \$a \= c\$를 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "삼각형 판정"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-112, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "코사인법칙 대입 후 분자 소거를 통해 삼각형의 변 관계를 판정하는 문항이다.", "level": "중하", "item4slot": {"given": \["삼각형", "등식"\], "goal": \["삼각형"\], "method": \["코사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q08  
- 형식: 객관식  
- 배점: 4.4  
\#\## 발문  
세 모서리의 길이가 \$l, m, n\$인 직육면체에서 \$l, m, n\$이 이 순서대로 등비수열을 이룬다. 이 직육면체의 부피가 \$64\$이고 겉넓이가 \$168\$일 때, 모든 모서리의 길이의 합은?  
\#\## 선지  
① \$76\$ ② \$80\$ ③ \$84\$ ④ \$88\$ ⑤ \$92\$  
\#\## 정답  
③  
\#\## 해설  
\$l, m, n\$이 등비수열을 이루므로 \$m^2 \= ln\$이다.  
부피 조건 \$lmn \= m^3 \= 64\$에서 \$m \= 4\$이고 \$ln \= 16\$이다.  
겉넓이 조건 \$2(lm \+ mn \+ nl) \= 168\$에서 \$lm \+ mn \+ nl \= 84\$이므로  
\$\$4(l \+ n) \+ 16 \= 84 \\implies 4(l \+ n) \= 68 \\implies l \+ n \= 17\$\$  
따라서 모든 모서리의 길이의 합은 \$4(l \+ m \+ n) \= 4(17 \+ 4\) \= 84\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "등비중항 \$m^2=ln\$을 부피와 겉넓이 식에 대입해 \$m\$과 \$l+n\$을 구한다.", "decisiveStep": "\$m^3=64\$에서 \$m=4, ln=16\$을 얻어 \$l+n=17\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "중항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-119, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "등비중항과 직육면체의 부피·겉넓이 연립식을 결합해 대칭식을 구한다.", "level": "중하", "item4slot": {"given": \["직육면체", "등비수열"\], "goal": \["합"\], "method": \["등비중항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q09  
- 형식: 객관식  
- 배점: 4.4  
\#\## 발문  
첫째항이 \$5\$인 등차수열 \$\\{a\_n\\}\$에 대하여 수열 \$\\{b\_n\\}\$을 \$b\_n \= a\_n \+ a\_{n+1}\$ (\$n \= 1, 2, 3, \\cdots\$)이라 하자. \$b\_8 \= 100\$일 때, \$a\_8\$의 값은?  
\#\## 선지  
① \$41\$ ② \$43\$ ③ \$45\$ ④ \$49\$ ⑤ \$47\$  
\#\## 정답  
⑤  
\#\## 해설  
등차수열 \$\\{a\_n\\}\$의 공차를 \$d\$라 하면 \$a\_n \= 5 \+ (n - 1)d\$이다.  
\$b\_8 \= a\_8 \+ a\_9 \= (5 \+ 7d) \+ (5 \+ 8d) \= 10 \+ 15d \= 100\$이므로 \$15d \= 90 \\implies d \= 6\$이다.  
따라서 \$a\_8 \= 5 \+ 7 \\times 6 \= 47\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "이웃한 두 항의 합 \$b\_8 \= a\_8 \+ a\_9\$를 공차 \$d\$의 일차방정식으로 풀어 \$d\$를 구한다.", "decisiveStep": "\$10+15d=100\$에서 \$d=6\$을 구해 \$a\_8=47\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등차수열", "l4": "일반항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_ARITHMETIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-115, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "새로 정의된 수열 \$b\_n\$을 일반항으로 펼쳐 공차를 구하면 바로 풀린다.", "level": "중하", "item4slot": {"given": \["등차수열"\], "goal": \["값"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q10  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
수열 \$\\{c\_n\\}\$에 대하여 \$\\sum\_{k=1}^{25} c\_{2k-1} \= 21\$, \$\\sum\_{k=1}^{25} c\_{2k} \= 15\$일 때, \$\\sum\_{k=1}^{50} \\cos(k\\pi)c\_k\$의 값은?  
\#\## 선지  
① \$-36\$ ② \$-15\$ ③ \$-3\$ ④ \$-6\$ ⑤ \$6\$  
\#\## 정답  
④  
\#\## 해설  
정수 \$k\$에 대하여 \$\\cos(k\\pi) \= (-1)^k\$이므로 홀수 항에는 \$-1\$, 짝수 항에는 \$+1\$이 곱해진다.  
\$\$\\sum\_{k=1}^{50} \\cos(k\\pi)c\_k \= \-\\sum\_{j=1}^{25} c\_{2j-1} \+ \\sum\_{j=1}^{25} c\_{2j} \= \-21 \+ 15 \= \-6\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "\$\\\\cos(k\\\\pi)=(-1)^k\$임을 이용해 홀수 번째 항의 합과 짝수 번째 항의 합으로 분리한다.", "decisiveStep": "\$-\\\\sum c\_{2j-1} \+ \\\\sum c\_{2j} \= \-21+15\$로 분리 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "합의 기호 Σ", "l4": "성질"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SIGMA\_NOTATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-124, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각함수의 주기적 부호 \$\\\\cos(k\\\\pi)=(-1)^k\$를 홀짝 부분합으로 연결하는 문항이다.", "level": "중하", "item4slot": {"given": \["수열", "삼각함수"\], "goal": \["값"\], "method": \["시그마", "부호"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q11  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합 \$S\_n\$이 \$S\_n \= 3n^2 \+ 2n\$일 때, \$\\sum\_{k=1}^{10} \\frac{1}{a\_k a\_{k+1}}\$의 값은?  
\#\## 선지  
① \$\\frac{2}{65}\$ ② \$\\frac{4}{65}\$ ③ \$\\frac{6}{65}\$ ④ \$\\frac{8}{65}\$ ⑤ \$\\frac{12}{65}\$  
\#\## 정답  
①  
\#\## 해설  
\$a\_1 \= S\_1 \= 3 \+ 2 \= 5\$이고, \$n \\ge 2\$일 때 \$a\_n \= S\_n - S\_{n-1} \= (3n^2 \+ 2n) - \\{3(n-1)^2 \+ 2(n-1)\\} \= 6n - 1\$이다.  
\$n \= 1\$일 때도 \$6(1) - 1 \= 5 \= a\_1\$이므로 모든 자연수 \$n\$에 대해 \$a\_n \= 6n - 1\$이다.  
부분분수 분해에 의해 \$\\frac{1}{(6k-1)(6k+5)} \= \\frac{1}{6}\\left(\\frac{1}{6k-1} - \\frac{1}{6k+5}\\right)\$이므로  
\$\$\\sum\_{k=1}^{10} \\frac{1}{a\_k a\_{k+1}} \= \\frac{1}{6}\\left(\\frac{1}{5} - \\frac{1}{65}\\right) \= \\frac{1}{6} \\times \\frac{12}{65} \= \\frac{2}{65}\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-07", "subUnitKey": "H22-A-07-SEQUENCE\_SUM", "conceptClusterKey": "", "primaryMethod": "\$S\_n-S\_{n-1}\$로 일반항 \$a\_n=6n-1\$을 구한 뒤 부분분수 망원급수로 합산한다.", "decisiveStep": "\$a\_k=6k-1\$을 구해 \$\\\\frac{1}{6}(\\\\frac{1}{5}-\\\\frac{1}{65})\$을 계산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수열의 합", "l3": "여러 가지 수열의 합", "l4": "부분분수·망원급수형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_07\_SEQUENCE\_SUM", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-126, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "합 \$S\_n\$에서 일반항을 구하는 과정과 부분분수 소거를 연속 적용해야 한다.", "level": "중", "item4slot": {"given": \["수열", "합"\], "goal": \["합"\], "method": \["일반항", "부분분수"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q12  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
삼각형 \$ABC\$의 외접원의 반지름의 길이가 \$6\$이고, \$(\\angle A \+ \\angle B) : (\\angle A \+ \\angle C) : (\\angle B \+ \\angle C) \= 4 : 5 : 3\$일 때, 선분 \$BC\$의 길이는?  
\#\## 선지  
① \$6\$ ② \$12\$ ③ \$6\\sqrt{2}\$ ④ \$6\\sqrt{3}\$ ⑤ \$9\$  
\#\## 정답  
②  
\#\## 해설  
\$A \+ B \= 4t\$, \$A \+ C \= 5t\$, \$B \+ C \= 3t\$ (\$t \> 0\$)라 하면 세 식을 더하여  
\$\$2(A \+ B \+ C) \= 12t \\implies 2\\pi \= 12t \\implies t \= \\frac{\\pi}{6}\$\$  
앞 두 식을 더하고 셋째 식을 빼면 \$2A \= (4 \+ 5 - 3)t \= 6t \\implies A \= 3t \= \\frac{\\pi}{2}\$이다.  
외접원 반지름 \$R \= 6\$이므로 사인법칙에 의해 \$\\overline{BC} \= 2R\\sin\\frac{\\pi}{2} \= 12\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "내각 두 개씩의 합의 비로 각 \$A\$의 크기를 구한 뒤 사인법칙으로 대변 \$\\\\overline{BC}\$를 계산한다.", "decisiveStep": "\$2A \= 6t\$에서 \$A \= \\\\frac{\\\\pi}{2}\$를 구해 \$\\\\overline{BC}=2R=12\$를 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_SINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-110, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "내각 합 비례식의 순환 연립과 사인법칙을 결합한 문항이다.", "level": "중하", "item4slot": {"given": \["삼각형", "비율", "원"\], "goal": \["길이"\], "method": \["연립방정식", "사인법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q13  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
삼각형 \$ABC\$의 넓이가 \$24\\sqrt{6}\$이고 \$\\sin A : \\sin B : \\sin C \= 5 : 6 : 7\$일 때, 삼각형 \$ABC\$의 둘레의 길이는?  
\#\## 선지  
① \$18\$ ② \$24\$ ③ \$27\$ ④ \$30\$ ⑤ \$36\$  
\#\## 정답  
⑤  
\#\## 해설  
사인법칙에 의해 \$a : b : c \= 5 : 6 : 7\$이므로 \$a \= 5t, b \= 6t, c \= 7t\$ (\$t \> 0\$)라 하자.  
코사인법칙으로 \$\\cos C\$를 구하면  
\$\$\\cos C \= \\frac{(5t)^2 \+ (6t)^2 - (7t)^2}{2(5t)(6t)} \= \\frac{25 \+ 36 - 49}{60} \= \\frac{12}{60} \= \\frac{1}{5}\$\$  
\$0 \< C \< \\pi\$이므로 \$\\sin C \= \\sqrt{1 - \\frac{1}{25}} \= \\frac{2\\sqrt{6}}{5}\$이다.  
넓이 조건에서 \$S \= \\frac{1}{2}(5t)(6t) \\cdot \\frac{2\\sqrt{6}}{5} \= 6\\sqrt{6}t^2 \= 24\\sqrt{6} \\implies t^2 \= 4 \\implies t \= 2\$이다.  
따라서 둘레의 길이는 \$(5 \+ 6 \+ 7\) \\times 2 \= 36\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "사인 비를 세 변의 비로 바꾸고 코사인법칙과 넓이 공식으로 비례상수 \$t\$를 구한다.", "decisiveStep": "\$\\\\cos C \= \\\\frac{1}{5}\$에서 \$\\\\sin C \= \\\\frac{2\\\\sqrt{6}}{5}\$를 얻어 \$6\\\\sqrt{6}t^2=24\\\\sqrt{6}\$을 푸는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사인법칙·코사인법칙·삼각형 넓이 공식을 모두 순차 적용해야 둘레가 구해진다.", "level": "중", "item4slot": {"given": \["삼각형", "넓이", "비율"\], "goal": \["길이"\], "method": \["사인법칙", "코사인법칙", "삼각형넓이공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q14  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
두 함수 \$y \= 3\\sqrt{x}\$, \$y \= \\sqrt{x}\$의 그래프와 직선 \$x \= k\$ (\$k \> 0\$)가 만나는 점을 각각 \$A, B\$라 하고, 직선 \$x \= k\$가 \$x\$축과 만나는 점을 \$C\$라 하자. \$\\overline{BC}, \\overline{OC}, \\overline{AC}\$가 이 순서대로 등비수열을 이룰 때, 양수 \$k\$의 값은? (단, \$O\$는 원점이다.)  
\#\## 선지  
① \$3\$ ② \$2\$ ③ \$\\frac{5}{2}\$ ④ \$\\frac{7}{2}\$ ⑤ \$4\$  
\#\## 정답  
①  
\#\## 해설  
\$A(k, 3\\sqrt{k})\$, \$B(k, \\sqrt{k})\$, \$C(k, 0)\$이므로 \$\\overline{BC} \= \\sqrt{k}\$, \$\\overline{OC} \= k\$, \$\\overline{AC} \= 3\\sqrt{k}\$이다.  
세 길이가 이 순서대로 등비수열을 이루므로  
\$\$\\overline{OC}^2 \= \\overline{BC} \\cdot \\overline{AC} \\implies k^2 \= \\sqrt{k} \\cdot 3\\sqrt{k} \= 3k\$\$  
\$k \> 0\$이므로 \$k \= 3\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_BASIC", "conceptClusterKey": "", "primaryMethod": "직선 \$x=k\$ 위 세 선분 길이를 \$k\$로 나타낸 뒤 등비중항 관계식에 대입한다.", "decisiveStep": "\$k^2 \= \\\\sqrt{k} \\\\cdot 3\\\\sqrt{k} \= 3k\$에서 \$k=3\$을 구하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "등비수열", "l4": "중항"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_GEOMETRIC\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-119, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "무리함수 교점 좌표를 길이로 환산해 등비중항 방정식을 풀면 된다.", "level": "중하", "item4slot": {"given": \["무리함수", "직선"\], "goal": \["값"\], "method": \["등비중항"\], "condition": \["양수"\]}, "hold": ""}  
\`\`\`

\## Q15  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합을 \$S\_n\$이라 할 때, 모든 자연수 \$n\$에 대하여 \$2S\_n \= (n \+ 2)a\_{n+1}\$이 성립한다. \$a\_1 \= 6\$일 때, \$a\_{10}\$의 값은?  
\#\## 선지  
① \$8\$ ② \$9\$ ③ \$10\$ ④ \$12\$ ⑤ \$15\$  
\#\## 정답  
④  
\#\## 해설  
\$n \= 1\$일 때 \$2S\_1 \= 3a\_2 \\implies 12 \= 3a\_2 \\implies a\_2 \= 4\$이다.  
\$n \\ge 2\$일 때 \$2S\_n - 2S\_{n-1} \= (n \+ 2)a\_{n+1} - (n \+ 1)a\_n\$이므로  
\$\$2a\_n \= (n \+ 2)a\_{n+1} - (n \+ 1)a\_n \\implies (n \+ 3)a\_n \= (n \+ 2)a\_{n+1} \\implies a\_{n+1} \= \\frac{n \+ 3}{n \+ 2}a\_n\$\$  
\$n \= 2\$부터 \$9\$까지 변변 곱하여 약분하면  
\$\$a\_{10} \= a\_2 \\cdot \\frac{5}{4} \\cdot \\frac{6}{5} \\cdots \\frac{12}{11} \= 4 \\cdot \\frac{12}{4} \= 12\$\$  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "\$2S\_n - 2S\_{n-1} \= 2a\_n\$으로 이웃 두 항의 비 점화식을 유도한 뒤 축차곱셈으로 \$a\_{10}\$을 구한다.", "decisiveStep": "\$a\_{n+1} \= \\\\frac{n+3}{n+2}a\_n\$ (\$n\\\\ge 2\$)을 도출해 \$a\_2=4\$부터 망원 약분하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수열의 귀납적 정의", "l4": "관계 추론"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_RECURSIVE\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-130, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "\$S\_n\$과 \$a\_{n+1}\$의 관계식에서 \$n\\\\ge 2\$ 점화식을 끌어내고 \$a\_2\$부터 축차곱해야 한다.", "level": "중", "item4slot": {"given": \["수열", "합"\], "goal": \["값"\], "method": \["일반항", "수열"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q16  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
\$\\overline{AB} \= 3\\sqrt{34}\$, \$\\overline{AC} \= \\overline{BC} \= 17\$인 삼각형 \$ABC\$에 대하여 선분 \$BC\$를 지름으로 하는 반원이 선분 \$AC\$와 만나는 점 중 \$C\$가 아닌 점을 \$D\$라 하자. 반원의 호 \$CD\$ (중심각이 \$\\pi\$보다 작은 호) 위의 점 \$E\$를 \$\\overline{DE} \= \\overline{CE}\$가 되도록 잡을 때, 삼각형 \$EDC\$의 넓이는?  
\#\## 선지  
① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$  
\#\## 정답  
③  
\#\## 해설  
\$\\triangle ABC\$에서 코사인법칙에 의해  
\$\$\\cos C \= \\frac{17^2 \+ 17^2 - (3\\sqrt{34})^2}{2 \\cdot 17 \\cdot 17} \= \\frac{578 - 306}{578} \= \\frac{272}{578} \= \\frac{8}{17}\$\$  
\$BC\$가 지름이므로 \$\\angle BDC \= 90^\\circ\$이고 직각삼각형 \$BCD\$에서 \$\\overline{CD} \= \\overline{BC}\\cos C \= 17 \\cdot \\frac{8}{17} \= 8\$이다.  
반원의 중심을 \$O\$, 현 \$CD\$의 중점을 \$H\$라 하면 \$\\overline{OC} \= \\frac{17}{2}\$, \$\\overline{HC} \= 4\$이고 \$OH \\perp CD\$이므로  
\$\$\\overline{OH} \= \\sqrt{\\left(\\frac{17}{2}\\right)^2 - 4^2} \= \\sqrt{\\frac{289 - 64}{4}} \= \\frac{15}{2}\$\$  
\$\\overline{DE} \= \\overline{CE}\$이므로 \$E\$는 \$CD\$의 수직이등분선과 호 \$CD\$의 교점이며 높이 \$\\overline{EH} \= \\overline{OE} - \\overline{OH} \= \\frac{17}{2} - \\frac{15}{2} \= 1\$이다.  
따라서 삼각형 \$EDC\$의 넓이는 \$\\frac{1}{2} \\times 8 \\times 1 \= 4\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "코사인법칙으로 \$\\\\cos C\$와 현 \$\\\\overline{CD}\$를 구한 뒤 원의 중심에서 현까지 거리 \$\\\\overline{OH}\$로 삼각형 높이를 구한다.", "decisiveStep": "\$\\\\overline{CD}=8\$과 \$\\\\overline{OH}=\\\\frac{15}{2}\$를 구해 높이 \$\\\\overline{EH}=\\\\frac{17}{2}-\\\\frac{15}{2}=1\$을 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이등변삼각형 코사인법칙, 지름 원주각 직각삼각형, 현의 수직이등분선 성질을 결합해야 한다.", "level": "상", "item4slot": {"given": \["삼각형", "반원"\], "goal": \["넓이"\], "method": \["코사인법칙", "피타고라스정리"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q17  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
점 \$O\$가 중심이고 반지름의 길이가 \$3\$인 원이 있다. 원 밖의 한 점 \$P\$에서 원에 그은 두 접선의 접점을 각각 \$A, B\$라 하자. \$\\overline{AP} \= 5\$일 때, \$\\overline{AB} \= \\frac{a}{b}\\sqrt{34}\$이다. \$b - a\$의 값은? (단, \$a\$와 \$b\$는 서로소인 자연수이다.)  
\#\## 선지  
① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$  
\#\## 정답  
②  
\#\## 해설  
\$OA \\perp AP\$이므로 직각삼각형 \$OAP\$에서 \$\\overline{OP} \= \\sqrt{3^2 \+ 5^2} \= \\sqrt{34}\$이다.  
현 \$AB\$와 선분 \$OP\$의 교점을 \$M\$이라 하면 \$OP \\perp AB\$이고 \$\\overline{AM} \= \\overline{BM}\$이다.  
직각삼각형 \$OAP\$의 넓이를 두 가지로 표현하면 \$\\frac{1}{2} \\cdot 3 \\cdot 5 \= \\frac{1}{2} \\cdot \\sqrt{34} \\cdot \\overline{AM}\$이므로 \$\\overline{AM} \= \\frac{15}{\\sqrt{34}}\$이다.  
따라서 \$\\overline{AB} \= 2\\overline{AM} \= \\frac{30}{\\sqrt{34}} \= \\frac{15\\sqrt{34}}{17}\$이므로 \$a \= 15\$, \$b \= 17\$이고 \$b - a \= 2\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "접선 직각삼각형 \$OAP\$에서 \$\\\\overline{OP}\$를 구하고 넓이(또는 닮음)로 수선 \$\\\\overline{AM}\$을 구해 \$2\$배한다.", "decisiveStep": "\$\\\\overline{AM} \= \\\\frac{3\\\\cdot 5}{\\\\sqrt{34}}\$에서 \$\\\\overline{AB} \= \\\\frac{15\\\\sqrt{34}}{17}\$을 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "삼각형의 넓이", "l4": "복합도형"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_TRIANGLE\_AREA", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-114, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "접선의 직각성과 직각삼각형 높이 공식을 이용해 현의 길이를 구하는 문항이다.", "level": "중", "item4slot": {"given": \["원", "접선"\], "goal": \["값"\], "method": \["피타고라스정리", "삼각형넓이공식"\], "condition": \["서로소"\]}, "hold": ""}  
\`\`\`

\## Q18  
- 형식: 객관식  
- 배점: 5.1  
\#\## 발문  
모든 항이 자연수인 수열 \$\\{a\_n\\}\$에 대하여 다음 조건을 모두 만족시키는 \$a\_1\$의 값의 합은?

(가) \$a\_5 \= 6\$  
(나) \$1 \< a\_1 \< 20\$  
(다) 모든 자연수 \$n\$에 대하여 \$a\_{n+1} \= \\begin{cases} a\_n \+ 1 & (a\_n\\text{이 }3\\text{의 배수가 아닌 경우}) \\\\ \\frac{1}{3}a\_n \+ 2 & (a\_n\\text{이 }3\\text{의 배수인 경우}) \\end{cases}\$가 성립한다.  
\#\## 선지  
① \$35\$ ② \$37\$ ③ \$42\$ ④ \$47\$ ⑤ \$54\$  
\#\## 정답  
③  
\#\## 해설  
\$a\_{n+1} \= z\$로부터 앞 항 \$a\_n \= y\$를 역산하는 규칙은 다음과 같다.  
- \$y \= z - 1\$ (단, \$y\$는 \$3\$의 배수가 아닌 자연수)  
- \$y \= 3(z - 2)\$ (단, \$z \\ge 3\$이면 \$y\$는 양의 \$3\$의 배수)

\$a\_5 \= 6\$부터 차례로 역추적하면:  
- \$a\_4 \\in \\{5, 12\\}\$  
- \$a\_4 \= 5 \\implies a\_3 \\in \\{4, 9\\}\$, \$a\_4 \= 12 \\implies a\_3 \\in \\{11, 30\\}\$이므로 \$a\_3 \\in \\{4, 9, 11, 30\\}\$  
- \$a\_3 \= 4 \\implies a\_2 \\in \\{6\\}\$ (\$3\$은 \$3\$의 배수라 제외), \$a\_3 \= 9 \\implies a\_2 \\in \\{8, 21\\}\$, \$a\_3 \= 11 \\implies a\_2 \\in \\{10, 27\\}\$, \$a\_3 \= 30 \\implies a\_2 \\in \\{29, 84\\}\$  
- \$a\_2 \= 6 \\implies a\_1 \\in \\{5, 12\\}\$; \$a\_2 \= 8 \\implies a\_1 \\in \\{7, 18\\}\$; \$a\_2 \= 21 \\implies \\{20, 57\\}\$; \$a\_2 \= 10 \\implies \\{24\\}\$ (\$9\$ 제외); \$a\_2 \\ge 27 \\implies a\_1 \\ge 26\$  
이 중 \$1 \< a\_1 \< 20\$을 만족하는 값은 \$5, 7, 12, 18\$이므로 합은 \$5 \+ 7 \+ 12 \+ 18 \= 42\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "\$a\_5=6\$부터 두 역산 분기(\$y=z-1\$ 단 \$3\\\\nmid y\$, \$y=3(z-2)\$)로 수형도를 거슬러 올라간다.", "decisiveStep": "\$a\_3=4\$에서 \$3\$을, \$a\_2=10\$에서 \$9\$를 배제 조건으로 걸러내고 범위 안의 \$5, 7, 12, 18\$을 합산하는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수열의 귀납적 정의", "l4": "관계 추론"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_RECURSIVE\_SEQUENCE", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-130, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분기 점화식의 역추적 과정에서 \$3\$의 배수 조건 위배 후보를 매 단계 정확히 걸러내야 한다.", "level": "상", "item4slot": {"given": \["수열", "부등식"\], "goal": \["합"\], "method": \["수열", "배수"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q19  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
\[서술형 문제 1\] 두 직선 \$y \= 3x\$와 \$y \= \-2x\$가 이루는 각의 크기를 \$\\theta\$ (\$90^\\circ \< \\theta \< 180^\\circ\$)라 할 때, \$\\theta\$의 값을 풀이과정과 함께 서술하시오.  
\#\## 선지  
없음  
\#\## 정답  
\$135^\\circ\$  
\#\## 해설  
원점 \$O(0, 0)\$과 두 직선 위의 점 \$P(1, 3)\$, \$Q(1, \-2)\$를 잡으면 \$\\angle POQ \= \\theta\$이다.  
두 점 사이의 거리 공식에 의해  
\$\$\\overline{OP} \= \\sqrt{1^2 \+ 3^2} \= \\sqrt{10}, \\qquad \\overline{OQ} \= \\sqrt{1^2 \+ (-2)^2} \= \\sqrt{5}, \\qquad \\overline{PQ} \= 3 - (-2) \= 5\$\$  
삼각형 \$OPQ\$에 코사인법칙을 적용하면  
\$\$\\cos\\theta \= \\frac{10 \+ 5 - 25}{2\\sqrt{10}\\sqrt{5}} \= \\frac{-10}{10\\sqrt{2}} \= \-\\frac{\\sqrt{2}}{2}\$\$  
\$90^\\circ \< \\theta \< 180^\\circ\$이므로 \$\\theta \= 135^\\circ\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "CONDITION", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-05", "subUnitKey": "H22-A-05-CORE", "conceptClusterKey": "", "primaryMethod": "두 직선 위 \$x=1\$인 점 \$P, Q\$를 잡아 삼각형 \$OPQ\$에 코사인법칙을 적용한다.", "decisiveStep": "\$\\\\cos\\\\theta \= \\\\frac{10+5-25}{2\\\\sqrt{50}} \= \-\\\\frac{\\\\sqrt{2}}{2}\$에서 \$\\\\theta \= 135^\\\\circ\$를 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수의 활용", "l3": "코사인법칙", "l4": "변·각 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_05\_COSINE\_LAW", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-111, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "직선 위의 점을 좌표로 잡아 코사인법칙으로 사잇각을 구하는 서술형 문항이다.", "level": "중하", "item4slot": {"given": \["직선", "각"\], "goal": \["값"\], "method": \["코사인법칙"\], "condition": \["구간"\]}, "hold": ""}  
\`\`\`

\## Q20  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
\[서술형 문제 2\] 등비수열 \$\\{a\_n\\}\$의 첫째항부터 제\$n\$항까지의 합 \$S\_n\$이 \$S\_n \= 2 \\times 3^{n+1} \+ k\$이고, 제\$5\$항 \$a\_5\$의 값을 \$l\$이라 할 때, \$k \+ l\$의 값을 풀이과정과 함께 서술하시오. (단, \$k\$는 상수이다.)  
\#\## 선지  
없음  
\#\## 정답  
\$966\$  
\#\## 해설  
\$a\_1 \= S\_1 \= 2 \\cdot 3^2 \+ k \= 18 \+ k\$이다.  
\$a\_2 \= S\_2 - S\_1 \= (54 \+ k) - (18 \+ k) \= 36\$, \$a\_3 \= S\_3 - S\_2 \= (162 \+ k) - (54 \+ k) \= 108\$이다.  
등비수열의 공비 \$r \= \\frac{a\_3}{a\_2} \= \\frac{108}{36} \= 3\$이므로 \$a\_2 \= 3a\_1\$에서  
\$\$36 \= 3(18 \+ k) \\implies 12 \= 18 \+ k \\implies k \= \-6\$\$  
따라서 \$a\_1 \= 12\$이고 \$l \= a\_5 \= 12 \\times 3^4 \= 12 \\times 81 \= 972\$이므로 \$k \+ l \= \-6 \+ 972 \= 966\$이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-06", "subUnitKey": "H22-A-06-SEQUENCE\_APPLICATION", "conceptClusterKey": "", "primaryMethod": "\$a\_2=S\_2-S\_1, a\_3=S\_3-S\_2\$로 공비를 구한 뒤 \$a\_2=r a\_1\$으로 상수 \$k\$를 결정한다.", "decisiveStep": "\$r=3\$을 구해 \$36=3(18+k)\$에서 \$k=-6\$을 얻는 단계", "rpm": {"majorUnit": "수열", "midUnit": "등차수열과 등비수열", "l3": "수열의 활용", "l4": "조건으로 수열 결정"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_06\_SEQUENCE\_APPLICATION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-121, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수형 합 \$S\_n\$이 첫째항부터 등비수열을 이룰 조건으로 \$k\$를 구하고 \$a\_5\$를 계산한다.", "level": "중하", "item4slot": {"given": \["등비수열", "합"\], "goal": \["합"\], "method": \["일반항"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q21  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
\[서술형 문제 3\] 수열 \$\\{a\_n\\}\$을 \$a\_n \= 5^n - 1\$ (\$n \= 1, 2, 3, \\cdots\$)로 정의하자. 모든 자연수 \$n\$에 대하여 \$a\_n\$이 \$4\$의 배수임을 수학적 귀납법으로 증명하시오.  
\#\## 선지  
없음  
\#\## 정답  
모든 자연수 \$n\$에 대하여 \$5^n - 1\$은 \$4\$의 배수이다.  
\#\## 해설  
명제 \$P(n)\$을 ‘\$5^n - 1\$은 \$4\$의 배수이다’라 하자.  
(ⅰ) \$n \= 1\$일 때, \$a\_1 \= 5^1 - 1 \= 4\$이므로 \$4\$의 배수이다. 따라서 \$P(1)\$은 성립한다.

(ⅱ) \$n \= k\$일 때 \$P(k)\$가 성립한다고 가정하면, 어떤 정수 \$m\$에 대하여 \$5^k - 1 \= 4m\$이다.  
\$n \= k \+ 1\$일 때,  
\$\$a\_{k+1} \= 5^{k+1} - 1 \= 5 \\cdot 5^k - 1 \= 5(5^k - 1\) \+ 4 \= 5(4m) \+ 4 \= 4(5m \+ 1)\$\$  
\$5m \+ 1\$은 정수이므로 \$a\_{k+1}\$은 \$4\$의 배수이고 \$P(k \+ 1)\$도 성립한다.

(ⅰ), (ⅱ)에 의하여 모든 자연수 \$n\$에 대하여 \$a\_n \= 5^n - 1\$은 \$4\$의 배수이다.  
\`\`\`json:plan  
"NONE"  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-AL", "curriculum": "2022", "standardUnitKey": "H22-A-08", "subUnitKey": "H22-A-08-CORE", "conceptClusterKey": "", "primaryMethod": "\$n=1\$을 확인하고 \$5^k-1=4m\$ 가정을 \$5^{k+1}-1=5(5^k-1)+4\$에 대입해 배수성을 증명한다.", "decisiveStep": "\$5^{k+1}-1 \= 5(5^k-1)+4\$로 분리해 인수 \$4\$를 묶어내는 단계", "rpm": {"majorUnit": "수열", "midUnit": "수학적 귀납법", "l3": "수학적 귀납법", "l4": "부등식·나눗셈 증명"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_08\_MATHEMATICAL\_INDUCTION", "templateKey": null, "why": "high2-math1-algebra.json (H2-M1-RPM-132, DIRECT\_ACTIVE)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "수학적 귀납법으로 거듭제곱식의 배수 성질을 증명하는 표준 서술형 문항이다.", "level": "중하", "item4slot": {"given": \["수열", "자연수"\], "goal": \["증명"\], "method": \["수학적귀납법"\], "condition": \["배수"\]}, "hold": ""}  
\`\`\`  
