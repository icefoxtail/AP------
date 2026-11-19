# 검수 묶음 — 26_동산중_1학기_기말_중2_유사

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 24개 / 검사 PASS 24, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 23, SELF_CONTAINED 1
- 난이도 분포: 1단계 11, 2단계 9, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q6**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q10**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q11**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q12**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q13**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q17**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q18**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q19**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q20**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q21**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q24**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

---
## Q1 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 두 변수 $x, y$에 대하여 $y$가 $x$의 함수가 아닌 것은? [4점]

**보기** ① 한 자루에 $600$원인 색연필 $x$자루의 가격 $y$원  ② 자연수 $x$의 배수 $y$  ③ 시속 $50\text{ km}$로 $x$시간 동안 달린 거리 $y\text{ km}$  ④ 현재 나이가 $14$세인 학생의 $x$년 후의 나이 $y$세  ⑤ $200\text{ mL}$의 우유를 매초 $5\text{ mL}$씩 마실 때, $x$초 후 남은 우유의 양 $y\text{ mL}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 색연필 600원 x자루의 가격 y=600x는 일대일 함수이다.
2. ② 반면 자연수 x의 배수 y는 x=14일 때 14, 28, 42 등으로 y가 오직 하나로 정해지지 않는다.
3. ③ 시속 50 km 거리 y=50x, ④ 14세 학생의 나이 y=x+14, ⑤ 200 mL 우유 y=200-5x는 모두 함수이다.
4. 따라서 y가 x의 함수가 아닌 것은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「$y$가 $x$의 함수가 아닌 것은?」
**RPM** M2-RPM-165 [일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 일차함수 판별] **원천→판정: 일차함수 > 일차함수와 그래프 > 함수의 뜻과 함숫값 > 함수의 뜻 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 일차함수 판별**
- 이유: 색연필 600원 가격 y=600x와 자연수 x의 배수 대응에서 함수 여부를 판별하는 일차함수 판별/함수 뜻 행이다.
**유형** PT=PT_FUNCTION_DEFINITION_JUDGMENT / TPL=TPL_FUNCTION_JUDGMENT_MAPPING **원천→판정: PT_M2_FUNCTION_CONCEPT → PT_FUNCTION_DEFINITION_JUDGMENT** **원천→판정: TPL_FUNCTION_UNIQUENESS_PROPERTY → TPL_FUNCTION_JUDGMENT_MAPPING**
- 이유: 600x나 50x와 달리 자연수 x의 배수 y는 x=14일 때 대응하는 y값이 유일하지 않아 함수가 아님을 판정하는 단계이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 색연필 600원 및 50 km 등 각 보기에 대해 함수 정의를 즉시 적용하는 기본 1단계 문항이다.

**4칸**
- given: 자연수←choices:「자연수 $x$의 배수 $y$」
- goal: 함수←stem:「$y$가 $x$의 함수가 아닌 것은?」
- method: 대응(NAMED)←solution:「오직 하나씩 정해지는 대응 관계이다.」
- condition: (없음)

**how** 색연필 600원이나 시속 50 km와 달리 자연수 x의 배수 y는 x=14일 때 y가 여러 개 존재하므로 함수가 아님을 확인하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

함수는 $x$의 각 값에 대하여 $y$의 값이 오직 하나씩 정해지는 대응 관계이다.
① 색연필 $x$자루의 가격은 $y = 600x$로 $x$의 값에 따라 $y$가 오직 하나로 결정된다. (함수)
② 자연수 $x=2$의 배수는 $2, 4, 6, 8, \dots$과 같이 무수히 많으므로 $x$의 값 하나에 $y$의 값이 오직 하나로 정해지지 않는다. (함수가 아님)
③ 거리는 속력과 시간의 곱이므로 $y = 50x$로 오직 하나로 결정된다. (함수)
④ 나이는 $y = x + 14$로 오직 하나로 결정된다. (함수)
⑤ 남은 양은 $y = 200 - 5x$로 오직 하나로 결정된다. (함수)


따라서 $y$가 $x$의 함수가 아닌 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

함수 $f(x) = 2x - 1$에 대하여 $f(4)$의 값은? [3점]

**보기** ① 4  ② 5  ③ 6  ④ 7  ⑤ 8

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 함수식 f(x) = 2x - 1 에 x = 4 를 대입한다.
2. f(4) = 2 * 4 - 1 = 8 - 1 = 7 이다.
3. 따라서 정답은 ④(7)이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「함수 $f(x) = 2x - 1$에 대하여」
**RPM** M2-RPM-164 [일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 함숫값] **원천→판정: 일차함수 > 일차함수와 그래프 > 함수의 뜻과 함숫값 > 함숫값 구하기 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 함숫값**
- 이유: 함수 f(x) = 2x - 1 에 x = 4 를 대입하여 함숫값 f(4) = 7 을 산출하는 일차함수 뜻 함숫값 행이다.
**유형** PT=PT_FUNCTION_VALUE / TPL=TPL_FUNCTION_VALUE_DIRECT **원천→판정: PT_M2_FUNCTION_VALUE → PT_FUNCTION_VALUE** **원천→판정: TPL_FUNCTION_VALUE_SUBSTITUTION → TPL_FUNCTION_VALUE_DIRECT**
- 이유: f(x) = 2x - 1 에서 x = 4 대입으로 f(4) = 7 을 직접 구하는 직접 함숫값 계산 템플릿이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 함수식 f(x) = 2x - 1 에 x = 4 를 단순 대입하여 7 을 구하는 1단계 기본 연산 문항이다.

**4칸**
- given: 함수←stem:「함수 $f(x) = 2x - 1$에 대하여」
- goal: 함숫값←stem:「$f(4)$의 값은?」
- method: 대입(NAMED)←solution:「$x = 4$를 대입하여 계산한다.」
- condition: (없음)

**how** f(x) = 2x - 1 에 x = 4 를 직접 대입하여 7 을 얻고 ④와 일치함을 확인하여 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

함수식 $f(x) = 2x - 1$에 $x = 4$를 대입하여 계산한다.
$$
f(4) = 2 \times 4 - 1 = 8 - 1 = 7
$$
따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 중 $y$가 $x$에 대한 일차함수인 것은? [3점]

**보기** ① $y = 3x - 5$  ② $y = \dfrac{2}{x}$  ③ $y = x^2 - 4$  ④ $y = 2x - (2x + 3)$  ⑤ $y = x(x - 2)$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 일차함수는 y = ax + b (a != 0) 꼴로 나타내어지는 함수이다.
2. ① y = 3x - 5 는 a=3, b=-5 로 y = ax + b 형태를 만족하여 일차함수이다.
3. ④ y = 2x - (2x + 3) = -3 은 일차항 ax 가 소거되므로 일차함수가 아니다.
4. 따라서 일차함수인 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「$y$가 $x$에 대한 일차함수인 것은?」
**RPM** M2-RPM-165 [일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 일차함수 판별] **원천→판정: 일차함수 > 일차함수와 그래프 > 일차함수의 뜻과 그래프 > 일차함수의 뜻 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 뜻 > 일차함수 판별**
- 이유: y = ax + b (a != 0) 형태인지 각 보기를 판별하는 일차함수의 뜻 일차함수 판별 행이다.
**유형** PT=PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION / TPL=TPL_M2_COUNT_VALID_FUNCTIONS_AND_LINEAR_FUNCTIONS **원천→판정: PT_M2_LINEAR_FUNCTION_DEFINITION → PT_M2_FUNCTION_AND_LINEAR_FUNCTION_IDENTIFICATION** **원천→판정: TPL_LINEAR_FUNCTION_IDENTIFICATION → TPL_M2_COUNT_VALID_FUNCTIONS_AND_LINEAR_FUNCTIONS**
- 이유: 보기들을 동류항 정리하여 y = ax + b 꼴인 y = 3x - 5 를 골라내는 판별 단계이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 식의 우변이 y = ax + b 일차식인지 형태를 보고 바로 고르는 1단계 기본 판별 문항이다.

**4칸**
- given: 상수←solution:「$a, b$는 상수」
- goal: 일차함수←stem:「$y$가 $x$에 대한 일차함수인 것은?」
- method: 일차식(NAMED)←solution:「$x$에 대한 일차식이므로」
- condition: (없음)

**how** 각 식을 정리하여 ax 일차항이 살아있는 y = 3x - 5 가 일차함수임을 확인하고 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

일차함수는 우변을 정리했을 때 $y = ax + b$ ($a, b$는 상수, $a \ne 0$)의 꼴로 나타내어지는 함수이다.
① $y = 3x - 5$는 $x$에 대한 일차식이므로 일차함수이다. (참)
② $y = \dfrac{2}{x}$는 분모에 미지수 $x$가 있으므로 다항식이 아니며 일차함수가 아니다. (반비례 관계)
③ $y = x^2 - 4$는 $x^2$ 항이 있으므로 이차함수이다.
④ $y = 2x - (2x + 3) = 2x - 2x - 3 = -3$은 상수함수이므로 일차함수가 아니다.
⑤ $y = x(x - 2) = x^2 - 2x$는 이차함수이다.


따라서 일차함수인 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차함수 $y = 4x$의 그래프를 $y$축의 방향으로 $-5$만큼 평행이동한 직선의 식은? [3점]

**보기** ① $y = 4x + 5$  ② $y = -5x + 4$  ③ $y = 4x - 5$  ④ $y = -5x$  ⑤ $y = -4x - 5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 일차함수 y = ax 그래프를 y축 방향으로 b만큼 평행이동하면 식은 y = ax + b 가 된다.
2. y = 4x 를 y축 방향으로 -5 만큼 평행이동하면 a=4, b=-5 가 된다.
3. 따라서 구하는 식은 y = 4x - 5 이며 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = 4x$의 그래프를 $y$축의 방향으로 $-5$만큼 평행이동한 직선의 식은?」
**RPM** M2-RPM-168 [일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치] **원천→판정: 일차함수 > 일차함수와 그래프 > 일차함수의 그래프 > 일차함수의 그래프의 평행이동 → 일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치**
- 이유: y = ax 의 그래프를 평행이동하여 식을 구하는 일차함수 그래프의 평행·일치 행이다.
**유형** PT=PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION / TPL=TPL_M2_FIND_VERTICAL_SHIFT_PASSING_THROUGH_POINT **원천→판정: PT_M2_LINEAR_TRANSLATION → PT_M2_LINEAR_FUNCTION_VERTICAL_TRANSLATION** **원천→판정: TPL_LINEAR_TRANSLATION_Y_AXIS → TPL_M2_FIND_VERTICAL_SHIFT_PASSING_THROUGH_POINT**
- 이유: 기본형 y = ax 인 y = 4x 를 y축 방향으로 -5 만큼 평행이동하여 y = 4x - 5 를 결정하는 단계이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: y = ax 그래프의 평행이동 공식 y = ax + b 에 바로 대입하는 1단계 기본 공식 문항이다.

