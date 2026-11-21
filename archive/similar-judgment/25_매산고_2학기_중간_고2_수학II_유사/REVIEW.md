# 검수 묶음 — 25_매산고_2학기_중간_고2_수학II_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 3)**
- 문항 20개 / 검사 PASS 17, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/20, HOLD 0, 풀이 답 비어 있음 20문항
- 그림 판단 분포: NONE 20
- 난이도 분포: 1단계 3, 2단계 4, 3단계 6, 4단계 6, 5단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 검사 코드: CHOICE_ORDER
- **Q9**: 검사 코드: CHOICE_ORDER
- **Q13**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 4점


**발문**

$\lim_{x\to 2}(3x^2-4x+5)$의 값을 구한 것은?

**보기** ① $6$  ② $7$  ③ $8$  ④ $9$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 다항함수는 모든 실수에서 연속이므로 $x=2$를 직접 대입한다. (10)
2. $$\lim_{x\to 2}(3x^2-4x+5) = 3(2)^2 - 4(2) + 5 = 12 - 8 + 5 = 9$$

따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\lim_{x\to 2}(3x^2-4x+5)$의 값을」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 극한값 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q1(10): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음)
- 이유: Q1(10): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(10): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「2}(3x^2-4x+5)$의 값을 구한 것은?」
- method: 정리(NAMED)←solution:「다항함수는 모든 실수에서 연속이므로 $x=2$」
- condition: (없음)

**how** Q1(10): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

다항함수는 모든 실수에서 연속이므로 $x=2$를 직접 대입한다.

$$\lim_{x\to 2}(3x^2-4x+5) = 3(2)^2 - 4(2) + 5 = 12 - 8 + 5 = 9$$

따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

두 함수 $f(x),\ g(x)$에 대하여 $\lim_{x\to a}f(x)=4$, $\lim_{x\to a}g(x)=-2$일 때, $\lim_{x\to a}{2f(x)-3f(x)g(x)}$의 값을 구한 것은?

**보기** ① $32$  ② $16$  ③ $24$  ④ $28$  ⑤ $36$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 함수의 극한값이 각각 존재하므로 극한의 기본 성질을 적용한다.
2. $$\begin{aligned} \lim_{x\to a}{2f(x)-3f(x)g(x)} &= 2\lim_{x\to a}f(x) - 3\lim_{x\to a}f(x)\lim_{x\to a}g(x) \ &= 2(4) - 3(4)(-2) = 8 + 24 = 32 \end{aligned}$$

따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 함수 $f(x),\ g(x)$에 대하여 $\lim_」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 대수적 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q2(32): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_OPERATION_LAWS (원천과 같음) (원천과 같음)
- 이유: Q2(32): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(32): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「x)-3f(x)g(x)}$의 값을 구한 것은?」
- method: 정리(NAMED)←solution:「두 함수의 극한값이 각각 존재하므로 극한의 기」
- condition: (없음)

**how** Q2(32): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 함수의 극한값이 각각 존재하므로 극한의 기본 성질을 적용한다.

$$\begin{aligned} \lim_{x\to a}{2f(x)-3f(x)g(x)} &= 2\lim_{x\to a}f(x) - 3\lim_{x\to a}f(x)\lim_{x\to a}g(x) \ &= 2(4) - 3(4)(-2) = 8 + 24 = 32 \end{aligned}$$

따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4.2점


**발문**

함수 $f(x)=\begin{cases}ax+b&(x\le -1)\x^4&(x>-1)\end{cases}$가 $x=-1$에서 미분가능하도록 하는 상수 $a,\ b$에 대하여 $|a-b|$의 값을 구한 것은?

**보기** ① $-1$  ② $0$  ③ $1$  ④ $2$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x=-1$에서 미분가능하려면 먼저 연속이어야 하고 좌미분계수와 우미분계수가 같아야 한다. (cases)
2. 1.
3. 좌미분계수와 우미분계수의 일치: $$a = \left.(x^4)'\right|_{x=-1} = 4(-1)^3 = -4$$  
2.
4. $x=-1$에서의 연속 조건: $$-a + b = (-1)^4 = 1 \implies 4 + b = 1 \implies b = -3$$

