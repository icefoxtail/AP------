# 고1 2학기 기말 유사시험지 전 문항 수학 감사 — 24_제일고_2학기_기말_고1_유사

- 감사일: 2026-11-22 (KST)
- 원본: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사.js`
- 원본 blob SHA: `585525f759b419251226b46ef14809d8f58fd646`
- 교육과정: 2015 개정, 수학(하)
- 감사 범위: **22개 전 문항**의 문제·보기·정답·해설 텍스트/수식 및 독립 계산 확인
- 수학 판정: **KEEP_MATH 22/22**, 정답·계산 불일치로 인한 변경 대상 0건
- 이미지/도형 검수: **VISUAL_QA_PENDING** — 실물 이미지 검수는 별도 수행하며, 이 문서의 수학 판정은 이미지 자체의 정확성을 확정하지 않음
- 문제 이미지 연결: 18번; 해설 이미지 연결: 12, 13, 16번
- 문제·해설 plan 파일 참조는 보존하되 이미지 생성/수정/렌더 검수를 포함하지 않음
- 원본 JS 및 이미지 파일은 변경하지 않고 감사 MD만 추가함

## 문항별 원문 및 검산 기록

### 1번 — 약수의 개수 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
$360$의 양의 약수의 개수는? [4.0점]
~~~

**보기 원문**

~~~text
① $22$
② $24$
③ $26$
④ $28$
⑤ $30$
~~~

**정답 원문**

~~~text
②
~~~

**독립 수학 판정 근거**: 360=2³·3²·5 ⇒ 약수 (3+1)(2+1)(1+1)=24.

**해설 원문**

~~~text
$360=2^3\times3^2\times5$이다.
양의 약수는 $2^a3^b5^c$의 꼴이다.
$2$의 지수 $a$는 $0,1,2,3$의 $4$가지,
$3$의 지수 $b$는 $0,1,2$의 $3$가지,
$5$의 지수 $c$는 $0,1$의 $2$가지이다.
각 지수를 독립적으로 고를 수 있으므로
$4\times3\times2=24$이다.
따라서 정답은 ②이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q01-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q01-solution.plan.json`

---

### 2번 — 명제와 집합 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
두 조건 $p$, $q$의 진리집합을 각각 $P$, $Q$라 하고 전체집합을 $U$라고 하자. $\sim p\Rightarrow q$일 때, 다음 중 항상 옳은 것은? [4.1점]
~~~

**보기 원문**

~~~text
① $P\cap Q=\varnothing$
② $P\subset Q$
③ $P\cup Q=U$
④ $Q-P=\varnothing$
⑤ $P^C=Q$
~~~

**정답 원문**

~~~text
③
~~~

**독립 수학 판정 근거**: Pᶜ⊆Q ⇔P∪Q=U; 다른 보기는 반례가 있어 필연 아님.

**해설 원문**

~~~text
$\sim p\Rightarrow q$가 참이므로 $\sim p$를 만족하는 원소는 모두 $q$를 만족한다.
$\sim p$의 진리집합은 $P^C$이므로
$P^C\subset Q$이다.
전체집합 $U$의 원소는 $P$에 속하거나 $P^C$에 속하고,
$P^C$의 원소는 모두 $Q$에 속하므로
$P\cup Q\supset P\cup P^C=U$이다.
따라서 $P\cup Q=U$이다.

다른 보기는 항상 성립하지 않는다.
$P=Q=U$이면 $P^C=\varnothing\subset Q$이므로 조건을 만족하지만
$P\cap Q=U\ne\varnothing$이고 $P^C=\varnothing\ne Q$이므로 ①, ⑤는 옳지 않다.
$P=U$, $Q=\varnothing$이면 조건을 만족하지만 $P\subset Q$는 성립하지 않으므로 ②는 옳지 않다.
$P=\varnothing$, $Q=U$이면 조건을 만족하지만 $Q-P=U\ne\varnothing$이므로 ④는 옳지 않다.
따라서 정답은 ③이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q02-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q02-solution.plan.json`

---

### 3번 — 명제의 추론 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
네 조건 $p,q,r,s$에 대하여 $p\Rightarrow\sim q$, $r\Rightarrow q$, $s\Rightarrow\sim r$이라고 할 때, 보기 중 옳지 않은 것은? [4.2점]
~~~

**보기 원문**

~~~text
① $q\Rightarrow\sim p$
② $p\Rightarrow\sim r$
③ $r\Rightarrow\sim s$
④ $r\Rightarrow\sim p$
⑤ $q\Rightarrow r$
~~~

**정답 원문**

~~~text
⑤
~~~

**독립 수학 판정 근거**: 대우·연쇄로 ①~④는 참; r⇒q의 역 q⇒r은 일반적으로 불성립.

**해설 원문**

~~~text
주어진 명제는
$p\Rightarrow\sim q$, $r\Rightarrow q$, $s\Rightarrow\sim r$이다.
각 명제의 대우는 다음과 같다.
$q\Rightarrow\sim p$, $\sim q\Rightarrow\sim r$, $r\Rightarrow\sim s$

① $p\Rightarrow\sim q$의 대우이므로 참이다.
③ $s\Rightarrow\sim r$의 대우이므로 참이다.
② $p\Rightarrow\sim q$와 $\sim q\Rightarrow\sim r$을 연결하면 $p\Rightarrow\sim r$이므로 참이다.
④ $r\Rightarrow q$와 $q\Rightarrow\sim p$를 연결하면 $r\Rightarrow\sim p$이므로 참이다.

반면 $r\Rightarrow q$는 주어졌지만 그 역인 $q\Rightarrow r$이 참이라는 근거는 없다.
$q$만 참이고 $p,r,s$는 모두 거짓인 경우 주어진 세 명제가 모두 성립하지만 $q\Rightarrow r$은 성립하지 않는다.
그러므로 옳지 않은 것은 ⑤이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q03-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q03-solution.plan.json`

