# 2025 효천고 고1 2학기 중간고사 — 심층 감사 (AUDIT_DRAFT_COMPLETE / VISUAL_HOLD)

> **현행 판정(2026-11-22 시각 자료 재검증 우선):** 원문 23/23 판독, KEEP 23, UPGRADE 0, HOLD 0, UNREAD 0. 이전 「VISUAL_HOLD/미판독/IN_PROGRESS」와 중간 수치는 당시 감사 스냅샷이며, 아래 문항별 후속 판정 및 [이미지 대조 기록](LANE40_VISUAL_SOURCE_QA_20261122.md)이 최신이다. 학생 화면 통합 렌더·Golden/Negative·출고 검증: **NOT_RUN / PASS 아님**.


- lane40 / 공통수학2 / original / 2mid / 2025
- sourcePath: archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js
- sourceBlobSha: 144b5b81770601f624355e333da25ebcda555610; total: 23; read: 23; KEEP: 22; UPGRADE: 0; HOLD: 1; UNREAD: 0; nextQid: NONE
- Golden/Negative calibration formal gate, visual QA and render: NOT_RUN. Release PASS not claimed.

## Q1 — KEEP

- identity: `NOT_PRESENT`; ordinal 1; blob `144b5b81770601f624355e333da25ebcda555610`
- 문제: 좌표평면 위의 두 점 $A(-2,5)$, $B(3,0)$이 있다. 두 점 $A$, $B$ 사이의 거리는? [3.1점]
- 보기: ["$2\\sqrt5$","$5$","$5\\sqrt2$","$10$","$10\\sqrt2$"]; 정답: ③
- 기존 solution 핵심 원문: `$=\sqrt{5^2+(-5)^2}$` / `$=\sqrt{25+25}$` / `$=\sqrt{50}$` / `$=5\sqrt2$이다.` / `따라서 정답은 ③이다.`
- 판정 및 독립 검산: x차 3-(-2)=5, y차 0-5=-5를 제곱하여 √(25+25)=5√2. 원문이 중간 등호를 모두 보이고 답 ③ 일치.
- 그림: 없음; 해설 그림: assets/images/25_효천고_2학기_중간_고1_기출/q1-solution.svg; 시각 QA NOT_RUN.

## Q2 — KEEP

- identity: `NOT_PRESENT`; ordinal 2; blob `144b5b81770601f624355e333da25ebcda555610`
- 문제: 두 직선 $x+3y+2=0$, $kx-2y-1=0$이 서로 수직일 때, 실수 $k$의 값은? [3.1점]
- 보기: ["$6$","$8$","$10$","$12$","$14$"]; 정답: ①
- 기존 solution 핵심 원문: `두 직선이 수직이므로` / `$-\dfrac13\cdot\dfrac{k}{2}=-1$이다.` / `$-\dfrac{k}{6}=-1$` / `$k=6$이다.` / `따라서 정답은 ①이다.`
- 판정 및 독립 검산: 첫째 기울기 -1/3, 둘째 k/2. 수직 조건 (-1/3)(k/2)=-1→-k/6=-1→k=6. 독립 기울기 -1/3과 3의 곱 -1.
- 그림: 없음; 해설 그림: assets/images/25_효천고_2학기_중간_고1_기출/q2-solution-v2.svg; 시각 QA NOT_RUN.

## Q3 — KEEP

- identity: `NOT_PRESENT`; ordinal 3; blob `144b5b81770601f624355e333da25ebcda555610`
- 문제: 원의 방정식 $x^2+y^2+2x-6y+6=0$의 중심 좌표와 반지름의 길이를 순서대로 올바르게 쓴 것은? [3.2점]
- 보기: ["$(-1,3),\\ 2$","$(-1,3),\\ 4$","$(1,-3),\\ 2$","$(1,-3),\\ 4$","$(1,3),\\ 4$"]; 정답: ①
- 기존 solution 핵심 원문: `$(x-a)^2+(y-b)^2=r^2$` / `과 비교하면` / `$a=-1$, $b=3$, $r=2$이다.` / `따라서 중심은 $(-1,3)$이고 반지름의 길이는 $2$이다.` / `따라서 정답은 ①이다.`
- 판정 및 독립 검산: x²+2x=(x+1)²-1, y²-6y=(y-3)²-9를 직접 써서 중심(-1,3), r=2. 독립 전개 (x+1)²+(y-3)²=4 원식과 동일.
- 그림: 없음; 해설 그림: assets/images/25_효천고_2학기_중간_고1_기출/q3-solution-v2.svg; 시각 QA NOT_RUN.