따라서 $|a-b| = |-4 - (-3)| = 1$이다.
5. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=\begin{cases}ax+b&(x\」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 미분가능성과 연속 > 미분가능 조건 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q3(cases): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DIFFERENTIABILITY_CONDITION / TPL=TPL_DIFFERENTIABILITY_POINT_CONDITION (원천과 같음) (원천과 같음)
- 이유: Q3(cases): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(cases): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$에 대하여 $|a-b|$의 값을 구한 것은?」
- method: 정리(NAMED)←solution:「$x=-1$에서 미분가능하려면 먼저 연속이어야」
- condition: (없음)

**how** Q3(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x=-1$에서 미분가능하려면 먼저 연속이어야 하고 좌미분계수와 우미분계수가 같아야 한다.

1. 좌미분계수와 우미분계수의 일치: $$a = \left.(x^4)'\right|_{x=-1} = 4(-1)^3 = -4$$  
2. $x=-1$에서의 연속 조건: $$-a + b = (-1)^4 = 1 \implies 4 + b = 1 \implies b = -3$$

따라서 $|a-b| = |-4 - (-3)| = 1$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4.2점


**발문**

방정식 $x^3-3x^2-2=0$이 오직 하나의 실근을 가질 때, 다음 중 방정식의 실근이 존재하는 구간을 구한 것은?

**보기** ① $(-1,\ 0)$  ② $(0,\ 1)$  ③ $(1,\ 2)$  ④ $(2,\ 3)$  ⑤ $(3,\ 4)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $P(x) = x^3 - 3x^2 - 2$라 하면 다항함수 $P(x)$는 모든 실수에서 연속이다.
2. $$\begin{aligned} P(3) &= 3^3 - 3(3)^2 - 2 = -2 < 0 \ P(4) &= 4^3 - 3(4)^2 - 2 = 64 - 48 - 2 = 14 > 0 \end{aligned}$$

$P(3)P(4) < 0$이므로 사잇값 정리에 의하여 열린구간 $(3,\ 4)$에 $P(x)=0$의 실근이 존재한다.
3. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-02(함수의 연속) / H15-M2-02-CONTINUITY(함수의 연속) (원천과 같음) (원천과 같음)
- 근거 인용: 「방정식 $x^3-3x^2-2=0$이 오직 하나의 실근을」
**RPM** H2-M2-RPM-007 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속함수의 성질 > 사잇값 정리 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: Q4(aligned): 함수의 연속 단원의 RPM H2-M2-RPM-007 유형에 해당한다.
**유형** PT=PT_INTERMEDIATE_VALUE_APPLICATION / TPL=TPL_IVT_VALUE_EXISTENCE_INTERVAL (원천과 같음) (원천과 같음)
- 이유: Q4(aligned): 함수의 연속 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(aligned): 함수의 연속 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「방정식의 실근이 존재하는 구간을 구한 것은?」
- method: 정리(NAMED)←solution:「$P(x) = x^3 - 3x^2 - 2$라」
- condition: (없음)

**how** Q4(aligned): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$P(x) = x^3 - 3x^2 - 2$라 하면 다항함수 $P(x)$는 모든 실수에서 연속이다.

$$\begin{aligned} P(3) &= 3^3 - 3(3)^2 - 2 = -2 < 0 \ P(4) &= 4^3 - 3(4)^2 - 2 = 64 - 48 - 2 = 14 > 0 \end{aligned}$$

$P(3)P(4) < 0$이므로 사잇값 정리에 의하여 열린구간 $(3,\ 4)$에 $P(x)=0$의 실근이 존재한다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4.3점


**발문**

$x-2$를 인수로 갖는 다항함수 $f(x)$에 대하여 $\lim_{h\to 0}\dfrac{f(2+h)-f(2-h)}{h}=8$일 때, $\lim_{x\to 2}\dfrac{x^3-8}{f(x)}$의 값을 구한 것은?

**보기** ① $2$  ② $3$  ③ $4$  ④ $6$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x)$가 $x-2$를 인수로 가지므로 $f(2)=0$이고, 다항함수는 미분가능하다.
2. $$\lim_{h\to 0}\frac{f(2+h)-f(2-h)}{h} = \lim_{h\to 0}\left{\frac{f(2+h)-f(2)}{h} + \frac{f(2-h)-f(2)}{-h}\right} = 2f'(2) = 8$$

따라서 $f'(2) = 4$이다.
3. 이제 두 번째 극한을 계산한다.
4. $$\lim_{x\to 2}\frac{x^3-8}{f(x)} = \lim_{x\to 2}\frac{(x-2)(x^2+2x+4)}{f(x)-f(2)} = \frac{2^2+2(2)+4}{f'(2)} = \frac{12}{4} = 3$$

따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-03(미분계수) / H15-M2-03-DERIVATIVE_DEFINITION(미분계수) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x-2$를 인수로 갖는 다항함수 $f(x)$에 대하여」
**RPM** H2-M2-RPM-013 [미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율] **원천→판정: 미분 > 미분계수와 도함수 > 미분계수 > 정의로 미분계수 → 미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율**
- 이유: Q5(12): 미분계수 단원의 RPM H2-M2-RPM-013 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_DEFINITION / TPL=TPL_DERIVATIVE_LIMIT_REDUCTION (원천과 같음) (원천과 같음)
- 이유: Q5(12): 미분계수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(12): 미분계수 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「{x^3-8}{f(x)}$의 값을 구한 것은?」
- method: 정리(NAMED)←solution:「$f(x)$가 $x-2$를 인수로 가지므로 $」
- condition: (없음)

**how** Q5(12): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x)$가 $x-2$를 인수로 가지므로 $f(2)=0$이고, 다항함수는 미분가능하다.

$$\lim_{h\to 0}\frac{f(2+h)-f(2-h)}{h} = \lim_{h\to 0}\left{\frac{f(2+h)-f(2)}{h} + \frac{f(2-h)-f(2)}{-h}\right} = 2f'(2) = 8$$

따라서 $f'(2) = 4$이다. 이제 두 번째 극한을 계산한다.

$$\lim_{x\to 2}\frac{x^3-8}{f(x)} = \lim_{x\to 2}\frac{(x-2)(x^2+2x+4)}{f(x)-f(2)} = \frac{2^2+2(2)+4}{f'(2)} = \frac{12}{4} = 3$$

따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4.4점


**발문**

다항식 $x^8-ax+3b$를 $(x-1)^2$으로 나눈 나머지가 $2x+5$가 되는 상수 $a,\ b$에 대하여 $3b-a$의 값을 구한 것은?

**보기** ① $6$  ② $8$  ③ $10$  ④ $12$  ⑤ $18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $P(x) = x^8 - ax + 3b$, $R(x) = 2x + 5$라 하면 $P(x) = (x-1)^2 Q(x) + R(x)$이다.
2. 양변을 $x$에 대하여 미분하면 $P'(x) = 2(x-1)Q(x) + (x-1)^2 Q'(x) + R'(x)$이므로 $P(1) = R(1)$이고 $P'(1) = R'(1)$이다.
3. $$\begin{aligned} P'(x) = 8x^7 - a &\implies P'(1) = 8 - a = R'(1) = 2 \implies a = 6 \ P(1) = 1 - a + 3b &= R(1) = 7 \implies 1 - 6 + 3b = 7 \implies 3b = 12 \end{aligned}$$

따라서 $3b - a = 12 - 6 = 6$이다.
4. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항식 $x^8-ax+3b$를 $(x-1)^2$으로 나」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q6(ax): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_RULE_EVALUATION / TPL=TPL_DERIVATIVE_RULE_CALCULATION (원천과 같음) (원천과 같음)
- 이유: Q6(ax): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(ax): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「b$에 대하여 $3b-a$의 값을 구한 것은?」
- method: 정리(NAMED)←solution:「$P(x) = x^8 - ax + 3b$, $」
- condition: (없음)

**how** Q6(ax): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$P(x) = x^8 - ax + 3b$, $R(x) = 2x + 5$라 하면 $P(x) = (x-1)^2 Q(x) + R(x)$이다.

양변을 $x$에 대하여 미분하면 $P'(x) = 2(x-1)Q(x) + (x-1)^2 Q'(x) + R'(x)$이므로 $P(1) = R(1)$이고 $P'(1) = R'(1)$이다.

$$\begin{aligned} P'(x) = 8x^7 - a &\implies P'(1) = 8 - a = R'(1) = 2 \implies a = 6 \ P(1) = 1 - a + 3b &= R(1) = 7 \implies 1 - 6 + 3b = 7 \implies 3b = 12 \end{aligned}$$

따라서 $3b - a = 12 - 6 = 6$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4.5점


**발문**

함수 $f(x)=3|x-2|+1$과 직선 $y=kx-3k$의 교점의 개수를 $g(k)$라 하자. 이때, $g(k)$가 불연속인 모든 $k$의 값의 곱을 구한 것은?

**보기** ① $-9$  ② $-3$  ③ $3$  ④ $9$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x) = \begin{cases}-3x+7 & (x<2)\ 3x-5 & (x\ge 2)\end{cases}$이다. (kx)
2. 1.
3. 오른쪽 반직선($x\ge 2$)과의 교점: $(k-3)x = 3k-5$ $k\ne 3$에서 $x = \dfrac{3k-5}{k-3} \ge 2 \iff \dfrac{k+1}{k-3} \ge 0 \iff k \le -1$ 또는 $k > 3$  
2.
4. 왼쪽 반직선($x < 2$)과의 교점: $(k+3)x = 3k+7$ $k\ne -3$에서 $x = \dfrac{3k+7}{k+3} < 2 \iff \dfrac{k+1}{k+3} < 0 \iff -3 < k < -1$

따라서 교점의 개수 $g(k)$는 다음과 같다.
5. $$g(k) = \begin{cases} 1 & (k \le -3) \ 2 & (-3 < k < -1) \ 1 & (k = -1) \ 0 & (-1 < k \le 3) \ 1 & (k > 3) \end{cases}$$

$g(k)$가 불연속인 $k$의 값은 $-3,\ -1,\ 3$이므로 그 곱은 $(-3)(-1)(3) = 9$이다.
6. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-02(함수의 연속) / H15-M2-02-CONTINUITY(함수의 연속) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=3|x-2|+1$과 직선 $y=kx-3」
**RPM** H2-M2-RPM-007 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 구간에서의 연속 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: Q7(kx): 함수의 연속 단원의 RPM H2-M2-RPM-007 유형에 해당한다.
**유형** PT=PT_CONTINUITY_JUDGMENT / TPL=TPL_CONTINUITY_POINT_JUDGMENT (원천과 같음)
- 이유: Q7(kx): 함수의 연속 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(kx): 함수의 연속 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「불연속인 모든 $k$의 값의 곱을 구한 것은?」
- method: 정리(NAMED)←solution:「$f(x) = \begin{cases}-3x+」
- condition: (없음)

**how** Q7(kx): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x) = \begin{cases}-3x+7 & (x<2)\ 3x-5 & (x\ge 2)\end{cases}$이다.

1. 오른쪽 반직선($x\ge 2$)과의 교점: $(k-3)x = 3k-5$ $k\ne 3$에서 $x = \dfrac{3k-5}{k-3} \ge 2 \iff \dfrac{k+1}{k-3} \ge 0 \iff k \le -1$ 또는 $k > 3$  
2. 왼쪽 반직선($x < 2$)과의 교점: $(k+3)x = 3k+7$ $k\ne -3$에서 $x = \dfrac{3k+7}{k+3} < 2 \iff \dfrac{k+1}{k+3} < 0 \iff -3 < k < -1$

따라서 교점의 개수 $g(k)$는 다음과 같다. $$g(k) = \begin{cases} 1 & (k \le -3) \ 2 & (-3 < k < -1) \ 1 & (k = -1) \ 0 & (-1 < k \le 3) \ 1 & (k > 3) \end{cases}$$

