```json:exam
{"stem": "24_팔마고_1학기_중간_고2_수학I_유사", "sourceArchiveFile": "original/high/h2/1mid/24_팔마고_1학기_중간_고2_수학I.js", "examFolder": "1mid", "grade": "고2", "subject": "수학I", "curriculum": "2015", "questionCount": 22, "totalScore": 100, "generatedAt": "2026-11-19"}
```


## Q01
- 형식: 객관식
- 배점: 3.8
### 발문
다음 설명 중 옳은 것은?
### 선지
① $9$의 제곱근은 $3$이다. ② $-27$의 세제곱근은 $-3$이다. ③ $-11$의 다섯제곱근 중 실수인 것은 $-\sqrt[5]{11}$이다. ④ $\sqrt[4]{81}=-3$ ⑤ $-6$의 네제곱근 중 실수인 것은 $-\sqrt[4]{6}$이다.
### 정답
③
### 해설
각 선지에서 거듭제곱근의 정의와 실수인 거듭제곱근의 존재 조건을 확인한다.


① $x^2 = 9$의 근은 $x = 3$ 또는 $x = -3$이므로 $9$의 제곱근은 $3$과 $-3$ 두 개이다. 따라서 옳지 않다.


② $x^3 = -27$에서 $x^3 + 27 = (x+3)(x^2-3x+9) = 0$이므로 $-27$의 세제곱근은 실수 $-3$을 포함하여 복소수 범위에서 $\frac{3\pm 3\sqrt{3}i}{2}$까지 총 $3$개이다. 따라서 옳지 않다.


③ $5$는 홀수이므로 음수 $-11$의 다섯제곱근 중 실수인 것이 오직 하나 존재하며, $(-\sqrt[5]{11})^5 = -11$이므로 $-\sqrt[5]{11}$이다. 따라서 옳다.


④ $\sqrt[4]{81}$은 $81$의 양의 네제곱근을 뜻하므로 $\sqrt[4]{81} = 3$이다. 따라서 옳지 않다.


⑤ $4$는 짝수이므로 음수 $-6$의 네제곱근 중 실수인 것은 존재하지 않는다. 따라서 옳지 않다.


