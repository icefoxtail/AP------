# 미적분Ⅰ(구 수학Ⅱ) 심층 감사 — 25_매산여고_2학기_기말_고2_수학II

- 자료: 2025년 고2 2학기 기말 기출, `수학II` (교육과정 표기: `NOT_PRESENT`).
- 원본 JS: `archive/exams/original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js`; source ref `main`, blob `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 문항 분모: **23**; 판정 **KEEP 21 / UPGRADE 1 / HOLD 1 / UNREAD 0**.
- 저장: `work/solution-upgrade-lane-10-20261121`의 `docs/operations/solution-upgrade-reservations/staged/calculus1/25_매산여고_2학기_기말_고2_수학II_DEEP_AUDIT.md`. 동일 경로 파일 기존 없음 확인; 다른 브랜치의 중복 감사 문서는 NOT_CHECKED.
- 읽은 기준: 2026-11-21 `HARNESS_CURRENT.md`, `DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`, `BOARD_SOLUTION_SAMPLES_CURRENT.md`, `docs-manifest.json`의 core 문서 본문. 자동 preflight/문서 SHA-256 receipt·Golden/Negative 독립 검수: **NOT_RUN**. 운영 JS·정답·보기·SVG 수정 없음.
- 현재 단계: **EXAM_AUDIT_COMPLETE(전 문항 원문·해설 근거와 판정 수록)** / **EXAM_DRAFT_COMPLETE(UPGRADE 전체 수정 풀이 수록)** / **RELEASE_QA_NOT_RUN**. 남은 qid 판정 없음; HOLD는 후속 해결 필요.

## Q01 — KEEP

- source ordinal: 1; id: `1`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=ax^2+bx$에 대하여 <br>$f(1)=5$, $f'(-1)=2$일 때, 상수 $a$, $b$에 대하여 $ab$의 값은? [3.5점]
원본 보기: ["$2$","$4$","$6$","$8$","$9$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=ax^2+bx$에서 $f'(x)=2ax+b$이다.
> 따라서 $b=5-1=4$이고 $ab=1\cdot4=4$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f(1)=a+b=5$와 $f'(-1)=-2a+b=2$를 풀면 $a=1,b=4$이고 곱 4다. 두 조건에 역대입해 일치한다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- source ordinal: 2; id: `2`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
정적분 $\displaystyle\int_0^2\left(\dfrac{1}{2}x-5\right)dx$의 값은? [3.5점]
원본 보기: ["$-3$","$-5$","$-6$","$-9$","$-10$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 각 항을 적분하면 원시함수는 $\displaystyle\int\left(\dfrac12x-5\right)dx=\dfrac14x^2-5x+C$이다.
> 따라서 정적분은 $\displaystyle\int_0^2\left(\dfrac12x-5\right)dx$ $=\left[\dfrac14x^2-5x\right]_0^2$ $=\left(\dfrac14\cdot 2^2-5\cdot2\right)-\left(0-0\right)$ $=1-10=-9$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $\int_0^2(x/2-5)dx=[x^2/4-5x]_0^2=1-10=-9$로 끝점 계산이 정확히 쓰였다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- source ordinal: 3; id: `3`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
곡선 $y=x^2-4x+3$과 $x$축으로 둘러싸인 도형의 넓이는? [3.6점]
원본 보기: ["$\\dfrac{4}{3}$","$\\dfrac{3}{2}$","$\\dfrac{5}{3}$","$\\dfrac{11}{6}$","$2$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $x^2-4x+3=(x-1)(x-3)=0$ $x=1,\ 3$이다.
> 따라서 둘러싸인 부분의 넓이 $S$는 $S=-\displaystyle\int_1^3(x^2-4x+3)dx$ $=-\left[\dfrac13x^3-2x^2+3x\right]_1^3$ $=-\left\{(9-18+9)-\left(\dfrac13-2+3\right)\right\}$ $=-\left(0-\dfrac43\right)=\dfrac43$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 영점 $x=1,3$ 사이에서 $(x-1)(x-3)<0$이므로 넓이를 음의 정적분으로 바꾼다. 값 $4/3$을 확인했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- source ordinal: 4; id: `4`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
수직선 위를 움직이는 점 $P$의 시각 $t$에서의 위치 $x$가 <br>$x=-t^3+3t^2+9t-10$일 때, 점 $P$의 속도가 $0$이 되는 순간의 가속도는? [3.6점]
원본 보기: ["$-4$","$-6$","$-8$","$-10$","$-12$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $x(t)=-t^3+3t^2+9t-10$ $v(t)=x'(t)=-3t^2+6t+9$ $=-3(t-3)(t+1)$이다.
> 따라서 $a(3)=-6\cdot3+6=-12$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $v=-3(t-3)(t+1)$의 영점 중 음수 시간 -1을 버리고 $t=3$을 취한다. 가속도 $v'(3)=-12$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- source ordinal: 5; id: `5`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
다항함수 $f(x)$에 대하여 함수 $g(x)$를 $g(x)=(x^2-5x+2)f(x)$라 하자. 곡선 $y=f(x)$ 위의 점 $(1,2)$에서 접선의 방정식이 $y=-2x+4$일 때, $g'(1)$의 값은? [3.7점]
원본 보기: ["$-5$","$-4$","$-3$","$-2$","$-1$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 접점 $(1,2)$가 $y=f(x)$ 위에 있으므로 $f(1)=2$이다.
> $x=1$을 대입하여 $g'(1)=(2-5)\cdot2+(1-5+2)\cdot(-2)$ $=(-3)\cdot2+(-2)\cdot(-2)$ $=-6+4=-2$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 접점에서 $f(1)=2,f'(1)=-2$를 얻고 곱의 미분을 적용한다. $g'(1)=(-3)2+(-2)(-2)=-2$를 확인했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- source ordinal: 6; id: `6`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
곡선 $y=x^3+1$과 이 곡선 위의 점 $(1,2)$에서 접하는 접선으로 둘러싸인 도형의 넓이는? [3.7점]
원본 보기: ["$\\dfrac{27}{4}$","$\\dfrac{29}{4}$","$\\dfrac{28}{3}$","$\\dfrac{37}{4}$","$\\dfrac{29}{5}$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=x^3+1$이면 $f'(x)=3x^2$이다.
> 구하는 넓이는 $S=\displaystyle\int_{-2}^{1}(x^3-3x+2)dx$ $=\left[\dfrac14x^4-\dfrac32x^2+2x\right]_{-2}^{1}$ $=\left(\dfrac14-\dfrac32+2\right)-\left(4-6-4\right)$ $=\dfrac34+6=\dfrac{27}{4}$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 곡선−접선이 $(x-1)^2(x+2)$라서 구간 $[-2,1]$에서 음수가 아니다. 정적분 $\int_{-2}^1(x^3-3x+2)dx=27/4$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q07 — KEEP

- source ordinal: 7; id: `7`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
다항함수 $f(x)$, $g(x)$에 대하여 $\displaystyle\lim_{x\to3}\dfrac{f(x)-2}{x-3}=1$, $\displaystyle\lim_{x\to3}\dfrac{g(x)-1}{x-3}=2$일 때, 함수 $f(x)g(x)$의 $x=3$에서의 미분계수는? [3.8점]
원본 보기: ["$1$","$3$","$5$","$8$","$12$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 다항함수는 연속이므로 첫 번째 극한이 유한하려면 $f(3)=2$이다.
> $x=3$을 대입하여 $(fg)'(3)=1\cdot1+2\cdot2$ $=1+4=5$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 두 극한에서 $f(3)=2,f'(3)=1,g(3)=1,g'(3)=2$를 얻는다. 곱 미분값 $1\cdot1+2\cdot2=5$다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q08 — KEEP

- source ordinal: 8; id: `8`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=x^3-(a+3)x^2+2ax$에 대하여 <br>곡선 $y=f(x)$ 위의 점 $(t,f(t))$에서의 접선의 $y$절편을 $g(t)$라 하자. 함수 $g(t)$가 열린 구간 $(0,6)$에서 증가할 때, $a$의 최솟값은? (단, $a$는 상수이다.) [3.8점]
원본 보기: ["$14$","$15$","$16$","$17$","$18$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 접점 $(t,f(t))$에서의 접선은 $y-f(t)=f'(t)(x-t)$이다.
> $a=15$이면 $g'(t)=6t(6-t)>0\quad(0<t<6)$이므로 실제로 증가한다.
- 해설 경로·판정 이유·원본 값 대입 검산: 절편 $g(t)=f(t)-tf'(t)=-2t^3+(a+3)t^2$의 도함수는 $2t(a+3-3t)$이다. 열린구간 전체 증가 조건 $a\ge15$와 끝값 허용을 확인한다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q09 — KEEP

- source ordinal: 9; id: `9`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=2x^3+ax^2+bx+3$은 $x=-1$에서 극대이고, $x=4$에서 극소이다. 함수 $f(x)$의 극댓값은? (단, $a$, $b$는 상수이다.) [3.9점]
원본 보기: ["$16$","$17$","$18$","$19$","$20$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 극대가 $x=-1$, 극소가 $x=4$에서 생기므로 $f'(-1)=f'(4)=0$이다.
> 극댓값은 $f(-1)=2(-1)^3-9(-1)^2-24(-1)+3$ $=-2-9+24+3=16$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 극대·극소의 위치 -1,4가 $f'=6(x+1)(x-4)$를 결정한다. $a=-9,b=-24$를 대입하면 극댓값 $f(-1)=16$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q10 — KEEP

- source ordinal: 10; id: `10`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
$f(x)=x^4-x^2+2$일 때, $\displaystyle\lim_{x\to2}\dfrac{1}{x-2}\int_2^x f(t)dt$의 값은? [3.9점]
원본 보기: ["$2$","$4$","$6$","$10$","$14$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 적분으로 정의된 함수를 $F(x)=\displaystyle\int_2^x f(t)dt$라 두자.
> 따라서 극한값은 $F'(2)=f(2)$ $=2^4-2^2+2$ $=16-4+2=14$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f$가 다항식이라 $F=\int_2^x f$의 미분은 $f$다. 주어진 극한을 $F'(2)=f(2)=14$로 바꾸는 이유가 설명돼 있다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q11 — KEEP

- source ordinal: 11; id: `11`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
$f(x)=3x^4-8x^3-3(a-4)x^2$이 극값을 하나만 갖도록 하는 모든 자연수 $a$의 값의 합은? [3.9점]
원본 보기: ["$1$","$3$","$5$","$7$","$15$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f'(x)=12x^3-24x^2-6(a-4)x$ $=6x\{2(x-1)^2+2-a\}$이다.
> 따라서 가능한 자연수는 $1,2,4$이고 $1+2+4=7$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'=6x\{2(x-1)^2+2-a\}$에서 a=1,2이면 0에서만 부호가 바뀌고 a=4이면 2에서만 바뀐다. a>2, a≠4에서 세 단순근이므로 합 1+2+4=7이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q12 — UPGRADE

- source ordinal: 12; id: `12`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
두 다항함수 $f(x)$, $g(x)$가<br>$\dfrac{d}{dx}\{f(x)+g(x)\}=2x+5$<br>$\dfrac{d}{dx}\{f(x)g(x)\}=3x^2+12x-1$<br>을 만족시키고 $f(0)=2$, $g(0)=-9$일 때, $f(-5)+g(1)$의 값은? [4.0점]
원본 보기: ["$-9$","$-8$","$-7$","$-6$","$-5$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $S(x)=f(x)+g(x)$, $P(x)=f(x)g(x)$라 두자.
> 따라서 $f(-5)=-5+2=-3$ $g(1)=1+4-9=-4$ $f(-5)+g(1)=-7$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $S=f+g$, $P=fg$의 원시함수는 주어졌으나 $\{f-g\}^2=S^2-4P=(x^2+3x-11)^2$로 갑자기 넘어간다. 이 항등식과 부호 선택을 줄마다 보여 주는 대체 풀이가 필요하다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: DRAFT_STAGED / RELEASE_QA_NOT_RUN.

### 대체 학생용 solution 전체 (복사 가능한 수정 초안)

두 다항함수의 합과 곱을 각각
$$S(x)=f(x)+g(x),\qquad P(x)=f(x)g(x)$$
로 놓는다. 미분 결과와 초기값을 적용하면
$$
\begin{aligned}
S'(x)&=2x+5,&S(0)&=2+(-9)=-7,\\
P'(x)&=3x^2+12x-1,&P(0)&=2(-9)=-18.
\end{aligned}
$$
따라서
$$
\begin{aligned}
S(x)&=x^2+5x-7,\\
P(x)&=x^3+6x^2-x-18.
\end{aligned}
$$

합과 곱을 알면 차의 제곱도 알 수 있다.
$$
\begin{aligned}
(f-g)^2&=(f+g)^2-4fg\\
&=(x^2+5x-7)^2-4(x^3+6x^2-x-18)\\
&=[x^4+10x^3+11x^2-70x+49]\\
&\quad-[4x^3+24x^2-4x-72]\\
&=x^4+6x^3-13x^2-66x+121\\
&=(x^2+3x-11)^2.
\end{aligned}
$$
다항식의 곱이 영다항식이면 두 인수 중 적어도 하나가 영다항식이므로, 모든 실수 $x$에서
$$f(x)-g(x)=x^2+3x-11$$
이거나
$$f(x)-g(x)=-(x^2+3x-11)$$
이어야 한다. $x=0$에서 실제 차는
$$f(0)-g(0)=2-(-9)=11$$
이므로 뒤의 경우가 맞는다.
$$f(x)-g(x)=-x^2-3x+11.$$

이제 합과 차를 이용해 각각 구한다.
$$
\begin{aligned}
2f(x)&=(f+g)+(f-g)\\
&=(x^2+5x-7)+(-x^2-3x+11)\\
&=2x+4,\\
f(x)&=x+2,\\
g(x)&=(f+g)-f\\
&=x^2+5x-7-(x+2)\\
&=x^2+4x-9.
\end{aligned}
$$
따라서
$$
\begin{aligned}
f(-5)+g(1)&=(-5+2)+(1+4-9)\\
&=-3-4\\
&=\boxed{-7}.
\end{aligned}
$$
정답은 ③이다.

**독립 검산:** $f(0)=2$, $g(0)=-9$이고, $(f+g)'=2x+5$다. 또 $fg=(x+2)(x^2+4x-9)=x^3+6x^2-x-18$이므로 $(fg)'=3x^2+12x-1$과도 일치한다.

## Q13 — KEEP

- source ordinal: 13; id: `13`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
좌표가 $1$인 점을 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$ $(t\ge0)$에서의 속도 $v(t)=t^2-6t$일 때, 시각 $t=3$에서의 점 $P$의 수직선 위의 위치는? [4.0점]
원본 보기: ["$-15$","$-16$","$-17$","$-18$","$-19$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 점 $P$의 위치를 $x(t)$라 하면 $x(0)=1$이고 $x'(t)=v(t)=t^2-6t$이다.
> 처음 위치에 변화량을 더하면 $x(3)=1+(-18)=-17$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 초기 위치 1에 변위 $\int_0^3(t^2-6t)dt=-18$을 더하면 위치는 -17이다. 움직인 거리와 위치를 혼동하지 않는다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q14 — KEEP

- source ordinal: 14; id: `14`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
수직선 위를 움직이는 점 $P$의 시각 $t$ $(t\ge0)$에서의 속도 $v(t)$가 $v(t)=-2t+6$이다. $t=0$부터 $t=6$까지 점 $P$가 움직인 거리는? [4.1점]
원본 보기: ["$17$","$18$","$19$","$20$","$21$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $v(t)=-2t+6=0$에서 $t=3$이다.
> 따라서 총 이동거리는 $9+9=18$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $v=-2t+6$이 $t=3$에서 부호가 바뀌므로 $\int_0^3v+\int_3^6(-v)=9+9=18$이다. 단순 변위 0과 구분했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q15 — KEEP

- source ordinal: 15; id: `15`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
다항함수 $f(x)$가 모든 실수 $x$에 대하여 <br>$\displaystyle\int_1^x f(t)dt=(x+1)f(x)+\dfrac{2}{3}x^3-2x+a$를 만족시키고, $f(0)=0$일 때, 상수 $a$의 값은? [4.2점]
원본 보기: ["$-\\dfrac{2}{3}$","$-\\dfrac{4}{3}$","$-\\dfrac{5}{3}$","$-\\dfrac{7}{3}$","$-\\dfrac{10}{3}$"]
```

