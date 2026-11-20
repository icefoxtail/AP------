```json:exam
{"stem": "24_매산여고_1학기_중간_고2_수학I_유사", "sourceArchiveFile": "original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js", "examFolder": "1mid", "grade": "고2", "subject": "수학I", "curriculum": "2015", "questionCount": 24, "totalScore": 100, "generatedAt": "2026-11-19"}
```


## Q01
- 형식: 객관식
- 배점: 3.2
### 발문
$a = \sqrt[3]{2}$, $b^2 = \sqrt[3]{3}$일 때, $(ab)^{12}$의 값을 구하면? (단, $b$는 실수이다.) [3.2점]
### 선지
① $72$ ② $144$ ③ $216$ ④ $288$ ⑤ $432$
### 정답
②
### 해설
$a = \sqrt[3]{2} = 2^{\frac{1}{3}}$이므로
$a^{12} = \left(2^{\frac{1}{3}}\right)^{12} = 2^4 = 16$
$b^2 = \sqrt[3]{3} = 3^{\frac{1}{3}}$이므로
$b^{12} = (b^2)^6 = \left(3^{\frac{1}{3}}\right)^6 = 3^2 = 9$
따라서 $(ab)^{12} = a^{12} b^{12} = 16 \times 9 = 144$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "1", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-RADICAL_POWER_PRODUCT", "primaryMethod": "a=2^(1/3)과 b²=3^(1/3)을 각각 12제곱하여 a^12=16, b^12=9를 구한 뒤 곱한다.", "decisiveStep": "b¹²=(b²)⁶=3²=9로 계산해 a¹²=16과 곱하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "거듭제곱근을 유리수 지수로 고쳐 지수법칙 (ab)^12 = a^12 b^12을 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["거듭제곱근", "실수"], "goal": ["값"], "method": ["지수법칙"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q02
- 형식: 객관식
- 배점: 3.2
### 발문
$\log_{(a - 2)}(a^2 - 7a - 18)$이 정의되기 위한 실수 $a$의 값의 범위를 구하면? [3.2점]
### 선지
① $a < -2$ ② $2 < a < 3$ ③ $3 < a < 9$ ④ $a > 9$ ⑤ $a > 2$
### 정답
④
### 해설
로그가 정의되려면 밑 조건과 진수 조건을 모두 만족해야 한다.
(1) 밑 조건: $a - 2 > 0$이고 $a - 2 \neq 1$이므로 $a > 2$, $a \neq 3$
(2) 진수 조건: $a^2 - 7a - 18 > 0$
$(a - 9)(a + 2) > 0$
$a < -2$ 또는 $a > 9$
(1), (2)의 공통 범위는 $a > 9$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "2", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-LOG_DEF_QUADRATIC_INEQ", "primaryMethod": "밑 조건(a>2, a≠3)과 진수 이차부등식 (a-9)(a+2)>0의 교집합을 구한다.", "decisiveStep": "a>2 조건으로 a<-2를 배제하고 a>9만 남기는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그의 밑 조건과 이차부등식 진수 조건의 교집합을 구하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": ["로그", "실수"], "goal": ["범위"], "method": ["이차부등식", "교집합"], "condition": ["정의역"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q03
- 형식: 객관식
- 배점: 3.4
### 발문
실수 $x$에 대하여 $\dfrac{3^x - 3^{-x}}{3^x + 3^{-x}} = \dfrac{1}{3}$일 때, $9^x - 9^{-x}$의 값을 구하면? [3.4점]
### 선지
① $\dfrac{3}{2}$ ② $\dfrac{5}{2}$ ③ $\dfrac{7}{2}$ ④ $\dfrac{5}{3}$ ⑤ $\dfrac{8}{3}$
### 정답
①
### 해설
주어진 식의 분모와 분자에 각각 $3^x$을 곱하면
$\dfrac{3^{2x} - 1}{3^{2x} + 1} = \dfrac{1}{3}$
$3(3^{2x} - 1) = 3^{2x} + 1$
$2 \cdot 3^{2x} = 4 \implies 3^{2x} = 2$
$9^x = 3^{2x} = 2$이므로 $9^{-x} = \dfrac{1}{2}$이다.
따라서 $9^x - 9^{-x} = 2 - \dfrac{1}{2} = \dfrac{3}{2}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "3", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-EXP_FRACTION_TO_9X", "primaryMethod": "분모·분자에 3^x을 곱해 9^x=3^(2x)=2를 구한 뒤 9^x-9^(-x)를 계산한다.", "decisiveStep": "(3^(2x)-1)/(3^(2x)+1)=1/3에서 3^(2x)=2를 도출하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "분수식 분모·분자에 3^x을 곱해 9^x 값을 먼저 구하는 표준 2단계 문항이다.", "level": "중", "item4slot": {"given": ["지수", "유리식"], "goal": ["값"], "method": ["지수법칙", "대입"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q04
- 형식: 객관식
- 배점: 3.4
### 발문
다음 중 함수 $y = \log_{\frac{1}{2}}(x + 3) + 2$에 대한 설명으로 옳은 것을 고르면? [3.4점]
### 선지
① 정의역은 $\{x \mid x < -3\}$이다. ② 치역은 $\{y \mid y > 0\}$이다. ③ 그래프는 점 $(-3, 2)$를 지난다. ④ $x$의 값이 증가하면 $y$의 값도 증가한다. ⑤ 그래프의 점근선은 직선 $x = -3$이다.
### 정답
⑤
### 해설
① 진수 조건 $x + 3 > 0$에서 정의역은 $\{x \mid x > -3\}$이다. (거짓)
② 로그함수의 치역은 실수 전체의 집합이다. (거짓)
③ $x = -2$일 때 $y = \log_{\frac{1}{2}} 1 + 2 = 2$이므로 점 $(-2, 2)$를 지난다. (거짓)
④ 밑이 $\dfrac{1}{2} < 1$이므로 $x$의 값이 증가하면 $y$의 값은 감소한다. (거짓)
⑤ 진수 $x + 3 = 0$에서 점근선은 직선 $x = -3$이다. (참)
따라서 옳은 것은 ⑤이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "4", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-LOG_GRAPH_PROPERTIES_RIGHT", "primaryMethod": "평행이동된 감소 로그함수의 정의역, 치역, 정점, 단조성, 점근선을 선지별로 판별한다.", "decisiveStep": "진수 x+3=0으로부터 수직 점근선 x=-3을 확인하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동된 로그함수의 기본 성질을 선지별로 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["로그함수"], "goal": ["판정"], "method": ["정의역", "평행이동"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q05
- 형식: 객관식
- 배점: 3.5
### 발문
함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$의 그래프가 제$3$사분면을 지나지 않도록 하는 상수 $k$의 최솟값을 구하면? [3.5점]
### 선지
① $-8$ ② $-5$ ③ $-4$ ④ $0$ ⑤ $4$
### 정답
③
### 해설
함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$는 밑이 $\dfrac{1}{4} < 1$인 감소함수이다.
이 그래프가 제$3$사분면($x < 0, y < 0$)을 지나지 않으려면 $y$절편이 $0$ 이상이어야 한다.
$x = 0$일 때 $y = \left(\dfrac{1}{4}\right)^{-1} + k = 4 + k \ge 0$
따라서 $k \ge -4$이므로 상수 $k$의 최솟값은 $-4$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "5", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXP_AVOID_QUADRANT_Y_INTERCEPT", "primaryMethod": "감소 지수함수가 제3사분면을 지나지 않을 조건 y(0)≥0을 적용해 k≥-4를 구한다.", "decisiveStep": "감소함수이므로 x=0에서의 함숫값 4+k≥0이 제3사분면 비통과 필요충분조건임을 확인하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수함수의 단조성과 y절편 부호 조건으로 사분면 통과 여부를 판별하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["지수함수"], "goal": ["최솟값"], "method": ["증가감소", "부등식"], "condition": ["사분면"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q06
- 형식: 객관식
- 배점: 3.5
### 발문
이차함수 $f(x) = (x - 3)^2 - 4$와 일차함수 $g(x) = x - 1$에 대하여 부등식
$$\left(\dfrac{3}{4}\right)^{f(x)} > \left(\dfrac{3}{4}\right)^{g(x)}$$
를 만족시키는 모든 자연수 $x$의 값의 합을 구하면? [3.5점]
### 선지
① $14$ ② $12$ ③ $10$ ④ $9$ ⑤ $7$
### 정답
①
### 해설
밑이 $\dfrac{3}{4}$ ($0 < \dfrac{3}{4} < 1$)이므로 지수함수는 감소하고, 주어진 부등식은
$f(x) < g(x)$
$(x - 3)^2 - 4 < x - 1$
$x^2 - 6x + 5 < x - 1$
$x^2 - 7x + 6 < 0$
$(x - 1)(x - 6) < 0 \implies 1 < x < 6$
이를 만족시키는 자연수 $x$는 $2, 3, 4, 5$이므로 합은 $2 + 3 + 4 + 5 = 14$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "6", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXP_INEQUALITY_QUADRATIC_LINEAR", "primaryMethod": "밑이 3/4<1이므로 부등호를 반전해 f(x)<g(x) 이차부등식을 풀어 자연수 해를 더한다.", "decisiveStep": "0<3/4<1에서 f(x)<g(x)로 바꾸어 (x-1)(x-6)<0을 푸는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수부등식의 밑<1 부등호 반전과 이차부등식 풀이를 결합한 2단계 문항이다.", "level": "중", "item4slot": {"given": ["지수부등식", "이차함수", "일차함수"], "goal": ["합"], "method": ["이차부등식"], "condition": ["자연수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q07
- 형식: 객관식
- 배점: 3.6
### 발문
다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은? [3.6점]
<보기>
ㄱ. $240^\circ = \dfrac{4}{3}\pi$
ㄴ. $-750^\circ$는 제$3$사분면의 각이다.
ㄷ. $760^\circ$와 $-320^\circ$의 일반각은 같다.
### 선지
① ㄱ ② ㄱ, ㄷ ③ ㄴ ④ ㄴ, ㄷ ⑤ ㄱ, ㄴ
### 정답
②
### 해설
ㄱ. $240^\circ = 240^\circ \times \dfrac{\pi}{180^\circ} = \dfrac{4}{3}\pi$ (참)
ㄴ. $-750^\circ = 360^\circ \times (-3) + 330^\circ$이므로 제$4$사분면의 각이다. (거짓)
ㄷ. $760^\circ = 360^\circ \times 2 + 40^\circ$, $-320^\circ = 360^\circ \times (-1) + 40^\circ$이므로 일반각은 $360^\circ \times n + 40^\circ$로 같다. (참)
따라서 옳은 것은 ㄱ, ㄷ이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "7", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-05-GENERAL_ANGLE_RADIAN_BOKI", "primaryMethod": "호도법 변환, 사분면 판별, 일반각 표준형 360°×n+α°를 보기별로 확인한다.", "decisiveStep": "-750°=360°×(-3)+330°가 제4사분면임을 확인하고 760°와 -320°의 동경이 40°로 같음을 찾는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "호도법과 일반각의 기본 개념을 합답형 보기로 확인하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["일반각", "호도법"], "goal": ["판정"], "method": ["일반각", "호도법"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q08
- 형식: 객관식
- 배점: 3.6
### 발문
$0 \le x < 2\pi$일 때, 방정식 $\sqrt{3}\sin x - \cos x = 0$의 모든 근의 합을 구하면? [3.6점]
### 선지
① $\dfrac{2}{3}\pi$ ② $\pi$ ③ $\dfrac{7}{6}\pi$ ④ $\dfrac{4}{3}\pi$ ⑤ $\dfrac{5}{3}\pi$
### 정답
④
### 해설
$\cos x = 0$이면 $\sin x = \pm 1$이 되어 등식이 성립하지 않으므로 $\cos x \neq 0$이다.
양변을 $\cos x$로 나누면
$\sqrt{3}\tan x - 1 = 0 \implies \tan x = \dfrac{1}{\sqrt{3}}$
$0 \le x < 2\pi$에서 $\tan x = \dfrac{1}{\sqrt{3}}$의 해는 $x = \dfrac{\pi}{6}$ 또는 $x = \dfrac{7\pi}{6}$
따라서 모든 근의 합은 $\dfrac{\pi}{6} + \dfrac{7\pi}{6} = \dfrac{4}{3}\pi$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "8", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-06-TRIG_EQUATION_TAN_RATIO", "primaryMethod": "cos x≠0임을 확인해 양변을 cos x로 나누어 tan x = 1/√3의 두 근을 구해 합한다.", "decisiveStep": "tan x = 1/√3으로 변환해 제1, 3사분면의 해 π/6, 7π/6을 구하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "일차 삼각방정식을 tan x = k 꼴로 바꾸어 한 주기 내 모든 근을 구해 더하는 문항이다.", "level": "중", "item4slot": {"given": ["삼각방정식"], "goal": ["합"], "method": ["삼각함수의상호관계", "삼각비"], "condition": ["범위"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q09
- 형식: 객관식
- 배점: 3.7
### 발문
$0 \le x < \pi$일 때, 부등식 $-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해를 구하면? [3.7점]
### 선지
① $\dfrac{\pi}{6} < x \le \dfrac{2}{3}\pi$ ② $\dfrac{\pi}{6} \le x < \dfrac{3}{4}\pi$ ③ $\dfrac{\pi}{4} < x \le \dfrac{2}{3}\pi$ ④ $\dfrac{\pi}{3} \le x < \dfrac{3}{4}\pi$ ⑤ $\dfrac{\pi}{3} < x \le \dfrac{3}{4}\pi$
### 정답
⑤
### 해설
$0 \le x < \pi$에서 함수 $y = \cos x$는 감소함수이다.
$\cos \dfrac{\pi}{3} = \dfrac{1}{2}$, $\cos \dfrac{3}{4}\pi = -\dfrac{\sqrt{2}}{2}$이므로
$-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해는 $\dfrac{\pi}{3} < x \le \dfrac{3}{4}\pi$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "9", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-06-COS_DOUBLE_INEQUALITY", "primaryMethod": "구간 [0, π)에서 cos x의 감소성을 이용해 경계값 π/3과 3π/4의 등호 방향을 맞춰 해를 구한다.", "decisiveStep": "cos x가 감소하므로 부등호 방향이 반대로 바뀌어 π/3 < x ≤ 3π/4가 되는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "코사인함수의 감소 구간에서 양쪽 경계 등호 포함 여부를 구분해 부등식을 푸는 문항이다.", "level": "중", "item4slot": {"given": ["삼각부등식"], "goal": ["해"], "method": ["삼각부등식", "증가감소"], "condition": ["범위"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q10
- 형식: 객관식
- 배점: 3.8
### 발문
$x, y$가 양수이고, $a$가 $1$이 아닌 양수일 때, 다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은? [3.8점]
<보기>
ㄱ. $\log_a x \log_a y = \log_a(x + y)$
ㄴ. $\log_a(x - y) = \dfrac{\log_a x}{\log_a y}$
ㄷ. $\dfrac{\log_a x}{\log_a y} = \log_y x$ (단, $y \neq 1$)
ㄹ. $(\log_a x)^n = n\log_a x$ (단, $n$은 실수이다.)
### 선지
① ㄱ ② ㄷ ③ ㄱ, ㄷ ④ ㄴ, ㄹ ⑤ ㄷ, ㄹ
### 정답
②
### 해설
ㄱ. $\log_a x + \log_a y = \log_a(xy)$이므로 거짓이다.
ㄴ. $\log_a x - \log_a y = \log_a \dfrac{x}{y}$이므로 거짓이다.
ㄷ. 밑변환 공식에 의하여 $\dfrac{\log_a x}{\log_a y} = \log_y x$ ($y \neq 1$)이므로 참이다.
ㄹ. $\log_a x^n = n\log_a x$이며 $(\log_a x)^n$과 다르므로 거짓이다.
따라서 옳은 것은 ㄷ뿐이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "10", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-LOG_LAWS_BOKI", "primaryMethod": "로그의 사칙연산과 밑변환 공식, 지수 내림 성질의 정확한 형태를 보기별로 판별한다.", "decisiveStep": "밑변환 공식 ㄷ만 참이고 나머지 ㄱ·ㄴ·ㄹ은 흔한 오개념 변형임을 구별하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그 기본 성질의 옳은 공식과 흔한 오답 공식을 구분하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["로그"], "goal": ["판정"], "method": ["로그", "밑변환"], "condition": ["부호"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q11
- 형식: 객관식
- 배점: 3.8
### 발문
이차방정식 $x^2 - 4x - 3 = 0$의 두 근을 $\alpha, \beta$라 할 때,
$$2^{\frac{1}{\alpha^2 - 3}} \times 2^{\frac{1}{\beta^2 - 3}}$$
의 값을 구하면? [3.8점]
### 선지
① $\dfrac{1}{\sqrt[3]{2}}$ ② $\dfrac{1}{\sqrt[4]{2}}$ ③ $\dfrac{1}{\sqrt{2}}$ ④ $\sqrt[3]{2}$ ⑤ $\sqrt{2}$
### 정답
①
### 해설
$\alpha, \beta$가 $x^2 - 4x - 3 = 0$의 두 근이므로 $\alpha^2 - 4\alpha - 3 = 0 \implies \alpha^2 - 3 = 4\alpha$, 마찬가지로 $\beta^2 - 3 = 4\beta$이다.
근과 계수의 관계에 의하여 $\alpha + \beta = 4$, $\alpha\beta = -3$이므로 지수의 합은
$\dfrac{1}{\alpha^2 - 3} + \dfrac{1}{\beta^2 - 3} = \dfrac{1}{4\alpha} + \dfrac{1}{4\beta} = \dfrac{\alpha + \beta}{4\alpha\beta} = \dfrac{4}{4 \times (-3)} = -\dfrac{1}{3}$
따라서 구하는 값은 $2^{-\frac{1}{3}} = \dfrac{1}{\sqrt[3]{2}}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "11", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-EXP_QUADRATIC_ROOTS_REDUCTION", "primaryMethod": "근의 방정식 대입으로 α²-3=4α, β²-3=4β 차수 낮추기를 한 뒤 근과 계수의 관계로 지수 합을 구한다.", "decisiveStep": "α²-3=4α로 차수를 낮춰 1/(4α)+1/(4β)에 근과 계수의 관계를 적용하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "이차방정식의 근을 이용한 차수 낮추기와 근과 계수의 관계를 지수 계산에 연결하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["이차방정식", "지수"], "goal": ["값"], "method": ["근과계수의관계", "지수법칙"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q12
- 형식: 객관식
- 배점: 3.9
### 발문
어느 도시의 미세 먼지 농도는 매년 $10\%$씩 증가한다고 한다. 이와 같은 비율로 미세 먼지 농도가 계속 증가한다고 할 때, 미세 먼지 농도가 현재의 $3$배 이상이 되는 것은 최소 몇 년 후인지 고르면? (단, $\log 3 = 0.4771$, $\log 1.1 = 0.0414$로 계산한다.) [3.9점]
### 선지
① $10$ ② $11$ ③ $12$ ④ $13$ ⑤ $14$
### 정답
③
### 해설
현재 미세 먼지 농도를 $A$라 하면 $n$년 후의 농도는 $A(1 + 0.1)^n = A(1.1)^n$이다.
$A(1.1)^n \ge 3A \implies (1.1)^n \ge 3$
양변에 상용로그를 취하면
$n \log 1.1 \ge \log 3$
$0.0414n \ge 0.4771$
$n \ge \dfrac{4771}{414} = 11.524\dots$
따라서 최소 $12$년 후이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "12", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-COMMON_LOG_COMPOUND_GROWTH", "primaryMethod": "매년 10% 증가 부등식 (1.1)^n ≥ 3에 상용로그를 취해 자연수 n의 최솟값을 구한다.", "decisiveStep": "0.0414n ≥ 0.4771을 풀어 n ≥ 11.52…에서 최소 자연수 12를 구하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상용로그를 이용해 지수 부등식의 최소 자연수 해를 구하는 표준 실생활 문항이다.", "level": "중", "item4slot": {"given": ["상용로그"], "goal": ["최솟값"], "method": ["상용로그", "부등식"], "condition": ["증가감소"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q13
- 형식: 객관식
- 배점: 3.9
### 발문
$x$에 대한 방정식 $4^x - k \times 2^{x + 1} + 16 = 0$이 오직 하나의 실근 $\alpha$를 가질 때, $k + 2^\alpha$의 값을 구하면? (단, $k$는 상수이다.) [3.9점]
### 선지
① $2$ ② $4$ ③ $6$ ④ $7$ ⑤ $8$
### 정답
⑤
### 해설
$2^x = t$ ($t > 0$)이라 놓으면 주어진 방정식은
$t^2 - 2kt + 16 = 0$
$x$에 대한 방정식이 오직 하나의 실근을 가지려면 $t$에 대한 이차방정식이 오직 하나의 양의 실근을 가져야 한다.
두 근의 곱이 $16 > 0$이므로 양근 하나와 $0$ 이하의 근 하나를 가질 수 없고, 반드시 양의 중근을 가져야 한다.
판별식 $\dfrac{D}{4} = k^2 - 16 = 0 \implies k = \pm 4$
중근은 $t = k > 0$이어야 하므로 $k = 4$, 그때의 중근은 $t = 2^\alpha = 4$이다.
따라서 $k + 2^\alpha = 4 + 4 = 8$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "13", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXP_UNIQUE_ROOT_DOUBLE", "primaryMethod": "2^x=t>0 치환 후 두 근의 곱이 16>0이므로 양의 중근 조건(D=0, t=k>0)으로 k와 2^α를 구한다.", "decisiveStep": "두 근의 곱이 양수이므로 양의 중근만 유일 실근 조건이 됨을 확인해 k=4를 선택하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "지수방정식 치환 후 양수 근의 유일성 조건을 중근 판별식과 근의 부호로 해결하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["지수방정식"], "goal": ["합"], "method": ["치환", "판별식"], "condition": ["실근"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q14
- 형식: 객관식
- 배점: 4
### 발문
$3$보다 큰 실수 $a$에 대하여 $a < x < a^2$일 때, $\log_a x$, $(\log_a x)^2$, $x$, $\log_a(\log_a x)$의 대소를 옳게 비교한 것을 고르면? [4.0점]
### 선지
① $\log_a(\log_a x) < \log_a x < (\log_a x)^2 < x$ ② $\log_a x < (\log_a x)^2 < x < \log_a(\log_a x)$ ③ $\log_a x < x < (\log_a x)^2 < \log_a(\log_a x)$ ④ $x < \log_a(\log_a x) < \log_a x < (\log_a x)^2$ ⑤ $\log_a(\log_a x) < x < \log_a x < (\log_a x)^2$
### 정답
①
### 해설
$a > 3$이고 $a < x < a^2$이므로 밑이 $a > 1$인 로그를 취하면
$1 < \log_a x < 2$
$t = \log_a x$라 하면 $1 < t < 2$이고 $x = a^t$이다.
(1) $1 < t < 2 < 3 < a$이므로 $\log_a t < \log_a a = 1 < t$
(2) $t > 1$이므로 $t < t^2 < 4$
(3) $a > 3$이고 $1 < t < 2$이므로 $x = a^t > 3^t > t^2$ ($t=1$일 때 $3 > 1$, $t=2$일 때 $9 > 4$이며 $3^t$이 $t^2$보다 항상 크다)
따라서 $\log_a(\log_a x) < \log_a x < (\log_a x)^2 < x$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "14", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-LOG_POWER_X_ORDERING", "primaryMethod": "t=log_a x ∈ (1, 2)로 치환해 log_a t < 1 < t < t² < a^t 순으로 네 식의 대소를 비교한다.", "decisiveStep": "1<t<2<3<a 조건에서 log_a t < 1 및 t² < 3^t < a^t = x를 비교하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "문자로 주어진 구간에서 4개의 지수·로그 표현의 대소를 부등식으로 비교하는 3단계 문항이다.", "level": "상", "item4slot": {"given": ["로그", "실수"], "goal": ["대소비교"], "method": ["치환", "부등식"], "condition": ["범위"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q15
- 형식: 객관식
- 배점: 4
### 발문
함수 $y = \dfrac{1}{4}\sin\left(2x + \dfrac{\pi}{3}\right) - 1$의 최댓값을 $a$, 주기를 $b\pi$라 할 때, $a + b$의 값을 구하면? (단, $a, b$는 상수이다.) [4.0점]
### 선지
① $\dfrac{1}{12}$ ② $\dfrac{1}{8}$ ③ $\dfrac{1}{6}$ ④ $\dfrac{1}{4}$ ⑤ $\dfrac{1}{3}$
### 정답
④
### 해설
$-1 \le \sin\left(2x + \dfrac{\pi}{3}\right) \le 1$이므로 최댓값 $a$는
$a = \dfrac{1}{4} - 1 = -\dfrac{3}{4}$
주기는 $\dfrac{2\pi}{2} = \pi$이므로 $b = 1$
따라서 $a + b = -\dfrac{3}{4} + 1 = \dfrac{1}{4}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "15", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-06-SIN_MAX_PERIOD_SUM", "primaryMethod": "사인함수의 최댓값 공식으로 a=-3/4, 주기 공식으로 b=1을 구해 더한다.", "decisiveStep": "최댓값 1/4-1=-3/4과 주기 2π/2=π(b=1)을 구해 합하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "사인함수의 최댓값과 주기 공식을 바로 적용하는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["삼각함수"], "goal": ["합"], "method": ["최댓값", "주기"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q16
- 형식: 객관식
- 배점: 4.1
### 발문
$0 \le x < \pi$일 때, 방정식 $\sin\left(2x - \dfrac{\pi}{3}\right) = -\dfrac{1}{2}$의 모든 근의 합을 구하면? [4.1점]
### 선지
① $\dfrac{2}{3}\pi$ ② $\dfrac{3}{4}\pi$ ③ $\dfrac{5}{6}\pi$ ④ $\pi$ ⑤ $\dfrac{7}{6}\pi$
### 정답
③
### 해설
$u = 2x - \dfrac{\pi}{3}$라 하면 $0 \le x < \pi$에서 $-\dfrac{\pi}{3} \le u < \dfrac{5}{3}\pi$이다.
이 범위에서 $\sin u = -\dfrac{1}{2}$을 만족시키는 $u$의 값은
$u = -\dfrac{\pi}{6}$ 또는 $u = \dfrac{7}{6}\pi$ ($\dfrac{11}{6}\pi > \dfrac{5}{3}\pi$이므로 제외)
- $2x - \dfrac{\pi}{3} = -\dfrac{\pi}{6} \implies 2x = \dfrac{\pi}{6} \implies x = \dfrac{\pi}{12}$
- $2x - \dfrac{\pi}{3} = \dfrac{7}{6}\pi \implies 2x = \dfrac{3}{2}\pi \implies x = \dfrac{3}{4}\pi$
따라서 모든 근의 합은 $\dfrac{\pi}{12} + \dfrac{3}{4}\pi = \dfrac{10}{12}\pi = \dfrac{5}{6}\pi$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "16", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-06-TRIG_EQUATION_SHIFTED_ARG", "primaryMethod": "u=2x-π/3의 범위 [-π/3, 5π/3)에서 sin u=-1/2의 두 해를 구해 x로 역변환하여 합한다.", "decisiveStep": "치환 범위 [-π/3, 5π/3)에서 11π/6이 범위 밖임을 걸러내고 -π/6, 7π/6만 취하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동된 삼각방정식에서 치환 구간의 경계를 정확히 따져 근을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각방정식"], "goal": ["합"], "method": ["치환", "삼각방정식"], "condition": ["범위"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q17
- 형식: 객관식
- 배점: 4.2
### 발문
어떤 방사능 물질이 시간이 지남에 따라 일정한 비율로 붕괴되어 $a$년 후에는 처음 양의 $\dfrac{1}{2}$이 된다고 할 때, $a$년을 이 물질의 반감기라고 한다. 반감기가 $a$년인 방사능 물질의 처음의 양을 $m_0$이라 할 때, $t$년 후 이 방사능 물질의 양 $m(t)$는
$$m(t) = m_0 \times \left(\dfrac{1}{2}\right)^{\frac{t}{a}}$$
인 관계가 성립한다. 반감기가 $250$년인 방사능 물질의 양이 현재 $m$이라고 할 때, 이 물질의 양이 $\dfrac{m}{32}$이 되는 것은 지금으로부터 약 몇 년 후인지 구하면? [4.2점]
### 선지
① $1000$년 후 ② $1250$년 후 ③ $1500$년 후 ④ $1750$년 후 ⑤ $2000$년 후
### 정답
②
### 해설
$a = 250$, $m_0 = m$이고 $m(t) = \dfrac{m}{32}$이므로
$m \times \left(\dfrac{1}{2}\right)^{\frac{t}{250}} = \dfrac{m}{32} = m \times \left(\dfrac{1}{2}\right)^5$
$\dfrac{t}{250} = 5 \implies t = 1250$
따라서 약 $1250$년 후이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "17", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-HALF_LIFE_EXP_EQUATION", "primaryMethod": "반감기 공식에 a=250과 m/32를 대입해 지수방정식 (1/2)^(t/250)=(1/2)^5를 푼다.", "decisiveStep": "1/32 = (1/2)^5으로 바꾸어 t/250 = 5를 푸는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 1, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "주어진 반감기 지수 공식에 수치를 대입해 바로 푸는 1단계 문항이다.", "level": "하", "item4slot": {"given": ["지수방정식"], "goal": ["값"], "method": ["대입", "지수법칙"], "condition": []}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q18
- 형식: 객관식
- 배점: 4.2
### 발문
정의역이 $\{x \mid 1 \le x < 1000\}$이고, 함숫값이 $\log x$의 소수 부분인 함수를 $f(x)$라 하자. 함수 $y = f(x)$의 그래프와 직선 $y = 3 - \dfrac{x}{n}$이 서로 다른 두 점에서 만나도록 하는 자연수 $n$의 개수를 구하면? [4.2점]
### 선지
① $13$ ② $14$ ③ $15$ ④ $16$ ⑤ $17$
### 정답
⑤
### 해설
$1 \le x < 1000$에서 $f(x)$는 세 구간에서 각각 $\log x$ ($1 \le x < 10$), $\log x - 1$ ($10 \le x < 100$), $\log x - 2$ ($100 \le x < 1000$)로 $0$에서 $1$ 미만까지 증가한다.
직선 $y = 3 - \dfrac{x}{n}$은 $x > 0$에서 감소하며 $y = 1$일 때 $x = 2n$, $y = 0$일 때 $x = 3n$이다.
각 구간과의 교점 조건은 다음과 같다.
- 구간 $[1, 10)$: $y(1) = 3 - \dfrac{1}{n} \ge 2 > 0$이므로 $y(10) < 1$일 때, 즉 $3 - \dfrac{10}{n} < 1 \iff n < 5$일 때 교점이 $1$개 생긴다.
- 구간 $[10, 100)$: $y(10) \ge 0$ ($3n \ge 10 \implies n \ge 4$)이고 $y(100) < 1$ ($2n < 100 \implies n < 50$)일 때 교점이 $1$개 생긴다.
- 구간 $[100, 1000)$: $y(100) \ge 0$ ($3n \ge 100 \implies n \ge 34$)이고 $y(1000) < 1$ ($n < 500$)일 때 교점이 $1$개 생긴다.
따라서 교점이 정확히 $2$개인 경우는
1) $[1, 10)$과 $[10, 100)$에서 만나는 경우: $4 \le n < 5 \implies n = 4$ ($1$개)
2) $[10, 100)$과 $[100, 1000)$에서 만나는 경우: $34 \le n < 50 \implies n = 34, 35, \dots, 49$ ($16$개)
그러므로 조건을 만족시키는 자연수 $n$의 개수는 $1 + 16 = 17$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "18", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-02-MANTISSA_LINE_INTERSECTIONS", "primaryMethod": "log x의 소수부분 함수의 3개 구간 경계(10, 100, 1000)에서 직선 y=3-x/n의 함숫값이 [0,1)에 걸치는 조건으로 n을 센다.", "decisiveStep": "각 구간 [10^k, 10^(k+1))과 만날 조건 y(10^k)≥0, y(10^(k+1))<1의 등호 여부를 정확히 판별해 2교점 범위를 구하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "상용로그 소수 부분 함수의 불연속 경계 포함·미포함 조건과 직선의 교점 개수를 분석하는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": ["상용로그", "소수부분", "직선"], "goal": ["개수"], "method": ["경우분류", "부등식"], "condition": ["자연수", "개수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q19
- 형식: 객관식
- 배점: 4.3
### 발문
함수 $f(x)$를
$$f(x) = \begin{cases} \log_2(4x - 4) & (1 < x < 5) \\ (\sqrt{2})^{9 - x} & (x \ge 5) \end{cases}$$
라 하자. $t \le x \le t + 2$에서 함수 $f(x)$의 최댓값이 $4$가 되도록 하는 모든 자연수 $t$의 개수를 $a$, $s \le x \le s + 1$에서 함수 $f(x)$의 최솟값이 $1$이 되도록 하는 모든 실수 $s$의 값의 합을 $b$라 할 때, $a + 2b$의 값을 구하면? (단, $t > 1$, $s > 1$, $a, b$는 상수이다.) [4.3점]
### 선지
① $16$ ② $18$ ③ $20$ ④ $22$ ⑤ $24$
### 정답
④
### 해설
$1 < x < 5$에서 $f(x) = \log_2(4x - 4)$는 증가하고 $\lim_{x \to 5-} f(x) = \log_2 16 = 4$이다.
$x \ge 5$에서 $f(x) = (\sqrt{2})^{9 - x}$는 감소하고 $f(5) = (\sqrt{2})^4 = 4$이다.
따라서 $f(x)$는 $x = 5$에서 최댓값 $4$를 가진다.
(1) $t \le x \le t + 2$에서 $f(x)$의 최댓값이 $4$가 되려면 $t \le 5 \le t + 2$, 즉 $3 \le t \le 5$이어야 한다.
자연수 $t$는 $3, 4, 5$이므로 $a = 3$이다.
(2) $f(x) = 1$인 $x$를 구하면
- $1 < x < 5$: $\log_2(4x - 4) = 1 \implies 4x - 4 = 2 \implies x = \dfrac{3}{2}$
- $x \ge 5$: $(\sqrt{2})^{9 - x} = 1 \implies 9 - x = 0 \implies x = 9$
구간 $[s, s + 1]$에서 최솟값은 양 끝점 $f(s), f(s+1)$ 중 작은 값이다.
- $s = \dfrac{3}{2}$일 때: 증가 구간 $\left[\dfrac{3}{2}, \dfrac{5}{2}\right]$에서 최솟값 $f\left(\dfrac{3}{2}\right) = 1$
- $s + 1 = 9$, 즉 $s = 8$일 때: 감소 구간 $[8, 9]$에서 최솟값 $f(9) = 1$
(그 외 $s$에서는 $\min(f(s), f(s+1)) \neq 1$)
따라서 $b = \dfrac{3}{2} + 8 = \dfrac{19}{2}$이고, $a + 2b = 3 + 19 = 22$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "19", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-04-PIECEWISE_LOG_EXP_SLIDING_EXTREMA", "primaryMethod": "x=5에서 최댓값 4를 갖는 구간별 함수의 증감을 파악해 t∈[3,5]와 최솟값 1인 s값 3/2, 8을 구한다.", "decisiveStep": "단봉(x=5) 함수의 이동 구간 최솟값은 양 끝점 함숫값의 최솟값임을 이용해 s=3/2, 8을 찾는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "구간별 로그·지수함수의 연속성과 이동 구간에서의 최대·최소 조건을 동시에 해결하는 고난도 4단계 문항이다.", "level": "상", "item4slot": {"given": ["조각함수", "로그함수", "지수함수", "최댓값", "최솟값"], "goal": ["합"], "method": ["증가감소", "경우분류"], "condition": ["자연수", "실수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q20
- 형식: 객관식
- 배점: 4.3
### 발문
각 $\theta$를 나타내는 동경과 각 $2\theta$를 나타내는 동경이 $y$축에 대하여 대칭이고, 각 $\theta$를 나타내는 동경과 각 $5\theta$를 나타내는 동경이 $x$축에 대하여 대칭이다. 이 두 조건을 모두 만족시키는 $\theta$의 값이 $\dfrac{b}{a}\pi$일 때, $a + b$의 값을 구하면? (단, $0 < \theta < \pi$이고, $a, b$는 서로소인 자연수이다.) [4.3점]
### 선지
① $2$ ② $3$ ③ $4$ ④ $5$ ⑤ $6$
### 정답
③
### 해설
(1) $\theta$와 $2\theta$의 동경이 $y$축 대칭이므로
$\theta + 2\theta = (2m + 1)\pi$ ($m$은 정수) $\implies \theta = \dfrac{2m + 1}{3}\pi$
$0 < \theta < \pi$에서 가능한 값은 $\theta = \dfrac{\pi}{3}$
(2) $\theta$와 $5\theta$의 동경이 $x$축 대칭이므로
$\theta + 5\theta = 2n\pi$ ($n$은 정수) $\implies \theta = \dfrac{n}{3}\pi$
$0 < \theta < \pi$에서 가능한 값은 $\theta = \dfrac{\pi}{3}, \dfrac{2}{3}\pi$
두 조건을 모두 만족시키는 $\theta$는 $\dfrac{\pi}{3}$이므로 $a = 3, b = 1$이다.
따라서 $a + b = 3 + 1 = 4$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "20", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-05-RAY_TWO_SYMMETRIES", "primaryMethod": "y축 대칭 조건 3θ=(2m+1)π와 x축 대칭 조건 6θ=2nπ의 공통 해 θ=π/3을 (0, π)에서 찾는다.", "decisiveStep": "두 대칭 관계의 일반각 식에서 (0, π) 내 공통 각 θ=π/3을 확정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "동경의 y축 대칭과 x축 대칭 일반각 조건을 연립해 공통 각을 찾는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["일반각"], "goal": ["합"], "method": ["대칭성", "일반각"], "condition": ["범위", "서로소"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q21
- 형식: 객관식
- 배점: 4.4
### 발문
함수 $h(x) = 4 + 3\cos\left(\dfrac{\pi}{2}(x - 2)\right)$에 대하여 $3 \le x \le 7$일 때, $h(x)$는 $x = a$에서 최댓값 $b$, $x = c$에서 최솟값 $d$를 갖는다. 이때 $ad + bc$의 값을 구하면? (단, $a, b, c, d$는 상수이다.) [4.4점]
### 선지
① $34$ ② $36$ ③ $38$ ④ $40$ ⑤ $42$
### 정답
①
### 해설
$3 \le x \le 7$에서 $u = \dfrac{\pi}{2}(x - 2)$라 하면 $\dfrac{\pi}{2} \le u \le \dfrac{5}{2}\pi$이다.
구간 $\left[\dfrac{\pi}{2}, \dfrac{5}{2}\pi\right]$에서 $\cos u$는
- $u = 2\pi$일 때 최댓값 $1$ $\implies \dfrac{\pi}{2}(x - 2) = 2\pi \implies x = 6$ ($a = 6$, $b = 4 + 3 = 7$)
- $u = \pi$일 때 최솟값 $-1$ $\implies \dfrac{\pi}{2}(x - 2) = \pi \implies x = 4$ ($c = 4$, $d = 4 - 3 = 1$)
따라서 $ad + bc = 6 \times 1 + 7 \times 4 = 6 + 28 = 34$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "21", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-06-COS_INTERVAL_EXTREMA_PARAMS", "primaryMethod": "u=(π/2)(x-2)의 범위 [π/2, 5π/2]에서 cos u가 1과 -1이 되는 x좌표를 구해 ad+bc를 계산한다.", "decisiveStep": "치환 구간 [π/2, 5π/2]에서 cos u=1(u=2π)과 cos u=-1(u=π)을 찾는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 2, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "평행이동·주기 변환된 코사인함수의 제한된 구간에서 최대·최소 위치와 값을 구하는 2단계 문항이다.", "level": "중", "item4slot": {"given": ["삼각함수", "최댓값", "최솟값"], "goal": ["값"], "method": ["치환", "주기"], "condition": ["범위"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q22
- 형식: 서술형
- 배점: 6
### 발문
[주관식1 (서술형)] [6점]
각 $\theta$가 $\sin\theta + \cos\theta = \dfrac{1}{2}$을 만족시킬 때, $\sin^6\theta - \cos^6\theta$의 값을 구하고, 그 과정을 서술하시오. (단, $\dfrac{3}{2}\pi < \theta < 2\pi$이다.)
### 정답
$-\dfrac{55\sqrt{7}}{256}$
### 해설
$\sin\theta + \cos\theta = \dfrac{1}{2}$의 양변을 제곱하면
$1 + 2\sin\theta\cos\theta = \dfrac{1}{4} \implies \sin\theta\cos\theta = -\dfrac{3}{8}$
$(\sin\theta - \cos\theta)^2 = 1 - 2\sin\theta\cos\theta = 1 + \dfrac{3}{4} = \dfrac{7}{4}$
$\dfrac{3}{2}\pi < \theta < 2\pi$는 제$4$사분면의 각이므로 $\sin\theta < 0$, $\cos\theta > 0$이어서 $\sin\theta - \cos\theta < 0$이다.
따라서 $\sin\theta - \cos\theta = -\dfrac{\sqrt{7}}{2}$이고,
$\sin^6\theta - \cos^6\theta = (\sin^2\theta - \cos^2\theta)(\sin^4\theta + \sin^2\theta\cos^2\theta + \cos^4\theta)$
$= (\sin\theta + \cos\theta)(\sin\theta - \cos\theta)\{(\sin^2\theta + \cos^2\theta)^2 - \sin^2\theta\cos^2\theta\}$
$= \dfrac{1}{2} \times \left(-\dfrac{\sqrt{7}}{2}\right) \times \left(1 - \dfrac{9}{64}\right) = -\dfrac{\sqrt{7}}{4} \times \dfrac{55}{64} = -\dfrac{55\sqrt{7}}{256}$
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "22", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-05-TRIG_SIXTH_POWER_DIFF", "primaryMethod": "sin θ+cos θ=1/2에서 sin θ cos θ와 sin θ-cos θ(제4사분면 부호)를 구해 sin⁶θ-cos⁶θ를 인수분해 계산한다.", "decisiveStep": "sin⁶θ-cos⁶θ = (sin θ+cos θ)(sin θ-cos θ)(1-sin²θ cos²θ)로 변형해 대입하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "삼각함수 제곱 관계, 사분면 부호 판별, 6차식 곱셈 공식 변형을 연쇄 적용하는 3단계 서술형 문항이다.", "level": "중", "item4slot": {"given": ["삼각함수"], "goal": ["값"], "method": ["곱셈공식", "인수분해", "삼각함수의상호관계"], "condition": ["범위", "부호"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q23
- 형식: 서술형
- 배점: 7
### 발문
[주관식2 (서술형)] [7점]
네 양수 $x, y, z, a$가 다음 <조건>을 만족시킬 때, $a^3$의 값을 구하고, 그 과정을 서술하시오.
<조건>
(가) $5^x = 3^y = a^z$
(나) $\log 3 + \log xy - \log(3x - y) = \log z$
### 정답
$\dfrac{27}{5}$
### 해설
조건 (나)의 진수 조건에 의해 $3x - y > 0$이고 로그의 성질로 정리하면
$\log \dfrac{3xy}{3x - y} = \log z \implies z = \dfrac{3xy}{3x - y}$
양변의 역수를 취하면
$\dfrac{1}{z} = \dfrac{3x - y}{3xy} = \dfrac{1}{y} - \dfrac{1}{3x}$
한편 조건 (가)에서 $5^x = 3^y = a^z = k$ ($k > 0$)라 하면
$5 = k^{\frac{1}{x}}$, $3 = k^{\frac{1}{y}}$, $a = k^{\frac{1}{z}}$
$a = k^{\frac{1}{z}} = k^{\frac{1}{y} - \frac{1}{3x}} = \dfrac{k^{\frac{1}{y}}}{\left(k^{\frac{1}{x}}\right)^{\frac{1}{3}}} = \dfrac{3}{5^{\frac{1}{3}}}$
따라서 $a^3 = \dfrac{3^3}{5} = \dfrac{27}{5}$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "23", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-01-EQUAL_POWERS_LOG_RECIPROCAL", "primaryMethod": "조건 (나)에서 1/z = 1/y - 1/(3x)를 도출하고 조건 (가)를 k로 놓아 지수법칙으로 a=3/5^(1/3)을 구한다.", "decisiveStep": "z=3xy/(3x-y)의 역수를 취해 1/z = 1/y - 1/(3x)를 얻어 k의 지수로 연결하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 3, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "로그 방정식의 역수 변형과 등비 지수식 k 치환을 결합해 a³을 구하는 3단계 서술형 문항이다.", "level": "상", "item4slot": {"given": ["지수", "로그"], "goal": ["값"], "method": ["로그", "지수법칙", "치환"], "condition": ["부호"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```


## Q24
- 형식: 서술형
- 배점: 7
### 발문
[주관식3 (서술형)] [7점]
두 정수 $a, n$에 대하여 직선 $y = n$이 두 함수 $f(x) = 2^{x - 1} + a$, $g(x) = -2^x - \dfrac{a}{2} + 6$의 그래프와 모두 만나도록 하는 정수 $n$의 개수가 $4$일 때, $n$의 최솟값을 $b$, 최댓값을 $c$라 하자. 좌표평면에서 두 곡선 $y = f(x)$, $y = g(x)$와 두 직선 $x = b$, $x = c$로 둘러싸인 영역의 내부 또는 그 경계에 포함되고 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하고, 그 과정을 서술하시오. (단, $a, b, c$는 상수이다.)
### 정답
$74$
### 해설
두 함수의 치역은 각각 $\{y \mid y > a\}$, $\left\{y \,\middle|\, y < -\dfrac{a}{2} + 6\right\}$이다.
직선 $y = n$이 두 그래프와 모두 만나려면 $a < n < -\dfrac{a}{2} + 6$이어야 하고, 이를 만족시키는 정수 $n$이 $4$개이려면
$4 < \left(-\dfrac{a}{2} + 6\right) - a \le 5$
$4 < 6 - \dfrac{3}{2}a \le 5 \implies 1 \le \dfrac{3}{2}a < 2 \implies \dfrac{2}{3} \le a < \dfrac{4}{3}$
$a$는 정수이므로 $a = 1$이다.
따라서 $1 < n < \dfrac{11}{2}$이므로 정수 $n$은 $2, 3, 4, 5$이고 $b = 2$, $c = 5$이다.
이제 $2 \le x \le 5$에서 $g(x) = -2^x + \dfrac{11}{2} \le y \le 2^{x - 1} + 1 = f(x)$를 만족시키는 정수점 $(x, y)$의 개수를 각 $x$별로 세면 다음과 같다.
- $x = 2$: $1.5 \le y \le 3 \implies y = 2, 3$ ($2$개)
- $x = 3$: $-2.5 \le y \le 5 \implies y = -2, -1, \dots, 5$ ($8$개)
- $x = 4$: $-10.5 \le y \le 9 \implies y = -10, -9, \dots, 9$ ($20$개)
- $x = 5$: $-26.5 \le y \le 17 \implies y = -26, -25, \dots, 17$ ($44$개)
따라서 구하는 점의 개수는 $2 + 8 + 20 + 44 = 74$이다.
```json:plan
{"exempt": true, "reason": "STRICT_VARIANT"}
```
```json:meta
{"sourceQid": "24", "variationType": "NUMERIC", "standardCourse": "수학I", "courseKey": "", "curriculum": "2015", "standardUnitKey": "", "subUnitKey": "", "conceptClusterKey": "H15-M1-03-EXP_RANGE_INTERSECTION_LATTICE_COUNT", "primaryMethod": "두 지수함수의 치역 교집합 (a, -a/2+6)에 정수 4개가 들어가도록 a=1을 구한 뒤 x=2,3,4,5별로 격자점을 센다.", "decisiveStep": "열린구간 (a, -a/2+6)에 정수 4개가 들어갈 조건 4 < 6-3a/2 ≤ 5로부터 정수 a=1을 결정하는 단계", "rpm": {"majorUnit": "", "midUnit": "", "l3": "", "l4": ""}, "ptTplCandidate": {"problemTypeKey": null, "templateKey": null, "why": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}, "crossConceptKeys": [], "conditionKeys": [], "integrationPattern": "NONE", "difficultyBucket": 4, "difficultyConfidence": "high", "difficultyBoundaryFlag": "NONE", "difficultyReason": "열린구간 내 정수 개수 조건으로 미정계수를 확정하고 곡선 사이 격자점 개수를 x좌표별로 계산하는 고난도 4단계 서술형 문항이다.", "level": "상", "item4slot": {"given": ["지수함수", "정수", "직선"], "goal": ["개수"], "method": ["치역", "부등식", "경우분류"], "condition": ["정수", "개수"]}, "hold": "정본 폴더에 메타_키선택표_고2.json 미구비로 키 확정 보류"}
```