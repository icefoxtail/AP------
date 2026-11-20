# 검수 묶음 — 24_왕운중_2학기_기말_중1_유사

- 단계: **CONVERTED (판정 검사 미통과: )**
- 문항 24개 / 검사 PASS 24, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: SELF_CONTAINED 16, NONE 8
- 난이도 분포: 1단계 1, 2단계 9, 3단계 11, 4단계 3
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 풀이 과정에 정답 값이 등장하지 않음
- **Q4**: 풀이 과정에 정답 값이 등장하지 않음
- **Q12**: 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음
- **Q16**: 풀이 과정에 정답 값이 등장하지 않음
- **Q20**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림과 같이 두 삼각형 $ABC$와 $CDE$가 점 $C$에서 한 꼭짓점을 공유하고 있다. $\angle A = 90^\circ, \angle B = 25^\circ, \angle D = 55^\circ$일 때, $\angle E = \angle x$의 크기는? [3점]

**보기** ① $60^\circ$  ② $65^\circ$  ③ $70^\circ$  ④ $75^\circ$  ⑤ $80^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 ABC)
2. 주어진 조건을 계산하여 정답 ①을(를) 도출한다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 두 삼각형 $ABC$와 $CDE$가 점 $C$에서 한 꼭짓점을 공유하고 있다

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 두 삼각형 $ABC$와 $CDE$가 점 $C$에서 한 꼭짓점을 공유하고 있다.」
**RPM** M1-RPM-084 [평면도형 > 다각형 > 삼각형·다각형의 각 > 각의 크기 계산] (원천과 같음)
- 이유: Q1번 문항은 M1-RPM-084에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_M1_TRIANGLE_ANGLE_CONDITION / TPL=TPL_M1_TRIANGLE_ANGLE_CONDITION_EXTERIOR_SUM (원천과 같음) (원천과 같음)
- 이유: Q1번 문항은 PT_M1_TRIANGLE_ANGLE_CONDITION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「다음 그림과 같이 두 삼각형 $ABC$와 $CDE$가 점 $C$에서 한 꼭짓점을 공유하고 있다.」
- goal: 꼭짓점←stem:「다음 그림과 같이 두 삼각형 $ABC$와 $CDE$가 점 $C$에서 한 꼭짓점을 공유하고 있다.」
- method: 꼭지각(NAMED)←solution:「왼쪽 직각삼각형 $ABC$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle ACB &= 180^\circ - 90^\circ - 25^\circ \ &= 65^\circ \end{aligned}$$ 교점 $C$에서 서로 마주 보는 맞꼭지각의 크기는 서로 같으므로 $$\begin{aligned} \angle DCE &= \angle ACB = 65^\circ \end{aligned}$$ 오른쪽 삼각형 $CDE$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle x &= 180^\circ - 55^\circ - 65^\circ \ &= 60^\circ \end{aligned}$$ 따라서 정답은 ①이다.」
- condition: (없음)

**how** Q1번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

왼쪽 직각삼각형 $ABC$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle ACB &= 180^\circ - 90^\circ - 25^\circ \ &= 65^\circ \end{aligned}$$ 교점 $C$에서 서로 마주 보는 맞꼭지각의 크기는 서로 같으므로 $$\begin{aligned} \angle DCE &= \angle ACB = 65^\circ \end{aligned}$$ 오른쪽 삼각형 $CDE$의 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle x &= 180^\circ - 55^\circ - 65^\circ \ &= 60^\circ \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

다음 <조건>을 모두 만족시키는 다각형은? [4점]


• (가) 모든 변의 길이가 같고, 모든 내각의 크기가 같다. • (나) 한 내각의 크기와 그 내각과 이웃한 외각의 크기의 비가 $4 : 1$이다.

**보기** ① 정팔각형  ② 정십각형  ③ 정십이각형  ④ 정십오각형  ⑤ 정이십각형

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정다각형의 한 꼭짓점에서 내각과 이웃한 외각의 크기의 합은 $180^\circ$이다.
2. 내각과 외각의 크기의 비가 $4 : 1$이므로 한 외각의 크기는 다음과 같다.
3. $$\begin{aligned} \text{한 외각의 크기} &= 180^\circ \times \dfrac{1}{4+1} \ &= 180^\circ \times \dfrac{1}{5} \ &= 36^\circ \end{aligned}$$ 정다각형의 모든 외각의 크기의 합은 항상 $360^\circ$이므로 변의 개수를 $n$이라 하면 $$\begin{aligned} n &= \dfrac{360^\circ}{36^\circ} \ &= 10 \end{aligned}$$ 따라서 구하는 다각형은 정십각형이다.
4. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 <조건>을 모두 만족시키는 다각형은?」
**RPM** M1-RPM-083 [평면도형 > 다각형 > 다각형의 내각과 외각 > 정다각형의 각] **원천→판정: 평면도형 > 다각형 > 정다각형 > 조건으로 정다각형 찾기 → 평면도형 > 다각형 > 다각형의 내각과 외각 > 정다각형의 각**
- 이유: Q2번 문항은 M1-RPM-083에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 180)
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_REGULAR_POLYGON_ANGLE (원천과 같음) (원천과 같음)
- 이유: Q2번 문항은 PT_M1_POLYGON_ANGLE_AND_COUNT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 180)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 180)

**4칸**
- given: 다각형←stem:「다음 <조건>을 모두 만족시키는 다각형은?」
- goal: 조건←stem:「다음 <조건>을 모두 만족시키는 다각형은?」
- method: 정다각형(NAMED)←solution:「정다각형의 한 꼭짓점에서 내각과 이웃한 외각의 크기의 합은 $180^\circ$이다.」
- condition: (없음)

**how** Q2번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 180)

<details><summary>저장 해설 (판정 검토용)</summary>

정다각형의 한 꼭짓점에서 내각과 이웃한 외각의 크기의 합은 $180^\circ$이다. 내각과 외각의 크기의 비가 $4 : 1$이므로 한 외각의 크기는 다음과 같다. $$\begin{aligned} \text{한 외각의 크기} &= 180^\circ \times \dfrac{1}{4+1} \ &= 180^\circ \times \dfrac{1}{5} \ &= 36^\circ \end{aligned}$$ 정다각형의 모든 외각의 크기의 합은 항상 $360^\circ$이므로 변의 개수를 $n$이라 하면 $$\begin{aligned} n &= \dfrac{360^\circ}{36^\circ} \ &= 10 \end{aligned}$$ 따라서 구하는 다각형은 정십각형이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 3점


**발문**

$n$각형의 내각의 크기와 외각의 크기의 총합이 $2160^\circ$일 때, 자연수 $n$의 값은? [3점]

**보기** ① $8$  ② $10$  ③ $12$  ④ $14$  ⑤ $16$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $n$각형의 $n$개의 꼭짓점 각각에서 내각과 외각의 크기의 합은 $180^\circ$이다.
2. 따라서 $n$각형의 내각의 크기와 외각의 크기의 총합은 $180^\circ \times n$이므로 $$\begin{aligned} 180^\circ \times n &= 2160^\circ \ n &= \dfrac{2160^\circ}{180^\circ} \ &= 12 \end{aligned}$$ 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「$n$각형의 내각의 크기와 외각의 크기의 총합이 $2160^\circ$일 때, 자연수 $n$의 값은?」
**RPM** M1-RPM-081 [평면도형 > 다각형 > 다각형의 내각과 외각 > 내각의 합] (원천과 같음)
- 이유: Q3번 문항은 M1-RPM-081에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 2160)
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_INTERIOR_EXTERIOR_SUM (원천과 같음) (원천과 같음)
- 이유: Q3번 문항은 PT_M1_POLYGON_ANGLE_AND_COUNT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 2160)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 2160)

**4칸**
- given: 자연수←stem:「$n$각형의 내각의 크기와 외각의 크기의 총합이 $2160^\circ$일 때, 자연수 $n$의 값은?」
- goal: 총합←stem:「$n$각형의 내각의 크기와 외각의 크기의 총합이 $2160^\circ$일 때, 자연수 $n$의 값은?」
- method: 꼭짓점(NAMED)←solution:「$n$각형의 $n$개의 꼭짓점 각각에서 내각과 외각의 크기의 합은 $180^\circ$이다.」
- condition: (없음)

**how** Q3번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 2160)

<details><summary>저장 해설 (판정 검토용)</summary>

$n$각형의 $n$개의 꼭짓점 각각에서 내각과 외각의 크기의 합은 $180^\circ$이다. 따라서 $n$각형의 내각의 크기와 외각의 크기의 총합은 $180^\circ \times n$이므로 $$\begin{aligned} 180^\circ \times n &= 2160^\circ \ n &= \dfrac{2160^\circ}{180^\circ} \ &= 12 \end{aligned}$$ 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림의 사각형 $ABCD$에서 꼭짓점 $A$의 외각의 크기가 $x + 10^\circ$, 꼭짓점 $B$의 외각의 크기가 $120^\circ$이고, $\angle C = 2x, \angle D = 65^\circ$일 때, $\angle C$의 크기는? [4점]

**보기** ① $100^\circ$  ② $110^\circ$  ③ $120^\circ$  ④ $130^\circ$  ⑤ $140^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 ABCD)
2. 주어진 조건을 계산하여 정답 ④을(를) 도출한다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 사각형 $ABCD$에서 꼭짓점 $A$의 외각의 크기가 $x + 10^\circ$, 꼭짓점 $B$의 외각의 크기가 $120^\circ$이고, $\angle C = 2x, \angle D = 65^\circ$일 때, $\angle C$의 크기는

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 사각형 $ABCD$에서 꼭짓점 $A$의 외각의 크기가 $x + 10^\circ$, 꼭짓점 $B$의 외각의 크기가 $120^\circ$이고, $\angle C = 2x, \angle D = 65^\circ$일 때, $\angle C$의 크기는?」
**RPM** M1-RPM-081 [평면도형 > 다각형 > 다각형의 내각과 외각 > 내각의 합] (원천과 같음)
- 이유: Q4번 문항은 M1-RPM-081에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_INTERIOR_EXTERIOR_SUM (원천과 같음) (원천과 같음)
- 이유: Q4번 문항은 PT_M1_POLYGON_ANGLE_AND_COUNT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「다음 그림의 사각형 $ABCD$에서 꼭짓점 $A$의 외각의 크기가 $x + 10^\circ$, 꼭짓점 $B$의 외각의 크기가 $120^\circ$이고, $\angle C = 2x, \angle D = 65^\circ$일 때, $\angle C$의 크기는?」
- goal: 꼭짓점←stem:「다음 그림의 사각형 $ABCD$에서 꼭짓점 $A$의 외각의 크기가 $x + 10^\circ$, 꼭짓점 $B$의 외각의 크기가 $120^\circ$이고, $\angle C = 2x, \angle D = 65^\circ$일 때, $\angle C$의 크기는?」
- method: 내각(NAMED)←solution:「꼭짓점 $A$의 내각의 크기는 외각 $x + 10^\circ$의 보각이므로 $$\begin{aligned} \angle A &= 180^\circ - (x + 10^\circ) = 170^\circ - x \end{aligned}$$ 꼭짓점 $B$의 내각의 크기는 외각 $120^\circ$의 보각이므로 $$\begin{aligned} \angle B &= 180^\circ - 120^\circ = 60^\circ \end{aligned}$$ 사각형의 네 내각의 크기의 합은 $360^\circ$이므로 $$\begin{aligned} \angle A + \angle B + \angle C + \angle D &= 360^\circ \ (170^\circ - x) + 60^\circ + 2x + 65^\circ &= 360^\circ \ x + 295^\circ &= 360^\circ \ x &= 65^\circ \end{aligned}$$ 따라서 $\angle C$의 크기는 $$\begin{aligned} \angle C &= 2x \ &= 2 \times 65^\circ \ &= 130^\circ \end{aligned}$$ 따라서 정답은 ④이다.」
- condition: (없음)

**how** Q4번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

