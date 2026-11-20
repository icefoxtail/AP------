# 검수 묶음 — 24_매산여고_1학기_중간_고2_수학I_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2)**
- 문항 24개 / 검사 PASS 22, FAIL 2, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 6, 2단계 12, 3단계 3, 4단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 풀이 과정에 정답 값이 등장하지 않음
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q6**: 풀이 과정에 정답 값이 등장하지 않음
- **Q7**: 풀이 과정에 정답 값이 등장하지 않음
- **Q8**: 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 검사 코드: CHOICE_ORDER
- **Q12**: 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 풀이 과정에 정답 값이 등장하지 않음
- **Q22**: 풀이 과정에 정답 값이 등장하지 않음
- **Q23**: 풀이 과정에 정답 값이 등장하지 않음
- **Q24**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3.2점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$a = \sqrt[3]{2}$, $b^2 = \sqrt[3]{3}$일 때, $(ab)^{12}$의 값을 구하면? (단, $b$는 실수이다.) [3.2점]

**보기** ① $72$  ② $144$  ③ $216$  ④ $288$  ⑤ $432$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a = \sqrt[3]{2} = 2^{\frac{1}{3}}$이므로
2. $a^{12} = \left(2^{\frac{1}{3}}\right)^{12} = 2^4 = 16$
3. $b^2 = \sqrt[3]{3} = 3^{\frac{1}{3}}$이므로
4. $b^{12} = (b^2)^6 = \left(3^{\frac{1}{3}}\right)^6 = 3^2 = 9$
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$a = \sqrt[3]{2}$, $b^2 = \sqrt[3]{3}$일 때, $(ab)^{12}$의 값을 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q1번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ab)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q1번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ab)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ab)

**4칸**
- given: 실수←stem:「(단, $b$는 실수이다.) [3.2점]」
- goal: 실수←stem:「(단, $b$는 실수이다.) [3.2점]」
- method: 실수(NAMED)←stem:「(단, $b$는 실수이다.) [3.2점]」
- condition: (없음)

**how** Q1번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ab)

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
1. 로그가 정의되려면 밑 조건과 진수 조건을 모두 만족해야 한다.
2. (1) 밑 조건: $a - 2 > 0$이고 $a - 2 \neq 1$이므로 $a > 2$, $a \neq 3$
3. (2) 진수 조건: $a^2 - 7a - 18 > 0$
4. $(a - 9)(a + 2) > 0$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$\log_{(a - 2)}(a^2 - 7a - 18)$이 정의되기 위한 실수 $a$의 값의 범위를 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q2번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 18)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q2번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 18)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 18)

**4칸**
- given: 실수←stem:「$\log_{(a - 2)}(a^2 - 7a - 18)$이 정의되기 위한 실수 $a$의 값의 범위를 구하면?」
- goal: 범위←stem:「$\log_{(a - 2)}(a^2 - 7a - 18)$이 정의되기 위한 실수 $a$의 값의 범위를 구하면?」
- method: 로그(NAMED)←solution:「로그가 정의되려면 밑 조건과 진수 조건을 모두 만족해야 한다.」
- condition: (없음)

**how** Q2번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 18)

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
1. 주어진 식의 분모와 분자에 각각 $3^x$을 곱하면 (문항 토큰 3.4)
2. $\dfrac{3^{2x} - 1}{3^{2x} + 1} = \dfrac{1}{3}$
3. $3(3^{2x} - 1) = 3^{2x} + 1$
4. $2 \cdot 3^{2x} = 4 \implies 3^{2x} = 2$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「실수 $x$에 대하여 $\dfrac{3^x - 3^{-x}}{3^x + 3^{-x}} = \dfrac{1}{3}$일 때, $9^x - 9^{-x}$의 값을 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q3번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.4)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q3번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.4)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.4)

**4칸**
- given: 실수←stem:「실수 $x$에 대하여 $\dfrac{3^x - 3^{-x}}{3^x + 3^{-x}} = \dfrac{1}{3}$일 때, $9^x - 9^{-x}$의 값을 구하면?」
- goal: 분모←solution:「주어진 식의 분모와 분자에 각각 $3^x$을 곱하면」
- method: 분자(NAMED)←solution:「주어진 식의 분모와 분자에 각각 $3^x$을 곱하면」
- condition: (없음)

**how** Q3번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 3.4)

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

## Q4 — 객관식 3.4점


**발문**

다음 중 함수 $y = \log_{\frac{1}{2}}(x + 3) + 2$에 대한 설명으로 옳은 것을 고르면? [3.4점]

**보기** ① 정의역은 ${x \mid x < -3}$이다.  ② 치역은 ${y \mid y > 0}$이다.  ③ 그래프는 점 $(-3, 2)$를 지난다.  ④ $x$의 값이 증가하면 $y$의 값도 증가한다.  ⑤ 그래프의 점근선은 직선 $x = -3$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 진수 조건 $x + 3 > 0$에서 정의역은 ${x \mid x > -3}$이다. (문항 토큰 3.4)
2. (거짓)
3. ② 로그함수의 치역은 실수 전체의 집합이다.
4. (거짓)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「다음 중 함수 $y = \log_{\frac{1}{2}}(x + 3) + 2$에 대한 설명으로 옳은 것을 고르면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q4번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.4)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q4번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.4)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 3.4)

**4칸**
- given: 함수←stem:「다음 중 함수 $y = \log_{\frac{1}{2}}(x + 3) + 2$에 대한 설명으로 옳은 것을 고르면?」
- goal: 정의역←choices:「정의역은 ${x \mid x < -3}$이다.」
- method: 진수(NAMED)←solution:「① 진수 조건 $x + 3 > 0$에서 정의역은 ${x \mid x > -3}$이다.」
- condition: (없음)

