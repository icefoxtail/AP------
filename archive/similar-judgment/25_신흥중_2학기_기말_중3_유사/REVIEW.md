# 검수 묶음 — 25_신흥중_2학기_기말_중3_유사

- 단계: **CONVERTED (판정 검사 미통과: )**
- 문항 24개 / 검사 PASS 24, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 5, 2단계 13, 3단계 6
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q11**: 원천 값과 다른 칸 2개 (RPM, 난이도)
- **Q13**: 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점


**발문**

다음 그림의 원 $O$에서 호 $AB$에 대한 원주각의 크기가 $54^\circ$일 때, 같은 호에 대한 중심각 $\angle x$의 크기는? [3점]

**보기** ① $108^\circ$  ② $112^\circ$  ③ $116^\circ$  ④ $120^\circ$  ⑤ $124^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 한 호에 대한 중심각의 크기는 그 호에 대한 원주각의 크기의 2배이다.
2. 2) 원 O에서 호 AB에 대한 원주각이 54도이므로 중심각 x = 2 * 54도 = 108도이다.
3. 3) 따라서 각 x의 크기는 108도이다.
4. 4) 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 원 $O$에서 호 $AB$에 대한 원주각의 크기가 $54^\circ$일 때, 같은 호에 대한 중심각 $\angle x$의 크기는? [3점]」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] (원천과 같음)
- 이유: 호 AB에 대한 원주각 54도에서 중심각 x = 2 * 54도 = 108도를 구하는 M3-RPM-075 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC (원천과 같음) (원천과 같음)
- 이유: 호 AB에 대한 중심각의 크기가 원주각 54도의 2배인 108도임을 적용하는 TPL_CIRCLE_ANGLE_CENTER_ARC 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원주각 54도로부터 중심각 108도를 2배 공식으로 직접 계산하는 1단계 기본 문항이다.

**4칸**
- given: 원주각←stem:「호 $AB$에 대한 원주각의 크기가 $54^\circ$일 때」
- goal: 중심각←stem:「같은 호에 대한 중심각 $\angle x$의 크기는?」
- method: 호(NAMED)←stem:「다음 그림의 원 $O$에서 호 $AB$에 대한」
- condition: 원←stem:「다음 그림의 원 $O$에서 호 $AB$에」

**how** 호 AB에 대한 중심각 x는 원주각 54도의 2배인 108도임을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

한 호에 대한 중심각의 크기는 그 호에 대한 원주각의 크기의 $2$배이다. 따라서 원주각의 크기가 $54^\circ$이므로 중심각 $\angle x$의 크기는 $$ \begin{aligned} \angle x &= 2 \times 54^\circ \ &= 108^\circ \end{aligned} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점


**발문**

다음 그림과 같이 사각형 $ABCD$가 원 $O$에 내접할 때, $\angle A = 65^\circ$, $\angle B = 85^\circ$이다. $\angle C = \angle x$, $\angle D = \angle y$일 때, $\angle x - \angle y$의 값은? [3점]

**보기** ① $15^\circ$  ② $20^\circ$  ③ $25^\circ$  ④ $30^\circ$  ⑤ $35^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 사각형 ABCD가 원 O에 내접하므로 마주 보는 대각의 크기의 합은 180도이다.
2. 2) 각 x = 180도 - 각 A = 180도 - 65도 = 115도이다.
3. 3) 각 y = 180도 - 각 B = 180도 - 85도 = 95도이다.
4. 4) 따라서 각 x - 각 y = 115도 - 95도 = 20도이다.
5. 5) 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 사각형 $ABCD$가 원 $O$에 내접할 때, $\angle A = 65^\circ$, $\angle B = 85^\circ$이다. $\angle C = \angle x$, $\angle D = \angle y$일 때, $\angle x - \angle y$의 값은? [3점]」
**RPM** M3-RPM-077 [원의 성질 > 원주각 > 원주각의 활용 > 내접사각형의 각] (원천과 같음)
- 이유: 원 O에 내접하는 사각형 ABCD에서 대각의 합 180도를 이용하여 x = 115도, y = 95도를 구하고 x - y = 20도를 도출하는 M3-RPM-077 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_INSCRIBED_QUADRILATERAL_OPPOSITE_ANGLES (원천과 같음) **원천→판정: TPL_CIRCLE_ANGLE_COMPOSITE → TPL_CIRCLE_INSCRIBED_QUADRILATERAL_OPPOSITE_ANGLES**
- 이유: 원에 내접하는 사각형의 마주 보는 두 대각의 합이 180도임을 이용하여 미지각을 구하는 TPL_CIRCLE_INSCRIBED_QUADRILATERAL_OPPOSITE_ANGLES 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내접사각형 대각의 성질 180도에서 각 x = 115도, 각 y = 95도를 구하여 뺄셈 20도를 수행하는 1단계 기본 문항이다.

**4칸**
- given: 사각형←stem:「사각형 $ABCD$가 원 $O$에 내접할 때」
- goal: 차←stem:「$\angle x - \angle y$의 값은?」
- method: 내접(NAMED)←stem:「사각형 $ABCD$가 원 $O$에 내접할 때」
- condition: 각←stem:「$\angle A = 65^\circ$, $\angle B = 85^\circ$이다.」

**how** 원 O에 내접하는 사각형의 성질로 x = 180 - 65 = 115도, y = 180 - 85 = 95도에서 x - y = 20도임을 도출하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원에 내접하는 사각형의 마주 보는 두 대각의 크기의 합은 $180^\circ$이다. 따라서 각 대각의 크기는 다음과 같다. $$ \begin{aligned} \angle x &= 180^\circ - \angle A = 180^\circ - 65^\circ = 115^\circ \ \angle y &= 180^\circ - \angle B = 180^\circ - 85^\circ = 95^\circ \end{aligned} $$ 그러므로 두 각의 차는 다음과 같다. $$ \begin{aligned} \angle x - \angle y &= 115^\circ - 95^\circ \ &= 20^\circ \end{aligned} $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

다음 그림의 원 $O$에서 길이가 각각 $4,\mathrm{cm}$로 같은 두 호에 대하여 한 호를 바라보는 원주각의 크기가 $28^\circ$일 때, 두 호를 합친 전체 호에 대한 중심각 $\angle x$의 크기는? [4점]

**보기** ① $104^\circ$  ② $108^\circ$  ③ $112^\circ$  ④ $116^\circ$  ⑤ $120^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 길이가 4 cm로 같은 두 호에 대해 한 호의 원주각이 28도이므로 한 호의 중심각은 2 * 28도 = 56도이다.
2. 2) 호의 길이가 같으면 중심각의 크기도 같으므로 다른 한 호의 중심각 역시 56도이다.
3. 3) 두 호를 합친 전체 호에 대한 중심각 x = 56도 + 56도 = 112도이다.
4. 4) 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 원 $O$에서 길이가 각각 $4,\mathrm{cm}$로 같은 두 호에 대하여 한 호를 바라보는 원주각의 크기가 $28^\circ$일 때, 두 호를 합친 전체 호에 대한 중심각 $\angle x$의 크기는? [4점]」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] (원천과 같음)
- 이유: 길이 4 cm인 호의 원주각 28도에서 중심각 56도를 구하고 두 호의 합친 중심각 x = 112도를 산출하는 M3-RPM-075 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC (원천과 같음) (원천과 같음)
- 이유: 원주각 28도와 중심각 56도의 2배 관계 및 같은 길이 호의 중심각 가법성을 이용하는 TPL_CIRCLE_ANGLE_CENTER_ARC 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원주각과 중심각의 2배 관계에 더해 같은 길이 호의 중심각 56도를 합산하여 112도를 구하는 2단계 문항이다.

**4칸**
- given: 호←stem:「길이가 각각 $4,\mathrm{cm}$로 같은 두 호에 대하여」
- goal: 중심각←stem:「두 호를 합친 전체 호에 대한 중심각 $\angle x$의 크기는?」
- method: 원주각(NAMED)←stem:「한 호를 바라보는 원주각의 크기가 $28^\circ$일 때」
- condition: 길이←stem:「길이가 각각 $4,\mathrm{cm}$로 같은 두 호에 대하여」

**how** 길이 4 cm인 한 호의 중심각 56도와 다른 호의 중심각 56도를 합하여 중심각 x = 112도임을 계산해 정답 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원주각의 크기는 같은 호에 대한 중심각의 크기의 절반이므로 길이 $4,\mathrm{cm}$인 한 호에 대한 중심각의 크기는 $$ \begin{aligned} 2 \times 28^\circ = 56^\circ \end{aligned} $$ 두 호의 길이가 같으므로 다른 한 호에 대한 중심각의 크기도 $56^\circ$이다. 따라서 두 호를 합친 전체 호에 대한 중심각 $\angle x$의 크기는 $$ \begin{aligned} \angle x &= 56^\circ + 56^\circ \ &= 112^\circ \end{aligned} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

다음 그림에서 직선 $AT$가 원 $O$의 접선이고 점 $A$가 그 접점이다. $\overline{BC}$가 원 $O$의 지름이고 $\angle ABO = 32^\circ$일 때, 예각 $\angle x = \angle BAT$의 크기는? [4점]

**보기** ① $52^\circ$  ② $54^\circ$  ③ $56^\circ$  ④ $58^\circ$  ⑤ $60^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 선분 OA와 OB는 원 O의 반지름이므로 이등변삼각형 OAB에서 각 OAB = 각 ABO = 32도이다.
2. 2) 접선 AT는 접점 A를 지나는 반지름 OA와 수직이므로 각 OAT = 90도이다.
3. 3) 따라서 각 x = 각 BAT = 각 OAT - 각 OAB = 90도 - 32도 = 58도이다.
4. 4) 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_LINE(원과 직선) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 직선 $AT$가 원 $O$의 접선이고 점 $A$가 그 접점이다. $\overline{BC}$가 원 $O$의 지름이고 $\angle ABO = 32^\circ$일 때, 예각 $\angle x = \angle BAT$의 크기는? [4점]」
**RPM** M3-RPM-070 [원의 성질 > 원과 직선 > 원의 접선 > 접점의 반지름과 접선] (원천과 같음)
- 이유: 반지름 OA와 접선 AT의 수직 관계(각 OAT = 90도) 및 이등변삼각형 각 OAB = 32도를 이용해 각 x = 58도를 구하는 M3-RPM-070 문제이다.
**유형** PT=PT_CIRCLE_LINE_RELATION / TPL=NONE (원천과 같음) **원천→판정: TPL_CIRCLE_ANGLE_TANGENT_CHORD → NONE**
- 이유: 원의 접선이 접점에서의 반지름과 이루는 각이 90도임을 이용하여 각을 계산하는 PT_CIRCLE_LINE_RELATION 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형 OAB의 밑각 32도와 접선 수직 조건 90도의 차 58도를 구하는 2단계 문항이다.

**4칸**
- given: 접선←stem:「직선 $AT$가 원 $O$의 접선이고 점 $A$가 그 접점이다.」
- goal: 각←stem:「예각 $\angle x = \angle BAT$의 크기는?」
- method: 지름(NAMED)←stem:「$\overline{BC}$가 원 $O$의 지름이고」
- condition: 반지름←solution:「선분 $OA$와 $OB$는 모두 원 $O$의 반지름이므로」

**how** 반지름 OA와 접선 AT의 수직각 90도에서 이등변삼각형 밑각 32도를 빼어 각 x = 58도임을 확인하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

선분 $OA$와 $OB$는 모두 원 $O$의 반지름이므로 $$ \begin{aligned} \overline{OA} = \overline{OB} \end{aligned} $$ 따라서 $\triangle OAB$는 이등변삼각형이므로 두 밑각의 크기는 같다. $$ \begin{aligned} \angle OAB = \angle ABO = 32^\circ \end{aligned} $$ 원의 접선 $AT$는 접점 $A$를 지나는 반지름 $OA$와 수직이므로 $$ \begin{aligned} \angle OAT = 90^\circ \end{aligned} $$ 따라서 구하는 각 $\angle x$의 크기는 $$ \begin{aligned} \angle x &= \angle OAT - \angle OAB \ &= 90^\circ - 32^\circ \ &= 58^\circ \end{aligned} $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

