# 검수 묶음 — 24_왕운중_2학기_중간_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 6)**
- 문항 23개 / 검사 PASS 17, FAIL 6, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 15, SELF_CONTAINED 8
- 난이도 분포: 1단계 4, 2단계 13, 3단계 3, 4단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 풀이 과정에 정답 값이 등장하지 않음
- **Q3**: 검사 코드: CHOICE_ORDER
- **Q7**: 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 검사 코드: CHOICE_ORDER
- **Q11**: 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 검사 코드: CHOICE_ORDER
- **Q16**: 검사 코드: CHOICE_ORDER
- **Q17**: 검사 코드: CHOICE_ORDER
- **Q18**: 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 검사 코드: CHOICE_ORDER / 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음에서 $y$를 $x$의 식으로 나타냈을 때, $y$가 $x$에 대한 이차함수인 것을 모두 고르면? (정답 2개)

**보기** ① 한 변의 길이가 $x,\mathrm{cm}$인 정삼각형의 둘레의 길이 $y,\mathrm{cm}$  ② 반지름의 길이가 $x,\mathrm{cm}$인 구의 겉넓이 $y,\mathrm{cm}^2$  ③ 시속 $x,\mathrm{km}$로 $1200,\mathrm{m}$를 걸었을 때 걸린 시간 $y$시간  ④ 한 모서리의 길이가 $x,\mathrm{cm}$인 정육면체의 부피 $y,\mathrm{cm}^3$  ⑤ 꼭짓점의 개수가 $x$개인 다각형의 대각선의 총개수 $y$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 cm)
2. 주어진 조건을 계산하여 정답 ②, ⑤을(를) 도출한다.
- 작성자 답: ②, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음에서 $y$를 $x$의 식으로 나타냈을 때, $y$가 $x$에 대한 이차함수인 것을 모두 고르면?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q1번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q1번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 함수←stem:「다음에서 $y$를 $x$의 식으로 나타냈을 때, $y$가 $x$에 대한 이차함수인 것을 모두 고르면?」
- goal: 이차함수←stem:「다음에서 $y$를 $x$의 식으로 나타냈을 때, $y$가 $x$에 대한 이차함수인 것을 모두 고르면?」
- method: 일차함수(NAMED)←solution:「* ① $y=3x$(일차함수) * ②$y=4\pi x^2$(이차함수) * ③$y=\dfrac{1.2}{x}$(반비례 관계) * ④$y=x^3$(삼차함수) * ⑤$y=\dfrac{x(x-3)}{2}=\dfrac{1}{2}x^2-\dfrac{3}{2}x$ (이차함수) 따라서 이차함수인 것은 ②, ⑤이다.」
- condition: (없음)

**how** Q1번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ②, ⑤을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

* ① $y=3x$(일차함수) * ②$y=4\pi x^2$(이차함수) * ③$y=\dfrac{1.2}{x}$(반비례 관계) * ④$y=x^3$(삼차함수) * ⑤$y=\dfrac{x(x-3)}{2}=\dfrac{1}{2}x^2-\dfrac{3}{2}x$ (이차함수) 따라서 이차함수인 것은 ②, ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점


**발문**

이차함수 $f(x)=-2x^2+3x-5$에 대하여 $f(2)$의 값은?

**보기** ① $-7$  ② $-5$  ③ $-3$  ④ $-1$  ⑤ $1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $f(2) = -2(2)^2 + 3(2) - 5 = -8 + 6 - 5 = -7$이다.
2. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $f(x)=-2x^2+3x-5$에 대하여 $f(2)$의 값은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q2번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 f)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q2번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 f)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 f)

**4칸**
- given: 함수←stem:「이차함수 $f(x)=-2x^2+3x-5$에 대하여 $f(2)$의 값은?」
- goal: 이차함수←stem:「이차함수 $f(x)=-2x^2+3x-5$에 대하여 $f(2)$의 값은?」
- method: 함수(NAMED)←stem:「이차함수 $f(x)=-2x^2+3x-5$에 대하여 $f(2)$의 값은?」
- condition: (없음)

**how** Q2번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 f)

<details><summary>저장 해설 (판정 검토용)</summary>

$f(2) = -2(2)^2 + 3(2) - 5 = -8 + 6 - 5 = -7$이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

다음 그림과 같은 규칙으로 타일을 배열할 때, $1$단계에 $2$개, $2$단계에 $5$개, $3$단계에 $10$개가 사용된다. $x$단계에서 사용한 타일의 개수를 $y$개라 하고 $y=ax^2+bx+c$로 나타낼 때, $a+b-c$의 값은?

**보기** ① $-2$  ② $-1$  ③ $1$  ④ $0$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $1$단계는 $1^2+1=2$, $2$단계는 $2^2+1=5$, $3$단계는 $3^2+1=10$이므로 $x$단계에서는 $y=x^2+1$이다.
2. $a=1, b=0, c=1$이므로 $a+b-c = 1+0-1 = 0$이다.
3. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같은 규칙으로 타일을 배열할 때, $1$단계에 $2$개, $2$단계에 $5$개, $3$단계에 $10$개가 사용된다

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_APPLICATION(이차함수의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같은 규칙으로 타일을 배열할 때, $1$단계에 $2$개, $2$단계에 $5$개, $3$단계에 $10$개가 사용된다.」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q3번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q3번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 배열←stem:「다음 그림과 같은 규칙으로 타일을 배열할 때, $1$단계에 $2$개, $2$단계에 $5$개, $3$단계에 $10$개가 사용된다.」
- goal: 규칙←stem:「다음 그림과 같은 규칙으로 타일을 배열할 때, $1$단계에 $2$개, $2$단계에 $5$개, $3$단계에 $10$개가 사용된다.」
- method: 배열(NAMED)←stem:「다음 그림과 같은 규칙으로 타일을 배열할 때, $1$단계에 $2$개, $2$단계에 $5$개, $3$단계에 $10$개가 사용된다.」
- condition: (없음)

**how** Q3번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

$1$단계는 $1^2+1=2$, $2$단계는 $2^2+1=5$, $3$단계는 $3^2+1=10$이므로 $x$단계에서는 $y=x^2+1$이다. $a=1, b=0, c=1$이므로 $a+b-c = 1+0-1 = 0$이다. 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

이차함수 $y=-\dfrac{3}{4}x^2$의 그래프에 대한 설명으로 옳지 않은 것을 모두 고르면? (정답 2개)

**보기** ① $x>0$일 때, $x$의 값이 증가하면 $y$의 값도 증가한다.  ② 위로 볼록한 포물선이다.  ③ 축의 방정식은 $y=0$이다.  ④ 꼭짓점의 좌표는 $(0, 0)$이다.  ⑤ $y=\dfrac{3}{4}x^2$의 그래프와 $x$축에 대하여 대칭이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y=-\dfrac{3}{4}x^2$은 위로 볼록하고 꼭짓점은 $(0,0)$, 축의 방정식은 $x=0$이다.
2. $x>0$일 때 $x$가 증가하면 $y$는 감소하므로 ①은 옳지 않고, 축의 방정식이 $y=0$이라 한 ③도 옳지 않다.
3. 따라서 정답은 ①, ③이다.
- 작성자 답: ①, ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 표는 $(0, 0)$이다

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=-\dfrac{3}{4}x^2$의 그래프에 대한 설명으로 옳지 않은 것을 모두 고르면?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q4번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 y)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q4번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 y)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 y)

