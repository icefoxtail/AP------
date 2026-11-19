# 검수 묶음 — 26_신흥중_2학기_중간_중1_유사2

- 단계: **CONVERTED (판정 검사 미통과: FIGURE_MISSING 2)**
- 문항 24개 / 검사 PASS 22, FAIL 0, 보류 2
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 22, NEEDS_FIGURE 2
- 난이도 분포: 1단계 2, 2단계 17, 3단계 5
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q9**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류)
- **Q12**: 풀이 과정에 정답 값이 등장하지 않음
- **Q17**: 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 검사 코드: FIGURE_MISSING / NEEDS_FIGURE (image 없음 -> 시험지 보류) / 원천 값과 다른 칸 2개 (RPM, TPL)
- **Q22**: 원천 값과 다른 칸 2개 (PT, TPL)
- **Q23**: 원천 값과 다른 칸 2개 (RPM, TPL)

---
## Q1 — 객관식 3점


**발문**

직선 $l$ 위에 네 점 $A, B, C, D$가 이 순서대로 놓여 있다. 다음 중 반직선 $\overrightarrow{CA}$와 서로 같은 반직선은?

**보기** ① $\overrightarrow{AC}$  ② $\overrightarrow{CB}$  ③ $\overrightarrow{BA}$  ④ $\overrightarrow{CD}$  ⑤ $\overrightarrow{DA}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 반직선은 시작점과 뻗어나가는 방향이 모두 일치해야 서로 같은 반직선이다.
2. 반직선 \overrightarrow{CA}는 시작점이 C이고 점 A 방향(왼쪽)으로 뻗어나간다.
3. 직선 l 위의 점이 A, B, C, D 순서이므로 점 B는 점 A와 C 사이에 있다.
4. 따라서 시작점이 C이고 점 B 방향(왼쪽)으로 뻗어나가는 \overrightarrow{CB}가 \overrightarrow{CA}와 서로 같다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「직선 $l$ 위에 네 점 $A, B, C, D$가 이 순서대로 놓여 있다.」
**RPM** M1-RPM-173 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분] (원천과 같음)
- 이유: 직선 $l$ 위의 점 $A, B, C, D$에서 반직선 CA와 방향 및 시작점이 같은 반직선을 식별하는 직선·반직선·선분 유형이다.
**유형** PT=PT_M1_BASIC_GEOMETRY_JUDGMENT / TPL=TPL_M1_BASIC_GEOMETRY_JUDGMENT_SEGMENT_RAY_OBJECT_IDENTITY (원천과 같음) (원천과 같음)
- 이유: 일직선상에 순서대로 배열된 네 점 $A, B, C, D$로부터 반직선 CA의 시작점 C와 방향을 대조하여 동일한 반직선을 판정하는 기본도형 진술 판단 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 반직선의 정의인 시작점과 방향의 일치 조건만을 점 A, B, C, D의 배치와 반직선 CA에서 직관적으로 확인하므로 난이도 1이다.

**4칸**
- given: 직선←stem:「직선 $l$ 위에 네 점 $A, B, C, D$가 이 순서대로 놓여 있다.」
- goal: 반직선←stem:「다음 중 반직선 $\overrightarrow{CA}$와 서로 같은 반직선은?」
- method: 반직선(IMPLIED)←solution:「반직선은 시작점과 뻗어나가는 방향이 모두 같아야 서로 같은 반직선이다.」 — 반직선의 시작점과 방향 동일성 판별
- condition: (없음)

**how** 직선 $l$ 위의 점 순서 A, B, C, D를 파악하고 반직선 CA와 시작점 C 및 왼쪽 방향이 일치하는 반직선 CB를 골라 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

반직선은 시작점과 뻗어나가는 방향이 모두 같아야 서로 같은 반직선이다. 직선 $l$ 위의 점의 배열 순서는 $A - B - C - D$이다. $$\begin{aligned} \text{반직선 } \overrightarrow{CA} &: \text{시작점 } C, \text{ 방향: 왼쪽}(A \text{ 방향}) \ \text{반직선 } \overrightarrow{CB} &: \text{시작점 } C, \text{ 방향: 왼쪽}(B \text{ 방향}) \end{aligned}$$ 점 $B$는 점 $A$와 $C$ 사이에 있으므로 $\overrightarrow{CB}$는 시작점이 $C$이고 왼쪽 방향으로 뻗어나간다. 따라서 시작점과 방향이 모두 일치하므로 $\overrightarrow{CA} = \overrightarrow{CB}$이다. ① $\overrightarrow{AC}$는 시작점이 $A$이므로 다르다. ③ $\overrightarrow{BA}$는 시작점이 $B$이므로 다르다. ④ $\overrightarrow{CD}$는 시작점은 같으나 오른쪽 방향이므로 다르다. ⑤ $\overrightarrow{DA}$는 시작점이 $D$이므로 다르다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점


**발문**

두 직선 $l$과 $m$이 서로 평행하다. 횡단선들이 이루는 각에서 $\angle x$는 위쪽 직선 $l$과의 교각 $70^\circ$와 $40^\circ$의 합의 동위각이고, $\angle y$는 다른 횡단선에서 $40^\circ$의 이웃각이다. 이때 $\angle y - \angle x$의 크기는?

**보기** ① $15^\circ$  ② $20^\circ$  ③ $25^\circ$  ④ $30^\circ$  ⑤ $35^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 두 직선 l과 m이 평행하므로 동위각의 크기는 서로 같다.
2. \angle x는 위쪽 직선 l과의 교각 70^\circ와 40^\circ의 합의 동위각이므로 \angle x = 70^\circ + 40^\circ = 110^\circ이다.
3. \angle y는 다른 횡단선에서 40^\circ의 이웃각이므로 \angle y = 180^\circ - 40^\circ = 140^\circ이다.
4. 따라서 \angle y - \angle x = 140^\circ - 110^\circ = 30^\circ이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 직선 $l$과 $m$이 서로 평행하다.」
**RPM** M1-RPM-177 [기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각] (원천과 같음)
- 이유: 평행한 두 직선 l, m에서 동위각 성질과 평각의 이웃각을 이용해 각 70도, 40도로부터 각 x, y를 구하는 110, 140 동위각·엇각 유형이다.
**유형** PT=PT_M1_PARALLEL_ANGLE_POSITION / TPL=TPL_M1_PARALLEL_ANGLE_POSITION_POSITIONAL_ANGLE_SUM (원천과 같음) (원천과 같음)
- 이유: 평행선에서 동위각의 성질을 적용하여 70도와 40도의 합인 110도와 보각 140도를 계산해 차이 30도를 구하는 동위각·엇각 위치 판정 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 동위각의 합 110도와 평각에서의 보각 140도 계산 두 단계를 거쳐 차이 30도를 계산하므로 난이도 2이다.

**4칸**
- given: 평행←stem:「두 직선 $l$과 $m$이 서로 평행하다.」
- goal: 각←stem:「이때 $\angle y - \angle x$의 크기는?」
- method: 동위각(IMPLIED)←solution:「두 직선 $l$과 $m$이 평행하므로 동위각의 크기는 서로 같다.」 — 평행선에서의 동위각 크기 일치 성질 활용
- condition: (없음)

**how** 평행선 조건에서 각 x = 70 + 40 = 110도와 각 y = 180 - 40 = 140도를 구한 후 차이 30도를 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 직선 $l$과 $m$이 평행하므로 동위각의 크기는 서로 같다. $$\begin{aligned} \angle x &= 70^\circ + 40^\circ = 110^\circ \ \angle y &= 180^\circ - 40^\circ = 140^\circ \end{aligned}$$ 이다. 따라서 두 각의 차를 구하면 $$\begin{aligned} \angle y - \angle x &= 140^\circ - 110^\circ \ &= 30^\circ \end{aligned}$$ 이므로 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 4점


**발문**

다음 보기 중에서 $\overline{AD} \parallel \overline{BC}$이고 $\angle B = 90^\circ$인 직각사다리꼴 $ABCD$에 대한 설명으로 옳은 것만을 있는 대로 고른 것은?

ㄱ. $\overleftrightarrow{AD} \parallel \overleftrightarrow{BC}$ ㄴ. 점 $A$에서 $\overleftrightarrow{BC}$에 내린 수선의 발은 점 $B$이다. ㄷ. $\overleftrightarrow{AB}$와 $\overleftrightarrow{CD}$는 꼬인 위치에 있다. ㄹ. $\overleftrightarrow{AC} \perp \overleftrightarrow{BD}$

**보기** ① ㄱ, ㄴ  ② ㄱ, ㄷ  ③ ㄴ, ㄷ  ④ ㄱ, ㄴ, ㄹ  ⑤ ㄴ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 사다리꼴 ABCD에서 AD와 BC가 평행하므로 두 직선은 평행하다. (ㄱ 참)
2. 각 B = 90도이므로 선분 AB와 BC는 수직이다. 따라서 점 A에서 직선 BC에 내린 수선의 발은 점 B이다. (ㄴ 참)
3. 사다리꼴 ABCD는 한 평면 위의 도형이므로 직선 AB와 CD는 평행하지 않아 한 점에서 만나며, 꼬인 위치에 있지 않다. (ㄷ 거짓)
4. 직각사다리꼴의 대각선 AC와 BD는 일반적으로 수직이 아니다. (ㄹ 거짓)
5. 따라서 옳은 것은 ㄱ, ㄴ이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「사다리꼴 $ABCD$의 변과 직선의 위치 관계를 검토한다.」
**RPM** M1-RPM-179 [기본 도형 > 위치 관계 > 평면에서의 위치 관계 > 두 직선의 위치 관계] (원천과 같음)
- 이유: 평면의 직각사다리꼴 ABCD에서 두 직선 AD, BC의 평행, 수선의 발, 꼬인 위치 여부를 판별하는 두 직선의 위치 관계 유형이다.
**유형** PT=PT_M1_RIGHT_TRAPEZOID_PROPERTY_CHECK / TPL=TPL_M1_RIGHT_TRAPEZOID_PROPERTY_CHECK_CORE (원천과 같음) **원천→판정: TPL_M1_POINT_TO_LINE_PERPENDICULAR_DISTANCE_CORE → TPL_M1_RIGHT_TRAPEZOID_PROPERTY_CHECK_CORE**
- 이유: 직각사다리꼴 ABCD에서 AD와 BC의 평행 및 90도 조건을 바탕으로 보기의 직선 관계와 수선의 발 진술을 확인하는 직각사다리꼴 성질 판단 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평면도형 사다리꼴 ABCD의 성질과 평행, 90도 수직, 꼬인 위치의 정의를 조합하여 4개의 진술을 검토하므로 난이도 2이다.

**4칸**
- given: 사다리꼴←stem:「$\overline{AD} \parallel \overline{BC}$이고 $\angle B = 90^\circ$인 직각사다리꼴 $ABCD$」
- goal: 위치관계←solution:「사다리꼴 $ABCD$의 변과 직선의 위치 관계를 검토한다.」
- method: 수선의발(IMPLIED)←stem:「점 $A$에서 $\overleftrightarrow{BC}$에 내린 수선의 발은 점 $B$이다.」 — 직각 조건과 수선의 발 정의 대조
- condition: (없음)

**how** 직각사다리꼴 ABCD에서 AD와 BC의 평행선과 각 B = 90도로부터 수선의 발 B를 확인하고 평면 내 직선 AB, CD는 꼬인 위치가 아님을 이용해 ㄱ, ㄴ을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