**4칸**
- given: 일차함수←stem:「일차함수 $y = 4x$의 그래프를」
- goal: 직선←stem:「평행이동한 직선의 식은?」
- method: 평행이동(NAMED)←solution:「방향으로 $b$만큼 평행이동하면」
- condition: (없음)

**how** y = ax 식을 y축 방향 평행이동 공식에 따라 y = 4x - 5 로 결정하고 ③과 대조하여 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

일차함수 $y = ax$의 그래프를 $y$축의 방향으로 $b$만큼 평행이동하면 식은 $y = ax + b$가 된다.
따라서 일차함수 $y = 4x$의 그래프를 $y$축의 방향으로 $-5$만큼 평행이동한 직선의 식은
$$
y = 4x - 5
$$
이다.
정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차함수 $y = 2x + 4$의 그래프의 $y$절편을 $a$, 기울기를 $b$라 할 때, $a + b$의 값은? [3점]

**보기** ① 2  ② 3  ③ 4  ④ 5  ⑤ 6

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 일차함수 y = 2x + 4 에서 x의 계수가 기울기이므로 b = 2 이다.
2. 상수항이 y절편이므로 a = 4 이다.
3. 따라서 a + b = 4 + 2 = 6 이며 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = 2x + 4$의 그래프의 $y$절편을 $a$, 기울기를 $b$라 할 때」
**RPM** M2-RPM-166 [일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편] **원천→판정: 일차함수 > 일차함수와 그래프 > 일차함수의 그래프 > 기울기와 y절편 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편**
- 이유: y = 2x + 4 에서 기울기 b=2 와 y절편 a=4 를 읽어내는 일차함수의 그래프 기울기·절편 행이다.
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT **원천→판정: PT_M2_SLOPE_INTERCEPT_SUM → PT_FUNCTION_GRAPH_PROPERTIES** **원천→판정: TPL_LINEAR_COEFFICIENTS_READING → TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT**
- 이유: 식 y = 2x + 4 의 계수와 상수항에서 기울기 2 와 y절편 4 를 파악하여 a+b=6 을 구하는 성질 판정 단계이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 식 y = 2x + 4 에서 a=4, b=2 를 읽고 4+2=6 을 덧셈하는 1단계 기본 문항이다.

**4칸**
- given: 일차함수←stem:「일차함수 $y = 2x + 4$의 그래프의」
- goal: 기울기←stem:「$y$절편을 $a$, 기울기를 $b$라 할 때, $a + b$의 값은?」
- method: y절편(NAMED)←solution:「상수항이 $y$절편이므로 $a = 4$이다.」
- condition: (없음)

**how** y = 2x + 4 에서 y절편 a=4 와 기울기 b=2 를 구해 a+b=6 으로 ⑤를 골랐다.

<details><summary>저장 해설 (판정 검토용)</summary>

일차함수 $y = 2x + 4$에서
- $x$의 계수가 기울기이므로 $b = 2$이다.
- 상수항이 $y$절편이므로 $a = 4$이다.
따라서 구하는 값은
$$
a + b = 4 + 2 = 6
$$
정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

일차함수 $y = -3x + 6$의 그래프에 대한 설명으로 옳은 것은? [4점]

**보기** ① $x$절편은 $-2$이다.  ② $y = -3x$의 그래프와 평행하다.  ③ $y$축과의 교점의 좌표는 $(0, -6)$이다.  ④ $x$의 값이 증가할 때 $y$의 값도 증가한다.  ⑤ 제3사분면을 지난다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 일차함수 y = -3x + 6 에서 기울기는 -3 이고 y절편은 6 이다.
2. y = -3x 의 그래프는 기울기가 -3 이고 y절편이 0 이므로 기울기가 같고 y절편이 달라 평행하다.
3. x절편은 2 이고 제3사분면은 지나지 않으므로 옳은 설명은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = -3x + 6$의 그래프에 대한 설명으로 옳은 것은?」
**RPM** M2-RPM-168 [일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치] **원천→판정: 일차함수 > 일차함수와 그래프 > 일차함수의 그래프의 성질 > 일차함수의 그래프의 평행과 일치 → 일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치**
- 이유: y = -3x + 6 과 y = -3x 의 기울기가 -3 으로 같아 평행함을 판별하는 일차함수 그래프 평행·일치 행이다.
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT **원천→판정: PT_M2_LINEAR_PROPERTIES → PT_FUNCTION_GRAPH_PROPERTIES** **원천→판정: TPL_LINEAR_FUNCTION_MULTI_PROPERTIES → TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT**
- 이유: 기울기 -3 과 y절편 6 및 x절편 2 를 종합하여 y = -3x 와의 평행성을 참으로 고르는 성질 판정 단계이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: y = -3x + 6 의 절편 6, 2 및 기울기 -3 과 사분면 통과 여부 등 5개 보기를 각각 점검해야 하는 2단계 문항이다.

**4칸**
- given: 기울기←solution:「기울기는 $-3$」
- goal: 그래프←stem:「그래프에 대한 설명으로 옳은 것은?」
- method: 평행(NAMED)←choices:「$y = -3x$의 그래프와 평행하다.」
- condition: (없음)

**how** y = -3x + 6 의 기울기 -3 이 y = -3x 와 같아 평행함을 확인하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

일차함수 $y = -3x + 6$의 성질을 분석한다.
- 기울기는 $-3$, $y$절편은 $6$이다.
- $x$절편은 $y=0$일 때 $0 = -3x + 6 \implies x = 2$이므로 $x$절편은 $2$이다. (①은 거짓)
- 기울기가 $-3$으로 같고 $y$절편이 다르므로 $y = -3x$의 그래프와 평행하다. (②는 참)
- $y$축과의 교점의 좌표는 $(0, 6)$이다. (③은 거짓)
- 기울기가 음수이므로 $x$의 값이 증가할 때 $y$의 값은 감소한다. (④는 거짓)
- $x$절편이 $2$ (양수), $y$절편이 $6$ (양수)이므로 제$1$, $2$, $4$사분면을 지나고 제$3$사분면은 지나지 않는다. (⑤는 거짓)


따라서 옳은 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차함수 $y = ax + b$의 그래프에서 $x$의 값이 $3$만큼 증가할 때 $y$의 값은 $2$만큼 감소한다. $x$의 값이 $-3$에서 $6$까지 증가할 때, $y$의 값의 증가량은? [4점]

**보기** ① $-6$  ② $-4$  ③ $-2$  ④ $4$  ⑤ $6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. y = ax + b 에서 기울기는 x의 증가량에 대한 y의 증가량의 비율이다.
2. x가 3 증가할 때 y가 2 감소하므로 기울기 a = -2/3 이다.
3. x가 -3에서 6까지 9만큼 증가할 때 ax 항의 y 증가량은 (-2/3) * 9 = -6 이다.
4. 따라서 정답은 ①(-6)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = ax + b$의 그래프에서 $x$의 값이 $3$만큼 증가할 때」
**RPM** M2-RPM-166 [일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편] **원천→판정: 일차함수 > 일차함수와 그래프 > 일차함수의 그래프 > 기울기의 뜻 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편**
- 이유: y = ax + b 에서 x와 y의 변화량으로 기울기 a=-2/3 를 구하고 새 변화량을 계산하는 기울기·절편 행이다.
**유형** PT=PT_FUNCTION_GRAPH_PROPERTIES / TPL=TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT **원천→판정: PT_M2_RATE_OF_CHANGE → PT_FUNCTION_GRAPH_PROPERTIES** **원천→판정: TPL_SLOPE_CHANGE_PROPORTIONALITY → TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT**
- 이유: 기울기 a = -2/3 를 구하고 x의 증가량 9 를 곱해 ax 변화량 -6 을 산출하는 성질 판정 단계이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기울기 a=-2/3 를 먼저 구한 뒤 x의 변화량 9를 적용하여 ax 관련 증가량 -6 을 구하는 2단계 문항이다.

**4칸**
- given: 기울기←solution:「일차함수의 기울기를 구한다.」
- goal: 증가←stem:「$y$의 값의 증가량은?」
- method: 변화량(NAMED)←solution:「$x$의 증가량은」
- condition: (없음)

**how** y = ax + b 의 기울기 a=-2/3 를 구하고 x 증가량 9에 곱해 y 증가량이 -6 임을 확인하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. 일차함수의 기울기를 구한다.
$x$의 값이 $3$만큼 증가할 때 $y$의 값은 $2$만큼 감소하므로
$$
\text{기울기 } a = \frac{\Delta y}{\Delta x} = \frac{-2}{3} = -\frac{2}{3}
$$
2. $x$의 값이 $-3$에서 $6$까지 증가할 때 $x$의 증가량은
$$
\Delta x = 6 - (-3) = 9
$$
3. $y$의 값의 증가량은
$$
\Delta y = a \times \Delta x = -\frac{2}{3} \times 9 = -6
$$
따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

일차함수 $y = ax + b$의 그래프는 $y = -3x + 4$의 그래프와 평행하고, $y = 2x - 3$의 그래프와 $y$축 위에서 만난다. 이때 상수 $a, b$에 대하여 $ab$의 값은? [4점]

**보기** ① $-9$  ② $-6$  ③ $6$  ④ $9$  ⑤ $12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. y = ax + b 가 y = -3x + 4 와 평행하므로 기울기 a = -3 이다.
2. y = 2x - 3 과 y축 위에서 만나므로 y절편 b = -3 이다.
3. 상수 a, b에 대하여 곱 ab = (-3) * (-3) = 9 이므로 정답은 ④(9)이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = ax + b$의 그래프는 $y = -3x + 4$의 그래프와 평행하고」
**RPM** M2-RPM-168 [일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치] **원천→판정: 일차함수 > 일차함수와 그래프 > 일차함수의 식 구하기 > 기울기와 y절편이 주어진 일차함수의 식 → 일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치**
- 이유: y = ax + b 가 평행 조건에서 a=-3 을 갖고 y축 교점에서 b=-3 을 얻는 그래프의 평행·일치 행이다.
**유형** PT=PT_LINE_RELATION / TPL=TPL_RELATION_PARALLEL_PARAMETER **원천→판정: PT_M2_LINE_FORMULATION_CONDITIONS → PT_LINE_RELATION** **원천→판정: TPL_PARALLEL_AND_INTERCEPT_PRODUCT → TPL_RELATION_PARALLEL_PARAMETER**
- 이유: 평행 조건에서 a=-3 과 y축 절편 일치로 b=-3 을 구하여 ab = 9 를 계산하는 매개변수 결정 단계이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행 조건 a=-3 과 절편 일치 b=-3 을 각각 연계하여 곱 ab = 9 를 산출하는 2단계 문항이다.

