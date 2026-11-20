# 검수 묶음 — 25_삼산중_2학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2, REASON_NO_ITEM_TOKEN 5)**
- 문항 24개 / 검사 PASS 21, FAIL 3, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 4, 2단계 19, 3단계 1
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 풀이 과정에 정답 값이 등장하지 않음
- **Q3**: 난이도 경계 (confidence=high, 원천 경계 B12) / 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q11**: 검사 코드: CHOICE_ORDER
- **Q12**: 검사 코드: REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN
- **Q17**: 검사 코드: CHOICE_ORDER
- **Q21**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q24**: 난이도 경계 (confidence=high, 원천 경계 B12)

---
## Q1 — 객관식 4점


**발문**

점 $I$가 $\triangle ABC$의 내심이고 $\angle A = 70^\circ$, $\angle ICB = 23^\circ$이다. 점 $I$에서 변 $BC$에 내린 수선의 발을 $D$라 할 때 $\overline{ID} = 5\text{ cm}$이다. $\angle IBD$의 크기와 점 $I$에서 변 $AB$에 이르는 거리를 바르게 짝지은 것은?

**보기** ① $32^\circ,\ 4\text{ cm}$  ② $28^\circ,\ 5\text{ cm}$  ③ $32^\circ,\ 5\text{ cm}$  ④ $34^\circ,\ 5\text{ cm}$  ⑤ $32^\circ,\ 6\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 점 I는 삼각형 ABC의 내심이므로 CI는 각 C를 이등분하여 각 C = 2 * 23도 = 46도이다.
2. 2) 각 B = 180도 - (70도 + 46도) = 64도이다.
3. 3) 점 I에서 BI는 각 B를 이등분하므로 각 IBD = 64도 / 2 = 32도이다.
4. 4) 내심 I에서 세 변까지의 거리는 반지름으로 모두 같으므로 ID = 5 cm와 동일하게 변 AB에 이르는 거리도 5 cm이다.
5. 5) 따라서 32도, 5 cm인 ③이 정답이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $I$가 $\triangle ABC$의 내심이고 $\angle A = 70^\circ$, $\angle ICB = 23^\circ$이다. 점 $I$에서 변 $BC$에 내린 수선의 발을 $D$라 할 때 $\overline{ID} = 5\text{ cm}$이다. $\angle IBD$의 크기와 점 $I$에서 변 $AB$에 이르는 거리를 바르게 짝지은 것은?」
**RPM** M2-RPM-067 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 내심과 거리] (원천과 같음)
- 이유: 내심 I에서 각의 이등분선 성질로 각 IBD = 32도를 구하고 변 ID = 5 cm에서 거리를 구하는 M2-RPM-067 문제이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE
- 이유: 삼각형의 내심 I의 각 이등분 성질과 세 변에 이르는 거리 5 cm가 같음을 활용하는 PT_TRIANGLE_CENTERS 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 내심 I의 각 이등분선 각도 계산과 내접원 반지름 거리 5 cm를 동시에 확인하는 2단계 문항이다.

**4칸**
- given: 내심←stem:「e ABC$의 내심이고 $\ang」
- goal: 거리←stem:「B$에 이르는 거리를 바르게 짝지」
- method: 이등분선(NAMED)←solution:「gle C$를 이등분하여 $\ang」
- condition: 수선←stem:「BC$에 내린 수선의 발을 $D$」

**how** 내심 I에서 각 C = 46도, 각 B = 64도이므로 각 IBD = 32도이고 변까지의 거리 ID = 5 cm임을 확인하여 정답 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $I$는 내심이므로 $\overline{CI}$는 $\angle C$를 이등분하여 $\angle C = 2 \times 23^\circ = 46^\circ$ $\angle B = 180^\circ - (70^\circ + 46^\circ) = 64^\circ$ $\overline{BI}$는 $\angle B$를 이등분하므로 $\angle IBD = \dfrac{64^\circ}{2} = 32^\circ$ 내심에서 세 변까지의 거리는 모두 같으므로 점 $I$에서 변 $AB$에 이르는 거리는 $\overline{ID} = 5\text{ cm}$이다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

점 $O$가 예각삼각형 $ABC$의 외심이고, 점 $O$에서 세 변 $AB$, $BC$, $CA$에 내린 수선의 발을 각각 $D$, $E$, $F$라 할 때, $\triangle OAD$와 항상 합동인 삼각형은?

**보기** ① $\triangle OBD$  ② $\triangle OAF$  ③ $\triangle OCF$  ④ $\triangle OCE$  ⑤ $\triangle OBE$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 점 O가 예각삼각형 ABC의 외심이므로 꼭짓점에 이르는 거리 OA = OB가 성립한다.
2. 2) 점 O에서 변 AB에 내린 수선의 발이 D이므로 각 ODA = 각 ODB = 90도이다.
3. 3) 직각삼각형 OAD와 OBD에서 빗변 OA = OB이고 선분 OD는 공통이다.
4. 4) 따라서 RHS 합동에 의해 삼각형 OAD와 삼각형 OBD는 항상 합동이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$가 예각삼각형 $ABC$의 외심이고, 점 $O$에서 세 변 $AB$, $BC$, $CA$에 내린 수선의 발을 각각 $D$, $E$, $F$라 할 때, $\triangle OAD$와 항상 합동인 삼각형은?」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] (원천과 같음)
- 이유: 외심 O에서 세 꼭짓점에 이르는 거리 OA = OB와 수선의 발 D로 인한 직각삼각형의 RHS 합동을 판정하는 M2-RPM-064 문제이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE
- 이유: 외심 O의 성질로부터 변의 수직이등분선과 RHS 합동 삼각형 OBD를 찾는 PT_TRIANGLE_CENTERS 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 외심 O의 성질과 직각삼각형 합동 조건 RHS를 적용하여 삼각형 OBD를 고르는 기본 2단계 문항이다.

**4칸**
- given: 외심←stem:「$ABC$의 외심이고, 점 $O」
- goal: 합동←stem:「AD$와 항상 합동인 삼각형은?」
- method: 삼각형(NAMED)←stem:「$O$가 예각삼각형 $ABC$의」
- condition: 수선←stem:「CA$에 내린 수선의 발을 각각」

**how** 외심 O에서 OA = OB이고 공통변 OD, 직각으로 인해 삼각형 OBD와 RHS 합동임을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $O$는 외심이므로 $\overline{OA} = \overline{OB}$이고 $\angle ODA = \angle ODB = 90^\circ$, $\overline{OD}$는 공통이다. 따라서 $\triangle OAD \equiv \triangle OBD$ ($\text{RHS}$ 합동)이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 $6$개의 직각삼각형 ㄱ~ㅂ 중에서 서로 합동인 것끼리 짝짓고, 그 합동 조건과 바르게 연결한 것은? ㄱ. 빗변의 길이가 $6\text{ cm}$이고, 한 내각의 크기가 $35^\circ$인 직각삼각형 ㄴ. 빗변의 길이가 $6\text{ cm}$이고, 한 직각변의 길이가 $4\text{ cm}$인 직각삼각형 ㄷ. 직각을 낀 두 변의 길이가 각각 $4\text{ cm}$, $5\text{ cm}$인 직각삼각형 ㄹ. 빗변의 길이가 $6\text{ cm}$이고, 한 내각의 크기가 $55^\circ$인 직각삼각형 ㅁ. 빗변의 길이가 $7\text{ cm}$이고, 한 직각변의 길이가 $4\text{ cm}$인 직각삼각형 ㅂ. 직각을 낀 두 변의 길이가 각각 $3\text{ cm}$, $5\text{ cm}$인 직각삼각형

**보기** ① (ㄱ, ㄴ), $\text{RHS}$ 합동  ② (ㄴ, ㅁ), $\text{RHS}$ 합동  ③ (ㄷ, ㅂ), $\text{SAS}$ 합동  ④ (ㄱ, ㄷ), $\text{ASA}$ 합동  ⑤ (ㄱ, ㄹ), $\text{RHA}$ 합동

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) ㄱ: 빗변 6 cm, 한 내각 35도이므로 다른 예각은 90도 - 35도 = 55도이다.
2. 2) ㄹ: 빗변 6 cm, 한 내각 55도이므로 다른 예각은 90도 - 55도 = 35도이다.
3. 3) 직각삼각형 ㄱ과 ㄹ은 빗변의 길이가 6 cm로 같고 한 예각의 크기가 35도(또는 55도)로 같으므로 RHA 합동이다.
4. 4) 다른 보기들은 빗변 길이가 다르거나 조건이 일치하지 않는다.
5. 5) 따라서 바르게 연결된 것은 (ㄱ, ㄹ), RHA 합동인 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 $6$개의 직각삼각형 ㄱ~ㅂ 중에서 서로 합동인 것끼리 짝짓고, 그 합동 조건과 바르게 연결한 것은? ㄱ. 빗변의 길이가 $6\text{ cm}$이고, 한 내각의 크기가 $35^\circ$인 직각삼각형」
**RPM** M2-RPM-071 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] (원천과 같음)
- 이유: 빗변 6 cm와 한 예각 35도 및 55도가 주어진 두 직각삼각형 ㄱ, ㄹ의 RHA 합동을 판정하는 M2-RPM-071 문제이다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=NONE
- 이유: 여러 직각삼각형 중 빗변 6 cm와 예각 조건으로 RHA 합동 쌍을 가려내는 PT_RIGHT_TRIANGLE_CONGRUENCE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 빗변 6 cm와 여각 35도, 55도 관계를 계산하여 RHA 합동임을 선별하는 2단계 문항이다.

**4칸**
- given: 직각삼각형←stem:「음 $6$개의 직각삼각형 ㄱ~ㅂ 중에서」
- goal: 조건←stem:「고, 그 합동 조건과 바르게 연결」
- method: 내각(NAMED)←stem:「}$이고, 한 내각의 크기가 $3」
- condition: 길이←stem:「ㄱ. 빗변의 길이가 $6\tex」