- 원본 정답: `①`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 따라서 $f(x)=f(x)+(x+1)f'(x)+2x^2-2$ $(x+1)f'(x)=2-2x^2$ $=-2(x-1)(x+1)$이다.
> 처음 등식에 $x=0$을 대입하면 $\displaystyle\int_1^0 f(t)dt=f(0)+a$에서 $a=\displaystyle\int_1^0(-t^2+2t)dt$ $=\left[-\dfrac13t^3+t^2\right]_1^0$ $=0-\left(-\dfrac13+1\right)$ $=-\dfrac23$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 미분한 항등식 $(x+1)f'(x)=2-2x^2$에서 다항식 등식으로 $f'=-2x+2$를 얻는다. $f(0)=0$을 반영하고 원식 $x=0$ 대입으로 $a=-2/3$을 역검산한다.
- 그림·추가 확인: 원본 문제 조건 텍스트로 계산 경로 확인. 학생 화면 렌더는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q16 — KEEP

- source ordinal: 16; id: `16`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
최고차항의 계수가 $1$인 삼차함수 $f(x)$가 다음 조건을 모두 만족시킬 때, $f(-1)$의 값은? [4.4점]<br><div class="question-note-box">&lt;조 건&gt;<br>(가) 함수 $f(x)$는 $x=0$에서 극댓값 $30$을 갖는다.<br>(나) 방정식 $|f(x)|=2$의 서로 다른 실근의 개수가 $5$이다.</div>
원본 보기: ["$20$","$21$","$22$","$23$","$25$"]
```

- 원본 정답: `④`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 삼차함수의 최고차항 계수가 $1$이고 $x=0$에서 극댓값이 $30$이므로 $f(x)=x^3+px^2+30$으로 둘 수 있다.
> 이제 $f(-1)=(-1)^3-6(-1)^2+30$ $=-1-6+30=23$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $f'(0)=0$과 극댓값 30으로 $f=x^3+px^2+30$, 극솟값 $m=30-c^3/2$다. 두 수평선 $y=\pm2$의 교점 합 5 조건은 $m=-2$라서 $c=4,p=-6,f(-1)=23$이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q17 — KEEP

- source ordinal: 17; id: `17`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
최고차항의 계수가 $1$인 이차함수 $f(x)$가 $f(5)=0$이고, $\displaystyle\int_2^{2025}f(x)dx=\int_5^{2025}f(x)dx$를 만족시킨다. 곡선 $y=f(x)$와 $x$축으로 둘러싸인 부분의 넓이는? [4.4점]
원본 보기: ["$\\dfrac{2}{3}$","$\\dfrac{5}{6}$","$1$","$\\dfrac{7}{6}$","$\\dfrac{4}{3}$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 두 정적분의 상한이 같으므로 $\displaystyle\int_2^{2025}f(x)dx-\int_5^{2025}f(x)dx=\int_2^5f(x)dx=0$이다.
> $3<x<5$에서는 $f(x)<0$이므로 둘러싸인 넓이는 $S=-\displaystyle\int_3^5(x^2-8x+15)dx$ $=-\left[\dfrac13x^3-4x^2+15x\right]_3^5$ $=-\left(\dfrac{50}{3}-18\right)$ $=\dfrac43$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $\int_2^{2025}f=\int_5^{2025}f$에서 $\int_2^5f=0$을 얻고, $f=(x-5)(x-r)$의 계수를 풀면 $r=3$이다. 두 영점 사이 음수인 부분 넓이 $4/3$을 확인했다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- source ordinal: 18; id: `18`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
함수 $f(x)=2x^3-6x^2+3$에 대하여 이 곡선 $y=f(x)$ 위의 점 $A(0,3)$에서의 접선을 $l$이라 할 때, 직선 $l$이 곡선과 제 $1$사분면에서 만나는 점을 $B$라 하자. 곡선을 따라 두 점 $A$, $B$ 사이를 움직이는 점 $P$에서 직선 $l$에 내린 수선의 발을 $H$라 할 때, 삼각형 $APH$의 넓이가 최대가 되는 점 $P$의 $x$좌표는? [4.6점]
원본 보기: ["$\\dfrac{7}{4}$","$3$","$\\dfrac{9}{4}$","$\\dfrac{5}{2}$","$\\dfrac{11}{4}$"]
```

