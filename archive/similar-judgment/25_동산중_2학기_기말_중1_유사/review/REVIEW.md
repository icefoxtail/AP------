# 검수 묶음 — 25_동산중_2학기_기말_중1_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 24개 / 검사 PASS 23, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 15, 2단계 9
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q8**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q9**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q10**: 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q12**: 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q21**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3점


**발문**

곱셈 기호와 나눗셈 기호를 생략하여 나타낸 식으로 옳은 것은? [3점]

**보기** ① $a \times a \times a \times a = a^4$  ② $(-3) \times x = x - 3$  ③ $p \div 5 = 5p$  ④ $(x + 3) \times 2 = 2x + 3$  ⑤ $y \times (-1) = y - 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) \begin{aligned} a \times a \times a \times a = a^4 \end{aligned} (참)
2. 2) (-3) * x = -3x (거짓)
3. 3) p / 5 = p/5 (거짓)
4. 4) (x + 3) * 2 = 2x + 6 (거짓)
5. 5) y * (-1) = -y (거짓)
6. 따라서 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「곱셈 기호와 나눗셈 기호를 생략하여 나타낸 식으로 옳은 것은? [3점]」
**RPM** M1-RPM-141 [문자와 식 > 문자의 사용과 식의 계산 > 문자의 사용 > 곱셈·나눗셈 기호 생략] (원천과 같음)
- 이유: 해설의 \begin{aligned} a \times a \times a \times a = a^4 \end{aligned} 정리와 같이 곱셈 기호와 나눗셈 기호를 생략하여 문자의 거듭제곱과 곱셈을 나타내는 M1-RPM-141에 해당한다.
**유형** PT=PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION / TPL=TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_OPERATION_NOTATION (원천과 같음) (원천과 같음)
- 이유: 수식 \begin{aligned} a \times a \times a \times a = a^4 \end{aligned} 등의 보기를 통해 곱셈 기호와 나눗셈 기호 생략 표기법의 옳고 그름을 검사하는 PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION과 TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_OPERATION_NOTATION이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 곱셈 생략 규칙 \begin{aligned} a \times a \times a \times a = a^4 \end{aligned} 를 직접 확인하는 기본 1단계 문제이다.

**4칸**
- given: 다항식의나눗셈←stem:「곱셈 기호와 나눗셈 기호를 생략하」
- goal: 곱셈공식←stem:「곱셈 기호와 나눗셈」
- method: 규칙(NAMED)←solution:「기호의 생략 규칙에 따라 각 보」
- condition: (없음)

**how** 수식 \begin{aligned} a \times a \times a \times a = a^4 \end{aligned} 가 올바름을 점검하여 정답 ①로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

곱셈 기호와 나눗셈 기호의 생략 규칙에 따라 각 보기를 확인한다. $$\begin{aligned} \text{① } & a \times a \times a \times a = a^4\text{ (참)} \ \text{② } & (-3) \times x = -3x\text{ (거짓)} \ \text{③ } & p \div 5 = \dfrac{p}{5}\text{ (거짓)} \ \text{④ } & (x + 3) \times 2 = 2(x + 3) = 2x + 6\text{ (거짓)} \ \text{⑤ } & y \times (-1) = -y\text{ (거짓)} \end{aligned}$$ 따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

초콜릿 $x$개를 $4$명의 학생에게 똑같이 나누어 주었더니 $3$개가 남았다. 한 학생이 받는 초콜릿의 개수를 문자를 사용한 식으로 나타낸 것은? [4점]

**보기** ① $\left(\dfrac{x}{4} + 3\right)$개  ② $\left(\dfrac{x - 3}{4}\right)$개  ③ $\left(\dfrac{x + 3}{4}\right)$개  ④ $(4x + 3)$개  ⑤ $\left(\dfrac{x}{4} - 3\right)$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) \begin{aligned} (x - 3) \end{aligned} 개를 4명에게 똑같이 나누어 준다.
2. 2) 한 학생이 받는 개수는 (x - 3) / 4 개이다.
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 학생이 받는 초콜릿의 개수를 문자를 사용한 식으로 나타낸 것은? [4점]」
**RPM** M1-RPM-140 [문자와 식 > 문자의 사용과 식의 계산 > 문자의 사용 > 문자로 수량 나타내기] (원천과 같음)
- 이유: 초콜릿 x개를 4명에게 나누어 줄 때 남은 3개를 제외한 \begin{aligned} (x - 3) \end{aligned} 을 4로 나누어 문자로 수량 관계식을 세우는 M1-RPM-140에 해당한다.
**유형** PT=PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION / TPL=TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION (원천과 같음) (원천과 같음)
- 이유: 전체 x개 중 3개를 제외한 \begin{aligned} (x - 3) \end{aligned} 을 4명에게 분배하는 실생활 수량 관계를 (x - 3)/4로 번역하는 PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION과 TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: x개에서 3개를 빼고 4명에게 나누는 \begin{aligned} (x - 3)/4 \end{aligned} 일차 수량 번역 기본 문제로 난이도 1이다.

**4칸**
- given: 개수←stem:「받는 초콜릿의 개수를 문자를 사용」
- goal: 개수←solution:「준 초콜릿의 개수는 $$\beg」
- method: 제외(NAMED)←solution:「은 $3$개를 제외하면 실제로 $」
- condition: (없음)

**how** 초콜릿 x개 중 3개를 제외한 \begin{aligned} (x - 3)/4 \end{aligned} 를 구하여 정답 ②로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

전체 $x$개 중 남은 $3$개를 제외하면 실제로 $4$명에게 똑같이 나누어 준 초콜릿의 개수는 $$\begin{aligned} (x - 3)\text{ (개)} \end{aligned}$$ 이 초콜릿을 $4$명에게 똑같이 나누어 주므로 한 학생이 받는 초콜릿의 개수는 $$\begin{aligned} (x - 3) \div 4 &= \dfrac{x - 3}{4}\text{ (개)} \end{aligned}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점


**발문**

$x = 3$일 때, 식 $4x - 5$의 값은? [3점]

**보기** ① $5$  ② $6$  ③ $7$  ④ $8$  ⑤ $9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 주어진 식 4x - 5의 x에 3을 대입한다.
2. 2) 4 * 3 - 5 = 12 - 5 = 7이다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x = 3$일 때, 식 $4x - 5$의 값은? [3점]」
**RPM** M1-RPM-142 [문자와 식 > 문자의 사용과 식의 계산 > 식의 값 > 대입하여 식의 값 구하기] (원천과 같음)
- 이유: x = 3일 때 일차식 4x - 5에 대입하여 4*3 - 5 = 12 - 5 = 7을 구하는 M1-RPM-142에 해당한다.
**유형** PT=PT_M1_LITERAL_EXPRESSION_EVALUATION / TPL=TPL_M1_LITERAL_EXPRESSION_NUMERIC_SUBSTITUTION (원천과 같음) (원천과 같음)
- 이유: 일차식 4x - 5에 x = 3을 직접 대입하여 12 - 5 = 7을 계산하는 전형적인 PT_M1_LITERAL_EXPRESSION_EVALUATION과 TPL_M1_LITERAL_EXPRESSION_NUMERIC_SUBSTITUTION이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: x = 3을 4x - 5에 대입하여 12 - 5 = 7을 바로 얻는 1단계 기본 문제이므로 난이도 1이다.

**4칸**
- given: (없음)
- goal: 자릿수←solution:「5$의 $x$ 자리에 $3$을 대」
- method: 대입(NAMED)←solution:「리에 $3$을 대입하여 계산한다.」
- condition: (없음)

**how** x = 3을 4x - 5에 대입하여 4*3 - 5 = 12 - 5 = 7을 계산하여 정답 ③으로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식 $4x - 5$의 $x$ 자리에 $3$을 대입하여 계산한다. $$\begin{aligned} 4x - 5 &= 4 \times 3 - 5 \ &= 12 - 5 \ &= 7 \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

$a = -3, b = -2$일 때, $-a^2 - \dfrac{6}{b}$의 값은? [4점]

**보기** ① $-12$  ② $-10$  ③ $-8$  ④ $-6$  ⑤ $-4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) a = -3, b = -2를 식 -a^2 - 6/b 에 대입한다.
2. 2) -(-3)^2 - 6/(-2) = -9 - (-3) = -9 + 3 = -6이다.
3. 3) 보기의 -12, -10 등 중 -6에 해당한다.
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「$a = -3, b = -2$일 때, $-a^2 - \dfrac{6}{b}$의 값은? [4점]」
**RPM** M1-RPM-142 [문자와 식 > 문자의 사용과 식의 계산 > 식의 값 > 대입하여 식의 값 구하기] (원천과 같음)
- 이유: a = -3, b = -2를 대입하여 -a^2 - 6/b의 값을 계산하여 보기 -12, -10 중에서 -6을 찾는 M1-RPM-142에 해당한다.
**유형** PT=PT_M1_LITERAL_EXPRESSION_EVALUATION / TPL=TPL_M1_LITERAL_EXPRESSION_NUMERIC_SUBSTITUTION (원천과 같음) (원천과 같음)
- 이유: 음수 a = -3, b = -2를 거듭제곱과 분수가 포함된 식에 대입하여 보기 -12, -10 등의 선지와 비교하여 -6을 계산하는 PT_M1_LITERAL_EXPRESSION_EVALUATION과 TPL_M1_LITERAL_EXPRESSION_NUMERIC_SUBSTITUTION이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 음수 a=-3의 제곱 -(-3)^2=-9와 분수 6/(-2)=-3의 부호 처리를 거쳐 보기 -12, -10과 비교하는 2단계 대입 계산으로 난이도 2이다.

**4칸**
- given: (없음)
- goal: 거듭제곱←solution:「를 대입한다. 거듭제곱과 나눗셈을 먼」
- method: 대입(NAMED)←solution:「= -2$를 대입한다. 거듭제곱」
- condition: (없음)

