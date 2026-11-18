# 검수 묶음 — 26_신흥중_2학기_중간_중2_유사

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 23개 / 검사 PASS 23, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 22, SELF_CONTAINED 1
- 난이도 분포: 1단계 13, 2단계 7, 3단계 2, 4단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q2**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q4**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q5**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q6**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q7**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q8**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q9**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q10**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q11**: 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)
- **Q12**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q13**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q14**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q17**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q18**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q19**: 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)
- **Q20**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)
- **Q21**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q22**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q23**: 원천 값과 다른 칸 3개 (RPM, PT, TPL)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 $\overline{BC}$의 교점을 $D$라 하자. $\angle BAD = 35^\circ$일 때, $\angle C$의 크기는? [3점]

**보기** ① $50^\circ$  ② $55^\circ$  ③ $60^\circ$  ④ $65^\circ$  ⑤ $70^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 선분 AD가 각 A의 이등분선이고 각 BAD = 35도이므로 각 A = 2 * 35도 = 70도이다.
2. 삼각형 ABC는 AB = AC 인 이등변삼각형이므로 두 밑각의 크기는 서로 같다 (각 B = 각 C).
3. 삼각형의 세 내각의 합은 180도이므로 각 C = (180도 - 70도) / 2 = 110도 / 2 = 55도이다.
4. 따라서 각 C의 크기는 55도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「e{AC}$인 이등변삼각형 $ABC$에서」
**RPM** M2-RPM-178 [삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각] **원천→판정: 도형의 성질 > 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 → 삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각**
- 이유: 이등변삼각형에서 꼭지각 70도와 내각 합 180도를 이용하여 밑각 55도를 구하는 풀이 단계이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_VERTEX_BISECTOR **원천→판정: PT_M2_ISOSCELES_ANGLE → PT_ISOSCELES_TRIANGLE** **원천→판정: TPL_ISOSCELES_ANGLE_BISECTOR → TPL_ISOSCELES_VERTEX_BISECTOR**
- 이유: 이등분선 각 35도에서 꼭지각 70도를 구하고 밑각 크기 55도를 도출하는 이등변삼각형 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 꼭지각 35도의 2배인 70도와 180도 내각 합 공식을 직접 적용하는 기본 난이도 1 문항이다.

**4칸**
- given: 이등변삼각형←stem:「e{AC}$인 이등변삼각형 $ABC$에서」
- goal: 이등분선←stem:「gle A$의 이등분선과 $\over」
- method: 내각(NAMED)←solution:「삼각형의 세 내각의 크기의 합은」
- condition: (없음)

**how** 각 BAD = 35도에서 각 A = 70도, 이등변삼각형 밑각 공식으로 각 C = 55도임을 구해 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

선분 $AD$가 $\angle A$의 이등분선이므로
$$
\angle A = 2 \times 35^\circ = 70^\circ
$$
이등변삼각형 $ABC$에서 $\overline{AB} = \overline{AC}$이므로 두 밑각의 크기는 서로 같다.
$$
\angle B = \angle C
$$
삼각형의 세 내각의 크기의 합은 $180^\circ$이므로
$$
\angle C = \frac{180^\circ - 70^\circ}{2} = \frac{110^\circ}{2} = 55^\circ
$$
따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

사각형 $ABCD$와 사각형 $EFGH$가 서로 닮은 도형이고, 대응하는 변의 길이의 비는 $\overline{AB} : \overline{EF} = 3 : 4$이다. $\overline{BC} = 15\text{ cm}$일 때, 변 $BC$에 대응하는 변 $FG$의 길이는? [3점]

**보기** ① $16\text{ cm}$  ② $17\text{ cm}$  ③ $18\text{ cm}$  ④ $20\text{ cm}$  ⑤ $22\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 닮은 두 사각형 ABCD 와 EFGH 에서 대응변의 길이의 비는 3 : 4 로 일정하다.
2. 선분 AB : EF = BC : FG 이므로 3 : 4 = 15 : FG 이 성립한다.
3. 3 * FG = 4 * 15 = 60 이므로 FG = 20 cm 이다.
4. 따라서 변 FG의 길이는 20 cm 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-SIMILARITY_BASIC → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「GH$가 서로 닮은 도형이고, 대」
**RPM** M2-RPM-202 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비] **원천→판정: 도형의 닮음 > 도형의 닮음 > 닮은 도형 > 평면도형에서의 닮음의 성질 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비**
- 이유: 닮음비 3:4 와 BC = 15 cm 로부터 60 을 이용해 대응변 FG = 20 cm 를 구하는 단계이다.
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_RATIO **원천→판정: PT_M2_SIMILARITY_RATIO_SIDES → PT_SIMILAR_FIGURES** **원천→판정: TPL_POLYGON_SIMILARITY_SIDE_LENGTH → TPL_SIMILAR_FIGURES_RATIO**
- 이유: 두 닮은 사각형의 닮음비 3:4 를 적용하여 대응변 15 cm 로부터 20 cm 를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 비례식 3 : 4 = 15 : FG 에서 FG = 20 cm 를 직접 계산하는 기본 난이도 1 문항이다.

**4칸**
- given: 도형←stem:「가 서로 닮은 도형이고, 대응하는」
- goal: 길이←stem:「대응하는 변의 길이의 비는 $\o」
- method: 대입(NAMED)←solution:「주어진 값을 대입하면 $$ 3」
- condition: (없음)

**how** 닮음비 3 : 4 = 15 : FG 에서 3 * FG = 60 이므로 FG = 20 cm 로 ④를 선택했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 닮은 사각형 $ABCD$와 $EFGH$에서 대응하는 변의 길이의 비는 일정하다.
$$
\overline{AB} : \overline{EF} = \overline{BC} : \overline{FG}
$$
주어진 값을 대입하면
$$
3 : 4 = 15 : \overline{FG}
$$
외항의 곱과 내항의 곱은 같으므로
$$
3 \times \overline{FG} = 4 \times 15 = 60
$$
$$
\overline{FG} = 20\text{ (cm)}
$$
따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

평행사변형 $ABCD$에서 이웃하는 두 내각의 크기의 비가 $\angle B : \angle C = 2 : 3$일 때, $\angle A$의 크기는? [3점]

**보기** ① $108^\circ$  ② $112^\circ$  ③ $116^\circ$  ④ $120^\circ$  ⑤ $124^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 ABCD 에서 이웃하는 두 내각의 합은 180도이므로 각 B + 각 C = 180도이다.
2. 각 B : 각 C = 2 : 3 이므로 비례배분에 의해 각 C = 180도 * (3 / 5) = 108도이다.
3. 평행사변형에서 마주 보는 대각의 크기는 서로 같으므로 각 A = 각 C = 108도이다.
4. 따라서 각 A의 크기는 108도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에」
**RPM** M2-RPM-190 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] **원천→판정: 도형의 성질 > 사각형의 성질 > 평행사변형 > 평행사변형의 대각의 성질 → 사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질**
- 이유: 평행사변형의 이웃하는 내각의 합 180도와 대각의 크기가 같음을 이용해 108도를 구하는 단계이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES **원천→판정: PT_M2_PARALLELOGRAM_ANGLES → PT_QUADRILATERAL_PROPERTIES** **원천→판정: TPL_PARALLELOGRAM_ANGLE_RATIO → TPL_QUADRILATERAL_PROPERTIES**
- 이유: 평행사변형 ABCD 에서 이웃하는 두 각의 비 2:3과 대각의 성질로 108도를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 180도 비례배분으로 각 C = 108도와 대각 각 A = 108도를 바로 얻는 난이도 1 문항이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에」
- goal: 내각←stem:「이웃하는 두 내각의 크기의 비가」
- method: 비례배분(NAMED)←solution:「: 3$이므로 비례배분에 의해 $\a」
- condition: (없음)

**how** 이웃각 합 180도와 2:3 비례배분에서 각 C = 108도, 대각 각 A = 108도로 ①을 정답 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형에서 이웃하는 두 내각의 크기의 합은 $180^\circ$이다.
$$
\angle B + \angle C = 180^\circ
$$
$\angle B : \angle C = 2 : 3$이므로 비례배분에 의해 $\angle C$의 크기를 구한다.
$$
\angle C = 180^\circ \times \frac{3}{2 + 3} = 180^\circ \times \frac{3}{5} = 108^\circ
$$
평행사변형에서 마주 보는 두 대각의 크기는 서로 같으므로
$$
\angle A = \angle C = 108^\circ
$$
따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

직사각형 $ABCD$에서 두 대각선의 교점을 $O$라 하자. 대각선 $\overline{BD} = 16\text{ cm}$이고, $\overline{AB} = 10\text{ cm}$일 때, $\triangle OAB$의 둘레의 길이는? [3점]

**보기** ① $22\text{ cm}$  ② $24\text{ cm}$  ③ $26\text{ cm}$  ④ $28\text{ cm}$  ⑤ $30\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직사각형 ABCD 의 두 대각선의 길이는 서로 같고 이등분하므로 AC = BD = 16 cm 이다.
2. 대각선의 교점 O에 대하여 OA = OB = 1/2 * 16 = 8 cm 이다.
3. 변 AB = 10 cm 이므로 삼각형 OAB의 둘레는 OA + OB + AB = 8 + 8 + 10 = 26 cm 이다.
4. 따라서 삼각형 OAB의 둘레의 길이는 26 cm 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직사각형 $ABCD$에」
**RPM** M2-RPM-197 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] **원천→판정: 도형의 성질 > 사각형의 성질 > 여러 가지 사각형 > 직사각형의 성질 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질**
- 이유: 직사각형 대각선 16 cm 의 반 8 cm 와 AB = 10 cm 로 둘레 26 cm 를 계산하는 단계이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS **원천→판정: PT_M2_RECTANGLE_DIAGONAL → PT_QUADRILATERAL_PROPERTIES** **원천→판정: TPL_RECTANGLE_DIAGONAL_TRIANGLE_PERIMETER → TPL_SPECIAL_QUADRILATERALS**
- 이유: 직사각형의 대각선 성질(길이가 같고 서로 이등분)을 이용하여 삼각형 OAB 둘레 26 cm 를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대각선 16 의 절반인 8 과 10 을 더해 26 을 바로 구하는 기본 난이도 1 문항이다.