**4칸**
- given: 평행←stem:「그래프와 평행하고」
- goal: 곱←solution:「상수 $a, b$의 곱은」
- method: y절편(NAMED)←solution:「$y$축 위에서 만나므로 $y$절편이 같다.」
- condition: (없음)

**how** y = ax + b 에서 평행 조건 a=-3 과 y축 교점 b=-3 을 구해 ab = 9 로 ④를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. $y = ax + b$의 그래프가 $y = -3x + 4$의 그래프와 평행하므로 기울기가 같다.
$$
a = -3
$$
2. $y = ax + b$의 그래프가 $y = 2x - 3$의 그래프와 $y$축 위에서 만나므로 $y$절편이 같다.
$$
b = -3
$$
3. 두 상수 $a, b$의 곱은
$$
ab = (-3) \times (-3) = 9
$$
따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$x$절편이 $-3$이고 $y$절편이 $-6$인 일차함수의 식은? [4점]

**보기** ① $y = 2x - 6$  ② $y = -2x + 6$  ③ $y = -2x - 6$  ④ $y = -\dfrac{1}{2}x - 6$  ⑤ $y = -\dfrac{1}{2}x + 6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. x절편이 -3, y절편이 -6 이므로 두 점 (-3, 0)과 (0, -6)을 지난다.
2. 기울기 a = (-6 - 0) / (0 - (-3)) = -6/3 = -2 이다.
3. y절편이 -6 이므로 일차함수의 식은 y = -2x - 6 이며 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x$절편이 $-3$이고 $y$절편이 $-6$인 일차함수의 식은?」
**RPM** M2-RPM-170 [일차함수 > 일차함수와 그 그래프 > 식 구하기 > 두 점으로 식 구하기] **원천→판정: 일차함수 > 일차함수와 그래프 > 일차함수의 식 구하기 > x절편과 y절편이 주어진 일차함수의 식 → 일차함수 > 일차함수와 그 그래프 > 식 구하기 > 두 점으로 식 구하기**
- 이유: 두 점 (-3, 0)과 (0, -6)의 좌표를 이용하여 직선의 식 y = -2x - 6 을 구하는 두 점으로 식 구하기 행이다.
**유형** PT=PT_LINE_EQUATION / TPL=TPL_LINE_TWO_POINTS **원천→판정: PT_M2_LINE_FROM_INTERCEPTS → PT_LINE_EQUATION** **원천→판정: TPL_TWO_INTERCEPTS_LINEAR_EQUATION → TPL_LINE_TWO_POINTS**
- 이유: 두 점 (-3, 0), (0, -6)에서 기울기 -2 와 y절편 -6 을 얻어 y = -2x - 6 을 구하는 두 점 공식 템플릿이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: x절편 -3 과 y절편 -6 에서 기울기 a=-2 를 즉시 산출하고 y = -2x - 6 을 쓰는 1단계 문항이다.

**4칸**
- given: x절편←stem:「$x$절편이 $-3$이고」
- goal: 일차함수←stem:「$y$절편이 $-6$인 일차함수의 식은?」
- method: 기울기(NAMED)←solution:「\text{기울기 } a = \frac{-6 - 0}{0 - (-3)}」
- condition: (없음)

**how** 두 절편 (-3, 0)과 (0, -6)으로 기울기 a=-2 를 구하고 y = -2x - 6 으로 ③을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x$절편이 $-3$, $y$절편이 $-6$이므로 그래프는 두 점 $(-3, 0)$과 $(0, -6)$을 지난다.
기울기는
$$
\text{기울기 } a = \frac{-6 - 0}{0 - (-3)} = \frac{-6}{3} = -2
$$
$y$절편이 $-6$이므로 구하는 일차함수의 식은
$$
y = -2x - 6
$$
이다.
정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

일차함수 $y = ax + b$의 그래프가 제$4$사분면을 지나지 않을 때, 일차함수 $y = -\dfrac{b}{a}x + b$의 그래프가 지나지 않는 사분면은? [4.5점]

**보기** ① 제1사분면  ② 제2사분면  ③ 제4사분면  ④ 제1, 2사분면  ⑤ 제3사분면

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. y = ax + b 가 제4사분면을 지나지 않으므로 기울기 a > 0 이고 y절편 b > 0 이다.
2. 일차함수 y = -(b/a)x + b 에서 기울기는 -b/a < 0 이고 y절편은 b > 0 이다.
3. 기울기가 음수이고 y절편이 양수인 직선은 제1, 2, 4사분면을 지나므로 지나지 않는 사분면은 제3사분면(⑤)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차함수 $y = ax + b$의 그래프가 제$4$사분면을 지나지 않을 때」
**RPM** M2-RPM-166 [일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편] **원천→판정: 일차함수 > 일차함수와 그래프 > 일차함수의 그래프의 성질 > a, b의 부호와 일차함수의 그래프 → 일차함수 > 일차함수와 그 그래프 > 일차함수의 그래프 > 기울기·절편**
- 이유: y = ax + b 의 사분면 조건으로 기울기 a와 절편 b의 부호를 판정하는 일차함수 그래프 기울기·절편 행이다.
**유형** PT=PT_FUNCTION_GRAPH_QUADRANT / TPL=TPL_FUNCTION_QUADRANT_FROM_OTHER_FUNCTION **원천→판정: PT_M2_QUADRANT_ANALYSIS → PT_FUNCTION_GRAPH_QUADRANT** **원천→판정: TPL_QUADRANT_SIGN_ANALYSIS_LINEAR → TPL_FUNCTION_QUADRANT_FROM_OTHER_FUNCTION**
- 이유: 주어진 y = ax + b 의 사분면 통과 조건으로부터 a>0, b>0 을 도출하고 새 함수의 사분면을 판정하는 템플릿이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: y = ax + b 에서 a>0, b>0 부호를 정하고 새 함수의 사분면 개형을 추론하는 4.5점 배점의 2단계 추론 문항이다.

**4칸**
- given: 기울기←solution:「오른쪽 위로 향해야 하므로 기울기 $a > 0$이다.」
- goal: 사분면←stem:「지나지 않는 사분면은?」
- method: y절편(NAMED)←solution:「$y$축의 양의 부분을 지나야 하므로 $y$절편 $b > 0$이다.」
- condition: (없음)

**how** y = ax + b 에서 a>0, b>0 을 얻고 -b/a < 0, b > 0 이 제3사분면을 지나지 않음을 파악하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. $y = ax + b$의 그래프가 제$4$사분면을 지나지 않으려면
- 오른쪽 위로 향해야 하므로 기울기 $a > 0$이다.
- $y$축의 양의 부분을 지나야 하므로 $y$절편 $b > 0$이다. (만약 $b \le 0$이면 제$4$사분면을 지나게 된다.)
따라서
$$
a > 0, \quad b > 0
$$
2. 이제 일차함수 $y = -\dfrac{b}{a}x + b$의 그래프를 분석한다.
- 기울기는 $-\dfrac{b}{a}$이고, $a > 0, b > 0$이므로 $-\dfrac{b}{a} < 0$ (음수)이다.
- $y$절편은 $b > 0$ (양수)이다.
3. 기울기가 음수이고 $y$절편이 양수인 직선은 오른쪽 아래로 향하며 $y$축의 양의 부분을 지나므로,
제$1$사분면, 제$2$사분면, 제$4$사분면을 지나고 제$3$사분면은 지나지 않는다.


따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

가로의 길이가 $20\text{ cm}$, 세로의 길이가 $8\text{ cm}$인 직사각형 $ABCD$에서 점 $P$는 점 $B$를 출발하여 변 $BC$를 따라 점 $C$까지 매초 $2\text{ cm}$의 속력으로 움직인다. 점 $P$가 출발한 지 $x$초 후의 사다리꼴 $APCD$의 넓이를 $y\text{ cm}^2$라 할 때, 보기에서 옳은 것만을 있는 대로 고른 것은? [5점]


$$
\begin{aligned}
&\text{ㄱ. } y = -8x + 160 \
&\text{ㄴ. 사다리꼴의 넓이는 } 1\text{초에 } 8\text{ cm}^2\text{씩 줄어든다.} \
&\text{ㄷ. 사다리꼴 } APCD\text{의 넓이가 } 100\text{ cm}^2\text{가 되는 것은 점 } P\text{가 출발한 지 } 8\text{초 후이다.}
\end{aligned}
$$

**보기** ① ㄱ  ② ㄱ, ㄴ  ③ ㄱ, ㄷ  ④ ㄴ, ㄷ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직사각형 ABCD 전체 넓이는 20 * 8 = 160 cm^2 이다.
2. x초 후 BP = 2x cm 이므로 직각삼각형 ABP 의 넓이는 (1/2) * 2x * 8 = 8x cm^2 이다.
3. 사다리꼴 APCD 넓이는 y = 160 - 8x = -8x + 160 이므로 ㄱ은 참이다.
4. x가 1초 증가할 때마다 넓이는 8 cm^2 씩 줄어들므로 ㄴ도 참이다.
5. y = 100 일 때 100 = -8x + 160 에서 8x = 60, x = 7.5 초이므로 ㄷ은 거짓이다.
6. 따라서 옳은 것은 ㄱ, ㄴ (②)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_APPLICATION → M2-04-LINEAR_FUNCTION_BASIC**
- 근거 인용: 「사다리꼴 $APCD$의 넓이를 $y\text{ cm}^2$라 할 때, 보기에서 옳은 것만을 있는 대로 고른 것은?」
**RPM** M2-RPM-176 [일차함수 > 일차함수와 일차방정식의 관계 > 그래프 활용 > 넓이] **원천→판정: 일차함수 > 일차함수의 활용 > 일차함수의 활용 > 도형에서의 일차함수의 활용 → 일차함수 > 일차함수와 일차방정식의 관계 > 그래프 활용 > 넓이**
- 이유: 직사각형 ABCD 에서 점 P 의 이동에 따라 변하는 사다리꼴 APCD 의 넓이 y = -8x + 160 을 다루는 넓이 활용 행이다.
**유형** PT=PT_FUNCTION_GRAPH_GEOMETRY / TPL=TPL_FUNCTION_GRAPH_GEOMETRY_DERIVATION **원천→판정: PT_M2_MOVING_POINT_AREA → PT_FUNCTION_GRAPH_GEOMETRY** **원천→판정: TPL_RECTANGLE_MOVING_POINT_TRAPEZOID → TPL_FUNCTION_GRAPH_GEOMETRY_DERIVATION**
- 이유: 도형 ABCD 에서 동점 BP = 2x 로부터 사다리꼴 넓이 식 y = -8x + 160 을 유도하여 판정하는 기하 유도 템플릿이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 직사각형 160 에서 ABP 넓이 8x 를 빼 관계식을 세우고 y=100 일 때 x=7.5 초를 계산하는 3단계 복합 문항이다.

