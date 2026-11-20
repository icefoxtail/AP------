# 검수 묶음 — 24_왕운중_2학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 24개 / 검사 PASS 23, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 8, 2단계 9, 3단계 7
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q4**: 풀이 과정에 정답 값이 등장하지 않음
- **Q5**: 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q11**: 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q13**: 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 검사 코드: CHOICE_ORDER
- **Q17**: 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q20**: 난이도 경계 (confidence=high, 원천 경계 B34) / 풀이 과정에 정답 값이 등장하지 않음
- **Q23**: 난이도 경계 (confidence=high, 원천 경계 B12)

---
## Q1 — 객관식 3점


**발문**

$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A=56^\circ$일 때, $\angle C$의 크기는? [3점]

**보기** ① $56^\circ$  ② $62^\circ$  ③ $64^\circ$  ④ $68^\circ$  ⑤ $72^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AB}=\overline{AC}$이므로 $\angle B=\angle C$이다.
2. $\angle B+\angle C=180^\circ-56^\circ=124^\circ$ $\therefore \angle C=124^\circ\div 2=62^\circ$ $\therefore$ ②
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A=56^\circ$일 때, $\angle C$의 크기는?」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q1번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_BASE_ANGLES (원천과 같음) (원천과 같음)
- 이유: Q1번 문항은 PT_ISOSCELES_TRIANGLE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A=56^\circ$일 때, $\angle C$의 크기는?」
- goal: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A=56^\circ$일 때, $\angle C$의 크기는?」
- method: 삼각형(NAMED)←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A=56^\circ$일 때, $\angle C$의 크기는?」
- condition: (없음)

**how** Q1번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB}=\overline{AC}$이므로 $\angle B=\angle C$이다. $\angle B+\angle C=180^\circ-56^\circ=124^\circ$ $\therefore \angle C=124^\circ\div 2=62^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점


**발문**

점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle OBC=22^\circ$, $\angle OCA=44^\circ$일 때, $\angle BAO$의 크기는? [3점]

**보기** ① $18^\circ$  ② $20^\circ$  ③ $22^\circ$  ④ $24^\circ$  ⑤ $26^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심 $O$에서 세 꼭짓점까지의 거리는 같으므로 $\overline{OA}=\overline{OB}=\overline{OC}$이다.
2. $\angle OCB=\angle OBC=22^\circ$, $\angle OAC=\angle OCA=44^\circ$이고 $\angle BAO=\angle ABO=x$라 하면 $\triangle ABC$의 세 내각의 합에서 $(x+44^\circ)+(x+22^\circ)+(22^\circ+44^\circ)=180^\circ$ $2x+132^\circ=180^\circ \implies 2x=48^\circ \implies x=24^\circ$ $\therefore$ ④
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle OBC=22^\circ$, $\angle OCA=44^\circ$일 때, $\angle BAO$의 크기는?」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q2번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER (원천과 같음) (원천과 같음)
- 이유: Q2번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle OBC=22^\circ$, $\angle OCA=44^\circ$일 때, $\angle BAO$의 크기는?」
- goal: 외심←stem:「점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle OBC=22^\circ$, $\angle OCA=44^\circ$일 때, $\angle BAO$의 크기는?」
- method: 거리(NAMED)←solution:「외심 $O$에서 세 꼭짓점까지의 거리는 같으므로 $\overline{OA}=\overline{OB}=\overline{OC}$이다.」
- condition: (없음)

**how** Q2번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

외심 $O$에서 세 꼭짓점까지의 거리는 같으므로 $\overline{OA}=\overline{OB}=\overline{OC}$이다. $\angle OCB=\angle OBC=22^\circ$, $\angle OAC=\angle OCA=44^\circ$이고 $\angle BAO=\angle ABO=x$라 하면 $\triangle ABC$의 세 내각의 합에서 $(x+44^\circ)+(x+22^\circ)+(22^\circ+44^\circ)=180^\circ$ $2x+132^\circ=180^\circ \implies 2x=48^\circ \implies x=24^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점


**발문**

점 $I$는 $\triangle ABC$의 내심이다. $\angle ABI=29^\circ$, $\angle ICB=38^\circ$일 때, $\angle IBC$의 크기는? [3점]

**보기** ① $29^\circ$  ② $31^\circ$  ③ $33^\circ$  ④ $38^\circ$  ⑤ $67^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 내심 $I$는 삼각형의 세 내각의 이등분선의 교점이므로 $BI$는 $\angle B$를 이등분한다.
2. $\therefore \angle IBC=\angle ABI=29^\circ$ $\therefore$ ①
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $I$는 $\triangle ABC$의 내심이다.」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q3번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER (원천과 같음) (원천과 같음)
- 이유: Q3번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 내심←stem:「점 $I$는 $\triangle ABC$의 내심이다.」
- goal: 삼각형←solution:「내심 $I$는 삼각형의 세 내각의 이등분선의 교점이므로 $BI$는 $\angle B$를 이등분한다.」
- method: 이등분선(NAMED)←solution:「내심 $I$는 삼각형의 세 내각의 이등분선의 교점이므로 $BI$는 $\angle B$를 이등분한다.」
- condition: (없음)

**how** Q3번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

내심 $I$는 삼각형의 세 내각의 이등분선의 교점이므로 $BI$는 $\angle B$를 이등분한다. $\therefore \angle IBC=\angle ABI=29^\circ$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 하자. $\overline{AC}=14$, $\overline{BO}=9$, $\overline{OC}=x$, $\overline{OD}=y$일 때, $x+y$의 값은? [3점]

**보기** ① $12$  ② $14$  ③ $16$  ④ $18$  ⑤ $23$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 ABCD)
2. 주어진 조건을 계산하여 정답 ③을(를) 도출한다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 하자.」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질]
- 이유: Q4번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES (원천과 같음) (원천과 같음)
- 이유: Q4번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 하자.」
- goal: 평행←stem:「평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 하자.」
- method: 이등분(NAMED)←solution:「평행사변형의 두 대각선은 서로를 이등분하므로 $x=\overline{OC}=\dfrac{1}{2}\overline{AC}=\dfrac{1}{2}\times 14=7$ $y=\overline{OD}=\overline{BO}=9$ $\therefore x+y=7+9=16$ $\therefore$ ③」
- condition: (없음)

**how** Q4번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형의 두 대각선은 서로를 이등분하므로 $x=\overline{OC}=\dfrac{1}{2}\overline{AC}=\dfrac{1}{2}\times 14=7$ $y=\overline{OD}=\overline{BO}=9$ $\therefore x+y=7+9=16$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

크기에 관계없이 언제나 서로 닮은 도형의 쌍은? [3점]

