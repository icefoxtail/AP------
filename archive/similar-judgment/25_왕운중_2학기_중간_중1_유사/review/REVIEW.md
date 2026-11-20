# 검수 묶음 — 25_왕운중_2학기_중간_중1_유사

- 단계: **CONVERTED (판정 검사 미통과: CHOICE_ORDER 1)**
- 문항 24개 / 검사 PASS 23, FAIL 1, 보류 0
- 검수 기록: 입력된 verdict 0/24, HOLD 0, 풀이 답 비어 있음 24문항
- 그림 판단 분포: NONE 24
- 난이도 분포: 1단계 4, 2단계 16, 3단계 4
- 유형 NONE 0문항, 새 키 제안 0문항
- 검수 방법: `JUDGMENT_GUIDE.md` 의 "검수자용" 절. 고치면 `judgment/qNN.json` 의 값을 직접 고치고 `review.fixes` 에 같은 내용을 적는다.

## 먼저 볼 문항
- **Q1**: 원천 값과 다른 칸 2개 (소단원, RPM)
- **Q2**: 원천 값과 다른 칸 3개 (소단원, RPM, TPL)
- **Q3**: 원천 값과 다른 칸 3개 (소단원, RPM, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q4**: 원천 값과 다른 칸 3개 (소단원, RPM, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q5**: 원천 값과 다른 칸 2개 (RPM, TPL)
- **Q6**: 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)
- **Q7**: 원천 값과 다른 칸 2개 (RPM, TPL)
- **Q8**: 원천 값과 다른 칸 2개 (RPM, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q9**: 원천 값과 다른 칸 3개 (RPM, TPL, 난이도)
- **Q10**: 원천 값과 다른 칸 2개 (RPM, TPL)
- **Q11**: 원천 값과 다른 칸 2개 (RPM, TPL)
- **Q13**: 검사 코드: CHOICE_ORDER / 원천 값과 다른 칸 3개 (소단원, RPM, TPL)
- **Q14**: 원천 값과 다른 칸 5개 (단원, 소단원, RPM, PT, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q15**: 원천 값과 다른 칸 3개 (RPM, TPL, 난이도)
- **Q16**: 원천 값과 다른 칸 2개 (RPM, TPL)
- **Q17**: 원천 값과 다른 칸 3개 (RPM, TPL, 난이도)
- **Q18**: 원천 값과 다른 칸 2개 (RPM, TPL) / 풀이 과정에 정답 값이 등장하지 않음
- **Q19**: 원천 값과 다른 칸 2개 (RPM, TPL)
- **Q20**: 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)
- **Q21**: 원천 값과 다른 칸 2개 (RPM, TPL)
- **Q22**: 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)
- **Q23**: 원천 값과 다른 칸 3개 (소단원, RPM, TPL)
- **Q24**: 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)

---
## Q1 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (소단원, RPM)

**발문**

다음 그림에서 두 직선 $l, m$이 서로 평행($l \parallel m$)하고, $l, m$과 만나는 세로 직선과 $m$이 이루는 왼쪽 각이 $110^\circ$, 비스듬한 직선과 $m$이 이루는 오른쪽 각이 $155^\circ$이다. 세로 직선과 $l$이 이루는 오른쪽 각을 $\angle y$, 세로 직선과 비스듬한 직선이 이루는 각을 $\angle x$라 할 때, $\angle x - \angle y$의 크기는? [3점]

**보기** ① $15^\circ$  ② $20^\circ$  ③ $25^\circ$  ④ $30^\circ$  ⑤ $35^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. l // m 이므로 세로 직선과 m이 이루는 110도의 동위각은 l과 이루는 각도 110도이다.
2. 한 직선 위 이웃한 각의 합은 180도이므로 각 y = 180 - 110 = 70도이다.
3. 비스듬한 직선과 m이 이루는 155도의 동위각은 l과 이루는 각 155도이다.
4. 각 x + 각 y = 155도이므로 각 x = 155 - 70 = 85도이다.
5. 따라서 각 x - 각 y = 85 - 70 = 15도이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) **원천→판정: M1-05-POSITION_RELATION → M1-05-BASIC_FIGURE**
- 근거 인용: 「다음 그림에서 두 직선 $l」
**RPM** M1-RPM-177 [기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각] **원천→판정: 기본도형 > 위치 관계 > 평행선의 성질 > 동위각과 엇각의 크기 계산 → 기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각**
- 이유: 평행선과 110도 동위각의 성질을 적용하여 각을 이동한다.
**유형** PT=PT_M1_PARALLEL_ANGLE_TRANSFER / TPL=TPL_M1_PARALLEL_ANGLE_TRANSFER_DIRECT_TRANSFER (원천과 같음) (원천과 같음)
- 이유: 평행선에서 110도 동위각과 보각 관계를 이용해 미지각을 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 110도 동위각과 편각의 합 180도를 순차적으로 적용하여 x - y를 구한다.

**4칸**
- given: 평행←stem:「두 직선 $l, m$이 서로 평행($l \parallel m$)」
- goal: 직선←stem:「$\angle x - \angle y$의 크기는? [3점]」
- method: 동위각(NAMED)←solution:「동위각의 크기는 서로 같다」
- condition: (없음)

**how** 110도의 동위각으로 y=70도를 얻고 155도에서 x=85도를 찾아 차이 15도를 구하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

평행한 두 직선이 다른 한 직선과 만날 때 동위각의 크기는 서로 같다. $$\begin{aligned} \&l \parallel m\text{이므로 세로 직선과 } m\text{이 왼쪽에서 이루는 } 110^\circ\text{의 동위각은 세로 직선과 } l\text{이 왼쪽에서 이루는 각 } 110^\circ\text{이다.} \ &\text{한 직선 위에서 이웃한 두 각의 합은 } 180^\circ\text{이므로 } \angle y = 180^\circ - 110^\circ = 70^\circ\text{이다.} \ &\text{비스듬한 직선과 } m\text{이 오른쪽에서 이루는 } 155^\circ\text{의 동위각은 비스듬한 직선과 } l\text{이 오른쪽에서 이루는 각 } 155^\circ\text{이다.} \ &\text{이 각은 } \angle x\text{와 } \angle y\text{의 합이므로 } \angle x + \angle y = 155^\circ \ &\angle x = 155^\circ - 70^\circ = 85^\circ \ &\angle x - \angle y = 85^\circ - 70^\circ = 15^\circ \end{aligned}$$ 따라서 $\angle x - \angle y = 15^\circ$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q2 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (소단원, RPM, TPL)

**발문**

다음 그림과 같이 가로선과 두 비스듬한 직선이 서로 만날 때 생긴 각 중에서, 두 비스듬한 직선의 교점에서의 각 $\angle a$의 동위각의 크기를 각각 구하여 모두 더한 값은? (단, 왼쪽 아래 교점에서 가로선 위쪽 둔각은 $110^\circ$이고, 오른쪽 아래 교점에서 가로선 아래쪽 맞은편 예각은 $60^\circ$이다.) [3점]

**보기** ① $120^\circ$  ② $130^\circ$  ③ $140^\circ$  ④ $150^\circ$  ⑤ $160^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 왼쪽 교점에서 110도인 각과 이웃한 보각은 180 - 110 = 70도이다.
2. 오른쪽 교점에서 60도인 각의 맞꼭지각은 60도이다.
3. 각 a의 동위각은 왼쪽 직선 기준 70도, 오른쪽 직선 기준 60도이다.
4. 따라서 두 동위각의 크기의 합은 70 + 60 = 130도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) **원천→판정: M1-05-POSITION_RELATION → M1-05-BASIC_FIGURE**
- 근거 인용: 「다음 그림과 같이 가로선과」
**RPM** M1-RPM-177 [기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각] **원천→판정: 기본도형 > 위치 관계 > 동위각과 엇각 > 동위각 찾기 → 기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각**
- 이유: 교점의 110도 각과 동위각의 위치 관계를 파악하여 합을 구한다.
**유형** PT=PT_M1_PARALLEL_ANGLE_POSITION / TPL=TPL_M1_PARALLEL_ANGLE_POSITION_POSITIONAL_ANGLE_SUM (원천과 같음) **원천→판정: TPL_M1_PARALLEL_ANGLE_POSITION_FIND_CORRESPONDING → TPL_M1_PARALLEL_ANGLE_POSITION_POSITIONAL_ANGLE_SUM**
- 이유: 110도 각과 60도 각이 주어졌을 때 교점에서의 동위각 위치와 합을 판정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 110도 둔각의 보각과 맞꼭지각으로부터 두 직선에 대한 동위각의 합을 도출한다.

**4칸**
- given: 둔각←stem:「가로선 위쪽 둔각은 $110^\circ$」
- goal: 동위각←stem:「동위각의 크기를 각각 구하여 모두 더한 값은?」
- method: 맞꼭지각(NAMED)←solution:「맞꼭지각의 크기는」
- condition: (없음)

**how** 110도의 보각 70도와 60도의 동위각 합으로 130도를 계산하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