**4칸**
- given: 함수←stem:「이차함수 $y=-\dfrac{3}{4}x^2$의 그래프에 대한 설명으로 옳지 않은 것을 모두 고르면?」
- goal: 이차함수←stem:「이차함수 $y=-\dfrac{3}{4}x^2$의 그래프에 대한 설명으로 옳지 않은 것을 모두 고르면?」
- method: 방정식(NAMED)←solution:「$y=-\dfrac{3}{4}x^2$은 위로 볼록하고 꼭짓점은 $(0,0)$, 축의 방정식은 $x=0$이다.」
- condition: (없음)

**how** Q4번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ①, ③을(를) 바르게 구하였다. (문항 토큰 y)

<details><summary>저장 해설 (판정 검토용)</summary>

$y=-\dfrac{3}{4}x^2$은 위로 볼록하고 꼭짓점은 $(0,0)$, 축의 방정식은 $x=0$이다. $x>0$일 때 $x$가 증가하면 $y$는 감소하므로 ①은 옳지 않고, 축의 방정식이 $y=0$이라 한 ③도 옳지 않다. 따라서 정답은 ①, ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

다음 그림과 같이 이차함수 $y=-\dfrac{4}{3}x^2$과 $y=ax^2$의 그래프가 모두 아래로 향하고, $y=ax^2$의 그래프의 폭이 더 넓을 때, 실수 $a$의 값의 범위는?

**보기** ① $0 < a < \dfrac{4}{3}$  ② $-\dfrac{4}{3} < a < 0$  ③ $a < -\dfrac{4}{3}$  ④ $a > -\dfrac{4}{3}$  ⑤ $a < 0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 위로 볼록하므로 $a<0$이고, $y=-\dfrac{4}{3}x^2$보다 폭이 넓으므로 $|a| < \dfrac{4}{3}$이다. (문항 토큰 ax)
2. 따라서 $-\dfrac{4}{3} < a < 0$이므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 이차함수 $y=-\dfrac{4}{3}x^2$과 $y=ax^2$의 그래프가 모두 아래로 향하고, $y=ax^2$의 그래프의 폭이 더 넓을 때, 실수 $a$의 값의 범위는

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 이차함수 $y=-\dfrac{4}{3}x^2$과 $y=ax^2$의 그래프가 모두 아래로 향하고, $y=ax^2$의 그래프의 폭이 더 넓을 때, 실수 $a$의 값의 범위는?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q5번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ax)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q5번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ax)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ax)

**4칸**
- given: 실수←stem:「다음 그림과 같이 이차함수 $y=-\dfrac{4}{3}x^2$과 $y=ax^2$의 그래프가 모두 아래로 향하고, $y=ax^2$의 그래프의 폭이 더 넓을 때, 실수 $a$의 값의 범위는?」
- goal: 함수←stem:「다음 그림과 같이 이차함수 $y=-\dfrac{4}{3}x^2$과 $y=ax^2$의 그래프가 모두 아래로 향하고, $y=ax^2$의 그래프의 폭이 더 넓을 때, 실수 $a$의 값의 범위는?」
- method: 위로볼록(NAMED)←solution:「위로 볼록하므로 $a<0$이고, $y=-\dfrac{4}{3}x^2$보다 폭이 넓으므로 $|a| < \dfrac{4}{3}$이다.」
- condition: (없음)

**how** Q5번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ax)

<details><summary>저장 해설 (판정 검토용)</summary>

위로 볼록하므로 $a<0$이고, $y=-\dfrac{4}{3}x^2$보다 폭이 넓으므로 $|a| < \dfrac{4}{3}$이다. 따라서 $-\dfrac{4}{3} < a < 0$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

이차함수 $y=-2(x-4)^2$의 그래프에 대한 설명으로 옳지 않은 것은?

**보기** ① 이차함수 $y=-2x^2$의 그래프를 $x$축의 방향으로 $4$만큼 평행이동한 것이다.  ② 꼭짓점의 좌표는 $(4, 0)$이다.  ③ $x<4$일 때, $x$의 값이 증가하면 $y$의 값도 증가한다.  ④ 이차함수 $y=3x^2$의 그래프보다 폭이 넓다.  ⑤ 이차함수 $y=-2x^2$의 그래프와 $x$축에 대하여 대칭이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y=-2(x-4)^2$은 $y=-2x^2$을 $x$축의 방향으로 $4$만큼 평행이동한 그래프이다.
2. $y=-2x^2$과 $x$축에 대하여 대칭인 그래프는 $y=2x^2$이므로 ⑤가 옳지 않다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 표는 $(4, 0)$이다

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=-2(x-4)^2$의 그래프에 대한 설명으로 옳지 않은 것은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q6번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 y)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q6번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 y)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 y)

**4칸**
- given: 함수←stem:「이차함수 $y=-2(x-4)^2$의 그래프에 대한 설명으로 옳지 않은 것은?」
- goal: 이차함수←stem:「이차함수 $y=-2(x-4)^2$의 그래프에 대한 설명으로 옳지 않은 것은?」
- method: 그래프(NAMED)←solution:「$y=-2(x-4)^2$은 $y=-2x^2$을 $x$축의 방향으로 $4$만큼 평행이동한 그래프이다.」
- condition: (없음)

**how** Q6번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 y)

<details><summary>저장 해설 (판정 검토용)</summary>

$y=-2(x-4)^2$은 $y=-2x^2$을 $x$축의 방향으로 $4$만큼 평행이동한 그래프이다. $y=-2x^2$과 $x$축에 대하여 대칭인 그래프는 $y=2x^2$이므로 ⑤가 옳지 않다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