**보기** ① 두 이등변삼각형  ② 두 직사각형  ③ 두 마름모  ④ 두 사다리꼴  ⑤ 두 정사면체

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 두 이등변삼각형은 꼭짓각의 크기가 다를 수 있다. (문항 토큰 3)
2. ② 두 직사각형은 가로와 세로의 비가 다를 수 있다.
3. ③ 두 마름모는 한 내각의 크기가 다를 수 있다.
4. ④ 두 사다리꼴은 각의 크기와 변의 비가 다를 수 있다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「크기에 관계없이 언제나 서로 닮은 도형의 쌍은?」
**RPM** M2-RPM-237 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비]
- 이유: Q5번 문항은 M2-RPM-237에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 3)
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_RATIO (원천과 같음) (원천과 같음)
- 이유: Q5번 문항은 PT_SIMILAR_FIGURES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 3)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 3)

**4칸**
- given: 닮은←stem:「크기에 관계없이 언제나 서로 닮은 도형의 쌍은?」
- goal: 관계←stem:「크기에 관계없이 언제나 서로 닮은 도형의 쌍은?」
- method: 삼각형(NAMED)←solution:「① 두 이등변삼각형은 꼭짓각의 크기가 다를 수 있다.」
- condition: (없음)

**how** Q5번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 3)

<details><summary>저장 해설 (판정 검토용)</summary>

① 두 이등변삼각형은 꼭짓각의 크기가 다를 수 있다. ② 두 직사각형은 가로와 세로의 비가 다를 수 있다. ③ 두 마름모는 한 내각의 크기가 다를 수 있다. ④ 두 사다리꼴은 각의 크기와 변의 비가 다를 수 있다. ⑤ 두 정사면체는 모든 면이 정삼각형인 정다면체이므로 언제나 서로 닮은 도형이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $E$라 하자. $\angle AEB=61^\circ$일 때, $\angle C$의 크기는? [4점]

**보기** ① $118^\circ$  ② $122^\circ$  ③ $124^\circ$  ④ $128^\circ$  ⑤ $132^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AD}\parallel\overline{BC}$이므로 $\angle DAE=\angle AEB=61^\circ$ (엇각)이다.
2. $\overline{AE}$가 $\angle A$의 이등분선이므로 $\angle A=2\angle DAE=2\times 61^\circ=122^\circ$이다.
3. 평행사변형에서 대각의 크기는 같으므로 $\angle C=\angle A=122^\circ$이다.
4. $\therefore$ ②
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $E$라 하자.」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질]
- 이유: Q6번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES (원천과 같음) (원천과 같음)
- 이유: Q6번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $E$라 하자.」
- goal: 이등분선←stem:「평행사변형 $ABCD$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $E$라 하자.」
- method: 엇각(NAMED)←solution:「$\overline{AD}\parallel\overline{BC}$이므로 $\angle DAE=\angle AEB=61^\circ$ (엇각)이다.」
- condition: (없음)

**how** Q6번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD}\parallel\overline{BC}$이므로 $\angle DAE=\angle AEB=61^\circ$ (엇각)이다. $\overline{AE}$가 $\angle A$의 이등분선이므로 $\angle A=2\angle DAE=2\times 61^\circ=122^\circ$이다. 평행사변형에서 대각의 크기는 같으므로 $\angle C=\angle A=122^\circ$이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $35^\circ$인 직각삼각형과 합동인 도형은? [4점]

**보기** ① 직각을 낀 한 변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $55^\circ$인 직각삼각형  ② 빗변의 길이가 $8\text{ cm}$이고 다른 한 변의 길이가 $5\text{ cm}$인 직각삼각형  ③ 빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $55^\circ$인 직각삼각형  ④ 세 내각의 크기가 $35^\circ$, $55^\circ$, $90^\circ$인 직각삼각형  ⑤ 직각을 낀 두 변의 길이가 각각 $5\text{ cm}$, $8\text{ cm}$인 직각삼각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 주어진 직각삼각형의 나머지 한 예각의 크기는 $90^\circ-35^\circ=55^\circ$이다.
2. 따라서 빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $55^\circ$인 직각삼각형은 빗변의 길이와 한 예각의 크기가 각각 같으므로 RHA 합동이다.
3. $\therefore$ ③
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $35^\circ$인 직각삼각형과 합동인 도형은?」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q7번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE (원천과 같음) (원천과 같음)
- 이유: Q7번 문항은 PT_RIGHT_TRIANGLE_CONGRUENCE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 삼각형←stem:「빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $35^\circ$인 직각삼각형과 합동인 도형은?」
- goal: 직각삼각형←stem:「빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $35^\circ$인 직각삼각형과 합동인 도형은?」
- method: 나머지(NAMED)←solution:「주어진 직각삼각형의 나머지 한 예각의 크기는 $90^\circ-35^\circ=55^\circ$이다.」
- condition: (없음)

**how** Q7번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 직각삼각형의 나머지 한 예각의 크기는 $90^\circ-35^\circ=55^\circ$이다. 따라서 빗변의 길이가 $8\text{ cm}$이고 한 예각의 크기가 $55^\circ$인 직각삼각형은 빗변의 길이와 한 예각의 크기가 각각 같으므로 RHA 합동이다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

서로 닮은 두 원뿔 $A$, $B$의 밑면의 반지름의 길이의 비가 $3:5$일 때, 두 원뿔 $A$, $B$의 부피의 비는? [4점]

**보기** ① $3 : 5$  ② $6 : 10$  ③ $9 : 25$  ④ $27 : 125$  ⑤ $9 : 125$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 서로 닮은 두 입체도형의 닮음비가 $3:5$이므로 부피의 비는 $3^3:5^3=27:125$이다.
2. $\therefore$ ④
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「서로 닮은 두 원뿔 $A$, $B$의 밑면의 반지름의 길이의 비가 $3:5$일 때, 두 원뿔 $A$, $B$의 부피의 비는?」
**RPM** M2-RPM-237 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비]
- 이유: Q8번 문항은 M2-RPM-237에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_AREA_VOLUME (원천과 같음) (원천과 같음)
- 이유: Q8번 문항은 PT_SIMILAR_FIGURES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 반지름←stem:「서로 닮은 두 원뿔 $A$, $B$의 밑면의 반지름의 길이의 비가 $3:5$일 때, 두 원뿔 $A$, $B$의 부피의 비는?」
- goal: 닮은←stem:「서로 닮은 두 원뿔 $A$, $B$의 밑면의 반지름의 길이의 비가 $3:5$일 때, 두 원뿔 $A$, $B$의 부피의 비는?」
- method: 입체도형(NAMED)←solution:「서로 닮은 두 입체도형의 닮음비가 $3:5$이므로 부피의 비는 $3^3:5^3=27:125$이다.」
- condition: (없음)

**how** Q8번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

서로 닮은 두 입체도형의 닮음비가 $3:5$이므로 부피의 비는 $3^3:5^3=27:125$이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