## Q4 — KEEP

- identity: `NOT_PRESENT`; ordinal 4; blob `144b5b81770601f624355e333da25ebcda555610`
- 문제: 원 $x^2+y^2=5$에 접하고 기울기가 $1$인 두 직선이 $y$축과 만나는 점을 각각 $A$, $B$라 할 때, $\overline{AB}$의 길이는? [3.4점]
- 보기: ["$\\sqrt2$","$\\sqrt5$","$\\sqrt{10}$","$2\\sqrt5$","$2\\sqrt{10}$"]; 정답: ⑤
- 기존 solution 핵심 원문: `$B=(0,-\sqrt{10})$이다.` / `두 점은 같은 $y$축 위에 있으므로` / `$\overline{AB}=\sqrt{10}-(-\sqrt{10})$` / `$=2\sqrt{10}$이다.` / `따라서 정답은 ⑤이다.`
- 판정 및 독립 검산: 접선 y=x+b에서 중심-직선 거리 |b|/√2=√5→b=±√10. y절편 사이 거리 2√10. 두 부호를 원문이 명시하므로 KEEP.
- 그림: 없음; 해설 그림: assets/images/25_효천고_2학기_중간_고1_기출/q4-solution-v2.svg; 시각 QA NOT_RUN.

## Q5 — KEEP

- identity: `NOT_PRESENT`; ordinal 5; blob `144b5b81770601f624355e333da25ebcda555610`
- 문제: 두 집합 $A=\{3,\ 2a,\ b-4\}$, $B=\{3a,\ 4,\ 2\}$에 대하여 $A=B$일 때, $a+b$의 값은? (단, $a,b$는 상수) [3.4점]
- 보기: ["$9$","$10$","$11$","$12$","$13$"]; 정답: ①
- 기존 solution 핵심 원문: `$b-4=4$` / `$b=8$이다.` / `따라서` / `$a+b=1+8=9$이다.` / `따라서 정답은 ①이다.`
- 판정 및 독립 검산: 3∈A이므로 3a=3→a=1, A={3,2,b-4}, B={3,4,2}에서 b-4=4→b=8, 합9. 집합의 중복 원소 가능성도 B의 3,4,2가 서로 달라 배제됨.
- 그림: 없음; 해설 그림: 없음; 시각 QA NOT_RUN.

## Q6 — KEEP

- identity: `NOT_PRESENT`; ordinal 6; blob `144b5b81770601f624355e333da25ebcda555610`
- 문제: 방정식 $x^2+y^2-kx+2y+2k+1=0$이 나타내는 도형이 원이 되도록 하는 실수 $k$의 값의 범위는? [3.5점]
- 보기: ["$1<k<8$","$0<k<4$","$k<0$ 또는 $k>8$","$k<1$ 또는 $k>8$","$k<0$ 또는 $k>4$"]; 정답: ③
- 기존 solution 핵심 원문: `$k(k-8)>0$이다.` / `경계값 $0$, $8$을 기준으로 부호를 판단하면` / `$k<0$ 또는 $k>8$이다.` / `$k=0$ 또는 $k=8$이면 반지름이 $0$이 되어 원이 아니라 한 점만 남으므로 포함하지 않는다.` / `따라서 정답은 ③이다.`
- 판정 및 독립 검산: 완전제곱 r²=k(k-8)/4, 실제 원 조건 r²>0→k<0 또는 k>8. k=0,8은 한 점이라는 경계까지 원문에 있음. 독립 부호표 검산.
- 그림: 없음; 해설 그림: assets/images/25_효천고_2학기_중간_고1_기출/q6-solution-v2.svg; 시각 QA NOT_RUN.

## 재개