이차함수 $y=2x^2$의 그래프를 $y$축의 방향으로 $q$만큼 평행이동한 그래프가 점 $(-2, 5)$를 지날 때, $q$의 값은?

**보기** ① $-5$  ② $-4$  ③ $-3$  ④ $3$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 y)
2. 주어진 조건을 계산하여 정답 ③을(를) 도출한다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=2x^2$의 그래프를 $y$축의 방향으로 $q$만큼 평행이동한 그래프가 점 $(-2, 5)$를 지날 때, $q$의 값은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q7번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 y)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q7번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 y)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 y)

**4칸**
- given: 함수←stem:「이차함수 $y=2x^2$의 그래프를 $y$축의 방향으로 $q$만큼 평행이동한 그래프가 점 $(-2, 5)$를 지날 때, $q$의 값은?」
- goal: 이차함수←stem:「이차함수 $y=2x^2$의 그래프를 $y$축의 방향으로 $q$만큼 평행이동한 그래프가 점 $(-2, 5)$를 지날 때, $q$의 값은?」
- method: 평행(NAMED)←solution:「평행이동한 식은 $y=2x^2+q$이고 점 $(-2, 5)$를 지나므로 $$ 5 = 2(-2)^2 + q = 8 + q \implies q = -3 $$ 따라서 정답은 ③이다.」
- condition: (없음)

**how** Q7번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 y)

<details><summary>저장 해설 (판정 검토용)</summary>

평행이동한 식은 $y=2x^2+q$이고 점 $(-2, 5)$를 지나므로 $$ 5 = 2(-2)^2 + q = 8 + q \implies q = -3 $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3점


**발문**

이차함수 $y=-3(x-4)^2+5$의 그래프의 꼭짓점의 좌표는?

**보기** ① $(4, 5)$  ② $(-4, 5)$  ③ $(4, -5)$  ④ $(-4, -5)$  ⑤ $(3, 5)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y=a(x-p)^2+q$ 꼴에서 꼭짓점의 좌표는 $(p, q)$이므로 $y=-3(x-4)^2+5$의 꼭짓점의 좌표는 $(4, 5)$이다.
2. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=-3(x-4)^2+5$의 그래프의 꼭짓점의 좌표는?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q8번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 y)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q8번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 y)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 y)

**4칸**
- given: 함수←stem:「이차함수 $y=-3(x-4)^2+5$의 그래프의 꼭짓점의 좌표는?」
- goal: 이차함수←stem:「이차함수 $y=-3(x-4)^2+5$의 그래프의 꼭짓점의 좌표는?」
- method: 좌표(NAMED)←solution:「$y=a(x-p)^2+q$ 꼴에서 꼭짓점의 좌표는 $(p, q)$이므로 $y=-3(x-4)^2+5$의 꼭짓점의 좌표는 $(4, 5)$이다.」
- condition: (없음)

**how** Q8번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 y)

<details><summary>저장 해설 (판정 검토용)</summary>

$y=a(x-p)^2+q$ 꼴에서 꼭짓점의 좌표는 $(p, q)$이므로 $y=-3(x-4)^2+5$의 꼭짓점의 좌표는 $(4, 5)$이다. 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

이차함수 $y=-3x^2$의 그래프를 $x$축의 방향으로 $p$만큼, $y$축의 방향으로 $2$만큼 평행이동한 그래프가 이차함수 $y=3(x-4)^2+q$의 그래프와 직선 $y=6$에 대하여 대칭일 때, $p+q$의 값은?

**보기** ① $-14$  ② $14$  ③ $6$  ④ $10$  ⑤ $-6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행이동한 그래프의 식은 $y = -3(x-p)^2 + 2$이다.
2. 이 그래프를 직선 $y=6$에 대하여 대칭이동하면 $$ y = 12 - {-3(x-p)^2 + 2} = 3(x-p)^2 + 10 $$ $y=3(x-4)^2+q$와 일치하므로 $p=4$, $q=10$이다.
3. 따라서 $p+q=14$이므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=-3x^2$의 그래프를 $x$축의 방향으로 $p$만큼, $y$축의 방향으로 $2$만큼 평행이동한 그래프가 이차함수 $y=3(x-4)^2+q$의 그래프와 직선 $y=6$에 대하여 대칭일 때, $p+q$의 값은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q9번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 14)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q9번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 14)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 14)

**4칸**
- given: 함수←stem:「이차함수 $y=-3x^2$의 그래프를 $x$축의 방향으로 $p$만큼, $y$축의 방향으로 $2$만큼 평행이동한 그래프가 이차함수 $y=3(x-4)^2+q$의 그래프와 직선 $y=6$에 대하여 대칭일 때, $p+q$의 값은?」
- goal: 이차함수←stem:「이차함수 $y=-3x^2$의 그래프를 $x$축의 방향으로 $p$만큼, $y$축의 방향으로 $2$만큼 평행이동한 그래프가 이차함수 $y=3(x-4)^2+q$의 그래프와 직선 $y=6$에 대하여 대칭일 때, $p+q$의 값은?」
- method: 그래프(NAMED)←solution:「평행이동한 그래프의 식은 $y = -3(x-p)^2 + 2$이다.」
- condition: (없음)

**how** Q9번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 14)

<details><summary>저장 해설 (판정 검토용)</summary>

평행이동한 그래프의 식은 $y = -3(x-p)^2 + 2$이다. 이 그래프를 직선 $y=6$에 대하여 대칭이동하면 $$ y = 12 - {-3(x-p)^2 + 2} = 3(x-p)^2 + 10 $$ $y=3(x-4)^2+q$와 일치하므로 $p=4$, $q=10$이다. 따라서 $p+q=14$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 5점


**발문**

이차함수 $y=a(x+p)^2+q$의 그래프가 지나는 사분면이 모두 제$1$사분면, 제$2$사분면, 제$4$사분면일 때, 보기 중 옳은 것을 모두 고른 것은? (단, $a\ne 0$, $p\ne 0$, $q\ne 0$)


<보기> ㄱ. $ap > 0$ ㄴ. $ap^2+q \ge 0$ ㄷ. $p+q < 0$ ㄹ. $aq < 0$ ㅁ. 꼭짓점은 제$3$사분면에 위치한다.

