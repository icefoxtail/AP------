# 검수 묶음 — 25_연향중_2학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 3)**
- 문항 23개 / 검사 PASS 20, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 21, SELF_CONTAINED 2
- 난이도 분포: 1단계 3, 2단계 17, 3단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q3**: 검사 코드: CHOICE_ORDER / 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q4**: 검사 코드: CHOICE_ORDER / 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q7**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 난이도 경계 (confidence=high, 원천 경계 B12) / 풀이 과정에 정답 값이 등장하지 않음
- **Q8**: 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 검사 코드: CHOICE_ORDER
- **Q11**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q12**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q13**: 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 난이도 경계 (confidence=high, 원천 경계 B12) / 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q18**: 난이도 경계 (confidence=high, 원천 경계 B23) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q22**: 난이도 경계 (confidence=high, 원천 경계 B12)

---
## Q1 — 객관식 3점


**발문**

다음 중 일차방정식 $x = -3$의 그래프인 것은?

**보기** ① 점 $(-3, 2)$를 지나고 $x$축에 평행한 직선  ② 점 $(-3, 0)$을 지나고 $y$축에 평행한 직선  ③ 점 $(0, -3)$을 지나고 $y$축에 평행한 직선  ④ 점 $(-3, -3)$을 지나고 $x$축에 평행한 직선  ⑤ 점 $(3, 0)$을 지나고 $y$축에 평행한 직선

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 방정식 x = -3의 그래프는 x좌표가 항상 -3인 점들의 자취이다.
2. 따라서 점 (-3, 0)을 지나고 y축에 평행한 직선이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「방정식 $x = -3$의 그래프는 $x$좌표가 항상 $」
**RPM** M2-RPM-055 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > x축·y축에 평행한 직선] (원천과 같음)
- 이유: 일차방정식 x = -3이 y축에 평행한 직선임을 판별한다.
**유형** PT=PT_M2_LINEAR_EQUATION_PARALLEL_TO_Y_AXIS / TPL=TPL_M2_FIND_VERTICAL_LINE_EQUATION_FROM_POINT
- 이유: 방정식 x = -3의 형태로부터 축에 평행한 직선 그래프를 찾는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 방정식 x = -3의 정의에 따라 y축 평행 직선임을 바로 찾으므로 난이도 1이다.

**4칸**
- given: 일차방정식←stem:「다음 중 일차방정식 $x = -3」
- goal: 직선←solution:「$축에 평행한 직선이다. $\th」
- method: 평행(NAMED)←solution:「고 $y$축에 평행한 직선이다.」
- condition: (없음)

**how** 방정식 x = -3의 그래프는 점 (-3, 0)을 지나고 y축에 평행함을 확인하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

방정식 $x = -3$의 그래프는 $x$좌표가 항상 $-3$인 점들의 집합이므로 점 $(-3, 0)$을 지나고 $y$축에 평행한 직선이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점


**발문**

다음 중 항상 평행사변형이 되는 조건이 아닌 것은?

**보기** ① 두 쌍의 대변의 길이가 각각 같다.  ② 한 쌍의 대변이 평행하고 그 길이가 같다.  ③ 두 쌍의 대각의 크기가 각각 같다.  ④ 이웃하는 두 내각의 크기의 합이 $180^\circ$이다.  ⑤ 두 대각선이 서로 다른 것을 이등분한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이웃하는 두 내각의 크기의 합이 180도인 조건은 한 쌍의 대변만 평행한 사다리꼴일 수도 있다.
2. 따라서 항상 평행사변형이 되는 조건이 아닌 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「④ 이웃하는 두 내각의 크기의 합이 $180^\circ」
**RPM** M2-RPM-074 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 이웃하는 두 내각의 합이 180도인 조건의 반례(사다리꼴)를 검토한다.
**유형** PT=PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION / TPL=TPL_MG_IDENTIFY_INVALID_PARALLELOGRAM_CONDITION
- 이유: 두 내각의 합 180도 조건 등 평행사변형 판정 조건의 유효성을 판별하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이웃 내각의 합 180도는 한 쌍만 평행함을 의미하므로 즉시 반례를 찾아 난이도 1이다.

**4칸**
- given: 평행사변형←stem:「다음 중 항상 평행사변형이 되는 조건이」
- goal: 내각←solution:「이웃하는 두 내각의 크기의 합이」
- method: 조건(NAMED)←stem:「사변형이 되는 조건이 아닌 것은?」
- condition: (없음)

**how** 이웃하는 두 내각의 합이 180도인 조건은 사다리꼴일 수 있어 평행사변형 조건이 아님을 확인해 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

④ 이웃하는 두 내각의 크기의 합이 $180^\circ$이면 한 쌍의 대변만 평행한 사다리꼴일 수도 있으므로 항상 평행사변형이 되지는 않는다. ①, ②, ③, ⑤는 모두 평행사변형이 되는 조건이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

두 직선 $3x - y = 7$, $ax - 3y = 11$의 교점이 $(2, b)$일 때, $a - b$의 값은? (단, $a$는 상수이다.)

**보기** ① $5$  ② $1$  ③ $2$  ④ $3$  ⑤ $4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 교점 (2, b)를 3x - y = 7에 대입하면 6 - b = 7에서 b = -1이다.
2. 교점 (2, -1)을 ax - 3y = 11에 대입하면 2a + 3 = 11에서 2a = 8, 즉 a = 4이다.
3. 따라서 a - b = 4 - (-1) = 5이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「교점 $(2, b)$를 $3x - y = 7$에 대입하」
**RPM** M2-RPM-056 [일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 교점과 연립방정식] (원천과 같음)
- 이유: 교점 (2, b)를 직선과 ax - 3y = 11에 각각 대입해 연립방정식의 해를 구한다.
**유형** PT=PT_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION / TPL=TPL_M2_SYSTEM_OF_EQUATIONS_GRAPH_INTERSECTION_COEFFICIENT
- 이유: 직선 ax - 3y = 11과의 교점 좌표로부터 상수 a, b를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 직선과 ax - 3y = 11에 교점 좌표를 순차 대입하여 a, b를 구하므로 난이도 2이다.

