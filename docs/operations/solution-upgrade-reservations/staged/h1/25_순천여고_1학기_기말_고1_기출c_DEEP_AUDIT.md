# 2025 순천여고 고1 1학기 기말 — 전 문항 심층 감사

- lane: lane30; 고1 1학기 기말 기출 h1/1final 전담.
- sourcePath: `archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출c.js`; sourceBlobSha: `d2cb2ff61e126fac8196e3674210f07574c0e8e5`.
- q1~q21 standardCourse=공통수학1 및 단원 실제 확인. 원본 q1~q21 조건/보기/정답/solution 직접 읽음.
- 판정: 21/21, KEEP 21 / UPGRADE 0 / HOLD 0 / UNREAD 0.
- 기존 solutionImage SVG 6개도 GitHub 원본 읽기·로컬 래스터화·육안 판독: q2 `2e01f747a5a548fce478ad210f256cc46bdfdac6`, q3 `59d3f2dde0630f353005c3e7e73cff48547709df`, q5 `7e1837bdf4cb71119069423b0309ae75faa3bb55`, q8 `26ccd96674b82f2e6fd947278062eb91856b998c`, q10 `96b7ebe63b0aba6e91c33ab4be74d6672a0e5ca1`, q21 `fa602c956a3cb7cdc502d7ed8ffa89120b3cd781`.
- EXAM_AUDIT_COMPLETE=YES; EXAM_DRAFT_COMPLETE=YES (필수 수정 없음). 학생 화면/Golden/Negative 정식 QA NOT_RUN, 출고/시각 PASS 아님. JS/SVG/main 미변경.

## q1 — KEEP

- 원문 문제: 삼차방정식 $x^3-6x^2+11x-6=0$의 세 근 중에서 가장 큰 근과 가장 작은 근의 합은? [3.9점]
- 원문 보기: 1) $1$ / 2) $2$ / 3) $3$ / 4) $4$ / 5) $5$
- 원본 answer: ④
- 기존 solution 원문:

> [키포인트] 삼차방정식의 근을 구하기 위해 조립제법을 이용한다.
> 
> 계수의 합이 $1-6+11-6=0$이므로 $x=1$을 근으로 갖는다.
> 조립제법을 이용하면 $x^3-6x^2+11x-6 = (x-1)(x^2-5x+6) = (x-1)(x-2)(x-3) = 0$이다.
> 따라서 세 근은 $1, 2, 3$이다.
> 가장 큰 근은 $3$, 가장 작은 근은 $1$이므로
> 구하는 합은 $3+1=4$이다.
> 
> 따라서 정답은 ④이다.

- **KEEP 이유 / 독립 검산:** 계수합0으로 x=1을 확인한 뒤 (x−1)(x−2)(x−3)=0로 완전히 인수분해, 최소1·최대3 합4.
- qid=1; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q2 — KEEP

- 원문 문제: 연립부등식 $\begin{cases} 6x-7 < x+3 \\ x^2-4x+3 \ge 0 \end{cases}$을 만족시키는 실수 $x$의 최댓값은? [4점]
- 원문 보기: 1) $1$ / 2) $2$ / 3) $3$ / 4) $4$ / 5) $5$
- 원본 answer: ①
- 기존 solution 원문:

> [키포인트] 각 부등식의 해를 구한 후 공통 범위를 찾는다.
> 
> 1) $6x-7 < x+3 \implies 5x < 10 \implies x < 2$
> 2) $x^2-4x+3 \ge 0 \implies (x-1)(x-3) \ge 0 \implies x \le 1$ 또는 $x \ge 3$
> 
> 두 부등식의 공통 범위를 구하면 $x \le 1$이다.
> 따라서 실수 $x$의 최댓값은 $1$이다.
> 
> 따라서 정답은 ①이다.

- **KEEP 이유 / 독립 검산:** 6x−7<x+3 ⇒ x<2와 (x−1)(x−3)≥0 ⇒ x≤1 또는 x≥3의 교집합 x≤1, 최댓값1. q2 해설 SVG 수직선의 세 구간도 실제 판독.
- qid=2; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 기존 solutionImage `assets/images/25_순천여고_1학기_기말_고1_기출c/q2-solution.svg` SVG 원본 확인; 실제 학생 렌더 NOT_RUN.

## q3 — KEEP

- 원문 문제: 모든 실수 $x$에 대하여 이차부등식 <br>$x^2+2ax+4a+5 \ge 0$이 항상 성립하도록 하는 실수 $a$의 값의 범위는? [4.3점]
- 원문 보기: 1) $-5 < a < 1$ / 2) $-1 < a < 5$ / 3) $-1 \le a \le 5$ / 4) $a < -1$ 또는 $a > 5$ / 5) $a \le -1$ 또는 $a \ge 5$
- 원본 answer: ③
- 기존 solution 원문:

> [키포인트] 이차부등식이 항상 성립하려면 판별식 $D \le 0$이어야 한다.
> 
> 이차방정식 $x^2+2ax+4a+5 = 0$의 판별식을 $D$라 할 때, 모든 실수 $x$에 대하여 부등식이 성립하려면 $D/4 \le 0$이어야 한다.
> $\frac{D}{4} = a^2 - (4a+5) = a^2-4a-5 \le 0$
> $(a-5)(a+1) \le 0$이므로
> $-1 \le a \le 5$이다.
> 
> 따라서 정답은 ③이다.

