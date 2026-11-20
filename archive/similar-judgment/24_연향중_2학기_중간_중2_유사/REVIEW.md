# 검수 묶음 — 24_연향중_2학기_중간_중2_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 2)**
- 문항 23개 / 검사 PASS 21, FAIL 2, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: NONE 23
- 난이도 분포: 1단계 3, 2단계 16, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q2**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q4**: 풀이 과정에 정답 값이 등장하지 않음
- **Q5**: 풀이 과정에 정답 값이 등장하지 않음
- **Q8**: 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 난이도 경계 (confidence=high, 원천 경계 B23)
- **Q16**: 검사 코드: CHOICE_ORDER
- **Q17**: 검사 코드: CHOICE_ORDER / 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q18**: 난이도 경계 (confidence=high, 원천 경계 B12)
- **Q19**: 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 난이도 경계 (confidence=high, 원천 경계 B34) / 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 풀이 과정에 정답 값이 등장하지 않음
- **Q22**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점


**발문**

$\triangle ABC$에서 $\angle B=\angle C$이고 $\overline{AB}=7x-8$, $\overline{AC}=3x+8$일 때, $x$의 값은? [3점]

**보기** ① $1$  ② $2$  ③ $3$  ④ $4$  ⑤ $5$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle B=\angle C$이므로 $\triangle ABC$는 $\overline{AB}=\overline{AC}$인 이등변삼각형이다.
2. $7x-8=3x+8 \implies 4x=16 \implies x=4$ $\therefore$ ④
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\triangle ABC$에서 $\angle B=\angle C$이고 $\overline{AB}=7x-8$, $\overline{AC}=3x+8$일 때, $x$의 값은?」
**RPM** M2-RPM-062 [삼각형의 성질 > 이등변삼각형 > 이등변삼각형의 판정 > 두 각 조건] (원천과 같음)
- 이유: Q1번 문항은 M2-RPM-062에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_ISOSCELES_TRIANGLE / TPL=TPL_ISOSCELES_CONVERSE (원천과 같음) (원천과 같음)
- 이유: Q1번 문항은 PT_ISOSCELES_TRIANGLE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←solution:「$\angle B=\angle C$이므로 $\triangle ABC$는 $\overline{AB}=\overline{AC}$인 이등변삼각형이다.」
- goal: 이등변삼각형←solution:「$\angle B=\angle C$이므로 $\triangle ABC$는 $\overline{AB}=\overline{AC}$인 이등변삼각형이다.」
- method: 삼각형(NAMED)←solution:「$\angle B=\angle C$이므로 $\triangle ABC$는 $\overline{AB}=\overline{AC}$인 이등변삼각형이다.」
- condition: (없음)

**how** Q1번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle B=\angle C$이므로 $\triangle ABC$는 $\overline{AB}=\overline{AC}$인 이등변삼각형이다. $7x-8=3x+8 \implies 4x=16 \implies x=4$ $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자. $\angle DBC=27^\circ$일 때, $\angle A$의 크기는? [3점]

**보기** ① $27^\circ$  ② $32^\circ$  ③ $36^\circ$  ④ $44^\circ$  ⑤ $54^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{BD}$가 $\angle B$의 이등분선이므로 $\angle ABC=2\angle DBC=2\times 27^\circ=54^\circ$이다.
2. $\triangle ABC$에서 $\angle C=90^\circ$이므로 $\angle A=180^\circ-90^\circ-54^\circ=36^\circ$이다.
3. $\therefore$ ③
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자.」
**RPM** M2-RPM-070 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] **원천→판정: 삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHA → 삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS**
- 이유: Q2번 문항은 M2-RPM-070에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA
- 이유: Q2번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자.」
- goal: 직각삼각형←stem:「$\angle C=90^\circ$인 직각삼각형 $ABC$에서 $\angle B$의 이등분선이 변 $AC$와 만나는 점을 $D$라 하자.」
- method: 이등분선(NAMED)←solution:「$\overline{BD}$가 $\angle B$의 이등분선이므로 $\angle ABC=2\angle DBC=2\times 27^\circ=54^\circ$이다.」
- condition: (없음)

**how** Q2번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BD}$가 $\angle B$의 이등분선이므로 $\angle ABC=2\angle DBC=2\times 27^\circ=54^\circ$이다. $\triangle ABC$에서 $\angle C=90^\circ$이므로 $\angle A=180^\circ-90^\circ-54^\circ=36^\circ$이다. $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

$\angle A=90^\circ$인 직각삼각형 $ABC$에서 점 $O$는 빗변 $BC$의 중점이다. $\angle BAO:\angle OAC=1:4$일 때, $\angle BOA$의 크기는? [4점]

**보기** ① $144^\circ$  ② $136^\circ$  ③ $128^\circ$  ④ $118^\circ$  ⑤ $108^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle A=90^\circ$이고 $\angle BAO:\angle OAC=1:4$이므로 $\angle BAO=90^\circ\times\dfrac{1}{1+4}=18^\circ$이다.
2. 직각삼각형의 빗변의 중점 $O$는 외심이므로 $\overline{OA}=\overline{OB}$이다.
3. 따라서 $\angle ABO=\angle BAO=18^\circ$이므로 $\angle BOA=180^\circ-18^\circ-18^\circ=144^\circ$이다.
4. $\therefore$ ①
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle A=90^\circ$인 직각삼각형 $ABC$에서 점 $O$는 빗변 $BC$의 중점이다.」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] **원천→판정: 삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심**
- 이유: Q3번 문항은 M2-RPM-064에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER (원천과 같음) (원천과 같음)
- 이유: Q3번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「$\angle A=90^\circ$인 직각삼각형 $ABC$에서 점 $O$는 빗변 $BC$의 중점이다.」
- goal: 직각삼각형←stem:「$\angle A=90^\circ$인 직각삼각형 $ABC$에서 점 $O$는 빗변 $BC$의 중점이다.」
- method: 빗변(NAMED)←solution:「직각삼각형의 빗변의 중점 $O$는 외심이므로 $\overline{OA}=\overline{OB}$이다.」
- condition: (없음)

**how** Q3번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle A=90^\circ$이고 $\angle BAO:\angle OAC=1:4$이므로 $\angle BAO=90^\circ\times\dfrac{1}{1+4}=18^\circ$이다. 직각삼각형의 빗변의 중점 $O$는 외심이므로 $\overline{OA}=\overline{OB}$이다. 따라서 $\angle ABO=\angle BAO=18^\circ$이므로 $\angle BOA=180^\circ-18^\circ-18^\circ=144^\circ$이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\overline{AB}=14\text{ cm}$, $\overline{AC}=10\text{ cm}$인 $\triangle ABC$에서 점 $I$는 내심이고, 점 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자. 다음 설명 중 옳지 않은 것은? [4점]

**보기** ① $\overline{DB}=\overline{DI}$  ② $\overline{BI}=\overline{CI}$  ③ $\angle ECI=\angle EIC$  ④ $\triangle EIC$는 이등변삼각형이다.  ⑤ $\triangle ADE$의 둘레는 $24\text{ cm}$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $I$가 내심이므로 $\angle DBI=\angle IBC$, $\angle ECI=\angle ICB$이다.
2. $\overline{DE}\parallel\overline{BC}$이므로 엇각에 의해 $\angle DIB=\angle IBC=\angle DBI$, $\angle EIC=\angle ICB=\angle ECI$이다.
3. 따라서 $\overline{DB}=\overline{DI}$, $\overline{EC}=\overline{EI}$이고 $\triangle EIC$는 이등변삼각형이다.
4. 또한 $\triangle ADE$의 둘레는 $\overline{AD}+\overline{DI}+\overline{IE}+\overline{AE}=\overline{AB}+\overline{AC}=14+10=24\text{ cm}$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=14\text{ cm}$, $\overline{AC}=10\text{ cm}$인 $\triangle ABC$에서 점 $I$는 내심이고, 점 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자.」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] **원천→판정: 삼각형의 성질 > 삼각형의 외심과 내심 > 내심 > 각의 이등분선과 내심 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심**
- 이유: Q4번 문항은 M2-RPM-064에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER (원천과 같음) (원천과 같음)
- 이유: Q4번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 직선←stem:「$\overline{AB}=14\text{ cm}$, $\overline{AC}=10\text{ cm}$인 $\triangle ABC$에서 점 $I$는 내심이고, 점 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자.」
- goal: 평행←stem:「$\overline{AB}=14\text{ cm}$, $\overline{AC}=10\text{ cm}$인 $\triangle ABC$에서 점 $I$는 내심이고, 점 $I$를 지나고 변 $BC$에 평행한 직선이 두 변 $AB$, $AC$와 만나는 점을 각각 $D$, $E$라 하자.」
- method: 내심(NAMED)←solution:「$I$가 내심이므로 $\angle DBI=\angle IBC$, $\angle ECI=\angle ICB$이다.」
- condition: (없음)