꼭짓점 $A$의 내각의 크기는 외각 $x + 10^\circ$의 보각이므로 $$\begin{aligned} \angle A &= 180^\circ - (x + 10^\circ) = 170^\circ - x \end{aligned}$$ 꼭짓점 $B$의 내각의 크기는 외각 $120^\circ$의 보각이므로 $$\begin{aligned} \angle B &= 180^\circ - 120^\circ = 60^\circ \end{aligned}$$ 사각형의 네 내각의 크기의 합은 $360^\circ$이므로 $$\begin{aligned} \angle A + \angle B + \angle C + \angle D &= 360^\circ \ (170^\circ - x) + 60^\circ + 2x + 65^\circ &= 360^\circ \ x + 295^\circ &= 360^\circ \ x &= 65^\circ \end{aligned}$$ 따라서 $\angle C$의 크기는 $$\begin{aligned} \angle C &= 2x \ &= 2 \times 65^\circ \ &= 130^\circ \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

다음 중 옳지 않은 것은? [4점]

**보기** ① 팔각형의 내각의 크기의 합은 $1080^\circ$이다.  ② 정육각형의 한 외각의 크기는 $60^\circ$이다.  ③ 십이각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 $9$개다.  ④ 팔각형의 대각선의 개수는 $20$개다.  ⑤ 십각형의 한 꼭짓점에서 대각선을 모두 그어서 만들 수 있는 삼각형의 개수는 $9$개다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 보기를 확인한다.
2. $$\begin{aligned} \text{① } & n\text{각형의 내각의 합은 }(n-2) \times 180^\circ\text{이므로} \ & (8-2) \times 180^\circ = 6 \times 180^\circ = 1080^\circ\text{이다.
3. (참)} \ \text{② } & \text{정}n\text{각형의 한 외각의 크기는 }\dfrac{360^\circ}{n}\text{이므로} \ & \dfrac{360^\circ}{6} = 60^\circ\text{이다.
4. (참)} \ \text{③ } & n\text{각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 }n-3\text{개이므로} \ & 12 - 3 = 9\text{개이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 옳지 않은 것은?」
**RPM** M1-RPM-084 [평면도형 > 다각형 > 삼각형·다각형의 각 > 각의 크기 계산] **원천→판정: 평면도형 > 다각형 > 삼각형·다각형의 각 > 변·대각선 개수 → 평면도형 > 다각형 > 삼각형·다각형의 각 > 각의 크기 계산**
- 이유: Q5번 문항은 M1-RPM-084에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 1080)
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_PROPERTY_AUDIT (원천과 같음) (원천과 같음)
- 이유: Q5번 문항은 PT_M1_POLYGON_ANGLE_AND_COUNT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 1080)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 1080)

**4칸**
- given: 내각←choices:「팔각형의 내각의 크기의 합은 $1080^\circ$이다.」
- goal: 정육각형←choices:「정육각형의 한 외각의 크기는 $60^\circ$이다.」
- method: 외각(NAMED)←solution:「(참)} \ \text{② } & \text{정}n\text{각형의 한 외각의 크기는 }\dfrac{360^\circ}{n}\text{이므로} \ & \dfrac{360^\circ}{6} = 60^\circ\text{이다.」
- condition: (없음)

**how** Q5번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 1080)

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 확인한다. $$\begin{aligned} \text{① } & n\text{각형의 내각의 합은 }(n-2) \times 180^\circ\text{이므로} \ & (8-2) \times 180^\circ = 6 \times 180^\circ = 1080^\circ\text{이다. (참)} \ \text{② } & \text{정}n\text{각형의 한 외각의 크기는 }\dfrac{360^\circ}{n}\text{이므로} \ & \dfrac{360^\circ}{6} = 60^\circ\text{이다. (참)} \ \text{③ } & n\text{각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 }n-3\text{개이므로} \ & 12 - 3 = 9\text{개이다. (참)} \ \text{④ } & n\text{각형의 대각선의 총 개수는 }\dfrac{n(n-3)}{2}\text{개이므로} \ & \dfrac{8 \times 5}{2} = 20\text{개이다. (참)} \ \text{⑤ } & n\text{각형의 한 꼭짓점에서 대각선을 모두 그어 만들 수 있는 삼각형의 개수는 }n-2\text{개이므로} \ & 10 - 2 = 8\text{개이다. }9\text{개라는 설명은 옳지 않다. (거짓)} \end{aligned}$$ 따라서 옳지 않은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점


**발문**

다음 그림과 같이 한 변의 길이가 $6\text{ cm}$인 정육각형의 한 꼭짓점을 중심으로 하고 한 변의 길이를 반지름으로 하는 원호를 그렸다. 이때 색칠한 부분의 둘레의 길이는? [4점]

**보기** ① $(4\pi + 24)\text{ cm}$  ② $(4\pi + 30)\text{ cm}$  ③ $(6\pi + 24)\text{ cm}$  ④ $(6\pi + 30)\text{ cm}$  ⑤ $(8\pi + 24)\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정육각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(6-2) \times 180^\circ}{6} &= \dfrac{4 \times 180^\circ}{6} \ &= 120^\circ \end{aligned}$$ 원호의 중심은 정육각형의 한 꼭짓점이므로 호의 반지름은 $6\text{ cm}$이고, 중심각은 $120^\circ$이다.
2. 따라서 호의 길이는 $$\begin{aligned} 2\pi \times 6 \times \dfrac{120^\circ}{360^\circ} &= 12\pi \times \dfrac{1}{3} \ &= 4\pi\text{ cm} \end{aligned}$$ 색칠한 부분의 둘레는 정육각형의 변 $4$개와 이 원호 $1$개로 이루어져 있으므로 $$\begin{aligned} \text{둘레의 길이} &= 4 \times 6 + 4\pi \ &= (4\pi + 24)\text{ cm} \end{aligned}$$ 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 한 변의 길이가 $6\text{ cm}$인 정육각형의 한 꼭짓점을 중심으로 하고 한 변의 길이를 반지름으로 하는 원호를 그렸다

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 한 변의 길이가 $6\text{ cm}$인 정육각형의 한 꼭짓점을 중심으로 하고 한 변의 길이를 반지름으로 하는 원호를 그렸다.」
**RPM** M1-RPM-092 [평면도형 > 원과 부채꼴 > 복합도형 > 부채꼴을 포함한 둘레] (원천과 같음)
- 이유: Q6번 문항은 M1-RPM-092에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_M1_CIRCLE_COMPOSITE_ARC_PERIMETER (원천과 같음) (원천과 같음)
- 이유: Q6번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 반지름←stem:「다음 그림과 같이 한 변의 길이가 $6\text{ cm}$인 정육각형의 한 꼭짓점을 중심으로 하고 한 변의 길이를 반지름으로 하는 원호를 그렸다.」
- goal: 원호←stem:「다음 그림과 같이 한 변의 길이가 $6\text{ cm}$인 정육각형의 한 꼭짓점을 중심으로 하고 한 변의 길이를 반지름으로 하는 원호를 그렸다.」
- method: 중심(NAMED)←solution:「정육각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(6-2) \times 180^\circ}{6} &= \dfrac{4 \times 180^\circ}{6} \ &= 120^\circ \end{aligned}$$ 원호의 중심은 정육각형의 한 꼭짓점이므로 호의 반지름은 $6\text{ cm}$이고, 중심각은 $120^\circ$이다.」
- condition: (없음)

**how** Q6번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

정육각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(6-2) \times 180^\circ}{6} &= \dfrac{4 \times 180^\circ}{6} \ &= 120^\circ \end{aligned}$$ 원호의 중심은 정육각형의 한 꼭짓점이므로 호의 반지름은 $6\text{ cm}$이고, 중심각은 $120^\circ$이다. 따라서 호의 길이는 $$\begin{aligned} 2\pi \times 6 \times \dfrac{120^\circ}{360^\circ} &= 12\pi \times \dfrac{1}{3} \ &= 4\pi\text{ cm} \end{aligned}$$ 색칠한 부분의 둘레는 정육각형의 변 $4$개와 이 원호 $1$개로 이루어져 있으므로 $$\begin{aligned} \text{둘레의 길이} &= 4 \times 6 + 4\pi \ &= (4\pi + 24)\text{ cm} \end{aligned}$$ 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점


**발문**

다음 그림과 같은 원 $O$에서 $\angle AOF : \angle DOB : \angle COE = 13 : 11 : 6$이고 $\overparen{DF} = 5\text{ cm}$일 때, 원 $O$의 둘레의 길이는? [5점] (단, $\overline{AB}, \overline{CD}, \overline{EF}$는 원 $O$의 지름이다.)

**보기** ① $40\text{ cm}$  ② $50\text{ cm}$  ③ $60\text{ cm}$  ④ $70\text{ cm}$  ⑤ $80\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 선분 $\overline{AB}, \overline{CD}, \overline{EF}$는 모두 원 $O$의 지름이므로 교점 $O$에서 마주 보는 맞꼭지각의 크기는 서로 같다.
2. 따라서 $\angle AOF, \angle DOB, \angle COE$의 반대편에 크기가 같은 각이 각각 하나씩 존재하므로 원 전체의 중심각 $360^\circ$에 대한 비의 총합은 $$\begin{aligned} 2 \times (13 + 11 + 6) &= 2 \times 30 \ &= 60 \end{aligned}$$ 호 $\overparen{DF}$에 대한 중심각 $\angle DOF$는 $\angle COE$와 맞꼭지각이므로 크기가 같다.
3. $$\begin{aligned} \angle DOF &= \angle COE = 6\text{ (비율)} \end{aligned}$$ 따라서 호 $\overparen{DF}$의 길이는 원 전체 둘레의 $\dfrac{6}{60} = \dfrac{1}{10}$이다.
4. 호 $\overparen{DF} = 5\text{ cm}$이므로 원 $O$의 둘레의 길이는 $$\begin{aligned} \text{원 } O\text{의 둘레} &= 5 \times \dfrac{60}{6} \ &= 5 \times 10 \ &= 50\text{ cm} \end{aligned}$$ 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같은 원 $O$에서 $\angle AOF : \angle DOB : \angle COE = 13 : 11 : 6$이고 $\overparen{DF} = 5\text{ cm}$일 때, 원 $O$의 둘레의 길이는

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같은 원 $O$에서 $\angle AOF : \angle DOB : \angle COE = 13 : 11 : 6$이고 $\overparen{DF} = 5\text{ cm}$일 때, 원 $O$의 둘레의 길이는?」
**RPM** M1-RPM-089 [평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 부채꼴의 호의 길이] **원천→판정: 평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 중심각·호·현 → 평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 부채꼴의 호의 길이**
- 이유: Q7번 문항은 M1-RPM-089에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AOF)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE (원천과 같음) (원천과 같음)
- 이유: Q7번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AOF)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 AOF)

**4칸**
- given: 둘레←stem:「다음 그림과 같은 원 $O$에서 $\angle AOF : \angle DOB : \angle COE = 13 : 11 : 6$이고 $\overparen{DF} = 5\text{ cm}$일 때, 원 $O$의 둘레의 길이는?」
- goal: 길이←stem:「다음 그림과 같은 원 $O$에서 $\angle AOF : \angle DOB : \angle COE = 13 : 11 : 6$이고 $\overparen{DF} = 5\text{ cm}$일 때, 원 $O$의 둘레의 길이는?」
- method: 선분(NAMED)←solution:「세 선분 $\overline{AB}, \overline{CD}, \overline{EF}$는 모두 원 $O$의 지름이므로 교점 $O$에서 마주 보는 맞꼭지각의 크기는 서로 같다.」
- condition: (없음)

**how** Q7번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 AOF)

<details><summary>저장 해설 (판정 검토용)</summary>