다음 그림에서 원 $O$ 밖의 한 점 $A$에서 이 원에 그은 두 접선의 접점을 각각 $B$와 $C$라고 하자. 원 $O$ 위의 한 점 $D$에 대하여 $\angle BDC = 65^\circ$일 때, 두 접선이 이루는 각 $\angle CAB$의 크기는? [4점]

**보기** ① $42^\circ$  ② $44^\circ$  ③ $46^\circ$  ④ $48^\circ$  ⑤ $50^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 호 BC에 대한 원주각 각 BDC = 65도이므로 중심각 각 BOC = 2 * 65도 = 130도이다.
2. 2) 원 밖의 점 A에서 그은 두 접선의 접점 B, C에서 반지름과 접선은 수직이므로 각 ABO = 각 ACO = 90도이다.
3. 3) 사각형 ABOC의 내각의 총합은 360도이므로 각 CAB = 360도 - (90도 + 90도 + 130도) = 50도이다.
4. 4) 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 원 $O$ 밖의 한 점 $A$에서 이 원에 그은 두 접선의 접점을 각각 $B$와 $C$라고 하자. 원 $O$ 위의 한 점 $D$에 대하여 $\angle BDC = 65^\circ$일 때, 두 접선이 이루는 각 $\angle CAB$의 크기는? [4점]」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] (원천과 같음)
- 이유: 원주각 65도로부터 중심각 130도를 구하고 접선의 수직 조건 90도와 사각형 내각의 합 360도를 결합해 각 CAB = 50도를 구하는 M3-RPM-075 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 원주각과 중심각의 관계(65도 -> 130도) 및 접선의 수직각을 사각형 내각합에 종합 적용하는 TPL_CIRCLE_ANGLE_COMPOSITE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원주각 65도를 중심각 130도로 변환하고 사각형 ABOC 내각합 360도에서 50도를 유도하는 2단계 문항이다.

**4칸**
- given: 접점←stem:「두 접선의 접점을 각각 $B$와 $C$라고 하자.」
- goal: 각←stem:「두 접선이 이루는 각 $\angle CAB$의 크기는?」
- method: 원주각(NAMED)←solution:「$\angle BDC = 65^\circ$는 호 $BC$를 바라보는 원주각이므로」
- condition: 접선←stem:「한 점 $A$에서 이 원에 그은 두 접선의」

**how** 호 BC의 원주각 65도에서 중심각 130도를 구하고 두 접점의 수직각 90도와 사각형 내각합 360도를 결합해 각 CAB = 50도임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle BDC = 65^\circ$는 호 $BC$를 바라보는 원주각이므로 같은 호 $BC$에 대한 중심각은 $$ \begin{aligned} \angle BOC = 2 \times 65^\circ = 130^\circ \end{aligned} $$ 접점 $B, C$에서 반지름과 접선은 수직이므로 $$ \begin{aligned} \angle ABO = \angle ACO = 90^\circ \end{aligned} $$ 사각형 $ABOC$의 네 내각의 크기의 합은 $360^\circ$이므로 $$ \begin{aligned} \angle CAB &= 360^\circ - (\angle ABO + \angle ACO + \angle BOC) \ &= 360^\circ - (90^\circ + 90^\circ + 130^\circ) \ &= 360^\circ - 310^\circ \ &= 50^\circ \end{aligned} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 5점


**발문**

다음 그림과 같이 $\overline{AB}$를 지름으로 하는 큰 반원과 $\overline{AB}$ 위의 한 점 $C$에 대하여 $\overline{BC}$를 지름으로 하는 작은 반원이 있다. 점 $A$에서 작은 반원에 그은 접선이 작은 반원과 만나는 접점을 $D$라 하고, 큰 반원과 만나는 점을 $E$라고 하자. $\wideparen{AE}=24,\mathrm{cm}$, $\angle BDE=60^\circ$일 때, 호 $\wideparen{BE}$의 길이는? [5점]

**보기** ① $12,\mathrm{cm}$  ② $13,\mathrm{cm}$  ③ $14,\mathrm{cm}$  ④ $15,\mathrm{cm}$  ⑤ $16,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 접선과 현이 이루는 각의 성질로 각 BCD = 각 BDE = 60도이고, 반원 원주각 각 BDC = 90도이므로 삼각형 BCD에서 각 DBC = 30도이다.
2. 2) 세 점 A, D, E가 일직선이므로 각 BDA = 180도 - 60도 = 120도이고, 삼각형 ABD에서 각 BAE = 180도 - 120도 - 30도 = 30도이다.
3. 3) 큰 반원에서 호 BE의 원주각이 30도이므로 중심각은 60도이고, 호 AE의 중심각은 180도 - 60도 = 120도이다.
4. 4) 호의 길이는 중심각에 비례하므로 호 BE : 호 AE = 60도 : 120도 = 1 : 2이다.
5. 5) 호 AE = 24 cm이므로 호 BE = 24 * (1/2) = 12 cm이다.
6. 6) 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\overline{AB}$를 지름으로 하는 큰 반원과 $\overline{AB}$ 위의 한 점 $C$에 대하여 $\overline{BC}$를 지름으로 하는 작은 반원이 있다. 점 $A$에서 작은 반원에 그은 접선이 작은 반원과 만나는 접점을 $D$라 하고, 큰 반원과 만나는 점을 $E$라고 하자. $\wideparen{AE}=24,\mathrm{cm}$, $\angle BDE=60^\circ$일 때, 호 $\wideparen{BE}$의 길이는? [5점]」
**RPM** M3-RPM-079 [원의 성질 > 원주각 > 원주각의 활용 > 접선과 현이 이루는 각] (원천과 같음)
- 이유: 접선과 현이 이루는 각 60도와 반원 원주각 성질을 결합해 각 BAE = 30도를 유도하고 호 AE = 24 cm에 비례해 호 BE = 12 cm를 구하는 M3-RPM-079 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_TANGENT_CHORD (원천과 같음) (원천과 같음)
- 이유: 접선과 현이 이루는 각 60도 성질 및 원주각-중심각 비례를 이용해 호 BE의 길이 12 cm를 도출하는 TPL_CIRCLE_ANGLE_TANGENT_CHORD 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 작은 반원의 접선과 현이 이루는 각 60도와 큰 반원의 원주각 30도를 연결하여 호의 길이 12 cm를 비례식으로 구하는 3단계 심화 문항이다.

**4칸**
- given: 접선←stem:「작은 반원에 그은 접선이 작은 반원과 만나는 접점을 $D$라」
- goal: 길이←stem:「호 $\wideparen{BE}$의 길이는?」
- method: 원주각(NAMED)←solution:「반원에 대한 원주각은 직각이다.」
- condition: 지름←stem:「$\overline{AB}$를 지름으로 하는 큰 반원과」

**how** 접선과 현의 성질 각 BCD = 60도와 반원 원주각 각 BDC = 90도에서 각 BAE = 30도를 구하고 중심각 비 60:120 = 1:2로 호 BE = 12 cm임을 도출하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직선 $AD$는 작은 반원의 접점 $D$에서의 접선이다. 접선과 현이 이루는 각의 성질에 의하여 $$ \begin{aligned} \angle BCD = \angle BDE = 60^\circ \end{aligned} $$ $\overline{BC}$가 작은 반원의 지름이므로 반원에 대한 원주각은 직각이다. $$ \begin{aligned} \angle BDC = 90^\circ \end{aligned} $$ 따라서 $\triangle BCD$에서 $$ \begin{aligned} \angle DBC = 180^\circ - 90^\circ - 60^\circ = 30^\circ \end{aligned} $$ 세 점 $A, C, B$가 한 직선 위에 있으므로 $\angle ABD = 30^\circ$이다. 또한 세 점 $A, D, E$가 한 직선 위에 있으므로 $$ \begin{aligned} \angle BDA = 180^\circ - 60^\circ = 120^\circ \end{aligned} $$ $\triangle ABD$의 내각의 크기의 합은 $180^\circ$이므로 $$ \begin{aligned} \angle BAE = \angle BAD = 180^\circ - 120^\circ - 30^\circ = 30^\circ \end{aligned} $$ 큰 반원에서 원주각 $\angle BAE = 30^\circ$가 바라보는 호 $BE$에 대한 중심각은 $$ \begin{aligned} 2 \times 30^\circ = 60^\circ \end{aligned} $$ 따라서 호 $AE$에 대한 중심각은 $$ \begin{aligned} 180^\circ - 60^\circ = 120^\circ \end{aligned} $$ 같은 원에서 호의 길이는 중심각의 크기에 정비례하므로 $$ \begin{aligned} \wideparen{BE} : \wideparen{AE} &= 60^\circ : 120^\circ = 1 : 2 \ \wideparen{BE} &= 24 \times \dfrac{1}{2} = 12,\mathrm{cm} \end{aligned} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

다음 그림에서 사각형 $ABCD$는 원에 내접한다. 두 변 $\overline{AB}$, $\overline{CD}$의 연장선의 교점을 $E$, 두 변 $\overline{AD}$, $\overline{BC}$의 연장선의 교점을 $F$라고 하자. $\angle AED = 26^\circ$, $\angle AFB = 30^\circ$일 때, $\angle x = \angle BCD$의 크기는? [4점]

**보기** ① $60^\circ$  ② $62^\circ$  ③ $64^\circ$  ④ $66^\circ$  ⑤ $68^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 원의 네 호 AB, BC, CD, DA의 중심각을 각각 a, b, c, d라 하자.
2. 2) 할선 각의 성질에서 (b - d) / 2 = 26도이므로 b - d = 52도이다.
3. 3) 마찬가지로 (c - a) / 2 = 30도이므로 c - a = 60도이다.
4. 4) a + b + c + d = 360도에 대입하면 2(a + d) + 112도 = 360도이므로 a + d = 124도이다.
5. 5) 각 x = 각 BCD는 호 BAD(= a + d)를 바라보는 원주각이므로 각 x = 124도 / 2 = 62도이다.
6. 6) 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 사각형 $ABCD$는 원에 내접한다. 두 변 $\overline{AB}$, $\overline{CD}$의 연장선의 교점을 $E$, 두 변 $\overline{AD}$, $\overline{BC}$의 연장선의 교점을 $F$라고 하자. $\angle AED = 26^\circ$, $\angle AFB = 30^\circ$일 때, $\angle x = \angle BCD$의 크기는? [4점]」
**RPM** M3-RPM-080 [원의 성질 > 원주각 > 원주각의 활용 > 복합 각 추론] (원천과 같음)
- 이유: 내접사각형의 두 쌍의 대변 연장선이 이루는 각 26도와 30도에서 호의 차와 합 관계를 결합해 원주각 x = 62도를 구하는 M3-RPM-080 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 원 외부 교점의 각 26도, 30도를 호의 차로 표현하고 전체 호의 합 360도와 연립하여 원주각 x = 62도를 계산하는 TPL_CIRCLE_ANGLE_COMPOSITE 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 할선이 이루는 두 각 26도, 30도로부터 호의 연립방정식을 세워 원주각 62도를 도출하는 3단계 복합 추론 문항이다.

**4칸**
- given: 내접←stem:「사각형 $ABCD$는 원에 내접한다.」
- goal: 각←stem:「$\angle x = \angle BCD$의 크기는?」
- method: 원주각(NAMED)←solution:「$\angle x = \angle BCD$는 호 $BAD$($=a+d$)를 바라보는 원주각이므로」
- condition: 교점←stem:「연장선의 교점을 $E$, 두 변 $\overline{AD}$, $\overline{BC}$의 연장선의 교점을 $F$라고」

