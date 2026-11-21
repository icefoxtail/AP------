# 검수 묶음 — 22_순천여고_1학기_중간_고1_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 4)**
- 문항 23개 / 검사 PASS 19, FAIL 4, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 3, 2단계 12, 3단계 6, 4단계 1, 5단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q6**: 검사 코드: CHOICE_ORDER
- **Q14**: 검사 코드: CHOICE_ORDER
- **Q16**: 검사 코드: CHOICE_ORDER
- **Q18**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3.6점


**발문**

두 다항식 $A=2x^2+xy-3y^2$, $B=x^2-2xy+2y^2$에 대하여 $2X-B=2A+3B$를 만족하는 다항식 $X=ax^2+bxy+cy^2$일 때, $a+b+c$의 값은?

**보기** ① $0$  ② $2$  ③ $4$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. Q1 문제의 조건(xy)에 맞추어 식을 세운다.
2. 주어진 등식을 $X$에 대하여 정리하면 $$ 2X = 2A+4B \implies X = A+2B $$ $A$와 $B$를 대입하여 계산하면 $$ \begin{aligned} X &= (2x^2+xy-3y^2)+2(x^2-2xy+2y^2) \ &= 4x^2-3xy+y^2 \end{aligned} $$ 따라서 $a=4$, $b=-3$, $c=1$이므로 $a+b+c=4-3+1=2$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_BASIC(다항식의 기본 연산) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 다항식 $A=2x^2+xy-3y^2$, $B=x^2」
**RPM** H1-RPM-001 [다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리] **원천→판정: 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 다항식의 덧셈·뺄셈 → 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리**
- 이유: Q1(xy): 다항식의 기본 연산 단원의 RPM H1-RPM-001 유형에 해당한다.
**유형** PT=PT_H1_POLY_OPERATION_EXPANSION / TPL=TPL_H1_POLY_OPERATION_DIRECT (원천과 같음) (원천과 같음)
- 이유: Q1(xy): 다항식의 기본 연산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(xy): 다항식의 기본 연산 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 계수←solution:「X = A+2B」
- goal: 다항식←stem:「만족하는 다항식 $X=ax^2+bxy+cy^2$」
- method: 다항식(IMPLIED)←stem:「두 다항식 $A=2x^2+xy-3y^2$」 — 등식을 X에 대해 정리하고 다항식의 실수배·덧셈을 수행함
- condition: (없음)

**how** Q1(xy): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 등식을 $X$에 대하여 정리하면 $$ 2X = 2A+4B \implies X = A+2B $$ $A$와 $B$를 대입하여 계산하면 $$ \begin{aligned} X &= (2x^2+xy-3y^2)+2(x^2-2xy+2y^2) \ &= 4x^2-3xy+y^2 \end{aligned} $$ 따라서 $a=4$, $b=-3$, $c=1$이므로 $a+b+c=4-3+1=2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.6점


**발문**

$x$에 대한 다항식 $x^3-2x^2+ax+7$을 $x+1$로 나누어떨어지게 하는 상수 $a$를 구하면?

**보기** ① $-4$  ② $-2$  ③ $2$  ④ $4$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $P(x)=x^3-2x^2+ax+7$이라 하면 $x+1$로 나누어떨어지므로 인수정리에 의하여 $P(-1)=0$이다.
2. $$ P(-1) = (-1)^3-2(-1)^2+a(-1)+7 = -1-2-a+7 = 4-a = 0 $$ 따라서 $a=4$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-REMAINDER_FACTOR(나머지정리와 인수정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$에 대한 다항식 $x^3-2x^2+ax+7$을 $」
**RPM** H1-RPM-009 [다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지] **원천→판정: 다항식 > 항등식과 나머지정리 > 인수정리 > 미정계수 결정 → 다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지**
- 이유: Q2(ax): 나머지정리와 인수정리 단원의 RPM H1-RPM-009 유형에 해당한다.
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=TPL_H1_IDENTITY_COEFFICIENT_COMPARE
- 이유: Q2(ax): 나머지정리와 인수정리 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(ax): 나머지정리와 인수정리 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $x^3-2x^2+ax+7$」
- goal: 상수←stem:「상수 $a$를 구하면?」
- method: 인수정리(NAMED)←solution:「인수정리에 의하여」
- condition: (없음)

**how** Q2(ax): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$P(x)=x^3-2x^2+ax+7$이라 하면 $x+1$로 나누어떨어지므로 인수정리에 의하여 $P(-1)=0$이다. $$ P(-1) = (-1)^3-2(-1)^2+a(-1)+7 = -1-2-a+7 = 4-a = 0 $$ 따라서 $a=4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.7점


**발문**

다음 등식 $(a-2)x+5=4x+b+1$이 $x$에 대한 항등식이 되도록 하는 상수 $a$, $b$에 대하여 $ab$의 값은?

**보기** ① $24$  ② $18$  ③ $12$  ④ $8$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x$에 대한 항등식이므로 양변의 $x$의 계수와 상수항이 각각 같다.
2. $$ a-2=4 \implies a=6, \qquad 5=b+1 \implies b=4 $$ 따라서 $ab=6\cdot 4=24$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-IDENTITY(항등식과 계수비교) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 등식 $(a-2)x+5=4x+b+1$이 $x$에 」
**RPM** H1-RPM-007 [다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법] (원천과 같음)
- 이유: Q3(ab): 항등식과 계수비교 단원의 RPM H1-RPM-007 유형에 해당한다.
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=TPL_H1_IDENTITY_COEFFICIENT_COMPARE (원천과 같음) (원천과 같음)
- 이유: Q3(ab): 항등식과 계수비교 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(ab): 항등식과 계수비교 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 항등식←stem:「$x$에 대한 항등식」
- goal: 상수←stem:「상수 $a$, $b$에 대하여」
- method: 계수비교(IMPLIED)←solution:「양변의 $x$의 계수와 상수항이 각각 같다」 — 항등식의 양변 동류항 계수를 비교하여 미정계수를 구함
- condition: (없음)

**how** Q3(ab): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x$에 대한 항등식이므로 양변의 $x$의 계수와 상수항이 각각 같다. $$ a-2=4 \implies a=6, \qquad 5=b+1 \implies b=4 $$ 따라서 $ab=6\cdot 4=24$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.7점


**발문**

$\dfrac{2x}{1+i}+2y=7-3i$를 만족시키는 실수 $x$, $y$에 대하여 $x+y$의 값은? (단, $i=\sqrt{-1}$)

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 분모의 켤레복소수 $1-i$를 분모와 분자에 곱하면 $$ \frac{2x}{1+i} = \frac{2x(1-i)}{(1+i)(1-i)} = \frac{2x(1-i)}{2} = x-xi $$ 주어진 식에 대입하면 $(x+2y)-xi = 7-3i$이다.
2. $x, y$가 실수이므로 실수부분과 허수부분을 비교하면 $-x=-3 \implies x=3$, $x+2y=7 \implies 3+2y=7 \implies y=2$이다.
3. 따라서 $x+y=3+2=5$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_BASIC(복소수의 뜻과 표현) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\dfrac{2x}{1+i}+2y=7-3i$를 만족시」
**RPM** H1-RPM-021 [방정식과 부등식 > 복소수 > 복소수의 뜻 > 실수부·허수부] **원천→판정: 방정식과 부등식 > 복소수 > 복소수의 뜻 > 서로 같은 복소수 → 방정식과 부등식 > 복소수 > 복소수의 뜻 > 실수부·허수부**
- 이유: Q4(xi): 복소수의 뜻과 표현 단원의 RPM H1-RPM-021 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=TPL_H1_COMPLEX_COMPONENT_OPERATION (원천과 같음) (원천과 같음)
- 이유: Q4(xi): 복소수의 뜻과 표현 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(xi): 복소수의 뜻과 표현 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 실수부분←solution:「실수부분과 허수부분을 비교하면」
- goal: 실수←stem:「실수 $x$, $y$에 대하여」
- method: 켤레복소수(NAMED)←solution:「분모의 켤레복소수 $1-i$」
- condition: (없음)

**how** Q4(xi): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

분모의 켤레복소수 $1-i$를 분모와 분자에 곱하면 $$ \frac{2x}{1+i} = \frac{2x(1-i)}{(1+i)(1-i)} = \frac{2x(1-i)}{2} = x-xi $$ 주어진 식에 대입하면 $(x+2y)-xi = 7-3i$이다. $x, y$가 실수이므로 실수부분과 허수부분을 비교하면 $-x=-3 \implies x=3$, $x+2y=7 \implies 3+2y=7 \implies y=2$이다. 따라서 $x+y=3+2=5$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.8점


**발문**

이차방정식 $x^2-3x+1=0$의 두 근을 $\alpha$, $\beta$라고 할 때, $\dfrac{\beta^2}{\alpha}+\dfrac{\alpha^2}{\beta}$의 값은?

**보기** ① $9$  ② $12$  ③ $18$  ④ $24$  ⑤ $27$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차방정식 $x^2-3x+1=0$에서 근과 계수의 관계에 의하여 $\alpha+\beta=3$, $\alpha\beta=1$이다. (12)
2. 구하는 식을 통분하면 $$ \frac{\beta^2}{\alpha}+\frac{\alpha^2}{\beta} = \frac{\alpha^3+\beta^3}{\alpha\beta} = \frac{(\alpha+\beta)^3-3\alpha\beta(\alpha+\beta)}{\alpha\beta} $$ 따라서 $\dfrac{3^3-3\cdot 1\cdot 3}{1} = 27-9 = 18$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차방정식 $x^2-3x+1=0$의 두 근을 $\alp」
**RPM** H1-RPM-029 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱] (원천과 같음)
- 이유: Q5(12): 근과 계수의 관계 단원의 RPM H1-RPM-029 유형에 해당한다.
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=TPL_H1_VIETA_SYMMETRIC_VALUE (원천과 같음) (원천과 같음)
- 이유: Q5(12): 근과 계수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(12): 근과 계수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2-3x+1=0$」
- goal: 대칭식←solution:「(\alpha+\beta)^3-3\alpha\beta(\alpha+\beta)」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여」
- condition: (없음)

