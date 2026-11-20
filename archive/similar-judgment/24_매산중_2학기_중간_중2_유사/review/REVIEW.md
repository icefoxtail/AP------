# 검수 묶음 — 24_매산중_2학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 24개 / 검사 PASS 23, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 6, 2단계 13, 3단계 5
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 풀이 과정에 정답 값이 등장하지 않음
- **Q3**: 풀이 과정에 정답 값이 등장하지 않음
- **Q4**: 원천 값과 다른 칸 2개 (TPL, 난이도)
- **Q6**: 원천 값과 다른 칸 2개 (TPL, 난이도)
- **Q7**: 원천 값과 다른 칸 2개 (TPL, 난이도) / 난이도 경계 (confidence=high, 원천 경계 B12) / 풀이 과정에 정답 값이 등장하지 않음
- **Q8**: 원천 값과 다른 칸 2개 (TPL, 난이도)
- **Q10**: 원천 값과 다른 칸 2개 (PT, TPL) / 난이도 경계 (confidence=high, 원천 경계 B23) / 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 원천 값과 다른 칸 2개 (PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 원천 값과 다른 칸 2개 (TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 원천 값과 다른 칸 2개 (TPL, 난이도) / 난이도 경계 (confidence=high, 원천 경계 B23) / 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 원천 값과 다른 칸 3개 (소단원, RPM, TPL) / 난이도 경계 (confidence=high, 원천 경계 B12) / 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 원천 값과 다른 칸 2개 (소단원, TPL)
- **Q17**: 원천 값과 다른 칸 3개 (소단원, RPM, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 원천 값과 다른 칸 2개 (소단원, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도) / 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 원천 값과 다른 칸 2개 (소단원, TPL) / 난이도 경계 (confidence=high, 원천 경계 B34) / 풀이 과정에 정답 값이 등장하지 않음
- **Q22**: 원천 값과 다른 칸 2개 (RPM, TPL) / 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q23**: 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)
- **Q24**: 원천 값과 다른 칸 3개 (소단원, TPL, 난이도)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\triangle ABC$에서 $\overline{AB}=\overline{AC}$이고, $\angle A$의 이등분선이 변 $BC$와 만나는 점을 $D$라 하자. $\overline{BC}=24\text{ cm}$이고 $\overline{BD}=x\text{ cm}$, $\angle ADC=y^\circ$일 때, $x+y$의 값은? [3점]

**보기** ① $98$  ② $100$  ③ $102$  ④ $104$  ⑤ $106$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABD$와 $\triangle ACD$에서 $\overline{AB}=\overline{AC}$, $\angle BAD=\angle CAD$, $\overline{AD}$는 공통이다. (ABC)
2. 두 삼각형은 SAS 합동이므로 $\overline{BD}=\overline{CD}$, $\angle ADB=\angle ADC=90^\circ$이다. (ABC)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$」
**RPM** M2-RPM-061 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 꼭짓각의 이등분선] (원천과 같음)
- 이유: 삼각형의 성질 단원의 이등변삼각형의 꼭짓각의 이등분선 유형이다. (ABC)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_VERTEX_BISECTOR → NONE**
- 이유: 이등변삼각형의 꼭짓각 이등분선과 밑변 수직이등분 기본 유형이다. (ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형의 꼭짓각의 이등분선 성질을 확인하는 난이도 1 문항이다. (ABC)

**4칸**
- given: 이등분선←stem:「angle A$의 이등분선이 변 $BC$와」
- goal: 합동←solution:「triangle ABD \equiv \triangle ACD」
- method: 합동조건(NAMED)←solution:「SAS 합동」
- condition: (없음)

**how** 이등변삼각형의 꼭짓각 이등분선에 의해 생기는 두 삼각형의 SAS 합동을 확인했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABD$와 $\triangle ACD$에서 $\overline{AB}=\overline{AC}$, $\angle BAD=\angle CAD$, $\overline{AD}$는 공통이므로 $\triangle ABD \equiv \triangle ACD$ (SAS 합동)이다. 따라서 $\overline{BD}=\overline{CD}=\dfrac{1}{2}\overline{BC}=\dfrac{1}{2}\times 24=12\text{ cm}$이므로 $x=12$이다. 또 $\angle ADB=\angle ADC$이고 $\angle ADB+\angle ADC=180^\circ$이므로 $\angle ADC=90^\circ$, 즉 $y=90$이다. $\therefore x+y=12+90=102$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 변 $BC$의 연장선 위의 한 점 $D$에 대하여 $\angle ACD=112^\circ$일 때, $\angle A$의 크기는? [4점]

**보기** ① $34^\circ$  ② $38^\circ$  ③ $42^\circ$  ④ $44^\circ$  ⑤ $48^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle ACB = 180^\circ - 112^\circ = 68^\circ$이다. (AB)
2. 이등변삼각형의 두 밑각의 크기는 같으므로 $\angle ABC = \angle ACB = 68^\circ$이다.
3. 따라서 $\angle A = 180^\circ - (68^\circ + 68^\circ) = 44^\circ$이다. (AB)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] (원천과 같음)
- 이유: 삼각형의 성질 단원의 이등변삼각형의 밑각 유형이다. (AB)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_BASE_ANGLES → NONE**
- 이유: 이등변삼각형의 밑각과 외각 성질 계산 기본 유형이다. (AB)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형의 외각과 밑각의 성질을 이용해 꼭짓각을 구하는 난이도 1 문항이다. (AB)

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서」
- goal: 삼각형←stem:「angle A$의 크기는?」
- method: 이등변삼각형(NAMED)←solution:「\angle ABC=\angle ACB=68^\circ」
- condition: (없음)

**how** 외각에서 밑각 68도를 구하고 두 밑각의 합을 180도에서 빼서 꼭짓각 44도를 구했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle ACB=180^\circ-\angle ACD=180^\circ-112^\circ=68^\circ$ $\overline{AB}=\overline{AC}$이므로 $\angle ABC=\angle ACB=68^\circ$ $\therefore \angle A=180^\circ-(68^\circ+68^\circ)=44^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\overline{AB}$의 양 끝 점 $A$, $B$에서 $\overline{AB}$의 중점 $M$을 지나는 직선 $l$에 내린 수선의 발을 각각 $D$, $C$라 하자. $\overline{BC}=14\text{ cm}$, $\angle DAM=58^\circ$일 때, $\overline{AD}=x\text{ cm}$, $\angle BMC=y^\circ$라 하면 $x+y$의 값은? [4점]

**보기** ① $46$  ② $48$  ③ $50$  ④ $52$  ⑤ $72$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle ADM = \angle BCM = 90^\circ$, $\overline{AM} = \overline{BM}$ (중점), $\angle AMD = \angle BMC$ (맞꼭지각). (AB)
2. 빗변의 길이와 한 예각의 크기가 같으므로 두 직각삼각형은 RHA 합동이다. (AB)
3. 따라서 $\triangle AMD \equiv \triangle BMC$이다. (AB)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}$」
**RPM** M2-RPM-071 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA] (원천과 같음)
- 이유: 삼각형의 성질 단원의 직각삼각형의 합동 RHA 유형이다. (AB)
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=NONE (원천과 같음) **원천→판정: TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE → NONE**
- 이유: 직각삼각형의 합동 조건 RHA 판정 유형이다. (AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 직각삼각형의 합동 조건(RHA)을 기하 그림에서 판정하는 난이도 2 문항이다. (AB)

**4칸**
- given: 중점←stem:「$\overline{AB}$의 중점 $M$을」
- goal: 수선←stem:「수선의 발을 각각 $D$, $C$라 하자.」
- method: 합동(NAMED)←solution:「RHA 합동」
- condition: 직선←stem:「지나는 직선 $l$에 내린」

**how** 빗변과 한 예각의 크기가 같음을 확인하여 RHA 직각삼각형 합동을 판정했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle AMD$와 $\triangle BMC$에서 $\angle ADM=\angle BCM=90^\circ$, $\overline{AM}=\overline{BM}$, $\angle AMD=\angle BMC$ (맞꼭지각)이므로 $\triangle AMD \equiv \triangle BMC$ (RHA 합동)이다. 따라서 $\overline{AD}=\overline{BC}=14\text{ cm}$이므로 $x=14$이다. $\triangle AMD$에서 $\angle AMD=180^\circ-90^\circ-58^\circ=32^\circ$이고 맞꼭지각에 의해 $\angle BMC=32^\circ$이므로 $y=32$이다. $\therefore x+y=14+32=46$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)