**how** Q4번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$I$가 내심이므로 $\angle DBI=\angle IBC$, $\angle ECI=\angle ICB$이다. $\overline{DE}\parallel\overline{BC}$이므로 엇각에 의해 $\angle DIB=\angle IBC=\angle DBI$, $\angle EIC=\angle ICB=\angle ECI$이다. 따라서 $\overline{DB}=\overline{DI}$, $\overline{EC}=\overline{EI}$이고 $\triangle EIC$는 이등변삼각형이다. 또한 $\triangle ADE$의 둘레는 $\overline{AD}+\overline{DI}+\overline{IE}+\overline{AE}=\overline{AB}+\overline{AC}=14+10=24\text{ cm}$이다. 그러나 일반적인 삼각형에서 $\overline{BI}=\overline{CI}$는 성립하지 않는다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 점 $O$가 항상 $\triangle ABC$의 외심인 조건을 모두 고르면? (정답 2개) [4점]

**보기** ① 점 $O$는 $\triangle ABC$의 세 중선의 교점이다.  ② $\overline{OA}=\overline{OB}=\overline{OC}$이다.  ③ 점 $O$는 $\triangle ABC$의 세 내각의 이등분선의 교점이다.  ④ 점 $O$에서 세 변 $AB$, $BC$, $CA$에 이르는 거리가 같다.  ⑤ 점 $O$는 두 변 $AB$, $BC$의 수직이등분선의 교점이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②, ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. ① 세 중선의 교점은 무게중심이다. (문항 토큰 ABC)
2. ② 세 꼭짓점까지의 거리가 같은 점은 외심이다.
3. ③, ④ 세 내각의 이등분선의 교점이며 세 변까지의 거리가 같은 점은 내심이다.
4. ⑤ 두 변의 수직이등분선의 교점은 세 꼭짓점까지의 거리가 같으므로 외심이다.
- 작성자 답: ②, ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 점 $O$가 항상 $\triangle ABC$의 외심인 조건을 모두 고르면?」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] (원천과 같음)
- 이유: Q5번 문항은 M2-RPM-064에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER (원천과 같음) (원천과 같음)
- 이유: Q5번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 외심←stem:「다음 중 점 $O$가 항상 $\triangle ABC$의 외심인 조건을 모두 고르면?」
- goal: 중점←stem:「다음 중 점 $O$가 항상 $\triangle ABC$의 외심인 조건을 모두 고르면?」
- method: 중심(NAMED)←solution:「① 세 중선의 교점은 무게중심이다.」
- condition: (없음)

**how** Q5번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ②, ⑤을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

① 세 중선의 교점은 무게중심이다. ② 세 꼭짓점까지의 거리가 같은 점은 외심이다. ③, ④ 세 내각의 이등분선의 교점이며 세 변까지의 거리가 같은 점은 내심이다. ⑤ 두 변의 수직이등분선의 교점은 세 꼭짓점까지의 거리가 같으므로 외심이다. $\therefore$ ②, ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

세 변의 길이가 $5$, $12$, $13$인 직각삼각형의 내접원의 반지름의 길이와 넓이를 차례로 짝지은 것은? [4점]

**보기** ① $2,\ 30$  ② $2,\ 60$  ③ $3,\ 30$  ④ $3,\ 45$  ⑤ $4,\ 30$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $5^2+12^2=13^2$이므로 빗변의 길이가 $13$인 직각삼각형이다.
2. 삼각형의 넓이는 $\dfrac{1}{2}\times 5\times 12=30$이다.
3. 내접원의 반지름의 길이를 $r$라 하면 $\dfrac{1}{2}r(5+12+13)=30 \implies 15r=30 \implies r=2$이다.
4. $\therefore 2,\ 30$ $\therefore$ ①
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 변의 길이가 $5$, $12$, $13$인 직각삼각형의 내접원의 반지름의 길이와 넓이를 차례로 짝지은 것은?」
**RPM** M2-RPM-068 [삼각형의 성질 > 삼각형의 외심과 내심 > 외접원·내접원 활용 > 반지름·각 계산] (원천과 같음)
- 이유: Q6번 문항은 M2-RPM-068에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_INCENTER (원천과 같음) (원천과 같음)
- 이유: Q6번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 반지름←stem:「세 변의 길이가 $5$, $12$, $13$인 직각삼각형의 내접원의 반지름의 길이와 넓이를 차례로 짝지은 것은?」
- goal: 삼각형←stem:「세 변의 길이가 $5$, $12$, $13$인 직각삼각형의 내접원의 반지름의 길이와 넓이를 차례로 짝지은 것은?」
- method: 직각삼각형(NAMED)←solution:「$5^2+12^2=13^2$이므로 빗변의 길이가 $13$인 직각삼각형이다.」
- condition: (없음)

**how** Q6번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

$5^2+12^2=13^2$이므로 빗변의 길이가 $13$인 직각삼각형이다. 삼각형의 넓이는 $\dfrac{1}{2}\times 5\times 12=30$이다. 내접원의 반지름의 길이를 $r$라 하면 $\dfrac{1}{2}r(5+12+13)=30 \implies 15r=30 \implies r=2$이다. $\therefore 2,\ 30$ $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

예각삼각형 $ABC$의 외심을 $O$라 하자. $\angle AOC=124^\circ$, $\angle OAB=36^\circ$일 때, $\angle OBC$의 크기는? [4점]

**보기** ① $22^\circ$  ② $24^\circ$  ③ $26^\circ$  ④ $28^\circ$  ⑤ $30^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{OA}=\overline{OC}$이므로 $\angle OAC=\angle OCA=\dfrac{180^\circ-124^\circ}{2}=28^\circ$이다.
2. $\overline{OA}=\overline{OB}$이므로 $\angle ABO=\angle OAB=36^\circ$이다.
3. $\overline{OB}=\overline{OC}$이므로 $\angle OBC=\angle OCB=x$라 하면 $\triangle ABC$의 세 내각의 합에서 $(36^\circ+28^\circ)+(36^\circ+x)+(28^\circ+x)=180^\circ \implies 128^\circ+2x=180^\circ \implies 2x=52^\circ \implies x=26^\circ$ $\therefore$ ③
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「예각삼각형 $ABC$의 외심을 $O$라 하자.」
**RPM** M2-RPM-064 [삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심] **원천→판정: 삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 외심의 위치·각 → 삼각형의 성질 > 삼각형의 외심과 내심 > 외심 > 수직이등분선과 외심**
- 이유: Q7번 문항은 M2-RPM-064에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_CENTERS / TPL=TPL_TRIANGLE_CIRCUMCENTER (원천과 같음) (원천과 같음)
- 이유: Q7번 문항은 PT_TRIANGLE_CENTERS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「예각삼각형 $ABC$의 외심을 $O$라 하자.」
- goal: 외심←stem:「예각삼각형 $ABC$의 외심을 $O$라 하자.」
- method: 내각(NAMED)←solution:「$\overline{OB}=\overline{OC}$이므로 $\angle OBC=\angle OCB=x$라 하면 $\triangle ABC$의 세 내각의 합에서 $(36^\circ+28^\circ)+(36^\circ+x)+(28^\circ+x)=180^\circ \implies 128^\circ+2x=180^\circ \implies 2x=52^\circ \implies x=26^\circ$ $\therefore$ ③」
- condition: (없음)

**how** Q7번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{OA}=\overline{OC}$이므로 $\angle OAC=\angle OCA=\dfrac{180^\circ-124^\circ}{2}=28^\circ$이다. $\overline{OA}=\overline{OB}$이므로 $\angle ABO=\angle OAB=36^\circ$이다. $\overline{OB}=\overline{OC}$이므로 $\angle OBC=\angle OCB=x$라 하면 $\triangle ABC$의 세 내각의 합에서 $(36^\circ+28^\circ)+(36^\circ+x)+(28^\circ+x)=180^\circ \implies 128^\circ+2x=180^\circ \implies 2x=52^\circ \implies x=26^\circ$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\angle BAC=58^\circ$, $\angle BDC=47^\circ$일 때, $\angle DBC+\angle DAC$의 크기는? [4점]

