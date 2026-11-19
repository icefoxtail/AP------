# 검수 묶음 — 26_왕의중_2학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: REASON_NO_ITEM_TOKEN 5)**
- 문항 24개 / 검사 PASS 23, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 4, 2단계 14, 3단계 5, 4단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 2개 (RPM, 난이도) / 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q2**: 원천 값과 다른 칸 3개 (RPM, TPL, 난이도)
- **Q3**: 풀이 과정에 정답 값이 등장하지 않음
- **Q7**: 검사 코드: REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN
- **Q8**: 난이도 경계 (confidence=high, 원천 경계 B12) / 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q14**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q17**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q20**: 난이도 경계 (confidence=high, 원천 경계 B34)
- **Q23**: 난이도 경계 (confidence=high, 원천 경계 B34)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, 난이도)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$의 변 $AC$ 위의 점 $D$에 대하여 $\overline{BC} = \overline{BD}$이고 $\angle DCB = 72^\circ$일 때, $\angle ABD$의 크기는?

**보기** ① $32^\circ$  ② $36^\circ$  ③ $38^\circ$  ④ $40^\circ$  ⑤ $44^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 삼각형 ABC 에서 AB = AC 이므로 밑각 각 ABC = 각 ACB = 72 도 이다.
2. 2. 삼각형 BCD 에서 BC = BD 이므로 이등변삼각형이고 각 BDC = 각 DCB = 72 도 이다.
3. 3. 삼각형 BCD 의 내각의 합에서 각 CBD = 180 - (72 + 72) = 36 도 이다.
4. 4. 따라서 각 ABD = 각 ABC - 각 CBD = 72 - 36 = 36 도 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$의 변 $AC$ 위의 점 $D$에 대하여」
**RPM** M2-RPM-178 [삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각] **원천→판정: 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각 → 삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각**
- 이유: 이등변삼각형 ABC 와 BCD 의 밑각 성질 72도를 이용해 각 ABD = 36도를 구하는 밑각과 꼭짓각 문항이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_BASE_ANGLES (원천과 같음) (원천과 같음)
- 이유: 이등변삼각형의 밑각이 같음을 이용해 각 DCB = 72도 로부터 각 ABD = 36도를 계산하는 이등변삼각형 밑각 문제이므로 PT_ISOSCELES_TRIANGLE을 선택함.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 이등변삼각형의 밑각 성질로 각 CBD = 36도를 구해 72 - 36 = 36도를 찾는 2단계 기본 문항이다.

**4칸**
- given: 이등변삼각형←stem:「인 이등변삼각형 $ABC$의 변 $AC$」
- goal: 삼각형←stem:「이등변삼각형 $ABC$의 변 $AC$ 위의 점 $D$에 대하여」
- method: 이등변삼각형(NAMED)←solution:「이므로 $\triangle BCD$는 이등변삼각형이고」
- condition: (없음)

**how** AB=AC 와 BC=BD 의 이등변삼각형 성질로 각 B=72도, 각 CBD=36도를 얻어 각 ABD = 72 - 36 = 36도로 ②로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BC} = \overline{BD}$이므로 $\triangle BCD$는 이등변삼각형이고 $\angle BDC = \angle DCB = 72^\circ$ $\angle CBD = 180^\circ - (72^\circ + 72^\circ) = 36^\circ$ $\overline{AB} = \overline{AC}$이므로 $\angle ABC = \angle ACB = 72^\circ$ $\therefore \angle ABD = \angle ABC - \angle CBD = 72^\circ - 36^\circ = 36^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, TPL, 난이도)

**발문**

$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 밑변 $BC$의 교점을 $D$라 하자. $\angle C = 58^\circ$일 때, $\angle B + \angle ADB$의 크기는?

**보기** ① $142^\circ$  ② $145^\circ$  ③ $148^\circ$  ④ $152^\circ$  ⑤ $156^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 삼각형 ABC 에서 AB = AC 이므로 두 밑각의 크기는 같아 각 B = 각 C = 58 도 이다.
2. 2. 이등변삼각형의 꼭짓각 A 의 이등분선 AD 는 밑변 BC 를 수직이등분하므로 각 ADB = 90 도 이다.
3. 3. 따라서 각 B + 각 ADB = 58 + 90 = 148 도 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과」
**RPM** M2-RPM-178 [삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각] **원천→판정: 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 꼭짓각의 이등분선 → 삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각**
- 이유: 이등변삼각형의 밑각 58도와 꼭짓각 이등분선의 수직 성질 각 ADB = 90도를 합산해 148도를 구하는 문항이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_VERTEX_BISECTOR (원천과 같음) **원천→판정: TPL_ISOSCELES_BASE_ANGLES → TPL_ISOSCELES_VERTEX_BISECTOR**
- 이유: 이등변삼각형의 꼭짓각의 이등분선이 밑변을 수직이등분하여 각 ADB = 90도 임을 이용하는 꼭짓각 이등분선 문제이므로 PT_ISOSCELES_TRIANGLE을 선택함.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 이등변삼각형 꼭짓각 이등분선 성질로 각 ADB = 90도를 알고 58도와 더해 148도를 구하는 2단계 기본 문항이다.

**4칸**
- given: 이등변삼각형←stem:「인 이등변삼각형 $ABC$에서 $\angle A$의」
- goal: 교점←stem:「밑변 $BC$의 교점을 $D$라 하자.」
- method: 이등분선(NAMED)←solution:「꼭짓각 $A$의 이등분선 $AD$는 밑변 $BC$를」
- condition: (없음)

**how** 이등변삼각형 밑각 각 B = 58도 와 꼭짓각 이등분선 성질 각 ADB = 90도를 더해 148도를 얻어 ③으로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB} = \overline{AC}$이므로 $\angle B = \angle C = 58^\circ$ 이등변삼각형의 꼭짓각 $A$의 이등분선 $AD$는 밑변 $BC$를 수직이등분하므로 $\angle ADB = 90^\circ$ $\therefore \angle B + \angle ADB = 58^\circ + 90^\circ = 148^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\angle C = \angle F = 90^\circ$인 두 직각삼각형 $ABC$와 $DEF$가 서로 합동이 되는 조건이 아닌 것은?

**보기** ① $\overline{AB} = \overline{DE},\ \overline{AC} = \overline{DF}$  ② $\overline{AC} = \overline{DF},\ \overline{BC} = \overline{EF}$  ③ $\overline{AB} = \overline{DE},\ \angle B = \angle E$  ④ $\overline{AB} = \overline{EF},\ \angle A = \angle D$  ⑤ $\overline{BC} = \overline{EF},\ \angle B = \angle E$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 직각삼각형 ABC 와 DEF 에서 각 C = 각 F = 90 도 이므로 빗변은 AB 와 DE 이다.
2. 2. ① 빗변 AB = DE 이고 다른 한 변 AC = DF 이므로 RHS 합동이다.
3. 3. ② 두 변 AC = DF, BC = EF 와 그 끼인각 90 도가 같으므로 SAS 합동이다.
4. 4. ③ 빗변 AB = DE 이고 한 예각 각 B = 각 E 이므로 RHA 합동이다.
5. 5. ④ AB 는 빗변이고 EF 는 직각을 낀 변이므로 대응변이 아니어서 직각삼각형의 합동이 성립하지 않는다.
6. 6. ⑤ 한 변 BC = EF 와 양 끝 각이 같으므로 ASA 합동이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle C = \angle F = 90^\circ$인 두 직각삼각형 $ABC$와 $DEF$가 서로 합동이 되는 조건이 아닌 것은?」
**RPM** M2-RPM-180 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] (원천과 같음)
- 이유: 두 직각삼각형 ABC 와 DEF 의 빗변과 대응변 관계를 검토하여 RHS, RHA, SAS 등 직각삼각형 합동 조건을 판별하는 문항이다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_CONGRUENCE_CRITERIA
- 이유: 두 직각삼각형의 합동 조건에서 빗변 AB 와 밑변 EF 처럼 대응변이 맞지 않는 보기를 선별하는 직각삼각형 합동 판정 문제이므로 PT_RIGHT_TRIANGLE_CONGRUENCE를 선택함.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: RHS, RHA 등 직각삼각형의 합동 조건을 비교하여 빗변과 직각 낀 변을 혼동한 ④의 오류를 판별하는 2단계 문항이다.

**4칸**
- given: 직각삼각형←stem:「두 직각삼각형 $ABC$와 $DEF$가」
- goal: 합동←stem:「서로 합동이 되는 조건이 아닌 것은?」
- method: 대응변(NAMED)←solution:「대응변이 아니어서 합동을 보장하지 않는다.」
- condition: (없음)

**how** AB 는 빗변이고 EF 는 직각을 낀 변으로 서로 대응변이 아니므로 직각삼각형 합동이 성립하지 않아 ④로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle C = \angle F = 90^\circ$이므로 두 직각삼각형의 빗변은 $\overline{AB}$, $\overline{DE}$이다. ① 빗변과 다른 한 변이 같으므로 $\text{RHS}$ 합동 ② 두 변과 그 끼인각($90^\circ$)이 같으므로 $\text{SAS}$ 합동 ③ 빗변과 한 예각이 같으므로 $\text{RHA}$ 합동 ④ $\overline{AB}$는 빗변이고 $\overline{EF}$는 직각을 낀 변이므로 대응변이 아니어서 합동을 보장하지 않는다. ⑤ 한 변과 양 끝 각이 같으므로 $\text{ASA}$ 합동 $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 5점


