# 검수 묶음 — 26_효천고_2학기_중간_고2_미적분I_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 4)**
- 문항 23개 / 검사 PASS 19, FAIL 4, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 5, 2단계 4, 3단계 9, 4단계 3, 5단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q6**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 검사 코드: CHOICE_ORDER
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 검사 코드: CHOICE_ORDER
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3.3점


**발문**

함수 $f(x)=4x^2-3$의 $x=1$에서의 미분계수는?

**보기** ① $4$  ② $6$  ③ $8$  ④ $10$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f'(x)=8x$이므로 $f'(1)=8\cdot 1=8$이다. (10)
2. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-04(도함수) / H22-M1-04-DERIVATIVE_CALCULATION(도함수 계산) (원천과 같음)
- 근거 인용: 「함수 $f(x)=4x^2-3$의 $x=1$에서의 미분계」
**RPM** H2-M2-RPM-063 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: 문항1번(토큰:10) 대상 문항1의 도함수 단원 RPM H2-M2-RPM-063 분류 유형에 해당한다
**유형** PT=PT_DERIVATIVE_RULE_EVALUATION / TPL=TPL_DERIVATIVE_RULE_CALCULATION (원천과 같음) (원천과 같음)
- 이유: 문항1번(토큰:10) 대상 문항1의 도함수 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항1번(토큰:10) 대상 문항1의 도함수 단원 기본 개념과 풀이 과정을 적용하는 난이도 1 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「=4x^2-3$의 $x=1$에서의 미분계수는?」
- method: 정리(NAMED)←solution:「$f'(x)=8x$이므로 $f'(1)=8\cd」
- condition: (없음)

**how** 문항1번(토큰:10) 발문과 해설의 문항1 풀이 단계를 점검하여 최종 정답 ③를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f'(x)=8x$이므로 $f'(1)=8\cdot 1=8$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3.4점


**발문**

함수 $f(x)=\begin{cases}x+a&(x<-2)\2x-3&(x\ge -2)\end{cases}$에 대하여 $\lim_{x\to -2^+}f(x)=\lim_{x\to -2^-}f(x)$를 만족시킬 때, 상수 $a$의 값은?