---

### 4번 — 부등식과 명제 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
명제 '어떤 실수 $x$에 대하여 $-x^2+4x+k-2\gt0$이다.'의 부정이 참일 때 실수 $k$의 최댓값은? [4.4점]
~~~

**보기 원문**

~~~text
① $-2$
② $-1$
③ $0$
④ $1$
⑤ $2$
~~~

**정답 원문**

~~~text
①
~~~

**독립 수학 판정 근거**: 부정 참 ⇔∀x −(x−2)²+k+2≤0 ⇒k≤−2, 최댓−2.

**해설 원문**

~~~text
'어떤 실수 $x$에서 $-x^2+4x+k-2\gt0$'의 부정은
'모든 실수 $x$에서 $-x^2+4x+k-2\le0$'이다.
완전제곱식으로 고치면
$-x^2+4x+k-2$
$=-(x-2)^2+k+2$이다.
$-(x-2)^2$의 최댓값은 $x=2$일 때 $0$이므로
모든 실수 $x$에서 $0$ 이하이려면
$k+2\le0$
$k\le-2$이어야 한다.
따라서 $k$의 최댓값은 $-2$이고 정답은 ①이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q04-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q04-solution.plan.json`

---

### 5번 — 이웃하여 세우는 순열 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
흰 모자를 쓴 학생 $3$명과 검은 모자를 쓴 학생 $2$명, 모자를 쓰지 않은 학생 $3$명을 합하여 $8$명의 학생이 일렬로 줄을 설 때, 같은 색의 모자를 쓴 학생끼리 이웃하여 서는 경우의 수는? (단, 모자를 쓰지 않은 학생은 서로 이웃하지 않아도 된다.) [4.4점]
~~~

**보기 원문**

~~~text
① $4!\times3!\times2!$
② $5!\times3!\times2!$
③ $5!\times(3!+2!)$
④ $6!\times3!\times2!$
⑤ $8!$
~~~

**정답 원문**

~~~text
②
~~~

**독립 수학 판정 근거**: 흰 모자3 한 묶음·검은 모자2 한 묶음·맨머리3명 =>5!·3!·2!=1440.

**해설 원문**

~~~text
흰 모자 학생 $3$명을 한 묶음, 검은 모자 학생 $2$명을 다른 한 묶음으로 본다.
모자를 쓰지 않은 학생 $3$명은 각각 한 명씩 세면
배열할 대상은 모두 $5$개이다.
$5$개의 대상 배열: $5!$가지
흰 모자 묶음 안의 순서: $3!$가지
검은 모자 묶음 안의 순서: $2!$가지
이 선택들은 서로 독립이므로
$5!\times3!\times2!$
$=120\times6\times2=1440$가지이다.
따라서 정답은 ②이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q05-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q05-solution.plan.json`

---

### 6번 — 필요조건 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
두 조건 $p:x^2-x-12\lt0$, $q:(x-1)^2\le a$에 대하여 $p$는 $q$이기 위한 필요조건일 때 정수 $a$의 최댓값은? [4.5점]
~~~

**보기 원문**

~~~text
① $5$
② $6$
③ $7$
④ $8$
⑤ $9$
~~~

**정답 원문**

~~~text
④
~~~

**독립 수학 판정 근거**: P=(−3,4), Q=[1−√a,1+√a]⊂P ⇒√a<3, 정수 a최댓8.

**해설 원문**

~~~text
먼저 $p$의 진리집합을 구한다.
$x^2-x-12\lt0$
$(x-4)(x+3)\lt0$
$-3\lt x\lt4$이므로 $P=(-3,4)$이다.
$p$가 $q$이기 위한 필요조건이므로 $Q\subset P$이다.

