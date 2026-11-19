# 검수 묶음 — 25_왕운중_2학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 3)**
- 문항 25개 / 검사 PASS 22, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/25, HOLD 0, 풀이 답 비어 있음 25문항
- 그림 판단 분포: NONE 25
- 난이도 분포: 1단계 9, 2단계 16
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q6**: 검사 코드: CHOICE_ORDER
- **Q7**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q8**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q9**: 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 검사 코드: CHOICE_ORDER
- **Q16**: 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 난이도 경계 (confidence=high, 원천 경계 B23) / 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q19**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q20**: 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 검사 코드: CHOICE_ORDER
- **Q23**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q25**: 난이도 경계 (confidence=high, 원천 경계 B23) / 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

두 점 $(-3, 0)$과 $(0, 9)$를 지나는 직선의 그래프와 평행한 일차방정식의 그래프는?

**보기** ① $3x - y + 4 = 0$  ② $x - 3y + 2 = 0$  ③ $3x + y - 1 = 0$  ④ $x + 3y + 5 = 0$  ⑤ $3x + y + 2 = 0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 점 (-3, 0)과 (0, 9)를 지나는 직선의 기울기는 (9 - 0) / (0 - (-3)) = 3 이다.
2. 주어진 보기 중 기울기가 3인 직선을 찾는다.
3. ① 3x - y + 4 = 0 에서 y = 3x + 4 이므로 기울기는 3이고 y절편은 4이다.
4. 따라서 평행한 직선은 ①번이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQUATION → M2-04-LINEAR_FUNCTION_BASIC**
- 근거 인용: 「두 점 $(-3, 0)$과」
**RPM** M2-RPM-050 [일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치] **원천→판정: 일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 두 직선의 평행·일치 → 일차함수 > 일차함수와 그 그래프 > 그래프의 성질 > 일차함수 그래프의 평행·일치**
- 이유: 기울기가 같고 y절편이 다른 3x 평행 조건을 적용한다.
**유형** PT=PT_LINE_EQUATION / TPL=TPL_LINE_PARALLEL
- 이유: 두 점을 지나는 직선의 기울기 3을 구하고 3x - y + 4 = 0 식의 평행을 판정하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기울기 3을 계산한 뒤 3x - y + 4 = 0 의 기울기와 일치함을 바로 확인할 수 있다.

**4칸**
- given: 직선←stem:「두 점 $(-3, 0)$과 $(0, 9)$를 지나는 직선의 그래프와」
- goal: 평행←stem:「평행한 일차방정식의 그래프는?」
- method: 기울기(NAMED)←solution:「기울기가 $3$으로 같고」
- condition: (없음)

**how** 두 점의 기울기 3과 일치하는 일차방정식 3x - y + 4 = 0 을 골랐다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 점 $(-3, 0)$과 $(0, 9)$를 지나는 직선의 기울기는 $\dfrac{9 - 0}{0 - (-3)} = \dfrac{9}{3} = 3$이다. ① $3x - y + 4 = 0 \implies y = 3x + 4$ (기울기 $3$, $y$절편 $4 \ne 9$) 따라서 기울기가 $3$으로 같고 $y$절편이 다른 직선은 ①이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

일차방정식 $x - ay + b = 0$의 그래프가 오른쪽 위로 향하고, $y$축과 음의 부분에서 만날 때, 상수 $a$, $b$의 부호로 옳은 것은?

**보기** ① $a < 0,\ b < 0$  ② $a < 0,\ b > 0$  ③ $a > 0,\ b < 0$  ④ $a > 0,\ b > 0$  ⑤ $a > 0,\ b = 0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. x - ay + b = 0 을 y에 대해 풀면 y = 1/a x + b/a 이다.
2. 그래프가 오른쪽 위로 향하므로 기울기 1/a > 0 에서 a > 0 이다.
3. y축과 음의 부분에서 만나므로 y절편 b/a < 0 이다.
4. a > 0 이므로 b < 0 이어야 한다.
5. 따라서 a > 0, b < 0 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「일차방정식 $x - ay +」
**RPM** M2-RPM-054 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프] (원천과 같음)
- 이유: 식 x - ay + b = 0 을 표준형으로 고쳐 그래프 성질을 분석한다.
**유형** PT=PT_LINE_EQUATION / TPL=TPL_LINE_TWO_POINTS
- 이유: 일차방정식 x - ay + b = 0 의 기울기와 y절편의 부호로부터 상수 a, b 의 부호를 결정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 방정식 x - ay + b = 0 에서 기울기와 절편의 부호 부등식을 세워 a, b를 구해야 한다.

**4칸**
- given: 일차방정식←stem:「일차방정식 $x - ay + b = 0$의 그래프가」
- goal: 부호←stem:「상수 $a$, $b$의 부호로 옳은 것은?」
- method: 기울기(NAMED)←solution:「오른쪽 위로 향하므로 기울기」
- condition: (없음)

**how** 기울기 1/a > 0 에서 a>0을 얻고 절편 b/a < 0 에서 b<0임을 도출하였다. ay

<details><summary>저장 해설 (판정 검토용)</summary>

$x - ay + b = 0$을 $y$에 대하여 정리하면 $y = \dfrac{1}{a}x + \dfrac{b}{a}$ 그래프가 오른쪽 위로 향하므로 기울기 $\dfrac{1}{a} > 0 \implies a > 0$ $y$축과 음의 부분에서 만나므로 $y$절편 $\dfrac{b}{a} < 0$ $a > 0$이므로 $b < 0$이다. $\therefore a > 0,\ b < 0$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점


**발문**

점 $(5, -2)$를 지나고 $x$축에 평행한 직선의 방정식은?

**보기** ① $x = 5$  ② $y = -2$  ③ $x = -2$  ④ $y = 5$  ⑤ $y = 2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. x축에 평행한 직선은 y좌표가 일정한 직선으로 y = k 꼴이다.
2. 점 (5, -2)를 지나므로 y = -2 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $(5, -2)$를 지나」
**RPM** M2-RPM-055 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > x축·y축에 평행한 직선] (원천과 같음)
- 이유: x축에 평행한 직선의 방정식 형태 y = k 에 좌표 -2 를 대입한다.
**유형** PT=PT_LINE_EQUATION / TPL=TPL_LINE_PARALLEL
- 이유: 점 (5, -2) 를 지나고 x축에 평행한 특수 직선의 방정식을 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: x축 평행 직선의 정의에 따라 y좌표 -2 를 취하면 즉시 결정된다.

**4칸**
- given: 직선←stem:「점 $(5, -2)$를 지나고」
- goal: 방정식←stem:「$x$축에 평행한 직선의 방정식은?」
- method: 평행(NAMED)←solution:「$x$축에 평행한 직선은 위의 모든 점의」
- condition: (없음)

**how** 점 (5, -2)의 y좌표가 -2이므로 x축에 평행한 직선 y = -2를 선택하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x$축에 평행한 직선은 위의 모든 점의 $y$좌표가 같으므로 $y = k$ 꼴이다. 점 $(5, -2)$를 지나므로 구하는 직선의 방정식은 $y = -2$이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

두 일차방정식 $x - y + 8 = 0$, $3x + y + 4 = 0$의 그래프와 $y$축으로 둘러싸인 도형의 넓이는?