**보기** ① $65^\circ$  ② $70^\circ$  ③ $72^\circ$  ④ $75^\circ$  ⑤ $80^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\angle DBC=x$, $\angle DAC=y$라 하자.
2. $\overline{AB}\parallel\overline{DC}$이므로 $\angle DCA=\angle BAC=58^\circ$이다.
3. $\overline{AD}\parallel\overline{BC}$이므로 $\angle ADB=\angle DBC=x$이다.
4. $\triangle BCD$에서 $\angle BCD=180^\circ-x-47^\circ=133^\circ-x$이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
**RPM** M2-RPM-072 [사각형의 성질 > 평행사변형 > 평행사변형의 성질 > 변·각의 성질] (원천과 같음)
- 이유: Q8번 문항은 M2-RPM-072에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES (원천과 같음) (원천과 같음)
- 이유: Q8번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
- goal: 평행←stem:「평행사변형 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
- method: 변형(NAMED)←solution:「평행사변형에서 $\angle DAB=\angle BCD$이므로 $y+58^\circ=133^\circ-x \implies x+y=75^\circ$이다.」
- condition: (없음)

**how** Q8번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle DBC=x$, $\angle DAC=y$라 하자. $\overline{AB}\parallel\overline{DC}$이므로 $\angle DCA=\angle BAC=58^\circ$이다. $\overline{AD}\parallel\overline{BC}$이므로 $\angle ADB=\angle DBC=x$이다. $\triangle BCD$에서 $\angle BCD=180^\circ-x-47^\circ=133^\circ-x$이다. 평행사변형에서 $\angle DAB=\angle BCD$이므로 $y+58^\circ=133^\circ-x \implies x+y=75^\circ$이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

평행사변형 $ABCD$에서 $\overline{AB}=7\text{ cm}$, $\overline{AD}=10\text{ cm}$이고 변 $BC$의 중점을 $E$라 하자. 선분 $AE$의 연장선과 변 $DC$의 연장선의 교점을 $F$라 할 때, $\overline{DF}$의 길이는? [4점]

**보기** ① $12\text{ cm}$  ② $14\text{ cm}$  ③ $15\text{ cm}$  ④ $17\text{ cm}$  ⑤ $20\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AB}\parallel\overline{DF}$이므로 $\angle BAE=\angle CFE$ (엇각), $\angle AEB=\angle FEC$ (맞꼭지각)이고 $\overline{BE}=\overline{CE}$이다.
2. 따라서 $\triangle ABE \equiv \triangle FCE$ (ASA 합동)이므로 $\overline{CF}=\overline{AB}=7\text{ cm}$이다.
3. 평행사변형에서 $\overline{DC}=\overline{AB}=7\text{ cm}$이므로 $\overline{DF}=\overline{DC}+\overline{CF}=7+7=14\text{ cm}$이다.
4. $\therefore$ ②
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_SIMILARITY(삼각형의 닮음 조건과 대응변의 길이) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 $\overline{AB}=7\text{ cm}$, $\overline{AD}=10\text{ cm}$이고 변 $BC$의 중점을 $E$라 하자.」
**RPM** M2-RPM-239 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > SAS] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > SAS**
- 이유: Q9번 문항은 M2-RPM-239에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q9번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 평행사변형←stem:「평행사변형 $ABCD$에서 $\overline{AB}=7\text{ cm}$, $\overline{AD}=10\text{ cm}$이고 변 $BC$의 중점을 $E$라 하자.」
- goal: 평행←stem:「평행사변형 $ABCD$에서 $\overline{AB}=7\text{ cm}$, $\overline{AD}=10\text{ cm}$이고 변 $BC$의 중점을 $E$라 하자.」
- method: 꼭지각(NAMED)←solution:「$\overline{AB}\parallel\overline{DF}$이므로 $\angle BAE=\angle CFE$ (엇각), $\angle AEB=\angle FEC$ (맞꼭지각)이고 $\overline{BE}=\overline{CE}$이다.」
- condition: (없음)

**how** Q9번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB}\parallel\overline{DF}$이므로 $\angle BAE=\angle CFE$ (엇각), $\angle AEB=\angle FEC$ (맞꼭지각)이고 $\overline{BE}=\overline{CE}$이다. 따라서 $\triangle ABE \equiv \triangle FCE$ (ASA 합동)이므로 $\overline{CF}=\overline{AB}=7\text{ cm}$이다. 평행사변형에서 $\overline{DC}=\overline{AB}=7\text{ cm}$이므로 $\overline{DF}=\overline{DC}+\overline{CF}=7+7=14\text{ cm}$이다. $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 ‘두 대각선이 직교하는 평행사변형은 마름모이다.’를 설명하는 과정이다. (가)~(마)에 알맞은 것으로 옳지 않은 것은? [4점]


두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\square ABCD$는 (가)이므로 두 대각선이 서로를 이등분하여 $\overline{BO}=$ (나)이다. 또 $\overline{AC}\perp\overline{BD}$이므로 $\angle AOB=\angle AOD=90^\circ$이고 (다)는 공통이다. 따라서 $\triangle ABO \equiv \triangle ADO$ ((마) 합동)이므로 $\overline{AB}=$ (라)가 되어 네 변의 길이가 모두 같은 마름모이다.

**보기** ① (가) : 평행사변형  ② (나) : $\overline{DO}$  ③ (다) : $\overline{AO}$  ④ (라) : $\overline{AD}$  ⑤ (마) : RHS

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle ABO$와 $\triangle ADO$에서 $\overline{BO}=\overline{DO}$, $\angle AOB=\angle AOD=90^\circ$, $\overline{AO}$는 공통이므로 두 변과 그 끼인각이 각각 같아 SAS 합동이다.
2. 따라서 (마)에 RHS가 들어가는 ⑤는 옳지 않다.
3. $\therefore$ ⑤
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 ‘두 대각선이 직교하는 평행사변형은 마름모이다.’를 설명하는 과정이다.」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] (원천과 같음)
- 이유: Q10번 문항은 M2-RPM-082에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AC)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS (원천과 같음) (원천과 같음)
- 이유: Q10번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AC)

**4칸**
- given: 평행사변형←stem:「다음은 ‘두 대각선이 직교하는 평행사변형은 마름모이다.’를 설명하는 과정이다.」
- goal: 마름모←stem:「다음은 ‘두 대각선이 직교하는 평행사변형은 마름모이다.’를 설명하는 과정이다.」
- method: 합동(NAMED)←solution:「$\triangle ABO$와 $\triangle ADO$에서 $\overline{BO}=\overline{DO}$, $\angle AOB=\angle AOD=90^\circ$, $\overline{AO}$는 공통이므로 두 변과 그 끼인각이 각각 같아 SAS 합동이다.」
- condition: (없음)

**how** Q10번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 AC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABO$와 $\triangle ADO$에서 $\overline{BO}=\overline{DO}$, $\angle AOB=\angle AOD=90^\circ$, $\overline{AO}$는 공통이므로 두 변과 그 끼인각이 각각 같아 SAS 합동이다. 따라서 (마)에 RHS가 들어가는 ⑤는 옳지 않다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 보기 중 옳은 것을 모두 고른 것은? [4점]


가. 직사각형은 마름모이다. 나. 정사각형은 직사각형이다. 다. 마름모는 평행사변형이다. 라. 등변사다리꼴의 두 대각선은 서로 수직이다. 마. 직사각형의 두 대각선의 길이는 같다.

**보기** ① 나, 다, 마  ② 가, 다  ③ 가, 마  ④ 나, 라, 마  ⑤ 나, 다, 라, 마

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 직사각형의 네 변의 길이가 항상 같은 것은 아니므로 거짓이다. (문항 토큰 4)
2. 정사각형은 네 각이 모두 직각이므로 직사각형이다.
3. 마름모는 두 쌍의 대변이 각각 평행하므로 평행사변형이다.
4. 등변사다리꼴의 두 대각선의 길이는 같지만 서로 수직인 것은 아니다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 보기 중 옳은 것을 모두 고른 것은?」
**RPM** M2-RPM-082 [사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정] **원천→판정: 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 성질 비교 → 사각형의 성질 > 여러 가지 사각형 > 사각형의 포함 관계 > 조건으로 사각형 판정**
- 이유: Q11번 문항은 M2-RPM-082에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 4)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS (원천과 같음) (원천과 같음)
- 이유: Q11번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 4)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 4)

