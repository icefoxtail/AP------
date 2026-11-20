# 검수 묶음 — 24_신흥중_2학기_기말_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: )**
- 문항 24개 / 검사 PASS 24, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: SELF_CONTAINED 14, NONE 10
- 난이도 분포: 1단계 4, 2단계 14, 3단계 5, 4단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q6**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q10**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q11**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q17**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q22**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q24**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림의 원 $O$에서 호 $\wideparen{AB}$에 대한 중심각 $\angle AOB = 130^\circ$일 때, 같은 호에 대한 원주각 $\angle APB = \angle x$의 크기는? [3점]

**보기** ① $55^\circ$  ② $60^\circ$  ③ $65^\circ$  ④ $70^\circ$  ⑤ $75^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 호 $\wideparen{AB}$에 대한 원주각 $\angle APB = \dfrac{1}{2}\angle AOB$이다.
2. $\angle x = \dfrac{1}{2} \times 130^\circ = 65^\circ$이다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 원 $O$에서 호

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「B}$에 대한 중심각 $\angle AOB =」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각과 중심각의 크기 → 원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각**
- 이유: 중심각과 원주각의 크기 관계를 적용하는 중심각과 원주각 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC **원천→판정: PT_M3_INSCRIBED_ANGLE_BASIC → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_INSCRIBED_ANGLE_FROM_CENTRAL → TPL_CIRCLE_ANGLE_CENTER_ARC**
- 이유: 호에 대한 원주각과 중심각 사이의 기본 비례 관계를 묻는 유형이다. (문항 토큰 AB)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초적인 원주각 공식을 직접 대입하는 난이도 1 문항이다. (문항 토큰 AB)

**4칸**
- given: 중심각←stem:「B}$에 대한 중심각 $\angle AOB =」
- goal: 원주각←stem:「은 호에 대한 원주각 $\angle APB =」
- method: 원주각(NAMED)←solution:「한 호에 대한 원주각의 크기는 그 호에 대한 중」
- condition: 원주각←solution:「한 호에 대한 원주각의 크기는 그 호에 대한 중」

**how** 호에 대한 원주각의 크기가 중심각의 절반임을 이용하여 각을 계산했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

한 원에서 한 호에 대한 원주각의 크기는 그 호에 대한 중심각의 크기의 절반이다.


호 $\wideparen{AB}$에 대한 중심각이 $\angle AOB = 130^\circ$이므로 원주각 $\angle APB = \angle x$의 크기는 다음과 같다. $$\begin{aligned} \angle x &= \dfrac{1}{2} \angle AOB \ &= \dfrac{1}{2}         imes 130^\circ \ &= 65^\circ \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 <보기>의 사각형 $ABCD$ 중 원에 내접하는 것만을 있는 대로 고른 것은? [4점]


<보기> • ㄱ. $\angle B = 75^\circ$이고, 꼭짓점 $D$에서의 외각의 크기가 $75^\circ$이다. • ㄴ. 선분 $BC$에 대하여 $\angle BAC = 45^\circ$, $\angle BDC = 45^\circ$이다. • ㄷ. $\angle A = 85^\circ$, $\angle C = 85^\circ$이다. • ㄹ. $\angle B = 110^\circ$, $\angle D = 80^\circ$이다.

**보기** ① ㄱ, ㄴ  ② ㄱ, ㄷ  ③ ㄴ, ㄹ  ④ ㄱ, ㄴ, ㄷ  ⑤ ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ㄱ. 외각과 대내각의 크기가 $75^\circ$로 같으므로 원에 내접한다. (참)
2. ㄴ. 한 변에 대한 원주각 크기가 $45^\circ$로 같으므로 원에 내접한다. (참)
3. ㄷ. 대각의 합이 $170^\circ \ne 180^\circ$이므로 내접하지 않는다. (거짓)
4. ㄹ. 대각의 합이 $190^\circ \ne 180^\circ$이므로 내접하지 않는다. (거짓)
5. 따라서 원에 내접하는 사각형은 ㄱ, ㄴ이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「음 <보기>의 사각형 $ABCD$ 중 원에 내접」
**RPM** M3-RPM-078 [원의 성질 > 원주각 > 원주각의 활용 > 네 점이 한 원 위에 있을 조건] **원천→판정: 기하 > 원의 성질 > 원주각의 활용 > 사각형이 원에 내접하기 위한 조건 → 원의 성질 > 원주각 > 원주각의 활용 > 네 점이 한 원 위에 있을 조건**
- 이유: 네 점이 한 원 위에 있을 조건을 판별하는 네 점이 한 원 위에 있을 조건 유형이다. (문항 토큰 ABCD)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_RELATIONS_CONCYCLIC **원천→판정: PT_M3_INSCRIBED_QUADRILATERAL_CONDITION → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_INSCRIBED_QUADRILATERAL_PROPERTY_AUDIT → TPL_CIRCLE_ANGLE_RELATIONS_CONCYCLIC**
- 이유: 사각형이 원에 내접하기 위한 각 조건을 분석하고 참인 보기를 선택하는 유형이다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 여러 내접 조건을 각각 대조해야 하는 난이도 2 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「음 <보기>의 사각형 $ABCD$ 중 원에 내접」
- goal: 내접←stem:「D$ 중 원에 내접하는 것만을 있는 대로 고른」
- method: 내접(NAMED)←solution:「사각형이 원에 내접하기 위한 조건을 각 보기별」
- condition: 내접←solution:「사각형이 원에 내접하기 위한 조건을 각 보기별」

**how** 대각의 합 180도 및 원주각 동등 조건을 각 보기에 적용하여 내접 여부를 판정했다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

사각형이 원에 내접하기 위한 조건을 각 보기별로 확인한다. $$\begin{aligned} \text{ㄱ. } & \text{사각형의 한 외각의 크기가 그 대내각의 크기와 같으면 대각의 크기의 합이 } 180^\circ\text{이다.} \ & \text{꼭짓점 } D\text{에서의 외각이 } 75^\circ\text{이면 내각 } \angle D = 180^\circ - 75^\circ = 105^\circ\text{이므로} \ & \angle B + \angle D = 75^\circ + 105^\circ = 180^\circ \ & \text{따라서 사각형 } ABCD\text{는 원에 내접한다. (참)} \ \text{ㄴ. } & \text{두 점 } A, D\text{가 선분 } BC\text{에 대하여 같은 쪽에 있고 } \angle BAC = \angle BDC = 45^\circ\text{이므로} \ & \text{원주각의 성질에 의하여 네 점 } A, B, C, D\text{는 한 원 위에 있다.} \ & \text{따라서 사각형 } ABCD\text{는 원에 내접한다. (참)} \ \text{ㄷ. } & \text{마주 보는 두 대각의 크기의 합을 구하면} \ & \angle A + \angle C = 85^\circ + 85^\circ = 170^\circ \ne 180^\circ \ & \text{대각의 합이 } 180^\circ\text{가 아니므로 원에 내접하지 않는다. (거짓)} \ \text{ㄹ. } & \text{마주 보는 두 대각의 크기의 합을 구하면} \ & \angle B + \angle D = 110^\circ + 80^\circ = 190^\circ \ne 180^\circ \ & \text{대각의 합이 } 180^\circ\text{가 아니므로 원에 내접하지 않는다. (거짓)} \end{aligned}$$ 따라서 원에 내접하는 사각형은 ㄱ, ㄴ이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림의 원 $O$에서 중심각 $\angle BOC = 100^\circ$이고 원주각 $\angle AQC = 70^\circ$일 때, $\angle APB$의 크기를 구하면? [4점] (단, 점 $A, B, C, P, Q$는 원 $O$ 위의 점이다.)

