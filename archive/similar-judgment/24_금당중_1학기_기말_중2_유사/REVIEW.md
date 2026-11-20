# 검수 묶음 — 24_금당중_1학기_기말_중2_유사

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 25개 / 검사 PASS 25, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/25, HOLD 0, 풀이 답 비어 있음 25문항
- 그림 판단 분포: NONE 25
- 난이도 분포: 1단계 12, 2단계 13
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q3**: 풀이 과정에 정답 값이 등장하지 않음
- **Q6**: 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 풀이 과정에 정답 값이 등장하지 않음
- **Q22**: 풀이 과정에 정답 값이 등장하지 않음
- **Q23**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 4점


**발문**

$A = 3x - y$, $B = -x + 3y$일 때, $2(2A - 3B) - (3A - 2B)$를 계산하면?

**보기** ① $-7x - 13y$  ② $-7x + 13y$  ③ $7x - 13y$  ④ $7x + 13y$  ⑤ $13x - 7y$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $2(2A - 3B) - (3A - 2B) = 4A - 6B - 3A + 2B = A - 4B$
2. $= (3x - y) - 4(-x + 3y)$
3. $= 3x - y + 4x - 12y = 7x - 13y$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$A = 3x - y$, $B = -x + 3y$일 때, $2(2A - 3B) - (3A - 2B)$를 계산하면?」
**RPM** M2-RPM-012 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 동류항 정리] (원천과 같음)
- 이유: Q1번 문항은 M2-RPM-012에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 13)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS
- 이유: Q1번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 13)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 13)

**4칸**
- given: 정의←solution:「$2(2A - 3B) - (3A - 2B) = 4A - 6B - 3A + 2B = A - 4B$」
- goal: 정의←solution:「$2(2A - 3B) - (3A - 2B) = 4A - 6B - 3A + 2B = A - 4B$」
- method: 정의(NAMED)←solution:「$2(2A - 3B) - (3A - 2B) = 4A - 6B - 3A + 2B = A - 4B$」
- condition: (없음)

**how** Q1번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 13)

<details><summary>저장 해설 (판정 검토용)</summary>

$2(2A - 3B) - (3A - 2B) = 4A - 6B - 3A + 2B = A - 4B$
$= (3x - y) - 4(-x + 3y)$
$= 3x - y + 4x - 12y = 7x - 13y$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

어떤 식에서 $3x^{2} - x + 4$를 빼야 할 것을 잘못하여 더했더니 $5x^{2} + 3x - 2$가 되었다. 이때 바르게 계산한 식은?

**보기** ① $-x^{2} - 5x - 10$  ② $-x^{2} + 5x - 10$  ③ $-x^{2} + 5x + 10$  ④ $x^{2} + 5x - 10$  ⑤ $x^{2} + 5x + 10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 어떤 식을 $A$라 하면 (문항 토큰 10)
2. $A + (3x^{2} - x + 4) = 5x^{2} + 3x - 2$
3. $A = (5x^{2} + 3x - 2) - (3x^{2} - x + 4) = 2x^{2} + 4x - 6$
4. 따라서 바르게 계산한 식은
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「어떤 식에서 $3x^{2} - x + 4$를 빼야 할 것을 잘못하여 더했더니 $5x^{2} + 3x - 2$가 되었다.」
**RPM** M2-RPM-012 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 동류항 정리] (원천과 같음)
- 이유: Q2번 문항은 M2-RPM-012에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION / TPL=TPL_M2_RESTORE_CORRECT_POLYNOMIAL_CALCULATION (원천과 같음)
- 이유: Q2번 문항은 PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 어떤←stem:「어떤 식에서 $3x^{2} - x + 4$를 빼야 할 것을 잘못하여 더했더니 $5x^{2} + 3x - 2$가 되었다.」
- goal: 어떤←solution:「어떤 식을 $A$라 하면」
- method: 어떤(NAMED)←solution:「어떤 식을 $A$라 하면」
- condition: (없음)

**how** Q2번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

어떤 식을 $A$라 하면
$A + (3x^{2} - x + 4) = 5x^{2} + 3x - 2$
$A = (5x^{2} + 3x - 2) - (3x^{2} - x + 4) = 2x^{2} + 4x - 6$
따라서 바르게 계산한 식은
$A - (3x^{2} - x + 4) = (2x^{2} + 4x - 6) - (3x^{2} - x + 4) = -x^{2} + 5x - 10$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$4x - [x + 3y - {6x - 2y - (x - 4y)}] = ax + by$일 때, $a$와 $b$의 곱을 구하면? (단, $a, b$는 수이다.)

**보기** ① $-8$  ② $-4$  ③ $4$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $4x - [x + 3y - {6x - 2y - (x - 4y)}]$ (문항 토큰 ax)
2. $= 4x - [x + 3y - {6x - 2y - x + 4y}]$
3. $= 4x - [x + 3y - (5x + 2y)]$
4. $= 4x - [x + 3y - 5x - 2y]$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$4x - [x + 3y - {6x - 2y - (x - 4y)}] = ax + by$일 때, $a$와 $b$의 곱을 구하면?」
**RPM** M2-RPM-012 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 동류항 정리] **원천→판정: 식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 계산 → 식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 동류항 정리**
- 이유: Q3번 문항은 M2-RPM-012에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ax)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS
- 이유: Q3번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ax)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ax)

**4칸**
- given: 정의←solution:「$4x - [x + 3y - {6x - 2y - (x - 4y)}]$」
- goal: 정의←solution:「$4x - [x + 3y - {6x - 2y - (x - 4y)}]$」
- method: 정의(NAMED)←solution:「$4x - [x + 3y - {6x - 2y - (x - 4y)}]$」
- condition: (없음)

**how** Q3번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ax)

<details><summary>저장 해설 (판정 검토용)</summary>

$4x - [x + 3y - {6x - 2y - (x - 4y)}]$
$= 4x - [x + 3y - {6x - 2y - x + 4y}]$
$= 4x - [x + 3y - (5x + 2y)]$
$= 4x - [x + 3y - 5x - 2y]$
$= 4x - (-4x + y) = 8x - y$
따라서 $a = 8,\ b = -1$이므로 $ab = 8 \times (-1) = -8$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

$3x(x - 3) - (3x - 1)(-2x)$를 간단히 한 식에서 $x^{2}$의 계수를 $a$, $x$의 계수를 $b$라고 할 때, $a + b$의 값은?

**보기** ① $-3$  ② $-2$  ③ $-1$  ④ $1$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $3x(x - 3) - (3x - 1)(-2x)$
2. $= 3x^{2} - 9x - (-6x^{2} + 2x)$
3. $= 3x^{2} - 9x + 6x^{2} - 2x = 9x^{2} - 11x$
4. 따라서 $a = 9,\ b = -11$이므로 $a + b = 9 + (-11) = -2$
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$3x(x - 3) - (3x - 1)(-2x)$를 간단히 한 식에서 $x^{2}$의 계수를 $a$, $x$의 계수를 $b$라고 할 때, $a + b$의 값은?」
**RPM** M2-RPM-014 [식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 분배법칙] (원천과 같음)
- 이유: Q4번 문항은 M2-RPM-014에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 11)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS
- 이유: Q4번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 11)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 11)

