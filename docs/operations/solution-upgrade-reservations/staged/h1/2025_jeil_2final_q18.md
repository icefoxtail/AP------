# 2025 제일고 2학기 기말 고1 — Q18 학생용 작은 칠판 해설 개선 (lane10)

> **MD 학생용 원고, 운영 미반영.** 원본 문제·보기·정답·JS·SVG 변경 없음. 원본 JS Git blob \`b9b8c8649f1b47adf41b9bcc07cc94af0647a55e\`, qid 18, \`standardCourse=공통수학2\`.

## 왜 UPGRADE인가

기존 풀이에는

> \`$0\\le x<1$에서는 $f(x)=1-x$이다. $g$의 첫째 식을 적용하면\`

이라고 되어 있다. 그러나 \(x=0\)을 넣으면 \(f(0)=1\)이므로 **\(g\)의 첫째 식은 적용할 수 없고 둘째 식을 사용해야 한다.** 다행히 두 식 모두 경계값 \(g(1)=2\)로 이어져 기존 최종 답과 계산한 넓이는 맞지만, 학생에게는 “왜 \(g(1)\)에 첫째 식을 넣느냐?”는 잘못된 규칙을 남긴다.

또 세 도형 넓이를 계산하기 전에 각 구간의 꼭짓점과 닫힌 경계를 정확히 확인하는 것이 필요하다.

## 새 풀이 전체 — 합성함수의 안쪽 값부터 구간 나누기

\[
f(x)=
\begin{cases}
1-x &(0\le x<1),\\
2x-2 &(1\le x\le2),
\end{cases}
\quad
g(t)=
\begin{cases}
t+1 &(0\le t<1),\\
-2t+4 &(1\le t\le2).
\end{cases}
\]

\(g(f(x))\)를 구할 때는 **\(x\)의 범위가 아니라 \(f(x)\)가 1보다 작은지**를 보고 \(g\)의 식을 고른다.

**① \(0<x<1\)일 때**

\[
0<1-x<1
\]

이므로 \(g\)의 첫째 식을 사용한다.

\[
\begin{aligned}
(g\circ f)(x)
&=g(1-x)\\
&=(1-x)+1\\
&=2-x.
\end{aligned}
\]

**경계 \(x=0\)은 따로 확인한다.**

\[
\begin{aligned}
f(0)&=1-0=1,\\
(g\circ f)(0)&=g(1)\\
&=-2\cdot1+4\\
&=2.
\end{aligned}
\]

\(x=0\)에서는 \(g\)의 **둘째** 식을 사용하지만 계산값은 \(2-0=2\)와 같다. 따라서 결과를 묶어 쓰면

\[
(g\circ f)(x)=2-x\quad(0\le x<1)
\]

이다.

**② \(1\le x<\frac32\)일 때**

\[
\begin{aligned}
f(x)&=2x-2,\\
0&\le2x-2<1
\end{aligned}
\]

이므로 \(g\)의 첫째 식을 사용한다.

\[
\begin{aligned}
(g\circ f)(x)
&=g(2x-2)\\
&=(2x-2)+1\\
&=2x-1.
\end{aligned}
\]

**③ \(\frac32\le x\le2\)일 때**

\[
1\le2x-2\le2
\]

이므로 \(g\)의 둘째 식을 사용한다.

\[
\begin{aligned}
(g\circ f)(x)
&=g(2x-2)\\
&=-2(2x-2)+4\\
&=-4x+4+4\\
&=-4x+8.
\end{aligned}
\]

세 결과를 정리하면

\[
(g\circ f)(x)=
\begin{cases}
2-x &(0\le x<1),\\
2x-1 &(1\le x<\frac32),\\
-4x+8 &(\frac32\le x\le2).
\end{cases}
\]

\(x=1\)에서 함숫값은 \(2\cdot1-1=1\), \(x=\frac32\)에서는 \(-4\cdot\frac32+8=2\), \(x=2\)에서는 \(-4\cdot2+8=0\)이다. 그래프는 \((0,2)\), \((1,1)\), \((\frac32,2)\), \((2,0)\)을 **순서대로 직선으로 이은 것**이다.

## 넓이 계산

세 구간에서 그래프가 모두 \(x\)축 위에 있으므로, 각 구간의 사다리꼴/삼각형 넓이를 더한다.

**구간 \(0\le x\le1\)**: 폭 \(1\), 양 끝 높이 \(2,1\).

\[
S_1=\frac{2+1}{2}\times1=\frac32.
\]

**구간 \(1\le x\le\frac32\)**: 폭 \(\frac32-1=\frac12\), 양 끝 높이 \(1,2\).

\[
\begin{aligned}
S_2
&=\frac{1+2}{2}\times\left(\frac32-1\right)\\
&=\frac32\times\frac12\\
&=\frac34.
\end{aligned}
\]

**구간 \(\frac32\le x\le2\)**: 폭 \(2-\frac32=\frac12\), 높이 \(2\)인 직각삼각형.

\[
\begin{aligned}
S_3
&=\frac12\times\left(2-\frac32\right)\times2\\
&=\frac12\times\frac12\times2\\
&=\frac12.
\end{aligned}
\]

따라서 전체 넓이는

\[
\begin{aligned}
S&=S_1+S_2+S_3\\
&=\frac32+\frac34+\frac12\\
&=\frac64+\frac34+\frac24\\
&=\boxed{\frac{11}{4}}.
\end{aligned}
\]

정답은 **①**이다.

## 독립 검산·후속 처리

- 원래 합성값 확인: \(x=0\Rightarrow f=1,g=2\); \(x=1\Rightarrow f=0,g=1\); \(x=\frac32\Rightarrow f=1,g=2\); \(x=2\Rightarrow f=2,g=0\).
- 그래프의 모든 높이가 음이 아니고, 넓이합 \(3/2+3/4+1/2=11/4\)로 원본 answer와 일치한다.
- 새 SVG 요청: 없음. 본 문항은 함수식만으로 선분 그래프를 재구성할 수 있고, 다른 엔진이 필요하면 지침 읽기 후 별도 SVG_REQUEST로 인계한다.
- 학생용 화면 렌더·Golden·Negative·운영 JS 반영: **NOT_RUN**. 출고 PASS가 아니다.
