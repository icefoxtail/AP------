# 검수 묶음 — 26_왕운중_2학기_중간_중2_유사

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 24개 / 검사 PASS 24, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 5, 2단계 11, 3단계 7, 4단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 풀이 과정에 정답 값이 등장하지 않음
- **Q4**: 난이도 경계 (confidence=high, 원천 경계 B34)
- **Q12**: 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q20**: 난이도 경계 (confidence=high, 원천 경계 B12)

---
## Q1 — 객관식 3점


**발문**

$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle B$의 이등분선이 $\overline{AC}$와 만나는 점을 $D$라고 하자. $\angle BDC = 69^\circ$일 때, $\angle BAD$의 크기는?

**보기** ① $28^\circ$  ② $32^\circ$  ③ $36^\circ$  ④ $37^\circ$  ⑤ $40^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이등변삼각형 ABC에서 AB = AC이므로 각 B = 각 C이다.
2. 각 B의 이등분선 BD에 의해 각 DBC = 각 B / 2 = x라 두면 각 C = 2x이다.
3. 삼각형 BDC에서 x + 2x + 69^\circ = 180^\circ이므로 3x = 111^\circ에서 x = 37^\circ이다.
4. 따라서 각 B = 각 C = 74^\circ이므로 꼭지각 BAD = 180^\circ - 2 * 74^\circ = 32^\circ이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서」
**RPM** M2-RPM-178 [삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각] **원천→판정: 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각 → 삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각**
- 이유: 이등변삼각형 ABC에서 밑각과 각 BDC = 69도를 이용하여 꼭지각 BAD = 32도를 구하는 이등변삼각형 밑각과 꼭짓각 유형이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_BASE_ANGLES (원천과 같음) (원천과 같음)
- 이유: 이등변삼각형 ABC의 두 밑각 B, C가 같음을 이용하여 각 B의 이등분선과 각 BDC = 69도로부터 꼭지각 BAD를 산출하는 밑각 계산 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형의 밑각 성질과 삼각형 BDC의 내각의 합 180도 방정식을 세워 꼭지각 32도를 구하므로 난이도 2이다.

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서」
- goal: 각←stem:「$\angle BAD$의 크기는?」
- method: 꼭지각(IMPLIED)←solution:「$\overline{AB} = \overline{AC}$이므로 $\angle B = \angle C$이다.」 — 이등변삼각형의 밑각과 꼭지각의 합 성질 적용
- condition: (없음)

**how** 이등변삼각형 ABC에서 각 DBC = x로 두고 삼각형 BDC의 각의 합에서 x = 37도를 구한 뒤 꼭지각 BAD = 32도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB} = \overline{AC}$이므로 $\angle B = \angle C$이다. $\angle DBC = \dfrac{1}{2}\angle B = x$라 하면 $\angle C = 2x$이다. $\triangle BDC$에서 $x + 2x + 69^\circ = 180^\circ$ $3x = 111^\circ \implies x = 37^\circ$ 따라서 $\angle B = \angle C = 74^\circ$이므로 $\angle BAD = 180^\circ - (74^\circ + 74^\circ) = 32^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\angle C = \angle F = 90^\circ$인 두 직각삼각형 $ABC$와 $DEF$가 $\text{RHA}$ 합동이 되기 위한 조건인 것은?

**보기** ① $\overline{AC} = \overline{DF},\ \overline{BC} = \overline{EF}$  ② $\overline{AB} = \overline{DE},\ \overline{BC} = \overline{EF}$  ③ $\overline{AB} = \overline{DE},\ \angle B = \angle E$  ④ $\overline{AC} = \overline{DF},\ \angle A = \angle D$  ⑤ $\angle A = \angle D,\ \angle B = \angle E$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 ABC와 DEF에서 각 C = 각 F = 90^\circ이므로 빗변은 각각 AB와 DE이다.
2. RHA 합동은 빗변의 길이가 같고 한 예각의 크기가 같아야 성립한다.
3. 따라서 빗변 조건 AB = DE와 한 예각 조건 각 B = 각 E(또는 각 A = 각 D)가 주어져야 한다.
4. 보기 중 이에 해당하는 것은 3번 AB = DE, 각 B = 각 E이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 직각삼각형 $ABC$와 $DEF$가 $\text{RHA}$ 합동이 되기 위한 조건인 것은?」
**RPM** M2-RPM-181 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] (원천과 같음)
- 이유: 각 C = 각 F = 90도인 두 직각삼각형 ABC, DEF에서 RHA 합동이 되는 빗변 AB = DE와 예각 조건을 판별하는 유형이다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_CONGRUENCE_CRITERIA
- 이유: 두 직각삼각형 ABC, DEF의 빗변 AB, DE와 대응하는 한 예각의 일치 조건을 찾는 직각삼각형의 합동 조건 판별 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각 90도와 RHA 합동 정의에 따른 빗변 AB = DE 및 한 예각 조건을 직접 고르는 기본 문항이므로 난이도 1이다.

**4칸**
- given: 직각삼각형←stem:「$\angle C = \angle F = 90^\circ$인 두 직각삼각형 $ABC$와 $DEF$가」
- goal: 합동←stem:「$\text{RHA}$ 합동이 되기 위한 조건인 것은?」
- method: 합동(IMPLIED)←solution:「$\text{RHA}$ 합동이 되려면 빗변의 길이와 한 예각의 크기가 각각 같아야 하므로」 — RHA 직각삼각형 합동조건 정의 적용
- condition: (없음)

**how** 각 C = 각 F = 90도에서 빗변 AB = DE와 한 예각 각 B = 각 E가 같을 때 RHA 합동이 됨을 기본 정의로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle C = \angle F = 90^\circ$이므로 두 직각삼각형의 빗변은 $\overline{AB}$, $\overline{DE}$이다. $\text{RHA}$ 합동이 되려면 빗변의 길이와 한 예각의 크기가 각각 같아야 하므로 $\overline{AB} = \overline{DE}$, $\angle B = \angle E$ (또는 $\angle A = \angle D$)이어야 한다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점


**발문**

점 $I$는 $\triangle ABC$의 내심이고 $\angle A = 64^\circ$, $\angle B = 52^\circ$일 때 $\angle AIB = x$라 하자. 또 점 $O$는 예각삼각형 $DEF$의 외심이고 $\angle EOD = 124^\circ$, $\angle OEF = 24^\circ$이며 두 점 $D$, $F$가 직선 $OE$에 대하여 서로 반대쪽에 있을 때 $\angle OFD = y$라 하자. 이때 $x + y$의 값은?

**보기** ① $160^\circ$  ② $148^\circ$  ③ $154^\circ$  ④ $166^\circ$  ⑤ $172^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형 ABC에서 각 C = 180^\circ - (64^\circ + 52^\circ) = 64^\circ이다.
2. 점 I가 내심이므로 x = 각 AIB = 90^\circ + (64^\circ / 2) = 122^\circ이다.
3. 외심 O에 대해 각 EOD = 124^\circ이므로 이등변삼각형 ODE에서 각 OED = (180 - 124)/2 = 28^\circ이다.
4. 각 DEF = 28^\circ + 24^\circ = 52^\circ이므로 각 DOF = 2 * 52^\circ = 104^\circ이다.
5. 이등변삼각형 ODF에서 y = 각 OFD = (180 - 104)/2 = 38^\circ이다.
6. 따라서 x + y = 122^\circ + 38^\circ = 160^\circ이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $I$는 $\triangle ABC$의 내심이고」
**RPM** M2-RPM-188 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산] (원천과 같음)
- 이유: 내심 I에서의 각 AIB = 122도와 외심 O에서의 각 OFD = 38도를 계산하여 합 160도를 구하는 외심·내심 각 계산 유형이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_COMBINED
- 이유: 삼각형 ABC의 내심 공식과 예각삼각형 DEF의 외심 중심각 성질을 결합하여 각의 합 x + y = 160도를 도출하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심에 의한 각 x = 122도 계산과 외심 이등변삼각형에 의한 각 y = 38도 계산을 연계하므로 난이도 2이다.

**4칸**
- given: 내심←stem:「점 $I$는 $\triangle ABC$의 내심이고 $\angle A = 64^\circ$, $\angle B = 52^\circ$일 때」<br>외심←stem:「또 점 $O$는 예각삼각형 $DEF$의 외심이고」
- goal: 각←stem:「이때 $x + y$의 값은?」
- method: 외심(IMPLIED)←solution:「점 $I$는 내심이므로 $x = \angle AIB = 90^\circ + \dfrac{1}{2}\angle C = 90^\circ + 32^\circ = 122^\circ$」 — 내심과 외심의 중심각 공식 적용
- condition: (없음)

**how** 내심 공식으로 각 AIB = 122도를 구하고 외심 이등변삼각형 각 추적으로 각 OFD = 38도를 구하여 합 160도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$에서 $\angle C = 180^\circ - (64^\circ + 52^\circ) = 64^\circ$ 점 $I$는 내심이므로 $x = \angle AIB = 90^\circ + \dfrac{1}{2}\angle C = 90^\circ + 32^\circ = 122^\circ$ $\triangle DEF$의 외심 $O$에 대하여 $\overline{OD} = \overline{OE} = \overline{OF}$이므로 $\angle OED = \dfrac{180^\circ - 124^\circ}{2} = 28^\circ$ $\angle DEF = \angle OED + \angle OEF = 28^\circ + 24^\circ = 52^\circ$ $\angle DOF = 2\angle DEF = 104^\circ$이므로 $y = \angle OFD = \dfrac{180^\circ - 104^\circ}{2} = 38^\circ$ $\therefore x + y = 122^\circ + 38^\circ = 160^\circ$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B34)