**4칸**
- given: 계수←stem:「$3x(x - 3) - (3x - 1)(-2x)$를 간단히 한 식에서 $x^{2}$의 계수를 $a$, $x$의 계수를 $b$라고 할 때, $a + b$의 값은?」
- goal: 계수←stem:「$3x(x - 3) - (3x - 1)(-2x)$를 간단히 한 식에서 $x^{2}$의 계수를 $a$, $x$의 계수를 $b$라고 할 때, $a + b$의 값은?」
- method: 계수(NAMED)←stem:「$3x(x - 3) - (3x - 1)(-2x)$를 간단히 한 식에서 $x^{2}$의 계수를 $a$, $x$의 계수를 $b$라고 할 때, $a + b$의 값은?」
- condition: (없음)

**how** Q4번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 11)

<details><summary>저장 해설 (판정 검토용)</summary>

$3x(x - 3) - (3x - 1)(-2x)$
$= 3x^{2} - 9x - (-6x^{2} + 2x)$
$= 3x^{2} - 9x + 6x^{2} - 2x = 9x^{2} - 11x$
따라서 $a = 9,\ b = -11$이므로 $a + b = 9 + (-11) = -2$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$을 계산하면?

**보기** ① $-3x^{2} + 4x - 8$  ② $3x^{2} - 4x - 8$  ③ $3x^{2} + 4x + 8$  ④ $3x^{2} + 4x - 8$  ⑤ $3x^{2} + 4x + 2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$
2. $= (-3 + 4x) - (5 - 3x^{2})$
3. $= -3 + 4x - 5 + 3x^{2} = 3x^{2} + 4x - 8$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$을 계산하면?」
**RPM** M2-RPM-014 [식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 분배법칙] **원천→판정: 식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 다항식을 단항식으로 나누기 → 식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 분배법칙**
- 이유: Q5번 문항은 M2-RPM-014에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS
- 이유: Q5번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 3)

**4칸**
- given: 정의←solution:「$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$」
- goal: 정의←solution:「$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$」
- method: 정의(NAMED)←solution:「$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$」
- condition: (없음)

**how** Q5번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 3)

<details><summary>저장 해설 (판정 검토용)</summary>

$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$
$= (-3 + 4x) - (5 - 3x^{2})$
$= -3 + 4x - 5 + 3x^{2} = 3x^{2} + 4x - 8$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 부등식이 아닌 것을 모두 고르면? (정답 $2$개)

**보기** ① $2x + 5$  ② $x + 3 < 5x$  ③ $3 - 11 \le -6$  ④ $3x^{2} - 2x \ge 3x^{2} + x - 4$  ⑤ $4x - 1 = 3x - 5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 부등식은 부등호($<, >, \le, \ge$)를 사용하여 수 또는 식의 대소 관계를 나타낸 식이다. (문항 토큰 11)
2. ① 다항식이며 부등호가 없다.
3. ⑤ 등호를 사용한 등식이다.
4. 따라서 부등식이 아닌 것은 ①, ⑤이다.
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 부등식이 아닌 것을 모두 고르면?」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: Q6번 문항은 M2-RPM-018에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 11)
**유형** PT=PT_M2_LINEAR_INEQUALITY_IDENTIFICATION / TPL=TPL_M2_SELECT_VALID_LINEAR_INEQUALITIES (원천과 같음)
- 이유: Q6번 문항은 PT_M2_LINEAR_INEQUALITY_IDENTIFICATION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 11)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 11)

**4칸**
- given: 부등식←stem:「다음 중 부등식이 아닌 것을 모두 고르면?」
- goal: 등식←stem:「다음 중 부등식이 아닌 것을 모두 고르면?」
- method: 대소(NAMED)←solution:「부등식은 부등호($<, >, \le, \ge$)를 사용하여 수 또는 식의 대소 관계를 나타낸 식이다.」
- condition: (없음)

**how** Q6번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 ①, ⑤을(를) 바르게 구하였다. (문항 토큰 11)

<details><summary>저장 해설 (판정 검토용)</summary>

부등식은 부등호($<, >, \le, \ge$)를 사용하여 수 또는 식의 대소 관계를 나타낸 식이다.
① 다항식이며 부등호가 없다.
⑤ 등호를 사용한 등식이다.
따라서 부등식이 아닌 것은 ①, ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

$-3a - 2 \le -3b - 2$일 때, 다음 중 옳지 않은 것은?

**보기** ① $a + 2 \ge b + 2$  ② $4a - 1 \ge 4b - 1$  ③ $5 - a \le 5 - b$  ④ $a \ge b$  ⑤ $\frac{a}{3} \le \frac{b}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $-3a - 2 \le -3b - 2$의 양변에 $2$를 더하면 $-3a \le -3b$
2. 양변을 $-3$으로 나누면 부등호 방향이 바뀌어 $a \ge b$
3. ⑤ $a \ge b$의 양변을 양수 $3$으로 나누면 부등호 방향이 바뀌지 않아 $\frac{a}{3} \ge \frac{b}{3}$이어야 한다.
4. 따라서 옳지 않은 것은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-3a - 2 \le -3b - 2$일 때, 다음 중 옳지 않은 것은?」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: Q7번 문항은 M2-RPM-018에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3)
**유형** PT=PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE / TPL=TPL_M2_EVALUATE_INEQUALITY_TRANSFORMATION_PROPERTIES (원천과 같음)
- 이유: Q7번 문항은 PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 3)

**4칸**
- given: 부등호방향←solution:「양변을 $-3$으로 나누면 부등호 방향이 바뀌어 $a \ge b$」
- goal: 양수←solution:「⑤ $a \ge b$의 양변을 양수 $3$으로 나누면 부등호 방향이 바뀌지 않아 $\frac{a}{3} \ge \frac{b}{3}$이어야 한다.」
- method: 부등호방향(NAMED)←solution:「양변을 $-3$으로 나누면 부등호 방향이 바뀌어 $a \ge b$」
- condition: (없음)

**how** Q7번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 3)

<details><summary>저장 해설 (판정 검토용)</summary>

$-3a - 2 \le -3b - 2$의 양변에 $2$를 더하면 $-3a \le -3b$
양변을 $-3$으로 나누면 부등호 방향이 바뀌어 $a \ge b$
⑤ $a \ge b$의 양변을 양수 $3$으로 나누면 부등호 방향이 바뀌지 않아 $\frac{a}{3} \ge \frac{b}{3}$이어야 한다.
따라서 옳지 않은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 중 일차부등식 $12 + x \le 3(x - 2)$의 해가 아닌 것은?

**보기** ① $8$  ② $9$  ③ $10$  ④ $11$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $12 + x \le 3x - 6$
2. $x - 3x \le -6 - 12$
3. $-2x \le -18 \implies x \ge 9$
4. 따라서 해가 아닌 것은 ① $8$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 일차부등식 $12 + x \le 3(x - 2)$의 해가 아닌 것은?」
**RPM** M2-RPM-020 [일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 기본형] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 괄호·분수·소수가 있는 부등식 → 일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 기본형**
- 이유: Q8번 문항은 M2-RPM-020에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_M2_LINEAR_INEQUALITY_SOLVING / TPL=TPL_M2_SOLVE_FRACTIONAL_DECIMAL_INEQUALITY_CHECK (원천과 같음)
- 이유: Q8번 문항은 PT_M2_LINEAR_INEQUALITY_SOLVING 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 부등식←stem:「다음 중 일차부등식 $12 + x \le 3(x - 2)$의 해가 아닌 것은?」
- goal: 등식←stem:「다음 중 일차부등식 $12 + x \le 3(x - 2)$의 해가 아닌 것은?」
- method: 부등식(NAMED)←stem:「다음 중 일차부등식 $12 + x \le 3(x - 2)$의 해가 아닌 것은?」
- condition: (없음)