**발문**

$\angle C = 90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하고, 점 $D$에서 변 $AB$에 내린 수선의 발을 $E$라고 하자. $\overline{AB} = 20$, $\overline{BC} = 16$, $\overline{AC} = 12$일 때, $\triangle BDE$의 넓이는?

**보기** ① $16$  ② $18$  ③ $20$  ④ $22$  ⑤ $24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 직각삼각형 ADE 와 ADC 에서 각 EAD = 각 CAD 이고 AD 공통, 각 AED = 각 C = 90 도 이므로 삼각형 ADE 와 ADC 는 RHA 합동이다.
2. 2. 따라서 AE = AC = 12 이고 DE = DC 이다.
3. 3. BE = AB - AE = 20 - 12 = 8 이다.
4. 4. 각의 이등분선 성질에 의해 BD : DC = AB : AC = 20 : 12 = 5 : 3 이다.
5. 5. BC = 16 이므로 DE = DC = 16 * 3/(5+3) = 6 이다.
6. 6. 따라서 삼각형 BDE 의 넓이 = (1/2) * BE * DE = (1/2) * 8 * 6 = 24 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle C = 90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하고」
**RPM** M2-RPM-182 [삼각형의 성질 > 삼각형의 성질 > 각의 이등분선 > 각의 이등분선 성질] **원천→판정: 삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA → 삼각형의 성질 > 삼각형의 성질 > 각의 이등분선 > 각의 이등분선 성질**
- 이유: 각 A의 이등분선 성질과 직각삼각형의 합동으로 DE = 6 을 구하고 삼각형 BDE 의 넓이 24 를 구하는 문항이다.
**유형** PT=PT_TRIANGLE_ANGLE_BISECTOR / TPL=TPL_TRIANGLE_ANGLE_BISECTOR_EQUIDISTANCE
- 이유: 각의 이등분선 위의 점 D에서 두 변에 이르는 거리가 같음을 이용해 DE = 6 을 구하고 삼각형 BDE 의 넓이를 구하는 문제이므로 PT_TRIANGLE_ANGLE_BISECTOR를 선택함.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: RHA 합동으로 BE = 8 을 구하고 각 이등분선 비 5:3 으로 DE = 6 을 도출해 넓이 24 를 구하는 3단계 발전 문항이다.

**4칸**
- given: 직각삼각형←stem:「인 직각삼각형 $ABC$에서 $\angle A$의」
- goal: 넓이←stem:「$\triangle BDE$의 넓이는?」
- method: 합동(NAMED)←solution:「ADC$ ($\text{RHA}$ 합동) 따라서」
- condition: (없음)

**how** RHA 합동으로 BE = 20 - 12 = 8 을 구하고 각의 이등분선 비 5:3 으로 DE = 6 을 구해 삼각형 BDE 넓이 24 로 ⑤로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $ADE$와 직각삼각형 $ADC$에서 $\angle EAD = \angle CAD$, $\overline{AD}$는 공통이므로 $\triangle ADE \equiv \triangle ADC$ ($\text{RHA}$ 합동) 따라서 $\overline{AE} = \overline{AC} = 12$, $\overline{DE} = \overline{DC}$이다. $\overline{BE} = \overline{AB} - \overline{AE} = 20 - 12 = 8$ $\angle A$의 이등분선 성질에 의해 $\overline{BD} : \overline{DC} = \overline{AB} : \overline{AC} = 20 : 12 = 5 : 3$이므로 $\overline{DE} = \overline{DC} = 16 \times \dfrac{3}{5 + 3} = 6$ $\therefore \triangle BDE$의 넓이 $= \dfrac{1}{2} \times \overline{BE} \times \overline{DE} = \dfrac{1}{2} \times 8 \times 6 = 24$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점


**발문**

예각삼각형 $ABC$의 외심을 $O$라 하고, 점 $O$에서 세 변 $AB$, $BC$, $CA$에 내린 수선의 발을 각각 $D$, $E$, $F$라 할 때, 다음 <보기> 중 옳은 것만을 있는 대로 고른 것은? 〈보기〉 ㄱ. $\overline{OA} = \overline{OB} = \overline{OC}$ ㄴ. $\triangle OFA \equiv \triangle OFC$ ㄷ. $\overline{OD} = \overline{OE} = \overline{OF}$ ㄹ. $\angle OBD = \angle OBE$

**보기** ① ㄱ, ㄴ  ② ㄱ, ㄷ  ③ ㄴ, ㄷ  ④ ㄴ, ㄹ  ⑤ ㄱ, ㄴ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 예각삼각형 ABC 의 외심 O 의 성질을 분석한다.
2. 2. ㄱ. 외심 O 에서 세 꼭짓점까지의 거리는 외접원의 반지름으로 같으므로 OA = OB = OC 이다. (참)
3. 3. ㄴ. 외심 O 에서 변 AC 에 내린 수선 OF 는 AC 를 수직이등분하므로 AF = CF 이고 OF 공통, 각 OFA = 각 OFC = 90 도 이므로 삼각형 OFA 와 OFC 는 SAS 합동이다. (참)
4. 4. ㄷ. 세 변까지의 거리가 같은 점 OD = OE = OF 는 내심의 성질이므로 외심에서는 거짓이다.
5. 5. ㄹ. 각 OBD = 각 OBE 처럼 세 내각의 이등분선의 교점은 내심이므로 외심에서는 거짓이다.
6. 6. 따라서 옳은 것은 ㄱ, ㄴ 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「예각삼각형 $ABC$의 외심을 $O$라 하고, 점 $O$에서 세 변 $AB$, $BC$, $CA$에 내린 수선의 발을」
**RPM** M2-RPM-184 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] (원천과 같음)
- 이유: 외심 O 의 세 꼭짓점 거리 OA = OB = OC 와 삼각형 OFA 와 OFC 의 합동 등 외심의 성질을 판별하는 문항이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER
- 이유: 예각삼각형 ABC 의 외심 O 의 꼭짓점 거리 OA = OB = OC 와 변의 수직이등분선 성질을 보기에서 선별하는 삼각형의 외심 문제이므로 PT_TRIANGLE_CENTERS를 선택함.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 외심의 성질 OA = OB = OC 와 내심의 성질(변까지 거리 같음)을 구별하여 삼각형 ABC 에서 ㄱ, ㄴ 을 찾는 2단계 개념 문항이다.

**4칸**
- given: 외심←stem:「예각삼각형 $ABC$의 외심을 $O$라 하고」
- goal: 수선←stem:「수선의 발을 각각 $D$, $E$, $F$라 할 때」
- method: 합동(NAMED)←solution:「OFC$ ($\text{SAS}$ 합동)이다. (참)」
- condition: (없음)

**how** 외심 O 에서 세 꼭짓점까지 거리 OA=OB=OC 가 같고 변의 수직이등분선으로 삼각형 OFA 와 OFC 가 합동이므로 ㄱ, ㄴ 인 ①로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. 외심 $O$에서 세 꼭짓점까지의 거리는 모두 같으므로 $\overline{OA} = \overline{OB} = \overline{OC}$이다. (참) ㄴ. 외심 $O$에서 변 $AC$에 내린 수선 $OF$는 변 $AC$를 이등분하므로 $\overline{AF} = \overline{CF}$이고, $\overline{OF}$는 공통, $\angle OFA = \angle OFC = 90^\circ$이므로 $\triangle OFA \equiv \triangle OFC$ ($\text{SAS}$ 합동)이다. (참) ㄷ. 세 변까지의 거리가 같은 점은 내심이다. (거짓) ㄹ. 세 각을 이등분하는 선의 교점은 내심이므로 일반적으로 거짓이다. (거짓) $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 5점


**발문**

예각삼각형 $ABC$의 외심을 $O$라 하고, 선분 $AO$, $BO$의 연장선이 각각 변 $BC$, 변 $AC$와 만나는 점을 $D$, $E$라고 하자. $\angle C = 68^\circ$일 때, $\angle ADB + \angle BEA$의 크기는?