Q7–Q23 기록은 아래에 추가. Q13 원본 문제 그림 판독이 남아 VISUAL_HOLD. 학생용 출고/Golden/Negative/렌더 PASS 아님.

## Q7–Q23 원본 재개 심층 판정 (2026-11-21)

### Q7 — KEEP

- source ordinal/id: 7; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 평행한 두 직선 $2x-y+1=0$, $2x-y+k=0$ 사이의 거리가 $\sqrt5$가 되도록 하는 모든 실수 $k$의 값의 곱은? [3.7점]
- 보기: ["$12$","$24$","$-12$","$-24$","$-36$"]; 정답: ④.
- 기존 solution 직접 인용: $2x-y+1=0$, / $2x-y+k=0$ / 은 $x$, $y$의 계수가 같으므로 서로 평행하다.
- 판정/독립 검산: 거리 |k-1|/√5=√5→|k-1|=5→k=6,-4, 곱 -24; 절댓값 양쪽 부호를 모두 처리.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q7-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q8 — KEEP

- source ordinal/id: 8; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 다음 보기는 좌표평면 위의 점 $P(x_1,y_1)$과 점 $P$를 지나지 않는 직선 $l:ax+by+c=0$ ($a\ne0$ 또는 $b\ne0$) 사이의 거리를 구하는 과정 중 일부이다. 빈칸 ㄱ, ㄴ, ㄷ, ㄹ, ㅁ에 들어갈 내용으로 알맞은 것을 순서대로 쓴 것은? [3.8점]<br><br>$a\ne0$, $b\ne0$일 때, 점 $P$에서 직선 $l$에 내린 수선의 발 $H$의 좌표를 $(x_2,y_2)$라고 하면 직선 $PH$와 직선 $l$의 기울기는 각각 $\dfrac{y_2-y_1}{x_2-x_1}$, $-\dfrac ab$이고, 두 직선은 서로 수직이므로 기울기의 곱은 <span style="display:inline-block;min-width:1.4em;padding:0 0.25em;border:1px solid #222;text-align:center;">ㄱ</span>이다.<br>$\dfrac{x_2-x_1}{a}=\dfrac{y_2-y_1}{b}$이고, 이것을 $k$ ($k\ne0$)로 놓으면 $x_2-x_1=ak$, $y_2-y_1=bk$이므로 $\overline{PH}=\sqrt{k^2(a^2+b^2)}$에서 $\sqrt{k^2}$에 해당하는 값은 <span style="display:inline-block;min-width:1.4em;padding:0 0.25em;border:1px solid #222;text-align:center;">ㄴ</span>이다.<br>한편 점 $H(x_2,y_2)$는 직선 $l$ 위의 점이므로 $ax_2+by_2+c=0$이고, 이 식에 대입할 $x_2$, $y_2$는 각각 <span style="display:inline-block;min-width:1.4em;padding:0 0.25em;border:1px solid #222;text-align:center;">ㄷ</span>, <span style="display:inline-block;min-width:1.4em;padding:0 0.25em;border:1px solid #222;text-align:center;">ㄹ</span>이다. 이로부터 $k=-\dfrac{ax_1+by_1+c}{a^2+b^2}$이고, 거리 공식의 분자에 들어갈 식은 <span style="display:inline-block;min-width:1.4em;padding:0 0.25em;border:1px solid #222;text-align:center;">ㅁ</span>이다.
- 보기: ["$(1,\\ |k|,\\ x_1+ak,\\ y_1+bk,\\ |ax_1+by_1+c|)$","$(-1,\\ |k|,\\ x_1+ak,\\ y_1+bk,\\ |ax_1+by_1+c|)$","$(-1,\\ k,\\ x_1+ak,\\ y_1+bk,\\ ax+by+c)$","$(1,\\ k,\\ x+ak,\\ y+bk,\\ ax+by+c)$","$(-1,\\ |k|,\\ x+ak,\\ y+bk,\\ |ax+by+c|)$"]; 정답: ②.
- 기존 solution 직접 인용: 점 $P(x_1,y_1)$에서 직선 $l$에 내린 수선의 발을 $H(x_2,y_2)$라고 하자. / 직선 $PH$의 기울기는 / $\dfrac{y_2-y_1}{x_2-x_1}$이고,
- 판정/독립 검산: 기울기 곱 -1, PH=|k|√(a²+b²), H=(x₁+ak,y₁+bk), 분자 |ax₁+by₁+c|를 순서대로 유도; 그림 q08.png 미판독.
- 문제 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q08.png; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q8-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q9 — KEEP

