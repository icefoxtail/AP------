# 고1 2학기 기말 유사시험지 전 문항 수학 감사 — 24_금당고_2학기_기말_고1_유사

> **2026-11-22 후속 시각 QA: VISUAL_QA_PASS** — 이미지 12개 렌더·육안 검수, 결함 0개. 상세 결과는 문서 끝의 ‘후속 시각 검수’ 및 [통합 계획](./H1_2FINAL_SIMILAR_VISUAL_QA_20261122.md) 참조.


- 감사일: 2026-11-22 (KST)
- 원본: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사.js`
- 원본 blob SHA: `80f7180b04266bca5f9ee3a493b47455f1e57738`
- 교육과정: 2015 개정, 수학(하)
- 감사 범위: **21개 전 문항**의 문제·보기·정답·해설 텍스트/수식 및 독립 계산 확인
- 수학 판정: **KEEP_MATH 21/21**, 정답·계산 불일치로 인한 변경 대상 0건
- 이미지/도형 검수: **VISUAL_QA_PENDING** — 실물 이미지 검수는 별도 수행하며, 이 문서의 수학 판정은 이미지 자체의 정확성을 확정하지 않음
- 문제 이미지 연결: 15, 17, 19번; 해설 이미지 연결: 3, 5, 8, 10, 11, 15, 16, 17, 21번
- 문제·해설 plan 파일 참조는 보존하되 이미지 생성/수정/렌더 검수를 포함하지 않음
- 원본 JS 및 이미지 파일은 변경하지 않고 감사 MD만 추가함

## 문항별 원문 및 검산 기록

### 1번 — 팩토리얼 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
자연수 $n$에 대하여 $\dfrac{n!}{3!}=20$일 때, $n$의 값은? [3.8점]
~~~

**보기 원문**

~~~text
① $3$
② $4$
③ $5$
④ $6$
⑤ $7$
~~~

**정답 원문**

~~~text
③
~~~

**독립 수학 판정 근거**: n!/3!=20⇒n!=120=5! ⇒n5.

**해설 원문**

~~~text
$\dfrac{n!}{3!}=20$의 양변에 $3!=6$을 곱한다.
$n!=20\times6=120$
팩토리얼의 값을 작은 수부터 차례로 구하면
$1!=1,\ 2!=2,\ 3!=6$
$4!=24,\ 5!=120$
$n!=120=5!$이므로 $n=5$
확인: $\dfrac{5!}{3!}=\dfrac{5\times4\times3!}{3!}=5\times4=20$
따라서 정답은 ③이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q01-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q01-solution.plan.json`

---

### 2번 — 유리식의 계산 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
$x\ne0,\ x\ne3$일 때, 유리식 $\dfrac{\dfrac{1}{x}+\dfrac{1}{3}}{\dfrac{1}{x}-\dfrac{1}{3}}$을 간단히 하면? [3.8점]
~~~

**보기 원문**

~~~text
① $\dfrac{x+3}{3-x}$
② $\dfrac{x+3}{x-3}$
③ $\dfrac{x-3}{x+3}$
④ $\dfrac{3-x}{x+3}$
⑤ $\dfrac{x}{x+3}$
~~~

**정답 원문**

~~~text
①
~~~

**독립 수학 판정 근거**: 분자·분모에 3x를 곱해 (x+3)/(3−x); x≠0,3 유지.

**해설 원문**

~~~text
번분수식이므로 분자와 분모에 똑같이 $3x$를 곱해서 분수를 없앤다. ($x\ne0$이므로 $3x\ne0$)
분자: $\left(\dfrac{1}{x}+\dfrac{1}{3}\right)\times3x=3+x$
분모: $\left(\dfrac{1}{x}-\dfrac{1}{3}\right)\times3x=3-x$
$\Rightarrow \dfrac{\dfrac{1}{x}+\dfrac{1}{3}}{\dfrac{1}{x}-\dfrac{1}{3}}=\dfrac{x+3}{3-x}$
확인: $x=1$이면 $\dfrac{1+\frac{1}{3}}{1-\frac{1}{3}}=\dfrac{\frac{4}{3}}{\frac{2}{3}}=2$이고 $\dfrac{1+3}{3-1}=2$로 같다.
따라서 정답은 ①이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q02-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q02-solution.plan.json`

---

### 3번 — 유리함수의 점근선 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
유리함수 $f(x)=\dfrac{3}{x-a}+b$의 그래프의 점근선의 방정식이 $x=-1$, $y=4$일 때, 두 상수 $a$, $b$에 대하여 $a+b$의 값은? [3.8점]
~~~

**보기 원문**

~~~text
① $-5$
② $-1$
③ $1$
④ $3$
⑤ $5$
~~~

**정답 원문**

~~~text
④
~~~

**독립 수학 판정 근거**: 3/(x−a)+b의 점근선 x=a=−1,y=b=4 ⇒a+b3.

**해설 원문**

~~~text
$f(x)=\dfrac{3}{x-a}+b$의 그래프는 $y=\dfrac{3}{x}$의 그래프를
$x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동한 것이다.
따라서 점근선의 방정식은 $x=a$, $y=b$이다.
주어진 점근선 $x=-1$, $y=4$와 비교하면
$a=-1,\ b=4$
$\Rightarrow a+b=-1+4=3$
그림에서 곡선 $y=\dfrac{3}{x+1}+4=\dfrac{4x+7}{x+1}$은 두 점근선 $x=-1$, $y=4$에 한없이 가까워진다.
따라서 정답은 ④이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q3-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q03-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q03-solution.plan.json`

---

### 4번 — 조합 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
${}_{14}C_{12}$의 값은? [3.8점]
~~~

**보기 원문**

~~~text
① $78$
② $91$
③ $105$
④ $182$
⑤ $364$
~~~

**정답 원문**

~~~text
②
~~~

**독립 수학 판정 근거**: 14C12=14C2=14·13/2=91.

**해설 원문**

~~~text
${}_nC_r={}_nC_{n-r}$이므로
${}_{14}C_{12}={}_{14}C_{2}$
$=\dfrac{14\times13}{2\times1}$
$=\dfrac{182}{2}=91$
따라서 정답은 ②이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q04-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q04-solution.plan.json`

---

### 5번 — 무리함수의 최솟값 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $y=\sqrt{-2x+8}+3$은 $x=a$일 때, 최솟값 $b$를 갖는다. 두 상수 $a$, $b$에 대하여 $a\times b$의 값은? [3.8점]
~~~

**보기 원문**

~~~text
① $3$
② $4$
③ $7$
④ $9$
⑤ $12$
~~~

**정답 원문**

~~~text
⑤
~~~

**독립 수학 판정 근거**: −2x+8≥0⇒x≤4, 최소 y3은 x4; 곱12.

**해설 원문**

~~~text
근호 안의 식은 $0$ 이상이어야 하므로
$-2x+8\ge0$
$\Rightarrow x\le4$
$\sqrt{-2x+8}\ge0$이므로 $y=\sqrt{-2x+8}+3\ge3$
등호는 $-2x+8=0$, 즉 $x=4$일 때 성립한다.
그림에서 그래프는 점 $(4,3)$에서 시작하여 왼쪽 위로 뻗어 나가고, 가장 낮은 점이 $(4,3)$이다.
따라서 $x=4$일 때 최솟값 $3$을 가지므로 $a=4,\ b=3$
$a\times b=4\times3=12$
따라서 정답은 ⑤이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q5-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q05-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q05-solution.plan.json`