정십각형 $ABCDEFGHIJ$에서 두 대각선 $AC$와 $BJ$의 교점을 $P$라 할 때, $\angle CPJ$의 크기는? [4점]

**보기** ① $144^\circ$  ② $136^\circ$  ③ $135^\circ$  ④ $126^\circ$  ⑤ $108^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 정십각형의 한 내각의 크기는 $\dfrac{180^\circ\times(10-2)}{10}=144^\circ$이다.
2. $\triangle ABC$에서 $\overline{AB}=\overline{BC}$이므로 $\angle BAC=\dfrac{180^\circ-144^\circ}{2}=18^\circ$이다.
3. 같은 방법으로 $\triangle ABJ$에서 $\overline{AB}=\overline{AJ}$이므로 $\angle ABJ=18^\circ$이다.
4. 따라서 $\triangle ABP$에서 $\angle APB=180^\circ-(18^\circ+18^\circ)=144^\circ$이고, 맞꼭지각에 의해 $\angle CPJ=\angle APB=144^\circ$이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「정십각형 $ABCDEFGHIJ$에서 두 대각선 $AC$와 $BJ$의 교점을 $P$라 할 때, $\angle CPJ$의 크기는?」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q9번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCDEFGHIJ)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_BASE_ANGLES (원천과 같음) (원천과 같음)
- 이유: Q9번 문항은 PT_ISOSCELES_TRIANGLE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCDEFGHIJ)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABCDEFGHIJ)

**4칸**
- given: 교점←stem:「정십각형 $ABCDEFGHIJ$에서 두 대각선 $AC$와 $BJ$의 교점을 $P$라 할 때, $\angle CPJ$의 크기는?」
- goal: 대각선←stem:「정십각형 $ABCDEFGHIJ$에서 두 대각선 $AC$와 $BJ$의 교점을 $P$라 할 때, $\angle CPJ$의 크기는?」
- method: 내각(NAMED)←solution:「정십각형의 한 내각의 크기는 $\dfrac{180^\circ\times(10-2)}{10}=144^\circ$이다.」
- condition: (없음)

**how** Q9번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ABCDEFGHIJ)

<details><summary>저장 해설 (판정 검토용)</summary>

정십각형의 한 내각의 크기는 $\dfrac{180^\circ\times(10-2)}{10}=144^\circ$이다. $\triangle ABC$에서 $\overline{AB}=\overline{BC}$이므로 $\angle BAC=\dfrac{180^\circ-144^\circ}{2}=18^\circ$이다. 같은 방법으로 $\triangle ABJ$에서 $\overline{AB}=\overline{AJ}$이므로 $\angle ABJ=18^\circ$이다. 따라서 $\triangle ABP$에서 $\angle APB=180^\circ-(18^\circ+18^\circ)=144^\circ$이고, 맞꼭지각에 의해 $\angle CPJ=\angle APB=144^\circ$이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

직사각형 $ABCD$에서 $\angle ACB=34^\circ$일 때, $\angle BDC$의 크기는? [4점]

**보기** ① $34^\circ$  ② $46^\circ$  ③ $52^\circ$  ④ $54^\circ$  ⑤ $56^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직사각형 $ABCD$에서 $\overline{AB}=\overline{DC}$, $\overline{BC}$는 공통, $\angle ABC=\angle DCB=90^\circ$이므로 $\triangle ABC \equiv \triangle DCB$ (SAS 합동)이다.
2. 따라서 $\angle DBC=\angle ACB=34^\circ$이다.
3. $\triangle DBC$에서 $\angle BCD=90^\circ$이므로 $\angle BDC=180^\circ-90^\circ-34^\circ=56^\circ$이다.
4. $\therefore$ ⑤
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직사각형 $ABCD$에서 $\angle ACB=34^\circ$일 때, $\angle BDC$의 크기는?」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질]
- 이유: Q10번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS (원천과 같음) (원천과 같음)
- 이유: Q10번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「직사각형 $ABCD$에서 $\angle ACB=34^\circ$일 때, $\angle BDC$의 크기는?」
- goal: 직사각형←stem:「직사각형 $ABCD$에서 $\angle ACB=34^\circ$일 때, $\angle BDC$의 크기는?」
- method: 합동(NAMED)←solution:「직사각형 $ABCD$에서 $\overline{AB}=\overline{DC}$, $\overline{BC}$는 공통, $\angle ABC=\angle DCB=90^\circ$이므로 $\triangle ABC \equiv \triangle DCB$ (SAS 합동)이다.」
- condition: (없음)

**how** Q10번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형 $ABCD$에서 $\overline{AB}=\overline{DC}$, $\overline{BC}$는 공통, $\angle ABC=\angle DCB=90^\circ$이므로 $\triangle ABC \equiv \triangle DCB$ (SAS 합동)이다. 따라서 $\angle DBC=\angle ACB=34^\circ$이다. $\triangle DBC$에서 $\angle BCD=90^\circ$이므로 $\angle BDC=180^\circ-90^\circ-34^\circ=56^\circ$이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

마름모 $ABCD$의 두 대각선의 길이가 $\overline{AC}=10\text{ cm}$, $\overline{BD}=14\text{ cm}$일 때, 마름모 $ABCD$의 넓이는? [4점]

**보기** ① $56\text{ cm}^2$  ② $60\text{ cm}^2$  ③ $70\text{ cm}^2$  ④ $84\text{ cm}^2$  ⑤ $140\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 ABCD)
2. 주어진 조건을 계산하여 정답 ③을(를) 도출한다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$의 두 대각선의 길이가 $\overline{AC}=10\text{ cm}$, $\overline{BD}=14\text{ cm}$일 때, 마름모 $ABCD$의 넓이는?」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질]
- 이유: Q11번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS (원천과 같음) (원천과 같음)
- 이유: Q11번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 마름모←stem:「마름모 $ABCD$의 두 대각선의 길이가 $\overline{AC}=10\text{ cm}$, $\overline{BD}=14\text{ cm}$일 때, 마름모 $ABCD$의 넓이는?」
- goal: 넓이←stem:「마름모 $ABCD$의 두 대각선의 길이가 $\overline{AC}=10\text{ cm}$, $\overline{BD}=14\text{ cm}$일 때, 마름모 $ABCD$의 넓이는?」
- method: 길이(NAMED)←solution:「마름모의 넓이는 두 대각선의 길이의 곱의 $\dfrac{1}{2}$이므로 $\dfrac{1}{2}\times 10\times 14=70\text{ cm}^2$ $\therefore$ ③」
- condition: (없음)

**how** Q11번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

마름모의 넓이는 두 대각선의 길이의 곱의 $\dfrac{1}{2}$이므로 $\dfrac{1}{2}\times 10\times 14=70\text{ cm}^2$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 두 변 $AB$, $BC$에 내린 수선의 발을 각각 $F$, $D$라 하자. $\overline{AC}=11\text{ cm}$, $\overline{AF}=4\text{ cm}$, $\overline{DC}=6\text{ cm}$일 때, $\triangle ABC$의 둘레의 길이는? [4점]