**how** 외부 교점의 각 26도와 30도로부터 b - d = 52도, c - a = 60도를 얻고 전체 호 합 360도에서 a + d = 124도를 유도하여 각 x = 62도임을 확인해 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 위의 네 호 $\wideparen{AB}, \wideparen{BC}, \wideparen{CD}, \wideparen{DA}$의 크기를 각각 $a, b, c, d$라 하자. 원 밖의 점 $E$에서 두 할선이 이루는 각이 $26^\circ$이므로 $$ \begin{aligned} \dfrac{b - d}{2} = 26^\circ \implies b - d = 52^\circ \implies b = d + 52^\circ \end{aligned} $$ 원 밖의 점 $F$에서 두 할선이 이루는 각이 $30^\circ$이므로 $$ \begin{aligned} \dfrac{c - a}{2} = 30^\circ \implies c - a = 60^\circ \implies c = a + 60^\circ \end{aligned} $$ 원 전체의 네 호의 크기의 합은 $360^\circ$이므로 $$ \begin{aligned} a + b + c + d &= 360^\circ \ a + (d + 52^\circ) + (a + 60^\circ) + d &= 360^\circ \ 2(a + d) + 112^\circ &= 360^\circ \ 2(a + d) &= 248^\circ \ a + d &= 124^\circ \end{aligned} $$ $\angle x = \angle BCD$는 호 $BAD$($=a+d$)를 바라보는 원주각이므로 $$ \begin{aligned} \angle x &= \dfrac{a + d}{2} \ &= \dfrac{124^\circ}{2} \ &= 62^\circ \end{aligned} $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 그림에서 $\angle ADB = 35^\circ$, $\angle DAC = 65^\circ$이고, $\wideparen{AB} = \wideparen{BC}$일 때, $\angle ABD$의 크기는? [4점]

**보기** ① $35^\circ$  ② $40^\circ$  ③ $45^\circ$  ④ $50^\circ$  ⑤ $55^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 호 AB를 바라보는 원주각이 35도이므로 호 AB의 중심각 크기는 2 * 35도 = 70도이다.
2. 2) 호 AB = 호 BC이므로 호 BC의 크기도 70도이다.
3. 3) 호 DC를 바라보는 원주각 각 DAC = 65도이므로 호 DC의 크기는 2 * 65도 = 130도이다.
4. 4) 남은 호 AD의 크기는 360도 - (70도 + 70도 + 130도) = 360도 - 270도 = 90도이다.
5. 5) 따라서 각 ABD는 호 AD를 바라보는 원주각이므로 각 ABD = 90도 / 2 = 45도이다.
6. 6) 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $\angle ADB = 35^\circ$, $\angle DAC = 65^\circ$이고, $\wideparen{AB} = \wideparen{BC}$일 때, $\angle ABD$의 크기는? [4점]」
**RPM** M3-RPM-074 [원의 성질 > 원주각 > 원주각과 중심각 > 같은 호에 대한 원주각] (원천과 같음)
- 이유: 원주각 35도와 65도로부터 호의 중심각 70도, 130도를 구하고 전체 360도에서 호 AD = 90도를 구해 각 ABD = 45도를 도출하는 M3-RPM-074 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 원주각과 호의 중심각 비례 관계 및 호의 덧셈 성질을 이용해 미지 원주각 ABD = 45도를 구하는 TPL_CIRCLE_ANGLE_COMPOSITE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 원주각 35도, 65도로부터 호의 크기를 각각 환산하고 남은 호 90도로 각 ABD = 45도를 구하는 2단계 문항이다.

**4칸**
- given: 호←stem:「$\wideparen{AB} = \wideparen{BC}$일 때」
- goal: 각←stem:「$\angle ABD$의 크기는?」
- method: 원주각(NAMED)←solution:「$\angle ADB = 35^\circ$는 호 $AB$를 바라보는 원주각이므로」
- condition: 원←solution:「원 전체의 호의 둘레는 $360^\circ$이므로」

**how** 호 AB = 호 BC = 70도, 호 DC = 130도에서 남은 호 AD = 90도를 얻어 원주각 각 ABD = 45도임을 도출하여 정답 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ADB = 35^\circ$는 호 $AB$를 바라보는 원주각이므로 호 $AB$의 크기는 $$ \begin{aligned} \wideparen{AB} = 2 \times 35^\circ = 70^\circ \end{aligned} $$ $\wideparen{AB} = \wideparen{BC}$이므로 호 $BC$의 크기도 $70^\circ$이다. 또한 $\angle DAC = 65^\circ$는 호 $DC$를 바라보는 원주각이므로 호 $DC$의 크기는 $$ \begin{aligned} \wideparen{DC} = 2 \times 65^\circ = 130^\circ \end{aligned} $$ 원 전체의 호의 둘레는 $360^\circ$이므로 남은 호 $AD$의 크기는 $$ \begin{aligned} \wideparen{AD} &= 360^\circ - (\wideparen{AB} + \wideparen{BC} + \wideparen{DC}) \ &= 360^\circ - (70^\circ + 70^\circ + 130^\circ) \ &= 360^\circ - 270^\circ \ &= 90^\circ \end{aligned} $$ $\angle ABD$는 호 $AD$를 바라보는 원주각이므로 $$ \begin{aligned} \angle ABD = \dfrac{90^\circ}{2} = 45^\circ \end{aligned} $$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 5점


**발문**

다음 그림에서 두 반직선 $\overrightarrow{PA}, \overrightarrow{PD}$는 원 $O$의 접선이고, 점 $Q$는 선분 $\overline{AC}$와 $\overline{BD}$의 교점이다. $\wideparen{AB} = \wideparen{BC} = \wideparen{CD}$이고 $\angle APD = 60^\circ$일 때, $\angle BQC$의 크기는? [5점]

**보기** ① $88^\circ$  ② $92^\circ$  ③ $96^\circ$  ④ $100^\circ$  ⑤ $104^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 두 접선 PA, PD가 이루는 각이 60도이므로 작은 호 AD의 중심각은 180도 - 60도 = 120도이다.
2. 2) 나머지 큰 호 ABCD의 크기는 360도 - 120도 = 240도이다.
3. 3) 호 AB = 호 BC = 호 CD이므로 세 호는 각각 240도 / 3 = 80도이다.
4. 4) 원주각 각 QBC = 80도 / 2 = 40도이고, 각 QCB = 80도 / 2 = 40도이다.
5. 5) 삼각형 BQC의 내각의 합은 180도이므로 각 BQC = 180도 - 40도 - 40도 = 100도이다.
6. 6) 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 두 반직선 $\overrightarrow{PA}, \overrightarrow{PD}$는 원 $O$의 접선이고, 점 $Q$는 선분 $\overline{AC}$와 $\overline{BD}$의 교점이다. $\wideparen{AB} = \wideparen{BC} = \wideparen{CD}$이고 $\angle APD = 60^\circ$일 때, $\angle BQC$의 크기는? [5점]」
**RPM** M3-RPM-080 [원의 성질 > 원주각 > 원주각의 활용 > 복합 각 추론] (원천과 같음)
- 이유: 접선 사이 각 60도로부터 큰 호 ABCD = 240도를 구하고 3등분 호 80도의 원주각 40도를 결합해 각 BQC = 100도를 구하는 M3-RPM-080 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 접선 각 60도와 등분된 세 호의 크기 80도로부터 삼각형 BQC의 두 밑각 40도와 꼭지각 100도를 도출하는 TPL_CIRCLE_ANGLE_COMPOSITE 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접선 각 60도로부터 호의 크기 240도 및 3등분 80도를 구하고 삼각형 내각합으로 각 BQC = 100도를 유도하는 3단계 복합 문항이다.

**4칸**
- given: 접선←stem:「두 반직선 $\overrightarrow{PA}, \overrightarrow{PD}$는 원 $O$의 접선이고」
- goal: 각←stem:「$\angle BQC$의 크기는?」
- method: 원주각(NAMED)←solution:「호 $CD$를 바라보는 원주각이므로」
- condition: 호←stem:「$\wideparen{AB} = \wideparen{BC} = \wideparen{CD}$이고」

**how** 접선 각 60도에서 호 AD = 120도, 큰 호 240도의 3등분 호 80도를 얻어 밑각 각 QBC = 각 QCB = 40도에서 각 BQC = 100도임을 도출하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

원 밖의 점 $P$에서 그은 두 접선 $PA, PD$가 이루는 각이 $60^\circ$이므로 작은 호 $AD$의 중심각은 $$ \begin{aligned} 180^\circ - 60^\circ = 120^\circ \end{aligned} $$ 따라서 나머지 큰 호 $ABCD$의 크기는 $$ \begin{aligned} 360^\circ - 120^\circ = 240^\circ \end{aligned} $$ $\wideparen{AB} = \wideparen{BC} = \wideparen{CD}$이므로 각 호의 크기는 다음과 같다. $$ \begin{aligned} \wideparen{AB} = \wideparen{BC} = \wideparen{CD} = \dfrac{240^\circ}{3} = 80^\circ \end{aligned} $$ $\angle QBC = \angle DBC$는 호 $CD$를 바라보는 원주각이므로 $$ \begin{aligned} \angle QBC = \dfrac{80^\circ}{2} = 40^\circ \end{aligned} $$ $\angle QCB = \angle ACB$는 호 $AB$를 바라보는 원주각이므로 $$ \begin{aligned} \angle QCB = \dfrac{80^\circ}{2} = 40^\circ \end{aligned} $$ 따라서 $\triangle BQC$의 세 내각의 크기의 합은 $180^\circ$이므로 $$ \begin{aligned} \angle BQC &= 180^\circ - \angle QBC - \angle QCB \ &= 180^\circ - 40^\circ - 40^\circ \ &= 100^\circ \end{aligned} $$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

다음 그림과 같이 원 $O$에 내접하는 오각형 $ABCDE$에서 $\angle A = 100^\circ$, $\angle D = 115^\circ$일 때, 중심각 $\angle x = \angle BOC$의 크기는? [4점]

**보기** ① $50^\circ$  ② $55^\circ$  ③ $60^\circ$  ④ $65^\circ$  ⑤ $70^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 오각형 ABCDE에서 각 A = 100도가 바라보는 호 BCDE는 2 * 100도 = 200도이다.
2. 2) 각 D = 115도가 바라보는 호 CBAE는 2 * 115도 = 230도이다.
3. 3) 두 호의 합은 200도 + 230도 = 430도이며, 이는 원 전체 둘레 360도에 호 BC가 중복 포함된 것이다.
4. 4) 따라서 호 BC = 430도 - 360도 = 70도이다.
5. 5) 중심각 x = 각 BOC는 호 BC의 중심각이므로 70도이다.
6. 6) 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원 $O$에 내접하는 오각형 $ABCDE$에서 $\angle A = 100^\circ$, $\angle D = 115^\circ$일 때, 중심각 $\angle x = \angle BOC$의 크기는? [4점]」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] (원천과 같음)
- 이유: 원주각 100도와 115도로부터 두 호의 합 430도를 구하고 원 전체 360도를 제외하여 호 BC의 중심각 x = 70도를 구하는 M3-RPM-075 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 내접오각형의 원주각 100도, 115도에 대응하는 호의 중복 덧셈 430도에서 360도를 빼어 중심각 x = 70도를 도출하는 TPL_CIRCLE_ANGLE_COMPOSITE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 원주각 2배로 호의 크기 200도와 230도를 합산하고 원 둘레 360도와의 차이로 중심각 70도를 구하는 2단계 문항이다.

**4칸**
- given: 내접←stem:「원 $O$에 내접하는 오각형 $ABCDE$에서」
- goal: 중심각←stem:「중심각 $\angle x = \angle BOC$의 크기는?」
- method: 원주각(NAMED)←solution:「크기는 원주각의 $2$배이므로」
- condition: 각←stem:「\angle A = 100^\circ$, $\angle D = 115^\circ$일 때」