**4칸**
- given: 직사각형←stem:「직사각형 $ABCD$에」
- goal: 둘레←stem:「e OAB$의 둘레의 길이는? [」
- method: 이등분선(NAMED)←solution:「로 다른 것을 이등분한다. $$ \」
- condition: (없음)

**how** 대각선 BD = 16 에서 OA = OB = 8 cm, AB = 10 cm 로 둘레 26 cm 임을 확인하고 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형의 두 대각선은 길이가 서로 같고, 서로 다른 것을 이등분한다.
$$
\overline{AC} = \overline{BD} = 16\text{ (cm)}
$$
대각선의 교점 $O$에 대하여
$$
\overline{OA} = \overline{OB} = \frac{1}{2} \times 16 = 8\text{ (cm)}
$$
따라서 $\triangle OAB$의 둘레의 길이는
$$
\overline{OA} + \overline{OB} + \overline{AB} = 8 + 8 + 10 = 26\text{ (cm)}
$$
정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$\triangle ABC$에서 $\angle B = 40^\circ, \angle C = 70^\circ$이고, 두 변의 길이가 $\overline{AB} = 2x + 1$, $\overline{BC} = x + 6$일 때, $x$의 값은? [3점]

**보기** ① 1  ② 2  ③ 3  ④ 4  ⑤ 5

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형의 세 내각의 합은 180도이므로 각 A = 180도 - (40도 + 70도) = 180도 - 110도 = 70도이다.
2. 각 A = 각 C = 70도이므로 삼각형 ABC는 AB = BC 인 이등변삼각형이다.
3. 2x + 1 = x + 6 이 성립하므로 x = 5 이다.
4. 따라서 x의 값은 5 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「크기가 같은 이등변삼각형이다. 따라서」
**RPM** M2-RPM-179 [삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 이등변삼각형 판정] **원천→판정: 도형의 성질 > 삼각형의 성질 > 이등변삼각형 > 이등변삼각형이 될 조건 → 삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 이등변삼각형 판정**
- 이유: 내각 합 180도에서 각 A = 70도를 구하여 AB = BC 인 이등변삼각형임을 판정하는 단계이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_CONVERSE **원천→판정: PT_M2_ISOSCELES_CONDITION → PT_ISOSCELES_TRIANGLE** **원천→판정: TPL_ISOSCELES_ANGLE_TO_EQUAL_SIDES → TPL_ISOSCELES_CONVERSE**
- 이유: 두 내각이 70도로 같음을 확인하여 이등변삼각형의 대변 2x + 1 = x + 6 에서 x = 5 를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 180도에서 110도를 빼서 70도를 얻고 단순 일차방정식 x = 5 를 푸는 난이도 1 문항이다.

**4칸**
- given: 길이←stem:「고, 두 변의 길이가 $\over」
- goal: 이등변삼각형←solution:「크기가 같은 이등변삼각형이다. 따라서」
- method: 대입(NAMED)←solution:「주어진 식을 대입하면 $$ 2x」
- condition: (없음)

**how** 내각 합 180도에서 각 A = 70도로 이등변삼각형임을 확인하여 2x + 1 = x + 6, x = 5 로 ⑤를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 세 내각의 크기의 합은 $180^\circ$이므로
$$
\angle A = 180^\circ - (40^\circ + 70^\circ) = 180^\circ - 110^\circ = 70^\circ
$$
$\angle A = \angle C = 70^\circ$이므로 $\triangle ABC$는 두 내각의 크기가 같은 이등변삼각형이다.
따라서 두 각의 대변의 길이가 서로 같다.
$$
\overline{AB} = \overline{BC}
$$
주어진 식을 대입하면
$$
2x + 1 = x + 6 \implies x = 5
$$
따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

점 $I$가 $\triangle ABC$의 내심일 때, $\angle ABI = 35^\circ$, $\angle BCI = 20^\circ$이다. 이때 $\angle BAC$의 크기는? [4점]

**보기** ① $65^\circ$  ② $70^\circ$  ③ $75^\circ$  ④ $80^\circ$  ⑤ $85^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 내심 I는 삼각형의 세 내각의 이등분선이 만나는 점이다.
2. 각 B = 2 * 각 ABI = 2 * 35도 = 70도이다.
3. 각 C = 2 * 각 BCI = 2 * 20도 = 40도이다.
4. 삼각형의 세 내각의 합은 180도이므로 각 BAC = 180도 - (70도 + 40도) = 70도이다.
5. 따라서 각 BAC의 크기는 70도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「e ABC$의 내심일 때, $\a」
**RPM** M2-RPM-186 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] **원천→판정: 도형의 성질 > 삼각형의 성질 > 삼각형의 내심과 외심 > 삼각형의 내심의 성질 → 삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심**
- 이유: 내심의 각 이등분선 성질로 각 B = 70도, 각 C = 40도를 구하고 180도에서 각 BAC = 70도를 계산하는 단계이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER **원천→판정: PT_M2_INCENTER_ANGLES → PT_TRIANGLE_CENTERS** **원천→판정: TPL_INCENTER_ANGLE_DETERMINATION → TPL_TRIANGLE_INCENTER**
- 이유: 삼각형의 내심 I에서 각의 이등분선 조건 35도와 20도를 이용하여 각 BAC = 70도를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 35도와 20도를 2배하여 180도에서 빼서 70도를 구하는 기본 계산 난이도 1 문항이다.

**4칸**
- given: 내심←stem:「e ABC$의 내심일 때, $\a」
- goal: 이등분선←solution:「의 세 내각의 이등분선이 만나는 점이」
- method: 내각(NAMED)←solution:「삼각형의 세 내각의 이등분선이」
- condition: (없음)

**how** 내심 I에서 각 B = 70도, 각 C = 40도이므로 180도 내각 합으로 각 BAC = 70도임을 확인해 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

내심 $I$는 삼각형의 세 내각의 이등분선이 만나는 점이다.
따라서 선분 $BI, CI$는 각각 $\angle B, \angle C$를 이등분한다.
$$
\angle B = 2 \times \angle ABI = 2 \times 35^\circ = 70^\circ
$$
$$
\angle C = 2 \times \angle BCI = 2 \times 20^\circ = 40^\circ
$$
삼각형의 세 내각의 크기의 합은 $180^\circ$이므로
$$
\angle BAC = 180^\circ - (\angle B + \angle C) = 180^\circ - (70^\circ + 40^\circ) = 70^\circ
$$
따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

점 $O$가 $\triangle ABC$의 외심이고 $\angle OAC = 40^\circ$, $\angle OBC = 25^\circ$일 때, $\angle ACB$의 크기는? [4점]

**보기** ① $65^\circ$  ② $70^\circ$  ③ $75^\circ$  ④ $80^\circ$  ⑤ $85^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심 O에서 세 꼭짓점에 이르는 거리는 같으므로 OA = OB = OC 이다.
2. 삼각형 AOC 는 OA = OC 인 이등변삼각형이므로 각 OCA = 각 OAC = 40도이다.
3. 삼각형 BOC 는 OB = OC 인 이등변삼각형이므로 각 OCB = 각 OBC = 25도이다.
4. 따라서 각 ACB = 각 OCA + 각 OCB = 40도 + 25도 = 65도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「e ABC$의 외심이고 $\ang」
**RPM** M2-RPM-185 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] **원천→판정: 도형의 성질 > 삼각형의 성질 > 삼각형의 내심과 외심 > 삼각형의 외심의 성질 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각**
- 이유: 외심 O에서 꼭짓점까지 거리가 같음을 이용해 40도와 25도를 더해 각 ACB = 65도를 구하는 단계이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER **원천→판정: PT_M2_CIRCUMCENTER_ANGLES → PT_TRIANGLE_CENTERS** **원천→판정: TPL_CIRCUMCENTER_ANGLE_SUM → TPL_TRIANGLE_CIRCUMCENTER**
- 이유: 외심 O의 성질로 생기는 두 이등변삼각형의 밑각 40도와 25도의 합 65도를 계산하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 외심에서 꼭짓점 거리가 같아 두 밑각 40도와 25도를 더해 65도를 즉시 얻는 난이도 1 문항이다.

**4칸**
- given: 외심←stem:「e ABC$의 외심이고 $\ang」
- goal: 꼭짓점←solution:「삼각형의 세 꼭짓점에 이르는 거리」
- method: 거리(NAMED)←solution:「짓점에 이르는 거리는 모두 같다.」
- condition: (없음)

**how** 외심 O에서 OA = OB = OC 로 각 OCA = 40도, 각 OCB = 25도이므로 각 ACB = 65도로 ①을 선택했다.

<details><summary>저장 해설 (판정 검토용)</summary>

외심 $O$에서 삼각형의 세 꼭짓점에 이르는 거리는 모두 같다.
$$
\overline{OA} = \overline{OB} = \overline{OC}
$$
1. $\triangle AOC$에서 $\overline{OA} = \overline{OC}$이므로 이등변삼각형이다.
$$
\angle OCA = \angle OAC = 40^\circ
$$
2. $\triangle BOC$에서 $\overline{OB} = \overline{OC}$이므로 이등변삼각형이다.
$$
\angle OCB = \angle OBC = 25^\circ
$$
3. 점 $O$가 $\angle ACB$의 내부에 있으므로
$$
\angle ACB = \angle OCA + \angle OCB = 40^\circ + 25^\circ = 65^\circ
$$
따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

직각삼각형 $ABC$ ($\angle B = 90^\circ$)에서 세 점 $B, D, C$가 한 직선 위에 있고 $\overline{AD} \parallel \overline{EC}$이다. $\overline{AB} = 14\text{ cm}$, $\overline{BD} = 8\text{ cm}$, $\overline{DC} = 12\text{ cm}$일 때, 사각형 $ABDE$의 넓이는? [4점]