---

### 6번 — 역함수 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $f(x)=2x-3$의 역함수 $f^{-1}$에 대하여 $f^{-1}(5)=k$를 만족시키는 상수 $k$의 값은? [3.8점]
~~~

**보기 원문**

~~~text
① $4$
② $5$
③ $6$
④ $7$
⑤ $8$
~~~

**정답 원문**

~~~text
①
~~~

**독립 수학 판정 근거**: f(k)=5⇔2k−3=5 ⇒k4.

**해설 원문**

~~~text
$f^{-1}(5)=k$는 $f(k)=5$와 같다.
$f(k)=2k-3=5$
$2k=8$
$\Rightarrow k=4$
다른 방법: $y=2x-3$에서 $x=\dfrac{y+3}{2}$이므로 $f^{-1}(x)=\dfrac{x+3}{2}$
$f^{-1}(5)=\dfrac{5+3}{2}=4$
따라서 정답은 ①이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q06-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q06-solution.plan.json`

---

### 7번 — 순열 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
서로 다른 과일 7개 중에서 3개를 택하여 서로 다른 접시 3개에 하나씩 담는 모든 방법의 수는? [4점]
~~~

**보기 원문**

~~~text
① $35$
② $105$
③ $210$
④ $343$
⑤ $420$
~~~

**정답 원문**

~~~text
③
~~~

**독립 수학 판정 근거**: 과일7개에서 순서 있게 접시3개에 배치 7P3=210.

**해설 원문**

~~~text
첫째 접시에 담을 과일을 고르는 방법은 $7$가지
둘째 접시에는 남은 $6$개 중 하나를 담으므로 $6$가지
셋째 접시에는 남은 $5$개 중 하나를 담으므로 $5$가지
곱의 법칙에 의하여 $7\times6\times5=210$
(순열로 나타내면 ${}_7P_3=7\times6\times5=210$)
따라서 정답은 ③이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q07-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q07-solution.plan.json`

---

### 8번 — 유리함수의 최댓값과 최솟값 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
유리함수 $y=\dfrac{bx+9}{x+a}$의 그래프의 점근선의 방정식이 $x=-3$, $y=2$일 때, $0\le x\le3$에서 이 함수의 최댓값과 최솟값의 합은? (단, $a$, $b$는 상수이다.) [4점]
~~~

**보기 원문**

~~~text
① $5$
② $\dfrac{11}{2}$
③ $6$
④ $\dfrac{13}{2}$
⑤ $7$
~~~

**정답 원문**

~~~text
②
~~~

**독립 수학 판정 근거**: 점근선으로 a3,b2; y=2+3/(x+3), x0에서3, x3에서5/2 ⇒합11/2.

**해설 원문**

~~~text
$\dfrac{bx+9}{x+a}=\dfrac{b(x+a)+9-ab}{x+a}=b+\dfrac{9-ab}{x+a}$
이므로 점근선의 방정식은 $x=-a$, $y=b$이다.
주어진 점근선 $x=-3$, $y=2$와 비교하면 $a=3,\ b=2$
$y=\dfrac{2x+9}{x+3}=2+\dfrac{9-6}{x+3}=\dfrac{3}{x+3}+2$
$0\le x\le3$에서 $x+3>0$이고, $x$가 커질수록 $\dfrac{3}{x+3}$은 작아지므로 $y$는 감소한다.
최댓값: $x=0$일 때 $y=\dfrac{3}{3}+2=3$
최솟값: $x=3$일 때 $y=\dfrac{3}{6}+2=\dfrac{5}{2}$
그림에서 두 점 $(0,3)$, $\left(3,\dfrac{5}{2}\right)$를 확인할 수 있다.
$\Rightarrow$ (최댓값)$+$(최솟값)$=3+\dfrac{5}{2}=\dfrac{11}{2}$
따라서 정답은 ②이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q8-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q08-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q08-solution.plan.json`

---

### 9번 — 함수와 역함수의 개수 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
집합 $X=\{1,2,3,4,5,6\}$과 집합 $Y$에 대하여 함수 $f:X\to Y$가 다음 조건을 만족시킨다.<br><div class="note-box">(가) $f$는 역함수가 존재한다.<br>(나) $f(1)=3$</div><br>$n(Y)$의 값과 함수 $f$의 개수의 합은? [4.2점]
~~~

**보기 원문**

~~~text
① $120$
② $121$
③ $125$
④ $126$
⑤ $130$
~~~

**정답 원문**

~~~text
④
~~~

**독립 수학 판정 근거**: 전단사 f:X→Y라면 |Y|6; f1=3 고정한 나머지5!=120, 합126.

**해설 원문**

~~~text
(가) $f$의 역함수가 존재하려면 $f$는 일대일대응이어야 한다.
일대일대응이면 정의역과 공역의 원소의 개수가 같으므로 $n(Y)=n(X)=6$
(나) $f(1)=3$이므로 $1$의 함숫값은 이미 정해졌다.
나머지 $2,3,4,5,6$의 함숫값은 $Y$에서 $3$을 뺀 $5$개의 원소를 하나씩 겹치지 않게 대응시킨다.
$2$의 함숫값: $5$가지
$3$의 함숫값: $4$가지
$4$의 함숫값: $3$가지
$5$의 함숫값: $2$가지
$6$의 함숫값: $1$가지
곱의 법칙에 의하여 함수 $f$의 개수는 $5\times4\times3\times2\times1=5!=120$
따라서 구하는 합은 $6+120=126$
정답은 ④이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q09-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q09-solution.plan.json`

---

### 10번 — 무리함수와 직선의 교점 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
무리함수 $y=-\sqrt{4-4x}$의 그래프와 직선 $y=2x+k$가 서로 다른 두 점에서 만나도록 하는 상수 $k$의 값의 범위가 $a<k\le b$일 때, 두 상수 $a$, $b$에 대하여 $a+b$의 값은? [4.2점]
~~~

**보기 원문**