$a\ge0$이면 $Q=[1-\sqrt a,\,1+\sqrt a]$이다.
양 끝점도 $P$에 포함되어야 하므로
$1-\sqrt a\gt-3$, $1+\sqrt a\lt4$이다.
$\sqrt a\lt4$, $\sqrt a\lt3$이고 $\sqrt a\lt3$이 더 강한 조건이므로
$0\le a\lt9$이다.
$a\lt0$이면 $Q=\varnothing$으로 포함관계는 성립하지만 최댓값에는 영향을 주지 않는다.
따라서 정수 $a$의 최댓값은 $8$이고 정답은 ④이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q06-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q06-solution.plan.json`

---

### 7번 — 색칠하는 경우의 수 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
정삼각형의 세 변의 중점을 차례로 이어 정삼각형을 합동인 $4$개의 작은 삼각형으로 나눈다. 가운데 삼각형을 $A$, 세 꼭짓점 쪽의 삼각형을 $B,C,D$, 큰 정삼각형의 바깥 영역을 $E$라 하자. 이 $5$개의 영역에 서로 다른 $4$가지 색 중 전부 혹은 일부를 사용하여 변(선분)을 공유하는 영역은 서로 다른 색으로 칠하는 방법의 수를 구하면? (단, 한 점에서만 만나는 영역은 인접하지 않은 것으로 본다.) [4.6점]
~~~

**보기 원문**

~~~text
① $156$
② $168$
③ $180$
④ $192$
⑤ $204$
~~~

**정답 원문**

~~~text
⑤
~~~

**독립 수학 판정 근거**: A와 E의 색 같으면 4·3³=108, 다르면 4·3·2³=96 ⇒204.

**해설 원문**

~~~text
안쪽 영역은 가운데 삼각형 $A$와 세 꼭짓점 쪽의 삼각형 $B,C,D$이고, 바깥 영역은 $E$이다.
변을 공유하는 인접한 영역은 $A-B$, $A-C$, $A-D$, $E-B$, $E-C$, $E-D$이다.
$B,C,D$끼리는 점 하나에서만 만나고, $A$와 $E$도 서로 맞닿지 않으므로 인접하지 않는다.

$A$와 $E$의 색이 같은지에 따라 경우를 나눈다.
(i) $A$와 $E$가 같은 색인 경우
$A$, $E$의 색: $4$가지
$B,C,D$는 각각 $A$와 다른 색이면 되므로 각각 $3$가지
$4\times3\times3\times3=108$가지
(ii) $A$와 $E$가 다른 색인 경우
$A$의 색: $4$가지, $E$의 색: $3$가지
$B,C,D$는 각각 $A$, $E$와 모두 달라야 하므로 각각 $2$가지
$4\times3\times2\times2\times2=96$가지

(i), (ii)는 동시에 일어날 수 없으므로
$108+96=204$가지이다.
따라서 정답은 ⑤이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q07-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q07-solution.plan.json`

---

### 8번 — 부분집합의 개수 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
전체집합 $U=\{1,2,3,4,5,6,7\}$의 공집합이 아닌 부분집합 $P$에 대하여 명제 '집합 $P$의 어떤 원소는 소수이다.'가 참이 되도록 하는 집합 $P$의 개수는? [4.7점]
~~~

**보기 원문**

~~~text
① $64$
② $96$
③ $104$
④ $112$
⑤ $120$
~~~

**정답 원문**

~~~text
⑤
~~~

**독립 수학 판정 근거**: 1..7 소수 네 개(2,3,5,7)를 하나 이상 포함하는 부분집합 2⁷−2³=120.

**해설 원문**

~~~text
전체집합 $U=\{1,2,3,4,5,6,7\}$에서 소수는 $2,3,5,7$의 $4$개이고, 소수가 아닌 원소는 $1,4,6$의 $3$개이다.
'어떤 원소는 소수'라는 말은 소수를 적어도 하나 포함한다는 뜻이다.

모든 부분집합은
$2^7=128$개이다.
소수를 하나도 포함하지 않는 부분집합은 $\{1,4,6\}$의 부분집합이므로
$2^3=8$개이다.
여기에는 공집합도 들어 있지만 빼는 두 집합에 모두 포함되므로 따로 보정할 필요가 없다.
$128-8=120$개이다.
따라서 정답은 ⑤이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q08-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q08-solution.plan.json`

---

### 9번 — 산술·기하평균 부등식 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
$x,y$가 양수이고 $x+y=10$일 때, $\dfrac4x+\dfrac9y$의 최솟값은? [4.8점]
~~~

**보기 원문**

~~~text
① $\dfrac52$
② $\dfrac{13}5$
③ $3$
④ $\dfrac72$
⑤ $5$
~~~

**정답 원문**

~~~text
①
~~~

**독립 수학 판정 근거**: AM−GM로 (4/x+9/y)(x+y)≥(2+3)²=25, x+y10 ⇒최솟5/2.

**해설 원문**

~~~text
$x,y\gt0$이고 $x+y=10$이다.
구하는 식과 주어진 합을 곱하면
$\left(\dfrac4x+\dfrac9y\right)(x+y)$
$=4+\dfrac{4y}{x}+\dfrac{9x}{y}+9$
$=13+\dfrac{4y}{x}+\dfrac{9x}{y}$이다.
$\dfrac{4y}{x}\gt0$, $\dfrac{9x}{y}\gt0$이므로 (산술평균)$\ge$(기하평균)에서
$\dfrac{4y}{x}+\dfrac{9x}{y}\ge2\sqrt{\dfrac{4y}{x}\times\dfrac{9x}{y}}=2\sqrt{36}=12$이다.

따라서
$\left(\dfrac4x+\dfrac9y\right)(x+y)\ge13+12=25$이다.
$x+y=10$을 대입하면
$\dfrac4x+\dfrac9y\ge\dfrac{25}{10}=\dfrac52$이다.
등호는 $\dfrac{4y}{x}=\dfrac{9x}{y}$, 즉 $2y=3x$일 때 성립하고, $x+y=10$에 의해 $x=4,\ y=6$이다.
따라서 최솟값은 $\dfrac52$이고 정답은 ①이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q09-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q09-solution.plan.json`