세 선분 $\overline{AB}, \overline{CD}, \overline{EF}$는 모두 원 $O$의 지름이므로 교점 $O$에서 마주 보는 맞꼭지각의 크기는 서로 같다. 따라서 $\angle AOF, \angle DOB, \angle COE$의 반대편에 크기가 같은 각이 각각 하나씩 존재하므로 원 전체의 중심각 $360^\circ$에 대한 비의 총합은 $$\begin{aligned} 2 \times (13 + 11 + 6) &= 2 \times 30 \ &= 60 \end{aligned}$$ 호 $\overparen{DF}$에 대한 중심각 $\angle DOF$는 $\angle COE$와 맞꼭지각이므로 크기가 같다. $$\begin{aligned} \angle DOF &= \angle COE = 6\text{ (비율)} \end{aligned}$$ 따라서 호 $\overparen{DF}$의 길이는 원 전체 둘레의 $\dfrac{6}{60} = \dfrac{1}{10}$이다. 호 $\overparen{DF} = 5\text{ cm}$이므로 원 $O$의 둘레의 길이는 $$\begin{aligned} \text{원 } O\text{의 둘레} &= 5 \times \dfrac{60}{6} \ &= 5 \times 10 \ &= 50\text{ cm} \end{aligned}$$ 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 5점


**발문**

영수가 다음 그림과 같은 정오각형 $ABCDE$에 대하여 탐구한 결과 발표한 내용이다. 옳지 않은 것은? [5점] (단, 점 $F$는 대각선 $AC$와 대각선 $BE$의 교점이다.)

**보기** ① 정오각형의 한 내각의 크기는 $108^\circ$이다.  ② 정오각형의 한 외각의 크기는 $72^\circ$이다.  ③ 대각선 $AC$와 $BE$의 교점 $F$에 대하여 $\angle BFC = 80^\circ$이다.  ④ 삼각형 $ABC$는 이등변삼각형이다.  ⑤ 선분 $CF$와 선분 $EF$의 길이는 같다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정오각형 $ABCDE$의 각 성질을 점검한다.
2. 정오각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(5-2) \times 180^\circ}{5} &= 108^\circ\text{ (① 참)} \end{aligned}$$ 한 외각의 크기는 $$\begin{aligned} \dfrac{360^\circ}{5} &= 72^\circ\text{ (② 참)} \end{aligned}$$ 삼각형 $ABC$에서 $\overline{AB} = \overline{BC}$이므로 삼각형 $ABC$는 이등변삼각형이다.
3. (④ 참) 따라서 밑각의 크기는 $$\begin{aligned} \angle BCA &= \dfrac{180^\circ - 108^\circ}{2} = 36^\circ \end{aligned}$$ 마찬가지로 삼각형 $ABE$에서 $\overline{AB} = \overline{AE}$이므로 $$\begin{aligned} \angle ABE &= \dfrac{180^\circ - 108^\circ}{2} = 36^\circ \end{aligned}$$ 따라서 $\angle CBF$의 크기는 $$\begin{aligned} \angle CBF &= \angle ABC - \angle ABE = 108^\circ - 36^\circ = 72^\circ \end{aligned}$$ 삼각형 $BFC$에서 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle BFC &= 180^\circ - \angle CBF - \angle BCF \ &= 180^\circ - 72^\circ - 36^\circ \ &= 72^\circ \end{aligned}$$ 따라서 $\angle BFC = 80^\circ$라고 한 ③의 설명은 옳지 않다.
4. 또한 대각선 $BE = AC$이고 $\overline{BF} = \overline{AF}$이므로 $\overline{CF} = \overline{EF}$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같은 정오각형 $ABCDE$에 대하여 탐구한 결과 발표한 내용이다

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「영수가 다음 그림과 같은 정오각형 $ABCDE$에 대하여 탐구한 결과 발표한 내용이다.」
**RPM** M1-RPM-083 [평면도형 > 다각형 > 다각형의 내각과 외각 > 정다각형의 각] **원천→판정: 평면도형 > 다각형 > 정다각형 > 정다각형의 성질 → 평면도형 > 다각형 > 다각형의 내각과 외각 > 정다각형의 각**
- 이유: Q8번 문항은 M1-RPM-083에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCDE)
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_PROPERTY_AUDIT (원천과 같음) (원천과 같음)
- 이유: Q8번 문항은 PT_M1_POLYGON_ANGLE_AND_COUNT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCDE)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABCDE)

**4칸**
- given: 정오각형←stem:「영수가 다음 그림과 같은 정오각형 $ABCDE$에 대하여 탐구한 결과 발표한 내용이다.」
- goal: 교점←stem:「[5점] (단, 점 $F$는 대각선 $AC$와 대각선 $BE$의 교점이다.)」
- method: 성질(NAMED)←solution:「정오각형 $ABCDE$의 각 성질을 점검한다.」
- condition: (없음)

**how** Q8번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 ABCDE)

<details><summary>저장 해설 (판정 검토용)</summary>

정오각형 $ABCDE$의 각 성질을 점검한다. 정오각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(5-2) \times 180^\circ}{5} &= 108^\circ\text{ (① 참)} \end{aligned}$$ 한 외각의 크기는 $$\begin{aligned} \dfrac{360^\circ}{5} &= 72^\circ\text{ (② 참)} \end{aligned}$$ 삼각형 $ABC$에서 $\overline{AB} = \overline{BC}$이므로 삼각형 $ABC$는 이등변삼각형이다. (④ 참) 따라서 밑각의 크기는 $$\begin{aligned} \angle BCA &= \dfrac{180^\circ - 108^\circ}{2} = 36^\circ \end{aligned}$$ 마찬가지로 삼각형 $ABE$에서 $\overline{AB} = \overline{AE}$이므로 $$\begin{aligned} \angle ABE &= \dfrac{180^\circ - 108^\circ}{2} = 36^\circ \end{aligned}$$ 따라서 $\angle CBF$의 크기는 $$\begin{aligned} \angle CBF &= \angle ABC - \angle ABE = 108^\circ - 36^\circ = 72^\circ \end{aligned}$$ 삼각형 $BFC$에서 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle BFC &= 180^\circ - \angle CBF - \angle BCF \ &= 180^\circ - 72^\circ - 36^\circ \ &= 72^\circ \end{aligned}$$ 따라서 $\angle BFC = 80^\circ$라고 한 ③의 설명은 옳지 않다. 또한 대각선 $BE = AC$이고 $\overline{BF} = \overline{AF}$이므로 $\overline{CF} = \overline{EF}$이다. (⑤ 참) 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점


**발문**

다음 그림은 한 변의 길이가 같은 정육각형과 정팔각형의 한 변을 붙여 놓은 것이다. 이때 $\angle x$의 크기는? [4점]

**보기** ① $90^\circ$  ② $95^\circ$  ③ $100^\circ$  ④ $105^\circ$  ⑤ $110^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정육각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(6-2) \times 180^\circ}{6} &= \dfrac{4 \times 180^\circ}{6} \ &= 120^\circ \end{aligned}$$ 정팔각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(8-2) \times 180^\circ}{8} &= \dfrac{6 \times 180^\circ}{8} \ &= 135^\circ \end{aligned}$$ 두 정다각형이 한 변을 공유하므로 공유한 변의 꼭짓점에서 세 각의 합은 한 바퀴 $360^\circ$를 이룬다.
2. $$\begin{aligned} 120^\circ + 135^\circ + \angle x &= 360^\circ \ 255^\circ + \angle x &= 360^\circ \ \angle x &= 360^\circ - 255^\circ \ &= 105^\circ \end{aligned}$$ 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림은 한 변의 길이가 같은 정육각형과 정팔각형의 한 변을 붙여 놓은 것이다

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림은 한 변의 길이가 같은 정육각형과 정팔각형의 한 변을 붙여 놓은 것이다.」
**RPM** M1-RPM-081 [평면도형 > 다각형 > 다각형의 내각과 외각 > 내각의 합] **원천→판정: 평면도형 > 다각형 > 다각형의 내각과 외각 > 정다각형의 각 → 평면도형 > 다각형 > 다각형의 내각과 외각 > 내각의 합**
- 이유: Q9번 문항은 M1-RPM-081에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 90)
**유형** PT=PT_M1_REGULAR_POLYGON_COMPOSITE_ANGLE / TPL=TPL_M1_REGULAR_POLYGON_COMPOSITE_ANGLE_REGULAR_POLYGON_ANGLE_CHASE (원천과 같음) (원천과 같음)
- 이유: Q9번 문항은 PT_M1_REGULAR_POLYGON_COMPOSITE_ANGLE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 90)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 90)

**4칸**
- given: 길이←stem:「다음 그림은 한 변의 길이가 같은 정육각형과 정팔각형의 한 변을 붙여 놓은 것이다.」
- goal: 정육각형←stem:「다음 그림은 한 변의 길이가 같은 정육각형과 정팔각형의 한 변을 붙여 놓은 것이다.」
- method: 다각형(NAMED)←solution:「정육각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(6-2) \times 180^\circ}{6} &= \dfrac{4 \times 180^\circ}{6} \ &= 120^\circ \end{aligned}$$ 정팔각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(8-2) \times 180^\circ}{8} &= \dfrac{6 \times 180^\circ}{8} \ &= 135^\circ \end{aligned}$$ 두 정다각형이 한 변을 공유하므로 공유한 변의 꼭짓점에서 세 각의 합은 한 바퀴 $360^\circ$를 이룬다.」
- condition: (없음)

**how** Q9번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 90)

<details><summary>저장 해설 (판정 검토용)</summary>

정육각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(6-2) \times 180^\circ}{6} &= \dfrac{4 \times 180^\circ}{6} \ &= 120^\circ \end{aligned}$$ 정팔각형의 한 내각의 크기는 $$\begin{aligned} \dfrac{(8-2) \times 180^\circ}{8} &= \dfrac{6 \times 180^\circ}{8} \ &= 135^\circ \end{aligned}$$ 두 정다각형이 한 변을 공유하므로 공유한 변의 꼭짓점에서 세 각의 합은 한 바퀴 $360^\circ$를 이룬다. $$\begin{aligned} 120^\circ + 135^\circ + \angle x &= 360^\circ \ 255^\circ + \angle x &= 360^\circ \ \angle x &= 360^\circ - 255^\circ \ &= 105^\circ \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 5점


**발문**

