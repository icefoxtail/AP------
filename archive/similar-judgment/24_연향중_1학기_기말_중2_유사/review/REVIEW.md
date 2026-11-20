# 검수 묶음 — 24_연향중_1학기_기말_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 4)**
- 문항 23개 / 검사 PASS 19, FAIL 4, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 3, 2단계 12, 3단계 8
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q6**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q10**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q17**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q18**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q19**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q23**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중에서 미지수가 $2$개인 일차방정식인 것은? [3점]

**보기** ① $\dfrac{1}{2}x - 2y + 3 = 0$  ② $x^2 + 2y = 3x$  ③ $4x - y = 2(2x - y) + 1$  ④ $3(x - 1) = 2x + 5$  ⑤ $2x - 3y = 2x - 3y + 4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 미지수가 2개인 일차방정식은 $ax + by + c = 0$ ($a \ne 0, b \ne 0$)의 꼴이어야 한다. (ax)
2. ① $\frac{1}{2}x - 2y + 3 = 0$은 $x, y$ 2개의 미지수가 있고 차수가 모두 1이므로 일차방정식이다. (ax)
3. ②는 이차식, ③과 ⑤는 $x, y$가 소거되고, ④는 미지수가 1개뿐이다. (ax)
4. 따라서 옳은 것은 ①이다. (ax)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중에서 미지수가 $2$」
**RPM** M2-RPM-032 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 미지수가 2개인 일차방정식 > 미지수가 2개인 일차방정식 → 일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식**
- 이유: 연립일차방정식 단원의 미지수가 2개인 일차방정식의 정의에 일치한다. (ax)
**유형** PT=PT_M2_TWO_VARIABLE_LINEAR_EQUATION / TPL=NONE **원천→판정: PT_M2_LINEAR_EQUATION_TWO_VARS_TEST → PT_M2_TWO_VARIABLE_LINEAR_EQUATION** **원천→판정: TPL_EQUATION_TWO_VARS_TRUE_FALSE → NONE**
- 이유: 미지수가 두 개인 일차방정식을 판별하는 유형이다. (ax)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 미지수가 2개인 일차방정식의 기본 정의를 확인하는 기초 난이도 1 문항이다. (ax)

**4칸**
- given: 일차방정식←stem:「다음 중에서 미지수가 $2$개인 일차방정식인 것은?」
- goal: 미지수←stem:「미지수가 $2$개인 일차방정식인 것은?」
- method: 일차방정식(NAMED)←solution:「미지수가 $2$개인 일차방정식은 동류항을 모두 이항하여 정리했을 때」
- condition: (없음)

**how** 각 식의 동류항을 이항 정리하여 미지수가 2개인 일차식인지 판별했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

미지수가 $2$개인 일차방정식은 동류항을 모두 이항하여 정리했을 때 $ax + by + c = 0$ ($a, b, c$는 상수, $a \ne 0, b \ne 0$)의 꼴로 나타내어져야 한다.
$$
\begin{aligned}
\text{① } & \frac{1}{2}x - 2y + 3 = 0 \implies x, y\text{의 } 2\text{개의 미지수가 있고 모두 차수가 } 1\text{이므로 미지수가 } 2\text{개인 일차방정식이다. (참)} \
\text{② } & x^2 + 2y - 3x = 0 \implies x\text{의 최고차수가 } 2\text{이므로 일차방정식이 아니다. (거짓)} \
\text{③ } & 4x - y = 4x - 2y + 1 \implies y - 1 = 0 \implies x\text{가 소거되어 미지수가 } 1\text{개뿐이다. (거짓)} \
\text{④ } & 3x - 3 = 2x + 5 \implies x - 8 = 0 \implies 미지수가 } x \text{ } 1\text{개뿐이다. (거짓)} \
\text{⑤ } & 2x - 3y = 2x - 3y + 4 \implies 0 = 4 \implies 미지수가 모두 소거되어 거짓인 등식이 된다. (거짓)
\end{aligned}
$$
따라서 미지수가 $2$개인 일차방정식인 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

연립방정식 $\begin{cases} ax - 3y = 3 \ 3x + 2y = -1 \end{cases}$ 의 해가 $x = 3, y = b$ 일 때, $ab$의 값을 구하면? (단, $a, b$는 상수) [4점]

**보기** ① $-20$  ② $20$  ③ $-12$  ④ $15$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1단계: $x = 3, y = b$를 두 번째 식에 대입하면 $3(3) + 2b = -1 \implies 2b = -10 \implies b = -5$이다. (cases)
2. 2단계: $x = 3, y = -5$를 첫 번째 식에 대입하면 $3a - 3(-5) = 3 \implies 3a = -12 \implies a = -4$이다. (cases)
3. 3단계: 따라서 $ab = (-4) \times (-5) = 20$이다. (cases)
4. 그러므로 정답 ②이다. (cases)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-032 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 연립일차방정식의 풀이 > 해가 주어진 경우 → 일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식**
- 이유: 연립일차방정식 단원의 해가 주어진 연립방정식 계수 결정에 일치한다. (cases)
**유형** PT=PT_M2_SYSTEM_OF_EQUATIONS_COMMON_SOLUTION / TPL=NONE **원천→판정: PT_M2_SYSTEM_EQUATION_COEFFICIENT_GIVEN_SOLUTION → PT_M2_SYSTEM_OF_EQUATIONS_COMMON_SOLUTION** **원천→판정: TPL_SYSTEM_LINEAR_EQUATION_SUBSTITUTION_PRODUCT → NONE**
- 이유: 연립방정식의 해와 계수 관계를 이용한 미정계수 결정 유형이다. (cases)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 연립방정식의 해를 대입하여 미정계수를 구하는 기본 난이도 2 문항이다. (cases)

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} ax - 3y = 3 \ 3x + 2y = -1 \end{cases}$ 의 해가」
- goal: 상수←stem:「$ab$의 값을 구하면? (단, $a, b$는 상수)」
- method: 대입(NAMED)←solution:「$x = 3, y = b$를 두 번째 식 $3x + 2y = -1$에 대입하여 $b$를 구한다.」
- condition: (없음)

**how** 해가 주어진 연립방정식에서 미지수를 순차적으로 대입하여 a와 b를 구했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: $x = 3, y = b$를 두 번째 식 $3x + 2y = -1$에 대입하여 $b$를 구한다.
$$
\begin{aligned}
3(3) + 2b &= -1 \
9 + 2b &= -1 \
2b &= -10 \
b &= -5
\end{aligned}
$$


2단계: 구한 해 $x = 3, y = -5$를 첫 번째 식 $ax - 3y = 3$에 대입하여 $a$를 구한다.
$$
\begin{aligned}
a(3) - 3(-5) &= 3 \
3a + 15 &= 3 \
3a &= -12 \
a &= -4
\end{aligned}
$$


3단계: $ab$의 값을 계산한다.
$$
ab = (-4) \times (-5) = 20
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

연립방정식 $\begin{cases} \dfrac{x}{3} - 0.2y = 1.1 \ \dfrac{x}{6} - \dfrac{y-2}{3} = 2 \end{cases}$ 의 해가 일차방정식 $x - 2y = k$를 만족시킬 때, 상수 $k$의 값은? [4점]

**보기** ① $2$  ② $4$  ③ $6$  ④ $8$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 번째 식의 양변에 6을 곱하면 $x - 2(y - 2) = 12 \implies x - 2y + 4 = 12 \implies x - 2y = 8$이다. (cases)
2. 일차방정식 $x - 2y = k$를 만족하므로 $k = 8$이다. (cases)
3. 따라서 정답 ④이다. (cases)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-035 [일차부등식과 연립일차방정식 > 연립일차방정식 > 복잡한 꼴의 연립방정식 > 분수·소수가 있는 연립방정식] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 연립일차방정식의 풀이 > 복잡한 연립방정식 → 일차부등식과 연립일차방정식 > 연립일차방정식 > 복잡한 꼴의 연립방정식 > 분수·소수가 있는 연립방정식**
- 이유: 연립일차방정식 단원의 복잡한 꼴 분수 소수가 있는 연립방정식에 부합한다. (cases)
**유형** PT=PT_M2_SYSTEM_OF_EQUATIONS_DECIMAL_COEFFICIENTS / TPL=NONE **원천→판정: PT_M2_SYSTEM_EQUATION_EXPRESSION_EVALUATION → PT_M2_SYSTEM_OF_EQUATIONS_DECIMAL_COEFFICIENTS** **원천→판정: TPL_SYSTEM_LINEAR_COMBINATION_EVAL → NONE**
- 이유: 분수 소수 계수 연립방정식 정리 및 식의 값 결정 유형이다. (cases)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 복잡한 꼴의 연립방정식을 정리하여 목표 식의 값을 찾는 난이도 2 문항이다. (cases)

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} \dfrac{x}{3} - 0.2y = 1.1 \ \dfrac{x}{6} - \dfrac{y-2}{3} = 2 \end{cases}$ 의 해가」
- goal: 상수←stem:「상수 $k$의 값은?」
- method: 연립방정식(NAMED)←solution:「연립방정식의 두 번째 식을 정리하여 $x - 2y$의 형태를 직접 유도한다.」
- condition: (없음)

**how** 두 번째 식에 분모의 최소공배수를 곱해 x - 2y의 값을 직접 유도했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

연립방정식의 두 번째 식을 정리하여 $x - 2y$의 형태를 직접 유도한다.
$$
\frac{x}{6} - \frac{y-2}{3} = 2
$$
양변에 분모의 최소공배수인 $6$을 곱한다.
$$
\begin{aligned}
6 \times \left(\frac{x}{6}\right) - 6 \times \left(\frac{y-2}{3}\right) &= 6 \times 2 \
x - 2(y - 2) &= 12 \
x - 2y + 4 &= 12 \
x - 2y &= 12 - 4 \
x - 2y &= 8
\end{aligned}
$$
연립방정식의 해가 $x - 2y = k$를 만족시키므로
$$
k = 8
$$
그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