**보기** ① $9$  ② $12$  ③ $15$  ④ $16$  ⑤ $18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. y = x + 8 과 y = -3x - 4 의 y절편은 (0, 8)과 (0, -4)이다.
2. 밑변의 길이는 8 - (-4) = 12 이다.
3. 두 직선의 교점은 x + 8 = -3x - 4 에서 4x = -12, x = -3 이다.
4. y축에서 교점까지의 거리는 |-3| = 3 이다.
5. 따라서 도형의 넓이는 1/2 * 12 * 3 = 18 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 일차방정식 $x - y」
**RPM** M2-RPM-058 [일차함수 > 일차함수와 일차방정식의 관계 > 그래프 활용 > 넓이] (원천과 같음)
- 이유: 두 직선의 y절편 차이와 교점 x좌표 절댓값으로 3x 도형의 넓이 18 을 계산한다.
**유형** PT=PT_FUNCTION_GRAPH_GEOMETRY / TPL=TPL_GRAPH_AREA_BY_SYMMETRY
- 이유: 두 일차방정식과 3x 그래프의 교점 및 y절편으로 둘러싸인 삼각형 넓이 18 을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 교점 (-3, 5)와 y축 위의 밑변 12를 구하여 넓이 18을 도출해야 한다. 3x

**4칸**
- given: 일차방정식←stem:「두 일차방정식 $x - y + 8 = 0$, $3x + y + 4 = 0$의 그래프와」
- goal: 넓이←stem:「$y$축으로 둘러싸인 도형의 넓이는?」
- method: 교점(NAMED)←solution:「두 직선의 교점은」
- condition: (없음)

**how** y절편 간격 12와 교점 x좌표 절댓값 3을 곱해 1/2*12*3 = 18을 구하였다. 3x

<details><summary>저장 해설 (판정 검토용)</summary>

두 일차방정식을 $y$에 대하여 정리하면 $y = x + 8$, $y = -3x - 4$ $y$절편은 각각 $(0, 8)$, $(0, -4)$이므로 $y$축 위의 밑변의 길이는 $8 - (-4) = 12$ 두 직선의 교점은 $x + 8 = -3x - 4 \implies 4x = -12 \implies x = -3$, $y = 5$ 교점 $(-3, 5)$에서 $y$축까지의 거리는 $|-3| = 3$이므로 $\therefore (\text{넓이}) = \dfrac{1}{2} \times 12 \times 3 = 18$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점


**발문**

연립방정식 $\begin{cases} 3x - y - 7 = 0 \ x + y - 5 = 0 \end{cases}$의 해는?

**보기** ① $x = 2,\ y = 3$  ② $x = 3,\ y = -2$  ③ $x = 4,\ y = 1$  ④ $x = 3,\ y = 2$  ⑤ $x = 1,\ y = 4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 3x - y - 7 = 0 과 x + y - 5 = 0 을 변끼리 더한다.
2. 4x - 12 = 0 이므로 x = 3 이다.
3. x = 3 을 두 번째 식에 대입하면 3 + y - 5 = 0 에서 y = 2 이다.
4. 따라서 x = 3, y = 2 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-056 [일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 교점과 연립방정식] (원천과 같음)
- 이유: 가감법으로 y를 소거하여 cases 연립방정식 3x 식의 해 x=3, y=2 를 구한다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS
- 이유: 연립방정식 cases 형태의 3x - y - 7 = 0 의 해이자 두 직선의 교점을 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 식을 더해 4x = 12 에서 x = 3, y = 2 를 쉽게 구할 수 있다. 3x

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} 3x - y - 7 = 0 \ x + y - 5 = 0 \end{cases}$의」
- goal: 방정식←stem:「의 해는?」
- method: 대입(NAMED)←solution:「대입하면」
- condition: (없음)

**how** 두 식을 가감하여 x = 3을 얻고 대입하여 y = 2를 구하였다. cases

<details><summary>저장 해설 (판정 검토용)</summary>

두 일차방정식을 변끼리 더하면 $(3x - y - 7) + (x + y - 5) = 0$ $4x - 12 = 0 \implies x = 3$ $x = 3$을 $x + y - 5 = 0$에 대입하면 $3 + y - 5 = 0 \implies y = 2$ $\therefore x = 3,\ y = 2$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

연립방정식 $\begin{cases} 6x - 5y + 10 = 0 \ ax - 5y - 2 = 0 \end{cases}$의 해가 없을 때, 이 연립방정식의 해가 무수히 많아지게 하려면 일차방정식 $ax - 5y - 2 = 0$의 그래프를 $y$축의 방향으로 얼마만큼 평행이동해야 하는가? (단, $a$는 상수이다.)

**보기** ① $-\dfrac{12}{5}$  ② $\dfrac{12}{5}$  ③ $\dfrac{8}{5}$  ④ $-\dfrac{8}{5}$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 6x - 5y + 10 = 0 에서 y = 6/5 x + 2 이다.
2. ax - 5y - 2 = 0 에서 y = a/5 x - 2/5 이다.
3. 해가 없으므로 기울기가 같아야 하여 a/5 = 6/5, 즉 a = 6 이다.
4. 해가 무수히 많으려면 두 직선이 일치해야 하므로 y절편이 같아야 한다.
5. 따라서 2 - (-2/5) = 12/5 만큼 y축 방향으로 평행이동해야 한다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「연립방정식 $\begin{c」
**RPM** M2-RPM-057 [일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 두 직선의 평행·일치] (원천과 같음)
- 이유: 두 직선의 평행 조건 a=6과 일치 조건을 만족하는 6x 평행이동량을 결정한다. ax
**유형** PT=PT_LINE_RELATION / TPL=TPL_RELATION_MULTIPLE_POSITION
- 이유: 연립방정식 6x 식의 불능 조건으로 a=6을 찾고 일치 조건의 평행이동량 12/5 를 구하는 유형이다. ax
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 해가 없을 조건에서 a=6을 구하고 y절편 차이 12/5 를 계산해야 한다. 6x

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin{cases} 6x - 5y + 10 = 0 \ ax - 5y - 2 = 0 \end{cases}$의」
- goal: 평행이동←stem:「얼마만큼 평행이동해야 하는가?」
- method: 그래프(NAMED)←solution:「두 식을 $y$에 대하여 정리하면」
- condition: (없음)

**how** 기울기가 같아 a=6이고 두 직선이 일치하도록 y절편 차 12/5만큼 평행이동해야 함을 구하였다. 6x

<details><summary>저장 해설 (판정 검토용)</summary>

두 식을 $y$에 대하여 정리하면 $y = \dfrac{6}{5}x + 2$, $y = \dfrac{a}{5}x - \dfrac{2}{5}$ 해가 없으므로 기울기가 같아야 하여 $a = 6$이다. 해가 무수히 많으려면 두 직선이 일치해야 하므로 $y = \dfrac{6}{5}x - \dfrac{2}{5}$의 그래프를 $y$축의 방향으로 $2 - \left(-\dfrac{2}{5}\right) = \dfrac{12}{5}$만큼 평행이동해야 한다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\triangle ABC$의 변 $AB$ 위의 점 $D$에 대하여 $\angle DBC = \angle BCD = 30^\circ$, $\overline{DB} = 11\text{ cm}$이고 $\angle DAC = 60^\circ$일 때, $\overline{AC}$의 길이는?

**보기** ① $9\text{ cm}$  ② $10\text{ cm}$  ③ $11\text{ cm}$  ④ $12\text{ cm}$  ⑤ $13\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형 BDC에서 각 DBC = 각 BCD = 30도이므로 이등변삼각형이다.
2. 따라서 DC = DB = 11 cm 이다.
3. 삼각형 외각 성질에 의해 각 ADC = 30 + 30 = 60도이다.
4. 삼각형 ADC에서 각 DAC = 60도, 각 ADC = 60도이므로 각 ACD = 60도인 정삼각형이다.
5. 따라서 AC = DC = 11 cm 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] **원천→판정: 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 판정 > 두 각 조건 → 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각**
- 이유: 두 밑각이 같은 이등변삼각형의 성질로 선분 길이 11 을 전파한다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_CONVERSE
- 이유: 이등변삼각형의 밑각 30도로 변 11 cm 를 옮기고 정삼각형을 판정하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 이등변삼각형과 외각 60도로 정삼각형을 식별하여 11 cm 를 즉시 도출한다.