**보기** ① ㄱ, ㄴ  ② ㄴ, ㄷ  ③ ㄱ, ㄷ, ㄹ  ④ ㄴ, ㄷ, ㄹ  ⑤ ㄷ, ㄹ, ㅁ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 제$1$, $2$사분면을 지나고 아래로 볼록하므로 $a>0$이고, 제$4$사분면을 지나며 제$3$사분면을 지나지 않으므로 꼭짓점 $(-p, q)$는 제$4$사분면에 있어 $-p>0$($p<0$), $q<0$이다.
2. 또 $x=0$일 때 $y$절편 $ap^2+q \ge 0$이어야 제$3$사분면을 지나지 않는다.
3. 따라서 옳은 것은 ㄴ, ㄷ, ㄹ이므로 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=a(x+p)^2+q$의 그래프가 지나는 사분면이 모두 제$1$사분면, 제$2$사분면, 제$4$사분면일 때, 보기 중 옳은 것을 모두 고른 것은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q10번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ap)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q10번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ap)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 ap)

**4칸**
- given: 함수←stem:「이차함수 $y=a(x+p)^2+q$의 그래프가 지나는 사분면이 모두 제$1$사분면, 제$2$사분면, 제$4$사분면일 때, 보기 중 옳은 것을 모두 고른 것은?」
- goal: 이차함수←stem:「이차함수 $y=a(x+p)^2+q$의 그래프가 지나는 사분면이 모두 제$1$사분면, 제$2$사분면, 제$4$사분면일 때, 보기 중 옳은 것을 모두 고른 것은?」
- method: 사분면(NAMED)←solution:「제$1$, $2$사분면을 지나고 아래로 볼록하므로 $a>0$이고, 제$4$사분면을 지나며 제$3$사분면을 지나지 않으므로 꼭짓점 $(-p, q)$는 제$4$사분면에 있어 $-p>0$($p<0$), $q<0$이다.」
- condition: (없음)

**how** Q10번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ap)

<details><summary>저장 해설 (판정 검토용)</summary>

제$1$, $2$사분면을 지나고 아래로 볼록하므로 $a>0$이고, 제$4$사분면을 지나며 제$3$사분면을 지나지 않으므로 꼭짓점 $(-p, q)$는 제$4$사분면에 있어 $-p>0$($p<0$), $q<0$이다. 또 $x=0$일 때 $y$절편 $ap^2+q \ge 0$이어야 제$3$사분면을 지나지 않는다. 따라서 옳은 것은 ㄴ, ㄷ, ㄹ이므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 이차함수에 대한 설명 중 옳지 않은 것은? ㄱ. $y=-5(x+2)^2$ ㄴ. $y=\dfrac{3}{2}(x-1)^2+4$ ㄷ. $y=2x^2-7$ ㄹ. $y=-\dfrac{1}{3}(x+2)^2+1$

**보기** ① 그래프가 아래로 볼록한 포물선은 ㄴ, ㄷ이다.  ② ㄱ과 ㄹ의 그래프의 축은 같다.  ③ ㄷ의 그래프의 꼭짓점은 $x$축 위에 있다.  ④ 그래프의 폭이 가장 좁은 것은 ㄱ이다.  ⑤ ㄱ의 그래프는 제$3$사분면, 제$4$사분면을 지난다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y=2x^2-7$의 꼭짓점의 좌표는 $(0, -7)$이므로 $x$축 위가 아니라 $y$축 위에 있다.
2. 따라서 옳지 않은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 이차함수에 대한 설명 중 옳지 않은 것은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q11번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 y)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q11번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 y)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 y)

**4칸**
- given: 함수←stem:「다음 이차함수에 대한 설명 중 옳지 않은 것은?」
- goal: 이차함수←stem:「다음 이차함수에 대한 설명 중 옳지 않은 것은?」
- method: 좌표(NAMED)←solution:「$y=2x^2-7$의 꼭짓점의 좌표는 $(0, -7)$이므로 $x$축 위가 아니라 $y$축 위에 있다.」
- condition: (없음)

**how** Q11번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 y)

<details><summary>저장 해설 (판정 검토용)</summary>

ㄷ. $y=2x^2-7$의 꼭짓점의 좌표는 $(0, -7)$이므로 $x$축 위가 아니라 $y$축 위에 있다. 따라서 옳지 않은 것은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

다음은 이차함수 $y=-x^2+8x-10$의 그래프의 꼭짓점의 좌표를 구하는 과정이다. ㉠~㉤ 중 잘못 짝지어진 것은?


$y = -(x^2 - \text{㉠}) - 10$ $= -(x^2 - \text{㉠} + \text{㉡} - \text{㉡}) - 10$ $= -(x - \text{㉢})^2 + \text{㉣} - 10$ $= -(x - \text{㉤})^2 + 6$

**보기** ① ㉠: $-8x$  ② ㉡: $16$  ③ ㉢: $4$  ④ ㉣: $16$  ⑤ ㉤: $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y = -(x^2 - 8x) - 10 = -(x^2 - 8x + 16 - 16) - 10 = -(x-4)^2 + 16 - 10 = -(x-4)^2 + 6$이다.
2. 따라서 ㉠은 $8x$이므로 $-8x$로 짝지어진 ①이 잘못되었다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 이차함수 $y=-x^2+8x-10$의 그래프의 꼭짓점의 좌표를 구하는 과정이다.」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q12번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q12번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 함수←stem:「다음은 이차함수 $y=-x^2+8x-10$의 그래프의 꼭짓점의 좌표를 구하는 과정이다.」
- goal: 이차함수←stem:「다음은 이차함수 $y=-x^2+8x-10$의 그래프의 꼭짓점의 좌표를 구하는 과정이다.」
- method: 함수(NAMED)←stem:「다음은 이차함수 $y=-x^2+8x-10$의 그래프의 꼭짓점의 좌표를 구하는 과정이다.」
- condition: (없음)

**how** Q12번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

$y = -(x^2 - 8x) - 10 = -(x^2 - 8x + 16 - 16) - 10 = -(x-4)^2 + 16 - 10 = -(x-4)^2 + 6$이다. 따라서 ㉠은 $8x$이므로 $-8x$로 짝지어진 ①이 잘못되었다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

이차함수 $y=-x^2+6x-9$의 그래프와 꼭짓점이 같은 그래프의 이차함수 식은?

**보기** ① $y=3(x+3)^2$  ② $y=-2x^2+3$  ③ $y=-(x-3)^2+3$  ④ $y=2(x+3)^2-3$  ⑤ $y=4(x-3)^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $y = -(x^2 - 6x + 9) = -(x-3)^2$이므로 꼭짓점의 좌표는 $(3, 0)$이다.
2. ⑤ $y=4(x-3)^2$의 꼭짓점의 좌표도 $(3, 0)$이므로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=-x^2+6x-9$의 그래프와 꼭짓점이 같은 그래프의 이차함수 식은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q13번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 y)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q13번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 y)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 y)