**보기** ① $196^\circ$  ② $200^\circ$  ③ $204^\circ$  ④ $208^\circ$  ⑤ $212^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 점 O 는 삼각형 ABC 의 외심이므로 각 AOB = 2 * 각 C = 2 * 68 = 136 도 이다.
2. 2. OA = OB 이므로 각 OAB = 각 OBA = (180 - 136) / 2 = 22 도 이다.
3. 3. 삼각형 ABD 에서 각 ADB = 180 - (각 B + 22) = 158 - 각 B 이다.
4. 4. 삼각형 ABE 에서 각 BEA = 180 - (각 A + 22) = 158 - 각 A 이다.
5. 5. 각 A + 각 B = 180 - 68 = 112 도 이므로 각 ADB + 각 BEA = (158 - 각 B) + (158 - 각 A) = 316 - 112 = 204 도 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「예각삼각형 $ABC$의 외심을 $O$라 하고, 선분 $AO$, $BO$의 연장선이 각각 변 $BC$, 변 $AC$와 만나는 점을 $D$, $E$라고 하자.」
**RPM** M2-RPM-185 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] (원천과 같음)
- 이유: 외심 O 에서 중심각 각 AOB = 2 * 68 = 136 도와 삼각형 내각의 합으로 각 ADB + 각 BEA = 204도를 구하는 외심의 위치·각 문항이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER
- 이유: 외심 각 AOB = 2각 C = 136도와 꼭짓점 삼각형 내각의 합을 결합하여 각 ADB + 각 BEA = 204도를 계산하는 삼각형의 외심 문제이므로 PT_TRIANGLE_CENTERS를 선택함.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외심 중심각 136도와 두 삼각형의 외각/내각 관계로부터 316 - 112 = 204도를 도출하는 3단계 발전 문항이다.

**4칸**
- given: 외심←stem:「예각삼각형 $ABC$의 외심을 $O$라 하고」
- goal: 선분←stem:「선분 $AO$, $BO$의 연장선이 각각」
- method: 외심(NAMED)←solution:「외심이므로 $\angle AOB = 2\angle C = 2 \times 68^\circ = 136^\circ$」
- condition: (없음)

**how** 외심 O 에서 각 AOB = 136도를 구하고 삼각형 ABD, ABE 내각 합으로 각 ADB + 각 BEA = 316 - 112 = 204도를 얻어 ③으로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $O$는 $\triangle ABC$의 외심이므로 $\angle AOB = 2\angle C = 2 \times 68^\circ = 136^\circ$ $\overline{OA} = \overline{OB}$이므로 $\angle OAB = \angle OBA = \dfrac{180^\circ - 136^\circ}{2} = 22^\circ$ $\triangle ABD$에서 $\angle ADB = 180^\circ - (\angle B + 22^\circ) = 158^\circ - \angle B$ $\triangle ABE$에서 $\angle BEA = 180^\circ - (\angle A + 22^\circ) = 158^\circ - \angle A$ $\angle A + \angle B = 180^\circ - 68^\circ = 112^\circ$이므로 $\therefore \angle ADB + \angle BEA = (158^\circ - \angle B) + (158^\circ - \angle A) = 316^\circ - 112^\circ = 204^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN

**발문**

다음 평면도형 중 항상 서로 닮은 도형이라고 할 수 없는 것은?

**보기** ① 두 정사각형  ② 두 마름모  ③ 두 원  ④ 두 정오각형  ⑤ 두 직각이등변삼각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 평면도형이 항상 닮음이 되려면 대응각의 크기가 항상 같고 대응변의 길이의 비가 일정해야 한다.
2. 2. 정사각형, 원, 정오각형, 직각이등변삼각형은 모양이 항상 일정하여 모든 각의 크기가 같으므로 항상 닮은 도형이다.
3. 3. 두 마름모는 네 변의 길이가 모두 같지만, 내각의 크기가 다를 수 있으므로 항상 닮은 도형이 아니다.
4. 4. 따라서 항상 닮은 도형이라고 할 수 없는 것은 ② 두 마름모이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-SIMILAR_FIGURES → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「다음 평면도형 중 항상 서로 닮은 도형이라고 할 수 없는 것은?」
**RPM** M2-RPM-203 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 대응변·대응각] (원천과 같음)
- 이유: 정사각형, 원 등과 달리 마름모는 내각의 크기가 일정하지 않아 항상 닮은 도형이 아님을 판별하는 대응변·대응각 문항이다.
**유형** PT=PT_SIMILAR_FIGURES / TPL=NONE
- 이유: 정사각형, 정오각형과 비교하여 두 마름모가 항상 닮음이 아님을 선별하는 닮은 도형의 성질 문제이므로 PT_SIMILAR_FIGURES를 선택함.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 닮음의 정의를 적용해 정사각형과 달리 마름모의 내각이 가변적임을 판별하는 1단계 기본 문항이다.

**4칸**
- given: 평면도형←stem:「다음 평면도형 중 항상 서로 닮은」
- goal: 닮음←stem:「항상 서로 닮은 도형이라고 할 수 없는 것은?」
- method: 마름모(NAMED)←choices:「두 마름모」
- condition: (없음)

**how** 정사각형이나 직각이등변삼각형과 달리 두 마름모는 내각이 달라 닮음이 아닐 수 있음을 확인해 ②로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

정사각형, 원, 정오각형, 직각이등변삼각형은 대응각의 크기가 항상 같고 대응변의 길이의 비가 일정하므로 항상 닮은 도형이다. 반면 ② 두 마름모는 네 변의 길이는 같지만 내각의 크기가 다를 수 있으므로 항상 닮은 도형이 아니다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 평행사변형 $ABCD$의 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때, 두 대각선이 서로 다른 것을 이등분함을 증명하는 과정이다. (가), (나), (다)에 들어갈 것으로 알맞게 짝지어진 것은? $\triangle OAD$와 $\triangle OCB$에서 $\overline{AD} \parallel \overline{BC}$이므로 $\angle OAD = \angle OCB\ \cdots\cdots\text{㉠}$, $\angle ODA = \text{(가)}\ \cdots\cdots\text{㉡}$. 평행사변형에서 대변의 길이는 같으므로 $\overline{AD} = \text{(나)}\ \cdots\cdots\text{㉢}$. ㉠, ㉡, ㉢에 의하여 $\triangle OAD \equiv \text{(다)}$ ($\text{ASA}$ 합동)이므로 $\overline{OA} = \overline{OC}$, $\overline{OB} = \overline{OD}$.

**보기** ① (가) $\angle OBC$, (나) $\overline{CD}$, (다) $\triangle OCB$  ② (가) $\angle OCD$, (나) $\overline{BC}$, (다) $\triangle OCD$  ③ (가) $\angle OBC$, (나) $\overline{AB}$, (다) $\triangle OCB$  ④ (가) $\angle OCB$, (나) $\overline{BC}$, (다) $\triangle OCD$  ⑤ (가) $\angle OBC$, (나) $\overline{BC}$, (다) $\triangle OCB$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 평행사변형 ABCD 에서 대변 AD 와 BC 가 평행하므로 엇각으로 각 ODA = 각 OBC 이다. 따라서 (가) = 각 OBC 이다.
2. 2. 평행사변형에서 대변의 길이는 같으므로 AD = BC 이다. 따라서 (나) = BC 이다.
3. 3. ㉠, ㉡, ㉢ 에 의해 삼각형 OAD 와 삼각형 OCB 는 ASA 합동이다. 따라서 (다) = 삼각형 OCB 이다.
4. 4. 따라서 짝지어진 것은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 평행사변형 $ABCD$의 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때」
**RPM** M2-RPM-191 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 평행사변형의 대각선 성질] (원천과 같음)
- 이유: 평행사변형 ABCD 의 대각선 이등분 증명에서 엇각 각 OBC 와 대변 BC 및 ASA 합동 삼각형 OCB 를 완성하는 대각선 성질 문항이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES_PROOF
- 이유: 평행사변형 ABCD 의 대각선 성질 증명 빈칸에 들어갈 엇각 각 OBC, 대변 BC, 합동삼각형 OCB 를 선별하는 사각형 성질 증명 문제이므로 PT_QUADRILATERAL_PROPERTIES를 선택함.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 ABCD 의 엇각과 대변 길이 조건을 차례로 찾아 ASA 합동을 완성하는 2단계 증명 문항이다.

**4칸**
- given: 평행사변형←stem:「다음은 평행사변형 $ABCD$의 두 대각선」
- goal: 증명←stem:「이등분함을 증명하는 과정이다.」
- method: 엇각(NAMED)←solution:「이므로 엇각으로 $\angle ODA = \angle OBC$이다.」
- condition: (없음)

**how** 평행사변형 ABCD 에서 엇각 각 ODA = 각 OBC, 대변 AD = BC, 합동 삼각형 OAD = 삼각형 OCB 로부터 ⑤로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD} \parallel \overline{BC}$이므로 엇각으로 $\angle ODA = \angle OBC$이다. 평행사변형의 대변의 길이가 같으므로 $\overline{AD} = \overline{BC}$이다. 대응점 순서에 맞게 쓰면 $\triangle OAD \equiv \triangle OCB$ ($\text{ASA}$ 합동)이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 $\angle B$의 이등분선이 변 $AD$와 만나는 점을 $F$라고 하자. $\angle AFB = 44^\circ$일 때, $\angle C$의 크기는?