**4칸**
- given: 직선←stem:「두 직선 $3x - y」
- goal: 교점←stem:「= 11$의 교점이 $(2, b」
- method: 대입(NAMED)←solution:「y = 7$에 대입하면 $3(2)」
- condition: (없음)

**how** 교점을 대입해 b = -1을 얻고 ax - 3y = 11에서 a = 4를 구해 a - b = 5로 계산하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

교점 $(2, b)$를 $3x - y = 7$에 대입하면 $3(2) - b = 7 \implies 6 - b = 7 \implies b = -1$ 교점 $(2, -1)$을 $ax - 3y = 11$에 대입하면 $2a - 3(-1) = 11 \implies 2a + 3 = 11 \implies 2a = 8 \implies a = 4$ $\therefore a - b = 4 - (-1) = 5$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

연립방정식 $\begin{cases} ax + y + 2 = 0 \ 6x - 2y - 5 = 0 \end{cases}$의 해가 없을 때, 상수 $a$의 값은?

**보기** ① $-6$  ② $3$  ③ $2$  ④ $-2$  ⑤ $-3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 연립방정식의 cases 식에서 y = -ax - 2이고 6x - 2y - 5 = 0에서 y = 3x - 5/2이다.
2. 해가 없으려면 두 직선의 기울기가 같고 y절편이 달라야 하므로 -a = 3에서 a = -3이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 일차방정식을 $y$에 대하여 정리하면 $y = -a」
**RPM** M2-RPM-057 [일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 두 직선의 평행·일치] (원천과 같음)
- 이유: cases 연립방정식의 두 직선 ax + y + 2 = 0이 평행하여 해가 없을 조건을 분석한다.
**유형** PT=PT_LINE_RELATION / TPL=TPL_RELATION_PARALLEL_PARAMETER
- 이유: cases 연립방정식에서 ax 계수의 평행 조건을 찾아 해가 없는 a를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: cases 식에서 두 직선의 기울기 -a = 3을 비교하여 a = -3을 바로 구하므로 난이도 2이다.

**4칸**
- given: 연립방정식←stem:「연립방정식 $\begin」
- goal: 방정식←stem:「연립방정식 $\begin」
- method: 기울기(NAMED)←solution:「면 두 직선의 기울기가 같고 $y$」
- condition: (없음)

**how** cases 연립방정식에서 직선 ax + y + 2 = 0의 기울기가 3과 같아야 하므로 a = -3으로 계산하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 일차방정식을 $y$에 대하여 정리하면 $y = -ax - 2$, $y = 3x - \dfrac{5}{2}$ 연립방정식의 해가 없으려면 두 직선의 기울기가 같고 $y$절편이 달라야 하므로 $-a = 3 \implies a = -3$ (이때 $y$절편은 $-2 \ne -\dfrac{5}{2}$) $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

$a < 0$, $b > 0$일 때, 일차방정식 $x + ay - b = 0$의 그래프가 지나지 않는 사분면은?

**보기** ① 제$1$사분면  ② 제$3$사분면  ③ 제$2$사분면  ④ 제$4$사분면  ⑤ 제$1$사분면과 제$3$사분면

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 일차방정식 x + ay - b = 0에서 y = (-1/a)x + (b/a)이다.
2. a < 0, b > 0이므로 기울기 -1/a > 0이고 y절편 b/a < 0이다.
3. 따라서 그래프는 제1, 3, 4사분면을 지나고 제2사분면을 지나지 않는다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_BASIC(일차함수의 뜻과 그래프) (원천과 같음) **원천→판정: M2-04-LINEAR_FUNCTION_EQUATION → M2-04-LINEAR_FUNCTION_BASIC**
- 근거 인용: 「$x + ay - b = 0$을 $y$에 대하여 정리하」
**RPM** M2-RPM-054 [일차함수 > 일차함수와 일차방정식의 관계 > 방정식과 그래프 > 일차방정식의 그래프] (원천과 같음)
- 이유: 방정식 x + ay - b = 0에서 계수 a, b의 부호로 사분면을 판정한다.
**유형** PT=PT_FUNCTION_GRAPH_QUADRANT / TPL=TPL_FUNCTION_QUADRANT_DIRECT
- 이유: 항 ay가 포함된 일차방정식의 기울기와 절편 부호로 지나지 않는 사분면을 결정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 항 ay에서 유도된 기울기 양수와 절편 음수로 사분면을 즉시 판별하므로 난이도 2이다.

**4칸**
- given: 일차방정식←stem:「0$일 때, 일차방정식 $x + ay」
- goal: 그래프←stem:「b = 0$의 그래프가 지나지 않는」
- method: 사분면(NAMED)←stem:「지나지 않는 사분면은?」
- condition: (없음)

**how** 항 ay를 정리해 기울기 양수, y절편 음수임을 파악하여 제2사분면을 지나지 않음을 확인해 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x + ay - b = 0$을 $y$에 대하여 정리하면 $y = -\dfrac{1}{a}x + \dfrac{b}{a}$ $a < 0$, $b > 0$이므로 기울기 $-\dfrac{1}{a} > 0$, $y$절편 $\dfrac{b}{a} < 0$이다. 따라서 그래프는 제$1$사분면, 제$3$사분면, 제$4$사분면을 지나고 제$2$사분면은 지나지 않는다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

세 직선 $x = 0$, $x + y - 6 = 0$, $2x - y - 6 = 0$으로 둘러싸인 도형의 넓이는?

**보기** ① $12$  ② $16$  ③ $20$  ④ $24$  ⑤ $48$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. x = 0일 때 두 직선의 y절편은 (0, 6), (0, -6)이므로 밑변의 길이는 6 - (-6) = 12이다.
2. 두 직선 x + y = 6과 2x - y = 6을 연립하면 3x = 12에서 교점 (4, 2)를 얻는다.
3. 높이는 x = 4이므로 둘러싸인 삼각형의 넓이는 (1/2) * 12 * 4 = 24이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「$x = 0$을 두 직선에 대입하면 $y$절편은 각각 」
**RPM** M2-RPM-058 [일차함수 > 일차함수와 일차방정식의 관계 > 그래프 활용 > 넓이] (원천과 같음)
- 이유: 세 직선의 밑변 12와 교점 높이 4로부터 넓이 24를 산출한다.
**유형** PT=PT_COORD_TRIANGLE_AREA / TPL=TPL_AREA_DIRECT
- 이유: 세 직선으로 둘러싸인 삼각형의 밑변 12와 높이 4로 넓이 24를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: y절편 차이 12와 교점 x좌표 4로 밑변과 높이를 구해 넓이 24를 계산하므로 난이도 2이다.

**4칸**
- given: 직선←stem:「세 직선 $x = 0$」
- goal: 넓이←stem:「러싸인 도형의 넓이는?」
- method: 대입(NAMED)←solution:「을 두 직선에 대입하면 $y$절편」
- condition: (없음)

**how** 밑변 길이 12와 두 직선의 교점 x = 4에서 넓이 (1/2)*12*4 = 24를 산출하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$x = 0$을 두 직선에 대입하면 $y$절편은 각각 $(0, 6)$, $(0, -6)$이므로 밑변의 길이는 $6 - (-6) = 12$ 두 직선 $x + y = 6$과 $2x - y = 6$을 연립하여 풀면 $3x = 12 \implies x = 4$, $y = 2$ 교점 $(4, 2)$에서 $y$축($x = 0$)까지의 거리는 $4$이므로 $\therefore (\text{넓이}) = \dfrac{1}{2} \times 12 \times 4 = 24$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 각의 이등분선 위의 점에서 각의 두 변에 이르는 거리가 같음을 증명하는 과정이다. 빈칸 (가)~(마)에 들어갈 내용으로 옳지 않은 것은? $\angle XOY$의 이등분선 위의 한 점 $P$에서 $\overrightarrow{OX}$, $\overrightarrow{OY}$에 내린 수선의 발을 각각 $A$, $B$라 하면 $\triangle POA$와 $\triangle POB$에서 $\angle POA = \boxed{\text{(가)}}\ \cdots\cdots\text{㉠}$ $\boxed{\text{(나)}}$는 공통 $\cdots\cdots\text{㉡}$ $\boxed{\text{(다)}} = \angle OBP = 90^\circ\ \cdots\cdots\text{㉢}$ ㉠, ㉡, ㉢에 의하여 $\triangle POA \equiv \triangle POB$ ($\boxed{\text{(라)}}$ 합동) 따라서 $\boxed{\text{(마)}} = \overline{PB}$이다.

**보기** ① (가) $\angle POB$  ② (라) $\text{RHS}$  ③ (나) $\overline{OP}$  ④ (다) $\angle OAP$  ⑤ (마) $\overline{PA}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 XOY의 이등분선 위의 점 P에서 각 변에 내린 수선의 발 A, B에 대하여 직각삼각형 POA, POB는 빗변 OP가 공통이고 한 예각 POA = POB이다.
2. 따라서 RHA 합동이므로 (라)에 들어갈 조건은 RHS가 아니라 RHA이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle POA = \angle POB$, 빗변 」
**RPM** M2-RPM-071 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] **원천→판정: 삼각형의 성질 > 삼각형의 성질 > 각의 이등분선 > 각의 이등분선 성질 → 삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA**
- 이유: 직각삼각형 POA와 POB의 빗변 OP 공통과 한 예각 조건으로 RHA 합동을 판별한다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_CONGRUENCE_CRITERIA
- 이유: 삼각형 POA에서 각의 이등분선 정리의 RHA 합동 조건 빈칸을 검증하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 각 POA의 이등분 조건으로 RHA 합동임을 바로 파악하여 오류 선지 ②를 찾으므로 난이도 2이다.