**보기** ① $134\text{ cm}^2$  ② $136\text{ cm}^2$  ③ $138\text{ cm}^2$  ④ $140\text{ cm}^2$  ⑤ $142\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 선분 AD 와 EC 가 평행하므로 삼각형 ADE 와 삼각형 ADC 는 밑변 AD를 공유하고 높이가 같아 넓이가 같다.
2. 따라서 사각형 ABDE = 삼각형 ABD + 삼각형 ADE = 삼각형 ABD + 삼각형 ADC = 삼각형 ABC 이다.
3. 직각삼각형 ABC 에서 밑변 BC = BD + DC = 8 + 12 = 20 cm 이고 높이 AB = 14 cm 이다.
4. 넓이는 1/2 * 20 * 14 = 140 cm^2 이다.
5. 따라서 사각형 ABDE 의 넓이는 140 cm^2 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직각삼각형 $ABC$ ($\」
**RPM** M2-RPM-194 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 평행선과 넓이] **원천→판정: 도형의 성질 > 사각형의 성질 > 평행선과 넓이 > 평행선과 삼각형의 넓이 → 사각형의 성질 > 평행사변형 > 넓이와 활용 > 평행선과 넓이**
- 이유: 평행선 사이의 등적변형으로 사각형 ABDE 넓이를 밑변 20 cm 와 높이 14 cm 인 삼각형 ABC 넓이 140 으로 바꾸는 단계이다.
**유형** PT=PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION / TPL=TPL_MG_FIND_PARALLEL_CONDITION_FOR_EQUAL_AREA_QUADRILATERAL **원천→판정: PT_M2_EQUAL_AREA_PARALLEL → PT_MG_PARALLEL_LINES_EQUAL_AREA_TRANSFORMATION** **원천→판정: TPL_QUADRILATERAL_AREA_EQUAL_TRANSFORMATION → TPL_MG_FIND_PARALLEL_CONDITION_FOR_EQUAL_AREA_QUADRILATERAL**
- 이유: 평행선 조건에서 등적변형을 적용하여 사각형의 넓이를 직각삼각형 ABC 넓이 140 cm^2 로 변환하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 등적변형 아이디어를 이용해 직각삼각형 넓이 1/2 * 20 * 14 = 140 을 계산하는 전형적인 난이도 2 문항이다.

**4칸**
- given: 직각삼각형←stem:「직각삼각형 $ABC$ (」
- goal: 사각형←stem:「m}$일 때, 사각형 $ABDE$의」
- method: 넓이(NAMED)←solution:「높이가 같아 넓이가 같다. $$」
- condition: (없음)

**how** AD와 EC 평행으로 사각형 ABDE 넓이가 직각삼각형 ABC 넓이와 같으므로 1/2 * 20 * 14 = 140 cm^2 로 ④를 선택했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD} \parallel \overline{EC}$이므로 밑변 $\overline{AD}$를 공유하는 두 삼각형 $\triangle ADE$와 $\triangle ADC$는 높이가 같아 넓이가 같다.
$$
\triangle ADE = \triangle ADC
$$
사각형 $ABDE$의 넓이는 두 삼각형의 넓이의 합으로 나눌 수 있으므로
$$
\text{사각형 } ABDE = \triangle ABD + \triangle ADE = \triangle ABD + \triangle ADC = \triangle ABC
$$
점 $B, D, C$가 한 직선 위에 있으므로
$$
\overline{BC} = \overline{BD} + \overline{DC} = 8 + 12 = 20\text{ (cm)}
$$
$\angle B = 90^\circ$이므로 직각삼각형 $ABC$의 넓이는
$$
\triangle ABC = \frac{1}{2} \times \overline{AB} \times \overline{BC} = \frac{1}{2}         imes 14 \times 20 = 140\text{ (cm}^2\text{)}
$$
따라서 사각형 $ABDE$의 넓이는 $140\text{ cm}^2$이다.
정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

마름모 $ABCD$에서 두 대각선의 교점을 $O$라 하자. $\overline{AO} = 10\text{ cm}$, $\overline{BO} = 15\text{ cm}$이고, 변 $AB$ 위의 점 $E$에 대하여 $\overline{AE} : \overline{EB} = 2 : 1$일 때, $\triangle EBD$의 넓이는? [4점]

**보기** ① $40\text{ cm}^2$  ② $45\text{ cm}^2$  ③ $50\text{ cm}^2$  ④ $55\text{ cm}^2$  ⑤ $60\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 마름모의 대각선은 서로 수직이등분하므로 BD = 2 * BO = 2 * 15 = 30 cm 이다.
2. AO 는 BD 에 수직이므로 삼각형 ABD 의 넓이는 1/2 * 30 * 10 = 150 cm^2 이다.
3. 변 AB 위에서 AE : EB = 2 : 1 이므로 EB : AB = 1 : 3 이다.
4. 삼각형 EBD 와 ABD 는 밑변 BD 를 공유하므로 넓이의 비는 높이의 비와 같다.
5. 삼각형 EBD = 1/3 * 150 = 50 cm^2 이다.
6. 따라서 정답은 50 cm^2 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$에」
**RPM** M2-RPM-195 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 분할도형] **원천→판정: 도형의 성질 > 사각형의 성질 > 여러 가지 사각형 > 마름모의 성질 → 사각형의 성질 > 평행사변형 > 넓이와 활용 > 분할도형**
- 이유: 마름모의 대각선 성질로 삼각형 ABD 넓이 150 cm^2 를 구하고 변의 비 1/3 로 50 cm^2 를 구하는 단계이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS **원천→판정: PT_M2_RHOMBUS_AREA_RATIO → PT_QUADRILATERAL_PROPERTIES** **원천→판정: TPL_RHOMBUS_SIDE_RATIO_TRIANGLE_AREA → TPL_SPECIAL_QUADRILATERALS**
- 이유: 마름모 ABCD 의 대각선 수직이등분 성질과 선분 분할비로 삼각형 EBD 의 넓이 50 cm^2 를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대각선 길이 30 과 AO = 10 으로 구한 넓이 150 에 1/3 을 곱해 50 을 도출하는 난이도 2 문항이다.

**4칸**
- given: 마름모←stem:「마름모 $ABCD$에」
- goal: 넓이←stem:「e EBD$의 넓이는? [4점]」
- method: 수선(NAMED)←solution:「각선은 서로를 수직이등분한다. $」
- condition: (없음)

**how** 마름모 대각선에서 삼각형 ABD = 150 cm^2 이고 AE:EB = 2:1 에서 삼각형 EBD = 1/3 * 150 = 50 cm^2 로 ③을 선택했다.

<details><summary>저장 해설 (판정 검토용)</summary>

마름모의 두 대각선은 서로를 수직이등분한다.
$$
\overline{BD} = 2 \times \overline{BO} = 2 \times 15 = 30\text{ (cm)}
$$
선분 $AO$는 $\overline{BD}$에 수직이므로 $\triangle ABD$의 밑변을 $\overline{BD}$로 볼 때 높이는 $\overline{AO} = 10\text{ cm}$이다.
$$
\triangle ABD = \frac{1}{2} \times \overline{BD} \times \overline{AO} = \frac{1}{2} \times 30 \times 10 = 150\text{ (cm}^2\text{)}
$$
점 $E$가 변 $AB$ 위에 있고 $\overline{AE} : \overline{EB} = 2 : 1$이므로
$$
\overline{EB} : \overline{AB} = 1 : (2 + 1) = 1 : 3
$$
두 삼각형 $\triangle EBD$와 $\triangle ABD$는 밑변 $\overline{BD}$를 공유하므로 넓이의 비는 높이의 비인 $\overline{EB} : \overline{AB}$와 같다.
$$
\triangle EBD = \frac{1}{3} \times \triangle ABD = \frac{1}{3} \times 150 = 50\text{ (cm}^2\text{)}
$$
따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

평행사변형 $ABCD$에서 $\angle B$의 이등분선이 변 $AD$와 만나는 점을 $F$, 변 $CD$의 연장선과 만나는 점을 $E$라 하자. $\overline{AB} = 10\text{ cm}$, $\overline{AD} = 15\text{ cm}$일 때, 선분 $DE$의 길이는? [4점]

**보기** ① $1\text{ cm}$  ② $2\text{ cm}$  ③ $3\text{ cm}$  ④ $4\text{ cm}$  ⑤ $5\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형에서 AD 와 BC 가 평행하므로 엇각에 의해 각 AFB = 각 FBC 이다.
2. 선분 BF 가 각 B의 이등분선이므로 각 ABF = 각 FBC = 각 AFB 이다.
3. 삼각형 ABF 는 이등변삼각형이므로 AF = AB = 10 cm 이다.
4. AD = 15 cm 이므로 FD = 15 - 10 = 5 cm 이다.
5. 삼각형 DEF 또한 이등변삼각형(또는 삼각형 ABF 와 DEF 가 닮음)이므로 DE = FD = 5 cm 이다.
6. 따라서 선분 DE의 길이는 5 cm 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에」
**RPM** M2-RPM-190 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] **원천→판정: 도형의 성질 > 사각형의 성질 > 평행사변형 > 평행사변형의 성질의 활용 → 사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질**
- 이유: 평행사변형의 각 이등분선과 엇각으로 AF = 10 cm 임을 확인하고 FD 로부터 DE = 5 cm 를 구하는 단계이다.
**유형** PT=PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT / TPL=TPL_MG_CALCULATE_OVERLAPPING_SEGMENT_FROM_TWO_BISECTORS **원천→판정: PT_M2_PARALLELOGRAM_BISECTOR → PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT** **원천→판정: TPL_PARALLELOGRAM_ANGLE_BISECTOR_SIMILARITY → TPL_MG_CALCULATE_OVERLAPPING_SEGMENT_FROM_TWO_BISECTORS**
- 이유: 평행사변형 ABCD 에서 각의 이등분선이 만드는 이등변삼각형의 변의 길이 10 cm 와 15 cm 로 선분 DE = 5 cm 를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 엇각과 각 이등분선으로 AF = 10 cm 를 찾고 AD = 15 cm 의 차 5 cm 를 구하는 난이도 2 문항이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에」
- goal: 길이←stem:「분 $DE$의 길이는? [4점]」
- method: 엇각(NAMED)←solution:「BC}$이므로 엇각의 크기는 같다」
- condition: (없음)