**how** Q8번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

$12 + x \le 3x - 6$
$x - 3x \le -6 - 12$
$-2x \le -18 \implies x \ge 9$
따라서 해가 아닌 것은 ① $8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

일차부등식 $\frac{1}{3}x - 2 \ge x - a$의 해 중에서 가장 큰 수가 $6$일 때, 수 $a$의 값을 구하면?

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\frac{1}{3}x - 2 \ge x - a$의 양변에 $3$을 곱하면 $x - 6 \ge 3x - 3a$
2. $-2x \ge 6 - 3a \implies x \le \frac{3a - 6}{2}$
3. 해 중에서 가장 큰 수가 $6$이므로 $\frac{3a - 6}{2} = 6$
4. $3a - 6 = 12 \implies 3a = 18 \implies a = 6$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차부등식 $\frac{1}{3}x - 2 \ge x - a$의 해 중에서 가장 큰 수가 $6$일 때, 수 $a$의 값을 구하면?」
**RPM** M2-RPM-022 [일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수해 개수] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건 → 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수해 개수**
- 이유: Q9번 문항은 M2-RPM-022에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY
- 이유: Q9번 문항은 PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 부등식←stem:「일차부등식 $\frac{1}{3}x - 2 \ge x - a$의 해 중에서 가장 큰 수가 $6$일 때, 수 $a$의 값을 구하면?」
- goal: 등식←stem:「일차부등식 $\frac{1}{3}x - 2 \ge x - a$의 해 중에서 가장 큰 수가 $6$일 때, 수 $a$의 값을 구하면?」
- method: 부등식(NAMED)←stem:「일차부등식 $\frac{1}{3}x - 2 \ge x - a$의 해 중에서 가장 큰 수가 $6$일 때, 수 $a$의 값을 구하면?」
- condition: (없음)

**how** Q9번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

$\frac{1}{3}x - 2 \ge x - a$의 양변에 $3$을 곱하면 $x - 6 \ge 3x - 3a$
$-2x \ge 6 - 3a \implies x \le \frac{3a - 6}{2}$
해 중에서 가장 큰 수가 $6$이므로 $\frac{3a - 6}{2} = 6$
$3a - 6 = 12 \implies 3a = 18 \implies a = 6$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 일차부등식 $\frac{1}{2}(x - 2) \le 0.3(x - 5) - 2.9$, $\frac{2 - x}{3} \ge \frac{a}{2} + \frac{1}{3}$의 해가 서로 같을 때, 수 $a$의 값은?

**보기** ① $10$  ② $11$  ③ $12$  ④ $13$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째 부등식의 양변에 $10$을 곱하면 $5(x - 2) \le 3(x - 5) - 29$
2. $5x - 10 \le 3x - 15 - 29 \implies 2x \le -34 \implies x \le -17$
3. 둘째 부등식의 양변에 $6$을 곱하면 $2(2 - x) \ge 3a + 2$
4. $4 - 2x \ge 3a + 2 \implies -2x \ge 3a - 2 \implies x \le \frac{2 - 3a}{2}$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 일차부등식 $\frac{1}{2}(x - 2) \le 0.3(x - 5) - 2.9$, $\frac{2 - x}{3} \ge \frac{a}{2} + \frac{1}{3}$의 해가 서로 같을 때, 수 $a$의 값은?」
**RPM** M2-RPM-022 [일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수해 개수] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건 → 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 정수해 개수**
- 이유: Q10번 문항은 M2-RPM-022에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 0.3)
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY
- 이유: Q10번 문항은 PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 0.3)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 0.3)

**4칸**
- given: 부등식←stem:「두 일차부등식 $\frac{1}{2}(x - 2) \le 0.3(x - 5) - 2.9$, $\frac{2 - x}{3} \ge \frac{a}{2} + \frac{1}{3}$의 해가 서로 같을 때, 수 $a$의 값은?」
- goal: 등식←stem:「두 일차부등식 $\frac{1}{2}(x - 2) \le 0.3(x - 5) - 2.9$, $\frac{2 - x}{3} \ge \frac{a}{2} + \frac{1}{3}$의 해가 서로 같을 때, 수 $a$의 값은?」
- method: 부등식(NAMED)←solution:「첫째 부등식의 양변에 $10$을 곱하면 $5(x - 2) \le 3(x - 5) - 29$」
- condition: (없음)

**how** Q10번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 0.3)

<details><summary>저장 해설 (판정 검토용)</summary>

첫째 부등식의 양변에 $10$을 곱하면 $5(x - 2) \le 3(x - 5) - 29$
$5x - 10 \le 3x - 15 - 29 \implies 2x \le -34 \implies x \le -17$
둘째 부등식의 양변에 $6$을 곱하면 $2(2 - x) \ge 3a + 2$
$4 - 2x \ge 3a + 2 \implies -2x \ge 3a - 2 \implies x \le \frac{2 - 3a}{2}$
두 부등식의 해가 같으므로 $\frac{2 - 3a}{2} = -17 \implies 2 - 3a = -34 \implies 3a = 36 \implies a = 12$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 하자. $\angle BAC = 38^{\circ}$, $\angle ACB = 47^{\circ}$일 때, $\angle ACD + \angle CAD$의 크기는?

**보기** ① $75^{\circ}$  ② $80^{\circ}$  ③ $85^{\circ}$  ④ $90^{\circ}$  ⑤ $95^{\circ}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각의 성질에 의해 $\angle ACD = \angle BAC = 38^{\circ}$
2. 또한 $\overline{AD} \parallel \overline{BC}$이므로 엇각의 성질에 의해 $\angle CAD = \angle ACB = 47^{\circ}$
3. $\therefore \angle ACD + \angle CAD = 38^{\circ} + 47^{\circ} = 85^{\circ}$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 하자.」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: Q11번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q11번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 하자.」
- goal: 평행←stem:「평행사변형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 하자.」
- method: 변형(NAMED)←solution:「평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각의 성질에 의해 $\angle ACD = \angle BAC = 38^{\circ}$」
- condition: (없음)

**how** Q11번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각의 성질에 의해 $\angle ACD = \angle BAC = 38^{\circ}$
또한 $\overline{AD} \parallel \overline{BC}$이므로 엇각의 성질에 의해 $\angle CAD = \angle ACB = 47^{\circ}$
$\therefore \angle ACD + \angle CAD = 38^{\circ} + 47^{\circ} = 85^{\circ}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3점


**발문**

평행사변형 $ABCD$의 둘레의 길이는 $30\text{ cm}$이고, $\overline{AB} : \overline{AD} = 2 : 3$일 때, $\overline{CD}$의 길이는?

