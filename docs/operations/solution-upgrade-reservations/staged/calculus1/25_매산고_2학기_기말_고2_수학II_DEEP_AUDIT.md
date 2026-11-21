# 미적분Ⅰ(구 수학Ⅱ) 심층 감사 — 25_매산고_2학기_기말_고2_수학II

- 자료: 2025년 고2 2학기 기말 기출, `수학II` (교육과정 표기: `NOT_PRESENT`).
- 원본 JS: `archive/exams/original/high/h2/2final/25_매산고_2학기_기말_고2_수학II.js`; source ref `main`, blob `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 문항 분모: **22**; 판정 **KEEP 20 / UPGRADE 1 / HOLD 1 / UNREAD 0**.
- 저장: `work/solution-upgrade-lane-10-20261121`의 `docs/operations/solution-upgrade-reservations/staged/calculus1/25_매산고_2학기_기말_고2_수학II_DEEP_AUDIT.md`. 동일 경로 파일 기존 없음 확인; 다른 브랜치의 중복 감사 문서는 NOT_CHECKED.
- 읽은 기준: 2026-11-21 `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md`, `docs-manifest.json`의 core 문서 본문. 자동 preflight/문서 SHA-256 receipt·Golden/Negative 독립 검수: **NOT_RUN**. 운영 JS·정답·보기·SVG 수정 없음.
- 현재 단계: **EXAM_AUDIT_COMPLETE(전 문항 원문·해설 근거와 판정 수록)** / **EXAM_DRAFT_COMPLETE(UPGRADE 전체 수정 풀이 수록)** / **RELEASE_QA_NOT_RUN**. 남은 qid 판정 없음; HOLD는 후속 해결 필요.

## Q01 — KEEP

- source ordinal: 1; id: `1`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^3-3ax+5$가 $x=1$에서 극솟값을 가질 때, $a$의 값을 구한 것은? [3점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=3x^2-3a$ $f'(1)=0$에서 $3-3a=0$ $a=1$이다.
> 따라서 $x=1$에서 감소하다가 증가하여 실제로 극솟값을 가진다.
- 해설 경로·판정 이유·원본 값 대입 검산: 도함수 $3x^2-3a$에 $x=1$을 대입하면 $a=1$이며, $3(x+1)(x-1)$의 부호가 1에서 음에서 양으로 바뀌므로 실제 극소다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- source ordinal: 2; id: `2`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
$f(x)=4x^3-6$의 한 부정적분 $F(x)$에 대하여 $F(0)=12$일 때, $F(2)$의 값을 구한 것은? [3점]
원본 보기: ["$13$","$14$","$15$","$16$","$17$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 부정적분 $F(x)$에 대하여 $F'(x)=f(x)$이다.
> 따라서 $F(x)=x^4-6x+12$이고, $F(2)=2^4-6\cdot2+12$ $=16-12+12=16$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $F=x^4-6x+C$와 $F(0)=12$에서 $C=12$가 정해지고, $F(2)=16$이다. 미분하면 $4x^3-6$으로 돌아간다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- source ordinal: 3; id: `3`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
정적분 $\displaystyle\int_1^2(3x^2-6x+5)dx$의 값을 구한 것은? [3.2점]
원본 보기: ["$1$","$3$","$5$","$7$","$9$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $\displaystyle\int(3x^2-6x+5)\,dx=x^3-3x^2+5x+C$이다.
> 따라서 $\displaystyle\int_1^2(3x^2-6x+5)\,dx$ $=F(2)-F(1)=6-3=3$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 원시함수 $x^3-3x^2+5x$의 끝점 값은 $F(2)=6,F(1)=3$이다. 정적분은 $6-3=3$임을 확인했다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- source ordinal: 4; id: `4`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
원점에서 출발하여 수직선 위를 움직이는 점 P의 시각 $t$에서의 위치 $x$가 $x=-t^3+6t^2$이다. 이때, $t=1$에서의 점 P의 속도와 가속도의 합을 구한 것은? [3.2점]
원본 보기: ["$13$","$14$","$15$","$16$","$17$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 위치: $x(t)=-t^3+6t^2$ 속도: $v(t)=x'(t)=-3t^2+12t$ $v(1)=-3+12=9$이다.
> 따라서 $t=1$에서 속도와 가속도의 합은 $v(1)+a(1)=9+6=15$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 위치를 미분한 속도 $v(1)=9$와 한 번 더 미분한 가속도 $a(1)=6$을 별도로 계산한다. 합 15는 조건에 맞다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- source ordinal: 5; id: `5`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
방정식 $2x^3-2x^2+4=4x^2-a$가 서로 다른 세 실근을 갖도록 하는 실수 $a$의 값의 범위가 $m\lt a\lt n$일 때, $n-m$의 값을 구한 것은? [3.3점]
원본 보기: ["$4$","$5$","$6$","$7$","$8$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 방정식을 $h(x)=0$의 꼴로 나타낸다.
> $m=-4,\ n=4$이므로 $n-m=4-(-4)=8$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $h=2x^3-6x^2+a+4$의 극대·극소가 각각 $a+4,a-4$이다. 세 서로 다른 근을 위해 $-4<a<4$이고 범위 길이 8이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- source ordinal: 6; id: `6`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
곡선 $y=-2x^2+6x$과 직선 $y=-2mx$로 둘러싸인 도형의 넓이가 $\dfrac{125}{3}$일 때, 상수 $m$의 값을 구한 것은? (단, $m\gt 0$) [3.6점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $-2x^2+6x=-2mx$ $2x(m+3-x)=0$ $x=0$ 또는 $x=m+3$이다.
> $S=\dfrac{125}{3}$이므로 $(m+3)^3=125,\quad m+3=5$ $m=2$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 교점 $x=0,m+3$과 차함수 $2x(m+3-x)$의 양수 구간을 확인했다. 넓이 $(m+3)^3/3=125/3$에서 $m=2>0$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q07 — UPGRADE

- source ordinal: 7; id: `7`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
최고차항의 계수가 $1$인 삼차함수 $f(x)$가 모든 실수 $x$에 대하여 $f(-x)+f(x)=0$을 만족한다. 방정식 $|f(x)|=16$의 서로 다른 실근의 개수가 $4$일 때, $f(1)$의 값을 구한 것은? [4점]
원본 보기: ["$-13$","$-11$","$-9$","$-7$","$-5$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 최고차항의 계수가 $1$인 삼차함수이므로 $f(x)=x^3+px$로 놓는다.
> 따라서 $f(1)=1-12=-11$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 홀함수이므로 $f=x^3+px$이고 두 수평선 $y=\pm16$의 근 개수가 같다. 각각 두 교점이 되는 접점 조건은 기존 풀이에 있지만, 근 개수와 접점의 논리 및 계수 결정 등식을 학생이 재현하도록 더 분해한다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: DRAFT_STAGED / RELEASE_QA_NOT_RUN.

### 대체 학생용 solution 전체 (복사 가능한 수정 초안)

모든 실수 $x$에 대해 $f(-x)+f(x)=0$이므로 $f$는 홀함수이다. 최고차항 계수가 1인 삼차함수에서 짝수 차수항과 상수항이 없어야 하므로
$$f(x)=x^3+px$$
로 놓는다.

$|f(x)|=16$의 해는 $f(x)=16$ 또는 $f(x)=-16$의 해이다. 홀함수의 대칭성으로 $f(x)=16$의 해 $x=r$은 $f(x)=-16$의 해 $x=-r$에 대응한다. 따라서 두 방정식의 서로 다른 실근 수는 같으며, 합이 4개이므로 각각 2개다.

삼차함수와 수평선이 **서로 다른 두 점**에서 만나려면 수평선이 극대 또는 극소점에서 접하고 다른 한 점에서 가로질러야 한다. $f$가 오른쪽으로 증가하는 삼차함수이므로 $y=16$은 왼쪽 극대점에서 접한다. 그 점을 $x=-r$ ($r>0$)라 하자.
$$
\begin{aligned}
f'(x)&=3x^2+p,\\
0=f'(-r)&=3r^2+p,\\
p&=-3r^2.
\end{aligned}
$$
또 접점의 함수값이 16이므로
$$
\begin{aligned}
16=f(-r)&=(-r)^3+p(-r)\\
&=-r^3-pr\\
&=-r^3+3r^3\\
&=2r^3,\\
r^3&=8,\quad r=2.
\end{aligned}
$$
따라서 $p=-3(2)^2=-12$이고
$$
f(1)=1^3-12\cdot1=\boxed{-11}.
$$
정답은 ②이다.

**독립 검산:** $f(x)=x^3-12x$에서
$$f(x)-16=(x+2)^2(x-4),\qquad f(x)+16=(x-2)^2(x+4).$$
각 방정식의 서로 다른 근은 각각 2개이고 두 집합에 중복되는 근이 없으므로 $|f(x)|=16$의 근은 정확히 4개다.

## Q08 — KEEP

- source ordinal: 8; id: `8`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
모든 실수 $x$에 대하여 $f(x)=x^3+x+2\displaystyle\int_0^2 f(t)dt$을 만족시키는 함수 $f(x)$가 있다. 이때, $f(1)$의 값을 구한 것은? [4점]
원본 보기: ["$-2$","$-1$","$0$","$1$","$2$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $A=\displaystyle\int_0^2f(t)\,dt$라 하면 $f(x)=x^3+x+2A$이다.
> 따라서 $f(1)=1^3+1+2(-2)=-2$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $A=\int_0^2 f$로 두고 원식을 적분하면 $A=6+4A$이다. $A=-2$를 역대입하면 $f(x)=x^3+x-4$이고 $f(1)=-2$이다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q09 — KEEP

- source ordinal: 9; id: `9`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=\displaystyle\int\dfrac{x^n}{n}dx$에 대하여 $f(0)=0$일 때, 상수 $k$에 대하여 $\displaystyle\sum_{n=1}^{10}f(1)=k$를 만족한다. 이때, $22k$의 값을 구한 것은? [4.1점]
원본 보기: ["$5$","$10$","$15$","$20$","$25$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=\displaystyle\int\dfrac{x^n}{n}\,dx$ $=\dfrac{x^{n+1}}{n(n+1)}+C$이다.
> 따라서 $22k=22\cdot\dfrac{10}{11}=20$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f_n(1)=1/[n(n+1)]=1/n-1/(n+1)$을 합산하면 망원급수에서 $10/11$만 남는다. $22k=20$을 확인했다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q10 — HOLD

- source ordinal: 10; id: `10`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
$x\ge1$일 때, $2$ 이상의 자연수 $n$에 대하여 모든 실수 $x$에서 부등식 $x^n-nx+(n-1)^2\gt 0$이 항상 성립하도록 하는 자연수 $n$의 최솟값을 구한 것은? [4.1점]
원본 보기: ["$2$","$3$","$4$","$5$","$6$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $n=2$이면 $x^2-2x+1=(x-1)^2$이고, $x=1$에서 $0$이므로 항상 양수는 아니다.
> 따라서 처음으로 조건을 만족하는 값은 $n=3$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 원문 첫머리는 $x\ge1$인데 뒤이어 '모든 실수 $x$에서 항상 성립'이라고 써 적용 정의역이 충돌한다. 현재 풀이의 $n=3$은 $x\ge1$에서는 맞지만 모든 실수라면 $x\to-\infty$에서 $x^3-3x+4\to-\infty$로 불가능하다. 발문 수정 승인이 필요하여 HOLD.
- 그림·추가 확인: SOURCE_CONFLICT_HOLD: 'x≥1'과 '모든 실수 x' 조건이 충돌함. 정답 범위 재결정과 발문 승인 전 수정 불가.
- 상태: SOURCE_CONFLICT_HOLD.

## Q11 — KEEP

- source ordinal: 11; id: `11`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
모든 실수 $x$에 대하여 정의된 다항함수 $f(x)$가 있다. 이때, 함수 $f(x)$에 대하여 보기에서 옳은 것만을 모두 고른 것은? (단, $f(x)$는 상수함수가 아니다.) [4.2점]<div class="question-note-box"><div>&lt;보기&gt;</div>ㄱ. 함수 $f(x)$는 항상 극값을 갖는다.<br>ㄴ. 함수 $f(x)f'(x)$의 차수는 홀수이다.<br>ㄷ. 모든 실수 $x$에 대하여 $f(x)=f(-x)$를 만족하면 극값이 적어도 하나 존재한다.</div>
원본 보기: ["ㄱ","ㄴ","ㄷ","ㄱ, ㄷ","ㄴ, ㄷ"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=x^3$이면 $f'(x)=3x^2\ge0$이고 부호가 바뀌지 않으므로 극값이 없다.
> $f(x)=f(-x)$인 비상수 다항함수는 짝수 차수이다.
- 해설 경로·판정 이유·원본 값 대입 검산: ㄱ은 $f=x^3$ 반례, ㄴ은 차수 $n+(n-1)=2n-1$, ㄷ은 비상수 짝함수 다항식의 짝수차 연속함수 극값 존재를 이용한다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q12 — KEEP

- source ordinal: 12; id: `12`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)$가 $f(x)=\displaystyle\int_1^6|t-2x|dt$이다. 함수 $f(x)$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $\dfrac{M}{m}$의 값을 구한 것은?<br>(단, $\dfrac12\le x\le3$) [4.3점]
원본 보기: ["$\\dfrac43$","$\\dfrac53$","$2$","$\\dfrac73$","$\\dfrac83$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 적분 안의 절댓값이 바뀌는 지점은 $t=2x$이다.
> 따라서 $\dfrac{M}{m}=\dfrac{\frac{25}{2}}{\frac{25}{4}}=2$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $u=2x\in[1,6]$에서 절댓값을 $t=u$로 나눠 $f=(u-7/2)^2+25/4$를 얻는다. 끝점 최대 $25/2$와 내부 최소 $25/4$ 비는 2다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q13 — KEEP

- source ordinal: 13; id: `13`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
삼차함수 $f(x)=(a-2)x^3-ax^2+(a+2)x+1$이 극값을 $2$개 갖도록 하는 정수 $a$의 개수를 구한 것은? [5.1점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=3(a-2)x^2-2ax+(a+2)$이다.
> 그런데 $a=2$이면 $f$의 최고차항 계수가 $0$이므로 삼차함수가 아니다.
- 해설 경로·판정 이유·원본 값 대입 검산: 극값 두 개 조건은 도함수 이차식의 판별식 $8(6-a^2)>0$과 삼차계수 $a-2\ne0$이다. 정수 $-2,-1,0,1$ 네 개만 남는다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q14 — KEEP

- source ordinal: 14; id: `14`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
두 함수 $f(x)=x^4-14x^2+24x+3$, $g(x)=x^2+\dfrac4{x^2}-3$에 대하여 $x$에 대한 방정식 $(f\circ g)(x)=k$의 실근이 존재하도록 하는 실수 $k$의 최솟값을 구한 것은? [5.2점]
원본 보기: ["$11$","$12$","$13$","$14$","$15$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $x\ne0$에서 $x^2+\dfrac4{x^2}-4=\dfrac{(x^2-2)^2}{x^2}\ge0$이다.
> $u=2$도 실제 $g$의 치역에 속하므로 구하는 최솟값은 $11$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $g(x)\ge1$의 등호는 $x^2=2$에서 달성된다. $u\ge1$에서 $f'=4(u-1)(u-2)(u+3)$로 $u=2$가 최소이고 $f(2)=11$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q15 — KEEP

- source ordinal: 15; id: `15`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
원점을 출발하여 수직선 위를 움직이는 점 P의 시각 $t$에서의 속도를 $v_1(t)$, 수직선 위의 위치가 $8$인 점을 출발하여 수직선 위를 움직이는 점 Q의 시각 $t$에서의 속도를 $v_2(t)$라 할 때, $v_1(t)$와 $v_2(t)$는 다음과 같다.<br>$v_1(t)=20t-9t^2$, $v_2(t)=k$<br>수직선 위에서 두 점 P, Q가 만나기 위한 $k$의 최댓값을 $p$라고 할 때, $p^2$의 값을 구한 것은? [5.3점]
원본 보기: ["$12$","$13$","$14$","$15$","$16$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $P$는 원점에서 출발하므로 $x_P(t)=\displaystyle\int_0^t(20s-9s^2)\,ds$ $=\left[10s^2-3s^3\right]_0^t=10t^2-3t^3$이다.
> $p^2=16$이므로 정답은 ⑤이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 위치 적분 $x_P=10t^2-3t^3$, $x_Q=8+kt$의 만남 조건을 $k=10t-3t^2-8/t$로 바꾼다. $t>0$에서 $K'$가 2를 경계로 양·음이라 최댓값 4, 제곱 16이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q16 — KEEP

- source ordinal: 16; id: `16`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
최고차항의 계수가 $1$인 사차함수 $f(x)$와 $x\ge0$에서 정의된 함수 $g(x)=\displaystyle\int_{-x}^{2x}\{f(t)-|f(t)|\}dt$가 다음 조건을 만족시킨다.<div class="question-note-box">(가) $f(0)=f'(0)=0$<br>(나) $0\lt x\lt 2$과 $x\gt 5$에서 $g(x)$는 상수함수이다.<br>(다) $2\lt x\lt 5$에서 $g(x)$는 감소함수이다.</div>이때, $f(1)$의 값을 구하시오. (단, $f(x)=0$의 모든 실근은 음이 아닌 실수이다.) [5.4점]
원본 보기: ["$23$","$25$","$27$","$29$","$31$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $H(t)=f(t)-|f(t)|$라 두면 $f(t)\ge0$일 때 $H(t)=0$이고, $f(t)<0$일 때 $H(t)=2f(t)<0$이다.
> 따라서 $f(1)=1^2(1-4)(1-10)$ $=(-3)(-9)=27$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $g'=(xf)'$를 써 $g=\int_0^{2x}(f-|f|)$로 축약하고, 상수·감소 구간의 경계 $t=4,10$에서 $f$의 영점을 얻는다. $f=x^2(x-4)(x-10)$을 대입하면 $f(1)=27$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q17 — KEEP

- source ordinal: 17; id: `17`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
[서답형 1번] 함수 $f(x)=x^3+ax^2+bx-4$가 $x=1$에서 극댓값 $0$을 가진다. 이때, 상수 $a$, $b$와 함수 $f(x)$의 극솟값 $m$에 대하여 $a+b+m$의 값을 구하시오. [4점]
원본 보기: []
```