**발문**

점 $O$가 예각삼각형 $ABC$의 외심이고 $\angle AOB=116^\circ$일 때, $\angle ACB$의 크기는? [4점]

**보기** ① $54^\circ$  ② $58^\circ$  ③ $62^\circ$  ④ $64^\circ$  ⑤ $68^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심에서 꼭짓점을 잇는 각과 대각의 관계는 $\angle AOB = 2\angle ACB$이다. (ABC)
2. 따라서 $\angle ACB = \dfrac{1}{2}\angle AOB = \dfrac{1}{2} \times 116^\circ = 58^\circ$이다. (ABC)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$가 예각삼각형 $A」
**RPM** M2-RPM-065 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각] (원천과 같음)
- 이유: 삼각형의 성질 단원의 외심의 위치·각 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CIRCUMCENTER → NONE**
- 이유: 삼각형의 외심과 각의 크기 중심각 계산 유형이다. (ABC)
**난이도** 1 (confidence=high, 경계=NONE) **원천→판정: 2 → 1**
- 이유: 삼각형의 외심에서 꼭짓각과 중심각의 비례 관계를 적용하는 난이도 1 문항이다. (ABC)

**4칸**
- given: 외심←stem:「점 $O$가 예각삼각형 $ABC$의 외심이고」
- goal: 삼각형←stem:「angle ACB$의 크기는?」
- method: 외심(NAMED)←solution:「\angle OAB=\angle OBA=\dfrac{180^\circ-116^\circ}{2}=32^\circ」
- condition: 예각←stem:「예각삼각형 $ABC$」

**how** 외심의 중심각과 원주각 2배 공식을 적용하여 각 ACB=58도를 계산했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{OA}=\overline{OB}$이므로 $\angle OAB=\angle OBA=\dfrac{180^\circ-116^\circ}{2}=32^\circ$이다. $\overline{OA}=\overline{OC}$, $\overline{OB}=\overline{OC}$이므로 $\angle OAC=\angle OCA=a$, $\angle OBC=\angle OCB=b$라 하면 $\triangle ABC$의 세 내각의 합에서 $(32^\circ+a)+(32^\circ+b)+(a+b)=180^\circ$ $64^\circ+2(a+b)=180^\circ$, $2(a+b)=116^\circ$, $\therefore a+b=58^\circ$ $\therefore \angle ACB=a+b=58^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

점 $O$가 $\triangle ABC$의 외심이고, 점 $O$에서 세 변 $AB$, $BC$, $CA$에 내린 수선의 발을 각각 $D$, $E$, $F$라 할 때, 다음 중 항상 옳다고 할 수 없는 것은? [4점]

**보기** ① $\overline{OB}=\overline{OC}$  ② $\overline{AD}=\overline{BD}$  ③ $\angle OAC=\angle OCA$  ④ $\triangle OCF \equiv \triangle OAF$  ⑤ $\overline{OD}=\overline{OE}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 외심은 세 변의 수직이등분선의 교점이므로 외심에서 세 꼭짓점에 이르는 거리는 반지름으로 같다. (ABC)
2. 세 변에 내린 수선의 발까지의 거리가 같은 것은 내심의 성질이므로 ⑤ $\overline{OD}=\overline{OE}=\overline{OF}$는 외심에서 항상 성립하지 않는다. (ABC)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $O$가 $\triang」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] (원천과 같음)
- 이유: 삼각형의 성질 단원의 수직이등분선과 외심 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CIRCUMCENTER → NONE**
- 이유: 삼각형의 외심의 정의와 성질 참거짓 판별 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외심과 내심의 정의 및 성질의 차이를 구별하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 외심←stem:「점 $O$가 $\triangle ABC$의 외심이고」
- goal: 수선←stem:「수선의 발을 각각 $D$, $E$, $F$라 할 때」
- method: 반지름(NAMED)←solution:「외접원의 반지름이므로 항상 같다.」
- condition: (없음)

**how** 외심의 성질(꼭짓점 거리 일치)과 내심의 성질(변 거리 일치)을 대조해 ⑤의 부적합성을 판정했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

① $\overline{OB}$, $\overline{OC}$는 외접원의 반지름이므로 항상 같다. ②, ④ $\triangle OAD \equiv \triangle OBD$, $\triangle OCF \equiv \triangle OAF$ (RHS 합동)이므로 $\overline{AD}=\overline{BD}$이고 합동이 성립한다. ③ $\overline{OA}=\overline{OC}$인 이등변삼각형이므로 $\angle OAC=\angle OCA$이다. ⑤ $\overline{OD}$와 $\overline{OE}$는 외심에서 서로 다른 두 변까지의 거리이므로 항상 같다고 할 수 없다(세 변까지의 거리가 같은 것은 내심이다). $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)

**발문**

점 $I$가 $\triangle ABC$의 내심이고 $\angle ACI=28^\circ$, $\angle BIC=118^\circ$일 때, $\angle IBC$의 크기는? [4점]

**보기** ① $34^\circ$  ② $32^\circ$  ③ $30^\circ$  ④ $28^\circ$  ⑤ $26^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 내심은 각의 이등분선의 교점이므로 $\angle ICB = \angle ACI = 28^\circ$이다. (ABC)
2. $\triangle BIC$에서 세 내각의 합은 $180^\circ$이므로 $\angle IBC + 118^\circ + 28^\circ = 180^\circ$이다. (ABC)
3. 따라서 $\angle IBC = 180^\circ - 146^\circ = 34^\circ$이다. (ABC)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $I$가 $\triang」
**RPM** M2-RPM-066 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] (원천과 같음)
- 이유: 삼각형의 성질 단원의 각의 이등분선과 내심 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_INCENTER → NONE**
- 이유: 삼각형의 내심과 각의 크기 계산 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 내심의 정의와 삼각형 내부 삼각형의 각의 합을 연계하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 내심←stem:「점 $I$가 $\triangle ABC$의 내심이고」
- goal: 내심←solution:「내심 $I$는 세 내각의 이등분선의 교점이므로」
- method: 이등분선(NAMED)←solution:「세 내각의 이등분선의 교점이므로 $\angle ICB=\angle ACI=28^\circ$이다.」
- condition: (없음)

**how** 내심의 각 이등분 성질과 삼각형 BIC의 내각 합 180도를 이용해 각 IBC=34도를 계산했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

내심 $I$는 세 내각의 이등분선의 교점이므로 $\angle ICB=\angle ACI=28^\circ$이다. $\triangle BIC$에서 $\angle IBC+28^\circ+118^\circ=180^\circ$ $\therefore \angle IBC=180^\circ-146^\circ=34^\circ$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

점 $I$가 $\triangle ABC$의 내심이고, 점 $I$에서 두 변 $AB$, $BC$에 내린 수선의 발을 각각 $D$, $E$라 하자. $\overline{ID}=7\text{ cm}$, $\angle IBC=36^\circ$, $\angle ICB=29^\circ$일 때, $\overline{IE}=y\text{ cm}$, $\angle BIC=x^\circ$라 하면 $x+y$의 값은? [4점]

**보기** ① $115$  ② $119$  ③ $122$  ④ $125$  ⑤ $129$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 내심에서 세 변에 이르는 거리는 내접원 반지름으로 같으므로 $y = \overline{IE} = \overline{ID} = 7$이다. (ABC)
2. $\triangle BIC$에서 내각의 성질로 각 $x$를 구한다. (ABC)
3. 구한 $x$와 $y$의 값을 종합한다. (ABC)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $I$가 $\triang」
**RPM** M2-RPM-067 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 내심과 거리] (원천과 같음)
- 이유: 삼각형의 성질 단원의 내심과 거리 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_INCENTER → NONE**
- 이유: 삼각형의 내심의 변 거리 및 각의 크기 복합 계산 유형이다. (ABC)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 1 → 2**
- 이유: 내심의 변 거리 일치 성질과 각도 계산을 결합하는 난이도 2 문항이다. (ABC)