$g(k)$가 불연속인 $k$의 값은 $-3,\ -1,\ 3$이므로 그 곱은 $(-3)(-1)(3) = 9$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4.6점


**발문**

미분가능한 함수 $f(x)$의 그래프와 직선 $y=\dfrac{1}{3}x$가 다음 그림과 같이 원점과 점 $P\left(p,\ \dfrac{1}{3}p\right)$에서 만난다. 함수 $y=f(x)$의 그래프 위의 두 점 $A(a,\ f(a))$, $B(b,\ f(b))$에 대하여 옳은 것만을 보기에서 있는 대로 고른 것은? (단, $0 < a < p < b$)

ㄱ. $f'(p) > \dfrac{1}{3}$ ㄴ. $f(a)-f(b) > \dfrac{1}{3}(a-b)$ ㄷ. $f'(\alpha) = \dfrac{1}{3}$인 $\alpha$가 열린구간 $(0,\ p)$에 적어도 하나 존재한다.

**보기** ① ㄱ  ② ㄱ, ㄷ  ③ ㄴ  ④ ㄱ, ㄴ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 그림에서 곡선 $y=f(x)$는 $(0, p)$에서 직선 $y=\dfrac{1}{3}x$보다 아래에 있고, $x>p$에서 직선보다 위에 있으며 점 $P$에서 직선을 아래에서 위로 관통한다.
2. - ㄱ: 점 $P$에서 곡선의 접선 기울기가 직선의 기울기 $\dfrac{1}{3}$보다 크므로 $f'(p) > \dfrac{1}{3}$이다.
3. (참)  
- ㄴ: $f(a) < \dfrac{1}{3}a$, $f(b) > \dfrac{1}{3}b$이므로 $f(a)-f(b) < \dfrac{1}{3}(a-b)$이다.
4. (거짓)  
- ㄷ: $h(x) = f(x) - \dfrac{1}{3}x$라 두면 $h(0) = h(p) = 0$이고 닫힌구간 $[0, p]$에서 연속, 열린구간 $(0, p)$에서 미분가능하므로 롤의 정리에 의하여 $h'(\alpha) = 0$, 즉 $f'(\alpha) = \dfrac{1}{3}$인 $\alpha \in (0, p)$가 적어도 하나 존재한다.
5. (참)

따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-06(도함수의 활용) / H15-M2-06-DERIVATIVE_APPLICATION(도함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「미분가능한 함수 $f(x)$의 그래프와 직선 $y=\d」
**RPM** H2-M2-RPM-021 [미분 > 도함수의 활용(1) > 평균값 정리 기초 > 변화율] **원천→판정: 미분 > 도함수의 활용(1) > 평균값 정리 기초 > 기울기 조건 → 미분 > 도함수의 활용(1) > 평균값 정리 기초 > 변화율**
- 이유: Q8(f): 도함수의 활용 단원의 RPM H2-M2-RPM-021 유형에 해당한다.
**유형** PT=PT_MEAN_VALUE_THEOREM / TPL=TPL_MVT_ROLLE_DIRECT (원천과 같음) (원천과 같음)
- 이유: Q8(f): 도함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(f): 도함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「간 $(0,\ p)$에 적어도 하나 존재한다.」
- method: 정리(NAMED)←solution:「그림에서 곡선 $y=f(x)$는 $(0, p)」
- condition: (없음)

**how** Q8(f): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

그림에서 곡선 $y=f(x)$는 $(0, p)$에서 직선 $y=\dfrac{1}{3}x$보다 아래에 있고, $x>p$에서 직선보다 위에 있으며 점 $P$에서 직선을 아래에서 위로 관통한다.

- ㄱ: 점 $P$에서 곡선의 접선 기울기가 직선의 기울기 $\dfrac{1}{3}$보다 크므로 $f'(p) > \dfrac{1}{3}$이다. (참)  
- ㄴ: $f(a) < \dfrac{1}{3}a$, $f(b) > \dfrac{1}{3}b$이므로 $f(a)-f(b) < \dfrac{1}{3}(a-b)$이다. (거짓)  
- ㄷ: $h(x) = f(x) - \dfrac{1}{3}x$라 두면 $h(0) = h(p) = 0$이고 닫힌구간 $[0, p]$에서 연속, 열린구간 $(0, p)$에서 미분가능하므로 롤의 정리에 의하여 $h'(\alpha) = 0$, 즉 $f'(\alpha) = \dfrac{1}{3}$인 $\alpha \in (0, p)$가 적어도 하나 존재한다. (참)

따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4.6점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 곡선 $y=4x^2$ 위의 점 $P$에서 $y$축에 내린 수선의 발을 $H$라 하고, 선분 $OH$의 중점을 $Q$라 하자. 점 $P$의 $x$좌표가 한없이 커질 때, $\overline{PQ}-\overline{HQ}$의 극한값을 구한 것은? (단, 점 $P$는 제1사분면 위의 점이고, 점 $O$는 원점이다.)

**보기** ① $\dfrac{1}{8}$  ② $\dfrac{1}{6}$  ③ $\dfrac{1}{5}$  ④ $\dfrac{1}{3}$  ⑤ $\dfrac{1}{4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 $P$의 $x$좌표를 $t$ ($t>0$)라 하면 $P(t,\ 4t^2)$, $H(0,\ 4t^2)$, $Q(0,\ 2t^2)$이다. (OH)
2. $$\overline{PQ} = \sqrt{t^2 + (4t^2 - 2t^2)^2} = \sqrt{t^2 + 4t^4}, \qquad \overline{HQ} = 2t^2$$

분자를 유리화하여 $t \to \infty$일 때의 극한을 구하면 다음과 같다.
3. $$\begin{aligned} \lim_{t\to\infty}(\overline{PQ}-\overline{HQ}) &= \lim_{t\to\infty}\frac{(t^2+4t^4) - 4t^4}{\sqrt{t^2+4t^4}+2t^2} \ &= \lim_{t\to\infty}\frac{t^2}{t^2\left(\sqrt{\dfrac{1}{t^2}+4}+2\right)} = \frac{1}{2+2} = \frac{1}{4} \end{aligned}$$

따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 곡선 $y=4x^2$ 위의 점 $P$」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 무한대에서의 극한 > 다항·유리함수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q9(OH): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음) (원천과 같음)
- 이유: Q9(OH): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(OH): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「사분면 위의 점이고, 점 $O$는 원점이다.)」
- method: 정리(NAMED)←solution:「점 $P$의 $x$좌표를 $t$ ($t>0$)」
- condition: (없음)

**how** Q9(OH): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $P$의 $x$좌표를 $t$ ($t>0$)라 하면 $P(t,\ 4t^2)$, $H(0,\ 4t^2)$, $Q(0,\ 2t^2)$이다.

$$\overline{PQ} = \sqrt{t^2 + (4t^2 - 2t^2)^2} = \sqrt{t^2 + 4t^4}, \qquad \overline{HQ} = 2t^2$$

분자를 유리화하여 $t \to \infty$일 때의 극한을 구하면 다음과 같다.

$$\begin{aligned} \lim_{t\to\infty}(\overline{PQ}-\overline{HQ}) &= \lim_{t\to\infty}\frac{(t^2+4t^4) - 4t^4}{\sqrt{t^2+4t^4}+2t^2} \ &= \lim_{t\to\infty}\frac{t^2}{t^2\left(\sqrt{\dfrac{1}{t^2}+4}+2\right)} = \frac{1}{2+2} = \frac{1}{4} \end{aligned}$$

따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4.7점


**발문**

다음 두 조건을 만족시키는 다항함수 $f(x)$에 대하여 $f(2)$의 값을 구한 것은?

(가) $\lim_{x\to -\infty}\dfrac{f(x)}{2x^3-5} = 1$ (나) $\lim_{x\to 1}\dfrac{f(x)}{3(x-1)^2} = 4$