**4칸**
- given: 직사각형←stem:「가로의 길이가 $20\text{ cm}$, 세로의 길이가 $8\text{ cm}$인 직사각형 $ABCD$에서」
- goal: 사다리꼴←stem:「사다리꼴 $APCD$의 넓이를 $y\text{ cm}^2$라 할 때」
- method: 넓이(NAMED)←solution:「직사각형의 넓이에서 $\triangle ABP$의 넓이를 뺀 것이므로」
- condition: (없음)

**how** ABCD 전체 넓이 160 에서 삼각형 넓이 8x 를 빼 y = -8x + 160 을 구하고 ㄱ, ㄴ이 참임을 확인하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. $x$초 후 선분 $BP$의 길이는 $2x\text{ cm}$이다.
직사각형 $ABCD$의 전체 넓이는
$$
20 \times 8 = 160\text{ (cm}^2\text{)}
$$
삼각형 $ABP$는 밑변이 $BP = 2x$, 높이가 $AB = 8$이므로 넓이는
$$
\triangle ABP = \frac{1}{2} \times 2x \times 8 = 8x\text{ (cm}^2\text{)}
$$
사다리꼴 $APCD$의 넓이 $y$는 직사각형의 넓이에서 $\triangle ABP$의 넓이를 뺀 것이므로
$$
y = 160 - 8x = -8x + 160
$$
따라서 ㄱ은 옳다.


2. 관계식 $y = -8x + 160$에서 $x$의 계수가 $-8$이므로 $x$가 $1$ 증가할 때 $y$는 $8$씩 감소한다.
즉, 사다리꼴의 넓이는 $1$초에 $8\text{ cm}^2$씩 줄어든다.
따라서 ㄴ은 옳다.


3. $y = 100$일 때의 시간을 구하면
$$
100 = -8x + 160 \implies 8x = 60 \implies x = \frac{60}{8} = 7.5\text{ (초)}
$$
따라서 $8$초 후가 아니라 $7.5$초 후이므로 ㄷ은 옳지 않다.


그러므로 옳은 것은 ㄱ, ㄴ이다.
정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

다음 중 미지수가 $2$개인 일차방정식인 것은? [3점]

**보기** ① $2x - 3 = 5$  ② $3x + y = 3x - 2$  ③ $x^2 + 2y = 1$  ④ $3x - 5y = 7$  ⑤ $xy + 2 = 0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 미지수가 2개인 일차방정식은 동류항을 정리했을 때 ax + by = c (a != 0, b != 0) 꼴이어야 한다.
2. ④ 3x - 5y = 7 은 미지수가 x, y 2개이고 각각 일차인 ax + by = c 꼴이다.
3. ⑤ xy + 2 = 0 은 xy 항의 차수가 2이므로 일차방정식이 아니다.
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) **원천→판정: M2-03-LINEAR_SYSTEM_BASIC → M2-03-SIMULTANEOUS_LINEAR_EQUATION**
- 근거 인용: 「다음 중 미지수가 $2$개인 일차방정식인 것은?」
**RPM** NONE  **원천→판정: 연립일차방정식 > 연립일차방정식 > 미지수가 2개인 일차방정식 > 미지수가 2개인 일차방정식의 뜻 → NONE**
- 이유: 미지수가 2개인 일차방정식 ax + by = c 의 뜻과 판별에 해당하는 독립 행이 M2-03 RPM 에 없어 NONE 으로 둔다.
**유형** PT=PT_M2_TWO_VARIABLE_LINEAR_EQUATION / TPL=NONE **원천→판정: PT_M2_LINEAR_EQ_DEFINITION → PT_M2_TWO_VARIABLE_LINEAR_EQUATION** **원천→판정: TPL_TWO_VARIABLE_LINEAR_EQUATION_JUDGMENT → NONE**
- 이유: 식 3x - 5y = 7 이 미지수 2개인 ax + by = c 형태를 만족하는지 확인하는 판정 단계이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 동류항 정리 후 ax + by = c 일차식 조건 충족 여부를 바로 파악하는 1단계 개념 문항이다.

**4칸**
- given: 미지수←stem:「미지수가 $2$개인」
- goal: 일차방정식←stem:「일차방정식인 것은?」
- method: 동류항(NAMED)←solution:「동류항을 정리했을 때」
- condition: (없음)

**how** 각 보기를 정리하여 ax + by = c 형태를 유지하는 3x - 5y = 7 을 찾아 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

미지수가 $2$개인 일차방정식은 동류항을 정리했을 때 $ax + by = c$ ($a, b, c$는 상수, $a \ne 0, b \ne 0$)의 꼴이어야 한다.
① $2x = 8$로 미지수가 $x$ 하나뿐이다.
② 동류항을 이항하여 정리하면 $y = -2$가 되어 미지수가 $y$ 하나뿐이다.
③ $x^2$ 항이 있으므로 차수가 $2$이다.
④ $3x - 5y = 7$은 $x, y$ 미지수가 $2$개이고 각각 차수가 $1$인 일차방정식이다. (참)
⑤ $xy$ 항은 $x, y$에 대한 차수가 $2$이므로 일차방정식이 아니다.


따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

일차방정식 $2x + y - 6 = 0$의 해에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은? [4점]


$$
\begin{aligned}
&\text{ㄱ. } (1, 4)\text{는 이 일차방정식의 해이다.} \
&\text{ㄴ. } x, y\text{가 자연수일 때, 해는 무수히 많다.} \
&\text{ㄷ. } x, y\text{의 값의 범위가 수 전체일 때, 해를 나타내는 그래프는 한 점이다.}
\end{aligned}
$$

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄴ  ④ ㄱ, ㄷ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. aligned 수식 보기 ㄱ: (1, 4) 대입 시 2(1) + 4 - 6 = 0 이 성립하므로 참이다.
2. ㄴ: y = 6 - 2x 에서 x, y가 자연수이면 (1, 4), (2, 2)의 2개뿐이므로 거짓이다.
3. ㄷ: 수 전체 범위에서 일차방정식의 해를 나타내는 그래프는 직선이므로 한 점이라는 설명은 거짓이다.
4. 따라서 옳은 것은 ㄱ(①)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQ → M2-04-LINEAR_FUNCTION_EQUATION**
- 근거 인용: 「일차방정식 $2x + y - 6 = 0$의 해에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은?」
**RPM** M2-RPM-172 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 일차방정식과 일차함수 > 일차방정식의 해와 그래프 → 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프**
- 이유: 일차방정식 2x + y - 6 = 0 의 해와 그래프 성질을 다루는 방정식과 그래프 일차방정식의 그래프 행이다 (aligned 보기).
**유형** PT=PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES / TPL=TPL_M2_EVALUATE_STATEMENTS_ON_LINEAR_EQUATION_GRAPH **원천→판정: PT_M2_LINEAR_SOLUTION_SET → PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES** **원천→판정: TPL_LINEAR_EQ_SOLUTION_DOMAIN_PROPERTIES → TPL_M2_EVALUATE_STATEMENTS_ON_LINEAR_EQUATION_GRAPH**
- 이유: 일차방정식 2x + y - 6 = 0 의 해와 그래프 명제들을 판정하는 aligned 템플릿이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대입과 자연수 해 개수 카운트, 그래프 개형의 3가지 aligned 명제를 종합 판별하는 2단계 문항이다.

**4칸**
- given: 해←stem:「일차방정식 $2x + y - 6 = 0$의 해에」
- goal: 그래프←stem:「해를 나타내는 그래프는 한 점이다.」
- method: 대입(NAMED)←solution:「$x = 1, y = 4$를 식 $2x + y - 6 = 0$에 대입하면」
- condition: (없음)

**how** aligned 보기 중 (1, 4)가 해가 됨을 확인하고 자연수 해 개수가 2개임을 분석하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

보기의 각 명제를 판별한다.
ㄱ. $x = 1, y = 4$를 식 $2x + y - 6 = 0$에 대입하면
$$
2(1) + 4 - 6 = 0
$$
이므로 성립한다. 따라서 $(1, 4)$는 해이다. (참)
ㄴ. $y = 6 - 2x$에서 $x, y$가 자연수이어야 하므로
- $x = 1$일 때 $y = 4$ $\implies (1, 4)$
- $x = 2$일 때 $y = 2$ $\implies (2, 2)$
- $x \ge 3$이면 $y \le 0$이 되어 자연수가 아니다.
따라서 자연수인 해는 $2$개뿐이므로 무수히 많다는 설명은 거짓이다.
ㄷ. $x, y$의 범위가 수 전체일 때 해를 좌표평면에 나타내면 한 점이 아니라 '직선'이 된다. (거짓)


따라서 옳은 것은 ㄱ이다.
정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

일차방정식 $2x + 3y - 6 = 0$의 그래프에 대한 설명으로 옳은 것은? [4점]