**how** 원주각 100도, 115도로부터 호의 합 200 + 230 = 430도를 얻고 360도를 제외하여 호 BC의 중심각 x = 70도임을 확인해 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A = 100^\circ$가 바라보는 호 $BCDE$의 크기는 원주각의 $2$배이므로 $$ \begin{aligned} \wideparen{BCDE} = 2 \times 100^\circ = 200^\circ \end{aligned} $$ 또한 $\angle D = 115^\circ$가 바라보는 호 $CBAE$의 크기도 원주각의 $2$배이므로 $$ \begin{aligned} \wideparen{CBAE} = 2 \times 115^\circ = 230^\circ \end{aligned} $$ 두 호를 더하면 원 전체 둘레 $360^\circ$에 공통 호 $BC$가 한 번 더 더해진 것과 같다. $$ \begin{aligned} \wideparen{BCDE} + \wideparen{CBAE} &= 360^\circ + \wideparen{BC} \ 200^\circ + 230^\circ &= 360^\circ + \wideparen{BC} \ 430^\circ &= 360^\circ + \wideparen{BC} \ \wideparen{BC} &= 430^\circ - 360^\circ = 70^\circ \end{aligned} $$ 중심각 $\angle x = \angle BOC$는 호 $BC$의 크기와 같으므로 $$ \begin{aligned} \angle x = 70^\circ \end{aligned} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)

**발문**

다음 그림의 원 $O$에 내접하는 삼각형 $ABC$에서 $\wideparen{AB} = 3\wideparen{CA}$이고 $\wideparen{BC} = 2\wideparen{CA}$일 때, $\angle B$의 크기는? [4점]

**보기** ① $30^\circ$  ② $35^\circ$  ③ $40^\circ$  ④ $45^\circ$  ⑤ $50^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 호 CA = k라 두면 호 AB = 3k, 호 BC = 2k이다.
2. 2) 세 호의 합은 원의 둘레 360도이므로 k + 3k + 2k = 6k = 360도에서 k = 60도이다.
3. 3) 따라서 호 CA의 중심각은 60도이다.
4. 4) 각 B는 호 CA를 바라보는 원주각이므로 각 B = 60도 / 2 = 30도이다.
5. 5) 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 원 $O$에 내접하는 삼각형 $ABC$에서 $\wideparen{AB} = 3\wideparen{CA}$이고 $\wideparen{BC} = 2\wideparen{CA}$일 때, $\angle B$의 크기는? [4점]」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] **원천→판정: 원의 성질 > 원주각 > 원주각과 중심각 > 같은 호에 대한 원주각 → 원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각**
- 이유: 호의 비 3:2:1에서 전체 360도를 비례배분하여 호 CA = 60도를 구하고 원주각 각 B = 30도를 산출하는 M3-RPM-075 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC (원천과 같음) (원천과 같음)
- 이유: 원 둘레 360도와 호의 비례 관계로부터 호 CA의 크기 60도 및 원주각 각 B = 30도를 구하는 TPL_CIRCLE_ANGLE_CENTER_ARC 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 호의 비 3:2:1에서 6k = 360도로 k = 60도를 구하고 원주각 절반 공식으로 30도를 계산하는 1단계 문항이다.

**4칸**
- given: 내접←stem:「원 $O$에 내접하는 삼각형 $ABC$에서」
- goal: 각←stem:「$\angle B$의 크기는?」
- method: 호(NAMED)←stem:「$\wideparen{AB} = 3\wideparen{CA}$이고」
- condition: 비←stem:「$\wideparen{BC} = 2\wideparen{CA}$일 때」

**how** 호의 비 3:2:1로 호 CA의 중심각 60도를 구하고 원주각 각 B = 30도임을 도출하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

호 $CA$의 크기를 $k$라 하자. 주어진 조건에 의해 $$ \begin{aligned} \wideparen{AB} = 3k, \quad \wideparen{BC} = 2k, \quad \wideparen{CA} = k \end{aligned} $$ 원 전체의 둘레는 $360^\circ$이므로 세 호의 합은 다음과 같다. $$ \begin{aligned} k + 3k + 2k &= 360^\circ \ 6k &= 360^\circ \ k &= 60^\circ \end{aligned} $$ 따라서 호 $CA$의 크기는 $60^\circ$이다. $\angle B$는 호 $CA$를 바라보는 원주각이므로 $$ \begin{aligned} \angle B = \dfrac{60^\circ}{2} = 30^\circ \end{aligned} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

다음 중 대푯값에 대한 설명으로 옳은 것은? [4점]

**보기** ① $6, 10, 8, 7, 5, 8, 7$의 평균은 $6$이다.  ② $2, 3, 5, 4, 6, 8, 40$의 대푯값으로는 평균보다 중앙값이 더 적절하다.  ③ $5, 2, 1, 8, 4, 3, 7$의 중앙값은 $8$이다.  ④ $2, 3, 3, 4, 5, 6, 4$의 최빈값은 $3.5$이다.  ⑤ 중앙값은 항상 주어진 자료 안에 실제로 존재하는 값이어야 한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) ① 6, 10, 8, 7, 5, 8, 7의 합은 51이므로 평균은 51/7이며 6이 아니다.
2. 2) ② 자료 2, 3, 5, 4, 6, 8, 40에서 40은 극단적으로 큰 값이므로 평균은 중심 경향을 왜곡하며 중앙값이 더 적절하다. (참)
3. 3) ③ 5, 2, 1, 8, 4, 3, 7을 크기순으로 나열하면 1, 2, 3, 4, 5, 7, 8이므로 중앙값은 4이다.
4. 4) ④ 2, 3, 3, 4, 5, 6, 4에서 3과 4가 각 2회씩 나타나므로 최빈값은 3과 4이다.
5. 5) ⑤ 짝수 개 자료의 중앙값은 두 수의 평균이므로 실제 존재하지 않는 값이 될 수 있다.
6. 6) 따라서 옳은 설명은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 대푯값에 대한 설명으로 옳은 것은? [4점]」
**RPM** M3-RPM-082 [통계 > 대푯값과 산포도 > 대푯값 > 대푯값 비교] (원천과 같음)
- 이유: 극단값 40이 포함된 자료에서 평균보다 중앙값이 대푯값으로 적절함을 포함해 대푯값의 정의와 성질을 판별하는 M3-RPM-082 문제이다.
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=NONE (원천과 같음)
- 이유: 극단값 40에 따른 중앙값과 평균의 대표성 비교 및 최빈값, 평균 계산 타당성을 검증하는 PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대푯값 3종의 정의와 극단값 40의 영향을 바탕으로 5개 보기의 참·거짓을 판별하는 2단계 문항이다.

**4칸**
- given: 대푯값←stem:「다음 중 대푯값에 대한 설명으로 옳은 것은?」
- goal: 진술←stem:「설명으로 옳은 것은? [4점]」
- method: 중앙값(NAMED)←choices:「대푯값으로는 평균보다 중앙값이 더 적절하다.」
- condition: 평균←choices:「대푯값으로는 평균보다 중앙값이 더 적절하다.」

**how** 자료에 극단값 40이 있을 때 평균보다 중앙값이 자료를 더 잘 대표하므로 보기 ②가 참임을 확인하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 평균, 중앙값, 최빈값의 정의에 따라 판별한다. ① 주어진 변량의 총합은 $6+10+8+7+5+8+7 = 51$이므로 평균은 $\dfrac{51}{7}$이다. 따라서 $6$이 아니므로 옳지 않다. ② 변량 중 $40$과 같이 다른 값에 비해 극단적으로 큰 값이 포함되어 있는 경우, 평균은 극단값의 영향을 크게 받으므로 자료의 중심 경향을 나타내기에 중앙값이 더 적절하다. 따라서 ②는 옳다. ③ 변량을 작은 순서대로 나열하면 $1, 2, 3, 4, 5, 7, 8$이다. 변량의 개수가 $7$개이므로 중앙값은 $4$번째 값인 $4$이다. 따라서 $8$이 아니므로 옳지 않다. ④ 가장 많이 나타나는 변량은 $3$과 $4$로 각각 $2$회씩 나타나므로 최빈값은 $3$과 $4$의 $2$개이다. 두 값의 평균인 $3.5$가 아니므로 옳지 않다. ⑤ 변량의 개수가 짝수 개인 경우 중앙값은 한가운데 두 값의 평균이 되므로, 자료에 실제로 존재하지 않는 값이 될 수 있다. 따라서 옳지 않다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 설명 중 옳은 것은? [4점]

**보기** ① 산포도에는 평균, 중앙값, 최빈값이 있다.  ② 편차의 제곱의 평균을 표준편차라고 한다.  ③ 표준편차가 작을수록 변량들은 평균을 중심으로 밀집되어 고르게 분포한다.  ④ 모든 자료에서 각 변량의 편차의 총합은 항상 평균과 같다.  ⑤ 편차의 절댓값이 클수록 그 변량은 평균에 가깝다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) ① 평균, 중앙값, 최빈값은 대푯값이고 산포도에는 분산, 표준편차가 있다. (거짓)
2. 2) ② 편차의 제곱의 평균은 분산이며 표준편차는 분산의 양의 제곱근이다. (거짓)
3. 3) ③ 표준편차가 작을수록 자료가 평균 주변에 밀집되어 고르게 분포한다. (참)
4. 4) ④ 편차의 총합은 항상 0이다. (거짓)
5. 5) ⑤ 편차의 절댓값이 클수록 평균에서 멀리 떨어져 있다. (거짓)
6. 6) 따라서 옳은 설명은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 설명 중 옳은 것은? [4점]」
**RPM** M3-RPM-085 [통계 > 대푯값과 산포도 > 산포도 > 표준편차] (원천과 같음)
- 이유: 표준편차가 작을수록 변량이 평균 주변에 밀집하여 고르게 분포한다는 산포도의 성질을 판별하는 M3-RPM-085 문제이다. 편차의 총합은 항상 0이다.
**유형** PT=PT_M3_STATISTICS_CONCEPTS_TRUE_FALSE / TPL=TPL_M3_STATISTICS_CONCEPTS_TRUE_FALSE_DEFINITION (원천과 같음)
- 이유: 산포도, 편차 총합 0, 분산 및 표준편차의 정의와 분포 특성을 판정하는 TPL_M3_STATISTICS_CONCEPTS_TRUE_FALSE_DEFINITION 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 표준편차와 산포도의 기본 개념 및 분포의 의미를 묻는 1단계 개념 판정 문항이다. 편차 총합 0의 정의를 확인한다.

**4칸**
- given: 산포도←choices:「산포도에는 평균, 중앙값, 최빈값이 있다.」
- goal: 진술←stem:「다음 설명 중 옳은 것은? [4점]」
- method: 표준편차(NAMED)←choices:「표준편차가 작을수록 변량들은 평균을」
- condition: 평균←choices:「표준편차가 작을수록 변량들은 평균을」

**how** 표준편차가 작을수록 변량들이 평균을 중심으로 밀집되어 분포가 고르다는 보기 ③이 참임을 확인하여 정답 ③으로 판정하였다. 편차의 총합은 항상 0이다.

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 산포도와 편차, 분산, 표준편차의 정의에 따라 검토한다. ① 평균, 중앙값, 최빈값은 자료의 중심 위치를 나타내는 대푯값이다. 산포도에는 분산, 표준편차 등이 있다. (옳지 않음) ② 편차의 제곱의 평균은 분산이며, 분산의 양의 제곱근이 표준편차이다. (옳지 않음) ③ 분산 또는 표준편차가 작을수록 각 변량이 평균 가까이에 모여 있으므로 자료의 분포가 고르다(고르게 분포한다). (옳음) ④ 모든 자료에서 편차의 총합은 항상 $0$이다. (옳지 않음) ⑤ 편차는 (변량) - (평균)이므로 편차의 절댓값이 클수록 그 변량은 평균에서 멀리 떨어져 있다. (옳지 않음) 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