- source ordinal/id: 9; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 집합 $A=\{\varnothing,3,5,7,\{7\}\}$에 대하여 다음 중 옳지 않은 것은? [3.8점]
- 보기: ["$\\varnothing\\in A$","$\\varnothing\\subset A$","$\\{\\varnothing\\}\\subset A$","$\\{\\varnothing\\}\\in A$","$\\{7\\}\\in A$"]; 정답: ④.
- 기존 solution 직접 인용: 집합 $A$의 원소는 / $\varnothing$, $3$, $5$, $7$, $\{7\}$이다. / 이 문제에서는 $\in$과 $\subset$을 구분해야 한다.
- 판정/독립 검산: ∅와 {∅}는 다른 집합. A에는 ∅가 원소로 있으나 {∅}는 원소로 없고 {7}은 원소로 있음; ④ 거짓.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q9-solution.svg; 실물 시각 QA: NOT_RUN. 

### Q10 — KEEP

- source ordinal/id: 10; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 전체집합 $U$의 두 부분집합 $A$, $B$에 대하여 $A\cap B=B$일 때, 다음 보기 중 항상 옳은 것만을 있는 대로 고른 것은? [3.9점]<br><br>ㄱ. $B\subseteq A$<br>ㄴ. $B^c\subset A^c$<br>ㄷ. $A\cup B=A$<br>ㄹ. $A\cap B^c\ne\varnothing$
- 보기: ["ㄱ","ㄴ, ㄹ","ㄱ, ㄷ","ㄴ, ㄷ, ㄹ","ㄱ, ㄷ, ㄹ"]; 정답: ③.
- 기존 solution 직접 인용: $A\cap B=B$ / 는 $B$의 모든 원소가 $A$에도 들어 있다는 뜻이다. / $B\subseteq A$이다.
- 판정/독립 검산: A∩B=B에서 B⊆A. 여집합 방향은 역전, A=B 반례로 ㄹ 거짓, ㄱ·ㄷ만 참.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q10-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q11 — KEEP

- source ordinal/id: 11; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 중심이 점 $(a,a)$이고 반지름의 길이가 $\dfrac13$인 원이 직선 $y=-x+3$과 만나도록 하는 $a$의 최댓값과 최솟값을 각각 $M$, $m$이라 할 때, $M+m$의 값은? (단, $a$는 상수) [4점]
- 보기: ["$\\dfrac32$","$3$","$\\dfrac52$","$5$","$7$"]; 정답: ②.
- 기존 solution 직접 인용: 원의 중심은 $C(a,a)$이고 반지름은 $\dfrac13$이다. / $y=-x+3$ / $x+y-3=0$이다.
- 판정/독립 검산: |2a-3|/√2≤1/3→3/2-√2/6≤a≤3/2+√2/6; 접하는 경우 포함, 합 3.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q11-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q12 — KEEP

- source ordinal/id: 12; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 포물선 $y=x^2+6x+13$을 원점에 대하여 대칭이동한 후, $y$축의 방향으로 $a$만큼 평행이동한 포물선이 $x$축과 점 $(b,0)$에서 접할 때, $a-b$의 값은? (단, $a,b$는 상수) [4.1점]
- 보기: ["$1$","$2$","$3$","$4$","$5$"]; 정답: ①.
- 기존 solution 직접 인용: $y=x^2+6x+13$ / $=(x+3)^2+4$이다. / 따라서 원래 포물선의 꼭짓점은 $(-3,4)$이다.
- 판정/독립 검산: 원점대칭 꼭짓점 (3,-4), 평행이동 (3,-4+a), 접할 때 a=4,b=3→1.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q12-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q13 — KEEP