**보기** ① $10$  ② $12$  ③ $14$  ④ $16$  ⑤ $18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 조건 (가)에서 $f(x)$는 최고차항이 $2x^3$인 삼차함수이다. (10)
2. 조건 (나)에서 분모가 $(x-1)^2$을 인수로 가지고 극한값이 유한하므로 $f(x)$도 $(x-1)^2$을 인수로 가져야 한다.
3. 따라서 $f(x) = 2(x-1)^2(x-r)$로 놓을 수 있다.
4. $$\lim_{x\to 1}\frac{2(x-1)^2(x-r)}{3(x-1)^2} = \frac{2(1-r)}{3} = 4 \implies 1-r = 6 \implies r = -5$$

그러므로 $f(x) = 2(x-1)^2(x+5)$이고, $f(2) = 2(2-1)^2(2+5) = 14$이다.
5. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 두 조건을 만족시키는 다항함수 $f(x)$에 대하」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 미정계수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q10(10): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_PARAMETER_DETERMINATION / TPL=TPL_LIMIT_FINITE_CONDITION_PARAMETER (원천과 같음) (원천과 같음)
- 이유: Q10(10): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(10): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「frac{f(x)}{3(x-1)^2} = 4$」
- method: 정리(NAMED)←solution:「조건 (가)에서 $f(x)$는 최고차항이 $2」
- condition: (없음)

**how** Q10(10): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (가)에서 $f(x)$는 최고차항이 $2x^3$인 삼차함수이다.

조건 (나)에서 분모가 $(x-1)^2$을 인수로 가지고 극한값이 유한하므로 $f(x)$도 $(x-1)^2$을 인수로 가져야 한다. 따라서 $f(x) = 2(x-1)^2(x-r)$로 놓을 수 있다.

$$\lim_{x\to 1}\frac{2(x-1)^2(x-r)}{3(x-1)^2} = \frac{2(1-r)}{3} = 4 \implies 1-r = 6 \implies r = -5$$

그러므로 $f(x) = 2(x-1)^2(x+5)$이고, $f(2) = 2(2-1)^2(2+5) = 14$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 5.1점


**발문**

실수 전체의 집합에서 정의된 두 함수 $f(x),\ g(x)$에 대하여 다음 보기 중 옳은 것만을 있는 대로 고른 것은?

ㄱ. $\lim_{x\to a}f(x)=0$이고 $\lim_{x\to a}g(x)=\infty$이면 $\lim_{x\to a}f(x)g(x)=0$이다. ㄴ. $\lim_{x\to a}f(x)$와 $\lim_{x\to a}{f(x)-g(x)}$가 각각 존재하면 $\lim_{x\to a}g(x)$도 존재한다. ㄷ. 모든 실수 $x$에 대하여 $f(x) < g(x)$이면 $\lim_{x\to a}f(x) < \lim_{x\to a}g(x)$이다.

**보기** ① ㄴ  ② ㄱ  ③ ㄷ  ④ ㄱ, ㄴ  ⑤ ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. - ㄱ: 반례로 $a=0$, $f(x)=x$, $g(x)=\dfrac{1}{x^2}$ ($x\ne 0$), $g(0)=0$이라 두면 $\lim_{x\to 0}f(x)=0$, $\lim_{x\to 0}g(x)=\infty$이지만 $f(x)g(x)=\dfrac{1}{x}$이므로 극한이 존재하지 않는다.
2. (거짓)  
- ㄴ: $g(x) = f(x) - {f(x)-g(x)}$이고 두 함수가 모두 수렴하므로 극한의 성질에 의하여 $\lim_{x\to a}g(x) = \lim_{x\to a}f(x) - \lim_{x\to a}{f(x)-g(x)}$가 존재한다.
3. (참)  
- ㄷ: 수렴할 때에도 $f(x) < g(x)$이면 $\lim_{x\to a}f(x) \le \lim_{x\to a}g(x)$로 등호가 성립할 수 있으며(예: $f(x)=-x^2$, $g(x)=x^2+0$ 아닌 $f(x)=0$, $g(x)=x^2$는 $x=0$ 제외, 또는 $f(x)=-\frac{1}{1+x^2}$ 등 $x\to a$에서 같아질 수 있고, 애초에 극한이 존재하지 않을 수도 있다).
4. (거짓)

따라서 옳은 것은 ㄴ뿐이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「실수 전체의 집합에서 정의된 두 함수 $f(x),\ g」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 대수적 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q11(f): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_OPERATION_LAWS (원천과 같음) (원천과 같음)
- 이유: Q11(f): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(f): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「) < \lim_{x\to a}g(x)$이다.」
- method: 정리(NAMED)←solution:「- ㄱ: 반례로 $a=0$, $f(x)=x$,」
- condition: (없음)

**how** Q11(f): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

- ㄱ: 반례로 $a=0$, $f(x)=x$, $g(x)=\dfrac{1}{x^2}$ ($x\ne 0$), $g(0)=0$이라 두면 $\lim_{x\to 0}f(x)=0$, $\lim_{x\to 0}g(x)=\infty$이지만 $f(x)g(x)=\dfrac{1}{x}$이므로 극한이 존재하지 않는다. (거짓)  
- ㄴ: $g(x) = f(x) - {f(x)-g(x)}$이고 두 함수가 모두 수렴하므로 극한의 성질에 의하여 $\lim_{x\to a}g(x) = \lim_{x\to a}f(x) - \lim_{x\to a}{f(x)-g(x)}$가 존재한다. (참)  
- ㄷ: 수렴할 때에도 $f(x) < g(x)$이면 $\lim_{x\to a}f(x) \le \lim_{x\to a}g(x)$로 등호가 성립할 수 있으며(예: $f(x)=-x^2$, $g(x)=x^2+0$ 아닌 $f(x)=0$, $g(x)=x^2$는 $x=0$ 제외, 또는 $f(x)=-\frac{1}{1+x^2}$ 등 $x\to a$에서 같아질 수 있고, 애초에 극한이 존재하지 않을 수도 있다). (거짓)

따라서 옳은 것은 ㄴ뿐이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5.3점


**발문**

점 $(1,\ k)$에서 곡선 $y=x^3-6x^2+3x+8$에 서로 다른 세 개의 접선을 그을 때, 세 접점의 $x$좌표가 등비수열을 이룬다고 한다. $k$의 값을 구한 것은?

**보기** ① $\dfrac{143}{27}$  ② $\dfrac{155}{27}$  ③ $\dfrac{161}{27}$  ④ $\dfrac{169}{27}$  ⑤ $\dfrac{175}{27}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $F(x) = x^3 - 6x^2 + 3x + 8$이라 하면 $F'(x) = 3x^2 - 12x + 3$이다. (143)
2. 접점의 $x$좌표를 $t$라 하면 접선의 방정식은 다음과 같다.
3. $$y = (3t^2-12t+3)(x-t) + (t^3-6t^2+3t+8)$$

이 접선이 점 $(1,\ k)$를 지나므로 $x=1,\ y=k$를 대입하여 정리한다.
4. $$\begin{aligned} k &= (3t^2-12t+3)(1-t) + (t^3-6t^2+3t+8) \ &= -2t^3 + 9t^2 - 12t + 11 \ &\implies 2t^3 - 9t^2 + 12t + k - 11 = 0 \end{aligned}$$

세 실근을 등비수열의 순서대로 $\alpha,\ \beta,\ \gamma$라 하면 $\beta^2 = \alpha\gamma$이고 근과 계수의 관계에서 다음과 같다.
5. $$\alpha+\beta+\gamma = \frac{9}{2}, \qquad \alpha\beta+\beta\gamma+\gamma\alpha = 6, \qquad \alpha\beta\gamma = \frac{11-k}{2}$$

$$\alpha\beta+\beta\gamma+\alpha\gamma = \beta(\alpha+\gamma)+\beta^2 = \beta(\alpha+\beta+\gamma) = 6 \implies \beta\cdot\frac{9}{2} = 6 \implies \beta = \frac{4}{3}$$

따라서 $\alpha\beta\gamma = \beta^3$이므로

$$\frac{11-k}{2} = \left(\frac{4}{3}\right)^3 = \frac{64}{27} \implies k = 11 - \frac{128}{27} = \frac{169}{27}$$