**how** ㄱ과 ㄹ이 모두 빗변 6 cm이고 예각 35도, 55도를 가지므로 RHA 합동임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ의 두 예각은 $35^\circ$, $55^\circ$이고 ㄹ의 두 예각은 $55^\circ$, $35^\circ$이다. 두 직각삼각형 ㄱ과 ㄹ은 빗변의 길이가 $6\text{ cm}$로 같고 한 예각의 크기가 같으므로 $\text{RHA}$ 합동이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

$\angle A = 90^\circ$인 직각이등변삼각형 $ABC$($\overline{AB} = \overline{AC}$)에서 꼭짓점 $A$를 지나고 변 $BC$와 만나지 않는 직선 $l$을 긋고, 두 점 $B$, $C$에서 직선 $l$에 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{BD} = 5\text{ cm}$, $\overline{CE} = 6\text{ cm}$일 때, $\triangle ABD \equiv \triangle CAE$의 합동 조건과 $\overline{DE}$의 길이를 바르게 짝지은 것은?

**보기** ① $\text{RHS},\ 11\text{ cm}$  ② $\text{RHA},\ 11\text{ cm}$  ③ $\text{SAS},\ 11\text{ cm}$  ④ $\text{RHA},\ 10\text{ cm}$  ⑤ $\text{RHS},\ 10\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 직각이등변삼각형 ABC에서 AB = AC이고 각 BAC = 90도이다.
2. 2) 직선 l에 내린 수선의 발 D, E에 대해 각 ADB = 각 CEA = 90도이다.
3. 3) 각 DAB + 각 EAC = 90도이고 직각삼각형 ABD에서 각 DAB + 각 ABD = 90도이므로 각 ABD = 각 EAC이다.
4. 4) 직각삼각형 ABD와 CAE는 빗변 AB = AC이고 한 예각 각 ABD = 각 EAC이므로 RHA 합동이다.
5. 5) 따라서 AD = CE = 6 cm, AE = BD = 5 cm이므로 DE = DA + AE = 6 + 5 = 11 cm이다.
6. 6) 합동 조건 RHA, 11 cm인 ②가 정답이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle A = 90^\circ$인 직각이등변삼각형 $ABC$($\overline{AB} = \overline{AC}$)에서 꼭짓점 $A$를 지나고 변 $BC$와 만나지 않는 직선 $l$을 긋고, 두 점 $B$, $C$에서 직선 $l$에 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{BD} = 5\text{ cm}$, $\overline{CE} = 6\text{ cm}$일 때, $\triangle ABD \equiv \triangle CAE$의 합동 조건과 $\overline{DE}$의 길이를 바르게 짝지은 것은?」
**RPM** M2-RPM-071 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] (원천과 같음)
- 이유: 직각이등변삼각형의 꼭짓점을 지나는 직선과 수선으로 만들어진 두 직각삼각형의 RHA 합동과 변의 합 DE = 6 + 5 = 11 cm를 구하는 M2-RPM-071 문제이다.
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=NONE
- 이유: 직각이등변삼각형에서 각의 합 90도 관계를 통해 직각삼각형의 RHA 합동과 선분 DE = 11 cm를 계산하는 PT_RIGHT_TRIANGLE_CONGRUENCE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각이등변삼각형에서 꼭짓각 90도 분할을 이용해 RHA 합동을 유도하고 DE = 6 + 5 = 11 cm를 구하는 표준 난이도 2 문항이다.

**4칸**
- given: 직각이등변삼각형←stem:「\circ$인 직각이등변삼각형 $ABC$($」
- goal: 길이←stem:「e{DE}$의 길이를 바르게 짝지」
- method: 삼각형(NAMED)←stem:「$인 직각이등변삼각형 $ABC$($」
- condition: 꼭짓점←stem:「AC}$)에서 꼭짓점 $A$를 지나」

**how** 직각삼각형 ABD와 CAE가 RHA 합동임을 보이고 AD = 6, AE = 5에서 DE = 11 cm임을 도출하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ADB = \angle CEA = 90^\circ$, $\overline{AB} = \overline{AC}$이고 $\angle DAB + \angle EAC = 90^\circ$, $\angle DAB + \angle ABD = 90^\circ \implies \angle ABD = \angle CAE$ 따라서 $\triangle ABD \equiv \triangle CAE$ ($\text{RHA}$ 합동)이다. $\overline{AD} = \overline{CE} = 6\text{ cm}$, $\overline{AE} = \overline{BD} = 5\text{ cm}$이므로 $\therefore \overline{DE} = \overline{DA} + \overline{AE} = 6 + 5 = 11\text{ (cm)}$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

예각삼각형 $ABC$의 내심 $I$에서 세 변 $AB$, $BC$, $CA$에 내린 수선의 발을 각각 $D$, $E$, $F$라 하자. $\angle AID : \angle BIE : \angle CIF = 4 : 5 : 6$일 때, $\angle ABC$의 크기는?

**보기** ① $48^\circ$  ② $52^\circ$  ③ $56^\circ$  ④ $60^\circ$  ⑤ $64^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 내심 I에서 세 변에 내린 수선의 발 D, E, F에 대해 각 AID = 90도 - (1/2)A, 각 BIE = 90도 - (1/2)B, 각 CIF = 90도 - (1/2)C이다.
2. 2) 세 각의 합은 270도 - (1/2)(A + B + C) = 270도 - 90도 = 180도이다.
3. 3) 각 AID : 각 BIE : 각 CIF = 4 : 5 : 6이므로 각 BIE = 180도 * (5 / 15) = 60도이다.
4. 4) 90도 - (1/2)각 ABC = 60도에서 (1/2)각 ABC = 30도이므로 각 ABC = 60도이다.
5. 5) 따라서 각 ABC의 크기는 60도인 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「예각삼각형 $ABC$의 내심 $I$에서 세 변 $AB$, $BC$, $CA$에 내린 수선의 발을 각각 $D$, $E$, $F$라 하자. $\angle AID : \angle BIE : \angle CIF = 4 : 5 : 6$일 때, $\angle ABC$의 크기는?」
**RPM** M2-RPM-066 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] (원천과 같음)
- 이유: 내심 I에서 각 AID, BIE, CIF의 합이 180도임을 비례배분 4:5:6으로 나누어 각 BIE = 60도에서 각 ABC = 60도를 구하는 M2-RPM-066 문제이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE
- 이유: 내심 I 주변의 수선 각도 관계와 비례배분 4:5:6을 통해 삼각형의 각 ABC = 60도를 구하는 PT_TRIANGLE_CENTERS 과제이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심과 수선으로 만들어지는 각의 합 180도 관계를 유도하고 비례배분 4:5:6으로 각 ABC = 60도를 구하는 심화 난이도 3 문항이다.

**4칸**
- given: 내심←stem:「$ABC$의 내심 $I$에서 세」
- goal: 예각(NAMED)←stem:「예각삼각형 $ABC」
- method: 수선(NAMED)←stem:「CA$에 내린 수선의 발을 각각」
- condition: 삼각형←stem:「예각삼각형 $ABC$의」

**how** 세 각의 합이 180도이고 비가 4:5:6이므로 각 BIE = 60도에서 각 ABC = 60도임을 도출하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle AID = 90^\circ - \dfrac{1}{2}\angle A$, $\angle BIE = 90^\circ - \dfrac{1}{2}\angle B$, $\angle CIF = 90^\circ - \dfrac{1}{2}\angle C$이므로 $\angle AID + \angle BIE + \angle CIF = 270^\circ - \dfrac{1}{2}(\angle A + \angle B + \angle C) = 270^\circ - 90^\circ = 180^\circ$ 비가 $4 : 5 : 6$이므로 $\angle BIE = 180^\circ \times \dfrac{5}{4 + 5 + 6} = 180^\circ \times \dfrac{5}{15} = 60^\circ$ $90^\circ - \dfrac{1}{2}\angle ABC = 60^\circ \implies \dfrac{1}{2}\angle ABC = 30^\circ \implies \angle ABC = 60^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 5점


**발문**

원 $I$는 $\triangle ABC$의 내접원이고 세 변 $AB$, $BC$, $CA$와의 접점이 각각 $D$, $E$, $F$일 때, 다음 <보기> 중 옳은 것만을 있는 대로 고른 것은? 〈보기〉 ㄱ. $\overline{BD} = \overline{BE}$ ㄴ. 점 $I$는 $\triangle ABC$의 내심이다. ㄷ. 점 $I$는 $\triangle DEF$의 외심이다. ㄹ. $\overline{AI} = \overline{CI}$

**보기** ① ㄱ, ㄴ, ㄷ  ② ㄱ, ㄴ  ③ ㄴ, ㄹ  ④ ㄱ, ㄷ, ㄹ  ⑤ ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) ㄱ: 점 B에서 내접원 I에 그은 두 접선의 길이는 같으므로 BD = BE이다. (참)
2. 2) ㄴ: 원 I가 삼각형 ABC의 세 변에 접하므로 중심 I는 삼각형 ABC의 내심이다. (참)
3. 3) ㄷ: 접점 D, E, F에 대해 ID = IE = IF = (내접원 반지름)이므로 점 I는 삼각형 DEF의 세 꼭짓점에서 같은 거리에 있어 외심이다. (참)
4. 4) ㄹ: AI = CI는 이등변삼각형 등의 특수 조건이 없으면 일반적으로 성립하지 않는다. (거짓)
5. 5) 따라서 옳은 것은 ㄱ, ㄴ, ㄷ인 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「원 $I$는 $\triangle ABC$의 내접원이고 세 변 $AB$, $BC$, $CA$와의 접점이 각각 $D$, $E$, $F$일 때, 다음 <보기> 중 옳은 것만을 있는 대로 고른 것은? 〈보기〉 ㄱ. $\overline{BD} = \overline{BE}$ ㄴ. 점 $I$는 $\triangle ABC$의 내심이다. ㄷ. 점 $I$는 $\triangle DEF$의 외심이다. ㄹ. $\overline{AI} = \overline{CI}$」
**RPM** M2-RPM-067 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 내심과 거리] (원천과 같음)
- 이유: 내접원 I의 접선 길이 BD = BE 성질과 반지름 ID = IE = IF를 통한 내심·외심 성질을 판정하는 M2-RPM-067 문제이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE
- 이유: 내접원 I의 접선 성질과 접점으로 이루어진 삼각형 DEF의 외심 성질을 분석하는 PT_TRIANGLE_CENTERS 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내접원 접선 길이 BD = BE와 내심, 외심의 정의를 종합적으로 판단하는 2단계 문항이다.