**how** a = -3, b = -2를 대입하여 -(-3)^2 - 6/(-2) = -6을 계산하고 보기 -12, -10 등 중 -6을 정답 ④로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 식에 $a = -3, b = -2$를 대입한다. 거듭제곱과 나눗셈을 먼저 계산하면 $$\begin{aligned} -a^2 - \dfrac{6}{b} &= -(-3)^2 - \dfrac{6}{-2} \ &= -9 - (-3) \ &= -9 + 3 \ &= -6 \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점


**발문**

식 $2x - 5$에 대한 설명으로 옳은 것은? [3점]

**보기** ① 항은 $2x$와 $5$로 $2$개이다.  ② $x$의 계수는 없다.  ③ 상수항은 $5$이다.  ④ 단항식이다.  ⑤ 일차식이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) \begin{aligned} 2x - 5 \end{aligned} 의 항은 2x, -5이다.
2. 2) x의 계수는 2이고, 상수항은 -5이다.
3. 3) 차수가 1이므로 일차식이다.
4. 4) 따라서 옳은 설명은 ⑤ '일차식이다'이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「식 $2x - 5$에 대한 설명으로 옳은 것은? [3점]」
**RPM** M1-RPM-144 [문자와 식 > 문자의 사용과 식의 계산 > 일차식 > 일차식과 계수·상수항] (원천과 같음)
- 이유: 다항식 \begin{aligned} 2x - 5 \end{aligned} 의 항, x의 계수 2, 상수항 -5, 차수 1을 판별하여 일차식임을 확인하는 M1-RPM-144에 해당한다.
**유형** PT=PT_M1_LINEAR_EXPRESSION_STRUCTURE / TPL=TPL_M1_LINEAR_EXPRESSION_TERM_COEFFICIENT_AUDIT (원천과 같음) (원천과 같음)
- 이유: 일차식 \begin{aligned} 2x - 5 \end{aligned} 의 항과 계수, 상수항 구조를 점검하여 성질을 판별하는 PT_M1_LINEAR_EXPRESSION_STRUCTURE와 TPL_M1_LINEAR_EXPRESSION_TERM_COEFFICIENT_AUDIT이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 식 \begin{aligned} 2x - 5 \end{aligned} 의 차수가 1이므로 일차식임을 개념 정의로 직접 확인하는 기본 문제로 난이도 1이다.

**4칸**
- given: 상수항←choices:「계수는 없다. 상수항은 $5$이다.」
- goal: 일차식←choices:「단항식이다. 일차식이다.」
- method: 판정(NAMED)←solution:「선지의 진술을 판별하면 $$\be」
- condition: (없음)

**how** 식 \begin{aligned} 2x - 5 \end{aligned} 에서 차수가 1인 다항식이므로 일차식임을 판별하여 정답 ⑤로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

식 $2x - 5$의 구조를 파악한다. $$\begin{aligned} \text{항} &: 2x, -5 \ x\text{의 계수} &: 2 \ \text{상수항} &: -5 \ \text{차수} &: 1\text{ (일차식)} \end{aligned}$$ 각 선지의 진술을 판별하면 $$\begin{aligned} \text{① } & \text{항은 } 2x\text{와 } -5\text{이므로 거짓이다.} \ \text{② } & x\text{의 계수는 } 2\text{이므로 거짓이다.} \ \text{③ } & \text{상수항은 } -5\text{이므로 거짓이다.} \ \text{④ } & \text{항이 } 2\text{개인 다항식이므로 거짓이다.} \ \text{⑤ } & \text{차수가 } 1\text{인 다항식이므로 일차식이다. (참)} \end{aligned}$$ 따라서 옳은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3점


**발문**

다음은 다항식 $3x + 2 + 2x - 7$을 간단히 하는 과정에 대한 설명이다. ㉠~㉢에 들어갈 것으로 옳은 것은? [3점]

• $3x + 2 + 2x - 7$에서 $3x$와 ㉠, $+2$와 ㉡은 동류항이므로 간단히 정리하면 ㉢이다.

**보기** ① ㉠ $+2x$, ㉡ $-7$, ㉢ $5x - 5$  ② ㉠ $+2x$, ㉡ $-7$, ㉢ $5x - 9$  ③ ㉠ $+2x$, ㉡ $-7$, ㉢ $x - 5$  ④ ㉠ $-7$, ㉡ $+2x$, ㉢ $5x - 5$  ⑤ ㉠ $-7$, ㉡ $+2x$, ㉢ $5x + 9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) \begin{aligned} 3x + 2 + 2x - 7 \end{aligned} 에서 3x의 동류항은 +2x(㉠)이다.
2. 2) +2의 동류항은 -7(㉡)이다.
3. 3) 동류항끼리 묶어 정리하면 (3x + 2x) + (2 - 7) = 5x - 5(㉢)이다.
4. 따라서 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 다항식 $3x + 2 + 2x - 7$을 간단히 하는 과정에 대한 설명이다. ㉠~㉢에 들어갈 것으로 옳은 것은? [3점]」
**RPM** M1-RPM-145 [문자와 식 > 문자의 사용과 식의 계산 > 일차식 > 동류항 정리] (원천과 같음)
- 이유: 다항식 \begin{aligned} 3x + 2 + 2x - 7 \end{aligned} 에서 동류항을 찾아 묶고 정리하는 M1-RPM-145에 해당한다.
**유형** PT=PT_M1_LINEAR_EXPRESSION_STRUCTURE / TPL=TPL_M1_LINEAR_EXPRESSION_LIKE_TERMS (원천과 같음) (원천과 같음)
- 이유: 식 \begin{aligned} 3x + 2 + 2x - 7 \end{aligned} 에서 문자와 차수가 같은 동류항을 묶어 5x - 5로 정리하는 PT_M1_LINEAR_EXPRESSION_STRUCTURE와 TPL_M1_LINEAR_EXPRESSION_LIKE_TERMS이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 동류항의 뜻을 알고 \begin{aligned} 3x + 2x = 5x \end{aligned} 및 2 - 7 = -5를 구하는 기본 1단계 문제이다.

**4칸**
- given: 다항식←stem:「다음은 다항식 $3x + 2 + 2x - 7$을」
- goal: 동류항←stem:「$3x$와 ㉠, $+2$와 ㉡은 동류항이므로」
- method: 동류항(NAMED)←solution:「문자와 차수가 같은 항을 동류항이라 한」
- condition: (없음)

**how** 다항식 \begin{aligned} 3x + 2 + 2x - 7 \end{aligned} 에서 동류항을 정리하여 5x - 5를 얻어 정답 ①로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

문자와 차수가 같은 항을 동류항이라 한다. $$\begin{aligned} 3x\text{의 동류항} &: +2x\text{ (㉠)} \ +2\text{의 동류항(상수항)} &: -7\text{ (㉡)} \end{aligned}$$ 동류항끼리 묶어서 덧셈과 뺄셈을 하면 $$\begin{aligned} 3x + 2 + 2x - 7 &= (3x + 2x) + (2 - 7) \ &= 5x - 5\text{ (㉢)} \end{aligned}$$ 따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

$(5 - 2x) - (-4x - 3)$을 계산한 식은? [4점]

**보기** ① $2x + 2$  ② $2x + 8$  ③ $-6x + 2$  ④ $-6x + 8$  ⑤ $6x + 8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) \begin{aligned} (5 - 2x) - (-4x - 3) = 5 - 2x + 4x + 3 \end{aligned}
2. 2) 동류항끼리 묶으면 (-2x + 4x) + (5 + 3) = 2x + 8이다.
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(5 - 2x) - (-4x - 3)$을 계산한 식은? [4점]」
**RPM** M1-RPM-147 [문자와 식 > 문자의 사용과 식의 계산 > 일차식의 계산 > 괄호가 있는 일차식 계산] (원천과 같음)
- 이유: 괄호 앞의 뺄셈 기호가 있는 식 \begin{aligned} (5 - 2x) - (-4x - 3) \end{aligned} 을 부호 분배 후 정리하는 M1-RPM-147에 해당한다.
**유형** PT=PT_M1_LINEAR_EXPRESSION_STRUCTURE / TPL=TPL_M1_LINEAR_EXPRESSION_SIGNED_SUM_DIFFERENCE (원천과 같음) (원천과 같음)
- 이유: 일차식 \begin{aligned} (5 - 2x) - (-4x - 3) \end{aligned} 의 괄호를 풀고 덧셈·뺄셈을 수행하여 2x + 8을 구하는 PT_M1_LINEAR_EXPRESSION_STRUCTURE와 TPL_M1_LINEAR_EXPRESSION_SIGNED_SUM_DIFFERENCE이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부호 분배를 통해 \begin{aligned} 5 - 2x + 4x + 3 = 2x + 8 \end{aligned} 로 정리하는 기본 1단계 문제이다.

**4칸**
- given: (없음)
- goal: 부호←solution:「항에 분배하여 부호를 바꾼다」
- method: 분배(NAMED)←solution:「안의 각 항에 분배하여 부호」
- condition: (없음)

**how** 식 \begin{aligned} (5 - 2x) - (-4x - 3) \end{aligned} 의 괄호를 전개하여 2x + 8을 얻어 정답 ②로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

괄호 앞의 뺄셈 기호를 괄호 안의 각 항에 분배하여 부호를 바꾼다. $$\begin{aligned} (5 - 2x) - (-4x - 3) &= 5 - 2x + 4x + 3 \ &= (-2x + 4x) + (5 + 3) \ &= 2x + 8 \end{aligned}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$(12x - 18) \div \left(-\dfrac{3}{2}\right)$을 계산한 식은? [4점]