**4칸**
- given: 사각형←stem:「직사각형은 마름모이다.」
- goal: 마름모←stem:「직사각형은 마름모이다.」
- method: 거짓(NAMED)←solution:「직사각형의 네 변의 길이가 항상 같은 것은 아니므로 거짓이다.」
- condition: (없음)

**how** Q11번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 4)

<details><summary>저장 해설 (판정 검토용)</summary>

가. 직사각형의 네 변의 길이가 항상 같은 것은 아니므로 거짓이다. 나. 정사각형은 네 각이 모두 직각이므로 직사각형이다. 다. 마름모는 두 쌍의 대변이 각각 평행하므로 평행사변형이다. 라. 등변사다리꼴의 두 대각선의 길이는 같지만 서로 수직인 것은 아니다. 마. 직사각형의 두 대각선의 길이는 항상 같다. 따라서 옳은 것은 나, 다, 마이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점


**발문**

마름모 $ABCD$에서 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP}:\overline{PC}=3:4$이고, $\overline{AC}=14\text{ cm}$, $\overline{BD}=30\text{ cm}$일 때, $\triangle APC$의 넓이는? [4점]

**보기** ① $45\text{ cm}^2$  ② $50\text{ cm}^2$  ③ $60\text{ cm}^2$  ④ $75\text{ cm}^2$  ⑤ $120\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 마름모 $ABCD$의 넓이는 $\dfrac{1}{2}\times 14\times 30=210\text{ cm}^2$이다.
2. 대각선 $AC$는 마름모의 넓이를 이등분하므로 $\triangle ABC=\dfrac{1}{2}\times 210=105\text{ cm}^2$이다.
3. $\triangle ABP$와 $\triangle APC$는 높이가 같으므로 넓이의 비는 $\overline{BP}:\overline{PC}=3:4$이다.
4. $\therefore \triangle APC=105\times\dfrac{4}{3+4}=105\times\dfrac{4}{7}=60\text{ cm}^2$ $\therefore$ ③
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「마름모 $ABCD$에서 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP}:\overline{PC}=3:4$이고, $\overline{AC}=14\text{ cm}$, $\overline{BD}=30\text{ cm}$일 때, $\triangle APC$의 넓이는?」
**RPM** M2-RPM-076 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 평행선과 넓이] **원천→판정: 사각형의 성질 > 평행사변형 > 넓이와 활용 > 분할도형 → 사각형의 성질 > 평행사변형 > 넓이와 활용 > 평행선과 넓이**
- 이유: Q12번 문항은 M2-RPM-076에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS (원천과 같음) (원천과 같음)
- 이유: Q12번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 마름모←stem:「마름모 $ABCD$에서 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP}:\overline{PC}=3:4$이고, $\overline{AC}=14\text{ cm}$, $\overline{BD}=30\text{ cm}$일 때, $\triangle APC$의 넓이는?」
- goal: 넓이←stem:「마름모 $ABCD$에서 변 $BC$ 위의 점 $P$에 대하여 $\overline{BP}:\overline{PC}=3:4$이고, $\overline{AC}=14\text{ cm}$, $\overline{BD}=30\text{ cm}$일 때, $\triangle APC$의 넓이는?」
- method: 이등분(NAMED)←solution:「대각선 $AC$는 마름모의 넓이를 이등분하므로 $\triangle ABC=\dfrac{1}{2}\times 210=105\text{ cm}^2$이다.」
- condition: (없음)

**how** Q12번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

마름모 $ABCD$의 넓이는 $\dfrac{1}{2}\times 14\times 30=210\text{ cm}^2$이다. 대각선 $AC$는 마름모의 넓이를 이등분하므로 $\triangle ABC=\dfrac{1}{2}\times 210=105\text{ cm}^2$이다. $\triangle ABP$와 $\triangle APC$는 높이가 같으므로 넓이의 비는 $\overline{BP}:\overline{PC}=3:4$이다. $\therefore \triangle APC=105\times\dfrac{4}{3+4}=105\times\dfrac{4}{7}=60\text{ cm}^2$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B23)

**발문**

$\overline{AD}\parallel\overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자. $\triangle DBC$의 넓이가 $84\text{ cm}^2$, $\triangle OBC$의 넓이가 $62\text{ cm}^2$일 때, $\triangle AOB$의 넓이는? [4점]

**보기** ① $14\text{ cm}^2$  ② $18\text{ cm}^2$  ③ $20\text{ cm}^2$  ④ $22\text{ cm}^2$  ⑤ $24\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\triangle OCD=\triangle DBC-\triangle OBC=84-62=22\text{ cm}^2$이다.
2. $\overline{AD}\parallel\overline{BC}$이므로 밑변이 $\overline{AD}$로 같고 높이가 같은 두 삼각형 $\triangle ADB$와 $\triangle ADC$의 넓이는 같다.
3. 따라서 $\triangle AOB=\triangle ADB-\triangle AOD=\triangle ADC-\triangle AOD=\triangle OCD=22\text{ cm}^2$이다.
4. $\therefore$ ④
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AD}\parallel\overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
**RPM** M2-RPM-076 [사각형의 성질 > 평행사변형 > 넓이와 활용 > 평행선과 넓이] (원천과 같음)
- 이유: Q13번 문항은 M2-RPM-076에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES (원천과 같음) (원천과 같음)
- 이유: Q13번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AD)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AD)

**4칸**
- given: 사다리꼴←stem:「$\overline{AD}\parallel\overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
- goal: 교점←stem:「$\overline{AD}\parallel\overline{BC}$인 사다리꼴 $ABCD$에서 두 대각선 $AC$, $BD$의 교점을 $O$라 하자.」
- method: 삼각형(NAMED)←solution:「$\overline{AD}\parallel\overline{BC}$이므로 밑변이 $\overline{AD}$로 같고 높이가 같은 두 삼각형 $\triangle ADB$와 $\triangle ADC$의 넓이는 같다.」
- condition: (없음)

**how** Q13번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 AD)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle OCD=\triangle DBC-\triangle OBC=84-62=22\text{ cm}^2$이다. $\overline{AD}\parallel\overline{BC}$이므로 밑변이 $\overline{AD}$로 같고 높이가 같은 두 삼각형 $\triangle ADB$와 $\triangle ADC$의 넓이는 같다. 따라서 $\triangle AOB=\triangle ADB-\triangle AOD=\triangle ADC-\triangle AOD=\triangle OCD=22\text{ cm}^2$이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선이 변 $AB$와 만나는 점을 $D$라 할 때, $\triangle ABC \sim \triangle CDB$이다. 이때 $\angle A$의 크기는? [4점]

**보기** ① $32^\circ$  ② $36^\circ$  ③ $40^\circ$  ④ $54^\circ$  ⑤ $72^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{AB}=\overline{AC}$이므로 $\angle B=\angle ACB=x$라 하면 $\angle A=180^\circ-2x$이다.
2. $\overline{CD}$가 $\angle C$의 이등분선이므로 $\angle BCD=\dfrac{x}{2}$이다.
3. $\triangle ABC \sim \triangle CDB$에서 대응각 $\angle A=\angle BCD$이므로 $180^\circ-2x=\dfrac{x}{2} \implies 360^\circ-4x=x \implies 5x=360^\circ \implies x=72^\circ$ $\therefore \angle A=180^\circ-2\times 72^\circ=36^\circ$ $\therefore$ ②
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_SIMILARITY(삼각형의 닮음 조건과 대응변의 길이) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선이 변 $AB$와 만나는 점을 $D$라 할 때, $\triangle ABC \sim \triangle CDB$이다.」
**RPM** M2-RPM-238 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 길이] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 대응변·대응각 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 길이**
- 이유: Q14번 문항은 M2-RPM-238에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q14번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선이 변 $AB$와 만나는 점을 $D$라 할 때, $\triangle ABC \sim \triangle CDB$이다.」
- goal: 이등변삼각형←stem:「$\overline{AB}=\overline{AC}$인 이등변삼각형 $ABC$에서 $\angle C$의 이등분선이 변 $AB$와 만나는 점을 $D$라 할 때, $\triangle ABC \sim \triangle CDB$이다.」
- method: 이등분선(NAMED)←solution:「$\overline{CD}$가 $\angle C$의 이등분선이므로 $\angle BCD=\dfrac{x}{2}$이다.」
- condition: (없음)

