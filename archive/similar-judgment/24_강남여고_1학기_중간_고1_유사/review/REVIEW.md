# 검수 묶음 — 24_강남여고_1학기_중간_고1_유사

- 단계: **CONVERTED (판정 검사 미통과: )**
- 문항 24개 / 검사 PASS 24, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 7, 2단계 13, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q13**: 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 2.7점


**발문**

두 다항식 $A=3x^2-2xy+4y^2$, $B=2x^2+5xy-3y^2$에 대하여 $2A-B$를 간단히 한 것은?

**보기** ① $4x^2-9xy+5y^2$  ② $4x^2+xy+11y^2$  ③ $4x^2-9xy+11y^2$  ④ $8x^2-9xy+11y^2$  ⑤ $4x^2-xy+5y^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $2A-B = 2(3x^2-2xy+4y^2) - (2x^2+5xy-3y^2)$이다.
2. 전개하여 동류항끼리 정리하면 $4x^2-9xy+11y^2$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_BASIC(다항식의 기본 연산)
- 근거 인용: 「두 다항식 $A=3x^2-2」
**RPM** H1-RPM-002 [다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 다항식의 덧셈·뺄셈]
- 이유: 다항식의 연산 단원의 다항식의 덧셈과 뺄셈 기본 연산 유형이다. (xy)
**유형** PT=PT_H1_POLY_OPERATION_EXPANSION / TPL=NONE
- 이유: 다항식의 사칙연산과 동류항 정리 기본 유형이다. (xy)
**난이도** 1 (confidence=high, 경계=NONE)
- 이유: 다항식의 덧셈과 뺄셈의 기본 사칙연산을 수행하는 난이도 1 문항이다. (xy)

**4칸**
- given: 다항식←stem:「두 다항식 $A=3x^2-2xy+4y^2$, $B=2x^2+5xy-3y^2$에 대하여」
- goal: 다항식←solution:「주어진 식에 $A$와 $B$를 대입하여」
- method: 동류항(NAMED)←solution:「대입하여 동류항끼리 정리하면 다음과 같다.」
- condition: (없음)

**how** 식에 다항식을 대입하여 전개하고 동류항끼리 결합하여 정리했다. (xy)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식에 $A$와 $B$를 대입하여 동류항끼리 정리하면 다음과 같다. $$ \begin{aligned} 2A-B &= 2(3x^2-2xy+4y^2)-(2x^2+5xy-3y^2) \ &= (6x^2-4xy+8y^2)-(2x^2+5xy-3y^2) \ &= (6-2)x^2+(-4-5)xy+(8+3)y^2 \ &= 4x^2-9xy+11y^2 \end{aligned} $$ 따라서 정답은 ③이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 2.8점


**발문**

등식 $2x^2+ax+12=(bx+3)(x+c)$가 $x$에 대한 항등식일 때, 상수 $a, b, c$에 대하여 $a+b+c$의 값은?

**보기** ① $13$  ② $14$  ③ $15$  ④ $16$  ⑤ $17$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 우변을 전개하면 $bx^2 + (bc+3)x + 3c$이다. (ax)
2. 계수비교에 의해 $b=2, 3c=12 \implies c=4, a=bc+3=11$이다. (ax)
3. 따라서 $a+b+c = 11+2+4 = 17$이다. (ax)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-IDENTITY(항등식과 계수비교)
- 근거 인용: 「등식 $2x^2+ax+12=」
**RPM** H1-RPM-007 [다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법]
- 이유: 항등식과 나머지정리 단원의 전개식을 이용한 동류항 계수비교법 유형이다. (ax)
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=NONE
- 이유: 항등식과 미정계수 계수비교법 기본 유형이다. (ax)
**난이도** 1 (confidence=high, 경계=NONE)
- 이유: 항등식의 계수비교법으로 미정계수를 결정하는 난이도 1 문항이다. (ax)

**4칸**
- given: 등식←stem:「등식 $2x^2+ax+12=(bx+3)(x+c)$가」
- goal: 상수←stem:「상수 $a, b, c$에 대하여 $a+b+c$의 값은?」
- method: 동류항(NAMED)←solution:「양변의 동류항의 계수를 비교하면」
- condition: 항등식←stem:「$x$에 대한 항등식일 때」

**how** 우변을 전개하여 좌변과 계수를 비교해 a=11, b=2, c=4를 구하고 합을 계산했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

우변을 전개하여 $x$에 대하여 내림차순으로 정리하면 다음과 같다. $$ (bx+3)(x+c) = bx^2 + (bc+3)x + 3c $$ 주어진 등식이 $x$에 대한 항등식이므로 양변의 동류항의 계수를 비교하면 $$ b=2, \quad 3c=12, \quad a=bc+3 $$ 이다. $3c=12$에서 $c=4$이고, $b=2, c=4$를 $a=bc+3$에 대입하면 $$ a = 2 \times 4 + 3 = 11 $$ 이다. 따라서 구하는 값은 $$ a+b+c = 11+2+4 = 17 $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점


**발문**

이차방정식 $x^2-4x+2=0$의 두 근을 $\alpha, \beta$라 할 때, $\frac{1}{\alpha}+\frac{1}{\beta}$의 값은?

**보기** ① $2$  ② $1$  ③ $\frac{1}{2}$  ④ $-1$  ⑤ $-2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 근과 계수의 관계에 의해 $\alpha+\beta = 4, \alpha\beta = 2$이다. (x)
2. $1/\alpha + 1/\beta = (\alpha+\beta)/(\alpha\beta) = 4/2 = 2$이다. (x)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계)
- 근거 인용: 「이차방정식 $x^2-4x+2」
**RPM** H1-RPM-029 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱]
- 이유: 이차방정식의 근과 계수 단원의 두 근의 역수의 합 계산 유형이다. (x)
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=NONE
- 이유: 근과 계수의 관계와 분수식 계산 기본 유형이다. (x)
**난이도** 1 (confidence=high, 경계=NONE)
- 이유: 근과 계수의 관계를 이용해 분수식 대칭식의 값을 구하는 난이도 1 문항이다. (x)

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2-4x+2=0$의」
- goal: 해←stem:「두 근을 $\alpha, \beta$라 할 때」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여」
- condition: 통분←solution:「따라서 구하는 식을 통분하여 대입하면」

**how** 근과 계수의 관계로 두 근의 합과 곱을 구하고 통분하여 대입해 2를 구했다. (x)

<details><summary>저장 해설 (판정 검토용)</summary>

이차방정식 $x^2-4x+2=0$에서 근과 계수의 관계에 의하여 $$ \alpha+\beta = 4, \quad \alpha\beta = 2 $$ 이다. 따라서 구하는 식을 통분하여 대입하면 $$ \frac{1}{\alpha}+\frac{1}{\beta} = \frac{\alpha+\beta}{\alpha\beta} = \frac{4}{2} = 2 $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.2점


**발문**

$-2 \le x \le 1$에서 이차함수 $y=x^2-2x+3$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은?

**보기** ① $10$  ② $11$  ③ $12$  ④ $13$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y = (x-1)^2 + 2$이므로 꼭짓점 $x=1$이 구간 $[-2, 1]$에 속한다. (10)
2. 최솟값 $m = f(1) = 2$, 최댓값 $M = f(-2) = 11$이다. (10)
3. 따라서 $M+m = 11+2 = 13$이다. (10)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용)
- 근거 인용: 「$-2 \le x \le 1」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소]
- 이유: 이차함수 단원의 제한 구간에서 꼭짓점을 포함하는 최대·최소 유형이다. (10)
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=NONE
- 이유: 제한 구간에서의 이차함수의 최대·최소 기본 유형이다. (10)
**난이도** 1 (confidence=high, 경계=NONE)
- 이유: 제한된 구간에서 이차함수의 최대·최소를 구하는 난이도 1 문항이다. (10)

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2-2x+3$의」
- goal: 최댓값←stem:「최댓값을 $M$, 최솟값을 $m$이라 할 때」
- method: 표준형(NAMED)←solution:「이차함수 $y=x^2-2x+3$을 표준형으로 변형하면」
- condition: 범위←solution:「주어진 범위 $-2 \le x \le 1$에서」

**how** 표준형으로 꼭짓점을 찾고 구간 경계값과의 거리를 비교하여 최대·최소의 합 13을 계산했다. (10)

<details><summary>저장 해설 (판정 검토용)</summary>