자료 $a, 4, 6, 12, 18$의 중앙값이 $a$이고, 자료 $3, a, 9, 11, 5$의 중앙값이 $9$가 되도록 하는 자연수 $a$의 개수는? [4점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 자료 a, 4, 6, 12, 18의 중앙값이 a가 되려면 크기순 나열 시 a가 세 번째 값이어야 하므로 6 <= a <= 12이다.
2. 2) 자료 3, a, 9, 11, 5를 크기순으로 놓을 때 3, 5가 이미 9보다 작으므로 중앙값이 9가 되려면 a >= 9이어야 한다.
3. 3) 두 부등식을 동시에 만족하는 자연수 a의 범위는 9 <= a <= 12이다.
4. 4) 따라서 가능한 자연수 a는 9, 10, 11, 12의 4개이다.
5. 5) 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「자료 $a, 4, 6, 12, 18$의 중앙값이 $a$이고, 자료 $3, a, 9, 11, 5$의 중앙값이 $9$가 되도록 하는 자연수 $a$의 개수는? [4점]」
**RPM** M3-RPM-087-S2P-8E9F [통계 > 대푯값과 산포도 > 자료 비교 > 조건으로 자료 추론] **원천→판정: 통계 > 대푯값과 산포도 > 대푯값 > 대푯값 비교 → 통계 > 대푯값과 산포도 > 자료 비교 > 조건으로 자료 추론**
- 이유: 두 자료 집합의 중앙값 조건으로부터 6 <= a <= 12와 a >= 9를 연립하여 a = 9, 10, 11, 12의 4개를 구하는 M3-RPM-087-S2P-8E9F 문제이다.
**유형** PT=PT_M3_CENTRAL_TENDENCY_MEDIAN_MODE / TPL=TPL_M3_CENTRAL_TENDENCY_MEDIAN_MODE_PARAMETER (원천과 같음)
- 이유: 미지수 a를 포함하는 두 자료의 중앙값 위치 조건으로부터 9 <= a <= 12 범위를 도출하는 TPL_M3_CENTRAL_TENDENCY_MEDIAN_MODE_PARAMETER 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 5개 변량 자료 2개에서 중앙값 순위 조건 6 <= a <= 12와 a >= 9를 각각 세우고 연립하여 4개를 도출하는 2단계 문항이다.

**4칸**
- given: 자료←stem:「자료 $a, 4, 6, 12, 18$의」
- goal: 개수←stem:「자연수 $a$의 개수는?」
- method: 중앙값(NAMED)←stem:「중앙값이 $a$이고,」
- condition: 자연수←stem:「되도록 하는 자연수 $a$의 개수는?」

**how** 첫 번째 자료의 중앙값 a 조건 6 <= a <= 12와 두 번째 자료의 중앙값 9 조건 a >= 9의 공통 범위 9 <= a <= 12에서 9, 10, 11, 12의 4개임을 확인해 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫 번째 자료 $a, 4, 6, 12, 18$의 $5$개 변량에서 중앙값이 $a$가 되려면 변량을 작은 순서대로 놓았을 때 $a$가 세 번째 위치에 와야 한다. 이미 $4, 6$이 주어져 있고 $12, 18$이 주어져 있으므로 $a$의 범위는 다음과 같다. $$ \begin{aligned} 6 \le a \le 12 \end{aligned} $$ 두 번째 자료 $3, 5, a, 9, 11$의 $5$개 변량에서 $9$보다 작은 수가 이미 $3, 5$의 $2$개 있다. 중앙값이 $9$가 되려면 $9$가 작은 순서대로 세 번째에 위치해야 하므로 $a$는 $9$보다 작지 않아야 한다. $$ \begin{aligned} a \ge 9 \end{aligned} $$ 두 부등식 조건을 동시에 만족하는 자연수 $a$의 범위는 다음과 같다. $$ \begin{aligned} 9 \le a \le 12 \end{aligned} $$ 따라서 이를 만족하는 자연수 $a$는 $9, 10, 11, 12$의 $4$개이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

어느 제품의 디자인, 가격, 내구성에 대하여 고객 $5$명이 평가한 점수가 다음과 같다.

- 디자인: $7, 5, 3, 5, 5$ (점)  
- 가격: $5, 5, 5, 5, 5$ (점)  
- 내구성: $9, 7, 1, 5, 3$ (점) 이에 대한 설명으로 옳지 않은 것은? [4점]

**보기** ① 세 항목에 대한 만족도의 평균은 모두 $5$점이다.  ② 가격 만족도의 표준편차는 $0$점이다.  ③ 디자인 만족도의 분산은 $1.6$이다.  ④ 내구성 만족도의 편차의 합은 $0$점이다.  ⑤ 세 항목 중 만족도의 표준편차가 가장 큰 항목은 디자인이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 디자인 평균 = (7+5+3+5+5)/5 = 25/5 = 5, 가격 평균 = 25/5 = 5, 내구성 평균 = (9+7+1+5+3)/5 = 25/5 = 5로 모두 5점이다. (① 참)
2. 2) 가격은 모든 변량이 5로 편차가 0이므로 표준편차는 0점이다. (② 참)
3. 3) 디자인의 편차는 2, 0, -2, 0, 0이므로 분산은 (4 + 4)/5 = 1.6이다. (③ 참)
4. 4) 모든 자료에서 편차의 총합은 0이므로 내구성의 편차 합도 0점이다. (④ 참)
5. 5) 내구성의 편차는 4, 2, -4, 0, -2이므로 분산은 (16 + 4 + 16 + 0 + 4)/5 = 40/5 = 8이다.
6. 6) 따라서 표준편차가 가장 큰 항목은 분산이 8인 내구성이므로 ⑤는 옳지 않다.
7. 7) 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「어느 제품의 디자인, 가격, 내구성에 대하여 고객 $5$명이 평가한 점수가 다음과 같다.  - 디자인: $7, 5, 3, 5, 5$ (점)   - 가격: $5, 5, 5, 5, 5$ (점)   - 내구성: $9, 7, 1, 5, 3$ (점) 이에 대한 설명으로 옳지 않은 것은? [4점]」
**RPM** M3-RPM-086-S2P-6754 [통계 > 대푯값과 산포도 > 자료 비교 > 평균과 산포도 비교] (원천과 같음)
- 이유: 세 항목의 평균 5점과 디자인 분산 1.6, 내구성 분산 8을 계산하여 표준편차가 가장 큰 항목이 내구성임을 판별하는 M3-RPM-086-S2P-6754 문제이다.
**유형** PT=PT_M3_DISPERSION_DEVIATION_PROPERTIES / TPL=TPL_M3_COMPARE_VARIANCE_OF_TWO_DATA_SETS (원천과 같음)
- 이유: 세 집단의 평균 5점과 분산 1.6 및 8을 산출하여 산포도를 비교하는 TPL_M3_COMPARE_VARIANCE_OF_TWO_DATA_SETS 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 세 항목의 평균 5와 분산 1.6, 8을 각각 계산하여 표준편차를 비교하는 2단계 문항이다.

**4칸**
- given: 자료←solution:「각 항목의 점수 자료를 분석한다.」
- goal: 진술←stem:「이에 대한 설명으로 옳지 않은 것은? [4점]」
- method: 표준편차(NAMED)←choices:「세 항목 중 만족도의 표준편차가 가장 큰 항목은」
- condition: 평균←choices:「세 항목에 대한 만족도의 평균은 모두 $5$점이다.」

**how** 세 항목의 평균은 모두 5점이며 분산은 디자인 1.6, 내구성 8이므로 표준편차가 가장 큰 것은 내구성임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

각 항목의 점수 자료를 분석한다. 세 항목의 평균은 각각 다음과 같다. $$ \begin{aligned} \text{디자인 평균} &= \dfrac{7+5+3+5+5}{5} = \dfrac{25}{5} = 5 \ \text{가격 평균} &= \dfrac{5+5+5+5+5}{5} = 5 \ \text{내구성 평균} &= \dfrac{9+7+1+5+3}{5} = \dfrac{25}{5} = 5 \end{aligned} $$ 따라서 세 항목의 평균은 모두 $5$점으로 같다. (① 옳음) 가격은 모든 고객의 점수가 $5$점으로 평균과 같으므로 편차가 모두 $0$이다. 따라서 표준편차는 $0$점이다. (② 옳음) 디자인의 편차는 $2, 0, -2, 0, 0$이므로 분산은 $$ \begin{aligned} \dfrac{2^2 + 0^2 + (-2)^2 + 0^2 + 0^2}{5} = \dfrac{4 + 4}{5} = \dfrac{8}{5} = 1.6 \quad (\text{③ 옳음}) \end{aligned} $$ 모든 자료에서 편차의 합은 항상 $0$이므로 내구성 만족도의 편차의 합도 $0$점이다. (④ 옳음) 내구성의 편차는 $4, 2, -4, 0, -2$이므로 분산은 $$ \begin{aligned} \dfrac{4^2 + 2^2 + (-4)^2 + 0^2 + (-2)^2}{5} = \dfrac{16 + 4 + 16 + 0 + 4}{5} = \dfrac{40}{5} = 8 \end{aligned} $$ 내구성의 표준편차는 $\sqrt{8} = 2\sqrt{2}$로, 디자인의 표준편차 $\sqrt{1.6}$보다 크다. 따라서 표준편차가 가장 큰 항목은 내구성이므로 ⑤는 옳지 않다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

$4$개의 자료 $x, y, 7, 3$의 평균이 $5$이고, 분산이 $4$일 때, 새로운 $4$개의 자료 $x, y, 6, 8$의 분산은? [4점]

**보기** ① $\dfrac{7}{2}$  ② $\dfrac{15}{4}$  ③ $4$  ④ $\dfrac{9}{2}$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) x, y, 7, 3의 평균이 5이므로 x + y + 7 + 3 = 20에서 x + y = 10이다.
2. 2) 분산이 4이므로 편차제곱합 (x-5)^2 + (y-5)^2 + (7-5)^2 + (3-5)^2 = 16에서 (x-5)^2 + (y-5)^2 = 8이다.
3. 3) 전개하여 x^2 + y^2 - 10(x+y) + 50 = 8에 x+y = 10을 대입하면 x^2 + y^2 = 58이다.
4. 4) 새 자료 x, y, 6, 8의 평균은 (10 + 14)/4 = 6이다.
5. 5) 새 자료의 편차제곱합은 (x-6)^2 + (y-6)^2 + 0 + (8-6)^2 = x^2 + y^2 - 12(x+y) + 76 = 58 - 120 + 76 = 14이다.
6. 6) 따라서 새 분산은 14 / 4 = 7/2이다.
7. 7) 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「$4$개의 자료 $x, y, 7, 3$의 평균이 $5$이고, 분산이 $4$일 때, 새로운 $4$개의 자료 $x, y, 6, 8$의 분산은? [4점]」
**RPM** M3-RPM-084-S2P-9DFD [통계 > 대푯값과 산포도 > 산포도 > 분산] (원천과 같음)
- 이유: 자료 x, y, 7, 3의 평균 5와 분산 4에서 x + y = 10과 제곱합 x^2 + y^2 = 58을 구하고 새 자료 x, y, 6, 8의 분산 7/2을 산출하는 M3-RPM-084-S2P-9DFD 문제이다.
**유형** PT=PT_M3_DISPERSION_DEVIATION_PROPERTIES / TPL=TPL_M3_VARIANCE_OF_MODIFIED_DATA_FROM_SUM_OF_SQUARED_DEVIATIONS (원천과 같음)
- 이유: 평균 5와 분산 4로부터 미지수 합 10 및 제곱합 58을 유도하고 변량이 바뀐 새 자료의 분산 7/2을 계산하는 TPL_M3_VARIANCE_OF_MODIFIED_DATA_FROM_SUM_OF_SQUARED_DEVIATIONS 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 미지수 x, y의 합 10과 제곱의 합 58을 도출한 후 새 평균 6에 대한 편차제곱합 14를 계산하여 분산 7/2을 구하는 3단계 심화 문항이다.

**4칸**
- given: 분산←stem:「평균이 $5$이고, 분산이 $4$일 때,」
- goal: 분산←stem:「새로운 $4$개의 자료 $x, y, 6, 8$의 분산은?」
- method: 평균(NAMED)←stem:「$4$개의 자료 $x, y, 7, 3$의 평균이 $5$이고,」
- condition: 자료←stem:「$4$개의 자료 $x, y, 7, 3$의」