**4칸**
- given: 내심←stem:「점 $I$가 $\triangle ABC$의 내심이고」
- goal: 수선←stem:「수선의 발을 각각 $D$, $E$라 하자.」
- method: 거리(NAMED)←solution:「내심 $I$에서 삼각형의 세 변까지의 거리는 모두 같으므로」
- condition: (없음)

**how** 내심에서 변까지의 거리 일치 성질로 y=7을 확정하고 내각 합으로 x를 계산했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

내심 $I$에서 삼각형의 세 변까지의 거리는 모두 같으므로 $y=\overline{IE}=\overline{ID}=7$이다. $\triangle BIC$에서 $x=180-36-29=115$이다. $\therefore x+y=115+7=122$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)

**발문**

$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 점 $I$는 내심이고, 점 $O$는 외심이다. $\angle A=84^\circ$일 때, $\angle IBO$의 크기는? [5점]

**보기** ① $12^\circ$  ② $14^\circ$  ③ $16^\circ$  ④ $18^\circ$  ⑤ $20^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 이등변삼각형에서 밑각 $\angle ABC = (180^\circ - 84^\circ)/2 = 48^\circ$이다.
2. 내심 선분 $BI$는 각의 이등분선이므로 $\angle IBC = 24^\circ$이다. (AB)
3. 외심 $\triangle OBC$에서 $\angle BOC = 2 \times 84^\circ = 168^\circ$이므로 $\angle OBC = (180^\circ - 168^\circ)/2 = 6^\circ$이다. (AB)
4. 따라서 $\angle IBO = 24^\circ - 6^\circ = 18^\circ$이다. (AB)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=」
**RPM** M2-RPM-069 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 외심·내심을 이용한 복합도형] (원천과 같음)
- 이유: 삼각형의 성질 단원의 외심·내심을 이용한 복합도형 유형이다. (AB)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CENTERS_COMBINED → NONE**
- 이유: 이등변삼각형의 외심과 내심이 이루는 각 복합 계산 유형이다. (AB)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 외심과 내심이 한 도형에 공존할 때 두 중심이 이루는 각을 추론하는 난이도 2 문항이다. (AB)

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서」
- goal: 내심←stem:「점 $I$는 내심이고」
- method: 이등분선(NAMED)←solution:「이등분선이므로 $\angle IBC=\dfrac{1}{2}\angle ABC=24^\circ$」
- condition: 외심←stem:「점 $O$는 외심이다.」

**how** 이등변삼각형의 밑각에서 내심 각과 외심 각을 각각 구해 차 각 IBO를 계산했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB}=\overline{AC}$이므로 $\angle ABC=\dfrac{180^\circ-84^\circ}{2}=48^\circ$이다. $BI$는 $\angle B$의 이등분선이므로 $\angle IBC=\dfrac{1}{2}\angle ABC=24^\circ$이다. 한편 $\overline{AB}=\overline{AC}$, $\overline{OB}=\overline{OC}$, $\overline{AO}$는 공통이므로 $\triangle AOB \equiv \triangle AOC$ (SSS 합동)이고 $\angle BAO=\dfrac{1}{2}\angle A=42^\circ$이다. $\overline{OA}=\overline{OB}$이므로 $\angle ABO=\angle BAO=42^\circ$이고, $\angle OBC=48^\circ-42^\circ=6^\circ$이다. $\therefore \angle IBO=\angle IBC-\angle OBC=24^\circ-6^\circ=18^\circ$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 3점


**발문**

평행사변형 $ABCD$에서 $\overline{AD}=x\text{ cm}$, $\overline{BC}=9\text{ cm}$, $\angle C=65^\circ$, $\angle D=y^\circ$일 때, $x$, $y$의 값은? [3점]

**보기** ① $x=7,\ y=115$  ② $x=9,\ y=115$  ③ $x=9,\ y=65$  ④ $x=9,\ y=125$  ⑤ $x=11,\ y=115$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형의 대변의 길이는 같으므로 $x = \overline{AD} = \overline{BC} = 9$이다. (ABCD)
2. 이웃하는 두 내각의 합은 $180^\circ$이므로 $y = 180^\circ - 65^\circ = 115^\circ$이다. (ABCD)
3. $x$와 $y$의 값을 종합한다. (ABCD)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: 사각형의 성질 단원의 평행사변형의 변·각의 성질 유형이다. (ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE (원천과 같음) **원천→판정: TPL_QUADRILATERAL_PROPERTIES → NONE**
- 이유: 평행사변형의 대변의 길이와 대각의 크기 기본 계산 유형이다. (ABCD)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형의 대변과 대각의 기본 성질을 확인하는 난이도 1 문항이다. (ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서」
- goal: 평행←stem:「angle C=65^\circ」
- method: 길이(NAMED)←solution:「평행사변형에서 마주 보는 변의 길이는 같으므로」
- condition: (없음)

**how** 평행사변형의 대변 길이 일치와 이웃 내각의 합 180도 성질로 x=9, y=115를 구했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

평행사변형에서 마주 보는 변의 길이는 같으므로 $x=\overline{AD}=\overline{BC}=9$이다. 이웃한 두 내각의 합은 $180^\circ$이므로 $y=180-65=115$이다. $\therefore x=9,\ y=115$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 조건을 만족시키는 사각형 $ABCD$ 중 평행사변형이 아닌 것은? [4점]

**보기** ① $\overline{AB}=\overline{DC}=7\text{ cm}$, $\overline{AD}=\overline{BC}=5\text{ cm}$  ② $\angle BAC=\angle DCA=35^\circ$, $\angle BCA=\angle DAC=45^\circ$  ③ 두 대각선 $AC$, $BD$의 교점을 $O$라 할 때, $\overline{AO}=\overline{CO}=4\text{ cm}$, $\overline{BO}=\overline{DO}=6\text{ cm}$  ④ $\overline{AD}\parallel\overline{BC}$, $\overline{AD}=\overline{BC}=8\text{ cm}$  ⑤ $\angle A=62^\circ$, $\angle B=118^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형이 되는 다섯 가지 조건을 점검한다. (ABCD)
2. ⑤ 한 쌍의 대변이 평행하고 다른 한 쌍의 대변의 길이가 같은 것은 등변사다리꼴일 수 있으므로 평행사변형 조건이 아니다. (ABCD)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 조건을 만족시키는 사각」
**RPM** M2-RPM-074 [사각형의 성질 > 평행사변형 > 평행사변형의 판정 > 변·각 조건] (원천과 같음)
- 이유: 사각형의 성질 단원의 평행사변형의 판정 변·각 조건 유형이다. (ABCD)
**유형** PT=PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_MG_PARALLELOGRAM_CONDITIONS_IDENTIFICATION** **원천→판정: TPL_QUADRILATERAL_CRITERIA → NONE**
- 이유: 평행사변형이 되기 위한 조건 판별 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형이 되는 조건과 사다리꼴 반례를 구별하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 사각형←stem:「사각형 $ABCD$ 중」
- goal: 평행사변형←stem:「평행사변형이 아닌 것은?」
- method: 엇각(NAMED)←solution:「엇각의 크기가 같으므로」
- condition: 조건←stem:「다음 조건을 만족시키는」

**how** 평행사변형 결정 조건 다섯 가지를 대조하여 등변사다리꼴 반례가 있는 ⑤를 판정했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

① 두 쌍의 대변의 길이가 각각 같으므로 평행사변형이다. ② 엇각의 크기가 같으므로 $\overline{AB}\parallel\overline{DC}$, $\overline{AD}\parallel\overline{BC}$이어서 평행사변형이다. ③ 두 대각선이 서로를 이등분하므로 평행사변형이다. ④ 한 쌍의 대변이 평행하고 그 길이가 같으므로 평행사변형이다. ⑤ 이웃한 두 각의 합이 $62^\circ+118^\circ=180^\circ$이므로 $\overline{AD}\parallel\overline{BC}$이지만, 나머지 한 쌍의 대변 $\overline{AB}$, $\overline{DC}$가 평행하다고 단정할 수 없으므로 사다리꼴일 수 있어 평행사변형이 아니다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

마름모 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\overline{OB}=13\text{ cm}$, $\overline{OD}=(2x+5)\text{ cm}$, $\angle OBC=32^\circ$, $\angle DAC=y^\circ$일 때, $x+y$의 값은? [4점]

**보기** ① $58$  ② $62$  ③ $64$  ④ $68$  ⑤ $72$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 마름모의 두 대각선은 서로를 수직이등분한다. (ABCD)
2. $\overline{OD} = \overline{OB} = 13$이므로 $2x + 5 = 13 \implies 2x = 8 \implies x = 4$이다. (ABCD)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$에서 두」
**RPM** M2-RPM-079 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] (원천과 같음)
- 이유: 사각형의 성질 단원의 특수 사각형의 대각선 성질 마름모 유형이다. (ABCD)
**유형** PT=PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES** **원천→판정: TPL_SPECIAL_QUADRILATERALS → NONE**
- 이유: 마름모의 대각선 성질과 미지수 계산 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 마름모의 대각선 이등분 성질을 이용해 미지수를 구하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 마름모←stem:「마름모 $ABCD$에서」
- goal: 교점←stem:「두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
- method: 대각선(NAMED)←solution:「마름모의 두 대각선은 서로를 이등분하므로」
- condition: 대각선←stem:「두 대각선 $AC$, $BD$」

**how** 마름모의 대각선 서로 이등분 성질로 일차방정식 2x+5=13을 풀어 x=4를 구했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

마름모의 두 대각선은 서로를 이등분하므로 $\overline{OD}=\overline{OB}=13\text{ cm}$이다. $2x+5=13 \implies 2x=8 \implies x=4$ 또 대각선 $BD$는 $\angle B$를 이등분하므로 $\angle B=2\times 32^\circ=64^\circ$이다. $\angle A=180^\circ-64^\circ=116^\circ$이고, 대각선 $AC$는 $\angle A$를 이등분하므로 $y=\dfrac{116}{2}=58$이다. $\therefore x+y=4+58=62$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 대각선의 교점이 $O$인 평행사변형 $ABCD$가 직사각형이 되는 조건으로 옳지 않은 것은? [4점]

**보기** ① $\angle ABC=90^\circ$  ② $\overline{OA}=\overline{OB}$  ③ $\overline{AC}=\overline{BD}$  ④ $\overline{AC}\perp\overline{BD}$  ⑤ $\angle BAD=\angle CDA$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 평행사변형이 직사각형이 되는 조건: 한 내각이 $90^\circ$이거나 두 대각선의 길이가 같을 때. (ABCD)
2. ④ 두 대각선이 서로 수직인 것은 마름모가 되는 조건이므로 직사각형 조건으로 옳지 않다. (ABCD)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 대각선의 교점이 $O$인」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] (원천과 같음)
- 이유: 사각형의 성질 단원의 조건으로 사각형 판정 직사각형 전환 유형이다. (ABCD)
**유형** PT=PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_MG_PARALLELOGRAM_TO_RECTANGLE_CONDITIONS** **원천→판정: TPL_SPECIAL_QUADRILATERALS → NONE**
- 이유: 평행사변형이 직사각형이 되는 조건 판별 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행사변형에서 직사각형으로의 전환 조건과 마름모 전환 조건을 구별하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$가」
- goal: 직사각형←stem:「직사각형이 되는 조건으로 옳지 않은 것은?」
- method: 대각선(NAMED)←solution:「두 대각선의 길이가 같은 평행사변형은 직사각형이다.」
- condition: 조건←stem:「조건으로 옳지 않은 것은?」

