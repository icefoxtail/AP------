# 검수 묶음 — 22_매산고_1학기_중간_고1_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 20개 / 검사 PASS 19, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/20, HOLD 0, 풀이 답 비어 있음 20문항
- 그림 판단 분포: NONE 20
- 난이도 분포: 1단계 3, 2단계 8, 3단계 5, 4단계 3, 5단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q6**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3.6점


**발문**

두 다항식 $A=5x^3-4x^2+7x$, $B=3x^3-2x+4$에 대하여 $3(A-X)+B=4B$일 때, 다항식 $X$의 $x$의 계수를 구하면?

**보기** ① $3$  ② $5$  ③ $7$  ④ $9$  ⑤ $11$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. Q1 문제의 조건(11)에 맞추어 식을 세운다.
2. 주어진 등식을 $X$에 대하여 정리하면 $$ \begin{aligned} 3A-3X+B &= 4B \ 3X &= 3A-3B \ X &= A-B \end{aligned} $$ 여기에 $A$, $B$를 대입하여 계산하면 $$ \begin{aligned} X &= (5x^3-4x^2+7x)-(3x^3-2x+4) \ &= 2x^3-4x^2+9x-4 \end{aligned} $$ 따라서 다항식 $X$의 $x$의 계수는 $9$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_BASIC(다항식의 기본 연산) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 다항식 $A=5x^3-4x^2+7x$, $B=3x^」
**RPM** H1-RPM-001 [다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리] **원천→판정: 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 다항식의 덧셈·뺄셈 → 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리**
- 이유: Q1(11): 다항식의 기본 연산 단원의 RPM H1-RPM-001 유형에 해당한다.
**유형** PT=PT_H1_POLY_OPERATION_EXPANSION / TPL=TPL_H1_POLY_OPERATION_DIRECT (원천과 같음) (원천과 같음)
- 이유: Q1(11): 다항식의 기본 연산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(11): 다항식의 기본 연산 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $X$의」
- goal: 계수←stem:「의 계수를 구하면?」
- method: 다항식(IMPLIED)←stem:「두 다항식 $A=5x^3-4x^2+7x$」 — 등식을 정리해 다항식 X=A-B를 구하는 다항식 연산
- condition: (없음)

**how** Q1(11): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 등식을 $X$에 대하여 정리하면 $$ \begin{aligned} 3A-3X+B &= 4B \ 3X &= 3A-3B \ X &= A-B \end{aligned} $$ 여기에 $A$, $B$를 대입하여 계산하면 $$ \begin{aligned} X &= (5x^3-4x^2+7x)-(3x^3-2x+4) \ &= 2x^3-4x^2+9x-4 \end{aligned} $$ 따라서 다항식 $X$의 $x$의 계수는 $9$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.8점


**발문**

다항식 $f(x)=2x^3+3x^2-4x+7$을 $x+2$로 나눈 나머지를 구하면?