**how** Q14번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB}=\overline{AC}$이므로 $\angle B=\angle ACB=x$라 하면 $\angle A=180^\circ-2x$이다. $\overline{CD}$가 $\angle C$의 이등분선이므로 $\angle BCD=\dfrac{x}{2}$이다. $\triangle ABC \sim \triangle CDB$에서 대응각 $\angle A=\angle BCD$이므로 $180^\circ-2x=\dfrac{x}{2} \implies 360^\circ-4x=x \implies 5x=360^\circ \implies x=72^\circ$ $\therefore \angle A=180^\circ-2\times 72^\circ=36^\circ$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

반지름의 길이의 비가 $3:4$인 두 원 $O$, $O'$에 대하여 원 $O'$의 넓이가 $80\pi\text{ cm}^2$일 때, 원 $O$의 넓이는? [4점]

**보기** ① $20\pi\text{ cm}^2$  ② $30\pi\text{ cm}^2$  ③ $36\pi\text{ cm}^2$  ④ $40\pi\text{ cm}^2$  ⑤ $45\pi\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 두 원의 닮음비가 $3:4$이므로 넓이의 비는 $3^2:4^2=9:16$이다.
2. 따라서 원 $O$의 넓이는 $80\pi\times\dfrac{9}{16}=45\pi\text{ cm}^2$이다.
3. $\therefore$ ⑤
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「반지름의 길이의 비가 $3:4$인 두 원 $O$, $O'$에 대하여 원 $O'$의 넓이가 $80\pi\text{ cm}^2$일 때, 원 $O$의 넓이는?」
**RPM** M2-RPM-237 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비] (원천과 같음)
- 이유: Q15번 문항은 M2-RPM-237에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 80)
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_AREA_VOLUME (원천과 같음) (원천과 같음)
- 이유: Q15번 문항은 PT_SIMILAR_FIGURES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 80)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 80)

**4칸**
- given: 반지름←stem:「반지름의 길이의 비가 $3:4$인 두 원 $O$, $O'$에 대하여 원 $O'$의 넓이가 $80\pi\text{ cm}^2$일 때, 원 $O$의 넓이는?」
- goal: 넓이←stem:「반지름의 길이의 비가 $3:4$인 두 원 $O$, $O'$에 대하여 원 $O'$의 넓이가 $80\pi\text{ cm}^2$일 때, 원 $O$의 넓이는?」
- method: 닮음(NAMED)←solution:「두 원의 닮음비가 $3:4$이므로 넓이의 비는 $3^2:4^2=9:16$이다.」
- condition: (없음)

**how** Q15번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 80)

<details><summary>저장 해설 (판정 검토용)</summary>

두 원의 닮음비가 $3:4$이므로 넓이의 비는 $3^2:4^2=9:16$이다. 따라서 원 $O$의 넓이는 $80\pi\times\dfrac{9}{16}=45\pi\text{ cm}^2$이다. $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER

**발문**

$\overline{AB}=9\text{ cm}$, $\overline{BC}=12\text{ cm}$, $\overline{AC}=15\text{ cm}$인 직사각형 $ABCD$에서 대각선 $AC$의 수직이등분선이 두 변 $AD$, $BC$와 만나는 점을 각각 $P$, $Q$라 하고, 대각선 $AC$와의 교점을 $O$라 하자. 이때 $\overline{AP}$의 길이는? [4점]

**보기** ① $\dfrac{25}{4}\text{ cm}$  ② $\dfrac{45}{8}\text{ cm}$  ③ $\dfrac{75}{8}\text{ cm}$  ④ $\dfrac{75}{4}\text{ cm}$  ⑤ $10\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $PQ$가 $\overline{AC}$를 수직이등분하므로 $\overline{AO}=\overline{OC}=\dfrac{15}{2}\text{ cm}$이고 $\angle AOP=90^\circ$이다.
2. $\overline{AD}\parallel\overline{BC}$이므로 $\angle PAO=\angle BCA$이고 $\angle AOP=\angle ABC=90^\circ$이므로 $\triangle AOP \sim \triangle CBA$ (AA 닮음)이다.
3. 따라서 $\overline{AP}:\overline{CA}=\overline{AO}:\overline{CB}$에서 $\overline{AP}:15=\dfrac{15}{2}:12 \implies 12\overline{AP}=\dfrac{225}{2} \implies \overline{AP}=\dfrac{75}{8}\text{ cm}$ $\therefore$ ③
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_SIMILARITY(삼각형의 닮음 조건과 대응변의 길이) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\overline{AB}=9\text{ cm}$, $\overline{BC}=12\text{ cm}$, $\overline{AC}=15\text{ cm}$인 직사각형 $ABCD$에서 대각선 $AC$의 수직이등분선이 두 변 $AD$, $BC$와 만나는 점을 각각 $P$, $Q$라 하고, 대각선 $AC$와의 교점을 $O$라 하자.」
**RPM** M2-RPM-239 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > SAS] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > SAS**
- 이유: Q16번 문항은 M2-RPM-239에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q16번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 사각형←stem:「$\overline{AB}=9\text{ cm}$, $\overline{BC}=12\text{ cm}$, $\overline{AC}=15\text{ cm}$인 직사각형 $ABCD$에서 대각선 $AC$의 수직이등분선이 두 변 $AD$, $BC$와 만나는 점을 각각 $P$, $Q$라 하고, 대각선 $AC$와의 교점을 $O$라 하자.」
- goal: 직사각형←stem:「$\overline{AB}=9\text{ cm}$, $\overline{BC}=12\text{ cm}$, $\overline{AC}=15\text{ cm}$인 직사각형 $ABCD$에서 대각선 $AC$의 수직이등분선이 두 변 $AD$, $BC$와 만나는 점을 각각 $P$, $Q$라 하고, 대각선 $AC$와의 교점을 $O$라 하자.」
- method: 이등분(NAMED)←solution:「$PQ$가 $\overline{AC}$를 수직이등분하므로 $\overline{AO}=\overline{OC}=\dfrac{15}{2}\text{ cm}$이고 $\angle AOP=90^\circ$이다.」
- condition: (없음)

**how** Q16번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

$PQ$가 $\overline{AC}$를 수직이등분하므로 $\overline{AO}=\overline{OC}=\dfrac{15}{2}\text{ cm}$이고 $\angle AOP=90^\circ$이다. $\overline{AD}\parallel\overline{BC}$이므로 $\angle PAO=\angle BCA$이고 $\angle AOP=\angle ABC=90^\circ$이므로 $\triangle AOP \sim \triangle CBA$ (AA 닮음)이다. 따라서 $\overline{AP}:\overline{CA}=\overline{AO}:\overline{CB}$에서 $\overline{AP}:15=\dfrac{15}{2}:12 \implies 12\overline{AP}=\dfrac{225}{2} \implies \overline{AP}=\dfrac{75}{8}\text{ cm}$ $\therefore$ ③

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

$\angle A=90^\circ$인 직각삼각형 $ABC$에서 꼭짓점 $A$로부터 빗변 $BC$에 내린 수선의 발을 $H$라 하자. $\overline{BH}=4\text{ cm}$, $\overline{HC}=5\text{ cm}$일 때, $\overline{AB}$의 길이는? [4점]

**보기** ① $6\text{ cm}$  ② $5\text{ cm}$  ③ $7\text{ cm}$  ④ $8\text{ cm}$  ⑤ $9\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $\overline{BC}=\overline{BH}+\overline{HC}=4+5=9\text{ cm}$이다.
2. $\triangle ABH \sim \triangle CBA$ (AA 닮음)이므로 $\overline{AB}^2=\overline{BH}\times\overline{BC}=4\times 9=36$이다.
3. $\overline{AB}>0$이므로 $\overline{AB}=6\text{ cm}$이다.
4. $\therefore$ ①
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_SIMILARITY(삼각형의 닮음 조건과 대응변의 길이) (원천과 같음) (원천과 같음)
- 근거 인용: 「$\angle A=90^\circ$인 직각삼각형 $ABC$에서 꼭짓점 $A$로부터 빗변 $BC$에 내린 수선의 발을 $H$라 하자.」
**RPM** M2-RPM-238 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 길이] (원천과 같음)
- 이유: Q17번 문항은 M2-RPM-238에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_APPLICATION (원천과 같음) (원천과 같음)
- 이유: Q17번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「$\angle A=90^\circ$인 직각삼각형 $ABC$에서 꼭짓점 $A$로부터 빗변 $BC$에 내린 수선의 발을 $H$라 하자.」
- goal: 직각삼각형←stem:「$\angle A=90^\circ$인 직각삼각형 $ABC$에서 꼭짓점 $A$로부터 빗변 $BC$에 내린 수선의 발을 $H$라 하자.」
- method: 닮음(NAMED)←solution:「$\triangle ABH \sim \triangle CBA$ (AA 닮음)이므로 $\overline{AB}^2=\overline{BH}\times\overline{BC}=4\times 9=36$이다.」
- condition: (없음)