이차함수 $y=x^2-2x+3$을 표준형으로 변형하면 $$ y = (x-1)^2 + 2 $$ 이다. 주어진 범위 $-2 \le x \le 1$에서 꼭짓점의 $x$좌표 $x=1$이 범위에 포함되므로,

- $x=1$일 때 최솟값 $m = 2$ -$x=-2$일 때 최댓값 $M = (-2-1)^2 + 2 = 11$

을 갖는다. 따라서 $M+m = 11+2 = 13$이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.4점


**발문**

다항식 $P(x)$를 $x-1$로 나누었을 때의 몫은 $3x^2+2x-1$이고 나머지는 $4$일 때, 다항식 $P(x)$는?

**보기** ① $3x^3-x^2-3x+3$  ② $3x^3-x^2-3x+5$  ③ $3x^3+x^2-3x+5$  ④ $3x^3-x^2+3x+5$  ⑤ $3x^3-5x^2-x+5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 나눗셈 관계식 $P(x) = (x-1)(3x^2+2x-1) + 4$이다. (aligned)
2. 전개하면 $3x^3 - x^2 - 3x + 5$이다. (aligned)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_DIVISION(다항식의 나눗셈)
- 근거 인용: 「다항식 $P(x)$를 $x-」
**RPM** H1-RPM-006 [다항식 > 다항식의 연산 > 다항식의 나눗셈 > 몫과 나머지]
- 이유: 다항식의 나눗셈 단원의 나눗셈 관계식 작성 및 전개를 통한 원래 다항식 복원 유형이다. (aligned)
**유형** PT=PT_H1_POLY_DIVISION / TPL=NONE
- 이유: 다항식의 나눗셈 관계식과 원래 식의 복원 유형이다. (aligned)
**난이도** 1 (confidence=high, 경계=NONE)
- 이유: 다항식 나눗셈의 관계식을 세우고 다항식을 전개 복원하는 난이도 1 문항이다. (aligned)

**4칸**
- given: 다항식←stem:「다항식 $P(x)$를 $x-1$로 나누었을 때의」
- goal: 다항식←stem:「다항식 $P(x)$는?」
- method: 나머지(NAMED)←solution:「다항식의 나눗셈의 관계식에 의하여」
- condition: 몫←stem:「몫은 $3x^2+2x-1$이고 나머지는 $4$일 때」

**how** 제수, 몫, 나머지를 나눗셈 기본 관계식에 대입하고 전개하여 P(x)를 복원했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

다항식의 나눗셈의 관계식에 의하여 $$ \begin{aligned} P(x) &= (x-1)(3x^2+2x-1)+4 \ &= (3x^3+2x^2-x-3x^2-2x+1)+4 \ &= 3x^3-x^2-3x+5 \end{aligned} $$ 이다. 따라서 정답은 ②이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.5점


**발문**

다항식 $P(x)=3x^3+ax^2-3x+2$를 $3x-1$로 나누었을 때의 나머지가 $2$일 때, 상수 $a$의 값은?

**보기** ① $8$  ② $9$  ③ $10$  ④ $11$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 나머지정리에 의해 $P(1/3) = (a+1)/9 + 1 = 2$이다. (ax)
2. $(a+1)/9 = 1 \implies a+1 = 9 \implies a = 8$이다. (ax)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-REMAINDER_FACTOR(나머지정리와 인수정리)
- 근거 인용: 「다항식 $P(x)=3x^3+」
**RPM** H1-RPM-009 [다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지]
- 이유: 항등식과 나머지정리 단원의 나머지정리를 이용한 일차식 나눗셈 미정계수 유형이다. (ax)
**유형** PT=PT_H1_REMAINDER_THEOREM / TPL=NONE
- 이유: 나머지정리와 일차방정식 미정계수 결정 기본 유형이다. (ax)
**난이도** 1 (confidence=high, 경계=NONE)
- 이유: 일차식으로 나눈 나머지를 나머지정리로 표현해 미정계수를 구하는 난이도 1 문항이다. (ax)

**4칸**
- given: 다항식←stem:「다항식 $P(x)=3x^3+ax^2-3x+2$를」
- goal: 상수←stem:「상수 $a$의 값은?」
- method: 나머지정리(NAMED)←solution:「나머지정리에 의하여」
- condition: 나머지←stem:「나누었을 때의 나머지가 $2$일 때」

**how** 나머지정리로 P(1/3)=2 방정식을 세워 일차방정식을 풀고 a=8을 도출했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

나머지정리에 의하여 $P(x)$를 $3x-1$로 나누었을 때의 나머지는 $P\left(\frac{1}{3}\right)$과 같다. $$ \begin{aligned} P\left(\frac{1}{3}\right) &= 3\left(\frac{1}{3}\right)^3 + a\left(\frac{1}{3}\right)^2 - 3\left(\frac{1}{3}\right) + 2 \ &= \frac{1}{9} + \frac{a}{9} - 1 + 2 \ &= \frac{a+1}{9} + 1 \end{aligned} $$ 나머지가 $2$이므로 $$ \frac{a+1}{9} + 1 = 2 \implies \frac{a+1}{9} = 1 \implies a+1 = 9 \implies a = 8 $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.6점


**발문**

두 실수 $a, b$ ($a>0$)에 대하여 복소수 $z=a+bi$가 $z^2 = 21+20i$를 만족시킬 때, $a-b$의 값은? (단, $i=\sqrt{-1}$이다.)

