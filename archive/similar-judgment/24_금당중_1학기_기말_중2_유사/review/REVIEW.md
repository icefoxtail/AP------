# 검수 묶음 — 24_금당중_1학기_기말_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: REASON_NO_ITEM_TOKEN 5)**
- 문항 25개 / 검사 PASS 24, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/25, HOLD 0, 풀이 답 비어 있음 25문항
- 그림 판단 분포: NONE 25
- 난이도 분포: 1단계 4, 2단계 19, 3단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q8**: 원천 값과 다른 칸 2개 (RPM, PT)
- **Q16**: 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 원천 값과 다른 칸 2개 (PT, 난이도)
- **Q20**: 검사 코드: REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN

---
## Q1 — 객관식 4점


**발문**

$A = 3x - y$, $B = -x + 3y$일 때, $2(2A - 3B) - (3A - 2B)$를 계산하면?

**보기** ① $-7x - 13y$  ② $-7x + 13y$  ③ $7x - 13y$  ④ $7x + 13y$  ⑤ $13x - 7y$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $2(2A - 3B) - (3A - 2B) = 4A - 6B - 3A + 2B = A - 4B$이다. 13
2. $A = 3x - y, B = -x + 3y$를 대입하면 $(3x - y) - 4(-x + 3y)$이다. 13
3. $= 3x - y + 4x - 12y = 7x - 13y$이다. 13
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「계산하면?」
**RPM** M2-RPM-013 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 계산] **원천→판정: 식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 동류항 정리 → 식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 계산**
- 이유: 괄호가 있는 다항식의 덧셈과 뺄셈을 다루는 RPM 문항입니다. 13
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE
- 이유: 문자에 다항식을 대입하여 동류항을 정리하는 다항식 계산 유형입니다. 13
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: A와 B에 대한 기본 일차 결합을 전개하고 동류항을 정리하는 난이도 1 문항입니다. 13

**4칸**
- given: (없음)
- goal: 다항식←stem:「계산하면?」
- method: 동류항(NAMED)←solution:「13y$」
- condition: (없음)