**4칸**
- given: 길이←stem:「$\overline{DB} = 11\text{ cm}$이고 $\angle DAC = 60^\circ$일 때」
- goal: 삼각형←stem:「$\overline{AC}$의 길이는?」
- method: 정삼각형(NAMED)←solution:「즉 정삼각형이다」
- condition: (없음)

**how** 밑각 30도로 DC=11을 얻고 외각 60도로 정삼각형이 됨을 보여 AC=11cm를 구하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle BDC$에서 $\angle DBC = \angle BCD = 30^\circ$이므로 $\overline{DC} = \overline{DB} = 11\text{ cm}$ 삼각형의 외각 성질에 의해 $\angle ADC = 30^\circ + 30^\circ = 60^\circ$ $\triangle ADC$에서 $\angle DAC = 60^\circ$, $\angle ADC = 60^\circ$이므로 $\angle ACD = 60^\circ$, 즉 정삼각형이다. $\therefore \overline{AC} = \overline{DC} = 11\text{ cm}$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\angle A = 90^\circ$인 직각이등변삼각형 $ABC$($\overline{AB} = \overline{AC}$)에서 꼭짓점 $A$를 지나고 변 $BC$와 만나지 않는 직선 $l$을 긋고, 두 점 $B$, $C$에서 직선 $l$에 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{BD} = 9$, $\overline{CE} = 7$일 때, $\overline{DE}$의 길이는?

**보기** ① $12$  ② $13$  ③ $14$  ④ $15$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각이등변삼각형 ABC에서 AB = AC 이고 각 ADB = 각 CEA = 90도이다.
2. 각 DAB + 각 DBA = 90도이고 각 DAB + 각 EAC = 90도이므로 각 DBA = 각 EAC 이다.
3. 따라서 삼각형 ABD와 CAE는 RHA 합동이다.
4. AD = CE = 7 이고 AE = BD = 9 이다.
5. 따라서 DE = DA + AE = 7 + 9 = 16 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle A = 90^」
**RPM** M2-RPM-071 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] (원천과 같음)
- 이유: 직각삼각형의 RHA 합동을 이용하여 대응변의 합으로 DE 를 계산한다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE
- 이유: 직각이등변삼각형의 꼭짓점을 지나는 직선에서 RHA 합동으로 선분 DE 의 길이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 직각삼각형의 RHA 합동을 증명하고 AD=7, AE=9를 더해 16을 얻어야 한다. DE

**4칸**
- given: 직각이등변삼각형←stem:「$\angle A = 90^\circ$인 직각이등변삼각형 $ABC$」
- goal: 수선←stem:「$\overline{DE}$의 길이는?」
- method: 합동(NAMED)←solution:「($\text{RHA}$ 합동)」
- condition: (없음)

**how** 삼각형 ABD와 CAE의 RHA 합동에서 AD=7, AE=9를 찾아 DE=16을 계산하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ADB = \angle CEA = 90^\circ$, $\overline{AB} = \overline{AC}$, $\angle DAB = \angle ECA$이므로 $\triangle ABD \equiv \triangle CAE$ ($\text{RHA}$ 합동) 따라서 $\overline{AD} = \overline{CE} = 7$, $\overline{AE} = \overline{BD} = 9$이다. $\therefore \overline{DE} = \overline{DA} + \overline{AE} = 7 + 9 = 16$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 직각삼각형 $ABC$와 $DEF$($\angle C = \angle F = 90^\circ$)에서 $\overline{AB} = \overline{DE}$, $\overline{AC} = \overline{DF}$이다. 다음은 두 직각삼각형의 합동 조건을 설명하는 과정이다. 괄호 안에 들어갈 것으로 옳은 것은? $\triangle DEF$를 뒤집어 길이가 같은 두 변 $AC$와 $DF$가 서로 겹치도록 놓으면 $\angle ACB + \angle DFE = 90^\circ + 90^\circ = 180^\circ$이다. 따라서 세 점 $B$, $C(F)$, $E$는 한 직선 위에 있으므로 $\triangle ABE$가 만들어진다. 이때 $\triangle ABE$는 $\overline{AB} = \overline{AE}$이므로 이등변삼각형이다. $\triangle ABC$와 $\triangle DEF$에서 $\angle C = \angle F = 90^\circ\ \cdots\cdots\text{㉠}$, $\overline{AB} = \overline{DE}\ \cdots\cdots\text{㉡}$, 또 $\triangle ABE$는 이등변삼각형이므로 $\angle B = \angle E\ \cdots\cdots\text{㉢}$. ㉠, ㉡, ㉢에서 (　　　　　　) $\triangle ABC \equiv \triangle DEF$이다.

**보기** ① 두 직각삼각형의 빗변의 길이와 한 예각의 크기가 각각 같으므로  ② 두 직각삼각형의 세 변의 길이가 각각 같으므로  ③ 두 직각삼각형의 두 변의 길이와 그 끼인각의 크기가 같으므로  ④ 두 직각삼각형의 빗변의 길이와 다른 한 변의 길이가 각각 같으므로  ⑤ 두 직각삼각형의 세 내각의 크기가 각각 같으므로

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각 C = F = 90도이다.
2. 빗변 AB = DE 이다.
3. 붙여서 만든 이등변삼각형 ABE에서 각 B = 각 E (한 예각)이다.
4. 따라서 빗변의 길이와 한 예각의 크기가 각각 같으므로 합동이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 직각삼각형 $ABC$와」
**RPM** M2-RPM-071 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] (원천과 같음)
- 이유: 빗변과 한 예각의 크기가 같아 합동이 되는 RHA 논리를 점검한다. DF
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE
- 이유: 변 DF 를 겹쳐 직각삼각형의 RHA 합동 유도 증명 빈칸을 완성하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 빗변과 한 예각이 같음을 확인하는 서술형 빈칸을 바로 판별할 수 있다. DF

**4칸**
- given: 직각삼각형←stem:「두 직각삼각형 $ABC$와 $DEF$」
- goal: 조건←stem:「괄호 안에 들어갈 것으로 옳은 것은?」
- method: 이등변삼각형(NAMED)←solution:「두 직각삼각형의 빗변의 길이와 한 예각의 크기가 각각 같으므로」
- condition: (없음)

**how** 빗변 AB=DE와 예각 B=E가 같으므로 빗변과 한 예각 조건인 1번을 선택하였다. DF

<details><summary>저장 해설 (판정 검토용)</summary>

㉠ $\angle C = \angle F = 90^\circ$ (직각), ㉡ $\overline{AB} = \overline{DE}$ (빗변), ㉢ $\angle B = \angle E$ (한 예각)이므로 두 직각삼각형의 빗변의 길이와 한 예각의 크기가 각각 같으므로 합동이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 3점


**발문**

예각삼각형 $ABC$의 외심을 $O$라 하자. $\angle OBC = 28^\circ$, $\angle ACO = 47^\circ$, $\angle BAO = x^\circ$일 때, $x$의 값은?

**보기** ① $10$  ② $12$  ③ $14$  ④ $15$  ⑤ $18$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심 O에서 OA = OB = OC 이므로 각 BCO = 28도, 각 OAC = 47도, 각 ABO = x도이다.
2. 삼각형 ABC의 세 내각의 합은 180도이므로 2(x + 28 + 47) = 180 이다.
3. x + 75 = 90 이므로 x = 15 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「예각삼각형 $ABC$의 외심」
**RPM** M2-RPM-065 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] (원천과 같음)
- 이유: 외심에서 세 꼭짓점을 잇는 이등변삼각형 각의 합 28+47+x=90 을 적용한다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER
- 이유: 삼각형의 외심에서 각 꼭짓점에 이르는 거리가 같음을 이용해 각 28도 등에서 x를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: x + 28 + 47 = 90 공식으로 x = 15 를 간단히 산출할 수 있다.