**보기** ① $84^\circ$  ② $86^\circ$  ③ $88^\circ$  ④ $92^\circ$  ⑤ $96^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 평행사변형 ABCD 에서 대변 AD 와 BC 가 평행하므로 엇각에 의해 각 FBC = 각 AFB = 44 도 이다.
2. 2. 선분 BF 가 각 B 의 이등분선이므로 각 B = 2 * 44 = 88 도 이다.
3. 3. 평행사변형에서 이웃한 두 내각의 합은 180 도 이므로 각 B + 각 C = 180 도 이다.
4. 4. 따라서 각 C = 180 - 88 = 92 도 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 $\angle B$의 이등분선이 변 $AD$와 만나는 점을 $F$라고 하자.」
**RPM** M2-RPM-190 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 ABCD 에서 각 이등분선과 엇각 44도로 각 B = 88도를 얻고 이웃한 각 합으로 각 C = 92도를 구하는 변·각 성질 문항이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 평행사변형 ABCD 의 평행선 엇각 각 FBC = 44도와 이웃한 각의 합 180도 성질을 이용해 각 C = 92도를 계산하는 사각형 성질 문제이므로 PT_QUADRILATERAL_PROPERTIES를 선택함.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 엇각으로 각 B = 88도를 구하고 180 - 88 = 92도를 찾는 2단계 기본 문항이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 $\angle B$의」
- goal: 이등분선←stem:「$\angle B$의 이등분선이 변 $AD$와」
- method: 엇각(NAMED)←solution:「이므로 엇각에 의해 $\angle FBC = \angle AFB = 44^\circ$」
- condition: (없음)

**how** 평행사변형 ABCD 에서 엇각으로 각 FBC = 44도를 얻어 각 B = 88도이고, 각 C = 180 - 88 = 92도로 ④로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD} \parallel \overline{BC}$이므로 엇각에 의해 $\angle FBC = \angle AFB = 44^\circ$ $\overline{BF}$가 $\angle B$의 이등분선이므로 $\angle B = 2 \times 44^\circ = 88^\circ$ 평행사변형에서 이웃한 두 각의 합은 $180^\circ$이므로 $\therefore \angle C = 180^\circ - 88^\circ = 92^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

점 $I$는 $\triangle ABC$의 내심이다. $\angle AIC = 126^\circ$, $\angle ICB = 22^\circ$일 때, $\angle IAB$의 크기는?

**보기** ① $32^\circ$  ② $28^\circ$  ③ $30^\circ$  ④ $34^\circ$  ⑤ $36^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1. 점 I 는 삼각형 ABC 의 내심이므로 각 AIC = 90 + (1/2) 각 B = 126 도 이다.
2. 2. (1/2) 각 B = 126 - 90 = 36 도 이므로 각 B = 72 도 이다.
3. 3. CI 는 각 C 의 이등분선이므로 각 C = 2 * 각 ICB = 2 * 22 = 44 도 이다.
4. 4. 삼각형 ABC 의 내각의 합에서 각 A = 180 - (72 + 44) = 180 - 116 = 64 도 이다.
5. 5. AI 는 각 A 의 이등분선이므로 각 IAB = (1/2) 각 A = 64 / 2 = 32 도 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $I$는 $\triangle ABC$의 내심이다. $\angle AIC = 126^\circ$, $\angle ICB = 22^\circ$일 때」
**RPM** M2-RPM-186 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] (원천과 같음)
- 이유: 내심 I 에서 각 AIC = 126도와 각 ICB = 22도를 이용해 각 B, C 를 구하고 각 IAB = 32도를 도출하는 각의 이등분선과 내심 문항이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER
- 이유: 삼각형 ABC 의 내심 각 공식 각 AIC = 90 + B/2 = 126도와 각 이등분선 성질로 각 IAB = 32도를 계산하는 삼각형의 내심 문제이므로 PT_TRIANGLE_CENTERS를 선택함.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심 공식으로 각 B = 72도, 각 C = 44도를 구해 각 A = 64도에서 각 IAB = 32도를 찾는 2단계 문항이다.

**4칸**
- given: 내심←stem:「점 $I$는 $\triangle ABC$의 내심이다.」
- goal: 이등분선←solution:「는 $\angle A$의 이등분선이므로 $\angle IAB =」
- method: 내심(NAMED)←solution:「점 $I$는 내심이므로 $\angle AIC = 90^\circ +」
- condition: (없음)

**how** 내심 공식으로 각 B = 72도, 각 C = 44도를 얻어 각 A = 64도이므로 이등분선 각 IAB = 32도로 ①로 판정함.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $I$는 내심이므로 $\angle AIC = 90^\circ + \dfrac{1}{2}\angle B = 126^\circ$ $\dfrac{1}{2}\angle B = 36^\circ \implies \angle B = 72^\circ$ $\overline{CI}$는 $\angle C$의 이등분선이므로 $\angle C = 2 \times 22^\circ = 44^\circ$ $\angle A = 180^\circ - (72^\circ + 44^\circ) = 64^\circ$ $\overline{AI}$는 $\angle A$의 이등분선이므로 $\angle IAB = \dfrac{64^\circ}{2} = 32^\circ$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

직사각형 $ABCD$에서 두 대각선의 교점을 $O$라고 하자. $\overline{OB} = 4x - 3$, $\overline{AC} = 6x$일 때, $\overline{OA}$의 길이는?

**보기** ① $6$  ② $9$  ③ $10$  ④ $12$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직사각형 ABCD에서 대각선 길이는 서로 같고 이등분하므로 OB = OA = AC / 2 이다.
2. AC = 6x 이므로 OB = 3x 가 된다.
3. 4x - 3 = 3x 에서 x = 3 을 얻는다.
4. 따라서 OA = 3x = 3 * 3 = 9 이므로 답은 9(②)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직사각형 $ABCD$에서 두 대각선의 교점을 $O$라고 하자.」
**RPM** M2-RPM-197 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] (원천과 같음)
- 이유: 직사각형 ABCD 대각선 OB = 3x 와 AC = 6x 에서 특수 사각형의 대각선 성질(M2-RPM-197)에 해당한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 직사각형 ABCD의 대각선 OB = 4x - 3 과 AC = 6x 에서 대각선 성질을 이용하므로 특수한 사각형의 성질(TPL_SPECIAL_QUADRILATERALS)이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직사각형 ABCD 대각선 성질로 일차방정식 4x - 3 = 3x 를 풀어 OA = 9 를 바로 구하는 기본 1단계 문항이다.

**4칸**
- given: 직사각형←stem:「직사각형 $ABCD$에서 두 대각선의」
- goal: 길이←stem:「$\overline{OA}$의 길이는?」
- method: 대각선(NAMED)←solution:「직사각형의 두 대각선은 길이가 같고」
- condition: (없음)

**how** OB = 4x - 3 과 AC = 6x 에서 대각선 성질로 4x - 3 = 3x 를 세워 x = 3 과 OA = 9 를 확정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형의 두 대각선은 길이가 같고 서로 다른 것을 이등분하므로 $\overline{OA} = \overline{OB} = \dfrac{1}{2}\overline{AC}$이다. $\overline{OA} = \dfrac{1}{2}(6x) = 3x$이므로 $4x - 3 = 3x \implies x = 3$ $\therefore \overline{OA} = 3 \times 3 = 9$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

점 $O$, $I$는 각각 예각삼각형 $ABC$의 외심과 내심이다. $\angle IBA = 32^\circ$, $\angle ACI = 20^\circ$일 때, $\angle BIC + \angle BOC$의 크기는?

**보기** ① $260^\circ$  ② $270^\circ$  ③ $280^\circ$  ④ $290^\circ$  ⑤ $300^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 내심 I에서 각의 이등분선 성질로 각 B = 2 * 32 = 64도, 각 C = 2 * 20 = 40도이다.
2. 삼각형 ABC 내각의 합에서 각 A = 180 - (64 + 40) = 76도이다.
3. 내심 중심각 BIC = 90 + 76 / 2 = 128도이다.
4. 외심 중심각 BOC = 2 * 76 = 152도이다.
5. 따라서 BIC + BOC = 128 + 152 = 280도이므로 답은 280도(③)이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$, $I$는 각각 예각삼각형 $ABC$의 외심과 내심이다.」
**RPM** M2-RPM-189 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 외심·내심을 이용한 복합도형] (원천과 같음)
- 이유: 삼각형 ABC에서 외심 BOC = 152 와 내심 BIC = 128 을 결합하므로 외심·내심을 이용한 복합도형(M2-RPM-189)이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_COMBINED
- 이유: 삼각형 ABC의 외심과 내심에서 중심각 BIC 와 BOC 의 합을 구하므로 외심과 내심의 관계(TPL_TRIANGLE_CENTERS_COMBINED)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 ABC에서 내심 각의 이등분으로 각 A = 76도를 구한 뒤 BIC = 128도와 BOC = 152도를 더해 280도를 내는 2단계 문항이다.

**4칸**
- given: 외심←stem:「외심과 내심이다」<br>내심←stem:「외심과 내심이다」
- goal: 각←stem:「$\angle BIC + \angle BOC$의 크기는?」
- method: 내심(NAMED)←solution:「점 $I$는 내심이므로」
- condition: (없음)

**how** 각 IBA = 32도, ACI = 20도에서 각 A = 76도를 찾고 BIC = 128도, BOC = 152도를 합산해 280도를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $I$는 내심이므로 $\angle B = 2\angle IBA = 64^\circ$, $\angle C = 2\angle ACI = 40^\circ$ $\angle A = 180^\circ - (64^\circ + 40^\circ) = 76^\circ$ $\angle BIC = 90^\circ + \dfrac{1}{2}\angle A = 90^\circ + 38^\circ = 128^\circ$ 점 $O$는 외심이므로 $\angle BOC = 2\angle A = 152^\circ$ $\therefore \angle BIC + \angle BOC = 128^\circ + 152^\circ = 280^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

