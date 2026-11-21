# 2025 순천고 2학기 기말 고1 — 학생용 해설 개선 원고 (lane10)

> **상태: MD 원고 / 출고 아님.** 원본 JS·SVG는 수정하지 않는다. 별도 그림 제작은 하지 않았으며 원본의 q17/q23 \`solutionImage\`와 렌더 품질 검수는 **NOT_RUN**이다.

- 원본: \`archive/exams/original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js\`
- 고정 원본 blob SHA: \`f1ddb53e840df67cb2f53e0e79f883e3fd58d3bb\`
- 실제 교육과정: **공통수학2**, \`standardCourse\` 확인
- 대상: **Q17, Q23**. 기존 풀이의 수식·문제·정답을 직접 읽은 뒤 개선.

## Q17 — 두 그래프의 교점, 정답 ② \(\displaystyle -\frac12\)

### 왜 바꾸는가

원본은 시작점과 직선의 기울기를 먼저 알아낸 뒤, \`A(t)\`, \`B(t)\` 두 다항식의 부호를 길게 추적한다. 계산 자체는 맞지만 학생 입장에서는 **“왜 기울기 \(-\frac12\)가 경계인가?”**와 **“그보다 작으면 왜 교점이 하나뿐인가?”**가 계산 중간에 묻힌다. 모든 직선이 \((1,1)\)을 통과한다는 그래프 사실부터 시작하여 두 가지를 각각 확인한다.

### 새 학생용 판서 해설 — 그래프 비교 풀이

\[
y=\left|\sqrt{2x+2}-2\right|,\qquad y=k(x-1)+1
\]

모든 직선은 \(x=1\)을 넣으면 \(y=1\)이므로 \((1,1)\)을 지난다.

무리함수의 정의역은 \(2x+2\ge0\), 즉 \(x\ge-1\)이고,

\[
\begin{aligned}
y&=2-\sqrt{2x+2} &&(-1\le x\le1),\\
y&=\sqrt{2x+2}-2 &&(x\ge1).
\end{aligned}
\]

따라서 왼쪽 가지는 \((-1,2)\)에서 \((1,0)\)까지 내려가고, 오른쪽 가지는 \((1,0)\)부터 올라간다.

점 \((1,1)\)과 왼쪽 가지의 **시작점** \((-1,2)\)를 잇는 직선의 기울기는

\[
k_0=\frac{2-1}{-1-1}=-\frac12
\]

이다. 이 기울기가 실제로 **최솟값**인지 확인하자.

**① \(k<-\frac12\)이면 왼쪽 가지와 만나지 않는다.**

경계 직선 \(k=-\frac12\)의 식은

\[
y=-\frac12(x-1)+1=\frac{3-x}{2}
\]

이다. 왼쪽 가지의 \(x\)는 \(-1\le x\le1\)이므로

\[
t=\sqrt{2x+2},\qquad 0\le t\le2,\qquad x=\frac{t^2}{2}-1
\]

로 놓는다. 경계 직선의 높이에서 무리함수의 높이를 빼면

\[
\begin{aligned}
\frac{3-x}{2}-\left(2-\sqrt{2x+2}\right)
&=\frac{3-\left(\frac{t^2}{2}-1\right)}2-(2-t)\\
&=2-\frac{t^2}{4}-2+t\\
&=t-\frac{t^2}{4}\\
&=t\left(1-\frac t4\right)\ge0.
\end{aligned}
\]

여기서 \(0\le t\le2\)이므로 마지막 식은 \(t=0\), 즉 \(x=-1\)일 때만 \(0\)이다.

이제 \(k<-\frac12\)이고 \(-1\le x<1\)이면 \(x-1<0\)이다. 따라서 부등호의 방향에 주의하면

\[
\begin{aligned}
k(x-1)+1
&>-\frac12(x-1)+1\\
&=\frac{3-x}{2}\\
&\ge2-\sqrt{2x+2}.
\end{aligned}
\]

즉 직선이 **왼쪽 가지보다 항상 위**에 있다. \(x=1\)에서도 직선의 높이는 \(1\), 곡선의 높이는 \(0\)이므로 만나지 않는다.

오른쪽 \(x\ge1\)에서는 곡선 \(\sqrt{2x+2}-2\)가 증가하고, \(k<0\)인 직선 \(k(x-1)+1\)은 감소한다. \(x=1\)에서는 직선이 위에 있고, \(x\)가 충분히 커지면 직선이 곡선보다 아래에 있으므로 **오른쪽에서는 정확히 한 번** 만난다.

그러므로 \(k<-\frac12\)로는 교점 두 개를 만들 수 없다.

**② \(k=-\frac12\)이면 실제로 두 점에서 만난다.**

왼쪽에서는 앞의 높이 차가 \(0\)이 되는

\[
t\left(1-\frac t4\right)=0,\quad 0\le t\le2
\quad\Longrightarrow\quad t=0\quad\Longrightarrow\quad x=-1
\]

에서 한 점 \((-1,2)\)을 얻는다.

오른쪽에서는 \(t=\sqrt{2x+2}\ge2,\ x=\frac{t^2}{2}-1\)로 놓고,

\[
\begin{aligned}
t-2&=-\frac12\left(\frac{t^2}{2}-2\right)+1\\
&=-\frac{t^2}{4}+2,\\
t^2+4t-16&=0,\\
t&=\frac{-4\pm\sqrt{16+64}}{2}\\
&=-2\pm2\sqrt5.
\end{aligned}
\]

\(t\ge2\)인 근은 \(t=-2+2\sqrt5\) 하나이므로 오른쪽에도 한 점이 있다. 왼쪽 점과 오른쪽 점은 \(x\)의 범위가 달라 서로 다르다.

\[
\boxed{k_{\min}=-\frac12}\qquad\boxed{\text{②}}
\]

**검산:** \(k=-\frac12\)일 때 왼쪽은 \(x=-1\) 한 점이고, 오른쪽은 \(t=-2+2\sqrt5>2\) 한 점이다. \(k<-\frac12\)일 때는 왼쪽 0점·오른쪽 1점이다. 두 점 조건과 최솟값 조건을 각각 확인했다.

### 기존 풀이와의 관계

원본의 \(A(t),B(t)\) 판별 방식도 정답은 같으므로 **오답 교정이 아니라 두 번째 접근법 추가**다. 학생용 기본 풀이로 위 그래프 비교법을 제안하고, 원본 방식은 선택적으로 보존할 수 있다.

## Q23 — 각 가지와 두 번씩 만나야 네 점, (2) \(\displaystyle k=1\)

### 왜 바꾸는가

원본은 \(t^2-t+1-k=0\), \(s^2-s+k-1=0\)까지는 좋지만, “판별식과 두 근의 합·곱이 양수이면 두 비음수 근”이라는 판단을 짧게 건너뛴다. 그래프를 처음 배우는 고1 학생에게는 **두 근을 실제로 보면서 ‘작은 근도 0 이상’임을 확인하는 전개**가 더 직접적이다.

### 새 학생용 판서 해설

**(1) 그래프**

\[
f(x)=
\begin{cases}
2-\sqrt{1-x}&(x\le1),\\
\sqrt{x-2}+3&(x\ge2).
\end{cases}
\]

첫째 가지는

\[
\begin{aligned}
x=1&\Longrightarrow y=2 &&\Rightarrow(1,2),\\
x=0&\Longrightarrow y=1 &&\Rightarrow(0,1),\\
x=-3&\Longrightarrow y=0 &&\Rightarrow(-3,0).
\end{aligned}
\]

\((1,2)\)를 **포함하는 끝점**으로 찍고, 왼쪽 아래로 이어 그린다.

둘째 가지는

\[
\begin{aligned}
x=2&\Longrightarrow y=3 &&\Rightarrow(2,3),\\
x=3&\Longrightarrow y=4 &&\Rightarrow(3,4),\\
x=6&\Longrightarrow y=5 &&\Rightarrow(6,5).
\end{aligned}
\]

\((2,3)\)을 **포함하는 시작점**으로 찍고 오른쪽 위로 이어 그린다. \(1<x<2\)에는 그래프가 없다.

**(2) 직선 \(y=x+k\)와 네 점에서 만나기**

서로 떨어진 두 가지에서 각각 **서로 다른 두 점**을 얻어야 전체 교점이 네 점이다.

**① 왼쪽 가지 \(x\le1\)**

\[
t=\sqrt{1-x}\ge0\quad\Longrightarrow\quad
x=1-t^2,\quad y=2-t.
\]

직선의 식에 대입하면

\[
\begin{aligned}
2-t&=(1-t^2)+k\\
t^2-t+1-k&=0\\
\left(t-\frac12\right)^2&=k-\frac34\\
t&=\frac12\pm\sqrt{k-\frac34}.
\end{aligned}
\]

두 근이 서로 달라야 하므로

\[
k-\frac34>0\quad\Longrightarrow\quad k>\frac34.
\]

또 \(t=\sqrt{1-x}\)이므로 **두 근 모두 \(0\) 이상**이어야 한다. 큰 근은 이미 양수이니 작은 근만 확인하면 된다.

\[
\begin{aligned}
\frac12-\sqrt{k-\frac34}&\ge0\\
\sqrt{k-\frac34}&\le\frac12\\
k-\frac34&\le\frac14\\
k&\le1.
\end{aligned}
\]

따라서 왼쪽 가지에서 두 점을 얻는 범위는

\[
\boxed{\frac34<k\le1}.
\]

**② 오른쪽 가지 \(x\ge2\)**

\[
s=\sqrt{x-2}\ge0\quad\Longrightarrow\quad
x=s^2+2,\quad y=s+3.
\]

직선의 식에 대입하면

\[
\begin{aligned}
s+3&=(s^2+2)+k\\
s^2-s+k-1&=0\\
\left(s-\frac12\right)^2&=\frac54-k\\
s&=\frac12\pm\sqrt{\frac54-k}.
\end{aligned}
\]

서로 다른 두 근이므로

\[
\frac54-k>0\quad\Longrightarrow\quad k<\frac54.
\]

작은 근까지 \(s\ge0\)인지 확인하면

\[
\begin{aligned}
\frac12-\sqrt{\frac54-k}&\ge0\\
\sqrt{\frac54-k}&\le\frac12\\
\frac54-k&\le\frac14\\
k&\ge1.
\end{aligned}
\]

따라서 오른쪽 가지에서 두 점을 얻는 범위는

\[
\boxed{1\le k<\frac54}.
\]

**③ 두 조건을 동시에 만족**

\[
\frac34<k\le1,\qquad1\le k<\frac54
\quad\Longrightarrow\quad
\boxed{k=1}.
\]

실제 네 교점도 확인해 보자.

\[
\begin{aligned}
k=1:\quad
t^2-t&=t(t-1)=0 &&\Longrightarrow t=0,1,\\
s^2-s&=s(s-1)=0 &&\Longrightarrow s=0,1.
\end{aligned}
\]

\[
\begin{aligned}
t=0&\Rightarrow x=1-0^2=1,\ y=2 &&\Rightarrow(1,2),\\
t=1&\Rightarrow x=1-1^2=0,\ y=1 &&\Rightarrow(0,1),\\
s=0&\Rightarrow x=0^2+2=2,\ y=3 &&\Rightarrow(2,3),\\
s=1&\Rightarrow x=1^2+2=3,\ y=4 &&\Rightarrow(3,4).
\end{aligned}
\]

네 점 모두 \(y=x+1\)을 만족하고 서로 다르다.

\[
\boxed{(2)\ k=1}.
\]

**독립 검산:** \(k=1\)에서 왼쪽과 오른쪽의 2차식은 각각 \(t(t-1)\), \(s(s-1)\); 두 근 \(0,1\)은 모두 각 근호의 정의역에 포함된다. 끝점 \((1,2),(2,3)\)도 빠지지 않는다.

### 그림 인계

문제 (1)은 그래프 문제이므로 원본 \`assets/images/25_순천고_2학기_기말_고1_기출/q23-solution-v2.svg\`를 판서 엔진에서 검수할 수 있다. 새 SVG를 생성하거나 수정하지 않았고, 별도 그림 요청이 필요한지는 시각 QA 뒤 결정한다.

---

- 판정: 두 문항 모두 **UPGRADE**(논리 점프·학습 동선 개선), 기존 정답 유지.
- 수학 독립 검산: 위의 대수식 및 범위·끝점 대조 완료.
- 출고/Golden/Negative/학생용 렌더 PASS: **NOT_RUN**.