**how** x + y = 10과 x^2 + y^2 = 58을 구하여 새 자료 x, y, 6, 8의 편차제곱합 14로부터 분산 14/4 = 7/2임을 확인해 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫 번째 자료 $x, y, 7, 3$의 평균이 $5$이므로 변량의 총합은 $$ \begin{aligned} x + y + 7 + 3 &= 4 \times 5 = 20 \ x + y &= 10 \end{aligned} $$ 첫 번째 자료의 분산이 $4$이므로 편차의 제곱의 합은 $4 \times 4 = 16$이다. $$ \begin{aligned} (x-5)^2 + (y-5)^2 + (7-5)^2 + (3-5)^2 &= 16 \ (x-5)^2 + (y-5)^2 + 4 + 4 &= 16 \ (x-5)^2 + (y-5)^2 &= 8 \end{aligned} $$ 좌변을 전개하면 $$ \begin{aligned} x^2 - 10x + 25 + y^2 - 10y + 25 &= 8 \ x^2 + y^2 - 10(x+y) + 50 &= 8 \ x^2 + y^2 - 10(10) + 50 &= 8 \ x^2 + y^2 - 50 &= 8 \ x^2 + y^2 &= 58 \end{aligned} $$ 새로운 자료 $x, y, 6, 8$의 평균을 구하면 $$ \begin{aligned} \dfrac{x + y + 6 + 8}{4} = \dfrac{10 + 14}{4} = \dfrac{24}{4} = 6 \end{aligned} $$ 새로운 자료의 편차의 제곱의 합은 다음과 같다. $$ \begin{aligned} &(x-6)^2 + (y-6)^2 + (6-6)^2 + (8-6)^2 \ &= x^2 - 12x + 36 + y^2 - 12y + 36 + 0 + 4 \ &= x^2 + y^2 - 12(x+y) + 76 \ &= 58 - 12(10) + 76 \ &= 58 - 120 + 76 \ &= 14 \end{aligned} $$ 따라서 새로운 자료의 분산은 $$ \begin{aligned} \dfrac{14}{4} = \dfrac{7}{2} \end{aligned} $$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

A, B 두 모둠 전체의 수학 성적의 평균은 $75$점이다. A모둠의 수학 성적의 평균이 $80$점이고, B모둠의 수학 성적의 평균이 $72$점일 때, A모둠과 B모둠의 학생 수의 비는? [4점]

**보기** ① $1:2$  ② $3:5$  ③ $2:3$  ④ $5:3$  ⑤ $3:4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) A모둠 학생 수를 a, B모둠 학생 수를 b라 하자.
2. 2) 전체 학생의 수학 성적 총합은 모둠별 점수 총합과 같으므로 80a + 72b = 75(a + b)이다.
3. 3) 전개하여 정리하면 80a + 72b = 75a + 75b에서 5a = 3b이다.
4. 4) 따라서 a/b = 3/5이므로 a : b = 3 : 5이다.
5. 5) 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「A, B 두 모둠 전체의 수학 성적의 평균은 $75$점이다. A모둠의 수학 성적의 평균이 $80$점이고, B모둠의 수학 성적의 평균이 $72$점일 때, A모둠과 B모둠의 학생 수의 비는? [4점]」
**RPM** M3-RPM-086-S2P-6754 [통계 > 대푯값과 산포도 > 자료 비교 > 평균과 산포도 비교] (원천과 같음)
- 이유: 두 모둠의 평균 80점, 72점과 전체 평균 75점의 총점 가중평균 등식 80a + 72b = 75(a+b)에서 학생 수 비 a:b = 3:5를 구하는 M3-RPM-086-S2P-6754 문제이다.
**유형** PT=PT_M3_LINEAR_TRANSFORMATION_STATISTICS / TPL=NONE (원천과 같음)
- 이유: 전체 집단 평균 75점과 부분 집단 평균 80점, 72점의 선형 관계로부터 학생 수 비 3:5를 도출하는 PT_M3_LINEAR_TRANSFORMATION_STATISTICS 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 가중평균 관계식 80a + 72b = 75(a+b)를 세우고 5a = 3b를 풀어 비 3:5를 구하는 2단계 문항이다.

**4칸**
- given: 평균←stem:「전체의 수학 성적의 평균은 $75$점이다.」
- goal: 비←stem:「A모둠과 B모둠의 학생 수의 비는?」
- method: 방정식(NAMED)←solution:「80a + 72b &= 75(a + b)」
- condition: 평균←stem:「수학 성적의 평균이 $80$점이고, B모둠의 수학 성적의 평균이 $72$점일 때,」

**how** 80a + 72b = 75(a + b)에서 5a = 3b이므로 학생 수의 비 a : b = 3 : 5임을 확인하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

A모둠의 학생 수를 $a$명, B모둠의 학생 수를 $b$명이라 하자. 전체 학생의 수학 성적의 총합은 각 모둠 점수의 총합과 같으므로 $$ \begin{aligned} 80a + 72b &= 75(a + b) \ 80a + 72b &= 75a + 75b \ 80a - 75a &= 75b - 72b \ 5a &= 3b \ \dfrac{a}{b} &= \dfrac{3}{5} \end{aligned} $$ 따라서 A모둠과 B모둠의 학생 수의 비는 다음과 같다. $$ \begin{aligned} a : b = 3 : 5 \end{aligned} $$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 두 변량 $x, y$에 대하여 산점도를 그렸을 때, 대체로 음의 상관관계가 나타나는 것으로 가장 적절한 것은? [4점]

**보기** ① 키와 발 크기  ② 자동차 주행 거리와 휘발유 소비량  ③ 하루 스마트폰 사용 시간과 수면 시간  ④ 하루 물 섭취량과 수학 성적  ⑤ 독서량과 어휘력

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 키와 발 크기는 양의 상관관계이다.
2. 2) 자동차 주행 거리와 휘발유 소비량은 양의 상관관계이다.
3. 3) 하루 스마트폰 사용 시간이 길수록 수면 시간은 대체로 줄어들므로 음의 상관관계이다.
4. 4) 하루 물 섭취량과 수학 성적은 상관관계가 없다.
5. 5) 독서량과 어휘력은 양의 상관관계이다.
6. 6) 따라서 음의 상관관계를 나타내는 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 두 변량 $x, y$에 대하여 산점도를 그렸을 때, 대체로 음의 상관관계가 나타나는 것으로 가장 적절한 것은? [4점]」
**RPM** M3-RPM-091-S2P-46A0 [통계 > 상관관계 > 상관관계 > 음의 상관관계] (원천과 같음)
- 이유: 두 변량 x, y 사이에서 스마트폰 사용 시간과 수면 시간의 반비례적 경향을 분석하여 음의 상관관계를 식별하는 M3-RPM-091-S2P-46A0 문제이다.
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_CORRELATION_TYPE_JUDGMENT
- 이유: 일상의 두 변량 x, y 사이에서 한 변량이 증가할 때 다른 변량이 감소하는 음의 상관관계를 판정하는 TPL_M3_CORRELATION_TYPE_JUDGMENT 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 변량 x, y 간의 경향성을 파악하여 음의 상관관계 보기를 바로 찾는 1단계 개념 판정 문항이다.

**4칸**
- given: 산점도←stem:「변량 $x, y$에 대하여 산점도를 그렸을 때,」
- goal: 상관관계←stem:「대체로 음의 상관관계가 나타나는 것으로 가장 적절한 것은?」
- method: 변량(NAMED)←stem:「다음 중 두 변량 $x, y$에 대하여」
- condition: 거리←choices:「자동차 주행 거리와 휘발유 소비량」

**how** 두 변량 x, y에 대해 스마트폰 사용 시간이 증가할수록 수면 시간은 감소하므로 음의 상관관계를 나타내는 것이 보기 ③임을 확인해 정답 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기에서 두 변량 사이의 상관관계를 조사한다. ① 키가 클수록 대체로 발 크기도 크므로 양의 상관관계이다. ② 자동차 주행 거리가 길어질수록 휘발유 소비량도 대체로 늘어나므로 양의 상관관계이다. ③ 하루 스마트폰 사용 시간이 늘어날수록 수면 시간은 대체로 줄어들므로 음의 상관관계이다. (옳음) ④ 하루 물 섭취량과 수학 성적 사이에는 일정한 관련성이 없으므로 상관관계가 없다. ⑤ 독서량이 많을수록 어휘력도 대체로 향상되므로 양의 상관관계이다. 따라서 음의 상관관계를 나타내는 것은 ③이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

다음 자료는 학생 $10$명의 수학 점수($x$점)와 과학 점수($y$점)를 조사하여 나타낸 $(x, y)$의 순서쌍이다. $$(50, 60), \ (60, 50), \ (60, 70), \ (70, 60), \ (70, 70), \ (70, 80), \ (80, 70), \ (80, 90), \ (90, 80), \ (100, 90)$$ 이에 대한 설명으로 옳지 않은 것은? [4점]

**보기** ① 수학 점수의 최빈값은 $70$점이다.  ② 수학 점수와 과학 점수 사이에는 양의 상관관계가 있다.  ③ 수학 점수가 과학 점수보다 높은 학생의 비율은 $\dfrac{1}{2}$이다.  ④ 수학 점수와 과학 점수가 모두 $70$점 이상인 학생은 $8$명이다.  ⑤ 수학 점수가 $90$점 이상인 학생은 $2$명이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 수학 점수 x의 빈도는 50점 1명, 60점 2명, 70점 3명, 80점 2명, 90점 1명, 100점 1명이므로 최빈값은 70점이다. (① 참)
2. 2) x가 증가함에 따라 y도 전반적으로 증가하므로 양의 상관관계가 있다. (② 참)
3. 3) x > y인 순서쌍은 (60,50), (70,60), (80,70), (90,80), (100,90)의 5명이므로 비율은 5/10 = 1/2이다. (③ 참)
4. 4) x >= 70이고 y >= 70인 순서쌍은 (70,70), (70,80), (80,70), (80,90), (90,80), (100,90)의 6명이다. 8명이 아니므로 옳지 않다. (④ 거짓)
5. 5) x >= 90인 학생은 (90,80), (100,90)의 2명이다. (⑤ 참)
6. 6) 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 자료는 학생 $10$명의 수학 점수($x$점)와 과학 점수($y$점)를 조사하여 나타낸 $(x, y)$의 순서쌍이다. $$(50, 60), \ (60, 50), \ (60, 70), \ (70, 60), \ (70, 70), \ (70, 80), \ (80, 70), \ (80, 90), \ (90, 80), \ (100, 90)$$ 이에 대한 설명으로 옳지 않은 것은? [4점]」
**RPM** M3-RPM-088-S2P-FC25 [통계 > 상관관계 > 산점도 > 산점도 읽기] (원천과 같음)
- 이유: 10명의 수학 및 과학 점수 순서쌍 자료에서 x >= 70, y >= 70인 인원이 6명임을 계산하여 8명이라 한 보기 ④의 오류를 판별하는 M3-RPM-088-S2P-FC25 문제이다.
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO
- 이유: 이변량 순서쌍 데이터 10개에 대해 조건 영역에 속하는 점의 개수 6명과 최빈값 70점을 분석 판정하는 TPL_M3_SCATTER_PLOT_READ_POINT_RATIO 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 10개의 순서쌍에서 x >= 70 및 y >= 70 조건을 세어 6명을 확인하고 보기를 검증하는 2단계 문항이다.

**4칸**
- given: 자료←stem:「다음 자료는 학생 $10$명의 수학 점수」
- goal: 진술←stem:「이에 대한 설명으로 옳지 않은 것은? [4점]」
- method: 개수(NAMED)←choices:「과학 점수가 모두 $70$점 이상인 학생은 $8$명이다.」
- condition: 순서쌍←stem:「조사하여 나타낸 $(x, y)$의 순서쌍이다.」