**4칸**
- given: 내접←stem:「e ABC$의 내접원이고 세 변」
- goal: 외심←stem:「e DEF$의 외심이다. ㄹ. $」
- method: 내심(NAMED)←stem:「e ABC$의 내심이다. ㄷ. 점」
- condition: 접점←stem:「$CA$와의 접점이 각각 $D$」

**how** 접선 길이 BD = BE와 ID = IE = IF에 의해 삼각형 DEF의 외심이 됨을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. 점 $B$에서 원 $I$에 그은 두 접선의 길이는 같으므로 $\overline{BD} = \overline{BE}$이다. (참) ㄴ. 원 $I$가 $\triangle ABC$의 세 변에 접하므로 중심 $I$는 $\triangle ABC$의 내심이다. (참) ㄷ. 세 점 $D$, $E$, $F$는 원 $I$ 위의 점이므로 $\overline{ID} = \overline{IE} = \overline{IF}$가 되어 점 $I$는 $\triangle DEF$의 외심이다. (참) ㄹ. $\overline{AI} = \overline{CI}$는 일반적으로 성립하지 않는다. (거짓) $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라 하고, 선분 $AD$ 위의 점 $P$를 잡을 때, 다음 <보기> 중 옳은 것만을 있는 대로 고른 것은? 〈보기〉 ㄱ. $\angle PDC = 90^\circ$ ㄴ. $\triangle BPC$는 이등변삼각형이다. ㄷ. $\angle ACP = \angle PCD$이면 점 $P$는 $\triangle ABC$의 내심이다.

**보기** ① ㄱ  ② ㄱ, ㄴ  ③ ㄱ, ㄴ, ㄷ  ④ ㄱ, ㄷ  ⑤ ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) ㄱ: 이등변삼각형 ABC에서 꼭짓각 A의 이등분선 AD는 밑변 BC를 수직이등분하므로 각 PDC = 90도이다. (참)
2. 2) ㄴ: AD가 선분 BC의 수직이등분선이므로 선분 AD 위의 점 P에 대해 PB = PC가 성립하여 삼각형 BPC는 이등변삼각형이다. (참)
3. 3) ㄷ: AP가 각 A를 이등분하고 CP가 각 C를 이등분하므로 점 P는 두 내각의 이등분선의 교점이 되어 내심이다. (참)
4. 4) 따라서 옳은 것은 ㄱ, ㄴ, ㄷ인 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = \overline{AC}$인 이등변삼각형 $ABC$에서 $\angle A$의 이등분선과 변 $BC$의 교점을 $D$라 하고, 선분 $AD$ 위의 점 $P$를 잡을 때, 다음 <보기> 중 옳은 것만을 있는 대로 고른 것은? 〈보기〉 ㄱ. $\angle PDC = 90^\circ$ ㄴ. $\triangle BPC$는 이등변삼각형이다. ㄷ. $\angle ACP = \angle PCD$이면 점 $P$는 $\triangle ABC$의 내심이다.」
**RPM** M2-RPM-061 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 꼭짓각의 이등분선] (원천과 같음)
- 이유: 이등변삼각형 ABC의 꼭짓각 A의 이등분선이 밑변 BC를 수직이등분하여 각 PDC = 90도와 삼각형 BPC 이등변삼각형 성질을 유도하는 M2-RPM-061 문제이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE
- 이유: AB = AC인 이등변삼각형 ABC의 꼭짓각 이등분선 성질과 내각 이등분선 교점을 통한 내심 판정을 복합 검증하는 PT_ISOSCELES_TRIANGLE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: AB = AC인 이등변삼각형 ABC에서 꼭짓각 이등분선이 밑변 BC를 수직이등분하는 성질을 단계별로 검증하는 2단계 문항이다.

**4칸**
- given: 이등변삼각형←stem:「e{AC}$인 이등변삼각형 $ABC$에서」
- goal: 내심←stem:「e ABC$의 내심이다.」
- method: 이등분선(NAMED)←stem:「gle A$의 이등분선과 변 $BC$」
- condition: 교점←stem:「변 $BC$의 교점을 $D$라 하」

**how** 이등변삼각형 ABC에서 꼭짓각 이등분선이 밑변을 수직이등분하여 각 PDC = 90도, PB = PC, 내각 이등분선 교점 내심이 모두 성립함을 확인하여 정답 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. 이등변삼각형의 꼭짓각 $A$의 이등분선은 밑변 $BC$를 수직이등분하므로 $\angle PDC = 90^\circ$이다. (참) ㄴ. $AD$는 $\overline{BC}$의 수직이등분선이므로 $\overline{PB} = \overline{PC}$가 되어 $\triangle BPC$는 이등변삼각형이다. (참) ㄷ. $AP$가 $\angle A$를 이등분하고 $CP$가 $\angle C$를 이등분하므로 두 내각의 이등분선의 교점 $P$는 $\triangle ABC$의 내심이다. (참) $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 <보기> 중에서 사각형 $ABCD$가 평행사변형인 것만을 있는 대로 고른 것은? (단, 점 $O$는 두 대각선의 교점이다.) 〈보기〉 ㄱ. $\overline{AB} = \overline{BC} = 6\text{ cm},\ \overline{CD} = \overline{DA} = 8\text{ cm}$ ㄴ. $\overline{AD} \parallel \overline{BC},\ \angle OAD = \angle ODA$ ㄷ. $\angle ABD = \angle BDC,\ \angle ACB = \angle DAC$ ㄹ. $\overline{AB} = \overline{CD},\ \angle ABC + \angle BCD = 180^\circ$

**보기** ① ㄱ, ㄴ  ② ㄱ, ㄷ  ③ ㄴ, ㄷ  ④ ㄴ, ㄹ  ⑤ ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) ㄱ: AB = BC = 6 cm, CD = DA = 8 cm는 이웃한 두 쌍의 변이 같은 연꼴이므로 평행사변형이 아니다.
2. 2) ㄴ: AD // BC와 각 OAD = 각 ODA는 등변사다리꼴일 수 있으므로 평행사변형임을 보장하지 못한다.
3. 3) ㄷ: 각 ABD = 각 BDC에서 AB // CD이고 각 ACB = 각 DAC에서 AD // BC이므로 두 쌍의 대변이 평행하여 평행사변형이다.
4. 4) ㄹ: 각 ABC + 각 BCD = 180도에서 동측내각의 합이 180도이므로 AB // CD이고, AB = CD이므로 한 쌍의 대변이 평행하고 그 길이가 같아 평행사변형이다.
5. 5) 따라서 평행사변형인 것은 ㄷ, ㄹ인 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 <보기> 중에서 사각형 $ABCD$가 평행사변형인 것만을 있는 대로 고른 것은? (단, 점 $O$는 두 대각선의 교점이다.) 〈보기〉 ㄱ. $\overline{AB} = \overline{BC} = 6\text{ cm},\ \overline{CD} = \overline{DA} = 8\text{ cm}$ ㄴ. $\overline{AD} \parallel \overline{BC},\ \angle OAD = \angle ODA$ ㄷ. $\angle ABD = \angle BDC,\ \angle ACB = \angle DAC$ ㄹ. $\overline{AB} = \overline{CD},\ \angle ABC + \angle BCD = 180^\circ$」
**RPM** M2-RPM-074 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 사각형 ABCD에서 엇각 조건으로 두 쌍의 대변 평행 ㄷ과 한 쌍 대변 평행 및 길이 조건 ㄹ을 통해 평행사변형을 판정하는 M2-RPM-074 문제이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 사각형 ABCD가 평행사변형이 되는 조건 5가지를 대조하여 ㄷ과 ㄹ의 유효성을 검증하는 PT_QUADRILATERAL_PROPERTIES 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 사각형 ABCD가 평행사변형이 되는 판정 조건(두 쌍 대변 평행, 한 쌍 평행 및 상등)을 각각의 보기에서 선별하는 2단계 문항이다.

**4칸**
- given: 사각형←stem:「보기> 중에서 사각형 $ABCD$가」
- goal: 평행사변형←stem:「$ABCD$가 평행사변형인 것만을 있는」
- method: 대각선(NAMED)←stem:「$O$는 두 대각선의 교점이다.)」
- condition: 교점←stem:「두 대각선의 교점이다.) 〈보기」

**how** 사각형 ABCD에서 ㄷ은 두 쌍 대변 평행, ㄹ은 한 쌍 대변 평행 및 상등으로 평행사변형이 됨을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. 이웃한 두 쌍의 변이 각각 같은 연꼴이므로 평행사변형이 아니다. ㄴ. $\overline{AD} \parallel \overline{BC}$와 $\overline{OA} = \overline{OD}$만으로는 평행사변형임을 보장하지 못한다. ㄷ. 엇각이 각각 같으므로 $\overline{AB} \parallel \overline{CD}$, $\overline{AD} \parallel \overline{BC}$가 되어 평행사변형이다. ㄹ. $\angle ABC + \angle BCD = 180^\circ$이므로 $\overline{AB} \parallel \overline{CD}$이고 $\overline{AB} = \overline{CD}$이므로 평행사변형이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

