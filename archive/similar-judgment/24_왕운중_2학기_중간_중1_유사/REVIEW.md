# 검수 묶음 — 24_왕운중_2학기_중간_중1_유사

- 단계: **JUDGED (검사 통과, 검수 대기)**
- 문항 23개 / 검사 PASS 23, FAIL 0, 보류 0
- 검수 기록: 입력된 verdict 0/23, HOLD 0, 풀이 답 비어 있음 23문항
- 그림 판단 분포: SELF_CONTAINED 11, NONE 12
- 난이도 분포: 1단계 3, 2단계 10, 3단계 8, 4단계 2
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q5**: 풀이 과정에 정답 값이 등장하지 않음
- **Q6**: 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 풀이 과정에 정답 값이 등장하지 않음
- **Q10**: 풀이 과정에 정답 값이 등장하지 않음
- **Q11**: 풀이 과정에 정답 값이 등장하지 않음
- **Q13**: 풀이 과정에 정답 값이 등장하지 않음
- **Q14**: 풀이 과정에 정답 값이 등장하지 않음
- **Q18**: 풀이 과정에 정답 값이 등장하지 않음
- **Q21**: 풀이 과정에 정답 값이 등장하지 않음
- **Q22**: 풀이 과정에 정답 값이 등장하지 않음

---
## Q1 — 객관식 3점


**발문**

다음 그림에서 두 직선 $l, m$이 한 점에서 만난다. 직선 $m$과 직선 $l$이 이루는 각이 $65^\circ$이고, 표시된 두 직선이 서로 수직일 때, $\angle x + \angle y$의 크기는? [3점]

**보기** ① $140^\circ$  ② $150^\circ$  ③ $160^\circ$  ④ $170^\circ$  ⑤ $180^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평각과 직각의 성질을 이용하여 $\angle x$와 $\angle y$를 구한다.
2. 직선 $l$ 위에서 $65^\circ$와 $\angle x$는 한 직선을 이루는 평각이므로 $\begin{aligned} \angle x &= 180^\circ - 65^\circ \ &= 115^\circ \end{aligned}$
3. 표시된 두 사선이 서로 수직($90^\circ$)이므로 $\begin{aligned} \angle y &= 90^\circ - 65^\circ \ &= 25^\circ \end{aligned}$
4. 따라서 구하는 두 각의 합은 $\begin{aligned} \angle x + \angle y &= 115^\circ + 25^\circ \ &= 140^\circ \end{aligned}$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 두 직선 $l, m$이 한 점에서 만난다

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 두 직선 $l, m$이 한 점에서 만난다.」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q1번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 65)
**유형** PT=PT_M1_INTERSECTING_ANGLE_RELATIONS / TPL=TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_TRANSFER (원천과 같음) (원천과 같음)
- 이유: Q1번 문항은 PT_M1_INTERSECTING_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 65)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q1번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 65)

**4칸**
- given: 직선←stem:「다음 그림에서 두 직선 $l, m$이 한 점에서 만난다.」
- goal: 수직←stem:「직선 $m$과 직선 $l$이 이루는 각이 $65^\circ$이고, 표시된 두 직선이 서로 수직일 때, $\angle x + \angle y$의 크기는?」
- method: 성질(NAMED)←solution:「평각과 직각의 성질을 이용하여 $\angle x$와 $\angle y$를 구한다.」
- condition: (없음)

**how** Q1번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 65)

<details><summary>저장 해설 (판정 검토용)</summary>

평각과 직각의 성질을 이용하여 $\angle x$와 $\angle y$를 구한다.


직선 $l$ 위에서 $65^\circ$와 $\angle x$는 한 직선을 이루는 평각이므로 $\begin{aligned} \angle x &= 180^\circ - 65^\circ \ &= 115^\circ \end{aligned}$


표시된 두 사선이 서로 수직($90^\circ$)이므로 $\begin{aligned} \angle y &= 90^\circ - 65^\circ \ &= 25^\circ \end{aligned}$


따라서 구하는 두 각의 합은 $\begin{aligned} \angle x + \angle y &= 115^\circ + 25^\circ \ &= 140^\circ \end{aligned}$


따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 4점


**발문**

다음 그림과 같이 반원 위에 놓여 있는 서로 다른 $6$개의 점 $A, B, C, D, E, F$ 중에서 두 점을 이어서 만들 수 있는 서로 다른 선분의 개수는? [4점]

**보기** ① $15$  ② $18$  ③ $20$  ④ $24$  ⑤ $30$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 선분은 서로 다른 두 점을 양 끝점으로 하여 유일하게 결정되며, 점들의 일직선 배치 여부와 무관하게 두 점을 선택하는 경우의 수와 같다.
2. $6$개의 점 중에서 서로 다른 두 점을 택하는 방법의 수는 $\begin{aligned} \dfrac{6 \times 5}{2} &= 15\text{개} \end{aligned}$
3. 따라서 만들 수 있는 서로 다른 선분의 개수는 $15$이다.
4. 따라서 정답은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 반원 위에 놓여 있는 서로 다른 $6$개의 점 $A, B, C, D, E, F$ 중에서 두 점을 이어서 만들 수 있는 서로 다른 선분의 개수는

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 반원 위에 놓여 있는 서로 다른 $6$개의 점 $A, B, C, D, E, F$ 중에서 두 점을 이어서 만들 수 있는 서로 다른 선분의 개수는?」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q2번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 15)
**유형** PT=PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT / TPL=TPL_M1_GENERATED_GEOMETRIC_OBJECT_COUNT_SEGMENT_COUNT (원천과 같음) (원천과 같음)
- 이유: Q2번 문항은 PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 15)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q2번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 15)

**4칸**
- given: 개수←stem:「다음 그림과 같이 반원 위에 놓여 있는 서로 다른 $6$개의 점 $A, B, C, D, E, F$ 중에서 두 점을 이어서 만들 수 있는 서로 다른 선분의 개수는?」
- goal: 선분←stem:「다음 그림과 같이 반원 위에 놓여 있는 서로 다른 $6$개의 점 $A, B, C, D, E, F$ 중에서 두 점을 이어서 만들 수 있는 서로 다른 선분의 개수는?」
- method: 경우의수(NAMED)←solution:「선분은 서로 다른 두 점을 양 끝점으로 하여 유일하게 결정되며, 점들의 일직선 배치 여부와 무관하게 두 점을 선택하는 경우의 수와 같다.」
- condition: (없음)

**how** Q2번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 15)

<details><summary>저장 해설 (판정 검토용)</summary>

선분은 서로 다른 두 점을 양 끝점으로 하여 유일하게 결정되며, 점들의 일직선 배치 여부와 무관하게 두 점을 선택하는 경우의 수와 같다.


$6$개의 점 중에서 서로 다른 두 점을 택하는 방법의 수는 $\begin{aligned} \dfrac{6 \times 5}{2} &= 15\text{개} \end{aligned}$


따라서 만들 수 있는 서로 다른 선분의 개수는 $15$이다.


따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

다음 그림과 같이 $\overline{AD} \parallel \overline{BC}$이고 넓이가 $30,\mathrm{cm}^2$인 사다리꼴 $ABCD$가 있다. $\overline{AD}=4,\mathrm{cm}$, $\overline{BC}=8,\mathrm{cm}$일 때, 꼭짓점 $D$와 변 $BC$ 사이의 거리는? [4점]

**보기** ① $3,\mathrm{cm}$  ② $4,\mathrm{cm}$  ③ $5,\mathrm{cm}$  ④ $6,\mathrm{cm}$  ⑤ $7,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점과 직선 사이의 거리는 그 점에서 직선에 내린 수선의 길이이므로, 점 $D$와 변 $BC$ 사이의 거리는 사다리꼴의 높이 $h,\mathrm{cm}$와 같다.
2. 사다리꼴의 넓이 공식에 의하여 $\begin{aligned} \dfrac{(\overline{AD} + \overline{BC}) \times h}{2} &= 30 \ \dfrac{(4 + 8) \times h}{2} &= 30 \ 6h &= 30 \ h &= 5,\mathrm{cm} \end{aligned}$
3. 따라서 점 $D$와 변 $BC$ 사이의 거리는 $5,\mathrm{cm}$이다.
4. 따라서 정답은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 $\overline{AD} \parallel \overline{BC}$이고 넓이가 $30,\mathrm{cm}^2$인 사다리꼴 $ABCD$가 있다

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림과 같이 $\overline{AD} \parallel \overline{BC}$이고 넓이가 $30,\mathrm{cm}^2$인 사다리꼴 $ABCD$가 있다.」
**RPM** M1-RPM-089 [평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 부채꼴의 호의 길이]
- 이유: Q3번 문항은 M1-RPM-089에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AD)
**유형** PT=PT_M1_TRAPEZOID_AREA / TPL=TPL_M1_TRAPEZOID_AREA_CORE (원천과 같음) (원천과 같음)
- 이유: Q3번 문항은 PT_M1_TRAPEZOID_AREA 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AD)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q3번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 AD)

**4칸**
- given: 사다리꼴←stem:「다음 그림과 같이 $\overline{AD} \parallel \overline{BC}$이고 넓이가 $30,\mathrm{cm}^2$인 사다리꼴 $ABCD$가 있다.」
- goal: 넓이←stem:「다음 그림과 같이 $\overline{AD} \parallel \overline{BC}$이고 넓이가 $30,\mathrm{cm}^2$인 사다리꼴 $ABCD$가 있다.」
- method: 직선(NAMED)←solution:「점과 직선 사이의 거리는 그 점에서 직선에 내린 수선의 길이이므로, 점 $D$와 변 $BC$ 사이의 거리는 사다리꼴의 높이 $h,\mathrm{cm}$와 같다.」
- condition: (없음)

**how** Q3번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 AD)

<details><summary>저장 해설 (판정 검토용)</summary>

점과 직선 사이의 거리는 그 점에서 직선에 내린 수선의 길이이므로, 점 $D$와 변 $BC$ 사이의 거리는 사다리꼴의 높이 $h,\mathrm{cm}$와 같다.


사다리꼴의 넓이 공식에 의하여 $\begin{aligned} \dfrac{(\overline{AD} + \overline{BC}) \times h}{2} &= 30 \ \dfrac{(4 + 8) \times h}{2} &= 30 \ 6h &= 30 \ h &= 5,\mathrm{cm} \end{aligned}$


따라서 점 $D$와 변 $BC$ 사이의 거리는 $5,\mathrm{cm}$이다.


따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 5점


**발문**

다음 그림에서 점 $C, D, E$는 각각 선분 $AB, CB, AD$의 중점이다. 다음 설명 중 옳지 않은 것은? [5점]