~~~text
① $-\dfrac{11}{2}$
② $-5$
③ $-\dfrac{9}{2}$
④ $-4$
⑤ $-\dfrac{7}{2}$
~~~

**정답 원문**

~~~text
③
~~~

**독립 수학 판정 근거**: t=√(4−4x)≥0, k=(t−1)²/2−5/2; 두 해는 −5/2<k≤−2, 양끝 합−9/2.

**해설 원문**

~~~text
교점에서 $-\sqrt{4-4x}=2x+k$
$t=\sqrt{4-4x}$ $(t\ge0)$로 놓으면 $x=1-\dfrac{t^2}{4}$이고, $t$의 값마다 $x$의 값이 하나씩 정해진다.
$2x+k=2-\dfrac{t^2}{2}+k$이므로 $-t=2-\dfrac{t^2}{2}+k$
$\Rightarrow k=\dfrac{t^2}{2}-t-2=\dfrac{1}{2}(t-1)^2-\dfrac{5}{2}$ $(t\ge0)$
교점의 개수는 $k=\dfrac{1}{2}(t-1)^2-\dfrac{5}{2}$를 만족시키는 $t\ge0$의 개수와 같다.
$t=0$일 때 $k=-2$, $t=1$일 때 $k=-\dfrac{5}{2}$ (최솟값)
$0\le t\le1$에서 $k$는 $-2$에서 $-\dfrac{5}{2}$까지 감소한다.
$t\ge1$에서 $k$는 $-\dfrac{5}{2}$에서 한없이 증가한다.
서로 다른 두 점에서 만나려면 $t$의 값이 서로 다른 두 개여야 하므로
$-\dfrac{5}{2}<k\le-2$
그림에서 직선 $y=2x-2$는 곡선과 $E(1,0)$, $F(0,-2)$에서 만나고, 점 $T\left(\dfrac{3}{4},-1\right)$은 직선 $y=2x-\dfrac{5}{2}$가 곡선에 접하는 점이다.
$a=-\dfrac{5}{2},\ b=-2$
$\Rightarrow a+b=-\dfrac{5}{2}+(-2)=-\dfrac{9}{2}$
따라서 정답은 ③이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q10-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q10-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q10-solution.plan.json`

---

### 11번 — 무리함수 위의 두 점 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
무리함수 $y=2\sqrt{x-1}+1$의 그래프 위의 두 점 $P(a,b)$, $Q(c,d)$에 대하여 $b+d=7$일 때, 직선 $PQ$의 기울기는? (단, $1<a<c$이다.) [4.2점]
~~~

**보기 원문**

~~~text
① $\dfrac{2}{5}$
② $\dfrac{1}{2}$
③ $\dfrac{2}{3}$
④ $\dfrac{3}{4}$
⑤ $\dfrac{4}{5}$
~~~

**정답 원문**

~~~text
⑤
~~~

**독립 수학 판정 근거**: √(a−1)+√(c−1)=5/2, 두 점의 할선 기울기 2/[√(a−1)+√(c−1)]=4/5.

**해설 원문**

~~~text
두 점 $P$, $Q$는 $y=2\sqrt{x-1}+1$ 위의 점이므로
$b=2\sqrt{a-1}+1,\ d=2\sqrt{c-1}+1$
$b+d=7$에서 $2\sqrt{a-1}+2\sqrt{c-1}+2=7$
$\Rightarrow \sqrt{a-1}+\sqrt{c-1}=\dfrac{5}{2}$ ㉠
직선 $PQ$의 기울기는 $\dfrac{d-b}{c-a}=\dfrac{2\sqrt{c-1}-2\sqrt{a-1}}{c-a}$
분모를 $c-a=(c-1)-(a-1)$로 보고 곱셈 공식을 쓰면
$c-a=\left(\sqrt{c-1}-\sqrt{a-1}\right)\left(\sqrt{c-1}+\sqrt{a-1}\right)$
$a<c$이므로 $\sqrt{c-1}-\sqrt{a-1}\ne0$이다. 약분하면
$\dfrac{2\left(\sqrt{c-1}-\sqrt{a-1}\right)}{\left(\sqrt{c-1}-\sqrt{a-1}\right)\left(\sqrt{c-1}+\sqrt{a-1}\right)}=\dfrac{2}{\sqrt{c-1}+\sqrt{a-1}}$
㉠을 대입하면 $\dfrac{2}{\frac{5}{2}}=\dfrac{4}{5}$
그림의 예: $a=2,\ b=3$, $c=\dfrac{13}{4},\ d=4$이면 $b+d=7$이고 기울기는 $\dfrac{4-3}{\frac{13}{4}-2}=\dfrac{4}{5}$이다.
따라서 정답은 ⑤이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q11-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q11-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q11-solution.plan.json`

---

### 12번 — 조합과 순열 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
수학 동아리 학생 7명과 과학 동아리 학생 4명 중에서 이어달리기 선수 4명을 뽑아 달리는 순서를 정하려고 한다. 수학 동아리에서 3명, 과학 동아리에서 1명을 뽑는 경우의 수는? (단, 달리는 순서를 고려한다.) [4.2점]
~~~

**보기 원문**

~~~text
① $140$
② $840$
③ $1680$
④ $3360$
⑤ $6720$
~~~

**정답 원문**

~~~text
④
~~~

**독립 수학 판정 근거**: 수학7명 중3명·과학4명 중1명 선택 뒤 4명 배열 ⇒7C3·4C1·4!=3360.

**해설 원문**