동위각은 한 직선이 두 직선과 만날 때 서로 같은 위치에 놓인 각이다. $$\begin{aligned} &\text{왼쪽 교점에서 } 110^\circ\text{인 각과 이웃한 보각은 } 180^\circ - 110^\circ = 70^\circ\text{이다.} \ &\text{오른쪽 교점에서 } 60^\circ\text{인 각과 맞꼭지각의 크기는 } 60^\circ\text{이다.} \ &\angle a\text{는 두 비스듬한 직선이 만나서 생긴 각이므로, 두 직선 각각을 자르는 직선으로 볼 때} \ &\text{첫째, 오른쪽 아래로 향하는 직선을 자르는 선으로 보면 동위각은 가로선과 만나는 점의 } 60^\circ\text{이다.} \ &\text{둘째, 왼쪽 아래로 향하는 직선을 자르는 선으로 보면 동위각은 가로선과 만나는 점의 } 70^\circ\text{이다.} \ &\text{따라서 두 동위각의 크기의 합은 } 60^\circ + 70^\circ = 130^\circ\text{이다.} \end{aligned}$$ 따라서 구하는 합은 $130^\circ$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q3 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (소단원, RPM, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

세 직선 $l, m, n$과 이를 가로지르는 두 직선 $p, q$가 만날 때 생긴 교각에 대하여 다음과 같은 관계가 성립한다. 직선 $p$와 직선 $l$이 만나는 점의 왼쪽 아래 각이 $88^\circ$이고, 직선 $p$와 직선 $n$이 만나는 점의 오른쪽 위 맞꼭지각이 $88^\circ$이다. 한편 직선 $p$와 직선 $m$의 교각은 $85^\circ$이며, 직선 $q$와 직선들의 교각은 평행 조건을 만족하지 않는다. 다음 중 서로 평행한 두 직선을 기호로 바르게 나타낸 것은? [5점]

**보기** ① $l \parallel m$  ② $m \parallel n$  ③ $l \parallel n$  ④ $p \parallel q$  ⑤ $l \parallel p$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직선 p와 직선 l의 교점에서 왼쪽 아래 각은 88도이다.
2. 직선 p와 직선 n의 교점에서 오른쪽 위 각이 88도이므로 맞꼭지각인 왼쪽 아래 각도 88도이다.
3. 직선 l과 n에서 직선 p에 대한 동위각의 크기가 88도로 같으므로 l // n 이다.
4. 직선 m과의 교각은 85도로 88도와 다르므로 평행하지 않다.
5. 따라서 서로 평행한 두 직선은 l // n 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) **원천→판정: M1-05-POSITION_RELATION → M1-05-BASIC_FIGURE**
- 근거 인용: 「세 직선 $l, m, n$과」
**RPM** M1-RPM-178 [기본 도형 > 기본 도형 > 평행선과 각 > 평행선 조건] **원천→판정: 기본도형 > 위치 관계 > 평행선의 판정 > 동위각의 크기를 이용한 평행선 판정 → 기본 도형 > 기본 도형 > 평행선과 각 > 평행선 조건**
- 이유: 88도 각의 동위각 크기가 같음을 확인하여 평행선 l // n 을 결정한다.
**유형** PT=PT_M1_PARALLELISM_CONVERSE / TPL=TPL_M1_PARALLELISM_CONVERSE_CORE (원천과 같음) **원천→판정: TPL_M1_PARALLELISM_CONVERSE_ANGLE_COMPARISON → TPL_M1_PARALLELISM_CONVERSE_CORE**
- 이유: 88도 교각의 동위각과 맞꼭지각 크기가 일치함을 통해 평행선을 판정하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 88도 맞꼭지각을 구하고 동위각이 같은 두 직선을 선택해야 한다.

**4칸**
- given: 맞꼭지각←stem:「오른쪽 위 맞꼭지각이 $88^\circ$이다」
- goal: 평행←stem:「서로 평행한 두 직선을 기호로 바르게 나타낸 것은?」
- method: 동위각(NAMED)←solution:「동위각 또는 엇각의 크기가 같으면」
- condition: (없음)

**how** 직선 p에 대해 88도로 동위각이 일치하는 두 직선 l과 n의 평행을 확인하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 직선이 다른 한 직선과 만날 때 동위각 또는 엇각의 크기가 같으면 두 직선은 서로 평행하다. $$\begin{aligned} &\text{직선 } p\text{를 자르는 직선으로 볼 때, } p\text{와 } l\text{의 교점의 왼쪽 아래 각은 } 88^\circ\text{이다.} \ \&p\text{와 } n\text{의 교점에서 오른쪽 위 각이 } 88^\circ\text{이므로 맞꼭지각인 왼쪽 아래 각도 } 88^\circ\text{이다.} \ &\text{두 각은 서로 동위각이고 그 크기가 } 88^\circ\text{로 같으므로 } l \parallel n\text{이다.} \ &\text{직선 } m\text{과의 교각은 } 85^\circ \ne 88^\circ\text{이므로 } m\text{은 } l, n\text{과 평행하지 않다.} \end{aligned}$$ 따라서 서로 평행한 두 직선은 $l \parallel n$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q4 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (소단원, RPM, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

$\angle XOY$와 크기가 같은 각을 반직선 $PQ$를 한 변으로 하여 작도하고자 한다. 점 $O$를 중심으로 호를 그려 반직선 $OX, OY$와의 교점을 각각 $A, B$라 하고, 점 $P$를 중심으로 같은 반지름의 호를 그려 반직선 $PQ$와의 교점을 $D$라 한다. 점 $B$에서 컴퍼스로 선분 $AB$의 길이를 재어 점 $D$를 중심으로 호를 그려 만나는 점을 $C$라 할 때, 다음 설명 중 옳은 것은? [4점]

**보기** ① $\overline{OA} = \overline{CD}$이다.  ② $\overline{OX} = \overline{OY}$이다.  ③ $\overline{OY} = \overline{PQ}$이다.  ④ $\overline{AB} = \overline{CD}$이다.  ⑤ 작도 순서는 '호 $CD$ 작도 $\rightarrow$ 호 $AB$ 작도 $\rightarrow$ 반직선 $PC$ 긋기'이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 O와 점 P를 중심으로 같은 반지름의 호를 그리므로 OA = OB = PD = PC 이다.
2. 컴퍼스로 선분 AB의 길이를 재어 점 D를 중심으로 호를 그려 만나는 점이 C이므로 AB = CD 이다.
3. 따라서 옳은 설명은 선분 AB = 선분 CD 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) **원천→판정: M1-05-POSITION_RELATION → M1-05-BASIC_FIGURE**
- 근거 인용: 「$\angle XOY$와 크」
**RPM** M1-RPM-185 [기본 도형 > 작도와 합동 > 기본 작도 > 선분·각의 이동] **원천→판정: 기본도형 > 작도와 합동 > 간단한 도형의 작도 > 크기가 같은 각의 작도 성질 → 기본 도형 > 작도와 합동 > 기본 작도 > 선분·각의 이동**
- 이유: 크기가 같은 각 작도에서 선분 AB 와 호의 교점 거리를 복사한다.
**유형** PT=PT_M1_BASIC_CONSTRUCTION / TPL=TPL_M1_BASIC_CONSTRUCTION_ARC_CHORD_ANGLE_COPY (원천과 같음) **원천→판정: TPL_M1_BASIC_CONSTRUCTION_ANGLE_COPY_PROPERTIES → TPL_M1_BASIC_CONSTRUCTION_ARC_CHORD_ANGLE_COPY**
- 이유: 각의 작도 절차에서 컴퍼스로 옮긴 선분 AB 와 CD 의 길이 관계를 확인하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 컴퍼스로 선분 AB 의 길이를 재어 호를 그린 원리에 따라 참인 명제를 찾는다.

**4칸**
- given: 작도←stem:「크기가 같은 각을 반직선 $PQ$를 한 변으로 하여 작도하고자 한다」
- goal: 선분←stem:「다음 설명 중 옳은 것은? [4점]」
- method: 반지름(NAMED)←solution:「원의 반지름과 두 교점 사이의 거리를」
- condition: (없음)

**how** 컴퍼스로 선분 AB의 길이를 옮겼으므로 AB=CD임을 확인하고 4번을 선택하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

크기가 같은 각의 작도는 컴퍼스로 원의 반지름과 두 교점 사이의 거리를 그대로 옮기는 과정이다. $$\begin{aligned} &\text{점 } O\text{와 점 } P\text{를 중심으로 같은 반지름의 호를 그리므로 } \overline{OA} = \overline{OB} = \overline{PD} = \overline{PC}\text{이다.} \ &\text{컴퍼스로 두 점 } A, B \text{ 사이의 거리를 재어 점 } D\text{를 중심으로 호를 그리므로 } \overline{AB} = \overline{CD}\text{이다.} \ &\text{점 } X, Y, Q\text{는 반직선 위의 임의의 점이므로 } \overline{OX}=\overline{OY}, \overline{OY}=\overline{PQ}\text{는 항상 성립하지 않는다.} \ &\text{따라서 옳은 것은 } \overline{AB} = \overline{CD}\text{이다.} \end{aligned}$$ 따라서 옳은 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q5 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

길이가 $18,\mathrm{cm}$인 철사를 구부려 세 변의 길이가 모두 $2,\mathrm{cm}$보다 큰 자연수인 삼각형을 만들려고 한다. 만들 수 있는 서로 다른 모양의 삼각형은 모두 몇 개인가? (단, 철사의 굵기는 생각하지 않는다.) [5점]

**보기** ① $2$개  ② $3$개  ③ $4$개  ④ $5$개  ⑤ $6$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 세 변의 길이를 a <= b <= c 라 하면 a + b + c = 18 이다.
2. 각 변의 길이가 2 cm 보다 큰 자연수이므로 a >= 3 이다.
3. 가장 긴 변 c에 대해 c < a + b = 18 - c 에서 2c < 18 이므로 c < 9 이다.
4. 3c >= a + b + c = 18 에서 c >= 6 이므로 c는 6, 7, 8 이 될 수 있다.
5. c=6: (6, 6) 1개; c=7: (4, 7), (5, 6) 2개; c=8: (3, 7), (4, 6), (5, 5) 3개로 총 6개이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「길이가 $18,\mathrm」
**RPM** M1-RPM-188 [기본 도형 > 작도와 합동 > 삼각형의 작도 > 세 변 조건] **원천→판정: 기본도형 > 작도와 합동 > 삼각형의 작도 > 삼각형의 세 변의 길이 조건 → 기본 도형 > 작도와 합동 > 삼각형의 작도 > 세 변 조건**
- 이유: 둘레 18 과 가장 긴 변 c < 9 조건을 통해 가능한 삼각형 조합을 분류한다.
**유형** PT=PT_M1_TRIANGLE_SIDE_FEASIBILITY / TPL=TPL_M1_TRIANGLE_SIDE_FEASIBILITY_INTEGER_PERIMETER_CASES (원천과 같음) **원천→판정: TPL_M1_TRIANGLE_SIDE_FEASIBILITY_INTEGER_COUNT → TPL_M1_TRIANGLE_SIDE_FEASIBILITY_INTEGER_PERIMETER_CASES**
- 이유: 둘레가 18 cm 인 삼각형의 세 변 조건과 삼각부등식을 만족하는 자연수 해의 개수를 세는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 세 변의 합 18 과 각 변이 3 이상인 조건을 이용해 c의 범위를 구하고 순서쌍을 센다.

**4칸**
- given: 자연수←stem:「길이가 $18,\mathrm{cm}$인 철사를 구부려」
- goal: 삼각형←stem:「만들 수 있는 서로 다른 모양의 삼각형은 모두 몇 개인가?」
- method: 길이(NAMED)←solution:「가장 긴 변의 길이는 나머지 두 변의 길이의 합보다」
- condition: (없음)

**how** 가장 긴 변 c가 6, 7, 8일 때의 경우를 나누어 합 18이 되는 순서쌍 6개를 구하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

삼각형의 세 변의 길이를 $a \le b \le c$라 하면, 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 작아야 한다. $$\begin{aligned} \&a + b + c = 18\text{이고 각 변의 길이가 } 2,\mathrm{cm}\text{보다 큰 자연수이므로 } a \ge 3\text{이다.} \ \&c < a + b\text{이고 } a + b = 18 - c\text{이므로 } c < 18 - c \implies 2c < 18 \implies c < 9 \ &\text{또한 } c\text{가 가장 긴 변이므로 } 3c \ge a + b + c = 18 \implies c \ge 6 \ &\text{따라서 } c\text{가 될 수 있는 자연수는 } 6, 7, 8\text{이다.} \ &1); c = 6\text{일 때: } a + b = 12, ; 3 \le a \le b \le 6 \implies (a, b) = (6, 6) ; (1\text{개}) \ &2); c = 7\text{일 때: } a + b = 11, ; 3 \le a \le b \le 7 \implies (a, b) = (4, 7), (5, 6) ; (2\text{개}) \ &3); c = 8\text{일 때: } a + b = 10, ; 3 \le a \le b \le 8 \implies (a, b) = (3, 7), (4, 6), (5, 5) ; (3\text{개}) \ &\text{총 개수} = 1 + 2 + 3 = 6\text{ (개)} \end{aligned}$$ 따라서 만들 수 있는 서로 다른 삼각형은 모두 $6$개이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q6 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)

**발문**

두 직선 $l, m$이 서로 평행($l \parallel m$)할 때, 두 평행선 사이에서 두 번 꺾인 선이 이루는 두 꼭짓점의 각의 크기가 각각 $130^\circ$, $75^\circ$이다. 직선 $l$과 꺾인 선의 시작 부분이 이루는 각을 $\angle a$, 직선 $m$과 꺾인 선의 끝 부분이 이루는 각을 $\angle b$라 할 때, $\angle a + \angle b$의 크기는? [4점]

**보기** ① $15^\circ$  ② $20^\circ$  ③ $25^\circ$  ④ $30^\circ$  ⑤ $35^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 꼭짓점 P(130도)와 Q(75도)를 지나며 평행선에 평행한 보조선을 긋는다.
2. P에서 엇각에 의해 위쪽 각은 각 a, 아래쪽 각은 130 - 각 a 이다.
3. Q의 왼쪽 위 각은 130 - 각 a, 오른쪽 위 각은 50 + 각 a 이다.
4. Q의 아래쪽 각은 75 - (50 + 각 a) = 25 - 각 a 이다.
5. 엇각에 의해 각 b = 25 - 각 a 이므로 각 a + 각 b = 25도이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) **원천→판정: M1-05-POSITION_RELATION → M1-05-BASIC_FIGURE**
- 근거 인용: 「두 직선 $l, m$이 서로」
**RPM** M1-RPM-177 [기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각] **원천→판정: 기본도형 > 위치 관계 > 평행선의 성질 > 꺾인 선에서의 평행선 보조선 활용 → 기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각**
- 이유: 보조선을 긋고 130도 꺾인 점의 엇각 관계를 연속 적용한다.
**유형** PT=PT_M1_PARALLEL_ANGLE_TRANSFER / TPL=TPL_M1_PARALLEL_ANGLE_TRANSFER_BENT_LINE (원천과 같음) **원천→판정: TPL_M1_PARALLEL_ANGLE_TRANSFER_ZIGZAG_AUXILIARY → TPL_M1_PARALLEL_ANGLE_TRANSFER_BENT_LINE**
- 이유: 평행선 사이의 꺾인 선 130도와 75도에서 보조선을 그어 각의 합을 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 130도와 75도의 두 꼭짓점에 평행 보조선을 그어 a + b = 25도를 유도한다.

**4칸**
- given: 평행←stem:「두 직선 $l, m$이 서로 평행($l \parallel m$)」
- goal: 꼭짓점←stem:「$\angle a + \angle b$의 크기는? [4점]」
- method: 보조선(NAMED)←solution:「평행한 보조선을 그어 엇각의 성질을 이용한다」
- condition: (없음)

**how** 130도와 75도 꼭짓점에 보조선을 그어 엇각의 전달로 a + b = 25도를 도출하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