**4칸**
- given: 함수←stem:「이차함수 $y=-x^2+6x-9$의 그래프와 꼭짓점이 같은 그래프의 이차함수 식은?」
- goal: 이차함수←stem:「이차함수 $y=-x^2+6x-9$의 그래프와 꼭짓점이 같은 그래프의 이차함수 식은?」
- method: 좌표(NAMED)←solution:「$y = -(x^2 - 6x + 9) = -(x-3)^2$이므로 꼭짓점의 좌표는 $(3, 0)$이다.」
- condition: (없음)

**how** Q13번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 y)

<details><summary>저장 해설 (판정 검토용)</summary>

$y = -(x^2 - 6x + 9) = -(x-3)^2$이므로 꼭짓점의 좌표는 $(3, 0)$이다. ⑤ $y=4(x-3)^2$의 꼭짓점의 좌표도 $(3, 0)$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

이차함수 $y=2x^2-3x+4$의 그래프를 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 그래프의 이차함수 식은?

**보기** ① $y=2x^2-11x+15$  ② $y=2x^2-11x+17$  ③ $y=2x^2+5x+3$  ④ $y=2x^2-11x+9$  ⑤ $y=2x^2-3x+3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 11)
2. 주어진 조건을 계산하여 정답 ②을(를) 도출한다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=2x^2-3x+4$의 그래프를 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 그래프의 이차함수 식은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q14번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 11)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q14번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 11)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 11)

**4칸**
- given: 함수←stem:「이차함수 $y=2x^2-3x+4$의 그래프를 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 그래프의 이차함수 식은?」
- goal: 이차함수←stem:「이차함수 $y=2x^2-3x+4$의 그래프를 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 그래프의 이차함수 식은?」
- method: 대입(NAMED)←solution:「$x$ 대신 $x-2$를 대입하고 $-1$을 더하면 $$ y = 2(x-2)^2 - 3(x-2) + 4 - 1 = 2(x^2-4x+4) - 3x + 6 + 3 = 2x^2 - 11x + 17 $$ 따라서 정답은 ②이다.」
- condition: (없음)

**how** Q14번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 11)

<details><summary>저장 해설 (판정 검토용)</summary>

$x$ 대신 $x-2$를 대입하고 $-1$을 더하면 $$ y = 2(x-2)^2 - 3(x-2) + 4 - 1 = 2(x^2-4x+4) - 3x + 6 + 3 = 2x^2 - 11x + 17 $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

두 이차함수 $y=(x+2)^2-5$, $y=x^2+ax+11$의 그래프의 꼭짓점을 각각 $P$, $Q$라 하자. 두 꼭짓점의 $y$좌표가 같고, $Q$가 $P$의 오른쪽에 있으며 색칠한 직사각형의 넓이가 $30$일 때, 상수 $a$의 값은?

**보기** ① $-4$  ② $-6$  ③ $-8$  ④ $8$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $P(-2, -5)$이고, 직사각형의 높이가 $5$, 넓이가 $30$이므로 $PQ = 30\div 5 = 6$이다.
2. $Q$는 $P$의 오른쪽에 있으므로 $Q(4, -5)$이다.
3. $y=x^2+ax+11$의 꼭짓점의 $x$좌표가 $-\dfrac{a}{2}=4$이므로 $a=-8$이다.
4. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 이차함수 $y=(x+2)^2-5$, $y=x^2+ax+11$의 그래프의 꼭짓점을 각각 $P$, $Q$라 하자.」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q15번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ax)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q15번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ax)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ax)

**4칸**
- given: 함수←stem:「두 이차함수 $y=(x+2)^2-5$, $y=x^2+ax+11$의 그래프의 꼭짓점을 각각 $P$, $Q$라 하자.」
- goal: 이차함수←stem:「두 이차함수 $y=(x+2)^2-5$, $y=x^2+ax+11$의 그래프의 꼭짓점을 각각 $P$, $Q$라 하자.」
- method: 사각형(NAMED)←solution:「$P(-2, -5)$이고, 직사각형의 높이가 $5$, 넓이가 $30$이므로 $PQ = 30\div 5 = 6$이다.」
- condition: (없음)

**how** Q15번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ax)

<details><summary>저장 해설 (판정 검토용)</summary>

$P(-2, -5)$이고, 직사각형의 높이가 $5$, 넓이가 $30$이므로 $PQ = 30\div 5 = 6$이다. $Q$는 $P$의 오른쪽에 있으므로 $Q(4, -5)$이다. $y=x^2+ax+11$의 꼭짓점의 $x$좌표가 $-\dfrac{a}{2}=4$이므로 $a=-8$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

이차함수 $y=2x^2$의 그래프 위의 점 $A$와 이차함수 $y=\dfrac{1}{2}x^2$의 그래프 위의 점 $B$에 대하여, 두 점 $A$, $B$의 $y$좌표가 서로 같고 $\overline{AB}=9$를 만족하는 점 $A$의 $x$좌표가 될 수 있는 모든 값의 곱은?

**보기** ① $81$  ② $-81$  ③ $-729$  ④ $729$  ⑤ $243$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $A(t, 2t^2)$, $B\left(s, \dfrac{1}{2}s^2\right)$라 하면 $2t^2 = \dfrac{1}{2}s^2 \implies s^2 = 4t^2$, 즉 $s = \pm 2t$이다.
2. $|s - t| = 9$이므로 $s=2t$일 때 $|t|=9 \implies t=\pm 9$, $s=-2t$일 때 $|3t|=9 \implies t=\pm 3$이다.
3. 따라서 모든 $t$의 곱은 $9\times(-9)\times 3\times(-3) = 729$이므로 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「이차함수 $y=2x^2$의 그래프 위의 점 $A$와 이차함수 $y=\dfrac{1}{2}x^2$의 그래프 위의 점 $B$에 대하여, 두 점 $A$, $B$의 $y$좌표가 서로 같고 $\overline{AB}=9$를 만족하는 점 $A$의 $x$좌표가 될 수 있는 모든 값의 곱은?」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q16번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q16번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 함수←stem:「이차함수 $y=2x^2$의 그래프 위의 점 $A$와 이차함수 $y=\dfrac{1}{2}x^2$의 그래프 위의 점 $B$에 대하여, 두 점 $A$, $B$의 $y$좌표가 서로 같고 $\overline{AB}=9$를 만족하는 점 $A$의 $x$좌표가 될 수 있는 모든 값의 곱은?」
- goal: 이차함수←stem:「이차함수 $y=2x^2$의 그래프 위의 점 $A$와 이차함수 $y=\dfrac{1}{2}x^2$의 그래프 위의 점 $B$에 대하여, 두 점 $A$, $B$의 $y$좌표가 서로 같고 $\overline{AB}=9$를 만족하는 점 $A$의 $x$좌표가 될 수 있는 모든 값의 곱은?」
- method: 모든(NAMED)←solution:「따라서 모든 $t$의 곱은 $9\times(-9)\times 3\times(-3) = 729$이므로 정답은 ④이다.」
- condition: (없음)