**보기** ① $x$절편은 $-3$이다.  ② $y = \dfrac{2}{3}x$의 그래프와 평행하다.  ③ 제$1$사분면, 제$2$사분면, 제$4$사분면을 지난다.  ④ 오른쪽 위로 향하는 직선이다.  ⑤ 점 $(3, 2)$를 지난다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 2x + 3y - 6 = 0 을 y에 관하여 풀면 y = -(2/3)x + 2 이다.
2. 기울기는 -2/3 이고 y절편은 2, x절편은 y=0 일 때 2x=6 에서 x=3 이다.
3. x절편 3 과 y절편 2 가 모두 양수이고 기울기가 음수이므로 제1, 2, 4사분면을 지난다.
4. 따라서 옳은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQ → M2-04-LINEAR_FUNCTION_EQUATION**
- 근거 인용: 「일차방정식 $2x + 3y - 6 = 0$의 그래프에 대한 설명으로 옳은 것은?」
**RPM** M2-RPM-172 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 일차방정식과 일차함수 > 일차방정식의 그래프 → 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프**
- 이유: 2x + 3y - 6 = 0 을 y = -(2/3)x + 2 로 고쳐 절편과 그래프 성질을 따지는 일차방정식의 그래프 행이다.
**유형** PT=PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES / TPL=TPL_M2_EVALUATE_STATEMENTS_ON_LINEAR_EQUATION_GRAPH **원천→판정: PT_M2_LINEAR_EQ_GRAPH → PT_M2_LINEAR_EQUATION_GRAPH_PROPERTIES** **원천→판정: TPL_LINEAR_EQUATION_GRAPHICAL_AUDIT → TPL_M2_EVALUATE_STATEMENTS_ON_LINEAR_EQUATION_GRAPH**
- 이유: 일차방정식 2x + 3y - 6 = 0 의 그래프 성질(절편, 기울기, 사분면)을 평가하는 명제 판정 단계이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 2x + 3y - 6 = 0 의 표준형 변환 후 절편 3, 2 와 사분면 통과를 점검하는 2단계 문항이다.

**4칸**
- given: 일차방정식←stem:「일차방정식 $2x + 3y - 6 = 0$의」
- goal: 사분면←choices:「제$1$사분면, 제$2$사분면, 제$4$사분면을 지난다.」
- method: x절편(NAMED)←solution:「$x$절편은 $y=0$일 때 $2x = 6 \implies x = 3$이다.」
- condition: (없음)

**how** 2x + 3y - 6 = 0 에서 x절편 3, y절편 2 를 구해 제1, 2, 4사분면을 지남을 확인하고 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

일차방정식 $2x + 3y - 6 = 0$을 $y$에 관하여 풀면
$$
3y = -2x + 6 \implies y = -\frac{2}{3}x + 2
$$
- 기울기는 $-\dfrac{2}{3}$ (음수)이므로 오른쪽 아래로 향한다.
- $x$절편은 $y=0$일 때 $2x = 6 \implies x = 3$이다. (①은 거짓)
- 기울기가 $-\dfrac{2}{3}$이므로 $y = \dfrac{2}{3}x$와 평행하지 않다. (②는 거짓)
- 점 $(3, 2)$를 대입하면 $2(3) + 3(2) - 6 = 6 \ne 0$이므로 지나지 않는다. (⑤는 거짓)
- $x$절편 $3$ (양수), $y$절편 $2$ (양수)이고 기울기가 음수이므로 제$1$, $2$, $4$사분면을 지나고 제$3$사분면은 지나지 않는다. (③은 참)


따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

점 $(0, -3)$을 지나고 $x$축에 평행한 직선의 방정식은? [3점]

**보기** ① $x = -3$  ② $x = 3$  ③ $y = 3$  ④ $x + y = -3$  ⑤ $y = -3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. x축에 평행한 직선은 y좌표가 일정하므로 y = k (k는 상수) 꼴이다.
2. 점 (0, -3)을 지나므로 y = -3 이다.
3. 따라서 구하는 직선의 방정식은 y = -3 (⑤)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQ → M2-04-LINEAR_FUNCTION_EQUATION**
- 근거 인용: 「점 $(0, -3)$을 지나고 $x$축에 평행한 직선의 방정식은?」
**RPM** M2-RPM-173 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > x축·y축에 평행한 직선] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 좌표축에 평행한 직선의 방정식 > x축에 평행한 직선의 방정식 → 일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > x축·y축에 평행한 직선**
- 이유: 점 (0, -3)을 지나고 x축에 평행한 직선 y = -3 을 구하는 x축·y축에 평행한 직선 행이다.
**유형** PT=PT_LINE_EQUATION / TPL=TPL_LINE_PARALLEL **원천→판정: PT_M2_AXIS_PARALLEL_LINE → PT_LINE_EQUATION** **원천→판정: TPL_HORIZONTAL_LINE_FROM_POINT → TPL_LINE_PARALLEL**
- 이유: 점 (0, -3)을 지나며 x축에 평행한 직선 y = k 꼴의 방정식을 결정하는 평행 조건 템플릿이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: x축에 평행한 직선의 형태 y=k 에 점 (0, -3)의 y좌표를 바로 읽어 y=-3 을 구하는 1단계 기본 문항이다.

**4칸**
- given: 점←stem:「점 $(0, -3)$을 지나고」
- goal: 직선의방정식←stem:「직선의 방정식은?」
- method: 평행(NAMED)←stem:「$x$축에 평행한」
- condition: (없음)

**how** 점 (0, -3)을 지나고 x축에 평행한 직선의 형태 y = -3 을 확인하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x$축에 평행한(또는 $y$축에 수직인) 직선은 모든 점의 $y$좌표가 일정하므로 $y = k$ ($k$는 상수)의 꼴로 나타내어진다.
이 직선이 점 $(0, -3)$을 지나므로 구하는 직선의 방정식은
$$
y = -3
$$
이다.
정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

다음 일차방정식 중 순서쌍 $(2, -1)$을 해로 갖는 두 일차방정식으로 짝지어진 것은? [3점]


$$
\begin{aligned}
&\text{(가) } 2x + y = 3 \
&\text{(나) } x - 3y = 5 \
&\text{(다) } 3x + 2y = 8 \
&\text{(라) } x + 2y = 4
\end{aligned}
$$

**보기** ① (가)와 (다)  ② (가)와 (나)  ③ (나)와 (다)  ④ (나)와 (라)  ⑤ (다)와 (라)

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. aligned 수식의 각 일차방정식에 순서쌍 (2, -1)을 대입한다.
2. (가) 2(2) + (-1) = 3 (참), (나) 2 - 3(-1) = 5 (참) 이다.
3. (다) 3(2) + 2(-1) = 4 != 8 (거짓), (라) 2 + 2(-1) = 0 != 4 (거짓) 이다.
4. 따라서 (2, -1)을 해로 갖는 것은 (가)와 (나) (②)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) **원천→판정: M2-03-LINEAR_SYSTEM_BASIC → M2-03-SIMULTANEOUS_LINEAR_EQUATION**
- 근거 인용: 「다음 일차방정식 중 순서쌍 $(2, -1)$을 해로 갖는 두 일차방정식으로 짝지어진 것은?」
**RPM** M2-RPM-150 [연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식] **원천→판정: 연립일차방정식 > 연립일차방정식 > 미지수가 2개인 일차방정식 > 일차방정식의 해 → 연립일차방정식 > 연립일차방정식 > 해와 계수 > 해가 주어진 연립방정식**
- 이유: 주어진 순서쌍 (2, -1)을 aligned 보기의 식들에 대입하여 해가 되는 식을 찾는 해가 주어진 연립방정식 행이다.
**유형** PT=PT_H1_SYSTEM_EQUATION / TPL=TPL_H1_SYSTEM_DIRECT **원천→판정: PT_M2_LINEAR_SOLUTION_MATCH → PT_H1_SYSTEM_EQUATION** **원천→판정: TPL_EQUATION_PAIR_BY_SOLUTION → TPL_H1_SYSTEM_DIRECT**
- 이유: 순서쌍 (2, -1)을 aligned 식들에 대입해 성립 여부를 직접 검증하는 직접 해 판별 템플릿이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 순서쌍 (2, -1)을 aligned 보기의 각 식에 단순 대입하여 참거짓을 가리는 1단계 기본 문항이다.

**4칸**
- given: 순서쌍←stem:「순서쌍 $(2, -1)$을 해로 갖는」
- goal: 일차방정식←stem:「두 일차방정식으로 짝지어진 것은?」
- method: 대입(NAMED)←solution:「각 방정식의 좌변에 대입하여 계산한다.」
- condition: (없음)

**how** 순서쌍 (2, -1)을 aligned 보기 식들에 대입해 (가)와 (나)가 성립함을 확인하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

순서쌍 $(x, y) = (2, -1)$을 각 방정식의 좌변에 대입하여 계산한다.
- (가): $2(2) + (-1) = 4 - 1 = 3$ (참)
- (나): $2 - 3(-1) = 2 + 3 = 5$ (참)
- (다): $3(2) + 2(-1) = 6 - 2 = 4 \ne 8$ (거짓)
- (라): $2 + 2(-1) = 2 - 2 = 0 \ne 4$ (거짓)


따라서 $(2, -1)$을 해로 갖는 두 일차방정식은 (가)와 (나)이다.
정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

연립방정식 $\begin{cases} x - y = -4 \ 2x + 3y = 7 \end{cases}$의 해는? [4점]

**보기** ① $x = -1,\ y = 3$  ② $x = 1,\ y = 5$  ③ $x = -2,\ y = 2$  ④ $x = 2,\ y = 1$  ⑤ $x = -3,\ y = 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. cases 연립방정식의 첫째 식에서 x = y - 4 로 정리한다.
2. 둘째 식 2x + 3y = 7 에 대입하면 2(y - 4) + 3y = 7 이 된다.
3. 5y - 8 = 7 에서 5y = 15 이므로 y = 3 이고 x = 3 - 4 = -1 이다.
4. 따라서 해는 x = -1, y = 3 (①)이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) **원천→판정: M2-03-LINEAR_SYSTEM_SOLVE → M2-03-SIMULTANEOUS_LINEAR_EQUATION**
- 근거 인용: 「연립방정식 $\begin{cases} x - y = -4 \ 2x + 3y = 7 \end{cases}$의 해는?」
**RPM** M2-RPM-149 [연립일차방정식 > 연립일차방정식 > 연립방정식의 풀이 > 대입법] **원천→판정: 연립일차방정식 > 연립일차방정식의 풀이 > 연립일차방정식의 풀이 > 대입법을 이용한 풀이 → 연립일차방정식 > 연립일차방정식 > 연립방정식의 풀이 > 대입법**
- 이유: cases 형태의 식에서 x = y - 4 를 대입하여 5y = 15 에서 해를 구하는 대입법 행이다.
**유형** PT=PT_H1_SYSTEM_EQUATION / TPL=TPL_H1_SYSTEM_DIRECT **원천→판정: PT_M2_LINEAR_SYSTEM_SUBSTITUTION → PT_H1_SYSTEM_EQUATION** **원천→판정: TPL_LINEAR_SYSTEM_SUBSTITUTION_BASIC → TPL_H1_SYSTEM_DIRECT**
- 이유: cases 연립방정식을 대입법으로 풀어 5y = 15 로부터 x = -1, y = 3 을 직접 산출하는 템플릿이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: x = y - 4 대입 후 5y = 15 로 일차방정식을 푸는 1단계 기본 연립방정식 문항이다.

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} x - y = -4 \ 2x + 3y = 7 \end{cases}$의」
- goal: 해←stem:「의 해는? [4점]」
- method: 대입법(NAMED)←solution:「대입법 또는 가감법을 이용하여 푼다.」
- condition: (없음)