다음 그림은 두 반원 $O', O''$을 큰 원 $O$의 반원에 꼭 맞게 놓은 것이다. 반원 $O'$와 $O''$의 반지름의 길이가 각각 $5\text{ cm}, 3\text{ cm}$일 때, 색칠한 부분의 둘레의 길이는? [5점] (단, 점 $O, O', O''$은 한 직선 상에 있다.)

**보기** ① $16\pi\text{ cm}$  ② $(16\pi + 16)\text{ cm}$  ③ $24\pi\text{ cm}$  ④ $(24\pi + 8)\text{ cm}$  ⑤ $(24\pi + 16)\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 작은 반원 $O', O''$의 반지름이 각각 $5\text{ cm}, 3\text{ cm}$이므로 지름의 길이는 각각 $10\text{ cm}, 6\text{ cm}$이다.
2. 큰 원 $O$의 지름은 두 작은 반원의 지름의 합과 같으므로 $$\begin{aligned} \text{큰 원의 지름} &= 10 + 6 = 16\text{ cm} \ \text{큰 원의 반지름} &= 8\text{ cm} \end{aligned}$$ 큰 원의 둘레의 길이는 $$\begin{aligned} 2\pi \times 8 &= 16\pi\text{ cm} \end{aligned}$$ 두 작은 반원의 호의 길이의 합은 $$\begin{aligned} \pi \times 5 + \pi \times 3 &= 8\pi\text{ cm} \end{aligned}$$ 색칠한 부분의 둘레에는 큰 원의 둘레 전체($16\pi$), 두 작은 반원의 호($8\pi$), 그리고 직선 부분인 두 반원의 지름 선분($10 + 6 = 16\text{ cm}$)이 모두 포함된다.
3. 따라서 색칠한 부분의 둘레의 길이는 $$\begin{aligned} \text{둘레의 길이} &= 16\pi + 8\pi + (10 + 6) \ &= (24\pi + 16)\text{ cm} \end{aligned}$$ 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림은 두 반원 $O', O''$을 큰 원 $O$의 반원에 꼭 맞게 놓은 것이다

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림은 두 반원 $O', O''$을 큰 원 $O$의 반원에 꼭 맞게 놓은 것이다.」
**RPM** M1-RPM-092 [평면도형 > 원과 부채꼴 > 복합도형 > 부채꼴을 포함한 둘레] (원천과 같음)
- 이유: Q10번 문항은 M1-RPM-092에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_M1_CIRCLE_COMPOSITE_ARC_PERIMETER (원천과 같음) (원천과 같음)
- 이유: Q10번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 반원←stem:「다음 그림은 두 반원 $O', O''$을 큰 원 $O$의 반원에 꼭 맞게 놓은 것이다.」
- goal: 반지름←stem:「반원 $O'$와 $O''$의 반지름의 길이가 각각 $5\text{ cm}, 3\text{ cm}$일 때, 색칠한 부분의 둘레의 길이는?」
- method: 길이(NAMED)←solution:「두 작은 반원 $O', O''$의 반지름이 각각 $5\text{ cm}, 3\text{ cm}$이므로 지름의 길이는 각각 $10\text{ cm}, 6\text{ cm}$이다.」
- condition: (없음)

**how** Q10번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

두 작은 반원 $O', O''$의 반지름이 각각 $5\text{ cm}, 3\text{ cm}$이므로 지름의 길이는 각각 $10\text{ cm}, 6\text{ cm}$이다. 큰 원 $O$의 지름은 두 작은 반원의 지름의 합과 같으므로 $$\begin{aligned} \text{큰 원의 지름} &= 10 + 6 = 16\text{ cm} \ \text{큰 원의 반지름} &= 8\text{ cm} \end{aligned}$$ 큰 원의 둘레의 길이는 $$\begin{aligned} 2\pi \times 8 &= 16\pi\text{ cm} \end{aligned}$$ 두 작은 반원의 호의 길이의 합은 $$\begin{aligned} \pi \times 5 + \pi \times 3 &= 8\pi\text{ cm} \end{aligned}$$ 색칠한 부분의 둘레에는 큰 원의 둘레 전체($16\pi$), 두 작은 반원의 호($8\pi$), 그리고 직선 부분인 두 반원의 지름 선분($10 + 6 = 16\text{ cm}$)이 모두 포함된다. 따라서 색칠한 부분의 둘레의 길이는 $$\begin{aligned} \text{둘레의 길이} &= 16\pi + 8\pi + (10 + 6) \ &= (24\pi + 16)\text{ cm} \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 3점


**발문**

다음 설명 중 옳지 않은 것은? [3점]

**보기** ① 정팔면체의 한 꼭짓점에 모인 면의 개수는 $3$개이다.  ② 다각형인 면으로만 둘러싸인 입체도형을 다면체라고 한다.  ③ 정이십면체의 면의 모양은 정삼각형이다.  ④ 정다면체는 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 $5$가지뿐이다.  ⑤ 정육면체의 한 꼭짓점에 모인 면의 개수는 $3$개이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 보기를 확인한다.
2. $$\begin{aligned} \text{① } & \text{정팔면체의 한 꼭짓점에 모인 면의 개수는 }4\text{개이다.
3. }3\text{개라는 설명은 옳지 않다.
4. (거짓)} \ \text{② } & \text{다면체의 정의는 다각형인 면으로만 둘러싸인 입체도형이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE(입체도형) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 설명 중 옳지 않은 것은?」
**RPM** M1-RPM-096 [입체도형 > 다면체와 회전체 > 정다면체 > 정다면체의 종류] (원천과 같음)
- 이유: Q11번 문항은 M1-RPM-096에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS / TPL=TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT (원천과 같음) (원천과 같음)
- 이유: Q11번 문항은 PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 개수←choices:「정팔면체의 한 꼭짓점에 모인 면의 개수는 $3$개이다.」
- goal: 꼭짓점←choices:「정팔면체의 한 꼭짓점에 모인 면의 개수는 $3$개이다.」
- method: 정팔면체(NAMED)←solution:「$$\begin{aligned} \text{① } & \text{정팔면체의 한 꼭짓점에 모인 면의 개수는 }4\text{개이다.」
- condition: (없음)

**how** Q11번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

각 보기를 확인한다. $$\begin{aligned} \text{① } & \text{정팔면체의 한 꼭짓점에 모인 면의 개수는 }4\text{개이다. }3\text{개라는 설명은 옳지 않다. (거짓)} \ \text{② } & \text{다면체의 정의는 다각형인 면으로만 둘러싸인 입체도형이다. (참)} \ \text{③ } & \text{정이십면체의 모든 면은 서로 합동인 정삼각형이다. (참)} \ \text{④ } & \text{정다면체는 }5\text{가지뿐이다. (참)} \ \text{⑤ } & \text{정육면체의 한 꼭짓점에 모인 면의 개수는 }3\text{개이다. (참)} \end{aligned}$$ 따라서 옳지 않은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림의 직사각형을 직선 $l$을 축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이와 부피를 순서대로 나열한 것은? [4점] (단, 회전축 $l$에서 직사각형의 안쪽 변까지의 거리는 $2\text{ cm}$, 직사각형의 가로는 $2\text{ cm}$, 세로는 $6\text{ cm}$이다.)

**보기** ① $72\pi\text{ cm}^2,; 96\pi\text{ cm}^3$  ② $96\pi\text{ cm}^2,; 72\pi\text{ cm}^3$  ③ $96\pi\text{ cm}^2,; 96\pi\text{ cm}^3$  ④ $108\pi\text{ cm}^2,; 72\pi\text{ cm}^3$  ⑤ $120\pi\text{ cm}^2,; 96\pi\text{ cm}^3$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직사각형을 직선 $l$을 축으로 하여 1회전 시키면 가운데가 뚫린 속 빈 원기둥이 생긴다.
2. 회전축에서 직사각형까지의 거리가 $2\text{ cm}$이므로 안쪽 반지름은 $2\text{ cm}$이고, 직사각형의 가로가 $2\text{ cm}$이므로 바깥쪽 반지름은 $2 + 2 = 4\text{ cm}$이다.
3. 높이는 $6\text{ cm}$이다.
4. 먼저 부피를 구하면 다음과 같다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림의 직사각형을 직선 $l$을 축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이와 부피를 순서대로 나열한 것은

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림의 직사각형을 직선 $l$을 축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이와 부피를 순서대로 나열한 것은?」
**RPM** M1-RPM-100 [입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 각기둥] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 원기둥 → 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 각기둥**
- 이유: Q12번 문항은 M1-RPM-100에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_STANDARD_MEASURE (원천과 같음) (원천과 같음)
- 이유: Q12번 문항은 PT_M1_SOLID_FIGURE_MEASURE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 순서←stem:「다음 그림의 직사각형을 직선 $l$을 축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이와 부피를 순서대로 나열한 것은?」
- goal: 직선←stem:「다음 그림의 직사각형을 직선 $l$을 축으로 하여 1회전 시킬 때 생기는 회전체의 겉넓이와 부피를 순서대로 나열한 것은?」
- method: 사각형(NAMED)←solution:「직사각형을 직선 $l$을 축으로 하여 1회전 시키면 가운데가 뚫린 속 빈 원기둥이 생긴다.」
- condition: (없음)

**how** Q12번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

직사각형을 직선 $l$을 축으로 하여 1회전 시키면 가운데가 뚫린 속 빈 원기둥이 생긴다. 회전축에서 직사각형까지의 거리가 $2\text{ cm}$이므로 안쪽 반지름은 $2\text{ cm}$이고, 직사각형의 가로가 $2\text{ cm}$이므로 바깥쪽 반지름은 $2 + 2 = 4\text{ cm}$이다. 높이는 $6\text{ cm}$이다.


먼저 부피를 구하면 다음과 같다. $$\begin{aligned} \text{부피} &= \pi \times (4^2 - 2^2) \times 6 \ &= \pi \times (16 - 4) \times 6 \ &= 72\pi\text{ cm}^3 \end{aligned}$$


겉넓이는 바깥쪽 옆넓이, 안쪽 옆넓이, 그리고 위아래 두 도넛 모양(고리 모양) 밑면의 넓이의 합이다. $$\begin{aligned} \text{바깥쪽 옆넓이} &= 2\pi \times 4 \times 6 = 48\pi\text{ cm}^2 \ \text{안쪽 옆넓이} &= 2\pi \times 2 \times 6 = 24\pi\text{ cm}^2 \ \text{두 밑면의 넓이} &= 2 \times \pi \times (4^2 - 2^2) = 2 \times 12\pi = 24\pi\text{ cm}^2 \ \text{겉넓이} &= 48\pi + 24\pi + 24\pi = 96\pi\text{ cm}^2 \end{aligned}$$ 따라서 겉넓이와 부피는 순서대로 $96\pi\text{ cm}^2, 72\pi\text{ cm}^3$이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 <보기> 중 회전체와 그 회전체를 회전축을 포함하는 평면으로 자른 단면의 모양이 올바르게 짝지어진 것만을 있는 대로 고른 것은? [4점]


• ㄱ. 원뿔 - 이등변삼각형 • ㄴ. 구 - 원 • ㄷ. 원기둥 - 사다리꼴 • ㄹ. 원뿔대 - 사다리꼴 • ㅁ. 반구 - 직사각형

**보기** ① ㄱ, ㄷ  ② ㄴ, ㄹ  ③ ㄱ, ㄴ, ㄹ  ④ ㄱ, ㄷ, ㅁ  ⑤ ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 회전축을 포함하는 평면으로 자른 단면의 모양을 각 회전체별로 확인한다.
2. $$\begin{aligned} \text{ㄱ.
3. 원뿔} &: \text{이등변삼각형 (참)} \ \text{ㄴ.
4. 구} &: \text{원 (참)} \ \text{ㄷ.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE(입체도형) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 <보기> 중 회전체와 그 회전체를 회전축을 포함하는 평면으로 자른 단면의 모양이 올바르게 짝지어진 것만을 있는 대로 고른 것은?」
**RPM** M1-RPM-094 [입체도형 > 다면체와 회전체 > 다면체 > 면·모서리·꼭짓점] **원천→판정: 입체도형 > 다면체와 회전체 > 회전체 > 회전체의 단면 → 입체도형 > 다면체와 회전체 > 다면체 > 면·모서리·꼭짓점**
- 이유: Q13번 문항은 M1-RPM-094에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M1_ROTATION_SOLID_PROPERTIES / TPL=TPL_M1_ROTATION_SOLID_PROPERTIES_CLAIM_AUDIT (원천과 같음) (원천과 같음)
- 이유: Q13번 문항은 PT_M1_ROTATION_SOLID_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 평면←stem:「다음 <보기> 중 회전체와 그 회전체를 회전축을 포함하는 평면으로 자른 단면의 모양이 올바르게 짝지어진 것만을 있는 대로 고른 것은?」
- goal: 회전체←stem:「다음 <보기> 중 회전체와 그 회전체를 회전축을 포함하는 평면으로 자른 단면의 모양이 올바르게 짝지어진 것만을 있는 대로 고른 것은?」
- method: 회전축(NAMED)←solution:「회전축을 포함하는 평면으로 자른 단면의 모양을 각 회전체별로 확인한다.」
- condition: (없음)

**how** Q13번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

회전축을 포함하는 평면으로 자른 단면의 모양을 각 회전체별로 확인한다. $$\begin{aligned} \text{ㄱ. 원뿔} &: \text{이등변삼각형 (참)} \ \text{ㄴ. 구} &: \text{원 (참)} \ \text{ㄷ. 원기둥} &: \text{직사각형 (사다리꼴이라는 설명은 거짓)} \ \text{ㄹ. 원뿔대} &: \text{등변사다리꼴 (참)} \ \text{ㅁ. 반구} &: \text{반원 (직사각형이라는 설명은 거짓)} \end{aligned}$$ 따라서 올바르게 짝지어진 것은 ㄱ, ㄴ, ㄹ이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

삼각기둥의 전개도가 [그림 1]과 같다. 삼각기둥의 겉넓이가 [그림 2]와 같이 밑면이 사다리꼴인 사각기둥의 겉넓이의 $\dfrac{1}{2}$배일 때, 사각기둥의 높이는? [5점] (단, [그림 1]의 밑면은 세 변의 길이가 각각 $3\text{ cm}, 4\text{ cm}, 5\text{ cm}$인 직각삼각형이고 삼각기둥의 높이는 $8\text{ cm}$이다. [그림 2]의 밑면인 사다리꼴은 평행한 두 변의 길이가 $2\text{ cm}, 6\text{ cm}$, 높이가 $3\text{ cm}$, 다른 한 빗변의 길이가 $5\text{ cm}$인 사다리꼴이다.)

**보기** ① $6\text{ cm}$  ② $8\text{ cm}$  ③ $10\text{ cm}$  ④ $12\text{ cm}$  ⑤ $14\text{ cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 cm)
2. 주어진 조건을 계산하여 정답 ④을(를) 도출한다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 전개도가 [그림 1]과 같다

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「삼각기둥의 전개도가 [그림 1]과 같다.」
**RPM** M1-RPM-100 [입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 각기둥] (원천과 같음)
- 이유: Q14번 문항은 M1-RPM-100에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_STANDARD_MEASURE (원천과 같음) (원천과 같음)
- 이유: Q14번 문항은 PT_M1_SOLID_FIGURE_MEASURE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 전개←stem:「삼각기둥의 전개도가 [그림 1]과 같다.」
- goal: 전개도←stem:「삼각기둥의 전개도가 [그림 1]과 같다.」
- method: 삼각형(NAMED)←solution:「[그림 1]의 삼각기둥 밑면은 두 변이 $3\text{ cm}, 4\text{ cm}$인 직각삼각형이므로 $$\begin{aligned} \text{삼각기둥 밑넓이} &= \dfrac{1}{2} \times 3 \times 4 = 6\text{ cm}^2 \ \text{삼각기둥 밑면 둘레} &= 3 + 4 + 5 = 12\text{ cm} \end{aligned}$$ 삼각기둥의 높이가 $8\text{ cm}$이므로 겉넓이는 $$\begin{aligned} \text{삼각기둥 겉넓이} &= 2 \times 6 + 12 \times 8 \ &= 12 + 96 \ &= 108\text{ cm}^2 \end{aligned}$$ 삼각기둥의 겉넓이가 사각기둥 겉넓이의 $\dfrac{1}{2}$배이므로 $$\begin{aligned} \text{사각기둥 겉넓이} &= 108 \times 2 = 216\text{ cm}^2 \end{aligned}$$ [그림 2]의 사각기둥 밑면 사다리꼴의 넓이와 둘레는 $$\begin{aligned} \text{사각기둥 밑넓이} &= \dfrac{(2 + 6) \times 3}{2} = 12\text{ cm}^2 \ \text{사각기둥 밑면 둘레} &= 2 + 3 + 6 + 5 = 16\text{ cm} \end{aligned}$$ 사각기둥의 높이를 $h$라 하면 $$\begin{aligned} 2 \times 12 + 16 \times h &= 216 \ 24 + 16h &= 216 \ 16h &= 192 \ h &= 12\text{ cm} \end{aligned}$$ 따라서 정답은 ④이다.」
- condition: (없음)

**how** Q14번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

[그림 1]의 삼각기둥 밑면은 두 변이 $3\text{ cm}, 4\text{ cm}$인 직각삼각형이므로 $$\begin{aligned} \text{삼각기둥 밑넓이} &= \dfrac{1}{2} \times 3 \times 4 = 6\text{ cm}^2 \ \text{삼각기둥 밑면 둘레} &= 3 + 4 + 5 = 12\text{ cm} \end{aligned}$$ 삼각기둥의 높이가 $8\text{ cm}$이므로 겉넓이는 $$\begin{aligned} \text{삼각기둥 겉넓이} &= 2 \times 6 + 12 \times 8 \ &= 12 + 96 \ &= 108\text{ cm}^2 \end{aligned}$$ 삼각기둥의 겉넓이가 사각기둥 겉넓이의 $\dfrac{1}{2}$배이므로 $$\begin{aligned} \text{사각기둥 겉넓이} &= 108 \times 2 = 216\text{ cm}^2 \end{aligned}$$ [그림 2]의 사각기둥 밑면 사다리꼴의 넓이와 둘레는 $$\begin{aligned} \text{사각기둥 밑넓이} &= \dfrac{(2 + 6) \times 3}{2} = 12\text{ cm}^2 \ \text{사각기둥 밑면 둘레} &= 2 + 3 + 6 + 5 = 16\text{ cm} \end{aligned}$$ 사각기둥의 높이를 $h$라 하면 $$\begin{aligned} 2 \times 12 + 16 \times h &= 216 \ 24 + 16h &= 216 \ 16h &= 192 \ h &= 12\text{ cm} \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음 그림과 같이 원기둥에 꼭 맞는 원뿔과 구가 들어있다. 원기둥의 밑면의 반지름의 길이를 $r$이라 할 때, 원기둥의 부피, 구의 부피, 원뿔의 부피의 비는? [4점]

**보기** ① 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $1 : 2 : 3$  ② 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $2 : 3 : 1$  ③ 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $3 : 1 : 2$  ④ 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $2 : 1 : 3$  ⑤ 원기둥의 부피 : 구의 부피 : 원뿔의 부피 = $3 : 2 : 1$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 구와 원뿔이 원기둥에 꼭 맞게 들어 있으므로 원기둥의 밑면의 반지름은 $r$, 높이는 구의 지름과 같으므로 $2r$이다.
2. 각 입체도형의 부피를 구하면 다음과 같다.
3. $$\begin{aligned} \text{원기둥의 부피} &= \pi r^2 \times 2r = 2\pi r^3 \ \text{구의 부피} &= \dfrac{4}{3}\pi r^3 \ \text{원뿔의 부피} &= \dfrac{1}{3}\pi r^2 \times 2r = \dfrac{2}{3}\pi r^3 \end{aligned}$$ 세 부피의 비를 구하면 $$\begin{aligned} \text{원기둥} : \text{구} : \text{원뿔} &= 2\pi r^3 : \dfrac{4}{3}\pi r^3 : \dfrac{2}{3}\pi r^3 \ &= 2 : \dfrac{4}{3} : \dfrac{2}{3} \ &= 6 : 4 : 2 \ &= 3 : 2 : 1 \end{aligned}$$ 따라서 정답은 ⑤이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 원기둥에 꼭 맞는 원뿔과 구가 들어있다

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 원기둥에 꼭 맞는 원뿔과 구가 들어있다.」
**RPM** M1-RPM-104 [입체도형 > 입체도형의 겉넓이와 부피 > 구 > 구의 겉넓이] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 구 > 구의 부피 → 입체도형 > 입체도형의 겉넓이와 부피 > 구 > 구의 겉넓이**
- 이유: Q15번 문항은 M1-RPM-104에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_STANDARD_MEASURE (원천과 같음) (원천과 같음)
- 이유: Q15번 문항은 PT_M1_SOLID_FIGURE_MEASURE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 원기둥←stem:「다음 그림과 같이 원기둥에 꼭 맞는 원뿔과 구가 들어있다.」
- goal: 원뿔←stem:「다음 그림과 같이 원기둥에 꼭 맞는 원뿔과 구가 들어있다.」
- method: 반지름(NAMED)←solution:「구와 원뿔이 원기둥에 꼭 맞게 들어 있으므로 원기둥의 밑면의 반지름은 $r$, 높이는 구의 지름과 같으므로 $2r$이다.」
- condition: (없음)

**how** Q15번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

구와 원뿔이 원기둥에 꼭 맞게 들어 있으므로 원기둥의 밑면의 반지름은 $r$, 높이는 구의 지름과 같으므로 $2r$이다. 각 입체도형의 부피를 구하면 다음과 같다. $$\begin{aligned} \text{원기둥의 부피} &= \pi r^2 \times 2r = 2\pi r^3 \ \text{구의 부피} &= \dfrac{4}{3}\pi r^3 \ \text{원뿔의 부피} &= \dfrac{1}{3}\pi r^2 \times 2r = \dfrac{2}{3}\pi r^3 \end{aligned}$$ 세 부피의 비를 구하면 $$\begin{aligned} \text{원기둥} : \text{구} : \text{원뿔} &= 2\pi r^3 : \dfrac{4}{3}\pi r^3 : \dfrac{2}{3}\pi r^3 \ &= 2 : \dfrac{4}{3} : \dfrac{2}{3} \ &= 6 : 4 : 2 \ &= 3 : 2 : 1 \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 모든 면이 합동인 다각형으로 이루어진 입체도형을 설명한 것이다. 이 중 정다면체가 아닌 것은? [3점]

**보기** ① 모든 면이 합동인 정사각형 6개이며, 어떤 꼭짓점에는 3개, 다른 꼭짓점에는 4개씩 모인다.  ② 모든 면이 합동인 정삼각형 4개이고, 각 꼭짓점에 3개씩 모인다.  ③ 모든 면이 합동인 정사각형 6개이고, 각 꼭짓점에 3개씩 모인다.  ④ 모든 면이 합동인 정삼각형 8개이고, 각 꼭짓점에 4개씩 모인다.  ⑤ 모든 면이 합동인 정오각형 12개이고, 각 꼭짓점에 3개씩 모인다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정다면체가 되기 위한 조건은 다음 두 가지를 모두 만족해야 한다. (문항 토큰 12)
2. 모든 면이 서로 합동인 정다각형이어야 한다.
3. 각 꼭짓점에 모인 면의 개수가 모두 같아야 한다.
4. ①의 경우 면이 모두 합동인 정사각형이라 하더라도, 꼭짓점마다 모인 면의 개수가 $3$개 또는 $4$개로 서로 다르므로 정다면체의 조건을 만족하지 않는다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE(입체도형) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 모든 면이 합동인 다각형으로 이루어진 입체도형을 설명한 것이다.」
**RPM** M1-RPM-096 [입체도형 > 다면체와 회전체 > 정다면체 > 정다면체의 종류] (원천과 같음)
- 이유: Q16번 문항은 M1-RPM-096에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 12)
**유형** PT=PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS / TPL=TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_FACE_PROPERTY_AUDIT (원천과 같음) (원천과 같음)
- 이유: Q16번 문항은 PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 12)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 12)

**4칸**
- given: 다각형←stem:「다음은 모든 면이 합동인 다각형으로 이루어진 입체도형을 설명한 것이다.」
- goal: 입체도형←stem:「다음은 모든 면이 합동인 다각형으로 이루어진 입체도형을 설명한 것이다.」
- method: 위한조건(NAMED)←solution:「정다면체가 되기 위한 조건은 다음 두 가지를 모두 만족해야 한다.」
- condition: (없음)

**how** Q16번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 12)