**보기** ① $11$  ② $9$  ③ $7$  ④ $5$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 나머지정리에 의하여 다항식 $f(x)$를 $x+2$로 나눈 나머지는 $f(-2)$이다.
2. $$ \begin{aligned} f(-2) &= 2(-2)^3+3(-2)^2-4(-2)+7 \ &= -16+12+8+7 \ &= 11 \end{aligned} $$ 따라서 구하는 나머지는 $11$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-REMAINDER_FACTOR(나머지정리와 인수정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $f(x)=2x^3+3x^2-4x+7$을 $x+」
**RPM** H1-RPM-009 [다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지] (원천과 같음)
- 이유: Q2(11): 나머지정리와 인수정리 단원의 RPM H1-RPM-009 유형에 해당한다.
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=TPL_H1_IDENTITY_COEFFICIENT_COMPARE
- 이유: Q2(11): 나머지정리와 인수정리 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(11): 나머지정리와 인수정리 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $f(x)=2x^3+3x^2-4x+7$」
- goal: 나머지←stem:「나눈 나머지를 구하면?」
- method: 나머지정리(NAMED)←solution:「나머지정리에 의하여」
- condition: (없음)

**how** Q2(11): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

나머지정리에 의하여 다항식 $f(x)$를 $x+2$로 나눈 나머지는 $f(-2)$이다. $$ \begin{aligned} f(-2) &= 2(-2)^3+3(-2)^2-4(-2)+7 \ &= -16+12+8+7 \ &= 11 \end{aligned} $$ 따라서 구하는 나머지는 $11$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.9점


**발문**

복소수 $z=6-5i$일 때, $z+\overline{z}$의 값은?

**보기** ① $6$  ② $10$  ③ $12$  ④ $14$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. Q3 문제의 조건(10)에 맞추어 식을 세운다.
2. $z=6-5i$의 켤레복소수는 $\overline{z}=6+5i$이므로 $$ z+\overline{z} = (6-5i)+(6+5i) = 12 $$ 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「복소수 $z=6-5i$일 때, $z+\overline{」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] **원천→판정: 방정식과 부등식 > 복소수 > 복소수의 연산 > 켤레복소수 → 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산**
- 이유: Q3(10): 복소수의 계산 단원의 RPM H1-RPM-023 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=TPL_H1_COMPLEX_CONJUGATE_NORM (원천과 같음) (원천과 같음)
- 이유: Q3(10): 복소수의 계산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(10): 복소수의 계산 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 복소수←stem:「복소수 $z=6-5i$」
- goal: 합←solution:「z+\overline{z} = (6-5i)+(6+5i)」
- method: 켤레복소수(NAMED)←solution:「켤레복소수는 $\overline{z}=6+5i$」
- condition: (없음)

**how** Q3(10): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$z=6-5i$의 켤레복소수는 $\overline{z}=6+5i$이므로 $$ z+\overline{z} = (6-5i)+(6+5i) = 12 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4.2점


**발문**

$x$, $y$에 대한 이차식 $x^2-2xy+y^2-5x+5y+6$을 인수분해하면?

**보기** ① $(x+y-2)(x+y-3)$  ② $(x-y-2)(x-y-3)$  ③ $(x-y+2)(x-y+3)$  ④ $(x-y-1)(x-y-6)$  ⑤ $(x+y+2)(x-y-3)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. Q4 문제의 조건(xy)에 맞추어 식을 세운다.
2. 앞의 세 항을 묶고 일차항을 $(x-y)$로 묶으면 $$ \begin{aligned} x^2-2xy+y^2-5x+5y+6 &= (x-y)^2-5(x-y)+6 \ &= {(x-y)-2}{(x-y)-3} \ &= (x-y-2)(x-y-3) \end{aligned} $$ 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$, $y$에 대한 이차식 $x^2-2xy+y^2-」
**RPM** H1-RPM-013 [다항식 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 다항식 > 인수분해 > 공통인수 > 단계적 인수분해 → 다항식 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: Q4(xy): 인수분해 단원의 RPM H1-RPM-013 유형에 해당한다.
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=TPL_H1_FACTORIZATION_STANDARD (원천과 같음) (원천과 같음)
- 이유: Q4(xy): 인수분해 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(xy): 인수분해 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차식←stem:「$x$, $y$에 대한 이차식」
- goal: 인수분해←stem:「인수분해하면?」
- method: 완전제곱식(IMPLIED)←solution:「(x-y)^2-5(x-y)+6」 — 앞의 세 항을 (x-y)^2 완전제곱식으로 묶어 치환함
- condition: (없음)

**how** Q4(xy): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

앞의 세 항을 묶고 일차항을 $(x-y)$로 묶으면 $$ \begin{aligned} x^2-2xy+y^2-5x+5y+6 &= (x-y)^2-5(x-y)+6 \ &= {(x-y)-2}{(x-y)-3} \ &= (x-y-2)(x-y-3) \end{aligned} $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4.2점


**발문**

$a$, $b$, $c$가 양수이고 $a^3+b^3+c^3=3abc$일 때, $\dfrac{3b+2c}{5a}+\dfrac{a-4c}{3b}+\dfrac{8a+b}{3c}$의 값은?

**보기** ① $1$  ② $\dfrac{3}{2}$  ③ $2$  ④ $\dfrac{5}{2}$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 인수분해 공식에 의하여 $$ a^3+b^3+c^3-3abc = \frac{1}{2}(a+b+c){(a-b)^2+(b-c)^2+(c-a)^2} = 0 $$ $a, b, c$가 모두 양수이므로 $a+b+c>0$이고, 따라서 $$ (a-b)^2+(b-c)^2+(c-a)^2 = 0 \implies a = b = c $$ 이다.
2. 이를 주어진 식에 대입하면 $$ \frac{3a+2a}{5a}+\frac{a-4a}{3a}+\frac{8a+a}{3a} = \frac{5a}{5a}+\frac{-3a}{3a}+\frac{9a}{3a} = 1+(-1)+3 = 3 $$ 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a$, $b$, $c$가 양수이고 $a^3+b^3+c」
**RPM** H1-RPM-013 [다항식 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 다항식 > 인수분해 > 인수분해의 활용 > 조건식 → 다항식 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: Q5(abc): 인수분해 단원의 RPM H1-RPM-013 유형에 해당한다.
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=TPL_H1_FACTORIZATION_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q5(abc): 인수분해 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(abc): 인수분해 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 실수←stem:「$a$, $b$, $c$가 양수이고」
- goal: 합←solution:「1+(-1)+3 = 3」
- method: 인수분해(NAMED)←solution:「인수분해 공식에 의하여」
- condition: (없음)

**how** Q5(abc): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

인수분해 공식에 의하여 $$ a^3+b^3+c^3-3abc = \frac{1}{2}(a+b+c){(a-b)^2+(b-c)^2+(c-a)^2} = 0 $$ $a, b, c$가 모두 양수이므로 $a+b+c>0$이고, 따라서 $$ (a-b)^2+(b-c)^2+(c-a)^2 = 0 \implies a = b = c $$ 이다. 이를 주어진 식에 대입하면 $$ \frac{3a+2a}{5a}+\frac{a-4a}{3a}+\frac{8a+a}{3a} = \frac{5a}{5a}+\frac{-3a}{3a}+\frac{9a}{3a} = 1+(-1)+3 = 3 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4.3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$x$에 대한 이차방정식 $(k-2)x^2+4(k-2)x+3k-2=0$이 실근을 가질 때, 실수 $k$의 값이 될 수 없는 것은?

**보기** ① $4$  ② $-1$  ③ $0$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주어진 식이 $x$에 대한 이차방정식이므로 $k-2\ne 0$, 즉 $k\ne 2$이다.
2. ($k=2$일 때는 $4=0$이 되어 성립하지도 않는다.) 이차방정식이 실근을 가지려면 판별식 $D\ge 0$이어야 하므로 $$ \begin{aligned} \frac{D}{4} &= {2(k-2)}^2-(k-2)(3k-2) \ &= (k-2){4(k-2)-(3k-2)} \ &= (k-2)(k-6) \ge 0 \end{aligned} $$ $k\ne 2$이므로 이를 풀면 $k<2$ 또는 $k\ge 6$이다.
3. 보기 중 이 범위에 속하지 않는 값은 $4$뿐이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-DISCRIMINANT(판별식과 근의 조건) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$에 대한 이차방정식 $(k-2)x^2+4(k-2)」
**RPM** H1-RPM-028 [방정식과 부등식 > 이차방정식 > 이차방정식의 근 > 판별식] (원천과 같음)
- 이유: Q6(aligned): 판별식과 근의 조건 단원의 RPM H1-RPM-028 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_DISCRIMINANT / TPL=TPL_H1_DISCRIMINANT_ROOT_EXISTENCE (원천과 같음) (원천과 같음)
- 이유: Q6(aligned): 판별식과 근의 조건 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(aligned): 판별식과 근의 조건 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차방정식←stem:「이차방정식 $(k-2)x^2+4(k-2)x+3k-2=0$」
- goal: 실수←stem:「실수 $k$의 값이 될 수 없는」
- method: 판별식(NAMED)←solution:「판별식 $D\ge 0$」
- condition: 실근←stem:「실근을 가질 때」

**how** Q6(aligned): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식이 $x$에 대한 이차방정식이므로 $k-2\ne 0$, 즉 $k\ne 2$이다. ($k=2$일 때는 $4=0$이 되어 성립하지도 않는다.) 이차방정식이 실근을 가지려면 판별식 $D\ge 0$이어야 하므로 $$ \begin{aligned} \frac{D}{4} &= {2(k-2)}^2-(k-2)(3k-2) \ &= (k-2){4(k-2)-(3k-2)} \ &= (k-2)(k-6) \ge 0 \end{aligned} $$ $k\ne 2$이므로 이를 풀면 $k<2$ 또는 $k\ge 6$이다. 보기 중 이 범위에 속하지 않는 값은 $4$뿐이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4.5점


**발문**

이차함수 $y=x^2-2x+5$의 그래프와 직선 $y=4x-m+2$가 만나지 않도록 하는 자연수 $m$의 최솟값은?

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차함수 $y=x^2-2x+5$의 그래프와 직선 $y=4x-m+2$의 교점의 $x$좌표는 방정식 $$ x^2-2x+5 = 4x-m+2 \implies x^2-6x+(m+3) = 0 $$ 의 실근이다.
2. 두 그래프가 만나지 않으려면 이 이차방정식이 실근을 갖지 않아야 하므로 판별식 $D<0$이어야 한다.
3. $$ \frac{D}{4} = (-3)^2-(m+3) = 6-m < 0 \implies m > 6 $$ 따라서 조건을 만족하는 자연수 $m$의 최솟값은 $7$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=x^2-2x+5$의 그래프와 직선 $y=」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 교점 개수 → 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점**
- 이유: Q7(y): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_INTERSECTION_TANGENCY (원천과 같음) (원천과 같음)
- 이유: Q7(y): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(y): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2-2x+5$」<br>직선←stem:「직선 $y=4x-m+2$」
- goal: 최솟값←stem:「자연수 $m$의 최솟값은?」
- method: 판별식(NAMED)←solution:「판별식 $D<0$」
- condition: 자연수←stem:「자연수 $m$의」

**how** Q7(y): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

이차함수 $y=x^2-2x+5$의 그래프와 직선 $y=4x-m+2$의 교점의 $x$좌표는 방정식 $$ x^2-2x+5 = 4x-m+2 \implies x^2-6x+(m+3) = 0 $$ 의 실근이다. 두 그래프가 만나지 않으려면 이 이차방정식이 실근을 갖지 않아야 하므로 판별식 $D<0$이어야 한다. $$ \frac{D}{4} = (-3)^2-(m+3) = 6-m < 0 \implies m > 6 $$ 따라서 조건을 만족하는 자연수 $m$의 최솟값은 $7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4.4점


**발문**

연립방정식 $\begin{cases} x^2+xy-2y=24 \ x^2-y^2=0 \end{cases}$의 해를 $\begin{cases} x=\alpha \ y=\beta \end{cases}$라 할 때, $\alpha+\beta$의 최댓값은?

**보기** ① $6$  ② $8$  ③ $10$  ④ $12$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 둘째 식 $x^2-y^2=(x-y)(x+y)=0$에서 $x=y$ 또는 $x=-y$이다. (cases)
2. 1) $x=y$인 경우 첫째 식에 대입하면 $$ 2x^2-2x-24=0 \implies x^2-x-12=0 \implies (x-4)(x+3)=0 $$ 이므로 해는 $(4, 4)$, $(-3, -3)$이고, 이때 $\alpha+\beta$의 값은 각각 $8$, $-6$이다.
3. 2) $x=-y$인 경우 첫째 식에 대입하면 $$ y^2-y^2-2y=24 \implies -2y=24 \implies y=-12 $$ 이므로 해는 $(12, -12)$이고, 이때 $\alpha+\beta=0$이다.
4. 따라서 $\alpha+\beta$의 최댓값은 $8$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-07(여러 가지 방정식) / H15-SA-07-SUBSTITUTION_SYSTEM(치환과 연립방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{cases} x^2+xy-2y」
**RPM** H1-RPM-041 [방정식과 부등식 > 여러 가지 방정식 > 연립방정식 > 이차식이 포함된 연립방정식] (원천과 같음)
- 이유: Q8(cases): 치환과 연립방정식 단원의 RPM H1-RPM-041 유형에 해당한다.
**유형** PT=PT_H1_SYSTEM_EQUATION / TPL=TPL_H1_SYSTEM_DIRECT (원천과 같음) (원천과 같음)
- 이유: Q8(cases): 치환과 연립방정식 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(cases): 치환과 연립방정식 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 방정식←stem:「연립방정식」
- goal: 최댓값←stem:「$\alpha+\beta$의 최댓값은?」
- method: 인수분해(IMPLIED)←solution:「x^2-y^2=(x-y)(x+y)=0」 — 둘째 식을 인수분해하여 두 일차 관계식 x=y, x=-y로 분리함
- condition: (없음)

**how** Q8(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

둘째 식 $x^2-y^2=(x-y)(x+y)=0$에서 $x=y$ 또는 $x=-y$이다.

1) $x=y$인 경우 첫째 식에 대입하면 $$ 2x^2-2x-24=0 \implies x^2-x-12=0 \implies (x-4)(x+3)=0 $$ 이므로 해는 $(4, 4)$, $(-3, -3)$이고, 이때 $\alpha+\beta$의 값은 각각 $8$, $-6$이다.  
2) $x=-y$인 경우 첫째 식에 대입하면 $$ y^2-y^2-2y=24 \implies -2y=24 \implies y=-12 $$ 이므로 해는 $(12, -12)$이고, 이때 $\alpha+\beta=0$이다. 따라서 $\alpha+\beta$의 최댓값은 $8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4.4점


**발문**

복소수 $z=(1+i)x^2-(6+i)x+9+4i$에 대하여 $z^2$이 음의 실수일 때, 실수 $x$의 값은?

**보기** ① $-3$  ② $-1$  ③ $0$  ④ $1$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 복소수 $z$를 실수부분과 허수부분으로 정리하면 $$ z = (x^2-6x+9)+(x^2-x+4)i = (x-3)^2+(x^2-x+4)i $$ $z^2$이 음의 실수가 되려면 $z$가 순허수이어야 하므로 실수부분이 $0$이고 허수부분이 $0$이 아니어야 한다.
2. $$ (x-3)^2 = 0 \implies x = 3 $$ 이때 허수부분은 $3^2-3+4=10\ne 0$이므로 $z=10i$, $z^2=-100<0$으로 조건을 만족한다.
3. 따라서 $x=3$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「복소수 $z=(1+i)x^2-(6+i)x+9+4i$에 」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] **원천→판정: 방정식과 부등식 > 복소수 > i의 거듭제곱 > 복소수 조건 → 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산**
- 이유: Q9(10): 복소수의 계산 단원의 RPM H1-RPM-023 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_CONDITION_EQUATION / TPL=TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT (원천과 같음) (원천과 같음)
- 이유: Q9(10): 복소수의 계산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(10): 복소수의 계산 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 복소수←stem:「복소수 $z=(1+i)x^2-(6+i)x+9+4i$」
- goal: 실수←stem:「실수 $x$의 값은?」
- method: 실수부분(NAMED)←solution:「실수부분과 허수부분으로 정리하면」
- condition: 허수부분←solution:「허수부분이 $0$이 아니어야」