넓이가 $26\text{ cm}^2$인 평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 할 때, $\overline{AO} = \overline{CO}$, $\overline{BO} = \overline{DO}$, $\overline{AB} = 6\text{ cm}$를 만족시킨다. 이때 $\triangle AOD$의 넓이는?

**보기** ① $\dfrac{11}{2}\text{ cm}^2$  ② $6\text{ cm}^2$  ③ $\dfrac{13}{4}\text{ cm}^2$  ④ $\dfrac{13}{2}\text{ cm}^2$  ⑤ $7\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 ABCD의 두 대각선은 서로를 이등분하므로 네 부분삼각형 넓이가 서로 같다.
2. 삼각형 AOD의 넓이는 전체 평행사변형 넓이 26의 4분의 1이다.
3. 따라서 AOD = 26 / 4 = 13 / 2 cm^2 이므로 답은 13/2(④)이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「넓이가 $26\text{ cm}^2$인 평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 할 때」
**RPM** M2-RPM-195 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 분할도형] (원천과 같음)
- 이유: 평행사변형 ABCD 전체 넓이 26 cm^2 에서 대각선 분할 삼각형 AOD 넓이를 구하므로 분할도형(M2-RPM-195)에 해당한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 평행사변형 ABCD에서 넓이 26 cm^2 와 대각선에 의해 나뉘는 삼각형 AOD 넓이를 구하므로 평행사변형의 성질(TPL_QUADRILATERAL_PROPERTIES)이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 ABCD 대각선 4분할 넓이 성질을 바로 적용해 26 / 4 = 13/2 를 계산하는 기본 1단계 문항이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$」
- goal: 넓이←stem:「$\triangle AOD$의 넓이는?」
- method: 대각선(NAMED)←stem:「두 대각선의 교점을 $O$라 할 때」
- condition: (없음)

**how** 넓이 26 cm^2 와 대각선 교점 O의 성질로부터 AOD = 26 * (1/4) = 13/2 를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형의 두 대각선은 서로 다른 것을 이등분하므로 두 대각선에 의해 나뉘는 네 삼각형 $AOB$, $BOC$, $COD$, $DOA$의 넓이는 모두 같다. 따라서 $\triangle AOD$의 넓이는 전체 넓이의 $\dfrac{1}{4}$이므로 $\triangle AOD = 26 \times \dfrac{1}{4} = \dfrac{13}{2}\text{ (cm}^2\text{)}$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

마름모 $ABCD$에서 변 $CD$의 중점을 $M$이라 하자. $\triangle ACM \equiv \triangle ADM$일 때, $\angle BCD$의 크기는?

**보기** ① $60^\circ$  ② $90^\circ$  ③ $100^\circ$  ④ $110^\circ$  ⑤ $120^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형 ACM과 삼각형 ADM이 합동이므로 AC = AD 이다.
2. 마름모 ABCD에서 AD = CD 이므로 AC = AD = CD 가 성립한다.
3. 따라서 삼각형 ACD는 정삼각형이며 각 D = 60도이다.
4. 마름모에서 이웃하는 두 내각의 합은 180도이므로 각 BCD = 180 - 60 = 120도이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$에서 변 $CD$의 중점을 $M$이라 하자.」
**RPM** M2-RPM-196 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 마름모 ABCD에서 변 CD와 각 BCD = 120도의 관계를 다루므로 각 사각형의 성질(M2-RPM-196)에 해당한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 마름모 ABCD의 변 CD와 합동 삼각형 ACM, ADM 으로부터 각 BCD = 120도를 구하므로 특수한 사각형의 성질(TPL_SPECIAL_QUADRILATERALS)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 합동 조건 ACM = ADM 에서 정삼각형을 유도하고 각 D = 60도로부터 각 BCD = 120도를 구하는 2단계 문항이다.

**4칸**
- given: 마름모←stem:「마름모 $ABCD$에서 변 $CD$」
- goal: 각←stem:「$\angle BCD$의 크기는?」
- method: 정삼각형(NAMED)←solution:「$\triangle ACD$는 정삼각형이고 $\angle D = 60^\circ$이다.」
- condition: (없음)

**how** ACM 합동 조건과 마름모 변 AD = CD 로 정삼각형 각 D = 60도를 찾고 각 BCD = 120도를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ACM \equiv \triangle ADM$이므로 대응변 $\overline{AC} = \overline{AD}$이다. 마름모의 네 변의 길이는 모두 같으므로 $\overline{AD} = \overline{CD}$이다. 따라서 $\overline{AC} = \overline{AD} = \overline{CD}$이므로 $\triangle ACD$는 정삼각형이고 $\angle D = 60^\circ$이다. $\overline{AD} \parallel \overline{BC}$이므로 $\angle BCD = 180^\circ - 60^\circ = 120^\circ$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 3점


**발문**

$\triangle ABC \sim \triangle DEF$이고 두 삼각형의 닮음비가 $3 : 5$이다. $\triangle ABC$의 넓이가 $27\text{ cm}^2$일 때, $\triangle DEF$의 넓이는?

**보기** ① $45\text{ cm}^2$  ② $75\text{ cm}^2$  ③ $60\text{ cm}^2$  ④ $80\text{ cm}^2$  ⑤ $90\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 삼각형 ABC와 DEF의 닮음비가 3 : 5 이므로 넓이의 비는 3^2 : 5^2 = 9 : 25 이다.
2. 비례식 27 : 넓이 = 9 : 25 를 세운다.
3. DEF 넓이 = 27 * 25 / 9 = 3 * 25 = 75 cm^2 이므로 답은 75 cm^2(②)이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC \sim \triangle DEF$이고 두 삼각형의 닮음비가 $3 : 5$이다.」
**RPM** M2-RPM-208 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비] (원천과 같음)
- 이유: 삼각형 ABC 넓이 27 cm^2 와 DEF 넓이의 비를 구하므로 닮음의 활용 넓이·부피 비(M2-RPM-208)이다.
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_AREA_VOLUME
- 이유: 삼각형 ABC 와 DEF 의 닮음비 3:5 로부터 넓이 27 cm^2 를 이용해 DEF 의 넓이를 구하므로 닮은 도형의 넓이·부피비(TPL_SIMILAR_FIGURES_AREA_VOLUME)이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 닮음비 3:5를 제곱해 넓이비 9:25를 얻고 ABC 넓이 27에서 DEF 넓이 75를 바로 구하는 1단계 문항이다.

**4칸**
- given: 닮음←stem:「닮음비가 $3 : 5$이다.」
- goal: 넓이←stem:「$\triangle DEF$의 넓이는?」
- method: 닮음(NAMED)←stem:「닮음비가 $3 : 5$이다.」
- condition: (없음)

**how** 닮음비 3:5의 제곱비 9:25로 비례식 27 : S = 9 : 25 에서 S = 75 를 구했다.

<details><summary>저장 해설 (판정 검토용)</summary>

닮음비가 $3 : 5$이므로 넓이의 비는 $3^2 : 5^2 = 9 : 25$이다. $27 : \triangle DEF = 9 : 25$이므로 $\triangle DEF$의 넓이 $= 27 \times \dfrac{25}{9} = 75\text{ (cm}^2\text{)}$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

두 삼각뿔 $V\text{-}ABC$와 $V'\text{-}A'B'C'$는 서로 닮은 도형이고, 꼭짓점 $V$, $A$, $B$, $C$에 대응하는 꼭짓점이 각각 $V'$, $A'$, $B'$, $C'$이다. $\overline{AB} = 8\text{ cm}$, $\overline{A'B'} = 12\text{ cm}$, $\overline{VC} = x\text{ cm}$, $\overline{V'C'} = 18\text{ cm}$, $\overline{BC} = z\text{ cm}$, $\overline{B'C'} = 9\text{ cm}$, $\angle VAC = 62^\circ$, $\angle V'A'C' = y^\circ$일 때, $x + y - 5z$의 값은?

**보기** ① $38$  ② $42$  ③ $44$  ④ $46$  ⑤ $50$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 닮음비는 대응 모서리의 비 AB : A'B' = 8 : 12 = 2 : 3 이다.
2. VC : V'C' = x : 18 = 2 : 3 에서 3x = 36 이므로 x = 12 이다.
3. BC : B'C' = z : 9 = 2 : 3 에서 3z = 18 이므로 z = 6 이다.
4. 대응각의 크기는 서로 같으므로 y = 62 이다.
5. 따라서 x + y - 5z = 12 + 62 - 5 * 6 = 74 - 30 = 44 이므로 답은 44(③)이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 삼각뿔 $V\text{-}ABC$와 $V'\text{-}A'B'C'$는 서로 닮은 도형이고」
**RPM** M2-RPM-203 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 대응변·대응각] (원천과 같음)
- 이유: 삼각뿔 ABC와 A'B'C'에서 닮음비로 미지수 길이를 구하고 대응각 크기를 구하므로 대응변·대응각(M2-RPM-203)이다.
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_RATIO
- 이유: 입체도형 삼각뿔 ABC 에서 대응하는 모서리 AB 와 12 의 닮음비와 대응각 성질을 이용하므로 도형의 닮음비(TPL_SIMILAR_FIGURES_RATIO)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 닮음비 2:3 으로 모서리 x = 12, z = 6 과 대응각 y = 62 를 구하고 식의 값 44 를 계산하는 2단계 문항이다.