**보기** ① $-5$  ② $-4$  ③ $-3$  ④ $-2$  ⑤ $-1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\lim_{x\to -2^+}f(x)=2(-2)-3=-7$이고 $\lim_{x\to -2^-}f(x)=-2+a$이므로 $-2+a=-7 \implies a=-5$이다. (cases)
2. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「함수 $f(x)=\begin{cases}x+a&(x<-」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] (원천과 같음)
- 이유: 문항2번(토큰:cases) 대상 문항2의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_DIRECTIONAL_APPROACH (원천과 같음) (원천과 같음)
- 이유: 문항2번(토큰:cases) 대상 문항2의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항2번(토큰:cases) 대상 문항2의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 1 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「(x)$를 만족시킬 때, 상수 $a$의 값은?」
- method: 정리(NAMED)←solution:「$\lim_{x\to -2^+}f(x)=2(-」
- condition: (없음)

**how** 문항2번(토큰:cases) 발문과 해설의 문항2 풀이 단계를 점검하여 최종 정답 ①를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$\lim_{x\to -2^+}f(x)=2(-2)-3=-7$이고 $\lim_{x\to -2^-}f(x)=-2+a$이므로 $-2+a=-7 \implies a=-5$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3.5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

극한 $\lim_{x\to 2}\dfrac{\sqrt{x+1}-\sqrt{3}}{x-2}$의 값은?

**보기** ① $\dfrac{\sqrt{3}}{2}$  ② $\dfrac{\sqrt{3}}{3}$  ③ $\dfrac{\sqrt{3}}{4}$  ④ $\dfrac{\sqrt{3}}{6}$  ⑤ $\dfrac{1}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항 3번 문제의 조건(x)에 맞추어 식을 세운다.
2. 분자를 유리화하여 약분하면 $$\lim_{x\to 2}\frac{x-2}{(x-2)(\sqrt{x+1}+\sqrt{3})}=\lim_{x\to 2}\frac{1}{\sqrt{x+1}+\sqrt{3}}=\frac{1}{2\sqrt{3}}=\frac{\sqrt{3}}{6}$$ 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「극한 $\lim_{x\to 2}\dfrac{\sqrt{」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 극한값 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: 문항3번(토큰:x) 대상 문항3의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음)
- 이유: 문항3번(토큰:x) 대상 문항3의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항3번(토큰:x) 대상 문항3의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 1 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「x+1}-\sqrt{3}}{x-2}$의 값은?」
- method: 정리(NAMED)←solution:「분자를 유리화하여 약분하면 $$\lim_{x\」
- condition: (없음)

**how** 문항3번(토큰:x) 발문과 해설의 문항3 풀이 단계를 점검하여 최종 정답 ④를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

분자를 유리화하여 약분하면 $$\lim_{x\to 2}\frac{x-2}{(x-2)(\sqrt{x+1}+\sqrt{3})}=\lim_{x\to 2}\frac{1}{\sqrt{x+1}+\sqrt{3}}=\frac{1}{2\sqrt{3}}=\frac{\sqrt{3}}{6}$$ 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3.6점


**발문**

함수 $f(x)=\begin{cases}x^2+4x+a&(x\ne a)\-2x-6&(x=a)\end{cases}$이 실수 전체의 집합에서 연속일 때, 모든 실수 $a$의 값의 곱은?

**보기** ① $3$  ② $6$  ③ $9$  ④ $12$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x=a$에서의 연속 조건 $\lim_{x\to a}f(x)=f(a)$에서 $a^2+5a=-2a-6$이다. (cases)
2. $$a^2+7a+6=(a+1)(a+6)=0 \implies a=-1,\ -6$$ 따라서 모든 실수 $a$의 값의 곱은 $(-1)(-6)=6$이다.
3. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-02(함수의 연속) / H22-M1-02-CONTINUITY_POINT(한 점에서의 연속) (원천과 같음)
- 근거 인용: 「함수 $f(x)=\begin{cases}x^2+4x+a」
**RPM** H2-M2-RPM-055 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 미정계수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: 문항4번(토큰:cases) 대상 문항4의 함수의 연속 단원 RPM H2-M2-RPM-055 분류 유형에 해당한다
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_FACTOR_CONDITION (원천과 같음)
- 이유: 문항4번(토큰:cases) 대상 문항4의 함수의 연속 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항4번(토큰:cases) 대상 문항4의 함수의 연속 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「연속일 때, 모든 실수 $a$의 값의 곱은?」
- method: 정리(NAMED)←solution:「$x=a$에서의 연속 조건 $\lim_{x\t」
- condition: (없음)

**how** 문항4번(토큰:cases) 발문과 해설의 문항4 풀이 단계를 점검하여 최종 정답 ②를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$x=a$에서의 연속 조건 $\lim_{x\to a}f(x)=f(a)$에서 $a^2+5a=-2a-6$이다. $$a^2+7a+6=(a+1)(a+6)=0 \implies a=-1,\ -6$$ 따라서 모든 실수 $a$의 값의 곱은 $(-1)(-6)=6$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3.7점


**발문**

함수 $f(x)=x^3-ax^2+bx-4$의 그래프 위의 점 $(2,\ 0)$에서의 접선의 기울기가 $4$일 때, 두 상수 $a,\ b$에 대하여 $a+b$의 값은?

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(2)=8-4a+2b-4=0 \implies 2a-b=2$, $f'(2)=12-4a+b=4 \implies 4a-b=8$이다. (ax)
2. 두 식을 연립하면 $a=3,\ b=4$이므로 $a+b=7$이다.
3. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-05(도함수의 활용) / H22-M1-05-ROLLE_MEAN_VALUE(롤의 정리와 평균값 정리) (원천과 같음)
- 근거 인용: 「함수 $f(x)=x^3-ax^2+bx-4$의 그래프 위」
**RPM** H2-M2-RPM-067 [미분 > 도함수의 활용 > 접선 > 접선의 방정식] (원천과 같음)
- 이유: 문항5번(토큰:ax) 대상 문항5의 도함수의 활용 단원 RPM H2-M2-RPM-067 분류 유형에 해당한다
**유형** PT=PT_TANGENT_DERIVATIVE / TPL=TPL_TANGENT_CONSTRUCTION (원천과 같음) (원천과 같음)
- 이유: 문항5번(토큰:ax) 대상 문항5의 도함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항5번(토큰:ax) 대상 문항5의 도함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「수 $a,\ b$에 대하여 $a+b$의 값은?」
- method: 정리(NAMED)←solution:「$f(2)=8-4a+2b-4=0 \implie」
- condition: (없음)

**how** 문항5번(토큰:ax) 발문과 해설의 문항5 풀이 단계를 점검하여 최종 정답 ⑤를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f(2)=8-4a+2b-4=0 \implies 2a-b=2$, $f'(2)=12-4a+b=4 \implies 4a-b=8$이다. 두 식을 연립하면 $a=3,\ b=4$이므로 $a+b=7$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3.7점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

양수 $k$와 함수 $f(x)=2x^3+6x^2+4x$에 대하여 닫힌구간 $[-k,\ 0]$에서 롤의 정리를 만족시키는 실수 $c$가 존재하도록 하는 모든 양수 $k$의 값의 합은?

**보기** ① $3$  ② $1$  ③ $2$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(-k)=f(0)=0$이어야 하므로 $-2k^3+6k^2-4k=-2k(k-1)(k-2)=0$이다.
2. $k>0$이므로 $k=1,\ 2$이고 합은 $1+2=3$이다.
3. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-05(도함수의 활용) / H22-M1-05-ROLLE_MEAN_VALUE(롤의 정리와 평균값 정리) (원천과 같음)
- 근거 인용: 「양수 $k$와 함수 $f(x)=2x^3+6x^2+4x$」
**RPM** H2-M2-RPM-067 [미분 > 도함수의 활용 > 접선 > 접선의 방정식] **원천→판정: 미분 > 도함수의 활용 > 롤의 정리와 평균값 정리 > 롤의 정리 → 미분 > 도함수의 활용 > 접선 > 접선의 방정식**
- 이유: 문항6번(토큰:k) 대상 문항6의 도함수의 활용 단원 RPM H2-M2-RPM-067 분류 유형에 해당한다
**유형** PT=PT_TANGENT_DERIVATIVE / TPL=TPL_TANGENCY_RELATION_GEOMETRY **원천→판정: PT_MEAN_VALUE_THEOREM → PT_TANGENT_DERIVATIVE** **원천→판정: TPL_MVT_ROLLE_DIRECT → TPL_TANGENCY_RELATION_GEOMETRY**
- 이유: 문항6번(토큰:k) 대상 문항6의 도함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항6번(토큰:k) 대상 문항6의 도함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「재하도록 하는 모든 양수 $k$의 값의 합은?」
- method: 정리(NAMED)←solution:「$f(-k)=f(0)=0$이어야 하므로 $-2」
- condition: (없음)

**how** 문항6번(토큰:k) 발문과 해설의 문항6 풀이 단계를 점검하여 최종 정답 ①를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f(-k)=f(0)=0$이어야 하므로 $-2k^3+6k^2-4k=-2k(k-1)(k-2)=0$이다. $k>0$이므로 $k=1,\ 2$이고 합은 $1+2=3$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3.8점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

실수 $t$에 대하여 유리함수 $y=\dfrac{5}{2x-1}+3$과 직선 $y=t$가 만나는 점의 개수를 $f(t)$라 하자. 함수 $g(x)=3x+a$에 대하여 함수 $f(x)g(x)$가 실수 전체의 집합에서 연속일 때, 상수 $a$의 값은?

**보기** ① $-3$  ② $-6$  ③ $-9$  ④ $6$  ⑤ $9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(t)=0$ ($t=3$), $1$ ($t\ne 3$)이므로 $x=3$에서 $f(x)g(x)$가 연속이 되려면 $g(3)=9+a=0$, 즉 $a=-9$여야 한다.
2. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-02(함수의 연속) / H22-M1-02-CONTINUITY_POINT(한 점에서의 연속) (원천과 같음)
- 근거 인용: 「실수 $t$에 대하여 유리함수 $y=\dfrac{5}{」
**RPM** H2-M2-RPM-055 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 구간별 함수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: 문항7번(토큰:t) 대상 문항7의 함수의 연속 단원 RPM H2-M2-RPM-055 분류 유형에 해당한다
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH (원천과 같음) (원천과 같음)
- 이유: 문항7번(토큰:t) 대상 문항7의 함수의 연속 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항7번(토큰:t) 대상 문항7의 함수의 연속 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「의 집합에서 연속일 때, 상수 $a$의 값은?」
- method: 정리(NAMED)←solution:「$f(t)=0$ ($t=3$), $1$ ($t」
- condition: (없음)

**how** 문항7번(토큰:t) 발문과 해설의 문항7 풀이 단계를 점검하여 최종 정답 ③를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f(t)=0$ ($t=3$), $1$ ($t\ne 3$)이므로 $x=3$에서 $f(x)g(x)$가 연속이 되려면 $g(3)=9+a=0$, 즉 $a=-9$여야 한다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3.9점


**발문**

함수 $f(x)=mx+2$에 대하여 $\lim_{h\to 0}\dfrac{f(a+3h)+f(a)-6}{h}=15$일 때, $f(2a)$의 값은? (단, $m,\ a$는 상수이다.)

**보기** ① $2$  ② $4$  ③ $6$  ④ $8$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 분자는 $2ma-2+3mh$이므로 극한이 유한하려면 $2ma-2=0 \implies ma=1$이고, 극한값 $3m=15 \implies m=5,\ a=\dfrac{1}{5}$이다. (mx)
2. 따라서 $f(2a)=5(2a)+2=2+2=4$이다.
3. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「함수 $f(x)=mx+2$에 대하여 $\lim_{h\t」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 미정계수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: 문항8번(토큰:mx) 대상 문항8의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_PARAMETER_DETERMINATION / TPL=TPL_LIMIT_FINITE_CONDITION_PARAMETER (원천과 같음) (원천과 같음)
- 이유: 문항8번(토큰:mx) 대상 문항8의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항8번(토큰:mx) 대상 문항8의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 2 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「의 값은? (단, $m,\ a$는 상수이다.)」
- method: 정리(NAMED)←solution:「분자는 $2ma-2+3mh$이므로 극한이 유한」
- condition: (없음)

**how** 문항8번(토큰:mx) 발문과 해설의 문항8 풀이 단계를 점검하여 최종 정답 ②를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

분자는 $2ma-2+3mh$이므로 극한이 유한하려면 $2ma-2=0 \implies ma=1$이고, 극한값 $3m=15 \implies m=5,\ a=\dfrac{1}{5}$이다. 따라서 $f(2a)=5(2a)+2=2+2=4$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

닫힌구간 $[-1,\ 4]$에서 정의된 함수 $f(x)=\lim_{t\to\infty}\dfrac{2-tx}{1+t}(x-4)$의 최댓값과 최솟값의 곱은?

**보기** ① $20$  ② $16$  ③ $-12$  ④ $-16$  ⑤ $-20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(x)=-x(x-4)=-(x-2)^2+4$이므로 $[-1,\ 4]$에서 최댓값은 $f(2)=4$, 최솟값은 $f(-1)=-5$이다. (tx)
2. 따라서 곱은 $4\times(-5)=-20$이다.
3. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-05(도함수의 활용) / H22-M1-05-ROLLE_MEAN_VALUE(롤의 정리와 평균값 정리) (원천과 같음)
- 근거 인용: 「닫힌구간 $[-1,\ 4]$에서 정의된 함수 $f(x)」
**RPM** H2-M2-RPM-067 [미분 > 도함수의 활용 > 접선 > 접선의 방정식] **원천→판정: 미분 > 도함수의 활용 > 최대·최소 > 구간 최대·최소 → 미분 > 도함수의 활용 > 접선 > 접선의 방정식**
- 이유: 문항9번(토큰:tx) 대상 문항9의 도함수의 활용 단원 RPM H2-M2-RPM-067 분류 유형에 해당한다
**유형** PT=PT_TANGENT_DERIVATIVE / TPL=TPL_TANGENCY_RELATION_GEOMETRY **원천→판정: PT_DERIVATIVE_MAX_MIN → PT_TANGENT_DERIVATIVE** **원천→판정: TPL_FUNCTION_DOMAIN_OPTIMIZATION → TPL_TANGENCY_RELATION_GEOMETRY**
- 이유: 문항9번(토큰:tx) 대상 문항9의 도함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항9번(토큰:tx) 대상 문항9의 도함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「1+t}(x-4)$의 최댓값과 최솟값의 곱은?」
- method: 정리(NAMED)←solution:「$f(x)=-x(x-4)=-(x-2)^2+4$」
- condition: (없음)

**how** 문항9번(토큰:tx) 발문과 해설의 문항9 풀이 단계를 점검하여 최종 정답 ⑤를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$f(x)=-x(x-4)=-(x-2)^2+4$이므로 $[-1,\ 4]$에서 최댓값은 $f(2)=4$, 최솟값은 $f(-1)=-5$이다. 따라서 곱은 $4\times(-5)=-20$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4.1점


**발문**

다항함수 $f(x)$가 다음 조건을 만족시킬 때, $f(1)$의 값은? (단, $k$는 상수이다.) (가) $\lim_{x\to\infty}\dfrac{f(x)+2x^2-x}{x^2-f(x)}=-4$ (나) $\lim_{x\to -2}\dfrac{f(x)}{(x+2)^2}=k$

**보기** ① $9$  ② $12$  ③ $16$  ④ $18$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (가)에서 $f(x)=Ax^2+Bx+C$라 하면 $\dfrac{A+2}{1-A}=-4 \implies A+2=-4+4A \implies A=2$이다. (12)
2. (나)에서 $f(x)$는 $(x+2)^2$을 인수로 가지므로 $f(x)=2(x+2)^2$이고 $f(1)=2\cdot 3^2=18$이다.
3. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「다항함수 $f(x)$가 다음 조건을 만족시킬 때, $f」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 미정계수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: 문항10번(토큰:12) 대상 문항10의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_PARAMETER_DETERMINATION / TPL=TPL_LIMIT_FINITE_CONDITION_PARAMETER (원천과 같음) (원천과 같음)
- 이유: 문항10번(토큰:12) 대상 문항10의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항10번(토큰:12) 대상 문항10의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「}\dfrac{f(x)}{(x+2)^2}=k$」
- method: 정리(NAMED)←solution:「(가)에서 $f(x)=Ax^2+Bx+C$라 하」
- condition: (없음)

**how** 문항10번(토큰:12) 발문과 해설의 문항10 풀이 단계를 점검하여 최종 정답 ④를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

(가)에서 $f(x)=Ax^2+Bx+C$라 하면 $\dfrac{A+2}{1-A}=-4 \implies A+2=-4+4A \implies A=2$이다. (나)에서 $f(x)$는 $(x+2)^2$을 인수로 가지므로 $f(x)=2(x+2)^2$이고 $f(1)=2\cdot 3^2=18$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4.3점


**발문**

그림과 같이 직선 $y=\dfrac{1}{3}x+1$ 위의 두 점 $A(-3,\ 0)$, $P\left(t,\ \dfrac{1}{3}t+1\right)$이 있다. 점 $P$를 지나고 직선 $y=\dfrac{1}{3}x+1$에 수직인 직선이 $y$축과 만나는 점을 $Q$라 할 때, $\lim_{t\to\infty}\dfrac{\overline{AP}^2}{\overline{AQ}^2}$의 값은?

**보기** ① $\dfrac{1}{10}$  ② $\dfrac{1}{9}$  ③ $\dfrac{1}{8}$  ④ $\dfrac{1}{5}$  ⑤ $\dfrac{1}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 수선의 기울기는 $-3$이므로 $y-\left(\dfrac{1}{3}t+1\right)=-3(x-t)$에서 $x=0$일 때 $Q\left(0,\ \dfrac{10}{3}t+1\right)$이다.
2. $$\overline{AP}^2=\frac{10}{9}(t+3)^2, \quad \overline{AQ}^2=9+\left(\frac{10}{3}t+1\right)^2$$ 따라서 $\lim_{t\to\infty}\dfrac{\overline{AP}^2}{\overline{AQ}^2}=\dfrac{10/9}{100/9}=\dfrac{1}{10}$이다.
3. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「그림과 같이 직선 $y=\dfrac{1}{3}x+1$ 」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 무한대에서의 극한 > 다항·유리함수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: 문항11번(토큰:AP) 대상 문항11의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음) (원천과 같음)
- 이유: 문항11번(토큰:AP) 대상 문항11의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항11번(토큰:AP) 대상 문항11의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「2}{\overline{AQ}^2}$의 값은?」
- method: 정리(NAMED)←solution:「수선의 기울기는 $-3$이므로 $y-\left」
- condition: (없음)

**how** 문항11번(토큰:AP) 발문과 해설의 문항11 풀이 단계를 점검하여 최종 정답 ①를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

수선의 기울기는 $-3$이므로 $y-\left(\dfrac{1}{3}t+1\right)=-3(x-t)$에서 $x=0$일 때 $Q\left(0,\ \dfrac{10}{3}t+1\right)$이다. $$\overline{AP}^2=\frac{10}{9}(t+3)^2, \quad \overline{AQ}^2=9+\left(\frac{10}{3}t+1\right)^2$$ 따라서 $\lim_{t\to\infty}\dfrac{\overline{AP}^2}{\overline{AQ}^2}=\dfrac{10/9}{100/9}=\dfrac{1}{10}$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

좌표평면 위에서 곡선 $y=x^2+5x+4$ 위의 점과 직선 $y=-x-8$ 위의 점 사이의 거리의 최솟값은?

**보기** ① $\dfrac{\sqrt{2}}{2}$  ② $\sqrt{2}$  ③ $\dfrac{3\sqrt{2}}{2}$  ④ $2\sqrt{2}$  ⑤ $\dfrac{5\sqrt{2}}{2}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항 12번 문제의 조건(12)에 맞추어 식을 세운다.
2. 곡선 위의 점 $(x,\ x^2+5x+4)$에서 직선 $x+y+8=0$까지의 거리는 $$d(x)=\frac{|x^2+6x+12|}{\sqrt{2}}=\frac{(x+3)^2+3}{\sqrt{2}}\ge\frac{3}{\sqrt{2}}=\frac{3\sqrt{2}}{2}$$ 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-05(도함수의 활용) / H22-M1-05-ROLLE_MEAN_VALUE(롤의 정리와 평균값 정리) (원천과 같음)
- 근거 인용: 「좌표평면 위에서 곡선 $y=x^2+5x+4$ 위의 점과」
**RPM** H2-M2-RPM-067 [미분 > 도함수의 활용 > 접선 > 접선의 방정식] **원천→판정: 미분 > 도함수의 활용 > 최대·최소 > 활용 → 미분 > 도함수의 활용 > 접선 > 접선의 방정식**
- 이유: 문항12번(토큰:12) 대상 문항12의 도함수의 활용 단원 RPM H2-M2-RPM-067 분류 유형에 해당한다
**유형** PT=PT_TANGENT_DERIVATIVE / TPL=TPL_TANGENCY_RELATION_GEOMETRY **원천→판정: PT_DERIVATIVE_MAX_MIN → PT_TANGENT_DERIVATIVE** **원천→판정: TPL_MODELED_QUANTITY_OPTIMIZATION → TPL_TANGENCY_RELATION_GEOMETRY**
- 이유: 문항12번(토큰:12) 대상 문항12의 도함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항12번(토큰:12) 대상 문항12의 도함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「=-x-8$ 위의 점 사이의 거리의 최솟값은?」
- method: 정리(NAMED)←solution:「곡선 위의 점 $(x,\ x^2+5x+4)$에」
- condition: (없음)

**how** 문항12번(토큰:12) 발문과 해설의 문항12 풀이 단계를 점검하여 최종 정답 ③를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

곡선 위의 점 $(x,\ x^2+5x+4)$에서 직선 $x+y+8=0$까지의 거리는 $$d(x)=\frac{|x^2+6x+12|}{\sqrt{2}}=\frac{(x+3)^2+3}{\sqrt{2}}\ge\frac{3}{\sqrt{2}}=\frac{3\sqrt{2}}{2}$$ 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4.7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다항식 $(x^2-1)(x^2+ax)-12$를 $(x-2)^2$으로 나누었을 때의 나머지를 $R(x)$라 하자. $R(x)$가 $x-2$로 나누어떨어질 때, $R(a+1)$의 값은? (단, $a$는 상수이다.)

**보기** ① $-14$  ② $-28$  ③ $-36$  ④ $-42$  ⑤ $-56$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $P(x)=(x^2-1)(x^2+ax)-12$라 하면 $R(2)=P(2)=3(4+2a)-12=6a=0 \implies a=0$이다.
2. $P(x)=x^4-x^2-12$이므로 $P'(x)=4x^3-2x$이고 $P'(2)=32-4=28$이다.
3. 따라서 $R(x)=28(x-2)$이고 $R(a+1)=R(1)=-28$이다.
4. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-05(도함수의 활용) / H22-M1-05-ROLLE_MEAN_VALUE(롤의 정리와 평균값 정리) (원천과 같음)
- 근거 인용: 「다항식 $(x^2-1)(x^2+ax)-12$를 $(x-」
**RPM** H2-M2-RPM-067 [미분 > 도함수의 활용 > 접선 > 접선의 방정식] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 미분법 → 미분 > 도함수의 활용 > 접선 > 접선의 방정식**
- 이유: 문항13번(토큰:ax) 대상 문항13의 도함수의 활용 단원 RPM H2-M2-RPM-067 분류 유형에 해당한다
**유형** PT=PT_TANGENT_DERIVATIVE / TPL=TPL_TANGENCY_RELATION_GEOMETRY **원천→판정: PT_DERIVATIVE_RULE_EVALUATION → PT_TANGENT_DERIVATIVE** **원천→판정: TPL_DERIVATIVE_RULE_CALCULATION → TPL_TANGENCY_RELATION_GEOMETRY**
- 이유: 문항13번(토큰:ax) 대상 문항13의 도함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항13번(토큰:ax) 대상 문항13의 도함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「+1)$의 값은? (단, $a$는 상수이다.)」
- method: 정리(NAMED)←solution:「$P(x)=(x^2-1)(x^2+ax)-12$」
- condition: (없음)

**how** 문항13번(토큰:ax) 발문과 해설의 문항13 풀이 단계를 점검하여 최종 정답 ②를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$P(x)=(x^2-1)(x^2+ax)-12$라 하면 $R(2)=P(2)=3(4+2a)-12=6a=0 \implies a=0$이다. $P(x)=x^4-x^2-12$이므로 $P'(x)=4x^3-2x$이고 $P'(2)=32-4=28$이다. 따라서 $R(x)=28(x-2)$이고 $R(a+1)=R(1)=-28$이다. 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4.8점


**발문**

양의 실수 전체의 집합에서 연속인 함수 $f(x)$가 모든 양의 실수 $x$에 대하여 $(\sqrt{x}-3)f(x)=x^2+ax+b$를 만족시키고 $f(1)=8$일 때, $f(9)$의 값은? (단, $a,\ b$는 상수이다.)

**보기** ① $42$  ② $48$  ③ $54$  ④ $56$  ⑤ $60$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x=1$에서 $-2\cdot 8=1+a+b \implies a+b=-17$, $x=9$에서 $81+9a+b=0$이므로 연립하면 $a=-8,\ b=-9$이다. (ax)
2. $x^2-8x-9=(x-9)(x+1)$이므로 $x\ne 9$에서 $f(x)=(\sqrt{x}+3)(x+1)$이고, 연속성에 의해 $f(9)=6\times 10=60$이다.
3. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-02(함수의 연속) / H22-M1-02-CONTINUITY_POINT(한 점에서의 연속) (원천과 같음)
- 근거 인용: 「양의 실수 전체의 집합에서 연속인 함수 $f(x)$가 」
**RPM** H2-M2-RPM-055 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 미정계수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: 문항14번(토큰:ax) 대상 문항14의 함수의 연속 단원 RPM H2-M2-RPM-055 분류 유형에 해당한다
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_FACTOR_CONDITION (원천과 같음)
- 이유: 문항14번(토큰:ax) 대상 문항14의 함수의 연속 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항14번(토큰:ax) 대상 문항14의 함수의 연속 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「의 값은? (단, $a,\ b$는 상수이다.)」
- method: 정리(NAMED)←solution:「$x=1$에서 $-2\cdot 8=1+a+b」
- condition: (없음)

**how** 문항14번(토큰:ax) 발문과 해설의 문항14 풀이 단계를 점검하여 최종 정답 ⑤를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$x=1$에서 $-2\cdot 8=1+a+b \implies a+b=-17$, $x=9$에서 $81+9a+b=0$이므로 연립하면 $a=-8,\ b=-9$이다. $x^2-8x-9=(x-9)(x+1)$이므로 $x\ne 9$에서 $f(x)=(\sqrt{x}+3)(x+1)$이고, 연속성에 의해 $f(9)=6\times 10=60$이다. 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4.8점


**발문**

함수 $f(x)=|x-2|$, $g(x)=\begin{cases}x-2&(x<0)\x^3+ax^2+bx+c&(x\ge 0)\end{cases}$에 대하여 함수 $f(x)g(x)$가 실수 전체의 집합에서 미분가능할 때, 세 상수 $a,\ b,\ c$에 대하여 $a+b+c$의 값은?

**보기** ① $-6$  ② $-5$  ③ $-4$  ④ $-3$  ⑤ $-2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $h(x)=f(x)g(x)$가 $x=0$에서 연속이므로 $2(-2)=2c \implies c=-2$이다. (cases)
2. $x<0$에서 $h(x)=-(x-2)^2 \implies h'(0^-)=4$, $0<x<2$에서 $h'(0^+)=2+2b$이므로 $b=1$이다.
3. $x=2$에서 미분가능하려면 $g(2)=0$이어야 하므로 $8+4a+2-2=0 \implies a=-2$이다.
4. 따라서 $a+b+c=-3$이다.
5. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-03(미분계수) / H22-M1-03-DIFFERENTIABILITY_CONDITION(미분가능 조건) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x)=|x-2|$, $g(x)=\begin{」
**RPM** H2-M2-RPM-065 [미분 > 미분계수와 도함수 > 미분가능성과 연속 > 미분가능 조건] (원천과 같음)
- 이유: 문항15번(토큰:cases) 대상 문항15의 미분가능 조건 단원 RPM H2-M2-RPM-065 분류 유형에 해당한다
**유형** PT=PT_DIFFERENTIABILITY_CONDITION / TPL=TPL_DIFFERENTIABILITY_POINT_CONDITION (원천과 같음) (원천과 같음)
- 이유: 문항15번(토큰:cases) 대상 문항15의 미분가능 조건 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항15번(토큰:cases) 대상 문항15의 미분가능 조건 단원 기본 개념과 풀이 과정을 적용하는 난이도 4 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「b,\ c$에 대하여 $a+b+c$의 값은?」
- method: 정리(NAMED)←solution:「$h(x)=f(x)g(x)$가 $x=0$에서」
- condition: (없음)

**how** 문항15번(토큰:cases) 발문과 해설의 문항15 풀이 단계를 점검하여 최종 정답 ④를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$h(x)=f(x)g(x)$가 $x=0$에서 연속이므로 $2(-2)=2c \implies c=-2$이다. $x<0$에서 $h(x)=-(x-2)^2 \implies h'(0^-)=4$, $0<x<2$에서 $h'(0^+)=2+2b$이므로 $b=1$이다. $x=2$에서 미분가능하려면 $g(2)=0$이어야 하므로 $8+4a+2-2=0 \implies a=-2$이다. 따라서 $a+b+c=-3$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4.9점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다항함수 $f(x)$가 $\lim_{x\to 0}\dfrac{f(x)}{x}=5$, $\lim_{x\to 2}\dfrac{f(x)}{x-2}=3$을 만족시킬 때, 극한값 $\lim_{x\to 2}\dfrac{f(f(x))}{2x^2+x-10}$의 값은?

**보기** ① $\dfrac{5}{3}$  ② $\dfrac{1}{3}$  ③ $\dfrac{2}{3}$  ④ $\dfrac{4}{3}$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항 16번 문제의 조건(10)에 맞추어 식을 세운다.
2. $2x^2+x-10=(x-2)(2x+5)$이고 $x\to 2$일 때 $f(x)\to 0$이므로 $$\lim_{x\to 2}\frac{f(f(x))}{2x^2+x-10}=\lim_{x\to 2}\frac{f(f(x))}{f(x)}\cdot\frac{f(x)}{x-2}\cdot\frac{1}{2x+5}=5\times 3\times\frac{1}{9}=\frac{5}{3}$$ 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「다항함수 $f(x)$가 $\lim_{x\to 0}\df」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 대수적 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: 문항16번(토큰:10) 대상 문항16의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_OPERATION_LAWS (원천과 같음) (원천과 같음)
- 이유: 문항16번(토큰:10) 대상 문항16의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항16번(토큰:10) 대상 문항16의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 4 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「f(f(x))}{2x^2+x-10}$의 값은?」
- method: 정리(NAMED)←solution:「$2x^2+x-10=(x-2)(2x+5)$이고」
- condition: (없음)