**보기** ① $-8x - 12$  ② $8x - 12$  ③ $-8x + 12$  ④ $-6x + 9$  ⑤ $6x - 9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) (12x - 18) / (-3/2) = (12x - 18) * (-2/3)
2. 2) 12x * (-2/3) - 18 * (-2/3) = -8x + 12이다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「$(12x - 18) \div \left(-\dfrac{3}{2}\right)$을 계산한 식은? [4점]」
**RPM** M1-RPM-147 [문자와 식 > 문자의 사용과 식의 계산 > 일차식의 계산 > 괄호가 있는 일차식 계산] **원천→판정: 문자와 식 > 문자의 사용과 식의 계산 > 일차식의 계산 > 일차식의 덧셈·뺄셈 → 문자와 식 > 문자의 사용과 식의 계산 > 일차식의 계산 > 괄호가 있는 일차식 계산**
- 이유: 일차식 (12x - 18)에 분수 나눗셈을 역수 곱셈으로 바꾸어 분배하는 M1-RPM-147에 해당한다.
**유형** PT=PT_M1_LINEAR_EXPRESSION_STRUCTURE / TPL=TPL_M1_LINEAR_EXPRESSION_SCALAR_OPERATION (원천과 같음) (원천과 같음)
- 이유: 일차식 (12x - 18)에 음의 분수 나눗셈을 적용하여 -8x + 12로 정리하는 수배·나눗셈 유형이므로 PT_M1_LINEAR_EXPRESSION_STRUCTURE와 TPL_M1_LINEAR_EXPRESSION_SCALAR_OPERATION이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: (12x - 18)에 역수 -2/3을 곱하여 계수 12와 18을 각각 계산하는 1단계 기본 문제이다.

**4칸**
- given: (없음)
- goal: 분수←solution:「분수의 나눗셈은 역」
- method: 분배법칙(NAMED)←solution:「셈으로 바꾸어 분배법칙을 적」
- condition: (없음)

**how** (12x - 18)에 역수 -2/3을 분배하여 -8x + 12를 얻어 정답 ③으로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

분수의 나눗셈은 역수의 곱셈으로 바꾸어 분배법칙을 적용한다. $$\begin{aligned} (12x - 18) \div \left(-\dfrac{3}{2}\right) &= (12x - 18) \times \left(-\dfrac{2}{3}\right) \ &= 12x \times \left(-\dfrac{2}{3}\right) - 18 \times \left(-\dfrac{2}{3}\right) \ &= -8x + 12 \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$\dfrac{1}{3}(-x - 2) - \dfrac{2x - 5}{6}$를 계산한 식은? [5점]

**보기** ① $-\dfrac{2}{3}x - \dfrac{1}{6}$  ② $-\dfrac{1}{2}x + \dfrac{1}{6}$  ③ $-\dfrac{2}{3}x + \dfrac{7}{6}$  ④ $-\dfrac{2}{3}x + \dfrac{1}{6}$  ⑤ $-\dfrac{4}{3}x + \dfrac{1}{6}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) \begin{aligned} \dfrac{1}{3}(-x - 2) - \dfrac{2x - 5}{6} = \dfrac{2(-x - 2) - (2x - 5)}{6} \end{aligned}
2. 2) 분자를 전개하면 -2x - 4 - 2x + 5 = -4x + 1이다.
3. 3) -4x/6 + 1/6 = -2/3 x + 1/6이다.
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\dfrac{1}{3}(-x - 2) - \dfrac{2x - 5}{6}$를 계산한 식은? [5점]」
**RPM** M1-RPM-147 [문자와 식 > 문자의 사용과 식의 계산 > 일차식의 계산 > 괄호가 있는 일차식 계산] **원천→판정: 문자와 식 > 문자의 사용과 식의 계산 > 일차식의 계산 > 일차식의 덧셈·뺄셈 → 문자와 식 > 문자의 사용과 식의 계산 > 일차식의 계산 > 괄호가 있는 일차식 계산**
- 이유: 분모 3과 6의 공통분모 6으로 통분하여 일차식을 계산하는 \begin{aligned} \dfrac{-4x + 1}{6} = -\dfrac{2}{3}x + \dfrac{1}{6} \end{aligned} 정리 M1-RPM-147에 해당한다.
**유형** PT=PT_M1_LINEAR_EXPRESSION_STRUCTURE / TPL=TPL_M1_LINEAR_EXPRESSION_SIGNED_SUM_DIFFERENCE (원천과 같음) (원천과 같음)
- 이유: 분수 꼴의 두 일차식을 통분하여 \begin{aligned} -\dfrac{2}{3}x + \dfrac{1}{6} \end{aligned} 로 정리하는 PT_M1_LINEAR_EXPRESSION_STRUCTURE와 TPL_M1_LINEAR_EXPRESSION_SIGNED_SUM_DIFFERENCE이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 통분과 분자 괄호 전개 및 동류항 정리를 거치는 \begin{aligned} -\dfrac{2}{3}x + \dfrac{1}{6} \end{aligned} 2단계 분수 일차식 연산으로 난이도 2이다.

**4칸**
- given: (없음)
- goal: 최소공배수←solution:「분모의 최소공배수인 $6$으」
- method: 동류항(NAMED)←solution:「으로 통분하여 동류항을 정리」
- condition: (없음)

**how** 분모 6으로 통분하여 분자를 정리한 뒤 \begin{aligned} -\dfrac{2}{3}x + \dfrac{1}{6} \end{aligned} 을 도출하여 정답 ④로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

분모의 최소공배수인 $6$으로 통분하여 동류항을 정리한다. $$\begin{aligned} \dfrac{1}{3}(-x - 2) - \dfrac{2x - 5}{6} &= \dfrac{-x - 2}{3} - \dfrac{2x - 5}{6} \ &= \dfrac{2(-x - 2) - (2x - 5)}{6} \ &= \dfrac{-2x - 4 - 2x + 5}{6} \ &= \dfrac{-4x + 1}{6} \ &= -\dfrac{4}{6}x + \dfrac{1}{6} \ &= -\dfrac{2}{3}x + \dfrac{1}{6} \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

다음 문장을 등식으로 바르게 나타낸 것은? [4점]

• 한 자루에 $x$원인 볼펜을 $4$자루 사고 $10000$원을 내었더니 거스름돈이 $2800$원이었다.

**보기** ① $4x - 10000 = 2800$  ② $4x + 10000 = 2800$  ③ $10000 + 4x = 2800$  ④ $4x = 12800$  ⑤ $10000 - 4x = 2800$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 볼펜 4자루의 가격은 4 * x = 4x원이다.
2. 2) 10000원을 내고 거스름돈이 2800원이므로 (낸 돈) - (물건값) = 2800원이다.
3. 3) 따라서 등식은 10000 - 4x = 2800이다.
4. 따라서 바르게 나타낸 것은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-LINEAR_EQUATION(일차방정식) (원천과 같음) **원천→판정: M1-03-LINEAR_EQUATION_WORD → M1-03-LINEAR_EQUATION**
- 근거 인용: 「다음 문장을 등식으로 바르게 나타낸 것은? [4점] • 한 자루에 $x$원인 볼펜을 $4$자루 사고 $10000$원을 내었더니 거스름돈이 $2800$원이었다.」
**RPM** M1-RPM-148 [문자와 식 > 일차방정식의 풀이 > 등식과 방정식 > 등식의 성질] **원천→판정: 문자와 식 > 일차방정식의 활용 > 생활 속 관계식 > 요금·가격 → 문자와 식 > 일차방정식의 풀이 > 등식과 방정식 > 등식의 성질**
- 이유: 볼펜 4자루를 사고 10000원을 낸 뒤 거스름돈 2800원을 받는 상황을 등식 10000 - 4x = 2800으로 세우는 M1-RPM-148에 해당한다.
**유형** PT=PT_M1_LINEAR_EQUATION_MODELING / TPL=TPL_M1_LINEAR_EQUATION_MODEL_QUANTITY (원천과 같음) (원천과 같음)
- 이유: 실생활 거스름돈 상황에서 10000 - 4x = 2800의 일차방정식 등식을 모델링하는 PT_M1_LINEAR_EQUATION_MODELING과 TPL_M1_LINEAR_EQUATION_MODEL_QUANTITY이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 낸 돈 10000원에서 총액 4x를 뺀 값이 거스름돈 2800원임을 등식으로 바로 세우는 기본 1단계 문제이다.

**4칸**
- given: 등식←stem:「다음 문장을 등식으로 바르게 나」
- goal: 등식←stem:「다음 문장을 등식으로 바르게 나」
- method: 등식(NAMED)←stem:「다음 문장을 등식으로 바르게 나」
- condition: (없음)

**how** 10000원에서 4x를 뺀 거스름돈 2800원으로부터 등식 10000 - 4x = 2800을 도출하여 정답 ⑤로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

볼펜 $4$자루의 총 가격은 $$\begin{aligned} 4 \times x = 4x\text{ (원)} \end{aligned}$$ 거스름돈은 지불한 금액에서 물건의 가격을 뺀 값이므로 $$\begin{aligned} (\text{낸 돈}) - (\text{물건값}) &= (\text{거스름돈}) \ 10000 - 4x &= 2800 \end{aligned}$$ 따라서 바르게 나타낸 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 3점


**발문**

다음 일차방정식 중 해가 $x = 2$인 것은? [3점]