**발문**

둔각삼각형 $ABC$의 외심 $O$가 변 $BC$에 대하여 꼭짓점 $A$의 반대쪽에 있고, 꼭짓점 $A$에서 변 $BC$에 내린 수선의 발을 $D$, $\triangle ADC$의 외심을 $O'$이라고 하자. $\angle ABD = 45^\circ$이고 점 $A$의 반대쪽에서 잰 $\angle BOC = 156^\circ$일 때, 다음 중 옳지 않은 것은?

**보기** ① $\triangle CO'D$는 이등변삼각형이다.  ② $\angle DAO = 12^\circ$  ③ $\overline{DO'} = \overline{OO'}$  ④ 점 $O'$은 $\triangle AOC$의 외심이다.  ⑤ $\angle DCO' = 38^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 둔각삼각형 ABC에서 점 A 반대쪽 각 BOC = 156^\circ이므로 2 * 각 BAC = 360^\circ - 156^\circ = 204^\circ에서 각 BAC = 102^\circ이다.
2. 각 ACB = 180^\circ - 102^\circ - 45^\circ = 33^\circ이다.
3. 직각삼각형 ADC의 외심 O'은 빗변 AC의 중점이므로 O'C = O'D(1번 참)이고 O'O = O'A(3, 4번 참)이다.
4. 각 AOB = 2 * 각 ACB = 66^\circ이므로 각 BAO = 57^\circ, 각 DAO = 57^\circ - 45^\circ = 12^\circ(2번 참)이다.
5. 5번: 각 DCO' = 각 ACB = 33^\circ이지 38^\circ가 아니므로 거짓이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「둔각삼각형 $ABC$의 외심 $O$가 변 $BC$에 대하여 꼭짓점 $A$의 반대쪽에 있고」
**RPM** M2-RPM-185 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] (원천과 같음)
- 이유: 둔각삼각형 ABC의 외심 O와 직각삼각형 ADC의 외심 O'의 위치 및 각 BOC = 156도 조건을 분석하는 외심의 위치·각 유형이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER
- 이유: 둔각삼각형 ABC의 외심 각 BOC = 156도와 직각삼각형 외심이 빗변의 중점임을 이용하여 보기의 각과 선분 관계를 감사하는 삼각형 외심 유형이다.
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 둔각삼각형 외심 O의 위치관계와 직각삼각형 외심 O'의 성질 및 다단계 각 추적(각 ACB = 33도)을 종합해야 하므로 난이도 4이다.

**4칸**
- given: 삼각형←stem:「둔각삼각형 $ABC$의 외심 $O$가 변 $BC$에 대하여 꼭짓점 $A$의 반대쪽에 있고」<br>수선의발←stem:「꼭짓점 $A$에서 변 $BC$에 내린 수선의 발을 $D$, $\triangle ADC$의 외심을 $O'$이라고 하자.」
- goal: 외심←choices:「점 $O'$은 $\triangle AOC$의 외심이다.」
- method: 외심(IMPLIED)←solution:「직각삼각형 $ADC$의 외심 $O'$은 빗변 $AC$의 중점이므로」 — 직각삼각형의 외심 위치(빗변의 중점)와 외심의 각 성질 적용
- condition: (없음)

**how** 외심 O에서 각 BAC = 102도, 각 ACB = 33도를 구하고 직각삼각형 ADC의 외심 O'에 대해 각 DCO' = 33도임을 확인하여 5번이 거짓임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle BAC$가 둔각이므로 $2\angle BAC = 360^\circ - 156^\circ = 204^\circ \implies \angle BAC = 102^\circ$ $\angle ACB = 180^\circ - 102^\circ - 45^\circ = 33^\circ$ ① 직각삼각형 $ADC$의 외심 $O'$은 빗변 $AC$의 중점이므로 $\overline{O'C} = \overline{O'D}$ (참) ② $\angle AOB = 2\angle ACB = 66^\circ$이므로 $\angle BAO = \dfrac{180^\circ - 66^\circ}{2} = 57^\circ$, $\angle BAD = 45^\circ$이므로 $\angle DAO = 57^\circ - 45^\circ = 12^\circ$ (참) ③, ④ $\angle AOC = 2\angle ABC = 90^\circ$이므로 직각삼각형 $AOC$의 빗변 $AC$의 중점 $O'$은 $\triangle AOC$의 외심이고 $\overline{O'O} = \overline{O'A} = \overline{O'C} = \overline{O'D}$ (참) ⑤ $\angle DCO' = \angle ACB = 33^\circ \ne 38^\circ$ (거짓) $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 5점


**발문**

$\triangle ABC$의 변 $AC$ 위의 점 $F$에서 변 $BC$에 내린 수선의 발을 $E$라고 하고, 점 $E$에서 변 $AB$에 내린 수선의 발을 $D$라고 하자. $\overline{BE} = \overline{CF}$, $\overline{BD} = \overline{CE}$, $\angle C = 52^\circ$, $\overline{AF} = 4$, $\overline{BE} = 7$일 때, $\overline{AB}$의 길이는?

**보기** ① $8$  ② $9$  ③ $10$  ④ $11$  ⑤ $14$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 BDE와 CEF에서 각 BDE = 각 CEF = 90^\circ, BE = CF, BD = CE이므로 RHS 합동이다.
2. 합동에 의해 대응각 각 B = 각 C = 52^\circ이므로 삼각형 ABC는 AB = AC인 이등변삼각형이다.
3. FC = BE = 7이므로 AC = AF + FC = 4 + 7 = 11이다.
4. 따라서 AB = AC = 11이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$의 변 $AC$ 위의 점 $F$에서 변 $BC$에 내린 수선의 발을 $E$라고 하고」
**RPM** M2-RPM-180 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] (원천과 같음)
- 이유: 직각삼각형 BDE와 CEF의 RHS 합동과 BE = CF 조건을 이용하여 이등변삼각형 ABC의 선분 AB = 11을 구하는 직각삼각형 합동 유형이다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE
- 이유: 직각삼각형의 RHS 합동으로 대응각 각 B = 각 C를 얻어 이등변삼각형 ABC를 도출하고 선분 AB = 11을 계산하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수선의 발에 의한 두 직각삼각형의 RHS 합동 증명과 이등변삼각형 판정 및 선분 길이 계산을 연결하므로 난이도 3이다.

**4칸**
- given: 수선의발←stem:「$\triangle ABC$의 변 $AC$ 위의 점 $F$에서 변 $BC$에 내린 수선의 발을 $E$라고 하고」
- goal: 이등변삼각형←solution:「따라서 $\angle B = \angle C = 52^\circ$이므로 $\triangle ABC$는 $\overline{AB} = \overline{AC}$인 이등변삼각형이다.」
- method: 합동(IMPLIED)←solution:「$\triangle BDE \equiv \triangle CEF$ ($\text{RHS}$ 합동)」 — 직각삼각형의 RHS 합동과 이등변삼각형 판정 적용
- condition: (없음)

**how** 직각삼각형 BDE와 CEF의 RHS 합동으로부터 각 B = 각 C = 52도임을 밝혀 삼각형 ABC가 이등변삼각형임을 확인하고 AB = 11로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $BDE$와 직각삼각형 $CEF$에서 $\angle BDE = \angle CEF = 90^\circ$, $\overline{BE} = \overline{CF}$, $\overline{BD} = \overline{CE}$이므로 $\triangle BDE \equiv \triangle CEF$ ($\text{RHS}$ 합동) 따라서 $\angle B = \angle C = 52^\circ$이므로 $\triangle ABC$는 $\overline{AB} = \overline{AC}$인 이등변삼각형이다. $\overline{FC} = \overline{BE} = 7$이므로 $\overline{AB} = \overline{AC} = \overline{AF} + \overline{FC} = 4 + 7 = 11$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라고 하자. 점 $P$가 선분 $AD$ 위의 점일 때, 다음 중 옳지 않은 것을 모두 고르면? (정답 2개)

**보기** ① $\overline{AP} = \overline{PD}$  ② $\overline{BP} = \overline{CP}$  ③ $\overline{BC} \perp \overline{AD}$  ④ $\angle ABP = \angle ACP$  ⑤ $\overline{BC} = \dfrac{1}{2}\overline{BD}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이등변삼각형 ABC에서 꼭짓각 A의 이등분선 AD는 밑변 BC를 수직이등분한다. 따라서 BC는 AD에 수직이고 BD = CD = BC/2이다.
2. 점 P가 선분 AD 위의 점일 때 삼각형 ABP와 ACP는 SAS 합동이므로 BP = CP이고 각 ABP = 각 ACP이다.
3. 1번 AP = PD는 점 P의 위치에 따라 다르므로 항상 성립하지 않는다.
4. 5번 BC = 2 BD이므로 BC = BD/2라는 보기는 거짓이다.
5. 따라서 옳지 않은 것은 ①, ⑤이다.
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라고 하자.」
**RPM** M2-RPM-178 [삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각] **원천→판정: 삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 꼭짓각의 이등분선 → 삼각형의 성질 > 삼각형의 성질 > 이등변삼각형 > 밑각과 꼭짓각**
- 이유: 이등변삼각형 ABC의 꼭짓각 이등분선 AD와 선분 BC, BD의 수직이등분 성질을 판별하는 밑각과 꼭짓각 유형이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_VERTEX_BISECTOR
- 이유: 이등변삼각형 ABC에서 꼭짓각 이등분선 AD가 밑변 BC를 수직이등분하는 성질과 선분 AP, BP의 관계를 점검하는 꼭지각 이등분선 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 꼭짓각 이등분선에 의한 밑변 수직이등분 및 선분 BP = CP 성질을 확인하여 틀린 보기 1, 5번을 가려내므로 난이도 2이다.

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라고 하자.」
- goal: 이등변삼각형←choices:「$\overline{BC} \perp \overline{AD}$」
- method: 수직이등분선(IMPLIED)←solution:「이등변삼각형 $ABC$에서 꼭짓각 $A$의 이등분선 $AD$는 밑변 $BC$의 수직이등분선이다.」 — 이등변삼각형 꼭지각의 이등분선 성질 적용
- condition: (없음)