**4칸**
- given: 닮음←stem:「서로 닮은 도형이고」
- goal: 값←stem:「$x + y - 5z$의 값은?」
- method: 닮음비(NAMED)←solution:「닮음비는 $\overline{AB} : \overline{A'B'} = 8 : 12 = 2 : 3$이다.」
- condition: (없음)

**how** 대응변 AB:A'B' = 8:12 에서 x = 12, z = 6 과 각 y = 62 를 찾아 x + y - 5z = 44 로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

닮음비는 $\overline{AB} : \overline{A'B'} = 8 : 12 = 2 : 3$이다. $x : 18 = 2 : 3 \implies x = 12$ $z : 9 = 2 : 3 \implies z = 6$ 대응각의 크기는 같으므로 $y = 62$ $\therefore x + y - 5z = 12 + 62 - 5 \times 6 = 44$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

한 직선 위의 세 점 $B$, $C$, $E$에 대하여 $\overline{BC} : \overline{CE} = 4 : 3$이고, 직선 $BE$의 같은 쪽에 있는 두 점 $A$, $D$에 대하여 $\overline{AC} \parallel \overline{DE}$이다. $\triangle ABC$의 넓이가 $20\text{ cm}^2$일 때, 사각형 $ABCD$의 넓이는?

**보기** ① $28\text{ cm}^2$  ② $30\text{ cm}^2$  ③ $32\text{ cm}^2$  ④ $35\text{ cm}^2$  ⑤ $40\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 높이가 같은 두 삼각형 ABC와 ACE에서 밑변의 비 BC : CE = 4 : 3 이다.
2. ABC 넓이가 20 cm^2 이므로 ACE 넓이는 20 * (3/4) = 15 cm^2 이다.
3. AC 와 DE 가 평행하므로 공통 밑변 AC에 대한 삼각형 ACD와 ACE의 넓이는 등적변형에 의해 서로 같다.
4. 따라서 사각형 ABCD의 넓이 = ABC + ACD = 20 + 15 = 35 cm^2 이므로 답은 35 cm^2(④)이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직선 $BE$의 같은 쪽에 있는 두 점 $A$, $D$에 대하여 $\overline{AC} \parallel \overline{DE}$이다.」
**RPM** M2-RPM-194 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 평행선과 넓이] (원천과 같음)
- 이유: AC 와 DE 평행 조건을 이용해 넓이를 변환하고 사각형 ABCD 넓이를 계산하므로 평행선과 넓이(M2-RPM-194)에 해당한다.
**유형** PT=PT_M2_FIGURE_AREA / TPL=NONE
- 이유: 평행선 사이의 공통 밑변 등적변형을 이용하여 사각형 ABCD의 넓이를 구하므로 도형의 넓이(PT_M2_FIGURE_AREA)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 밑변비 4:3으로 ACE = 15를 구하고 AC // DE 등적변형으로 사각형 ABCD 넓이 35를 구하는 2단계 문항이다.

**4칸**
- given: 평행←stem:「$\overline{AC} \parallel \overline{DE}$이다.」
- goal: 넓이←stem:「사각형 $ABCD$의 넓이는?」
- method: 높이(NAMED)←solution:「$\triangle ABC$와 $\triangle ACE$는 높이가 같으므로」
- condition: (없음)

**how** BC:CE = 4:3 에서 ACE = 15 를 얻고 AC // DE 등적변형으로 사각형 ABCD = 20 + 15 = 35 로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$와 $\triangle ACE$는 높이가 같으므로 넓이의 비는 밑변의 길이의 비 $\overline{BC} : \overline{CE} = 4 : 3$과 같다. $\triangle ACE = 20 \times \dfrac{3}{4} = 15\text{ (cm}^2\text{)}$ $\overline{AC} \parallel \overline{DE}$이므로 밑변 $AC$를 공유하는 $\triangle ACD$와 $\triangle ACE$의 넓이는 같다. 따라서 $\triangle ACD = 15\text{ cm}^2$이므로 $\therefore \square ABCD = \triangle ABC + \triangle ACD = 20 + 15 = 35\text{ (cm}^2\text{)}$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점


**발문**

$\square ABCD$가 다음 조건을 만족시킬 때, 평행사변형이 되는 것은? (단, 점 $O$는 두 대각선의 교점이다.)

**보기** ① $\angle A = 112^\circ,\ \angle B = 68^\circ,\ \angle C = 112^\circ$  ② $\overline{AB} \parallel \overline{DC},\ \overline{AD} = \overline{BC} = 10\text{ cm}$  ③ $\overline{AB} = \overline{BC} = 6\text{ cm},\ \overline{AC} \perp \overline{BD}$  ④ $\overline{AB} = \overline{BC} = 7\text{ cm},\ \overline{AD} = \overline{DC} = 5\text{ cm}$  ⑤ $\overline{OA} = \overline{OB} = 8\text{ cm},\ \overline{OC} = \overline{OD} = 5\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 사각형 ABCD 내각의 총합은 360도이다.
2. 조건 1에서 각 D = 360 - (112 + 68 + 112) = 68도이다.
3. 따라서 각 A = 각 C = 112도이고 각 B = 각 D = 68도로 두 쌍의 대각의 크기가 각각 같으므로 평행사변형이 된다.
4. 보기 2~5는 등변사다리꼴이나 연꼴 등의 반례가 존재하므로 답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\square ABCD$가 다음 조건을 만족시킬 때, 평행사변형이 되는 것은?」
**RPM** M2-RPM-192 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 각 A = C = 112도, B = D = 68도처럼 변과 각 조건을 비교하여 판정하므로 변·각 조건(M2-RPM-192)에 해당한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: 사각형 ABCD가 평행사변형이 되기 위한 대각 112 도와 68 도 조건을 판별하므로 평행사변형의 판정(TPL_QUADRILATERAL_CRITERIA)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사각형 ABCD 내각의 합 360도에서 각 D = 68도를 계산하고 평행사변형 판정 조건과 반례를 비교하는 2단계 문항이다.

**4칸**
- given: 사각형←stem:「$\square ABCD$가 다음 조건을」
- goal: 평행사변형←stem:「평행사변형이 되는 것은?」
- method: 내각(NAMED)←solution:「사각형의 내각의 합은 $360^\circ$이므로」
- condition: (없음)

**how** 각 A = 112도, B = 68도, C = 112도에서 각 D = 68도로 대각이 일치함을 확인하여 ①로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

① 사각형의 내각의 합은 $360^\circ$이므로 $\angle D = 360^\circ - (112^\circ + 68^\circ + 112^\circ) = 68^\circ$이다. 두 쌍의 대각의 크기가 각각 같으므로 평행사변형이다. ② 등변사다리꼴일 수 있으므로 평행사변형이 아니다. ③ 두 대각선이 수직이고 이웃한 두 변만 같은 연꼴일 수 있다. ④ 이웃한 두 쌍의 변이 각각 같은 연꼴일 수 있다. ⑤ $\overline{OA} \ne \overline{OC}$이므로 대각선이 서로 이등분하지 않는다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점


**발문**

평행사변형 $ABCD$가 정사각형이 되는 조건으로 옳지 않은 것을 모두 고르면? (정답 2개, 단 점 $O$는 두 대각선의 교점이다.)

**보기** ① $\angle B = 90^\circ,\ \overline{AB} \perp \overline{BC}$  ② $\overline{AB} = \overline{BC},\ \overline{AC} = \overline{BD}$  ③ $\overline{AC} = \overline{BD},\ \overline{AC} \perp \overline{BD}$  ④ $\angle A = 90^\circ,\ \overline{AB} = \overline{BC}$  ⑤ $\overline{OA} = \overline{OC},\ \overline{OB} = \overline{OD}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 ABCD가 정사각형이 되려면 직사각형 조건(한 각 직각 또는 대각선 길이 일치)과 마름모 조건(이웃변 일치 또는 대각선 직교)을 각각 하나씩 가져야 한다.
2. 보기 1은 각 B = 90도와 AB 수직 BC 로 직사각형 조건만 2번 제시되어 마름모 조건이 없으므로 옳지 않다.
3. 보기 2, 3, 4는 모두 직사각형 조건과 마름모 조건을 각각 하나씩 포함하므로 정사각형이 된다.
4. 보기 5는 OA = OC, OB = OD 로 평행사변형 본래의 대각선 성질일 뿐 추가 조건이 아니므로 옳지 않다.
5. 따라서 옳지 않은 것은 ①, ⑤이다.
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$가 정사각형이 되는 조건으로 옳지 않은 것을 모두 고르면?」
**RPM** M2-RPM-196 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: 평행사변형 ABCD와 여러 특수 사각형의 관계 및 성질을 분류하므로 각 사각형의 성질(M2-RPM-196)에 해당한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 평행사변형 ABCD에서 정사각형이 되기 위한 각 B = 90도와 AC = BD 등의 조건을 다루므로 특수한 사각형의 성질(TPL_SPECIAL_QUADRILATERALS)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 ABCD에서 정사각형으로 발전하기 위한 직사각형 및 마름모 조건을 대조하여 중복 및 기본 성질을 가려내는 2단계 문항이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$가 정사각형이」
- goal: 정사각형←stem:「정사각형이 되는 조건으로 옳지 않은 것을」
- method: 직사각형(NAMED)←solution:「직사각형 조건과 마름모 조건을 모두」
- condition: (없음)