---

### 10번 — 유리식의 항등식 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
분모가 0이 되지 않도록 하는 모든 실수 $x$에 대하여 등식 $\dfrac3{x-2}+\dfrac2{x+3}-\dfrac7{x^2+x-6}=\dfrac{ax+b}{x^2+x-6}$가 성립할 때, $a+b$의 값은? [4.1점]
~~~

**보기 원문**

~~~text
① $-2$
② $3$
③ $5$
④ $7$
⑤ $10$
~~~

**정답 원문**

~~~text
②
~~~

**독립 수학 판정 근거**: 분자 3(x+3)+2(x−2)−7=5x−2; a5,b−2 ⇒합3.

**해설 원문**

~~~text
$x^2+x-6=(x-2)(x+3)$이므로 분모 조건은
$x\ne2$, $x\ne-3$이다.
공통분모로 통분하면
$\dfrac3{x-2}+\dfrac2{x+3}-\dfrac7{x^2+x-6}$
$=\dfrac{3(x+3)+2(x-2)-7}{(x-2)(x+3)}$이다.

분자를 세로로 전개하면
$3(x+3)+2(x-2)-7$
$=3x+9+2x-4-7$
$=5x-2$이다.
모든 허용된 $x$에서 항등식이 성립하므로 분자를 비교하여
$ax+b=5x-2$,
$a=5$, $b=-2$이다.
$a+b=5+(-2)=3$이므로 정답은 ②이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q10-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q10-solution.plan.json`

---

### 11번 — 유리함수의 대칭과 역함수 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $y=\dfrac{bx+c}{x+a}$의 그래프가 두 직선 $y=x-4$와 $y=-x+2$에 대하여 각각 대칭이고, 그 역함수의 그래프는 점 $(-2,1)$을 지난다. 이때, 상수 $a,b,c$의 곱 $abc$의 값은? [4.2점]
~~~

**보기 원문**

~~~text
① $-15$
② $-5$
③ $5$
④ $10$
⑤ $15$
~~~

**정답 원문**

~~~text
⑤
~~~

**독립 수학 판정 근거**: 대칭축 교점(3,−1)=중심(−a,b), a−3,b−1; 역함수 점(−2,1)↔원함수(1,−2) ⇒c5, abc15.

**해설 원문**

~~~text
분자를 분모에 맞추어 정리하면
$y=\dfrac{bx+c}{x+a}$
$=b+\dfrac{c-ab}{x+a}$이다.
따라서 그래프의 중심은 $(-a,b)$이다.
두 대칭축 $y=x-4$, $y=-x+2$의 교점이 중심이다.
$x-4=-x+2$
$2x=6$, $x=3$, $y=-1$이다.
즉 $(-a,b)=(3,-1)$이므로
$a=-3$, $b=-1$이다.

역함수의 그래프가 $(-2,1)$을 지나면 원함수는 $(1,-2)$를 지난다.
$-2=\dfrac{b\cdot1+c}{1+a}$
$=\dfrac{-1+c}{-2}$이므로
$-1+c=4$
$c=5$이다.
이때 $c-ab=5-3=2\ne0$이므로 유리함수가 맞다.
따라서
$abc=(-3)\times(-1)\times5=15$이고 정답은 ⑤이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q11-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q11-solution.plan.json`

---

### 12번 — 무리함수의 그래프 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $f(x)=\sqrt{-3x+6}-2$의 그래프에 대한 설명으로 옳지 않은 것은? [4.3점]
~~~

**보기 원문**

~~~text
① 정의역은 $\{x\mid x\le2\}$이다.
② 치역은 $\{y\mid y\ge-2\}$이다.
③ 제3사분면을 지나지 않는다.
④ $f^{-1}(x)=-\dfrac13(x+2)^2+2$ $(x\le2)$이다.
⑤ 함수 $y=\sqrt{-3x}$의 그래프를 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-2$만큼 평행이동한 것이다.
~~~

**정답 원문**

~~~text
④
~~~

**독립 수학 판정 근거**: −3x+6≥0⇒x≤2, 치역 y≥−2; 역함수 정의역은 x≥−2인데 ④가 x≤2로 오기.

**해설 원문**

~~~text
$f(x)=\sqrt{-3(x-2)}-2$이다.
① 제곱근 안이 음수가 아니어야 하므로
$-3x+6\ge0$, 즉 $x\le2$이다.
② $\sqrt{-3x+6}\ge0$이므로 $f(x)\ge-2$이고, 끝점 $(2,-2)$에서 $-2$를 갖는다.
③ $x\lt0$이면 $-3x+6\gt6$이므로
$f(x)\gt\sqrt6-2\gt0$이다. $x\lt0$일 때 $y\gt0$이므로 제3사분면을 지나지 않는다.
⑤ $y=\sqrt{-3x}$에서 $x$를 $x-2$로 바꾸고 $y$에서 $2$를 뺀 식이므로 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $-2$만큼 평행이동한 것이다.