따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-05(접선의 방정식) / H15-M2-05-TANGENT(접선의 방정식) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $(1,\ k)$에서 곡선 $y=x^3-6x^2+3」
**RPM** H2-M2-RPM-019 [미분 > 도함수의 활용(1) > 접선 > 접선의 방정식] **원천→판정: 미분 > 도함수의 활용(1) > 접선 > 접점 조건 → 미분 > 도함수의 활용(1) > 접선 > 접선의 방정식**
- 이유: Q12(143): 접선의 방정식 단원의 RPM H2-M2-RPM-019 유형에 해당한다.
**유형** PT=PT_TANGENT_DERIVATIVE / TPL=TPL_TANGENCY_RELATION_GEOMETRY (원천과 같음) (원천과 같음)
- 이유: Q12(143): 접선의 방정식 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(143): 접선의 방정식 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「을 이룬다고 한다. $k$의 값을 구한 것은?」
- method: 정리(NAMED)←solution:「$F(x) = x^3 - 6x^2 + 3x +」
- condition: (없음)

**how** Q12(143): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$F(x) = x^3 - 6x^2 + 3x + 8$이라 하면 $F'(x) = 3x^2 - 12x + 3$이다. 접점의 $x$좌표를 $t$라 하면 접선의 방정식은 다음과 같다.

$$y = (3t^2-12t+3)(x-t) + (t^3-6t^2+3t+8)$$

이 접선이 점 $(1,\ k)$를 지나므로 $x=1,\ y=k$를 대입하여 정리한다.

$$\begin{aligned} k &= (3t^2-12t+3)(1-t) + (t^3-6t^2+3t+8) \ &= -2t^3 + 9t^2 - 12t + 11 \ &\implies 2t^3 - 9t^2 + 12t + k - 11 = 0 \end{aligned}$$

세 실근을 등비수열의 순서대로 $\alpha,\ \beta,\ \gamma$라 하면 $\beta^2 = \alpha\gamma$이고 근과 계수의 관계에서 다음과 같다.

$$\alpha+\beta+\gamma = \frac{9}{2}, \qquad \alpha\beta+\beta\gamma+\gamma\alpha = 6, \qquad \alpha\beta\gamma = \frac{11-k}{2}$$

$$\alpha\beta+\beta\gamma+\alpha\gamma = \beta(\alpha+\gamma)+\beta^2 = \beta(\alpha+\beta+\gamma) = 6 \implies \beta\cdot\frac{9}{2} = 6 \implies \beta = \frac{4}{3}$$

따라서 $\alpha\beta\gamma = \beta^3$이므로

$$\frac{11-k}{2} = \left(\frac{4}{3}\right)^3 = \frac{64}{27} \implies k = 11 - \frac{128}{27} = \frac{169}{27}$$

따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 5.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같이 곡선 $y=2x^2$ 위의 점 $P(t,\ 2t^2)$ ($t>0$)에 대하여 $\overline{OP}=\overline{OQ}$가 되도록 점 $Q$를 $x$축의 양의 방향에 잡는다. 삼각형 $POQ$의 외접원의 지름의 길이를 $f(t)$라 할 때, $\lim_{t\to\infty}\dfrac{{f(t)}^2}{t^4}$의 값을 구한 것은? (단, 점 $O$는 원점이다.)

**보기** ① $4$  ② $8$  ③ $2$  ④ $6$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $s = \overline{OP} = \overline{OQ} = \sqrt{t^2 + 4t^4} = t\sqrt{1+4t^2}$라 하면 $Q(s,\ 0)$이고 $\overline{PQ} = d = \sqrt{(s-t)^2 + 4t^4}$이다.
2. 삼각형 $POQ$의 넓이는 $\dfrac{1}{2} \cdot \overline{OQ} \cdot 2t^2 = st^2$이므로 외접원의 지름 $f(t)$는 다음과 같다.
3. $$f(t) = \frac{s\cdot s\cdot d}{2\cdot (st^2)} = \frac{sd}{2t^2}$$

따라서

$$\frac{{f(t)}^2}{t^4} = \frac{s^2}{4t^4} \cdot \frac{d^2}{t^4} = \frac{4 + \dfrac{1}{t^2}}{4} \cdot \left{\left(\sqrt{4+\frac{1}{t^2}} - \frac{1}{t}\right)^2 + 4\right}$$

$t \to \infty$일 때 $\dfrac{s^2}{4t^4} \to 1$, $\dfrac{d^2}{t^4} \to 2^2 + 4 = 8$이므로 구하는 극한값은 $1 \times 8 = 8$이다.
4. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 곡선 $y=2x^2$ 위의 점 $P(」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 무한대에서의 극한 > 다항·유리함수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q13(OP): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음) (원천과 같음)
- 이유: Q13(OP): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(OP): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「구한 것은? (단, 점 $O$는 원점이다.)」
- method: 정리(NAMED)←solution:「$s = \overline{OP} = \ove」
- condition: (없음)

**how** Q13(OP): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$s = \overline{OP} = \overline{OQ} = \sqrt{t^2 + 4t^4} = t\sqrt{1+4t^2}$라 하면 $Q(s,\ 0)$이고 $\overline{PQ} = d = \sqrt{(s-t)^2 + 4t^4}$이다.

삼각형 $POQ$의 넓이는 $\dfrac{1}{2} \cdot \overline{OQ} \cdot 2t^2 = st^2$이므로 외접원의 지름 $f(t)$는 다음과 같다.

$$f(t) = \frac{s\cdot s\cdot d}{2\cdot (st^2)} = \frac{sd}{2t^2}$$

따라서

$$\frac{{f(t)}^2}{t^4} = \frac{s^2}{4t^4} \cdot \frac{d^2}{t^4} = \frac{4 + \dfrac{1}{t^2}}{4} \cdot \left{\left(\sqrt{4+\frac{1}{t^2}} - \frac{1}{t}\right)^2 + 4\right}$$

$t \to \infty$일 때 $\dfrac{s^2}{4t^4} \to 1$, $\dfrac{d^2}{t^4} \to 2^2 + 4 = 8$이므로 구하는 극한값은 $1 \times 8 = 8$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 5.6점


**발문**

실수 $a$와 최고차항의 계수가 $1$인 이차함수 $f(x)$에 대하여 함수 $g(x)$를 $g(x)=(x^2-4x+a)f(x)$라 할 때, 두 함수 $f(x),\ g(x)$는 다음 조건을 모두 만족시킨다.

(가) $\lim_{x\to 3}\dfrac{g(x)-f(x)}{x-3}=0$ (나) $g'(3)\ne 0$ (다) 어떤 실수 $\alpha$에 대하여 $f(\alpha)=f'(\alpha)$, $g'(\alpha)=3f'(\alpha)$이다.

이때, $\dfrac{g(\alpha+5)}{16}=\dfrac{p}{q}$라 할 때, $p+q$를 구한 것은? (단, $p,\ q$는 서로소인 자연수이다.)

**보기** ① $41$  ② $45$  ③ $49$  ④ $53$  ⑤ $57$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $N(x) = g(x)-f(x) = (x^2-4x+a-1)f(x)$라 두면 조건 (가)에서 $N(3) = 0$, $N'(3) = 0$이다.
2. $$N(3) = (a-4)f(3) = 0, \qquad N'(3) = 2f(3) + (a-4)f'(3) = 0$$

만약 $a\ne 4$이면 $f(3)=0$, $f'(3)=0$이 되어 $g'(3) = 2f(3)+(a-3)f'(3) = 0$이 되므로 조건 (나)에 모순이다.
3. 따라서 $a=4$이고 $f(3)=0$, $g'(3)=f'(3)\ne 0$이므로 $f(x) = (x-3)(x-r)$ ($r\ne 3$), $g(x) = (x-2)^2 f(x)$이다.
4. 이제 $g'(x) = 2(x-2)f(x) + (x-2)^2 f'(x)$에 $f(\alpha)=f'(\alpha)$를 대입하면

$$g'(\alpha) = {2(\alpha-2) + (\alpha-2)^2}f'(\alpha) = (\alpha^2-2\alpha)f'(\alpha) = 3f'(\alpha)$$