**how** 엇각과 각 이등분선으로 AF = 10 cm 를 구한 뒤 15 - 10 = 5 cm 로 선분 DE = 5 cm 임을 확인하여 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. 평행사변형에서 $\overline{AD} \parallel \overline{BC}$이므로 엇각의 크기는 같다.
$$
\angle AFB = \angle FBC
$$
선분 $BF$가 $\angle B$의 이등분선이므로 $\angle ABF = \angle FBC$이다.
따라서 $\angle ABF = \angle AFB$이므로 $\triangle ABF$는 이등변삼각형이다.
$$
\overline{AF} = \overline{AB} = 10\text{ (cm)}
$$
2. $\overline{AD} = 15\text{ cm}$이므로
$$
\overline{FD} = \overline{AD} - \overline{AF} = 15 - 10 = 5\text{ (cm)}
$$
3. $\overline{AB} \parallel \overline{DE}$이므로 두 삼각형 $\triangle ABF$와 $\triangle DEF$는 닮음이다 (AA 닮음).
$$
\triangle ABF \sim \triangle DEF
$$
대응변의 길이의 비는 같으므로
$$
\overline{AB} : \overline{DE} = \overline{AF} : \overline{FD}
$$
$$
10 : \overline{DE} = 10 : 5 \implies \overline{DE} = 5\text{ (cm)}
$$
따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, PT, TPL)

**발문**

두 삼각형 $ABC$와 $DEF$가 서로 닮은 도형이고, 대응하는 변의 길이의 비가 $\overline{AB} : \overline{DE} = 3 : 4$이다. $\triangle ABC$의 넓이가 $36\text{ cm}^2$일 때, $\triangle DEF$의 넓이는? [4점]

**보기** ① $60\text{ cm}^2$  ② $64\text{ cm}^2$  ③ $68\text{ cm}^2$  ④ $72\text{ cm}^2$  ⑤ $76\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 닮음비가 3 : 4 이므로 넓이의 비는 닮음비의 제곱인 3^2 : 4^2 = 9 : 16 이다.
2. 삼각형 DEF 의 넓이를 S 라 하면 36 : S = 9 : 16 이 성립한다.
3. 9S = 36 * 16 에서 S = 4 * 16 = 64 cm^2 이다.
4. 따라서 삼각형 DEF의 넓이는 64 cm^2 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-SIMILARITY_BASIC → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「EF$가 서로 닮은 도형이고, 대」
**RPM** M2-RPM-208 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비] **원천→판정: 도형의 닮음 > 도형의 닮음 > 닮은 도형의 성질 > 닮은 평면도형의 넓이의 비 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비**
- 이유: 닮음비 3:4 의 제곱비 9:16 과 36 cm^2 로부터 삼각형 DEF 의 넓이 64 cm^2 를 구하는 단계이다.
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_AREA_VOLUME **원천→판정: PT_M2_SIMILAR_AREA_RATIO → PT_SIMILAR_FIGURES** **원천→판정: TPL_SIMILAR_TRIANGLES_AREA_RATIO → TPL_SIMILAR_FIGURES_AREA_VOLUME**
- 이유: 닮은 두 삼각형의 넓이의 비 9:16 을 적용하여 36 cm^2 에 대응하는 64 cm^2 를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 넓이의 비 9:16 에 36 을 대입해 64 를 바로 구하는 기본 난이도 1 문항이다.

**4칸**
- given: 도형←stem:「가 서로 닮은 도형이고, 대응하는」
- goal: 넓이←stem:「e ABC$의 넓이가 $36\te」
- method: 닮음비(NAMED)←solution:「넓이의 비는 닮음비의 제곱의 비와」
- condition: (없음)

**how** 닮음비 3:4의 제곱비 9:16에서 36 : S = 9 : 16 이므로 S = 64 cm^2 로 ②를 선택했다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 닮은 평면도형에서 넓이의 비는 닮음비의 제곱의 비와 같다.
닮음비가 $3 : 4$이므로 넓이의 비는
$$
3^2 : 4^2 = 9 : 16
$$
삼각형 $DEF$의 넓이를 $S$라 하면
$$
36 : S = 9 : 16
$$
외항의 곱과 내항의 곱을 비교하면
$$
9S = 36 \times 16 \implies S = 4 \times 16 = 64\text{ (cm}^2\text{)}
$$
따라서 $\triangle DEF$의 넓이는 $64\text{ cm}^2$이다.
정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

그림과 같이 세 점 $A, B, C$가 순서대로 변 위에 있고 $\overline{AD} = \overline{DB} = \overline{BC}$이다. $\angle ADE = 84^\circ$일 때, $\angle ACD$의 크기는? [4점]

**보기** ① $22^\circ$  ② $24^\circ$  ③ $26^\circ$  ④ $28^\circ$  ⑤ $30^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 ACD = x 라 하자.
2. 삼각형 BCD 에서 BC = BD 이므로 각 BDC = 각 BCD = x 이고, 외각 각 ABD = x + x = 2x 이다.
3. 삼각형 ADB 에서 AD = DB 이므로 각 BAD = 각 ABD = 2x 이다.
4. 삼각형 ACD 에서 외각 각 ADE = 각 CAD + 각 ACD = 2x + x = 3x 이다.
5. 3x = 84도 이므로 x = 28도이다. 따라서 각 ACD = 28도이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — B, C$가 순서대로 변 위에

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「BD}$이므로 이등변삼각형이다. $$ \」
**RPM** M2-RPM-178 [삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각] **원천→판정: 도형의 성질 > 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질의 활용 → 삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각**
- 이유: 이등변삼각형의 밑각과 외각 성질을 연속으로 써서 3x = 84도에서 각 ACD = 28도를 구하는 단계이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_BASE_ANGLES **원천→판정: PT_M2_ISOSCELES_CHAIN_ANGLES → PT_ISOSCELES_TRIANGLE** **원천→판정: TPL_ISOSCELES_EXTERIOR_ANGLE_SUM → TPL_ISOSCELES_BASE_ANGLES**
- 이유: 선분 길이가 같은 연속된 이등변삼각형에서 외각 84도 조건으로 각 ACD = 28도를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 이등변삼각형 밑각과 외각 관계를 2단계 추적하여 3x = 84도, x = 28도를 얻는 난이도 2 문항이다.

**4칸**
- given: 순서←stem:「B, C$가 순서대로 변 위에」
- goal: 외각←solution:「$$ 삼각형의 외각의 성질에 의하」
- method: 이등변삼각형(NAMED)←solution:「BD}$이므로 이등변삼각형이다. $$ \」
- condition: (없음)

**how** 이등변삼각형 밑각과 외각에서 3x = 84도이므로 각 ACD = 28도임을 구하여 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

구하고자 하는 각의 크기를 $\angle ACD = x$라 하자.
1. $\triangle BCD$에서 $\overline{BC} = \overline{BD}$이므로 이등변삼각형이다.
$$
\angle BDC = \angle BCD = x
$$
삼각형의 외각의 성질에 의하여
$$
\angle ABD = \angle BCD + \angle BDC = x + x = 2x
$$
2. $\triangle ADB$에서 $\overline{AD} = \overline{DB}$이므로 이등변삼각형이다.
$$
\angle BAD = \angle ABD = 2x
$$
3. $\triangle ACD$에서 외각 $\angle ADE$의 크기는 이웃하지 않는 두 내각의 크기의 합과 같다.
$$
\angle ADE = \angle CAD + \angle ACD = 2x + x = 3x
$$
조건에서 $\angle ADE = 84^\circ$이므로
$$
3x = 84^\circ \implies x = 28^\circ
$$
따라서 $\angle ACD = 28^\circ$이다.
정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

평행사변형 $ABCD$에서 $\overline{AB} = 15\text{ cm}$, $\overline{AD} = 22\text{ cm}$이다. $\angle A$의 이등분선과 $\angle D$의 이등분선이 변 $BC$와 만나는 점을 각각 $E, F$라 하고, 점 $B, F, E, C$가 순서대로 놓여 있을 때, 선분 $FE$의 길이는? [4점]

**보기** ① $8\text{ cm}$  ② $9\text{ cm}$  ③ $10\text{ cm}$  ④ $11\text{ cm}$  ⑤ $12\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 ABCD 에서 대변 BC = AD = 22 cm, CD = AB = 15 cm 이다.
2. 각 A의 이등분선과 엇각에 의해 삼각형 ABE 는 이등변삼각형이므로 BE = AB = 15 cm 이다.
3. 각 D의 이등분선과 엇각에 의해 삼각형 DCF 는 이등변삼각형이므로 CF = CD = 15 cm 이다.
4. BF = BC - CF = 22 - 15 = 7 cm 이다.
5. 따라서 FE = BE - BF = 15 - 7 = 8 cm 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에」
**RPM** M2-RPM-190 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] **원천→판정: 도형의 성질 > 사각형의 성질 > 평행사변형 > 평행사변형의 성질의 활용 → 사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질**
- 이유: 평행사변형의 두 각 이등분선으로 BE = 15 cm, CF = 15 cm 를 얻고 22 cm 로부터 FE = 8 cm 를 구하는 단계이다.
**유형** PT=PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT / TPL=TPL_MG_CALCULATE_OVERLAPPING_SEGMENT_FROM_TWO_BISECTORS **원천→판정: PT_M2_PARALLELOGRAM_DUAL_BISECTORS → PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT** **원천→판정: TPL_PARALLELOGRAM_OVERLAPPING_SEGMENT → TPL_MG_CALCULATE_OVERLAPPING_SEGMENT_FROM_TWO_BISECTORS**
- 이유: 평행사변형 ABCD 에서 두 각의 이등분선이 만드는 이등변삼각형들의 겹치는 선분 FE = 8 cm 를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 15 cm 와 22 cm 로부터 22 - 15 = 7 cm, 15 - 7 = 8 cm 를 순차적으로 도출하는 난이도 2 문항이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에」
- goal: 길이←stem:「분 $FE$의 길이는? [4점]」
- method: 엇각(NAMED)←solution:「이등분선이므로 엇각에 의해 $$」
- condition: (없음)