**how** Q9(10): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

복소수 $z$를 실수부분과 허수부분으로 정리하면 $$ z = (x^2-6x+9)+(x^2-x+4)i = (x-3)^2+(x^2-x+4)i $$ $z^2$이 음의 실수가 되려면 $z$가 순허수이어야 하므로 실수부분이 $0$이고 허수부분이 $0$이 아니어야 한다. $$ (x-3)^2 = 0 \implies x = 3 $$ 이때 허수부분은 $3^2-3+4=10\ne 0$이므로 $z=10i$, $z^2=-100<0$으로 조건을 만족한다. 따라서 $x=3$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4.4점


**발문**

방정식 $x^3=-1$의 한 허근을 $\omega$라 할 때, 다음 <보기>에서 옳은 것만을 있는 대로 고른 것은? <보기> ㄱ. $\omega^2-\omega+1=0$ ㄴ. $\omega+\overline{\omega}=-1$ ㄷ. $\omega^4=-\omega$

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄷ  ④ ㄴ, ㄷ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x^3+1=(x+1)(x^2-x+1)=0$이고 $\omega$는 허근이므로 $\omega^3=-1$, $\omega^2-\omega+1=0$이다.
2. - ㄱ.
3. $\omega^2-\omega+1=0$이므로 옳다.
4. - ㄴ.
5. $x^2-x+1=0$의 두 허근이 $\omega, \overline{\omega}$이므로 근과 계수의 관계에 의해 $\omega+\overline{\omega}=1$이다.
6. 따라서 거짓이다.
7. - ㄷ.
8. $\omega^3=-1$이므로 $\omega^4=\omega^3\cdot\omega=-\omega$이다.
9. 따라서 옳다.
10. 그러므로 옳은 것은 ㄱ, ㄷ이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-07(여러 가지 방정식) / H15-SA-07-HIGHER_EQUATION(고차방정식의 풀이) (원천과 같음) (원천과 같음)
- 근거 인용: 「방정식 $x^3=-1$의 한 허근을 $\omega$라 」
**RPM** H1-RPM-039 [방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형] **원천→판정: 방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 치환형 → 방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형**
- 이유: Q10(x): 고차방정식의 풀이 단원의 RPM H1-RPM-039 유형에 해당한다.
**유형** PT=PT_H1_HIGHER_DEGREE_EQUATION / TPL=TPL_H1_HIGHER_SUBSTITUTION_REDUCTION (원천과 같음) (원천과 같음)
- 이유: Q10(x): 고차방정식의 풀이 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(x): 고차방정식의 풀이 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 방정식←stem:「방정식 $x^3=-1$」
- goal: 허근←stem:「한 허근을 $\omega$라 할 때」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의해」
- condition: (없음)

**how** Q10(x): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x^3+1=(x+1)(x^2-x+1)=0$이고 $\omega$는 허근이므로 $\omega^3=-1$, $\omega^2-\omega+1=0$이다.

- ㄱ. $\omega^2-\omega+1=0$이므로 옳다.  
- ㄴ. $x^2-x+1=0$의 두 허근이 $\omega, \overline{\omega}$이므로 근과 계수의 관계에 의해 $\omega+\overline{\omega}=1$이다. 따라서 거짓이다.  
- ㄷ. $\omega^3=-1$이므로 $\omega^4=\omega^3\cdot\omega=-\omega$이다. 따라서 옳다. 그러므로 옳은 것은 ㄱ, ㄷ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4.5점


**발문**

이차함수 $f(x)=x^2+6x-1$과 서로 다른 두 실수 $a$, $b$ ($a<b$)가 $f(a)=2b$, $f(b)=2a$를 만족할 때, 함수 $y=(x+2a)(x+2b)$의 최솟값은?

**보기** ① $-4$  ② $-2$  ③ $0$  ④ $2$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $f(a)=a^2+6a-1=2b$, $f(b)=b^2+6b-1=2a$에서 두 식을 빼면 $$ \begin{aligned} (a^2-b^2)+6(a-b) &= 2(b-a) \ (a-b)(a+b+6) &= -2(a-b) \end{aligned} $$ $a\ne b$이므로 양변을 $a-b$로 나누면 $a+b+6=-2$, 즉 $a+b=-8$이다.
2. 한편 두 식을 더하면 $$ (a^2+b^2)+6(a+b)-2 = 2(a+b) \implies a^2+b^2 = -4(a+b)+2 = 32+2 = 34 $$ 따라서 $$ ab = \frac{(a+b)^2-(a^2+b^2)}{2} = \frac{64-34}{2} = 15 $$ ($a, b$는 $t^2+8t+15=0$의 두 근 $-5, -3$으로 서로 다른 실수가 존재한다.) 구하는 함수는 $$ y = (x+2a)(x+2b) = x^2+2(a+b)x+4ab = x^2-16x+60 = (x-8)^2-4 $$ 이므로 최솟값은 $-4$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $f(x)=x^2+6x-1$과 서로 다른 두 」
**RPM** H1-RPM-029 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱] (원천과 같음)
- 이유: Q11(aligned): 근과 계수의 관계 단원의 RPM H1-RPM-029 유형에 해당한다.
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=TPL_H1_VIETA_SYMMETRIC_VALUE (원천과 같음) (원천과 같음)
- 이유: Q11(aligned): 근과 계수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(aligned): 근과 계수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $f(x)=x^2+6x-1$」
- goal: 최솟값←stem:「의 최솟값은?」
- method: 대칭식(IMPLIED)←solution:「(a+b)^2-(a^2+b^2)」 — a+b와 a^2+b^2으로부터 곱 ab를 구하는 대칭식 변형
- condition: 실수←stem:「서로 다른 두 실수 $a$, $b$」

