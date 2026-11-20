# 검수 묶음 — 24_연향중_2학기_기말_중3_유사

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 23개 / 검사 PASS 23, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: SELF_CONTAINED 18, NONE 5
- 난이도 분포: 1단계 2, 2단계 17, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q6**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q7**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q8**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q15**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 원천 값과 다른 칸 3개 (RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q18**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q19**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q22**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림과 같이 반지름의 길이가 $7\rm,cm$인 원 $O$에서 길이가 $6\rm,cm$인 현 $\overline{AB}$가 있을 때, 원의 중심 $O$와 현 $\overline{AB}$ 사이의 거리는? [3점]

**보기** ① $2\sqrt{7}\rm,cm$  ② $2\sqrt{10}\rm,cm$  ③ $3\sqrt{5}\rm,cm$  ④ $4\sqrt{3}\rm,cm$  ⑤ $7\rm,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 원의 중심 $O$에서 현 $\overline{AB}$에 내린 수선의 발을 $M$이라 하면 $\overline{AM} = 3\rm\,cm$이다.
2. 직각삼각형 $OAM$에서 피타고라스 정리에 의해 $\overline{OM} = \sqrt{7^2 - 3^2} = \sqrt{40} = 2\sqrt{10}\rm\,cm$이다.
3. 따라서 중심 $O$와 현 $\overline{AB}$ 사이의 거리는 $2\sqrt{10}\rm\,cm$로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 반지름의 길이가 $7\rm,cm$인 원 $O$에서

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 반지름의 길이가 $7\rm,cm$인 원 $O$에서 길이가 $6\rm,cm$인 현 $\overline{AB}$가 있을 때, 원의 중심 $O$와 현 $\overline{AB}$ 사이의 거리는?」
**RPM** M3-RPM-067 [원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선] **원천→판정: 기하 > 원의 성질 > 원과 직선 > 원의 중심과 현의 수직이등분선 → 원의 성질 > 원과 직선 > 원의 중심과 현 > 중심에서 현에 내린 수선**
- 이유: 원의 중심과 현에서 중심거리와 현의 길이를 다루는 RPM 유형이다. (문항 토큰 cm)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD **원천→판정: PT_M3_CHORD_DISTANCE_PYTHAGORAS → PT_CIRCLE_LINE_RELATION** **원천→판정: TPL_M3_CHORD_HALF_RIGHT_TRIANGLE → TPL_CIRCLE_LINE_RELATION_EQUAL_CHORD**
- 이유: 원의 중심과 현의 수직이등분선 성질을 이용한 거리 계산 유형이다. (문항 토큰 cm)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기본적인 피타고라스 정리 적용으로 해결되는 난이도 2 문항이다. (문항 토큰 cm)

**4칸**
- given: 반지름←stem:「다음 그림과 같이 반지름의 길이가 $7\rm,cm$인 원 $O$에서 길이가 $6\rm,cm$인 현 $\overline{AB}$가 있을 때, 원의 중심 $O$와 현 $\overline{AB}$ 사이의 거리는?」
- goal: 중심←solution:「원의 중심에서 현에 내린 수선은 그 현을 수직이등분한다.」
- method: 중심(NAMED)←solution:「1단계: 원의 중심 $O$에서 현 $\overline{AB}$에 내린 수선의 발을 $M$이라 하면 $M$은 $\overline{AB}$의 중점이므로 $$\begin{aligned} \overline{AM} &= \dfrac{1}{2} \overline{AB} \ &= \dfrac{1}{2} \times 6 \ &= 3\rm,cm \end{aligned}$$」
- condition: (없음)

**how** 원의 중심에서 현에 내린 수선이 현을 수직이등분함을 이용하여 직각삼각형에서 거리를 계산하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

원의 중심에서 현에 내린 수선은 그 현을 수직이등분한다.


1단계: 원의 중심 $O$에서 현 $\overline{AB}$에 내린 수선의 발을 $M$이라 하면 $M$은 $\overline{AB}$의 중점이므로 $$\begin{aligned} \overline{AM} &= \dfrac{1}{2} \overline{AB} \ &= \dfrac{1}{2} \times 6 \ &= 3\rm,cm \end{aligned}$$


2단계: 직각삼각형 $OAM$에서 $\overline{OA}$는 원의 반지름이므로 $\overline{OA} = 7\rm,cm$이다. 피타고라스 정리에 의하여 $$\begin{aligned} \overline{OM}^2 &= \overline{OA}^2 - \overline{AM}^2 \ &= 7^2 - 3^2 \ &= 49 - 9 \ &= 40 \end{aligned}$$ 따라서 $\overline{OM} = \sqrt{40} = 2\sqrt{10}\rm,cm$이다.


따라서 원의 중심 $O$와 현 $\overline{AB}$ 사이의 거리는 $2\sqrt{10}\rm,cm$이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

다음 그림에서 두 선분 $\overline{PA}, \overline{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 접점이다. $\overline{OA} = 5\rm,cm$, $\overline{OP} = 9\rm,cm$일 때, 접선 $\overline{PB}$의 길이는? [3점]

**보기** ① $3\sqrt{6}\rm,cm$  ② $2\sqrt{13}\rm,cm$  ③ $7\rm,cm$  ④ $2\sqrt{14}\rm,cm$  ⑤ $4\sqrt{3}\rm,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 $B$가 접점이므로 반지름 $\overline{OB}$와 접선 $\overline{PB}$는 수직($\angle OBP = 90^\circ$)이다.
2. $\overline{OB} = \overline{OA} = 5\rm\,cm$이고 $\overline{OP} = 9\rm\,cm$이다.
3. 직각삼각형 $OPB$에서 피타고라스 정리에 의해 $\overline{PB} = \sqrt{9^2 - 5^2} = \sqrt{56} = 2\sqrt{14}\rm\,cm$이다. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 두 선분 $\overline{PA}, \overline{PB}$는

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 두 선분 $\overline{PA}, \overline{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 접점이다.」
**RPM** M3-RPM-071 [원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선] **원천→판정: 기하 > 원의 성질 > 원과 직선 > 원의 접선의 성질 → 원의 성질 > 원과 직선 > 원의 접선 > 한 점에서 그은 두 접선**
- 이유: 한 점에서 그은 두 접선의 성질을 다루는 RPM 유형이다. (문항 토큰 PA)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE **원천→판정: PT_M3_TANGENT_SEGMENT_LENGTH → PT_CIRCLE_TANGENT** **원천→판정: TPL_M3_TANGENT_RIGHT_TRIANGLE_PYTHAGORAS → TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE**
- 이유: 원의 접선의 기본 성질과 직각삼각형의 길이를 구하는 유형이다. (문항 토큰 PA)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 접선과 반지름의 수직 성질을 바로 적용하는 난이도 2 문항이다. (문항 토큰 PA)

**4칸**
- given: 접선←stem:「다음 그림에서 두 선분 $\overline{PA}, \overline{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 접점이다.」
- goal: 접선←stem:「$\overline{OA} = 5\rm,cm$, $\overline{OP} = 9\rm,cm$일 때, 접선 $\overline{PB}$의 길이는?」
- method: 접선(NAMED)←solution:「원의 접선은 접점을 지나는 반지름과 수직을 이룬다.」
- condition: (없음)

**how** 접선과 반지름의 수직 관계를 직각삼각형 피타고라스 정리와 연계하여 길이를 구하였다. (문항 토큰 PA)

<details><summary>저장 해설 (판정 검토용)</summary>

원의 접선은 접점을 지나는 반지름과 수직을 이룬다.


1단계: 점 $B$가 접점이므로 접선 $\overline{PB}$와 반지름 $\overline{OB}$는 수직이다. $$\angle OBP = 90^\circ$$


2단계: 원의 반지름의 길이는 일정하므로 $\overline{OB} = \overline{OA} = 5\rm,cm$이다. 직각삼각형 $OPB$에서 피타고라스 정리를 적용하면 다음과 같다. $$\begin{aligned} \overline{PB}^2 &= \overline{OP}^2 - \overline{OB}^2 \ &= 9^2 - 5^2 \ &= 81 - 25 \ &= 56 \end{aligned}$$ 따라서 $\overline{PB} = \sqrt{56} = 2\sqrt{14}\rm,cm$이다.


따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림에서 세 선분 $\overline{AD}, \overline{BC}, \overline{CD}$는 반지름의 길이가 $4\rm,cm$인 반원 $O$에 접하고 세 점 $A, B, E$는 접점이다. $\overline{CD} = 11\rm,cm$일 때, 사각형 $ABCD$의 둘레의 길이는? [4점]

**보기** ① $30\rm,cm$  ② $31\rm,cm$  ③ $32\rm,cm$  ④ $33\rm,cm$  ⑤ $34\rm,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반원의 지름 $\overline{AB} = 2 \times 4 = 8\rm\,cm$이다.
2. 원 밖의 점에서 그은 접선의 길이는 같으므로 $\overline{AD} = \overline{DE}$, $\overline{BC} = \overline{CE}$이다.
3. 따라서 사각형 $ABCD$의 둘레는 $\overline{AB} + (\overline{AD} + \overline{BC}) + \overline{CD} = 8 + 11 + 11 = 30\rm\,cm$로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 세 선분 $\overline{AD}, \overline{BC}, \overline{CD}$는

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 세 선분 $\overline{AD}, \overline{BC}, \overline{CD}$는 반지름의 길이가 $4\rm,cm$인 반원 $O$에 접하고 세 점 $A, B, E$는 접점이다.」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] **원천→판정: 기하 > 원의 성질 > 원과 직선 > 원의 외접다각형의 성질 → 원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기**
- 이유: 원의 외접다각형에서 접선 조건으로 길이를 구하는 RPM 유형이다. (문항 토큰 AD)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE **원천→판정: PT_M3_TANGENT_QUADRILATERAL_PERIMETER → PT_CIRCLE_TANGENT** **원천→판정: TPL_M3_SEMI_CIRCLE_CIRCUMSCRIBED_TRAPEZOID → TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE**
- 이유: 외접 사각형에서 접선의 길이 성질을 이용한 둘레 계산 유형이다. (문항 토큰 AD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선의 합 관계를 적용하여 둘레를 구하는 난이도 2 문항이다. (문항 토큰 AD)

**4칸**
- given: 선분←stem:「다음 그림에서 세 선분 $\overline{AD}, \overline{BC}, \overline{CD}$는 반지름의 길이가 $4\rm,cm$인 반원 $O$에 접하고 세 점 $A, B, E$는 접점이다.」
- goal: 사각형←stem:「$\overline{CD} = 11\rm,cm$일 때, 사각형 $ABCD$의 둘레의 길이는?」
- method: 접선(NAMED)←solution:「원 밖의 한 점에서 원에 그은 두 접선의 길이는 서로 같다.」
- condition: (없음)

**how** 원 밖의 한 점에서 그은 접선의 길이가 같음을 이용하여 외접 사각형의 둘레를 계산하였다. (문항 토큰 AD)

<details><summary>저장 해설 (판정 검토용)</summary>

원 밖의 한 점에서 원에 그은 두 접선의 길이는 서로 같다.


1단계: 반원의 반지름이 $4\rm,cm$이므로 지름 $\overline{AB}$의 길이는 다음과 같다. $$\begin{aligned} \overline{AB} &= 2 \times 4 \ &= 8\rm,cm \end{aligned}$$


2단계: 점 $D$에서 반원에 그은 두 접선의 접점이 각각 $A, E$이므로 $\overline{DA} = \overline{DE}$이다. 점 $C$에서 반원에 그은 두 접선의 접점이 각각 $B, E$이므로 $\overline{CB} = \overline{CE}$이다. 따라서 다음 관계가 성립한다. $$\begin{aligned} \overline{AD} + \overline{BC} &= \overline{DE} + \overline{CE} \ &= \overline{CD} \ &= 11\rm,cm \end{aligned}$$


3단계: 사각형 $ABCD$의 둘레의 길이는 네 변의 길이의 합이므로 다음과 같다. $$\begin{aligned} \text{둘레} &= \overline{AB} + \overline{BC} + \overline{CD} + \overline{DA} \ &= \overline{AB} + (\overline{AD} + \overline{BC}) + \overline{CD} \ &= 8 + 11 + 11 \ &= 30\rm,cm \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림에서 사각형 $ABCD$는 원 $O$에 내접하고, 두 선분 $AD$와 $BC$의 연장선의 교점을 $P$라 하자. $\angle P = 40^\circ, \angle ABC = 105^\circ$일 때, $\angle PCD$의 크기는? [4점]

**보기** ① $55^\circ$  ② $60^\circ$  ③ $65^\circ$  ④ $70^\circ$  ⑤ $75^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 점 $P, B, C$가 한 직선 위에 있으므로 $\angle ABP = 180^\circ - 105^\circ = 75^\circ$이다.
2. 삼각형 $PAB$에서 $\angle PAB = 180^\circ - (40^\circ + 75^\circ) = 65^\circ$이다.
3. 사각형 $ABCD$가 원에 내접하므로 외각 $\angle PCD = \angle PAB = 65^\circ$이다. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 사각형 $ABCD$는 원 $O$에 내접하고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 사각형 $ABCD$는 원 $O$에 내접하고, 두 선분 $AD$와 $BC$의 연장선의 교점을 $P$라 하자.」
**RPM** M3-RPM-077 [원의 성질 > 원주각 > 원주각의 활용 > 내접사각형의 각] **원천→판정: 기하 > 원의 성질 > 원주각의 활용 > 원에 내접하는 사각형의 성질 → 원의 성질 > 원주각 > 원주각의 활용 > 내접사각형의 각**
- 이유: 원주각의 활용에서 내접사각형의 각을 다루는 RPM 유형이다. (문항 토큰 ABCD)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_INSCRIBED_QUADRILATERAL_OPPOSITE_ANGLES **원천→판정: PT_M3_INSCRIBED_QUAD_EXTERIOR_ANGLE → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_INSCRIBED_QUAD_INTERSECTING_SECANTS → TPL_CIRCLE_INSCRIBED_QUADRILATERAL_OPPOSITE_ANGLES**
- 이유: 원에 내접하는 사각형의 성질과 삼각형 내각을 이용한 각도 추론 유형이다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외각과 대내각 성질을 2단계로 계산하는 난이도 2 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 선분←stem:「다음 그림에서 사각형 $ABCD$는 원 $O$에 내접하고, 두 선분 $AD$와 $BC$의 연장선의 교점을 $P$라 하자.」
- goal: 사각형←solution:「원에 내접하는 사각형의 한 외각의 크기는 그 대내각의 크기와 같다.」
- method: 직선(NAMED)←solution:「1단계: 세 점 $P, B, C$가 한 직선 위에 있으므로 $\angle ABC = 105^\circ$에서 $$\begin{aligned} \angle ABP &= 180^\circ - \angle ABC \ &= 180^\circ - 105^\circ \ &= 75^\circ \end{aligned}$$」
- condition: (없음)

**how** 삼각형의 내각의 합과 원에 내접하는 사각형의 한 외각의 성질을 연계하여 각도를 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

원에 내접하는 사각형의 한 외각의 크기는 그 대내각의 크기와 같다.


1단계: 세 점 $P, B, C$가 한 직선 위에 있으므로 $\angle ABC = 105^\circ$에서 $$\begin{aligned} \angle ABP &= 180^\circ - \angle ABC \ &= 180^\circ - 105^\circ \ &= 75^\circ \end{aligned}$$


2단계: 삼각형 $PAB$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle PAB &= 180^\circ - (\angle P + \angle ABP) \ &= 180^\circ - (40^\circ + 75^\circ) \ &= 180^\circ - 115^\circ \ &= 65^\circ \end{aligned}$$


3단계: 사각형 $ABCD$가 원에 내접하므로 꼭짓점 $C$에서의 외각 $\angle PCD$의 크기는 그와 마주 보는 대내각 $\angle PAB$의 크기와 같다. $$\begin{aligned} \angle PCD &= \angle PAB \ &= 65^\circ \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

다음 그림에서 호 $\wideparen{AB}$는 깨진 원의 일부분이다. 현 $\overline{AB}$의 중점 $D$에 대하여 $\overline{AB} \perp \overline{CD}$이고, $\overline{AD} = \overline{BD} = 6\rm,cm, \overline{CD} = 2\rm,cm$일 때, 이 원의 반지름의 길이는? [5점]

**보기** ① $6\rm,cm$  ② $7\rm,cm$  ③ $8\rm,cm$  ④ $9\rm,cm$  ⑤ $10\rm,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직선 $CD$는 현 $\overline{AB}$의 수직이등분선이므로 원래 원의 중심 $O$를 지난다.
2. 원의 반지름을 $r\rm\,cm$라 하면 직각삼각형 $ODB$에서 $\overline{OD} = r - 2$, $\overline{BD} = 6$, $\overline{OB} = r$이다.
3. 피타고라스 정리에 의해 $(r-2)^2 + 6^2 = r^2$에서 $r^2 - 4r + 40 = r^2 \implies 4r = 40 \implies r = 10\rm\,cm$이다. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 호 $\wideparen{AB}$는 깨진 원의 일부분이다.

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 호 $\wideparen{AB}$는 깨진 원의 일부분이다.」
**RPM** M3-RPM-068 [원의 성질 > 원과 직선 > 원의 중심과 현 > 현의 수직이등분선과 중심] **원천→판정: 기하 > 원의 성질 > 원과 직선 > 원의 중심과 현의 길이의 활용 → 원의 성질 > 원과 직선 > 원의 중심과 현 > 현의 수직이등분선과 중심**
- 이유: 현의 수직이등분선과 중심을 다루는 RPM 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=TM_CIRCLE_CHORD_PERP_BISECTOR **원천→판정: PT_M3_BROKEN_PLATE_RADIUS → PT_CIRCLE_LINE_RELATION** **원천→판정: TPL_M3_CHORD_ALTITUDE_RADIUS_EQUATION → TM_CIRCLE_CHORD_PERP_BISECTOR**
- 이유: 깨진 원 모양에서 현의 수직이등분선 성질로 반지름을 복원하는 유형이다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 직각삼각형에 피타고라스 정리를 적용해 일차방정식을 푸는 난이도 2 문항이다. (문항 토큰 AB)

**4칸**
- given: 부분←stem:「다음 그림에서 호 $\wideparen{AB}$는 깨진 원의 일부분이다.」
- goal: 반지름←stem:「현 $\overline{AB}$의 중점 $D$에 대하여 $\overline{AB} \perp \overline{CD}$이고, $\overline{AD} = \overline{BD} = 6\rm,cm, \overline{CD} = 2\rm,cm$일 때, 이 원의 반지름의 길이는?」
- method: 중심(NAMED)←solution:「현의 수직이등분선은 그 원의 중심을 지난다.」
- condition: (없음)

**how** 현의 수직이등분선이 중심을 지남을 이용하여 직각삼각형에서 반지름 방정식을 세워 풀었다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

현의 수직이등분선은 그 원의 중심을 지난다.


1단계: 점 $D$는 현 $\overline{AB}$의 중점이고 $\overline{CD} \perp \overline{AB}$이므로 직선 $CD$는 현 $\overline{AB}$의 수직이등분선이다. 따라서 원래 원의 중심 $O$는 직선 $CD$ 위에 존재한다.


2단계: 원의 반지름의 길이를 $r\rm,cm$라 하자. 점 $C$는 원 위의 점이므로 $\overline{OC} = r\rm,cm$이다. $\overline{CD} = 2\rm,cm$이므로 선분 $\overline{OD}$의 길이는 다음과 같다. $$\overline{OD} = r - 2$$


3단계: 점 $A$ 역시 원 위의 점이므로 $\overline{OA} = r\rm,cm$이다. 직각삼각형 $ODA$에서 피타고라스 정리를 세우면 다음과 같다. $$\begin{aligned} \overline{OA}^2 &= \overline{OD}^2 + \overline{AD}^2 \ r^2 &= (r - 2)^2 + 6^2 \ r^2 &= (r^2 - 4r + 4) + 36 \ r^2 &= r^2 - 4r + 40 \ 4r &= 40 \ r &= 10\rm,cm \end{aligned}$$ 따라서 이 원의 반지름의 길이는 $10\rm,cm$이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림과 같이 $\triangle ABC$의 내접원 $O$는 세 변 $AB, BC, CA$와 각각 세 점 $D, E, F$에서 접한다. $\angle A = 50^\circ, \angle B = 60^\circ$일 때, 접점 $E$에서 현 $EF$와 변 $BC$가 이루는 각 $\angle x$의 크기는? [4점]

**보기** ① $50^\circ$  ② $55^\circ$  ③ $60^\circ$  ④ $65^\circ$  ⑤ $70^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형 $ABC$에서 $\angle C = 180^\circ - (50^\circ + 60^\circ) = 70^\circ$이다.
2. 점 $C$에서 그은 접선의 접점이 $E, F$이므로 $\overline{CE} = \overline{CF}$인 이등변삼각형이다.
3. 따라서 $\angle x = \dfrac{180^\circ - 70^\circ}{2} = 55^\circ$이므로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\triangle ABC$의 내접원 $O$는

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\triangle ABC$의 내접원 $O$는 세 변 $AB, BC, CA$와 각각 세 점 $D, E, F$에서 접한다.」
**RPM** M3-RPM-079 [원의 성질 > 원주각 > 원주각의 활용 > 접선과 현이 이루는 각] **원천→판정: 기하 > 원의 성질 > 원주각의 활용 > 접선과 현이 이루는 각 → 원의 성질 > 원주각 > 원주각의 활용 > 접선과 현이 이루는 각**
- 이유: 원주각의 활용에서 접선과 현이 이루는 각을 다루는 RPM 유형이다. (문항 토큰 ABC)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_TANGENT_CHORD **원천→판정: PT_M3_INSCRIBED_CIRCLE_CHORD_ANGLE → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_TRIANGLE_INCIRCLE_TANGENT_CHORD → TPL_CIRCLE_ANGLE_TANGENT_CHORD**
- 이유: 삼각형의 내접원과 접선이 이루는 각을 추론하는 유형이다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형 성질을 적용하는 난이도 2 문항이다. (문항 토큰 ABC)

**4칸**
- given: 내접←stem:「다음 그림과 같이 $\triangle ABC$의 내접원 $O$는 세 변 $AB, BC, CA$와 각각 세 점 $D, E, F$에서 접한다.」
- goal: 접점←stem:「$\angle A = 50^\circ, \angle B = 60^\circ$일 때, 접점 $E$에서 현 $EF$와 변 $BC$가 이루는 각 $\angle x$의 크기는?」
- method: 접선(NAMED)←solution:「내접원의 중심과 접선 사이의 수직 관계 및 이등변삼각형의 성질을 이용한다.」
- condition: (없음)

**how** 접선의 길이 성질로 생기는 이등변삼각형의 밑각을 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

내접원의 중심과 접선 사이의 수직 관계 및 이등변삼각형의 성질을 이용한다.


1단계: 삼각형 $ABC$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle C &= 180^\circ - (\angle A + \angle B) \ &= 180^\circ - (50^\circ + 60^\circ) \ &= 70^\circ \end{aligned}$$


2단계: 원 $O$가 변 $BC, AC$에 각각 점 $E, F$에서 접하므로 반지름과 접선은 수직이다. $$\overline{OE} \perp \overline{BC}, \quad \overline{OF} \perp \overline{AC}$$ 사각형 $OECF$의 네 내각의 크기의 합은 $360^\circ$이므로 $$\begin{aligned} \angle EOF &= 360^\circ - (90^\circ + 90^\circ + \angle C) \ &= 180^\circ - 70^\circ \ &= 110^\circ \end{aligned}$$


3단계: $\overline{OE} = \overline{OF}$는 원 $O$의 반지름이므로 삼각형 $OEF$는 이등변삼각형이다. $$\begin{aligned} \angle OEF &= \dfrac{180^\circ - 110^\circ}{2} \ &= 35^\circ \end{aligned}$$


4단계: $\overline{OE} \perp \overline{BC}$이므로 $\angle OEC = 90^\circ$이다. 따라서 각 $\angle x$의 크기는 다음과 같다. $$\begin{aligned} \angle x &= 90^\circ - \angle OEF \ &= 90^\circ - 35^\circ \ &= 55^\circ \end{aligned}$$ (참고: 접선과 현이 이루는 각의 성질에 의하여 $\angle x = \angle EDF = \dfrac{1}{2} \angle EOF = \dfrac{110^\circ}{2} = 55^\circ$로도 구할 수 있다.) 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 그림에서 두 반직선 $\overrightarrow{PA}, \overrightarrow{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 그 접점이다. 선분 $\overline{AC}$는 원 $O$의 지름이고 $\angle BAC = 35^\circ$일 때, $\angle APB$의 크기는? [4점]

**보기** ① $70^\circ$  ② $72^\circ$  ③ $74^\circ$  ④ $76^\circ$  ⑤ $78^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\overline{PA} = \overline{PB}$이므로 삼각형 $PAB$는 이등변삼각형이고 $\angle PBA = \angle PAB = 70^\circ$이다.
2. 선분 $\overline{AC}$가 지름이므로 $\angle ABC = 90^\circ$이다.
3. 접선과 반지름 수직 성질 또는 원주각 관계에 의해 $\angle BAC = 35^\circ$이다. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 두 반직선 $\overrightarrow{PA}, \overrightarrow{PB}$는 원 $O$의 접선이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 두 반직선 $\overrightarrow{PA}, \overrightarrow{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 그 접점이다.」
**RPM** M3-RPM-076 [원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각과 접선의 성질 → 원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각**
- 이유: 반원에 대한 원주각의 성질을 다루는 RPM 유형이다. (문항 토큰 PA)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC **원천→판정: PT_M3_DIAMETER_INSCRIBED_TANGENT_ANGLE → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_DIAMETER_SUBTENDED_TWO_TANGENTS → TPL_CIRCLE_ANGLE_CENTER_ARC**
- 이유: 원의 지름과 접선이 만드는 원주각의 크기를 구하는 유형이다. (문항 토큰 PA)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 성질과 지름의 원주각을 연계하는 난이도 2 문항이다. (문항 토큰 PA)

**4칸**
- given: 접선←stem:「다음 그림에서 두 반직선 $\overrightarrow{PA}, \overrightarrow{PB}$는 원 $O$의 접선이고 두 점 $A, B$는 그 접점이다.」
- goal: 선분←stem:「선분 $\overline{AC}$는 원 $O$의 지름이고 $\angle BAC = 35^\circ$일 때, $\angle APB$의 크기는?」
- method: 접선(NAMED)←solution:「지름에 대한 원주각과 중심각, 접선의 성질을 차례로 적용한다.」
- condition: (없음)

**how** 접선으로 이루어진 이등변삼각형과 반원의 원주각을 결합하여 각의 크기를 구하였다. (문항 토큰 PA)

<details><summary>저장 해설 (판정 검토용)</summary>

지름에 대한 원주각과 중심각, 접선의 성질을 차례로 적용한다.


1단계: 선분 $\overline{AC}$는 원 $O$의 지름이므로 반원에 대한 원주각의 성질에 의하여 $$\angle ABC = 90^\circ$$ 직각삼각형 $ABC$에서 $\angle BAC = 35^\circ$이므로 $$\begin{aligned} \angle ACB &= 90^\circ - 35^\circ \ &= 55^\circ \end{aligned}$$


2단계: $\angle ACB$는 호 $\wideparen{AB}$에 대한 원주각이므로, 같은 호에 대한 중심각 $\angle AOB$의 크기는 원주각의 $2$배이다. $$\begin{aligned} \angle AOB &= 2 \times \angle ACB \ &= 2 \times 55^\circ \ &= 110^\circ \end{aligned}$$


3단계: 두 접선 $\overline{PA}, \overline{PB}$와 반지름은 접점에서 각각 수직이므로 사각형 $PAOB$에서 $$\angle PAO = 90^\circ, \quad \angle PBO = 90^\circ$$ 따라서 사각형의 내각의 합에 의하여 두 접선이 이루는 각 $\angle APB$의 크기는 다음과 같다. $$\begin{aligned} \angle APB &= 180^\circ - \angle AOB \ &= 180^\circ - 110^\circ \ &= 70^\circ \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림에서 선분 $\overline{PT}$는 원 $O$의 접선이고 점 $T$는 접점이다. $\angle TPO = 30^\circ$이고 선분 $\overline{PO}$가 원 $O$와 만나는 점을 $A$라 할 때 $\overline{PA} = 8\rm,cm$이다. 이때 접선 $\overline{PT}$의 길이는? [4점]

**보기** ① $6\sqrt{2}\rm,cm$  ② $6\sqrt{3}\rm,cm$  ③ $7\sqrt{3}\rm,cm$  ④ $8\sqrt{2}\rm,cm$  ⑤ $8\sqrt{3}\rm,cm$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 접선 $\overline{PT}$와 반지름 $\overline{OT}$는 수직이므로 직각삼각형 $PTO$에서 $\angle TPO = 30^\circ$이다.
2. 특수각의 삼각비에 의해 $\overline{PO} = 2\overline{OT} = 2r$, $\overline{PT} = \sqrt{3}r$이다.
3. $\overline{PA} = \overline{PO} - r = 2r - r = r$이므로 $\overline{PA} = 4\rm\,cm$에서 $r = 4\rm\,cm$이다.
4. 따라서 $\overline{PT} = 4\sqrt{3}\rm\,cm$이므로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 선분 $\overline{PT}$는 원 $O$의 접선이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 선분 $\overline{PT}$는 원 $O$의 접선이고 점 $T$는 접점이다.」
**RPM** M3-RPM-070 [원의 성질 > 원과 직선 > 원의 접선 > 접점의 반지름과 접선] **원천→판정: 기하 > 원의 성질 > 원과 직선 > 원의 접선과 삼각비 → 원의 성질 > 원과 직선 > 원의 접선 > 접점의 반지름과 접선**
- 이유: 접점의 반지름과 접선 성질을 다루는 RPM 유형이다. (문항 토큰 PT)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE **원천→판정: PT_M3_TANGENT_SPECIAL_ANGLE_LENGTH → PT_CIRCLE_TANGENT** **원천→판정: TPL_M3_TANGENT_30_DEGREE_RADIUS_EQUATION → TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE**
- 이유: 원의 접선과 삼각비의 특수각을 연계한 길이 계산 유형이다. (문항 토큰 PT)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 특수각 직각삼각형 비를 이용하는 난이도 2 문항이다. (문항 토큰 PT)

**4칸**
- given: 접선←stem:「다음 그림에서 선분 $\overline{PT}$는 원 $O$의 접선이고 점 $T$는 접점이다.」
- goal: 선분←stem:「$\angle TPO = 30^\circ$이고 선분 $\overline{PO}$가 원 $O$와 만나는 점을 $A$라 할 때 $\overline{PA} = 8\rm,cm$이다.」
- method: 반지름(NAMED)←solution:「직각삼각형의 특수각의 삼각비와 원의 반지름의 성질을 이용한다.」
- condition: (없음)

**how** 접선과 반지름의 수직 조건 및 $30^\circ$ 특수각 삼각비를 적용하여 접선의 길이를 구하였다. (문항 토큰 PT)

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형의 특수각의 삼각비와 원의 반지름의 성질을 이용한다.


1단계: 선분 $\overline{PT}$는 접선이고 점 $T$는 접점이므로 반지름 $\overline{OT}$와 수직이다. $$\angle PTO = 90^\circ$$ 따라서 삼각형 $POT$는 $\angle TPO = 30^\circ, \angle PTO = 90^\circ$인 직각삼각형이다.


2단계: 직각삼각형에서 $30^\circ$의 대변은 빗변의 절반이므로 $$\overline{OT} = \overline{OP} \times \sin 30^\circ = \dfrac{1}{2} \overline{OP}$$ 원 $O$의 반지름의 길이를 $r$이라 하면 $\overline{OT} = r$이고, 점 $A$가 원 위의 점이므로 $\overline{OA} = r$이다. 선분 $\overline{OP}$는 다음과 같이 나타낼 수 있다. $$\overline{OP} = \overline{PA} + \overline{OA} = 8 + r$$ 따라서 등식을 세우면 다음과 같다. $$\begin{aligned} r &= \dfrac{1}{2}(8 + r) \ 2r &= 8 + r \ r &= 8\rm,cm \end{aligned}$$ 그러므로 $\overline{OP} = 8 + 8 = 16\rm,cm$이고 $\overline{OT} = 8\rm,cm$이다.


3단계: 직각삼각형 $POT$에서 피타고라스 정리 또는 삼각비를 이용하여 $\overline{PT}$의 길이를 구한다. $$\begin{aligned} \overline{PT} &= \overline{OP} \times \cos 30^\circ \ &= 16 \times \dfrac{\sqrt{3}}{2} \ &= 8\sqrt{3}\rm,cm \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림에서 원 $I$는 $\angle C = 90^\circ$인 직각삼각형 $ABC$의 내접원이고, 세 점 $D, E, F$는 각각 변 $AB, BC, CA$와의 접점이다. $\overline{AB} = 20\rm,cm, \overline{AC} = 12\rm,cm$일 때, 내접원 $I$의 넓이는? [4점]

**보기** ① $12\pi\rm,cm^2$  ② $14\pi\rm,cm^2$  ③ $16\pi\rm,cm^2$  ④ $18\pi\rm,cm^2$  ⑤ $20\pi\rm,cm^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 내접원의 반지름을 $r$이라 하면 사각형 $IECF$는 한 변의 길이가 $r$인 정사각형이다.
2. 직각삼각형의 성질에 의해 $r = \dfrac{a+b-c}{2}$를 적용하거나 넓이 공식 $S = \dfrac{1}{2}r(a+b+c)$를 쓴다.
3. 주어진 조건으로 반지름을 구하면 넓이는 $6$으로 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 원 $I$는 $\angle C = 90^\circ$인 직각삼각형 $ABC$의 내접원이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 원 $I$는 $\angle C = 90^\circ$인 직각삼각형 $ABC$의 내접원이고, 세 점 $D, E, F$는 각각 변 $AB, BC, CA$와의 접점이다.」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] **원천→판정: 기하 > 원의 성질 > 원과 직선 > 직각삼각형의 내접원의 반지름 → 원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기**
- 이유: 접선 조건으로 직각삼각형 내접원 길이를 구하는 RPM 유형이다. (문항 토큰 90)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE **원천→판정: PT_M3_INCIRCLE_RIGHT_TRIANGLE_AREA → PT_CIRCLE_TANGENT** **원천→판정: TPL_M3_RIGHT_TRIANGLE_INCIRCLE_RADIUS → TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE**
- 이유: 직각삼각형의 내접원 반지름과 넓이를 구하는 유형이다. (문항 토큰 90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내접원 공식으로 반지름과 넓이를 도출하는 난이도 2 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「다음 그림에서 원 $I$는 $\angle C = 90^\circ$인 직각삼각형 $ABC$의 내접원이고, 세 점 $D, E, F$는 각각 변 $AB, BC, CA$와의 접점이다.」
- goal: 넓이←stem:「$\overline{AB} = 20\rm,cm, \overline{AC} = 12\rm,cm$일 때, 내접원 $I$의 넓이는?」
- method: 반지름(NAMED)←solution:「직각삼각형의 변의 길이와 내접원의 반지름 사이의 관계식을 이용한다.」
- condition: (없음)

**how** 직각삼각형의 내접원 반지름 공식과 삼각형의 넓이 공식을 결합하여 계산하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형의 변의 길이와 내접원의 반지름 사이의 관계식을 이용한다.


1단계: 직각삼각형 $ABC$에서 빗변이 $\overline{AB} = 20\rm,cm$이고 $\overline{AC} = 12\rm,cm$이므로 피타고라스 정리에 의하여 $$\begin{aligned} \overline{BC} &= \sqrt{\overline{AB}^2 - \overline{AC}^2} \ &= \sqrt{20^2 - 12^2} \ &= \sqrt{400 - 144} \ &= \sqrt{256} \ &= 16\rm,cm \end{aligned}$$


2단계: 내접원의 반지름의 길이를 $r\rm,cm$라 하자. 점 $C$가 직각이므로 사각형 $IECF$는 한 변의 길이가 $r$인 정사각형이다. 따라서 $\overline{CE} = \overline{CF} = r$이다. 접선의 길이는 같으므로 $$\overline{AD} = \overline{AF} = 12 - r, \quad \overline{BD} = \overline{BE} = 16 - r$$ 빗변 $\overline{AB}$는 다음과 같다. $$\begin{aligned} \overline{AB} &= \overline{AD} + \overline{BD} \ 20 &= (12 - r) + (16 - r) \ 20 &= 28 - 2r \ 2r &= 8 \ r &= 4\rm,cm \end{aligned}$$ (공식 $r = \dfrac{a + b - c}{2} = \dfrac{12 + 16 - 20}{2} = 4\rm,cm$)


3단계: 따라서 내접원 $I$의 넓이는 다음과 같다. $$\begin{aligned} \text{넓이} &= \pi r^2 \ &= \pi \times 4^2 \ &= 16\pi\rm,cm^2 \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림에서 선분 $\overline{AB}$는 원 $O$의 지름이고, 반원 위의 호가 $\wideparen{AC} = \wideparen{CD} = \wideparen{DE} = \wideparen{EF} = \wideparen{FB}$로 $5$등분되어 있다. 호 $\wideparen{DE}$를 바라보는 원주각을 $\angle x$, 호 $\wideparen{CD}$를 바라보는 원주각을 $\angle y$라 할 때, $\angle x + \angle y$의 크기는? [4점]

**보기** ① $30^\circ$  ② $32^\circ$  ③ $34^\circ$  ④ $36^\circ$  ⑤ $38^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 선분 $\overline{AB}$가 원 $O$의 지름이므로 반원 위의 호 $\wideparen{AC}$ 등의 길이가 모두 같아 원주각 크기도 같다.
2. 반원에 대한 원주각의 총합 $90^\circ$를 등분하여 구하는 각의 크기를 계산한다.
3. 계산 결과 각의 크기는 $54^\circ$로 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 선분 $\overline{AB}$는 원 $O$의 지름이고

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 선분 $\overline{AB}$는 원 $O$의 지름이고, 반원 위의 호가 $\wideparen{AC} = \wideparen{CD} = \wideparen{DE} = \wideparen{EF} = \wideparen{FB}$로 $5$등분되어 있다.」
**RPM** M3-RPM-074 [원의 성질 > 원주각 > 원주각과 중심각 > 같은 호에 대한 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각의 크기와 호의 길이 → 원의 성질 > 원주각 > 원주각과 중심각 > 같은 호에 대한 원주각**
- 이유: 같은 호에 대한 원주각의 크기 비례를 다루는 RPM 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC **원천→판정: PT_M3_EQUAL_ARCS_INSCRIBED_ANGLE_SUM → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_SEMI_CIRCLE_ARC_PARTITION_ANGLE → TPL_CIRCLE_ANGLE_CENTER_ARC**
- 이유: 길이가 같은 호에 대한 원주각의 크기 성질을 이용하는 유형이다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 호의 분할에 따른 각의 비례 계산 난이도 2 문항이다. (문항 토큰 AB)

**4칸**
- given: 선분←stem:「다음 그림에서 선분 $\overline{AB}$는 원 $O$의 지름이고, 반원 위의 호가 $\wideparen{AC} = \wideparen{CD} = \wideparen{DE} = \wideparen{EF} = \wideparen{FB}$로 $5$등분되어 있다.」
- goal: 원주각←stem:「호 $\wideparen{DE}$를 바라보는 원주각을 $\angle x$, 호 $\wideparen{CD}$를 바라보는 원주각을 $\angle y$라 할 때, $\angle x + \angle y$의 크기는?」
- method: 중심(NAMED)←solution:「호의 길이와 중심각, 원주각의 비례 관계를 이용한다.」
- condition: (없음)

**how** 호의 길이에 비례하는 원주각의 성질을 이용하여 각을 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

호의 길이와 중심각, 원주각의 비례 관계를 이용한다.


1단계: 선분 $\overline{AB}$가 지름이므로 반원의 중심각의 크기는 $180^\circ$이다. 호 $AB$가 $5$개의 같은 길이의 호로 나누어져 있으므로, 한 호에 대한 중심각의 크기는 다음과 같다. $$\begin{aligned} 180^\circ \div 5 &= 36^\circ \end{aligned}$$


2단계: 원주각의 크기는 같은 호에 대한 중심각의 크기의 절반이다. 호 $\wideparen{DE}$의 중심각이 $36^\circ$이므로 원주각 $\angle x$의 크기는 다음과 같다. $$\angle x = \dfrac{36^\circ}{2} = 18^\circ$$ 마찬가지로 호 $\wideparen{CD}$의 중심각도 $36^\circ$이므로 원주각 $\angle y$의 크기는 다음과 같다. $$\angle y = \dfrac{36^\circ}{2} = 18^\circ$$


3단계: 따라서 두 각의 크기의 합은 다음과 같다. $$\begin{aligned} \angle x + \angle y &= 18^\circ + 18^\circ \ &= 36^\circ \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림에서 원 $O$는 $\triangle ABC$의 외접원이고, 선분 $\overline{AQ}$는 원 $O$의 지름이다. 꼭짓점 $A$에서 변 $\overline{BC}$에 내린 수선의 발을 $H$라 하자. $\overline{AB} = 12, \overline{AC} = 8, \overline{CH} = 4$일 때, 원 $O$의 반지름의 길이는? [5점]

**보기** ① $4\sqrt{3}$  ② $\dfrac{9\sqrt{3}}{2}$  ③ $5\sqrt{3}$  ④ $\dfrac{11\sqrt{3}}{2}$  ⑤ $6\sqrt{3}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\overline{AQ}$가 지름이므로 $\angle ABQ = 90^\circ$이다.
2. 호 $AC$에 대한 원주각으로 $\angle AQC = \angle ABC$이며 삼각형의 닮음을 적용할 수 있다.
3. 비례식을 세워 원의 지름 또는 반지름을 구하면 지름의 길이는 $15\rm\,cm$이다. 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 원 $O$는 $\triangle ABC$의 외접원이고, 선분 $\overline{AQ}$는 원 $O$의 지름이다

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 원 $O$는 $\triangle ABC$의 외접원이고, 선분 $\overline{AQ}$는 원 $O$의 지름이다.」
**RPM** M3-RPM-076 [원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각과 삼각형의 닮음 → 원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각**
- 이유: 반원에 대한 원주각과 삼각형의 닮음을 다루는 RPM 유형이다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION **원천→판정: PT_M3_CIRCUMCIRCLE_DIAMETER_SIMILARITY → PT_TRIANGLE_SIMILARITY** **원천→판정: TPL_M3_ALTITUDE_CIRCUMCIRCLE_DIAMETER_RATIO → TPL_TRIANGLE_SIMILARITY_APPLICATION**
- 이유: 원주각의 성질과 삼각형의 닮음을 융합한 외접원 계산 유형이다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 보조선과 닮음비를 세우는 난이도 3 문항이다. (문항 토큰 ABC)

**4칸**
- given: 선분←stem:「다음 그림에서 원 $O$는 $\triangle ABC$의 외접원이고, 선분 $\overline{AQ}$는 원 $O$의 지름이다.」
- goal: 수선←stem:「꼭짓점 $A$에서 변 $\overline{BC}$에 내린 수선의 발을 $H$라 하자.」
- method: 삼각형(NAMED)←solution:「외접원의 지름에 대한 원주각과 삼각형의 닮음을 결합하여 외접원의 지름을 구한다.」
- condition: (없음)

**how** 지름의 원주각과 삼각형의 닮음비를 이용하여 외접원의 지름을 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

외접원의 지름에 대한 원주각과 삼각형의 닮음을 결합하여 외접원의 지름을 구한다.


1단계: 직각삼각형 $AHC$에서 $\overline{AC} = 8, \overline{CH} = 4$이므로 피타고라스 정리에 의하여 $$\begin{aligned} \overline{AH} &= \sqrt{\overline{AC}^2 - \overline{CH}^2} \ &= \sqrt{8^2 - 4^2} \ &= \sqrt{64 - 16} \ &= \sqrt{48} \ &= 4\sqrt{3} \end{aligned}$$


2단계: 점 $Q$와 점 $C$를 선분으로 잇는다. $\overline{AQ}$가 원 $O$의 지름이므로 지름에 대한 원주각에 의하여 $$\angle ACQ = 90^\circ$$ 또 $\overline{AH} \perp \overline{BC}$이므로 $\angle AHB = 90^\circ$이다. 호 $\wideparen{AC}$에 대한 원주각의 크기는 같으므로 $$\angle ABH = \angle ABC = \angle AQC$$ 따라서 두 직각삼각형은 두 각의 크기가 같으므로 닮음이다. $$\triangle ABH \sim \triangle AQC \quad (\text{AA 닮음})$$


3단계: 두 닮은 삼각형의 대응변의 길이의 비는 같으므로 $$\begin{aligned} \dfrac{\overline{AB}}{\overline{AQ}} &= \dfrac{\overline{AH}}{\overline{AC}} \ \dfrac{12}{\overline{AQ}} &= \dfrac{4\sqrt{3}}{8} \ \dfrac{12}{\overline{AQ}} &= \dfrac{\sqrt{3}}{2} \ \sqrt{3} \overline{AQ} &= 24 \ \overline{AQ} &= \dfrac{24}{\sqrt{3}} = 8\sqrt{3} \end{aligned}$$


4단계: 선분 $\overline{AQ}$는 원 $O$의 지름이므로 반지름의 길이는 다음과 같다. $$\begin{aligned} R &= \dfrac{\overline{AQ}}{2} \ &= \dfrac{8\sqrt{3}}{2} \ &= 4\sqrt{3} \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 각 자료 중에서 중앙값이 평균보다 자료 전체의 중심적인 경향을 더 잘 나타낸다고 볼 수 있는 것은? [3점]

**보기** ① $2, 4, 6, 8, 10, 12$  ② $5, 5, 5, 7, 7, 7$  ③ $3, 5, 5, 6, 50, 2, 2$  ④ $0.4, 0.6, 0.8, 0.5, 0.7, 0.3$  ⑤ $-1.5, -0.8, 0.2, 0.5, -0.4, 1.0$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 자료에 극단적인 값(이상값)이 포함되어 있으면 평균이 크게 왜곡된다.
2. 보기 ③의 자료는 극단값 $50$이 포함되어 있어 평균보다 중앙값이 대표성을 더 잘 나타낸다.
3. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 각 자료 중에서 중앙값이 평균보다 자료 전체의 중심적인 경향을 더 잘 나타낸다고 볼 수 있는 것은?」
**RPM** M3-RPM-082 [통계 > 대푯값과 산포도 > 대푯값 > 대푯값 비교] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 대푯값의 특성과 선택 → 통계 > 대푯값과 산포도 > 대푯값 > 대푯값 비교**
- 이유: 대푯값의 특성과 선택을 비교하는 RPM 유형이다. (문항 토큰 10)
**유형** PT=PT_M3_REPRESENTATIVE / TPL=NONE **원천→판정: PT_M3_OUTLIER_REPRESENTATIVE_SELECTION → PT_M3_REPRESENTATIVE** **원천→판정: TPL_M3_OUTLIER_MEDIAN_OVER_MEAN → NONE**
- 이유: 자료의 분포 특성에 적합한 대푯값을 선택하는 유형이다. (문항 토큰 10)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이상값 유무를 빠르게 판별하는 난이도 1 문항이다. (문항 토큰 10)

**4칸**
- given: 중심←stem:「다음 각 자료 중에서 중앙값이 평균보다 자료 전체의 중심적인 경향을 더 잘 나타낸다고 볼 수 있는 것은?」
- goal: 포함←solution:「자료에 극단적인 값(이상치)이 포함되어 있을 때 평균은 그 값에 크게 영향을 받아 전체 자료의 대표성을 잃게 되므로, 극단값의 영향을 받지 않는 중앙값이 대푯값으로 적절하다.」
- method: 대칭성(NAMED)←solution:「• ①, ②, ④, ⑤의 자료는 변량들이 특정 구간에 고르게 분포되어 있거나 대칭성을 띠므로 평균이 자료의 대푯값으로 적절하다.」
- condition: (없음)

**how** 극단값의 존재 여부에 따라 평균과 중앙값의 대표성을 비교하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

자료에 극단적인 값(이상치)이 포함되어 있을 때 평균은 그 값에 크게 영향을 받아 전체 자료의 대표성을 잃게 되므로, 극단값의 영향을 받지 않는 중앙값이 대푯값으로 적절하다.


각 보기를 검토하면 다음과 같다. • ①, ②, ④, ⑤의 자료는 변량들이 특정 구간에 고르게 분포되어 있거나 대칭성을 띠므로 평균이 자료의 대푯값으로 적절하다. • ③의 자료 $3, 5, 5, 6, 50, 2, 2$에는 다른 값들에 비해 현저하게 큰 극단값 $50$이 포함되어 있다. 자료의 합을 구하면 $2 + 2 + 3 + 5 + 5 + 6 + 50 = 73$이 되어 평균은 $\dfrac{73}{7} \approx 10.43$으로 대부분의 자료($2\sim 6$)보다 훨씬 커진다. 반면 자료를 크기순으로 나열했을 때의 중앙값은 $5$로, 자료 대부분이 모여 있는 중심 위치를 매우 잘 반영한다.


따라서 중앙값이 평균보다 자료의 중심적 경향을 더 잘 나타내는 것은 ③이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 표는 어느 중학교 학생 $40$명의 일주일 동안의 독서 시간을 조사하여 나타낸 것이다. 독서 시간의 중앙값을 $a$시간, 최빈값을 $b$시간이라 할 때, $a + b$의 값은? [4점]


독서 시간(시간)
  $3$
  $4$
  $5$
  $6$
  $7$
  합계
  학생 수(명)
  $4$
  $12$
  $8$
  $13$
  $3$
  $40$

**보기** ① $9$  ② $9.5$  ③ $10$  ④ $10.5$  ⑤ $11$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 학생 $40$명의 중앙값은 $20$번째와 $21$번째 변량의 평균이다.
2. 누적 도수를 계산하면 중앙값 $a = 9.5$, 최빈값 $b = 10$이다.
3. 따라서 $a + b = 9.5 + 10 = 19.5$이므로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 표는 어느 중학교 학생 $40$명의 일주일 동안의

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「독서 시간의 중앙값을 $a$시간, 최빈값을 $b$시간이라 할 때, $a + b$의 값은?」
**RPM** M3-RPM-081 [통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 도수분포표에서의 중앙값과 최빈값 → 통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값**
- 이유: 평균·중앙값·최빈값의 계산을 다루는 RPM 유형이다. (문항 토큰 40)
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_CENTRAL_TENDENCY_MEDIAN_MODE_ORDER_POSITION **원천→판정: PT_M3_FREQUENCY_TABLE_MEDIAN_MODE → PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE** **원천→판정: TPL_M3_CUMULATIVE_FREQUENCY_MEDIAN_MODE_SUM → TPL_M3_CENTRAL_TENDENCY_MEDIAN_MODE_ORDER_POSITION**
- 이유: 도수분포표에서 중앙값과 최빈값을 구하는 유형이다. (문항 토큰 40)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 도수분포표 해석과 중앙값 계산의 난이도 2 문항이다. (문항 토큰 40)

**4칸**
- given: 중앙값←stem:「독서 시간의 중앙값을 $a$시간, 최빈값을 $b$시간이라 할 때, $a + b$의 값은?」
- goal: 중앙값←solution:「도수분포표에서 누적도수를 이용하여 중앙값과 최빈값을 구한다.」
- method: 자료(NAMED)←solution:「1단계: 전체 학생 수가 $40$명(짝수)이므로 중앙값은 자료를 작은 값부터 차례로 나열했을 때 $20$번째와 $21$번째 값의 평균이다.」
- condition: (없음)

**how** 도수분포표에서 누적 도수로 중앙값의 위치를 찾고 도수가 가장 큰 계급값으로 최빈값을 구하였다. (문항 토큰 40)

<details><summary>저장 해설 (판정 검토용)</summary>

도수분포표에서 누적도수를 이용하여 중앙값과 최빈값을 구한다.


1단계: 전체 학생 수가 $40$명(짝수)이므로 중앙값은 자료를 작은 값부터 차례로 나열했을 때 $20$번째와 $21$번째 값의 평균이다. 독서 시간별 누적도수를 계산하면 다음과 같다. • $3$시간 이하: $4$명 • $4$시간 이하: $4 + 12 = 16$명 • $5$시간 이하: $16 + 8 = 24$명 따라서 $17$번째부터 $24$번째까지의 자료의 값은 모두 $5$시간이다. 그러므로 $20$번째 자료와 $21$번째 자료의 값은 둘 다 $5$시간이다. $$\begin{aligned} a &= \dfrac{5 + 5}{2} \ &= 5\text{시간} \end{aligned}$$


2단계: 최빈값은 도수(학생 수)가 가장 큰 변량이다. 학생 수가 $13$명으로 가장 많은 독서 시간은 $6$시간이므로 $$b = 6\text{시간}$$


3단계: 따라서 구하고자 하는 $a + b$의 값은 다음과 같다. $$\begin{aligned} a + b &= 5 + 6 \ &= 11 \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

어느 음악 동호회 회원 $4$명의 나이를 작은 순서대로 나열하면 $22, x, 30, 30$ (단위: 살)이다. 이 회원들의 평균 나이가 $27$살일 때, 나이의 중앙값은? [4점]

**보기** ① $27$살  ② $28$살  ③ $28.5$살  ④ $29$살  ⑤ $29.5$살

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 자료가 $22, x, 30, 30$ 순서로 나열되어 있고 평균이 $27$이다.
2. 총합은 $22 + x + 30 + 30 = 27 \times 4 = 108$에서 $x + 82 = 108 \implies x = 26$이다.
3. 네 변량이 $22, 26, 30, 30$이므로 중앙값은 $\dfrac{26 + 30}{2} = 28$이다. 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「어느 음악 동호회 회원 $4$명의 나이를 작은 순서대로 나열하면 $22, x, 30, 30$ (단위: 살)이다.」
**RPM** M3-RPM-081 [통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 평균과 중앙값의 관계 → 통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값**
- 이유: 평균과 중앙값의 관계를 이용한 미지수 추론 RPM 유형이다. (문항 토큰 22)
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_DETERMINE_UNKNOWN_FROM_MEAN_AND_MEDIAN_CONDITIONS **원천→판정: PT_M3_MEAN_TO_MEDIAN_RECOVERY → PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE** **원천→판정: TPL_M3_SUM_EQUATION_THEN_MEDIAN → TPL_M3_DETERMINE_UNKNOWN_FROM_MEAN_AND_MEDIAN_CONDITIONS**
- 이유: 평균 조건으로 미지수를 결정하고 중앙값을 구하는 유형이다. (문항 토큰 22)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평균 총합 계산 후 중앙값을 구하는 난이도 2 문항이다. (문항 토큰 22)

**4칸**
- given: 순서←stem:「어느 음악 동호회 회원 $4$명의 나이를 작은 순서대로 나열하면 $22, x, 30, 30$ (단위: 살)이다.」
- goal: 평균←stem:「이 회원들의 평균 나이가 $27$살일 때, 나이의 중앙값은?」
- method: 평균(NAMED)←solution:「평균으로부터 미지수 $x$를 구하고 중앙값의 정의를 적용한다.」
- condition: (없음)

**how** 평균으로부터 미지수 변량을 구한 후 순서대로 나열된 두 수의 평균으로 중앙값을 계산하였다. (문항 토큰 22)

<details><summary>저장 해설 (판정 검토용)</summary>

평균으로부터 미지수 $x$를 구하고 중앙값의 정의를 적용한다.


1단계: 회원 수가 $4$명이고 평균 나이가 $27$살이므로, $4$명의 나이의 총합은 다음과 같다. $$\begin{aligned} \text{총합} &= 27 \times 4 \ &= 108\text{살} \end{aligned}$$


2단계: 주어진 나이의 합으로 방정식을 세우면 다음과 같다. $$\begin{aligned} 22 + x + 30 + 30 &= 108 \ x + 82 &= 108 \ x &= 26\text{살} \end{aligned}$$ $x = 26$은 $22 \le 26 \le 30$을 만족하므로 크기순으로 나열된 $4$명의 나이는 $22, 26, 30, 30$이다.


3단계: 자료가 $4$개(짝수 개)이므로 중앙값은 가운데 두 자료인 $26$과 $30$의 평균이다. $$\begin{aligned} \text{중앙값} &= \dfrac{26 + 30}{2} \ &= \dfrac{56}{2} \ &= 28\text{살} \end{aligned}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 학생 $8$명이 체력 검사에서 실시한 턱걸이 횟수를 조사한 자료이다. 이 자료에 대한 설명 중 옳지 않은 것은? [5점] (단위: 회)


$$8, 5, 11, 7, 13, 6, 9, 5$$

**보기** ① 평균은 $8$회이다.  ② 편차의 제곱의 합은 $58$이다.  ③ 분산은 $\dfrac{29}{4}$이다.  ④ 평균보다 큰 값의 변량은 $4$개이다.  ⑤ 표준편차는 $\dfrac{\sqrt{29}}{2}$회이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 학생 $8$명의 턱걸이 횟수의 총합은 $58$이며 평균을 구하면 $7$회이다.
2. 각 편차의 제곱의 평균을 계산하여 분산과 표준편차를 구한다.
3. 설명 중 옳지 않은 보기를 확인하면 분산 계산이 틀린 ④번이 옳지 않다. 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 학생 $8$명이 체력 검사에서 실시한 턱걸이 횟수를 조사한 자료이다.」
**RPM** M3-RPM-084 [통계 > 대푯값과 산포도 > 산포도 > 분산] **원천→판정: 통계 > 대푯값과 산포도 > 산포도 > 분산과 표준편차의 계산 → 통계 > 대푯값과 산포도 > 산포도 > 분산**
- 이유: 분산과 표준편차의 계산을 다루는 RPM 유형이다. (문항 토큰 11)
**유형** PT=PT_M3_VARIANCE / TPL=NONE **원천→판정: PT_M3_VARIANCE_PROPERTY_AUDIT → PT_M3_VARIANCE** **원천→판정: TPL_M3_STATISTICS_MULTI_CLAIM_AUDIT → NONE**
- 이유: 변량 자료에서 평균, 분산, 표준편차의 종합 성질을 판별하는 유형이다. (문항 토큰 11)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평균과 분산의 다단계 검산이 필요한 난이도 2 문항이다. (문항 토큰 11)

**4칸**
- given: 횟수←stem:「다음은 학생 $8$명이 체력 검사에서 실시한 턱걸이 횟수를 조사한 자료이다.」
- goal: 자료←stem:「이 자료에 대한 설명 중 옳지 않은 것은?」
- method: 검증(NAMED)←solution:「평균, 편차, 분산, 표준편차를 순차적으로 계산하고 각 보기를 검증한다.」
- condition: (없음)

**how** 평균, 편차, 분산, 표준편차의 정의를 각각 계산하여 설명의 참·거짓을 검증하였다. (문항 토큰 11)

<details><summary>저장 해설 (판정 검토용)</summary>

평균, 편차, 분산, 표준편차를 순차적으로 계산하고 각 보기를 검증한다.


1단계: $8$개 자료의 총합은 다음과 같다. $$8 + 5 + 11 + 7 + 13 + 6 + 9 + 5 = 64$$ 따라서 평균은 다음과 같다. $$\text{평균} = \dfrac{64}{8} = 8\text{회} \quad (\text{① 참})$$


2단계: 평균 $8$회보다 큰 값을 갖는 변량을 찾으면 다음과 같다. $$9, 11, 13$$ 따라서 평균보다 큰 값의 변량은 $3$개이다. 그러므로 '$4$개이다'라고 한 ④는 옳지 않다. (④ 거짓)


3단계: 각 변량의 편차(변량 - 평균)를 구하면 각각 다음과 같다. $$0, -3, 3, -1, 5, -2, 1, -3$$ 편차의 제곱의 합을 구하면 다음과 같다. $$\begin{aligned} \text{편차제곱합} &= 0^2 + (-3)^2 + 3^2 + (-1)^2 + 5^2 + (-2)^2 + 1^2 + (-3)^2 \ &= 0 + 9 + 9 + 1 + 25 + 4 + 1 + 9 \ &= 58 \quad (\text{② 참}) \end{aligned}$$


4단계: 분산과 표준편차를 구하면 다음과 같다. $$\begin{aligned} \text{분산} &= \dfrac{58}{8} = \dfrac{29}{4} \quad (\text{③ 참}) \ \text{표준편차} &= \sqrt{\dfrac{29}{4}} = \dfrac{\sqrt{29}}{2}\text{회} \quad (\text{⑤ 참}) \end{aligned}$$ 따라서 옳지 않은 것은 ④이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 표는 어느 치과에서 환자 $5$명의 접수 후 대기 시간에 대한 편차를 조사하여 나타낸 것이다. 대기 시간의 평균이 $16$분일 때, 환자 B의 대기 시간을 구하면? [4점]


환자
  A
  B
  C
  D
  E
  편차(분)
  $8$
  $x$
  $4$
  $-6$
  $-3$

**보기** ① $9$분  ② $10$분  ③ $11$분  ④ $12$분  ⑤ $13$분

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 편차의 총합은 항상 $0$이므로 $(-3) + 2 + x + (-1) + 4 = 0$에서 $x + 2 = 0 \implies x = -2$이다.
2. 대기 시간의 평균이 $16$분이므로 학생 $C$의 대기 시간은 $16 + (-2) = 14$분이다. 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 표는 어느 치과에서 환자 $5$명의 접수 후 대기 시간에

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 표는 어느 치과에서 환자 $5$명의 접수 후 대기 시간에 대한 편차를 조사하여 나타낸 것이다.」
**RPM** M3-RPM-083 [통계 > 대푯값과 산포도 > 산포도 > 편차] **원천→판정: 통계 > 대푯값과 산포도 > 산포도 > 편차의 성질 → 통계 > 대푯값과 산포도 > 산포도 > 편차**
- 이유: 편차의 총합 성질을 다루는 RPM 유형이다. (문항 토큰 16)
**유형** PT=PT_M3_DISPERSION_DEVIATION_PROPERTIES / TPL=TPL_M3_DISPERSION_DEVIATION_PROPERTIES_ZERO_SUM **원천→판정: PT_M3_DEVIATION_SUM_ZERO → PT_M3_DISPERSION_DEVIATION_PROPERTIES** **원천→판정: TPL_M3_DEVIATION_TABLE_VARIABLE_RECOVERY → TPL_M3_DISPERSION_DEVIATION_PROPERTIES_ZERO_SUM**
- 이유: 편차의 성질(합=0)을 이용하여 특정 변량의 값을 복원하는 유형이다. (문항 토큰 16)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 편차의 총합 성질을 단순 대입하는 난이도 1 문항이다. (문항 토큰 16)

**4칸**
- given: 편차←stem:「다음 표는 어느 치과에서 환자 $5$명의 접수 후 대기 시간에 대한 편차를 조사하여 나타낸 것이다.」
- goal: 평균←stem:「대기 시간의 평균이 $16$분일 때, 환자 B의 대기 시간을 구하면?」
- method: 지수(NAMED)←solution:「편차의 총합은 항상 $0$이라는 성질을 이용하여 미지수 $x$를 구한다.」
- condition: (없음)

**how** 편차의 합이 0임을 이용하여 미지수 편차를 구하고 평균을 더해 실제 변량을 도출하였다. (문항 토큰 16)

<details><summary>저장 해설 (판정 검토용)</summary>

편차의 총합은 항상 $0$이라는 성질을 이용하여 미지수 $x$를 구한다.


1단계: 편차의 합은 항상 $0$이므로 다음 등식이 성립한다. $$\begin{aligned} 8 + x + 4 + (-6) + (-3) &= 0 \ x + 3 &= 0 \ x &= -3\text{분} \end{aligned}$$ 따라서 환자 B의 편차는 $-3$분이다.


2단계: 편차의 정의는 (변량) - (평균)이므로 $$\text{변량} = \text{평균} + \text{편차}$$ 대기 시간의 평균이 $16$분이므로 환자 B의 대기 시간은 다음과 같다. $$\begin{aligned} \text{B의 대기 시간} &= 16 + (-3) \ &= 13\text{분} \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

다음 두 조건을 모두 만족시키는 상수 $a, b$에 대하여 $a + b$의 값은? [4점]


• (가) $5$개의 변량 $6, 9, 14, 16, a$의 중앙값은 $9$이다. • (나) $5$개의 변량 $3, 16, a, b, 15$의 중앙값은 $13$이고, 평균은 $b - 2$이다.

**보기** ① $21$  ② $22$  ③ $23$  ④ $24$  ⑤ $25$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (가)에서 $5$개의 변량의 중앙값이 $14$이고 평균이 $15$이므로 총합은 $75$이다. $a$를 구하면 $a = 16$이다.
2. (나)에서 $6$개의 변량의 중앙값 조건을 적용하여 $b$를 구하면 $b = 5$이다.
3. 따라서 $a + b = 16 + 5 = 21$이므로 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 두 조건을 모두 만족시키는 상수 $a, b$에 대하여 $a + b$의 값은?」
**RPM** M3-RPM-081 [통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 중앙값과 평균의 연립 추론 → 통계 > 대푯값과 산포도 > 대푯값 > 평균·중앙값·최빈값**
- 이유: 평균과 중앙값 조건으로 미지수를 추론하는 RPM 유형이다. (문항 토큰 14)
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_DETERMINE_UNKNOWN_FROM_MEAN_AND_MEDIAN_CONDITIONS **원천→판정: PT_M3_DUAL_CONDITION_MEDIAN_MEAN → PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE** **원천→판정: TPL_M3_TWO_DATASET_MEDIAN_RANK_INFERENCE → TPL_M3_DETERMINE_UNKNOWN_FROM_MEAN_AND_MEDIAN_CONDITIONS**
- 이유: 두 자료에서 중앙값과 평균을 연립하여 상수를 추론하는 유형이다. (문항 토큰 14)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 두 개의 대푯값 조건을 순차 해결하는 난이도 2 문항이다. (문항 토큰 14)

**4칸**
- given: 상수←stem:「다음 두 조건을 모두 만족시키는 상수 $a, b$에 대하여 $a + b$의 값은?」
- goal: 중앙값←stem:「• (가) $5$개의 변량 $6, 9, 14, 16, a$의 중앙값은 $9$이다.」
- method: 연립(NAMED)←solution:「중앙값의 순위 조건과 평균의 정의를 연립하여 $a, b$를 구한다.」
- condition: (없음)

**how** 두 자료의 중앙값과 평균 조건을 각각 연립하여 미정 상수를 도출하였다. (문항 토큰 14)

<details><summary>저장 해설 (판정 검토용)</summary>

중앙값의 순위 조건과 평균의 정의를 연립하여 $a, b$를 구한다.


1단계: 조건 (가)에서 $a$를 제외한 $4$개의 자료는 $6, 9, 14, 16$이다. $5$개 자료의 중앙값이 $9$가 되려면 자료를 크기순으로 나열했을 때 $3$번째 자료가 $9$이어야 한다. 이미 $9$보다 큰 자료가 $14, 16$의 $2$개 있으므로, $a$는 $9$ 이하이어야 한다. $$a \le 9$$


2단계: 조건 (나)의 자료는 $3, 16, a, b, 15$이다. $a \le 9$이므로 $5$개의 자료 중 $3, a$는 $13$보다 작고, $15, 16$은 $13$보다 크다. 따라서 $5$개 자료의 정중앙인 $3$번째 자료는 반드시 $b$이어야 한다. 중앙값이 $13$이라고 하였으므로 $$b = 13$$


3단계: 조건 (나)에서 평균은 $b - 2 = 13 - 2 = 11$이다. $5$개 자료의 총합은 다음과 같다. $$\text{총합} = 11 \times 5 = 55$$ 따라서 다음 일차방정식이 성립한다. $$\begin{aligned} 3 + 16 + a + 13 + 15 &= 55 \ a + 47 &= 55 \ a &= 8 \end{aligned}$$ $a = 8$은 $a \le 9$를 만족한다.


4단계: 따라서 구하고자 하는 $a + b$의 값은 다음과 같다. $$\begin{aligned} a + b &= 8 + 13 \ &= 21 \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

※ 다음 산점도는 학생 $15$명의 국어 수행평가에서 말하기 점수($x$점)와 쓰기 점수($y$점)를 각각 $10$점 만점으로 조사하여 나타낸 것이다. [18-19]


• 산점도의 점 $(x, y)$ $15$개: $(4, 5), (5, 6), (6, 5), (6, 7), (7, 6), (7, 7), (7, 8), (7, 8),$ $(8, 6), (8, 7), (8, 8), (8, 9), (9, 8), (9, 9), (10, 9)$


위 산점도에서 쓰기 점수($y$점)의 최빈값을 구하면? [4점]

**보기** ① $7$점  ② $8$점  ③ $8.5$점  ④ $9$점  ⑤ $10$점

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 산점도에서 각 점의 말하기 점수와 쓰기 점수를 읽어 최빈값을 구한다.
2. 가장 많이 나타난 점수는 $8.5$점으로 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 산점도는 학생 $15$명의 국어 수행평가에서

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「※ 다음 산점도는 학생 $15$명의 국어 수행평가에서 말하기 점수($x$점)와 쓰기 점수($y$점)를 각각 $10$점 만점으로 조사하여 나타낸 것이다.」
**RPM** M3-RPM-088 [통계 > 상관관계 > 산점도 > 산점도 읽기] **원천→판정: 통계 > 상관관계 > 산점도와 상관관계 > 산점도에서의 대푯값 → 통계 > 상관관계 > 산점도 > 산점도 읽기**
- 이유: 18번 문항은 산점도 최빈값 읽기를 다루는 RPM 유형이다. (문항 토큰 15)
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO **원천→판정: PT_M3_SCATTER_PLOT_MODE → PT_M3_SCATTER_PLOT_CORRELATION** **원천→판정: TPL_M3_SCATTER_COORDINATE_FREQUENCY_MODE → TPL_M3_SCATTER_PLOT_READ_POINT_RATIO**
- 이유: 18번 문항은 산점도에서 좌표를 판독하고 대푯값을 구하는 유형이다. (문항 토큰 15)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 18번 산점도 좌표를 정확히 판독하는 난이도 2 문항이다. (문항 토큰 15)

**4칸**
- given: 산점도←stem:「※ 다음 산점도는 학생 $15$명의 국어 수행평가에서 말하기 점수($x$점)와 쓰기 점수($y$점)를 각각 $10$점 만점으로 조사하여 나타낸 것이다.」
- goal: 산점도←stem:「• 산점도의 점 $(x, y)$ $15$개: $(4, 5), (5, 6), (6, 5), (6, 7), (7, 6), (7, 7), (7, 8), (7, 8),$ $(8, 6), (8, 7), (8, 8), (8, 9), (9, 8), (9, 9), (10, 9)$」
- method: 좌표(NAMED)←solution:「산점도의 세로축 좌표(쓰기 점수 $y$)의 빈도를 세어 최빈값을 구한다.」
- condition: (없음)

**how** 18번 산점도에 주어진 점들의 좌표를 판독하여 최빈값을 구하였다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

산점도의 세로축 좌표(쓰기 점수 $y$)의 빈도를 세어 최빈값을 구한다.


1단계: 주어진 $15$개의 점에 대하여 쓰기 점수 $y$의 값을 정리하면 다음과 같다. • $y = 5$점: $(4, 5), (6, 5)$ $\implies 2$명 • $y = 6$점: $(5, 6), (7, 6), (8, 6)$ $\implies 3$명 • $y = 7$점: $(6, 7), (7, 7), (8, 7)$ $\implies 3$명 • $y = 8$점: $(7, 8), (7, 8), (8, 8), (9, 8)$ $\implies 4$명 • $y = 9$점: $(8, 9), (9, 9), (10, 9)$ $\implies 3$명


2단계: 학생 수가 가장 많은 점수는 $8$점($4$명)이다. 따라서 쓰기 점수의 최빈값은 $8$점이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[18-19 공통자료] 위 산점도에서 말하기 점수($x$점)와 쓰기 점수($y$점)가 모두 $8$점 이상인 학생은 몇 명인가? [4점]

**보기** ① $2$명  ② $3$명  ③ $4$명  ④ $5$명  ⑤ $6$명

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 말하기 점수 $x \ge 8$이고 쓰기 점수 $y \ge 8$인 영역의 점을 센다.
2. 조건을 동시에 만족하는 점은 $(8, 8), (8, 9), (9, 9), (9, 10)$ 등의 $5$명이다.
3. 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 위 산점도에서 말하기 점수($x$점)와 쓰기 점수($y$점)가

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「[18-19 공통자료] 위 산점도에서 말하기 점수($x$점)와 쓰기 점수($y$점)가 모두 $8$점 이상인 학생은 몇 명인가?」
**RPM** M3-RPM-088 [통계 > 상관관계 > 산점도 > 산점도 읽기] **원천→판정: 통계 > 상관관계 > 산점도와 상관관계 > 산점도에서의 영역별 빈도 해석 → 통계 > 상관관계 > 산점도 > 산점도 읽기**
- 이유: 19번 문항은 산점도 영역 개수 세기를 다루는 RPM 유형이다. (문항 토큰 18)
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO **원천→판정: PT_M3_SCATTER_PLOT_INEQUALITY_COUNT → PT_M3_SCATTER_PLOT_CORRELATION** **원천→판정: TPL_M3_SCATTER_TWO_VARIABLE_THRESHOLD_COUNT → TPL_M3_SCATTER_PLOT_READ_POINT_RATIO**
- 이유: 19번 문항은 산점도의 영역별 조건을 만족하는 자료의 개수를 파악하는 유형이다. (문항 토큰 18)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 19번 직선 경계 기준 점 개수를 세는 난이도 2 문항이다. (문항 토큰 18)

**4칸**
- given: 자료←stem:「[18-19 공통자료] 위 산점도에서 말하기 점수($x$점)와 쓰기 점수($y$점)가 모두 $8$점 이상인 학생은 몇 명인가?」
- goal: 부등식←solution:「산점도에서 영역 부등식 $x \ge 8$과 $y \ge 8$을 동시에 만족하는 점의 개수를 센다.」
- method: 나머지(NAMED)←solution:「2단계: 나머지 점들을 확인하면 다음과 같다.」
- condition: (없음)

**how** 19번 산점도에서 두 변수 부등식 영역을 만족하는 점의 개수를 카운팅하였다. (문항 토큰 18)

<details><summary>저장 해설 (판정 검토용)</summary>

산점도에서 영역 부등식 $x \ge 8$과 $y \ge 8$을 동시에 만족하는 점의 개수를 센다.


1단계: 주어진 $15$개의 점 $(x, y)$ 중 $x \ge 8$이고 $y \ge 8$인 점을 찾는다. • $(8, 8)$: $x = 8 \ge 8, y = 8 \ge 8$ (만족) • $(8, 9)$: $x = 8 \ge 8, y = 9 \ge 8$ (만족) • $(9, 8)$: $x = 9 \ge 8, y = 8 \ge 8$ (만족) • $(9, 9)$: $x = 9 \ge 8, y = 9 \ge 8$ (만족) • $(10, 9)$: $x = 10 \ge 8, y = 9 \ge 8$ (만족)


2단계: 나머지 점들을 확인하면 다음과 같다. • $(8, 6), (8, 7)$은 $y < 8$이므로 만족하지 않는다. • $x < 8$인 나머지 점들은 모두 조건을 만족하지 않는다.


따라서 두 점수가 모두 $8$점 이상인 학생은 정확히 $5$명이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

다음 산점도는 학생 $15$명의 음악 실기 점수($x$점)와 미술 실기 점수($y$점)를 조사하여 나타낸 것이다. 음악 점수보다 미술 점수가 더 높은 학생의 비율은? [4점]


• 산점도의 점 $(x, y)$ $15$개: $(5, 6), (6, 5), (6, 7), (7, 6), (7, 7), (7, 8), (8, 6), (8, 7),$ $(8, 8), (8, 9), (9, 7), (9, 9), (9, 10), (10, 8), (10, 10)$

**보기** ① $\dfrac{1}{5}$  ② $\dfrac{4}{15}$  ③ $\dfrac{1}{3}$  ④ $\dfrac{2}{5}$  ⑤ $\dfrac{7}{15}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 음악 점수 $x$보다 미술 점수 $y$가 더 높다는 것은 $y > x$를 만족하는 점이다.
2. 기준선 $y = x$의 위쪽에 위치한 점은 총 $15$명 중 $5$명이다.
3. 비율은 $\dfrac{5}{15} = \dfrac{1}{3} = 33.3\%$이다. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 산점도는 학생 $15$명의 음악 실기 점수($x$점)와

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 산점도는 학생 $15$명의 음악 실기 점수($x$점)와 미술 실기 점수($y$점)를 조사하여 나타낸 것이다.」
**RPM** M3-RPM-088 [통계 > 상관관계 > 산점도 > 산점도 읽기] **원천→판정: 통계 > 상관관계 > 산점도와 상관관계 > 산점도에서의 비율 계산 → 통계 > 상관관계 > 산점도 > 산점도 읽기**
- 이유: 산점도 읽기와 비율 계산을 다루는 RPM 유형이다. (문항 토큰 15)
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO **원천→판정: PT_M3_SCATTER_DIAGONAL_RATIO → PT_M3_SCATTER_PLOT_CORRELATION** **원천→판정: TPL_M3_SCATTER_Y_GREATER_THAN_X_PROPORTION → TPL_M3_SCATTER_PLOT_READ_POINT_RATIO**
- 이유: 산점도에서 직선 기준 특정 조건을 만족하는 대상의 비율을 계산하는 유형이다. (문항 토큰 15)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대각선 기준 영역 판정 및 비율 계산 난이도 2 문항이다. (문항 토큰 15)

**4칸**
- given: 산점도←stem:「다음 산점도는 학생 $15$명의 음악 실기 점수($x$점)와 미술 실기 점수($y$점)를 조사하여 나타낸 것이다.」
- goal: 비율←stem:「음악 점수보다 미술 점수가 더 높은 학생의 비율은?」
- method: 직선(NAMED)←solution:「산점도에서 직선 $y = x$를 기준으로 위쪽에 위치하는 점의 비율을 구한다.」
- condition: (없음)

**how** 대각선 $y=x$를 기준으로 위쪽 영역의 점의 개수를 전체에 대한 비율로 계산하였다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

산점도에서 직선 $y = x$를 기준으로 위쪽에 위치하는 점의 비율을 구한다.


1단계: 음악 실기 점수를 $x$, 미술 실기 점수를 $y$라 할 때, 음악 점수보다 미술 점수가 더 높다는 조건은 다음과 같다. $$y > x$$ 즉, 산점도에서 기준 직선 $y = x$보다 위쪽에 위치하는 점을 찾으면 된다.


2단계: 주어진 $15$개의 점 중 $y > x$를 만족하는 점은 다음과 같다. • $(6, 7)$: $7 > 6$ • $(7, 8)$: $8 > 7$ • $(8, 9)$: $9 > 8$ • $(9, 10)$: $10 > 9$ • $(6, 8)$... 어, 위 목록 중: $(6, 7) \implies 7 > 6$ (만족) $(7, 8) \implies 8 > 7$ (만족) $(8, 9) \implies 9 > 8$ (만족) $(9, 10) \implies 10 > 9$ (만족) 그 외에 $y > x$인 점이 하나 더 있어야 5명이 된다! 점 목록을 다시 점검하자: $(5, 6), (6, 5), (6, 7), (7, 6), (7, 7), (7, 8), (8, 6), (8, 7), (8, 8), (8, 9), (9, 7), (9, 9), (9, 10), (10, 8), (10, 10)$ 여기서 $y > x$인 점: $(5, 6): 6 > 5$ $(6, 7): 7 > 6$ $(7, 8): 8 > 7$ $(8, 9): 9 > 8$ $(9, 10): 10 > 9$ 정확히 $5$명! 나머지 $10$명: $y = x$: $(7, 7), (8, 8), (9, 9), (10, 10)$ (4명) $y < x$: $(6, 5), (7, 6), (8, 6), (8, 7), (9, 7), (10, 8)$ (6명) 총합 $5 + 4 + 6 = 15$명!


3단계: 전체 학생 수는 $15$명이므로 구하는 비율은 다음과 같다. $$\begin{aligned} \text{비율} &= \dfrac{5}{15} \ &= \dfrac{1}{3} \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

서술형1. 다음 그림과 같이 한 변의 길이가 $12\rm,cm$인 정사각형 $ABCD$에서 원 $O$가 두 변 $AB, AD$에 접하고 나머지 두 변 $BC, DC$와 각각 두 점에서 만난다. 원 $O$와 변 $\overline{BC}$의 두 교점을 $P, Q$라 하자. $\overline{BP} = 2\rm,cm, \overline{PC} = 10\rm,cm$일 때, 선분 $\overline{PQ}$의 길이를 구하는 과정과 답을 서술하시오. (7점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $24 - 8\sqrt{3}\rm,cm$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정사각형의 한 변의 길이는 $12\rm\,cm$이다.
2. 원의 반지름 $r$과 현의 길이를 피타고라스 정리와 연립하여 계산한다.
3. 선분 $\overline{PQ}$의 길이는 $24 - 8\sqrt{3}\rm\,cm$이다.
- 작성자 답: $24 - 8\sqrt{3}\rm,cm$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 한 변의 길이가 $12\rm,cm$인 정사각형

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 한 변의 길이가 $12\rm,cm$인 정사각형 $ABCD$에서 원 $O$가 두 변 $AB, AD$에 접하고 나머지 두 변 $BC, DC$와 각각 두 점에서 만난다.」
**RPM** M3-RPM-072 [원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기] **원천→판정: 기하 > 원의 성질 > 원과 직선 > 원의 접선과 현의 길이의 종합 활용 → 원의 성질 > 원과 직선 > 원의 접선 > 접선 조건으로 길이 구하기**
- 이유: 접선 조건으로 길이를 구하는 원과 직선 RPM 유형이다. (문항 토큰 12)
**유형** PT=PT_CIRCLE_TANGENT / TPL=TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE **원천→판정: PT_M3_SQUARE_INSCRIBED_SECANT_CHORD → PT_CIRCLE_TANGENT** **원천→판정: TPL_M3_SQUARE_TANGENT_SECANT_QUADRATIC → TPL_CIRCLE_TANGENT_RIGHT_TRIANGLE**
- 이유: 정사각형과 원의 접선, 현의 길이를 결합한 복합 서술형 유형이다. (문항 토큰 12)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 좌표 설정과 피타고라스 연립이 필요한 서술형 난이도 3 문항이다. (문항 토큰 12)

**4칸**
- given: 나머지←stem:「다음 그림과 같이 한 변의 길이가 $12\rm,cm$인 정사각형 $ABCD$에서 원 $O$가 두 변 $AB, AD$에 접하고 나머지 두 변 $BC, DC$와 각각 두 점에서 만난다.」
- goal: 교점←stem:「원 $O$와 변 $\overline{BC}$의 두 교점을 $P, Q$라 하자.」
- method: 연립(NAMED)←solution:「정사각형의 접선 성질과 현의 수직이등분 성질을 직각삼각형 피타고라스 정리와 연립하여 서술한다.」
- condition: (없음)

**how** 정사각형 안에서 원의 접선 성질과 현의 수직이등분을 피타고라스 정리로 연립하여 길이를 서술하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

정사각형의 접선 성질과 현의 수직이등분 성질을 직각삼각형 피타고라스 정리와 연립하여 서술한다.


1단계: 정사각형 $ABCD$의 한 변의 길이는 $\overline{BC} = \overline{BP} + \overline{PC} = 2 + 10 = 12\rm,cm$이다. 원 $O$의 반지름의 길이를 $r\rm,cm$라 하고, 원의 중심 $O$에서 현 $\overline{PQ}$에 내린 수선의 발을 $M$이라 하자.


2단계: 원 $O$가 정사각형의 두 변 $\overline{AB}, \overline{AD}$에 접하므로 원의 중심 $O$의 좌표를 점 $B$를 원점으로 하여 잡으면 $O(r, 12 - r)$이다. 따라서 $\overline{BM} = r$이고, 중심 $O$에서 변 $\overline{BC}$까지의 거리는 $\overline{OM} = 12 - r$이다. 점 $P$에 대하여 $\overline{BP} = 2$이므로 선분 $\overline{PM}$의 길이는 다음과 같다. $$\overline{PM} = \overline{BM} - \overline{BP} = r - 2$$


3단계: 점 $P$는 원 $O$ 위의 점이므로 $\overline{OP} = r$이다. 직각삼각형 $OMP$에서 피타고라스 정리에 의하여 $$\begin{aligned} \overline{OP}^2 &= \overline{OM}^2 + \overline{PM}^2 \ r^2 &= (12 - r)^2 + (r - 2)^2 \ r^2 &= (144 - 24r + r^2) + (r^2 - 4r + 4) \ r^2 &= 2r^2 - 28r + 148 \ r^2 - 28r + 148 &= 0 \end{aligned}$$ 근의 공식에 의하여 $r$의 값을 구하면 $$\begin{aligned} r &= -(-14) \pm \sqrt{(-14)^2 - 148} \ &= 14 \pm \sqrt{196 - 148} \ &= 14 \pm \sqrt{48} \ &= 14 \pm 4\sqrt{3} \end{aligned}$$ 원의 반지름 $r$은 정사각형의 한 변의 길이($12\rm,cm$)보다 작아야 하므로 $$r = 14 - 4\sqrt{3}\rm,cm$$


4단계: 원의 중심에서 현에 내린 수선은 그 현을 이등분하므로 점 $M$은 현 $\overline{PQ}$의 중점이다. 따라서 $\overline{PQ}$의 길이는 다음과 같다. $$\begin{aligned} \overline{PQ} &= 2 \times \overline{PM} \ &= 2(r - 2) \ &= 2((14 - 4\sqrt{3}) - 2) \ &= 2(12 - 4\sqrt{3}) \ &= 24 - 8\sqrt{3}\rm,cm \end{aligned}$$ 따라서 구하는 선분 $\overline{PQ}$의 길이는 $24 - 8\sqrt{3}\rm,cm$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

서술형2. 다음 그림과 같이 원 $O$ 위의 네 점 $A, B, C, D$에 대하여 호의 길이가 $\wideparen{AB} = \wideparen{BC} = \wideparen{CD}$이다. 두 선분 $\overline{AB}$와 $\overline{DC}$의 연장선의 교점을 $E$라 할 때 $\angle E = 36^\circ$이다. 두 현 $\overline{AC}$와 $\overline{BD}$의 교점을 $F$라 할 때, $\angle AFD$의 크기를 구하는 과정과 답을 서술하시오. (6점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $72^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 호의 길이가 같으므로 이에 대한 원주각을 각각 $x^\circ$라 한다.
2. 삼각형의 외각과 연장선 교각 $36^\circ$의 관계식을 세워 $x$를 구한다.
3. 교각 $\angle AFD = 72^\circ$로 계산된다.
- 작성자 답: $72^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원 $O$ 위의 네 점 $A, B, C, D$에 대하여

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원 $O$ 위의 네 점 $A, B, C, D$에 대하여 호의 길이가 $\wideparen{AB} = \wideparen{BC} = \wideparen{CD}$이다.」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] **원천→판정: 기하 > 원의 성질 > 원주각 > 원주각과 현의 연장선의 교각 → 원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각**
- 이유: 중심각과 원주각의 성질을 다루는 RPM 유형이다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC **원천→판정: PT_M3_EQUAL_CHORD_EXTERIOR_ANGLE → PT_CIRCLE_ANGLE_RELATIONS** **원천→판정: TPL_M3_CONSECUTIVE_EQUAL_ARCS_INTERSECTION → TPL_CIRCLE_ANGLE_CENTER_ARC**
- 이유: 원주각의 성질과 현의 연장선 교각을 연계하는 서술형 유형이다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원주각과 삼각형 외각 방정식을 세우는 서술형 난이도 3 문항이다. (문항 토큰 AB)

**4칸**
- given: 길이←stem:「다음 그림과 같이 원 $O$ 위의 네 점 $A, B, C, D$에 대하여 호의 길이가 $\wideparen{AB} = \wideparen{BC} = \wideparen{CD}$이다.」
- goal: 선분←stem:「두 선분 $\overline{AB}$와 $\overline{DC}$의 연장선의 교점을 $E$라 할 때 $\angle E = 36^\circ$이다.」
- method: 중심(NAMED)←solution:「호의 중심각과 원주각의 관계를 미지수로 두고 삼각형의 내각의 합을 이용하여 서술한다.」
- condition: (없음)

**how** 호의 길이에 비례하는 원주각을 미지수로 두고 삼각형 외각 관계로 각의 크기를 서술하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

호의 중심각과 원주각의 관계를 미지수로 두고 삼각형의 내각의 합을 이용하여 서술한다.


1단계: 세 호 $\wideparen{AB}, \wideparen{BC}, \wideparen{CD}$의 길이가 같으므로, 각 호에 대한 원주각의 크기를 각각 $x^\circ$라 하자. 그러면 호에 대한 원주각의 크기에 의하여 $$\begin{aligned} \angle BAC &= \angle CAD = x^\circ \ \angle ADB &= \angle BDC = x^\circ \end{aligned}$$ 호 $\wideparen{BCD}$의 길이는 두 호의 합이므로 호 $\wideparen{BCD}$에 대한 원주각 $\angle BAD = 2x^\circ$이다.


2단계: 세 점 $E, A, B$가 한 직선 위에 있으므로 $$\begin{aligned} \angle EAD &= 180^\circ - \angle BAD \ &= 180^\circ - 2x^\circ \end{aligned}$$ 마찬가지로 세 점 $E, D, C$가 한 직선 위에 있고 호 $\wideparen{ABC}$에 대한 원주각 $\angle ADC = 2x^\circ$이므로 $$\begin{aligned} \angle ADE &= 180^\circ - \angle ADC \ &= 180^\circ - 2x^\circ \end{aligned}$$


3단계: 삼각형 $EAD$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle E + \angle EAD + \angle ADE &= 180^\circ \ 36^\circ + (180^\circ - 2x^\circ) + (180^\circ - 2x^\circ) &= 180^\circ \ 36^\circ + 360^\circ - 4x^\circ &= 180^\circ \ 4x &= 216 \ x &= 54 \end{aligned}$$ 따라서 한 호에 대한 원주각의 크기는 $54^\circ$이다.


4단계: 삼각형 $AFD$에서 $$\angle FAD = \angle CAD = x^\circ = 54^\circ, \quad \angle FDA = \angle BDA = x^\circ = 54^\circ$$ 삼각형 $AFD$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle AFD &= 180^\circ - (\angle FAD + \angle FDA) \ &= 180^\circ - (54^\circ + 54^\circ) \ &= 180^\circ - 108^\circ \ &= 72^\circ \end{aligned}$$ 따라서 구하는 각 $\angle AFD$의 크기는 $72^\circ$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

서술형3. 양수 $a$에 대하여 다음 $5$개의 자료의 분산이 $6$일 때, 이 자료의 평균을 구하는 과정과 답을 서술하시오. (7점)


$$2, 2a, a-2, a+5, a$$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $2 + \sqrt{2}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\begin{aligned} \text{총합} &= 5a + 5 \end{aligned}$이므로 평균은 $a+1$이다.
2. 각 편차의 제곱의 평균이 $6$임을 이용하여 $a$의 방정식을 세우면 $(a-1)^2 = 2$에서 양수 $a = 1 + \sqrt{2}$이다.
3. 따라서 평균은 $a + 1 = 2 + \sqrt{2}$이다.
- 작성자 답: $2 + \sqrt{2}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「양수 $a$에 대하여 다음 $5$개의 자료의 분산이 $6$일 때, 이 자료의 평균을 구하는 과정과 답을 서술하시오.」
**RPM** M3-RPM-084 [통계 > 대푯값과 산포도 > 산포도 > 분산] **원천→판정: 통계 > 대푯값과 산포도 > 산포도 > 분산의 계산과 식의 값 → 통계 > 대푯값과 산포도 > 산포도 > 분산**
- 이유: 분산의 계산과 식의 값을 다루는 RPM 유형이다. (문항 토큰 aligned)
**유형** PT=PT_M3_VARIANCE / TPL=NONE **원천→판정: PT_M3_VARIANCE_ALGEBRAIC_VARIABLE → PT_M3_VARIANCE** **원천→판정: TPL_M3_VARIANCE_QUADRATIC_RECOVERY_MEAN → NONE**
- 이유: 분산 조건으로부터 미지수 변량을 구하고 평균을 도출하는 서술형 유형이다. (문항 토큰 aligned)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이차방정식과 무리수 계산이 결합된 서술형 난이도 3 문항이다. (문항 토큰 aligned)

**4칸**
- given: 분산←stem:「양수 $a$에 대하여 다음 $5$개의 자료의 분산이 $6$일 때, 이 자료의 평균을 구하는 과정과 답을 서술하시오.」
- goal: 분산←solution:「평균을 미지수 $a$로 나타내고 각 변량의 편차를 구하여 분산 공식으로 $a$를 구한다.」
- method: 자료(NAMED)←solution:「1단계: 주어진 $5$개의 자료 $2, 2a, a-2, a+5, a$의 총합을 구하면 다음과 같다.」
- condition: (없음)

**how** 미지수를 포함한 변량의 평균과 편차를 구하고 분산 정의식으로 미지수를 도출하여 평균을 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

평균을 미지수 $a$로 나타내고 각 변량의 편차를 구하여 분산 공식으로 $a$를 구한다.


1단계: 주어진 $5$개의 자료 $2, 2a, a-2, a+5, a$의 총합을 구하면 다음과 같다. $$\begin{aligned} \text{총합} &= 2 + 2a + (a - 2) + (a + 5) + a \ &= 5a + 5 \end{aligned}$$ 따라서 자료의 평균은 다음과 같다. $$\begin{aligned} m &= \dfrac{5a + 5}{5} \ &= a + 1 \end{aligned}$$


2단계: 평균 $a + 1$에 대한 각 변량의 편차(변량 - 평균)를 구하면 다음과 같다. $$\begin{aligned} 2 - (a + 1) &= 1 - a \ 2a - (a + 1) &= a - 1 \ (a - 2) - (a + 1) &= -3 \ (a + 5) - (a + 1) &= 4 \ a - (a + 1) &= -1 \end{aligned}$$


3단계: 편차의 제곱의 합을 구하면 다음과 같다. $$\begin{aligned} \text{편차제곱합} &= (1 - a)^2 + (a - 1)^2 + (-3)^2 + 4^2 + (-1)^2 \ &= (a - 1)^2 + (a - 1)^2 + 9 + 16 + 1 \ &= 2(a - 1)^2 + 26 \end{aligned}$$


4단계: 자료의 분산이 $6$이므로 분산 공식에 대입하면 다음과 같다. $$\begin{aligned} \dfrac{2(a - 1)^2 + 26}{5} &= 6 \ 2(a - 1)^2 + 26 &= 30 \ 2(a - 1)^2 &= 4 \ (a - 1)^2 &= 2 \ a - 1 &= \pm\sqrt{2} \ a &= 1 \pm \sqrt{2} \end{aligned}$$ 조건에서 $a$는 양수이고 $1 - \sqrt{2} < 0$이므로 $$a = 1 + \sqrt{2}$$


5단계: 따라서 구하고자 하는 자료의 평균은 다음과 같다. $$\begin{aligned} \text{평균} &= a + 1 \ &= (1 + \sqrt{2}) + 1 \ &= 2 + \sqrt{2} \end{aligned}$$ 따라서 구하는 평균은 $2 + \sqrt{2}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
