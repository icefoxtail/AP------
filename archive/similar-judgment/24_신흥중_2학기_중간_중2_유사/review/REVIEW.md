# 검수 묶음 — 24_신흥중_2학기_중간_중2_유사

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 21개 / 검사 PASS 21, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/21, HOLD 0, 풀이 답 비어 있음 21문항
- 그림 판단 분포: NONE 21
- 난이도 분포: 1단계 4, 2단계 13, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 원천 값과 다른 칸 2개 (TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q4**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q5**: 원천 값과 다른 칸 2개 (TPL, 난이도)
- **Q6**: 원천 값과 다른 칸 2개 (TPL, 난이도) / 난이도 경계 (confidence=high, 원천 경계 B12) / 풀이 과정에 정답 값이 등장하지 않음
- **Q7**: 풀이 과정에 정답 값이 등장하지 않음
- **Q8**: 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 원천 값과 다른 칸 2개 (TPL, 난이도)
- **Q12**: 원천 값과 다른 칸 2개 (RPM, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 원천 값과 다른 칸 2개 (PT, TPL) / 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q16**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 원천 값과 다른 칸 3개 (PT, TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 원천 값과 다른 칸 2개 (RPM, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 원천 값과 다른 칸 3개 (PT, TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 4점


**발문**

$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 변 $BC$의 연장선 위의 점 $D$에 대하여 $\angle ACD=122^\circ$일 때, $\angle A$의 크기는? [4점]

**보기** ① $58^\circ$  ② $61^\circ$  ③ $64^\circ$  ④ $68^\circ$  ⑤ $72^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle ACB = 180^\circ - 122^\circ = 58^\circ$이다. (AB)
2. 이등변삼각형이므로 두 밑각의 크기는 $\angle B = \angle ACB = 58^\circ$이다. (AB)
3. 따라서 $\angle A = 180^\circ - 58^\circ - 58^\circ = 64^\circ$이다. (AB)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] (원천과 같음)
- 이유: 이등변삼각형 단원의 외각 조건을 이용한 밑각과 꼭짓각 계산 유형이다. (AB)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_BASE_ANGLES → NONE**
- 이유: 이등변삼각형의 두 밑각의 크기와 꼭짓각 계산 유형이다. (AB)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형의 밑각의 성질과 평각의 크기를 이용하는 난이도 1 문항이다. (AB)

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서」
- goal: 각←stem:「$\angle A$의 크기는?」
- method: 밑각(NAMED)←solution:「$\angle B=\angle ACB=58^\circ$이다.」
- condition: 선분←stem:「변 $BC$의 연장선 위의 점 $D$에 대하여」

**how** 외각의 정의로 밑각 58도를 구하고 이등변삼각형의 성질로 꼭짓각 64도를 계산했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ACB=180^\circ-\angle ACD=180^\circ-122^\circ=58^\circ$이다. $\overline{AB}=\overline{AC}$이므로 $\angle B=\angle ACB=58^\circ$이다. $\therefore \angle A=180^\circ-58^\circ-58^\circ=64^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 두 내각의 크기가 같은 삼각형 $ABC$ ($\angle B=\angle C$)가 이등변삼각형임을 설명하는 과정이다. $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라 할 때, ㉠~㉤에 들어갈 것으로 알맞지 않은 것은? (정답 2개) [4점]


$\triangle ABD$와 $\triangle ACD$에서 $\angle B=\angle C$, $\angle BAD=$ (㉠), $\angle ADB=180^\circ-\angle B-\angle BAD=180^\circ-\angle C-\angle CAD=$ (㉡)이다. 또한 (㉢)은 공통이므로 $\triangle ABD \equiv \triangle ACD$ ((㉣) 합동)이다. 따라서 $\overline{AB}=$ (㉤)이므로 $\triangle ABC$는 이등변삼각형이다.

**보기** ① ㉠ : $\angle B$  ② ㉡ : $\angle ADC$  ③ ㉢ : $\overline{AD}$  ④ ㉣ : RHS  ⑤ ㉤ : $\overline{AC}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle A$의 이등분선이므로 $\angle BAD = \angle CAD$이다 (㉠ 오답). (ABC)
2. 한 변과 양 끝각이 같으므로 합동 조건은 ASA 합동이다 (㉣ 오답). (ABC)
3. 따라서 알맞지 않은 것은 ①, ④이다. (ABC)
- 작성자 답: ①, ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 두 내각의 크기가 같」
**RPM** M2-RPM-062 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 판정 > 두 각 조건] (원천과 같음)
- 이유: 이등변삼각형 단원의 두 내각의 크기가 같을 때 이등변삼각형 증명 빈칸 유형이다. (ABC)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_CONVERSE → NONE**
- 이유: 이등변삼각형의 판정 조건과 삼각형의 합동 증명 빈칸 유형이다. (ABC)
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 두 내각이 같은 삼각형이 이등변삼각형임을 보이는 증명 과정의 빈칸을 채우는 난이도 1 문항이다. (ABC)

**4칸**
- given: 이등변삼각형←stem:「두 내각의 크기가 같은 삼각형 $ABC$ ($\angle B=\angle C$)가 이등변삼각형임을」
- goal: 합동(NAMED)←solution:「합동 조건은 ASA 합동이다.」
- method: 합동(NAMED)←stem:「$\triangle ABD \equiv \triangle ACD$」
- condition: 내각←stem:「두 내각의 크기가 같은」

**how** 각의 이등분선과 삼각형 내각의 합으로 ASA 합동 조건을 확인하여 잘못된 빈칸을 찾았다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD}$가 $\angle A$의 이등분선이므로 $\angle BAD=\angle CAD$이다. 따라서 ㉠에 $\angle B$가 들어가는 것은 옳지 않다. ㉡은 $\angle ADC$, ㉢은 공통변 $\overline{AD}$가 맞다. 한 변 $\overline{AD}$와 그 양 끝각이 각각 같으므로 합동 조건은 ASA 합동이다. 따라서 ㉣에 RHS가 들어가는 것은 옳지 않다. 대응변에 의해 $\overline{AB}=\overline{AC}$이므로 ㉤은 맞다. $\therefore$ ①, ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라 하고, 선분 $AD$ 위의 한 점 $P$를 잡을 때, 다음 중 항상 옳다고 할 수 없는 것은? [4점]

**보기** ① $\overline{BD}=\overline{CD}$  ② $\overline{PB}=\overline{PC}$  ③ $\angle PBD=\angle PCD$  ④ $\overline{AD}\perp\overline{BC}$  ⑤ $\overline{BP}=\overline{AP}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 꼭짓각의 이등분선은 밑변을 수직이등분하므로 $\overline{BD}=\overline{CD}, \overline{AD} \perp \overline{BC}$이다. (AB)
2. 선분 $AD$ 위의 점 $P$에 대해 $\triangle PBD \equiv \triangle PCD$이므로 $\overline{PB}=\overline{PC}$이다. (AB)
3. 하지만 $\overline{BP}=\overline{AP}$는 일반적으로 성립하지 않는다. (AB)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=」
**RPM** M2-RPM-061 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 꼭짓각의 이등분선] (원천과 같음)
- 이유: 이등변삼각형 단원의 꼭짓각의 이등분선 성질과 대칭축 위의 점 판정 유형이다. (AB)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_VERTEX_BISECTOR → NONE**
- 이유: 이등변삼각형의 꼭짓각의 이등분선의 성질 참거짓 판정 유형이다. (AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형 꼭짓각의 이등분선의 성질과 대칭축 위의 점의 기하학적 성질을 판별하는 난이도 2 문항이다. (AB)

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서」
- goal: 선분←solution:「$\overline{BP}=\overline{AP}$는 점 $P$의 위치에 따라」
- method: 합동(NAMED)←solution:「$\triangle ABD \equiv \triangle ACD$ (SAS 합동)이므로」
- condition: 선분←stem:「선분 $AD$ 위의 한 점 $P$를 잡을 때」

**how** 꼭짓각 이등분선 위의 임의의 점에서 두 꼭짓점까지의 거리는 같으나 AP와의 일치는 보장되지 않음을 판별했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABD \equiv \triangle ACD$ (SAS 합동)이므로 $\overline{BD}=\overline{CD}$이고 $\overline{AD}\perp\overline{BC}$이다. 또한 $\overline{PD}$는 공통, $\angle PDB=\angle PDC=90^\circ$, $\overline{BD}=\overline{CD}$이므로 $\triangle PBD \equiv \triangle PCD$ (SAS 합동)이다. 따라서 $\overline{PB}=\overline{PC}$, $\angle PBD=\angle PCD$가 항상 성립한다. 그러나 $\overline{BP}=\overline{AP}$는 점 $P$의 위치에 따라 달라지므로 항상 성립하지 않는다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선이 변 $AB$와 만나는 점을 $D$라 하자. $\angle A=48^\circ$일 때, $\angle BDC$의 크기는? [4점]

**보기** ① $78^\circ$  ② $81^\circ$  ③ $84^\circ$  ④ $87^\circ$  ⑤ $90^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 밑각의 크기는 $\angle B = \angle C = (180^\circ - 48^\circ)/2 = 66^\circ$이다. (AB)
2. 각의 이등분선에 의해 $\angle BCD = 66^\circ / 2 = 33^\circ$이다. (AB)
3. $\triangle BDC$에서 $\angle BDC = 180^\circ - 66^\circ - 33^\circ = 81^\circ$이다. (AB)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] (원천과 같음)
- 이유: 이등변삼각형 단원의 밑각의 이등분선에 의해 생기는 삼각형의 각 구하기 유형이다. (AB)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_BASE_ANGLES → NONE**
- 이유: 이등변삼각형의 밑각의 이등분선과 각의 크기 계산 유형이다. (AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형의 밑각과 밑각의 이등분선이 만드는 내부 삼각형의 각을 구하는 난이도 2 문항이다. (AB)

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서」
- goal: 각←stem:「$\angle BDC$의 크기는?」
- method: 밑각(NAMED)←solution:「$\angle B=\angle C=\dfrac{180^\circ-48^\circ}{2}=66^\circ$이다.」
- condition: 이등분선←stem:「$\angle C$의 이등분선이 변 $AB$와 만나는 점을 $D$라」

**how** 이등변삼각형의 밑각 66도를 구하고 그 절반 33도와 삼각형 내각의 합으로 각 BDC 81도를 구했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB}=\overline{AC}$이므로 $\angle B=\angle C=\dfrac{180^\circ-48^\circ}{2}=66^\circ$이다. $\overline{CD}$가 $\angle C$를 이등분하므로 $\angle BCD=\dfrac{66^\circ}{2}=33^\circ$이다. $\triangle BDC$에서 $\angle BDC=180^\circ-66^\circ-33^\circ=81^\circ$이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)