> **2026-11-22 후속 시각 판정: KEEP.** 이전의 「이미지 미판독이므로 HOLD」는 당시 상태의 기록이다. 원본 PNG/문제 SVG와 해설 SVG를 직접 렌더·대조한 좌표·음영·보기별 근거는 [lane40 원본 이미지 재검증](LANE40_VISUAL_SOURCE_QA_20261122.md)에 문항별로 적었다. Golden/Negative/학생 화면 렌더는 별도 NOT_RUN.

- source ordinal/id: 13; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 두 방정식 $f(x,y)=0$, $g(x,y)=0$이 나타내는 도형이 아래 그림과 같을 때, 다음 중 옳은 것은? [4.3점]
- 보기: ["$g(x,y)=f(x-7,-y+2)$","$g(x,y)=f(x+7,-y-2)$","$g(x,y)=f(-x+7,y+2)$","$g(x,y)=f(-x-7,y+2)$","$g(x,y)=f(x+7,-y+2)$"]; 정답: ⑤.
- 기존 solution 직접 인용: 그림에서 원래 도형 $f(x,y)=0$의 점들이 / 도형 $g(x,y)=0$으로 어떻게 이동했는지 읽는다. / $(2,2)\rightarrow(-5,0)$이고,
- 판정/독립 검산: 해설은 (2,2)→(-5,0), (5,7)→(-2,-5) 등 그림의 좌표 대응을 전제로 함. q13.png 실물 미판독이므로 근거 보류.
- 문제 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q13.png; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q13-solution-v2.svg; 실물 시각 QA: NOT_RUN. 원본 문제 이미지 판독 후 좌표 대응 확인 필요.

### Q14 — KEEP

- source ordinal/id: 14; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 그림과 같이 좌표평면 위의 점 $A(-1,2)$, $B(-3,0)$, $C(2,-1)$을 세 꼭짓점으로 하는 삼각형 $ABC$가 있다. 삼각형 $ABC$의 내심을 점 $I$라 할 때, 직선 $AI$와 선분 $BC$의 교점의 좌표는? [4.4점]
- 보기: ["$\\left(-\\dfrac32,-\\dfrac37\\right)$","$\\left(-1,\\dfrac25\\right)$","$\\left(-\\dfrac67,-\\dfrac37\\right)$","$\\left(-1,-\\dfrac25\\right)$","$\\left(-\\dfrac43,-\\dfrac13\\right)$"]; 정답: ④.
- 기존 solution 직접 인용: 점 $I$는 삼각형 $ABC$의 내심이므로 / 직선 $AI$는 $\angle A$의 이등분선이다. / 직선 $AI$와 선분 $BC$의 교점을 $D$라고 하자.
- 판정/독립 검산: AB=2√2, AC=3√2→BD:DC=2:3→D=(-1,-2/5). q14.png 미판독이나 수치·조건으로 독립 검산 가능.
- 문제 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q14.png; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q14-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q15 — KEEP

- source ordinal/id: 15; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 성선이네 반 학생 $25$명을 대상으로 두 선택 과목 $A$, $B$에 대한 선호도를 조사한 결과 과목 $A$를 선호하는 학생이 $12$명, 과목 $B$를 선호하는 학생이 $17$명이었다. 두 과목을 모두 선호하는 학생이 $x$명일 때, $x$의 최댓값을 $a$, 최솟값을 $b$라 할 때 $a-b$의 값은? [4.4점]
- 보기: ["$7$","$8$","$9$","$10$","$11$"]; 정답: ②.
- 기존 solution 직접 인용: 과목 $A$를 선호하는 학생의 집합을 $A$, / 과목 $B$를 선호하는 학생의 집합을 $B$라고 하자. / $n(A)=12$,
- 판정/독립 검산: 교집합 최대 min(12,17)=12, 최소 12+17-25=4; 양 경계 실현 가능, 차 8.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q15-solution.svg; 실물 시각 QA: NOT_RUN. 

### Q16 — KEEP