**보기** ① $0$  ② $1$  ③ $2$  ④ $3$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $z^2 = (a^2-b^2) + 2abi = 21 + 20i$에서 $a^2-b^2 = 21, ab = 10$이다.
2. $(a^2+b^2)^2 = 21^2 + 20^2 = 841 = 29^2 \implies a^2+b^2 = 29$이다. (bi)
3. $2a^2 = 50 \implies a=5$ ($a>0$)이고 $b=2$이다. (bi)
4. 따라서 $a-b = 5-2 = 3$이다. (bi)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산)
- 근거 인용: 「두 실수 $a, b$ ($a」
**RPM** H1-RPM-024 [방정식과 부등식 > 복소수 > 복소수의 연산 > 켤레복소수]
- 이유: 복소수 단원의 복소수의 제곱과 복소수 상등을 이용한 실수 미정계수 결정 유형이다. (bi)
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=NONE
- 이유: 복소수의 제곱과 복소수 상등 연립 유형이다. (bi)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 복소수 제곱 등식에서 실수부와 허수부를 비교해 연립이차방정식을 푸는 난이도 2 문항이다. (bi)

**4칸**
- given: 실수←stem:「두 실수 $a, b$ ($a>0$)에 대하여」
- goal: 값←stem:「$a-b$의 값은?」
- method: 복소수(NAMED)←solution:「복소수가 서로 같을 조건에 의하여」
- condition: 허수단위←stem:「단, $i=\sqrt{-1}$이다.」

**how** 복소수의 제곱과 상등으로 a^2-b^2=21, ab=10을 세우고 연립하여 a=5, b=2를 구했다. (bi)

<details><summary>저장 해설 (판정 검토용)</summary>

$z=a+bi$를 제곱하면 $$ z^2 = (a+bi)^2 = (a^2-b^2) + 2abi $$ 이다. $z^2 = 21+20i$이고 $a, b$는 실수이므로 복소수가 서로 같을 조건에 의하여 $$ a^2-b^2 = 21, \quad 2ab = 20 \implies ab = 10 $$ 이다. 한편, $(a^2+b^2)^2 = (a^2-b^2)^2 + (2ab)^2$이므로 $$ (a^2+b^2)^2 = 21^2 + 20^2 = 441 + 400 = 841 = 29^2 $$ 이고, $a^2+b^2 > 0$이므로 $a^2+b^2 = 29$이다. $a^2-b^2 = 21$과 $a^2+b^2 = 29$를 연립하면 $$ 2a^2 = 50 \implies a^2 = 25 $$ 이고 $a>0$이므로 $a=5$이다. 이를 $ab=10$에 대입하면 $b=2$이다. 따라서 $a-b = 5-2 = 3$이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.6점


**발문**

$x$에 대한 이차방정식 $x^2+2ax-b-4=0$이 중근을 가질 때, $x$에 대한 이차방정식 $x^2-2ax+b^2+4b+5=0$의 근을 판별하면? (단, $a, b$는 실수이다.)

**보기** ① 서로 다른 두 실근을 갖는다.  ② 서로 다른 두 허근을 갖는다.  ③ 중근을 갖는다.  ④ 실근과 허근을 각각 하나씩 갖는다.  ⑤ $a, b$의 값에 따라 실근 또는 허근을 갖는다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $D_1/4 = a^2+b+4 = 0 \implies a^2 = -b-4$이다. (ax)
2. 두 번째 방정식의 판별식 $D_2/4 = a^2 - b^2-4b-5 = (-b-4) - b^2-4b-5 = -(b+5/2)^2 - 11/4 < 0$이다. (ax)
3. 따라서 항상 서로 다른 두 허근을 갖는다. (ax)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-DISCRIMINANT(판별식과 근의 조건)
- 근거 인용: 「$x$에 대한 이차방정식 $」
**RPM** H1-RPM-027 [방정식과 부등식 > 이차방정식 > 이차방정식의 근 > 인수분해·근의 공식]
- 이유: 이차방정식 단원의 중근 조건 대입을 통한 이차방정식 근의 판별 유형이다. (ax)
**유형** PT=PT_H1_QUADRATIC_DISCRIMINANT / TPL=NONE
- 이유: 이차방정식의 판별식 조건 대입과 근의 판별 유형이다. (ax)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 한 방정식의 판별식 조건을 다른 방정식의 판별식에 대입하여 부호를 판정하는 난이도 2 문항이다. (ax)

**4칸**
- given: 이차방정식←stem:「$x$에 대한 이차방정식 $x^2+2ax-b-4=0$이」
- goal: 이차방정식←stem:「$x$에 대한 이차방정식 $x^2-2ax+b^2+4b+5=0$의」
- method: 판별식(NAMED)←solution:「이차방정식 $x^2+2ax-b-4=0$이 중근을 가지므로 판별식을 $D_1$이라 하면」
- condition: 중근←stem:「중근을 가질 때」

**how** 첫 방정식의 중근 조건 a^2=-b-4를 두 번째 방정식 판별식에 대입해 음수임을 증명했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

이차방정식 $x^2+2ax-b-4=0$이 중근을 가지므로 판별식을 $D_1$이라 하면 $$ \frac{D_1}{4} = a^2 - (-b-4) = a^2+b+4 = 0 \implies a^2 = -b-4 $$ 이다. 이제 두 번째 이차방정식 $x^2-2ax+b^2+4b+5=0$의 판별식을 $D_2$라 하면 $$ \begin{aligned} \frac{D_2}{4} &= (-a)^2 - (b^2+4b+5) \ &= a^2 - b^2 - 4b - 5 \end{aligned} $$ 이다. 여기에 $a^2 = -b-4$를 대입하면 $$ \begin{aligned} \frac{D_2}{4} &= (-b-4) - b^2 - 4b - 5 \ &= -b^2 - 5b - 9 \ &= -\left(b+\frac{5}{2}\right)^2 - \frac{11}{4} \end{aligned} $$ 이다. $b$가 실수이므로 $\left(b+\frac{5}{2}\right)^2 \ge 0$이고, 따라서 $\frac{D_2}{4} \le -\frac{11}{4} < 0$이다. 그러므로 이차방정식 $x^2-2ax+b^2+4b+5=0$은 항상 서로 다른 두 허근을 갖는다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3.8점


**발문**

다항식 $(x-1)(x+2)(x+5)(x+8)+k$가 $x$에 대한 이차식의 완전제곱식이 되도록 하는 상수 $k$의 값은?

**보기** ① $64$  ② $72$  ③ $81$  ④ $90$  ⑤ $100$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $(x-1)(x+8)(x+2)(x+5)+k = (x^2+7x-8)(x^2+7x+10)+k$이다. (64)
2. $x^2+7x = t$로 치환하면 $(t-8)(t+10)+k = t^2+2t-80+k$이다. (64)
3. 완전제곱식이 되려면 $-81+k = 0 \implies k = 81$이다. (64)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해)
- 근거 인용: 「다항식 $(x-1)(x+2)」
**RPM** H1-RPM-015 [다항식 > 인수분해 > 인수분해 공식 > 제곱식]
- 이유: 인수분해 단원의 일차식의 곱과 치환을 이용한 완전제곱식 조건 유형이다. (64)
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=NONE
- 이유: 공통부분 치환과 다항식의 완전제곱식 조건 유형이다. (64)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 일차식 4개의 곱에서 공통부분을 치환하여 이차식 완전제곱식 조건을 푸는 난이도 2 문항이다. (64)

**4칸**
- given: 다항식←stem:「다항식 $(x-1)(x+2)(x+5)(x+8)+k$가」
- goal: 상수←stem:「상수 $k$의 값은?」
- method: 치환(NAMED)←solution:「$x^2+7x = t$로 치환하면」
- condition: 완전제곱식←stem:「이차식의 완전제곱식이 되도록 하는」

**how** 공통부분 x^2+7x를 만들어 치환하고 상수항이 1이 되도록 k=81을 구했다. (64)

<details><summary>저장 해설 (판정 검토용)</summary>

공통부분이 생기도록 두 일차식씩 짝지어 전개하면 다음과 같다. $$ \begin{aligned} (x-1)(x+8)(x+2)(x+5)+k &= (x^2+7x-8)(x^2+7x+10)+k \end{aligned} $$ $x^2+7x = t$로 치환하면 $$ (t-8)(t+10)+k = t^2+2t-80+k = (t+1)^2 - 81 + k $$ 이다. 주어진 식이 $x$에 대한 이차식의 완전제곱식이 되려면 $t$에 대한 완전제곱식이 되어야 하므로 $$ -81 + k = 0 \implies k = 81 $$ 이다. (이때 주어진 식은 $(x^2+7x+1)^2$이 된다.)

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

$x=\frac{1+\sqrt{5}i}{2}$일 때, $2x^2-2x+7$의 값은? (단, $i=\sqrt{-1}$이다.)

**보기** ① $0$  ② $1$  ③ $2$  ④ $3$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $2x-1 = \sqrt{5}i \implies (2x-1)^2 = -5 \implies 4x^2-4x+6 = 0$이다.
2. 양변을 2로 나누면 $2x^2-2x+3 = 0 \implies 2x^2-2x = -3$이다.
3. 따라서 $2x^2-2x+7 = -3+7 = 4$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산)
- 근거 인용: 「$x=\frac{1+\sqr」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산]
- 이유: 복소수 단원의 허수부 분리 제곱을 이용한 식의 값 계산 유형이다. (x)
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=NONE
- 이유: 복소수 조건식 변형과 다항식의 값 계산 유형이다. (x)
**난이도** 1 (confidence=high, 경계=NONE)
- 이유: 복소수의 일차식에서 이차방정식을 유도하여 고차 다항식의 차수를 낮추는 난이도 1 문항이다. (x)

**4칸**
- given: 복소수←stem:「$x=\frac{1+\sqrt{5}i}{2}$일 때」
- goal: 값←solution:「따라서 구하는 식의 값은」
- method: 이항(NAMED)←solution:「양변에 $2$를 곱하고 $1$을 이항하면」
- condition: 허수단위←stem:「단, $i=\sqrt{-1}$이다.」

**how** 허수부를 분리하여 제곱함으로써 이차식을 유도하고 식의 값을 4로 계산했다. (x)

<details><summary>저장 해설 (판정 검토용)</summary>

$x=\frac{1+\sqrt{5}i}{2}$에서 양변에 $2$를 곱하고 $1$을 이항하면 $$ 2x - 1 = \sqrt{5}i $$ 이다. 양변을 제곱하면 $$ (2x-1)^2 = (\sqrt{5}i)^2 \implies 4x^2-4x+1 = -5 $$ 이고, 이를 정리하면 $$ 4x^2-4x = -6 \implies 2x^2-2x = -3 $$ 이다. 따라서 구하는 식의 값은 $$ 2x^2-2x+7 = -3+7 = 4 $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4.1점


**발문**

최고차항의 계수가 $1$인 두 이차함수 $y=f(x)$, $y=g(x)$의 그래프가 $x$축과 만나는 점의 $x$좌표가 각각 $\alpha, \beta$ ($\alpha < \beta$)와 $\alpha, \gamma$ ($\alpha < \gamma$)이다. 방정식 $2f(x)+3g(x)=0$의 두 근 중 $\alpha$가 아닌 다른 한 근을 $\alpha, \beta, \gamma$를 이용하여 나타낸 것은?