**how** 직사각형의 조건(직각 내각, 대각선 길이 일치)과 마름모 조건(대각선 수직)을 구별했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

① 한 내각이 $90^\circ$인 평행사변형은 직사각형이다. ② $\overline{OA}=\overline{OB}$이면 $\overline{AC}=2\overline{OA}=2\overline{OB}=\overline{BD}$이므로 직사각형이다. ③ 두 대각선의 길이가 같은 평행사변형은 직사각형이다. ④ 두 대각선이 수직인 평행사변형은 마름모가 되는 조건이므로 항상 직사각형이 되지는 않는다. ⑤ $\angle BAD+\angle CDA=180^\circ$이고 두 각이 같으므로 모두 $90^\circ$가 되어 직사각형이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

정사각형 $ABCD$에서 변 $AD$ 위의 점 $E$와 변 $BC$ 위의 점 $F$를 $\overline{AE}=\overline{CF}$가 되도록 잡고, 대각선 $AC$와 두 선분 $BE$, $DF$의 교점을 각각 $G$, $H$라 하자. $\angle AHD=73^\circ$일 때, $\angle ABE$의 크기는? [4점]

**보기** ① $28^\circ$  ② $30^\circ$  ③ $32^\circ$  ④ $35^\circ$  ⑤ $38^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABE$와 $\triangle CDF$에서 $\overline{AB}=\overline{CD}, \angle BAE=\angle DCF=90^\circ, \overline{AE}=\overline{CF}$. (ABCD)
2. 두 삼각형은 SAS 합동이므로 $\overline{BE}=\overline{DF}$이다. (ABCD)
3. 대각선과 이루는 각의 대칭성을 점검하여 참인 명제를 확인한다. (ABCD)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「정사각형 $ABCD$에서 변」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: 사각형의 성질 단원의 직사각형·마름모·정사각형 각 사각형의 성질 유형이다. (ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE (원천과 같음) **원천→판정: TPL_SPECIAL_QUADRILATERALS → NONE**
- 이유: 정사각형 내부 삼각형의 합동과 대각선 성질 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 정사각형 내부의 합동 도형 성질을 종합 검토하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 정사각형←stem:「정사각형 $ABCD$에서」
- goal: 대각선←stem:「대각선 $AC$와 두 선분 $BE$, $DF$의 교점」
- method: 합동(NAMED)←solution:「SAS 합동」
- condition: 선분←stem:「두 선분 $BE$, $DF$」

**how** 정사각형 내부 선분의 합동 증명(SAS)을 통해 변의 길이와 각의 일치성을 확인했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABE$와 $\triangle CDF$에서 $\overline{AB}=\overline{CD}$, $\angle BAE=\angle DCF=90^\circ$, $\overline{AE}=\overline{CF}$이므로 $\triangle ABE \equiv \triangle CDF$ (SAS 합동)이다. 정사각형의 대각선 $AC$는 꼭짓각을 이등분하므로 $\angle HCD=45^\circ$이다. $\angle CHD=180^\circ-\angle AHD=180^\circ-73^\circ=107^\circ$이다. $\triangle CHD$에서 $\angle CDH=180^\circ-107^\circ-45^\circ=28^\circ$이다. $\therefore \angle ABE=\angle CDF=\angle CDH=28^\circ$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (TPL, 난이도)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\overline{AD}\parallel\overline{BC}$인 등변사다리꼴 $ABCD$에서 변 $CB$의 연장선 위에 $\overline{AE}\parallel\overline{DB}$가 되도록 점 $E$를 잡았다. $\angle BCA=39^\circ$일 때, $\angle AEB$의 크기는? [4점]

**보기** ① $35^\circ$  ② $37^\circ$  ③ $39^\circ$  ④ $41^\circ$  ⑤ $43^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AD} \parallel \overline{EB}$이고 $\overline{AE} \parallel \overline{DB}$이므로 사각형 $ADBE$는 평행사변형이다.
2. 등변사다리꼴의 대각선 $\overline{AC}=\overline{BD}$이고 평행사변형에서 $\overline{AE}=\overline{BD}$이다. (AD)
3. 따라서 $\overline{AE}=\overline{AC}$이므로 $\triangle AEC$는 이등변삼각형이다. (AD)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AD}\」
**RPM** M2-RPM-080 [사각형의 성질 > 여러 가지 사각형 > 사다리꼴 > 등변사다리꼴] (원천과 같음)
- 이유: 사각형의 성질 단원의 사다리꼴 등변사다리꼴 성질 유형이다. (AD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=NONE (원천과 같음) **원천→판정: TPL_SPECIAL_QUADRILATERALS → NONE**
- 이유: 등변사다리꼴의 성질과 평행사변형 연계 기하 추론 유형이다. (AD)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 등변사다리꼴과 보조 평행선으로 생기는 평행사변형의 대각선 길이를 연계하는 난이도 2 문항이다. (AD)

**4칸**
- given: 등변사다리꼴←stem:「등변사다리꼴 $ABCD$에서」
- goal: 사다리꼴←solution:「등변사다리꼴에서 두 대각선의 길이는 같으므로」
- method: 평행사변형(NAMED)←solution:「$\square ADBE$는 평행사변형이고」
- condition: (없음)

**how** 평행사변형 정의로 AE=BD를 유도하고 등변사다리꼴 대각선 AC=BD와 연계해 이등변삼각형을 도출했다. (AD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD}\parallel\overline{EB}$이고 $\overline{AE}\parallel\overline{DB}$이므로 $\square ADBE$는 평행사변형이고, 따라서 $\overline{AE}=\overline{DB}$이다. 등변사다리꼴에서 두 대각선의 길이는 같으므로 $\overline{DB}=\overline{AC}$이다. 즉 $\overline{AE}=\overline{AC}$이므로 $\triangle AEC$는 이등변삼각형이다. $\therefore \angle AEB=\angle ACE=\angle BCA=39^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (소단원, RPM, TPL)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 보기 중 항상 닮은 두 도형을 모두 고른 것은? [4점]


ㄱ. 두 정사각형   ㄴ. 두 이등변삼각형   ㄷ. 두 구 ㄹ. 두 평행사변형   ㅁ. 두 직각삼각형   ㅂ. 두 정육각형

**보기** ① ㄱ, ㄴ, ㄷ  ② ㄱ, ㄷ, ㄹ  ③ ㄴ, ㄷ, ㅂ  ④ ㄷ, ㄹ, ㅁ  ⑤ ㄱ, ㄷ, ㅂ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 항상 닮은 평면도형: 두 원, 두 정사각형, 두 직각이등변삼각형, 두 정다각형. (90)
2. 항상 닮은 입체도형: 두 구, 두 정다면체. (90)
3. 보기에서 두 정사각형(ㄱ), 두 구(ㄷ), 두 정육각형(ㅂ) 등이 항상 닮은 도형이다. (90)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-SIMILAR_FIGURES → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「다음 보기 중 항상 닮은 두」
**RPM** M2-RPM-084 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 대응변·대응각 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비**
- 이유: 도형의 닮음 단원의 닮은 도형 기본과 닮음 판정 유형이다. (90)
**유형** PT=PT_SIMILAR_FIGURES / TPL=NONE (원천과 같음) **원천→판정: TPL_SIMILAR_FIGURES_RATIO → NONE**
- 이유: 닮은 도형의 뜻과 항상 닮은 도형 판별 유형이다. (90)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 기하학적으로 항상 닮음이 성립하는 도형의 집합을 선별하는 난이도 1 문항이다. (90)

**4칸**
- given: 정사각형←stem:「ㄱ. 두 정사각형」
- goal: 닮음←stem:「항상 닮은 두 도형을 모두 고른 것은?」
- method: 정다각형(NAMED)←solution:「변의 길이의 비가 일정하므로 항상 닮은 도형이다.」
- condition: (없음)

**how** 정다각형과 구 등 모양이 고정되어 항상 닮음인 도형의 조건을 분류 판정했다. (90)

<details><summary>저장 해설 (판정 검토용)</summary>

ㄱ. 두 정사각형은 네 각이 모두 $90^\circ$이고 변의 길이의 비가 일정하므로 항상 닮은 도형이다. ㄷ. 두 구는 모양이 하나로 정해지므로 항상 닮은 도형이다. ㅂ. 두 정육각형은 변의 개수가 같은 정다각형이므로 항상 닮은 도형이다. ㄴ, ㄹ, ㅁ은 각의 크기가 다를 수 있어 항상 닮은 도형이 아니다. 따라서 항상 닮은 두 도형은 ㄱ, ㄷ, ㅂ이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, TPL)