**how** 주어진 식을 A, B에 대해 먼저 정리한 후 다항식을 대입하여 7x - 13y를 구했습니다.

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
1. 어떤 식을 $A$라 하면 $A + (3x^2 - x + 4) = 5x^2 + 3x - 2$이다. 10
2. $A = (5x^2 + 3x - 2) - (3x^2 - x + 4) = 2x^2 + 4x - 6$이다. 10
3. 바르게 계산한 식은 $A - (3x^2 - x + 4) = -x^2 + 5x - 10$이다. 10
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「어떤 식에서 $3x^{2} 」
**RPM** M2-RPM-012 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 동류항 정리] (원천과 같음)
- 이유: 다항식의 덧셈과 뺄셈 오연산 복원을 다루는 RPM 문항입니다. 10
**유형** PT=PT_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION / TPL=TPL_M2_POLYNOMIAL_ADDITION_SUBTRACTION_CORRECTION_REVERSE (원천과 같음)
- 이유: 잘못 더한 다항식의 바른 계산을 복원하는 유형입니다. 10
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 잘못 계산된 다항식에서 원래 식을 역연산하고 바른 계산을 수행하는 10 관련 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 다항식←stem:「어떤 식에서 $3x^{2} - x +」
- method: 다항식(NAMED)←solution:「바르게 계산한 식은
$A - (3x^」
- condition: (없음)

**how** 잘못 더한 식을 역연산하여 원래 식을 구한 뒤 바르게 계산하여 -x^2 + 5x - 10을 얻었습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

어떤 식을 $A$라 하면
$A + (3x^{2} - x + 4) = 5x^{2} + 3x - 2$
$A = (5x^{2} + 3x - 2) - (3x^{2} - x + 4) = 2x^{2} + 4x - 6$
따라서 바르게 계산한 식은
$A - (3x^{2} - x + 4) = (2x^{2} + 4x - 6) - (3x^{2} - x + 4) = -x^{2} + 5x - 10$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

$4x - [x + 3y - {6x - 2y - (x - 4y)}] = ax + by$일 때, $a$와 $b$의 곱을 구하면? (단, $a, b$는 수이다.)

**보기** ① $-8$  ② $-4$  ③ $4$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 소괄호부터 정리: $6x - 2y - (x - 4y) = 5x + 2y$이다. ax
2. 중괄호 정리: $x + 3y - (5x + 2y) = -4x + y$이다. ax
3. $4x - (-4x + y) = 8x - y = ax + by$이므로 $a = 8, b = -1$이다. ax
4. 따라서 $a \times b = -8$이다. ax
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「ax + by$일 때, $a」
**RPM** M2-RPM-013 [식의 계산 > 다항식의 계산 > 다항식의 덧셈과 뺄셈 > 괄호가 있는 계산] (원천과 같음)
- 이유: 괄호가 복잡한 다항식의 덧셈과 뺄셈 ax 관련 RPM 문항입니다.
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE
- 이유: 다중 괄호 전개와 동류항 정리를 통해 ax 계수를 구하는 다항식 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 여러 겹의 괄호가 포함된 다항식을 차례로 풀어 ax 계수를 결정하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 다항식←stem:「ax + by$일 때, $a$와 $b」
- method: 분배법칙(NAMED)←solution:「$4x - [x + 3y - {6x 」
- condition: (없음)

**how** 소괄호, 중괄호, 대괄호 순서로 전개하여 ax + by 형태를 만들고 ab를 구했습니다.

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
1. $3x(x - 3) = 3x^2 - 9x$이다. 11
2. $(3x - 1)(-2x) = -6x^2 + 2x$이다. 11
3. 식을 빼면 $(3x^2 - 9x) - (-6x^2 + 2x) = 9x^2 - 11x$이다. 11
4. $a = 9, b = -11$이므로 $a + b = -2$이다. 11
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「간단히 한 식에서 $x^{2」
**RPM** M2-RPM-014 [식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 분배법칙] (원천과 같음)
- 이유: 단항식과 다항식의 곱셈과 분배법칙 11 관련 RPM 문항입니다.
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE
- 이유: 단항식과 다항식의 곱셈 후 동류항 정리로 계수 11을 구하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 분배법칙과 동류항 정리를 적용하여 계수 11을 다루는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 다항식←stem:「간단히 한 식에서 $x^{2}$의 계」
- method: 분배법칙(NAMED)←solution:「11x$
따라서 $a = 9,\ b 」
- condition: (없음)

**how** 분배법칙으로 단항식과 다항식의 곱을 전개하고 11이 포함된 식에서 계수의 합을 구했습니다.

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
1. $\dfrac{-3x^2 + 4x^3}{x^2} = -3 + 4x$이다. 8
2. $\dfrac{5x^3 - 3x^5}{x^3} = 5 - 3x^2$이다. 8
3. $(-3 + 4x) - (5 - 3x^2) = 3x^2 + 4x - 8$이다. 8
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「계산하면?」
**RPM** M2-RPM-015 [식의 계산 > 다항식의 계산 > 단항식과 다항식의 곱셈·나눗셈 > 다항식을 단항식으로 나누기] (원천과 같음)
- 이유: 다항식을 단항식으로 나누는 계산 8 관련 RPM 문항입니다.
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE
- 이유: 다항식과 단항식의 나눗셈 및 뺄셈을 수행하여 8을 구하는 다항식 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 다항식을 단항식으로 나누고 동류항을 정리하여 8을 도출하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 다항식←stem:「계산하면?」
- method: 다항식(NAMED)←solution:「3x^{2} + 4x^{3}}{x^{」
- condition: (없음)

**how** 각 항을 단항식으로 나눈 뒤 뺄셈을 수행하여 상수항 8을 포함한 이차식을 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\frac{-3x^{2} + 4x^{3}}{x^{2}} - \frac{5x^{3} - 3x^{5}}{x^{3}}$
$= (-3 + 4x) - (5 - 3x^{2})$
$= -3 + 4x - 5 + 3x^{2} = 3x^{2} + 4x - 8$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3점


**발문**

다음 중 부등식이 아닌 것을 모두 고르면? (정답 $2$개)

**보기** ① $2x + 5$  ② $x + 3 < 5x$  ③ $3 - 11 \le -6$  ④ $3x^{2} - 2x \ge 3x^{2} + x - 4$  ⑤ $4x - 1 = 3x - 5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 부등식은 부등호($<, >, \le, \ge$)를 포함한 식이다. 11
2. ① $2x + 5$는 부등호가 없는 다항식이다. 11
3. ⑤ $4x - 1 = 3x - 5$는 등식이다. 11
4. 따라서 부등식이 아닌 것은 ①, ⑤이다. 11
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「부등식이 아닌 것을 모두 고」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: 부등식의 뜻과 성질 11 관련 RPM 문항입니다.
**유형** PT=PT_M2_LINEAR_INEQUALITY_IDENTIFICATION / TPL=NONE (원천과 같음)
- 이유: 부등식의 정의를 만족하지 않는 식을 11 관련 식에서 식별하는 유형입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부등호의 정의를 확인하여 11 관련 보기에서 부등식을 판별하는 기본 1단계 문제입니다.

**4칸**
- given: (없음)
- goal: 부등식←stem:「부등식이 아닌 것을 모두 고르면? (」
- method: 부등식(NAMED)←solution:「부등식은 부등호($<, >, \le,」
- condition: (없음)

**how** 11이 포함된 보기 등에서 부등호의 유무와 등식 여부를 판별하여 부등식이 아닌 것을 찾았습니다.

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
1. $-3a - 2 \le -3b - 2 \implies -3a \le -3b \implies a \ge b$이다. 3
2. ⑤ 양변을 양수 3으로 나누면 부등호가 바뀌지 않으므로 $\dfrac{a}{3} \ge \dfrac{b}{3}$이어야 한다. 3
3. 따라서 옳지 않은 것은 ⑤이다. 3
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「옳지 않은 것은?」
**RPM** M2-RPM-018 [일차부등식과 연립일차방정식 > 일차부등식 > 부등식의 성질 > 부등식의 성질] (원천과 같음)
- 이유: 부등식의 기본 성질과 3 관련 RPM 문항입니다.
**유형** PT=PT_M2_INEQUALITY_PROPERTIES_TRUE_FALSE / TPL=TPL_M2_INEQUALITY_PROPERTIES_TRUE_FALSE_RULE (원천과 같음)
- 이유: 부등식의 기본 성질 적용의 옳고 그름을 3으로 판별하는 유형입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부등식의 양변을 3으로 나눌 때의 기본 성질을 확인하는 난이도 1 문제입니다.

**4칸**
- given: (없음)
- goal: 부등식←stem:「옳지 않은 것은?」
- method: 부등식(NAMED)←solution:「부등호 방향이 바뀌어 $a \ge b」
- condition: (없음)

**how** 양변에 수를 더하거나 음수 3으로 나눌 때 부등호 방향의 변화를 분석했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$-3a - 2 \le -3b - 2$의 양변에 $2$를 더하면 $-3a \le -3b$
양변을 $-3$으로 나누면 부등호 방향이 바뀌어 $a \ge b$
⑤ $a \ge b$의 양변을 양수 $3$으로 나누면 부등호 방향이 바뀌지 않아 $\frac{a}{3} \ge \frac{b}{3}$이어야 한다.
따라서 옳지 않은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, PT)

**발문**

다음 중 일차부등식 $12 + x \le 3(x - 2)$의 해가 아닌 것은?

**보기** ① $8$  ② $9$  ③ $10$  ④ $11$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $12 + x \le 3x - 6$이다. 12
2. $-2x \le -18 \implies x \ge 9$이다. 12
3. 따라서 $x \ge 9$에 포함되지 않는 해는 ① 8이다. 12
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차부등식 $12 + x \」
**RPM** M2-RPM-020 [일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 기본형] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 괄호·분수·소수가 있는 부등식 → 일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 기본형**
- 이유: 기본형 일차부등식의 풀이 12 관련 RPM 문항입니다.
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE **원천→판정: PT_M2_LINEAR_INEQUALITY_SOLVING → PT_M2_LINEAR_INEQUALITY**
- 이유: 일차부등식을 풀고 12가 든 부등식의 해에 속하지 않는 값을 판정하는 유형입니다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 괄호가 있는 일차부등식을 12를 이용해 이항하고 기본 해를 구하는 난이도 1 문제입니다.

**4칸**
- given: (없음)
- goal: 일차부등식←stem:「일차부등식 $12 + x \le 3(」
- method: 일차부등식(NAMED)←solution:「12 + x \le 3x - 6$
$」
- condition: (없음)

**how** 일차부등식을 풀어 12 관련 식에서 $x \ge 9$의 해를 구하고 보기를 대조했습니다.

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
1. 양변에 3을 곱하면 $x - 6 \ge 3x - 3a \implies -2x \ge 6 - 3a$이다. 18
2. $x \le \dfrac{3a - 6}{2}$이다. 18
3. 가장 큰 수가 6이므로 $\dfrac{3a - 6}{2} = 6 \implies 3a - 6 = 12 \implies 3a = 18 \implies a = 6$이다. 18
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차부등식 $\frac{1}」
**RPM** M2-RPM-023 [일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건] (원천과 같음)
- 이유: 일차부등식 해의 조건과 계수 18 결정 RPM 문항입니다.
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE
- 이유: 일차부등식의 해의 최댓값 조건으로 계수 18을 결정하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분수 계수 일차부등식을 정리하고 해의 조건에서 18을 도출하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 일차부등식←stem:「일차부등식 $\frac{1}{3}x 」
- method: 일차부등식(NAMED)←solution:「18 \implies a = 6$」
- condition: (없음)

**how** 부등식을 풀어 해의 최댓값 6과 일치하도록 3a=18을 풀어 a=6을 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\frac{1}{3}x - 2 \ge x - a$의 양변에 $3$을 곱하면 $x - 6 \ge 3x - 3a$
$-2x \ge 6 - 3a \implies x \le \frac{3a - 6}{2}$
해 중에서 가장 큰 수가 $6$이므로 $\frac{3a - 6}{2} = 6$
$3a - 6 = 12 \implies 3a = 18 \implies a = 6$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

두 일차부등식 $\frac{1}{2}(x - 2) \le 0.3(x - 5) - 2.9$, $\frac{2 - x}{3} \ge \frac{a}{2} + \frac{1}{3}$의 해가 서로 같을 때, 수 $a$의 값은?

**보기** ① $10$  ② $11$  ③ $12$  ④ $13$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째 부등식 양변에 10을 곱하면 $5(x - 2) \le 3(x - 5) - 29 \implies x \le -17$이다. 10
2. 둘째 부등식 양변에 6을 곱하면 $2(2 - x) \ge 3a + 2 \implies -2x \ge 3a - 2 \implies x \le \dfrac{2 - 3a}{2}$이다. 10
3. $\dfrac{2 - 3a}{2} = -17 \implies 2 - 3a = -34 \implies 3a = 36 \implies a = 12$이다. 10
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY(일차부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차부등식 $\frac{1}」
**RPM** M2-RPM-021 [일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 괄호·분수·소수가 있는 부등식] **원천→판정: 일차부등식과 연립일차방정식 > 일차부등식 > 해의 조건 > 계수 조건 → 일차부등식과 연립일차방정식 > 일차부등식 > 일차부등식의 풀이 > 괄호·분수·소수가 있는 부등식**
- 이유: 괄호·분수·소수가 있는 일차부등식의 풀이 10 관련 RPM 문항입니다.
**유형** PT=PT_M2_LINEAR_INEQUALITY / TPL=NONE
- 이유: 두 일차부등식에 10을 곱해 푼 뒤 해가 같을 조건을 만족하는 미지수를 구하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 분수와 소수가 섞인 부등식에 10을 곱해 정리하고 두 해를 일치시키는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 일차부등식←stem:「일차부등식 $\frac{1}{2}(x」
- method: 일차부등식(NAMED)←solution:「10$을 곱하면 $5(x - 2) \」
- condition: (없음)

**how** 두 부등식의 해가 서로 같음을 이용해 a=12를 구했습니다.

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
1. 평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 $\angle ACD = \angle BAC = 38^\circ$이다. 38
2. $\overline{AD} \parallel \overline{BC}$이므로 $\angle CAD = \angle ACB = 47^\circ$이다. 38
3. 따라서 $\angle ACD + \angle CAD = 38^\circ + 47^\circ = 85^\circ$이다. 38
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형의 변·각의 성질 38도 관련 RPM 문항입니다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 평행사변형 대변의 평행 조건과 엇각 38도로 각의 크기를 구하는 사각형 성질 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 평행사변형의 대변 평행성과 엇각 성질 38도를 결합하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 평행사변형←stem:「평행사변형 $ABCD$에서 두 대각선」
- method: 평행사변형(NAMED)←solution:「38^{\circ}$
또한 $\ove」
- condition: (없음)

**how** 평행선의 엇각의 성질을 적용하여 두 각의 합 85도를 구했습니다.

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
1. 평행사변형에서 대변의 길이가 같으므로 $\overline{AB} + \overline{AD} = 30 / 2 = 15\text{ cm}$이다. 30
2. 비가 $2:3$이므로 $\overline{AB} = 15 \times \dfrac{2}{5} = 6\text{ cm}$이다. 30
3. $\overline{CD} = \overline{AB} = 6\text{ cm}$이다. 30
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「둘레의 길이는 $30\tex」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형의 변의 성질과 둘레 30 계산 RPM 문항입니다.
**유형** PT=PT_MG_PARALLELOGRAM_SIDES_RATIO_PERIMETER / TPL=NONE
- 이유: 평행사변형 둘레 30과 변의 비로 한 변을 계산하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 평행사변형의 둘레 30cm와 비례배분을 이용하여 대변의 길이를 구하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 평행사변형←stem:「평행사변형 $ABCD$의 둘레의 길이」
- method: 평행사변형(NAMED)←solution:「30}{2} = 15\text{ cm」
- condition: (없음)

**how** 둘레 30cm와 이웃하는 두 변의 비로 한 변의 길이를 계산했습니다.

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
1. 엇각과 각의 이등분선에 의해 $\triangle ABE$는 이등변삼각형이므로 $\overline{BE} = \overline{AB} = x$이다. EF
2. 마찬가지로 $\triangle DCF$도 이등변삼각형이므로 $\overline{CF} = \overline{CD} = x$이다. EF
3. $\overline{EF} = \overline{BE} + \overline{CF} - \overline{BC} = x + x - y = 2x - y$이다. EF
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「이등분선이 변 $BC$와 만」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형의 변·각의 성질과 선분 EF 계산 RPM 문항입니다.
**유형** PT=PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT / TPL=NONE
- 이유: 평행사변형의 각 이등분선이 만드는 선분 EF를 계산하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 내각의 이등분선 성질로 이등변삼각형을 유도해 EF를 구하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 평행사변형←stem:「평행사변형 $ABCD$에서 $\ang」
- method: 이등변삼각형(NAMED)←solution:「이등변삼각형이므로 $\overline」
- condition: (없음)

**how** 각의 이등분선과 평행선 엇각으로 이등변삼각형을 찾아 선분 EF의 길이를 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD} \parallel \overline{BC}$이므로 $\angle AEB = \angle DAE = \angle BAE$ (엇각과 각의 이등분선)
따라서 $\triangle ABE$는 이등변삼각형이므로 $\overline{BE} = \overline{AB} = x$
마찬가지로 $\triangle DCF$도 이등변삼각형이므로 $\overline{CF} = \overline{CD} = x$
$\overline{BC} = \overline{AD} = y$이고 $2x > y$이므로
$\overline{EF} = \overline{BE} + \overline{CF} - \overline{BC} = x + x - y = 2x - y$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

사각형 $ABCD$에서 $\angle A = 115^{\circ}$, $\angle B = 65^{\circ}$이고 $\overline{AD} = \overline{BC} = 8\text{ cm}$일 때, $\square ABCD$가 평행사변형이 되는 가장 알맞은 조건은?

**보기** ① 두 쌍의 대변이 각각 평행하다.  ② 두 쌍의 대변의 길이가 각각 같다.  ③ 두 쌍의 대각의 크기가 각각 같다.  ④ 한 쌍의 대변이 평행하고 그 길이가 같다.  ⑤ 두 대각선이 서로 다른 것을 이등분한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle A + \angle B = 115^\circ + 65^\circ = 180^\circ$이므로 $\overline{AD} \parallel \overline{BC}$이다. 115
2. 여기에 $\overline{AD} = \overline{BC} = 8\text{ cm}$가 주어졌으므로 한 쌍의 대변이 평행하고 그 길이가 같다. 115
3. 따라서 가장 알맞은 조건은 ④이다. 115
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형이 되는 가장 알맞」
**RPM** M2-RPM-074 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 평행사변형의 판정 조건 115 관련 RPM 문항입니다.
**유형** PT=PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION / TPL=NONE
- 이유: 주어진 각 115도와 변 조건에서 평행사변형이 되는 조건을 식별하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 각도 115도와 65도로 평행 조건을 이끌어내고 평행사변형 판정 조건을 매칭하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 평행사변형←stem:「평행사변형이 되는 가장 알맞은 조건은」
- method: 평행사변형(NAMED)←solution:「115^{\circ} + 65^{\c」
- condition: (없음)

**how** 동측내각의 합 180도로 평행을 도출하고 한 쌍의 대변이 평행하고 길이가 같음을 확인했습니다.

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
1. 평행사변형이 정사각형이 되려면 직사각형 조건과 마름모 조건을 동시에 만족해야 한다. 90
2. ② $\overline{AO}=\overline{BO}$는 직사각형 조건뿐이므로 정사각형이 되지 않는다. 90
3. ③ $\angle A=90^\circ$와 $\overline{AB} \perp \overline{BC}$는 모두 직사각형 조건뿐이므로 정사각형이 되지 않는다. 90
4. 따라서 정사각형이 되는 조건이 아닌 것은 ②, ③이다. 90
- 작성자 답: ②, ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「정사각형이 되는 조건이 아닌」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] (원천과 같음)
- 이유: 사각형의 포함 관계와 90도 정사각형 판정 RPM 문항입니다.
**유형** PT=PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS / TPL=NONE
- 이유: 평행사변형에서 직사각형과 90도 마름모 조건을 분석하여 정사각형 조건을 선별하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형에서 90도 직사각형 조건과 마름모 조건을 구분하여 정사각형 조건을 가려내는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 정사각형←stem:「정사각형이 되는 조건이 아닌 것은? 」
- method: 정사각형(NAMED)←solution:「정사각형이 되려면 직사각형 조건과 마」
- condition: (없음)

**how** 평행사변형 ABCD가 정사각형이 되기 위한 직사각형 조건과 마름모 조건의 조합을 분석했습니다.

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
1. 종이를 두 번 접어 자르면 두 대각선이 서로 수직이등분하므로 마름모가 된다. cm
2. 자른 두 변의 길이가 다르므로 내각이 직각인 정사각형은 아니다. cm
3. ① 직사각형이 아니므로 옳지 않다. cm
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직사각형 모양의 종이를 가로」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 여러 가지 사각형의 성질과 cm 대각선 직교 RPM 문항입니다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 종이접기 cm 도형에서 특수 사각형의 성질을 판정하는 사각형 성질 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 종이접기 cm 도형에서 대각선의 수직이등분 성질로 마름모를 추론하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 마름모←stem:「직사각형 모양의 종이를 가로로 한 번」
- method: 마름모(NAMED)←solution:「마름모가 된다.
① 직사각형이 아니다」
- condition: (없음)

**how** 길이 8 cm인 선분을 따라 자른 접힌 선과 잘린 변의 성질로 대각선이 직교하는 마름모임을 판정하고 오답을 골랐습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

종이를 가로·세로로 두 번 접어 직각삼각형 모양으로 자른 뒤 펴면, 자른 선분 $4$개가 네 변이 되고 접힌 선이 서로 수직인 두 대각선이 되며 자른 두 변의 길이가 다르므로 직각이 아닌 마름모가 된다.
① 직사각형이 아니다. (거짓)
⑤ 한 내각이 직각인 마름모(정사각형)가 아니다. (거짓)
따라서 옳지 않은 것은 ①, ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

사각형 $ABCD$에서 두 대각선 $AC, BD$의 교점을 $O$라 할 때, 다음 중 $\square ABCD$가 마름모가 되는 조건은?

**보기** ① $\overline{AC} = \overline{BD},\ \overline{AC} \perp \overline{BD}$  ② $\overline{AB} \parallel \overline{DC},\ \angle AOB = 90^{\circ}$  ③ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \overline{AC} = \overline{BD}$  ④ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \angle A = 90^{\circ}$  ⑤ $\overline{AB} \parallel \overline{DC},\ \overline{AB} = \overline{DC},\ \angle AOB = 90^{\circ}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ⑤ $\overline{AB} \parallel \overline{DC}, \overline{AB} = \overline{DC}$로 평행사변형이 된다. AOB
2. 여기에 $\angle AOB = 90^\circ$(대각선 직교)가 추가되므로 마름모가 된다. AOB
3. 따라서 마름모가 되는 조건은 ⑤이다. AOB
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모가 되는 조건은?」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] (원천과 같음)
- 이유: 사각형의 포함 관계와 각 AOB 마름모 조건 판정 RPM 문항입니다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 평행사변형 조건과 각 AOB 대각선 직교 조건으로 마름모를 판정하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 조건에 대각선 직교 각 AOB 조건을 더해 마름모가 됨을 판정하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 마름모←stem:「마름모가 되는 조건은?」
- method: 마름모(NAMED)←solution:「마름모가 된다.」
- condition: (없음)

**how** 한 쌍의 대변이 평행하고 길이가 같은 평행사변형에 대각선 직교 각 AOB=90도를 더해 마름모임을 확인했습니다.

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
1. 이웃하는 두 내각의 합이 $180^\circ$이므로 이등분선의 합은 $90^\circ$가 되어 $\square PQRS$의 네 내각은 모두 $90^\circ$이다. PQRS
2. 따라서 $\square PQRS$는 직사각형이다. PQRS
3. 직사각형의 대각선은 서로 직교하지 않으므로 ② $\overline{PR} \perp \overline{QS}$는 옳지 않다. PQRS
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: 직사각형의 성질과 사각형 PQRS 관련 RPM 문항입니다.
**유형** PT=PT_MG_PARALLELOGRAM_ANGLE_BISECTORS_RECTANGLE / TPL=NONE
- 이유: 평행사변형 내각 이등분선이 만드는 사각형 PQRS의 성질을 판정하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내각 이등분선으로 형성된 사각형 PQRS가 직사각형임을 밝히고 성질을 검토하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 직사각형←stem:「평행사변형 $ABCD$에서 네 내각의」
- method: 직사각형(NAMED)←solution:「직사각형이다($\overline{AB」
- condition: (없음)

**how** 평행사변형 ABCD 네 내각의 이등분선 교점이 사각형 PQRS 직사각형을 이룸을 알고 대각선 직교 성질이 성립하지 않음을 판정했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$의 네 내각의 이등분선의 교점으로 이루어진 $\square PQRS$는 직사각형이다($\overline{AB} \ne \overline{BC}$이므로 정사각형은 아니다).
직사각형은 두 쌍의 대변의 길이가 같고($\overline{PS} = \overline{QR},\ \overline{PQ} = \overline{SR}$), 네 내각이 모두 $90^{\circ}$이며, 두 대각선의 길이가 같다($\overline{PR} = \overline{QS}$).
그러나 두 대각선은 서로 수직이 아니므로 ② $\overline{PR} \perp \overline{QS}$는 옳지 않다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, 난이도)

**발문**

다음 보기 중 두 대각선이 서로 다른 것을 이등분하는 사각형은 몇 개인가?


ㄱ. 평행사변형    ㄴ. 사다리꼴
ㄷ. 등변사다리꼴  ㄹ. 정사각형
ㅁ. 직사각형      ㅂ. 마름모

**보기** ① $2$개  ② $3$개  ③ $4$개  ④ $5$개  ⑤ $6$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 대각선이 서로 다른 것을 이등분하는 사각형은 평행사변형의 성질을 갖는 사각형이다. 4
2. ㄱ. 평행사변형, ㄹ. 정사각형, ㅁ. 직사각형, ㅂ. 마름모의 총 4개이다. 4
3. 따라서 개수는 ③ 4개이다. 4
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「대각선이 서로 다른 것을 이」
**RPM** M2-RPM-083 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 성질 비교] (원천과 같음)
- 이유: 사각형의 포함 관계와 대각선 성질 비교 4 관련 RPM 문항입니다.
**유형** PT=PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH**
- 이유: 사각형들의 대각선 성질을 만족하는 사각형 4개의 개수를 세는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 여러 사각형의 대각선 성질을 비교하여 평행사변형군 4개를 선별하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 대각선←stem:「대각선이 서로 다른 것을 이등분하는 」
- method: 평행사변형(NAMED)←solution:「4$개이다.」
- condition: (없음)

**how** 대각선이 서로 이등분하는 평행사변형 군에 속하는 사각형 4개를 분류하여 셌습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 대각선이 서로 다른 것을 이등분하는 사각형은 평행사변형과 평행사변형에 포함되는 사각형이다.
따라서 ㄱ. 평행사변형, ㄹ. 정사각형, ㅁ. 직사각형, ㅂ. 마름모의 $4$개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN

**발문**

다음 중 사각형과 그 사각형의 각 변의 중점을 연결하여 만든 사각형을 짝지은 것으로 옳지 않은 것은?

**보기** ① 평행사변형 - 직사각형  ② 직사각형 - 마름모  ③ 마름모 - 직사각형  ④ 정사각형 - 정사각형  ⑤ 등변사다리꼴 - 마름모

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형의 각 변의 중점을 연결하여 만든 사각형은 평행사변형이다. 직사각형
2. 따라서 ① 평행사변형 - 직사각형은 옳지 않다. 직사각형
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「중점을 연결하여 만든 사각형」
**RPM** M2-RPM-081 [사각형의 성질 > 여러 가지 사각형 > 사다리꼴 > 중점 연결] (원천과 같음)
- 이유: 중점 연결 사각형의 성질과 직사각형 판별 RPM 문항입니다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE (원천과 같음)
- 이유: 사각형의 각 변의 중점을 연결해 만든 사각형을 판별하는 사각형 성질 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 중점 연결 사각형의 성질을 암기하고 직사각형과의 관계를 판별하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 평행사변형←stem:「중점을 연결하여 만든 사각형을 짝지은」
- method: 평행사변형(NAMED)←solution:「평행사변형의 각 변의 중점을 연결하여」
- condition: (없음)

**how** 각 사각형의 변의 중점을 연결하여 생기는 사각형의 짝을 판별했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

① 평행사변형의 각 변의 중점을 연결하여 만든 사각형은 평행사변형이다. (직사각형이 아니다.)
②, ③, ④, ⑤는 모두 옳다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 4점


**발문**

$\overline{AD} \parallel \overline{BC}$인 등변사다리꼴 $ABCD$에서 $\overline{AB} = \overline{AD}$이고 $\angle DBC = 28^{\circ}$일 때, $\angle BDC$의 크기를 구하면?

**보기** ① $92^{\circ}$  ② $96^{\circ}$  ③ $100^{\circ}$  ④ $104^{\circ}$  ⑤ $108^{\circ}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AD} \parallel \overline{BC}$이므로 $\angle ADB = \angle DBC = 28^\circ$이다. 28
2. $\overline{AB} = \overline{AD}$이므로 $\angle ABD = 28^\circ$, $\angle A = 180^\circ - 56^\circ = 124^\circ$이다. 28
3. 등변사다리꼴의 밑각 $\angle C = \angle B = 180^\circ - 124^\circ = 56^\circ$이다. 28
4. $\angle BDC = 180^\circ - 28^\circ - 56^\circ = 96^\circ$이다. 28
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「등변사다리꼴 $ABCD$에서」
**RPM** M2-RPM-080 [사각형의 성질 > 여러 가지 사각형 > 사다리꼴 > 등변사다리꼴] (원천과 같음)
- 이유: 등변사다리꼴의 성질과 각 28도 계산 RPM 문항입니다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 등변사다리꼴의 평행선과 밑각 성질을 이용해 각 28도 관련 각을 구하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 등변사다리꼴의 밑각 성질과 엇각 28도를 종합적으로 활용하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 등변사다리꼴←stem:「등변사다리꼴 $ABCD$에서 $\ov」
- method: 등변사다리꼴(NAMED)←solution:「28^{\circ}$ (엇각)
$\o」
- condition: (없음)

**how** 엇각과 이등변삼각형 성질로 각 A를 구하고 등변사다리꼴의 밑각을 이용해 96도를 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD} \parallel \overline{BC}$이므로 $\angle ADB = \angle DBC = 28^{\circ}$ (엇각)
$\overline{AB} = \overline{AD}$이므로 $\triangle ABD$는 이등변삼각형이고 $\angle ABD = \angle ADB = 28^{\circ}$
따라서 $\angle ABC = 28^{\circ} + 28^{\circ} = 56^{\circ}$
등변사다리꼴에서 밑각의 크기가 같으므로 $\angle C = \angle ABC = 56^{\circ}$
$\triangle BCD$에서 $\angle BDC = 180^{\circ} - (28^{\circ} + 56^{\circ}) = 96^{\circ}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점


**발문**

[서술형 1] $x = \frac{3}{5}$, $y = 3$일 때, 식 $y - [2x - {3y + (12y^{2} - 9xy) \div 3y}]$의 값을 구하려고 한다. 다음 물음에 답하시오.
(1) $y - [2x - {3y + (12y^{2} - 9xy) \div 3y}]$를 계산하시오. [3점]
(2) (1)의 결과에 $x = \frac{3}{5}$와 $y = 3$을 대입하여 주어진 식의 값을 구하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $-5x + 8y$, (2) $21$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $y - [2x - {3y + (4y - 3x)}] = y - [2x - (7y - 3x)] = y - (5x - 7y) = -5x + 8y$이다. 21
2. (2) $x = 3/5, y = 3$을 대입하면 $-5(3/5) + 8(3) = -3 + 24 = 21$이다. 21
- 작성자 답: (1) $-5x + 8y$, (2) $21$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-01(수와 식) / M2-01-POLYNOMIAL_OPERATIONS(다항식의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「서술형 1] $x = \fr」
**RPM** M2-RPM-016 [식의 계산 > 다항식의 계산 > 식의 값과 활용 > 식의 값] (원천과 같음)
- 이유: 다항식의 식의 값 계산 21 관련 RPM 문항입니다.
**유형** PT=PT_M2_POLYNOMIAL / TPL=NONE
- 이유: 다항식을 정리한 후 수치를 대입하여 식의 값 21을 구하는 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다항식의 나눗셈과 괄호 정리를 마친 후 값을 대입하여 21을 구하는 난이도 2 서술형 문제입니다.

**4칸**
- given: (없음)
- goal: 다항식←stem:「서술형 1] $x = \frac{3}」
- method: 분배법칙(NAMED)←solution:「-5x + 8y$
(2) $x = \」
- condition: (없음)

**how** 괄호 전개와 나눗셈을 먼저 수행하여 -5x+8y를 얻고 값을 대입해 21을 구했습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $y - [2x - {3y + (12y^{2} - 9xy) \div 3y}]$
$= y - [2x - {3y + (4y - 3x)}]$
$= y - [2x - (7y - 3x)]$
$= y - (5x - 7y) = -5x + 8y$
(2) $x = \frac{3}{5},\ y = 3$을 대입하면 $-5 \times \frac{3}{5} + 8 \times 3 = -3 + 24 = 21$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점


**발문**

[서술형 2] 준호는 집에서 $8\text{ km}$ 떨어진 도서관까지 가는데, 처음에는 자전거를 타고 시속 $10\text{ km}$로 가다가 도중에 자전거가 고장이 나서 멈추고 $15$분 동안 살펴본 후, 다시 자전거를 끌고 시속 $5\text{ km}$로 걸어갔다. 도서관까지 가는 데 걸린 시간이 $1$시간 $30$분을 넘지 않았을 때, 자전거가 고장 난 지점은 집에서 몇 $\text{km}$ 이상 떨어진 곳인지 구하려고 한다. 다음 물음에 답하시오.
(1) 전체 걸리는 시간이 $1$시간 $30$분을 넘지 않음을 이용하여 부등식을 세우시오. [3점]
(2) 자전거가 고장 난 지점은 집에서 몇 $\text{km}$ 이상 떨어진 곳인지 구하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$, (2) $\frac{7}{2}\text{ km}$ 이상   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 거속시 관계식: $\dfrac{x}{10} + \dfrac{15}{60} + \dfrac{8 - x}{5} \le \dfrac{3}{2}$이다. 10
2. (2) 양변에 60을 곱하면 $6x + 15 + 12(8 - x) \le 90 \implies -6x + 111 \le 90$이다. 10
3. $-6x \le -21 \implies x \ge 7/2$이므로 $7/2\text{ km}$ 이상이다. 10
- 작성자 답: (1) $\frac{x}{10} + \frac{15}{60} + \frac{8 - x}{5} \le \frac{3}{2}$, (2) $\frac{7}{2}\text{ km}$ 이상 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-02(일차부등식) / M2-02-LINEAR_INEQUALITY_WORD(일차부등식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「서술형 2] 준호는 집에서 」
**RPM** M2-RPM-026 [일차부등식과 연립일차방정식 > 일차부등식의 활용 > 거리·속력·시간 > 시간 제한] (원천과 같음)
- 이유: 일차부등식의 거리·속력·시간 활용 10 관련 RPM 문항입니다.
**유형** PT=PT_M2_LINEAR_INEQUALITY_WORD_PROBLEM_SPEED / TPL=TPL_M2_SOLVE_ROUND_TRIP_TIME_LIMIT_INEQUALITY (원천과 같음)
- 이유: 이동 시간 제한을 이용해 거리 부등식을 세우고 푸는 속력 일차부등식 활용 유형입니다. 10
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 시속 10과 분 단위를 시간 단위로 통일하여 부등식을 세우고 푸는 난이도 3 활용 문제입니다.

**4칸**
- given: (없음)
- goal: 일차부등식←stem:「서술형 2] 준호는 집에서 $8\te」
- method: 일차부등식(NAMED)←solution:「10} + \frac{15}{60} 」
- condition: (없음)

**how** 시속 10 km 이동 시간과 휴식 시간의 합이 제한 시간 이하임을 이용해 부등식을 세우고 풀었습니다.

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
1. (1) $\overline{AD} \parallel \overline{BC}$이므로 $\triangle ABC = \triangle DBC$이고, 공통 부분 $\triangle OBC$를 빼면 $\triangle OAB = \triangle ODC$이다. 14
2. (2) 높이가 같으므로 $\triangle OAB : \triangle OBC = \overline{AO} : \overline{OC} = 2 : 5$이다. 14
3. $\triangle OAB = \triangle ODC = 14\text{ cm}^2$이므로 $\triangle OBC = 14 \times \dfrac{5}{2} = 35\text{ cm}^2$이다. 14
- 작성자 답: (1) $\triangle ABC = \triangle DBC$에서 공통 부분 $\triangle OBC$를 빼면 $\triangle OAB = \triangle ODC$, (2) $35\text{ cm}^{2}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「서술형 3] $\overli」
**RPM** M2-RPM-076 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 평행선과 넓이] (원천과 같음)
- 이유: 평행선과 삼각형의 넓이 및 등적변형 14 관련 RPM 문항입니다.
**유형** PT=PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION / TPL=NONE
- 이유: 평행선 사이의 삼각형 등적변형과 선분 비로 14 관련 넓이를 구하는 유형입니다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 평행선 사이의 등적변형 증명과 밑변의 비를 결합해 14로부터 넓이를 구하는 난이도 3 문제입니다.