**how** 수학 점수와 과학 점수가 모두 70점 이상인 학생은 6명이므로 8명이라고 진술한 보기 ④가 거짓임을 확인하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 $10$개의 점수 순서쌍을 항목별로 검증한다. ① 수학 점수 $x$의 분포는 $50$점 $1$명, $60$점 $2$명, $70$점 $3$명, $80$점 $2$명, $90$점 $1$명, $100$점 $1$명이므로 가장 많이 나타난 최빈값은 $70$점이다. (옳음) ② 수학 점수가 높을수록 대체로 과학 점수도 높은 경향을 보이므로 두 변량 사이에는 양의 상관관계가 있다. (옳음) ③ 수학 점수가 과학 점수보다 높은 경우($x > y$)를 만족하는 순서쌍은 $$(60, 50), \ (70, 60), \ (80, 70), \ (90, 80), \ (100, 90)$$ 의 $5$개이다. 전체 $10$명 중 $5$명이므로 비율은 $\dfrac{5}{10} = \dfrac{1}{2}$이다. (옳음) ④ 수학 점수와 과학 점수가 모두 $70$점 이상인 경우($x \ge 70$이고 $y \ge 70$)를 만족하는 순서쌍은 $$(70, 70), \ (70, 80), \ (80, 70), \ (80, 90), \ (90, 80), \ (100, 90)$$ 의 $6$명이다. 따라서 '$8$명'이라고 기술한 ④는 옳지 않다. ⑤ 수학 점수가 $90$점 이상인 학생은 $(90, 80), (100, 90)$의 $2$명이다. (옳음) 따라서 옳지 않은 것은 ④이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점


**발문**

어느 탁구 동아리 학생 $25$명의 서브 점수($x$점)와 리시브 점수($y$점)를 조사하여 산점도로 나타내었다. 아래 조건을 모두 만족시키는 학생의 비율은? [4점]

(가) 리시브 점수가 서브 점수보다 $2$점 이상 높다. (나) 두 점수의 평균이 $6$점 이상이다.

(단, 조건을 만족하는 학생의 순서쌍 $(x, y)$는 $(4, 8), (5, 7), (5, 8), (5, 9), (6, 8)$의 $5$명이다.)

**보기** ① $\dfrac{1}{25}$  ② $\dfrac{2}{25}$  ③ $\dfrac{3}{25}$  ④ $\dfrac{4}{25}$  ⑤ $\dfrac{1}{5}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 조건 (가)에서 y - x >= 2이다.
2. 2) 조건 (나)에서 (x + y)/2 >= 6이므로 x + y >= 12이다.
3. 3) 문제의 단서에서 두 조건을 모두 만족하는 학생의 순서쌍은 (4, 8), (5, 7), (5, 8), (5, 9), (6, 8)의 5명이다.
4. 4) 전체 학생 수가 25명이므로 조건을 만족하는 학생의 비율은 5 / 25 = 1/5이다.
5. 5) 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「어느 탁구 동아리 학생 $25$명의 서브 점수($x$점)와 리시브 점수($y$점)를 조사하여 산점도로 나타내었다. 아래 조건을 모두 만족시키는 학생의 비율은? [4점]  (가) 리시브 점수가 서브 점수보다 $2$점 이상 높다. (나) 두 점수의 평균이 $6$점 이상이다.  (단, 조건을 만족하는 학생의 순서쌍 $(x, y)$는 $(4, 8), (5, 7), (5, 8), (5, 9), (6, 8)$의 $5$명이다.)」
**RPM** M3-RPM-088-S2P-FC25 [통계 > 상관관계 > 산점도 > 산점도 읽기] (원천과 같음)
- 이유: 산점도 조건 (가)와 (나)를 만족하는 학생 5명의 전체 25명에 대한 비율 5/25 = 1/5을 계산하는 M3-RPM-088-S2P-FC25 문제이다.
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO
- 이유: 산점도 상에서 주어진 두 부등식 조건을 만족하는 인원수 5명을 파악하여 전체 25명에 대한 비율 1/5을 구하는 TPL_M3_SCATTER_PLOT_READ_POINT_RATIO 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 부등식 조건을 만족하는 5명의 학생 수를 전체 25명으로 나누어 비율 1/5을 산출하는 2단계 문항이다.

**4칸**
- given: 산점도←stem:「조사하여 산점도로 나타내었다. 아래 조건을」
- goal: 비율←stem:「조건을 모두 만족시키는 학생의 비율은?」
- method: 평균(NAMED)←stem:「(나) 두 점수의 평균이 $6$점 이상이다.」
- condition: 순서쌍←stem:「학생의 순서쌍 $(x, y)$는 $(4, 8), (5, 7),」

**how** 두 조건을 만족하는 학생 수가 5명이므로 전체 25명에 대한 비율은 5/25 = 1/5임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

조건 (가)에서 리시브 점수가 서브 점수보다 $2$점 이상 높으므로 $$ \begin{aligned} y - x \ge 2 \end{aligned} $$ 조건 (나)에서 두 점수의 평균이 $6$점 이상이므로 $$ \begin{aligned} \dfrac{x + y}{2} \ge 6 \implies x + y \ge 12 \end{aligned} $$ 두 조건을 모두 만족하는 학생의 점수 순서쌍 $(x, y)$는 문제에서 제시된 바와 같이 $$ \begin{aligned} (4, 8), \ (5, 7), \ (5, 8), \ (5, 9), \ (6, 8) \end{aligned} $$ 의 $5$명이다. 전체 학생 수가 $25$명이므로 구하는 비율은 $$ \begin{aligned} \dfrac{5}{25} = \dfrac{1}{5} \end{aligned} $$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 4점


**발문**

다음 그림과 같이 원 $O$에 내접하는 정팔각형 $ABCDEFGH$에서 두 대각선 $\overline{AC}$와 $\overline{AD}$가 이루는 각 $\angle CAD$의 크기를 구하고, 그 과정을 서술하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $22.5^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 원 O에 내접하는 정팔각형 ABCDEFGH의 한 변 CD의 중심각은 각 COD = 360도 / 8 = 45도이다.
2. 2) 각 CAD는 같은 호 CD를 바라보는 원주각이다.
3. 3) 원주각의 크기는 중심각의 절반이므로 각 CAD = 45도 / 2 = 22.5도이다.
4. 4) 따라서 구하는 각의 크기는 22.5도이다.
- 작성자 답: $22.5^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원 $O$에 내접하는 정팔각형 $ABCDEFGH$에서 두 대각선 $\overline{AC}$와 $\overline{AD}$가 이루는 각 $\angle CAD$의 크기를 구하고, 그 과정을 서술하시오. [4점]」
**RPM** M3-RPM-075 [원의 성질 > 원주각 > 원주각과 중심각 > 중심각과 원주각] (원천과 같음)
- 이유: 정팔각형의 한 변 CD에 대한 중심각 360/8 = 45도와 원주각 각 CAD = 22.5도의 절반 관계를 서술하는 M3-RPM-075 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC (원천과 같음) (원천과 같음)
- 이유: 원 둘레 360도를 정팔각형 8등분한 중심각 45도로부터 원주각 각 CAD = 22.5도를 도출하는 TPL_CIRCLE_ANGLE_CENTER_ARC 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정팔각형 8변의 대칭성으로 중심각 45도를 구하고 원주각 공식으로 22.5도를 도출하는 2단계 서술형 문항이다.

**4칸**
- given: 정다각형←solution:「정팔각형 $ABCDEFGH$가 원 $O$에 내접하므로」
- goal: 각←stem:「$\angle CAD$의 크기를 구하고, 그 과정을 서술하시오.」
- method: 원주각(NAMED)←solution:「$\angle CAD$는 호 $CD$를 바라보는 원주각이고,」
- condition: 대각선←stem:「두 대각선 $\overline{AC}$와 $\overline{AD}$가 이루는 각」

**how** 정팔각형 한 호 CD의 중심각 45도에서 원주각 각 CAD = 22.5도임을 유도하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

정팔각형 $ABCDEFGH$가 원 $O$에 내접하므로 $8$개의 변에 대한 중심각의 크기는 모두 같다. 따라서 한 변 $CD$의 호에 대한 중심각 $\angle COD$의 크기는 다음과 같다. $$ \begin{aligned} \angle COD = \dfrac{360^\circ}{8} = 45^\circ \end{aligned} $$ $\angle CAD$는 호 $CD$를 바라보는 원주각이고, $\angle COD$는 같은 호 $CD$에 대한 중심각이다. 원주각의 크기는 같은 호에 대한 중심각의 크기의 절반이므로 $$ \begin{aligned} \angle CAD &= \dfrac{1}{2} \angle COD \ &= \dfrac{1}{2} \times 45^\circ \ &= 22.5^\circ \quad \left(\text{또는 } \dfrac{45^\circ}{2}\right) \end{aligned} $$ 따라서 구하는 각의 크기는 $22.5^\circ$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점


**발문**

다음 그림에서 선분 $\overline{AQ}$는 원 $O$의 지름이고, $\overline{AH} \perp \overline{BC}$이다. $\overline{AB} = 5$, $\overline{AC} = 4\sqrt{2}$, $\overline{BH} = 3$일 때, 원 $O$의 넓이를 구하고, 그 과정을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\dfrac{25}{2}\pi$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 직각삼각형 ABH에서 피타고라스 정리로 AH = sqrt(5^2 - 3^2) = 4이다.
2. 2) 직각삼각형 ACH에서 피타고라스 정리로 CH = sqrt((4*sqrt(2))^2 - 4^2) = 4이다.
3. 3) AH = CH = 4이므로 삼각형 ACH는 직각이등변삼각형이며 각 ACB = 45도이다.
4. 4) 원주각 성질에 의해 각 AQB = 각 ACB = 45도이다.
5. 5) 지름 AQ에 대한 원주각 각 ABQ = 90도이므로 직각이등변삼각형 ABQ에서 AQ = sqrt(2) * AB = 5*sqrt(2)이다.
6. 6) 반지름 R = 5*sqrt(2) / 2이므로 원의 넓이는 pi * R^2 = pi * (50 / 4) = (25/2)*pi이다.
- 작성자 답: $\dfrac{25}{2}\pi$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-06(원의 성질) / M3-06-CIRCLE_INSCRIBED_ANGLE(원주각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 선분 $\overline{AQ}$는 원 $O$의 지름이고, $\overline{AH} \perp \overline{BC}$이다. $\overline{AB} = 5$, $\overline{AC} = 4\sqrt{2}$, $\overline{BH} = 3$일 때, 원 $O$의 넓이를 구하고, 그 과정을 서술하시오. [6점]」
**RPM** M3-RPM-076 [원의 성질 > 원주각 > 원주각과 중심각 > 반원에 대한 원주각] (원천과 같음)
- 이유: 피타고라스 정리로 AH = CH = 4를 구해 각 ACB = 45도를 얻고 반원 원주각 성질을 결합해 지름 AQ = 5*sqrt(2)와 넓이 25/2*pi를 구하는 M3-RPM-076 문제이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_COMPOSITE (원천과 같음) (원천과 같음)
- 이유: 피타고라스 정리로 높이 4와 원주각 45도를 유도하고 지름 직각삼각형에서 지름 5*sqrt(2)와 원 넓이 25/2*pi를 계산하는 TPL_CIRCLE_ANGLE_COMPOSITE 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 피타고라스 정리로 각도 45도를 복원하고 반원 원주각 성질로 지름 5*sqrt(2)를 구해 넓이 25/2*pi를 도출하는 3단계 복합 서술형 문항이다.

**4칸**
- given: 지름←stem:「선분 $\overline{AQ}$는 원 $O$의 지름이고,」
- goal: 넓이←stem:「원 $O$의 넓이를 구하고, 그 과정을 서술하시오.」
- method: 피타고라스정리(NAMED)←solution:「직각삼각형 $ABH$에서 피타고라스 정리에 의하여」
- condition: 직각삼각형←solution:「$\triangle ABH$와 $\triangle ACH$는 모두 직각삼각형이다.」

**how** 피타고라스 정리로 AH = CH = 4에서 각 ACB = 45도를 얻고 지름 AQ에 대한 직각삼각형에서 지름 5*sqrt(2)를 유도해 넓이 25/2*pi임을 서술하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AH} \perp \overline{BC}$이므로 $\triangle ABH$와 $\triangle ACH$는 모두 직각삼각형이다. 직각삼각형 $ABH$에서 피타고라스 정리에 의하여 $$ \begin{aligned} \overline{AH}^2 &= \overline{AB}^2 - \overline{BH}^2 \ &= 5^2 - 3^2 = 25 - 9 = 16 \ \overline{AH} &= 4 \end{aligned} $$ 직각삼각형 $ACH$에서 피타고라스 정리에 의하여 $$ \begin{aligned} \overline{CH}^2 &= \overline{AC}^2 - \overline{AH}^2 \ &= (4\sqrt{2})^2 - 4^2 = 32 - 16 = 16 \ \overline{CH} &= 4 \end{aligned} $$ 따라서 $\overline{AH} = \overline{CH} = 4$이므로 $\triangle ACH$는 직각이등변삼각형이다. 그러므로 $$ \begin{aligned} \angle ACB = 45^\circ \end{aligned} $$ $\angle AQB$와 $\angle ACB$는 같은 호 $AB$에 대한 원주각이므로 크기가 같다. $$ \begin{aligned} \angle AQB = \angle ACB = 45^\circ \end{aligned} $$ 선분 $AQ$는 원 $O$의 지름이므로 반원에 대한 원주각은 직각이다. $$ \begin{aligned} \angle ABQ = 90^\circ \end{aligned} $$ 따라서 $\triangle ABQ$는 $\angle ABQ = 90^\circ$, $\angle AQB = 45^\circ$인 직각이등변삼각형이므로 $$ \begin{aligned} \overline{AQ} &= \sqrt{2} \times \overline{AB} \ &= 5\sqrt{2} \end{aligned} $$ 원 $O$의 반지름의 길이를 $R$이라 하면 $$ \begin{aligned} R = \dfrac{\overline{AQ}}{2} = \dfrac{5\sqrt{2}}{2} \end{aligned} $$ 따라서 원 $O$의 넓이는 다음과 같다. $$ \begin{aligned} \pi R^2 &= \pi \left(\dfrac{5\sqrt{2}}{2}\right)^2 \ &= \pi \times \dfrac{50}{4} \ &= \dfrac{25}{2}\pi \end{aligned} $$ 따라서 구하는 원의 넓이는 $\dfrac{25}{2}\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 6점