**how** cases 연립방정식에서 대입법으로 5y = 15 를 풀어 x = -1, y = 3 을 확인하고 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

대입법 또는 가감법을 이용하여 푼다.
첫 번째 식에서
$$
x = y - 4
$$
이를 두 번째 식에 대입하면
$$
2(y - 4) + 3y = 7
$$
$$
2y - 8 + 3y = 7
$$
$$
5y = 15 \implies y = 3
$$
$y = 3$을 $x = y - 4$에 대입하면
$$
x = 3 - 4 = -1
$$
따라서 해는 $x = -1, y = 3$이다.
정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4.5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

민지와 수지가 연립방정식 $\begin{cases} ax - y = 4 \ x + by = -1 \end{cases}$을 푸는데, 민지는 $a$를 잘못 보아 $x = 2, y = -3$을 얻었고, 수지는 $b$를 잘못 보아 $x = 3, y = 2$를 얻었다. 이 연립방정식을 바르게 푼 해는? [4.5점]

**보기** ① $x = 2,\ y = 0$  ② $x = -1,\ y = -6$  ③ $x = 1,\ y = -2$  ④ $x = 3,\ y = 2$  ⑤ $x = -2,\ y = 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. cases 연립방정식에서 민지는 a를 잘못 보았으므로 x + by = -1 에 (2, -3)을 대입하면 2 - 3b = -1 에서 b = 1 이다.
2. 수지는 b를 잘못 보았으므로 ax - y = 4 에 (3, 2)를 대입하면 3a - 2 = 4 에서 a = 2 이다.
3. 원래 식 2x - y = 4 와 x + y = -1 을 더하면 3x = 3 이므로 x = 1, y = -2 이다.
4. 따라서 바르게 푼 해는 x = 1, y = -2 (③)이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) **원천→판정: M2-03-LINEAR_SYSTEM_SOLVE → M2-03-SIMULTANEOUS_LINEAR_EQUATION**
- 근거 인용: 「민지와 수지가 연립방정식 $\begin{cases} ax - y = 4 \ x + by = -1 \end{cases}$을 푸는데」
**RPM** M2-RPM-151 [연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정] **원천→판정: 연립일차방정식 > 연립일차방정식의 풀이 > 연립일차방정식의 풀이 > 계수를 잘못 보고 푼 문제 → 연립일차방정식 > 연립일차방정식 > 해와 계수 > 계수 결정**
- 이유: cases 형태 식에서 ax 항과 by 항의 계수를 잘못 본 조건을 이용해 계수 a=2, b=1 을 결정하는 계수 결정 행이다.
**유형** PT=PT_M2_SYSTEM_OF_EQUATIONS_COEFFICIENT_SWAP / TPL=TPL_M2_SOLVE_ORIGINAL_SYSTEM_AFTER_COEFFICIENT_SWAP_DESCRIPTIVE **원천→판정: PT_M2_MISREAD_COEFFICIENTS → PT_M2_SYSTEM_OF_EQUATIONS_COEFFICIENT_SWAP** **원천→판정: TPL_MISREAD_COEFFICIENTS_SYSTEM_SOLVE → TPL_M2_SOLVE_ORIGINAL_SYSTEM_AFTER_COEFFICIENT_SWAP_DESCRIPTIVE**
- 이유: 잘못 본 식을 제외하고 ax 와 by 가 든 바른 식에 대입하여 원래 방정식을 복원해 푸는 계수 복원 템플릿이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: a, b 계수를 각각 구하고 원래 cases 연립방정식을 다시 푸는 4.5점 배점의 3단계 복합 문항이다.

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} ax - y = 4 \ x + by = -1 \end{cases}$을」
- goal: 해←stem:「바르게 푼 해는? [4.5점]」
- method: 대입(NAMED)←solution:「둘째 식에 대입하면」
- condition: (없음)

**how** cases 연립방정식에서 ax 항과 by 항의 계수 a=2, b=1 을 각각 찾아 바른 해 x=1, y=-2 로 ③을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. 민지는 $a$만 잘못 보았으므로 둘째 식 $x + by = -1$은 올바르게 성립한다.
$x = 2, y = -3$을 둘째 식에 대입하면
$$
2 + b(-3) = -1 \implies -3b = -3 \implies b = 1
$$
2. 수지는 $b$만 잘못 보았으므로 첫째 식 $ax - y = 4$는 올바르게 성립한다.
$x = 3, y = 2$를 첫째 식에 대입하면
$$
a(3) - 2 = 4 \implies 3a = 6 \implies a = 2
$$
3. 바른 연립방정식은
$$
\begin{cases}
2x - y = 4 \quad \cdots\text{㉠} \
x + y = -1 \quad \cdots\text{㉡}
\end{cases}
$$
두 식을 변끼리 더하면
$$
3x = 3 \implies x = 1
$$
$x = 1$을 ㉡에 대입하면
$$
1 + y = -1 \implies y = -2
$$
따라서 바르게 푼 해는 $x = 1, y = -2$이다.
정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

연립방정식 $\begin{cases} 0.4x - 0.2y = 0.8 \ \dfrac{x}{3} + \dfrac{y}{2} = 2 \end{cases}$의 해는? [4점]

**보기** ① $x = 1,\ y = -2$  ② $x = 2,\ y = 0$  ③ $x = 4,\ y = 4$  ④ $x = 3,\ y = 2$  ⑤ $x = 5,\ y = 6$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. cases 첫 식 0.4x - 0.2y = 0.8 의 양변에 10 을 곱해 2x - y = 4 를 얻는다.
2. 둘째 식의 양변에 6을 곱해 2x + 3y = 12 를 얻는다.
3. 두 식을 변끼리 빼면 4y = 8 이므로 y = 2, 2x = 6 에서 x = 3 이다.
4. 따라서 해는 x = 3, y = 2 (④)이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION(연립일차방정식) (원천과 같음) **원천→판정: M2-03-LINEAR_SYSTEM_SOLVE → M2-03-SIMULTANEOUS_LINEAR_EQUATION**
- 근거 인용: 「연립방정식 $\begin{cases} 0.4x - 0.2y = 0.8 \ \dfrac{x}{3} + \dfrac{y}{2} = 2 \end{cases}$의 해는?」
**RPM** M2-RPM-153 [연립일차방정식 > 연립일차방정식 > 복잡한 꼴의 연립방정식 > 분수·소수가 있는 연립방정식] **원천→판정: 연립일차방정식 > 연립일차방정식의 풀이 > 여러 가지 연립일차방정식 > 계수가 소수 또는 분수인 연립방정식 → 연립일차방정식 > 연립일차방정식 > 복잡한 꼴의 연립방정식 > 분수·소수가 있는 연립방정식**
- 이유: 소수 0.4, 0.2, 0.8 과 분수가 포함된 cases 연립방정식을 정수화하여 푸는 분수·소수가 있는 연립방정식 행이다.
**유형** PT=PT_M2_SYSTEM_OF_EQUATIONS_DECIMAL_COEFFICIENTS / TPL=TPL_M2_SOLVE_DECIMAL_SYSTEM_AND_LINEAR_COMBINATION **원천→판정: PT_M2_SYSTEM_DECIMAL_FRACTION → PT_M2_SYSTEM_OF_EQUATIONS_DECIMAL_COEFFICIENTS** **원천→판정: TPL_DECIMAL_FRACTION_COEFFICIENTS_SYSTEM → TPL_M2_SOLVE_DECIMAL_SYSTEM_AND_LINEAR_COMBINATION**
- 이유: 소수 계수에 10 을 곱하고 분수 계수에 6을 곱해 12 를 만든 뒤 가감법으로 푸는 템플릿이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 소수 0.4 와 분수를 10, 6 을 곱해 정수 계수로 변환한 후 연립방정식을 푸는 2단계 문항이다.

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} 0.4x - 0.2y = 0.8 \ \dfrac{x}{3} + \dfrac{y}{2} = 2 \end{cases}$의」
- goal: 해←stem:「의 해는? [4점]」
- method: 가감법(IMPLIED)←solution:「변끼리 뺀다.」 — 두 식을 변끼리 빼서 x를 소거하는 가감법을 적용함
- condition: (없음)

**how** cases 연립방정식에 10과 6을 곱해 2x - y = 4 와 2x + 3y = 12 로 정리한 뒤 풀어 x=3, y=2 로 ④를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. 첫 번째 식의 양변에 $10$을 곱한다.
$$
4x - 2y = 8 \implies 2x - y = 4 \quad \cdots\text{㉠}
$$
2. 두 번째 식의 양변에 $6$을 곱한다.
$$
2x + 3y = 12 \quad \cdots\text{㉡}
$$
3. ㉡에서 ㉠을 변끼리 뺀다.
$$
(2x + 3y) - (2x - y) = 12 - 4
$$
$$
4y = 8 \implies y = 2
$$
4. $y = 2$를 ㉠에 대입한다.
$$
2x - 2 = 4 \implies 2x = 6 \implies x = 3
$$
따라서 해는 $x = 3, y = 2$이다.
정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

연립방정식 $\begin{cases} 2x - y = a \ bx + y = 5 \end{cases}$의 두 일차방정식의 그래프의 교점의 좌표가 $(1, 3)$일 때, 두 상수 $a, b$에 대하여 $a + b$의 값은? [4점]