사다리꼴 $ABCD$의 변과 직선의 위치 관계를 검토한다. $$\begin{aligned} \text{ㄱ: } \overleftrightarrow{AD} \parallel \overleftrightarrow{BC} &\implies \text{사다리꼴 밑변의 평행 정의에 의해 참} \ \text{ㄴ: } \angle B = 90^\circ &\implies \overline{AB} \perp \overline{BC}\text{이므로 수선의 발은 점 } B \text{ (참)} \ \text{ㄷ: } \overleftrightarrow{AB}, \overleftrightarrow{CD} &\implies \text{한 평면 위에서 만나므로 꼬인 위치 아님 (거짓)} \ \text{ㄹ: } \overleftrightarrow{AC}, \overleftrightarrow{BD} &\implies \text{직교 조건 없음 (거짓)} \end{aligned}$$ 따라서 옳은 것은 ㄱ, ㄴ이며 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점


**발문**

직선 $l$ 위에 있지 않은 한 점 $P$를 지나고 직선 $l$과 평행한 직선을 작도하는 과정에 대한 설명 중 옳은 것만을 보기에서 모두 고른 것은?

ㄱ. 동위각의 크기가 같으면 두 직선이 평행하다는 성질을 이용한다. ㄴ. 점 $Q$를 중심으로 하는 원호와 점 $P$를 중심으로 하는 원호는 반지름의 길이가 같다. ㄷ. 눈금 없는 자만 사용하여 선분의 길이를 그대로 복사한다.

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄴ  ④ ㄱ, ㄷ  ⑤ ㄴ, ㄷ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평행선의 작도는 점 P를 지나는 직선을 그은 뒤 직선 l과의 동위각을 점 P에 복사하여 작도한다. (ㄱ 참, aligned 구조)
2. 크기가 같은 각의 작도 시 기준점 Q와 목표점 P에서 같은 반지름의 원호를 컴퍼스로 그린다. (ㄴ 참, aligned 단계)
3. 선분의 길이를 그대로 복사하는 도구는 눈금 없는 자가 아니라 컴퍼스이다. (ㄷ 거짓)
4. 따라서 옳은 것은 ㄱ, ㄴ이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「직선 $l$ 위에 있지 않은 한 점 $P$를 지나고 직선 $l$과 평행한 직선을 작도하는 과정」
**RPM** M1-RPM-185 [기본 도형 > 작도와 합동 > 기본 작도 > 선분·각의 이동] (원천과 같음)
- 이유: 점 P를 지나 직선 l에 평행한 직선을 동위각 복사와 컴퍼스를 이용해 aligned 단계로 작도하는 기본 작도 유형이다.
**유형** PT=PT_M1_BASIC_CONSTRUCTION / TPL=TPL_M1_BASIC_CONSTRUCTION_TOOL_USAGE (원천과 같음) (원천과 같음)
- 이유: 평행선 작도에서 컴퍼스와 눈금 없는 자의 용도 및 동위각 작도 원리를 aligned 과정에 따라 점검하는 기본 작도 도구와 절차 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 작도에 쓰이는 컴퍼스와 눈금 없는 자의 기능 및 동위각의 평행선 성질을 aligned 단계별로 정확히 숙지해야 하므로 난이도 2이다.

**4칸**
- given: 직선←stem:「직선 $l$ 위에 있지 않은 한 점 $P$를 지나고 직선 $l$과 평행한 직선을 작도하는 과정」
- goal: 작도←stem:「평행한 직선을 작도하는 과정에 대한 설명 중 옳은 것만을 보기에서 모두 고른 것은?」
- method: 동위각(IMPLIED)←stem:「동위각의 크기가 같으면 두 직선이 평행하다는 성질을 이용한다.」 — 동위각 복사를 통한 평행선 작도 원리 적용
- condition: (없음)

**how** 점 P를 지나는 평행선 작도의 aligned 원리에서 동위각 성질 ㄱ과 컴퍼스 반지름 ㄴ이 참이고 ㄷ에서 눈금 없는 자가 아닌 컴퍼스임을 확인하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행선의 작도 원리와 도구의 성질을 검토한다. $$\begin{aligned} \text{ㄱ: } &\text{동위각의 크기가 같으면 두 직선이 평행하다는 기하학적 성질을 이용하므로 참이다.} \ \text{ㄴ: } &\text{크기가 같은 각을 작도할 때 두 점 } Q, P\text{에서 같은 반지름의 호를 그리므로 참이다.} \ \text{ㄷ: } &\text{선분의 길이를 재어 옮길 때는 컴퍼스를 사용해야 하므로 거짓이다.} \end{aligned}$$ 따라서 옳은 것은 ㄱ, ㄴ이며 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 4점


**발문**

한 꼭짓점에서 그을 수 있는 대각선의 개수가 $9$개인 다각형의 모든 대각선의 총 개수는?

**보기** ① 35개  ② 42개  ③ 44개  ④ 50개  ⑤ 54개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. n각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 n - 3개이다.
2. n - 3 = 9에서 n = 12이므로 이 다각형은 십이각형이다.
3. n각형의 모든 대각선의 총 개수는 n(n - 3) / 2이다.
4. 따라서 12 * 9 / 2 = 54개이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 꼭짓점에서 그을 수 있는 대각선의 개수가 $9$개인 다각형의 모든 대각선의 총 개수는?」
**RPM** M1-RPM-198 [평면도형 > 다각형 > 삼각형·다각형의 각 > 변·대각선 개수] (원천과 같음)
- 이유: 한 꼭짓점 대각선 수 9개로부터 변의 수 12를 구하고 대각선의 총 개수 54개를 계산하는 변·대각선 개수 유형이다.
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_DIAGONAL_FORMULA (원천과 같음) (원천과 같음)
- 이유: 한 꼭짓점에서 그은 대각선 수 공식 n - 3 = 9로 12각형을 찾고 총 대각선 수 공식으로 54개를 산출하는 다각형 대각선 계산 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 한 꼭짓점 대각선 공식으로 12를 구한 후 대각선 총 개수 공식을 대입해 54를 산출하는 2단계 기본 계산이므로 난이도 2이다.

**4칸**
- given: 대각선←stem:「한 꼭짓점에서 그을 수 있는 대각선의 개수가 $9$개인 다각형」
- goal: 대각선←stem:「모든 대각선의 총 개수는?」
- method: 대각선(IMPLIED)←solution:「$n$각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 $n - 3$개이다.」 — 한 꼭짓점 대각선 개수 공식 적용
- condition: (없음)

**how** 한 꼭짓점에서 그을 수 있는 대각선 공식으로 12각형을 구하고 대각선 총 개수 54개를 계산하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$n$각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는 $n - 3$개이다. $$\begin{aligned} n - 3 &= 9 \ n &= 12 \end{aligned}$$ 이다. 즉 이 다각형은 십이각형이다. $n$각형의 모든 대각선의 총 개수는 $\dfrac{n(n-3)}{2}$개이므로 $$\begin{aligned} \dfrac{12 \times (12 - 3)}{2} &= \dfrac{12 \times 9}{2} \ &= 6 \times 9 \ &= 54\text{개} \end{aligned}$$ 이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 3점


**발문**

한 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다. 중심각의 크기가 $40^\circ$인 부채꼴의 호의 길이가 $4\text{ cm}$일 때, 중심각의 크기가 $120^\circ$인 부채꼴의 호의 길이는?

**보기** ① 10 cm  ② 12 cm  ③ 14 cm  ④ 15 cm  ⑤ 16 cm

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 한 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다.
2. 중심각의 크기가 40^\circ에서 120^\circ로 120/40 = 3배가 된다.
3. 호의 길이도 3배가 되므로 4\text{ cm} \times 3 = 12\text{ cm}이다.
4. 따라서 정답은 ② 12 cm이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다.」
**RPM** M1-RPM-202 [평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 부채꼴의 호의 길이] (원천과 같음)
- 이유: 중심각 40도와 120도에 정비례하는 호의 길이 12 cm를 비례식으로 구하는 부채꼴의 호의 길이 유형이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE (원천과 같음) (원천과 같음)
- 이유: 부채꼴의 호의 길이가 중심각에 비례함을 이용하여 40도일 때 4 cm에서 120도일 때 12 cm를 계산하는 원과 부채꼴 측정 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 중심각이 3배가 됨에 따라 호의 길이도 4 cm에서 12 cm로 3배가 되는 1단계 정비례 계산이므로 난이도 1이다.

**4칸**
- given: 부채꼴←stem:「중심각의 크기가 $40^\circ$인 부채꼴의 호의 길이가 $4\text{ cm}$일 때」
- goal: 호←stem:「중심각의 크기가 $120^\circ$인 부채꼴의 호의 길이는?」
- method: 중심각(IMPLIED)←solution:「같은 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다.」 — 호의 길이와 중심각의 정비례 관계 적용
- condition: (없음)

**how** 중심각이 40도에서 120도로 3배 증가하므로 호의 길이도 4 cm의 3배인 12 cm가 됨을 정비례 관계로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

같은 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례한다. 구하는 호의 길이를 $x\text{ cm}$라 하면 $$\begin{aligned} x : 4 &= 120^\circ : 40^\circ \ x : 4 &= 3 : 1 \ x &= 4 \times 3 = 12\text{ cm} \end{aligned}$$ 이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 4점


**발문**

직선 위의 네 점 $A, B, C$에 대하여 점 $M$은 $\overline{AB}$의 중점이고, 점 $N$은 $\overline{BC}$의 중점이다. $\overline{AB} = 3\overline{BC}$이고 $\overline{MN} = 10\text{ cm}$일 때, 선분 $\overline{AB}$의 길이는?

**보기** ① 11 cm  ② 12 cm  ③ 14 cm  ④ 15 cm  ⑤ 18 cm

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. \overline{BC} = x\text{ cm}라 두면 \overline{AB} = 3x\text{ cm}이다.
2. 점 M은 AB의 중점이므로 MB = 1.5x이고, 점 N은 BC의 중점이므로 BN = 0.5x이다.
3. MN = MB + BN = 1.5x + 0.5x = 2x = 10\text{ cm}에서 x = 5\text{ cm}이다.
4. 따라서 선분 AB의 길이는 3x = 15\text{ cm}이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「점 $M$은 $\overline{AB}$의 중점이고, 점 $N$은 $\overline{BC}$의 중점이다.」
**RPM** M1-RPM-174 [기본 도형 > 기본 도형 > 점·선·면 > 두 점 사이의 거리와 중점] (원천과 같음)
- 이유: 선분 AB, BC의 중점 M, N과 MN = 10 cm 조건에서 선분 길이를 구하는 두 점 사이의 거리와 중점 유형이다.
**유형** PT=PT_M1_SEGMENT_LENGTH_RELATIONS / TPL=TPL_M1_SEGMENT_LENGTH_RELATIONS_RATIO_AND_MIDPOINT (원천과 같음) (원천과 같음)
- 이유: 중점 조건과 선분비 AB = 3 BC를 결합하여 MN = 10 cm로부터 AB의 길이를 구하는 선분 분할·중점과 길이 계산 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 선분의 비율과 두 중점에 따른 분할 길이를 합하여 10 cm 방정식을 세워 풀이하므로 난이도 2이다.

**4칸**
- given: 선분←stem:「$\overline{AB} = 3\overline{BC}$이고 $\overline{MN} = 10\text{ cm}$일 때」
- goal: 선분←stem:「선분 $\overline{AB}$의 길이는?」
- method: 중점(IMPLIED)←stem:「점 $M$은 $\overline{AB}$의 중점이고, 점 $N$은 $\overline{BC}$의 중점이다.」 — 선분의 중점 분할 성질 적용
- condition: (없음)