**how** 이등변삼각형 ABC에서 꼭짓각 이등분선 AD가 밑변을 수직이등분함을 확인하여 성립하지 않는 1번과 5번을 정답으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

이등변삼각형 $ABC$에서 꼭짓각 $A$의 이등분선 $AD$는 밑변 $BC$의 수직이등분선이다. 따라서 $\overline{BC} \perp \overline{AD}$이고 $\overline{BD} = \overline{CD} = \dfrac{1}{2}\overline{BC}$이다. 선분 $AD$ 위의 점 $P$에 대하여 $\triangle ABP \equiv \triangle ACP$ ($\text{SAS}$ 합동)이므로 $\overline{BP} = \overline{CP}$, $\angle ABP = \angle ACP$는 항상 성립한다. 반면 ① $\overline{AP} = \overline{PD}$는 점 $P$의 위치에 따라 달라지므로 일반적으로 성립하지 않고, ⑤ $\overline{BC} = 2\overline{BD}$이므로 거짓이다. $\therefore$ ①, ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점


**발문**

점 $I$는 $\triangle ABC$의 내심이다. $\overline{BI}$의 연장선과 변 $AC$의 교점을 $D$, $\overline{CI}$의 연장선과 변 $AB$의 교점을 $E$라고 하자. $\angle BDC = 102^\circ$, $\angle BEC = 105^\circ$일 때, $\angle BIC$의 크기는?

**보기** ① $125^\circ$  ② $129^\circ$  ③ $131^\circ$  ④ $133^\circ$  ⑤ $135^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. BD와 CE는 각각 각 B와 각 C의 이등분선이다.
2. 삼각형 BDC에서 각 B / 2 + 각 C = 180도 - 102도 = 78도이다.
3. 삼각형 BEC에서 각 B + 각 C / 2 = 180도 - 105도 = 75도이다.
4. 두 식을 더하면 (3/2)(각 B + 각 C) = 153도에서 각 B + 각 C = 102도이다.
5. 따라서 각 A = 180도 - 102도 = 78도이고, 각 BIC = 90도 + 78도 / 2 = 129도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $I$는 $\triangle ABC$의 내심이다.」
**RPM** M2-RPM-186 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] (원천과 같음)
- 이유: 내심 I에서 나온 각의 이등분선과 각 BDC = 102도, 각 BEC = 105도를 연립하여 각 BIC = 129도를 구하는 내심 유형이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER
- 이유: 내심 I의 각 이등분선 성질로 삼각형 BDC와 BEC에서 식을 세워 각 A를 찾고 각 BIC를 계산하는 내심 각 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 각의 이등분선이 만드는 교각 102도와 105도로부터 연립방정식을 세워 각 A와 각 BIC를 산출하므로 난이도 3이다.

**4칸**
- given: 내심←stem:「점 $I$는 $\triangle ABC$의 내심이다.」
- goal: 각←stem:「$\angle BIC$의 크기는?」
- method: 내심(IMPLIED)←solution:「$\overline{BD}$와 $\overline{CE}$는 각각 $\angle B$, $\angle C$의 이등분선이다.」 — 내심의 정의와 각의 이등분선 연립방정식 적용
- condition: (없음)

**how** 각의 이등분선과 각 BDC = 102도, BEC = 105도로부터 각 B + 각 C = 102도를 구하고 각 BIC = 90 + 39 = 129도로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BD}$와 $\overline{CE}$는 각각 $\angle B$, $\angle C$의 이등분선이다. $\triangle BDC$에서 $\dfrac{1}{2}\angle B + \angle C = 180^\circ - 102^\circ = 78^\circ$ $\triangle BEC$에서 $\angle B + \dfrac{1}{2}\angle C = 180^\circ - 105^\circ = 75^\circ$ 두 식을 더하면 $\dfrac{3}{2}(\angle B + \angle C) = 153^\circ \implies \angle B + \angle C = 102^\circ$ 따라서 $\angle A = 180^\circ - 102^\circ = 78^\circ$ $\therefore \angle BIC = 90^\circ + \dfrac{1}{2}\angle A = 90^\circ + 39^\circ = 129^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

$\overline{AB} = \overline{AC}$인 예각이등변삼각형 $ABC$의 외심을 $O$, 내심을 $I$라고 하자. $\angle BIC = 112^\circ$일 때, $\angle OBI$의 크기는?

**보기** ① $8^\circ$  ② $10^\circ$  ③ $11^\circ$  ④ $12^\circ$  ⑤ $14^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 내심 I에서 각 BIC = 90도 + 각 A / 2 = 112도이므로 각 A = 44도이다.
2. 이등변삼각형 ABC에서 밑각 ABC = (180도 - 44도) / 2 = 68도이다.
3. 내심선 BI에 의해 각 IBC = 68도 / 2 = 34도이다.
4. 외심 O에서 중심각 BOC = 2 * 44도 = 88도이고 이등변삼각형 OBC에서 각 OBC = (180도 - 88도) / 2 = 46도이다.
5. 따라서 각 OBI = 각 OBC - 각 IBC = 46도 - 34도 = 12도이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = \overline{AC}$인 예각이등변삼각형 $ABC$의 외심을 $O$, 내심을 $I$라고 하자.」
**RPM** M2-RPM-188 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산] **원천→판정: 삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 외심·내심을 이용한 복합도형 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산**
- 이유: 이등변삼각형 ABC에서 내심 각 BIC = 112도로부터 꼭지각 44도를 구하고 외심 O와 결합하여 각 OBI = 12도를 구하는 유형이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_COMBINED
- 이유: 이등변삼각형 ABC의 내심 I와 외심 O의 각 성질을 동시에 활용하여 각 OBI의 크기를 계산하는 외심·내심 복합 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심 공식으로 꼭지각을 구하고 외심 이등변삼각형 밑각과 내심 각의 이등분선 밑각의 차 12도를 계산하므로 난이도 3이다.

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB} = \overline{AC}$인 예각이등변삼각형 $ABC$의 외심을 $O$, 내심을 $I$라고 하자.」
- goal: 각←stem:「$\angle OBI$의 크기는?」
- method: 내심(IMPLIED)←solution:「점 $I$는 내심이므로 $112^\circ = 90^\circ + \dfrac{1}{2}\angle A \implies \dfrac{1}{2}\angle A = 22^\circ \implies \angle A = 44^\circ$」 — 내심 공식으로 꼭지각을 구하고 외심 이등변삼각형과의 차이 계산
- condition: (없음)

**how** 각 BIC = 112도에서 각 A = 44도를 구한 뒤 외심각에서 각 OBC = 46도, 내심선에서 각 IBC = 34도를 빼어 각 OBI = 12도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $I$는 내심이므로 $112^\circ = 90^\circ + \dfrac{1}{2}\angle A \implies \dfrac{1}{2}\angle A = 22^\circ \implies \angle A = 44^\circ$ $\overline{AB} = \overline{AC}$이므로 $\angle ABC = \dfrac{180^\circ - 44^\circ}{2} = 68^\circ$ $\overline{BI}$는 $\angle ABC$의 이등분선이므로 $\angle IBC = \dfrac{68^\circ}{2} = 34^\circ$ 점 $O$는 외심이므로 $\angle BOC = 2\angle A = 88^\circ$ $\overline{OB} = \overline{OC}$이므로 $\angle OBC = \dfrac{180^\circ - 88^\circ}{2} = 46^\circ$ $\therefore \angle OBI = \angle OBC - \angle IBC = 46^\circ - 34^\circ = 12^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

다음 활동을 보고 <보기> 중 옳은 것만을 있는 대로 고른 것은? (1) 두 꼭짓점 $A$, $B$가 겹치도록 접었다가 펼쳐 변 $AB$의 수직이등분선을 만든다. (2) 같은 방법으로 변 $BC$의 수직이등분선을 만든다. (3) 만들어진 두 선분의 교점을 $O$라고 한다. 〈보기〉 ㄱ. $\overline{AO} = \overline{BO} = \overline{CO}$ ㄴ. 점 $O$는 $\triangle ABC$의 세 각의 이등분선의 교점이다. ㄷ. $\angle A = 54^\circ$이면 $\angle BOC = 108^\circ$이다. ㄹ. $\triangle ABC$가 정삼각형이면 점 $O$는 $\triangle ABC$의 내심과 같다.