**보기** ① $\frac{\beta+\gamma}{2}$  ② $\frac{2\beta+3\gamma}{5}$  ③ $\frac{3\beta+2\gamma}{5}$  ④ $\frac{2\beta-3\gamma}{5}$  ⑤ $\frac{\alpha+\beta+\gamma}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x) = (x-\alpha)(x-\beta), g(x) = (x-\alpha)(x-\gamma)$이다. (aligned)
2. 방정식에 대입하여 $(x-\alpha)$로 묶으면 $(x-\alpha)(5x-2\beta-3\gamma)=0$이다. (aligned)
3. 따라서 다른 한 근은 $x = (2\beta+3\gamma)/5$이다. (aligned)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계)
- 근거 인용: 「최고차항의 계수가 $1$인」
**RPM** H1-RPM-034 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > 판별식과 위치]
- 이유: 이차방정식 단원의 이차함수 그래프와 x축 교점 사이의 거리 유형이다. (aligned)
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=NONE
- 이유: 이차함수의 x축 교점과 방정식의 공통근 인수분해 유형이다. (aligned)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 이차함수의 x절편 인수분해형을 세우고 일차결합 방정식의 근을 구하는 난이도 2 문항이다. (aligned)

**4칸**
- given: 이차함수←stem:「최고차항의 계수가 $1$인 두 이차함수 $y=f(x)$, $y=g(x)$의」
- goal: 해←stem:「다른 한 근을 $\alpha, \beta, \gamma$를 이용하여 나타낸 것은?」
- method: 인수분해(NAMED)←solution:「대입하여 $(x-\alpha)$로 묶으면」
- condition: (없음)

**how** 인수분해형으로 식을 세우고 공통인수 (x-alpha)를 묶어 다른 한 근을 도출했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

최고차항의 계수가 $1$이고 $x$축과의 교점의 $x$좌표가 주어졌으므로 $$ f(x) = (x-\alpha)(x-\beta), \quad g(x) = (x-\alpha)(x-\gamma) $$ 로 놓을 수 있다. 이를 방정식 $2f(x)+3g(x)=0$에 대입하여 $(x-\alpha)$로 묶으면 $$ \begin{aligned} 2(x-\alpha)(x-\beta)+3(x-\alpha)(x-\gamma) &= 0 \ (x-\alpha){2(x-\beta)+3(x-\gamma)} &= 0 \ (x-\alpha)(5x - 2\beta - 3\gamma) &= 0 \end{aligned} $$ 이다. 따라서 $\alpha$가 아닌 다른 한 근은 $5x - 2\beta - 3\gamma = 0$에서 $$ x = \frac{2\beta+3\gamma}{5} $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4.3점


**발문**

다항식 $2x^4+3x^3-x^2+11x-5$를 다항식 $f(x)=ax^2+bx+c$로 나누었을 때의 몫은 $x^2+2x-1$이고 나머지는 $4x-2$이다. 상수 $a, b, c$에 대하여 $a+b+c$의 값은?

**보기** ① $0$  ② $1$  ③ $2$  ④ $3$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $P(x) - (4x-2) = 2x^4+3x^3-x^2+7x-3 = f(x)(x^2+2x-1)$이다. (11)
2. 직접 나눗셈을 수행하면 $f(x) = 2x^2-x+3$이다. (11)
3. 따라서 $a=2, b=-1, c=3$이므로 $a+b+c = 4$이다. (11)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_DIVISION(다항식의 나눗셈)
- 근거 인용: 「다항식 $2x^4+3x^3-」
**RPM** H1-RPM-005 [다항식 > 다항식의 연산 > 다항식의 나눗셈 > 다항식을 일차식으로 나누기]
- 이유: 다항식의 나눗셈 단원의 나머지 이항 후 몫으로 나누어 제수 다항식을 구하는 유형이다. (11)
**유형** PT=PT_H1_POLY_DIVISION / TPL=NONE
- 이유: 다항식의 나눗셈 관계식과 제수 다항식 결정 유형이다. (11)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 나눗셈 항등식에서 나머지를 이항한 후 사차식을 이차식으로 나누어 제수를 구하는 난이도 2 문항이다. (11)

**4칸**
- given: 다항식←stem:「다항식 $2x^4+3x^3-x^2+11x-5$를」
- goal: 상수←stem:「상수 $a, b, c$에 대하여 $a+b+c$의 값은?」
- method: 나머지(NAMED)←solution:「나머지 $4x-2$를 좌변으로 이항하여 정리하면」
- condition: 몫←stem:「몫은 $x^2+2x-1$이고 나머지는 $4x-2$이다.」

**how** 나머지를 이항한 식을 몫으로 직접 나누어 이차식 f(x)=2x^2-x+3을 구하고 합을 계산했다. (11)

<details><summary>저장 해설 (판정 검토용)</summary>

다항식의 나눗셈의 관계식에 의하여 $$ 2x^4+3x^3-x^2+11x-5 = f(x)(x^2+2x-1) + (4x-2) $$ 이다. 나머지 $4x-2$를 좌변으로 이항하여 정리하면 $$ f(x)(x^2+2x-1) = 2x^4+3x^3-x^2+7x-3 $$ 이다. $2x^4+3x^3-x^2+7x-3$을 $x^2+2x-1$로 직접 나누면

- $2x^2(x^2+2x-1) = 2x^4+4x^3-2x^2$이므로 빼면 $-x^3+x^2+7x-3$ -$-x(x^2+2x-1) = -x^3-2x^2+x$이므로 빼면 $3x^2+6x-3$ -$3(x^2+2x-1) = 3x^2+6x-3$이므로 나머지는 $0$

이다. 따라서 $f(x) = 2x^2-x+3$이므로 $a=2, b=-1, c=3$이고, $$ a+b+c = 2+(-1)+3 = 4 $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

삼각형 $\mathrm{ABC}$의 세 변의 길이 $a, b, c$가 등식 $$ a^3-a^2b+ab^2-b^3-(a-b)c^2=0 $$ 을 만족시킬 때, 삼각형 $\mathrm{ABC}$는 어떤 삼각형인가?

**보기** ① $a=b$인 이등변삼각형 또는 $\angle\mathrm{C}=90^\circ$인 직각삼각형  ② $a=b$인 이등변삼각형 또는 $\angle\mathrm{A}=90^\circ$인 직각삼각형  ③ $b=c$인 이등변삼각형 또는 $\angle\mathrm{B}=90^\circ$인 직각삼각형  ④ 정삼각형  ⑤ $\angle\mathrm{A}=90^\circ$인 직각삼각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a^2(a-b) + b^2(a-b) - c^2(a-b) = (a-b)(a^2+b^2-c^2) = 0$이다. (ABC)
2. $a=b$인 이등변삼각형이거나 $a^2+b^2=c^2$인 직각삼각형이다. (ABC)
3. 보기에 맞는 조건은 $a=b$인 이등변삼각형이다. (ABC)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해)
- 근거 인용: 「삼각형 $\mathrm{AB」
**RPM** H1-RPM-017 [다항식 > 인수분해 > 인수분해 공식 > 이차식]
- 이유: 인수분해 단원의 여러 문자를 포함한 식의 인수분해와 삼각형 모양 판정 유형이다. (ABC)
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=NONE
- 이유: 인수분해를 이용한 삼각형의 모양 판별 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 다변수 삼차식을 공통인수 묶기로 인수분해하여 삼각형 모양을 판별하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 삼각형←stem:「삼각형 $\mathrm{ABC}$의 세 변의 길이 $a, b, c$가」
- goal: 삼각형←stem:「삼각형 $\mathrm{ABC}$는 어떤 삼각형인가?」
- method: 인수분해(NAMED)←solution:「주어진 식의 좌변을 공통인수가 나타나도록 인수분해하면」
- condition: 이등변삼각형←solution:「삼각형 $\mathrm{ABC}$는 $a=b$인 이등변삼각형」

**how** 공통인수 (a-b)를 묶어 인수분해하여 삼각형의 기하학적 형태를 판정했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식의 좌변을 공통인수가 나타나도록 인수분해하면 $$ \begin{aligned} a^3-a^2b+ab^2-b^3-(a-b)c^2 &= a^2(a-b)+b^2(a-b)-c^2(a-b) \ &= (a-b)(a^2+b^2-c^2) = 0 \end{aligned} $$ 이다. 따라서 $a-b=0$ 또는 $a^2+b^2-c^2=0$이므로 $$ a=b \quad \text{또는} \quad a^2+b^2=c^2 $$ 이다. 즉, 삼각형 $\mathrm{ABC}$는 $a=b$인 이등변삼각형 또는 $\angle\mathrm{C}=90^\circ$인 직각삼각형이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$0$이 아닌 복소수 $z$와 그 켤레복소수 $\bar{z}$에 대하여 다음 중 옳지 않은 것은? (단, $i=\sqrt{-1}$이다.)

**보기** ① $z+\bar{z}$는 실수이다.  ② $z\bar{z}$는 실수이다.  ③ $(z-\bar{z})^2$은 $0$ 이하의 실수이다.  ④ $\frac{z}{\bar{z}}+\frac{\bar{z}}{z}$는 순허수이다.  ⑤ $\bar{z}=-z$이면 $z$는 순허수이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $z = a+bi$에 대해 $z+\bar{z}=2a$ (실수), $z\bar{z}=a^2+b^2$ (양의 실수)이다.
2. $z = -\bar{z} \implies a=0$이므로 순허수이다. (bi)
3. ④ $z = 1+i$이면 $z^2 = 2i$ (허수)이므로 $z^2$이 항상 실수라는 것은 거짓이다. (bi)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산)
- 근거 인용: 「$0$이 아닌 복소수 $z$」
**RPM** H1-RPM-021 [방정식과 부등식 > 복소수 > 복소수의 뜻 > 실수부·허수부]
- 이유: 복소수 단원의 켤레복소수의 연산 성질과 반례를 통한 판별 유형이다. (bi)
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=NONE
- 이유: 복소수와 켤레복소수의 성질 참거짓 판정 유형이다. (bi)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 복소수와 켤레복소수의 대수적 성질의 참거짓을 논리적으로 판정하는 난이도 2 문항이다. (bi)