**보기** ① $28\text{ cm}$  ② $31\text{ cm}$  ③ $33\text{ cm}$  ④ $35\text{ cm}$  ⑤ $38\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심에서 각 변에 내린 수선은 그 변을 이등분하므로 $\overline{AB}=2\overline{AF}=2\times 4=8\text{ cm}$, $\overline{BC}=2\overline{DC}=2\times 6=12\text{ cm}$이다.
2. $\therefore (\triangle ABC\text{의 둘레})=8+12+11=31\text{ cm}$ $\therefore$ ②
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 두 변 $AB$, $BC$에 내린 수선의 발을 각각 $F$, $D$라 하자.」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q12번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER (원천과 같음) (원천과 같음)
- 이유: Q12번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 수선←stem:「점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 두 변 $AB$, $BC$에 내린 수선의 발을 각각 $F$, $D$라 하자.」
- goal: 외심←stem:「점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 두 변 $AB$, $BC$에 내린 수선의 발을 각각 $F$, $D$라 하자.」
- method: 이등분(NAMED)←solution:「외심에서 각 변에 내린 수선은 그 변을 이등분하므로 $\overline{AB}=2\overline{AF}=2\times 4=8\text{ cm}$, $\overline{BC}=2\overline{DC}=2\times 6=12\text{ cm}$이다.」
- condition: (없음)

**how** Q12번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

외심에서 각 변에 내린 수선은 그 변을 이등분하므로 $\overline{AB}=2\overline{AF}=2\times 4=8\text{ cm}$, $\overline{BC}=2\overline{DC}=2\times 6=12\text{ cm}$이다. $\therefore (\triangle ABC\text{의 둘레})=8+12+11=31\text{ cm}$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

사각형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때, 다음 조건 중 $\square ABCD$가 평행사변형이 되지 않는 것은? [4점]

**보기** ① $\angle A=\angle B$, $\angle C=\angle D$  ② $\triangle ABC \equiv \triangle CDA$  ③ $\overline{OA}=\overline{OC}$, $\overline{OB}=\overline{OD}$  ④ $\angle A=\angle C$, $\overline{AB}\parallel\overline{DC}$  ⑤ $\overline{AB}=\overline{DC}$, $\angle BAC=\angle DCA$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 이웃한 두 각씩 크기가 같은 조건만으로는 등변사다리꼴이 될 수 있으므로 평행사변형이라 할 수 없다.
2. ② 합동에 의해 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{DA}$이므로 평행사변형이다.
3. ③ 두 대각선이 서로를 이등분하므로 평행사변형이다.
4. ④ $\overline{AB}\parallel\overline{DC}$이면 $\angle A+\angle D=180^\circ$이고 $\angle A=\angle C$이므로 $\angle C+\angle D=180^\circ$가 되어 $\overline{AD}\parallel\overline{BC}$이므로 평행사변형이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「사각형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때, 다음 조건 중 $\square ABCD$가 평행사변형이 되지 않는 것은?」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질]
- 이유: Q13번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA (원천과 같음) (원천과 같음)
- 이유: Q13번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「사각형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때, 다음 조건 중 $\square ABCD$가 평행사변형이 되지 않는 것은?」
- goal: 평행사변형←stem:「사각형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때, 다음 조건 중 $\square ABCD$가 평행사변형이 되지 않는 것은?」
- method: 사다리꼴(NAMED)←solution:「① 이웃한 두 각씩 크기가 같은 조건만으로는 등변사다리꼴이 될 수 있으므로 평행사변형이라 할 수 없다.」
- condition: (없음)

**how** Q13번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

① 이웃한 두 각씩 크기가 같은 조건만으로는 등변사다리꼴이 될 수 있으므로 평행사변형이라 할 수 없다. ② 합동에 의해 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{DA}$이므로 평행사변형이다. ③ 두 대각선이 서로를 이등분하므로 평행사변형이다. ④ $\overline{AB}\parallel\overline{DC}$이면 $\angle A+\angle D=180^\circ$이고 $\angle A=\angle C$이므로 $\angle C+\angle D=180^\circ$가 되어 $\overline{AD}\parallel\overline{BC}$이므로 평행사변형이다. ⑤ 엇각이 같으므로 $\overline{AB}\parallel\overline{DC}$이고 $\overline{AB}=\overline{DC}$이므로 평행사변형이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

평행사변형 $ABCD$에서 변 $BC$의 중점을 $M$이라 하고, 직선 $AM$과 직선 $DC$의 교점을 $E$라 하자. $\triangle DME$의 넓이가 $24\text{ cm}^2$일 때, 사각형 $ABMD$의 넓이는? [4점]

**보기** ① $24\text{ cm}^2$  ② $28\text{ cm}^2$  ③ $30\text{ cm}^2$  ④ $32\text{ cm}^2$  ⑤ $36\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AB}\parallel\overline{CE}$이므로 $\angle ABM=\angle ECM$이고 $\overline{BM}=\overline{CM}$, $\angle AMB=\angle EMC$이므로 $\triangle ABM \equiv \triangle ECM$ (ASA 합동)이다.
2. 따라서 $\overline{AM}=\overline{ME}$, $\overline{CE}=\overline{AB}=\overline{CD}$이다.
3. $M$이 $\overline{AE}$의 중점이므로 $\triangle DMA=\triangle DME=24\text{ cm}^2$이고 $\triangle ADE=48\text{ cm}^2$이다.
4. $C$가 $\overline{DE}$의 중점이므로 $\triangle ADC=\dfrac{1}{2}\triangle ADE=24\text{ cm}^2$이고 $\square ABCD=48\text{ cm}^2$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 변 $BC$의 중점을 $M$이라 하고, 직선 $AM$과 직선 $DC$의 교점을 $E$라 하자.」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질]
- 이유: Q14번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES (원천과 같음) (원천과 같음)
- 이유: Q14번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 직선←stem:「평행사변형 $ABCD$에서 변 $BC$의 중점을 $M$이라 하고, 직선 $AM$과 직선 $DC$의 교점을 $E$라 하자.」
- goal: 평행사변형←stem:「평행사변형 $ABCD$에서 변 $BC$의 중점을 $M$이라 하고, 직선 $AM$과 직선 $DC$의 교점을 $E$라 하자.」
- method: 합동(NAMED)←solution:「$\overline{AB}\parallel\overline{CE}$이므로 $\angle ABM=\angle ECM$이고 $\overline{BM}=\overline{CM}$, $\angle AMB=\angle EMC$이므로 $\triangle ABM \equiv \triangle ECM$ (ASA 합동)이다.」
- condition: (없음)