**보기** ① ㄱ, ㄷ, ㄹ  ② ㄱ, ㄴ, ㄷ  ③ ㄱ, ㄴ, ㄹ  ④ ㄴ, ㄷ, ㄹ  ⑤ ㄱ, ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 변 AB, BC의 수직이등분선의 교점 O는 삼각형 ABC의 외심이다.
2. ㄱ: 외심에서 세 꼭짓점에 이르는 거리는 같으므로 AO = BO = CO이다. (참)
3. ㄴ: 세 각의 이등분선의 교점은 내심이므로 거짓이다.
4. ㄷ: 외심에서 중심각 BOC = 2 * 각 A = 2 * 54도 = 108도이다. (참)
5. ㄹ: 정삼각형은 외심과 내심이 일치하므로 점 O는 내심과 같다. (참)
6. 따라서 옳은 것은 ㄱ, ㄷ, ㄹ이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「만들어진 두 선분의 교점을 $O$라고 한다.」
**RPM** M2-RPM-184 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] (원천과 같음)
- 이유: 변 AB, BC의 수직이등분선의 교점인 외심 O의 성질과 각 BOC = 108도를 판정하는 수직이등분선과 외심 유형이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER
- 이유: 삼각형 ABC의 두 변의 수직이등분선의 교점 O가 외심임을 파악하고 외심의 꼭짓점 거리와 각 성질을 검토하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수직이등분선 교점으로 외심 O를 정의하고 외심에서 각 BOC = 108도 등 기본 성질 4가지를 검토하므로 난이도 2이다.

**4칸**
- given: 수직이등분선←stem:「두 꼭짓점 $A$, $B$가 겹치도록 접었다가 펼쳐 변 $AB$의 수직이등분선을 만든다.」
- goal: 외심←solution:「세 변의 수직이등분선의 교점 $O$는 $\triangle ABC$의 외심이다.」
- method: 외심(IMPLIED)←solution:「외심에서 세 꼭짓점까지의 거리는 같으므로 $\overline{AO} = \overline{BO} = \overline{CO}$이다.」 — 외심의 정의와 성질 감사 적용
- condition: (없음)

**how** 변 AB, BC의 수직이등분선의 교점 O가 외심임을 알고 거리 AO = BO = CO ㄱ, 각 BOC = 108도 ㄷ, 정삼각형 일치 ㄹ이 참임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

세 변의 수직이등분선의 교점 $O$는 $\triangle ABC$의 외심이다. ㄱ. 외심에서 세 꼭짓점까지의 거리는 같으므로 $\overline{AO} = \overline{BO} = \overline{CO}$이다. (참) ㄴ. 세 각의 이등분선의 교점은 내심이다. (거짓) ㄷ. $\angle BOC = 2\angle A = 2 \times 54^\circ = 108^\circ$이다. (참) ㄹ. 정삼각형은 외심과 내심이 일치한다. (참) $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

$\triangle ABC$의 내심 $I$를 지나고 변 $BC$에 평행한 직선이 변 $AB$, 변 $AC$와 만나는 점을 각각 $D$, $E$라고 하자. $\overline{AD} = 9$, $\overline{DI} = 5$, $\overline{AE} = 11$, $\overline{IE} = 7$일 때, $\overline{AB} + \overline{AC}$의 길이는?

**보기** ① $24$  ② $26$  ③ $28$  ④ $30$  ⑤ $32$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. DE와 BC가 평행하고 BI가 각 B의 이등분선이므로 엇각에 의해 각 DIB = 각 DBI이다. 따라서 삼각형 DBI는 DB = DI = 5인 이등변삼각형이다.
2. 마찬가지로 CI가 각 C의 이등분선이므로 엇각에 의해 삼각형 EIC는 EC = IE = 7인 이등변삼각형이다.
3. AB = AD + DB = 9 + 5 = 14이다.
4. AC = AE + EC = 11 + 7 = 18이다.
5. 따라서 AB + AC = 14 + 18 = 32이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$의 내심 $I$를 지나고 변 $BC$에 평행한 직선이 변 $AB$, 변 $AC$와 만나는 점을 각각 $D$, $E$라고 하자.」
**RPM** M2-RPM-186 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] (원천과 같음)
- 이유: 내심 I를 지나는 평행선 DE와 변 AB, AC에서 이등변삼각형 성질로 AB + AC = 32를 구하는 내심 유형이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER
- 이유: 삼각형 ABC 내심을 지나는 평행선과 각의 이등분선이 만드는 이등변삼각형 성질로 변 AB, AC의 길이를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행선과 각의 이등분선에 의해 DB = 5, EC = 7임을 찾아 AB + AC = 32를 산출하므로 난이도 2이다.

**4칸**
- given: 내심←stem:「$\triangle ABC$의 내심 $I$를 지나고 변 $BC$에 평행한 직선이 변 $AB$, 변 $AC$와 만나는 점을 각각 $D$, $E$라고 하자.」
- goal: 내심←solution:「$\overline{DE} \parallel \overline{BC}$이고 $\overline{BI}$가 $\angle B$의 이등분선이므로」
- method: 이등변삼각형(IMPLIED)←solution:「따라서 $\triangle DBI$는 이등변삼각형이므로 $\overline{DB} = \overline{DI} = 5$」 — 평행선과 각의 이등분선으로 만들어지는 이등변삼각형 성질 적용
- condition: (없음)

**how** 내심 I를 지나는 평행선에서 이등변삼각형 DBI와 ECI를 찾아 DB = 5, EC = 7로 두고 AB + AC = 32임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{DE} \parallel \overline{BC}$이고 $\overline{BI}$가 $\angle B$의 이등분선이므로 $\angle DBI = \angle IBC = \angle DIB$ (엇각) 따라서 $\triangle DBI$는 이등변삼각형이므로 $\overline{DB} = \overline{DI} = 5$ 마찬가지로 $\angle ECI = \angle ICB = \angle EIC$이므로 $\overline{EC} = \overline{IE} = 7$ $\overline{AB} = \overline{AD} + \overline{DB} = 9 + 5 = 14$ $\overline{AC} = \overline{AE} + \overline{EC} = 11 + 7 = 18$ $\therefore \overline{AB} + \overline{AC} = 14 + 18 = 32$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 3점


**발문**

평행사변형 $ABCD$에서 $\overline{AB} = 2x - 1$, $\overline{CD} = 9$, $\overline{BC} = y + 3$, $\overline{AD} = 11$일 때, $x + y$의 값은?

**보기** ① $10$  ② $12$  ③ $13$  ④ $14$  ⑤ $15$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 ABCD에서 두 쌍의 대변의 길이는 각각 같다.
2. AB = CD이므로 2x - 1 = 9에서 2x = 10, x = 5이다.
3. AD = BC이므로 y + 3 = 11에서 y = 8이다.
4. 따라서 x + y = 5 + 8 = 13이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 $\overline{AB} = 2x - 1$, $\overline{CD} = 9$, $\overline{BC} = y + 3$, $\overline{AD} = 11$일 때」
**RPM** M2-RPM-190 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 ABCD의 대변 AB = CD와 AD = 11, BC = y + 3으로부터 x, y를 구하는 평행사변형 변의 성질 유형이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 평행사변형 ABCD의 두 쌍의 대변의 길이가 각각 같음을 이용하여 AB, CD와 AD, BC 식을 풀어 x + y를 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형의 대변 AB = CD와 AD = 11을 일차방정식으로 바로 해결하는 기본 계산이므로 난이도 1이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 $\overline{AB} = 2x - 1$, $\overline{CD} = 9$, $\overline{BC} = y + 3$, $\overline{AD} = 11$일 때」
- goal: 선분←stem:「$x + y$의 값은?」
- method: 선분(IMPLIED)←solution:「평행사변형의 두 쌍의 대변의 길이는 각각 같으므로」 — 평행사변형 대변의 길이가 같다는 성질 적용
- condition: (없음)

**how** 평행사변형 ABCD에서 대변의 길이가 같음을 이용하여 2x - 1 = 9에서 x = 5, y + 3 = 11에서 y = 8을 구해 x + y = 13으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형의 두 쌍의 대변의 길이는 각각 같으므로 $2x - 1 = 9 \implies 2x = 10 \implies x = 5$ $y + 3 = 11 \implies y = 8$ $\therefore x + y = 5 + 8 = 13$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 $\square ABCD$가 평행사변형인 것을 모두 고르면? (정답 2개, 단 점 $O$는 두 대각선의 교점)

**보기** ① $\overline{AB} = \overline{DC} = 5\text{ cm},\ \overline{AD} = \overline{BC} = 7\text{ cm}$  ② $\overline{OA} = \overline{OB} = 5\text{ cm},\ \overline{OC} = \overline{OD} = 6\text{ cm}$  ③ $\overline{AB} \parallel \overline{DC},\ \overline{AD} = \overline{BC} = 4\text{ cm}$  ④ $\angle A = 110^\circ,\ \angle B = 70^\circ,\ \angle C = 70^\circ$  ⑤ $\angle ACB = \angle DAC = 25^\circ,\ \angle BAC = \angle ACD = 45^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1번: AB = DC = 5 cm, AD = BC = 7 cm는 두 쌍의 대변의 길이가 각각 같으므로 평행사변형이다. (참)
2. 2번: 대각선 교점 O에 대해 OA = OB, OC = OD는 서로 다른 것을 이등분하는 조건이 아니므로 평행사변형이 아니다.
3. 3번: AB와 DC가 평행하고 다른 변 AD = BC인 사각형은 등변사다리꼴일 수 있다.
4. 4번: 이웃하는 각의 합과 대각의 크기가 맞지 않다.
5. 5번: 엇각이 각각 같으므로 두 쌍의 대변 AD와 BC, AB와 DC가 각각 평행하다. (참)
6. 따라서 평행사변형인 것은 ①, ⑤이다.
- 작성자 답: ①, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $\square ABCD$가 평행사변형인 것을 모두 고르면?」
**RPM** M2-RPM-192 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 사각형 ABCD에서 대변 AB = DC = 5 cm, AD = BC = 7 cm 조건과 평행 조건을 판정하는 평행사변형 판정 유형이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: 사각형 ABCD가 평행사변형이 되는 5가지 조건을 바탕으로 대변 길이와 엇각 조건을 만족하는 보기를 판별하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사각형 ABCD에서 평행사변형이 되는 조건인 대변 AB = DC와 반례를 각각 비교하여 1번, 5번을 가려내므로 난이도 2이다.