**4칸**
- given: 외심←stem:「예각삼각형 $ABC$의 외심을 $O$라 하자」
- goal: 삼각형←stem:「$x$의 값은?」
- method: 내각(NAMED)←solution:「세 내각의 합은 $180^\circ$이므로」
- condition: (없음)

**how** 외심의 각 관계 x + 28 + 47 = 90 으로부터 x = 15를 계산하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $O$는 외심이므로 $\overline{OA} = \overline{OB} = \overline{OC}$이다. 따라서 $\angle BCO = \angle OBC = 28^\circ$, $\angle OAC = \angle ACO = 47^\circ$, $\angle ABO = \angle BAO = x^\circ$ $\triangle ABC$의 세 내각의 합은 $180^\circ$이므로 $2(x + 28 + 47) = 180$ $x + 75 = 90 \implies x = 15$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

점 $O$는 $\triangle ABC$의 외심이고 $\overline{AB} = 11\text{ cm}$이다. $\triangle OAB$의 둘레의 길이가 $25\text{ cm}$일 때, $\triangle ABC$의 외접원의 넓이는?

**보기** ① $25\pi\text{ cm}^2$  ② $36\pi\text{ cm}^2$  ③ $\dfrac{169}{4}\pi\text{ cm}^2$  ④ $42\pi\text{ cm}^2$  ⑤ $49\pi\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외접원의 반지름을 R 이라 하면 OA = OB = R 이다.
2. 삼각형 OAB의 둘레가 25 cm 이므로 R + R + 11 = 25 이다.
3. 2R = 14 이므로 R = 7 cm 이다.
4. 따라서 외접원의 넓이는 pi * 7^2 = 49 pi cm^2 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$는 $\triang」
**RPM** M2-RPM-068 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산] (원천과 같음)
- 이유: 외심 둘레 공식 2R + 11 = 25 로부터 반지름 7을 찾아 원의 넓이를 구한다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER
- 이유: 둘레 25 cm 로부터 외접원의 반지름을 구하고 외접원의 넓이를 계산하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 둘레 25 에서 2R = 14, R = 7 을 얻어 넓이 49pi 를 바로 계산할 수 있다.

**4칸**
- given: 외심←stem:「점 $O$는 $\triangle ABC$의 외심이고」
- goal: 외접←stem:「$\triangle ABC$의 외접원의 넓이는?」
- method: 반지름(NAMED)←solution:「외접원의 반지름의 길이를」
- condition: (없음)

**how** 둘레 25에서 반지름 R=7을 구하고 넓이 pi*7^2 = 49pi를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

외접원의 반지름의 길이를 $R\text{ cm}$라 하면 $\overline{OA} = \overline{OB} = R\text{ cm}$이다. $\triangle OAB$의 둘레의 길이가 $25\text{ cm}$이므로 $R + R + 11 = 25 \implies 2R = 14 \implies R = 7$ $\therefore (\text{외접원의 넓이}) = \pi \times 7^2 = 49\pi\text{ (cm}^2\text{)}$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

$\angle C = 90^\circ$이고 $\overline{AB} = 10\text{ cm}$, $\overline{BC} = 6\text{ cm}$, $\overline{AC} = 8\text{ cm}$인 직각삼각형 $ABC$의 내심을 $I$라 할 때, $\triangle IAB$의 넓이는?

**보기** ① $6\text{ cm}^2$  ② $8\text{ cm}^2$  ③ $10\text{ cm}^2$  ④ $12\text{ cm}^2$  ⑤ $16\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 ABC의 넓이는 1/2 * 6 * 8 = 24 cm^2 이다.
2. 내접원 반지름 r에 대해 24 = 1/2 * (10 + 6 + 8) * r = 12r 에서 r = 2 cm 이다.
3. 삼각형 IAB 의 넓이는 1/2 * 10 * r = 1/2 * 10 * 2 = 10 cm^2 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle C = 90^」
**RPM** M2-RPM-067 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 내심과 거리] (원천과 같음)
- 이유: 내심과 변 사이의 거리 r=2를 구해 삼각형 IAB 의 넓이에 적용한다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_SEMANTIC
- 이유: 직각삼각형의 넓이로부터 내접원 반지름을 구하고 삼각형 IAB 의 넓이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 넓이 24 = 12r 에서 r=2를 구하고 밑변 10과의 곱으로 넓이를 산출한다. IAB

**4칸**
- given: 내심←stem:「직각삼각형 $ABC$의 내심을 $I$라 할 때」
- goal: 직각삼각형←stem:「$\triangle IAB$의 넓이는?」
- method: 내접(NAMED)←solution:「내접원의 반지름의 길이를」
- condition: (없음)

**how** 전체 넓이 24에서 내접원 반지름 r=2를 얻어 삼각형 IAB의 넓이 10을 구하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

내접원의 반지름의 길이를 $r\text{ cm}$라 하면 $\triangle ABC$의 넓이는 $\dfrac{1}{2} \times 6 \times 8 = 24\text{ cm}^2$이므로 $24 = \dfrac{1}{2}(10 + 6 + 8)r = 12r \implies r = 2\text{ cm}$ 점 $I$에서 변 $AB$까지의 거리가 $2\text{ cm}$이므로 $\therefore \triangle IAB = \dfrac{1}{2} \times 10 \times 2 = 10\text{ (cm}^2\text{)}$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

다음 과정을 읽고 <보기> 중 옳은 것만을 있는 대로 고른 것은? ① 종이를 오려서 만든 $\triangle ABC$에서 $\angle A$의 두 변이 서로 포개어지도록 접었다 펼쳐서 $\angle A$의 이등분선을 만든다. ② 같은 방법으로 $\angle B$의 이등분선을 만든다. ③ ①과 ②에서 생긴 두 선분의 교점을 $I$라 하고, 점 $I$에서 변 $AB$에 내린 수선의 발을 $D$라 하자. 〈보기〉 ㄱ. $\overline{AI} = \overline{BI}$ ㄴ. $\angle ABI = \angle CBI$ ㄷ. $\overline{BI} = 6$이면 $\triangle ABC$의 외접원의 넓이는 $36\pi$이다. ㄹ. $\overline{ID} = 3$이면 $\triangle ABC$의 내접원의 넓이는 $9\pi$이다.

**보기** ① ㄴ, ㄹ  ② ㄴ  ③ ㄱ, ㄴ  ④ ㄱ, ㄷ  ⑤ ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 A, B의 이등분선의 교점 I는 내심이다.
2. ㄱ. AI = BI 는 외심의 성질이므로 거짓이다.
3. ㄴ. BI는 각의 이등분선이므로 각 ABI = 각 CBI 이다 (참).
4. ㄷ. BI는 외접원 반지름이 아니므로 넓이가 36 pi 가 아니다 (거짓).
5. ㄹ. ID는 내접원 반지름이므로 내접원 넓이는 pi * 3^2 = 9 pi 이다 (참).
6. 따라서 옳은 것은 ㄴ, ㄹ이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 과정을 읽고 <보기>」
**RPM** M2-RPM-066 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] (원천과 같음)
- 이유: 각의 이등분선의 교점인 내심의 성질과 내접원의 반지름 성질을 확인한다. 36
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_SEMANTIC
- 이유: 각의 이등분선으로 작도된 내심의 성질과 36 등 선지의 참·거짓을 판별하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심과 외심의 성질을 구분하고 외접원 36pi 와 내접원 9pi 의 참·거짓을 가려야 한다.

