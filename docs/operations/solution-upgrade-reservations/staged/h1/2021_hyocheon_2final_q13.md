# 2021 효천고 2학기 기말 q13 — 두 곡선·직선으로 둘러싸인 넓이

- source: archive/exams/original/high/h1/2final/21_효천고_2학기_기말_고1_기출.js
- sourceBlobSha: ac6d28a1dab09e28cba4abc8de20f763a924189b
- 원본 정답 ① (40)
- UPGRADE: 원본은 두 곡선과 현 사이의 넓이가 ‘상쇄된다’고 적지만, 회전했을 때 왜 한쪽은 더하고 다른 쪽은 빼는지를 생략했다. **고1에서 배우는 도형 회전·삼각형 넓이**로 이유를 자세히 보인다. 적분은 사용하지 않는다.

## 작은 칠판 — 먼저 세 점을 찾기

곡선은
\[
y=
\begin{cases}
-\frac12x^2&(x<0),\\
-\sqrt{2x}&(x\ge0)
\end{cases}
\]
이고, 직선 \(x-3y-20=0\)은
\[
y=\frac{x-20}{3}.
\]

왼쪽 가지와 직선의 교점은
\[
\begin{aligned}
-\frac12x^2&=\frac{x-20}{3}\\
-3x^2&=2x-40\\
3x^2+2x-40&=0\\
(3x-10)(x+4)&=0.
\end{aligned}
\]
여기서는 \(x<0\)이므로 \(x=-4\), \(y=-\frac12(-4)^2=-8\).
\[
A=(-4,-8).
\]
오른쪽 가지에서는 \(t=\sqrt{2x}\ge0\)이라 두자. 이때 \(x=t^2/2\)이므로
\[
\begin{aligned}
-t&=\frac{\frac12t^2-20}{3}\\
-6t&=t^2-40\\
t^2+6t-40&=0\\
(t+10)(t-4)&=0.
\end{aligned}
\]
\(t\ge0\)이므로 \(t=4\)만 가능하다.
\[
x=\frac{4^2}{2}=8,\qquad y=-t=-4.
\]
따라서 오른쪽 가지의 유일한 교점은 \(B=(8,-4)\)이고, 두 곡선이 연결되는 점은 \(O=(0,0)\)이다.

## 왜 굽은 넓이가 사라질까?

먼저 **왼쪽 곡선의 한 점** \((u,-\frac12u^2)\) (\(-4\le u\le0\))을 원점 중심으로 반시계방향 \(90^\circ\) 돌려 보자. 회전 규칙은
\[
(x,y)\longmapsto(-y,x).
\]
따라서
\[
\left(u,-\frac12u^2\right)
\longmapsto
\left(\frac12u^2,u\right).
\]
회전 뒤 좌표를 \((X,Y)\)라 쓰면
\[
\begin{aligned}
X&=\frac12u^2,\\
Y&=u\le0,\\
Y&=-\sqrt{2X}.
\end{aligned}
\]
즉 왼쪽 곡선 \(A\to O\)를 돌리면 **오른쪽 곡선 \(B\to O\)**와 정확히 포개진다.

끝점도
\[
A=(-4,-8)\longmapsto B=(8,-4),\qquad O\longmapsto O
\]
로 옮겨지므로 **직선 선분 \(AO\)**은 선분 \(BO\)와 포개진다.

따라서 왼쪽 곡선 \(AO\)와 직선 선분 \(AO\) 사이의 휘어진 작은 영역과, 오른쪽 곡선 \(OB\)와 선분 \(OB\) 사이의 휘어진 작은 영역은 **회전으로 포개져 넓이가 같다.**

다만 하나는 삼각형 \(AOB\)의 **바깥쪽**(왼쪽 곡선이 선분 \(AO\)보다 위), 다른 하나는 삼각형의 **안쪽**(오른쪽 곡선이 선분 \(OB\)보다 아래)에 있다. 그러므로
\[
\begin{aligned}
\text{구하는 넓이}
&=\text{삼각형 }AOB
 +\text{왼쪽 휘어진 넓이}
 -\text{오른쪽 휘어진 넓이}\\
&=\text{삼각형 }AOB
 +S-S\\
&=\text{삼각형 }AOB.
\end{aligned}
\]

## 마지막은 삼각형 넓이

\[
\begin{aligned}
OA^2&=(-4)^2+(-8)^2=16+64=80,\\
OB^2&=8^2+(-4)^2=64+16=80.
\end{aligned}
\]
또
\[
\text{직선 }OA\text{의 기울기}=\frac{-8}{-4}=2,\qquad
\text{직선 }OB\text{의 기울기}=\frac{-4}{8}=-\frac12.
\]
두 기울기의 곱은 \(-1\)이므로 \(OA\perp OB\). 따라서
\[
\begin{aligned}
[ AOB]
&=\frac12\cdot OA\cdot OB\\
&=\frac12\cdot\sqrt{80}\cdot\sqrt{80}\\
&=\frac12\cdot80\\
&=40.
\end{aligned}
\]
\[
\boxed{\text{정답 ① }40}
\]

## 독립 검산
좌표만으로 삼각형 넓이를 다시 확인:
\[
\frac12|(-4)(-4)-(-8)(8)|=\frac12|16+64|=40.
\]
회전은 길이·넓이를 보존하므로 두 휘어진 부분의 차는 0이다.

- 새 해설용 그림이 도움이 되므로 SVG_REQUEST만 별도 인계 예정. VISUAL_HOLD, Golden/Negative/render/release NOT_RUN.