**how** 선분 BC를 x로 두고 중점 M, N을 이용하여 MN = 2x = 10 cm에서 x = 5 cm를 구한 뒤 AB = 15 cm로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{BC} = x\text{ cm}$라 하면 조건에서 $\overline{AB} = 3x\text{ cm}$이다. 점 $M$은 $\overline{AB}$의 중점이므로 $$\begin{aligned} \overline{MB} &= \dfrac{3x}{2}\text{ cm} \end{aligned}$$ 이다. 점 $N$은 $\overline{BC}$의 중점이므로 $$\begin{aligned} \overline{BN} &= \dfrac{x}{2}\text{ cm} \end{aligned}$$ 이다. 점의 순서가 $A - M - B - N - C$이므로 선분 $MN$의 길이는 $$\begin{aligned} \overline{MN} &= \overline{MB} + \overline{BN} \ &= \dfrac{3x}{2} + \dfrac{x}{2} \ &= 2x = 10\text{ cm} \end{aligned}$$ 이다. 따라서 $x = 5\text{ cm}$이다. 그러므로 구하는 선분 $\overline{AB}$의 길이는 $$\begin{aligned} \overline{AB} &= 3x = 3 \times 5 = 15\text{ cm} \end{aligned}$$ 이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 4점


**발문**

정육면체에서 한 모서리와 수직으로 만나는 모서리의 개수를 $a$, 꼬인 위치에 있는 모서리의 개수를 $b$라 할 때, $a+b$의 값은?

**보기** ① 8  ② 9  ③ 10  ④ 11  ⑤ 12

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정육면체의 전체 모서리 개수는 12개이다. (aligned 구조)
2. 한 모서리와 양 끝점에서 수직으로 만나는 모서리는 4개이므로 a = 4이다.
3. 평행한 모서리는 3개, 자기 자신 1개이므로 꼬인 위치에 있는 모서리는 b = 12 - (1 + 4 + 3) = 4이다.
4. 따라서 a + b = 4 + 4 = 8이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「정육면체에서 한 모서리와 수직으로 만나는 모서리의 개수를 $a$」
**RPM** M1-RPM-181 [기본 도형 > 위치 관계 > 공간에서의 위치 관계 > 직선과 평면의 위치 관계] (원천과 같음)
- 이유: 정육면체의 12개 모서리 사이의 수직 및 꼬인 위치 관계를 aligned 단계로 분석하는 공간 위치관계 유형이다.
**유형** PT=PT_M1_SPATIAL_LINE_PLANE_RELATIONS / TPL=TPL_M1_SPATIAL_LINE_PLANE_RELATIONS_LINE_PLANE_CLAIM_AUDIT (원천과 같음) (원천과 같음)
- 이유: 정육면체에서 기준 모서리에 대한 수직 모서리와 꼬인 위치 모서리의 개수를 aligned 분류로 산출하는 공간 직선 위치관계 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정육면체 12개 모서리의 공간적 위치관계를 수직, 평행, 꼬인 위치로 체계적으로 분류하므로 난이도 2이다.

**4칸**
- given: 정육면체←stem:「정육면체에서 한 모서리와 수직으로 만나는 모서리의 개수를 $a$, 꼬인 위치에 있는 모서리의 개수를 $b$라 할 때」
- goal: 꼬인위치←stem:「$a+b$의 값은?」
- method: 꼬인위치(IMPLIED)←solution:「공간에서 두 직선이 만나지도 않고 평행하지도 않은 위치가 꼬인 위치이므로」 — 공간에서 꼬인 위치의 정의를 통한 개수 여사건 산출
- condition: (없음)

**how** 정육면체 총 12개 모서리에서 수직으로 만나는 모서리 4개와 꼬인 위치 모서리 4개를 aligned 분류하여 합이 8임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

정육면체의 총 모서리의 개수는 $12$개이다. 특정한 한 모서리를 기준으로 다른 모서리들과의 위치 관계를 분류한다. $$\begin{aligned} \text{1) 수직으로 만나는 모서리}: &\text{ 양 끝 꼭짓점에서 각각 2개씩 만나므로 } a = 4 \ \text{2) 평행한 모서리}: &\text{ 마주 보는 방향으로 3개} \ \text{3) 자기 자신}: &\text{ 1개} \end{aligned}$$ 공간에서 두 직선이 만나지도 않고 평행하지도 않은 위치가 꼬인 위치이므로 $$\begin{aligned} b &= 12 - (1 + 4 + 3) \ &= 12 - 8 = 4 \end{aligned}$$ 이다. 따라서 $a+b$의 값은 $$\begin{aligned} a + b &= 4 + 4 = 8 \end{aligned}$$ 이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)

**발문**

두 직선 $l$과 $m$이 서로 평행하다. 꺾인 두 점을 지나는 꺾은선에서 위쪽 직선 $l$과 이루는 각이 $35^\circ$이고, 오른쪽 꺾인 점의 각이 $80^\circ$일 때, 그림의 두 각 $\angle x, \angle y$에 대하여 $\angle x + \angle y$의 크기는?

**보기** ① $105^\circ$  ② $110^\circ$  ③ $115^\circ$  ④ $120^\circ$  ⑤ $125^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 꺾인 점들을 지나며 평행선 l, m에 평행한 보조선을 긋는다.
2. 평행선 사이의 엇각에 의해 왼쪽 꺾인 각은 35^\circ와 t^\circ로 나뉜다.
3. 오른쪽 꺾인 각 80^\circ는 t^\circ + y와 같으므로 x + y = 35^\circ + 80^\circ = 115^\circ이다.
4. 따라서 각의 합은 115^\circ이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 그림의 두 각 $\angle x, \angle y$에 대하여

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 직선 $l$과 $m$이 서로 평행하다.」
**RPM** M1-RPM-177 [기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각] (원천과 같음)
- 이유: 평행선과 꺾은선에서 35도, 80도의 엇각 관계를 이용하여 각의 합 115도를 계산하는 동위각·엇각 유형이다.
**유형** PT=PT_M1_PARALLEL_ANGLE_TRANSFER / TPL=TPL_M1_PARALLEL_ANGLE_TRANSFER_DIRECT_TRANSFER (원천과 같음) (원천과 같음)
- 이유: 평행선 사이의 꺾인 선에 보조선을 그어 35도와 80도로부터 각 x + y = 115도를 도출하는 평행선 각의 이동·계산 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 꺾인 점에 평행 보조선을 긋고 35도와 80도의 엇각을 연계하여 115도를 구하므로 난이도 2이다.

**4칸**
- given: 평행←stem:「두 직선 $l$과 $m$이 서로 평행하다.」
- goal: 각←stem:「$\angle x + \angle y$의 크기는?」
- method: 엇각(IMPLIED)←solution:「꺾인 점들을 지나고 두 직선 $l, m$에 평행한 보조선을 각각 긋는다.」 — 평행 보조선과 엇각 크기 일치 원리 적용
- condition: (없음)

**how** 평행선 사이의 꺾인 점에 보조선을 긋고 35도와 80도를 엇각으로 묶어 x + y = 115도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

꺾인 점들을 지나고 두 직선 $l, m$에 평행한 보조선을 각각 긋는다. 엇각의 크기가 같으므로 왼쪽 꺾인 점의 각 $x$는 $$\begin{aligned} x &= 35^\circ + t^\circ \end{aligned}$$ 로 나뉜다 (단, $t^\circ$는 오른쪽으로 내려가는 선분이 수평 보조선과 이루는 엇각). 오른쪽 꺾인 점에서도 평행선에 의한 엇각에 의해 $$\begin{aligned} t^\circ + y &= 80^\circ \end{aligned}$$ 이다. 따라서 두 각의 합은 $$\begin{aligned} x + y &= (35^\circ + t^\circ) + y \ &= 35^\circ + (t^\circ + y) \ &= 35^\circ + 80^\circ = 115^\circ \end{aligned}$$ 이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점


**발문**

다음 보기 중 $\triangle ABC$가 오직 하나로 정해지는 것만을 있는 대로 고른 것은?

ㄱ. $\overline{AB} = 4\text{ cm}, \overline{BC} = 5\text{ cm}, \overline{CA} = 10\text{ cm}$ ㄴ. $\overline{AB} = 6\text{ cm}, \overline{BC} = 8\text{ cm}, \angle B = 45^\circ$ ㄷ. $\angle A = 40^\circ, \angle B = 60^\circ, \angle C = 80^\circ$ ㄹ. $\overline{BC} = 7\text{ cm}, \angle B = 50^\circ, \angle C = 65^\circ$

**보기** ① ㄱ  ② ㄴ  ③ ㄱ, ㄴ  ④ ㄴ, ㄷ  ⑤ ㄴ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ㄱ: 4 + 5 = 9 < 10이므로 삼각부등식을 위배하여 삼각형이 만들어지지 않는다.
2. ㄴ: AB=6 cm, BC=8 cm와 그 끼인각 B=45도가 주어졌으므로 SAS 조건으로 삼각형이 유일하게 결정된다.
3. ㄷ: 세 각만 주어지면 크기가 다른 삼각형이 무수히 많으므로 하나로 정해지지 않는다.
4. ㄹ: BC=7 cm와 양 끝 각 B=50도, C=65도가 주어졌으므로 ASA 조건으로 삼각형이 유일하게 결정된다.
5. 따라서 오직 하나로 정해지는 것은 ㄴ, ㄹ이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 보기 중 $\triangle ABC$가 오직 하나로 정해지는 것만을 있는 대로 고른 것은?」
**RPM** M1-RPM-189 [기본 도형 > 작도와 합동 > 삼각형의 작도 > 두 변과 끼인각 조건] **원천→판정: 기본 도형 > 작도와 합동 > 삼각형의 작도 > 한 변과 양 끝각 조건 → 기본 도형 > 작도와 합동 > 삼각형의 작도 > 두 변과 끼인각 조건**
- 이유: 두 변 AB, BC와 끼인각 45도 조건 등 삼각형 ABC의 작도 유일성을 판단하는 삼각형의 작도 유형이다.
**유형** PT=PT_M1_CONGRUENCE_UNIQUENESS / TPL=TPL_M1_CONGRUENCE_UNIQUENESS_UNIQUE_TRIANGLE_DATA (원천과 같음) (원천과 같음)
- 이유: 삼각부등식 위배 조건과 SAS, ASA 작도 조건을 대조하여 삼각형 ABC가 유일 결정되는 보기를 찾는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형의 결정조건 4가지 보기(삼각부등식, SAS, 세 각, ASA)를 각각 판정하므로 난이도 2이다.

**4칸**
- given: 삼각형←stem:「다음 보기 중 $\triangle ABC$가 오직 하나로 정해지는 것만을 있는 대로 고른 것은?」
- goal: 삼각형←stem:「오직 하나로 정해지는 것만을 있는 대로 고른 것은?」
- method: 합동(IMPLIED)←solution:「삼각형의 유일 결정 조건을 검토한다.」 — 삼각형의 결정조건 및 합동조건 SAS, ASA 적용
- condition: (없음)

**how** 삼각형 ABC 결정조건에서 삼각부등식 불성립인 ㄱ과 크기 미정인 ㄷ을 제외하고 SAS 조건의 ㄴ과 ASA 조건의 ㄹ을 골라 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 유일 결정 조건을 검토한다. $$\begin{aligned} \text{ㄱ: } 10 &\ge 4 + 5 = 9 \implies \text{삼각부등식 위배로 삼각형 불성립} \ \text{ㄴ: } \overline{AB}=6, \overline{BC}=8, \angle B=45^\circ &\implies \text{두 변과 끼인각이므로 SAS 유일 결정 (참)} \ \text{ㄷ: } \text{세 각만 주어짐} &\implies \text{크기가 무수히 많음 (거짓)} \ \text{ㄹ: } \overline{BC}=7, \angle B=50^\circ, \angle C=65^\circ &\implies \text{한 변과 양 끝 각이므로 ASA 유일 결정 (참)} \end{aligned}$$ 따라서 $\triangle ABC$가 하나로 정해지는 것은 ㄴ, ㄹ이며 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점