**보기** ① $\overline{AE} = \overline{ED}$  ② $\overline{CD} = \dfrac{1}{4}\overline{AB}$  ③ $\overline{EC} : \overline{CD} = 1 : 2$  ④ $\overline{AD} = \dfrac{3}{5}\overline{AB}$  ⑤ $\overline{AB} = 16,\mathrm{cm}$일 때, $\overline{EC} = 2,\mathrm{cm}$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 선분 $AB$의 전체 길이를 $L$이라 하고 각 부분 선분의 길이를 $L$로 나타낸다.
2. $\begin{aligned} \text{점 } C\text{는 } \overline{AB}\text{의 중점이므로: } & \overline{AC} = \overline{CB} = \dfrac{1}{2}L \ \text{점 } D\text{는 } \overline{CB}\text{의 중점이므로: } & \overline{CD} = \overline{DB} = \dfrac{1}{4}L \ \text{선분 } AD\text{의 길이는: } & \overline{AD} = \overline{AC} + \overline{CD} = \dfrac{1}{2}L + \dfrac{1}{4}L = \dfrac{3}{4}L \ \text{점 } E\text{는 } \overline{AD}\text{의 중점이므로: } & \overline{AE} = \overline{ED} = \dfrac{3}{8}L \ \text{선분 } EC\text{의 길이는: } & \overline{EC} = \overline{AC} - \overline{AE} = \dfrac{1}{2}L - \dfrac{3}{8}L = \dfrac{1}{8}L \end{aligned}$
3. 보기를 판정하면 다음과 같다.
4. $\begin{aligned} \text{① } & \overline{AE} = \overline{ED} = \dfrac{3}{8}L\text{ (참)} \ \text{② } & \overline{CD} = \dfrac{1}{4}L = \dfrac{1}{4}\overline{AB}\text{ (참)} \ \text{③ } & \overline{EC} : \overline{CD} = \dfrac{1}{8}L : \dfrac{1}{4}L = 1 : 2\text{ (참)} \ \text{④ } & \overline{AD} = \dfrac{3}{4}\overline{AB}\text{이므로 } \dfrac{3}{5}\overline{AB}\text{는 옳지 않다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 점 $C, D, E$는 각각 선분 $AB, CB, AD$의 중점이다

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 점 $C, D, E$는 각각 선분 $AB, CB, AD$의 중점이다.」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q4번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AB)
**유형** PT=PT_M1_SEGMENT_LENGTH_RELATIONS / TPL=TPL_M1_SEGMENT_LENGTH_RELATIONS_CHAINED_MIDPOINT (원천과 같음) (원천과 같음)
- 이유: Q4번 문항은 PT_M1_SEGMENT_LENGTH_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AB)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q4번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 AB)

**4칸**
- given: 선분←stem:「다음 그림에서 점 $C, D, E$는 각각 선분 $AB, CB, AD$의 중점이다.」
- goal: 중점←stem:「다음 그림에서 점 $C, D, E$는 각각 선분 $AB, CB, AD$의 중점이다.」
- method: 길이(NAMED)←solution:「선분 $AB$의 전체 길이를 $L$이라 하고 각 부분 선분의 길이를 $L$로 나타낸다.」
- condition: (없음)

**how** Q4번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 AB)

<details><summary>저장 해설 (판정 검토용)</summary>

선분 $AB$의 전체 길이를 $L$이라 하고 각 부분 선분의 길이를 $L$로 나타낸다.


$\begin{aligned} \text{점 } C\text{는 } \overline{AB}\text{의 중점이므로: } & \overline{AC} = \overline{CB} = \dfrac{1}{2}L \ \text{점 } D\text{는 } \overline{CB}\text{의 중점이므로: } & \overline{CD} = \overline{DB} = \dfrac{1}{4}L \ \text{선분 } AD\text{의 길이는: } & \overline{AD} = \overline{AC} + \overline{CD} = \dfrac{1}{2}L + \dfrac{1}{4}L = \dfrac{3}{4}L \ \text{점 } E\text{는 } \overline{AD}\text{의 중점이므로: } & \overline{AE} = \overline{ED} = \dfrac{3}{8}L \ \text{선분 } EC\text{의 길이는: } & \overline{EC} = \overline{AC} - \overline{AE} = \dfrac{1}{2}L - \dfrac{3}{8}L = \dfrac{1}{8}L \end{aligned}$


보기를 판정하면 다음과 같다. $\begin{aligned} \text{① } & \overline{AE} = \overline{ED} = \dfrac{3}{8}L\text{ (참)} \ \text{② } & \overline{CD} = \dfrac{1}{4}L = \dfrac{1}{4}\overline{AB}\text{ (참)} \ \text{③ } & \overline{EC} : \overline{CD} = \dfrac{1}{8}L : \dfrac{1}{4}L = 1 : 2\text{ (참)} \ \text{④ } & \overline{AD} = \dfrac{3}{4}\overline{AB}\text{이므로 } \dfrac{3}{5}\overline{AB}\text{는 옳지 않다. (거짓)} \ \text{⑤ } & \overline{AB} = 16,\mathrm{cm}\text{이면 } \overline{EC} = \dfrac{1}{8} \times 16 = 2,\mathrm{cm}\text{ (참)} \end{aligned}$


따라서 옳지 않은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 삼각기둥 $ABC-DEF$에서 모서리 $DF$와 한 점에서 만나는 모서리와 모서리 $AB$와 꼬인 위치에 있는 모서리를 순서대로 바르게 짝지은 것은? [3점]

**보기** ① 모서리 $DE$, 모서리 $EF$  ② 모서리 $AB$, 모서리 $CF$  ③ 모서리 $EF$, 모서리 $AD$  ④ 모서리 $CF$, 모서리 $DE$  ⑤ 모서리 $BE$, 모서리 $DE$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각기둥의 꼭짓점과 모서리의 연결 관계를 분석한다.
2. $\begin{aligned} \text{1.
3. } & \text{모서리 } DF\text{와 한 점에서 만나는 모서리: 꼭짓점 } D\text{ 또는 } F\text{를 공유하는 모서리이다.} \ & \text{점 } D\text{에서 만남: } \overline{AD}, \overline{DE} \ & \text{점 } F\text{에서 만남: } \overline{CF}, \overline{EF} \ & \text{따라서 } \overline{DE}\text{는 } \overline{DF}\text{와 한 점 } D\text{에서 만난다.} \ \text{2.
4. } & \text{모서리 } AB\text{와 꼬인 위치에 있는 모서리: 만나지도 않고 평행하지도 않은 모서리이다.} \ & \overline{AB}\text{와 만나는 모서리: } \overline{AC}, \overline{BC}, \overline{AD}, \overline{BE} \ & \overline{AB}\text{와 평행한 모서리: } \overline{DE} \ & \text{남은 모서리(꼬인 위치): } \overline{CF}, \overline{DF}, \overline{EF} \ & \text{따라서 } \overline{EF}\text{는 } \overline{AB}\text{와 꼬인 위치에 있다.} \end{aligned}$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE(입체도형) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 삼각기둥 $ABC-DEF$에서 모서리 $DF$와 한 점에서 만나는 모서리와 모서리 $AB$와 꼬인 위치에 있는 모서리를 순서대로 바르게 짝지은 것은?」
**RPM** M1-RPM-094 [입체도형 > 다면체와 회전체 > 다면체 > 면·모서리·꼭짓점]
- 이유: Q5번 문항은 M1-RPM-094에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS / TPL=TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_SKEW_EDGE_RELATION (원천과 같음) (원천과 같음)
- 이유: Q5번 문항은 PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q5번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 순서←stem:「다음 삼각기둥 $ABC-DEF$에서 모서리 $DF$와 한 점에서 만나는 모서리와 모서리 $AB$와 꼬인 위치에 있는 모서리를 순서대로 바르게 짝지은 것은?」
- goal: 모서리←stem:「다음 삼각기둥 $ABC-DEF$에서 모서리 $DF$와 한 점에서 만나는 모서리와 모서리 $AB$와 꼬인 위치에 있는 모서리를 순서대로 바르게 짝지은 것은?」
- method: 관계(NAMED)←solution:「삼각기둥의 꼭짓점과 모서리의 연결 관계를 분석한다.」
- condition: (없음)

**how** Q5번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

삼각기둥의 꼭짓점과 모서리의 연결 관계를 분석한다.


$\begin{aligned} \text{1. } & \text{모서리 } DF\text{와 한 점에서 만나는 모서리: 꼭짓점 } D\text{ 또는 } F\text{를 공유하는 모서리이다.} \ & \text{점 } D\text{에서 만남: } \overline{AD}, \overline{DE} \ & \text{점 } F\text{에서 만남: } \overline{CF}, \overline{EF} \ & \text{따라서 } \overline{DE}\text{는 } \overline{DF}\text{와 한 점 } D\text{에서 만난다.} \ \text{2. } & \text{모서리 } AB\text{와 꼬인 위치에 있는 모서리: 만나지도 않고 평행하지도 않은 모서리이다.} \ & \overline{AB}\text{와 만나는 모서리: } \overline{AC}, \overline{BC}, \overline{AD}, \overline{BE} \ & \overline{AB}\text{와 평행한 모서리: } \overline{DE} \ & \text{남은 모서리(꼬인 위치): } \overline{CF}, \overline{DF}, \overline{EF} \ & \text{따라서 } \overline{EF}\text{는 } \overline{AB}\text{와 꼬인 위치에 있다.} \end{aligned}$


따라서 바르게 짝지은 것은 모서리 $DE$, 모서리 $EF$이다.


따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

서로 다른 세 직선 $l, m, n$과 서로 다른 세 평면 $P, Q, R$에 대한 다음 보기의 설명 중 옳은 것만을 모두 고른 것은? [5점]