**발문**

선분 $BA$ 위에 점 $D$가 있고 선분 $BC$ 위에 점 $E$가 있으며 $\overline{BD}=\overline{DE}=\overline{EA}=\overline{AC}$이다. $\angle B=22^\circ$일 때, $\angle EAC$의 크기는? [4점]

**보기** ① $36^\circ$  ② $40^\circ$  ③ $44^\circ$  ④ $48^\circ$  ⑤ $52^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{BD}=\overline{DE}$이므로 $\angle BED = 22^\circ$, 외각 $\angle EDA = 44^\circ$이다. (BA)
2. $\overline{DE}=\overline{EA}$이므로 $\angle DAE = 44^\circ$, $\triangle BAE$ 외각 $\angle AEC = 22^\circ + 44^\circ = 66^\circ$이다.
3. $\overline{EA}=\overline{AC}$이므로 $\angle ECA = 66^\circ$이고, $\angle EAC = 180^\circ - 66^\circ - 66^\circ = 48^\circ$이다. (BA)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「선분 $BA$ 위에 점 $D」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] (원천과 같음)
- 이유: 이등변삼각형 단원의 여러 이등변삼각형과 외각 성질의 연속 적용 유형이다. (BA)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_BASE_ANGLES → NONE**
- 이유: 연속된 이등변삼각형과 외각 성질을 이용한 각의 크기 추적 유형이다. (BA)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 여러 개의 이등변삼각형이 연결된 도형에서 외각 성질을 연속적으로 추적하는 난이도 2 문항이다. (BA)

**4칸**
- given: 선분←stem:「$\overline{BD}=\overline{DE}=\overline{EA}=\overline{AC}$이다.」
- goal: 각←stem:「$\angle EAC$의 크기는?」
- method: 외각(NAMED)←solution:「$\triangle BDE$의 외각 성질에 의해」
- condition: 선분←stem:「선분 $BA$ 위에 점 $D$가 있고」

**how** 이등변삼각형의 밑각과 삼각형의 외각 성질을 계단식으로 연속 적용하여 각 EAC 48도를 계산했다. (BA)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BD}=\overline{DE}$이므로 $\angle BED=\angle B=22^\circ$이고, $\triangle BDE$의 외각 성질에 의해 $\angle EDA=22^\circ+22^\circ=44^\circ$이다. $\overline{DE}=\overline{EA}$이므로 $\angle DAE=\angle EDA=44^\circ$이다. $\triangle BAE$의 외각 성질에 의해 $\angle AEC=\angle B+\angle BAE=22^\circ+44^\circ=66^\circ$이다. $\overline{EA}=\overline{AC}$이므로 $\angle ECA=\angle AEC=66^\circ$이다. $\therefore \angle EAC=180^\circ-66^\circ-66^\circ=48^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 직각삼각형 (ㄱ)~(ㅂ) 중 서로 합동인 두 삼각형과 그 합동 조건이 바르게 짝지어진 것은? [4점]


(ㄱ) 빗변 $7\text{ cm}$, 한 직각변 $4\text{ cm}$ (ㄴ) 빗변 $7\text{ cm}$, 한 예각 $35^\circ$ (ㄷ) 두 직각변 $4\text{ cm}$, $5\text{ cm}$ (ㄹ) 빗변 $8\text{ cm}$, 한 예각 $35^\circ$ (ㅁ) 한 직각변 $4\text{ cm}$, 한 예각 $55^\circ$ (ㅂ) 빗변 $7\text{ cm}$, 한 직각변 $4\text{ cm}$