**4칸**
- given: 이등분선←stem:「접었다 펼쳐서 $\angle A$의 이등분선을 만든다」
- goal: 내접←stem:「<보기> 중 옳은 것만을 있는 대로 고른 것은?」
- method: 교점(NAMED)←solution:「두 내각의 이등분선의 교점 $I$는」
- condition: (없음)

**how** 내심의 성질에 따라 각의 이등분선 성질 ㄴ과 내접원 반지름 성질 ㄹ을 골랐다. 36

<details><summary>저장 해설 (판정 검토용)</summary>

두 내각의 이등분선의 교점 $I$는 $\triangle ABC$의 내심이다. ㄱ. $\overline{AI} = \overline{BI}$는 외심의 성질이므로 거짓이다. ㄴ. $\overline{BI}$는 $\angle B$의 이등분선이므로 $\angle ABI = \angle CBI$이다. (참) ㄷ. $\overline{BI}$는 내심까지의 거리이므로 외접원의 반지름이 아니다. (거짓) ㄹ. $\overline{ID}$는 내접원의 반지름이므로 내접원의 넓이는 $\pi \times 3^2 = 9\pi$이다. (참) $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 3점


**발문**

평행사변형 $ABCD$에서 $\overline{AB} = x\text{ cm}$, $\overline{CD} = 12\text{ cm}$이고 $\angle A = y^\circ$, $\angle B = 118^\circ$일 때, $x + y$의 값은?

**보기** ① $70$  ② $74$  ③ $76$  ④ $80$  ⑤ $84$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형에서 대변의 길이는 같으므로 x = CD = 12 이다.
2. 이웃한 두 내각의 합은 180도이므로 y + 118 = 180 에서 y = 62 이다.
3. 따라서 x + y = 12 + 62 = 74 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형의 대변 상등 x=12와 이웃 내각 합 118+y=180 을 적용한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 평행사변형의 대변 길이와 118도 이웃각의 합 180도 성질을 이용하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대변 x=12와 180-118=62를 구하여 합 74를 즉시 계산할 수 있다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 $\overline{AB} = x\text{ cm}$」
- goal: 평행사변형←stem:「$x + y$의 값은?」
- method: 내각(NAMED)←solution:「이웃한 두 내각의 합은 $180^\circ$이므로」
- condition: (없음)

**how** 대변 x=12와 이웃각 합으로 y=62를 얻어 x+y=74를 계산하였다. 118

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형의 대변의 길이는 같으므로 $x = \overline{AB} = \overline{CD} = 12$ 이웃한 두 내각의 합은 $180^\circ$이므로 $y + 118 = 180 \implies y = 62$ $\therefore x + y = 12 + 62 = 74$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 하자. $\overline{CD} = 12\text{ cm}$이고, $\triangle ABO$의 둘레의 길이가 $33\text{ cm}$일 때, $\overline{AC} + \overline{BD}$의 값은?

**보기** ① $33\text{ cm}$  ② $36\text{ cm}$  ③ $38\text{ cm}$  ④ $40\text{ cm}$  ⑤ $42\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형에서 AB = CD = 12 cm 이다.
2. 삼각형 ABO의 둘레가 33 cm 이므로 AO + BO = 33 - 12 = 21 cm 이다.
3. 두 대각선은 서로 이등분하므로 AC = 2 AO, BD = 2 BO 이다.
4. 따라서 AC + BD = 2(AO + BO) = 2 * 21 = 42 cm 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서」
**RPM** M2-RPM-073 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 평행사변형의 대각선 성질] (원천과 같음)
- 이유: 대각선이 서로 이등분함을 이용하여 33 cm 둘레 조건에서 2배를 취한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 평행사변형의 둘레 33 cm 와 대각선 이등분 성질을 이용해 두 대각선의 합을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: AO + BO = 21을 구하고 대각선 이등분 성질로 2배하여 42를 도출한다. 33

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 두 대각선의 교점을 $O$라 하자」
- goal: 둘레←stem:「$\overline{AC} + \overline{BD}$의 값은?」
- method: 대각선(NAMED)←solution:「두 대각선은 서로 다른 것을 이등분하므로」
- condition: (없음)

**how** AO+BO = 33-12 = 21에서 대각선 길이 합은 2배인 42임을 계산하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형에서 $\overline{AB} = \overline{CD} = 12\text{ cm}$이므로 $\overline{AO} + \overline{BO} = 33 - 12 = 21\text{ cm}$ 두 대각선은 서로 다른 것을 이등분하므로 $\overline{AC} = 2\overline{AO}$, $\overline{BD} = 2\overline{BO}$ $\therefore \overline{AC} + \overline{BD} = 2(\overline{AO} + \overline{BO}) = 2 \times 21 = 42\text{ cm}$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 평행사변형 $ABCD$의 두 쌍의 대변의 길이는 각각 같고, 두 쌍의 대각의 크기는 각각 같음을 설명하는 과정이다. 괄호 ①~⑤에 들어갈 기호로 적절하지 않은 것은? 평행사변형 $ABCD$에 대각선 $AC$를 긋자. $\triangle ABC$와 $\triangle CDA$에서 ($\boxed{\text{①}}$)이므로 $\angle BAC = \angle DCA$ (엇각) $\cdots\cdots\text{㉠}$ $\overline{AD} \parallel \overline{BC}$이므로 ($\boxed{\text{②}}$) (엇각) $\cdots\cdots\text{㉡}$ $\overline{AC}$는 공통 $\cdots\cdots\text{㉢}$ ㉠, ㉡, ㉢에 의하여 ($\boxed{\text{③}}$) ($\text{ASA}$ 합동)이다. 따라서 $\overline{AB} = \overline{DC}$, $\overline{AD} = \overline{BC}$, $\angle B = \angle D$이다. 또 ㉠, ㉡에 의하여 $\angle A = (\boxed{\text{④}}) = \angle DCA + \angle ACB = (\boxed{\text{⑤}})$이다.

**보기** ① $\overline{AB} \parallel \overline{DC}$  ② $\angle BCA = \angle DAC$  ③ $\triangle ABC \equiv \triangle CDA$  ④ $\angle B = \angle C$  ⑤ $\angle C$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① AB // DC, ② 각 BCA = 각 DAC, ③ 삼각형 ABC 합동 삼각형 CDA 이다.
2. 각 A = 각 BAC + 각 CAD = 각 DCA + 각 ACB = 각 C 이다.
3. ④의 자리에는 각 BAC + 각 CAD 가 들어가야 하므로 각 B = 각 C 는 적절하지 않다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 평행사변형 $ABCD」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 대변과 대각 상등 증명 과정에서 엇각 DCA 의 논리적 전개를 검토한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 대각선에 의한 엇각 DCA 과 평행사변형 성질 증명 빈칸의 적절성을 판별하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 A의 분할각 합이 들어가야 할 4번 자리에 각 B = 각 C가 적힌 오류를 찾아낸다. DCA

**4칸**
- given: 평행사변형←stem:「다음은 평행사변형 $ABCD$의 두 쌍의 대변의 길이는 각각 같고」
- goal: 대각선←stem:「괄호 ①~⑤에 들어갈 기호로 적절하지 않은 것은?」
- method: 엇각(NAMED)←solution:「들어가야 하므로」
- condition: (없음)

**how** 각 A를 두 각의 합으로 나타내어야 할 자리에 각 B=각 C가 들어간 4번이 잘못되었음을 확인하였다. DCA

<details><summary>저장 해설 (판정 검토용)</summary>