연립방정식 $\begin{cases} x + 2y = a \ 4x - by = 28 \end{cases}$ 의 해가 무수히 많을 때, $a - b$의 값을 구하면? (단, $a, b$는 상수) [4점]

**보기** ① $-15$  ② $-1$  ③ $1$  ④ $7$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 해가 무수히 많으려면 계수비와 상수비가 같아야 하므로 $\frac{1}{4} = \frac{2}{-b} = \frac{a}{28}$이다. (cases)
2. $-b = 8 \implies b = -8$이다. (cases)
3. $a = 28 / 4 = 7$이다. (cases)
4. 따라서 $a - b = 7 - (-8) = 15$이므로 정답 ⑤이다. (cases)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-036 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해가 특수한 연립방정식 > 해가 없거나 무수히 많은 경우] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 연립일차방정식의 풀이 > 특수한 해를 갖는 연립방정식 → 일차부등식과 연립일차방정식 > 연립일차방정식 > 해가 특수한 연립방정식 > 해가 없거나 무수히 많은 경우**
- 이유: 연립일차방정식 단원의 해가 무수히 많은 연립방정식 성질에 일치한다. (cases)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE **원천→판정: PT_M2_SYSTEM_EQUATION_INFINITE_SOLUTIONS → PT_M2_LINEAR_SYSTEM** **원천→판정: TPL_INFINITE_SOLUTIONS_COEFFICIENT_DIFF → NONE**
- 이유: 해가 특수한 연립방정식의 계수 결정 유형이다. (cases)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 해가 무수히 많은 연립방정식의 계수 비를 계산하는 표준 난이도 2 문항이다. (cases)

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} x + 2y = a \ 4x - by = 28 \end{cases}$ 의 해가 무수히 많을 때」
- goal: 상수←stem:「$a - b$의 값을 구하면? (단, $a, b$는 상수)」
- method: 일차방정식(NAMED)←solution:「연립방정식의 해가 무수히 많으려면 두 일차방정식의 계수와 상수항의 비가 모두 같아야 한다.」
- condition: (없음)

**how** 해가 무수히 많을 조건으로 계수비와 상수항비가 일치함을 이용하여 a와 b를 구했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

연립방정식의 해가 무수히 많으려면 두 일차방정식의 계수와 상수항의 비가 모두 같아야 한다.
즉, $\dfrac{1}{4} = \dfrac{2}{-b} = \dfrac{a}{28}$ 이 성립해야 한다.


1단계: $b$의 값을 구한다.
$$
\frac{1}{4} = \frac{2}{-b} \implies -b = 4 \times 2 = 8 \implies b = -8
$$


2단계: $a$의 값을 구한다.
$$
\frac{1}{4} = \frac{a}{28} \implies 4a = 28 \implies a = 7
$$


3단계: $a - b$의 값을 계산한다.
$$
a - b = 7 - (-8) = 7 + 8 = 15
$$
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

연립방정식 $\begin{cases} 2x - ay = 4 \ x - 5y = 6 \end{cases}$ 을 만족시키는 $x$의 값이 $y$의 $2$배일 때, 상수 $a$의 값을 구하면? [4점]

**보기** ① $-6$  ② $-4$  ③ $6$  ④ $8$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x = 2y$를 두 번째 식에 대입하면 $2y - 5y = 6 \implies -3y = 6 \implies y = -2, x = -4$이다. (cases)
2. 구한 해 $(-4, -2)$를 첫 번째 식에 대입하면 $2(-4) - a(-2) = 4 \implies -8 + 2a = 4 \implies 2a = 12 \implies a = 6$이다. (cases)
3. 따라서 정답 ③이다. (cases)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-032 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 연립일차방정식의 풀이 > 조건이 주어진 경우 → 일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식**
- 이유: 연립일차방정식 단원의 해와 계수 조건 및 계수 결정에 일치한다. (cases)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE **원천→판정: PT_M2_SYSTEM_EQUATION_GIVEN_RATIO_SOLVE → PT_M2_LINEAR_SYSTEM** **원천→판정: TPL_SYSTEM_LINEAR_VARIABLE_MULTIPLE_COEFF → NONE**
- 이유: 미지수 사이의 조건이 주어진 연립방정식 풀이 유형이다. (cases)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 조건식 x=2y를 추가로 연립하여 푸는 표준 난이도 2 문항이다. (cases)

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} 2x - ay = 4 \ x - 5y = 6 \end{cases}$ 을 만족시키는」
- goal: 상수←stem:「상수 $a$의 값을 구하면?」
- method: 대입(NAMED)←solution:「$x = 2y$를 두 번째 식 $x - 5y = 6$에 대입한다.」
- condition: (없음)

**how** x와 y의 비례 관계식 x=2y를 연립하여 해를 구한 뒤 미정계수 a를 결정했다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

$x$의 값이 $y$의 $2$배이므로 다음 관계식이 성립한다.
$$
x = 2y
$$
1단계: $x = 2y$를 두 번째 식 $x - 5y = 6$에 대입한다.
$$
\begin{aligned}
2y - 5y &= 6 \
-3y &= 6 \
y &= -2
\end{aligned}
$$
따라서 $x$의 값은
$$
x = 2(-2) = -4
$$


2단계: 구한 해 $x = -4, y = -2$를 첫 번째 식 $2x - ay = 4$에 대입하여 $a$를 구한다.
$$
\begin{aligned}
2(-4) - a(-2) &= 4 \
-8 + 2a &= 4 \
2a &= 12 \
a &= 6
\end{aligned}
$$
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

모양과 크기가 같은 직사각형 모양의 타일 여러 장을 이어 붙이려고 한다. 가로의 길이를 $x\,\mathrm{cm}$, 세로의 길이를 $y\,\mathrm{cm}$라 하자 ($x > y$). 타일을 이어 붙였을 때 다음 두 조건이 성립한다.
- 가로로 $2$장 이어 붙인 길이와 세로로 $3$장 이어 붙인 길이의 차가 $8\,\mathrm{cm}$이다.
- 가로로 $1$장, 세로로 $2$장을 이어 붙인 길이의 합이 $18\,\mathrm{cm}$이다.
이때 직사각형 타일 $1$장의 넓이를 구하면? [4점]

