# 2021 복성고 고1 2학기 기말 q22 — 학생용 개선 해설

- 판정: UPGRADE
- 기존 solution의 논리 점프: \(AB:AC=1:4\)에서 \(\frac{2\sqrt t}{8t}=\frac14\)를 쓴 다음 \(t=1\)이라고 바로 결론낸다. \(\sqrt t=0\)이 되는 경우와 약분하는 이유를 보여 주자.
- 원문 답: (1) \(B=(t,\sqrt t),C=(9t,3\sqrt t)\), (2) 넓이 \(8\).

## 완성 풀이

점 \(A\)가 \(y=3\sqrt x\) 위에 있으므로

\[
A=(t,3\sqrt t),\qquad t\ge0.
\]

문제에서 **직각삼각형 ABC**라고 했으므로 넓이가 0인 경우를 제외하고 \(t>0\)이다.

**① B, C의 좌표부터 확인**

점 A에서 \(x\)축에 수직인 직선은 \(x=t\)이다. 이것과 \(y=\sqrt x\)가 만나는 점은

\[
\boxed{B=(t,\sqrt t)}.
\]

점 A에서 \(y\)축에 수직인 직선은 \(y=3\sqrt t\)이다. \(y=\sqrt x\)와 만나는 \(x\)는

\[
\begin{aligned}
\sqrt x&=3\sqrt t\\
x&=9t.
\end{aligned}
\]

따라서

\[
\boxed{C=(9t,3\sqrt t)}.
\]

**② 두 직각변의 길이**

A,B의 \(x\)좌표가 같으므로 AB는 세로선분이다.

\[
\begin{aligned}
AB&=3\sqrt t-\sqrt t\\
&=\boxed{2\sqrt t}.
\end{aligned}
\]

A,C의 \(y\)좌표가 같으므로 AC는 가로선분이다.

\[
\begin{aligned}
AC&=9t-t\\
&=\boxed{8t}.
\end{aligned}
\]

**③ 비율을 이용해 t 결정**

문제의 \(AB:AC=1:4\)에서

\[
\begin{aligned}
\frac{2\sqrt t}{8t}&=\frac14\\
4\cdot2\sqrt t&=8t\\
8\sqrt t&=8t\\
\sqrt t&=t.
\end{aligned}
\]

여기서 \(t>0\)이므로 \(\sqrt t>0\)이다. 따라서 0이 아닌 \(\sqrt t\)로 나눌 수 있다.

\[
\begin{aligned}
\sqrt t&=t\\
\sqrt t&=(\sqrt t)^2\\
1&=\sqrt t\\
\boxed{t}&=\boxed1.
\end{aligned}
\]

**④ 넓이 계산**

\(t=1\)을 두 변에 대입하면

\[
\begin{aligned}
AB&=2\sqrt1=2,\\
AC&=8\cdot1=8.
\end{aligned}
\]

두 선분이 수직이므로

\[
\begin{aligned}
S_{\triangle ABC}
&=\frac12\cdot AB\cdot AC\\
&=\frac12\cdot2\cdot8\\
&=\boxed8.
\end{aligned}
\]

검산: \(A(1,3),B(1,1),C(9,3)\)에서 AB=2, AC=8, 비 \(1:4\), 직각이며 넓이 8로 원문 답과 일치한다.