- 원본 정답: `③`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)=2x^3-6x^2+3$이므로 $f'(x)=6x^2-12x$이다.
> 또 양 끝에서 넓이는 $0$이므로 $x=\dfrac94$에서 최대가 된다.
- 해설 경로·판정 이유·원본 값 대입 검산: 점 A의 접선은 $y=3$, 다른 교점 B는 $(3,3)$이다. $S(x)=x(3-f(x))/2=3x^3-x^4$의 도함수로 $x=9/4$가 내부 최대임을 확인한다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q19 — KEEP

- source ordinal: 19; id: `19`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
모든 실수 $x$, $y$에 대하여 다항함수 $f(x)$가 $f(x+y)=f(x)+f(y)-6xy$를 만족시킨다.<br>함수 $F(x)$가 $F(x)=\displaystyle\int(x-2)f'(x)dx$이고 함수 $F(x)$의 극값이 존재하지 않을 때, $f(5)$의 값은? [4.7점]
원본 보기: ["$-6$","$-8$","$-10$","$-12$","$-15$"]
```

- 원본 정답: `⑤`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> 먼저 $y=0$을 대입하면 $f(x)=f(x)+f(0)$이므로 $f(0)=0$이다.
> 따라서 $f(5)=12\cdot5-3\cdot25$ $=60-75=-15$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 함수방정식을 미분하면 $f'(x)=c-6x$이고 $F'=(x-2)(c-6x)$다. 서로 다른 영점이면 극값이 생기므로 $c=12$로 중근을 만들어 $f(5)=-15$다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q20 — KEEP

- source ordinal: 20; id: `20`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
실수 $m$에 대하여 수직선 위를 움직이는 두 점 $P$, $Q$의 시각 $t$ $(t\ge0)$에서의 속도를 각각 $v_1=\dfrac{3}{4}t^2+1$, $v_2=mt-4$라 하자. 시각 $t=0$에서 $t=2$까지 두 점 $P$, $Q$가 움직인 거리가 같도록 하는 모든 $m$값의 합은? [4.7점]
원본 보기: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `②`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $P$의 속도는 $v_1(t)=\dfrac34t^2+1>0$이므로 이동거리는 $\displaystyle\int_0^2\left(\dfrac34t^2+1\right)dt$ $=\left[\dfrac14t^3+t\right]_0^2$ $=2+2=4$이다.
> $m>2$를 만족하는 해는 $m=4$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 두 속도의 절댓값 적분으로 P는 거리 4이다. Q는 $m\le2$에서 거리 $8-2m$, $m>2$에서 $2m-8+16/m$이며 두 경우 해 2,4의 합 6이다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q21 — KEEP

- source ordinal: 21; id: `21`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
[주관식1 (서술형)] [6점](부분점수 있음)<br>삼차함수 $f(x)=x^3-3x+a$에 대하여 함수 <br>$F(x)=\displaystyle\int_0^x f(t)dt$가 오직 하나의 극값을 갖도록 양수 $a$의 최솟값을 구하는 과정을 서술하시오.
원본 보기: []
```