**보기** ① $3\text{ cm}$  ② $4\text{ cm}$  ③ $5\text{ cm}$  ④ $6\text{ cm}$  ⑤ $9\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형에서 대변의 길이가 같으므로 $\overline{AB} + \overline{AD} = \frac{30}{2} = 15\text{ cm}$
2. $\overline{AB} : \overline{AD} = 2 : 3$이므로 $\overline{AB} = 15 \times \frac{2}{2 + 3} = 6\text{ cm}$
3. $\therefore \overline{CD} = \overline{AB} = 6\text{ cm}$
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$의 둘레의 길이는 $30\text{ cm}$이고, $\overline{AB} : \overline{AD} = 2 : 3$일 때, $\overline{CD}$의 길이는?」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: Q12번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q12번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$의 둘레의 길이는 $30\text{ cm}$이고, $\overline{AB} : \overline{AD} = 2 : 3$일 때, $\overline{CD}$의 길이는?」
- goal: 평행←stem:「평행사변형 $ABCD$의 둘레의 길이는 $30\text{ cm}$이고, $\overline{AB} : \overline{AD} = 2 : 3$일 때, $\overline{CD}$의 길이는?」
- method: 길이(NAMED)←solution:「평행사변형에서 대변의 길이가 같으므로 $\overline{AB} + \overline{AD} = \frac{30}{2} = 15\text{ cm}$」
- condition: (없음)

**how** Q12번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형에서 대변의 길이가 같으므로 $\overline{AB} + \overline{AD} = \frac{30}{2} = 15\text{ cm}$
$\overline{AB} : \overline{AD} = 2 : 3$이므로 $\overline{AB} = 15 \times \frac{2}{2 + 3} = 6\text{ cm}$
$\therefore \overline{CD} = \overline{AB} = 6\text{ cm}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 $\angle A$와 $\angle D$의 이등분선이 변 $BC$와 만나는 점을 각각 $E, F$라 하자. $\overline{AB} = x$이고 $\overline{AD} = y$ ($2x > y$)일 때, $\overline{EF}$의 길이는?

**보기** ① $\frac{1}{4}y$  ② $\frac{1}{3}x$  ③ $2y - 2x$  ④ $2y - x$  ⑤ $2x - y$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AD} \parallel \overline{BC}$이므로 $\angle AEB = \angle DAE = \angle BAE$ (엇각과 각의 이등분선)
2. 따라서 $\triangle ABE$는 이등변삼각형이므로 $\overline{BE} = \overline{AB} = x$
3. 마찬가지로 $\triangle DCF$도 이등변삼각형이므로 $\overline{CF} = \overline{CD} = x$
4. $\overline{BC} = \overline{AD} = y$이고 $2x > y$이므로
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 $\angle A$와 $\angle D$의 이등분선이 변 $BC$와 만나는 점을 각각 $E, F$라 하자.」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: Q13번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q13번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 $\angle A$와 $\angle D$의 이등분선이 변 $BC$와 만나는 점을 각각 $E, F$라 하자.」
- goal: 이등분선←stem:「평행사변형 $ABCD$에서 $\angle A$와 $\angle D$의 이등분선이 변 $BC$와 만나는 점을 각각 $E, F$라 하자.」
- method: 이등분(NAMED)←solution:「$\overline{AD} \parallel \overline{BC}$이므로 $\angle AEB = \angle DAE = \angle BAE$ (엇각과 각의 이등분선)」
- condition: (없음)

**how** Q13번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD} \parallel \overline{BC}$이므로 $\angle AEB = \angle DAE = \angle BAE$ (엇각과 각의 이등분선)
따라서 $\triangle ABE$는 이등변삼각형이므로 $\overline{BE} = \overline{AB} = x$
마찬가지로 $\triangle DCF$도 이등변삼각형이므로 $\overline{CF} = \overline{CD} = x$
$\overline{BC} = \overline{AD} = y$이고 $2x > y$이므로
$\overline{EF} = \overline{BE} + \overline{CF} - \overline{BC} = x + x - y = 2x - y$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

사각형 $ABCD$에서 $\angle A = 115^{\circ}$, $\angle B = 65^{\circ}$이고 $\overline{AD} = \overline{BC} = 8\text{ cm}$일 때, $\square ABCD$가 평행사변형이 되는 가장 알맞은 조건은?

**보기** ① 두 쌍의 대변이 각각 평행하다.  ② 두 쌍의 대변의 길이가 각각 같다.  ③ 두 쌍의 대각의 크기가 각각 같다.  ④ 한 쌍의 대변이 평행하고 그 길이가 같다.  ⑤ 두 대각선이 서로 다른 것을 이등분한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle A + \angle B = 115^{\circ} + 65^{\circ} = 180^{\circ}$이므로 동측내각의 합이 $180^{\circ}$가 되어 $\overline{AD} \parallel \overline{BC}$이다.
2. 여기에 $\overline{AD} = \overline{BC} = 8\text{ cm}$이므로 한 쌍의 대변이 평행하고 그 길이가 같아서 평행사변형이 된다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「사각형 $ABCD$에서 $\angle A = 115^{\circ}$, $\angle B = 65^{\circ}$이고 $\overline{AD} = \overline{BC} = 8\text{ cm}$일 때, $\square ABCD$가 평행사변형이 되는 가장 알맞은 조건은?」
**RPM** M2-RPM-074 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: Q14번 문항은 M2-RPM-074에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q14번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「사각형 $ABCD$에서 $\angle A = 115^{\circ}$, $\angle B = 65^{\circ}$이고 $\overline{AD} = \overline{BC} = 8\text{ cm}$일 때, $\square ABCD$가 평행사변형이 되는 가장 알맞은 조건은?」
- goal: 평행사변형←stem:「사각형 $ABCD$에서 $\angle A = 115^{\circ}$, $\angle B = 65^{\circ}$이고 $\overline{AD} = \overline{BC} = 8\text{ cm}$일 때, $\square ABCD$가 평행사변형이 되는 가장 알맞은 조건은?」
- method: 내각(NAMED)←solution:「$\angle A + \angle B = 115^{\circ} + 65^{\circ} = 180^{\circ}$이므로 동측내각의 합이 $180^{\circ}$가 되어 $\overline{AD} \parallel \overline{BC}$이다.」
- condition: (없음)

**how** Q14번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A + \angle B = 115^{\circ} + 65^{\circ} = 180^{\circ}$이므로 동측내각의 합이 $180^{\circ}$가 되어 $\overline{AD} \parallel \overline{BC}$이다.
여기에 $\overline{AD} = \overline{BC} = 8\text{ cm}$이므로 한 쌍의 대변이 평행하고 그 길이가 같아서 평행사변형이 된다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 할 때, 다음 중 평행사변형 $ABCD$가 정사각형이 되는 조건이 아닌 것은? (정답 $2$개)