**발문**

길이가 $14\text{ cm}$인 철사를 남김없이 구부려 세 변의 길이가 모두 자연수인 삼각형을 만들려고 한다. 만들 수 있는 서로 다른 삼각형은 모두 몇 가지인가? (단, 합동인 삼각형은 하나로 센다.)

**보기** ① 3가지  ② 4가지  ③ 5가지  ④ 6가지  ⑤ 7가지

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 변의 길이를 자연수 a, b, c (a <= b <= c)라 하면 a + b + c = 14 cm이다. (aligned 구조)
2. 가장 긴 변 c < a + b = 14 - c이므로 2c < 14에서 c <= 6이고 3c >= 14에서 c >= 5이다.
3. c = 6일 때 a + b = 8 (a <= b <= 6) -> (2, 6, 6), (3, 5, 6), (4, 4, 6)으로 3가지이다.
4. c = 5일 때 a + b = 9 (a <= b <= 5) -> (4, 5, 5)로 1가지이다.
5. 따라서 만들 수 있는 서로 다른 삼각형은 총 3 + 1 = 4가지이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「세 변의 길이가 모두 자연수인 삼각형을 만들려고 한다.」
**RPM** M1-RPM-188 [기본 도형 > 작도와 합동 > 삼각형의 작도 > 세 변 조건] (원천과 같음)
- 이유: 둘레 14 cm인 삼각형의 세 변 길이 조건을 삼각부등식과 자연수 순서쌍으로 aligned 분석하는 삼각형 성립조건 유형이다.
**유형** PT=PT_M1_TRIANGLE_SIDE_FEASIBILITY / TPL=TPL_M1_TRIANGLE_SIDE_FEASIBILITY_INTEGER_PERIMETER_CASES (원천과 같음) **원천→판정: TPL_M1_CONGRUENCE_UNIQUENESS_UNIQUE_TRIANGLE_DATA → TPL_M1_TRIANGLE_SIDE_FEASIBILITY_INTEGER_PERIMETER_CASES**
- 이유: 둘레 14 cm가 주어진 상황에서 가장 긴 변의 범위를 정하고 자연수 세 변 순서쌍을 aligned 나열하여 가능한 삼각형 개수를 세는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각부등식을 만족하는 합 14 cm의 자연수 조합을 부등식과 경우 나누기로 구하므로 난이도 2이다.

**4칸**
- given: 자연수←stem:「세 변의 길이가 모두 자연수인 삼각형을 만들려고 한다.」
- goal: 삼각형←stem:「만들 수 있는 서로 다른 삼각형은 모두 몇 가지인가?」
- method: 삼각형(IMPLIED)←solution:「삼각부등식에 의해 가장 긴 변 $c$는 나머지 두 변의 합보다 작아야 하므로」 — 삼각부등식을 통한 가장 긴 변의 범위 결정
- condition: (없음)

**how** 둘레 14 cm인 삼각형의 가장 긴 변이 5 또는 6임을 확인하고 aligned 조건에 맞는 순서쌍 4가지를 계산하여 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 세 변의 길이를 $a, b, c$ ($a \le b \le c$)라 하자. 세 변의 길이의 합이 $14$이므로 $a + b + c = 14$이다. 삼각부등식에 의해 가장 긴 변 $c$는 나머지 두 변의 합보다 작아야 하므로 $$\begin{aligned} c &< a + b = 14 - c \ 2c &< 14 \ c &\le 6 \end{aligned}$$ 이다. 또한 $3c \ge a + b + c = 14$이므로 $c \ge 5$이다. 따라서 가능한 $c$의 값은 $5$ 또는 $6$이다. $$\begin{aligned}

1) \ c = 6: &\ a + b = 8, \ a \le b \le 6 \implies (2, 6, 6), (3, 5, 6), (4, 4, 6) \text{ (3가지)} \  
2) \ c = 5: &\ a + b = 9, \ a \le b \le 5 \implies (4, 5, 5) \text{ (1가지)} \end{aligned}$$ 따라서 만들 수 있는 서로 다른 삼각형은 총 $3 + 1 = 4$가지이다. 그러므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

선분 $AB$ 위에 한 점 $C$를 잡고, 선분 $AC, BC$를 각각 한 변으로 하는 정삼각형 $ACD$와 $CBE$를 직선 $AB$의 위쪽에 만들었다. 선분 $AE$와 $BD$의 교점을 $P$라 할 때, 다음 설명 중 옳지 않은 것은?

**보기** ① $\overline{AE} = \overline{BD}$  ② $\triangle ACE \equiv \triangle DCB$  ③ $\angle CAE = \angle CDB$  ④ $\angle AEC = \angle BDC$  ⑤ $\angle APD = 60^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정삼각형 ACD, CBE에서 AC = DC, CE = CB이고 각 ACE = 120도 = 각 DCB이다.
2. 두 변의 길이와 그 끼인각이 같으므로 삼각형 ACE와 DCB는 SAS 합동이다.
3. 따라서 대응변 AE = BD이고 대응각 CAE = CDB이다.
4. 각 AEC의 대응각은 각 DBC이지 각 BDC가 아니므로 4번 진술은 옳지 않다.
5. 따라서 옳지 않은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「정삼각형 $ACD$와 $CBE$를 직선 $AB$의 위쪽에 만들었다.」
**RPM** M1-RPM-192 [기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동] (원천과 같음)
- 이유: 선분 AC, BC를 한 변으로 하는 두 정삼각형의 꼭짓점을 연결하여 삼각형 ACE와 DCB의 SAS 합동을 이용하는 유형이다.
**유형** PT=PT_M1_CONGRUENCE_DATA_TRANSFER / TPL=TPL_M1_CONGRUENCE_DATA_TRANSFER_CORRESPONDENCE (원천과 같음) **원천→판정: TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION → TPL_M1_CONGRUENCE_DATA_TRANSFER_CORRESPONDENCE**
- 이유: 정삼각형 배치에서 삼각형 ACE와 DCB의 합동을 확인하고 대응변 AE, BD 및 대응각의 일치 여부를 점검하는 대응 관계 적용 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 정삼각형에서 120도 끼인각과 SAS 합동을 증명하고 보기의 대응각과 선분 관계를 판별하므로 난이도 2이다.

**4칸**
- given: 정삼각형←stem:「정삼각형 $ACD$와 $CBE$를 직선 $AB$의 위쪽에 만들었다.」
- goal: 합동←solution:「따라서 $\triangle ACE \equiv \triangle DCB$ (SAS 합동)이다.」
- method: 대응각(IMPLIED)←solution:「$\angle AEC$에 대응하는 각은 $\angle DBC$이지 $\angle BDC$가 아니다.」 — 합동인 삼각형의 꼭짓점 순서와 대응각 관계 검증
- condition: (없음)

**how** 두 정삼각형 ACD와 CBE로부터 삼각형 ACE와 DCB가 SAS 합동임을 보이고 대응각 위치를 확인하여 4번이 거짓임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 정삼각형 $ACD, CBE$에서 $$\begin{aligned} \overline{AC} &= \overline{DC} \ \overline{CE} &= \overline{CB} \ \angle ACE &= 60^\circ + 60^\circ = 120^\circ = \angle DCB \end{aligned}$$ 이므로 두 변의 길이와 그 끼인각이 각각 같다. 따라서 $\triangle ACE \equiv \triangle DCB$ (SAS 합동)이다. 합동에 의해 대응변 $\overline{AE} = \overline{BD}$이므로 ①과 ②는 참이다. 대응각 $\angle CAE = \angle CDB$이므로 ③도 참이다. $\angle AEC$에 대응하는 각은 $\angle DBC$이지 $\angle BDC$가 아니다. 따라서 ④는 옳지 않다. $\angle APD$는 삼각형 내각과 외각 관계에 의해 $60^\circ$이므로 ⑤도 참이다. 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점


**발문**

정육각형의 한 내각의 크기를 $\angle a$, 정팔각형의 한 내각의 크기를 $\angle b$, 정육각형의 한 외각의 크기를 $\angle c$, 정팔각형의 한 외각의 크기를 $\angle d$라 할 때, 다음 중 옳지 않은 것은?

**보기** ① $\angle a = 108^\circ$  ② $\angle b = 135^\circ$  ③ $\angle c = 60^\circ$  ④ $\angle d = 45^\circ$  ⑤ $\angle a + \angle b = 255^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정육각형의 한 내각의 크기는 (6-2)*180도 / 6 = 720도 / 6 = 120도이다. (aligned 계산)
2. 따라서 각 a = 120도이므로 각 a = 108도라는 보기 1번은 옳지 않다.
3. 정팔각형의 한 내각은 (8-2)*180도 / 8 = 135도이므로 각 b = 135도이다.
4. 정육각형 외각 c = 360/6 = 60도, 정팔각형 외각 d = 360/8 = 45도이다.
5. 따라서 옳지 않은 것은 ①이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「정육각형의 한 내각의 크기를 $\angle a$, 정팔각형의 한 내각의 크기를 $\angle b$」
**RPM** M1-RPM-199 [평면도형 > 다각형 > 정다각형 > 정다각형의 성질] **원천→판정: 평면도형 > 다각형 > 다각형의 내각과 외각 > 정다각형의 각 → 평면도형 > 다각형 > 정다각형 > 정다각형의 성질**
- 이유: 정육각형과 정팔각형의 내각, 외각 135도, 60도, 45도를 구하고 108도와의 불일치를 확인하는 정다각형 각 계산 유형이다.
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_PROPERTY_AUDIT (원천과 같음) (원천과 같음)
- 이유: 정육각형과 정팔각형의 내각과 외각 공식 180도, 720도 등을 aligned 적용하여 각 a, b, c, d의 진위를 검토하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정다각형의 한 내각과 외각 공식을 각각 적용하여 120도, 135도, 60도, 45도를 확인하므로 난이도 2이다.

**4칸**
- given: 정다각형←solution:「정다각형의 내각과 외각의 크기를 각각 계산한다.」
- goal: 내각←stem:「정육각형의 한 내각의 크기를 $\angle a$, 정팔각형의 한 내각의 크기를 $\angle b$」
- method: 외각(IMPLIED)←stem:「정육각형의 한 외각의 크기를 $\angle c$, 정팔각형의 한 외각의 크기를 $\angle d$라 할 때」 — 정다각형의 외각 공식 적용
- condition: (없음)

**how** 정육각형의 한 내각이 120도임을 aligned 공식으로 계산하여 108도로 잘못 제시된 1번을 정답으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

정다각형의 내각과 외각의 크기를 각각 계산한다. $$\begin{aligned} \angle a &= \dfrac{(6 - 2) \times 180^\circ}{6} = \dfrac{720^\circ}{6} = 120^\circ \ \angle b &= \dfrac{(8 - 2) \times 180^\circ}{8} = \dfrac{1080^\circ}{8} = 135^\circ \ \angle c &= \dfrac{360^\circ}{6} = 60^\circ \ \angle d &= \dfrac{360^\circ}{8} = 45^\circ \end{aligned}$$ 정육각형의 한 내각은 $120^\circ$이므로 $\angle a = 108^\circ$라는 설명은 옳지 않다 ($108^\circ$는 정오각형의 한 내각). ⑤ $\angle a + \angle b = 120^\circ + 135^\circ = 255^\circ$는 참이다. 따라서 옳지 않은 것은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점


**발문**

한 외각의 크기가 $36^\circ$인 정다각형의 내각의 크기의 합은?