~~~text
수학 동아리 $7$명 중에서 $3$명을 뽑는 경우의 수:
${}_7C_3=\dfrac{7\times6\times5}{3\times2\times1}=35$
과학 동아리 $4$명 중에서 $1$명을 뽑는 경우의 수:
${}_4C_1=4$
뽑힌 $4$명이 달리는 순서를 정하는 경우의 수:
$4!=4\times3\times2\times1=24$
세 과정은 차례로 일어나므로 곱의 법칙에 의하여
$35\times4\times24=140\times24=3360$
따라서 정답은 ④이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q12-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q12-solution.plan.json`

---

### 13번 — 역함수와 합성함수 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
집합 $X=\{-3,-1,0,2,4\}$에 대하여 함수 $f:X\to X$가 역함수가 존재하고, 다음 조건을 만족시킨다.<br><div class="note-box">(가) $(f\circ f)(-1)+f^{-1}(-3)=8$<br>(나) $k=0,2$일 때, $f(k)f(k-3)\le0$이다.</div><br>$2f(-3)+3f(0)+f(2)$의 값은? [4.4점]
~~~

**보기 원문**

~~~text
① $4$
② $8$
③ $10$
④ $12$
⑤ $14$
~~~

**정답 원문**

~~~text
④
~~~

**독립 수학 판정 근거**: X최대4이므로 f²(−1)=4,f⁻¹(−3)=4; 순열 및 부호 제약으로 f(−3)=−1,f0=4,f2=2 ⇒12.

**해설 원문**

~~~text
$f$는 역함수가 존재하므로 일대일대응이다.
[조건 (가)]
$(f\circ f)(-1)$과 $f^{-1}(-3)$은 모두 $X$의 원소이고, $X$의 원소 중 가장 큰 수는 $4$이다.
두 수의 합이 $8$이 되려면 두 수가 모두 $4$이어야 한다.
$f^{-1}(-3)=4$에서 $f(4)=-3$ ㉠
$(f\circ f)(-1)=f(f(-1))=4$ ㉡
$f(-1)=p$로 놓으면 ㉡에서 $f(p)=4$이다. $p$의 값으로 가능한 것을 찾는다.
$p=-1$: $f(-1)=-1$이므로 $f(p)=f(-1)=-1\ne4$ (모순)
$p=4$: ㉠에서 $f(p)=f(4)=-3\ne4$ (모순)
$p=-3$: $f(-1)=-3$인데 ㉠에서 $f(4)=-3$이므로 일대일이 아니다. (모순)
$p=0$: $f(-1)=0,\ f(0)=4$
$p=2$: $f(-1)=2,\ f(2)=4$
[조건 (나)] 남은 두 경우를 확인한다.
$p=2$이면 $k=2$일 때 $f(2)f(-1)=4\times2=8>0$이므로 (나)를 만족시키지 않는다.
$p=0$이면 $f(-1)=0,\ f(0)=4,\ f(4)=-3$이고, 남은 정의역 $-3,\ 2$에 남은 값 $-1,\ 2$를 대응시킨다.
$k=0$: $f(0)f(-3)=4f(-3)\le0$이므로 $f(-3)\le0$, 즉 $f(-3)=-1$
그러면 $f(2)=2$이고, $k=2$일 때 $f(2)f(-1)=2\times0=0\le0$이므로 (나)를 만족시킨다.
따라서 $f(-3)=-1,\ f(-1)=0,\ f(0)=4,\ f(2)=2,\ f(4)=-3$
$2f(-3)+3f(0)+f(2)=2\times(-1)+3\times4+2=12$
따라서 정답은 ④이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q13-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q13-solution.plan.json`

---

### 14번 — 함수의 그래프와 넓이 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $f(x)=\begin{cases}\dfrac{1}{2}x^2&(x\ge0)\\\sqrt{-2x}&(x<0)\end{cases}$의 그래프와 직선 $x-3y+20=0$이 두 점 $A(4,8)$, $B(-8,4)$에서 만난다. 주어진 함수 $y=f(x)$의 그래프와 직선 $x-3y+20=0$으로 둘러싸인 부분의 넓이는? [4.4점]
~~~

**보기 원문**

~~~text
① $20$
② $24$
③ $30$
④ $36$
⑤ $40$
~~~

**정답 원문**

~~~text
⑤
~~~

**독립 수학 판정 근거**: 오른쪽 포물선과 왼쪽 회전 무리곡선의 호-현 넓이가 상쇄; 삼각형 OAB=|4·4−8·(−8)|/2=40.

**해설 원문**