- **KEEP 이유 / 독립 검산:** 위로 열린 이차식이 모든 x에서 ≥0 조건 D/4=a²−4a−5=(a−5)(a+1)≤0 ⇒ −1≤a≤5; q3 해설 SVG의 a=0,−2 비교 그래프 확인.
- qid=3; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 기존 solutionImage `assets/images/25_순천여고_1학기_기말_고1_기출c/q3-solution.svg` SVG 원본 확인; 실제 학생 렌더 NOT_RUN.

## q4 — KEEP

- 원문 문제: 방정식 $x^3+1=0$의 한 허근을 $\omega$라 할 때, 옳은 것만을 있는 대로 고른 것은? (단, $\overline{\omega}$는 $\omega$의 켤레복소수) [4.5점]
<div style="display:block; margin:8px 0 0 0; padding:8px 10px; border:1px solid #000; box-sizing:border-box; line-height:1.7; text-align:left;">
&lt;보기&gt;
ㄱ. $\omega^3=1$<br>
ㄴ. $\omega+\omega^3+\omega^5=0$<br>
ㄷ. $\dfrac{2}{1-\omega}+\dfrac{2}{1-\overline{\omega}}=2$
</div>
- 원문 보기: 1) ㄱ / 2) ㄴ / 3) ㄷ / 4) ㄱ, ㄴ / 5) ㄴ, ㄷ
- 원본 answer: ⑤
- 기존 solution 원문:

> [키포인트] $x^3+1=0$의 허근 $\omega$는 $x^2-x+1=0$의 근이므로 $\omega^2-\omega+1=0$, $\omega^3=-1$을 만족한다. 또한 $|\omega|=1$이므로 $\overline{\omega}=\dfrac{1}{\omega}$이다.
> 
> ㄱ. $\omega^3=-1$이므로 $\omega^3=1$은 거짓이다.
> 
> ㄴ. $\omega^3=-1$, $\omega^5=\omega^2\omega^3=-\omega^2$이므로
> $\omega+\omega^3+\omega^5=\omega-1-\omega^2$이다.
> $\omega^2-\omega+1=0$에서 $\omega^2=\omega-1$이므로
> $\omega-1-(\omega-1)=0$이다.
> 따라서 ㄴ은 참이다.
> 
> ㄷ. $\omega+\overline{\omega}=1$, $\omega\overline{\omega}=1$이고 $1-\omega=\overline{\omega}$, $1-\overline{\omega}=\omega$이다.
> 따라서
> $\dfrac{2}{1-\omega}+\dfrac{2}{1-\overline{\omega}}=\dfrac{2}{\overline{\omega}}+\dfrac{2}{\omega}=2\omega+2\overline{\omega}=2(\omega+\overline{\omega})=2$이다.
> 따라서 ㄷ은 참이다.
> 
> 옳은 것은 ㄴ, ㄷ이다.
> 
> 따라서 정답은 ⑤이다.

- **KEEP 이유 / 독립 검산:** ω³=−1, ω²=ω−1 및 켤레근 ω+ω̄=1,ωω̄=1로 ㄱ 거짓, ㄴ 0, ㄷ 2를 직접 계산하여 ㄴ·ㄷ 참.
- qid=4; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q5 — KEEP

- 원문 문제: 부등식 $|x+3|+2|x-5| \le 10$을 만족시키는 $x$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$의 값은? [4.7점]
- 원문 보기: 1) $16$ / 2) $17$ / 3) $18$ / 4) $19$ / 5) $20$
- 원본 answer: ②
- 기존 solution 원문:

> [키포인트] 절댓값 기호 안이 $0$이 되는 $x=-3, 5$를 기준으로 범위를 나눈다.
> 
> 1) $x < -3$: $-(x+3)-2(x-5) \le 10 \implies -3x+7 \le 10 \implies x \ge -1$ (해 없음)
> 2) $-3 \le x < 5$: $(x+3)-2(x-5) \le 10 \implies -x+13 \le 10 \implies x \ge 3$
> 범위는 $3 \le x < 5$
> 3) $x \ge 5$: $(x+3)+2(x-5) \le 10 \implies 3x-7 \le 10 \implies x \le \dfrac{17}{3}$
> 범위는 $5 \le x \le \dfrac{17}{3}$
> 각 경우의 해를 합치면 $3 \le x \le \dfrac{17}{3}$이므로 $M=\dfrac{17}{3}, m=3$이다.
> $Mm = \dfrac{17}{3} \times 3 = 17$이다.
> 
> 따라서 정답은 ②이다.

- **KEEP 이유 / 독립 검산:** 절댓값 경계 −3,5로 구간 분리. 좌측 공집합, 중앙 3≤x<5, 우측 5≤x≤17/3; m=3,M=17/3, 곱17. q5 SVG 두 교점 x=3,17/3 확인.
- qid=5; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 기존 solutionImage `assets/images/25_순천여고_1학기_기말_고1_기출c/q5-solution.svg` SVG 원본 확인; 실제 학생 렌더 NOT_RUN.