ㄱ. $l \parallel m$이고 $l \parallel n$이면 $m \parallel n$이다. ㄴ.$P \perp Q$이고 $Q \perp R$이면 $P \parallel R$이다. ㄷ.$P \parallel Q$이고 $l \perp P$이면 $l \perp Q$이다.

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄴ  ④ ㄱ, ㄷ  ⑤ ㄱ, ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 공간에서의 직선과 평면의 위치 관계를 직육면체 모델로 판정한다.
2. $\begin{aligned} \text{ㄱ.
3. } & \text{한 직선에 평행한 서로 다른 두 직선은 같은 방향을 가지므로 항상 서로 평행하다.
4. } (m \parallel n)\text{ (참)} \ \text{ㄴ.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-07(입체도형의 성질) / M1-07-SOLID_FIGURE(입체도형) (원천과 같음) (원천과 같음)
- 근거 인용: 「서로 다른 세 직선 $l, m, n$과 서로 다른 세 평면 $P, Q, R$에 대한 다음 보기의 설명 중 옳은 것만을 모두 고른 것은?」
**RPM** M1-RPM-094 [입체도형 > 다면체와 회전체 > 다면체 > 면·모서리·꼭짓점]
- 이유: Q6번 문항은 M1-RPM-094에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M1_SPATIAL_LINE_PLANE_RELATIONS / TPL=TPL_M1_SPATIAL_LINE_PLANE_RELATIONS_LINE_PLANE_CLAIM_AUDIT (원천과 같음) (원천과 같음)
- 이유: Q6번 문항은 PT_M1_SPATIAL_LINE_PLANE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q6번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 직선←stem:「서로 다른 세 직선 $l, m, n$과 서로 다른 세 평면 $P, Q, R$에 대한 다음 보기의 설명 중 옳은 것만을 모두 고른 것은?」
- goal: 평면←stem:「서로 다른 세 직선 $l, m, n$과 서로 다른 세 평면 $P, Q, R$에 대한 다음 보기의 설명 중 옳은 것만을 모두 고른 것은?」
- method: 판정(NAMED)←solution:「공간에서의 직선과 평면의 위치 관계를 직육면체 모델로 판정한다.」
- condition: (없음)

**how** Q6번 문항으로 M1-07 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

공간에서의 직선과 평면의 위치 관계를 직육면체 모델로 판정한다.


$\begin{aligned} \text{ㄱ. } & \text{한 직선에 평행한 서로 다른 두 직선은 같은 방향을 가지므로 항상 서로 평행하다. } (m \parallel n)\text{ (참)} \ \text{ㄴ. } & \text{한 평면에 수직인 두 평면은 평행할 수도 있지만 직육면체의 한 모퉁이처럼 서로 수직으로 만날 수도 있다. (거짓)} \ \text{ㄷ. } & \text{평행한 두 평면 중 한 평면에 수직인 직선은 다른 평면과도 반드시 수직으로 만난다. } (l \perp Q)\text{ (참)} \end{aligned}$


따라서 옳은 것은 ㄱ, ㄷ이다.


따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 5점


**발문**

선분 $PO$와 평행한 선분 $AB$가 그려진 직사각형 모양의 종이를 선분 $QR$를 접는 선으로 하여 다음 그림과 같이 접었다. $\angle PQR = 120^\circ$일 때, $\angle a$와 $\angle b$의 크기를 바르게 짝지은 것은? [5점]

**보기** ① $\angle a = 50^\circ, \angle b = 60^\circ$  ② $\angle a = 60^\circ, \angle b = 60^\circ$  ③ $\angle a = 60^\circ, \angle b = 50^\circ$  ④ $\angle a = 70^\circ, \angle b = 60^\circ$  ⑤ $\angle a = 60^\circ, \angle b = 70^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평행선의 동측내각 및 접힌 각의 대칭성을 이용한다.
2. $\overline{PO} \parallel \overline{AB}$이므로 접는 선 $QR$이 직선 $PO$와 이루는 각 $\angle PQR = 120^\circ$의 보각은 $\begin{aligned} \angle b &= 180^\circ - 120^\circ \ &= 60^\circ \end{aligned}$
3. 종이를 접으면 접는 선 $QR$을 대칭축으로 하여 대칭 이동하므로, 접힌 직선과 원래 직선이 이루는 각 $\angle a$는 $\begin{aligned} \angle a &= 180^\circ - 2 \times \angle b \ &= 180^\circ - 2 \times 60^\circ \ &= 180^\circ - 120^\circ \ &= 60^\circ \end{aligned}$
4. 따라서 $\angle a = 60^\circ, \angle b = 60^\circ$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림과 같이 접었다

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「선분 $PO$와 평행한 선분 $AB$가 그려진 직사각형 모양의 종이를 선분 $QR$를 접는 선으로 하여 다음 그림과 같이 접었다.」
**RPM** M1-RPM-066 [기본 도형 > 위치 관계 > 평면에서의 위치 관계 > 두 직선의 위치 관계]
- 이유: Q7번 문항은 M1-RPM-066에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 PO)
**유형** PT=PT_MOVE_FOLDING_REFLECTION / TPL=TPL_MOVE_FOLDING_REFLECTION_CORE (원천과 같음) (원천과 같음)
- 이유: Q7번 문항은 PT_MOVE_FOLDING_REFLECTION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 PO)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q7번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 PO)

**4칸**
- given: 선분←stem:「선분 $PO$와 평행한 선분 $AB$가 그려진 직사각형 모양의 종이를 선분 $QR$를 접는 선으로 하여 다음 그림과 같이 접었다.」
- goal: 사각형←stem:「선분 $PO$와 평행한 선분 $AB$가 그려진 직사각형 모양의 종이를 선분 $QR$를 접는 선으로 하여 다음 그림과 같이 접었다.」
- method: 대칭성(NAMED)←solution:「평행선의 동측내각 및 접힌 각의 대칭성을 이용한다.」
- condition: (없음)

**how** Q7번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 PO)

<details><summary>저장 해설 (판정 검토용)</summary>

평행선의 동측내각 및 접힌 각의 대칭성을 이용한다.


$\overline{PO} \parallel \overline{AB}$이므로 접는 선 $QR$이 직선 $PO$와 이루는 각 $\angle PQR = 120^\circ$의 보각은 $\begin{aligned} \angle b &= 180^\circ - 120^\circ \ &= 60^\circ \end{aligned}$


종이를 접으면 접는 선 $QR$을 대칭축으로 하여 대칭 이동하므로, 접힌 직선과 원래 직선이 이루는 각 $\angle a$는 $\begin{aligned} \angle a &= 180^\circ - 2 \times \angle b \ &= 180^\circ - 2 \times 60^\circ \ &= 180^\circ - 120^\circ \ &= 60^\circ \end{aligned}$


따라서 $\angle a = 60^\circ, \angle b = 60^\circ$이다.


따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

다음 그림 중 두 직선 $l, m$에 대하여 $l \parallel m$이 되는 것은? [4점]

**보기** ① 엇각의 크기가 각각 $65^\circ, 70^\circ$로 주어진 그림  ② 동위각의 크기가 각각 $115^\circ, 120^\circ$로 주어진 그림  ③ 같은 쪽에 있는 두 내각의 크기의 합이 $110^\circ + 70^\circ = 180^\circ$인 그림  ④ 맞꼭지각이 아닌 두 각의 합이 $175^\circ$인 그림  ⑤ 동위각의 크기가 각각 $80^\circ, 85^\circ$로 주어진 그림

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평행선이 되기 위한 필요충분조건은 동위각의 크기가 같거나, 엇각의 크기가 같거나, 같은 쪽에 있는 두 내각(동측내각)의 크기의 합이 $180^\circ$이어야 한다.
2. $\begin{aligned} \text{① } & \text{엇각의 크기가 } 65^\circ \ne 70^\circ\text{이므로 평행하지 않다.} \ \text{② } & \text{동위각의 크기가 } 115^\circ \ne 120^\circ\text{이므로 평행하지 않다.} \ \text{③ } & \text{같은 쪽 두 내각의 크기의 합이 } 110^\circ + 70^\circ = 180^\circ\text{이므로 두 직선은 평행하다.
3. (참)} \ \text{④ } & \text{동측내각의 합이 } 180^\circ\text{가 아니므로 평행하지 않다.} \ \text{⑤ } & \text{동위각의 크기가 } 80^\circ \ne 85^\circ\text{이므로 평행하지 않다.} \end{aligned}$
4. 따라서 $l \parallel m$인 것은 ③이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림 중 두 직선 $l, m$에 대하여 $l \parallel m$이 되는 것은

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림 중 두 직선 $l, m$에 대하여 $l \parallel m$이 되는 것은?」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q8번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 65)
**유형** PT=PT_M1_PARALLEL_ANGLE_TRANSFER / TPL=TPL_M1_PARALLEL_ANGLE_TRANSFER_CONVERSE_ANGLE_CHECK (원천과 같음) (원천과 같음)
- 이유: Q8번 문항은 PT_M1_PARALLEL_ANGLE_TRANSFER 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 65)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q8번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 65)

**4칸**
- given: 직선←stem:「다음 그림 중 두 직선 $l, m$에 대하여 $l \parallel m$이 되는 것은?」
- goal: 엇각←choices:「엇각의 크기가 각각 $65^\circ, 70^\circ$로 주어진 그림」
- method: 동위각(NAMED)←solution:「평행선이 되기 위한 필요충분조건은 동위각의 크기가 같거나, 엇각의 크기가 같거나, 같은 쪽에 있는 두 내각(동측내각)의 크기의 합이 $180^\circ$이어야 한다.」
- condition: (없음)

**how** Q8번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 65)

<details><summary>저장 해설 (판정 검토용)</summary>

평행선이 되기 위한 필요충분조건은 동위각의 크기가 같거나, 엇각의 크기가 같거나, 같은 쪽에 있는 두 내각(동측내각)의 크기의 합이 $180^\circ$이어야 한다.


$\begin{aligned} \text{① } & \text{엇각의 크기가 } 65^\circ \ne 70^\circ\text{이므로 평행하지 않다.} \ \text{② } & \text{동위각의 크기가 } 115^\circ \ne 120^\circ\text{이므로 평행하지 않다.} \ \text{③ } & \text{같은 쪽 두 내각의 크기의 합이 } 110^\circ + 70^\circ = 180^\circ\text{이므로 두 직선은 평행하다. (참)} \ \text{④ } & \text{동측내각의 합이 } 180^\circ\text{가 아니므로 평행하지 않다.} \ \text{⑤ } & \text{동위각의 크기가 } 80^\circ \ne 85^\circ\text{이므로 평행하지 않다.} \end{aligned}$


따라서 $l \parallel m$인 것은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 삼각형 $ABC$가 오직 하나로만 결정되는 조건은? [4점]