**보기** ① $\overline{AB} = \overline{BC},\ \overline{AC} = \overline{BD}$  ② $\overline{AO} = \overline{BO},\ \overline{CO} = \overline{DO}$  ③ $\angle A = 90^{\circ},\ \overline{AB} \perp \overline{BC}$  ④ $\angle A = 90^{\circ},\ \overline{AB} = \overline{BC}$  ⑤ $\overline{AC} = \overline{BD},\ \overline{AC} \perp \overline{BD}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②, ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형이 정사각형이 되려면 직사각형 조건과 마름모 조건을 동시에 추가해야 한다.
2. ① 마름모 조건($\overline{AB} = \overline{BC}$) + 직사각형 조건($\overline{AC} = \overline{BD}$) $\implies$ 정사각형
3. ② $\overline{AC} = \overline{BD}$이므로 직사각형만 된다.
4. ③ $\angle A = 90^{\circ}$와 $\overline{AB} \perp \overline{BC}$는 모두 직사각형 조건이므로 직사각형만 된다.
- 작성자 답: ②, ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 할 때, 다음 중 평행사변형 $ABCD$가 정사각형이 되는 조건이 아닌 것은?」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] (원천과 같음)
- 이유: Q15번 문항은 M2-RPM-082에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q15번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 할 때, 다음 중 평행사변형 $ABCD$가 정사각형이 되는 조건이 아닌 것은?」
- goal: 평행사변형←stem:「평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 할 때, 다음 중 평행사변형 $ABCD$가 정사각형이 되는 조건이 아닌 것은?」
- method: 마름모(NAMED)←solution:「평행사변형이 정사각형이 되려면 직사각형 조건과 마름모 조건을 동시에 추가해야 한다.」
- condition: (없음)

**how** Q15번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②, ③을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형이 정사각형이 되려면 직사각형 조건과 마름모 조건을 동시에 추가해야 한다.
① 마름모 조건($\overline{AB} = \overline{BC}$) + 직사각형 조건($\overline{AC} = \overline{BD}$) $\implies$ 정사각형
② $\overline{AC} = \overline{BD}$이므로 직사각형만 된다.
③ $\angle A = 90^{\circ}$와 $\overline{AB} \perp \overline{BC}$는 모두 직사각형 조건이므로 직사각형만 된다.
④ 직사각형 조건($\angle A = 90^{\circ}$) + 마름모 조건($\overline{AB} = \overline{BC}$) $\implies$ 정사각형
⑤ 직사각형 조건($\overline{AC} = \overline{BD}$) + 마름모 조건($\overline{AC} \perp \overline{BD}$) $\implies$ 정사각형
따라서 정사각형이 되는 조건이 아닌 것은 ②, ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

직사각형 모양의 종이를 가로로 한 번, 세로로 한 번 반씩 접어 네 겹이 된 상태에서, 두 접힌 선이 만나는 꼭짓점을 포함한 두 접힌 변 위에 길이가 각각 다른 두 점을 잡아 잇는 길이 $8\text{ cm}$인 선분을 따라 직각삼각형 모양으로 잘라낸 후 폈다. 다음 중 만들어지는 사각형에 대한 설명으로 옳지 않은 것을 모두 고르면? (정답 $2$개)

**보기** ① 대각선이 서로 수직인 직사각형이다.  ② 대각선이 서로 수직인 평행사변형이다.  ③ 이웃하는 두 변의 길이가 같은 평행사변형이다.  ④ 두 쌍의 대각의 크기가 각각 같은 사각형이다.  ⑤ 한 내각이 직각인 마름모이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 종이를 가로·세로로 두 번 접어 직각삼각형 모양으로 자른 뒤 펴면, 자른 선분 $4$개가 네 변이 되고 접힌 선이 서로 수직인 두 대각선이 되며 자른 두 변의 길이가 다르므로 직각이 아닌 마름모가 된다. (문항 토큰 cm)
2. ① 직사각형이 아니다.
3. (거짓)
4. ⑤ 한 내각이 직각인 마름모(정사각형)가 아니다.
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직사각형 모양의 종이를 가로로 한 번, 세로로 한 번 반씩 접어 네 겹이 된 상태에서, 두 접힌 선이 만나는 꼭짓점을 포함한 두 접힌 변 위에 길이가 각각 다른 두 점을 잡아 잇는 길이 $8\text{ cm}$인 선분을 따라 직각삼각형 모양으로 잘라낸 후 폈다.」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: Q16번 문항은 M2-RPM-078에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q16번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 선분←stem:「직사각형 모양의 종이를 가로로 한 번, 세로로 한 번 반씩 접어 네 겹이 된 상태에서, 두 접힌 선이 만나는 꼭짓점을 포함한 두 접힌 변 위에 길이가 각각 다른 두 점을 잡아 잇는 길이 $8\text{ cm}$인 선분을 따라 직각삼각형 모양으로 잘라낸 후 폈다.」
- goal: 삼각형←stem:「직사각형 모양의 종이를 가로로 한 번, 세로로 한 번 반씩 접어 네 겹이 된 상태에서, 두 접힌 선이 만나는 꼭짓점을 포함한 두 접힌 변 위에 길이가 각각 다른 두 점을 잡아 잇는 길이 $8\text{ cm}$인 선분을 따라 직각삼각형 모양으로 잘라낸 후 폈다.」
- method: 직각삼각형(NAMED)←solution:「종이를 가로·세로로 두 번 접어 직각삼각형 모양으로 자른 뒤 펴면, 자른 선분 $4$개가 네 변이 되고 접힌 선이 서로 수직인 두 대각선이 되며 자른 두 변의 길이가 다르므로 직각이 아닌 마름모가 된다.」
- condition: (없음)

**how** Q16번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①, ⑤을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

종이를 가로·세로로 두 번 접어 직각삼각형 모양으로 자른 뒤 펴면, 자른 선분 $4$개가 네 변이 되고 접힌 선이 서로 수직인 두 대각선이 되며 자른 두 변의 길이가 다르므로 직각이 아닌 마름모가 된다.
① 직사각형이 아니다. (거짓)
⑤ 한 내각이 직각인 마름모(정사각형)가 아니다. (거짓)
따라서 옳지 않은 것은 ①, ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

사각형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 할 때, 다음 중 $\square ABCD$가 마름모가 되는 조건은?

**보기** ① $\overline{AC} = \overline{BD},\ \overline{AC} \perp \overline{BD}$  ② $\overline{AB} \parallel \overline{DC},\ \angle AOB = 90^{\circ}$  ③ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \overline{AC} = \overline{BD}$  ④ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \angle A = 90^{\circ}$  ⑤ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \angle AOB = 90^{\circ}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 ABCD)
2. 주어진 조건을 계산하여 정답 ⑤을(를) 도출한다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「사각형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 할 때, 다음 중 $\square ABCD$가 마름모가 되는 조건은?」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] (원천과 같음)
- 이유: Q17번 문항은 M2-RPM-082에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q17번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「사각형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 할 때, 다음 중 $\square ABCD$가 마름모가 되는 조건은?」
- goal: 마름모←stem:「사각형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 할 때, 다음 중 $\square ABCD$가 마름모가 되는 조건은?」
- method: 평행사변형(NAMED)←solution:「⑤ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC}$이므로 평행사변형이고, 여기에 $\angle AOB = 90^{\circ}$(두 대각선이 직교)가 추가되므로 마름모가 된다.」
- condition: (없음)

**how** Q17번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

⑤ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC}$이므로 평행사변형이고, 여기에 $\angle AOB = 90^{\circ}$(두 대각선이 직교)가 추가되므로 마름모가 된다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점


**발문**

$\overline{AB} \ne \overline{BC}$인 평행사변형 $ABCD$에서 네 내각의 이등분선의 교점으로 이루어진 사각형 $PQRS$에 대한 설명으로 다음 중 옳지 않은 것은?