**how** Q4번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 3.4)

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
1. 함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$는 밑이 $\dfrac{1}{4} < 1$인 감소함수이다. (문항 토큰 3.5)
2. 이 그래프가 제$3$사분면($x < 0, y < 0$)을 지나지 않으려면 $y$절편이 $0$ 이상이어야 한다.
3. $x = 0$일 때 $y = \left(\dfrac{1}{4}\right)^{-1} + k = 4 + k \ge 0$
4. 따라서 $k \ge -4$이므로 상수 $k$의 최솟값은 $-4$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$의 그래프가 제$3$사분면을 지나지 않도록 하는 상수 $k$의 최솟값을 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q5번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q5번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.5)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.5)

**4칸**
- given: 함수←stem:「함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$의 그래프가 제$3$사분면을 지나지 않도록 하는 상수 $k$의 최솟값을 구하면?」
- goal: 그래프←stem:「함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$의 그래프가 제$3$사분면을 지나지 않도록 하는 상수 $k$의 최솟값을 구하면?」
- method: 감소(NAMED)←solution:「함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$는 밑이 $\dfrac{1}{4} < 1$인 감소함수이다.」
- condition: (없음)

**how** Q5번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 3.5)

<details><summary>저장 해설 (판정 검토용)</summary>

함수 $y = \left(\dfrac{1}{4}\right)^{x - 1} + k$는 밑이 $\dfrac{1}{4} < 1$인 감소함수이다.
이 그래프가 제$3$사분면($x < 0, y < 0$)을 지나지 않으려면 $y$절편이 $0$ 이상이어야 한다.
$x = 0$일 때 $y = \left(\dfrac{1}{4}\right)^{-1} + k = 4 + k \ge 0$
따라서 $k \ge -4$이므로 상수 $k$의 최솟값은 $-4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

이차함수 $f(x) = (x - 3)^2 - 4$와 일차함수 $g(x) = x - 1$에 대하여 부등식
$$\left(\dfrac{3}{4}\right)^{f(x)} > \left(\dfrac{3}{4}\right)^{g(x)}$$
를 만족시키는 모든 자연수 $x$의 값의 합을 구하면? [3.5점]

**보기** ① $14$  ② $12$  ③ $10$  ④ $9$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑이 $\dfrac{3}{4}$ ($0 < \dfrac{3}{4} < 1$)이므로 지수함수는 감소하고, 주어진 부등식은 (문항 토큰 3.5)
2. $f(x) < g(x)$
3. $(x - 3)^2 - 4 < x - 1$
4. $x^2 - 6x + 5 < x - 1$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「이차함수 $f(x) = (x - 3)^2 - 4$와 일차함수 $g(x) = x - 1$에 대하여 부등식」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q6번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.5)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q6번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.5)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.5)

**4칸**
- given: 부등식←stem:「이차함수 $f(x) = (x - 3)^2 - 4$와 일차함수 $g(x) = x - 1$에 대하여 부등식」
- goal: 함수←stem:「이차함수 $f(x) = (x - 3)^2 - 4$와 일차함수 $g(x) = x - 1$에 대하여 부등식」
- method: 지수함수(NAMED)←solution:「밑이 $\dfrac{3}{4}$ ($0 < \dfrac{3}{4} < 1$)이므로 지수함수는 감소하고, 주어진 부등식은」
- condition: (없음)

**how** Q6번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 3.5)

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
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

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
1. $240^\circ = 240^\circ \times \dfrac{\pi}{180^\circ} = \dfrac{4}{3}\pi$ (참)
2. $-750^\circ = 360^\circ \times (-3) + 330^\circ$이므로 제$4$사분면의 각이다.
3. (거짓)
4. $760^\circ = 360^\circ \times 2 + 40^\circ$, $-320^\circ = 360^\circ \times (-1) + 40^\circ$이므로 일반각은 $360^\circ \times n + 40^\circ$로 같다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q7번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.6)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q7번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.6)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 3.6)

**4칸**
- given: 사분면←stem:「$-750^\circ$는 제$3$사분면의 각이다.」
- goal: 일반각←stem:「$760^\circ$와 $-320^\circ$의 일반각은 같다.」
- method: 거짓(NAMED)←solution:「(거짓)」
- condition: (없음)

**how** Q7번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 3.6)

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. $240^\circ = 240^\circ \times \dfrac{\pi}{180^\circ} = \dfrac{4}{3}\pi$ (참)
ㄴ. $-750^\circ = 360^\circ \times (-3) + 330^\circ$이므로 제$4$사분면의 각이다. (거짓)
ㄷ. $760^\circ = 360^\circ \times 2 + 40^\circ$, $-320^\circ = 360^\circ \times (-1) + 40^\circ$이므로 일반각은 $360^\circ \times n + 40^\circ$로 같다. (참)
따라서 옳은 것은 ㄱ, ㄷ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.6점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$0 \le x < 2\pi$일 때, 방정식 $\sqrt{3}\sin x - \cos x = 0$의 모든 근의 합을 구하면? [3.6점]

**보기** ① $\dfrac{2}{3}\pi$  ② $\pi$  ③ $\dfrac{7}{6}\pi$  ④ $\dfrac{4}{3}\pi$  ⑤ $\dfrac{5}{3}\pi$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\cos x = 0$이면 $\sin x = \pm 1$이 되어 등식이 성립하지 않으므로 $\cos x \neq 0$이다. (문항 토큰 3.6)
2. 양변을 $\cos x$로 나누면
3. $\sqrt{3}\tan x - 1 = 0 \implies \tan x = \dfrac{1}{\sqrt{3}}$
4. $0 \le x < 2\pi$에서 $\tan x = \dfrac{1}{\sqrt{3}}$의 해는 $x = \dfrac{\pi}{6}$ 또는 $x = \dfrac{7\pi}{6}$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$0 \le x < 2\pi$일 때, 방정식 $\sqrt{3}\sin x - \cos x = 0$의 모든 근의 합을 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q8번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.6)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q8번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.6)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.6)