**보기** ① $\angle A = 50^\circ, \angle B = 60^\circ, \angle C = 70^\circ$  ② $\overline{AB} = 3,\mathrm{cm}, \overline{BC} = 4,\mathrm{cm}, \overline{CA} = 8,\mathrm{cm}$  ③ $\overline{AC}$의 대각의 크기가 $100^\circ$이고 $\angle A = 40^\circ$  ④ $\overline{AB} = 5,\mathrm{cm}, \overline{BC} = 6,\mathrm{cm}, \angle A = 45^\circ$  ⑤ $\angle B$의 대변의 길이가 $6,\mathrm{cm}$이고 $\angle A = 40^\circ, \angle C = 60^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형의 유일 결정 조건을 각 보기별로 검토한다.
2. $\begin{aligned} \text{① } & \text{세 각의 크기만 주어지면 모양은 같으나 크기가 다른 삼각형이 무수히 많이 작도된다.
3. (결정 안 됨)} \ \text{② } & 3 + 4 = 7 < 8\text{이므로 가장 긴 변이 나머지 두 변의 합보다 커서 삼각형 자체가 만들어지지 않는다.
4. (불가능)} \ \text{③ } & \overline{AC}\text{의 대각은 } \angle B\text{이므로 두 각만 주어진 상태이고 변의 길이가 없어 크기가 정해지지 않는다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 삼각형 $ABC$가 오직 하나로만 결정되는 조건은?」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q9번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_M1_CONGRUENCE_UNIQUENESS / TPL=TPL_M1_CONGRUENCE_UNIQUENESS_UNIQUE_TRIANGLE_DATA (원천과 같음) (원천과 같음)
- 이유: Q9번 문항은 PT_M1_CONGRUENCE_UNIQUENESS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q9번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 결정←stem:「다음 중 삼각형 $ABC$가 오직 하나로만 결정되는 조건은?」
- goal: 삼각형←stem:「다음 중 삼각형 $ABC$가 오직 하나로만 결정되는 조건은?」
- method: 유일(NAMED)←solution:「삼각형의 유일 결정 조건을 각 보기별로 검토한다.」
- condition: (없음)

**how** Q9번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 유일 결정 조건을 각 보기별로 검토한다.


$\begin{aligned} \text{① } & \text{세 각의 크기만 주어지면 모양은 같으나 크기가 다른 삼각형이 무수히 많이 작도된다. (결정 안 됨)} \ \text{② } & 3 + 4 = 7 < 8\text{이므로 가장 긴 변이 나머지 두 변의 합보다 커서 삼각형 자체가 만들어지지 않는다. (불가능)} \ \text{③ } & \overline{AC}\text{의 대각은 } \angle B\text{이므로 두 각만 주어진 상태이고 변의 길이가 없어 크기가 정해지지 않는다. (결정 안 됨)} \ \text{④ } & \overline{AB}, \overline{BC}\text{의 끼인각은 } \angle B\text{인데 끼인각이 아닌 } \angle A\text{가 주어졌으므로 하나로 결정되지 않는다. (결정 안 됨)} \ \text{⑤ } & \angle B\text{의 대변은 } \overline{AC} = 6,\mathrm{cm}\text{이고, 양 끝 각 } \angle A = 40^\circ, \angle C = 60^\circ\text{가 주어졌으므로 ASA 조건에 의해 오직 하나로 결정된다. (결정됨)} \end{aligned}$


따라서 오직 하나로 결정되는 조건은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

직선 $m$에 평행하면서 한 점 $P$를 지나는 직선을 작도하는 과정에서 사용되는 성질과 단계에 대한 설명 중 옳지 않은 것은? [4점]

**보기** ① 컴퍼스로 같은 반지름의 호를 그려 선분의 길이가 같도록 한다.  ② 엇각 또는 동위각의 크기가 같으면 두 직선이 평행하다는 성질을 이용한다.  ③ 작도 결과 점 $P$를 지나는 직선 $l$은 직선 $m$과 평행하게 된다.  ④ 작도 순서는 각의 크기를 잰 후 보조선을 긋는 순서로 진행된다.  ⑤ 눈금 없는 자는 두 점을 연결하여 직선을 완성할 때 사용된다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평행선 작도의 올바른 절차와 사용 원리를 검토한다.
2. $\begin{aligned} \text{1.
3. } & \text{평행선 작도는 점 } P\text{를 지나 직선 } m\text{과 만나는 보조선을 '먼저' 그어야 교점이 생기므로, 보조선을 긋기 전에 각의 크기를 먼저 잴 수 없다.} \ \text{2.
4. } & \text{따라서 작도 순서가 '각의 크기를 잰 후 보조선을 긋는다'고 설명한 ④는 명백히 옳지 않다.} \ \text{3.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「직선 $m$에 평행하면서 한 점 $P$를 지나는 직선을 작도하는 과정에서 사용되는 성질과 단계에 대한 설명 중 옳지 않은 것은?」
**RPM** M1-RPM-066 [기본 도형 > 위치 관계 > 평면에서의 위치 관계 > 두 직선의 위치 관계]
- 이유: Q10번 문항은 M1-RPM-066에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M1_PARALLEL_ANGLE_TRANSFER / TPL=TPL_M1_PARALLEL_ANGLE_TRANSFER_CONVERSE_ANGLE_CHECK (원천과 같음) (원천과 같음)
- 이유: Q10번 문항은 PT_M1_PARALLEL_ANGLE_TRANSFER 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q10번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 작도←stem:「직선 $m$에 평행하면서 한 점 $P$를 지나는 직선을 작도하는 과정에서 사용되는 성질과 단계에 대한 설명 중 옳지 않은 것은?」
- goal: 직선←stem:「직선 $m$에 평행하면서 한 점 $P$를 지나는 직선을 작도하는 과정에서 사용되는 성질과 단계에 대한 설명 중 옳지 않은 것은?」
- method: 평행(NAMED)←solution:「평행선 작도의 올바른 절차와 사용 원리를 검토한다.」
- condition: (없음)

**how** Q10번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

평행선 작도의 올바른 절차와 사용 원리를 검토한다.


$\begin{aligned} \text{1. } & \text{평행선 작도는 점 } P\text{를 지나 직선 } m\text{과 만나는 보조선을 '먼저' 그어야 교점이 생기므로, 보조선을 긋기 전에 각의 크기를 먼저 잴 수 없다.} \ \text{2. } & \text{따라서 작도 순서가 '각의 크기를 잰 후 보조선을 긋는다'고 설명한 ④는 명백히 옳지 않다.} \ \text{3. } & \text{나머지 보기는 컴퍼스의 길이 복사 기능, 엇각/동위각의 평행 판정 성질, 자의 용도를 바르게 기술하고 있다.} \end{aligned}$


따라서 옳지 않은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 중 작도에서 컴퍼스만을 사용하여 수행하는 역할로 가장 알맞은 것은? [3점]

**보기** ① 각도기를 대어 각의 크기를 잰다.  ② 주어진 선분의 길이를 재어서 다른 곳으로 옮긴다.  ③ 서로 다른 두 점을 곧게 연결하여 선분을 긋는다.  ④ 주어진 선분의 양쪽 끝으로 연장선을 긋는다.  ⑤ 선의 두께를 일정하게 맞춘다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 작도 도구의 정의와 역할을 판정한다.
2. 작도에서는 눈금 없는 자와 컴퍼스만을 사용한다.
3. $\begin{aligned} \text{눈금 없는 자의 역할: } & \text{두 점을 연결하는 선분을 긋거나 선분을 연장할 때 사용한다.} \ \text{컴퍼스의 역할: } & \text{원을 그리거나, 주어진 선분의 길이를 재어서 다른 선분이나 직선 위로 옮길 때 사용한다.} \end{aligned}$
4. 따라서 컴퍼스의 올바른 용도는 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 작도에서 컴퍼스만을 사용하여 수행하는 역할로 가장 알맞은 것은?」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q11번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 aligned)
**유형** PT=PT_M1_BASIC_CONSTRUCTION / TPL=TPL_M1_BASIC_CONSTRUCTION_TOOL_USAGE (원천과 같음) (원천과 같음)
- 이유: Q11번 문항은 PT_M1_BASIC_CONSTRUCTION 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 aligned)
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q11번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 1 수준의 문항이다. (문항 토큰 aligned)

**4칸**
- given: 작도←stem:「다음 중 작도에서 컴퍼스만을 사용하여 수행하는 역할로 가장 알맞은 것은?」
- goal: 선분←choices:「주어진 선분의 길이를 재어서 다른 곳으로 옮긴다.」
- method: 판정(NAMED)←solution:「작도 도구의 정의와 역할을 판정한다.」
- condition: (없음)

**how** Q11번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 aligned)

<details><summary>저장 해설 (판정 검토용)</summary>

작도 도구의 정의와 역할을 판정한다.


작도에서는 눈금 없는 자와 컴퍼스만을 사용한다. $\begin{aligned} \text{눈금 없는 자의 역할: } & \text{두 점을 연결하는 선분을 긋거나 선분을 연장할 때 사용한다.} \ \text{컴퍼스의 역할: } & \text{원을 그리거나, 주어진 선분의 길이를 재어서 다른 선분이나 직선 위로 옮길 때 사용한다.} \end{aligned}$


따라서 컴퍼스의 올바른 용도는 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 5점


**발문**

둘레의 길이가 $36,\mathrm{cm}$이고, 세 변의 길이가 각각 $a,\mathrm{cm}, a,\mathrm{cm}, b,\mathrm{cm}$인 이등변삼각형이 있다. $b$의 값이 두 자리 자연수일 때, 만들 수 있는 서로 다른 삼각형의 개수는? (단, $a, b$는 서로 다른 자연수이다.) [5점]

**보기** ① $1$개  ② $2$개  ③ $3$개  ④ $4$개  ⑤ $5$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 둘레의 길이와 삼각부등식 성질을 만족하는 자연수 순서쌍 $(a, b)$를 구한다.
2. 둘레의 길이가 $36,\mathrm{cm}$이므로 $\begin{aligned} 2a + b &= 36 \ 2a &= 36 - b \end{aligned}$
3. 삼각형이 성립하기 위해서는 가장 긴 변이 나머지 두 변의 합보다 작아야 하므로 $\begin{aligned} b &< a + a \ b &< 2a \ b &< 36 - b \ 2b &< 36 \ b &< 18 \end{aligned}$
4. $a = \dfrac{36 - b}{2}$가 자연수이어야 하므로 $b$는 짝수이어야 하고, $b$는 두 자리 자연수이므로 가능한 값은 $\begin{aligned} b \in {10, 12, 14, 16} \end{aligned}$
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「둘레의 길이가 $36,\mathrm{cm}$이고, 세 변의 길이가 각각 $a,\mathrm{cm}, a,\mathrm{cm}, b,\mathrm{cm}$인 이등변삼각형이 있다.」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q12번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 36)
**유형** PT=PT_M1_TRIANGLE_SIDE_FEASIBILITY / TPL=TPL_M1_TRIANGLE_SIDE_FEASIBILITY_INTEGER_PERIMETER_CASES (원천과 같음) (원천과 같음)
- 이유: Q12번 문항은 PT_M1_TRIANGLE_SIDE_FEASIBILITY 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 36)
**난이도** 4 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q12번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 4 수준의 문항이다. (문항 토큰 36)

**4칸**
- given: 삼각형←stem:「둘레의 길이가 $36,\mathrm{cm}$이고, 세 변의 길이가 각각 $a,\mathrm{cm}, a,\mathrm{cm}, b,\mathrm{cm}$인 이등변삼각형이 있다.」
- goal: 이등변삼각형←stem:「둘레의 길이가 $36,\mathrm{cm}$이고, 세 변의 길이가 각각 $a,\mathrm{cm}, a,\mathrm{cm}, b,\mathrm{cm}$인 이등변삼각형이 있다.」
- method: 자연수(NAMED)←solution:「둘레의 길이와 삼각부등식 성질을 만족하는 자연수 순서쌍 $(a, b)$를 구한다.」
- condition: (없음)

**how** Q12번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 36)

<details><summary>저장 해설 (판정 검토용)</summary>

둘레의 길이와 삼각부등식 성질을 만족하는 자연수 순서쌍 $(a, b)$를 구한다.


둘레의 길이가 $36,\mathrm{cm}$이므로 $\begin{aligned} 2a + b &= 36 \ 2a &= 36 - b \end{aligned}$


삼각형이 성립하기 위해서는 가장 긴 변이 나머지 두 변의 합보다 작아야 하므로 $\begin{aligned} b &< a + a \ b &< 2a \ b &< 36 - b \ 2b &< 36 \ b &< 18 \end{aligned}$


$a = \dfrac{36 - b}{2}$가 자연수이어야 하므로 $b$는 짝수이어야 하고, $b$는 두 자리 자연수이므로 가능한 값은 $\begin{aligned} b \in {10, 12, 14, 16} \end{aligned}$


