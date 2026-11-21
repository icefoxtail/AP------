# 2022 순천여고 고1 2학기 기말 q20 — 학생용 개선 해설

- 판정: UPGRADE
- 원문 핵심: \(PQ=PR=a+\frac1{a-1}\)을 구하고 \(t=a-1>0\)에서 \(t+1+\frac1t\ge3\)이라 즉시 결론.
- 논리 점프: **왜 최소 길이가 3인지**, 실제 어느 점에서 최소가 되는지 부등식의 등호 근거가 생략됐다.
- 정답: ②, \(\frac92\).

## 학생용 완성 풀이

\(a>1\)이므로 \(a-1>0\)이다.

**① 먼저 점 세 개의 좌표를 구한다.**

\(x=a\)가 유리함수와 만나는 점은

\[
P=\left(a,\frac1{a-1}\right).
\]

직선 \(y=-x\)와 만나는 점은

\[
Q=(a,-a).
\]

\(P\)에서 \(x\)축과 평행한 직선은 \(y=\frac1{a-1}\)이다. 이 직선 위에 있으면서 \(y=-x\)도 만족하는 점 \(R\)은

\[
\begin{aligned}
y&=\frac1{a-1},\quad y=-x\\
-x&=\frac1{a-1}\\
x&=-\frac1{a-1},
\end{aligned}
\]

\[
R=\left(-\frac1{a-1},\frac1{a-1}\right).
\]

**② 직각삼각형의 두 변 길이를 계산한다.**

점 \(P,Q\)의 \(x\)좌표가 같으므로 \(PQ\)는 세로선분이다.

\[
\begin{aligned}
PQ
&=\frac1{a-1}-(-a)\\
&=a+\frac1{a-1}.
\end{aligned}
\]

점 \(P,R\)의 \(y\)좌표가 같으므로 \(PR\)은 가로선분이다.

\[
\begin{aligned}
PR
&=a-\left(-\frac1{a-1}\right)\\
&=a+\frac1{a-1}.
\end{aligned}
\]

따라서 \(\angle QPR=90^\circ\)이고 두 직각변이 같은 길이이다.

**③ 그 길이가 언제 가장 짧은지 완전제곱으로 확인한다.**

\[
t=a-1>0
\quad\Longrightarrow\quad
a=t+1.
\]

공통 변의 길이를 \(L\)이라 두면

\[
\begin{aligned}
L
&=a+\frac1{a-1}\\
&=t+1+\frac1t\\
&=3+\left(t+\frac1t-2\right)\\
&=3+\frac{t^2-2t+1}{t}\\
&=3+\frac{(t-1)^2}{t}\\
&\ge3.
\end{aligned}
\]

마지막 부등식은 \(t>0\)에서 \((t-1)^2/t\ge0\)이기 때문이다.

**등호가 언제 되는지도 꼭 확인하자.**

\[
\begin{aligned}
L=3
&\iff (t-1)^2=0\\
&\iff t=1\\
&\iff a-1=1\\
&\iff a=2.
\end{aligned}
\]

\(a=2>1\)이므로 실제로 가능한 점이다.

**④ 넓이를 구한다.**

\[
\begin{aligned}
S
&=\frac12\cdot PQ\cdot PR\\
&=\frac12 L^2\\
&\ge\frac12\cdot3^2\\
&=\boxed{\frac92}.
\end{aligned}
\]

정답은 **②**.

검산: \(a=2\)이면 \(P=(2,1)\), \(Q=(2,-2)\), \(R=(-1,1)\)이므로 \(PQ=PR=3\), 넓이 \(3\times3/2=9/2\). 원문 정답과 정확히 일치한다.