**4칸**
- given: 방정식←stem:「$0 \le x < 2\pi$일 때, 방정식 $\sqrt{3}\sin x - \cos x = 0$의 모든 근의 합을 구하면?」
- goal: 근의←stem:「$0 \le x < 2\pi$일 때, 방정식 $\sqrt{3}\sin x - \cos x = 0$의 모든 근의 합을 구하면?」
- method: 성립(NAMED)←solution:「$\cos x = 0$이면 $\sin x = \pm 1$이 되어 등식이 성립하지 않으므로 $\cos x \neq 0$이다.」
- condition: (없음)

**how** Q8번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 3.6)

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
1. $0 \le x < \pi$에서 함수 $y = \cos x$는 감소함수이다. (문항 토큰 3.7)
2. $\cos \dfrac{\pi}{3} = \dfrac{1}{2}$, $\cos \dfrac{3}{4}\pi = -\dfrac{\sqrt{2}}{2}$이므로
3. $-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해는 $\dfrac{\pi}{3} < x \le \dfrac{3}{4}\pi$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$0 \le x < \pi$일 때, 부등식 $-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해를 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q9번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.7)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q9번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.7)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.7)

**4칸**
- given: 부등식←stem:「$0 \le x < \pi$일 때, 부등식 $-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해를 구하면?」
- goal: 등식←stem:「$0 \le x < \pi$일 때, 부등식 $-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해를 구하면?」
- method: 함수(NAMED)←solution:「$0 \le x < \pi$에서 함수 $y = \cos x$는 감소함수이다.」
- condition: (없음)

**how** Q9번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 3.7)

<details><summary>저장 해설 (판정 검토용)</summary>

$0 \le x < \pi$에서 함수 $y = \cos x$는 감소함수이다.
$\cos \dfrac{\pi}{3} = \dfrac{1}{2}$, $\cos \dfrac{3}{4}\pi = -\dfrac{\sqrt{2}}{2}$이므로
$-\dfrac{\sqrt{2}}{2} \le \cos x < \dfrac{1}{2}$의 해는 $\dfrac{\pi}{3} < x \le \dfrac{3}{4}\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

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
1. $\log_a x + \log_a y = \log_a(xy)$이므로 거짓이다.
2. $\log_a x - \log_a y = \log_a \dfrac{x}{y}$이므로 거짓이다.
3. 밑변환 공식에 의하여 $\dfrac{\log_a x}{\log_a y} = \log_y x$ ($y \neq 1$)이므로 참이다.
4. $\log_a x^n = n\log_a x$이며 $(\log_a x)^n$과 다르므로 거짓이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$x, y$가 양수이고, $a$가 $1$이 아닌 양수일 때, 다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q10번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.8)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q10번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.8)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 3.8)

**4칸**
- given: 양수←stem:「$x, y$가 양수이고, $a$가 $1$이 아닌 양수일 때, 다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은?」
- goal: 실수←stem:「$(\log_a x)^n = n\log_a x$ (단, $n$은 실수이다.)」
- method: 거짓(NAMED)←solution:「$\log_a x + \log_a y = \log_a(xy)$이므로 거짓이다.」
- condition: (없음)

**how** Q10번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 3.8)

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
1. $\alpha, \beta$가 $x^2 - 4x - 3 = 0$의 두 근이므로 $\alpha^2 - 4\alpha - 3 = 0 \implies \alpha^2 - 3 = 4\alpha$, 마찬가지로 $\beta^2 - 3 = 4\beta$이다. (문항 토큰 3.8)
2. 근과 계수의 관계에 의하여 $\alpha + \beta = 4$, $\alpha\beta = -3$이므로 지수의 합은
3. $\dfrac{1}{\alpha^2 - 3} + \dfrac{1}{\beta^2 - 3} = \dfrac{1}{4\alpha} + \dfrac{1}{4\beta} = \dfrac{\alpha + \beta}{4\alpha\beta} = \dfrac{4}{4 \times (-3)} = -\dfrac{1}{3}$
4. 따라서 구하는 값은 $2^{-\frac{1}{3}} = \dfrac{1}{\sqrt[3]{2}}$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「이차방정식 $x^2 - 4x - 3 = 0$의 두 근을 $\alpha, \beta$라 할 때,」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q11번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3.8)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q11번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3.8)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 3.8)

**4칸**
- given: 방정식←stem:「이차방정식 $x^2 - 4x - 3 = 0$의 두 근을 $\alpha, \beta$라 할 때,」
- goal: 이차방정식←stem:「이차방정식 $x^2 - 4x - 3 = 0$의 두 근을 $\alpha, \beta$라 할 때,」
- method: 계수(NAMED)←solution:「근과 계수의 관계에 의하여 $\alpha + \beta = 4$, $\alpha\beta = -3$이므로 지수의 합은」
- condition: (없음)

**how** Q11번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 3.8)

<details><summary>저장 해설 (판정 검토용)</summary>

$\alpha, \beta$가 $x^2 - 4x - 3 = 0$의 두 근이므로 $\alpha^2 - 4\alpha - 3 = 0 \implies \alpha^2 - 3 = 4\alpha$, 마찬가지로 $\beta^2 - 3 = 4\beta$이다.
근과 계수의 관계에 의하여 $\alpha + \beta = 4$, $\alpha\beta = -3$이므로 지수의 합은
$\dfrac{1}{\alpha^2 - 3} + \dfrac{1}{\beta^2 - 3} = \dfrac{1}{4\alpha} + \dfrac{1}{4\beta} = \dfrac{\alpha + \beta}{4\alpha\beta} = \dfrac{4}{4 \times (-3)} = -\dfrac{1}{3}$
따라서 구하는 값은 $2^{-\frac{1}{3}} = \dfrac{1}{\sqrt[3]{2}}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3.9점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