각 경우의 $a$를 구하고 $a \ne b$ 조건을 검증한다. $\begin{aligned} b = 10 \implies a = 13 \quad (a \ne b, \text{가능}) \ b = 12 \implies a = 12 \quad (a = b\text{이므로 제외}) \ b = 14 \implies a = 11 \quad (a \ne b, \text{가능}) \ b = 16 \implies a = 10 \quad (a \ne b, \text{가능}) \end{aligned}$


따라서 가능한 삼각형의 개수는 $3$개이다.


따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

서로 다른 여섯 개의 삼각형 중에서 한 변의 길이가 $5,\mathrm{cm}$이고 그 양 끝 각이 각각 $55^\circ, 65^\circ$인 삼각형과 한 변의 길이가 $5,\mathrm{cm}$이고 두 각이 $55^\circ, 60^\circ$인 삼각형이 있다. 이 두 삼각형이 서로 합동임을 바르게 나타낸 것은? [4점]

**보기** ① 합동이며, ASA 합동이다.  ② 합동이며, SAS 합동이다.  ③ 합동이며, SSS 합동이다.  ④ 두 변의 길이가 같지 않으므로 합동이 아니다.  ⑤ 합동 여부를 알 수 없다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형의 세 내각의 크기의 합은 $180^\circ$임을 이용하여 숨은 각을 구한다.
2. $\begin{aligned} \text{첫 번째 삼각형의 세 각: } & 55^\circ, 65^\circ, 180^\circ - (55^\circ + 65^\circ) = 60^\circ \ \text{두 번째 삼각형의 세 각: } & 55^\circ, 60^\circ, 180^\circ - (55^\circ + 60^\circ) = 65^\circ \end{aligned}$
3. 따라서 두 번째 삼각형에서도 길이가 $5,\mathrm{cm}$인 변의 양 끝 각은 $55^\circ$와 $65^\circ$이다.
4. 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 $\begin{aligned} \text{두 삼각형은 서로 합동이며, 합동 조건은 ASA 합동이다.} \end{aligned}$
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「서로 다른 여섯 개의 삼각형 중에서 한 변의 길이가 $5,\mathrm{cm}$이고 그 양 끝 각이 각각 $55^\circ, 65^\circ$인 삼각형과 한 변의 길이가 $5,\mathrm{cm}$이고 두 각이 $55^\circ, 60^\circ$인 삼각형이 있다.」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q13번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 cm)
**유형** PT=PT_M1_CONGRUENCE_UNIQUENESS / TPL=TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION (원천과 같음) (원천과 같음)
- 이유: Q13번 문항은 PT_M1_CONGRUENCE_UNIQUENESS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 cm)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q13번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 cm)

**4칸**
- given: 삼각형←stem:「서로 다른 여섯 개의 삼각형 중에서 한 변의 길이가 $5,\mathrm{cm}$이고 그 양 끝 각이 각각 $55^\circ, 65^\circ$인 삼각형과 한 변의 길이가 $5,\mathrm{cm}$이고 두 각이 $55^\circ, 60^\circ$인 삼각형이 있다.」
- goal: 길이←stem:「서로 다른 여섯 개의 삼각형 중에서 한 변의 길이가 $5,\mathrm{cm}$이고 그 양 끝 각이 각각 $55^\circ, 65^\circ$인 삼각형과 한 변의 길이가 $5,\mathrm{cm}$이고 두 각이 $55^\circ, 60^\circ$인 삼각형이 있다.」
- method: 내각(NAMED)←solution:「삼각형의 세 내각의 크기의 합은 $180^\circ$임을 이용하여 숨은 각을 구한다.」
- condition: (없음)

**how** Q13번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 ①을(를) 바르게 구하였다. (문항 토큰 cm)

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 세 내각의 크기의 합은 $180^\circ$임을 이용하여 숨은 각을 구한다.


$\begin{aligned} \text{첫 번째 삼각형의 세 각: } & 55^\circ, 65^\circ, 180^\circ - (55^\circ + 65^\circ) = 60^\circ \ \text{두 번째 삼각형의 세 각: } & 55^\circ, 60^\circ, 180^\circ - (55^\circ + 60^\circ) = 65^\circ \end{aligned}$


따라서 두 번째 삼각형에서도 길이가 $5,\mathrm{cm}$인 변의 양 끝 각은 $55^\circ$와 $65^\circ$이다. 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 $\begin{aligned} \text{두 삼각형은 서로 합동이며, 합동 조건은 ASA 합동이다.} \end{aligned}$


따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

사각형 $ABCD$의 두 대각선 $AC$와 $BD$가 점 $O$에서 서로를 수직이등분하고 있다. $\overline{AO}=3,\mathrm{cm}, \overline{BO}=4,\mathrm{cm}$일 때, 다음 설명 중 옳지 않은 것은? [4점]

**보기** ① $\overline{AB} = 5,\mathrm{cm}$이다.  ② $\triangle BCD$의 넓이는 $12,\mathrm{cm}^2$이다.  ③ $\overline{AB} \parallel \overline{CD}$이다.  ④ 사각형 $ABCD$의 네 변의 길이는 모두 같다.  ⑤ $\triangle OBC \equiv \triangle OAD$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 대각선이 서로를 수직이등분하므로 사각형 $ABCD$는 마름모이다.
2. $\begin{aligned} \text{1.
3. } & \overline{AO} = \overline{OC} = 3,\mathrm{cm}, \overline{BO} = \overline{OD} = 4,\mathrm{cm}, \angle AOB = 90^\circ \ & \text{직각삼각형 } OAB\text{에서 } \overline{AB} = \sqrt{3^2 + 4^2} = 5,\mathrm{cm}\text{ (참)} \ \text{2.
4. } & \triangle BCD\text{의 밑변 } \overline{BD} = 8,\mathrm{cm}, \text{높이 } \overline{OC} = 3,\mathrm{cm}\text{이므로} \ & \text{넓이} = \dfrac{1}{2} \times 8 \times 3 = 12,\mathrm{cm}^2\text{ (참)} \ \text{3.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「사각형 $ABCD$의 두 대각선 $AC$와 $BD$가 점 $O$에서 서로를 수직이등분하고 있다.」
**RPM** M1-RPM-081 [평면도형 > 다각형 > 다각형의 내각과 외각 > 내각의 합]
- 이유: Q14번 문항은 M1-RPM-081에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABCD)
**유형** PT=PT_QUADRILATERAL_PROPERTIES / TPL=TPL_QUADRILATERAL_PROPERTIES (원천과 같음) (원천과 같음)
- 이유: Q14번 문항은 PT_QUADRILATERAL_PROPERTIES 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABCD)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q14번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABCD)

**4칸**
- given: 사각형←stem:「사각형 $ABCD$의 두 대각선 $AC$와 $BD$가 점 $O$에서 서로를 수직이등분하고 있다.」
- goal: 이등분←stem:「사각형 $ABCD$의 두 대각선 $AC$와 $BD$가 점 $O$에서 서로를 수직이등분하고 있다.」
- method: 마름모(NAMED)←solution:「두 대각선이 서로를 수직이등분하므로 사각형 $ABCD$는 마름모이다.」
- condition: (없음)

**how** Q14번 문항으로 M1-06 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 ABCD)

<details><summary>저장 해설 (판정 검토용)</summary>

두 대각선이 서로를 수직이등분하므로 사각형 $ABCD$는 마름모이다.


$\begin{aligned} \text{1. } & \overline{AO} = \overline{OC} = 3,\mathrm{cm}, \overline{BO} = \overline{OD} = 4,\mathrm{cm}, \angle AOB = 90^\circ \ & \text{직각삼각형 } OAB\text{에서 } \overline{AB} = \sqrt{3^2 + 4^2} = 5,\mathrm{cm}\text{ (참)} \ \text{2. } & \triangle BCD\text{의 밑변 } \overline{BD} = 8,\mathrm{cm}, \text{높이 } \overline{OC} = 3,\mathrm{cm}\text{이므로} \ & \text{넓이} = \dfrac{1}{2} \times 8 \times 3 = 12,\mathrm{cm}^2\text{ (참)} \ \text{3. } & \text{마름모는 평행사변형이므로 마주 보는 두 변은 평행하다. } (\overline{AB} \parallel \overline{CD})\text{ (참)} \ \text{4. } & \text{마름모의 네 변의 길이는 } 5,\mathrm{cm}\text{로 모두 같다. (참)} \ \text{5. } & \triangle OBC\text{와 합동인 삼각형은 대응점 순서대로 } \triangle ODA\text{이어야 한다. } (\triangle OBC \equiv \triangle ODA) \ & \triangle OBC \equiv \triangle OAD\text{로 표기하면 } \overline{OB} = \overline{OA}\text{가 되어 거짓이다. (거짓)} \end{aligned}$


따라서 옳지 않은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

다음은 어느 중학교 학생들의 턱걸이 횟수를 조사하여 나타낸 히스토그램이다. 턱걸이를 $5$번째로 많이 한 학생이 속하는 계급은? [4점]

**보기** ① $14$회 이상 $16$회 미만  ② $12$회 이상 $14$회 미만  ③ $10$회 이상 $12$회 미만  ④ $8$회 이상 $10$회 미만  ⑤ $6$회 이상 $8$회 미만

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 변량의 값이 큰 계급부터 도수를 차례대로 누적한다.
2. $\begin{aligned} 14\text{회 이상 } 16\text{회 미만: } & 1\text{명 (누적 } 1\text{명)} \ 12\text{회 이상 } 14\text{회 미만: } & 5\text{명 (누적 } 1 + 5 = 6\text{명)} \end{aligned}$
3. 따라서 $2$번째부터 $6$번째로 턱걸이를 많이 한 학생은 모두 $12\text{회 이상 } 14\text{회 미만}$ 계급에 속한다.
4. 그러므로 $5$번째로 많이 한 학생이 속하는 계급은 $12\text{회 이상 } 14\text{회 미만}$이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 히스토그램이다

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 어느 중학교 학생들의 턱걸이 횟수를 조사하여 나타낸 히스토그램이다.」
**RPM** M1-RPM-110 [통계 > 자료의 정리와 해석 > 상대도수 > 상대도수 계산]
- 이유: Q15번 문항은 M1-RPM-110에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 14)
**유형** PT=PT_M1_DATA_ORDER_AND_VALUE / TPL=TPL_M1_DATA_ORDER_AND_VALUE_CORE (원천과 같음) (원천과 같음)
- 이유: Q15번 문항은 PT_M1_DATA_ORDER_AND_VALUE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 14)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q15번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 14)

**4칸**
- given: 횟수←stem:「다음은 어느 중학교 학생들의 턱걸이 횟수를 조사하여 나타낸 히스토그램이다.」
- goal: 히스토그램←stem:「다음은 어느 중학교 학생들의 턱걸이 횟수를 조사하여 나타낸 히스토그램이다.」
- method: 계급(NAMED)←solution:「변량의 값이 큰 계급부터 도수를 차례대로 누적한다.」
- condition: (없음)