**보기** ① $40\,\mathrm{cm}^2$  ② $36\,\mathrm{cm}^2$  ③ $44\,\mathrm{cm}^2$  ④ $48\,\mathrm{cm}^2$  ⑤ $50\,\mathrm{cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 조건에 따라 연립방정식을 세우면 $2x - 3y = 8, x + 2y = 18$이다. (cm)
2. $x = 18 - 2y$를 첫 식에 대입하면 $2(18 - 2y) - 3y = 8 \implies 36 - 7y = 8 \implies 7y = 28 \implies y = 4$이다. (cm)
3. $x = 18 - 2(4) = 10$이다. (cm)
4. 타일 1장의 넓이는 $xy = 10 \times 4 = 40\,\mathrm{cm}^2$이므로 정답 ①이다. (cm)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD(연립일차방정식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「모양과 크기가 같은 직사각형」
**RPM** M2-RPM-038 [일차부등식과 연립일차방정식 > 연립일차방정식의 활용 > 수와 개수 > 두 수 관계] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 연립일차방정식의 활용 > 도형에 대한 문제 → 일차부등식과 연립일차방정식 > 연립일차방정식의 활용 > 수와 개수 > 두 수 관계**
- 이유: 연립일차방정식의 활용 단원의 도형에 관한 수량 관계에 일치한다. (cm)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE **원천→판정: PT_M2_SYSTEM_EQUATION_GEOMETRY → PT_M2_LINEAR_SYSTEM** **원천→판정: TPL_RECTANGLE_COMBINATION_SYSTEM_EQUATION → NONE**
- 이유: 도형의 길이와 넓이에 관한 연립일차방정식 활용 유형이다. (cm)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 도형의 변의 길이 관계를 연립방정식으로 모델링하는 난이도 2 활용 문항이다. (cm)

**4칸**
- given: 직사각형←stem:「모양과 크기가 같은 직사각형 모양의 타일 여러 장을 이어 붙이려고 한다.」
- goal: 넓이←stem:「이때 직사각형 타일 $1$장의 넓이를 구하면?」
- method: 연립방정식(NAMED)←solution:「문제의 조건에 따라 연립방정식을 세운다.」
- condition: (없음)

**how** 가로 세로 길이 조건을 연립방정식으로 세워 길이를 구하고 넓이를 계산했다. (cm)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 문제의 조건에 따라 연립방정식을 세운다.
$$
\begin{cases}
2x - 3y = 8 \
x + 2y = 18
\end{cases}
$$


2단계: 연립방정식을 푼다.
두 번째 식에서 $x = 18 - 2y$를 첫 번째 식에 대입한다.
$$
\begin{aligned}
2(18 - 2y) - 3y &= 8 \
36 - 4y - 3y &= 8 \
-7y &= 8 - 36 \
-7y &= -28 \
y &= 4
\end{aligned}
$$
$y = 4$를 $x = 18 - 2y$에 대입한다.
$$
x = 18 - 2(4) = 18 - 8 = 10
$$


3단계: 직사각형 타일 $1$장의 넓이를 구한다.
$$
\text{넓이} = x \times y = 10 \times 4 = 40\,\mathrm{cm}^2
$$
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

총 거리가 $8\,\mathrm{km}$인 건강 걷기 대회에 참가하였다. 처음에는 분속 $120\,\mathrm{m}$로 걷다가 도중에 힘이 들어 분속 $80\,\mathrm{m}$로 걸어서 $1$시간 $20$분($80$분) 만에 완주하였다. 이때 분속 $120\,\mathrm{m}$로 걸은 거리는? [5점]

**보기** ① $3600\,\mathrm{m}$  ② $4800\,\mathrm{m}$  ③ $5200\,\mathrm{m}$  ④ $5600\,\mathrm{m}$  ⑤ $6000\,\mathrm{m}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 단위 통일: 총 거리 $8000\,\mathrm{m}$, 총 시간 $80$분. (km)
2. 분속 $120\,\mathrm{m}$ 걸은 시간 $x$, 분속 $80\,\mathrm{m}$ 시간 $y$라 하면 $x + y = 80, 120x + 80y = 8000$이다. (km)
3. 식 정리: $3x + 2y = 200$. $2(x+y) = 160$과 빼면 $x = 40$분이다. (km)
4. 분속 $120\,\mathrm{m}$로 걸은 거리는 $120 \times 40 = 4800\,\mathrm{m}$이다. (km)
5. 따라서 정답 ②이다. (km)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD(연립일차방정식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「총 거리가 $8\,\math」
**RPM** M2-RPM-042 [일차부등식과 연립일차방정식 > 연립일차방정식의 활용 > 농도·비율 > 농도 혼합] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 연립일차방정식의 활용 > 거리·속력·시간 → 일차부등식과 연립일차방정식 > 연립일차방정식의 활용 > 농도·비율 > 농도 혼합**
- 이유: 연립일차방정식의 활용 단원의 거리 속력 시간 문제에 일치한다. (km)
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE **원천→판정: PT_M2_SYSTEM_EQUATION_SPEED_DISTANCE_TIME → PT_M2_LINEAR_SYSTEM** **원천→판정: TPL_SPEED_CHANGE_TOTAL_DISTANCE_TIME → NONE**
- 이유: 거리 속력 시간 상황을 연립방정식으로 모델링하는 대표 활용 유형이다. (km)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단위 환산과 속력, 시간, 거리 연립식을 정확히 풀어내는 난이도 3 문항이다. (km)

**4칸**
- given: 거리←stem:「총 거리가 $8\,\mathrm{km}$인 건강 걷기 대회에 참가하였다.」
- goal: 거리←stem:「이때 분속 $120\,\mathrm{m}$로 걸은 거리는?」
- method: 연립방정식(NAMED)←solution:「미지수를 정하고 연립방정식을 세운다.」
- condition: (없음)

**how** 단위를 분과 미터로 맞추고 시간과 거리 연립방정식을 세워 걸은 거리를 계산했다. (km)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 단위를 통일한다.
총 거리: $8\,\mathrm{km} = 8000\,\mathrm{m}$
총 걸린 시간: $1\text{시간 } 20\text{분} = 80\text{분}$


2단계: 미지수를 정하고 연립방정식을 세운다.
분속 $120\,\mathrm{m}$로 걸은 시간을 $x$분, 분속 $80\,\mathrm{m}$로 걸은 시간을 $y$분이라 하면
$$
\begin{cases}
x + y = 80 \
120x + 80y = 8000
\end{cases}
$$


3단계: 연립방정식을 푼다.
두 번째 식의 양변을 $40$으로 나눈다.
$$
3x + 2y = 200
$$
첫 번째 식의 양변에 $2$를 곱한다.
$$
2x + 2y = 160
$$
두 식을 변끼리 빼면
$$
(3x + 2y) - (2x + 2y) = 200 - 160 \implies x = 40\text{분}
$$


4단계: 분속 $120\,\mathrm{m}$로 걸은 거리를 계산한다.
$$
\text{거리} = 120 \times 40 = 4800\,\mathrm{m}
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중에서 $y$가 $x$의 일차함수가 아닌 것은? [3점]

**보기** ① 한 변의 길이가 $x\,\mathrm{cm}$인 정삼각형의 둘레의 길이 $y\,\mathrm{cm}$  ② 시속 $70\,\mathrm{km}$로 $x$시간 동안 달린 자동차의 이동 거리 $y\,\mathrm{km}$  ③ 한 자루에 $500$원인 볼펜 $x$자루를 사고 $5000$원을 냈을 때의 거스름돈 $y$원  ④ 넓이가 $30\,\mathrm{cm}^2$인 평행사변형의 밑변의 길이가 $x\,\mathrm{cm}$일 때, 높이 $y\,\mathrm{cm}$  ⑤ $100\,\mathrm{L}$의 물이 담긴 물통에서 매분 $4\,\mathrm{L}$씩 물을 뺄 때, $x$분 후 남아 있는 물의 양 $y\,\mathrm{L}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① $y = 3x$ (일차함수). (cm)
2. ② $y = 70x$ (일차함수). (cm)
3. ③ $y = 5000 - 500x$ (일차함수). (cm)
4. ④ $xy = 30 \implies y = 30/x$ (반비례 관계이므로 일차함수가 아님). (cm)
5. ⑤ $y = 100 - 4x$ (일차함수). (cm)
6. 따라서 일차함수가 아닌 것은 ④이다. (cm)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중에서 $y$가 $x$」
**RPM** M2-RPM-047 [일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 일차함수 판별] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻과 그래프 > 일차함수의 뜻 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 일차함수 판별**
- 이유: 일차함수 단원의 일차함수의 뜻 일차함수 판별에 일치한다. (cm)
**유형** PT=PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION / TPL=NONE **원천→판정: PT_M2_LINEAR_FUNCTION_IDENTIFICATION → PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION** **원천→판정: TPL_REAL_WORLD_LINEAR_FUNCTION_AUDIT → NONE**
- 이유: 실생활 상황의 관계식에서 일차함수를 판별하는 유형이다. (cm)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 일차함수의 식의 꼴(y=ax+b)을 기본 판별하는 난이도 1 문항이다. (cm)

**4칸**
- given: 일차함수←stem:「다음 중에서 $y$가 $x$의 일차함수가 아닌 것은?」
- goal: 일차함수←stem:「일차함수가 아닌 것은?」
- method: 일차함수(NAMED)←solution:「각 보기를 $x$와 $y$ 사이의 관계식으로 나타낸다.」
- condition: (없음)

**how** 각 문장의 관계식을 세워 y=ax+b 꼴인지 반비례식인지 확인했다. (cm)

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 $x$와 $y$ 사이의 관계식으로 나타낸다.
$$
\begin{aligned}
\text{① } & y = 3x \implies y = ax + b \text{ 꼴이므로 일차함수이다.} \
\text{② } & y = 70x \implies y = ax + b \text{ 꼴이므로 일차함수이다.} \
\text{③ } & y = 5000 - 500x = -500x + 5000 \implies y = ax + b \text{ 꼴이므로 일차함수이다.} \
\text{④ } & x \times y = 30 \implies y = \frac{30}{x} \implies y\text{가 } x\text{에 반비례하는 함수이므로 일차함수가 아니다. (참)} \
\text{⑤ } & y = 100 - 4x = -4x + 100 \implies y = ax + b \text{ 꼴이므로 일차함수이다.}
\end{aligned}
$$
따라서 $y$가 $x$의 일차함수가 아닌 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

함수 $f(x) = -\dfrac{18}{x} + 4$ 에 대하여 $3f(9) + f(-3)$의 값을 구하면? [4점]

**보기** ① $8$  ② $10$  ③ $12$  ④ $14$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $f(9) = -18/9 + 4 = -2 + 4 = 2$이다. (18)
2. $f(-3) = -18/(-3) + 4 = 6 + 4 = 10$이다. (18)
3. $3f(9) + f(-3) = 3(2) + 10 = 6 + 10 = 16$이다. (18)
4. 따라서 정답 ⑤이다. (18)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x) = -\df」
**RPM** M2-RPM-046 [일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 함숫값] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻과 그래프 > 함숫값 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 함숫값**
- 이유: 일차함수 단원의 일차함수의 뜻 함숫값 계산에 일치한다. (18)
**유형** PT=PT_FUNCTION_VALUE / TPL=NONE **원천→판정: PT_M2_FUNCTION_VALUE_EVALUATION → PT_FUNCTION_VALUE** **원천→판정: TPL_FUNCTION_VALUE_LINEAR_COMBINATION → NONE**
- 이유: 함수식에 독립변수 값을 대입하여 함숫값의 결합을 계산하는 유형이다. (18)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 함수식에 값을 대입해 사칙계산을 수행하는 표준 난이도 2 문항이다. (18)

**4칸**
- given: 함수←stem:「함수 $f(x) = -\dfrac{18}{x} + 4$ 에 대하여」
- goal: 함수←stem:「$3f(9) + f(-3)$의 값을 구하면?」
- method: 함수(NAMED)←solution:「$f(9)$의 값을 구한다.」
- condition: (없음)

**how** 주어진 함수식에 x=9와 x=-3을 대입하여 함숫값을 각각 구하고 결합했다. (18)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: $f(9)$의 값을 구한다.
$$
f(9) = -\frac{18}{9} + 4 = -2 + 4 = 2
$$


2단계: $f(-3)$의 값을 구한다.
$$
f(-3) = -\frac{18}{-3} + 4 = 6 + 4 = 10
$$


3단계: $3f(9) + f(-3)$의 값을 계산한다.
$$
\begin{aligned}
3f(9) + f(-3) &= 3(2) + 10 \
&= 6 + 10 \
&= 16
\end{aligned}
$$
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차함수 $y = \dfrac{3}{4}x - 3$ 의 그래프를 $y$축의 방향으로 $\dfrac{3}{2}$만큼 평행이동한 그래프의 $x$절편을 구하면? [4점]

**보기** ① $-2$  ② $1$  ③ $2$  ④ $3$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평행이동한 식: $y = 3/4 x - 3 + 3/2 = 3/4 x - 3/2$이다. (aligned)
2. $x$절편을 구하기 위해 $y = 0$을 대입하면 $3/4 x - 3/2 = 0 \implies 3/4 x = 3/2 \implies x = 2$이다. (aligned)
3. 따라서 정답 ③이다. (aligned)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = \dfra」
**RPM** M2-RPM-050 [일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻과 그래프 > 평행이동 → 일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치**
- 이유: 일차함수 단원의 일차함수 그래프의 평행이동 및 절편에 일치한다. (aligned)
**유형** PT=PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION / TPL=NONE **원천→판정: PT_M2_LINEAR_FUNCTION_TRANSLATION_INTERCEPT → PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION** **원천→판정: TPL_LINEAR_FUNCTION_Y_SHIFT_X_INTERCEPT → NONE**
- 이유: 일차함수의 평행이동과 절편 계산 유형이다. (aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행이동된 일차함수의 식에서 x절편을 구하는 난이도 2 문항이다. (aligned)

**4칸**
- given: 일차함수←stem:「일차함수 $y = \dfrac{3}{4}x - 3$ 의 그래프를 $y$축의 방향으로 $\dfrac{3}{2}$만큼 평행이동한」
- goal: 일차함수←stem:「그래프의 $x$절편을 구하면?」
- method: 평행이동(NAMED)←solution:「평행이동한 일차함수의 식을 구한다.」
- condition: (없음)

**how** y축 평행이동한 식을 구하고 y=0을 대입하여 x절편을 계산했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 평행이동한 일차함수의 식을 구한다.
일차함수 $y = \dfrac{3}{4}x - 3$의 그래프를 $y$축의 방향으로 $\dfrac{3}{2}$만큼 평행이동하면
$$
\begin{aligned}
y &= \frac{3}{4}x - 3 + \frac{3}{2} \
&= \frac{3}{4}x - \frac{6}{2} + \frac{3}{2} \
&= \frac{3}{4}x - \frac{3}{2}
\end{aligned}
$$


2단계: $x$절편을 구한다.
$x$절편은 그래프가 $x$축과 만나는 점의 $x$좌표이므로 $y = 0$을 대입한다.
$$
\begin{aligned}
0 &= \frac{3}{4}x - \frac{3}{2} \
\frac{3}{4}x &= \frac{3}{2} \
x &= \frac{3}{2} \times \frac{4}{3} = 2
\end{aligned}
$$
따라서 $x$절편은 $2$이다.
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차함수 $y = ax + b$의 그래프는 일차함수 $y = 2x - 5$의 그래프와 평행하고, 일차함수 $y = \dfrac{2}{3}x - 4$의 그래프와 $x$축 위에서 만난다고 한다. 이때 $a + b$의 값을 구하면? (단, $a, b$는 상수) [4점]

**보기** ① $-10$  ② $-8$  ③ $-6$  ④ $6$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평행하므로 기울기 $a = 2$이다. (ax)
2. $y = 2/3 x - 4$의 $x$절편은 $2/3 x = 4 \implies x = 6$이므로 점 $(6, 0)$에서 만난다. (ax)
3. $(6, 0)$을 $y = 2x + b$에 대입하면 $0 = 12 + b \implies b = -12$이다. (ax)
4. 따라서 $a + b = 2 + (-12) = -10$이므로 정답 ①이다. (ax)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = ax +」
**RPM** M2-RPM-050 [일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프의 성질 > 평행과 일치 → 일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치**
- 이유: 일차함수 단원의 그래프 평행 일치 조건 및 식 구하기에 일치한다. (ax)
**유형** PT=PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION / TPL=NONE **원천→판정: PT_M2_LINEAR_FUNCTION_PARALLEL_AND_POINT → PT_M2_LINEAR_FUNCTIONS_PARALLEL_CONDITION** **원천→판정: TPL_LINEAR_FUNCTION_PARALLEL_X_AXIS_MEET → NONE**
- 이유: 평행 조건과 절편 조건으로 일차함수 식을 완성하는 유형이다. (ax)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행 조건과 축 위의 교점 조건을 결합하는 표준 난이도 2 문항이다. (ax)

**4칸**
- given: 일차함수←stem:「일차함수 $y = ax + b$의 그래프는 일차함수 $y = 2x - 5$의 그래프와 평행하고」
- goal: 상수←stem:「$a + b$의 값을 구하면? (단, $a, b$는 상수)」
- method: 기울기(NAMED)←solution:「일차함수 $y = ax + b$의 그래프가 $y = 2x - 5$의 그래프와 평행하므로 기울기가 같다.」
- condition: (없음)

**how** 평행 조건으로 기울기 a를 정하고 다른 직선의 x절편을 대입해 b를 구했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 기울기 $a$를 구한다.
일차함수 $y = ax + b$의 그래프가 $y = 2x - 5$의 그래프와 평행하므로 기울기가 같다.
$$
a = 2
$$


2단계: $x$축과의 교점을 구한다.
$y = \dfrac{2}{3}x - 4$의 그래프가 $x$축과 만나는 점($x$절편)을 구하기 위해 $y = 0$을 대입한다.
$$
\frac{2}{3}x - 4 = 0 \implies \frac{2}{3}x = 4 \implies x = 4 \times \frac{3}{2} = 6
$$
따라서 교점의 좌표는 $(6, 0)$이다.


3단계: $y$절편 $b$를 구한다.
$y = 2x + b$의 그래프가 점 $(6, 0)$을 지나므로 대입한다.
$$
0 = 2(6) + b \implies 12 + b = 0 \implies b = -12
$$


4단계: $a + b$의 값을 계산한다.
$$
a + b = 2 + (-12) = -10
$$
그러므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차함수 $y = -4x + \dfrac{5}{2}$ 의 그래프에서 $x$의 값이 $3$만큼 감소할 때, $y$의 값은 $k$만큼 증가한다고 한다. 이때 상수 $k$의 값을 구하면? [3점]

**보기** ① $-12$  ② $12$  ③ $7$  ④ $-7$  ⑤ $\dfrac{4}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 일차함수의 기울기는 $-4$이다. (12)
2. $x$의 변화량이 $-3$이고 $y$의 증가량이 $k$이므로 기울기 공식에 대입하면 $\frac{k}{-3} = -4$이다. (12)
3. $k = (-4) \times (-3) = 12$이다. (12)
4. 따라서 정답 ②이다. (12)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = -4x +」
**RPM** M2-RPM-048 [일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻과 그래프 > 기울기 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편**
- 이유: 일차함수 단원의 일차함수의 그래프 기울기 절편의 정의에 일치한다. (12)
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=NONE **원천→판정: PT_M2_LINEAR_FUNCTION_SLOPE_CALCULATION → PT_FUNCTION_GRAPH_PROPERTIES** **원천→판정: TPL_SLOPE_RATIO_VARIABLE_SOLVE → NONE**
- 이유: 기울기의 정의를 이용한 변수 증가량 계산 유형이다. (12)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기울기의 기본 정의 공식을 대입하여 푸는 기초 난이도 1 문항이다. (12)

**4칸**
- given: 일차함수←stem:「일차함수 $y = -4x + \dfrac{5}{2}$ 의 그래프에서 $x$의 값이 $3$만큼 감소할 때」
- goal: 상수←stem:「상수 $k$의 값을 구하면?」
- method: 기울기(NAMED)←solution:「일차함수 $y = ax + b$에서 기울기 $a$의 정의는」
- condition: (없음)

**how** 기울기의 정의(x의 증가량 분의 y의 증가량)를 이용하여 k를 계산했다. (12)

<details><summary>저장 해설 (판정 검토용)</summary>

일차함수 $y = ax + b$에서 기울기 $a$의 정의는 다음과 같다.
$$
\text{기울기} = \frac{y\text{의 값의 증가량}}{x\text{의 값의 증가량}}
$$
주어진 일차함수의 기울기는 $-4$이다.
$x$의 값이 $3$만큼 감소하므로 $x$의 값의 변화량은 $-3$이다.
$y$의 값의 증가량이 $k$이므로
$$
\frac{k}{-3} = -4
$$
양변에 $-3$을 곱하여 $k$의 값을 구한다.
$$
k = (-4) \times (-3) = 12
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

세 점 $(-2, -1)$, $(3, k)$, $(5, k+6)$ 이 한 직선 위에 있을 때, 상수 $k$의 값을 구하면? [4점]

**보기** ① $8$  ② $10$  ③ $12$  ④ $14$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 점이 한 직선 위에 있으므로 두 점씩 택한 기울기가 같다. (10)
2. 두 점 $(3, k)$와 $(5, k+6)$의 기울기는 $\frac{(k+6) - k}{5 - 3} = \frac{6}{2} = 3$이다. (10)
3. 두 점 $(-2, -1)$과 $(3, k)$의 기울기도 3이어야 하므로 $\frac{k - (-1)}{3 - (-2)} = \frac{k + 1}{5} = 3$이다. (10)
4. $k + 1 = 15 \implies k = 14$이다. (10)
5. 따라서 정답 ④이다. (10)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 점 $(-2, -1)$,」
**RPM** M2-RPM-052 [일차함수 > 일차함수와 그 그래프 > 식 구하기 > 두 점으로 식 구하기] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프의 성질 > 세 점이 한 직선 위에 있을 조건 → 일차함수 > 일차함수와 그 그래프 > 식 구하기 > 두 점으로 식 구하기**
- 이유: 일차함수 단원의 식 구하기 두 점으로 식 구하기에 일치한다. (10)
**유형** PT=PT_LINE_RELATION / TPL=NONE **원천→판정: PT_M2_COLLINEAR_POINTS_SLOPE → PT_LINE_RELATION** **원천→판정: TPL_THREE_POINTS_COLLINEAR_PARAMETER_SOLVE → NONE**
- 이유: 세 점이 한 직선 위에 있을 조건 판정 유형이다. (10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기울기 일치 조건을 세워 일차방정식을 푸는 표준 난이도 2 문항이다. (10)

**4칸**
- given: 직선←stem:「세 점 $(-2, -1)$, $(3, k)$, $(5, k+6)$ 이 한 직선 위에 있을 때」
- goal: 상수←stem:「상수 $k$의 값을 구하면?」
- method: 기울기(NAMED)←solution:「세 점이 한 직선 위에 있으므로, 임의의 두 점을 택하여 구한 기울기가 모두 서로 같아야 한다.」
- condition: (없음)

**how** 세 점이 한 직선 위에 있을 조건(두 점 사이의 기울기 일치)으로 방정식을 풀었다. (10)

<details><summary>저장 해설 (판정 검토용)</summary>

세 점이 한 직선 위에 있으므로, 임의의 두 점을 택하여 구한 기울기가 모두 서로 같아야 한다.
1단계: 점 $(3, k)$와 점 $(5, k+6)$을 지나는 직선의 기울기를 구한다.
$$
\text{기울기} = \frac{(k+6) - k}{5 - 3} = \frac{6}{2} = 3
$$


2단계: 점 $(-2, -1)$과 점 $(3, k)$를 지나는 직선의 기울기도 $3$이어야 하므로 식을 세운다.
$$
\begin{aligned}
\frac{k - (-1)}{3 - (-2)} &= 3 \
\frac{k + 1}{5} &= 3 \
k + 1 &= 15 \
k &= 14
\end{aligned}
$$
그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차방정식 $2x + ky - 4k = 0$ 의 그래프가 점 $(3, -2)$를 지날 때, 이 그래프가 $x$축과 만나는 점의 좌표를 구하면? (단, $k$는 상수) [4점]

**보기** ① $(0, 2)$  ② $(0, 4)$  ③ $(1, 0)$  ④ $(4, 0)$  ⑤ $(2, 0)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 $(3, -2)$ 대입: $2(3) + k(-2) - 4k = 0 \implies 6 - 6k = 0 \implies k = 1$이다. (ky)
2. 방정식은 $2x + y - 4 = 0$이다. (ky)
3. $x$축과의 교점을 구하기 위해 $y = 0$ 대입: $2x - 4 = 0 \implies x = 2$이다. (ky)
4. 따라서 교점의 좌표는 $(2, 0)$이므로 정답 ⑤이다. (ky)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차방정식 $2x + ky」
**RPM** M2-RPM-054 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 일차함수와 일차방정식의 관계 > 일차방정식의 그래프 → 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프**
- 이유: 일차함수와 일차방정식 단원의 일차방정식의 그래프와 점 대입에 일치한다. (ky)
**유형** PT=PT_M2_LINEAR_EQUATION_POINT_SUBSTITUTION / TPL=NONE **원천→판정: PT_M2_LINEAR_EQUATION_COEFF_AND_INTERCEPT → PT_M2_LINEAR_EQUATION_POINT_SUBSTITUTION** **원천→판정: TPL_LINEAR_EQUATION_SUBSTITUTE_THEN_INTERCEPT → NONE**
- 이유: 그래프 위의 점을 이용한 미지수 결정 및 절편 좌표 구하기 유형이다. (ky)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 좌표 대입으로 미정계수를 찾고 절편 좌표를 구하는 난이도 2 문항이다. (ky)

**4칸**
- given: 일차방정식←stem:「일차방정식 $2x + ky - 4k = 0$ 의 그래프가 점 $(3, -2)$를 지날 때」
- goal: 좌표←stem:「이 그래프가 $x$축과 만나는 점의 좌표를 구하면?」
- method: 일차방정식(NAMED)←solution:「점 $(3, -2)$를 일차방정식 $2x + ky - 4k = 0$에 대입하여 $k$의 값을 구한다.」
- condition: (없음)

**how** 지나는 점의 좌표를 대입해 k를 구하고 y=0을 대입해 x축 교점 좌표를 구했다. (ky)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 점 $(3, -2)$를 일차방정식 $2x + ky - 4k = 0$에 대입하여 $k$의 값을 구한다.
$$
\begin{aligned}
2(3) + k(-2) - 4k &= 0 \
6 - 2k - 4k &= 0 \
6 - 6k &= 0 \
6k &= 6 \
k &= 1
\end{aligned}
$$


2단계: $k = 1$을 대입하여 일차방정식을 완성한다.
$$
2x + y - 4 = 0
$$


3단계: 그래프가 $x$축과 만나는 점의 좌표를 구한다.
$x$축 위의 점은 $y = 0$이므로 대입한다.
$$
2x - 4 = 0 \implies 2x = 4 \implies x = 2
$$
따라서 $x$축과 만나는 점의 좌표는 $(2, 0)$이다.
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

직사각형 $ABCD$에서 가로 $BC = 12\,\mathrm{cm}$, 세로 $AB = 8\,\mathrm{cm}$이다. 점 $P$가 점 $B$를 출발하여 점 $C$를 향해 변 $BC$ 위를 매초 $2\,\mathrm{cm}$의 속력으로 움직이고 있다. 점 $P$가 점 $B$를 출발한 지 $x$초 후에 사다리꼴 $APCD$의 넓이가 $64\,\mathrm{cm}^2$가 된다고 할 때, $x$의 값을 구하면? [5점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x$초 후 $BP = 2x\,\mathrm{cm}$이므로 $PC = 12 - 2x\,\mathrm{cm}$이다. (ABCD)
2. 사다리꼴 $APCD$의 윗변 $AD = 12$, 아랫변 $PC = 12 - 2x$, 높이 $AB = 8$이다. (ABCD)
3. 넓이 공식: $1/2 \times [12 + (12 - 2x)] \times 8 = 4(24 - 2x) = 96 - 8x$이다. (ABCD)
4. $96 - 8x = 64 \implies 8x = 32 \implies x = 4$이다. (ABCD)
5. 따라서 정답 ③이다. (ABCD)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQUATION → M2-04-LINEAR_FUNCTION_BASIC**
- 근거 인용: 「직사각형 $ABCD$에서 가」
**RPM** M2-RPM-053 [일차함수 > 일차함수와 그 그래프 > 식 구하기 > 기울기와 한 점으로 식 구하기] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 일차함수와 일차방정식의 관계 > 도형에의 활용 → 일차함수 > 일차함수와 그 그래프 > 식 구하기 > 기울기와 한 점으로 식 구하기**
- 이유: 일차함수 단원의 일차함수의 활용 도형에 관한 문제에 일치한다. (ABCD)
**유형** PT=PT_M2_LINEAR_FUNCTION / TPL=NONE **원천→판정: PT_M2_LINEAR_FUNCTION_MOVING_POINT_AREA → PT_M2_LINEAR_FUNCTION** **원천→판정: TPL_MOVING_POINT_TRAPEZOID_AREA_EQUATION → NONE**
- 이유: 도형 위를 움직이는 점에 따른 넓이 변화의 일차함수 활용 유형이다. (ABCD)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 도형 위 동점의 이동에 따른 넓이 변화를 일차방정식으로 푸는 난이도 3 문항이다. (ABCD)

**4칸**
- given: 직사각형←stem:「직사각형 $ABCD$에서 가로 $BC = 12\,\mathrm{cm}$, 세로 $AB = 8\,\mathrm{cm}$이다.」
- goal: 사다리꼴←stem:「사다리꼴 $APCD$의 넓이가 $64\,\mathrm{cm}^2$가 된다고 할 때, $x$의 값을 구하면?」
- method: 사다리꼴(NAMED)←solution:「사다리꼴 $APCD$의 넓이를 구하는 관계식을 세운다.」
- condition: (없음)

**how** 동점 P의 이동거리를 x로 나타내어 사다리꼴의 넓이 일차함수 식을 세워 풀었다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: $x$초 후 선분의 길이를 $x$에 대한 식으로 나타낸다.
점 $P$가 매초 $2\,\mathrm{cm}$로 움직이므로
$$
BP = 2x\,\mathrm{cm}
$$
변 $BC = 12\,\mathrm{cm}$이므로 선분 $PC$의 길이는
$$
PC = 12 - 2x\,\mathrm{cm}
$$


2단계: 사다리꼴 $APCD$의 넓이를 구하는 관계식을 세운다.
윗변 $AD = 12\,\mathrm{cm}$, 아랫변 $PC = (12 - 2x)\,\mathrm{cm}$, 높이 $CD = 8\,\mathrm{cm}$이므로
$$
\begin{aligned}
\text{사다리꼴 } APCD\text{의 넓이} &= \frac{1}{2} \times (AD + PC) \times CD \
&= \frac{1}{2} \times {12 + (12 - 2x)} \times 8 \
&= 4 \times (24 - 2x) \
&= 96 - 8x
\end{aligned}
$$


3단계: 사다리꼴의 넓이가 $64\,\mathrm{cm}^2$가 되는 $x$를 구한다.
$$
\begin{aligned}
96 - 8x &= 64 \
-8x &= 64 - 96 \
-8x &= -32 \
x &= 4
\end{aligned}
$$
따라서 점 $P$가 출발한 지 $4$초 후이다.
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차방정식 $4x + 3y - 12 = 0$ 의 그래프에 대한 설명으로 옳은 것은? [4점]

**보기** ① $x$절편은 $3$이고, $y$절편은 $4$이다.  ② 점 $(3, 4)$를 지난다.  ③ 제$4$사분면을 지나지 않는다.  ④ $x$의 값이 증가하면 $y$의 값도 증가한다.  ⑤ 일차함수 $y = \dfrac{4}{3}x$의 그래프를 $y$축의 방향으로 $4$만큼 평행이동한 것이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 일차함수 꼴로 정리: $3y = -4x + 12 \implies y = -4/3 x + 4$이다. (12)
2. $y = 0$ 대입 시 $x$절편은 $3$, $x = 0$ 대입 시 $y$절편은 $4$이다. (12)
3. 따라서 $x$절편은 $3$이고 $y$절편은 $4$라는 ①의 설명이 옳다. (12)
4. 그러므로 정답 ①이다. (12)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차방정식 $4x + 3y」
**RPM** M2-RPM-054 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 일차함수와 일차방정식의 관계 > 일차방정식의 그래프 → 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프**
- 이유: 일차함수와 일차방정식 단원의 일차방정식의 그래프 성질에 일치한다. (12)
**유형** PT=PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES / TPL=NONE **원천→판정: PT_M2_LINEAR_EQUATION_PROPERTIES_CHECK → PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES** **원천→판정: TPL_LINEAR_EQUATION_GRAPH_PROPERTIES_AUDIT → NONE**
- 이유: 일차방정식 그래프의 절편과 성질 설명 판정 유형이다. (12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 일차방정식의 그래프 성질을 일차함수와 연결하여 확인하는 난이도 2 문항이다. (12)

**4칸**
- given: 일차방정식←stem:「일차방정식 $4x + 3y - 12 = 0$ 의 그래프에 대한 설명으로 옳은 것은?」
- goal: 일차방정식←stem:「그래프에 대한 설명으로 옳은 것은?」
- method: 일차방정식(NAMED)←solution:「일차방정식을 $y$에 대하여 정리하여 일차함수의 꼴로 나타낸다.」
- condition: (없음)

**how** 일차방정식을 표준형으로 정리하여 절편, 지나는 점, 기울기를 분석했다. (12)

<details><summary>저장 해설 (판정 검토용)</summary>

일차방정식을 $y$에 대하여 정리하여 일차함수의 꼴로 나타낸다.
$$
3y = -4x + 12 \implies y = -\frac{4}{3}x + 4
$$
각 선지의 설명을 검토한다.
$$
\begin{aligned}
\text{① } & x\text{절편: } y = 0 \implies -\frac{4}{3}x + 4 = 0 \implies x = 3 \
& y\text{절편: } x = 0 \implies y = 4 \
& \text{따라서 } x\text{절편은 } 3\text{이고, } y\text{절편은 } 4\text{이다. (참)} \
\text{② } & x = 3, y = 4\text{를 대입하면 } 4(3) + 3(4) - 12 = 12 \ne 0\text{이므로 점 } (3, 4)\text{를 지나지 않는다. (거짓)} \
\text{③ } & \text{기울기가 } -\frac{4}{3} < 0\text{이고 } y\text{절편이 } 4 > 0\text{이므로 제}1, 2, 4\text{사분면을 지나고 제}3\text{사분면을 지나지 않는다. (거짓)} \
\text{④ } & \text{기울기가 음수이므로 } x\text{의 값이 증가하면 } y\text{의 값은 감소한다. (거짓)} \
\text{⑤ } & y = -\frac{4}{3}x\text{의 그래프를 } y\text{축 방향으로 } 4\text{만큼 평행이동한 것이다. (거짓)}
\end{aligned}
$$
따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

두 점 $(2a - 3, 5)$ 와 $(4a + 5, a)$ 를 지나는 직선이 $y$축에 평행할 때, 상수 $a$의 값을 구하면? [4점]

**보기** ① $-6$  ② $-4$  ③ $-2$  ④ $2$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $y$축에 평행한 직선은 $x$좌표가 모두 일정하다. (aligned)
2. 따라서 두 점의 $x$좌표가 같으므로 $2a - 3 = 4a + 5$이다. (aligned)
3. $-2a = 8 \implies a = -4$이다. (aligned)
4. 그러므로 정답 ②이다. (aligned)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 점 $(2a - 3, 5」
**RPM** M2-RPM-054 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 일차함수와 일차방정식의 관계 > x=p, y=q의 그래프 → 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프**
- 이유: 일차함수와 일차방정식 단원의 좌표축에 평행한 직선의 방정식에 부합한다. (aligned)
**유형** PT=PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS / TPL=NONE **원천→판정: PT_M2_LINE_PARALLEL_TO_AXIS_POINTS → PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS** **원천→판정: TPL_POINTS_PARALLEL_TO_AXIS_PARAMETER_SOLVE → NONE**
- 이유: y축에 평행한 직선 위의 점 조건을 이용한 미지수 결정 유형이다. (aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 좌표축에 평행한 직선의 좌표 특성을 이해하는 표준 난이도 2 문항이다. (aligned)

**4칸**
- given: 직선←stem:「두 점 $(2a - 3, 5)$ 와 $(4a + 5, a)$ 를 지나는 직선이 $y$축에 평행할 때」
- goal: 상수←stem:「상수 $a$의 값을 구하면?」
- method: 직선(NAMED)←solution:「$y$축에 평행한 직선은 $x = k$ ($k$는 상수)의 꼴로 나타내어지며」
- condition: (없음)

**how** y축에 평행한 직선 위의 두 점의 x좌표가 서로 같음을 이용해 a를 구했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

$y$축에 평행한 직선은 $x = k$ ($k$는 상수)의 꼴로 나타내어지며, 이 직선 위의 모든 점은 $x$좌표가 서로 같다.
따라서 두 점 $(2a - 3, 5)$와 $(4a + 5, a)$의 $x$좌표를 같다고 놓고 방정식을 푼다.
$$
\begin{aligned}
2a - 3 &= 4a + 5 \
2a - 4a &= 5 + 3 \
-2a &= 8 \
a &= -4
\end{aligned}
$$
그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

두 일차함수 $y = -x + 4$ 와 $y = \dfrac{1}{2}x + 1$ 의 그래프와 $x$축으로 둘러싸인 삼각형의 넓이를 구하면? [5점]

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1단계: 교점 연립 $-x + 4 = 1/2 x + 1 \implies 3/2 x = 3 \implies x = 2, y = 2$로 교점 $(2, 2)$이다. (aligned)
2. 2단계: $x$절편은 각각 $y = -x + 4$에서 $x = 4$, $y = 1/2 x + 1$에서 $x = -2$이다. (aligned)
3. 3단계: 밑변 길이는 $4 - (-2) = 6$이고 높이는 교점의 $y$좌표 $2$이다. (aligned)
4. 4단계: 삼각형 넓이는 $1/2 \times 6 \times 2 = 6$이므로 정답 ④이다. (aligned)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQUATION → M2-04-LINEAR_FUNCTION_BASIC**
- 근거 인용: 「두 일차함수 $y = -x」
**RPM** M2-RPM-048 [일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 일차함수와 일차방정식의 관계 > 두 일차방정식의 그래프와 넓이 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편**
- 이유: 일차함수 단원의 일차함수 그래프 기울기와 절편 및 넓이 활용에 일치한다. (aligned)
**유형** PT=PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA / TPL=NONE **원천→판정: PT_M2_TWO_LINES_AXIS_TRIANGLE_AREA → PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA** **원천→판정: TPL_TWO_LINEAR_FUNCTIONS_X_AXIS_AREA → NONE**
- 이유: 두 일차함수 그래프와 좌표축이 이루는 삼각형의 넓이 계산 유형이다. (aligned)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 교점 좌표와 절편을 모두 구해 도형의 넓이를 완성하는 난이도 3 문항이다. (aligned)

**4칸**
- given: 일차함수←stem:「두 일차함수 $y = -x + 4$ 와 $y = \dfrac{1}{2}x + 1$ 의 그래프와 $x$축으로 둘러싸인」
- goal: 삼각형←stem:「삼각형의 넓이를 구하면?」
- method: 교점(NAMED)←solution:「두 직선의 교점의 좌표를 구한다.」
- condition: (없음)

**how** 두 직선의 교점과 각각의 x절편을 구하여 밑변과 높이로 삼각형 넓이를 계산했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 두 직선의 교점의 좌표를 구한다.
$$
\begin{aligned}
-x + 4 &= \frac{1}{2}x + 1 \
양변에 } 2\text{를 곱하면 } -2x + 8 &= x + 2 \
-3x &= -6 \
x &= 2
\end{aligned}
$$
$x = 2$를 $y = -x + 4$에 대입하면
$$
y = -2 + 4 = 2
$$
따라서 두 직선의 교점의 좌표는 $(2, 2)$이다.
이 교점의 $y$좌표인 $2$가 삼각형의 높이가 된다.


2단계: 두 직선의 $x$절편을 각각 구한다.
- $y = -x + 4$에서 $y = 0$이면 $x = 4$이다. 즉 점 $(4, 0)$
- $y = \dfrac{1}{2}x + 1$에서 $y = 0$이면 $\dfrac{1}{2}x = -1 \implies x = -2$이다. 즉 점 $(-2, 0)$


3단계: 삼각형의 밑변의 길이를 구한다.
$x$축 위의 두 교점 사이의 거리이므로
$$
\text{밑변} = 4 - (-2) = 6
$$


4단계: 삼각형의 넓이를 계산한다.
$$
\text{넓이} = \frac{1}{2} \times \text{밑변} \times \text{높이} = \frac{1}{2} \times 6 \times 2 = 6
$$
그러므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

두 일차방정식 $x - y = -4$ 와 $ax + 2y = 10$ 의 그래프의 교점의 좌표가 $(-1, b)$ 일 때, $a + b$의 값을 구하면? (단, $a, b$는 상수) [5점]

**보기** ① $-7$  ② $-5$  ③ $-3$  ④ $1$  ⑤ $-1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1단계: 교점 $(-1, b)$를 첫 식에 대입하면 $-1 - b = -4 \implies b = 3$이다. (ax)
2. 2단계: 교점 $(-1, 3)$을 두 번째 식에 대입하면 $a(-1) + 2(3) = 10 \implies -a + 6 = 10 \implies a = -4$이다. (ax)
3. 3단계: 따라서 $a + b = -4 + 3 = -1$이다. (ax)
4. 그러므로 정답 ⑤이다. (ax)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 일차방정식 $x - y」
**RPM** M2-RPM-055 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > x축·y축에 평행한 직선] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 일차함수와 일차방정식의 관계 > 두 일차방정식의 교점 → 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > x축·y축에 평행한 직선**
- 이유: 일차함수와 일차방정식 단원의 두 직선의 교점과 연립방정식의 해에 일치한다. (ax)
**유형** PT=PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION / TPL=NONE **원천→판정: PT_M2_TWO_LINES_INTERSECTION_POINT_PARAMETERS → PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION** **원천→판정: TPL_INTERSECTION_POINT_UNKNOWN_COEFF_SUM → NONE**
- 이유: 두 일차방정식 그래프의 교점을 이용한 미정계수 결정 유형이다. (ax)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 교점의 좌표를 두 일차방정식에 순차 대입하는 난이도 3 문항이다. (ax)

**4칸**
- given: 일차방정식←stem:「두 일차방정식 $x - y = -4$ 와 $ax + 2y = 10$ 의 그래프의 교점의 좌표가 $(-1, b)$ 일 때」
- goal: 상수←stem:「$a + b$의 값을 구하면? (단, $a, b$는 상수)」
- method: 교점(NAMED)←solution:「교점 $(-1, b)$를 첫 번째 식 $x - y = -4$에 대입하여 $b$를 구한다.」
- condition: (없음)

**how** 교점 좌표를 한 식에 대입하여 b를 구하고 다른 식에 대입하여 a를 구했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: 교점 $(-1, b)$를 첫 번째 식 $x - y = -4$에 대입하여 $b$를 구한다.
$$
\begin{aligned}
-1 - b &= -4 \
-b &= -4 + 1 \
-b &= -3 \
b &= 3
\end{aligned}
$$
따라서 두 직선의 교점의 좌표는 $(-1, 3)$이다.


2단계: 교점 $(-1, 3)$을 두 번째 식 $ax + 2y = 10$에 대입하여 $a$를 구한다.
$$
\begin{aligned}
a(-1) + 2(3) &= 10 \
-a + 6 &= 10 \
-a &= 4 \
a &= -4
\end{aligned}
$$


3단계: $a + b$의 값을 계산한다.
$$
a + b = -4 + 3 = -1
$$
그러므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차함수 $y = ax + b$의 그래프가 제$1$, $3$, $4$사분면을 지날 때, 일차함수 $y = -\dfrac{a}{b}x + ab$ 의 그래프의 개형으로 옳은 것은? (단, $a, b$는 상수) [5점]

**보기** ① 기울기가 음수이고 $y$절편이 양수인 직선 (제$1$, $2$, $4$사분면)  ② 기울기가 음수이고 $y$절편이 음수인 직선 (제$2$, $3$, $4$사분면)  ③ 기울기가 양수이고 $y$절편이 음수인 직선 (제$1$, $3$, $4$사분면)  ④ 기울기가 양수이고 $y$절편이 양수인 직선 (제$1$, $2$, $3$사분면)  ⑤ $x$축에 평행한 직선

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $y = ax + b$가 제1, 3, 4사분면을 지나므로 기울기 $a > 0$, $y$절편 $b < 0$이다. (ax)
2. 새 함수 $y = -(a/b)x + ab$의 기울기는 $-(a/b) > 0$ (양수), $y$절편은 $ab < 0$ (음수)이다. (ax)
3. 기울기가 양수이고 $y$절편이 음수인 직선은 제1, 3, 4사분면을 지난다. (ax)
4. 따라서 정답 ③이다. (ax)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = ax +」
**RPM** M2-RPM-051 [일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 증가·감소] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프의 성질 > 그래프가 지나는 사분면 → 일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 증가·감소**
- 이유: 일차함수 단원의 일차함수 그래프 성질과 사분면 판단에 부합한다. (ax)
**유형** PT=PT_M2_LINEAR_FUNCTION_QUADRANT_CONDITION / TPL=NONE **원천→판정: PT_M2_LINEAR_FUNCTION_QUADRANT_SIGN_PREDICTION → PT_M2_LINEAR_FUNCTION_QUADRANT_CONDITION** **원천→판정: TPL_QUADRANTS_SIGN_TRANSFORM_GRAPH_SHAPE → NONE**
- 이유: 사분면 조건으로 계수의 부호를 정하고 그래프의 개형을 판단하는 유형이다. (ax)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부호 판정과 새 함수의 기울기 절편 부호 결정을 연계한 난이도 3 문항이다. (ax)

**4칸**
- given: 일차함수←stem:「일차함수 $y = ax + b$의 그래프가 제$1$, $3$, $4$사분면을 지날 때」
- goal: 일차함수←stem:「그래프의 개형으로 옳은 것은? (단, $a, b$는 상수)」
- method: 기울기(NAMED)←solution:「오른쪽 위로 향하므로 기울기 $a > 0$이다.」
- condition: (없음)

**how** 지나는 사분면에서 a와 b의 부호를 판정하고 새 일차함수의 개형을 결정했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

1단계: $a$와 $b$의 부호를 판정한다.
일차함수 $y = ax + b$의 그래프가 제$1$, $3$, $4$사분면을 지나므로
- 오른쪽 위로 향하므로 기울기 $a > 0$이다.
- $y$축의 음의 부분과 만나므로 $y$절편 $b < 0$이다.


2단계: 새 일차함수 $y = -\dfrac{a}{b}x + ab$의 기울기와 $y$절편의 부호를 확인한다.
- 기울기: $a > 0, b < 0$이므로 $\dfrac{a}{b} < 0$이다.
  따라서 기울기는 $-\dfrac{a}{b} > 0$ (양수)이다.
- $y$절편: $ab$에서 양수와 음수의 곱이므로 $ab < 0$ (음수)이다.


3단계: 그래프의 개형 및 지나는 사분면을 판단한다.
기울기가 양수이므로 오른쪽 위로 향하고, $y$절편이 음수이므로 $y$축의 음의 부분에서 만난다.
따라서 제$1$, $3$, $4$사분면을 지나는 직선이다.
그러므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서술형 1번]
민재와 서아가 연립방정식 $\begin{cases} ax + 2y = 5 \ 3x - by = 4 \end{cases}$ 를 푸는데, 민재는 $a$를 잘못 보고 풀어 $x = 2, y = 1$을 얻었고, 서아는 $b$를 잘못 보고 풀어 $x = 3, y = -2$를 얻었다. 다음 물음에 답하시오. (단, $a, b$는 상수) [7점]
(1) 두 수 $a$와 $b$의 값을 각각 구하시오. [4점]
(2) 처음 연립방정식의 해를 바르게 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $a = 3, b = 2$
(2) $x = \dfrac{3}{2}, y = \dfrac{1}{4}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (1) 민재는 둘째 식을 바르게 보았으므로 $(2, 1)$ 대입 시 $6 - b = 4 \implies b = 2$이다. (cases)
2. 서아는 첫째 식을 바르게 보았으므로 $(3, -2)$ 대입 시 $3a - 4 = 5 \implies 3a = 9 \implies a = 3$이다. (cases)
3. (2) 원래 연립방정식 $\begin{cases} 3x + 2y = 5 \\ 3x - 2y = 4 \end{cases}$를 변끼리 더하면 $6x = 9 \implies x = 3/2$이다. (cases)
4. $2y = 5 - 3(3/2) = 1/2 \implies y = 1/4$이다. (cases)
- 작성자 답: (1) $a = 3, b = 2$
(2) $x = \dfrac{3}{2}, y = \dfrac{1}{4}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1번] 민재와 서아」
**RPM** M2-RPM-033 [일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정] **원천→판정: 일차부등식과 연립일차방정식 > 연립일차방정식 > 연립일차방정식의 풀이 > 잘못 보고 푼 경우 → 일차부등식과 연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정**
- 이유: 연립일차방정식 단원의 해와 계수 조건에서 계수 결정에 일치한다. (cases)
**유형** PT=PT_M2_SYSTEM_OF_EQUATIONS_COEFFICIENT_SWAP / TPL=NONE **원천→판정: PT_M2_SYSTEM_EQUATION_MISTAKEN_COEFF_SOLVE → PT_M2_SYSTEM_OF_EQUATIONS_COEFFICIENT_SWAP** **원천→판정: TPL_SYSTEM_LINEAR_MISTAKEN_COEFFICIENTS_RECOVERY → NONE**
- 이유: 잘못 보고 푼 연립방정식의 해로부터 원래 연립방정식을 복원하는 서술형 유형이다. (cases)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 잘못 본 계수 문제에서 바르게 본 식을 선별해 풀이하는 서술형 난이도 3 문항이다. (cases)

**4칸**
- given: 연립방정식←stem:「민재와 서아가 연립방정식 $\begin{cases} ax + 2y = 5 \ 3x - by = 4 \end{cases}$ 를 푸는데」
- goal: 연립방정식←stem:「처음 연립방정식의 해를 바르게 구하시오.」
- method: 대입(NAMED)←solution:「민재는 $a$를 잘못 보았으므로 두 번째 식 $3x - by = 4$는 바르게 보았다.」
- condition: (없음)

**how** 각 사람이 바르게 본 식에 각각의 해를 대입하여 a, b를 구하고 바른 해를 풀었다. (cases)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 두 상수 $a, b$의 값을 구한다.
민재는 $a$를 잘못 보았으므로 두 번째 식 $3x - by = 4$는 바르게 보았다.
$x = 2, y = 1$을 대입하면
$$
\begin{aligned}
3(2) - b(1) &= 4 \
6 - b &= 4 \
b &= 2
\end{aligned}
$$
서아는 $b$를 잘못 보았으므로 첫 번째 식 $ax + 2y = 5$는 바르게 보았다.
$x = 3, y = -2$를 대입하면
$$
\begin{aligned}
a(3) + 2(-2) &= 5 \
3a - 4 &= 5 \
3a &= 9 \
a &= 3
\end{aligned}
$$
따라서 $a = 3, b = 2$이다.


(2) 처음 연립방정식을 바르게 푼다.
$a = 3, b = 2$를 대입하면 원래의 연립방정식은
$$
\begin{cases}
3x + 2y = 5 \quad \cdots \text{㉠} \
3x - 2y = 4 \quad \cdots \text{㉡}
\end{cases}
$$
㉠과 ㉡을 변끼리 더한다.
$$
(3x + 2y) + (3x - 2y) = 5 + 4 \implies 6x = 9 \implies x = \frac{9}{6} = \frac{3}{2}
$$
$x = \dfrac{3}{2}$를 ㉠에 대입한다.
$$
3\left(\frac{3}{2}\right) + 2y = 5 \implies \frac{9}{2} + 2y = 5 \implies 2y = 5 - \frac{9}{2} = \frac{1}{2} \implies y = \frac{1}{4}
$$
따라서 처음 연립방정식의 해는 $x = \dfrac{3}{2}, y = \dfrac{1}{4}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[서술형 2번]
어느 저수지에서 오늘 정오에 수문을 열어 $600\,\mathrm{t}$의 물을 방류한 후 수문을 닫았고, 오후 2시부터 다시 수문을 열어 $15$분마다 $40\,\mathrm{t}$의 물을 일정하게 방류한다고 한다. 오후 2시부터 $x$시간이 지났을 때, 오늘 정오부터 방류한 물의 전체 양을 $y\,\mathrm{t}$라 하자. 다음 물음에 답하시오. [6점]
(1) $y$를 $x$에 대한 식으로 나타내시오. [3점]
(2) 오늘 정오부터 방류한 물의 전체 양이 $1400\,\mathrm{t}$가 되는 시각은 오후 몇 시 몇 분인지 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $y = 160x + 600$
(2) 오후 7시   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (1) 15분당 40t 방류하므로 1시간(60분)당 방류량은 $40 \times 4 = 160\,\mathrm{t}$이다. (600)
2. 초기 방류량 600t이 있으므로 관계식은 $y = 160x + 600$이다. (600)
3. (2) $y = 1400$ 대입: $160x + 600 = 1400 \implies 160x = 800 \implies x = 5$이다. (600)
4. 오후 2시부터 5시간 후이므로 오후 7시이다. (600)
- 작성자 답: (1) $y = 160x + 600$
(2) 오후 7시 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2번] 어느 저수지」
**RPM** M2-RPM-053 [일차함수 > 일차함수와 그 그래프 > 식 구하기 > 기울기와 한 점으로 식 구하기] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 활용 > 수량 변화 → 일차함수 > 일차함수와 그 그래프 > 식 구하기 > 기울기와 한 점으로 식 구하기**
- 이유: 일차함수 단원의 일차함수의 활용 실생활 문제 해결에 부합한다. (600)
**유형** PT=PT_M2_LINEAR_FUNCTION / TPL=NONE **원천→판정: PT_M2_LINEAR_FUNCTION_RATE_OF_CHANGE_APPLICATION → PT_M2_LINEAR_FUNCTION** **원천→판정: TPL_RATE_TIME_LINEAR_FUNCTION_SOLVE → NONE**
- 이유: 시간에 따른 수량 변화를 일차함수 식으로 나타내는 실생활 활용 서술형 유형이다. (600)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 실생활 수량 변화를 일차함수 모델로 작성하고 시각을 역산하는 서술형 난이도 3 문항이다. (600)

**4칸**
- given: 일차함수←stem:「오후 2시부터 $x$시간이 지났을 때, 오늘 정오부터 방류한 물의 전체 양을 $y\,\mathrm{t}$라 하자.」
- goal: 일차함수←stem:「$y$를 $x$에 대한 식으로 나타내시오. [3점]」
- method: 일차함수(NAMED)←solution:「오늘 정오에 이미 방류한 물 $600\,\mathrm{t}$이 있으므로」
- condition: (없음)

**how** 단위 시간당 방류량과 초기 방류량을 합산하여 관계식을 세우고 시각을 구했다. (600)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $y$를 $x$에 대한 식으로 나타낸다.
$15$분마다 $40\,\mathrm{t}$의 물을 방류하므로, $1$시간($60$분) 동안 방류하는 물의 양은
$$
40 \times \frac{60}{15} = 40 \times 4 = 160\,\mathrm{t}
$$
따라서 오후 2시부터 $x$시간 동안 방류한 물의 양은 $160x\,\mathrm{t}$이다.
오늘 정오에 이미 방류한 물 $600\,\mathrm{t}$이 있으므로, 오늘 정오부터 방류한 물의 전체 양 $y\,\mathrm{t}$는 다음과 같다.
$$
y = 160x + 600
$$


(2) 전체 방류량이 $1400\,\mathrm{t}$가 되는 시각을 구한다.
$y = 1400$을 (1)의 식에 대입한다.
$$
\begin{aligned}
160x + 600 &= 1400 \
160x &= 800 \
x &= \frac{800}{160} = 5
\end{aligned}
$$
따라서 오후 2시부터 $5$시간이 지난 시각이므로
$$
\text{오후 } 2\text{시} + 5\text{시간} = \text{오후 } 7\text{시}
$$
그러므로 구하는 시각은 오후 7시이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

[서술형 3번]
$48\,\mathrm{L}$, $30\,\mathrm{L}$의 물이 각각 들어 있는 두 물통 $A, B$에서 일정한 속력으로 동시에 물이 빠져나가고 있다. 물이 빠지기 시작한 지 $x$분 후에 물통에 남아 있는 물의 양을 $y\,\mathrm{L}$라 할 때, 물통 $A$는 $6$분 만에 물이 모두 빠졌고, 물통 $B$는 $15$분 만에 물이 모두 빠졌다. 다음 물음에 답하시오. [7점]
(1) 물통 $A$에 대하여 $x$와 $y$ 사이의 관계식을 구하시오. [2점]
(2) 물통 $B$에 대하여 $x$와 $y$ 사이의 관계식을 구하시오. [2점]
(3) 물이 빠지기 시작한 지 몇 분 후에 두 물통 $A, B$에 남아 있는 물의 양이 같아지는지 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $y = -8x + 48$
(2) $y = -2x + 30$
(3) $3$분 후   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (1) 물통 A: 절편 $(0, 48), (6, 0)$이므로 기울기 $-8$, 관계식 $y = -8x + 48$이다. (48)
2. (2) 물통 B: 절편 $(0, 30), (15, 0)$이므로 기울기 $-2$, 관계식 $y = -2x + 30$이다. (48)
3. (3) 두 물통의 물의 양이 같아지려면 $-8x + 48 = -2x + 30 \implies 6x = 18 \implies x = 3$이다. (48)
4. 따라서 3분 후이다. (48)
- 작성자 답: (1) $y = -8x + 48$
(2) $y = -2x + 30$
(3) $3$분 후 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_BASIC → M2-04-LINEAR_FUNCTION_EQUATION**
- 근거 인용: 「[서술형 3번] $48\,\」
**RPM** M2-RPM-055 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > x축·y축에 평행한 직선] **원천→판정: 일차함수 > 일차함수와 그 그래프 > 일차함수의 활용 > 그래프의 해석 → 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > x축·y축에 평행한 직선**
- 이유: 일차함수 단원의 두 운동 그래프의 교점으로 물의 양이 같아지는 시각을 구하는 활용에 일치한다. (48)
**유형** PT=PT_M2_LINEAR_FUNCTIONS_GRAPH_INTERSECTION_APPLICATION / TPL=NONE **원천→판정: PT_M2_TWO_LINEAR_FUNCTIONS_INTERSECTION_WORD → PT_M2_LINEAR_FUNCTIONS_GRAPH_INTERSECTION_APPLICATION** **원천→판정: TPL_TWO_RATES_DECREASE_EQUAL_TIME → NONE**
- 이유: 두 변화 그래프의 교점을 연립방정식으로 구하는 활용 서술형 유형이다. (48)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 두 일차함수 식을 유도하고 연립하여 교점의 시각을 구하는 서술형 난이도 3 문항이다. (48)

**4칸**
- given: 일차함수←stem:「물이 빠지기 시작한 지 $x$분 후에 물통에 남아 있는 물의 양을 $y\,\mathrm{L}$라 할 때」
- goal: 일차함수←stem:「물이 빠지기 시작한 지 몇 분 후에 두 물통 $A, B$에 남아 있는 물의 양이 같아지는지 구하시오.」
- method: 기울기(NAMED)←solution:「(1) 물통 $A$의 관계식을 구한다.」
- condition: (없음)

**how** 두 물통의 남은 물의 양 일차함수 식을 각각 구하고 교점의 x좌표를 계산했다. (48)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 물통 $A$의 관계식을 구한다.
물이 빠지기 전($x = 0$) 물의 양은 $48\,\mathrm{L}$이므로 $y$절편은 $48$이고, $6$분 후 물이 모두 빠졌으므로 점 $(6, 0)$을 지난다.
$$
\text{기울기} = \frac{0 - 48}{6 - 0} = -8
$$
따라서 물통 $A$의 관계식은
$$
y = -8x + 48
$$


(2) 물통 $B$의 관계식을 구한다.
물이 빠지기 전($x = 0$) 물의 양은 $30\,\mathrm{L}$이므로 $y$절편은 $30$이고, $15$분 후 물이 모두 빠졌으므로 점 $(15, 0)$을 지난다.
$$
\text{기울기} = \frac{0 - 30}{15 - 0} = -2
$$
따라서 물통 $B$의 관계식은
$$
y = -2x + 30
$$


(3) 두 물통에 남아 있는 물의 양이 같아지는 시간을 구한다.
두 식의 $y$값이 같으므로 방정식을 세운다.
$$
\begin{aligned}
-8x + 48 &= -2x + 30 \
-8x + 2x &= 30 - 48 \
-6x &= -18 \
x &= 3
\end{aligned}
$$
따라서 물이 빠지기 시작한 지 $3$분 후에 두 물통에 남아 있는 물의 양이 같아진다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