<details><summary>저장 해설 (판정 검토용)</summary>

정다면체가 되기 위한 조건은 다음 두 가지를 모두 만족해야 한다.


1. 모든 면이 서로 합동인 정다각형이어야 한다.
2. 각 꼭짓점에 모인 면의 개수가 모두 같아야 한다.


①의 경우 면이 모두 합동인 정사각형이라 하더라도, 꼭짓점마다 모인 면의 개수가 $3$개 또는 $4$개로 서로 다르므로 정다면체의 조건을 만족하지 않는다. ②~⑤는 각각 정사면체, 정육면체, 정팔면체, 정십이면체에 해당하여 모두 정다면체이다. 따라서 정다면체가 아닌 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 4점


**발문**

다음 표는 어느 중학교 A반과 B반 학생들의 일주일 동안의 봉사활동 시간에 대한 상대도수의 분포표이다. 다음 중 옳지 않은 것은? [4점]


봉사활동 시간 (시간) | A반 상대도수 | B반 상대도수 0 이상 ~ 2 미만 | 0.10 | 0.15 2 ~ 4 | 0.25 | 0.20 4 ~ 6 | 0.35 | 0.25 6 ~ 8 | 0.20 | 0.30 8 ~ 10 | 0.10 | 0.10 합계 | 1.00 | 1.00