~~~text
곡선은 $x\ge0$에서 $y=\dfrac{1}{2}x^2$, $x<0$에서 $y=\sqrt{-2x}$이다.
[두 부분의 관계] 점 $(x,y)$를 원점을 중심으로 $90^\circ$ 회전하면 $(-y,\ x)$로 옮겨진다.
$y=\dfrac{1}{2}x^2$ $(x\ge0)$ 위의 점 $\left(x,\ \dfrac{1}{2}x^2\right)$은 $\left(-\dfrac{1}{2}x^2,\ x\right)$로 옮겨진다.
이 점을 $(X,Y)$라 하면 $X=-\dfrac{1}{2}Y^2$, 즉 $Y=\sqrt{-2X}$ $(Y\ge0)$이다.
따라서 $x\ge0$인 부분을 $90^\circ$ 회전하면 $x<0$인 부분과 정확히 겹친다.
$A(4,8)$은 $(-8,4)=B$로 옮겨지므로 $\overline{OA}$는 $\overline{OB}$로 옮겨진다.
[넓이] 삼각형 $OAB$를 생각한다.
오른쪽 호 $OA$는 선분 $OA$의 바깥쪽에 있고, 선분 $OA$와 이 호 사이의 넓이를 $S_1$이라 하자.
왼쪽 호 $OB$는 삼각형 $OAB$의 안쪽에 있고, 선분 $OB$와 이 호 사이의 넓이를 $S_2$라 하자.
회전하여 겹치므로 $S_1=S_2$이다.
구하는 넓이 $=$ (삼각형 $OAB$의 넓이) $+S_1-S_2=$ (삼각형 $OAB$의 넓이)
삼각형 $OAB$의 넓이: $\dfrac{1}{2}\left|4\times4-8\times(-8)\right|=\dfrac{1}{2}\times80=40$
따라서 정답은 ⑤이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q14-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q14-solution.plan.json`

---

### 15번 — 유리함수와 거리 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
유리함수 $y=\dfrac{9}{x}$의 그래프 위의 한 점 $P(a,b)$와 원점을 지나는 직선을 $l$이라 하고, 점 $P$에서 $x$축에 내린 수선의 발을 $Q$, 점 $Q$에서 직선 $l$에 내린 수선의 발을 $H$라 할 때, 선분 $QH$의 길이의 최댓값은? (단, $a>0$) [4.4점]
~~~

**보기 원문**

~~~text
① $\dfrac{3}{2}$
② $\dfrac{3\sqrt{2}}{2}$
③ $\dfrac{3\sqrt{3}}{2}$
④ $3$
⑤ $3\sqrt{2}$
~~~

**정답 원문**

~~~text
②
~~~

**독립 수학 판정 근거**: 직각삼각형 OQP에서 QH=ab/√(a²+b²), ab9, a²+b²≥18 ⇒최대3√2/2.

**해설 원문**

~~~text
$P(a,b)$가 $y=\dfrac{9}{x}$ 위의 점이고 $a>0$이므로 $b=\dfrac{9}{a}>0$, 즉 $ab=9$
$Q(a,0)$이므로 $\overline{OQ}=a,\ \overline{PQ}=b$이고 삼각형 $OQP$는 $\angle OQP=90^\circ$인 직각삼각형이다.
빗변의 길이 $\overline{OP}=\sqrt{a^2+b^2}$
$H$는 $Q$에서 빗변 $OP$에 내린 수선의 발이므로 삼각형 $OQP$의 넓이를 두 가지로 나타내면
$\dfrac{1}{2}\times\overline{OQ}\times\overline{PQ}=\dfrac{1}{2}\times\overline{OP}\times\overline{QH}$
$\Rightarrow \overline{QH}=\dfrac{ab}{\sqrt{a^2+b^2}}=\dfrac{9}{\sqrt{a^2+b^2}}$
$\overline{QH}$가 최대가 되려면 $a^2+b^2$이 최소이어야 한다.
$a^2>0,\ b^2>0$이므로 산술평균과 기하평균의 관계에 의하여
$a^2+b^2\ge2\sqrt{a^2b^2}=2ab=18$
등호는 $a^2=b^2$, 즉 $a=b=3$일 때 성립한다.
$\overline{QH}\le\dfrac{9}{\sqrt{18}}=\dfrac{9}{3\sqrt{2}}=\dfrac{3}{\sqrt{2}}=\dfrac{3\sqrt{2}}{2}$
그림에서 $a=3$일 때 $P(3,3)$, $Q(3,0)$이고 직선 $l$은 $y=x$, $H\left(\dfrac{3}{2},\dfrac{3}{2}\right)$이므로 $\overline{QH}=\sqrt{\left(\dfrac{3}{2}\right)^2+\left(\dfrac{3}{2}\right)^2}=\dfrac{3\sqrt{2}}{2}$
따라서 정답은 ②이다.
~~~

**시각물 별도 QA**: 문제 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q15.svg`; 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q15-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q15-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q15-solution.plan.json`

---

### 16번 — 유리함수와 삼각형 넓이 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $y=\dfrac{4}{x}$의 그래프의 제1사분면 위의 점 $A$와 두 점 $B(-3,-1)$, $C(5,-5)$를 꼭짓점으로 하는 삼각형 $ABC$의 넓이의 최솟값은? [4.6점]
~~~

**보기 원문**

~~~text
① $10+8\sqrt{2}$
② $5+4\sqrt{2}$
③ $10+4\sqrt{2}$
④ $15+8\sqrt{2}$
⑤ $20+16\sqrt{2}$
~~~

**정답 원문**

~~~text
①
~~~

**독립 수학 판정 근거**: A=(t,4/t), 직선 BC: x+2y+5=0, 삼각형 넓이 2(t+8/t+5)≥10+8√2.

**해설 원문**

~~~text
점 $A$의 좌표를 $A\left(t,\dfrac{4}{t}\right)$ $(t>0)$로 놓는다.
직선 $BC$의 기울기: $\dfrac{-5-(-1)}{5-(-3)}=-\dfrac{1}{2}$
직선 $BC$: $y+1=-\dfrac{1}{2}(x+3)$ $\Rightarrow$ $x+2y+5=0$
선분 $BC$의 길이: $\overline{BC}=\sqrt{(5+3)^2+(-5+1)^2}=\sqrt{80}=4\sqrt{5}$
점 $A$와 직선 $BC$ 사이의 거리를 $h$라 하면 ($t>0$이므로 절댓값 안은 양수)
$h=\dfrac{\left|t+2\cdot\frac{4}{t}+5\right|}{\sqrt{1^2+2^2}}=\dfrac{t+\frac{8}{t}+5}{\sqrt{5}}$
삼각형 $ABC$의 넓이 $S=\dfrac{1}{2}\times\overline{BC}\times h=\dfrac{1}{2}\times4\sqrt{5}\times\dfrac{t+\frac{8}{t}+5}{\sqrt{5}}$
$\Rightarrow S=2\left(t+\dfrac{8}{t}+5\right)$
$t>0,\ \dfrac{8}{t}>0$이므로 산술평균과 기하평균의 관계에 의하여
$t+\dfrac{8}{t}\ge2\sqrt{t\times\dfrac{8}{t}}=2\sqrt{8}=4\sqrt{2}$
등호는 $t=\dfrac{8}{t}$, 즉 $t^2=8$, $t=2\sqrt{2}$일 때 성립한다.
$S\ge2\left(4\sqrt{2}+5\right)=10+8\sqrt{2}$
그림에서 $t=2\sqrt{2}$이면 $A(2\sqrt{2},\sqrt{2})$이다.
따라서 넓이의 최솟값은 $10+8\sqrt{2}$이고 정답은 ①이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q16-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q16-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q16-solution.plan.json`

---

### 17번 — 역함수와 도형 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
원점을 지나는 일차함수 $y=f(x)$의 그래프가 $x$축의 양의 방향과 이루는 각의 크기는 $60^\circ$이다. 함수 $f$의 역함수를 $g$라 할 때, 양수 $k$에 대하여 직선 $m:\ y=g(x-k)+k$가 두 직선 $y=x$, $y=f(x)$와 만나는 점을 각각 $A$, $B$라 하자. 삼각형 $OAB$의 넓이가 $16-8\sqrt{3}$일 때, $k$의 값은? [4.6점]
~~~

**보기 원문**

~~~text
① $2$
② $3$
③ $4$
④ $5$
⑤ $6$
~~~

**정답 원문**

~~~text
③
~~~

**독립 수학 판정 근거**: f=√3x,g=x/√3, A=(k,k), B=((√3−1)k/2,(3−√3)k/2); 넓이 (2−√3)k²/2=8(2−√3) ⇒k4.

**해설 원문**

~~~text
직선 $y=f(x)$는 원점을 지나고 $x$축의 양의 방향과 $60^\circ$를 이루므로 기울기가 $\tan60^\circ=\sqrt{3}$이다.
$\Rightarrow f(x)=\sqrt{3}x$
역함수: $y=\sqrt{3}x$에서 $x=\dfrac{y}{\sqrt{3}}$이므로 $g(x)=\dfrac{x}{\sqrt{3}}$
직선 $m:\ y=g(x-k)+k=\dfrac{x-k}{\sqrt{3}}+k$ ㉠
[점 $A$] ㉠과 $y=x$의 교점: $x=\dfrac{x-k}{\sqrt{3}}+k$
양변에 $\sqrt{3}$을 곱하면 $\sqrt{3}x=x-k+\sqrt{3}k$
$(\sqrt{3}-1)x=(\sqrt{3}-1)k$ $\Rightarrow x=k$, 따라서 $A(k,k)$
[점 $B$] ㉠과 $y=\sqrt{3}x$의 교점: $\sqrt{3}x=\dfrac{x-k}{\sqrt{3}}+k$
양변에 $\sqrt{3}$을 곱하면 $3x=x-k+\sqrt{3}k$ $\Rightarrow 2x=(\sqrt{3}-1)k$
$x=\dfrac{(\sqrt{3}-1)k}{2},\ y=\sqrt{3}x=\dfrac{(3-\sqrt{3})k}{2}$
따라서 $B\left(\dfrac{(\sqrt{3}-1)k}{2},\ \dfrac{(3-\sqrt{3})k}{2}\right)$
[넓이] 원점 $O$, $A(x_1,y_1)$, $B(x_2,y_2)$로 이루어진 삼각형의 넓이는 $\dfrac{1}{2}\left|x_1y_2-x_2y_1\right|$이다.
$\dfrac{1}{2}\left|k\times\dfrac{(3-\sqrt{3})k}{2}-\dfrac{(\sqrt{3}-1)k}{2}\times k\right|$
$=\dfrac{k^2}{4}\left|(3-\sqrt{3})-(\sqrt{3}-1)\right|=\dfrac{k^2}{4}(4-2\sqrt{3})=\dfrac{(2-\sqrt{3})k^2}{2}$
넓이가 $16-8\sqrt{3}=8(2-\sqrt{3})$이므로 $\dfrac{(2-\sqrt{3})k^2}{2}=8(2-\sqrt{3})$
$\Rightarrow k^2=16$, $k>0$이므로 $k=4$
그림에서 $k=4$이면 $A(4,4)$, $B(-2+2\sqrt{3},\ 6-2\sqrt{3})$이다.
따라서 정답은 ③이다.
~~~