**4칸**
- given: 이등분선←stem:「다음은 각의 이등분선 위의 점에서」
- goal: 합동←stem:「{(라)}}$ 합동) 따라서 $\」
- method: 수선(NAMED)←stem:「Y}$에 내린 수선의 발을 각각」
- condition: (없음)

**how** 각 POA = POB와 빗변 OP 공통에서 RHA 합동이어야 하므로 RHS로 표기된 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle POA = \angle POB$, 빗변 $\overline{OP}$는 공통, $\angle OAP = \angle OBP = 90^\circ$이므로 두 직각삼각형 $POA$와 $POB$는 빗변의 길이와 한 예각의 크기가 각각 같은 $\text{RHA}$ 합동이다. 따라서 (라)에 들어갈 합동 조건은 $\text{RHS}$가 아니라 $\text{RHA}$이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\triangle ABC$에서 두 변 $BC$, $AC$의 수직이등분선의 교점을 $O$라 하고, 점 $O$에서 변 $BC$, $AC$에 내린 수선의 발을 각각 $D$, $E$라 하자. 다음 중 항상 옳은 것을 모두 고르면? (정답 2개)

**보기** ① $\triangle AOB$는 이등변삼각형이다.  ② $\angle ABO = \angle CBO$  ③ $\triangle ODC \equiv \triangle OEC$  ④ 점 $O$에서 세 변에 이르는 거리는 모두 같다.  ⑤ 변 $AB$의 수직이등분선은 점 $O$를 지난다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 점 O는 삼각형 ABC의 외심이므로 OA = OB = OC이다.
2. 따라서 triangle AOB는 OA = OB인 이등변삼각형이므로 ①은 항상 옳다.
3. 외심은 세 변의 수직이등분선의 교점이므로 변 AB의 수직이등분선은 점 O를 지나 ⑤도 항상 옳다.
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$는 $\triangle ABC$의 외심이므로 」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] (원천과 같음)
- 이유: 외심 O의 성질인 OA = OB = OC 및 세 변의 수직이등분선 교점 성질을 확인한다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER
- 이유: 삼각형 ABC의 외심 성질로부터 triangle AOB의 이등변삼각형 판정 및 수직이등분선 진술을 판별하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외심 O에서 OA = OB와 수직이등분선 정의를 바로 적용하여 두 보기를 고르므로 난이도 2이다.

**4칸**
- given: 수직이등분선←stem:「, $AC$의 수직이등분선의 교점을 $O」
- goal: 이등변삼각형←solution:「e AOB$는 이등변삼각형이다. (참)」
- method: 교점(NAMED)←stem:「수직이등분선의 교점을 $O$라 하」
- condition: (없음)

**how** 외심 O의 성질 OA = OB에서 triangle AOB가 이등변삼각형임과 수직이등분선 성질을 확인해 ①, ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $O$는 $\triangle ABC$의 외심이므로 $\overline{OA} = \overline{OB} = \overline{OC}$이다. ① $\overline{OA} = \overline{OB}$이므로 $\triangle AOB$는 이등변삼각형이다. (참) ②, ③, ④는 내심에 대한 성질이므로 일반적으로 성립하지 않는다. (거짓) ⑤ $\overline{OA} = \overline{OB}$이므로 점 $O$는 변 $AB$의 수직이등분선 위에 있다. (참) $\therefore$ ①, ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

예각삼각형 $ABC$의 외심을 $O$, 내심을 $I$라고 하자. $\angle A = x^\circ$, $\angle BOC = y^\circ$이고 $\angle BIC = 125^\circ$일 때, $x + y$의 값은?

**보기** ① $190$  ② $200$  ③ $210$  ④ $220$  ⑤ $230$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 점 I는 내심이므로 angle BIC = 90 + x/2 = 125도에서 x/2 = 35도, 즉 x = 70이다.
2. 점 O는 외심이므로 angle BOC = y = 2x = 2 * 70 = 140이다.
3. 따라서 x + y = 70 + 140 = 210이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $I$는 내심이므로 $125 = 90 + \dfra」
**RPM** M2-RPM-069 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 외심·내심을 이용한 복합도형] (원천과 같음)
- 이유: 내심 각 BIC = 125도에서 x = 70을 구하고 외심 각 BOC에서 y = 140을 얻어 합 210을 계산한다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_COMBINED
- 이유: 삼각형 ABC의 외심과 내심 각 공식을 결합하여 각의 합 210을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심 각 125도 공식으로 x = 70, 외심 각 공식으로 y = 140을 차례로 구하므로 난이도 2이다.

**4칸**
- given: 외심←stem:「$ABC$의 외심을 $O$, 내」
- goal: 내심←stem:「심을 $O$, 내심을 $I$라고」
- method: 예각(NAMED)←stem:「예각삼각형 $ABC」
- condition: (없음)