④ 역함수는 $x$와 $y$를 바꾸어 구한다.
$y+2=\sqrt{-3x+6}$에서 $y\ge-2$이고,
$(y+2)^2=-3x+6$
$x=-\dfrac{(y+2)^2}{3}+2$이다.
따라서 $f^{-1}(x)=-\dfrac13(x+2)^2+2$의 정의역은 $x\ge-2$이다.
④에서 정의역을 $x\le2$라고 한 것은 틀리다.
따라서 정답은 ④이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_제일고_2학기_기말_고1_유사/q12-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q12-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q12-solution.plan.json`

---

### 13번 — 유리함수와 사분면 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $y=\dfrac{5x-3k+20}{x+2}$의 그래프가 제4사분면을 지나지 않도록 하는 모든 자연수 $k$의 개수는? [4.4점]
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
④
~~~

**독립 수학 판정 근거**: x>0에서는 분모 양수, 5x−3k+20≥0 항상 ⇔k≤20/3, 자연수6개.

**해설 원문**

~~~text
제4사분면에 있는 점은 $x\gt0$, $y\lt0$을 만족한다.
주어진 함수에서 $x\gt0$이면
$x+2\gt0$이므로 함수값의 부호는
$5x-3k+20$의 부호로 정해진다.
제4사분면을 지나지 않으려면 모든 $x\gt0$에서
$5x-3k+20\ge0$이어야 한다.

$5x$는 $x\gt0$에서 양수이며 $x$를 $0$에 가깝게 할 수 있으므로
$20-3k\ge0$이어야 하고, 이 조건이면 충분하다.
($20-3k\lt0$이면 $x$가 $0$에 충분히 가까울 때 $y\lt0$이 되어 제4사분면을 지난다.)
$3k\le20$
$k\le\dfrac{20}3$이다.
자연수 $k$는 $1,2,3,4,5,6$의 $6$개이다.
따라서 정답은 ④이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_제일고_2학기_기말_고1_유사/q13-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q13-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q13-solution.plan.json`

---

### 14번 — 무리함수의 부등식 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
$4\le x\le11$에서 $ax+1\le-\sqrt{x+5}+6\le bx+1$이 항상 성립할 때, 상수 $a,b$에 대하여 $a-b$의 최댓값은? [4.5점]
~~~

**보기 원문**

~~~text
① $-\dfrac12$
② $-\dfrac9{22}$
③ $-\dfrac4{11}$
④ $\dfrac9{22}$
⑤ $\dfrac12$
~~~

**정답 원문**

~~~text
②
~~~

**독립 수학 판정 근거**: R(x)=(5−√(x+5))/x는 4..11에서 감소, R(11)=1/11, R4=1/2; a−b최댓−9/22.

**해설 원문**

~~~text
$4\le x\le11$에서 $x\gt0$이므로 주어진 양쪽 부등식을 $x$로 나눌 수 있다.
$ax+1\le6-\sqrt{x+5}\le bx+1$에서
$a\le\dfrac{5-\sqrt{x+5}}x\le b$이다.
$R(x)=\dfrac{5-\sqrt{x+5}}x$라 하면
$a$는 $R$의 최솟값 이하, $b$는 최댓값 이상이어야 한다.

$u=\sqrt{x+5}$라 하면 $x=u^2-5$이고 $4\le x\le11$에서 $3\le u\le4$이다.
$R=\dfrac{5-u}{u^2-5}$
$3\le u\le4$에서 분자 $5-u$는 양수이고 $u$가 커질수록 작아진다.
분모 $u^2-5$는 양수이고 $u$가 커질수록 커진다.
따라서 $u$가 커지면 $R$은 작아지므로 $R(x)$는 $x$가 커질수록 감소한다.
최댓값은 $x=4$($u=3$)일 때 $R(4)=\dfrac{5-3}4=\dfrac12$이다.
최솟값은 $x=11$($u=4$)일 때 $R(11)=\dfrac{5-4}{11}=\dfrac1{11}$이다.

따라서 $a$는 최대 $\dfrac1{11}$, $b$는 최소 $\dfrac12$일 때
$a-b=\dfrac1{11}-\dfrac12=-\dfrac9{22}$로 최대이다.
정답은 ②이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q14-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q14-solution.plan.json`

---

### 15번 — 무리함수의 변환 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $y=\sqrt{3x+9}$의 그래프를 $x$축의 방향으로 $-1$만큼, $y$축의 방향으로 $2$만큼 평행이동한 후, $x$축에 대하여 대칭이동한 함수의 그래프는 점 $(k,-5)$를 지난다. 이때 상수 $k$의 값은? [4.6점]
~~~

**보기 원문**

~~~text
① $-1$
② $0$
③ $1$
④ $3$
⑤ $5$
~~~

**정답 원문**

~~~text
①
~~~

**독립 수학 판정 근거**: 왼쪽1·위2 이동 후 x축반사: y=−√(3x+12)−2; (k,−5)⇒k−1.

**해설 원문**

~~~text
처음 함수는 $y=\sqrt{3x+9}$이다.
왼쪽으로 $1$만큼 이동하므로 $x$를 $x+1$로 바꾸고, 위로 $2$만큼 이동한다.
$y=\sqrt{3(x+1)+9}+2$
$=\sqrt{3x+12}+2$이다.

이 그래프를 $x$축에 대하여 대칭이동하면 $y$를 $-y$로 바꾼다.
$-y=\sqrt{3x+12}+2$
$y=-\sqrt{3x+12}-2$이다.
정의역은 $3x+12\ge0$에서 $x\ge-4$이다.

점 $(k,-5)$가 그래프 위에 있으므로
$-5=-\sqrt{3k+12}-2$
$\sqrt{3k+12}=3$
$3k+12=9$
$3k=-3$
$k=-1$이다.
$k\ge-4$도 만족하므로 정답은 ①이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q15-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q15-solution.plan.json`