$f'(\alpha)=0$이면 $f(\alpha)=0$이 되어 $f$가 중근을 가져 $f'(3)=0$이므로 모순이다.
5. 따라서 $\alpha^2-2\alpha-3=0$에서 $\alpha=3$ 또는 $\alpha=-1$이고, $\alpha=3$이면 $f'(3)=0$으로 모순이므로 $\alpha=-1$이다.
6. $f(-1)=f'(-1)$에서 $(-4)(-1-r) = -5-r \implies 5r = -9 \implies r = -\dfrac{9}{5}$이다.
7. 따라서 $\alpha+5=4$이고 $g(4) = 2^2(4-3)\left(4+\dfrac{9}{5}\right) = \dfrac{116}{5}$이므로 $\dfrac{g(4)}{16} = \dfrac{29}{20}$, 즉 $p+q = 29+20 = 49$이다.
8. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「실수 $a$와 최고차항의 계수가 $1$인 이차함수 $f」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q14(16): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_FUNCTION_DETERMINATION / TPL=TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE (원천과 같음) (원천과 같음)
- 이유: Q14(16): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 5 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(16): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 5 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「(단, $p,\ q$는 서로소인 자연수이다.)」
- method: 정리(NAMED)←solution:「$N(x) = g(x)-f(x) = (x^2-」
- condition: (없음)

**how** Q14(16): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$N(x) = g(x)-f(x) = (x^2-4x+a-1)f(x)$라 두면 조건 (가)에서 $N(3) = 0$, $N'(3) = 0$이다.

$$N(3) = (a-4)f(3) = 0, \qquad N'(3) = 2f(3) + (a-4)f'(3) = 0$$

만약 $a\ne 4$이면 $f(3)=0$, $f'(3)=0$이 되어 $g'(3) = 2f(3)+(a-3)f'(3) = 0$이 되므로 조건 (나)에 모순이다.

따라서 $a=4$이고 $f(3)=0$, $g'(3)=f'(3)\ne 0$이므로 $f(x) = (x-3)(x-r)$ ($r\ne 3$), $g(x) = (x-2)^2 f(x)$이다.

이제 $g'(x) = 2(x-2)f(x) + (x-2)^2 f'(x)$에 $f(\alpha)=f'(\alpha)$를 대입하면

$$g'(\alpha) = {2(\alpha-2) + (\alpha-2)^2}f'(\alpha) = (\alpha^2-2\alpha)f'(\alpha) = 3f'(\alpha)$$

$f'(\alpha)=0$이면 $f(\alpha)=0$이 되어 $f$가 중근을 가져 $f'(3)=0$이므로 모순이다. 따라서 $\alpha^2-2\alpha-3=0$에서 $\alpha=3$ 또는 $\alpha=-1$이고, $\alpha=3$이면 $f'(3)=0$으로 모순이므로 $\alpha=-1$이다.

$f(-1)=f'(-1)$에서 $(-4)(-1-r) = -5-r \implies 5r = -9 \implies r = -\dfrac{9}{5}$이다.

따라서 $\alpha+5=4$이고 $g(4) = 2^2(4-3)\left(4+\dfrac{9}{5}\right) = \dfrac{116}{5}$이므로 $\dfrac{g(4)}{16} = \dfrac{29}{20}$, 즉 $p+q = 29+20 = 49$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 단답형 4점


**발문**

[서답형 1번] 함수 $f(x)=-x^3+ax^2-27x+5$가 모든 실수에서 감소하도록 하는 실수 $a$의 값의 범위가 $m\le a\le n$일 때, $n-m$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 18   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 다항함수 $f(x)$가 모든 실수에서 감소하려면 모든 실수 $x$에 대하여 $f'(x) \le 0$이어야 한다.
2. $$f'(x) = -3x^2 + 2ax - 27 \le 0$$

이차방정식 $-3x^2 + 2ax - 27 = 0$의 판별식 $D$가 $D \le 0$이어야 하므로

$$\frac{D}{4} = a^2 - (-3)(-27) = a^2 - 81 \le 0 \implies -9 \le a \le 9$$

따라서 $m = -9,\ n = 9$이므로 $n - m = 9 - (-9) = 18$이다.
- 작성자 답: 18 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-06(도함수의 활용) / H15-M2-06-DERIVATIVE_APPLICATION(도함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 1번] 함수 $f(x)=-x^3+ax^2-27」
**RPM** H2-M2-RPM-021 [미분 > 도함수의 활용(1) > 평균값 정리 기초 > 변화율] **원천→판정: 미분 > 도함수의 활용(2) > 증가·감소와 극값 > 증감표 → 미분 > 도함수의 활용(1) > 평균값 정리 기초 > 변화율**
- 이유: Q15(ax): 도함수의 활용 단원의 RPM H2-M2-RPM-021 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_MONOTONICITY / TPL=TPL_MONOTONICITY_CONDITION (원천과 같음) (원천과 같음)
- 이유: Q15(ax): 도함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(ax): 도함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「le n$일 때, $n-m$의 값을 구하시오.」
- method: 정리(NAMED)←solution:「다항함수 $f(x)$가 모든 실수에서 감소하려」
- condition: (없음)

**how** Q15(ax): 발문과 해설의 풀이 과정을 점검하여 정답 18를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

다항함수 $f(x)$가 모든 실수에서 감소하려면 모든 실수 $x$에 대하여 $f'(x) \le 0$이어야 한다.

$$f'(x) = -3x^2 + 2ax - 27 \le 0$$

이차방정식 $-3x^2 + 2ax - 27 = 0$의 판별식 $D$가 $D \le 0$이어야 하므로

$$\frac{D}{4} = a^2 - (-3)(-27) = a^2 - 81 \le 0 \implies -9 \le a \le 9$$

따라서 $m = -9,\ n = 9$이므로 $n - m = 9 - (-9) = 18$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 단답형 5점


**발문**

[서답형 2번] 실수 $a,\ b$에 대하여 함수 $f(x)=\begin{cases}x^2-6x&(x<1)\x^2+2ax+b&(x\ge 1)\end{cases}$와 실수 전체의 집합에서 정의된 함수 $g(x)=\lim_{t\to x+}\dfrac{f(t)-f(x)}{t-x}-\lim_{t\to x-}\dfrac{f(t)-f(x)}{t-x}$가 있다. 함수 $g(x)$의 치역의 모든 원소의 합이 $10$일 때, $ab$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** -20   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $g(1)$이 정의되려면 $x=1$에서 좌극한과 함숫값이 같아야 하므로 $f(x)$는 $x=1$에서 연속이다. (cases)
2. $$1^2 - 6(1) = 1^2 + 2a + b \implies 2a + b = -6$$

$x\ne 1$에서는 좌미분계수와 우미분계수가 같으므로 $g(x) = 0$이다.
3. $x=1$에서는 다음과 같다.
4. $$g(1) = (2(1)+2a) - (2(1)-6) = (2+2a) - (-4) = 6 + 2a$$

따라서 $g(x)$의 치역은 ${0,\ 6+2a}$이고 모든 원소의 합이 $10$이므로 $6+2a = 10 \implies a = 2$이다.
5. $2(2) + b = -6$에서 $b = -10$이므로 $ab = 2 \times (-10) = -20$이다.
- 작성자 답: -20 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 2번] 실수 $a,\ b$에 대하여 함수 $f」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 미분가능성과 연속 > 미분가능 조건 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q16(cases): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DIFFERENTIABILITY_CONDITION / TPL=TPL_DIFFERENTIABILITY_POINT_CONDITION (원천과 같음) (원천과 같음)
- 이유: Q16(cases): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(cases): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「이 $10$일 때, $ab$의 값을 구하시오.」
- method: 정리(NAMED)←solution:「$g(1)$이 정의되려면 $x=1$에서 좌극한」
- condition: (없음)

**how** Q16(cases): 발문과 해설의 풀이 과정을 점검하여 정답 -20를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$g(1)$이 정의되려면 $x=1$에서 좌극한과 함숫값이 같아야 하므로 $f(x)$는 $x=1$에서 연속이다.

