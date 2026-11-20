\`\`\`json:exam  
{"stem": "24\_순천고\_1학기\_중간\_고2\_수학I\_유사", "sourceArchiveFile": "original/high/h2/1mid/24\_순천고\_1학기\_중간\_고2\_수학I.js", "examFolder": "1mid", "grade": "고2", "subject": "수학I", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-19"}  
\`\`\`

\## Q01  
- 형식: 객관식  
- 배점: 3.4  
\#\## 발문  
다음 중 옳지 않은 것을 고르시오. \[3.4점\]  
\#\## 선지  
① \$\\sqrt\[3\]{(-4)^3} \+ \\sqrt\[6\]{(-5)^6} \= \-1\$ ② \$3^3 \\times 9^{\\frac{3}{2}} \= 729\$ ③ \$\\left(\\sqrt{3}^{1 \+ \\sqrt{3}}\\right)^{1 - \\sqrt{3}} \= \\dfrac{1}{3}\$ ④ \$\\sqrt{\\sqrt\[4\]{16}} \= 2^{\\frac{1}{2}}\$ ⑤ \$(9^{\\frac{1}{3}})^6 \= 81\$  
\#\## 정답  
①  
\#\## 해설  
① \$\\sqrt\[3\]{(-4)^3} \= \-4\$이고 \$\\sqrt\[6\]{(-5)^6} \= \|-5\| \= 5\$이므로 \$\\sqrt\[3\]{(-4)^3} \+ \\sqrt\[6\]{(-5)^6} \= \-4 \+ 5 \= 1 \\neq \-1\$ (거짓)  
② \$3^3 \\times (3^2)^{\\frac{3}{2}} \= 3^3 \\times 3^3 \= 3^6 \= 729\$ (참)  
③ \$(\\sqrt{3})^{(1+\\sqrt{3})(1-\\sqrt{3})} \= (\\sqrt{3})^{-2} \= \\dfrac{1}{3}\$ (참)  
④ \$\\sqrt{\\sqrt\[4\]{2^4}} \= 2^{\\frac{4}{8}} \= 2^{\\frac{1}{2}}\$ (참)  
⑤ \$(9^{\\frac{1}{3}})^6 \= 9^2 \= 81\$ (참)  
따라서 옳지 않은 것은 ①이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-RADICAL\_EVEN\_ODD\_SIGN", "primaryMethod": "홀수 제곱근 ∛((-4)³)=-4와 짝수 제곱근 ⁶√((-5)⁶)=5의 부호 규칙 및 지수법칙을 보기에 적용한다.", "decisiveStep": "짝수 거듭제곱근 ⁶√((-5)⁶) \= \|-5\| \= 5로 양수가 됨을 확인해 ①을 거짓으로 잡는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수법칙", "l4": "지수식 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENT\_LAW\_APPLICATION", "templateKey": "TPL\_EXPONENT\_LAW\_STATEMENT\_AUDIT", "why": "지수법칙과 거듭제곱근 성질의 참·거짓 판별 문항으로 H2-M1-RPM-005(FAMILY\_ACTIVE)에서 TPL\_EXPONENT\_LAW\_STATEMENT\_AUDIT 선택"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "음수의 홀수·짝수 거듭제곱근 부호 구분과 실수 지수법칙을 함께 확인하는 문항이다.", "level": "중", "item4slot": {"given": \["거듭제곱근", "지수"\], "goal": \["판정"\], "method": \["거듭제곱근", "지수법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q02  
- 형식: 객관식  
- 배점: 3.4  
\#\## 발문  
\$a^{2x} \= 5\$일 때, \$\\dfrac{a^{3x} - a^{-3x}}{a^x - a^{-x}}\$의 값은? (단, \$a \> 0\$) \[3.4점\]  
\#\## 선지  
① \$5\$ ② \$\\dfrac{26}{5}\$ ③ \$\\dfrac{28}{5}\$ ④ \$\\dfrac{31}{5}\$ ⑤ \$7\$  
\#\## 정답  
④  
\#\## 해설  
\$t \= a^x\$라 하면 \$t \> 0\$이고 \$t^2 \= a^{2x} \= 5\$이다.  
\$\\dfrac{a^{3x} - a^{-3x}}{a^x - a^{-x}} \= \\dfrac{t^3 - t^{-3}}{t - t^{-1}} \= t^2 \+ 1 \+ t^{-2}\$  
\$t^2 \= 5\$, \$t^{-2} \= \\dfrac{1}{5}\$을 대입하면  
\$5 \+ 1 \+ \\dfrac{1}{5} \= \\dfrac{31}{5}\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-EXP\_CUBIC\_QUOTIENT", "primaryMethod": "a³ˣ-a⁻³ˣ를 (aˣ-a⁻ˣ)(a²ˣ+1+a⁻²ˣ)로 인수분해해 약분한 뒤 a²ˣ=5를 대입한다.", "decisiveStep": "분자를 인수분해해 aˣ-a⁻ˣ를 약분하고 a²ˣ+1+a⁻²ˣ를 얻는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수법칙", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENT\_LAW\_APPLICATION", "templateKey": "TPL\_EXPONENT\_LAW\_RECIPROCAL\_POWER", "why": "주어진 지수 조건식(a^(2x)=5)으로 역수 거듭제곱 분수식 값을 구하는 문항으로 H2-M1-RPM-006(FAMILY\_ACTIVE)에서 TPL\_EXPONENT\_LAW\_RECIPROCAL\_POWER 선택"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수식의 세제곱 차 인수분해 약분 후 a²ˣ 값을 대입하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": \["지수", "유리식"\], "goal": \["값"\], "method": \["인수분해", "대입"\], "condition": \["부호"\]}, "hold": ""}  
\`\`\`

\## Q03  
- 형식: 객관식  
- 배점: 3.4  
\#\## 발문  
다음 각이 나타내는 동경의 위치가 다른 것은? \[3.4점\]  
\#\## 선지  
① \$150^\\circ\$ ② \$-870^\\circ\$ ③ \$510^\\circ\$ ④ \$-210^\\circ\$ ⑤ \$1230^\\circ\$  
\#\## 정답  
②  
\#\## 해설  
각 보기를 \$360^\\circ \\times n \+ \\alpha^\\circ\$ (\$0^\\circ \\le \\alpha^\\circ \< 360^\\circ\$) 꼴로 고치면  
① \$150^\\circ\$  
② \$-870^\\circ \= 360^\\circ \\times (-3) \+ 210^\\circ\$  
③ \$510^\\circ \= 360^\\circ \\times 1 \+ 150^\\circ\$  
④ \$-210^\\circ \= 360^\\circ \\times (-1) \+ 150^\\circ\$  
⑤ \$1230^\\circ \= 360^\\circ \\times 3 \+ 150^\\circ\$  
따라서 동경의 위치가 다른 것은 ②이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-05", "subUnitKey": "H15-M1-05-TRIGONOMETRIC\_DEFINITION", "conceptClusterKey": "H15-M1-05-GENERAL\_ANGLE\_POSITION", "primaryMethod": "다섯 각을 360°×n+α° (0°≤α°\<360°) 꼴로 바꾸어 α°=150°와 다른 하나(210°)를 찾는다.", "decisiveStep": "-870° \= 360°×(-3) \+ 210°로 동경이 210°임을 확인하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "일반각과 호도법", "l4": "일반각"}, "ptTplCandidate": {"problemTypeKey": "PT\_GENERAL\_ANGLE\_DIRECTION", "templateKey": "TPL\_OPPOSITE\_RAYS\_GENERAL\_ANGLE", "why": "일반각의 동경 위치 판별 문항으로 H2-M1-RPM-029(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일반각의 표준형 변환으로 동경이 다른 각을 고르는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["일반각"\], "goal": \["판정"\], "method": \["일반각"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q04  
- 형식: 객관식  
- 배점: 3.2  
\#\## 발문  
\$\\dfrac{3}{2}\\pi \< \\theta \< 2\\pi\$에서 \$\\cos\\theta \= \\dfrac{5}{13}\$일 때, \$\\tan\\theta\$의 값은? \[3.2점\]  
\#\## 선지  
① \$\\dfrac{12}{5}\$ ② \$\\dfrac{12}{13}\$ ③ \$\\dfrac{5}{12}\$ ④ \$-\\dfrac{12}{13}\$ ⑤ \$-\\dfrac{12}{5}\$  
\#\## 정답  
⑤  
\#\## 해설  
\$\\sin^2\\theta \+ \\cos^2\\theta \= 1\$이므로  
\$\\sin^2\\theta \= 1 - \\left(\\dfrac{5}{13}\\right)^2 \= 1 - \\dfrac{25}{169} \= \\dfrac{144}{169}\$  
\$\\dfrac{3}{2}\\pi \< \\theta \< 2\\pi\$는 제\$4\$사분면의 각이므로 \$\\sin\\theta \< 0\$, 즉 \$\\sin\\theta \= \-\\dfrac{12}{13}\$  
따라서 \$\\tan\\theta \= \\dfrac{\\sin\\theta}{\\cos\\theta} \= \\dfrac{-\\frac{12}{13}}{\\frac{5}{13}} \= \-\\dfrac{12}{5}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-05", "subUnitKey": "H15-M1-05-TRIGONOMETRIC\_DEFINITION", "conceptClusterKey": "H15-M1-05-TRIG\_COS\_TO\_TAN\_Q4", "primaryMethod": "제곱 관계로 sin θ=-12/13(제4사분면 부호)을 구한 뒤 sin θ/cos θ로 tan θ를 계산한다.", "decisiveStep": "제4사분면에서 sin θ\<0임을 적용해 \-12/13을 선택하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 뜻", "l4": "삼각함수 값"}, "ptTplCandidate": {"problemTypeKey": "PT\_TRIG\_QUADRANT\_EVALUATION", "templateKey": "TPL\_TRIG\_SIGN\_PYTHAGOREAN\_RATIO", "why": "사분면 부호와 제곱 관계를 이용해 삼각함수 값을 구하는 문항으로 H2-M1-RPM-032(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "제4사분면에서 cos θ로부터 sin θ와 tan θ를 바로 구하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["삼각함수"\], "goal": \["값"\], "method": \["삼각함수의상호관계"\], "condition": \["범위", "부호"\]}, "hold": ""}  
\`\`\`

\## Q05  
- 형식: 객관식  
- 배점: 3.4  
\#\## 발문  
다음 상용로그표를 이용하여 \$\\log 3640 \+ \\log 0.382\$의 값을 구하면? \[3.4점\]

\<table class="exam-table" border="1" style="border-collapse: collapse; text-align: center; margin: 12px auto; font-size: 0.9em;"\>\<thead\>\<tr style="background-color: \#f8f9fa;"\>\<th style="padding: 4px 8px;"\>수\</th\>\<th style="padding: 4px 8px;"\>0\</th\>\<th style="padding: 4px 8px;"\>1\</th\>\<th style="padding: 4px 8px;"\>2\</th\>\<th style="padding: 4px 8px;"\>3\</th\>\<th style="padding: 4px 8px;"\>4\</th\>\<th style="padding: 4px 8px;"\>5\</th\>\</tr\>\</thead\>\<tbody\>\<tr\>\<td style="padding: 4px 8px;"\>\<b\>3.5\</b\>\</td\>\<td style="padding: 4px 8px;"\>.5441\</td\>\<td style="padding: 4px 8px;"\>.5453\</td\>\<td style="padding: 4px 8px;"\>.5465\</td\>\<td style="padding: 4px 8px;"\>.5478\</td\>\<td style="padding: 4px 8px;"\>.5490\</td\>\<td style="padding: 4px 8px;"\>.5502\</td\>\</tr\>\<tr\>\<td style="padding: 4px 8px;"\>\<b\>3.6\</b\>\</td\>\<td style="padding: 4px 8px;"\>.5563\</td\>\<td style="padding: 4px 8px;"\>.5575\</td\>\<td style="padding: 4px 8px;"\>.5587\</td\>\<td style="padding: 4px 8px;"\>.5599\</td\>\<td style="padding: 4px 8px;"\>.5611\</td\>\<td style="padding: 4px 8px;"\>.5623\</td\>\</tr\>\<tr\>\<td style="padding: 4px 8px;"\>\<b\>3.7\</b\>\</td\>\<td style="padding: 4px 8px;"\>.5682\</td\>\<td style="padding: 4px 8px;"\>.5694\</td\>\<td style="padding: 4px 8px;"\>.5705\</td\>\<td style="padding: 4px 8px;"\>.5717\</td\>\<td style="padding: 4px 8px;"\>.5729\</td\>\<td style="padding: 4px 8px;"\>.5740\</td\>\</tr\>\<tr\>\<td style="padding: 4px 8px;"\>\<b\>3.8\</b\>\</td\>\<td style="padding: 4px 8px;"\>.5798\</td\>\<td style="padding: 4px 8px;"\>.5809\</td\>\<td style="padding: 4px 8px;"\>.5821\</td\>\<td style="padding: 4px 8px;"\>.5832\</td\>\<td style="padding: 4px 8px;"\>.5843\</td\>\<td style="padding: 4px 8px;"\>.5855\</td\>\</tr\>\<tr\>\<td style="padding: 4px 8px;"\>\<b\>3.9\</b\>\</td\>\<td style="padding: 4px 8px;"\>.5911\</td\>\<td style="padding: 4px 8px;"\>.5922\</td\>\<td style="padding: 4px 8px;"\>.5933\</td\>\<td style="padding: 4px 8px;"\>.5944\</td\>\<td style="padding: 4px 8px;"\>.5955\</td\>\<td style="padding: 4px 8px;"\>.5966\</td\>\</tr\>\</tbody\>\</table\>  
\#\## 선지  
① \$2.1432\$ ② \$2.5611\$ ③ \$3.1432\$ ④ \$3.5611\$ ⑤ \$4.1432\$  
\#\## 정답  
③  
\#\## 해설  
상용로그표에서 \$\\log 3.64 \= 0.5611\$, \$\\log 3.82 \= 0.5821\$이므로  
\$\\log 3640 \= \\log(3.64 \\times 10^3) \= 3 \+ 0.5611 \= 3.5611\$  
\$\\log 0.382 \= \\log(3.82 \\times 10^{-1}) \= \-1 \+ 0.5821 \= \-0.4179\$  
따라서 \$\\log 3640 \+ \\log 0.382 \= (3 - 1\) \+ (0.5611 \+ 0.5821) \= 2 \+ 1.1432 \= 3.1432\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-COMMON\_LOG\_TABLE\_SUM", "primaryMethod": "표에서 log 3.64와 log 3.82를 읽어 각각 정수 부분 3과 \-1을 결합한 뒤 더한다.", "decisiveStep": "log 0.382 \= \-1 \+ 0.5821의 정수 부분 \-1을 정확히 처리해 합 3.1432를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "상용로그", "l4": "상용로그표·자릿수"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "RPM\_ONLY: 상용로그표·자릿수(H2-M1-RPM-011)에 대응하는 ACTIVE machine key 미확정"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상용로그표 값에 양의 자릿수와 음의 자릿수(10⁻¹)를 각각 적용해 합산하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["상용로그"\], "goal": \["합"\], "method": \["정수부분", "소수부분"\], "condition": \[\]}, "hold": "RPM\_ONLY: H2-M1-RPM-011 (상용로그 \> 상용로그표·자릿수)에 대응하는 ACTIVE machine key 미확정"}  
\`\`\`

\## Q06  
- 형식: 객관식  
- 배점: 3.4  
\#\## 발문  
이차방정식 \$x^2 - 2\\sqrt{2}x - 14 \= 0\$의 두 근을 \$\\alpha, \\beta\$라 할 때, \$\\log\_2(\\alpha \+ \\beta) \+ \\log\_2(\\alpha - \\beta)\$의 값을 구하시오. (단, \$\\alpha \+ \\beta \> 0\$, \$\\alpha - \\beta \> 0\$) \[3.4점\]  
\#\## 선지  
① \$\\dfrac{9}{2}\$ ② \$4\$ ③ \$\\dfrac{7}{2}\$ ④ \$3\$ ⑤ \$\\dfrac{5}{2}\$  
\#\## 정답  
①  
\#\## 해설  
근과 계수의 관계에 의하여 \$\\alpha \+ \\beta \= 2\\sqrt{2}\$, \$\\alpha\\beta \= \-14\$이다.  
\$(\\alpha - \\beta)^2 \= (\\alpha \+ \\beta)^2 - 4\\alpha\\beta \= (2\\sqrt{2})^2 - 4(-14) \= 8 \+ 56 \= 64\$  
\$\\alpha - \\beta \> 0\$이므로 \$\\alpha - \\beta \= 8\$  
따라서 구하는 값은  
\$\\log\_2(\\alpha \+ \\beta) \+ \\log\_2(\\alpha - \\beta) \= \\log\_2(2\\sqrt{2}) \+ \\log\_2 8 \= \\dfrac{3}{2} \+ 3 \= \\dfrac{9}{2}\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-LOG\_VIETA\_SUM\_DIFF", "primaryMethod": "근과 계수의 관계로 α+β와 α-β를 구한 뒤 로그의 합을 곱으로 바꾸어 계산한다.", "decisiveStep": "(α-β)²=(α+β)²-4αβ로 α-β를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 성질", "l4": "곱·몫·거듭제곱"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_IDENTITY\_OPERATIONS", "templateKey": "TPL\_LOG\_INTEGER\_DIFFERENCE\_PRODUCT", "why": "로그의 합·차 성질로 식의 값을 구하는 문항으로 H2-M1-RPM-009(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 근과 계수의 관계로 두 근의 합·차를 구하고 로그 성질로 계산하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["이차방정식", "로그"\], "goal": \["값"\], "method": \["근과계수의관계", "로그"\], "condition": \["부호"\]}, "hold": ""}  
\`\`\`

\## Q07  
- 형식: 객관식  
- 배점: 3.4  
\#\## 발문  
다음 로그 값이 정의되기 위한 실수 \$x\$의 범위를 구하시오. \[3.4점\]  
\$\$\\log\_{3 - x}(2x^2 - 12x \+ 16)\$\$  
\#\## 선지  
① \$x \> 4\$ 또는 \$x \< 2\$ ② \$x \< 1\$ 또는 \$1 \< x \< 2\$ ③ \$2 \< x \< 3\$ ④ \$x \< 2\$ ⑤ \$x \> 4\$  
\#\## 정답  
④  
\#\## 해설  
(1) 밑 조건: \$3 - x \> 0\$이고 \$3 - x \\neq 1\$이므로 \$x \< 3\$, \$x \\neq 2\$  
(2) 진수 조건: \$2x^2 - 12x \+ 16 \> 0\$  
\$x^2 - 6x \+ 8 \> 0 \\implies (x - 2)(x - 4\) \> 0 \\implies x \< 2\$ 또는 \$x \> 4\$  
(1), (2)의 공통 범위는 \$x \< 2\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-LOG\_DEF\_LINEAR\_BASE\_QUADRATIC", "primaryMethod": "밑 조건(x\<3, x≠2)과 진수 이차부등식 (x-2)(x-4)\>0의 교집합을 구한다.", "decisiveStep": "밑 조건 x\<3과 진수 조건 x\<2 또는 x\>4의 교집합 x\<2를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 뜻", "l4": "밑과 진수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_DOMAIN\_ELIGIBILITY", "templateKey": "TPL\_LOG\_BASE\_ARGUMENT\_INTEGER\_DOMAIN", "why": "로그의 밑과 진수 조건을 구하는 문항으로 H2-M1-RPM-008(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차식 밑 조건과 이차식 진수 조건의 교집합을 구하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": \["로그", "실수"\], "goal": \["범위"\], "method": \["이차부등식", "교집합"\], "condition": \["정의역"\]}, "hold": ""}  
\`\`\`

\## Q08  
- 형식: 객관식  
- 배점: 3.6  
\#\## 발문  
다음 \<보기\>의 함수의 그래프 중 함수 \$y \= \\log\_2 x\$의 그래프를 평행이동 또는 대칭이동하여 겹쳐지는 것을 모두 고르면? \[3.6점\]  
\<보기\>  
ㄱ. \$y \= \\log\_2(x - 3)\$  
ㄴ. \$y \= \\log\_2 5x\$  
ㄷ. \$y \= \\log\_2 x^2\$  
ㄹ. \$y \= 2^{-(x \+ 1)}\$  
\#\## 선지  
① ㄱ ② ㄱ, ㄴ, ㄹ ③ ㄱ, ㄷ ④ ㄱ, ㄴ, ㄷ ⑤ ㄱ, ㄴ  
\#\## 정답  
②  
\#\## 해설  
ㄱ. \$y \= \\log\_2(x - 3)\$은 \$y \= \\log\_2 x\$를 \$x\$축 방향으로 \$3\$만큼 평행이동한 것이다. (O)  
ㄴ. \$y \= \\log\_2 5x \= \\log\_2 x \+ \\log\_2 5\$이므로 \$y\$축 방향으로 \$\\log\_2 5\$만큼 평행이동한 것이다. (O)  
ㄷ. \$y \= \\log\_2 x^2\$은 정의역이 \$\\{x \\mid x \\neq 0\\}\$이므로 정의역이 \$\\{x \\mid x \> 0\\}\$인 \$y \= \\log\_2 x\$와 겹쳐지지 않는다. (X)  
ㄹ. \$y \= 2^{-(x \+ 1)}\$은 \$y \= 2^x\$(\$y \= \\log\_2 x\$의 직선 \$y \= x\$ 대칭)을 \$y\$축 대칭 후 \$x\$축 방향으로 \$-1\$만큼 평행이동한 것이다. (O)  
따라서 옳은 것은 ㄱ, ㄴ, ㄹ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": null, "conceptClusterKey": "H15-M1-04-LOG\_GRAPH\_TRANSFORM\_EQUIVALENCE", "primaryMethod": "평행이동·대칭이동(y=x 대칭 포함) 가능 여부와 정의역 일치 여부를 보기별로 판별한다.", "decisiveStep": "ㄴ의 곱셈 분해(y축 평행이동)와 ㄹ의 y=x 대칭 후 지수함수 변환, ㄷ의 정의역 차이를 구분하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 그래프", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_TRANSFORM", "templateKey": "TPL\_FUNCTION\_GRAPH\_TRANSLATION", "why": "BINDING\_GAP: H2-M1-RPM-022(DIRECT\_BINDING\_GAP) — PT/TPL은 ACTIVE이나 exact curriculum+L1+L2 binding 없음"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그함수의 평행·대칭이동에서 진수 곱의 상수 분리와 진수 짝수 제곱의 정의역 함정을 가리는 문항이다.", "level": "중", "item4slot": {"given": \["로그함수"\], "goal": \["판정"\], "method": \["평행이동", "대칭이동", "정의역"\], "condition": \[\]}, "hold": "BINDING\_GAP: H2-M1-RPM-022 (DIRECT\_BINDING\_GAP) — PT/TPL은 ACTIVE이나 exact curriculum+L1+L2 binding 없음"}  
\`\`\`

\## Q09  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
\$225^x \= 9\$, \$25^y \= 81\$일 때, \$\\dfrac{1}{x} - \\dfrac{2}{y}\$의 값은? \[4점\]  
\#\## 선지  
① \$-2\$ ② \$-1\$ ③ \$0\$ ④ \$1\$ ⑤ \$2\$  
\#\## 정답  
⑤  
\#\## 해설  
\$225^x \= 9 \= 3^2 \\implies 225 \= 3^{\\frac{2}{x}}\$  
\$25^y \= 81 \= 3^4 \\implies 25 \= 3^{\\frac{4}{y}}\$  
두 식을 변변 나누면  
\$\\dfrac{225}{25} \= 3^{\\frac{2}{x} - \\frac{4}{y}}\$  
\$9 \= 3^{\\frac{2}{x} - \\frac{4}{y}} \\implies 3^2 \= 3^{\\frac{2}{x} - \\frac{4}{y}}\$  
\$\\dfrac{2}{x} - \\dfrac{4}{y} \= 2\$  
양변을 \$2\$로 나누면 \$\\dfrac{1}{x} - \\dfrac{2}{y} \= 1\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-EXP\_RECIPROCAL\_DIFF", "primaryMethod": "225=3^(2/x)와 25=3^(4/y)를 나누어 9=3^(2/x-4/y)에서 1/x-2/y의 값을 구한다.", "decisiveStep": "밑을 3으로 정리한 뒤 225÷25=9를 이용해 지수의 차를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수법칙", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENT\_LAW\_APPLICATION", "templateKey": "TPL\_EXPONENT\_LAW\_RECIPROCAL\_POWER", "why": "지수 조건식에서 역수 지수의 차를 구하는 문항으로 H2-M1-RPM-006(FAMILY\_ACTIVE)에서 TPL\_EXPONENT\_LAW\_RECIPROCAL\_POWER 선택"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수의 역수 차를 구하기 위해 등식을 지수 이항 후 나눗셈으로 연결하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": \["지수"\], "goal": \["차"\], "method": \["지수법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q10  
- 형식: 객관식  
- 배점: 4.2  
\#\## 발문  
\$0 \\le x \\le 3\$에서 함수 \$y \= \\log\_{\\frac{1}{3}}(x^2 - 2x \+ a)\$는 최솟값 \$-2\$를 갖는다. 이때 상수 \$a\$의 값은? (단, \$a \> 1\$이다.) \[4.2점\]  
\#\## 선지  
① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$  
\#\## 정답  
③  
\#\## 해설  
\$g(x) \= x^2 - 2x \+ a \= (x - 1)^2 \+ a - 1\$이라 하면 \$a \> 1\$이므로 모든 \$x\$에서 \$g(x) \> 0\$이다.  
\$0 \\le x \\le 3\$에서 \$g(x)\$의 값은 \$x \= 3\$일 때 최대이고, \$g(3) \= 9 - 6 \+ a \= a \+ 3\$이다.  
밑이 \$\\dfrac{1}{3} \< 1\$이므로 \$y \= \\log\_{\\frac{1}{3}} g(x)\$는 \$g(x)\$가 최대일 때 최솟값을 가진다.  
\$\\log\_{\\frac{1}{3}}(a \+ 3\) \= \-2\$  
\$a \+ 3 \= \\left(\\dfrac{1}{3}\\right)^{-2} \= 9 \\implies a \= 6\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": "H15-M1-04-LOGARITHMIC\_FUNCTION\_APPLICATION", "conceptClusterKey": "H15-M1-04-LOG\_QUADRATIC\_INTERVAL\_MIN", "primaryMethod": "밑 1/3\<1이므로 진수 x²-2x+a의 \[0,3\] 최댓값 a+3에서 y의 최솟값 \-2가 나옴을 이용해 a를 구한다.", "decisiveStep": "감소 로그함수의 최솟값이 진수의 최댓값 g(3)=a+3에서 발생함을 파악하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 활용", "l4": "최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_EXTREMUM", "templateKey": "TPL\_FUNCTION\_EXTREMUM\_INTERVAL\_ENDPOINT", "why": "닫힌구간에서 합성 로그함수의 최솟값 조건을 푸는 문항으로 H2-M1-RPM-027(FAMILY\_ACTIVE)에서 TPL\_FUNCTION\_EXTREMUM\_INTERVAL\_ENDPOINT 선택"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "감소 로그함수와 이차함수 진수의 닫힌구간 최대·최소 관계를 결합한 2단계 문항이다.", "level": "중", "item4slot": {"given": \["로그함수", "이차함수", "최솟값"\], "goal": \["값"\], "method": \["완전제곱식", "증가감소"\], "condition": \["범위"\]}, "hold": ""}  
\`\`\`

\## Q11  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
다음은 함수 \$y \= \-3^{-x - 2} \+ 4\$에 대한 설명이다. \[4점\]  
\<보기\>  
지수함수 \$y \= \-3^{-x - 2} \+ 4\$의 정의역은 실수 전체의 집합이며, 치역은 \$\\{y \\mid y \< \\text{(ㄱ)}\\}\$이다. 그래프의 점근선은 \$y \= \\text{(ㄴ)}\$이다. 함수 \$y \= \-3^{-x - 2} \+ 4\$의 그래프는 함수 \$y \= 3^{-x}\$의 그래프를 \$x\$축의 방향으로 \$\\text{(ㄷ)}\$만큼 평행이동한 뒤, \$x\$축에 대하여 대칭이동하고 \$y\$축의 방향으로 \$\\text{(ㄹ)}\$만큼 평행이동한 그래프이다.

\$\\text{(ㄱ)} \+ \\text{(ㄴ)} \+ \\text{(ㄷ)} \+ \\text{(ㄹ)}\$의 값을 구하시오.  
\#\## 선지  
① \$10\$ ② \$11\$ ③ \$12\$ ④ \$13\$ ⑤ \$14\$  
\#\## 정답  
①  
\#\## 해설  
\$y \= \-3^{-(x \+ 2)} \+ 4\$에서 \$3^{-(x+2)} \> 0\$이므로 \$-3^{-(x+2)} \+ 4 \< 4\$이다.  
따라서 치역은 \$\\{y \\mid y \< 4\\}\$이고 점근선은 \$y \= 4\$이므로 \$\\text{(ㄱ)} \= 4\$, \$\\text{(ㄴ)} \= 4\$이다.  
또 \$y \= 3^{-x}\$을 \$x\$축의 방향으로 \$-2\$만큼 평행이동하면 \$y \= 3^{-(x \+ 2)}\$이고,  
\$x\$축에 대하여 대칭이동하면 \$y \= \-3^{-(x \+ 2)}\$이며,  
\$y\$축의 방향으로 \$4\$만큼 평행이동하면 \$y \= \-3^{-x - 2} \+ 4\$가 된다.  
따라서 \$\\text{(ㄷ)} \= \-2\$, \$\\text{(ㄹ)} \= 4\$이므로  
\$\\text{(ㄱ)} \+ \\text{(ㄴ)} \+ \\text{(ㄷ)} \+ \\text{(ㄹ)} \= 4 \+ 4 \+ (-2) \+ 4 \= 10\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": null, "conceptClusterKey": "H15-M1-03-EXP\_TRANSFORM\_FILL\_BLANKS", "primaryMethod": "y=-3^(-(x+2))+4의 치역·점근선과 y=3^(-x)로부터의 평행·대칭이동량을 빈칸별로 구해 더한다.", "decisiveStep": "-x-2 \= \-(x+2)로 묶어 x축 평행이동량 (ㄷ)=-2를 정확히 읽는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 그래프", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_TRANSFORM", "templateKey": "TPL\_FUNCTION\_GRAPH\_TRANSLATION", "why": "BINDING\_GAP: H2-M1-RPM-014(DIRECT\_BINDING\_GAP) — PT/TPL은 ACTIVE이나 exact curriculum+L1+L2 binding 없음"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수함수의 \-x 계수 묶기를 통한 평행이동량 판별과 대칭이동 순서를 확인하는 문항이다.", "level": "중", "item4slot": {"given": \["지수함수"\], "goal": \["합"\], "method": \["평행이동", "대칭이동"\], "condition": \[\]}, "hold": "BINDING\_GAP: H2-M1-RPM-014 (DIRECT\_BINDING\_GAP) — PT/TPL은 ACTIVE이나 exact curriculum+L1+L2 binding 없음"}  
\`\`\`

\## Q12  
- 형식: 객관식  
- 배점: 4.2  
\#\## 발문  
방정식 \$x^{x^2 - x} \= x^{12}\$의 모든 해의 합을 구하시오. (단, \$x \> 0\$) \[4.2점\]  
\#\## 선지  
① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$  
\#\## 정답  
②  
\#\## 해설  
\$x \> 0\$이므로 밑이 \$1\$인 경우와 \$1\$이 아닌 경우로 나눈다.  
(1) \$x \= 1\$일 때: \$1^0 \= 1^{12}\$이므로 성립한다. (\$x \= 1\$)  
(2) \$x \\neq 1\$일 때: 지수가 같아야 하므로  
\$x^2 - x \= 12 \\implies x^2 - x - 12 \= 0 \\implies (x - 4)(x \+ 3\) \= 0\$  
\$x \> 0\$이므로 \$x \= 4\$  
따라서 모든 해는 \$1, 4\$이므로 합은 \$1 \+ 4 \= 5\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": null, "conceptClusterKey": "H15-M1-03-VARIABLE\_BASE\_EXP\_EQUATION", "primaryMethod": "밑이 변수 x\>0인 지수방정식을 x=1인 경우와 지수가 같은 경우로 나누어 해를 구한다.", "decisiveStep": "밑 x=1을 해로 빠뜨리지 않고 x\>0 조건으로 음수 근 \-3을 제외하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수방정식", "l4": "밑 통일"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "RPM\_ONLY: 지수방정식 밑 통일(H2-M1-RPM-015)에 대응하는 ACTIVE machine key 미확정"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑이 미지수인 지수방정식에서 x=1 경우 분류와 양수 해 선별을 묻는 표준 문항이다.", "level": "중", "item4slot": {"given": \["지수방정식"\], "goal": \["합"\], "method": \["경우분류", "이차방정식"\], "condition": \["부호"\]}, "hold": "RPM\_ONLY: H2-M1-RPM-015 (지수방정식 \> 밑 통일)에 대응하는 ACTIVE machine key 미확정"}  
\`\`\`

\## Q13  
- 형식: 객관식  
- 배점: 4.2  
\#\## 발문  
반지름의 길이가 \$9\$이고 중심각의 크기가 \$\\dfrac{\\pi}{6}\$인 부채꼴 \$OAB\$가 있다. 선분 \$OA\$ 위의 점 \$E\$에 대하여 선분 \$EA\$를 지름으로 하고 선분 \$OB\$에 접하는 반원을 \$C\$라 하자. 부채꼴 \$OAB\$의 넓이를 \$T\_1\$, 반원 \$C\$의 넓이를 \$T\_2\$라 할 때, \$T\_1 - T\_2\$의 값은? \[4.2점\]  
\#\## 선지  
① \$\\dfrac{3}{4}\\pi\$ ② \$\\pi\$ ③ \$\\dfrac{3}{2}\\pi\$ ④ \$\\dfrac{9}{4}\\pi\$ ⑤ \$3\\pi\$  
\#\## 정답  
④  
\#\## 해설  
부채꼴 \$OAB\$의 넓이 \$T\_1\$은  
\$T\_1 \= \\dfrac{1}{2} \\cdot 9^2 \\cdot \\dfrac{\\pi}{6} \= \\dfrac{27}{4}\\pi\$  
반원 \$C\$의 반지름을 \$r\$이라 하고 중심을 \$M\$이라 하면 \$\\overline{MA} \= r\$이므로 \$\\overline{OM} \= 9 - r\$이다.  
반원 \$C\$가 선분 \$OB\$에 접하므로 중심 \$M\$에서 선분 \$OB\$에 내린 수선의 발을 \$H\$라 하면 \$\\overline{MH} \= r\$이고 \$\\angle MOH \= \\dfrac{\\pi}{6}\$이다.  
직각삼각형 \$OMH\$에서 \$\\sin\\dfrac{\\pi}{6} \= \\dfrac{\\overline{MH}}{\\overline{OM}}\$이므로  
\$\\dfrac{1}{2} \= \\dfrac{r}{9 - r} \\implies 9 - r \= 2r \\implies r \= 3\$  
따라서 반원 \$C\$의 넓이 \$T\_2\$는  
\$T\_2 \= \\dfrac{1}{2}\\pi \\cdot 3^2 \= \\dfrac{9}{2}\\pi\$  
그러므로 \$T\_1 - T\_2 \= \\dfrac{27}{4}\\pi - \\dfrac{9}{2}\\pi \= \\dfrac{9}{4}\\pi\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-05", "subUnitKey": "H15-M1-05-TRIGONOMETRIC\_DEFINITION", "conceptClusterKey": "H15-M1-05-SECTOR\_TANGENT\_SEMICIRCLE", "primaryMethod": "반원 중심 M에서 반지름 OB까지의 거리 (9-r)sin(π/6)=r 관계로 반지름 r=3을 구해 넓이 차를 계산한다.", "decisiveStep": "직각삼각형 OMH에서 sin(π/6)=r/(9-r)로 반원 반지름 r=3을 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "일반각과 호도법", "l4": "호도법"}, "ptTplCandidate": {"problemTypeKey": "PT\_RADIAN\_SECTOR\_GEOMETRY", "templateKey": "TPL\_SECTOR\_RADIUS\_FROM\_AREA\_ARC", "why": "호도법과 부채꼴 넓이·접하는 반원 기하 문항으로 H2-M1-RPM-030(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "부채꼴 내부의 접하는 반원 기하 조건을 직각삼각비로 풀어 반지름을 구해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["부채꼴", "반원", "접선"\], "goal": \["차"\], "method": \["삼각비", "부채꼴"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q14  
- 형식: 객관식  
- 배점: 4.2  
\#\## 발문  
\$x\$에 대한 이차방정식 \$x^2 - ax - 2a^2 \= 0\$의 두 근이 \$\\sin\\theta\$, \$\\cos\\theta\$일 때, 모든 \$a\$의 값의 곱은? (단, \$a\$는 상수이다.) \[4.2점\]  
\#\## 선지  
① \$-1\$ ② \$-\\dfrac{1}{2}\$ ③ \$-\\dfrac{1}{3}\$ ④ \$-\\dfrac{1}{4}\$ ⑤ \$-\\dfrac{1}{5}\$  
\#\## 정답  
⑤  
\#\## 해설  
근과 계수의 관계에 의하여  
\$\\sin\\theta \+ \\cos\\theta \= a\$, \$\\sin\\theta\\cos\\theta \= \-2a^2\$  
\$(\\sin\\theta \+ \\cos\\theta)^2 \= 1 \+ 2\\sin\\theta\\cos\\theta\$에 대입하면  
\$a^2 \= 1 \+ 2(-2a^2) \= 1 - 4a^2\$  
\$5a^2 \= 1 \\implies a \= \\pm\\dfrac{1}{\\sqrt{5}}\$  
한편 두 근이 실수이므로 판별식 \$D \= a^2 - 4(-2a^2) \= 9a^2 \> 0\$을 만족한다.  
따라서 모든 \$a\$의 값의 곱은 \$\\dfrac{1}{\\sqrt{5}} \\times \\left(-\\dfrac{1}{\\sqrt{5}}\\right) \= \-\\dfrac{1}{5}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-05", "subUnitKey": "H15-M1-05-TRIGONOMETRIC\_RELATION", "conceptClusterKey": "H15-M1-05-TRIG\_QUADRATIC\_PRODUCT\_A", "primaryMethod": "근과 계수의 관계와 (sin θ+cos θ)²=1+2sin θ cos θ를 연립해 5a²=1을 풀고 판별식을 확인한다.", "decisiveStep": "a²=1-4a²에서 a²=1/5을 얻고 실근 판별식 9a²\>0 성립을 확인하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 성질", "l4": "삼각함수 관계"}, "ptTplCandidate": {"problemTypeKey": "PT\_TRIG\_IDENTITY\_RELATIONS", "templateKey": "TPL\_TRIG\_IDENTITY\_ROOT\_FEASIBILITY", "why": "이차방정식의 두 근 sinθ, cosθ와 실근 판별식을 확인하는 문항으로 H2-M1-RPM-034(FAMILY\_ACTIVE)에서 TPL\_TRIG\_IDENTITY\_ROOT\_FEASIBILITY 선택"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "근과 계수의 관계와 삼각함수 항등식 및 실근 판별식을 함께 확인하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["이차방정식", "삼각함수"\], "goal": \["곱"\], "method": \["근과계수의관계", "삼각함수의상호관계"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q15  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
두 집합 \$A \= \\{4, 6, 9\\}\$, \$B \= \\{-15, 3, 7, 11\\}\$에 대하여 집합 \$C\$를  
\$\$C \= \\{x \\mid x^a \= b,\\; a \\in A,\\; b \\in B,\\; x\\text{는 실수}\\}\$\$  
라 할 때, \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \[4.5점\]  
\<보기\>  
ㄱ. \$\\sqrt\[6\]{-15} \\in C\$  
ㄴ. 집합 \$C\$의 원소의 개수는 \$16\$개이다.  
ㄷ. 집합 \$C\$의 원소 중 가장 큰 값은 \$\\sqrt\[4\]{11}\$이다.  
\#\## 선지  
① ㄱ ② ㄴ ③ ㄴ, ㄷ ④ ㄱ, ㄷ ⑤ ㄱ, ㄴ, ㄷ  
\#\## 정답  
③  
\#\## 해설  
ㄱ. \$a \= 6\$ (짝수)일 때 \$x^6 \= \-15\$를 만족시키는 실수 \$x\$는 존재하지 않으므로 \$\\sqrt\[6\]{-15}\$는 실수가 아니다. (거짓)  
ㄴ. 각 \$(a, b)\$에 대한 실근 \$x\$의 개수를 세면 다음과 같다.  
- \$a \= 4, 6\$ (짝수): \$b \\in \\{3, 7, 11\\}\$일 때 각 \$2\$개씩, \$b \= \-15\$일 때 \$0\$개이므로 \$2 \\times 3 \\times 2 \= 12\$개  
- \$a \= 9\$ (홀수): \$b \\in \\{-15, 3, 7, 11\\}\$일 때 각 \$1\$개씩이므로 \$4\$개  
\$3, 7, 11, \-15\$로부터 나오는 실수 거듭제곱근이 모두 서로 다르므로 \$n(C) \= 12 \+ 4 \= 16\$이다. (참)  
ㄷ. 집합 \$C\$의 양수 원소는 \$b \\in \\{3, 7, 11\\}\$에 대하여 \$\\sqrt\[a\]{b}\$ 꼴이므로 밑 \$b\$가 가장 크고 지수 \$\\dfrac{1}{a}\$이 가장 클 때 최대이다. 즉, \$a \= 4, b \= 11\$일 때 \$\\sqrt\[4\]{11}\$이 가장 큰 값이다. (참)  
따라서 옳은 것은 ㄴ, ㄷ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-NTH\_ROOT\_SET\_CARDINALITY", "primaryMethod": "a의 홀짝성과 b의 부호에 따라 x^a=b의 실근 개수를 세고 중복 원소 여부를 확인해 원소의 개수와 최댓값을 구한다.", "decisiveStep": "짝수 제곱근(양수만 2개)과 홀수 제곱근(모두 1개)의 개수를 세고 서로 다른 소수 밑으로 중복이 없음을 확인하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "거듭제곱근", "l4": "실수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_ROOT\_INTEGER\_FEASIBILITY", "templateKey": "TPL\_ROOT\_INTEGER\_EXPONENT\_CASE\_COUNT", "why": "거듭제곱근의 실수 조건과 원소 개수를 판별하는 문항으로 H2-M1-RPM-002(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "집합 원소로 정의된 실수 거듭제곱근의 존재성, 개수, 최댓값을 종합 판별하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["집합", "거듭제곱근"\], "goal": \["판정"\], "method": \["거듭제곱근", "경우분류"\], "condition": \["실수", "원소의개수"\]}, "hold": ""}  
\`\`\`

\## Q16  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
\$\\pi \< \\theta \< \\dfrac{3}{2}\\pi\$이고 \$\\tan\\theta \+ \\dfrac{1}{\\tan\\theta} \= 6\$이라 하자. 이때 \$\\sin^3\\theta \+ \\cos^3\\theta\$의 값은? \[4.5점\]  
\#\## 선지  
① \$-\\dfrac{5\\sqrt{3}}{9}\$ ② \$-\\dfrac{5\\sqrt{3}}{18}\$ ③ \$\\dfrac{5\\sqrt{3}}{18}\$ ④ \$\\dfrac{5\\sqrt{3}}{9}\$ ⑤ \$-\\dfrac{7\\sqrt{3}}{9}\$  
\#\## 정답  
①  
\#\## 해설  
\$\\tan\\theta \+ \\dfrac{1}{\\tan\\theta} \= \\dfrac{\\sin\\theta}{\\cos\\theta} \+ \\dfrac{\\cos\\theta}{\\sin\\theta} \= \\dfrac{\\sin^2\\theta \+ \\cos^2\\theta}{\\sin\\theta\\cos\\theta} \= \\dfrac{1}{\\sin\\theta\\cos\\theta} \= 6\$  
따라서 \$\\sin\\theta\\cos\\theta \= \\dfrac{1}{6}\$  
\$(\\sin\\theta \+ \\cos\\theta)^2 \= 1 \+ 2\\sin\\theta\\cos\\theta \= 1 \+ \\dfrac{1}{3} \= \\dfrac{4}{3}\$  
\$\\pi \< \\theta \< \\dfrac{3}{2}\\pi\$는 제\$3\$사분면의 각이므로 \$\\sin\\theta \< 0, \\cos\\theta \< 0\$이어서 \$\\sin\\theta \+ \\cos\\theta \= \-\\dfrac{2}{\\sqrt{3}} \= \-\\dfrac{2\\sqrt{3}}{3}\$이다.  
그러므로 \$\\sin^3\\theta \+ \\cos^3\\theta \= (\\sin\\theta \+ \\cos\\theta)(1 - \\sin\\theta\\cos\\theta) \= \\left(-\\dfrac{2\\sqrt{3}}{3}\\right)\\left(1 - \\dfrac{1}{6}\\right) \= \-\\dfrac{5\\sqrt{3}}{9}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-05", "subUnitKey": "H15-M1-05-TRIGONOMETRIC\_RELATION", "conceptClusterKey": "H15-M1-05-TAN\_RECIPROCAL\_SUM\_CUBIC", "primaryMethod": "tan θ+1/tan θ=1/(sin θ cos θ)로 sin θ cos θ를 구한 뒤 제3사분면 부호로 sin θ+cos θ를 확정해 세제곱 합을 구한다.", "decisiveStep": "tan θ \+ cot θ \= 1/(sin θ cos θ)로 환원하고 제3사분면에서 sin θ+cos θ \< 0을 적용하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 성질", "l4": "삼각함수 관계"}, "ptTplCandidate": {"problemTypeKey": "PT\_TRIG\_IDENTITY\_RELATIONS", "templateKey": "TPL\_TRIG\_RATIONAL\_IDENTITY\_RECOVERY", "why": "tanθ+1/tanθ 조건에서 삼각함수 세제곱 합을 복원하는 문항으로 H2-M1-RPM-034(FAMILY\_ACTIVE)에서 TPL\_TRIG\_RATIONAL\_IDENTITY\_RECOVERY 선택"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "탄젠트 역수 합에서 사인·코사인 곱을 이끌어내고 사분면 부호로 합을 구해 세제곱 합으로 연결하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["삼각함수"\], "goal": \["값"\], "method": \["삼각함수의상호관계", "곱셈공식"\], "condition": \["범위", "부호"\]}, "hold": ""}  
\`\`\`

\## Q17  
- 형식: 객관식  
- 배점: 4.7  
\#\## 발문  
정육면체 \$ABCD-EFGH\$의 부피가 \$2^7\$일 때, 삼각형 \$AFC\$의 넓이가 \$\\sqrt{3} \\times 2^{\\frac{p}{q}}\$이다. 이때 서로소인 두 자연수 \$p, q\$에 대하여 \$10p \+ q\$의 값은? \[4.7점\]  
\#\## 선지  
① \$83\$ ② \$113\$ ③ \$123\$ ④ \$133\$ ⑤ \$143\$  
\#\## 정답  
②  
\#\## 해설  
정육면체의 한 모서리의 길이를 \$s\$라 하면 \$s^3 \= 2^7\$이므로 \$s \= 2^{\\frac{7}{3}}\$이다.  
세 선분 \$AF, FC, CA\$는 각각 정육면체의 한 면의 대각선이므로 길이가 모두 \$s\\sqrt{2}\$로 같고, 따라서 \$\\triangle AFC\$는 한 변의 길이가 \$s\\sqrt{2}\$인 정삼각형이다.  
\$\\triangle AFC\$의 넓이는  
\$\\dfrac{\\sqrt{3}}{4}(s\\sqrt{2})^2 \= \\dfrac{\\sqrt{3}}{2}s^2 \= \\dfrac{\\sqrt{3}}{2} \\cdot \\left(2^{\\frac{7}{3}}\\right)^2 \= \\sqrt{3} \\times 2^{\\frac{14}{3} - 1} \= \\sqrt{3} \\times 2^{\\frac{11}{3}}\$  
따라서 \$p \= 11, q \= 3\$이므로 \$10p \+ q \= 10 \\times 11 \+ 3 \= 113\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-CUBE\_FACE\_DIAGONAL\_TRIANGLE\_EXPONENT", "primaryMethod": "부피 2⁷에서 모서리 s=2^(7/3)을 구하고 면대각선 정삼각형 AFC의 넓이를 유리수 지수로 정리한다.", "decisiveStep": "정삼각형 AFC의 한 변 s√2에 대해 넓이 (√3/2)s² \= √3 × 2^(11/3)을 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수법칙", "l4": "지수식 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENT\_LAW\_APPLICATION", "templateKey": "TPL\_EXPONENT\_LAW\_EVALUATION", "why": "정육면체 부피와 삼각형 넓이를 유리수 지수법칙으로 계산하는 문항으로 H2-M1-RPM-005(FAMILY\_ACTIVE)에서 TPL\_EXPONENT\_LAW\_EVALUATION 선택"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "정육면체 면대각선 정삼각형의 성질과 유리수 지수 연산을 결합한 3단계 문항이다.", "level": "상", "item4slot": {"given": \["삼각형", "넓이"\], "goal": \["값"\], "method": \["지수법칙"\], "condition": \["서로소"\]}, "hold": ""}  
\`\`\`

\## Q18  
- 형식: 객관식  
- 배점: 4.7  
\#\## 발문  
\$-7 \\le x \\le 7\$에서 정의된 함수 \$f\$가 다음 조건을 만족시킨다.  
(가) \$f(x) \= \\begin{cases} \-x \+ 1 & (0 \\le x \\le 1\) \\\\ \-\|x - 3\| \+ 2 & (1 \< x \< 5\) \\\\ 2x - 10 & (5 \\le x \\le 7\) \\end{cases}\$  
(나) 모든 실수 \$x\$에 대하여 \$f(-x) \= f(x)\$  
두 함수 \$y \= f(x)\$와 \$y \= 2^{-\\frac{x}{4}}\$의 그래프의 교점의 개수를 구하시오. \[4.7점\]  
\#\## 선지  
① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$  
\#\## 정답  
④  
\#\## 해설  
\$y \= f(x)\$는 \$y\$축에 대하여 대칭이고, \$0 \\le x \\le 7\$에서 꺾인 점의 좌표는 \$(0, 1), (1, 0), (3, 2), (5, 0), (7, 4)\$이다.  
함수 \$g(x) \= 2^{-\\frac{x}{4}}\$은 감소함수이며 주요 점에서의 값을 비교하면 다음과 같다.  
- \$x \\ge 0\$ 구간:  
  - \$x \= 0\$: \$f(0) \= g(0) \= 1\$ (교점 \$1\$개)  
  - \$x \= 1\$: \$f(1) \= 0 \< g(1) \= 2^{-\\frac{1}{4}}\$  
  - \$x \= 3\$: \$f(3) \= 2 \> g(3) \= 2^{-\\frac{3}{4}}\$ (구간 \$(1, 3)\$에서 교점 \$1\$개)  
  - \$x \= 5\$: \$f(5) \= 0 \< g(5) \= 2^{-\\frac{5}{4}}\$ (구간 \$(3, 5)\$에서 교점 \$1\$개)  
  - \$x \= 7\$: \$f(7) \= 4 \> g(7) \= 2^{-\\frac{7}{4}}\$ (구간 \$(5, 7)\$에서 교점 \$1\$개)  
- \$x \< 0\$ 구간 (\$g\$는 \$1\$에서 증가):  
  - \$x \= \-1\$: \$f(-1) \= 0 \< g(-1) \= 2^{\\frac{1}{4}}\$  
  - \$x \= \-3\$: \$f(-3) \= 2 \> g(-3) \= 2^{\\frac{3}{4}}\$ (\$2^4=16 \> 2^3=8\$이므로 구간 \$(-3, \-1)\$에서 교점 \$1\$개)  
  - \$x \= \-5\$: \$f(-5) \= 0 \< g(-5) \= 2^{\\frac{5}{4}}\$ (구간 \$(-5, \-3)\$에서 교점 \$1\$개)  
  - \$x \= \-7\$: \$f(-7) \= 4 \> g(-7) \= 2^{\\frac{7}{4}}\$ (\$2^8=256 \> 2^7=128\$이므로 구간 \$(-7, \-5)\$에서 교점 \$1\$개)  
따라서 교점의 개수는 \$4 \+ 3 \= 7\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": null, "conceptClusterKey": "H15-M1-03-EVEN\_PIECEWISE\_EXP\_INTERSECTIONS", "primaryMethod": "f(x)의 우함수 대칭성과 꺾인 점 좌표들을 지수함수 2^(-x/k)의 함숫값과 비교해 교점 개수를 센다.", "decisiveStep": "양수 구간과 음수 구간의 각 꺾인 점 x=±1, ±3, ±5, ±7에서 대소를 비교하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "BINDING\_GAP: H2-M1-RPM-020(DIRECT\_BINDING\_GAP) — PT/TPL은 ACTIVE이나 exact curriculum+L1+L2 binding 없음"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "우함수 구간별 직선 그래프와 감소 지수함수의 교점을 양·음 구간 경계점 함숫값 비교로 정확히 세는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": \["조각함수", "지수함수"\], "goal": \["개수"\], "method": \["대칭성", "대소비교"\], "condition": \["범위"\]}, "hold": "BINDING\_GAP: H2-M1-RPM-020 (DIRECT\_BINDING\_GAP) — PT/TPL은 ACTIVE이나 exact curriculum+L1+L2 binding 없음"}  
\`\`\`

\## Q19  
- 형식: 객관식  
- 배점: 4.8  
\#\## 발문  
함수 \$y \= 4\\log\_2(x - 1)\$의 그래프 위의 한 점 \$A\$를 지나고 \$x\$축에 평행한 직선이 함수 \$y \= 2^{x - 3}\$의 그래프와 만나는 점을 \$B\$, 점 \$B\$를 지나고 \$y\$축에 평행한 직선이 함수 \$y \= 4\\log\_2(x - 1)\$의 그래프와 만나는 점을 \$D\$, 점 \$D\$를 지나고 \$x\$축에 평행한 직선이 함수 \$y \= 2^{x - 3}\$의 그래프와 만나는 점을 \$C\$라 하자. \$\\overline{AB} \= 2\$, \$\\overline{BD} \= 4\$일 때, 사각형 \$ABCD\$의 넓이는? (단, 점 \$A\$의 \$x\$좌표는 점 \$B\$의 \$x\$좌표보다 작고, 점 \$D\$의 \$y\$좌표는 점 \$B\$의 \$y\$좌표보다 크다.) \[4.8점\]  
\#\## 선지  
① \$3\$ ② \$4\$ ③ \$5\$ ④ \$\\dfrac{11}{2}\$ ⑤ \$6\$  
\#\## 정답  
⑤  
\#\## 해설  
\$A(a, 4\\log\_2(a - 1))\$이라 하면 \$\\overline{AB} \= 2\$이고 \$x\_B \> x\_A\$이므로 \$B(a \+ 2, 4\\log\_2(a - 1))\$이다.  
점 \$D\$는 \$x \= a \+ 2\$에서 곡선 \$y \= 4\\log\_2(x - 1)\$ 위의 점이고 \$\\overline{BD} \= 4\$이므로  
\$4\\log\_2(a \+ 1\) - 4\\log\_2(a - 1\) \= 4 \\implies \\log\_2 \\dfrac{a \+ 1}{a - 1} \= 1 \\implies \\dfrac{a \+ 1}{a - 1} \= 2 \\implies a \= 3\$  
따라서 \$A(3, 4)\$, \$B(5, 4)\$, \$D(5, 8)\$이다. (\$B(5, 4)\$는 \$y \= 2^{5-3} \= 4\$를 만족한다.)  
점 \$C\$는 \$y \= 2^{x - 3}\$ 위의 점 중 \$y \= 8\$인 점이므로 \$2^{x - 3} \= 8 \\implies x \= 6\$, 즉 \$C(6, 8)\$이다.  
사다리꼴 \$ABCD\$에서 \$\\overline{AB} \= 2\$, \$\\overline{DC} \= 6 - 5 \= 1\$, 높이 \$\\overline{BD} \= 4\$이므로 넓이는  
\$\\dfrac{2 \+ 1}{2} \\times 4 \= 6\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": "H15-M1-04-LOGARITHMIC\_FUNCTION\_GRAPH", "conceptClusterKey": "H15-M1-04-EXP\_LOG\_TRAPEZOID\_AREA", "primaryMethod": "AB=2, BD=2 조건을 로그함수 식에 적용해 점 A, B, D의 좌표를 구하고 지수함수와 교점 C를 찾아 사다리꼴 넓이를 구한다.", "decisiveStep": "BD=2로부터 점 A, B, D의 좌표를 확정해 점 C의 x좌표를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "지수·로그함수 그래프 교점과 좌표 조건으로 넓이를 구하는 문항으로 H2-M1-RPM-028(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수·로그함수 위의 수직·수평 계단형 점 좌표들을 길이 조건으로 연립해 사다리꼴 넓이를 구하는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": \["로그함수", "지수함수", "사각형", "길이"\], "goal": \["넓이"\], "method": \["연립방정식", "대입"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q20  
- 형식: 객관식  
- 배점: 4.8  
\#\## 발문  
세 곡선 \$y \= 3^{x - 1}\$, \$y \= \\log\_3(x - 1)\$, \$y \= \\log\_{\\frac{1}{2}}(x - 2)\$와 \$x\$축, \$y\$축으로 둘러싸인 영역의 내부 또는 그 경계에 포함되고 \$x\$좌표와 \$y\$좌표가 모두 정수인 점의 개수를 구하시오. \[4.8점\]  
\#\## 선지  
① \$5\$개 ② \$6\$개 ③ \$7\$개 ④ \$8\$개 ⑤ \$9\$개  
\#\## 정답  
③  
\#\## 해설  
각 곡선의 \$x\$절편과 \$y\$절편을 확인하면  
- \$y \= 3^{x - 1}\$: \$(0, \\frac{1}{3})\$, \$(1, 1)\$, \$(2, 3)\$을 지난다.  
- \$y \= \\log\_3(x - 1)\$: \$(2, 0)\$, \$(4, 1)\$을 지난다.  
- \$y \= \\log\_{\\frac{1}{2}}(x - 2)\$: 점근선 \$x \= 2\$, \$(3, 0)\$, \$(2.5, 1)\$을 지난다.  
둘러싸인 영역 내 정수점 \$(x, y)\$를 \$x\$좌표별로 세면  
- \$x \= 0\$: \$0 \\le y \\le \\dfrac{1}{3} \\implies (0, 0)\$ (\$1\$개)  
- \$x \= 1\$: \$0 \\le y \\le 1 \\implies (1, 0), (1, 1)\$ (\$2\$개)  
- \$x \= 2\$: \$\\log\_3(2 - 1\) \= 0 \\le y \\le 3 \\implies (2, 0), (2, 1), (2, 2), (2, 3)\$ (\$4\$개)  
- \$x \= 3\$: \$\\log\_{\\frac{1}{2}}(3 - 2\) \= 0 \< \\log\_3 2\$이므로 영역에 포함되는 정수점이 없다.  
따라서 구하는 점의 개수는 \$1 \+ 2 \+ 4 \= 7\$개이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": "H15-M1-04-LOGARITHMIC\_FUNCTION\_GRAPH", "conceptClusterKey": "H15-M1-04-EXP\_LOG\_BOUNDED\_LATTICE", "primaryMethod": "세 곡선과 x축·y축이 이루는 영역의 x별 상한·하한을 구해 정수 격자점을 센다.", "decisiveStep": "x=2의 y∈\[0,3\]과 x=3에서의 경계 교차 여부를 확인해 7개를 세는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "지수·로그 곡선으로 둘러싸인 영역의 격자점 개수를 구하는 문항으로 H2-M1-RPM-028(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "세 지수·로그 곡선과 좌표축으로 둘러싸인 영역의 경계를 파악해 정수 격자점을 세는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": \["지수함수", "로그함수", "정수"\], "goal": \["개수"\], "method": \["경우분류", "부등식"\], "condition": \["정수", "개수"\]}, "hold": ""}  
\`\`\`

\## Q21  
- 형식: 서술형  
- 배점: 4  
\#\## 발문  
서답형 1\. (서술형) 다음 부등식을 푸시오. \[4점\]  
\$\$(x \+ 1)^{x^2 - 12} \< (x \+ 1)^{-x^2 \+ 2x} \\quad (\\text{단, } x \> \-1)\$\$  
\#\## 정답  
\$0 \< x \< 3\$  
\#\## 해설  
밑 \$x \+ 1 \> 0\$이므로 \$x \+ 1\$의 범위에 따라 세 경우로 나눈다.  
(1) \$0 \< x \+ 1 \< 1\$, 즉 \$-1 \< x \< 0\$일 때: 부등호 방향이 바뀌므로  
\$x^2 - 12 \> \-x^2 \+ 2x \\implies 2x^2 - 2x - 12 \> 0 \\implies (x - 3)(x \+ 2\) \> 0\$  
\$x \< \-2\$ 또는 \$x \> 3\$이므로 \$-1 \< x \< 0\$과의 공통 범위는 없다.  
(2) \$x \+ 1 \= 1\$, 즉 \$x \= 0\$일 때: \$1^{-12} \< 1^0\$은 성립하지 않는다.  
(3) \$x \+ 1 \> 1\$, 즉 \$x \> 0\$일 때: 부등호 방향이 유지되므로  
\$(x - 3)(x \+ 2\) \< 0 \\implies \-2 \< x \< 3\$  
\$x \> 0\$과의 공통 범위는 \$0 \< x \< 3\$이다.  
따라서 구하는 부등식의 해는 \$0 \< x \< 3\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": "H15-M1-03-EXPONENTIAL\_FUNCTION\_APPLICATION", "conceptClusterKey": "H15-M1-03-VARIABLE\_BASE\_EXP\_INEQ\_SOLVE", "primaryMethod": "밑 x+3의 범위를 (0,1), 1, (1,∞) 세 경우로 나누어 이차부등식을 풀어 해를 구한다.", "decisiveStep": "0\<밑\<1과 밑\>1에서 부등호 방향을 달리하여 공통 해를 합집합하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수부등식", "l4": "밑의 범위에 따른 부등호"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENTIAL\_INEQUALITY", "templateKey": "TPL\_VARIABLE\_EXPONENT\_LOG\_INEQUALITY", "why": "밑이 변수인 지수부등식을 경우 분류하여 푸는 문항으로 H2-M1-RPM-017(FAMILY\_ACTIVE)에서 TPL\_VARIABLE\_EXPONENT\_LOG\_INEQUALITY 선택"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑이 변수인 지수부등식을 세 구간으로 나누어 정확히 푸는 3단계 서술형 문항이다.", "level": "중", "item4slot": {"given": \["지수부등식"\], "goal": \["해"\], "method": \["경우분류", "이차부등식"\], "condition": \["범위"\]}, "hold": ""}  
\`\`\`

\## Q22  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
서답형 2\. (서술형) \$-10 \\le x \\le 10\$에서 다음 부등식  
\$\$\\log\_{x - 1}(2x^2 - 7x \+ 6\) \> 2\$\$  
을 만족하는 정수 \$x\$의 개수를 풀이 과정과 함께 서술하시오. \[6점\]  
\#\## 정답  
\$7\$  
\#\## 해설  
밑 조건과 진수 조건에 의하여  
\$x - 1 \> 0, x - 1 \\neq 1 \\implies x \> 1, x \\neq 2\$  
\$2x^2 - 7x \+ 6 \= (2x - 3)(x - 2\) \> 0 \\implies x \< \\dfrac{3}{2}\$ 또는 \$x \> 2\$  
(1) \$1 \< x \< 2\$ (밑 \$0 \< x - 1 \< 1\$)일 때: \$1 \< x \< \\dfrac{3}{2}\$이므로 정수 없음.  
(2) \$x \> 2\$ (밑 \$x - 1 \> 1\$)일 때:  
\$2x^2 - 7x \+ 6 \> (x - 1)^2 \= x^2 - 2x \+ 1\$  
\$x^2 - 5x \+ 5 \> 0 \\implies x \< \\dfrac{5 - \\sqrt{5}}{2} \\approx 1.38\$ 또는 \$x \> \\dfrac{5 \+ \\sqrt{5}}{2} \\approx 3.62\$  
\$-10 \\le x \\le 10\$이고 \$x \> 2\$인 범위와 합치면 \$4 \\le x \\le 10\$인 정수 \$x \= 4, 5, 6, 7, 8, 9, 10\$의 \$7\$개이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": "H15-M1-04-LOGARITHMIC\_FUNCTION\_APPLICATION", "conceptClusterKey": "H15-M1-04-VARIABLE\_BASE\_LOG\_INEQUALITY", "primaryMethod": "밑 x-1의 범위를 (0,1)과 (1,∞)로 나누고 진수 조건을 함께 적용해 \[-10,10\] 내 정수를 센다.", "decisiveStep": "밑 x-1\>1에서 이차부등식 x²-5x+5\>0을 풀어 정수 4\~10을 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그부등식", "l4": "정의역·밑 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_INEQUALITY\_DOMAIN", "templateKey": "TPL\_LOG\_QUADRATIC\_INTERVAL\_INTERSECTION", "why": "밑이 변수인 로그부등식의 밑·진수 조건 및 정수 해 개수를 구하는 문항으로 H2-M1-RPM-025(DIRECT\_ACTIVE) 매핑"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑이 변수인 로그부등식의 경우 분류, 진수 조건, 무리수 근 경계 내 정수 카운트를 모두 수행하는 고난도 서술형 문항이다.", "level": "상", "item4slot": {"given": \["로그부등식", "정수"\], "goal": \["개수"\], "method": \["경우분류", "이차부등식"\], "condition": \["진수조건", "정수", "범위"\]}, "hold": ""}  
\`\`\`

\## Q23  
- 형식: 서술형  
- 배점: 4  
\#\## 발문  
서답형 3\. (서술형) 방사성 물질을 보관하는 곳에는 외부로 방사선 입자가 누출되는 것을 방지하기 위하여 특수 보호막을 설치한다. 어떤 방사선 입자의 \$25\\%\$를 막아주는 보호막을 \$10\$장 설치하였을 때, \$10\$장째 보호막을 통과한 방사선 입자의 양은 처음 양의 약 몇 \$\\%\$인지 풀이 과정과 함께 서술하시오. (단, \$\\log 2 \= 0.3010\$, \$\\log 3 \= 0.4771\$, \$\\log 5.636 \= 0.7510\$이다.) \[4점\]  
\#\## 정답  
약 \$5.64\\%\$ (약 \$5.6\\%\$)  
\#\## 해설  
보호막을 \$1\$장 통과할 때마다 입자의 \$25\\%\$가 차단되므로 \$75\\% \= \\dfrac{3}{4}\$이 통과한다.  
\$10\$장을 통과한 후의 비율을 \$k \= \\left(\\dfrac{3}{4}\\right)^{10}\$이라 하고 상용로그를 취하면  
\$\\log k \= 10(\\log 3 - 2\\log 2\) \= 10(0.4771 - 2 \\times 0.3010) \= 10 \\times (-0.1249) \= \-1.2490\$  
\$-1.2490 \= \-2 \+ 0.7510 \= \\log 10^{-2} \+ \\log 5.636 \= \\log 0.05636\$  
따라서 \$k \= 0.05636\$이므로 처음 양의 약 \$5.636\\%\$ (약 \$5.6\\%\$)이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-COMMON\_LOG\_SHIELDING\_PERCENT", "primaryMethod": "10장 통과 비율 (3/4)^10에 상용로그를 취해 \-2+0.7510으로 분리하여 백분율을 구한다.", "decisiveStep": "-1.2490 \= \-2 \+ 0.7510으로 양의 소수 부분을 만들어 0.05636을 얻는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "상용로그", "l4": "소수점 위치"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "RPM\_ONLY: 상용로그 소수점 위치(H2-M1-RPM-012)에 대응하는 ACTIVE machine key 미확정"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상용로그를 이용해 (0.75)^10의 값을 음의 정수 부분과 양의 소수 부분으로 구하는 표준 서술형 문항이다.", "level": "중", "item4slot": {"given": \["상용로그"\], "goal": \["비"\], "method": \["상용로그", "정수부분", "소수부분"\], "condition": \["상용로그"\]}, "hold": "RPM\_ONLY: H2-M1-RPM-012 (상용로그 \> 소수점 위치)에 대응하는 ACTIVE machine key 미확정"}  
\`\`\`

\## Q24  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
서답형 4\. (서술형) 두 함수 \$y \= \\left(\\dfrac{4}{3}\\right)^{x \+ 1} \+ 2\$, \$y \= \\left(\\dfrac{4}{3}\\right)^{x - 2} - 1\$의 그래프가 기울기가 \$-1\$인 직선과 만나는 교점을 각각 \$A, B\$라 하자. 두 점 \$A, B\$의 중점이 \$\\left(\\dfrac{5}{2}, a\\right)\$이고 원점을 \$O\$라 할 때, 삼각형 \$OAB\$의 넓이를 \$S\$라 하자. \$\\dfrac{2S}{a}\$의 값을 구하시오. \[6점\]  
\#\## 정답  
\$\\dfrac{258}{41}\$  
\#\## 해설  
\$f(x) \= \\left(\\dfrac{4}{3}\\right)^{x \+ 1} \+ 2\$, \$g(x) \= \\left(\\dfrac{4}{3}\\right)^{x - 2} - 1\$이라 하면 \$g(x) \= f(x - 3\) - 3\$이므로  
곡선 \$y \= g(x)\$는 곡선 \$y \= f(x)\$를 \$x\$축의 방향으로 \$3\$만큼, \$y\$축의 방향으로 \$-3\$만큼 평행이동한 것이다.  
평행이동 벡터 \$(3, \-3)\$이 기울기 \$-1\$인 직선과 평행하므로 \$B\$는 \$A\$를 \$(3, \-3)\$만큼 평행이동한 점이다.  
중점 \$M\\left(\\dfrac{5}{2}, a\\right)\$로부터 \$A\$의 \$x\$좌표는 \$\\dfrac{5}{2} - \\dfrac{3}{2} \= 1\$이고, \$B\$의 \$x\$좌표는 \$\\dfrac{5}{2} \+ \\dfrac{3}{2} \= 4\$이다.  
점 \$A(1, f(1))\$의 \$y\$좌표는 \$\\left(\\dfrac{4}{3}\\right)^2 \+ 2 \= \\dfrac{16}{9} \+ 2 \= \\dfrac{34}{9}\$이고, \$B\$의 \$y\$좌표는 \$\\dfrac{34}{9} - 3 \= \\dfrac{7}{9}\$이다.  
따라서 \$a \= \\dfrac{\\frac{34}{9} \+ \\frac{7}{9}}{2} \= \\dfrac{41}{18}\$이다.  
선분 \$AB\$의 길이는 \$\\sqrt{3^2 \+ (-3)^2} \= 3\\sqrt{2}\$이고, 직선 \$AB\$의 방정식은 \$x \+ y \= \\dfrac{5}{2} \+ \\dfrac{41}{18} \= \\dfrac{43}{9}\$이다.  
원점 \$O\$에서 직선 \$AB\$까지의 거리 \$h \= \\dfrac{43}{9\\sqrt{2}}\$이므로 삼각형 \$OAB\$의 넓이 \$S\$는  
\$S \= \\dfrac{1}{2} \\times 3\\sqrt{2} \\times \\dfrac{43}{9\\sqrt{2}} \= \\dfrac{43}{6}\$  
따라서 \$\\dfrac{2S}{a} \= \\dfrac{2 \\times \\frac{43}{6}}{\\frac{41}{18}} \= \\dfrac{43}{3} \\times \\dfrac{18}{41} \= \\dfrac{258}{41}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": null, "conceptClusterKey": "H15-M1-03-EXP\_TRANSLATION\_SLOPE\_TRIANGLE\_AREA", "primaryMethod": "평행이동 (3, \-3)이 직선 기울기 \-1과 같음을 이용해 A(1, 34/9), B(4, 7/9)를 구하고 삼각형 OAB 넓이를 계산한다.", "decisiveStep": "g(x)=f(x-3)-3 평행이동 벡터 (3,-3)이 직선 방향과 일치해 x\_A=1, x\_B=4가 결정되는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "BINDING\_GAP: H2-M1-RPM-020(DIRECT\_BINDING\_GAP) — PT/TPL은 ACTIVE이나 exact curriculum+L1+L2 binding 없음"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수함수의 평행이동 벡터와 직선의 기울기 일치를 이용해 좌표를 구하고 점-직선 거리로 넓이를 구하는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": \["지수함수", "직선", "삼각형"\], "goal": \["값"\], "method": \["평행이동", "넓이"\], "condition": \[\]}, "hold": "BINDING\_GAP: H2-M1-RPM-020 (DIRECT\_BINDING\_GAP) — PT/TPL은 ACTIVE이나 exact curriculum+L1+L2 binding 없음"}  
\`\`\`  