**보기** ① $3x - 2 = 4$  ② $x + 3 = 1$  ③ $2x = -4$  ④ $5 - x = 1$  ⑤ $-\dfrac{x}{2} = 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) \begin{aligned} 3 \times 2 - 2 = 6 - 2 = 4 \end{aligned} 이므로 ①은 참이다.
2. 2) 나머지 보기 ②, ③, ④, ⑤에 x = 2를 대입하면 좌변과 우변이 일치하지 않는다.
3. 따라서 해가 x = 2인 방정식은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-LINEAR_EQUATION(일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 일차방정식 중 해가 $x = 2$인 것은? [3점]」
**RPM** M1-RPM-149 [문자와 식 > 일차방정식의 풀이 > 등식과 방정식 > 방정식의 해] (원천과 같음)
- 이유: x = 2를 일차방정식에 대입하여 \begin{aligned} 3 \times 2 - 2 = 4 \end{aligned} 임을 확인하고 방정식의 해를 찾는 M1-RPM-149에 해당한다.
**유형** PT=PT_M1_LINEAR_EQUATION_SOLVING / TPL=TPL_M1_LINEAR_EQUATION_SOLUTION_SUBSTITUTION (원천과 같음) (원천과 같음)
- 이유: 주어진 수 x = 2를 각 일차방정식에 대입하여 \begin{aligned} 3 \times 2 - 2 = 4 \end{aligned} 의 참·거짓을 검증하는 PT_M1_LINEAR_EQUATION_SOLVING과 TPL_M1_LINEAR_EQUATION_SOLUTION_SUBSTITUTION이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: x = 2를 보기 ① 3x - 2 = 4에 대입하여 \begin{aligned} 6 - 2 = 4 \end{aligned} 를 바로 확인하는 기본 1단계 문제이다.

**4칸**
- given: 일차방정식←stem:「다음 일차방정식 중 해가 $x = 2$인 것은?」
- goal: 일차방정식←stem:「다음 일차방정식 중 해가 $x = 2$인 것은?」
- method: 대입(NAMED)←solution:「각 일차방정식에 $x = 2$를 대입하여 등식이 참이 되는지 확인한다.」
- condition: (없음)

**how** x = 2를 각 방정식에 대입하여 \begin{aligned} 3 \times 2 - 2 = 4 \end{aligned} 가 참임을 확인하고 정답 ①로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

각 일차방정식에 $x = 2$를 대입하여 등식이 참이 되는지 확인한다. $$\begin{aligned} \text{① } & 3 \times 2 - 2 = 6 - 2 = 4 = (\text{우변})\text{ (참)} \ \text{② } & 2 + 3 = 5 \neq 1\text{ (거짓)} \ \text{③ } & 2 \times 2 = 4 \neq -4\text{ (거짓)} \ \text{④ } & 5 - 2 = 3 \neq 1\text{ (거짓)} \ \text{⑤ } & -\dfrac{2}{2} = -1 \neq 1\text{ (거짓)} \end{aligned}$$ 따라서 해가 $x = 2$인 방정식은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 일차방정식의 풀이 과정에서 (가), (나)에 이용된 등식의 성질 또는 변형을 <보기>에서 모두 골라 바르게 짝지은 것은? [4점]

$$4x + 3 = 5 \xrightarrow{(가)} 4x = 5 - 3 \xrightarrow{} 4x = 2 \xrightarrow{(나)} x = \dfrac{1}{2}$$

<보기> ㄱ. 등식의 양변에서 같은 수를 빼어도 등식은 성립한다. ㄴ. 이항(등식의 어느 한 변에 있는 항을 부호를 바꾸어 다른 변으로 옮김)을 하였다. ㄷ. 등식의 양변을 $0$이 아닌 같은 수로 나누어도 등식은 성립한다.

**보기** ① (가) ㄱ, (나) ㄴ  ② (가) ㄱ, ㄴ, (나) ㄷ  ③ (가) ㄱ, (나) ㄷ  ④ (가) ㄱ, ㄴ, (나) ㄴ, ㄷ  ⑤ (가) ㄴ, (나) ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 4x + 3 = 5 에서 4x = 5 - 3 은 양변에서 3을 빼거나 항을 이항한 것이므로 (가)는 ㄱ, ㄴ이다.
2. 2) 4x = 2 에서 x = 1/2 은 양변을 4로 나눈 것이므로 (나)는 ㄷ이다.
3. 3) \begin{aligned} 4x + 3 = 5 \rightarrow 4x = 5 - 3 \rightarrow 4x = 2 \rightarrow x = \dfrac{1}{2} \end{aligned}
4. 따라서 바르게 짝지은 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-LINEAR_EQUATION(일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 일차방정식의 풀이 과정에서 (가), (나)에 이용된 등식의 성질 또는 변형을 <보기>에서 모두 골라 바르게 짝지은 것은? [4점]」
**RPM** M1-RPM-148 [문자와 식 > 일차방정식의 풀이 > 등식과 방정식 > 등식의 성질] (원천과 같음)
- 이유: 일차방정식 풀이 단계 \begin{aligned} 4x + 3 = 5 \rightarrow 4x = 5 - 3 \rightarrow x = \dfrac{1}{2} \end{aligned} 에 사용된 등식의 성질과 이항을 분석하는 M1-RPM-148에 해당한다.
**유형** PT=PT_M1_LINEAR_EQUATION_SOLVING / TPL=TPL_M1_LINEAR_EQUATION_TRANSFORMATION_AUDIT (원천과 같음) (원천과 같음)
- 이유: 방정식 변형 과정 \begin{aligned} 4x + 3 = 5 \rightarrow 4x = 5 - 3 \rightarrow x = \dfrac{1}{2} \end{aligned} 의 각 단계에 적용된 성질(이항, 양변 나눗셈)을 검토하는 PT_M1_LINEAR_EQUATION_SOLVING과 TPL_M1_LINEAR_EQUATION_TRANSFORMATION_AUDIT이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 등식의 성질 정의를 \begin{aligned} 4x + 3 = 5 \rightarrow 4x = 5 - 3 \end{aligned} 각 변형 단계와 직접 일대일 대응시키는 기본 1단계 문제이다.

**4칸**
- given: 일차방정식←stem:「다음 일차방정식의 풀이 과정에서」
- goal: 등식←stem:「이용된 등식의 성질 또는 변형을」
- method: 이항(NAMED)←stem:「ㄴ. 이항(등식의 어느 한 변에 있는 항을 부호를 바꾸어 다른 변으로 옮김)을 하였다.」
- condition: (없음)

**how** 방정식 단계 \begin{aligned} 4x + 3 = 5 \rightarrow 4x = 5 - 3 \rightarrow x = \dfrac{1}{2} \end{aligned} 에서 (가)는 ㄱ, ㄴ이고 (나)는 ㄷ임을 판별하여 정답 ②로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

식 변형의 각 단계에서 사용된 성질을 분석한다. $$\begin{aligned} \text{(가) } & 4x + 3 = 5 \rightarrow 4x = 5 - 3 \ & \text{양변에서 } 3\text{을 뺀 것으로 볼 수 있으므로 ㄱ에 해당한다.} \ & \text{또한 좌변의 } +3\text{을 부호를 바꾸어 우변으로 넘긴 이항이므로 ㄴ에도 해당한다.} \ \text{(나) } & 4x = 2 \rightarrow x = \dfrac{1}{2} \ & \text{양변을 } 4\text{로 나눈 것이므로 ㄷ에 해당한다.} \end{aligned}$$ 따라서 (가)는 ㄱ, ㄴ이고 (나)는 ㄷ이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

일차방정식 $3(x - 8) = -5x$의 해는? [4점]

**보기** ① $x = -4$  ② $x = -3$  ③ $x = 3$  ④ $x = 4$  ⑤ $x = 6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 3(x - 8) = -5x 의 괄호를 풀면 3x - 24 = -5x이다.
2. 2) 3x + 5x = 24 => 8x = 24 => x = 3이다.
3. 3) \begin{aligned} 3(x - 8) = -5x \implies 8x = 24 \implies x = 3 \end{aligned}
4. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-LINEAR_EQUATION(일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차방정식 $3(x - 8) = -5x$의 해는? [4점]」
**RPM** M1-RPM-151 [문자와 식 > 일차방정식의 풀이 > 일차방정식의 풀이 > 괄호·분수·소수가 있는 방정식] (원천과 같음)
- 이유: 괄호가 있는 일차방정식 \begin{aligned} 3(x - 8) = -5x \end{aligned} 을 괄호 전개 및 이항을 통해 푸는 M1-RPM-151에 해당한다.
**유형** PT=PT_M1_LINEAR_EQUATION_SOLVING / TPL=TPL_M1_LINEAR_EQUATION_DIRECT_SOLUTION (원천과 같음) (원천과 같음)
- 이유: 괄호가 포함된 일차방정식 \begin{aligned} 3(x - 8) = -5x \end{aligned} 을 전개하고 정리하여 직접 해 x = 3을 구하는 PT_M1_LINEAR_EQUATION_SOLVING과 TPL_M1_LINEAR_EQUATION_DIRECT_SOLUTION이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 3(x - 8) = -5x를 전개하여 \begin{aligned} 8x = 24 \implies x = 3 \end{aligned} 을 구하는 전형적인 기본 일차방정식 풀이로 난이도 1이다.

**4칸**
- given: 일차방정식←stem:「일차방정식 $3(x - 8) = -5x$의 해는?」
- goal: 일차방정식←stem:「일차방정식 $3(x - 8) = -5x$의 해는?」
- method: 이항(NAMED)←solution:「상수항을 우변으로 이항하여 푼다.」
- condition: (없음)

**how** 3(x - 8) = -5x를 전개하여 \begin{aligned} 8x = 24 \implies x = 3 \end{aligned} 을 도출하여 정답 ③으로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

괄호를 풀고 $x$항을 좌변으로, 상수항을 우변으로 이항하여 푼다. $$\begin{aligned} 3(x - 8) &= -5x \ 3x - 24 &= -5x \ 3x + 5x &= 24 \ 8x &= 24 \ x &= 3 \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

$x$에 대한 두 일차방정식 $$\dfrac{1}{5}(-2x - 8) = 0.6x + 0.4, \quad 0.5(x - 3a) - \dfrac{1}{2} = \dfrac{a(-x + 4)}{3}$$ 의 해가 서로 같을 때, 상수 $a$의 값은? [5점]

**보기** ① $-\dfrac{5}{7}$  ② $-\dfrac{4}{7}$  ③ $-\dfrac{1}{2}$  ④ $-\dfrac{3}{7}$  ⑤ $-\dfrac{2}{7}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 첫 번째 방정식: \begin{aligned} \dfrac{1}{5}(-2x - 8) = 0.6x + 0.4 \implies -0.4x - 1.6 = 0.6x + 0.4 \implies x = -2 \end{aligned}
2. 2) x = -2를 두 번째 방정식에 대입한다: 0.5(-2 - 3a) - 1/2 = a(2 + 4)/3
3. 3) -1.5 - 1.5a = 2a => 3.5a = -1.5 => 7a = -3 => a = -3/7이다.
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-LINEAR_EQUATION(일차방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「 대한 두 일차방정식」
**RPM** M1-RPM-153 [문자와 식 > 일차방정식의 풀이 > 해와 조건 > 계수 조건 결정] **원천→판정: 문자와 식 > 일차방정식의 풀이 > 해와 조건 > 해가 주어진 방정식 → 문자와 식 > 일차방정식의 풀이 > 해와 조건 > 계수 조건 결정**
- 이유: 첫 번째 방정식을 풀어 공통해 x = -2를 구하고 두 번째 식에 대입하여 상수 a를 결정하는 \begin{aligned} 7a = -3 \implies a = -\dfrac{3}{7} \end{aligned} 풀이 M1-RPM-153에 해당한다.
**유형** PT=PT_M1_LINEAR_EQUATION_SOLVING / TPL=TPL_M1_LINEAR_EQUATION_COEFFICIENT_RECOVERY (원천과 같음) (원천과 같음)
- 이유: 두 일차방정식의 해가 같음을 이용하여 미지수 x를 소거하고 상수 a의 일차방정식을 풀어 \begin{aligned} a = -\dfrac{3}{7} \end{aligned} 을 복원하는 PT_M1_LINEAR_EQUATION_SOLVING과 TPL_M1_LINEAR_EQUATION_COEFFICIENT_RECOVERY이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 분수·소수 복합 일차방정식에서 x=-2를 먼저 구한 뒤 a에 관한 방정식을 풀어 \begin{aligned} a = -\dfrac{3}{7} \end{aligned} 을 얻는 2단계 연계 문항으로 난이도 2이다.

**4칸**
- given: 일차방정식←stem:「$x$에 대한 두 일차방정식」
- goal: 상수←stem:「상수 $a$의 값은? [5점]」
- method: 대입(NAMED)←solution:「$x = -2$를 두 번째 일차방정식에 대입한다.」
- condition: (없음)

**how** 첫 번째 식에서 x = -2를 구하고 대입하여 \begin{aligned} 7a = -3 \implies a = -\dfrac{3}{7} \end{aligned} 을 도출하여 정답 ④로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

첫 번째 일차방정식을 풀어 공통인 해 $x$를 구한다. 소수로 통일하여 정리하면 $$\begin{aligned} \dfrac{1}{5}(-2x - 8) &= 0.6x + 0.4 \ -0.4x - 1.6 &= 0.6x + 0.4 \ -0.4x - 0.6x &= 0.4 + 1.6 \ -x &= 2 \ x &= -2 \end{aligned}$$ 두 방정식의 해가 같으므로 $x = -2$를 두 번째 일차방정식에 대입한다. $$\begin{aligned} 0.5(-2 - 3a) - \dfrac{1}{2} &= \dfrac{a(-(-2) + 4)}{3} \ -1 - 1.5a - 0.5 &= \dfrac{6a}{3} \ -1.5 - 1.5a &= 2a \ -\dfrac{3}{2} - \dfrac{3}{2}a &= 2a \end{aligned}$$ 양변에 $2$를 곱하여 $a$에 관한 일차방정식을 풀면 $$\begin{aligned} -3 - 3a &= 4a \ 7a &= -3 \ a &= -\dfrac{3}{7} \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 3점


**발문**

좌표평면 위의 네 점 $A, B, C, D$의 위치 설명 중 점의 좌표를 바르게 나타낸 것은? [3점]

• 점 $A$는 $x$축 위의 점으로 $x$좌표가 $3$이다. • 점 $B$는 $y$축 위의 점으로 $y$좌표가 $-4$이다. • 점 $C$는 제$2$사분면 위의 점으로 $x$좌표가 $-2$, $y$좌표가 $5$이다. • 점 $D$는 제$4$사분면 위의 점으로 $x$좌표가 $4$, $y$좌표가 $-3$이다.

**보기** ① $A(0, 3)$  ② $B(-4, 0)$  ③ $C(2, -5)$  ④ $C(5, -2)$  ⑤ $D(4, -3)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 점 A: x축 위의 점이고 x좌표가 3이므로 A(3, 0)이다.
2. 2) 점 B: y축 위의 점이고 y좌표가 -4이므로 B(0, -4)이다.
3. 3) 점 C: x좌표가 -2, y좌표가 5이므로 C(-2, 5)이다.
4. 4) 점 D: x좌표가 4, y좌표가 -3이므로 D(4, -3)이다.
5. 5) \begin{aligned} D(4, -3) \end{aligned} 이 바르게 나타낸 보기 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-COORDINATE_PLANE(좌표평면) (원천과 같음) (원천과 같음)
- 근거 인용: 「좌표평면 위의 네 점 $A, B, C, D$의 위치 설명 중 점의 좌표를 바르게 나타낸 것은? [3점]」
**RPM** M1-RPM-163 [좌표평면과 그래프 > 좌표와 그래프 > 좌표평면 > 점의 좌표 읽기] (원천과 같음)
- 이유: 좌표축 및 사분면 조건에서 점의 순서쌍 좌표를 읽어 \begin{aligned} D(4, -3) \end{aligned} 을 판별하는 M1-RPM-163에 해당한다.
**유형** PT=PT_COORDINATE_POINT_READING / TPL=TPL_COORDINATE_POINT_READING_CORE (원천과 같음) (원천과 같음)
- 이유: 좌표평면 위의 점 위치 설명으로부터 순서쌍 좌표를 바르게 읽고 \begin{aligned} D(4, -3) \end{aligned} 을 고르는 PT_COORDINATE_POINT_READING과 TPL_COORDINATE_POINT_READING_CORE이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 좌표축과 사분면의 좌표 정의를 순서쌍 \begin{aligned} D(4, -3) \end{aligned} 에 직접 적용하는 기본 1단계 문제이다.