**how** Q16번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$A(t, 2t^2)$, $B\left(s, \dfrac{1}{2}s^2\right)$라 하면 $2t^2 = \dfrac{1}{2}s^2 \implies s^2 = 4t^2$, 즉 $s = \pm 2t$이다. $|s - t| = 9$이므로 $s=2t$일 때 $|t|=9 \implies t=\pm 9$, $s=-2t$일 때 $|3t|=9 \implies t=\pm 3$이다. 따라서 모든 $t$의 곱은 $9\times(-9)\times 3\times(-3) = 729$이므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{5}{13}$일 때, $\cos A$의 값은?

**보기** ① $\dfrac{5}{12}$  ② $\dfrac{12}{13}$  ③ $\dfrac{8}{13}$  ④ $\dfrac{12}{5}$  ⑤ $\dfrac{5}{13}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $BC:AC = 5:13$이므로 $AB = \sqrt{13^2-5^2} = 12$이다.
2. 따라서 $\cos A = \dfrac{AB}{AC} = \dfrac{12}{13}$이므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{5}{13}$일 때, $\cos A$의 값은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q17번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q17번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{5}{13}$일 때, $\cos A$의 값은?」
- goal: 직각삼각형←stem:「$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{5}{13}$일 때, $\cos A$의 값은?」
- method: 삼각형(NAMED)←stem:「$\angle B=90^\circ$인 직각삼각형 $ABC$에서 $\sin A=\dfrac{5}{13}$일 때, $\cos A$의 값은?」
- condition: (없음)

**how** Q17번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$BC:AC = 5:13$이므로 $AB = \sqrt{13^2-5^2} = 12$이다. 따라서 $\cos A = \dfrac{AB}{AC} = \dfrac{12}{13}$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림과 같이 $\angle A$가 공통이고 $\angle B=\angle D=90^\circ$인 두 직각삼각형 $ABC$, $ADE$에서 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=6,\mathrm{cm}$, $\overline{DE}=12,\mathrm{cm}$일 때, 옳지 않은 것은?

**보기** ① $\cos E = \cos A$  ② $\triangle ABC \sim \triangle ADE$  ③ $\overline{CE}=10,\mathrm{cm}$  ④ $\sin E = \dfrac{AB}{AC}$  ⑤ $\tan A = \dfrac{3}{4}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $AC = \sqrt{8^2+6^2} = 10,\mathrm{cm}$이고 $\triangle ABC \sim \triangle ADE$($1:2$ 닮음)이므로 $AE=20,\mathrm{cm}$, $CE=10,\mathrm{cm}$이다.
2. $\cos E = \dfrac{6}{10} = \dfrac{3}{5}$, $\cos A = \dfrac{8}{10} = \dfrac{4}{5}$이므로 $\cos E \ne \cos A$이다.
3. 따라서 ①이 옳지 않다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle A$가 공통이고 $\angle B=\angle D=90^\circ$인 두 직각삼각형 $ABC$, $ADE$에서 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=6,\mathrm{cm}$, $\overline{DE}=12,\mathrm{cm}$일 때, 옳지 않은 것은

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\angle A$가 공통이고 $\angle B=\angle D=90^\circ$인 두 직각삼각형 $ABC$, $ADE$에서 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=6,\mathrm{cm}$, $\overline{DE}=12,\mathrm{cm}$일 때, 옳지 않은 것은?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q18번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q18번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「다음 그림과 같이 $\angle A$가 공통이고 $\angle B=\angle D=90^\circ$인 두 직각삼각형 $ABC$, $ADE$에서 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=6,\mathrm{cm}$, $\overline{DE}=12,\mathrm{cm}$일 때, 옳지 않은 것은?」
- goal: 직각삼각형←stem:「다음 그림과 같이 $\angle A$가 공통이고 $\angle B=\angle D=90^\circ$인 두 직각삼각형 $ABC$, $ADE$에서 $\overline{AB}=8,\mathrm{cm}$, $\overline{BC}=6,\mathrm{cm}$, $\overline{DE}=12,\mathrm{cm}$일 때, 옳지 않은 것은?」
- method: 닮음(NAMED)←solution:「$AC = \sqrt{8^2+6^2} = 10,\mathrm{cm}$이고 $\triangle ABC \sim \triangle ADE$($1:2$ 닮음)이므로 $AE=20,\mathrm{cm}$, $CE=10,\mathrm{cm}$이다.」
- condition: (없음)

**how** Q18번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$AC = \sqrt{8^2+6^2} = 10,\mathrm{cm}$이고 $\triangle ABC \sim \triangle ADE$($1:2$ 닮음)이므로 $AE=20,\mathrm{cm}$, $CE=10,\mathrm{cm}$이다. $\cos E = \dfrac{6}{10} = \dfrac{3}{5}$, $\cos A = \dfrac{8}{10} = \dfrac{4}{5}$이므로 $\cos E \ne \cos A$이다. 따라서 ①이 옳지 않다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

다음 그림과 같이 한 모서리의 길이가 $2$인 정육면체 $ABCD-EFGH$에서 $\angle AGE=x$일 때, 다음 중 옳은 것은?

