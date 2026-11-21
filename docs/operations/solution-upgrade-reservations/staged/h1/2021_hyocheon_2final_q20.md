# 2021 효천고 2학기 기말 q20 — 두 곡선 사이 격자점 737개 세기

- source: archive/exams/original/high/h1/2final/21_효천고_2학기_기말_고1_기출.js
- sourceBlobSha: ac6d28a1dab09e28cba4abc8de20f763a924189b
- 원본 정답 68
- UPGRADE: 원본의 13구간 결과가 한 줄로 나열돼 학생이 정수 y의 개수 공식과 합을 추적하기 어렵다. **아래·위 경계 정수 처리와 구간별 곱셈 표**를 추가한다.

## 작은 칠판 — 처음 만나는 x부터 확인

두 곡선
\[
y=2\sqrt x,\qquad y=6-\sqrt x
\]
이 서로 만나는 x는
\[
\begin{aligned}
2\sqrt x&=6-\sqrt x\\
3\sqrt x&=6\\
\sqrt x&=2\\
x&=4.
\end{aligned}
\]
따라서 \(x\)좌표가 정수인 격자점을 세려면
\[
x=n,\quad n=4,5,6,\ldots,k
\]
순서로 센다. 각 \(x=n\)에서 가능한 \(y\)는
\[
6-\sqrt n\le y\le2\sqrt n.
\]

### 정수 y의 개수

**가장 작은 정수 y**는 \(\lceil6-\sqrt n\rceil\), **가장 큰 정수 y**는 \(\lfloor2\sqrt n\rfloor\)이다.
\[
\begin{aligned}
T(n)
&=\lfloor2\sqrt n\rfloor-\lceil6-\sqrt n\rceil+1\\
&=\lfloor2\sqrt n\rfloor-\{6-\lfloor\sqrt n\rfloor\}+1\\
&=\lfloor2\sqrt n\rfloor+\lfloor\sqrt n\rfloor-5.
\end{aligned}
\]
여기서 \(\lfloor t\rfloor\)는 \(t\) 이하의 가장 큰 정수이며,
\[
\lceil6-t\rceil=6-\lfloor t\rfloor
\]
를 썼다.

먼저 실제 값을 하나 확인한다.
\[
\begin{aligned}
T(4)&=\lfloor4\rfloor+\lfloor2\rfloor-5=1,\\
T(7)&=\lfloor2\sqrt7\rfloor+\lfloor\sqrt7\rfloor-5=5+2-5=2,\\
T(9)&=\lfloor6\rfloor+\lfloor3\rfloor-5=4.
\end{aligned}
\]

### 같은 T(n)끼리 묶어 한꺼번에 더하기

| 정수 x범위 | x개수 | x 하나당 T(x) | 이 구간 기여 |
|---|---:|---:|---:|
| 4~6 | 3 | 1 | \(3\cdot1=3\) |
| 7~8 | 2 | 2 | \(2\cdot2=4\) |
| 9~12 | 4 | 4 | \(4\cdot4=16\) |
| 13~15 | 3 | 5 | \(3\cdot5=15\) |
| 16~20 | 5 | 7 | \(5\cdot7=35\) |
| 21~24 | 4 | 8 | \(4\cdot8=32\) |
| 25~30 | 6 | 10 | \(6\cdot10=60\) |
| 31~35 | 5 | 11 | \(5\cdot11=55\) |
| 36~42 | 7 | 13 | \(7\cdot13=91\) |
| 43~48 | 6 | 14 | \(6\cdot14=84\) |
| 49~56 | 8 | 16 | \(8\cdot16=128\) |
| 57~63 | 7 | 17 | \(7\cdot17=119\) |
| 64~68 | 5 | 19 | \(5\cdot19=95\) |

이 표의 마지막 합을 계산하면
\[
\begin{aligned}
N(68)
&=3+4+16+15+35+32+60+55+91+84+128+119+95\\
&=7+16+15+35+32+60+55+91+84+128+119+95\\
&=737.
\end{aligned}
\]
또 \(x=68\)에서는 \(T(68)=19\)이므로
\[
\begin{aligned}
N(67)&=N(68)-T(68)\\
&=737-19\\
&=718.
\end{aligned}
\]
\(n\ge4\)이면 항상 \(T(n)\ge1\)이어서 \(k\)가 한 칸 커질 때마다 반드시 새 격자점이 추가된다. 따라서 \(N(k)=737\)을 만족하는 \(k\)는 하나뿐이다.

\[
\boxed{\text{정답 }k=68}
\]

## 독립 검산
정수 \(n=4,5,\ldots,68\)에 대하여 \(T(n)=\lfloor2\sqrt n\rfloor+\lfloor\sqrt n\rfloor-5\)를 직접 별도로 계산한 누적값은 \(737\), \(n=67\)까지는 \(718\). 원본 정답과 일치.
- Golden/Negative/render/release NOT_RUN, 운영 JS/SVG/main 수정 없음.