**how** 문항16번(토큰:10) 발문과 해설의 문항16 풀이 단계를 점검하여 최종 정답 ①를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$2x^2+x-10=(x-2)(2x+5)$이고 $x\to 2$일 때 $f(x)\to 0$이므로 $$\lim_{x\to 2}\frac{f(f(x))}{2x^2+x-10}=\lim_{x\to 2}\frac{f(f(x))}{f(x)}\cdot\frac{f(x)}{x-2}\cdot\frac{1}{2x+5}=5\times 3\times\frac{1}{9}=\frac{5}{3}$$ 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점


**발문**

$-2<x<2$에서 정의된 함수 $y=f(x)$의 그래프가 그림과 같을 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? (단, $f^{-1}(x)$는 함수 $f(x)$의 역함수이다.) ㄱ. $\lim_{x\to 1^-}f(x)=-1$ ㄴ. $\lim_{x\to 1^+}f^{-1}(x)=1$ ㄷ. $\lim_{x\to a^-}f^{-1}(x)+\lim_{x\to a^+}f^{-1}(x)=\dfrac{1}{2}$을 만족시키는 실수 $a$는 존재하지 않는다.

**보기** ① ㄴ  ② ㄷ  ③ ㄱ  ④ ㄱ, ㄴ  ⑤ ㄱ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ㄱ.
2. $(0,\ 1]$에서 $(0,\ 0)$에서 $(1,\ -1)$로 향하므로 $\lim_{x\to 1^-}f(x)=-1$이다(참).
3. ㄴ.
4. $(1,\ 2)$에서 $(1,\ 2)$와 $(2,\ 1)$을 잇는 선분이므로 $y\to 1^+$일 때 $x\to 2$이다.
5. 즉 $\lim_{x\to 1^+}f^{-1}(x)=2$이다(거짓).
6. ㄷ.
7. $a=-\dfrac{1}{4}$일 때 $f^{-1}\left(-\dfrac{1}{4}\right)=\dfrac{1}{4}$이고 연속이므로 좌·우극한의 합은 $\dfrac{1}{2}$이다(거짓).
8. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「$-2<x<2$에서 정의된 함수 $y=f(x)$의 그래」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] (원천과 같음)
- 이유: 문항17번(토큰:2) 대상 문항17의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_DIRECTIONAL_APPROACH (원천과 같음) (원천과 같음)
- 이유: 문항17번(토큰:2) 대상 문항17의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 5 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항17번(토큰:2) 대상 문항17의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 5 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「을 만족시키는 실수 $a$는 존재하지 않는다.」
- method: 정리(NAMED)←solution:「ㄱ. $(0,\ 1]$에서 $(0,\ 0)$에」
- condition: (없음)