**4칸**
- given: 복소수←stem:「$0$이 아닌 복소수 $z$와」
- goal: 켤레복소수←solution:「그러므로 옳지 않은 것은 ④이다.」
- method: 켤레복소수(NAMED)←stem:「그 켤레복소수 $\bar{z}$에 대하여 다음 중 옳지 않은 것은?」
- condition: 허수단위←stem:「단, $i=\sqrt{-1}$이다.」

**how** 복소수 z=a+bi 표현과 반례 z=1+i를 적용하여 복소수 성질들의 참거짓을 판별했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$z=a+bi$ ($a, b$는 실수, $a^2+b^2 \ne 0$)라 하면 $\bar{z}=a-bi$이다.

- ① $z+\bar{z} = 2a$이므로 실수이다. (참) - ②$z\bar{z} = a^2+b^2$이므로 실수이다. (참) - ③$(z-\bar{z})^2 = (2bi)^2 = -4b^2 \le 0$이므로 $0$이하의 실수이다. (참) - ④$w = \frac{z}{\bar{z}}$라 하면 $\bar{w} = \frac{\bar{z}}{z}$이므로 $\frac{z}{\bar{z}}+\frac{\bar{z}}{z} = w+\bar{w}$는 항상 실수이다. 예를 들어 $z=1$이면 $\frac{1}{1}+\frac{1}{1}=2$로 순허수가 아니다. (거짓) - ⑤$\bar{z}=-z$이면 $a-bi = -a-bi \implies 2a=0 \implies a=0$이고 $z \ne 0$이므로 $b \ne 0$이다. 따라서 $z=bi$는 순허수이다. (참)

그러므로 옳지 않은 것은 ④이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.5점


**발문**

$x$에 대한 이차방정식 $x^2-3(k+1)x+10k=0$의 두 근의 비가 $1:2$일 때, 모든 실수 $k$의 값의 합은?

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 근을 $\alpha, 2\alpha$라 하면 $\alpha+2\alpha = 3\alpha = 3(k+1) \implies \alpha = k+1$이다. (10)
2. 두 근의 곱 $\alpha(2\alpha) = 2(k+1)^2 = 10k \implies 2k^2-6k+2 = 0 \implies k^2-3k+1 = 0$이다.
3. 근과 계수의 관계에 의해 모든 실수 $k$의 합은 3이다. (10)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계)
- 근거 인용: 「$x$에 대한 이차방정식 $」
**RPM** H1-RPM-030 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근으로 방정식 구성]
- 이유: 이차방정식의 근과 계수 단원의 두 근의 비가 주어졌을 때 미정계수 결정 유형이다. (10)
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=NONE
- 이유: 두 근의 비 조건과 근과 계수의 관계 유형이다. (10)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 두 근의 비가 주어진 이차방정식에서 근과 계수의 관계를 적용하는 난이도 2 문항이다. (10)

**4칸**
- given: 이차방정식←stem:「$x$에 대한 이차방정식 $x^2-3(k+1)x+10k=0$의」
- goal: 실수←stem:「모든 실수 $k$의 값의 합은?」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여」
- condition: 해←stem:「두 근의 비가 $1:2$일 때」

**how** 두 근의 비를 매개변수 alpha로 나타내고 근과 계수의 관계를 연립하여 k의 합 3을 구했다. (10)

<details><summary>저장 해설 (판정 검토용)</summary>

두 근의 비가 $1:2$이므로 두 근을 $\alpha, 2\alpha$ ($\alpha \ne 0$)라 하자. 근과 계수의 관계에 의하여 $$ \begin{aligned} \alpha + 2\alpha &= 3(k+1) \implies 3\alpha = 3(k+1) \implies \alpha = k+1 \ \alpha \cdot 2\alpha &= 10k \implies 2\alpha^2 = 10k \implies \alpha^2 = 5k \end{aligned} $$ 이다. $\alpha = k+1$을 $\alpha^2 = 5k$에 대입하면 $$ (k+1)^2 = 5k \implies k^2-3k+1 = 0 $$ 이다. 이 이차방정식의 판별식은 $D = (-3)^2 - 4(1)(1) = 5 > 0$이므로 서로 다른 두 실근을 가지며, 두 실근 모두 $k=-1$이 아니므로 $\alpha \ne 0$ 조건을 만족시킨다. 따라서 근과 계수의 관계에 의하여 모든 실수 $k$의 값의 합은 $3$이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.6점


**발문**

두 실수 $x, y$가 $y=x-3$을 만족시킬 때, $-2x^2+y^2$의 최댓값은?

**보기** ① $9$  ② $12$  ③ $14$  ④ $16$  ⑤ $18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y = x-3$을 대입하면 $-2x^2 + (x-3)^2 = -x^2 - 6x + 9$이다. (12)
2. 완전제곱식으로 변형하면 $-(x+3)^2 + 18$이다. (12)
3. 따라서 최댓값은 $x=-3$일 때 18이다. (12)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용)
- 근거 인용: 「두 실수 $x, y$가 $y」
**RPM** H1-RPM-038 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용]
- 이유: 이차함수 단원의 일차 관계식을 이용한 이차식의 최대·최소 유형이다. (12)
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=NONE
- 이유: 조건식이 주어진 이차식의 최대·최소 유형이다. (12)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 조건식이 주어진 다변수 이차식의 최대·최소를 한 문자 소거로 해결하는 난이도 2 문항이다. (12)

**4칸**
- given: 실수←stem:「두 실수 $x, y$가 $y=x-3$을 만족시킬 때」
- goal: 최댓값←stem:「$-2x^2+y^2$의 최댓값은?」
- method: 최댓값(NAMED)←solution:「최댓값 $18$을 갖는다.」
- condition: (없음)

**how** 일차 관계식을 대입하여 한 변수의 이차식으로 변환하고 완전제곱식으로 최댓값 18을 구했다. (12)

<details><summary>저장 해설 (판정 검토용)</summary>

$y=x-3$을 $-2x^2+y^2$에 대입하여 정리하면 $$ \begin{aligned} -2x^2+(x-3)^2 &= -2x^2+x^2-6x+9 \ &= -x^2-6x+9 \ &= -(x+3)^2+18 \end{aligned} $$ 이다. $x$는 실수이므로 $-(x+3)^2 \le 0$이고, $x=-3$ (이때 $y=-6$)일 때 최댓값 $18$을 갖는다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.7점


**발문**