**how** Q17번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BC}=\overline{BH}+\overline{HC}=4+5=9\text{ cm}$이다. $\triangle ABH \sim \triangle CBA$ (AA 닮음)이므로 $\overline{AB}^2=\overline{BH}\times\overline{BC}=4\times 9=36$이다. $\overline{AB}>0$이므로 $\overline{AB}=6\text{ cm}$이다. $\therefore$ ①

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B12)

**발문**

밑면의 반지름의 길이가 $12\text{ cm}$인 원뿔을 밑면에 평행한 평면으로 자를 때, 원뿔의 꼭짓점에서 단면까지의 높이가 $10\text{ cm}$, 단면에서 밑면까지의 높이가 $5\text{ cm}$이다. 이때 생기는 단면의 반지름의 길이는? [4점]

**보기** ① $4\text{ cm}$  ② $6\text{ cm}$  ③ $\dfrac{15}{2}\text{ cm}$  ④ $8\text{ cm}$  ⑤ $9\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 원래 원뿔의 전체 높이는 $10+5=15\text{ cm}$이다.
2. 잘린 작은 원뿔과 원래 원뿔은 닮은 도형이므로 닮음비는 $10:15=2:3$이다.
3. 단면의 반지름의 길이를 $r\text{ cm}$라 하면 $r:12=2:3 \implies r=12\times\dfrac{2}{3}=8\text{ cm}$이다.
4. $\therefore$ ④
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-SIMILAR_FIGURES(닮은 도형의 성질과 겉넓이·부피의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「밑면의 반지름의 길이가 $12\text{ cm}$인 원뿔을 밑면에 평행한 평면으로 자를 때, 원뿔의 꼭짓점에서 단면까지의 높이가 $10\text{ cm}$, 단면에서 밑면까지의 높이가 $5\text{ cm}$이다.」
**RPM** M2-RPM-237 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮은 도형 > 닮음비 → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 닮음의 활용 > 넓이·부피 비**
- 이유: Q18번 문항은 M2-RPM-237에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_SIMILAR_FIGURES / TPL=TPL_SIMILAR_FIGURES_RATIO (원천과 같음) (원천과 같음)
- 이유: Q18번 문항은 PT_SIMILAR_FIGURES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 평면←stem:「밑면의 반지름의 길이가 $12\text{ cm}$인 원뿔을 밑면에 평행한 평면으로 자를 때, 원뿔의 꼭짓점에서 단면까지의 높이가 $10\text{ cm}$, 단면에서 밑면까지의 높이가 $5\text{ cm}$이다.」
- goal: 반지름←stem:「밑면의 반지름의 길이가 $12\text{ cm}$인 원뿔을 밑면에 평행한 평면으로 자를 때, 원뿔의 꼭짓점에서 단면까지의 높이가 $10\text{ cm}$, 단면에서 밑면까지의 높이가 $5\text{ cm}$이다.」
- method: 높이(NAMED)←solution:「원래 원뿔의 전체 높이는 $10+5=15\text{ cm}$이다.」
- condition: (없음)

**how** Q18번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

원래 원뿔의 전체 높이는 $10+5=15\text{ cm}$이다. 잘린 작은 원뿔과 원래 원뿔은 닮은 도형이므로 닮음비는 $10:15=2:3$이다. 단면의 반지름의 길이를 $r\text{ cm}$라 하면 $r:12=2:3 \implies r=12\times\dfrac{2}{3}=8\text{ cm}$이다. $\therefore$ ④

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

평행사변형 $ABCD$에서 세 변 $AB$, $BC$, $CD$의 중점을 각각 $P$, $Q$, $R$라 하고, 선분 $PR$과 두 선분 $AQ$, $DQ$의 교점을 각각 $M$, $N$이라 하자. $\triangle MQN$의 넓이가 $9\text{ cm}^2$일 때, 평행사변형 $ABCD$의 넓이는? [5점]

**보기** ① $64\text{ cm}^2$  ② $72\text{ cm}^2$  ③ $80\text{ cm}^2$  ④ $84\text{ cm}^2$  ⑤ $96\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. $P$, $R$가 각각 $\overline{AB}$, $\overline{CD}$의 중점이므로 $\overline{PR}\parallel\overline{BC}$이고 $\overline{PR}=\overline{BC}$이며, $\overline{PR}$과 $\overline{BC}$ 사이의 거리는 평행사변형 높이 $h$의 $\dfrac{1}{2}$이다.
2. $\triangle ABQ$에서 $P$는 $\overline{AB}$의 중점이고 $\overline{PM}\parallel\overline{BQ}$이므로 $\overline{PM}=\dfrac{1}{2}\overline{BQ}=\dfrac{1}{4}\overline{BC}$이다.
3. 마찬가지로 $\overline{RN}=\dfrac{1}{4}\overline{BC}$이므로 $\overline{MN}=\overline{PR}-\overline{PM}-\overline{RN}=\dfrac{1}{2}\overline{BC}$이다.
4. 따라서 $\triangle MQN=\dfrac{1}{2}\times\left(\dfrac{1}{2}\overline{BC}\right)\times\left(\dfrac{1}{2}h\right)=\dfrac{1}{8}\overline{BC}\cdot h=\dfrac{1}{8}\square ABCD$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-PARALLEL_SEGMENT_RATIO(평행선 사이의 선분의 길이의 비) (원천과 같음) (원천과 같음)
- 근거 인용: 「평행사변형 $ABCD$에서 세 변 $AB$, $BC$, $CD$의 중점을 각각 $P$, $Q$, $R$라 하고, 선분 $PR$과 두 선분 $AQ$, $DQ$의 교점을 각각 $M$, $N$이라 하자.」
**RPM** M2-RPM-091 [도형의 닮음과 피타고라스 정리 > 평행선과 선분의 길이의 비 > 삼각형과 평행선 > 기본 비례] (원천과 같음)
- 이유: Q19번 문항은 M2-RPM-091에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_CRITERIA (원천과 같음) **원천→판정: TPL_PARALLEL_SEGMENT_RATIO_TRIANGLE → TPL_QUADRILATERAL_CRITERIA**
- 이유: Q19번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 선분←stem:「평행사변형 $ABCD$에서 세 변 $AB$, $BC$, $CD$의 중점을 각각 $P$, $Q$, $R$라 하고, 선분 $PR$과 두 선분 $AQ$, $DQ$의 교점을 각각 $M$, $N$이라 하자.」
- goal: 평행사변형←stem:「평행사변형 $ABCD$에서 세 변 $AB$, $BC$, $CD$의 중점을 각각 $P$, $Q$, $R$라 하고, 선분 $PR$과 두 선분 $AQ$, $DQ$의 교점을 각각 $M$, $N$이라 하자.」
- method: 평행(NAMED)←solution:「$P$, $R$가 각각 $\overline{AB}$, $\overline{CD}$의 중점이므로 $\overline{PR}\parallel\overline{BC}$이고 $\overline{PR}=\overline{BC}$이며, $\overline{PR}$과 $\overline{BC}$ 사이의 거리는 평행사변형 높이 $h$의 $\dfrac{1}{2}$이다.」
- condition: (없음)

**how** Q19번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

$P$, $R$가 각각 $\overline{AB}$, $\overline{CD}$의 중점이므로 $\overline{PR}\parallel\overline{BC}$이고 $\overline{PR}=\overline{BC}$이며, $\overline{PR}$과 $\overline{BC}$ 사이의 거리는 평행사변형 높이 $h$의 $\dfrac{1}{2}$이다. $\triangle ABQ$에서 $P$는 $\overline{AB}$의 중점이고 $\overline{PM}\parallel\overline{BQ}$이므로 $\overline{PM}=\dfrac{1}{2}\overline{BQ}=\dfrac{1}{4}\overline{BC}$이다. 마찬가지로 $\overline{RN}=\dfrac{1}{4}\overline{BC}$이므로 $\overline{MN}=\overline{PR}-\overline{PM}-\overline{RN}=\dfrac{1}{2}\overline{BC}$이다. 따라서 $\triangle MQN=\dfrac{1}{2}\times\left(\dfrac{1}{2}\overline{BC}\right)\times\left(\dfrac{1}{2}h\right)=\dfrac{1}{8}\overline{BC}\cdot h=\dfrac{1}{8}\square ABCD$이다. $\therefore \square ABCD=9\times 8=72\text{ cm}^2$ $\therefore$ ②

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 난이도 경계 (confidence=high, 원천 경계 B34)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

정삼각형 모양의 종이 $ABC$를 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $F$를 잇는 선분 $DF$를 접는 선으로 하여 꼭짓점 $A$가 변 $BC$ 위의 점 $E$에 오도록 접었다. $\overline{BD}=8\text{ cm}$, $\overline{BE}=5\text{ cm}$, $\overline{DE}=7\text{ cm}$일 때, $\overline{AF}$의 길이는? [5점]

**보기** ① $\dfrac{25}{4}\text{ cm}$  ② $\dfrac{15}{2}\text{ cm}$  ③ $8\text{ cm}$  ④ $\dfrac{33}{4}\text{ cm}$  ⑤ $\dfrac{35}{4}\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. 접은 부분의 길이가 같으므로 $\overline{DA}=\overline{DE}=7\text{ cm}$, $\overline{FA}=\overline{FE}$이다.
2. 정삼각형의 한 변의 길이는 $\overline{AB}=8+7=15\text{ cm}$이므로 $\overline{CE}=15-5=10\text{ cm}$이다.
3. $\angle DEF=\angle A=60^\circ$이고 $\angle B=\angle C=60^\circ$이므로 $\angle BDE+\angle BED=120^\circ$, $\angle CEF+\angle BED=180^\circ-60^\circ=120^\circ$에서 $\angle BDE=\angle CEF$이다.
4. 따라서 $\triangle BDE \sim \triangle CEF$ (AA 닮음)이므로 $\overline{BD}:\overline{CE}=\overline{DE}:\overline{EF}$이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_SIMILARITY(삼각형의 닮음 조건과 대응변의 길이) (원천과 같음) (원천과 같음)
- 근거 인용: 「정삼각형 모양의 종이 $ABC$를 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $F$를 잇는 선분 $DF$를 접는 선으로 하여 꼭짓점 $A$가 변 $BC$ 위의 점 $E$에 오도록 접었다.」
**RPM** M2-RPM-239 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > SAS] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > SAS**
- 이유: Q20번 문항은 M2-RPM-239에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_CRITERIA (원천과 같음) (원천과 같음)
- 이유: Q20번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 선분←stem:「정삼각형 모양의 종이 $ABC$를 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $F$를 잇는 선분 $DF$를 접는 선으로 하여 꼭짓점 $A$가 변 $BC$ 위의 점 $E$에 오도록 접었다.」
- goal: 삼각형←stem:「정삼각형 모양의 종이 $ABC$를 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $F$를 잇는 선분 $DF$를 접는 선으로 하여 꼭짓점 $A$가 변 $BC$ 위의 점 $E$에 오도록 접었다.」
- method: 길이(NAMED)←solution:「접은 부분의 길이가 같으므로 $\overline{DA}=\overline{DE}=7\text{ cm}$, $\overline{FA}=\overline{FE}$이다.」
- condition: (없음)