어느 도시의 미세 먼지 농도는 매년 $10\%$씩 증가한다고 한다. 이와 같은 비율로 미세 먼지 농도가 계속 증가한다고 할 때, 미세 먼지 농도가 현재의 $3$배 이상이 되는 것은 최소 몇 년 후인지 고르면? (단, $\log 3 = 0.4771$, $\log 1.1 = 0.0414$로 계산한다.) [3.9점]

**보기** ① $10$  ② $11$  ③ $12$  ④ $13$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 현재 미세 먼지 농도를 $A$라 하면 $n$년 후의 농도는 $A(1 + 0.1)^n = A(1.1)^n$이다.
2. $A(1.1)^n \ge 3A \implies (1.1)^n \ge 3$
3. 양변에 상용로그를 취하면
4. $n \log 1.1 \ge \log 3$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「어느 도시의 미세 먼지 농도는 매년 $10\%$씩 증가한다고 한다.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q12번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q12번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 증가←stem:「어느 도시의 미세 먼지 농도는 매년 $10\%$씩 증가한다고 한다.」
- goal: 최소←stem:「이와 같은 비율로 미세 먼지 농도가 계속 증가한다고 할 때, 미세 먼지 농도가 현재의 $3$배 이상이 되는 것은 최소 몇 년 후인지 고르면?」
- method: 로그(NAMED)←solution:「양변에 상용로그를 취하면」
- condition: (없음)

**how** Q12번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 10)

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
1. $2^x = t$ ($t > 0$)이라 놓으면 주어진 방정식은
2. $t^2 - 2kt + 16 = 0$
3. $x$에 대한 방정식이 오직 하나의 실근을 가지려면 $t$에 대한 이차방정식이 오직 하나의 양의 실근을 가져야 한다.
4. 두 근의 곱이 $16 > 0$이므로 양근 하나와 $0$ 이하의 근 하나를 가질 수 없고, 반드시 양의 중근을 가져야 한다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$x$에 대한 방정식 $4^x - k \times 2^{x + 1} + 16 = 0$이 오직 하나의 실근 $\alpha$를 가질 때, $k + 2^\alpha$의 값을 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q13번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 16)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q13번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 16)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 16)

**4칸**
- given: 방정식←stem:「$x$에 대한 방정식 $4^x - k \times 2^{x + 1} + 16 = 0$이 오직 하나의 실근 $\alpha$를 가질 때, $k + 2^\alpha$의 값을 구하면?」
- goal: 실근←stem:「$x$에 대한 방정식 $4^x - k \times 2^{x + 1} + 16 = 0$이 오직 하나의 실근 $\alpha$를 가질 때, $k + 2^\alpha$의 값을 구하면?」
- method: 이차방정식(NAMED)←solution:「$x$에 대한 방정식이 오직 하나의 실근을 가지려면 $t$에 대한 이차방정식이 오직 하나의 양의 실근을 가져야 한다.」
- condition: (없음)

**how** Q13번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 16)

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

## Q14 — 객관식 4점


**발문**

$3$보다 큰 실수 $a$에 대하여 $a < x < a^2$일 때, $\log_a x$, $(\log_a x)^2$, $x$, $\log_a(\log_a x)$의 대소를 옳게 비교한 것을 고르면? [4.0점]

**보기** ① $\log_a(\log_a x) < \log_a x < (\log_a x)^2 < x$  ② $\log_a x < (\log_a x)^2 < x < \log_a(\log_a x)$  ③ $\log_a x < x < (\log_a x)^2 < \log_a(\log_a x)$  ④ $x < \log_a(\log_a x) < \log_a x < (\log_a x)^2$  ⑤ $\log_a(\log_a x) < x < \log_a x < (\log_a x)^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a > 3$이고 $a < x < a^2$이므로 밑이 $a > 1$인 로그를 취하면 (문항 토큰 4.0)
2. $1 < \log_a x < 2$
3. $t = \log_a x$라 하면 $1 < t < 2$이고 $x = a^t$이다.
4. (1) $1 < t < 2 < 3 < a$이므로 $\log_a t < \log_a a = 1 < t$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$3$보다 큰 실수 $a$에 대하여 $a < x < a^2$일 때, $\log_a x$, $(\log_a x)^2$, $x$, $\log_a(\log_a x)$의 대소를 옳게 비교한 것을 고르면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q14번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 4.0)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q14번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 4.0)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 4.0)

**4칸**
- given: 실수←stem:「$3$보다 큰 실수 $a$에 대하여 $a < x < a^2$일 때, $\log_a x$, $(\log_a x)^2$, $x$, $\log_a(\log_a x)$의 대소를 옳게 비교한 것을 고르면?」
- goal: 대소←stem:「$3$보다 큰 실수 $a$에 대하여 $a < x < a^2$일 때, $\log_a x$, $(\log_a x)^2$, $x$, $\log_a(\log_a x)$의 대소를 옳게 비교한 것을 고르면?」
- method: 로그(NAMED)←solution:「$a > 3$이고 $a < x < a^2$이므로 밑이 $a > 1$인 로그를 취하면」
- condition: (없음)

**how** Q14번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 4.0)

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

## Q15 — 객관식 4점


**발문**

함수 $y = \dfrac{1}{4}\sin\left(2x + \dfrac{\pi}{3}\right) - 1$의 최댓값을 $a$, 주기를 $b\pi$라 할 때, $a + b$의 값을 구하면? (단, $a, b$는 상수이다.) [4.0점]