**보기** ① $-3$  ② $-1$  ③ $1$  ④ $3$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. cases 연립방정식 그래프의 교점 (1, 3)은 두 방정식의 공통해이다.
2. 첫째 식 2x - y = a 에 (1, 3)을 대입하면 a = 2(1) - 3 = -1 이다.
3. 둘째 식 bx + y = 5 에 (1, 3)을 대입하면 b(1) + 3 = 5 이므로 b = 2 이다.
4. 따라서 a + b = -1 + 2 = 1 이며 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQ → M2-04-LINEAR_FUNCTION_EQUATION**
- 근거 인용: 「연립방정식 $\begin{cases} 2x - y = a \ bx + y = 5 \end{cases}$의 두 일차방정식의 그래프의 교점의 좌표가 $(1, 3)$일 때」
**RPM** M2-RPM-174 [일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 교점과 연립방정식] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 두 일차방정식의 그래프와 연립방정식 > 연립방정식의 해와 두 직선의 교점 → 일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 교점과 연립방정식**
- 이유: cases 연립방정식과 둘째 식 bx + y = 5 의 그래프 교점 (1, 3)을 해로 보고 상수를 구하는 교점과 연립방정식 행이다.
**유형** PT=PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION / TPL=TPL_M2_FIND_INTERSECTION_COORDINATE_SUM_FROM_SYSTEM **원천→판정: PT_M2_INTERSECTION_PARAMETERS → PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION** **원천→판정: TPL_INTERSECTION_COORDINATE_SUBSTITUTION → TPL_M2_FIND_INTERSECTION_COORDINATE_SUM_FROM_SYSTEM**
- 이유: cases 연립방정식의 두 그래프 교점 (1, 3)을 대입해 bx 식과 첫 식에서 a=-1, b=2 를 구하는 교점 템플릿이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 교점 좌표 (1, 3)을 cases 식과 bx 식에 대입하여 a=-1, b=2 를 산출하는 1단계 기본 문항이다.

**4칸**
- given: 교점←stem:「그래프의 교점의 좌표가 $(1, 3)$일 때」
- goal: 합←solution:「두 상수의 합은」
- method: 대입(NAMED)←solution:「에 $x = 1, y = 3$을 대입하면」
- condition: (없음)

**how** cases 연립방정식의 교점 (1, 3)을 식과 bx 식에 대입해 a=-1, b=2 를 얻고 a+b=1 로 ③을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 일차방정식의 그래프의 교점의 좌표 $(1, 3)$은 연립방정식의 해이다.
1. 첫 번째 식 $2x - y = a$에 $x = 1, y = 3$을 대입하면
$$
2(1) - 3 = a \implies a = -1
$$
2. 두 번째 식 $bx + y = 5$에 $x = 1, y = 3$을 대입하면
$$
b(1) + 3 = 5 \implies b = 2
$$
3. 두 상수의 합은
$$
a + b = -1 + 2 = 1
$$
따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

일차방정식 $ax + 3y - 6 = 0$의 그래프가 다음 두 조건을 만족시킬 때, 상수 $a, b$의 순서쌍 $(a, b)$는? [5점]


$$
\begin{aligned}
&\cdot \text{직선 } (b + 1)x - 3y + 2 = 0\text{과 만나지 않는다.} \
&\cdot \text{직선 } (-b + 5)x + 6y - 12 = 0\text{과 무수히 많은 점에서 만난다.}
\end{aligned}
$$

**보기** ① $a = -2,\ b = 1$  ② $a = 4,\ b = -5$  ③ $a = -6,\ b = 7$  ④ $a = 5,\ b = -6$  ⑤ $a = 6,\ b = -7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. aligned 조건 1: ax + 3y - 6 = 0 이 (b+1)x - 3y + 2 = 0 과 만나지 않으므로 평행하여 -a/3 = (b+1)/3, 즉 a = -b - 1 이다.
2. aligned 조건 2: (-b+5)x + 6y - 12 = 0 과 무수히 많은 점에서 만나므로 일치하여 2a = -b + 5 이다.
3. 2(-b - 1) = -b + 5 에서 -b = 7 이므로 b = -7, a = -(-7) - 1 = 6 이다.
4. 따라서 순서쌍 (a, b)는 a = 6, b = -7 (⑤)이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQ → M2-04-LINEAR_FUNCTION_EQUATION**
- 근거 인용: 「일차방정식 $ax + 3y - 6 = 0$의 그래프가 다음 두 조건을 만족시킬 때」
**RPM** M2-RPM-175 [일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 두 직선의 평행·일치] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 두 일차방정식의 그래프와 연립방정식 > 해가 특수한 연립방정식과 두 직선의 위치 관계 → 일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 두 직선의 평행·일치**
- 이유: ax + 3y - 6 = 0 이 한 직선과는 평행하고 6y - 12 = 0 직선과는 일치하는 두 직선의 평행·일치 행이다.
**유형** PT=PT_LINE_RELATION / TPL=TPL_RELATION_MULTIPLE_POSITION **원천→판정: PT_M2_SPECIAL_LINES_CONDITIONS → PT_LINE_RELATION** **원천→판정: TPL_PARALLEL_AND_COINCIDENT_SYSTEM → TPL_RELATION_MULTIPLE_POSITION**
- 이유: ax 식이 평행 조건과 일치 조건을 모두 만족하도록 aligned 관계식을 세워 연립하는 복수 위치 관계 템플릿이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행과 일치의 aligned 두 조건을 해석하여 2a = -b + 5 를 연립해 푸는 5점 배점의 3단계 문항이다.

**4칸**
- given: 직선←stem:「직선 } (b + 1)x - 3y + 2 = 0\text{과 만나지 않는다.}」
- goal: 순서쌍←stem:「상수 $a, b$의 순서쌍 $(a, b)$는? [5점]」
- method: 평행(NAMED)←solution:「만나지 않으려면 두 직선이 평행해야 한다.」
- condition: (없음)

**how** aligned 두 조건에서 a = -b - 1 과 2a = -b + 5 를 세워 연립하여 a=6, b=-7 로 ⑤를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. 직선 $(b + 1)x - 3y + 2 = 0$과 만나지 않으려면 두 직선이 평행해야 한다.
$ax + 3y - 6 = 0$의 기울기는 $-\dfrac{a}{3}$이고, $(b + 1)x - 3y + 2 = 0$의 기울기는 $\dfrac{b + 1}{3}$이다.
두 직선의 기울기가 같아야 하므로
$$
-\frac{a}{3} = \frac{b + 1}{3} \implies a = -b - 1 \quad \cdots\text{㉠}
$$
$y$절편은 각각 $2$와 $\dfrac{2}{3}$로 서로 다르므로 평행 조건이 성립한다.


2. 직선 $(-b + 5)x + 6y - 12 = 0$과 무수히 많은 점에서 만나려면 두 직선이 일치해야 한다.
$ax + 3y - 6 = 0$의 양변에 $2$를 곱하면
$$
2ax + 6y - 12 = 0
$$
이 식이 $(-b + 5)x + 6y - 12 = 0$과 완전히 같아야 하므로 $x$의 계수가 같아야 한다.
$$
2a = -b + 5 \quad \cdots\text{㉡}
$$
3. ㉠의 $a = -b - 1$을 ㉡에 대입하면
$$
2(-b - 1) = -b + 5
$$
$$
-2b - 2 = -b + 5 \implies -b = 7 \implies b = -7
$$
$b = -7$을 ㉠에 대입하면
$$
a = -(-7) - 1 = 6
$$
따라서 $a = 6, b = -7$이다.
정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

[서술형 1] 주전자에 담긴 물을 가열하면서 $1$분마다 물의 온도를 측정하였더니 아래 표와 같이 온도가 일정하게 상승하였다. 물을 가열하기 시작한 지 $x$분 후의 물의 온도를 $y^\circ\text{C}$라 할 때, 다음 물음에 답하고 그 풀이 과정을 서술하시오. [총 6점]


| $x$ (분) | 0 | 1 | 2 | 3 | 4 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| $y$ ($^\circ\text{C}$) | 10 | 14 | 18 | 22 | 26 |


(1) $x$와 $y$ 사이의 관계식을 구하시오. [3점]
(2) 물의 온도가 $90^\circ\text{C}$가 되는 것은 가열하기 시작한 지 몇 분 후인지 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $y = 4x + 10$ / (2) $20$분 후   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. x = 0 일 때 처음 온도가 10 이므로 y절편은 10 이다.
2. x가 1분 증가할 때 온도가 4 씩 올라가므로 기울기는 4 이며 관계식은 y = 4x + 10 이다.
3. 온도가 90 이 되는 시간은 90 = 4x + 10 에서 4x = 80 이므로 x = 20 이다.
4. 따라서 답은 (1) y = 4x + 10, (2) 20분 후 이다.
- 작성자 답: (1) $y = 4x + 10$ / (2) $20$분 후 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 아래 표와 같이 온도가 일정하게 상승하였다.

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_APPLICATION → M2-04-LINEAR_FUNCTION_BASIC**
- 근거 인용: 「물을 가열하기 시작한 지 $x$분 후의 물의 온도를 $y^\circ\text{C}$라 할 때」
**RPM** M2-RPM-177 [일차함수 > 일차함수와 일차방정식의 관계 > 그래프 활용 > 조건에 따른 식 결정] **원천→판정: 일차함수 > 일차함수의 활용 > 일차함수의 활용 > 온도에 대한 일차함수의 활용 → 일차함수 > 일차함수와 일차방정식의 관계 > 그래프 활용 > 조건에 따른 식 결정**
- 이유: 표의 10 에서 26 까지의 변화로 y = 4x + 10 식을 세우고 y=90 일 때 x=20 을 구하는 조건에 따른 식 결정 행이다.
**유형** PT=PT_M2_LINEAR_FUNCTION_WORD_PROBLEM_TEMPERATURE / TPL=TPL_M2_SOLVE_TEMPERATURE_ALTITUDE_WORD_PROBLEM_DESCRIPTIVE **원천→판정: PT_M2_TEMPERATURE_LINEAR_MODEL → PT_M2_LINEAR_FUNCTION_WORD_PROBLEM_TEMPERATURE** **원천→판정: TPL_TEMPERATURE_TIME_LINEAR_EQUATION → TPL_M2_SOLVE_TEMPERATURE_ALTITUDE_WORD_PROBLEM_DESCRIPTIVE**
- 이유: 초깃값 10 과 1분당 4도 상승 조건으로 y = 4x + 10 을 세우고 90 도 달성 시간 20분을 구하는 온도 활용 템플릿이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 표의 10 과 기울기 4 로 관계식을 세우고 y=90 일 때 x=20 을 역산하는 2단계 서술형 문항이다.