**how** 내심 조건 125 = 90 + x/2에서 x = 70, 외심 공식 y = 2x = 140으로 x + y = 210을 산출해 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $I$는 내심이므로 $125 = 90 + \dfrac{x}{2} \implies \dfrac{x}{2} = 35 \implies x = 70$ 점 $O$는 외심이므로 $y = 2x = 2 \times 70 = 140$ $\therefore x + y = 70 + 140 = 210$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

예각삼각형 $ABC$의 외심을 $O$라 하고 $\angle AOB : \angle BOC : \angle COA = 3 : 5 : 4$일 때, $\angle ACB$의 크기는?

**보기** ① $45^\circ$  ② $40^\circ$  ③ $48^\circ$  ④ $50^\circ$  ⑤ $60^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 중심각의 비가 3 : 5 : 4이므로 angle AOB = 360도 * (3 / 12) = 90도이다.
2. 외심에서 원주각과 중심각의 관계에 의해 angle ACB = (1/2) * angle AOB = 90도 / 2 = 45도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle AOB + \angle BOC + \an」
**RPM** M2-RPM-065 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] (원천과 같음)
- 이유: 외심 O를 중심으로 한 각의 비례배분으로 각 AOB = 90도를 구하고 원주각 45도를 계산한다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER
- 이유: 삼각형 ABC의 외심 중심각 비로부터 꼭짓각 ACB = 45도를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 비례배분으로 중심각 90도를 구하고 절반 공식으로 45도를 즉시 계산하므로 난이도 2이다.

**4칸**
- given: 외심←stem:「$ABC$의 외심을 $O$라 하」
- goal: 예각←stem:「예각삼각형 $ABC」
- method: 외심(NAMED)←stem:「$ABC$의 외심을 $O$라 하」
- condition: (없음)

**how** 각 AOB = 360 * (3/12) = 90도에서 외심 성질로 angle ACB = 90/2 = 45도를 산출하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle AOB + \angle BOC + \angle COA = 360^\circ$이고 비가 $3 : 5 : 4$이므로 $\angle AOB = 360^\circ \times \dfrac{3}{3 + 5 + 4} = 360^\circ \times \dfrac{3}{12} = 90^\circ$ 점 $O$는 $\triangle ABC$의 외심이므로 $\angle AOB = 2\angle ACB$ $\therefore \angle ACB = \dfrac{90^\circ}{2} = 45^\circ$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

점 $I$는 $\triangle ABC$의 내심이고 내접원이 세 변 $AB$, $BC$, $CA$와 만나는 점을 각각 $D$, $E$, $F$라 하자. $\triangle ABC$의 둘레의 길이가 $28\text{ cm}$이고 $\overline{AD} = 5\text{ cm}$, $\overline{DB} = 6\text{ cm}$일 때, $\overline{FC}$의 길이는?

**보기** ① $1\text{ cm}$  ② $1.5\text{ cm}$  ③ $2\text{ cm}$  ④ $2.5\text{ cm}$  ⑤ $3\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 원 밖의 꼭짓점에서 내접원에 그은 접선 길이는 같으므로 AF = AD = 5 cm, BE = DB = 6 cm이다.
2. FC = CE = x cm라 하면 둘레는 2(5 + 6 + x) = 28 cm에서 11 + x = 14이므로 x = 3 cm이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{FC} = x\text{ cm}$라」
**RPM** M2-RPM-068 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산] **원천→판정: 삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 내심과 거리 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산**
- 이유: 내접원의 접선 길이 대칭성과 삼각형 ABC의 둘레 28 cm를 이용해 x = 3 cm를 구한다.
**유형** PT=PT_CIRCLE_TANGENT / TPL=TM_TANGENT_LENGTH
- 이유: 삼각형 ABC의 둘레 28 cm와 접선 길이 조건으로부터 선분 FC의 길이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 길이 대칭성으로 둘레 절반 식 11 + x = 14에서 x = 3을 바로 구하므로 난이도 2이다.

**4칸**
- given: 내심←stem:「e ABC$의 내심이고 내접원이」
- goal: 둘레←stem:「e ABC$의 둘레의 길이가 $2」
- method: 접선(NAMED)←solution:「원에 그은 두 접선의 길이는 같으」
- condition: (없음)

**how** 접선 길이 AF = 5, BE = 6과 둘레 28 cm에서 2(11 + x) = 28을 풀어 FC = 3 cm를 산출해 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{FC} = x\text{ cm}$라 하면 원 밖의 한 점에서 원에 그은 두 접선의 길이는 같으므로 $\overline{AF} = \overline{AD} = 5\text{ cm}$, $\overline{BE} = \overline{DB} = 6\text{ cm}$, $\overline{EC} = \overline{FC} = x\text{ cm}$ 둘레의 길이가 $28\text{ cm}$이므로 $2(5 + 6 + x) = 28 \implies 11 + x = 14 \implies x = 3$ $\therefore \overline{FC} = 3\text{ cm}$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\angle C = 90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라 하자. $\overline{AB} = 20\text{ cm}$, $\overline{CD} = 7\text{ cm}$일 때, $\triangle ABD$의 넓이는?

**보기** ① $60\text{ cm}^2$  ② $70\text{ cm}^2$  ③ $80\text{ cm}^2$  ④ $100\text{ cm}^2$  ⑤ $140\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각의 이등분선 위의 점 D에서 변 AB에 내린 수선의 길이는 CD = 7 cm와 같다.
2. 밑변 AB = 20 cm이므로 triangle ABD의 넓이는 (1/2) * 20 * 7 = 70 cm^2이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $D$에서 변 $AB$에 내린 수선의 발을 $H$라」
**RPM** M2-RPM-066 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] **원천→판정: 삼각형의 성질 > 삼각형의 성질 > 각의 이등분선 > 거리 관계 → 삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심**
- 이유: 각의 이등분선 성질로 점 D에서 변 AB = 20에 이르는 거리 7을 파악해 넓이 70을 계산한다.
**유형** PT=PT_TRIANGLE_ANGLE_BISECTOR / TPL=TPL_TRIANGLE_ANGLE_BISECTOR_EQUIDISTANCE
- 이유: 직각삼각형 ABC에서 각의 이등분선과 변 AB = 20으로 삼각형 ABD의 넓이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각의 이등분선 성질로 높이 7을 확인하고 밑변 20과 곱해 70을 구하므로 난이도 2이다.

**4칸**
- given: 직각삼각형←stem:「\circ$인 직각삼각형 $ABC$에서」
- goal: 넓이←stem:「e ABD$의 넓이는?」
- method: 이등분선(NAMED)←stem:「gle A$의 이등분선과 변 $BC$」
- condition: (없음)

**how** 점 D에서 변 AB에 이르는 거리가 CD = 7 cm이므로 넓이 (1/2)*20*7 = 70 cm^2를 도출하여 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $D$에서 변 $AB$에 내린 수선의 발을 $H$라 하면 각의 이등분선 위의 점에서 각의 두 변에 이르는 거리는 같으므로 $\overline{DH} = \overline{CD} = 7\text{ cm}$이다. $\therefore \triangle ABD = \dfrac{1}{2} \times \overline{AB} \times \overline{DH} = \dfrac{1}{2} \times 20 \times 7 = 70\text{ (cm}^2\text{)}$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