사차다항식 $x^4+ax^2+b$가 $(x-1)(x+3)$으로 나누어떨어질 때, 사차방정식 $x^4+ax^2+b=0$의 네 근의 곱은? (단, $a, b$는 상수이다.)

**보기** ① $6$  ② $9$  ③ $10$  ④ $12$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $P(1) = 1+a+b = 0, P(-3) = 81+9a+b = 0$을 연립하면 $a = -10, b = 9$이다. (ax)
2. 방정식 $x^4-10x^2+9 = 0$에서 네 근의 곱은 상수항 $b = 9$이다. (ax)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해)
- 근거 인용: 「사차다항식 $x^4+ax^2」
**RPM** H1-RPM-016 [다항식 > 인수분해 > 인수분해 공식 > 합과 차]
- 이유: 인수분해 단원의 인수정리를 이용한 사차식 미정계수 결정 및 근과 계수 유형이다. (ax)
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=NONE
- 이유: 인수정리와 복이차방정식의 근과 계수의 관계 유형이다. (ax)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 인수정리로 복이차식 미정계수를 구하고 고차방정식의 근과 계수의 관계를 적용하는 난이도 2 문항이다. (ax)

**4칸**
- given: 다항식←stem:「사차다항식 $x^4+ax^2+b$가」
- goal: 해←stem:「사차방정식 $x^4+ax^2+b=0$의 네 근의 곱은?」
- method: 인수정리(NAMED)←solution:「인수정리에 의하여 $P(1)=0$, $P(-3)=0$이다.」
- condition: 나머지←stem:「으로 나누어떨어질 때」

**how** 인수정리로 a=-10, b=9를 구하고 사차방정식 근과 계수의 관계(상수항)로 네 근의 곱 9를 구했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

사차다항식 $P(x)=x^4+ax^2+b$가 $(x-1)(x+3)$으로 나누어떨어지므로 인수정리에 의하여 $P(1)=0$, $P(-3)=0$이다. $$ \begin{aligned} P(1) &= 1+a+b=0 \ P(-3) &= 81+9a+b=0 \end{aligned} $$ 두 식을 연립하여 빼면 $80+8a=0 \implies a=-10$이고, 이를 첫 번째 식에 대입하면 $b=9$이다. 따라서 방정식 $x^4-10x^2+9=0$은 $$ (x^2-1)(x^2-9)=0 \implies (x-1)(x+1)(x-3)(x+3)=0 $$ 으로 인수분해되므로 네 근은 $-3, -1, 1, 3$이다. 그러므로 네 근의 곱은 $(-3)\times(-1)\times 1\times 3 = 9$이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점


**발문**

다항식 $f(x)$를 $x+2$로 나누었을 때의 나머지는 $-5$이고, 다항식 $f(x-1)$을 $x-4$로 나누었을 때의 나머지는 $5$이다. $f(x)$를 $(x+2)(x-3)$으로 나누었을 때의 나머지를 $R(x)$라 할 때, $R(1)$의 값은?

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 나머지정리에 의해 $f(-2) = -5, f(3) = 5$이다. (ax)
2. 이차식 $(x+2)(x-3)$으로 나눈 나머지를 $R(x) = ax+b$라 하면 $-2a+b = -5, 3a+b = 5$이다.
3. 연립하면 $a = 2, b = -1$이므로 $R(x) = 2x-1$이다. (ax)
4. 따라서 $R(1) = 1$이다. (ax)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-REMAINDER_FACTOR(나머지정리와 인수정리)
- 근거 인용: 「다항식 $f(x)$를 $x+」
**RPM** H1-RPM-010 [다항식 > 항등식과 나머지정리 > 나머지정리 > 고차식 조건]
- 이유: 항등식과 나머지정리 단원의 일차식 나머지 조건들을 연립하여 이차식으로 나눈 일차식 나머지 구하기 유형이다. (ax)
**유형** PT=PT_H1_REMAINDER_THEOREM / TPL=NONE
- 이유: 이차식으로 나눈 다항식의 나머지정리 연립 유형이다. (ax)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 이차식으로 나눈 일차식 나머지를 나머지정리 연립방정식으로 구하는 난이도 2 문항이다. (ax)

**4칸**
- given: 다항식←stem:「다항식 $f(x)$를 $x+2$로 나누었을 때의 나머지는 $-5$이고」
- goal: 나머지←stem:「나머지를 $R(x)$라 할 때」
- method: 나머지정리(NAMED)←solution:「나머지정리에 의하여」
- condition: 나머지←solution:「나머지 $R(x)$를 $ax+b$」

**how** 나머지정리로 f(-2)=-5, f(3)=5를 구하고 일차식 나머지 ax+b를 연립하여 R(1)=1을 도출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

나머지정리에 의하여 $$ f(-2) = -5, \quad f(4-1) = f(3) = 5 $$ 이다. $f(x)$를 이차식 $(x+2)(x-3)$으로 나누었을 때의 몫을 $Q(x)$, 나머지 $R(x)$를 $ax+b$ ($a, b$는 상수)라 하면 $$ f(x) = (x+2)(x-3)Q(x) + ax+b $$ 이다. 양변에 $x=-2$와 $x=3$을 각각 대입하면 $$ \begin{aligned} f(-2) &= -2a+b = -5 \ f(3) &= 3a+b = 5 \end{aligned} $$ 이다. 두 식을 연립하여 빼면 $5a=10 \implies a=2$이고, $b=-1$이다. 따라서 $R(x) = 2x-1$이므로 구하는 값은 $$ R(1) = 2(1)-1 = 1 $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5.1점


**발문**

$x$에 대한 이차방정식 $x^2+(a-2)x+a^2-6a+8=0$이 두 정수근을 갖도록 하는 모든 실수 $a$의 값의 합은?

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 실근을 가져야 하므로 판별식 $D = (a-2)^2 - 4(a^2-6a+8) = -3a^2+20a-28 \ge 0$이다. (aligned)
2. $(3a-14)(a-2) \le 0 \implies 2 \le a \le 14/3$이다. (aligned)
3. 정수 a의 후보 2, 3, 4를 대입하여 정수근을 갖는 a=2, 4를 찾는다. (aligned)
4. 모든 실수 $a$의 값의 합은 $2+4=6$이다. (aligned)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-DISCRIMINANT(판별식과 근의 조건)
- 근거 인용: 「$x$에 대한 이차방정식 $」
**RPM** H1-RPM-028 [방정식과 부등식 > 이차방정식 > 이차방정식의 근 > 판별식]
- 이유: 이차방정식 단원의 이차방정식의 정수근 조건과 판별식 유형이다. (aligned)
**유형** PT=PT_H1_QUADRATIC_DISCRIMINANT / TPL=NONE
- 이유: 이차방정식의 정수근 조건과 판별식 제곱수 유형이다. (aligned)
**난이도** 3 (confidence=high, 경계=NONE)
- 이유: 이차방정식의 정수근 조건에서 판별식의 제곱수 조건을 정수론적으로 해석하는 난이도 3 문항이다. (aligned)

**4칸**
- given: 이차방정식←stem:「$x$에 대한 이차방정식 $x^2+(a-2)x+a^2-6a+8=0$이」
- goal: 실수←stem:「모든 실수 $a$의 값의 합은?」
- method: 판별식(NAMED)←solution:「판별식 $D \ge 0$이어야 한다.」
- condition: 정수←stem:「두 정수근을 갖도록 하는」