① $\overline{AB} \parallel \overline{DC}$, ② $\angle BCA = \angle DAC$, ③ $\triangle ABC \equiv \triangle CDA$, ⑤ $\angle C$가 알맞다. ④의 자리에는 $\angle A$를 두 각으로 나눈 $\angle BAC + \angle CAD$가 들어가야 하므로 $\angle B = \angle C$는 적절하지 않다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

넓이가 $40\text{ cm}^2$인 평행사변형 $ABCD$의 두 대각선의 교점 $O$를 지나는 직선이 변 $AD$, 변 $BC$와 만나는 점을 각각 $E$, $F$라 하자. 다음 중 옳지 않은 것은?

**보기** ① $\triangle AOB = 10\text{ cm}^2$  ② $\triangle AOE + \triangle BFO = 10\text{ cm}^2$  ③ $\triangle AOB = \triangle FOB$  ④ $\triangle COD = \triangle AOD$  ⑤ $\square FCDE = 20\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 넓이가 40 cm^2 이므로 대각선 4등분 넓이는 각각 10 cm^2 이다 (①, ④ 참).
2. 삼각형 AOE 합동 COF 이므로 삼각형 AOE + BFO = 10 cm^2 이다 (② 참).
3. 사각 FCDE 는 전체 넓이의 절반인 20 cm^2 이다 (⑤ 참).
4. 직선 EF의 기울기에 따라 삼각형 FOB의 넓이는 변하므로 삼각형 AOB = FOB 는 항상 성립하지 않는다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「넓이가 $40\text{ c」
**RPM** M2-RPM-077 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 분할도형] (원천과 같음)
- 이유: 대각선 교점을 지나는 직선에 의해 40 cm^2 평행사변형이 20 cm^2 로 이등분됨을 분석한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 넓이 40 cm^2 인 평행사변형의 대각선 교점을 지나는 직선의 분할 넓이 성질을 검증하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 40 cm^2 평행사변형에서 분할도형의 합동과 넓이 불변성을 판별해야 한다.

**4칸**
- given: 평행사변형←stem:「넓이가 $40\text{ cm}^2$인 평행사변형 $ABCD$의」
- goal: 대각선←stem:「다음 중 옳지 않은 것은?」
- method: 넓이(NAMED)←solution:「두 대각선은 넓이를 $4$등분하므로」
- condition: (없음)

**how** F의 위치에 따라 삼각형 FOB의 넓이가 변하므로 항상 같지 않은 3번을 선택하였다. 40

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형의 두 대각선은 넓이를 $4$등분하므로 $\triangle AOB = \triangle COD = \triangle AOD = 10\text{ cm}^2$ (①, ④ 참) $\triangle AOE \equiv \triangle COF$이고 $\triangle DOE \equiv \triangle BOF$ ($\text{ASA}$ 합동)이므로 $\triangle AOE + \triangle BFO = \triangle AOE + \triangle DOE = \triangle AOD = 10\text{ cm}^2$ (② 참) $\square FCDE = \dfrac{1}{2}\square ABCD = 20\text{ cm}^2$ (⑤ 참) 반면 점 $F$의 위치는 직선 $EF$에 따라 달라지므로 $\triangle AOB = \triangle FOB$는 항상 성립하지 않는다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

평행사변형 $ABCD$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $F$, 선분 $AF$의 연장선이 변 $CD$의 연장선과 만나는 점을 $E$라 하자. $\overline{AB} = 10\text{ cm}$이고 $\overline{FC} = x\text{ cm}$, $\overline{DE} = y\text{ cm}$, $x + y = 26$일 때, $x$의 값은?

**보기** ① $4$  ② $5$  ③ $6$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. AD // BC 이므로 엇각에 의해 각 AFB = 각 FAD = 각 BAF 이다.
2. 따라서 삼각형 ABF는 이등변삼각형이므로 BF = AB = 10 cm 이다.
3. AB // CD 이므로 각 AED = 각 EAD 에서 DE = AD = BC = 10 + x 이다 (y = 10 + x).
4. x + y = 26 에 대입하면 x + (10 + x) = 26 에서 2x = 16, x = 8 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] **원천→판정: 사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질 → 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각**
- 이유: 평행선과 각 이등분선이 만드는 이등변삼각형을 이용해 26 식에 대입한다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_CONVERSE
- 이유: 평행사변형의 각 이등분선으로 이등변삼각형을 유도하고 x + y = 26 연립으로 x를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: BF=10, DE=10+x 관계를 이등변삼각형으로 찾고 x + y = 26 을 풀어야 한다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 $\angle A$의 이등분선이」
- goal: 이등분선←stem:「$x + y = 26$일 때, $x$의 값은?」
- method: 대입(NAMED)←solution:「대입하면」
- condition: (없음)

**how** 이등변삼각형으로 y = 10 + x를 얻어 x + (10 + x) = 26에서 x = 8을 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD} \parallel \overline{BC}$이므로 $\angle AFB = \angle FAD = \angle BAF$, 따라서 $\overline{BF} = \overline{AB} = 10\text{ cm}$ $\overline{AB} \parallel \overline{CE}$이므로 $\angle AED = \angle BAE = \angle EAD$, 따라서 $\overline{DE} = \overline{AD} = \overline{BC}$ 즉 $y = \overline{DE} = 10 + x$이다. $x + y = 26$에 대입하면 $x + (10 + x) = 26 \implies 2x = 16 \implies x = 8$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

직사각형 $ABCD$의 두 대각선의 교점을 $O$라고 할 때, 다음 <보기> 중 옳은 것만을 있는 대로 고른 것은? 〈보기〉 ㄱ. $\angle AOB = 90^\circ$　ㄴ. $\overline{AO} = \overline{BO}$　ㄷ. $\overline{BO} = \overline{DO}$ ㄹ. $\overline{AC} = \overline{BD}$　ㅁ. $\triangle AOB \equiv \triangle COB$　ㅂ. $\overline{AB} = \overline{AD}$

**보기** ① ㄱ, ㄴ  ② ㄱ, ㄴ, ㄹ  ③ ㄴ, ㄷ, ㅂ  ④ ㄴ, ㄷ, ㄹ  ⑤ ㄴ, ㄷ, ㄹ, ㅁ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직사각형의 두 대각선은 길이가 같고(AC = BD) 서로 다른 것을 이등분한다 (AO = BO = CO = DO).
2. 따라서 ㄴ, ㄷ, ㄹ이 참이다.
3. 대각선의 수직(ㄱ)과 이웃 변 상등(ㅂ), 이웃 삼각형 COB 합동(ㅁ)은 마름모나 정사각형의 성질로 거짓이다.
4. 따라서 옳은 것은 ㄴ, ㄷ, ㄹ이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직사각형 $ABCD$의 두」
**RPM** M2-RPM-079 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] (원천과 같음)
- 이유: 직사각형 대각선의 길이 상등과 이등분 성질을 확인하여 참인 보기를 고른다. COB
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 직사각형 대각선의 성질과 이웃 삼각형 COB 등의 합동 진위를 선별하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직사각형 대각선의 성질인 ㄴ, ㄷ, ㄹ을 정확히 식별할 수 있다. COB

**4칸**
- given: 직사각형←stem:「직사각형 $ABCD$의 두 대각선의 교점을 $O$라고 할 때」
- goal: 대각선←stem:「<보기> 중 옳은 것만을 있는 대로 고른 것은?」
- method: 이등분선(NAMED)←solution:「서로 다른 것을 이등분」
- condition: (없음)