**how** Q5(12): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

이차방정식 $x^2-3x+1=0$에서 근과 계수의 관계에 의하여 $\alpha+\beta=3$, $\alpha\beta=1$이다. 구하는 식을 통분하면 $$ \frac{\beta^2}{\alpha}+\frac{\alpha^2}{\beta} = \frac{\alpha^3+\beta^3}{\alpha\beta} = \frac{(\alpha+\beta)^3-3\alpha\beta(\alpha+\beta)}{\alpha\beta} $$ 따라서 $\dfrac{3^3-3\cdot 1\cdot 3}{1} = 27-9 = 18$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다항식 $(x+1)(x+3)(x+5)(x+7)+k$가 $x$에 대한 이차식의 제곱으로 인수분해되도록 하는 상수 $k$의 값은?

**보기** ① $4$  ② $16$  ③ $8$  ④ $12$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 상수항의 합이 같도록 두 일차식씩 짝지어 전개하면 $$ \begin{aligned} (x+1)(x+7) &= x^2+8x+7 \ (x+3)(x+5) &= x^2+8x+15 \end{aligned} $$ $t=x^2+8x+11$로 치환하면 주어진 식은 $(t-4)(t+4)+k = t^2-16+k$이다.
2. 이 식이 이차식의 제곱이 되려면 $-16+k=0$이어야 하므로 $k=16$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $(x+1)(x+3)(x+5)(x+7)+k$가 」
**RPM** H1-RPM-013 [다항식 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 다항식 > 인수분해 > 공통인수 > 단계적 인수분해 → 다항식 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: Q6(16): 인수분해 단원의 RPM H1-RPM-013 유형에 해당한다.
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=TPL_H1_FACTORIZATION_STANDARD (원천과 같음) (원천과 같음)
- 이유: Q6(16): 인수분해 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(16): 인수분해 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $(x+1)(x+3)(x+5)(x+7)+k$」
- goal: 완전제곱식←stem:「이차식의 제곱으로 인수분해」
- method: 인수분해(IMPLIED)←stem:「인수분해되도록」 — 두 일차식씩 짝지어 전개 후 치환하여 완전제곱식을 만듦
- condition: (없음)

**how** Q6(16): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

상수항의 합이 같도록 두 일차식씩 짝지어 전개하면 $$ \begin{aligned} (x+1)(x+7) &= x^2+8x+7 \ (x+3)(x+5) &= x^2+8x+15 \end{aligned} $$ $t=x^2+8x+11$로 치환하면 주어진 식은 $(t-4)(t+4)+k = t^2-16+k$이다. 이 식이 이차식의 제곱이 되려면 $-16+k=0$이어야 하므로 $k=16$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.9점


**발문**

$0$이 아닌 복소수 $z$와 그 켤레복소수 $\overline{z}$에 대하여 <보기>에서 옳은 것만을 있는 대로 고른 것은? <보기> ㄱ. $\dfrac{1}{z}+\dfrac{1}{\overline{z}}$는 실수이다. ㄴ. $z^2$이 실수이면 $(z-1)^2$도 실수이다. ㄷ. $(2+z)(2+\overline{z})$는 실수이다.

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄴ  ④ ㄱ, ㄷ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. - ㄱ.
2. $\dfrac{1}{z}+\dfrac{1}{\overline{z}} = \dfrac{z+\overline{z}}{z\overline{z}}$에서 분모 $z\overline{z}$는 $0$이 아닌 실수이고 분자 $z+\overline{z}$도 실수이므로 참이다.
3. - ㄴ.
4. $z=i$이면 $z^2=-1$은 실수이지만 $(z-1)^2=(i-1)^2=-2i$는 실수가 아니므로 거짓이다.
5. - ㄷ.
6. $\overline{2+z}=2+\overline{z}$이므로 $(2+z)(2+\overline{z})=(2+z)\overline{(2+z)}$는 실수이다.
7. (참) 따라서 옳은 것은 ㄱ, ㄷ이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$0$이 아닌 복소수 $z$와 그 켤레복소수 $\ove」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] **원천→판정: 방정식과 부등식 > 복소수 > 복소수의 연산 > 켤레복소수 → 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산**
- 이유: Q7(0): 복소수의 계산 단원의 RPM H1-RPM-023 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=TPL_H1_COMPLEX_CONJUGATE_NORM (원천과 같음) (원천과 같음)
- 이유: Q7(0): 복소수의 계산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(0): 복소수의 계산 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 복소수←stem:「$0$이 아닌 복소수 $z$」
- goal: 실수←stem:「실수이다」
- method: 켤레복소수(IMPLIED)←stem:「켤레복소수 $\overline{z}$」 — 복소수와 그 켤레복소수의 합과 곱이 항상 실수인 성질을 이용함
- condition: (없음)

**how** Q7(0): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

- ㄱ. $\dfrac{1}{z}+\dfrac{1}{\overline{z}} = \dfrac{z+\overline{z}}{z\overline{z}}$에서 분모 $z\overline{z}$는 $0$이 아닌 실수이고 분자 $z+\overline{z}$도 실수이므로 참이다.  
- ㄴ. $z=i$이면 $z^2=-1$은 실수이지만 $(z-1)^2=(i-1)^2=-2i$는 실수가 아니므로 거짓이다.  
- ㄷ. $\overline{2+z}=2+\overline{z}$이므로 $(2+z)(2+\overline{z})=(2+z)\overline{(2+z)}$는 실수이다. (참) 따라서 옳은 것은 ㄱ, ㄷ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.9점


