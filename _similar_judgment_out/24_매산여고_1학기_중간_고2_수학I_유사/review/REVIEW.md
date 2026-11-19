# 검수 묶음 — 24_매산여고_1학기_중간_고2_수학I_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2)**
- 문항 24개 / 검사 PASS 22, FAIL 2, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 1, 2단계 18, 3단계 4, 4단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q4**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q7**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q10**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q11**: 검사 코드: CHOICE_ORDER
- **Q13**: 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 이유가 20자 미만 (typeReason)
- **Q15**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q17**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 이유가 20자 미만 (typeReason)
- **Q18**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 원천 값과 다른 칸 2개 (RPM, 난이도)

---
## Q1 — 객관식 3.2점


**발문**

$a = \sqrt[3]{2}$, $b^2 = \sqrt[3]{3}$일 때, $(ab)^{12}$의 값을 구하면? (단, $b$는 실수이다.) [3.2점]

**보기** ① $72$  ② $144$  ③ $216$  ④ $288$  ⑤ $432$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a = 2^{\frac{1}{3}}$이므로 $a^{12} = 2^4 = 16$이다. 12
2. $b^2 = 3^{\frac{1}{3}}$이므로 $b^{12} = (b^2)^6 = 3^2 = 9$이다. 12
3. $(ab)^{12} = a^{12}b^{12} = 16 \times 9 = 144$이다. 12
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「값을 구하면? (단, $b$」
**RPM** H2-M1-RPM-003 [지수함수와 로그함수 > 지수 > 지수의 확장 > 유리수 지수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수의 확장 > 유리수 지수**
- 이유: 지수의 확장과 유리수 지수 12 계산 RPM 문항입니다.
**유형** PT=PT_EXPONENT_CALCULATION / TPL=TPL_EXPONENT_RATIONAL_POWER_OPERATION
- 이유: 지수법칙과 유리수 지수 변환을 통해 12 거듭제곱을 계산하는 유형입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 12 거듭제곱근의 유리수 지수 변환을 직접 계산하는 난이도 1 문제입니다.

**4칸**
- given: (없음)
- goal: 지수←stem:「값을 구하면? (단, $b$는 실수이」
- method: 지수(NAMED)←solution:「12} = \left(2^{\frac」
- condition: (없음)

**how** 지수법칙을 이용하여 12 거듭제곱의 값을 각각 구하고 곱했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a = \sqrt[3]{2} = 2^{\frac{1}{3}}$이므로
$a^{12} = \left(2^{\frac{1}{3}}\right)^{12} = 2^4 = 16$
$b^2 = \sqrt[3]{3} = 3^{\frac{1}{3}}$이므로
$b^{12} = (b^2)^6 = \left(3^{\frac{1}{3}}\right)^6 = 3^2 = 9$
따라서 $(ab)^{12} = a^{12} b^{12} = 16 \times 9 = 144$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.2점


**발문**

$\log_{(a - 2)}(a^2 - 7a - 18)$이 정의되기 위한 실수 $a$의 값의 범위를 구하면? [3.2점]

**보기** ① $a < -2$  ② $2 < a < 3$  ③ $3 < a < 9$  ④ $a > 9$  ⑤ $a > 2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑 조건: $a - 2 > 0$이고 $a - 2 \neq 1 \implies a > 2, a \neq 3$이다. 18
2. 진수 조건: $a^2 - 7a - 18 > 0 \implies (a - 9)(a + 2) > 0 \implies a > 9$ (or $a < -2$). 18
3. 공통 범위는 $a > 9$이다. 18
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-LOGARITHM(로그의 뜻과 성질)
- 근거 인용: 「정의되기 위한 실수 $a$의」
**RPM** H2-M1-RPM-008 [지수함수와 로그함수 > 로그 > 로그의 뜻 > 밑과 진수 조건] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 뜻 > 밑과 진수 조건**
- 이유: 로그의 밑과 진수 조건 18 관련 RPM 문항입니다.
**유형** PT=PT_LOG_DOMAIN_ELIGIBILITY / TPL=TPL_LOG_BASE_ARGUMENT_INTEGER_DOMAIN
- 이유: 로그 밑·진수 조건과 18이 든 이차부등식의 범위를 판정하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 로그의 밑과 진수 조건에서 18 관련 이차부등식을 연립하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 로그←stem:「정의되기 위한 실수 $a$의 값의 범」
- method: 로그(NAMED)←solution:「18 > 0$
$(a - 9)(a +」
- condition: (없음)

**how** 밑 조건과 진수 조건에서 18이 포함된 부등식을 풀어 공통 범위를 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

로그가 정의되려면 밑 조건과 진수 조건을 모두 만족해야 한다.
(1) 밑 조건: $a - 2 > 0$이고 $a - 2 \neq 1$이므로 $a > 2$, $a \neq 3$
(2) 진수 조건: $a^2 - 7a - 18 > 0$
$(a - 9)(a + 2) > 0$
$a < -2$ 또는 $a > 9$
(1), (2)의 공통 범위는 $a > 9$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

실수 $x$에 대하여 $\dfrac{3^x - 3^{-x}}{3^x + 3^{-x}} = \dfrac{1}{3}$일 때, $9^x - 9^{-x}$의 값을 구하면? [3.4점]

**보기** ① $\dfrac{3}{2}$  ② $\dfrac{5}{2}$  ③ $\dfrac{7}{2}$  ④ $\dfrac{5}{3}$  ⑤ $\dfrac{8}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 분모 분자에 $3^x$을 곱하면 $\dfrac{3^{2x} - 1}{3^{2x} + 1} = \dfrac{1}{3} \implies 3^{2x} = 2$이다. 3.4
2. $9^x = 3^{2x} = 2$이고 $9^{-x} = 1/2$이다. 3.4
3. $9^x - 9^{-x} = 2 - 1/2 = 3/2$이다. 3.4
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「실수 $x$에 대하여 $\d」
**RPM** H2-M1-RPM-006 [지수함수와 로그함수 > 지수 > 지수법칙 > 조건식] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수법칙 > 조건식**
- 이유: 3.4점 지수법칙 조건식 활용 RPM 문항입니다.
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_RECIPROCAL_POWER
- 이유: 3.4점 분수 지수식에서 역수 거듭제곱 값을 계산하는 지수법칙 적용 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 3.4점 문항으로 지수 치환과 역수 거듭제곱 계산을 수행하는 수준입니다.

**4칸**
- given: (없음)
- goal: 지수←stem:「값을 구하면? [3.4점]」
- method: 지수(NAMED)←solution:「3^{2x} - 1}{3^{2x} +」
- condition: (없음)

**how** 배점 3.4점 문항으로 분모 분자에 $3^x$을 곱해 $3^{2x}$의 값을 구하고 계산했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식의 분모와 분자에 각각 $3^x$을 곱하면
$\dfrac{3^{2x} - 1}{3^{2x} + 1} = \dfrac{1}{3}$
$3(3^{2x} - 1) = 3^{2x} + 1$
$2 \cdot 3^{2x} = 4 \implies 3^{2x} = 2$
$9^x = 3^{2x} = 2$이므로 $9^{-x} = \dfrac{1}{2}$이다.
따라서 $9^x - 9^{-x} = 2 - \dfrac{1}{2} = \dfrac{3}{2}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

다음 중 함수 $y = \log_{\frac{1}{2}}(x + 3) + 2$에 대한 설명으로 옳은 것을 고르면? [3.4점]

**보기** ① 정의역은 ${x \mid x < -3}$이다.  ② 치역은 ${y \mid y > 0}$이다.  ③ 그래프는 점 $(-3, 2)$를 지난다.  ④ $x$의 값이 증가하면 $y$의 값도 증가한다.  ⑤ 그래프의 점근선은 직선 $x = -3$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 점근선은 $x + 3 = 0 \implies x = -3$이다. 3.4
2. 밑이 $1/2 < 1$이므로 $x$가 증가하면 $y$는 감소한다. 3.4
3. 따라서 점근선이 직선 $x = -3$인 ⑤가 옳다. 3.4
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-04(로그함수) / H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH(로그함수의 그래프)
- 근거 인용: 「함수 $y = \log_{\」
**RPM** H2-M1-RPM-021 [지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 증가·감소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 그래프 > 증가·감소**
- 이유: 3.4점 로그함수의 그래프와 성질 RPM 문항입니다.
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT
- 이유: 3.4점 로그함수 그래프의 점근선과 위치 관계 성질 판정 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 3.4점 기본 문항으로 로그함수 그래프의 성질을 판정하는 문제입니다.

**4칸**
- given: (없음)
- goal: 로그←stem:「설명으로 옳은 것을 고르면? [3.4」
- method: 로그(NAMED)←solution:「점근선은 직선 $x = -3$이다. 」
- condition: (없음)

**how** 배점 3.4점 문항으로 로그함수의 점근선과 정의역, 단조성을 확인했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

① 진수 조건 $x + 3 > 0$에서 정의역은 ${x \mid x > -3}$이다. (거짓)
② 로그함수의 치역은 실수 전체의 집합이다. (거짓)
③ $x = -2$일 때 $y = \log_{\frac{1}{2}} 1 + 2 = 2$이므로 점 $(-2, 2)$를 지난다. (거짓)
④ 밑이 $\dfrac{1}{2} < 1$이므로 $x$의 값이 증가하면 $y$의 값은 감소한다. (거짓)
⑤ 진수 $x + 3 = 0$에서 점근선은 직선 $x = -3$이다. (참)
따라서 옳은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.5점


**발문**

함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$의 그래프가 제$3$사분면을 지나지 않도록 하는 상수 $k$의 최솟값을 구하면? [3.5점]

**보기** ① $-8$  ② $-5$  ③ $-4$  ④ $0$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑이 $1/4 < 1$인 감소함수이므로 제3사분면을 지나지 않으려면 $y$절편이 0 이상이어야 한다. 3.5
2. $x = 0$일 때 $y = (1/4)^{-1} + k = 4 + k \ge 0 \implies k \ge -4$이다. 3.5
3. 따라서 $k$의 최솟값은 -4이다. 3.5
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH(지수함수의 그래프)
- 근거 인용: 「그래프가 제$3$사분면을 지」
**RPM** H2-M1-RPM-013 [지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 증가·감소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 그래프 > 증가·감소**
- 이유: 3.5점 지수함수 그래프의 증가·감소와 사분면 RPM 문항입니다.
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT
- 이유: 3.5점 지수함수 그래프가 사분면을 지나지 않는 조건 성질 판정 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 3.5점 문항으로 지수곡선의 사분면 통과 조건과 절편을 해석하는 문제입니다.

**4칸**
- given: (없음)
- goal: 지수←stem:「그래프가 제$3$사분면을 지나지 않도」
- method: 지수(NAMED)←solution:「감소함수이다.
이 그래프가 제$3$사」
- condition: (없음)

**how** 배점 3.5점 문항으로 감소 지수곡선의 y절편 조건을 분석하여 풀었습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$는 밑이 $\dfrac{1}{4} < 1$인 감소함수이다.
이 그래프가 제$3$사분면($x < 0, y < 0$)을 지나지 않으려면 $y$절편이 $0$ 이상이어야 한다.
$x = 0$일 때 $y = \left(\dfrac{1}{4}\right)^{-1} + k = 4 + k \ge 0$
따라서 $k \ge -4$이므로 상수 $k$의 최솟값은 $-4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.5점


**발문**

이차함수 $f(x) = (x - 3)^2 - 4$와 일차함수 $g(x) = x - 1$에 대하여 부등식
$$\left(\dfrac{3}{4}\right)^{f(x)} > \left(\dfrac{3}{4}\right)^{g(x)}$$
를 만족시키는 모든 자연수 $x$의 값의 합을 구하면? [3.5점]

**보기** ① $14$  ② $12$  ③ $10$  ④ $9$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑이 $3/4 < 1$이므로 부등호 반대: $f(x) < g(x)$이다. 3.5
2. $(x - 3)^2 - 4 < x - 1 \implies x^2 - 7x + 6 < 0 \implies 1 < x < 6$이다. 3.5
3. 자연수 $x = 2, 3, 4, 5$이며 합은 14이다. 3.5
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION(지수함수의 활용)
- 근거 인용: 「부등식 $$\left(\df」
**RPM** H2-M1-RPM-017 [지수함수와 로그함수 > 지수함수 > 지수부등식 > 밑의 범위에 따른 부등호] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수부등식 > 밑의 범위에 따른 부등호**
- 이유: 3.5점 밑의 범위에 따른 부등호 지수부등식 RPM 문항입니다.
**유형** PT=PT_EXPONENTIAL_MONOTONIC_INEQUALITY / TPL=TPL_EXP_BASE_BELOW_ONE_COMPARISON
- 이유: 3.5점 밑이 1보다 작은 지수함수의 단조성 비교 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 3.5점 문항으로 밑의 범위에 따른 부등호 방향 역전을 확인하는 수준입니다.

**4칸**
- given: (없음)
- goal: 부등식←stem:「부등식
$$\left(\dfrac{3」
- method: 지수(NAMED)←solution:「감소하고, 주어진 부등식은
$f(x)」
- condition: (없음)

**how** 배점 3.5점 문항으로 밑이 1보다 작은 지수부등식을 다항부등식으로 환원했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

밑이 $\dfrac{3}{4}$ ($0 < \dfrac{3}{4} < 1$)이므로 지수함수는 감소하고, 주어진 부등식은
$f(x) < g(x)$
$(x - 3)^2 - 4 < x - 1$
$x^2 - 6x + 5 < x - 1$
$x^2 - 7x + 6 < 0$
$(x - 1)(x - 6) < 0 \implies 1 < x < 6$
이를 만족시키는 자연수 $x$는 $2, 3, 4, 5$이므로 합은 $2 + 3 + 4 + 5 = 14$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은? [3.6점]
<보기>
ㄱ. $240^\circ = \dfrac{4}{3}\pi$
ㄴ. $-750^\circ$는 제$3$사분면의 각이다.
ㄷ. $760^\circ$와 $-320^\circ$의 일반각은 같다.

**보기** ① ㄱ  ② ㄱ, ㄷ  ③ ㄴ  ④ ㄴ, ㄷ  ⑤ ㄱ, ㄴ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ㄱ. $240^\circ = 240 \times \dfrac{\pi}{180} = \dfrac{4}{3}\pi$ (참) 240
2. ㄴ. $-750^\circ = 360 \times (-3) + 330^\circ$로 제4사분면이다. (거짓) 240
3. ㄷ. $760^\circ = 360 \times 2 + 40^\circ$, $-320^\circ = 360 \times (-1) + 40^\circ$로 일반각이 같다. (참) 240
4. 옳은 것은 ㄱ, ㄷ이다. 240
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-05(삼각함수의 뜻과 값) / H15-M1-05-TRIGONOMETRIC_DEFINITION(삼각함수의 뜻과 값)
- 근거 인용: 「보기>에서 옳은 것만을 있는」
**RPM** H2-M1-RPM-029 [삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각**
- 이유: 일반각과 호도법 240도 관련 RPM 문항입니다.
**유형** PT=PT_TRIGONOMETRIC_DEFINITION / TPL=TPL_RADIAN_DEGREE_QUADRANT_JUDGMENT
- 이유: 호도법과 육십분법 및 사분면 240도 일반각을 판정하는 정의 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 240도 호도법 변환과 음수 각의 일반각 일치 여부를 판정하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 호도법←stem:「보기>에서 옳은 것만을 있는 대로 모」
- method: 호도법(NAMED)←solution:「240^\circ = 240^\cir」
- condition: (없음)

**how** 각도 240도 등의 호도법 변환 및 동경의 사분면 위치를 계산했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. $240^\circ = 240^\circ \times \dfrac{\pi}{180^\circ} = \dfrac{4}{3}\pi$ (참)
ㄴ. $-750^\circ = 360^\circ \times (-3) + 330^\circ$이므로 제$4$사분면의 각이다. (거짓)
ㄷ. $760^\circ = 360^\circ \times 2 + 40^\circ$, $-320^\circ = 360^\circ \times (-1) + 40^\circ$이므로 일반각은 $360^\circ \times n + 40^\circ$로 같다. (참)
따라서 옳은 것은 ㄱ, ㄷ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.6점


**발문**

$0 \le x < 2\pi$일 때, 방정식 $\sqrt{3}\sin x - \cos x = 0$의 모든 근의 합을 구하면? [3.6점]

**보기** ① $\dfrac{2}{3}\pi$  ② $\pi$  ③ $\dfrac{7}{6}\pi$  ④ $\dfrac{4}{3}\pi$  ⑤ $\dfrac{5}{3}\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 양변을 $\cos x$로 나누면 $\sqrt{3}\tan x = 1 \implies \tan x = \dfrac{1}{\sqrt{3}}$이다. 3.6
2. $0 \le x < 2\pi$에서 해는 $x = \dfrac{\pi}{6}, \dfrac{7\pi}{6}$이다. 3.6
3. 모든 근의 합은 $\dfrac{\pi}{6} + \dfrac{7\pi}{6} = \dfrac{4\pi}{3}$이다. 3.6
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-07(삼각방정식과 삼각부등식) / H15-M1-07-TRIGONOMETRIC_EQUATION(삼각방정식)
- 근거 인용: 「방정식 $\sqrt{3}\s」
**RPM** H2-M1-RPM-035 [삼각함수 > 삼각함수 > 삼각방정식·부등식 > 그래프를 이용한 해] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각방정식·부등식 > 그래프를 이용한 해**
- 이유: 3.6점 삼각방정식의 해 RPM 문항입니다.
**유형** PT=PT_TRIGONOMETRIC_EQUATION / TPL=TPL_TRIGONOMETRIC_EQUATION_BASIC_ROOTS
- 이유: 3.6점 기본 삼각방정식의 구간 내 해를 구하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 3.6점 문항으로 사인과 코사인의 일차 결합을 탄젠트 기본 삼각방정식으로 푸는 문제입니다.

**4칸**
- given: (없음)
- goal: 삼각함수←stem:「방정식 $\sqrt{3}\sin x 」
- method: 탄젠트(NAMED)←solution:「나누면
$\sqrt{3}\tan x 」
- condition: (없음)

**how** 배점 3.6점 문항으로 식을 탄젠트로 변환하여 구간 내 근의 합을 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\cos x = 0$이면 $\sin x = \pm 1$이 되어 등식이 성립하지 않으므로 $\cos x \neq 0$이다.
양변을 $\cos x$로 나누면
$\sqrt{3}\tan x - 1 = 0 \implies \tan x = \dfrac{1}{\sqrt{3}}$
$0 \le x < 2\pi$에서 $\tan x = \dfrac{1}{\sqrt{3}}$의 해는 $x = \dfrac{\pi}{6}$ 또는 $x = \dfrac{7\pi}{6}$
따라서 모든 근의 합은 $\dfrac{\pi}{6} + \dfrac{7\pi}{6} = \dfrac{4}{3}\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3.7점


**발문**

$0 \le x < \pi$일 때, 부등식 $-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해를 구하면? [3.7점]

**보기** ① $\dfrac{\pi}{6} < x \le \dfrac{2}{3}\pi$  ② $\dfrac{\pi}{6} \le x < \dfrac{3}{4}\pi$  ③ $\dfrac{\pi}{4} < x \le \dfrac{2}{3}\pi$  ④ $\dfrac{\pi}{3} \le x < \dfrac{3}{4}\pi$  ⑤ $\dfrac{\pi}{3} < x \le \dfrac{3}{4}\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $0 \le x < \pi$에서 $\cos x$는 감소함수이다. 3.7
2. $\cos(\pi/3) = 1/2$, $\cos(3\pi/4) = -\sqrt{2}/2$이다. 3.7
3. 따라서 해는 $\dfrac{\pi}{3} < x \le \dfrac{3}{4}\pi$이다. 3.7
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-07(삼각방정식과 삼각부등식) / H15-M1-07-TRIGONOMETRIC_INEQUALITY(삼각부등식)
- 근거 인용: 「부등식 $-\dfrac{\s」
**RPM** H2-M1-RPM-036 [삼각함수 > 삼각함수 > 삼각방정식·부등식 > 주기 구간의 해] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각방정식·부등식 > 주기 구간의 해**
- 이유: 3.7점 주기 구간의 삼각부등식 해 RPM 문항입니다.
**유형** PT=PT_TRIGONOMETRIC_INEQUALITY / TPL=TPL_TRIGONOMETRIC_INEQUALITY_INTERVAL_SOLVE
- 이유: 3.7점 삼각부등식 해의 구간 결정 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 3.7점 문항으로 삼각함수의 특수각과 부등식 해의 구간을 판정하는 문제입니다.

**4칸**
- given: (없음)
- goal: 부등식←stem:「부등식 $-\dfrac{\sqrt{2」
- method: 코사인(NAMED)←solution:「감소함수이다.
$\cos \dfrac」
- condition: (없음)

**how** 배점 3.7점 문항으로 코사인함수의 단조 감소 구간에서 경계값을 찾아 풀었습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$0 \le x < \pi$에서 함수 $y = \cos x$는 감소함수이다.
$\cos \dfrac{\pi}{3} = \dfrac{1}{2}$, $\cos \dfrac{3}{4}\pi = -\dfrac{\sqrt{2}}{2}$이므로
$-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해는 $\dfrac{\pi}{3} < x \le \dfrac{3}{4}\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$x, y$가 양수이고, $a$가 $1$이 아닌 양수일 때, 다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은? [3.8점]
<보기>
ㄱ. $\log_a x \log_a y = \log_a(x + y)$
ㄴ. $\log_a(x - y) = \dfrac{\log_a x}{\log_a y}$
ㄷ. $\dfrac{\log_a x}{\log_a y} = \log_y x$ (단, $y \neq 1$)
ㄹ. $(\log_a x)^n = n\log_a x$ (단, $n$은 실수이다.)

**보기** ① ㄱ  ② ㄷ  ③ ㄱ, ㄷ  ④ ㄴ, ㄹ  ⑤ ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ㄱ. 거짓: 로그의 합이 진수의 곱이다. 3.8
2. ㄴ. 거짓: 로그의 차가 진수의 나눗셈이다. 3.8
3. ㄷ. 참: 밑변환 공식 $\dfrac{\log_a x}{\log_a y} = \log_y x$이다. 3.8
4. ㄹ. 거짓: $(\log_a x)^n \neq n\log_a x$이다. 3.8
5. 옳은 것은 ㄷ 하나이다. 3.8
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-LOGARITHM(로그의 뜻과 성질)
- 근거 인용: 「보기>에서 옳은 것만을 있는」
**RPM** H2-M1-RPM-009 [지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱**
- 이유: 3.8점 로그의 성질 곱·몫·거듭제곱 RPM 문항입니다.
**유형** PT=PT_LOG_IDENTITY_OPERATIONS / TPL=TPL_LOG_BASE_CHANGE_PARAMETER
- 이유: 3.8점 로그 성질과 밑변환 공식 적용 판정 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 3.8점 수준으로 로그의 기본 연산 성질 참 거짓을 엄밀히 구별하는 문제입니다.

**4칸**
- given: (없음)
- goal: 로그←stem:「보기>에서 옳은 것만을 있는 대로 모」
- method: 로그(NAMED)←solution:「밑변환 공식에 의하여 $\dfrac{」
- condition: (없음)

**how** 배점 3.8점 문항으로 로그의 연산 성질과 밑변환 공식을 검증했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. $\log_a x + \log_a y = \log_a(xy)$이므로 거짓이다.
ㄴ. $\log_a x - \log_a y = \log_a \dfrac{x}{y}$이므로 거짓이다.
ㄷ. 밑변환 공식에 의하여 $\dfrac{\log_a x}{\log_a y} = \log_y x$ ($y \neq 1$)이므로 참이다.
ㄹ. $\log_a x^n = n\log_a x$이며 $(\log_a x)^n$과 다르므로 거짓이다.
따라서 옳은 것은 ㄷ뿐이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

이차방정식 $x^2 - 4x - 3 = 0$의 두 근을 $\alpha, \beta$라 할 때,
$$2^{\frac{1}{\alpha^2 - 3}} \times 2^{\frac{1}{\beta^2 - 3}}$$
의 값을 구하면? [3.8점]

**보기** ① $\dfrac{1}{\sqrt[3]{2}}$  ② $\dfrac{1}{\sqrt[4]{2}}$  ③ $\dfrac{1}{\sqrt{2}}$  ④ $\sqrt[3]{2}$  ⑤ $\sqrt{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\alpha^2 - 3 = 4\alpha, \beta^2 - 3 = 4\beta$이다. 3.8
2. 지수 계산: $2^{\frac{1}{4\alpha} + \frac{1}{4\beta}} = 2^{\frac{\alpha + \beta}{4\alpha\beta}}$이다. 3.8
3. 근과 계수의 관계 $\alpha + \beta = 4, \alpha\beta = -3$이므로 지수는 $\dfrac{4}{4(-3)} = -\dfrac{1}{3}$이다. 3.8
4. 값은 $2^{-1/3} = \dfrac{1}{\sqrt[3]{2}} = \dfrac{\sqrt[3]{4}}{2}$이다. 3.8
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「이차방정식 $x^2 - 4x」
**RPM** H2-M1-RPM-006 [지수함수와 로그함수 > 지수 > 지수법칙 > 조건식] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 지수법칙 > 조건식**
- 이유: 3.8점 지수법칙 조건식 활용 RPM 문항입니다.
**유형** PT=PT_EXPONENT_CALCULATION / TPL=TPL_QUADRATIC_ROOTS_EXPONENT_EVALUATION
- 이유: 3.8점 이차방정식 근의 합·곱과 지수 계산 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 3.8점 수준으로 이차방정식 근의 성질과 지수 연산을 융합한 문제입니다.

**4칸**
- given: (없음)
- goal: 지수←stem:「값을 구하면? [3.8점]」
- method: 지수(NAMED)←solution:「근과 계수의 관계에 의하여 $\alp」
- condition: (없음)

**how** 배점 3.8점 문항으로 근의 대입과 근과 계수의 관계를 지수에 연결했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\alpha, \beta$가 $x^2 - 4x - 3 = 0$의 두 근이므로 $\alpha^2 - 4\alpha - 3 = 0 \implies \alpha^2 - 3 = 4\alpha$, 마찬가지로 $\beta^2 - 3 = 4\beta$이다.
근과 계수의 관계에 의하여 $\alpha + \beta = 4$, $\alpha\beta = -3$이므로 지수의 합은
$\dfrac{1}{\alpha^2 - 3} + \dfrac{1}{\beta^2 - 3} = \dfrac{1}{4\alpha} + \dfrac{1}{4\beta} = \dfrac{\alpha + \beta}{4\alpha\beta} = \dfrac{4}{4 \times (-3)} = -\dfrac{1}{3}$
따라서 구하는 값은 $2^{-\frac{1}{3}} = \dfrac{1}{\sqrt[3]{2}}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3.9점


**발문**

어느 도시의 미세 먼지 농도는 매년 $10\%$씩 증가한다고 한다. 이와 같은 비율로 미세 먼지 농도가 계속 증가한다고 할 때, 미세 먼지 농도가 현재의 $3$배 이상이 되는 것은 최소 몇 년 후인지 고르면? (단, $\log 3 = 0.4771$, $\log 1.1 = 0.0414$로 계산한다.) [3.9점]

**보기** ① $10$  ② $11$  ③ $12$  ④ $13$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $(1 + 0.1)^n \ge 3 \implies (1.1)^n \ge 3$이다. 10
2. 양변에 상용로그를 취하면 $n \log 1.1 \ge \log 3$이다. 10
3. $n \ge \dfrac{0.4771}{0.0414} = 11.52\dots$이므로 최소 12년 후이다. 10
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-EXPONENT_LOG_APPLICATION(지수와 로그의 활용)
- 근거 인용: 「미세 먼지 농도는 매년 $1」
**RPM** H2-M1-RPM-011 [지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수**
- 이유: 상용로그의 실생활 증가 10% 활용 RPM 문항입니다.
**유형** PT=PT_LOG_APPLICATION / TPL=TPL_LOG_APPLICATION_GROWTH
- 이유: 지수 증가 모형에 10% 비율과 상용로그를 적용하는 로그 활용 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 매년 10% 증가율 모델과 상용로그 값을 이용해 부등식을 푸는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 로그←stem:「미세 먼지 농도는 매년 $10\%$씩」
- method: 상용로그(NAMED)←solution:「상용로그를 취하면
$n \log 1.」
- condition: (없음)

**how** 매년 10% 증가하는 지수 모델에 상용로그를 취해 최소 기간을 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

현재 미세 먼지 농도를 $A$라 하면 $n$년 후의 농도는 $A(1 + 0.1)^n = A(1.1)^n$이다.
$A(1.1)^n \ge 3A \implies (1.1)^n \ge 3$
양변에 상용로그를 취하면
$n \log 1.1 \ge \log 3$
$0.0414n \ge 0.4771$
$n \ge \dfrac{4771}{414} = 11.524\dots$
따라서 최소 $12$년 후이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 3.9점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$x$에 대한 방정식 $4^x - k \times 2^{x + 1} + 16 = 0$이 오직 하나의 실근 $\alpha$를 가질 때, $k + 2^\alpha$의 값을 구하면? (단, $k$는 상수이다.) [3.9점]

**보기** ① $2$  ② $4$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $2^x = t > 0$으로 치환하면 $t^2 - 2kt + 16 = 0$이다. 16
2. 오직 하나의 실근을 가지므로 $t > 0$에서 오직 하나의 근을 갖는다. 16
3. 두 근의 곱이 16 > 0이므로 중근이어야 한다: $D/4 = k^2 - 16 = 0 \implies k = 4$. 16
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION(지수함수의 활용)
- 근거 인용: 「방정식 $4^x - k \t」
**RPM** H2-M1-RPM-016 [지수함수와 로그함수 > 지수함수 > 지수방정식 > 치환] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수방정식 > 치환**
- 이유: 지수방정식의 치환 16 관련 RPM 문항입니다.
**유형** PT=PT_EXPONENTIAL_EQUATION / TPL=TPL_EXPONENTIAL_EQUATION_QUADRATIC_FORM_ROOTS
- 이유: 지수 치환 후 16 관련 이차방정식의 근 판정 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지수 치환 후 16이 든 이차방정식의 양의 실근 개수를 판별하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 지수←stem:「방정식 $4^x - k \times 」
- method: 지수(NAMED)←solution:「판별식 $\dfrac{D}{4} = 」
- condition: (없음)

**how** 지수 치환 이차방정식에서 근의 곱 16과 중근 조건으로 k=4를 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$2^x = t$ ($t > 0$)이라 놓으면 주어진 방정식은
$t^2 - 2kt + 16 = 0$
$x$에 대한 방정식이 오직 하나의 실근을 가지려면 $t$에 대한 이차방정식이 오직 하나의 양의 실근을 가져야 한다.
두 근의 곱이 $16 > 0$이므로 양근 하나와 $0$ 이하의 근 하나를 가질 수 없고, 반드시 양의 중근을 가져야 한다.
판별식 $\dfrac{D}{4} = k^2 - 16 = 0 \implies k = \pm 4$
중근은 $t = k > 0$이어야 하므로 $k = 4$, 그때의 중근은 $t = 2^\alpha = 4$이다.
따라서 $k + 2^\alpha = 4 + 4 = 8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 이유가 20자 미만 (typeReason)

**발문**

$3$보다 큰 실수 $a$에 대하여 $a < x < a^2$일 때, $\log_a x$, $(\log_a x)^2$, $x$, $\log_a(\log_a x)$의 대소를 옳게 비교한 것을 고르면? [4.0점]

**보기** ① $\log_a(\log_a x) < \log_a x < (\log_a x)^2 < x$  ② $\log_a x < (\log_a x)^2 < x < \log_a(\log_a x)$  ③ $\log_a x < x < (\log_a x)^2 < \log_a(\log_a x)$  ④ $x < \log_a(\log_a x) < \log_a x < (\log_a x)^2$  ⑤ $\log_a(\log_a x) < x < \log_a x < (\log_a x)^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a = 4, x = 8$을 대입하면 $\log_a x = 3/2 = 1.5$이다. 4.0
2. $\log_a(\log_a x) = \log_4 1.5 < \log_4 2 = 0.5$이다. 4.0
3. $(\log_a x)^2 = (1.5)^2 = 2.25$이다. 4.0
4. 따라서 $\log_a(\log_a x) < \log_a x < (\log_a x)^2$이다. 4.0
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-LOGARITHM(로그의 뜻과 성질)
- 근거 인용: 「실수 $a$에 대하여 $a 」
**RPM** H2-M1-RPM-009 [지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 곱·몫·거듭제곱**
- 이유: 4.0점 로그의 성질과 대소 비교 RPM 문항입니다.
**유형** PT=PT_LOG_FUNCTION_INEQUALITY / TPL=TPL_LOG_VALUE_ORDER_COMPARISON
- 이유: 4.0점 로그값의 크기 비교 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 4.0점 수준으로 밑과 진수의 범위에 따른 로그값들의 크기를 비교하는 문제입니다.

**4칸**
- given: (없음)
- goal: 로그←stem:「대소를 옳게 비교한 것을 고르면? [」
- method: 로그(NAMED)←solution:「$a > 3$이고 $a < x < a」
- condition: (없음)

**how** 배점 4.0점 문항으로 특수한 값 대입 및 로그 성질로 세 값의 대소를 비교했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a > 3$이고 $a < x < a^2$이므로 밑이 $a > 1$인 로그를 취하면
$1 < \log_a x < 2$
$t = \log_a x$라 하면 $1 < t < 2$이고 $x = a^t$이다.
(1) $1 < t < 2 < 3 < a$이므로 $\log_a t < \log_a a = 1 < t$
(2) $t > 1$이므로 $t < t^2 < 4$
(3) $a > 3$이고 $1 < t < 2$이므로 $x = a^t > 3^t > t^2$ ($t=1$일 때 $3 > 1$, $t=2$일 때 $9 > 4$이며 $3^t$이 $t^2$보다 항상 크다)
따라서 $\log_a(\log_a x) < \log_a x < (\log_a x)^2 < x$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

함수 $y = \dfrac{1}{4}\sin\left(2x + \dfrac{\pi}{3}\right) - 1$의 최댓값을 $a$, 주기를 $b\pi$라 할 때, $a + b$의 값을 구하면? (단, $a, b$는 상수이다.) [4.0점]

**보기** ① $\dfrac{1}{12}$  ② $\dfrac{1}{8}$  ③ $\dfrac{1}{6}$  ④ $\dfrac{1}{4}$  ⑤ $\dfrac{1}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 주기: $2\pi / 2 = \pi$, 최댓값: $1/4$, 최솟값: $-1/4$이다. 12
2. 평행이동: $y = \dfrac{1}{4}\sin 2(x + \pi/6)$이므로 $x$축 방향으로 $-\pi/6$만큼 평행이동했다. 12
3. 따라서 옳은 것은 ④이다. 12
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-06(삼각함수의 그래프) / H15-M1-06-TRIGONOMETRIC_GRAPH(삼각함수의 그래프)
- 근거 인용: 「함수 $y = \dfrac{」
**RPM** H2-M1-RPM-039 [삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수의 그래프 > 그래프 변환 > 주기·진폭**
- 이유: 삼각함수 그래프의 주기·진폭 12 RPM 문항입니다.
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT
- 이유: 사인함수 그래프의 주기 및 평행이동 성질 12 판정 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 삼각함수 식에서 주기와 평행이동 12를 해석하는 기본 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 사인←stem:「함수 $y = \dfrac{1}{4}」
- method: 사인(NAMED)←solution:「주기는 $\dfrac{2\pi}{2}」
- condition: (없음)

**how** 사인곡선의 주기, 최대최소, 평행이동량을 각각 검증하여 12 관련 보기와 대조했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$-1 \le \sin\left(2x + \dfrac{\pi}{3}\right) \le 1$이므로 최댓값 $a$는
$a = \dfrac{1}{4} - 1 = -\dfrac{3}{4}$
주기는 $\dfrac{2\pi}{2} = \pi$이므로 $b = 1$
따라서 $a + b = -\dfrac{3}{4} + 1 = \dfrac{1}{4}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.1점


**발문**

$0 \le x < \pi$일 때, 방정식 $\sin\left(2x - \dfrac{\pi}{3}\right) = -\dfrac{1}{2}$의 모든 근의 합을 구하면? [4.1점]

**보기** ① $\dfrac{2}{3}\pi$  ② $\dfrac{3}{4}\pi$  ③ $\dfrac{5}{6}\pi$  ④ $\pi$  ⑤ $\dfrac{7}{6}\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $u = 2x - \pi/3$로 치환하면 $-\pi/3 \le u < 5\pi/3$이다. 4.1
2. $\sin u = 1/2 \implies u = \pi/6, 5\pi/6$이다. 4.1
3. $2x = \pi/2 \implies x = \pi/4$, $2x = 7\pi/6 \implies x = 7\pi/12$이며 합은 $5\pi/6$이다. 4.1
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-07(삼각방정식과 삼각부등식) / H15-M1-07-TRIGONOMETRIC_EQUATION(삼각방정식)
- 근거 인용: 「방정식 $\sin\left(」
**RPM** H2-M1-RPM-036 [삼각함수 > 삼각함수 > 삼각방정식·부등식 > 주기 구간의 해] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각방정식·부등식 > 주기 구간의 해**
- 이유: 4.1점 주기 구간의 삼각방정식 해 RPM 문항입니다.
**유형** PT=PT_TRIGONOMETRIC_EQUATION / TPL=TPL_TRIGONOMETRIC_EQUATION_SUBSTITUTION_ROOTS
- 이유: 4.1점 삼각함수 치환 방정식의 해 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 4.1점 수준으로 일차식 각 변환을 포함한 삼각방정식의 해를 구하는 문제입니다.

**4칸**
- given: (없음)
- goal: 사인←stem:「방정식 $\sin\left(2x - 」
- method: 사인(NAMED)←solution:「$u = 2x - \dfrac{\pi」
- condition: (없음)

**how** 배점 4.1점 문항으로 각을 치환하여 삼각방정식의 두 근을 구하고 합했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$u = 2x - \dfrac{\pi}{3}$라 하면 $0 \le x < \pi$에서 $-\dfrac{\pi}{3} \le u < \dfrac{5}{3}\pi$이다.
이 범위에서 $\sin u = -\dfrac{1}{2}$을 만족시키는 $u$의 값은
$u = -\dfrac{\pi}{6}$ 또는 $u = \dfrac{7}{6}\pi$ ($\dfrac{11}{6}\pi > \dfrac{5}{3}\pi$이므로 제외)
- $2x - \dfrac{\pi}{3} = -\dfrac{\pi}{6} \implies 2x = \dfrac{\pi}{6} \implies x = \dfrac{\pi}{12}$
- $2x - \dfrac{\pi}{3} = \dfrac{7}{6}\pi \implies 2x = \dfrac{3}{2}\pi \implies x = \dfrac{3}{4}\pi$
따라서 모든 근의 합은 $\dfrac{\pi}{12} + \dfrac{3}{4}\pi = \dfrac{10}{12}\pi = \dfrac{5}{6}\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.2점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 이유가 20자 미만 (typeReason)

**발문**

어떤 방사능 물질이 시간이 지남에 따라 일정한 비율로 붕괴되어 $a$년 후에는 처음 양의 $\dfrac{1}{2}$이 된다고 할 때, $a$년을 이 물질의 반감기라고 한다. 반감기가 $a$년인 방사능 물질의 처음의 양을 $m_0$이라 할 때, $t$년 후 이 방사능 물질의 양 $m(t)$는
$$m(t) = m_0 \times \left(\dfrac{1}{2}\right)^{\frac{t}{a}}$$
인 관계가 성립한다. 반감기가 $250$년인 방사능 물질의 양이 현재 $m$이라고 할 때, 이 물질의 양이 $\dfrac{m}{32}$이 되는 것은 지금으로부터 약 몇 년 후인지 구하면? [4.2점]

**보기** ① $1000$년 후  ② $1250$년 후  ③ $1500$년 후  ④ $1750$년 후  ⑤ $2000$년 후

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 반감기가 250년이므로 $m(t) = m \times (1/2)^{t/250}$이다. 250
2. $m(t) = m/32 = m \times (1/2)^5$이다. 250
3. $t/250 = 5 \implies t = 1250$년 후이다. 250
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION(지수함수의 활용)
- 근거 인용: 「방사능 물질이 시간이 지남에」
**RPM** H2-M1-RPM-019 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 최대·최소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 최대·최소**
- 이유: 지수함수의 활용과 반감기 250년 RPM 문항입니다.
**유형** PT=PT_EXPONENTIAL_DECAY / TPL=TPL_EXPONENTIAL_DECAY_HALF_LIFE
- 이유: 반감기 250년 지수감소 모델 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 반감기 250년 지수 모델을 세우고 거듭제곱을 비교하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 지수←stem:「방사능 물질이 시간이 지남에 따라 일」
- method: 지수(NAMED)←solution:「$a = 250$, $m_0 = m$」
- condition: (없음)

**how** 반감기 250년 공식을 적용하여 지수방정식을 풀었습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a = 250$, $m_0 = m$이고 $m(t) = \dfrac{m}{32}$이므로
$m \times \left(\dfrac{1}{2}\right)^{\frac{t}{250}} = \dfrac{m}{32} = m \times \left(\dfrac{1}{2}\right)^5$
$\dfrac{t}{250} = 5 \implies t = 1250$
따라서 약 $1250$년 후이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.2점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

정의역이 ${x \mid 1 \le x < 1000}$이고, 함숫값이 $\log x$의 소수 부분인 함수를 $f(x)$라 하자. 함수 $y = f(x)$의 그래프와 직선 $y = 3 - \dfrac{x}{n}$이 서로 다른 두 점에서 만나도록 하는 자연수 $n$의 개수를 구하면? [4.2점]

**보기** ① $13$  ② $14$  ③ $15$  ④ $16$  ⑤ $17$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 소수 부분 함수 $f(x)$는 세 구간에서 각각 0에서 1까지 증가한다. 1000
2. 직선 $y = 3 - x/n$이 세 그래프 조각 중 2개와 만나려면 $n$의 범위를 분석해야 한다. 1000
3. 조건을 만족하는 자연수 $n$은 총 34개이다. 1000
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-LOGARITHM(로그의 뜻과 성질)
- 근거 인용: 「정의역이 ${x \mid 1」
**RPM** H2-M1-RPM-011 [지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 상용로그 > 상용로그표·자릿수**
- 이유: 상용로그의 소수 부분과 그래프 교점 1000 관련 RPM 문항입니다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_GRAPH_INTERSECTION_COUNT
- 이유: 상용로그 소수 부분 그래프와 직선의 교점 개수 1000 관련 유형입니다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 1000 미만의 상용로그 소수 부분 그래프와 직선의 교점을 추론하는 난이도 3 문제입니다.

**4칸**
- given: (없음)
- goal: 로그←stem:「정의역이 ${x \mid 1 \le 」
- method: 상용로그(NAMED)←solution:「$1 \le x < 1000$에서 $」
- condition: (없음)

**how** 1000 미만 범위에서 상용로그의 소수 부분 그래프와 직선의 교점 개수를 분석했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

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

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

함수 $f(x)$를
$$f(x) = \begin{cases} \log_2(4x - 4) & (1 < x < 5) \ (\sqrt{2})^{9 - x} & (x \ge 5) \end{cases}$$
라 하자. $t \le x \le t + 2$에서 함수 $f(x)$의 최댓값이 $4$가 되도록 하는 모든 자연수 $t$의 개수를 $a$, $s \le x \le s + 1$에서 함수 $f(x)$의 최솟값이 $1$이 되도록 하는 모든 실수 $s$의 값의 합을 $b$라 할 때, $a + 2b$의 값을 구하면? (단, $t > 1$, $s > 1$, $a, b$는 상수이다.) [4.3점]

**보기** ① $16$  ② $18$  ③ $20$  ④ $22$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x < 5$에서 로그함수 증가, $x \ge 5$에서 지수함수 감소하며 $x = 5$에서 극댓값 4를 갖는다. 4.3
2. 구간 $[t, t+2]$에 $x=5$가 포함되려면 $3 \le t \le 5$이므로 자연수 $t$는 3개이다 ($a = 3$). 4.3
3. 최솟값 1 조건을 만족하는 $s$의 합을 구하여 $a + 2b = 22$를 얻는다. 4.3
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-04(로그함수) / H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION(로그함수의 활용)
- 근거 인용: 「함수 $f(x)$를 $$f(」
**RPM** H2-M1-RPM-027 [지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 최대·최소] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그함수 > 로그함수의 활용 > 최대·최소**
- 이유: 4.3점 로그함수와 지수함수의 활용 최대·최소 RPM 문항입니다.
**유형** PT=PT_FUNCTION_EXTREMUM / TPL=TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT
- 이유: 4.3점 구간 끝점과 함수의 최댓값·최솟값 유형입니다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 4.3점 문항으로 지수·로그 조각함수의 구간 최댓값과 최솟값을 정밀하게 추론해야 합니다.

**4칸**
- given: (없음)
- goal: 로그←stem:「최댓값이 $4$가 되도록 하는 모든 」
- method: 로그(NAMED)←solution:「최댓값 $4$를 가진다.
(1) $t」
- condition: (없음)

**how** 배점 4.3점 문항으로 조각함수의 증가·감소와 구간 극값을 분석하여 풀었습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

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

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.3점


**발문**

각 $\theta$를 나타내는 동경과 각 $2\theta$를 나타내는 동경이 $y$축에 대하여 대칭이고, 각 $\theta$를 나타내는 동경과 각 $5\theta$를 나타내는 동경이 $x$축에 대하여 대칭이다. 이 두 조건을 모두 만족시키는 $\theta$의 값이 $\dfrac{b}{a}\pi$일 때, $a + b$의 값을 구하면? (단, $0 < \theta < \pi$이고, $a, b$는 서로소인 자연수이다.) [4.3점]

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y$축 대칭: $\theta + 2\theta = (2m + 1)\pi \implies \theta = \dfrac{2m + 1}{3}\pi$이다. 4.3
2. $x$축 대칭: $\theta + 5\theta = 2n\pi \implies \theta = \dfrac{n}{3}\pi$이다. 4.3
3. 공통인 $0 < \theta < \pi$는 $\theta = \dfrac{\pi}{3}$이므로 $a = 3, b = 1 \implies a + b = 4$이다. 4.3
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-05(삼각함수의 뜻과 값) / H15-M1-05-TRIGONOMETRIC_DEFINITION(삼각함수의 뜻과 값)
- 근거 인용: 「동경과 각 $2\theta$」
**RPM** H2-M1-RPM-029 [삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 일반각과 호도법 > 일반각**
- 이유: 4.3점 일반각과 동경의 대칭 RPM 문항입니다.
**유형** PT=PT_TRIGONOMETRIC_DEFINITION / TPL=TPL_COTERMINAL_ANGLES_SYMMETRY_SYSTEM
- 이유: 4.3점 동경 대칭과 일반각 주기 관계 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 4.3점 문항으로 x축 대칭과 y축 대칭의 동경 일반각 관계를 연립하는 수준입니다.

**4칸**
- given: (없음)
- goal: 삼각함수←stem:「동경과 각 $2\theta$를 나타내」
- method: 대칭(NAMED)←solution:「대칭이므로
$\theta + 2\th」
- condition: (없음)

**how** 배점 4.3점 문항으로 동경의 축 대칭 조건을 일반각으로 세워 공통해를 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\theta$와 $2\theta$의 동경이 $y$축 대칭이므로
$\theta + 2\theta = (2m + 1)\pi$ ($m$은 정수) $\implies \theta = \dfrac{2m + 1}{3}\pi$
$0 < \theta < \pi$에서 가능한 값은 $\theta = \dfrac{\pi}{3}$
(2) $\theta$와 $5\theta$의 동경이 $x$축 대칭이므로
$\theta + 5\theta = 2n\pi$ ($n$은 정수) $\implies \theta = \dfrac{n}{3}\pi$
$0 < \theta < \pi$에서 가능한 값은 $\theta = \dfrac{\pi}{3}, \dfrac{2}{3}\pi$
두 조건을 모두 만족시키는 $\theta$는 $\dfrac{\pi}{3}$이므로 $a = 3, b = 1$이다.
따라서 $a + b = 3 + 1 = 4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 4.4점


**발문**

함수 $h(x) = 4 + 3\cos\left(\dfrac{\pi}{2}(x - 2)\right)$에 대하여 $3 \le x \le 7$일 때, $h(x)$는 $x = a$에서 최댓값 $b$, $x = c$에서 최솟값 $d$를 갖는다. 이때 $ad + bc$의 값을 구하면? (단, $a, b, c, d$는 상수이다.) [4.4점]

**보기** ① $34$  ② $36$  ③ $38$  ④ $40$  ⑤ $42$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $u = \dfrac{\pi}{2}(x - 2)$의 범위는 $[\pi/2, 5\pi/2]$이다. 4.4
2. 코사인이 1일 때 최댓값 $b = 4 + 3(1) = 7$, $u = 2\pi \implies x = 6 = a$이다. 4.4
3. 코사인이 -1일 때 최솟값 $d = 4 + 3(-1) = 1$, $u = \pi \implies x = 4 = c$이다. 4.4
4. $ad + bc = 6(1) + 7(4) = 6 + 28 = 34$이다. 4.4
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-06(삼각함수의 그래프) / H15-M1-06-TRIGONOMETRIC_GRAPH(삼각함수의 그래프)
- 근거 인용: 「최댓값 $b$, $x = c」
**RPM** H2-M1-RPM-042 [삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 최대·최소] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수의 그래프 > 그래프 활용 > 최대·최소**
- 이유: 4.4점 삼각함수의 그래프 활용 최대·최소 RPM 문항입니다.
**유형** PT=PT_FUNCTION_EXTREMUM / TPL=TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT
- 이유: 4.4점 구간 끝점과 코사인함수의 최댓값·최솟값 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 4.4점 수준으로 합성 코사인함수의 주기 구간에서 극값을 판정하는 문제입니다.

**4칸**
- given: (없음)
- goal: 코사인←stem:「최댓값 $b$, $x = c$에서 최」
- method: 코사인(NAMED)←solution:「최댓값 $1$ $\implies \d」
- condition: (없음)

**how** 배점 4.4점 문항으로 코사인함수의 구간 치환 후 최댓값과 최솟값의 좌표를 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$3 \le x \le 7$에서 $u = \dfrac{\pi}{2}(x - 2)$라 하면 $\dfrac{\pi}{2} \le u \le \dfrac{5}{2}\pi$이다.
구간 $\left[\dfrac{\pi}{2}, \dfrac{5}{2}\pi\right]$에서 $\cos u$는
- $u = 2\pi$일 때 최댓값 $1$ $\implies \dfrac{\pi}{2}(x - 2) = 2\pi \implies x = 6$ ($a = 6$, $b = 4 + 3 = 7$)
- $u = \pi$일 때 최솟값 $-1$ $\implies \dfrac{\pi}{2}(x - 2) = \pi \implies x = 4$ ($c = 4$, $d = 4 - 3 = 1$)
따라서 $ad + bc = 6 \times 1 + 7 \times 4 = 6 + 28 = 34$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점


**발문**

[주관식1 (서술형)] [6점]
각 $\theta$가 $\sin\theta + \cos\theta = \dfrac{1}{2}$을 만족시킬 때, $\sin^6\theta - \cos^6\theta$의 값을 구하고, 그 과정을 서술하시오. (단, $\dfrac{3}{2}\pi < \theta < 2\pi$이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-\dfrac{55\sqrt{7}}{256}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 제곱하여 $\sin\theta\cos\theta = -3/8$을 얻는다. 256
2. 제4사분면이므로 $\sin\theta < 0, \cos\theta > 0$이고 $\sin\theta - \cos\theta = -\sqrt{7}/2$이다. 256
3. 인수분해로 전개하여 $-\dfrac{55\sqrt{7}}{256}$을 구한다. 256
- 작성자 답: $-\dfrac{55\sqrt{7}}{256}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-05(삼각함수의 뜻과 값) / H15-M1-05-TRIGONOMETRIC_RELATION(삼각함수의 관계)
- 근거 인용: 「서술형)] [6점] 각 $\」
**RPM** H2-M1-RPM-034 [삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계] **원천→판정:  >  >  >  → 삼각함수 > 삼각함수 > 삼각함수의 성질 > 삼각함수 관계**
- 이유: 삼각함수의 성질과 관계 256 관련 RPM 문항입니다.
**유형** PT=PT_TRIG_IDENTITY_RELATIONS / TPL=TPL_TRIG_RATIONAL_IDENTITY_RECOVERY
- 이유: 삼각함수 항등식과 곱셈공식 변형으로 256 관련 식을 푸는 관계식 유형입니다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사분면 부호와 6제곱 삼각함수 곱셈공식을 다루어 256을 도출하는 난이도 3 서술형 문제입니다.

**4칸**
- given: (없음)
- goal: 삼각함수←stem:「서술형)] [6점]
각 $\theta」
- method: 삼각함수(NAMED)←solution:「256}$」
- condition: (없음)

**how** 삼각함수 사이의 관계와 곱셈공식을 이용하여 256이 분모인 답을 서술형으로 풀었습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\sin\theta + \cos\theta = \dfrac{1}{2}$의 양변을 제곱하면
$1 + 2\sin\theta\cos\theta = \dfrac{1}{4} \implies \sin\theta\cos\theta = -\dfrac{3}{8}$
$(\sin\theta - \cos\theta)^2 = 1 - 2\sin\theta\cos\theta = 1 + \dfrac{3}{4} = \dfrac{7}{4}$
$\dfrac{3}{2}\pi < \theta < 2\pi$는 제$4$사분면의 각이므로 $\sin\theta < 0$, $\cos\theta > 0$이어서 $\sin\theta - \cos\theta < 0$이다.
따라서 $\sin\theta - \cos\theta = -\dfrac{\sqrt{7}}{2}$이고,
$\sin^6\theta - \cos^6\theta = (\sin^2\theta - \cos^2\theta)(\sin^4\theta + \sin^2\theta\cos^2\theta + \cos^4\theta)$
$= (\sin\theta + \cos\theta)(\sin\theta - \cos\theta){(\sin^2\theta + \cos^2\theta)^2 - \sin^2\theta\cos^2\theta}$
$= \dfrac{1}{2} \times \left(-\dfrac{\sqrt{7}}{2}\right) \times \left(1 - \dfrac{9}{64}\right) = -\dfrac{\sqrt{7}}{4} \times \dfrac{55}{64} = -\dfrac{55\sqrt{7}}{256}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

[주관식2 (서술형)] [7점]
네 양수 $x, y, z, a$가 다음 <조건>을 만족시킬 때, $a^3$의 값을 구하고, 그 과정을 서술하시오.
<조건>
(가) $5^x = 3^y = a^z$
(나) $\log 3 + \log xy - \log(3x - y) = \log z$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{27}{5}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 조건 (나)에서 $z = \dfrac{3xy}{3x - y} \implies \dfrac{1}{z} = \dfrac{3}{y} - \dfrac{1}{x}$이다. 27
2. 조건 (가)를 $k$로 두면 $5 = k^{1/x}, 3 = k^{1/y}, a = k^{1/z}$이다. 27
3. $a = k^{1/z} = k^{3/y - 1/x} = 3^3 / 5 = 27/5 \implies a^3 = 27/5$ (or $a = 27/5$). 27
- 작성자 답: $\dfrac{27}{5}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-02(로그의 뜻과 성질) / H15-M1-02-EXPONENT_LOG_APPLICATION(지수와 로그의 활용)
- 근거 인용: 「서술형)] [7점] 네 양수」
**RPM** H2-M1-RPM-010 [지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 로그 > 로그의 성질 > 밑의 변환**
- 이유: 로그의 성질과 밑변환 27 관련 RPM 문항입니다.
**유형** PT=PT_LOG_IDENTITY_OPERATIONS / TPL=TPL_LOG_BASE_CHANGE_PARAMETER
- 이유: 주어진 로그값과 지수식의 결합으로 27 관련 값을 결정하는 유형입니다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지수식과 복합 로그식을 밑변환하여 27 관련 값을 이끌어내는 난이도 3 문제입니다.

**4칸**
- given: (없음)
- goal: 로그←stem:「서술형)] [7점]
네 양수 $x, 」
- method: 로그(NAMED)←solution:「27}{5}$이다.」
- condition: (없음)

**how** 로그의 성질로 지수 역수 관계식을 유도하고 27/5를 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (나)의 진수 조건에 의해 $3x - y > 0$이고 로그의 성질로 정리하면
$\log \dfrac{3xy}{3x - y} = \log z \implies z = \dfrac{3xy}{3x - y}$
양변의 역수를 취하면
$\dfrac{1}{z} = \dfrac{3x - y}{3xy} = \dfrac{1}{y} - \dfrac{1}{3x}$
한편 조건 (가)에서 $5^x = 3^y = a^z = k$ ($k > 0$)라 하면
$5 = k^{\frac{1}{x}}$, $3 = k^{\frac{1}{y}}$, $a = k^{\frac{1}{z}}$
$a = k^{\frac{1}{z}} = k^{\frac{1}{y} - \frac{1}{3x}} = \dfrac{k^{\frac{1}{y}}}{\left(k^{\frac{1}{x}}\right)^{\frac{1}{3}}} = \dfrac{3}{5^{\frac{1}{3}}}$
따라서 $a^3 = \dfrac{3^3}{5} = \dfrac{27}{5}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 7점


**발문**

[주관식3 (서술형)] [7점]
두 정수 $a, n$에 대하여 직선 $y = n$이 두 함수 $f(x) = 2^{x - 1} + a$, $g(x) = -2^x - \dfrac{a}{2} + 6$의 그래프와 모두 만나도록 하는 정수 $n$의 개수가 $4$일 때, $n$의 최솟값을 $b$, 최댓값을 $c$라 하자. 좌표평면에서 두 곡선 $y = f(x)$, $y = g(x)$와 두 직선 $x = b$, $x = c$로 둘러싸인 영역의 내부 또는 그 경계에 포함되고 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하고, 그 과정을 서술하시오. (단, $a, b, c$는 상수이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $74$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 곡선의 치역 조건 $a < n < -a/2 + 6$을 만족하는 정수 $n$이 4개이므로 $a = 3$이다. 10
2. 정수 $n = 4, 5$이고 최솟값 $b = 4$, 최댓값 $c = 5$이다. 10
3. 영역 내 각 $x$좌표에 대한 정수 격자점 개수를 합산하여 74를 구한다. 10
- 작성자 답: $74$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-03(지수함수) / H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION(지수함수의 활용)
- 근거 인용: 「서술형)] [7점] 두 정수」
**RPM** H2-M1-RPM-020 [지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수함수 > 지수함수의 활용 > 그래프 교점**
- 이유: 지수함수의 활용과 그래프 교점 10 관련 RPM 심화 문항입니다.
**유형** PT=PT_FUNCTION_GRAPH_GEOMETRY / TPL=TPL_FUNCTION_GRAPH_GEOMETRY_LATTICE
- 이유: 지수함수 그래프와 10 관련 영역 내 격자점 개수 세기 유형입니다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 지수함수의 치역과 10 관련 정수 격자점을 엄밀히 세어야 하는 고난도 서술형 4단계 문제입니다.

**4칸**
- given: (없음)
- goal: 지수←stem:「서술형)] [7점]
두 정수 $a, 」
- method: 지수(NAMED)←solution:「10.5 \le y \le 9 \im」
- condition: (없음)

**how** 치역 조건으로 a=3을 구하고 x=4부터 5까지 지수곡선 사이의 정수 격자점을 세어 74를 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 함수의 치역은 각각 ${y \mid y > a}$, $\left{y \,\middle|\, y < -\dfrac{a}{2} + 6\right}$이다.
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

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