**보기** ① $\overline{EG}=2\sqrt{3}$  ② $\overline{AG}=2\sqrt{2}$  ③ $\tan x = \dfrac{\sqrt{2}}{2}$  ④ $\sin x = \dfrac{1}{2}$  ⑤ $\cos x = \dfrac{\sqrt{2}}{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $EG = \sqrt{2^2+2^2} = 2\sqrt{2}$, $AE=2$이므로 $AG = \sqrt{(2\sqrt{2})^2+2^2} = 2\sqrt{3}$이다.
2. 직각삼각형 $AEG$에서 $\tan x = \dfrac{AE}{EG} = \dfrac{2}{2\sqrt{2}} = \dfrac{\sqrt{2}}{2}$이다.
3. 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 한 모서리의 길이가 $2$인 정육면체 $ABCD-EFGH$에서 $\angle AGE=x$일 때, 다음 중 옳은 것은

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO_APPLICATION(삼각비의 활용) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 한 모서리의 길이가 $2$인 정육면체 $ABCD-EFGH$에서 $\angle AGE=x$일 때, 다음 중 옳은 것은?」
**RPM** M3-RPM-061 [삼각비 > 삼각비의 활용 > 평면도형 > 삼각형의 높이·넓이]
- 이유: Q19번 문항은 M3-RPM-061에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q19번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 길이←stem:「다음 그림과 같이 한 모서리의 길이가 $2$인 정육면체 $ABCD-EFGH$에서 $\angle AGE=x$일 때, 다음 중 옳은 것은?」
- goal: 모서리←stem:「다음 그림과 같이 한 모서리의 길이가 $2$인 정육면체 $ABCD-EFGH$에서 $\angle AGE=x$일 때, 다음 중 옳은 것은?」
- method: 삼각형(NAMED)←solution:「직각삼각형 $AEG$에서 $\tan x = \dfrac{AE}{EG} = \dfrac{2}{2\sqrt{2}} = \dfrac{\sqrt{2}}{2}$이다.」
- condition: (없음)

**how** Q19번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$EG = \sqrt{2^2+2^2} = 2\sqrt{2}$, $AE=2$이므로 $AG = \sqrt{(2\sqrt{2})^2+2^2} = 2\sqrt{3}$이다. 직각삼각형 $AEG$에서 $\tan x = \dfrac{AE}{EG} = \dfrac{2}{2\sqrt{2}} = \dfrac{\sqrt{2}}{2}$이다. 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$2\sqrt{3}\times\tan 45^\circ - 4\times\sin 60^\circ\times\cos 60^\circ$를 계산하면?

**보기** ① $\dfrac{\sqrt{3}}{2}$  ② $2\sqrt{3}$  ③ $3\sqrt{3}$  ④ $\dfrac{3\sqrt{3}}{2}$  ⑤ $\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 45)
2. 주어진 조건을 계산하여 정답 ⑤을(를) 도출한다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$2\sqrt{3}\times\tan 45^\circ - 4\times\sin 60^\circ\times\cos 60^\circ$를 계산하면?」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q20번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 45)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q20번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 45)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 45)

**4칸**
- given: tan←stem:「$2\sqrt{3}\times\tan 45^\circ - 4\times\sin 60^\circ\times\cos 60^\circ$를 계산하면?」
- goal: tan←solution:「$\tan 45^\circ=1$, $\sin 60^\circ=\dfrac{\sqrt{3}}{2}$, $\cos 60^\circ=\dfrac{1}{2}$이므로 $$ 2\sqrt{3}\times 1 - 4\times\dfrac{\sqrt{3}}{2}\times\dfrac{1}{2} = 2\sqrt{3} - \sqrt{3} = \sqrt{3} $$ 따라서 정답은 ⑤이다.」
- method: tan(NAMED)←solution:「$\tan 45^\circ=1$, $\sin 60^\circ=\dfrac{\sqrt{3}}{2}$, $\cos 60^\circ=\dfrac{1}{2}$이므로 $$ 2\sqrt{3}\times 1 - 4\times\dfrac{\sqrt{3}}{2}\times\dfrac{1}{2} = 2\sqrt{3} - \sqrt{3} = \sqrt{3} $$ 따라서 정답은 ⑤이다.」
- condition: (없음)

**how** Q20번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 45)

<details><summary>저장 해설 (판정 검토용)</summary>

$\tan 45^\circ=1$, $\sin 60^\circ=\dfrac{\sqrt{3}}{2}$, $\cos 60^\circ=\dfrac{1}{2}$이므로 $$ 2\sqrt{3}\times 1 - 4\times\dfrac{\sqrt{3}}{2}\times\dfrac{1}{2} = 2\sqrt{3} - \sqrt{3} = \sqrt{3} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 7점


**발문**

[서술형 1] 이차함수 $y=ax^2+bx+c$의 그래프가 꼭짓점이 $P(-1, 4)$이고 점 $(0, 2)$를 지날 때, 상수 $a$, $b$, $c$의 값을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $a=-2,\ b=-4,\ c=2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 꼭짓점이 $P(-1, 4)$이므로 $y = a(x+1)^2 + 4$로 놓는다. (문항 토큰 ax)
2. 점 $(0, 2)$를 지나므로 $2 = a(0+1)^2 + 4 \implies a = -2$이다.
3. 따라서 $y = -2(x+1)^2 + 4 = -2x^2 - 4x + 2$이므로 $a=-2$, $b=-4$, $c=2$이다.
- 작성자 답: $a=-2,\ b=-4,\ c=2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] 이차함수 $y=ax^2+bx+c$의 그래프가 꼭짓점이 $P(-1, 4)$이고 점 $(0, 2)$를 지날 때, 상수 $a$, $b$, $c$의 값을 구하시오.」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q21번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ax)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q21번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ax)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ax)

**4칸**
- given: 함수←stem:「[서술형 1] 이차함수 $y=ax^2+bx+c$의 그래프가 꼭짓점이 $P(-1, 4)$이고 점 $(0, 2)$를 지날 때, 상수 $a$, $b$, $c$의 값을 구하시오.」
- goal: 이차함수←stem:「[서술형 1] 이차함수 $y=ax^2+bx+c$의 그래프가 꼭짓점이 $P(-1, 4)$이고 점 $(0, 2)$를 지날 때, 상수 $a$, $b$, $c$의 값을 구하시오.」
- method: 꼭짓점(NAMED)←solution:「꼭짓점이 $P(-1, 4)$이므로 $y = a(x+1)^2 + 4$로 놓는다.」
- condition: (없음)

**how** Q21번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 $a=-2,\ b=-4,\ c=2$을(를) 바르게 구하였다. (문항 토큰 ax)

<details><summary>저장 해설 (판정 검토용)</summary>

꼭짓점이 $P(-1, 4)$이므로 $y = a(x+1)^2 + 4$로 놓는다. 점 $(0, 2)$를 지나므로 $2 = a(0+1)^2 + 4 \implies a = -2$이다. 따라서 $y = -2(x+1)^2 + 4 = -2x^2 - 4x + 2$이므로 $a=-2$, $b=-4$, $c=2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점


**발문**

