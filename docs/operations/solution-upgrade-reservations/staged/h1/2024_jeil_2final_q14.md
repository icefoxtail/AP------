# 2024 제일고 2학기 기말 고1 — 14번 학생용 해설 개선안

- sourcePath: \`archive/exams/original/high/h1/2final/24_제일고_2학기_기말_고1_기출.js\`
- sourceBlobSha: \`5cbedc8febf32259794867c5b08bc4ffaa489331\`
- qid 14 / 원 정답 **②, \(-\dfrac{11}{6}\)** / 학생용 초안 독립 검산 완료, 운영·렌더·Golden/Negative **NOT_RUN**.
- 문제: \(1\le x\le6\)에서 \(ax+1\le-\sqrt{x+3}+5\le bx+1\)가 항상 참일 때 \(a-b\)의 최댓값.
- 원문 풀이의 개선점: \(R(x)\ge\frac16\)을 증명하려 \(24-x\ge6\sqrt{x+3}\)로 만든 뒤 양변 제곱해 \(x^2-84x+468=(x-6)(x-78)\ge0\)을 계산한다. 수학적으로 맞지만 **왜 그렇게 복잡한 식을 만들었는지** 학생이 놓치기 쉽다. 분자를 **유리화**하면 분자 감소·분모 증가만으로 양 끝값을 결정할 수 있다.

## 작은 칠판용 완성 풀이

**① 먼저 \(a,b\)를 한 식에 묶자.**

\[
\begin{aligned}
ax+1&\le5-\sqrt{x+3}\le bx+1\\
ax&\le4-\sqrt{x+3}\le bx\\
a&\le\frac{4-\sqrt{x+3}}x\le b
\qquad(1\le x\le6,\ x>0).
\end{aligned}
\]

중간의 식을

\[
R(x)=\frac{4-\sqrt{x+3}}x
\]

라고 하자.

\(a\)는 **모든 \(R(x)\)보다 작거나 같아야** 하므로 가장 크게 잡아도 \(R\)의 최솟값이고, \(b\)는 **모든 \(R(x)\)보다 크거나 같아야** 하므로 가장 작게 잡아도 \(R\)의 최댓값이다.

\[
\boxed{(a-b)_{\max}=R_{\min}-R_{\max}}
\]

**② \(R(x)\)를 유리화해 비교하기 쉽게 만들자.**

\[
\begin{aligned}
R(x)
&=\frac{4-\sqrt{x+3}}x\\[2pt]
&=\frac{(4-\sqrt{x+3})(4+\sqrt{x+3})}{x(4+\sqrt{x+3})}\\[2pt]
&=\frac{4^2-(\sqrt{x+3})^2}{x(4+\sqrt{x+3})}\\[2pt]
&=\frac{16-(x+3)}{x(4+\sqrt{x+3})}\\[2pt]
&=\frac{13-x}{x(4+\sqrt{x+3})}.
\end{aligned}
\]

\(1\le x\le6\)에서

- 분자 \(13-x\)는 **양수**이며 \(x\)가 커질수록 **작아진다**.
- 분모 \(x(4+\sqrt{x+3})\)는 **양수**이며 \(x\)가 커질수록 **커진다**.

따라서 \(R(x)\)는 \(x\)가 커질수록 **작아진다**. 그래서 최댓값은 왼쪽 끝 \(x=1\), 최솟값은 오른쪽 끝 \(x=6\)에서 나온다.

**③ 두 끝값을 직접 계산하자.**

\[
\begin{aligned}
R_{\max}=R(1)
&=\frac{4-\sqrt{1+3}}1\\
&=\frac{4-2}{1}\\
&=2.
\end{aligned}
\]

\[
\begin{aligned}
R_{\min}=R(6)
&=\frac{4-\sqrt{6+3}}6\\
&=\frac{4-3}{6}\\
&=\frac16.
\end{aligned}
\]

따라서 \(a\)는 \(\frac16\)까지, \(b\)는 \(2\)까지 각각 선택할 수 있다.

\[
\begin{aligned}
(a-b)_{\max}
&=\frac16-2\\
&=\frac16-\frac{12}{6}\\
&=\boxed{-\frac{11}{6}}.
\end{aligned}
\]

### 진짜 필요한 코멘트

- **왜 유리화하나요?** 처음 식 \(\frac{4-\sqrt{x+3}}x\)에서는 분자도 분모도 함께 변해 어느 쪽이 큰지 보기가 어렵습니다. 유리화하면 **양수인 분자는 줄고 양수인 분모는 커지는** 모양이 바로 보입니다.
- **왜 \(a\)에 최솟값을, \(b\)에 최댓값을 넣나요?** 부등식 \(a\le R(x)\le b\)가 \(x=1\)부터 \(6\)까지 **모든 값에서** 참이어야 하기 때문입니다.
- \((a-b)\)의 최댓값도 **음수일 수 있습니다.** 여기서는 \(a\le\frac16\), \(b\ge2\)라 항상 \(a-b\le-\frac{11}{6}\)입니다.

### 독립 검산

\[
\begin{aligned}
a=\frac16,\quad b=2
&\Longrightarrow\quad \frac16\le R(x)\le2\quad(1\le x\le6),\\
x=1:\quad &R(1)=2=b,\\
x=6:\quad &R(6)=\frac16=a.
\end{aligned}
\]

즉 \(a=\frac16,b=2\)를 실제로 택할 수 있고 양 끝에서 등호가 성립한다. 기존 정답 ②와 일치. 극한·미분·이차식 \(x^2-84x+468\) 불필요.