**how** Q20번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

접은 부분의 길이가 같으므로 $\overline{DA}=\overline{DE}=7\text{ cm}$, $\overline{FA}=\overline{FE}$이다. 정삼각형의 한 변의 길이는 $\overline{AB}=8+7=15\text{ cm}$이므로 $\overline{CE}=15-5=10\text{ cm}$이다. $\angle DEF=\angle A=60^\circ$이고 $\angle B=\angle C=60^\circ$이므로 $\angle BDE+\angle BED=120^\circ$, $\angle CEF+\angle BED=180^\circ-60^\circ=120^\circ$에서 $\angle BDE=\angle CEF$이다. 따라서 $\triangle BDE \sim \triangle CEF$ (AA 닮음)이므로 $\overline{BD}:\overline{CE}=\overline{DE}:\overline{EF}$이다. $8:10=7:\overline{AF} \implies 8\overline{AF}=70 \implies \overline{AF}=\dfrac{35}{4}\text{ cm}$ $\therefore$ ⑤

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 1] $\angle C=90^\circ$, $\overline{AC}=\overline{BC}$인 직각이등변삼각형 $ABC$에서 빗변 $AB$ 위에 $\overline{AC}=\overline{AD}$인 점 $D$를 잡고, 변 $BC$ 위에 $\overline{AB}\perp\overline{DE}$가 되도록 점 $E$를 잡았다. 다음 물음에 답하시오. [7점] (1) $\triangle ACE$와 합동인 삼각형을 찾아 합동기호를 사용하여 나타내고, 삼각형의 합동조건을 설명하시오. [3점] (2) $\overline{EC}=6\text{ cm}$일 때, $\overline{DB}+\overline{DE}$의 길이를 구하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\triangle ACE \equiv \triangle ADE$ (RHS 합동) (2) $12\text{ cm}$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $\triangle ACE$와 $\triangle ADE$에서 $\angle ACE=\angle ADE=90^\circ$, 빗변 $\overline{AE}$는 공통, $\overline{AC}=\overline{AD}$이므로 $\triangle ACE \equiv \triangle ADE$ (RHS 합동)이다.
2. (2) 합동에 의해 $\overline{DE}=\overline{CE}=6\text{ cm}$이다.
3. $\triangle ABC$가 직각이등변삼각형이므로 $\angle B=45^\circ$이고, $\triangle BDE$에서 $\angle BDE=90^\circ$이므로 $\angle BED=45^\circ$이다.
4. 따라서 $\triangle BDE$는 직각이등변삼각형이어서 $\overline{DB}=\overline{DE}=6\text{ cm}$이다.
- 작성자 답: (1) $\triangle ACE \equiv \triangle ADE$ (RHS 합동) (2) $12\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-TRIANGLE_PROPERTIES(삼각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] $\angle C=90^\circ$, $\overline{AC}=\overline{BC}$인 직각이등변삼각형 $ABC$에서 빗변 $AB$ 위에 $\overline{AC}=\overline{AD}$인 점 $D$를 잡고, 변 $BC$ 위에 $\overline{AB}\perp\overline{DE}$가 되도록 점 $E$를 잡았다.」
**RPM** M2-RPM-070 [삼각형의 성질 > 삼각형의 성질 > 직각삼각형의 합동 > RHS] (원천과 같음)
- 이유: Q21번 문항은 M2-RPM-070에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE (원천과 같음) (원천과 같음)
- 이유: Q21번 문항은 PT_RIGHT_TRIANGLE_CONGRUENCE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 삼각형←stem:「[서술형 1] $\angle C=90^\circ$, $\overline{AC}=\overline{BC}$인 직각이등변삼각형 $ABC$에서 빗변 $AB$ 위에 $\overline{AC}=\overline{AD}$인 점 $D$를 잡고, 변 $BC$ 위에 $\overline{AB}\perp\overline{DE}$가 되도록 점 $E$를 잡았다.」
- goal: 이등변삼각형←stem:「[서술형 1] $\angle C=90^\circ$, $\overline{AC}=\overline{BC}$인 직각이등변삼각형 $ABC$에서 빗변 $AB$ 위에 $\overline{AC}=\overline{AD}$인 점 $D$를 잡고, 변 $BC$ 위에 $\overline{AB}\perp\overline{DE}$가 되도록 점 $E$를 잡았다.」
- method: 빗변(NAMED)←solution:「(1) $\triangle ACE$와 $\triangle ADE$에서 $\angle ACE=\angle ADE=90^\circ$, 빗변 $\overline{AE}$는 공통, $\overline{AC}=\overline{AD}$이므로 $\triangle ACE \equiv \triangle ADE$ (RHS 합동)이다.」
- condition: (없음)