**4칸**
- given: 평행사변형←stem:「다음 중 $\square ABCD$가 평행사변형인 것을 모두 고르면? (정답 2개, 단 점 $O$는 두 대각선의 교점)」
- goal: 평행사변형←choices:「$\overline{AB} = \overline{DC} = 5\text{ cm},\ \overline{AD} = \overline{BC} = 7\text{ cm}$」
- method: 평행사변형(IMPLIED)←solution:「두 쌍의 대변의 길이가 각각 같으므로 평행사변형이다.」 — 평행사변형이 되는 조건 감사 적용
- condition: (없음)

**how** 사각형 ABCD에서 두 쌍의 대변의 길이가 같은 1번과 두 쌍의 대변이 평행한 5번이 평행사변형임을 확인하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

① 두 쌍의 대변의 길이가 각각 같으므로 평행사변형이다. ② 두 대각선이 서로 다른 것을 이등분하지 않으므로 평행사변형이 아니다. ③ 평행한 변과 길이가 같은 변이 다르므로 등변사다리꼴일 수 있어 평행사변형이 아니다. ④ $\angle B = \angle C = 70^\circ$, $\angle A = 110^\circ$, $\angle D = 110^\circ$로 대각의 크기가 같지 않다. ⑤ 엇각이 각각 같으므로 $\overline{AD} \parallel \overline{BC}$, $\overline{AB} \parallel \overline{DC}$가 되어 평행사변형이다. $\therefore$ ①, ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

평행사변형 $ABCD$에서 $\angle A$와 $\angle B$의 크기의 비가 $5 : 7$일 때, $\angle A + \angle C$의 크기는?

**보기** ① $140^\circ$  ② $150^\circ$  ③ $160^\circ$  ④ $170^\circ$  ⑤ $180^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 ABCD에서 이웃한 두 내각의 합은 180^\circ이므로 각 A + 각 B = 180^\circ이다.
2. 각 A와 각 B의 비가 5 : 7이므로 각 A = 180^\circ * (5 / 12) = 75^\circ이다.
3. 평행사변형에서 마주 보는 대각의 크기는 같으므로 각 C = 각 A = 75^\circ이다.
4. 따라서 각 A + 각 C = 75^\circ + 75^\circ = 150^\circ이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 $\angle A$와 $\angle B$의 크기의 비가 $5 : 7$일 때」
**RPM** M2-RPM-190 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 ABCD에서 이웃한 두 내각의 합 180도와 대각의 크기가 같음을 이용해 각 A + 각 C = 150도를 구하는 유형이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 평행사변형 ABCD에서 이웃한 각의 합 180도에 비례배분을 적용해 각 A = 75도를 구하고 대각의 합을 구하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 이웃한 두 각의 합 180도와 비례배분으로 각 A = 75도를 구한 뒤 2배하여 150도를 바로 구하므로 난이도 1이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 $\angle A$와 $\angle B$의 크기의 비가 $5 : 7$일 때」
- goal: 각←stem:「$\angle A + \angle C$의 크기는?」
- method: 내각(IMPLIED)←solution:「평행사변형에서 이웃한 두 내각의 크기의 합은 $180^\circ$이므로」 — 평행사변형의 이웃한 내각의 합 180도 성질 적용
- condition: (없음)

**how** 평행사변형 ABCD에서 각 A와 B의 합이 180도임을 이용하여 각 A = 75도를 구하고 대각 각 C = 75도로부터 합이 150도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형에서 이웃한 두 내각의 크기의 합은 $180^\circ$이므로 $\angle A + \angle B = 180^\circ$ $\angle A : \angle B = 5 : 7$이므로 $\angle A = 180^\circ \times \dfrac{5}{5 + 7} = 180^\circ \times \dfrac{5}{12} = 75^\circ$ 마주 보는 각의 크기가 같으므로 $\angle C = \angle A = 75^\circ$ $\therefore \angle A + \angle C = 75^\circ + 75^\circ = 150^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

평행사변형 $ABCD$의 네 내각의 이등분선이 서로 만나 이루는 사각형 $EFGH$에 대한 설명으로 옳지 않은 것은? (단, $\square ABCD$는 마름모가 아니다.)

**보기** ① 네 내각의 크기가 모두 $90^\circ$이다.  ② 두 대각선의 길이가 서로 같다.  ③ 두 대각선이 서로 수직으로 만난다.  ④ 두 쌍의 대변의 길이가 각각 같다.  ⑤ 두 쌍의 대각의 크기의 합이 각각 $180^\circ$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형 ABCD의 이웃한 두 내각의 합은 180^\circ이므로 각 이등분선이 이루는 각은 180/2 = 90^\circ이다.
2. 따라서 사각형 EFGH의 네 내각은 모두 90^\circ이므로 사각형 EFGH는 직사각형이다.
3. 직사각형은 두 대각선의 길이가 서로 같지만, 정사각형이 아닌 이상 두 대각선이 서로 수직으로 만나지 않는다.
4. 따라서 옳지 않은 것은 3번 두 대각선이 서로 수직으로 만난다이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$의 네 내각의 이등분선이 서로 만나 이루는 사각형 $EFGH$에 대한 설명으로 옳지 않은 것은?」
**RPM** M2-RPM-196 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 평행사변형 ABCD의 네 내각 이등분선이 만드는 직사각형 EFGH의 성질(각 90도, 대각선)을 판별하는 사각형의 성질 유형이다.
**유형** PT=PT_MG_PARALLELOGRAM_ANGLE_BISECTORS_RECTANGLE / TPL=TPL_MG_EVALUATE_RECTANGLE_FORMED_BY_PARALLELOGRAM_BISECTORS
- 이유: 평행사변형 ABCD의 내각 이등분선 교각이 90도임을 유도하여 사각형 EFGH가 직사각형임을 밝히고 대각선 수직 여부를 판정하는 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이웃한 각의 합 180도의 반인 90도로 직사각형임을 추론하고 직사각형의 대각선 성질을 점검하므로 난이도 2이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$의 네 내각의 이등분선이 서로 만나 이루는 사각형 $EFGH$에 대한 설명으로 옳지 않은 것은?」
- goal: 직사각형←solution:「따라서 $\square EFGH$의 네 내각이 모두 $90^\circ$이므로 $\square EFGH$는 직사각형이다.」
- method: 대각선(IMPLIED)←solution:「직사각형은 두 대각선의 길이가 같지만, 정사각형이 아닌 이상 두 대각선이 서로 수직으로 만나지 않는다.」 — 직사각형의 대각선 성질 대조
- condition: (없음)

**how** 평행사변형 ABCD의 각 이등분선 교점 사각형 EFGH가 네 각이 90도인 직사각형임을 밝히고 대각선이 수직이라는 3번이 거짓임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형의 이웃한 두 내각의 합이 $180^\circ$이므로 두 내각의 이등분선이 이루는 각은 $\dfrac{180^\circ}{2} = 90^\circ$이다. 따라서 $\square EFGH$의 네 내각이 모두 $90^\circ$이므로 $\square EFGH$는 직사각형이다. 직사각형은 두 대각선의 길이가 같지만, 정사각형이 아닌 이상 두 대각선이 서로 수직으로 만나지 않는다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

다음 <보기>의 사각형 중에서 두 대각선의 길이가 같은 것의 개수를 $a$, 두 대각선이 서로 수직인 것의 개수를 $b$, 두 대각선이 서로 다른 것을 이등분하는 것의 개수를 $c$라 할 때, $a + b + c$의 값은? 〈보기〉 ㄱ. 평행사변형　ㄴ. 직사각형　ㄷ. 마름모　ㄹ. 정사각형　ㅁ. 등변사다리꼴

**보기** ① $6$  ② $7$  ③ $8$  ④ $9$  ⑤ $10$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 대각선의 길이가 같은 사각형은 직사각형, 정사각형, 등변사다리꼴로 a = 3개이다.
2. 두 대각선이 서로 수직인 사각형은 마름모, 정사각형으로 b = 2개이다.
3. 두 대각선이 서로 다른 것을 이등분하는 사각형은 평행사변형, 직사각형, 마름모, 정사각형으로 c = 4개이다.
4. 따라서 a + b + c = 3 + 2 + 4 = 9이며 보기 10 미만의 값이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 <보기>의 사각형 중에서 두 대각선의 길이가 같은 것의 개수를 $a$」
**RPM** M2-RPM-197 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 성질 비교 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질**
- 이유: 보기 5개 사각형 중 대각선 길이, 수직, 이등분 성질을 분류하여 보기 10 미만의 합 a + b + c = 9를 산출하는 특수 사각형 대각선 성질 유형이다.
**유형** PT=PT_MG_QUADRILATERALS_DIAGONAL_EQUAL_LENGTH / TPL=TPL_MG_COUNT_QUADRILATERALS_WITH_EQUAL_DIAGONALS
- 이유: 평행사변형, 직사각형, 마름모, 정사각형, 등변사다리꼴에서 대각선 성질별 개수를 세어 합 9(보기 10 이하)를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 사각형의 대각선 성질을 각각 분류하여 합 9(보기 10 이하)를 구하는 3단계 분류이므로 난이도 2이다.