평행사변형 $ABCD$에서 $\angle CAD$의 이등분선과 변 $BC$의 연장선이 만나는 점을 $E$라 하자. $\angle B = 72^\circ$, $\angle ACD = 44^\circ$일 때, $\angle E$의 크기는?

**보기** ① $28^\circ$  ② $32^\circ$  ③ $34^\circ$  ④ $36^\circ$  ⑤ $40^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 평행사변형 ABCD에서 이웃한 두 내각의 합은 180도이므로 각 BCD = 180도 - 72도 = 108도이다.
2. 2) 각 ACB = 각 BCD - 각 ACD = 108도 - 44도 = 64도이다.
3. 3) 선분 AD // BC이므로 엇각에 의해 각 CAD = 각 ACB = 64도이다.
4. 4) AE가 각 CAD의 이등분선이므로 각 DAE = 64도 / 2 = 32도이다.
5. 5) 선분 AD // BE이므로 엇각에 의해 각 E = 각 DAE = 32도이다.
6. 6) 따라서 각 E의 크기는 32도인 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 $\angle CAD$의 이등분선과 변 $BC$의 연장선이 만나는 점을 $E$라 하자. $\angle B = 72^\circ$, $\angle ACD = 44^\circ$일 때, $\angle E$의 크기는?」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 ABCD의 대각 및 이웃한 각 합 180도 성질과 엇각, 각의 이등분선으로 각 E = 32도를 구하는 M2-RPM-072 문제이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 평행사변형 ABCD의 평행선 성질과 각 이등분선을 결합하여 각 E = 32도를 계산하는 PT_QUADRILATERAL_PROPERTIES 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 ABCD에서 이웃 각 합 108도, 엇각 64도, 이등분 32도, 다시 엇각 32도로 이어지는 연쇄 각도 계산 문항이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에」
- goal: 평행(NAMED)←stem:「평행사변형 $ABC」
- method: 이등분선(NAMED)←stem:「e CAD$의 이등분선과 변 $BC$」
- condition: (없음)

**how** 평행사변형 ABCD에서 각 BCD = 108도, 각 ACB = 64도, 엇각 각 CAD = 64도, 이등분선 각 DAE = 32도, 엇각 각 E = 32도임을 확인하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형에서 이웃한 두 각의 합은 $180^\circ$이므로 $\angle BCD = 180^\circ - 72^\circ = 108^\circ$ $\angle ACB = \angle BCD - \angle ACD = 108^\circ - 44^\circ = 64^\circ$ $\overline{AD} \parallel \overline{BC}$이므로 엇각으로 $\angle CAD = \angle ACB = 64^\circ$ $\overline{AE}$가 $\angle CAD$의 이등분선이므로 $\angle DAE = \dfrac{64^\circ}{2} = 32^\circ$ $\overline{AD} \parallel \overline{BE}$이므로 엇각으로 $\therefore \angle E = \angle DAE = 32^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 5점


**발문**

마름모 $ABCD$에서 $\overline{AC} = 16\text{ cm}$, $\overline{BD} = 15\text{ cm}$이고, 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP} : \overline{PC} = 2 : 3$일 때, $\triangle DBP$의 넓이는?

**보기** ① $18\text{ cm}^2$  ② $20\text{ cm}^2$  ③ $22\text{ cm}^2$  ④ $24\text{ cm}^2$  ⑤ $30\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 마름모 ABCD의 넓이는 (1/2) * AC * BD = (1/2) * 16 * 15 = 120 cm^2이다.
2. 2) 대각선 BD는 마름모의 넓이를 이등분하므로 삼각형 BCD의 넓이는 120 / 2 = 60 cm^2이다.
3. 3) 삼각형 DBP와 삼각형 DPC는 꼭짓점 D를 공유하여 높이가 같고 밑변의 비는 BP : PC = 2 : 3이다.
4. 4) 따라서 삼각형 DBP의 넓이는 60 * (2 / (2 + 3)) = 60 * (2 / 5) = 24 cm^2이다.
5. 5) 따라서 정답은 24 cm^2인 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$에서 $\overline{AC} = 16\text{ cm}$, $\overline{BD} = 15\text{ cm}$이고, 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP} : \overline{PC} = 2 : 3$일 때, $\triangle DBP$의 넓이는?」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: 대각선 16 cm, 15 cm로 마름모 ABCD 넓이 120 cm^2를 구하고 대각선 이등분 60 cm^2와 밑변 비 2:3으로 삼각형 DBP 넓이 24 cm^2를 구하는 M2-RPM-078 문제이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 마름모 ABCD의 대각선 16 cm, 15 cm를 이용한 넓이 공식과 선분 비에 따른 삼각형 넓이 분할을 결합한 PT_QUADRILATERAL_PROPERTIES 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 마름모 ABCD의 대각선 16 cm, 15 cm 넓이 계산 120 cm^2와 높이가 같은 삼각형의 밑변 비 2:3 비례배분을 결합한 2단계 문항이다.

**4칸**
- given: 마름모←stem:「마름모 $ABCD$에」
- goal: 넓이←stem:「e DBP$의 넓이는?」
- method: 대각선(NAMED)←solution:「ext{)}$ 대각선 $BD$는 마」
- condition: (없음)

**how** 마름모 ABCD 넓이 120 cm^2의 절반인 60 cm^2에 밑변 비 2/5를 곱해 24 cm^2임을 계산하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

마름모 $ABCD$의 넓이는 $\dfrac{1}{2} \times 16 \times 15 = 120\text{ (cm}^2\text{)}$ 대각선 $BD$는 마름모의 넓이를 이등분하므로 $\triangle BCD = \dfrac{1}{2} \times 120 = 60\text{ (cm}^2\text{)}$ $\triangle DBP$와 $\triangle DPC$는 높이가 같고 밑변의 비가 $\overline{BP} : \overline{PC} = 2 : 3$이므로 $\therefore \triangle DBP = 60 \times \dfrac{2}{2 + 3} = 24\text{ (cm}^2\text{)}$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

반지름의 길이가 $7\text{ cm}$인 원 $O$의 중심 $O$를 한 꼭짓점으로 하고, 꼭짓점 $B$가 원 $O$ 위에 있는 직사각형 $OABC$에서 대각선 $\overline{AC}$의 길이는?

**보기** ① $7\text{ cm}$  ② $3.5\text{ cm}$  ③ $5\text{ cm}$  ④ $10\text{ cm}$  ⑤ $14\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 점 B는 반지름이 7 cm인 원 O 위의 점이므로 선분 OB = 7 cm이다.
2. 2) 사각형 OABC는 직사각형이므로 두 대각선 AC와 OB의 길이는 서로 같다.
3. 3) 따라서 대각선 AC = OB = 7 cm이다.
4. 4) 그러므로 정답은 7 cm인 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「반지름의 길이가 $7\text{ cm}$인 원 $O$의 중심 $O$를 한 꼭짓점으로 하고, 꼭짓점 $B$가 원 $O$ 위에 있는 직사각형 $OABC$에서 대각선 $\overline{AC}$의 길이는?」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질**
- 이유: 원 O의 반지름 7 cm인 선분 OB와 직사각형 OABC의 두 대각선 길이가 같음을 이용해 AC = 7 cm를 구하는 M2-RPM-078 문제이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 직사각형 OABC에서 원의 반지름 OB = 7 cm와 대각선 상등 성질로 AC = 7 cm를 확인하는 PT_QUADRILATERAL_PROPERTIES 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직사각형 OABC의 대각선 성질 AC = OB = 7 cm를 정의로부터 바로 확인하는 1단계 문항이다.

**4칸**
- given: 직사각형←stem:「$ 위에 있는 직사각형 $OABC$에」
- goal: 대각선←stem:「OABC$에서 대각선 $\overl」
- method: 반지름(NAMED)←stem:「반지름의 길이가 $7」
- condition: 꼭짓점←stem:「$O$를 한 꼭짓점으로 하고, 꼭」

**how** 직사각형 OABC의 두 대각선 길이가 같으므로 AC = OB = 7 cm임을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $B$는 반지름의 길이가 $7\text{ cm}$인 원 $O$ 위의 점이므로 $\overline{OB} = 7\text{ cm}$이다. 직사각형 $OABC$의 두 대각선의 길이는 같으므로 $\overline{AC} = \overline{OB} = 7\text{ cm}$이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN, REASON_NO_ITEM_TOKEN

**발문**

사각형을 분류하는 순서도에서 조건 (가)에 ‘예’이면 평행사변형·직사각형·마름모·정사각형으로 이어지고, 이 네 사각형을 조건 (나)로 나누어 ‘예’이면 직사각형·정사각형, ‘아니오’이면 평행사변형·마름모로 분류된다. 또 조건 (가)에 ‘아니오’인 사각형을 조건 (다)로 나누어 ‘예’이면 사다리꼴, ‘아니오’이면 그 외의 사각형으로 분류된다. (가), (나), (다)에 들어갈 알맞은 조건을 <보기>에서 고른 것은? 〈보기〉 ㄱ. 두 대각선의 길이가 같은가? ㄴ. 두 대각선이 서로 다른 것을 이등분하는가? ㄷ. 한 쌍의 대변이 평행한가?