따라서 옳은 것은 ③이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-RADICAL-DEF", "primaryMethod": "제곱근과 n제곱근의 정의를 적용해 실수인 거듭제곱근의 개수와 부호를 판별한다.", "decisiveStep": "짝수 거듭제곱근과 홀수 거듭제곱근의 실수 개수 차이를 구분하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "거듭제곱근의 기본 정의와 부호 판별만으로 즉시 해결되는 기본 문항이다.", "level": "하", "item4slot": {"given": ["거듭제곱근"], "goal": ["판정"], "method": ["거듭제곱근"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q02
- 형식: 객관식
- 배점: 3.9
### 발문
다음 중 함수 $y = \log_3 \frac{1}{3}(x-2)$에 대한 설명으로 옳지 않은 것은?
### 선지
① $y=\log_{\frac{1}{3}} x$의 그래프를 $x$축의 방향으로 $m$만큼, $y$축의 방향으로 $n$만큼 평행이동한 그래프이다. (단, $m, n$은 상수) ② 정의역은 $\{x \mid x > 2\}$이다. ③ 그래프의 점근선은 직선 $x=2$이다. ④ 그래프는 점 $(5, 0)$을 지난다. ⑤ $x$의 값이 증가하면 $y$의 값도 증가한다.
### 정답
①
### 해설
주어진 함수는 $y = \log_3 \left(\dfrac{x-2}{3}\right) = \log_3 (x-2) - 1$이다.


$$\begin{aligned}
\text{진수 조건: } & \frac{x-2}{3} > 0 \iff x > 2 \\
\text{점근선: } & x = 2 \\
x=5 \text{일 때: } & y = \log_3(5-2) - 1 = \log_3 3 - 1 = 0
\end{aligned}$$


따라서 정의역은 $\{x \mid x > 2\}$, 점근선은 $x=2$, 그래프는 점 $(5, 0)$을 지난다. 또한 밑이 $3 > 1$이므로 $x$의 값이 증가하면 $y$의 값도 증가한다.


한편 $y = \log_{\frac{1}{3}} x = -\log_3 x$는 감소함수이고, 평행이동은 함수의 증가·감소 상태를 바꾸지 않으므로 증가함수인 $y = \log_3(x-2) - 1$을 $y = \log_{\frac{1}{3}} x$의 평행이동으로 얻을 수 없다.


따라서 옳지 않은 것은 ①이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-LOGFUNC-PROP", "primaryMethod": "로그함수 y=log_3((x-2)/3)의 진수 조건, 점근선, 지나는 점 및 밑의 대소 관계를 통해 평행이동 가능 여부를 판별한다.", "decisiveStep": "log_(1/3) x의 감소성과 log_3((x-2)/3)의 증가성을 비교해 평행이동 불가함을 판단하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그함수의 정의역, 점근선, 평행이동 성질을 종합 확인하는 표준 문항이다.", "level": "중", "item4slot": {"given": ["로그함수"], "goal": ["판정"], "method": ["로그함수", "평행이동", "점근선", "정의역"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q03
- 형식: 객관식
- 배점: 4
### 발문
정의역이 $\{x \mid -1 \le x \le 3\}$인 함수 $y=3^{x+1}+2$는 $x=p$일 때 최솟값 $m$을 갖는다. 이때 $p+m$의 값은?
### 선지
① $-1$ ② $0$ ③ $1$ ④ $2$ ⑤ $3$
### 정답
④
### 해설
함수 $y = 3^{x+1} + 2$는 밑이 $3 > 1$이므로 $x$의 값이 증가할수록 함숫값도 증가하는 증가함수이다.


따라서 정의역 $-1 \le x \le 3$에서 최솟값은 구간의 왼쪽 끝 $x = -1$일 때 갖는다.


$$\begin{aligned}
p &= -1 \\
m &= 3^{-1+1} + 2 = 3^0 + 2 = 1 + 2 = 3
\end{aligned}$$


그러므로 $p + m = -1 + 3 = 2$이다. 따라서 정답은 ④이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXPFUNC-MAXMIN", "primaryMethod": "밑이 3인 지수함수 y=3^(x+1)+2의 증가성을 이용해 폐구간 [-1, 3]의 왼쪽 끝점에서 최솟값을 구한다.", "decisiveStep": "밑 3>1이므로 x=-1에서 최솟값 3을 갖는다고 결정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "단일 지수함수의 단조성을 이용해 구간 최솟값을 바로 구하는 기초 문항이다.", "level": "하", "item4slot": {"given": ["지수함수", "정의역"], "goal": ["최솟값", "합"], "method": ["지수함수"], "condition": ["닫힌구간"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q04
- 형식: 객관식
- 배점: 4.1
### 발문
다음 <보기>에서 옳은 것만을 있는 대로 고른 것은?


<보기>
ㄱ. $\frac{5}{6}\pi = 150^\circ$
ㄴ. 시초선 $\mathrm{OX}$를 고정된 것으로 생각할 때, 동경 $\mathrm{OP}$의 위치가 정해지면 $\angle \mathrm{XOP}$의 크기는 유일하게 결정된다.
ㄷ. $\theta = 360^\circ \times n + 210^\circ$ ($n$은 정수)는 제$3$사분면의 각이다.
### 선지
① ㄱ ② ㄱ, ㄷ ③ ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ
### 정답
②
### 해설
ㄱ. 라디안을 육십분법으로 바꾸면
$$\frac{5}{6}\pi \times \frac{180^\circ}{\pi} = 150^\circ$$
이므로 참이다.


ㄴ. 동경 $\mathrm{OP}$의 위치가 같더라도 회전수 $n$에 따라 $360^\circ \times n + \alpha$ 형태로 무수히 많은 각이 대응하므로 $\angle \mathrm{XOP}$의 크기는 유일하게 결정되지 않는다. 따라서 거짓이다.


ㄷ. $\theta = 360^\circ \times n + 210^\circ$ ($n$은 정수)는 $210^\circ$와 동경이 같은 일반각이고, $180^\circ < 210^\circ < 270^\circ$이므로 제$3$사분면의 각이다. 따라서 참이다.


그러므로 옳은 것은 ㄱ, ㄷ이므로 정답은 ②이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-05-ANGLE-RADIAN", "primaryMethod": "호도법과 육십분법의 환산, 동경의 일반각 표현, 사분면의 각 정의를 각각 판별한다.", "decisiveStep": "동경의 위치가 같아도 회전수에 따라 일반각이 무수히 많음을 확인하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "호도법, 일반각, 사분면 각의 개념을 보기형으로 함께 점검하는 문항이다.", "level": "중", "item4slot": {"given": ["일반각", "호도법"], "goal": ["판정"], "method": ["호도법", "일반각", "일반각"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q05
- 형식: 객관식
- 배점: 4.2
### 발문
$\log_{(x+2)} (30-x-x^2)$이 정의되도록 하는 정수 $x$의 개수는?
### 선지
① $1$ ② $2$ ③ $3$ ④ $4$ ⑤ $5$
### 정답
⑤
### 해설
로그 $\log_{(x+2)}(30-x-x^2)$이 정의되려면 밑 조건과 진수 조건을 모두 만족해야 한다.


$$\begin{aligned}
\text{밑 조건: } & x+2 > 0 \text{ 이고 } x+2 \ne 1 \implies x > -2, \; x \ne -1 \\
\text{진수 조건: } & 30 - x - x^2 > 0 \iff x^2 + x - 30 < 0 \\
& \iff (x+6)(x-5) < 0 \iff -6 < x < 5
\end{aligned}$$


두 조건을 동시에 만족하는 $x$의 범위는
$$-2 < x < 5, \quad x \ne -1$$
이다. 이 범위에 속하는 정수 $x$는 $0, 1, 2, 3, 4$로 모두 $5$개이다.


따라서 정답은 ⑤이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-LOG-DEF", "primaryMethod": "로그의 밑 조건(양수 및 1이 아님)과 진수 조건(양수)을 연립부등식으로 풀어 정수 해를 센다.", "decisiveStep": "x+2 != 1에서 x != -1을 제외하여 정수 개수를 확정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그의 정의 조건과 이차부등식을 결합해 정수 개수를 세는 전형적 중위 문항이다.", "level": "중", "item4slot": {"given": ["로그"], "goal": ["개수"], "method": ["진수조건", "이차부등식"], "condition": ["정수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q06
- 형식: 객관식
- 배점: 4.3
### 발문
세 양수 $a, b, c$가 $a^x = b^{2y} = c^{3z} = 5$, $abc = 125$를 만족시킬 때, $\frac{6}{x} + \frac{3}{y} + \frac{2}{z}$의 값은?
### 선지
① $12$ ② $15$ ③ $18$ ④ $21$ ⑤ $24$
### 정답
③
### 해설
$a^x = b^{2y} = c^{3z} = 5$에서 지수를 각 변의 역수로 넘기면 다음과 같다.


$$\begin{aligned}
a &= 5^{\frac{1}{x}}, \quad b = 5^{\frac{1}{2y}}, \quad c = 5^{\frac{1}{3z}}
\end{aligned}$$


세 수를 모두 곱하면 $abc = 125 = 5^3$이므로
$$abc = 5^{\frac{1}{x} + \frac{1}{2y} + \frac{1}{3z}} = 5^3$$
이다. 밑이 $5$로 같으므로 지수를 비교하면
$$\frac{1}{x} + \frac{1}{2y} + \frac{1}{3z} = 3$$
이다. 양변에 $6$을 곱하면
$$\frac{6}{x} + \frac{3}{y} + \frac{2}{z} = 18$$
을 얻는다. 따라서 정답은 ③이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-EXP-TRANS", "primaryMethod": "a^x=b^(2y)=c^(3z)=5를 밑 5의 거듭제곱으로 표현한 뒤 abc=5^3에 대입해 지수의 합을 구한다.", "decisiveStep": "abc=5^(1/x+1/(2y)+1/(3z))=5^3으로부터 1/x+1/(2y)+1/(3z)=3을 끌어내는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "유리수 지수 변형과 식의 값 계산을 연결한 기본적인 지수 계산 문항이다.", "level": "중", "item4slot": {"given": ["거듭제곱", "등식"], "goal": ["식의값"], "method": ["지수법칙"], "condition": ["양수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q07
- 형식: 객관식
- 배점: 4.4
### 발문
$x = \log_3 10 + \log_9 16$일 때, $3^x$의 값은?
### 선지
① $40$ ② $42$ ③ $44$ ④ $46$ ⑤ $48$
### 정답
①
### 해설
밑이 다른 로그의 밑을 $3$으로 통일하면 다음과 같다.


$$\begin{aligned}
\log_9 16 &= \frac{\log_3 16}{\log_3 9} = \frac{\log_3 2^4}{2} = \frac{4\log_3 2}{2} = \log_3 2^2 = \log_3 4 \\
x &= \log_3 10 + \log_3 4 = \log_3 (10 \times 4) = \log_3 40
\end{aligned}$$


따라서 로그의 정의에 의해 $3^x = 40$이다. 정답은 ①이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-LOG-BASE", "primaryMethod": "밑변환 공식으로 log_9 16을 log_3 4로 바꾼 뒤 로그의 합을 정리해 3^x를 구한다.", "decisiveStep": "log_9 16 = log_3 4로 밑을 통일하여 x = log_3 40을 얻는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "밑변환과 로그의 덧셈 성질, 로그의 정의를 순차 적용하는 문항이다.", "level": "중", "item4slot": {"given": ["로그"], "goal": ["식의값"], "method": ["밑변환", "로그", "성질"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q08
- 형식: 객관식
- 배점: 4.4
### 발문
함수 $f(x) = \log_2 \left(1 + \frac{1}{x+3}\right)$에서
$$f(1) + f(2) + f(3) + \cdots + f(n) = 3$$
을 만족시키는 자연수 $n$의 값은?
### 선지
① $22$ ② $24$ ③ $26$ ④ $28$ ⑤ $30$
### 정답
④
### 해설
진수를 통분하여 정리하면 $1 + \dfrac{1}{x+3} = \dfrac{x+4}{x+3}$이므로
$$f(k) = \log_2 \frac{k+4}{k+3}$$
이다. 로그의 합은 진수의 곱에 대한 로그와 같으므로
$$\begin{aligned}
f(1)+f(2)+\cdots+f(n) &= \log_2 \left(\frac{5}{4} \cdot \frac{6}{5} \cdot \frac{7}{6} \cdots \frac{n+4}{n+3}\right) \\
&= \log_2 \frac{n+4}{4}
\end{aligned}$$
이다. 주어진 등식에 대입하면
$$\log_2 \frac{n+4}{4} = 3 \implies \frac{n+4}{4} = 2^3 = 8$$
이므로 $n + 4 = 32$, 즉 $n = 28$이다.


따라서 정답은 ④이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-LOG-TELESCOPE", "primaryMethod": "진수를 가분수로 통분한 뒤 로그의 합을 진수의 곱으로 바꿔 연쇄 약분하여 n을 구한다.", "decisiveStep": "분모·분자의 연쇄 약분으로 log_2((n+4)/4)=3을 도출하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "진수 통분 후 로그의 성질로 망원곱 형태를 만드는 정형화된 문항이다.", "level": "중", "item4slot": {"given": ["로그함수", "등식"], "goal": ["매개변수"], "method": ["로그", "성질", "통분"], "condition": ["자연수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q09
- 형식: 객관식
- 배점: 4.5
### 발문
$2$ 이상의 두 자연수 $m$, $n$에 대하여 등식
$$\sqrt[m]{8} \times \sqrt[n]{2} = \sqrt{2}$$
가 성립할 때, $m-n$의 최솟값은?
### 선지
① $-9$ ② $-7$ ③ $-3$ ④ $0$ ⑤ $5$
### 정답
②
### 해설
$8 = 2^3$이므로 주어진 등식을 밑이 $2$인 거듭제곱으로 나타내면
$$2^{\frac{3}{m}} \cdot 2^{\frac{1}{n}} = 2^{\frac{1}{2}} \implies \frac{3}{m} + \frac{1}{n} = \frac{1}{2}$$
이다. 양변에 $2mn$을 곱하여 정리하면 다음과 같다.


$$\begin{aligned}
6n + 2m &= mn \\
mn - 2m - 6n &= 0 \\
(m-6)(n-2) &= 12
\end{aligned}$$


$n \ge 2$이므로 $n - 2 \ge 0$이고 곱이 $12 > 0$이므로 $m - 6 > 0$, $n - 2 > 0$이다. 두 인수가 양의 정수이므로 $12$의 양의 약수쌍을 모두 구하면


$$\begin{aligned}
(m-6, n-2) &= (1, 12), \; (2, 6), \; (3, 4), \; (4, 3), \; (6, 2), \; (12, 1) \\
(m, n) &= (7, 14), \; (8, 8), \; (9, 6), \; (10, 5), \; (12, 4), \; (18, 3)
\end{aligned}$$


각 경우의 $m - n$의 값은 차례로 $-7, 0, 3, 5, 8, 15$이다. 따라서 $m - n$의 최솟값은 $-7$이므로 정답은 ②이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-INDETERMINATE-EQ", "primaryMethod": "거듭제곱근을 지수로 바꿔 3/m+1/n=1/2을 얻은 뒤 (m-6)(n-2)=12로 인수분해해 자연수 쌍을 구한다.", "decisiveStep": "(m-6)(n-2)=12 형태 부정방정식으로 변환해 양의 약수쌍을 전수 조사하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수 등식을 정수 조건 부정방정식으로 전환하여 최솟값을 찾아야 하는 문항이다.", "level": "상", "item4slot": {"given": ["거듭제곱근", "등식"], "goal": ["최솟값"], "method": ["지수법칙", "인수분해", "약수"], "condition": ["자연수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q10
- 형식: 객관식
- 배점: 4.5
### 발문
$1$이 아닌 두 양수 $a, b$에 대하여 두 함수 $f(x)=a^x$, $g(x)=b^x$가 양수 $n$에 대하여 $f(n) < g(n)$을 만족시킬 때, 옳은 것만을 <보기>에서 있는 대로 고른 것은?


<보기>
ㄱ. $b > 1$이면 $a > 1$이다.
ㄴ. $a > 1$이면 $b > 1$이다.
ㄷ. $ab < 1$이면 $0 < a < 1$이다.
### 선지
① ㄱ ② ㄴ ③ ㄱ, ㄴ ④ ㄱ, ㄷ ⑤ ㄴ, ㄷ
### 정답
⑤
### 해설
$n > 0$이고 $a^n < b^n$이므로 양의 지수에 대하여 밑의 대소 관계는 $0 < a < b$이다.


ㄱ. $b > 1$이더라도 $0 < a < 1$인 경우(예: $a = \frac{1}{2}$, $b = 2$)가 존재하므로 거짓이다.


ㄴ. $a > 1$이면 $b > a > 1$이므로 $b > 1$이다. 따라서 참이다.


ㄷ. 대우를 생각하여 $a \ge 1$이라 가정하면 $a \ne 1$이므로 $a > 1$이고, $b > a > 1$이므로 $ab > 1$이 된다. 따라서 $ab < 1$이면 $0 < a < 1$이어야 하므로 참이다.


그러므로 옳은 것은 ㄴ, ㄷ이므로 정답은 ⑤이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "10", "variationType": "CONDITION", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXPFUNC-BASE", "primaryMethod": "양수 n에 대해 a^n < b^n이면 0<a<b임을 파악하고 각 명제의 참·거짓을 반례와 대우로 판별한다.", "decisiveStep": "f(n)<g(n) (n>0)으로부터 0<a<b를 도출해 대우 ab>=1 논리로 ㄷ을 판정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "B23", "difficultyReason": "지수함수의 밑 비교와 명제의 대우 판정이 결합되어 있어 중위권에서 경계성이 있는 문항이다.", "level": "중", "item4slot": {"given": ["지수함수", "부등식"], "goal": ["판정"], "method": ["지수함수", "성질", "대우"], "condition": ["양수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q11
- 형식: 객관식
- 배점: 4.5
### 발문
반지름의 길이가 $7$이고 중심각의 크기가 $\theta$인 부채꼴이 있다. $\theta$가 다음 <조건>을 만족시킬 때, 이 부채꼴의 호의 길이의 최댓값은?


<조건>
(가) $0 < \theta < \pi$
(나) 좌표평면에서 각 $\theta$를 나타내는 동경과 $5\theta$를 나타내는 동경이 $x$축에 대하여 대칭이다.
### 선지
① $\frac{7}{3}\pi$ ② $\frac{10}{3}\pi$ ③ $\frac{14}{3}\pi$ ④ $\frac{16}{3}\pi$ ⑤ $\frac{20}{3}\pi$
### 정답
③
### 해설
각 $\theta$를 나타내는 동경과 $5\theta$를 나타내는 동경이 $x$축에 대하여 대칭이므로 두 각의 합은 $2n\pi$ ($n$은 정수) 꼴이다.


$$\begin{aligned}
\theta + 5\theta &= 2n\pi \\
6\theta &= 2n\pi \\
\theta &= \frac{n\pi}{3}
\end{aligned}$$


조건 (가)에 의해 $0 < \frac{n\pi}{3} < \pi$이므로 $0 < n < 3$이고, 정수 $n$은 $1$ 또는 $2$이다. 따라서 가능한 $\theta$는 $\frac{\pi}{3}$, $\frac{2\pi}{3}$이다.


부채꼴의 호의 길이 $l = r\theta$는 $\theta$가 최대일 때 최대가 되므로 $\theta = \frac{2\pi}{3}$일 때
$$l = 7 \times \frac{2\pi}{3} = \frac{14}{3}\pi$$
이다. 따라서 정답은 ③이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "11", "variationType": "CONDITION", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-05-RAY-SYM-ARC", "primaryMethod": "x축 대칭인 두 동경의 합이 2n*pi임을 이용해 범위 내 theta를 구하고 호의 길이 최댓값을 계산한다.", "decisiveStep": "theta + 5theta = 2n*pi에서 0<theta<pi를 만족하는 최대 각 2pi/3을 찾는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "두 동경의 대칭 조건과 부채꼴 호의 길이 공식을 순차 연결하는 표준 문항이다.", "level": "중", "item4slot": {"given": ["부채꼴", "일반각", "호", "길이"], "goal": ["최댓값"], "method": ["일반각", "축대칭", "호", "길이"], "condition": ["범위"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q12
- 형식: 객관식
- 배점: 4.6
### 발문
두 실수 $a, b$에 대하여 $b^2 < b < a$일 때, 옳은 것만을 <보기>에서 있는 대로 고른 것은?


<보기>
ㄱ. $b^b > b^a$
ㄴ. $\log_b a > 1$
ㄷ. $\log_{a+1} b \times \log_{a+1} (b+1) < 0$
### 선지
① ㄱ ② ㄱ, ㄷ ③ ㄷ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ, ㄷ
### 정답
②
### 해설
$b^2 < b$에서 $b(b-1) < 0$이므로 $0 < b < 1$이다. 또한 $b < a$이므로 $a > b > 0$이다.


ㄱ. 밑 $b$가 $0 < b < 1$이므로 지수함수 $y = b^x$는 감소함수이다. $b < a$이므로 $b^b > b^a$가 성립하여 참이다.


ㄴ. 밑 $b$가 $0 < b < 1$이므로 로그함수 $y = \log_b x$는 감소함수이다. $a > b$이므로 $\log_b a < \log_b b = 1$이다. 따라서 거짓이다.


ㄷ. $a > 0$이므로 $a+1 > 1$이다. 이때 $0 < b < 1$이므로 $\log_{a+1} b < 0$이고, $b+1 > 1$이므로 $\log_{a+1}(b+1) > 0$이다. 따라서 두 값의 곱은 음수이므로 참이다.


그러므로 옳은 것은 ㄱ, ㄷ이므로 정답은 ②이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-EXPLOG-INEQ", "primaryMethod": "b^2<b에서 0<b<1을 파악한 뒤 지수함수와 로그함수의 증가·감소 성질로 대소와 부호를 판별한다.", "decisiveStep": "0<b<1과 a+1>1을 각각 지수·로그함수의 단조성에 적용해 부호를 확정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차부등식으로 밑의 범위를 잡은 뒤 지수·로그의 단조성을 복합 판정하는 문항이다.", "level": "중", "item4slot": {"given": ["부등식", "지수", "로그"], "goal": ["판정"], "method": ["지수함수", "성질", "로그함수", "성질", "이차부등식"], "condition": ["실수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q13
- 형식: 객관식
- 배점: 4.6
### 발문
길이가 $12$인 선분 $\mathrm{AB}$를 지름으로 하는 반원의 호 위에 점 $\mathrm{P}$가 있다. 선분 $\mathrm{AB}$ 위에 점 $\mathrm{Q}$를 $\overline{\mathrm{AP}}=\overline{\mathrm{AQ}}$가 되도록 잡고 부채꼴 $\mathrm{APQ}$의 호 $\mathrm{PQ}$를 그린다. 호 $\mathrm{BP}$의 길이가 $2\pi$일 때, 부채꼴 $\mathrm{APQ}$의 넓이는?
### 선지
① $\frac{15}{2}\pi$ ② $8\pi$ ③ $\frac{17}{2}\pi$ ④ $9\pi$ ⑤ $\frac{19}{2}\pi$
### 정답
④
### 해설
반원의 지름 $\overline{\mathrm{AB}} = 12$이므로 반원의 중심을 $\mathrm{O}$라 하면 반지름의 길이는 $6$이다.


호 $\mathrm{BP}$의 길이가 $2\pi$이므로 중심각 $\angle \mathrm{BOP}$의 크기는
$$\angle \mathrm{BOP} = \frac{2\pi}{6} = \frac{\pi}{3}$$
이다. 선분 $\mathrm{AB}$가 지름이므로 $\angle \mathrm{APB} = \frac{\pi}{2}$이고, 호 $\mathrm{BP}$에 대한 원주각 $\angle \mathrm{PAB}$는 중심각 $\angle \mathrm{BOP}$의 절반이므로
$$\angle \mathrm{PAQ} = \angle \mathrm{PAB} = \frac{1}{2} \angle \mathrm{BOP} = \frac{\pi}{6}$$
이다. 또한 직각삼각형 $\mathrm{APB}$에서
$$\overline{\mathrm{AP}} = \overline{\mathrm{AB}} \cos \frac{\pi}{6} = 12 \times \frac{\sqrt{3}}{2} = 6\sqrt{3}$$
이다. 따라서 반지름의 길이가 $6\sqrt{3}$이고 중심각의 크기가 $\frac{\pi}{6}$인 부채꼴 $\mathrm{APQ}$의 넓이는
$$S = \frac{1}{2} \times (6\sqrt{3})^2 \times \frac{\pi}{6} = \frac{1}{2} \times 108 \times \frac{\pi}{6} = 9\pi$$
이다. 따라서 정답은 ④이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-05-SECTOR-CIRCLE", "primaryMethod": "호 BP의 길이로 중심각과 원주각 ∠PAB=pi/6을 구하고 직각삼각형 APB에서 AP를 계산해 부채꼴 APQ의 넓이를 구한다.", "decisiveStep": "원주각 성질로 ∠PAQ=pi/6 및 현 AP=6sqrt(3)을 동시에 결정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "원주각과 직각삼각형, 부채꼴 넓이 공식을 연계해야 하는 도형 결합 문항이다.", "level": "중", "item4slot": {"given": ["원", "반원", "부채꼴", "호", "길이"], "goal": ["넓이"], "method": ["원주각", "직각삼각형", "부채꼴", "넓이"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q14
- 형식: 객관식
- 배점: 4.7
### 발문
실수 $x$에 대하여 방정식 $k \times 3^x = 9^x + 3^x + 9$가 서로 다른 두 개의 실근을 갖도록 하는 정수 $k$ 중 절댓값이 $12$보다 작은 것의 개수는?
### 선지
① $4$ ② $5$ ③ $6$ ④ $7$ ⑤ $8$
### 정답
①
### 해설
$t = 3^x$로 치환하면 $t > 0$이고 $9^x = t^2$이므로 주어진 방정식은
$$t^2 + (1-k)t + 9 = 0$$
이 된다.


원래 방정식이 서로 다른 두 실근 $x$를 가지려면 이차방정식 $t^2 + (1-k)t + 9 = 0$이 **서로 다른 두 양의 실근**을 가져야 한다. 근의 부호와 판별식 조건은 다음과 같다.


$$\begin{aligned}
\text{판별식: } & D = (1-k)^2 - 36 > 0 \iff (k-1)^2 > 36 \implies k > 7 \text{ 또는 } k < -5 \\
\text{두 근의 합: } & k - 1 > 0 \implies k > 1 \\
\text{두 근의 곱: } & 9 > 0 \quad (\text{항상 성립})
\end{aligned}$$


세 조건을 모두 만족하는 $k$의 범위는 $k > 7$이다. 이 중 $|k| < 12$를 만족하는 정수 $k$는 $8, 9, 10, 11$로 모두 $4$개이다.


따라서 정답은 ①이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXPEQ-ROOTS", "primaryMethod": "t=3^x(>0)로 치환한 이차방정식이 서로 다른 두 양의 실근을 갖도록 판별식과 근과 계수의 관계 조건을 세운다.", "decisiveStep": "치환 변수 t>0 조건 때문에 판별식 D>0 외에 두 근의 합 k-1>0 조건을 함께 적용하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수방정식 치환 시 양근 조건 누락 실수를 점검하는 핵심 문항이다.", "level": "중", "item4slot": {"given": ["지수방정식"], "goal": ["개수"], "method": ["치환", "판별식", "근과계수의관계"], "condition": ["실수", "정수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q15
- 형식: 객관식
- 배점: 4.7
### 발문
$2$보다 큰 두 자연수 $a, b$에 대하여 두 양수 $x, y$가 다음 <조건>을 만족시킬 때, $a, b$의 순서쌍 $(a, b)$의 개수는?


<조건>
(가) $\sqrt[a]{x} = \sqrt[b]{y^2} = 36$
(나) $\sqrt[3]{xy} = 2^{14} \times 3^{14}$
### 선지
① $13$ ② $14$ ③ $15$ ④ $16$ ⑤ $17$
### 정답
⑤
### 해설
조건 (가)에서 $x, y$는 양수이므로 $36 = 6^2$을 이용하여 나타내면
$$\begin{aligned}
x &= 36^a = 6^{2a} \\
y^2 &= 36^b \implies y = 36^{\frac{b}{2}} = 6^b
\end{aligned}$$
이다. 이를 조건 (나)에 대입하면 $2^{14} \times 3^{14} = 6^{14}$이므로
$$\sqrt[3]{xy} = \left(6^{2a} \cdot 6^b\right)^{\frac{1}{3}} = 6^{\frac{2a+b}{3}} = 6^{14}$$
이다. 지수를 비교하면
$$\frac{2a+b}{3} = 14 \implies 2a + b = 42$$
를 얻는다.


$a, b$는 $2$보다 큰 자연수이므로 $a \ge 3$이고 $b = 42 - 2a \ge 3$이어야 한다.
$$42 - 2a \ge 3 \implies 2a \le 39 \implies a \le 19.5$$
따라서 가능한 자연수 $a$는 $3, 4, \ldots, 19$이고 각 $a$마다 자연수 $b = 42 - 2a$가 유일하게 정해진다. 순서쌍 $(a, b)$의 개수는 $19 - 3 + 1 = 17$개이다.


따라서 정답은 ⑤이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-RADICAL-PAIR", "primaryMethod": "조건 (가)에서 x, y를 밑 6의 거듭제곱으로 표현한 뒤 조건 (나)에 대입해 2a+b=42의 자연수 순서쌍을 센다.", "decisiveStep": "2a+b=42와 a>=3, b>=3 조건을 연립해 3<=a<=19 범위를 확정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "거듭제곱근의 지수 변환과 일차 부정방정식의 정수해 개수를 함께 묻는 문항이다.", "level": "중", "item4slot": {"given": ["거듭제곱근", "등식"], "goal": ["순서쌍", "개수"], "method": ["지수법칙", "부정방정식"], "condition": ["자연수", "양수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q16
- 형식: 객관식
- 배점: 4.8
### 발문
좌표평면 위의 두 곡선 $y=2^{|x-1|}+3$과 $y=\log_2 (x+k)$가 만나는 서로 다른 두 점의 $x$좌표를 $x_1, x_2$ ($x_1 < x_2$)라 할 때, $0 < x_1 < 1$, $1 < x_2 < 2$를 만족시키는 자연수 $k$의 개수는?
### 선지
① $12$ ② $13$ ③ $14$ ④ $15$ ⑤ $16$
### 정답
③
### 해설
$f(x) = 2^{|x-1|} + 3$, $g(x) = \log_2(x+k)$라 하자. $x=0, 1, 2$에서의 $f(x)$의 값은 다음과 같다.
$$f(0) = 2^1 + 3 = 5, \quad f(1) = 2^0 + 3 = 4, \quad f(2) = 2^1 + 3 = 5$$


구간 $(0, 1)$에서 $f(x) = 2^{1-x}+3$은 감소하고 $g(x) = \log_2(x+k)$는 증가하므로 두 곡선이 $0 < x_1 < 1$에서 만나려면 양 끝점의 함숫값이 서로 반대로 놓여야 한다.
$$g(0) < f(0) \text{ 이고 } g(1) > f(1) \implies \log_2 k < 5, \; \log_2(k+1) > 4$$


구간 $(1, 2)$에서는 $f(x) = 2^{x-1}+3$과 $g(x) = \log_2(x+k)$가 모두 증가하지만, $k > 15$인 범위에서 $g(x)$의 기울기는 작고 위로 볼록하며 $f(x)$는 아래로 볼록하므로 $g(1) > f(1)$이면서 $g(2) < f(2)$이면 구간 $(1, 2)$에서 오직 한 번 교차한다.
$$g(1) > f(1) \text{ 이고 } g(2) < f(2) \implies \log_2(k+1) > 4, \; \log_2(k+2) < 5$$


두 조건을 종합하면
$$\begin{cases} \log_2(k+1) > 4 \implies k+1 > 16 \implies k > 15 \\ \log_2(k+2) < 5 \implies k+2 < 32 \implies k < 30 \end{cases}$$
(이때 $\log_2 k < 5$, 즉 $k < 32$는 자동으로 만족한다.)


따라서 $15 < k < 30$을 만족하는 자연수 $k$는 $16, 17, \ldots, 29$로 모두 $29 - 16 + 1 = 14$개이다. 정답은 ③이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-EXPLOG-INTERSECT", "primaryMethod": "x=0, 1, 2의 경계 함숫값 대소 비교를 통해 구간 (0,1)과 (1,2)에서 각각 교점이 존재할 k의 범위를 연립한다.", "decisiveStep": "x=0, 1, 2에서의 함수값 부등식 g(0)<5, g(1)>4, g(2)<5를 동시에 세우는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "INTERDEPENDENT", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "절댓값 지수함수와 로그함수의 교점 위치를 경계 함숫값 비교로 추론하는 준킬러 문항이다.", "level": "상", "item4slot": {"given": ["지수함수", "로그함수", "절댓값"], "goal": ["개수"], "method": ["교점", "대소비교"], "condition": ["자연수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q17
- 형식: 서답형
- 배점: 3
### 발문
[서답형1(단답형1)]
$x = 3^{\frac{1}{3}} + 3^{-\frac{1}{3}}$일 때, $3x^3 - 9x - 4$의 값을 구하시오.
### 선지
없음
### 정답
$6$
### 해설
$a = 3^{\frac{1}{3}}$이라 두면 $x = a + a^{-1}$이고 $a^3 = 3$, $a^{-3} = \frac{1}{3}$이다. 양변을 세제곱하면


$$\begin{aligned}
x^3 &= (a + a^{-1})^3 \\
&= a^3 + a^{-3} + 3a \cdot a^{-1}(a + a^{-1}) \\
&= 3 + \frac{1}{3} + 3x \\
&= \frac{10}{3} + 3x
\end{aligned}$$


양변에 $3$을 곱하면 $3x^3 = 10 + 9x$이므로
$$3x^3 - 9x - 4 = (10 + 9x) - 9x - 4 = 6$$
이다. 따라서 정답은 $6$이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-CUBIC-IDENTITY", "primaryMethod": "곱셈 공식 (a+a^(-1))^3 = a^3+a^(-3)+3(a+a^(-1))을 이용해 x^3을 x에 관한 일차식으로 정리한다.", "decisiveStep": "3x^3 - 9x = 10을 얻어 식의 값을 상수로 축약하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수 치환과 세제곱 곱셈 공식을 직접 적용하는 단답형 문항이다.", "level": "중", "item4slot": {"given": ["거듭제곱", "다항식"], "goal": ["식의값"], "method": ["곱셈공식", "지수법칙"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q18
- 형식: 서답형
- 배점: 3
### 발문
[서답형2(단답형2)]
함수 $y=\log_{\frac{1}{2}} kx$ ($k$는 양의 실수)의 그래프를 $x$축의 방향으로 $m$만큼 평행이동한 후 직선 $y=x$에 대하여 대칭이동시킨 함수를 $y=f(x)$라 하자. 함수 $y=f(x)$의 그래프가 점 $(2, 0)$을 지나고 점근선이 직선 $y=-4$일 때, $k+m$의 값을 구하시오.
### 선지
없음
### 정답
$-\frac{63}{16}$
### 해설
함수 $y = \log_{\frac{1}{2}} kx$의 그래프를 $x$축의 방향으로 $m$만큼 평행이동하면
$$y = \log_{\frac{1}{2}} k(x-m)$$
이다. 이 그래프를 직선 $y=x$에 대하여 대칭이동하면 $x$와 $y$가 서로 바뀌므로


$$\begin{aligned}
x &= \log_{\frac{1}{2}} k(y-m) \\
k(y-m) &= \left(\frac{1}{2}\right)^x \\
f(x) &= m + \frac{1}{k}\left(\frac{1}{2}\right)^x
\end{aligned}$$


이다. 이 지수함수의 점근선은 직선 $y = m$이므로 $m = -4$이다. 또한 그래프가 점 $(2, 0)$을 지나므로


$$0 = -4 + \frac{1}{k}\left(\frac{1}{2}\right)^2 = -4 + \frac{1}{4k} \implies \frac{1}{4k} = 4 \implies k = \frac{1}{16}$$


따라서 $k + m = \frac{1}{16} - 4 = -\frac{63}{16}$이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-LOGEXP-INV", "primaryMethod": "로그함수를 평행이동하고 역함수를 구해 f(x)=m+(1/k)(1/2)^x를 얻은 뒤 점근선과 지나는 점으로 m, k를 결정한다.", "decisiveStep": "역함수 f(x)의 점근선 y=m=-4와 점 (2,0) 대입으로 k=1/16을 구하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그함수의 평행이동과 역함수 변환, 지수함수의 점근선 성질을 차례로 적용하는 문항이다.", "level": "중", "item4slot": {"given": ["로그함수", "점근선", "점"], "goal": ["합"], "method": ["평행이동", "대칭이동", "역함수", "점근선"], "condition": ["양수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q19
- 형식: 서답형
- 배점: 4
### 발문
[서답형3(단답형3)]
$16$ 이하의 양수 $a$에 대하여 $a^{\log_2 9}$의 값이 $3^n$ ($n$은 자연수) 꼴이 되도록 하는 모든 $a$의 값의 곱을 구하시오.
### 선지
없음
### 정답
$2^{18}$
### 해설
$a^{\log_2 9} = 3^n$ ($n$은 자연수)이라 두고 양변에 밑이 $3$인 로그를 취하면


$$\begin{aligned}
\log_3 \left(a^{\log_2 9}\right) &= \log_3 3^n \\
(\log_2 9) (\log_3 a) &= n \\
(2\log_2 3) (\log_3 a) &= n \\
2 \log_2 a &= n \implies a = 2^{\frac{n}{2}}
\end{aligned}$$


이다. 조건에서 $a \le 16 = 2^4$이므로
$$2^{\frac{n}{2}} \le 2^4 \implies \frac{n}{2} \le 4 \implies n \le 8$$
이다. $n$은 자연수이므로 가능한 $n$은 $1, 2, 3, 4, 5, 6, 7, 8$이다.


따라서 구하는 모든 $a$의 값의 곱은
$$\prod_{n=1}^{8} 2^{\frac{n}{2}} = 2^{\frac{1+2+3+4+5+6+7+8}{2}} = 2^{\frac{36}{2}} = 2^{18}$$
이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-LOG-POWER", "primaryMethod": "a^(log_2 9) = 3^n에 밑 3인 로그를 취해 a=2^(n/2)를 구한 뒤 a<=16 범위의 모든 곱을 계산한다.", "decisiveStep": "밑변환 성질 (log_2 9)(log_3 a) = 2 log_2 a = n으로 a를 2의 거듭제곱 형태로 푸는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수의 로그 표현을 밑변환으로 정리하고 범위 내 모든 해의 곱을 계산해야 하는 문항이다.", "level": "중", "item4slot": {"given": ["거듭제곱", "로그", "등식"], "goal": ["곱"], "method": ["밑변환", "로그", "성질", "지수법칙"], "condition": ["자연수", "양수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q20
- 형식: 서답형
- 배점: 6
### 발문
[서답형4(서술형1)]
함수 $y=\log_3 (x-2) + \log_3 (8-x)$는 $x=p$일 때 최댓값 $m$을 갖는다. $p$와 $m$의 값을 각각 구하는 과정을 서술하시오.
### 선지
없음
### 정답
$p=5$, $m=2$
### 해설
로그가 정의되려면 진수가 모두 양수여야 하므로
$$x-2 > 0 \text{ 이고 } 8-x > 0 \implies 2 < x < 8$$
이다. 로그의 성질을 이용해 하나의 로그로 합치면
$$\begin{aligned}
y &= \log_3 \{(x-2)(8-x)\} \\
&= \log_3 \left(-x^2 + 10x - 16\right) \\
&= \log_3 \left\{9 - (x-5)^2\right\}
\end{aligned}$$
이다. 정의역 $2 < x < 8$ 안에 $x=5$가 포함되므로 진수 $9 - (x-5)^2$은 $x=5$일 때 최댓값 $9$를 갖는다.


밑이 $3 > 1$인 로그함수는 진수가 최대일 때 함숫값도 최대이므로 $x = 5$일 때 최댓값은
$$m = \log_3 9 = 2$$
이다. 따라서 $p = 5$, $m = 2$이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-LOGFUNC-QUAD", "primaryMethod": "진수 조건 2<x<8을 먼저 구한 뒤 로그의 합을 이차함수 진수로 바꾸어 완전제곱식으로 최댓값을 구한다.", "decisiveStep": "진수 (x-2)(8-x)=9-(x-5)^2의 꼭짓점 x=5가 정의역 안에 있음을 확인하고 최댓값 2를 구하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그의 정의역 확인과 이차함수 최대·최소 결합의 표준 서술형 문항이다.", "level": "중", "item4slot": {"given": ["로그함수"], "goal": ["최댓값", "매개변수"], "method": ["로그", "성질", "완전제곱식", "정의역"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q21
- 형식: 서답형
- 배점: 7
### 발문
[서답형5(서술형2)]
어느 기업에서 올해 기업의 부채가 자기 자본의 $5$배에 이르자, 내년부터 매년 부채를 전년도에 비해 $10\%$씩 줄이고, 자기 자본은 $20\%$씩 늘리는 계획을 세웠다. 이 계획대로 진행될 때, 이 기업의 자기 자본이 처음으로 부채보다 많아지는 해는 올해로부터 몇 년 후인지 구하는 과정을 서술하시오.
(단, $\log 2 = 0.30$, $\log 3 = 0.48$로 계산한다.)
### 선지
없음
### 정답
$6$년 후
### 해설
올해 자기 자본을 $C$ ($C > 0$)라 하면 올해 부채는 $5C$이다. $n$년 후의 자기 자본과 부채는 각각
$$C(1 + 0.2)^n = C(1.2)^n, \quad 5C(1 - 0.1)^n = 5C(0.9)^n$$
이다. 자기 자본이 부채보다 많아지는 조건을 부등식으로 세우면


$$\begin{aligned}
C(1.2)^n &> 5C(0.9)^n \\
\left(\frac{1.2}{0.9}\right)^n &> 5 \\
\left(\frac{4}{3}\right)^n &> 5
\end{aligned}$$


양변에 상용로그를 취하면
$$\begin{aligned}
n(\log 4 - \log 3) &> \log 5 \\
n(2\log 2 - \log 3) &> 1 - \log 2 \\
n(2 \times 0.30 - 0.48) &> 1 - 0.30 \\
0.12n &> 0.70 \\
n &> \frac{70}{12} = \frac{35}{6} = 5.833\cdots
\end{aligned}$$
이다. $n$은 자연수이므로 최소의 $n$은 $6$이다. (실제로 $\left(\frac{4}{3}\right)^5 = \frac{1024}{243} < 5$이고 $\left(\frac{4}{3}\right)^6 = \frac{4096}{729} > 5$이다.)


따라서 자기 자본이 처음으로 부채보다 많아지는 해는 올해로부터 $6$년 후이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-COMMONLOG-APP", "primaryMethod": "n년 후 자기 자본 C(1.2)^n과 부채 5C(0.9)^n의 부등식 (4/3)^n > 5에 상용로그를 취해 최소 자연수 n을 구한다.", "decisiveStep": "상용로그 부등식 0.12n > 0.70으로부터 n > 5.833...을 얻어 n=6을 결정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "SEQUENTIAL", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "실생활 증감률 모델링과 상용로그 부등식 계산을 서술하는 문항이다.", "level": "중", "item4slot": {"given": ["지수함수", "부등식"], "goal": ["최솟값"], "method": ["상용로그", "지수부등식"], "condition": ["자연수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q22
- 형식: 서답형
- 배점: 7
### 발문
[서답형6(서술형3)]
$x$에 대한 부등식
$$(\log_2 x)^2 - (\log_2 n + 1)\log_2 x + 2(\log_2 n - 1) < 0$$
을 만족시키는 정수 $x$의 개수가 $3$이 되도록 하는 모든 자연수 $n$의 값의 합을 구하는 과정을 서술하시오.
### 선지
없음
### 정답
$32$
### 해설
진수 조건에 의해 $x > 0$이다. $t = \log_2 x$, $s = \log_2 n$이라 두면 주어진 부등식은


$$\begin{aligned}
t^2 - (s+1)t + 2(s-1) &< 0 \\
(t - 2)\{t - (s - 1)\} &< 0
\end{aligned}$$


이다. 여기서 $s - 1 = \log_2 n - 1 = \log_2 \frac{n}{2}$이고 밑이 $2 > 1$이므로 경계값 $2$와 $s-1$의 대소에 따라 $x$의 범위가 다음과 같이 나뉜다.


**(i) $\frac{n}{2} < 4$ (즉, $1 \le n \le 7$)일 때**
$s - 1 < t < 2$이므로 $\frac{n}{2} < x < 4$이다.
$x > 0$인 정수 $x$는 최대 $1, 2, 3$의 $3$개뿐이므로, 정수 $x$의 개수가 $3$이 되려면 $1, 2, 3$이 모두 포함되어야 한다.
$$0 < \frac{n}{2} < 1 \implies 0 < n < 2$$
자연수 $n$은 $n = 1$이다.


**(ii) $\frac{n}{2} = 4$ (즉, $n = 8$)일 때**
$(t-2)^2 < 0$이 되어 해가 존재하지 않는다.


**(iii) $\frac{n}{2} > 4$ (즉, $n \ge 9$)일 때**
$2 < t < s - 1$이므로 $4 < x < \frac{n}{2}$이다.
$4$보다 큰 정수 $x$가 차례로 $5, 6, 7, \ldots$이므로 개수가 $3$이 되려면 $x = 5, 6, 7$만 포함되고 $8$은 포함되지 않아야 한다.
$$7 < \frac{n}{2} \le 8 \implies 14 < n \le 16$$
따라서 가능한 자연수 $n$은 $n = 15, 16$이다.


(i)~(iii)에서 구한 모든 자연수 $n$은 $1, 15, 16$이므로 그 합은
$$1 + 15 + 16 = 32$$
이다.
```json:plan
"NONE"
```
```json:meta
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-LOGINEQ-PARAM", "primaryMethod": "t=log_2 x로 치환해 (t-2)(t-log_2(n/2))<0으로 인수분해한 뒤 n/2와 4의 대소 경우를 나누어 정수 x가 3개인 n을 구한다.", "decisiveStep": "n/2<4일 때 진수 조건 x>0 때문에 0<n/2<1에서 n=1을 찾고, n/2>4일 때 7<n/2<=8에서 n=15,16을 찾는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "CASE_BRANCH", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그 이차부등식 인수분해, 매개변수 기준 경우 분류, 진수 조건과 정수 개수 경계 판정이 모두 요구되는 고난도 문항이다.", "level": "상", "item4slot": {"given": ["로그부등식"], "goal": ["합"], "method": ["치환", "인수분해", "경우분류", "진수조건"], "condition": ["정수", "자연수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```