- 원본 정답: `$-1$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $x=1$에서 극댓값이 $0$이므로 $f(1)=0,\qquad f'(1)=0$이다.
> 그러므로 $a+b+m=3-4=-1$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f(1)=f'(1)=0$에서 $a+b=3, a=-6, b=9$를 얻는다. $f'=3(x-1)(x-3)$의 부호로 $m=f(3)=-4$, 합 -1을 확인했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- source ordinal: 18; id: `18`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
[서답형 2번] 다항함수 $f(x)$가 임의의 실수 $x$에 대하여 $\displaystyle\int_2^x(x-t)f(t)dt=x^3+ax^2+b$를 만족시킬 때, $a+b$의 값을 구하시오. [5점]
원본 보기: []
```

- 원본 정답: `$1$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 원래 식에 $x=2$를 대입하면 왼쪽 정적분은 $0$이다.
> 따라서 $a+b=-3+4=1$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $x=2$에서 적분의 값이 0으로 $8+4a+b=0$이고, 한 번 미분한 식에 다시 $x=2$ 대입해 $12+4a=0$이다. $a=-3,b=4$의 합은 1이다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q19 — KEEP

- source ordinal: 19; id: `19`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
[서답형 3번] 최고차항의 계수가 $1$인 삼차함수 $f(x)$와 실수 $t$에 대하여 함수 $g(x)=\begin{cases}f(x)&(x\le t)\\-f(x)&(x\gt t)\end{cases}$는 실수 전체의 집합에서 연속이고 다음 조건을 만족한다.<div class="question-note-box">(가) $g(x)$는 서로 다른 세 점 $(\alpha,g(\alpha))$, $(\beta,g(\beta))$, $(\gamma,g(\gamma))$에서 극값을 가진다. (단, $\alpha\lt \beta$)<br>(나) $g(\gamma)=-20$이고, $g(\alpha)+g(\beta)+g(\gamma)=-20$이다.</div>이때, $2(\beta-\alpha)^3$의 값을 구하시오. [6점]
원본 보기: []
```