**how** BE = 15 cm, CF = 15 cm, BC = 22 cm 에서 BF = 7 cm, FE = 8 cm 임을 확인하고 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형의 대변의 길이는 같으므로
$$
\overline{BC} = \overline{AD} = 22\text{ (cm)}, \quad \overline{CD} = \overline{AB} = 15\text{ (cm)}
$$
1. $\overline{AD} \parallel \overline{BC}$이고 선분 $AE$가 $\angle A$의 이등분선이므로 엇각에 의해
$$
\angle BAE = \angle EAD = \angle AEB
$$
따라서 $\triangle ABE$는 이등변삼각형이다.
$$
\overline{BE} = \overline{AB} = 15\text{ (cm)}
$$
2. 마찬가지로 선분 $DF$가 $\angle D$의 이등분선이므로 엇각에 의해 $\triangle DCF$는 이등변삼각형이다.
$$
\overline{CF} = \overline{CD} = 15\text{ (cm)}
$$
3. 점 $B, F, C$가 한 직선 위에 있으므로
$$
\overline{BF} = \overline{BC} - \overline{CF} = 22 - 15 = 7\text{ (cm)}
$$
점 $B, F, E$가 순서대로 놓여 있으므로
$$
\overline{FE} = \overline{BE} - \overline{BF} = 15 - 7 = 8\text{ (cm)}
$$
따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

여러 가지 사각형 사이의 관계에서 한 단계 더 특별한 사각형이 되기 위한 추가 조건으로 옳은 것은? [4점]

**보기** ① 평행사변형이 직사각형이 되려면 두 대각선이 서로 수직이어야 한다.  ② 평행사변형이 마름모가 되려면 한 내각의 크기가 $90^\circ$이어야 한다.  ③ 마름모가 정사각형이 되려면 두 대각선의 길이가 같아야 한다.  ④ 사다리꼴이 평행사변형이 되려면 한 쌍의 대변의 길이가 같아야 한다.  ⑤ 직사각형이 정사각형이 되려면 두 대각선이 서로 다른 것을 이등분해야 한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 평행사변형의 두 대각선이 서로 수직이면 마름모가 된다 (직사각형 아님).
2. ② 평행사변형의 한 내각이 90도이면 직사각형이 된다 (마름모 아님).
3. ③ 마름모에 '두 대각선의 길이가 같다'는 직사각형 성질이 추가되면 정사각형이 된다 (옳음).
4. ④ 사다리꼴에서 평행하지 않은 대변 길이가 같으면 등변사다리꼴이 된다 (평행사변형 아님).
5. ⑤ 직사각형은 이미 대각선이 서로 이등분하므로 이것만으로 정사각형이 되지 않는다.
6. 따라서 옳은 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모가 정사각형이 되려면 두 대각선의」
**RPM** M2-RPM-200 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] **원천→판정: 도형의 성질 > 사각형의 성질 > 여러 가지 사각형 > 여러 가지 사각형 사이의 관계 → 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정**
- 이유: 90도 각 조건이나 대각선 길이 조건 등 여러 사각형의 포함 관계와 변환 조건을 판정하는 단계이다.
**유형** PT=PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS / TPL=TPL_MG_COMPLETE_CONDITIONS_IN_QUADRILATERAL_FLOWCHART_DESCRIPTIVE **원천→판정: PT_M2_QUADRILATERAL_HIERARCHY → PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS** **원천→판정: TPL_QUADRILATERAL_TRANSFORMATION_CONDITIONS → TPL_MG_COMPLETE_CONDITIONS_IN_QUADRILATERAL_FLOWCHART_DESCRIPTIVE**
- 이유: 90도 및 대각선 성질을 비교하여 마름모에서 정사각형이 되는 조건을 바르게 판별하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 90도 내각 및 대각선의 성질을 파악하여 보기 ③의 참 거짓을 바로 판별하는 기본 난이도 1 문항이다.

**4칸**
- given: 사각형←stem:「여러 가지 사각형 사이의 관계에」
- goal: 조건←stem:「기 위한 추가 조건으로 옳은 것은」
- method: 대각선(NAMED)←solution:「각형의 정의와 대각선의 성질을 비교」
- condition: (없음)

**how** 마름모에 두 대각선의 길이가 같다는 조건이 추가되면 정사각형이 됨을 확인하여 90도 관계와 함께 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

여러 가지 사각형의 정의와 대각선의 성질을 비교한다.
① 평행사변형의 두 대각선이 서로 수직이면 직사각형이 아니라 마름모가 된다. (거짓)
② 평행사변형의 한 내각의 크기가 $90^\circ$이면 마름모가 아니라 직사각형이 된다. (거짓)
③ 마름모는 네 변의 길이가 같고 대각선이 수직이등분한다. 여기에 '두 대각선의 길이가 같다'는 직사각형의 성질이 추가되면 네 각도 모두 같아져 정사각형이 된다. (참)
④ 사다리꼴에서 평행하지 않은 한 쌍의 대변의 길이가 같으면 등변사다리꼴이 될 수 있으므로 평행사변형이 되지 않는다. (거짓)
⑤ 직사각형은 이미 두 대각선이 서로 다른 것을 이등분하므로, 이 조건만으로 정사각형이 되지 않는다. (거짓)


따라서 옳은 것은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 사각형 $ABCD$가 항상 평행사변형이 된다고 할 수 없는 조건은? (단, 점 $O$는 두 대각선의 교점이다.) [4점]

**보기** ① $\overline{AB} \parallel \overline{DC},\; \overline{AD} \parallel \overline{BC}$  ② $\angle A = \angle C,\; \angle B = \angle D$  ③ $\overline{AB} = \overline{DC},\; \overline{AD} = \overline{BC}$  ④ $\overline{OA} = \overline{OC},\; \overline{OB} = \overline{OD}$  ⑤ $\overline{AD} \parallel \overline{BC},\; \overline{AB} = \overline{DC}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형이 되기 위한 조건은 두 쌍의 대변 평행, 두 쌍의 대변 길이 같음, 두 쌍의 대각 크기 같음, 대각선 이등분, 한 쌍 대변 평행하고 그 길이 같음이다.
2. ① AB // DC, AD // BC 는 정의에 의해 평행사변형이다.
3. ② 각 A = 각 C, 각 B = 각 D 는 두 쌍의 대각이 같으므로 평행사변형이다.
4. ③ AB = DC, AD = BC 는 두 쌍의 대변 길이가 같으므로 평행사변형이다.
5. ④ OA = OC, OB = OD 는 두 대각선이 서로 이등분하므로 평행사변형이다.
6. ⑤ AD // BC, AB = DC 는 평행한 대변과 길이가 같은 대변이 서로 다르므로 등변사다리꼴인 반례가 존재하여 평행사변형이 되지 않는다.
7. 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「CD$가 항상 평행사변형이 된다고 할」
**RPM** M2-RPM-192 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] **원천→판정: 도형의 성질 > 사각형의 성질 > 평행사변형 > 평행사변형이 되는 조건 → 사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건**
- 이유: 사각형 ABCD 에서 AD // BC 이면서 다른 변 AB = DC 가 주어졌을 때 등변사다리꼴 반례를 판별하는 단계이다.
**유형** PT=PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION / TPL=TPL_MG_IDENTIFY_INVALID_PARALLELOGRAM_CONDITION **원천→판정: PT_M2_PARALLELOGRAM_CONDITIONS → PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION** **원천→판정: TPL_PARALLELOGRAM_CRITERIA_AUDIT → TPL_MG_IDENTIFY_INVALID_PARALLELOGRAM_CONDITION**
- 이유: 사각형 ABCD 가 평행사변형이 되지 않는 조건(등변사다리꼴 반례)을 판별하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: ABCD 에서 한 쌍 평행과 다른 쌍 길이가 주어지면 평행사변형이 아님을 즉시 판단하는 난이도 1 문항이다.

**4칸**
- given: 사각형←stem:「다음 중 사각형 $ABCD$가」
- goal: 평행사변형←stem:「CD$가 항상 평행사변형이 된다고 할」
- method: 등변사다리꼴(NAMED)←solution:「길이가 같은 등변사다리꼴도 만족하므로」
- condition: (없음)

**how** AD // BC 와 AB = DC 는 등변사다리꼴도 만족하여 사각형 ABCD 가 평행사변형이 아닐 수 있음을 확인해 ⑤로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형이 되기 위한 5가지 조건은 다음과 같다.
1. 두 쌍의 대변이 각각 평행하다. (①)
2. 두 쌍의 대각의 크기가 각각 같다. (②)
3. 두 쌍의 대변의 길이가 각각 같다. (③)
4. 두 대각선이 서로 다른 것을 이등분한다. (④)
5. 한 쌍의 대변이 평행하고 그 길이가 같다.


⑤의 경우 한 쌍의 대변($\overline{AD}, \overline{BC}$)이 평행하지만, 길이가 같은 변은 다른 한 쌍($\overline{AB}, \overline{DC}$)이다.
이 조건은 평행하지 않은 두 변의 길이가 같은 등변사다리꼴도 만족하므로 항상 평행사변형이 되는 것은 아니다.


따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

다음 보기에서 옳은 것만을 있는 대로 고른 것은? [5점]


$$
\begin{aligned}
&\text{ㄱ. 두 대각선이 서로 수직인 평행사변형은 마름모이다.} \
&\text{ㄴ. 두 대각선의 길이가 같은 평행사변형은 직사각형이다.} \
&\text{ㄷ. 이웃하는 두 변의 길이가 같은 직사각형은 정사각형이다.} \
&\text{ㄹ. 두 대각선이 서로 수직인 사각형은 마름모이다.}
\end{aligned}
$$