**발문**

서로 닮은 두 정사각뿔 $A$, $B$에서 밑면의 한 변의 길이가 각각 $6\text{ cm}$, $15\text{ cm}$일 때, 두 정사각뿔 $A$와 $B$의 닮음비는? [4점]

**보기** ① $1 : 3$  ② $2 : 3$  ③ $3 : 5$  ④ $2 : 5$  ⑤ $3 : 4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 닮은 두 입체도형의 닮음비는 대응하는 모서리의 길이의 비와 같다. (cm)
2. 밑면 한 변의 길이의 비가 $6 : 15$이므로 가장 간단한 자연수 비로 나타내면 $2 : 5$이다. (cm)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-SIMILAR_FIGURES → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「서로 닮은 두 정사각뿔 $A」
**RPM** M2-RPM-084 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비] (원천과 같음)
- 이유: 도형의 닮음 단원의 입체도형 닮음비 유형이다. (cm)
**유형** PT=PT_SIMILAR_FIGURES / TPL=NONE (원천과 같음) **원천→판정: TPL_SIMILAR_FIGURES_RATIO → NONE**
- 이유: 입체도형의 닮음과 닮음비 계산 기본 유형이다. (cm)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 입체도형에서 대응 모서리 길이로부터 닮음비를 계산하는 난이도 1 문항이다. (cm)

**4칸**
- given: 각뿔←stem:「두 정사각뿔 $A$, $B$에서」
- goal: 닮음비←stem:「두 정사각뿔 $A$와 $B$의 닮음비는?」
- method: 모서리(NAMED)←solution:「대응하는 모서리의 길이의 비와 같으므로」
- condition: 닮음←stem:「서로 닮은 두」

**how** 대응 모서리의 길이의 비 6:15를 기약비 2:5로 약분하여 닮음비를 구했다. (cm)

<details><summary>저장 해설 (판정 검토용)</summary>

닮은 두 입체도형의 닮음비는 대응하는 모서리의 길이의 비와 같으므로 $6 : 15 = 2 : 5$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (소단원, RPM, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\square ABCD \sim \square EFGH$이고 $\overline{AB}=20\text{ cm}$, $\overline{BC}=24\text{ cm}$, $\overline{FG}=18\text{ cm}$, $\angle A=75^\circ$, $\angle B=95^\circ$, $\angle C=80^\circ$일 때, $\overline{EF}$의 길이와 $\angle H$의 크기를 차례로 구하면? [4점]

**보기** ① $12\text{ cm},\ 110^\circ$  ② $15\text{ cm},\ 110^\circ$  ③ $15\text{ cm},\ 100^\circ$  ④ $16\text{ cm},\ 110^\circ$  ⑤ $16\text{ cm},\ 105^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 대응변의 비로 닮음비 $\overline{BC} : \overline{FG} = 24 : 18 = 4 : 3$을 구한다. (ABCD)
2. $\overline{AB} : \overline{EF} = 4 : 3$에서 $20 : \overline{EF} = 4 : 3 \implies \overline{EF} = 15\text{ cm}$이다. (ABCD)
3. 각의 크기와 다른 변의 길이를 대조하여 정답을 확정한다. (ABCD)
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-SIMILAR_FIGURES → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「$\square ABCD \」
**RPM** M2-RPM-085 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 대응변·대응각] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 대응변·대응각**
- 이유: 도형의 닮음 단원의 닮은 도형 대응변·대응각 유형이다. (ABCD)
**유형** PT=PT_SIMILAR_FIGURES / TPL=NONE (원천과 같음) **원천→판정: TPL_SIMILAR_FIGURES_RATIO → NONE**
- 이유: 닮은 다각형의 대응변과 대응각의 성질 계산 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 닮은 두 다각형의 닮음비와 대응변 비례식을 적용하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 길이←stem:「$\overline{BC}=24\text{ cm}$」
- goal: 사각형←solution:「두 사각형의 닮음비는」
- method: 닮음비(NAMED)←solution:「두 사각형의 닮음비는 $\overline{BC}:\overline{FG}=24:18=4:3$이다.」
- condition: (없음)