**how** Q14번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB}\parallel\overline{CE}$이므로 $\angle ABM=\angle ECM$이고 $\overline{BM}=\overline{CM}$, $\angle AMB=\angle EMC$이므로 $\triangle ABM \equiv \triangle ECM$ (ASA 합동)이다. 따라서 $\overline{AM}=\overline{ME}$, $\overline{CE}=\overline{AB}=\overline{CD}$이다. $M$이 $\overline{AE}$의 중점이므로 $\triangle DMA=\triangle DME=24\text{ cm}^2$이고 $\triangle ADE=48\text{ cm}^2$이다. $C$가 $\overline{DE}$의 중점이므로 $\triangle ADC=\dfrac{1}{2}\triangle ADE=24\text{ cm}^2$이고 $\square ABCD=48\text{ cm}^2$이다. $\triangle MCD=\dfrac{1}{2}\triangle BCD=\dfrac{1}{4}\square ABCD=12\text{ cm}^2$이므로 $\square ABMD=48-12=36\text{ cm}^2$이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

점 $O$를 중심으로 하는 두 동심원에서 작은 원 위의 점 $P$와 큰 원 위의 점 $Q$가 반직선 $OP$ 위에 있고 $\overline{OP}:\overline{PQ}=1:3$이다. 큰 원과 작은 원 사이의 도넛 모양 부분 (가)와 작은 원 (나)의 넓이의 비는? [4점]

**보기** ① $8 : 1$  ② $9 : 1$  ③ $12 : 1$  ④ $15 : 1$  ⑤ $16 : 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{OP}=r$라 하면 $\overline{PQ}=3r$이므로 큰 원의 반지름은 $\overline{OQ}=r+3r=4r$이다.
2. (가)의 넓이는 $\pi(4r)^2-\pi r^2=15\pi r^2$, (나)의 넓이는 $\pi r^2$이다.
3. $\therefore (\text{가}):(\text{나})=15\pi r^2:\pi r^2=15:1$ $\therefore$ ④
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$를 중심으로 하는 두 동심원에서 작은 원 위의 점 $P$와 큰 원 위의 점 $Q$가 반직선 $OP$ 위에 있고 $\overline{OP}:\overline{PQ}=1:3$이다.」
**RPM** M2-RPM-237 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비]
- 이유: Q15번 문항은 M2-RPM-237에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 OP)
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_AREA_VOLUME (원천과 같음) (원천과 같음)
- 이유: Q15번 문항은 PT_SIMILAR_FIGURES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 OP)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 OP)

**4칸**
- given: 직선←stem:「점 $O$를 중심으로 하는 두 동심원에서 작은 원 위의 점 $P$와 큰 원 위의 점 $Q$가 반직선 $OP$ 위에 있고 $\overline{OP}:\overline{PQ}=1:3$이다.」
- goal: 반직선←stem:「점 $O$를 중심으로 하는 두 동심원에서 작은 원 위의 점 $P$와 큰 원 위의 점 $Q$가 반직선 $OP$ 위에 있고 $\overline{OP}:\overline{PQ}=1:3$이다.」
- method: 반지름(NAMED)←solution:「$\overline{OP}=r$라 하면 $\overline{PQ}=3r$이므로 큰 원의 반지름은 $\overline{OQ}=r+3r=4r$이다.」
- condition: (없음)

**how** Q15번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 OP)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{OP}=r$라 하면 $\overline{PQ}=3r$이므로 큰 원의 반지름은 $\overline{OQ}=r+3r=4r$이다. (가)의 넓이는 $\pi(4r)^2-\pi r^2=15\pi r^2$, (나)의 넓이는 $\pi r^2$이다. $\therefore (\text{가}):(\text{나})=15\pi r^2:\pi r^2=15:1$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=20\text{ cm}$, $\overline{BC}=16\text{ cm}$, $\overline{AC}=12\text{ cm}$이다. 외접원의 반지름의 길이를 $r_1\text{ cm}$, 내접원의 반지름의 길이를 $r_2\text{ cm}$라 할 때, $r_1-r_2$의 값은? [5점]

**보기** ① $6$  ② $4$  ③ $5$  ④ $7$  ⑤ $8$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형의 외심은 빗변의 중점이므로 $r_1=\dfrac{20}{2}=10$이다.
2. $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 12\times 16=96\text{ cm}^2$이고, $\dfrac{1}{2}r_2(12+16+20)=96 \implies 24r_2=96 \implies r_2=4$이다.
3. $\therefore r_1-r_2=10-4=6$ $\therefore$ ①
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=20\text{ cm}$, $\overline{BC}=16\text{ cm}$, $\overline{AC}=12\text{ cm}$이다.」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q16번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_COMBINED (원천과 같음) (원천과 같음)
- 이유: Q16번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=20\text{ cm}$, $\overline{BC}=16\text{ cm}$, $\overline{AC}=12\text{ cm}$이다.」
- goal: 직각삼각형←stem:「$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\overline{AB}=20\text{ cm}$, $\overline{BC}=16\text{ cm}$, $\overline{AC}=12\text{ cm}$이다.」
- method: 빗변(NAMED)←solution:「직각삼각형의 외심은 빗변의 중점이므로 $r_1=\dfrac{20}{2}=10$이다.」
- condition: (없음)

**how** Q16번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형의 외심은 빗변의 중점이므로 $r_1=\dfrac{20}{2}=10$이다. $\triangle ABC$의 넓이는 $\dfrac{1}{2}\times 12\times 16=96\text{ cm}^2$이고, $\dfrac{1}{2}r_2(12+16+20)=96 \implies 24r_2=96 \implies r_2=4$이다. $\therefore r_1-r_2=10-4=6$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

정사각형 $ABCD$의 외부에 $\overline{AB}=\overline{AP}$가 되도록 점 $P$를 잡았다. 반직선 $DP$가 $\overline{DA}$와 대각선 $DB$ 사이에 있고 $\angle PDB=21^\circ$일 때, $\angle PBA$의 크기는? [5점]

**보기** ① $65^\circ$  ② $69^\circ$  ③ $71^\circ$  ④ $73^\circ$  ⑤ $75^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 정사각형에서 $\angle ADB=45^\circ$이므로 $\angle PDA=45^\circ-21^\circ=24^\circ$이다.
2. $\overline{AP}=\overline{AB}=\overline{AD}$이므로 $\triangle APD$는 이등변삼각형이고 $\angle APD=\angle PDA=24^\circ$이다.
3. 따라서 $\angle PAD=180^\circ-24^\circ-24^\circ=132^\circ$이다.
4. $\angle DAB=90^\circ$이므로 $\angle PAB=132^\circ-90^\circ=42^\circ$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「정사각형 $ABCD$의 외부에 $\overline{AB}=\overline{AP}$가 되도록 점 $P$를 잡았다.」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질]
- 이유: Q17번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS (원천과 같음) (원천과 같음)
- 이유: Q17번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「정사각형 $ABCD$의 외부에 $\overline{AB}=\overline{AP}$가 되도록 점 $P$를 잡았다.」
- goal: 정사각형←stem:「정사각형 $ABCD$의 외부에 $\overline{AB}=\overline{AP}$가 되도록 점 $P$를 잡았다.」
- method: 삼각형(NAMED)←solution:「$\overline{AP}=\overline{AB}=\overline{AD}$이므로 $\triangle APD$는 이등변삼각형이고 $\angle APD=\angle PDA=24^\circ$이다.」
- condition: (없음)