꺾인 점을 지나면서 두 평행선과 평행한 보조선을 그어 엇각의 성질을 이용한다. $$\begin{aligned} &130^\circ\text{인 꼭짓점을 } P, ; 75^\circ\text{인 꼭짓점을 } Q\text{라 하고 } P, Q\text{를 지나며 } l, m\text{에 평행한 보조선을 긋는다.} \ \&l\text{과 } P\text{를 지나는 보조선이 평행하므로 엇각에 의해 } P\text{에서 보조선 위쪽 각은 } \angle a\text{이다.} \ &\text{따라서 } P\text{에서 보조선 아래쪽 각은 } 130^\circ - \angle a\text{이다.} \ \&P\text{를 지나는 보조선과 } Q\text{를 지나는 보조선이 평행하므로 엇각에 의해 } Q\text{의 왼쪽 위 각은 } 130^\circ - \angle a\text{이고,} \ \&Q\text{의 오른쪽 위 각은 } 180^\circ - (130^\circ - \angle a) = 50^\circ + \angle a\text{이다.} \ &\text{따라서 } Q\text{의 아래쪽 각은 } 75^\circ - (50^\circ + \angle a) = 25^\circ - \angle a\text{이다.} \ \&Q\text{를 지나는 보조선과 } m\text{이 평행하므로 엇각에 의해 } \angle b = 25^\circ - \angle a \ &\angle a + \angle b = 25^\circ \end{aligned}$$ 따라서 $\angle a + \angle b = 25^\circ$이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q7 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

두 삼각형 $ABC$와 $FED$가 서로 합동($\triangle ABC \equiv \triangle FED$)이다. $\overline{AB} = x$, $\overline{FE} = 12$이고, $\angle E = 105^\circ$, $\angle C = 45^\circ$, $\angle F = y^\circ$일 때, $x + y$의 값은? [3점]

**보기** ① $42$  ② $45$  ③ $48$  ④ $50$  ⑤ $52$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형 ABC와 FED가 합동이므로 대응변 x = FE = 12 이다.
2. 각 C의 대응각은 각 D이므로 각 D = 45도이다.
3. 삼각형 FED의 세 내각의 합은 180도이므로 각 F = 180 - (105 + 45) = 30도이다 (y = 30).
4. 따라서 x + y = 12 + 30 = 42 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 삼각형 $ABC$와 $F」
**RPM** M1-RPM-192 [기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동] **원천→판정: 기본도형 > 작도와 합동 > 도형의 합동 > 합동인 도형의 성질 → 기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동**
- 이유: 대응각과 105도 내각 합을 이용해 y=30을 구하고 x와 더한다.
**유형** PT=PT_M1_CONGRUENCE_DATA_TRANSFER / TPL=TPL_M1_CONGRUENCE_DATA_TRANSFER_ORDERED_CORRESPONDENCE (원천과 같음) **원천→판정: TPL_M1_CONGRUENCE_DATA_TRANSFER_CORRESPONDENCE → TPL_M1_CONGRUENCE_DATA_TRANSFER_ORDERED_CORRESPONDENCE**
- 이유: 합동인 두 삼각형의 대응변 x = 12와 각 105도 및 45도로부터 내각합을 적용하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 삼각형 합동 정의에 따라 대응변 x=12와 105도를 포함한 내각합으로 y=30을 쉽게 구한다.

**4칸**
- given: 합동←stem:「서로 합동($\triangle ABC \equiv \triangle FED$)」
- goal: 삼각형←stem:「$x + y$의 값은? [3점]」
- method: 대응변(NAMED)←solution:「대응변의 길이와 대응각의 크기는 각각 서로 같다」
- condition: (없음)

**how** 대응변 x=12와 삼각형 내각합으로 y=30도를 구하여 12+30=42를 계산하였다. 105

<details><summary>저장 해설 (판정 검토용)</summary>

합동인 두 삼각형에서 대응변의 길이와 대응각의 크기는 각각 서로 같다. $$\begin{aligned} &\triangle ABC \equiv \triangle FED\text{이므로 대응점은 } A\text{와 } F, ; B\text{와 } E, ; C\text{와 } D\text{이다.} \ &\overline{AB}\text{의 대응변은 } \overline{FE}\text{이므로 } x = \overline{FE} = 12\text{이다.} \ &\angle C\text{의 대응각은 } \angle D\text{이므로 } \angle D = \angle C = 45^\circ\text{이다.} \ &\triangle FED\text{에서 세 내각의 크기의 합은 } 180^\circ\text{이므로 } \ &\angle F = 180^\circ - (\angle E + \angle D) = 180^\circ - (105^\circ + 45^\circ) = 30^\circ \implies y = 30 \ \&x + y = 12 + 30 = 42 \end{aligned}$$ 따라서 $x + y = 42$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q8 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 삼각형 $ABC$와 $DEF$에서 $\overline{AB} = \overline{DE}$, $\overline{BC} = \overline{EF}$일 때, $\triangle ABC \equiv \triangle DEF$가 되기 위해 필요한 추가 조건과 그때 성립하는 합동 조건의 짝으로 올바른 것은? [3점]

**보기** ① $\overline{AC} = \overline{DF}$, $\mathrm{SAS}$합동  ② $\angle A = \angle D$, $\mathrm{SAS}$합동  ③ $\angle B = \angle E$, $\mathrm{SAS}$합동  ④ $\angle C = \angle F$, $\mathrm{ASA}$합동  ⑤ $\angle B = \angle E$, $\mathrm{ASA}$합동

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. AB = DE, BC = EF 로 두 쌍의 대응변의 길이가 같다.
2. 두 변의 끼인각은 각각 각 B와 각 E이다.
3. 따라서 각 B = 각 E 일 때 SAS 합동이 성립한다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 삼각형 $ABC$와 $D」
**RPM** M1-RPM-192 [기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동] **원천→판정: 기본도형 > 작도와 합동 > 삼각형의 합동 조건 > SAS 합동 조건 식별 → 기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동**
- 이유: 두 대응변 사이의 끼인각이 같아야 SAS 합동이 됨을 확인한다.
**유형** PT=PT_M1_CONGRUENCE_UNIQUENESS / TPL=TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION (원천과 같음) **원천→판정: TPL_M1_CONGRUENCE_UNIQUENESS_MISSING_CONDITION → TPL_M1_CONGRUENCE_UNIQUENESS_CONGRUENCE_CRITERION_SELECTION**
- 이유: 두 변이 같을 때 끼인각 조건에 따른 SAS 합동 판정을 묻는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 두 변 AB, BC의 끼인각이 각 B임을 확인하여 SAS 합동 조건을 선택한다.

**4칸**
- given: 삼각형←stem:「두 삼각형 $ABC$와 $DEF$에서」
- goal: 합동←stem:「합동 조건의 짝으로 올바른 것은? [3점]」
- method: 끼인각(NAMED)←solution:「두 쌍의 대응변의 길이가 같을 때, 그 끼인각의 크기가」
- condition: (없음)

**how** AB와 BC 사이 끼인각이 B이므로 각 B = 각 E 와 SAS합동이 짝지어진 3번을 선택하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 쌍의 대응변의 길이가 같을 때, 그 끼인각의 크기가 같으면 $\mathrm{SAS}$ 합동이다. $$\begin{aligned} &\text{주어진 조건에서 } \overline{AB} = \overline{DE}, ; \overline{BC} = \overline{EF}\text{이므로 두 쌍의 대응변의 길이가 같다.} \ &\overline{AB}\text{와 } \overline{BC}\text{의 끼인각은 } \angle B\text{이고, } \overline{DE}\text{와 } \overline{EF}\text{의 끼인각은 } \angle E\text{이다.} \ &\text{따라서 끼인각의 크기가 } \angle B = \angle E\text{로 같으면 } \mathrm{SAS}\text{ 합동이 성립한다.} \ &\text{참고로 } \overline{AC}=\overline{DF}\text{이면 } \mathrm{SSS}\text{ 합동이 된다.} \end{aligned}$$ 따라서 올바른 것은 $\angle B = \angle E$, $\mathrm{SAS}$합동이므로 정답은 ③이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q9 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, TPL, 난이도)

**발문**

선분 $AB$ 위의 한 점 $C$에 대하여 $\overline{AC}, \overline{BC}$를 각각 한 변으로 하는 두 정삼각형 $ACD$와 $CBE$를 같은 쪽에 만들었다. $\angle DAE = 25^\circ$일 때, 다음 중 옳지 않은 것은? [5점]

**보기** ① $\overline{AE} = \overline{BD}$  ② $\angle ACE = 100^\circ$  ③ $\angle DCE = 60^\circ$  ④ $\triangle ACE \equiv \triangle DCB$  ⑤ $\angle BDC = 35^\circ$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형 ACD와 CBE는 정삼각형이므로 CA=CD, CE=CB, 각 ACD=각 BCE=60도이다.
2. 평각에서 각 DCE = 180 - 60 - 60 = 60도이다.
3. 각 ACE = 60 + 60 = 120도이므로 각 ACE = 100 도는 옳지 않다.
4. 삼각형 ACE와 DCB는 SAS 합동이고 대응변 AE=BD, 각 BDC=35도이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「선분 $AB$ 위의 한 점」
**RPM** M1-RPM-192 [기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동] **원천→판정: 기본도형 > 작도와 합동 > 도형의 합동 > 정삼각형에서의 삼각형의 합동 응용 → 기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동**
- 이유: 정삼각형의 60도 각을 이용해 120도 끼인각과 SAS 합동을 적용한다.
**유형** PT=PT_M1_CONGRUENCE_DATA_TRANSFER / TPL=TPL_M1_CONGRUENCE_DATA_TRANSFER_EQUILATERAL_SAS_TRANSFER (원천과 같음) **원천→판정: TPL_M1_CONGRUENCE_DATA_TRANSFER_EQUILATERAL_ROTATION → TPL_M1_CONGRUENCE_DATA_TRANSFER_EQUILATERAL_SAS_TRANSFER**
- 이유: 한 직선 위의 두 정삼각형에서 SAS 합동을 유도하고 각 100도 선지의 거짓을 판별하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 정삼각형의 성질로부터 각 ACE=120도를 구하고 보기의 100도 오류를 식별해야 한다.

**4칸**
- given: 정삼각형←stem:「두 정삼각형 $ACD$와 $CBE$를 같은 쪽에 만들었다」
- goal: 선분←stem:「다음 중 옳지 않은 것은? [5점]」
- method: 합동(NAMED)←solution:「삼각형의 합동을 증명한다」
- condition: (없음)

**how** 각 ACE가 60+60=120도인데 100도로 제시된 2번이 거짓임을 확인하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 정삼각형의 변과 각의 성질을 이용하여 삼각형의 합동을 증명한다. $$\begin{aligned} &\triangle ACD\text{와 } \triangle CBE\text{는 정삼각형이므로 } \overline{CA}=\overline{CD}, ; \overline{CE}=\overline{CB}, ; \angle ACD=\angle BCE=60^\circ\text{이다.} \ &\text{점 } C\text{가 선분 } AB\text{ 위에 있으므로 평각에서 } \angle DCE = 180^\circ - 60^\circ - 60^\circ = 60^\circ\text{이다. (③ 참)} \ &\angle ACE = \angle ACD + \angle DCE = 60^\circ + 60^\circ = 120^\circ\text{이므로 } \angle ACE = 100^\circ\text{는 거짓이다. (② 거짓)} \ &\angle DCB = \angle DCE + \angle ECB = 60^\circ + 60^\circ = 120^\circ \ &\triangle ACE\text{와 } \triangle DCB\text{에서 } \overline{CA}=\overline{CD}, ; \overline{CE}=\overline{CB}, ; \angle ACE=\angle DCB=120^\circ\text{이므로} \ &\triangle ACE \equiv \triangle DCB ; (\mathrm{SAS}\text{ 합동})\text{이다. (④ 참)} \ &\text{합동인 두 삼각형의 대응변의 길이는 같으므로 } \overline{AE} = \overline{BD}\text{이다. (① 참)} \ &\text{대응각에서 } \angle BDC = \angle EAC\text{이고, } \angle DAC = 60^\circ, ; \angle DAE = 25^\circ\text{이므로} \ &\angle EAC = 60^\circ - 25^\circ = 35^\circ \implies \angle BDC = 35^\circ\text{이다. (⑤ 참)} \end{aligned}$$ 따라서 옳지 않은 것은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q10 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

다음 중 $x$와 $y$ 사이의 관계가 정비례 관계가 아닌 것은? [4점]