- source ordinal/id: 16; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 전체집합 $U=\{1,2,3,\ldots,15\}$의 세 부분집합 $A$, $B$, $C$에 대해 $A=\{1,2,4,7,8\}$, $B=\{3,4,5,7,9\}$, $C=\{4,7,10,12,13\}$일 때, $(A\cap B^c)\cup(A\cap C^c)$의 모든 원소의 합은? [4.5점]
- 보기: ["$8$","$9$","$10$","$11$","$12$"]; 정답: ④.
- 기존 solution 직접 인용: $A=\{1,2,4,7,8\}$, / $B=\{3,4,5,7,9\}$, / $C=\{4,7,10,12,13\}$이다.
- 판정/독립 검산: (A∩Bᶜ)∪(A∩Cᶜ)=A∩(B∩C)ᶜ; B∩C={4,7}, {1,2,8} 합11.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q16-solution.svg; 실물 시각 QA: NOT_RUN. 

### Q17 — KEEP

- source ordinal/id: 17; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 직선 $y=k(x+3)-5$를 $x$축의 방향으로 $5$만큼, $y$축의 방향으로 $8$만큼 평행이동한 직선을 $l$이라 하자. 실수 $k$의 값에 관계없이 직선 $l$이 원 $x^2+y^2+2ax+3by=0$의 넓이를 이등분할 때, $ab$의 값은? (단, $a,b$는 상수) [4.6점]
- 보기: ["$4$","$6$","$8$","$10$","$12$"]; 정답: ①.
- 기존 solution 직접 인용: $y=k(x+3)-5$이다. / $x$축의 방향으로 $5$만큼, / $y$축의 방향으로 $8$만큼 평행이동한 직선을 $l$이라 하였으므로
- 판정/독립 검산: 이동 후 y=k(x-2)+3, 모든 k의 공통점 (2,3)=원 중심 (-a,-3b/2)→a=b=-2, 곱4.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q17-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q18 — KEEP

- source ordinal/id: 18; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: 그림과 같이 네 점 $O(0,0)$, $A(0,17)$, $B(-10,17)$, $C(-10,0)$을 꼭짓점으로 하는 직사각형 $OABC$가 있다. 직사각형 $OABC$ 내부의 두 점 $P(-2,1)$과 점 $Q$에 대하여 선분 $OA$ 위에 $\angle PR_1O=\angle QR_1A$가 되는 점 $R_1$을 잡고, 선분 $AB$ 위에 $\angle PR_2A=\angle QR_2B$가 되는 점 $R_2$를 잡는다. 또 선분 $BC$ 위에 $\angle PR_3C=\angle QR_3B$가 되는 점 $R_3$을 잡고, 선분 $CO$ 위에 $\angle PR_4O=\angle QR_4C$가 되는 점 $R_4$를 잡는다. 두 선분 $PR_i$, $R_iQ$ ($i=1,2,3,4$)의 길이의 합이 항상 일정할 때, 점 $Q$의 좌표는? [4.8점]
- 보기: ["$(-6,15)$","$(-7,12)$","$(-7,14)$","$(-8,14)$","$(-8,16)$"]; 정답: ⑤.
- 기존 solution 직접 인용: 점 $P(-2,1)$을 각 변에 대하여 대칭이동한 점을 차례로 $P_1,P_2,P_3,P_4$라고 하자. / 선분 $OA$는 $y$축이므로 / $P_1=(2,1)$이다.
- 판정/독립 검산: 반사점 (2,1),(-2,33),(-18,1),(-2,-1), 수직이등분선 x=-8,y=16. 원문 R₂=-130/17은 t=16/17로 재검산되어 정확하며 네 반사점 교점이 변 위에 있음. q18.png 시각 판독 보류.
- 문제 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q18.png; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q18-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q19 — KEEP

- source ordinal/id: 19; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: [서술형 1] 좌표평면 위의 점 $A$를 $x$축, $y$축, 원점에 대하여 대칭이동한 점을 각각 $B$, $C$, $D$라 하자. $\overline{AB}=4$, $\overline{AC}=6$일 때, 선분 $AD$의 길이를 구하고 그 과정을 서술하시오. [5점]
- 보기: []; 정답: $2\sqrt{13}$.
- 기존 solution 직접 인용: 점 $A$의 좌표를 / $A=(x,y)$ / 점 $A$를 $x$축에 대하여 대칭이동한 점은
- 판정/독립 검산: B=(x,-y),C=(-x,y),D=(-x,-y), |y|=2,|x|=3→AD=2√13; 부호 경우 모두 제곱으로 포함.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q19-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q20 — KEEP