**how** Q15번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 14)

<details><summary>저장 해설 (판정 검토용)</summary>

변량의 값이 큰 계급부터 도수를 차례대로 누적한다.


$\begin{aligned} 14\text{회 이상 } 16\text{회 미만: } & 1\text{명 (누적 } 1\text{명)} \ 12\text{회 이상 } 14\text{회 미만: } & 5\text{명 (누적 } 1 + 5 = 6\text{명)} \end{aligned}$


따라서 $2$번째부터 $6$번째로 턱걸이를 많이 한 학생은 모두 $12\text{회 이상 } 14\text{회 미만}$ 계급에 속한다. 그러므로 $5$번째로 많이 한 학생이 속하는 계급은 $12\text{회 이상 } 14\text{회 미만}$이다.


따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 3점


**발문**

※ (16~17) 다음은 어느 학급 학생 $25$명의 신발 크기를 조사하여 나타낸 줄기와 잎 그림이다. 물음에 답하시오.


줄기: $20, 21, 22, 23, 24, 25$ ($20|0$은 $200\,\mathrm{mm}$)
$20 \mid 0 \quad 0 \quad 5 \quad 5$
$21 \mid 0 \quad 0 \quad 0 \quad 5 \quad 5 \quad 5$
$22 \mid 0 \quad 0 \quad 5 \quad 5 \quad 5$
$23 \mid 0 \quad 0 \quad 0 \quad 5 \quad 5$
$24 \mid 0 \quad 5 \quad 5 \quad 5$
$25 \mid 0$


신발 크기가 큰 쪽에서부터 $8$번째인 학생의 신발 크기는? [3점]

**보기** ① $220,\mathrm{mm}$  ② $225,\mathrm{mm}$  ③ $230,\mathrm{mm}$  ④ $235,\mathrm{mm}$  ⑤ $240,\mathrm{mm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 줄기와 잎 그림에서 가장 큰 값부터 역순으로 세어 $8$번째 변량을 찾는다.
2. $\begin{aligned} 250,\mathrm{mm}: & \quad 1\text{명 (누적 } 1\text{명)} \ 245,\mathrm{mm}: & \quad 3\text{명 (누적 } 4\text{명)} \ 240,\mathrm{mm}: & \quad 1\text{명 (누적 } 5\text{명)} \ 235,\mathrm{mm}: & \quad 2\text{명 (누적 } 7\text{명)} \ 230,\mathrm{mm}: & \quad 3\text{명 (누적 } 10\text{명)} \end{aligned}$
3. 상위 $7$명 다음의 $8$번째 학생은 $230,\mathrm{mm}$의 첫 번째 잎에 해당한다.
4. 따라서 신발 크기가 $8$번째로 큰 학생의 신발 크기는 $230,\mathrm{mm}$이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「※ (16~17) 다음은 어느 학급 학생 $25$명의 신발 크기를 조사하여 나타낸 줄기와 잎 그림이다.」
**RPM** M1-RPM-110 [통계 > 자료의 정리와 해석 > 상대도수 > 상대도수 계산]
- 이유: Q16번 문항은 M1-RPM-110에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 16)
**유형** PT=PT_M1_DATA_ORDER_AND_VALUE / TPL=TPL_M1_DATA_ORDER_AND_VALUE_CORE (원천과 같음) (원천과 같음)
- 이유: Q16번 문항은 PT_M1_DATA_ORDER_AND_VALUE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 16)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q16번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 16)

**4칸**
- given: 줄기와잎←stem:「※ (16~17) 다음은 어느 학급 학생 $25$명의 신발 크기를 조사하여 나타낸 줄기와 잎 그림이다.」
- goal: 줄기←stem:「※ (16~17) 다음은 어느 학급 학생 $25$명의 신발 크기를 조사하여 나타낸 줄기와 잎 그림이다.」
- method: 변량(NAMED)←solution:「줄기와 잎 그림에서 가장 큰 값부터 역순으로 세어 $8$번째 변량을 찾는다.」
- condition: (없음)

**how** Q16번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ③을(를) 바르게 구하였다. (문항 토큰 16)

<details><summary>저장 해설 (판정 검토용)</summary>

줄기와 잎 그림에서 가장 큰 값부터 역순으로 세어 $8$번째 변량을 찾는다.


$\begin{aligned} 250,\mathrm{mm}: & \quad 1\text{명 (누적 } 1\text{명)} \ 245,\mathrm{mm}: & \quad 3\text{명 (누적 } 4\text{명)} \ 240,\mathrm{mm}: & \quad 1\text{명 (누적 } 5\text{명)} \ 235,\mathrm{mm}: & \quad 2\text{명 (누적 } 7\text{명)} \ 230,\mathrm{mm}: & \quad 3\text{명 (누적 } 10\text{명)} \end{aligned}$


상위 $7$명 다음의 $8$번째 학생은 $230,\mathrm{mm}$의 첫 번째 잎에 해당한다. 따라서 신발 크기가 $8$번째로 큰 학생의 신발 크기는 $230,\mathrm{mm}$이다.


따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 3점


**발문**

위 16번의 자료에서 신발 크기가 $220,\mathrm{mm}$ 이상 $240,\mathrm{mm}$ 미만인 학생은 전체의 몇 $%$인가? [3점]

**보기** ① $35%$  ② $40%$  ③ $45%$  ④ $50%$  ⑤ $55%$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 주어진 구간에 속하는 학생 수를 세어 전체에 대한 백분율을 계산한다.
2. $220,\mathrm{mm}$ 이상 $240,\mathrm{mm}$ 미만에 속하는 잎의 개수를 세면 $\begin{aligned} \text{줄기 } 22: & \quad 0, 0, 5, 5, 5 \implies 5\text{명} \ \text{줄기 } 23: & \quad 0, 0, 0, 5, 5 \implies 5\text{명} \ \text{해당 구간의 총 학생 수} &= 5 + 5 = 10\text{명} \end{aligned}$
3. 전체 학생 수가 $25$명이므로 백분율을 구하면 $\begin{aligned} \dfrac{10}{25} \times 100 &= 40% \end{aligned}$
4. 따라서 정답은 ②이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「위 16번의 자료에서 신발 크기가 $220,\mathrm{mm}$ 이상 $240,\mathrm{mm}$ 미만인 학생은 전체의 몇 $%$인가?」
**RPM** M1-RPM-110 [통계 > 자료의 정리와 해석 > 상대도수 > 상대도수 계산]
- 이유: Q17번 문항은 M1-RPM-110에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 16)
**유형** PT=PT_M1_DATA_CATEGORY_PERCENTAGE / TPL=TPL_M1_DATA_CATEGORY_PERCENTAGE_CORE (원천과 같음) (원천과 같음)
- 이유: Q17번 문항은 PT_M1_DATA_CATEGORY_PERCENTAGE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 16)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q17번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 16)

**4칸**
- given: 자료←stem:「위 16번의 자료에서 신발 크기가 $220,\mathrm{mm}$ 이상 $240,\mathrm{mm}$ 미만인 학생은 전체의 몇 $%$인가?」
- goal: 백분율←solution:「주어진 구간에 속하는 학생 수를 세어 전체에 대한 백분율을 계산한다.」
- method: 구간(NAMED)←solution:「주어진 구간에 속하는 학생 수를 세어 전체에 대한 백분율을 계산한다.」
- condition: (없음)

**how** Q17번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ②을(를) 바르게 구하였다. (문항 토큰 16)

<details><summary>저장 해설 (판정 검토용)</summary>

주어진 구간에 속하는 학생 수를 세어 전체에 대한 백분율을 계산한다.


$220,\mathrm{mm}$ 이상 $240,\mathrm{mm}$ 미만에 속하는 잎의 개수를 세면 $\begin{aligned} \text{줄기 } 22: & \quad 0, 0, 5, 5, 5 \implies 5\text{명} \ \text{줄기 } 23: & \quad 0, 0, 0, 5, 5 \implies 5\text{명} \ \text{해당 구간의 총 학생 수} &= 5 + 5 = 10\text{명} \end{aligned}$


전체 학생 수가 $25$명이므로 백분율을 구하면 $\begin{aligned} \dfrac{10}{25} \times 100 &= 40% \end{aligned}$


따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 어느 학급 학생 $30$명의 수학 성적을 조사하여 나타낸 도수분포표이다. 다음 설명 중 옳지 않은 것은? [4점]


$\begin{array}{|c|c|} \hline \text{성적}(\text{점}) & \text{학생 수}(\text{명}) \ \hline 50^{\text{이상}} \sim 60^{\text{미만}} & 4 \ 60 \sim 70 & 5 \ 70 \sim 80 & 7 \ 80 \sim 90 & 8 \ 90 \sim 100 & 6 \ \hline \text{합계} & 30 \ \hline \end{array}$

**보기** ① 계급의 크기는 $10$점이다.  ② 계급의 개수는 $5$개이다.  ③ 성적이 $70$점 이상 $80$점 미만인 계급의 도수는 $7$명이다.  ④ 성적이 $70$점 미만인 학생은 전체의 $30%$이다.  ⑤ 성적이 $9$번째로 높은 학생이 속하는 계급의 도수는 $7$명이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 도수분포표의 각 항목과 보기를 검토한다.
2. $\begin{aligned} \text{① } & \text{계급의 크기는 구간의 너비이므로 } 60 - 50 = 10\text{점이다.
3. (참)} \ \text{② } & \text{계급은 } 5\text{개이다.
4. (참)} \ \text{③ } & 70 \sim 80\text{점 계급의 도수는 } 7\text{명이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 도수분포표이다

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 어느 학급 학생 $30$명의 수학 성적을 조사하여 나타낸 도수분포표이다.」
**RPM** M1-RPM-110 [통계 > 자료의 정리와 해석 > 상대도수 > 상대도수 계산]
- 이유: Q18번 문항은 M1-RPM-110에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 30)
**유형** PT=PT_M1_FREQUENCY_DISTRIBUTION_READING / TPL=TPL_M1_FREQUENCY_DISTRIBUTION_READING_CUMULATIVE_CUTOFF (원천과 같음) (원천과 같음)
- 이유: Q18번 문항은 PT_M1_FREQUENCY_DISTRIBUTION_READING 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 30)
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q18번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 2 수준의 문항이다. (문항 토큰 30)

**4칸**
- given: 도수분포표←stem:「다음은 어느 학급 학생 $30$명의 수학 성적을 조사하여 나타낸 도수분포표이다.」
- goal: 도수분포←stem:「다음은 어느 학급 학생 $30$명의 수학 성적을 조사하여 나타낸 도수분포표이다.」
- method: 분포(NAMED)←solution:「도수분포표의 각 항목과 보기를 검토한다.」
- condition: (없음)

**how** Q18번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 30)

<details><summary>저장 해설 (판정 검토용)</summary>

도수분포표의 각 항목과 보기를 검토한다.