**보기** ① ㄱ, ㄴ  ② ㄱ, ㄴ, ㄷ  ③ ㄱ, ㄷ, ㄹ  ④ ㄴ, ㄷ, ㄹ  ⑤ ㄱ, ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ㄱ. 평행사변형의 두 대각선이 수직이면 네 변의 길이가 같아져 마름모가 된다 (참).
2. ㄴ. 평행사변형의 두 대각선의 길이가 같으면 네 각이 모두 90도가 되어 직사각형이다 (참).
3. ㄷ. 직사각형의 이웃하는 두 변의 길이가 같으면 네 변의 길이가 모두 같아져 정사각형이다 (참).
4. ㄹ. 두 대각선이 서로 수직이더라도 이등분하지 않으면 마름모가 아니다 (거짓).
5. 따라서 옳은 것은 ㄱ, ㄴ, ㄷ이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「서로 수직인 평행사변형은 마름모이다.」
**RPM** M2-RPM-201 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 성질 비교] **원천→판정: 도형의 성질 > 사각형의 성질 > 여러 가지 사각형 > 여러 가지 사각형의 성질 → 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 성질 비교**
- 이유: 90도 각 조건 및 대각선의 수직, 길이 조건을 비교하여 여러 사각형의 성질을 판정하는 단계이다.
**유형** PT=PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS / TPL=TPL_MG_COMPLETE_CONDITIONS_IN_QUADRILATERAL_FLOWCHART_DESCRIPTIVE **원천→판정: PT_M2_QUADRILATERAL_PROPOSITIONS → PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS** **원천→판정: TPL_QUADRILATERAL_TRUTH_TABLE → TPL_MG_COMPLETE_CONDITIONS_IN_QUADRILATERAL_FLOWCHART_DESCRIPTIVE**
- 이유: 90도 각과 대각선 성질에 따른 사각형 간의 포함 관계 및 변환 명제의 참 거짓을 판별하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 90도 조건과 대각선 성질 등 사각형 계통 정의를 바로 적용해 판단하는 기본 난이도 1 문항이다.

**4칸**
- given: 평행사변형←stem:「서로 수직인 평행사변형은 마름모이다.」
- goal: 직사각형←stem:「평행사변형은 직사각형이다.} \ &」
- method: 대각선(NAMED)←solution:「행사변형의 두 대각선이 서로 수직이」
- condition: (없음)

**how** 대각선 수직, 90도 각 조건 등을 판별하여 ㄱ, ㄴ, ㄷ이 참이고 ㄹ이 거짓임을 확인해 ②로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

보기의 각 명제를 판별한다.
ㄱ. 평행사변형의 두 대각선이 서로 수직이면 네 변의 길이가 같아지므로 마름모가 된다. (참)
ㄴ. 평행사변형의 두 대각선의 길이가 같으면 네 내각의 크기가 모두 $90^\circ$가 되므로 직사각형이다. (참)
ㄷ. 직사각형의 이웃하는 두 변의 길이가 같으면 네 변의 길이가 모두 같아지므로 정사각형이다. (참)
ㄹ. 두 대각선이 서로 수직이더라도 서로를 이등분하지 않으면 마름모가 아니다 (예: 연꼴 또는 대각선이 수직으로 교차하는 일반 사각형). 따라서 거짓이다.


따라서 옳은 것은 ㄱ, ㄴ, ㄷ이다.
정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

점 $I$는 $\triangle ABC$의 내심이다. $\triangle ABC$의 세 내각의 크기의 비가 $\angle A : \angle B : \angle C = 1 : 2 : 3$일 때, $\angle BIC$의 크기는? [5점]

**보기** ① $105^\circ$  ② $110^\circ$  ③ $115^\circ$  ④ $120^\circ$  ⑤ $125^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형의 세 내각의 합은 180도이고 각의 비가 1 : 2 : 3 이므로 각 A = 180 * (1 / 6) = 30도이다.
2. 내심 I에서 각 BIC = 90도 + 1/2 * 각 A 가 성립한다.
3. 각 A = 30도를 대입하면 각 BIC = 90도 + 15도 = 105도이다.
4. 따라서 각 BIC의 크기는 105도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「e ABC$의 내심이다. $\tr」
**RPM** M2-RPM-188 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산] **원천→판정: 도형의 성질 > 삼각형의 성질 > 삼각형의 내심과 외심 > 삼각형의 내심의 응용 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산**
- 이유: 180도 내각 비로부터 각 A = 30도를 구하고 내심 공식 90도 + 15도 = 105도를 계산하는 단계이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER **원천→판정: PT_M2_INCENTER_BIC_ANGLE → PT_TRIANGLE_CENTERS** **원천→판정: TPL_INCENTER_ANGLE_FORMULA_CALCULATION → TPL_TRIANGLE_INCENTER**
- 이유: 삼각형의 세 각의 비로 각 A = 30도를 구하고 내심 공식으로 각 BIC = 105도를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 180도 비례배분으로 30도를 얻고 90 + 15 = 105도를 바로 도출하는 기본 난이도 1 문항이다.

**4칸**
- given: 내심←stem:「e ABC$의 내심이다. $\tr」
- goal: 내각←stem:「ABC$의 세 내각의 크기의 비가」
- method: 비례배분(NAMED)←solution:「: 3$이므로 비례배분에 의해 $\a」
- condition: (없음)

**how** 180도에서 각 A = 30도를 구한 뒤 내심 공식 90 + 30/2 = 105도로 ①을 선택했다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 세 내각의 크기의 합은 $180^\circ$이다.
$\angle A : \angle B : \angle C = 1 : 2 : 3$이므로 비례배분에 의해 $\angle A$의 크기를 구한다.
$$
\angle A = 180^\circ \times \frac{1}{1 + 2 + 3} = 180^\circ \times \frac{1}{6} = 30^\circ
$$
내심 $I$에서 두 꼭짓점 $B, C$를 잇는 각 $\angle BIC$의 크기는 다음과 같다.
$$
\angle BIC = 90^\circ + \frac{1}{2}\angle A
$$
$\angle A = 30^\circ$를 대입하면
$$
\angle BIC = 90^\circ + \frac{1}{2} \times 30^\circ = 90^\circ + 15^\circ = 105^\circ
$$
따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

$\triangle ABC$에서 $\angle A = 70^\circ$이고, 점 $O$가 $\triangle ABC$의 외심일 때, $\angle BOC$의 크기는? [5점]

**보기** ① $110^\circ$  ② $120^\circ$  ③ $130^\circ$  ④ $140^\circ$  ⑤ $150^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형의 외심 O에서 중심각 각 BOC의 크기는 꼭지각 각 A의 2배이다.
2. 각 BOC = 2 * 각 A = 2 * 70도 = 140도이다.
3. 따라서 각 BOC의 크기는 140도이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「e ABC$의 외심일 때, $\a」
**RPM** M2-RPM-185 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] **원천→판정: 도형의 성질 > 삼각형의 성질 > 삼각형의 내심과 외심 > 삼각형의 외심의 응용 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각**
- 이유: 외심 O에서 중심각 각 BOC = 2 * 각 A = 2 * 70도 = 140도를 계산하는 단계이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER **원천→판정: PT_M2_CIRCUMCENTER_BOC_ANGLE → PT_TRIANGLE_CENTERS** **원천→판정: TPL_CIRCUMCENTER_DOUBLE_ANGLE → TPL_TRIANGLE_CIRCUMCENTER**
- 이유: 외심 O에서 꼭지각 70도로부터 중심각 각 BOC = 140도를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 외심 공식 각 BOC = 2 * 70도 = 140도를 직접 대입해 즉시 답을 찾는 난이도 1 문항이다.

**4칸**
- given: 외심←stem:「e ABC$의 외심일 때, $\a」
- goal: 중심각←solution:「C$를 잇는 중심각 $\angle」
- method: 꼭짓점(NAMED)←solution:「$O$에서 두 꼭짓점 $B, C$를」
- condition: (없음)

**how** 외심 성질 각 BOC = 2 * 각 A 에서 2 * 70도 = 140도임을 확인해 ④로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 외심 $O$에서 두 꼭짓점 $B, C$를 잇는 중심각 $\angle BOC$의 크기는 꼭지각 $\angle A$의 크기의 $2$배이다.
$$
\angle BOC = 2\angle A
$$
주어진 조건에서 $\angle A = 70^\circ$이므로
$$
\angle BOC = 2 \times 70^\circ = 140^\circ
$$
따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (소단원, RPM, PT, TPL, 난이도)

**발문**

원뿔 모양의 그릇에 일정한 속력으로 물을 채우고 있다. 물의 높이가 전체 높이의 $\dfrac{1}{2}$이 될 때까지 물을 채우는 데 $5$분이 걸렸다면, 이 그릇에 물을 가득 채울 때까지 앞으로 몇 분이 더 걸리겠는가? (단, 그릇의 두께는 생각하지 않는다.) [5점]

**보기** ① $25\text{분}$  ② $30\text{분}$  ③ $35\text{분}$  ④ $40\text{분}$  ⑤ $45\text{분}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 작은 원뿔과 전체 원뿔의 닮음비는 높이의 비와 같으므로 1 : 2 이다.
2. 닮은 입체도형의 부피의 비는 닮음비의 세제곱인 1^3 : 2^3 = 1 : 8 이다.
3. 현재 채워진 물의 양이 1이고 가득 채우려면 8 - 1 = 7 만큼을 더 채워야 한다.
4. 부피 1을 채우는 데 5분이 걸렸으므로 앞으로 더 걸리는 시간은 5 * 7 = 35분이다.
5. 따라서 앞으로 35분이 더 걸린다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-SIMILARITY_BASIC → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「원뿔 모양의 그릇에 일정한 속력으로」
**RPM** M2-RPM-208 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비] **원천→판정: 도형의 닮음 > 도형의 닮음 > 닮은 도형의 성질 > 닮은 입체도형의 부피의 비의 활용 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비**
- 이유: 원뿔의 닮음비 1:2 에서 부피비 1:8 을 유도하고 남은 부피 7배에 해당하는 시간 35분을 구하는 단계이다.
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_AREA_VOLUME **원천→판정: PT_M2_SIMILAR_VOLUME_TIME → PT_SIMILAR_FIGURES** **원천→판정: TPL_CONE_WATER_FILLING_TIME → TPL_SIMILAR_FIGURES_AREA_VOLUME**
- 이유: 원뿔 입체도형의 부피비 1:8 을 이용하여 추가로 걸리는 시간 35분을 구하는 활용 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 높이비 1:2 에서 부피비 1:8 을 세우고 8 - 1 = 7 로 5 * 7 = 35분을 계산하는 전형적인 난이도 2 문항이다.