**4칸**
- given: 사다리꼴←stem:「ㄱ. 평행사변형　ㄴ. 직사각형　ㄷ. 마름모　ㄹ. 정사각형　ㅁ. 등변사다리꼴」
- goal: 대각선←stem:「$a + b + c$의 값은?」
- method: 마름모(IMPLIED)←solution:「두 대각선이 서로 수직인 사각형: ㄷ(마름모), ㄹ(정사각형) $\implies b = 2$」 — 특수 사각형별 대각선 성질 분류 및 개수 합산
- condition: (없음)

**how** 대각선 길이가 같은 사각형 3개, 수직인 사각형 2개, 이등분하는 사각형 4개를 분류하여 합 9(10 미만)임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 대각선의 길이가 같은 사각형: ㄴ(직사각형), ㄹ(정사각형), ㅁ(등변사다리꼴) $\implies a = 3$ 두 대각선이 서로 수직인 사각형: ㄷ(마름모), ㄹ(정사각형) $\implies b = 2$ 두 대각선이 서로 다른 것을 이등분하는 사각형: ㄱ(평행사변형), ㄴ(직사각형), ㄷ(마름모), ㄹ(정사각형) $\implies c = 4$ $\therefore a + b + c = 3 + 2 + 4 = 9$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 3점


**발문**

직사각형 $ABCD$의 두 대각선의 교점을 $O$라 할 때, $\overline{AC} = 5x + 4$, $\overline{BO} = 4x - 1$이다. 이때 대각선 $\overline{AC}$의 길이는?

**보기** ① $12$  ② $14$  ③ $16$  ④ $18$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직사각형 ABCD의 두 대각선은 길이가 같고 서로 다른 것을 이등분하므로 AC = BD = 2 * BO이다.
2. 5x + 4 = 2(4x - 1) = 8x - 2이므로 3x = 6에서 x = 2이다.
3. 따라서 대각선 AC = 5(2) + 4 = 14이다.
4. 따라서 정답은 ② 14이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「직사각형 $ABCD$의 두 대각선의 교점을 $O$라 할 때」
**RPM** M2-RPM-197 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] (원천과 같음)
- 이유: 직사각형 ABCD의 대각선 AC와 선분 BO = 4x - 1로부터 대각선 길이 14를 구하는 특수 사각형 대각선 성질 유형이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 직사각형 ABCD의 두 대각선의 길이가 같고 서로를 이등분하는 성질로 AC = 2 BO 방정식을 풀어 길이를 산출하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직사각형의 대각선 성질 AC = 2 BO를 일차방정식으로 풀어 길이 14를 바로 구하므로 난이도 1이다.

**4칸**
- given: 직사각형←stem:「직사각형 $ABCD$의 두 대각선의 교점을 $O$라 할 때, $\overline{AC} = 5x + 4$, $\overline{BO} = 4x - 1$이다.」
- goal: 대각선←stem:「이때 대각선 $\overline{AC}$의 길이는?」
- method: 대각선(IMPLIED)←solution:「직사각형의 두 대각선은 길이가 같고 서로 다른 것을 이등분하므로」 — 직사각형 대각선의 성질과 길이 관계 적용
- condition: (없음)

**how** 직사각형 ABCD의 두 대각선 성질 AC = 2 BO로부터 5x + 4 = 8x - 2를 풀어 x = 2를 구하고 AC = 14로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형의 두 대각선은 길이가 같고 서로 다른 것을 이등분하므로 $\overline{AC} = \overline{BD} = 2\overline{BO}$이다. $5x + 4 = 2(4x - 1)$ $5x + 4 = 8x - 2 \implies 3x = 6 \implies x = 2$ $\therefore \overline{AC} = 5(2) + 4 = 14$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점


**발문**

정사각형 $ABCD$에서 점 $E$가 정사각형의 외부에 있고 $\overline{CD} = \overline{CE}$, $\angle DCE = 26^\circ$, $\angle BCE = 116^\circ$일 때, $\angle BED$의 크기는?

**보기** ① $35^\circ$  ② $40^\circ$  ③ $45^\circ$  ④ $50^\circ$  ⑤ $55^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 정사각형 ABCD에서 BC = CD이고 조건에서 CD = CE이므로 BC = CE이다.
2. 삼각형 CDE는 CD = CE인 이등변삼각형이므로 각 DEC = (180도 - 26도) / 2 = 77도이다.
3. 삼각형 BCE는 BC = CE인 이등변삼각형이고 각 BCE = 116도이므로 각 BEC = (180도 - 116도) / 2 = 32도이다.
4. 따라서 각 BED = 각 DEC - 각 BEC = 77도 - 32도 = 45도이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「정사각형 $ABCD$에서 점 $E$가 정사각형의 외부에 있고」
**RPM** M2-RPM-196 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 정사각형 ABCD와 선분 CD = CE 조건에서 각 DCE = 26도, BCE = 116도를 이용해 각 BED = 45도를 구하는 정사각형 성질 유형이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 정사각형 ABCD의 변의 길이와 이등변삼각형 CDE, BCE의 밑각 성질을 연계하여 각 BED의 크기를 산출하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정사각형에서 변의 일치로 두 이등변삼각형 CDE, BCE를 찾고 각 DCE, BCE로부터 각의 차 45도를 계산하므로 난이도 3이다.

**4칸**
- given: 정사각형←stem:「정사각형 $ABCD$에서 점 $E$가 정사각형의 외부에 있고 $\overline{CD} = \overline{CE}$」
- goal: 각←stem:「$\angle BED$의 크기는?」
- method: 정사각형(IMPLIED)←solution:「정사각형이므로 $\overline{BC} = \overline{CD}$이고 조건에서 $\overline{CD} = \overline{CE}$이므로 $\overline{BC} = \overline{CE}$이다.」 — 정사각형의 변의 길이와 이등변삼각형 밑각 성질 적용
- condition: (없음)

**how** 정사각형 ABCD의 변의 길이로 이등변삼각형 CDE(밑각 77도)와 BCE(밑각 32도)를 찾아 각 BED = 77 - 32 = 45도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

정사각형이므로 $\overline{BC} = \overline{CD}$이고 조건에서 $\overline{CD} = \overline{CE}$이므로 $\overline{BC} = \overline{CE}$이다. $\triangle CDE$는 $\overline{CD} = \overline{CE}$인 이등변삼각형이므로 $\angle DEC = \dfrac{180^\circ - 26^\circ}{2} = 77^\circ$ $\triangle BCE$는 $\overline{BC} = \overline{CE}$인 이등변삼각형이므로 $\angle BEC = \dfrac{180^\circ - 116^\circ}{2} = 32^\circ$ $\therefore \angle BED = \angle DEC - \angle BEC = 77^\circ - 32^\circ = 45^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점


**발문**

마름모 $ABCD$의 꼭짓점 $A$에서 변 $CD$에 내린 수선의 발을 $E$라고 하고, 선분 $AE$와 대각선 $BD$의 교점을 $F$라고 하자. $\angle AFD = 118^\circ$일 때, $\angle ACB$의 크기는?

**보기** ① $62^\circ$  ② $56^\circ$  ③ $58^\circ$  ④ $64^\circ$  ⑤ $68^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 각 AFD = 118도이므로 각 DFE = 180도 - 118도 = 62도이다.
2. 직각삼각형 DEF에서 각 FDE = 90도 - 62도 = 28도이다.
3. 마름모의 대각선 BD는 각 ADC를 이등분하므로 각 ADC = 2 * 28도 = 56도이다.
4. 이웃한 각의 합이 180도이므로 각 BCD = 180도 - 56도 = 124도이고, 대각선 AC가 이를 이등분하므로 각 ACB = 124/2 = 62도이다.
5. 따라서 정답은 ① 62도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$의 꼭짓점 $A$에서 변 $CD$에 내린 수선의 발을 $E$라고 하고」
**RPM** M2-RPM-196 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: 마름모 ABCD의 수선의 발 E와 대각선 BD의 교각 AFD = 118도로부터 각 ACB = 62도를 구하는 마름모의 성질 유형이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 마름모 ABCD에서 수선의 발과 대각선 BD가 이루는 각 AFD = 118도를 추적하여 각 ACB를 도출하는 특수 사각형 성질 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각삼각형 DEF의 각과 마름모 대각선의 각 이등분 성질을 연쇄적으로 거쳐 각 ACB = 62도를 구하므로 난이도 3이다.

**4칸**
- given: 마름모←stem:「마름모 $ABCD$의 꼭짓점 $A$에서 변 $CD$에 내린 수선의 발을 $E$라고 하고」
- goal: 각←stem:「$\angle ACB$의 크기는?」
- method: 마름모(IMPLIED)←solution:「마름모의 대각선 $BD$는 $\angle ADC$를 이등분하므로」 — 마름모 대각선의 내각 이등분 성질 적용
- condition: (없음)

**how** 마름모 ABCD에서 각 AFD = 118도로부터 각 FDE = 28도를 구하고 대각선 이등분 성질로 각 BCD = 124도에서 각 ACB = 62도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle AFD = 118^\circ$이므로 $\angle DFE = 180^\circ - 118^\circ = 62^\circ$ 직각삼각형 $DEF$에서 $\angle DEF = 90^\circ$이므로 $\angle BDC = \angle FDE = 90^\circ - 62^\circ = 28^\circ$ 마름모의 대각선 $BD$는 $\angle ADC$를 이등분하므로 $\angle ADC = 2 \times 28^\circ = 56^\circ$ $\overline{AD} \parallel \overline{BC}$이므로 $\angle BCD = 180^\circ - 56^\circ = 124^\circ$ 대각선 $AC$가 $\angle BCD$를 이등분하므로 $\angle ACB = \dfrac{124^\circ}{2} = 62^\circ$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