---

### 16번 — 유리함수의 평행이동 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $y=\dfrac{ax+b}{x+c}$의 그래프의 점근선의 방정식이 $x=2$, $y=5$이고, 평행이동에 의하여 함수 $y=\dfrac4x$의 그래프와 겹쳐질 수 있을 때, 상수 $a,b,c$에 대하여 $a+b+c$의 값은? [4.7점]
~~~

**보기 원문**

~~~text
① $-7$
② $-5$
③ $-3$
④ $1$
⑤ $5$
~~~

**정답 원문**

~~~text
③
~~~

**독립 수학 판정 근거**: y=(ax+b)/(x+c)=a+(b−ac)/(x+c); a5,c−2, 분자 계수 b+10=4 ⇒b−6, 합−3.

**해설 원문**

~~~text
수직점근선은 $x=-c$이고 수평점근선은 $y=a$이므로
$-c=2$, $a=5$이다.
따라서
$c=-2$, $a=5$이다.

함수를 표준형으로 고치면
$y=\dfrac{5x+b}{x-2}$
$=5+\dfrac{b+10}{x-2}$이다.
$y=\dfrac4x$의 그래프를 평행이동하면 분수의 분자 상수 $4$는 변하지 않는다.
그러므로
$b+10=4$
$b=-6$이다.
따라서
$a+b+c=5+(-6)+(-2)=-3$이므로 정답은 ③이다.
~~~

**시각물 별도 QA**: 해설 이미지 `assets/images/24_제일고_2학기_기말_고1_유사/q16-solution.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q16-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q16-solution.plan.json`

---

### 17번 — 유리함수와 대칭 직선 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
함수 $f(x)=\dfrac{x+20}{x+2}$의 그래프가 직선 $y=ax+b$ $(a\gt0)$에 대하여 대칭이고, $f(x)$의 그래프와 이 직선의 교점을 A, B라 할 때, 두 점 A, B 사이의 거리를 구하면? [4.7점]
~~~

**보기 원문**

~~~text
① $10$
② $12$
③ $9\sqrt2$
④ $8\sqrt3$
⑤ $6\sqrt6$
~~~

**정답 원문**

~~~text
②
~~~

**독립 수학 판정 근거**: f=1+18/(x+2)의 양의 기울기 대칭축 y=x+3; 교점 x=−2±3√2이므로 두 점 거리12.

**해설 원문**

~~~text
분자를 나누면
$f(x)=\dfrac{x+20}{x+2}$
$=1+\dfrac{18}{x+2}$이다.
중심은 $(-2,1)$이고 대칭축은
$y-1=\pm(x+2)$이다.
기울기 $a\gt0$인 대칭축은
$y-1=x+2$
$y=x+3$이다.

두 그래프의 교점은
$\dfrac{x+20}{x+2}=x+3$에서 구한다. ($x\ne-2$)
$x+20=(x+3)(x+2)$
$x+20=x^2+5x+6$
$x^2+4x-14=0$
$(x+2)^2=18$
$x=-2\pm3\sqrt2$이다.
$y=x+3$에 대입하면
$A=(-2-3\sqrt2,\,1-3\sqrt2)$,
$B=(-2+3\sqrt2,\,1+3\sqrt2)$이다.

두 점의 좌표 차는 각각 $6\sqrt2$이므로
$\overline{AB}=\sqrt{(6\sqrt2)^2+(6\sqrt2)^2}$
$=\sqrt{72+72}=12$이다.
따라서 정답은 ②이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q17-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q17-solution.plan.json`

---

### 18번 — 무리함수와 거리 / 객관식 / KEEP_MATH

**문제 원문**

~~~text
다음 그림과 같이 세 곡선 $y=\sqrt{x}+5$, $y=\sqrt{x}$, $y=\sqrt{x-5}$가 직선 $y=-x+k$와 만나는 점을 각각 A, B, C라 하고 $\overline{AB}=4\overline{BC}$일 때 상수 $k$의 값은? [4.8점]
~~~

**보기 원문**

~~~text
① $\dfrac{35}4$
② $9$
③ $\dfrac{37}4$
④ $\dfrac{19}2$
⑤ $10$
~~~

**정답 원문**

~~~text
①
~~~

**독립 수학 판정 근거**: A=(t²,t+5), C=(t²+5,t), 직선 y=−x+k에서 AB:BC=4:1 ⇒xB=t²+4, √(t²+4)=t+1 ⇒t3/2,k35/4.

**해설 원문**

~~~text
점 A의 $x$좌표를 $t^2$ ($t\ge0$), 점 C의 $x$좌표를 $u^2+5$ ($u\ge0$)이라 하자.
직선 $y=-x+k$ 위에 있으므로
A에서 $k=t^2+t+5$,
C에서 $k=u^2+u+5$이다.
따라서
$t^2+t=u^2+u$
$(t-u)(t+u+1)=0$이다.
$t,u\ge0$이므로 $t=u$이고
$x_C-x_A=5$이다.

세 점은 기울기 $-1$인 한 직선 위에 있으므로 선분 길이의 비는 $x$좌표 차의 비와 같다.
$\overline{AB}:\overline{BC}=4:1$에서
$x_B-x_A=4$, $x_C-x_B=1$이다.
따라서 $x_B=t^2+4$이다.

점 B의 $y$좌표를 $s=\sqrt{x_B}$라 하면
$s^2=t^2+4$이고
$k=x_B+s=t^2+4+s$이다.
A에서 구한 $k$와 같으므로
$t^2+t+5=t^2+4+s$
$s=t+1$이다.
따라서
$(t+1)^2=t^2+4$
$2t+1=4$
$t=\dfrac32$이다.
$k=t^2+t+5$
$=\dfrac94+\dfrac32+5=\dfrac{35}4$이다.
따라서 정답은 ①이다.
~~~

**시각물 별도 QA**: 문제 이미지 `assets/images/24_제일고_2학기_기말_고1_유사/q18.svg` — VISUAL_QA_PENDING

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q18-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q18-solution.plan.json`