- 원본 정답: `$270$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $g$가 $x=t$에서 연속이므로 $f(t)=-f(t)$, 따라서 $f(t)=g(t)=0$이다.
> 따라서 $2(\beta-\alpha)^3=2d^3=270$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $g(t)=0$에서 $f(t)=0$이고 나머지 극값은 이차 도함수의 두 영점이 된다. 이중근·단순근의 두 배치를 검토하면 $\gamma$에서 $-4d^3/27=-20$이 공통이며 $2d^3=270$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q20 — KEEP

- source ordinal: 20; id: `20`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
[서답형 4번] 원점에서 출발하여 수직선 위를 움직이는 점 P의 시각 $t$에서의 위치 $x$가 $x=3t^3-\dfrac{27}{2}t^2+18t$이다. 점 P가 $x=a$, $x=b$에서 운동방향을 바꾼다고 할 때, $a+b$의 값을 구하고 그 과정을 서술하시오. (단, $a\ne b$이다.) [5점]
원본 보기: []
```

- 원본 정답: `$\dfrac{27}{2}$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 위치: $x(t)=3t^3-\dfrac{27}{2}t^2+18t$ 속도: $v(t)=x'(t)=9t^2-27t+18$ $=9(t-1)(t-2)$이다.
> 그러므로 $\{a,b\}=\{\dfrac{15}{2},6\}$이고 $a+b=\dfrac{15}{2}+6=\dfrac{27}{2}$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 속도 $9(t-1)(t-2)$가 시각 1과 2에서 부호를 바꾼다. 위치 $x(1)=15/2$, $x(2)=6$을 별도로 대입해 합 $27/2$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q21 — KEEP

- source ordinal: 21; id: `21`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
[서답형 5번] 삼차함수 $f(x)$와 두 다항함수 $g(x)=x^3+3x+3$, $h(x)=x^2+1$에 대하여 두 삼차함수 $f(x)-g(x)$와 $f(x)-h(x)$가 모두 극값을 갖지 않는다. $f'(-1)=6$일 때, $f'(2)$의 최솟값을 구하고, 그 과정을 서술하시오. [7점]
원본 보기: []
```