**how** Q17번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

정사각형에서 $\angle ADB=45^\circ$이므로 $\angle PDA=45^\circ-21^\circ=24^\circ$이다. $\overline{AP}=\overline{AB}=\overline{AD}$이므로 $\triangle APD$는 이등변삼각형이고 $\angle APD=\angle PDA=24^\circ$이다. 따라서 $\angle PAD=180^\circ-24^\circ-24^\circ=132^\circ$이다. $\angle DAB=90^\circ$이므로 $\angle PAB=132^\circ-90^\circ=42^\circ$이다. $\overline{AP}=\overline{AB}$이므로 $\triangle APB$에서 $\angle PBA=\dfrac{180^\circ-42^\circ}{2}=69^\circ$이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 점 $O$는 외심, 점 $I$는 내심이고 $\angle OAC=22^\circ$일 때, $\angle OCI$의 크기는? [5점]

**보기** ① $6^\circ$  ② $8^\circ$  ③ $10^\circ$  ④ $12^\circ$  ⑤ $14^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{OA}=\overline{OC}$이므로 $\angle OCA=\angle OAC=22^\circ$이다.
2. 외심 $O$는 이등변삼각형 $ABC$의 꼭짓각 $A$의 이등분선 위에 있으므로 $\angle A=2\times 22^\circ=44^\circ$이다.
3. 따라서 $\angle ACB=\dfrac{180^\circ-44^\circ}{2}=68^\circ$이다.
4. 내심 $I$는 $\angle C$를 이등분하므로 $\angle ACI=\dfrac{68^\circ}{2}=34^\circ$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 점 $O$는 외심, 점 $I$는 내심이고 $\angle OAC=22^\circ$일 때, $\angle OCI$의 크기는?」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q18번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_COMBINED (원천과 같음) (원천과 같음)
- 이유: Q18번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 점 $O$는 외심, 점 $I$는 내심이고 $\angle OAC=22^\circ$일 때, $\angle OCI$의 크기는?」
- goal: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 점 $O$는 외심, 점 $I$는 내심이고 $\angle OAC=22^\circ$일 때, $\angle OCI$의 크기는?」
- method: 꼭짓각(NAMED)←solution:「외심 $O$는 이등변삼각형 $ABC$의 꼭짓각 $A$의 이등분선 위에 있으므로 $\angle A=2\times 22^\circ=44^\circ$이다.」
- condition: (없음)

**how** Q18번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{OA}=\overline{OC}$이므로 $\angle OCA=\angle OAC=22^\circ$이다. 외심 $O$는 이등변삼각형 $ABC$의 꼭짓각 $A$의 이등분선 위에 있으므로 $\angle A=2\times 22^\circ=44^\circ$이다. 따라서 $\angle ACB=\dfrac{180^\circ-44^\circ}{2}=68^\circ$이다. 내심 $I$는 $\angle C$를 이등분하므로 $\angle ACI=\dfrac{68^\circ}{2}=34^\circ$이다. $\therefore \angle OCI=\angle ACI-\angle OCA=34^\circ-22^\circ=12^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

평행사변형 $ABCD$에서 변 $AB$의 중점을 $M$이라 하고, 꼭짓점 $D$에서 선분 $CM$에 내린 수선의 발을 $P$라 하자. $\angle CDP=16^\circ$, $\angle BCM=24^\circ$일 때, $\angle ABC$의 크기는? [5점]

**보기** ① $74^\circ$  ② $76^\circ$  ③ $78^\circ$  ④ $80^\circ$  ⑤ $82^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle DCP$에서 $\angle DPC=90^\circ$이므로 $\angle DCP=180^\circ-90^\circ-16^\circ=74^\circ$이다.
2. 따라서 $\angle BCD=\angle BCM+\angle DCP=24^\circ+74^\circ=98^\circ$이다.
3. 평행사변형에서 이웃한 두 내각의 합은 $180^\circ$이므로 $\angle ABC=180^\circ-98^\circ=82^\circ$이다.
4. $\therefore$ ⑤
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 변 $AB$의 중점을 $M$이라 하고, 꼭짓점 $D$에서 선분 $CM$에 내린 수선의 발을 $P$라 하자.」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질]
- 이유: Q19번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES (원천과 같음) (원천과 같음)
- 이유: Q19번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 선분←stem:「평행사변형 $ABCD$에서 변 $AB$의 중점을 $M$이라 하고, 꼭짓점 $D$에서 선분 $CM$에 내린 수선의 발을 $P$라 하자.」
- goal: 평행사변형←stem:「평행사변형 $ABCD$에서 변 $AB$의 중점을 $M$이라 하고, 꼭짓점 $D$에서 선분 $CM$에 내린 수선의 발을 $P$라 하자.」
- method: 평행(NAMED)←solution:「평행사변형에서 이웃한 두 내각의 합은 $180^\circ$이므로 $\angle ABC=180^\circ-98^\circ=82^\circ$이다.」
- condition: (없음)

**how** Q19번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle DCP$에서 $\angle DPC=90^\circ$이므로 $\angle DCP=180^\circ-90^\circ-16^\circ=74^\circ$이다. 따라서 $\angle BCD=\angle BCM+\angle DCP=24^\circ+74^\circ=98^\circ$이다. 평행사변형에서 이웃한 두 내각의 합은 $180^\circ$이므로 $\angle ABC=180^\circ-98^\circ=82^\circ$이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B34)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\overline{AB}=\overline{AC}=\overline{CD}=\overline{CE}$, $\overline{DE}=\overline{FE}$이고 세 점 $B$, $A$, $D$와 세 점 $B$, $C$, $E$, 세 점 $A$, $D$, $F$가 각각 한 직선 위에 차례로 놓여 있다. $\angle EDF=71^\circ$일 때, $\angle ABC$의 크기는? [5점]

