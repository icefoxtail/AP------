# 검수 묶음 — 25_매산여고_2학기_중간_고2_수학II_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 5)**
- 문항 23개 / 검사 PASS 18, FAIL 5, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 7, 2단계 4, 3단계 6, 4단계 5, 5단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q4**: 검사 코드: CHOICE_ORDER
- **Q8**: 검사 코드: CHOICE_ORDER
- **Q13**: 검사 코드: CHOICE_ORDER
- **Q16**: 검사 코드: CHOICE_ORDER

---
## Q1 — 객관식 3.5점


**발문**

$\lim_{x\to -2}\dfrac{x^2+5x+6}{x+2}$의 값은?

**보기** ① $0$  ② $1$  ③ $2$  ④ $3$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q1 문제의 조건(x)에 맞추어 식을 세운다.
2. $x\ne -2$일 때 $\dfrac{x^2+5x+6}{x+2} = \dfrac{(x+2)(x+3)}{x+2} = x+3$이므로

$$\lim_{x\to -2}\frac{x^2+5x+6}{x+2} = \lim_{x\to -2}(x+3) = -2+3 = 1$$

따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\lim_{x\to -2}\dfrac{x^2+5x+6」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 극한값 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q1(x): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음)
- 이유: Q1(x): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1(x): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「frac{x^2+5x+6}{x+2}$의 값은?」
- method: 정리(NAMED)←solution:「$x\ne -2$일 때 $\dfrac{x^2+」
- condition: (없음)

**how** Q1(x): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x\ne -2$일 때 $\dfrac{x^2+5x+6}{x+2} = \dfrac{(x+2)(x+3)}{x+2} = x+3$이므로

$$\lim_{x\to -2}\frac{x^2+5x+6}{x+2} = \lim_{x\to -2}(x+3) = -2+3 = 1$$

따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.5점


**발문**

함수 $y=f(x)$의 그래프가 그림과 같을 때, $\lim_{x\to 0-}f(x) + \lim_{x\to 1+}f(x)$의 값은?

**보기** ① $-2$  ② $-1$  ③ $0$  ④ $1$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 그래프에서 $x\to 0-$일 때 곡선은 열린 점 $(0,\ 2)$에 가까워지므로 $\lim_{x\to 0-}f(x) = 2$이고, $x\to 1+$일 때 직선은 열린 점 $(1,\ -1)$에서 시작하므로 $\lim_{x\to 1+}f(x) = -1$이다. (y)
2. 따라서 구하는 값은 $2 + (-1) = 1$이다.
3. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $y=f(x)$의 그래프가 그림과 같을 때, $\」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] (원천과 같음)
- 이유: Q2(y): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_DIRECTIONAL_APPROACH (원천과 같음) (원천과 같음)
- 이유: Q2(y): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2(y): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「\lim_{x\to 1+}f(x)$의 값은?」
- method: 정리(NAMED)←solution:「그래프에서 $x\to 0-$일 때 곡선은 열린」
- condition: (없음)

**how** Q2(y): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

그래프에서 $x\to 0-$일 때 곡선은 열린 점 $(0,\ 2)$에 가까워지므로 $\lim_{x\to 0-}f(x) = 2$이고, $x\to 1+$일 때 직선은 열린 점 $(1,\ -1)$에서 시작하므로 $\lim_{x\to 1+}f(x) = -1$이다.

따라서 구하는 값은 $2 + (-1) = 1$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.6점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

함수 $f(x)=\begin{cases}x^2+3x&(x\le 1)\a&(x>1)\end{cases}$이 $x=1$에서 연속일 때, 상수 $a$의 값은?

**보기** ① $4$  ② $2$  ③ $3$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x=1$에서 연속이므로 $\lim_{x\to 1+}f(x) = f(1)$이어야 한다. (cases)
2. $$a = 1^2 + 3(1) = 4$$