**보기** ① (ㄱ)과 (ㅂ) : RHS 합동  ② (ㄱ)과 (ㄷ) : SAS 합동  ③ (ㄴ)과 (ㄹ) : RHA 합동  ④ (ㄴ)과 (ㅂ) : RHS 합동  ⑤ (ㄷ)과 (ㅁ) : ASA 합동

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (ㄱ)과 (ㅂ)은 빗변 7 cm, 다른 직각변 4 cm가 같으므로 RHS 합동이다.
2. 나머지 삼각형들은 대응 요소가 일치하지 않는다. (cm)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 직각삼각형 (ㄱ)~(ㅂ」
**RPM** M2-RPM-070 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] (원천과 같음)
- 이유: 직각삼각형의 합동 조건 단원의 빗변과 한 변 또는 한 예각을 통한 RHS 및 RHA 기본 판별 유형이다. (cm)
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=NONE (원천과 같음) **원천→판정: TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE → NONE**
- 이유: 직각삼각형의 합동 조건 RHS 판별 유형이다. (cm)
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 직각삼각형의 합동 조건(RHS, RHA)을 직접 비교하여 바른 쌍을 찾는 난이도 1 문항이다. (cm)

**4칸**
- given: 직각삼각형←stem:「다음 직각삼각형 (ㄱ)~(ㅂ) 중 서로 합동인 두 삼각형과」
- goal: 합동←stem:「그 합동 조건이 바르게 짝지어진 것은?」
- method: 빗변(NAMED)←solution:「빗변의 길이가 $7\text{ cm}$, 다른 한 변의 길이가 $4\text{ cm}$로 각각 같으므로 RHS 합동이다.」
- condition: (없음)

**how** 직각삼각형에서 빗변의 길이와 다른 한 변의 길이가 같음을 확인하여 RHS 합동을 판정했다. (cm)

<details><summary>저장 해설 (판정 검토용)</summary>

(ㄱ)과 (ㅂ)은 모두 직각삼각형이면서 빗변의 길이가 $7\text{ cm}$, 다른 한 변의 길이가 $4\text{ cm}$로 각각 같으므로 RHS 합동이다. 나머지 쌍은 빗변 또는 대응하는 변·각이 일치하지 않으므로 합동이라 할 수 없다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\triangle ABC$에서 변 $BC$의 중점을 $M$이라 하고, 점 $M$에서 두 변 $AB$, $AC$에 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{MD}=\overline{ME}$이고 $\angle B=38^\circ$일 때, $\triangle BMD$와 합동인 삼각형과 그 합동 조건으로 옳은 것은? [5점]

**보기** ① $\triangle CME$, RHA 합동  ② $\triangle AME$, ASA 합동  ③ $\triangle CME$, RHS 합동  ④ $\triangle MDE$, RHS 합동  ⑤ $\triangle AME$, RHA 합동

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle BDM = \angle CEM = 90^\circ$이다. (ABC)
2. 점 $M$이 $BC$의 중점이므로 빗변 $\overline{MB} = \overline{MC}$이고, 조건에서 $\overline{MD} = \overline{ME}$이다. (ABC)
3. 따라서 $\triangle BMD \equiv \triangle CME$ (RHS 합동)이다. (ABC)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-070 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] (원천과 같음)
- 이유: 직각삼각형의 합동 단원의 빗변 중점과 수선의 길이 조건에 따른 RHS 합동 유형이다. (ABC)
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=NONE (원천과 같음) **원천→판정: TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE → NONE**
- 이유: 도형에서의 직각삼각형의 합동 증명과 조건 판별 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 도형 조건에서 직각삼각형의 빗변과 다른 한 변의 일치를 찾아 RHS 합동을 증명하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 중점←stem:「변 $BC$의 중점을 $M$이라 하고」
- goal: 합동←stem:「합동인 삼각형과 그 합동 조건으로 옳은 것은?」
- method: 빗변(NAMED)←solution:「빗변 $\overline{MB}=\overline{MC}$이며, $\overline{MD}=\overline{ME}$이다.」
- condition: 수선의발←stem:「내린 수선의 발을 각각 $D$, $E$라 하자.」

**how** 직각, 빗변의 중점 조건, 수선의 길이 조건을 확인하여 RHS 합동을 도출했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle BMD$와 $\triangle CME$에서 $\angle BDM=\angle CEM=90^\circ$이고, 점 $M$이 변 $BC$의 중점이므로 빗변 $\overline{MB}=\overline{MC}$이며, $\overline{MD}=\overline{ME}$이다. 따라서 빗변의 길이와 다른 한 변의 길이가 각각 같으므로 $\triangle BMD \equiv \triangle CME$ (RHS 합동)이다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

삼각형의 외심과 내심에 대한 다음 설명 중 옳지 않은 것은? (정답 2개) [4점]

**보기** ① 정삼각형의 외심과 내심은 일치한다.  ② 이등변삼각형의 외심은 항상 삼각형의 내부에 있다.  ③ 삼각형의 세 내각의 이등분선의 교점에서 세 변까지의 거리는 같다.  ④ 둥근 접시의 깨진 조각 일부만 남았을 때, 호 위의 세 점을 잡아 만든 삼각형의 외심을 구하면 원래 원의 중심을 찾을 수 있다.  ⑤ 삼각형의 세 꼭짓점에서 같은 거리에 있는 지점을 찾을 때는 내심을 이용한다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ② 둔각삼각형의 외심은 삼각형의 외부에 위치하므로 항상 내부에 있다는 것은 거짓이다. (2)
2. ⑤ 세 꼭짓점에서 같은 거리에 있는 점은 외심이므로 내심을 이용한다는 것은 거짓이다. (2)
3. 따라서 옳지 않은 것은 ②, ⑤이다. (2)
- 작성자 답: ②, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각형의 외심과 내심에 대한」
**RPM** M2-RPM-065 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] (원천과 같음)
- 이유: 외심과 내심 단원의 삼각형의 외심과 내심 성질 참거짓 판별 유형이다. (2)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CENTERS_COMBINED → NONE**
- 이유: 삼각형의 외심과 내심의 정의 및 성질 종합 참거짓 유형이다. (2)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형의 외심과 내심의 정의, 위치, 성질을 종합적으로 비교 판정하는 난이도 2 문항이다.

**4칸**
- given: 외심←stem:「삼각형의 외심과 내심에 대한 다음 설명 중」
- goal: 내심←solution:「세 내각의 이등분선의 교점은 내심이며 세 변까지의 거리가 같다.」
- method: 외심(NAMED)←solution:「둔각이등변삼각형의 외심은 삼각형의 외부에 있으므로」
- condition: (없음)

**how** 삼각형의 모양에 따른 외심의 위치와 외심/내심의 정의 및 성질의 참거짓을 판별했다. (2)

<details><summary>저장 해설 (판정 검토용)</summary>