**보기** ① $34^\circ$  ② $36^\circ$  ③ $38^\circ$  ④ $40^\circ$  ⑤ $42^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle ABC=x$라 하면 $\overline{AB}=\overline{AC}$이므로 $\angle ACB=x$, $\angle CAD=2x$이다.
2. $\overline{AC}=\overline{CD}$이므로 $\angle CDA=2x$, $\angle ACD=180^\circ-4x$이다.
3. $\angle ACE=180^\circ-x$이므로 $\angle DCE=(180^\circ-x)-(180^\circ-4x)=3x$이다.
4. $\overline{CD}=\overline{CE}$이므로 $\angle CDE=\dfrac{180^\circ-3x}{2}=90^\circ-\dfrac{3}{2}x$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=\overline{AC}=\overline{CD}=\overline{CE}$, $\overline{DE}=\overline{FE}$이고 세 점 $B$, $A$, $D$와 세 점 $B$, $C$, $E$, 세 점 $A$, $D$, $F$가 각각 한 직선 위에 차례로 놓여 있다.」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q20번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_BASE_ANGLES (원천과 같음) (원천과 같음)
- 이유: Q20번 문항은 PT_ISOSCELES_TRIANGLE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 직선←stem:「$\overline{AB}=\overline{AC}=\overline{CD}=\overline{CE}$, $\overline{DE}=\overline{FE}$이고 세 점 $B$, $A$, $D$와 세 점 $B$, $C$, $E$, 세 점 $A$, $D$, $F$가 각각 한 직선 위에 차례로 놓여 있다.」
- goal: 한직선위←stem:「$\overline{AB}=\overline{AC}=\overline{CD}=\overline{CE}$, $\overline{DE}=\overline{FE}$이고 세 점 $B$, $A$, $D$와 세 점 $B$, $C$, $E$, 세 점 $A$, $D$, $F$가 각각 한 직선 위에 차례로 놓여 있다.」
- method: 직선(NAMED)←solution:「세 점 $A$, $D$, $F$가 한 직선 위에 있으므로 $\angle CDA+\angle CDE+\angle EDF=180^\circ$에서 $2x+\left(90^\circ-\dfrac{3}{2}x\right)+71^\circ=180^\circ \implies \dfrac{1}{2}x=19^\circ \implies x=38^\circ$ $\therefore$ ③」
- condition: (없음)

**how** Q20번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ABC=x$라 하면 $\overline{AB}=\overline{AC}$이므로 $\angle ACB=x$, $\angle CAD=2x$이다. $\overline{AC}=\overline{CD}$이므로 $\angle CDA=2x$, $\angle ACD=180^\circ-4x$이다. $\angle ACE=180^\circ-x$이므로 $\angle DCE=(180^\circ-x)-(180^\circ-4x)=3x$이다. $\overline{CD}=\overline{CE}$이므로 $\angle CDE=\dfrac{180^\circ-3x}{2}=90^\circ-\dfrac{3}{2}x$이다. 세 점 $A$, $D$, $F$가 한 직선 위에 있으므로 $\angle CDA+\angle CDE+\angle EDF=180^\circ$에서 $2x+\left(90^\circ-\dfrac{3}{2}x\right)+71^\circ=180^\circ \implies \dfrac{1}{2}x=19^\circ \implies x=38^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 4점


**발문**

[서술형 1] 직선 $l$이 $\angle BAC=90^\circ$, $\overline{AB}=\overline{AC}$인 직각이등변삼각형 $ABC$의 꼭짓점 $A$를 지나고(단, 직선 $l$은 변 $BC$와 만나지 않음), 두 꼭짓점 $B$, $C$에서 직선 $l$에 내린 수선의 발을 각각 $D$, $E$라 하자. 합동인 두 삼각형을 찾아 합동 기호로 나타내고 [2점], 합동인 이유를 서술하시오. [2점] [총 4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\triangle ABD \equiv \triangle CAE$ (RHA 합동)   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABD$와 $\triangle CAE$에서 $\angle ADB=\angle CEA=90^\circ$이고 빗변 $\overline{AB}=\overline{CA}$이다.
2. 또 $\angle DAB+\angle CAE=90^\circ$이고 $\angle DAB+\angle ABD=90^\circ$이므로 $\angle ABD=\angle CAE$이다.
3. 따라서 빗변의 길이와 한 예각의 크기가 각각 같으므로 $\triangle ABD \equiv \triangle CAE$ (RHA 합동)이다.
- 작성자 답: $\triangle ABD \equiv \triangle CAE$ (RHA 합동) → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] 직선 $l$이 $\angle BAC=90^\circ$, $\overline{AB}=\overline{AC}$인 직각이등변삼각형 $ABC$의 꼭짓점 $A$를 지나고(단, 직선 $l$은 변 $BC$와 만나지 않음), 두 꼭짓점 $B$, $C$에서 직선 $l$에 내린 수선의 발을 각각 $D$, $E$라 하자.」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q21번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 BAC)
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE (원천과 같음) (원천과 같음)
- 이유: Q21번 문항은 PT_RIGHT_TRIANGLE_CONGRUENCE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 BAC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 BAC)

**4칸**
- given: 직선←stem:「[서술형 1] 직선 $l$이 $\angle BAC=90^\circ$, $\overline{AB}=\overline{AC}$인 직각이등변삼각형 $ABC$의 꼭짓점 $A$를 지나고(단, 직선 $l$은 변 $BC$와 만나지 않음), 두 꼭짓점 $B$, $C$에서 직선 $l$에 내린 수선의 발을 각각 $D$, $E$라 하자.」
- goal: 삼각형←stem:「[서술형 1] 직선 $l$이 $\angle BAC=90^\circ$, $\overline{AB}=\overline{AC}$인 직각이등변삼각형 $ABC$의 꼭짓점 $A$를 지나고(단, 직선 $l$은 변 $BC$와 만나지 않음), 두 꼭짓점 $B$, $C$에서 직선 $l$에 내린 수선의 발을 각각 $D$, $E$라 하자.」
- method: 빗변(NAMED)←solution:「$\triangle ABD$와 $\triangle CAE$에서 $\angle ADB=\angle CEA=90^\circ$이고 빗변 $\overline{AB}=\overline{CA}$이다.」
- condition: (없음)