**보기** ① 한 권에 $x$원인 공책 $4$권의 가격 $y$원  ② 밑변의 길이가 $14$이고 높이가 $x$인 삼각형의 넓이 $y$  ③ 한 모서리의 길이가 $x$인 정육면체의 모든 모서리의 길이의 합 $y$  ④ 넓이가 $48$인 직사각형의 가로의 길이 $x$와 세로의 길이 $y$  ⑤ 시속 $80,\mathrm{km}$로 $x$시간 동안 달린 거리 $y,\mathrm{km}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. ① y = 4x (정비례)
2. ② y = 1/2 * 14 * x = 7x (정비례)
3. ③ 정육면체의 모서리는 12개이므로 y = 12x (정비례)
4. ④ xy = 48 에서 y = 48/x (반비례)
5. ⑤ y = 80x (정비례)
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「다음 중 $x$와 $y$ 사」
**RPM** M1-RPM-167 [좌표평면과 그래프 > 정비례와 반비례 > 정비례 > 정비례 관계식] **원천→판정: 좌표평면과 그래프 > 정비례와 반비례 > 정비례 > 정비례 관계식의 식별 → 좌표평면과 그래프 > 정비례와 반비례 > 정비례 > 정비례 관계식**
- 이유: y = ax 꼴과 y = 48/x 꼴을 비교하여 정비례 여부를 판정한다.
**유형** PT=PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION / TPL=TPL_DIRECT_INVERSE_PROPORTION_CLASSIFICATION_CORE (원천과 같음) **원천→판정: TPL_DIRECT_INVERSE_PROPORTION_CLASSIFICATION_CONTEXT → TPL_DIRECT_INVERSE_PROPORTION_CLASSIFICATION_CORE**
- 이유: 넓이 48 인 직사각형의 가로와 세로가 반비례 관계임을 구분하는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 넓이 48 에서 xy = 48 은 반비례 관계임을 바로 알 수 있다.

**4칸**
- given: 정비례←stem:「다음 중 $x$와 $y$ 사이의 관계가 정비례 관계가 아닌 것은?」
- goal: 관계←stem:「정비례 관계가 아닌 것은? [4점]」
- method: 반비례(NAMED)←solution:「두 양의 곱이 일정하여」
- condition: (없음)

**how** 넓이가 48인 직사각형의 두 변 관계가 y=48/x 로 반비례인 4번을 골랐다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y$가 $x$에 정비례하면 $y = ax$ ($a \ne 0$) 꼴의 관계식이 성립하고, 두 양의 곱이 일정하여 $xy = k$ ($k \ne 0$)이면 반비례 관계이다. $$\begin{aligned} &\text{① } y = 4x \implies \text{정비례 관계} \ &\text{② } y = \dfrac{1}{2} \times 14 \times x = 7x \implies \text{정비례 관계} \ &\text{③ 정육면체의 모서리는 } 12\text{개이므로 } y = 12x \implies \text{정비례 관계} \ &\text{④ } x \times y = 48 \implies y = \dfrac{48}{x} \implies \text{반비례 관계 (정비례 아님)} \ &\text{⑤ } y = 80x \implies \text{정비례 관계} \end{aligned}$$ 따라서 정비례 관계가 아닌 것은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q11 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

정비례 관계 $y=ax$와 반비례 관계 $y=\dfrac{b}{x}$의 그래프가 모두 제2사분면과 제4사분면을 지난다. 이때 반비례 관계 $y=-\dfrac{a+b}{x}$의 그래프와 같은 사분면을 지나는 그래프만을 보기에서 있는 대로 고른 것은? (단, $a, b$는 $0$이 아닌 상수)  
ㄱ. $y=-\dfrac{a}{x}$  
ㄴ. $y=bx$  
ㄷ. $y=\dfrac{ab}{x}$  
ㄹ. $y=-\dfrac{3b}{2x}$  
ㅁ. $y=2ax$

 [4점]

**보기** ① ㄱ, ㄴ  ② ㄴ, ㄷ  ③ ㄱ, ㄷ  ④ ㄱ, ㄹ  ⑤ ㄱ, ㄷ, ㄹ

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. y=ax와 y=b/x가 제2, 4사분면을 지나므로 a < 0, b < 0 이다.
2. a < 0, b < 0 에서 a+b < 0 이므로 -(a+b) > 0 이다.
3. 따라서 y = -(a+b)/x 는 제1, 3사분면을 지난다.
4. ㄱ. -a > 0 이므로 제1, 3사분면 (참)
5. ㄴ. b < 0 이므로 제2, 4사분면 (거짓)
6. ㄷ. ab > 0 이므로 제1, 3사분면 (참)
7. ㄹ. -3b/2 > 0 이므로 제1, 3사분면 (참)
8. ㅁ. 2a < 0 이므로 제2, 4사분면 (거짓)
9. 따라서 ㄱ, ㄷ, ㄹ이다.
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-COORDINATE_PLANE(좌표평면) (원천과 같음) (원천과 같음)
- 근거 인용: 「정비례 관계 $y=ax$와」
**RPM** M1-RPM-168 [좌표평면과 그래프 > 정비례와 반비례 > 정비례 > 정비례 그래프] **원천→판정: 좌표평면과 그래프 > 정비례와 반비례 > 정비례와 반비례의 그래프 > 비례상수의 부호와 지나는 사분면 판정 → 좌표평면과 그래프 > 정비례와 반비례 > 정비례 > 정비례 그래프**
- 이유: 정비례 y=ax 와 반비례의 부호 조건에서 제1, 3사분면을 지나는 식을 선별한다.
**유형** PT=PT_M1_QUADRANT_SIGN_DEDUCTION / TPL=TPL_M1_QUADRANT_SIGN_DEDUCTION_GRAPH_SIGN_QUADRANTS (원천과 같음) **원천→판정: TPL_M1_QUADRANT_SIGN_DEDUCTION_COMPOSITE_PARAMETERS → TPL_M1_QUADRANT_SIGN_DEDUCTION_GRAPH_SIGN_QUADRANTS**
- 이유: 비례상수 a, b 의 부호로부터 ab 등 각 그래프가 지나는 사분면을 추론하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: y=ax 에서 a<0, b<0 조건으로부터 각 보기의 비례계수 ab 등의 부호를 판정해야 한다.

**4칸**
- given: 사분면←stem:「제2사분면과 제4사분면을 지난다」
- goal: 그래프←stem:「같은 사분면을 지나는 그래프만을 보기에서 있는 대로 고른 것은?」
- method: 반비례(NAMED)←solution:「비례상수가 양수이면 제1, 3사분면을」
- condition: (없음)

**how** y=ax 에서 a<0, b<0을 얻어 비례상수가 양수가 되는 ㄱ, ㄷ, ㄹ을 골랐다.

<details><summary>저장 해설 (판정 검토용)</summary>

정비례와 반비례 그래프는 비례상수가 양수이면 제1, 3사분면을, 음수이면 제2, 4사분면을 지난다. $$\begin{aligned} \&y=ax\text{의 그래프가 제2, 4사분면을 지나므로 } a < 0\text{이다.} \ \&y=\dfrac{b}{x}\text{의 그래프가 제2, 4사분면을 지나므로 } b < 0\text{이다.} \ \&a < 0, ; b < 0\text{이므로 } a + b < 0 \implies -(a + b) > 0 \ &\text{따라서 } y = -\dfrac{a+b}{x}\text{의 그래프는 비례상수가 양수이므로 제1, 3사분면을 지난다.} \ &\text{보기의 각 그래프의 사분면을 조사하면 다음과 같다.} \ &\text{ㄱ. } a < 0 \implies -a > 0 \implies y = -\dfrac{a}{x}\text{는 제1, 3사분면을 지난다. (참)} \ &\text{ㄴ. } b < 0 \implies y = bx\text{는 제2, 4사분면을 지난다. (거짓)} \ &\text{ㄷ. } a < 0, ; b < 0 \implies ab > 0 \implies y = \dfrac{ab}{x}\text{는 제1, 3사분면을 지난다. (참)} \ &\text{ㄹ. } b < 0 \implies -\dfrac{3b}{2} > 0 \implies y = -\dfrac{3b}{2x}\text{는 제1, 3사분면을 지난다. (참)} \ &\text{ㅁ. } a < 0 \implies 2a < 0 \implies y = 2ax\text{는 제2, 4사분면을 지난다. (거짓)} \end{aligned}$$ 따라서 제1, 3사분면을 지나는 것은 ㄱ, ㄷ, ㄹ이므로 정답은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q12 — 객관식 3점


**발문**

어느 닫힌 용기 안에서 온도가 일정할 때, 기체의 압력 $x$와 부피 $y$의 곱은 항상 일정하다는 관계(보일의 법칙)가 성립한다. 기체의 압력 $x$와 부피 $y$ 사이의 관계를 좌표평면 위에 그래프로 나타낼 때, 이 그래프의 모양과 특징으로 옳은 것은? (단, $x > 0, y > 0$) [3점]

**보기** ① 원점을 지나고 오른쪽 위로 향하는 직선이다.  ② 원점을 지나고 오른쪽 아래로 향하는 직선이다.  ③ 제1사분면에서 $x$의 값이 증가할 때 $y$의 값도 증가하는 곡선이다.  ④ 제1사분면에서 $x$의 값이 증가할 때 $y$의 값이 감소하는 곡선이다.  ⑤ $x$축 또는 $y$축에 평행한 직선이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 기체의 압력 x와 부피 y의 곱이 일정하므로 xy = k (k > 0) 이다.
2. 따라서 y = k/x 이므로 반비례 관계이다.
3. x > 0, y > 0 이므로 제1사분면에 나타난다.
4. 제1사분면에서 x의 값이 증가할 때 y의 값은 감소하는 매끄러운 곡선이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「어느 닫힌 용기 안에서 온도」
**RPM** M1-RPM-170 [좌표평면과 그래프 > 정비례와 반비례 > 반비례 > 반비례 그래프] **원천→판정: 좌표평면과 그래프 > 정비례와 반비례 > 반비례 관계의 그래프 > 실생활 반비례 상황의 그래프 해석 → 좌표평면과 그래프 > 정비례와 반비례 > 반비례 > 반비례 그래프**
- 이유: 곱이 일정한 반비례 관계식 xy = k 의 제1사분면 곡선 특징을 확인한다.
**유형** PT=PT_M1_CONTEXT_GRAPH_INTERPRETATION / TPL=TPL_M1_CONTEXT_GRAPH_INTERPRETATION_CONTEXT_TO_RECIPROCAL_GRAPH (원천과 같음) (원천과 같음)
- 이유: 보일의 법칙 xy = k 상황을 반비례 그래프의 특징으로 해석하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 보일의 법칙 xy = k 를 반비례 관계와 제1사분면 감소 곡선으로 연결한다.

**4칸**
- given: 관계←stem:「기체의 압력 $x$와 부피 $y$의 곱은 항상 일정하다는 관계」
- goal: 그래프←stem:「이 그래프의 모양과 특징으로 옳은 것은?」
- method: 반비례(NAMED)←solution:「두 변수의 곱이 일정한 관계는 반비례 관계이다」
- condition: (없음)

**how** 압력과 부피의 곱이 일정하므로 제1사분면에서 감소하는 반비례 곡선인 4번을 선택하였다. xy

<details><summary>저장 해설 (판정 검토용)</summary>

두 변수의 곱이 일정한 관계는 반비례 관계이다. $$\begin{aligned} &\text{압력 } x\text{와 부피 } y\text{의 곱이 일정하므로 } xy = k ; (k > 0) \implies y = \dfrac{k}{x} \ &\text{이는 반비례 관계이며, } x > 0, ; y > 0\text{이므로 제1사분면에 나타난다.} \ \&y = \dfrac{k}{x}\text{에서 } k > 0\text{이므로 제1사분면에서 } x\text{의 값이 증가할 때 } y\text{의 값은 감소하는 매끄러운 곡선이다.} \end{aligned}$$ 따라서 옳은 설명은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q13 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 검사 코드: CHOICE_ORDER
- ⚠ 원천 값과 다른 칸 3개 (소단원, RPM, TPL)

**발문**

다음 표에서 $y$가 $x$에 정비례할 때, 상수 $p, q, r$에 대하여 $p \times q \times r$의 값은? [4점]

| $x$ | $-3$ | $p$ | $2$ | $r$ |
| :---: | :---- | :---- | :---- | :---- |
| **$y$** | $\dfrac{1}{2}$ | $1$ | $q$ | $-2$ |