**보기** ① $\overline{PS} = \overline{QR}$  ② $\overline{PR} \perp \overline{QS}$  ③ $\angle P = \angle R = 90^{\circ}$  ④ $\overline{PR} = \overline{QS}$  ⑤ $\overline{PQ} = \overline{SR}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 $ABCD$의 네 내각의 이등분선의 교점으로 이루어진 $\square PQRS$는 직사각형이다($\overline{AB} \ne \overline{BC}$이므로 정사각형은 아니다).
2. 직사각형은 두 쌍의 대변의 길이가 같고($\overline{PS} = \overline{QR},\ \overline{PQ} = \overline{SR}$), 네 내각이 모두 $90^{\circ}$이며, 두 대각선의 길이가 같다($\overline{PR} = \overline{QS}$).
3. 그러나 두 대각선은 서로 수직이 아니므로 ② $\overline{PR} \perp \overline{QS}$는 옳지 않다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} \ne \overline{BC}$인 평행사변형 $ABCD$에서 네 내각의 이등분선의 교점으로 이루어진 사각형 $PQRS$에 대한 설명으로 다음 중 옳지 않은 것은?」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: Q18번 문항은 M2-RPM-078에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q18번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 사각형←stem:「$\overline{AB} \ne \overline{BC}$인 평행사변형 $ABCD$에서 네 내각의 이등분선의 교점으로 이루어진 사각형 $PQRS$에 대한 설명으로 다음 중 옳지 않은 것은?」
- goal: 평행사변형←stem:「$\overline{AB} \ne \overline{BC}$인 평행사변형 $ABCD$에서 네 내각의 이등분선의 교점으로 이루어진 사각형 $PQRS$에 대한 설명으로 다음 중 옳지 않은 것은?」
- method: 직사각형(NAMED)←solution:「평행사변형 $ABCD$의 네 내각의 이등분선의 교점으로 이루어진 $\square PQRS$는 직사각형이다($\overline{AB} \ne \overline{BC}$이므로 정사각형은 아니다).」
- condition: (없음)

**how** Q18번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$의 네 내각의 이등분선의 교점으로 이루어진 $\square PQRS$는 직사각형이다($\overline{AB} \ne \overline{BC}$이므로 정사각형은 아니다).
직사각형은 두 쌍의 대변의 길이가 같고($\overline{PS} = \overline{QR},\ \overline{PQ} = \overline{SR}$), 네 내각이 모두 $90^{\circ}$이며, 두 대각선의 길이가 같다($\overline{PR} = \overline{QS}$).
그러나 두 대각선은 서로 수직이 아니므로 ② $\overline{PR} \perp \overline{QS}$는 옳지 않다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 보기 중 두 대각선이 서로 다른 것을 이등분하는 사각형은 몇 개인가?


ㄱ. 평행사변형    ㄴ. 사다리꼴
ㄷ. 등변사다리꼴  ㄹ. 정사각형
ㅁ. 직사각형      ㅂ. 마름모

**보기** ① $2$개  ② $3$개  ③ $4$개  ④ $5$개  ⑤ $6$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 대각선이 서로 다른 것을 이등분하는 사각형은 평행사변형과 평행사변형에 포함되는 사각형이다. (문항 토큰 2)
2. 따라서 ㄱ.
3. 평행사변형, ㄹ.
4. 정사각형, ㅁ.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 보기 중 두 대각선이 서로 다른 것을 이등분하는 사각형은 몇 개인가?」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 성질 비교 → 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정**
- 이유: Q19번 문항은 M2-RPM-082에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 2)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA (원천과 같음)
- 이유: Q19번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 2)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 2)

**4칸**
- given: 사각형←stem:「다음 보기 중 두 대각선이 서로 다른 것을 이등분하는 사각형은 몇 개인가?」
- goal: 이등분하는←stem:「다음 보기 중 두 대각선이 서로 다른 것을 이등분하는 사각형은 몇 개인가?」
- method: 평행사변형(NAMED)←solution:「두 대각선이 서로 다른 것을 이등분하는 사각형은 평행사변형과 평행사변형에 포함되는 사각형이다.」
- condition: (없음)

**how** Q19번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 2)

<details><summary>저장 해설 (판정 검토용)</summary>

두 대각선이 서로 다른 것을 이등분하는 사각형은 평행사변형과 평행사변형에 포함되는 사각형이다.
따라서 ㄱ. 평행사변형, ㄹ. 정사각형, ㅁ. 직사각형, ㅂ. 마름모의 $4$개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 사각형과 그 사각형의 각 변의 중점을 연결하여 만든 사각형을 짝지은 것으로 옳지 않은 것은?

**보기** ① 평행사변형 - 직사각형  ② 직사각형 - 마름모  ③ 마름모 - 직사각형  ④ 정사각형 - 정사각형  ⑤ 등변사다리꼴 - 마름모

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 평행사변형의 각 변의 중점을 연결하여 만든 사각형은 평행사변형이다. (문항 토큰 20)
2. (직사각형이 아니다.)
3. ②, ③, ④, ⑤는 모두 옳다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 사각형과 그 사각형의 각 변의 중점을 연결하여 만든 사각형을 짝지은 것으로 옳지 않은 것은?」
**RPM** M2-RPM-080 [사각형의 성질 > 여러 가지 사각형 > 사다리꼴 > 등변사다리꼴] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 사다리꼴 > 중점 연결 → 사각형의 성질 > 여러 가지 사각형 > 사다리꼴 > 등변사다리꼴**
- 이유: Q20번 문항은 M2-RPM-080에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 20)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA (원천과 같음)
- 이유: Q20번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 20)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 20)

**4칸**
- given: 사각형←stem:「다음 중 사각형과 그 사각형의 각 변의 중점을 연결하여 만든 사각형을 짝지은 것으로 옳지 않은 것은?」
- goal: 중점←stem:「다음 중 사각형과 그 사각형의 각 변의 중점을 연결하여 만든 사각형을 짝지은 것으로 옳지 않은 것은?」
- method: 평행사변형(NAMED)←solution:「① 평행사변형의 각 변의 중점을 연결하여 만든 사각형은 평행사변형이다.」
- condition: (없음)

**how** Q20번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 20)

<details><summary>저장 해설 (판정 검토용)</summary>

① 평행사변형의 각 변의 중점을 연결하여 만든 사각형은 평행사변형이다. (직사각형이 아니다.)
②, ③, ④, ⑤는 모두 옳다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\overline{AD} \parallel \overline{BC}$인 등변사다리꼴 $ABCD$에서 $\overline{AB} = \overline{AD}$이고 $\angle DBC = 28^{\circ}$일 때, $\angle BDC$의 크기를 구하면?

**보기** ① $92^{\circ}$  ② $96^{\circ}$  ③ $100^{\circ}$  ④ $104^{\circ}$  ⑤ $108^{\circ}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AD} \parallel \overline{BC}$이므로 $\angle ADB = \angle DBC = 28^{\circ}$ (엇각)
2. $\overline{AB} = \overline{AD}$이므로 $\triangle ABD$는 이등변삼각형이고 $\angle ABD = \angle ADB = 28^{\circ}$
3. 따라서 $\angle ABC = 28^{\circ} + 28^{\circ} = 56^{\circ}$
4. 등변사다리꼴에서 밑각의 크기가 같으므로 $\angle C = \angle ABC = 56^{\circ}$
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AD} \parallel \overline{BC}$인 등변사다리꼴 $ABCD$에서 $\overline{AB} = \overline{AD}$이고 $\angle DBC = 28^{\circ}$일 때, $\angle BDC$의 크기를 구하면?」
**RPM** M2-RPM-080 [사각형의 성질 > 여러 가지 사각형 > 사다리꼴 > 등변사다리꼴] (원천과 같음)
- 이유: Q21번 문항은 M2-RPM-080에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q21번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AD)