**how** 대응변의 비로 닮음비 4:3을 구하고 비례식을 세워 미지의 변의 길이를 계산했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

두 사각형의 닮음비는 $\overline{BC}:\overline{FG}=24:18=4:3$이다. $\overline{AB}:\overline{EF}=4:3$이므로 $20:\overline{EF}=4:3 \implies \overline{EF}=20\times\dfrac{3}{4}=15\text{ cm}$이다. $\square ABCD$의 네 내각의 합은 $360^\circ$이므로 $\angle D=360^\circ-(75^\circ+95^\circ+80^\circ)=110^\circ$이다. 대응각의 크기는 같으므로 $\angle H=\angle D=110^\circ$이다. $\therefore 15\text{ cm},\ 110^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

평행사변형 $ABCD$에서 변 $AD$ 위의 점 $E$에 대하여 선분 $BE$와 대각선 $AC$의 교점을 $F$라 하자. $\overline{AF}=8\text{ cm}$, $\overline{CF}=12\text{ cm}$, $\overline{BC}=30\text{ cm}$일 때, $\overline{ED}$의 길이는? [4점]

**보기** ① $6\text{ cm}$  ② $7\text{ cm}$  ③ $8\text{ cm}$  ④ $9\text{ cm}$  ⑤ $10\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AD} \parallel \overline{BC}$이므로 $\angle FAE = \angle FCB$ (엇각), $\angle AFE = \angle CFB$ (맞꼭지각). (ABCD)
2. 두 각이 같으므로 $\triangle AFE \sim \triangle CFB$ (AA 닮음)이다. (ABCD)
3. 닮음비 $\overline{AF} : \overline{CF} = 8 : 12 = 2 : 3$을 이용해 선분 길이를 계산한다. (ABCD)
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-TRIANGLE_SIMILARITY → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「평행사변형 $ABCD$에서」
**RPM** M2-RPM-086 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA] (원천과 같음)
- 이유: 도형의 닮음 단원의 삼각형의 닮음 AA 닮음 유형이다. (ABCD)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_SIMILARITY_APPLICATION → NONE**
- 이유: 평행선과 삼각형의 AA 닮음비 활용 유형이다. (ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평행선이 있는 평면도형에서 모래시계형 AA 닮음비를 유도하는 난이도 2 문항이다. (ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서」
- goal: 대각선←stem:「대각선 $AC$의 교점을 $F$라 하자.」
- method: 엇각(NAMED)←solution:「angle FAE=\angle FCB$ (엇각), $\angle AFE=\angle CFB$ (맞꼭지각)」
- condition: 평행←solution:「\overline{AD}\parallel\overline{BC}$이므로」

**how** 평행선의 엇각과 맞꼭지각으로 AA 닮음을 밝히고 선분비 2:3을 적용했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AD}\parallel\overline{BC}$이므로 $\angle FAE=\angle FCB$ (엇각), $\angle AFE=\angle CFB$ (맞꼭지각)이다. 따라서 $\triangle AFE \sim \triangle CFB$ (AA 닮음)이고 닮음비는 $\overline{AF}:\overline{CF}=8:12=2:3$이다. $\overline{AE}:\overline{BC}=2:3$이므로 $\overline{AE}=30\times\dfrac{2}{3}=20\text{ cm}$이다. 평행사변형에서 $\overline{AD}=\overline{BC}=30\text{ cm}$이므로 $\overline{ED}=\overline{AD}-\overline{AE}=30-20=10\text{ cm}$이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\overline{AB}=18\text{ cm}$, $\overline{BC}=21\text{ cm}$인 직사각형 $ABCD$에서 변 $BC$ 위에 $\overline{BE}:\overline{CE}=4:3$이 되도록 점 $E$를 정하고, 변 $AB$ 위에 $\angle DEF=90^\circ$가 되도록 점 $F$를 정하자. $\overline{AD}$의 연장선과 $\overline{EF}$의 연장선의 교점을 $H$라 할 때, $\overline{AH}$의 길이는? [4점]

**보기** ① $24\text{ cm}$  ② $20\text{ cm}$  ③ $21\text{ cm}$  ④ $22\text{ cm}$  ⑤ $25\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{BC}=21$을 $4:3$으로 내분하여 $\overline{BE}=12, \overline{CE}=9$를 구한다. (AB)
2. 직각삼각형들의 두 변의 비를 대조하여 닮음 조건을 확인한다. (AB)
3. 대응변의 비례식으로 구하는 선분의 길이를 도출한다. (AB)
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-TRIANGLE_SIMILARITY → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「$\overline{AB}=」
**RPM** M2-RPM-086 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 길이 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA**
- 이유: 도형의 닮음 단원의 삼각형의 닮음 직각삼각형 닮음비 유형이다. (AB)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_SIMILARITY_APPLICATION → NONE**
- 이유: 직사각형 내부의 직각삼각형 닮음비 계산 유형이다. (AB)
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 비례 배분과 직각삼각형의 닮음을 연계 계산하는 난이도 2 문항이다. (AB)

**4칸**
- given: 직사각형←stem:「직사각형 $ABCD$에서」
- goal: 길이←stem:「$\overline{AB}=18\text{ cm}$」
- method: 닮음(NAMED)←solution:「(AA 닮음)이다.」
- condition: (없음)

**how** 직사각형 변의 비례 분할 후 두 직각삼각형의 닮음비를 이용해 길이를 계산했다. (AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BC}=21\text{ cm}$이고 $\overline{BE}:\overline{CE}=4:3$이므로 $\overline{BE}=21\times\dfrac{4}{7}=12\text{ cm}$, $\overline{CE}=21\times\dfrac{3}{7}=9\text{ cm}$이다. $\triangle CDE$와 $\triangle BFE$에서 $\angle DCE=\angle FBE=90^\circ$이고, $\angle DEC+\angle FEB=90^\circ$이므로 $\angle CDE=\angle FEB$이다. 따라서 $\triangle CDE \sim \triangle BFE$ (AA 닮음)이다. $\overline{CD}:\overline{BE}=\overline{CE}:\overline{BF} \implies 18:12=9:\overline{BF} \implies \overline{BF}=6\text{ cm}$이다. 따라서 $\overline{AF}=\overline{AB}-\overline{BF}=18-6=12\text{ cm}$이다. $\overline{AH}\parallel\overline{BE}$이므로 $\triangle AFH \sim \triangle BFE$ (AA 닮음)이고, $\overline{AH}:\overline{BE}=\overline{AF}:\overline{BF} \implies \overline{AH}:12=12:6 \implies \overline{AH}=24\text{ cm}$이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, TPL)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B34)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

정삼각형 $ABC$의 변 $BC$ 위의 점 $D$와 변 $AB$ 위의 점 $E$에 대하여 $\angle ADE=60^\circ$이고 $\overline{BD}:\overline{DC}=3:1$일 때, $\overline{AE}:\overline{EB}$는? [5점]