① 정삼각형은 외심과 내심이 일치한다. ② 둔각이등변삼각형의 외심은 삼각형의 외부에 있으므로 항상 내부에 있다는 설명은 옳지 않다. ③ 세 내각의 이등분선의 교점은 내심이며 세 변까지의 거리가 같다. ④ 원 위의 세 점을 꼭짓점으로 하는 삼각형의 외심이 원래 원의 중심이다. ⑤ 세 꼭짓점에서 같은 거리에 있는 지점은 외심이므로 내심을 이용한다는 설명은 옳지 않다. $\therefore$ ②, ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 세 변 $AB$, $AC$, $BC$에 내린 수선의 발을 각각 $M$, $L$, $N$이라 할 때, 다음 중 항상 옳다고 할 수 없는 것은? [4점]

**보기** ① $\overline{OM}=\overline{ON}$  ② $\overline{AM}=\overline{BM}$  ③ $\angle OAL=\angle OCL$  ④ $\overline{OB}=\overline{OC}$  ⑤ $\triangle OBN \equiv \triangle OCN$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심은 세 변의 수직이등분선의 교점이므로 $\overline{AM}=\overline{BM}$이고 세 꼭짓점까지의 거리가 같다. (ABC)
2. 변까지의 거리 $\overline{OM}$과 $\overline{ON}$이 같다는 것은 내심의 성질이므로 외심에서는 항상 성립하지 않는다. (ABC)
3. 따라서 항상 옳다고 할 수 없는 것은 ①이다. (ABC)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$가 $\triang」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] (원천과 같음)
- 이유: 외심 단원의 수직이등분선과 외심의 성질 판별 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CIRCUMCENTER → NONE**
- 이유: 외심의 수직이등분선 성질과 기하학적 참거짓 판정 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외심의 기본 정의와 성질을 내심의 성질과 구분하여 참거짓을 판별하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 외심←stem:「점 $O$가 $\triangle ABC$의 외심이고」
- goal: 선분←solution:「$\overline{OM}$과 $\overline{ON}$은 서로 다른 두 변」
- method: 수직이등분선(NAMED)←solution:「외심의 성질에 의해 $\overline{AM}=\overline{BM}$이다.」
- condition: 수선의발←stem:「내린 수선의 발을 각각 $M$, $L$, $N$이라 할 때」

**how** 외심의 수직이등분선 성질과 꼭짓점까지의 거리 일치를 확인하고 변까지의 거리 조건이 아님을 밝혔다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

② $\overline{OM}\perp\overline{AB}$이므로 외심의 성질에 의해 $\overline{AM}=\overline{BM}$이다. ③, ④ $\overline{OA}=\overline{OB}=\overline{OC}$이므로 $\triangle OAC$는 이등변삼각형이고 $\angle OAL=\angle OCL$이다. ⑤ 직각삼각형 $OBN$과 $OCN$에서 $\overline{OB}=\overline{OC}$, $\overline{ON}$은 공통이므로 RHS 합동이다. ① $\overline{OM}$과 $\overline{ON}$은 서로 다른 두 변 $AB$, $BC$까지의 거리이므로 항상 같다고 할 수 없다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 5점


**발문**

둔각삼각형 $ABC$의 외심 $O$가 변 $BC$에 대하여 꼭짓점 $A$의 반대쪽에 있다. $\angle ABC=24^\circ$, $\angle OBC=14^\circ$일 때, $\angle BAC$의 크기는? [5점]

**보기** ① $98^\circ$  ② $100^\circ$  ③ $102^\circ$  ④ $104^\circ$  ⑤ $108^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심이 변 BC 바깥쪽에 있으므로 $\angle ABO = 24^\circ + 14^\circ = 38^\circ$이다. (ABC)
2. $\overline{OA}=\overline{OB}$이므로 $\angle BAO = 38^\circ$, $\overline{OA}=\overline{OC}$이므로 $\angle OAC = c + 14^\circ$이다. (ABC)
3. $\triangle ABC$의 내각의 합 $2c + 76^\circ = 180^\circ \implies c = 52^\circ$이다.
4. 따라서 $\angle BAC = 38^\circ + 66^\circ = 104^\circ$이다. (ABC)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「둔각삼각형 $ABC$의 외심」
**RPM** M2-RPM-065 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] (원천과 같음)
- 이유: 외심과 내심 단원의 둔각삼각형에서 외심의 위치와 각의 크기 관계 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CIRCUMCENTER → NONE**
- 이유: 둔각삼각형의 외심의 위치와 각의 크기 계산 유형이다. (ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외심이 외부에 있는 둔각삼각형에서 꼭짓점과 외심이 이루는 복잡한 각 관계를 추론하는 난이도 3 문항이다. (ABC)

**4칸**
- given: 외심←stem:「둔각삼각형 $ABC$의 외심 $O$가 변 $BC$에 대하여」
- goal: 각←stem:「$\angle BAC$의 크기는?」
- method: 외심(NAMED)←solution:「외심 $O$가 변 $BC$의 반대쪽에 있으므로」
- condition: 둔각←stem:「둔각삼각형 $ABC$의」

**how** 외심이 삼각형 외부에 위치할 때의 각의 덧셈 관계와 이등변삼각형 성질로 둔각 BAC 104도를 구했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

외심 $O$가 변 $BC$의 반대쪽에 있으므로 $\angle ABO=\angle ABC+\angle OBC=24^\circ+14^\circ=38^\circ$이다. $\overline{OA}=\overline{OB}$이므로 $\angle BAO=\angle ABO=38^\circ$이다. $\angle ACB=c$라 하면 $\angle ACO=c+14^\circ$이고, $\overline{OA}=\overline{OC}$이므로 $\angle OAC=c+14^\circ$이다. 따라서 $\angle BAC=38^\circ+(c+14^\circ)=c+52^\circ$이다. $\triangle ABC$에서 $(c+52^\circ)+24^\circ+c=180^\circ \implies 2c=104^\circ \implies c=52^\circ$이다. $\therefore \angle BAC=52^\circ+52^\circ=104^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)

**발문**

$\overline{AC}=\overline{BC}$인 이등변삼각형 $ABC$에서 $\angle C=52^\circ$이고 외심을 $O$, 내심을 $I$라 할 때, 다음 중 옳은 것은? [5점]