**보기** ① $\dfrac{1}{12}$  ② $\dfrac{1}{8}$  ③ $\dfrac{1}{6}$  ④ $\dfrac{1}{4}$  ⑤ $\dfrac{1}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $-1 \le \sin\left(2x + \dfrac{\pi}{3}\right) \le 1$이므로 최댓값 $a$는 (문항 토큰 4.0)
2. $a = \dfrac{1}{4} - 1 = -\dfrac{3}{4}$
3. 주기는 $\dfrac{2\pi}{2} = \pi$이므로 $b = 1$
4. 따라서 $a + b = -\dfrac{3}{4} + 1 = \dfrac{1}{4}$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「함수 $y = \dfrac{1}{4}\sin\left(2x + \dfrac{\pi}{3}\right) - 1$의 최댓값을 $a$, 주기를 $b\pi$라 할 때, $a + b$의 값을 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q15번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 4.0)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q15번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 4.0)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 4.0)

**4칸**
- given: 함수←stem:「함수 $y = \dfrac{1}{4}\sin\left(2x + \dfrac{\pi}{3}\right) - 1$의 최댓값을 $a$, 주기를 $b\pi$라 할 때, $a + b$의 값을 구하면?」
- goal: 주기←stem:「함수 $y = \dfrac{1}{4}\sin\left(2x + \dfrac{\pi}{3}\right) - 1$의 최댓값을 $a$, 주기를 $b\pi$라 할 때, $a + b$의 값을 구하면?」
- method: 최댓값(NAMED)←solution:「$-1 \le \sin\left(2x + \dfrac{\pi}{3}\right) \le 1$이므로 최댓값 $a$는」
- condition: (없음)

**how** Q15번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 4.0)

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
1. $u = 2x - \dfrac{\pi}{3}$라 하면 $0 \le x < \pi$에서 $-\dfrac{\pi}{3} \le u < \dfrac{5}{3}\pi$이다.
2. 이 범위에서 $\sin u = -\dfrac{1}{2}$을 만족시키는 $u$의 값은
3. $u = -\dfrac{\pi}{6}$ 또는 $u = \dfrac{7}{6}\pi$ ($\dfrac{11}{6}\pi > \dfrac{5}{3}\pi$이므로 제외)
4. - $2x - \dfrac{\pi}{3} = -\dfrac{\pi}{6} \implies 2x = \dfrac{\pi}{6} \implies x = \dfrac{\pi}{12}$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「$0 \le x < \pi$일 때, 방정식 $\sin\left(2x - \dfrac{\pi}{3}\right) = -\dfrac{1}{2}$의 모든 근의 합을 구하면?」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q16번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 4.1)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q16번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 4.1)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 4.1)

**4칸**
- given: 방정식←stem:「$0 \le x < \pi$일 때, 방정식 $\sin\left(2x - \dfrac{\pi}{3}\right) = -\dfrac{1}{2}$의 모든 근의 합을 구하면?」
- goal: 근의←stem:「$0 \le x < \pi$일 때, 방정식 $\sin\left(2x - \dfrac{\pi}{3}\right) = -\dfrac{1}{2}$의 모든 근의 합을 구하면?」
- method: 범위(NAMED)←solution:「이 범위에서 $\sin u = -\dfrac{1}{2}$을 만족시키는 $u$의 값은」
- condition: (없음)

**how** Q16번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 4.1)

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

## Q17 — 객관식 4.2점


**발문**

어떤 방사능 물질이 시간이 지남에 따라 일정한 비율로 붕괴되어 $a$년 후에는 처음 양의 $\dfrac{1}{2}$이 된다고 할 때, $a$년을 이 물질의 반감기라고 한다. 반감기가 $a$년인 방사능 물질의 처음의 양을 $m_0$이라 할 때, $t$년 후 이 방사능 물질의 양 $m(t)$는
$$m(t) = m_0 \times \left(\dfrac{1}{2}\right)^{\frac{t}{a}}$$
인 관계가 성립한다. 반감기가 $250$년인 방사능 물질의 양이 현재 $m$이라고 할 때, 이 물질의 양이 $\dfrac{m}{32}$이 되는 것은 지금으로부터 약 몇 년 후인지 구하면? [4.2점]

**보기** ① $1000$년 후  ② $1250$년 후  ③ $1500$년 후  ④ $1750$년 후  ⑤ $2000$년 후

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a = 250$, $m_0 = m$이고 $m(t) = \dfrac{m}{32}$이므로
2. $m \times \left(\dfrac{1}{2}\right)^{\frac{t}{250}} = \dfrac{m}{32} = m \times \left(\dfrac{1}{2}\right)^5$
3. $\dfrac{t}{250} = 5 \implies t = 1250$
4. 따라서 약 $1250$년 후이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「어떤 방사능 물질이 시간이 지남에 따라 일정한 비율로 붕괴되어 $a$년 후에는 처음 양의 $\dfrac{1}{2}$이 된다고 할 때, $a$년을 이 물질의 반감기라고 한다.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q17번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 250)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q17번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 250)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 250)

**4칸**
- given: 어떤←stem:「어떤 방사능 물질이 시간이 지남에 따라 일정한 비율로 붕괴되어 $a$년 후에는 처음 양의 $\dfrac{1}{2}$이 된다고 할 때, $a$년을 이 물질의 반감기라고 한다.」
- goal: 일정←stem:「어떤 방사능 물질이 시간이 지남에 따라 일정한 비율로 붕괴되어 $a$년 후에는 처음 양의 $\dfrac{1}{2}$이 된다고 할 때, $a$년을 이 물질의 반감기라고 한다.」
- method: 어떤(NAMED)←stem:「어떤 방사능 물질이 시간이 지남에 따라 일정한 비율로 붕괴되어 $a$년 후에는 처음 양의 $\dfrac{1}{2}$이 된다고 할 때, $a$년을 이 물질의 반감기라고 한다.」
- condition: (없음)

