# 2022 금당고 2학기 기말 고1 — 21번 학생용 해설 개선안

- sourcePath: \`archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js\`
- sourceBlobSha: \`90a09d9ae16c3865fc35055fa23baee3e93d4c43\`
- qid 21 / 정답 **\(4\pi\)** / 완성 학생용 초안·접점 조건 독립 검산. SVG·Golden·Negative·학생 렌더·출고 **NOT_RUN**.
- 기존 solution의 문제: 원과 쌍곡선 연립을 **4차방정식**으로 만들고 \((X-\alpha)^2(X-\beta)^2\)라는 **두 중근 구조**를 설명 없이 적용한다. 이것은 고1의 기본 유리함수·도형 수준에서 따라가기 어렵다. **평행이동 후 두 제곱식이 0이 되는 원**을 직접 찾으면 사차식/미분 없이 두 접원을 확인할 수 있다.

## 학생용 완성 풀이

### ① 먼저 유리함수의 중심을 찾자

\[
f(x)=\frac{ax+1}{bx+c}
\]

의 두 점근선은 \(x=-\dfrac cb\), \(y=\dfrac ab\)이므로 그래프의 중심은 \(\left(-\frac cb,\frac ab\right)\)이다.

대칭축 \(y=x+\dfrac12\), \(y=-x+\dfrac32\)의 교점을 구하면

\[
\begin{aligned}
x+\frac12&=-x+\frac32\\
2x&=1\\
x&=\frac12,\qquad y=1.
\end{aligned}
\]

따라서

\[
-\frac cb=\frac12,\qquad \frac ab=1
\quad\Longrightarrow\quad
c=-\frac b2,\quad a=b.
\]

그래프가 \((1,3)\)을 지나므로

\[
\begin{aligned}
3&=\frac{a\cdot1+1}{b\cdot1+c}\\
&=\frac{b+1}{b-\frac b2}\\
&=\frac{b+1}{b/2}\\
2(b+1)&=3b\\
2b+2&=3b\\
b&=2,\quad a=2,\quad c=-1.
\end{aligned}
\]

따라서

\[
\begin{aligned}
y&=\frac{2x+1}{2x-1}\\
&=1+\frac{2}{2x-1}\\
&=1+\frac1{x-\frac12}.
\end{aligned}
\]

### ② 점근선의 교점을 원점으로 옮기자

\[
X=x-\frac12,\qquad Y=y-1
\]

로 놓으면

\[
\begin{aligned}
Y&=\frac1X\\
\boxed{XY&=1}.
\end{aligned}
\]

원래 문제의 점 \(\left(\frac12,1\right)\)이 이제 \((0,0)\)이다.

원의 중심이 새 원점에서 거리 \(k\)만큼 떨어져 있으므로

\[
\sqrt{p^2+p^2}=k
\quad\Longrightarrow\quad
\boxed{p=\frac{k}{\sqrt2}}.
\]

문제에서 \(k>2\sqrt2\)이므로

\[
\boxed{p>2}.
\]

이제 새 좌표에서 두 대칭축 \(Y=X\), \(Y=-X\) 위에 중심이 있는 두 원을 직접 만들어 접하는지 확인해 보자. 문제는 거리 \(k\)에 대해 이런 접원이 **두 개** 있다고 하므로, 조건을 만족하는 서로 다른 두 원을 찾으면 충분하다.

### ③ 첫 번째 접원 — 중심 \((p,p)\)

중심이 \((p,p)\)인 원에서 곡선 \(XY=1\) 위의 점 \((X,Y)\)까지 거리의 제곱은

\[
\begin{aligned}
d_1^2
&=(X-p)^2+(Y-p)^2\\
&=X^2+Y^2-2p(X+Y)+2p^2.
\end{aligned}
\]

여기서 \(XY=1\)이므로

\[
\begin{aligned}
X^2+Y^2
&=(X+Y)^2-2XY\\
&=(X+Y)^2-2.
\end{aligned}
\]

대입하면

\[
\begin{aligned}
d_1^2
&=(X+Y)^2-2-2p(X+Y)+2p^2\\
&=(X+Y-p)^2+p^2-2\\
&\ge p^2-2.
\end{aligned}
\]

즉 반지름이

\[
\boxed{r_1^2=p^2-2}
\]

인 원은 쌍곡선과 아무 점에서도 가로질러 만나지 않고, \(X+Y=p\)에서 **닿을 수 있다**.

정말 두 점에서 닿는지 확인하자.

\[
\begin{aligned}
XY&=1,\qquad X+Y=p\\
X(p-X)&=1\\
X^2-pX+1&=0.
\end{aligned}
\]

\[
\begin{aligned}
D&=p^2-4>0\qquad(p>2).
\end{aligned}
\]

서로 다른 두 \(X\)가 생기며, 두 근의 합 \(p>0\), 곱 \(1>0\)이므로 **둘 다 양수**이다. 원래의 \(x=X+\frac12\) 역시 두 점 모두 양수다.

따라서 첫 번째 원은 문제의 조건대로 **서로 다른 두 점에서 접한다**.

### ④ 두 번째 접원 — 중심 \((p,-p)\)

이번에는 중심이 \((p,-p)\)인 원에서 곡선 위 점까지의 거리의 제곱을 계산하자.

\[
\begin{aligned}
d_2^2
&=(X-p)^2+(Y+p)^2\\
&=X^2+Y^2-2p(X-Y)+2p^2.
\end{aligned}
\]

\[
\begin{aligned}
X^2+Y^2
&=(X-Y)^2+2XY\\
&=(X-Y)^2+2
\end{aligned}
\]

이므로

\[
\begin{aligned}
d_2^2
&=(X-Y)^2+2-2p(X-Y)+2p^2\\
&=(X-Y-p)^2+p^2+2\\
&\ge p^2+2.
\end{aligned}
\]

따라서 두 번째 원의 반지름은

\[
\boxed{r_2^2=p^2+2}
\]

이고 \(X-Y=p\)인 점에서 곡선에 닿는다.

두 접점의 \(X\)좌표를 확인하면

\[
\begin{aligned}
XY=1,\quad X-Y=p
&\Longrightarrow Y=X-p\\
&\Longrightarrow X(X-p)=1\\
&\Longrightarrow X^2-pX-1=0\\
&\Longrightarrow X=\frac{p\pm\sqrt{p^2+4}}2.
\end{aligned}
\]

판별식 \(p^2+4>0\)이므로 접점은 **서로 다른 두 개**다.

한 근은 양수이고 다른 근

\[
\begin{aligned}
X_-
&=\frac{p-\sqrt{p^2+4}}2\\
&=\frac{(p-\sqrt{p^2+4})(p+\sqrt{p^2+4})}{2(p+\sqrt{p^2+4})}\\
&=\frac{p^2-(p^2+4)}{2(p+\sqrt{p^2+4})}\\
&=-\frac{2}{p+\sqrt{p^2+4}}\\
&>-\frac12
\quad\left(\because p>2\Longrightarrow p+\sqrt{p^2+4}>4\right).
\end{aligned}
\]

따라서 이 접점도 원래의 \(x=X+\frac12>0\)이다. 두 점 모두 문제의 양수 \(x\)조건을 만족한다.

### ⑤ 두 원의 넓이 차이를 계산하자

두 원의 중심은 각각 \((p,p)\), \((p,-p)\)이므로 새 원점과의 거리가 모두

\[
\sqrt{p^2+p^2}=\sqrt2p=k
\]

로 같다.

반지름의 제곱은

\[
r_1^2=p^2-2,\qquad r_2^2=p^2+2.
\]

그러므로 큰 원과 작은 원의 넓이 차이는

\[
\begin{aligned}
g(k)-h(k)
&=\pi r_2^2-\pi r_1^2\\
&=\pi\{(p^2+2)-(p^2-2)\}\\
&=\pi(p^2+2-p^2+2)\\
&=\boxed{4\pi}.
\end{aligned}
\]

특히 \(k=3\)은 \(3>2\sqrt2\)라 위 두 접원이 실제로 존재하므로

\[
\boxed{g(3)-h(3)=4\pi}.
\]

### 학생에게 꼭 필요한 코멘트

- **왜 좌표를 바꾸나요?** 점근선의 교점이 원점이면 유리함수가 \(XY=1\) 하나의 간단한 식으로 바뀌기 때문입니다.
- **왜 제곱식을 만들죠?** 원과 곡선 사이 거리를 \((\text{식})^2+\text{상수}\)로 쓰면 그 제곱식이 0인 곳이 **원의 경계와 곡선이 닿는 점**입니다. 사차방정식의 '이중근'을 알 필요가 없습니다.
- **왜 접점의 x좌표까지 검산하나요?** 문제는 단순히 접하는 원이 아니라 **두 접점의 원래 x좌표가 모두 양수**라는 조건을 주었기 때문입니다.

### 독립 검산

\(k=3\)일 때 \(p=3/\sqrt2>2\). 첫 원 \(r_1^2=p^2-2=9/2-2=5/2\), 둘째 \(r_2^2=p^2+2=9/2+2=13/2\). 둘 다 양의 반지름을 갖고 위에서 **두 개의 실제 접점**을 확인했다. 넓이 차 \(\pi(13/2-5/2)=4\pi\), 원 정답과 일치. 고1 교육과정 밖인 4차 중근·미분 사용 없음.