**how** 각 B = 90도 조건의 중복인 1번과 평행사변형 기본 대각선 성질인 OA = OC 5번을 옳지 않은 것으로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형이 정사각형이 되려면 직사각형 조건과 마름모 조건을 모두 갖추어야 한다. ① $\angle B = 90^\circ$와 $\overline{AB} \perp \overline{BC}$는 모두 직사각형 조건의 중복이므로 정사각형을 보장하지 않는다. ② 이웃변 일치(마름모) + 대각선 길이 일치(직사각형) $\implies$ 정사각형 ③ 대각선 길이 일치(직사각형) + 대각선 직교(마름모) $\implies$ 정사각형 ④ 한 각 직각(직사각형) + 이웃변 일치(마름모) $\implies$ 정사각형 ⑤ $\overline{OA} = \overline{OC}$, $\overline{OB} = \overline{OD}$는 평행사변형의 기본 성질일 뿐이다. $\therefore$ ①, ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B34)

**발문**

직사각형 $ABCD$의 변 $DC$ 위에 $3\overline{DF} = 2\overline{FC}$가 되도록 점 $F$를 잡고, 선분 $AF$의 연장선과 변 $BC$의 연장선의 교점을 $E$라 하자. $\square ABCD$의 넓이가 $150\text{ cm}^2$일 때, $\triangle DFE$의 넓이는?

**보기** ① $25\text{ cm}^2$  ② $30\text{ cm}^2$  ③ $35\text{ cm}^2$  ④ $40\text{ cm}^2$  ⑤ $45\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 3 DF = 2 FC 에서 DF : FC = 2 : 3 이므로 DF = (2/5) DC 이다.
2. AD // BC 이므로 삼각형 ADF 와 ECF 는 AA 닮음이다.
3. 닮음비에 의해 AD : CE = DF : FC = 2 : 3 이므로 CE = (3/2) AD 이다.
4. 삼각형 DFE의 밑변을 DF, 높이를 CE로 볼 수 있으므로 DFE 넓이 = (1/2) * (2/5 DC) * (3/2 AD) = (3/10) * (DC * AD) 이다.
5. 직사각형 ABCD 넓이가 150 cm^2 이므로 DFE 넓이 = (3/10) * 150 = 45 cm^2 이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) **원천→판정: M2-06-TRIANGLE_SIMILARITY → M2-06-SIMILAR_FIGURES**
- 근거 인용: 「직사각형 $ABCD$의 변 $DC$ 위에 $3\overline{DF} = 2\overline{FC}$가 되도록 점 $F$를 잡고」
**RPM** M2-RPM-208 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비] (원천과 같음)
- 이유: 삼각형 닮음비를 이용해 밑변과 높이를 비례로 표현하고 전체 직사각형 ABCD 넓이 150에 비를 곱하므로 넓이·부피 비(M2-RPM-208)이다.
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION
- 이유: 직사각형 ABCD 내부의 평행선과 삼각형 닮음을 활용하여 부분삼각형 DFE의 넓이를 구하므로 삼각형 닮음의 활용(TPL_TRIANGLE_SIMILARITY_APPLICATION)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 ADF와 ECF의 닮음비 2:3으로 CE = (3/2)AD를 구하고 밑변 DF와 결합해 직사각형 ABCD의 3/10인 45 cm^2를 구하는 3단계 발전 문항이다.

**4칸**
- given: 직사각형←stem:「직사각형 $ABCD$의 변 $DC$」
- goal: 넓이←stem:「$\triangle DFE$의 넓이는?」
- method: 닮음(NAMED)←solution:「$\triangle ADF \sim \triangle ECF$ ($\text{AA}$ 닮음)」
- condition: (없음)

**how** DF:FC = 2:3과 ADF 닮음으로 CE = (3/2)AD를 얻어 DFE 넓이 = (3/10) * 150 = 45 로 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$3\overline{DF} = 2\overline{FC}$이므로 $\overline{DF} : \overline{FC} = 2 : 3$, 따라서 $\overline{DF} = \dfrac{2}{5}\overline{DC}$이다. $\overline{AD} \parallel \overline{CE}$이고 $\angle ADF = \angle ECF = 90^\circ$, $\angle AFD = \angle EFC$이므로 $\triangle ADF \sim \triangle ECF$ ($\text{AA}$ 닮음) 따라서 $\overline{AD} : \overline{CE} = \overline{DF} : \overline{FC} = 2 : 3 \implies \overline{CE} = \dfrac{3}{2}\overline{AD}$ $\triangle DFE$의 밑변을 $\overline{DF}$, 높이를 $\overline{CE}$로 잡으면 $\triangle DFE = \dfrac{1}{2} \times \overline{DF} \times \overline{CE} = \dfrac{1}{2} \times \dfrac{2}{5}\overline{DC} \times \dfrac{3}{2}\overline{AD} = \dfrac{3}{10}(\overline{DC} \times \overline{AD})$ $\therefore \triangle DFE = \dfrac{3}{10} \times 150 = 45\text{ (cm}^2\text{)}$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 5점


**발문**

$\triangle ABC$의 변 $AB$ 위의 점 $D$에 대하여 $\angle B = 35^\circ$, $\angle ACB = 75^\circ$, $\angle ADC = 70^\circ$이고 $\overline{BD} = 7\text{ cm}$, $\overline{BC} = 11\text{ cm}$일 때, $\overline{AC}$의 길이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $7\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형 BDC에서 각 BDC = 180 - ADC = 180 - 70 = 110도이다.
2. 각 BCD = 180 - (110 + 35) = 35도이므로 각 B = 각 BCD = 35도이다.
3. 두 밑각이 같으므로 삼각형 BDC는 이등변삼각형이며 DC = BD = 7 cm 이다.
4. 각 ACD = ACB - BCD = 75 - 35 = 40도이다.
5. 삼각형 ADC에서 각 DAC = 180 - (70 + 40) = 70도이므로 각 DAC = 각 ADC = 70도이다.
6. 따라서 삼각형 ADC도 이등변삼각형이므로 AC = DC = 7 cm 이다.
- 작성자 답: $7\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$의 변 $AB$ 위의 점 $D$에 대하여」
**RPM** M2-RPM-179 [삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 이등변삼각형 판정] **원천→판정: 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 판정 > 두 각 조건 → 삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 이등변삼각형 판정**
- 이유: 각 B = 35도, ADC = 70도로부터 두 각이 같음을 확인해 변의 길이를 결정하므로 이등변삼각형 판정(M2-RPM-179)에 해당한다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_CONVERSE
- 이유: 삼각형 BDC와 ADC에서 두 내각의 크기가 같음을 밝혀 이등변삼각형임을 보이므로 이등변삼각형의 판정(TPL_ISOSCELES_CONVERSE)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 BDC = 110도와 BCD = 35도로 DC = 7을 찾고 각 DAC = 70도로 AC = 7을 유도하는 3단계 발전 문항이다.

**4칸**
- given: 삼각형←stem:「$\triangle ABC$의 변 $AB$ 위의」
- goal: 길이←stem:「$\overline{AC}$의 길이를 구하시오.」
- method: 이등변삼각형(NAMED)←solution:「이므로 $\triangle BDC$는 이등변삼각형이고」
- condition: (없음)

**how** 외각과 내각의 합으로 BCD = 35도, DAC = 70도를 구해 두 번의 이등변삼각형으로 AC = 7 cm 를 확정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$D$는 $\overline{AB}$ 위의 점이므로 $\angle BDC = 180^\circ - \angle ADC = 180^\circ - 70^\circ = 110^\circ$ $\triangle BDC$에서 $\angle BCD = 180^\circ - (110^\circ + 35^\circ) = 35^\circ$ $\angle B = \angle BCD = 35^\circ$이므로 $\triangle BDC$는 이등변삼각형이고 $\overline{DC} = \overline{BD} = 7\text{ cm}$ $\angle ACD = \angle ACB - \angle BCD = 75^\circ - 35^\circ = 40^\circ$ $\triangle ADC$에서 $\angle DAC = 180^\circ - (70^\circ + 40^\circ) = 70^\circ$ $\angle DAC = \angle ADC = 70^\circ$이므로 $\triangle ADC$도 이등변삼각형이고 $\therefore \overline{AC} = \overline{DC} = 7\text{ cm}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 5점


**발문**