**발문**

이차함수 $y=x^2+kx+5$의 그래프와 직선 $y=-4x+2$의 그래프가 접하도록 하는 모든 실수 $k$의 값의 합은?

**보기** ① $-8$  ② $-4$  ③ $0$  ④ $4$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 그래프가 접하려면 연립방정식 $x^2+kx+5=-4x+2$, 즉 $$ x^2+(k+4)x+3=0 $$ 이 중근을 가져야 하므로 판별식 $D=0$이다.
2. $$ D = (k+4)^2-4\cdot 1\cdot 3 = 0 \implies (k+4)^2=12 \implies k = -4\pm 2\sqrt{3} $$ 따라서 모든 실수 $k$의 값의 합은 $(-4+2\sqrt{3})+(-4-2\sqrt{3})=-8$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=x^2+kx+5$의 그래프와 직선 $y=」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 접선 조건 → 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점**
- 이유: Q8(kx): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_INTERSECTION_TANGENCY (원천과 같음) (원천과 같음)
- 이유: Q8(kx): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(kx): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2+kx+5$」<br>직선←stem:「직선 $y=-4x+2$」
- goal: 합←stem:「값의 합은?」
- method: 판별식(NAMED)←solution:「판별식 $D=0$」
- condition: 중근←solution:「중근을 가져야」

**how** Q8(kx): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 그래프가 접하려면 연립방정식 $x^2+kx+5=-4x+2$, 즉 $$ x^2+(k+4)x+3=0 $$ 이 중근을 가져야 하므로 판별식 $D=0$이다. $$ D = (k+4)^2-4\cdot 1\cdot 3 = 0 \implies (k+4)^2=12 \implies k = -4\pm 2\sqrt{3} $$ 따라서 모든 실수 $k$의 값의 합은 $(-4+2\sqrt{3})+(-4-2\sqrt{3})=-8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