**시각물 별도 QA**: 문제 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q17.svg`; 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q17-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q17-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q17-solution.plan.json`

---

### 18번 — 유리함수와 무리함수의 교점 / 단답형 / KEEP_MATH

**문제 원문**

~~~text
<단답형 1> 두 함수 $y=\dfrac{x+3}{x-1}$, $y=\sqrt{x-k}$의 그래프가 서로 다른 두 점에서 만나도록 하는 실수 $k$의 값의 범위를 구하시오. [4점]
~~~

**정답 원문**

~~~text
$k\le-3$
~~~

**독립 수학 판정 근거**: 교점의 y=u≥0에서 k=1+4/(u−1)−u²; u>1에서 항상1해, 0≤u<1에서 k≤−3일 때1해 ⇒범위 k≤−3.

**해설 원문**

~~~text
두 그래프의 교점의 $y$좌표를 $u$라 하면 $u=\sqrt{x-k}\ge0$이다.
$y=\dfrac{x+3}{x-1}=1+\dfrac{4}{x-1}$이므로 $u=1+\dfrac{4}{x-1}$ ($u\ne1$)
이 식에서 $x-1=\dfrac{4}{u-1}$, 즉 $x=1+\dfrac{4}{u-1}$ — $u$의 값 하나마다 교점의 $x$좌표가 하나씩 정해진다.
$u=\sqrt{x-k}$에서 $u^2=x-k$, 즉 $k=x-u^2$
$x=1+\dfrac{4}{u-1}$을 대입하면 $k=1+\dfrac{4}{u-1}-u^2$ ㉠
서로 다른 두 점에서 만나려면 ㉠을 만족시키는 서로 다른 $u$ ($u\ge0,\ u\ne1$)가 $2$개 있어야 한다.
$K(u)=1+\dfrac{4}{u-1}-u^2$이라 하고 구간을 나누어 변화를 본다.
(i) $0\le u<1$: $\dfrac{4}{u-1}$과 $-u^2$이 모두 감소하므로 $K(u)$는 감소한다.
$K(0)=1-4-0=-3$이고 $u\to1$이면 $K(u)\to-\infty$이므로 $K(u)$의 값의 범위는 $K(u)\le-3$
(ii) $u>1$: $\dfrac{4}{u-1}$과 $-u^2$이 모두 감소하므로 $K(u)$는 감소한다.
$u\to1$이면 $K(u)\to\infty$, $u\to\infty$이면 $K(u)\to-\infty$이므로 $K(u)$는 모든 실수 값을 한 번씩 가진다.
따라서 ㉠을 만족시키는 $u$는
$u>1$에서 $k$의 값에 관계없이 정확히 $1$개,
$0\le u<1$에서 $k\le-3$일 때만 정확히 $1$개 (그 밖에는 $0$개)이다.
서로 다른 두 점에서 만나는 조건은 $k\le-3$
확인: $k=-3$이면 $(-3,0)$과 $u=\dfrac{1+\sqrt{17}}{2}$인 점에서 만난다.
따라서 답은 $k\le-3$이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q18-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q18-solution.plan.json`

---

### 19번 — 경우의 수 / 단답형 / KEEP_MATH

**문제 원문**

~~~text
<단답형 2> 그림과 같이 두 개의 정삼각형과 세 개의 직사각형으로 이루어진 삼각기둥의 전개도가 있다. 세 직사각형은 한 줄로 이어져 있고, 두 정삼각형은 가운데 직사각형의 위쪽 변과 아래쪽 변에 각각 붙어 있다.<br>숫자 $1,2,3,4,5,6,7$ 중에서 같은 수를 여러 번 사용하는 것을 허락하여 다섯 개를 택해 다섯 개의 다각형 내부에 하나씩 적을 때, 다음 조건을 만족시키는 경우의 수를 구하시오. [6점]<br><div class="note-box">(가) 세 개의 직사각형에 적혀있는 수는 두 정삼각형에 적혀있는 수보다 작다.<br>(나) 그림의 전개도에서 변을 공유하는 두 직사각형에 있는 수는 서로 다르다.<br>(다) 두 정삼각형에 적혀있는 수는 서로 다르다.</div>
~~~

**정답 원문**

~~~text
$392$
~~~

**독립 수학 판정 근거**: 직사각형의 최댓 m에서 직사각형 수 m(m−1)²−(m−1)(m−2)²에 (7−m)(6−m)를 곱해 m2..5 합392.

**해설 원문**

~~~text
세 직사각형에 적는 수를 왼쪽부터 $a,\ b,\ c$, 두 정삼각형에 적는 수를 $p,\ q$라 하자.
(나) 그림의 전개도에서 변을 공유하는 직사각형은 (왼쪽, 가운데), (가운데, 오른쪽)이므로 $a\ne b,\ b\ne c$
(왼쪽과 오른쪽 직사각형은 전개도에서 변을 공유하지 않으므로 같은 수를 적어도 된다.)
(가) $a,\ b,\ c$는 모두 $p$와 $q$보다 작다.
(다) $p\ne q$
$a,\ b,\ c$ 중 가장 큰 수를 $m$이라 하고, $m$의 값에 따라 경우를 나눈다.
[정삼각형의 수] $p,\ q$는 $m$보다 큰 수 $7-m$개 중에서 서로 다른 두 수를 고른다.
$p$는 $(7-m)$가지, $q$는 $(6-m)$가지이므로 $(7-m)(6-m)$가지
[직사각형의 수] $1$부터 $m$까지의 수로 $a\ne b,\ b\ne c$가 되게 적는 방법의 수:
$a$는 $m$가지, $b$는 $a$와 다른 수 $(m-1)$가지, $c$는 $b$와 다른 수 $(m-1)$가지이므로 $m(m-1)^2$
가장 큰 수가 정확히 $m$이려면 이 중에서 $1$부터 $m-1$까지의 수만 쓴 경우 $(m-1)(m-2)^2$를 빼야 한다.
$\Rightarrow m(m-1)^2-(m-1)(m-2)^2$
$m=1$: $1\times0^2-0=0$ ($a\ne b$를 만족시킬 수 없다)
$m=2$: $(2\times1-0)\times(5\times4)=2\times20=40$
$m=3$: $(3\times4-2\times1)\times(4\times3)=10\times12=120$
$m=4$: $(4\times9-3\times4)\times(3\times2)=24\times6=144$
$m=5$: $(5\times16-4\times9)\times(2\times1)=44\times2=88$
$m=6$: $6$보다 큰 수는 $7$ 하나뿐이어서 서로 다른 두 정삼각형의 수를 적을 수 없다. $\Rightarrow 0$
곱의 법칙과 합의 법칙에 의하여 $40+120+144+88=392$
따라서 답은 $392$이다.
~~~

**시각물 별도 QA**: 문제 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q19-audit-rework.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q19-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q19-solution.plan.json`