---

### 19번 — 최댓값과 최솟값 / 서술형 / KEEP_MATH

**문제 원문**

~~~text
$x,y$가 실수이고 $x^2+y^2=10$일 때, $3x-y$의 최댓값과 최솟값이 되는 조건을 구하는 과정을 서술하시오. [4점]
~~~

**정답 원문**

~~~text
최댓값 $10$은 $(x,y)=(3,-1)$일 때, 최솟값 $-10$은 $(x,y)=(-3,1)$일 때
~~~

**독립 수학 판정 근거**: 코시−슈바르츠 (3x−y)²≤10(x²+y²)=100; 등호 x=−3y에서 (3,−1), (−3,1).

**해설 원문**

~~~text
$x^2+y^2=10$을 이용하여 $3x-y$의 범위를 구한다.
$10(x^2+y^2)-(3x-y)^2$
$=10x^2+10y^2-(9x^2-6xy+y^2)$
$=x^2+6xy+9y^2$
$=(x+3y)^2\ge0$이다.
따라서
$(3x-y)^2\le10(x^2+y^2)=100$
$-10\le3x-y\le10$이다.

등호는 $x+3y=0$, 즉 $x=-3y$일 때 성립한다.
이를 $x^2+y^2=10$에 대입하면
$(-3y)^2+y^2=10$
$10y^2=10$
$y=\pm1$이다.
$y=-1$이면 $x=3$이고 $3x-y=10$이다.
$y=1$이면 $x=-3$이고 $3x-y=-10$이다.
따라서 최댓값은 $(3,-1)$일 때 $10$, 최솟값은 $(-3,1)$일 때 $-10$이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q19-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q19-solution.plan.json`

---

### 20번 — 귀류법 / 서술형 / KEEP_MATH

**문제 원문**

~~~text
명제 '자연수 $n$에 대하여 $n^2$이 $3$의 배수이면 $n$도 $3$의 배수이다'가 참임을 귀류법을 이용하여 증명하시오. [5점]
~~~

**정답 원문**

~~~text
참
~~~

**독립 수학 판정 근거**: n mod3가1 또는2라면 n² mod3=1; n²≡0이라면 n≡0 (귀류법).

**해설 원문**

~~~text
$n^2$이 $3$의 배수라는 조건이 성립한다고 하자.
결론 '$n$은 $3$의 배수이다'를 부정하여 $n$이 $3$의 배수가 아니라고 가정한다.

자연수 $n$이 $3$의 배수가 아니면 $3$으로 나눈 나머지가 $1$ 또는 $2$이다.
따라서 어떤 음이 아닌 정수 $k$에 대하여
$n=3k+1$ 또는 $n=3k+2$로 쓸 수 있다.
(i) $n=3k+1$일 때
$n^2=(3k+1)^2=9k^2+6k+1=3(3k^2+2k)+1$이므로 $n^2$을 $3$으로 나눈 나머지는 $1$이다.
(ii) $n=3k+2$일 때
$n^2=(3k+2)^2=9k^2+12k+4=3(3k^2+4k+1)+1$이므로 $n^2$을 $3$으로 나눈 나머지는 $1$이다.

두 경우 모두 $n^2$은 $3$의 배수가 아니다.
이는 $n^2$이 $3$의 배수라는 조건과 모순이다.
따라서 $n$이 $3$의 배수가 아니라는 가정은 거짓이고, $n$은 $3$의 배수이다. 주어진 명제는 참이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q20-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q20-solution.plan.json`

---

### 21번 — 역함수 / 서술형 / KEEP_MATH

**문제 원문**

~~~text
함수 $f(x)=\dfrac{3x+1}{2x-4}$의 역함수 구하는 과정을 서술하고 역함수의 정의역과 치역을 구하시오. [5점]
~~~

**정답 원문**

~~~text
$f^{-1}(x)=\dfrac{4x+1}{2x-3}$, 정의역 $\mathbb{R}\setminus\left\{\dfrac32\right\}$, 치역 $\mathbb{R}\setminus\{2\}$
~~~