$\begin{aligned} \text{① } & \text{계급의 크기는 구간의 너비이므로 } 60 - 50 = 10\text{점이다. (참)} \ \text{② } & \text{계급은 } 5\text{개이다. (참)} \ \text{③ } & 70 \sim 80\text{점 계급의 도수는 } 7\text{명이다. (참)} \ \text{④ } & 70\text{점 미만인 학생 수는 } 4 + 5 = 9\text{명이고, } \dfrac{9}{30} \times 100 = 30%\text{이다. (참)} \ \text{⑤ } & \text{성적이 가장 높은 계급 } (90 \sim 100\text{점})에 } 6\text{명이 속하므로, 상위 } 9\text{번째 학생은 그다음 계급인 } 80 \sim 90\text{점 계급에 속한다.} \ & \text{이 계급의 도수는 } 8\text{명이므로, } 7\text{명이라고 기술한 것은 옳지 않다. (거짓)} \end{aligned}$


따라서 옳지 않은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 5점


**발문**

다음은 학생 $40$명의 영어 성적을 조사하여 나타낸 도수분포다각형이다. 각 계급별 도수가 $50\sim60$점: $2$명, $60\sim70$점: $7$명, $70\sim80$점: $15$명, $80\sim90$점: $9$명, $90\sim100$점: $7$명일 때, 하위 $25%$에 속하는 학생들에게 보충 수업을 실시하려고 한다. 보충 수업 대상에서 확실히 제외되기 위해 적어도 몇 점 이상을 받아야 하는가? [5점]

**보기** ① $50$점  ② $60$점  ③ $70$점  ④ $80$점  ⑤ $90$점

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 하위 인원수를 누적하여 커트라인이 속하는 계급을 파악한다.
2. 전체 $40$명의 하위 $25%$에 해당하는 인원수는 $\begin{aligned} 40 \times 0.25 &= 10\text{명} \end{aligned}$
3. 낮은 점수부터 도수를 누적하면 $\begin{aligned} 50 \sim 60\text{점: } & 2\text{명} \ 60 \sim 70\text{점: } & 7\text{명} \implies 70\text{점 미만 누적 } 2 + 7 = 9\text{명} \ 70 \sim 80\text{점: } & 15\text{명} \implies 80\text{점 미만 누적 } 9 + 15 = 24\text{명} \end{aligned}$
4. 하위 $10$번째 학생은 $70 \sim 80$점 계급에 포함된다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 학생 $40$명의 영어 성적을 조사하여 나타낸 도수분포다각형이다.」
**RPM** M1-RPM-110 [통계 > 자료의 정리와 해석 > 상대도수 > 상대도수 계산]
- 이유: Q19번 문항은 M1-RPM-110에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 40)
**유형** PT=PT_M1_FREQUENCY_DISTRIBUTION_READING / TPL=TPL_M1_FREQUENCY_DISTRIBUTION_READING_CUMULATIVE_CUTOFF (원천과 같음) (원천과 같음)
- 이유: Q19번 문항은 PT_M1_FREQUENCY_DISTRIBUTION_READING 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 40)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q19번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 40)

**4칸**
- given: 다각형←stem:「다음은 학생 $40$명의 영어 성적을 조사하여 나타낸 도수분포다각형이다.」
- goal: 도수분포←stem:「다음은 학생 $40$명의 영어 성적을 조사하여 나타낸 도수분포다각형이다.」
- method: 계급(NAMED)←solution:「하위 인원수를 누적하여 커트라인이 속하는 계급을 파악한다.」
- condition: (없음)

**how** Q19번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ④을(를) 바르게 구하였다. (문항 토큰 40)

<details><summary>저장 해설 (판정 검토용)</summary>

하위 인원수를 누적하여 커트라인이 속하는 계급을 파악한다.


전체 $40$명의 하위 $25%$에 해당하는 인원수는 $\begin{aligned} 40 \times 0.25 &= 10\text{명} \end{aligned}$


낮은 점수부터 도수를 누적하면 $\begin{aligned} 50 \sim 60\text{점: } & 2\text{명} \ 60 \sim 70\text{점: } & 7\text{명} \implies 70\text{점 미만 누적 } 2 + 7 = 9\text{명} \ 70 \sim 80\text{점: } & 15\text{명} \implies 80\text{점 미만 누적 } 9 + 15 = 24\text{명} \end{aligned}$


하위 $10$번째 학생은 $70 \sim 80$점 계급에 포함된다. 따라서 $70$점 이상 $80$점 미만을 받으면 점수에 따라 하위 $10$명(보충 수업 대상)에 포함될 수 있으므로, 보충 수업 대상에서 확실히 벗어나기 위해서는 적어도 $80$점 이상을 받아야 한다.


따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 4점


**발문**

다음은 학생 $50$명이 지난 $1$년 동안 저축한 금액을 조사하여 나타낸 도수분포다각형인데, $4$만 원 이상 $5$만 원 미만인 부분이 찢어져서 보이지 않는다. 다음 설명 중 옳은 것은? [4점]

**보기** ① 계급의 개수는 $8$개이다.  ② $4$만 원 이상 $5$만 원 미만인 계급의 도수는 $9$명이다.  ③ $4$만 원 이상인 학생 수는 $31$명이다.  ④ $3$만 원 미만인 학생 수는 $3$만 원 이상인 학생 수의 $9$배이다.  ⑤ $3$만 원 미만인 학생은 전체의 $10\%$이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 그래프에서 확인할 수 있는 자료를 바탕으로 보기를 검증한다.
2. 전체 학생 수는 $50$명이다.
3. 그래프에서 $3$만 원 미만인 계급의 도수를 합산하면 $\begin{aligned} 1\text{만} \sim 2\text{만 원: } & 2\text{명} \ 2\text{만} \sim 3\text{만 원: } & 3\text{명} \ \text{합계: } & 2 + 3 = 5\text{명} \end{aligned}$
4. 전체 $50$명에 대한 백분율을 계산하면 $\begin{aligned} \dfrac{5}{50} \times 100 &= 10% \end{aligned}$
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_INTERPRETATION(자료의 해석) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 학생 $50$명이 지난 $1$년 동안 저축한 금액을 조사하여 나타낸 도수분포다각형인데, $4$만 원 이상 $5$만 원 미만인 부분이 찢어져서 보이지 않는다.」
**RPM** M1-RPM-110 [통계 > 자료의 정리와 해석 > 상대도수 > 상대도수 계산]
- 이유: Q20번 문항은 M1-RPM-110에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 50)
**유형** PT=PT_M1_FREQUENCY_DISTRIBUTION_READING / TPL=TPL_M1_FREQUENCY_DISTRIBUTION_READING_MISSING_FREQUENCY (원천과 같음) (원천과 같음)
- 이유: Q20번 문항은 PT_M1_FREQUENCY_DISTRIBUTION_READING 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 50)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q20번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 50)

**4칸**
- given: 다각형←stem:「다음은 학생 $50$명이 지난 $1$년 동안 저축한 금액을 조사하여 나타낸 도수분포다각형인데, $4$만 원 이상 $5$만 원 미만인 부분이 찢어져서 보이지 않는다.」
- goal: 도수분포←stem:「다음은 학생 $50$명이 지난 $1$년 동안 저축한 금액을 조사하여 나타낸 도수분포다각형인데, $4$만 원 이상 $5$만 원 미만인 부분이 찢어져서 보이지 않는다.」
- method: 그래프(NAMED)←solution:「그래프에서 확인할 수 있는 자료를 바탕으로 보기를 검증한다.」
- condition: (없음)

**how** Q20번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 ⑤을(를) 바르게 구하였다. (문항 토큰 50)

<details><summary>저장 해설 (판정 검토용)</summary>

그래프에서 확인할 수 있는 자료를 바탕으로 보기를 검증한다.


전체 학생 수는 $50$명이다. 그래프에서 $3$만 원 미만인 계급의 도수를 합산하면 $\begin{aligned} 1\text{만} \sim 2\text{만 원: } & 2\text{명} \ 2\text{만} \sim 3\text{만 원: } & 3\text{명} \ \text{합계: } & 2 + 3 = 5\text{명} \end{aligned}$


전체 $50$명에 대한 백분율을 계산하면 $\begin{aligned} \dfrac{5}{50} \times 100 &= 10% \end{aligned}$


따라서 옳은 설명은 “$3$만 원 미만인 학생은 전체의 $10%$이다.”이다.


따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음 그림에서 $\angle AOB$가 평각이고 $\angle AOC = 90^\circ$이다. $\angle COD = \dfrac{1}{3}\angle AOD$이고, $\angle DOE = \dfrac{4}{5}\angle EOB$일 때, $\angle COE$의 크기를 구하고 그 풀이 과정을 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $65^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\angle AOB = 180^\circ$이고 $\angle AOC = 90^\circ$이다.
2. $\angle COD = x^\circ$라 하면 $\angle AOD = 90^\circ + x$이다.
3. 문제의 조건 $\angle COD = \dfrac{1}{3}\angle AOD$에 의하여 $\begin{aligned} x &= \dfrac{1}{3}(90 + x) \ 3x &= 90 + x \ 2x &= 90 \ x &= 45^\circ \end{aligned}$
4. 따라서 $\angle COD = 45^\circ$이므로 $\angle DOB$의 크기는 $\begin{aligned} \angle DOB &= 180^\circ - \angle AOD \ &= 180^\circ - (90^\circ + 45^\circ) \ &= 45^\circ \end{aligned}$
- 작성자 답: $65^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 $\angle AOB$가 평각이고 $\angle AOC = 90^\circ$이다

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 $\angle AOB$가 평각이고 $\angle AOC = 90^\circ$이다.」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q21번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 AOB)
**유형** PT=PT_M1_INTERSECTING_ANGLE_RELATIONS / TPL=TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_RATIO (원천과 같음) (원천과 같음)
- 이유: Q21번 문항은 PT_M1_INTERSECTING_ANGLE_RELATIONS 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 AOB)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q21번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 AOB)

**4칸**
- given: 평각←stem:「다음 그림에서 $\angle AOB$가 평각이고 $\angle AOC = 90^\circ$이다.」
- goal: 조건←solution:「문제의 조건 $\angle COD = \dfrac{1}{3}\angle AOD$에 의하여 $\begin{aligned} x &= \dfrac{1}{3}(90 + x) \ 3x &= 90 + x \ 2x &= 90 \ x &= 45^\circ \end{aligned}$」
- method: 조건(NAMED)←solution:「문제의 조건 $\angle COD = \dfrac{1}{3}\angle AOD$에 의하여 $\begin{aligned} x &= \dfrac{1}{3}(90 + x) \ 3x &= 90 + x \ 2x &= 90 \ x &= 45^\circ \end{aligned}$」
- condition: (없음)

**how** Q21번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 $65^\circ$을(를) 바르게 구하였다. (문항 토큰 AOB)

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle AOB = 180^\circ$이고 $\angle AOC = 90^\circ$이다.


$\angle COD = x^\circ$라 하면 $\angle AOD = 90^\circ + x$이다. 문제의 조건 $\angle COD = \dfrac{1}{3}\angle AOD$에 의하여 $\begin{aligned} x &= \dfrac{1}{3}(90 + x) \ 3x &= 90 + x \ 2x &= 90 \ x &= 45^\circ \end{aligned}$


