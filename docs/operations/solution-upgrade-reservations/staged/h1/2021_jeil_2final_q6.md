# 2021 제일고 2학기 기말 q6 학생용 해설 — 반복 합성

- sourcePath: archive/exams/original/high/h1/2final/21_제일고_2학기_기말_고1_기출.js
- sourceBlobSha: 7bf45e6dc651ef229c7053669199f443a184044b
- 원본 정답: ② \(-2020\)
- 개선 이유: 기존 해설은 \(f^n\)을 가정하고 \(n+1\)에 성립함을 보이는 수학적 귀납 방식이다. 고1의 학생에게 먼저 **한 번 합성할 때 일어나는 간단한 변화**를 보여주는 방법을 사용한다.

## 작은 칠판 — 분수의 역수를 살펴보기

주어진 함수는
\[
f(x)=\frac{x}{1-x}.
\]
\(x\ne0\)에서 **함숫값의 역수**를 구하면
\[
\begin{aligned}
\frac1{f(x)}
&=\frac1{\frac{x}{1-x}}\\
&=\frac{1-x}{x}\\
&=\frac1x-\frac xx\\
&=\frac1x-1.
\end{aligned}
\]
즉 \(f\)를 **한 번 적용할 때마다 함숫값의 역수에서 1이 빠진다.**

실제로 두 번, 세 번 합성하면
\[
\begin{aligned}
\frac1{f^2(x)}
&=\frac1{f(x)}-1\\
&=\left(\frac1x-1\right)-1\\
&=\frac1x-2,\\[2mm]
\frac1{f^3(x)}
&=\frac1{f^2(x)}-1\\
&=\left(\frac1x-2\right)-1\\
&=\frac1x-3.
\end{aligned}
\]
따라서 \(2021\)번 적용했을 때는 \(1\)을 모두 \(2021\)번 빼므로
\[
\begin{aligned}
\frac1{f^{2021}(x)}
&=\frac1x-2021\\
&=\frac{1-2021x}{x}.
\end{aligned}
\]
양변을 다시 역수로 바꾸어
\[
f^{2021}(x)=\frac{x}{1-2021x}.
\]
\(x=0\)일 때도 \(f(0)=0\)이므로 마지막 식이 그대로 맞는다. (중간 합성이 정의되는 \(x\)에서 계산한다.)

문제에서 비교하라고 준 식은
\[
\frac{ax+b}{cx+1}.
\]
분자·분모를 바로 비교하면
\[
\frac{x}{1-2021x}
=\frac{1\cdot x+0}{-2021x+1}.
\]
그러므로
\[
\begin{aligned}
a&=1,\\
b&=0,\\
c&=-2021,\\
a+b+c&=1+0-2021\\
&=-2020.
\end{aligned}
\]
\[
\boxed{\text{정답 ② }-2020}
\]

## 독립 검산
\[
f^2(x)=f\left(\frac{x}{1-x}\right)
=\frac{\frac{x}{1-x}}{1-\frac{x}{1-x}}
=\frac{x}{1-2x}.
\]
이는 역수에서 2가 빠진 식과 일치한다. \(f^3(x)=\frac{x}{1-3x}\)도 위 계산에서 확인 가능.

- Golden/Negative/렌더/출고: NOT_RUN. 원본 JS 수정 없음.