**how** Q11(aligned): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(a)=a^2+6a-1=2b$, $f(b)=b^2+6b-1=2a$에서 두 식을 빼면 $$ \begin{aligned} (a^2-b^2)+6(a-b) &= 2(b-a) \ (a-b)(a+b+6) &= -2(a-b) \end{aligned} $$ $a\ne b$이므로 양변을 $a-b$로 나누면 $a+b+6=-2$, 즉 $a+b=-8$이다. 한편 두 식을 더하면 $$ (a^2+b^2)+6(a+b)-2 = 2(a+b) \implies a^2+b^2 = -4(a+b)+2 = 32+2 = 34 $$ 따라서 $$ ab = \frac{(a+b)^2-(a^2+b^2)}{2} = \frac{64-34}{2} = 15 $$ ($a, b$는 $t^2+8t+15=0$의 두 근 $-5, -3$으로 서로 다른 실수가 존재한다.) 구하는 함수는 $$ y = (x+2a)(x+2b) = x^2+2(a+b)x+4ab = x^2-16x+60 = (x-8)^2-4 $$ 이므로 최솟값은 $-4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4.6점


**발문**

$-1\le x\le 1$에서 함수 $y=-(x^2-2x)^2+2(x^2-2x)+5$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은?

**보기** ① $4$  ② $6$  ③ $7$  ④ $8$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $t=x^2-2x=(x-1)^2-1$로 치환하자. (10)
2. $-1\le x\le 1$에서 $t$는 $x=1$일 때 최솟값 $-1$, $x=-1$일 때 최댓값 $(-1)^2-2(-1)=3$을 가지므로 $$ -1 \le t \le 3 $$ 주어진 함수는 $t$에 대하여 $$ y = -t^2+2t+5 = -(t-1)^2+6 $$ 이다.
3. 구간 $-1\le t\le 3$ 안에 꼭짓점 $t=1$이 포함되므로 최댓값은 $M=6$이다.
4. 구간의 양 끝점에서의 값은 $t=-1$일 때 $y=-(-1-1)^2+6=2$, $t=3$일 때 $y=-(3-1)^2+6=2$이므로 최솟값은 $m=2$이다.
5. 따라서 $M+m=6+2=8$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$-1\le x\le 1$에서 함수 $y=-(x^2-2」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용 → 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소**
- 이유: Q12(10): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_MODEL (원천과 같음) (원천과 같음)
- 이유: Q12(10): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(10): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 이차함수←solution:「t=x^2-2x=(x-1)^2-1」
- goal: 최댓값←stem:「최댓값을 $M$, 최솟값을 $m$」
- method: 완전제곱식(IMPLIED)←solution:「-(t-1)^2+6」 — 치환된 이차함수를 완전제곱식으로 변형해 구간 내 최대·최소를 구함
- condition: (없음)

**how** Q12(10): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$t=x^2-2x=(x-1)^2-1$로 치환하자. $-1\le x\le 1$에서 $t$는 $x=1$일 때 최솟값 $-1$, $x=-1$일 때 최댓값 $(-1)^2-2(-1)=3$을 가지므로 $$ -1 \le t \le 3 $$ 주어진 함수는 $t$에 대하여 $$ y = -t^2+2t+5 = -(t-1)^2+6 $$ 이다. 구간 $-1\le t\le 3$ 안에 꼭짓점 $t=1$이 포함되므로 최댓값은 $M=6$이다. 구간의 양 끝점에서의 값은 $t=-1$일 때 $y=-(-1-1)^2+6=2$, $t=3$일 때 $y=-(3-1)^2+6=2$이므로 최솟값은 $m=2$이다. 따라서 $M+m=6+2=8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.6점


**발문**

$a+b+c=2024$, $\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}=\dfrac{1}{2024}$일 때, $\dfrac{1}{a^{2025}}+\dfrac{1}{b^{2025}}+\dfrac{1}{c^{2025}}$의 값은?

**보기** ① $\dfrac{1}{2024^{2024}}$  ② $\dfrac{1}{2024^{2025}}$  ③ $\dfrac{1}{2025^{2024}}$  ④ $\dfrac{1}{2025^{2025}}$  ⑤ $\dfrac{3}{2024^{2025}}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $u=\dfrac{1}{a}$, $v=\dfrac{1}{b}$, $w=\dfrac{1}{c}$라 두면 주어진 두 조건은 $$ u+v+w = \frac{1}{2024}, \qquad uv+vw+wu = 2024uvw $$ 이다.
2. $X=2024u$, $Y=2024v$, $Z=2024w$라 두면 $X+Y+Z=1$, $XY+YZ+ZX=XYZ$가 된다.
3. $X, Y, Z$를 세 근으로 하는 삼차방정식은 $$ t^3-t^2+(XYZ)t-XYZ = (t-1)(t^2+XYZ) = 0 $$ 으로 인수분해된다.
4. 따라서 세 수 $X, Y, Z$ 중 하나는 $1$이고, 나머지 둘은 $t^2+XYZ=0$의 두 근이므로 서로 부호가 반대(합이 $0$)이다.
5. 그러므로 홀수 거듭제곱의 합에서 두 항은 서로 상쇄되어 $$ X^{2025}+Y^{2025}+Z^{2025} = 1^{2025} = 1 $$ 이다.
6. 따라서 $$ \frac{1}{a^{2025}}+\frac{1}{b^{2025}}+\frac{1}{c^{2025}} = \frac{X^{2025}+Y^{2025}+Z^{2025}}{2024^{2025}} = \frac{1}{2024^{2025}} $$ 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-07(여러 가지 방정식) / H15-SA-07-HIGHER_EQUATION(고차방정식의 풀이) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a+b+c=2024$, $\dfrac{1}{a}+\d」
**RPM** H1-RPM-039 [방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형] (원천과 같음)
- 이유: Q13(2024): 고차방정식의 풀이 단원의 RPM H1-RPM-039 유형에 해당한다.
**유형** PT=PT_H1_HIGHER_DEGREE_EQUATION / TPL=TPL_H1_HIGHER_FACTOR_ROOT (원천과 같음) (원천과 같음)
- 이유: Q13(2024): 고차방정식의 풀이 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(2024): 고차방정식의 풀이 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: 삼차방정식←solution:「세 근으로 하는 삼차방정식은」
- goal: 합←solution:「홀수 거듭제곱의 합에서」
- method: 인수분해(NAMED)←solution:「으로 인수분해된다」
- condition: (없음)

**how** Q13(2024): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$u=\dfrac{1}{a}$, $v=\dfrac{1}{b}$, $w=\dfrac{1}{c}$라 두면 주어진 두 조건은 $$ u+v+w = \frac{1}{2024}, \qquad uv+vw+wu = 2024uvw $$ 이다. $X=2024u$, $Y=2024v$, $Z=2024w$라 두면 $X+Y+Z=1$, $XY+YZ+ZX=XYZ$가 된다. $X, Y, Z$를 세 근으로 하는 삼차방정식은 $$ t^3-t^2+(XYZ)t-XYZ = (t-1)(t^2+XYZ) = 0 $$ 으로 인수분해된다. 따라서 세 수 $X, Y, Z$ 중 하나는 $1$이고, 나머지 둘은 $t^2+XYZ=0$의 두 근이므로 서로 부호가 반대(합이 $0$)이다. 그러므로 홀수 거듭제곱의 합에서 두 항은 서로 상쇄되어 $$ X^{2025}+Y^{2025}+Z^{2025} = 1^{2025} = 1 $$ 이다. 따라서 $$ \frac{1}{a^{2025}}+\frac{1}{b^{2025}}+\frac{1}{c^{2025}} = \frac{X^{2025}+Y^{2025}+Z^{2025}}{2024^{2025}} = \frac{1}{2024^{2025}} $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.7점


**발문**