**보기** ① $1080^\circ$  ② $1260^\circ$  ③ $1440^\circ$  ④ $1620^\circ$  ⑤ $1800^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정다각형의 모든 외각의 크기의 합은 360^\circ이다.
2. 한 외각의 크기가 36^\circ이므로 변의 개수 n = 360 / 36 = 10이다. (정십각형)
3. 10각형의 내각의 크기의 합은 (10 - 2) * 180^\circ = 8 * 180^\circ = 1440^\circ이다.
4. 따라서 정답은 ③ 1440^\circ이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 외각의 크기가 $36^\circ$인 정다각형의 내각의 크기의 합은?」
**RPM** M1-RPM-199 [평면도형 > 다각형 > 정다각형 > 정다각형의 성질] **원천→판정: 평면도형 > 다각형 > 다각형의 내각과 외각 > 내각의 합 → 평면도형 > 다각형 > 정다각형 > 정다각형의 성질**
- 이유: 외각의 합 360도와 한 외각 36도로부터 변의 수 10을 구하고 내각의 합 1440도를 계산하는 정다각형 각 유형이다.
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_REGULAR_POLYGON_ANGLE (원천과 같음) (원천과 같음)
- 이유: 한 외각 36도로 정십각형임을 찾고 aligned 공식 (n-2)*180도에 대입하여 내각의 합 1440도를 산출하는 정다각형 각 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 외각의 성질로 변의 수 10을 구한 뒤 내각의 총합 공식으로 1440도를 구하는 2단계 계산이므로 난이도 2이다.

**4칸**
- given: 외각←stem:「한 외각의 크기가 $36^\circ$인 정다각형의 내각의 크기의 합은?」
- goal: 내각←stem:「내각의 크기의 합은?」
- method: 정다각형(IMPLIED)←solution:「정다각형의 외각의 크기의 합은 $360^\circ$이므로 이 정다각형의 변의 개수 $n$은」 — 외각의 총합 360도로 정다각형 변의 개수 도출
- condition: (없음)

**how** 외각의 합 360도를 한 외각 36도로 나누어 정십각형임을 확인한 후 (10-2)*180도 = 1440도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

정다각형의 외각의 크기의 합은 $360^\circ$이므로 이 정다각형의 변의 개수 $n$은 $$\begin{aligned} n &= \dfrac{360^\circ}{36^\circ} = 10 \end{aligned}$$ 이다. 즉 이 정다각형은 정십각형이다. $n$각형의 내각의 크기의 합 공식은 $(n - 2) \times 180^\circ$이므로 $$\begin{aligned} (10 - 2) \times 180^\circ &= 8 \times 180^\circ \ &= 1440^\circ \end{aligned}$$ 이다. 따라서 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점


**발문**

선분 $AB$를 지름으로 하는 반원 $O$ 위에 두 점 $C, D$가 있다. $\overline{OC} \parallel \overline{BD}$이고 호 $AC$의 길이가 $6\text{ cm}$, 호 $BD$의 길이가 $12\text{ cm}$일 때, $\angle AOC$의 크기는?

**보기** ① $30^\circ$  ② $35^\circ$  ③ $40^\circ$  ④ $42^\circ$  ⑤ $45^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 AOC = x라 두면, 선분 OC와 BD가 평행하므로 동위각에 의해 각 OBD = x이다.
2. 삼각형 OBD는 OB = OD인 이등변삼각형이므로 각 BOD = 180도 - 2x이다.
3. 호의 길이는 중심각에 비례하므로 x / (180 - 2x) = 호 AC / 호 BD = 6 / 12 = 1/2이다.
4. 2x = 180 - 2x에서 4x = 180이므로 x = 45도이다.
5. 따라서 각 AOC = 45도이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「선분 $AB$를 지름으로 하는 반원 $O$ 위에 두 점 $C, D$가 있다.」
**RPM** M1-RPM-202 [평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 부채꼴의 호의 길이] **원천→판정: 평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 중심각·호·현 → 평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 부채꼴의 호의 길이**
- 이유: 반원 위의 호 AC, BD의 길이 비 6:12와 평행선 동위각으로부터 중심각 AOC의 크기 45도를 구하는 부채꼴 호의 길이 유형이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_CENTER_ARC (원천과 같음) (원천과 같음)
- 이유: 평행선 동위각과 이등변삼각형 성질을 호의 길이와 중심각의 비례 관계에 연립하여 각 AOC = 45도를 도출하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 호 AC, BD와 각 AOC 사이의 비례 관계 및 동위각 성질을 연립하여 방정식을 풀이하므로 난이도 2이다.

**4칸**
- given: 반원←stem:「선분 $AB$를 지름으로 하는 반원 $O$ 위에 두 점 $C, D$가 있다.」<br>평행←stem:「$\overline{OC} \parallel \overline{BD}$이고 호 $AC$의 길이가 $6\text{ cm}$, 호 $BD$의 길이가 $12\text{ cm}$일 때」
- goal: 중심각←solution:「호의 길이는 중심각의 크기에 정비례하므로」
- method: 이등변삼각형(IMPLIED)←solution:「$\triangle OBD$는 반지름 $\overline{OB} = \overline{OD}$인 이등변삼각형이므로」 — 반원의 반지름을 통한 이등변삼각형 각 관계 적용
- condition: (없음)

**how** 선분 OC와 BD의 평행 조건과 이등변삼각형 성질을 이용하여 호 AC와 BD의 비 1:2로 방정식을 세워 각 AOC = 45도를 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle AOC = x^\circ$라 하자. $\overline{OC} \parallel \overline{BD}$이므로 동위각에 의해 $\angle OBD = x^\circ$이다. $\triangle OBD$는 반지름 $\overline{OB} = \overline{OD}$인 이등변삼각형이므로 $$\begin{aligned} \angle ODB &= \angle OBD = x^\circ \ \angle BOD &= 180^\circ - 2x^\circ \end{aligned}$$ 이다. 호의 길이는 중심각의 크기에 정비례하므로 $$\begin{aligned} \dfrac{x}{180 - 2x} &= \dfrac{\overset{\frown}{AC}}{\overset{\frown}{BD}} = \dfrac{6}{12} = \dfrac{1}{2} \ 2x &= 180 - 2x \ 4x &= 180 \ x &= 45 \end{aligned}$$ 이다. 따라서 $\angle AOC = 45^\circ$이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 4점


**발문**

지름의 길이가 $12\text{ cm}$인 반원에서 지름 $BC$를 밑변으로 하는 이등변삼각형 $ABC$를 그렸을 때, 반원과 변 $AB, AC$가 만나는 점을 각각 $D, E$라 하자. 꼭지각 $\angle A = 60^\circ$일 때, 부채꼴 $DOE$의 넓이는?

**보기** ① $5\pi\text{ cm}^2$  ② $6\pi\text{ cm}^2$  ③ $7\pi\text{ cm}^2$  ④ $8\pi\text{ cm}^2$  ⑤ $9\pi\text{ cm}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 지름 BC = 12 cm에서 반원의 반지름은 r = 6 cm이다.
2. 이등변삼각형 ABC에서 꼭지각 A = 60도이므로 삼각형 ABC는 정삼각형이며 각 B = 각 C = 60도이다.
3. OB = OD = 6 cm이므로 삼각형 OBD는 정삼각형으로 각 BOD = 60도이고, 마찬가지로 각 COE = 60도이다.
4. 부채꼴 DOE의 중심각은 180도 - (60도 + 60도) = 60도이다.
5. 따라서 부채꼴 DOE의 넓이는 \pi \times 6^2 \times (60/360) = 6\pi\text{ cm}^2이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「지름의 길이가 $12\text{ cm}$인 반원에서 지름 $BC$를 밑변으로 하는 이등변삼각형 $ABC$를 그렸을 때」
**RPM** M1-RPM-203 [평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 중심각을 이용한 넓이] **원천→판정: 평면도형 > 원과 부채꼴 > 원과 부채꼴의 기본 > 중심각을 이용한 넓이 → 평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 중심각을 이용한 넓이**
- 이유: 반지름 6 cm인 반원과 정삼각형 ABC의 각 60도로부터 부채꼴 DOE의 넓이 6\pi cm^2를 구하는 부채꼴 넓이 유형이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE (원천과 같음) (원천과 같음)
- 이유: 지름 12 cm 반원에서 정삼각형의 꼭지각 60도와 이등변삼각형 성질로 중심각을 찾아 부채꼴 DOE의 넓이를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 이등변삼각형 ABC가 정삼각형임을 보이고 부채꼴 DOE의 중심각 60도와 넓이 공식을 연계하므로 난이도 2이다.

**4칸**
- given: 반원←stem:「지름의 길이가 $12\text{ cm}$인 반원에서 지름 $BC$를 밑변으로 하는 이등변삼각형 $ABC$를 그렸을 때」
- goal: 부채꼴←stem:「부채꼴 $DOE$의 넓이는?」
- method: 이등변삼각형(IMPLIED)←solution:「$\triangle ABC$는 $\overline{AB} = \overline{AC}$인 이등변삼각형이고 $\angle A = 60^\circ$이므로 밑각은」 — 이등변삼각형과 정삼각형의 각 성질을 이용한 중심각 도출
- condition: (없음)

**how** 반지름 6 cm와 삼각형 ABC의 각 60도로부터 부채꼴 DOE의 중심각이 60도임을 찾아 넓이 6\pi cm^2로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

반원의 반지름은 $r = \dfrac{12}{2} = 6\text{ cm}$이다. $\triangle ABC$는 $\overline{AB} = \overline{AC}$인 이등변삼각형이고 $\angle A = 60^\circ$이므로 밑각은 $$\begin{aligned} \angle B = \angle C &= \dfrac{180^\circ - 60^\circ}{2} = 60^\circ \end{aligned}$$ 이다 (즉 정삼각형이다). $\overline{OB} = \overline{OD} = 6\text{ cm}$이므로 $\triangle OBD$는 밑각이 $60^\circ$인 정삼각형이다. 따라서 $\angle BOD = 60^\circ$이다. 마찬가지로 $\overline{OC} = \overline{OE} = 6\text{ cm}$이므로 $\angle EOC = 60^\circ$이다. 반원의 중심각 $180^\circ$에서 양쪽 각을 빼면 부채꼴 $DOE$의 중심각은 $$\begin{aligned} \angle DOE &= 180^\circ - (60^\circ + 60^\circ) = 60^\circ \end{aligned}$$ 이다. 따라서 부채꼴 $DOE$의 넓이는 $$\begin{aligned} \pi \times 6^2 \times \dfrac{60^\circ}{360^\circ} &= 36\pi \times \dfrac{1}{6} \ &= 6\pi\text{ cm}^2 \end{aligned}$$ 이다. 따라서 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

공간에서 서로 다른 세 직선 $l, m, n$과 서로 다른 두 평면 $P, Q$에 대한 설명 중 옳은 것은?