## q6 — KEEP

- 원문 문제: 방정식 $x^2y^2+x^2+4y^2=10xy-9$를 만족시키는 양수 $x, y$에 대하여 $x+y$의 값은? [4.8점]
- 원문 보기: 1) $\frac{\sqrt{6}}{2}$ / 2) $\sqrt{6}$ / 3) $\frac{3\sqrt{6}}{2}$ / 4) $2\sqrt{6}$ / 5) $\frac{5\sqrt{6}}{2}$
- 원본 answer: ③
- 기존 solution 원문:

> [키포인트] 주어진 식을 완전제곱식의 합으로 변형한다.
> 
> $x^2y^2-6xy+9 + x^2-4xy+4y^2 = 0$으로 정리하면
> $(xy-3)^2 + (x-2y)^2 = 0$이다.
> $xy=3, x=2y$를 연립하면 $2y^2=3 \implies y^2=\dfrac{3}{2}$이다.
> $y>0$이므로 $y=\dfrac{\sqrt{6}}{2}, x=\sqrt{6}$이다.
> $x+y = \sqrt{6} + \dfrac{\sqrt{6}}{2} = \dfrac{3\sqrt{6}}{2}$이다.
> 
> 따라서 정답은 ③이다.

- **KEEP 이유 / 독립 검산:** 주어진 식을 (xy−3)²+(x−2y)²=0으로 정확히 재배열하여 xy=3,x=2y, 양수 조건으로 y=√6/2,x=√6, 합3√6/2.
- qid=6; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q7 — KEEP

- 원문 문제: $x, y$가 실수일 때, 두 이차방정식 <br>$x^2-ax+2b=0, x^2-bx+2a=0$이 오직 하나의 공통근을 갖고, 두 이차방정식의 근 중에서 공통근이 아닌 두 근의 차가 $2$일 때, 실수 $a, b$에 대하여 $a+2b$의 값은? (단, $a>b$) [4.9점]
- 원문 보기: 1) $-4$ / 2) $-3$ / 3) $-2$ / 4) $-1$ / 5) $0$
- 원본 answer: ①
- 기존 solution 원문:

> [키포인트] 공통근을 $\alpha$라 하고 두 식을 빼서 관계를 살핀다.
> 
> $(\alpha^2-a\alpha+2b)-(\alpha^2-b\alpha+2a)=0 \implies (b-a)\alpha+2(b-a)=0$
> $a>b$이므로 $\alpha=-2$이다.
> $4+2a+2b=0 \implies a+b=-2$이다.
> 나머지 두 근을 $\beta_1, \beta_2$라 하면 근과 계수의 관계에 의해 $\beta_1=-b, \beta_2=-a$이다.
> $|\beta_1-\beta_2|=|a-b|=2$이고 $a>b$이므로 $a-b=2$이다.
> $a+b=-2, a-b=2$를 연립하면 $a=0, b=-2$이다.
> $a+2b = 0 + 2(-2) = -4$이다.
> 
> 따라서 정답은 ①이다.

- **KEEP 이유 / 독립 검산:** 두 식 차이를 (b−a)(α+2)=0로 두고 a>b라 α=−2, 대입 a+b=−2. 남은 근 −b,−a의 차2와 a>b로 a−b=2, a=0,b=−2, 합−4.
- qid=7; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q8 — KEEP

- 원문 문제: 삼차방정식 $x^3+2(m+1)x^2+(4m+3)x+6=0$이 $1$보다 작은 한 근과 $1$과 $4$ 사이에 서로 다른 두 실근을 갖도록 하는 $m$의 값으로 알맞은 것은? [5점]
- 원문 보기: 1) $-2.8$ / 2) $-1.8$ / 3) $-0.8$ / 4) $1.8$ / 5) $2.8$
- 원본 answer: ②
- 기존 solution 원문:

> [키포인트] 인수 $x+2$를 분리한 뒤, 나머지 이차식의 두 근이 $(1,4)$에 들어오도록 근의 위치 조건을 확인한다.
> 
> $x=-2$를 대입하면 식의 값이 $0$이므로
> $x^3+2(m+1)x^2+(4m+3)x+6=(x+2)(x^2+2mx+3)$이다.
> $x=-2<1$은 이미 조건을 만족하므로 $g(x)=x^2+2mx+3$의 두 근이 서로 다르고 모두 $1$과 $4$ 사이에 있어야 한다.
> 위로 열린 포물선의 축이 구간 안에 있고 양 끝에서 함수값이 양수이며 판별식이 양수이면, 축에서 음수가 되는 지점을 기준으로 두 근이 양 끝 사이에 하나씩 놓인다. 따라서
> 
> $\frac{D}{4}=m^2-3>0$
> $g(1)=4+2m>0$
> $g(4)=19+8m>0$
> $1<-m<4$
> 
> 을 만족해야 한다. 이를 풀면 각각
> $m< -\sqrt{3}$ 또는 $m>\sqrt{3}$, $m>-2$, $m>-\dfrac{19}{8}$, $-4<m<-1$이다.
> 공통 범위는 $-2<m<-\sqrt{3}$이다. 보기 중 이 범위에 속하는 값은 $-1.8$이다.
> 
> 따라서 정답은 ②이다.