연립부등식 $\begin{cases} x-2<3x+1 \ a-x\ge x \end{cases}$를 만족시키는 정수 $x$의 합이 $9$가 되도록 하는 정수 $a$의 최솟값은?

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 첫째 부등식 $x-2<3x+1$에서 $-3<2x$, 즉 $x>-\dfrac{3}{2}$이다. (cases)
2. 둘째 부등식 $a-x\ge x$에서 $2x\le a$, 즉 $x\le\dfrac{a}{2}$이다.
3. 따라서 연립부등식의 해는 $-\dfrac{3}{2}<x\le\dfrac{a}{2}$이고, 만족하는 정수는 $-1, 0, 1, \ldots, m$ ($m=\left\lfloor\dfrac{a}{2}\right\rfloor$)이다.
4. 이 정수들의 합이 $9$가 되려면 $$ (-1)+0+1+2+3+4 = 9 $$ 이어야 하므로 가장 큰 정수는 $m=4$이다.
5. 따라서 $4\le\dfrac{a}{2}<5$, 즉 $8\le a<10$이므로 정수 $a$의 최솟값은 $8$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-08(여러 가지 부등식) / H15-SA-08-SYSTEM_INEQUALITY(연립부등식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립부등식 $\begin{cases} x-2<3x+1 」
**RPM** H1-RPM-045 [방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위] **원천→판정: 방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 정수해 → 방정식과 부등식 > 여러 가지 부등식 > 연립일차부등식 > 해의 범위**
- 이유: Q9(cases): 연립부등식 단원의 RPM H1-RPM-045 유형에 해당한다.
**유형** PT=PT_H1_LINEAR_SYSTEM_INEQUALITY / TPL=TPL_H1_LINEAR_INEQUALITY_PARAMETER_INTEGER (원천과 같음) (원천과 같음)
- 이유: Q9(cases): 연립부등식 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(cases): 연립부등식 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 부등식←solution:「첫째 부등식」
- goal: 최솟값←stem:「정수 $a$의 최솟값은?」
- method: 정수(IMPLIED)←stem:「정수 $x$의 합이 $9$」 — 연립일차부등식의 해 범위 내 정수를 순서대로 더해 상한을 확정함
- condition: (없음)

**how** Q9(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째 부등식 $x-2<3x+1$에서 $-3<2x$, 즉 $x>-\dfrac{3}{2}$이다. 둘째 부등식 $a-x\ge x$에서 $2x\le a$, 즉 $x\le\dfrac{a}{2}$이다. 따라서 연립부등식의 해는 $-\dfrac{3}{2}<x\le\dfrac{a}{2}$이고, 만족하는 정수는 $-1, 0, 1, \ldots, m$ ($m=\left\lfloor\dfrac{a}{2}\right\rfloor$)이다. 이 정수들의 합이 $9$가 되려면 $$ (-1)+0+1+2+3+4 = 9 $$ 이어야 하므로 가장 큰 정수는 $m=4$이다. 따라서 $4\le\dfrac{a}{2}<5$, 즉 $8\le a<10$이므로 정수 $a$의 최솟값은 $8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

삼각형 $\mathrm{ABC}$의 세 변의 길이 $a$, $b$, $c$ 사이에 다음과 같은 관계가 성립할 때, 삼각형 $\mathrm{ABC}$는 어떤 삼각형인지 구하면? $$a^3+3a^2b+ab^2-ac^2-3bc^2+3b^3=0$$

**보기** ① $a=b$인 이등변삼각형  ② $b=c$인 이등변삼각형  ③ 빗변의 길이가 $c$인 직각삼각형  ④ 빗변의 길이가 $a$인 직각삼각형  ⑤ 정삼각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주어진 식을 차수가 가장 낮은 문자 $c$에 대하여 내림차순으로 정리하면 $$ \begin{aligned} -(a+3b)c^2+(a^3+3a^2b+ab^2+3b^3) &= -(a+3b)c^2+{a^2(a+3b)+b^2(a+3b)} \ &= (a+3b)(a^2+b^2-c^2) = 0 \end{aligned} $$ $a>0$, $b>0$이므로 $a+3b>0$이다.
2. 따라서 $a^2+b^2-c^2=0$, 즉 $a^2+b^2=c^2$이다.
3. 피타고라스 정리의 역에 의하여 삼각형 $\mathrm{ABC}$는 빗변의 길이가 $c$인 직각삼각형이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $\mathrm{ABC}$의 세 변의 길이 $a」
**RPM** H1-RPM-013 [다항식 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 다항식 > 인수분해 > 인수분해의 활용 > 조건식 → 다항식 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: Q10(ABC): 인수분해 단원의 RPM H1-RPM-013 유형에 해당한다.
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=TPL_H1_FACTORIZATION_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q10(ABC): 인수분해 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(ABC): 인수분해 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 삼각형←stem:「삼각형 $\mathrm{ABC}$의 세 변」
- goal: 직각삼각형←solution:「빗변의 길이가 $c$인 직각삼각형」
- method: 인수분해(IMPLIED)←solution:「(a+3b)(a^2+b^2-c^2) = 0」 — 낮은 차수 문자 c에 대해 정리해 공통인수 (a+3b)로 인수분해함
- condition: 피타고라스정리←solution:「피타고라스 정리의 역에 의하여」

**how** Q10(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식을 차수가 가장 낮은 문자 $c$에 대하여 내림차순으로 정리하면 $$ \begin{aligned} -(a+3b)c^2+(a^3+3a^2b+ab^2+3b^3) &= -(a+3b)c^2+{a^2(a+3b)+b^2(a+3b)} \ &= (a+3b)(a^2+b^2-c^2) = 0 \end{aligned} $$ $a>0$, $b>0$이므로 $a+3b>0$이다. 따라서 $a^2+b^2-c^2=0$, 즉 $a^2+b^2=c^2$이다. 피타고라스 정리의 역에 의하여 삼각형 $\mathrm{ABC}$는 빗변의 길이가 $c$인 직각삼각형이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

$-3\le x\le 0$에서 이차함수 $y=-x^2-4x+k$의 최솟값이 $-2$일 때, 이 이차함수의 최댓값은? (단, $k$는 상수이다.)

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 완전제곱식으로 변형하면 $$ y = -x^2-4x+k = -(x+2)^2+k+4 $$ 위로 볼록하고 꼭짓점의 $x$좌표 $-2$가 구간 $-3\le x\le 0$에 포함되므로 최댓값은 $k+4$이다.
2. 구간의 양 끝점에서의 함숫값은 $x=-3$일 때 $k+3$, $x=0$일 때 $k$이므로 최솟값은 $k$이다.
3. 최솟값이 $-2$이므로 $k=-2$이고, 따라서 최댓값은 $-2+4=2$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-3\le x\le 0$에서 이차함수 $y=-x^2-」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] (원천과 같음)
- 이유: Q11(3): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL (원천과 같음) (원천과 같음)
- 이유: Q11(3): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(3): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=-x^2-4x+k$」
- goal: 최댓값←stem:「이 이차함수의 최댓값은?」
- method: 완전제곱식(NAMED)←solution:「완전제곱식으로 변형하면」
- condition: 최솟값←stem:「최솟값이 $-2$일 때」

**how** Q11(3): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

완전제곱식으로 변형하면 $$ y = -x^2-4x+k = -(x+2)^2+k+4 $$ 위로 볼록하고 꼭짓점의 $x$좌표 $-2$가 구간 $-3\le x\le 0$에 포함되므로 최댓값은 $k+4$이다. 구간의 양 끝점에서의 함숫값은 $x=-3$일 때 $k+3$, $x=0$일 때 $k$이므로 최솟값은 $k$이다. 최솟값이 $-2$이므로 $k=-2$이고, 따라서 최댓값은 $-2+4=2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

삼차방정식 $x^3+ax^2+bx-15=0$의 한 근이 $1+2i$일 때, 실수 $a$, $b$에 대하여 $a+b$의 값은? (단, $i=\sqrt{-1}$)

**보기** ① $4$  ② $6$  ③ $8$  ④ $10$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 계수가 모두 실수이므로 $1+2i$가 근이면 켤레복소수 $1-2i$도 근이다. (ax)
2. 두 근 $1\pm 2i$를 갖는 이차식은 $(x-1)^2+4=x^2-2x+5$이다.
3. 나머지 한 실근을 $r$라 두면 상수항 비교에서 $(-r)\cdot 5=-15 \implies r=3$이다.
4. 따라서 $$ (x^2-2x+5)(x-3) = x^3-5x^2+11x-15 $$ 이므로 $a=-5$, $b=11$이고 $a+b=-5+11=6$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_ROOT(복소수와 이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼차방정식 $x^3+ax^2+bx-15=0$의 한 근이」
**RPM** H1-RPM-031 [방정식과 부등식 > 이차방정식 > 복소수 근 > 허근] (원천과 같음)
- 이유: Q12(ax): 복소수와 이차방정식 단원의 RPM H1-RPM-031 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_CONDITION_EQUATION / TPL=TPL_H1_COMPLEX_CONJUGATE_ROOT_EQUATION (원천과 같음) (원천과 같음)
- 이유: Q12(ax): 복소수와 이차방정식 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(ax): 복소수와 이차방정식 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 삼차방정식←stem:「삼차방정식 $x^3+ax^2+bx-15=0$」
- goal: 실수←stem:「실수 $a$, $b$에 대하여」
- method: 켤레복소수(NAMED)←solution:「켤레복소수 $1-2i$도 근이다」
- condition: (없음)

**how** Q12(ax): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

계수가 모두 실수이므로 $1+2i$가 근이면 켤레복소수 $1-2i$도 근이다. 두 근 $1\pm 2i$를 갖는 이차식은 $(x-1)^2+4=x^2-2x+5$이다. 나머지 한 실근을 $r$라 두면 상수항 비교에서 $(-r)\cdot 5=-15 \implies r=3$이다. 따라서 $$ (x^2-2x+5)(x-3) = x^3-5x^2+11x-15 $$ 이므로 $a=-5$, $b=11$이고 $a+b=-5+11=6$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.1점


**발문**

자연수 $n$에 대하여 $f(n)=i^n+\dfrac{1}{i^{n+1}}$이라 할 때, $f(1)+f(2)+f(3)+\cdots+f(58)$의 값은? (단, $i=\sqrt{-1}$이다.)

**보기** ① $-2-2i$  ② $-1+i$  ③ $0$  ④ $-2+2i$  ⑤ $2-2i$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $f(n)=i^n+\dfrac{1}{i^{n+1}}$의 처음 네 항을 계산하면 $$ \begin{aligned} f(1) &= i+\frac{1}{i^2} = -1+i \ f(2) &= -1+\frac{1}{i^3} = -1+i \ f(3) &= -i+\frac{1}{i^4} = 1-i \ f(4) &= 1+\frac{1}{i^5} = 1-i \end{aligned} $$ 주기가 $4$이고 한 주기의 합은 $f(1)+f(2)+f(3)+f(4)=0$이다.
2. $58=4\cdot 14+2$이므로 $$ f(1)+\cdots+f(58) = f(1)+f(2) = (-1+i)+(-1+i) = -2+2i $$ 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「자연수 $n$에 대하여 $f(n)=i^n+\dfrac{」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] **원천→판정: 방정식과 부등식 > 복소수 > i의 거듭제곱 > 주기성 → 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산**
- 이유: Q13(58): 복소수의 계산 단원의 RPM H1-RPM-023 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_POWER_ROOT / TPL=TPL_H1_COMPLEX_I_PERIOD (원천과 같음) (원천과 같음)
- 이유: Q13(58): 복소수의 계산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(58): 복소수의 계산 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 자연수←stem:「자연수 $n$에 대하여」
- goal: 합←solution:「한 주기의 합은」
- method: 복소수(IMPLIED)←solution:「주기가 $4$이고」 — 허수단위 i의 거듭제곱이 주기 4로 순환하는 성질을 이용함
- condition: (없음)

**how** Q13(58): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(n)=i^n+\dfrac{1}{i^{n+1}}$의 처음 네 항을 계산하면 $$ \begin{aligned} f(1) &= i+\frac{1}{i^2} = -1+i \ f(2) &= -1+\frac{1}{i^3} = -1+i \ f(3) &= -i+\frac{1}{i^4} = 1-i \ f(4) &= 1+\frac{1}{i^5} = 1-i \end{aligned} $$ 주기가 $4$이고 한 주기의 합은 $f(1)+f(2)+f(3)+f(4)=0$이다. $58=4\cdot 14+2$이므로 $$ f(1)+\cdots+f(58) = f(1)+f(2) = (-1+i)+(-1+i) = -2+2i $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.1점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

삼차방정식 $x^3-11x+20=0$의 한 허근을 $\omega$라고 할 때, $(\omega^3-10\omega+17)(\overline{\omega}^3-10\overline{\omega}+17)$의 값은? (단, $\overline{\omega}$는 $\omega$의 켤레복소수이다.)

**보기** ① $1$  ② $10$  ③ $5$  ④ $8$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 허근 $\omega$는 방정식의 근이므로 $\omega^3=11\omega-20$이다.
2. 이를 대입해 차수를 낮추면 $$ \omega^3-10\omega+17 = (11\omega-20)-10\omega+17 = \omega-3 $$ 마찬가지로 $\overline{\omega}^3-10\overline{\omega}+17=\overline{\omega}-3$이다.
3. 한편 $x^3-11x+20=(x+4)(x^2-4x+5)=0$이므로 두 허근 $\omega, \overline{\omega}$는 $x^2-4x+5=0$의 두 근 $2\pm i$이다.
4. 따라서 $$ (\omega-3)(\overline{\omega}-3) = (-1+i)(-1-i) = 1+1 = 2 $$ 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-07(여러 가지 방정식) / H15-SA-07-HIGHER_EQUATION(고차방정식의 풀이) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼차방정식 $x^3-11x+20=0$의 한 허근을 $\」
**RPM** H1-RPM-039 [방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형] **원천→판정: 방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 치환형 → 방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형**
- 이유: Q14(11): 고차방정식의 풀이 단원의 RPM H1-RPM-039 유형에 해당한다.
**유형** PT=PT_H1_HIGHER_DEGREE_EQUATION / TPL=TPL_H1_HIGHER_SUBSTITUTION_REDUCTION (원천과 같음) (원천과 같음)
- 이유: Q14(11): 고차방정식의 풀이 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(11): 고차방정식의 풀이 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 삼차방정식←stem:「삼차방정식 $x^3-11x+20=0$」
- goal: 곱←solution:「(\omega-3)(\overline{\omega}-3)」
- method: 인수분해(IMPLIED)←solution:「(x+4)(x^2-4x+5)=0」 — 차수를 낮춘 뒤 삼차식을 인수분해해 허근이 속한 이차식을 구함
- condition: 허근←stem:「한 허근을 $\omega$」

**how** Q14(11): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

허근 $\omega$는 방정식의 근이므로 $\omega^3=11\omega-20$이다. 이를 대입해 차수를 낮추면 $$ \omega^3-10\omega+17 = (11\omega-20)-10\omega+17 = \omega-3 $$ 마찬가지로 $\overline{\omega}^3-10\overline{\omega}+17=\overline{\omega}-3$이다. 한편 $x^3-11x+20=(x+4)(x^2-4x+5)=0$이므로 두 허근 $\omega, \overline{\omega}$는 $x^2-4x+5=0$의 두 근 $2\pm i$이다. 따라서 $$ (\omega-3)(\overline{\omega}-3) = (-1+i)(-1-i) = 1+1 = 2 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.2점


**발문**

이차방정식 $x^2+11x+9=0$의 두 근을 $\alpha$, $\beta$라 할 때, $(\sqrt{\alpha}-\sqrt{\beta})^2$의 값은?

**보기** ① $-17$  ② $-11$  ③ $-5$  ④ $1$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 근과 계수의 관계에서 $\alpha+\beta=-11<0$, $\alpha\beta=9>0$이고 판별식 $D=121-36=85>0$이므로 두 근 $\alpha, \beta$는 모두 음수이다.
2. 음수의 제곱근 성질에 의하여 $\sqrt{\alpha}\sqrt{\beta}=-\sqrt{\alpha\beta}=-\sqrt{9}=-3$이다.
3. 따라서 $$ (\sqrt{\alpha}-\sqrt{\beta})^2 = \alpha+\beta-2\sqrt{\alpha}\sqrt{\beta} = -11-2(-3) = -5 $$ 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차방정식 $x^2+11x+9=0$의 두 근을 $\al」
**RPM** H1-RPM-029 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱] (원천과 같음)
- 이유: Q15(11): 근과 계수의 관계 단원의 RPM H1-RPM-029 유형에 해당한다.
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=TPL_H1_VIETA_SYMMETRIC_VALUE (원천과 같음) (원천과 같음)
- 이유: Q15(11): 근과 계수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(11): 근과 계수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2+11x+9=0$」
- goal: 제곱근←solution:「음수의 제곱근 성질」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에서」
- condition: 판별식←solution:「판별식 $D=121-36=85>0$」

**how** Q15(11): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

근과 계수의 관계에서 $\alpha+\beta=-11<0$, $\alpha\beta=9>0$이고 판별식 $D=121-36=85>0$이므로 두 근 $\alpha, \beta$는 모두 음수이다. 음수의 제곱근 성질에 의하여 $\sqrt{\alpha}\sqrt{\beta}=-\sqrt{\alpha\beta}=-\sqrt{9}=-3$이다. 따라서 $$ (\sqrt{\alpha}-\sqrt{\beta})^2 = \alpha+\beta-2\sqrt{\alpha}\sqrt{\beta} = -11-2(-3) = -5 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.2점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

오른쪽 그림과 같이 반지름의 길이가 $5$인 원에 둘레의 길이가 $28$인 직사각형이 내접할 때, 이 직사각형의 긴 변의 길이는?

**보기** ① $6$  ② $8$  ③ $7$  ④ $9$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원에 내접하는 직사각형의 대각선의 길이는 원의 지름 $10$과 같다.
2. 직사각형의 가로와 세로의 길이를 $a, b$라 하면 둘레가 $28$이므로 $2(a+b)=28 \implies a+b=14$이다.
3. 피타고라스 정리에 의해 $a^2+b^2=10^2=100$이므로 $$ (a+b)^2 = a^2+b^2+2ab \implies 196 = 100+2ab \implies ab = 48 $$ 따라서 $a, b$는 $t^2-14t+48=(t-6)(t-8)=0$의 두 근 $6, 8$이므로 긴 변의 길이는 $8$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_BASIC(다항식의 기본 연산) (원천과 같음) (원천과 같음)
- 근거 인용: 「오른쪽 그림과 같이 반지름의 길이가 $5$인 원에 둘레」
**RPM** H1-RPM-001 [다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리] **원천→판정: 다항식 > 다항식의 연산 > 다항식의 곱셈 > 곱셈공식 → 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리**
- 이유: Q16(28): 다항식의 기본 연산 단원의 RPM H1-RPM-001 유형에 해당한다.
**유형** PT=PT_H1_POLY_FORMULA_SYMMETRIC / TPL=TPL_H1_FORMULA_SYMMETRIC (원천과 같음) (원천과 같음)
- 이유: Q16(28): 다항식의 기본 연산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(28): 다항식의 기본 연산 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 원←stem:「반지름의 길이가 $5$인 원에」
- goal: 직사각형←stem:「직사각형의 긴 변의 길이는?」
- method: 피타고라스정리(NAMED)←solution:「피타고라스 정리에 의해」
- condition: 반지름←stem:「반지름의 길이가 $5$인」

**how** Q16(28): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원에 내접하는 직사각형의 대각선의 길이는 원의 지름 $10$과 같다. 직사각형의 가로와 세로의 길이를 $a, b$라 하면 둘레가 $28$이므로 $2(a+b)=28 \implies a+b=14$이다. 피타고라스 정리에 의해 $a^2+b^2=10^2=100$이므로 $$ (a+b)^2 = a^2+b^2+2ab \implies 196 = 100+2ab \implies ab = 48 $$ 따라서 $a, b$는 $t^2-14t+48=(t-6)(t-8)=0$의 두 근 $6, 8$이므로 긴 변의 길이는 $8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.3점


**발문**

다항식 $f(x)=x^4-3ax^3+5x-2-3a$에 대하여 다항식 $f(x+1)f(x+2)$가 $x+2$로 나누어떨어질 때, 다항식 $f(x)$를 $x-1$로 나누었을 때의 나머지를 구하시오. (단, $a$는 상수이다.)

**보기** ① $2$  ② $4$  ③ $6$  ④ $8$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $f(x+1)f(x+2)$가 $x+2$로 나누어떨어지므로 $x=-2$를 대입하면 $f(-1)f(0)=0$이다. (ax)
2. 먼저 $f(-1)$을 계산하면 $$ f(-1) = (-1)^4-3a(-1)^3+5(-1)-2-3a = 1+3a-5-2-3a = -6 \ne 0 $$ 이므로 반드시 $f(0)=0$이어야 한다.
3. $f(0)=-2-3a=0$에서 $a=-\dfrac{2}{3}$이다.
4. 따라서 $f(x)$를 $x-1$로 나눈 나머지는 $$ f(1) = 1-3a+5-2-3a = 4-6a = 4-6\left(-\frac{2}{3}\right) = 4+4 = 8 $$ 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-IDENTITY(항등식과 계수비교) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $f(x)=x^4-3ax^3+5x-2-3a$에 」
**RPM** H1-RPM-007 [다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법] **원천→판정: 다항식 > 항등식과 나머지정리 > 항등식 > 수치대입법 → 다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법**
- 이유: Q17(ax): 항등식과 계수비교 단원의 RPM H1-RPM-007 유형에 해당한다.
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=TPL_H1_IDENTITY_SPECIAL_VALUE (원천과 같음) (원천과 같음)
- 이유: Q17(ax): 항등식과 계수비교 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(ax): 항등식과 계수비교 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $f(x)=x^4-3ax^3+5x-2-3a$」
- goal: 나머지←stem:「나누었을 때의 나머지를 구하시오」
- method: 나머지정리(IMPLIED)←solution:「나눈 나머지는」 — x=-2 대입으로 f(-1)f(0)=0을 얻고 나머지정리로 f(1)을 구함
- condition: (없음)

**how** Q17(ax): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x+1)f(x+2)$가 $x+2$로 나누어떨어지므로 $x=-2$를 대입하면 $f(-1)f(0)=0$이다. 먼저 $f(-1)$을 계산하면 $$ f(-1) = (-1)^4-3a(-1)^3+5(-1)-2-3a = 1+3a-5-2-3a = -6 \ne 0 $$ 이므로 반드시 $f(0)=0$이어야 한다. $f(0)=-2-3a=0$에서 $a=-\dfrac{2}{3}$이다. 따라서 $f(x)$를 $x-1$로 나눈 나머지는 $$ f(1) = 1-3a+5-2-3a = 4-6a = 4-6\left(-\frac{2}{3}\right) = 4+4 = 8 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

오른쪽 그림과 같이 $\angle A=90^\circ$, $\angle B=60^\circ$이고 $\overline{AB}=10$인 직각삼각형 $ABC$가 있다. 변 $AB$ 위의 한 점 $P$에서 변 $BC$에 내린 수선의 발을 $Q$라 하고, 점 $P$를 지나고 변 $BC$와 평행한 직선이 변 $AC$와 만나는 점을 $R$이라 하자. 사각형 $PQCR$의 넓이의 최댓값을 구하면? (단, 점 $P$는 꼭짓점 $A$와 꼭짓점 $B$가 아니다.)

**보기** ① $40\sqrt{3}$  ② $20\sqrt{3}$  ③ $30\sqrt{3}$  ④ $32\sqrt{3}$  ⑤ $48\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $A(0, 0)$, $B(10, 0)$, $C(0, 10\sqrt{3})$으로 좌표를 잡고 $P(p, 0)$ ($0<p<10$)이라 두자.
2. 직선 $PR$은 $BC$와 평행하고 $\triangle APR$는 $\angle A=90^\circ, \angle P=60^\circ$인 직각삼각형이므로 $\overline{PR}=2p$이다.
3. 한편 $\overline{PB}=10-p$이고 $\triangle PQB$에서 $\angle B=60^\circ, \angle Q=90^\circ$이므로 $$ \overline{PQ} = \frac{\sqrt{3}}{2}(10-p), \qquad \overline{BQ} = \frac{10-p}{2} $$ $\overline{BC}=20$이므로 $\overline{QC}=20-\dfrac{10-p}{2}=\dfrac{p+30}{2}$이다.
4. 사다리꼴 $PQCR$의 넓이 $S(p)$는 $$ \begin{aligned} S(p) &= \frac{1}{2}(\overline{PR}+\overline{QC})\cdot\overline{PQ} \ &= \frac{1}{2}\left(2p+\frac{p+30}{2}\right)\cdot\frac{\sqrt{3}(10-p)}{2} \ &= \frac{5\sqrt{3}}{8}(p+6)(10-p) \ &= \frac{5\sqrt{3}}{8}{64-(p-2)^2} \end{aligned} $$ $0<p<10$에서 $p=2$일 때 최댓값은 $\dfrac{5\sqrt{3}}{8}\cdot 64 = 40\sqrt{3}$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「오른쪽 그림과 같이 $\angle A=90^\circ$」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용 → 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소**
- 이유: Q18(90): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_MODEL (원천과 같음) (원천과 같음)
- 이유: Q18(90): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(90): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: 수선←stem:「내린 수선의 발을 $Q$」
- goal: 최댓값←stem:「넓이의 최댓값을 구하면?」
- method: 직각삼각형(IMPLIED)←stem:「직각삼각형 $ABC$가 있다」 — 60도 특수각 직각삼각형의 길이 비로 사다리꼴 변과 높이를 표현해 넓이 이차함수를 세움
- condition: 넓이←stem:「사각형 $PQCR$의 넓이」

**how** Q18(90): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$A(0, 0)$, $B(10, 0)$, $C(0, 10\sqrt{3})$으로 좌표를 잡고 $P(p, 0)$ ($0<p<10$)이라 두자. 직선 $PR$은 $BC$와 평행하고 $\triangle APR$는 $\angle A=90^\circ, \angle P=60^\circ$인 직각삼각형이므로 $\overline{PR}=2p$이다. 한편 $\overline{PB}=10-p$이고 $\triangle PQB$에서 $\angle B=60^\circ, \angle Q=90^\circ$이므로 $$ \overline{PQ} = \frac{\sqrt{3}}{2}(10-p), \qquad \overline{BQ} = \frac{10-p}{2} $$ $\overline{BC}=20$이므로 $\overline{QC}=20-\dfrac{10-p}{2}=\dfrac{p+30}{2}$이다. 사다리꼴 $PQCR$의 넓이 $S(p)$는 $$ \begin{aligned} S(p) &= \frac{1}{2}(\overline{PR}+\overline{QC})\cdot\overline{PQ} \ &= \frac{1}{2}\left(2p+\frac{p+30}{2}\right)\cdot\frac{\sqrt{3}(10-p)}{2} \ &= \frac{5\sqrt{3}}{8}(p+6)(10-p) \ &= \frac{5\sqrt{3}}{8}{64-(p-2)^2} \end{aligned} $$ $0<p<10$에서 $p=2$일 때 최댓값은 $\dfrac{5\sqrt{3}}{8}\cdot 64 = 40\sqrt{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.4점


**발문**

그림과 같이 이차함수 $y=x^2$의 그래프와 직선 $y=ax+8$이 만나는 두 점을 각각 $A$, $B$라 하고, 점 $A$와 $B$에서 $x$축에 내린 수선의 발을 $C$, $D$라 하자. 삼각형 $AOC$의 넓이를 $S_1$, 삼각형 $DOB$의 넓이를 $S_2$라 할 때, $S_1:S_2=8:1$을 만족시키는 양수 $a$의 값은? (단, $O$는 원점이고, 두 점 $A$, $B$는 각각 제1사분면과 제2사분면 위에 있다.)

**보기** ① $1$  ② $\dfrac{3}{2}$  ③ $2$  ④ $\dfrac{5}{2}$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 $A$의 $x$좌표를 $u>0$, 점 $B$의 $x$좌표를 $-v<0$ ($v>0$)이라 두면 두 점은 $y=x^2$ 위의 점이므로 $A(u, u^2)$, $B(-v, v^2)$이다.
2. 삼각형 $AOC$와 $DOB$의 넓이는 각각 $$ S_1 = \frac{1}{2}\cdot u\cdot u^2 = \frac{1}{2}u^3, \qquad S_2 = \frac{1}{2}\cdot v\cdot v^2 = \frac{1}{2}v^3 $$ $S_1:S_2=8:1$이므로 $u^3:v^3=8:1 \implies u:v=2:1$, 즉 $u=2v$이다.
3. 한편 $u$와 $-v$는 방정식 $x^2=ax+8 \implies x^2-ax-8=0$의 두 근이므로 근과 계수의 관계에 의해 $$ u(-v) = -8 \implies uv = 8 $$ $u=2v$를 대입하면 $2v^2=8 \implies v=2$ ($v>0$), $u=4$이다.
4. 따라서 두 근의 합 $a = u+(-v) = 4-2 = 2$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「그림과 같이 이차함수 $y=x^2$의 그래프와 직선 $」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > 판별식과 위치 → 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점**
- 이유: Q19(ax): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY (원천과 같음) (원천과 같음)
- 이유: Q19(ax): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(ax): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2$의 그래프」<br>직선←stem:「직선 $y=ax+8$」
- goal: 넓이←stem:「삼각형 $AOC$의 넓이」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의해」
- condition: 수선←stem:「내린 수선의 발을 $C$, $D$」

**how** Q19(ax): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $A$의 $x$좌표를 $u>0$, 점 $B$의 $x$좌표를 $-v<0$ ($v>0$)이라 두면 두 점은 $y=x^2$ 위의 점이므로 $A(u, u^2)$, $B(-v, v^2)$이다. 삼각형 $AOC$와 $DOB$의 넓이는 각각 $$ S_1 = \frac{1}{2}\cdot u\cdot u^2 = \frac{1}{2}u^3, \qquad S_2 = \frac{1}{2}\cdot v\cdot v^2 = \frac{1}{2}v^3 $$ $S_1:S_2=8:1$이므로 $u^3:v^3=8:1 \implies u:v=2:1$, 즉 $u=2v$이다. 한편 $u$와 $-v$는 방정식 $x^2=ax+8 \implies x^2-ax-8=0$의 두 근이므로 근과 계수의 관계에 의해 $$ u(-v) = -8 \implies uv = 8 $$ $u=2v$를 대입하면 $2v^2=8 \implies v=2$ ($v>0$), $u=4$이다. 따라서 두 근의 합 $a = u+(-v) = 4-2 = 2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.4점


**발문**

원가가 $200$원인 어느 간식의 가격과 예상 판매량은 다음 표와 같다. 가격이 $50$원 오를 때마다 판매량이 $100$개씩 감소할 때, 이 간식을 팔아 얻을 수 있는 최대 이익을 구하면?

| 가격(원) | $200$ | $250$ | $300$ | $350$ |
| :---- | :---- | :---- | :---- | :---- |
| 예상 판매량(개) | $1200$ | $1100$ | $1000$ | $900$ |

**보기** ① $150000$원  ② $160000$원  ③ $170000$원  ④ $175000$원  ⑤ $180000$원

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 가격을 $200+50t$원 ($0\le t\le 12$)이라 두면 예상 판매량은 $1200-100t$개이고, 원가가 $200$원이므로 $1$개당 이익은 $50t$원이다.
2. 따라서 총이익 $P(t)$는 $$ \begin{aligned} P(t) &= 50t(1200-100t) \ &= -5000t^2+60000t \ &= -5000(t^2-12t) \ &= -5000(t-6)^2+180000 \end{aligned} $$ $t=6$은 $0\le t\le 12$에 포함되므로 최대 이익은 $180000$원이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「원가가 $200$원인 어느 간식의 가격과 예상 판매량은」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용 → 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소**
- 이유: Q20(200): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_MODEL (원천과 같음) (원천과 같음)
- 이유: Q20(200): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(200): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차함수←solution:「P(t) &= 50t(1200-100t)」
- goal: 최댓값←solution:「최대 이익」
- method: 완전제곱식(IMPLIED)←solution:「-5000(t-6)^2+180000」 — 총이익 이차함수를 완전제곱식으로 변형해 최댓값을 구함
- condition: (없음)

**how** Q20(200): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

가격을 $200+50t$원 ($0\le t\le 12$)이라 두면 예상 판매량은 $1200-100t$개이고, 원가가 $200$원이므로 $1$개당 이익은 $50t$원이다. 따라서 총이익 $P(t)$는 $$ \begin{aligned} P(t) &= 50t(1200-100t) \ &= -5000t^2+60000t \ &= -5000(t^2-12t) \ &= -5000(t-6)^2+180000 \end{aligned} $$ $t=6$은 $0\le t\le 12$에 포함되므로 최대 이익은 $180000$원이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 6점


**발문**

이차함수 $y=f(x)$의 그래프가 그림과 같이 $x$축과 두 점 $(-4, 0)$, $(2, 0)$에서 만나고 이 이차함수의 최솟값이 $-9$일 때, $f(4)$를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $16$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x$축과 두 점 $(-4, 0)$, $(2, 0)$에서 만나므로 이차함수를 $f(x)=a(x+4)(x-2)$ ($a>0$)로 놓을 수 있다.
2. 대칭축은 $x=\dfrac{-4+2}{2}=-1$이므로 꼭짓점 $x=-1$에서 최솟값 $-9$를 갖는다.
3. $$ f(-1) = a(-1+4)(-1-2) = -9a = -9 \implies a = 1 $$ 따라서 $f(x)=(x+4)(x-2)$이므로 $$ f(4) = (4+4)(4-2) = 8\cdot 2 = 16 $$ 이다.
- 작성자 답: $16$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=f(x)$의 그래프가 그림과 같이 $x$」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] (원천과 같음)
- 이유: Q21(16): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL (원천과 같음) (원천과 같음)
- 이유: Q21(16): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21(16): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 교점←stem:「$x$축과 두 점 $(-4, 0)$, $(2, 0)$에서」
- goal: 이차함수←stem:「이차함수 $y=f(x)$의 그래프」
- method: 인수정리(IMPLIED)←solution:「f(x)=a(x+4)(x-2)」 — x축과의 두 교점으로부터 이차함수를 인수분해 꼴로 설정함
- condition: 최솟값←stem:「최솟값이 $-9$일 때」

**how** Q21(16): 발문과 해설의 풀이 과정을 점검하여 정답 $16$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x$축과 두 점 $(-4, 0)$, $(2, 0)$에서 만나므로 이차함수를 $f(x)=a(x+4)(x-2)$ ($a>0$)로 놓을 수 있다. 대칭축은 $x=\dfrac{-4+2}{2}=-1$이므로 꼭짓점 $x=-1$에서 최솟값 $-9$를 갖는다. $$ f(-1) = a(-1+4)(-1-2) = -9a = -9 \implies a = 1 $$ 따라서 $f(x)=(x+4)(x-2)$이므로 $$ f(4) = (4+4)(4-2) = 8\cdot 2 = 16 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 7점


**발문**

이차함수 $y=x^2+3a$의 그래프와 직선 $y=2ax-a^2$의 서로 다른 두 교점의 $x$좌표의 곱이 $10$일 때, 상수 $a$를 구하고 이 두 교점의 $x$좌표의 합을 $b$라고 할 때, $b$를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $a=-5,; b=-10$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 그래프의 교점의 $x$좌표는 연립방정식 $x^2+3a=2ax-a^2$, 즉 $$ x^2-2ax+a^2+3a=0 $$ 의 두 실근이다.
2. 두 근의 곱이 $10$이므로 근과 계수의 관계에 의해 $a^2+3a=10$, 즉 $$ a^2+3a-10 = (a+5)(a-2) = 0 \implies a=-5 \text{ 또는 } a=2 $$ 한편 두 교점이 서로 달라야 하므로 판별식 $D>0$이어야 한다.
3. $$ \frac{D}{4} = (-a)^2-(a^2+3a) = -3a > 0 \implies a < 0 $$ 따라서 $a=-5$이다.
4. 이때 두 교점의 $x$좌표의 합 $b$는 근과 계수의 관계에 의해 $b=2a=2(-5)=-10$이다.
- 작성자 답: $a=-5,; b=-10$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=x^2+3a$의 그래프와 직선 $y=2a」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 교점 개수 → 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점**
- 이유: Q22(ax): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_INTERSECTION_TANGENCY (원천과 같음) (원천과 같음)
- 이유: Q22(ax): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22(ax): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2+3a$」<br>직선←stem:「직선 $y=2ax-a^2$」
- goal: 교점←stem:「서로 다른 두 교점의」
- method: 판별식(NAMED)←solution:「판별식 $D>0$」
- condition: 근과계수의관계←solution:「근과 계수의 관계에 의해」

**how** Q22(ax): 발문과 해설의 풀이 과정을 점검하여 정답 $a=-5,; b=-10$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 그래프의 교점의 $x$좌표는 연립방정식 $x^2+3a=2ax-a^2$, 즉 $$ x^2-2ax+a^2+3a=0 $$ 의 두 실근이다. 두 근의 곱이 $10$이므로 근과 계수의 관계에 의해 $a^2+3a=10$, 즉 $$ a^2+3a-10 = (a+5)(a-2) = 0 \implies a=-5 \text{ 또는 } a=2 $$ 한편 두 교점이 서로 달라야 하므로 판별식 $D>0$이어야 한다. $$ \frac{D}{4} = (-a)^2-(a^2+3a) = -3a > 0 \implies a < 0 $$ 따라서 $a=-5$이다. 이때 두 교점의 $x$좌표의 합 $b$는 근과 계수의 관계에 의해 $b=2a=2(-5)=-10$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 7점


**발문**

최고차항의 계수가 양수인 두 다항식 $f(x)$, $g(x)$가 다음 조건을 만족시킨다. <보기> (가) $f(x)$를 $9x^2+g(x)$로 나눈 몫은 $x-1$이고 나머지는 $9x^2-{g(x)}^2$이다. (나) $f(x)$를 $g(x)$로 나눈 나머지는 $\dfrac{1}{3}$이다. $f(-1)$의 값을 구하시오. (단, $f(x)$와 $g(x)$의 계수는 모두 실수이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-17$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 조건 (가)에서 $f(x)=(x-1){9x^2+g(x)}+9x^2-{g(x)}^2$이다.
2. 나머지 $9x^2-{g(x)}^2$의 차수는 나누는 식 $9x^2+g(x)$의 차수보다 낮아야 한다.
3. 만약 $g(x)$가 $2$차 이상이면 ${g(x)}^2$의 차수가 $9x^2+g(x)$보다 크고, $g(x)$가 상수이면 나머지의 $9x^2$항이 남아 나누는 식과 차수가 같아져 모순이다.
4. 따라서 $g(x)$는 일차식 $g(x)=mx+n$ ($m>0$)이다.
5. 나머지 $9x^2-(mx+n)^2=(9-m^2)x^2-2mnx-n^2$의 차수가 $2$보다 작아야 하므로 $9-m^2=0$, $m>0$에서 $m=3$이다.
6. 즉 $g(x)=3x+n$이다.
7. 이제 조건 (가)를 정리하면 $$ \begin{aligned} f(x) &= 9x^3-9x^2+(x-1)g(x)+9x^2-{g(x)}^2 \ &= 9x^3+(x-1)g(x)-{g(x)}^2 \end{aligned} $$ 조건 (나)에서 $f(x)$를 $g(x)=3x+n$으로 나눈 나머지가 $\dfrac{1}{3}$이므로 $x=-\dfrac{n}{3}$을 대입하면 $$ f\left(-\frac{n}{3}\right) = 9\left(-\frac{n}{3}\right)^3 = -\frac{n^3}{3} = \frac{1}{3} \implies n^3 = -1 $$ $n$은 실수이므로 $n=-1$, 즉 $g(x)=3x-1$이다.
8. 따라서 $$ f(x) = 9x^3+(x-1)(3x-1)-(3x-1)^2 = 9x^3-6x^2+2x $$ 이므로 $f(-1)=9(-1)^3-6(-1)^2+2(-1)=-9-6-2=-17$이다.
- 작성자 답: $-17$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_DIVISION(다항식의 나눗셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「최고차항의 계수가 양수인 두 다항식 $f(x)$, $g」
**RPM** H1-RPM-005 [다항식 > 다항식의 연산 > 다항식의 나눗셈 > 다항식을 일차식으로 나누기] **원천→판정: 다항식 > 다항식의 연산 > 다항식의 나눗셈 > 몫과 나머지 → 다항식 > 다항식의 연산 > 다항식의 나눗셈 > 다항식을 일차식으로 나누기**
- 이유: Q23(mx): 다항식의 나눗셈 단원의 RPM H1-RPM-005 유형에 해당한다.
**유형** PT=PT_H1_POLY_DIVISION / TPL=TPL_H1_POLY_DIVISION_EXECUTION (원천과 같음) (원천과 같음)
- 이유: Q23(mx): 다항식의 나눗셈 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 5 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23(mx): 다항식의 나눗셈 단원의 기본 개념과 계산을 적용하는 난이도 5 문항이다.

**4칸**
- given: 최고차항←stem:「최고차항의 계수가 양수인」
- goal: 다항식←stem:「두 다항식 $f(x)$, $g(x)$」
- method: 다항식의나눗셈(IMPLIED)←solution:「나머지 $9x^2-{g(x)}^2$의 차수는」 — 나머지의 차수가 제수의 차수보다 낮아야 하는 다항식 나눗셈 성질을 적용함
- condition: 나머지정리(IMPLIED)←solution:「f\left(-\frac{n}{3}\right) = 9\left(-\frac{n}{3}\right)^3」 — 일차식 g(x)=0의 근을 대입해 나머지를 구하는 나머지정리 적용

**how** Q23(mx): 발문과 해설의 풀이 과정을 점검하여 정답 $-17$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (가)에서 $f(x)=(x-1){9x^2+g(x)}+9x^2-{g(x)}^2$이다. 나머지 $9x^2-{g(x)}^2$의 차수는 나누는 식 $9x^2+g(x)$의 차수보다 낮아야 한다. 만약 $g(x)$가 $2$차 이상이면 ${g(x)}^2$의 차수가 $9x^2+g(x)$보다 크고, $g(x)$가 상수이면 나머지의 $9x^2$항이 남아 나누는 식과 차수가 같아져 모순이다. 따라서 $g(x)$는 일차식 $g(x)=mx+n$ ($m>0$)이다. 나머지 $9x^2-(mx+n)^2=(9-m^2)x^2-2mnx-n^2$의 차수가 $2$보다 작아야 하므로 $9-m^2=0$, $m>0$에서 $m=3$이다. 즉 $g(x)=3x+n$이다. 이제 조건 (가)를 정리하면 $$ \begin{aligned} f(x) &= 9x^3-9x^2+(x-1)g(x)+9x^2-{g(x)}^2 \ &= 9x^3+(x-1)g(x)-{g(x)}^2 \end{aligned} $$ 조건 (나)에서 $f(x)$를 $g(x)=3x+n$으로 나눈 나머지가 $\dfrac{1}{3}$이므로 $x=-\dfrac{n}{3}$을 대입하면 $$ f\left(-\frac{n}{3}\right) = 9\left(-\frac{n}{3}\right)^3 = -\frac{n^3}{3} = \frac{1}{3} \implies n^3 = -1 $$ $n$은 실수이므로 $n=-1$, 즉 $g(x)=3x-1$이다. 따라서 $$ f(x) = 9x^3+(x-1)(3x-1)-(3x-1)^2 = 9x^3-6x^2+2x $$ 이므로 $f(-1)=9(-1)^3-6(-1)^2+2(-1)=-9-6-2=-17$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