**4칸**
- given: (없음)
- goal: 사다리꼴←stem:「서술형 3] $\overline{AD」
- method: 넓이(NAMED)←solution:「14\text{ cm}^{2}$이고,」
- condition: (없음)

**how** 등적변형으로 삼각형 넓이가 같음을 설명하고 밑변의 길이의 비로 넓이 35를 구했습니다.

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
1. 평행선 엇각에 의해 $\angle ACD = \angle CAB = a$이다. 90
2. (1) $a = b$이면 $\triangle ODC$가 이등변삼각형이 되어 $\overline{OC} = \overline{OD} \implies \overline{AC} = \overline{BD}$이므로 직사각형이다. 90
3. (2) $a + b = 90^\circ$이면 $\angle COD = 90^\circ$가 되어 두 대각선이 직교하므로 마름모이다. 90
- 작성자 답: (1) $\overline{OC} = \overline{OD}$이므로 $\overline{AC} = \overline{BD}$가 되어 직사각형이다, (2) $\angle COD = 90^{\circ}$이므로 두 대각선이 직교하여 마름모이다 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「서술형 4] 평행사변형 $A」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질 → 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정**
- 이유: 사각형의 포함 관계와 90도 직사각형·마름모 조건 판정 RPM 문항입니다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 대각선 각 조건 90도로부터 직사각형 및 마름모를 판정하는 사각형 성질 유형입니다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각의 조건으로부터 직사각형과 90도 마름모 판정 조건을 단계별로 논증하는 난이도 2 문제입니다.

**4칸**
- given: (없음)
- goal: 평행사변형←stem:「서술형 4] 평행사변형 $ABCD$에」
- method: 마름모(NAMED)←solution:「90^{\circ}$이면 $\tria」
- condition: (없음)

**how** 엇각과 삼각형 내각의 합으로 대각선 길이 일치와 대각선 직교 90도를 이끌어냈습니다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$에서 $\overline{AB} \parallel \overline{DC}$이므로 엇각에 의해 $\angle ACD = \angle CAB = a$이다.
(1) $a = b$이면 $\triangle ODC$에서 $\angle OCD = \angle ODC$이므로 $\overline{OC} = \overline{OD}$이다. 평행사변형의 두 대각선은 서로 다른 것을 이등분하므로 $\overline{AC} = 2\overline{OC} = 2\overline{OD} = \overline{BD}$가 되어 두 대각선의 길이가 같으므로 직사각형이다.
(2) $a + b = 90^{\circ}$이면 $\triangle ODC$에서 $\angle COD = 180^{\circ} - (a + b) = 90^{\circ}$이다. 두 대각선이 서로 수직으로 만나므로 마름모이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