**보기** ① A반과 B반의 상대도수의 총합은 각각 1로 서로 같다.  ② A반에서 봉사활동 시간이 4시간 이상 6시간 미만인 계급의 상대도수는 0.25이다.  ③ B반에서 봉사활동 시간이 6시간 이상 8시간 미만인 계급의 상대도수는 0.30이다.  ④ 봉사활동 시간이 8시간 이상 10시간 미만인 계급의 상대도수는 두 반 모두 0.10이다.  ⑤ 봉사활동 시간이 6시간 이상인 학생의 비율은 B반이 A반보다 더 높다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 표를 보고 각 보기를 확인한다.
2. $$\begin{aligned} \text{① } & \text{상대도수의 총합은 전체 인원과 관계없이 항상 }1\text{로 서로 같다.
3. (참)} \ \text{② } & A\text{반에서 }4\text{시간 이상 }6\text{시간 미만인 계급의 상대도수는 }0.35\text{이다.} \ & 0.25\text{는 }B\text{반의 상대도수이므로 옳지 않다.
4. (거짓)} \ \text{③ } & B\text{반에서 }6\text{시간 이상 }8\text{시간 미만인 계급의 상대도수는 }0.30\text{이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 표는 어느 중학교 A반과 B반 학생들의 일주일 동안의 봉사활동 시간에 대한 상대도수의 분포표이다

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 표는 어느 중학교 A반과 B반 학생들의 일주일 동안의 봉사활동 시간에 대한 상대도수의 분포표이다.」
**RPM** M1-RPM-112 [통계 > 자료의 정리와 해석 > 자료 해석 > 그래프 비교] (원천과 같음)
- 이유: Q17번 문항은 M1-RPM-112에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 0.10)
**유형** PT=PT_M1_DATA_CATEGORY_PERCENTAGE / TPL=TPL_M1_DATA_CATEGORY_PERCENTAGE_DISTRIBUTION_GRAPH_COMPARISON (원천과 같음) (원천과 같음)
- 이유: Q17번 문항은 PT_M1_DATA_CATEGORY_PERCENTAGE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 0.10)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 0.10)

**4칸**
- given: 상대도수←stem:「다음 표는 어느 중학교 A반과 B반 학생들의 일주일 동안의 봉사활동 시간에 대한 상대도수의 분포표이다.」
- goal: 분포←stem:「다음 표는 어느 중학교 A반과 B반 학생들의 일주일 동안의 봉사활동 시간에 대한 상대도수의 분포표이다.」
- method: 총합(NAMED)←solution:「$$\begin{aligned} \text{① } & \text{상대도수의 총합은 전체 인원과 관계없이 항상 }1\text{로 서로 같다.」
- condition: (없음)

**how** Q17번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 0.10)

<details><summary>저장 해설 (판정 검토용)</summary>

표를 보고 각 보기를 확인한다. $$\begin{aligned} \text{① } & \text{상대도수의 총합은 전체 인원과 관계없이 항상 }1\text{로 서로 같다. (참)} \ \text{② } & A\text{반에서 }4\text{시간 이상 }6\text{시간 미만인 계급의 상대도수는 }0.35\text{이다.} \ & 0.25\text{는 }B\text{반의 상대도수이므로 옳지 않다. (거짓)} \ \text{③ } & B\text{반에서 }6\text{시간 이상 }8\text{시간 미만인 계급의 상대도수는 }0.30\text{이다. (참)} \ \text{④ } & 8\text{시간 이상 }10\text{시간 미만인 계급의 상대도수는 두 반 모두 }0.10\text{이다. (참)} \ \text{⑤ } & 6\text{시간 이상인 학생의 상대도수의 합은 다음과 같다.} \ & A\text{반: } 0.20 + 0.10 = 0.30 \ & B\text{반: } 0.30 + 0.10 = 0.40 \ & 0.40 > 0.30\text{이므로 }B\text{반이 }A\text{반보다 비율이 더 높다. (참)} \end{aligned}$$ 따라서 옳지 않은 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 3점


**발문**

어느 자료에서 상대도수가 $0.05$인 계급의 도수가 $2$명일 때, 도수가 $a$명인 계급의 상대도수는 $0.25$이고, 도수가 $14$명인 계급의 상대도수는 $b$이다. 이때 $a, b$의 값으로 옳은 것은? [3점]

**보기** ① $a = 8, ; b = 0.35$  ② $a = 10, ; b = 0.3$  ③ $a = 10, ; b = 0.35$  ④ $a = 12, ; b = 0.35$  ⑤ $a = 12, ; b = 0.4$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 상대도수가 $0.05$인 계급의 도수가 $2$명이므로 전체 학생 수는 $$\begin{aligned} \text{전체 도수} &= \dfrac{\text{도수}}{\text{상대도수}} \ &= \dfrac{2}{0.05} \ &= 40\text{ (명)} \end{aligned}$$ 상대도수가 $0.25$인 계급의 도수 $a$는 $$\begin{aligned} a &= 40 \times 0.25 \ &= 10\text{ (명)} \end{aligned}$$ 도수가 $14$명인 계급의 상대도수 $b$는 $$\begin{aligned} b &= \dfrac{14}{40} \ &= 0.35 \end{aligned}$$ 따라서 $a = 10, b = 0.35$이다.
2. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「어느 자료에서 상대도수가 $0.05$인 계급의 도수가 $2$명일 때, 도수가 $a$명인 계급의 상대도수는 $0.25$이고, 도수가 $14$명인 계급의 상대도수는 $b$이다.」
**RPM** M1-RPM-110 [통계 > 자료의 정리와 해석 > 상대도수 > 상대도수 계산] (원천과 같음)
- 이유: Q18번 문항은 M1-RPM-110에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 0.05)
**유형** PT=PT_M1_DATA_CATEGORY_PERCENTAGE / TPL=TPL_M1_DATA_CATEGORY_PERCENTAGE_POPULATION_RECONSTRUCTION (원천과 같음) (원천과 같음)
- 이유: Q18번 문항은 PT_M1_DATA_CATEGORY_PERCENTAGE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 0.05)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 0.05)

**4칸**
- given: 자료←stem:「어느 자료에서 상대도수가 $0.05$인 계급의 도수가 $2$명일 때, 도수가 $a$명인 계급의 상대도수는 $0.25$이고, 도수가 $14$명인 계급의 상대도수는 $b$이다.」
- goal: 상대도수←stem:「어느 자료에서 상대도수가 $0.05$인 계급의 도수가 $2$명일 때, 도수가 $a$명인 계급의 상대도수는 $0.25$이고, 도수가 $14$명인 계급의 상대도수는 $b$이다.」
- method: 계급(NAMED)←solution:「상대도수가 $0.05$인 계급의 도수가 $2$명이므로 전체 학생 수는 $$\begin{aligned} \text{전체 도수} &= \dfrac{\text{도수}}{\text{상대도수}} \ &= \dfrac{2}{0.05} \ &= 40\text{ (명)} \end{aligned}$$ 상대도수가 $0.25$인 계급의 도수 $a$는 $$\begin{aligned} a &= 40 \times 0.25 \ &= 10\text{ (명)} \end{aligned}$$ 도수가 $14$명인 계급의 상대도수 $b$는 $$\begin{aligned} b &= \dfrac{14}{40} \ &= 0.35 \end{aligned}$$ 따라서 $a = 10, b = 0.35$이다.」
- condition: (없음)

**how** Q18번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 0.05)

<details><summary>저장 해설 (판정 검토용)</summary>

상대도수가 $0.05$인 계급의 도수가 $2$명이므로 전체 학생 수는 $$\begin{aligned} \text{전체 도수} &= \dfrac{\text{도수}}{\text{상대도수}} \ &= \dfrac{2}{0.05} \ &= 40\text{ (명)} \end{aligned}$$ 상대도수가 $0.25$인 계급의 도수 $a$는 $$\begin{aligned} a &= 40 \times 0.25 \ &= 10\text{ (명)} \end{aligned}$$ 도수가 $14$명인 계급의 상대도수 $b$는 $$\begin{aligned} b &= \dfrac{14}{40} \ &= 0.35 \end{aligned}$$ 따라서 $a = 10, b = 0.35$이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점


**발문**

다음 상대도수의 분포표는 어느 학교 줄넘기 대회에 참가한 학생들이 성공한 횟수를 조사하여 일부를 나타낸 것이다. $A+B+C$의 값은? [4점]


성공한 횟수(회) | 학생 수(명) | 상대도수 0 이상 ~ 10 미만 | 6 | A 10 ~ 20 | 15 | 0.3 20 ~ 30 | B | 0.24 30 ~ 40 | | 40 ~ 50 | | 합계 | C | 1

**보기** ① $50.12$  ② $60.12$  ③ $62.02$  ④ $62.12$  ⑤ $65.12$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $10\text{회 이상 }20\text{회 미만}$ 계급의 학생 수가 $15$명이고 상대도수가 $0.3$이므로 전체 학생 수 $C$는 다음과 같다.
2. $$\begin{aligned} C &= \dfrac{15}{0.3} \ &= 50\text{ (명)} \end{aligned}$$ $0\text{회 이상 }10\text{회 미만}$ 계급의 학생 수가 $6$명이므로 상대도수 $A$는 $$\begin{aligned} A &= \dfrac{6}{50} \ &= 0.12 \end{aligned}$$ $20\text{회 이상 }30\text{회 미만}$ 계급의 상대도수가 $0.24$이므로 학생 수 $B$는 $$\begin{aligned} B &= 50 \times 0.24 \ &= 12\text{ (명)} \end{aligned}$$ 따라서 $A + B + C$의 값은 $$\begin{aligned} A + B + C &= 0.12 + 12 + 50 \ &= 62.12 \end{aligned}$$ 따라서 정답은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 표는 어느 학교 줄넘기 대회에 참가한 학생들이 성공한 횟수를 조사하여 일부를 나타낸 것이다

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_ORGANIZATION(자료의 정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 상대도수의 분포표는 어느 학교 줄넘기 대회에 참가한 학생들이 성공한 횟수를 조사하여 일부를 나타낸 것이다.」
**RPM** M1-RPM-108 [통계 > 자료의 정리와 해석 > 도수분포 > 도수분포표] (원천과 같음)
- 이유: Q19번 문항은 M1-RPM-108에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_M1_FREQUENCY_DISTRIBUTION_READING / TPL=TPL_M1_FREQUENCY_DISTRIBUTION_READING_MULTI_CELL_RECONSTRUCTION (원천과 같음) (원천과 같음)
- 이유: Q19번 문항은 PT_M1_FREQUENCY_DISTRIBUTION_READING 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 횟수←stem:「다음 상대도수의 분포표는 어느 학교 줄넘기 대회에 참가한 학생들이 성공한 횟수를 조사하여 일부를 나타낸 것이다.」
- goal: 상대도수←stem:「다음 상대도수의 분포표는 어느 학교 줄넘기 대회에 참가한 학생들이 성공한 횟수를 조사하여 일부를 나타낸 것이다.」
- method: 계급(NAMED)←solution:「$10\text{회 이상 }20\text{회 미만}$ 계급의 학생 수가 $15$명이고 상대도수가 $0.3$이므로 전체 학생 수 $C$는 다음과 같다.」
- condition: (없음)

**how** Q19번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

$10\text{회 이상 }20\text{회 미만}$ 계급의 학생 수가 $15$명이고 상대도수가 $0.3$이므로 전체 학생 수 $C$는 다음과 같다. $$\begin{aligned} C &= \dfrac{15}{0.3} \ &= 50\text{ (명)} \end{aligned}$$ $0\text{회 이상 }10\text{회 미만}$ 계급의 학생 수가 $6$명이므로 상대도수 $A$는 $$\begin{aligned} A &= \dfrac{6}{50} \ &= 0.12 \end{aligned}$$ $20\text{회 이상 }30\text{회 미만}$ 계급의 상대도수가 $0.24$이므로 학생 수 $B$는 $$\begin{aligned} B &= 50 \times 0.24 \ &= 12\text{ (명)} \end{aligned}$$ 따라서 $A + B + C$의 값은 $$\begin{aligned} A + B + C &= 0.12 + 12 + 50 \ &= 62.12 \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림과 같은 원뿔대의 겉넓이를 $S_1$이라 하고, 반지름의 길이가 $5\text{ cm}$인 구의 겉넓이를 $S_2$라 할 때, $\dfrac{S_1}{S_2}$의 값은? [5점] (단, 원뿔대의 윗면의 반지름의 길이는 $4\text{ cm}$, 아랫면의 반지름의 길이는 $8\text{ cm}$, 모선의 길이는 $10\text{ cm}$이다.)

**보기** ① $\dfrac{1}{2}$  ② $1$  ③ $\dfrac{3}{2}$  ④ $\dfrac{5}{3}$  ⑤ $2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 cm)
2. 주어진 조건을 계산하여 정답 ⑤을(를) 도출한다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같은 원뿔대의 겉넓이를 $S_1$이라 하고, 반지름의 길이가 $5\text{ cm}$인 구의 겉넓이를 $S_2$라 할 때, $\dfrac{S_1}{S_2}$의 값은

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같은 원뿔대의 겉넓이를 $S_1$이라 하고, 반지름의 길이가 $5\text{ cm}$인 구의 겉넓이를 $S_2$라 할 때, $\dfrac{S_1}{S_2}$의 값은?」
**RPM** M1-RPM-104 [입체도형 > 입체도형의 겉넓이와 부피 > 구 > 구의 겉넓이] (원천과 같음)
- 이유: Q20번 문항은 M1-RPM-104에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_FRUSTUM_SURFACE (원천과 같음) (원천과 같음)
- 이유: Q20번 문항은 PT_M1_SOLID_FIGURE_MEASURE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 반지름←stem:「다음 그림과 같은 원뿔대의 겉넓이를 $S_1$이라 하고, 반지름의 길이가 $5\text{ cm}$인 구의 겉넓이를 $S_2$라 할 때, $\dfrac{S_1}{S_2}$의 값은?」
- goal: 구의←stem:「다음 그림과 같은 원뿔대의 겉넓이를 $S_1$이라 하고, 반지름의 길이가 $5\text{ cm}$인 구의 겉넓이를 $S_2$라 할 때, $\dfrac{S_1}{S_2}$의 값은?」
- method: 부채꼴(NAMED)←solution:「원뿔대의 옆면은 큰 부채꼴에서 작은 부채꼴을 잘라낸 모양이므로 옆넓이는 $$\begin{aligned} \text{원뿔대 옆넓이} &= \pi \times (8 + 4) \times 10 \ &= 120\pi\text{ cm}^2 \end{aligned}$$ 원뿔대의 두 밑면(윗면과 아랫면)의 넓이의 합은 $$\begin{aligned} \text{두 밑면의 넓이의 합} &= \pi \times 8^2 + \pi \times 4^2 \ &= 64\pi + 16\pi \ &= 80\pi\text{ cm}^2 \end{aligned}$$ 따라서 원뿔대의 겉넓이 $S_1$은 $$\begin{aligned} S_1 &= 120\pi + 80\pi \ &= 200\pi\text{ cm}^2 \end{aligned}$$ 반지름이 $5\text{ cm}$인 구의 겉넓이 $S_2$는 $$\begin{aligned} S_2 &= 4\pi \times 5^2 \ &= 100\pi\text{ cm}^2 \end{aligned}$$ 따라서 구하는 비율은 $$\begin{aligned} \dfrac{S_1}{S_2} &= \dfrac{200\pi}{100\pi} \ &= 2 \end{aligned}$$ 따라서 정답은 ⑤이다.」
- condition: (없음)