**보기** ① (가) ㄱ, (나) ㄴ, (다) ㄷ  ② (가) ㄴ, (나) ㄱ, (다) ㄷ  ③ (가) ㄱ, (나) ㄷ, (다) ㄴ  ④ (가) ㄴ, (나) ㄷ, (다) ㄱ  ⑤ (가) ㄷ, (나) ㄱ, (다) ㄴ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 평행사변형, 직사각형, 마름모, 정사각형은 모두 두 대각선이 서로 다른 것을 이등분하므로 (가)는 ㄴ이다.
2. 2) 이 중 직사각형과 정사각형은 두 대각선의 길이가 같으므로 (나)는 ㄱ이다.
3. 3) 평행사변형이 아닌 사각형 중 한 쌍의 대변이 평행한 것이 사다리꼴이므로 (다)는 ㄷ이다.
4. 4) 따라서 알맞은 연결은 (가) ㄴ, (나) ㄱ, (다) ㄷ인 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「사각형을 분류하는 순서도에서 조건 (가)에 ‘예’이면 평행사변형·직사각형·마름모·정사각형으로 이어지고, 이 네 사각형을 조건 (나)로 나누어 ‘예’이면 직사각형·정사각형, ‘아니오’이면 평행사변형·마름모로 분류된다. 또 조건 (가)에 ‘아니오’인 사각형을 조건 (다)로 나누어 ‘예’이면 사다리꼴, ‘아니오’이면 그 외의 사각형으로 분류된다.」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 성질 비교 → 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정**
- 이유: 여러 사각형의 대각선 성질과 평행 조건으로 (가) ㄴ, (나) ㄱ, (다) ㄷ의 분류 계통도를 완성하는 M2-RPM-082 문제이다.
**유형** PT=PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS / TPL=NONE
- 이유: 사각형 계통도에서 단계별 조건 (가), (나), (다)를 대각선과 평행 성질로 판별하는 PT_MG_QUADRILATERAL_HIERARCHY_CONDITIONS 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 대각선 이등분 ㄴ, 대각선 길이 상등 ㄱ, 한 쌍 대변 평행 ㄷ의 조건을 차례로 대조하는 2단계 문항이다.

**4칸**
- given: 평행사변형←stem:「에 ‘예’이면 평행사변형·직사각형·마름」
- goal: 사다리꼴←stem:「어 ‘예’이면 사다리꼴, ‘아니오’이」
- method: 이등분선(NAMED)←stem:「로 다른 것을 이등분하는가? ㄷ. 한」
- condition: 정사각형←stem:「사각형·마름모·정사각형으로 이어지고,」

**how** (가)는 대각선 이등분 ㄴ, (나)는 대각선 길이 상등 ㄱ, (다)는 대변 평행 ㄷ임을 확인하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형·직사각형·마름모·정사각형은 모두 두 대각선이 서로 다른 것을 이등분하므로 (가)는 ㄴ이다. 이 중 직사각형과 정사각형은 두 대각선의 길이가 같으므로 (나)는 ㄱ이다. 평행사변형이 아닌 사각형 중 사다리꼴을 구분하는 조건은 한 쌍의 대변이 평행한지 여부이므로 (다)는 ㄷ이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

$\overline{BD} = 14\text{ cm}$인 정사각형 $ABCD$의 두 대각선의 교점을 $O$라 하고, 대각선 $AC$ 위의 한 점 $P$에 대하여 $\overline{AO} = x\text{ cm}$, $\angle DPO = 58^\circ$, $\angle PDC = y^\circ$라 할 때, $x + y$의 값은?

**보기** ① $12$  ② $14$  ③ $16$  ④ $18$  ⑤ $20$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 정사각형 ABCD의 대각선 BD = 14 cm이므로 AC = 14 cm이고 두 대각선은 서로 다른 것을 수직이등분한다.
2. 2) x = AO = (1/2) * AC = 7이다.
3. 3) 삼각형 DOP에서 각 DOP = 90도이고 각 DPO = 58도이므로 각 ODP = 90도 - 58도 = 32도이다.
4. 4) 대각선 BD는 각 ADC = 90도를 이등분하므로 각 ODC = 45도이다.
5. 5) 따라서 y = 각 PDC = 45도 - 32도 = 13이다.
6. 6) x + y = 7 + 13 = 20이므로 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{BD} = 14\text{ cm}$인 정사각형 $ABCD$의 두 대각선의 교점을 $O$라 하고, 대각선 $AC$ 위의 한 점 $P$에 대하여 $\overline{AO} = x\text{ cm}$, $\angle DPO = 58^\circ$, $\angle PDC = y^\circ$라 할 때, $x + y$의 값은?」
**RPM** M2-RPM-079 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] (원천과 같음)
- 이유: 정사각형 ABCD의 대각선 길이 BD = 14 cm에서 x = 7을 구하고 각 DPO = 58도에서 y = 13을 구해 x + y = 20을 구하는 M2-RPM-079 문제이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 정사각형 ABCD의 대각선 수직이등분 성질과 45도 각도 분할을 결합해 x = 7, y = 13을 계산하는 PT_QUADRILATERAL_PROPERTIES 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정사각형 ABCD에서 대각선 길이 반분 x = 7과 직각삼각형 각도 계산 y = 13을 합산하는 2단계 문항이다.

**4칸**
- given: 정사각형←stem:「{ cm}$인 정사각형 $ABCD$의」
- goal: 교점←stem:「두 대각선의 교점을 $O$라 하」
- method: 대각선(NAMED)←solution:「정사각형의 두 대각선은」
- condition: 사각형←stem:「cm}$인 정사각형 $ABCD$의」

**how** 정사각형 ABCD에서 x = AO = 7, 각 ODP = 32도에서 y = 45도 - 32도 = 13이므로 x + y = 20임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

정사각형의 두 대각선은 길이가 같고 서로 다른 것을 수직이등분하므로 $x = \overline{AO} = \dfrac{1}{2}\overline{AC} = \dfrac{1}{2}\overline{BD} = 7$ $\triangle DOP$에서 $\angle DOP = 90^\circ$, $\angle DPO = 58^\circ$이므로 $\angle ODP = 90^\circ - 58^\circ = 32^\circ$ 정사각형의 대각선 $BD$는 $\angle ADC = 90^\circ$를 이등분하므로 $\angle ODC = 45^\circ$ 따라서 $y = \angle PDC = 45^\circ - 32^\circ = 13$ $\therefore x + y = 7 + 13 = 20$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 두 변 $AB$, $CD$의 중점을 각각 $M$, $N$이라 하자. $\angle BNC = 46^\circ$, $\angle ADM = 22^\circ$일 때, $\angle BMD$의 크기는?

**보기** ① $118^\circ$  ② $126^\circ$  ③ $134^\circ$  ④ $136^\circ$  ⑤ $144^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 평행사변형 ABCD에서 AB = CD, AD = BC, 각 A = 각 C이다.
2. 2) M, N이 각각 AB, CD의 중점이므로 AM = CN이다.
3. 3) 따라서 삼각형 AMD와 삼각형 CNB는 두 변과 그 끼인각이 같으므로 SAS 합동이다.
4. 4) 그러므로 각 AMD = 각 CNB = 46도이다.
5. 5) A, M, B가 한 직선 위에 있으므로 각 BMD = 180도 - 각 AMD = 180도 - 46도 = 134도이다.
6. 6) 따라서 정답은 134도인 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 두 변 $AB$, $CD$의 중점을 각각 $M$, $N$이라 하자. $\angle BNC = 46^\circ$, $\angle ADM = 22^\circ$일 때, $\angle BMD$의 크기는?」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 평행사변형 ABCD의 중점 M, N으로 인한 삼각형 AMD와 CNB의 합동과 각 BNC = 46도에서 각 BMD = 134도를 구하는 M2-RPM-072 문제이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 평행사변형 ABCD의 대변과 대각 성질로 삼각형 합동을 유도하여 각 BMD = 134도를 계산하는 PT_QUADRILATERAL_PROPERTIES 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형 ABCD에서 중점에 의한 삼각형 합동과 편각 180도 - 46도 = 134도를 구하는 2단계 문항이다.

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에」
- goal: 평행(NAMED)←stem:「평행사변형 $ABC」
- method: 중점(NAMED)←stem:「, $CD$의 중점을 각각 $M$」
- condition: (없음)

**how** 평행사변형 ABCD에서 삼각형 AMD와 CNB의 SAS 합동으로 각 AMD = 46도이므로 각 BMD = 134도임을 확인하여 정답 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형 $ABCD$에서 $\overline{AB} = \overline{CD}$, $\overline{AD} = \overline{BC}$, $\angle A = \angle C$이다. $M$, $N$은 각각 $\overline{AB}$, $\overline{CD}$의 중점이므로 $\overline{AM} = \overline{CN}$이다. 따라서 $\triangle AMD \equiv \triangle CNB$ ($\text{SAS}$ 합동)이므로 $\angle AMD = \angle CNB = 46^\circ$ $A$, $M$, $B$가 한 직선 위에 있으므로 $\therefore \angle BMD = 180^\circ - 46^\circ = 134^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

민수는 $50$원, $100$원, $500$원짜리 동전을 각각 $5$개씩 갖고 있다. 가게에서 $700$원짜리 빵을 살 때, 거스름돈 없이 그 값을 지불하는 모든 방법의 수는?

**보기** ① $1$가지  ② $2$가지  ③ $3$가지  ④ $4$가지  ⑤ $5$가지

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 50원, 100원, 500원 동전 개수를 각각 x, y, z개 (0 <= x, y, z <= 5)라 하자.
2. 2) 50x + 100y + 500z = 700 에서 x + 2y + 10z = 14 이다.
3. 3) z = 0일 때: x + 2y = 14. y <= 5이므로 y = 5, x = 4인 1가지이다.
4. 4) z = 1일 때: x + 2y = 4. (x, y) = (4, 0), (2, 1), (0, 2)의 3가지이다.
5. 5) z >= 2이면 10z >= 20 > 14이므로 불가능하다.
6. 6) 따라서 가능한 지불 방법의 수는 1 + 3 = 4가지인 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「민수는 $50$원, $100$원, $500$원짜리 동전을 각각 $5$개씩 갖고 있다. 가게에서 $700$원짜리 빵을 살 때, 거스름돈 없이 그 값을 지불하는 모든 방법의 수는?」
**RPM** M2-RPM-108 [확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 중복 없이 세기] (원천과 같음)
- 이유: 50원, 100원, 500원 동전으로 700원을 거스름돈 없이 지불하는 경우의 수를 x + 2y + 10z = 14 방정식으로 중복 없이 세는 M2-RPM-108 문제이다.
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=NONE
- 이유: 금액 700원을 만드는 동전 조합을 가장 큰 액수인 500원의 개수 z = 0, 1에 따라 경우를 나누어 세는 PT_M2_BASIC_COUNTING_CASE_SPLIT 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 동전 지불 부정방정식 x + 2y + 10z = 14를 계수가 큰 z 기준으로 케이스를 분류하여 4가지를 구하는 2단계 문항이다.