**4칸**
- given: 사다리꼴←stem:「$\overline{AD} \parallel \overline{BC}$인 등변사다리꼴 $ABCD$에서 $\overline{AB} = \overline{AD}$이고 $\angle DBC = 28^{\circ}$일 때, $\angle BDC$의 크기를 구하면?」
- goal: 등변사다리꼴←stem:「$\overline{AD} \parallel \overline{BC}$인 등변사다리꼴 $ABCD$에서 $\overline{AB} = \overline{AD}$이고 $\angle DBC = 28^{\circ}$일 때, $\angle BDC$의 크기를 구하면?」
- method: 엇각(NAMED)←solution:「$\overline{AD} \parallel \overline{BC}$이므로 $\angle ADB = \angle DBC = 28^{\circ}$ (엇각)」
- condition: (없음)

**how** Q21번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 AD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD} \parallel \overline{BC}$이므로 $\angle ADB = \angle DBC = 28^{\circ}$ (엇각)
$\overline{AB} = \overline{AD}$이므로 $\triangle ABD$는 이등변삼각형이고 $\angle ABD = \angle ADB = 28^{\circ}$
따라서 $\angle ABC = 28^{\circ} + 28^{\circ} = 56^{\circ}$
등변사다리꼴에서 밑각의 크기가 같으므로 $\angle C = \angle ABC = 56^{\circ}$
$\triangle BCD$에서 $\angle BDC = 180^{\circ} - (28^{\circ} + 56^{\circ}) = 96^{\circ}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 1] $x = \frac{3}{5}$, $y = 3$일 때, 식 $y - [2x - {3y + (12y^{2} - 9xy) \div 3y}]$의 값을 구하려고 한다. 다음 물음에 답하시오.
(1) $y - [2x - {3y + (12y^{2} - 9xy) \div 3y}]$를 계산하시오. [3점]
(2) (1)의 결과에 $x = \frac{3}{5}$와 $y = 3$을 대입하여 주어진 식의 값을 구하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $-5x + 8y$, (2) $21$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $y - [2x - {3y + (12y^{2} - 9xy) \div 3y}]$
2. $= y - [2x - {3y + (4y - 3x)}]$
3. $= y - [2x - (7y - 3x)]$
4. $= y - (5x - 7y) = -5x + 8y$
- 작성자 답: (1) $-5x + 8y$, (2) $21$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] $x = \frac{3}{5}$, $y = 3$일 때, 식 $y - [2x - {3y + (12y^{2} - 9xy) \div 3y}]$의 값을 구하려고 한다.」
**RPM** M2-RPM-016 [식의 계산 > 다항식의 계산 > 식의 값과 활용 > 식의 값] (원천과 같음)
- 이유: Q22번 문항은 M2-RPM-016에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_M2_MONOMIAL_MULTIPLICATION_DIVISION / TPL=TPL_M2_EVALUATE_EXPONENT_LAWS_MONOMIAL_OPERATIONS
- 이유: Q22번 문항은 PT_M2_MONOMIAL_MULTIPLICATION_DIVISION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 대입←stem:「(2) (1)의 결과에 $x = \frac{3}{5}$와 $y = 3$을 대입하여 주어진 식의 값을 구하시오.」
- goal: 식의값←stem:「(2) (1)의 결과에 $x = \frac{3}{5}$와 $y = 3$을 대입하여 주어진 식의 값을 구하시오.」
- method: 대입(NAMED)←solution:「(2) $x = \frac{3}{5},\ y = 3$을 대입하면 $-5 \times \frac{3}{5} + 8 \times 3 = -3 + 24 = 21$」
- condition: (없음)

**how** Q22번 문항으로 M2-01 단원의 기본 개념과 성질을 적용하여 (1) $-5x + 8y$, (2) $21$을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $y - [2x - {3y + (12y^{2} - 9xy) \div 3y}]$
$= y - [2x - {3y + (4y - 3x)}]$
$= y - [2x - (7y - 3x)]$
$= y - (5x - 7y) = -5x + 8y$
(2) $x = \frac{3}{5},\ y = 3$을 대입하면 $-5 \times \frac{3}{5} + 8 \times 3 = -3 + 24 = 21$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 2] 준호는 집에서 $8\text{ km}$ 떨어진 도서관까지 가는데, 처음에는 자전거를 타고 시속 $10\text{ km}$로 가다가 도중에 자전거가 고장이 나서 멈추고 $15$분 동안 살펴본 후, 다시 자전거를 끌고 시속 $5\text{ km}$로 걸어갔다. 도서관까지 가는 데 걸린 시간이 $1$시간 $30$분을 넘지 않았을 때, 자전거가 고장 난 지점은 집에서 몇 $\text{km}$ 이상 떨어진 곳인지 구하려고 한다. 다음 물음에 답하시오.
(1) 전체 걸리는 시간이 $1$시간 $30$분을 넘지 않음을 이용하여 부등식을 세우시오. [3점]
(2) 자전거가 고장 난 지점은 집에서 몇 $\text{km}$ 이상 떨어진 곳인지 구하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$, (2) $\frac{7}{2}\text{ km}$ 이상   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 집에서 고장 난 지점까지의 거리를 $x\text{ km}$라 하면 걸어간 거리는 $(8 - x)\text{ km}$이다.
2. $15$분 $= \frac{15}{60}$시간, $1$시간 $30$분 $= \frac{3}{2}$시간이므로
3. $\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$
4. (2) 양변에 $20$을 곱하면 $2x + 5 + 4(8 - x) \le 30$
- 작성자 답: (1) $\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$, (2) $\frac{7}{2}\text{ km}$ 이상 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY_WORD(일차부등식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] 준호는 집에서 $8\text{ km}$ 떨어진 도서관까지 가는데, 처음에는 자전거를 타고 시속 $10\text{ km}$로 가다가 도중에 자전거가 고장이 나서 멈추고 $15$분 동안 살펴본 후, 다시 자전거를 끌고 시속 $5\text{ km}$로 걸어갔다.」
**RPM** M2-RPM-026 [일차부등식과 연립일차방정식 > 일차부등식의 활용 > 거리·속력·시간 > 시간 제한] (원천과 같음)
- 이유: Q23번 문항은 M2-RPM-026에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 km)
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY (원천과 같음)
- 이유: Q23번 문항은 PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 km)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 km)

**4칸**
- given: 부등식←stem:「(1) 전체 걸리는 시간이 $1$시간 $30$분을 넘지 않음을 이용하여 부등식을 세우시오.」
- goal: 등식←stem:「(1) 전체 걸리는 시간이 $1$시간 $30$분을 넘지 않음을 이용하여 부등식을 세우시오.」
- method: 거리(NAMED)←solution:「(1) 집에서 고장 난 지점까지의 거리를 $x\text{ km}$라 하면 걸어간 거리는 $(8 - x)\text{ km}$이다.」
- condition: (없음)