따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-02(함수의 연속) / H15-M2-02-CONTINUITY(함수의 연속) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=\begin{cases}x^2+3x&(」
**RPM** H2-M2-RPM-007 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 구간별 함수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: Q3(cases): 함수의 연속 단원의 RPM H2-M2-RPM-007 유형에 해당한다.
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH (원천과 같음) (원천과 같음)
- 이유: Q3(cases): 함수의 연속 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3(cases): 함수의 연속 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「x=1$에서 연속일 때, 상수 $a$의 값은?」
- method: 정리(NAMED)←solution:「$x=1$에서 연속이므로 $\lim_{x\to」
- condition: (없음)

**how** Q3(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x=1$에서 연속이므로 $\lim_{x\to 1+}f(x) = f(1)$이어야 한다.

$$a = 1^2 + 3(1) = 4$$

따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.6점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

두 함수 $f(x)=\begin{cases}2x-5&(x\ge 1)\-x+4&(x<1)\end{cases}$, $g(x)=3^x+k$에 대하여 함수 $f(x)g(x)$가 $x=1$에서 연속일 때, 상수 $k$의 값은?

**보기** ① $-9$  ② $-6$  ③ $-4$  ④ $-1$  ⑤ $-3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x\to 1-$일 때 $f(x)\to -1+4=3$이고 $f(1)=2-5=-3$이다. (cases)
2. 곱함수 $f(x)g(x)$가 $x=1$에서 연속이려면 $3(3+k) = -3(3+k)$이어야 하므로 $6(3+k)=0$, 즉 $k = -3$이다.
3. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-02(함수의 연속) / H15-M2-02-CONTINUITY(함수의 연속) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 함수 $f(x)=\begin{cases}2x-5&(」
**RPM** H2-M2-RPM-007 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 미정계수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: Q4(cases): 함수의 연속 단원의 RPM H2-M2-RPM-007 유형에 해당한다.
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_FACTOR_CONDITION (원천과 같음)
- 이유: Q4(cases): 함수의 연속 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4(cases): 함수의 연속 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「x=1$에서 연속일 때, 상수 $k$의 값은?」
- method: 정리(NAMED)←solution:「$x\to 1-$일 때 $f(x)\to -1+」
- condition: (없음)

**how** Q4(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x\to 1-$일 때 $f(x)\to -1+4=3$이고 $f(1)=2-5=-3$이다.

곱함수 $f(x)g(x)$가 $x=1$에서 연속이려면 $3(3+k) = -3(3+k)$이어야 하므로 $6(3+k)=0$, 즉 $k = -3$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.7점


**발문**

함수 $f(x)=3x^2-4x+5$의 $x=2$에서의 미분계수의 값은?

**보기** ① $4$  ② $6$  ③ $8$  ④ $10$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f'(x) = 6x - 4$이므로 $f'(2) = 6(2) - 4 = 8$이다. (10)
2. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=3x^2-4x+5$의 $x=2$에서의 」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q5(10): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_RULE_EVALUATION / TPL=TPL_DERIVATIVE_RULE_CALCULATION (원천과 같음) (원천과 같음)
- 이유: Q5(10): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5(10): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「4x+5$의 $x=2$에서의 미분계수의 값은?」
- method: 정리(NAMED)←solution:「$f'(x) = 6x - 4$이므로 $f'(2」
- condition: (없음)

**how** Q5(10): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f'(x) = 6x - 4$이므로 $f'(2) = 6(2) - 4 = 8$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.7점


**발문**

함수 $f(x)=x^2-4x+5$에 대하여 $\lim_{h\to 0}\dfrac{f(5+h)-f(5)}{2h}$의 값은?

**보기** ① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 주어진 극한은 $\dfrac{1}{2}\lim_{h\to 0}\dfrac{f(5+h)-f(5)}{h} = \dfrac{1}{2}f'(5)$이다.
2. $f'(x) = 2x - 4$이므로 $f'(5) = 10 - 4 = 6$이고, 구하는 값은 $\dfrac{1}{2}\times 6 = 3$이다.
3. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-03(미분계수) / H15-M2-03-DERIVATIVE_DEFINITION(미분계수) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=x^2-4x+5$에 대하여 $\lim_」
**RPM** H2-M2-RPM-013 [미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율] **원천→판정: 미분 > 미분계수와 도함수 > 미분계수 > 정의로 미분계수 → 미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율**
- 이유: Q6(10): 미분계수 단원의 RPM H2-M2-RPM-013 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_DEFINITION / TPL=TPL_DERIVATIVE_LIMIT_REDUCTION (원천과 같음) (원천과 같음)
- 이유: Q6(10): 미분계수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6(10): 미분계수 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「ac{f(5+h)-f(5)}{2h}$의 값은?」
- method: 정리(NAMED)←solution:「주어진 극한은 $\dfrac{1}{2}\lim」
- condition: (없음)

**how** Q6(10): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 극한은 $\dfrac{1}{2}\lim_{h\to 0}\dfrac{f(5+h)-f(5)}{h} = \dfrac{1}{2}f'(5)$이다.

$f'(x) = 2x - 4$이므로 $f'(5) = 10 - 4 = 6$이고, 구하는 값은 $\dfrac{1}{2}\times 6 = 3$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.8점


**발문**

함수 $f(x)$에 대하여 $x$의 값이 $1$에서 $3$까지 변할 때의 평균변화율은 $3$이고, $x$의 값이 $3$에서 $6$까지 변할 때의 평균변화율은 $8$이다. $x$의 값이 $1$에서 $6$까지 변할 때의 평균변화율은?

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q7 문제의 조건(24)에 맞추어 식을 세운다.
2. $f(3)-f(1) = 3(3-1) = 6$, $f(6)-f(3) = 8(6-3) = 24$이므로

$$\frac{f(6)-f(1)}{6-1} = \frac{6+24}{5} = 6$$

따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-03(미분계수) / H15-M2-03-DERIVATIVE_DEFINITION(미분계수) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)$에 대하여 $x$의 값이 $1$에서 $」
**RPM** H2-M2-RPM-013 [미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율] (원천과 같음)
- 이유: Q7(24): 미분계수 단원의 RPM H2-M2-RPM-013 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_RATE_RELATION / TPL=TPL_AVERAGE_RATE_DERIVATIVE_LINK (원천과 같음) (원천과 같음)
- 이유: Q7(24): 미분계수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7(24): 미분계수 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$1$에서 $6$까지 변할 때의 평균변화율은?」
- method: 정리(NAMED)←solution:「$f(3)-f(1) = 3(3-1) = 6$,」
- condition: (없음)

**how** Q7(24): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(3)-f(1) = 3(3-1) = 6$, $f(6)-f(3) = 8(6-3) = 24$이므로

$$\frac{f(6)-f(1)}{6-1} = \frac{6+24}{5} = 6$$

따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

함수 $f(x)=(2x+5)g(x)$이고, 곡선 $y=g(x)$ 위의 점 $(1,\ -4)$에서의 접선의 기울기가 $3$일 때, $f'(1)$의 값은?

**보기** ① $13$  ② $9$  ③ $11$  ④ $15$  ⑤ $17$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. Q8 문제의 조건(13)에 맞추어 식을 세운다.
2. $g(1)=-4,\ g'(1)=3$이고 곱의 미분법에 의하여 $f'(x) = 2g(x) + (2x+5)g'(x)$이므로

$$f'(1) = 2(-4) + 7(3) = -8 + 21 = 13$$

따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=(2x+5)g(x)$이고, 곡선 $y=」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] (원천과 같음)
- 이유: Q8(13): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_RULE_EVALUATION / TPL=TPL_DERIVATIVE_RULE_CALCULATION (원천과 같음) (원천과 같음)
- 이유: Q8(13): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8(13): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 1 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「기울기가 $3$일 때, $f'(1)$의 값은?」
- method: 정리(NAMED)←solution:「$g(1)=-4,\ g'(1)=3$이고 곱의」
- condition: (없음)

**how** Q8(13): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$g(1)=-4,\ g'(1)=3$이고 곱의 미분법에 의하여 $f'(x) = 2g(x) + (2x+5)g'(x)$이므로

$$f'(1) = 2(-4) + 7(3) = -8 + 21 = 13$$

따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3.9점


**발문**

함수 $f(x)=\begin{cases}x^3+ax&(x<1)\bx^2-2x+3&(x\ge 1)\end{cases}$이 $x=1$에서 미분가능할 때, $a+b$의 값은? (단, $a,\ b$는 상수)

**보기** ① $6$  ② $8$  ③ $10$  ④ $12$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x=1$에서 연속 조건은 $1+a = b-2+3 \implies a = b$이다. (cases)
2. 좌미분계수와 우미분계수의 일치 조건은 $3(1)^2+a = 2b(1)-2 \implies 3+a = 2b-2$이다.
3. $a=b$를 대입하면 $3+b=2b-2 \implies b=5,\ a=5$이므로 $a+b=10$이다.
4. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=\begin{cases}x^3+ax&(」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 미분가능성과 연속 > 미분가능 조건 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q9(cases): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DIFFERENTIABILITY_CONDITION / TPL=TPL_DIFFERENTIABILITY_POINT_CONDITION (원천과 같음) (원천과 같음)
- 이유: Q9(cases): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9(cases): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「+b$의 값은? (단, $a,\ b$는 상수)」
- method: 정리(NAMED)←solution:「$x=1$에서 연속 조건은 $1+a = b-2」
- condition: (없음)

**how** Q9(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x=1$에서 연속 조건은 $1+a = b-2+3 \implies a = b$이다.

좌미분계수와 우미분계수의 일치 조건은 $3(1)^2+a = 2b(1)-2 \implies 3+a = 2b-2$이다.

$a=b$를 대입하면 $3+b=2b-2 \implies b=5,\ a=5$이므로 $a+b=10$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 3.9점


**발문**

함수 $f(x)=\dfrac{|x^3-8|}{x-2}$에서 $\lim_{x\to 2+}f(x)=a$, $\lim_{x\to 2-}f(x)=b$라 할 때, $a-b$의 값은? (단, $a,\ b$는 상수)

**보기** ① $0$  ② $6$  ③ $12$  ④ $18$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x\to 2+$일 때 $x^3-8>0$이므로 $f(x) = \dfrac{(x-2)(x^2+2x+4)}{x-2} = x^2+2x+4 \to 12$, 즉 $a=12$이다.
2. $x\to 2-$일 때 $x^3-8<0$이므로 $f(x) = -(x^2+2x+4) \to -12$, 즉 $b=-12$이다.
3. 따라서 $a-b = 12 - (-12) = 24$이다.
4. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=\dfrac{|x^3-8|}{x-2}$」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] (원천과 같음)
- 이유: Q10(12): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_DIRECTIONAL_APPROACH (원천과 같음) (원천과 같음)
- 이유: Q10(12): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10(12): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「-b$의 값은? (단, $a,\ b$는 상수)」
- method: 정리(NAMED)←solution:「$x\to 2+$일 때 $x^3-8>0$이므로」
- condition: (없음)

**how** Q10(12): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x\to 2+$일 때 $x^3-8>0$이므로 $f(x) = \dfrac{(x-2)(x^2+2x+4)}{x-2} = x^2+2x+4 \to 12$, 즉 $a=12$이다.

$x\to 2-$일 때 $x^3-8<0$이므로 $f(x) = -(x^2+2x+4) \to -12$, 즉 $b=-12$이다.

따라서 $a-b = 12 - (-12) = 24$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 3.9점


**발문**

실수 전체의 집합에서 정의된 두 함수 $f(x),\ g(x)$에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?

ㄱ. $\lim_{x\to\infty}xf(x)$의 값이 존재하면 $\lim_{x\to\infty}f(x)=0$이다. ㄴ. $\lim_{x\to\infty}\dfrac{1}{f(x)}=0$이면 $\lim_{x\to\infty}f(x)$의 값이 존재한다. ㄷ. $\lim_{x\to a}f(x)$와 $\lim_{x\to a}{f(x)+g(x)}$의 값이 존재하면 $\lim_{x\to a}g(x)$의 값도 존재한다. ㄹ. $\lim_{x\to 0}f(x)=\infty$, $\lim_{x\to 0}g(x)=0$이면 $\lim_{x\to 0}f(x)g(x)=0$이다.

**보기** ① ㄱ  ② ㄱ, ㄷ  ③ ㄴ, ㄷ  ④ ㄱ, ㄹ  ⑤ ㄱ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. - ㄱ: $\lim_{x\to\infty}xf(x)=L$이라 하면 $f(x)=\dfrac{xf(x)}{x}$이고 $\lim_{x\to\infty}\dfrac{1}{x}=0$이므로 $\lim_{x\to\infty}f(x)=L\cdot 0=0$이다.
2. (참)  
- ㄴ: $f(x)=x$이면 $\lim_{x\to\infty}\dfrac{1}{x}=0$이지만 $\lim_{x\to\infty}x=\infty$로 수렴하지 않는다.
3. (거짓)  
- ㄷ: $g(x)={f(x)+g(x)}-f(x)$이므로 극한의 차 성질에 의하여 $\lim_{x\to a}g(x)$도 존재한다.
4. (참)  
- ㄹ: $f(x)=\dfrac{1}{x^2},\ g(x)=x^2$이면 $\lim_{x\to 0}f(x)g(x)=1\ne 0$이다.
5. (거짓)

따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「실수 전체의 집합에서 정의된 두 함수 $f(x),\ g」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 대수적 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q11(xf): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_OPERATION_LAWS (원천과 같음) (원천과 같음)
- 이유: Q11(xf): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11(xf): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「im_{x\to 0}f(x)g(x)=0$이다.」
- method: 정리(NAMED)←solution:「- ㄱ: $\lim_{x\to\infty}xf」
- condition: (없음)

**how** Q11(xf): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

- ㄱ: $\lim_{x\to\infty}xf(x)=L$이라 하면 $f(x)=\dfrac{xf(x)}{x}$이고 $\lim_{x\to\infty}\dfrac{1}{x}=0$이므로 $\lim_{x\to\infty}f(x)=L\cdot 0=0$이다. (참)  
- ㄴ: $f(x)=x$이면 $\lim_{x\to\infty}\dfrac{1}{x}=0$이지만 $\lim_{x\to\infty}x=\infty$로 수렴하지 않는다. (거짓)  
- ㄷ: $g(x)={f(x)+g(x)}-f(x)$이므로 극한의 차 성질에 의하여 $\lim_{x\to a}g(x)$도 존재한다. (참)  
- ㄹ: $f(x)=\dfrac{1}{x^2},\ g(x)=x^2$이면 $\lim_{x\to 0}f(x)g(x)=1\ne 0$이다. (거짓)

따라서 옳은 것은 ㄱ, ㄷ이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

다항함수 $f(x)$가 $\lim_{x\to 2}\dfrac{f(x)}{x-2}=3$, $\lim_{x\to 4}\dfrac{f(x-1)}{x}=2$를 만족시킬 때, $\lim_{x\to 3}\dfrac{f(x-1)f(x)}{x-3}$의 값은?

**보기** ① $12$  ② $16$  ③ $20$  ④ $24$  ⑤ $28$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째 극한에서 분모가 $0$으로 가므로 $f(2)=0$이고 $f'(2)=3$이다. (12)
2. 둘째 극한에서 분모가 $4$로 수렴하므로 $\dfrac{f(3)}{4}=2 \implies f(3)=8$이다.
3. $$\lim_{x\to 3}\frac{f(x-1)f(x)}{x-3} = \lim_{x\to 3}\frac{f(x-1)-f(2)}{(x-1)-2}\cdot f(x) = f'(2)\cdot f(3) = 3\times 8 = 24$$

따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-03(미분계수) / H15-M2-03-DERIVATIVE_DEFINITION(미분계수) (원천과 같음) (원천과 같음)
- 근거 인용: 「다항함수 $f(x)$가 $\lim_{x\to 2}\df」
**RPM** H2-M2-RPM-013 [미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율] **원천→판정: 미분 > 미분계수와 도함수 > 미분계수 > 정의로 미분계수 → 미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율**
- 이유: Q12(12): 미분계수 단원의 RPM H2-M2-RPM-013 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_DEFINITION / TPL=TPL_DERIVATIVE_LIMIT_REDUCTION (원천과 같음) (원천과 같음)
- 이유: Q12(12): 미분계수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12(12): 미분계수 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「ac{f(x-1)f(x)}{x-3}$의 값은?」
- method: 정리(NAMED)←solution:「첫째 극한에서 분모가 $0$으로 가므로 $f(」
- condition: (없음)

**how** Q12(12): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째 극한에서 분모가 $0$으로 가므로 $f(2)=0$이고 $f'(2)=3$이다.

둘째 극한에서 분모가 $4$로 수렴하므로 $\dfrac{f(3)}{4}=2 \implies f(3)=8$이다.

$$\lim_{x\to 3}\frac{f(x-1)f(x)}{x-3} = \lim_{x\to 3}\frac{f(x-1)-f(2)}{(x-1)-2}\cdot f(x) = f'(2)\cdot f(3) = 3\times 8 = 24$$

따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

곡선 $y=\dfrac{\sqrt{3}x}{x-1}$ ($x>1$)과 두 직선 $y=t$ ($t>3$), $y=3$의 교점을 각각 $A,\ B$라 하고, 점 $A$에서 직선 $y=3$에 내린 수선의 발을 $H$라 할 때, $\lim_{t\to 3+}\dfrac{\overline{AH}}{\overline{BH}} = a+b\sqrt{3}$ ($a,\ b$는 유리수)이다. $a+b$의 값은?

**보기** ① $-2$  ② $-3$  ③ $-1$  ④ $1$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $s = \dfrac{\sqrt{3}x}{x-1}$을 $x$에 대하여 풀면 $x = \dfrac{s}{s-\sqrt{3}}$이므로 $x_A = \dfrac{t}{t-\sqrt{3}}$, $x_B = \dfrac{3}{3-\sqrt{3}}$이다.
2. $\overline{AH} = t-3$이고, $\overline{BH} = x_B - x_A = \dfrac{3(t-\sqrt{3})-t(3-\sqrt{3})}{(3-\sqrt{3})(t-\sqrt{3})} = \dfrac{\sqrt{3}(t-3)}{(3-\sqrt{3})(t-\sqrt{3})}$이므로

$$\lim_{t\to 3+}\frac{\overline{AH}}{\overline{BH}} = \lim_{t\to 3+}\frac{(3-\sqrt{3})(t-\sqrt{3})}{\sqrt{3}} = \frac{(3-\sqrt{3})^2}{\sqrt{3}} = \frac{12-6\sqrt{3}}{\sqrt{3}} = 4\sqrt{3} - 6$$

따라서 $a=-6,\ b=4$이므로 $a+b = -2$이다.
3. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「곡선 $y=\dfrac{\sqrt{3}x}{x-1}$ 」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 극한값 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q13(AH): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음)
- 이유: Q13(AH): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13(AH): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「,\ b$는 유리수)이다. $a+b$의 값은?」
- method: 정리(NAMED)←solution:「$s = \dfrac{\sqrt{3}x}{x-」
- condition: (없음)

**how** Q13(AH): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$s = \dfrac{\sqrt{3}x}{x-1}$을 $x$에 대하여 풀면 $x = \dfrac{s}{s-\sqrt{3}}$이므로 $x_A = \dfrac{t}{t-\sqrt{3}}$, $x_B = \dfrac{3}{3-\sqrt{3}}$이다.

$\overline{AH} = t-3$이고, $\overline{BH} = x_B - x_A = \dfrac{3(t-\sqrt{3})-t(3-\sqrt{3})}{(3-\sqrt{3})(t-\sqrt{3})} = \dfrac{\sqrt{3}(t-3)}{(3-\sqrt{3})(t-\sqrt{3})}$이므로

$$\lim_{t\to 3+}\frac{\overline{AH}}{\overline{BH}} = \lim_{t\to 3+}\frac{(3-\sqrt{3})(t-\sqrt{3})}{\sqrt{3}} = \frac{(3-\sqrt{3})^2}{\sqrt{3}} = \frac{12-6\sqrt{3}}{\sqrt{3}} = 4\sqrt{3} - 6$$

따라서 $a=-6,\ b=4$이므로 $a+b = -2$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.1점


**발문**

$\lim_{x\to\infty}(\sqrt{9x^2+6x+1}-ax)=b$를 만족시키는 상수 $a,\ b$의 합 $a+b$의 값은?

**보기** ① $0$  ② $1$  ③ $2$  ④ $3$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x\to\infty$일 때 극한값이 수렴하려면 최고차항이 상쇄되어야 하므로 $a=3$이다. (ax)
2. $$\lim_{x\to\infty}(\sqrt{9x^2+6x+1}-3x) = \lim_{x\to\infty}\frac{6x+1}{\sqrt{9x^2+6x+1}+3x} = \frac{6}{3+3} = 1$$

따라서 $b=1$이므로 $a+b = 3+1 = 4$이다.
3. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\lim_{x\to\infty}(\sqrt{9x^2+」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 무한대에서의 극한 > 다항·유리함수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q14(ax): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음) (원천과 같음)
- 이유: Q14(ax): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14(ax): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 2 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「상수 $a,\ b$의 합 $a+b$의 값은?」
- method: 정리(NAMED)←solution:「$x\to\infty$일 때 극한값이 수렴하려」
- condition: (없음)

**how** Q14(ax): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x\to\infty$일 때 극한값이 수렴하려면 최고차항이 상쇄되어야 하므로 $a=3$이다.

$$\lim_{x\to\infty}(\sqrt{9x^2+6x+1}-3x) = \lim_{x\to\infty}\frac{6x+1}{\sqrt{9x^2+6x+1}+3x} = \frac{6}{3+3} = 1$$

따라서 $b=1$이므로 $a+b = 3+1 = 4$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.2점


**발문**

실수 $t$에 대하여 직선 $y=t$와 함수 $y=\dfrac{4x+1}{x+2}$의 그래프의 교점의 개수를 $f(t)$라 하자. 함수 $f(x)$와 함수 $g(x)=-3x+a$에 대하여 함수 $f(x)g(x)$가 실수 전체의 집합에서 연속일 때, 상수 $a$의 값은?

**보기** ① $8$  ② $10$  ③ $12$  ④ $14$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y = \dfrac{4x+1}{x+2} = 4 - \dfrac{7}{x+2}$의 치역은 ${y\mid y\ne 4}$이므로 $f(t)=1$ ($t\ne 4$), $f(4)=0$이다. (10)
2. 따라서 $f(x)$는 $x=4$에서만 불연속이므로 $f(x)g(x)$가 실수 전체에서 연속이려면 $g(4) = -3(4)+a = 0 \implies a = 12$여야 한다.
3. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-02(함수의 연속) / H15-M2-02-CONTINUITY(함수의 연속) (원천과 같음) (원천과 같음)
- 근거 인용: 「실수 $t$에 대하여 직선 $y=t$와 함수 $y=\d」
**RPM** H2-M2-RPM-007 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 미정계수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: Q15(10): 함수의 연속 단원의 RPM H2-M2-RPM-007 유형에 해당한다.
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_FACTOR_CONDITION (원천과 같음)
- 이유: Q15(10): 함수의 연속 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15(10): 함수의 연속 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「의 집합에서 연속일 때, 상수 $a$의 값은?」
- method: 정리(NAMED)←solution:「$y = \dfrac{4x+1}{x+2} =」
- condition: (없음)

**how** Q15(10): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y = \dfrac{4x+1}{x+2} = 4 - \dfrac{7}{x+2}$의 치역은 ${y\mid y\ne 4}$이므로 $f(t)=1$ ($t\ne 4$), $f(4)=0$이다.

따라서 $f(x)$는 $x=4$에서만 불연속이므로 $f(x)g(x)$가 실수 전체에서 연속이려면 $g(4) = -3(4)+a = 0 \implies a = 12$여야 한다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

실수 $m$에 대하여 직선 $y=mx$와 함수 $f(x)=4x+3+|x-1|$의 그래프의 교점의 개수를 $g(m)$이라 하자. 최고차항의 계수가 $1$인 이차함수 $h(x)$에 대하여 함수 $g(x)h(x)$가 실수 전체의 집합에서 연속일 때, $h(9)$의 값은?

**보기** ① $24$  ② $15$  ③ $18$  ④ $21$  ⑤ $28$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x) = \begin{cases}3x+4 & (x<1)\ 5x+2 & (x\ge 1)\end{cases}$이다.
2. - $x<1$: $mx=3x+4 \implies x=\dfrac{4}{m-3}<1 \iff m<3$ 또는 $m>7$  
- $x\ge 1$: $mx=5x+2 \implies x=\dfrac{2}{m-5}\ge 1 \iff 5<m\le 7$

따라서 $g(m)=1$ ($m<3$), $0$ ($3\le m\le 5$), $1$ ($m>5$)이므로 $g$는 $m=3,\ 5$에서 불연속이다.
3. 그러므로 $h(x)=(x-3)(x-5)$이고 $h(9)=6\times 4 = 24$이다.
4. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-02(함수의 연속) / H15-M2-02-CONTINUITY(함수의 연속) (원천과 같음) (원천과 같음)
- 근거 인용: 「실수 $m$에 대하여 직선 $y=mx$와 함수 $f(x」
**RPM** H2-M2-RPM-007 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 미정계수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: Q16(mx): 함수의 연속 단원의 RPM H2-M2-RPM-007 유형에 해당한다.
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_FACTOR_CONDITION (원천과 같음)
- 이유: Q16(mx): 함수의 연속 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16(mx): 함수의 연속 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「의 집합에서 연속일 때, $h(9)$의 값은?」
- method: 정리(NAMED)←solution:「$f(x) = \begin{cases}3x+4」
- condition: (없음)

**how** Q16(mx): 발문과 해설의 풀이 과정을 점검하여 정답 ①를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x) = \begin{cases}3x+4 & (x<1)\ 5x+2 & (x\ge 1)\end{cases}$이다.

- $x<1$: $mx=3x+4 \implies x=\dfrac{4}{m-3}<1 \iff m<3$ 또는 $m>7$  
- $x\ge 1$: $mx=5x+2 \implies x=\dfrac{2}{m-5}\ge 1 \iff 5<m\le 7$

따라서 $g(m)=1$ ($m<3$), $0$ ($3\le m\le 5$), $1$ ($m>5$)이므로 $g$는 $m=3,\ 5$에서 불연속이다. 그러므로 $h(x)=(x-3)(x-5)$이고 $h(9)=6\times 4 = 24$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4.4점


**발문**

집합 ${x\mid 0<x<2}$에서 정의된 함수 $f(x)=\begin{cases}\dfrac{2}{x}-2&(0<x\le 1)\\dfrac{2}{x-1}-2&(1<x<2)\end{cases}$일 때, 함수 $y=f(x)g(x)$가 $x=1$에서 연속이 되도록 하는 최고차항의 계수가 $3$인 이차함수 $g(x)$에 대하여 $g(3)$의 값은?

**보기** ① $3$  ② $6$  ③ $9$  ④ $12$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x\to 1-$일 때 $f(x)\to 0$이고 $f(1)=0$이므로 좌극한과 함숫값은 모두 $0$이다. (cases)
2. $x\to 1+$일 때 $f(x) = \dfrac{2(2-x)}{x-1}$이므로 $\lim_{x\to 1+}f(x)g(x) = 0$이 되려면 $g(x)$가 $(x-1)^2$을 인수로 가져야 한다.
3. 최고차항의 계수가 $3$이므로 $g(x) = 3(x-1)^2$이고, $g(3) = 3(3-1)^2 = 12$이다.
4. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-02(함수의 연속) / H15-M2-02-CONTINUITY(함수의 연속) (원천과 같음) (원천과 같음)
- 근거 인용: 「집합 ${x\mid 0<x<2}$에서 정의된 함수 $f」
**RPM** H2-M2-RPM-007 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 구간별 함수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: Q17(cases): 함수의 연속 단원의 RPM H2-M2-RPM-007 유형에 해당한다.
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH (원천과 같음) (원천과 같음)
- 이유: Q17(cases): 함수의 연속 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17(cases): 함수의 연속 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「수 $g(x)$에 대하여 $g(3)$의 값은?」
- method: 정리(NAMED)←solution:「$x\to 1-$일 때 $f(x)\to 0$이」
- condition: (없음)

**how** Q17(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ④를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x\to 1-$일 때 $f(x)\to 0$이고 $f(1)=0$이므로 좌극한과 함숫값은 모두 $0$이다.

$x\to 1+$일 때 $f(x) = \dfrac{2(2-x)}{x-1}$이므로 $\lim_{x\to 1+}f(x)g(x) = 0$이 되려면 $g(x)$가 $(x-1)^2$을 인수로 가져야 한다.

최고차항의 계수가 $3$이므로 $g(x) = 3(x-1)^2$이고, $g(3) = 3(3-1)^2 = 12$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.6점


**발문**

최고차항의 계수가 $3$인 삼차함수 $f(x)$와 함수 $g(x)=\begin{cases}\dfrac{1}{x-2}&(x\ne 2)\5&(x=2)\end{cases}$에 대하여 $h(x)=f(x)g(x)$라 할 때, 함수 $h(x)$는 실수 전체의 집합에서 미분가능하고 $h'(2)=9$이다. $f(3)$의 값은?

**보기** ① $9$  ② $12$  ③ $15$  ④ $18$  ⑤ $21$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $h(x)$가 $x=2$에서 연속이려면 $\lim_{x\to 2}\dfrac{f(x)}{x-2}$가 존재해야 하므로 $f(2)=0$이고, $h(2)=5f(2)=0$이므로 $f'(2)=0$이다. (cases)
2. 따라서 $f(x) = 3(x-2)^2(x-r)$로 놓을 수 있으며, 모든 실수 $x$에서 $h(x) = 3(x-2)(x-r)$이다.
3. $h'(x) = 3(x-r) + 3(x-2)$이므로 $h'(2) = 3(2-r) = 9 \implies r = -1$이다.
4. 따라서 $f(3) = 3(3-2)^2(3+1) = 12$이다.
5. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「최고차항의 계수가 $3$인 삼차함수 $f(x)$와 함수」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 미분가능성과 연속 > 미분가능 조건 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q18(cases): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DIFFERENTIABILITY_CONDITION / TPL=TPL_DIFFERENTIABILITY_POINT_CONDITION (원천과 같음) (원천과 같음)
- 이유: Q18(cases): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18(cases): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$h'(2)=9$이다. $f(3)$의 값은?」
- method: 정리(NAMED)←solution:「$h(x)$가 $x=2$에서 연속이려면 $\l」
- condition: (없음)

**how** Q18(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ②를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$h(x)$가 $x=2$에서 연속이려면 $\lim_{x\to 2}\dfrac{f(x)}{x-2}$가 존재해야 하므로 $f(2)=0$이고, $h(2)=5f(2)=0$이므로 $f'(2)=0$이다.

따라서 $f(x) = 3(x-2)^2(x-r)$로 놓을 수 있으며, 모든 실수 $x$에서 $h(x) = 3(x-2)(x-r)$이다.

$h'(x) = 3(x-r) + 3(x-2)$이므로 $h'(2) = 3(2-r) = 9 \implies r = -1$이다.

따라서 $f(3) = 3(3-2)^2(3+1) = 12$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4.7점


**발문**

최고차항의 계수가 $1$인 삼차함수 $f(x)$가 모든 실수 $x$에 대하여 $f'(2+x)=f'(2-x)$를 만족시키고, $f(-1)=f'(-1)=0$일 때, $f(1)$의 값은?

**보기** ① $-20$  ② $-22$  ③ $-24$  ④ $-26$  ⑤ $-28$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x) = x^3 + px^2 + qx + r$이라 하면 $f'(x) = 3x^2 + 2px + q$이다. (20)
2. $f'(2+x)=f'(2-x)$에서 이차함수 $f'(x)$의 대칭축이 $x=2$이므로 $-\dfrac{2p}{6} = 2 \implies p = -6$이다.
3. $f'(-1) = 3(1) + 12 + q = 0 \implies q = -15$이고, $f(-1) = -1 - 6 + 15 + r = 0 \implies r = -8$이다.
4. 따라서 $f(x) = x^3 - 6x^2 - 15x - 8$이므로 $f(1) = 1 - 6 - 15 - 8 = -28$이다.
5. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「최고차항의 계수가 $1$인 삼차함수 $f(x)$가 모든」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q19(20): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_FUNCTION_DETERMINATION / TPL=TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE (원천과 같음) (원천과 같음)
- 이유: Q19(20): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19(20): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「f'(-1)=0$일 때, $f(1)$의 값은?」
- method: 정리(NAMED)←solution:「$f(x) = x^3 + px^2 + qx +」
- condition: (없음)

**how** Q19(20): 발문과 해설의 풀이 과정을 점검하여 정답 ⑤를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x) = x^3 + px^2 + qx + r$이라 하면 $f'(x) = 3x^2 + 2px + q$이다.

$f'(2+x)=f'(2-x)$에서 이차함수 $f'(x)$의 대칭축이 $x=2$이므로 $-\dfrac{2p}{6} = 2 \implies p = -6$이다.

$f'(-1) = 3(1) + 12 + q = 0 \implies q = -15$이고, $f(-1) = -1 - 6 + 15 + r = 0 \implies r = -8$이다.

따라서 $f(x) = x^3 - 6x^2 - 15x - 8$이므로 $f(1) = 1 - 6 - 15 - 8 = -28$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4.7점


**발문**

실수 $a$에 대하여 함수 $f(x)=\begin{cases}(x-1)(x-a)&(x<1)\0&(1\le x<2)\2&(x\ge 2)\end{cases}$라 하자. 양의 실수 $t$에 대하여 함수 $f(x)$에서 $x$의 값이 $0$에서 $t$까지 변할 때의 평균변화율을 $g(t)$라 하자. $g(k)=g(k+1)=g(k+2)$를 만족시키는 $0<k<2$인 실수 $k$가 존재할 때, $f(-1)$의 값은?

**보기** ① $-\dfrac{8}{3}$  ② $-3$  ③ $-\dfrac{10}{3}$  ④ $-\dfrac{11}{3}$  ⑤ $-4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(0)=a$이므로 평균변화율 $g(t)$는 $0<t<1$일 때 $t-a-1$, $1\le t<2$일 때 $-\dfrac{a}{t}$, $t\ge 2$일 때 $\dfrac{2-a}{t}$이다. (cases)
2. 1.
3. $0<k<1$일 때: $g(k+1)=g(k+2)$에서 $-\dfrac{a}{k+1} = \dfrac{2-a}{k+2} \implies a = -2k-2$이다.
4. 이때 $g(k+1) = \dfrac{2k+2}{k+1} = 2$이므로 $g(k) = k - (-2k-2) - 1 = 3k+1 = 2 \implies k=\dfrac{1}{3}$이고 $a = -\dfrac{8}{3}$이다.
5. 2.
6. $1\le k<2$일 때: $g(k+1)=g(k+2)$에서 $a=2$이나 $g(k)=-\dfrac{2}{k}\ne 0=g(k+1)$이므로 모순이다.
7. 따라서 $f(-1) = (-1-1)\left(-1+\dfrac{8}{3}\right) = -\dfrac{10}{3}$이다.
8. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-03(미분계수) / H15-M2-03-DERIVATIVE_DEFINITION(미분계수) (원천과 같음) (원천과 같음)
- 근거 인용: 「실수 $a$에 대하여 함수 $f(x)=\begin{ca」
**RPM** H2-M2-RPM-013 [미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율] (원천과 같음)
- 이유: Q20(cases): 미분계수 단원의 RPM H2-M2-RPM-013 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_RATE_RELATION / TPL=TPL_AVERAGE_RATE_ANALYSIS (원천과 같음) (원천과 같음)
- 이유: Q20(cases): 미분계수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20(cases): 미분계수 단원의 기본 개념과 계산을 적용하는 난이도 4 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「$k$가 존재할 때, $f(-1)$의 값은?」
- method: 정리(NAMED)←solution:「$f(0)=a$이므로 평균변화율 $g(t)$는」
- condition: (없음)

**how** Q20(cases): 발문과 해설의 풀이 과정을 점검하여 정답 ③를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f(0)=a$이므로 평균변화율 $g(t)$는 $0<t<1$일 때 $t-a-1$, $1\le t<2$일 때 $-\dfrac{a}{t}$, $t\ge 2$일 때 $\dfrac{2-a}{t}$이다.

1. $0<k<1$일 때: $g(k+1)=g(k+2)$에서 $-\dfrac{a}{k+1} = \dfrac{2-a}{k+2} \implies a = -2k-2$이다. 이때 $g(k+1) = \dfrac{2k+2}{k+1} = 2$이므로 $g(k) = k - (-2k-2) - 1 = 3k+1 = 2 \implies k=\dfrac{1}{3}$이고 $a = -\dfrac{8}{3}$이다.  
2. $1\le k<2$일 때: $g(k+1)=g(k+2)$에서 $a=2$이나 $g(k)=-\dfrac{2}{k}\ne 0=g(k+1)$이므로 모순이다.

따라서 $f(-1) = (-1-1)\left(-1+\dfrac{8}{3}\right) = -\dfrac{10}{3}$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점


**발문**

[주관식1 (서술형)] 다항함수 $f(x)$가 $\lim_{x\to\infty}\dfrac{f(x)-x^3}{x^2+3x}=-3$, $\lim_{x\to 2}\dfrac{f(x)}{x^2+x-6}=2$를 만족시킬 때, $f(x)$를 풀이과정과 함께 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $f(x)=x^3-3x^2+10x-16$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째 극한에서 $f(x) = x^3 - 3x^2 + bx + c$로 둘 수 있다.
2. 둘째 극한의 분모는 $x^2+x-6 = (x-2)(x+3)$이므로 극한이 유한하려면 $f(2)=0$이어야 하고, 그때 $\dfrac{f'(2)}{2+3} = 2 \implies f'(2) = 10$이다.
3. $f'(x) = 3x^2 - 6x + b$이므로 $f'(2) = 12 - 12 + b = 10 \implies b = 10$이고, $f(2) = 8 - 12 + 20 + c = 0 \implies c = -16$이다.
4. 따라서 $f(x) = x^3 - 3x^2 + 10x - 16$이다.
- 작성자 답: $f(x)=x^3-3x^2+10x-16$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-01(함수의 극한) / H15-M2-01-LIMIT(함수의 극한) (원천과 같음) (원천과 같음)
- 근거 인용: 「[주관식1 (서술형)] 다항함수 $f(x)$가 $\li」
**RPM** H2-M2-RPM-001 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 미정계수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: Q21(bx): 함수의 극한 단원의 RPM H2-M2-RPM-001 유형에 해당한다.
**유형** PT=PT_LIMIT_PARAMETER_DETERMINATION / TPL=TPL_LIMIT_FINITE_CONDITION_PARAMETER (원천과 같음) (원천과 같음)
- 이유: Q21(bx): 함수의 극한 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21(bx): 함수의 극한 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「때, $f(x)$를 풀이과정과 함께 구하시오.」
- method: 정리(NAMED)←solution:「첫째 극한에서 $f(x) = x^3 - 3x^」
- condition: (없음)

**how** Q21(bx): 발문과 해설의 풀이 과정을 점검하여 정답 $f(x)=x^3-3x^2+10x-16$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째 극한에서 $f(x) = x^3 - 3x^2 + bx + c$로 둘 수 있다.

둘째 극한의 분모는 $x^2+x-6 = (x-2)(x+3)$이므로 극한이 유한하려면 $f(2)=0$이어야 하고, 그때 $\dfrac{f'(2)}{2+3} = 2 \implies f'(2) = 10$이다.

$f'(x) = 3x^2 - 6x + b$이므로 $f'(2) = 12 - 12 + b = 10 \implies b = 10$이고, $f(2) = 8 - 12 + 20 + c = 0 \implies c = -16$이다.

따라서 $f(x) = x^3 - 3x^2 + 10x - 16$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점


**발문**

[주관식2 (서술형)] 다항함수 $f(x)$에 대하여 $\lim_{x\to\infty}\dfrac{f(x)-x^4}{x^3}=3$, $\lim_{x\to 1}\dfrac{f(x)-4}{x-1}=-2$, $f'(-1)=18$일 때, $f'(0)+f(-1)$의 값을 풀이과정과 함께 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** -1   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 첫째 극한에서 $f(x) = x^4 + 3x^3 + ax^2 + bx + c$로 놓을 수 있고, 둘째 극한에서 $f(1)=4$, $f'(1)=-2$이다.
2. $f'(x) = 4x^3 + 9x^2 + 2ax + b$이므로 $$f'(1) = 13 + 2a + b = -2 \implies 2a+b = -15$$ $$f'(-1) = 5 - 2a + b = 18 \implies -2a+b = 13$$

두 식을 더하면 $2b = -2 \implies b = -1$, $a = -7$이다.
3. 또한 $f(1) = 1+3-7-1+c = 4$에서 $c = 8$이다.
4. 따라서 $f'(0) = b = -1$, $f(-1) = 1-3-7+1+8 = 0$이므로 $f'(0)+f(-1) = -1$이다.
- 작성자 답: -1 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-04(도함수) / H15-M2-04-DERIVATIVE(도함수) (원천과 같음) (원천과 같음)
- 근거 인용: 「[주관식2 (서술형)] 다항함수 $f(x)$에 대하여 」
**RPM** H2-M2-RPM-015 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: Q22(18): 도함수 단원의 RPM H2-M2-RPM-015 유형에 해당한다.
**유형** PT=PT_DERIVATIVE_FUNCTION_DETERMINATION / TPL=TPL_LOCAL_DERIVATIVE_CONSTRAINT_FUNCTION_DETERMINE (원천과 같음) (원천과 같음)
- 이유: Q22(18): 도함수 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22(18): 도함수 단원의 기본 개념과 계산을 적용하는 난이도 3 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「f(-1)$의 값을 풀이과정과 함께 구하시오.」
- method: 정리(NAMED)←solution:「첫째 극한에서 $f(x) = x^4 + 3x^」
- condition: (없음)

**how** Q22(18): 발문과 해설의 풀이 과정을 점검하여 정답 -1를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫째 극한에서 $f(x) = x^4 + 3x^3 + ax^2 + bx + c$로 놓을 수 있고, 둘째 극한에서 $f(1)=4$, $f'(1)=-2$이다.

$f'(x) = 4x^3 + 9x^2 + 2ax + b$이므로 $$f'(1) = 13 + 2a + b = -2 \implies 2a+b = -15$$ $$f'(-1) = 5 - 2a + b = 18 \implies -2a+b = 13$$

두 식을 더하면 $2b = -2 \implies b = -1$, $a = -7$이다. 또한 $f(1) = 1+3-7-1+c = 4$에서 $c = 8$이다.

따라서 $f'(0) = b = -1$, $f(-1) = 1-3-7+1+8 = 0$이므로 $f'(0)+f(-1) = -1$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

[주관식3 (서술형)] 함수 $f(x)=\begin{cases}ax+b&(x<1)\cx^2+kx&(x\ge 1)\end{cases}$이 실수 전체의 집합에서 연속이고 역함수를 갖는다. 방정식 $f(x)=f^{-1}(x)$의 해가 $3$개이고, 그 해가 $-1,\ 1,\ 2$일 때, $a+b+c+k$의 값을 풀이과정과 함께 구하시오. (단, $a,\ b,\ c,\ k$는 상수)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f$는 실수 전체에서 연속이고 역함수를 가지므로 순증가 또는 순감소 함수이다. (cases)
2. 1.
3. 만약 $f$가 증가함수라면 $f(x)=f^{-1}(x)$의 모든 해는 $f(x)=x$의 해여야 하므로 $f(1)=1,\ f(2)=2$가 되어야 하나, $-1,\ 1,\ 2$에서 $f(-1)=-1,\ f(1)=1$이면 $x<1$인 직선 $ax+b=x$가 되어 $x<1$ 전체가 해가 되므로 해가 $3$개라는 조건에 모순이다.
4. 2.
5. 따라서 $f$는 감소함수이고, 세 해 $-1<1<2$에 대하여 $f(-1)=2,\ f(1)=1,\ f(2)=-1$이 성립한다.
6. $x\ge 1$에서 $f(1) = c+k = 1$, $f(2) = 4c+2k = -1$을 연립하면 $2c = -3 \implies c = -\dfrac{3}{2},\ k = \dfrac{5}{2}$이다.
7. $x<1$에서 $f(-1) = -a+b = 2$이고, $x=1$ 연속 조건에서 $a+b = f(1) = 1$이므로 $b = \dfrac{3}{2},\ a = -\dfrac{1}{2}$이다.
8. 따라서 $a+b+c+k = -\dfrac{1}{2} + \dfrac{3}{2} - \dfrac{3}{2} + \dfrac{5}{2} = 2$이다.
- 작성자 답: $2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H15-M2-02(함수의 연속) / H15-M2-02-CONTINUITY(함수의 연속) (원천과 같음) (원천과 같음)
- 근거 인용: 「[주관식3 (서술형)] 함수 $f(x)=\begin{c」
**RPM** H2-M2-RPM-007 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 구간별 함수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: Q23(cases): 함수의 연속 단원의 RPM H2-M2-RPM-007 유형에 해당한다.
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH (원천과 같음) (원천과 같음)
- 이유: Q23(cases): 함수의 연속 단원의 핵심 개념을 확인하는 유형이다.
**난이도** 5 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23(cases): 함수의 연속 단원의 기본 개념과 계산을 적용하는 난이도 5 문항이다.

**4칸**
- given: (없음)
- goal: 값←stem:「(단, $a,\ b,\ c,\ k$는 상수)」
- method: 정리(NAMED)←solution:「$f$는 실수 전체에서 연속이고 역함수를 가지」
- condition: (없음)

**how** Q23(cases): 발문과 해설의 풀이 과정을 점검하여 정답 $2$를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$f$는 실수 전체에서 연속이고 역함수를 가지므로 순증가 또는 순감소 함수이다.

1. 만약 $f$가 증가함수라면 $f(x)=f^{-1}(x)$의 모든 해는 $f(x)=x$의 해여야 하므로 $f(1)=1,\ f(2)=2$가 되어야 하나, $-1,\ 1,\ 2$에서 $f(-1)=-1,\ f(1)=1$이면 $x<1$인 직선 $ax+b=x$가 되어 $x<1$ 전체가 해가 되므로 해가 $3$개라는 조건에 모순이다.  
2. 따라서 $f$는 감소함수이고, 세 해 $-1<1<2$에 대하여 $f(-1)=2,\ f(1)=1,\ f(2)=-1$이 성립한다.

$x\ge 1$에서 $f(1) = c+k = 1$, $f(2) = 4c+2k = -1$을 연립하면 $2c = -3 \implies c = -\dfrac{3}{2},\ k = \dfrac{5}{2}$이다.

$x<1$에서 $f(-1) = -a+b = 2$이고, $x=1$ 연속 조건에서 $a+b = f(1) = 1$이므로 $b = \dfrac{3}{2},\ a = -\dfrac{1}{2}$이다.

따라서 $a+b+c+k = -\dfrac{1}{2} + \dfrac{3}{2} - \dfrac{3}{2} + \dfrac{5}{2} = 2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