$$1^2 - 6(1) = 1^2 + 2a + b \implies 2a + b = -6$$

$x\ne 1$에서는 좌미분계수와 우미분계수가 같으므로 $g(x) = 0$이다. $x=1$에서는 다음과 같다.

$$g(1) = (2(1)+2a) - (2(1)-6) = (2+2a) - (-4) = 6 + 2a$$

따라서 $g(x)$의 치역은 ${0,\ 6+2a}$이고 모든 원소의 합이 $10$이므로 $6+2a = 10 \implies a = 2$이다.

$2(2) + b = -6$에서 $b = -10$이므로 $ab = 2 \times (-10) = -20$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 단답형 6점


**발문**

[서답형 3번] 다항함수 $f(x)$가 모든 실수 $x,\ y$에 대하여 $f(x+y)=f(x)+f(y)-3xy(x+y)+2$를 만족시킨다. $\lim_{x\to 1}\dfrac{f(x)-f'(x)}{x-1}=5$일 때, $f'(0)$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 2   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y=0$을 대입하면 $f(x) = f(x) + f(0) + 2$이므로 $f(0) = -2$이다.
2. 함수방정식의 혼합항이 $3$차이므로 $f(x) = Ax^3 + Bx^2 + Cx + D$라 두면

$$f(x+y) - f(x) - f(y) = 3Axy(x+y) + 2Bxy - D = -3xy(x+y) + 2$$

따라서 $3A = -3,\ 2B = 0,\ -D = 2$에서 $A = -1,\ B = 0,\ D = -2$이므로 $f(x) = -x^3 + Cx - 2$, $f'(x) = -3x^2 + C$이다.
3. $F(x) = f(x) - f'(x)$라 하면 $F(1) = (-1+C-2) - (-3+C) = 0$이므로

$$\lim_{x\to 1}\frac{F(x)}{x-1} = F'(1) = f'(1) - f''(1) = (-3+C) - (-6) = C + 3 = 5$$

따라서 $f'(0) = C = 2$이다.
- 작성자 답: 2 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 3번] 다항함수 $f(x)$가 모든 실수 $x」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q17(xy): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_FUNCTION_DETERMINATION / TPL=TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE (원천과 같음) (원천과 같음)
- 이유: Q17(xy): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(xy): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「=5$일 때, $f'(0)$의 값을 구하시오.」
- method: 정리(NAMED)←solution:「$y=0$을 대입하면 $f(x) = f(x)」
- condition: (없음)

**how** Q17(xy): 발문과 해설의 풀이 과정을 점검하여 정답 2를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y=0$을 대입하면 $f(x) = f(x) + f(0) + 2$이므로 $f(0) = -2$이다.

함수방정식의 혼합항이 $3$차이므로 $f(x) = Ax^3 + Bx^2 + Cx + D$라 두면

$$f(x+y) - f(x) - f(y) = 3Axy(x+y) + 2Bxy - D = -3xy(x+y) + 2$$

따라서 $3A = -3,\ 2B = 0,\ -D = 2$에서 $A = -1,\ B = 0,\ D = -2$이므로 $f(x) = -x^3 + Cx - 2$, $f'(x) = -3x^2 + C$이다.

$F(x) = f(x) - f'(x)$라 하면 $F(1) = (-1+C-2) - (-3+C) = 0$이므로

$$\lim_{x\to 1}\frac{F(x)}{x-1} = F'(1) = f'(1) - f''(1) = (-3+C) - (-6) = C + 3 = 5$$

따라서 $f'(0) = C = 2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 서술형 5점


**발문**

[서답형 4번] 함수 $f(x)=\begin{cases}x^2+2x&(x\le 0)\-3x^2+2x&(x>0)\end{cases}$에 대하여 $\dfrac{f(a)-f(-1)}{a+1}=f'(c)$를 만족시키고 열린구간 $(-1,\ a)$에 속하는 상수 $c$의 개수가 $2$가 되도록 하는 모든 실수 $a$의 값의 범위는 $p < a < q$이다. $3(p+q)$의 값을 구하고 그 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2\sqrt{3}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(-1) = -1$이고, 열린구간 $(-1,\ a)$에 해 $c$가 $2$개 존재하려면 구간이 $0$을 포함해야 하므로 $a > 0$이다. (cases)
2. 할선의 기울기를 $S = \dfrac{f(a)-f(-1)}{a+1} = \dfrac{-3a^2+2a+1}{a+1}$라 두자.
3. 1.
4. $-1 < c < 0$에서 $f'(c) = 2c+2$이므로 해가 존재할 조건은 $0 < S < 2$이다.
5. - $S > 0 \iff -3a^2+2a+1 > 0 \iff (3a+1)(a-1) < 0 \implies 0 < a < 1$  
   - $S < 2 \iff -3a^2+2a+1 < 2a+2 \iff -3a^2 < 1$ (항상 성립)  