**how** 문항17번(토큰:2) 발문과 해설의 문항17 풀이 단계를 점검하여 최종 정답 ③를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. $(0,\ 1]$에서 $(0,\ 0)$에서 $(1,\ -1)$로 향하므로 $\lim_{x\to 1^-}f(x)=-1$이다(참). ㄴ. $(1,\ 2)$에서 $(1,\ 2)$와 $(2,\ 1)$을 잇는 선분이므로 $y\to 1^+$일 때 $x\to 2$이다. 즉 $\lim_{x\to 1^+}f^{-1}(x)=2$이다(거짓). ㄷ. $a=-\dfrac{1}{4}$일 때 $f^{-1}\left(-\dfrac{1}{4}\right)=\dfrac{1}{4}$이고 연속이므로 좌·우극한의 합은 $\dfrac{1}{2}$이다(거짓). 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 단답형 3점


**발문**

두 함수 $f(x),\ g(x)$에 대하여 $\lim_{x\to 3}f(x)=-3$, $\lim_{x\to 3}g(x)=a$이고 $\lim_{x\to 3}f(x)g(x)=-12$일 때, $\lim_{x\to 3}{f(x)+2g(x)}$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 5   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항 18번 문제의 조건(12)에 맞추어 식을 세운다.
2. $-3a=-12 \implies a=4$이므로 $\lim_{x\to 3}{f(x)+2g(x)}=-3+2\cdot 4=5$이다.
- 작성자 답: 5 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「두 함수 $f(x),\ g(x)$에 대하여 $\lim_」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 극한의 성질 > 대수적 계산 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: 문항18번(토큰:12) 대상 문항18의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_OPERATION_LAWS (원천과 같음) (원천과 같음)
- 이유: 문항18번(토큰:12) 대상 문항18의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항18번(토큰:12) 대상 문항18의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 1 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「3}{f(x)+2g(x)}$의 값을 구하시오.」
- method: 정리(NAMED)←solution:「$-3a=-12 \implies a=4$이므로」
- condition: (없음)