**보기** ① $\angle OCB=20^\circ$  ② $\angle IBC=32^\circ$  ③ $\angle B=52^\circ$  ④ $\angle OBC=32^\circ$  ⑤ $\angle IBO=12^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle A = \angle B = (180^\circ - 52^\circ)/2 = 64^\circ$이다. (AC)
2. 내심 $I$에 의해 $\angle IBC = 32^\circ$이다. (AC)
3. 외심 $O$에 대해 $\angle AOB = 104^\circ \implies \angle OBA = 38^\circ \implies \angle OBC = 64^\circ - 38^\circ = 26^\circ$이다. (AC)
4. 따라서 $\angle IBO = 32^\circ - 26^\circ = 6^\circ$이다. (AC)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AC}=」
**RPM** M2-RPM-069 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 외심·내심을 이용한 복합도형] (원천과 같음)
- 이유: 외심과 내심 단원의 외접원·내접원 활용 외심·내심 복합도형 유형이다. (AC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CENTERS_COMBINED → NONE**
- 이유: 이등변삼각형에서의 외심과 내심 복합 각 계산 유형이다. (AC)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 한 이등변삼각형에서 외심과 내심의 성질을 동시에 적용하여 세부 각들을 비교 분석하는 난이도 3 문항이다. (AC)

**4칸**
- given: 이등변삼각형←stem:「$\overline{AC}=\overline{BC}$인 이등변삼각형 $ABC$에서」
- goal: 각←solution:「$\angle IBC=\dfrac{1}{2}\angle B=32^\circ$이다.」
- method: 내심(NAMED)←solution:「내심 $I$는 각의 이등분선 교점이므로」
- condition: 외심←stem:「외심을 $O$, 내심을 $I$라 할 때」

**how** 이등변삼각형에서 외심각과 내심각을 각각 구하고 두 선분이 이루는 사이각을 정확히 계산했다. (AC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AC}=\overline{BC}$이므로 $\angle A=\angle B=\dfrac{180^\circ-52^\circ}{2}=64^\circ$이다. 내심 $I$는 각의 이등분선 교점이므로 $\angle IBC=\dfrac{1}{2}\angle B=32^\circ$이다. 한편 $\angle AOB=2\angle C=104^\circ$이고 $\overline{OA}=\overline{OB}$이므로 $\angle OBA=\dfrac{180^\circ-104^\circ}{2}=38^\circ$이다. 따라서 $\angle OBC=64^\circ-38^\circ=26^\circ$, $\angle OCB=26^\circ$, $\angle IBO=32^\circ-26^\circ=6^\circ$이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 각 사각형의 뜻으로 옳지 않은 것은? (정답 2개) [4점]

**보기** ① 사다리꼴 : 한 쌍의 대변이 평행한 사각형  ② 마름모 : 네 변의 길이가 같은 사각형  ③ 평행사변형 : 두 쌍의 대변의 길이가 각각 같은 사각형  ④ 직사각형 : 네 내각의 크기가 모두 같은 사각형  ⑤ 등변사다리꼴 : 두 대각선의 길이가 같은 사각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ③ 두 쌍의 대변의 길이가 같다는 것은 성질이며 뜻(정의)은 두 쌍의 대변이 평행한 사각형이다. (2)
2. ⑤ 등변사다리꼴의 정의는 아랫변의 양 끝각의 크기가 같은 사다리꼴이다. (2)
3. 따라서 뜻으로 옳지 않은 것은 ③, ⑤이다. (2)
- 작성자 답: ③, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 각 사각형의 뜻으로 옳」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 성질 비교 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: 여러 가지 사각형 단원의 각 사각형의 정의와 성질 구분 유형이다. (2)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE (원천과 같음) **원천→판정: TPL_SPECIAL_QUADRILATERALS → NONE**
- 이유: 여러 가지 사각형의 정의와 성질의 구별 유형이다. (2)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 여러 가지 사각형의 정의(뜻)와 성질을 정확히 변별하는 난이도 2 문항이다.

**4칸**
- given: 사각형←stem:「다음 각 사각형의 뜻으로 옳지 않은 것은?」
- goal: 평행사변형←solution:「평행사변형의 뜻은 두 쌍의 대변이 각각 평행한 사각형이며,」
- method: 평행사변형(NAMED)←solution:「두 쌍의 대변의 길이가 각각 같다는 것은 평행사변형의 성질이다.」
- condition: (없음)

**how** 사각형의 수학적 정의(뜻)와 유도된 성질의 차이를 명확히 구분하여 바른 정의를 골랐다. (2)

<details><summary>저장 해설 (판정 검토용)</summary>

①, ②, ④는 각 사각형의 정확한 뜻(정의)이다. ③ 평행사변형의 뜻은 두 쌍의 대변이 각각 평행한 사각형이며, 두 쌍의 대변의 길이가 각각 같다는 것은 평행사변형의 성질이다. ⑤ 등변사다리꼴의 뜻은 아랫변의 양 끝각의 크기가 같은 사다리꼴이며, 두 대각선의 길이가 같아도 사다리꼴이 아닐 수 있다. $\therefore$ ③, ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\angle OAD=\angle ODA$일 때, 다음 중 항상 옳은 것은? [4점]

**보기** ① $\overline{AB}=\overline{BC}$  ② $\overline{AC}\perp\overline{BD}$  ③ $\overline{AD}=\overline{BD}$  ④ $\angle ABD=\angle CBD$  ⑤ $\overline{AC}=\overline{BD}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle OAD = \angle ODA$이므로 $\triangle OAD$는 이등변삼각형이고 $\overline{OA} = \overline{OD}$이다. (ABCD)
2. 평행사변형의 대각선은 서로 이등분하므로 $\overline{AC} = 2\overline{OA}, \overline{BD} = 2\overline{OD}$이다. (ABCD)
3. 따라서 $\overline{AC} = \overline{BD}$가 성립한다 (직사각형 조건). (ABCD)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서」
**RPM** M2-RPM-073 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 평행사변형의 대각선 성질] (원천과 같음)
- 이유: 평행사변형 단원의 대각선 교점에서의 이등변삼각형 조건과 대각선 길이 일치 유형이다. (ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE (원천과 같음) **원천→판정: TPL_QUADRILATERAL_PROPERTIES → NONE**
- 이유: 평행사변형의 대각선 성질과 추가 조건 분석 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형의 대각선 성질에 추가 조건이 주어졌을 때 성립하는 대각선 관계를 추론하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
- goal: 대각선←solution:「평행사변형의 두 대각선은 서로를 이등분하므로」
- method: 이등변삼각형(NAMED)←solution:「$\triangle OAD$는 이등변삼각형이고 $\overline{OA}=\overline{OD}$이다.」
- condition: 대각선←stem:「두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」

**how** 대각선 교점 삼각형의 밑각 일치 조건으로부터 대각선 길이 일치를 도출했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle OAD=\angle ODA$이므로 $\triangle OAD$는 이등변삼각형이고 $\overline{OA}=\overline{OD}$이다. 평행사변형의 두 대각선은 서로를 이등분하므로 $\overline{AC}=2\overline{OA}$, $\overline{BD}=2\overline{OD}$이다. $\therefore \overline{AC}=\overline{BD}$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\overline{AB}=7\text{ cm}$, $\overline{AC}=10\text{ cm}$, $\overline{BD}=16\text{ cm}$일 때, $\triangle ABO$의 둘레의 길이는? [4점]

**보기** ① $18\text{ cm}$  ② $20\text{ cm}$  ③ $22\text{ cm}$  ④ $24\text{ cm}$  ⑤ $26\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 대각선은 서로를 이등분하므로 $\overline{AO} = 5\text{ cm}, \overline{BO} = 8\text{ cm}$이다. (ABCD)
2. $\overline{AB} = 7\text{ cm}$이므로 $\triangle ABO$의 둘레는 $7 + 5 + 8 = 20\text{ cm}$이다. (ABCD)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서」
**RPM** M2-RPM-073 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 평행사변형의 대각선 성질] (원천과 같음)
- 이유: 평행사변형 단원의 대각선의 상호 이등분 성질을 이용한 내부 삼각형 둘레 계산 유형이다. (ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE (원천과 같음) **원천→판정: TPL_QUADRILATERAL_PROPERTIES → NONE**
- 이유: 평행사변형의 대각선 이등분 성질과 삼각형의 둘레 계산 유형이다. (ABCD)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형의 대각선 이등분 성질을 이용해 분할된 삼각형의 둘레를 구하는 난이도 1 문항이다. (ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
- goal: 둘레←stem:「$\triangle ABO$의 둘레의 길이는?」
- method: 대각선(NAMED)←solution:「평행사변형의 두 대각선은 서로를 이등분하므로」
- condition: 대각선←stem:「$\overline{AC}=10\text{ cm}$, $\overline{BD}=16\text{ cm}$일 때」

**how** 평행사변형의 대각선 이등분 성질로 AO=5, BO=8을 구하고 둘레 20을 계산했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형의 두 대각선은 서로를 이등분하므로 $\overline{AO}=\dfrac{1}{2}\overline{AC}=5\text{ cm}$, $\overline{BO}=\dfrac{1}{2}\overline{BD}=8\text{ cm}$이다. $\therefore (\triangle ABO\text{의 둘레})=7+5+8=20\text{ cm}$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

$\overline{AB}=9\text{ cm}$, $\overline{AD}=13\text{ cm}$인 평행사변형 $ABCD$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $F$, $\angle D$의 이등분선과 변 $BC$의 교점을 $E$라 할 때, $\overline{BF}+\overline{CF}+\overline{EF}$의 길이는? [4점]

**보기** ① $16\text{ cm}$  ② $17\text{ cm}$  ③ $18\text{ cm}$  ④ $19\text{ cm}$  ⑤ $20\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 엇각과 각의 이등분선에 의해 $\triangle ABF$는 이등변삼각형이므로 $\overline{BF} = \overline{AB} = 9\text{ cm}$이다.
2. 같은 방법으로 $\overline{CE} = 9\text{ cm}$이다. (AB)
3. $\overline{CF} = 13 - 9 = 4\text{ cm}$, $\overline{EF} = 9 - 4 = 5\text{ cm}$이다. (AB)
4. 따라서 $9 + 4 + 5 = 18\text{ cm}$이다. (AB)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 단원의 이웃한 두 각의 이등분선과 변이 이루는 선분의 길이 계산 유형이다. (AB)
**유형** PT=PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_MG_PARALLELOGRAM_ANGLE_BISECTOR_SEGMENT** **원천→판정: TPL_QUADRILATERAL_PROPERTIES → NONE**
- 이유: 평행사변형의 각 이등분선이 만드는 선분의 길이 계산 유형이다. (AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형의 각 이등분선과 대변이 만나는 점이 만드는 이등변삼각형의 선분 길이를 연산하는 난이도 2 문항이다. (AB)

**4칸**
- given: 평행사변형←stem:「인 평행사변형 $ABCD$에서」
- goal: 길이←stem:「$\overline{BF}+\overline{CF}+\overline{EF}$의 길이는?」
- method: 엇각(NAMED)←solution:「$\overline{AD}\parallel\overline{BC}$이므로 $\angle FAD=\angle AFB$ (엇각)이고,」
- condition: 이등분선←stem:「$\angle A$의 이등분선과 변 $BC$의 교점을 $F$」

**how** 평행선의 엇각과 각의 이등분선으로 이등변삼각형들을 찾아 선분들의 길이를 차례로 구했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD}\parallel\overline{BC}$이므로 $\angle FAD=\angle AFB$ (엇각)이고, $\angle BAF=\angle FAD$이므로 $\angle BAF=\angle AFB$이다. 따라서 $\overline{BF}=\overline{AB}=9\text{ cm}$이다. 같은 방법으로 $\overline{CE}=\overline{CD}=\overline{AB}=9\text{ cm}$이다. $\overline{BC}=\overline{AD}=13\text{ cm}$이므로 $\overline{CF}=\overline{BC}-\overline{BF}=13-9=4\text{ cm}$이다. 또 $\overline{EF}=\overline{CE}-\overline{CF}=9-4=5\text{ cm}$이다. $\therefore \overline{BF}+\overline{CF}+\overline{EF}=9+4+5=18\text{ cm}$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 $\square ABCD$에서 $\overline{AD}\parallel\overline{BC}$이고 $\overline{AD}=\overline{BC}$일 때, $\square ABCD$가 평행사변형임을 설명하는 과정이다. ㉠~㉤에 들어갈 것으로 알맞지 않은 것은? [4점]


$\triangle ABC$와 $\triangle CDA$에서 $\overline{BC}=$ (㉠), $\overline{AD}\parallel\overline{BC}$이므로 엇각으로 $\angle BCA=$ (㉡), (㉢)은 공통이므로 $\triangle ABC \equiv \triangle CDA$ (SAS 합동)이다. 따라서 $\angle BAC=$ (㉣)이므로 $\overline{AB}\parallel$ (㉤)이 되어 $\square ABCD$는 평행사변형이다.

**보기** ① ㉠ : $\overline{AB}$  ② ㉡ : $\angle DAC$  ③ ㉢ : $\overline{AC}$  ④ ㉣ : $\angle DCA$  ⑤ ㉤ : $\overline{CD}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 가정에서 $\overline{BC} = \overline{AD}$이므로 ㉠에는 $\overline{AD}$가 들어가야 한다. (ABCD)
2. 따라서 $\overline{AB}$가 들어간 ①은 알맞지 않다. (ABCD)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 $\square AB」
**RPM** M2-RPM-074 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 평행사변형 단원의 한 쌍의 대변이 평행하고 길이가 같을 때 평행사변형임의 증명 빈칸 유형이다. (ABCD)
**유형** PT=PT_MG_PARALLELOGRAM_CONDITIONS_SYMBOLIC / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_MG_PARALLELOGRAM_CONDITIONS_SYMBOLIC** **원천→판정: TPL_QUADRILATERAL_CRITERIA → NONE**
- 이유: 평행사변형이 되는 조건의 기호 표현 및 증명 빈칸 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 결정 조건 증명 과정의 빈칸 대응변과 대응각을 검증하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 평행사변형←stem:「$\square ABCD$가 평행사변형임을 설명하는 과정이다.」
- goal: 합동←stem:「$\triangle ABC \equiv \triangle CDA$ (SAS 합동)이다.」
- method: 엇각(NAMED)←solution:「㉡은 엇각 $\angle DAC$, ㉢은 공통변 $\overline{AC}$」
- condition: 평행←stem:「$\overline{AD}\parallel\overline{BC}$이고」

**how** 한 쌍의 대변이 평행하고 그 길이가 같은 사각형의 평행사변형 증명에서 대응 요소를 확인했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

가정에서 $\overline{BC}=\overline{AD}$이므로 ㉠에 들어갈 것은 $\overline{AD}$이다. 따라서 $\overline{AB}$가 들어가는 ①은 알맞지 않다. ㉡은 엇각 $\angle DAC$, ㉢은 공통변 $\overline{AC}$, ㉣은 대응각 $\angle DCA$, ㉤은 $\overline{CD}$가 모두 옳다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (PT, TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 $\square ABCD$가 평행사변형인 것을 모두 고르면? (정답 2개) [5점]

**보기** ① $\overline{AB}=\overline{BC}=5\text{ cm}$, $\overline{CD}=\overline{DA}=7\text{ cm}$  ② $\overline{AD}=\overline{BC}=7\text{ cm}$, $\overline{AD}\parallel\overline{BC}$  ③ $\angle A=\angle B=105^\circ$, $\angle C=75^\circ$  ④ $\angle A+\angle B=180^\circ$, $\angle B+\angle C=180^\circ$  ⑤ 두 대각선의 교점 $O$에 대하여 $\overline{OA}=\overline{OB}$, $\overline{OC}=\overline{OD}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②, ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ② 한 쌍의 대변이 평행하고 그 길이가 같으므로 평행사변형이다. (ABCD)
2. ④ 이웃한 두 각의 합이 180도이면 두 쌍의 대각의 크기가 각각 같으므로 평행사변형이다. (ABCD)
3. 따라서 평행사변형인 것은 ②, ④이다. (ABCD)
- 작성자 답: ②, ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $\square A」
**RPM** M2-RPM-074 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 평행사변형 단원의 평행사변형이 되는 5가지 조건의 만족 여부 종합 판별 유형이다. (ABCD)
**유형** PT=PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION** **원천→판정: TPL_QUADRILATERAL_CRITERIA → NONE**
- 이유: 평행사변형이 되는 조건 판별 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 사각형이 평행사변형이 되기 위한 여러 조건들을 종합적으로 판정하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 평행사변형←stem:「다음 중 $\square ABCD$가 평행사변형인 것을 모두 고르면?」
- goal: 평행사변형←solution:「두 쌍의 대각의 크기가 각각 같아 평행사변형이다.」
- method: 평행(NAMED)←solution:「한 쌍의 대변이 평행하고 그 길이가 같으므로 평행사변형이다.」
- condition: (없음)

**how** 평행사변형이 되는 5가지 조건 중 한 쌍의 대변 평행·길이 일치와 두 쌍의 대각 일치를 확인했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

① 이웃한 두 변씩 길이가 같으므로 연꼴일 수 있어 평행사변형이 아니다. ② 한 쌍의 대변이 평행하고 그 길이가 같으므로 평행사변형이다. ③ 사각형 내각의 합에 의해 $\angle D=75^\circ$이므로 두 쌍의 대각이 같지 않아 평행사변형이 아니다. ④ $\angle A+\angle B=180^\circ$, $\angle B+\angle C=180^\circ$에서 $\angle A=\angle C$이고 $\angle B=\angle D$이므로 두 쌍의 대각의 크기가 각각 같아 평행사변형이다. ⑤ 두 대각선이 서로를 이등분하는 조건이 아니므로 평행사변형이라 할 수 없다. $\therefore$ ②, ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 서술형 8점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 1] $\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 두 밑각의 크기가 같음을 다음 순서에 따라 설명하시오. [8점] (1) 조건에 맞는 이등변삼각형 $ABC$에서 꼭짓각 $\angle A$의 이등분선을 그어 밑변 $BC$와 만나는 점을 $D$라 하자. [2점] (2) $\triangle ABD$와 $\triangle ACD$의 합동을 이용하여 $\angle B=\angle C$인 이유를 설명하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\triangle ABD \equiv \triangle ACD$ (SAS 합동)이므로 $\angle B=\angle C$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 꼭짓각 $\angle A$의 이등분선 $\overline{AD}$를 긋는다. (AB)
2. $\overline{AB}=\overline{AC}, \angle BAD=\angle CAD, \overline{AD}$ 공통이므로 $\triangle ABD \equiv \triangle ACD$ (SAS 합동)이다.
3. 대응각의 크기가 같으므로 $\angle B = \angle C$이다. (AB)
- 작성자 답: $\triangle ABD \equiv \triangle ACD$ (SAS 합동)이므로 $\angle B=\angle C$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] $\overl」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] **원천→판정: 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 꼭짓각의 이등분선 → 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각**
- 이유: 이등변삼각형 단원의 꼭짓각의 이등분선을 이용한 두 밑각의 크기 증명 서술형 유형이다. (AB)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_VERTEX_BISECTOR → NONE**
- 이유: 이등변삼각형의 성질 증명 서술형 유형이다. (AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형의 두 밑각의 크기가 같음을 삼각형의 합동을 통해 단계별로 서술하는 난이도 2 서술형 문항이다. (AB)

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서」
- goal: 밑각←stem:「두 밑각의 크기가 같음을 다음 순서에 따라 설명하시오.」
- method: 합동(NAMED)←solution:「$\triangle ABD \equiv \triangle ACD$ (SAS 합동)이다.」
- condition: 이등분선←stem:「꼭짓각 $\angle A$의 이등분선을 그어 밑변 $BC$와 만나는 점을 $D$라」

**how** 꼭짓각의 이등분선으로 분할된 두 삼각형의 SAS 합동을 보여 두 밑각의 크기가 같음을 증명했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\overline{AB}=\overline{AC}$인 삼각형 $ABC$에서 $\angle A$의 이등분선 $\overline{AD}$를 그어 변 $BC$와의 교점을 $D$라 한다. (2) $\triangle ABD$와 $\triangle ACD$에서 $\overline{AB}=\overline{AC}$, $\angle BAD=\angle CAD$, $\overline{AD}$는 공통인 변이다. 따라서 두 변의 길이와 그 끼인각의 크기가 각각 같으므로 $\triangle ABD \equiv \triangle ACD$ (SAS 합동)이다. 합동인 두 삼각형의 대응각의 크기는 같으므로 $\angle ABD=\angle ACD$, 즉 $\angle B=\angle C$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 서술형 5점


**발문**

[서술형 2] 점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle B=62^\circ$일 때, $\angle AOC$의 크기를 구하는 풀이과정과 답을 쓰시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $124^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심의 성질에 의해 $\overline{OA}=\overline{OB}=\overline{OC}$이다. (ABC)
2. 각각의 이등변삼각형에서 중심 주위 각들의 합을 정리하면 $\angle AOC = 2 \angle B$ 관계가 유도된다. (ABC)
3. $\angle AOC = 2 \times 62^\circ = 124^\circ$이다. (ABC)
- 작성자 답: $124^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] 점 $O$가」
**RPM** M2-RPM-065 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] (원천과 같음)
- 이유: 외심과 내심 단원의 외심과 꼭짓점을 이은 이등변삼각형의 각의 합을 이용한 중심각 계산 서술형 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CIRCUMCENTER → NONE**
- 이유: 삼각형의 외심과 중심각의 크기 계산 서술형 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형의 외심과 원주각-중심각 관계를 이등변삼각형의 성질로부터 서술형으로 유도하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 외심←stem:「점 $O$가 예각삼각형 $ABC$의 외심이고」
- goal: 각←stem:「$\angle AOC$의 크기를 구하는 풀이과정과 답을 쓰시오.」
- method: 외심(NAMED)←solution:「$\overline{OA}=\overline{OB}$이므로 $\angle OAB=x$, $\angle AOB=180^\circ-2x$이다.」
- condition: 삼각형←stem:「예각삼각형 $ABC$의」