**보기** ① 한 평면 $P$에 평행한 서로 다른 두 직선 $l, m$은 항상 평행하다.  ② 한 직선 $l$에 수직인 서로 다른 두 직선 $m, n$은 항상 평행하다.  ③ 한 평면 $P$에 수직인 서로 다른 두 평면은 항상 평행하다.  ④ 한 평면 $P$에 수직인 서로 다른 두 직선 $l, m$은 항상 평행하다.  ⑤ 한 직선 $l$에 평행한 평면 $P$와 수직인 평면 $Q$는 서로 평행하다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 공간에서 한 평면 P에 평행한 두 직선은 평행, 교차, 꼬인 위치가 모두 가능하므로 1번은 거짓이다. (aligned 분석)
2. 한 직선에 수직인 두 직선도 공간에서는 꼬인 위치 등이 가능하므로 2번은 거짓이다.
3. 한 평면에 수직인 서로 다른 두 평면은 직교하거나 만날 수 있으므로 3번은 거짓이다.
4. 한 평면 P에 수직인 서로 다른 두 직선 l, m은 항상 평행하므로 4번은 참이다.
5. 따라서 옳은 것은 ④이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「공간에서 서로 다른 세 직선 $l, m, n$과 서로 다른 두 평면 $P, Q$에 대한 설명 중 옳은 것은?」
**RPM** M1-RPM-181 [기본 도형 > 위치 관계 > 공간에서의 위치 관계 > 직선과 평면의 위치 관계] (원천과 같음)
- 이유: 공간에서 직선과 평면의 수직, 평행 관계에 대한 명제를 aligned 반례 검토로 판정하는 공간 위치관계 유형이다.
**유형** PT=PT_M1_SPATIAL_LINE_PLANE_RELATIONS / TPL=TPL_M1_SPATIAL_LINE_PLANE_RELATIONS_LINE_PLANE_CLAIM_AUDIT (원천과 같음) (원천과 같음)
- 이유: 공간에서 세 직선과 두 평면의 위치관계 명제들을 aligned 반례와 기하 정리로 감사하는 공간 직선·평면 위치관계 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 공간도형에서 꼬인 위치 및 평면과 직선의 다양한 공간적 배치 반례를 aligned 입체적으로 따져야 하므로 난이도 3이다.

**4칸**
- given: 직선←stem:「공간에서 서로 다른 세 직선 $l, m, n$과 서로 다른 두 평면 $P, Q$에 대한 설명 중 옳은 것은?」
- goal: 평면←choices:「한 평면 $P$에 수직인 서로 다른 두 직선 $l, m$은 항상 평행하다.」
- method: 수직(IMPLIED)←solution:「공간에서 직선과 평면의 위치 관계를 검토한다.」 — 공간에서 평면과 직선의 수직성 및 평행 판정 정리 적용
- condition: (없음)

**how** 공간에서 한 평면에 수직인 서로 다른 두 직선은 항상 평행하다는 정리를 aligned 반례들과 대조하여 4번으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

공간에서 직선과 평면의 위치 관계를 검토한다. $$\begin{aligned} \text{①: } l \parallel P, m \parallel P &\implies \text{공간에서 } l, m\text{은 평행하거나 만나거나 꼬인 위치일 수 있음 (거짓)} \ \text{②: } l \perp m, l \perp n &\implies \text{공간에서 } m, n\text{은 만날 수도 있고 꼬인 위치일 수도 있음 (거짓)} \ \text{③: } \text{평면에 수직인 두 평면} &\implies \text{교선을 가지며 직교하거나 만날 수 있음 (거짓)} \ \text{④: } l \perp P, m \perp P &\implies \text{한 평면에 수직인 서로 다른 두 직선은 항상 평행하다 (참)} \ \text{⑤: } &\text{반례가 존재하므로 거짓} \end{aligned}$$ 따라서 옳은 설명은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점


**발문**

평면 위에 꼭짓점 $C$를 공유하는 두 정삼각형 $ABC$와 $CDE$가 놓여 있다. $\angle DBE = 70^\circ$일 때, $\angle ADB$의 크기는?

**보기** ① $130^\circ$  ② $135^\circ$  ③ $140^\circ$  ④ $145^\circ$  ⑤ $150^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정삼각형 ABC, CDE에서 CA = CB, CD = CE이고 각 ACD = 각 BCE이므로 삼각형 ACD와 BCE는 SAS 합동이다.
2. 따라서 각 ADC = 각 BEC이다.
3. 삼각형 BCD와 BCE에서 각 BDC + 각 BEC = 360도 - 각 DBE(70도) - 각 DCE(60도) = 230도이다.
4. 각 BEC = 각 ADC이므로 각 BDC + 각 ADC = 230도이다.
5. 점 D 둘레의 각의 합 360도에서 230도를 빼면 각 ADB = 360도 - 230도 = 130도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「평면 위에 꼭짓점 $C$를 공유하는 두 정삼각형 $ABC$와 $CDE$가 놓여 있다.」
**RPM** M1-RPM-192 [기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동] (원천과 같음)
- 이유: 두 정삼각형 ABC, CDE의 꼭짓점 공유 배치에서 각 DBE = 70도를 이용하여 각 ADB = 130도를 구하는 SAS 합동 유형이다.
**유형** PT=PT_M1_CONGRUENCE_DATA_TRANSFER / TPL=TPL_M1_CONGRUENCE_DATA_TRANSFER_CORRESPONDENCE (원천과 같음) **원천→판정: TPL_M1_TRIANGLE_ANGLE_CHASE_INTERIOR_POINT_ANGLE_SUM → TPL_M1_CONGRUENCE_DATA_TRANSFER_CORRESPONDENCE**
- 이유: 꼭짓점을 공유하는 두 정삼각형 ABC, CDE의 SAS 합동으로 대응각을 이동시켜 각 ADB를 산출하는 대응 관계 적용 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 정삼각형의 회전 배치에서 SAS 합동을 도출하고 70도 조건을 점 D 둘레 각으로 추적하므로 난이도 3이다.

**4칸**
- given: 정삼각형←stem:「평면 위에 꼭짓점 $C$를 공유하는 두 정삼각형 $ABC$와 $CDE$가 놓여 있다.」
- goal: 합동←solution:「(\text{SAS}\text{ 합동})」
- method: 합동(IMPLIED)←solution:「따라서 $\angle ADC = \angle BEC$이다.」 — 합동인 삼각형의 대응각 일치 성질 적용
- condition: (없음)

**how** 두 정삼각형 ABC와 CDE의 SAS 합동으로부터 대응각을 옮겨 각 DBE = 70도와 점 D 둘레 각의 합으로 각 ADB = 130도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 정삼각형 $ABC, CDE$에서 $CA = CB$, $CD = CE$이고 $\angle ACD = \angle BCE$이므로 $$\begin{aligned} \triangle ACD &\equiv \triangle BCE \quad (\text{SAS}\text{ 합동}) \end{aligned}$$ 이다. 따라서 $\angle ADC = \angle BEC$이다. $\triangle BCD$와 $\triangle BCE$의 내각의 합을 합산하면 $$\begin{aligned} \angle BDC + \angle BEC &= 360^\circ - \angle DBE - \angle DCE \ &= 360^\circ - 70^\circ - 60^\circ = 230^\circ \end{aligned}$$ 이다. $\angle BEC = \angle ADC$이므로 $$\begin{aligned} \angle BDC + \angle ADC &= 230^\circ \end{aligned}$$ 이다. 점 $D$ 둘레의 각의 합은 $360^\circ$이므로 $$\begin{aligned} \angle ADB &= 360^\circ - (\angle BDC + \angle ADC) \ &= 360^\circ - 230^\circ = 130^\circ \end{aligned}$$ 이다. 따라서 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: FIGURE_MISSING
- ⚠ NEEDS_FIGURE (image 없음 -> 시험지 보류)
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

별 모양 교차 다각형에서 $\angle AFE = 30^\circ$일 때, $\angle A + \angle B + \angle C + \angle D + \angle E$의 크기는?

**보기** ① $310^\circ$  ② $320^\circ$  ③ $330^\circ$  ④ $340^\circ$  ⑤ $350^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 교차점 X에 대하여 사각형과 삼각형의 내각의 합 관계를 aligned 설정한다.
2. 각 B + 각 C + 각 D = 360도 - t도 (단, t도 = 각 BXD = 각 AXE)이다.
3. 삼각형 AXF와 EXF에서 각 AFE = 30도이므로 각 A + 각 E = t도 - 30도이다.
4. 따라서 다섯 각의 합은 (t - 30) + (360 - t) = 360 - 30 = 330도이다.
5. 따라서 정답은 ③ 330도이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NEEDS_FIGURE — 별 모양 교차 다각형에서 $\angle AFE = 30^\circ$일 때

**단원** M1-06(평면도형의 성질) / M1-06-POLYGON_CIRCLE(다각형과 원) (원천과 같음) (원천과 같음)
- 근거 인용: 「별 모양 교차 다각형에서 $\angle AFE = 30^\circ$일 때」
**RPM** M1-RPM-198 [평면도형 > 다각형 > 삼각형·다각형의 각 > 변·대각선 개수] **원천→판정: 평면도형 > 다각형 > 삼각형·다각형의 각 > 각의 크기 계산 → 평면도형 > 다각형 > 삼각형·다각형의 각 > 변·대각선 개수**
- 이유: 별 모양 다각형에서 각 AFE = 30도를 활용해 내각의 합 330도를 aligned 계산하는 다각형 각 유형이다.
**유형** PT=PT_M1_POLYGON_ANGLE_AND_COUNT / TPL=TPL_M1_POLYGON_ANGLE_AND_COUNT_ANGLE_SUM (원천과 같음) **원천→판정: TPL_M1_TRIANGLE_ANGLE_CHASE_VERTICAL_ANGLE_TRANSFER → TPL_M1_POLYGON_ANGLE_AND_COUNT_ANGLE_SUM**
- 이유: 별 모양 교차 다각형에서 맞꼭지각과 삼각형 내각 관계를 aligned 추적하여 다섯 꼭짓점 각의 합 330도를 구하는 다각형 각의 합 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 다각형의 꼭짓점 각들을 맞꼭지각 t와 삼각형 외각 관계로 소거하여 330도를 도출하므로 난이도 2이다.

**4칸**
- given: 다각형←stem:「별 모양 교차 다각형에서 $\angle AFE = 30^\circ$일 때」
- goal: 다각형←stem:「$\angle A + \angle B + \angle C + \angle D + \angle E$의 크기는?」
- method: 다각형(IMPLIED)←solution:「교차점 $X$에 대하여 사각형과 삼각형의 내각합 관계를 설정한다.」 — 교차점 맞꼭지각을 매개로 한 다각형 내각합 소거법 적용
- condition: (없음)

**how** 별 모양 교차 다각형에서 교차점 맞꼭지각 t를 매개로 각 AFE = 30도를 결합하여 360 - 30 = 330도임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

교차점 $X$에 대하여 사각형과 삼각형의 내각합 관계를 설정한다. $$\begin{aligned} \angle B + \angle C + \angle D &= 360^\circ - t^\circ \quad (\text{단, } t^\circ = \angle BXD = \angle AXE) \end{aligned}$$ 이다. 삼각형 $AXF$와 $EXF$의 내각의 합에서 점 $F$의 각의 합은 $\angle AFE = 30^\circ$이고, 점 $X$에서의 각의 합은 $360^\circ - t^\circ$이므로 $$\begin{aligned} \angle A + \angle E + 30^\circ + (360^\circ - t^\circ) &= 360^\circ \ \angle A + \angle E &= t^\circ - 30^\circ \end{aligned}$$ 이다. 따라서 다섯 각의 합을 구하면 $$\begin{aligned} \angle A + \angle B + \angle C + \angle D + \angle E &= (t^\circ - 30^\circ) + (360^\circ - t^\circ) \ &= 360^\circ - 30^\circ \ &= 330^\circ \end{aligned}$$ 이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점


**발문**

가로의 길이가 $5\text{ m}$, 세로의 길이가 $4\text{ m}$인 직사각형 모양의 울타리의 한 꼭짓점 $A$에 길이가 $7\text{ m}$인 끈으로 염소를 묶어 놓았다. 염소가 울타리 밖에서 최대한 움직일 수 있는 영역의 넓이는?