**how** 판별식의 실근 범위와 정수근 검증을 적용하여 a=2, 4를 찾아 합 6을 구했다. (aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 이차방정식의 두 정수근을 $\alpha, \beta$라 하면 근과 계수의 관계에 의하여 $$ \alpha+\beta = -(a-2) = 2-a $$ 이다. $\alpha, \beta$가 모두 정수이므로 $\alpha+\beta$도 정수이고, 따라서 $a$는 반드시 정수여야 한다. 또한 두 근이 모두 정수(실수)이므로 판별식 $D \ge 0$이어야 한다. $$ \begin{aligned} D &= (a-2)^2 - 4(a^2-6a+8) \ &= a^2-4a+4 - 4a^2+24a-32 \ &= -3a^2+20a-28 \ &= -(a-2)(3a-14) \ge 0 \end{aligned} $$ 이므로 $2 \le a \le \frac{14}{3}$이다. 이를 만족시키는 정수 $a$의 후보는 $2, 3, 4$이다. 각 값을 방정식에 대입하여 두 근이 정수인지 확인하면 다음과 같다.

- $a=2$일 때: $x^2=0 \implies x=0$(중근, 정수근) -$a=3$일 때: $x^2+x-1=0 \implies x=\frac{-1\pm\sqrt{5}}{2}$(무리근이므로 제외) -$a=4$일 때: $x^2+2x=0 \implies x=0$ 또는 $x=-2$ (정수근)

따라서 조건을 만족시키는 $a$의 값은 $2, 4$이고, 그 합은 $2+4=6$이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5.2점


**발문**

이차함수 $y=2x^2+px+q$의 그래프와 일차함수 $y=g(x)$의 그래프가 서로 다른 두 점 $\mathrm{A}(\alpha, g(\alpha))$, $\mathrm{B}(\beta, g(\beta))$ ($\alpha < \beta$)에서 만난다. 두 점 $\mathrm{A}, \mathrm{B}$에서 $x$축에 내린 수선의 발을 각각 $\mathrm{C}, \mathrm{D}$라 하고, 직선 $x=\frac{\alpha+\beta}{2}$가 $y=2x^2+px+q$의 그래프 및 $y=g(x)$의 그래프와 만나는 점을 각각 $\mathrm{P}, \mathrm{Q}$라 하자. $\overline{\mathrm{PQ}}=8$일 때, 선분 $\mathrm{CD}$의 길이는?

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $2x^2+px+q - g(x) = 2(x-\alpha)(x-\beta)$이다.
2. 중점 $x=(\alpha+\beta)/2$에서의 세로 선분 길이는 $\overline{PQ} = 1/2 (\beta-\alpha)^2 = 8$이다. (px)
3. $(\beta-\alpha)^2 = 16 \implies \beta-\alpha = 4$이다. (px)
4. 따라서 $\overline{CD} = \beta-\alpha = 4$이다. (px)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계)
- 근거 인용: 「이차함수 $y=2x^2+px」
**RPM** H1-RPM-035 [방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 교점 개수]
- 이유: 이차방정식 단원의 포물선과 직선의 교점 방정식과 수직 선분의 길이 계산 유형이다. (px)
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=NONE
- 이유: 이차함수와 직선의 위치 관계 차함수 모델링 유형이다. (px)
**난이도** 3 (confidence=high, 경계=NONE)
- 이유: 이차함수와 직선의 차함수 모델링을 통해 꼭짓점/중점 위치의 선분 길이를 계산하는 난이도 3 문항이다. (px)

**4칸**
- given: 이차함수←stem:「이차함수 $y=2x^2+px+q$의 그래프와」
- goal: 길이←stem:「선분 $\mathrm{CD}$의 길이는?」
- method: 실근(NAMED)←solution:「두 실근이 $\alpha, \beta$이고 최고차항의 계수가 $2$이므로」
- condition: 일차함수←stem:「일차함수 $y=g(x)$의 그래프가 서로 다른 두 점」

**how** 포물선과 직선의 교점 방정식 인수형을 세우고 축에서의 세로 길이 공식으로 beta-alpha=4를 구했다. (px)

<details><summary>저장 해설 (판정 검토용)</summary>

방정식 $2x^2+px+q = g(x)$, 즉 $2x^2+px+q-g(x)=0$의 두 실근이 $\alpha, \beta$이고 최고차항의 계수가 $2$이므로 $$ 2x^2+px+q - g(x) = 2(x-\alpha)(x-\beta) $$ 이다. 직선 $x=\frac{\alpha+\beta}{2}$ 위의 두 점 $\mathrm{P}, \mathrm{Q}$의 $y$좌표의 차가 선분 $\mathrm{PQ}$의 길이이므로 $$ \begin{aligned} \overline{\mathrm{PQ}} &= \left|2\left(\frac{\alpha+\beta}{2}-\alpha\right)\left(\frac{\alpha+\beta}{2}-\beta\right)\right| \ &= \left|2\left(\frac{\beta-\alpha}{2}\right)\left(\frac{\alpha-\beta}{2}\right)\right| \ &= \frac{1}{2}(\beta-\alpha)^2 \end{aligned} $$ 이다. $\overline{\mathrm{PQ}}=8$이므로 $$ \frac{1}{2}(\beta-\alpha)^2 = 8 \implies (\beta-\alpha)^2 = 16 $$ 이고 $\alpha < \beta$이므로 $\beta-\alpha = 4$이다. 두 점 $\mathrm{C}(\alpha, 0), \mathrm{D}(\beta, 0)$ 사이의 거리는 $\overline{\mathrm{CD}} = \beta-\alpha$이므로 $\overline{\mathrm{CD}} = 4$이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 4점


**발문**

다항식 $f(x)$에 대하여 등식 $$ (x-1)(x^2-3)f(x) = 3x^8 + ax^4 + b $$ 가 $x$에 대한 항등식일 때, 상수 $a, b$에 대하여 $b-a$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $57$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x=1$을 대입하면 $3+a+b = 0 \implies a+b = -3$이다. (ax)
2. $x^2=3$을 대입하면 $3(81) + 9a + b = 0 \implies 9a+b = -243$이다. (ax)
3. 두 식을 빼면 $8a = -240 \implies a = -30, b = 27$이다. (ax)
4. 따라서 $b-a = 27 - (-30) = 57$이다. (ax)
- 작성자 답: $57$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-IDENTITY(항등식과 계수비교)
- 근거 인용: 「다항식 $f(x)$에 대하여」
**RPM** H1-RPM-008 [다항식 > 항등식과 나머지정리 > 항등식 > 수치대입법]
- 이유: 항등식과 나머지정리 단원의 적절한 수치대입법을 통한 미정계수 연립 결정 서술형 유형이다. (ax)
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=NONE
- 이유: 항등식의 수치대입법과 미정계수 결정 서술형 유형이다. (ax)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 다항식의 항등식에서 인수들을 0으로 만드는 특수 수치를 대입하여 계수를 구하는 난이도 2 서술형 문항이다. (ax)

**4칸**
- given: 항등식←stem:「가 $x$에 대한 항등식일 때」
- goal: 상수←stem:「상수 $a, b$에 대하여 $b-a$의 값을 구하시오.」
- method: 대입(NAMED)←solution:「양변에 $x=1$을 대입하면」
- condition: (없음)

**how** 수치대입법으로 x=1과 x^2=3을 대입하여 연립방정식을 풀고 b-a=57을 구했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 등식이 $x$에 대한 항등식이므로 양변에 $x=1$을 대입하면 $$ 0 = 3 + a + b \implies a+b = -3 \quad \cdots \text{①} $$ 이다. 또한 $x^2=3$을 만족시키는 $x$를 대입하면 $x^4=(x^2)^2=9$, $x^8=(x^2)^4=81$이므로 $$ 0 = 3(81) + a(9) + b \implies 9a+b = -243 \quad \cdots \text{②} $$ 이다. ②에서 ①을 빼면 $$ 8a = -240 \implies a = -30 $$ 이고, 이를 ①에 대입하면 $b = -3 - (-30) = 27$이다. 따라서 구하는 값은 $$ b-a = 27 - (-30) = 57 $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 5점


**발문**

$0$이 아닌 복소수 $x+yi$와 실수 $a, b$에 대하여 $\frac{1}{x+yi} = a+bi$가 성립한다. $a^2+b^2=5$일 때, $x^2+y^2$의 값을 구하시오. (단, $x, y$는 실수이고 $i=\sqrt{-1}$이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\frac{1}{5}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $1/(x+yi) = (x-yi)/(x^2+y^2) = a+bi$이다.
2. $a = x/(x^2+y^2), b = -y/(x^2+y^2)$이다. (yi)
3. $a^2+b^2 = (x^2+y^2)/(x^2+y^2)^2 = 1/(x^2+y^2) = 5$이다. (yi)
4. 따라서 $x^2+y^2 = 1/5$이다. (yi)
- 작성자 답: $\frac{1}{5}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산)
- 근거 인용: 「$0$이 아닌 복소수 $x+」
**RPM** H1-RPM-024 [방정식과 부등식 > 복소수 > 복소수의 연산 > 켤레복소수]
- 이유: 복소수 단원의 복소수의 역수와 분모의 실수화를 이용한 제곱의 합 계산 서술형 유형이다. (yi)
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=NONE
- 이유: 복소수의 실수화와 절댓값 제곱 관계 서술형 유형이다. (yi)
**난이도** 2 (confidence=high, 경계=NONE)
- 이유: 복소수의 나눗셈과 크기 공식의 역수 관계를 유도하는 난이도 2 서술형 문항이다. (yi)