$\triangle ABC$에서 변 $BC$의 중점을 $M$이라 하고, 점 $M$에서 두 변 $AB$, $AC$에 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{MD} = \overline{ME}$이고 $\angle B = 38^\circ$일 때, $\angle A$의 크기를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $104^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 중점 M에서 BM = CM 이고 MD 수직 AB, ME 수직 AC 이므로 각 MDB = 각 MEC = 90도이다.
2. MD = ME 이므로 직각삼각형 MDB 와 MEC 는 RHS 합동이다.
3. 따라서 대응각 각 C = 각 B = 38도이다.
4. 삼각형 ABC 내각의 총합에서 각 A = 180 - (38 + 38) = 180 - 76 = 104도이다.
- 작성자 답: $104^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$에서 변 $BC$의 중점을 $M$이라 하고」
**RPM** M2-RPM-180 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] (원천과 같음)
- 이유: 직각삼각형 MDB와 MEC에서 빗변과 한 변 조건으로 합동을 이끌어내므로 RHS(M2-RPM-180)에 해당한다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE
- 이유: 빗변 BM = CM 과 다른 한 변 MD = ME 가 같은 직각삼각형 합동을 이용하므로 빗변과 한 변이 같은 직각삼각형의 합동(TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE)이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: RHS 합동으로 각 C = 38도를 밝히고 삼각형 ABC 내각 합에서 각 A = 104도를 구하는 2단계 문항이다.

**4칸**
- given: 중점←stem:「변 $BC$의 중점을 $M$이라 하고」
- goal: 각←stem:「$\angle A$의 크기를 구하시오.」
- method: 합동(NAMED)←solution:「$\triangle MDB \equiv \triangle MEC$ ($\text{RHS}$ 합동)」
- condition: (없음)

**how** BM = CM 과 MD = ME 의 RHS 합동으로 각 C = 38도를 얻고 각 A = 104도를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

$M$은 $\overline{BC}$의 중점이므로 $\overline{BM} = \overline{CM}$이고 $\angle MDB = \angle MEC = 90^\circ$, $\overline{MD} = \overline{ME}$이므로 $\triangle MDB \equiv \triangle MEC$ ($\text{RHS}$ 합동) 따라서 $\angle C = \angle B = 38^\circ$이다. $\therefore \angle A = 180^\circ - (38^\circ + 38^\circ) = 104^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B34)

**발문**

$\angle B = 90^\circ$이고 $\overline{AB} = 12\text{ cm}$, $\overline{AC} = 15\text{ cm}$인 직각삼각형 모양의 색종이 $ABC$를 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $E$를 잇는 선분 $DE$를 접는 선으로 하여 꼭짓점 $A$가 변 $BC$ 위의 점 $F$에 오도록 접었다. $\angle BDF = \angle DFE$일 때, 다음 물음에 답하시오. (1) 서로 닮음인 두 삼각형을 찾아 닮음 기호를 사용하여 나타내고, 닮음 조건을 서술하시오. (2) $\overline{BD}$의 길이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\triangle DBF \sim \triangle ABC$ ($\text{AA}$ 닮음), (2) $\dfrac{16}{3}\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 접은 도형에서 각 DFE = 각 A 이고 조건에서 각 BDF = 각 DFE 이므로 각 BDF = 각 A 이다.
2. 각 B = 90도 공통이므로 삼각형 DBF 와 ABC 는 AA 닮음이다.
3. 닮음비 k = BD / AB = DF / AC 로 놓으면 BD = 12k, DF = 15k 이다.
4. 접기에 의해 AD = DF = 15k 이므로 AB = AD + BD = 15k + 12k = 27k = 12 이다.
5. 따라서 k = 12/27 = 4/9 이고 BD = 12 * (4/9) = 16/3 cm 이다.
- 작성자 답: (1) $\triangle DBF \sim \triangle ABC$ ($\text{AA}$ 닮음), (2) $\dfrac{16}{3}\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_SIMILARITY(삼각형의 닮음 조건과 대응변의 길이) (원천과 같음) (원천과 같음)
- 근거 인용: 「직각삼각형 모양의 색종이 $ABC$를 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $E$를 잇는」
**RPM** M2-RPM-204 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA] (원천과 같음)
- 이유: 각 B = 90도와 각 BDF = 각 A 의 두 각 일치를 통해 닮음을 보이므로 AA(M2-RPM-204)에 해당한다.
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_CRITERIA
- 이유: 직각과 각 BDF = 각 A 조건을 통해 두 삼각형이 닮음임을 판별하므로 삼각형의 닮음 조건(TPL_TRIANGLE_SIMILARITY_CRITERIA)이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 접기 각 보존과 AA 닮음 증명 후 k = 4/9 로 BD = 16/3 cm 을 도출하는 복합 4단계 심화 문항이다.

**4칸**
- given: 직각삼각형←stem:「인 직각삼각형 모양의 색종이 $ABC$를」
- goal: 닮음←stem:「서로 닮음인 두 삼각형을 찾아」
- method: 닮음(NAMED)←solution:「따라서 $\triangle DBF \sim \triangle ABC$ ($\text{AA}$ 닮음)이다.」
- condition: (없음)

**how** 각 BDF = 각 A 와 직각으로 DBF 닮음 ABC 를 증명하고 AD + BD = 27k = 12 로 BD = 16/3 cm 를 산출했다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 접은 도형에서 대응각의 크기는 같으므로 $\angle DFE = \angle DAE = \angle A$이다. 조건에서 $\angle BDF = \angle DFE$이므로 $\angle BDF = \angle A$이고, $\angle DBF = \angle ABC = 90^\circ$이다. 따라서 $\triangle DBF \sim \triangle ABC$ ($\text{AA}$ 닮음)이다. (2) 닮음비를 $k = \dfrac{\overline{BD}}{\overline{AB}} = \dfrac{\overline{DF}}{\overline{AC}}$라 하면 $\overline{BD} = 12k$, $\overline{DF} = 15k$이다. 접기에서 $\overline{AD} = \overline{DF} = 15k$이므로 $\overline{AB} = \overline{AD} + \overline{BD} = 15k + 12k = 27k = 12$ $k = \dfrac{12}{27} = \dfrac{4}{9}$ $\therefore \overline{BD} = 12 \times \dfrac{4}{9} = \dfrac{16}{3}\text{ (cm)}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점


**발문**

마름모 $ABCD$의 꼭짓점 $A$에서 변 $BC$, 변 $CD$에 내린 수선의 발을 각각 $P$, $Q$라 하자. $\angle B = 68^\circ$일 때, $\angle AQP$의 크기를 구하시오. (단, 풀이 과정에 합동인 두 삼각형을 찾고 합동 조건을 포함하여 작성하시오.)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $56^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 ABP와 ADQ에서 각 APB = 각 AQD = 90도, AB = AD, 각 B = 각 D = 68도이므로 RHA 합동이다.
2. 합동에 의해 대응변 AP = AQ 이므로 삼각형 APQ는 이등변삼각형이다.
3. 마름모의 이웃하는 내각의 합은 180도이므로 각 C = 180 - 68 = 112도이다.
4. 사각형 APCQ 내각의 합에서 각 PAQ = 360 - (90 + 90 + 112) = 68도이다.
5. 따라서 이등변삼각형의 밑각 각 AQP = (180 - 68) / 2 = 112 / 2 = 56도이다.
- 작성자 답: $56^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$의 꼭짓점 $A$에서 변 $BC$, 변 $CD$에 내린」
**RPM** M2-RPM-196 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 마름모 ABCD의 변과 대각 성질을 이용해 삼각형의 합동과 각을 계산하므로 각 사각형의 성질(M2-RPM-196)에 해당한다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 마름모 ABCD의 변과 각 B = 68도 성질 및 각 AQP = 56도 계산을 다루므로 특수한 사각형의 성질(TPL_SPECIAL_QUADRILATERALS)이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: RHA 합동으로 AP = AQ 를 보이고 사각형 APCQ 에서 각 PAQ = 68도를 구해 각 AQP = 56도를 도출하는 3단계 발전 문항이다.

**4칸**
- given: 마름모←stem:「마름모 $ABCD$의 꼭짓점 $A$에서」
- goal: 각←stem:「$\angle AQP$의 크기를 구하시오.」
- method: 이등변삼각형(NAMED)←solution:「이므로 $\triangle APQ$는 이등변삼각형이다.」
- condition: (없음)

**how** ABP 합동 ADQ(RHA)로 AP = AQ 와 각 PAQ = 68도를 얻고 이등변삼각형 밑각으로 각 AQP = 56도를 판정했다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $ABP$와 직각삼각형 $ADQ$에서 $\angle APB = \angle AQD = 90^\circ$, $\overline{AB} = \overline{AD}$ (마름모의 변), $\angle B = \angle D = 68^\circ$ (마름모의 대각)이므로 $\triangle ABP \equiv \triangle ADQ$ ($\text{RHA}$ 합동) 따라서 $\overline{AP} = \overline{AQ}$이므로 $\triangle APQ$는 이등변삼각형이다. 사각형 $APCQ$에서 $\angle C = 180^\circ - 68^\circ = 112^\circ$이고 $\angle APC = \angle AQC = 90^\circ$이므로 $\angle PAQ = 360^\circ - (90^\circ + 90^\circ + 112^\circ) = 68^\circ$ $\therefore \angle AQP = \dfrac{180^\circ - 68^\circ}{2} = 56^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