**보기** ① $36\pi\text{ m}^2$  ② $37.5\pi\text{ m}^2$  ③ $38\pi\text{ m}^2$  ④ $39.5\pi\text{ m}^2$  ⑤ $40\pi\text{ m}^2$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 염소가 움직이는 영역은 울타리 바깥에서 3개의 부채꼴로 aligned 나뉜다.
2. 1) 꼭짓점 A 중심 중심각 270도, 반지름 7 m 부채꼴: (3/4) * \pi * 7^2 = (147/4)\pi m^2.
3. 2) 가로 5 m 모서리를 돈 부채꼴: 중심각 90도, 반지름 7 - 5 = 2 m: (1/4) * \pi * 2^2 = \pi m^2 = (4/4)\pi m^2.
4. 3) 세로 4 m 모서리를 돈 부채꼴: 중심각 90도, 반지름 7 - 4 = 3 m: (1/4) * \pi * 3^2 = (9/4)\pi m^2.
5. 전체 넓이는 (147 + 4 + 9)/4 * \pi = (160/4)\pi = 40\pi m^2이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「가로의 길이가 $5\text{ m}$, 세로의 길이가 $4\text{ m}$인 직사각형 모양의 울타리의 한 꼭짓점 $A$에 길이가 $7\text{ m}$인 끈으로 염소를 묶어 놓았다.」
**RPM** M1-RPM-203 [평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 중심각을 이용한 넓이] **원천→판정: 평면도형 > 원과 부채꼴 > 복합도형 > 부채꼴을 포함한 넓이 → 평면도형 > 원과 부채꼴 > 부채꼴의 넓이 > 중심각을 이용한 넓이**
- 이유: 직사각형 울타리 꼭짓점 A에서 7 m 끈으로 형성되는 세 부채꼴(중심각 270도, 90도, 90도)의 넓이 합 40\pi를 구하는 부채꼴 넓이 유형이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE (원천과 같음) (원천과 같음)
- 이유: 직사각형 모서리를 회전하며 반지름이 7 m, 2 m, 3 m로 변화하는 세 부채꼴의 넓이를 aligned 합산하는 부채꼴 측정 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 장애물 모서리를 도는 끈의 길이 변화(7 m -> 2 m, 3 m)와 부채꼴 3개의 넓이(147/4\pi 등)를 각각 계산하여 합산하므로 난이도 3이다.

**4칸**
- given: 직사각형←stem:「가로의 길이가 $5\text{ m}$, 세로의 길이가 $4\text{ m}$인 직사각형 모양의 울타리의 한 꼭짓점 $A$에 길이가 $7\text{ m}$인 끈으로 염소를 묶어 놓았다.」
- goal: 부채꼴←stem:「염소가 울타리 밖에서 최대한 움직일 수 있는 영역의 넓이는?」
- method: 중심각(IMPLIED)←solution:「염소가 움직일 수 있는 영역은 직사각형 울타리 바깥에서 세 개의 부채꼴 영역으로 나뉜다.」 — 각 꼭짓점을 중심으로 하는 부채꼴 분할 및 넓이 계산 적용
- condition: (없음)

**how** 직사각형 밖에서 반지름 7 m(270도), 2 m(90도), 3 m(90도)인 3개 부채꼴의 넓이를 합산하여 40\pi m^2임을 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

염소가 움직일 수 있는 영역은 직사각형 울타리 바깥에서 세 개의 부채꼴 영역으로 나뉜다. $$\begin{aligned} \text{1) } A \text{ 중심 중심각 } 270^\circ(3/4\text{ 원}), \text{ 반지름 } 7\text{ m}: &\quad \dfrac{3}{4} \times \pi \times 7^2 = \dfrac{147}{4}\pi\text{ m}^2 \ \text{2) 가로 } 5\text{ m 벽을 돌았을 때 남은 끈 } 7-5=2\text{ m}, \text{ 중심각 } 90^\circ: &\quad \dfrac{1}{4} \times \pi \times 2^2 = \pi\text{ m}^2 \ \text{3) 세로 } 4\text{ m 벽을 돌았을 때 남은 끈 } 7-4=3\text{ m}, \text{ 중심각 } 90^\circ: &\quad \dfrac{1}{4} \times \pi \times 3^2 = \dfrac{9}{4}\pi\text{ m}^2 \end{aligned}$$ 세 영역은 서로 겹치지 않으므로 전체 넓이는 $$\begin{aligned} \text{전체 넓이} &= \dfrac{147}{4}\pi + \pi + \dfrac{9}{4}\pi \ &= \dfrac{147 + 4 + 9}{4}\pi \ &= \dfrac{160}{4}\pi = 40\pi\text{ m}^2 \end{aligned}$$ 이다. 따라서 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 5점


**발문**

[서술형 1] 한 직선 위에 세 점 $A, B, C$가 이 순서대로 놓여 있다. $\overline{AB} : \overline{BC} = 3 : 4$이고, 선분 $\overline{AB}$의 중점을 $M$, 선분 $\overline{BC}$의 중점을 $N$이라 할 때, 선분의 길이의 비 $\overline{MN} : \overline{BC}$를 가장 간단한 자연수의 비로 나타내고 그 풀이과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $7 : 8$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. AB : BC = 3 : 4이므로 양수 k에 대해 AB = 3k, BC = 4k라 둘 수 있다. (aligned 구조)
2. 점 M은 AB의 중점이므로 MB = 1.5k이고, 점 N은 BC의 중점이므로 BN = 2k이다.
3. A - M - B - N - C 순서이므로 선분 MN = MB + BN = 1.5k + 2k = 3.5k = 7k/2이다.
4. 따라서 선분의 길이의 비 MN : BC = (7k/2) : 4k = 7 : 8이다.
- 작성자 답: $7 : 8$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 직선 위에 세 점 $A, B, C$가 이 순서대로 놓여 있다.」
**RPM** M1-RPM-174 [기본 도형 > 기본 도형 > 점·선·면 > 두 점 사이의 거리와 중점] (원천과 같음)
- 이유: 한 직선 위 선분 AB, BC의 비와 중점 M, N을 이용하여 MN : BC = 7 : 8을 aligned 산출하는 중점 분할 유형이다.
**유형** PT=PT_M1_SEGMENT_LENGTH_RELATIONS / TPL=TPL_M1_SEGMENT_LENGTH_RELATIONS_RATIO_AND_MIDPOINT (원천과 같음) (원천과 같음)
- 이유: 선분비 3:4와 중점 조건을 문자로 놓아 MB, BN을 구하고 MN : BC를 aligned 계산하는 선분 분할·중점 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 선분 AB, BC의 비율과 두 중점 길이를 미지수 k로 표현하여 선분 MN과의 자연수 비 7:8로 정리하므로 난이도 2이다.

**4칸**
- given: 직선←stem:「한 직선 위에 세 점 $A, B, C$가 이 순서대로 놓여 있다.」
- goal: 선분←stem:「선분의 길이의 비 $\overline{MN} : \overline{BC}$를 가장 간단한 자연수의 비로 나타내고」
- method: 중점(IMPLIED)←stem:「선분 $\overline{AB}$의 중점을 $M$, 선분 $\overline{BC}$의 중점을 $N$이라 할 때」 — 중점을 통한 선분 분할 및 비례식 적용
- condition: (없음)

**how** 선분 AB, BC를 3k, 4k로 두고 중점 MB = 1.5k, BN = 2k의 합 MN = 3.5k로부터 MN : BC = 7 : 8임을 서술형으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\overline{AB} : \overline{BC} = 3 : 4$이므로 양의 상수 $k$에 대하여 $$\begin{aligned} \overline{AB} = 3k, \quad \overline{BC} = 4k \end{aligned}$$ 라 놓을 수 있다. 점 $M$은 $\overline{AB}$의 중점이므로 $$\begin{aligned} \overline{MB} &= \dfrac{3k}{2} \end{aligned}$$ 이다. 점 $N$은 $\overline{BC}$의 중점이므로 $$\begin{aligned} \overline{BN} &= \dfrac{4k}{2} = 2k \end{aligned}$$ 이다. 세 점 $A, B, C$가 한 직선 위에 순서대로 놓여 있으므로 점들의 위치는 $A - M - B - N - C$ 순서이다. 따라서 선분 $\overline{MN}$의 길이는 $$\begin{aligned} \overline{MN} &= \overline{MB} + \overline{BN} \ &= \dfrac{3k}{2} + 2k = \dfrac{7k}{2} \end{aligned}$$ 이다. 그러므로 $\overline{MN} : \overline{BC}$의 비를 구하면 $$\begin{aligned} \overline{MN} : \overline{BC} &= \dfrac{7k}{2} : 4k \ &= \dfrac{7}{2} : 4 \ &= 7 : 8 \end{aligned}$$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (PT, TPL)

**발문**

[서술형 2] 평각 $\angle AOB = 180^\circ$ 위의 한 점 $O$에 대하여 두 반직선 $OC, OE$가 있다. $\dfrac{1}{4}\angle AOD = \angle COD$이고, $\dfrac{1}{4}\angle BOD = \angle DOE$일 때, $\angle COE$의 크기를 구하고 그 풀이과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $45^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 각 COD = x, 각 DOE = y라 두면 각 AOD = 4x, 각 BOD = 4y이다.
2. 각 AOC = 4x - x = 3x이고 각 EOB = 4y - y = 3y이다.
3. 평각 AOB = 180도이므로 3x + x + y + 3y = 4(x + y) = 180도에서 x + y = 45도이다.
4. 따라서 각 COE = 각 COD + 각 DOE = x + y = 45도이다.
- 작성자 답: $45^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「평각 $\angle AOB = 180^\circ$ 위의 한 점 $O$에 대하여 두 반직선 $OC, OE$가 있다.」
**RPM** M1-RPM-175 [기본 도형 > 기본 도형 > 각 > 각의 크기] (원천과 같음)
- 이유: 평각 AOB = 180도 위의 반직선 OC, OE와 각 비율로부터 각 COE = 45도를 구하는 각의 크기 유형이다.
**유형** PT=PT_M1_STRAIGHT_ANGLE_PARTITION / TPL=TPL_M1_STRAIGHT_ANGLE_PARTITION_ADJACENT_RATIO_SUM **원천→판정: PT_M1_INTERSECTING_ANGLE_RELATIONS → PT_M1_STRAIGHT_ANGLE_PARTITION** **원천→판정: TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_RATIO → TPL_M1_STRAIGHT_ANGLE_PARTITION_ADJACENT_RATIO_SUM**
- 이유: 평각 180도를 나누는 인접각들의 비례 조건을 x, y로 치환하여 각 COE = x + y = 45도를 도출하는 평각 분할 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 평각 180도 위에 4(x+y) = 180도 방정식을 세워 원하는 각 COE = 45도를 산출하므로 난이도 2이다.

**4칸**
- given: 평각←stem:「평각 $\angle AOB = 180^\circ$ 위의 한 점 $O$에 대하여 두 반직선 $OC, OE$가 있다.」
- goal: 각←stem:「$\angle COE$의 크기를 구하고 그 풀이과정을 서술하시오.」
- method: 반직선(IMPLIED)←solution:「세 점 $A, O, B$는 한 직선 위에 있으므로 평각의 크기는 $180^\circ$이다.」 — 평각 180도의 인접각 분할 방정식 풀이
- condition: (없음)

**how** 각 COD와 DOE를 미지수로 두고 평각 AOB = 180도 조건에서 4(x + y) = 180도를 풀어 각 COE = 45도임을 서술형으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$\angle COD = x$, $\angle DOE = y$라 하자. 조건 $\dfrac{1}{4}\angle AOD = \angle COD = x$에서 $$\begin{aligned} \angle AOD &= 4x \ \angle AOC &= \angle AOD - \angle COD = 4x - x = 3x \end{aligned}$$ 이다. 마찬가지로 조건 $\dfrac{1}{4}\angle BOD = \angle DOE = y$에서 $$\begin{aligned} \angle BOD &= 4y \ \angle EOB &= \angle BOD - \angle DOE = 4y - y = 3y \end{aligned}$$ 이다. 세 점 $A, O, B$는 한 직선 위에 있으므로 평각의 크기는 $180^\circ$이다. $$\begin{aligned} \angle AOC + \angle COD + \angle DOE + \angle EOB &= 180^\circ \ 3x + x + y + 3y &= 180^\circ \ 4(x + y) &= 180^\circ \ x + y &= 45^\circ \end{aligned}$$ 이다. $\angle COE = \angle COD + \angle DOE = x + y$이므로 $$\begin{aligned} \angle COE &= 45^\circ \end{aligned}$$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