**4칸**
- given: 원뿔←stem:「원뿔 모양의 그릇에」
- goal: 높이←stem:「있다. 물의 높이가 전체 높이의」
- method: 부피(NAMED)←solution:「입체도형에서 부피의 비는 닮음비」
- condition: (없음)

**how** 원뿔 부피비 1:8 에서 남은 7배의 부피를 채우는 시간이 5 * 7 = 35분임을 구해 ③으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. 물이 채워진 작은 원뿔과 전체 원뿔은 서로 닮은 입체도형이다.
물의 높이가 전체 높이의 $\dfrac{1}{2}$이므로 닮음비는
$$
1 : 2
$$
2. 닮은 입체도형에서 부피의 비는 닮음비의 세제곱의 비와 같다.
$$
1^3 : 2^3 = 1 : 8
$$
3. 현재 채워진 물의 부피는 전체 부피의 $\dfrac{1}{8}$이므로, 앞으로 더 채워야 하는 물의 부피는 전체의
$$
8 - 1 = 7\text{배}
$$
이다.
4. 물을 채우는 속력이 일정하므로 걸리는 시간은 채우는 부피에 정비례한다.
따라서 앞으로 더 걸리는 시간은
$$
5 \times 7 = 35\text{ (분)}
$$
정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

정사각형 $ABCD$의 꼭짓점 $B$를 지나는 직선과 변 $CD$가 만나는 점을 $E$라 하자. 두 꼭짓점 $A, C$에서 직선 $BE$에 내린 수선의 발을 각각 $F, G$라 할 때, $\overline{AF} = 15\text{ cm}$, $\overline{CG} = 9\text{ cm}$이다. 점 $B, F, G$가 순서대로 놓여 있을 때, $\triangle AFG$의 넓이는? [5점]

**보기** ① $27\text{ cm}^2$  ② $30\text{ cm}^2$  ③ $36\text{ cm}^2$  ④ $40\text{ cm}^2$  ⑤ $45\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 정사각형 ABCD 에서 AB = BC 이고 각 B = 90도이므로 직각삼각형 ABF 와 BCG 는 RHA 합동이다.
2. 따라서 대응변의 길이는 같으므로 BF = CG = 9 cm, BG = AF = 15 cm 이다.
3. 세 점 B, F, G 가 순서대로 놓여 있으므로 FG = BG - BF = 15 - 9 = 6 cm 이다.
4. 삼각형 AFG 에서 AF 와 FG 가 수직이므로 넓이는 1/2 * 6 * 15 = 45 cm^2 이다.
5. 따라서 삼각형 AFG의 넓이는 45 cm^2 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「1. 직각삼각형 $ABF$와」
**RPM** M2-RPM-181 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] **원천→판정: 도형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 조건 > 직각삼각형의 합동 조건의 활용 → 삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA**
- 이유: 정사각형 꼭짓점에서 수선을 내려 RHA 합동으로 FG = 6 cm 를 구하고 넓이 45 cm^2 를 계산하는 단계이다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE **원천→판정: PT_M2_RIGHT_TRIANGLE_CONGRUENCE → PT_RIGHT_TRIANGLE_CONGRUENCE** **원천→판정: TPL_SQUARE_INTERNAL_RIGHT_TRIANGLES_AREA → TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE**
- 이유: 직각삼각형의 RHA 합동 성질을 이용하여 변의 길이를 찾고 삼각형 AFG 의 넓이 45 cm^2 를 구하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 90도 각 관계에서 RHA 합동을 증명하고 15 와 9 의 차이로 밑변을 찾아 45 를 구하는 난이도 3 문항이다.

**4칸**
- given: 정사각형←stem:「정사각형 $ABCD$의」
- goal: 수선←stem:「BE$에 내린 수선의 발을 각각」
- method: 합동(NAMED)←solution:「$BCG$의 합동 증명: 정사각」
- condition: (없음)

**how** RHA 합동으로 BF = 9 cm, BG = 15 cm, FG = 6 cm 임을 찾아 넓이 1/2 * 6 * 15 = 45 cm^2 로 ⑤를 선택했다.

<details><summary>저장 해설 (판정 검토용)</summary>

1. 직각삼각형 $ABF$와 $BCG$의 합동 증명:
정사각형 $ABCD$이므로
$$
\overline{AB} = \overline{BC}, \quad \angle ABC = 90^\circ
$$
$\overline{AF} \perp \overline{BE}$, $\overline{CG} \perp \overline{BE}$이므로
$$
\angle AFB = \angle BGC = 90^\circ
$$
직각삼각형 $ABF$에서 $\angle BAF + \angle ABF = 90^\circ$이다.
또한 $\angle ABC = 90^\circ$이므로 $\angle CBG + \angle ABF = 90^\circ$이다.
따라서
$$
\angle BAF = \angle CBG
$$
빗변의 길이가 같고 한 예각의 크기가 같으므로
$$
\triangle ABF \cong \triangle BCG \quad (\text{RHA 합동})
$$


2. 선분 $FG$의 길이 계산:
합동인 두 삼각형의 대응변의 길이는 같으므로
$$
\overline{BF} = \overline{CG} = 9\text{ (cm)}, \quad \overline{BG} = \overline{AF} = 15\text{ (cm)}
$$
세 점 $B, F, G$가 순서대로 놓여 있으므로
$$
\overline{FG} = \overline{BG} - \overline{BF} = 15 - 9 = 6\text{ (cm)}
$$


3. $\triangle AFG$의 넓이:
$\overline{AF} \perp \overline{FG}$이므로
$$
\triangle AFG = \frac{1}{2} \times \overline{FG} \times \overline{AF} = \frac{1}{2} \times 6 \times 15 = 45\text{ (cm}^2\text{)}
$$
따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[서술형 1] $\triangle ABC$에서 변 $BC$의 중점을 $M$이라 하고, 점 $M$에서 두 변 $AB, AC$에 내린 수선의 발을 각각 $D, E$라 하자. $\overline{DM} = \overline{EM}$이고 $\angle A = 72^\circ$일 때, $\angle BMD$의 크기를 구하고, 그 풀이 과정을 서술하시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $36^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. M이 BC의 중점이므로 BM = CM 이고, 수선에 의해 각 BDM = 각 CEM = 90도이다.
2. DM = EM 이므로 빗변과 한 직각변의 길이가 같아 삼각형 BDM 과 CEM 은 RHS 합동이다.
3. 따라서 각 B = 각 C 이므로 삼각형 ABC 는 AB = AC 인 이등변삼각형이다.
4. 각 A = 72도이므로 밑각 각 B = (180도 - 72도) / 2 = 54도이다.
5. 직각삼각형 BDM 에서 각 BMD = 90도 - 54도 = 36도이다.
- 작성자 답: $36^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「AC$에 내린 수선의 발을 각각」
**RPM** M2-RPM-180 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] **원천→판정: 도형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 조건 > RHS 합동의 활용 → 삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS**
- 이유: 직각삼각형의 RHS 합동으로 각 B = 각 C = 54도를 구하고 각 BMD = 36도를 도출하는 서술 단계이다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE **원천→판정: PT_M2_RHS_CONGRUENCE_PROOF → PT_RIGHT_TRIANGLE_CONGRUENCE** **원천→판정: TPL_RHS_ISOSCELES_ANGLE_DERIVATION → TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE**
- 이유: RHS 합동과 이등변삼각형 밑각 54도를 이용하여 직각삼각형 속 각 BMD = 36도를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 90도 수선과 중점에서 RHS 합동을 보이고 꼭지각 72도로부터 36도를 계산하는 난이도 2 서술형 문항이다.

**4칸**
- given: 중점←stem:「변 $BC$의 중점을 $M$이라」
- goal: 수선←stem:「AC$에 내린 수선의 발을 각각」
- method: 합동(NAMED)←solution:「직각삼각형의 합동 증명 점 $M」
- condition: (없음)

**how** RHS 합동으로 각 B = 54도를 구하고 90도 직각삼각형 BDM 에서 각 BMD = 36도임을 서술하여 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

[풀이 과정]
1단계: 직각삼각형의 합동 증명
점 $M$이 선분 $BC$의 중점이므로
$$
\overline{BM} = \overline{CM}
$$
$\overline{MD} \perp \overline{AB}$, $\overline{ME} \perp \overline{AC}$이므로
$$
\angle BDM = \angle CEM = 90^\circ
$$
조건에서 $\overline{DM} = \overline{EM}$이다.
직각삼각형 $BDM$과 직각삼각형 $CEM$에서
- 빗변의 길이가 같다: $\overline{BM} = \overline{CM}$
- 한 직각변의 길이가 같다: $\overline{DM} = \overline{EM}$
따라서 두 직각삼각형은 합동이다 (RHS 합동).
$$
\triangle BDM \cong \triangle CEM \quad (\text{RHS 합동})
$$


2단계: 밑각 $\angle B$의 크기 구하기
합동인 두 삼각형에서 대응각의 크기는 서로 같으므로
$$
\angle B = \angle C
$$
따라서 $\triangle ABC$는 $\overline{AB} = \overline{AC}$인 이등변삼각형이다.
$\angle A = 72^\circ$이므로
$$
\angle B = \frac{180^\circ - 72^\circ}{2} = \frac{108^\circ}{2} = 54^\circ
$$


3단계: $\angle BMD$의 크기 구하기
직각삼각형 $BDM$에서 세 내각의 합은 $180^\circ$이므로
$$
\angle BMD = 180^\circ - \angle BDM - \angle B = 180^\circ - 90^\circ - 54^\circ = 36^\circ
$$
따라서 구하는 각의 크기는 $36^\circ$이다.