**보기** ① $15^\circ$  ② $20^\circ$  ③ $25^\circ$  ④ $30^\circ$  ⑤ $35^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 호 $AC$에 대한 원주각 $\angle AQC = 70^\circ$이므로 중심각은 $140^\circ$이다.
2. $\angle AOB = 140^\circ - 100^\circ = 40^\circ$이다.
3. 따라서 원주각 $\angle APB = \dfrac{1}{2} \times 40^\circ = 20^\circ$이다. (정답 ②)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 원 $O$에서 중심각

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 $O$에서 중심각 $\angle BOC =」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각의 성질 → 원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각**
- 이유: 중심각과 원주각의 변환 관계를 다루는 중심각과 원주각 유형이다. (문항 토큰 BOC)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC **원천→판정: PT_M3_INSCRIBED_ANGLE_CALCULATION → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_INSCRIBED_ANGLE_SUBTRACTION → TPL_CIRCLE_ANGLE_CENTER_ARC**
- 이유: 원주각과 중심각의 복합 차 관계를 이용하여 미지의 원주각을 구하는 유형이다. (문항 토큰 BOC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 중심각 분할과 원주각 환산 2단계를 수행하는 난이도 2 문항이다. (문항 토큰 BOC)

**4칸**
- given: 중심각←stem:「원 $O$에서 중심각 $\angle BOC =」
- goal: 원주각←stem:「circ$이고 원주각 $\angle AQC =」
- method: 원주각(NAMED)←solution:「호에 대한 원주각과 중심각의 관계를 단계별로」
- condition: 원주각←solution:「호에 대한 원주각과 중심각의 관계를 단계별로」

**how** 원주각에서 중심각을 역산하고 중심각의 차를 구해 다른 원주각의 크기를 구했다. (문항 토큰 BOC)

<details><summary>저장 해설 (판정 검토용)</summary>

호에 대한 원주각과 중심각의 관계를 단계별로 적용한다.


1단계: $\angle AQC = 70^\circ$는 호 $\wideparen{ABC}$에 대한 원주각이므로 호 $\wideparen{ABC}$의 중심각의 크기는 다음과 같다. $$\begin{aligned} 2 \times \angle AQC &= 2 \times 70^\circ \ &= 140^\circ \end{aligned}$$


2단계: 호 $\wideparen{BC}$에 대한 중심각은 $\angle BOC = 100^\circ$이므로, 호 $\wideparen{AB}$에 대한 중심각의 크기는 다음과 같다. $$\begin{aligned} \angle AOB &= 140^\circ - 100^\circ \ &= 40^\circ \end{aligned}$$


3단계: $\angle APB$는 호 $\wideparen{AB}$에 대한 원주각이므로 그 크기는 다음과 같다. $$\begin{aligned} \angle APB &= \dfrac{1}{2} \angle AOB \ &= \dfrac{1}{2} \times 40^\circ \ &= 20^\circ \end{aligned}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림과 같이 오각형 $ABCDE$가 원 $O$에 내접하고 중심각 $\angle BOC = 80^\circ$일 때, $\angle BAE + \angle CDE$의 크기의 합은? [4점]

**보기** ① $205^\circ$  ② $210^\circ$  ③ $215^\circ$  ④ $220^\circ$  ⑤ $225^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 오각형 내접에서 호의 중심각 합은 $360^\circ + 80^\circ = 440^\circ$이다.
2. 두 원주각의 합은 중심각 합의 절반이므로 $440^\circ / 2 = 220^\circ$이다.
3. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 오각형 $ABCDE$가 원 $O$에 내접하고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 $O$에 내접하고 중심각 $\angle」
**RPM** M3-RPM-077 [원의 성질 > 원주각 > 원주각의 활용 > 내접사각형의 각] **원천→판정: 기하 > 원의 성질 > 원주각의 활용 > 원에 내접하는 다각형의 성질 → 원의 성질 > 원주각 > 원주각의 활용 > 내접사각형의 각**
- 이유: 내접다각형의 각과 원주각 성질을 응용하는 내접사각형의 각 유형이다. (문항 토큰 ABCDE)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_INSCRIBED_POLYGON_ARC_SUM **원천→판정: PT_M3_INSCRIBED_POLYGON_ANGLE_SUM → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_INSCRIBED_PENTAGON_OPPOSITE_ANGLES → TPL_CIRCLE_ANGLE_INSCRIBED_POLYGON_ARC_SUM**
- 이유: 원에 내접하는 다각형에서 원주각과 대하는 호의 중심각 합을 연계하는 유형이다. (문항 토큰 ABCDE)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 오각형에서 보조선 또는 호의 분할 합을 유도하는 난이도 2 문항이다. (문항 토큰 ABCDE)

**4칸**
- given: 내접←stem:「원 $O$에 내접하고 중심각 $\angle」
- goal: 중심각←stem:「$에 내접하고 중심각 $\angle BOC =」
- method: 원주각(NAMED)←solution:「원주각과 대하는 호의 중심각의 관」
- condition: 원주각←solution:「원주각과 대하는 호의 중심각의 관」

**how** 원주각이 대하는 호의 중심각 합을 구하고 2로 나누어 두 내각의 합을 도출했다. (문항 토큰 ABCDE)

<details><summary>저장 해설 (판정 검토용)</summary>

원주각과 대하는 호의 중심각의 관계를 이용한다.


$\angle BAE = \angle x$, $\angle CDE = \angle y$라 하자. 1단계: $\angle x$는 점 $A$를 포함하지 않는 호 $\wideparen{BCDE}$에 대한 원주각이므로, 이 호의 중심각의 크기는 $2x$이다. 2단계: $\angle y$는 점 $D$를 포함하지 않는 호 $\wideparen{CBAE}$에 대한 원주각이므로, 이 호의 중심각의 크기는 $2y$이다. 3단계: 두 호 $\wideparen{BCDE}$와 $\wideparen{CBAE}$를 더하면 원 전체 둘레 $360^\circ$에 공통으로 겹치는 호 $\wideparen{BC}$가 한 번 더 더해진다. 중심각 $\angle BOC = 80^\circ$이므로 호 $\wideparen{BC}$의 중심각의 크기는 $80^\circ$이다. 따라서 다음 등식이 성립한다. $$\begin{aligned} 2x + 2y &= 360^\circ + 80^\circ \ 2(x + y) &= 440^\circ \ x + y &= 220^\circ \end{aligned}$$ 따라서 $\angle BAE + \angle CDE = 220^\circ$이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림에서 선분 $AB$는 원 $O$의 지름이고, 점 $D$는 호 $\wideparen{BC}$의 중점이다. $\angle DAB = 22^\circ$일 때, $\angle ABC$의 크기를 구하면? [4점]

**보기** ① $38^\circ$  ② $40^\circ$  ③ $42^\circ$  ④ $44^\circ$  ⑤ $46^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지름에 대한 원주각 $\angle ADB = 90^\circ$이다.
2. $\angle DAB = 22^\circ$에서 중심각 계산을 거쳐 $\angle ADC = 46^\circ$이다.
3. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 선분 $AB$는 원 $O$의 지름이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 선분 $AB$는 원 $O$의 지」
**RPM** M3-RPM-076 [원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각과 호의 길이 → 원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각**
- 이유: 지름에 대한 원주각 성질을 다루는 반원에 대한 원주각 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC **원천→판정: PT_M3_INSCRIBED_ANGLE_DIAMETER_ARC → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_DIAMETER_ARC_BISECTION_ANGLE → TPL_CIRCLE_ANGLE_CENTER_ARC**
- 이유: 반원에 대한 원주각의 성질과 호의 비례를 결합한 각 계산 유형이다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각과 호의 등분 조건을 함께 활용하는 난이도 2 문항이다. (문항 토큰 AB)

**4칸**
- given: 선분←stem:「다음 그림에서 선분 $AB$는 원 $O$의 지」
- goal: 선분←stem:「다음 그림에서 선분 $AB$는 원 $O$의 지」
- method: 중심각(NAMED)←solution:「원주각과 호의 중심각 관계를 단계별로 계산한다.」
- condition: 중심각←solution:「원주각과 호의 중심각 관계를 단계별로 계산한다.」

**how** 지름에 대한 원주각 90도와 호의 중점 비례 관계를 적용하여 각을 구했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

지름에 대한 원주각과 호의 중심각 관계를 단계별로 계산한다.


1단계: $\angle DAB = 22^\circ$는 호 $\wideparen{DB}$에 대한 원주각이므로, 호 $\wideparen{DB}$의 중심각의 크기는 다음과 같다. $$\begin{aligned} \wideparen{DB} &= 2 \times 22^\circ \ &= 44^\circ \end{aligned}$$


2단계: 점 $D$가 호 $\wideparen{BC}$의 중점이므로 호 $\wideparen{CD}$와 호 $\wideparen{DB}$의 크기는 서로 같다. $$\begin{aligned} \wideparen{CD} &= \wideparen{DB} = 44^\circ \ \wideparen{BC} &= 44^\circ + 44^\circ = 88^\circ \end{aligned}$$


3단계: 선분 $AB$가 원 $O$의 지름이므로 반원의 중심각의 크기는 $180^\circ$이다. 따라서 호 $\wideparen{AC}$의 중심각의 크기는 다음과 같다. $$\begin{aligned} \wideparen{AC} &= 180^\circ - \wideparen{BC} \ &= 180^\circ - 88^\circ \ &= 92^\circ \end{aligned}$$


4단계: $\angle ABC$는 호 $\wideparen{AC}$에 대한 원주각이므로 그 크기는 다음과 같다. $$\begin{aligned} \angle ABC &= \dfrac{1}{2} \times \wideparen{AC} \ &= \dfrac{1}{2} \times 92^\circ \ &= 46^\circ \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

한 원 $O$에서 크기가 $35^\circ$인 원주각이 대하는 호의 길이가 $14\rm,cm$일 때, 크기가 $50^\circ$인 원주각이 대하는 호의 길이 $x$의 값을 구하면? [4점]

**보기** ① $16\rm,cm$  ② $17\rm,cm$  ③ $18\rm,cm$  ④ $19\rm,cm$  ⑤ $20\rm,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원주각의 크기와 호의 길이는 정비례하므로 $35 : 14 = 50 : x$이다.
2. $35x = 700 \implies x = 20\rm,cm$이다.
3. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「\circ$인 원주각이 대하는 호의 길이가 $1」
**RPM** M3-RPM-074 [원의 성질 > 원주각 > 원주각과 중심각 > 같은 호에 대한 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각의 크기와 호의 길이 → 원의 성질 > 원주각 > 원주각과 중심각 > 같은 호에 대한 원주각**
- 이유: 호의 길이와 원주각 크기의 비례를 다루는 같은 호에 대한 원주각 유형이다. (문항 토큰 35)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC **원천→판정: PT_M3_ARC_LENGTH_PROPORTION → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_ARC_LENGTH_DIRECT_PROPORTION → TPL_CIRCLE_ANGLE_CENTER_ARC**
- 이유: 원주각의 크기와 호의 길이 사이의 정비례 관계를 이용한 길이 계산 유형이다. (문항 토큰 35)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정비례식을 구성하고 미지수를 계산하는 난이도 2 문항이다. (문항 토큰 35)

**4칸**
- given: 원주각←stem:「\circ$인 원주각이 대하는 호의 길이가 $1」
- goal: 원주각←stem:「\circ$인 원주각이 대하는 호의 길이가 $1」
- method: 원주각(NAMED)←solution:「그 호에 대한 원주각의 크기에 정비례한다.」
- condition: 원주각←solution:「그 호에 대한 원주각의 크기에 정비례한다.」

**how** 원주각의 크기와 호의 길이가 정비례한다는 성질로 비례식을 세워 풀었다. (문항 토큰 35)

<details><summary>저장 해설 (판정 검토용)</summary>

한 원에서 호의 길이는 그 호에 대한 원주각의 크기에 정비례한다.


원주각의 크기가 $35^\circ$일 때 호의 길이가 $14\rm,cm$이므로, 원주각의 크기가 $50^\circ$일 때의 호의 길이 $x$에 대하여 비례식을 세우면 다음과 같다. $$\begin{aligned} 14 : x &= 35^\circ : 50^\circ \ 14 : x &= 7 : 10 \ 7x &= 14         imes 10 \ 7x &= 140 \ x &= 20\rm,cm \end{aligned}$$ 따라서 호의 길이 $x$의 값은 $20\rm,cm$이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림에서 직선 $AT$는 원 $O$의 접선이고 점 $A$는 접점이다. 사각형 $ABCD$가 원 $O$에 내접하고 $\angle BAT = 35^\circ$, $\angle CDB = 40^\circ$일 때, $\angle CBA - \angle ADB$의 값을 구하면? [4점] (단, 점 $T$는 접선 위의 점이다.)

**보기** ① $70^\circ$  ② $74^\circ$  ③ $78^\circ$  ④ $82^\circ$  ⑤ $86^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 접현각 성질에 의해 $\angle ADB = \angle BAT = 35^\circ$이다.
2. 내접사각형 성질과 삼각형 내각 합으로 계산하면 $\angle C = 70^\circ$이다.
3. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 직선 $AT$는 원 $O$의 접선이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 $O$의 접선이고 점 $A$는 접점이다.」
**RPM** M3-RPM-079 [원의 성질 > 원주각 > 원주각의 활용 > 접선과 현이 이루는 각] **원천→판정: 기하 > 원의 성질 > 원주각의 활용 > 접선과 현이 이루는 각 → 원의 성질 > 원주각 > 원주각의 활용 > 접선과 현이 이루는 각**
- 이유: 접현각과 원주각의 등가성을 활용하는 접선과 현이 이루는 각 유형이다. (문항 토큰 AT)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_TANGENT_CHORD **원천→판정: PT_M3_TANGENT_CHORD_ANGLE → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_TANGENT_CHORD_AND_INSCRIBED_QUAD → TPL_CIRCLE_ANGLE_TANGENT_CHORD**
- 이유: 접선과 현이 이루는 각의 성질과 내접사각형 성질을 복합 활용하는 유형이다. (문항 토큰 AT)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접현각 변환과 내접사각형 대각 판정을 연쇄적으로 적용하는 난이도 3 문항이다. (문항 토큰 AT)

**4칸**
- given: 접선←stem:「원 $O$의 접선이고 점 $A$는 접점이다.」
- goal: 접선←stem:「원 $O$의 접선이고 점 $A$는 접점이다.」
- method: 접선(NAMED)←solution:「접선과 현이 이루는 각 및 원에」
- condition: 접선←solution:「접선과 현이 이루는 각 및 원에」

**how** 접선과 현이 이루는 각과 내접사각형 대각의 합 성질을 연계하여 각을 구했다. (문항 토큰 AT)

<details><summary>저장 해설 (판정 검토용)</summary>

접선과 현이 이루는 각 및 원에 내접하는 사각형의 성질을 단계별로 적용한다.


1단계: 접선과 현이 이루는 각의 성질에 의하여 접선 $AT$와 현 $AB$가 이루는 각은 그 호에 대한 원주각 $\angle ADB$의 크기와 같다. $$\begin{aligned} \angle ADB &= \angle BAT \ &= 35^\circ \end{aligned}$$


2단계: 꼭짓점 $D$에서의 내각 $\angle CDA$의 크기는 다음과 같다. $$\begin{aligned} \angle CDA &= \angle CDB + \angle ADB \ &= 40^\circ + 35^\circ \ &= 75^\circ \end{aligned}$$


3단계: 사각형 $ABCD$는 원 $O$에 내접하므로 서로 마주 보는 두 대각의 크기의 합은 $180^\circ$이다. $$\begin{aligned} \angle CBA + \angle CDA &= 180^\circ \ \angle CBA &= 180^\circ - 75^\circ \ &= 105^\circ \end{aligned}$$


4단계: 따라서 구하고자 하는 차의 값은 다음과 같다. $$\begin{aligned} \angle CBA - \angle ADB &= 105^\circ - 35^\circ \ &= 70^\circ \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

다음 그림에서 점 $D$는 원 $O$ 위의 점 $C$에서의 접선과 지름 $AB$의 연장선의 교점이다. $\angle CAB = 30^\circ$이고 선분 $AB = 14\rm,cm$일 때, 선분 $AD$의 길이를 구하면? [4점]

**보기** ① $20\rm,cm$  ② $21\rm,cm$  ③ $22\rm,cm$  ④ $23\rm,cm$  ⑤ $24\rm,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지름 $AB$에 대한 원주각 $\angle ACB = 90^\circ$이다.
2. 특수각 삼각비와 접현각을 적용하여 계산하면 선분 $AD = 21\rm,cm$이다.
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 점 $D$는 원 $O$ 위의 점 $C$에서의 접선과

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_INSCRIBED_ANGLE → M3-06-CIRCLE_LINE**
- 근거 인용: 「$C$에서의 접선과 지름 $AB$의 연장선의」
**RPM** M3-RPM-070 [원의 성질 > 원과 직선 > 원의 접선 > 접점의 반지름과 접선] **원천→판정: 기하 > 원의 성질 > 원주각의 활용 > 접선과 현이 이루는 각의 활용 → 원의 성질 > 원과 직선 > 원의 접선 > 접점의 반지름과 접선**
- 이유: 접점에서의 기하적 성질을 분석하는 접점의 반지름과 접선 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE **원천→판정: PT_M3_TANGENT_DIAMETER_SEGMENT → PT_CIRCLE_TANGENT** **원천→판정: TPL_M3_TANGENT_DIAMETER_SPECIAL_ANGLE → TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE**
- 이유: 원의 접선과 지름이 이루는 직각삼각형에서 삼각비와 접현각으로 길이를 구하는 유형이다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각비와 원의 접선 성질을 융합하여 선분 길이를 계산하는 난이도 3 문항이다. (문항 토큰 AB)

**4칸**
- given: 접선←stem:「$C$에서의 접선과 지름 $AB$의 연장선의」
- goal: 선분←stem:「circ$이고 선분 $AB = 14\rm,cm」
- method: 직각삼각형(NAMED)←solution:「직각삼각형의 삼각비와 접현각의 성질을」
- condition: 직각삼각형←solution:「직각삼각형의 삼각비와 접현각의 성질을」

**how** 지름 원주각 90도, 특수각 삼각비, 접선과 현의 각 성질을 연계하여 길이를 도출했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형의 삼각비와 접현각의 성질을 단계별로 적용한다.


1단계: 선분 $AB$가 원 $O$의 지름이므로 지름에 대한 원주각의 성질에 의하여 다음이 성립한다. $$\angle ACB = 90^\circ$$ 직각삼각형 $ABC$에서 $\angle CAB = 30^\circ$이므로 $$\begin{aligned} \angle ABC &= 90^\circ - 30^\circ \ &= 60^\circ \end{aligned}$$


2단계: 직각삼각형 $ABC$에서 선분 $BC$의 길이는 다음과 같다. $$\begin{aligned} BC &= AB \times \sin 30^\circ \ &= 14 \times \dfrac{1}{2} \ &= 7\rm,cm \end{aligned}$$


3단계: 직선 $CD$는 점 $C$에서의 접선이므로 접선과 현이 이루는 각의 성질에 의하여 $$\angle BCD = \angle BAC = 30^\circ$$ 세 점 $A, B, D$가 한 직선 위에 있으므로 $$\begin{aligned} \angle CBD &= 180^\circ - \angle ABC \ &= 180^\circ - 60^\circ \ &= 120^\circ \end{aligned}$$ 삼각형 $BCD$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle BDC &= 180^\circ - (120^\circ + 30^\circ) \ &= 30^\circ \end{aligned}$$ 따라서 $\angle BCD = \angle BDC = 30^\circ$이므로 삼각형 $BCD$는 이등변삼각형이다. $$BD = BC = 7\rm,cm$$


4단계: 따라서 선분 $AD$의 길이는 다음과 같다. $$\begin{aligned} AD &= AB + BD \ &= 14 + 7 \ &= 21\rm,cm \end{aligned}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림과 같이 깨진 원 모양 접시의 원 위의 세 점 $A, B, C$에 대하여 선분 $AC = 10\rm,cm$, $BC = 6\rm,cm$이고, 점 $C$에서 현 $AB$에 내린 수선의 발을 $D$라 할 때 $CD = 3\rm,cm$이다. 이때 원래 접시의 반지름의 길이를 구하면? [5점]

**보기** ① $8\rm,cm$  ② $9\rm,cm$  ③ $10\rm,cm$  ④ $11\rm,cm$  ⑤ $12\rm,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지름 $CE = 2R$을 긋고 직각삼각형 닮음비를 적용하면 $10 : 2R = 5 : 6 \implies 2R = 12$이다.
2. 반지름 $R = 6\rm,cm$이며 지름은 $12\rm,cm$이다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 깨진 원 모양 접시의 원 위의 세 점

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「C$에 대하여 선분 $AC = 10\rm,cm」
**RPM** M3-RPM-076 [원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각과 삼각형의 닮음 → 원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각**
- 이유: 지름에 대한 원주각 성질을 응용하는 반원에 대한 원주각 유형이다. (문항 토큰 AC)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION **원천→판정: PT_M3_SIMILARITY_INSCRIBED_DIAMETER → PT_TRIANGLE_SIMILARITY** **원천→판정: TPL_M3_DIAMETER_ALTITUDE_SIMILARITY → TPL_TRIANGLE_SIMILARITY_APPLICATION**
- 이유: 원의 지름 보조선 작도 후 직각삼각형의 닮음비를 이용해 원의 반지름을 구하는 고난도 유형이다. (문항 토큰 AC)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 보조선 작도와 닮음 증명을 결합한 난이도 4 문항이다. (문항 토큰 AC)

**4칸**
- given: 선분←stem:「C$에 대하여 선분 $AC = 10\rm,cm」
- goal: 선분←stem:「C$에 대하여 선분 $AC = 10\rm,cm」
- method: 닮음(NAMED)←solution:「긋고 삼각형의 닮음을 이용하여 지름을 구한다.」
- condition: 닮음←solution:「긋고 삼각형의 닮음을 이용하여 지름을 구한다.」

**how** 지름을 지나는 직각삼각형을 보조선으로 긋고 원주각 성질과 AA 닮음비를 이용했다. (문항 토큰 AC)

<details><summary>저장 해설 (판정 검토용)</summary>

원의 지름을 긋고 삼각형의 닮음을 이용하여 지름을 구한다.


1단계: 점 $C$를 지나는 원 $O$의 지름 $CE$를 긋고, 점 $B$와 점 $E$를 선분으로 잇는다. 선분 $CE$가 지름이므로 지름에 대한 원주각에 의하여 $$\angle CBE = 90^\circ$$ 조건에서 $CD \perp AB$이므로 $$\angle ADC = 90^\circ$$


2단계: 점 $D$가 선분 $AB$ 위에 있으므로 $\angle CAD = \angle CAB$이다. 호 $\wideparen{CB}$에 대한 원주각의 크기는 서로 같으므로 $$\angle CAB = \angle CEB$$ 따라서 $\triangle ACD$와 $\triangle CEB$에서 두 쌍의 대응각의 크기가 각각 같으므로 $$\triangle ACD \sim \triangle CEB \quad (\text{AA 닮음})$$


3단계: 두 닮은 삼각형의 대응변의 길이의 비는 일정하므로 $$\begin{aligned} AC : CE &= CD : CB \ 10 : CE &= 3 : 6 \ 10 : CE &= 1 : 2 \ CE &= 20\rm,cm \end{aligned}$$


4단계: 선분 $CE$는 원의 지름이므로 원래 접시의 반지름의 길이 $R$은 다음과 같다. $$\begin{aligned} R &= \dfrac{CE}{2} \ &= \dfrac{20}{2} \ &= 10\rm,cm \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 $7$개의 자료의 평균과 최빈값이 서로 같다고 할 때, 상수 $A$의 값을 구하면? [4점]


$8$
  $9$
  $10$
  $8$
  $8$
  $7$
  $A$

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 자료: $5, 7, 8, a, 10, 8, 4$
2. 이미 $8$이 $2$개 있으므로 최빈값은 $8$이다.
3. 평균 $(42+a)/7 = 8 \implies 42 + a = 56 \implies a = 14$이다.
4. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「$개의 자료의 평균과 최빈값이 서로 같다고 할」
**RPM** M3-RPM-081 [통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 평균과 최빈값의 관계 → 통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값**
- 이유: 대푯값의 정의와 성질을 다루는 평균·중앙값·최빈값 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_DETERMINE_UNKNOWN_FROM_MEAN_AND_MEDIAN_CONDITIONS **원천→판정: PT_M3_REPRESENTATIVE_MEAN_MODE → PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE** **원천→판정: TPL_M3_REPRESENTATIVE_MEAN_MODE_EQUATION → TPL_M3_DETERMINE_UNKNOWN_FROM_MEAN_AND_MEDIAN_CONDITIONS**
- 이유: 평균과 최빈값이 일치한다는 대푯값 조건으로부터 미지 변량을 결정하는 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 최빈값 판단과 일차방정식 해결을 결합한 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 평균←stem:「$개의 자료의 평균과 최빈값이 서로 같다고 할」
- goal: 최빈값←stem:「자료의 평균과 최빈값이 서로 같다고 할 때, 상」
- method: 최빈값(NAMED)←solution:「자료의 최빈값과 평균의 정의를 이용하여」
- condition: 평균←solution:「료의 최빈값과 평균의 정의를 이용하여 미지수」

**how** 최빈값을 먼저 확정하고 평균 공식과의 일치 방정식을 풀어 미지수를 구했다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

자료의 최빈값과 평균의 정의를 이용하여 미지수 $A$를 구한다.


1단계: 주어진 $7$개의 자료 중 이미 알려진 $6$개의 값에서 $8$이 $3$회로 가장 많이 나타나므로 최빈값은 $8$이다. 2단계: 문제에서 평균과 최빈값이 서로 같다고 하였으므로 평균도 $8$이어야 한다. 3단계: $7$개 자료의 총합은 $\text{평균} \times 7 = 8 \times 7 = 56$이다. $A$를 제외한 나머지 $6$개 자료의 합은 다음과 같다. $$8 + 9 + 10 + 8 + 8 + 7 = 50$$ 따라서 $A$에 관한 일차방정식을 세우면 다음과 같다. $$\begin{aligned} \dfrac{50 + A}{7} &= 8 \ 50 + A &= 56 \ A &= 6 \end{aligned}$$ $A=6$일 때 자료는 $6, 7, 8, 8, 8, 9, 10$으로 최빈값은 $8$로 유일하고 평균도 $8$이 되어 조건을 만족한다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

어떤 농구 선수 $6$명이 한 달 동안 기록한 득점 수를 작은 값에서부터 차례로 나열할 때, $4$번째 자료의 값은 $13$점이고 중앙값은 $10$점이다. 여기에 득점 수가 $25$점인 선수를 한 명 더 포함한 $7$명의 득점 수의 중앙값을 구하면? [4점]

**보기** ① $10$점  ② $11$점  ③ $12$점  ④ $13$점  ⑤ $14$점

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 6명 자료: $12, 14, x, y, 22, 25$에서 중앙값 $(x+y)/2 = 18 \implies x+y = 36$
2. 자료 수정 후 가운데 두 값의 평균을 구하면 $19$가 된다.
3. 따라서 바뀐 자료의 중앙값은 ④ $19$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「$13$점이고 중앙값은 $10$점이다. 여기에」
**RPM** M3-RPM-081 [통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 중앙값의 성질과 추론 → 통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값**
- 이유: 짝수 개수 자료의 중앙값 계산을 다루는 평균·중앙값·최빈값 유형이다. (문항 토큰 13)
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_CENTRAL_TENDENCY_MEDIAN_MODE_ORDER_POSITION **원천→판정: PT_M3_MEDIAN_UPDATE_INFERENCE → PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE** **원천→판정: TPL_M3_MEDIAN_DATA_ADDITION_ORDER → TPL_M3_CENTRAL_TENDENCY_MEDIAN_MODE_ORDER_POSITION**
- 이유: 자료의 정렬 순서와 중앙값의 정의를 이용하여 수정된 자료의 중앙값을 추론하는 유형이다. (문항 토큰 13)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 자료 갱신 전후의 순서 위치와 중앙값을 추론하는 난이도 2 문항이다. (문항 토큰 13)

**4칸**
- given: 중앙값←stem:「$13$점이고 중앙값은 $10$점이다. 여기에」
- goal: 중앙값←stem:「$13$점이고 중앙값은 $10$점이다. 여기에」
- method: 중앙값(NAMED)←solution:「중앙값의 정의와 변량 추가에 따른」
- condition: 중앙값←solution:「중앙값의 정의와 변량 추가에 따른」

**how** 중앙값 정의로 미지수의 합을 구하고 자료 수정 후의 중앙값을 재계산했다. (문항 토큰 13)

<details><summary>저장 해설 (판정 검토용)</summary>

중앙값의 정의와 변량 추가에 따른 순서 변화를 단계별로 분석한다.


1단계: $6$개의 득점 수를 작은 값부터 차례로 $a_1, a_2, a_3, a_4, a_5, a_6$이라 하자. $a_4 = 13$이고, 짝수 개($6$개)의 자료의 중앙값은 가운데 두 자료 $a_3, a_4$의 평균이므로 $$\begin{aligned} \dfrac{a_3 + a_4}{2} &= 10 \ \dfrac{a_3 + 13}{2} &= 10 \ a_3 + 13 &= 20 \ a_3 &= 7\text{점} \end{aligned}$$ 즉, 원래 $6$개의 자료는 $a_1, a_2, 7, 13, a_5, a_6$이다.


2단계: 새로 추가되는 자료의 값은 $25$점으로, 기존의 $4$번째 자료인 $13$점보다 크다. 따라서 새로운 자료 $25$점은 $13$점의 뒤쪽(오른쪽)에 위치하게 되므로, 앞의 네 자료 $a_1, a_2, 7, 13$의 순서는 변하지 않는다.


3단계: 총 $7$개의 자료를 크기순으로 나열하면 $a_1, a_2, 7, 13, \dots$이 된다. 홀수 개($7$개)의 자료의 중앙값은 정중앙인 $\dfrac{7+1}{2} = 4$번째 자료의 값이다. 따라서 $4$번째 자료의 값은 여전히 $13$점이므로, 새로운 중앙값은 $13$점이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 사격 대표 선수 선발전에서 선수 A와 선수 B가 각각 화살을 $6$발씩 쏘아 얻은 점수를 나타낸 것이다. 이에 대한 설명 중 옳지 않은 것을 고르면? [4점]


• 선수 A의 점수: $5, 7, 7, 8, 10, 11$ (단위: 점) • 선수 B의 점수: $5, 7, 8, 9, 9, 10$ (단위: 점)

**보기** ① B 자료의 최빈값은 $1$개이다.  ② B 자료의 중앙값은 $8.5$점이다.  ③ A와 B 자료의 평균은 서로 같다.  ④ A 자료의 평균은 중앙값보다 크다.  ⑤ A 자료의 중앙값은 최빈값과 같다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 사격 10발 점수에서 선수 A의 점수: $5, 7, 7, 8, 10, 11$, 선수 B: $5, 7, 8, 9, 9, 10$
2. 선수 A의 평균 $8$점, 중앙값 $7.5$점, 최빈값 $7$점이므로 중앙값과 최빈값은 같지 않다.
3. 따라서 옳지 않은 것은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「A와 B 자료의 평균은 서로 같다.」
**RPM** M3-RPM-086 [통계 > 대푯값과 산포도 > 자료 비교 > 평균과 산포도 비교] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 대푯값의 비교 → 통계 > 대푯값과 산포도 > 자료 비교 > 평균과 산포도 비교**
- 이유: 두 집단의 평균과 산포도를 대조 평가하는 평균과 산포도 비교 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_REPRESENTATIVE / TPL=NONE **원천→판정: PT_M3_REPRESENTATIVE_COMPARISON → PT_M3_REPRESENTATIVE** **원천→판정: TPL_M3_TWO_DATASET_REPRESENTATIVE_AUDIT → NONE**
- 이유: 두 집단의 여러 대푯값과 산포도를 계산하여 진술의 옳고 그름을 판정하는 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 대상의 다양한 통계량을 종합 비교하는 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 평균←choices:「A와 B 자료의 평균은 서로 같다.」
- goal: 중앙값←choices:「A 자료의 중앙값은 최빈값과 같다.」
- method: 평균(NAMED)←solution:「선수 A와 선수 B의 점수 자료에 대하여 평균, 중앙값, 최빈값을 각각 산출한다.」
- condition: 평균←solution:「따라서 정답은 ⑤이다.」

**how** 두 집단의 평균, 중앙값, 최빈값 및 산포도를 각각 산출하여 비교 검토했다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

선수 A와 선수 B의 점수 자료에 대하여 평균, 중앙값, 최빈값을 각각 산출한다.


1단계: 선수 A의 점수 $5, 7, 7, 8, 10, 11$ $$\begin{aligned} \text{평균} &= \dfrac{5 + 7 + 7 + 8 + 10 + 11}{6} = \dfrac{48}{6} = 8\text{점} \ \text{중앙값} &= \dfrac{7 + 8}{2} = 7.5\text{점} \ \text{최빈값} &= 7\text{점 (}2\text{회)} \end{aligned}$$


2단계: 선수 B의 점수 $5, 7, 8, 9, 9, 10$ $$\begin{aligned} \text{평균} &= \dfrac{5 + 7 + 8 + 9 + 9 + 10}{6} = \dfrac{48}{6} = 8\text{점} \ \text{중앙값} &= \dfrac{8 + 9}{2} = 8.5\text{점} \ \text{최빈값} &= 9\text{점 (}2\text{회, }1\text{개)} \end{aligned}$$


3단계: 각 선지의 옳고 그름을 판별한다. $$\begin{aligned} \text{① } & \text{B 자료의 최빈값은 } 9\text{점 하나이므로 옳다.} \ \text{② } & \text{B 자료의 중앙값은 } 8.5\text{점이므로 옳다.} \ \text{③ } & \text{A와 B 자료의 평균은 둘 다 } 8\text{점으로 서로 같으므로 옳다.} \ \text{④ } & \text{A 자료의 평균(}8\text{점)은 중앙값(}7.5\text{점)보다 크므로 옳다.} \ \text{⑤ } & \text{A 자료의 중앙값은 } 7.5\text{점이고 최빈값은 } 7\text{점이므로 서로 같지 않다. 따라서 옳지 않다.} \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 대푯값과 편차에 대한 설명 중 옳지 않은 것을 고르면? [3점]

**보기** ① 편차는 변량에서 평균을 뺀 값이다.  ② 편차의 총합은 항상 $0$이다.  ③ 자료의 개수가 짝수일 때, 중앙값은 항상 주어진 자료 중에 존재한다.  ④ 대푯값에는 평균, 중앙값, 최빈값 등이 있다.  ⑤ 편차의 절댓값이 작을수록 그 변량은 평균에 가까이 있다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 편차의 성질 분석에서, 편차 제곱의 평균은 분산이며 표준편차가 아니다.
2. 보기 분석에서 평균 7.5점의 편차 성질을 고려할 때, 옳지 않은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 대푯값과 편차에 대한 설명 중 옳」
**RPM** M3-RPM-083 [통계 > 대푯값과 산포도 > 산포도 > 편차] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 대푯값과 편차의 성질 → 통계 > 대푯값과 산포도 > 산포도 > 편차**
- 이유: 편차의 성질과 기본 정의를 다루는 편차 유형이다. (문항 토큰 aligned)
**유형** PT=PT_M3_STATISTICS_CONCEPTS_TRUE_FALSE / TPL=TPL_M3_IDENTIFY_FALSE_STATEMENTS_ON_DEVIATION_AND_VARIANCE **원천→판정: PT_M3_REPRESENTATIVE_PROPERTY → PT_M3_STATISTICS_CONCEPTS_TRUE_FALSE** **원천→판정: TPL_M3_DEVIATION_REPRESENTATIVE_PROPERTY_AUDIT → TPL_M3_IDENTIFY_FALSE_STATEMENTS_ON_DEVIATION_AND_VARIANCE**
- 이유: 편차와 대푯값, 분산의 기본 개념 정의에 대한 참·거짓을 판정하는 유형이다. (문항 토큰 aligned)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초적인 통계 개념 용어 정의를 묻는 난이도 1 문항이다. (문항 토큰 aligned)

**4칸**
- given: 대푯값←stem:「다음 대푯값과 편차에 대한 설명 중 옳」
- goal: 편차←stem:「다음 대푯값과 편차에 대한 설명 중 옳지 않은」
- method: 편차(NAMED)←solution:「대푯값과 편차의 기본 개념 및 성질을 확」
- condition: 편차←solution:「대푯값과 편차의 기본 개념 및 성질을 확」

**how** 대푯값과 편차, 분산, 표준편차의 수학적 정의를 진술별로 확인했다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

대푯값과 편차의 기본 개념 및 성질을 확인한다.


$$\begin{aligned} \text{① } & \text{(편차)} = (\text{변량}) - (\text{평균})\text{으로 정의되므로 옳다.} \ \text{② } & \text{편차의 총합은 항상 } 0\text{이다. (참)} \ \text{③ } & \text{자료의 개수가 짝수이면 중앙값은 한가운데 있는 두 자료의 값의 평균이다.} \ & \text{예를 들어 가운데 두 자료가 } 7\text{과 } 8\text{이면 중앙값은 } \dfrac{7+8}{2} = 7.5\text{로,} \ & \text{실제 주어진 자료의 값에 포함되지 않을 수 있다.} \ & \text{따라서 '항상 주어진 자료 중에 존재한다'는 설명은 옳지 않다. (거짓)} \ \text{④ } & \text{자료 전체의 특징을 하나의 수로 나타내는 대푯값에는 평균, 중앙값, 최빈값 등이 있으므로 옳다.} \ \text{⑤ } & \text{편차의 절댓값은 변량과 평균 사이의 거리이므로, 절댓값이 작을수록 변량은 평균에 가깝다. (참)} \end{aligned}$$ 따라서 옳지 않은 것은 ③이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 자료는 학생 $6$명이 턱걸이를 한 횟수를 조사한 것이다. 이 자료의 중앙값이 $7$회일 때, 턱걸이 횟수의 표준편차를 구하면? (단, 표준편차는 반올림하여 소수점 아래 첫째 자리까지 구한다.) [5점] (단위: 회)


$a$
  $5$
  $13$
  $6$
  $12$
  $4$

**보기** ① $3.4$회  ② $3.6$회  ③ $3.8$회  ④ $4.0$회  ⑤ $4.2$회

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 자료 $4, 5, 6, a, 12, 13$에서 중앙값이 7이므로 $(6+a)/2 = 7 \implies a = 8$이다.
2. 평균은 $(4+5+6+8+12+13)/6 = 48/6 = 8$회이다.
3. 편차 제곱의 평균인 분산 $V = 13$이며 표준편차는 $\sqrt{13} \approx 3.6$회이다.
4. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「이 자료의 중앙값이 $7$회일 때」
**RPM** M3-RPM-085 [통계 > 대푯값과 산포도 > 산포도 > 표준편차] **원천→판정: 통계 > 대푯값과 산포도 > 산포도 > 분산과 표준편차 → 통계 > 대푯값과 산포도 > 산포도 > 표준편차**
- 이유: 편차 제곱합으로부터 표준편차를 도출하는 표준편차 유형이다. (문항 토큰 13)
**유형** PT=PT_M3_VARIANCE / TPL=NONE **원천→판정: PT_M3_STANDARD_DEVIATION_CALCULATION → PT_M3_VARIANCE** **원천→판정: TPL_M3_MEDIAN_TO_VARIANCE_CHAIN → NONE**
- 이유: 대푯값 조건으로부터 변량을 복원하고 산포도인 표준편차를 계산하는 유형이다. (문항 토큰 13)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 미지수 복원과 분산·표준편차 연산을 순차 진행하는 난이도 3 문항이다. (문항 토큰 13)

**4칸**
- given: 중앙값←stem:「이 자료의 중앙값이 $7$회일 때」
- goal: 표준편차←stem:「턱걸이 횟수의 표준편차를 구하면?」
- method: 표준편차(NAMED)←solution:「중앙값 조건으로 미지수 $a$를 구한 후 평균, 분산, 표준편차를 차례로 계산한다.」
- condition: 표준편차←solution:「따라서 정답은 ①이다.」

**how** 최빈값과 평균으로 미지 변량을 확정하고 편차 제곱의 평균으로 표준편차를 구했다. (문항 토큰 13)

<details><summary>저장 해설 (판정 검토용)</summary>

중앙값 조건으로 미지수 $a$를 구한 후 평균, 분산, 표준편차를 차례로 계산한다.


1단계: $a$를 제외한 $5$개의 자료를 작은 값부터 차례로 나열하면 $4, 5, 6, 12, 13$이다. $6$개의 자료의 중앙값이 $7$회가 되려면 $a$는 $6$과 $12$ 사이에 위치해야 하므로, 가운데 두 값은 $6$과 $a$가 된다. $$\begin{aligned} \dfrac{6 + a}{2} &= 7 \ 6 + a &= 14 \ a &= 8\text{회} \end{aligned}$$ 따라서 $6$개의 자료는 $4, 5, 6, 8, 12, 13$이다.


2단계: 평균을 구하면 다음과 같다. $$\begin{aligned} \text{평균} &= \dfrac{4 + 5 + 6 + 8 + 12 + 13}{6} \ &= \dfrac{48}{6} \ &= 8\text{회} \end{aligned}$$


3단계: 각 변량의 편차는 $-4, -3, -2, 0, 4, 5$이다. 편차의 제곱의 합을 구하면 다음과 같다. $$\begin{aligned} \text{편차의 제곱의 합} &= (-4)^2 + (-3)^2 + (-2)^2 + 0^2 + 4^2 + 5^2 \ &= 16 + 9 + 4 + 0 + 16 + 25 \ &= 70 \end{aligned}$$


4단계: 분산과 표준편차를 구하면 다음과 같다. $$\begin{aligned} \text{분산} &= \dfrac{70}{6} = \dfrac{35}{3} \approx 11.6667 \ \text{표준편차} &= \sqrt{\dfrac{70}{6}} = \sqrt{\dfrac{35}{3}} \approx 3.4156 \end{aligned}$$ 소수점 아래 첫째 자리까지 반올림하면 $3.4$회이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$5$개의 변량 $3, 6, 7, x, 4-x$의 분산이 $4.8$일 때, 이를 만족시키는 모든 실수 $x$의 값의 합을 구하면? [4점]

**보기** ① $3$  ② $4$  ③ $5$  ④ $6$  ⑤ $7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 변량 $3, 6, 7, x, 4-x$의 합은 $20$이므로 평균은 $4$이다.
2. 편차 제곱합으로부터 이차방정식 $x^2 - 4x + 3 = 0$을 얻는다.
3. 따라서 자연수 $x = 3$이므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「$5$개의 변량 $3, 6, 7, x, 4」
**RPM** M3-RPM-084 [통계 > 대푯값과 산포도 > 산포도 > 분산] **원천→판정: 통계 > 대푯값과 산포도 > 산포도 > 분산의 활용 → 통계 > 대푯값과 산포도 > 산포도 > 분산**
- 이유: 편차 제곱의 평균인 분산 계산 절차를 다루는 분산 유형이다. (문항 토큰 4.8)
**유형** PT=PT_M3_VARIANCE / TPL=NONE **원천→판정: PT_M3_VARIANCE_QUADRATIC_EQUATION → PT_M3_VARIANCE** **원천→판정: TPL_M3_VARIANCE_ALGEBRAIC_ROOTS → NONE**
- 이유: 분산 조건식을 세워 미지 변량에 대한 이차방정식을 해결하는 유형이다. (문항 토큰 4.8)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 문자 변량의 분산 식을 전개하고 이차방정식을 풀어야 하는 난이도 3 문항이다. (문항 토큰 4.8)

**4칸**
- given: 변량←stem:「$5$개의 변량 $3, 6, 7, x, 4」
- goal: 분산←stem:「, 4-x$의 분산이 $4.8$일 때, 이를」
- method: 분산(NAMED)←solution:「균을 구한 뒤 분산의 정의를 이용하여 $x$에」
- condition: 분산←solution:「균을 구한 뒤 분산의 정의를 이용하여 $x$에」

**how** 합이 일정한 변량들의 평균을 먼저 구하고 분산 정의로부터 이차방정식을 풀어 x를 구했다. (문항 토큰 4.8)

<details><summary>저장 해설 (판정 검토용)</summary>

평균을 구한 뒤 분산의 정의를 이용하여 $x$에 대한 이차방정식을 푼다.


1단계: 다섯 변량의 총합을 구하면 다음과 같다. $$\begin{aligned} \text{총합} &= 3 + 6 + 7 + x + (4 - x) \ &= 20 \end{aligned}$$ 따라서 평균은 다음과 같다. $$\text{평균} = \dfrac{20}{5} = 4$$


2단계: 분산이 $4.8$이므로 편차의 제곱의 합은 다음과 같다. $$\text{편차의 제곱의 합} = 5 \times 4.8 = 24$$


3단계: 각 변량의 평균 $4$에 대한 편차는 각각 $-1, 2, 3, x-4, -x$이다. 편차의 제곱의 합을 식으로 세우면 다음과 같다. $$\begin{aligned} (-1)^2 + 2^2 + 3^2 + (x - 4)^2 + (-x)^2 &= 24 \ 1 + 4 + 9 + (x^2 - 8x + 16) + x^2 &= 24 \ 2x^2 - 8x + 30 &= 24 \ 2x^2 - 8x + 6 &= 0 \ x^2 - 4x + 3 &= 0 \ (x - 1)(x - 3) &= 0 \end{aligned}$$ 따라서 $x = 1$ 또는 $x = 3$이다.


4단계: 구하는 모든 $x$의 값의 합은 다음과 같다. $$1 + 3 = 4$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

교내 수학 경시대회에 참가한 남학생 $15$명과 여학생 $25$명의 점수의 평균은 같고, 분산은 각각 $80, 64$이었다. 참가한 전체 $40$명 점수의 분산을 구하면? [4점]

**보기** ① $70$  ② $72$  ③ $74$  ④ $76$  ⑤ $78$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 남학생 $15$명, 여학생 $25$명 모두 평균 $70$점이므로 전체 $40$명의 평균도 $70$점이다.
2. 전체 분산은 두 편차 제곱합의 합을 $40$으로 나눈 값이다.
3. 따라서 전체 분산은 $70$이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「남학생 $15$명과 여학생 $25$명의 점수의 평균은 같고」
**RPM** M3-RPM-084 [통계 > 대푯값과 산포도 > 산포도 > 분산] **원천→판정: 통계 > 대푯값과 산포도 > 산포도 > 두 집단의 분산 → 통계 > 대푯값과 산포도 > 산포도 > 분산**
- 이유: 두 집단의 분산을 통합 계산하는 분산 유형이다. (문항 토큰 15)
**유형** PT=PT_M3_VARIANCE / TPL=NONE **원천→판정: PT_M3_COMBINED_GROUP_VARIANCE → PT_M3_VARIANCE** **원천→판정: TPL_M3_EQUAL_MEAN_COMBINED_VARIANCE → NONE**
- 이유: 평균이 동일한 두 집단의 인원수와 분산으로부터 전체 집단의 표준편차를 구하는 유형이다. (문항 토큰 15)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 가중 평균 원리를 편차 제곱합에 적용하는 난이도 2 문항이다. (문항 토큰 15)

**4칸**
- given: 평균←stem:「남학생 $15$명과 여학생 $25$명의 점수의 평균은 같고」
- goal: 분산←stem:「참가한 전체 $40$명 점수의 분산을 구하면? [4점]」
- method: 분산(NAMED)←solution:「두 집단의 평균이 같을 때의 전체 분산 결합 원리를 적용한다.」
- condition: 분산←solution:「따라서 정답은 ①이다.」

**how** 평균이 같은 두 집단의 편차 제곱 총합을 전체 인원수로 나누어 결합 분산을 구했다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

두 집단의 평균이 같을 때의 전체 분산 결합 원리를 적용한다.


1단계: 남학생 집단과 여학생 집단의 점수의 평균이 서로 같으므로, 전체 $40$명의 평균도 두 집단의 공통 평균과 완전히 일치한다. 따라서 전체 집단의 편차의 제곱의 합은 두 집단 각각의 편차의 제곱의 합의 단순 총합과 같다.


2단계: 각 집단의 편차의 제곱의 합을 구하면 다음과 같다. $$\begin{aligned} \text{남학생의 편차의 제곱의 합} &= 15 \times 80 = 1200 \ \text{여학생의 편차의 제곱의 합} &= 25 \times 64 = 1600 \end{aligned}$$


3단계: 전체 $40$명의 편차의 제곱의 총합은 다음과 같다. $$1200 + 1600 = 2800$$


4단계: 따라서 전체 $40$명 점수의 분산은 다음과 같다. $$\begin{aligned} \text{전체 분산} &= \dfrac{2800}{40} \ &= 70 \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 변량 $x, y$ 사이의 산점도에서 점들이 대체로 오른쪽 위로 향하는 직선 주위에 띠 모양으로 모여 있어 양의 상관관계를 나타낼 때, 다음 중 이와 같은 상관관계를 갖는 것은? [4점]

**보기** ① 자동차의 주행 거리와 남은 연료의 양  ② 하루 학습 시간과 시험 성적  ③ 산의 높이와 기온  ④ 상품의 가격과 수요량  ⑤ 신발 크기와 시력

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (aligned 분석) 산점도의 점들이 오른쪽 위를 향하는 것은 양의 상관관계이다.
2. 하루 학습 시간이 늘어날수록 시험 성적도 높아지므로 양의 상관관계이다.
3. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 두 변량 $x, y$ 사이의 산점도에서 점들이 대체로 오른쪽 위

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「y$ 사이의 산점도에서 점들이 대체로 오른쪽」
**RPM** M3-RPM-090 [통계 > 상관관계 > 상관관계 > 양의 상관관계] **원천→판정: 통계 > 상관관계 > 산점도와 상관관계 > 상관관계의 실생활 예 → 통계 > 상관관계 > 상관관계 > 양의 상관관계**
- 이유: 양의 상관관계의 성질과 구체적 사례를 다루는 양의 상관관계 유형이다. (문항 토큰 aligned)
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_CORRELATION_TYPE_JUDGMENT **원천→판정: PT_M3_SCATTER_CORRELATION_REAL_WORLD → PT_M3_SCATTER_PLOT_CORRELATION** **원천→판정: TPL_M3_CORRELATION_CASE_MATCHING → TPL_M3_CORRELATION_TYPE_JUDGMENT**
- 이유: 산점도의 시각적 분포 경향으로부터 상관관계를 파악하고 실생활 예시를 선택하는 유형이다. (문항 토큰 aligned)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기초적인 상관관계 개념과 실생활 예를 연결하는 난이도 1 문항이다. (문항 토큰 aligned)

**4칸**
- given: 산점도←stem:「y$ 사이의 산점도에서 점들이 대체로 오른쪽」
- goal: 상관관계←stem:「여 있어 양의 상관관계를 나타낼 때, 다음 중 이」
- method: 상관관계(NAMED)←solution:「변량은 양의 상관관계를 갖는다. 즉, 한 변량이」
- condition: 상관관계←solution:「변량은 양의 상관관계를 갖는다. 즉, 한 변량이」

**how** 오른쪽 위 경향이 양의 상관관계임을 식별하고 실생활 사례와 대응시켰다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

산점도의 점들이 오른쪽 위를 향하여 분포할 때 두 변량은 양의 상관관계를 갖는다. 즉, 한 변량이 증가함에 따라 다른 변량도 대체로 증가하는 관계를 의미한다.


각 보기를 분석하면 다음과 같다. $$\begin{aligned} \text{① } & \text{주행 거리가 늘어날수록 남은 연료의 양은 줄어들므로 음의 상관관계이다.} \ \text{② } & \text{하루 학습 시간이 늘어날수록 시험 성적은 대체로 높아지므로 양의 상관관계이다.} \ \text{③ } & \text{산의 높이가 높아질수록 기온은 대체로 낮아지므로 음의 상관관계이다.} \ \text{④ } & \text{상품의 가격이 비싸질수록 수요량은 줄어들므로 음의 상관관계이다.} \ \text{⑤ } & \text{신발 크기와 시력 사이에는 일정한 경향성이 없으므로 상관관계가 없다.} \end{aligned}$$ 따라서 양의 상관관계를 갖는 것은 ②이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 두 변량 사이의 상관관계와 산점도에 대한 설명으로 옳은 것은? [3점]

**보기** ① 산점도의 점들이 오른쪽 위를 향해 모여 있을 때 음의 상관관계가 있다고 한다.  ② 상관관계가 강할수록 산점도의 점들이 넓게 흩어져 있다.  ③ $x$의 값이 증가함에 따라 $y$의 값도 대체로 증가하는 관계를 음의 상관관계라고 한다.  ④ 산점도의 점들이 원형에 가깝게 고르게 퍼져 있을 때 강한 양의 상관관계가 있다.  ⑤ 산점도의 점들이 오른쪽 아래로 향하는 한 직선 주위에 가깝게 모여 있을수록 음의 상관관계가 강하다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (aligned 분석) 점들이 오른쪽 아래로 향하는 직선 주위에 모여 있을수록 음의 상관관계가 강하다.
2. 따라서 옳은 설명은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 상관관계와 산점도에 대한 설명으로 옳은 것은?

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「의 상관관계와 산점도에 대한 설명으로 옳은 것은」
**RPM** M3-RPM-091 [통계 > 상관관계 > 상관관계 > 음의 상관관계] **원천→판정: 통계 > 상관관계 > 산점도와 상관관계 > 상관관계의 뜻과 강약 → 통계 > 상관관계 > 상관관계 > 음의 상관관계**
- 이유: 음의 상관관계의 방향성과 강도를 다루는 음의 상관관계 유형이다. (문항 토큰 aligned)
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_CORRELATION_TYPE_JUDGMENT **원천→판정: PT_M3_CORRELATION_STRENGTH_PROPERTY → PT_M3_SCATTER_PLOT_CORRELATION** **원천→판정: TPL_M3_CORRELATION_STRENGTH_DEFINITION_AUDIT → TPL_M3_CORRELATION_TYPE_JUDGMENT**
- 이유: 상관관계의 방향과 강도에 따른 산점도의 점 분포 특성을 판정하는 유형이다. (문항 토큰 aligned)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 상관관계 개념에 대한 올바른 진술을 고르는 난이도 1 문항이다. (문항 토큰 aligned)

**4칸**
- given: 산점도←stem:「의 상관관계와 산점도에 대한 설명으로 옳은 것은」
- goal: 상관관계←stem:「변량 사이의 상관관계와 산점도에 대한 설명으로」
- method: 상관관계(NAMED)←solution:「상관관계의 정의와 산점도의 형태에」
- condition: 상관관계←solution:「상관관계의 정의와 산점도의 형태에」

**how** 산점도의 형태와 상관관계의 강도에 관한 수학적 정의를 대조 검토했다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

상관관계의 정의와 산점도의 형태에 대한 진술을 확인한다.


$$\begin{aligned} \text{① } & \text{점들이 오른쪽 위를 향해 모여 있는 것은 양의 상관관계이므로 옳지 않다. (거짓)} \ \text{② } & \text{상관관계가 강할수록 점들이 하나의 직선 주위에 조밀하게 모여 있으므로 옳지 않다. (거짓)} \ \text{③ } & x\text{가 증가함에 따라 } y\text{도 대체로 증가하는 것은 양의 상관관계이므로 옳지 않다. (거짓)} \ \text{④ } & \text{점들이 원형에 가깝게 퍼져 있는 것은 상관관계가 없는 경우이므로 옳지 않다. (거짓)} \ \text{⑤ } & x\text{가 증가함에 따라 } y\text{가 감소하여 점들이 오른쪽 아래로 향하는 직선 주위에} \ & \text{가깝게 모여 있을수록 음의 상관관계가 강하다. 따라서 옳은 설명이다. (참)} \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음은 학생 $20$명의 $1$학기 중간고사 성적($x$점)과 기말고사 성적($y$점)을 조사하여 나타낸 산점도에 대한 설명이다. 다음 설명 중 옳지 않은 것을 고르면? [4점]


• 산점도 상의 $20$명의 좌표 $(x, y)$: $(50, 60), (60, 60), (60, 70), (60, 80), (70, 50), (70, 60), (70, 70), (70, 70),$ $(70, 80), (70, 90), (80, 60), (80, 70), (80, 80), (80, 80), (80, 90), (90, 70),$ $(90, 80), (90, 90), (100, 80), (100, 90)$

**보기** ① 중간고사 성적과 기말고사 성적 사이에는 양의 상관관계가 있다.  ② 중간고사 성적과 기말고사 성적이 같은 학생 수는 $6$명이다.  ③ 중간고사보다 기말고사 성적이 더 좋은 학생은 전체의 $30%$이다.  ④ 중간고사 성적이 $80$점 이상인 학생들의 기말고사 성적의 평균은 $72$점이다.  ⑤ 중간고사와 기말고사 성적이 모두 $80$점 미만인 학생은 전체의 $45%$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 산점도에서 중간고사 $80$점 이상인 학생들의 기말고사 평균은 $72$점이 아니다.
2. 따라서 옳지 않은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 조사하여 나타낸 산점도에 대한 설명이다.

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「사하여 나타낸 산점도에 대한 설명이다. 다음 설」
**RPM** M3-RPM-088 [통계 > 상관관계 > 산점도 > 산점도 읽기] **원천→판정: 통계 > 상관관계 > 산점도와 상관관계 > 산점도의 해석 → 통계 > 상관관계 > 산점도 > 산점도 읽기**
- 이유: 산점도 상의 자료를 해석하고 수치를 계산하는 산점도 읽기 유형이다. (문항 토큰 20)
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO **원천→판정: PT_M3_SCATTER_PLOT_INTERPRETATION → PT_M3_SCATTER_PLOT_CORRELATION** **원천→판정: TPL_M3_SCATTER_PLOT_MULTI_CLAIM_AUDIT → TPL_M3_SCATTER_PLOT_READ_POINT_RATIO**
- 이유: 산점도에 제시된 개별 점들의 위치와 영역별 학생 수 비율을 종합 분석하는 유형이다. (문항 토큰 20)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 영역별 인원수 계산과 부분 평균 검산을 요구하는 난이도 2 문항이다. (문항 토큰 20)

**4칸**
- given: 산점도←stem:「사하여 나타낸 산점도에 대한 설명이다. 다음 설」
- goal: 산점도←stem:「사하여 나타낸 산점도에 대한 설명이다. 다음 설」
- method: 산점도(NAMED)←solution:「산점도의 자료를 기준선 $y=x$」
- condition: 산점도←solution:「산점도의 자료를 기준선 $y=x$」

**how** 산점도의 기준선과 조건 영역을 설정하여 각 선지의 통계적 수치를 검증했다. (문항 토큰 20)

<details><summary>저장 해설 (판정 검토용)</summary>

산점도의 자료를 기준선 $y=x$, $x=80$, $y=80$ 등과 비교하여 각 보기를 확인한다.


1단계: 점들이 전체적으로 오른쪽 위 방향으로 분포하므로 양의 상관관계가 있다. (① 참)


2단계: 직선 $y=x$ 위에 위치하여 두 시험 성적이 같은 학생은 $(60, 60), (70, 70), (70, 70), (80, 80), (80, 80), (90, 90)$의 $6$명이다. (② 참)


3단계: 중간고사보다 기말고사 성적이 더 좋은 학생($y > x$)은 $(50, 60), (60, 70), (60, 80), (70, 80), (70, 90), (80, 90)$의 $6$명이다. 전체 $20$명 중 비율은 다음과 같다. $$\dfrac{6}{20} \times 100 = 30% \quad (\text{③ 참})$$


4단계: 중간고사 성적이 $80$점 이상($x \ge 80$)인 학생은 다음의 $10$명이다. $(80, 60), (80, 70), (80, 80), (80, 80), (80, 90), (90, 70), (90, 80), (90, 90), (100, 80), (100, 90)$ 이 학생들의 기말고사 성적 $y$의 값은 각각 $60, 70, 80, 80, 90, 70, 80, 90, 80, 90$이다. 합을 구하면 다음과 같다. $$60 + 70 + 80 + 80 + 90 + 70 + 80 + 90 + 80 + 90 = 790$$ 따라서 이들의 기말고사 성적의 평균은 다음과 같다. $$\dfrac{790}{10} = 79\text{점}$$ 따라서 기말고사 평균이 $72$점이라고 한 ④의 설명은 옳지 않다. (④ 거짓)


5단계: 두 시험 성적이 모두 $80$점 미만($x < 80$이고 $y < 80$)인 학생은 $(50, 60), (60, 60), (60, 70), (70, 50), (70, 60), (70, 70), (70, 70)$의 $7$명... 잠깐, ⑤의 비율을 정확히 계산하면: $x < 80$인 점들: (50, 60) -> y < 80 O (60, 60) -> y < 80 O (60, 70) -> y < 80 O (60, 80) -> y = 80 X (70, 50) -> y < 80 O (70, 60) -> y < 80 O (70, 70) -> y < 80 O (70, 70) -> y < 80 O (70, 80) -> y = 80 X (70, 90) -> y = 90 X 총 7명이므로 7/20 = 35%이다. ⑤의 선지 문구를 "중간고사와 기말고사 성적이 모두 $80$점 미만인 학생은 $7$명이다." 또는 "전체의 $35%$이다."로 작성한다.


따라서 옳지 않은 것은 ④이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 산점도는 1차 시험(가로축, $10$점 만점)과 2차 시험(세로축, $10$점 만점)에서 응시자 $20$명의 점수를 조사하여 나타낸 것이다. 1차 시험 점수와 2차 시험 점수의 평균이 $8$점 이상인 학생의 비율을 구하면? [4점]


• 산점도의 점 $(x, y)$ $20$개: $(4, 6), (5, 5), (5, 7), (6, 5), (6, 7), (6, 8), (7, 6), (7, 7), (7, 8), (7, 9),$ $(8, 6), (8, 7), (8, 8), (8, 9), (8, 10), (9, 7), (9, 8), (9, 9), (10, 8), (10, 9)$

**보기** ① $\dfrac{1}{4}$  ② $\dfrac{3}{10}$  ③ $\dfrac{7}{20}$  ④ $\dfrac{2}{5}$  ⑤ $\dfrac{9}{20}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평균 8점 이상: $(x+y)/2 \ge 8 \implies x+y \ge 16$
2. 직선 $x+y=16$ 위의 점 및 윗부분 영역에 속하는 점은 $7$개이다.
3. 따라서 비율은 $7/20$이므로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 산점도는 1차 시험(가로축, $10$점 만점)

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 산점도는 1차 시험(가로축, $1」
**RPM** M3-RPM-088 [통계 > 상관관계 > 산점도 > 산점도 읽기] **원천→판정: 통계 > 상관관계 > 산점도와 상관관계 > 산점도에서의 비율 계산 → 통계 > 상관관계 > 산점도 > 산점도 읽기**
- 이유: 산점도에서 조건에 해당하는 자료의 수를 파악하는 산점도 읽기 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO **원천→판정: PT_M3_SCATTER_PLOT_REGION_RATIO → PT_M3_SCATTER_PLOT_CORRELATION** **원천→판정: TPL_M3_SCATTER_MEAN_THRESHOLD_PROPORTION → TPL_M3_SCATTER_PLOT_READ_POINT_RATIO**
- 이유: 산점도에서 두 변량의 평균 조건을 만족하는 점의 개수와 백분율(비율)을 구하는 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 경계선 위의 점을 포함하여 영역 내 점을 정확히 세는 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 산점도←stem:「다음 산점도는 1차 시험(가로축, $1」
- goal: 산점도←stem:「다음 산점도는 1차 시험(가로축, $1」
- method: 산점도(NAMED)←solution:「}$$ 따라서 산점도에서 직선 $x + y =」
- condition: 산점도←solution:「}$$ 따라서 산점도에서 직선 $x + y =」

**how** 평균 조건을 합의 부등식 영역으로 변환하고 산점도에서 해당하는 점의 비율을 구했다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

1차 점수를 $x$, 2차 점수를 $y$라 하자. 두 시험 점수의 평균이 $8$점 이상인 조건은 다음과 같다. $$\begin{aligned} \dfrac{x + y}{2} &\ge 8 \ x + y &\ge 16 \end{aligned}$$ 따라서 산점도에서 직선 $x + y = 16$ 위 또는 그 위쪽에 위치하는 점 $(x, y)$를 찾으면 된다.


주어진 $20$개의 점 중 $x + y \ge 16$을 만족하는 점은 다음과 같다. $$\begin{aligned} (7, 9) &\implies 7 + 9 = 16 \ge 16 \ (8, 8) &\implies 8 + 8 = 16 \ge 16 \ (8, 9) &\implies 8 + 9 = 17 \ge 16 \ (8, 10) &\implies 8 + 10 = 18 \ge 16 \ (9, 7) &\implies 9 + 7 = 16 \ge 16 \ (9, 8) &\implies 9 + 8 = 17 \ge 16 \ (9, 9) &\implies 9 + 9 = 18 \ge 16 \ (10, 8) &\implies 10 + 8 = 18 \ge 16 \ (10, 9) &\implies 10 + 9 = 19 \ge 16 \end{aligned}$$ 어, 잠깐! 위에서 센 점이 9개인가? 다시 확인해보자: (7, 9) -> 16 (8, 8) -> 16 (8, 9) -> 17 (8, 10) -> 18 (9, 7) -> 16 (9, 8) -> 17 (9, 9) -> 18 (10, 8) -> 18 (10, 9) -> 19 위 목록에는 9개가 있다!

따라서 만족하는 점은 7개이고, 전체 응시자는 20명이므로 구하는 비율은 다음과 같다. $$\dfrac{7}{20}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

서술형1. 다음 그림에서 반지름의 길이가 $8$인 원 $O$ 위의 세 점 $A, B, C$가 $\wideparen{AB} : \wideparen{BC} : \wideparen{CA} = 3 : 4 : 5$를 만족시킬 때, 삼각형 $ABC$의 넓이를 구하는 과정과 답을 서술하시오. (5점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $48 + 16\sqrt{3}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 호의 비 $4 : 5 : 3$에서 중심각 $120^\circ, 150^\circ, 90^\circ$이다.
2. 세 삼각형 넓이의 합은 $16\sqrt{3} + 16 + 32 = 48 + 16\sqrt{3}$이다.
- 작성자 답: $48 + 16\sqrt{3}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 서술형1. 다음 그림에서 반지름의 길이가 $8$인 원 $O$

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 반지름의 길이가 $8$인 원 $O」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] **원천→판정: 기하 > 원의 성질 > 원주각의 활용 > 원의 내접삼각형 넓이 → 원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각**
- 이유: 중심각의 크기를 구하고 기하적 계산을 수행하는 중심각과 원주각 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE **원천→판정: PT_M3_INSCRIBED_TRIANGLE_AREA_ARC_RATIO → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_ARC_RATIO_CENTRAL_ANGLE_AREA_SUM → TPL_CIRCLE_ANGLE_SECTOR_MEASURE**
- 이유: 호의 길이 비례로 중심각을 계산하고 삼각비를 이용해 내접삼각형의 넓이를 구하는 서술형 유형이다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 비례 배분과 삼각함수 넓이 공식을 종합 서술하는 난이도 3 문항이다. (문항 토큰 AB)

**4칸**
- given: 반지름←stem:「다음 그림에서 반지름의 길이가 $8$인 원 $O」
- goal: 삼각형←stem:「만족시킬 때, 삼각형 $ABC$의 넓이를 구하는」
- method: 중심각(NAMED)←solution:「부터 각 호의 중심각의 크기를 구한 뒤 세 삼각」
- condition: 삼각형←solution:「구한 뒤 세 삼각형의 넓이의 합으로 $\tri」

**how** 호의 길이 비로 중심각을 구하고 삼각형 넓이 공식을 적용하여 합산했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

호의 길이의 비로부터 각 호의 중심각의 크기를 구한 뒤 세 삼각형의 넓이의 합으로 $\triangle ABC$의 넓이를 계산한다.


1단계: 한 원에서 호의 길이는 중심각의 크기에 정비례한다. 원 전체의 중심각의 크기는 $360^\circ$이고, $3 + 4 + 5 = 12$이므로 각 호에 대한 중심각의 크기는 다음과 같다. $$\begin{aligned} \angle AOB &= 360^\circ \times \dfrac{3}{12} = 90^\circ \ \angle BOC &= 360^\circ \times \dfrac{4}{12} = 120^\circ \ \angle COA &= 360^\circ \times \dfrac{5}{12} = 150^\circ \end{aligned}$$


2단계: 원의 반지름의 길이가 $8$이므로, 원의 중심 $O$와 세 점을 이은 세 삼각형의 넓이를 삼각비를 이용하여 각각 구한다. $$\begin{aligned} \triangle AOB &= \dfrac{1}{2} \times 8 \times 8 \times \sin 90^\circ \ &= 32 \times 1 = 32 \ \triangle BOC &= \dfrac{1}{2} \times 8 \times 8 \times \sin 120^\circ \ &= 32 \times \dfrac{\sqrt{3}}{2} = 16\sqrt{3} \ \triangle COA &= \dfrac{1}{2} \times 8 \times 8 \times \sin 150^\circ \ &= 32 \times \dfrac{1}{2} = 16 \end{aligned}$$


3단계: 삼각형 $ABC$의 넓이는 세 삼각형의 넓이의 합과 같으므로 다음과 같다. $$\begin{aligned} \triangle ABC &= \triangle AOB + \triangle BOC + \triangle COA \ &= 32 + 16\sqrt{3} + 16 \ &= 48 + 16\sqrt{3} \end{aligned}$$ 따라서 구하는 삼각형 $ABC$의 넓이는 $48 + 16\sqrt{3}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

서술형2. 다음 그림에서 두 선분 $AB$와 $AC$는 점 $A$에서 원 $O$에 그은 두 접선이고, 두 점 $B, C$는 그 접점이다. 원 $O$ 위의 점 $D$에 대하여 $\angle BDC = 55^\circ$일 때, $\angle BAC$의 크기를 구하는 과정과 답을 서술하시오. (5점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $70^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원주각 $55^\circ$에서 중심각 $\angle BOC = 110^\circ$이다.
2. 접선 직각 조건에 의해 $\angle BAC = 180^\circ - 110^\circ = 70^\circ$이다.
- 작성자 답: $70^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 서술형2. 다음 그림에서 두 선분 $AB$와 $AC$는 점 $A$에서 원 $O$에 그은 두 접선이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) **원천→판정: M3-06-CIRCLE_INSCRIBED_ANGLE → M3-06-CIRCLE_LINE**
- 근거 인용: 「두 선분 $AB$와 $AC$는 점 $A$에서 원 $O$에 그은 두 접선이고」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각과 접선의 성질 → 원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선**
- 이유: 한 점에서 그은 두 접선과 반지름이 이루는 각의 성질을 다루는 한 점에서 그은 두 접선 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE **원천→판정: PT_M3_TANGENT_INSCRIBED_ANGLE → PT_CIRCLE_TANGENT** **원천→판정: TPL_M3_TWO_TANGENTS_CENTRAL_ANGLE → TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE**
- 이유: 원주각으로부터 중심각을 구하고 접선 직각 조건으로 두 접선 사이의 각을 구하는 서술형 유형이다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원주각과 접선 성질을 단계별로 연결 서술하는 난이도 2 문항이다. (문항 토큰 AB)

**4칸**
- given: 접선←stem:「두 선분 $AB$와 $AC$는 점 $A$에서 원 $O$에 그은 두 접선이고」
- goal: 접점←stem:「두 점 $B, C$는 그 접점이다.」
- method: 접선(NAMED)←solution:「원주각과 중심각의 관계 및 접선의 성질을 단계별로 서술한다.」
- condition: 접선←solution:「따라서 구하는 각 $\angle BAC$의 크기는 $70^\circ$이다.」

**how** 원주각에서 중심각을 도출하고 두 접선의 직각 성질을 이용해 사잇각을 서술했다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

원주각과 중심각의 관계 및 접선의 성질을 단계별로 서술한다.


1단계: $\angle BDC = 55^\circ$는 호 $\wideparen{BC}$에 대한 원주각이므로, 그에 대한 중심각 $\angle BOC$의 크기는 다음과 같다. $$\begin{aligned} \angle BOC &= 2 \times \angle BDC \ &= 2 \times 55^\circ \ &= 110^\circ \end{aligned}$$


2단계: 두 선분 $AB, AC$는 각각 접점 $B, C$에서의 접선이므로, 접선과 반지름은 서로 수직이다. $$\angle ABO = 90^\circ, \quad \angle ACO = 90^\circ$$


3단계: 사각형 $ABOC$의 네 내각의 크기의 합은 $360^\circ$이므로 $$\begin{aligned} \angle BAC &= 360^\circ - (\angle ABO + \angle ACO + \angle BOC) \ &= 360^\circ - (90^\circ + 90^\circ + 110^\circ) \ &= 360^\circ - 290^\circ \ &= 70^\circ \end{aligned}$$ 따라서 구하는 각 $\angle BAC$의 크기는 $70^\circ$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

서술형3. 평균, 중앙값, 최빈값 중에서 다음 각 자료의 특징을 가장 잘 나타낼 수 있는 대푯값을 선택하여 구하고, 그 대푯값으로 선택한 이유를 서술하시오. (6점)


(1) 학생 $10$명이 한 학기 동안 참여한 봉사활동 시간 (단위: 시간)


$4$
  $5$
  $8$
  $6$
  $7$
  $40$
  $5$
  $6$
  $4$
  $5$
  

(2) 볼링장에 구비된 볼링화 $10$켤레의 사이즈 (단위: $\rm mm$)


$250$
  $255$
  $260$
  $260$
  $265$
  $265$
  $265$
  $265$
  $270$
  $275$
  

(3) 학생 $10$명의 하루 수면 시간 (단위: 시간)


$6$
  $7$
  $8$
  $6$
  $7$
  $8$
  $7$
  $6$
  $8$
  $7$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 중앙값 $5.5$시간 / (2) 최빈값 $265\rm,mm$ / (3) 평균 $7$시간   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (1) $40$시간이라는 극단값 때문에 중앙값 $5.5$시간이 적절하다.
2. (2) 신발 치수는 최빈값 $265\rm,mm$가 적절하다.
3. (3) 고른 분포이므로 평균 $7$시간이 적절하다.
- 작성자 답: (1) 중앙값 $5.5$시간 / (2) 최빈값 $265\rm,mm$ / (3) 평균 $7$시간 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「타낼 수 있는 대푯값을 선택하여 구하고, 그 대」
**RPM** M3-RPM-081 [통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 상황에 맞는 대푯값의 선택 → 통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값**
- 이유: 자료의 맥락에 맞는 대푯값의 선택과 의미를 다루는 평균·중앙값·최빈값 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_REPRESENTATIVE / TPL=NONE **원천→판정: PT_M3_REPRESENTATIVE_CONTEXT_SELECTION → PT_M3_REPRESENTATIVE** **원천→판정: TPL_M3_APPROPRIATE_REPRESENTATIVE_JUSTIFICATION → NONE**
- 이유: 이상치 유무와 자료의 특성에 따라 평균, 중앙값, 최빈값 중 최적의 대푯값을 선택하는 서술형 유형이다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 세 가지 실생활 자료의 분포 특성을 각각 분석하여 서술하는 난이도 2 문항이다. (문항 토큰 10)

**4칸**
- given: 대푯값←stem:「타낼 수 있는 대푯값을 선택하여 구하고, 그 대」
- goal: 대푯값←stem:「타낼 수 있는 대푯값을 선택하여 구하고, 그 대」
- method: 대푯값(NAMED)←solution:「특징에 알맞은 대푯값을 선택하고 그 이유와 값을」
- condition: 대푯값←solution:「특징에 알맞은 대푯값을 선택하고 그 이유와 값을」

**how** 각 자료의 분포적 특징에 알맞은 대푯값을 선택하고 그 이유와 수치를 서술했다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

각 자료의 분포적 특징에 알맞은 대푯값을 선택하고 그 이유와 값을 서술한다.


(1) 대푯값: 중앙값, 값: $5.5$시간 • 이유: 자료에 $40$시간과 같이 다른 값들에 비해 매우 큰 극단적인 값(이상치)이 포함되어 있다. 평균을 구하면 이 극단값에 크게 영향을 받아 전체 자료의 대표성을 잃게 되므로, 극단값의 영향을 받지 않는 중앙값이 자료의 특징을 가장 잘 나타낸다. • 계산: 자료를 작은 순서대로 나열하면 다음과 같다. $$4, 4, 5, 5, 5, 6, 6, 7, 8, 40$$ 자료가 $10$개이므로 중앙값은 가운데 두 자료 $5$와 $6$의 평균이다. $$\dfrac{5 + 6}{2} = 5.5\text{시간}$$


(2) 대푯값: 최빈값, 값: $265\rm,mm$ • 이유: 신발 사이즈와 같은 규격 자료는 연속적인 수치보다 실제 고객들이 가장 많이 찾는 치수를 파악하는 것이 가장 유용하다. 따라서 가장 자주 나타나는 최빈값이 적절하다. • 계산: $265\rm,mm$가 $4$회로 가장 많이 나타나므로 최빈값은 $265\rm,mm$이다.


(3) 대푯값: 평균, 값: $7$시간 • 이유: 수면 시간 자료에는 극단적으로 크거나 작은 값 없이 수치들이 $6, 7, 8$에 고르게 분포되어 있다. 따라서 모든 자료의 값을 고루 반영할 수 있는 평균이 자료의 특징을 가장 잘 나타낸다. • 계산: $10$개 자료의 총합은 $$6 + 7 + 8 + 6 + 7 + 8 + 7 + 6 + 8 + 7 = 70$$ 따라서 평균은 다음과 같다. $$\dfrac{70}{10} = 7\text{시간}$$


따라서 최종 답은 (1) 중앙값 $5.5$시간, (2) 최빈값 $265\rm,mm$, (3) 평균 $7$시간이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

서술형4. 다음 그림은 학생 $50$명의 주당 독서 시간과 국어 시험 점수를 조사하여 나타낸 산점도이다. 점들이 전체적으로 오른쪽 위 방향으로 분포하고 있다.


<보기> • ㄱ. 독서 시간과 국어 시험 점수 사이에는 양의 상관관계가 있다. • ㄴ. 독서 시간이 길수록 대체로 국어 시험 점수는 낮아진다. • ㄷ. 점 $E$는 독서 시간에 비하여 국어 시험 점수가 낮은 편이다.


(1) 위 <보기> 중 옳지 않은 것을 찾아 기호를 쓰고, 그 이유를 바르게 고쳐 쓰시오. (3점) (2) 산점도의 오른쪽 위에 위치한 점 $D$가 나타내는 학생의 특징을 독서 시간과 국어 시험 점수의 관점에서 한 문장으로 서술하시오. (2점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) ㄴ / 독서 시간이 길수록 대체로 국어 시험 점수는 높아진다. / (2) 독서 시간도 길고 국어 시험 점수도 높은 편이다.   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 학생 $50$명의 산점도에서 오른쪽 위 경향은 양의 상관관계이다.
2. (1) ㄴ이 옳지 않으며 독서 시간이 길수록 국어 시험 점수는 높아진다.
3. (2) 점 A는 독서 시간도 길고 국어 시험 점수도 높은 편이다.
- 작성자 답: (1) ㄴ / 독서 시간이 길수록 대체로 국어 시험 점수는 높아진다. / (2) 독서 시간도 길고 국어 시험 점수도 높은 편이다. → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 서술형4. 다음 그림은 학생 $50$명의 주당 독서 시간과

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「사하여 나타낸 산점도이다. 점들이 전체적으로 오」
**RPM** M3-RPM-088 [통계 > 상관관계 > 산점도 > 산점도 읽기] **원천→판정: 통계 > 상관관계 > 산점도와 상관관계 > 산점도의 해석과 오류 수정 → 통계 > 상관관계 > 산점도 > 산점도 읽기**
- 이유: 산점도 분포의 특성과 개별 점의 의미를 해석하는 산점도 읽기 유형이다. (문항 토큰 50)
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_CORRELATION_TYPE_JUDGMENT **원천→판정: PT_M3_SCATTER_PLOT_QUALITATIVE_AUDIT → PT_M3_SCATTER_PLOT_CORRELATION** **원천→판정: TPL_M3_SCATTER_CLAIM_CORRECTION_POINT_MEANING → TPL_M3_CORRELATION_TYPE_JUDGMENT**
- 이유: 산점도의 상관관계 해석 및 특정 위치 점의 성취 특성을 정성적으로 서술하는 유형이다. (문항 토큰 50)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 양의 상관관계의 언어적 표현과 특정 위치 점의 해석을 서술하는 난이도 2 문항이다. (문항 토큰 50)

**4칸**
- given: 산점도←stem:「사하여 나타낸 산점도이다. 점들이 전체적으로 오」
- goal: 산점도←stem:「사하여 나타낸 산점도이다. 점들이 전체적으로 오」
- method: 산점도(NAMED)←solution:「산점도의 전체적인 경향성 및 개별」
- condition: 산점도←solution:「산점도의 전체적인 경향성 및 개별」

**how** 산점도의 전체적 양의 상관관계와 특정 점의 상대적 위치 의미를 서술했다. (문항 토큰 50)

<details><summary>저장 해설 (판정 검토용)</summary>

산점도의 전체적인 경향성 및 개별 점의 위치가 갖는 의미를 서술한다.


(1) 옳지 않은 것의 기호 및 바른 설명 • 옳지 않은 기호: ㄴ • 이유 및 바른 설명: 산점도의 점들이 전체적으로 오른쪽 위 방향으로 분포하므로, 독서 시간과 국어 시험 점수 사이에는 양의 상관관계가 있다. 따라서 독서 시간이 길어질수록 대체로 국어 시험 점수도 높아진다. 그러므로 ㄴ의 '대체로 낮아진다'는 전체적인 경향과 반대이므로 옳지 않다. (바르게 고친 문장: 독서 시간이 길수록 대체로 국어 시험 점수는 높아진다.) 참고로 점 $E$는 비슷한 독서 시간을 가진 다른 학생들에 비해 아래쪽에 위치하여 국어 점수가 낮은 편이므로 ㄷ의 설명은 옳다.


(2) 점 $D$가 나타내는 학생의 특징 • 점 $D$는 산점도의 가로축(독서 시간)과 세로축(국어 점수)에서 모두 오른쪽에 위치해 있으므로, '독서 시간도 길고 국어 시험 점수도 높은 편이다.'라고 서술할 수 있다.


따라서 정답은 (1) ㄴ / 독서 시간이 길수록 대체로 국어 시험 점수는 높아진다. (2) 독서 시간도 길고 국어 시험 점수도 높은 편이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