마름모 $ABCD$의 두 대각선의 교점을 $O$라 할 때, 다음 설명 중 옳지 않은 것은?

**보기** ① $\overline{AC} \perp \overline{BD}$  ② $\angle BAD = \angle BCD$  ③ $\overline{OA} = \overline{OC},\ \overline{OB} = \overline{OD}$  ④ $\angle BAC = \angle BDC$  ⑤ $\overline{BD}$는 $\angle ABC$를 이등분한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 마름모 ABCD의 두 대각선은 서로 수직이등분하므로 AC perp BD이고 대각의 크기는 같다.
2. 대각선 BD는 각 B를 이등분하므로 angle BDC = angle BDA이지만, angle BAC = angle BDC는 일반적으로 성립하지 않는다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「①, ③ 마름모의 두 대각선은 서로 다른 것을 수직이등」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 마름모 ABCD의 대각선 수직이등분 및 각 성질을 검토하여 거짓인 선지를 찾는다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 마름모 ABCD의 대각선과 각에 관한 설명 중 옳지 않은 진술 ④를 판별하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 마름모의 대각선 성질을 비교하여 angle BAC = angle BDC가 항상 성립하지 않음을 판별하므로 난이도 2이다.

**4칸**
- given: 마름모←stem:「마름모 $ABCD$의」
- goal: 대각선←stem:「BCD$의 두 대각선의 교점을 $O」
- method: 교점(NAMED)←stem:「두 대각선의 교점을 $O$라 할」
- condition: (없음)

**how** 마름모 ABCD에서 대각선 성질을 확인하고 angle BAC = angle BDC 진술이 거짓임을 확인해 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

①, ③ 마름모의 두 대각선은 서로 다른 것을 수직이등분하므로 참이다. ② 마름모의 대각의 크기는 같으므로 참이다. ④ $\angle BAC = \dfrac{1}{2}\angle A$, $\angle BDC = \dfrac{1}{2}\angle D$인데 일반적인 마름모에서 $\angle A$와 $\angle D$는 같지 않으므로 거짓이다. ⑤ 마름모의 대각선은 내각을 이등분하므로 참이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 $\angle D$의 이등분선이 변 $BC$와 만나는 점을 $E$라 하고, 꼭짓점 $A$에서 선분 $DE$에 내린 수선의 발이 $E$가 되어 $\overline{AE} \perp \overline{DE}$일 때, $\angle C = 116^\circ$이면 $\angle DAE$의 크기는?

**보기** ① $32^\circ$  ② $48^\circ$  ③ $58^\circ$  ④ $64^\circ$  ⑤ $68^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 ABCD에서 이웃한 두 각의 합은 180도이므로 angle ADC = 180도 - 116도 = 64도이다.
2. DE가 각 D의 이등분선이므로 angle ADE = 64도 / 2 = 32도이다.
3. 직각삼각형 ADE에서 angle DAE = 90도 - 32도 = 58도이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형에서 이웃한 두 각의 합은 $180^\circ」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 ABCD의 이웃각 합 180도와 각의 이등분선으로 angle DAE = 58도를 구한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 평행사변형 ABCD의 내각 116도로부터 직각삼각형 ADE의 각 DAE = 58도를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이웃각 64도, 이등분각 32도, 직각삼각형 여각 58도를 순차 계산하므로 난이도 2이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에」
- goal: 이등분선←stem:「gle D$의 이등분선이 변 $BC$」
- method: 이등분선(NAMED)←stem:「gle D$의 이등분선이 변 $BC$」
- condition: (없음)

**how** angle ADC = 64도와 반각 32도로부터 직각삼각형에서 angle DAE = 90 - 32 = 58도를 산출해 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형에서 이웃한 두 각의 합은 $180^\circ$이므로 $\angle ADC = 180^\circ - 116^\circ = 64^\circ$ $\overline{DE}$가 $\angle ADC$의 이등분선이므로 $\angle ADE = \dfrac{64^\circ}{2} = 32^\circ$ $\overline{AE} \perp \overline{DE}$이므로 $\angle AED = 90^\circ$ $\therefore \angle DAE = 180^\circ - (90^\circ + 32^\circ) = 58^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

평행사변형이 다음 (1)~(4)의 조건을 만족시킬 때 각각 직사각형, 마름모, 정사각형이 된다. 다음 중 각 사각형으로 판별하기 위한 조건으로 옳지 않은 것은? (1) 평행사변형 $\longrightarrow$ 직사각형 (2) 평행사변형 $\longrightarrow$ 마름모 (3) 직사각형 $\longrightarrow$ 정사각형 (4) 마름모 $\longrightarrow$ 정사각형

**보기** ① (1) $\angle B = 90^\circ$  ② (1) $\angle A = \angle B$  ③ (2) $\overline{AB} = \overline{AD}$  ④ (3) $\overline{AB} = \overline{BC}$  ⑤ (4) $\overline{AC} \perp \overline{BD}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 마름모는 이미 두 대각선이 서로 수직이므로 AC perp BD 조건만으로는 정사각형이 되지 않는다.
2. 마름모가 정사각형이 되려면 한 내각이 90도이거나 대각선의 길이가 같아야 한다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「⑤ 마름모의 두 대각선은 이미 서로 수직이므로 $\ov」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] (원천과 같음)
- 이유: 사각형 계통도에서 마름모가 정사각형이 되는 조건으로 90도 내각 또는 대각선 조건을 판별한다.
**유형** PT=PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS / TPL=TPL_MG_COMPLETE_CONDITIONS_IN_QUADRILATERAL_FLOWCHART_DESCRIPTIVE
- 이유: 대각선 AC, BD의 성질을 바탕으로 마름모에서 정사각형으로의 변환 조건을 판정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 마름모의 기존 성질 AC perp BD는 추가 조건이 될 수 없음을 직관적으로 찾아내므로 난이도 2이다.

**4칸**
- given: 정사각형←stem:「형, 마름모, 정사각형이 된다. 다음」
- goal: 조건←stem:「1)~(4)의 조건을 만족시킬 때」
- method: 대각선(NAMED)←solution:「마름모의 두 대각선은 이미 서로」
- condition: (없음)

**how** 마름모의 두 대각선은 이미 수직이므로 AC perp BD는 정사각형 조건이 아님을 파악하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

⑤ 마름모의 두 대각선은 이미 서로 수직이므로 $\overline{AC} \perp \overline{BD}$ 조건만으로는 정사각형이 되지 않는다. 마름모가 정사각형이 되려면 한 내각이 $90^\circ$이거나 두 대각선의 길이가 같아야 한다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