- 원본 정답: `$6$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=ax^3+bx^2+cx+d$ $(a\ne0)$로 둔다.
> $\min f'(2)=27\cdot\dfrac23-12=6$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f-g$ 및 $f-h$의 도함수 판별식 조건에서 $b=3a-3,c=3a,a\ge2/3$이 나온다. $f'(2)=27a-12$이므로 하한 $6$이 $a=2/3$에서 달성된다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q22 — KEEP

- source ordinal: 22; id: `22`; sourceIdentityKey: `NOT_PRESENT`; source blob: `e9284b08323fda37dea29e82595c3b0557b4aa31`.
- 원본 문제 조건·보기(원문 보존):

```text
[서답형 6번] 최고차항의 계수가 $1$인 삼차함수 $f(x)$에 대하여 두 함수 $f(x)$, $g(x)$는 다음 조건을 만족시킨다.<div class="question-note-box">(가) 함수 $f(x)$는 $x=2$에서 극솟값 $0$을 갖는다.<br>(나) $g'(x)=f(x)+(x-2)f'(x)$<br>(다) 함수 $g(x)$는 $x=\dfrac12$일 때, 최솟값 $-\dfrac{21}{16}$을 갖는다.</div>이때, $f(1)+g(1)$의 값을 구하고, 그 과정을 서술하시오. [8점]
원본 보기: []
```

- 원본 정답: `$\dfrac{3}{8}$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f$는 최고차항의 계수가 $1$인 삼차함수이며 $f(2)=0,\qquad f'(2)=0$이므로 $f(x)=(x-2)^2(x-a)$로 놓는다.
> 따라서 $f(1)+g(1)=1-\dfrac58=\dfrac38$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f(2)=f'(2)=0$에서 $(x-2)^2$을 인수로 두고, $g'=[(x-2)f]'$로 적분한다. $g'(1/2)=0$에서 $a=0$, 최소값 조건에서 $C=3/8$을 얻고 $f(1)+g(1)=3/8$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## 요약 및 후속 게이트

- 22 = KEEP 20 + UPGRADE 1 + HOLD 1 + UNREAD 0.
- 완성 대체 풀이 qid: Q7. HOLD qid: Q10.
- 원본 JS·content/choices/answer/solutionImage·SVG/main은 수정하지 않았음. 원본 문제 그림은 시각 미검수이며 신규 SVG 생성·출고 없음.
- 다음 체크: HOLD의 원문·그림 근거 보완, 학생용 변경 해설의 독립 수학·교육과정/Golden/Negative·문법/diff·실제 exam/sol/ans 렌더 테스트. 모두 NOT_RUN이므로 운영 PASS 아님.