**4칸**
- given: 좌표←stem:「점의 좌표를 바르게 나타낸 것은? [3점]」
- goal: 사분면←stem:「제$2$사분면 위의 점으로」
- method: 순서쌍(NAMED)←solution:「각 점의 위치에 대한 순서쌍 $(x, y)$를 구한다.」
- condition: (없음)

**how** 네 점의 순서쌍을 점검하여 \begin{aligned} D(4, -3) \end{aligned} 이 옳음을 확인하고 정답 ⑤로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

각 점의 위치에 대한 순서쌍 $(x, y)$를 구한다. $$\begin{aligned} \text{점 } A &: x\text{축 위의 점이므로 } y = 0 \implies A(3, 0) \ \text{점 } B &: y\text{축 위의 점이므로 } x = 0 \implies B(0, -4) \ \text{점 } C &: x = -2, y = 5 \implies C(-2, 5) \ \text{점 } D &: x = 4, y = -3 \implies D(4, -3) \end{aligned}$$ 따라서 바르게 나타낸 것은 $D(4, -3)$인 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

좌표와 좌표평면에 대한 설명으로 옳은 것은? [4점]

**보기** ① 원점의 좌표는 $O(0, 0)$이다.  ② 점 $P(a, b)$의 $x$좌표는 $b$이고 $y$좌표는 $a$이다.  ③ $x$축 위에 있는 점은 $x$좌표가 항상 $0$이다.  ④ $y$축 위에 있는 점은 제$1$사분면에 속한다.  ⑤ $x$좌표가 음수이고 $y$좌표가 양수인 점은 제$4$사분면에 속한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) \begin{aligned} O(0, 0) \end{aligned} 은 원점의 좌표로 참이다.
2. 2) 순서쌍 (a, b)에서 x좌표는 a, y좌표는 b이다.
3. 3) x축 위의 점은 y좌표가 0이다.
4. 4) 축 위의 점은 어느 사분면에도 속하지 않는다.
5. 5) x < 0, y > 0은 제2사분면이다.
6. 따라서 옳은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-COORDINATE_PLANE(좌표평면) (원천과 같음) (원천과 같음)
- 근거 인용: 「좌표와 좌표평면에 대한 설명으로 옳은 것은? [4점]」
**RPM** M1-RPM-163 [좌표평면과 그래프 > 좌표와 그래프 > 좌표평면 > 점의 좌표 읽기] (원천과 같음)
- 이유: 원점의 좌표 \begin{aligned} O(0, 0) \end{aligned} 및 좌표축, 사분면의 기본 성질을 검토하는 M1-RPM-163에 해당한다.
**유형** PT=PT_COORDINATE_POINT_READING / TPL=TPL_COORDINATE_POINT_READING_CLAIM_AUDIT (원천과 같음) (원천과 같음)
- 이유: 좌표평면의 원점 \begin{aligned} O(0, 0) \end{aligned} 및 좌표축 위의 점 성질 진술의 참·거짓을 판정하는 PT_COORDINATE_POINT_READING과 TPL_COORDINATE_POINT_READING_CLAIM_AUDIT이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 원점의 좌표가 \begin{aligned} O(0, 0) \end{aligned} 임을 정의에 따라 즉시 확인하는 기본 1단계 문제이다.

**4칸**
- given: 좌표←stem:「좌표와 좌표평면에 대한 설명으로 옳은 것은? [4점]」
- goal: 원점←solution:「원점의 좌표는 」
- method: 정의(NAMED)←solution:「사분면의 기본 정의를 확인한」
- condition: (없음)

**how** 원점의 좌표가 \begin{aligned} O(0, 0) \end{aligned} 임을 확인하고 나머지 보기가 거짓임을 검토하여 정답 ①로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

좌표와 사분면의 기본 정의를 확인한다. $$\begin{aligned} \text{① } & \text{원점의 좌표는 } (0, 0)\text{이다. (참)} \ \text{② } & \text{순서쌍 } (a, b)\text{에서 } x\text{좌표는 } a, y\text{좌표는 } b\text{이다. (거짓)} \ \text{③ } & x\text{축 위의 점은 } y\text{좌표가 } 0\text{이다. (거짓)} \ \text{④ } & \text{좌표축 위의 점은 어느 사분면에도 속하지 않는다. (거짓)} \ \text{⑤ } & x < 0, y > 0\text{인 점은 제}2\text{사분면에 속한다. (거짓)} \end{aligned}$$ 따라서 옳은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.5점


**발문**

점 $A(a, b)$가 제$2$사분면 위의 점일 때, 점 $B\left(a - b, -\dfrac{b}{a}\right)$는 제 몇 사분면 위의 점인가? [4.5점]