- **KEEP 이유 / 독립 검산:** x+2 인수로 항상 근 −2를 확보하고 g=x²+2mx+3의 서로 다른 두 근이 (1,4)에 있을 판별식·끝값·축 조건을 함께 써 −2<m<−√3; 보기 −1.8. q8 SVG m=−1.85의 두 교점도 확인.
- qid=8; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 기존 solutionImage `assets/images/25_순천여고_1학기_기말_고1_기출c/q8-solution-v2.svg` SVG 원본 확인; 실제 학생 렌더 NOT_RUN.

## q9 — KEEP

- 원문 문제: 등산로 $A, B, C, D, E$ $5$개가 있는 산에서 등산로 한 개를 이용하여 올라갔다가 다른 등산로로 내려오는 경우의 수는? [3.7점]
- 원문 보기: 1) $9$ / 2) $10$ / 3) $12$ / 4) $16$ / 5) $20$
- 원본 answer: ⑤
- 기존 solution 원문:

> [키포인트] 올라가는 길과 내려오는 길의 선택을 곱의 법칙으로 계산한다.
> 
> 올라가는 등산로 선택: $5$가지
> 내려오는 등산로 선택: 올라간 길 제외 $4$가지
> 총 경우의 수: $5 \times 4 = 20$
> 
> 따라서 정답은 ⑤이다.

- **KEEP 이유 / 독립 검산:** 등산 오름 5개와 내려옴은 같은 길 제외 4개를 순서 있게 곱하여 20.
- qid=9; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q10 — KEEP

- 원문 문제: 서로 다른 두 주사위를 동시에 던질 때, 나오는 눈의 합이 $4$의 배수가 되는 경우의 수는? [4점]
- 원문 보기: 1) $5$가지 / 2) $6$가지 / 3) $7$가지 / 4) $8$가지 / 5) $9$가지
- 원본 answer: ⑤
- 기존 solution 원문:

> [키포인트] 눈의 합이 $4, 8, 12$가 되는 경우를 각각 찾아 합의 법칙을 적용한다.
> 
> 1) 합이 $4$: $(1,3), (2,2), (3,1) \to 3$가지
> 2) 합이 $8$: $(2,6), (3,5), (4,4), (5,3), (6,2) \to 5$가지
> 3) 합이 $12$: $(6,6) \to 1$가지
> 총 $3+5+1 = 9$가지이다.
> 
> 따라서 정답은 ⑤이다.

- **KEEP 이유 / 독립 검산:** 두 주사위의 합 4인 순서쌍3, 8인5, 12인1을 실제 나열해 9; q10 해설 SVG 6×6 표에서 해당 회색 칸 9개 대조.
- qid=10; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 기존 solutionImage `assets/images/25_순천여고_1학기_기말_고1_기출c/q10-solution.svg` SVG 원본 확인; 실제 학생 렌더 NOT_RUN.

## q11 — KEEP

- 원문 문제: 서로 다른 $5$개의 초콜릿을 세 명의 아이 $A, B, C$에게 나누어 줄 때, 다음 조건을 만족시키도록 나누어 주는 경우의 수는? [4.3점]
(가) $B$와 $C$는 각 $1$개씩 받는다.
(나) 아이 $A$는 $3$개의 초콜릿을 받는다.
- 원문 보기: 1) $20$ / 2) $24$ / 3) $28$ / 4) $32$ / 5) $36$
- 원본 answer: ①
- 기존 solution 원문:

> [키포인트] $A$가 받을 초콜릿을 먼저 선택하고 나머지를 배분한다.
> 
> $A$가 받을 초콜릿 $3$개를 택하는 방법: ${}_{5}C_{3} = 10$가지
> 남은 $2$개의 초콜릿을 $B, C$에게 각각 $1$개씩 주는 방법: ${}_{2}C_{1} \times 1 = 2$가지
> 전체 경우의 수: $10 \times 2 = 20$
> 
> 따라서 정답은 ①이다.

- **KEEP 이유 / 독립 검산:** A에게 다른 초콜릿 5C3=10, 남은 B,C 배정2!=2, 총20.
- qid=11; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q12 — KEEP

- 원문 문제: $1$부터 $9$까지의 자연수 중에서 서로 다른 $4$개의 수를 택하여 $4$자리 자연수를 만들 때, 짝수와 홀수가 각각 $2$개씩 포함되도록 하는 경우의 수는? [4.5점]
- 원문 보기: 1) $640$ / 2) $880$ / 3) $980$ / 4) $1024$ / 5) $1440$
- 원본 answer: ⑤
- 기존 solution 원문:

> [키포인트] 수의 조합을 뽑은 후 일렬로 나열한다.
> 
> 홀수($1,3,5,7,9$) 중 $2$개 선택: ${}_{5}C_{2} = 10$
> 짝수($2,4,6,8$) 중 $2$개 선택: ${}_{4}C_{2} = 6$
> 나열하는 방법: $4! = 24$
> 전체 경우의 수: $10 \times 6 \times 24 = 1440$
> 
> 따라서 정답은 ⑤이다.