답: 36°

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[서술형 2] 마름모 $ABCD$에서 대각선 $AC$의 중점을 $O$라 하고, 변 $AB$ 위의 점 $E$와 변 $CD$ 위의 점 $F$에 대하여 선분 $EF$가 점 $O$를 지나며 $\overline{AC} = \overline{EF}$를 만족한다. $\angle EAO = 50^\circ$일 때, 다음 물음에 답하고 그 풀이 과정을 서술하시오. [총 7점]
(1) 사각형 $AECF$가 직사각형인 이유를 서술하시오. [5점]
(2) $\angle CEF$의 크기를 구하시오. [2점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 풀이 참조 / (2) $40^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) AE // CF, AO = CO, 엇각과 맞꼭지각에 의해 삼각형 AOE 와 COF 는 ASA 합동이다.
2. 따라서 OE = OF 이므로 두 대각선 AC, EF 가 서로를 이등분하여 사각형 AECF 는 평행사변형이다.
3. 여기에 두 대각선 길이 AC = EF 가 같으므로 사각형 AECF 는 직사각형이다.
4. (2) 직사각형이므로 각 AEC = 90도이고, OA = OE 에서 각 AEF = 각 EAO = 50도이다.
5. 따라서 각 CEF = 90도 - 50도 = 40도이다.
- 작성자 답: (1) 풀이 참조 / (2) $40^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「ABCD$에서 대각선 $AC$의 중」
**RPM** M2-RPM-196 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 도형의 성질 > 사각형의 성질 > 여러 가지 사각형 > 직사각형이 되는 조건 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: 대각선 이등분과 길이 같음으로 직사각형임을 증명하고 90도 - 50도 = 40도를 구하는 서술 단계이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS **원천→판정: PT_M2_RECTANGLE_PROOF → PT_QUADRILATERAL_PROPERTIES** **원천→판정: TPL_QUADRILATERAL_PROPERTIES_STEPWISE_PROOF → TPL_SPECIAL_QUADRILATERALS**
- 이유: 평행사변형에서 대각선 길이가 같아 직사각형이 되는 조건을 서술하고 50도 각을 이용해 40도를 구하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: ASA 합동과 대각선 조건으로 직사각형을 증명하고 90도에서 50도를 빼 40도를 얻는 난이도 3 문항이다.

**4칸**
- given: 마름모←stem:「[서술형 2] 마름모 $ABCD$에」
- goal: 직사각형←stem:「$AECF$가 직사각형인 이유를 서술」
- method: 합동(NAMED)←solution:「ext{ASA 합동}) $$ 합동」
- condition: (없음)

**how** ASA 합동과 대각선 성질로 직사각형을 증명한 뒤 90도 - 50도 = 40도로 각 CEF = 40도임을 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

[풀이 과정]
(1) 사각형 $AECF$가 직사각형인 이유:
1. 마름모 $ABCD$에서 대변이 평행하므로 $\overline{AB} \parallel \overline{CD}$이며, 따라서 $\overline{AE} \parallel \overline{CF}$이다.
2. 점 $O$는 선분 $AC$의 중점이므로 $\overline{AO} = \overline{CO}$이다.
3. $\overline{AE} \parallel \overline{CF}$에 의해 엇각의 크기가 같으므로 $\angle OAE = \angle OCF$이다.
또한 맞꼭지각의 크기가 같으므로 $\angle AOE = \angle COF$이다.
따라서 한 변의 길이와 그 양 끝 각의 크기가 각각 같으므로
$$
\triangle AOE \cong \triangle COF \quad (\text{ASA 합동})
$$
합동이므로 대응변 $\overline{OE} = \overline{OF}$이다.
4. 사각형 $AECF$에서 두 대각선 $AC, EF$가 점 $O$에서 서로 다른 것을 이등분하므로 사각형 $AECF$는 평행사변형이다.
5. 문제의 조건에서 두 대각선의 길이가 $\overline{AC} = \overline{EF}$로 같으므로, 사각형 $AECF$는 두 대각선의 길이가 같은 평행사변형, 즉 직사각형이다.


(2) $\angle CEF$의 크기 구하기:
사각형 $AECF$가 직사각형이므로
$$
\angle AEC = 90^\circ
$$
직사각형의 두 대각선은 길이가 같고 서로를 이등분하므로
$$
\overline{OA} = \overline{OE}
$$
따라서 $\triangle AOE$는 이등변삼각형이므로
$$
\angle AEF = \angle EAO = 50^\circ
$$
그러므로 구하는 각의 크기는
$$
\angle CEF = \angle AEC - \angle AEF = 90^\circ - 50^\circ = 40^\circ
$$
이다.


답: (1) 풀이 참조, (2) 40°

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 8점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, PT, TPL)

**발문**

[서술형 3] 삼각형 $ABC$의 외심을 $O$라 하고, 삼각형 $ABO$의 외심과 내심을 각각 점 $O', I$라 하자. 선분 $AI, AO, AC$가 순서대로 놓여 있고 $\angle OAC = x$, $\angle BAI = y$일 때, 다음 물음에 답하고 그 과정을 서술하시오. [총 8점]
(1) $\angle IAC$의 크기를 $x, y$를 사용하여 나타내시오. [4점]
(2) $\angle IAO' = 15^\circ$일 때, $y$의 값을 구하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $x + y$ / (2) $35^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) I가 삼각형 ABO의 내심이므로 AI는 각 BAO의 이등분선이다: 각 BAI = 각 IAO = y.
2. 순서에 의해 각 IAC = 각 IAO + 각 OAC = y + x = x + y 이다.
3. (2) O가 삼각형 ABC의 외심이므로 OA = OB 이고 각 BAO = 각 ABO = 2y, 각 AOB = 180도 - 4y 이다.
4. O'가 외심이므로 각 BOO' = 90도 - 2y 이고, 이등변삼각형 OBO'에서 각 OBO' = 90도 - 2y 이다.
5. 각 BAO' = 각 ABO' = 2y - (90도 - 2y) = 4y - 90도 이다.
6. 각 IAO' = 각 BAO' - 각 BAI = 4y - 90도 - y = 3y - 90도 = 15도에서 3y = 105도, y = 35도이다.
- 작성자 답: (1) $x + y$ / (2) $35^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] 삼각형 $ABC$의」
**RPM** M2-RPM-189 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 외심·내심을 이용한 복합도형] **원천→판정: 도형의 성질 > 삼각형의 성질 > 삼각형의 내심과 외심 > 내심과 외심의 성질의 활용 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 외심·내심을 이용한 복합도형**
- 이유: 외심과 내심이 복합된 도형에서 각의 이등분선과 외심의 이등변삼각형 성질로 3y = 105도, y = 35도를 구하는 단계이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_COMBINED **원천→판정: PT_M2_NESTED_CENTERS_ANGLES → PT_TRIANGLE_CENTERS** **원천→판정: TPL_INCENTER_CIRCUMCENTER_NESTED_EQUATION → TPL_TRIANGLE_CENTERS_COMBINED**
- 이유: 삼각형의 외심과 그 부분 삼각형의 외심, 내심이 결합된 복합도형에서 각 15도 조건으로 y = 35도를 구하는 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외심 2개와 내심 1개의 각 관계를 4단계에 걸쳐 추적하여 180도와 90도로부터 35도를 유도하는 난이도 4 서술형 문항이다.

**4칸**
- given: 외심←stem:「$ABC$의 외심을 $O$라 하」
- goal: 내심←stem:「O$의 외심과 내심을 각각 점 $」
- method: 수직이등분선(NAMED)←solution:「분 $AB$의 수직이등분선이자 꼭지각 $」
- condition: (없음)

**how** 내심에서 각 IAC = x + y 를 구하고 외심 복합 각 관계 3y - 90도 = 15도에서 y = 35도임을 서술하여 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

[풀이 과정]
(1) $\angle IAC$의 크기 나타내기:
점 $I$는 $\triangle ABO$의 내심이므로 선분 $AI$는 $\angle BAO$의 이등분선이다.
따라서
$$
\angle BAI = \angle IAO = y
$$
선분 $AI, AO, AC$가 순서대로 놓여 있으므로 $\angle IAC$는 $\angle IAO$와 $\angle OAC$의 합이다.
$$
\angle IAC = \angle IAO + \angle OAC = y + x = x + y
$$


(2) $y$의 값 구하기:
1. 점 $O$는 $\triangle ABC$의 외심이므로 $\overline{OA} = \overline{OB}$이다.
따라서 $\triangle AOB$는 이등변삼각형이다.
$\angle BAO = 2y$이므로
$$
\angle ABO = \angle BAO = 2y
$$
$$
\angle AOB = 180^\circ - 4y
$$
2. 점 $O'$는 $\triangle ABO$의 외심이므로 $\overline{O'A} = \overline{O'B} = \overline{O'O}$이다.
점 $O'$는 선분 $AB$의 수직이등분선이자 꼭지각 $\angle AOB$의 이등분선 위에 놓인다.
$$
\angle BOO' = \frac{1}{2}\angle AOB = \frac{180^\circ - 4y}{2} = 90^\circ - 2y
$$
$\triangle OBO'$에서 $\overline{O'B} = \overline{O'O}$이므로 이등변삼각형이고
$$
\angle OBO' = \angle BOO' = 90^\circ - 2y
$$
따라서
$$
\angle ABO' = \angle ABO - \angle OBO' = 2y - (90^\circ - 2y) = 4y - 90^\circ
$$
3. $\triangle ABO'$에서 $\overline{O'A} = \overline{O'B}$이므로 이등변삼각형이다.
$$
\angle BAO' = \angle ABO' = 4y - 90^\circ
$$
4. $\angle IAO'$의 크기는 $\angle BAO'$와 $\angle BAI$의 차이이므로
$$
\angle IAO' = \angle BAO' - \angle BAI = (4y - 90^\circ) - y = 3y - 90^\circ
$$
조건에서 $\angle IAO' = 15^\circ$이므로
$$
3y - 90^\circ = 15^\circ \implies 3y = 105^\circ \implies y = 35^\circ
$$
따라서 $y$의 값은 $35^\circ$이다.


답: (1) x + y, (2) 35°

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