**보기** ① $18$  ② $12$  ③ $24$  ④ $-12$  ⑤ $-24$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ③   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. y가 x에 정비례하므로 y = ax 이다.
2. x = -3 일 때 y = 1/2 이므로 a = -1/6 이다.
3. p * (-1/6) = 1 에서 p = -6 이다.
4. q = (-1/6) * 2 = -1/3 이다.
5. r * (-1/6) = -2 에서 r = 12 이다.
6. p * q * r = (-6) * (-1/3) * 12 = 2 * 12 = 24 이다.
- 작성자 답: ③ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) **원천→판정: M1-04-COORDINATE_PLANE → M1-04-GRAPH_RELATION**
- 근거 인용: 「다음 표에서 $y$가 $x$」
**RPM** M1-RPM-167 [좌표평면과 그래프 > 정비례와 반비례 > 정비례 > 정비례 관계식] **원천→판정: 좌표평면과 그래프 > 정비례와 반비례 > 정비례 관계 > 정비례 표에서의 미지수 계산 → 좌표평면과 그래프 > 정비례와 반비례 > 정비례 > 정비례 관계식**
- 이유: 정비례 상수 a = -1/6 을 찾아 표의 빈칸을 채우고 곱 24 를 구한다.
**유형** PT=PT_M1_PROPORTION_PARAMETER_EVALUATION / TPL=TPL_M1_PROPORTION_PARAMETER_EVALUATION_DIRECT_TABLE_COMPLETION (원천과 같음) **원천→판정: TPL_M1_PROPORTION_PARAMETER_EVALUATION_TABLE_EVAL → TPL_M1_PROPORTION_PARAMETER_EVALUATION_DIRECT_TABLE_COMPLETION**
- 이유: 표로 주어진 정비례 관계에서 상수 p, q, r 을 구하고 곱 24 를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 정비례식 y = -1/6 x 를 구하고 p, q, r을 계산하여 곱 24 를 도출한다.

**4칸**
- given: 정비례←stem:「다음 표에서 $y$가 $x$에 정비례할 때」
- goal: 상수←stem:「$p \times q \times r$의 값은? [4점]」
- method: 관계(NAMED)←solution:「꼴의 관계식이 성립한다」
- condition: (없음)

**how** a=-1/6에서 p=-6, q=-1/3, r=12를 구하여 곱 24를 계산하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

$y$가 $x$에 정비례하므로 $y = ax$ ($a \ne 0$) 꼴의 관계식이 성립한다. $$\begin{aligned} \&x = -3\text{일 때 } y = \dfrac{1}{2}\text{이므로 } \dfrac{1}{2} = a \times (-3) \implies a = -\dfrac{1}{6} \ &\text{따라서 정비례 관계식은 } y = -\dfrac{1}{6}x\text{이다.} \ \&x = p\text{일 때 } y = 1\text{이므로 } 1 = -\dfrac{1}{6}p \implies p = -6 \ \&x = 2\text{일 때 } y = q\text{이므로 } q = -\dfrac{1}{6} \times 2 = -\dfrac{1}{3} \ \&x = r\text{일 때 } y = -2\text{이므로 } -2 = -\dfrac{1}{6}r \implies r = 12 \ \&p \times q \times r = (-6) \times \left(-\dfrac{1}{3}\right) \times 12 = 2 \times 12 = 24 \end{aligned}$$ 따라서 $p \times q \times r = 24$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q14 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 5개 (단원, 소단원, RPM, PT, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

두 대각선 $AC$와 $BD$가 점 $O$에서 서로 수직으로 만나고 $\overline{AO} = \overline{OC}$, $\overline{BO} = \overline{OD}$인 평행사변형 $ABCD$에 대한 설명으로 옳지 않은 것은? [4점]

**보기** ① 점 $O$는 선분 $AC$의 중점이다.  ② 직선 $BD$는 선분 $AC$의 수직이등분선이다.  ③ 점 $C$에서 직선 $BD$에 내린 수선의 발은 점 $O$이다.  ④ 점 $B$와 직선 $AC$ 사이의 거리는 선분 $BO$의 길이와 같다.  ⑤ 직선 $BD$는 선분 $AO$의 수직이등분선이다.

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 평행사변형 ABCD에서 두 대각선이 점 O에서 수직으로 만나고 AO = OC, BO = OD 이다.
2. 점 O는 선분 AC의 중점이다 (참).
3. 직선 BD는 선분 AC의 중점 O를 지나고 수직이므로 AC의 수직이등분선이다 (참).
4. 점 C에서 직선 BD에 내린 수선의 발은 점 O이다 (참).
5. 점 B와 직선 AC 사이의 거리는 선분 BO의 길이이다 (참).
6. 직선 BD는 선분 AO의 중점이 아닌 끝점 O를 지나므로 AO의 수직이등분선이 아니다 (거짓).
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) **원천→판정: M1-06 → M1-05** **원천→판정: M1-06-POLYGON_CIRCLE → M1-05-POSITION_RELATION**
- 근거 인용: 「두 대각선 $AC$와 $BD」
**RPM** M1-RPM-183 [기본 도형 > 위치 관계 > 수직과 거리 > 수선과 수선의 발] **원천→판정: 기본도형 > 기본도형 > 점, 선, 면 > 수직이등분선과 거리의 정의 → 기본 도형 > 위치 관계 > 수직과 거리 > 수선과 수선의 발**
- 이유: 선분 AC 수선의 발과 수직이등분선의 정의를 정확히 판별한다.
**유형** PT=PT_M1_PERP_DISTANCE / TPL=NONE **원천→판정: PT_QUADRILATERAL_PROPERTIES → PT_M1_PERP_DISTANCE** **원천→판정: TPL_QUADRILATERAL_PROPERTIES_DIAGONAL_ORTHOGONAL → NONE**
- 이유: 수직이등분선과 수선의 발, 점과 직선 사이의 거리 진술의 참·거짓을 선분 AC 등에 대해 판단하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 수직이등분선은 중점을 지나야 하므로 선분 AO 의 끝점을 지나는 직선 BD는 거짓이다. AC

**4칸**
- given: 수선←stem:「두 대각선 $AC$와 $BD$가 점 $O$에서 서로 수직으로 만나고」
- goal: 평행사변형←stem:「평행사변형 $ABCD$에 대한 설명으로 옳지 않은 것은?」
- method: 수직이등분선(NAMED)←solution:「선분의 중점을 지나면서 그 선분에 수직인 직선이다」
- condition: (없음)

**how** 선분 AC의 수직이등분선 성질을 확인하고 선분 AO에 대해 거짓인 5번을 선택하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

수직이등분선은 어떤 선분의 중점을 지나면서 그 선분에 수직인 직선이다. $$\begin{aligned} &\text{① } \overline{AO} = \overline{OC}\text{이므로 점 } O\text{는 선분 } AC\text{의 중점이다. (참)} \ &\text{② 직선 } BD\text{는 선분 } AC\text{의 중점 } O\text{를 지나고 } \overline{AC} \perp \overline{BD}\text{이므로 선분 } AC\text{의 수직이등분선이다. (참)} \ &\text{③ } \overline{AC} \perp \overline{BD}\text{이므로 점 } C\text{에서 직선 } BD\text{에 내린 수선의 발은 점 } O\text{이다. (참)} \ &\text{④ } \overline{BD} \perp \overline{AC}\text{이므로 점 } B\text{에서 직선 } AC\text{에 내린 수선의 길이는 선분 } BO\text{의 길이와 같다. (참)} \ &\text{⑤ 직선 } BD\text{는 선분 } AO\text{의 한 끝점인 } O\text{를 지날 뿐, 선분 } AO\text{의 중점을 지나지 않으므로 수직이등분선이 아니다. (거짓)} \end{aligned}$$ 따라서 옳지 않은 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q15 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, TPL, 난이도)

**발문**

직선 $l$ 위에 서로 다른 네 점 $A, B, C, D$가 순서대로 놓여 있고, 직선 $l$ 위에 있지 않은 한 점 $P$가 있다. 이 다섯 개의 점 중 두 점을 이용하여 만들 수 있는 서로 다른 직선의 개수를 $a$, 반직선의 개수를 $b$, 선분의 개수를 $c$라 할 때, $a + b + c$의 값은? [4점]

**보기** ① $27$  ② $29$  ③ $31$  ④ $33$  ⑤ $35$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직선의 개수 a: 직선 l (1개) + 점 P와 4점을 잇는 직선 (4개) = 5개
2. 반직선의 개수 b: 직선 l 위에서 6개 + 점 P 관련 8개 = 14개
3. 선분의 개수 c: 5개 점 중 2개를 택하는 조합 5*4/2 = 10개
4. 따라서 a + b + c = 5 + 14 + 10 = 29 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「직선 $l$ 위에 서로 다른」
**RPM** M1-RPM-173 [기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분] **원천→판정: 기본도형 > 기본도형 > 점, 선, 면 > 직선, 반직선, 선분의 개수 세기 → 기본 도형 > 기본 도형 > 점·선·면 > 직선·반직선·선분**
- 이유: 직선, 반직선, 선분의 정의에 따라 개수를 분류하여 29 를 도출한다.
**유형** PT=PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT / TPL=TPL_M1_GENERATED_GEOMETRIC_OBJECT_COUNT_MULTI_OBJECT_COUNT (원천과 같음) **원천→판정: TPL_M1_GENERATED_GEOMETRIC_OBJECT_COUNT_COLLINEAR_EXTERNAL → TPL_M1_GENERATED_GEOMETRIC_OBJECT_COUNT_MULTI_OBJECT_COUNT**
- 이유: 공선점과 외부 점에서 결정되는 직선, 반직선, 선분의 개수를 세어 합 29 를 구하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 직선 5개, 반직선 14개, 선분 10개를 체계적으로 세어 합 29 를 계산해야 한다.

**4칸**
- given: 직선←stem:「직선 $l$ 위에 서로 다른 네 점 $A, B, C, D$가」
- goal: 반직선←stem:「$a + b + c$의 값은? [4점]」
- method: 선분(NAMED)←solution:「직선, 반직선, 선분의 정의에 따라」
- condition: (없음)

**how** 직선 5개, 반직선 14개, 선분 10개의 개수를 합산하여 29를 구하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

직선, 반직선, 선분의 정의에 따라 개수를 각각 구한다. $$\begin{aligned} &1); \text{직선의 개수 } a: \ &\text{네 점 } A, B, C, D\text{는 한 직선 위에 있으므로 직선은 } l \text{ 하나뿐이다. (}1\text{개)} \ &\text{점 } P\text{와 네 점 } A, B, C, D\text{를 각각 잇는 직선은 } 4\text{개이다.} \ &\implies a = 1 + 4 = 5 \ &2); \text{반직선의 개수 } b: \ &\text{직선 } l \text{ 위에서 생기는 반직선은 오른쪽 방향 } \overrightarrow{AB}, \overrightarrow{BC}, \overrightarrow{CD}\text{의 } 3\text{개와} \ &\text{왼쪽 방향 } \overrightarrow{DC}, \overrightarrow{CB}, \overrightarrow{BA}\text{의 } 3\text{개로 총 } 6\text{개이다.} \ &\text{점 } P\text{가 관련된 반직선은 } P\text{에서 출발하는 } 4\text{개와 } P\text{로 향하는 } 4\text{개로 총 } 8\text{개이다.} \ &\implies b = 6 + 8 = 14 \ &3); \text{선분의 개수 } c: \ &5\text{개의 점 중 서로 다른 두 점을 택하는 방법의 수와 같으므로 } \ &\implies c = \dfrac{5 \times 4}{2} = 10 \ \&a + b + c = 5 + 14 + 10 = 29 \end{aligned}$$ 따라서 $a + b + c = 29$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q16 — 객관식 3점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

직육면체 $ABCD-EFGH$에서 면 $ABCD$와 면 $ABFE$의 교선과 한 점에서 만나는 모서리는? [3점]