**how** 직사각형 대각선 길이가 같고 서로 이등분하는 성질 ㄴ, ㄷ, ㄹ을 골랐다. COB

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형의 두 대각선은 길이가 같고($\overline{AC} = \overline{BD}$) 서로 다른 것을 이등분($\overline{AO} = \overline{BO} = \overline{CO} = \overline{DO}$)하므로 ㄴ, ㄷ, ㄹ이 참이다. 직사각형에서 대각선의 직교(ㄱ), 이웃한 두 변의 길이 일치(ㅂ), 이웃 삼각형 합동(ㅁ)은 일반적으로 성립하지 않는다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 마름모인 것을 모두 고르면? (정답 2개)

**보기** ① 두 쌍의 대각의 크기가 각각 같고, 두 대각선이 서로 수직으로 만나는 사각형  ② 네 변의 길이가 모두 같은 사각형  ③ 두 쌍의 대변의 길이가 각각 같은 사각형  ④ 한 쌍의 대변이 평행하고, 나머지 한 쌍의 대변의 길이가 같은 사각형  ⑤ 한 내각이 직각이고, 한 쌍의 이웃하는 두 변의 길이가 같은 사각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 두 쌍의 대각이 같으면 평행사변형이고 대각선이 수직이면 마름모이다 (참).
2. ② 네 변의 길이가 모두 같은 사각형은 마름모의 정의이다 (참).
3. ③은 일반 평행사변형, ④와 ⑤는 직사각형이나 다른 사각형으로 마름모를 보장하지 않는다.
4. 따라서 마름모인 것은 2 개로 ①, ②이다.
- 작성자 답: ①, ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 마름모인 것을 모두」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] (원천과 같음)
- 이유: 네 변의 길이 상등 및 대각선 수직 조건으로 마름모 2 개를 판정한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 마름모의 정의와 평행사변형이 마름모가 되는 2 개 조건을 판별하는 다중 정답 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 마름모의 정의와 평행사변형에 대각선 수직 조건이 추가된 2 개 명제를 가려낸다.

**4칸**
- given: 마름모←stem:「다음 중 마름모인 것을 모두 고르면? (정답 2개)」
- goal: 마름모←stem:「마름모인 것을 모두 고르면? (정답 2개)」
- method: 정의(NAMED)←solution:「마름모의 정의이다」
- condition: (없음)

**how** 대각선 수직인 평행사변형 1번과 네 변의 길이가 같은 2번을 마름모로 선택하였다. 2

<details><summary>저장 해설 (판정 검토용)</summary>

① 두 쌍의 대각이 같으면 평행사변형이고, 여기에 두 대각선이 수직이므로 마름모이다. ② 네 변의 길이가 모두 같은 사각형은 마름모의 정의이다. ③은 평행사변형, ④와 ⑤는 일반적으로 마름모를 보장하지 않는다. $\therefore$ ①, ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

마름모 $ABCD$의 두 대각선의 교점을 $O$라 할 때 $\angle BCO = 54^\circ$, $\angle CBO = x^\circ$이다. 또 정사각형 $EFGH$의 대각선 $\overline{FH} = 14\text{ cm}$이고 두 대각선의 교점을 $O'$이라 할 때 $\overline{EO'} = y\text{ cm}$이다. 이때 $x + y$의 값은?

**보기** ① $43$  ② $39$  ③ $41$  ④ $45$  ⑤ $47$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 마름모의 두 대각선은 수직이므로 각 BOC = 90도이다.
2. 삼각형 BOC에서 x = 180 - (90 + 54) = 36 이다.
3. 정사각형의 두 대각선은 길이가 같고 서로 이등분하므로 y = 1/2 * 14 = 7 이다.
4. 따라서 x + y = 36 + 7 = 43 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$의 두 대」
**RPM** M2-RPM-079 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] (원천과 같음)
- 이유: 마름모의 대각선 수직과 정사각형의 대각선 14 이등분 성질을 각각 적용한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 마름모 대각선의 직교 성질과 정사각형 대각선 14 cm 이등분 성질을 결합하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 마름모에서 x=36을 구하고 대각선 14 에서 y=7을 얻어 합 43을 계산한다.

**4칸**
- given: 마름모←stem:「마름모 $ABCD$의 두 대각선의 교점을 $O$라 할 때」
- goal: 정사각형←stem:「이때 $x + y$의 값은?」
- method: 수선(NAMED)←solution:「마름모의 두 대각선은 서로 수직이므로」
- condition: (없음)

**how** 마름모 직교에서 x=36, 정사각형 대각선 절반 y=7을 찾아 36+7=43을 구하였다. 14

<details><summary>저장 해설 (판정 검토용)</summary>

마름모의 두 대각선은 서로 수직이므로 $\angle BOC = 90^\circ$ $\triangle BOC$에서 $x = 180 - (90 + 54) = 36$ 정사각형의 두 대각선은 길이가 같고 서로 다른 것을 이등분하므로 $y = \overline{EO'} = \dfrac{1}{2}\overline{EG} = \dfrac{1}{2}\overline{FH} = \dfrac{1}{2} \times 14 = 7$ $\therefore x + y = 36 + 7 = 43$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 객관식 5점


**발문**

평행사변형 $ABCD$의 두 꼭짓점 $B$, $D$에서 대각선 $AC$에 내린 수선의 발을 각각 $P$, $Q$라고 하자. $\angle PBQ = 32^\circ$일 때, $\angle DAP + \angle QBC$의 크기는?

**보기** ① $54^\circ$  ② $58^\circ$  ③ $60^\circ$  ④ $62^\circ$  ⑤ $64^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. BP perp AC 이므로 직각삼각형 BPQ에서 각 BQP = 90 - 32 = 58도이다.
2. A, P, Q, C가 일직선 위에 있으므로 각 BQC = 180 - 58 = 122도이다.
3. AD // BC 이므로 엇각에 의해 각 DAP = 각 QCB 이다.
4. 삼각형 BQC에서 각 QCB + 각 QBC = 180 - 122 = 58도이다.
5. 따라서 각 DAP + 각 QBC = 58도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$의 두」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형의 평행선 엇각과 32도 직각삼각형의 내각을 연계한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 대각선에 내린 수선과 32도 각으로부터 엇각과 삼각형 외각 관계를 이용하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 각 BQP=58도를 구하고 평행선 엇각을 치환하여 각의 합 58도를 유도한다. 32

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$의 두 꼭짓점 $B$, $D$에서」
- goal: 수선←stem:「$\angle DAP + \angle QBC$의 크기는?」
- method: 엇각(NAMED)←solution:「엇각으로」
- condition: (없음)

**how** 직각삼각형에서 58도를 구하고 평행선 엇각을 치환하여 합 58도를 도출하였다. 32

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BP} \perp \overline{AC}$이므로 직각삼각형 $BPQ$에서 $\angle BQP = 90^\circ - 32^\circ = 58^\circ$ $A$, $P$, $Q$, $C$가 한 직선 위에 있으므로 $\angle BQC = 180^\circ - 58^\circ = 122^\circ$ $\overline{AD} \parallel \overline{BC}$이므로 엇각으로 $\angle DAP = \angle QCB$ $\therefore \angle DAP + \angle QBC = \angle QCB + \angle QBC = 180^\circ - 122^\circ = 58^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 6점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

