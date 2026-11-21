# 2021 금당고 고1 2학기 기말 q22 — 학생용 개선 해설

- 판정: UPGRADE
- 원문 핵심: 삼각형 넓이 \(S=\frac12(45t+20/t)\)을 만든 후 산술·기하평균으로 \(45t+20/t\ge60\)이라고 바로 결론.
- 논리 점프: 60이 나오는 이유와 실제 언제 등호가 되는지 학생이 추적하기 어렵다. **완전제곱 식의 전개로** 최솟값을 증명한다.
- 원문 답: \(900\).

## 학생용 완성 풀이

첫 그래프 \(y=20/x\) 위 점 A의 \(x\)좌표를 \(a>0\), 둘째 그래프 \(y=-45/x\) 위 점 B의 \(x\)좌표를 \(b>0\)라고 놓는다.

\[
A=\left(a,\frac{20}{a}\right),\qquad
B=\left(b,-\frac{45}{b}\right).
\]

**① 삼각형 OAB의 넓이를 식으로 구하기**

원점과 두 점으로 이루어진 삼각형의 넓이는

\[
S=\frac12|x_Ay_B-x_By_A|
\]

이다.

\[
\begin{aligned}
S
&=\frac12\left|a\left(-\frac{45}{b}\right)-b\left(\frac{20}{a}\right)\right|\\
&=\frac12\left|-\frac{45a}{b}-\frac{20b}{a}\right|\\
&=\frac12\left(\frac{45a}{b}+\frac{20b}{a}\right).
\end{aligned}
\]

\(a,b>0\)이므로 마지막 절댓값은 그대로 제거할 수 있다.

이 넓이는 \(a,b\)의 각각 값보다 **비율**에만 의존하므로

\[
t=\frac ab>0
\]

로 놓으면

\[
\begin{aligned}
S
&=\frac12\left(45\frac ab+20\frac ba\right)\\
&=\frac12\left(45t+\frac{20}{t}\right).
\end{aligned}
\]

**② 30보다 작아질 수 없는 이유를 제곱식으로 확인**

\[
\begin{aligned}
S-30
&=\frac12\left(45t+\frac{20}{t}\right)-30\\
&=\frac{45t^2+20-60t}{2t}\\
&=\frac{45t^2-60t+20}{2t}\\
&=\frac{5(9t^2-12t+4)}{2t}\\
&=\frac{5(3t-2)^2}{2t}\\
&\ge0.
\end{aligned}
\]

마지막 식은 분자가 **제곱**이어서 0 이상이고 분모 \(2t>0\)이기 때문이다.

따라서

\[
\boxed{S\ge30}.
\]

**③ 등호가 실제로 가능한지 검산**

\[
\begin{aligned}
S=30
&\iff (3t-2)^2=0\\
&\iff 3t-2=0\\
&\iff t=\frac23.
\end{aligned}
\]

\(t=a/b=2/3\)이 되도록 \(a=2,b=3\)을 실제로 선택할 수 있다.

\[
A=(2,10),\qquad B=(3,-15).
\]

이때

\[
\begin{aligned}
S
&=\frac12|2(-15)-3(10)|\\
&=\frac12|-30-30|\\
&=30.
\end{aligned}
\]

따라서 **최솟값은 실제 30**이다.

마지막으로 물은 것은 넓이 자체가 아니라 **넓이의 최솟값의 제곱**이다.

\[
\boxed{S_{\min}^2=30^2=900}.
\]

원문 정답과 일치하며, 미분이나 산술·기하평균 공식 없이 완전제곱만 사용했다.