**보기** ① $10 : 3$  ② $11 : 3$  ③ $13 : 3$  ④ $14 : 3$  ⑤ $15 : 4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 정삼각형의 한 내각 $60^\circ$와 $\angle ADE = 60^\circ$를 이용한다. (ABC)
2. 외각 성질로부터 $\angle BDE + \angle CDE = \angle BDE + \angle BED$ 관계를 유도한다. (ABC)
3. $\triangle EBD \sim \triangle DCA$ (AA 닮음)을 밝히고 비례식으로 선분 길이를 계산한다. (ABC)
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-TRIANGLE_SIMILARITY → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「정삼각형 $ABC$의 변 $」
**RPM** M2-RPM-086 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA] (원천과 같음)
- 이유: 도형의 닮음 단원의 삼각형의 닮음 AA 정삼각형 응용 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_SIMILARITY_CRITERIA → NONE**
- 이유: 정삼각형과 외각 성질을 이용한 삼각형의 AA 닮음 유형이다. (ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정삼각형 내부에서 60도 각을 매개로 한 회전형 AA 닮음을 증명하는 난이도 3 문항이다. (ABC)

**4칸**
- given: 정삼각형←stem:「정삼각형 $ABC$의 변 $BC$ 위의 점 $D$와」
- goal: 삼각형←solution:「정삼각형 $ABC$에서 $\angle B=\angle C=60^\circ$이다.」
- method: 외각(NAMED)←solution:「외각 성질에 의해」
- condition: (없음)

**how** 정삼각형 내각 60도와 외각 성질로 각의 일치를 증명하고 AA 닮음 비례식을 세웠다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

정삼각형 $ABC$에서 $\angle B=\angle C=60^\circ$이다. $\angle BAD=\alpha$라 하면 $\angle CAD=60^\circ-\alpha$이다. $\triangle ABD$의 외각 성질에 의해 $\angle ADC=\angle B+\angle BAD=60^\circ+\alpha$이다. 또 $\triangle ADE$의 외각 성질과 $\angle ADE=60^\circ$에서 $\angle BED=\angle EAD+\angle ADE=\alpha+60^\circ$이다. 따라서 $\angle EBD=\angle DCA=60^\circ$, $\angle BED=\angle CDA=60^\circ+\alpha$이므로 $\triangle EBD \sim \triangle DCA$ (AA 닮음)이다. $\overline{BD}:\overline{DC}=3:1$이므로 $\overline{DC}=1$, $\overline{BD}=3$으로 놓으면 $\overline{CA}=\overline{AB}=4$이다. $\overline{EB}:\overline{DC}=\overline{BD}:\overline{CA} \implies \overline{EB}:1=3:4 \implies \overline{EB}=\dfrac{3}{4}$이다. $\overline{AE}=4-\dfrac{3}{4}=\dfrac{13}{4}$이므로 $\overline{AE}:\overline{EB}=\dfrac{13}{4}:\dfrac{3}{4}=13:3$이다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 5점


**발문**

[서답형 1] [서술형][수준별 1-①] $\angle B=26^\circ$이고 $\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\overline{AC}=\overline{CD}$가 되도록 $\overline{BA}$의 연장선 위에 점 $D$를 잡았다. $\overline{BC}$의 연장선 위의 한 점을 $E$라고 할 때, $\angle DCE$의 크기를 구하는 풀이과정과 답을 쓰시오. [4점] [서술형][수준별 1-②] $\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$ 모양의 종이를 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $E$를 잇는 선분 $DE$를 접는 선으로 하여 점 $A$와 점 $B$가 겹치도록 접었다. $\angle EBC=21^\circ$일 때, $\angle A$의 크기를 구하는 풀이과정과 답을 쓰시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $78^\circ$ (2) $46^\circ$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $\overline{AB}=\overline{AC}$에서 $\angle BCA = \angle ABC = 26^\circ$이고 꼭짓각 $\angle A = 180^\circ - 52^\circ = 128^\circ$이다.
2. $\overline{BD}=\overline{BC}$인 이등변삼각형의 밑각을 계산하여 $\angle BDC = 78^\circ$를 도출한다. (26)
3. (2) 삼각형의 외각 성질을 연속 적용하여 $\angle DAC = 46^\circ$를 구한다. (26)
- 작성자 답: (1) $78^\circ$ (2) $46^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 1] [서술형][수」
**RPM** M2-RPM-060 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 성질 > 밑각] (원천과 같음)
- 이유: 삼각형의 성질 단원의 이등변삼각형 밑각 다단계 추론 유형이다. (26)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=NONE (원천과 같음) **원천→판정: TPL_ISOSCELES_BASE_ANGLES → NONE**
- 이유: 이등변삼각형의 밑각과 외각 성질 복합 서술형 유형이다. (26)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형 성질을 2단계로 연계 적용하는 난이도 3 서술형 문항이다. (26)

**4칸**
- given: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서」
- goal: 선분←stem:「$\overline{AC}=\overline{CD}$가 되도록」
- method: 외각(NAMED)←solution:「외각 성질에 의해」
- condition: (없음)

**how** 이등변삼각형 밑각 공식과 연속된 외각 성질을 단계별로 전개해 두 각의 크기를 계산했다. (26)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\overline{AB}=\overline{AC}$이므로 $\angle BCA=\angle ABC=26^\circ$이고 $\angle BAC=180^\circ-26^\circ\times 2=128^\circ$이다. $B$, $A$, $D$가 한 직선 위에 있으므로 $\angle CAD=180^\circ-128^\circ=52^\circ$이다. $\overline{AC}=\overline{CD}$이므로 $\angle CDA=\angle CAD=52^\circ$이다. $\triangle BCD$의 외각 성질에 의해 $\angle DCE=\angle CBD+\angle BDC=26^\circ+52^\circ=78^\circ$이다. (2) $\angle A=x$라 하면 $\overline{EA}=\overline{EB}$이므로 $\angle ABE=\angle EAB=x$이다. 따라서 $\angle ABC=\angle ABE+\angle EBC=x+21^\circ$이다. 한편 $\overline{AB}=\overline{AC}$이므로 $\angle ABC=\dfrac{180^\circ-x}{2}$이다. $x+21^\circ=\dfrac{180^\circ-x}{2} \implies 2x+42^\circ=180^\circ-x \implies 3x=138^\circ \implies x=46^\circ$이다. $\therefore$ (1) $78^\circ$, (2) $46^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