- **KEEP 이유 / 독립 검산:** 홀수5개 중2개 5C2=10, 짝수4개 중2개 4C2=6, 4자리 자리배열4!=24, 총1440.
- qid=12; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q13 — KEEP

- 원문 문제: $5$명의 학생 $A, B, C, D, E$를 일렬로 세울 때, $A$는 맨 앞에 서고 $B$는 맨 뒤에 서지 않도록 하는 경우의 수는? [4.7점]
- 원문 보기: 1) $14$ / 2) $18$ / 3) $22$ / 4) $26$ / 5) $30$
- 원본 answer: ②
- 기존 solution 원문:

> [키포인트] $A$를 고정하고 여사건을 활용한다.
> 
> $A$를 맨 앞에 고정한 전체 나열: $4! = 24$
> $A$가 맨 앞, $B$가 맨 뒤에 오는 경우: $3! = 6$
> 조건 만족 경우: $24 - 6 = 18$
> 
> 따라서 정답은 ②이다.

- **KEEP 이유 / 독립 검산:** A 첫자리 고정 4!=24에서 B 마지막 고정 3!=6을 빼 18.
- qid=13; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q14 — KEEP

- 원문 문제: 아래와 같이 $10$개의 좌석이 나란히 있는 영화관에서 $A, B, C$ $3$명이 관람을 하는데 감염병 예방을 위한 사회적 거리 두기를 하기 위하여 $3$명이 각각 $2$자리 이상 떨어져 앉는 경우의 수는? [4.9점]
<div class='question-table-wrap'><table class='question-table'><tbody><tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr></tbody></table></div>
- 원문 보기: 1) $80$ / 2) $100$ / 3) $120$ / 4) $140$ / 5) $160$
- 원본 answer: ③
- 기존 solution 원문:

> [키포인트] 좌석 간격을 고려하여 조합을 변환한다.
> 
> 앉는 자리를 $x, y, z$라 하면 $1 \le x < y-2 < z-4 \le 6$이 되도록 바꿔 생각할 수 있다.
> 즉, $x, y-2, z-4$를 $1$부터 $6$까지 중 서로 다른 $3$개로 고르는 경우의 수는 ${}_{6}C_{3}=20$이다.
> 여기에 세 사람 $A, B, C$를 배치하는 방법 $3!=6$을 곱하면
> 전체 경우의 수는 $20 \times 6 = 120$이다.
> 
> 따라서 정답은 ③이다.

- **KEEP 이유 / 독립 검산:** 서로 적어도 두 좌석을 비우는 y−x≥3,z−y≥3; x,y−2,z−4가 1~6의 증가하는 세 수라 6C3=20, 사람 배정3!=6, 총120.
- qid=14; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q15 — KEEP

- 원문 문제: 두 행렬 $A=\begin{pmatrix} -2 & 3 \\ -7 & 0 \end{pmatrix}$와 $B=\begin{pmatrix} 4 & -1 \\ 1 & 0 \end{pmatrix}$에 대하여 $X-A=B$일 때, 행렬 $X$의 모든 성분의 합은? [3.7점]
- 원문 보기: 1) $-4$ / 2) $-2$ / 3) $0$ / 4) $2$ / 5) $4$
- 원본 answer: ②
- 기존 solution 원문:

> [키포인트] $X=A+B$를 구하여 성분들의 합을 계산한다.
> 
> $X = \begin{pmatrix} 2 & 2 \\ -6 & 0 \end{pmatrix}$이므로 성분합은 $2+2-6+0 = -2$이다.
> 
> 따라서 정답은 ②이다.

- **KEEP 이유 / 독립 검산:** X=A+B=[[2,2],[−6,0]]를 실제 더해 합 −2.
- qid=15; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q16 — KEEP

- 원문 문제: 행렬 $A=\begin{pmatrix} 1 & 3 \\ -1 & -2 \end{pmatrix}$에 대하여 $E+A+A^2+\cdots+A^n=O$를 만족시키는 $100$이하의 자연수 $n$의 개수는? [4.5점]
- 원문 보기: 1) $30$ / 2) $31$ / 3) $32$ / 4) $33$ / 5) $34$
- 원본 answer: ④
- 기존 solution 원문:

> [키포인트] $A^2+A+E=O$와 $A^3=E$를 이용해 세 항씩 묶어 합이 $O$가 되는 경우를 찾는다.
> 
> $A^2=\begin{pmatrix}-2&-3\\1&1\end{pmatrix}$이므로
> $A^2+A+E=\begin{pmatrix}-2&-3\\1&1\end{pmatrix}+\begin{pmatrix}1&3\\-1&-2\end{pmatrix}+\begin{pmatrix}1&0\\0&1\end{pmatrix}=O$이다.
> 따라서 $A^2=-A-E$이고
> $A^3=A(-A-E)=-A^2-A=E$이다. 그러므로 $E,A,A^2$가 세 항씩 반복되고 각 세 항의 합은 $O$이다.
> 
> $n+1$이 $3$의 배수이면 $E+A+\cdots+A^n$을 $E+A+A^2=O$인 묶음들로 나누어 합이 $O$가 된다. 반대로 $n+1$이 $3$의 배수가 아니면 완전한 세 항 묶음 뒤에 $E$ 또는 $E+A=-A^2$가 남으므로 합은 $O$가 아니다. ($A^3=E$이므로 $A^2\ne O$.)
> 따라서 $n+1=3k$, 즉 $n=3k-1$이다.
> $1\le n\le100$에서 $3k-1\le100$, 따라서 $1\le k\le33$이고 가능한 $n$은 $2,5,8,\ldots,98$로 $33$개이다.
> 
> 따라서 정답은 ④이다.

- **KEEP 이유 / 독립 검산:** A²=[[-2,−3],[1,1]], A²+A+E=O와 A³=E를 행렬곱으로 확인. n+1이 3의 배수여야 하므로 n=2,5,…,98 총33.
- qid=16; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q17 — KEEP

- 원문 문제: 영행렬이 아닌 두 이차 정사각행렬 $A, B$에 대하여 $A+B=E, AB=O$일 때, 다음 중 옳은 것만을 있는 대로 고른 것은? [4.7점]<div style="width:100%; margin:0; padding:4px 8px; border:1px solid #000; box-sizing:border-box; text-align:left; line-height:1.35;">
&lt;보기&gt;<br>
ㄱ. $BA=O$<br>
ㄴ. $(A+B)^2=A^2+2AB+B^2$<br>
ㄷ. $A^3+B^3=(A+B)^3$
</div>
- 원문 보기: 1) ㄱ / 2) ㄱ, ㄴ / 3) ㄱ, ㄷ / 4) ㄴ, ㄷ / 5) ㄱ, ㄴ, ㄷ
- 원본 answer: ⑤
- 기존 solution 원문:

> [키포인트] $A+B=E$, $AB=O$에서 $A^2=A$, $B^2=B$, $BA=O$를 얻어 각 보기를 판정한다.
> 
> $B=E-A$이므로
> $AB=A(E-A)=O$에서 $A-A^2=O$, 즉 $A^2=A$이다. 또
> $B^2=(E-A)^2=E-2A+A^2=E-A=B$이다.
> 
> ㄱ. $BA=(E-A)A=A-A^2=O$이므로 참이다.
> ㄴ. $(A+B)^2=A^2+AB+BA+B^2=A^2+B^2$이고, $AB=O$이므로 $A^2+2AB+B^2=A^2+B^2$이다. 따라서 참이다.
> ㄷ. $A^3=A^2=A$, $B^3=B^2=B$이므로 $A^3+B^3=A+B=E=(A+B)^3$이다. 따라서 참이다.
> 
> ㄱ, ㄴ, ㄷ이 모두 옳으므로 정답은 ⑤이다.

- **KEEP 이유 / 독립 검산:** B=E−A, AB=O ⇒ A²=A,B²=B, BA=O; 세 보기 ㄱ·ㄴ·ㄷ에 각 식을 대입하여 모두 참임을 증명.
- qid=17; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q18 — KEEP

- 원문 문제: 갑, 을 두 사람은 두 편의점 $A$와 $B$에서 세 상품 $P,Q,R$을 구매하려 한다. [표1]은 두 편의점에서 판매하는 상품 $P,Q,R$의 가격을 나타낸 것이고, [표2]는 갑과 을이 사려고 하는 세 상품의 개수를 나타낸 것이다. 다음 중 옳은 것만을 있는 대로 모두 고른 것은? [4.9점]<br><b style="line-height:1;">[표1] (단위: 원)</b><br><table style="width:92%; margin:0; border-collapse:collapse; font-size:0.86em; text-align:center; line-height:1;"><tr><th style="border:1px solid #000; padding:0 3px;"></th><th style="border:1px solid #000; padding:0 3px;">P</th><th style="border:1px solid #000; padding:0 3px;">Q</th><th style="border:1px solid #000; padding:0 3px;">R</th></tr><tr><td style="border:1px solid #000; padding:0 3px;">A</td><td style="border:1px solid #000; padding:0 3px;">2000</td><td style="border:1px solid #000; padding:0 3px;">1600</td><td style="border:1px solid #000; padding:0 3px;">1000</td></tr><tr><td style="border:1px solid #000; padding:0 3px;">B</td><td style="border:1px solid #000; padding:0 3px;">1800</td><td style="border:1px solid #000; padding:0 3px;">1500</td><td style="border:1px solid #000; padding:0 3px;">1200</td></tr></table><b style="line-height:1;">[표2] (단위: 개)</b><br><table style="width:92%; margin:0; border-collapse:collapse; font-size:0.86em; text-align:center; line-height:1;"><tr><th style="border:1px solid #000; padding:0 3px;"></th><th style="border:1px solid #000; padding:0 3px;">P</th><th style="border:1px solid #000; padding:0 3px;">Q</th><th style="border:1px solid #000; padding:0 3px;">R</th></tr><tr><td style="border:1px solid #000; padding:0 3px;">갑</td><td style="border:1px solid #000; padding:0 3px;">2</td><td style="border:1px solid #000; padding:0 3px;">3</td><td style="border:1px solid #000; padding:0 3px;">4</td></tr><tr><td style="border:1px solid #000; padding:0 3px;">을</td><td style="border:1px solid #000; padding:0 3px;">3</td><td style="border:1px solid #000; padding:0 3px;">4</td><td style="border:1px solid #000; padding:0 3px;">3</td></tr></table><div style="width:100%; margin:0; padding:2px 6px; border:1px solid #000; box-sizing:border-box; text-align:left; line-height:1.05; font-size:0.88em;">&lt;보기&gt;<br>ㄱ. 갑은 어느 편의점에서 상품을 구매해도 을보다 비용이 적게 든다.<br>ㄴ. 갑은 $A$편의점에서 구매하는 것이 $B$편의점에서 구매하는 것보다 $100$원 더 적게 든다.<br>ㄷ. 갑이 편의점 $A$에 지불해야 할 금액은 행렬 $\begin{pmatrix}2&3&4\\3&4&3\end{pmatrix}\begin{pmatrix}2000&1800\\1600&1500\\1000&1200\end{pmatrix}$의 $(1,1)$ 성분과 같다.</div>
- 원문 보기: 1) ㄱ / 2) ㄴ / 3) ㄷ / 4) ㄱ, ㄴ / 5) ㄱ, ㄴ, ㄷ
- 원본 answer: ⑤
- 기존 solution 원문:

> [키포인트] 각 구매 수량과 편의점별 가격을 곱해 갑과 을의 총액을 비교하고, 행렬 곱의 성분도 같은 계산인지 확인한다.
> 
> 갑이 A에서 쓰는 금액은
> $2\times2000+3\times1600+4\times1000$
> $=4000+4800+4000$
> $=12800$원이다.
> 갑이 B에서 쓰는 금액은
> $2\times1800+3\times1500+4\times1200$
> $=3600+4500+4800$
> $=12900$원이다.
> 을이 A에서 쓰는 금액은
> $3\times2000+4\times1600+3\times1000$
> $=6000+6400+3000$
> $=15400$원이다.
> 을이 B에서 쓰는 금액은
> $3\times1800+4\times1500+3\times1200$
> $=5400+6000+3600$
> $=15000$원이다.
> 
> ㄱ. A에서는 $12800<15400$, B에서는 $12900<15000$이므로 참이다.
> ㄴ. 갑의 B와 A 지출 차는 $12900-12800=100$원이므로 참이다.
> ㄷ. 주어진 행렬 곱의 $(1,1)$ 성분은 첫째 행과 첫째 열의 곱의 합인 $2\times2000+3\times1600+4\times1000=12800$이므로 갑이 A에 내는 금액과 같다. 참이다.
> 
> 따라서 ㄱ, ㄴ, ㄷ이 모두 옳아 정답은 ⑤이다.

- **KEEP 이유 / 독립 검산:** 문제 HTML 표의 가격·수량을 네 경우 계산해 갑 A12800/B12900, 을 A15400/B15000, ㄱ과 ㄴ 참; (1,1)행렬곱 2·2000+3·1600+4·1000=12800으로 ㄷ도 참.
- qid=18; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q19 — KEEP

- 원문 문제: <b>[서-논술형 1]</b> 
남학생 $5$명과 여학생 $4$명 중에서 $5$명의 대표를 뽑을 때, 남학생이 $3$명 이상 포함되도록 뽑는 경우의 수를 구하고, 그 과정을 서술하시오. [6점]
- 원문 보기: 없음(서술형)
- 원본 answer: $81$
- 기존 solution 원문:

> [키포인트] 남학생 수에 따라 경우를 나누어 조합을 합산한다.
> 
> 1) 남$3$, 여$2$: ${}_{5}C_{3} \times {}_{4}C_{2} = 10 \times 6 = 60$
> 2) 남$4$, 여$1$: ${}_{5}C_{4} \times {}_{4}C_{1} = 5 \times 4 = 20$
> 3) 남$5$, 여$0$: ${}_{5}C_{5} \times 1 = 1$
> 총 경우의 수: $60+20+1 = 81$
> 
> 따라서 구하는 값은 $81$이다.

- **KEEP 이유 / 독립 검산:** 남학생3·4·5명 경우를 겹치지 않게 분리하여 5C3·4C2=60,5C4·4C1=20,5C5=1, 합81.
- qid=19; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q20 — KEEP

- 원문 문제: <b>[서-논술형 2]</b> 
다음의 조건을 모두 만족시키는 이차 정사각행렬 $A$에 대하여 $(A+E)(A-E)=pA+qE$가 성립할 때, 정수 $p$와 $q$를 각각 구하고, 그 과정을 서술하시오. (단, 행렬 $E$는 이차단위행렬이다.) [6점]

(가) $(i, j)$ 성분 $a_{ij}$가 $a_{ij}+a_{ji}=0 (i=1, 2, j=1, 2)$이다.

(나) $A^2+2A+E$의 모든 성분의 합이 $-30$이다.