**보기** ① 모서리 $CG$  ② 모서리 $DH$  ③ 모서리 $GH$  ④ 모서리 $AE$  ⑤ 모서리 $CD$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ④   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 면 ABCD와 면 ABFE의 교선은 모서리 AB 이다.
2. 모서리 AB와 한 점에서 만나는 모서리는 AD, AE, BC, BF 이다.
3. 보기 중 이에 해당하는 것은 모서리 AE 이다.
- 작성자 답: ④ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「직육면체 $ABCD-EFGH」
**RPM** M1-RPM-179 [기본 도형 > 위치 관계 > 평면에서의 위치 관계 > 두 직선의 위치 관계] **원천→판정: 기본도형 > 위치 관계 > 공간에서의 위치 관계 > 다면체에서의 교선과 모서리의 만남 → 기본 도형 > 위치 관계 > 평면에서의 위치 관계 > 두 직선의 위치 관계**
- 이유: 공유 모서리 AB와 꼭짓점에서 만나는 모서리 AE 를 식별한다.
**유형** PT=PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS / TPL=TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_EDGE_FACE_INCIDENCE (원천과 같음) **원천→판정: TPL_M1_POLYHEDRON_EDGE_FACE_INTERSECTING_EDGES → TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_EDGE_FACE_INCIDENCE**
- 이유: 직육면체에서 두 면의 교선인 모서리 AB 와 한 점에서 만나는 모서리 AE 를 찾는 유형이다.
**난이도** 1 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 교선 AB를 구하고 꼭짓점 A에서 만나는 모서리 AE 를 바로 선택할 수 있다.

**4칸**
- given: 직육면체←stem:「직육면체 $ABCD-EFGH$에서」
- goal: 모서리←stem:「교선과 한 점에서 만나는 모서리는? [3점]」
- method: 교선(NAMED)←solution:「두 면의 교선은 두 면이 공유하는 모서리이다」
- condition: (없음)

**how** 교선이 모서리 AB임을 파악하고 한 점에서 만나는 모서리 AE를 정답으로 선택하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 면의 교선은 두 면이 공유하는 모서리이다. $$\begin{aligned} &\text{면 } ABCD\text{와 면 } ABFE\text{가 공유하는 모서리는 } \overline{AB}\text{이므로 두 면의 교선은 모서리 } AB\text{이다.} \ &\text{모서리 } AB\text{와 한 점에서 만나는 모서리는} \ &\text{점 } A\text{를 지나는 모서리 } AD, ; AE\text{와 점 } B\text{를 지나는 모서리 } BC, ; BF\text{의 } 4\text{개이다.} \ &\text{보기 중 이에 해당하는 모서리는 모서리 } AE\text{이다.} \ &\text{모서리 } CD\text{는 } AB\text{와 평행하고, 모서리 } CG, DH, GH\text{는 } AB\text{와 만나지 않는다.} \end{aligned}$$ 따라서 정답은 ④이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q17 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (RPM, TPL, 난이도)

**발문**

직선 위의 네 점 $A, B, C$에 대하여 점 $M$은 선분 $AC$의 중점이고, 점 $M'$은 선분 $AB$의 중점이다. 점들이 $A, M', M, B, C$의 순서로 놓여 있고 $\overline{M'M} : \overline{MB} = 4 : 3$, $\overline{M'M} = 12,\mathrm{cm}$일 때, 선분 $BC$의 길이는? [5점]

**보기** ① $24,\mathrm{cm}$  ② $26,\mathrm{cm}$  ③ $28,\mathrm{cm}$  ④ $30,\mathrm{cm}$  ⑤ $32,\mathrm{cm}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. M'M = 12 cm 이고 M'M : MB = 4 : 3 이므로 MB = 12 * 3/4 = 9 cm 이다.
2. M'B = 12 + 9 = 21 cm 이고 점 M'은 AB의 중점이므로 AM' = 21 cm, AB = 42 cm 이다.
3. 점 M은 AC의 중점이고 AM = AM' + M'M = 21 + 12 = 33 cm 이다.
4. AC = 2 * 33 = 66 cm 이므로 BC = AC - AB = 66 - 42 = 24 cm 이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「직선 위의 네 점 $A, B」
**RPM** M1-RPM-174 [기본 도형 > 기본 도형 > 점·선·면 > 두 점 사이의 거리와 중점] **원천→판정: 기본도형 > 기본도형 > 점, 선, 면 > 선분의 중점과 길이의 계산 → 기본 도형 > 기본 도형 > 점·선·면 > 두 점 사이의 거리와 중점**
- 이유: 비례식과 중점 성질을 단계적으로 적용하여 12 cm 로부터 BC의 길이를 구한다.
**유형** PT=PT_M1_SEGMENT_LENGTH_RELATIONS / TPL=TPL_M1_SEGMENT_LENGTH_RELATIONS_RATIO_AND_MIDPOINT (원천과 같음) **원천→판정: TPL_M1_SEGMENT_LENGTH_RELATIONS_NESTED_MIDPOINTS → TPL_M1_SEGMENT_LENGTH_RELATIONS_RATIO_AND_MIDPOINT**
- 이유: 선분의 중점 조건과 12 cm 및 4:3 비를 이용하여 선분 BC의 길이를 계산하는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 선분의 비례 배분과 두 번의 중점 조건을 적용하여 24 cm 를 계산한다. 12

**4칸**
- given: 중점←stem:「점 $M$은 선분 $AC$의 중점이고」
- goal: 선분←stem:「선분 $BC$의 길이는? [5점]」
- method: 길이(NAMED)←solution:「선분의 중점 성질과 주어진 길이의 비를」
- condition: (없음)

**how** M'M=12에서 MB=9를 얻고 중점 조건으로 AC=66, AB=42에서 BC=24cm를 구하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

선분의 중점 성질과 주어진 길이의 비를 이용하여 각 선분의 길이를 단계별로 구한다. $$\begin{aligned} &\overline{M'M} = 12,\mathrm{cm}\text{이고 } \overline{M'M} : \overline{MB} = 4 : 3\text{이므로} \ &\overline{MB} = 12 \times \dfrac{3}{4} = 9,\mathrm{cm} \ &\overline{M'B} = \overline{M'M} + \overline{MB} = 12 + 9 = 21,\mathrm{cm} \ &\text{점 } M'\text{은 선분 } AB\text{의 중점이므로 } \overline{AM'} = \overline{M'B} = 21,\mathrm{cm} \ &\overline{AB} = \overline{AM'} + \overline{M'B} = 21 + 21 = 42,\mathrm{cm} \ &\text{점 } M\text{은 선분 } AC\text{의 중점이고, } \overline{AM} = \overline{AM'} + \overline{M'M} = 21 + 12 = 33,\mathrm{cm}\text{이므로} \ &\overline{AC} = 2 \times \overline{AM} = 2 \times 33 = 66,\mathrm{cm} \ &\overline{BC} = \overline{AC} - \overline{AB} = 66 - 42 = 24,\mathrm{cm} \end{aligned}$$ 따라서 선분 $BC$의 길이는 $24,\mathrm{cm}$이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q18 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)
- ⚠ 풀이 과정에 정답 값이 등장하지 않음

**발문**

공간에서 서로 다른 두 직선 $l, m$과 서로 다른 두 평면 $\mathrm{P}, \mathrm{Q}$에 대하여, '㉠이면 항상 $l \perp \mathrm{P}$이다.'가 참이 되도록 하는 조건 ㉠으로 올바른 것은? [5점]

**보기** ① ㉠: $l \perp m$, $m \perp \mathrm{P}$  ② ㉠: $l \perp m$, $m \parallel \mathrm{P}$  ③ ㉠: $l \parallel m$, $m \parallel \mathrm{P}$  ④ ㉠: $l \parallel \mathrm{Q}$, $\mathrm{P} \perp \mathrm{Q}$  ⑤ ㉠: $l \perp \mathrm{Q}$, $\mathrm{P} \parallel \mathrm{Q}$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ⑤   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. aligned 모델 검토에 따라 공간에서 직선과 평면의 위치 관계를 점검한다.
2. ① m perp P, l perp m 이면 l은 P에 평행할 수 있다 (거짓).
3. ② m // P, l perp m 이면 l은 P에 평행할 수 있다 (거짓).
4. ③ m // P, l // m 이면 l은 P에 평행하다 (거짓).
5. ④ P perp Q, l // Q 이면 l은 P와 평행할 수 있다 (거짓).
6. ⑤ 평행한 두 평면 중 한 평면에 수직인 직선 l은 다른 평면과도 항상 수직이다 (참).
- 작성자 답: ⑤ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「공간에서 서로 다른 두 직선」
**RPM** M1-RPM-181 [기본 도형 > 위치 관계 > 공간에서의 위치 관계 > 직선과 평면의 위치 관계] **원천→판정: 기본도형 > 위치 관계 > 공간에서의 위치 관계 > 공간에서 직선과 평면의 위치 관계의 참·거짓 → 기본 도형 > 위치 관계 > 공간에서의 위치 관계 > 직선과 평면의 위치 관계**
- 이유: aligned 직육면체 모델을 이용하여 직선과 평면의 수직 전달 성질을 검증한다.
**유형** PT=PT_M1_SPATIAL_LINE_PLANE_RELATIONS / TPL=TPL_M1_SPATIAL_LINE_PLANE_RELATIONS_LINE_PLANE_NORMAL_TRANSFER (원천과 같음) **원천→판정: TPL_M1_SPATIAL_LINE_PLANE_RELATIONS_LOGICAL_DEDUCTION → TPL_M1_SPATIAL_LINE_PLANE_RELATIONS_LINE_PLANE_NORMAL_TRANSFER**
- 이유: aligned 수직 전달 원리에 따라 공간에서 직선과 평면의 위치 관계를 판별하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: aligned 공간에서 직선과 평면의 다양한 위치 관계의 반례를 점검해야 한다.

**4칸**
- given: 직선←stem:「공간에서 서로 다른 두 직선 $l, m$」
- goal: 조건←stem:「참이 되도록 하는 조건 ㉠으로 올바른 것은? [5점]」
- method: 평면(NAMED)←solution:「공간에서 직선과 평면의 위치 관계의 참·거짓은」
- condition: (없음)

**how** aligned 검토를 통해 한 평면에 수직인 직선은 평행한 다른 평면에도 수직임을 확인하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

공간에서 직선과 평면의 위치 관계의 참·거짓은 직육면체를 모델로 하여 반례를 찾아 검증한다. $$\begin{aligned} &\text{① } m \perp \mathrm{P}\text{이고 } l \perp m\text{이면 직선 } l\text{은 평면 } \mathrm{P}\text{에 평행하거나 포함될 수 있으므로 } l \perp \mathrm{P}\text{가 아니다.} \ &\text{② } m \parallel \mathrm{P}\text{이고 } l \perp m\text{이면 직선 } l\text{은 평면 } \mathrm{P}\text{와 수직일 수도 있지만 평행할 수도 있다.} \ &\text{③ } m \parallel \mathrm{P}\text{이고 } l \parallel m\text{이면 직선 } l\text{은 평면 } \mathrm{P}\text{에 평행하거나 포함된다.} \ &\text{④ } \mathrm{P} \perp \mathrm{Q}\text{이고 } l \parallel \mathrm{Q}\text{이면 } l\text{은 } \mathrm{P}\text{와 평행하거나 비스듬히 만날 수 있다.} \ &\text{⑤ 서로 평행한 두 평면 } \mathrm{P}, \mathrm{Q}\text{ 중 한 평면 } \mathrm{Q}\text{에 수직인 직선 } l\text{은 다른 평면 } \mathrm{P}\text{와도 항상 수직이다. (참)} \end{aligned}$$ 따라서 항상 참인 것은 ⑤이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q19 — 객관식 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

직육면체 $ABCD-EFGH$에서 모서리 $AB$와 꼬인 위치에 있는 모서리의 개수를 $x$, 삼각기둥 $ABC-DEF$에서 밑면 $DEF$와 평행한 모서리의 개수를 $y$라 할 때, $x, y$의 값을 순서대로 올바르게 나타낸 것은? [4점]

**보기** ① $4$개, $3$개  ② $4$개, $4$개  ③ $3$개, $3$개  ④ $3$개, $4$개  ⑤ $4$개, $2$개

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ①   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 직육면체에서 모서리 AB와 꼬인 위치에 있는 모서리는 CG, DH, EH, FG 의 4개이다 (x = 4).
2. 삼각기둥에서 밑면 DEF와 평행한 모서리는 윗면의 세 변인 AB, BC, CA 의 3개이다 (y = 3).
3. 따라서 순서대로 4개, 3개이다.
- 작성자 답: ① → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-POSITION_RELATION(위치 관계) (원천과 같음) (원천과 같음)
- 근거 인용: 「직육면체 $ABCD-EFGH」
**RPM** M1-RPM-181 [기본 도형 > 위치 관계 > 공간에서의 위치 관계 > 직선과 평면의 위치 관계] **원천→판정: 기본도형 > 위치 관계 > 공간에서의 위치 관계 > 꼬인 위치와 직선과 평면의 평행 → 기본 도형 > 위치 관계 > 공간에서의 위치 관계 > 직선과 평면의 위치 관계**
- 이유: 공간 도형에서 모서리 AB와의 꼬인 위치 및 평행 모서리 수를 구한다.
**유형** PT=PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS / TPL=TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_SKEW_AND_FACE_COUNT (원천과 같음) **원천→판정: TPL_M1_POLYHEDRON_EDGE_FACE_SKEW_PARALLEL_COUNT → TPL_M1_POLYHEDRON_EDGE_FACE_RELATIONS_SKEW_AND_FACE_COUNT**
- 이유: 직육면체의 꼬인 위치 모서리 AB 기준 개수와 삼각기둥의 면 평행 모서리를 세는 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 모서리 AB와 만나지도 평행하지도 않은 꼬인 위치 4개와 평행 3개를 정확히 센다.

**4칸**
- given: 직육면체←stem:「직육면체 $ABCD-EFGH$에서 모서리 $AB$와」
- goal: 꼬인위치←stem:「모서리 $AB$와 꼬인 위치에 있는 모서리의 개수를 $x$」
- method: 평행(NAMED)←solution:「공간에서 만나지도 않고 평행하지도 않은」
- condition: (없음)

**how** 직육면체 꼬인 위치 x=4와 삼각기둥 평행 모서리 y=3을 각각 구하였다. AB

<details><summary>저장 해설 (판정 검토용)</summary>

꼬인 위치는 공간에서 만나지도 않고 평행하지도 않은 두 직선의 위치 관계이다. $$\begin{aligned} &1); \text{직육면체 } ABCD-EFGH\text{에서 모서리 } AB\text{와} \ &\text{한 점에서 만나는 모서리: } AD, ; AE, ; BC, ; BF ; (4\text{개}) \ &\text{평행한 모서리: } CD, ; EF, ; GH ; (3\text{개}) \ &\text{따라서 모서리 } AB\text{와 꼬인 위치에 있는 모서리는 } CG, ; DH, ; EH, ; FG\text{의 } 4\text{개이다.} \implies x = 4 \ &2); \text{삼각기둥 } ABC-DEF\text{에서 밑면 } DEF\text{와} \ &\text{평행한 모서리는 마주 보는 밑면 } ABC\text{의 세 변인 } AB, ; BC, ; CA\text{뿐이다.} \ &\text{옆모서리 } AD, ; BE, ; CF\text{는 면 } DEF\text{와 한 점에서 만나고, 밑면의 세 모서리는 면에 포함된다.} \ &\implies y = 3 \end{aligned}$$ 따라서 순서대로 $4$개, $3$개이므로 정답은 ①이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q20 — 객관식 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)