직사각형 $ABCD$를 변 $BC$ 위의 점 $E$와 변 $AD$ 위의 점 $F$를 잇는 선분 $EF$를 접는 선으로 하여 꼭짓점 $C$가 꼭짓점 $A$에, 꼭짓점 $D$가 점 $G$에 포개지도록 접었다. $\angle EAF = 68^\circ$일 때, $\angle GFE$의 크기는?

**보기** ① $118^\circ$  ② $120^\circ$  ③ $122^\circ$  ④ $124^\circ$  ⑤ $126^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 접은 각과 엇각의 성질에 의해 triangle AEF는 AE = AF인 이등변삼각형이다.
2. angle EAF = 68도이므로 밑각 angle AFE = (180도 - 68도)/2 = 56도이다.
3. 동위각 또는 평각 조건에서 접힌 각 angle GFE = angle DFE = 180도 - 56도 = 124도이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 직사각형 $ABCD$를 변 $BC$ 위의 점 $E$와 

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AF} \parallel \over」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 직사각형 ABCD의 종이접기에서 이등변삼각형 밑각과 접은 각의 성질로 124도를 계산한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 직사각형 ABCD를 접었을 때 각 EAF = 68도로부터 각 GFE = 124도를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접은 각으로 이등변삼각형 밑각 56도를 구하고 평각에서 124도를 계산하므로 난이도 2이다.

**4칸**
- given: 직사각형←stem:「직사각형 $ABCD$를」
- goal: 꼭짓점←stem:「선으로 하여 꼭짓점 $C$가 꼭짓」
- method: 사각형(NAMED)←stem:「직사각형 $ABCD$를」
- condition: (없음)

**how** triangle AEF의 밑각 angle AFE = 56도에서 접힌 각 angle GFE = 180 - 56 = 124도로 계산하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AF} \parallel \overline{EC}$이므로 $\angle AEC = 180^\circ - 68^\circ = 112^\circ$ 접은 각의 크기는 같으므로 $\angle AEF = \angle FEC = \dfrac{112^\circ}{2} = 56^\circ$ $\triangle AEF$에서 $\angle EFA = 180^\circ - (68^\circ + 56^\circ) = 56^\circ$ $\angle EFD = 180^\circ - 56^\circ = 124^\circ$ 접은 각이 같으므로 $\therefore \angle GFE = \angle EFD = 124^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

$\triangle ABC$의 넓이가 $65\text{ cm}^2$이고 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP} : \overline{PC} = 2 : 3$일 때, $\triangle ABP$의 넓이는?

**보기** ① $26\text{ cm}^2$  ② $28\text{ cm}^2$  ③ $30\text{ cm}^2$  ④ $36\text{ cm}^2$  ⑤ $39\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. triangle ABP와 triangle APC는 높이가 같으므로 넓이의 비는 밑변의 비 BP : PC = 2 : 3과 같다.
2. 따라서 triangle ABP의 넓이는 65 * (2 / 5) = 26 cm^2이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABP$와 $\triangle AP」
**RPM** M2-RPM-077 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 분할도형] (원천과 같음)
- 이유: 삼각형 ABC의 넓이 65 cm^2를 밑변의 비 BP : PC = 2 : 3으로 비례배분하여 26을 산출한다.
**유형** PT=PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION / TPL=TPL_MG_FIND_PARALLEL_CONDITION_FOR_EQUAL_AREA_QUADRILATERAL
- 이유: 삼각형 ABC의 분할도형에서 밑변의 비 2 : 3에 따른 넓이 비례배분을 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 전체 넓이 65에 밑변 비 2/5를 곱하여 26을 바로 계산하므로 난이도 1이다.

**4칸**
- given: 넓이←stem:「e ABC$의 넓이가 $65\te」
- goal: 넓이←stem:「e ABC$의 넓이가 $65\te」
- method: 넓이(NAMED)←solution:「이가 같으므로 넓이의 비는 밑변의」
- condition: (없음)

**how** 높이가 같은 삼각형의 넓이비 성질로 triangle ABP = 65 * (2/5) = 26 cm^2를 산출하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABP$와 $\triangle APC$는 높이가 같으므로 넓이의 비는 밑변의 길이의 비 $\overline{BP} : \overline{PC} = 2 : 3$과 같다. $\therefore \triangle ABP = 65 \times \dfrac{2}{2 + 3} = 26\text{ (cm}^2\text{)}$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\angle A = 90^\circ$인 직각이등변삼각형 $ABC$($\overline{AB} = \overline{AC}$)에서 꼭짓점 $A$를 지나고 변 $BC$와 만나지 않는 직선 $l$에 두 점 $B$, $C$에서 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{DB} = 5\text{ cm}$, $\overline{EC} = 9\text{ cm}$일 때, 다음 중 옳지 않은 것은?

**보기** ① $\angle DBA = \angle EAC$  ② $\overline{DB} + \overline{EC} = \overline{DE}$  ③ $\angle DAB = \angle ABC$  ④ $\triangle ADB \equiv \triangle CEA$  ⑤ 사각형 $DBCE$의 넓이는 $98\text{ cm}^2$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 ADB와 CEA에서 AB = AC이고 angle DAB = angle ECA이므로 RHA 합동이다.
2. 따라서 AD = EC = 9 cm, AE = DB = 5 cm로 DE = 14 cm이며 사다리꼴 DBCE의 넓이는 (1/2)*(5+9)*14 = 98 cm^2이다.
3. 반면 angle DAB = angle ABC는 직선 l의 기울기에 따라 달라지므로 항상 성립하지 않는다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle ADB = \angle CEA = 90^」
**RPM** M2-RPM-071 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] (원천과 같음)
- 이유: 직각이등변삼각형 ABC의 꼭짓점 수선에서 RHA 합동과 사다리꼴 넓이 98을 검증한다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE
- 이유: 삼각형 ABC에서 변 DB = 5, EC = 9 조건으로 RHA 합동 및 진술 오류 ③을 찾는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: RHA 합동으로 각 변의 길이를 결정하고 일반적이지 않은 각 조건 ③을 가려내므로 난이도 2이다.

**4칸**
- given: 직각이등변삼각형←stem:「\circ$인 직각이등변삼각형 $ABC$($」
- goal: 합동←solution:「t{RHA}$ 합동)이다. 따라서」
- method: 수선(NAMED)←stem:「C$에서 내린 수선의 발을 각각」
- condition: (없음)

**how** triangle ADB와 CEA의 RHA 합동을 확인하고 angle DAB = angle ABC가 성립하지 않음을 판별하여 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ADB = \angle CEA = 90^\circ$, $\overline{AB} = \overline{AC}$, $\angle DAB = \angle ECA$이므로 $\triangle ADB \equiv \triangle CEA$ ($\text{RHA}$ 합동)이다. 따라서 $\overline{AD} = \overline{EC} = 9\text{ cm}$, $\overline{AE} = \overline{DB} = 5\text{ cm}$이므로 $\overline{DE} = 9 + 5 = 14\text{ cm}$이다. 사다리꼴 $DBCE$의 넓이는 $\dfrac{1}{2} \times (5 + 9) \times 14 = 98\text{ cm}^2$이다. 반면 ③ $\angle DAB = \angle ABC$는 직선 $l$의 기울기에 따라 달라지므로 일반적으로 성립하지 않는다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