(다) $1$행의 모든 성분의 합은 양수이다.
- 원문 보기: 없음(서술형)
- 원본 answer: $p=0, q=-17$
- 기존 solution 원문:

> [키포인트] 조건 (가)로 $A$의 꼴을 정하고, (나), (다)로 $x$를 결정한 뒤 주어진 행렬의 곱을 계산한다.
> 
> (가)에서 $2a_{11}=2a_{22}=0$이므로 대각성분은 $0$이고 $a_{12}+a_{21}=0$이다. $a_{12}=x$라 두면
> $A=\begin{pmatrix}0&x\\-x&0\end{pmatrix}$, $A^2=-x^2E$이다. 따라서
> $A^2+2A+E=\begin{pmatrix}1-x^2&2x\\-2x&1-x^2\end{pmatrix}$.
> 성분의 합은 $2(1-x^2)=-30$이므로 $x^2=16$이다. 1행의 합은 $x$이고 양수이므로 $x=4$이다.
> 
> $(A+E)(A-E)=A^2-E=-16E-E=-17E$이다.
> $A=\begin{pmatrix}0&4\\-4&0\end{pmatrix}$이므로
> $pA+qE=\begin{pmatrix}q&4p\\-4p&q\end{pmatrix}$.
> 주어진 식과 비교하면
> $\begin{pmatrix}q&4p\\-4p&q\end{pmatrix}=-17E=\begin{pmatrix}-17&0\\0&-17\end{pmatrix}$.
> 성분을 비교하여 $q=-17$, $4p=0$이므로 $p=0$이다.
> 
> 따라서 $p=0$, $q=-17$이다.

- **KEEP 이유 / 독립 검산:** 반대칭 조건에서 A=[[0,x],[−x,0]], A²=−x²E, 성분합 2(1−x²)=−30 ⇒ x²=16; 1행 합 x>0 ⇒ x=4; (A+E)(A−E)=A²−E=−17E ⇒ p=0,q=−17.
- qid=20; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 별도 문제·해설 이미지 없음; 실제 학생 렌더 NOT_RUN.

## q21 — KEEP

- 원문 문제: <b>[서-논술형 3]</b> 
이차부등식 $x^2-x < 0$을 만족하는 실수 $x$에 대하여 함수 $f(x)=x^2-2ax+a$의 함숫값이 항상 양수가 되도록 하는 상수 $a$의 값의 범위를 구하고, 그 과정을 서술하시오. [8점]
- 원문 보기: 없음(서술형)
- 원본 answer: $0 \le a \le 1$
- 기존 solution 원문:

> [키포인트] $x$의 열린 범위에서 완전제곱식으로 가능성을 보이고, 범위 밖의 $a$마다 허용되는 반례를 찾는다.
> 
> $x^2-x<0$에서 $x(x-1)<0$이므로 $0<x<1$이다.
> $f(x)=x^2-2ax+a=(x-a)^2+a(1-a)$이다.
> 
> $0<a<1$이면 $x=a$가 구간 안에 있고 $a(1-a)>0$이다. 따라서 모든 $0<x<1$에서 $f(x)\ge a(1-a)>0$이다.
> $a=0$이면 $f(x)=x^2>0$, $a=1$이면 $f(x)=(x-1)^2>0$이므로 두 경계값도 가능하다.
> 
> $a<0$ 또는 $a>1$일 때는 다음과 같이 식을 정리한다.
> $f(x)=x^2-x+[a-(2a-1)x]$.
> 대괄호가 $0$이 되도록 $t=\dfrac{a}{2a-1}$로 두면 $f(t)=t^2-t$이다.
> $a<0$이면 $0<t<\dfrac12$이고, $a>1$이면 $\dfrac12<t<1$이다. 두 경우 모두 $0<t<1$이므로 $f(t)=t(t-1)<0$이다. 따라서 이 두 범위의 $a$는 조건을 만족하지 않는다.
> 
> 따라서 구하는 범위는 $0\le a\le1$이다.

- **KEEP 이유 / 독립 검산:** 열린 구간 x(x−1)<0 ⇒ 0<x<1, f=(x−a)²+a(1−a). 0≤a≤1에서 엄격 양수, 밖에서는 t=a/(2a−1)∈(0,1) 대입 f(t)=t(t−1)<0인 반례 제시. q21 해설 SVG 예시 a=1/2의 꼭짓점(1/2,1/4) 확인.
- qid=21; sourceBlobSha=`d2cb2ff61e126fac8196e3674210f07574c0e8e5`; standardCourse=공통수학1; 기존 solutionImage `assets/images/25_순천여고_1학기_기말_고1_기출c/q21-solution.svg` SVG 원본 확인; 실제 학생 렌더 NOT_RUN.

## 감사 종료

- q1~q21 모든 문항을 원문 인용과 실제 식 중심으로 판정하였다. 여섯 해설 SVG를 별도로 판독했으며 수학적 결론과 충돌하지 않는다.
- UPGRADE 없음. Golden/Negative/학생 화면 렌더 NOT_RUN, SVG·JS·main 미변경, 출고 PASS 아님.