**발문**

반비례 관계 $y=\dfrac{18}{x}$의 그래프와 정비례 관계 $y=ax$의 그래프가 만나는 교점의 좌표는 $A(3, k)$이다. 점 $B, C$는 각각 정비례 관계 $y=-x$, $y=cx$의 그래프 위의 점이면서 세 점 $A, B, C$의 $x$좌표가 모두 $3$으로 한 직선 위에 놓여 있다. $\triangle AOB$의 넓이가 $\triangle AOC$의 넓이의 $\dfrac{1}{2}$배이고 점 $C$가 점 $B$보다 아래쪽에 위치할 때, 상수 $c$의 값은? (단, 점 $O$는 원점이다.) [5점]

**보기** ① $-3$  ② $-4$  ③ $-5$  ④ $-6$  ⑤ $-7$

> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** ②   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 A(3, k)가 y = 18/x 위의 점이므로 k = 18/3 = 6, 즉 A(3, 6)이다.
2. B는 y = -x 위의 점이므로 B(3, -3)이다.
3. C는 y = cx 위의 점이므로 C(3, 3c)이다.
4. 직선 x=3 위에서 AB = 6 - (-3) = 9 이므로 삼각형 AOB = 1/2 * 9 * 3 = 27/2 이다.
5. 삼각형 AOC = 2 * (27/2) = 27 이므로 1/2 * AC * 3 = 27 에서 AC = 18 이다.
6. C는 B보다 아래쪽에 있으므로 y좌표는 6 - 18 = -12 이고 3c = -12 에서 c = -4 이다.
- 작성자 답: ② → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) **원천→판정: M1-04-COORDINATE_PLANE → M1-04-GRAPH_RELATION**
- 근거 인용: 「반비례 관계 $y=\dfra」
**RPM** M1-RPM-171 [좌표평면과 그래프 > 정비례와 반비례 > 관계 해석 > 그래프에서 식 구하기] **원천→판정: 좌표평면과 그래프 > 정비례와 반비례 > 정비례와 반비례의 활용 > 그래프와 도형의 넓이 → 좌표평면과 그래프 > 정비례와 반비례 > 관계 해석 > 그래프에서 식 구하기**
- 이유: y=18/x 교점 A(3, 6)과 공통 밑변 직선 위의 삼각형 넓이 비를 활용한다.
**유형** PT=PT_M1_COORDINATE_COMPOSITE_AREA / TPL=TPL_M1_COORDINATE_COMPOSITE_AREA_GRAPH_AREA_RATIO (원천과 같음) **원천→판정: TPL_M1_COORDINATE_COMPOSITE_AREA_VERTICAL_SEGMENT → TPL_M1_COORDINATE_COMPOSITE_AREA_GRAPH_AREA_RATIO**
- 이유: 반비례 y=18/x 와 정비례 교점 좌표 및 삼각형의 넓이 비를 이용해 상수 c 를 결정하는 유형이다.
**난이도** 3 (confidence=high, 경계=NONE) **원천→판정: 4 → 3**
- 이유: 반비례식 18/x 에서 A를 구하고 밑변 길이 비로 C의 y좌표 -12를 구해 c=-4를 도출한다.

**4칸**
- given: 반비례←stem:「반비례 관계 $y=\dfrac{18}{x}$의 그래프와」
- goal: 넓이←stem:「상수 $c$의 값은? (단, 점 $O$는 원점이다.) [5점]」
- method: 교점(NAMED)←solution:「공통 높이를 갖는 두 삼각형의 넓이 비를 이용한다」
- condition: (없음)

**how** A(3,6), B(3,-3)에서 넓이 비로 C(3,-12)를 찾아 c=-4를 계산하였다. 18

<details><summary>저장 해설 (판정 검토용)</summary>

좌표평면 위의 점의 좌표를 구하고, 공통 높이를 갖는 두 삼각형의 넓이 비를 이용한다. $$\begin{aligned} &\text{점 } A(3, k)\text{가 } y=\dfrac{18}{x}\text{ 위의 점이므로 } k = \dfrac{18}{3} = 6 \implies A(3, 6) \ &\text{세 점 } A, B, C\text{의 } x\text{좌표가 모두 } 3\text{이므로} \ &\text{점 } B\text{는 } y=-x\text{ 위의 점이므로 } B(3, -3) \ &\text{점 } C\text{는 } y=cx\text{ 위의 점이므로 } C(3, 3c) \ &\triangle AOB\text{와 } \triangle AOC\text{는 직선 } x=3\text{ 위의 선분을 밑변으로 볼 때 높이가 모두 원점에서 직선까지의 거리인 } 3\text{이다.} \ &\overline{AB} = 6 - (-3) = 9 \implies \triangle AOB = \dfrac{1}{2} \times 9 \times 3 = \dfrac{27}{2} \ &\triangle AOB = \dfrac{1}{2}\triangle AOC \implies \triangle AOC = 2 \times \dfrac{27}{2} = 27 \ &\dfrac{1}{2} \times \overline{AC} \times 3 = 27 \implies \overline{AC} = 18 \ &\text{점 } C\text{가 점 } B\text{보다 아래쪽에 있으므로 } C\text{의 } y\text{좌표는 } 6 - 18 = -12 \ &3c = -12 \implies c = -4 \end{aligned}$$ 따라서 상수 $c$의 값은 $-4$이므로 정답은 ②이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q21 — 서술형 4점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 2개 (RPM, TPL)

**발문**

두 직선이 한 점에서 만날 때 생기는 맞꼭지각의 크기가 각각 $(2x + 15)^\circ$, $(4x - 17)^\circ$이고, 이 중 한 각과 한 직선 위에서 이웃한 각의 크기가 $(3y + 13)^\circ$이다. 이때 $x$의 값과 $y$의 값을 각각 구하고, 그 과정을 서술하시오. [4점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $x = 16$, $y = 40$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 맞꼭지각의 크기는 서로 같으므로 2x + 15 = 4x - 17 이다.
2. 2x = 32 이므로 x = 16 이다.
3. 이 각의 크기는 2*16 + 15 = 47도이다.
4. 한 직선 위에서 이웃한 두 각의 합은 180도이므로 (3y + 13) + 47 = 180 이다.
5. 3y = 120 이므로 y = 40 이다.
- 작성자 답: $x = 16$, $y = 40$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) (원천과 같음)
- 근거 인용: 「두 직선이 한 점에서 만날」
**RPM** M1-RPM-176 [기본 도형 > 기본 도형 > 각 > 맞꼭지각] **원천→판정: 기본도형 > 기본도형 > 점, 선, 면 > 맞꼭지각과 평각을 이용한 각의 계산 → 기본 도형 > 기본 도형 > 각 > 맞꼭지각**
- 이유: 맞꼭지각이 같음을 이용해 x를 구하고 180도 보각으로 y를 구한다.
**유형** PT=PT_M1_INTERSECTING_ANGLE_RELATIONS / TPL=TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_EQUATION (원천과 같음) **원천→판정: TPL_M1_INTERSECTING_ANGLE_RELATIONS_LINEAR_SYSTEM → TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_EQUATION**
- 이유: 맞꼭지각과 편각 180도 방정식을 세워 미지수 x, y 를 각각 구하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: 맞꼭지각 일치 식과 편각의 합 180도 식을 순차적으로 세워 x=16, y=40을 도출한다.

**4칸**
- given: 맞꼭지각←stem:「맞꼭지각의 크기가 각각 $(2x + 15)^\circ$」
- goal: 직선←stem:「$x$의 값과 $y$의 값을 각각 구하고, 그 과정을 서술하시오.」
- method: 이웃(NAMED)←solution:「한 직선 위에서 이웃한 두 각의 크기의 합은」
- condition: (없음)

**how** 맞꼭지각에서 x=16을 구하고 47도의 보각 133도에서 y=40을 도출하였다. 180

<details><summary>저장 해설 (판정 검토용)</summary>

맞꼭지각의 크기는 서로 같고, 한 직선 위에서 이웃한 두 각의 크기의 합은 $180^\circ$이다. $$\begin{aligned} &\text{[1단계: } x\text{의 값 구하기]} \ &\text{맞꼭지각의 크기는 서로 같으므로} \ &2x + 15 = 4x - 17 \ &2x = 32 \implies x = 16 \ &\text{이때 이 각의 크기는 } 2 \times 16 + 15 = 47^\circ\text{이다.} \ &\text{[2단계: } y\text{의 값 구하기]} \ &\text{한 직선 위에서 이웃한 두 각의 크기의 합은 } 180^\circ\text{이므로} \ &(3y + 13) + 47 = 180 \ &3y + 60 = 180 \ &3y = 120 \implies y = 40 \end{aligned}$$ 따라서 $x = 16$, $y = 40$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q22 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)

**발문**

