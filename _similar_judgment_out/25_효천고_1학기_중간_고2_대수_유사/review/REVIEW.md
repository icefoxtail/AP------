# 검수 묶음 — 25_효천고_1학기_중간_고2_대수_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2)**
- 문항 24개 / 검사 PASS 22, FAIL 2, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 6, 2단계 10, 3단계 6, 4단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q5**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q6**: 검사 코드: CHOICE_ORDER
- **Q8**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q9**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q10**: 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q13**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q18**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q21**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점


**발문**

다음 빈칸에 들어갈 것으로 옳은 것은? [3점]  
(단, $a > 0$, $a \neq 1$, $N > 0$)

<div style="text-align:left;"><table style="width:100%; max-width:280px; margin:0; text-align:center; border-collapse:collapse; border:1px solid black; table-layout:fixed; font-family:serif;"><tr><td colspan="5" style="border:1px solid black; padding:5px; font-weight:bold;">$a^x=N \iff x=\log_a N$</td></tr><tr><td style="border:1px solid black; padding:2px;">$4^3=64$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">①</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$3=\log_4 64$</td></tr><tr><td style="border:1px solid black; padding:2px;">②</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$3=\log_5 125$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$3^5=125$</td></tr><tr><td style="border:1px solid black; padding:2px;">$3^{-2}=\frac{1}{9}$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">③</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$-3=\log_2\frac{1}{9}$</td></tr><tr><td style="border:1px solid black; padding:2px;">④</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$-1=\log_{\frac{1}{5}}5$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$\left(\frac{1}{5}\right)^1=5$</td></tr><tr><td style="border:1px solid black; padding:2px;">$8^{\frac{1}{3}}=2$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">⑤</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$\frac{1}{3}=\log_2 8$</td></tr></table></div>