**보기** ① 제$1$사분면  ② 제$2$사분면  ③ 제$3$사분면  ④ 제$4$사분면  ⑤ 어느 사분면에도 속하지 않는다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 점 A(a, b)가 제2사분면 위의 점이므로 a < 0, b > 0이다.
2. 2) x좌표: a - b < 0 (음수 - 양수 = 음수)
3. 3) y좌표: b/a < 0 이므로 -b/a > 0 (양수)
4. 4) x좌표 음수, y좌표 양수이므로 제2사분면 위의 점이다.
5. 5) \begin{aligned} B(a - b, -b/a) \end{aligned} 는 제2사분면이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-COORDINATE_PLANE(좌표평면) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $A(a, b)$가 제$2$사분면 위의 점일 때, 점 $B\left(a - b, -\dfrac{b}{a}\right)$는 제 몇 사분면 위의 점인가? [4.5점]」
**RPM** M1-RPM-163 [좌표평면과 그래프 > 좌표와 그래프 > 좌표평면 > 점의 좌표 읽기] (원천과 같음)
- 이유: a < 0, b > 0의 부호 조건을 이용하여 \begin{aligned} B(a - b, -b/a) \end{aligned} 의 사분면 부호를 판별하는 M1-RPM-163에 해당한다.
**유형** PT=PT_COORDINATE_POINT_READING / TPL=TPL_COORDINATE_POINT_READING_QUADRANT_SIGN_TRANSFORM (원천과 같음) (원천과 같음)
- 이유: 사분면 부호 조건 a < 0, b > 0에서 식 \begin{aligned} a - b < 0, -b/a > 0 \end{aligned} 의 부호를 변환하여 사분면을 판정하는 PT_COORDINATE_POINT_READING과 TPL_COORDINATE_POINT_READING_QUADRANT_SIGN_TRANSFORM이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 부호 판정 후 차와 몫의 부호 결정을 연계하여 \begin{aligned} a - b < 0, -b/a > 0 \end{aligned} 을 도출하는 2단계 사분면 판정으로 난이도 2이다.

**4칸**
- given: 사분면←stem:「점 $A(a, b)$가 제$2$사분면 위의 점일 때,」
- goal: 사분면←stem:「제 몇 사분면 위의 점인가? [4.5점]」
- method: 부호(NAMED)←solution:「위의 점이므로 부호는 다음과」
- condition: (없음)

**how** a < 0, b > 0에서 \begin{aligned} a - b < 0, -b/a > 0 \end{aligned} 이므로 제2사분면임을 도출하여 정답 ②로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $A(a, b)$가 제$2$사분면 위의 점이므로 부호는 다음과 같다. $$\begin{aligned} a &< 0 \ b &> 0 \end{aligned}$$ 점 $B$의 좌표 부호를 각각 조사하면 $$\begin{aligned} x\text{좌표} &: a - b < 0\text{ (음수에서 양수를 빼므로 음수)} \ y\text{좌표} &: \dfrac{b}{a} < 0 \implies -\dfrac{b}{a} > 0\text{ (양수)} \end{aligned}$$ 따라서 점 $B$는 $x$좌표가 음수이고 $y$좌표가 양수이므로 제$2$사분면 위의 점이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 3점


**발문**

어느 자전거가 출발하여 일정한 속력으로 달리다가 속력을 점점 줄여서 멈추었다. 이 자전거의 시간에 따른 속력의 변화를 나타낸 그래프의 모양으로 가장 적절한 것은? [3점]

**보기** ① 처음부터 끝까지 계속 증가하는 직선 모양  ② 점점 증가하다가 일정하게 유지되는 모양  ③ 일정하게 유지되다가 점점 감소하여 $0$이 되는 모양  ④ 증가하다가 감소하고 다시 증가하는 모양  ⑤ 처음부터 끝까지 일정한 속력을 유지하는 수평선 모양

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 일정한 속력으로 달리는 구간: 속력이 변하지 않으므로 수평선이다.
2. 2) 속력을 줄여서 멈추는 구간: 속력이 감소하여 0이 되므로 우하향 선분이다.
3. 3) \begin{aligned} \text{수평선} \rightarrow \text{감소하여 0} \end{aligned} 모양이다.
4. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「어느 자전거가 출발하여 일정한 속력으로 달리다가 속력을 점점 줄여서 멈추었다.」
**RPM** M1-RPM-165 [좌표평면과 그래프 > 좌표와 그래프 > 그래프 > 상황을 그래프로 나타내기] (원천과 같음)
- 이유: 자전거의 속력 변화 상황을 시간에 따른 그래프 형태 \begin{aligned} \text{일정} \rightarrow \text{감소} \end{aligned} 로 나타내는 M1-RPM-165에 해당한다.
**유형** PT=PT_M1_CONTEXT_GRAPH_INTERPRETATION / TPL=TPL_M1_CONTEXT_GRAPH_INTERPRETATION_CONTEXT_TO_SPEED_GRAPH (원천과 같음) (원천과 같음)
- 이유: 실제 이동 상황(일정한 속력 유지 후 감속하여 정지)을 속력-시간 그래프 개형 \begin{aligned} \text{수평선 후 우하향} \end{aligned} 과 연결하는 PT_M1_CONTEXT_GRAPH_INTERPRETATION과 TPL_M1_CONTEXT_GRAPH_INTERPRETATION_CONTEXT_TO_SPEED_GRAPH이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 상황 진술을 읽고 \begin{aligned} \text{일정 유지 후 감소} \end{aligned} 개형을 바로 고르는 기본 1단계 문제이다.

**4칸**
- given: 속력←stem:「발하여 일정한 속력으로 달리」
- goal: 그래프←stem:「변화를 나타낸 그래프의 모양」
- method: 속력(NAMED)←solution:「흐름에 따른 속력의 변화 과」
- condition: (없음)

**how** 일정한 속력 후 감속 정지하는 과정을 \begin{aligned} \text{수평선 후 감소하여 0} \end{aligned} 개형으로 연결하여 정답 ③으로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

시간의 흐름에 따른 속력의 변화 과정을 분석한다. $$\begin{aligned} \text{1단계(일정한 속력)} &: \text{시간이 지나도 속력이 변하지 않으므로 수평선이다.} \ \text{2단계(속력을 줄임)} &: \text{시간이 지남에 따라 속력이 감소하므로 우하향 선분이다.} \ \text{3단계(멈춤)} &: \text{속력이 } 0\text{이 되어 시간축에 도달한다.} \end{aligned}$$ 따라서 일정하게 유지되다가 점점 감소하여 $0$이 되는 모양이 가장 적절하다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

다음은 어느 놀이공원 대관람차의 시간에 따른 지면으로부터의 높이 변화를 나타낸 그래프에 대한 설명이다. 옳지 않은 것은? [4점] (단, 관람차는 지면에서 출발하여 최고 높이 $40\text{ m}$까지 올라간 후 다시 내려오기를 반복하며, 최고점은 출발 후 $15$분, $45$분, $75$분에 도달한다.)

**보기** ① 관람차가 가장 높이 올라갔을 때의 높이는 $40\text{ m}$이다.  ② 관람차가 출발 후 $15$분에 처음으로 최고 높이에 도달한다.  ③ 관람차가 한 바퀴를 완전히 회전하는 데 걸리는 시간은 $30$분이다.  ④ 관람차가 시작 지점에서 최고 높이까지 올라가는 데 걸리는 시간은 $30$분이다.  ⑤ 운행을 시작하고 $60$분 동안 최고 높이에 도달하는 횟수는 $2$번이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 최고 높이는 40m이다. (① 참)
2. 2) 15분에 처음 최고 높이에 도달한다. (② 참)
3. 3) 한 바퀴 회전 주기는 45 - 15 = 30분이다. (③ 참)
4. 4) 지면에서 최고 높이까지 올라가는 데 걸리는 시간은 15분이다. 따라서 30분이라는 ④는 옳지 않다.
5. 5) 60분 동안 최고 높이 도달 횟수는 15분, 45분의 2번이다. (⑤ 참)
6. \begin{aligned} 45 - 15 = 30\text{분} \end{aligned}
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 어느 놀이공원 대관람차의 시간에 따른 지면으로부터의 높이 변화를 나타낸 그래프에 대한 설명이다.」
**RPM** M1-RPM-166 [좌표평면과 그래프 > 좌표와 그래프 > 그래프 > 그래프 해석] (원천과 같음)
- 이유: 주기 30분, 최고 높이 40m를 갖는 대관람차 그래프의 진술을 분석하는 \begin{aligned} 45 - 15 = 30\text{분} \end{aligned} M1-RPM-166에 해당한다.
**유형** PT=PT_M1_CONTEXT_GRAPH_INTERPRETATION / TPL=TPL_M1_CONTEXT_GRAPH_INTERPRETATION_PERIODIC_GRAPH_CLAIMS (원천과 같음) (원천과 같음)
- 이유: 주기적 그래프 상황에서 최고 높이 40m, 주기 30분 등의 진술을 검토하여 \begin{aligned} 15\text{분} \neq 30\text{분} \end{aligned} 오류를 찾는 PT_M1_CONTEXT_GRAPH_INTERPRETATION과 TPL_M1_CONTEXT_GRAPH_INTERPRETATION_PERIODIC_GRAPH_CLAIMS이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 주기 30분 계산과 출발 후 최고점 도달 시간 15분을 분리하여 \begin{aligned} 40\text{m}, 30\text{분} \end{aligned} 등의 각 보기를 점검하는 2단계 문제로 난이도 2이다.

**4칸**
- given: 높이←stem:「지면으로부터의 높이 변화를 」
- goal: 그래프←stem:「변화를 나타낸 그래프에 대한」
- method: 주기(NAMED)←solution:「관람차의 주기적 높이 변화를」
- condition: (없음)

**how** 최고점 도달 시간은 15분인데 30분이라고 서술된 ④가 거짓임을 \begin{aligned} 45 - 15 = 30\text{분} \end{aligned} 주기 분석을 통해 확인하여 정답 ④로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