---

### 20번 — 무리함수와 역함수 / 서술형 / KEEP_MATH

**문제 원문**

~~~text
<서·논술형 1> 함수 $f(x)=\sqrt{ax-12}+3$ $(a\ge4)$에 대하여 집합 $\left\{x\,\middle|\,x\ge\dfrac{12}{a}\right\}$에서 정의된 함수<br>$g(x)=\begin{cases}f(x)&(f(x)\ge f^{-1}(x)\text{인 경우})\\f^{-1}(x)&(f(x)<f^{-1}(x)\text{인 경우})\end{cases}$<br>가 있다. 실수 $t$ $(t\ge0)$에 대하여 함수 $y=g(x)$의 그래프와 직선 $y=x+t$가 만나는 서로 다른 점의 개수를 $h(t)$라 하자. $h(t)=2$를 만족하는 $t$가 $t=0$, $t=1$일 때, $g(11)$의 값을 풀이과정과 함께 상세하게 서술하시오. (단, $a$는 상수이다.) [10점]
~~~

**정답 원문**

~~~text
$19$
~~~

**독립 수학 판정 근거**: f⁻¹의 정의역≥3와 g의 정의역≥12/a가 양립하려면 a≤4, 조건 a≥4로 a4; g11=f⁻¹11=19; h0=h1=2 확인.

**해설 원문**

~~~text
[1] 상수 $a$의 값
$g$가 집합 $\left\{x\,\middle|\,x\ge\dfrac{12}{a}\right\}$에서 정의되려면 이 집합의 모든 $x$에 대하여 $f^{-1}(x)$도 정의되어야 한다.
$f(x)=\sqrt{ax-12}+3\ge3$이므로 $f$의 치역은 $\{y\,|\,y\ge3\}$이고, 이것이 $f^{-1}$의 정의역이다.
따라서 $\dfrac{12}{a}\ge3$이어야 하므로 $a\le4$
$a\ge4$와 함께 생각하면 $a=4$
$\Rightarrow f(x)=\sqrt{4x-12}+3=2\sqrt{x-3}+3$ $(x\ge3)$
[2] $f$와 $f^{-1}$의 대소와 $g(x)$
$y=2\sqrt{x-3}+3$에서 $\sqrt{x-3}=\dfrac{y-3}{2}$, $x=\dfrac{(y-3)^2}{4}+3$ $(y\ge3)$
$\Rightarrow f^{-1}(x)=\dfrac{(x-3)^2}{4}+3$ $(x\ge3)$
$f$는 증가함수이므로 $f(x)=f^{-1}(x)$인 점은 직선 $y=x$ 위에 있다.
(이유: $y=f(x)=f^{-1}(x)$라 하면 $f(y)=x$이다. $y>x$이면 $f(y)>f(x)=y>x$가 되어 $f(y)=x$에 모순이고, $y<x$이면 같은 방식으로 모순이다. 따라서 $y=x$이다.)
$f(x)=x$에서 $2\sqrt{x-3}+3=x$이고, $s=\sqrt{x-3}$ $(s\ge0)$으로 놓으면 $2s+3=s^2+3$
$s^2-2s=0$ $\Rightarrow s=0$ 또는 $s=2$ $\Rightarrow x=3$ 또는 $x=7$
두 그래프는 $x=3,\ 7$에서만 만나고 그 사이에서 대소가 바뀌지 않는다.
$x=4$: $f(4)=5>f^{-1}(4)=\dfrac{13}{4}$ $\Rightarrow$ $3\le x\le7$에서 $f(x)\ge f^{-1}(x)$
$x=12$: $f(12)=9<f^{-1}(12)=\dfrac{81}{4}+3$ $\Rightarrow$ $x\ge7$에서 $f(x)\le f^{-1}(x)$
$\Rightarrow g(x)=\begin{cases}2\sqrt{x-3}+3&(3\le x\le7)\\\dfrac{(x-3)^2}{4}+3&(x\ge7)\end{cases}$
[3] $h(t)$ 확인 (직선 $y=x+t$, $t\ge0$)
(i) $3\le x\le7$: $2\sqrt{x-3}+3=x+t$에서 $u=\sqrt{x-3}$ $(0\le u\le2)$로 놓으면 $2u+3=u^2+3+t$
$\Rightarrow t=2u-u^2=1-(u-1)^2$ — $u=0$에서 $t=0$, $u=1$에서 $t=1$, $u=2$에서 $t=0$
$t=0$: $u=0,\ 2$ ($2$개), $0<t<1$: $u$가 서로 다른 $2$개, $t=1$: $u=1$ ($1$개), $t>1$: $0$개
(ii) $x\ge7$: $\dfrac{(x-3)^2}{4}+3=x+t$에서 $s=x-3$ $(s\ge4)$로 놓으면 $\dfrac{s^2}{4}+3=s+3+t$
$\Rightarrow t=\dfrac{s(s-4)}{4}$ — $s\ge4$에서 증가하고 $s=4$에서 $t=0$이므로 $t\ge0$마다 정확히 $1$개
$t=0$일 때 (i)의 $u=2$와 (ii)의 $s=4$는 같은 점 $x=7$이다.
$\Rightarrow h(0)=2$, $0<t<1$이면 $h(t)=3$, $h(1)=2$, $t>1$이면 $h(t)=1$
즉 $h(t)=2$인 $t$는 $t=0,\ 1$뿐이므로 주어진 조건과 일치한다.
[4] $g(11)$의 값
$11\ge7$이므로 $g(11)=\dfrac{(11-3)^2}{4}+3=\dfrac{64}{4}+3=16+3=19$
따라서 $g(11)=19$이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q20-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q20-solution.plan.json`

---

### 21번 — 유리함수와 기하 / 서술형 / KEEP_MATH

**문제 원문**

~~~text
<서·논술형 2> 곡선 $y=\dfrac{6}{x}$와 직선 $y=-x+k$가 제1사분면에서 만나는 서로 다른 두 점을 각각 $A$, $B$라 하자. $\angle ABC=90^\circ$인 점 $C$가 곡선 $y=\dfrac{6}{x}$ 위에 있다. $\overline{AC}=2\sqrt{13}$이 되도록 하는 상수 $k$에 대하여 $k^2$의 값을 풀이과정과 함께 상세하게 서술하시오. (단, $k>2\sqrt{6}$이다.) [10점]
~~~

**정답 원문**

~~~text
$25$
~~~

**독립 수학 판정 근거**: 교점 A=(α,β),B=(β,α), αβ6, α+β=k; B에서 기울기1인 직선은 C=(−α,−β)에서 곡선 재교차; AC²=4(α²+β²)=52 ⇒k²=13+12=25.

**해설 원문**

~~~text
[1] 두 점 $A$, $B$의 좌표
$\dfrac{6}{x}=-x+k$의 양변에 $x$를 곱하여 정리하면 $x^2-kx+6=0$
두 점의 $x$좌표를 $\alpha,\ \beta$ $(\alpha\ne\beta)$라 하면 근과 계수의 관계에서
$\alpha+\beta=k,\ \alpha\beta=6$
곡선 위의 점이므로 $y$좌표는 $\dfrac{6}{\alpha}=\beta,\ \dfrac{6}{\beta}=\alpha$이다.
$\Rightarrow A(\alpha,\beta),\ B(\beta,\alpha)$
그림의 예: $k=5$이면 $\alpha,\beta=2,3$이고 $A(2,3)$, $B(3,2)$이다.
[2] 점 $C$의 좌표
직선 $AB$는 $y=-x+k$로 기울기가 $-1$이다.
$\angle ABC=90^\circ$이므로 직선 $BC$의 기울기는 $1$이다. (수직인 두 직선의 기울기의 곱은 $-1$)
직선 $BC$: $y-\alpha=x-\beta$ $\Rightarrow y=x+\alpha-\beta$
점 $C$는 곡선 위의 점이므로 $\dfrac{6}{x}=x+\alpha-\beta$ $\Rightarrow x^2+(\alpha-\beta)x-6=0$ ㉠
점 $B$도 직선 $BC$와 곡선의 교점이므로 ㉠의 한 근은 $\beta$이다. (대입: $\beta^2+(\alpha-\beta)\beta-6=\alpha\beta-6=0$)
㉠의 다른 한 근을 $\gamma$라 하면 근과 계수의 관계에서 $\beta\gamma=-6$ $\Rightarrow$ $\gamma=-\dfrac{6}{\beta}=-\alpha$
$C$의 $y$좌표는 $\dfrac{6}{-\alpha}=-\beta$이므로 $C(-\alpha,-\beta)$
그림의 예: $C(-2,-3)$
[3] $k^2$의 값
$\overline{AC}^2=\{\alpha-(-\alpha)\}^2+\{\beta-(-\beta)\}^2=4\alpha^2+4\beta^2=4(\alpha^2+\beta^2)$
$\overline{AC}=2\sqrt{13}$이므로 $4(\alpha^2+\beta^2)=52$ $\Rightarrow$ $\alpha^2+\beta^2=13$
$k^2=(\alpha+\beta)^2=\alpha^2+\beta^2+2\alpha\beta=13+2\times6=25$
확인: $k=5>2\sqrt{6}$이므로 조건을 만족시킨다.
따라서 $k^2=25$이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_금당고_2학기_기말_고1_유사/q21-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q21-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_금당고_2학기_기말_고1_유사_plans/q21-solution.plan.json`