**독립 수학 판정 근거**: y=(3x+1)/(2x−4)에서 x=(4y+1)/(2y−3); 역함수 정의역 x≠3/2, 치역 y≠2.

**해설 원문**

~~~text
원함수의 분모가 $0$이면 안 되므로
$2x-4\ne0$,
$x\ne2$이다.

$y=\dfrac{3x+1}{2x-4}$에서 $x$를 $y$로 나타낸다.
$y(2x-4)=3x+1$
$2xy-4y=3x+1$
$2xy-3x=4y+1$
$(2y-3)x=4y+1$이다.
$y=\dfrac32$이면 $0=7$이 되어 불가능하므로
$y\ne\dfrac32$이다.
따라서
$x=\dfrac{4y+1}{2y-3}$이다.

여기서 $x$와 $y$를 바꾸면
$f^{-1}(x)=\dfrac{4x+1}{2x-3}$이다.
원함수의 치역은 $y\ne\dfrac32$이므로 역함수의 정의역은
$\mathbb R\setminus\left\{\dfrac32\right\}$이다.
원함수의 정의역은 $x\ne2$이므로 역함수의 치역은
$\mathbb R\setminus\{2\}$이다.

따라서 역함수는 $f^{-1}(x)=\dfrac{4x+1}{2x-3}$,
정의역은 $\mathbb R\setminus\left\{\dfrac32\right\}$,
치역은 $\mathbb R\setminus\{2\}$이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q21-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q21-solution.plan.json`

---

### 22번 — 무리함수와 넓이 / 서술형 / KEEP_MATH

**문제 원문**

~~~text
두 함수 $f(x)=\sqrt{3x}$, $g(x)=\sqrt{x}$의 그래프와 직선 $x=n$이 만나는 점을 각각 A, B라 하고, 직선 $x=n+5$가 만나는 점을 각각 C, D라 할 때, 사각형 ACDB의 넓이가 $\dfrac{25(\sqrt3-1)}2$일 때, $n$의 값을 구하는 과정을 서술하시오. (단, $n$은 자연수) [6점]
~~~

**정답 원문**

~~~text
4
~~~

**독립 수학 판정 근거**: AB=(√3−1)√n, CD=(√3−1)√(n+5)이고 평행선 거리5; √n+√(n+5)=5, 차1 ⇒n4.

**해설 원문**

~~~text
$n$은 자연수이므로 $n\gt0$이다.
$x=n$에서 위쪽 그래프 $y=\sqrt{3x}$와 아래쪽 그래프 $y=\sqrt x$ 사이의 길이는
$\overline{AB}=\sqrt{3n}-\sqrt n$
$=(\sqrt3-1)\sqrt n$이다.
마찬가지로 $x=n+5$에서
$\overline{CD}=\sqrt{3(n+5)}-\sqrt{n+5}$
$=(\sqrt3-1)\sqrt{n+5}$이다.

두 선분 $AB$, $CD$는 모두 $x$축에 수직이어서 서로 평행하며, 두 직선 $x=n$, $x=n+5$ 사이의 거리는 $5$이다.
따라서 사다리꼴 $ACDB$의 넓이는
$S=\dfrac12(\overline{AB}+\overline{CD})\times5$
$=\dfrac52(\sqrt3-1)(\sqrt n+\sqrt{n+5})$이다.
$S=\dfrac{25(\sqrt3-1)}2$을 대입하면
$\sqrt n+\sqrt{n+5}$
$=\dfrac{25(\sqrt3-1)}2\times\dfrac2{5(\sqrt3-1)}$
$=5$이다.

$u=\sqrt n$, $v=\sqrt{n+5}$라 하자.
$u+v=5$이고
$v^2-u^2=(n+5)-n=5$이므로
$(v-u)(v+u)=5$,
$v-u=\dfrac55=1$이다.
두 식을 더하면
$2v=6$, $v=3$이고,
이를 $u+v=5$에 대입하면
$u=2$이다.
따라서 $n=u^2=4$이다.

$n=4$를 대입하면 $\overline{AB}=2(\sqrt3-1)$, $\overline{CD}=3(\sqrt3-1)$이어서 넓이는 $\dfrac12\times5\times5(\sqrt3-1)=\dfrac{25(\sqrt3-1)}2$으로 주어진 조건과 일치한다.
따라서 구하는 자연수 $n$은 $4$이다.
~~~

**관련 plan**: `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q22-problem.plan.json`; `archive/exams/similar/high/h1/2final/24_제일고_2학기_기말_고1_유사_plans/q22-solution.plan.json`

---

## 감사 결론

- **22개 문항 전체의 텍스트 수학 감사 완료:** 정답 표기, 조건, 해설 내 계산이 독립 검산과 일치하여 모두 KEEP_MATH.
- 그림이 제공되거나 도형·경로·그래프의 시각적 전제를 쓰는 문항은 텍스트에 제시된 구조와 수치에 따라 판정했으며, 이미지 파일 자체의 정확성은 **VISUAL_QA_PENDING**.
- 원본 JS·이미지 파일에는 변경 사항 없음. 별도의 이미지 QA 완료 후 시각물 판정을 닫을 것.