$\angle C = 90^\circ$인 직각삼각형 $ABC$의 외심과 내심을 각각 $O$, $I$라 하자. $\overline{AB} = 10\text{ cm}$, $\overline{BC} = 6\text{ cm}$, $\overline{AC} = 8\text{ cm}$일 때, $\triangle ABC$의 외접원과 내접원의 둘레의 길이의 합은?

**보기** ① $12\pi\text{ cm}$  ② $14\pi\text{ cm}$  ③ $15\pi\text{ cm}$  ④ $16\pi\text{ cm}$  ⑤ $18\pi\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 ABC의 외심 O는 빗변 AB의 중점이므로 외접원 반지름 R = 10/2 = 5 cm이고 둘레는 10*pi cm이다.
2. 내접원 반지름 r = (6 + 8 - 10)/2 = 2 cm이므로 내접원의 둘레는 4*pi cm이다.
3. 따라서 둘레의 길이의 합은 10*pi + 4*pi = 14*pi cm이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직각삼각형의 외심 $O$는 빗변 $AB$의 중점이므로 」
**RPM** M2-RPM-068 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산] (원천과 같음)
- 이유: 직각삼각형 ABC의 외접원 반지름 5와 내접원 반지름 2로부터 둘레의 합 14pi를 산출한다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_COMBINED
- 이유: 변 AB = 10, BC = 6, AC = 8인 직각삼각형의 외접원과 내접원의 둘레 합을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외접원 둘레 10pi와 내접원 둘레 4pi를 각각 구하여 합 14pi를 계산하므로 난이도 2이다.

**4칸**
- given: 외심←stem:「$ABC$의 외심과 내심을 각각」
- goal: 둘레←stem:「원과 내접원의 둘레의 길이의 합은」
- method: 내심(NAMED)←stem:「C$의 외심과 내심을 각각 $O$」
- condition: (없음)

**how** 외접원 반지름 5와 내접원 반지름 2를 구하여 둘레의 합 10pi + 4pi = 14pi cm를 산출해 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형의 외심 $O$는 빗변 $AB$의 중점이므로 외접원의 반지름은 $R = \dfrac{10}{2} = 5\text{ cm}$이고, 외접원의 둘레는 $2\pi \times 5 = 10\pi\text{ cm}$이다. 내접원의 반지름을 $r\text{ cm}$라 하면 $\triangle ABC$의 넓이는 $\dfrac{1}{2} \times 6 \times 8 = 24$이므로 $24 = \dfrac{1}{2}(6 + 8 + 10)r = 12r \implies r = 2\text{ cm}$ 내접원의 둘레는 $2\pi \times 2 = 4\pi\text{ cm}$이다. $\therefore 10\pi + 4\pi = 14\pi\text{ cm}$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점


**발문**

마름모 $ABCD$에서 변 $AB$ 위의 점 $E$와 대각선 $BD$ 위의 점 $F$에 대하여 세 점 $E$, $F$, $C$가 한 직선 위에 있고 $\overline{BC} = 15$, $\overline{BE} = \overline{BF} = 11$일 때, 대각선 $\overline{BD}$의 길이는?

**보기** ① $22$  ② $23$  ③ $24$  ④ $25$  ⑤ $26$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. BE = BF에서 angle BEF = angle BFE이고, 맞꼭지각 및 엇각에 의해 angle DFC = angle DCF이다.
2. 따라서 triangle DCF는 DF = DC인 이등변삼각형이고 마름모 ABCD이므로 DC = BC = 15이다.
3. 대각선 BD = BF + DF = 11 + 15 = 26이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 마름모 $ABCD$에서 변 $AB$ 위의 점 $E$와 

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{BE} = \overline{BF}」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 마름모 ABCD의 변의 길이 15와 이등변삼각형 성질로 DF = 15를 얻어 대각선 BD = 26을 구한다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_CONVERSE
- 이유: 마름모 ABCD에서 BE = BF = 11과 BC = 15 조건으로 대각선 BD = 26을 계산하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각의 추론으로 triangle DCF가 이등변삼각형임을 밝혀 DF = 15를 찾아 합산하므로 난이도 3이다.

**4칸**
- given: 마름모←stem:「마름모 $ABCD$에」
- goal: 대각선←stem:「점 $E$와 대각선 $BD$ 위의」
- method: 이등변삼각형(NAMED)←solution:「e DFC$는 이등변삼각형이고 $\ove」
- condition: (없음)

**how** triangle DCF가 이등변삼각형임을 유도하여 DF = 15를 얻고 대각선 BD = 11 + 15 = 26으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BE} = \overline{BF}$이므로 $\angle BEF = \angle EFB$ $\overline{AB} \parallel \overline{CD}$이므로 엇각으로 $\angle BEF = \angle DCF$이고 맞꼭지각으로 $\angle EFB = \angle DFC$ 따라서 $\angle DFC = \angle DCF$이므로 $\triangle DFC$는 이등변삼각형이고 $\overline{DF} = \overline{DC} = \overline{BC} = 15$ $\therefore \overline{BD} = \overline{BF} + \overline{FD} = 11 + 15 = 26$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 7점


**발문**