2.
6. $0 < c < a$에서 $f'(c) = -6c+2 = S \implies c = \dfrac{2-S}{6}$이므로 $S > 2-6a$이어야 한다.
7. $$-3a^2+2a+1 > (2-6a)(a+1) = -6a^2-4a+2 \implies 3a^2+6a-1 > 0$$ $a > 0$이므로 $a > -1 + \dfrac{2\sqrt{3}}{3}$이다.
8. 따라서 $-1 + \dfrac{2\sqrt{3}}{3} < a < 1$이므로 $p = -1 + \dfrac{2\sqrt{3}}{3}$, $q = 1$이다.
9. 그러므로 $3(p+q) = 3\cdot\dfrac{2\sqrt{3}}{3} = 2\sqrt{3}$이다.
- 작성자 답: $2\sqrt{3}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-06(도함수의 활용) / H15-M2-06-DERIVATIVE_APPLICATION(도함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 4번] 함수 $f(x)=\begin{cases」
**RPM** H2-M2-RPM-021 [미분 > 도함수의 활용(1) > 평균값 정리 기초 > 변화율] **원천→판정: 미분 > 도함수의 활용(1) > 평균값 정리 기초 > 기울기 조건 → 미분 > 도함수의 활용(1) > 평균값 정리 기초 > 변화율**
- 이유: Q18(cases): 도함수의 활용 단원의 RPM H2-M2-RPM-021 유형에 해당한다.
**유형** PT=PT_MEAN_VALUE_THEOREM / TPL=TPL_MVT_ROLLE_DIRECT (원천과 같음) (원천과 같음)
- 이유: Q18(cases): 도함수의 활용 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(cases): 도함수의 활용 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「+q)$의 값을 구하고 그 과정을 서술하시오.」
- method: 정리(NAMED)←solution:「$f(-1) = -1$이고, 열린구간 $(-1」
- condition: (없음)

**how** Q18(cases): 발문과 해설의 풀이 과정을 점검하여 정답 $2\sqrt{3}$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(-1) = -1$이고, 열린구간 $(-1,\ a)$에 해 $c$가 $2$개 존재하려면 구간이 $0$을 포함해야 하므로 $a > 0$이다. 할선의 기울기를 $S = \dfrac{f(a)-f(-1)}{a+1} = \dfrac{-3a^2+2a+1}{a+1}$라 두자.

1. $-1 < c < 0$에서 $f'(c) = 2c+2$이므로 해가 존재할 조건은 $0 < S < 2$이다.  
   - $S > 0 \iff -3a^2+2a+1 > 0 \iff (3a+1)(a-1) < 0 \implies 0 < a < 1$  
   - $S < 2 \iff -3a^2+2a+1 < 2a+2 \iff -3a^2 < 1$ (항상 성립)  
2. $0 < c < a$에서 $f'(c) = -6c+2 = S \implies c = \dfrac{2-S}{6}$이므로 $S > 2-6a$이어야 한다. $$-3a^2+2a+1 > (2-6a)(a+1) = -6a^2-4a+2 \implies 3a^2+6a-1 > 0$$ $a > 0$이므로 $a > -1 + \dfrac{2\sqrt{3}}{3}$이다.

따라서 $-1 + \dfrac{2\sqrt{3}}{3} < a < 1$이므로 $p = -1 + \dfrac{2\sqrt{3}}{3}$, $q = 1$이다. 그러므로 $3(p+q) = 3\cdot\dfrac{2\sqrt{3}}{3} = 2\sqrt{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 서술형 7점


**발문**

[서답형 5번] $10$보다 작은 세 자연수 $a,\ b,\ n$에 대하여 $\lim_{x\to 5}\dfrac{|x-a|^n-|a-5|^n}{x-5}=b$일 때, $a^2+b^2$의 최댓값을 구하고 그 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 97   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 주어진 극한은 $h(x) = |x-a|^n$의 $x=5$에서의 미분계수 $h'(5)$이다.
2. $a=5$이면 극한은 $n=1$일 때 존재하지 않고 $n\ge 2$일 때 $0$이므로 자연수 $b$가 될 수 없다.
3. 따라서 $a\ne 5$이고, $x=5$ 근방에서 $h'(5) = n(5-a)|5-a|^{n-2} = b > 0$이다.
4. $b > 0$이므로 $a < 5$, 즉 $a \in {1,\ 2,\ 3,\ 4}$이다.
5. 각 $a$에 대해 $b < 10$인 경우를 조사하면 다음과 같다.
6. - $a = 4$: $b = n$이므로 $n = 9$일 때 $b = 9$가 최대이고 $a^2+b^2 = 4^2+9^2 = 97$  
- $a = 3$: $b = n\cdot 2^{n-1} < 10$에서 최대는 $n = 2,\ b = 4$이고 $a^2+b^2 = 3^2+4^2 = 25$  
- $a = 2$: $b = n\cdot 3^{n-1} < 10$에서 최대는 $n = 2,\ b = 6$이고 $a^2+b^2 = 2^2+6^2 = 40$  
- $a = 1$: $b = n\cdot 4^{n-1} < 10$에서 최대는 $n = 2,\ b = 8$이고 $a^2+b^2 = 1^2+8^2 = 65$

따라서 $a^2+b^2$의 최댓값은 $97$이다.
- 작성자 답: 97 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-03(미분계수) / H15-M2-03-DERIVATIVE_DEFINITION(미분계수) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 5번] $10$보다 작은 세 자연수 $a,\ 」
**RPM** H2-M2-RPM-013 [미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율] **원천→판정: 미분 > 미분계수와 도함수 > 미분계수 > 정의로 미분계수 → 미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율**
- 이유: Q19(10): 미분계수 단원의 RPM H2-M2-RPM-013 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_DEFINITION / TPL=TPL_DERIVATIVE_LIMIT_REDUCTION (원천과 같음) (원천과 같음)
- 이유: Q19(10): 미분계수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(10): 미분계수 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「2$의 최댓값을 구하고 그 과정을 서술하시오.」
- method: 정리(NAMED)←solution:「주어진 극한은 $h(x) = |x-a|^n$의」
- condition: (없음)

**how** Q19(10): 발문과 해설의 풀이 과정을 점검하여 정답 97를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 극한은 $h(x) = |x-a|^n$의 $x=5$에서의 미분계수 $h'(5)$이다.

$a=5$이면 극한은 $n=1$일 때 존재하지 않고 $n\ge 2$일 때 $0$이므로 자연수 $b$가 될 수 없다. 따라서 $a\ne 5$이고, $x=5$ 근방에서 $h'(5) = n(5-a)|5-a|^{n-2} = b > 0$이다.

$b > 0$이므로 $a < 5$, 즉 $a \in {1,\ 2,\ 3,\ 4}$이다. 각 $a$에 대해 $b < 10$인 경우를 조사하면 다음과 같다.

- $a = 4$: $b = n$이므로 $n = 9$일 때 $b = 9$가 최대이고 $a^2+b^2 = 4^2+9^2 = 97$  
- $a = 3$: $b = n\cdot 2^{n-1} < 10$에서 최대는 $n = 2,\ b = 4$이고 $a^2+b^2 = 3^2+4^2 = 25$  
- $a = 2$: $b = n\cdot 3^{n-1} < 10$에서 최대는 $n = 2,\ b = 6$이고 $a^2+b^2 = 2^2+6^2 = 40$  
- $a = 1$: $b = n\cdot 4^{n-1} < 10$에서 최대는 $n = 2,\ b = 8$이고 $a^2+b^2 = 1^2+8^2 = 65$

따라서 $a^2+b^2$의 최댓값은 $97$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 서술형 8점


**발문**

[서답형 6번] 삼차함수 $f(x)=x^3+kx$에 대하여 다항함수 $g(x)$가 다음 조건을 만족시킨다.

(가) $a\ne 0$에 대하여 $f'(a)=\dfrac{f(a)-f(g(a))}{a-g(a)}$이다. (나) 방정식 $f'(x)\times f'(g(x))=k^2$의 실근 중 $0$이 아닌 두 실근이 존재하며, 곱은 $-10$이다.

$0$이 아닌 실수 $x$에 대하여 $g(x)\ne x$일 때, $g\left(\dfrac{k}{6}\right)$의 값을 구하고 그 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 8   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $a\ne g(a)$이므로 조건 (가)의 우변을 인수분해하여 정리하면 다음과 같다. (kx)
2. $$f'(a) = 3a^2 + k = \frac{a^3 - g(a)^3 + k{a-g(a)}}{a-g(a)} = a^2 + ag(a) + g(a)^2 + k$$

$$2a^2 - ag(a) - g(a)^2 = (a-g(a))(2a+g(a)) = 0$$

$0$이 아닌 실수 $a$에 대하여 $g(a)\ne a$이고 $g$는 다항함수이므로 $g(x) = -2x$이다.
3. 따라서 $f'(g(x)) = 3(-2x)^2 + k = 12x^2 + k$이므로 조건 (나)의 방정식은 다음과 같다.
4. $$(3x^2+k)(12x^2+k) = k^2 \implies 3x^2(12x^2+5k) = 0$$

$0$이 아닌 두 실근은 $x = \pm\sqrt{-\dfrac{5k}{12}}$이고, 두 근의 곱이 $-10$이므로

$$\frac{5k}{12} = -10 \implies k = -24$$

따라서 $\dfrac{k}{6} = -4$이므로 $g(-4) = -2(-4) = 8$이다.
- 작성자 답: 8 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 6번] 삼차함수 $f(x)=x^3+kx$에 대」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q20(kx): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_FUNCTION_DETERMINATION / TPL=TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE (원천과 같음) (원천과 같음)
- 이유: Q20(kx): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(kx): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「ht)$의 값을 구하고 그 과정을 서술하시오.」
- method: 정리(NAMED)←solution:「$a\ne g(a)$이므로 조건 (가)의 우변」
- condition: (없음)

**how** Q20(kx): 발문과 해설의 풀이 과정을 점검하여 정답 8를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$a\ne g(a)$이므로 조건 (가)의 우변을 인수분해하여 정리하면 다음과 같다.

$$f'(a) = 3a^2 + k = \frac{a^3 - g(a)^3 + k{a-g(a)}}{a-g(a)} = a^2 + ag(a) + g(a)^2 + k$$

$$2a^2 - ag(a) - g(a)^2 = (a-g(a))(2a+g(a)) = 0$$

$0$이 아닌 실수 $a$에 대하여 $g(a)\ne a$이고 $g$는 다항함수이므로 $g(x) = -2x$이다.

따라서 $f'(g(x)) = 3(-2x)^2 + k = 12x^2 + k$이므로 조건 (나)의 방정식은 다음과 같다.

$$(3x^2+k)(12x^2+k) = k^2 \implies 3x^2(12x^2+5k) = 0$$

$0$이 아닌 두 실근은 $x = \pm\sqrt{-\dfrac{5k}{12}}$이고, 두 근의 곱이 $-10$이므로

$$\frac{5k}{12} = -10 \implies k = -24$$

따라서 $\dfrac{k}{6} = -4$이므로 $g(-4) = -2(-4) = 8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
