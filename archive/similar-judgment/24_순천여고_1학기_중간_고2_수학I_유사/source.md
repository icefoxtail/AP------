\`\`\`json:exam  
{"stem": "24\_순천여고\_1학기\_중간\_고2\_수학I\_유사", "sourceArchiveFile": "original/high/h2/1mid/24\_순천여고\_1학기\_중간\_고2\_수학I.js", "examFolder": "1mid", "grade": "고2", "subject": "수학I", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}  
\`\`\`

\## Q01  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
방정식 \$5^{x \+ 1} \= \\sqrt{125}\$의 근은? \[3.5점\]  
\#\## 선지  
① \$-\\dfrac{1}{2}\$ ② \$0\$ ③ \$\\dfrac{1}{2}\$ ④ \$1\$ ⑤ \$\\dfrac{3}{2}\$  
\#\## 정답  
③  
\#\## 해설  
\$\\sqrt{125} \= \\sqrt{5^3} \= 5^{\\frac{3}{2}}\$이므로  
\$5^{x \+ 1} \= 5^{\\frac{3}{2}}\$  
\$x \+ 1 \= \\dfrac{3}{2} \\implies x \= \\dfrac{1}{2}\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXP\_EQUATION\_RADICAL", "primaryMethod": "우변 √125를 5^(3/2)로 바꾸어 밑을 5로 통일한 뒤 지수를 비교한다.", "decisiveStep": "√125 \= 5^(3/2)로 변환해 x+1=3/2를 얻는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수방정식", "l4": "밑 통일"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "RPM\_ONLY (H2-M1-RPM-015: 현재 ACTIVE에 안전한 대응 machine key 미확정)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑을 5로 통일해 지수를 비교하는 기본 1단계 문항이다.", "level": "하", "item4slot": {"given": \["지수방정식"\], "goal": \["해"\], "method": \["지수법칙"\], "condition": \[\]}, "hold": "RPM\_ONLY"}  
\`\`\`

\## Q02  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
다음은 상용로그표의 일부이다. 이 표를 이용하여 구한 \$\\log 594\$의 값은? \[3.5점\]

\<table class="standard-table"\>\<thead\>\<tr\>\<th\>수\</th\>\<th\>...\</th\>\<th\>4\</th\>\<th\>5\</th\>\<th\>6\</th\>\<th\>...\</th\>\</tr\>\</thead\>\<tbody\>\<tr\>\<td\>\$\\vdots\$\</td\>\<td\>...\</td\>\<td\>\$\\vdots\$\</td\>\<td\>\$\\vdots\$\</td\>\<td\>\$\\vdots\$\</td\>\<td\>...\</td\>\</tr\>\<tr\>\<td\>\$5.9\$\</td\>\<td\>...\</td\>\<td\>\$.7738\$\</td\>\<td\>\$.7745\$\</td\>\<td\>\$.7752\$\</td\>\<td\>...\</td\>\</tr\>\<tr\>\<td\>\$6.0\$\</td\>\<td\>...\</td\>\<td\>\$.7810\$\</td\>\<td\>\$.7818\$\</td\>\<td\>\$.7825\$\</td\>\<td\>...\</td\>\</tr\>\<tr\>\<td\>\$6.1\$\</td\>\<td\>...\</td\>\<td\>\$.7882\$\</td\>\<td\>\$.7889\$\</td\>\<td\>\$.7896\$\</td\>\<td\>...\</td\>\</tr\>\</tbody\>\</table\>  
\#\## 선지  
① \$0.2262\$ ② \$0.7738\$ ③ \$1.7738\$ ④ \$2.7738\$ ⑤ \$7.738\$  
\#\## 정답  
④  
\#\## 해설  
표에서 \$5.9\$의 행과 \$4\$의 열이 만나는 값이 \$0.7738\$이므로 \$\\log 5.94 \= 0.7738\$이다.  
\$594 \= 5.94 \\times 10^2\$이므로  
\$\\log 594 \= \\log(5.94 \\times 10^2) \= 2 \+ \\log 5.94 \= 2 \+ 0.7738 \= 2.7738\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-COMMON\_LOG\_TABLE\_SCALE", "primaryMethod": "표에서 log 5.94 \= 0.7738을 읽고 594=5.94×10²의 정수 부분 2를 더한다.", "decisiveStep": "log 5.94 \= 0.7738을 읽어 2를 더하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "상용로그", "l4": "상용로그표·자릿수"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "RPM\_ONLY (H2-M1-RPM-011: 현재 ACTIVE에 안전한 대응 machine key 미확정)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상용로그표 값에 10²의 정수 부분 2를 더하는 기본 1단계 문항이다.", "level": "하", "item4slot": {"given": \["상용로그"\], "goal": \["값"\], "method": \["정수부분", "소수부분"\], "condition": \[\]}, "hold": "RPM\_ONLY"}  
\`\`\`

\## Q03  
- 형식: 객관식  
- 배점: 3.7  
\#\## 발문  
\$\\sqrt\[3\]{\\sqrt{a^4 b^7}} \\times \\sqrt{\\sqrt\[3\]{a^8 b^{11}}} \= a^x b^y\$일 때, \$x \+ y\$의 값은? (단, \$a \> 0\$, \$b \> 0\$) \[3.7점\]  
\#\## 선지  
① \$4\$ ② \$5\$ ③ \$6\$ ④ \$7\$ ⑤ \$8\$  
\#\## 정답  
②  
\#\## 해설  
중첩된 거듭제곱근을 유리수 지수로 나타내면  
\$\\sqrt\[3\]{\\sqrt{a^4 b^7}} \= (a^4 b^7)^{\\frac{1}{6}} \= a^{\\frac{2}{3}} b^{\\frac{7}{6}}\$  
\$\\sqrt{\\sqrt\[3\]{a^8 b^{11}}} \= (a^8 b^{11})^{\\frac{1}{6}} \= a^{\\frac{4}{3}} b^{\\frac{11}{6}}\$  
두 식을 곱하면  
\$a^{\\frac{2}{3} \+ \\frac{4}{3}} b^{\\frac{7}{6} \+ \\frac{11}{6}} \= a^2 b^3\$  
따라서 \$x \= 2\$, \$y \= 3\$이므로 \$x \+ y \= 2 \+ 3 \= 5\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-NESTED\_RADICAL\_TWO\_VARS", "primaryMethod": "두 이중 근호를 각각 1/6제곱으로 바꾸어 밑이 같은 a, b의 지수를 더해 x, y를 구한다.", "decisiveStep": "두 식을 각각 a, b의 유리수 지수로 전개해 지수를 더하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수법칙", "l4": "지수식 계산"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENT\_LAW\_APPLICATION", "templateKey": "TPL\_EXPONENT\_LAW\_EVALUATION", "why": "H2-M1-RPM-005(FAMILY\_ACTIVE): 유리수 지수로 전개해 지수법칙으로 x, y를 계산하는 지수식 계산 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 문자가 포함된 이중 거듭제곱근을 유리수 지수로 고쳐 지수법칙을 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["거듭제곱근"\], "goal": \["합"\], "method": \["지수법칙"\], "condition": \["부호"\]}, "hold": ""}  
\`\`\`

\## Q04  
- 형식: 객관식  
- 배점: 3.7  
\#\## 발문  
\$\\log\_x(7 - x)\$의 값이 존재하도록 하는 모든 정수 \$x\$의 값의 합은? \[3.7점\]  
\#\## 선지  
① \$20\$ ② \$21\$ ③ \$22\$ ④ \$27\$ ⑤ \$28\$  
\#\## 정답  
①  
\#\## 해설  
(1) 밑 조건: \$x \> 0\$이고 \$x \\neq 1\$  
(2) 진수 조건: \$7 - x \> 0 \\implies x \< 7\$  
두 조건을 만족시키는 정수 \$x\$는 \$2, 3, 4, 5, 6\$이다.  
따라서 모든 정수 \$x\$의 값의 합은 \$2 \+ 3 \+ 4 \+ 5 \+ 6 \= 20\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-LOG\_DEF\_INT\_SUM", "primaryMethod": "밑 조건(x\>0, x≠1)과 진수 조건(x\<7)을 모두 만족하는 정수 2\~6을 더해 20을 구한다.", "decisiveStep": "밑 조건에서 x=1을 제외하고 2부터 6까지 더하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 뜻", "l4": "밑과 진수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_DOMAIN\_ELIGIBILITY", "templateKey": "TPL\_LOG\_BASE\_ARGUMENT\_INTEGER\_DOMAIN", "why": "H2-M1-RPM-008(DIRECT\_ACTIVE): 밑 조건과 진수 조건을 만족하는 정수 x를 구하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그의 밑 조건과 진수 조건을 동시에 만족하는 정수를 찾아 더하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["로그", "정수"\], "goal": \["합"\], "method": \["정의역"\], "condition": \["정수"\]}, "hold": ""}  
\`\`\`

\## Q05  
- 형식: 객관식  
- 배점: 3.9  
\#\## 발문  
다음 중 함수 \$y \= 4^{x - 2} \+ 2\$에 대한 설명으로 옳지 않은 것은? \[3.9점\]  
\#\## 선지  
① 그래프는 점 \$(2, 3)\$을 지난다. ② 정의역은 실수 전체의 집합이다. ③ \$x\$의 값이 증가하면 \$y\$의 값도 증가한다. ④ 그래프는 \$y \= \\log\_4(x - 2\) \+ 2\$의 그래프와 직선 \$y \= x\$에 대하여 대칭이다. ⑤ 그래프의 점근선은 \$x \= 2\$이다.  
\#\## 정답  
⑤  
\#\## 해설  
① \$x \= 2\$일 때 \$y \= 4^0 \+ 2 \= 3\$이므로 점 \$(2, 3)\$을 지난다. (참)  
② 지수함수의 정의역은 실수 전체의 집합이다. (참)  
③ 밑이 \$4 \> 1\$이므로 증가함수이다. (참)  
④ \$y \= 4^{x - 2} \+ 2\$에서 \$x - 2 \= \\log\_4(y - 2)\$, 즉 \$x \= \\log\_4(y - 2\) \+ 2\$이므로 역함수와 직선 \$y \= x\$ 대칭이다. (참)  
⑤ \$4^{x - 2} \> 0\$이므로 그래프의 점근선은 직선 \$y \= 2\$이다. (거짓)  
따라서 옳지 않은 것은 ⑤이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXP\_GRAPH\_ASYMPTOTE\_TRAP", "primaryMethod": "지수함수 y=4^(x-2)+2의 정점, 정의역, 증가성, 역함수, 수평 점근선을 선지별로 판별한다.", "decisiveStep": "점근선이 x=2가 아니라 y=2임을 확인해 ⑤를 거짓으로 잡는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 그래프", "l4": "증가·감소"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_PROPERTIES", "templateKey": "TPL\_FUNCTION\_GRAPH\_PROPERTY\_JUDGMENT", "why": "H2-M1-RPM-013(DIRECT\_BINDING\_GAP): 지수함수의 정점·정의역·증가성·역함수·점근선 성질 판정"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동된 지수함수의 점근선 축 혼동 함정을 판별하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["지수함수"\], "goal": \["판정"\], "method": \["역함수", "평행이동"\], "condition": \[\]}, "hold": "BINDING\_GAP"}  
\`\`\`

\## Q06  
- 형식: 객관식  
- 배점: 3.9  
\#\## 발문  
\$\\theta\$가 제\$2\$사분면의 각이고 \$\\tan\\theta \= \-\\dfrac{1}{3}\$일 때, \$\\sin\\theta \+ \\cos\\theta\$의 값은? \[3.9점\]  
\#\## 선지  
① \$-\\dfrac{2\\sqrt{10}}{5}\$ ② \$-\\dfrac{3\\sqrt{10}}{10}\$ ③ \$-\\dfrac{\\sqrt{10}}{5}\$ ④ \$\\dfrac{\\sqrt{10}}{5}\$ ⑤ \$\\dfrac{2\\sqrt{10}}{5}\$  
\#\## 정답  
③  
\#\## 해설  
\$\\theta\$가 제\$2\$사분면의 각이고 \$\\tan\\theta \= \-\\dfrac{1}{3}\$이므로  
동경 위에 점 \$P(-3, 1)\$을 잡으면 \$r \= \\sqrt{(-3)^2 \+ 1^2} \= \\sqrt{10}\$이다.  
\$\\sin\\theta \= \\dfrac{1}{\\sqrt{10}}\$, \$\\cos\\theta \= \-\\dfrac{3}{\\sqrt{10}}\$  
따라서 \$\\sin\\theta \+ \\cos\\theta \= \\dfrac{1 - 3}{\\sqrt{10}} \= \-\\dfrac{2}{\\sqrt{10}} \= \-\\dfrac{\\sqrt{10}}{5}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-05", "subUnitKey": "H15-M1-05-TRIGONOMETRIC\_DEFINITION", "conceptClusterKey": "H15-M1-05-TRIG\_TAN\_Q2\_SUM", "primaryMethod": "제2사분면 각과 tan θ=-1/3으로부터 동경 위 점 P(-3, 1)을 잡아 sin θ, cos θ를 구해 더한다.", "decisiveStep": "제2사분면 부호에 맞춰 P(-3, 1), r=√10을 설정하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 뜻", "l4": "삼각함수 값"}, "ptTplCandidate": {"problemTypeKey": "PT\_TRIG\_QUADRANT\_EVALUATION", "templateKey": "TPL\_TRIG\_SIGN\_PYTHAGOREAN\_RATIO", "why": "H2-M1-RPM-032(DIRECT\_ACTIVE): 사분면 부호와 tan θ 값으로 sin θ, cos θ를 구하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "탄젠트 값과 사분면 조건으로 사인과 코사인을 구해 더하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": \["삼각함수"\], "goal": \["합"\], "method": \["삼각비"\], "condition": \["사분면", "부호"\]}, "hold": ""}  
\`\`\`

\## Q07  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
함수 \$y \= \\log\_2(x \+ a) \+ b\$의 그래프의 점근선이 직선 \$x \= \-4\$이고 \$y\$절편이 \$5\$일 때, 두 상수 \$a, b\$에 대하여 \$a \+ b\$의 값은? \[4점\]  
\#\## 선지  
① \$6\$ ② \$7\$ ③ \$8\$ ④ \$9\$ ⑤ \$10\$  
\#\## 정답  
②  
\#\## 해설  
로그함수 \$y \= \\log\_2(x \+ a) \+ b\$의 점근선은 \$x \+ a \= 0\$, 즉 \$x \= \-a\$이다.  
점근선이 \$x \= \-4\$이므로 \$-a \= \-4 \\implies a \= 4\$  
\$y\$절편이 \$5\$이므로 \$x \= 0, y \= 5\$를 대입하면  
\$5 \= \\log\_2(0 \+ 4\) \+ b \= 2 \+ b \\implies b \= 3\$  
따라서 \$a \+ b \= 4 \+ 3 \= 7\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-LOG\_ASYMPTOTE\_Y\_INTERCEPT", "primaryMethod": "점근선 x=-a=-4에서 a=4를 구하고 y절편 (0,5) 대입으로 b=3을 구해 더한다.", "decisiveStep": "점근선 x=-a=-4와 x=0 대입식을 순서대로 푸는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 그래프", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_TRANSFORM", "templateKey": "TPL\_FUNCTION\_GRAPH\_TRANSLATION", "why": "H2-M1-RPM-022(DIRECT\_BINDING\_GAP): 로그함수 그래프의 평행이동과 점근선·y절편으로 미정계수 결정"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그함수의 수직 점근선과 y절편 조건으로 미정계수 두 개를 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["로그함수", "점근선"\], "goal": \["합"\], "method": \["대입", "평행이동"\], "condition": \[\]}, "hold": "BINDING\_GAP"}  
\`\`\`

\## Q08  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
다음 중 \<보기\>에서 옳은 것을 모두 고른 것은? \[4점\]  
\<보기\>  
ㄱ. \$-81\$의 네제곱근 중에서 실수인 것은 없다.  
ㄴ. \$-7\$의 다섯제곱근 중 실수인 것은 \$-\\sqrt\[5\]{7}\$이다.  
ㄷ. \$\\sqrt\[4\]{(-5)^4}\$는 \$-5\$이다.  
ㄹ. \$n\$이 짝수일 때, \$-16\$의 \$n\$제곱근 중에서 실수인 것은 \$2\$개이다.  
\#\## 선지  
① ㄱ ② ㄴ ③ ㄱ, ㄷ ④ ㄱ, ㄴ ⑤ ㄴ, ㄹ  
\#\## 정답  
④  
\#\## 해설  
ㄱ. 음수의 짝수 제곱근 중 실수인 것은 없다. (참)  
ㄴ. 홀수 제곱근 중 실수인 것은 \$\\sqrt\[5\]{-7} \= \-\\sqrt\[5\]{7}\$이다. (참)  
ㄷ. \$\\sqrt\[4\]{(-5)^4} \= \|-5\| \= 5 \\neq \-5\$ (거짓)  
ㄹ. \$n\$이 짝수일 때 음수 \$-16\$의 \$n\$제곱근 중 실수인 것은 \$0\$개이다. (거짓)  
따라서 옳은 것은 ㄱ, ㄴ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-NTH\_ROOT\_BOKI\_TRUTH", "primaryMethod": "음수의 짝수·홀수 제곱근 실근 개수와 짝수 제곱근 기호의 양수 값을 보기별로 판별한다.", "decisiveStep": "ㄷ에서 ⁴√((-5)⁴)=5임을, ㄹ에서 음수의 짝수 제곱근이 0개임을 확인하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "거듭제곱근", "l4": "n제곱근"}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "RPM\_ONLY (H2-M1-RPM-001: 현재 ACTIVE에 안전한 대응 machine key 미확정)"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "거듭제곱근의 정의와 실수 개수 규칙을 합답형으로 점검하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["거듭제곱근"\], "goal": \["판정"\], "method": \["거듭제곱근"\], "condition": \["실수"\]}, "hold": "RPM\_ONLY"}  
\`\`\`

\## Q09  
- 형식: 객관식  
- 배점: 4.1  
\#\## 발문  
\$1\$이 아닌 두 양수 \$a, b\$에 대하여 \$\\log\_{\\sqrt{3}} a \= 6\$, \$\\log\_b \\dfrac{1}{27} \= \-3\$일 때, \$\\log\_{b^2} a \+ \\log\_{a^2} b\$의 값은? \[4.1점\]  
\#\## 선지  
① \$\\dfrac{5}{3}\$ ② \$\\dfrac{4}{3}\$ ③ \$1\$ ④ \$\\dfrac{2}{3}\$ ⑤ \$\\dfrac{1}{3}\$  
\#\## 정답  
①  
\#\## 해설  
\$\\log\_{\\sqrt{3}} a \= 6\$에서 \$a \= (\\sqrt{3})^6 \= 3^3 \= 27\$  
\$\\log\_b \\dfrac{1}{27} \= \-3\$에서 \$b^{-3} \= \\dfrac{1}{27} \= 3^{-3}\$ (\$b \> 0\$)이므로 \$b \= 3\$  
따라서 구하는 값은  
\$\\log\_{b^2} a \+ \\log\_{a^2} b \= \\log\_{3^2} 3^3 \+ \\log\_{3^6} 3 \= \\dfrac{3}{2} \+ \\dfrac{1}{6} \= \\dfrac{10}{6} \= \\dfrac{5}{3}\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-LOG\_POWER\_BASE\_EXPONENT", "primaryMethod": "로그의 정의로 a=27, b=3을 구한 뒤 밑의 지수 성질 log\_(b^m) a^n \= (n/m)log\_b a로 계산한다.", "decisiveStep": "a=3³, b=3을 구해 log\_(3²) 3³ \+ log\_(3⁶) 3 \= 3/2 \+ 1/6을 계산하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 성질", "l4": "곱·몫·거듭제곱"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_IDENTITY\_OPERATIONS", "templateKey": "TPL\_LOG\_INTEGER\_DIFFERENCE\_PRODUCT", "why": "H2-M1-RPM-009(DIRECT\_ACTIVE): 로그의 정의와 밑·진수의 거듭제곱 성질로 식의 값을 계산"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그 정의로 두 양수를 구하고 밑과 진수의 거듭제곱 성질을 적용하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["로그"\], "goal": \["합"\], "method": \["로그"\], "condition": \["부호"\]}, "hold": ""}  
\`\`\`

\## Q10  
- 형식: 객관식  
- 배점: 4.3  
\#\## 발문  
\$0 \< a \< b \< 1\$일 때, 세 수 \$A \= \\log\_b a\$, \$B \= \\log\_a \\dfrac{b}{a}\$, \$C \= \\log\_a b\$의 대소 관계를 바르게 나타낸 것은? \[4.3점\]  
\#\## 선지  
① \$A \< B \< C\$ ② \$A \< C \< B\$ ③ \$B \< C \< A\$ ④ \$C \< A \< B\$ ⑤ \$C \< B \< A\$  
\#\## 정답  
③  
\#\## 해설  
\$0 \< a \< b \< 1\$에서 밑 \$a\$는 \$0 \< a \< 1\$이므로  
\$\\log\_a 1 \< \\log\_a b \< \\log\_a a\$, 즉 \$0 \< C \< 1\$이다.  
따라서 \$B \= \\log\_a \\dfrac{b}{a} \= \\log\_a b - 1 \= C - 1 \< 0\$이고,  
\$A \= \\log\_b a \= \\dfrac{1}{\\log\_a b} \= \\dfrac{1}{C} \> 1\$이다.  
그러므로 \$B \< 0 \< C \< 1 \< A\$, 즉 \$B \< C \< A\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-LOG\_ORDERING\_0\_LT\_A\_LT\_B\_LT\_1", "primaryMethod": "0\<a\<b\<1에서 C=log\_a b ∈ (0,1)을 기준으로 B=C-1\<0과 A=1/C\>1의 부등식을 비교한다.", "decisiveStep": "0\<C\<1 범위로부터 B=C-1\<0과 A=1/C\>1의 경계를 0과 1로 분리하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 성질", "l4": "밑의 변환"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_IDENTITY\_OPERATIONS", "templateKey": "TPL\_LOG\_BASE\_CHANGE\_PARAMETER", "why": "H2-M1-RPM-010(FAMILY\_ACTIVE): 밑변환 공식과 매개변수 C=log\_a b를 이용해 대소 비교"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "0과 1 사이의 두 밑·진수에 대해 로그값의 부호와 역수 대소를 0, 1 기준으로 비교하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["로그", "실수"\], "goal": \["대소비교"\], "method": \["로그", "밑변환"\], "condition": \["범위"\]}, "hold": ""}  
\`\`\`

\## Q11  
- 형식: 객관식  
- 배점: 4.3  
\#\## 발문  
정의역이 \$\\{x \\mid \-1 \\le x \\le 2\\}\$일 때, 함수 \$y \= 3^{x^2 - 2x - 1}\$의 최댓값을 \$M\$, 최솟값을 \$m\$이라 할 때, \$M - m\$의 값은? \[4.3점\]  
\#\## 선지  
① \$\\dfrac{74}{9}\$ ② \$\\dfrac{76}{9}\$ ③ \$\\dfrac{78}{9}\$ ④ \$\\dfrac{79}{9}\$ ⑤ \$\\dfrac{80}{9}\$  
\#\## 정답  
⑤  
\#\## 해설  
\$g(x) \= x^2 - 2x - 1 \= (x - 1)^2 - 2\$라 하면 \$-1 \\le x \\le 2\$에서  
- \$x \= 1\$일 때 최솟값 \$g(1) \= \-2\$  
- \$x \= \-1\$일 때 최댓값 \$g(-1) \= (-1 - 1)^2 - 2 \= 2\$  
밑이 \$3 \> 1\$이므로 \$y \= 3^{g(x)}\$는  
최댓값 \$M \= 3^2 \= 9\$, 최솟값 \$m \= 3^{-2} \= \\dfrac{1}{9}\$  
따라서 \$M - m \= 9 - \\dfrac{1}{9} \= \\dfrac{80}{9}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXP\_QUADRATIC\_MAX\_MIN\_DIFF", "primaryMethod": "지수 g(x)=(x-1)²-2의 \[-1, 2\] 최댓값 2와 최솟값 \-2를 구해 밑 3\>1인 지수함수의 M-m을 계산한다.", "decisiveStep": "완전제곱식으로 구간 내 g(x)의 최솟값 \-2와 최댓값 2를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 활용", "l4": "최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_EXTREMUM", "templateKey": "TPL\_FUNCTION\_EXTREMUM\_INTERVAL\_ENDPOINT", "why": "H2-M1-RPM-019(FAMILY\_BINDING\_GAP): 닫힌구간 \[-1, 2\]에서 합성 지수함수의 최댓값·최솟값 구하기"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차함수를 지수로 갖는 지수함수의 닫힌구간 최댓값과 최솟값 차를 구하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": \["지수함수", "이차함수"\], "goal": \["차"\], "method": \["완전제곱식", "최댓값", "최솟값"\], "condition": \["정의역"\]}, "hold": "BINDING\_GAP"}  
\`\`\`

\## Q12  
- 형식: 객관식  
- 배점: 4.3  
\#\## 발문  
양의 정수 \$x, y\$가 \$\\log(7x - 2\) - \\log x \= 1 - \\log y\$를 만족할 때, \$x \+ y\$의 값은? \[4.3점\]  
\#\## 선지  
① \$2\$ ② \$3\$ ③ \$4\$ ④ \$5\$ ⑤ \$6\$  
\#\## 정답  
②  
\#\## 해설  
주어진 식을 정리하면 \$\\log \\dfrac{7x - 2}{x} \= \\log \\dfrac{10}{y}\$이므로  
\$\\dfrac{7x - 2}{x} \= \\dfrac{10}{y} \\implies (7x - 2)y \= 10x\$  
- \$x\$가 홀수일 때: \$\\gcd(x, 7x - 2\) \= 1\$이므로 \$7x - 2\$는 \$10\$의 약수여야 하고 \$7x - 2 \\ge 5\$이므로 \$7x - 2 \= 5 \\implies x \= 1\$, 이때 \$y \= 2\$  
- \$x\$가 짝수일 때: \$x \= 2m\$ (\$m \\ge 1\$)이라 하면 \$(14m - 2)y \= 20m \\implies (7m - 1)y \= 10m\$이고 \$\\gcd(m, 7m - 1\) \= 1\$이므로 \$7m - 1\$은 \$10\$의 약수여야 하나, \$7m - 1 \\ge 6\$인 \$10\$의 약수는 \$10\$뿐이고 \$7m - 1 \= 10\$은 정수 해가 없다.  
따라서 유일한 양의 정수 해는 \$x \= 1, y \= 2\$이므로 \$x \+ y \= 3\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-LOG\_EQUATION\_INTEGER\_PAIR", "primaryMethod": "로그 방정식을 부정방정식 (7x-2)y=10x로 변형한 뒤 서로소 성질과 약수로 유일한 양의 정수해 (1,2)를 구한다.", "decisiveStep": "x의 홀짝성에 따라 서로소 관계를 적용해 7x-2=5로부터 x=1, y=2를 확정하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 성질", "l4": "곱·몫·거듭제곱"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_IDENTITY\_OPERATIONS", "templateKey": "TPL\_LOG\_INTEGER\_DIFFERENCE\_PRODUCT", "why": "H2-M1-RPM-009(DIRECT\_ACTIVE): 로그의 차와 합 성질로 정수 부정방정식을 유도해 해를 구하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그 방정식을 정수 부정방정식으로 바꾸어 약수·서로소 조건으로 해를 찾아야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["로그방정식", "자연수"\], "goal": \["합"\], "method": \["로그", "약수", "경우분류"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q13  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
세 양수 \$a, b, c\$에 대하여 \$3^a \= 9^b \= k^{\\frac{1}{c}}\$, \$a \+ b \= 2abc\$일 때, 실수 \$k\$의 값은? \[4.5점\]  
\#\## 선지  
① \$\\sqrt{3}\$ ② \$3\$ ③ \$3\\sqrt{2}\$ ④ \$3\\sqrt{3}\$ ⑤ \$9\$  
\#\## 정답  
④  
\#\## 해설  
\$3^a \= 9^b \= 3^{2b}\$이므로 \$a \= 2b\$이다.  
이를 \$a \+ b \= 2abc\$에 대입하면  
\$2b \+ b \= 2(2b)bc \\implies 3b \= 4b^2 c\$  
\$b \> 0\$이므로 양변을 \$b\$로 나누면 \$4bc \= 3\$, 즉 \$bc \= \\dfrac{3}{4}\$이고 \$ac \= 2bc \= \\dfrac{3}{2}\$이다.  
한편 \$3^a \= k^{\\frac{1}{c}}\$의 양변을 \$c\$제곱하면  
\$k \= 3^{ac} \= 3^{\\frac{3}{2}} \= 3\\sqrt{3}\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-EXP\_THREE\_VAR\_PROPORTION", "primaryMethod": "3^a=9^b에서 a=2b를 얻어 a+b=2abc에 대입해 ac=3/2을 구한 뒤 k=3^(ac)를 계산한다.", "decisiveStep": "a=2b를 대입해 bc=3/4, ac=3/2을 구하고 k=3^(ac)에 대입하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수법칙", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENT\_LAW\_APPLICATION", "templateKey": "TPL\_EXPONENT\_LAW\_RECIPROCAL\_POWER", "why": "H2-M1-RPM-006(FAMILY\_ACTIVE): 지수 조건식 3^a=9^b=k^(1/c)와 비례식으로 k를 구하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수 등식에서 문자 소거 후 관계식 양변을 나누어 ac 값을 직접 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["지수", "방정식"\], "goal": \["값"\], "method": \["지수법칙", "대입"\], "condition": \["부호"\]}, "hold": ""}  
\`\`\`

\## Q14  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
\$(5^{\\log\_{\\sqrt{5}} 2} \+ 3^{\\log\_3 5})^2 - (5^{\\log\_{\\sqrt{5}} 2} - 3^{\\log\_3 5})^2\$의 값은? \[4.5점\]  
\#\## 선지  
① \$80\$ ② \$60\$ ③ \$40\$ ④ \$20\$ ⑤ \$16\$  
\#\## 정답  
①  
\#\## 해설  
\$A \= 5^{\\log\_{\\sqrt{5}} 2} \= 5^{2\\log\_5 2} \= 5^{\\log\_5 4} \= 4\$  
\$B \= 3^{\\log\_3 5} \= 5\$  
따라서 구하는 값은  
\$(A \+ B)^2 - (A - B)^2 \= 4AB \= 4 \\times 4 \\times 5 \= 80\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-02", "subUnitKey": "H15-M1-02-LOGARITHM", "conceptClusterKey": "H15-M1-02-EXP\_LOG\_POWER\_IDENTITY", "primaryMethod": "a^(log\_a b)=b 성질로 각 항을 4와 5로 정리한 뒤 (A+B)²-(A-B)²=4AB에 대입한다.", "decisiveStep": "5^(log\_(√5) 2\) \= 5^(2log\_5 2\) \= 4로 정리하고 4AB를 계산하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 성질", "l4": "곱·몫·거듭제곱"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_IDENTITY\_OPERATIONS", "templateKey": "TPL\_LOG\_INTEGER\_DIFFERENCE\_PRODUCT", "why": "H2-M1-RPM-009(DIRECT\_ACTIVE): 로그 항등식 a^(log\_a b)=b와 곱셈공식으로 식의 값을 구하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그 항등식 a^(log\_a b)=b와 곱셈 공식 (A+B)²-(A-B)²=4AB를 결합한 문항이다.", "level": "중", "item4slot": {"given": \["지수", "로그"\], "goal": \["값"\], "method": \["로그", "곱셈공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q15  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
두 함수 \$y \= \\log\_2 x\$, \$y \= \\log\_4(x \+ 2)\$에 대하여 다음 \<보기\>에서 옳은 것만을 있는 대로 고른 것은? \[4.5점\]  
\<보기\>  
ㄱ. 두 함수의 교점의 \$y\$좌표는 \$1\$이다.  
ㄴ. \$\\log\_2 1.5 \< \\log\_4 3.5\$  
ㄷ. \$\\log\_2 3 \> \\log\_4 5\$  
\#\## 선지  
① ㄱ ② ㄱ, ㄴ ③ ㄱ, ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ  
\#\## 정답  
⑤  
\#\## 해설  
ㄱ. \$\\log\_2 x \= \\log\_4(x \+ 2)\$에서 진수 조건 \$x \> 0\$이고 \$\\log\_4 x^2 \= \\log\_4(x \+ 2)\$이므로  
\$x^2 \= x \+ 2 \\implies (x - 2)(x \+ 1\) \= 0 \\implies x \= 2\$  
교점은 \$(2, \\log\_2 2\) \= (2, 1)\$이므로 \$y\$좌표는 \$1\$이다. (참)  
ㄴ. \$0 \< x \< 2\$일 때 \$x^2 \< x \+ 2\$이므로 \$\\log\_4 x^2 \< \\log\_4(x \+ 2)\$, 즉 \$\\log\_2 x \< \\log\_4(x \+ 2)\$이다.  
\$x \= 1.5\$를 대입하면 \$\\log\_2 1.5 \< \\log\_4 3.5\$이다. (참)  
ㄷ. \$x \> 2\$일 때 \$x^2 \> x \+ 2\$이므로 \$\\log\_2 x \> \\log\_4(x \+ 2)\$이다.  
\$x \= 3\$을 대입하면 \$\\log\_2 3 \> \\log\_4 5\$이다. (참)  
따라서 옳은 것은 ㄱ, ㄴ, ㄷ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": "H15-M1-04-LOGARITHMIC\_FUNCTION\_GRAPH", "conceptClusterKey": "H15-M1-04-LOG\_INTERSECTION\_GRAPH\_COMPARE", "primaryMethod": "두 로그함수의 교점 (2, 1)을 구하고 교점 좌우에서 x²과 x+2의 대소로 ㄴ, ㄷ 부등식을 판별한다.", "decisiveStep": "교점 x=2를 기준으로 0\<x\<2에서 log\_2 x \< log\_4(x+2), x\>2에서 부등호가 반대가 됨을 활용하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "H2-M1-RPM-028(DIRECT\_ACTIVE): 두 로그함수 그래프의 교점을 구해 구간별 대소 관계를 판별"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "교점 좌표를 구한 뒤 그 좌우 구간에서의 두 로그함수 대소 관계를 수치 부등식에 연결하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["로그함수"\], "goal": \["판정", "대소비교"\], "method": \["로그방정식", "대소비교"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q16  
- 형식: 객관식  
- 배점: 4.7  
\#\## 발문  
이차방정식 \$4x^2 - x \+ a \= 0\$의 두 근이 \$\\sin\\theta, \\cos\\theta\$일 때, \$\\tan\\theta\$와 \$\\dfrac{1}{\\tan\\theta}\$을 두 근으로 하고 \$x^2\$의 계수가 \$15\$인 이차방정식은? (단, \$a\$는 상수이다.) \[4.7점\]  
\#\## 선지  
① \$15x^2 \+ 16x \+ 15 \= 0\$ ② \$15x^2 \+ 24x \+ 15 \= 0\$ ③ \$15x^2 \+ 32x \+ 15 \= 0\$ ④ \$15x^2 - 32x \+ 15 \= 0\$ ⑤ \$15x^2 \+ 30x \+ 15 \= 0\$  
\#\## 정답  
③  
\#\## 해설  
근과 계수의 관계에 의하여 \$\\sin\\theta \+ \\cos\\theta \= \\dfrac{1}{4}\$, \$\\sin\\theta\\cos\\theta \= \\dfrac{a}{4}\$이다.  
\$(\\sin\\theta \+ \\cos\\theta)^2 \= 1 \+ 2\\sin\\theta\\cos\\theta \= \\dfrac{1}{16}\$  
\$2\\sin\\theta\\cos\\theta \= \-\\dfrac{15}{16} \\implies \\sin\\theta\\cos\\theta \= \-\\dfrac{15}{32}\$  
새로운 두 근 \$\\tan\\theta, \\dfrac{1}{\\tan\\theta}\$의 합과 곱은  
- 합: \$\\tan\\theta \+ \\dfrac{1}{\\tan\\theta} \= \\dfrac{\\sin\\theta}{\\cos\\theta} \+ \\dfrac{\\cos\\theta}{\\sin\\theta} \= \\dfrac{1}{\\sin\\theta\\cos\\theta} \= \-\\dfrac{32}{15}\$  
- 곱: \$\\tan\\theta \\cdot \\dfrac{1}{\\tan\\theta} \= 1\$  
따라서 구하는 이차방정식은  
\$15\\left(x^2 \+ \\dfrac{32}{15}x \+ 1\\right) \= 0 \\implies 15x^2 \+ 32x \+ 15 \= 0\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-05", "subUnitKey": "H15-M1-05-TRIGONOMETRIC\_RELATION", "conceptClusterKey": "H15-M1-05-TRIG\_QUADRATIC\_TAN\_RECIP\_EQ", "primaryMethod": "sin θ+cos θ=1/4에서 sin θ cos θ=-15/32를 구한 뒤 tan θ+1/tan θ=1/(sin θ cos θ)로 새 이차방정식을 세운다.", "decisiveStep": "tan θ+cot θ \= 1/(sin θ cos θ) \= \-32/15를 구해 최고차항 계수 15의 방정식을 작성하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 성질", "l4": "삼각함수 관계"}, "ptTplCandidate": {"problemTypeKey": "PT\_TRIG\_IDENTITY\_RELATIONS", "templateKey": "TPL\_TRIG\_RATIONAL\_IDENTITY\_RECOVERY", "why": "H2-M1-RPM-034(FAMILY\_ACTIVE): 근과 계수의 관계 및 삼각함수 상호관계로 유리식 tan θ \+ 1/tan θ를 구해 이차방정식 작성"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 근과 계수의 관계를 두 번 연결하고 삼각함수 역수 합 공식을 적용하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["이차방정식", "삼각함수"\], "goal": \["방정식구하기"\], "method": \["근과계수의관계", "삼각함수의상호관계"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q17  
- 형식: 객관식  
- 배점: 4.7  
\#\## 발문  
어떤 원통형 펌프의 반지름을 \$R\$, \$1\$분 동안의 유체 배출량을 \$Q\$, 흡입구의 유속을 \$V\$라 하면 \$R \= k\\left(\\dfrac{Q}{V}\\right)^{\\frac{1}{3}}\$ (단, \$V \> 0\$, \$k\$는 양의 상수)가 성립한다고 한다. 두 펌프 \$A, B\$의 반지름을 각각 \$R\_A, R\_B\$, \$1\$분 동안의 유체 배출량을 각각 \$Q\_A, Q\_B\$, 흡입구의 유속을 각각 \$V\_A, V\_B\$라 하자. \$Q\_A\$가 \$Q\_B\$의 \$\\dfrac{9}{4}\$배, \$V\_A\$가 \$V\_B\$의 \$\\dfrac{1}{12}\$배이고 \$R\_A - R\_B \= 20\$일 때, \$R\_B\$의 값은? \[4.7점\]  
\#\## 선지  
① \$5\$ ② \$10\$ ③ \$15\$ ④ \$20\$ ⑤ \$30\$  
\#\## 정답  
②  
\#\## 해설  
\$Q\_A \= \\dfrac{9}{4}Q\_B\$, \$V\_A \= \\dfrac{1}{12}V\_B\$를 관계식에 대입하면  
\$R\_A \= k\\left(\\dfrac{\\frac{9}{4}Q\_B}{\\frac{1}{12}V\_B}\\right)^{\\frac{1}{3}} \= k\\left(27 \\cdot \\dfrac{Q\_B}{V\_B}\\right)^{\\frac{1}{3}} \= 3 k\\left(\\dfrac{Q\_B}{V\_B}\\right)^{\\frac{1}{3}} \= 3R\_B\$  
\$R\_A - R\_B \= 20\$에 \$R\_A \= 3R\_B\$를 대입하면  
\$3R\_B - R\_B \= 20 \\implies 2R\_B \= 20 \\implies R\_B \= 10\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-FRACTIONAL\_POWER\_RATIO\_WORD", "primaryMethod": "Q\_A=(9/4)Q\_B, V\_A=(1/12)V\_B를 관계식에 대입해 R\_A=3R\_B를 도출한 뒤 차 조건으로 R\_B를 구한다.", "decisiveStep": "(9/4)/(1/12)=27의 세제곱근으로 R\_A=3R\_B를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수법칙", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENT\_LAW\_APPLICATION", "templateKey": "TPL\_EXPONENT\_LAW\_RECIPROCAL\_POWER", "why": "H2-M1-RPM-006(FAMILY\_ACTIVE): 주어진 지수 관계식에 비율 조건을 대입해 미지수를 구하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실생활 유리수 지수 관계식에서 두 대상의 비율을 대입해 선형 관계식을 이끌어내는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["지수", "방정식"\], "goal": \["값"\], "method": \["대입", "지수법칙"\], "condition": \["부호"\]}, "hold": ""}  
\`\`\`

\## Q18  
- 형식: 객관식  
- 배점: 4.9  
\#\## 발문  
\$1\$보다 큰 양수 \$a\$에 대하여 함수 \$y \= a^x \+ b\$의 그래프와 함수 \$y \= \\log\_a(x - b)\$의 그래프가 서로 다른 두 점 \$A, B\$에서 만나고 다음 \<조건\>을 만족시킨다.  
\<조건\>  
(가) 두 점 \$A, B\$ 사이의 거리는 \$2\\sqrt{2}\$이다.  
(나) 선분 \$AB\$의 수직이등분선은 \$x \+ y - 6 \= 0\$이다.  
\$a \+ b\$의 값은? (단, \$b\$는 상수이다.) \[4.9점\]  
\#\## 선지  
① \$\\sqrt{2} - 2\$ ② \$\\sqrt{2} - 1\$ ③ \$1\$ ④ \$\\sqrt{2}\$ ⑤ \$\\sqrt{2} \+ 1\$  
\#\## 정답  
④  
\#\## 해설  
\$a \> 1\$이므로 두 함수 \$y \= a^x \+ b\$와 \$y \= \\log\_a(x - b)\$는 서로 역함수 관계이고 모두 증가함수이므로 교점 \$A, B\$는 직선 \$y \= x\$ 위에 있다.  
선분 \$AB\$의 중점 \$M\$은 직선 \$y \= x\$와 수직이등분선 \$x \+ y - 6 \= 0\$의 교점이므로 \$M(3, 3)\$이다.  
두 점 \$A, B\$가 직선 \$y \= x\$ 위에 있고 \$\\overline{AB} \= 2\\sqrt{2}\$이므로 \$A(2, 2)\$, \$B(4, 4)\$이다.  
두 점이 곡선 \$y \= a^x \+ b\$ 위의 점이므로  
\$2 \= a^2 \+ b\$, \$4 \= a^4 \+ b\$  
두 식을 빼면 \$a^4 - a^2 \= 2 \\implies (a^2 - 2)(a^2 \+ 1\) \= 0\$  
\$a \> 1\$이므로 \$a^2 \= 2 \\implies a \= \\sqrt{2}\$, \$b \= 2 - a^2 \= 0\$  
따라서 \$a \+ b \= \\sqrt{2}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-INVERSE\_EXP\_LOG\_INTERSECTION\_BISECTOR", "primaryMethod": "증가 역함수 쌍의 교점이 y=x 위에 있음을 이용해 중점 (3,3)과 거리 2√2로 A(2,2), B(4,4)를 찾아 a, b를 연립한다.", "decisiveStep": "y=x와 수직이등분선 x+y-6=0의 교점 (3,3)에서 거리 √2만큼 떨어진 (2,2), (4,4)를 구하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "H2-M1-RPM-020(DIRECT\_BINDING\_GAP): 역함수 관계인 지수함수와 로그함수 그래프의 교점 조건 활용"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "역함수 교점의 y=x 성질, 수직이등분선 중점, 거리 조건으로 두 교점 좌표를 복원해 지수연립을 푸는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": \["지수함수", "로그함수", "직선", "거리"\], "goal": \["합"\], "method": \["역함수", "연립방정식"\], "condition": \["범위"\]}, "hold": "BINDING\_GAP"}  
\`\`\`

\## Q19  
- 형식: 객관식  
- 배점: 5  
\#\## 발문  
\$10\$보다 작은 자연수 \$m\$ (\$m \\ge 2\$)에 대하여 \$m^{12}\$의 \$n\$제곱근 중에서 정수가 존재하도록 하는 \$2\$ 이상의 자연수 \$n\$의 개수가 \$5\$가 되도록 하는 모든 \$m\$의 값의 합은? \[5점\]  
\#\## 선지  
① \$23\$ ② \$24\$ ③ \$25\$ ④ \$26\$ ⑤ \$27\$  
\#\## 정답  
①  
\#\## 해설  
\$m^{12}\$의 \$n\$제곱근 중 정수가 존재하려면 \$m^{\\frac{12}{n}}\$이 정수여야 한다.  
1\) \$m\$이 거듭제곱수가 아닌 경우 (\$m \= 2, 3, 5, 6, 7\$): \$n\$은 \$12\$의 \$2\$ 이상의 약수여야 하므로 \$n \\in \\{2, 3, 4, 6, 12\\}\$ (\$5\$개, 성립)  
2\) \$m \= 4, 9\$ (\$k^2\$ 꼴): \$m^{12} \= k^{24}\$이므로 \$n\$은 \$24\$의 \$2\$ 이상의 약수 \$\\{2, 3, 4, 6, 8, 12, 24\\}\$ (\$7\$개, 불성립)  
3\) \$m \= 8\$ (\$2^3\$ 꼴): \$8^{12} \= 2^{36}\$이므로 \$n\$은 \$36\$의 \$2\$ 이상의 약수 (\$8\$개, 불성립)  
따라서 조건을 만족시키는 \$m\$은 \$2, 3, 5, 6, 7\$이므로 합은 \$2 \+ 3 \+ 5 \+ 6 \+ 7 \= 23\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-01", "subUnitKey": "H15-M1-01-EXPONENT", "conceptClusterKey": "H15-M1-01-NTH\_ROOT\_INTEGER\_DIVISOR\_COUNT", "primaryMethod": "m을 소인수 거듭제곱 꼴 여부에 따라 2\~9를 분류해 m^(12/n)이 정수가 되는 2 이상 약수 n의 개수가 5개인 m을 찾는다.", "decisiveStep": "제곱수(4,9)와 세제곱수(8)는 지수가 24, 36으로 늘어나 약수 개수가 5개를 초과함을 분류하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "거듭제곱근", "l4": "실수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_ROOT\_INTEGER\_FEASIBILITY", "templateKey": "TPL\_ROOT\_INTEGER\_EXPONENT\_CASE\_COUNT", "why": "H2-M1-RPM-002(DIRECT\_ACTIVE): m^(12/n)이 정수가 되도록 하는 자연수 n의 개수로 m을 분류·탐색"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑 m의 거듭제곱수 여부에 따라 지수의 약수 개수가 달라짐을 정확히 분류해야 하는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": \["거듭제곱근", "자연수"\], "goal": \["합"\], "method": \["약수", "경우분류"\], "condition": \["정수", "개수"\]}, "hold": ""}  
\`\`\`

\## Q20  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
\[서술형 1\] 연립부등식  
\$\$\\begin{cases} \\left(\\dfrac{2}{3}\\right)^{2x - 1} \\ge \\left(\\dfrac{3}{2}\\right)^{x - 5} \\\\ \\log\_3 x \+ \\log\_3(x \+ 8\) \\le 2 \\end{cases}\$\$  
을 만족하는 \$x\$의 범위를 구하는 과정을 서술하시오. \[6점\]  
\#\## 정답  
\$0 \< x \\le 1\$  
\#\## 해설  
(1) 첫 번째 부등식: \$\\left(\\dfrac{2}{3}\\right)^{2x - 1} \\ge \\left(\\dfrac{2}{3}\\right)^{5 - x}\$에서 밑 \$\\dfrac{2}{3} \< 1\$이므로  
\$2x - 1 \\le 5 - x \\implies 3x \\le 6 \\implies x \\le 2\$  
(2) 두 번째 부등식: 진수 조건에 의하여 \$x \> 0\$이고 \$x \+ 8 \> 0\$이므로 \$x \> 0\$  
\$\\log\_3\\{x(x \+ 8)\\} \\le \\log\_3 9\$에서 밑 \$3 \> 1\$이므로  
\$x^2 \+ 8x \\le 9 \\implies x^2 \+ 8x - 9 \\le 0 \\implies (x \+ 9)(x - 1\) \\le 0\$  
\$-9 \\le x \\le 1\$과 진수 조건 \$x \> 0\$의 공통 범위는 \$0 \< x \\le 1\$  
(1), (2)의 공통 범위는 \$0 \< x \\le 1\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": "H15-M1-04-LOGARITHMIC\_FUNCTION\_APPLICATION", "conceptClusterKey": "H15-M1-04-EXP\_LOG\_SYSTEM\_INEQUALITY", "primaryMethod": "지수부등식과 진수 조건을 포함한 로그부등식을 각각 풀어 공통 범위를 구한다.", "decisiveStep": "로그부등식에서 진수 조건 x\>0을 적용해 0\<x≤1을 얻는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그부등식", "l4": "정의역·밑 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_INEQUALITY\_DOMAIN", "templateKey": "TPL\_LOG\_QUADRATIC\_INTERVAL\_INTERSECTION", "why": "H2-M1-RPM-025(DIRECT\_ACTIVE): 진수 조건과 로그부등식·지수부등식의 공통 해 범위를 구하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수부등식과 로그부등식의 연립에서 밑 크기별 부등호 방향과 진수 조건을 확인하는 표준 서술형 문항이다.", "level": "중", "item4slot": {"given": \["연립부등식", "지수부등식", "로그부등식"\], "goal": \["범위"\], "method": \["교집합", "이차부등식"\], "condition": \["진수조건"\]}, "hold": ""}  
\`\`\`

\## Q21  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
\[서술형 2\] 방정식 \$4^x - k \\cdot 2^x \+ k \\cdot \\dfrac{1}{2^x} \+ 3k \+ 14 \+ \\dfrac{1}{4^x} \= 0\$이 실근을 갖기 위한 실수 \$k\$의 값의 범위는 \$k \\ge \\alpha\$ 또는 \$k \\le \\beta\$이다. \$\|\\beta - \\alpha\|\$의 값을 구하는 과정을 서술하시오. \[7점\]  
\#\## 정답  
\$20\$  
\#\## 해설  
\$t \= 2^x - 2^{-x}\$라 하면 \$2^x \> 0\$이므로 \$t\$는 모든 실수 값을 가질 수 있다.  
또한 \$4^x \+ 4^{-x} \= (2^x - 2^{-x})^2 \+ 2 \= t^2 \+ 2\$이므로 주어진 방정식은  
\$(t^2 \+ 2\) - kt \+ 3k \+ 14 \= 0\$  
\$t^2 - kt \+ 3k \+ 16 \= 0\$  
원래 방정식이 실근 \$x\$를 가지려면 \$t\$에 대한 이차방정식이 실근을 가져야 하므로 판별식 \$D \\ge 0\$이어야 한다.  
\$D \= k^2 - 4(3k \+ 16\) \= k^2 - 12k - 64 \= (k - 16)(k \+ 4\) \\ge 0\$  
따라서 \$k \\ge 16\$ 또는 \$k \\le \-4\$이므로 \$\\alpha \= 16, \\beta \= \-4\$이고,  
\$\|\\beta - \\alpha\| \= \|-4 - 16\| \= 20\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-03", "subUnitKey": "H15-M1-03-EXPONENTIAL\_FUNCTION\_APPLICATION", "conceptClusterKey": "H15-M1-03-EXP\_ANTISYMMETRIC\_REAL\_ROOT", "primaryMethod": "t=2^x-2^-x의 치역이 실수 전체임을 파악해 t²-kt+3k+16=0의 판별식 D≥0을 푼다.", "decisiveStep": "2^x-2^-x=t의 치역이 실수 전체이므로 판별식 D≥0이 실근 존재 필요충분조건임을 적용하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수방정식", "l4": "치환"}, "ptTplCandidate": {"problemTypeKey": "PT\_EXPONENTIAL\_EQUATION\_SUBSTITUTION", "templateKey": "TPL\_NESTED\_EXPONENTIAL\_ROOT\_COUNT", "why": "H2-M1-RPM-016(DIRECT\_ACTIVE): t=2^x-2^-x 치환과 판별식으로 실근 존재 조건을 구하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "2^x-2^-x 치환 시 치역이 실수 전체임을 파악해 제한 범위 없이 판별식을 적용해야 하는 3단계 서술형 문항이다.", "level": "상", "item4slot": {"given": \["지수방정식"\], "goal": \["값"\], "method": \["치환", "판별식"\], "condition": \["실근"\]}, "hold": ""}  
\`\`\`

\## Q22  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
\[서술형 3\] 로그방정식 \$\\log\_{(x^2 \+ 2x)}(2x - 1\) \= \\log\_{15}(2x - 1)\$을 만족시키는 모든 근을 구하는 과정을 서술하시오. (단, 로그가 성립하기 위한 모든 조건을 반드시 포함하여 서술할 것) \[7점\]  
\#\## 정답  
\$1, 3\$  
\#\## 해설  
(1) 로그의 정의 조건:  
- 밑 조건: \$x^2 \+ 2x \> 0\$이고 \$x^2 \+ 2x \\neq 1\$이므로 \$x \< \-2\$ 또는 \$x \> 0\$, \$x \\neq \-1 \\pm \\sqrt{2}\$  
- 진수 조건: \$2x - 1 \> 0 \\implies x \> \\dfrac{1}{2}\$  
따라서 공통 조건은 \$x \> \\dfrac{1}{2}\$이고 \$x \\neq \-1 \+ \\sqrt{2}\$이다.  
(2) 방정식 풀기:  
진수가 \$1\$인 경우와 밑이 같은 경우로 나눈다.  
- 경우 1 (진수 \$= 1\$): \$2x - 1 \= 1 \\implies x \= 1\$ (조건 \$x \> \\dfrac{1}{2}, x \\neq \-1 \+ \\sqrt{2}\$ 만족)  
- 경우 2 (밑이 같음): \$x^2 \+ 2x \= 15 \\implies x^2 \+ 2x - 15 \= 0 \\implies (x \+ 5)(x - 3\) \= 0\$  
  \$x \= 3\$은 조건을 만족하지만, \$x \= \-5\$는 진수 조건 \$x \> \\dfrac{1}{2}\$을 만족하지 않아 제외한다.  
따라서 구하는 모든 근은 \$1, 3\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "H15-M1", "curriculum": "2015", "standardUnitKey": "H15-M1-04", "subUnitKey": "H15-M1-04-LOGARITHMIC\_FUNCTION\_APPLICATION", "conceptClusterKey": "H15-M1-04-LOG\_EQ\_EQUAL\_ARG\_OR\_BASE", "primaryMethod": "밑·진수 조건을 구한 뒤 진수가 1인 경우(x=1)와 밑이 같은 경우(x²+2x=15)를 모두 풀어 근을 선별한다.", "decisiveStep": "밑이 달라도 진수가 1이면 등식이 성립함(x=1)을 빠뜨리지 않고 진수 조건으로 x=-5를 제외하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그방정식", "l4": "진수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_LOG\_EQUATION\_DOMAIN", "templateKey": "TPL\_LOG\_EQUATION\_ARGUMENT\_FILTER", "why": "H2-M1-RPM-023(DIRECT\_ACTIVE): 밑·진수 조건으로 무연근을 걸러내고 진수=1인 해까지 선별하는 문항"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑이 미지수인 로그방정식에서 밑·진수 조건과 진수=1 경우를 모두 챙겨야 하는 3단계 서술형 문항이다.", "level": "상", "item4slot": {"given": \["로그방정식"\], "goal": \["해"\], "method": \["경우분류", "이차방정식"\], "condition": \["진수조건", "정의역"\]}, "hold": ""}  
\`\`\`  