**how** Q17번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 250)

<details><summary>저장 해설 (판정 검토용)</summary>

$a = 250$, $m_0 = m$이고 $m(t) = \dfrac{m}{32}$이므로
$m \times \left(\dfrac{1}{2}\right)^{\frac{t}{250}} = \dfrac{m}{32} = m \times \left(\dfrac{1}{2}\right)^5$
$\dfrac{t}{250} = 5 \implies t = 1250$
따라서 약 $1250$년 후이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.2점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

정의역이 ${x \mid 1 \le x < 1000}$이고, 함숫값이 $\log x$의 소수 부분인 함수를 $f(x)$라 하자. 함수 $y = f(x)$의 그래프와 직선 $y = 3 - \dfrac{x}{n}$이 서로 다른 두 점에서 만나도록 하는 자연수 $n$의 개수를 구하면? [4.2점]

**보기** ① $13$  ② $14$  ③ $15$  ④ $16$  ⑤ $17$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $1 \le x < 1000$에서 $f(x)$는 세 구간에서 각각 $\log x$ ($1 \le x < 10$), $\log x - 1$ ($10 \le x < 100$), $\log x - 2$ ($100 \le x < 1000$)로 $0$에서 $1$ 미만까지 증가한다.
2. 직선 $y = 3 - \dfrac{x}{n}$은 $x > 0$에서 감소하며 $y = 1$일 때 $x = 2n$, $y = 0$일 때 $x = 3n$이다.
3. 각 구간과의 교점 조건은 다음과 같다.
4. - 구간 $[1, 10)$: $y(1) = 3 - \dfrac{1}{n} \ge 2 > 0$이므로 $y(10) < 1$일 때, 즉 $3 - \dfrac{10}{n} < 1 \iff n < 5$일 때 교점이 $1$개 생긴다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「정의역이 ${x \mid 1 \le x < 1000}$이고, 함숫값이 $\log x$의 소수 부분인 함수를 $f(x)$라 하자.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q18번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 1000)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q18번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 1000)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 1000)

**4칸**
- given: 소수←stem:「정의역이 ${x \mid 1 \le x < 1000}$이고, 함숫값이 $\log x$의 소수 부분인 함수를 $f(x)$라 하자.」
- goal: 함수←stem:「정의역이 ${x \mid 1 \le x < 1000}$이고, 함숫값이 $\log x$의 소수 부분인 함수를 $f(x)$라 하자.」
- method: 증가(NAMED)←solution:「$1 \le x < 1000$에서 $f(x)$는 세 구간에서 각각 $\log x$ ($1 \le x < 10$), $\log x - 1$ ($10 \le x < 100$), $\log x - 2$ ($100 \le x < 1000$)로 $0$에서 $1$ 미만까지 증가한다.」
- condition: (없음)

**how** Q18번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 1000)

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
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

함수 $f(x)$를
$$f(x) = \begin{cases} \log_2(4x - 4) & (1 < x < 5) \ (\sqrt{2})^{9 - x} & (x \ge 5) \end{cases}$$
라 하자. $t \le x \le t + 2$에서 함수 $f(x)$의 최댓값이 $4$가 되도록 하는 모든 자연수 $t$의 개수를 $a$, $s \le x \le s + 1$에서 함수 $f(x)$의 최솟값이 $1$이 되도록 하는 모든 실수 $s$의 값의 합을 $b$라 할 때, $a + 2b$의 값을 구하면? (단, $t > 1$, $s > 1$, $a, b$는 상수이다.) [4.3점]

**보기** ① $16$  ② $18$  ③ $20$  ④ $22$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $1 < x < 5$에서 $f(x) = \log_2(4x - 4)$는 증가하고 $\lim_{x \to 5-} f(x) = \log_2 16 = 4$이다.
2. $x \ge 5$에서 $f(x) = (\sqrt{2})^{9 - x}$는 감소하고 $f(5) = (\sqrt{2})^4 = 4$이다.
3. 따라서 $f(x)$는 $x = 5$에서 최댓값 $4$를 가진다.
4. (1) $t \le x \le t + 2$에서 $f(x)$의 최댓값이 $4$가 되려면 $t \le 5 \le t + 2$, 즉 $3 \le t \le 5$이어야 한다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「함수 $f(x)$를」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q19번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cases)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q19번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cases)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 cases)

**4칸**
- given: 함수←stem:「함수 $f(x)$를」
- goal: 자연수←stem:「$t \le x \le t + 2$에서 함수 $f(x)$의 최댓값이 $4$가 되도록 하는 모든 자연수 $t$의 개수를 $a$, $s \le x \le s + 1$에서 함수 $f(x)$의 최솟값이 $1$이 되도록 하는 모든 실수 $s$의 값의 합을 $b$라 할 때, $a + 2b$의 값을 구하면?」
- method: 증가(NAMED)←solution:「$1 < x < 5$에서 $f(x) = \log_2(4x - 4)$는 증가하고 $\lim_{x \to 5-} f(x) = \log_2 16 = 4$이다.」
- condition: (없음)

**how** Q19번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 cases)

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
1. (1) $\theta$와 $2\theta$의 동경이 $y$축 대칭이므로 (문항 토큰 4.3)
2. $\theta + 2\theta = (2m + 1)\pi$ ($m$은 정수) $\implies \theta = \dfrac{2m + 1}{3}\pi$
3. $0 < \theta < \pi$에서 가능한 값은 $\theta = \dfrac{\pi}{3}$
4. (2) $\theta$와 $5\theta$의 동경이 $x$축 대칭이므로
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「각 $\theta$를 나타내는 동경과 각 $2\theta$를 나타내는 동경이 $y$축에 대하여 대칭이고, 각 $\theta$를 나타내는 동경과 각 $5\theta$를 나타내는 동경이 $x$축에 대하여 대칭이다.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q20번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 4.3)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q20번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 4.3)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 4.3)