따라서 $\angle COD = 45^\circ$이므로 $\angle DOB$의 크기는 $\begin{aligned} \angle DOB &= 180^\circ - \angle AOD \ &= 180^\circ - (90^\circ + 45^\circ) \ &= 45^\circ \end{aligned}$


다음으로 $\angle DOE = y^\circ$라 하면 $\angle EOB = 45^\circ - y$이다. 조건 $\angle DOE = \dfrac{4}{5}\angle EOB$에 의하여 $\begin{aligned} y &= \dfrac{4}{5}(45 - y) \ 5y &= 180 - 4y \ 9y &= 180 \ y &= 20^\circ \end{aligned}$


따라서 $\angle DOE = 20^\circ$이다. 구하는 $\angle COE$의 크기는 $\begin{aligned} \angle COE &= \angle COD + \angle DOE \ &= 45^\circ + 20^\circ \ &= 65^\circ \end{aligned}$


답: $65^\circ$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 7점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

다음은 어느 학급 학생 $25$명이 지난 $1$년 동안 관람한 영화 편수를 조사하여 나타낸 도수분포표이다. $6$편 이상의 영화를 관람한 학생이 전체의 $32%$일 때, $A, B$의 값과 $4$편 미만의 영화를 관람한 학생은 전체의 몇 $%$인지 구하고, 그 과정을 서술하시오. [7점]


$\begin{array}{|c|c|} \hline \text{영화 편수}(\text{편}) & \text{학생 수}(\text{명}) \ \hline 0^{\text{이상}} \sim 2^{\text{미만}} & 4 \ 2 \sim 4 & A \ 4 \sim 6 & 3 \ 6 \sim 8 & B \ 8 \sim 10 & 2 \ \hline \text{합계} & 25 \ \hline \end{array}$


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $A=10, B=6, 56%$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 전체 $25$명의 $32%$에 해당하는 학생 수를 구한다.
2. $\begin{aligned} 25 \times 0.32 &= 8\text{명} \end{aligned}$
3. $6$편 이상 관람한 학생은 $6 \sim 8$편 계급과 $8 \sim 10$편 계급의 도수의 합이므로 $\begin{aligned} B + 2 &= 8 \ B &= 6 \end{aligned}$
4. 전체 도수의 합이 $25$명이므로 $\begin{aligned} 4 + A + 3 + B + 2 &= 25 \ 4 + A + 3 + 6 + 2 &= 25 \ A + 15 &= 25 \ A &= 10 \end{aligned}$
- 작성자 답: $A=10, B=6, 56%$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 도수분포표이다

**단원** M1-08(자료의 정리와 해석) / M1-08-DATA_ORGANIZATION(자료의 정리) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음은 어느 학급 학생 $25$명이 지난 $1$년 동안 관람한 영화 편수를 조사하여 나타낸 도수분포표이다.」
**RPM** M1-RPM-108 [통계 > 자료의 정리와 해석 > 도수분포 > 도수분포표]
- 이유: Q22번 문항은 M1-RPM-108에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 25)
**유형** PT=PT_M1_FREQUENCY_DISTRIBUTION_READING / TPL=TPL_M1_FREQUENCY_DISTRIBUTION_READING_FREQUENCY_AUDIT (원천과 같음) (원천과 같음)
- 이유: Q22번 문항은 PT_M1_FREQUENCY_DISTRIBUTION_READING 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 25)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q22번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 25)

**4칸**
- given: 도수분포표←stem:「다음은 어느 학급 학생 $25$명이 지난 $1$년 동안 관람한 영화 편수를 조사하여 나타낸 도수분포표이다.」
- goal: 도수분포←stem:「다음은 어느 학급 학생 $25$명이 지난 $1$년 동안 관람한 영화 편수를 조사하여 나타낸 도수분포표이다.」
- method: 계급(NAMED)←solution:「$6$편 이상 관람한 학생은 $6 \sim 8$편 계급과 $8 \sim 10$편 계급의 도수의 합이므로 $\begin{aligned} B + 2 &= 8 \ B &= 6 \end{aligned}$」
- condition: (없음)

**how** Q22번 문항으로 M1-08 단원의 기본 개념과 성질을 적용하여 $A=10, B=6, 56%$을(를) 바르게 구하였다. (문항 토큰 25)

<details><summary>저장 해설 (판정 검토용)</summary>

1. 전체 $25$명의 $32%$에 해당하는 학생 수를 구한다. $\begin{aligned} 25 \times 0.32 &= 8\text{명} \end{aligned}$


$6$편 이상 관람한 학생은 $6 \sim 8$편 계급과 $8 \sim 10$편 계급의 도수의 합이므로 $\begin{aligned} B + 2 &= 8 \ B &= 6 \end{aligned}$


2. 전체 도수의 합이 $25$명이므로 $\begin{aligned} 4 + A + 3 + B + 2 &= 25 \ 4 + A + 3 + 6 + 2 &= 25 \ A + 15 &= 25 \ A &= 10 \end{aligned}$


3. $4$편 미만의 영화를 관람한 학생 수는 $0 \sim 2$편 계급과 $2 \sim 4$편 계급의 합이므로 $\begin{aligned} 4 + A &= 4 + 10 \ &= 14\text{명} \end{aligned}$


따라서 $4$편 미만인 학생의 백분율은 $\begin{aligned} \dfrac{14}{25} \times 100 &= 56% \end{aligned}$


답: $A = 10, B = 6, 56%$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 7점


**발문**

다음 그림에서 직각삼각형 $ABC$와 직각삼각형 $BDE$에 대하여 $\overline{AC}=\overline{BE}$이고 $\overline{AB}=7,\mathrm{cm}, \overline{ED}=4,\mathrm{cm}$이다. $\angle BED=56^\circ, \angle BAC=34^\circ$일 때, 삼각형의 합동을 이용하여 선분 $CD$의 길이를 구하고 그 풀이 과정을 서술하시오. [7점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $3,\mathrm{cm}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. $\triangle ABC$와 $\triangle BDE$에서 각의 크기를 계산한다.
2. $\triangle ABC$에서 $\angle ABC = 90^\circ, \angle BAC = 34^\circ$이므로 $\begin{aligned} \angle ACB &= 180^\circ - 90^\circ - 34^\circ \ &= 56^\circ \end{aligned}$
3. $\triangle BDE$에서 $\angle BDE = 90^\circ, \angle BED = 56^\circ$이므로 $\begin{aligned} \angle DBE &= 180^\circ - 90^\circ - 56^\circ \ &= 34^\circ \end{aligned}$
4. 따라서 $\triangle ACB$와 $\triangle BED$에서 $\begin{aligned} \angle BAC &= \angle DBE = 34^\circ \ \angle ACB &= \angle BED = 56^\circ \ \overline{AC} &= \overline{BE} \quad (\text{주어진 조건}) \end{aligned}$ 이므로 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같다.
- 작성자 답: $3,\mathrm{cm}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** SELF_CONTAINED — 다음 그림에서 직각삼각형 $ABC$와 직각삼각형 $BDE$에 대하여 $\overline{AC}=\overline{BE}$이고 $\overline{AB}=7,\mathrm{cm}, \overline{ED}=4,\mathrm{cm}$이다

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 그림에서 직각삼각형 $ABC$와 직각삼각형 $BDE$에 대하여 $\overline{AC}=\overline{BE}$이고 $\overline{AB}=7,\mathrm{cm}, \overline{ED}=4,\mathrm{cm}$이다.」
**RPM** M1-RPM-060 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분]
- 이유: Q23번 문항은 M1-RPM-060에 배정된 유형으로 대표적인 풀이 원리를 다룬다. (문항 토큰 ABC)
**유형** PT=PT_RIGHT_TRIANGLE_CONGRUENCE / TPL=TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE (원천과 같음) (원천과 같음)
- 이유: Q23번 문항은 PT_RIGHT_TRIANGLE_CONGRUENCE 유형에 해당하며 관련 개념의 성질을 종합적으로 묻는다. (문항 토큰 ABC)
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: Q23번 문항은 핵심 성질을 한두 단계 적용하여 해결되는 난이도 3 수준의 문항이다. (문항 토큰 ABC)

**4칸**
- given: 삼각형←stem:「다음 그림에서 직각삼각형 $ABC$와 직각삼각형 $BDE$에 대하여 $\overline{AC}=\overline{BE}$이고 $\overline{AB}=7,\mathrm{cm}, \overline{ED}=4,\mathrm{cm}$이다.」
- goal: 직각삼각형←stem:「다음 그림에서 직각삼각형 $ABC$와 직각삼각형 $BDE$에 대하여 $\overline{AC}=\overline{BE}$이고 $\overline{AB}=7,\mathrm{cm}, \overline{ED}=4,\mathrm{cm}$이다.」
- method: 길이(NAMED)←solution:「따라서 $\triangle ACB$와 $\triangle BED$에서 $\begin{aligned} \angle BAC &= \angle DBE = 34^\circ \ \angle ACB &= \angle BED = 56^\circ \ \overline{AC} &= \overline{BE} \quad (\text{주어진 조건}) \end{aligned}$ 이므로 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같다.」
- condition: (없음)

**how** Q23번 문항으로 M1-05 단원의 기본 개념과 성질을 적용하여 $3,\mathrm{cm}$을(를) 바르게 구하였다. (문항 토큰 ABC)

<details><summary>저장 해설 (판정 검토용)</summary>

$\triangle ABC$와 $\triangle BDE$에서 각의 크기를 계산한다.


$\triangle ABC$에서 $\angle ABC = 90^\circ, \angle BAC = 34^\circ$이므로 $\begin{aligned} \angle ACB &= 180^\circ - 90^\circ - 34^\circ \ &= 56^\circ \end{aligned}$


$\triangle BDE$에서 $\angle BDE = 90^\circ, \angle BED = 56^\circ$이므로 $\begin{aligned} \angle DBE &= 180^\circ - 90^\circ - 56^\circ \ &= 34^\circ \end{aligned}$


따라서 $\triangle ACB$와 $\triangle BED$에서 $\begin{aligned} \angle BAC &= \angle DBE = 34^\circ \ \angle ACB &= \angle BED = 56^\circ \ \overline{AC} &= \overline{BE} \quad (\text{주어진 조건}) \end{aligned}$ 이므로 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같다. $\begin{aligned} \therefore \triangle ACB \equiv \triangle BED \quad (\text{ASA 합동}) \end{aligned}$


합동인 두 삼각형에서 대응변의 길이는 서로 같으므로 $\begin{aligned} \overline{BD} &= \overline{AB} = 7,\mathrm{cm} \ \overline{BC} &= \overline{DE} = 4,\mathrm{cm} \end{aligned}$


따라서 선분 $CD$의 길이는 $\begin{aligned} \overline{CD} &= \overline{BD} - \overline{BC} \ &= 7 - 4 \ &= 3,\mathrm{cm} \end{aligned}$


답: $3,\mathrm{cm}$

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