[서술형 3] 한 변의 길이가 $6\text{ cm}$인 정사각형 $ABCD$에서 두 꼭짓점 $A, B$를 중심으로 하고 변의 길이를 반지름으로 하는 두 원호를 정사각형 내부에 각각 그렸다. 두 원호의 교점을 $E$라 할 때, 선분 $AB$와 두 호 $AE, BE$로 둘러싸인 색칠한 부분의 둘레의 길이와 넓이를 구하고 그 풀이과정을 서술하시오.


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** 둘레: $(6 + 4\pi)\text{ cm}$, 넓이: $(12\pi - 9\sqrt{3})\text{ cm}^2$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정사각형 ABCD의 두 꼭짓점 A, B 중심의 반지름 6 cm 원호의 교점 E에서 AB = AE = BE = 6 cm이므로 삼각형 ABE는 정삼각형이다. (aligned 구조)
2. 각 BAE = 각 ABE = 60도이다.
3. (1) 둘레: 선분 AB(6 cm)와 중심각 60도 호 2개의 길이(2 * 2\pi = 4\pi cm)의 합이므로 (6 + 4\pi) cm이다.
4. (2) 넓이: 반지름 6 cm, 중심각 60도 부채꼴 2개의 넓이 합 12\pi에서 정삼각형 ABE 넓이 9\sqrt{3}을 빼므로 (12\pi - 9\sqrt{3}) cm^2이다.
- 작성자 답: 둘레: $(6 + 4\pi)\text{ cm}$, 넓이: $(12\pi - 9\sqrt{3})\text{ cm}^2$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-06(평면도형의 성질) / M1-06-PLANE_FIGURE_MEASURE(평면도형의 측정) (원천과 같음) (원천과 같음)
- 근거 인용: 「한 변의 길이가 $6\text{ cm}$인 정사각형 $ABCD$에서 두 꼭짓점 $A, B$를 중심으로 하고」
**RPM** M1-RPM-205 [평면도형 > 원과 부채꼴 > 복합도형 > 부채꼴을 포함한 둘레] **원천→판정: 평면도형 > 원과 부채꼴 > 복합도형 > 부채꼴을 포함한 넓이 → 평면도형 > 원과 부채꼴 > 복합도형 > 부채꼴을 포함한 둘레**
- 이유: 정사각형 ABCD와 두 원호의 교점으로 생기는 정삼각형 ABE 및 부채꼴 둘레와 넓이를 구하는 복합도형 유형이다.
**유형** PT=PT_CIRCLE_ANGLE_RELATIONS / TPL=TPL_CIRCLE_ANGLE_SECTOR_MEASURE (원천과 같음) **원천→판정: TPL_M1_CIRCLE_COMPOSITE_ARC_PERIMETER → TPL_CIRCLE_ANGLE_SECTOR_MEASURE**
- 이유: 정삼각형 ABE의 60도 중심각을 이용하여 호의 길이와 부채꼴 넓이의 합에서 삼각형 넓이를 빼는 원과 부채꼴 복합 계산 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정삼각형 ABE의 발견과 60도 부채꼴 2개의 중첩 영역 둘레와 넓이를 서술형으로 각각 유도해야 하므로 난이도 3이다.

**4칸**
- given: 정사각형←stem:「한 변의 길이가 $6\text{ cm}$인 정사각형 $ABCD$에서 두 꼭짓점 $A, B$를 중심으로 하고」
- goal: 둘레←stem:「색칠한 부분의 둘레의 길이와 넓이를 구하고 그 풀이과정을 서술하시오.」
- method: 정삼각형(IMPLIED)←solution:「따라서 $\triangle ABE$는 세 변의 길이가 모두 $6\text{ cm}$인 정삼각형이다.」 — 반지름이 같은 두 원호의 교점과 정삼각형 형성 및 부채꼴 분할
- condition: (없음)

**how** 두 원호의 교점 E가 정삼각형 ABE를 이룸을 밝히고 60도 부채꼴 2개와 정삼각형을 이용하여 둘레 (6+4\pi) cm와 넓이 (12\pi-9\sqrt{3}) cm^2를 서술형으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

점 $E$는 점 $A$와 $B$를 중심으로 하는 반지름 $6\text{ cm}$인 두 원호의 교점이므로 $$\begin{aligned} \overline{AB} = \overline{AE} = \overline{BE} &= 6\text{ cm} \end{aligned}$$ 이다. 따라서 $\triangle ABE$는 세 변의 길이가 모두 $6\text{ cm}$인 정삼각형이다. 그러므로 $\angle BAE = \angle ABE = 60^\circ$이다.

(1) 둘레의 길이: 색칠한 부분의 경계는 선분 $\overline{AB}$와 두 호 $AE, BE$로 이루어진다. 중심각 $60^\circ$, 반지름 $6\text{ cm}$인 원호 하나의 길이는 $$\begin{aligned} 2\pi \times 6 \times \dfrac{60^\circ}{360^\circ} &= 12\pi \times \dfrac{1}{6} = 2\pi\text{ cm} \end{aligned}$$ 이다. 따라서 둘레의 길이는 $$\begin{aligned} \text{둘레} &= \overline{AB} + \overset{\frown}{AE} + \overset{\frown}{BE} \ &= 6 + 2\pi + 2\pi = (6 + 4\pi)\text{ cm} \end{aligned}$$ 이다.

(2) 넓이: 색칠한 부분의 넓이는 반지름 $6\text{ cm}$, 중심각 $60^\circ$인 두 부채꼴의 넓이의 합에서 정삼각형 $ABE$의 넓이를 뺀 값이다. 부채꼴 하나의 넓이는 $$\begin{aligned} \pi \times 6^2 \times \dfrac{60^\circ}{360^\circ} &= 36\pi \times \dfrac{1}{6} = 6\pi\text{ cm}^2 \end{aligned}$$ 이다. 정삼각형 $ABE$의 넓이는 $$\begin{aligned} \dfrac{\sqrt{3}}{4} \times 6^2 &= \dfrac{\sqrt{3}}{4} \times 36 = 9\sqrt{3}\text{ cm}^2 \end{aligned}$$ 이다. 따라서 색칠한 부분의 넓이는 $$\begin{aligned} \text{넓이} &= (6\pi + 6\pi) - 9\sqrt{3} \ &= (12\pi - 9\sqrt{3})\text{ cm}^2 \end{aligned}$$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 6점


**발문**

[서술형 4] 정삼각형 $ABC$의 변 $BC$ 위의 점 $D$와 변 $CA$ 위의 점 $E$에 대하여 $\overline{BD} = \overline{CE}$이고, 선분 $AD$와 선분 $BE$의 교점을 $P$라 할 때, 다음 물음에 답하시오. (6점)

(1) $\triangle ABD$와 합동인 삼각형을 찾고, 그 합동 조건을 서술하시오. (3점) (2) $\angle PBD + \angle PDB$의 크기를 구하고 그 풀이과정을 서술하시오. (3점)


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** (1) $\triangle ABD \equiv \triangle BCE$ (SAS 합동), (2) $120^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. (1) 정삼각형 ABC에서 AB = BC, 각 ABD = 각 BCE = 60도이고 BD = CE이므로 삼각형 ABD와 BCE는 SAS 합동이다.
2. (2) 합동에 의해 대응각 각 ADB = 각 BEC이다.
3. 삼각형 BCE에서 각 EBC + 각 BEC + 각 BCE(60도) = 180도이므로 각 EBC + 각 BEC = 120도이다.
4. 각 PDB = 각 ADB = 각 BEC이고 각 PBD = 각 EBC이므로 각 PBD + 각 PDB = 120도이다.
- 작성자 답: (1) $\triangle ABD \equiv \triangle BCE$ (SAS 합동), (2) $120^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「정삼각형 $ABC$의 변 $BC$ 위의 점 $D$와 변 $CA$ 위의 점 $E$에 대하여 $\overline{BD} = \overline{CE}$이고」
**RPM** M1-RPM-192 [기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동] (원천과 같음)
- 이유: 정삼각형 ABC에서 선분 BD = CE 조건으로 삼각형 ABD와 BCE의 SAS 합동을 보이고 각의 합 120도를 구하는 유형이다.
**유형** PT=PT_M1_CONGRUENCE_DATA_TRANSFER / TPL=TPL_M1_CONGRUENCE_DATA_TRANSFER_CORRESPONDENCE (원천과 같음) **원천→판정: TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION → TPL_M1_CONGRUENCE_DATA_TRANSFER_CORRESPONDENCE**
- 이유: 정삼각형에서 삼각형 ABD와 BCE의 SAS 합동을 증명하고 대응각 관계를 삼각형 내각합에 적용하여 120도를 도출하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: SAS 합동 증명과 대응각을 이용한 각 PBD + 각 PDB = 120도 유도를 서술형으로 2단계 전개하므로 난이도 3이다.

**4칸**
- given: 정삼각형←stem:「정삼각형 $ABC$의 변 $BC$ 위의 점 $D$와 변 $CA$ 위의 점 $E$에 대하여 $\overline{BD} = \overline{CE}$이고」
- goal: 합동←solution:「(\text{SAS}\text{ 합동})」
- method: 대응각(IMPLIED)←solution:「$\triangle ABD \equiv \triangle BCE$이므로 대응각의 크기가 같다.」 — 합동인 삼각형의 대응각 치환을 통한 각의 합 계산
- condition: (없음)

**how** 정삼각형 ABC에서 두 삼각형 ABD와 BCE가 SAS 합동임을 보이고 대응각 치환과 삼각형 내각의 합을 이용하여 각의 합 120도를 서술형으로 판정하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

(1) 합동인 삼각형과 그 이유: $\triangle ABC$는 정삼각형이므로 $$\begin{aligned} \overline{AB} &= \overline{BC} \ \angle ABD &= \angle BCE = 60^\circ \end{aligned}$$ 이다. 조건에서 $\overline{BD} = \overline{CE}$이므로 두 변의 길이와 그 끼인각의 크기가 각각 같다. 따라서 두 삼각형은 대응점에 맞추어 $$\begin{aligned} \triangle ABD &\equiv \triangle BCE \quad (\text{SAS}\text{ 합동}) \end{aligned}$$ 이다.

(2) $\angle PBD + \angle PDB$의 크기와 풀이과정: $\triangle ABD \equiv \triangle BCE$이므로 대응각의 크기가 같다. $$\begin{aligned} \angle ADB &= \angle BEC \end{aligned}$$ 점 $P$는 선분 $AD$와 $BE$ 위에 있으므로 $$\begin{aligned} \angle PDB &= \angle ADB = \angle BEC \ \angle PBD &= \angle EBC \end{aligned}$$ 이다. $\triangle BCE$에서 세 내각의 크기의 합은 $180^\circ$이므로 $$\begin{aligned} \angle EBC + \angle BEC + \angle BCE &= 180^\circ \ \angle EBC + \angle BEC + 60^\circ &= 180^\circ \ \angle EBC + \angle BEC &= 120^\circ \end{aligned}$$ 이다. 따라서 구하는 각의 합은 $$\begin{aligned} \angle PBD + \angle PDB &= \angle EBC + \angle BEC \ &= 120^\circ \end{aligned}$$ 이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