넓이가 $25$인 정사각형 $ABCD$의 꼭짓점 $A$는 정비례 관계 $y=ax$의 그래프 위에 있고, 꼭짓점 $B$는 반비례 관계 $y=\dfrac{b}{x}$의 그래프 위에 있다. 점 $D$의 좌표가 $(-1, -2)$이고 점 $A$와 점 $D$의 $y$좌표가 같으며 점 $A$가 점 $D$의 왼쪽에 있을 때, 상수 $a, b$에 대하여 $ab$의 값을 구하고 그 과정을 서술하시오. (단, 정사각형의 모든 변은 좌표축과 평행하다.) [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $14$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 정사각형 ABCD의 넓이가 25이므로 한 변의 길이는 5이다.
2. 점 D(-1, -2)이고 A는 D의 왼쪽이므로 A(-1-5, -2) = A(-6, -2)이다.
3. 점 B는 A에서 아래로 5만큼 이동하므로 B(-6, -7)이다.
4. A(-6, -2)가 y=ax 위의 점이므로 -2 = -6a 에서 a = 1/3 이다.
5. B(-6, -7)이 y=b/x 위의 점이므로 -7 = b/(-6) 에서 b = 42 이다.
6. 따라서 ab = 1/3 * 42 = 14 이다.
- 작성자 답: $14$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-04(좌표평면과 그래프) / M1-04-GRAPH_RELATION(그래프와 관계) (원천과 같음) **원천→판정: M1-04-COORDINATE_PLANE → M1-04-GRAPH_RELATION**
- 근거 인용: 「넓이가 $25$인 정사각형」
**RPM** M1-RPM-171 [좌표평면과 그래프 > 정비례와 반비례 > 관계 해석 > 그래프에서 식 구하기] **원천→판정: 좌표평면과 그래프 > 정비례와 반비례 > 정비례와 반비례의 활용 > 도형과 그래프 위의 점의 좌표 → 좌표평면과 그래프 > 정비례와 반비례 > 관계 해석 > 그래프에서 식 구하기**
- 이유: 정사각형 25 변의 길이 5로부터 점 A, B를 구하고 함수식에 대입한다.
**유형** PT=PT_M1_SQUARE_COORDINATES_AND_GRAPH_COEFFICIENTS / TPL=TPL_M1_SQUARE_COORDINATES_AND_GRAPH_COEFFICIENTS_CORE (원천과 같음) **원천→판정: TPL_M1_SQUARE_COORDINATES_AND_GRAPH_COEFFICIENTS_STANDARD → TPL_M1_SQUARE_COORDINATES_AND_GRAPH_COEFFICIENTS_CORE**
- 이유: 정사각형 넓이 25 로부터 꼭짓점 좌표를 복원하고 정비례, 반비례 계수의 곱을 구하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 넓이 25 에서 변의 길이 5를 얻고 점 A(-6,-2), B(-6,-7)을 대입해 ab=14를 구한다.

**4칸**
- given: 정사각형←stem:「넓이가 $25$인 정사각형 $ABCD$의」
- goal: 상수←stem:「상수 $a, b$에 대하여 $ab$의 값을 구하고 그 과정을 서술하시오」
- method: 정비례(NAMED)←solution:「꼭짓점의 좌표를 결정한 뒤 각 함수식에 대입한다」
- condition: (없음)

**how** 한 변이 5임을 이용해 A(-6,-2), B(-6,-7)을 찾고 a=1/3, b=42에서 ab=14를 계산하였다. 25

<details><summary>저장 해설 (판정 검토용)</summary>

정사각형의 한 변의 길이를 구하여 꼭짓점의 좌표를 결정한 뒤 각 함수식에 대입한다. $$\begin{aligned} &\text{[1단계: 정사각형의 한 변의 길이와 점 } A, B\text{의 좌표 구하기]} \ &\text{정사각형 } ABCD\text{의 넓이가 } 25\text{이므로 한 변의 길이는 } 5\text{이다.} \ &\text{점 } A\text{와 점 } D\text{의 } y\text{좌표가 같고 점 } A\text{가 점 } D(-1, -2)\text{의 왼쪽에 있으므로} \ \&A(-1 - 5, -2) \implies A(-6, -2) \ &\text{점 } B\text{는 점 } A\text{에서 아래로 } 5\text{만큼 떨어진 위치이므로} \ \&B(-6, -2 - 5) \implies B(-6, -7) \ &\text{[2단계: 상수 } a, b\text{의 값 구하기]} \ &\text{점 } A(-6, -2)\text{가 } y=ax\text{ 위의 점이므로} \ &-2 = a \times (-6) \implies a = \dfrac{1}{3} \ &\text{점 } B(-6, -7)\text{가 } y=\dfrac{b}{x}\text{ 위의 점이므로} \ &-7 = \dfrac{b}{-6} \implies b = 42 \ &\text{[3단계: } ab\text{의 값 계산]} \ \&ab = \dfrac{1}{3} \times 42 = 14 \end{aligned}$$ 따라서 $ab = 14$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q23 — 서술형 6점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 3개 (소단원, RPM, TPL)

**발문**

지점 $A$에서 강 건너에 있는 지점 $B$까지의 거리를 알아보기 위해 측량을 진행하였다. 선분 $AD$와 선분 $BC$의 교점을 $O$라 할 때, $\overline{AO} = \overline{DO}$, $\overline{BO} = \overline{CO}$가 되도록 평지 위에 두 지점 $C, D$를 정하였다. 지점 $C$와 지점 $D$ 사이의 거리를 측정한 값이 $15,\mathrm{km}$일 때, 지점 $A$에서 지점 $B$까지의 거리를 구하고 이용된 삼각형의 합동 조건을 포함하여 서술하시오. [6점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $15,\mathrm{km}$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 삼각형 OAB와 ODC에서 AO = DO (조건), BO = CO (조건) 이다.
2. 각 AOB = 각 DOC (맞꼭지각) 이므로 두 삼각형은 SAS 합동이다.
3. 합동인 두 삼각형에서 대응변의 길이는 같으므로 AB = DC = 15 km 이다.
- 작성자 답: $15,\mathrm{km}$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) **원천→판정: M1-05-POSITION_RELATION → M1-05-BASIC_FIGURE**
- 근거 인용: 「지점 $A$에서 강 건너에」
**RPM** M1-RPM-192 [기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동] **원천→판정: 기본도형 > 작도와 합동 > 도형의 합동 > 삼각형의 합동의 실생활 활용 → 기본 도형 > 작도와 합동 > 삼각형의 합동 > SAS 합동**
- 이유: 맞꼭지각과 두 변 조건을 결합하여 SAS 합동을 서술하고 거리를 구한다.
**유형** PT=PT_M1_CONGRUENCE_DATA_TRANSFER / TPL=TPL_M1_CONGRUENCE_DATA_TRANSFER_DISTANCE_MEASUREMENT_SAS (원천과 같음) **원천→판정: TPL_M1_CONGRUENCE_DATA_TRANSFER_DISTANCE_MEASUREMENT → TPL_M1_CONGRUENCE_DATA_TRANSFER_DISTANCE_MEASUREMENT_SAS**
- 이유: 측량 상황에서 SAS 합동을 증명하고 15 km 대응변 길이를 전달하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) (원천과 같음)
- 이유: AO=DO, BO=CO와 맞꼭지각으로 SAS 합동을 보이고 AB=15km를 결론짓는다.

**4칸**
- given: 교점←stem:「선분 $AD$와 선분 $BC$의 교점을 $O$라 할 때」
- goal: 합동←stem:「이용된 삼각형의 합동 조건을 포함하여 서술하시오. [6점]」
- method: 대응변(NAMED)←solution:「두 삼각형의 합동 조건을 밝혀 대응변의 길이가 같음을 보인다」
- condition: (없음)

**how** 맞꼭지각과 두 변의 길이가 같아 SAS 합동임을 서술하고 대응변 AB=15km를 구하였다.

<details><summary>저장 해설 (판정 검토용)</summary>

두 삼각형의 합동 조건을 밝혀 대응변의 길이가 같음을 보인다. $$\begin{aligned} &\text{[1단계: 삼각형의 합동 증명]} \ &\triangle OAB\text{와 } \triangle ODC\text{에서} \ &\overline{AO} = \overline{DO} ; (\text{조건}) \ &\overline{BO} = \overline{CO} ; (\text{조건}) \ &\angle AOB = \angle DOC ; (\text{맞꼭지각}) \ &\text{따라서 두 쌍의 대응변의 길이가 각각 같고 그 끼인각의 크기가 같으므로} \ &\triangle OAB \equiv \triangle ODC ; (\mathrm{SAS}\text{ 합동}) \ &\text{[2단계: 거리 계산]} \ &\text{합동인 두 삼각형에서 대응변의 길이는 서로 같으므로} \ &\overline{AB} = \overline{DC} = 15,\mathrm{km} \end{aligned}$$ 따라서 지점 $A$에서 지점 $B$까지의 거리는 $15,\mathrm{km}$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---

## Q24 — 서술형 5점  ⚠ 먼저 볼 문항
- ⚠ 원천 값과 다른 칸 4개 (소단원, RPM, TPL, 난이도)

**발문**

직사각형 모양의 종이를 선분 $EF$를 접는 선으로 하여 접었을 때, 점 $E$는 변 $AD$ 위에 있고 점 $F$는 변 $BC$ 위에 있다. $\angle AEF = 124^\circ$일 때, 접혀서 겹쳐진 삼각형에서 생기는 각 $\angle x$의 크기를 구하고 그 과정을 서술하시오. (단, $\angle x$는 접힌 선분 $FG$와 변 $AD$의 교점 $I$에서의 각 $\angle EIF$이다.) [5점]


> 검수자: 여기까지만 보고 먼저 풀어 `review.reviewerSolvedAnswer` 에 적은 뒤 아래를 읽으세요.

**저장 정답** $68^\circ$   |   그림 파일(image): 없음 (plan 있음)

**작성자의 풀이 과정**
1. 점 E에서 각 FED = 180 - 124 = 56도이다.
2. AD // BC 이므로 엇각에 의해 각 EFB = 각 FED = 56도이다.
3. 접은 각의 성질에 의해 각 EFI = 각 EFB = 56도, 각 FEI = 각 FED = 56도이다.
4. 삼각형 EFI에서 세 내각의 합은 180도이므로 각 x = 180 - (56 + 56) = 68도이다.
- 작성자 답: $68^\circ$ → 저장 정답과 일치 (작성자 보고 answerMatches=true)

**그림 판단** NONE — (근거 없음)

**단원** M1-05(기본도형) / M1-05-BASIC_FIGURE(점·선·면과 각) (원천과 같음) **원천→판정: M1-05-POSITION_RELATION → M1-05-BASIC_FIGURE**
- 근거 인용: 「직사각형 모양의 종이를 선분」
**RPM** M1-RPM-177 [기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각] **원천→판정: 기본도형 > 위치 관계 > 평행선의 성질 > 직사각형 종이접기에서의 각의 크기 → 기본 도형 > 기본 도형 > 평행선과 각 > 동위각·엇각**
- 이유: 평행선 엇각과 접은 각이 같음을 이용해 56도를 옮기고 각 x를 계산한다.
**유형** PT=PT_MOVE_FOLDING_REFLECTION / TPL=TPL_MOVE_FOLDING_REFLECTION_CORE (원천과 같음) **원천→판정: TPL_MOVE_FOLDING_REFLECTION_RECTANGLE_TAPE → TPL_MOVE_FOLDING_REFLECTION_CORE**
- 이유: 직사각형 접기에서 124도 편각과 엇각 및 접은 각의 성질로 삼각형 내각을 구하는 서술형 유형이다.
**난이도** 2 (confidence=high, 경계=NONE) **원천→판정: 3 → 2**
- 이유: 124도에서 편각 56도를 구하고 접은 각 및 엇각으로 이등변삼각형 내각합을 적용한다.

**4칸**
- given: 직사각형←stem:「직사각형 모양의 종이를 선분 $EF$를 접는 선으로 하여 접었을 때」
- goal: 삼각형←stem:「생기는 각 $\angle x$의 크기를 구하고 그 과정을 서술하시오」
- method: 평행(NAMED)←solution:「직사각형의 마주 보는 두 변은 서로 평행하다」
- condition: (없음)

**how** 편각 56도와 접은 각 56도를 찾아 삼각형 내각합에서 180-112=68도를 계산하였다. 124

<details><summary>저장 해설 (판정 검토용)</summary>

접은 각의 크기는 접기 전의 각의 크기와 같고, 직사각형의 마주 보는 두 변은 서로 평행하다. $$\begin{aligned} &\text{[1단계: } \angle FED\text{와 } \angle EFB\text{의 크기 구하기]} \ &\text{점 } E\text{는 선분 } AD\text{ 위의 점이므로} \ &\angle FED = 180^\circ - 124^\circ = 56^\circ \ &\overline{AD} \parallel \overline{BC}\text{이므로 엇각의 크기가 같아} \ &\angle EFB = \angle FED = 56^\circ \ &\text{[2단계: 접은 각의 성질과 } \triangle EFI\text{의 내각 계산]} \ &\text{종이를 접었으므로 접은 각의 크기는 같아} \ &\angle EFI = \angle EFB = 56^\circ, \quad \angle FEI = \angle FED = 56^\circ \ &\triangle EFI\text{에서 세 내각의 크기의 합은 } 180^\circ\text{이므로} \ &\angle x = 180^\circ - (\angle FEI + \angle EFI) = 180^\circ - (56^\circ + 56^\circ) = 180^\circ - 112^\circ = 68^\circ \end{aligned}$$ 따라서 $\angle x = 68^\circ$이다.

</details>

**검수 기록 칸 (현재 값)** reviewerSolvedAnswer=``  verdict=``  fixes=0건

---
