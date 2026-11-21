# 2021 팔마고 2학기 기말 q21 학생용 풀이 — 모든 x에서 성립하는 부등식

- sourcePath: archive/exams/original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js
- sourceBlobSha: 29c20420256218751fe4f3294173e26ae67c2d80
- 원본 정답: \(a_{\max}=-1,\ b_{\min}=-\frac16\)
- UPGRADE 이유: 원문 서술형 채점표는 한 좌표평면에 **그래프를 그리기**를 별도 단계로 요구한다. 원본 solution에는 '그래프에는 ... 그렸다'는 문장이 있지만 실제 그래프 파일이나 생성 plan의 증거가 없다. 학생 해설은 식을 중심으로 완성하고 그래프는 엔진 요청으로 분리한다.

## 작은 칠판 — 먼저 세 식에서 공통된 1 없애기

주어진 조건은 **모든** \(1\le x\le3\)에서
\[
ax+1\le\frac{x-1}{x+1}\le bx+1
\]
이다. 유리함수부터 바꾸면
\[
\begin{aligned}
\frac{x-1}{x+1}
&=\frac{(x+1)-2}{x+1}\\
&=1-\frac2{x+1}.
\end{aligned}
\]
따라서
\[
ax+1\le1-\frac2{x+1}\le bx+1.
\]
각 부분에서 \(1\)을 빼면
\[
ax\le-\frac2{x+1}\le bx.
\]
**여기서 \(1\le x\le3\)이므로 \(x>0\)**이다. 따라서 양수 \(x\)로 나누어도 부등호 방향은 바뀌지 않는다.
\[
\boxed{a\le-\frac2{x(x+1)}\le b}.
\]

## \(a\)가 가장 클 수 있는 값

모든 \(x\)에서 \(a\le-\frac2{x(x+1)}\)이어야 한다.
\[
\begin{aligned}
x=1&:\quad a\le-\frac2{1\cdot2}=-1,\\
x=3&:\quad a\le-\frac2{3\cdot4}=-\frac16.
\end{aligned}
\]
\(a\)는 둘을 모두 만족해야 하므로 **더 작은 쪽인 \(-1\)**이 제한이다.

실제로 \(x\)가 1에서 3으로 커지면 \(x(x+1)\)은 \(2\to12\)로 커지고,
\[
-\frac2{x(x+1)}
\]
는 \(-1\to-\frac16\)으로 증가한다. 따라서 구간 전체에서 \(-1\)보다 작아지는 경우는 없다.
\[
\boxed{a_{\max}=-1}.
\]

## \(b\)가 가장 작을 수 있는 값

모든 \(x\)에서 \(-\frac2{x(x+1)}\le b\)이어야 한다. 이 함수가 구간에서 가장 큰 값은 \(x=3\)일 때의 \(-\frac16\)이므로
\[
\boxed{b_{\min}=-\frac16}.
\]
두 경계 직선은
\[
L(x)=-x+1,\qquad U(x)=-\frac{x}{6}+1.
\]
원래 유리함수는 \(F(x)=1-\frac2{x+1}\)이므로 접점(경계 만나는 점)은
\[
\begin{aligned}
x=1&:\quad F(1)=\frac{1-1}{1+1}=0=L(1),\\
x=3&:\quad F(3)=\frac{3-1}{3+1}=\frac12=U(3).
\end{aligned}
\]
이 두 점을 한 그림의 같은 좌표축에 그리면 아래 경계 \(L\), 위 경계 \(U\) 사이에 \(F\)가 놓인다는 뜻이 드러난다.

\[
\boxed{\text{정답 }a=-1,\qquad b=-\frac16}
\]

## 독립 검산
\(1\le x\le3\)에서 \(x(x+1)\in[2,12]\), 따라서
\[
-1\le-\frac2{x(x+1)}\le-\frac16.
\]
그러므로 \(a=-1,b=-\frac16\)을 대입했을 때 모든 \(x\)에서 원래 부등식이 성립한다. \(x=1\) 또는 \(x=3\)에서 경계를 각각 더 조이면 깨지므로 최적값이다.

**그림은 별도 \`2021_palma_2final_SVG_REQUEST.md\`의 q21 요청으로만 인계**한다. 엔진 SVG 생성/연결/렌더는 이 lane에서 수행하지 않았다.

- EXAM_DRAFT용 수식 풀이 완료, 그림 **VISUAL_HOLD**. Golden/Negative/render/release **NOT_RUN**.