- source ordinal/id: 20; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: [서술형 2] 전체집합 $U$의 두 부분집합 $A$, $B$에 대하여 $n(U)=150$, $n(A)=62$, $n(B)=96$, $n(A^c\cap B^c)=18$일 때, $n(A\cap B)$를 구하고 그 과정을 서술하시오. [6점]
- 보기: []; 정답: $26$.
- 기존 solution 직접 인용: $A^c\cap B^c=(A\cup B)^c$이다. / $n(U)=150$, / $n(A^c\cap B^c)=18$
- 판정/독립 검산: n(A∪B)=150-18=132, n(A∩B)=62+96-132=26; 드모르간·포함배제 연결 명시.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q20-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q21 — KEEP

- source ordinal/id: 21; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: [서술형 3] 두 점 $A(-8,-6)$, $B(2,9)$과 직선 $AB$ 위의 점 $C$가 $2\overline{BC}=3\overline{AC}$를 만족시킬 때, 점 $C$의 좌표를 모두 구하고 그 과정을 서술하시오. [6점]
- 보기: []; 정답: $(-4,0)$, $(-28,-36)$.
- 기존 solution 직접 인용: $2\overline{BC}=3\overline{AC}$ / $AC:BC=2:3$이다. / 점 $C$는 직선 $AB$ 위에 있으므로 위치를 나누어 생각해야 한다.
- 판정/독립 검산: 내분 2:3으로 (-4,0), 외분 C-A-B로 (-28,-36); 두 위치 모두 거리비 AC:BC=2:3.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q21-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q22 — KEEP

- source ordinal/id: 22; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: [서술형 4] 점 $(-2,3)$을 지나고 $x$축과 $y$축에 동시에 접하는 두 원의 중심 사이의 거리를 구하고 그 과정을 서술하시오. [6점]
- 보기: []; 정답: $4\sqrt6$.
- 기존 solution 직접 인용: 반지름을 $r$이라고 하자. / 원이 $x$축과 $y$축에 동시에 접하므로 / 원의 중심에서 두 좌표축까지의 거리가 모두 $r$이다.
- 판정/독립 검산: 제2사분면 중심 (-r,r), r²-10r+13=0, r=5±2√3; 중심 좌표차 4√3씩→4√6.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q22-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

### Q23 — KEEP

- source ordinal/id: 23; blob `144b5b81770601f624355e333da25ebcda555610`; standardCourse: 공통수학2; identity: NOT_PRESENT.
- 문제 원문: [서술형 5] $|a|\le9$, $|b|\le4$인 두 정수 $a$, $b$에 대하여 함수 $y=|x|$의 그래프를 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동한 함수의 그래프가 $x^2+y^2-8x-4y+18=0$의 중심을 지나고 원의 넓이를 이등분할 때, 두 수 $a$, $b$의 모든 순서쌍 $(a,b)$를 구하고 그 과정을 서술하시오. [7점]
- 보기: []; 정답: $(3,1)$, $(2,0)$, $(1,-1)$, $(0,-2)$, $(-1,-3)$, $(-2,-4)$, $(5,1)$, $(6,0)$, $(7,-1)$, $(8,-2)$, $(9,-3)$.
- 기존 solution 직접 인용: $x^2+y^2-8x-4y+18=0$에서 완전제곱식을 만들면 / $(x-4)^2+(y-2)^2=2$이다. / $O=(4,2)$이고,
- 판정/독립 검산: 원 중심 (4,2), r=√2; b=2-|4-a|, 꼭짓점 거리 √2|4-a|≥√2, 정수 1≤|4-a|≤6와 |a|≤9로 11쌍.
- 문제 이미지: 없음; 해설 이미지: assets/images/25_효천고_2학기_중간_고1_기출/q23-solution-v2.svg; 실물 시각 QA: NOT_RUN. 