**how** 문항18번(토큰:12) 발문과 해설의 문항18 풀이 단계를 점검하여 최종 정답 5를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$-3a=-12 \implies a=4$이므로 $\lim_{x\to 3}{f(x)+2g(x)}=-3+2\cdot 4=5$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 단답형 3점


**발문**

함수 $y=(2x^2+3)(4-x^2)$의 도함수를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-8x^3+10x$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항 19번 문제의 조건(12)에 맞추어 식을 세운다.
2. $y=-2x^4+5x^2+12$이므로 각 항을 미분하면 $y'=-8x^3+10x$이다.
- 작성자 답: $-8x^3+10x$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-04(도함수) / H22-M1-04-DERIVATIVE_CALCULATION(도함수 계산) (원천과 같음)
- 근거 인용: 「함수 $y=(2x^2+3)(4-x^2)$의 도함수를 구」
**RPM** H2-M2-RPM-063 [미분 > 미분계수와 도함수 > 도함수 > 미분법] **원천→판정: 미분 > 미분계수와 도함수 > 도함수 > 도함수 계산 → 미분 > 미분계수와 도함수 > 도함수 > 미분법**
- 이유: 문항19번(토큰:12) 대상 문항19의 도함수 단원 RPM H2-M2-RPM-063 분류 유형에 해당한다
**유형** PT=PT_DERIVATIVE_RULE_EVALUATION / TPL=TPL_DERIVATIVE_RULE_CALCULATION (원천과 같음) (원천과 같음)
- 이유: 문항19번(토큰:12) 대상 문항19의 도함수 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항19번(토큰:12) 대상 문항19의 도함수 단원 기본 개념과 풀이 과정을 적용하는 난이도 1 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「^2+3)(4-x^2)$의 도함수를 구하시오.」
- method: 정리(NAMED)←solution:「$y=-2x^4+5x^2+12$이므로 각 항을」
- condition: (없음)