**발문**

세 수 $a, b, c$의 중앙값은 $5$, 평균은 $7$, 분산은 $26$일 때, $a, b, c$의 값을 각각 구하고, 그 과정을 서술하시오. (단, $a < b < c$) [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $a=2, \ b=5, \ c=14$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) a < b < c이고 중앙값이 5이므로 b = 5이다.
2. 2) 세 수의 평균이 7이므로 a + 5 + c = 21에서 a + c = 16, 즉 c = 16 - a이다.
3. 3) 분산이 26이므로 편차제곱합 (a - 7)^2 + (-2)^2 + (c - 7)^2 = 78에서 (a - 7)^2 + (c - 7)^2 = 74이다.
4. 4) c = 16 - a를 대입하면 (a - 7)^2 + (9 - a)^2 = 74에서 2a^2 - 32a + 130 = 74이다.
5. 5) 2a^2 - 32a + 56 = 0, 즉 a^2 - 16a + 28 = (a - 2)(a - 14) = 0이다.
6. 6) a < 5이므로 a = 2이고, c = 16 - 2 = 14이다.
7. 7) 따라서 세 수는 a = 2, b = 5, c = 14이다.
- 작성자 답: $a=2, \ b=5, \ c=14$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_REPRESENTATIVE(대푯값과 산포도) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 수 $a, b, c$의 중앙값은 $5$, 평균은 $7$, 분산은 $26$일 때, $a, b, c$의 값을 각각 구하고, 그 과정을 서술하시오. (단, $a < b < c$) [6점]」
**RPM** M3-RPM-087-S2P-8E9F [통계 > 대푯값과 산포도 > 자료 비교 > 조건으로 자료 추론] (원천과 같음)
- 이유: 중앙값 b = 5, 평균 7(합 21), 분산 26의 연립이차방정식 a^2 - 16a + 28 = 0을 풀어 a = 2, b = 5, c = 14를 구하는 M3-RPM-087-S2P-8E9F 문제이다.
**유형** PT=PT_M3_DISPERSION_DEVIATION_PROPERTIES / TPL=NONE (원천과 같음)
- 이유: 평균 7과 분산 26의 편차 제곱합 관계로부터 이차방정식을 세워 세 수 a=2, b=5, c=14를 복원하는 PT_M3_DISPERSION_DEVIATION_PROPERTIES 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 중앙값 5와 평균 7로 b=5, c=16-a를 세우고 분산 26의 편차제곱합 식을 정리하여 인수분해로 a=2, c=14를 도출하는 3단계 서술형 문항이다.

**4칸**
- given: 자료←solution:「세 수 $a, b, c$에서 $a < b < c$이고」
- goal: 방정식←solution:「a^2 - 16a + 28 &= 0」
- method: 분산(NAMED)←stem:「평균은 $7$, 분산은 $26$일 때,」
- condition: 중앙값←stem:「세 수 $a, b, c$의 중앙값은 $5$,」

**how** 중앙값 b = 5와 평균 7에서 a + c = 16을 얻고 분산 26의 편차제곱합 식 a^2 - 16a + 28 = 0에서 a = 2, c = 14임을 서술하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

세 수 $a, b, c$에서 $a < b < c$이고 중앙값이 $5$이므로 가운데 수 $b$의 값은 다음과 같다. $$ \begin{aligned} b = 5 \end{aligned} $$ 세 수의 평균이 $7$이므로 $$ \begin{aligned} \dfrac{a + b + c}{3} &= 7 \ a + 5 + c &= 21 \ a + c &= 16 \ c &= 16 - a \end{aligned} $$ 세 수의 분산이 $26$이므로 각 변량의 편차의 제곱의 평균은 다음과 같다. $$ \begin{aligned} \dfrac{(a - 7)^2 + (5 - 7)^2 + (c - 7)^2}{3} &= 26 \ (a - 7)^2 + (-2)^2 + (c - 7)^2 &= 78 \ (a - 7)^2 + 4 + (c - 7)^2 &= 78 \ (a - 7)^2 + (c - 7)^2 &= 74 \end{aligned} $$ $c = 16 - a$를 대입하면 $c - 7 = (16 - a) - 7 = 9 - a$이므로 $$ \begin{aligned} (a - 7)^2 + (9 - a)^2 &= 74 \ (a^2 - 14a + 49) + (a^2 - 18a + 81) &= 74 \ 2a^2 - 32a + 130 &= 74 \ 2a^2 - 32a + 56 &= 0 \ a^2 - 16a + 28 &= 0 \ (a - 2)(a - 14) &= 0 \end{aligned} $$ 조건에서 $a < b = 5$이므로 $a = 2$이다. $a = 2$를 $c = 16 - a$에 대입하면 $$ \begin{aligned} c = 16 - 2 = 14 \end{aligned} $$ 따라서 구하는 세 수의 값은 $a = 2, b = 5, c = 14$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 4점


**발문**

다음 자료는 읽기와 듣기를 각각 $10$점 만점으로 평가하는 영어 능력 시험에서 응시자 $10$명의 (읽기 점수, 듣기 점수)를 순서쌍으로 나타낸 것이다. $$(10, 9), \ (9, 9), \ (8, 9), \ (9, 7), \ (8, 7), \ (7, 7), \ (7, 6), \ (6, 6), \ (5, 6), \ (5, 4)$$ 듣기 점수와 읽기 점수의 평균으로 등수를 매겨 상위 $50%$ 이내에 드는 사람을 합격시킨다고 할 때, 합격한 사람들의 읽기 점수의 평균을 구하고, 그 과정을 서술하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $8.8$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 1) 10명의 (읽기, 듣기) 점수 합은 각각 19, 18, 17, 16, 15, 14, 13, 12, 11, 9이다.
2. 2) 상위 50%는 상위 5명이므로 합이 큰 5명은 (10,9), (9,9), (8,9), (9,7), (8,7)이다.
3. 3) 이 5명의 읽기 점수는 각각 10, 9, 8, 9, 8점이다.
4. 4) 읽기 점수의 총합은 10 + 9 + 8 + 9 + 8 = 44점이다.
5. 5) 따라서 합격자들의 읽기 점수 평균은 44 / 5 = 8.8점이다.
- 작성자 답: $8.8$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M3-07(통계) / M3-07-STATISTICS_DATA_INTERPRETATION(통계 자료 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 자료는 읽기와 듣기를 각각 $10$점 만점으로 평가하는 영어 능력 시험에서 응시자 $10$명의 (읽기 점수, 듣기 점수)를 순서쌍으로 나타낸 것이다. $$(10, 9), \ (9, 9), \ (8, 9), \ (9, 7), \ (8, 7), \ (7, 7), \ (7, 6), \ (6, 6), \ (5, 6), \ (5, 4)$$ 듣기 점수와 읽기 점수의 평균으로 등수를 매겨 상위 $50%$ 이내에 드는 사람을 합격시킨다고 할 때, 합격한 사람들의 읽기 점수의 평균을 구하고, 그 과정을 서술하시오. [4점]」
**RPM** M3-RPM-088-S2P-FC25 [통계 > 상관관계 > 산점도 > 산점도 읽기] (원천과 같음)
- 이유: 10명의 점수 합으로 상위 50%인 5명을 선별하고 이들의 읽기 점수 총합 44로부터 평균 8.8을 구하는 M3-RPM-088-S2P-FC25 문제이다.
**유형** PT=PT_M3_SCATTER_PLOT_CORRELATION / TPL=TPL_M3_SCATTER_PLOT_READ_POINT_RATIO
- 이유: 이변량 순서쌍 데이터에서 총점 기준 상위 50% 하위 표본을 추출하고 부분 평균 8.8을 도출하는 TPL_M3_SCATTER_PLOT_READ_POINT_RATIO 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 10명의 총점으로 상위 5명을 선별하고 5명의 읽기 점수 합 44에서 평균 8.8을 계산하는 2단계 서술형 문항이다.

**4칸**
- given: 자료←stem:「다음 자료는 읽기와 듣기를 각각 $10$점 만점으로」
- goal: 평균←stem:「합격한 사람들의 읽기 점수의 평균을 구하고, 그 과정을 서술하시오.」
- method: 순서쌍(NAMED)←stem:「순서쌍으로 나타낸 것이다. $$(10, 9), \ (9, 9),」
- condition: 비율←solution:「전체 응시자 $10$명 중 상위 $50%$는 다음과 같다.」

**how** 두 점수의 합 상위 5명의 읽기 점수 합 10 + 9 + 8 + 9 + 8 = 44에서 평균이 44/5 = 8.8점임을 계산하여 서술 및 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

듣기 점수와 읽기 점수의 평균으로 순위를 정하는 것은 두 점수의 합으로 순위를 정하는 것과 같다. 전체 응시자 $10$명 중 상위 $50%$는 다음과 같다. $$ \begin{aligned} 10 \times 0.5 = 5\text{명} \end{aligned} $$ 각 응시자의 두 점수의 합을 계산하면 다음과 같다. $$ \begin{aligned} (10, 9) &\implies 10 + 9 = 19 \ (9, 9) &\implies 9 + 9 = 18 \ (8, 9) &\implies 8 + 9 = 17 \ (9, 7) &\implies 9 + 7 = 16 \ (8, 7) &\implies 8 + 7 = 15 \ (7, 7) &\implies 7 + 7 = 14 \ (7, 6) &\implies 7 + 6 = 13 \ (6, 6) &\implies 6 + 6 = 12 \ (5, 6) &\implies 5 + 6 = 11 \ (5, 4) &\implies 5 + 4 = 9 \end{aligned} $$ 따라서 두 점수의 합이 가장 큰 상위 $5$명의 점수는 $(10, 9), (9, 9), (8, 9), (9, 7), (8, 7)$이다. 이들의 읽기 점수는 각각 $10, 9, 8, 9, 8$점이므로 읽기 점수의 총합은 $$ \begin{aligned} 10 + 9 + 8 + 9 + 8 = 44\text{점} \end{aligned} $$ 따라서 합격한 사람들의 읽기 점수의 평균은 다음과 같다. $$ \begin{aligned} \dfrac{44}{5} = 8.8\text{점} \quad \left(\text{또는 } \dfrac{44}{5}\right) \end{aligned} $$ 따라서 구하는 평균은 $8.8$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