사차방정식 $(4x^2+2x+1)(4x^2-2x+1)=0$의 서로 다른 네 근을 $\alpha$, $\beta$, $\gamma$, $\delta$라 할 때, $\dfrac{1}{\alpha^6}+\dfrac{1}{\beta^6}+\dfrac{1}{\gamma^6}+\dfrac{1}{\delta^6}$의 값은?

**보기** ① $2^6$  ② $2^7$  ③ $2^8$  ④ $2^9$  ⑤ $2^{10}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $4x^2+2x+1=0$의 두 근을 $\alpha, \beta$라 하면 $x\ne 0$이므로 양변을 $x^2$으로 나누어 $t=\dfrac{1}{x}$이라 두면 $$ t^2+2t+4 = 0 $$ 양변에 $(t-2)$를 곱하면 $t^3-8=0$, 즉 $t^3=8$이므로 $\dfrac{1}{\alpha^3}=\dfrac{1}{\beta^3}=8$이다. (10)
2. 따라서 $\dfrac{1}{\alpha^6}=\dfrac{1}{\beta^6}=8^2=2^6$이다.
3. 마찬가지로 $4x^2-2x+1=0$의 두 근 $\gamma, \delta$에 대하여 $t=\dfrac{1}{x}$은 $t^2-2t+4=0$을 만족하므로 양변에 $(t+2)$를 곱하면 $t^3=-8$이다.
4. 따라서 $\dfrac{1}{\gamma^6}=\dfrac{1}{\delta^6}=(-8)^2=2^6$이다.
5. 그러므로 구하는 값은 $4\times 2^6 = 2^8$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-07(여러 가지 방정식) / H15-SA-07-HIGHER_EQUATION(고차방정식의 풀이) (원천과 같음) (원천과 같음)
- 근거 인용: 「사차방정식 $(4x^2+2x+1)(4x^2-2x+1)=」
**RPM** H1-RPM-039 [방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형] **원천→판정: 방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 치환형 → 방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형**
- 이유: Q14(10): 고차방정식의 풀이 단원의 RPM H1-RPM-039 유형에 해당한다.
**유형** PT=PT_H1_HIGHER_DEGREE_EQUATION / TPL=TPL_H1_HIGHER_SUBSTITUTION_REDUCTION (원천과 같음) (원천과 같음)
- 이유: Q14(10): 고차방정식의 풀이 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(10): 고차방정식의 풀이 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 사차방정식←stem:「사차방정식 $(4x^2+2x+1)(4x^2-2x+1)=0$」
- goal: 합←solution:「구하는 값은 $4\times 2^6 = 2^8$」
- method: 사차방정식(IMPLIED)←stem:「사차방정식 $(4x^2+2x+1)(4x^2-2x+1)=0$」 — 역수 방정식에 (t∓2)를 곱해 세제곱 값을 구하는 차수 축소법
- condition: (없음)

**how** Q14(10): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$4x^2+2x+1=0$의 두 근을 $\alpha, \beta$라 하면 $x\ne 0$이므로 양변을 $x^2$으로 나누어 $t=\dfrac{1}{x}$이라 두면 $$ t^2+2t+4 = 0 $$ 양변에 $(t-2)$를 곱하면 $t^3-8=0$, 즉 $t^3=8$이므로 $\dfrac{1}{\alpha^3}=\dfrac{1}{\beta^3}=8$이다. 따라서 $\dfrac{1}{\alpha^6}=\dfrac{1}{\beta^6}=8^2=2^6$이다. 마찬가지로 $4x^2-2x+1=0$의 두 근 $\gamma, \delta$에 대하여 $t=\dfrac{1}{x}$은 $t^2-2t+4=0$을 만족하므로 양변에 $(t+2)$를 곱하면 $t^3=-8$이다. 따라서 $\dfrac{1}{\gamma^6}=\dfrac{1}{\delta^6}=(-8)^2=2^6$이다. 그러므로 구하는 값은 $4\times 2^6 = 2^8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.9점


**발문**

두 이차함수 $f(x)=(x-2a)^2-4a^2$, $g(x)=-(x-a)^2+a^2-b$에서 방정식 $f(x)=g(x)$는 서로 다른 두 실근 $\alpha$, $\beta$ ($\alpha<\beta$)를 갖고 두 근의 차가 $3$이다. <보기>에서 옳은 것만을 있는 대로 고른 것은? <보기> ㄱ. $5a^2<b$이다. ㄴ. $f(\alpha)-g(\beta)\le g(a)-f(2a)$ ㄷ. $g(\alpha)=f(\beta)+5a^2-b$이면 $b=36$이다.

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄴ  ④ ㄱ, ㄷ  ⑤ ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 식을 전개하면 $f(x)=x^2-4ax$, $g(x)=-x^2+2ax-b$이다.
2. 방정식 $f(x)=g(x)$는 $2x^2-6ax+b=0$이므로 근과 계수의 관계에 의해 $\alpha+\beta=3a$, $\alpha\beta=\dfrac{b}{2}$이다.
3. 두 근의 차가 $3$이므로 $(\beta-\alpha)^2=(\alpha+\beta)^2-4\alpha\beta=9a^2-2b=9$, 즉 $b=\dfrac{9a^2-9}{2}$이다.
4. - ㄱ.
5. $5a^2<\dfrac{9a^2-9}{2} \iff 10a^2<9a^2-9 \iff a^2<-9$이므로 성립할 수 없다.
6. (거짓)  
- ㄴ.
7. $f(\alpha)=g(\alpha)$이므로 좌변은 $$f(\alpha)-g(\beta)=g(\alpha)-g(\beta)=(\beta-\alpha)(\alpha+\beta-2a)=3(3a-2a)=3a$$ 우변은 $g(a)-f(2a)=(a^2-b)-(-4a^2)=5a^2-b=5a^2-\dfrac{9a^2-9}{2}=\dfrac{a^2+9}{2}$이다.
8. 따라서 $3a\le\dfrac{a^2+9}{2} \iff a^2-6a+9=(a-3)^2\ge 0$이므로 항상 참이다.
9. - ㄷ.
10. $g(\alpha)=f(\beta)+5a^2-b$는 $g(\alpha)-g(\beta)=5a^2-b$, 즉 $3a=\dfrac{a^2+9}{2}$와 같으므로 $(a-3)^2=0$에서 $a=3$이다.
11. 이때 $b=\dfrac{9\cdot 9-9}{2}=36$이다.
12. (참) 따라서 옳은 것은 ㄴ, ㄷ이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 이차함수 $f(x)=(x-2a)^2-4a^2$, $」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > 판별식과 위치 → 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점**
- 이유: Q15(36): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY (원천과 같음) (원천과 같음)
- 이유: Q15(36): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(36): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: 이차함수←stem:「두 이차함수 $f(x)=(x-2a)^2-4a^2$」
- goal: 실근←stem:「서로 다른 두 실근 $\alpha$, $\beta$」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의해」
- condition: 완전제곱식←solution:「(a-3)^2\ge 0」

**how** Q15(36): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 식을 전개하면 $f(x)=x^2-4ax$, $g(x)=-x^2+2ax-b$이다. 방정식 $f(x)=g(x)$는 $2x^2-6ax+b=0$이므로 근과 계수의 관계에 의해 $\alpha+\beta=3a$, $\alpha\beta=\dfrac{b}{2}$이다. 두 근의 차가 $3$이므로 $(\beta-\alpha)^2=(\alpha+\beta)^2-4\alpha\beta=9a^2-2b=9$, 즉 $b=\dfrac{9a^2-9}{2}$이다.

- ㄱ. $5a^2<\dfrac{9a^2-9}{2} \iff 10a^2<9a^2-9 \iff a^2<-9$이므로 성립할 수 없다. (거짓)  
- ㄴ. $f(\alpha)=g(\alpha)$이므로 좌변은 $$f(\alpha)-g(\beta)=g(\alpha)-g(\beta)=(\beta-\alpha)(\alpha+\beta-2a)=3(3a-2a)=3a$$ 우변은 $g(a)-f(2a)=(a^2-b)-(-4a^2)=5a^2-b=5a^2-\dfrac{9a^2-9}{2}=\dfrac{a^2+9}{2}$이다. 따라서 $3a\le\dfrac{a^2+9}{2} \iff a^2-6a+9=(a-3)^2\ge 0$이므로 항상 참이다.  
- ㄷ. $g(\alpha)=f(\beta)+5a^2-b$는 $g(\alpha)-g(\beta)=5a^2-b$, 즉 $3a=\dfrac{a^2+9}{2}$와 같으므로 $(a-3)^2=0$에서 $a=3$이다. 이때 $b=\dfrac{9\cdot 9-9}{2}=36$이다. (참) 따라서 옳은 것은 ㄴ, ㄷ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 단답형 4점


