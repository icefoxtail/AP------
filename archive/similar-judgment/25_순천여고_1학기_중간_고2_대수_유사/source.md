\`\`\`json:exam  
{"stem": "25\_순천여고\_1학기\_중간\_고2\_대수\_유사", "sourceArchiveFile": "original/high/h2/1mid/25\_순천여고\_1학기\_중간\_고2\_대수.js", "examFolder": "1mid", "grade": "고2", "subject": "대수", "curriculum": "2022", "questionCount": 23, "totalScore": 100, "generatedAt": "2026-11-19"}  
\`\`\`

\## Q01  
- 형식: 객관식  
- 배점: 3.3  
\#\## 발문  
\$3^{2\\sqrt{2}} \\times 3^{4 - 2\\sqrt{2}}\$의 값은? \[3.3점\]  
\#\## 선지  
① \$81\$ ② \$27\$ ③ \$9\$ ④ \$3\$ ⑤ \$243\$  
\#\## 정답  
①  
\#\## 해설  
지수법칙에 의하여  
\$3^{2\\sqrt{2}} \\times 3^{4 - 2\\sqrt{2}} \= 3^{2\\sqrt{2} \+ (4 - 2\\sqrt{2})} \= 3^4 \= 81\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "H22-A-01-REAL\_EXPONENT\_MULTIPLY", "primaryMethod": "밑이 3으로 같은 실수 지수의 곱을 지수법칙으로 더해 3⁴=81을 구한다.", "decisiveStep": "실수 지수 2√2와 4-2√2를 더해 무리수 항을 소거하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수의 확장", "l4": "실수 지수"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_EXPONENT\_EXTENSION", "templateKey": "TPL\_H22A\_01\_EXPONENT\_EXTENSION\_070", "why": "실수 지수 덧셈으로 무리수 항을 소거해 3⁴=81 계산"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실수 지수의 곱셈 법칙을 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["지수"\], "goal": \["값"\], "method": \["지수법칙"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q02  
- 형식: 객관식  
- 배점: 3.4  
\#\## 발문  
다음 방정식 \$\\log\_3(x - 4\) \+ \\log\_3(x \+ 4\) \= 2\$의 해를 구하면? \[3.4점\]  
\#\## 선지  
① \$-5\$ ② \$-1\$ ③ \$5\$ ④ \$7\$ ⑤ \$9\$  
\#\## 정답  
③  
\#\## 해설  
진수 조건에 의하여 \$x - 4 \> 0\$이고 \$x \+ 4 \> 0\$이므로 \$x \> 4\$  
로그의 성질에 의하여  
\$\\log\_3\\{(x - 4)(x \+ 4)\\} \= 2\$  
\$x^2 - 16 \= 3^2 \= 9\$  
\$x^2 \= 25\$  
\$x \= \\pm 5\$  
진수 조건 \$x \> 4\$에 의하여 \$x \= 5\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-03", "subUnitKey": "H22-A-03-LOGARITHMIC\_FUNCTION", "conceptClusterKey": "H22-A-02-LOG\_EQUATION\_BASIC", "primaryMethod": "진수 조건 x\>4를 확인한 뒤 로그의 합을 진수의 곱으로 바꾸어 이차방정식 x²-16=9를 푼다.", "decisiveStep": "x=±5 중 진수 조건 x\>4를 만족시키는 x=5만 선택하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그방정식", "l4": "진수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_03\_LOG\_EQUATION", "templateKey": "TPL\_H22A\_03\_LOG\_EQUATION\_089", "why": "로그방정식 풀이 후 진수 조건(x\>4)으로 무연근 배제"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그방정식을 이차방정식으로 바꾼 뒤 진수 조건으로 무연근을 걸러내는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["로그방정식"\], "goal": \["해"\], "method": \["로그", "이차방정식"\], "condition": \["진수조건"\]}, "hold": ""}  
\`\`\`

\## Q03  
- 형식: 객관식  
- 배점: 3.4  
\#\## 발문  
함수 \$y \= \\left(\\dfrac{1}{3}\\right)^x \+ 2\$의 그래프를 \$y\$축에 대하여 대칭이동한 후 \$x\$축의 방향으로 \$a\$만큼, \$y\$축의 방향으로 \$b\$만큼 평행이동하였더니 함수 \$y \= 3^{x - 4} \+ 5\$의 그래프와 일치하였다. 상수 \$a, b\$에 대하여 \$ab\$의 값은? \[3.4점\]  
\#\## 선지  
① \$-12\$ ② \$12\$ ③ \$7\$ ④ \$10\$ ⑤ \$15\$  
\#\## 정답  
②  
\#\## 해설  
함수 \$y \= \\left(\\dfrac{1}{3}\\right)^x \+ 2\$의 그래프를 \$y\$축에 대하여 대칭이동하면 \$x\$ 대신 \$-x\$를 대입하므로  
\$y \= \\left(\\dfrac{1}{3}\\right)^{-x} \+ 2 \= 3^x \+ 2\$  
이 그래프를 \$x\$축의 방향으로 \$a\$만큼, \$y\$축의 방향으로 \$b\$만큼 평행이동하면  
\$y \= 3^{x - a} \+ 2 \+ b\$  
이 식이 \$y \= 3^{x - 4} \+ 5\$와 일치하므로  
\$a \= 4\$, \$2 \+ b \= 5 \\implies b \= 3\$  
따라서 \$ab \= 4 \\times 3 \= 12\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-02", "subUnitKey": "H22-A-02-EXPONENTIAL\_FUNCTION", "conceptClusterKey": "H22-A-03-EXP\_GRAPH\_TRANSFORM", "primaryMethod": "y=(1/3)^x+2에 y축 대칭이동과 (a, b) 평행이동을 차례로 적용해 y=3^(x-4)+5와 계수를 비교한다.", "decisiveStep": "y축 대칭이동 후 y=3^x+2로 정리하고 평행이동 결과와 계수 비교하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 그래프", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_TRANSFORM", "templateKey": "TPL\_FUNCTION\_GRAPH\_TRANSLATION", "why": "지수함수 그래프의 대칭이동 및 평행이동 후 계수 비교"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수함수의 대칭이동과 평행이동을 순차 적용해 미정계수를 구하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": \["지수함수"\], "goal": \["값"\], "method": \["대칭이동", "평행이동"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q04  
- 형식: 객관식  
- 배점: 3.5  
\#\## 발문  
다음 중 그 값이 가장 큰 것은? \[3.5점\]  
\#\## 선지  
① \$\\log\_{\\frac{1}{2}} 8\$ ② \$\\log\_3 \\sqrt{27}\$ ③ \$\\log\_9 27\$ ④ \$\\dfrac{1}{\\log\_{32} 2}\$ ⑤ \$9^{\\log\_3 4}\$  
\#\## 정답  
⑤  
\#\## 해설  
① \$\\log\_{\\frac{1}{2}} 8 \= \\log\_{2^{-1}} 2^3 \= \-3\$  
② \$\\log\_3 \\sqrt{27} \= \\log\_3 3^{\\frac{3}{2}} \= \\dfrac{3}{2}\$  
③ \$\\log\_9 27 \= \\log\_{3^2} 3^3 \= \\dfrac{3}{2}\$  
④ \$\\dfrac{1}{\\log\_{32} 2} \= \\log\_2 32 \= \\log\_2 2^5 \= 5\$  
⑤ \$9^{\\log\_3 4} \= 4^{\\log\_3 9} \= 4^2 \= 16\$  
따라서 가장 큰 것은 ⑤이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "H22-A-02-LOG\_VALUE\_COMPARISON", "primaryMethod": "다섯 개의 로그·지수 식을 로그의 밑변환과 거듭제곱 성질로 각각 수치 계산하여 대소를 비교한다.", "decisiveStep": "9^(log\_3 4\) \= 4^(log\_3 9\) \= 16으로 계산해 최댓값을 판별하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 성질", "l4": "밑의 변환"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_LOG\_PROPERTIES", "templateKey": "TPL\_H22A\_01\_LOG\_PROPERTIES\_076", "why": "로그의 밑변환 및 거듭제곱 성질을 이용한 식의 값 비교"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "여러 로그 성질을 5개 보기에 각각 적용해 값을 계산하고 비교하는 문항이다.", "level": "중", "item4slot": {"given": \["로그", "지수"\], "goal": \["최댓값"\], "method": \["로그", "대소비교"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q05  
- 형식: 객관식  
- 배점: 3.6  
\#\## 발문  
각을 \$360^\\circ \\times n \+ \\alpha^\\circ\$ (\$n\$은 정수, \$0^\\circ \\le \\alpha^\\circ \< 360^\\circ\$)의 꼴로 나타낼 때, 다음 중 \$\\alpha\$의 값이 가장 큰 것은? \[3.6점\]  
\#\## 선지  
① \$-1000^\\circ\$ ② \$-400^\\circ\$ ③ \$400^\\circ\$ ④ \$-750^\\circ\$ ⑤ \$1000^\\circ\$  
\#\## 정답  
④  
\#\## 해설  
각 보기를 \$360^\\circ \\times n \+ \\alpha^\\circ\$ (\$0^\\circ \\le \\alpha^\\circ \< 360^\\circ\$) 꼴로 나타내면  
① \$-1000^\\circ \= 360^\\circ \\times (-3) \+ 80^\\circ \\implies \\alpha \= 80\$  
② \$-400^\\circ \= 360^\\circ \\times (-2) \+ 320^\\circ \\implies \\alpha \= 320\$  
③ \$400^\\circ \= 360^\\circ \\times 1 \+ 40^\\circ \\implies \\alpha \= 40\$  
④ \$-750^\\circ \= 360^\\circ \\times (-3) \+ 330^\\circ \\implies \\alpha \= 330\$  
⑤ \$1000^\\circ \= 360^\\circ \\times 2 \+ 280^\\circ \\implies \\alpha \= 280\$  
따라서 \$\\alpha\$의 값이 가장 큰 것은 ④이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_BASIC", "conceptClusterKey": "H22-A-04-GENERAL\_ANGLE\_ALPHA\_MAX", "primaryMethod": "다섯 각을 360°×n+α° (0°≤α°\<360°) 꼴로 변형하여 α를 각각 구해 비교한다.", "decisiveStep": "-750° \= 360°×(-3) \+ 330°로 양의 최소 동경각 α=330을 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "일반각과 호도법", "l4": "일반각"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_ANGLE\_RADIAN", "templateKey": "TPL\_H22A\_04\_ANGLE\_RADIAN\_095", "why": "일반각 360°×n+α° (0°≤α°\<360°) 꼴로 변형하여 α 비교"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일반각의 표준형 360°×n+α°에서 음의 각을 양의 α°로 환산하는 기본 문항이다.", "level": "하", "item4slot": {"given": \["일반각"\], "goal": \["최댓값"\], "method": \["일반각", "대소비교"\], "condition": \["정수", "범위"\]}, "hold": ""}  
\`\`\`

\## Q06  
- 형식: 객관식  
- 배점: 3.7  
\#\## 발문  
\$\\sin\\theta \+ \\cos\\theta \= \\dfrac{1}{3}\$일 때, \$\\sin\\theta\\cos\\theta\$의 값은? \[3.7점\]  
\#\## 선지  
① \$-\\dfrac{8}{9}\$ ② \$-\\dfrac{4}{9}\$ ③ \$-\\dfrac{2}{9}\$ ④ \$\\dfrac{4}{9}\$ ⑤ \$\\dfrac{8}{9}\$  
\#\## 정답  
②  
\#\## 해설  
\$\\sin\\theta \+ \\cos\\theta \= \\dfrac{1}{3}\$의 양변을 제곱하면  
\$\\sin^2\\theta \+ 2\\sin\\theta\\cos\\theta \+ \\cos^2\\theta \= \\dfrac{1}{9}\$  
\$\\sin^2\\theta \+ \\cos^2\\theta \= 1\$이므로  
\$1 \+ 2\\sin\\theta\\cos\\theta \= \\dfrac{1}{9}\$  
\$2\\sin\\theta\\cos\\theta \= \-\\dfrac{8}{9}\$  
\$\\sin\\theta\\cos\\theta \= \-\\dfrac{4}{9}\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_BASIC", "conceptClusterKey": "H22-A-04-TRIG\_SUM\_PRODUCT\_IDENTITY", "primaryMethod": "sin θ \+ cos θ \= 1/3의 양변을 제곱해 sin²θ+cos²θ=1을 대입하여 sin θ cos θ를 구한다.", "decisiveStep": "1 \+ 2sin θ cos θ \= 1/9로 정리해 sin θ cos θ \= \-4/9를 얻는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 성질", "l4": "삼각함수 관계"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_TRIG\_PROPERTIES", "templateKey": "TPL\_H22A\_04\_TRIG\_PROPERTIES\_100", "why": "sin²θ+cos²θ=1 삼각함수 상호관계를 이용한 식의 값 계산"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각함수 항등식 sin²θ+cos²θ=1과 제곱 공식을 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": \["삼각함수"\], "goal": \["값"\], "method": \["삼각함수의상호관계", "곱셈공식"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q07  
- 형식: 객관식  
- 배점: 3.8  
\#\## 발문  
실수 \$x\$에 대하여 \$\\dfrac{a^x - a^{-x}}{a^x \+ a^{-x}} \= \\dfrac{1}{3}\$일 때, \$\\dfrac{a^{2x} \+ a^{-2x}}{a^{2x} - a^{-2x}}\$의 값은? (단, \$a \> 0\$, \$a \\neq 1\$) \[3.8점\]  
\#\## 선지  
① \$\\dfrac{5}{3}\$ ② \$\\dfrac{3}{5}\$ ③ \$\\dfrac{4}{3}\$ ④ \$\\dfrac{3}{4}\$ ⑤ \$\\dfrac{5}{4}\$  
\#\## 정답  
①  
\#\## 해설  
주어진 식의 분모와 분자에 각각 \$a^x\$을 곱하면  
\$\\dfrac{a^{2x} - 1}{a^{2x} \+ 1} \= \\dfrac{1}{3}\$  
\$3(a^{2x} - 1\) \= a^{2x} \+ 1\$  
\$2a^{2x} \= 4 \\implies a^{2x} \= 2\$  
\$a^{-2x} \= \\dfrac{1}{2}\$이므로 구하는 식에 대입하면  
\$\\dfrac{a^{2x} \+ a^{-2x}}{a^{2x} - a^{-2x}} \= \\dfrac{2 \+ \\dfrac{1}{2}}{2 - \\dfrac{1}{2}} \= \\dfrac{\\dfrac{5}{2}}{\\dfrac{3}{2}} \= \\dfrac{5}{3}\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "H22-A-01-EXP\_FRACTION\_RATIO", "primaryMethod": "분모·분자에 a^x을 곱해 a^(2x)=2를 구한 뒤 a^(-2x)=1/2과 함께 구하는 식에 대입한다.", "decisiveStep": "(a^(2x)-1)/(a^(2x)+1) \= 1/3으로부터 a^(2x)=2를 도출하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수법칙", "l4": "조건식"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_EXPONENT\_LAWS", "templateKey": "TPL\_H22A\_01\_EXPONENT\_LAWS\_072", "why": "분모·분자에 a^x을 곱해 조건식으로부터 a^(2x) 값 도출"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수 분수식의 분모·분자에 a^x을 곱해 a^(2x)의 값을 먼저 구하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": \["지수", "유리식"\], "goal": \["값"\], "method": \["지수법칙", "대입"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q08  
- 형식: 객관식  
- 배점: 3.8  
\#\## 발문  
함수 \$f(x) \= \\log\_3(x - a) \+ 3\$의 역함수의 그래프가 점 \$(a \+ 5, a \+ 3)\$을 지날 때, \$a\$의 값은? (단, \$a\$는 상수이다.) \[3.8점\]  
\#\## 선지  
① \$-3\$ ② \$-2\$ ③ \$-1\$ ④ \$1\$ ⑤ \$2\$  
\#\## 정답  
③  
\#\## 해설  
\$y \= f(x)\$의 역함수의 그래프가 점 \$(a \+ 5, a \+ 3)\$을 지나므로  
\$f^{-1}(a \+ 5\) \= a \+ 3\$, 즉 \$f(a \+ 3\) \= a \+ 5\$  
\$f(x) \= \\log\_3(x - a) \+ 3\$에 \$x \= a \+ 3\$을 대입하면  
\$\\log\_3((a \+ 3\) - a) \+ 3 \= a \+ 5\$  
\$\\log\_3 3 \+ 3 \= a \+ 5\$  
\$1 \+ 3 \= a \+ 5\$  
\$a \= \-1\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-03", "subUnitKey": "H22-A-03-LOGARITHMIC\_FUNCTION", "conceptClusterKey": "H22-A-03-LOG\_INVERSE\_POINT", "primaryMethod": "역함수가 (a+5, a+3)을 지난다는 조건을 f(a+3)=a+5로 바꿔 f(x)에 대입해 a를 구한다.", "decisiveStep": "f^(-1)(a+5)=a+3을 f(a+3)=a+5로 전환해 상수 a를 소거 없이 방정식으로 푸는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 그래프", "l4": "평행이동"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_TRANSFORM", "templateKey": "TPL\_FUNCTION\_GRAPH\_TRANSLATION", "why": "평행이동된 로그함수의 역함수 점 조건 f^(-1)(y)=x를 f(x)=y로 전환"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "역함수 성질 f^(-1)(p)=q ⇔ f(q)=p를 이용해 로그식을 간단히 푸는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["로그함수", "역함수"\], "goal": \["값"\], "method": \["역함수", "대입"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q09  
- 형식: 객관식  
- 배점: 3.9  
\#\## 발문  
\$\\theta\$가 제\$2\$사분면의 각이고 \$\|\\cos\\theta - \\sin\\theta\| - \\sqrt{\\cos^2\\theta} \= \\dfrac{3}{5}\$일 때, \$\\cos\\theta\$의 값은? \[3.9점\]  
\#\## 선지  
① \$-\\dfrac{3}{5}\$ ② \$\\dfrac{3}{5}\$ ③ \$\\dfrac{4}{5}\$ ④ \$-\\dfrac{4}{5}\$ ⑤ \$-\\dfrac{4}{3}\$  
\#\## 정답  
④  
\#\## 해설  
\$\\theta\$가 제\$2\$사분면의 각이므로 \$\\sin\\theta \> 0\$, \$\\cos\\theta \< 0\$이다.  
따라서 \$\\cos\\theta - \\sin\\theta \< 0\$이므로  
\$\|\\cos\\theta - \\sin\\theta\| \= \-(\\cos\\theta - \\sin\\theta) \= \\sin\\theta - \\cos\\theta\$  
또한 \$\\sqrt{\\cos^2\\theta} \= \|\\cos\\theta\| \= \-\\cos\\theta\$이므로  
\$\|\\cos\\theta - \\sin\\theta\| - \\sqrt{\\cos^2\\theta} \= (\\sin\\theta - \\cos\\theta) - (-\\cos\\theta) \= \\sin\\theta\$  
즉, \$\\sin\\theta \= \\dfrac{3}{5}\$  
\$\\cos^2\\theta \= 1 - \\sin^2\\theta \= 1 - \\dfrac{9}{25} \= \\dfrac{16}{25}\$  
\$\\cos\\theta \< 0\$이므로 \$\\cos\\theta \= \-\\dfrac{4}{5}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_BASIC", "conceptClusterKey": "H22-A-04-TRIG\_QUADRANT\_SIGN\_ABS", "primaryMethod": "제2사분면 각의 부호(sin\>0, cos\<0)로 절댓값과 근호를 풀어 sin θ=3/5를 얻은 뒤 cos θ를 구한다.", "decisiveStep": "(sin θ - cos θ) - (-cos θ) \= sin θ로 식을 간단히 하고 제2사분면 부호로 cos θ\<0을 결정하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "삼각함수의 성질", "l4": "삼각함수 관계"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_TRIG\_PROPERTIES", "templateKey": "TPL\_H22A\_04\_TRIG\_PROPERTIES\_100", "why": "사분면 부호 판정과 sin²θ+cos²θ=1 삼각함수 상호관계 적용"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사분면 부호 판별과 절댓값·제곱근 정리, 삼각함수 상호관계를 결합한 2단계 문항이다.", "level": "중", "item4slot": {"given": \["삼각함수", "절댓값"\], "goal": \["값"\], "method": \["삼각함수의상호관계"\], "condition": \["부호", "사분면"\]}, "hold": ""}  
\`\`\`

\## Q10  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
함수 \$y \= 2\\log(x \+ 2\) \+ 1\$에 대한 설명으로 옳은 것만을 \<보기\>에서 있는 대로 고른 것은? \[4점\]  
\<보기\>  
ㄱ. 그래프는 점 \$(-1, 1)\$을 지난다.  
ㄴ. 그래프의 점근선은 직선 \$y \= 1\$이다.  
ㄷ. 그래프는 제\$4\$사분면을 지나지 않는다.  
ㄹ. 그래프는 함수 \$y \= \\log(x \+ 2)^2\$의 그래프를 \$y\$축의 방향으로 \$1\$만큼 평행이동한 것이다.  
\#\## 선지  
① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄷ  
\#\## 정답  
⑤  
\#\## 해설  
ㄱ. \$x \= \-1\$일 때 \$y \= 2\\log 1 \+ 1 \= 1\$이므로 점 \$(-1, 1)\$을 지난다. (참)  
ㄴ. 진수 \$x \+ 2 \= 0\$에서 점근선은 직선 \$x \= \-2\$이다. (거짓)  
ㄷ. \$x \= 0\$일 때 \$y \= 2\\log 2 \+ 1 \> 0\$이고 밑이 \$10 \> 1\$인 증가함수이므로 \$x \> 0\$일 때 \$y \> 0\$이다. 따라서 그래프는 제\$4\$사분면을 지나지 않는다. (참)  
ㄹ. \$y \= 2\\log(x \+ 2\) \+ 1\$의 정의역은 \$\\{x \\mid x \> \-2\\}\$인 반면, \$y \= \\log(x \+ 2)^2 \+ 1\$의 정의역은 \$\\{x \\mid x \\neq \-2\\}\$이므로 서로 다른 함수이다. (거짓)  
따라서 옳은 것은 ㄱ, ㄷ이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-03", "subUnitKey": "H22-A-03-LOGARITHMIC\_FUNCTION", "conceptClusterKey": "H22-A-03-LOG\_GRAPH\_BOKI\_PROPERTIES", "primaryMethod": "로그함수 y=2log(x+2)+1의 정점, 점근선, 사분면 통과 여부, 정의역 차이를 보기별로 판별한다.", "decisiveStep": "ㄷ에서 y절편이 양수이고 증가함수임을 확인하고 ㄹ에서 정의역 차이를 구별하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 그래프", "l4": "증가·감소"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_PROPERTIES", "templateKey": "TPL\_FUNCTION\_GRAPH\_PROPERTY\_JUDGMENT", "why": "로그함수의 정점, 점근선, 사분면, 정의역 등 그래프 성질 판별"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그함수의 정점·점근선·사분면·정의역 함정을 합답형으로 점검하는 표준 문항이다.", "level": "중", "item4slot": {"given": \["로그함수"\], "goal": \["판정"\], "method": \["정의역", "평행이동", "점근선"\], "condition": \[\]}, "hold": ""}  
\`\`\`

\## Q11  
- 형식: 객관식  
- 배점: 4  
\#\## 발문  
\$\\sqrt\[3\]{\\dfrac{\\sqrt\[4\]{a^3}}{\\sqrt{a}}} \\times \\sqrt\[6\]{\\dfrac{\\sqrt\[4\]{a}}{a}}\$를 간단히 하면 \$\\sqrt\[n\]{\\dfrac{1}{a}}\$이다. 자연수 \$n\$의 값은? (단, \$a \> 0\$, \$a \\neq 1\$) \[4점\]  
\#\## 선지  
① \$12\$ ② \$24\$ ③ \$36\$ ④ \$48\$ ⑤ \$72\$  
\#\## 정답  
②  
\#\## 해설  
주어진 식을 \$a\$의 유리수 지수로 나타내면  
\$\\sqrt\[3\]{\\dfrac{\\sqrt\[4\]{a^3}}{\\sqrt{a}}} \= \\left(a^{\\frac{3}{4} - \\frac{1}{2}}\\right)^{\\frac{1}{3}} \= \\left(a^{\\frac{1}{4}}\\right)^{\\frac{1}{3}} \= a^{\\frac{1}{12}}\$  
\$\\sqrt\[6\]{\\dfrac{\\sqrt\[4\]{a}}{a}} \= \\left(a^{\\frac{1}{4} - 1}\\right)^{\\frac{1}{6}} \= \\left(a^{-\\frac{3}{4}}\\right)^{\\frac{1}{6}} \= a^{-\\frac{1}{8}}\$  
두 식을 곱하면  
\$a^{\\frac{1}{12}} \\times a^{-\\frac{1}{8}} \= a^{\\frac{2 - 3}{24}} \= a^{-\\frac{1}{24}} \= \\left(\\dfrac{1}{a}\\right)^{\\frac{1}{24}} \= \\sqrt\[24\]{\\dfrac{1}{a}}\$  
따라서 \$n \= 24\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "H22-A-01-NESTED\_RADICAL\_SIMPLIFY", "primaryMethod": "분수 꼴 이중 근호를 유리수 지수로 고쳐 a^(-1/24)로 정리한 뒤 (1/a)^(1/n)과 비교한다.", "decisiveStep": "a^(1/12) × a^(-1/8) \= a^(-1/24) \= (1/a)^(1/24)로 정리해 n=24를 읽는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "지수의 확장", "l4": "유리수 지수"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_EXPONENT\_EXTENSION", "templateKey": "TPL\_H22A\_01\_EXPONENT\_EXTENSION\_069", "why": "다중 거듭제곱근을 유리수 지수로 변환하여 지수법칙으로 정리"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "복잡한 거듭제곱근 나눗셈과 곱셈을 유리수 지수 법칙으로 차근차근 정리하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["거듭제곱근"\], "goal": \["값"\], "method": \["지수법칙"\], "condition": \["자연수"\]}, "hold": ""}  
\`\`\`

\## Q12  
- 형식: 객관식  
- 배점: 4.1  
\#\## 발문  
\$\\dfrac{\\pi}{2} \< \\theta \< \\pi\$이고 각 \$\\theta\$를 나타내는 동경과 각 \$6\\theta\$를 나타내는 동경이 일치할 때, \$\\theta \= \\dfrac{q}{p}\\pi\$이다. 서로소인 두 자연수 \$p, q\$에 대하여 \$p - q\$의 값은? \[4.1점\]  
\#\## 선지  
① \$1\$ ② \$2\$ ③ \$3\$ ④ \$-1\$ ⑤ \$-2\$  
\#\## 정답  
①  
\#\## 해설  
두 각 \$\\theta\$와 \$6\\theta\$의 동경이 일치하므로  
\$6\\theta - \\theta \= 2n\\pi\$ (\$n\$은 정수)  
\$5\\theta \= 2n\\pi\$, 즉 \$\\theta \= \\dfrac{2n}{5}\\pi\$  
\$\\dfrac{\\pi}{2} \< \\theta \< \\pi\$이므로  
\$\\dfrac{1}{2} \< \\dfrac{2n}{5} \< 1 \\implies \\dfrac{5}{4} \< n \< \\dfrac{5}{2}\$  
\$n\$은 정수이므로 \$n \= 2\$  
따라서 \$\\theta \= \\dfrac{4}{5}\\pi\$이고 \$p \= 5, q \= 4\$이므로 \$p - q \= 5 - 4 \= 1\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_BASIC", "conceptClusterKey": "H22-A-04-RAY\_COINCIDENT", "primaryMethod": "두 동경 일치 조건 6θ-θ=2nπ에서 구간 (π/2, π)에 속하는 정수 n=2를 찾아 θ를 구한다.", "decisiveStep": "5/4 \< n \< 5/2 범위에서 유일한 정수 n=2를 결정하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "일반각과 호도법", "l4": "일반각"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_ANGLE\_RADIAN", "templateKey": "TPL\_H22A\_04\_ANGLE\_RADIAN\_095", "why": "두 동경 일치 조건 6θ-θ=2nπ와 구간 제한으로 일반각 결정"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "동경 일치 일반각 방정식과 부등식 범위로 정수 매개변수를 확정하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": \["일반각"\], "goal": \["차"\], "method": \["일반각", "부등식"\], "condition": \["범위", "서로소"\]}, "hold": ""}  
\`\`\`

\## Q13  
- 형식: 객관식  
- 배점: 4.2  
\#\## 발문  
둘레의 길이가 \$16\$인 부채꼴 중에서 그 넓이가 최대인 부채꼴의 넓이를 \$a\$, 넓이가 최대인 부채꼴의 중심각의 크기를 \$b\$라고 할 때, \$a \+ b\$의 값은? \[4.2점\]  
\#\## 선지  
① \$12\$ ② \$14\$ ③ \$16\$ ④ \$18\$ ⑤ \$20\$  
\#\## 정답  
④  
\#\## 해설  
부채꼴의 반지름의 길이를 \$r\$, 호의 길이를 \$l\$이라 하면 둘레의 길이가 \$16\$이므로  
\$2r \+ l \= 16 \\implies l \= 16 - 2r\$ (\$0 \< r \< 8\$)  
부채꼴의 넓이 \$S\$는  
\$S \= \\dfrac{1}{2}rl \= \\dfrac{1}{2}r(16 - 2r) \= r(8 - r) \= \-(r - 4)^2 \+ 16\$  
따라서 \$r \= 4\$일 때 넓이의 최댓값 \$a \= 16\$을 가진다.  
이때 호의 길이는 \$l \= 16 - 2 \\times 4 \= 8\$이므로 중심각의 크기는  
\$b \= \\dfrac{l}{r} \= \\dfrac{8}{4} \= 2\$  
따라서 \$a \+ b \= 16 \+ 2 \= 18\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-04", "subUnitKey": "H22-A-04-TRIGONOMETRIC\_BASIC", "conceptClusterKey": "H22-A-04-SECTOR\_FIXED\_PERIMETER\_MAX\_AREA", "primaryMethod": "둘레 2r+l=16으로 넓이 S=(1/2)rl을 r의 이차함수로 나타내 최댓값 16과 중심각 l/r=2를 구한다.", "decisiveStep": "S \= \-(r-4)²+16에서 최댓값 16과 그때의 r=4, l=8로부터 중심각 b=2를 구하는 단계", "rpm": {"majorUnit": "삼각함수", "midUnit": "삼각함수", "l3": "일반각과 호도법", "l4": "호도법"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_04\_ANGLE\_RADIAN", "templateKey": "TPL\_H22A\_04\_ANGLE\_RADIAN\_096", "why": "호도법을 이용한 부채꼴 둘레·넓이 이차함수 최댓값 및 중심각 계산"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일정한 둘레 조건에서 부채꼴 넓이의 이차함수 최대 문제와 중심각 계산을 결합한 문항이다.", "level": "중", "item4slot": {"given": \["부채꼴", "둘레"\], "goal": \["합"\], "method": \["이차함수", "완전제곱식", "중심각"\], "condition": \["최댓값"\]}, "hold": ""}  
\`\`\`

\## Q14  
- 형식: 객관식  
- 배점: 4.2  
\#\## 발문  
함수 \$f(x) \= \\begin{cases} \|5^x - 5\| & (x \\ge 0\) \\\\ \|5^{-x} - 5\| & (x \< 0\) \\end{cases}\$와 직선 \$y \= k\$ (\$k\$는 실수)에 대하여 방정식 \$f(x) \= k\$가 서로 다른 세 실근을 가질 때, \$k\$의 값은? \[4.2점\]  
\#\## 선지  
① \$0\$ ② \$1\$ ③ \$2\$ ④ \$3\$ ⑤ \$4\$  
\#\## 정답  
⑤  
\#\## 해설  
\$x \< 0\$일 때 \$-x \> 0\$이므로 \$f(-x) \= f(x)\$가 성립하여 \$y \= f(x)\$의 그래프는 \$y\$축에 대하여 대칭이다.  
\$x \\ge 0\$에서 \$y \= \|5^x - 5\|\$의 그래프는  
- \$x \= 0\$일 때 \$f(0) \= \|5^0 - 5\| \= \|1 - 5\| \= 4\$  
- \$0 \\le x \\le 1\$일 때 \$5 - 5^x\$로 \$4\$에서 \$0\$까지 감소  
- \$x \\ge 1\$일 때 \$5^x - 5\$로 \$0\$에서 한없이 증가  
\$y\$축 대칭성을 고려하면 방정식 \$f(x) \= k\$의 서로 다른 실근의 개수는  
- \$k \< 0\$: \$0\$개  
- \$k \= 0\$: \$2\$개 (\$x \= \\pm 1\$)  
- \$0 \< k \< 4\$: \$4\$개  
- \$k \= 4\$: \$3\$개 (\$x \= 0\$ 및 \$\|x\| \> 1\$인 대칭인 두 근)  
- \$k \> 4\$: \$2\$개  
따라서 서로 다른 세 실근을 갖도록 하는 \$k\$의 값은 \$4\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-02", "subUnitKey": "H22-A-02-EXPONENTIAL\_FUNCTION", "conceptClusterKey": "H22-A-03-EVEN\_ABS\_EXP\_INTERSECTIONS", "primaryMethod": "y축 대칭인 절댓값 지수함수의 x≥0 구간 증감과 극값 f(0)=4를 파악해 교점이 3개인 y=k를 찾는다.", "decisiveStep": "y축 대칭성과 x=0에서의 꺾인 극댓값 f(0)=4에서 교점이 정확히 3개가 됨을 확인하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "절댓값 지수함수 그래프의 대칭성과 직선 y=k의 교점 개수 판별"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "우함수 대칭과 절댓값 접어올림 그래프의 교점 개수 변화를 k 값별로 분류하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["지수함수", "절댓값", "직선"\], "goal": \["값"\], "method": \["대칭성", "경우분류"\], "condition": \["교점", "개수"\]}, "hold": ""}  
\`\`\`

\## Q15  
- 형식: 객관식  
- 배점: 4.3  
\#\## 발문  
이차방정식 \$x^2 - x\\log\_3 k^2 \+ \\log\_3 k \+ 2 \= 0\$이 실근을 갖도록 하는 실수 \$k\$의 범위는? \[4.3점\]  
\#\## 선지  
① \$k \\le \\dfrac{1}{3}\$ 또는 \$k \\ge 9\$ ② \$0 \< k \< \\dfrac{1}{3}\$ 또는 \$k \> 9\$ ③ \$0 \< k \\le \\dfrac{1}{3}\$ 또는 \$k \\ge 9\$ ④ \$0 \< k \\le \\dfrac{1}{9}\$ 또는 \$k \\ge 3\$ ⑤ \$k \\le \\dfrac{1}{9}\$ 또는 \$k \\ge 3\$  
\#\## 정답  
③  
\#\## 해설  
진수 조건에 의하여 \$k \> 0\$이다.  
이차방정식이 실근을 가지려면 판별식 \$D \\ge 0\$이어야 하고 \$\\log\_3 k^2 \= 2\\log\_3 k\$이므로  
\$D \= (2\\log\_3 k)^2 - 4(\\log\_3 k \+ 2\) \\ge 0\$  
\$\\log\_3 k \= t\$라 하면  
\$4t^2 - 4t - 8 \\ge 0\$  
\$t^2 - t - 2 \\ge 0\$  
\$(t - 2)(t \+ 1\) \\ge 0\$  
\$t \\le \-1\$ 또는 \$t \\ge 2\$  
\$\\log\_3 k \\le \-1\$ 또는 \$\\log\_3 k \\ge 2\$  
진수 조건 \$k \> 0\$과 밑 \$3 \> 1\$을 적용하면  
\$0 \< k \\le \\dfrac{1}{3}\$ 또는 \$k \\ge 9\$  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-03", "subUnitKey": "H22-A-03-LOGARITHMIC\_FUNCTION", "conceptClusterKey": "H22-A-03-LOG\_COEFF\_QUADRATIC\_DISCRIMINANT", "primaryMethod": "진수 조건 k\>0 아래 판별식 D≥0을 log\_3 k \= t로 치환한 이차부등식으로 푼다.", "decisiveStep": "log\_3 k ≤ \-1 풀 때 진수 조건 k\>0을 결합해 0\<k≤1/3으로 제한하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그부등식", "l4": "치환"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_03\_LOG\_INEQUALITY", "templateKey": "TPL\_H22A\_03\_LOG\_INEQUALITY\_092", "why": "log\_3 k \= t 치환을 통한 이차방정식 판별식 및 로그부등식 풀이"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식 판별식과 로그부등식의 진수 조건(k\>0)을 함께 챙겨야 하는 2단계 문항이다.", "level": "중", "item4slot": {"given": \["이차방정식", "로그"\], "goal": \["범위"\], "method": \["판별식", "치환", "로그부등식"\], "condition": \["실근", "진수조건"\]}, "hold": ""}  
\`\`\`

\## Q16  
- 형식: 객관식  
- 배점: 4.4  
\#\## 발문  
\$4 \\le n \\le 13\$인 자연수 \$n\$에 대하여 \$n^2 - 13n \+ 36\$의 \$n\$제곱근 중 실수인 것의 개수를 \$f(n)\$이라 하자. \$2f(n) \= f(n \+ 1)\$을 만족시키는 모든 \$n\$의 값의 합은? \[4.4점\]  
\#\## 선지  
① \$18\$ ② \$20\$ ③ \$22\$ ④ \$23\$ ⑤ \$24\$  
\#\## 정답  
②  
\#\## 해설  
\$g(n) \= n^2 - 13n \+ 36 \= (n - 4)(n - 9)\$라 하자.  
\$n\$이 홀수일 때는 \$g(n)\$의 부호와 관계없이 항상 \$f(n) \= 1\$이다.  
\$n\$이 짝수일 때는 \$g(n) \> 0\$이면 \$f(n) \= 2\$, \$g(n) \= 0\$이면 \$f(n) \= 1\$, \$g(n) \< 0\$이면 \$f(n) \= 0\$이다.  
\$4 \\le n \\le 13\$에서 \$f(n)\$의 값을 구하면 다음과 같다.  
- \$n \= 4\$: \$g(4) \= 0 \\implies f(4) \= 1\$  
- \$n \= 5\$: 홀수 \$\\implies f(5) \= 1\$  
- \$n \= 6\$: \$g(6) \= \-6 \< 0\$ (짝수) \$\\implies f(6) \= 0\$  
- \$n \= 7\$: 홀수 \$\\implies f(7) \= 1\$  
- \$n \= 8\$: \$g(8) \= \-4 \< 0\$ (짝수) \$\\implies f(8) \= 0\$  
- \$n \= 9\$: \$g(9) \= 0 \\implies f(9) \= 1\$  
- \$n \= 10\$: \$g(10) \= 6 \> 0\$ (짝수) \$\\implies f(10) \= 2\$  
- \$n \= 11\$: 홀수 \$\\implies f(11) \= 1\$  
- \$n \= 12\$: \$g(12) \= 24 \> 0\$ (짝수) \$\\implies f(12) \= 2\$  
- \$n \= 13\$: 홀수 \$\\implies f(13) \= 1\$  
\$f(n)\$과 \$f(n \+ 1)\$이 모두 정의되는 \$4 \\le n \\le 12\$에서 \$2f(n) \= f(n \+ 1)\$을 만족시키는 경우는 \$f(n) \= 1, f(n \+ 1\) \= 2\$일 때이므로 \$n \= 9, 11\$이다.  
따라서 모든 \$n\$의 값의 합은 \$9 \+ 11 \= 20\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "H22-A-01-NTH\_ROOT\_COUNT\_FUNCTION", "primaryMethod": "n의 홀짝성과 g(n)=(n-4)(n-9)의 부호로 f(n)을 구한 뒤 f(n)=1, f(n+1)=2가 되는 n을 찾는다.", "decisiveStep": "짝수 n에서 g(n)의 부호(양/0/음)로 f(n)을 2, 1, 0으로 분류해 2f(n)=f(n+1)을 판별하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수", "l3": "거듭제곱근", "l4": "실수 조건"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_ROOT\_REAL", "templateKey": "TPL\_H22A\_01\_ROOT\_REAL\_068", "why": "n의 홀짝성과 g(n)의 부호에 따른 n제곱근 중 실수인 것의 개수 분류"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실수인 n제곱근의 개수를 n의 홀짝성과 피근호식의 부호에 따라 체계적으로 판별해야 하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["거듭제곱근", "자연수"\], "goal": \["합"\], "method": \["경우분류", "이차부등식"\], "condition": \["자연수", "실수"\]}, "hold": ""}  
\`\`\`

\## Q17  
- 형식: 객관식  
- 배점: 4.5  
\#\## 발문  
두 실수 \$a, b\$가 다음 \<조건\>을 만족시킬 때, \$(\\log\_a 3)^2 \\times \\log\_3 b \= \\dfrac{p}{q}\$이다. \$p \+ q\$의 값은? (단, \$p, q\$는 서로소인 자연수) \[4.5점\]  
\<조건\>  
(가) \$\\log\_{\\sqrt{3}} ab \= 30\$  
(나) \$\\log\_a \\sqrt{b} \= \\log\_{\\sqrt{b}} a\$  
(다) \$1 \< a \< b\$  
\#\## 선지  
① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$  
\#\## 정답  
⑤  
\#\## 해설  
조건 (나)에서  
\$\\log\_a \\sqrt{b} \= \\dfrac{1}{2}\\log\_a b\$, \$\\log\_{\\sqrt{b}} a \= 2\\log\_b a \= \\dfrac{2}{\\log\_a b}\$  
\$\\dfrac{1}{2}\\log\_a b \= \\dfrac{2}{\\log\_a b} \\implies (\\log\_a b)^2 \= 4\$  
조건 (다) \$1 \< a \< b\$에 의해 \$\\log\_a b \> 1\$이므로 \$\\log\_a b \= 2\$, 즉 \$b \= a^2\$  
조건 (가)에 \$b \= a^2\$을 대입하면  
\$\\log\_{\\sqrt{3}} a^3 \= 2\\log\_3 a^3 \= 6\\log\_3 a \= 30\$  
\$\\log\_3 a \= 5\$  
또한 \$\\log\_3 b \= \\log\_3 a^2 \= 2\\log\_3 a \= 10\$이고 \$\\log\_a 3 \= \\dfrac{1}{\\log\_3 a} \= \\dfrac{1}{5}\$이므로  
\$(\\log\_a 3)^2 \\times \\log\_3 b \= \\left(\\dfrac{1}{5}\\right)^2 \\times 10 \= \\dfrac{10}{25} \= \\dfrac{2}{5}\$  
\$p \= 2, q \= 5\$이므로 \$p \+ q \= 2 \+ 5 \= 7\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "H22-A-02-LOG\_BASE\_RECIPROCAL\_SYSTEM", "primaryMethod": "조건 (나)와 (다)로 b=a²을 도출한 뒤 조건 (가)에 대입해 log\_3 a=5를 구하여 식을 계산한다.", "decisiveStep": "(log\_a b)²=4와 1\<a\<b로부터 b=a²을 얻어 log\_3 a=5로 연결하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 성질", "l4": "밑의 변환"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_LOG\_PROPERTIES", "templateKey": "TPL\_H22A\_01\_LOG\_PROPERTIES\_076", "why": "로그의 밑변환 성질을 이용한 연립 로그 조건식 풀이"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑변환 역수 관계와 대소 조건 1\<a\<b를 결합해 두 변수의 거듭제곱 관계를 밝히는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["로그", "실수"\], "goal": \["합"\], "method": \["밑변환", "로그"\], "condition": \["서로소"\]}, "hold": ""}  
\`\`\`

\## Q18  
- 형식: 객관식  
- 배점: 4.6  
\#\## 발문  
실수 전체의 집합에서 정의된 함수 \$f(x)\$가 다음 조건을 만족시킨다.  
(가) \$f(x) \= \\begin{cases} x & (0 \\le x \< 1\) \\\\ \-x \+ 2 & (1 \\le x \< 2\) \\end{cases}\$  
(나) 모든 실수 \$x\$에 대하여 \$f(x \+ 2\) \= f(x)\$이다.  
자연수 \$n\$에 대하여 함수 \$y \= f(x)\$의 그래프가 함수 \$y \= \\log\_{5n} x\$의 그래프와 만나는 점의 개수가 \$74\$일 때, 자연수 \$n\$의 값은? \[4.6점\]  
\#\## 선지  
① \$15\$ ② \$16\$ ③ \$17\$ ④ \$18\$ ⑤ \$19\$  
\#\## 정답  
①  
\#\## 해설  
함수 \$y \= f(x)\$는 주기가 \$2\$이고 치역이 \$\[0, 1\]\$인 주기함수이다.  
함수 \$y \= \\log\_{5n} x\$는 증가함수이며 \$(1, 0)\$과 \$(5n, 1)\$을 지난다.  
- \$0 \< x \\le 1\$에서 \$\\log\_{5n} x \\le 0\$이고 \$f(x) \\ge 0\$인데 \$f(1) \= 1 \\neq 0\$이므로 교점이 없다.  
- \$1 \< x \\le 2\$에서 \$\\log\_{5n} x\$는 \$0\$에서 \$\\log\_{5n} 2 \> 0\$까지 증가하고 \$f(x)\$는 \$1\$에서 \$0\$까지 감소하므로 교점이 \$1\$개 있다.  
- \$x \> 5n\$에서는 \$\\log\_{5n} x \> 1 \\ge f(x)\$이므로 교점이 없다.  
한 주기 \$\[2m, 2m+2\]\$ (\$m \\ge 1\$)마다 \$f(x)\$가 \$0\$에서 \$1\$까지 증가했다가 \$0\$으로 감소하므로 \$0 \< \\log\_{5n} x \< 1\$인 구간에서는 한 주기당 교점이 \$2\$개씩 생긴다.  
총 교점의 개수가 \$74\$(짝수)이므로 \$(5n, 1)\$이 \$f(x)\$의 꼭짓점(\$x\$가 홀수, \$f(x)=1\$)과 일치해야 한다.  
따라서 \$5n\$은 홀수이고, 교점의 개수는  
\$1 \+ 2 \\times \\dfrac{5n - 3}{2} \+ 1 \= 5n - 1 \= 74\$  
\$5n \= 75 \\implies n \= 15\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-03", "subUnitKey": "H22-A-03-LOGARITHMIC\_FUNCTION", "conceptClusterKey": "H22-A-03-PERIODIC\_TRIANGLE\_LOG\_INTERSECTIONS", "primaryMethod": "주기 2인 톱니 함수 f(x)와 y=log\_(5n)x의 교점을 구간 \[1,2\], 중간 주기들, 끝점 x=5n으로 나누어 5n-1=74를 푼다.", "decisiveStep": "교점 개수가 짝수(74)이므로 끝점 x=5n이 홀수 꼭짓점(5n, 1)과 일치함을 파악해 5n-1=74를 세우는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "주기함수와 로그함수 y=log\_(5n)x 그래프의 교점 개수 조건 풀이"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주기함수의 치역 \[0,1\]과 로그함수의 0→1 통과 구간에서 끝점의 홀짝성까지 분석해야 하는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": \["주기함수", "로그함수", "자연수"\], "goal": \["값"\], "method": \["주기", "경우분류"\], "condition": \["교점", "개수"\]}, "hold": ""}  
\`\`\`

\## Q19  
- 형식: 객관식  
- 배점: 4.6  
\#\## 발문  
두 양수 \$a, b\$ (\$a \> 1\$, \$0 \< b \< 1\$)에 대하여  
\$\$f(x) \= \\begin{cases} \\log\_3(x - 3\) - a & (x \\ge 6\) \\\\ b^{x - 6} - a & (x \< 6\) \\end{cases}\$\$  
이다. 함수 \$y \= f(x)\$의 그래프와 \$x\$축이 만나는 두 점을 각각 \$A, B\$라 하자. \$\\overline{AB} \= 7\$이고 \$f(30) \= \\dfrac{a}{2}\$일 때, \$(ab)^3\$의 값은? \[4.6점\]  
\#\## 선지  
① \$\\dfrac{1}{8}\$ ② \$\\dfrac{1}{4}\$ ③ \$\\dfrac{1}{2}\$ ④ \$1\$ ⑤ \$8\$  
\#\## 정답  
④  
\#\## 해설  
\$f(30) \= \\dfrac{a}{2}\$이므로  
\$\\log\_3(30 - 3\) - a \= \\dfrac{a}{2}\$  
\$\\log\_3 27 - a \= \\dfrac{a}{2} \\implies 3 \= \\dfrac{3}{2}a \\implies a \= 2\$  
이제 \$f(x) \= 0\$인 두 점의 \$x\$좌표를 구한다.  
(1) \$x \\ge 6\$인 구간: \$\\log\_3(x - 3\) - 2 \= 0 \\implies x - 3 \= 3^2 \= 9 \\implies x \= 12\$  
따라서 한 교점은 \$B(12, 0)\$이다.  
(2) \$\\overline{AB} \= 7\$이고 다른 교점 \$A\$는 \$x \< 6\$인 구간에 있으므로 \$A\$의 \$x\$좌표는 \$12 - 7 \= 5\$  
따라서 \$f(5) \= b^{5 - 6} - 2 \= 0 \\implies b^{-1} \= 2 \\implies b \= \\dfrac{1}{2}\$ (\$0 \< b \< 1\$ 만족)  
그러므로 \$(ab)^3 \= \\left(2 \\times \\dfrac{1}{2}\\right)^3 \= 1^3 \= 1\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-03", "subUnitKey": "H22-A-03-LOGARITHMIC\_FUNCTION", "conceptClusterKey": "H22-A-03-PIECEWISE\_EXP\_LOG\_INTERCEPTS", "primaryMethod": "f(30)=a/2에서 a=2를 구하고, x≥6 구간의 x절편 12와 거리 AB=7로 x\<6 구간의 절편 5를 찾아 b=1/2을 구한다.", "decisiveStep": "x절편 B(12,0)으로부터 거리 7을 이용해 A(5,0)을 정하고 b^(-1)=2를 푸는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그함수", "l3": "로그함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "조각 정의된 로그·지수함수의 x축 교점 좌표와 거리 조건 활용"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 지수·로그함수의 함숫값 조건과 두 x절편 사이 거리를 연쇄 적용해 미정계수를 구하는 3단계 문항이다.", "level": "상", "item4slot": {"given": \["지수함수", "로그함수", "조각함수"\], "goal": \["값"\], "method": \["대입", "x절편", "거리"\], "condition": \["범위"\]}, "hold": ""}  
\`\`\`

\## Q20  
- 형식: 객관식  
- 배점: 4.7  
\#\## 발문  
두 상수 \$a, k\$ (\$1 \< a \< 2\$, \$0 \< k \< 1\$)에 대하여 직선 \$y \= 2\$가 두 곡선 \$y \= 2^{x+1}\$, \$y \= a^{x+1}\$과 만나는 두 점을 각각 \$A, B\$라 하고, 직선 \$y \= k\$가 두 곡선 \$y \= 2^{x+1}\$, \$y \= a^{x+1}\$과 만나는 두 점을 각각 \$C, D\$라 하자. 사각형 \$ADCB\$가 넓이가 \$\\dfrac{3}{2}\$인 평행사변형일 때, \$ak\$의 값은? \[4.7점\]  
\#\## 선지  
① \$2^{\\frac{1}{3}}\$ ② \$2^{-\\frac{1}{3}}\$ ③ \$2^{-\\frac{1}{2}}\$ ④ \$2^{\\frac{1}{2}}\$ ⑤ \$2^{\\frac{3}{2}}\$  
\#\## 정답  
③  
\#\## 해설  
네 점 \$A, B, C, D\$의 \$x\$좌표를 각각 구하면  
\$2^{x+1} \= 2 \\implies x \= 0\$이므로 \$A(0, 2)\$  
\$a^{x+1} \= 2 \\implies x \= \\log\_a 2 - 1\$이므로 \$B(\\log\_a 2 - 1, 2)\$  
\$2^{x+1} \= k \\implies x \= \\log\_2 k - 1\$이므로 \$C(\\log\_2 k - 1, k)\$  
\$a^{x+1} \= k \\implies x \= \\log\_a k - 1\$이므로 \$D(\\log\_a k - 1, k)\$  
\$1 \< a \< 2\$이고 \$0 \< k \< 1\$이므로 \$\\log\_a 2 \> 1\$이고 \$\\log\_a k \< \\log\_2 k \< 0\$이다.  
사각형 \$ADCB\$가 평행사변형이므로 \$\\overline{AB} \= \\overline{DC}\$, 즉 \$x\_B - x\_A \= x\_C - x\_D\$이다.  
\$\\log\_a 2 - 1 \= \\log\_2 k - \\log\_a k\$  
\$\\log\_2 k \+ 1 \= \\log\_a(2k)\$  
\$\\log\_2(2k) \= \\dfrac{\\log\_2(2k)}{\\log\_2 a}\$  
\$1 \< a \< 2\$에서 \$\\log\_2 a \\neq 1\$이므로 \$\\log\_2(2k) \= 0\$, 즉 \$2k \= 1\$에서 \$k \= \\dfrac{1}{2}\$  
평행사변형 \$ADCB\$의 높이는 \$2 - k \= 2 - \\dfrac{1}{2} \= \\dfrac{3}{2}\$이고 넓이가 \$\\dfrac{3}{2}\$이므로  
\$\\overline{AB} \\times \\dfrac{3}{2} \= \\dfrac{3}{2} \\implies \\overline{AB} \= \\log\_a 2 - 1 \= 1\$  
\$\\log\_a 2 \= 2 \\implies a^2 \= 2 \\implies a \= 2^{\\frac{1}{2}}\$ (\$a \> 1\$)  
따라서 \$ak \= 2^{\\frac{1}{2}} \\times 2^{-1} \= 2^{-\\frac{1}{2}}\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-02", "subUnitKey": "H22-A-02-EXPONENTIAL\_FUNCTION", "conceptClusterKey": "H22-A-03-EXP\_CURVES\_PARALLELOGRAM", "primaryMethod": "네 교점의 x좌표를 로그로 구한 뒤 평행사변형 대변 길이 조건으로 k=1/2을 확정하고 넓이 조건으로 a를 구한다.", "decisiveStep": "log\_2(2k) \= log\_2(2k)/log\_2 a에서 log\_2 a ≠ 1이므로 2k=1을 도출하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 활용", "l4": "그래프 교점"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_GRAPH\_INTERSECTION", "templateKey": "TPL\_FUNCTION\_INTERSECTION\_TWO\_FUNCTIONS", "why": "두 지수함수 곡선과 직선의 교점이 이루는 평행사변형 넓이 조건 풀이"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 지수함수의 네 교점 좌표를 로그로 표현하고 평행사변형 성질·넓이 식을 연립하는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": \["지수함수", "평행사변형", "넓이"\], "goal": \["곱"\], "method": \["로그", "밑변환", "교점"\], "condition": \["범위"\]}, "hold": ""}  
\`\`\`

\## Q21  
- 형식: 서술형  
- 배점: 6  
\#\## 발문  
정의역이 \$\\{x \\mid x \\le 2\\}\$인 함수 \$y \= 3^{2x} - 2 \\cdot 3^{x+1} - 5\$는 \$x \= a\$일 때 최댓값 \$M\$을 갖고 \$x \= b\$일 때 최솟값 \$m\$을 갖는다. 실수 \$a, b, M, m\$을 구하는 과정과 정답을 서술하시오. \[6점\]  
\#\## 정답  
\$a \= 2\$, \$b \= 1\$, \$M \= 22\$, \$m \= \-14\$  
\#\## 해설  
\$3^x \= t\$라 하면 정의역 \$x \\le 2\$에서 \$0 \< t \\le 3^2 \= 9\$이다.  
주어진 함수를 \$t\$에 대한 식으로 나타내면  
\$y \= t^2 - 6t - 5 \= (t - 3)^2 - 14\$  
\$0 \< t \\le 9\$에서 꼭짓점 \$t \= 3\$이 구간 안에 있으므로  
- \$t \= 3\$, 즉 \$3^x \= 3\$에서 \$x \= 1\$일 때 최솟값 \$m \= \-14\$를 가진다. 따라서 \$b \= 1\$  
- 구간의 끝점 \$t \= 9\$에서 \$y \= (9 - 3)^2 - 14 \= 22\$이고 \$t \\to 0+\$일 때 \$y \\to \-5\$이므로, \$t \= 9\$, 즉 \$3^x \= 9\$에서 \$x \= 2\$일 때 최댓값 \$M \= 22\$를 가진다. 따라서 \$a \= 2\$  
그러므로 \$a \= 2\$, \$b \= 1\$, \$M \= 22\$, \$m \= \-14\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-02", "subUnitKey": "H22-A-02-EXPONENTIAL\_FUNCTION", "conceptClusterKey": "H22-A-03-EXP\_QUADRATIC\_SUBSTITUTION\_EXTREMA", "primaryMethod": "3^x=t (0\<t≤9)로 치환한 이차함수를 완전제곱식으로 정리해 최솟값과 최댓값 및 그때의 x를 구한다.", "decisiveStep": "0\<t≤9에서 꼭짓점 t=3과 끝점 t=9의 함숫값을 비교해 각각 x=1, x=2로 역변환하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "지수함수", "l3": "지수함수의 활용", "l4": "최대·최소"}, "ptTplCandidate": {"problemTypeKey": "PT\_FUNCTION\_EXTREMUM", "templateKey": "TPL\_FUNCTION\_EXTREMUM\_INTERVAL\_ENDPOINT", "why": "제한된 정의역에서 3^x=t 치환을 통한 지수함수의 최댓값·최솟값 구하기"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수함수를 t\>0으로 치환해 제한된 범위의 이차함수 최대·최소를 구하는 표준 서술형 문항이다.", "level": "중", "item4slot": {"given": \["지수함수"\], "goal": \["최댓값", "최솟값"\], "method": \["치환", "완전제곱식"\], "condition": \["정의역"\]}, "hold": ""}  
\`\`\`

\## Q22  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
빛이 어떤 유리판을 한 장 통과할 때마다 그 밝기가 \$10\\%\$씩 감소한다고 한다. 밝기가 \$A\$인 빛이 이 유리판을 \$15\$장 통과했을 때 그 밝기는 처음의 몇 배가 되는지 구하는 과정과 정답을 서술하시오. (단, \$\\log 9 \= 0.9542\$, \$\\log 2.056 \= 0.3130\$으로 계산한다.) \[7점\]  
\#\## 정답  
\$0.2056\$배  
\#\## 해설  
유리판을 한 장 통과할 때마다 밝기가 \$10\\%\$씩 감소하므로 \$1\$장 통과 후의 밝기는 원래 밝기의 \$0.9\$배가 된다.  
따라서 \$15\$장을 통과한 후의 밝기는 \$A \\times (0.9)^{15}\$이므로 처음의 \$k \= (0.9)^{15}\$배이다.  
양변에 상용로그를 취하면  
\$\\log k \= \\log (0.9)^{15} \= 15 \\log \\dfrac{9}{10} \= 15(\\log 9 - 1)\$  
\$= 15(0.9542 - 1\) \= 15 \\times (-0.0458) \= \-0.6870\$  
\$-0.6870 \= \-1 \+ 0.3130 \= \\log 10^{-1} \+ \\log 2.056 \= \\log 0.2056\$  
따라서 \$k \= 0.2056\$, 즉 처음의 \$0.2056\$배가 된다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "H22-A-02-COMMON\_LOG\_ATTENUATION", "primaryMethod": "15장 통과 비율 (0.9)^15에 상용로그를 취해 음의 로그값을 정수 부분 \-1과 소수 부분 0.3130으로 분리한다.", "decisiveStep": "-0.6870 \= \-1 \+ 0.3130으로 양의 소수 부분을 만들어 log 0.2056으로 환원하는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "상용로그", "l4": "소수점 위치"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_COMMON\_LOG", "templateKey": "TPL\_H22A\_01\_COMMON\_LOG\_078", "why": "감쇠 비율 (0.9)^15에 상용로그를 취해 정수·소수 부분으로 진수 환원"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상용로그를 이용해 (0.9)^15의 근사값을 음의 정수 부분과 양의 소수 부분으로 분리 계산하는 문항이다.", "level": "중", "item4slot": {"given": \["상용로그"\], "goal": \["비"\], "method": \["상용로그", "정수부분", "소수부분"\], "condition": \["증가감소"\]}, "hold": ""}  
\`\`\`

\## Q23  
- 형식: 서술형  
- 배점: 7  
\#\## 발문  
\$1\$이 아닌 세 양수 \$a, b, c\$가 \$-4\\log\_a b \= 16\\log\_b c \= \\log\_c a\$를 만족시킨다. \$b \\times c\$의 값이 \$100\$ 이하의 자연수가 되도록 하는 모든 자연수 \$a\$의 값의 합을 구하는 과정과 정답을 서술하시오. \[7점\]  
\#\## 정답  
\$353\$  
\#\## 해설  
\$-4\\log\_a b \= 16\\log\_b c \= \\log\_c a \= k\$라 하면 세 식을 변변 곱하여  
\$(-4\\log\_a b)(16\\log\_b c)(\\log\_c a) \= k^3\$  
\$\\log\_a b \\cdot \\log\_b c \\cdot \\log\_c a \= 1\$이므로  
\$k^3 \= \-64 \\implies k \= \-4\$ (\$k\$는 실수)  
따라서  
\$-4\\log\_a b \= \-4 \\implies \\log\_a b \= 1 \\implies b \= a\$  
\$16\\log\_b c \= \-4 \\implies \\log\_b c \= \-\\dfrac{1}{4} \\implies c \= b^{-\\frac{1}{4}} \= a^{-\\frac{1}{4}}\$  
그러므로 \$b \\times c \= a \\cdot a^{-\\frac{1}{4}} \= a^{\\frac{3}{4}}\$이다.  
\$a\$는 \$1\$이 아닌 자연수이고 \$a^{\\frac{3}{4}}\$이 \$100\$ 이하의 자연수가 되려면 \$a \= m^4\$ (\$m\$은 \$2\$ 이상의 자연수) 꼴이어야 한다.  
이때 \$a^{\\frac{3}{4}} \= m^3 \\le 100\$이므로 \$m \= 2, 3, 4\$이다.  
- \$m \= 2\$: \$a \= 2^4 \= 16\$ (\$m^3 \= 8\$)  
- \$m \= 3\$: \$a \= 3^4 \= 81\$ (\$m^3 \= 27\$)  
- \$m \= 4\$: \$a \= 4^4 \= 256\$ (\$m^3 \= 64\$)  
따라서 구하는 모든 자연수 \$a\$의 값의 합은 \$16 \+ 81 \+ 256 \= 353\$이다.  
\`\`\`json:plan  
{"exempt": true, "reason": "STRICT\_VARIANT"}  
\`\`\`  
\`\`\`json:meta  
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "대수", "courseKey": "H22-A", "curriculum": "2022", "standardUnitKey": "H22-A-01", "subUnitKey": "H22-A-01-EXPONENT\_LOG", "conceptClusterKey": "H22-A-02-CYCLIC\_LOG\_CHAIN\_NATURAL", "primaryMethod": "순환 로그 곱 log\_a b·log\_b c·log\_c a=1로 비례상수 k=-4를 구해 b×c \= a^(3/4)의 자연수 조건으로 a를 찾는다.", "decisiveStep": "세 식을 곱해 k³=-64에서 k=-4를 얻고 a=m⁴ 꼴로 치환해 m³≤100을 푸는 단계", "rpm": {"majorUnit": "지수함수와 로그함수", "midUnit": "로그", "l3": "로그의 성질", "l4": "밑의 변환"}, "ptTplCandidate": {"problemTypeKey": "PT\_H22A\_01\_LOG\_PROPERTIES", "templateKey": "TPL\_H22A\_01\_LOG\_PROPERTIES\_076", "why": "순환 로그식의 밑변환 곱과 자연수 조건을 결합한 부정방정식 풀이"}, "crossConceptKeys": \[\], "conditionKeys": \[\], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑이 순환하는 연쇄 로그 등식에서 비례상수를 구하고 유리수 지수의 자연수 조건까지 해결해야 하는 고난도 문항이다.", "level": "상", "item4slot": {"given": \["로그", "자연수"\], "goal": \["합"\], "method": \["밑변환", "지수법칙"\], "condition": \["자연수", "범위"\]}, "hold": ""}  
\`\`\`  