**4칸**
- given: 복소수←stem:「$0$이 아닌 복소수 $x+yi$와」
- goal: 값←stem:「$x^2+y^2$의 값을 구하시오.」
- method: 복소수(NAMED)←solution:「복소수가 서로 같을 조건에 의하여」
- condition: 실수←stem:「단, $x, y$는 실수이고 $i=\sqrt{-1}$이다.」

**how** 분모의 실수화와 복소수 상등으로 a^2+b^2=1/(x^2+y^2)임을 유도하여 1/5을 계산했다. (yi)

<details><summary>저장 해설 (판정 검토용)</summary>

$\frac{1}{x+yi} = a+bi$의 좌변의 분모와 분자에 $x-yi$를 곱하여 분모를 실수화하면 $$ \frac{x-yi}{(x+yi)(x-yi)} = \frac{x}{x^2+y^2} - \frac{y}{x^2+y^2}i = a+bi $$ 이다. $x, y, a, b$가 모두 실수이므로 복소수가 서로 같을 조건에 의하여 $$ a = \frac{x}{x^2+y^2}, \quad b = -\frac{y}{x^2+y^2} $$ 이다. 따라서 $$ a^2+b^2 = \frac{x^2}{(x^2+y^2)^2} + \frac{y^2}{(x^2+y^2)^2} = \frac{x^2+y^2}{(x^2+y^2)^2} = \frac{1}{x^2+y^2} $$ 이다. $a^2+b^2=5$이므로 $\frac{1}{x^2+y^2}=5$이고, 구하는 값은 $$ x^2+y^2 = \frac{1}{5} $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 5점


**발문**

실수 $a$의 값에 관계없이 이차함수 $y=x^2-2ax+a^2+5a-2$의 그래프가 직선 $y=mx-n$에 항상 접할 때, $4mn$의 값을 구하시오. (단, $m, n$은 상수이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $165$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 연립방정식의 판별식 $D = 4(m-5)a + (m^2-4n+8) = 0$이다. (ax)
2. 실수 a에 대한 항등식이므로 $m-5 = 0 \implies m = 5$이다. (ax)
3. $m^2-4n+8 = 33-4n = 0 \implies n = 33/4$이다. (ax)
4. 따라서 $4mn = 4 \times 5 \times 33/4 = 165$이다. (ax)
- 작성자 답: $165$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계)
- 근거 인용: 「실수 $a$의 값에 관계없이」
**RPM** H1-RPM-035 [방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 교점 개수]
- 이유: 이차방정식 단원의 포물선과 직선이 매개변수에 관계없이 접할 항등식과 판별식 서술형 유형이다. (ax)
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=NONE
- 이유: 이차함수와 직선의 접선 조건 판별식과 항등식 서술형 유형이다. (ax)
**난이도** 3 (confidence=high, 경계=NONE)
- 이유: 포물선과 직선의 접점 조건 판별식을 항등식과 연립하는 난이도 3 서술형 문항이다. (ax)

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2-2ax+a^2+5a-2$의 그래프가」
- goal: 상수←stem:「단, $m, n$은 상수이다.」
- method: 판별식(NAMED)←solution:「이 이차방정식의 판별식을 $D$라 하면 $D=0$이므로」
- condition: 직선←stem:「직선 $y=mx-n$에 항상 접할 때」

**how** 접선 조건 D=0을 매개변수 a에 대한 항등식으로 정리하여 m=5, n=33/4를 구하고 4mn=165를 계산했다. (ax)

<details><summary>저장 해설 (판정 검토용)</summary>

이차함수 $y=x^2-2ax+a^2+5a-2$의 그래프와 직선 $y=mx-n$이 접하므로 이차방정식 $$ x^2-2ax+a^2+5a-2 = mx-n $$ 즉, $$ x^2-(2a+m)x + a^2+5a-2+n = 0 $$ 이 중근을 가져야 한다. 이 이차방정식의 판별식을 $D$라 하면 $D=0$이므로 $$ \begin{aligned} D &= (2a+m)^2 - 4(a^2+5a-2+n) \ &= 4a^2+4ma+m^2 - 4a^2-20a+8-4n \ &= 4(m-5)a + (m^2-4n+8) = 0 \end{aligned} $$ 이다. 이 등식이 실수 $a$의 값에 관계없이 항상 성립해야 하므로 $a$에 대한 항등식의 성질에 의하여 $$ 4(m-5)=0, \quad m^2-4n+8=0 $$ 이다. 따라서 $m=5$이고, 이를 두 번째 식에 대입하면 $$ 25 - 4n + 8 = 0 \implies 4n = 33 \implies n = \frac{33}{4} $$ 이다. 그러므로 구하는 값은 $$ 4mn = 4 \times 5 \times \frac{33}{4} = 165 $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 단답형 6점


**발문**

직육면체의 가로의 길이, 세로의 길이, 높이가 $x$에 대한 삼차방정식 $x^3-6\sqrt{2}x^2+22x+k=0$의 세 근일 때, 이 직육면체의 임의의 두 꼭짓점 사이의 거리의 최댓값을 구하시오. (단, $k$는 상수이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2\sqrt{7}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 근의 관계에 의해 $a+b+c = 6\sqrt{2}, ab+bc+ca = 22$이다.
2. 대각선의 길이는 $\sqrt{a^2+b^2+c^2}$이다. (22)
3. $a^2+b^2+c^2 = (a+b+c)^2 - 2(ab+bc+ca) = 72 - 44 = 28$이다. (22)
4. 따라서 최댓값은 $\sqrt{28} = 2\sqrt{7}$이다. (22)
- 작성자 답: $2\sqrt{7}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-MULTIPLICATION_FORMULA(곱셈공식의 변형)
- 근거 인용: 「직육면체의 가로의 길이, 세」
**RPM** H1-RPM-003 [다항식 > 다항식의 연산 > 다항식의 곱셈 > 곱셈공식]
- 이유: 다항식의 연산 단원의 3변수 제곱의 합 곱셈공식 변형과 기하 모델링 유형이다. (22)
**유형** PT=PT_H1_POLY_FORMULA_SYMMETRIC / TPL=NONE
- 이유: 곱셈공식 변형과 직육면체 대각선 길이 모델링 서술형 유형이다. (22)
**난이도** 3 (confidence=high, 경계=NONE)
- 이유: 삼차방정식의 근과 계수의 관계와 3변수 곱셈공식 변형을 공간도형 대각선 길이에 적용하는 난이도 3 서술형 문항이다. (22)

**4칸**
- given: 직육면체←stem:「직육면체의 가로의 길이, 세로의 길이, 높이가」
- goal: 대각선←solution:「직육면체의 대각선의 길이 $\sqrt{a^2+b^2+c^2}$이다.」
- method: 곱셈공식(NAMED)←solution:「곱셈 공식의 변형을 이용하면」
- condition: 거리←stem:「두 꼭짓점 사이의 거리의 최댓값을 구하시오.」

**how** 근과 계수의 관계로 변의 합과 둘씩 곱의 합을 얻고 곱셈공식 변형으로 대각선 길이 2루트7을 구했다. (22)

<details><summary>저장 해설 (판정 검토용)</summary>

직육면체의 가로의 길이, 세로의 길이, 높이를 각각 $a, b, c$ ($a>0, b>0, c>0$)라 하면 $a, b, c$가 삼차방정식 $x^3-6\sqrt{2}x^2+22x+k=0$의 세 근이므로 삼차방정식의 근과 계수의 관계에 의하여 $$ a+b+c = 6\sqrt{2}, \quad ab+bc+ca = 22 $$ 이다. 직육면체의 임의의 두 꼭짓점 사이의 거리의 최댓값은 직육면체의 대각선의 길이 $\sqrt{a^2+b^2+c^2}$이다. 곱셈 공식의 변형을 이용하면 $$ \begin{aligned} a^2+b^2+c^2 &= (a+b+c)^2 - 2(ab+bc+ca) \ &= (6\sqrt{2})^2 - 2(22) \ &= 72 - 44 = 28 \end{aligned} $$ 이다. 따라서 구하는 거리의 최댓값은 $$ \sqrt{a^2+b^2+c^2} = \sqrt{28} = 2\sqrt{7} $$ 이다.

---

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