**발문**

두 다항식 $f(x)$, $g(x)$가 다음 조건을 만족시킨다. (가) 모든 실수 $x$에 대하여 $f(2x)=g(x)(x-3)+7$이다. (나) $g(x)-3x$를 $x-6$으로 나누었을 때의 나머지는 $4$이다. $f(x)g(x)$를 $x-6$으로 나누었을 때의 나머지를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $154$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. Q16 문제의 조건(22)에 맞추어 식을 세운다.
2. 조건 (나)에서 나머지정리에 의하여 $x=6$을 대입하면 $$ g(6)-3\cdot 6 = 4 \implies g(6) = 22 $$ 조건 (가)는 모든 실수 $x$에 대하여 성립하므로 $x=3$을 대입하면 $$ f(6) = g(3)(3-3)+7 = 7 $$ 따라서 $f(x)g(x)$를 $x-6$으로 나누었을 때의 나머지는 나머지정리에 의하여 $$ f(6)g(6) = 7\cdot 22 = 154 $$ 이다.
- 작성자 답: $154$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-IDENTITY(항등식과 계수비교) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 다항식 $f(x)$, $g(x)$가 다음 조건을 만」
**RPM** H1-RPM-007 [다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법] **원천→판정: 다항식 > 항등식과 나머지정리 > 항등식 > 수치대입법 → 다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법**
- 이유: Q16(22): 항등식과 계수비교 단원의 RPM H1-RPM-007 유형에 해당한다.
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=TPL_H1_IDENTITY_SPECIAL_VALUE (원천과 같음) (원천과 같음)
- 이유: Q16(22): 항등식과 계수비교 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(22): 항등식과 계수비교 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 다항식←stem:「두 다항식 $f(x)$, $g(x)$」
- goal: 나머지←stem:「나누었을 때의 나머지를 구하시오」
- method: 나머지정리(NAMED)←solution:「나머지정리에 의하여」
- condition: 수치대입법(IMPLIED)←solution:「x=3$을 대입하면」 — 항등식에 x=3을 대입해 미지의 g(3)을 소거함

**how** Q16(22): 발문과 해설의 풀이 과정을 점검하여 정답 $154$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (나)에서 나머지정리에 의하여 $x=6$을 대입하면 $$ g(6)-3\cdot 6 = 4 \implies g(6) = 22 $$ 조건 (가)는 모든 실수 $x$에 대하여 성립하므로 $x=3$을 대입하면 $$ f(6) = g(3)(3-3)+7 = 7 $$ 따라서 $f(x)g(x)$를 $x-6$으로 나누었을 때의 나머지는 나머지정리에 의하여 $$ f(6)g(6) = 7\cdot 22 = 154 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 단답형 5점


**발문**

삼차방정식 $x^3-4x^2+(a+3)x-a=0$의 세 실근 중 어떤 한 근이 다른 한 근의 $2$배일 때, 상수 $a$의 값의 곱을 $A$라 하면 $4A$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $10$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주어진 삼차방정식의 좌변은 $x=1$을 대입하면 $1-4+a+3-a=0$이므로 $(x-1)$을 인수로 갖는다.
2. 인수분해하면 $$ (x-1)(x^2-3x+a) = 0 $$ 세 실근은 $1$과 이차방정식 $x^2-3x+a=0$의 두 근이다.
3. 1) $x^2-3x+a=0$의 두 근이 $r, 2r$인 경우: 두 근의 합 $3r=3$에서 $r=1$이므로 두 근은 $1, 2$이고 $a=1\cdot 2=2$이다.
4. 2) $1$과 $x^2-3x+a=0$의 한 근이 $2$배 관계인 경우:  
- 한 근이 $2$이면 $2^2-3\cdot 2+a=0 \implies a=2$ (1)과 동일, 세 근 $1, 1, 2$).
5. - 한 근이 $\dfrac{1}{2}$이면 $\left(\dfrac{1}{2}\right)^2-3\left(\dfrac{1}{2}\right)+a=0 \implies a=\dfrac{5}{4}$ (다른 한 근은 $\dfrac{5}{2}$, 세 실근 $\dfrac{1}{2}, 1, \dfrac{5}{2}$).
6. 따라서 서로 다른 상수 $a$의 값은 $2$, $\dfrac{5}{4}$이므로 $$ A = 2\cdot\frac{5}{4} = \frac{5}{2}, \qquad 4A = 10 $$ 이다.
- 작성자 답: $10$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-07(여러 가지 방정식) / H15-SA-07-HIGHER_EQUATION(고차방정식의 풀이) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼차방정식 $x^3-4x^2+(a+3)x-a=0$의 세」
**RPM** H1-RPM-039 [방정식과 부등식 > 여러 가지 방정식 > 삼차·사차방정식 > 인수분해형] (원천과 같음)
- 이유: Q17(10): 고차방정식의 풀이 단원의 RPM H1-RPM-039 유형에 해당한다.
**유형** PT=PT_H1_HIGHER_DEGREE_EQUATION / TPL=TPL_H1_HIGHER_FACTOR_ROOT (원천과 같음) (원천과 같음)
- 이유: Q17(10): 고차방정식의 풀이 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(10): 고차방정식의 풀이 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 삼차방정식←stem:「삼차방정식 $x^3-4x^2+(a+3)x-a=0$」
- goal: 곱←stem:「상수 $a$의 값의 곱을 $A$」
- method: 인수정리(IMPLIED)←solution:「$(x-1)$을 인수로 갖는다」 — x=1을 대입해 0임을 확인하고 인수정리로 삼차식을 인수분해함
- condition: 실근←stem:「세 실근 중」

**how** Q17(10): 발문과 해설의 풀이 과정을 점검하여 정답 $10$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 삼차방정식의 좌변은 $x=1$을 대입하면 $1-4+a+3-a=0$이므로 $(x-1)$을 인수로 갖는다. 인수분해하면 $$ (x-1)(x^2-3x+a) = 0 $$ 세 실근은 $1$과 이차방정식 $x^2-3x+a=0$의 두 근이다.

1) $x^2-3x+a=0$의 두 근이 $r, 2r$인 경우: 두 근의 합 $3r=3$에서 $r=1$이므로 두 근은 $1, 2$이고 $a=1\cdot 2=2$이다.  
2) $1$과 $x^2-3x+a=0$의 한 근이 $2$배 관계인 경우:  
- 한 근이 $2$이면 $2^2-3\cdot 2+a=0 \implies a=2$ (1)과 동일, 세 근 $1, 1, 2$).  
- 한 근이 $\dfrac{1}{2}$이면 $\left(\dfrac{1}{2}\right)^2-3\left(\dfrac{1}{2}\right)+a=0 \implies a=\dfrac{5}{4}$ (다른 한 근은 $\dfrac{5}{2}$, 세 실근 $\dfrac{1}{2}, 1, \dfrac{5}{2}$). 따라서 서로 다른 상수 $a$의 값은 $2$, $\dfrac{5}{4}$이므로 $$ A = 2\cdot\frac{5}{4} = \frac{5}{2}, \qquad 4A = 10 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 단답형 6점


**발문**