**4칸**
- given: 양화←stem:「값을 지불하는 모든 방법의 수는?」
- goal: 개수←solution:「원짜리 동전의 개수를 각각 $x$」
- method: 값(NAMED)←stem:「그 값을 지불하는 모든 방법의」
- condition: (없음)

**how** 방정식 x + 2y + 10z = 14에서 z = 0일 때 1가지, z = 1일 때 3가지로 총 4가지 지불 방법이 있음을 확인하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$50$원, $100$원, $500$원짜리 동전의 개수를 각각 $x$, $y$, $z$개라 하면 $50x + 100y + 500z = 700 \implies x + 2y + 10z = 14$ ($0 \le x, y, z \le 5$) (1) $z = 0$일 때: $x + 2y = 14 \implies (x, y) = (4, 5)$의 $1$가지 ($y \le 5$, $x \le 5$) (2) $z = 1$일 때: $x + 2y = 4 \implies (x, y) = (4, 0), (2, 1), (0, 2)$의 $3$가지 따라서 구하는 방법의 수는 $1 + 3 = 4$가지이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

$0$, $1$, $2$, $3$, $4$, $5$, $6$이 각각 하나씩 적힌 카드 $7$장이 있다. 이 중에서 두 장을 뽑아 두 자리 자연수를 만들 때, 만들 수 있는 두 자리 자연수 중에서 $2$의 배수의 개수는?

**보기** ① $18$개  ② $21$개  ③ $22$개  ④ $24$개  ⑤ $25$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 0, 1, 2, 3, 4, 5, 6의 카드 7장으로 두 자리 자연수를 만들 때 2의 배수가 되려면 일의 자리가 0, 2, 4, 6이어야 한다.
2. 2) 일의 자리가 0인 경우: 십의 자리는 1, 2, 3, 4, 5, 6의 6가지이다.
3. 3) 일의 자리가 2, 4, 6인 경우: 각각에 대해 십의 자리는 0과 일의 자리 숫자를 제외한 5가지씩이므로 3 * 5 = 15가지이다.
4. 4) 따라서 만들 수 있는 2의 배수의 개수는 6 + 15 = 21개이다.
5. 5) 따라서 정답은 21개인 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「$0$, $1$, $2$, $3$, $4$, $5$, $6$이 각각 하나씩 적힌 카드 $7$장이 있다. 이 중에서 두 장을 뽑아 두 자리 자연수를 만들 때, 만들 수 있는 두 자리 자연수 중에서 $2$의 배수의 개수는?」
**RPM** M2-RPM-109 [확률 > 경우의 수 > 배열과 선택 > 순서가 있는 경우] (원천과 같음)
- 이유: 0을 포함한 숫자 카드 7장으로 2의 배수인 두 자리 자연수 21개를 십의 자리 0 제외 조건과 일의 자리 짝수 조건으로 세는 M2-RPM-109 문제이다.
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=NONE
- 이유: 일의 자리가 0인 경우 6가지와 2, 4, 6인 경우 15가지를 합의 법칙으로 분류하여 21개를 구하는 PT_M2_BASIC_COUNTING_CASE_SPLIT 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 십의 자리에 0이 올 수 없는 조건과 2의 배수 조건으로 케이스를 나누어 6 + 15 = 21을 구하는 표준 2단계 문항이다.

**4칸**
- given: 자연수←stem:「뽑아 두 자리 자연수를 만들 때,」
- goal: 개수←stem:「2$의 배수의 개수는?」
- method: 배수(NAMED)←solution:「$2$의 배수가 되려면 일의」
- condition: 제외←solution:「자리 숫자를 제외한 $5$가지」

**how** 일의 자리가 0일 때 6가지, 일의 자리가 2, 4, 6일 때 15가지이므로 총 21개임을 확인하여 정답 ②로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$2$의 배수가 되려면 일의 자리 숫자가 $0$, $2$, $4$, $6$ 중 하나여야 한다. (1) 일의 자리가 $0$인 경우: 십의 자리는 $1, 2, 3, 4, 5, 6$의 $6$가지 (2) 일의 자리가 $2$, $4$, $6$ 중 하나인 경우: 십의 자리는 $0$과 일의 자리 숫자를 제외한 $5$가지씩이므로 $3 \times 5 = 15$가지 따라서 $6 + 15 = 21$개이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

두 사람이 가위바위보를 한 번 할 때, 첫 번째 사람이 지지 않는 경우의 수는?

**보기** ① $6$  ② $3$  ③ $4$  ④ $5$  ⑤ $9$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 첫 번째 사람이 이기는 경우는 (가위, 보), (바위, 가위), (보, 바위)의 3가지이다.
2. 2) 첫 번째 사람이 비기는 경우는 (가위, 가위), (바위, 바위), (보, 보)의 3가지이다.
3. 3) 첫 번째 사람이 지지 않는 경우는 이기거나 비기는 경우이므로 3 + 3 = 6가지이다.
4. 4) 따라서 정답은 6인 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 사람이 가위바위보를 한 번 할 때, 첫 번째 사람이 지지 않는 경우의 수는?」
**RPM** M2-RPM-107 [확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택] **원천→판정: 확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 중복 없이 세기 → 확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택**
- 이유: 가위바위보에서 첫 번째 사람이 이기는 3가지와 비기는 3가지를 합하여 지지 않는 경우의 수 6을 구하는 M2-RPM-107 문제이다.
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=NONE
- 이유: 첫 번째 사람이 지지 않는 사건을 이기는 경우 3가지와 비기는 경우 3가지로 나누어 합 6을 구하는 PT_M2_BASIC_COUNTING_CASE_SPLIT 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 가위바위보에서 이기는 3가지와 비기는 3가지를 직접 세어 더하는 기본적인 1단계 문항이다.

**4칸**
- given: 사건←stem:「가위바위보를 한 번 할 때」
- goal: 개수←stem:「않는 경우의 수는?」
- method: 경우분류(NAMED)←solution:「이기는 경우는 (가위, 보)」
- condition: (없음)

**how** 이기는 3가지와 비기는 3가지를 합하여 3 + 3 = 6가지임을 확인하여 정답 ①로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

첫 번째 사람이 이기는 경우는 (가위, 보), (바위, 가위), (보, 바위)의 $3$가지이고, 비기는 경우는 (가위, 가위), (바위, 바위), (보, 보)의 $3$가지이다. 따라서 첫 번째 사람이 지지 않는 경우의 수는 $3 + 3 = 6$이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 3점


**발문**

처음 만난 다섯 명의 학생이 서로 한 번씩 악수를 할 때, 악수의 총 횟수는?

**보기** ① $5$회  ② $6$회  ③ $8$회  ④ $10$회  ⑤ $20$회

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 5명의 학생이 서로 한 번씩 악수를 하는 것은 5명 중에서 순서 없이 2명을 뽑는 경우의 수와 같다.
2. 2) 5명 중 2명을 택하는 조합의 수는 (5 * 4) / 2 = 10이다.
3. 3) 따라서 악수의 총 횟수는 10회이다.
4. 4) 그러므로 정답은 10회인 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「처음 만난 다섯 명의 학생이 서로 한 번씩 악수를 할 때, 악수의 총 횟수는?」
**RPM** M2-RPM-110 [확률 > 경우의 수 > 배열과 선택 > 순서가 없는 경우] (원천과 같음)
- 이유: 5명의 학생 중 악수할 2명을 순서 없이 뽑는 조합 계산 (5 * 4) / 2 = 10으로 악수 횟수를 구하는 M2-RPM-110 문제이다.
**유형** PT=PT_M2_COUNTING / TPL=NONE
- 이유: 서로 다른 5명 중 대표 2명을 뽑는 순서 없는 경우의 수로 악수 횟수 10회를 계산하는 PT_M2_COUNTING 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 5명 중 2명을 순서 없이 택하는 기본 공식 (5 * 4) / 2 = 10을 바로 적용하는 1단계 문항이다.

**4칸**
- given: 개수←stem:「, 악수의 총 횟수는?」
- goal: 조합←solution:「순서 없이 뽑는 경우의 수와」
- method: 순서(NAMED)←solution:「할 $2$명을 순서 없이 뽑는 경」
- condition: (없음)

**how** 5명 중 악수할 2명을 뽑는 경우 (5 * 4) / 2 = 10회임을 확인하여 정답 ④로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$5$명 중에서 악수할 $2$명을 순서 없이 뽑는 경우의 수와 같으므로 $\dfrac{5 \times 4}{2} = 10$회 $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

어느 반에서 남학생 후보 $5$명과 여학생 후보 $3$명 중에서 대표를 뽑으려 한다. 다음 두 상황의 경우의 수를 각각 구하여 합한 값은? (1) 남학생 후보 또는 여학생 후보 중에서 $1$명을 대표로 뽑는 경우의 수 (2) 후보들 중에서 남학생 대표 $1$명, 여학생 대표 $1$명을 뽑는 경우의 수