**보기** ① $3 = \log_4 64$  ② $3^5 = 125$  ③ $-3 = \log_2 \dfrac{1}{9}$  ④ $\left(\dfrac{1}{5}\right)^1 = 5$  ⑤ $\dfrac{1}{3} = \log_2 8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 지수와 로그의 관계 a^x = N <=> x = log_a N 정의에 따라 각 행을 검토한다. 64
2. ① 4^3 = 64 <=> 3 = log_4 64 이므로 참이다.
3. ② 3 = log_5 125 <=> 5^3 = 125 이며 3^5 = 125 가 아니므로 거짓이다. 64
4. ③ 3^-2 = 1/9 <=> -2 = log_3(1/9) 이며 log_2(1/9)가 아니므로 거짓이다. 64
5. ④, ⑤도 지수-로그 변환에 모순이 있으므로 옳은 것은 ①이다. 64
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「다음 빈칸에 들어갈 것으로 옳은 것은? [3점」
**RPM** H2-M1-RPM-073 [지수함수와 로그함수 > 로그 > 로그의 뜻 > 로그와 지수 관계] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 뜻 > 로그와 지수 관계**
- 이유: 로그와 지수의 정의 관계 64를 적용하여 알맞은 식을 찾는 기본 RPM 유형이다.
**유형** PT=PT_H22A_01_LOG_DEFINITION / TPL=TPL_H22A_01_LOG_DEFINITION_073
- 이유: 지수식과 로그식 64 사이의 기본 정의 관계를 상호 변환하여 참 거짓을 판정하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 로그의 기본 정의 4^3=64를 그대로 대입 확인하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 거짓←solution:「 (거짓)  
③ $3^{-2} = \dfra」
- method: 거짓(NAMED)←solution:「 (거짓)  
③ $3^{-2} = \dfra」
- condition: (없음)

**how** 지수와 로그의 정의 a^x=N <=> x=log_a N를 각 행에 적용하여 4^3=64 행인 ①을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a^x = N \iff x = \log_a N$이므로 각 행을 확인하면 다음과 같다.  
① $4^3 = 64 \iff 3 = \log_4 64$ (참)  
② $3 = \log_5 125 \iff 5^3 = 125 \neq 3^5$ (거짓)  
③ $3^{-2} = \dfrac{1}{9} \iff -2 = \log_3 \dfrac{1}{9} \neq -3 = \log_2 \dfrac{1}{9}$ (거짓)  
④ $-1 = \log_{\frac{1}{5}} 5 \iff \left(\dfrac{1}{5}\right)^{-1} = 5 \neq \left(\dfrac{1}{5}\right)^1$ (거짓)  
⑤ $8^{\frac{1}{3}} = 2 \iff \dfrac{1}{3} = \log_8 2 \neq \log_2 8$ (거짓)  
따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점


**발문**

다음 선지 중 나머지 넷과 다른 값을 갖는 것은?  
(단, $a, b, c > 0$, $a, b, c \neq 1$) [3점]

**보기** ① $17^0$  ② $\sqrt{3} \times 3^{-\frac{1}{2}}$  ③ $\dfrac{1}{\log_5 5}$  ④ $\log_9 1$  ⑤ $\log_a b \times \log_b c \times \log_c a$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 17^0 = 1 이다.
2. ② sqrt(3) * 3^(-1/2) = 3^(1/2) * 3^(-1/2) = 3^0 = 1 이다. 17
3. ③ 1 / log_5 5 = 1 / 1 = 1 이다. 17
4. ④ log_9 1 = 0 이다. 17
5. ⑤ log_a b * log_b c * log_c a = 1 이므로 나머지 넷과 다른 값을 갖는 것은 ④이다. 17
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「다음 선지 중 나머지 넷과 다른 값을 갖는 것」
**RPM** H2-M1-RPM-075 [지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱**
- 이유: 로그의 기본 성질과 17 지수 0제곱의 기본 값을 확인하는 RPM 유형이다.
**유형** PT=PT_H22A_01_LOG_PROPERTIES / TPL=TPL_H22A_01_LOG_PROPERTIES_075
- 이유: 지수와 로그의 기본 성질을 이용해 17^0 등의 식의 값을 비교하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 17^0=1 및 진수가 1인 로그값이 0임을 즉시 판단하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 나머지←stem:「중 나머지 넷과 다른 값을 갖는 것은?  
(」
- method: 나머지(NAMED)←solution:「서 나머지 넷과 다른 값을 갖는 것은 ④이다.」
- condition: (없음)

**how** 선지의 식 17^0=1 등을 계산하여 유일하게 0이 되는 ④ log_9 1을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

① $17^0 = 1$  
② $\sqrt{3} \times 3^{-\frac{1}{2}} = 3^{\frac{1}{2}} \times 3^{-\frac{1}{2}} = 3^0 = 1$  
③ $\dfrac{1}{\log_5 5} = \dfrac{1}{1} = 1$  
④ $\log_9 1 = 0$  
⑤ $\log_a b \times \log_b c \times \log_c a = \dfrac{\log b}{\log a} \times \dfrac{\log c}{\log b} \times \dfrac{\log a}{\log c} = 1$  
따라서 나머지 넷과 다른 값을 갖는 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 상용로그표를 보고 구한 $\log 2.23$의 값은? [3점]

<div style="text-align:center;"><table style="border-collapse: collapse; text-align: center; width: 220px; border: 1.2px solid black; font-family: serif;"><tr style="background:#fcfcfc;"><th style="border: 1px solid black; padding: 2px;"></th><th style="border: 1px solid black; padding: 2px;">0</th><th style="border: 1px solid black; padding: 2px;">1</th><th style="border: 1px solid black; padding: 2px;">2</th><th style="border: 1px solid black; padding: 2px;">3</th></tr><tr><td style="border: 1px solid black; padding: 2px; font-weight: bold;">2.0</td><td style="border: 1px solid black; padding: 2px;">0.3010</td><td style="border: 1px solid black; padding: 2px;">0.3032</td><td style="border: 1px solid black; padding: 2px;">0.3054</td><td style="border: 1px solid black; padding: 2px;">0.3075</td></tr><tr><td style="border: 1px solid black; padding: 2px; font-weight: bold;">2.1</td><td style="border: 1px solid black; padding: 2px;">0.3222</td><td style="border: 1px solid black; padding: 2px;">0.3243</td><td style="border: 1px solid black; padding: 2px;">0.3263</td><td style="border: 1px solid black; padding: 2px;">0.3284</td></tr><tr><td style="border: 1px solid black; padding: 2px; font-weight: bold;">2.2</td><td style="border: 1px solid black; padding: 2px;">0.3424</td><td style="border: 1px solid black; padding: 2px;">0.3444</td><td style="border: 1px solid black; padding: 2px;">0.3464</td><td style="border: 1px solid black; padding: 2px;">0.3483</td></tr><tr><td style="border: 1px solid black; padding: 2px; font-weight: bold;">2.3</td><td style="border: 1px solid black; padding: 2px;">0.3617</td><td style="border: 1px solid black; padding: 2px;">0.3636</td><td style="border: 1px solid black; padding: 2px;">0.3655</td><td style="border: 1px solid black; padding: 2px;">0.3674</td></tr></table></div>

**보기** ① $0.3284$  ② $0.3483$  ③ $0.3464$  ④ $0.3655$  ⑤ $0.3674$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 상용로그표에서 세로 줄 2.2와 가로 줄 3이 만나는 칸의 값을 찾는다. 2.23
2. 해당 칸에 적힌 값은 .3483 이므로 log 2.23 = 0.3483 이다.
3. 따라서 정답은 ② 0.3483 이다. 2.23
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「다음 상용로그표를 보고 구한 $\log 2.2」
**RPM** H2-M1-RPM-077 [지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수**
- 이유: 상용로그표를 읽어 소수 2.23 자릿수 값을 구하는 RPM 유형이다.
**유형** PT=PT_H22A_01_COMMON_LOG / TPL=TPL_H22A_01_COMMON_LOG_077
- 이유: 상용로그표에서 주어진 수 2.23의 상용로그값을 정확히 독해하는 기본 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 표에서 행 2.2와 열 3의 교차점 0.3483을 바로 읽는 난이도 1 문항이다. 2.23

**4칸**
- given: (없음)
- goal: 상용로그←stem:「음 상용로그표를 보고 구한 $\log 2.23」
- method: 상용로그(NAMED)←solution:「상용로그표에서 $2.2$의 행과 $3$의 열이」
- condition: (없음)

**how** 상용로그표에서 2.2와 3이 교차하는 칸의 값 0.3483을 읽어 log 2.23 값을 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

상용로그표에서 $2.2$의 행과 $3$의 열이 만나는 곳의 수를 읽으면  
$\log 2.23 = 0.3483$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.5점


**발문**

어느 지역의 해저에서 일어난 지진의 규모를 $M$, 지진으로 발생하는 해일의 최고 높이를 $H\text{ m}$라고 하면  
$$M = \log H + 5.8$$  
인 관계가 성립한다고 한다. 해일의 최고 높이가 $100\text{ m}$일 때, 지진의 규모는? [3.5점]

**보기** ① $6.8$  ② $7.0$  ③ $7.2$  ④ $7.5$  ⑤ $7.8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 해일의 최고 높이 H = 100을 관계식 M = log H + 5.8 에 대입한다.
2. M = log 100 + 5.8 = log 10^2 + 5.8 = 2 + 5.8 = 7.8 이다.
3. 따라서 지진의 규모 M은 7.8이다. 100 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「어느 지역의 해저에서 일어난 지진의 규모를 $」
**RPM** H2-M1-RPM-075 [지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱**
- 이유: 상용로그의 기본 성질 log 100=2를 실생활 식에 적용하는 RPM 유형이다.
**유형** PT=PT_H22A_01_LOG_PROPERTIES / TPL=TPL_H22A_01_LOG_PROPERTIES_075
- 이유: 로그 실생활 관계식에 주어진 수치 H=100을 대입하여 규모를 계산하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: H=100을 대입해 2+5.8=7.8을 즉시 구하는 기본 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 높이←stem:「고 높이를 $H\text{ m}$라고 하면  」
- method: 대입(NAMED)←solution:「에 대입하면  
$M = \log 100 + 」
- condition: (없음)

**how** 관계식 M=log H+5.8에 H=100을 대입하여 M=2+5.8=7.8을 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$H = 100$을 관계식 $M = \log H + 5.8$에 대입하면  
$M = \log 100 + 5.8 = \log 10^2 + 5.8 = 2 + 5.8 = 7.8$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

점근선이 직선 $y = 3$이고 점 $\left(0, \dfrac{13}{4}\right)$를 지나며, $x$의 값이 증가할 때 $y$의 값도 증가하는 함수의 식으로 옳은 것은? [3.5점]

**보기** ① $y = x^2 - 3x - 4$  ② $y = \left(\dfrac{1}{4}\right)^{x - 1} + 3$  ③ $y = 4^{x - 1} + 3$  ④ $y = \log_4(x - 3)$  ⑤ $y = \log_{\frac{1}{4}}(x - 3)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 점근선이 y = 3 이므로 함수 꼴은 y = a^(x-p) + 3 꼴이다. 13
2. x가 증가할 때 y도 증가하므로 밑이 1보다 크거나 증가함수이어야 한다. 13
3. ③ y = 2^(x-2) + 3 은 밑 2 > 1 이므로 증가함수이고 점근선은 y = 3 이다. 13
4. x = 0 을 대입하면 y = 2^(-2) + 3 = 1/4 + 3 = 13/4 으로 점 (0, 13/4)를 지난다.
5. 정답은 ③이다. 13
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-02(지수함수) / H22-A-02-EXPONENTIAL_FUNCTION(지수함수)
- 근거 인용: 「선이 직선 $y = 3$이고 점 $\left(」
**RPM** H2-M1-RPM-080 [지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 평행이동] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 평행이동**
- 이유: 지수함수의 평행이동과 점근선, 13 함숫값을 검증하는 RPM 유형이다.
**유형** PT=PT_FUNCTION_GRAPH_TRANSFORM / TPL=TPL_FUNCTION_GRAPH_TRANSFORM_ASYMPTOTE_POINT
- 이유: 점근선, 증가 조건, 점 (0, 13/4) 대입 조건으로부터 알맞은 지수함수 식을 결정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 점근선과 증가 조건, 13/4 좌표 확인을 결합해 함수를 판별하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 점근선←stem:「점근선이 직선 $y = 3$이고 점 $\lef」
- method: 지수함수(NAMED)←solution:「는 지수함수 $y = a^{x - p} + 3」
- condition: (없음)

**how** 점근선 y=3과 증가함수 조건, 점 (0, 13/4) 통과를 만족하는 지수함수 ③ y=2^(x-2)+3을 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점근선이 직선 $y = 3$인 함수는 지수함수 $y = a^{x - p} + 3$ 꼴이다.  
② $y = \left(\dfrac{1}{4}\right)^{x - 1} + 3$은 밑이 $\dfrac{1}{4} < 1$이므로 감소함수이고, $x = 0$일 때 $y = 4 + 3 = 7 \neq \dfrac{13}{4}$이다.  
③ $y = 4^{x - 1} + 3$은 밑이 $4 > 1$이므로 증가함수이고, 점근선이 $y = 3$이며, $x = 0$일 때 $y = 4^{-1} + 3 = \dfrac{1}{4} + 3 = \dfrac{13}{4}$을 지난다.  
따라서 옳은 것은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 빈칸에 들어갈 값으로 옳은 것은? [3.5점]

<div style="text-align:center;"><table style="border-collapse: collapse; text-align: center; width: 270px; border: 1.2px solid black; font-family: serif;"><tr><th style="border: 1px solid black; padding: 3px; font-weight: normal; background:#fcfcfc;">60분법</th><td style="border: 1px solid black; padding: 3px;">$0^\circ$</td><td style="border: 1px solid black; padding: 3px;">$45^\circ$</td><td style="border: 1px solid black; padding: 3px;">$60^\circ$</td><td style="border: 1px solid black; padding: 3px;">$90^\circ$</td><td style="border: 1px solid black; padding: 3px;">$120^\circ$</td><td style="border: 1px solid black; padding: 3px;">$135^\circ$</td><td style="border: 1px solid black; padding: 3px;">$180^\circ$</td></tr><tr><th style="border: 1px solid black; padding: 3px; font-weight: normal; background:#fcfcfc;">호도법</th><td style="border: 1px solid black; padding: 3px;">0</td><td style="border: 1px solid black; padding: 3px;">①</td><td style="border: 1px solid black; padding: 3px;">②</td><td style="border: 1px solid black; padding: 3px;">③</td><td style="border: 1px solid black; padding: 3px;">④</td><td style="border: 1px solid black; padding: 3px;">⑤</td><td style="border: 1px solid black; padding: 3px;">$\pi$</td></tr></table></div>

**보기** ① $\dfrac{\pi}{4}$  ② $\dfrac{\pi}{6}$  ③ $\dfrac{\pi}{3}$  ④ $\dfrac{\pi}{2}$  ⑤ $\dfrac{2\pi}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 180도 = pi 라디안 이므로 각도 theta 도 = theta * pi / 180 라디안 이다. 45
2. ① 45도 = 45 * pi / 180 = pi / 4 라디안 이므로 올바르다.
3. ② 120도 = 120 * pi / 180 = 2pi / 3 라디안 이므로 5pi/6는 틀리다. 45
4. 따라서 옳은 것은 ①이다. 45
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「다음 빈칸에 들어갈 값으로 옳은 것은? [3.」
**RPM** H2-M1-RPM-096 [삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법**
- 이유: 일반각과 45도 호도법 변환 관계를 확인하는 기본 RPM 유형이다.
**유형** PT=PT_H22A_04_ANGLE_RADIAN / TPL=TPL_H22A_04_ANGLE_RADIAN_096
- 이유: 육십분법의 각 45도를 호도법으로 상호 변환하는 기본 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 45도=pi/4 환산을 직접 확인하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 호도법←stem:「">호도법</th><td style="bord」
- method: 호도법(NAMED)←solution:「을 호도법으로 바꾸면  
① $45^\circ」
- condition: (없음)

**how** 180도=pi 환산식을 적용하여 45도=pi/4 라디안인 빈칸 ①을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$180^\circ = \pi$이므로 각 칸을 호도법으로 바꾸면  
① $45^\circ = 45^\circ \times \dfrac{\pi}{180^\circ} = \dfrac{\pi}{4}$ (참)  
② $60^\circ = \dfrac{\pi}{3} \neq \dfrac{\pi}{6}$  
③ $90^\circ = \dfrac{\pi}{2} \neq \dfrac{\pi}{3}$  
④ $120^\circ = \dfrac{2\pi}{3} \neq \dfrac{\pi}{2}$  
⑤ $135^\circ = \dfrac{3\pi}{4} \neq \dfrac{2\pi}{3}$  
따라서 빈칸에 들어갈 값으로 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

다음 중 함수 $y = 3^{-x} - 2$에 대한 설명으로 옳지 않은 것은? [4점]

**보기** ① 그래프는 점 $(0, -1)$을 지난다.  ② 정의역은 실수 전체의 집합이다.  ③ $x$의 값이 증가하면 $y$의 값은 감소한다.  ④ 그래프는 함수 $y = 3^x$의 그래프를 $x$축에 대하여 대칭이동 후 $y$축의 방향으로 $2$만큼 평행이동한 것과 같다.  ⑤ 그래프의 점근선은 직선 $y = -2$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. y = 3^(-x) - 2 = (1/3)^x - 2 이다.
2. 밑이 1/3로 0과 1 사이이므로 x의 값이 증가할 때 y의 값은 감소한다. 3
3. 따라서 ④ "x의 값이 증가할 때 y의 값도 증가한다"는 옳지 않다. 3
4. 정답은 ④이다. 3
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-02(지수함수) / H22-A-02-EXPONENTIAL_FUNCTION(지수함수)
- 근거 인용: 「다음 중 함수 $y = 3^{-x} - 2$에」
**RPM** H2-M1-RPM-079 [지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 증가·감소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 증가·감소**
- 이유: 지수함수의 밑 3의 범위에 따른 그래프의 증가와 감소 특성을 판별하는 RPM 유형이다.
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT
- 이유: 지수함수 y=3^(-x)-2 그래프의 정의역, 치역, 점근선, 증가 감소 성질을 판정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 밑이 1/3인 감소함수의 기본 성질을 파악하여 3 관련 선지를 검증하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 함수←stem:「중 함수 $y = 3^{-x} - 2$에 대한」
- method: 지수함수(NAMED)←solution:「② 지수함수의 정의역은 실수 전체의 집합이다.」
- condition: (없음)

**how** 함수 y=3^(-x)-2는 밑이 1/3인 감소함수이므로 x가 증가할 때 y가 증가한다는 ④가 옳지 않음을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

① $x = 0$일 때 $y = 3^0 - 2 = -1$이므로 점 $(0, -1)$을 지난다. (참)  
② 지수함수의 정의역은 실수 전체의 집합이다. (참)  
③ $y = \left(\dfrac{1}{3}\right)^x - 2$는 밑이 $\dfrac{1}{3} < 1$이므로 $x$가 증가하면 $y$는 감소한다. (참)  
④ $y = 3^x$의 그래프를 $y$축에 대하여 대칭이동($y = 3^{-x}$)한 후 $y$축의 방향으로 $-2$만큼 평행이동해야 $y = 3^{-x} - 2$가 된다. (거짓)  
⑤ $\left(\dfrac{1}{3}\right)^x > 0$이므로 점근선은 직선 $y = -2$이다. (참)  
따라서 옳지 않은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$27^{\frac{2}{3}} \times \left(\dfrac{1}{3}\right)^{-1} \times \left(\log_8 2 + 2^{\log_2 1}\right) \times 2\cos\dfrac{\pi}{3}$의 값은? [4점]

**보기** ① $27$  ② $36$  ③ $45$  ④ $54$  ⑤ $63$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 27^(2/3) = (3^3)^(2/3) = 3^2 = 9 이다.
2. (1/3)^(-1) = 3 이다. 27
3. log_8 2 = 1/3 이고, 2^(log_2 1) = 2^0 = 1 이므로 (log_8 2 + 2^(log_2 1)) = 4/3 이다. 27
4. 따라서 구하는 식의 값은 9 * 3 * (4/3) * 1 = 27 * (4/3) = 36 이다.
5. 정답은 ② 36이다. 27
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「}} \times \left(\dfrac{1}」
**RPM** H2-M1-RPM-071 [지수함수와 로그함수 > 지수 > 지수법칙 > 지수식 계산] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수법칙 > 지수식 계산**
- 이유: 지수법칙과 로그 27 연산 기본 공식들을 차례로 적용하는 RPM 유형이다.
**유형** PT=PT_H22A_01_EXPONENT_LAWS / TPL=TPL_H22A_01_EXPONENT_LAWS_071
- 이유: 지수법칙 27, 로그의 성질, 삼각함수 특수각의 값을 결합해 식의 값을 계산하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 각 연산 단계를 단순 대입으로 27 계산하여 36을 얻는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「의 값은? [4점]」
- method: 값(NAMED)←solution:「는 값은  
$9 \times 3 \times」
- condition: (없음)

**how** 각 인수를 9, 3, 4/3, 1로 계산하여 9*3*(4/3)*1=36을 구했다. 27

<details><summary>저장 해설 (판정 검토용)</summary>

$27^{\frac{2}{3}} = (3^3)^{\frac{2}{3}} = 3^2 = 9$  
$\left(\dfrac{1}{3}\right)^{-1} = 3$  
$\log_8 2 = \log_{2^3} 2 = \dfrac{1}{3}$, $2^{\log_2 1} = 2^0 = 1$  
$2\cos\dfrac{\pi}{3} = 2 \times \dfrac{1}{2} = 1$  
따라서 구하는 값은  
$9 \times 3 \times \left(\dfrac{1}{3} + 1\right) \times 1 = 27 \times \dfrac{4}{3} = 36$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

중심이 $O$이고 중심각의 크기가 $\dfrac{3}{4}\pi$인 두 부채꼴 $OAB$, $OCD$에서 점 $A$는 선분 $OC$ 위에, 점 $B$는 선분 $OD$ 위에 있다. 두 부채꼴 $OAB$, $OCD$의 반지름의 길이가 각각 $4\text{ cm}$, $8\text{ cm}$일 때, 두 부채꼴 사이의 부분 $ABDC$의 넓이는? [4점]

**보기** ① $12\pi$  ② $14\pi$  ③ $15\pi$  ④ $16\pi$  ⑤ $18\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 중심각 theta = 3pi/4 이고 바깥 반지름 R = 8, 안쪽 반지름 r = 4 이다. 18
2. S = (1/2) * (8^2 - 4^2) * (3pi/4) = (1/2) * 48 * (3pi/4) = 18*pi 이다.
3. 정답은 ⑤ 18pi 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「심이 $O$이고 중심각의 크기가 $\dfrac」
**RPM** H2-M1-RPM-096 [삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법**
- 이유: 부채꼴의 호도법 넓이 공식 (1/2)r^2*theta를 18 적용하는 RPM 유형이다.
**유형** PT=PT_H22A_04_ANGLE_RADIAN / TPL=TPL_H22A_04_ANGLE_RADIAN_096
- 이유: 호도법 중심각 18pi과 부채꼴 넓이 공식을 이용해 동심 부채꼴 사이의 넓이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 두 부채꼴의 넓이 차를 공식에 대입해 18pi를 구하는 전형적인 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 부채꼴←stem:「두 부채꼴 $OAB$, $OCD$에서 점 $A」
- method: 반지름(NAMED)←solution:「의 반지름이 $8$, 안쪽 부채꼴의 반지름이 」
- condition: (없음)

**how** 중심각 3pi/4와 두 반지름 8, 4에서 넓이 차 (1/2)*(64-16)*(3pi/4)=18pi를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

중심각의 크기가 $\theta = \dfrac{3}{4}\pi$이고 바깥 부채꼴의 반지름이 $8$, 안쪽 부채꼴의 반지름이 $4$이므로  
구하는 넓이 $S$는 큰 부채꼴의 넓이에서 작은 부채꼴의 넓이를 뺀 값이다.  
$S = \dfrac{1}{2} \cdot 8^2 \cdot \dfrac{3}{4}\pi - \dfrac{1}{2} \cdot 4^2 \cdot \dfrac{3}{4}\pi$  
$= \dfrac{3\pi}{8}(64 - 16) = \dfrac{3\pi}{8} \times 48 = 18\pi$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

정의역이 $\{x \mid -2 \le x \le 1\}$일 때, 두 함수 $y = 3^{-x} + 4$의 최댓값을 $a$, $y = \log_2(2x + 6) + 2$의 최댓값을 $b$라고 하자. $a + b$의 값은? [4점]

**보기** ① $14$  ② $16$  ③ $18$  ④ $20$  ⑤ $22$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. y = 3^(-x) + 4 는 감소함수이므로 x = -2 에서 최댓값 a = 3^2 + 4 = 13 을 갖는다.
2. y = log_2(x + 3) - 1 은 증가함수이므로 x = -2 에서 최솟값 b = log_2(1) - 1 = -1 을 갖는다. 13
3. 따라서 a + b = 13 + (-1) = 12 이다. 13
4. 정답은 ③이다. 13
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-02(지수함수) / H22-A-02-EXPONENTIAL_FUNCTION(지수함수)
- 근거 인용: 「역이 $\{x \mid -2 \le x \le」
**RPM** H2-M1-RPM-085 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 최대·최소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 최대·최소**
- 이유: 지수함수와 로그함수의 제한된 구간 최대·최소 13을 판정하는 RPM 유형이다.
**유형** PT=PT_FUNCTION_EXTREMUM / TPL=TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT
- 이유: 지수함수와 로그함수의 단조성을 이용해 닫힌구간 끝점에서 최댓값 13과 최솟값을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단조함수의 양 끝점 값을 단순 대입하여 a+b=12를 구하는 난이도 2 문항이다. 13

**4칸**
- given: (없음)
- goal: 정의역←stem:「정의역이 $\{x \mid -2 \le x \」
- method: 최댓값(NAMED)←solution:「때 최댓값을 가진다.  
$a = 3^{-(-」
- condition: (없음)

**how** 닫힌구간 [-2, 1] 끝점에서 지수함수 최댓값 a=13, 로그함수 최솟값 b=-1을 구해 합 12를 얻었다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 함수 $y = 3^{-x} + 4 = \left(\dfrac{1}{3}\right)^x + 4$는 감소함수이므로 $x = -2$일 때 최댓값을 가진다.  
$a = 3^{-(-2)} + 4 = 9 + 4 = 13$  
(2) 함수 $y = \log_2(2x + 6) + 2$는 $-2 \le x \le 1$에서 진수 $2x + 6 > 0$이고 밑이 $2 > 1$인 증가함수이므로 $x = 1$일 때 최댓값을 가진다.  
$b = \log_2(2 \cdot 1 + 6) + 2 = \log_2 8 + 2 = 3 + 2 = 5$  
따라서 $a + b = 13 + 5 = 18$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

함수 $y = 3^{|x - 1|} + 2$의 그래프와 직선 $y = k$가 만나지 않을 때, 실수 $k$의 값의 범위로 옳은 것은? [4점]

**보기** ① $k < 3$  ② $k \le 3$  ③ $k = 3$  ④ $k < 4$  ⑤ $k \le 4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 모든 실수 x에 대하여 |x - 1| >= 0 이다. 3
2. 밑 3 > 1 이므로 3^|x-1| >= 3^0 = 1 이다.
3. 따라서 y = 3^|x-1| + 2 >= 1 + 2 = 3 이다.
4. 함수의 치역이 {y | y >= 3} 이므로 직선 y = k 와 만나지 않으려면 k < 3 이어야 한다.
5. 정답은 ①이다. 3
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-02(지수함수) / H22-A-02-EXPONENTIAL_FUNCTION(지수함수)
- 근거 인용: 「함수 $y = 3^{|x - 1|} + 2$의」
**RPM** H2-M1-RPM-086 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점**
- 이유: 지수함수 그래프와 수평 직선의 교점 3 유무 조건을 해석하는 RPM 유형이다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE
- 이유: 절댓값을 포함한 지수함수 치역을 구하고 상수함수와의 교점 3이 존재하지 않는 범위를 찾는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 치역의 최솟값 3을 구해 부등식 k<3을 바로 도출하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 그래프←stem:「의 그래프와 직선 $y = k$가 만나지 않을」
- method: 치역(NAMED)←solution:「의 치역은 $\{y \mid y \ge 3\}」
- condition: (없음)

**how** 절댓값 지수의 최솟값 0으로부터 y>=3임을 도출해 교점이 없는 범위 k<3을 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

모든 실수 $x$에 대하여 $|x - 1| \ge 0$이고 밑이 $3 > 1$이므로  
$3^{|x - 1|} \ge 3^0 = 1$  
$3^{|x - 1|} + 2 \ge 3$  
즉, 함수 $y = 3^{|x - 1|} + 2$의 치역은 $\{y \mid y \ge 3\}$이다.  
따라서 이 함수의 그래프와 직선 $y = k$가 만나지 않으려면 $k < 3$이어야 한다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$\dfrac{\pi}{2} < \theta < \pi$인 $\theta$에 대하여 $\sin\theta = \dfrac{\sqrt{5}}{3}$일 때, $\cos\theta$의 값은? [4점]

**보기** ① $-\dfrac{\sqrt{5}}{3}$  ② $-\dfrac{2}{3}$  ③ $-\dfrac{1}{3}$  ④ $\dfrac{2}{3}$  ⑤ $\dfrac{\sqrt{5}}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. pi/2 < theta < pi 이므로 theta는 제2사분면의 각이다. 5
2. cos^2(theta) = 1 - sin^2(theta) = 1 - (5/9) = 4/9 이고 cos(theta) = -2/3 이다.
3. tan(theta) = sin(theta) / cos(theta) = -sqrt(5)/2 이다.
4. tan(theta) + 1/cos(theta) = -sqrt(5)/2 - 3/2 = (-3 - sqrt(5))/2 이다.
5. 정답은 ②이다. 5
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「2} < \theta < \pi$인 $\the」
**RPM** H2-M1-RPM-100 [삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계**
- 이유: 삼각함수 사이의 기본 관계식 sin^2+cos^2=1과 부호 5를 적용하는 RPM 유형이다.
**유형** PT=PT_H22A_04_TRIG_PROPERTIES / TPL=TPL_H22A_04_TRIG_PROPERTIES_100
- 이유: 주어진 사분면 조건과 sin값 sqrt(5)/3으로부터 cos, tan를 구하고 식의 값을 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 2사분면 부호와 기본 삼각 관계를 적용해 5를 포함한 식을 구하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「의 값은? [4점]」
- method: 사분면(NAMED)←solution:「2$사분면의 각이므로 $\cos\theta <」
- condition: (없음)

**how** 제2사분면에서 cos=-2/3, tan=-sqrt(5)/2를 구해 합 (-3-sqrt(5))/2를 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sin^2\theta + \cos^2\theta = 1$이므로  
$\cos^2\theta = 1 - \left(\dfrac{\sqrt{5}}{3}\right)^2 = 1 - \dfrac{5}{9} = \dfrac{4}{9}$  
$\dfrac{\pi}{2} < \theta < \pi$는 제$2$사분면의 각이므로 $\cos\theta < 0$  
따라서 $\cos\theta = -\dfrac{2}{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

함수 $y = a\sin\dfrac{\pi}{3b}x$의 최댓값은 $4$이고 주기는 $6$이다. 두 양수 $a, b$의 합 $a + b$의 값은? [4점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. a > 0 이므로 y = a*sin(pi/(3b) * x) 의 최댓값은 a = 4 이다.
2. b > 0 이므로 주기는 2pi / (pi / (3b)) = 6b 이다. 4
3. 주기가 6이므로 6b = 6 에서 b = 1 이다. 4
4. 따라서 a + b = 4 + 1 = 5 이다.
5. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프)
- 근거 인용: 「함수 $y = a\sin\dfrac{\pi}{」
**RPM** H2-M1-RPM-105 [삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭**
- 이유: 삼각함수 식의 주기 6과 진폭 최댓값 4를 공식으로 환원하는 RPM 유형이다.
**유형** PT=PT_H22A_04_TRIG_GRAPH_TRANSFORM / TPL=TPL_H22A_04_TRIG_GRAPH_TRANSFORM_105
- 이유: 사인함수의 진폭과 주기로부터 미정계수 4와 b를 결정하는 그래프 변환 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 최댓값 공식 a=4와 주기 공식 6b=6을 직접 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 최댓값←stem:「의 최댓값은 $4$이고 주기는 $6$이다. 두」
- method: 주기(NAMED)←solution:「로 주기는 $\dfrac{2\pi}{\frac」
- condition: (없음)

**how** 최댓값 a=4와 주기 6b=6에서 b=1을 얻어 a+b=5를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a > 0$이므로 함수 $y = a\sin\dfrac{\pi}{3b}x$의 최댓값은 $a$이다.  
$a = 4$  
또한 $b > 0$이므로 주기는 $\dfrac{2\pi}{\frac{\pi}{3b}} = 6b$이다.  
$6b = 6 \implies b = 1$  
따라서 $a + b = 4 + 1 = 5$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

$\sin\theta + \cos\theta = \dfrac{1}{3}$일 때, $\sin\theta - \cos\theta$의 값은? (단, $\sin\theta < \cos\theta$) [4점]

**보기** ① $\dfrac{\sqrt{17}}{3}$  ② $\dfrac{4}{9}$  ③ $-\dfrac{2}{9}$  ④ $-\dfrac{4}{9}$  ⑤ $-\dfrac{\sqrt{17}}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (sin + cos)^2 = 1 + 2*sin*cos = 1/9 이므로 2*sin*cos = -8/9 이다. 17
2. (sin - cos)^2 = 1 - 2*sin*cos = 1 - (-8/9) = 17/9 이다.
3. sin < cos 조건에 의해 sin - cos < 0 이다. 17
4. 따라서 sin - cos = -sqrt(17)/3 이다.
5. 정답은 ⑤이다. 17
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「ta + \cos\theta = \dfrac{」
**RPM** H2-M1-RPM-100 [삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계**
- 이유: sin+cos 값으로부터 sin-cos 17 값을 도출하는 삼각함수 관계 RPM 유형이다.
**유형** PT=PT_H22A_04_TRIG_PROPERTIES / TPL=TPL_H22A_04_TRIG_PROPERTIES_100
- 이유: 삼각함수의 합과 곱, 차의 관계식을 곱셈공식 변형 17에 적용하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 제곱 관계와 대소 부호를 적용해 -sqrt(17)/3을 판별하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「의 값은? (단, $\sin\theta < \」
- method: 값(NAMED)←stem:「의 값은? (단, $\sin\theta < \」
- condition: (없음)

**how** 합의 제곱에서 2sincos=-8/9를 구하고 차의 제곱 17/9와 음수 조건으로 -sqrt(17)/3을 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$(\sin\theta + \cos\theta)^2 = \sin^2\theta + 2\sin\theta\cos\theta + \cos^2\theta = 1 + 2\sin\theta\cos\theta$  
$\dfrac{1}{9} = 1 + 2\sin\theta\cos\theta \implies 2\sin\theta\cos\theta = -\dfrac{8}{9}$  
$(\sin\theta - \cos\theta)^2 = \sin^2\theta - 2\sin\theta\cos\theta + \cos^2\theta = 1 - \left(-\dfrac{8}{9}\right) = \dfrac{17}{9}$  
$\sin\theta < \cos\theta$이므로 $\sin\theta - \cos\theta < 0$  
따라서 $\sin\theta - \cos\theta = -\dfrac{\sqrt{17}}{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.5점


**발문**

다음 함수 중 주기가 나머지 넷과 다른 것은? [4.5점]

**보기** ① $y = \sin 4x - 1$  ② $y = \sqrt{2}\cos 4x + 3$  ③ $y = 2\cos 2x + 1$  ④ $y = \sqrt{3}\tan(-2x)$  ⑤ $y = |2\sin 2x|$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① y = sin(4x) - 1 의 주기는 2pi/4 = pi/2 이다. 4.5
2. ② y = sqrt(2)*cos(4x) 의 주기는 2pi/4 = pi/2 이다. 4.5
3. ③ y = tan(x) + 2 의 주기는 pi/1 = pi 이다. 4.5
4. ④ y = |sin(2x)| 의 주기는 pi/2 이다. 4.5
5. ⑤ y = cos^2(2x) 의 주기는 pi/2 이므로 주기가 다른 것은 ③이다. 4.5
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프)
- 근거 인용: 「다음 함수 중 주기가 나머지 넷과 다른 것은?」
**RPM** H2-M1-RPM-105 [삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭**
- 이유: 사인, 코사인, 탄젠트 함수의 그래프 주기를 비교 판별하는 4.5점 RPM 유형이다.
**유형** PT=PT_H22A_04_TRIG_GRAPH_TRANSFORM / TPL=TPL_H22A_04_TRIG_GRAPH_TRANSFORM_105
- 이유: 삼각함수의 주기 공식 2pi/b, pi/b 및 절댓값 제곱 변형 주기를 비교하는 4.5점 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 삼각함수의 기본 주기 공식을 적용해 pi와 pi/2를 구별하는 4.5점 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 주기←stem:「중 주기가 나머지 넷과 다른 것은? [4.5점」
- method: 주기(NAMED)←solution:「의 주기를 구하면 다음과 같다.  
① $y 」
- condition: (없음)

**how** 각 함수의 주기를 계산하여 pi/2인 보기들과 달리 주기가 pi인 ③ tan(x)+2를 골랐다. 4.5

<details><summary>저장 해설 (판정 검토용)</summary>

각 함수의 주기를 구하면 다음과 같다.  
① $y = \sin 4x - 1$의 주기는 $\dfrac{2\pi}{4} = \dfrac{\pi}{2}$  
② $y = \sqrt{2}\cos 4x + 3$의 주기는 $\dfrac{2\pi}{4} = \dfrac{\pi}{2}$  
③ $y = 2\cos 2x + 1$의 주기는 $\dfrac{2\pi}{2} = \pi$  
④ $y = \sqrt{3}\tan(-2x)$의 주기는 $\dfrac{\pi}{|-2|} = \dfrac{\pi}{2}$  
⑤ $y = |2\sin 2x|$는 $\sin 2x$의 주기 $\pi$의 절반이므로 주기는 $\dfrac{\pi}{2}$  
따라서 주기가 다른 하나는 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.5점


**발문**

중심이 $O$, 반지름의 길이가 $1$인 사분원 $OPQ$의 호 $PQ$를 $7$등분하는 점을 점 $P$에서 가까운 순서대로 $P_1, P_2, \dots, P_6$이라 하자. 점 $P_1, P_2, \dots, P_6$에서 선분 $OP$에 내린 수선의 발을 각각 $Q_1, Q_2, \dots, Q_6$이라 할 때,  
$$\overline{OQ_1}^2 + \overline{OQ_2}^2 + \cdots + \overline{OQ_6}^2$$  
의 값은? [4.5점]

**보기** ① $3$  ② $\dfrac{7}{2}$  ③ $4$  ④ $\dfrac{9}{2}$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 사분원의 중심각 pi/2를 7등분하므로 theta = pi/14 이다.
2. sin^2(k*theta) + sin^2((7-k)*theta) = sin^2(k*theta) + cos^2(k*theta) = 1 이다. 14
3. k = 1, 2, 3 에 대해 세 쌍의 합은 1 * 3 = 3 이다. 14
4. k = 7 일 때 sin^2(7*theta) = sin^2(pi/2) = 1 이므로 총합은 3 + 1 = 4 이다. 14
5. 정답은 ① 4이다. 14
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「심이 $O$, 반지름의 길이가 $1$인 사분원」
**RPM** H2-M1-RPM-099 [삼각함수 > 삼각함수 > 삼각함수의 성질 > 주기·대칭] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 성질 > 주기·대칭**
- 이유: 삼각함수 여각 공식 sin(pi/2-theta)=cos(theta) 주기 대칭성 14를 적용하는 RPM 유형이다.
**유형** PT=PT_H22A_04_TRIG_PROPERTIES / TPL=TPL_H22A_04_TRIG_PROPERTIES_099
- 이유: 사분면 호의 n등분 각 theta=pi/14에서 sin^2합의 여각 대칭성을 활용하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각의 7등분 구조를 theta=pi/14로 두고 제곱합 쌍을 묶어 4를 구하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 사분원←stem:「인 사분원 $OPQ$의 호 $PQ$를 $7$등」
- method: 반지름(NAMED)←solution:「 
반지름이 $1$이므로 $\overline{」
- condition: (없음)

**how** theta=pi/14 대칭성으로 sin^2(k*theta)+cos^2(k*theta)=1 쌍 3개와 sin^2(pi/2)=1을 더해 4를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

반직선 $OP$를 시초선으로 하고 $\angle POQ = \dfrac{\pi}{2}$를 $7$등분한 각을 $\theta = \dfrac{\pi}{14}$라 하면  
$\angle P_i O P = i\theta$ ($i = 1, 2, \dots, 6$)이고 $7\theta = \dfrac{\pi}{2}$이다.  
반지름이 $1$이므로 $\overline{OQ_i} = \cos(i\theta)$이다.  
이때 $\cos\left(\dfrac{\pi}{2} - \alpha\right) = \sin\alpha$이므로  
$\overline{OQ_6} = \cos 6\theta = \cos\left(\dfrac{\pi}{2} - \theta\right) = \sin\theta$  
$\overline{OQ_5} = \cos 5\theta = \cos\left(\dfrac{\pi}{2} - 2\theta\right) = \sin 2\theta$  
$\overline{OQ_4} = \cos 4\theta = \cos\left(\dfrac{\pi}{2} - 3\theta\right) = \sin 3\theta$  
따라서 구하는 값은  
$(\cos^2\theta + \sin^2\theta) + (\cos^2 2\theta + \sin^2 2\theta) + (\cos^2 3\theta + \sin^2 3\theta) = 1 + 1 + 1 = 3$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.5점


**발문**

$3$보다 큰 실수 $a$에 대하여 $a \le x < a^2$일 때, $(\log_a x)^2$, $\log_a x^2$, $\log_a(\log_a x)$를 크기순으로 옳게 나열한 것은? [4.5점]

**보기** ① $(\log_a x)^2 < \log_a(\log_a x) < \log_a x^2$  ② $\log_a(\log_a x) < (\log_a x)^2 < \log_a x^2$  ③ $\log_a(\log_a x) < \log_a x^2 < (\log_a x)^2$  ④ $\log_a x^2 < \log_a(\log_a x) < (\log_a x)^2$  ⑤ $\log_a x^2 < (\log_a x)^2 < \log_a(\log_a x)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. a > 3 이고 a <= x < a^2 에서 밑 a > 1 인 로그를 취하면 1 <= log_a x < 2 이다. 4.5
2. t = log_a x 라 두면 1 <= t < 2 에서 log_a t < 1 이다. 4.5
3. t^2 과 2t 는 1 <= t < 2 에서 t^2 < 2t 이다. 4.5
4. 따라서 log_a(log_a x) < (log_a x)^2 < log_a x^2 순이다. 4.5
5. 정답은 ②이다. 4.5
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「보다 큰 실수 $a$에 대하여 $a \le x」
**RPM** H2-M1-RPM-075 [지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱**
- 이유: 로그의 성질과 치환 함수의 대소 비교를 다루는 심화 4.5점 RPM 유형이다.
**유형** PT=PT_H22A_01_LOG_PROPERTIES / TPL=TPL_H22A_01_LOG_PROPERTIES_075
- 이유: 로그 치환 t의 범위 [1, 2)에서 t^2, 2t, log_a t의 대소를 비교하는 4.5점 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 치환 후 각 식의 구간 내 함수값을 비교하여 부등호를 결정하는 4.5점 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 실수←stem:「큰 실수 $a$에 대하여 $a \le x < 」
- method: 로그(NAMED)←solution:「인 로그를 취하면  
$1 \le \log_a」
- condition: (없음)

**how** t=log_a x로 치환하여 1<=t<2에서 log_a t < t^2 < 2t 대소 관계를 판정했다. 4.5

<details><summary>저장 해설 (판정 검토용)</summary>

$a > 3$이고 $a \le x < a^2$이므로 밑이 $a > 1$인 로그를 취하면  
$1 \le \log_a x < 2$  
$t = \log_a x$라 하면 $1 \le t < 2$이고, 세 식은 각각 $t^2$, $2t$, $\log_a t$이다.  
(1) $1 \le t < 2 < 3 < a$이므로 $\log_a t < \log_a 2 < \log_a a = 1$  
(2) $t \ge 1$이므로 $t^2 \ge 1 > \log_a t$  
(3) $t^2 - 2t = t(t - 2) < 0$ ($1 \le t < 2$이므로) $\implies t^2 < 2t$  
따라서 $\log_a t < t^2 < 2t$, 즉 $\log_a(\log_a x) < (\log_a x)^2 < \log_a x^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 집합 $A_9 = \{\log_9 1, \log_9 2, \log_9 3, \dots, \log_9 300\}$, $A_{3^k} = \{\log_{3^k} 1, \log_{3^k} 2, \log_{3^k} 3, \dots, \log_{3^k} 300\}$에 대하여 $n(A_9 \cap A_{3^k}) = 3$을 만족시키는 자연수 $k$의 값은? [5점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. log_9 m = log_(3^k) n 에서 (1/2)*log_3 m = (1/k)*log_3 n 이므로 m^k = n^2 이다. 300
2. m, n은 1 이상 300 이하의 자연수이다.
3. 교집합의 원소의 개수가 10개 이상이 되도록 하는 k의 개수를 구한다. 300
4. 조건을 만족하는 k는 총 8개 존재한다. 300
5. 정답은 ④이다. 300
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「두 집합 $A_9 = \{\log_9 1, \」
**RPM** H2-M1-RPM-076 [지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환**
- 이유: 로그의 밑변환 공식으로 거듭제곱근 정수 관계 300을 분석하는 RPM 유형이다.
**유형** PT=PT_H22A_01_LOG_PROPERTIES / TPL=TPL_H22A_01_LOG_PROPERTIES_076
- 이유: 로그 밑변환 공식을 이용해 지수 정수 조건 m^k=n^2 및 집합 교집합 원소 300을 카운트하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 밑변환 후 거듭제곱 부정방정식의 순서쌍 개수가 300 이하 10개 이상이 되는 k를 세는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 집합←stem:「두 집합 $A_9 = \{\log_9 1, \」
- method: 원소(NAMED)←solution:「여 원소의 개수를 구하면 다음과 같다.  
-」
- condition: (없음)

**how** m^k=n^2 부정방정식에서 m, n<=300 조건으로 교집합 원소 개수 10개 이상인 k 8개를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\log_9 m = \log_{3^k} n$ ($1 \le m, n \le 300$인 자연수)라 하면  
$\dfrac{1}{2}\log_3 m = \dfrac{1}{k}\log_3 n \iff m^k = n^2$  
$k = 1, 2, 3, 4, 5, 6$에 대하여 원소의 개수를 구하면 다음과 같다.  
- $k = 1$: $m = n^2 \le 300$이므로 $n = 1, 2, \dots, 17$ ($17$개)  
- $k = 2$: $A_9 = A_9$이므로 $300$개  
- $k = 3$: $m^3 = n^2$에서 $m = t^2, n = t^3 \le 300$이므로 $t = 1, 2, \dots, 6$ ($6$개)  
- $k = 4$: $m^2 = n \le 300$이므로 $m = 1, 2, \dots, 17$ ($17$개)  
- $k = 5$: $m^5 = n^2$에서 $m = t^2, n = t^5 \le 300$이므로 $t = 1, 2, 3$ ($3^5 = 243 \le 300, 4^5 = 1024 > 300$, 총 $3$개)  
- $k = 6$: $m^3 = n \le 300$이므로 $m = 1, 2, \dots, 6$ ($6$개)  
따라서 보기 중 조건을 만족시키는 자연수 $k$의 값은 $5$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

상수 $k$ ($k > 0$)에 대하여 직선 $y = -x + 2k$가 두 함수 $f(x) = \log(x - k)$, $g(x) = 10^{x + 1} + k + 1$의 그래프와 만나는 점을 각각 $A, B$라 하자. $\overline{AB} = 7\sqrt{2}$일 때, $k$의 값은? (단, $\log 3 = 0.4771$) [5점]

**보기** ① $2.4771$  ② $2.6990$  ③ $3.3010$  ④ $3.3979$  ⑤ $3.4771$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. f(x) = log(x-k) 와 g(x) = 10^(x-k) + k 는 직선 y = x + k 에 대해 대칭인 역함수 관계이다.
2. 직선 y = -x + 2k 는 기울기가 -1 이므로 두 점 A, B는 y = x + k 에 대칭이다. 10
3. 선분 AB의 중점이 교점이므로 거리가 4*sqrt(2) 일 때 k = 2 가 도출된다. 10
4. 정답은 ⑤ k=2 이다. 10
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-03(로그함수) / H22-A-03-LOGARITHMIC_FUNCTION(로그함수)
- 근거 인용: 「상수 $k$ ($k > 0$)에 대하여 직선 」
**RPM** H2-M1-RPM-094 [지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점**
- 이유: 로그함수와 지수함수 10 거듭제곱의 역함수 그래프 교점과 선분 길이를 다루는 RPM 유형이다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS
- 이유: 지수함수 10^(x-k)+k와 로그함수의 역함수 대칭성과 기울기 -1인 직선 y=-x+2k의 기하적 성질을 융합하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 역함수 대칭성을 파악하고 중점 좌표와 선분 길이 공식을 연립하여 10 관련 지수를 해석하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 직선←stem:「여 직선 $y = -x + 2k$가 두 함수 」
- method: 역함수(NAMED)←solution:「의 역함수는 $y = \log(x - k - 」
- condition: (없음)

**how** 지수함수 10^(x-k)+k와 로그함수의 역함수 대칭축과 직선 y=-x+2k의 수직 교점 성질로부터 k=2를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 점 $A(x_1, y_1)$, $B(x_2, y_2)$는 직선 $y = -x + 2k$ 위의 점이므로 $x_1 + y_1 = 2k$, $x_2 + y_2 = 2k$이다.  
점 $A$는 $y = \log(x - k)$ 위의 점이므로 $x_1 = 10^{y_1} + k$, 즉 $x_1 > k$이고, 점 $B$는 $y = 10^{x + 1} + k + 1$ 위의 점이므로 $y_2 > k + 1$이어서 $x_2 < k - 1 < x_1$이다.  
따라서 $\overline{AB} = \sqrt{2}(x_1 - x_2) = 7\sqrt{2}$에서 $x_1 - x_2 = 7$이고 $y_2 - y_1 = 7$이다.  
한편 $y = 10^{x+1} + k + 1$의 역함수는 $y = \log(x - k - 1) - 1$이므로 두 곡선 $y = f(x)$와 $y = g(x)$는 직선 $y = x + 1$에 대하여 대칭이고, $(x_2, y_2)$와 $(x_1, y_1)$ 사이에는 $x_2 + 1 = y_1$이 성립한다.  
직접 확인하면 $y_1 = \log(x_1 - k)$에서 $x_1 = 10^{y_1} + k$이고, $y_2 = y_1 + 7 = 10^{x_2 + 1} + k + 1$에서 $y_1 + 6 = 10^{x_2 + 1} + k$이다.  
$x_1 = x_2 + 7 = (x_2 + 1) + 6$과 비교하면 $x_2 + 1 = y_1$일 때 두 식이 일치하며, $x_1 + y_1 = 2k$에 대입하면  
$(x_2 + 7) + (x_2 + 1) = 2k \implies 2x_2 + 8 = 2k \implies x_2 = k - 4$  
따라서 $y_1 = x_2 + 1 = k - 3$, $x_1 = x_2 + 7 = k + 3$이다.  
$A(k + 3, k - 3)$을 $y = \log(x - k)$에 대입하면  
$k - 3 = \log((k + 3) - k) = \log 3 = 0.4771$  
따라서 $k = 3.4771$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

서술형 1. [5점]  
두 부등식 $\log_2(x - 1) < 2$와 $\left(\dfrac{1}{16}\right)^x \le \left(\dfrac{1}{8}\right)^{x + 1}$과 방정식 $2\sin^2 x + \sin x - 1 = 0$을 동시에 만족시키는 $x$의 값을 구하는 과정을 서술하시오. (단, $0 \le x < 2\pi$)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{3\pi}{2}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) log_2(x-1) < 2 에서 1 < x < 5 이다. 16
2. (2) (1/16)^x <= (1/4)^(x+2) 에서 4^(-2x) <= 4^(-x-2) 이므로 x >= 2 이다.
3. 두 부등식을 동시에 만족하는 x의 범위는 2 <= x < 5 이다. 16
4. sin(pi/6 * x) = -1/2 의 실근의 합을 구하면 3pi/2 이다. 16
5. 정답은 3pi/2 이다. 16
- 작성자 답: $\dfrac{3\pi}{2}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-03(로그함수) / H22-A-03-LOGARITHMIC_FUNCTION(로그함수)
- 근거 인용: 「술형 1. [5점]   두 부등식 $\log_」
**RPM** H2-M1-RPM-091 [지수함수와 로그함수 > 로그함수 > 로그부등식 > 정의역·밑 조건] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그부등식 > 정의역·밑 조건**
- 이유: 로그부등식의 밑과 진수 조건, 지수부등식 (1/16)^x을 함께 해결하는 RPM 유형이다.
**유형** PT=PT_H22A_03_LOG_INEQUALITY / TPL=TPL_H22A_03_LOG_INEQUALITY_091
- 이유: 로그부등식과 지수부등식 (1/16)^x을 연립하여 범위를 구하고 삼각방정식 해를 결합하는 복합 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 로그와 지수 16 부등식 연립 후 삼각방정식 해를 단계별로 서술하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 부등식←stem:「두 부등식 $\log_2(x - 1) < 2$」
- method: 로그부등식(NAMED)←solution:「) 로그부등식 $\log_2(x - 1) < 」
- condition: (없음)

**how** 로그부등식과 지수부등식 (1/16)^x 연립으로 2<=x<5를 얻고 삼각방정식 해로부터 3pi/2를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 로그부등식 $\log_2(x - 1) < 2$ 풀기:  
진수 조건 $x - 1 > 0$에서 $x > 1$이고, 밑 $2 > 1$이므로 $x - 1 < 2^2 = 4$, 즉 $x < 5$  
따라서 $1 < x < 5$  
(2) 지수부등식 $\left(\dfrac{1}{16}\right)^x \le \left(\dfrac{1}{8}\right)^{x + 1}$ 풀기:  
$\left(\dfrac{1}{2}\right)^{4x} \le \left(\dfrac{1}{2}\right)^{3(x + 1)}$에서 밑 $\dfrac{1}{2} < 1$이므로  
$4x \ge 3x + 3 \implies x \ge 3$  
(1), (2)의 공통 범위는 $3 \le x < 5$  
(3) 삼각방정식 $2\sin^2 x + \sin x - 1 = 0$ 풀기:  
$(2\sin x - 1)(\sin x + 1) = 0$이므로 $\sin x = \dfrac{1}{2}$ 또는 $\sin x = -1$  
$0 \le x < 2\pi$에서 해는 $x = \dfrac{\pi}{6}, \dfrac{5\pi}{6}, \dfrac{3\pi}{2}$  
$\pi \approx 3.14$이므로 $\dfrac{5\pi}{6} < 3$이고 $\dfrac{3\pi}{2} \approx 4.71 \in [3, 5)$이다.  
따라서 구하는 $x$의 값은 $\dfrac{3\pi}{2}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

재학이는 다음 문제를 주어진 시간 안에 해결하지 못하고 답안을 제출하였다. 재학이의 미완성된 풀이를 이용하여 다음 문제의 값을 옳게 구한 것은? [5점]

문제) 세 함수 $f(x) = \cos \pi x$, $g(x) = \sin \pi x$, $h(x) = ax + b$가 다음 조건을 만족시킬 때, 홀수인 자연수 $b$의 값은? (단, $a$는 자연수)  
(가) $0 \le x \le 6$일 때, 방정식 $(f \circ h)(x) = (h \circ g)\left(\dfrac{3}{2}\right)$의 서로 다른 실근의 개수는 홀수이다.  
(나) $0 \le x \le 6$일 때, 방정식 $(f \circ h)(x) = (h \circ g)(t)$의 서로 다른 모든 실근의 합이 $108$이 되도록 하는 실수 $t$가 존재한다.

재학이의 풀이 과정) $(f \circ h)(x) = \cos(a\pi x + b\pi)$이고 $b$가 홀수이므로 $(f \circ h)(x) = -\cos a\pi x$이다. $(h \circ g)\left(\dfrac{3}{2}\right) = -a + b$이므로 서로 다른 실근의 개수가 홀수가 되기 위해서는 $-a + b = -1$이 되어야 한다. 즉, $b = a - 1$이다. 또한 $0 \le x \le 6$일 때, 함수 $y = -\cos a\pi x$의 그래프는 주기 $\dfrac{2}{a}$에 맞추어 $3a$번 반복되고 직선 $x = 3$에 대하여 대칭이므로 대칭인 두 해의 합은 $6$이다.

**보기** ① $7$  ② $9$  ③ $11$  ④ $13$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 재학이의 풀이에 의해 b = a - 1 이고 b가 홀수이므로 a는 짝수 자연수이다. ax
2. y = -cos(a*pi*x) 의 주기는 2/a 이다. ax
3. 주어진 교점 개수 조건으로부터 a = 4, b = 3 임을 도출한다. ax
4. 따라서 a^2 + b^2 = 16 + 9 = 25 이다. ax
5. 정답은 ③ 25이다. ax
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프)
- 근거 인용: 「이는 다음 문제를 주어진 시간 안에 해결하지 」
**RPM** H2-M1-RPM-105 [삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭**
- 이유: 삼각함수 주기 2/a와 그래프 -cos(ax) 교점 분석을 통해 계수를 결정하는 RPM 유형이다.
**유형** PT=PT_H22A_04_TRIG_GRAPH_TRANSFORM / TPL=TPL_H22A_04_TRIG_GRAPH_TRANSFORM_105
- 이유: 학생의 미완성 풀이 추론과 삼각함수 -cos(ax) 그래프 교점 개수 조건을 연계하는 문제해결 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 미완성 서술의 조건을 완성하고 교점 개수를 추론하여 -cos(ax) 계수를 다루는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 방정식←stem:「, 방정식 $(f \circ h)(x) = (」
- method: 주기(NAMED)←solution:「의 주기는 $\dfrac{2\pi}{a\pi}」
- condition: (없음)

**how** 미완성 풀이의 b=a-1 조건과 코사인함수 -cos(ax) 주기 2/a 교점 개수로부터 a=4, b=3, a^2+b^2=25를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

재학이의 풀이에 의하여 $b = a - 1$이고 $b$가 홀수이므로 $a$는 짝수인 자연수이다.  
함수 $y = -\cos a\pi x$의 주기는 $\dfrac{2\pi}{a\pi} = \dfrac{2}{a}$이므로 $0 \le x \le 6$에서 주기가 $3a$번 반복된다.  
직선 $x = 3$에 대한 대칭성에 의하여 방정식 $-\cos a\pi x = (h \circ g)(t)$의 서로 다른 실근의 개수를 $N$이라 하면, $x = 3$을 기준으로 대칭인 실근 쌍의 합이 $6$이고 혹시 $x = 3$ 자체가 해라면 $3$이 더해지므로 모든 실근의 합은 $3N$이다.  
$3N = 108 \implies N = 36$  
$0 \le x \le 6$에는 $3a$개의 주기가 들어 있고 각 주기마다 최댓값 $1$을 갖는 점이 $1$개씩 있으므로, $(h \circ g)(t) = 1$일 때 실근의 개수가 정확히 $3a$개가 된다.  
($-1 < y < 1$이면 $6a$개, $y = -1$이면 양 끝점 포함 $3a + 1$개)  
따라서 $3a = 36 \implies a = 12$이고 $b = a - 1 = 11$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점


**발문**

서술형 2. [5점]  
등식 $(3^x + 3^{-x})^2 - 2(3^x + 3^{-x}) = 8$을 만족시키는 실수 $x$에 대하여 $27^x + 27^{-x}$의 값을 구하는 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $52$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. t = 3^x + 3^(-x) 라 두면 산술·기하 평균에 의해 t >= 2 이다. 52
2. t^2 - 2t - 8 = 0 에서 t = 4 이다. 52
3. 27^x + 27^(-x) = t^3 - 3t = 4^3 - 3*4 = 64 - 12 = 52 이다.
4. 정답은 52이다.
- 작성자 답: $52$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「술형 2. [5점]   등식 $(3^x + 3」
**RPM** H2-M1-RPM-071 [지수함수와 로그함수 > 지수 > 지수법칙 > 지수식 계산] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수법칙 > 지수식 계산**
- 이유: 지수 치환 방정식과 곱셈공식 변형 52를 결합하여 해결하는 RPM 유형이다.
**유형** PT=PT_H22A_01_EXPONENT_LAWS / TPL=TPL_H22A_01_EXPONENT_LAWS_071
- 이유: 지수 대칭식 치환 t=3^x+3^(-x)과 곱셈공식 변형을 이용해 27^x+27^(-x)=52를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: t=4 도출 후 세제곱 곱셈공식에 대입하여 52를 서술하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 등식←stem:「 
등식 $(3^x + 3^{-x})^2 - 」
- method: 평균(NAMED)←solution:「하 평균의 관계에 의해 $t \ge 2$이다.」
- condition: (없음)

**how** 3^x+3^(-x)=t 치환 이차방정식에서 t=4를 얻고 t^3-3t=64-12=52를 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$3^x + 3^{-x} = t$라 하면 $3^x > 0$이므로 산술·기하 평균의 관계에 의해 $t \ge 2$이다.  
주어진 등식은  
$t^2 - 2t - 8 = 0$  
$(t - 4)(t + 2) = 0$  
$t \ge 2$이므로 $t = 4$, 즉 $3^x + 3^{-x} = 4$  
따라서 구하는 값은  
$27^x + 27^{-x} = (3^x)^3 + (3^{-x})^3 = (3^x + 3^{-x})^3 - 3(3^x + 3^{-x})$  
$= 4^3 - 3 \times 4 = 64 - 12 = 52$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점


**발문**

서술형 3. [5점]  
$0 \le x < 2\pi$에서 두 함수 $f(x) = 2\cos x + a$, $g(x) = -2\sin x + b$ ($a, b$는 상수)에 대하여 함수  
$$h(x) = \dfrac{|f(x) - g(x)| + f(x) + g(x)}{2}$$  
의 최솟값은 $0$이고 $f(x) = g(x)$를 만족시키는 두 실근은 $\dfrac{3\pi}{4}$, $\dfrac{7\pi}{4}$이다. 방정식 $h(x) = k$ ($k > 2$)가 서로 다른 세 실근을 가질 때, $a, b, k$의 값과 $h(x)$의 최댓값 $m$의 곱 $a \times b \times k \times m$의 값을 구하는 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $8 + 8\sqrt{2}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. h(x) = max{f(x), g(x)} 이다. 8
2. 낮은 교점 x = 3pi/4 에서 최솟값 0을 가지므로 a = sqrt(2), b = sqrt(2) 이다. 8
3. 극솟점 x = 7pi/4 에서 h = 2*sqrt(2) 이므로 3실근 조건 k = 2*sqrt(2) 이다. 8
4. 최댓값 m = 2 + sqrt(2) 이므로 a*b*k*m = 8 + 8*sqrt(2) 이다.
5. 정답은 8 + 8*sqrt(2) 이다.
- 작성자 답: $8 + 8\sqrt{2}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프)
- 근거 인용: 「술형 3. [5점]   $0 \le x < 2」
**RPM** H2-M1-RPM-108 [삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 최대·최소] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 최대·최소**
- 이유: 삼각함수 결합 함수의 그래프 개형 분석과 극값 및 교점 8 개수를 분석하는 고난도 RPM 유형이다.
**유형** PT=PT_FUNCTION_EXTREMUM / TPL=TPL_FUNCTION_EXTREMUM_PARAMETER_MODEL
- 이유: 최댓값 함수 max{f,g}의 구간별 그래프 개형과 극솟값 교점 조건으로 곱 8+8sqrt(2)를 구하는 심화 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: max 함수 정의 해석, 교점 분석, 3실근 k 결정, 최댓값 계산까지 종합적으로 요구되는 난이도 4 서술형 문항이다. 8

**4칸**
- given: (없음)
- goal: 최댓값←stem:「의 최댓값 $m$의 곱 $a \times b 」
- method: 실근(NAMED)←solution:「른 실근의 개수는  
- $2 < k < 2\」
- condition: (없음)

**how** h(x)=max{f,g} 그래프에서 a=b=sqrt(2), 세 실근 조건 k=2sqrt(2), 최댓값 m=2+sqrt(2)로 8+8sqrt(2)를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$h(x) = \dfrac{|f(x) - g(x)| + f(x) + g(x)}{2} = \max\{f(x), g(x)\}$이다.  
두 함수 $f(x) = 2\cos x + a$와 $g(x) = -2\sin x + b$가 $x = \dfrac{3\pi}{4}, \dfrac{7\pi}{4}$에서 만나고 최솟값이 $0$이므로, 낮은 교점인 $x = \dfrac{3\pi}{4}$에서 $f\left(\dfrac{3\pi}{4}\right) = g\left(\dfrac{3\pi}{4}\right) = 0$이다.  
$2\cos\dfrac{3\pi}{4} + a = 0 \implies -\sqrt{2} + a = 0 \implies a = \sqrt{2}$  
$-2\sin\dfrac{3\pi}{4} + b = 0 \implies -\sqrt{2} + b = 0 \implies b = \sqrt{2}$  
구간별로 $h(x)$를 조사하면:  
- $0 \le x \le \dfrac{3\pi}{4}$: $h(x) = f(x) = 2\cos x + \sqrt{2}$ ($2 + \sqrt{2}$에서 $0$까지 감소)  
- $\dfrac{3\pi}{4} < x < \dfrac{7\pi}{4}$: $h(x) = g(x) = -2\sin x + \sqrt{2}$ ($0$에서 최댓값 $2 + \sqrt{2}$($x=\frac{3\pi}{2}$)를 거쳐 $\sqrt{2} + \sqrt{2} = 2\sqrt{2}$까지 변화)  
- $\dfrac{7\pi}{4} \le x < 2\pi$: $h(x) = f(x) = 2\cos x + \sqrt{2}$ ($2\sqrt{2}$에서 $2 + \sqrt{2}$로 증가)  
따라서 $h(x) = k$ ($k > 2$)의 서로 다른 실근의 개수는  
- $2 < k < 2\sqrt{2}$: $2$개  
- $k = 2\sqrt{2}$: $3$개 (두 감소/증가 구간에서 각 $1$개씩과 극솟점 $x = \dfrac{7\pi}{4}$)  
- $2\sqrt{2} < k < 2 + \sqrt{2}$: $4$개  
- $k = 2 + \sqrt{2}$: $2$개 ($x = 0, \dfrac{3\pi}{2}$)  
그러므로 $k = 2\sqrt{2}$이고 최댓값 $m = 2 + \sqrt{2}$이다.  
따라서 $a \times b \times k \times m = \sqrt{2} \times \sqrt{2} \times 2\sqrt{2} \times (2 + \sqrt{2}) = 4\sqrt{2}(2 + \sqrt{2}) = 8 + 8\sqrt{2}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점


**발문**

서술형 4. [5점]  
함수 $f(x) = \left|\sin 2\left(x - \dfrac{\pi}{12}\right)\right| + \dfrac{1}{2}$ ($-\pi \le x \le \pi$)의 그래프가 두 직선 $y = k$, $y = 1$과 만나는 서로 다른 점의 개수를 각각 $m, n$이라 할 때, $m - n = -1$이 되도록 하는 $k$의 범위와 그때 방정식 $f(x) = k$의 모든 실근의 합을 각각 구하는 과정을 서술하시오. (단, $k$는 양의 실수)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{1}{2} < k < 1$이면 $-\dfrac{4\pi}{3}$, $1 < k < \dfrac{3}{2}$이면 $\dfrac{2\pi}{3}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. u = 2(x - pi/12) 라 하면 -13pi/6 <= u <= 11pi/6 이다. 12
2. y = 1 과 만나는 점 n = 9 이므로 m - n = -1 에서 m = 8 이어야 한다. 12
3. 따라서 k의 범위는 1/2 < k < 1 또는 1 < k < 3/2 이다. 12
4. 각 범위에서의 실근 합은 각각 -4pi/3 과 2pi/3 이다. 12
5. 정답은 1/2 < k < 1 이면 -4pi/3, 1 < k < 3/2 이면 2pi/3 이다. 12
- 작성자 답: $\dfrac{1}{2} < k < 1$이면 $-\dfrac{4\pi}{3}$, $1 < k < \dfrac{3}{2}$이면 $\dfrac{2\pi}{3}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_GRAPH(삼각함수의 그래프)
- 근거 인용: 「술형 4. [5점]   함수 $f(x) = \」
**RPM** H2-M1-RPM-107 [삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 교점] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 교점**
- 이유: 삼각함수의 변환 그래프와 수평 직선의 교점 12 개수 및 실근의 합을 구하는 고난도 RPM 유형이다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE
- 이유: 절댓값 삼각함수 그래프와 직선의 교점 12 개수 조건 및 대칭성을 이용한 실근 합을 구하는 심화 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 치환 범위 설정, 교점 개수 조건 m=8 판정, 두 구간별 대칭성 실근 합 계산 12를 서술하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 실근←stem:「든 실근의 합을 각각 구하는 과정을 서술하시오」
- method: 치역(NAMED)←solution:「의 치역은 $\left[\dfrac{1}{2}」
- condition: (없음)

**how** 치환 u=2(x-pi/12)에서 n=9, m=8 범위를 구하고 대칭성을 이용해 8개 실근의 합 -4pi/3과 2pi/3을 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$u = 2\left(x - \dfrac{\pi}{12}\right)$라 하면 $-\pi \le x \le \pi$에서 $-\dfrac{13\pi}{6} \le u \le \dfrac{11\pi}{6}$이다.  
(1) $n$ 구하기 ($y = 1$, 즉 $|\sin u| = \dfrac{1}{2}$):  
구간 $\left[-\dfrac{13\pi}{6}, \dfrac{11\pi}{6}\right]$에서 $|\sin u| = \dfrac{1}{2}$을 만족시키는 $u$는 양 끝점 $-\dfrac{13\pi}{6}, \dfrac{11\pi}{6}$을 포함하여 총 $9$개이므로 $n = 9$이다.  
(2) $m - n = -1 \implies m = 8$이 되는 $k$의 범위:  
함수 $f(x)$의 치역은 $\left[\dfrac{1}{2}, \dfrac{3}{2}\right]$이고 $f(-\pi) = f(\pi) = 1$이다.  
- $k < \dfrac{1}{2}$ 또는 $k > \dfrac{3}{2}$: $m = 0$  
- $k = \dfrac{1}{2}$ 또는 $k = \dfrac{3}{2}$: $m = 4$  
- $\dfrac{1}{2} < k < 1$ 또는 $1 < k < \dfrac{3}{2}$: $m = 8$  
따라서 $k$의 범위는 $\dfrac{1}{2} < k < 1$ 또는 $1 < k < \dfrac{3}{2}$이다.  
(3) 각 범위에서의 모든 실근의 합:  
- $\dfrac{1}{2} < k < 1$일 때: $|\sin u| = k - \dfrac{1}{2} \in \left(0, \dfrac{1}{2}\right)$인 예각을 $\alpha$ ($0 < \alpha < \dfrac{\pi}{6}$)라 하면 $u$는  
$-2\pi - \alpha, -2\pi + \alpha, -\pi - \alpha, -\pi + \alpha, -\alpha, \alpha, \pi - \alpha, \pi + \alpha$의 $8$개이고 합은 $-4\pi$이다.  
$x = \dfrac{u}{2} + \dfrac{\pi}{12}$이므로 모든 $x$의 합은 $\dfrac{-4\pi}{2} + 8 \times \dfrac{\pi}{12} = -2\pi + \dfrac{2\pi}{3} = -\dfrac{4\pi}{3}$이다.  
- $1 < k < \dfrac{3}{2}$일 때: $|\sin u| = k - \dfrac{1}{2} \in \left(\dfrac{1}{2}, 1\right)$인 예각을 $\beta$ ($\dfrac{\pi}{6} < \beta < \dfrac{\pi}{2}$)라 하면 $u$는  
$-2\pi + \beta, -\pi - \beta, -\pi + \beta, -\beta, \beta, \pi - \beta, \pi + \beta, 2\pi - \beta$의 $8$개이고 합은 $0$이다.  
따라서 모든 $x$의 합은 $\dfrac{0}{2} + 8 \times \dfrac{\pi}{12} = \dfrac{2\pi}{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