[서술형 2] 다음 그림과 같이 이차함수 $y=-\dfrac{1}{2}x^2+2x+4$의 그래프의 꼭짓점을 $A$, $y$축과의 교점을 $B$라 할 때, $\triangle AOB$의 넓이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $4$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $y = -\dfrac{1}{2}(x^2 - 4x) + 4 = -\dfrac{1}{2}(x-2)^2 + 6$이므로 꼭짓점은 $A(2, 6)$이다.
2. $y$축과의 교점은 $x=0$일 때 $B(0, 4)$이다.
3. $OB=4$, 점 $A$에서 $y$축까지의 거리가 $2$이므로 $\triangle AOB = \dfrac{1}{2}\times 4\times 2 = 4$이다.
- 작성자 답: $4$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 이차함수 $y=-\dfrac{1}{2}x^2+2x+4$의 그래프의 꼭짓점을 $A$, $y$축과의 교점을 $B$라 할 때, $\triangle AOB$의 넓이를 구하시오

**단원** M3-04(이차함수와 그래프) / M3-04-QUADRATIC_FUNCTION_GRAPH(이차함수의 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] 다음 그림과 같이 이차함수 $y=-\dfrac{1}{2}x^2+2x+4$의 그래프의 꼭짓점을 $A$, $y$축과의 교점을 $B$라 할 때, $\triangle AOB$의 넓이를 구하시오.」
**RPM** M3-RPM-043 [이차함수 > 이차함수와 그 그래프 > 이차함수의 뜻 > 이차함수 판별]
- 이유: Q22번 문항은 M3-RPM-043에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AOB)
**유형** PT=PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY / TPL=TPL_M3_FIND_VERTEX_FROM_DECREASING_INTERVAL_OF_PARABOLA
- 이유: Q22번 문항은 PT_M3_QUADRATIC_FUNCTION_AXIS_AND_MONOTONICITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AOB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AOB)

**4칸**
- given: 함수←stem:「[서술형 2] 다음 그림과 같이 이차함수 $y=-\dfrac{1}{2}x^2+2x+4$의 그래프의 꼭짓점을 $A$, $y$축과의 교점을 $B$라 할 때, $\triangle AOB$의 넓이를 구하시오.」
- goal: 이차함수←stem:「[서술형 2] 다음 그림과 같이 이차함수 $y=-\dfrac{1}{2}x^2+2x+4$의 그래프의 꼭짓점을 $A$, $y$축과의 교점을 $B$라 할 때, $\triangle AOB$의 넓이를 구하시오.」
- method: 꼭짓점(NAMED)←solution:「$y = -\dfrac{1}{2}(x^2 - 4x) + 4 = -\dfrac{1}{2}(x-2)^2 + 6$이므로 꼭짓점은 $A(2, 6)$이다.」
- condition: (없음)

**how** Q22번 문항으로 M3-04 단원의 기본 개념과 성질을 적용하여 $4$을(를) 바르게 구하였다. (문항 토큰 AOB)

<details><summary>저장 해설 (판정 검토용)</summary>

$y = -\dfrac{1}{2}(x^2 - 4x) + 4 = -\dfrac{1}{2}(x-2)^2 + 6$이므로 꼭짓점은 $A(2, 6)$이다. $y$축과의 교점은 $x=0$일 때 $B(0, 4)$이다. $OB=4$, 점 $A$에서 $y$축까지의 거리가 $2$이므로 $\triangle AOB = \dfrac{1}{2}\times 4\times 2 = 4$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 6점


**발문**

[서술형 3] 다음 그림과 같이 $\angle B=90^\circ$, $\overline{AB}=5$, $\overline{BC}=2$인 직각삼각형 $ABC$에서 $\angle A$의 삼각비($\sin A$, $\cos A$, $\tan A$)의 값을 각각 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\sin A=\dfrac{2\sqrt{29}}{29},\ \cos A=\dfrac{5\sqrt{29}}{29},\ \tan A=\dfrac{2}{5}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 피타고라스 정리에 의해 $AC = \sqrt{5^2+2^2} = \sqrt{29}$이다.
2. 따라서 $$ \sin A = \dfrac{2}{\sqrt{29}} = \dfrac{2\sqrt{29}}{29}, \qquad \cos A = \dfrac{5}{\sqrt{29}} = \dfrac{5\sqrt{29}}{29}, \qquad \tan A = \dfrac{2}{5} $$ 이다.
- 작성자 답: $\sin A=\dfrac{2\sqrt{29}}{29},\ \cos A=\dfrac{5\sqrt{29}}{29},\ \tan A=\dfrac{2}{5}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\angle B=90^\circ$, $\overline{AB}=5$, $\overline{BC}=2$인 직각삼각형 $ABC$에서 $\angle A$의 삼각비($\sin A$, $\cos A$, $\tan A$)의 값을 각각 구하시오

**단원** M3-05(삼각비) / M3-05-TRIG_RATIO(삼각비) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] 다음 그림과 같이 $\angle B=90^\circ$, $\overline{AB}=5$, $\overline{BC}=2$인 직각삼각형 $ABC$에서 $\angle A$의 삼각비($\sin A$, $\cos A$, $\tan A$)의 값을 각각 구하시오.」
**RPM** M3-RPM-055 [삼각비 > 삼각비 > 삼각비의 뜻 > sin·cos·tan]
- 이유: Q23번 문항은 M3-RPM-055에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_TRIG_RATIO / TPL=TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION
- 이유: Q23번 문항은 PT_TRIG_RATIO 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「[서술형 3] 다음 그림과 같이 $\angle B=90^\circ$, $\overline{AB}=5$, $\overline{BC}=2$인 직각삼각형 $ABC$에서 $\angle A$의 삼각비($\sin A$, $\cos A$, $\tan A$)의 값을 각각 구하시오.」
- goal: 직각삼각형←stem:「[서술형 3] 다음 그림과 같이 $\angle B=90^\circ$, $\overline{AB}=5$, $\overline{BC}=2$인 직각삼각형 $ABC$에서 $\angle A$의 삼각비($\sin A$, $\cos A$, $\tan A$)의 값을 각각 구하시오.」
- method: 피타고라스정리(NAMED)←solution:「피타고라스 정리에 의해 $AC = \sqrt{5^2+2^2} = \sqrt{29}$이다.」
- condition: (없음)

**how** Q23번 문항으로 M3-05 단원의 기본 개념과 성질을 적용하여 $\sin A=\dfrac{2\sqrt{29}}{29},\ \cos A=\dfrac{5\sqrt{29}}{29},\ \tan A=\dfrac{2}{5}$을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

피타고라스 정리에 의해 $AC = \sqrt{5^2+2^2} = \sqrt{29}$이다. 따라서 $$ \sin A = \dfrac{2}{\sqrt{29}} = \dfrac{2\sqrt{29}}{29}, \qquad \cos A = \dfrac{5}{\sqrt{29}} = \dfrac{5\sqrt{29}}{29}, \qquad \tan A = \dfrac{2}{5} $$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