다음 세 일차방정식의 그래프가 삼각형을 이루지 않도록 하는 수 $a$의 값들의 합을 구하고, 구하는 과정을 서술하시오. (단, $a \ne 0$) $$x + y - 4 = 0, \qquad -2x + y + 5 = 0, \qquad ax + y + 3 = 0$$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $-\dfrac{7}{3}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 세 직선 중 두 직선이 평행한 경우: ax + y + 3 = 0의 기울기 -a가 -1 또는 2이므로 a = 1 또는 a = -2이다.
2. 두 직선 x + y - 4 = 0과 -2x + y + 5 = 0의 교점 (3, 1)을 지나는 경우: 3a + 1 + 3 = 0에서 a = -4/3이다.
3. 따라서 가능한 a의 값들의 합은 1 + (-2) + (-4/3) = -7/3이다.
- 작성자 답: $-\dfrac{7}{3}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-04(일차함수와 그래프) / M2-04-LINEAR_FUNCTION_EQUATION(일차함수와 일차방정식의 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 직선이 삼각형을 이루지 않는 경우는 두 직선이 평행」
**RPM** M2-RPM-057 [일차함수 > 일차함수와 일차방정식의 관계 > 두 직선의 관계 > 두 직선의 평행·일치] (원천과 같음)
- 이유: 세 직선이 삼각형을 이루지 않도록 하는 ax 계수 조건(평행 및 한 점 교점)을 연립한다.
**유형** PT=PT_LINE_INTERSECTION_CONDITION / TPL=TPL_INTERSECTION_TRIANGLE_FORMATION
- 이유: 직선 ax + y + 3 = 0이 삼각형을 형성하지 않을 모든 a의 값의 합을 구하는 서술형 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직선 ax + y + 3 = 0의 평행 조건 a = 1, -2와 교점 대입 a = -4/3를 모두 구해 합하므로 난이도 3이다.

**4칸**
- given: 일차방정식←stem:「다음 세 일차방정식의 그래프가 삼」
- goal: 그래프←stem:「일차방정식의 그래프가 삼각형을 이」
- method: 평행(NAMED)←solution:「는 두 직선이 평행하거나 세 직선」
- condition: (없음)

**how** 직선 ax + y + 3 = 0에서 평행 조건 a = 1, -2와 교점 대입 a = -4/3를 구해 합 1 + (-2) + (-4/3) = -7/3으로 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

세 직선이 삼각형을 이루지 않는 경우는 두 직선이 평행하거나 세 직선이 한 점에서 만나는 경우이다. (1) $ax + y + 3 = 0$ ($y = -ax - 3$)이 $x + y - 4 = 0$ ($y = -x + 4$)과 평행할 때: $-a = -1 \implies a = 1$ (2) $ax + y + 3 = 0$이 $-2x + y + 5 = 0$ ($y = 2x - 5$)과 평행할 때: $-a = 2 \implies a = -2$ (3) 세 직선이 한 점에서 만날 때: $x + y = 4$와 $-2x + y = -5$의 교점은 $(3, 1)$이므로 $3a + 1 + 3 = 0 \implies 3a = -4 \implies a = -\dfrac{4}{3}$ $\therefore 1 + (-2) + \left(-\dfrac{4}{3}\right) = -\dfrac{7}{3}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선과 변 $AB$의 교점을 $D$라 하자. $\angle A = 64^\circ$일 때, 다음 물음에 답하시오. (1) $\angle B$의 크기를 구하는 데 필요한 이등변삼각형의 성질을 쓰고, $\angle B$의 크기를 구하시오. (2) $\angle BDC$의 크기를 구하고, 구하는 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $58^\circ$, (2) $93^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 이등변삼각형의 두 밑각의 크기는 같으므로 angle B = (180도 - 64도)/2 = 58도이다.
2. (2) CD가 각 C의 이등분선이므로 angle BCD = 58도 / 2 = 29도이다.
3. triangle BDC에서 angle BDC = 180도 - (58도 + 29도) = 93도이다.
- 작성자 답: (1) $58^\circ$, (2) $93^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「(1) 이등변삼각형의 두 밑각의 크기는 같으므로 $\a」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] (원천과 같음)
- 이유: 이등변삼각형 ABC의 밑각 성질로 angle B = 58도와 각 BDC = 93도를 산출한다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_BASE_ANGLES (원천과 같음) (원천과 같음)
- 이유: 이등변삼각형 ABC에서 꼭지각 64도와 각 이등분선으로 밑각과 교각을 구하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 밑각 공식으로 58도를 구하고 삼각형 내각 합으로 93도를 순차 계산하므로 난이도 2이다.

**4칸**
- given: 이등변삼각형←stem:「e{AC}$인 이등변삼각형 $ABC$에서」
- goal: 이등분선←stem:「gle C$의 이등분선과 변 $AB$」
- method: 이등분선(NAMED)←stem:「gle C$의 이등분선과 변 $AB$」
- condition: (없음)

**how** 밑각 공식으로 angle B = 58도를 얻고 이등분각 29도로부터 angle BDC = 93도를 계산했다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 이등변삼각형의 두 밑각의 크기는 같으므로 $\angle B = \angle C$이다. $\angle B = \dfrac{180^\circ - 64^\circ}{2} = 58^\circ$ (2) $\overline{CD}$는 $\angle C$의 이등분선이므로 $\angle BCD = \dfrac{58^\circ}{2} = 29^\circ$ $\triangle BDC$에서 $\therefore \angle BDC = 180^\circ - (58^\circ + 29^\circ) = 93^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

정사각형 $ABCD$의 두 대각선 $AC$, $BD$의 교점을 $O$라 하고, 선분 $OA$ 위의 한 점 $E$에 대하여 $\overline{OC} = 8\text{ cm}$, $\overline{OD} = x\text{ cm}$, $\angle BEO = 62^\circ$, $\angle ABE = y^\circ$라 하자. 다음 물음에 답하시오. (1) 정사각형의 대각선에 관한 성질을 모두 쓰시오. (2) (1)의 성질을 이용하여 $x$, $y$의 값을 각각 구하고, 구하는 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 길이가 같고, 서로 다른 것을 수직이등분하며, 각 꼭짓각을 이등분한다. (2) $x = 8$, $y = 17$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 정사각형의 두 대각선은 길이가 같고, 서로 다른 것을 수직이등분하며, 각 꼭짓각을 이등분한다.
2. (2) 대각선이 서로 이등분하므로 x = OD = OC = 8 cm에서 x = 8이다.
3. 대각선이 직교하므로 triangle BOE에서 angle OBE = 90도 - 62도 = 28도이고, 대각선이 꼭짓각을 이등분하므로 y = 45도 - 28도 = 17이다.
- 작성자 답: (1) 길이가 같고, 서로 다른 것을 수직이등분하며, 각 꼭짓각을 이등분한다. (2) $x = 8$, $y = 17$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「(1) 정사각형의 두 대각선은 길이가 같고, 서로 다른」
**RPM** M2-RPM-079 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] (원천과 같음)
- 이유: 정사각형 ABCD의 대각선 길이 같음과 수직이등분 성질로 x = 8, y = 17을 구한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 정사각형 ABCD의 대각선 성질을 이용해 미지수 x, y의 값을 구하는 서술형 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 정사각형 대각선의 수직이등분 및 꼭짓각 45도 이등분 성질을 종합 적용하므로 난이도 3이다.

**4칸**
- given: 정사각형←stem:「정사각형 $ABCD$의」
- goal: 대각선←stem:「BCD$의 두 대각선 $AC$, $」
- method: 사각형(NAMED)←stem:「정사각형 $ABCD$의」
- condition: (없음)

**how** 대각선 성질로 x = 8을 구하고 angle BOE = 90도와 45도에서 y = 17을 도출하여 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 정사각형의 두 대각선은 길이가 같고, 서로 다른 것을 수직이등분하며, 각 꼭짓각을 이등분한다. (2) 두 대각선의 길이가 같고 서로를 이등분하므로 $x = \overline{OD} = \overline{OC} = 8$ $\angle BOE = 90^\circ$이므로 $\triangle BEO$에서 $\angle EBO = 180^\circ - (90^\circ + 62^\circ) = 28^\circ$ 대각선 $BD$가 $\angle ABC = 90^\circ$를 이등분하므로 $\angle ABO = 45^\circ$ $\therefore y = 45 - 28 = 17$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