관람차의 주기적 높이 변화를 분석한다. $$\begin{aligned} \text{최고 높이} &: 40\text{ m} \ \text{최고점 도달 시각} &: 15\text{분}, 45\text{분}, 75\text{분} \ \text{1회전 주기} &: 45 - 15 = 30\text{ (분)} \end{aligned}$$ 각 선지의 진술을 판별하면 $$\begin{aligned} \text{① } & \text{최고 높이는 } 40\text{ m이다. (참)} \ \text{② } & \text{출발 후 } 15\text{분에 처음 최고점에 도달한다. (참)} \ \text{③ } & \text{최고점 사이의 간격이 } 30\text{분이므로 한 바퀴 회전 시간은 } 30\text{분이다. (참)} \ \text{④ } & \text{시작 지점(지면)에서 최고 높이까지 올라가는 데 걸리는 시간은 } 15\text{분이다.} \ & \text{따라서 } 30\text{분이라고 한 설명은 옳지 않다. (거짓)} \ \text{⑤ } & 60\text{분 동안 최고점에 도달하는 시각은 } 15\text{분과 } 45\text{분의 } 2\text{번이다. (참)} \end{aligned}$$ 따라서 옳지 않은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점


**발문**

다음 중 $x$와 $y$ 사이의 관계가 정비례하는 것은? [4점]

**보기** ① 올해 $13$살인 학생의 $x$년 후의 나이 $y$살  ② 둘레의 길이가 $20\text{ cm}$인 직사각형의 가로 $x\text{ cm}$와 세로 $y\text{ cm}$  ③ 넓이가 $36\text{ cm}^2$인 직사각형의 가로 $x\text{ cm}$와 세로 $y\text{ cm}$  ④ 총 $60\text{ L}$의 물이 들어 있는 물탱크에서 매분 $x\text{ L}$씩 물을 뺄 때 남은 물의 양 $y\text{ L}$  ⑤ 한 자루에 $800$원인 색연필 $x$자루의 가격 $y$원

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) ① y = 13 + x (정비례 아님)
2. 2) ② 2(x + y) = 20 => y = 10 - x (정비례 아님)
3. 3) ③ xy = 36 => y = 36/x (반비례)
4. 4) ④ y = 60 - x (정비례 아님)
5. 5) ⑤ y = 800x (y = ax 꼴이므로 정비례)
6. \begin{aligned} y = 800x \end{aligned} 이 정비례이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $x$와 $y$ 사이의 관계가 정비례하는 것은? [4점]」
**RPM** M1-RPM-167 [좌표평면과 그래프 > 정비례와 반비례 > 정비례 > 정비례 관계식] (원천과 같음)
- 이유: 색연필 x자루의 가격 y = 800x와 같이 y = ax (a != 0) 꼴의 정비례 관계식을 판별하는 \begin{aligned} y = 800x \end{aligned} M1-RPM-167에 해당한다.
**유형** PT=PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION / TPL=TPL_DIRECT_INVERSE_PROPORTION_CLASSIFICATION_CORE (원천과 같음) (원천과 같음)
- 이유: 여러 일상생활 상황의 관계식을 세워 \begin{aligned} y = 800x \end{aligned} 가 정비례 관계임을 분류하는 PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION과 TPL_DIRECT_INVERSE_PROPORTION_CLASSIFICATION_CORE이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 한 자루 800원의 총액 \begin{aligned} y = 800x \end{aligned} 가 y = ax 꼴임을 직접 판별하는 기본 1단계 문제이다.

**4칸**
- given: 관계←stem:「$y$ 사이의 관계가 정비례」
- goal: 정비례←stem:「사이의 관계가 정비례하는 것」
- method: 정비례(NAMED)←solution:「정비례 관계는 두 변」
- condition: (없음)

**how** 각 보기를 수식으로 나타내어 \begin{aligned} y = 800x \end{aligned} 가 정비례 관계식임을 확인하고 정답 ⑤로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

정비례 관계는 두 변수 $x, y$ 사이에 $y = ax$ ($a \neq 0$)의 관계식이 성립하는 것이다. 각 보기의 관계식을 세우면 다음과 같다. $$\begin{aligned} \text{① } & y = 13 + x\text{ (정비례 아님)} \ \text{② } & 2(x + y) = 20 \implies y = 10 - x\text{ (정비례 아님)} \ \text{③ } & xy = 36 \implies y = \dfrac{36}{x}\text{ (반비례)} \ \text{④ } & y = 60 - x\text{ (정비례 아님)} \ \text{⑤ } & y = 800x\text{ (}y = ax\text{ 꼴이므로 정비례)} \end{aligned}$$ 따라서 정비례하는 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

정비례 관계 $y = ax$의 그래프와 반비례 관계 $y = \dfrac{b}{x}$의 그래프가 점 $(-4, 3)$에서 만날 때, 상수 $a, b$에 대하여 $ab$의 값은? [4.5점]

**보기** ① $9$  ② $12$  ③ $15$  ④ $-9$  ⑤ $-12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) y = ax 에 (-4, 3)을 대입하면 3 = -4a 이므로 a = -3/4이다.
2. 2) y = b/x 에 (-4, 3)을 대입하면 3 = b/(-4) 이므로 b = -12이다.
3. 3) ab = (-3/4) * (-12) = 9이다.
4. \begin{aligned} ab = \left(-\dfrac{3}{4}\right) \times (-12) = 9 \end{aligned}
5. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「정비례 관계 $y = ax$의 그래프와 반비례 관계 $y = \dfrac{b}{x}$의 그래프가 점 $(-4, 3)$에서 만날 때」
**RPM** M1-RPM-171 [좌표평면과 그래프 > 정비례와 반비례 > 관계 해석 > 그래프에서 식 구하기] (원천과 같음)
- 이유: 교점 (-4, 3)을 대입하여 정비례 상수 a = -3/4와 반비례 상수 b = -12를 구해 \begin{aligned} ab = 9 \end{aligned} 를 계산하는 M1-RPM-171에 해당한다.
**유형** PT=PT_M1_PROPORTION_PARAMETER_EVALUATION / TPL=TPL_M1_PROPORTION_PARAMETER_EVALUATION_TWO_GRAPH_CONSTANTS (원천과 같음) (원천과 같음)
- 이유: 두 비례 그래프의 교점 좌표 대입을 통해 상수 a, b를 결정하고 그 곱 \begin{aligned} ab = 9 \end{aligned} 를 구하는 PT_M1_PROPORTION_PARAMETER_EVALUATION과 TPL_M1_PROPORTION_PARAMETER_EVALUATION_TWO_GRAPH_CONSTANTS이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정비례와 반비례 식에 각각 점 (-4, 3)을 대입하여 상수를 구하고 곱하는 \begin{aligned} ab = 9 \end{aligned} 2단계 계산으로 난이도 2이다.

**4칸**
- given: 정비례←stem:「정비례 관계 $y = ax$의 그래프와」
- goal: 상수←stem:「서 만날 때, 상수 $a, 」
- method: 반비례(NAMED)←solution:「$은 정비례와 반비례 그래프」
- condition: (없음)

**how** 교점 (-4, 3)을 대입하여 a = -3/4, b = -12를 구하고 \begin{aligned} ab = 9 \end{aligned} 를 얻어 정답 ①로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

교점 $(-4, 3)$은 정비례와 반비례 그래프 위의 점이므로 두 식에 각각 대입한다. $y = ax$에 $x = -4, y = 3$을 대입하면 $$\begin{aligned} 3 &= a \times (-4) \ a &= -\dfrac{3}{4} \end{aligned}$$ $y = \dfrac{b}{x}$에 $x = -4, y = 3$을 대입하면 $$\begin{aligned} 3 &= \dfrac{b}{-4} \ b &= 3 \times (-4) \ &= -12 \end{aligned}$$ 따라서 $ab$의 값은 $$\begin{aligned} ab &= \left(-\dfrac{3}{4}\right) \times (-12) \ &= 9 \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점


**발문**

[서·논술형 1] 다음 표는 두 식품 $P$와 $Q$의 $100\text{ g}$당 단백질 함유량을 나타낸 것이다.

$$\begin{array}{c|c} \hline \text{식품} & 100\text{ g당 단백질 양} \ \hline P & 320\text{ mg} \ Q & 240\text{ mg} \ \hline \end{array}$$

(1) 식품 $P$를 $x\text{ g}$, 식품 $Q$를 $y\text{ g}$ 섭취하였을 때 섭취한 총 단백질의 양을 $x, y$를 사용한 식으로 나타내시오. (2) 식품 $P$를 $250\text{ g}$, 식품 $Q$를 $200\text{ g}$ 섭취하였을 때 섭취한 총 단백질의 양을 구하는 과정을 자세히 서술하시오. (단, 답에 단위를 반드시 쓰시오.) [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $(3.2x + 2.4y)\text{ mg}$ (2) $1280\text{ mg}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 1g당 단백질 양: P는 320/100 = 3.2 mg, Q는 240/100 = 2.4 mg이다.
2. 2) (1) 총 단백질의 양: (3.2x + 2.4y) mg
3. 3) (2) x = 250, y = 200 대입: 3.2 * 250 + 2.4 * 200 = 800 + 480 = 1280 mg이다.
4. \begin{aligned} 3.2 \times 250 + 2.4 \times 200 = 1280\text{ (mg)} \end{aligned}
- 작성자 답: (1) $(3.2x + 2.4y)\text{ mg}$ (2) $1280\text{ mg}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-ALGEBRAIC_EXPRESSION(문자의 사용과 식의 값) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 1] 다음 표는 두 식품 $P$와 $Q$의 $100\text{ g}$당 단백질 함유량을 나타낸 것이다.」
**RPM** M1-RPM-140 [문자와 식 > 문자의 사용과 식의 계산 > 문자의 사용 > 문자로 수량 나타내기] (원천과 같음)
- 이유: 100g당 함유량으로부터 1g당 단위량을 구하여 수량식을 세우고 값을 계산하는 \begin{aligned} 1280\text{ mg} \end{aligned} M1-RPM-140에 해당한다.
**유형** PT=PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION / TPL=TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_UNIT_QUANTITY_AND_EVALUATION (원천과 같음) **원천→판정: TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_WORD_QUANTITY_TRANSLATION → TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_UNIT_QUANTITY_AND_EVALUATION**
- 이유: 1g당 단백질 양 3.2mg, 2.4mg을 구하여 식 (3.2x + 2.4y)를 세우고 대입하여 \begin{aligned} 1280\text{ mg} \end{aligned} 을 구하는 PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION과 TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_UNIT_QUANTITY_AND_EVALUATION이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 단위당 수량 관계식 구성과 수치 대입 계산을 모두 요구하는 \begin{aligned} 1280\text{ mg} \end{aligned} 서술형 2단계 문제로 난이도 2이다.