**4칸**
- given: 대칭←stem:「각 $\theta$를 나타내는 동경과 각 $2\theta$를 나타내는 동경이 $y$축에 대하여 대칭이고, 각 $\theta$를 나타내는 동경과 각 $5\theta$를 나타내는 동경이 $x$축에 대하여 대칭이다.」
- goal: 동경←stem:「각 $\theta$를 나타내는 동경과 각 $2\theta$를 나타내는 동경이 $y$축에 대하여 대칭이고, 각 $\theta$를 나타내는 동경과 각 $5\theta$를 나타내는 동경이 $x$축에 대하여 대칭이다.」
- method: 축대칭(NAMED)←solution:「(1) $\theta$와 $2\theta$의 동경이 $y$축 대칭이므로」
- condition: (없음)

**how** Q20번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 4.3)

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

## Q21 — 객관식 4.4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

함수 $h(x) = 4 + 3\cos\left(\dfrac{\pi}{2}(x - 2)\right)$에 대하여 $3 \le x \le 7$일 때, $h(x)$는 $x = a$에서 최댓값 $b$, $x = c$에서 최솟값 $d$를 갖는다. 이때 $ad + bc$의 값을 구하면? (단, $a, b, c, d$는 상수이다.) [4.4점]

**보기** ① $34$  ② $36$  ③ $38$  ④ $40$  ⑤ $42$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $3 \le x \le 7$에서 $u = \dfrac{\pi}{2}(x - 2)$라 하면 $\dfrac{\pi}{2} \le u \le \dfrac{5}{2}\pi$이다. (문항 토큰 ad)
2. 구간 $\left[\dfrac{\pi}{2}, \dfrac{5}{2}\pi\right]$에서 $\cos u$는
3. - $u = 2\pi$일 때 최댓값 $1$ $\implies \dfrac{\pi}{2}(x - 2) = 2\pi \implies x = 6$ ($a = 6$, $b = 4 + 3 = 7$)
4. - $u = \pi$일 때 최솟값 $-1$ $\implies \dfrac{\pi}{2}(x - 2) = \pi \implies x = 4$ ($c = 4$, $d = 4 - 3 = 1$)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「함수 $h(x) = 4 + 3\cos\left(\dfrac{\pi}{2}(x - 2)\right)$에 대하여 $3 \le x \le 7$일 때, $h(x)$는 $x = a$에서 최댓값 $b$, $x = c$에서 최솟값 $d$를 갖는다.」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q21번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ad)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q21번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ad)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ad)

**4칸**
- given: 함수←stem:「함수 $h(x) = 4 + 3\cos\left(\dfrac{\pi}{2}(x - 2)\right)$에 대하여 $3 \le x \le 7$일 때, $h(x)$는 $x = a$에서 최댓값 $b$, $x = c$에서 최솟값 $d$를 갖는다.」
- goal: 최댓값←stem:「함수 $h(x) = 4 + 3\cos\left(\dfrac{\pi}{2}(x - 2)\right)$에 대하여 $3 \le x \le 7$일 때, $h(x)$는 $x = a$에서 최댓값 $b$, $x = c$에서 최솟값 $d$를 갖는다.」
- method: 구간(NAMED)←solution:「구간 $\left[\dfrac{\pi}{2}, \dfrac{5}{2}\pi\right]$에서 $\cos u$는」
- condition: (없음)

**how** Q21번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ad)

<details><summary>저장 해설 (판정 검토용)</summary>

$3 \le x \le 7$에서 $u = \dfrac{\pi}{2}(x - 2)$라 하면 $\dfrac{\pi}{2} \le u \le \dfrac{5}{2}\pi$이다.
구간 $\left[\dfrac{\pi}{2}, \dfrac{5}{2}\pi\right]$에서 $\cos u$는
- $u = 2\pi$일 때 최댓값 $1$ $\implies \dfrac{\pi}{2}(x - 2) = 2\pi \implies x = 6$ ($a = 6$, $b = 4 + 3 = 7$)
- $u = \pi$일 때 최솟값 $-1$ $\implies \dfrac{\pi}{2}(x - 2) = \pi \implies x = 4$ ($c = 4$, $d = 4 - 3 = 1$)
따라서 $ad + bc = 6 \times 1 + 7 \times 4 = 6 + 28 = 34$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[주관식1 (서술형)] [6점]
각 $\theta$가 $\sin\theta + \cos\theta = \dfrac{1}{2}$을 만족시킬 때, $\sin^6\theta - \cos^6\theta$의 값을 구하고, 그 과정을 서술하시오. (단, $\dfrac{3}{2}\pi < \theta < 2\pi$이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-\dfrac{55\sqrt{7}}{256}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\sin\theta + \cos\theta = \dfrac{1}{2}$의 양변을 제곱하면 (문항 토큰 64)
2. $1 + 2\sin\theta\cos\theta = \dfrac{1}{4} \implies \sin\theta\cos\theta = -\dfrac{3}{8}$
3. $(\sin\theta - \cos\theta)^2 = 1 - 2\sin\theta\cos\theta = 1 + \dfrac{3}{4} = \dfrac{7}{4}$
4. $\dfrac{3}{2}\pi < \theta < 2\pi$는 제$4$사분면의 각이므로 $\sin\theta < 0$, $\cos\theta > 0$이어서 $\sin\theta - \cos\theta < 0$이다.
- 작성자 답: $-\dfrac{55\sqrt{7}}{256}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「[주관식1 (서술형)] [6점]」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q22번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 64)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q22번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 64)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 64)