---

## 감사 결론

- **21개 문항 전체의 텍스트 수학 감사 완료:** 정답 표기, 조건, 해설 내 계산이 독립 검산과 일치하여 모두 KEEP_MATH.
- 그림이 제공되거나 도형·경로·그래프의 시각적 전제를 쓰는 문항은 텍스트에 제시된 구조와 수치에 따라 판정했으며, 이미지 파일 자체의 정확성은 **VISUAL_QA_PENDING**.
- 원본 JS·이미지 파일에는 변경 사항 없음. 별도의 이미지 QA 완료 후 시각물 판정을 닫을 것.


---

## 후속 시각 검수 — 2026-11-22 (최신 판정)

- 결과: **VISUAL_QA_PASS**. 연결 그림 12개, 그림 포함 10문항, 결함 후보 0건.
- 절차: 실제 `archive/assets/images/24_금당고_2학기_기말_고1_유사/` 자산 존재 확인 → SVG/PNG 렌더 → 접촉 시트 육안 검사 → 본문·해설의 그래프, 좌표, 집합, 대응도 비교.
- [수학·시각 통합 마감 계획 및 전체 276건 보고서](./H1_2FINAL_SIMILAR_VISUAL_QA_20261122.md) 참조.
- 이전 본문에 기재된 `VISUAL_QA_PENDING` 또는 `NOT_RUN`은 **초기 수학 감사 당시 상태**이며, 후속 시각 검수 판정은 아래 표가 우선한다.

| 문항 | 검사한 이미지(원본 `archive/assets/images/24_금당고_2학기_기말_고1_유사/`) | 최신 판정 |
|---:|---|---|
| 3번 | `해설: q3-solution.svg` | VISUAL_QA_PASS |
| 5번 | `해설: q5-solution.svg` | VISUAL_QA_PASS |
| 8번 | `해설: q8-solution.svg` | VISUAL_QA_PASS |
| 10번 | `해설: q10-solution.svg` | VISUAL_QA_PASS |
| 11번 | `해설: q11-solution.svg` | VISUAL_QA_PASS |
| 15번 | `문제: q15.svg`, `해설: q15-solution.svg` | VISUAL_QA_PASS |
| 16번 | `해설: q16-solution.svg` | VISUAL_QA_PASS |
| 17번 | `문제: q17.svg`, `해설: q17-solution.svg` | VISUAL_QA_PASS |
| 19번 | `문제: q19-audit-rework.svg` | VISUAL_QA_PASS |
| 21번 | `해설: q21-solution.svg` | VISUAL_QA_PASS |

원본 JS·SVG·PNG는 수정하지 않았다. 결함 수정 후 해당 자산을 다시 렌더하고 문제·해설을 대조해야 최종 출고 판정이 가능하다.