**4칸**
- given: (없음)
- goal: 대입←solution:「$을 위 식에 대입하여 계산」
- method: 대입(NAMED)←solution:「$을 위 식에 대입하여 계산」
- condition: (없음)

**how** 1g당 함유량으로부터 (3.2x + 2.4y) mg 식을 세우고 대입하여 \begin{aligned} 1280\text{ mg} \end{aligned} 을 도출하여 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

식품 $100\text{ g}$당 함유량을 기준으로 $1\text{ g}$당 단백질의 양을 구한다. $$\begin{aligned} \text{식품 } P\text{의 } 1\text{ g당 단백질 양} &: \dfrac{320}{100} = 3.2\text{ (mg)} \ \text{식품 } Q\text{의 } 1\text{ g당 단백질 양} &: \dfrac{240}{100} = 2.4\text{ (mg)} \end{aligned}$$ (1) 식품 $P$를 $x\text{ g}$, 식품 $Q$를 $y\text{ g}$ 섭취할 때의 총 단백질의 양은 $$\begin{aligned} (3.2x + 2.4y)\text{ mg} \end{aligned}$$ (2) $x = 250, y = 200$을 위 식에 대입하여 계산하면 $$\begin{aligned} 3.2 \times 250 + 2.4 \times 200 &= 800 + 480 \ &= 1280\text{ (mg)} \end{aligned}$$ 따라서 구하는 답은 (1) $(3.2x + 2.4y)\text{ mg}$, (2) $1280\text{ mg}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

[서·논술형 2] 집에서 도서관까지 가는데 시속 $45\text{ km}$인 버스를 타고 가는 것이 시속 $15\text{ km}$인 자전거를 타고 가는 것보다 $40$분 일찍 도착한다. 집과 도서관 사이의 거리를 구하는 과정을 다음 단계에 따라 자세히 서술하시오. [7점]

(1) 미지수 정하기 (2) 일차방정식 세우기 (3) 일차방정식 풀기 (4) 문제의 답 구하기


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $15\text{ km}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 집과 도서관 사이의 거리를 x km라 한다. (x > 0)
2. 2) 자전거 시간 x/15, 버스 시간 x/45, 40분 = 2/3시간
3. 3) 방정식: x/15 - x/45 = 2/3
4. 4) 양변에 45를 곱하면 3x - x = 30 => 2x = 30 => x = 15이다.
5. \begin{aligned} x = 15\text{ km} \end{aligned}
- 작성자 답: $15\text{ km}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-03(문자와 식) / M1-03-LINEAR_EQUATION_WORD(일차방정식의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 2] 집에서 도서관까지 가는데 시속 $45\text{ km}$인 버스를 타고 가는 것이 시속 $15\text{ km}$인 자전거를 타고 가는 것보다 $40$분 일찍 도착한다.」
**RPM** M1-RPM-156 [문자와 식 > 일차방정식의 활용 > 속력·시간·거리 > 거리 관계식] (원천과 같음)
- 이유: 이동 수단의 속력 차이에 따른 시간차 40분(2/3시간)을 이용하여 일차방정식을 세우고 거리 \begin{aligned} x = 15\text{ km} \end{aligned} 를 구하는 M1-RPM-156에 해당한다.
**유형** PT=PT_M1_LINEAR_EQUATION_MODELING / TPL=TPL_M1_LINEAR_EQUATION_MODEL_RATE (원천과 같음) (원천과 같음)
- 이유: 속력, 시간, 거리 관계에서 시간차 2/3시간을 이용해 x/15 - x/45 = 2/3 방정식을 모델링하고 \begin{aligned} x = 15\text{ km} \end{aligned} 를 구하는 PT_M1_LINEAR_EQUATION_MODELING과 TPL_M1_LINEAR_EQUATION_MODEL_RATE이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 분 단위 시간 환산과 분수 계수 방정식 풀이를 거쳐 \begin{aligned} x = 15\text{ km} \end{aligned} 를 도출하는 서술형 2단계 문제로 난이도 2이다.

**4칸**
- given: 거리←stem:「도서관 사이의 거리를 구하는」
- goal: 일차방정식←stem:「정하기 (2) 일차방정식 세」
- method: 최소공배수(NAMED)←solution:「양변에 분모의 최소공배수인 」
- condition: (없음)

**how** 시간차 방정식 x/15 - x/45 = 2/3 을 세우고 풀어 \begin{aligned} x = 15\text{ km} \end{aligned} 를 도출하여 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 미지수 정하기: 집과 도서관 사이의 거리를 $x\text{ km}$라 하자. ($x > 0$)

(2) 일차방정식 세우기: 자전거로 갈 때 걸린 시간은 $\dfrac{x}{15}$시간이고, 버스로 갈 때 걸린 시간은 $\dfrac{x}{45}$시간이다. $40$분은 시간 단위로 환산하면 $\dfrac{40}{60} = \dfrac{2}{3}$시간이므로 $$\begin{aligned} \dfrac{x}{15} - \dfrac{x}{45} = \dfrac{2}{3} \end{aligned}$$

(3) 일차방정식 풀기: 양변에 분모의 최소공배수인 $45$를 곱하여 정리하면 $$\begin{aligned} 3x - x &= \dfrac{2}{3} \times 45 \ 2x &= 30 \ x &= 15 \end{aligned}$$

(4) 문제의 답 구하기: 따라서 집과 도서관 사이의 거리는 $15\text{ km}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 6점


**발문**

[서·논술형 3] 다음은 두 사람 민수와 지호가 직선 코스에서 걷기 운동을 할 때, 출발한 지 $x$분 후의 이동 거리 $y\text{ km}$의 변화를 나타낸 그래프에 대한 설명이다. 그래프를 보고 알 수 있는 사실을 서로 다른 관점에서 두 가지 서술하시오. [6점] (단, 시간과 거리 정보를 구체적으로 포함하여 서술하시오.)

• 민수는 원점 $(0, 0)$에서 출발하여 일정한 속력으로 걸어 $30$분 후 $2\text{ km}$ 지점에 도착한다. • 지호는 민수가 출발한 지 $10$분 후인 $(10, 0)$에서 출발하여 $40$분 후인 $x = 40$분에 $3\text{ km}$ 지점에 도달한다.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 지호는 민수가 출발한 지 $10$분 뒤에 출발하였다. (2) 민수는 출발 후 $30$분 동안 $2\text{ km}$를 이동하였다.   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 민수는 (0, 0)에서 출발하여 30분 동안 2km를 이동하였다.
2. 2) 지호는 (10, 0)에서 출발하므로 민수보다 10분 늦게 출발하였고, 40분에 3km에 도달하였다.
3. 3) 그래프를 보고 알 수 있는 사실: (1) 지호는 민수가 출발한 지 10분 뒤에 출발하였다. (2) 민수는 출발 후 30분 동안 2km를 이동하였다.
4. \begin{aligned} (30, 2), (10, 0) \end{aligned}
- 작성자 답: (1) 지호는 민수가 출발한 지 $10$분 뒤에 출발하였다. (2) 민수는 출발 후 $30$분 동안 $2\text{ km}$를 이동하였다. → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서·논술형 3] 다음은 두 사람 민수와 지호가 직선 코스에서 걷기 운동을 할 때, 출발한 지 $x$분 후의 이동 거리 $y\text{ km}$의 변화를 나타낸 그래프에 대한 설명이다.」
**RPM** M1-RPM-166 [좌표평면과 그래프 > 좌표와 그래프 > 그래프 > 그래프 해석] (원천과 같음)
- 이유: 시간-거리 그래프의 출발점과 도달점을 좌표 \begin{aligned} (30, 2), (10, 0) \end{aligned} 로 해석하여 구체적 사실을 서술하는 M1-RPM-166에 해당한다.
**유형** PT=PT_M1_CONTEXT_GRAPH_INTERPRETATION / TPL=TPL_M1_CONTEXT_GRAPH_INTERPRETATION_DISTANCE_TIME_FACT_AUDIT (원천과 같음) (원천과 같음)
- 이유: 거리-시간 이동 그래프의 좌표 정보를 바탕으로 \begin{aligned} 10\text{분 뒤 출발}, 30\text{분 동안 2km} \end{aligned} 두 가지 사실을 추출하는 PT_M1_CONTEXT_GRAPH_INTERPRETATION과 TPL_M1_CONTEXT_GRAPH_INTERPRETATION_DISTANCE_TIME_FACT_AUDIT이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 사람의 이동 그래프에서 시간과 거리 조건을 각각 좌표 \begin{aligned} (30, 2), (10, 0) \end{aligned} 로 해석해 사실을 서술하는 2단계 문제로 난이도 2이다.

**4칸**
- given: 원점←stem:「• 민수는 원점 $(0, 0)」
- goal: 그래프←stem:「변화를 나타낸 그래프에 대한」
- method: 속력(NAMED)←stem:「발하여 일정한 속력으로 걸어」
- condition: (없음)

**how** 민수의 (30, 2)와 지호의 (10, 0) 출발 정보를 좌표로 읽어 \begin{aligned} 10\text{분 뒤}, 30\text{분 동안 2km} \end{aligned} 를 서술하여 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

시간과 거리의 관계 그래프에서 각 인물의 출발 시각과 도달 지점을 좌표로 해석한다. $$\begin{aligned} \text{민수의 이동} &: \text{원점 }(0, 0)\text{에서 출발하여 }(30, 2)\text{를 지나므로 } 30\text{분 동안 } 2\text{ km}\text{를 이동하였다.} \ \text{지호의 이동} &: x\text{축 위의 점 }(10, 0)\text{에서 출발하므로 민수보다 } 10\text{분 늦게 출발하였고, } x = 40\text{분에 } 3\text{ km}\text{에 도달하였다.} \end{aligned}$$ 따라서 그래프를 통해 알 수 있는 구체적 사실은 다음과 같다. (1) 지호는 민수가 출발한 지 $10$분 뒤에 출발하였다. (2) 민수는 출발 후 $30$분 동안 $2\text{ km}$를 이동하였다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
