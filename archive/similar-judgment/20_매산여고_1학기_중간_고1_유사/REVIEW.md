# 검수 묶음 — 20_매산여고_1학기_중간_고1_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 22개 / 검사 PASS 21, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/22, HOLD 0, 풀이 답 비어 있음 22문항
- 그림 판단 분포: NONE 22
- 난이도 분포: 1단계 6, 2단계 13, 3단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q15**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3.8점


**발문**

다음은 조립제법을 이용하여 다항식 $2x^3-5x^2+x+6$을 $x-2$로 나누었을 때, 몫과 나머지를 구하는 과정이다. $$ \begin{array}{c|rrrr} 2 & 2 & -5 & 1 & 6 \ &   & 4  & b & d \ \hline & a & -1 & c & e \end{array} $$ 상수 $a, b, c, d, e$의 값으로 옳지 않은 것은?

**보기** ① $a=2$  ② $b=2$  ③ $c=-1$  ④ $d=-2$  ⑤ $e=4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 조립제법의 각 단계를 계산하면 다음과 같다. (array)
2. - 첫 계수 $2$를 그대로 내리므로 $a=2$이다.
3. - $2\times 2=4$, $-5+4=-1$이다.
4. - $b=2\times(-1)=-2$, $c=1+(-2)=-1$이다.
5. - $d=2\times(-1)=-2$, $e=6+(-2)=4$이다.
6. 따라서 $a=2, b=-2, c=-1, d=-2, e=4$이므로 옳지 않은 것은 ② $b=2$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_DIVISION(다항식의 나눗셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 조립제법을 이용하여 다항식 $2x^3-5x^2+」
**RPM** H1-RPM-005 [다항식 > 다항식의 연산 > 다항식의 나눗셈 > 다항식을 일차식으로 나누기] (원천과 같음)
- 이유: Q1(array): 다항식의 나눗셈 단원의 RPM H1-RPM-005 유형에 해당한다.
**유형** PT=PT_H1_POLY_DIVISION / TPL=TPL_H1_POLY_DIVISION_EXECUTION (원천과 같음) (원천과 같음)
- 이유: Q1(array): 다항식의 나눗셈 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(array): 다항식의 나눗셈 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $2x^3-5x^2+x+6$」
- goal: 상수←stem:「상수 $a, b, c, d, e$의 값」
- method: 다항식의나눗셈(IMPLIED)←stem:「조립제법을 이용하여」 — 조립제법 표의 각 열 곱셈·덧셈을 수행해 계수와 나머지를 구함
- condition: (없음)

**how** Q1(array): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

조립제법의 각 단계를 계산하면 다음과 같다.

- 첫 계수 $2$를 그대로 내리므로 $a=2$이다.  
- $2\times 2=4$, $-5+4=-1$이다.  
- $b=2\times(-1)=-2$, $c=1+(-2)=-1$이다.  
- $d=2\times(-1)=-2$, $e=6+(-2)=4$이다. 따라서 $a=2, b=-2, c=-1, d=-2, e=4$이므로 옳지 않은 것은 ② $b=2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.6점


**발문**

두 다항식 $f(x)$, $g(x)$를 $x-2$로 나누었을 때의 나머지가 각각 $5$, $3$일 때, 다항식 $3f(x)-2g(x)$를 $x-2$로 나누었을 때의 나머지는?

**보기** ① $3$  ② $5$  ③ $7$  ④ $9$  ⑤ $11$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 나머지정리에 의하여 $f(2)=5$, $g(2)=3$이다. (11)
2. 따라서 $3f(x)-2g(x)$를 $x-2$로 나누었을 때의 나머지는 $$ 3f(2)-2g(2) = 3\cdot 5 - 2\cdot 3 = 15-6 = 9 $$ 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-REMAINDER_FACTOR(나머지정리와 인수정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 다항식 $f(x)$, $g(x)$를 $x-2$로 나」
**RPM** H1-RPM-009 [다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지] (원천과 같음)
- 이유: Q2(11): 나머지정리와 인수정리 단원의 RPM H1-RPM-009 유형에 해당한다.
**유형** PT=PT_H1_POLY_OPERATION_EXPANSION / TPL=NONE
- 이유: Q2(11): 나머지정리와 인수정리 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(11): 나머지정리와 인수정리 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 다항식←stem:「두 다항식 $f(x)$, $g(x)$」
- goal: 나머지←stem:「나누었을 때의 나머지는?」
- method: 나머지정리(NAMED)←solution:「나머지정리에 의하여」
- condition: (없음)

**how** Q2(11): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

나머지정리에 의하여 $f(2)=5$, $g(2)=3$이다. 따라서 $3f(x)-2g(x)$를 $x-2$로 나누었을 때의 나머지는 $$ 3f(2)-2g(2) = 3\cdot 5 - 2\cdot 3 = 15-6 = 9 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.4점


**발문**

다항식 $2x^3+5x^2-2x+2$를 다항식 $A$로 나누었더니 몫이 $2x-1$이고 나머지가 $3x+1$이었다. 이때 다항식 $A$는?

**보기** ① $x^2+3x-1$  ② $x^2+3x+1$  ③ $x^2-3x-1$  ④ $x^2+2x-1$  ⑤ $x^2+3x-2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 나눗셈 항등식에 의하여 $$ 2x^3+5x^2-2x+2 = A(2x-1)+(3x+1) $$ 이므로 $A(2x-1) = 2x^3+5x^2-5x+1$이다.
2. 우변을 $2x-1$로 직접 나누면 $$ 2x^3+5x^2-5x+1 = (2x-1)(x^2+3x-1) $$ 이므로 $A = x^2+3x-1$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_DIVISION(다항식의 나눗셈) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $2x^3+5x^2-2x+2$를 다항식 $A$로」
**RPM** H1-RPM-005 [다항식 > 다항식의 연산 > 다항식의 나눗셈 > 다항식을 일차식으로 나누기] **원천→판정: 다항식 > 다항식의 연산 > 다항식의 나눗셈 > 몫과 나머지 → 다항식 > 다항식의 연산 > 다항식의 나눗셈 > 다항식을 일차식으로 나누기**
- 이유: Q3(2): 다항식의 나눗셈 단원의 RPM H1-RPM-005 유형에 해당한다.
**유형** PT=PT_H1_POLY_DIVISION / TPL=TPL_H1_POLY_DIVISION_EXECUTION (원천과 같음) (원천과 같음)
- 이유: Q3(2): 다항식의 나눗셈 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(2): 다항식의 나눗셈 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 항등식←solution:「나눗셈 항등식에 의하여」
- goal: 다항식←stem:「이때 다항식 $A$는?」
- method: 다항식의나눗셈(NAMED)←solution:「직접 나누면」
- condition: (없음)

**how** Q3(2): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

나눗셈 항등식에 의하여 $$ 2x^3+5x^2-2x+2 = A(2x-1)+(3x+1) $$ 이므로 $A(2x-1) = 2x^3+5x^2-5x+1$이다. 우변을 $2x-1$로 직접 나누면 $$ 2x^3+5x^2-5x+1 = (2x-1)(x^2+3x-1) $$ 이므로 $A = x^2+3x-1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4.3점


**발문**

$x+3y=1$을 만족하는 모든 실수 $x$, $y$에 대하여 등식 $ax^2+by^2+4x-c=0$이 성립할 때, 상수 $a$, $b$, $c$에 대하여 $a+b+c$의 값은?

**보기** ① $10$  ② $12$  ③ $14$  ④ $16$  ⑤ $18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $x=1-3y$를 등식에 대입해 $y$에 대하여 내림차순 정리하면 $$ a(1-3y)^2+by^2+4(1-3y)-c = (9a+b)y^2+(-6a-12)y+(a+4-c) = 0 $$ 이다. (ax)
2. 모든 실수 $y$에 대하여 성립하므로 항등식의 성질에 의해 $$ 9a+b=0, \qquad -6a-12=0, \qquad a+4-c=0 $$ 이다.
3. 따라서 $a=-2$, $b=18$, $c=2$이므로 $a+b+c=-2+18+2=18$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-IDENTITY(항등식과 계수비교) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x+3y=1$을 만족하는 모든 실수 $x$, $y$에」
**RPM** H1-RPM-007 [다항식 > 항등식과 나머지정리 > 항등식 > 미정계수법] (원천과 같음)
- 이유: Q4(ax): 항등식과 계수비교 단원의 RPM H1-RPM-007 유형에 해당한다.
**유형** PT=PT_H1_POLY_IDENTITY_COEFFICIENT / TPL=TPL_H1_IDENTITY_COEFFICIENT_COMPARE (원천과 같음) (원천과 같음)
- 이유: Q4(ax): 항등식과 계수비교 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(ax): 항등식과 계수비교 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 등식←stem:「등식 $ax^2+by^2+4x-c=0$」
- goal: 상수←stem:「상수 $a$, $b$, $c$에 대하여」
- method: 항등식(NAMED)←solution:「항등식의 성질에 의해」
- condition: 실수←stem:「모든 실수 $x$, $y$에 대하여」

**how** Q4(ax): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x=1-3y$를 등식에 대입해 $y$에 대하여 내림차순 정리하면 $$ a(1-3y)^2+by^2+4(1-3y)-c = (9a+b)y^2+(-6a-12)y+(a+4-c) = 0 $$ 이다. 모든 실수 $y$에 대하여 성립하므로 항등식의 성질에 의해 $$ 9a+b=0, \qquad -6a-12=0, \qquad a+4-c=0 $$ 이다. 따라서 $a=-2$, $b=18$, $c=2$이므로 $a+b+c=-2+18+2=18$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4.1점


**발문**

$\sqrt{-18}\left(\sqrt{6}+\dfrac{1}{\sqrt{-2}}\right)+\dfrac{10-\sqrt{-12}}{1-\sqrt{-3}}=a+bi$일 때, $a^2+b^2$의 값은? (단, $a, b$는 실수이고 $i=\sqrt{-1}$)

**보기** ① $169$  ② $196$  ③ $241$  ④ $256$  ⑤ $289$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 음수의 제곱근을 $i$로 나타내면 $\sqrt{-18}=3\sqrt{2}i$, $\sqrt{-2}=\sqrt{2}i$, $\sqrt{-12}=2\sqrt{3}i$, $\sqrt{-3}=\sqrt{3}i$이다.
2. 첫째 항은 $\dfrac{1}{\sqrt{2}i}=-\dfrac{i}{\sqrt{2}}$이므로 $$ 3\sqrt{2}i\left(\sqrt{6}-\dfrac{i}{\sqrt{2}}\right) = 6\sqrt{3}i+3 $$ 이다.
3. 둘째 항은 분모의 켤레복소수 $1+\sqrt{3}i$를 곱하면 $$ \dfrac{10-2\sqrt{3}i}{1-\sqrt{3}i} = \dfrac{(10-2\sqrt{3}i)(1+\sqrt{3}i)}{1+3} = \dfrac{16+8\sqrt{3}i}{4} = 4+2\sqrt{3}i $$ 이다.
4. 두 식을 더하면 $(3+6\sqrt{3}i)+(4+2\sqrt{3}i) = 7+8\sqrt{3}i$이므로 $a=7$, $b=8\sqrt{3}$이다.
5. 따라서 $a^2+b^2 = 7^2+(8\sqrt{3})^2 = 49+192 = 241$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\sqrt{-18}\left(\sqrt{6}+\dfr」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] (원천과 같음)
- 이유: Q5(18): 복소수의 계산 단원의 RPM H1-RPM-023 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=TPL_H1_COMPLEX_COMPONENT_OPERATION (원천과 같음) (원천과 같음)
- 이유: Q5(18): 복소수의 계산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(18): 복소수의 계산 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 실수←stem:「단, $a, b$는 실수이고」
- goal: 복소수←solution:「켤레복소수 $1+\sqrt{3}i$」
- method: 켤레복소수(NAMED)←solution:「분모의 켤레복소수 $1+\sqrt{3}i$를 곱하면」
- condition: 실수←stem:「단, $a, b$는 실수이고」

**how** Q5(18): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

음수의 제곱근을 $i$로 나타내면 $\sqrt{-18}=3\sqrt{2}i$, $\sqrt{-2}=\sqrt{2}i$, $\sqrt{-12}=2\sqrt{3}i$, $\sqrt{-3}=\sqrt{3}i$이다. 첫째 항은 $\dfrac{1}{\sqrt{2}i}=-\dfrac{i}{\sqrt{2}}$이므로 $$ 3\sqrt{2}i\left(\sqrt{6}-\dfrac{i}{\sqrt{2}}\right) = 6\sqrt{3}i+3 $$ 이다. 둘째 항은 분모의 켤레복소수 $1+\sqrt{3}i$를 곱하면 $$ \dfrac{10-2\sqrt{3}i}{1-\sqrt{3}i} = \dfrac{(10-2\sqrt{3}i)(1+\sqrt{3}i)}{1+3} = \dfrac{16+8\sqrt{3}i}{4} = 4+2\sqrt{3}i $$ 이다. 두 식을 더하면 $(3+6\sqrt{3}i)+(4+2\sqrt{3}i) = 7+8\sqrt{3}i$이므로 $a=7$, $b=8\sqrt{3}$이다. 따라서 $a^2+b^2 = 7^2+(8\sqrt{3})^2 = 49+192 = 241$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4.1점


**발문**

삼각형 $ABC$의 세 변의 길이를 $a, b, c$라 할 때, 등식 $b^3+b^2a+ba^2-c^3-c^2a-ca^2=0$이 성립한다. 삼각형 $ABC$는 어떤 삼각형인가?

**보기** ① $a=b$인 이등변삼각형  ② $b=c$인 이등변삼각형  ③ $\angle A$가 직각인 직각삼각형  ④ $\angle B$가 직각인 직각삼각형  ⑤ 정삼각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주어진 식을 $a$에 대하여 내림차순으로 정리하여 인수분해하면 $$ \begin{aligned} (b-c)a^2+(b^2-c^2)a+(b^3-c^3) &= (b-c){a^2+(b+c)a+(b^2+bc+c^2)} = 0 \end{aligned} $$ 이다. (ABC)
2. $a, b, c$는 삼각형의 세 변의 길이이므로 모두 양수이고, 따라서 $a^2+(b+c)a+b^2+bc+c^2 > 0$이다.
3. 그러므로 $b-c=0$, 즉 $b=c$인 이등변삼각형이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형 $ABC$의 세 변의 길이를 $a, b, c$라」
**RPM** H1-RPM-013 [다항식 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 다항식 > 인수분해 > 인수분해의 활용 > 조건식 → 다항식 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: Q6(ABC): 인수분해 단원의 RPM H1-RPM-013 유형에 해당한다.
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=TPL_H1_FACTORIZATION_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q6(ABC): 인수분해 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(ABC): 인수분해 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 삼각형←stem:「삼각형 $ABC$의 세 변의 길이」
- goal: 이등변삼각형←choices:「$b=c$인 이등변삼각형」
- method: 인수분해(NAMED)←solution:「내림차순으로 정리하여 인수분해하면」
- condition: 양수←solution:「모두 양수이고」

**how** Q6(ABC): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식을 $a$에 대하여 내림차순으로 정리하여 인수분해하면 $$ \begin{aligned} (b-c)a^2+(b^2-c^2)a+(b^3-c^3) &= (b-c){a^2+(b+c)a+(b^2+bc+c^2)} = 0 \end{aligned} $$ 이다. $a, b, c$는 삼각형의 세 변의 길이이므로 모두 양수이고, 따라서 $a^2+(b+c)a+b^2+bc+c^2 > 0$이다. 그러므로 $b-c=0$, 즉 $b=c$인 이등변삼각형이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4.4점


**발문**

실수 $x, y$에 대하여 $(2+i)x+(1-i)y=6-15i$가 성립할 때, $\dfrac{\sqrt{y}}{\sqrt{x}}+\sqrt{x}\sqrt{-y}$의 값은? (단, $i=\sqrt{-1}$)

**보기** ① $-6-2i$  ② $-6+2i$  ③ $6-2i$  ④ $-2-6i$  ⑤ $-2+6i$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 좌변을 정리하면 $(2x+y)+(x-y)i = 6-15i$이고 $x, y$는 실수이므로 $$ 2x+y=6, \qquad x-y=-15 $$ 이다.
2. 두 식을 더하면 $3x=-9 \implies x=-3$이고, $y=x+15=12$이다.
3. 따라서 $\sqrt{x}=\sqrt{-3}=\sqrt{3}i$, $\sqrt{y}=\sqrt{12}=2\sqrt{3}$, $\sqrt{-y}=\sqrt{-12}=2\sqrt{3}i$이므로 $$ \dfrac{\sqrt{y}}{\sqrt{x}}+\sqrt{x}\sqrt{-y} = \dfrac{2\sqrt{3}}{\sqrt{3}i}+(\sqrt{3}i)(2\sqrt{3}i) = \dfrac{2}{i}+6i^2 = -2i-6 = -6-2i $$ 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_BASIC(복소수의 뜻과 표현) (원천과 같음) (원천과 같음)
- 근거 인용: 「실수 $x, y$에 대하여 $(2+i)x+(1-i)y=」
**RPM** H1-RPM-021 [방정식과 부등식 > 복소수 > 복소수의 뜻 > 실수부·허수부] **원천→판정: 방정식과 부등식 > 복소수 > 복소수의 뜻 > 서로 같은 복소수 → 방정식과 부등식 > 복소수 > 복소수의 뜻 > 실수부·허수부**
- 이유: Q7(15): 복소수의 뜻과 표현 단원의 RPM H1-RPM-021 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=TPL_H1_COMPLEX_COMPONENT_OPERATION (원천과 같음) (원천과 같음)
- 이유: Q7(15): 복소수의 뜻과 표현 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(15): 복소수의 뜻과 표현 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 실수←stem:「실수 $x, y$에 대하여」
- goal: 복소수←solution:「좌변을 정리하면 $(2x+y)+(x-y)i = 6-15i$」
- method: 연립방정식(IMPLIED)←solution:「두 식을 더하면 $3x=-9」 — 복소수 상등 조건에서 얻은 두 일차방정식을 연립해 x, y를 구함
- condition: 실수←stem:「실수 $x, y$에 대하여」

**how** Q7(15): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

좌변을 정리하면 $(2x+y)+(x-y)i = 6-15i$이고 $x, y$는 실수이므로 $$ 2x+y=6, \qquad x-y=-15 $$ 이다. 두 식을 더하면 $3x=-9 \implies x=-3$이고, $y=x+15=12$이다. 따라서 $\sqrt{x}=\sqrt{-3}=\sqrt{3}i$, $\sqrt{y}=\sqrt{12}=2\sqrt{3}$, $\sqrt{-y}=\sqrt{-12}=2\sqrt{3}i$이므로 $$ \dfrac{\sqrt{y}}{\sqrt{x}}+\sqrt{x}\sqrt{-y} = \dfrac{2\sqrt{3}}{\sqrt{3}i}+(\sqrt{3}i)(2\sqrt{3}i) = \dfrac{2}{i}+6i^2 = -2i-6 = -6-2i $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.8점


**발문**

이차방정식 $4x^2-(k+4)x+k=0$의 두 근의 비가 $2:3$일 때, 정수 $k$의 값은?

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 근의 비가 $2:3$이므로 두 근을 $2t, 3t$ ($t\ne 0$)라 두면 근과 계수의 관계에 의하여 $$ 2t+3t = 5t = \dfrac{k+4}{4}, \qquad (2t)(3t) = 6t^2 = \dfrac{k}{4} $$ 이다.
2. $t=\dfrac{k+4}{20}$을 둘째 식에 대입하면 $$ 6\cdot\dfrac{(k+4)^2}{400} = \dfrac{k}{4} \implies 3(k+4)^2 = 50k \implies 3k^2-26k+48 = 0 $$ 인수분해하면 $(3k-8)(k-6)=0$이므로 $k=\dfrac{8}{3}$ 또는 $k=6$이다.
3. $k$는 정수이므로 $k=6$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차방정식 $4x^2-(k+4)x+k=0$의 두 근의 」
**RPM** H1-RPM-029 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱] (원천과 같음)
- 이유: Q8(20): 근과 계수의 관계 단원의 RPM H1-RPM-029 유형에 해당한다.
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=TPL_H1_VIETA_SYMMETRIC_VALUE (원천과 같음) (원천과 같음)
- 이유: Q8(20): 근과 계수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(20): 근과 계수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차방정식←stem:「이차방정식 $4x^2-(k+4)x+k=0$」
- goal: 정수←stem:「정수 $k$의 값은?」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에 의하여」
- condition: 정수←stem:「정수 $k$의 값은?」

**how** Q8(20): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 근의 비가 $2:3$이므로 두 근을 $2t, 3t$ ($t\ne 0$)라 두면 근과 계수의 관계에 의하여 $$ 2t+3t = 5t = \dfrac{k+4}{4}, \qquad (2t)(3t) = 6t^2 = \dfrac{k}{4} $$ 이다. $t=\dfrac{k+4}{20}$을 둘째 식에 대입하면 $$ 6\cdot\dfrac{(k+4)^2}{400} = \dfrac{k}{4} \implies 3(k+4)^2 = 50k \implies 3k^2-26k+48 = 0 $$ 인수분해하면 $(3k-8)(k-6)=0$이므로 $k=\dfrac{8}{3}$ 또는 $k=6$이다. $k$는 정수이므로 $k=6$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4.5점


**발문**

두 복소수 $\alpha$, $\beta$와 각각의 켤레복소수 $\bar{\alpha}$, $\bar{\beta}$에 대하여 <보기> 중 항상 성립하는 것만을 있는 대로 고른 것은?

<보기> ㄱ. $\alpha$, $\beta$가 모두 실수이면 $\bar{\alpha}+\beta = \alpha+\bar{\beta}$이다. ㄴ. $\alpha\bar{\alpha}=0$이면 $\alpha=\bar{\alpha}$이다. ㄷ. $\alpha^2+\beta^2=0$이면 $\alpha=0$, $\beta=0$이다. ㄹ. $\beta=\bar{\alpha}$, $\alpha\ne 0$일 때, $\alpha+\beta=0$이면 $\alpha, \beta$는 순허수이다.

**보기** ① ㄱ, ㄴ  ② ㄴ, ㄹ  ③ ㄱ, ㄴ, ㄷ  ④ ㄱ, ㄷ, ㄹ  ⑤ ㄱ, ㄴ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. - ㄱ.
2. $\alpha, \beta$가 실수이면 $\bar{\alpha}=\alpha, \bar{\beta}=\beta$이므로 $\bar{\alpha}+\beta=\alpha+\bar{\beta}$이다.
3. (참)  
- ㄴ.
4. $\alpha=a+bi$ ($a, b$는 실수)라 하면 $\alpha\bar{\alpha}=a^2+b^2=0$이므로 $a=b=0$, 즉 $\alpha=0$이고 $\alpha=\bar{\alpha}$이다.
5. (참)  
- ㄷ.
6. $\alpha=i, \beta=1$이면 $\alpha^2+\beta^2=-1+1=0$이지만 $\alpha\ne 0, \beta\ne 0$이다.
7. (거짓)  
- ㄹ.
8. $\beta=\bar{\alpha}$에서 $\alpha+\bar{\alpha}=2\operatorname{Re}(\alpha)=0$이므로 $\alpha$의 실수부분은 $0$이고 $\alpha\ne 0$이므로 $\alpha, \beta$는 순허수이다.
9. (참) 따라서 옳은 것은 ㄱ, ㄴ, ㄹ이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 복소수 $\alpha$, $\beta$와 각각의 켤」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] **원천→판정: 방정식과 부등식 > 복소수 > 복소수의 연산 > 켤레복소수 → 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산**
- 이유: Q9(bi): 복소수의 계산 단원의 RPM H1-RPM-023 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_OPERATION / TPL=TPL_H1_COMPLEX_CONJUGATE_NORM (원천과 같음) (원천과 같음)
- 이유: Q9(bi): 복소수의 계산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(bi): 복소수의 계산 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 복소수←stem:「두 복소수 $\alpha$, $\beta$」
- goal: 켤레복소수←stem:「각각의 켤레복소수 $\bar{\alpha}$, $\bar{\beta}$」
- method: 복소수(IMPLIED)←stem:「두 복소수 $\alpha$, $\beta$」 — 복소수의 실수부·허수부와 켤레 성질 및 반례를 이용해 각 명제를 판별함
- condition: 순허수←stem:「$\alpha, \beta$는 순허수이다」

**how** Q9(bi): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

- ㄱ. $\alpha, \beta$가 실수이면 $\bar{\alpha}=\alpha, \bar{\beta}=\beta$이므로 $\bar{\alpha}+\beta=\alpha+\bar{\beta}$이다. (참)  
- ㄴ. $\alpha=a+bi$ ($a, b$는 실수)라 하면 $\alpha\bar{\alpha}=a^2+b^2=0$이므로 $a=b=0$, 즉 $\alpha=0$이고 $\alpha=\bar{\alpha}$이다. (참)  
- ㄷ. $\alpha=i, \beta=1$이면 $\alpha^2+\beta^2=-1+1=0$이지만 $\alpha\ne 0, \beta\ne 0$이다. (거짓)  
- ㄹ. $\beta=\bar{\alpha}$에서 $\alpha+\bar{\alpha}=2\operatorname{Re}(\alpha)=0$이므로 $\alpha$의 실수부분은 $0$이고 $\alpha\ne 0$이므로 $\alpha, \beta$는 순허수이다. (참) 따라서 옳은 것은 ㄱ, ㄴ, ㄹ이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4.6점


**발문**

$x$에 대한 이차방정식 $x^2+2(k-a)x+(bk^2+5k-c)=0$이 실수 $k$의 값에 관계없이 항상 중근을 가질 때, 실수 $a, b, c$에 대하여 $2a+3b+4c$의 값은?

**보기** ① $-23$  ② $-25$  ③ $-27$  ④ $-29$  ⑤ $-31$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차방정식이 항상 중근을 가지므로 판별식 $\dfrac{D}{4}=0$이다.
2. $$ \dfrac{D}{4} = (k-a)^2-(bk^2+5k-c) = (1-b)k^2+(-2a-5)k+(a^2+c) = 0 $$ 이 등식이 모든 실수 $k$에 대하여 성립하므로 $k$에 대한 항등식의 성질에 의하여 $$ 1-b=0, \qquad -2a-5=0, \qquad a^2+c=0 $$ 이다.
3. 따라서 $b=1$, $a=-\dfrac{5}{2}$, $c=-a^2=-\dfrac{25}{4}$이므로 $$ 2a+3b+4c = 2\left(-\dfrac{5}{2}\right)+3(1)+4\left(-\dfrac{25}{4}\right) = -5+3-25 = -27 $$ 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_ROOT(복소수와 이차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$에 대한 이차방정식 $x^2+2(k-a)x+(bk」
**RPM** H1-RPM-031 [방정식과 부등식 > 이차방정식 > 복소수 근 > 허근] **원천→판정: 방정식과 부등식 > 이차방정식 > 복소수 근 > 계수 조건 → 방정식과 부등식 > 이차방정식 > 복소수 근 > 허근**
- 이유: Q10(bk): 복소수와 이차방정식 단원의 RPM H1-RPM-031 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_DISCRIMINANT / TPL=TPL_H1_DISCRIMINANT_PARAMETER_IDENTITY (원천과 같음) (원천과 같음)
- 이유: Q10(bk): 복소수와 이차방정식 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(bk): 복소수와 이차방정식 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2+2(k-a)x+(bk^2+5k-c)=0$」
- goal: 실수←stem:「실수 $a, b, c$에 대하여」
- method: 판별식(NAMED)←solution:「판별식 $\dfrac{D}{4}=0$이다」
- condition: 중근←stem:「항상 중근을 가질 때」

**how** Q10(bk): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

이차방정식이 항상 중근을 가지므로 판별식 $\dfrac{D}{4}=0$이다. $$ \dfrac{D}{4} = (k-a)^2-(bk^2+5k-c) = (1-b)k^2+(-2a-5)k+(a^2+c) = 0 $$ 이 등식이 모든 실수 $k$에 대하여 성립하므로 $k$에 대한 항등식의 성질에 의하여 $$ 1-b=0, \qquad -2a-5=0, \qquad a^2+c=0 $$ 이다. 따라서 $b=1$, $a=-\dfrac{5}{2}$, $c=-a^2=-\dfrac{25}{4}$이므로 $$ 2a+3b+4c = 2\left(-\dfrac{5}{2}\right)+3(1)+4\left(-\dfrac{25}{4}\right) = -5+3-25 = -27 $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4.2점


**발문**

이차함수 $y=x^2-3x+8$의 그래프가 직선 $y=-x+k$보다 항상 위쪽에 있도록 하는 자연수 $k$의 최댓값은?

**보기** ① $6$  ② $7$  ③ $8$  ④ $9$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 포물선이 직선보다 항상 위쪽에 있으려면 모든 실수 $x$에 대하여 $$ (x^2-3x+8)-(-x+k) = x^2-2x+8-k = (x-1)^2+7-k > 0 $$ 이어야 한다. (10)
2. $(x-1)^2\ge 0$이므로 최솟값 $7-k>0$, 즉 $k<7$이다.
3. 따라서 이를 만족하는 자연수 $k$의 최댓값은 $6$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=x^2-3x+8$의 그래프가 직선 $y=」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 교점 개수 → 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점**
- 이유: Q11(10): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_INTERSECTION_TANGENCY (원천과 같음) (원천과 같음)
- 이유: Q11(10): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(10): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2-3x+8$」
- goal: 최댓값←stem:「자연수 $k$의 최댓값은?」
- method: 완전제곱식(IMPLIED)←solution:「(x-1)^2+7-k > 0」 — 두 함수의 차를 완전제곱식으로 변형해 최솟값이 양수가 되도록 k 범위를 구함
- condition: 자연수←stem:「자연수 $k$의 최댓값」

**how** Q11(10): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

포물선이 직선보다 항상 위쪽에 있으려면 모든 실수 $x$에 대하여 $$ (x^2-3x+8)-(-x+k) = x^2-2x+8-k = (x-1)^2+7-k > 0 $$ 이어야 한다. $(x-1)^2\ge 0$이므로 최솟값 $7-k>0$, 즉 $k<7$이다. 따라서 이를 만족하는 자연수 $k$의 최댓값은 $6$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4.1점


**발문**

이차방정식 $3x^2-ax+4b=0$이 중근을 가질 때, $a$의 값이 최소가 되게 하는 자연수 $a, b$에 대하여 $a+b$의 값은?

**보기** ① $12$  ② $15$  ③ $18$  ④ $21$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차방정식이 중근을 가지므로 판별식 $D=0$이다. (ax)
2. $$ D = (-a)^2-4\cdot 3\cdot 4b = a^2-48b = 0 \implies a^2 = 48b = 2^4\cdot 3\cdot b $$ $a, b$는 자연수이고 $a^2$이 제곱수이면서 $2^4\cdot 3$의 배수이므로 $b$는 $3$을 인수로 가져야 하고, $a$가 최소일 때 $b=3$이다.
3. 이때 $a^2 = 2^4\cdot 3^2 = 12^2$이므로 $a=12$이다.
4. 따라서 $a+b=12+3=15$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-DISCRIMINANT(판별식과 근의 조건) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차방정식 $3x^2-ax+4b=0$이 중근을 가질 때」
**RPM** H1-RPM-028 [방정식과 부등식 > 이차방정식 > 이차방정식의 근 > 판별식] (원천과 같음)
- 이유: Q12(ax): 판별식과 근의 조건 단원의 RPM H1-RPM-028 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_DISCRIMINANT / TPL=TPL_H1_DISCRIMINANT_ROOT_EXISTENCE (원천과 같음) (원천과 같음)
- 이유: Q12(ax): 판별식과 근의 조건 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(ax): 판별식과 근의 조건 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차방정식←stem:「이차방정식 $3x^2-ax+4b=0$」
- goal: 자연수←stem:「자연수 $a, b$에 대하여」
- method: 판별식(NAMED)←solution:「판별식 $D=0$이다」
- condition: 중근←stem:「중근을 가질 때」

**how** Q12(ax): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

이차방정식이 중근을 가지므로 판별식 $D=0$이다. $$ D = (-a)^2-4\cdot 3\cdot 4b = a^2-48b = 0 \implies a^2 = 48b = 2^4\cdot 3\cdot b $$ $a, b$는 자연수이고 $a^2$이 제곱수이면서 $2^4\cdot 3$의 배수이므로 $b$는 $3$을 인수로 가져야 하고, $a$가 최소일 때 $b=3$이다. 이때 $a^2 = 2^4\cdot 3^2 = 12^2$이므로 $a=12$이다. 따라서 $a+b=12+3=15$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.5점


**발문**

이차방정식 $x^2-x-4=0$의 두 실근을 $\alpha$, $\beta$라 할 때, $\dfrac{2\alpha}{\alpha^2-3\alpha-6}+\dfrac{2\beta}{\beta^2-3\beta-6}$의 값은?

**보기** ① $-\dfrac{5}{2}$  ② $-3$  ③ $-\dfrac{13}{4}$  ④ $-\dfrac{7}{2}$  ⑤ $-4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\alpha, \beta$는 $x^2-x-4=0$의 두 근이므로 $\alpha^2=\alpha+4$, $\beta^2=\beta+4$이다. (13)
2. 따라서 분모는 $$ \alpha^2-3\alpha-6 = (\alpha+4)-3\alpha-6 = -2\alpha-2 = -2(\alpha+1) $$ 이고, 마찬가지로 $\beta^2-3\beta-6 = -2(\beta+1)$이다.
3. 준식을 정리하면 $$ -\dfrac{\alpha}{\alpha+1}-\dfrac{\beta}{\beta+1} = -\left(1-\dfrac{1}{\alpha+1}\right)-\left(1-\dfrac{1}{\beta+1}\right) = -2+\left(\dfrac{1}{\alpha+1}+\dfrac{1}{\beta+1}\right) $$ 이다.
4. 근과 계수의 관계에서 $\alpha+\beta=1$, $\alpha\beta=-4$이므로 $$ \dfrac{1}{\alpha+1}+\dfrac{1}{\beta+1} = \dfrac{\alpha+\beta+2}{\alpha\beta+\alpha+\beta+1} = \dfrac{1+2}{-4+1+1} = -\dfrac{3}{2} $$ 이다.
5. 따라서 구하는 값은 $-2-\dfrac{3}{2}=-\dfrac{7}{2}$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-06(이차방정식의 근과 계수) / H15-SA-06-ROOT_COEFFICIENT_RELATION(근과 계수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차방정식 $x^2-x-4=0$의 두 실근을 $\alp」
**RPM** H1-RPM-029 [방정식과 부등식 > 이차방정식 > 근과 계수의 관계 > 근의 합·곱] (원천과 같음)
- 이유: Q13(13): 근과 계수의 관계 단원의 RPM H1-RPM-029 유형에 해당한다.
**유형** PT=PT_H1_ROOT_COEFFICIENT_RELATION / TPL=TPL_H1_VIETA_SYMMETRIC_VALUE (원천과 같음) (원천과 같음)
- 이유: Q13(13): 근과 계수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(13): 근과 계수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 이차방정식←stem:「이차방정식 $x^2-x-4=0$」
- goal: 대칭식←solution:「\dfrac{1}{\alpha+1}+\dfrac{1}{\beta+1}」
- method: 근과계수의관계(NAMED)←solution:「근과 계수의 관계에서」
- condition: (없음)

**how** Q13(13): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\alpha, \beta$는 $x^2-x-4=0$의 두 근이므로 $\alpha^2=\alpha+4$, $\beta^2=\beta+4$이다. 따라서 분모는 $$ \alpha^2-3\alpha-6 = (\alpha+4)-3\alpha-6 = -2\alpha-2 = -2(\alpha+1) $$ 이고, 마찬가지로 $\beta^2-3\beta-6 = -2(\beta+1)$이다. 준식을 정리하면 $$ -\dfrac{\alpha}{\alpha+1}-\dfrac{\beta}{\beta+1} = -\left(1-\dfrac{1}{\alpha+1}\right)-\left(1-\dfrac{1}{\beta+1}\right) = -2+\left(\dfrac{1}{\alpha+1}+\dfrac{1}{\beta+1}\right) $$ 이다. 근과 계수의 관계에서 $\alpha+\beta=1$, $\alpha\beta=-4$이므로 $$ \dfrac{1}{\alpha+1}+\dfrac{1}{\beta+1} = \dfrac{\alpha+\beta+2}{\alpha\beta+\alpha+\beta+1} = \dfrac{1+2}{-4+1+1} = -\dfrac{3}{2} $$ 이다. 따라서 구하는 값은 $-2-\dfrac{3}{2}=-\dfrac{7}{2}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.3점


**발문**

다음 그림과 같이 밑변의 길이가 $16$, 높이가 $10$인 직각삼각형 $ABC$에 내접하는 직사각형 $EBFD$를 그렸다. 직사각형 $EBFD$의 넓이가 최대일 때 직사각형 $EBFD$의 둘레의 길이는?

**보기** ① $22$  ② $24$  ③ $26$  ④ $28$  ⑤ $30$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직사각형 $EBFD$의 가로 길이를 $\overline{BF}=x$, 세로 길이를 $\overline{EB}=y$라 하자.
2. $\overline{AB}=10$, $\overline{BC}=16$이고 $\triangle ABC \sim \triangle DFC$이므로 $$ \dfrac{y}{16-x} = \dfrac{10}{16} = \dfrac{5}{8} \implies y = 10-\dfrac{5}{8}x $$ 이다.
3. 직사각형 $EBFD$의 넓이 $S$는 $$ S = xy = x\left(10-\dfrac{5}{8}x\right) = -\dfrac{5}{8}(x-8)^2+40 $$ 이므로 $x=8$ ($0<x<16$)일 때 넓이가 최대이고, 이때 $y=10-\dfrac{5}{8}\cdot 8=5$이다.
4. 따라서 직사각형 $EBFD$의 둘레의 길이는 $2(x+y)=2(8+5)=26$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 밑변의 길이가 $16$, 높이가 $1」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용 → 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소**
- 이유: Q14(16): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_MODEL (원천과 같음) (원천과 같음)
- 이유: Q14(16): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(16): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 직각삼각형←stem:「직각삼각형 $ABC$」
- goal: 둘레←stem:「둘레의 길이는?」
- method: 이차함수(IMPLIED)←solution:「-\dfrac{5}{8}(x-8)^2+40」 — 닮음으로 두 변의 관계식을 세워 넓이의 이차함수를 완전제곱식으로 정리함
- condition: 내접←stem:「내접하는 직사각형 $EBFD$」

**how** Q14(16): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형 $EBFD$의 가로 길이를 $\overline{BF}=x$, 세로 길이를 $\overline{EB}=y$라 하자. $\overline{AB}=10$, $\overline{BC}=16$이고 $\triangle ABC \sim \triangle DFC$이므로 $$ \dfrac{y}{16-x} = \dfrac{10}{16} = \dfrac{5}{8} \implies y = 10-\dfrac{5}{8}x $$ 이다. 직사각형 $EBFD$의 넓이 $S$는 $$ S = xy = x\left(10-\dfrac{5}{8}x\right) = -\dfrac{5}{8}(x-8)^2+40 $$ 이므로 $x=8$ ($0<x<16$)일 때 넓이가 최대이고, 이때 $y=10-\dfrac{5}{8}\cdot 8=5$이다. 따라서 직사각형 $EBFD$의 둘레의 길이는 $2(x+y)=2(8+5)=26$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 3.9점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

이차함수 $y=x^2+5x+2a-1$의 그래프가 $x$축과 만날 때, $a$의 값이 될 수 있는 자연수의 개수는?

**보기** ① $0$  ② $1$  ③ $2$  ④ $4$  ⑤ $3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차함수 $y=x^2+5x+2a-1$의 그래프가 $x$축과 만나려면 이차방정식 $x^2+5x+2a-1=0$이 실근을 가져야 하므로 판별식 $D\ge 0$이어야 한다.
2. $$ D = 5^2-4(2a-1) = 25-8a+4 = 29-8a \ge 0 \implies a \le \dfrac{29}{8} = 3.625 $$ 따라서 자연수 $a$는 $1, 2, 3$의 $3$개이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=x^2+5x+2a-1$의 그래프가 $x$」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] (원천과 같음)
- 이유: Q15(25): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY (원천과 같음) (원천과 같음)
- 이유: Q15(25): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(25): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2+5x+2a-1$」
- goal: 개수←stem:「자연수의 개수는?」
- method: 판별식(NAMED)←solution:「판별식 $D\ge 0$이어야 한다」
- condition: 자연수←stem:「자연수의 개수는?」

**how** Q15(25): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

이차함수 $y=x^2+5x+2a-1$의 그래프가 $x$축과 만나려면 이차방정식 $x^2+5x+2a-1=0$이 실근을 가져야 하므로 판별식 $D\ge 0$이어야 한다. $$ D = 5^2-4(2a-1) = 25-8a+4 = 29-8a \ge 0 \implies a \le \dfrac{29}{8} = 3.625 $$ 따라서 자연수 $a$는 $1, 2, 3$의 $3$개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.1점


**발문**

이차함수 $y=2x^2+mx-7$의 그래프와 직선 $y=x+n$의 두 교점의 $x$좌표가 각각 $-2$, $1$일 때, 실수 $m, n$에 대하여 $2m+3n$의 값은?

**보기** ① $-3$  ② $-1$  ③ $1$  ④ $3$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 그래프의 교점의 $x$좌표는 이차방정식 $2x^2+mx-7=x+n$, 즉 $$ 2x^2+(m-1)x-(7+n) = 0 $$ 의 두 근이다.
2. 두 근이 $-2, 1$이고 $x^2$의 계수가 $2$이므로 $$ 2(x+2)(x-1) = 2(x^2+x-2) = 2x^2+2x-4 $$ 와 계수를 비교하면 $m-1=2$, $-(7+n)=-4$이다.
3. 따라서 $m=3$, $n=-3$이므로 $2m+3n = 2(3)+3(-3) = 6-9 = -3$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-05(이차방정식) / H15-SA-05-EQUATION_FUNCTION_RELATION(이차방정식과 이차함수의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=2x^2+mx-7$의 그래프와 직선 $y」
**RPM** H1-RPM-033 [방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 직선과 포물선 > 교점 개수 → 방정식과 부등식 > 이차방정식과 이차함수 > 그래프와 근 > x축과의 교점**
- 이유: Q16(mx): 이차방정식과 이차함수의 관계 단원의 RPM H1-RPM-033 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_GRAPH_INTERSECTION / TPL=TPL_H1_QUADRATIC_INTERSECTION_TANGENCY (원천과 같음) (원천과 같음)
- 이유: Q16(mx): 이차방정식과 이차함수의 관계 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(mx): 이차방정식과 이차함수의 관계 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=2x^2+mx-7$」
- goal: 실수←stem:「실수 $m, n$에 대하여」
- method: 계수비교(NAMED)←solution:「계수를 비교하면」
- condition: (없음)

**how** Q16(mx): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 그래프의 교점의 $x$좌표는 이차방정식 $2x^2+mx-7=x+n$, 즉 $$ 2x^2+(m-1)x-(7+n) = 0 $$ 의 두 근이다. 두 근이 $-2, 1$이고 $x^2$의 계수가 $2$이므로 $$ 2(x+2)(x-1) = 2(x^2+x-2) = 2x^2+2x-4 $$ 와 계수를 비교하면 $m-1=2$, $-(7+n)=-4$이다. 따라서 $m=3$, $n=-3$이므로 $2m+3n = 2(3)+3(-3) = 6-9 = -3$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.3점


**발문**

$x$의 값의 범위가 $-1\le x\le 4$일 때, 이차함수 $y=x^2-6x+a$의 최솟값은 $1$이다. 이 범위에서 이차함수의 최댓값은? (단, $a$는 실수)

**보기** ① $15$  ② $17$  ③ $19$  ④ $21$  ⑤ $23$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 이차함수를 표준형으로 고치면 $$ y = x^2-6x+a = (x-3)^2+a-9 $$ 이다. (15)
2. 꼭짓점의 $x$좌표 $3$이 구간 $-1\le x\le 4$에 포함되므로 최솟값은 $a-9$이다.
3. 최솟값이 $1$이므로 $a-9=1 \implies a=10$이고, $y=(x-3)^2+1$이다.
4. 구간의 양 끝값에서 $x=-1$일 때 $y=(-1-3)^2+1=17$, $x=4$일 때 $y=(4-3)^2+1=2$이므로 최댓값은 $17$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$의 값의 범위가 $-1\le x\le 4$일 때,」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] (원천과 같음)
- 이유: Q17(15): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_VERTEX_INTERVAL (원천과 같음) (원천과 같음)
- 이유: Q17(15): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(15): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 이차함수←stem:「이차함수 $y=x^2-6x+a$」
- goal: 최댓값←stem:「이차함수의 최댓값은?」
- method: 완전제곱식(IMPLIED)←solution:「(x-3)^2+a-9」 — 완전제곱식으로 꼭짓점 위치를 확인해 a를 구하고 양 끝값을 비교함
- condition: 범위←stem:「값의 범위가 $-1\le x\le 4$」

**how** Q17(15): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

이차함수를 표준형으로 고치면 $$ y = x^2-6x+a = (x-3)^2+a-9 $$ 이다. 꼭짓점의 $x$좌표 $3$이 구간 $-1\le x\le 4$에 포함되므로 최솟값은 $a-9$이다. 최솟값이 $1$이므로 $a-9=1 \implies a=10$이고, $y=(x-3)^2+1$이다. 구간의 양 끝값에서 $x=-1$일 때 $y=(-1-3)^2+1=17$, $x=4$일 때 $y=(4-3)^2+1=2$이므로 최댓값은 $17$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 단답형 5점


**발문**

다항식 $P(x)$를 $x-4$로 나누었을 때 나머지가 $7$이고, $x+2$로 나누었을 때 나머지가 $-5$이다. $P(x)$를 $(x-4)(x+2)$로 나누었을 때의 나머지를 $R(x)$라 하자. $R(4)$를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $7$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 나머지정리에 의하여 $P(4)=7$이다.
2. 한편 $P(x)$를 $(x-4)(x+2)$로 나눈 몫을 $Q(x)$, 나머지를 $R(x)$라 하면 $$ P(x) = (x-4)(x+2)Q(x)+R(x) $$ 이다.
3. 이 항등식의 양변에 $x=4$를 대입하면 $$ P(4) = (4-4)(4+2)Q(4)+R(4) = R(4) $$ 이므로 $R(4)=P(4)=7$이다.
- 작성자 답: $7$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-02(항등식과 나머지정리) / H15-SA-02-REMAINDER_FACTOR(나머지정리와 인수정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $P(x)$를 $x-4$로 나누었을 때 나머지가」
**RPM** H1-RPM-009 [다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지] **원천→판정: 다항식 > 항등식과 나머지정리 > 나머지정리 > 고차식 조건 → 다항식 > 항등식과 나머지정리 > 나머지정리 > 일차식으로 나눈 나머지**
- 이유: Q18(P): 나머지정리와 인수정리 단원의 RPM H1-RPM-009 유형에 해당한다.
**유형** PT=PT_H1_REMAINDER_THEOREM / TPL=TPL_H1_REMAINDER_COMPOSITE_DIVISOR (원천과 같음) (원천과 같음)
- 이유: Q18(P): 나머지정리와 인수정리 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(P): 나머지정리와 인수정리 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $P(x)$」
- goal: 나머지←stem:「나머지를 $R(x)$라 하자」
- method: 나머지정리(NAMED)←solution:「나머지정리에 의하여 $P(4)=7$」
- condition: (없음)

**how** Q18(P): 발문과 해설의 풀이 과정을 점검하여 정답 $7$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

나머지정리에 의하여 $P(4)=7$이다. 한편 $P(x)$를 $(x-4)(x+2)$로 나눈 몫을 $Q(x)$, 나머지를 $R(x)$라 하면 $$ P(x) = (x-4)(x+2)Q(x)+R(x) $$ 이다. 이 항등식의 양변에 $x=4$를 대입하면 $$ P(4) = (4-4)(4+2)Q(4)+R(4) = R(4) $$ 이므로 $R(4)=P(4)=7$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 단답형 5점


**발문**

어느 직육면체의 모든 모서리의 길이의 합이 $40$이고 겉넓이가 $58$일 때, 이 직육면체의 대각선의 길이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\sqrt{42}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직육면체의 가로, 세로, 높이를 각각 $a, b, c$라 하면 모든 모서리의 길이의 합이 $40$이므로 $$ 4(a+b+c) = 40 \implies a+b+c = 10 $$ 이고, 겉넓이가 $58$이므로 $2(ab+bc+ca)=58$이다.
2. 직육면체의 대각선의 길이를 $d$라 하면 $$ d^2 = a^2+b^2+c^2 = (a+b+c)^2-2(ab+bc+ca) = 10^2-58 = 100-58 = 42 $$ 이다.
3. $d>0$이므로 대각선의 길이는 $\sqrt{42}$이다.
- 작성자 답: $\sqrt{42}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-01(다항식의 연산) / H15-SA-01-POLYNOMIAL_BASIC(다항식의 기본 연산) (원천과 같음) (원천과 같음)
- 근거 인용: 「어느 직육면체의 모든 모서리의 길이의 합이 $40$이고」
**RPM** H1-RPM-001 [다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리] **원천→판정: 다항식 > 다항식의 연산 > 다항식의 곱셈 > 곱셈공식 → 다항식 > 다항식의 연산 > 다항식의 덧셈과 뺄셈 > 차수·계수 정리**
- 이유: Q19(40): 다항식의 기본 연산 단원의 RPM H1-RPM-001 유형에 해당한다.
**유형** PT=PT_H1_POLY_FORMULA_SYMMETRIC / TPL=TPL_H1_FORMULA_SYMMETRIC (원천과 같음) (원천과 같음)
- 이유: Q19(40): 다항식의 기본 연산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(40): 다항식의 기본 연산 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: 겉넓이←stem:「겉넓이가 $58$일 때」
- goal: 대각선←stem:「대각선의 길이를 구하시오」
- method: 곱셈공식(IMPLIED)←solution:「(a+b+c)^2-2(ab+bc+ca)」 — 세 항의 합의 제곱 곱셈 공식 변형을 이용해 대각선 길이의 제곱을 구함
- condition: (없음)

**how** Q19(40): 발문과 해설의 풀이 과정을 점검하여 정답 $\sqrt{42}$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직육면체의 가로, 세로, 높이를 각각 $a, b, c$라 하면 모든 모서리의 길이의 합이 $40$이므로 $$ 4(a+b+c) = 40 \implies a+b+c = 10 $$ 이고, 겉넓이가 $58$이므로 $2(ab+bc+ca)=58$이다. 직육면체의 대각선의 길이를 $d$라 하면 $$ d^2 = a^2+b^2+c^2 = (a+b+c)^2-2(ab+bc+ca) = 10^2-58 = 100-58 = 42 $$ 이다. $d>0$이므로 대각선의 길이는 $\sqrt{42}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 단답형 7점


**발문**

허수 $z$에 대하여 $z+\dfrac{4}{z}$가 실수일 때, $z+\dfrac{4}{z}+(z-1)(\bar{z}-1)$의 값을 구하시오. (단, $\bar{z}$는 $z$의 켤레복소수이다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $5$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 허수 $z=a+bi$ ($a, b$는 실수, $b\ne 0$)라 두면 $\dfrac{4}{z}=\dfrac{4(a-bi)}{a^2+b^2}$이므로 $$ z+\dfrac{4}{z} = \left(a+\dfrac{4a}{a^2+b^2}\right)+b\left(1-\dfrac{4}{a^2+b^2}\right)i $$ 이다.
2. 이 값이 실수이므로 허수부분이 $0$이어야 하고, $b\ne 0$이므로 $1-\dfrac{4}{a^2+b^2}=0$, 즉 $a^2+b^2=4$이다.
3. 따라서 $z\bar{z}=4$이고 $\dfrac{4}{z}=\bar{z}$이다.
4. 이를 구하는 식에 대입하면 $$ \begin{aligned} z+\dfrac{4}{z}+(z-1)(\bar{z}-1) &= z+\bar{z}+(z\bar{z}-z-\bar{z}+1) \ &= z\bar{z}+1 = 4+1 = 5 \end{aligned} $$ 이다.
- 작성자 답: $5$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-04(복소수) / H15-SA-04-COMPLEX_OPERATION(복소수의 계산) (원천과 같음) (원천과 같음)
- 근거 인용: 「허수 $z$에 대하여 $z+\dfrac{4}{z}$가 」
**RPM** H1-RPM-023 [방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산] **원천→판정: 방정식과 부등식 > 복소수 > i의 거듭제곱 > 복소수 조건 → 방정식과 부등식 > 복소수 > 복소수의 연산 > 사칙연산**
- 이유: Q20(bi): 복소수의 계산 단원의 RPM H1-RPM-023 유형에 해당한다.
**유형** PT=PT_H1_COMPLEX_CONDITION_EQUATION / TPL=TPL_H1_COMPLEX_REAL_IMAG_CONSTRAINT (원천과 같음) (원천과 같음)
- 이유: Q20(bi): 복소수의 계산 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(bi): 복소수의 계산 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 허수←stem:「허수 $z$에 대하여」
- goal: 켤레복소수←stem:「$\bar{z}$는 $z$의 켤레복소수이다」
- method: 복소수(IMPLIED)←stem:「허수 $z$에 대하여」 — z=a+bi의 허수부분=0 조건으로 zzbar=4를 유도해 대입함
- condition: 실수←stem:「$z+\dfrac{4}{z}$가 실수일 때」

**how** Q20(bi): 발문과 해설의 풀이 과정을 점검하여 정답 $5$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

허수 $z=a+bi$ ($a, b$는 실수, $b\ne 0$)라 두면 $\dfrac{4}{z}=\dfrac{4(a-bi)}{a^2+b^2}$이므로 $$ z+\dfrac{4}{z} = \left(a+\dfrac{4a}{a^2+b^2}\right)+b\left(1-\dfrac{4}{a^2+b^2}\right)i $$ 이다. 이 값이 실수이므로 허수부분이 $0$이어야 하고, $b\ne 0$이므로 $1-\dfrac{4}{a^2+b^2}=0$, 즉 $a^2+b^2=4$이다. 따라서 $z\bar{z}=4$이고 $\dfrac{4}{z}=\bar{z}$이다. 이를 구하는 식에 대입하면 $$ \begin{aligned} z+\dfrac{4}{z}+(z-1)(\bar{z}-1) &= z+\bar{z}+(z\bar{z}-z-\bar{z}+1) \ &= z\bar{z}+1 = 4+1 = 5 \end{aligned} $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 7점


**발문**

$a, b$가 정수이고, $n$이 $150$ 이하의 자연수일 때, 다항식 $x^3-(ab+9)x+n$ 중에서 $(x-3)(x+a)(x-b)$의 꼴로 인수분해되는 다항식의 개수를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $5$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $(x-3)(x+a)(x-b)$를 전개하면 $$ \begin{aligned} (x-3)(x+a)(x-b) &= (x-3){x^2+(a-b)x-ab} \ &= x^3+(a-b-3)x^2+{-ab-3(a-b)}x+3ab \end{aligned} $$ 이다.
2. 이 식이 $x^3-(ab+9)x+n$과 같아야 하므로 $x^2$의 계수 비교에서 $a-b-3=0$, 즉 $a=b+3$이다.
3. 이때 $x$의 계수는 $-ab-3(3)=-ab-9$로 일치하고, 상수항에서 $n=3ab=3b(b+3)$이다.
4. $n$이 $150$ 이하의 자연수이므로 $1 \le 3b(b+3) \le 150$, 즉 $1 \le b(b+3) \le 50$이다.
5. 정수 $b$에 대하여 가능한 $b(b+3)$의 값을 조사하면

- $b=1$ 또는 $b=-4$: $b(b+3)=4 \implies n=12$  
- $b=2$ 또는 $b=-5$: $b(b+3)=10 \implies n=30$  
- $b=3$ 또는 $b=-6$: $b(b+3)=18 \implies n=54$  
- $b=4$ 또는 $b=-7$: $b(b+3)=28 \implies n=84$  
- $b=5$ 또는 $b=-8$: $b(b+3)=40 \implies n=120$ ($b=6$ 또는 $b=-9$이면 $b(b+3)=54>50$) 서로 다른 자연수 $n$이 다항식 $x^3-(ab+9)x+n$을 서로 다르게 결정하고, $x$의 계수 $-(ab+9)=-\left(\frac{n}{3}+9\right)$도 유일하므로 구하는 다항식은 $5$개이다.
- 작성자 답: $5$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-03(인수분해) / H15-SA-03-FACTORIZATION(인수분해) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a, b$가 정수이고, $n$이 $150$ 이하의 자」
**RPM** H1-RPM-013 [다항식 > 인수분해 > 공통인수 > 공통인수 묶기] **원천→판정: 다항식 > 인수분해 > 인수분해의 활용 > 조건식 → 다항식 > 인수분해 > 공통인수 > 공통인수 묶기**
- 이유: Q21(150): 인수분해 단원의 RPM H1-RPM-013 유형에 해당한다.
**유형** PT=PT_H1_POLY_FACTORIZATION / TPL=TPL_H1_FACTORIZATION_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q21(150): 인수분해 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21(150): 인수분해 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: 다항식←stem:「다항식 $x^3-(ab+9)x+n$」
- goal: 개수←stem:「다항식의 개수를 구하시오」
- method: 계수비교(NAMED)←solution:「계수 비교에서 $a-b-3=0$」
- condition: 정수←stem:「$a, b$가 정수이고」

**how** Q21(150): 발문과 해설의 풀이 과정을 점검하여 정답 $5$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$(x-3)(x+a)(x-b)$를 전개하면 $$ \begin{aligned} (x-3)(x+a)(x-b) &= (x-3){x^2+(a-b)x-ab} \ &= x^3+(a-b-3)x^2+{-ab-3(a-b)}x+3ab \end{aligned} $$ 이다. 이 식이 $x^3-(ab+9)x+n$과 같아야 하므로 $x^2$의 계수 비교에서 $a-b-3=0$, 즉 $a=b+3$이다. 이때 $x$의 계수는 $-ab-3(3)=-ab-9$로 일치하고, 상수항에서 $n=3ab=3b(b+3)$이다. $n$이 $150$ 이하의 자연수이므로 $1 \le 3b(b+3) \le 150$, 즉 $1 \le b(b+3) \le 50$이다. 정수 $b$에 대하여 가능한 $b(b+3)$의 값을 조사하면

- $b=1$ 또는 $b=-4$: $b(b+3)=4 \implies n=12$  
- $b=2$ 또는 $b=-5$: $b(b+3)=10 \implies n=30$  
- $b=3$ 또는 $b=-6$: $b(b+3)=18 \implies n=54$  
- $b=4$ 또는 $b=-7$: $b(b+3)=28 \implies n=84$  
- $b=5$ 또는 $b=-8$: $b(b+3)=40 \implies n=120$ ($b=6$ 또는 $b=-9$이면 $b(b+3)=54>50$) 서로 다른 자연수 $n$이 다항식 $x^3-(ab+9)x+n$을 서로 다르게 결정하고, $x$의 계수 $-(ab+9)=-\left(\frac{n}{3}+9\right)$도 유일하므로 구하는 다항식은 $5$개이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 6점


**발문**

한 변의 길이가 $16,\mathrm{cm}$인 정사각형 모양의 철판의 양쪽을 구부려서 오른쪽 그림과 같이 단면이 직사각형 모양인 물받이를 만들려고 한다. 색칠한 단면의 넓이가 최대가 되도록 하려면 물받이의 높이를 몇 $\mathrm{cm}$로 해야 하는지 구하고, 그때의 색칠한 단면의 넓이를 구하시오. (단, 철판의 두께는 생각하지 않는다.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 높이 $4,\mathrm{cm}$, 넓이 $32,\mathrm{cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 물받이의 높이를 $x,\mathrm{cm}$라 하면 양쪽에서 각각 $x,\mathrm{cm}$씩 구부리므로 밑면의 폭은 $(16-2x),\mathrm{cm}$이고, $0<x<8$이다.
2. 색칠한 직사각형 단면의 넓이를 $S$라 하면 $$ S = x(16-2x) = -2x^2+16x = -2(x-4)^2+32 $$ 이다.
3. $0<x<8$에서 $x=4$일 때 $S$는 최댓값 $32$를 가진다.
4. 따라서 물받이의 높이는 $4,\mathrm{cm}$, 색칠한 단면의 최대 넓이는 $32,\mathrm{cm}^2$이다.
- 작성자 답: 높이 $4,\mathrm{cm}$, 넓이 $32,\mathrm{cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-SA-13(이차함수) / H15-SA-13-QUADRATIC_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 변의 길이가 $16,\mathrm{cm}$인 정사각」
**RPM** H1-RPM-037 [방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소] **원천→판정: 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 조건식 활용 → 방정식과 부등식 > 이차방정식과 이차함수 > 최대·최소 > 구간 최대·최소**
- 이유: Q22(16): 이차함수의 활용 단원의 RPM H1-RPM-037 유형에 해당한다.
**유형** PT=PT_H1_QUADRATIC_EXTREMA / TPL=TPL_H1_QUADRATIC_EXTREMA_MODEL (원천과 같음) (원천과 같음)
- 이유: Q22(16): 이차함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22(16): 이차함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: 직사각형←stem:「단면이 직사각형 모양인」
- goal: 최댓값←solution:「최댓값 $32$를 가진다」
- method: 이차함수(IMPLIED)←solution:「-2(x-4)^2+32」 — 단면 넓이를 x에 대한 이차함수로 세우고 완전제곱식으로 최댓값을 구함
- condition: 범위←solution:「0<x<8」

**how** Q22(16): 발문과 해설의 풀이 과정을 점검하여 정답 높이 $4,\mathrm{cm}$, 넓이 $32,\mathrm{cm}^2$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

물받이의 높이를 $x,\mathrm{cm}$라 하면 양쪽에서 각각 $x,\mathrm{cm}$씩 구부리므로 밑면의 폭은 $(16-2x),\mathrm{cm}$이고, $0<x<8$이다. 색칠한 직사각형 단면의 넓이를 $S$라 하면 $$ S = x(16-2x) = -2x^2+16x = -2(x-4)^2+32 $$ 이다. $0<x<8$에서 $x=4$일 때 $S$는 최댓값 $32$를 가진다. 따라서 물받이의 높이는 $4,\mathrm{cm}$, 색칠한 단면의 최대 넓이는 $32,\mathrm{cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