**how** Q23번 문항으로 M2-02 단원의 기본 개념과 성질을 적용하여 (1) $\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$, (2) $\frac{7}{2}\text{ km}$ 이상을(를) 바르게 구하였다. (문항 토큰 km)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 집에서 고장 난 지점까지의 거리를 $x\text{ km}$라 하면 걸어간 거리는 $(8 - x)\text{ km}$이다.
$15$분 $= \frac{15}{60}$시간, $1$시간 $30$분 $= \frac{3}{2}$시간이므로
$\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$
(2) 양변에 $20$을 곱하면 $2x + 5 + 4(8 - x) \le 30$
$-2x + 37 \le 30 \implies -2x \le -7 \implies x \ge \frac{7}{2}$
따라서 집에서 $\frac{7}{2}\text{ km}$($3.5\text{ km}$) 이상 떨어진 곳이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 6점


**발문**

[서술형 3] $\overline{AD} \parallel \overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라고 할 때, $\overline{AO} : \overline{OC} = 2 : 5$이다. $\triangle ODC$의 넓이가 $14\text{ cm}^{2}$일 때, 다음 물음에 답하시오.
(1) $\triangle OAB$와 $\triangle ODC$의 넓이가 같은 이유를 설명하시오. [3점]
(2) $\triangle OBC$의 넓이를 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\triangle ABC = \triangle DBC$에서 공통 부분 $\triangle OBC$를 빼면 $\triangle OAB = \triangle ODC$, (2) $35\text{ cm}^{2}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $\overline{AD} \parallel \overline{BC}$이므로 밑변 $\overline{BC}$가 같고 높이가 같은 두 삼각형 $\triangle ABC$와 $\triangle DBC$의 넓이는 같다.
2. 양쪽 넓이에서 공통 부분인 $\triangle OBC$의 넓이를 빼면 $\triangle OAB = \triangle ODC$이다.
3. (2) $\triangle OAB = \triangle ODC = 14\text{ cm}^{2}$이고, $\triangle OAB$와 $\triangle OBC$는 높이가 같으므로 넓이의 비는 밑변의 길이의 비 $\overline{AO} : \overline{OC} = 2 : 5$와 같다.
4. $14 : \triangle OBC = 2 : 5 \implies \triangle OBC = 35\text{ cm}^{2}$
- 작성자 답: (1) $\triangle ABC = \triangle DBC$에서 공통 부분 $\triangle OBC$를 빼면 $\triangle OAB = \triangle ODC$, (2) $35\text{ cm}^{2}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] $\overline{AD} \parallel \overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라고 할 때, $\overline{AO} : \overline{OC} = 2 : 5$이다.」
**RPM** M2-RPM-076 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 평행선과 넓이] (원천과 같음)
- 이유: Q24번 문항은 M2-RPM-076에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q24번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q24번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AD)

**4칸**
- given: 사다리꼴←stem:「[서술형 3] $\overline{AD} \parallel \overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라고 할 때, $\overline{AO} : \overline{OC} = 2 : 5$이다.」
- goal: 교점←stem:「[서술형 3] $\overline{AD} \parallel \overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라고 할 때, $\overline{AO} : \overline{OC} = 2 : 5$이다.」
- method: 삼각형(NAMED)←solution:「(1) $\overline{AD} \parallel \overline{BC}$이므로 밑변 $\overline{BC}$가 같고 높이가 같은 두 삼각형 $\triangle ABC$와 $\triangle DBC$의 넓이는 같다.」
- condition: (없음)

**how** Q24번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 (1) $\triangle ABC = \triangle DBC$에서 공통 부분 $\triangle OBC$를 빼면 $\triangle OAB = \triangle ODC$, (2) $35\text{ cm}^{2}$을(를) 바르게 구하였다. (문항 토큰 AD)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\overline{AD} \parallel \overline{BC}$이므로 밑변 $\overline{BC}$가 같고 높이가 같은 두 삼각형 $\triangle ABC$와 $\triangle DBC$의 넓이는 같다.
양쪽 넓이에서 공통 부분인 $\triangle OBC$의 넓이를 빼면 $\triangle OAB = \triangle ODC$이다.
(2) $\triangle OAB = \triangle ODC = 14\text{ cm}^{2}$이고, $\triangle OAB$와 $\triangle OBC$는 높이가 같으므로 넓이의 비는 밑변의 길이의 비 $\overline{AO} : \overline{OC} = 2 : 5$와 같다.
$14 : \triangle OBC = 2 : 5 \implies \triangle OBC = 35\text{ cm}^{2}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q25 — 서술형 4점


**발문**

[서술형 4] 평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 하고, $\angle CAB = a$, $\angle ODC = b$일 때 다음 물음에 답하시오.
(1) $a = b$이면 직사각형임을 설명하시오. [2점]
(2) $a + b = 90^{\circ}$이면 마름모임을 설명하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\overline{OC} = \overline{OD}$이므로 $\overline{AC} = \overline{BD}$가 되어 직사각형이다, (2) $\angle COD = 90^{\circ}$이므로 두 대각선이 직교하여 마름모이다   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각에 의해 $\angle ACD = \angle CAB = a$이다.
2. (1) $a = b$이면 $\triangle ODC$에서 $\angle OCD = \angle ODC$이므로 $\overline{OC} = \overline{OD}$이다.
3. 평행사변형의 두 대각선은 서로 다른 것을 이등분하므로 $\overline{AC} = 2\overline{OC} = 2\overline{OD} = \overline{BD}$가 되어 두 대각선의 길이가 같으므로 직사각형이다.
4. (2) $a + b = 90^{\circ}$이면 $\triangle ODC$에서 $\angle COD = 180^{\circ} - (a + b) = 90^{\circ}$이다.
- 작성자 답: (1) $\overline{OC} = \overline{OD}$이므로 $\overline{AC} = \overline{BD}$가 되어 직사각형이다, (2) $\angle COD = 90^{\circ}$이므로 두 대각선이 직교하여 마름모이다 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 4] 평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 하고, $\angle CAB = a$, $\angle ODC = b$일 때 다음 물음에 답하시오.」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: Q25번 문항은 M2-RPM-078에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q25번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q25번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「[서술형 4] 평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 하고, $\angle CAB = a$, $\angle ODC = b$일 때 다음 물음에 답하시오.」
- goal: 평행←stem:「[서술형 4] 평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 하고, $\angle CAB = a$, $\angle ODC = b$일 때 다음 물음에 답하시오.」
- method: 변형(NAMED)←solution:「평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각에 의해 $\angle ACD = \angle CAB = a$이다.」
- condition: (없음)

**how** Q25번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 (1) $\overline{OC} = \overline{OD}$이므로 $\overline{AC} = \overline{BD}$가 되어 직사각형이다, (2) $\angle COD = 90^{\circ}$이므로 두 대각선이 직교하여 마름모이다을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각에 의해 $\angle ACD = \angle CAB = a$이다.
(1) $a = b$이면 $\triangle ODC$에서 $\angle OCD = \angle ODC$이므로 $\overline{OC} = \overline{OD}$이다. 평행사변형의 두 대각선은 서로 다른 것을 이등분하므로 $\overline{AC} = 2\overline{OC} = 2\overline{OD} = \overline{BD}$가 되어 두 대각선의 길이가 같으므로 직사각형이다.
(2) $a + b = 90^{\circ}$이면 $\triangle ODC$에서 $\angle COD = 180^{\circ} - (a + b) = 90^{\circ}$이다. 두 대각선이 서로 수직으로 만나므로 마름모이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