**how** 외심과 꼭짓점을 이은 세 이등변삼각형의 각의 합을 이용하여 중심각 AOC 124도를 도출했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ABO=x$라 하면 $\overline{OA}=\overline{OB}$이므로 $\angle OAB=x$, $\angle AOB=180^\circ-2x$이다. $\angle OBC=62^\circ-x$이고 $\overline{OB}=\overline{OC}$이므로 $\angle BCO=62^\circ-x$, $\angle BOC=180^\circ-2(62^\circ-x)=56^\circ+2x$이다. 점 $O$ 둘레의 각의 합은 $360^\circ$이므로 $\angle AOC=360^\circ-(180^\circ-2x)-(56^\circ+2x)=124^\circ$ $\therefore 124^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 서술형 8점


**발문**

[서술형 3] $\triangle ABC$의 내심 $I$에 대하여 $\overline{AI}$의 연장선이 변 $BC$와 만나는 점을 $D$, $\overline{BI}$의 연장선이 변 $AC$와 만나는 점을 $E$라 하자. $\angle ADB=76^\circ$, $\angle AEB=83^\circ$일 때, $\angle C$의 크기를 구하는 풀이과정과 답을 쓰시오. [8점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $46^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 내심은 각의 이등분선이므로 $\angle A = 2b, \angle B = 2a$라 하자. (ABC)
2. $\triangle ABD$에서 $2a+b = 104^\circ$, $\triangle ABE$에서 $a+2b = 97^\circ$이다. (ABC)
3. 변끼리 더하면 $3(a+b) = 201^\circ \implies a+b = 67^\circ$이다. (ABC)
4. 따라서 $\angle A + \angle B = 134^\circ$이므로 $\angle C = 180^\circ - 134^\circ = 46^\circ$이다. (ABC)
- 작성자 답: $46^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] $\trian」
**RPM** M2-RPM-066 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] (원천과 같음)
- 이유: 외심과 내심 단원의 내심과 각의 이등분선을 이용한 삼각형 내각 연립 계산 서술형 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_INCENTER → NONE**
- 이유: 내심과 각의 이등분선 연립 각 계산 서술형 유형이다. (ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심에서 그은 선분이 대변과 만나는 점의 각 조건을 연립하여 꼭짓각을 구하는 난이도 3 서술형 문항이다. (ABC)

**4칸**
- given: 내심←stem:「$\triangle ABC$의 내심 $I$에 대하여」
- goal: 각←stem:「$\angle C$의 크기를 구하는 풀이과정과 답을 쓰시오.」
- method: 내심(NAMED)←solution:「내심 $I$는 각의 이등분선 교점이므로」
- condition: 선분←stem:「$\overline{AI}$의 연장선이 변 $BC$와 만나는 점을 $D$」

**how** 내심의 각 이등분선 조건으로 미지수 a, b의 연립방정식을 세워 각 C 46도를 구했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

내심 $I$는 각의 이등분선 교점이므로 $\angle BAI=\angle CAI=b$, $\angle ABI=\angle CBI=a$라 하자. $\triangle ABD$에서 $2a+b+76^\circ=180^\circ \implies 2a+b=104^\circ$ $\triangle ABE$에서 $a+2b+83^\circ=180^\circ \implies a+2b=97^\circ$ 두 식을 변끼리 더하면 $3(a+b)=201^\circ \implies a+b=67^\circ$이다. 따라서 $\angle A+\angle B=2(a+b)=134^\circ$이므로 $\angle C=180^\circ-134^\circ=46^\circ$ $\therefore 46^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (PT, TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 4] 평행사변형 $ABCD$에서 대각선 $AC$를 그어 생기는 두 삼각형의 합동을 이용하여 두 쌍의 대변의 길이 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{AD}$가 각각 성립함을 설명하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $\triangle ABC \equiv \triangle CDA$ (ASA 합동)이므로 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{AD}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형의 정의에 의해 $\overline{AB}\parallel\overline{DC}, \overline{AD}\parallel\overline{BC}$이다. (ABCD)
2. 엇각에 의해 $\angle BAC = \angle DCA, \angle BCA = \angle DAC$이고 공통변 $\overline{AC}$이다. (ABCD)
3. 따라서 $\triangle ABC \equiv \triangle CDA$ (ASA 합동)이므로 대변의 길이 $\overline{AB}=\overline{CD}, \overline{BC}=\overline{AD}$이다. (ABCD)
- 작성자 답: $\triangle ABC \equiv \triangle CDA$ (ASA 합동)이므로 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{AD}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 4] 평행사변형 $」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 단원의 대각선을 그어 생기는 삼각형의 합동을 통한 대변의 길이 증명 서술형 유형이다. (ABCD)
**유형** PT=PT_M2_PARALLELOGRAM_OPPOSITE_SIDES_PROOF / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_M2_PARALLELOGRAM_OPPOSITE_SIDES_PROOF** **원천→판정: TPL_QUADRILATERAL_PROPERTIES → NONE**
- 이유: 평행사변형의 대변 성질 증명 서술형 유형이다. (ABCD)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 평행사변형의 대변의 길이가 같음을 대각선 분할과 ASA 합동으로 증명하는 난이도 3 서술형 문항이다. (ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 대각선 $AC$를 그어」
- goal: 대각선←stem:「대각선 $AC$를 그어 생기는 두 삼각형의 합동을 이용하여」
- method: 엇각(NAMED)←solution:「$\overline{AB}\parallel\overline{DC}$이므로 $\angle BAC=\angle DCA$ (엇각)」
- condition: 합동←stem:「두 삼각형의 합동을 이용하여」

**how** 대각선에 의해 나뉜 두 삼각형의 엇각과 공통변을 통한 ASA 합동으로 대변의 길이 일치를 증명했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$의 정의에 의해 $\overline{AB}\parallel\overline{DC}$, $\overline{AD}\parallel\overline{BC}$이다. $\triangle ABC$와 $\triangle CDA$에서 $\overline{AB}\parallel\overline{DC}$이므로 $\angle BAC=\angle DCA$ (엇각), $\overline{AD}\parallel\overline{BC}$이므로 $\angle BCA=\angle DAC$ (엇각), $\overline{AC}$는 공통인 변이다. 따라서 한 변의 길이와 그 양 끝각의 크기가 각각 같으므로 $\triangle ABC \equiv \triangle CDA$ (ASA 합동)이다. 합동인 두 삼각형의 대응변의 길이는 같으므로 $\overline{AB}=\overline{CD}$, $\overline{BC}=\overline{AD}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