$\triangle ABC \sim \triangle DEF$이고 $\angle A = 42^\circ$, $\angle F = 105^\circ$, $\overline{BC} = 9\text{ cm}$, $\overline{EF} = 12\text{ cm}$일 때, 다음 중 옳은 것은?

**보기** ① $\angle E$의 크기는 $42^\circ$이다.  ② $\angle C$의 크기는 $33^\circ$이다.  ③ $\overline{AC} : \overline{DF} = 4 : 3$이다.  ④ $\triangle ABC$와 $\triangle DEF$의 닮음비는 $3 : 4$이다.  ⑤ $\triangle ABC$와 $\triangle DEF$의 닮음비는 $4 : 3$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형 ABC와 DEF가 닮음이므로 대응점은 A와 D, B와 E, C와 F이다.
2. 각 D = 각 A = 42도, 각 C = 각 F = 105도이므로 각 E = 180도 - (42도 + 105도) = 33도이다.
3. 대응변 BC와 EF의 길이의 비는 9 : 12 = 3 : 4이므로 닮음비는 3 : 4이다.
4. 따라서 옳은 것은 4번 닮음비는 3 : 4이다이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC \sim \triangle DEF$이고 $\angle A = 42^\circ$, $\angle F = 105^\circ$」
**RPM** M2-RPM-203 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 대응변·대응각] (원천과 같음)
- 이유: 닮은 삼각형 ABC, DEF에서 각 42도, 105도와 대응변 BC, EF의 길이로부터 닮음비 3:4를 판정하는 대응변·대응각 유형이다.
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_CORRESPONDENCE_STATEMENT_JUDGMENT
- 이유: 삼각형 ABC와 DEF의 닮음 관계에서 대응각과 대응변의 비를 각각 점검하여 옳은 진술을 가려내는 닮은 도형 진술 판정 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 ABC와 DEF의 대응변 9:12 = 3:4 약분으로 닮음비를 바로 구하는 기본 문항이므로 난이도 1이다.

**4칸**
- given: 닮음←stem:「$\triangle ABC \sim \triangle DEF$이고 $\angle A = 42^\circ$, $\angle F = 105^\circ$, $\overline{BC} = 9\text{ cm}$, $\overline{EF} = 12\text{ cm}$일 때」
- goal: 닮음비←choices:「$\triangle ABC$와 $\triangle DEF$의 닮음비는 $3 : 4$이다.」
- method: 대응변(IMPLIED)←solution:「대응변 $\overline{BC}$와 $\overline{EF}$의 길이의 비는 $9 : 12 = 3 : 4$이므로 닮음비는 $3 : 4$이다.」 — 대응변의 길이비로부터 닮음비 도출
- condition: (없음)

**how** 삼각형 ABC와 DEF의 대응변 BC와 EF의 비 9:12 = 3:4로부터 닮음비가 3:4임을 기본 정의로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC \sim \triangle DEF$에서 대응점은 $A \leftrightarrow D$, $B \leftrightarrow E$, $C \leftrightarrow F$이다. 따라서 $\angle D = \angle A = 42^\circ$, $\angle C = \angle F = 105^\circ$이고 $\angle E = \angle B = 180^\circ - (42^\circ + 105^\circ) = 33^\circ$이다. 대응변 $\overline{BC}$와 $\overline{EF}$의 길이의 비는 $9 : 12 = 3 : 4$이므로 닮음비는 $3 : 4$이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\triangle ABC \sim \triangle DEF$이고 $\overline{AB} = 6\text{ cm}$, $\overline{DE} = 10\text{ cm}$이다. $\triangle DEF$의 넓이가 $75\text{ cm}^2$일 때, $\triangle ABC$의 넓이는?

**보기** ① $18\text{ cm}^2$  ② $21\text{ cm}^2$  ③ $24\text{ cm}^2$  ④ $25\text{ cm}^2$  ⑤ $27\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형 ABC와 DEF의 닮음비는 대응변 AB : DE = 6 : 10 = 3 : 5이다.
2. 닮은 도형의 넓이의 비는 닮음비의 제곱의 비이므로 3^2 : 5^2 = 9 : 25이다.
3. 삼각형 DEF의 넓이가 75 cm^2이므로 삼각형 ABC의 넓이는 75 * (9 / 25) = 27 cm^2이다.
4. 따라서 정답은 ⑤ 27 cm^2이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC \sim \triangle DEF$이고 $\overline{AB} = 6\text{ cm}$, $\overline{DE} = 10\text{ cm}$이다.」
**RPM** M2-RPM-208 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비] (원천과 같음)
- 이유: 대응변 AB = 6 cm, DE = 10 cm의 닮음비로부터 넓이의 비 9:25를 세워 넓이 27 cm^2를 구하는 닮음 넓이비 유형이다.
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_AREA_VOLUME
- 이유: 닮은 삼각형 ABC, DEF의 대응변으로 닮음비 3:5를 구하고 넓이비 9:25를 적용해 삼각형 ABC의 넓이를 산출하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대응변 길이비 3:5를 제곱하여 넓이비 9:25를 유도하고 75 cm^2에 비례배분하므로 난이도 2이다.

**4칸**
- given: 닮음←stem:「$\triangle ABC \sim \triangle DEF$이고 $\overline{AB} = 6\text{ cm}$, $\overline{DE} = 10\text{ cm}$이다.」
- goal: 넓이←stem:「$\triangle DEF$의 넓이가 $75\text{ cm}^2$일 때, $\triangle ABC$의 넓이는?」
- method: 넓이(IMPLIED)←solution:「넓이의 비는 $3^2 : 5^2 = 9 : 25$이므로」 — 닮은 도형의 넓이비는 닮음비의 제곱의 비임을 적용
- condition: (없음)

**how** 대응변 AB와 DE의 비 6:10 = 3:5에서 넓이비 9:25를 유도하여 삼각형 DEF 넓이 75 cm^2로부터 삼각형 ABC 넓이 27 cm^2임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$와 $\triangle DEF$의 닮음비는 $\overline{AB} : \overline{DE} = 6 : 10 = 3 : 5$이다. 넓이의 비는 $3^2 : 5^2 = 9 : 25$이므로 $\triangle ABC$의 넓이 $= 75 \times \dfrac{9}{25} = 27\text{ (cm}^2\text{)}$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 단답형 5점


**발문**

$\angle B = 90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$, 점 $D$에서 변 $AC$에 내린 수선의 발을 $E$라고 하자. $\overline{AB} = 24$, $\overline{AC} = 30$, $\overline{BD} = 8$일 때, $\triangle DEC$의 넓이를 구하시오. (단, 삼각형의 합동을 이용할 것)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $24$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직각삼각형 ABD와 AED에서 각 B = 각 AED = 90도, 선분 AD는 공통, 각 BAD = 각 EAD이므로 삼각형 ABD와 AED는 RHA 합동이다.
2. 합동에 의해 AE = AB = 24, DE = BD = 8이다.
3. EC = AC - AE = 30 - 24 = 6이다.
4. 따라서 직각삼각형 DEC의 넓이는 (1/2) * EC * DE = (1/2) * 6 * 8 = 24이다.
- 작성자 답: $24$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle B = 90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$」
**RPM** M2-RPM-181 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] (원천과 같음)
- 이유: 각 B = 90도 직각삼각형 ABC에서 각의 이등분선에 의한 RHA 합동으로 선분 길이 24를 구하고 넓이 24를 산출하는 직각삼각형 합동 유형이다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE
- 이유: 직각 90도와 각의 이등분선 조건으로 삼각형 ABD와 AED의 RHA 합동을 증명하고 삼각형 DEC의 넓이를 구하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수선의 발에 의한 RHA 합동을 유도하고 선분 EC = 6을 구하여 넓이 24를 서술형으로 계산하므로 난이도 3이다.

**4칸**
- given: 직각삼각형←stem:「$\angle B = 90^\circ$인 직각삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$」<br>수선의발←stem:「점 $D$에서 변 $AC$에 내린 수선의 발을 $E$라고 하자.」
- goal: 직각삼각형←stem:「$\triangle DEC$의 넓이를 구하시오. (단, 삼각형의 합동을 이용할 것)」
- method: 합동(IMPLIED)←solution:「$\triangle ABD \equiv \triangle AED$ ($\text{RHA}$ 합동)」 — RHA 직각삼각형 합동조건 적용
- condition: (없음)

**how** 각 B = 90도에서 삼각형 ABD와 AED가 RHA 합동임을 보이고 AE = 24, DE = 8로부터 EC = 6을 찾아 삼각형 DEC의 넓이 24임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직각삼각형 $ABD$와 직각삼각형 $AED$에서 $\angle ABD = \angle AED = 90^\circ$, $\angle BAD = \angle EAD$, $\overline{AD}$는 공통이므로 $\triangle ABD \equiv \triangle AED$ ($\text{RHA}$ 합동) 따라서 $\overline{AE} = \overline{AB} = 24$, $\overline{DE} = \overline{BD} = 8$ $\overline{EC} = \overline{AC} - \overline{AE} = 30 - 24 = 6$ $\therefore \triangle DEC$의 넓이 $= \dfrac{1}{2} \times \overline{EC} \times \overline{DE} = \dfrac{1}{2} \times 6 \times 8 = 24$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 단답형 5점


**발문**