**how** Q21번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 $\triangle ABD \equiv \triangle CAE$ (RHA 합동)을(를) 바르게 구하였다. (문항 토큰 BAC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABD$와 $\triangle CAE$에서 $\angle ADB=\angle CEA=90^\circ$이고 빗변 $\overline{AB}=\overline{CA}$이다. 또 $\angle DAB+\angle CAE=90^\circ$이고 $\angle DAB+\angle ABD=90^\circ$이므로 $\angle ABD=\angle CAE$이다. 따라서 빗변의 길이와 한 예각의 크기가 각각 같으므로 $\triangle ABD \equiv \triangle CAE$ (RHA 합동)이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점


**발문**

[서술형 2] $\triangle ABC$의 내심 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자. $\triangle ABC$의 둘레의 길이가 $31\text{ cm}$이고 $\triangle ADE$의 둘레의 길이가 $22\text{ cm}$일 때, $\overline{BC}$의 길이를 구하고 [2점] 그 과정을 서술하시오. [3점] [총 5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $9\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $I$가 내심이므로 $\angle DBI=\angle IBC$, $\angle ECI=\angle ICB$이다.
2. $\overline{DE}\parallel\overline{BC}$이므로 엇각에 의해 $\angle DIB=\angle IBC=\angle DBI$, $\angle EIC=\angle ICB=\angle ECI$이다.
3. 따라서 $\overline{DB}=\overline{DI}$, $\overline{EC}=\overline{EI}$이므로 $\triangle ADE$의 둘레는 $\overline{AD}+\overline{DI}+\overline{IE}+\overline{AE}=\overline{AB}+\overline{AC}=22\text{ cm}$이다.
4. $\therefore \overline{BC}=(\triangle ABC\text{의 둘레})-(\overline{AB}+\overline{AC})=31-22=9\text{ cm}$
- 작성자 답: $9\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] $\triangle ABC$의 내심 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자.」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q22번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER (원천과 같음) (원천과 같음)
- 이유: Q22번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 직선←stem:「[서술형 2] $\triangle ABC$의 내심 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자.」
- goal: 평행←stem:「[서술형 2] $\triangle ABC$의 내심 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자.」
- method: 내심(NAMED)←solution:「$I$가 내심이므로 $\angle DBI=\angle IBC$, $\angle ECI=\angle ICB$이다.」
- condition: (없음)

**how** Q22번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 $9\text{ cm}$을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$I$가 내심이므로 $\angle DBI=\angle IBC$, $\angle ECI=\angle ICB$이다. $\overline{DE}\parallel\overline{BC}$이므로 엇각에 의해 $\angle DIB=\angle IBC=\angle DBI$, $\angle EIC=\angle ICB=\angle ECI$이다. 따라서 $\overline{DB}=\overline{DI}$, $\overline{EC}=\overline{EI}$이므로 $\triangle ADE$의 둘레는 $\overline{AD}+\overline{DI}+\overline{IE}+\overline{AE}=\overline{AB}+\overline{AC}=22\text{ cm}$이다. $\therefore \overline{BC}=(\triangle ABC\text{의 둘레})-(\overline{AB}+\overline{AC})=31-22=9\text{ cm}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

[서술형 3] 점 $I$가 $\triangle ABC$의 내심이고 $\angle BIC=124^\circ$일 때, $\angle A$의 크기 $x$를 구하고 [2점] 그 과정을 서술하시오. [3점] [총 5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $68^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 내심 $I$의 각 성질에 의해 $\angle BIC=90^\circ+\dfrac{1}{2}\angle A$이다.
2. $124^\circ=90^\circ+\dfrac{1}{2}x \implies \dfrac{1}{2}x=34^\circ \implies x=68^\circ$
- 작성자 답: $68^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] 점 $I$가 $\triangle ABC$의 내심이고 $\angle BIC=124^\circ$일 때, $\angle A$의 크기 $x$를 구하고 [2점] 그 과정을 서술하시오.」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q23번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER (원천과 같음) (원천과 같음)
- 이유: Q23번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 내심←stem:「[서술형 3] 점 $I$가 $\triangle ABC$의 내심이고 $\angle BIC=124^\circ$일 때, $\angle A$의 크기 $x$를 구하고 [2점] 그 과정을 서술하시오.」
- goal: 성질←solution:「내심 $I$의 각 성질에 의해 $\angle BIC=90^\circ+\dfrac{1}{2}\angle A$이다.」
- method: 내심(NAMED)←solution:「내심 $I$의 각 성질에 의해 $\angle BIC=90^\circ+\dfrac{1}{2}\angle A$이다.」
- condition: (없음)

**how** Q23번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 $68^\circ$을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

내심 $I$의 각 성질에 의해 $\angle BIC=90^\circ+\dfrac{1}{2}\angle A$이다. $124^\circ=90^\circ+\dfrac{1}{2}x \implies \dfrac{1}{2}x=34^\circ \implies x=68^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 6점


**발문**

[서술형 4] $\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하자. $\overline{AB}=10$, $\overline{AC}=6$이고 $\triangle ABC$의 넓이가 $24$일 때, 직각삼각형의 합동 조건을 활용하여 $\overline{DC}$의 길이를 구하고 [2점] 그 과정을 서술하시오. [4점] [총 6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $3$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABC$의 넓이에서 $\dfrac{1}{2}\times 6\times\overline{BC}=24 \implies \overline{BC}=8$이다.
2. 점 $D$에서 $\overline{AB}$에 내린 수선의 발을 $E$라 하면 $\triangle ACD$와 $\triangle AED$에서 $\angle ACD=\angle AED=90^\circ$, $\overline{AD}$는 공통, $\angle CAD=\angle EAD$이므로 $\triangle ACD \equiv \triangle AED$ (RHA 합동)이다.
3. 따라서 $\overline{AE}=\overline{AC}=6$, $\overline{DE}=\overline{DC}$이므로 $\overline{BE}=10-6=4$이다.
4. $\overline{DC}=\overline{DE}=t$라 하면 $\overline{BD}=8-t$이고, 직각삼각형 $BDE$에서 피타고라스 정리에 의해 $(8-t)^2=4^2+t^2 \implies 64-16t+t^2=16+t^2 \implies 16t=48 \implies t=3$ $\therefore \overline{DC}=3$
- 작성자 답: $3$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 4] $\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하자.」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각]
- 이유: Q24번 문항은 M2-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE (원천과 같음) (원천과 같음)
- 이유: Q24번 문항은 PT_RIGHT_TRIANGLE_CONGRUENCE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q24번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「[서술형 4] $\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하자.」
- goal: 직각삼각형←stem:「[서술형 4] $\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하자.」
- method: 넓이(NAMED)←solution:「$\triangle ABC$의 넓이에서 $\dfrac{1}{2}\times 6\times\overline{BC}=24 \implies \overline{BC}=8$이다.」
- condition: (없음)

**how** Q24번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 $3$을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$의 넓이에서 $\dfrac{1}{2}\times 6\times\overline{BC}=24 \implies \overline{BC}=8$이다. 점 $D$에서 $\overline{AB}$에 내린 수선의 발을 $E$라 하면 $\triangle ACD$와 $\triangle AED$에서 $\angle ACD=\angle AED=90^\circ$, $\overline{AD}$는 공통, $\angle CAD=\angle EAD$이므로 $\triangle ACD \equiv \triangle AED$ (RHA 합동)이다. 따라서 $\overline{AE}=\overline{AC}=6$, $\overline{DE}=\overline{DC}$이므로 $\overline{BE}=10-6=4$이다. $\overline{DC}=\overline{DE}=t$라 하면 $\overline{BD}=8-t$이고, 직각삼각형 $BDE$에서 피타고라스 정리에 의해 $(8-t)^2=4^2+t^2 \implies 64-16t+t^2=16+t^2 \implies 16t=48 \implies t=3$ $\therefore \overline{DC}=3$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