그림과 같이 $\triangle\mathrm{ABC}$의 변 $\mathrm{AB}$ 위를 움직이는 점 $\mathrm{P}$에 대하여 선분 $\mathrm{BP}$의 중점을 $\mathrm{Q}$라고 하자. 또, 두 점 $\mathrm{P}$, $\mathrm{Q}$에서 각각 변 $\mathrm{BC}$에 평행한 선을 그어 변 $\mathrm{AC}$와 만나는 점을 $\mathrm{S}$, $\mathrm{R}$라고 하자. $\triangle\mathrm{ABC}$의 넓이가 $24$일 때, 사각형 $\mathrm{PQRS}$의 넓이의 최댓값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $8$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\overline{\mathrm{PS}}\parallel\overline{\mathrm{QR}}\parallel\overline{\mathrm{BC}}$이므로 $\triangle\mathrm{APS}$와 $\triangle\mathrm{AQR}$는 각각 $\triangle\mathrm{ABC}$와 닮음이다.
2. $\dfrac{\overline{\mathrm{BP}}}{\overline{\mathrm{BA}}}=t$ ($0\le t\le 1$)라 두면 $\dfrac{\overline{\mathrm{AP}}}{\overline{\mathrm{AB}}}=1-t$이고, 점 $\mathrm{Q}$가 선분 $\mathrm{BP}$의 중점이므로 $\dfrac{\overline{\mathrm{AQ}}}{\overline{\mathrm{AB}}}=1-\dfrac{t}{2}$이다.
3. 닮은 두 도형의 넓이의 비는 닮음비의 제곱과 같으므로 $$ \triangle\mathrm{AQR} = 24\left(1-\frac{t}{2}\right)^2, \qquad \triangle\mathrm{APS} = 24(1-t)^2 $$ 사각형 $\mathrm{PQRS}$의 넓이 $S(t)$는 두 삼각형 넓이의 차와 같으므로 $$ \begin{aligned} S(t) &= 24\left(1-\frac{t}{2}\right)^2 - 24(1-t)^2 \ &= 24\left(1-t+\frac{t^2}{4}-1+2t-t^2\right) \ &= 24\left(t-\frac{3}{4}t^2\right) = -18t^2+24t \ &= -18\left(t-\frac{2}{3}\right)^2+8 \end{aligned} $$ $t=\dfrac{2}{3}$은 $0\le t\le 1$에 포함되므로 사각형 $\mathrm{PQRS}$의 넓이의 최댓값은 $8$이다.
- 작성자 답: $8$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「그림과 같이 $\triangle\mathrm{ABC}$」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용 → 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소**
- 이유: Q18(ABC): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_MODEL (원천과 같음) (원천과 같음)
- 이유: Q18(ABC): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(ABC): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 삼각형←stem:「$\triangle\mathrm{ABC}$의 넓이가 $24$」
- goal: 최댓값←stem:「넓이의 최댓값을 구하시오」
- method: 완전제곱식(IMPLIED)←solution:「-18\left(t-\frac{2}{3}\right)^2+8」 — 넓이 이차함수를 완전제곱식으로 변형하여 최댓값을 구함
- condition: 넓이←stem:「사각형 $\mathrm{PQRS}$의 넓이」