**보기** ① $19$  ② $21$  ③ $23$  ④ $25$  ⑤ $27$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 남학생 5명 또는 여학생 3명 중에서 1명을 대표로 뽑는 경우: 합의 법칙에 의해 5 + 3 = 8가지이다.
2. 2) 남학생 대표 1명, 여학생 대표 1명을 뽑는 경우: 곱의 법칙에 의해 5 * 3 = 15가지이다.
3. 3) 두 경우의 수의 합은 8 + 15 = 23이다.
4. 4) 따라서 정답은 23인 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「어느 반에서 남학생 후보 $5$명과 여학생 후보 $3$명 중에서 대표를 뽑으려 한다. 다음 두 상황의 경우의 수를 각각 구하여 합한 값은? (1) 남학생 후보 또는 여학생 후보 중에서 $1$명을 대표로 뽑는 경우의 수 (2) 후보들 중에서 남학생 대표 $1$명, 여학생 대표 $1$명을 뽑는 경우의 수」
**RPM** M2-RPM-107 [확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택] (원천과 같음)
- 이유: 남학생 5명, 여학생 3명에서 합의 법칙 5 + 3 = 8과 곱의 법칙 5 * 3 = 15를 구하고 합산하여 23을 구하는 M2-RPM-107 문제이다.
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=NONE
- 이유: 합의 법칙 8가지와 곱의 법칙 15가지의 뜻을 각각 구하여 합산 23을 완성하는 PT_M2_BASIC_COUNTING_CASE_SPLIT 과제이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기본적인 합의 법칙 8과 곱의 법칙 15를 각각 구하고 단순 덧셈 23을 수행하는 1단계 문항이다.

**4칸**
- given: 논리합←stem:「남학생 후보 또는 여학생 후보」
- goal: 값←stem:「각각 구하여 합한 값은?」
- method: 법칙(NAMED)←solution:「(1) 합의 법칙에 의하여 $5」
- condition: 합←solution:「두 경우의 수의 합은 $8 +」

**how** 상황 (1)은 5 + 3 = 8, 상황 (2)는 5 * 3 = 15이므로 합은 8 + 15 = 23임을 확인하여 정답 ③으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 합의 법칙에 의하여 $5 + 3 = 8$가지 (2) 곱의 법칙에 의하여 $5 \times 3 = 15$가지 따라서 두 경우의 수의 합은 $8 + 15 = 23$이다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점


**발문**

집에서 학교까지 가는 길은 $3$가지, 학교에서 도서관까지 가는 길은 $4$가지, 집에서 학교를 거치지 않고 도서관으로 바로 가는 길은 $3$가지가 있다. 집에서 출발하여 도서관으로 가는 모든 경우의 수는? (단, 같은 지점을 두 번 이상 지나지 않는다.)

**보기** ① $10$가지  ② $11$가지  ③ $12$가지  ④ $14$가지  ⑤ $15$가지

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 집에서 학교를 거쳐 도서관으로 가는 경우: 집->학교 3가지, 학교->도서관 4가지이므로 3 * 4 = 12가지이다.
2. 2) 집에서 도서관으로 바로 가는 경우: 3가지이다.
3. 3) 두 경우는 동시에 일어날 수 없으므로 합의 법칙에 의해 전체 경우의 수는 12 + 3 = 15가지이다.
4. 4) 따라서 정답은 15가지인 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「집에서 학교까지 가는 길은 $3$가지, 학교에서 도서관까지 가는 길은 $4$가지, 집에서 학교를 거치지 않고 도서관으로 바로 가는 길은 $3$가지가 있다. 집에서 출발하여 도서관으로 가는 모든 경우의 수는? (단, 같은 지점을 두 번 이상 지나지 않는다.)」
**RPM** M2-RPM-111 [확률 > 경우의 수 > 도형·경로 > 최단경로] (원천과 같음)
- 이유: 경로 문제에서 학교를 거치는 경우 3 * 4 = 12와 바로 가는 경우 3가지를 합하여 전체 15가지를 구하는 M2-RPM-111 문제이다.
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=NONE
- 이유: 경유 경로의 곱의 법칙 12가지와 직통 경로 3가지를 합의 법칙으로 분류하여 15가지를 도출하는 PT_M2_BASIC_COUNTING_CASE_SPLIT 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 곱의 법칙 3 * 4 = 12와 합의 법칙 12 + 3 = 15를 결합하여 경로의 수를 계산하는 2단계 문항이다.

**4칸**
- given: 통과←stem:「두 번 이상 지나지 않는다.)」
- goal: 양화←stem:「서관으로 가는 모든 경우의 수는?」
- method: 합의법칙(NAMED)←solution:「전체 경우의 수는 $12 + 3」
- condition: 점←stem:「단, 같은 지점을 두 번」

**how** 학교 경유 3 * 4 = 12가지와 직통 3가지를 더해 12 + 3 = 15가지임을 확인하여 정답 ⑤로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 학교를 거쳐 도서관으로 가는 경우: $3 \times 4 = 12$가지 (2) 집에서 도서관으로 바로 가는 경우: $3$가지 두 경우는 동시에 일어나지 않으므로 전체 경우의 수는 $12 + 3 = 15$가지이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

$\overline{AB} = \overline{BC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선과 변 $AB$의 교점을 $D$라고 하자. $\overline{BD} = 7\text{ cm}$, $\angle DBC = 36^\circ$일 때, 다음 물음에 답하시오. (1) 이등변삼각형이 되는 조건을 한 문장으로 서술하시오. (2) (1)의 내용을 이용하여 $\overline{AC}$의 길이를 구하는 과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 두 내각의 크기가 같은 삼각형은 이등변삼각형이다. (2) $7\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) (1) 두 내각의 크기가 같은 삼각형은 이등변삼각형이다.
2. 2) AB = BC이고 각 B = 각 DBC = 36도이므로 각 A = 각 ACB = (180도 - 36도) / 2 = 72도이다.
3. 3) CD가 각 ACB의 이등분선이므로 각 BCD = 각 ACD = 36도이다.
4. 4) 삼각형 BCD에서 각 B = 각 BCD = 36도이므로 CD = BD = 7 cm이다.
5. 5) 삼각형 ACD에서 각 ADC = 180도 - (72도 + 36도) = 72도이므로 각 A = 각 ADC = 72도이다.
6. 6) 따라서 AC = CD = 7 cm이다.
- 작성자 답: (1) 두 내각의 크기가 같은 삼각형은 이등변삼각형이다. (2) $7\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB} = \overline{BC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선과 변 $AB$의 교점을 $D$라고 하자. $\overline{BD} = 7\text{ cm}$, $\angle DBC = 36^\circ$일 때, 다음 물음에 답하시오. (1) 이등변삼각형이 되는 조건을 한 문장으로 서술하시오. (2) (1)의 내용을 이용하여 $\overline{AC}$의 길이를 구하는 과정을 서술하시오.」
**RPM** M2-RPM-062 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 판정 > 두 각 조건] (원천과 같음)
- 이유: 이등변삼각형 ABC에서 밑각 각 A = 72도와 각의 이등분선 36도로부터 두 밑각 36도, 72도인 이등변삼각형을 찾아 AC = 7 cm를 구하는 M2-RPM-062 문제이다.
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE
- 이유: 두 내각의 크기가 같으면 이등변삼각형이 됨을 이용하여 삼각형 BCD와 ACD에서 변의 길이 AC = 7 cm를 연쇄 도출하는 PT_ISOSCELES_TRIANGLE 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형 판정 조건 서술과 밑각 36도, 72도를 이용한 선분 AC = 7 cm 계산을 수행하는 2단계 서술형 문항이다.

**4칸**
- given: 이등변삼각형←stem:「e{BC}$인 이등변삼각형 $ABC$에서」
- goal: 길이←stem:「e{AC}$의 길이를 구하는 과정」
- method: 이등분선(NAMED)←stem:「gle C$의 이등분선과 변 $AB$」
- condition: 교점←stem:「변 $AB$의 교점을 $D$라고」

**how** 두 각의 크기가 36도로 같은 삼각형 BCD에서 CD = 7 cm, 두 각이 72도로 같은 삼각형 ACD에서 AC = 7 cm임을 확인하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 두 내각의 크기가 같은 삼각형은 이등변삼각형이다. (2) $\overline{AB} = \overline{BC}$이고 $\angle B = \angle DBC = 36^\circ$이므로 $\angle A = \angle ACB = \dfrac{180^\circ - 36^\circ}{2} = 72^\circ$ $\overline{CD}$가 $\angle ACB$의 이등분선이므로 $\angle BCD = \angle ACD = 36^\circ$ $\triangle BCD$에서 $\angle B = \angle BCD = 36^\circ$이므로 $\overline{CD} = \overline{BD} = 7\text{ cm}$ $\triangle ACD$에서 $\angle ADC = 180^\circ - (72^\circ + 36^\circ) = 72^\circ$이므로 $\angle A = \angle ADC = 72^\circ$ $\therefore \overline{AC} = \overline{CD} = 7\text{ cm}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 4점


**발문**