[서답형 2] [서술형][수준별 2-①] 점 $I$가 $\triangle ABC$의 내심이고 $\angle IAB=x^\circ$, $\angle IBC=28^\circ$, $\angle ICA=34^\circ$일 때, $x$의 값을 구하는 풀이과정과 답을 쓰시오. [4점] [서술형][수준별 2-②] 세 점 $A$, $B$, $C$가 점 $O$를 중심으로 하는 원 위에 있고, 점 $O$는 $\triangle ABC$의 내부에 있다. $\angle BAO=26^\circ$, $\angle BCO=19^\circ$, $\overline{OC}=6\text{ cm}$일 때, 호 $AC$와 현 $AC$로 둘러싸인 부분(부채꼴 $OAC$에서 $\triangle OAC$를 제외한 부분)의 넓이를 구하는 풀이과정과 답을 쓰시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $28$ (2) $(9\pi-18)\text{ cm}^2$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 내심은 각의 이등분선이므로 $\angle A = 2x, \angle B = 56^\circ, \angle C = 68^\circ$이다. (ABC)
2. $2x + 56 + 68 = 180 \implies 2x = 56 \implies x = 28$이다. (ABC)
3. (2) 중심각 $90^\circ$인 부채꼴의 넓이에서 직각이등변삼각형의 넓이를 빼서 $(9\pi-18)\text{ cm}^2$를 구한다. (ABC)
- 작성자 답: (1) $28$ (2) $(9\pi-18)\text{ cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 2] [서술형][수」
**RPM** M2-RPM-066 [삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심] **원천→판정: 삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산 → 삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심**
- 이유: 삼각형의 성질 단원의 내심과 각의 이등분선 및 넓이 활용 유형이다. (ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_CENTERS_SEMANTIC → NONE**
- 이유: 삼각형의 내심 각도 계산 및 부채꼴 넓이 복합 서술형 유형이다. (ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 내심의 각도 성질과 내접 부채꼴의 넓이 계산을 융합한 난이도 3 서술형 문항이다. (ABC)

**4칸**
- given: 내심←stem:「점 $I$가 $\triangle ABC$의 내심이고」
- goal: 부채꼴←stem:「부채꼴 $OAC$에서 $\triangle OAC$를 제외한 부분」
- method: 이등분선(NAMED)←solution:「내심 $I$는 세 내각의 이등분선의 교점이므로」
- condition: 넓이←stem:「부분)의 넓이를 구하는 풀이과정과 답을 쓰시오.」

**how** 내심의 각 이등분으로 미지각 x=28을 구하고 부채꼴과 삼각형의 넓이 차로 도형 넓이를 구했다. (ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 내심 $I$는 세 내각의 이등분선의 교점이므로 $\angle A=2x^\circ$, $\angle B=2\times 28^\circ=56^\circ$, $\angle C=2\times 34^\circ=68^\circ$이다. $2x+56+68=180 \implies 2x=56 \implies x=28$ (2) $\overline{OA}=\overline{OB}$이므로 $\angle ABO=\angle BAO=26^\circ$, $\angle AOB=180^\circ-26^\circ\times 2=128^\circ$이다. $\overline{OB}=\overline{OC}$이므로 $\angle OBC=\angle BCO=19^\circ$, $\angle BOC=180^\circ-19^\circ\times 2=142^\circ$이다. 따라서 $\angle AOC=360^\circ-128^\circ-142^\circ=90^\circ$이다. 부채꼴 $OAC$의 넓이는 $\pi\times 6^2\times\dfrac{90}{360}=9\pi\text{ cm}^2$, $\triangle OAC$의 넓이는 $\dfrac{1}{2}\times 6\times 6=18\text{ cm}^2$이다. 따라서 구하는 부분의 넓이는 $(9\pi-18)\text{ cm}^2$이다. $\therefore$ (1) $28$, (2) $(9\pi-18)\text{ cm}^2$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (RPM, PT, TPL, 난이도)

**발문**

[서답형 3] [서술형][수준별 3-①] 마름모 $ABCD$에서 두 대각선의 교점을 $O$라 하자. $\overline{AO}=12\text{ cm}$, $\overline{BO}=7\text{ cm}$일 때, 마름모 $ABCD$의 넓이를 구하는 풀이과정과 답을 쓰시오. [4점] [서술형][수준별 3-②] 마름모 $ABCD$에서 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP}:\overline{PC}=3:2$이고, $\overline{AC}=14\text{ cm}$, $\overline{BD}=20\text{ cm}$일 때, $\triangle DBP$의 넓이를 구하는 풀이과정과 답을 쓰시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $168\text{ cm}^2$ (2) $42\text{ cm}^2$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 마름모의 두 대각선 길이는 $\overline{AC}=24, \overline{BD}=14$이다. (ABCD)
2. 마름모의 넓이는 $\dfrac{1}{2} \times 24 \times 14 = 168\text{ cm}^2$이다. (ABCD)
3. (2) 마름모의 네 삼각형은 합동이므로 한 삼각형의 넓이는 $168 / 4 = 42\text{ cm}^2$이다. (ABCD)
- 작성자 답: (1) $168\text{ cm}^2$ (2) $42\text{ cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서답형 3] [서술형][수」
**RPM** M2-RPM-079 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질] **원천→판정: 사각형의 성질 > 평행사변형 > 넓이와 활용 > 분할도형 → 사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 특수 사각형의 대각선 성질**
- 이유: 사각형의 성질 단원의 마름모 대각선 성질과 넓이 계산 유형이다. (ABCD)
**유형** PT=PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_MG_RHOMBUS_DIAGONAL_AND_ANGLES** **원천→판정: TPL_SPECIAL_QUADRILATERALS → NONE**
- 이유: 마름모의 대각선 성질과 넓이 계산 서술형 유형이다. (ABCD)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 마름모의 대각선 성질로부터 전체 넓이와 분할된 부분 넓이를 서술하는 난이도 3 문항이다. (ABCD)

**4칸**
- given: 마름모←stem:「마름모 $ABCD$에서 두 대각선의 교점을 $O$라 하자.」
- goal: 넓이←stem:「마름모 $ABCD$의 넓이를 구하는 풀이과정과 답을 쓰시오.」
- method: 대각선(NAMED)←solution:「마름모의 두 대각선은 서로를 이등분하므로」
- condition: 대각선←stem:「두 대각선의 교점을」

**how** 대각선 이등분 성질로 전체 대각선을 구하고 마름모 넓이 공식과 4분할 넓이를 계산했다. (ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 마름모의 두 대각선은 서로를 이등분하므로 $\overline{AC}=2\times 12=24\text{ cm}$, $\overline{BD}=2\times 7=14\text{ cm}$이다. 따라서 마름모 $ABCD$의 넓이는 $\dfrac{1}{2}\times 24\times 14=168\text{ cm}^2$이다. (2) 마름모 $ABCD$의 넓이는 $\dfrac{1}{2}\times 14\times 20=140\text{ cm}^2$이다. 대각선 $BD$는 마름모의 넓이를 이등분하므로 $\triangle DBC=\dfrac{1}{2}\times 140=70\text{ cm}^2$이다. $\triangle DBP$와 $\triangle DPC$는 높이가 같으므로 넓이의 비는 밑변의 비 $\overline{BP}:\overline{PC}=3:2$와 같다. 따라서 $\triangle DBP=70\times\dfrac{3}{3+2}=70\times\dfrac{3}{5}=42\text{ cm}^2$이다. $\therefore$ (1) $168\text{ cm}^2$, (2) $42\text{ cm}^2$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (소단원, TPL, 난이도)

**발문**

[서답형 4][서술형] $\angle A=90^\circ$인 직각삼각형 $ABC$에서 꼭짓점 $A$로부터 빗변 $BC$에 내린 수선의 발을 $H$라 하자. $\overline{AB}=20\text{ cm}$, $\overline{BH}=16\text{ cm}$일 때, $\overline{CH}$의 길이를 구하는 풀이과정과 답을 쓰시오. [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $9\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABH \sim \triangle CBA$ (AA 닮음)이다. (90)
2. 대응변의 길이의 비 $\overline{AB} : \overline{CB} = \overline{BH} : \overline{BA}$를 세운다. (90)
3. $\overline{AB}^2 = \overline{BH} \times \overline{BC}$에서 $12^2 = \overline{BH} \times 16 \implies 144 = 16\overline{BH} \implies \overline{BH} = 9\text{ cm}$이다. (90)
- 작성자 답: $9\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURE(도형의 닮음) (원천과 같음) **원천→판정: M2-06-TRIANGLE_SIMILARITY → M2-06-SIMILAR_FIGURE**
- 근거 인용: 「[서답형 4][서술형] $\」
**RPM** M2-RPM-089 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 길이] (원천과 같음)
- 이유: 도형의 닮음 단원의 직각삼각형 수선 닮음의 활용 길이 유형이다. (90)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=NONE (원천과 같음) **원천→판정: TPL_TRIANGLE_SIMILARITY_APPLICATION → NONE**
- 이유: 직각삼각형의 닮음과 선분의 길이 공식(사영정리) 서술형 유형이다. (90)
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 2 → 3**
- 이유: 직각삼각형의 수선 닮음 공식(사영정리)을 유도하고 변의 길이를 구하는 난이도 3 서술형 문항이다. (90)

**4칸**
- given: 직각삼각형←stem:「$\angle A=90^\circ$인 직각삼각형 $ABC$에서」
- goal: 수선←stem:「빗변 $BC$에 내린 수선의 발을 $H$라 하자.」
- method: 닮음(NAMED)←solution:「triangle ABH \sim \triangle CBA」
- condition: 길이←stem:「$\overline{AB}=20\text{ cm}$」

**how** 직각삼각형의 꼭짓점에서 내린 수선의 닮음 공식 AB^2=BH*BC를 적용해 BH=9를 구했다. (90)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABH$와 $\triangle CBA$에서 $\angle AHB=\angle CAB=90^\circ$, $\angle B$는 공통이므로 $\triangle ABH \sim \triangle CBA$ (AA 닮음)이다. 대응변의 길이의 비에서 $\overline{BH}:\overline{BA}=\overline{BA}:\overline{BC}$이므로 $16:20=20:\overline{BC} \implies 16\overline{BC}=400 \implies \overline{BC}=25\text{ cm}$이다. $\therefore \overline{CH}=\overline{BC}-\overline{BH}=25-16=9\text{ cm}$ $\therefore 9\text{ cm}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