**how** Q20번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

원뿔대의 옆면은 큰 부채꼴에서 작은 부채꼴을 잘라낸 모양이므로 옆넓이는 $$\begin{aligned} \text{원뿔대 옆넓이} &= \pi \times (8 + 4) \times 10 \ &= 120\pi\text{ cm}^2 \end{aligned}$$ 원뿔대의 두 밑면(윗면과 아랫면)의 넓이의 합은 $$\begin{aligned} \text{두 밑면의 넓이의 합} &= \pi \times 8^2 + \pi \times 4^2 \ &= 64\pi + 16\pi \ &= 80\pi\text{ cm}^2 \end{aligned}$$ 따라서 원뿔대의 겉넓이 $S_1$은 $$\begin{aligned} S_1 &= 120\pi + 80\pi \ &= 200\pi\text{ cm}^2 \end{aligned}$$ 반지름이 $5\text{ cm}$인 구의 겉넓이 $S_2$는 $$\begin{aligned} S_2 &= 4\pi \times 5^2 \ &= 100\pi\text{ cm}^2 \end{aligned}$$ 따라서 구하는 비율은 $$\begin{aligned} \dfrac{S_1}{S_2} &= \dfrac{200\pi}{100\pi} \ &= 2 \end{aligned}$$ 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 4점


**발문**

[서술형 1] 아래 그림에서 삼각형의 꼭대기 꼭짓점의 외각의 크기가 $x$, 왼쪽 아래 꼭짓점의 외각의 크기가 $x + 10^\circ$이고, 오른쪽 아래 꼭짓점의 내각의 크기가 $64^\circ$일 때, $\angle x$의 크기를 구하시오. [4점] ($\angle x$의 크기를 구하는 과정: 2점, $\angle x$의 크기: 2점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $117^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다.
2. 왼쪽 아래 꼭짓점의 내각의 크기는 외각 $x + 10^\circ$의 보각이므로 $$\begin{aligned} 180^\circ - (x + 10^\circ) &= 170^\circ - x \end{aligned}$$ 꼭대기 외각 $\angle x$는 이웃하지 않는 두 내각 $(170^\circ - x)$와 $64^\circ$의 합과 같으므로 $$\begin{aligned} x &= (170^\circ - x) + 64^\circ \ x &= 234^\circ - x \ 2x &= 234^\circ \ x &= 117^\circ \end{aligned}$$ 따라서 $\angle x$의 크기는 $117^\circ$이다.
- 작성자 답: $117^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 그림에서 삼각형의 꼭대기 꼭짓점의 외각의 크기가 $x$, 왼쪽 아래 꼭짓점의 외각의 크기가 $x + 10^\circ$이고, 오른쪽 아래 꼭짓점의 내각의 크기가 $64^\circ$일 때, $\angle x$의 크기를 구하시오

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 1] 아래 그림에서 삼각형의 꼭대기 꼭짓점의 외각의 크기가 $x$, 왼쪽 아래 꼭짓점의 외각의 크기가 $x + 10^\circ$이고, 오른쪽 아래 꼭짓점의 내각의 크기가 $64^\circ$일 때, $\angle x$의 크기를 구하시오.」
**RPM** M1-RPM-084 [평면도형 > 다각형 > 삼각형·다각형의 각 > 각의 크기 계산] (원천과 같음)
- 이유: Q21번 문항은 M1-RPM-084에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 10)
**유형** PT=PT_M1_TRIANGLE_ANGLE_CONDITION / TPL=TPL_M1_TRIANGLE_ANGLE_CONDITION_EXTERIOR_SUM (원천과 같음) (원천과 같음)
- 이유: Q21번 문항은 PT_M1_TRIANGLE_ANGLE_CONDITION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 10)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 10)

**4칸**
- given: 삼각형←stem:「[서술형 1] 아래 그림에서 삼각형의 꼭대기 꼭짓점의 외각의 크기가 $x$, 왼쪽 아래 꼭짓점의 외각의 크기가 $x + 10^\circ$이고, 오른쪽 아래 꼭짓점의 내각의 크기가 $64^\circ$일 때, $\angle x$의 크기를 구하시오.」
- goal: 꼭짓점←stem:「[서술형 1] 아래 그림에서 삼각형의 꼭대기 꼭짓점의 외각의 크기가 $x$, 왼쪽 아래 꼭짓점의 외각의 크기가 $x + 10^\circ$이고, 오른쪽 아래 꼭짓점의 내각의 크기가 $64^\circ$일 때, $\angle x$의 크기를 구하시오.」
- method: 이웃(NAMED)←solution:「삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다.」
- condition: (없음)

**how** Q21번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 $117^\circ$을(를) 바르게 구하였다. (문항 토큰 10)

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같다. 왼쪽 아래 꼭짓점의 내각의 크기는 외각 $x + 10^\circ$의 보각이므로 $$\begin{aligned} 180^\circ - (x + 10^\circ) &= 170^\circ - x \end{aligned}$$ 꼭대기 외각 $\angle x$는 이웃하지 않는 두 내각 $(170^\circ - x)$와 $64^\circ$의 합과 같으므로 $$\begin{aligned} x &= (170^\circ - x) + 64^\circ \ x &= 234^\circ - x \ 2x &= 234^\circ \ x &= 117^\circ \end{aligned}$$ 따라서 $\angle x$의 크기는 $117^\circ$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 6점


**발문**