다음 (1), (2)의 조건을 만족시키는 사각형 $ABCD$가 평행사변형이 되는 이유를 각각 서술하시오. (단, 점 $O$는 두 대각선 $AC$, $BD$의 교점이며 평행사변형이 되는 조건으로 답한다.) (1) $\overline{OA} = \overline{OC} = 5\text{ cm}$, $\overline{OB} = \overline{OD} = 6\text{ cm}$ (2) $\overline{AB} = \overline{CD} = 7\text{ cm}$, $\overline{AD} = \overline{BC} = 9\text{ cm}$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 두 대각선이 서로 다른 것을 이등분한다. (2) 두 쌍의 대변의 길이가 각각 같다.   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) (1) OA = OC = 5 cm, OB = OD = 6 cm이므로 두 대각선 AC와 BD가 서로 다른 것을 이등분한다.
2. 2) (2) AB = CD = 7 cm, AD = BC = 9 cm이므로 두 쌍의 대변의 길이가 각각 같다.
- 작성자 답: (1) 두 대각선이 서로 다른 것을 이등분한다. (2) 두 쌍의 대변의 길이가 각각 같다. → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 (1), (2)의 조건을 만족시키는 사각형 $ABCD$가 평행사변형이 되는 이유를 각각 서술하시오. (단, 점 $O$는 두 대각선 $AC$, $BD$의 교점이며 평행사변형이 되는 조건으로 답한다.) (1) $\overline{OA} = \overline{OC} = 5\text{ cm}$, $\overline{OB} = \overline{OD} = 6\text{ cm}$ (2) $\overline{AB} = \overline{CD} = 7\text{ cm}$, $\overline{AD} = \overline{BC} = 9\text{ cm}$」
**RPM** M2-RPM-075 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 대각선 조건] (원천과 같음)
- 이유: 사각형 ABCD에서 대각선 교점 O의 이등분 조건 5 cm, 6 cm와 대변 길이 상등 7 cm, 9 cm를 평행사변형 조건으로 서술하는 M2-RPM-075 문제이다.
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE
- 이유: 사각형 ABCD가 평행사변형이 되는 조건 중 대각선 이등분과 두 쌍 대변 길이 상등을 판별하는 PT_QUADRILATERAL_PROPERTIES 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 사각형 ABCD에서 대각선 이등분과 대변 길이 상등의 평행사변형 판정 조건 문장을 정확히 서술하는 2단계 서술형 문항이다.

**4칸**
- given: 사각형←stem:「을 만족시키는 사각형 $ABCD$가」
- goal: 평행사변형←stem:「$ABCD$가 평행사변형이 되는 이유를」
- method: 대각선(NAMED)←stem:「$O$는 두 대각선 $AC$, $」
- condition: 교점←stem:「, $BD$의 교점이며 평행사변형」

**how** 사각형 ABCD에서 (1)은 두 대각선이 서로 다른 것을 이등분, (2)는 두 쌍 대변 길이가 각각 같음을 확인하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 두 대각선 $AC$와 $BD$가 교점 $O$에서 서로 다른 것을 이등분($\overline{OA} = \overline{OC}$, $\overline{OB} = \overline{OD}$)하므로 평행사변형이다. (2) 두 쌍의 대변의 길이가 각각 같으므로($\overline{AB} = \overline{CD}$, $\overline{AD} = \overline{BC}$) 평행사변형이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 단답형 5점


**발문**

한 개의 주사위를 두 번 던져서 첫 번째에 나온 눈의 수를 $a$, 두 번째에 나온 눈의 수를 $b$라 하자. 직선 $y = ax + b$가 점 $(-1, 3)$을 지나는 경우를 모두 나열하고 모든 경우의 수를 구하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $(1, 4), (2, 5), (3, 6)$, $3$가지   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) 직선 y = ax + b가 점 (-1, 3)을 지나므로 3 = -a + b 에서 b = a + 3 이다.
2. 2) 주사위 눈 a, b는 1 이상 6 이하의 자연수이다.
3. 3) a = 1일 때: b = 1 + 3 = 4 이므로 (1, 4)
4. 4) a = 2일 때: b = 2 + 3 = 5 이므로 (2, 5)
5. 5) a = 3일 때: b = 3 + 3 = 6 이므로 (3, 6)
6. 6) a >= 4이면 b >= 7이 되어 주사위 눈의 범위를 벗어난다.
7. 7) 따라서 순서쌍은 (1, 4), (2, 5), (3, 6)이고 총 경우의 수는 3가지이다.
- 작성자 답: (1, 4), (2, 5), (3, 6), 3가지 → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-08(확률) / M2-08-PROBABILITY_COUNTING(경우의 수와 확률) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 개의 주사위를 두 번 던져서 첫 번째에 나온 눈의 수를 $a$, 두 번째에 나온 눈의 수를 $b$라 하자. 직선 $y = ax + b$가 점 $(-1, 3)$을 지나는 경우를 모두 나열하고 모든 경우의 수를 구하시오.」
**RPM** M2-RPM-107 [확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택] **원천→판정: 확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 중복 없이 세기 → 확률 > 경우의 수 > 합의 법칙과 곱의 법칙 > 단계별 선택**
- 이유: 직선 y = ax + b가 (-1, 3)을 지나는 관계식 b = a + 3에서 주사위 눈 1부터 6까지의 순서쌍 (1, 4), (2, 5), (3, 6) 3가지를 구하는 M2-RPM-107 문제이다.
**유형** PT=PT_M2_BASIC_COUNTING_CASE_SPLIT / TPL=NONE
- 이유: 직선 y = ax + b의 좌표 대입 식 b = a + 3을 만족하는 주사위 눈 a, b의 순서쌍 3가지를 일일이 나열하여 경우의 수를 세는 PT_M2_BASIC_COUNTING_CASE_SPLIT 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직선 y = ax + b의 좌표 대입 3 = -a + b와 주사위 자연수 범위 제약에서 3가지 경우를 찾아 나열하는 2단계 서술형 문항이다.

**4칸**
- given: 직선←stem:「b$라 하자. 직선 $y = ax」
- goal: 양화←stem:「모두 나열하고 모든 경우의 수를」
- method: 자연수(NAMED)←solution:「$6$ 이하의 자연수이므로 $a =」
- condition: 통과←stem:「1, 3)$을 지나는 경우를 모두」

**how** 직선 y = ax + b에서 3 = -a + b이므로 b = a + 3에서 (1, 4), (2, 5), (3, 6)의 3가지가 성립함을 확인하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직선 $y = ax + b$가 점 $(-1, 3)$을 지나므로 $3 = -a + b \implies b = a + 3$ $a$, $b$는 $1$ 이상 $6$ 이하의 자연수이므로 $a = 1$일 때 $b = 4$ $a = 2$일 때 $b = 5$ $a = 3$일 때 $b = 6$ $a \ge 4$일 때 $b \ge 7$이므로 주사위 눈의 범위를 벗어난다. 따라서 $(a, b)$는 $(1, 4)$, $(2, 5)$, $(3, 6)$의 $3$가지이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

지수는 지도에서 한 직선 위에 있지 않은 세 지점(우체국, 서점, 공원)으로부터 같은 거리에 있는 지점에 약속 장소를 정하려고 한다. 지도에 표시된 도서관, 시청, 미술관 중 도서관이 세 지점을 꼭짓점으로 하는 삼각형의 세 변의 수직이등분선의 교점 위에 있을 때, 다음 물음에 답하시오. (1) 지수가 찾는 약속 장소는 어디인지 쓰시오. (2) 그 지점에 해당하는 수학 용어를 쓰고, 그 지점을 작도할 때 필요한 각도·방법과 그 수학 용어와 관련된 성질을 $1$가지 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) 도서관, (2) 외심, $90^\circ$로 세 변의 수직이등분선을 작도하며 외심에서 삼각형의 세 꼭짓점까지의 거리는 같다.   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 1) (1) 세 지점(우체국, 서점, 공원)으로부터 같은 거리에 있는 지점은 세 꼭짓점에서 같은 거리에 있는 삼각형의 외심이다.
2. 2) 세 변의 수직이등분선의 교점 위에 도서관이 있으므로 지수가 찾는 약속 장소는 도서관이다.
3. 3) (2) 해당 수학 용어는 외심이다.
4. 4) 외심을 작도하는 방법은 각 변의 중점을 지나고 변과 90도를 이루는 수직이등분선을 작도하여 그 교점을 찾는 것이다.
5. 5) 외심의 성질 1가지는 외심에서 삼각형의 세 꼭짓점까지의 거리는 모두 같다는 것이다.
- 작성자 답: (1) 도서관, (2) 외심, $90^\circ$로 세 변의 수직이등분선을 작도하며 외심에서 삼각형의 세 꼭짓점까지의 거리는 같다. → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「지수는 지도에서 한 직선 위에 있지 않은 세 지점(우체국, 서점, 공원)으로부터 같은 거리에 있는 지점에 약속 장소를 정하려고 한다. 지도에 표시된 도서관, 시청, 미술관 중 도서관이 세 지점을 꼭짓점으로 하는 삼각형의 세 변의 수직이등분선의 교점 위에 있을 때, 다음 물음에 답하시오. (1) 지수가 찾는 약속 장소는 어디인지 쓰시오. (2) 그 지점에 해당하는 수학 용어를 쓰고, 그 지점을 작도할 때 필요한 각도·방법과 그 수학 용어와 관련된 성질을 $1$가지 서술하시오.」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] (원천과 같음)
- 이유: 각 변과 90도를 이루는 세 변의 수직이등분선의 교점인 외심 도서관을 찾고 외심의 정의와 꼭짓점에 이르는 거리 성질을 서술하는 M2-RPM-064 문제이다.
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE
- 이유: 세 점으로부터 같은 거리에 있는 외심의 뜻과 90도 수직이등분선 작도 방법, 꼭짓점 거리 상등 성질을 종합 서술하는 PT_TRIANGLE_CENTERS 과제이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 각 변과 90도를 이루는 수직이등분선 교점인 외심 도서관을 찾고 작도와 성질을 서술하는 2단계 문항이다.

**4칸**
- given: 삼각형←stem:「짓점으로 하는 삼각형의 세 변의 수」
- goal: 거리←stem:「으로부터 같은 거리에 있는 지점에」
- method: 수직이등분선(NAMED)←stem:「형의 세 변의 수직이등분선의 교점 위에」
- condition: 꼭짓점←stem:「이 세 지점을 꼭짓점으로 하는 삼각」

**how** 각 변과 90도를 이루는 수직이등분선의 교점이 외심이므로 도서관이고, 외심의 작도법과 꼭짓점까지의 거리가 같음을 서술하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 세 지점으로부터 같은 거리에 있는 점은 삼각형의 외심이므로 도서관이다. (2) 수학 용어는 외심이다. 각 변의 중점을 지나고 변과 $90^\circ$를 이루는 수직이등분선을 작도하여 그 교점을 찾는다. 외심에서 삼각형의 세 꼭짓점까지의 거리는 모두 같다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