**how** 문항19번(토큰:12) 발문과 해설의 문항19 풀이 단계를 점검하여 최종 정답 $-8x^3+10x$를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$y=-2x^4+5x^2+12$이므로 각 항을 미분하면 $y'=-8x^3+10x$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서술형 1] 실수 전체의 집합에서 미분가능하고 다음 조건을 만족시키는 모든 함수 $f(x)$에 대하여 $f(6)$의 최솟값을 구하고 그 과정을 서술하시오. (가) $f(1)=2$ (나) $1<x<6$인 모든 실수 $x$에 대하여 $f'(x)\ge 3$이다.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 17   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평균값 정리에 의해 $\dfrac{f(6)-f(1)}{6-1}=f'(c)$인 $c\in(1,\ 6)$이 존재한다.
2. $\dfrac{f(6)-2}{5}=f'(c)\ge 3 \implies f(6)\ge 17$이며, $f(x)=3x-1$일 때 등호가 성립한다.
3. 따라서 최솟값은 $17$이다.
- 작성자 답: 17 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-05(도함수의 활용) / H22-M1-05-ROLLE_MEAN_VALUE(롤의 정리와 평균값 정리) (원천과 같음)
- 근거 인용: 「[서술형 1] 실수 전체의 집합에서 미분가능하고 다음 」
**RPM** H2-M2-RPM-067 [미분 > 도함수의 활용 > 접선 > 접선의 방정식] **원천→판정: 미분 > 도함수의 활용 > 롤의 정리와 평균값 정리 > 평균값 정리의 조건과 적용 → 미분 > 도함수의 활용 > 접선 > 접선의 방정식**
- 이유: 문항20번(토큰:17) 대상 문항20의 도함수의 활용 단원 RPM H2-M2-RPM-067 분류 유형에 해당한다
**유형** PT=PT_TANGENT_DERIVATIVE / TPL=TPL_TANGENCY_RELATION_GEOMETRY **원천→판정: PT_MEAN_VALUE_THEOREM → PT_TANGENT_DERIVATIVE** **원천→판정: TPL_MVT_ROLLE_DIRECT → TPL_TANGENCY_RELATION_GEOMETRY**
- 이유: 문항20번(토큰:17) 대상 문항20의 도함수의 활용 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항20번(토큰:17) 대상 문항20의 도함수의 활용 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「$x$에 대하여 $f'(x)\ge 3$이다.」
- method: 정리(NAMED)←solution:「평균값 정리에 의해 $\dfrac{f(6)-f」
- condition: (없음)

**how** 문항20번(토큰:17) 발문과 해설의 문항20 풀이 단계를 점검하여 최종 정답 17를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

평균값 정리에 의해 $\dfrac{f(6)-f(1)}{6-1}=f'(c)$인 $c\in(1,\ 6)$이 존재한다. $\dfrac{f(6)-2}{5}=f'(c)\ge 3 \implies f(6)\ge 17$이며, $f(x)=3x-1$일 때 등호가 성립한다. 따라서 최솟값은 $17$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점


**발문**

[서술형 2] 함수 $f(x)=\begin{cases}ax+b&(|x|\ge 2)\\dfrac{|x|-2}{|x^2-4|}&(|x|<2)\end{cases}$이 실수 전체의 집합에서 연속일 때, 상수 $a,\ b$에 대하여 $4a+8b$의 값을 구하고 그 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** -2   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $|x|<2$에서 $f(x)=\dfrac{-(2-|x|)}{(2-|x|)(2+|x|)}=-\dfrac{1}{2+|x|}$이므로 $x\to 2^-$ 및 $x\to -2^+$일 때 극한값은 모두 $-\dfrac{1}{4}$이다. (cases)
2. $2a+b=-\dfrac{1}{4}$, $-2a+b=-\dfrac{1}{4}$을 연립하면 $a=0,\ b=-\dfrac{1}{4}$이므로 $4a+8b=-2$이다.
- 작성자 답: -2 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-02(함수의 연속) / H22-M1-02-CONTINUITY_POINT(한 점에서의 연속) (원천과 같음)
- 근거 인용: 「[서술형 2] 함수 $f(x)=\begin{cases}」
**RPM** H2-M2-RPM-055 [함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속] **원천→판정: 함수의 극한과 연속 > 함수의 연속 > 연속 조건 > 구간별 함수 → 함수의 극한과 연속 > 함수의 연속 > 연속의 뜻 > 한 점에서의 연속**
- 이유: 문항21번(토큰:cases) 대상 문항21의 함수의 연속 단원 RPM H2-M2-RPM-055 분류 유형에 해당한다
**유형** PT=PT_CONTINUITY_CONDITION / TPL=TPL_CONTINUITY_PIECEWISE_BOUNDARY_MATCH (원천과 같음) (원천과 같음)
- 이유: 문항21번(토큰:cases) 대상 문항21의 함수의 연속 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항21번(토큰:cases) 대상 문항21의 함수의 연속 단원 기본 개념과 풀이 과정을 적용하는 난이도 3 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「+8b$의 값을 구하고 그 과정을 서술하시오.」
- method: 정리(NAMED)←solution:「$|x|<2$에서 $f(x)=\dfrac{-(」
- condition: (없음)

**how** 문항21번(토큰:cases) 발문과 해설의 문항21 풀이 단계를 점검하여 최종 정답 -2를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$|x|<2$에서 $f(x)=\dfrac{-(2-|x|)}{(2-|x|)(2+|x|)}=-\dfrac{1}{2+|x|}$이므로 $x\to 2^-$ 및 $x\to -2^+$일 때 극한값은 모두 $-\dfrac{1}{4}$이다. $2a+b=-\dfrac{1}{4}$, $-2a+b=-\dfrac{1}{4}$을 연립하면 $a=0,\ b=-\dfrac{1}{4}$이므로 $4a+8b=-2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점


**발문**

[서술형 3] 삼차함수 $f(x)$에 대하여 $\left{t;\middle|;\lim_{x\to t}\dfrac{f(x)-x^2-2x}{x-t}=6t-10\right}={1,\ 3}$일 때, $f(4)$의 값을 구하고 그 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 39   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $g(x)=f(x)-x^2-2x$라 하면 $g(1)=g(3)=0$, $g'(1)=-4$, $g'(3)=8$이다. (10)
2. $g(x)=A(x-1)(x-3)(x-r)$이라 두면 $g'(1)=-2A(1-r)=-4 \implies A(1-r)=2$, $g'(3)=2A(3-r)=8 \implies A(3-r)=4$이다.
3. 두 식을 빼면 $2A=2 \implies A=1,\ r=-1$이므로 $g(x)=(x-1)(x-3)(x+1)=x^3-3x^2-x+3$이다.
4. 따라서 $f(x)=x^3-2x^2+x+3$이고 $f(4)=64-32+4+3=39$이다.
- 작성자 답: 39 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-03(미분계수) / H22-M1-03-DERIVATIVE_DEFINITION(미분계수의 정의와 계산) (원천과 같음)
- 근거 인용: 「[서술형 3] 삼차함수 $f(x)$에 대하여 $\lef」
**RPM** H2-M2-RPM-061 [미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율] **원천→판정: 미분 > 미분계수와 도함수 > 미분계수 > 정의로 미분계수 → 미분 > 미분계수와 도함수 > 미분계수 > 평균변화율·순간변화율**
- 이유: 문항22번(토큰:10) 대상 문항22의 미분계수 단원 RPM H2-M2-RPM-061 분류 유형에 해당한다
**유형** PT=PT_DERIVATIVE_DEFINITION / TPL=TPL_DERIVATIVE_LIMIT_REDUCTION (원천과 같음) (원천과 같음)
- 이유: 문항22번(토큰:10) 대상 문항22의 미분계수 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항22번(토큰:10) 대상 문항22의 미분계수 단원 기본 개념과 풀이 과정을 적용하는 난이도 4 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「(4)$의 값을 구하고 그 과정을 서술하시오.」
- method: 정리(NAMED)←solution:「$g(x)=f(x)-x^2-2x$라 하면 $g」
- condition: (없음)

**how** 문항22번(토큰:10) 발문과 해설의 문항22 풀이 단계를 점검하여 최종 정답 39를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$g(x)=f(x)-x^2-2x$라 하면 $g(1)=g(3)=0$, $g'(1)=-4$, $g'(3)=8$이다. $g(x)=A(x-1)(x-3)(x-r)$이라 두면 $g'(1)=-2A(1-r)=-4 \implies A(1-r)=2$, $g'(3)=2A(3-r)=8 \implies A(3-r)=4$이다. 두 식을 빼면 $2A=2 \implies A=1,\ r=-1$이므로 $g(x)=(x-1)(x-3)(x+1)=x^3-3x^2-x+3$이다. 따라서 $f(x)=x^3-2x^2+x+3$이고 $f(4)=64-32+4+3=39$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

[서술형 4] 다음 조건을 만족시키는 모든 다항함수 $f(x)$에 대하여 $f(1)$의 최댓값을 구하고 그 과정을 서술하시오. $\lim_{x\to\infty}\dfrac{f(x)-4x^4+6x^3}{x^{n+1}+2}=4$, $\lim_{x\to 0}\dfrac{f(x)}{x^n}=2$인 자연수 $n$이 존재한다.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 10   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $x\to 0$ 극한에서 $f(x)$의 최저차항은 $2x^n$이다.
2. $n$의 값에 따라 나누면 다음과 같다.
3. ① $n=1$: $f(x)=4x^4-6x^3+4x^2+2x \implies f(1)=4$ ② $n=2$: $f(x)=4x^4-2x^3+2x^2 \implies f(1)=4$ ③ $n=3$: $f(x)=8x^4+2x^3 \implies f(1)=10$ ④ $n\ge 4$: $f(x)=4x^{n+1}+2x^n \implies f(1)=6$ 따라서 $f(1)$의 최댓값은 $10$이다.
- 작성자 답: 10 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** H22-M1-01(함수의 극한) / H22-M1-01-LIMIT_VALUE_CALC(극한값 계산) (원천과 같음)
- 근거 인용: 「[서술형 4] 다음 조건을 만족시키는 모든 다항함수 $」
**RPM** H2-M2-RPM-049 [함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한] **원천→판정: 함수의 극한과 연속 > 함수의 극한 > 무한대에서의 극한 > 다항·유리함수 → 함수의 극한과 연속 > 함수의 극한 > 함수의 극한 > 좌극한·우극한**
- 이유: 문항23번(토큰:10) 대상 문항23의 함수의 극한 단원 RPM H2-M2-RPM-049 분류 유형에 해당한다
**유형** PT=PT_LIMIT_VALUE_CALC / TPL=TPL_LIMIT_INFINITY_LEADING_TERM (원천과 같음) (원천과 같음)
- 이유: 문항23번(토큰:10) 대상 문항23의 함수의 극한 단원 핵심 학습 요소를 평가하는 유형이다
**난이도** 5 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문항23번(토큰:10) 대상 문항23의 함수의 극한 단원 기본 개념과 풀이 과정을 적용하는 난이도 5 문항이다

**4칸**
- given: (없음)
- goal: 값←stem:「}{x^n}=2$인 자연수 $n$이 존재한다.」
- method: 정리(NAMED)←solution:「$x\to 0$ 극한에서 $f(x)$의 최저차」
- condition: (없음)

**how** 문항23번(토큰:10) 발문과 해설의 문항23 풀이 단계를 점검하여 최종 정답 10를 도출하였다

<details><summary>저장 해설 (판정 검토용)</summary>

$x\to 0$ 극한에서 $f(x)$의 최저차항은 $2x^n$이다. $n$의 값에 따라 나누면 다음과 같다. ① $n=1$: $f(x)=4x^4-6x^3+4x^2+2x \implies f(1)=4$ ② $n=2$: $f(x)=4x^4-2x^3+2x^2 \implies f(1)=4$ ③ $n=3$: $f(x)=8x^4+2x^3 \implies f(1)=10$ ④ $n\ge 4$: $f(x)=4x^{n+1}+2x^n \implies f(1)=6$ 따라서 $f(1)$의 최댓값은 $10$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