좌표평면 위의 직선 $l$은 두 점 $(-2, 1)$, $(2, 3)$을 지나고, 직선 $m$은 두 점 $(0, -2)$, $(1, 1)$을 지난다. 두 직선 $l$, $m$의 방정식을 각각 구하고, 두 직선의 교점의 좌표를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $y = \dfrac{1}{2}x + 2$, $y = 3x - 2$, 교점 $\left(\dfrac{8}{5}, \dfrac{14}{5}\right)$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직선 l은 (-2, 1)과 (2, 3)을 지나므로 기울기 1/2, y = 1/2 x + 2 이다.
2. 직선 m은 (0, -2)와 (1, 1)을 지나므로 기울기 3, y = 3x - 2 이다.
3. 1/2 x + 2 = 3x - 2 에서 5/2 x = 4, x = 8/5 이다.
4. y = 3*(8/5) - 2 = 14/5 이다.
5. 따라서 두 직선의 식과 교점은 (8/5, 14/5) 이다.
- 작성자 답: $y = \dfrac{1}{2}x + 2$, $y = 3x - 2$, 교점 $\left(\dfrac{8}{5}, \dfrac{14}{5}\right)$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「좌표평면 위의 직선 $l$은」
**RPM** M2-RPM-056 [일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 교점과 연립방정식] (원천과 같음)
- 이유: 두 직선의 방정식을 세우고 연립하여 교점 좌표 (8/5, 14/5) 를 구한다.
**유형** PT=PT_FUNCTION_GRAPH_INTERSECTION / TPL=TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS
- 이유: 두 점을 지나는 두 직선의 방정식을 각각 구하고 연립하여 교점 y좌표 14/5 를 구하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 점으로 기울기와 절편을 구하고 연립일차방정식을 풀어 교점을 서술해야 한다. 14

**4칸**
- given: 직선←stem:「좌표평면 위의 직선 $l$은 두 점 $(-2, 1)$, $(2, 3)$을 지나고」
- goal: 방정식←stem:「두 직선의 교점의 좌표를 구하시오.」
- method: 기울기(NAMED)←solution:「직선 $l$의 기울기는」
- condition: (없음)

**how** 각각의 직선식을 구한 뒤 연립하여 교점 (8/5, 14/5)를 도출하였다. 14

<details><summary>저장 해설 (판정 검토용)</summary>

직선 $l$의 기울기는 $\dfrac{3 - 1}{2 - (-2)} = \dfrac{2}{4} = \dfrac{1}{2}$이고 점 $(2, 3)$을 지나므로 $3 = \dfrac{1}{2}(2) + b \implies b = 2$, 따라서 $y = \dfrac{1}{2}x + 2$ 직선 $m$의 기울기는 $\dfrac{1 - (-2)}{1 - 0} = 3$이고 $y$절편이 $-2$이므로 $y = 3x - 2$ 두 식을 연립하면 $\dfrac{1}{2}x + 2 = 3x - 2 \implies 4 = \dfrac{5}{2}x \implies x = \dfrac{8}{5}$ $y = 3 \times \dfrac{8}{5} - 2 = \dfrac{14}{5}$ 따라서 두 직선의 교점은 $\left(\dfrac{8}{5}, \dfrac{14}{5}\right)$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 단답형 7점


**발문**

$\triangle ABC$에서 변 $BC$의 중점을 $M$이라 하고, 점 $M$에서 두 변 $AB$, $AC$에 내린 수선의 발을 각각 $D$, $E$라고 하자. $\overline{AD} = 7.3\text{ cm}$, $\overline{CE} = 4.7\text{ cm}$, $\overline{MD} = \overline{ME}$일 때, $\triangle BDM$과 $\triangle CEM$이 합동임을 보이고, $\overline{AB}$의 길이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $12\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 BDM과 CEM에서 각 BDM = 각 CEM = 90도이다.
2. M은 BC의 중점이므로 BM = CM (빗변 상등)이다.
3. MD = ME 이므로 RHS 합동이다.
4. 따라서 BD = CE = 4.7 cm 이다.
5. AB = AD + BD = 7.3 + 4.7 = 12 cm 이다.
- 작성자 답: $12\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-070 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] (원천과 같음)
- 이유: 중점 조건과 직각, 변 상등을 통해 RHS 합동을 밝히고 4.7 cm 를 더한다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE
- 이유: 빗변과 한 변이 같은 RHS 합동을 증명하고 선분 4.7 cm 를 전달하여 길이를 구하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: BM=CM, MD=ME로 RHS 합동을 보이고 AD+BD=12cm를 계산하여 서술한다. 4.7

**4칸**
- given: 중점←stem:「$\triangle ABC$에서 변 $BC$의 중점을 $M$이라 하고」
- goal: 합동←stem:「$\triangle BDM$과 $\triangle CEM$이 합동임을 보이고」
- method: 수선(NAMED)←solution:「직각삼각형 $BDM$과 직각삼각형 $CEM$에서」
- condition: (없음)

**how** RHS 합동임을 서술하여 BD=4.7cm를 얻고 AB=7.3+4.7=12cm를 구하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $BDM$과 직각삼각형 $CEM$에서 $\angle BDM = \angle CEM = 90^\circ$, $\overline{BM} = \overline{CM}$ ($M$은 $\overline{BC}$의 중점), $\overline{MD} = \overline{ME}$이므로 $\triangle BDM \equiv \triangle CEM$ ($\text{RHS}$ 합동)이다. 따라서 $\overline{BD} = \overline{CE} = 4.7\text{ cm}$이다. $\therefore \overline{AB} = \overline{AD} + \overline{BD} = 7.3 + 4.7 = 12\text{ (cm)}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q25 — 단답형 7점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

사각형 $ABCD$에서 $\overline{AD} \parallel \overline{BC}$, $\overline{AD} = \overline{BC}$이면 사각형 $ABCD$는 평행사변형임을 설명하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\square ABCD$는 평행사변형이다.   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 대각선 AC를 그으면 삼각형 DAC 와 BCA 에서 AD // BC 이므로 각 DAC = 각 BCA (엇각)이다.
2. AD = BC 이고 AC는 공통이므로 삼각형 DAC 와 BCA 는 SAS 합동이다.
3. 대응각 DCA = BAC 이고 엇각이므로 AB // DC 이다.
4. 두 쌍의 대변이 각각 평행하므로 사각형 ABCD는 평행사변형이다.
- 작성자 답: $\square ABCD$는 평행사변형이다. → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「사각형 $ABCD$에서 $\」
**RPM** M2-RPM-074 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 한 쌍 대변의 평행과 상등 조건에서 SAS 합동으로 두 쌍 평행을 증명한다. DAC
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 한 쌍의 대변이 평행하고 길이가 같을 때 삼각형 DAC 합동을 통해 평행사변형임을 증명하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대각선 AC를 긋고 SAS 합동으로 다른 대변의 평행을 보여 평행사변형임을 서술한다. DAC

**4칸**
- given: 평행←stem:「사각형 $ABCD$에서 $\overline{AD} \parallel \overline{BC}$, $\overline{AD} = \overline{BC}$이면」
- goal: 평행사변형←stem:「사각형 $ABCD$는 평행사변형임을 설명하시오.」
- method: 대응각(NAMED)←solution:「따라서 대응각」
- condition: (없음)

**how** 대각선 AC에 의해 생긴 삼각형들의 SAS 합동으로 AB // DC를 보여 평행사변형임을 증명하였다. DAC

<details><summary>저장 해설 (판정 검토용)</summary>

대각선 $AC$를 그으면 $\triangle DAC$와 $\triangle BCA$에서 $\overline{AD} \parallel \overline{BC}$이므로 $\angle DAC = \angle BCA$ (엇각) $\overline{AD} = \overline{BC}$, $\overline{AC}$는 공통이므로 $\triangle DAC \equiv \triangle BCA$ ($\text{SAS}$ 합동)이다. 따라서 대응각 $\angle DCA = \angle BAC$이고, 이는 엇각이므로 $\overline{AB} \parallel \overline{DC}$이다. 두 쌍의 대변이 각각 평행하므로($\overline{AD} \parallel \overline{BC}$, $\overline{AB} \parallel \overline{DC}$) $\square ABCD$는 평행사변형이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