**4칸**
- given: 변수←stem:「시작한 지 $x$분 후의 물의 온도를 $y^\circ\text{C}$라 할 때」
- goal: 관계식←stem:「$x$와 $y$ 사이의 관계식을 구하시오.」
- method: 대입(NAMED)←solution:「관계식에 $y = 90$을 대입한다.」
- condition: (없음)

**how** 표의 처음 온도 10과 분당 증가량 4로 y = 4x + 10 을 얻고 90 = 4x + 10 에서 x=20 을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

[풀이 과정]
(1) $x$와 $y$ 사이의 관계식 구하기:
가열하기 시작할 때($x = 0$)의 처음 온도가 $10^\circ\text{C}$이므로 $y$절편은 $10$이다.
$x$가 $1$분씩 증가할 때마다 물의 온도 $y$는 $4^\circ\text{C}$씩 일정하게 증가하므로 기울기는 $4$이다.
따라서 $x$와 $y$ 사이의 관계식은
$$
y = 4x + 10
$$
이다.


(2) 온도가 $90^\circ\text{C}$가 되는 시간 구하기:
물의 온도가 $90^\circ\text{C}$이므로 관계식에 $y = 90$을 대입한다.
$$
90 = 4x + 10
$$
$$
4x = 80 \implies x = 20
$$
따라서 물의 온도가 $90^\circ\text{C}$가 되는 것은 가열하기 시작한 지 $20$분 후이다.


답: (1) y = 4x + 10, (2) 20분 후

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

[서술형 2] 현재 형과 동생의 나이의 차는 $6$살이고, $4$년 후에는 형의 나이가 동생의 나이의 $2$배보다 $5$살 적어진다고 한다. 현재 형과 동생의 나이를 각각 구하고, 그 풀이 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 형 13살, 동생 7살   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 현재 형의 나이를 x, 동생의 나이를 y라 하면 x - y = 6 이다.
2. 4년 후 형은 x+4, 동생은 y+4 이므로 x + 4 = 2(y + 4) - 5 에서 x - 2y = -1 이다.
3. 두 식을 변끼리 빼면 y = 7 이고 x = 13 이다.
4. 4년 후 형 17 살, 동생 11 살로 2 * 11 - 5 = 22 - 5 = 17 이 성립한다.
5. 따라서 답은 형 13살, 동생 7살 이다.
- 작성자 답: 형 13살, 동생 7살 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-03(연립일차방정식) / M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD(연립일차방정식의 활용) (원천과 같음) **원천→판정: M2-03-LINEAR_SYSTEM_APPLICATION → M2-03-SIMULTANEOUS_LINEAR_EQUATION_WORD**
- 근거 인용: 「현재 형과 동생의 나이의 차는 $6$살이고」
**RPM** M2-RPM-156 [연립일차방정식 > 연립일차방정식의 활용 > 수와 개수 > 두 수 관계] **원천→판정: 연립일차방정식 > 연립일차방정식의 활용 > 실생활에 대한 문제 > 나이에 대한 문제 → 연립일차방정식 > 연립일차방정식의 활용 > 수와 개수 > 두 수 관계**
- 이유: 형 나이 13 과 동생 나이 7 의 차와 배수 관계를 연립방정식으로 세워 푸는 두 수 관계 활용 행이다.
**유형** PT=PT_M2_LINEAR_SYSTEM / TPL=NONE **원천→판정: PT_M2_AGE_WORD_PROBLEM → PT_M2_LINEAR_SYSTEM** **원천→판정: TPL_AGE_DIFFERENCE_AND_FUTURE_RATIO → NONE**
- 이유: 현재 나이 차 6 과 4년 후 17, 11 살 관계식을 세워 형 13 살, 동생 7 살을 구하는 나이 활용 단계이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 현재와 미래 나이의 관계식을 세워 연립하고 형 13 살, 동생 7 살을 구하는 2단계 서술형 문항이다.

**4칸**
- given: 자연수←solution:「$x, y$는 자연수」
- goal: 미지수←solution:「미지수 설정 및 연립방정식 세우기」
- method: 가감법(IMPLIED)←solution:「변끼리 뺀다.」 — 식 ㉠과 ㉡을 변끼리 빼서 x를 소거하는 가감법을 적용함
- condition: (없음)

**how** x - y = 6 과 x - 2y = -1 을 세워 연립하고 형 13살, 동생 7살임을 검산하여 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

[풀이 과정]
1단계: 미지수 설정 및 연립방정식 세우기
현재 형의 나이를 $x$살, 동생의 나이를 $y$살이라 하자 ($x, y$는 자연수, $x > y$).
- 현재 두 사람의 나이의 차가 $6$살이므로
$$
x - y = 6 \quad \cdots\text{㉠}
$$
- $4$년 후 형의 나이는 $(x + 4)$살, 동생의 나이는 $(y + 4)$살이다.
$4$년 후 형의 나이가 동생의 나이의 $2$배보다 $5$살 적어지므로
$$
x + 4 = 2(y + 4) - 5
$$
괄호를 전개하여 정리하면
$$
x + 4 = 2y + 8 - 5
$$
$$
x - 2y = -1 \quad \cdots\text{㉡}
$$


2단계: 연립방정식 풀기
㉠에서 ㉡을 변끼리 뺀다.
$$
(x - y) - (x - 2y) = 6 - (-1)
$$
$$
y = 7
$$
$y = 7$을 ㉠에 대입한다.
$$
x - 7 = 6 \implies x = 13
$$


3단계: 조건 확인 및 결론
현재 형의 나이는 $13$살, 동생의 나이는 $7$살이다.
나이 차는 $13 - 7 = 6$살이고, $4$년 후 형은 $17$살, 동생은 $11$살이므로
$2 \times 11 - 5 = 22 - 5 = 17$이 되어 문제의 조건에 부합한다.


답: 형 13살, 동생 7살

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

[서술형 3] 두 직선 $x - 2y + 6 = 0$, $2x + y - 8 = 0$과 $x$축으로 둘러싸인 삼각형의 넓이를 구하고, 그 풀이 과정을 상세히 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 20   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 직선의 x절편은 y=0 일 때 각각 x = -6, x = 4 이므로 밑변의 길이는 4 - (-6) = 10 이다.
2. cases 연립방정식을 풀면 5x = 10 에서 x = 2, y = 4 이므로 교점은 (2, 4)이고 높이는 4 이다.
3. 삼각형의 넓이는 (1/2) * 10 * 4 = 20 이다.
4. 따라서 답은 20 이다.
- 작성자 답: 20 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQ → M2-04-LINEAR_FUNCTION_EQUATION**
- 근거 인용: 「두 직선 $x - 2y + 6 = 0$, $2x + y - 8 = 0$과 $x$축으로 둘러싸인 삼각형의 넓이를 구하고」
**RPM** M2-RPM-176 [일차함수 > 일차함수와 일차방정식의 관계 > 그래프 활용 > 넓이] **원천→판정: 일차함수 > 일차함수와 일차방정식 > 두 일차방정식의 그래프와 연립방정식 > 두 직선과 좌표축으로 둘러싸인 도형의 넓이 → 일차함수 > 일차함수와 일차방정식의 관계 > 그래프 활용 > 넓이**
- 이유: 두 직선과 x축으로 둘러싸인 삼각형의 밑변 10 과 높이 4 로 넓이 20 을 구하는 넓이 활용 행이다.
**유형** PT=PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA / TPL=TPL_M2_CALCULATE_AREA_BOUNDED_BY_TWO_LINES_AND_AXES **원천→판정: PT_M2_LINES_ENCLOSED_AREA → PT_M2_LINEAR_FUNCTIONS_ENCLOSED_AREA** **원천→판정: TPL_TWO_LINES_X_AXIS_TRIANGLE_AREA → TPL_M2_CALCULATE_AREA_BOUNDED_BY_TWO_LINES_AND_AXES**
- 이유: 두 직선의 x절편으로 밑변 10 을 구하고 cases 교점으로 높이 4 를 구해 넓이 20 을 계산하는 둘러싼 넓이 템플릿이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: x절편으로 밑변 10 을 구하고 연립방정식으로 교점 (2, 4)를 구해 넓이 20 을 계산하는 7점 배점의 3단계 서술형 문항이다.

**4칸**
- given: 직선←stem:「두 직선 $x - 2y + 6 = 0$, $2x + y - 8 = 0$과」
- goal: 넓이←stem:「삼각형의 넓이를 구하고」
- method: 교점(NAMED)←solution:「두 직선의 교점의 좌표 구하기」
- condition: (없음)

**how** 두 직선의 x절편 차 10 과 cases 연립방정식 교점의 y좌표 4 를 이용해 넓이 20 을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

[풀이 과정]
1단계: 두 직선의 $x$절편 구하기 (밑변의 길이)
삼각형의 밑변은 $x$축 위에 있으므로 두 직선의 $x$축과의 교점($x$절편)을 구한다 ($y = 0$ 대입).
- 첫 번째 직선 $x - 2y + 6 = 0$에 $y = 0$을 대입하면
$$
x + 6 = 0 \implies x = -6
$$
따라서 교점의 좌표는 $(-6, 0)$이다.
- 두 번째 직선 $2x + y - 8 = 0$에 $y = 0$을 대입하면
$$
2x - 8 = 0 \implies 2x = 8 \implies x = 4
$$
따라서 교점의 좌표는 $(4, 0)$이다.
그러므로 삼각형의 밑변의 길이는
$$
4 - (-6) = 10
$$
이다.


2단계: 두 직선의 교점의 좌표 구하기 (높이)
두 직선의 교점의 $y$좌표의 절댓값이 삼각형의 높이가 된다.
연립방정식을 세우면
$$
\begin{cases}
x - 2y = -6 \quad \cdots\text{㉠} \
2x + y = 8 \quad \cdots\text{㉡}
\end{cases}
$$
㉡의 양변에 $2$를 곱하면
$$
4x + 2y = 16 \quad \cdots\text{㉢}
$$
㉠과 ㉢을 변끼리 더하면
$$
5x = 10 \implies x = 2
$$
$x = 2$를 ㉡에 대입하면
$$
2(2) + y = 8 \implies y = 4
$$
따라서 두 직선의 교점의 좌표는 $(2, 4)$이므로, 삼각형의 높이는 $4$이다.


3단계: 삼각형의 넓이 계산
밑변의 길이가 $10$이고 높이가 $4$이므로 삼각형의 넓이는
$$
\text{넓이} = \frac{1}{2} \times 10 \times 4 = 20
$$
이다.


답: 20

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