$\overline{AB} = 10$, $\overline{BC} = 17$, $\overline{CA} = 9$이고 넓이가 $36$인 $\triangle ABC$의 내심을 $I$라고 할 때, $\triangle ABC$의 내접원의 넓이를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $4\pi$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 삼각형 ABC의 둘레는 AB + BC + CA = 10 + 17 + 9 = 36이다.
2. 내접원의 반지름을 r이라 하면 삼각형 ABC의 넓이는 (1/2) * r * (10 + 17 + 9) = 18r이다.
3. 넓이가 36이므로 18r = 36에서 r = 2이다.
4. 따라서 내접원의 넓이는 \pi * 2^2 = 4\pi이다.
- 작성자 답: $4\pi$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = 10$, $\overline{BC} = 17$, $\overline{CA} = 9$이고 넓이가 $36$인 $\triangle ABC$의 내심을 $I$라고 할 때」
**RPM** M2-RPM-188 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산] **원천→판정: 삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 내심과 거리 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산**
- 이유: 변 AB = 10, BC = 17, CA = 9와 넓이 36으로부터 내접원 반지름 r = 2를 구하고 넓이 4\pi를 계산하는 내접원 활용 유형이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CENTERS_INCIRCLE
- 이유: 삼각형 ABC의 세 변의 길이와 넓이 36을 내접원 반지름 공식 S = (1/2)r(a+b+c)에 대입하여 내접원의 넓이를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 ABC 둘레 36과 넓이 36으로부터 반지름 r = 2를 찾고 원의 넓이 4\pi를 산출하므로 난이도 2이다.

**4칸**
- given: 내심←stem:「$\overline{AB} = 10$, $\overline{BC} = 17$, $\overline{CA} = 9$이고 넓이가 $36$인 $\triangle ABC$의 내심을 $I$라고 할 때」
- goal: 내접원←stem:「$\triangle ABC$의 내접원의 넓이를 구하시오.」
- method: 반지름(IMPLIED)←solution:「내접원의 반지름의 길이를 $r$이라 하면 내심 $I$에서 세 변까지의 거리는 모두 $r$이다.」 — 내접원 반지름과 삼각형 둘레를 이용한 넓이 공식 적용
- condition: (없음)

**how** 삼각형 ABC의 둘레 36과 넓이 36에서 18r = 36으로 반지름 r = 2를 구한 뒤 내접원의 넓이가 4\pi임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

내접원의 반지름의 길이를 $r$이라 하면 내심 $I$에서 세 변까지의 거리는 모두 $r$이다. $\triangle ABC$의 넓이 $= \triangle ABI + \triangle BCI + \triangle CAI$ $36 = \dfrac{1}{2}(10 + 17 + 9)r = \dfrac{1}{2} \times 36 \times r = 18r$ $r = 2$ 따라서 내접원의 넓이는 $\pi \times 2^2 = 4\pi$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 5점


**발문**

정사각형 $ABCD$의 대각선 $AC$ 위의 한 점 $P$에 대하여 $\angle BPC = 62^\circ$일 때, $\angle PDC$의 크기를 구하시오. (단, 삼각형의 합동을 이용할 것)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $73^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. A, P, C가 대각선 위에 있으므로 각 APB = 180도 - 62도 = 118도이다.
2. 정사각형의 대각선 AC에 의해 각 BAP = 각 DAP = 45도이다.
3. 삼각형 ABP에서 각 ABP = 180도 - (45도 + 118도) = 17도이다.
4. 삼각형 ABP와 ADP는 AB = AD, 각 BAP = 각 DAP = 45도, AP 공통으로 SAS 합동이다.
5. 따라서 각 ADP = 각 ABP = 17도이므로 각 PDC = 90도 - 17도 = 73도이다.
- 작성자 답: $73^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「정사각형 $ABCD$의 대각선 $AC$ 위의 한 점 $P$에 대하여」
**RPM** M2-RPM-196 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 정사각형 ABCD 대각선 AC 위의 점 P와 각 BPC = 62도로부터 대칭 합동으로 각 PDC = 73도를 구하는 정사각형 성질 유형이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS
- 이유: 정사각형 ABCD의 대각선에 대칭인 삼각형 ABP와 ADP의 SAS 합동을 이용하여 각 PDC를 서술형으로 산출하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대각선에 대칭인 두 삼각형의 SAS 합동을 증명하고 각 APB = 118도로부터 각 PDC = 73도를 유도하므로 난이도 3이다.

**4칸**
- given: 정사각형←stem:「정사각형 $ABCD$의 대각선 $AC$ 위의 한 점 $P$에 대하여 $\angle BPC = 62^\circ$일 때」
- goal: 대각선←stem:「$\angle PDC$의 크기를 구하시오. (단, 삼각형의 합동을 이용할 것)」
- method: 합동(IMPLIED)←solution:「$\triangle ABP \equiv \triangle ADP$ ($\text{SAS}$ 합동)」 — 정사각형 대각선에 대칭인 두 삼각형의 SAS 합동 적용
- condition: (없음)

**how** 대각선 AC 위의 점 P에서 각 APB = 118도를 구하고 삼각형 ABP와 ADP의 SAS 합동을 통해 각 ADP = 17도, 각 PDC = 73도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$A$, $P$, $C$가 한 직선 위에 있으므로 $\angle APB = 180^\circ - 62^\circ = 118^\circ$ 정사각형의 대각선 $AC$는 $\angle BAD$를 이등분하므로 $\angle BAP = \angle DAP = 45^\circ$ $\triangle ABP$에서 $\angle ABP = 180^\circ - (45^\circ + 118^\circ) = 17^\circ$ $\triangle ABP$와 $\triangle ADP$에서 $\overline{AB} = \overline{AD}$, $\angle BAP = \angle DAP = 45^\circ$, $\overline{AP}$는 공통이므로 $\triangle ABP \equiv \triangle ADP$ ($\text{SAS}$ 합동) 따라서 $\angle ADP = \angle ABP = 17^\circ$ $\therefore \angle PDC = 90^\circ - 17^\circ = 73^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 단답형 5점


**발문**

밑변 $\overline{BC}$의 길이가 $10\text{ cm}$이고 높이가 $8\text{ cm}$인 평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 하자. 선분 $AO$, 선분 $CO$의 중점을 각각 $M$, $N$이라고 할 때, $\triangle ABM$과 $\triangle CBN$의 넓이의 합을 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $20\text{ cm}^2$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 밑변 BC = 10 cm, 높이 8 cm인 평행사변형 ABCD의 전체 넓이는 10 * 8 = 80 cm^2이다.
2. 두 대각선이 서로를 이등분하므로 네 삼각형 ABO, CBO, CDO, DAO의 넓이는 각각 80 / 4 = 20 cm^2이다.
3. M은 AO의 중점이므로 삼각형 ABM의 넓이는 20 / 2 = 10 cm^2이다.
4. N은 CO의 중점이므로 삼각형 CBN의 넓이는 20 / 2 = 10 cm^2이다.
5. 따라서 두 삼각형 넓이의 합은 10 + 10 = 20 cm^2이다.
- 작성자 답: $20\text{ cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「밑변 $\overline{BC}$의 길이가 $10\text{ cm}$이고 높이가 $8\text{ cm}$인 평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 하자.」
**RPM** M2-RPM-195 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 분할도형] (원천과 같음)
- 이유: 평행사변형 ABCD의 대각선 교점 O와 중점 M, N으로 분할되는 삼각형 ABM, CBN의 넓이 합 20 cm^2를 구하는 분할도형 넓이 유형이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES
- 이유: 평행사변형 ABCD의 대각선에 의한 4등분과 선분 AO, CO의 중점 분할 성질을 결합하여 삼각형 넓이의 합을 산출하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 전체 넓이 80 cm^2에서 대각선 4분할과 중점 2분할을 거쳐 넓이 20 cm^2를 구하므로 난이도 2이다.

**4칸**
- given: 평행사변형←stem:「밑변 $\overline{BC}$의 길이가 $10\text{ cm}$이고 높이가 $8\text{ cm}$인 평행사변형 $ABCD$의 두 대각선의 교점을 $O$라 하자.」
- goal: 중점←stem:「$\triangle ABM$과 $\triangle CBN$의 넓이의 합을 구하시오.」
- method: 대각선(IMPLIED)←solution:「두 대각선은 서로 다른 것을 이등분하므로 네 삼각형 $AOB$, $BOC$, $COD$, $DOA$의 넓이는 모두 같다.」 — 평행사변형 대각선에 의한 4등분 및 중점 넓이 반분 성질 적용
- condition: (없음)

**how** 평행사변형 ABCD의 넓이 80 cm^2에서 대각선 4등분 삼각형 ABO, CBO가 각각 20 cm^2이고 중점 M, N에 의해 각 10 cm^2이므로 합이 20 cm^2임을 서술형으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$의 넓이는 $10 \times 8 = 80\text{ (cm}^2\text{)}$ 두 대각선은 서로 다른 것을 이등분하므로 네 삼각형 $AOB$, $BOC$, $COD$, $DOA$의 넓이는 모두 같다. $\triangle ABO = \triangle CBO = \dfrac{1}{4} \times 80 = 20\text{ (cm}^2\text{)}$ $M$은 $\overline{AO}$의 중점이므로 $\triangle ABM = \dfrac{1}{2}\triangle ABO = 10\text{ (cm}^2\text{)}$ $N$은 $\overline{CO}$의 중점이므로 $\triangle CBN = \dfrac{1}{2}\triangle CBO = 10\text{ (cm}^2\text{)}$ $\therefore \triangle ABM + \triangle CBN = 10 + 10 = 20\text{ (cm}^2\text{)}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