**how** Q21번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 (1) $\triangle ACE \equiv \triangle ADE$ (RHS 합동) (2) $12\text{ cm}$을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\triangle ACE$와 $\triangle ADE$에서 $\angle ACE=\angle ADE=90^\circ$, 빗변 $\overline{AE}$는 공통, $\overline{AC}=\overline{AD}$이므로 $\triangle ACE \equiv \triangle ADE$ (RHS 합동)이다. (2) 합동에 의해 $\overline{DE}=\overline{CE}=6\text{ cm}$이다. $\triangle ABC$가 직각이등변삼각형이므로 $\angle B=45^\circ$이고, $\triangle BDE$에서 $\angle BDE=90^\circ$이므로 $\angle BED=45^\circ$이다. 따라서 $\triangle BDE$는 직각이등변삼각형이어서 $\overline{DB}=\overline{DE}=6\text{ cm}$이다. $\therefore \overline{DB}+\overline{DE}=6+6=12\text{ cm}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

[서술형 2] 한 변의 길이가 $8\text{ cm}$인 두 정사각형 $ABCD$와 $OEFG$가 겹쳐 있다. 점 $O$는 정사각형 $ABCD$의 두 대각선의 교점이고, 변 $OE$와 변 $BC$의 교점을 $P$, 변 $OG$와 변 $CD$의 교점을 $Q$라 할 때, 다음 물음에 답하시오. [7점] (1) $\triangle OCQ$와 합동인 삼각형을 찾아 합동기호를 사용하여 나타내고, 삼각형의 합동조건을 설명하시오. [3점] (2) 두 정사각형이 겹쳐진 사각형 $OPCQ$의 넓이를 구하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\triangle OCQ \equiv \triangle OBP$ (ASA 합동) (2) $16\text{ cm}^2$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) 정사각형 $ABCD$의 대각선 성질에 의해 $\overline{OB}=\overline{OC}$, $\angle BOC=90^\circ$, $\angle OBP=\angle OCQ=45^\circ$이다.
2. 또 $\angle POQ=90^\circ$이므로 $\angle BOP=90^\circ-\angle POC=\angle COQ$이다.
3. 따라서 $\triangle OCQ \equiv \triangle OBP$ (ASA 합동)이다.
4. (2) $\square OPCQ=\triangle OPC+\triangle OCQ=\triangle OPC+\triangle OBP=\triangle OBC$이다.
- 작성자 답: (1) $\triangle OCQ \equiv \triangle OBP$ (ASA 합동) (2) $16\text{ cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-05(도형의 성질) / M2-05-QUADRILATERAL_PROPERTIES(사각형의 성질) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] 한 변의 길이가 $8\text{ cm}$인 두 정사각형 $ABCD$와 $OEFG$가 겹쳐 있다.」
**RPM** M2-RPM-078 [사각형의 성질 > 여러 가지 사각형 > 직사각형·마름모·정사각형 > 각 사각형의 성질] (원천과 같음)
- 이유: Q22번 문항은 M2-RPM-078에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_SPECIAL_QUADRILATERALS (원천과 같음) (원천과 같음)
- 이유: Q22번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 사각형←stem:「[서술형 2] 한 변의 길이가 $8\text{ cm}$인 두 정사각형 $ABCD$와 $OEFG$가 겹쳐 있다.」
- goal: 정사각형←stem:「[서술형 2] 한 변의 길이가 $8\text{ cm}$인 두 정사각형 $ABCD$와 $OEFG$가 겹쳐 있다.」
- method: 성질(NAMED)←solution:「(1) 정사각형 $ABCD$의 대각선 성질에 의해 $\overline{OB}=\overline{OC}$, $\angle BOC=90^\circ$, $\angle OBP=\angle OCQ=45^\circ$이다.」
- condition: (없음)

**how** Q22번 문항으로 M2-05 단원의 기본 개념과 성질을 적용하여 (1) $\triangle OCQ \equiv \triangle OBP$ (ASA 합동) (2) $16\text{ cm}^2$을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 정사각형 $ABCD$의 대각선 성질에 의해 $\overline{OB}=\overline{OC}$, $\angle BOC=90^\circ$, $\angle OBP=\angle OCQ=45^\circ$이다. 또 $\angle POQ=90^\circ$이므로 $\angle BOP=90^\circ-\angle POC=\angle COQ$이다. 따라서 $\triangle OCQ \equiv \triangle OBP$ (ASA 합동)이다. (2) $\square OPCQ=\triangle OPC+\triangle OCQ=\triangle OPC+\triangle OBP=\triangle OBC$이다. $\triangle OBC$의 넓이는 정사각형 $ABCD$ 넓이의 $\dfrac{1}{4}$이므로 $\dfrac{1}{4}\times 8^2=16\text{ cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 6점


**발문**

[서술형 3] $\triangle ABC$에서 변 $AB$ 위의 점 $D$에 대하여 $\angle ABC=\angle ACD$이고 $\overline{AB}=12$, $\overline{AC}=8$, $\overline{BC}=15$일 때, 다음 물음에 답하시오. [6점] (1) $\triangle ABC$와 닮은 삼각형을 찾아 닮음기호를 사용하여 나타내고, 삼각형의 닮음조건을 설명하시오. [3점] (2) 닮음비를 구하고, 이를 이용하여 $\overline{CD}$의 길이를 구하시오. [3점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\triangle ABC \sim \triangle ACD$ (AA 닮음) (2) 닮음비 $3:2$, $\overline{CD}=10$   |   그림 파일(image): 없음

**작성자의 풀이 과정**
1. (1) $\triangle ABC$와 $\triangle ACD$에서 $\angle A$는 공통이고 $\angle ABC=\angle ACD$이므로 $\triangle ABC \sim \triangle ACD$ (AA 닮음)이다.
2. (2) 닮음비는 $\overline{AB}:\overline{AC}=12:8=3:2$이다.
3. 대응변 $\overline{BC}$와 $\overline{CD}$의 길이의 비도 $3:2$이므로 $15:\overline{CD}=3:2 \implies 3\overline{CD}=30 \implies \overline{CD}=10$이다.
- 작성자 답: (1) $\triangle ABC \sim \triangle ACD$ (AA 닮음) (2) 닮음비 $3:2$, $\overline{CD}=10$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M2-06(도형의 닮음) / M2-06-TRIANGLE_SIMILARITY(삼각형의 닮음 조건과 대응변의 길이) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] $\triangle ABC$에서 변 $AB$ 위의 점 $D$에 대하여 $\angle ABC=\angle ACD$이고 $\overline{AB}=12$, $\overline{AC}=8$, $\overline{BC}=15$일 때, 다음 물음에 답하시오.」
**RPM** M2-RPM-239 [도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > SAS] **원천→판정: 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > AA → 도형의 닮음과 피타고라스 정리 > 도형의 닮음 > 삼각형의 닮음 > SAS**
- 이유: Q23번 문항은 M2-RPM-239에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_TRIANGLE_SIMILARITY / TPL=TPL_TRIANGLE_SIMILARITY_CRITERIA (원천과 같음) (원천과 같음)
- 이유: Q23번 문항은 PT_TRIANGLE_SIMILARITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「[6점] (1) $\triangle ABC$와 닮은 삼각형을 찾아 닮음기호를 사용하여 나타내고, 삼각형의 닮음조건을 설명하시오.」
- goal: 닮음←stem:「[6점] (1) $\triangle ABC$와 닮은 삼각형을 찾아 닮음기호를 사용하여 나타내고, 삼각형의 닮음조건을 설명하시오.」
- method: 공통(NAMED)←solution:「(1) $\triangle ABC$와 $\triangle ACD$에서 $\angle A$는 공통이고 $\angle ABC=\angle ACD$이므로 $\triangle ABC \sim \triangle ACD$ (AA 닮음)이다.」
- condition: (없음)

**how** Q23번 문항으로 M2-06 단원의 기본 개념과 성질을 적용하여 (1) $\triangle ABC \sim \triangle ACD$ (AA 닮음) (2) 닮음비 $3:2$, $\overline{CD}=10$을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

(1) $\triangle ABC$와 $\triangle ACD$에서 $\angle A$는 공통이고 $\angle ABC=\angle ACD$이므로 $\triangle ABC \sim \triangle ACD$ (AA 닮음)이다. (2) 닮음비는 $\overline{AB}:\overline{AC}=12:8=3:2$이다. 대응변 $\overline{BC}$와 $\overline{CD}$의 길이의 비도 $3:2$이므로 $15:\overline{CD}=3:2 \implies 3\overline{CD}=30 \implies \overline{CD}=10$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
