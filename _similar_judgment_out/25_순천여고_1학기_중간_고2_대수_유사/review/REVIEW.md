# 검수 묶음 — 25_순천여고_1학기_중간_고2_대수_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 6)**
- 문항 23개 / 검사 PASS 17, FAIL 6, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 1, 2단계 12, 3단계 7, 4단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 검사 코드: CHOICE_ORDER
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q5**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q6**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q7**: 검사 코드: CHOICE_ORDER
- **Q9**: 검사 코드: CHOICE_ORDER
- **Q12**: 검사 코드: CHOICE_ORDER
- **Q15**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q21**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q22**: 원천 값과 다른 칸 2개 (RPM, 난이도)

---
## Q1 — 객관식 3.3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$3^{2\sqrt{2}} \times 3^{4 - 2\sqrt{2}}$의 값은? [3.3점]

**보기** ① $81$  ② $27$  ③ $9$  ④ $3$  ⑤ $243$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $3^{2\sqrt{2}} \times 3^{4 - 2\sqrt{2}}$ 에 밑이 같은 지수법칙을 적용한다 (배점 3.3점).
2. $3^{2\sqrt{2} + (4 - 2\sqrt{2})} = 3^4 = 81$ 이다.
3. 따라서 정답은 ① ($81$)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — $3^{2\sqrt{2}} \times 3^{4 - 2\sqrt{2}}$의 값은?

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「지수법칙에 의하여」
**RPM** H2-M1-RPM-070 [지수함수와 로그함수 > 지수 > 지수의 확장 > 실수 지수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수의 확장 > 실수 지수**
- 이유: 실수 지수가 포함된 지수식의 곱셈 계산을 다루므로 H2-M1-RPM-070 지수의 확장 > 실수 지수 레코드에 해당한다 (값 81, 배점 3.3점).
**유형** PT=PT_H22A_01_EXPONENT_EXTENSION / TPL=TPL_H22A_01_EXPONENT_EXTENSION_070
- 이유: 실수 범위로 확장된 지수의 성질을 이용하여 식을 간단히 정리하는 유형이다 (값 81, 배점 3.3점).
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지수의 기본 성질을 공식에 바로 대입하여 간단히 한 줄로 풀리는 난이도 1 문항이다 (값 81, 배점 3.3점).

**4칸**
- given: 지수←solution:「지수법칙에 의하여」
- goal: 법칙←solution:「지수법칙에 의하여」
- method: 지수법칙(NAMED)←solution:「지수법칙에 의하여」
- condition: 지수←solution:「지수법칙에 의하여」

**how** 밑이 3으로 같은 지수식을 더하여 $3^4 = 81$ 로 계산해 정답 ①로 판정했다 (배점 3.3점).

<details><summary>저장 해설 (판정 검토용)</summary>

지수법칙에 의하여  
$3^{2\sqrt{2}} \times 3^{4 - 2\sqrt{2}} = 3^{2\sqrt{2} + (4 - 2\sqrt{2})} = 3^4 = 81$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.4점


**발문**

다음 방정식 $\log_3(x - 4) + \log_3(x + 4) = 2$의 해를 구하면? [3.4점]

**보기** ① $-5$  ② $-1$  ③ $5$  ④ $7$  ⑤ $9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 진수 조건: $x - 4 > 0$ 이고 $x + 4 > 0$ 이므로 $x > 4$ 이다 (배점 3.4점).
2. 로그의 성질: $\log_3(x - 4) + \log_3(x + 4) = \log_3(x^2 - 16) = 2$.
3. $x^2 - 16 = 3^2 = 9 \implies x^2 = 25 \implies x = 5$ (진수 조건 $x > 4$).
4. 따라서 정답은 ③ ($5$)이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 다음 방정식 $\log_3(x - 4) + \log_3(x + 4) = 2$의 해를 구하면?

**단원** H22-A-03(로그함수) / H22-A-03-LOGARITHMIC_FUNCTION(로그함수)
- 근거 인용: 「다음 방정식 $\log_3」
**RPM** H2-M1-RPM-089 [지수함수와 로그함수 > 로그함수 > 로그방정식 > 진수 조건] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그방정식 > 진수 조건**
- 이유: 로그방정식을 풀고 진수 조건을 통해 해를 한정하는 문제이므로 H2-M1-RPM-089 로그방정식 > 진수 조건에 해당한다 (식 $x^2 - 16 = 25$, 배점 3.4점).
**유형** PT=PT_H22A_03_LOG_EQUATION / TPL=TPL_H22A_03_LOG_EQUATION_089
- 이유: 로그의 덧셈 성질로 합쳐 이차방정식을 만들고 진수 조건을 적용하는 유형이다 (방정식 $x^2 - 16 = 25$, 배점 3.4점).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 로그의 합 공식과 진수 조건을 연립하여 이차방정식의 해를 선별하는 기본 난이도 2 문항이다 (식 $x^2 - 16 = 25$, 배점 3.4점).

**4칸**
- given: 방정식←stem:「다음 방정식 $\log_3」
- goal: 로그←solution:「> 4$   로그의 성질에 의하」
- method: 진수(NAMED)←solution:「진수 조건에 의하여」
- condition: 조건←solution:「진수 조건에 의하여 $x」

**how** 진수 조건 $x > 4$ 하에서 $x^2 - 16 = 9 \implies x^2 = 25$ 로 $x = 5$ 정답을 판정했다 (배점 3.4점).

<details><summary>저장 해설 (판정 검토용)</summary>

진수 조건에 의하여 $x - 4 > 0$이고 $x + 4 > 0$이므로 $x > 4$  
로그의 성질에 의하여  
$\log_3\{(x - 4)(x + 4)\} = 2$  
$x^2 - 16 = 3^2 = 9$  
$x^2 = 25$  
$x = \pm 5$  
진수 조건 $x > 4$에 의하여 $x = 5$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

함수 $y = \left(\dfrac{1}{3}\right)^x + 2$의 그래프를 $y$축에 대하여 대칭이동한 후 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동하였더니 함수 $y = 3^{x - 4} + 5$의 그래프와 일치하였다. 상수 $a, b$에 대하여 $ab$의 값은? [3.4점]

**보기** ① $-12$  ② $12$  ③ $7$  ④ $10$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 함수 $y = (1/3)^x + 2$ 를 $y$축 대칭이동하면 $y = 3^x + 2$ 이다 (상수 ab 계산, 배점 3.4점).
2. $x$축 방향으로 $a$만큼, $y$축 방향으로 $b$만큼 평행이동하면 $y = 3^{x - a} + 2 + b$.
3. 이 식이 $y = 3^{x - 4} + 5$ 와 일치하므로 $a = 4, 2 + b = 5 \implies b = 3$.
4. 따라서 $ab = 4 \times 3 = 12$ 이며 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 함수 $y = \left(\dfrac{1}{3}\right)^x + 2$의 그래프를 $y$축에 대하여 대칭이동한 후

**단원** H22-A-02(지수함수) / H22-A-02-EXPONENTIAL_FUNCTION(지수함수)
- 근거 인용: 「함수 $y = \l」
**RPM** H2-M1-RPM-080 [지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 평행이동] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 평행이동**
- 이유: 지수함수의 평행이동 및 대칭이동 식을 비교하는 레코드인 H2-M1-RPM-080 지수함수의 그래프 > 평행이동에 해당한다 (값 12, 상수 ab, 배점 3.4점).
**유형** PT=PT_FUNCTION_GRAPH_TRANSFORM / TPL=TPL_FUNCTION_GRAPH_TRANSLATION_REFLECTION
- 이유: 평행이동과 대칭이동을 결합하여 지수함수의 미정계수 $a, b$ 를 결정하는 유형이다 (값 12, 상수 ab, 배점 3.4점).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대칭이동과 평행이동의 식 변환 규칙을 그대로 적용해 계수를 비교하는 기본 난이도 2 문항이다 (값 12, 상수 ab, 배점 3.4점).

**4칸**
- given: 그래프←stem:「x + 2$의 그래프를 $y$축에」
- goal: 상수←stem:「일치하였다. 상수 $a, b$에」
- method: 대칭이동(NAMED)←solution:「$축에 대하여 대칭이동하면 $x$ 대」
- condition: 평행이동←solution:「로 $b$만큼 평행이동하면   $y」

**how** $y$축 대칭 및 평행이동식을 구하여 $a=4, b=3$ 을 얻고 $ab = 12$ 로 판정했다 (배점 3.4점).

<details><summary>저장 해설 (판정 검토용)</summary>

함수 $y = \left(\dfrac{1}{3}\right)^x + 2$의 그래프를 $y$축에 대하여 대칭이동하면 $x$ 대신 $-x$를 대입하므로  
$y = \left(\dfrac{1}{3}\right)^{-x} + 2 = 3^x + 2$  
이 그래프를 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동하면  
$y = 3^{x - a} + 2 + b$  
이 식이 $y = 3^{x - 4} + 5$와 일치하므로  
$a = 4$, $2 + b = 5 \implies b = 3$  
따라서 $ab = 4 \times 3 = 12$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.5점


**발문**

다음 중 그 값이 가장 큰 것은? [3.5점]

**보기** ① $\log_{\frac{1}{2}} 8$  ② $\log_3 \sqrt{27}$  ③ $\log_9 27$  ④ $\dfrac{1}{\log_{32} 2}$  ⑤ $9^{\log_3 4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 보기의 로그 및 거듭제곱 값을 계산한다 (배점 3.5점).
2. ① $\log_{1/2} 8 = -3$, ② $\log_3 \sqrt{27} = 3/2$, ③ $\log_9 27 = 3/2$.
3. ④ $1/\log_{32} 2 = \log_2 32 = 5$, ⑤ $9^{\log_3 4} = 4^{\log_3 9} = 4^2 = 16$.
4. 가장 큰 값은 ⑤ ($9^{\log_3 4} = 16$)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 다음 중 그 값이 가장 큰 것은?

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「따라서 가장 큰 것은 ⑤이다.」
**RPM** H2-M1-RPM-075 [지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱**
- 이유: 로그의 기본 성질 및 거듭제곱 성질로 식의 값을 계산하는 H2-M1-RPM-075 로그의 성질 > 곱·몫·거듭제곱에 해당한다 (값 16, 배점 3.5점).
**유형** PT=PT_H22A_01_LOG_PROPERTIES / TPL=TPL_H22A_01_LOG_PROPERTIES_075
- 이유: 다양한 로그의 성질과 거듭제곱의 성질을 적용하여 수의 대소를 비교하는 유형이다 (값 16, 배점 3.5점).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 보기 5개의 로그값을 각각 성질에 따라 계산하고 크기를 비교하는 기본 난이도 2 문항이다 (값 16, 배점 3.5점).

**4칸**
- given: 값←stem:「다음 중 그 값이 가장 큰 것은?」
- goal: 최대(IMPLIED)←solution:「따라서 가장 큰 것은 ⑤이다.」 — 보기 중 가장 큰 값을 선택하는 목표
- method: 로그(IMPLIED)←choices:「\log_3 \sqrt{27}」 — 로그의 성질을 이용하여 각 보기의 값을 계산
- condition: 비교(IMPLIED)←solution:「따라서 가장 큰 것은 ⑤이다.」 — 계산된 수들의 크기를 비교

**how** 다섯 보기의 값을 각각 계산하여 ⑤ $9^{\log_3 4} = 16$ 이 가장 큼을 확인하여 정답으로 판정했다 (배점 3.5점).

<details><summary>저장 해설 (판정 검토용)</summary>

① $\log_{\frac{1}{2}} 8 = \log_{2^{-1}} 2^3 = -3$  
② $\log_3 \sqrt{27} = \log_3 3^{\frac{3}{2}} = \dfrac{3}{2}$  
③ $\log_9 27 = \log_{3^2} 3^3 = \dfrac{3}{2}$  
④ $\dfrac{1}{\log_{32} 2} = \log_2 32 = \log_2 2^5 = 5$  
⑤ $9^{\log_3 4} = 4^{\log_3 9} = 4^2 = 16$  
따라서 가장 큰 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.6점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

각을 $360^\circ \times n + \alpha^\circ$ ($n$은 정수, $0^\circ \le \alpha^\circ < 360^\circ$)의 꼴로 나타낼 때, 다음 중 $\alpha$의 값이 가장 큰 것은? [3.6점]

**보기** ① $-1000^\circ$  ② $-400^\circ$  ③ $400^\circ$  ④ $-750^\circ$  ⑤ $1000^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 각도를 $360^\circ \times n + \alpha^\circ$ ($0 \le \alpha < 360$) 꼴로 바꾼다 (배점 3.6점).
2. ① $-1000^\circ = 360^\circ \times (-3) + 80^\circ \implies \alpha = 80$.
3. ② $-400^\circ = 360^\circ \times (-2) + 320^\circ \implies \alpha = 320$.
4. ③ $400^\circ = 360^\circ \times 1 + 40^\circ \implies \alpha = 40$.
5. ④ $-750^\circ = 360^\circ \times (-3) + 330^\circ \implies \alpha = 330$.
6. ⑤ $1000^\circ = 360^\circ \times 2 + 280^\circ \implies \alpha = 280$. $\alpha$가 가장 큰 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 각을 $360^\circ \times n + \alpha^\circ$ ($n$은 정수, $0^\circ \le \alpha^\circ < 360^\circ$)의 꼴로 나타낼 때

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「각을 $360^\circ」
**RPM** H2-M1-RPM-095 [삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각**
- 이유: 음의 각과 양의 각을 360n + 알파의 일반각 형태로 변환하는 H2-M1-RPM-095 일반각과 호도법 > 일반각에 해당한다 (값 360, 배점 3.6점).
**유형** PT=PT_H22A_04_ANGLE_RADIAN / TPL=TPL_H22A_04_ANGLE_RADIAN_095
- 이유: 각의 회전수를 정수 n으로 분리하고 $0 \le \alpha < 360$ 범위의 최소 양의 각을 비교하는 유형이다 (값 360, 배점 3.6점).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 360도로 나눈 나머지를 음의 각에 대해 올바르게 계산하는 기본 계산 문항이다 (값 360, 배점 3.6점).

**4칸**
- given: 정수←stem:「$ ($n$은 정수, $0^\ci」
- goal: 최대(IMPLIED)←solution:「alpha$의 값이 가장 큰 것은 ④이다.」 — 알파값이 가장 큰 보기를 구하는 목표
- method: 일반각(IMPLIED)←solution:「꼴로 나타내면」 — 360n + 알파 꼴로 변환하는 일반각 방법
- condition: 정수←stem:「$ ($n$은 정수, $0^\ci」

**how** 각 보기를 360도 배수로 나누어 나머지 $\alpha$를 구하고 ④ $-750^\circ$ 의 $\alpha = 330$ 이 최대임을 판정했다 (배점 3.6점).

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 $360^\circ \times n + \alpha^\circ$ ($0^\circ \le \alpha^\circ < 360^\circ$) 꼴로 나타내면  
① $-1000^\circ = 360^\circ \times (-3) + 80^\circ \implies \alpha = 80$  
② $-400^\circ = 360^\circ \times (-2) + 320^\circ \implies \alpha = 320$  
③ $400^\circ = 360^\circ \times 1 + 40^\circ \implies \alpha = 40$  
④ $-750^\circ = 360^\circ \times (-3) + 330^\circ \implies \alpha = 330$  
⑤ $1000^\circ = 360^\circ \times 2 + 280^\circ \implies \alpha = 280$  
따라서 $\alpha$의 값이 가장 큰 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$\sin\theta + \cos\theta = \dfrac{1}{3}$일 때, $\sin\theta\cos\theta$의 값은? [3.7점]

**보기** ① $-\dfrac{8}{9}$  ② $-\dfrac{4}{9}$  ③ $-\dfrac{2}{9}$  ④ $\dfrac{4}{9}$  ⑤ $\dfrac{8}{9}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\sin\theta + \cos\theta = 1/3$ 의 양변을 제곱한다 (배점 3.7점).
2. $\sin^2\theta + 2\sin\theta\cos\theta + \cos^2\theta = (1/3)^2 = 1/9$.
3. $\sin^2\theta + \cos^2\theta = 1$ 이므로 $1 + 2\sin\theta\cos\theta = 1/9$.
4. $2\sin\theta\cos\theta = -8/9 \implies \sin\theta\cos\theta = -4/9$.
5. 따라서 정답은 ② ($-\dfrac{4}{9}$)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — $\sin\theta + \cos\theta = \dfrac{1}{3}$일 때, $\sin\theta\cos\theta$의 값은?

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「\sin\theta + \cos\theta」
**RPM** H2-M1-RPM-100 [삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계**
- 이유: 합과 곱의 관계를 제곱 공식으로 변환하는 H2-M1-RPM-100 삼각함수의 성질 > 삼각함수 관계 레코드에 해당한다 (배점 3.7점).
**유형** PT=PT_H22A_04_TRIG_PROPERTIES / TPL=TPL_H22A_04_TRIG_PROPERTIES_100
- 이유: 삼각함수 기본 항등식을 이용해 합으로부터 곱의 값을 도출하는 대표적인 곱셈공식 활용 유형이다 (배점 3.7점).
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 양변 제곱 후 $\sin^2\theta + \cos^2\theta = 1$ 대입으로 바로 풀리는 필수 기본 문항이다 (배점 3.7점).

**4칸**
- given: 거듭제곱←solution:「}$의 양변을 제곱하면   $\s」
- goal: 관계(IMPLIED)←solution:「cos\theta = -\dfrac{4}{9}」 — 사인과 코사인의 곱을 구함
- method: 거듭제곱(NAMED)←solution:「}$의 양변을 제곱하면   $\s」
- condition: 항등식(IMPLIED)←solution:「sin^2\theta + \cos^2\theta = 1」 — 삼각함수 기본 항등식 적용

**how** 합의 식 $\sin\theta + \cos\theta = 1/3$ 을 제곱하여 $\sin\theta\cos\theta = -4/9$ 를 도출하고 ②로 판정했다 (배점 3.7점).

<details><summary>저장 해설 (판정 검토용)</summary>

$\sin\theta + \cos\theta = \dfrac{1}{3}$의 양변을 제곱하면  
$\sin^2\theta + 2\sin\theta\cos\theta + \cos^2\theta = \dfrac{1}{9}$  
$\sin^2\theta + \cos^2\theta = 1$이므로  
$1 + 2\sin\theta\cos\theta = \dfrac{1}{9}$  
$2\sin\theta\cos\theta = -\dfrac{8}{9}$  
$\sin\theta\cos\theta = -\dfrac{4}{9}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

실수 $x$에 대하여 $\dfrac{a^x - a^{-x}}{a^x + a^{-x}} = \dfrac{1}{3}$일 때, $\dfrac{a^{2x} + a^{-2x}}{a^{2x} - a^{-2x}}$의 값은? (단, $a > 0$, $a \neq 1$) [3.8점]

**보기** ① $\dfrac{5}{3}$  ② $\dfrac{3}{5}$  ③ $\dfrac{4}{3}$  ④ $\dfrac{3}{4}$  ⑤ $\dfrac{5}{4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 주어진 분수식 $\dfrac{a^x - a^{-x}}{a^x + a^{-x}} = \dfrac{1}{3}$ 의 분모·분자에 $a^x$ 를 곱한다 (배점 3.8점).
2. $\dfrac{a^{2x} - 1}{a^{2x} + 1} = \dfrac{1}{3} \implies 3(a^{2x} - 1) = a^{2x} + 1 \implies 2a^{2x} = 4 \implies a^{2x} = 2$.
3. $a^{-2x} = 1/2$ 이므로 구하는 식에 대입한다.
4. $\dfrac{a^{2x} + a^{-2x}}{a^{2x} - a^{-2x}} = \dfrac{2 + 1/2}{2 - 1/2} = \dfrac{5/2}{3/2} = \dfrac{5}{3}$.
5. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 실수 $x$에 대하여 $\dfrac{a^x - a^{-x}}{a^x + a^{-x}} = \dfrac{1}{3}$일 때

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「실수 $x$에 대하」
**RPM** H2-M1-RPM-072 [지수함수와 로그함수 > 지수 > 지수법칙 > 조건식] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수법칙 > 조건식**
- 이유: 조건식을 통해 $a^{2x}$ 의 값을 구하고 목표 식에 대입하는 H2-M1-RPM-072 지수법칙 > 조건식에 해당한다 (배점 3.8점).
**유형** PT=PT_H22A_01_EXPONENT_LAWS / TPL=TPL_H22A_01_EXPONENT_LAWS_072
- 이유: 분모 분자에 적절한 거듭제곱을 곱해 짝수 거듭제곱의 값을 구하고 목표 식을 계산하는 유형이다 (배점 3.8점).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분모 분자에 $a^x$ 를 곱하는 전형적인 풀이 절차로 바로 답이 도출되는 난이도 2 문항이다 (배점 3.8점).

**4칸**
- given: 실수←stem:「실수 $x$에 대하」
- goal: 대입←solution:「구하는 식에 대입하면   $\d」
- method: 분모(NAMED)←solution:「주어진 식의 분모와 분자에 각각」
- condition: 분자←solution:「식의 분모와 분자에 각각 $a^」

**how** 분모와 분자에 $a^x$ 를 곱해 $a^{2x} = 2$ 를 구한 뒤 목적식에 대입하여 $5/3$ 으로 정답을 판정했다 (배점 3.8점).

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식의 분모와 분자에 각각 $a^x$을 곱하면  
$\dfrac{a^{2x} - 1}{a^{2x} + 1} = \dfrac{1}{3}$  
$3(a^{2x} - 1) = a^{2x} + 1$  
$2a^{2x} = 4 \implies a^{2x} = 2$  
$a^{-2x} = \dfrac{1}{2}$이므로 구하는 식에 대입하면  
$\dfrac{a^{2x} + a^{-2x}}{a^{2x} - a^{-2x}} = \dfrac{2 + \dfrac{1}{2}}{2 - \dfrac{1}{2}} = \dfrac{\dfrac{5}{2}}{\dfrac{3}{2}} = \dfrac{5}{3}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.8점


**발문**

함수 $f(x) = \log_3(x - a) + 3$의 역함수의 그래프가 점 $(a + 5, a + 3)$을 지날 때, $a$의 값은? (단, $a$는 상수이다.) [3.8점]

**보기** ① $-3$  ② $-2$  ③ $-1$  ④ $1$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y = f(x)$ 의 역함수 그래프가 $(a+5, a+3)$ 을 지나므로 $f(a+3) = a+5$ 이다 (배점 3.8점).
2. $f(x) = \log_3(x - a) + 3$ 에 $x = a+3$ 을 대입한다.
3. $\log_3((a+3) - a) + 3 = \log_3 3 + 3 = 1 + 3 = 4$.
4. $4 = a + 5 \implies a = -1$.
5. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 함수 $f(x) = \log_3(x - a) + 3$의 역함수의 그래프가 점 $(a + 5, a + 3)$을 지날 때

**단원** H22-A-03(로그함수) / H22-A-03-LOGARITHMIC_FUNCTION(로그함수)
- 근거 인용: 「함수 $f(x) =」
**RPM** H2-M1-RPM-088 [지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 평행이동] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 평행이동**
- 이유: 로그함수 그래프 위의 점의 좌표와 역함수 성질을 이용해 상수를 구하는 H2-M1-RPM-088 로그함수의 그래프 > 평행이동에 해당한다 (배점 3.8점).
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT
- 이유: 역함수의 성질 $f^{-1}(p)=q \iff f(q)=p$ 를 이용해 직접 역함수를 구하지 않고 푸는 유형이다 (배점 3.8점).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 역함수 정의를 적용하여 원래 함수에 점의 좌표를 대입하는 기본 난이도 2 문항이다 (배점 3.8점).

**4칸**
- given: 그래프←stem:「$의 역함수의 그래프가 점 $(a」
- goal: 상수←stem:「단, $a$는 상수이다.) [3.」
- method: 역함수(NAMED)←solution:「f(x)$의 역함수의 그래프가 점」
- condition: 대입←solution:「a + 3$을 대입하면   $\l」

**how** $f^{-1}(a+5)=a+3 \iff f(a+3)=a+5$ 관계를 활용해 $\log_3 3 + 3 = 4 = a+5$ 에서 $a=-1$ 로 판정했다 (배점 3.8점).

<details><summary>저장 해설 (판정 검토용)</summary>

$y = f(x)$의 역함수의 그래프가 점 $(a + 5, a + 3)$을 지나므로  
$f^{-1}(a + 5) = a + 3$, 즉 $f(a + 3) = a + 5$  
$f(x) = \log_3(x - a) + 3$에 $x = a + 3$을 대입하면  
$\log_3((a + 3) - a) + 3 = a + 5$  
$\log_3 3 + 3 = a + 5$  
$1 + 3 = a + 5$  
$a = -1$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3.9점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\theta$가 제$2$사분면의 각이고 $|\cos\theta - \sin\theta| - \sqrt{\cos^2\theta} = \dfrac{3}{5}$일 때, $\cos\theta$의 값은? [3.9점]

**보기** ① $-\dfrac{3}{5}$  ② $\dfrac{3}{5}$  ③ $\dfrac{4}{5}$  ④ $-\dfrac{4}{5}$  ⑤ $-\dfrac{4}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\theta$ 가 제2사분면의 각이므로 $\sin\theta > 0, \cos\theta < 0$ 이다 (배점 3.9점, 식 $16/25$).
2. $\cos\theta - \sin\theta < 0$ 이므로 $|\cos\theta - \sin\theta| = \sin\theta - \cos\theta$.
3. $\sqrt{\cos^2\theta} = |\cos\theta| = -\cos\theta$.
4. 식 정리: $(\sin\theta - \cos\theta) - (-\cos\theta) = \sin\theta = 3/5$.
5. $\cos^2\theta = 1 - (3/5)^2 = 16/25$, $\cos\theta < 0$ 이므로 $\cos\theta = -4/5$.
6. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — $\theta$가 제$2$사분면의 각이고 $|\cos\theta - \sin\theta| - \sqrt{\cos^2\theta} = \dfrac{3}{5}$일 때

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「a$가 제$2$사분면의 각이고 $|」
**RPM** H2-M1-RPM-098 [삼각함수 > 삼각함수 > 삼각함수의 뜻 > 삼각함수 값] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 뜻 > 삼각함수 값**
- 이유: 사분면 부호를 판정하여 삼각함수 값을 구하는 H2-M1-RPM-098 삼각함수의 뜻 > 삼각함수 값에 해당한다 (값 16, 배점 3.9점).
**유형** PT=PT_H22A_04_TRIG_DEFINITION / TPL=TPL_H22A_04_TRIG_DEFINITION_098
- 이유: 각의 사분면에 따른 삼각비의 부호를 결정하고 절댓값 기호를 벗겨 값을 계산하는 유형이다 (값 16, 배점 3.9점).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사분면에서 삼각함수의 부호를 판정하여 절댓값을 푼 뒤 기본 항등식으로 $\cos\theta$ 를 구하는 난이도 2 문항이다 (값 16, 배점 3.9점).

**4칸**
- given: 사분면←stem:「a$가 제$2$사분면의 각이고 $|」
- goal: 사분면←solution:「a$가 제$2$사분면의 각이므로 $」
- method: 사분면(NAMED)←solution:「a$가 제$2$사분면의 각이므로 $」
- condition: 사분면←stem:「a$가 제$2$사분면의 각이고 $|」

**how** 제2사분면에서 $\sin>0, \cos<0$ 임을 적용하여 $\sin\theta = 3/5$ 를 얻고 $\cos\theta = -4/5$ 로 판정했다 (배점 3.9점).

<details><summary>저장 해설 (판정 검토용)</summary>

$\theta$가 제$2$사분면의 각이므로 $\sin\theta > 0$, $\cos\theta < 0$이다.  
따라서 $\cos\theta - \sin\theta < 0$이므로  
$|\cos\theta - \sin\theta| = -(\cos\theta - \sin\theta) = \sin\theta - \cos\theta$  
또한 $\sqrt{\cos^2\theta} = |\cos\theta| = -\cos\theta$이므로  
$|\cos\theta - \sin\theta| - \sqrt{\cos^2\theta} = (\sin\theta - \cos\theta) - (-\cos\theta) = \sin\theta$  
즉, $\sin\theta = \dfrac{3}{5}$  
$\cos^2\theta = 1 - \sin^2\theta = 1 - \dfrac{9}{25} = \dfrac{16}{25}$  
$\cos\theta < 0$이므로 $\cos\theta = -\dfrac{4}{5}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

함수 $y = 2\log(x + 2) + 1$에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은? [4점]  
<보기>  
ㄱ. 그래프는 점 $(-1, 1)$을 지난다.  
ㄴ. 그래프의 점근선은 직선 $y = 1$이다.  
ㄷ. 그래프는 제$4$사분면을 지나지 않는다.  
ㄹ. 그래프는 함수 $y = \log(x + 2)^2$의 그래프를 $y$축의 방향으로 $1$만큼 평행이동한 것이다.

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄴ  ④ ㄴ, ㄷ  ⑤ ㄱ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 함수 $y = 2\log(x + 2) + 1$ 의 성질을 분석한다 (밑 10 상용로그).
2. ㄱ. $x = -1 \implies y = 2\log 1 + 1 = 1$, 점 $(-1, 1)$ 지남 (참).
3. ㄴ. 진수 $x+2=0$ 에서 점근선은 직선 $x = -2$ 이다 (거짓).
4. ㄷ. $x=0 \implies y = 2\log 2 + 1 > 0$, 증가함수이므로 제4사분면을 지나지 않는다 (참).
5. ㄹ. $y = \log(x+2)^2 + 1$ 은 정의역이 $x \ne -2$ 인 반면 원 함수는 $x > -2$ 이므로 다른 함수이다 (거짓).
6. 따라서 옳은 것은 ㄱ, ㄷ이며 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 함수 $y = 2\log(x + 2) + 1$에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?

**단원** H22-A-03(로그함수) / H22-A-03-LOGARITHMIC_FUNCTION(로그함수)
- 근거 인용: 「함수 $y = 2\」
**RPM** H2-M1-RPM-087 [지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 증가·감소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 증가·감소**
- 이유: 로그함수 그래프의 점근선, 지나는 점, 사분면 통과 여부를 판단하는 H2-M1-RPM-087 로그함수의 그래프 > 증가·감소에 해당한다 (밑 10의 상용로그).
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT
- 이유: 로그함수의 그래프적 성질과 정의역 일치 여부를 종합적으로 판정하는 합답형 문항 유형이다 (밑 10의 상용로그).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 보기의 각 항목이 로그함수의 정의, 점근선, 사분면 통과 등 기본 개념을 직접 묻고 있는 난이도 2 문항이다 (밑 10의 상용로그).

**4칸**
- given: 함수←stem:「함수 $y = 2\」
- goal: 점근선←stem:「ㄴ. 그래프의 점근선은 직선 $y」
- method: 평행이동(NAMED)←stem:「로 $1$만큼 평행이동한 것이다.」
- condition: 정의역←solution:「) + 1$의 정의역은 $\{x \」

**how** 지나는 점 ㄱ(참), 점근선 $x=-2$로 ㄴ(거짓), $y$절편 양수로 ㄷ(참), 정의역 차이로 ㄹ(거짓) 판정하여 ⑤로 결론지었다 (밑 10).

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. $x = -1$일 때 $y = 2\log 1 + 1 = 1$이므로 점 $(-1, 1)$을 지난다. (참)  
ㄴ. 진수 $x + 2 = 0$에서 점근선은 직선 $x = -2$이다. (거짓)  
ㄷ. $x = 0$일 때 $y = 2\log 2 + 1 > 0$이고 밑이 $10 > 1$인 증가함수이므로 $x > 0$일 때 $y > 0$이다. 따라서 그래프는 제$4$사분면을 지나지 않는다. (참)  
ㄹ. $y = 2\log(x + 2) + 1$의 정의역은 $\{x \mid x > -2\}$인 반면, $y = \log(x + 2)^2 + 1$의 정의역은 $\{x \mid x \neq -2\}$이므로 서로 다른 함수이다. (거짓)  
따라서 옳은 것은 ㄱ, ㄷ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

$\sqrt[3]{\dfrac{\sqrt[4]{a^3}}{\sqrt{a}}} \times \sqrt[6]{\dfrac{\sqrt[4]{a}}{a}}$를 간단히 하면 $\sqrt[n]{\dfrac{1}{a}}$이다. 자연수 $n$의 값은? (단, $a > 0$, $a \neq 1$) [4점]

**보기** ① $12$  ② $24$  ③ $36$  ④ $48$  ⑤ $72$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 거듭제곱근 식을 밑이 $a$ 인 유리수 지수로 변환한다 (지수 12 및 24 계산).
2. $\sqrt[3]{\dfrac{\sqrt[4]{a^3}}{\sqrt{a}}} = (a^{3/4 - 1/2})^{1/3} = (a^{1/4})^{1/3} = a^{1/12}$.
3. $\sqrt[6]{\dfrac{\sqrt[4]{a}}{a}} = (a^{1/4 - 1})^{1/6} = (a^{-3/4})^{1/6} = a^{-1/8}$.
4. 두 식의 곱: $a^{1/12} \times a^{-1/8} = a^{2/24 - 3/24} = a^{-1/24} = (1/a)^{1/24} = \sqrt[24]{1/a}$.
5. 따라서 $n = 24$ 이며 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — $\sqrt[3]{\dfrac{\sqrt[4]{a^3}}{\sqrt{a}}} \times \sqrt[6]{\dfrac{\sqrt[4]{a}}{a}}$를 간단히 하면 $\sqrt[n]{\dfrac{1}{a}}$이다.

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「a}}$이다. 자연수 $n$의 값은」
**RPM** H2-M1-RPM-069 [지수함수와 로그함수 > 지수 > 지수의 확장 > 유리수 지수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수의 확장 > 유리수 지수**
- 이유: 다중 거듭제곱근을 유리수 지수로 표현하여 지수법칙으로 정리하는 H2-M1-RPM-069 지수의 확장 > 유리수 지수 레코드에 해당한다 (값 24).
**유형** PT=PT_H22A_01_EXPONENT_EXTENSION / TPL=TPL_H22A_01_EXPONENT_EXTENSION_069
- 이유: 복잡한 거듭제곱근 식을 유리수 지수로 나타내어 통분 계산하는 유형이다 (값 24).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 거듭제곱근을 지수로 바꾼 뒤 지수끼리의 덧셈·뺄셈을 수행하는 전형적인 난이도 2 문항이다 (값 24).

**4칸**
- given: 자연수←stem:「a}}$이다. 자연수 $n$의 값은」
- goal: 지수←solution:「a$의 유리수 지수로 나타내면」
- method: 유리수(NAMED)←solution:「식을 $a$의 유리수 지수로 나타내」
- condition: 지수←solution:「a$의 유리수 지수로 나타내면」

**how** 두 거듭제곱근을 각각 $a^{1/12}$ 와 $a^{-1/8}$ 로 고친 후 곱하여 $a^{-1/24} = \sqrt[24]{1/a}$ 에서 $n=24$ 로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식을 $a$의 유리수 지수로 나타내면  
$\sqrt[3]{\dfrac{\sqrt[4]{a^3}}{\sqrt{a}}} = \left(a^{\frac{3}{4} - \frac{1}{2}}\right)^{\frac{1}{3}} = \left(a^{\frac{1}{4}}\right)^{\frac{1}{3}} = a^{\frac{1}{12}}$  
$\sqrt[6]{\dfrac{\sqrt[4]{a}}{a}} = \left(a^{\frac{1}{4} - 1}\right)^{\frac{1}{6}} = \left(a^{-\frac{3}{4}}\right)^{\frac{1}{6}} = a^{-\frac{1}{8}}$  
두 식을 곱하면  
$a^{\frac{1}{12}} \times a^{-\frac{1}{8}} = a^{\frac{2 - 3}{24}} = a^{-\frac{1}{24}} = \left(\dfrac{1}{a}\right)^{\frac{1}{24}} = \sqrt[24]{\dfrac{1}{a}}$  
따라서 $n = 24$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4.1점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\dfrac{\pi}{2} < \theta < \pi$이고 각 $\theta$를 나타내는 동경과 각 $6\theta$를 나타내는 동경이 일치할 때, $\theta = \dfrac{q}{p}\pi$이다. 서로소인 두 자연수 $p, q$에 대하여 $p - q$의 값은? [4.1점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $-1$  ⑤ $-2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 각 $\theta$ 와 $6\theta$ 의 동경이 일치하므로 $6\theta - \theta = 2n\pi$ ($n$은 정수)이다 (배점 4.1점).
2. $5\theta = 2n\pi \implies \theta = \dfrac{2n}{5}\pi$.
3. $\pi/2 < \theta < \pi$ 이므로 $1/2 < 2n/5 < 1 \implies 5/4 < n < 5/2$.
4. $n$ 은 정수이므로 $n = 2$, 따라서 $\theta = \dfrac{4}{5}\pi$.
5. $p = 5, q = 4$ 이므로 $p - q = 5 - 4 = 1$ 이며 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — $\dfrac{\pi}{2} < \theta < \pi$이고 각 $\theta$를 나타내는 동경과 각 $6\theta$를 나타내는 동경이 일치할 때

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「타내는 동경이 일치할 때, $\t」
**RPM** H2-M1-RPM-095 [삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각**
- 이유: 두 동경이 일치하는 조건 $\alpha - \beta = 2n\pi$ 를 다루는 H2-M1-RPM-095 일반각과 호도법 > 일반각에 해당한다 (배점 4.1점).
**유형** PT=PT_H22A_04_ANGLE_RADIAN / TPL=TPL_H22A_04_ANGLE_RADIAN_095
- 이유: 두 동경의 위치관계 공식(일치)을 세우고 주어진 각의 범위에서 정수 회전수를 결정하는 유형이다 (배점 4.1점).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 동경 일치 공식 차 $= 2n\pi$ 를 세우고 부등식으로 정수 $n$ 을 특정하는 기본 문항이다 (배점 4.1점).

**4칸**
- given: 서로소←stem:「\pi$이다. 서로소인 두 자연수」
- goal: 자연수←stem:「서로소인 두 자연수 $p, q$에」
- method: 상등(NAMED)←solution:「a$의 동경이 일치하므로   $6」
- condition: 정수←solution:「$ ($n$은 정수)   $5\t」

**how** 동경 일치 조건 $5\theta = 2n\pi$ 에 범위 $\pi/2 < \theta < \pi$ 를 적용해 $n=2, \theta = 4\pi/5$ 로 $p-q=1$ 을 도출했다 (배점 4.1점).

<details><summary>저장 해설 (판정 검토용)</summary>

두 각 $\theta$와 $6\theta$의 동경이 일치하므로  
$6\theta - \theta = 2n\pi$ ($n$은 정수)  
$5\theta = 2n\pi$, 즉 $\theta = \dfrac{2n}{5}\pi$  
$\dfrac{\pi}{2} < \theta < \pi$이므로  
$\dfrac{1}{2} < \dfrac{2n}{5} < 1 \implies \dfrac{5}{4} < n < \dfrac{5}{2}$  
$n$은 정수이므로 $n = 2$  
따라서 $\theta = \dfrac{4}{5}\pi$이고 $p = 5, q = 4$이므로 $p - q = 5 - 4 = 1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.2점


**발문**

둘레의 길이가 $16$인 부채꼴 중에서 그 넓이가 최대인 부채꼴의 넓이를 $a$, 넓이가 최대인 부채꼴의 중심각의 크기를 $b$라고 할 때, $a + b$의 값은? [4.2점]

**보기** ① $12$  ② $14$  ③ $16$  ④ $18$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 부채꼴의 반지름을 $r$, 호의 길이를 $l$ 이라 하면 둘레 $2r + l = 16 \implies l = 16 - 2r$ 이다 (배점 4.2점).
2. 넓이 $S = (1/2)rl = (1/2)r(16 - 2r) = 8r - r^2 = -(r - 4)^2 + 16$.
3. $r = 4$ 일 때 넓이의 최댓값 $a = 16$ 을 가진다.
4. 이때 호의 길이 $l = 16 - 8 = 8$ 이므로 중심각 $b = l/r = 8/4 = 2$ 이다.
5. $a + b = 16 + 2 = 18$ 이며 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 둘레의 길이가 $16$인 부채꼴 중에서 그 넓이가 최대인 부채꼴의 넓이를 $a$

**단원** H22-A-04(삼각함수) / H22-A-04-TRIGONOMETRIC_BASIC(삼각함수의 기본)
- 근거 인용: 「둘레의 길이가 $16$인」
**RPM** H2-M1-RPM-096 [삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 호도법**
- 이유: 부채꼴의 호의 길이와 넓이 공식, 둘레 제약 하의 이차함수 극값을 구하는 H2-M1-RPM-096 일반각과 호도법 > 호도법에 해당한다 (값 16, 배점 4.2점).
**유형** PT=PT_H22A_04_ANGLE_RADIAN / TPL=TPL_H22A_04_ANGLE_RADIAN_096
- 이유: 둘레가 일정한 부채꼴의 넓이를 반지름 $r$ 에 대한 이차함수로 모델링하여 최대 넓이와 중심각을 구하는 유형이다 (값 16, 배점 4.2점).
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차함수 표준형 변형과 중심각 공식 $b = l/r$ 만 적용하면 바로 해결되는 전형적인 필수 유형이다 (값 16, 배점 4.2점).

**4칸**
- given: 부채꼴←stem:「가 $16$인 부채꼴 중에서 그 넓」
- goal: 최댓값←stem:「서 그 넓이가 최대인 부채꼴의 넓」
- method: 반지름(NAMED)←solution:「부채꼴의 반지름의 길이를 $r」
- condition: 둘레←solution:「l$이라 하면 둘레의 길이가 $1」

**how** $2r+l=16$ 에서 넓이 $S=-(r-4)^2+16$ 으로 최대 넓이 $a=16$, 중심각 $b=2$ 를 구해 $a+b=18$ 로 판정했다 (배점 4.2점).

<details><summary>저장 해설 (판정 검토용)</summary>

부채꼴의 반지름의 길이를 $r$, 호의 길이를 $l$이라 하면 둘레의 길이가 $16$이므로  
$2r + l = 16 \implies l = 16 - 2r$ ($0 < r < 8$)  
부채꼴의 넓이 $S$는  
$S = \dfrac{1}{2}rl = \dfrac{1}{2}r(16 - 2r) = r(8 - r) = -(r - 4)^2 + 16$  
따라서 $r = 4$일 때 넓이의 최댓값 $a = 16$을 가진다.  
이때 호의 길이는 $l = 16 - 2 \times 4 = 8$이므로 중심각의 크기는  
$b = \dfrac{l}{r} = \dfrac{8}{4} = 2$  
따라서 $a + b = 16 + 2 = 18$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.2점


**발문**

함수 $f(x) = \begin{cases} |5^x - 5| & (x \ge 0) \\ |5^{-x} - 5| & (x < 0) \end{cases}$와 직선 $y = k$ ($k$는 실수)에 대하여 방정식 $f(x) = k$가 서로 다른 세 실근을 가질 때, $k$의 값은? [4.2점]

**보기** ① $0$  ② $1$  ③ $2$  ④ $3$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 함수 $f(x)$ 는 cases 식 정의에 따라 $y$축에 대하여 대칭인 그래프이다 (배점 4.2점).
2. $x \ge 0$ 에서 $f(x) = |5^x - 5|$: $x=0$ 일 때 $f(0) = |1-5| = 4$, $x=1$ 에서 $f(1)=0$, $x>1$ 에서 무한히 증가한다.
3. $y$축 대칭성에 의해 $k=4$ 일 때 $x=0$ 및 $x = \pm \log_5 9$ 등 서로 다른 3개의 실근을 가진다.
4. 따라서 $k = 4$ 이며 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 함수 $f(x) = \begin{cases} |5^x - 5| & (x \ge 0) \\ |5^{-x} - 5| & (x < 0) \end{cases}$와 직선 $y = k$

**단원** H22-A-02(지수함수) / H22-A-02-EXPONENTIAL_FUNCTION(지수함수)
- 근거 인용: 「ases}$와 직선 $y = k$」
**RPM** H2-M1-RPM-086 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점**
- 이유: 지수함수 절댓값 그래프와 수평 직선의 교점 개수를 추론하는 H2-M1-RPM-086 지수함수의 활용 > 그래프 교점 레코드에 해당한다 (cases 식, 배점 4.2점).
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_ABSOLUTE_PIECEWISE
- 이유: 조각별 절댓값 지수함수의 대칭성과 극점·경계값을 분석하여 직선 $y=k$ 와의 교점 개수가 3개가 되는 경계를 찾는 유형이다 (cases 식, 배점 4.2점).
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 함수의 대칭성을 파악하고 절댓값 함수의 꺾이는 점과 $y$축 교점에서의 교점 개수 변화를 시각화해야 하는 난이도 3 문항이다 (cases 식, 배점 4.2점).

**4칸**
- given: 방정식←stem:「수)에 대하여 방정식 $f(x) =」
- goal: 실근←stem:「서로 다른 세 실근을 가질 때,」
- method: 대칭성(NAMED)←solution:「$y$축 대칭성을 고려하면 방」
- condition: 직선←stem:「ases}$와 직선 $y = k$」

**how** $y$축 대칭성과 $x \ge 0$ 에서의 꼭짓점 $f(0)=4$ 를 분석하여 교점이 3개 생기는 높이가 $k=4$ 임을 판정했다 (cases 식, 배점 4.2점).

<details><summary>저장 해설 (판정 검토용)</summary>

$x < 0$일 때 $-x > 0$이므로 $f(-x) = f(x)$가 성립하여 $y = f(x)$의 그래프는 $y$축에 대하여 대칭이다.  
$x \ge 0$에서 $y = |5^x - 5|$의 그래프는  
- $x = 0$일 때 $f(0) = |5^0 - 5| = |1 - 5| = 4$  
- $0 \le x \le 1$일 때 $5 - 5^x$로 $4$에서 $0$까지 감소  
- $x \ge 1$일 때 $5^x - 5$로 $0$에서 한없이 증가  
$y$축 대칭성을 고려하면 방정식 $f(x) = k$의 서로 다른 실근의 개수는  
- $k < 0$: $0$개  
- $k = 0$: $2$개 ($x = \pm 1$)  
- $0 < k < 4$: $4$개  
- $k = 4$: $3$개 ($x = 0$ 및 $|x| > 1$인 대칭인 두 근)  
- $k > 4$: $2$개  
따라서 서로 다른 세 실근을 갖도록 하는 $k$의 값은 $4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

이차방정식 $x^2 - x\log_3 k^2 + \log_3 k + 2 = 0$이 실근을 갖도록 하는 실수 $k$의 범위는? [4.3점]

**보기** ① $k \le \dfrac{1}{3}$ 또는 $k \ge 9$  ② $0 < k < \dfrac{1}{3}$ 또는 $k > 9$  ③ $0 < k \le \dfrac{1}{3}$ 또는 $k \ge 9$  ④ $0 < k \le \dfrac{1}{9}$ 또는 $k \ge 3$  ⑤ $k \le \dfrac{1}{9}$ 또는 $k \ge 3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 진수 조건에 의해 $k > 0$ 이다 (배점 4.3점).
2. 이차방정식 $x^2 - (2\log_3 k)x + (\log_3 k + 2) = 0$ 이 실근을 가지려면 판별식 $D/4 \ge 0$ 이어야 한다.
3. $D/4 = (\log_3 k)^2 - (\log_3 k + 2) \ge 0$.
4. $\log_3 k = t$ 라 하면 $t^2 - t - 2 \ge 0 \implies (t - 2)(t + 1) \ge 0 \implies t \le -1$ 또는 $t \ge 2$.
5. $\log_3 k \le -1 \implies k \le 1/3$, $\log_3 k \ge 2 \implies k \ge 9$.
6. 진수 조건 $k > 0$ 과 연립하면 $0 < k \le 1/3$ 또는 $k \ge 9$ 이며 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 이차방정식 $x^2 - x\log_3 k^2 + \log_3 k + 2 = 0$이 실근을 갖도록 하는 실수 $k$의 범위는?

**단원** H22-A-03(로그함수) / H22-A-03-LOGARITHMIC_FUNCTION(로그함수)
- 근거 인용: 「이차방정식 $x^2 -」
**RPM** H2-M1-RPM-090 [지수함수와 로그함수 > 로그함수 > 로그방정식 > 치환] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그방정식 > 치환**
- 이유: 로그를 치환하여 이차부등식을 세우고 진수 조건과 결합하는 H2-M1-RPM-090 로그방정식 > 치환에 해당한다 (배점 4.3점).
**유형** PT=PT_H22A_03_LOG_EQUATION / TPL=TPL_H22A_03_LOG_EQUATION_090
- 이유: 이차방정식의 판별식 $D \ge 0$ 을 로그식에 적용하여 로그부등식을 해결하는 융합 유형이다 (배점 4.3점).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 판별식 계산과 로그부등식 풀이 후 반드시 진수 조건 $k > 0$ 을 연립해야 하므로 난이도 3 문항이다 (배점 4.3점).

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2 -」
- goal: 범위←stem:「실수 $k$의 범위는? [4.3점」
- method: 판별식(NAMED)←solution:「근을 가지려면 판별식 $D \ge」
- condition: 진수←solution:「진수 조건에 의하여」

**how** 판별식 $D/4 \ge 0$ 에서 $t \le -1$ 또는 $t \ge 2$ 를 구하고 진수 조건 $k>0$ 과 합쳐 $0 < k \le 1/3$ 또는 $k \ge 9$ 로 판정했다 (배점 4.3점).

<details><summary>저장 해설 (판정 검토용)</summary>

진수 조건에 의하여 $k > 0$이다.  
이차방정식이 실근을 가지려면 판별식 $D \ge 0$이어야 하고 $\log_3 k^2 = 2\log_3 k$이므로  
$D = (2\log_3 k)^2 - 4(\log_3 k + 2) \ge 0$  
$\log_3 k = t$라 하면  
$4t^2 - 4t - 8 \ge 0$  
$t^2 - t - 2 \ge 0$  
$(t - 2)(t + 1) \ge 0$  
$t \le -1$ 또는 $t \ge 2$  
$\log_3 k \le -1$ 또는 $\log_3 k \ge 2$  
진수 조건 $k > 0$과 밑 $3 > 1$을 적용하면  
$0 < k \le \dfrac{1}{3}$ 또는 $k \ge 9$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.4점


**발문**

$4 \le n \le 13$인 자연수 $n$에 대하여 $n^2 - 13n + 36$의 $n$제곱근 중 실수인 것의 개수를 $f(n)$이라 하자. $2f(n) = f(n + 1)$을 만족시키는 모든 $n$의 값의 합은? [4.4점]

**보기** ① $18$  ② $20$  ③ $22$  ④ $23$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $g(n) = n^2 - 13n + 36 = (n-4)(n-9)$ 라 하자 (합 20, 배점 4.4점).
2. $n$ 이 홀수이면 $g(n)$ 의 부호에 관계없이 $f(n) = 1$.
3. $n$ 이 짝수이면 $g(n)>0 \implies f(n)=2$, $g(n)=0 \implies f(n)=1$, $g(n)<0 \implies f(n)=0$.
4. $2f(n) = f(n+1)$ 을 만족하려면 $f(n)=1, f(n+1)=2$ 여야 하므로 $n$ 은 홀수이고 $n+1$ 은 짝수이며 $g(n+1) > 0$ 이어야 한다.
5. $4 \le n \le 12$ 범위의 홀수 $n$ 중 $g(n+1) > 0$ 인 경우는 $n=9$ ($g(10)=6>0$) 와 $n=11$ ($g(12)=24>0$) 이다.
6. 모든 $n$ 의 합은 $9 + 11 = 20$ 이며 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — $4 \le n \le 13$인 자연수 $n$에 대하여 $n^2 - 13n + 36$의 $n$제곱근 중 실수인 것의 개수를 $f(n)$이라 하자.

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「36$의 $n$제곱근 중 실수인 것」
**RPM** H2-M1-RPM-068 [지수함수와 로그함수 > 지수 > 거듭제곱근 > 실수 조건] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > 실수 조건**
- 이유: 거듭제곱근의 지수 홀짝성 및 밑의 부호에 따른 실수해의 개수를 판정하는 H2-M1-RPM-068 거듭제곱근 > 실수 조건에 해당한다 (값 20, 배점 4.4점).
**유형** PT=PT_H22A_01_ROOT_REAL / TPL=TPL_H22A_01_ROOT_REAL_068
- 이유: 거듭제곱근의 지수가 홀수/짝수일 때 실수인 것의 개수 $f(n)$ 의 정의를 이용하여 관계식을 만족하는 $n$ 을 찾는 유형이다 (값 20, 배점 4.4점).
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 홀수·짝수 케이스 분류와 이차식 부호 판정을 종합적으로 결합해야 하는 난이도 3 문항이다 (값 20, 배점 4.4점).

**4칸**
- given: 자연수←stem:「le 13$인 자연수 $n$에 대하」
- goal: 양화←stem:「을 만족시키는 모든 $n$의 값의」
- method: 제곱근(NAMED)←stem:「36$의 $n$제곱근 중 실수인 것」
- condition: 짝수←solution:「$n$이 짝수일 때는 $g(」

**how** $f(n)=1, f(n+1)=2$ 조건으로부터 $n$ 은 홀수, $n+1$ 은 짝수이며 $(n-3)(n-8)>0$ 임을 만족하는 $n=9, 11$ 을 찾아 합 20 으로 판정했다 (배점 4.4점).

<details><summary>저장 해설 (판정 검토용)</summary>

$g(n) = n^2 - 13n + 36 = (n - 4)(n - 9)$라 하자.  
$n$이 홀수일 때는 $g(n)$의 부호와 관계없이 항상 $f(n) = 1$이다.  
$n$이 짝수일 때는 $g(n) > 0$이면 $f(n) = 2$, $g(n) = 0$이면 $f(n) = 1$, $g(n) < 0$이면 $f(n) = 0$이다.  
$4 \le n \le 13$에서 $f(n)$의 값을 구하면 다음과 같다.  
- $n = 4$: $g(4) = 0 \implies f(4) = 1$  
- $n = 5$: 홀수 $\implies f(5) = 1$  
- $n = 6$: $g(6) = -6 < 0$ (짝수) $\implies f(6) = 0$  
- $n = 7$: 홀수 $\implies f(7) = 1$  
- $n = 8$: $g(8) = -4 < 0$ (짝수) $\implies f(8) = 0$  
- $n = 9$: $g(9) = 0 \implies f(9) = 1$  
- $n = 10$: $g(10) = 6 > 0$ (짝수) $\implies f(10) = 2$  
- $n = 11$: 홀수 $\implies f(11) = 1$  
- $n = 12$: $g(12) = 24 > 0$ (짝수) $\implies f(12) = 2$  
- $n = 13$: 홀수 $\implies f(13) = 1$  
$f(n)$과 $f(n + 1)$이 모두 정의되는 $4 \le n \le 12$에서 $2f(n) = f(n + 1)$을 만족시키는 경우는 $f(n) = 1, f(n + 1) = 2$일 때이므로 $n = 9, 11$이다.  
따라서 모든 $n$의 값의 합은 $9 + 11 = 20$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.5점


**발문**

두 실수 $a, b$가 다음 <조건>을 만족시킬 때, $(\log_a 3)^2 \times \log_3 b = \dfrac{p}{q}$이다. $p + q$의 값은? (단, $p, q$는 서로소인 자연수) [4.5점]  
<조건>  
(가) $\log_{\sqrt{3}} ab = 30$  
(나) $\log_a \sqrt{b} = \log_{\sqrt{b}} a$  
(다) $1 < a < b$

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 조건 (나): $\log_a \sqrt{b} = \log_{\sqrt{b}} a \implies (1/2)\log_a b = 2/\log_a b \implies (\log_a b)^2 = 4$ (조건 가의 30, 배점 4.5점).
2. 조건 (다) $1 < a < b$ 에서 $\log_a b > 1$ 이므로 $\log_a b = 2 \implies b = a^2$.
3. 조건 (가)에 $b = a^2$ 대입: $\log_{\sqrt{3}} a^3 = 6\log_3 a = 30 \implies \log_3 a = 5$.
4. $\log_3 b = \log_3 a^2 = 10$, $\log_a 3 = 1/\log_3 a = 1/5$.
5. $(\log_a 3)^2 \times \log_3 b = (1/25) \times 10 = 2/5 = p/q$.
6. 서로소인 두 자연수 $p=2, q=5$ 이므로 $p+q = 7$, 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 두 실수 $a, b$가 다음 <조건>을 만족시킬 때, $(\log_a 3)^2 \times \log_3 b = \dfrac{p}{q}$이다.

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「두 실수 $a, b$가」
**RPM** H2-M1-RPM-076 [지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환**
- 이유: 밑변환 공식 $\log_a b = 1/\log_b a$ 및 밑의 거듭제곱 성질을 복합 활용하는 H2-M1-RPM-076 로그의 성질 > 밑의 변환에 해당한다 (값 30, 배점 4.5점).
**유형** PT=PT_H22A_01_LOG_PROPERTIES / TPL=TPL_H22A_01_LOG_PROPERTIES_076
- 이유: 밑변환 공식과 대소 조건을 이용해 두 변수의 관계를 찾아 로그값을 계산하는 유형이다 (값 30, 배점 4.5점).
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 조건 (나)에서 밑변환으로 $b=a^2$ 을 유도하고 조건 (가)와 연립하는 계산 절차가 필요한 난이도 3 문항이다 (값 30, 배점 4.5점).

**4칸**
- given: 실수←stem:「두 실수 $a, b$가」
- goal: 자연수←stem:「$는 서로소인 자연수) [4.5점]」
- method: 조건(NAMED)←stem:「b$가 다음 <조건>을 만족시킬」
- condition: 대입←solution:「= a^2$을 대입하면   $\l」

**how** 밑변환 공식으로 $b=a^2$ 을 얻고 조건 (가)로부터 $\log_3 a = 5$ 를 구해 구하는 식의 값 $2/5$ 에서 $p+q=7$ 로 판정했다 (배점 4.5점).

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (나)에서  
$\log_a \sqrt{b} = \dfrac{1}{2}\log_a b$, $\log_{\sqrt{b}} a = 2\log_b a = \dfrac{2}{\log_a b}$  
$\dfrac{1}{2}\log_a b = \dfrac{2}{\log_a b} \implies (\log_a b)^2 = 4$  
조건 (다) $1 < a < b$에 의해 $\log_a b > 1$이므로 $\log_a b = 2$, 즉 $b = a^2$  
조건 (가)에 $b = a^2$을 대입하면  
$\log_{\sqrt{3}} a^3 = 2\log_3 a^3 = 6\log_3 a = 30$  
$\log_3 a = 5$  
또한 $\log_3 b = \log_3 a^2 = 2\log_3 a = 10$이고 $\log_a 3 = \dfrac{1}{\log_3 a} = \dfrac{1}{5}$이므로  
$(\log_a 3)^2 \times \log_3 b = \left(\dfrac{1}{5}\right)^2 \times 10 = \dfrac{10}{25} = \dfrac{2}{5}$  
$p = 2, q = 5$이므로 $p + q = 2 + 5 = 7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.6점


**발문**

실수 전체의 집합에서 정의된 함수 $f(x)$가 다음 조건을 만족시킨다.  
(가) $f(x) = \begin{cases} x & (0 \le x < 1) \\ -x + 2 & (1 \le x < 2) \end{cases}$  
(나) 모든 실수 $x$에 대하여 $f(x + 2) = f(x)$이다.  
자연수 $n$에 대하여 함수 $y = f(x)$의 그래프가 함수 $y = \log_{5n} x$의 그래프와 만나는 점의 개수가 $74$일 때, 자연수 $n$의 값은? [4.6점]

**보기** ① $15$  ② $16$  ③ $17$  ④ $18$  ⑤ $19$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 함수 $f(x)$ 는 cases 정의에 따라 주기가 2 이고 치역이 $[0, 1]$ 인 연속 주기함수이다 (교점 74, 배점 4.6점).
2. $y = \log_{5n} x$ 는 $(1, 0)$ 과 $(5n, 1)$ 을 지나는 증가함수이다.
3. $x > 5n$ 에서는 $\log_{5n} x > 1 \ge f(x)$ 이므로 교점이 없다.
4. 각 주기 $[2m, 2m+2]$ 마다 2개씩 교점이 생기며, 총 교점 개수 74(짝수)이므로 $5n$ 은 홀수여야 한다.
5. 총 교점 개수: $1 + 2 \times \dfrac{5n - 3}{2} + 1 = 5n - 1 = 74 \implies 5n = 75 \implies n = 15$.
6. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 실수 전체의 집합에서 정의된 함수 $f(x)$가 다음 조건을 만족시킨다.

**단원** H22-A-03(로그함수) / H22-A-03-LOGARITHMIC_FUNCTION(로그함수)
- 근거 인용: 「실수 전체의 집합에서 정의된 함」
**RPM** H2-M1-RPM-094 [지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점**
- 이유: 로그함수 그래프와 다른 함수의 주기적 교점 개수를 모델링하는 H2-M1-RPM-094 로그함수의 활용 > 그래프 교점에 해당한다 (개수 74, 배점 4.6점).
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_PERIODIC_SYMMETRY_INTERSECTION
- 이유: 주기함수와 로그함수의 교점 개수를 끝점의 위치에 따라 일반화하여 미지수를 구하는 유형이다 (개수 74, 배점 4.6점).
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 주기별 교점 패턴과 끝점 $(5n, 1)$ 의 꼭짓점 일치 조건을 정밀하게 분석해야 하는 고난도 4 문항이다 (개수 74, 배점 4.6점).

**4칸**
- given: 주기함수←solution:「0, 1]$인 주기함수이다.   함수」
- goal: 자연수←stem:「)$이다.   자연수 $n$에 대하」
- method: 교점(NAMED)←solution:「q 0$이므로 교점이 없다.」
- condition: 주기←solution:「f(x)$는 주기가 $2$이고」

**how** 주기 2 마다 교점이 2개씩 발생하는 구조에서 교점 총수 $5n - 1 = 74$ 식을 세워 $n=15$ 로 판정했다 (배점 4.6점).

<details><summary>저장 해설 (판정 검토용)</summary>

함수 $y = f(x)$는 주기가 $2$이고 치역이 $[0, 1]$인 주기함수이다.  
함수 $y = \log_{5n} x$는 증가함수이며 $(1, 0)$과 $(5n, 1)$을 지난다.  
- $0 < x \le 1$에서 $\log_{5n} x \le 0$이고 $f(x) \ge 0$인데 $f(1) = 1 \neq 0$이므로 교점이 없다.  
- $1 < x \le 2$에서 $\log_{5n} x$는 $0$에서 $\log_{5n} 2 > 0$까지 증가하고 $f(x)$는 $1$에서 $0$까지 감소하므로 교점이 $1$개 있다.  
- $x > 5n$에서는 $\log_{5n} x > 1 \ge f(x)$이므로 교점이 없다.  
한 주기 $[2m, 2m+2]$ ($m \ge 1$)마다 $f(x)$가 $0$에서 $1$까지 증가했다가 $0$으로 감소하므로 $0 < \log_{5n} x < 1$인 구간에서는 한 주기당 교점이 $2$개씩 생긴다.  
총 교점의 개수가 $74$(짝수)이므로 $(5n, 1)$이 $f(x)$의 꼭짓점($x$가 홀수, $f(x)=1$)과 일치해야 한다.  
따라서 $5n$은 홀수이고, 교점의 개수는  
$1 + 2 \times \dfrac{5n - 3}{2} + 1 = 5n - 1 = 74$  
$5n = 75 \implies n = 15$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.6점


**발문**

두 양수 $a, b$ ($a > 1$, $0 < b < 1$)에 대하여  
$$f(x) = \begin{cases} \log_3(x - 3) - a & (x \ge 6) \\ b^{x - 6} - a & (x < 6) \end{cases}$$  
이다. 함수 $y = f(x)$의 그래프와 $x$축이 만나는 두 점을 각각 $A, B$라 하자. $\overline{AB} = 7$이고 $f(30) = \dfrac{a}{2}$일 때, $(ab)^3$의 값은? [4.6점]

**보기** ① $\dfrac{1}{8}$  ② $\dfrac{1}{4}$  ③ $\dfrac{1}{2}$  ④ $1$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(30) = \log_3(30 - 3) - a = 3 - a = a/2 \implies a = 2$ 이다 (선분 AB 길이 7, 배점 4.6점).
2. $x \ge 6$ 에서 $f(x) = \log_3(x - 3) - 2 = 0 \implies x - 3 = 9 \implies x = 12$, 즉 점 $B(12, 0)$.
3. $\overline{AB} = 7$ 이고 다른 교점 $A$ 는 $x < 6$ 에 있으므로 $x_A = 12 - 7 = 5$ 이다.
4. $f(5) = b^{5 - 6} - 2 = 0 \implies b^{-1} = 2 \implies b = 1/2$.
5. $(ab)^3 = (2 \times 1/2)^3 = 1^3 = 1$ 이며 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 함수 $y = f(x)$의 그래프와 $x$축이 만나는 두 점을 각각 $A, B$라 하자.

**단원** H22-A-03(로그함수) / H22-A-03-LOGARITHMIC_FUNCTION(로그함수)
- 근거 인용: 「f(x)$의 그래프와 $x$축이」
**RPM** H2-M1-RPM-094 [지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 그래프 교점**
- 이유: 로그함수와 지수함수의 $x$절편 사이의 거리를 이용해 미지수를 구하는 H2-M1-RPM-094 로그함수의 활용 > 그래프 교점에 해당한다 (선분 AB, 배점 4.6점).
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_DISTANCE_RATIO
- 이유: 두 교점 사이의 거리 조건을 이용해 조각함수의 각 구간의 근을 구하고 미정계수를 결정하는 유형이다 (선분 AB, 배점 4.6점).
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: $f(30)$ 조건으로 $a$ 를 구하고 거리 조건 $\overline{AB}=7$ 로 지수 구간의 근을 찾는 2단계 난이도 3 문항이다 (선분 AB, 배점 4.6점).

**4칸**
- given: 그래프←stem:「f(x)$의 그래프와 $x$축이」
- goal: 양수←stem:「두 양수 $a, b$」
- method: 교점(NAMED)←solution:「따라서 한 교점은 $B(12,」
- condition: 구간←solution:「\ge 6$인 구간: $\log_」

**how** $f(30)=a/2$ 로 $a=2$ 를 얻고 $\log_3(x-3)=2$ 의 근 12 에서 거리가 7 인 점 5 를 대입해 $b=1/2$ 을 구하여 $(ab)^3=1$ 로 판정했다 (선분 AB, 배점 4.6점).

<details><summary>저장 해설 (판정 검토용)</summary>

$f(30) = \dfrac{a}{2}$이므로  
$\log_3(30 - 3) - a = \dfrac{a}{2}$  
$\log_3 27 - a = \dfrac{a}{2} \implies 3 = \dfrac{3}{2}a \implies a = 2$  
이제 $f(x) = 0$인 두 점의 $x$좌표를 구한다.  
(1) $x \ge 6$인 구간: $\log_3(x - 3) - 2 = 0 \implies x - 3 = 3^2 = 9 \implies x = 12$  
따라서 한 교점은 $B(12, 0)$이다.  
(2) $\overline{AB} = 7$이고 다른 교점 $A$는 $x < 6$인 구간에 있으므로 $A$의 $x$좌표는 $12 - 7 = 5$  
따라서 $f(5) = b^{5 - 6} - 2 = 0 \implies b^{-1} = 2 \implies b = \dfrac{1}{2}$ ($0 < b < 1$ 만족)  
그러므로 $(ab)^3 = \left(2 \times \dfrac{1}{2}\right)^3 = 1^3 = 1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.7점


**발문**

두 상수 $a, k$ ($1 < a < 2$, $0 < k < 1$)에 대하여 직선 $y = 2$가 두 곡선 $y = 2^{x+1}$, $y = a^{x+1}$과 만나는 두 점을 각각 $A, B$라 하고, 직선 $y = k$가 두 곡선 $y = 2^{x+1}$, $y = a^{x+1}$과 만나는 두 점을 각각 $C, D$라 하자. 사각형 $ADCB$가 넓이가 $\dfrac{3}{2}$인 평행사변형일 때, $ak$의 값은? [4.7점]

**보기** ① $2^{\frac{1}{3}}$  ② $2^{-\frac{1}{3}}$  ③ $2^{-\frac{1}{2}}$  ④ $2^{\frac{1}{2}}$  ⑤ $2^{\frac{3}{2}}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 네 점의 좌표: $A(0, 2), B(\log_a 2 - 1, 2), C(\log_2 k - 1, k), D(\log_a k - 1, k)$ (사각형 ADCB, 배점 4.7점).
2. 평행사변형 조건 $\overline{AB} = \overline{DC} \implies \log_a 2 - 1 = \log_2 k - \log_a k$.
3. $\log_2 k + 1 = \log_a(2k) \implies \log_2(2k) = \dfrac{\log_2(2k)}{\log_2 a} \implies \log_2(2k) = 0 \implies k = 1/2$.
4. 높이 $= 2 - k = 3/2$ 이고 넓이가 $3/2$ 이므로 $\overline{AB} = 1 \implies \log_a 2 - 1 = 1 \implies \log_a 2 = 2 \implies a = \sqrt{2} = 2^{1/2}$.
5. $ak = 2^{1/2} \times 2^{-1} = 2^{-1/2}$ 이며 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 사각형 $ADCB$가 넓이가 $\dfrac{3}{2}$인 평행사변형일 때, $ak$의 값은?

**단원** H22-A-02(지수함수) / H22-A-02-EXPONENTIAL_FUNCTION(지수함수)
- 근거 인용: 「D$라 하자. 사각형 $ADCB$가」
**RPM** H2-M1-RPM-086 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점**
- 이유: 지수함수 그래프 위의 교점들의 좌표를 구하고 도형의 성질과 넓이를 연립하는 H2-M1-RPM-086 지수함수의 활용 > 그래프 교점에 해당한다 (사각형 ADCB, 배점 4.7점).
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_DISTANCE_RATIO
- 이유: 평행사변형의 대변 길이 상등과 넓이 조건을 교점의 로그 좌표로 표현하여 미지수를 구하는 고난도 유형이다 (사각형 ADCB, 배점 4.7점).
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 네 점의 좌표를 밑이 다른 로그로 표현하고 평행사변형 대변 조건과 넓이를 연립해야 하는 난이도 4 문항이다 (사각형 ADCB, 배점 4.7점).

**4칸**
- given: 평행사변형←stem:「3}{2}$인 평행사변형일 때, $ak」
- goal: 상수←stem:「두 상수 $a, k$」
- method: 좌표(NAMED)←solution:「D$의 $x$좌표를 각각 구하면」
- condition: 넓이←solution:「}{2}$이고 넓이가 $\dfra」

**how** 교점 좌표를 구하여 대변 상등 조건 $\overline{AB}=\overline{DC}$ 로 $k=1/2$, 넓이 $3/2$ 로 $a=\sqrt{2}$ 를 구해 $ak = 2^{-1/2}$ 로 판정했다 (사각형 ADCB, 배점 4.7점).

<details><summary>저장 해설 (판정 검토용)</summary>

네 점 $A, B, C, D$의 $x$좌표를 각각 구하면  
$2^{x+1} = 2 \implies x = 0$이므로 $A(0, 2)$  
$a^{x+1} = 2 \implies x = \log_a 2 - 1$이므로 $B(\log_a 2 - 1, 2)$  
$2^{x+1} = k \implies x = \log_2 k - 1$이므로 $C(\log_2 k - 1, k)$  
$a^{x+1} = k \implies x = \log_a k - 1$이므로 $D(\log_a k - 1, k)$  
$1 < a < 2$이고 $0 < k < 1$이므로 $\log_a 2 > 1$이고 $\log_a k < \log_2 k < 0$이다.  
사각형 $ADCB$가 평행사변형이므로 $\overline{AB} = \overline{DC}$, 즉 $x_B - x_A = x_C - x_D$이다.  
$\log_a 2 - 1 = \log_2 k - \log_a k$  
$\log_2 k + 1 = \log_a(2k)$  
$\log_2(2k) = \dfrac{\log_2(2k)}{\log_2 a}$  
$1 < a < 2$에서 $\log_2 a \neq 1$이므로 $\log_2(2k) = 0$, 즉 $2k = 1$에서 $k = \dfrac{1}{2}$  
평행사변형 $ADCB$의 높이는 $2 - k = 2 - \dfrac{1}{2} = \dfrac{3}{2}$이고 넓이가 $\dfrac{3}{2}$이므로  
$\overline{AB} \times \dfrac{3}{2} = \dfrac{3}{2} \implies \overline{AB} = \log_a 2 - 1 = 1$  
$\log_a 2 = 2 \implies a^2 = 2 \implies a = 2^{\frac{1}{2}}$ ($a > 1$)  
따라서 $ak = 2^{\frac{1}{2}} \times 2^{-1} = 2^{-\frac{1}{2}}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

정의역이 $\{x \mid x \le 2\}$인 함수 $y = 3^{2x} - 2 \cdot 3^{x+1} - 5$는 $x = a$일 때 최댓값 $M$을 갖고 $x = b$일 때 최솟값 $m$을 갖는다. 실수 $a, b, M, m$을 구하는 과정과 정답을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $a = 2$, $b = 1$, $M = 22$, $m = -14$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $3^x = t$ 로 치환하면 $x \le 2$ 에서 $0 < t \le 3^2 = 9$ 이다 (최댓값 22, 최솟값 -14).
2. $y = t^2 - 6t - 5 = (t - 3)^2 - 14$.
3. 꼭짓점 $t = 3 \in (0, 9]$ 이므로 $3^x = 3 \implies x = 1$ 일 때 최솟값 $m = -14$ 를 갖는다 ($b = 1$).
4. 끝점 $t = 9$ 에서 $y = (9 - 3)^2 - 14 = 22$ 이므로 $3^x = 9 \implies x = 2$ 일 때 최댓값 $M = 22$ 를 갖는다 ($a = 2$).
5. 따라서 $a = 2, b = 1, M = 22, m = -14$ 이다.
- 작성자 답: $a = 2$, $b = 1$, $M = 22$, $m = -14$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 정의역이 $\{x \mid x \le 2\}$인 함수 $y = 3^{2x} - 2 \cdot 3^{x+1} - 5$는

**단원** H22-A-02(지수함수) / H22-A-02-EXPONENTIAL_FUNCTION(지수함수)
- 근거 인용: 「e 2\}$인 함수 $y = 3^」
**RPM** H2-M1-RPM-085 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 최대·최소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 최대·최소**
- 이유: 지수식을 $t$ 로 치환하여 제한된 정의역에서 이차함수의 최댓값과 최솟값을 구하는 H2-M1-RPM-085 지수함수의 활용 > 최대·최소에 해당한다 (값 14, 22).
**유형** PT=PT_FUNCTION_EXTREMUM / TPL=TPL_FUNCTION_EXTREMUM_SUB_QUADRATIC
- 이유: 지수함수를 치환하여 유한 구간에서의 이차함수의 극값과 경계값을 분석하는 유형이다 (값 14, 22).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 치환 변수 $t$ 의 범위를 정확히 설정하고 이차함수의 꼭짓점 및 끝점에서 $x$ 값을 역산해야 하는 서술형 문항이다 (값 14, 22).

**4칸**
- given: 정의역←stem:「정의역이 $\{x \」
- goal: 최댓값←stem:「= a$일 때 최댓값 $M$을 갖고」
- method: 꼭짓점(NAMED)←solution:「le 9$에서 꼭짓점 $t = 3$」
- condition: 끝점←solution:「- 구간의 끝점 $t = 9$」

**how** $3^x = t$ ($0 < t \le 9$) 로 치환하여 $y=(t-3)^2-14$ 로 변형한 뒤 꼭짓점과 끝점의 값을 분석하여 정답을 판정했다 (값 14, 22).

<details><summary>저장 해설 (판정 검토용)</summary>

$3^x = t$라 하면 정의역 $x \le 2$에서 $0 < t \le 3^2 = 9$이다.  
주어진 함수를 $t$에 대한 식으로 나타내면  
$y = t^2 - 6t - 5 = (t - 3)^2 - 14$  
$0 < t \le 9$에서 꼭짓점 $t = 3$이 구간 안에 있으므로  
- $t = 3$, 즉 $3^x = 3$에서 $x = 1$일 때 최솟값 $m = -14$를 가진다. 따라서 $b = 1$  
- 구간의 끝점 $t = 9$에서 $y = (9 - 3)^2 - 14 = 22$이고 $t \to 0+$일 때 $y \to -5$이므로, $t = 9$, 즉 $3^x = 9$에서 $x = 2$일 때 최댓값 $M = 22$를 가진다. 따라서 $a = 2$  
그러므로 $a = 2$, $b = 1$, $M = 22$, $m = -14$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

빛이 어떤 유리판을 한 장 통과할 때마다 그 밝기가 $10\%$씩 감소한다고 한다. 밝기가 $A$인 빛이 이 유리판을 $15$장 통과했을 때 그 밝기는 처음의 몇 배가 되는지 구하는 과정과 정답을 서술하시오. (단, $\log 9 = 0.9542$, $\log 2.056 = 0.3130$으로 계산한다.) [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $0.2056$배   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 유리판 1장을 통과할 때마다 밝기가 $10\%$ 씩 감소하므로 1장 통과 후 원래 밝기의 0.9배가 된다 (15장 통과).
2. 15장을 통과한 후의 밝기는 처음의 $k = (0.9)^{15}$ 배이다.
3. 양변에 상용로그를 취한다: $\log k = 15 \log (9/10) = 15(\log 9 - 1) = 15(0.9542 - 1) = 15 \times (-0.0458) = -0.6870$.
4. $-0.6870 = -1 + 0.3130 = \log 10^{-1} + \log 2.056 = \log 0.2056$.
5. 따라서 $k = 0.2056$, 즉 처음의 $0.2056$배가 된다.
- 작성자 답: $0.2056$배 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — 빛이 어떤 유리판을 한 장 통과할 때마다 그 밝기가 $10\%$씩 감소한다고 한다.

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「빛이 어떤 유리판을 한」
**RPM** H2-M1-RPM-077 [지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수**
- 이유: 상용로그값을 이용하여 거듭제곱 수의 값을 계산하는 H2-M1-RPM-077 상용로그 > 상용로그표·자릿수에 해당한다 (값 0.9542, 15).
**유형** PT=PT_H22A_01_COMMON_LOG / TPL=TPL_H22A_01_COMMON_LOG_SUBSTITUTE
- 이유: 상용로그를 취하여 주어진 로그값을 대입해 음의 소수를 정수부분과 양의 소수부분으로 분리하여 수의 배열을 결정하는 유형이다 (값 0.9542, 15).
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 상용로그 계산 결과 음의 소수 $-0.6870$ 을 $-1 + 0.3130$ 으로 분리하여 자릿수와 수의 배열을 복원하는 서술형 문항이다 (값 0.9542, 15).

**4칸**
- given: 증가감소←stem:「$10\%$씩 감소한다고 한다.」
- goal: 통과←stem:「리판을 한 장 통과할 때마다 그」
- method: 상용로그(NAMED)←solution:「.   양변에 상용로그를 취하면」
- condition: 로그←solution:「양변에 상용로그를 취하면」

**how** 밝기 배수 $k = (0.9)^{15}$ 에 상용로그를 취해 $\log k = -0.6870 = \log 0.2056$ 을 얻어 $0.2056$배로 판정했다 (값 0.9542, 15).

<details><summary>저장 해설 (판정 검토용)</summary>

유리판을 한 장 통과할 때마다 밝기가 $10\%$씩 감소하므로 $1$장 통과 후의 밝기는 원래 밝기의 $0.9$배가 된다.  
따라서 $15$장을 통과한 후의 밝기는 $A \times (0.9)^{15}$이므로 처음의 $k = (0.9)^{15}$배이다.  
양변에 상용로그를 취하면  
$\log k = \log (0.9)^{15} = 15 \log \dfrac{9}{10} = 15(\log 9 - 1)$  
$= 15(0.9542 - 1) = 15 \times (-0.0458) = -0.6870$  
$-0.6870 = -1 + 0.3130 = \log 10^{-1} + \log 2.056 = \log 0.2056$  
따라서 $k = 0.2056$, 즉 처음의 $0.2056$배가 된다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

$1$이 아닌 세 양수 $a, b, c$가 $-4\log_a b = 16\log_b c = \log_c a$를 만족시킨다. $b \times c$의 값이 $100$ 이하의 자연수가 되도록 하는 모든 자연수 $a$의 값의 합을 구하는 과정과 정답을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $353$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $-4\log_a b = 16\log_b c = \log_c a = k$ 라 두면 $(-4)(16)(1) (\log_a b \cdot \log_b c \cdot \log_c a) = k^3$ (모든 자연수 합 353).
2. $\log_a b \cdot \log_b c \cdot \log_c a = 1$ 이므로 $k^3 = -64 \implies k = -4$ ($k$는 실수).
3. $-4\log_a b = -4 \implies \log_a b = 1 \implies b = a$.
4. $16\log_b c = -4 \implies \log_b c = -1/4 \implies c = b^{-1/4} = a^{-1/4}$.
5. $b \times c = a \cdot a^{-1/4} = a^{3/4}$ 이다.
6. $a^{3/4}$ 이 100 이하의 자연수가 되려면 $a = m^4$ ($m \ge 2$ 인 자연수) 꼴이어야 하고, $a^{3/4} = m^3 \le 100 \implies m \in \{2, 3, 4\}$.
7. $m=2 \implies a=16$, $m=3 \implies a=81$, $m=4 \implies a=256$.
8. 모든 자연수 $a$ 의 합은 $16 + 81 + 256 = 353$ 이다.
- 작성자 답: $353$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — $1$이 아닌 세 양수 $a, b, c$가 $-4\log_a b = 16\log_b c = \log_c a$를 만족시킨다.

**단원** H22-A-01(지수와 로그) / H22-A-01-EXPONENT_LOG(지수와 로그)
- 근거 인용: 「$이 아닌 세 양수 $a, b,」
**RPM** H2-M1-RPM-076 [지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환**
- 이유: 순환하는 세 로그의 곱이 1이 되는 밑변환 공식 성질을 활용하는 H2-M1-RPM-076 로그의 성질 > 밑의 변환에 해당한다 (값 81, 353).
**유형** PT=PT_H22A_01_LOG_PROPERTIES / TPL=TPL_H22A_01_LOG_PROPERTIES_076
- 이유: 로그의 순환 곱 항등식으로 공통 비례상수 $k$ 를 결정하고 거듭제곱식의 정수 조건을 추론하는 고난도 서술형 유형이다 (값 81, 353).
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 세 비례식을 변변 곱해 $k=-4$ 를 구하고 $b \times c = a^{3/4}$ 의 자연수 조건을 해석해야 하는 고난도 서술형 문항이다 (값 81, 353).

**4칸**
- given: 양수←stem:「$이 아닌 세 양수 $a, b,」
- goal: 자연수←stem:「00$ 이하의 자연수가 되도록 하는」
- method: 양화(NAMED)←solution:「따라서 구하는 모든 자연수 $a$」
- condition: 실수←solution:「$ ($k$는 실수)   따라서」

**how** 비례상수를 $k$ 로 두고 곱하여 $k=-4$ 를 구한 뒤 $bc = a^{3/4}$ 이 100 이하의 자연수가 되는 $a=16, 81, 256$ 을 합해 353 으로 판정했다 (값 81).

<details><summary>저장 해설 (판정 검토용)</summary>

$-4\log_a b = 16\log_b c = \log_c a = k$라 하면 세 식을 변변 곱하여  
$(-4\log_a b)(16\log_b c)(\log_c a) = k^3$  
$\log_a b \cdot \log_b c \cdot \log_c a = 1$이므로  
$k^3 = -64 \implies k = -4$ ($k$는 실수)  
따라서  
$-4\log_a b = -4 \implies \log_a b = 1 \implies b = a$  
$16\log_b c = -4 \implies \log_b c = -\dfrac{1}{4} \implies c = b^{-\frac{1}{4}} = a^{-\frac{1}{4}}$  
그러므로 $b \times c = a \cdot a^{-\frac{1}{4}} = a^{\frac{3}{4}}$이다.  
$a$는 $1$이 아닌 자연수이고 $a^{\frac{3}{4}}$이 $100$ 이하의 자연수가 되려면 $a = m^4$ ($m$은 $2$ 이상의 자연수) 꼴이어야 한다.  
이때 $a^{\frac{3}{4}} = m^3 \le 100$이므로 $m = 2, 3, 4$이다.  
- $m = 2$: $a = 2^4 = 16$ ($m^3 = 8$)  
- $m = 3$: $a = 3^4 = 81$ ($m^3 = 27$)  
- $m = 4$: $a = 4^4 = 256$ ($m^3 = 64$)  
따라서 구하는 모든 자연수 $a$의 값의 합은 $16 + 81 + 256 = 353$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