**4칸**
- given: 제곱←solution:「$\sin\theta + \cos\theta = \dfrac{1}{2}$의 양변을 제곱하면」
- goal: 사분면←solution:「$\dfrac{3}{2}\pi < \theta < 2\pi$는 제$4$사분면의 각이므로 $\sin\theta < 0$, $\cos\theta > 0$이어서 $\sin\theta - \cos\theta < 0$이다.」
- method: 제곱(NAMED)←solution:「$\sin\theta + \cos\theta = \dfrac{1}{2}$의 양변을 제곱하면」
- condition: (없음)

**how** Q22번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 $-\dfrac{55\sqrt{7}}{256}$을(를) 바르게 구하였다. (문항 토큰 64)

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

## Q23 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[주관식2 (서술형)] [7점]
네 양수 $x, y, z, a$가 다음 <조건>을 만족시킬 때, $a^3$의 값을 구하고, 그 과정을 서술하시오.
<조건>
(가) $5^x = 3^y = a^z$
(나) $\log 3 + \log xy - \log(3x - y) = \log z$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{27}{5}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 조건 (나)의 진수 조건에 의해 $3x - y > 0$이고 로그의 성질로 정리하면
2. $\log \dfrac{3xy}{3x - y} = \log z \implies z = \dfrac{3xy}{3x - y}$
3. 양변의 역수를 취하면
4. $\dfrac{1}{z} = \dfrac{3x - y}{3xy} = \dfrac{1}{y} - \dfrac{1}{3x}$
- 작성자 답: $\dfrac{27}{5}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「[주관식2 (서술형)] [7점]」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q23번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 xy)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q23번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 xy)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 xy)

**4칸**
- given: 조건←stem:「네 양수 $x, y, z, a$가 다음 <조건>을 만족시킬 때, $a^3$의 값을 구하고, 그 과정을 서술하시오.」
- goal: 양수←stem:「네 양수 $x, y, z, a$가 다음 <조건>을 만족시킬 때, $a^3$의 값을 구하고, 그 과정을 서술하시오.」
- method: 로그(NAMED)←solution:「조건 (나)의 진수 조건에 의해 $3x - y > 0$이고 로그의 성질로 정리하면」
- condition: (없음)

**how** Q23번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 $\dfrac{27}{5}$을(를) 바르게 구하였다. (문항 토큰 xy)

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

## Q24 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[주관식3 (서술형)] [7점]
두 정수 $a, n$에 대하여 직선 $y = n$이 두 함수 $f(x) = 2^{x - 1} + a$, $g(x) = -2^x - \dfrac{a}{2} + 6$의 그래프와 모두 만나도록 하는 정수 $n$의 개수가 $4$일 때, $n$의 최솟값을 $b$, 최댓값을 $c$라 하자. 좌표평면에서 두 곡선 $y = f(x)$, $y = g(x)$와 두 직선 $x = b$, $x = c$로 둘러싸인 영역의 내부 또는 그 경계에 포함되고 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하고, 그 과정을 서술하시오. (단, $a, b, c$는 상수이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $74$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 함수의 치역은 각각 ${y \mid y > a}$, $\left{y \,\middle|\, y < -\dfrac{a}{2} + 6\right}$이다. (문항 토큰 11)
2. 직선 $y = n$이 두 그래프와 모두 만나려면 $a < n < -\dfrac{a}{2} + 6$이어야 하고, 이를 만족시키는 정수 $n$이 $4$개이려면
3. $4 < \left(-\dfrac{a}{2} + 6\right) - a \le 5$
4. $4 < 6 - \dfrac{3}{2}a \le 5 \implies 1 \le \dfrac{3}{2}a < 2 \implies \dfrac{2}{3} \le a < \dfrac{4}{3}$
- 작성자 답: $74$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M1-01(지수의 뜻과 성질) / H15-M1-01-EXPONENT(지수의 뜻과 성질)
- 근거 인용: 「[주관식3 (서술형)] [7점]」
**RPM** H2-M1-RPM-001 [지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근] **원천→판정:  >  >  >  → 지수함수와 로그함수 > 지수 > 거듭제곱근 > n제곱근**
- 이유: Q24번 문항은 H2-M1-RPM-001에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 11)
**유형** PT=PT_EXPONENT_LAW_APPLICATION / TPL=TPL_EXPONENT_LAW_EVALUATION
- 이유: Q24번 문항은 PT_EXPONENT_LAW_APPLICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 11)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q24번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 11)

**4칸**
- given: 정수←stem:「두 정수 $a, n$에 대하여 직선 $y = n$이 두 함수 $f(x) = 2^{x - 1} + a$, $g(x) = -2^x - \dfrac{a}{2} + 6$의 그래프와 모두 만나도록 하는 정수 $n$의 개수가 $4$일 때, $n$의 최솟값을 $b$, 최댓값을 $c$라 하자.」
- goal: 함수←stem:「두 정수 $a, n$에 대하여 직선 $y = n$이 두 함수 $f(x) = 2^{x - 1} + a$, $g(x) = -2^x - \dfrac{a}{2} + 6$의 그래프와 모두 만나도록 하는 정수 $n$의 개수가 $4$일 때, $n$의 최솟값을 $b$, 최댓값을 $c$라 하자.」
- method: 치역(NAMED)←solution:「두 함수의 치역은 각각 ${y \mid y > a}$, $\left{y \,\middle|\, y < -\dfrac{a}{2} + 6\right}$이다.」
- condition: (없음)

**how** Q24번 문항으로 H15-M1-01 단원의 기본 개념과 성질을 적용하여 $74$을(를) 바르게 구하였다. (문항 토큰 11)

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