[서술형 2] 다음 그림과 같이 $\overline{AB} \parallel \overline{DC}$이고 $\overline{AB}=\overline{AD}=\overline{BC}=2\text{ cm}, \overline{DC}=4\text{ cm}$인 사다리꼴 $ADCB$에서 꼭짓점 $A, B, C$를 중심으로 하는 부채꼴의 넓이를 각각 $P, Q, R$이라고 할 때, $R - Q + P$의 값을 구하시오. [6점] (단, 부채꼴 $P$의 반지름은 $2\text{ cm}$, 중심각은 $60^\circ$, 부채꼴 $Q$의 반지름은 $4\text{ cm}$, 중심각은 $60^\circ$, 부채꼴 $R$의 반지름은 $6\text{ cm}$, 중심각은 $120^\circ$이다.) ($P$를 구하는 과정: 1점, $Q, R$을 구하는 과정: 3점, $R - Q + P$의 값: 2점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $10\pi\text{ cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 AB)
2. 주어진 조건을 계산하여 정답 $10\pi\text{ cm}^2$을(를) 도출한다.
- 작성자 답: $10\pi\text{ cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\overline{AB} \parallel \overline{DC}$이고 $\overline{AB}=\overline{AD}=\overline{BC}=2\text{ cm}, \overline{DC}=4\text{ cm}$인 사다리꼴 $ADCB$에서 꼭짓점 $A, B, C$를 중심으로 하는 부채꼴의 넓이를 각각 $P, Q, R$이라고 할 때, $R - Q + P$의 값을 구하시오

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 2] 다음 그림과 같이 $\overline{AB} \parallel \overline{DC}$이고 $\overline{AB}=\overline{AD}=\overline{BC}=2\text{ cm}, \overline{DC}=4\text{ cm}$인 사다리꼴 $ADCB$에서 꼭짓점 $A, B, C$를 중심으로 하는 부채꼴의 넓이를 각각 $P, Q, R$이라고 할 때, $R - Q + P$의 값을 구하시오.」
**RPM** M1-RPM-090 [평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 중심각을 이용한 넓이] (원천과 같음)
- 이유: Q22번 문항은 M1-RPM-090에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE (원천과 같음) (원천과 같음)
- 이유: Q22번 문항은 PT_CIRCLE_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 부채꼴←stem:「[서술형 2] 다음 그림과 같이 $\overline{AB} \parallel \overline{DC}$이고 $\overline{AB}=\overline{AD}=\overline{BC}=2\text{ cm}, \overline{DC}=4\text{ cm}$인 사다리꼴 $ADCB$에서 꼭짓점 $A, B, C$를 중심으로 하는 부채꼴의 넓이를 각각 $P, Q, R$이라고 할 때, $R - Q + P$의 값을 구하시오.」
- goal: 중심←stem:「[서술형 2] 다음 그림과 같이 $\overline{AB} \parallel \overline{DC}$이고 $\overline{AB}=\overline{AD}=\overline{BC}=2\text{ cm}, \overline{DC}=4\text{ cm}$인 사다리꼴 $ADCB$에서 꼭짓점 $A, B, C$를 중심으로 하는 부채꼴의 넓이를 각각 $P, Q, R$이라고 할 때, $R - Q + P$의 값을 구하시오.」
- method: 반지름(NAMED)←solution:「부채꼴 $P$의 반지름은 $2\text{ cm}$, 중심각은 $60^\circ$이므로 넓이는 $$\begin{aligned} P &= \pi \times 2^2 \times \dfrac{60^\circ}{360^\circ} \ &= 4\pi \times \dfrac{1}{6} \ &= \dfrac{2}{3}\pi\text{ cm}^2 \end{aligned}$$ 부채꼴 $Q$의 반지름은 $4\text{ cm}$, 중심각은 $60^\circ$이므로 넓이는 $$\begin{aligned} Q &= \pi \times 4^2 \times \dfrac{60^\circ}{360^\circ} \ &= 16\pi \times \dfrac{1}{6} \ &= \dfrac{8}{3}\pi\text{ cm}^2 \end{aligned}$$ 부채꼴 $R$의 반지름은 $6\text{ cm}$, 중심각은 $120^\circ$이므로 넓이는 $$\begin{aligned} R &= \pi \times 6^2 \times \dfrac{120^\circ}{360^\circ} \ &= 36\pi \times \dfrac{1}{3} \ &= 12\pi\text{ cm}^2 \end{aligned}$$ 따라서 $R - Q + P$의 값은 $$\begin{aligned} R - Q + P &= 12\pi - \dfrac{8}{3}\pi + \dfrac{2}{3}\pi \ &= 12\pi - \dfrac{6}{3}\pi \ &= 12\pi - 2\pi \ &= 10\pi\text{ cm}^2 \end{aligned}$$ 따라서 정답은 $10\pi\text{ cm}^2$이다.」
- condition: (없음)

**how** Q22번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 $10\pi\text{ cm}^2$을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

부채꼴 $P$의 반지름은 $2\text{ cm}$, 중심각은 $60^\circ$이므로 넓이는 $$\begin{aligned} P &= \pi \times 2^2 \times \dfrac{60^\circ}{360^\circ} \ &= 4\pi \times \dfrac{1}{6} \ &= \dfrac{2}{3}\pi\text{ cm}^2 \end{aligned}$$ 부채꼴 $Q$의 반지름은 $4\text{ cm}$, 중심각은 $60^\circ$이므로 넓이는 $$\begin{aligned} Q &= \pi \times 4^2 \times \dfrac{60^\circ}{360^\circ} \ &= 16\pi \times \dfrac{1}{6} \ &= \dfrac{8}{3}\pi\text{ cm}^2 \end{aligned}$$ 부채꼴 $R$의 반지름은 $6\text{ cm}$, 중심각은 $120^\circ$이므로 넓이는 $$\begin{aligned} R &= \pi \times 6^2 \times \dfrac{120^\circ}{360^\circ} \ &= 36\pi \times \dfrac{1}{3} \ &= 12\pi\text{ cm}^2 \end{aligned}$$ 따라서 $R - Q + P$의 값은 $$\begin{aligned} R - Q + P &= 12\pi - \dfrac{8}{3}\pi + \dfrac{2}{3}\pi \ &= 12\pi - \dfrac{6}{3}\pi \ &= 12\pi - 2\pi \ &= 10\pi\text{ cm}^2 \end{aligned}$$ 따라서 정답은 $10\pi\text{ cm}^2$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 6점


**발문**

[서술형 3] 다음 그림과 같이 밑면의 반지름의 길이가 $4\text{ cm}$인 원기둥 모양의 통에 쇠공 3개가 꼭 맞게 들어있고 남은 공간에 물이 가득 채워져 있다. 쇠공 3개만 모두 꺼내고 난 후 원기둥에 남아있는 물의 높이를 구하시오. (단, 통의 두께는 생각하지 않는다.) [6점] (물의 부피를 구하는 과정: 3점, 원기둥에 남아있는 물의 높이를 구하는 과정: 2점, 원기둥에 남아있는 물의 높이: 1점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $8\text{ cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 쇠공의 반지름은 원기둥 밑면의 반지름과 같으므로 $4\text{ cm}$이고, 쇠공 $1$개의 지름은 $8\text{ cm}$이다.
2. 쇠공 $3$개가 원기둥에 꼭 맞게 들어 있으므로 원기둥의 높이는 쇠공 $3$개의 지름의 합과 같다.
3. $$\begin{aligned} \text{원기둥의 높이} &= 3 \times 8 = 24\text{ cm} \end{aligned}$$ 원기둥 통의 전체 부피는 $$\begin{aligned} V_{\text{원기둥}} &= \pi \times 4^2 \times 24 \ &= 16\pi \times 24 \ &= 384\pi\text{ cm}^3 \end{aligned}$$ 쇠공 $3$개의 부피의 합은 $$\begin{aligned} V_{\text{쇠공}} &= 3 \times \left(\dfrac{4}{3}\pi \times 4^3\right) \ &= 4\pi \times 64 \ &= 256\pi\text{ cm}^3 \end{aligned}$$ 남은 공간에 채워진 물의 부피는 원기둥 부피에서 쇠공의 부피를 뺀 값이므로 $$\begin{aligned} V_{\text{물}} &= 384\pi - 256\pi \ &= 128\pi\text{ cm}^3 \end{aligned}$$ 쇠공을 모두 꺼낸 후 물은 밑넓이가 $\pi \times 4^2 = 16\pi\text{ cm}^2$인 원기둥을 채우므로, 남아있는 물의 높이를 $h$라 하면 $$\begin{aligned} 16\pi \times h &= 128\pi \ h &= \dfrac{128\pi}{16\pi} \ &= 8\text{ cm} \end{aligned}$$ 따라서 남아있는 물의 높이는 $8\text{ cm}$이다.
- 작성자 답: $8\text{ cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 밑면의 반지름의 길이가 $4\text{ cm}$인 원기둥 모양의 통에 쇠공 3개가 꼭 맞게 들어있고 남은 공간에 물이 가득 채워져 있다

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE_MEASURE(입체도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 3] 다음 그림과 같이 밑면의 반지름의 길이가 $4\text{ cm}$인 원기둥 모양의 통에 쇠공 3개가 꼭 맞게 들어있고 남은 공간에 물이 가득 채워져 있다.」
**RPM** M1-RPM-100 [입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 각기둥] **원천→판정: 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 원기둥 → 입체도형 > 입체도형의 겉넓이와 부피 > 기둥의 겉넓이와 부피 > 각기둥**
- 이유: Q23번 문항은 M1-RPM-100에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_M1_SOLID_FIGURE_MEASURE / TPL=TPL_M1_SOLID_FIGURE_VOLUME_CONSERVATION (원천과 같음) (원천과 같음)
- 이유: Q23번 문항은 PT_M1_SOLID_FIGURE_MEASURE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 공간←stem:「[서술형 3] 다음 그림과 같이 밑면의 반지름의 길이가 $4\text{ cm}$인 원기둥 모양의 통에 쇠공 3개가 꼭 맞게 들어있고 남은 공간에 물이 가득 채워져 있다.」
- goal: 반지름←stem:「[서술형 3] 다음 그림과 같이 밑면의 반지름의 길이가 $4\text{ cm}$인 원기둥 모양의 통에 쇠공 3개가 꼭 맞게 들어있고 남은 공간에 물이 가득 채워져 있다.」
- method: 지름(NAMED)←solution:「쇠공의 반지름은 원기둥 밑면의 반지름과 같으므로 $4\text{ cm}$이고, 쇠공 $1$개의 지름은 $8\text{ cm}$이다.」
- condition: (없음)

**how** Q23번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 $8\text{ cm}$을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

쇠공의 반지름은 원기둥 밑면의 반지름과 같으므로 $4\text{ cm}$이고, 쇠공 $1$개의 지름은 $8\text{ cm}$이다. 쇠공 $3$개가 원기둥에 꼭 맞게 들어 있으므로 원기둥의 높이는 쇠공 $3$개의 지름의 합과 같다. $$\begin{aligned} \text{원기둥의 높이} &= 3 \times 8 = 24\text{ cm} \end{aligned}$$ 원기둥 통의 전체 부피는 $$\begin{aligned} V_{\text{원기둥}} &= \pi \times 4^2 \times 24 \ &= 16\pi \times 24 \ &= 384\pi\text{ cm}^3 \end{aligned}$$ 쇠공 $3$개의 부피의 합은 $$\begin{aligned} V_{\text{쇠공}} &= 3 \times \left(\dfrac{4}{3}\pi \times 4^3\right) \ &= 4\pi \times 64 \ &= 256\pi\text{ cm}^3 \end{aligned}$$ 남은 공간에 채워진 물의 부피는 원기둥 부피에서 쇠공의 부피를 뺀 값이므로 $$\begin{aligned} V_{\text{물}} &= 384\pi - 256\pi \ &= 128\pi\text{ cm}^3 \end{aligned}$$ 쇠공을 모두 꺼낸 후 물은 밑넓이가 $\pi \times 4^2 = 16\pi\text{ cm}^2$인 원기둥을 채우므로, 남아있는 물의 높이를 $h$라 하면 $$\begin{aligned} 16\pi \times h &= 128\pi \ h &= \dfrac{128\pi}{16\pi} \ &= 8\text{ cm} \end{aligned}$$ 따라서 남아있는 물의 높이는 $8\text{ cm}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 4점


**발문**

[서술형 4] 다음은 어떤 학급 학생들의 수학 점수를 나타낸 상대도수의 분포표의 일부이다. 여학생 수가 25명, 남학생 수가 15명일 때, 이 학급 전체 학생에 대한 90점 이상 100점 미만인 계급의 상대도수를 구하시오. [4점] (여학생, 남학생 해당 계급의 도수를 구하는 과정: 각 1점, 전체 학생에 대한 해당 계급의 상대도수를 구하는 과정: 2점)


계급(점) | 여학생 상대도수 | 남학생 상대도수 (생 략) | | 90 ~ 100 | 0.12 | 0.20 합 계 | 1 | 1


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $0.15$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 문항의 조건과 식을 분석하여 단계를 전개한다. (문항 토큰 25)
2. 주어진 조건을 계산하여 정답 $0.15$을(를) 도출한다.
- 작성자 답: $0.15$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「[서술형 4] 다음은 어떤 학급 학생들의 수학 점수를 나타낸 상대도수의 분포표의 일부이다.」
**RPM** M1-RPM-110 [통계 > 자료의 정리와 해석 > 상대도수 > 상대도수 계산] (원천과 같음)
- 이유: Q24번 문항은 M1-RPM-110에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 25)
**유형** PT=PT_M1_DATA_CATEGORY_PERCENTAGE / TPL=TPL_M1_DATA_CATEGORY_PERCENTAGE_GROUP_COUNT_COMPARISON (원천과 같음) (원천과 같음)
- 이유: Q24번 문항은 PT_M1_DATA_CATEGORY_PERCENTAGE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 25)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q24번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 25)

**4칸**
- given: 어떤←stem:「[서술형 4] 다음은 어떤 학급 학생들의 수학 점수를 나타낸 상대도수의 분포표의 일부이다.」
- goal: 상대도수←stem:「[서술형 4] 다음은 어떤 학급 학생들의 수학 점수를 나타낸 상대도수의 분포표의 일부이다.」
- method: 계급(NAMED)←solution:「여학생 중 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 25 \times 0.12 &= 3\text{ (명)} \end{aligned}$$ 남학생 중 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 15 \times 0.20 &= 3\text{ (명)} \end{aligned}$$ 따라서 학급 전체에서 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 3 + 3 &= 6\text{ (명)} \end{aligned}$$ 학급 전체 학생 수는 $$\begin{aligned} 25 + 15 &= 40\text{ (명)} \end{aligned}$$ 그러므로 전체 학생에 대한 해당 계급의 상대도수는 $$\begin{aligned} \text{상대도수} &= \dfrac{6}{40} \ &= 0.15 \end{aligned}$$ 따라서 정답은 $0.15$이다.」
- condition: (없음)

**how** Q24번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 $0.15$을(를) 바르게 구하였다. (문항 토큰 25)

<details><summary>저장 해설 (판정 검토용)</summary>

여학생 중 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 25 \times 0.12 &= 3\text{ (명)} \end{aligned}$$ 남학생 중 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 15 \times 0.20 &= 3\text{ (명)} \end{aligned}$$ 따라서 학급 전체에서 $90\text{점 이상 }100\text{점 미만}$인 학생 수는 $$\begin{aligned} 3 + 3 &= 6\text{ (명)} \end{aligned}$$ 학급 전체 학생 수는 $$\begin{aligned} 25 + 15 &= 40\text{ (명)} \end{aligned}$$ 그러므로 전체 학생에 대한 해당 계급의 상대도수는 $$\begin{aligned} \text{상대도수} &= \dfrac{6}{40} \ &= 0.15 \end{aligned}$$ 따라서 정답은 $0.15$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