- 원본 정답: `$2$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $F(x)=\displaystyle\int_0^xf(t)dt$이므로 $F'(x)=f(x)=x^3-3x+a$이다.
> $a>2$이면 $f(1)=a-2>0$이고 극솟값도 양수이므로 $f(x)=0$의 실근은 하나이며 그 근에서만 $F'$의 부호가 바뀐다.
- 해설 경로·판정 이유·원본 값 대입 검산: $F'=x^3-3x+a$의 근 부호 변화를 극값으로 연결한다. a=2에서 $(x-1)^2(x+2)$의 이중근은 극값이 아니고 -2에서만 부호 변화하여 최소 a=2다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q22 — HOLD

- source ordinal: 22; id: `22`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
[주관식2 (서술형)] [7점](부분점수 있음)<br>함수 $f(x)=\dfrac{1}{2}x^3-3x^2+\dfrac{15}{2}x$에 대하여 $x$에 대한 방정식 $f(x)+|f(x)+x|=7x+k$의 서로 다른 실근의 개수가 $4$가 되도록 하는 실수 $k$의 범위를 구하는 과정을 그래프를 그려서 서술하시오.
원본 보기: []
```

- 원본 정답: `$0\lt k\lt 4$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $f(x)+x=\dfrac12x^3-3x^2+\dfrac{17}{2}x$ $=\dfrac12x\{(x-3)^2+8\}$이다.
> 음의 구간의 해 수까지 더하면 $k<0$일 때 총 $0$개, $k=0$일 때 총 $2$개, $0<k<4$일 때 $3+1=4$개, $k=4$일 때 $2+1=3$개, $k>4$일 때 $1+1=2$개이다.
- 해설 경로·판정 이유·원본 값 대입 검산: 음의 구간은 $x=-k/8$, 양의 구간은 $\phi(x)=x(x-3)^2=k$로 분리한다. $0<k<4$에서 합계 4근이라는 대수 판정은 맞으나 발문이 그래프를 그려서 서술하라 하고 실제 해설 그림이 없다. SVG 엔진 인계/실제 렌더 후 출고해야 하므로 VISUAL_HOLD.
- 그림·추가 확인: SVG_REQUEST / VISUAL_HOLD: 발문에서 그래프를 요구하나 학생용 완성 그래프의 엔진 산출·렌더가 없음. 원본 조건에 따른 그래프 사실만 인계, 직접 SVG 제작 금지.
- 상태: VISUAL_HOLD.

## Q23 — KEEP

- source ordinal: 23; id: `23`; sourceIdentityKey: `NOT_PRESENT`; source blob: `6de6dceb1d99322d9bff224bf1a4e014e3ce02ff`.
- 원본 문제 조건·보기(원문 보존):

```text
[주관식3 (서술형)] [7점](부분점수 있음)<br>실수 $a$ $(a\gt1)$에 대하여 함수 $f(x)$를 $f(x)=(x+1)(x-1)(x-a)$라 하자. 함수 $g(x)=x^2\displaystyle\int_0^x f(t)dt-\int_0^x t^2f(t)dt$가 오직 하나의 극값을 갖도록 하는 $a$의 최댓값을 $k$라고 할 때, 함수 $h(x)=(x+1)(x-1)(x-k)$의 그래프와 $x$축으로 둘러싸인 도형의 넓이를 구하는 과정을 서술하시오.
원본 보기: []
```

- 원본 정답: `$2\sqrt{6}-\dfrac{1}{4}$`.
- 기존 solution에서 확인한 실제 핵심 문장/식 (1~2곳):
> $I(x)=\displaystyle\int_0^xf(t)dt$라 놓으면 $g(x)=x^2I(x)-\displaystyle\int_0^xt^2f(t)dt$이다.
> 따라서 전체 넓이는 $S_1+S_2=\dfrac{4\sqrt6}{3}+\dfrac{2\sqrt6}{3}-\dfrac14$ $=2\sqrt6-\dfrac14$이다.
- 해설 경로·판정 이유·원본 값 대입 검산: $I=\int_0^x f$로 놓으면 $g'=2xI$, $I(a)=a^2(6-a^2)/12$에서 한 극값 조건의 최대 $a=\sqrt6$이 된다. 영점 $-1,1,\sqrt6$에서 넓이의 부호 구간을 나누며 결과 $2\sqrt6-1/4$와 일치한다.
- 그림·추가 확인: 원본 solutionImage 링크가 있으나 SVG 렌더/학생 화면 독립 검사는 NOT_RUN.
- 상태: READ_EVIDENCED / RELEASE_QA_NOT_RUN.

## 요약 및 후속 게이트

- 23 = KEEP 21 + UPGRADE 1 + HOLD 1 + UNREAD 0.
- 완성 대체 풀이 qid: Q12. HOLD qid: Q22.
- 원본 JS·content/choices/answer/solutionImage·SVG/main은 수정하지 않았음. 원본 문제 그림은 시각 미검수이며 신규 SVG 생성·출고 없음.
- 다음 체크: HOLD의 원문·그림 근거 보완, 학생용 변경 해설의 독립 수학·교육과정/Golden/Negative·문법/diff·실제 exam/sol/ans 렌더 테스트. 모두 NOT_RUN이므로 운영 PASS 아님.