**how** Q18(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 $8$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{\mathrm{PS}}\parallel\overline{\mathrm{QR}}\parallel\overline{\mathrm{BC}}$이므로 $\triangle\mathrm{APS}$와 $\triangle\mathrm{AQR}$는 각각 $\triangle\mathrm{ABC}$와 닮음이다. $\dfrac{\overline{\mathrm{BP}}}{\overline{\mathrm{BA}}}=t$ ($0\le t\le 1$)라 두면 $\dfrac{\overline{\mathrm{AP}}}{\overline{\mathrm{AB}}}=1-t$이고, 점 $\mathrm{Q}$가 선분 $\mathrm{BP}$의 중점이므로 $\dfrac{\overline{\mathrm{AQ}}}{\overline{\mathrm{AB}}}=1-\dfrac{t}{2}$이다. 닮은 두 도형의 넓이의 비는 닮음비의 제곱과 같으므로 $$ \triangle\mathrm{AQR} = 24\left(1-\frac{t}{2}\right)^2, \qquad \triangle\mathrm{APS} = 24(1-t)^2 $$ 사각형 $\mathrm{PQRS}$의 넓이 $S(t)$는 두 삼각형 넓이의 차와 같으므로 $$ \begin{aligned} S(t) &= 24\left(1-\frac{t}{2}\right)^2 - 24(1-t)^2 \ &= 24\left(1-t+\frac{t^2}{4}-1+2t-t^2\right) \ &= 24\left(t-\frac{3}{4}t^2\right) = -18t^2+24t \ &= -18\left(t-\frac{2}{3}\right)^2+8 \end{aligned} $$ $t=\dfrac{2}{3}$은 $0\le t\le 1$에 포함되므로 사각형 $\mathrm{PQRS}$의 넓이의 최댓값은 $8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 서술형 10점


**발문**

두 다항식 $f(x)$, $g(x)$에 대하여 $f(x)+g(x)$는 $x^2+2x-1$을 인수로 갖고, $f(-x)-2g(-x)$를 $x^2-2x-1$로 나누었을 때의 나머지가 $-6$이다. $g(x)$를 $x^2+2x-1$로 나눈 나머지를 $a$, $f(x)$를 $x^2+2x-1$로 나눈 나머지를 $b$, $f(x)+kg(x)$가 $x^2+2x-1$을 인수로 갖도록 하는 상수 $k$의 값을 $c$라 할 때, $a+b+c$의 값을 구하는 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $1$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $f(x)+g(x)$가 $x^2+2x-1$을 인수로 가지므로 $x^2+2x-1$로 나누어떨어진다.
2. 여기에서 $x$ 대신 $-x$를 대입하면 $f(-x)+g(-x)$는 $(-x)^2+2(-x)-1 = x^2-2x-1$로 나누어떨어진다.
3. 한편 조건에서 $f(-x)-2g(-x)$를 $x^2-2x-1$로 나눈 나머지가 $-6$이므로 $$ {f(-x)+g(-x)} - {f(-x)-2g(-x)} = 3g(-x) $$ 를 $x^2-2x-1$로 나눈 나머지는 $0-(-6)=6$이다.
4. 따라서 $g(-x)$를 $x^2-2x-1$로 나눈 나머지는 $2$이다.
5. 즉, 몫을 $Q(x)$라 하면 $$ g(-x) = (x^2-2x-1)Q(x)+2 $$ 다시 $x$ 대신 $-x$를 대입하면 $$ g(x) = (x^2+2x-1)Q(-x)+2 $$ 이므로 $g(x)$를 $x^2+2x-1$로 나눈 나머지는 $a=2$이다.
6. 또한 $f(x)+g(x)$가 $x^2+2x-1$로 나누어떨어지므로 $b+a=0$, 즉 $b=-2$이다.
7. 끝으로 $f(x)+kg(x)$를 $x^2+2x-1$로 나눈 나머지는 $b+ka = -2+2k$이므로, 인수로 가지려면 $-2+2k=0$, 즉 $c=k=1$이다.
8. 따라서 $a+b+c = 2+(-2)+1 = 1$이다.
- 작성자 답: $1$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-REMAINDER_FACTOR(나머지정리와 인수정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 다항식 $f(x)$, $g(x)$에 대하여 $f(x」
**RPM** H1-RPM-009 [다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지] **원천→판정: 다항식 > 항등식과 나머지정리 > 나머지정리 > 고차식 조건 → 다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지**
- 이유: Q19(kg): 나머지정리와 인수정리 단원의 RPM H1-RPM-009 유형에 해당한다.
**유형** PT=PT_H1_REMAINDER_THEOREM / TPL=TPL_H1_REMAINDER_COMPOSITE_DIVISOR (원천과 같음) (원천과 같음)
- 이유: Q19(kg): 나머지정리와 인수정리 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(kg): 나머지정리와 인수정리 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: 다항식←stem:「두 다항식 $f(x)$, $g(x)$」
- goal: 나머지←stem:「나눈 나머지를 $a$」
- method: 다항식의나눗셈(IMPLIED)←solution:「g(-x) = (x^2-2x-1)Q(x)+2」 — 나눗셈 항등식에서 x를 -x로 바꾸어 g(x)의 나머지를 구함
- condition: (없음)

**how** Q19(kg): 발문과 해설의 풀이 과정을 점검하여 정답 $1$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x)+g(x)$가 $x^2+2x-1$을 인수로 가지므로 $x^2+2x-1$로 나누어떨어진다. 여기에서 $x$ 대신 $-x$를 대입하면 $f(-x)+g(-x)$는 $(-x)^2+2(-x)-1 = x^2-2x-1$로 나누어떨어진다. 한편 조건에서 $f(-x)-2g(-x)$를 $x^2-2x-1$로 나눈 나머지가 $-6$이므로 $$ {f(-x)+g(-x)} - {f(-x)-2g(-x)} = 3g(-x) $$ 를 $x^2-2x-1$로 나눈 나머지는 $0-(-6)=6$이다. 따라서 $g(-x)$를 $x^2-2x-1$로 나눈 나머지는 $2$이다. 즉, 몫을 $Q(x)$라 하면 $$ g(-x) = (x^2-2x-1)Q(x)+2 $$ 다시 $x$ 대신 $-x$를 대입하면 $$ g(x) = (x^2+2x-1)Q(-x)+2 $$ 이므로 $g(x)$를 $x^2+2x-1$로 나눈 나머지는 $a=2$이다. 또한 $f(x)+g(x)$가 $x^2+2x-1$로 나누어떨어지므로 $b+a=0$, 즉 $b=-2$이다. 끝으로 $f(x)+kg(x)$를 $x^2+2x-1$로 나눈 나머지는 $b+ka = -2+2k$이므로, 인수로 가지려면 $-2+2k=0$, 즉 $c=k=1$이다. 따라서 $a+b+c = 2+(-2)+1 = 1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 서술형 10점


**발문**

최고차항의 계수가 $2$인 이차함수 $f(x)$와 최고차항의 계수가 $1$인 이차함수 $g(x)$가 있다. 방정식 ${f(x)-3}{g(x)-3}=0$의 모든 실근이 $\alpha$, $\beta$이고, 방정식 $f(x)=g(x)$의 모든 실근은 $\alpha$, $\beta+2$이다. 상수 $k$에 대하여 방정식 ${f(x)-k}{g(x)-k}=0$의 서로 다른 실근의 개수가 $3$이고 이 세 실근의 합이 $16$일 때, $\alpha+\beta+k$의 값을 구하는 과정을 서술하시오. (단, $\alpha<\beta$)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $33$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $F(x)=f(x)-3$, $G(x)=g(x)-3$이라 두면 $F(x)G(x)=0$의 모든 실근이 $\alpha, \beta$이고 $f(\alpha)=g(\alpha)$이므로 $F(\alpha)=G(\alpha)=0$이다.
2. 만약 $F(x), G(x)$가 모두 $(x-\alpha)(x-\beta)$를 인수로 가지면 $f(\beta)=g(\beta)=3$이 되어 $f(x)=g(x)$의 다른 근이 $\beta$가 되므로 모순이다.
3. 또 $F(x)=2(x-\alpha)^2$, $G(x)=(x-\alpha)(x-\beta)$이면 $f(x)-g(x)=(x-\alpha)(x-2\alpha+\beta)=0$의 다른 근이 $2\alpha-\beta<\alpha<\beta+2$가 되어 모순이다.
4. 따라서 $$ F(x) = 2(x-\alpha)(x-\beta), \qquad G(x) = (x-\alpha)^2 $$ 이어야 한다.
5. 이때 $f(x)-g(x)=2(x-\alpha)(x-\beta)-(x-\alpha)^2=(x-\alpha)(x-2\beta+\alpha)=0$이므로 다른 한 근은 $2\beta-\alpha$이다.
6. 조건에서 이 근이 $\beta+2$이므로 $2\beta-\alpha=\beta+2 \implies \beta-\alpha=2$이다.
7. $y=x-\alpha$라 두면 $\beta-\alpha=2$이므로 $$ f(x) = 2y(y-2)+3 = 2y^2-4y+3, \qquad g(x) = y^2+3 $$ 이제 ${f(x)-k}{g(x)-k}=0$의 서로 다른 실근이 $3$개가 되려면 $f(x)=k$와 $g(x)=k$가 각각 서로 다른 두 실근을 가지면서 그중 하나가 공통근이어야 한다.
8. 공통근은 $f(x)=g(x)$, 즉 $y^2-4y=0$에서 $y=0$ 또는 $y=4$일 때 발생한다.
9. - $y=0$이면 $k=3$이고 실근이 $\alpha, \beta$의 $2$개뿐이므로 불가하다.
10. - $y=4$이면 $k=g(\alpha+4)=4^2+3=19$이다.
11. 이때 $f(x)=19 \iff 2y^2-4y-16=0 \iff y=4, -2$이고, $g(x)=19 \iff y^2=16 \iff y=4, -4$이다.
12. 따라서 서로 다른 세 실근은 $\alpha-4, \alpha-2, \alpha+4$이고 그 합이 $16$이므로 $$ (\alpha-4)+(\alpha-2)+(\alpha+4) = 3\alpha-2 = 16 \implies \alpha = 6 $$ 그러므로 $\beta=\alpha+2=8$, $k=19$이며, $\alpha+\beta+k = 6+8+19 = 33$이다.
- 작성자 답: $33$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「최고차항의 계수가 $2$인 이차함수 $f(x)$와 최고」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] (원천과 같음)
- 이유: Q20(16): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY (원천과 같음) (원천과 같음)
- 이유: Q20(16): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 5 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(16): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 5 문항이다.

**4칸**
- given: 이차함수←stem:「최고차항의 계수가 $2$인 이차함수 $f(x)$」
- goal: 실근←stem:「서로 다른 실근의 개수가 $3$」
- method: 인수정리(IMPLIED)←solution:「$F(\alpha)=G(\alpha)=0$이다」 — 근 조건으로부터 두 이차식 F(x), G(x)의 일차 인수를 결정함
- condition: 최고차항←stem:「최고차항의 계수가 $1$인 이차함수」

**how** Q20(16): 발문과 해설의 풀이 과정을 점검하여 정답 $33$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$F(x)=f(x)-3$, $G(x)=g(x)-3$이라 두면 $F(x)G(x)=0$의 모든 실근이 $\alpha, \beta$이고 $f(\alpha)=g(\alpha)$이므로 $F(\alpha)=G(\alpha)=0$이다. 만약 $F(x), G(x)$가 모두 $(x-\alpha)(x-\beta)$를 인수로 가지면 $f(\beta)=g(\beta)=3$이 되어 $f(x)=g(x)$의 다른 근이 $\beta$가 되므로 모순이다. 또 $F(x)=2(x-\alpha)^2$, $G(x)=(x-\alpha)(x-\beta)$이면 $f(x)-g(x)=(x-\alpha)(x-2\alpha+\beta)=0$의 다른 근이 $2\alpha-\beta<\alpha<\beta+2$가 되어 모순이다. 따라서 $$ F(x) = 2(x-\alpha)(x-\beta), \qquad G(x) = (x-\alpha)^2 $$ 이어야 한다. 이때 $f(x)-g(x)=2(x-\alpha)(x-\beta)-(x-\alpha)^2=(x-\alpha)(x-2\beta+\alpha)=0$이므로 다른 한 근은 $2\beta-\alpha$이다. 조건에서 이 근이 $\beta+2$이므로 $2\beta-\alpha=\beta+2 \implies \beta-\alpha=2$이다. $y=x-\alpha$라 두면 $\beta-\alpha=2$이므로 $$ f(x) = 2y(y-2)+3 = 2y^2-4y+3, \qquad g(x) = y^2+3 $$ 이제 ${f(x)-k}{g(x)-k}=0$의 서로 다른 실근이 $3$개가 되려면 $f(x)=k$와 $g(x)=k$가 각각 서로 다른 두 실근을 가지면서 그중 하나가 공통근이어야 한다. 공통근은 $f(x)=g(x)$, 즉 $y^2-4y=0$에서 $y=0$ 또는 $y=4$일 때 발생한다.

- $y=0$이면 $k=3$이고 실근이 $\alpha, \beta$의 $2$개뿐이므로 불가하다.  
- $y=4$이면 $k=g(\alpha+4)=4^2+3=19$이다. 이때 $f(x)=19 \iff 2y^2-4y-16=0 \iff y=4, -2$이고, $g(x)=19 \iff y^2=16 \iff y=4, -4$이다. 따라서 서로 다른 세 실근은 $\alpha-4, \alpha-2, \alpha+4$이고 그 합이 $16$이므로 $$ (\alpha-4)+(\alpha-2)+(\alpha+4) = 3\alpha-2 = 16 \implies \alpha = 6 $$ 그러므로 $\beta=\alpha+2=8$, $k=19$이며, $\alpha+\beta+k = 6+8+19 = 33$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
